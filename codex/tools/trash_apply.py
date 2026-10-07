# trash_apply.py v1.0 — 도감 쓰레기통 비우기 (민수가 도감에서 🗑 누른 것을 Claude 가 다음 턴에 실제로 지움)
#  쓰는 법
#   1) Claude 가 도감 저장소 (marks) 를 내려받음: ArtifactData list marks → out_dir 에 문서마다 json
#   2) python3 tools/trash_apply.py <그 폴더 또는 marks 한 덩어리 json>
#      · 삭제 표시 (체크 + 메모가 '삭제' 로 시작) 된 그림 번호 → trash.json 'ids' 에 더함
#      · 삭제 표시된 인물 (C-…) → trash.json 'cids' 에 더함 (그 인물 그림 전부)
#      · catalog.js 에서 trash.json 에 든 것을 모두 뺌 (예전 것도 다시 — 다른 도구가 되살려도 지워짐)
#      · 저장소에서 지울 문서 번호를 trash_out.json 에 적음 → Claude 가 ArtifactData batch delete
#   3) 인자 없이 돌리면 trash.json 만 다시 적용 (파이프라인 맨 끝: h2_poses → h3_extra → faction_heroes → renames → trash_apply → pack · hipack)
#  지운 기록 (이름 · 묶음 · 그림 경로 · 지운 날) 은 trash.json 에 남음. 그림 파일과 예전 catalog 는 backup/ 과 git 에 그대로 → 되살릴 수 있음
import os, sys, json, glob, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'catalog.js'); T = os.path.join(ROOT, 'trash.json'); OUT = os.path.join(ROOT, 'tools', 'trash_out.json')
s = open(P, encoding='utf-8').read(); key = 'const CATALOG = '
head = s[:s.index(key) + len(key)]; cat = json.loads(s[len(head):].strip().rstrip(';'))
trash = json.load(open(T, encoding='utf-8')) if os.path.exists(T) else {'ids': {}, 'cids': {}}
today = datetime.date.today().isoformat()
by_id = {e['id']: e for e in cat}
cids = {}
for e in cat:
    if e.get('cid'): cids.setdefault(e['cid'], e)
clear = []
if len(sys.argv) > 1:
    src = sys.argv[1]; marks = {}
    if os.path.isdir(src):
        for f in glob.glob(os.path.join(src, '**', '*.json'), recursive=True): marks[os.path.basename(f)[:-5]] = json.load(open(f, encoding='utf-8'))
    else: marks = json.load(open(src, encoding='utf-8'))
    isdel = lambda m: bool(m.get('checked')) and str(m.get('memo') or '').startswith('삭제')
    for mid, m in marks.items():
        if not isdel(m): continue
        if mid in by_id:
            e = by_id[mid]; trash['ids'][mid] = {'name': e.get('name'), 'sub': e.get('sub'), 'src': e.get('src'), 'memo': m.get('memo'), 'at': today}; clear.append(mid)
        elif mid in cids:
            e = cids[mid]; trash['cids'][mid] = {'name': (m.get('name') or e.get('sub', '').split(' · ')[0]), 'sub': e.get('sub'), 'n': sum(1 for x in cat if x.get('cid') == mid), 'memo': m.get('memo'), 'at': today}; clear.append(mid)
    # 지워지는 인물의 그림 문서도 저장소에서 정리
    for mid in list(marks):
        e = by_id.get(mid)
        if e and e.get('cid') in trash['cids'] and mid not in clear: clear.append(mid)
gone = [e for e in cat if e['id'] in trash['ids'] or (e.get('cid') and e['cid'] in trash['cids'])]
cat2 = [e for e in cat if e not in gone]
# 표정 · 변형 (parent) 이 지워진 대표를 가리키면 끈을 풂
left = {e['id'] for e in cat2}
for e in cat2:
    if e.get('parent') and e['parent'] not in left: e.pop('parent')
if gone: open(P, 'w', encoding='utf-8').write(head + json.dumps(cat2, ensure_ascii=False, indent=0) + ';\n')
json.dump(trash, open(T, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump({'delete_docs': clear, 'removed': [e['id'] for e in gone]}, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'새로 지움 {len(clear)} (저장소 문서) · catalog 에서 뺀 그림 {len(gone)} · 남은 그림 {len(cat2)} · 쓰레기통 기록 그림 {len(trash["ids"])} · 인물 {len(trash["cids"])}')
for e in gone[:40]: print('  -', e['id'], e.get('name'), '|', e.get('sub'))
