# cands.py v1.0 (2026-10-10) — 도감 정리 후보 (세계관 · 그림체가 굴과 동떨어진 그림) → cands.js
#  · cands.json = 후보 묶음 (lv 1 가장 동떨어짐 · lv 2 약함, 제목, 이유, 그림 번호). Claude 가 눈으로 분류해 손으로 적음
#  · 지우지 않음: 도감에 '⚑ 정리 후보' 칸 · 거르기만. 지울지는 민수가 🗑 삭제 표시로 정함 → trash_apply.py
#  · catalog 에 없는 번호 (이미 쓰레기통으로 간 것) 는 빼고 알려 줌. 파이프라인: … → trash_apply → cands → pack
#  사용: python3 codex/tools/cands.py   (찍는 것: 묶음별 개수 · 그림 파일 크기 합)
import os, json
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cat = json.loads(open(f'{R}/catalog.js', encoding='utf-8').read().split('const CATALOG = ', 1)[1].strip().rstrip(';'))
by = {e['id']: e for e in cat}
C = json.load(open(f'{R}/cands.json', encoding='utf-8'))
groups, ids, gone, total, size = [], {}, [], 0, 0
for gi, g in enumerate(C['groups']):
    groups.append([g['lv'], g['title'], g['reason']])
    n = sb = 0
    for i in g['ids']:
        e = by.get(i)
        if not e: gone.append(i); continue
        ids[i] = gi; n += 1
        p = f'{R}/{e["src"]}'
        if os.path.exists(p): sb += os.path.getsize(p)
    total += n; size += sb
    print(f'  lv{g["lv"]} {g["title"]}: {n}장 · {sb / 1024:.0f} KB')
js = ('/* cands.js — tools/cands.py 가 cands.json 으로 만듦 (손으로 고치지 않음). 도감 정리 후보: g = [단계, 제목, 이유], ids = { 그림 번호: g 번호 } */\n'
      'const CANDS = ' + json.dumps({'v': C['v'], 'g': groups, 'ids': ids}, ensure_ascii=False, separators=(',', ':')) + ';\n')
open(f'{R}/cands.js', 'w', encoding='utf-8').write(js)
print(f'정리 후보 {total}장 · 그림 파일 {size / 1024 / 1024:.2f} MB' + (f' · 이미 없는 번호 {len(gone)}: {" ".join(gone)}' if gone else ''))
