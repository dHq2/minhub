# faction_heroes.py v1.1 — (v1.1: 짝에서 빠진 (confidence no) 그림은 원래 팩션으로 되돌림 · confidence yes = 민수 확인) v1.0 — 팩션 · 적 무리 시트 속 '주요 인물' 빼내기
#  팩션 시트에는 같은 디자인의 무리가 있지만, 그중 일부는 따로 이름 · 스프라이트 · 설정을 받은 주요 인물 (그 팩션 출신).
#  그런 그림은 팩션 묶음에서 빼서 그 인물 묶음 끝으로 옮김 (id 는 그대로 → 체크 · 메모 유지).
#   · 옮긴 그림: 이름 '<인물> · 팩션 시트 (<팩션>)', 메모 앞에 '출신 팩션: …'
#   · 팩션 묶음 첫 그림 메모에 '주요 인물 (따로 묶음): …'
#  짝 목록: tools/faction_heroes.json — [{id, faction_g, faction_name, person_g, person_name, confidence, why}] (사람이 고쳐도 됨, confidence 'no' 는 무시)
#  순서: h2_poses.py → h3_extra.py → faction_heroes.py → pack.py → hipack.py  (앞 둘이 팩션 항목을 다시 만들어도 여기서 다시 옮김)
import os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'catalog.js'); s = open(P, encoding='utf-8').read(); key = 'const CATALOG = '
head = s[:s.index(key) + len(key)]; cat = json.loads(s[len(head):].strip().rstrip(';'))
ALL = json.load(open(os.path.join(ROOT, 'tools', 'faction_heroes.json'), encoding='utf-8'))
M = [m for m in ALL if m.get('confidence') != 'no']
by = {e['id']: e for e in cat}
TAG = '출신 팩션: '
# 되돌리기: 옮겼던 그림인데 이제 짝이 아니면 원래 팩션으로
keep = {m['id'] for m in M}
for m in ALL:
    e = by.get(m['id'])
    if not e or m['id'] in keep or not e.get('from_g'): continue
    sib = next((x for x in cat if x.get('g') == e['from_g'] and x['id'] != e['id']), None)
    e['g'] = e.pop('from_g'); e['name'] = m.get('member_name') or e['name']
    if sib: e['cid'] = sib.get('cid'); e['sub'] = sib['sub']
    if e.get('note0') is not None: e['note'] = e.pop('note0')
    e['_back'] = True
heroes = {}
for m in M:
    e = by.get(m['id'])
    if not e: print('없음', m['id']); continue
    base = next((x for x in cat if x.get('g') == m['person_g'] and x['id'] != e['id']), None)
    if not base: print('인물 묶음 없음', m['person_g']); continue
    if e.get('g') != m['person_g']:
        e['from_g'] = e.get('g'); e['g'] = m['person_g']; e['cid'] = base.get('cid'); e['sub'] = base['sub']
        e['name'] = f"{m['person_name']} · 팩션 시트 ({m['faction_name']})"
        note = e.get('note', '')
        if TAG not in note: e['note0'] = note; e['note'] = f"{TAG}{m['faction_name']} (팩션 시트 #{m.get('n', '?')} '{m.get('member_name', '')}') · {m.get('why', '')}. " + note
    heroes.setdefault(m['faction_g'], []).append(m['person_name'])
# 옮긴 그림을 인물 묶음 끝으로 · 되돌린 그림은 팩션 묶음 맨 앞 (원래 1번 자리면 맨 앞)
moved = [e for e in cat if e.get('from_g')]
back = [e for e in cat if e.pop('_back', False)]
cat = [e for e in cat if not e.get('from_g') and e not in back]
for e in back:
    idx = [i for i, x in enumerate(cat) if x.get('g') == e['g']]
    sibs = sorted([x['id'] for x in cat if x.get('g') == e['g']] + [e['id']]); pos = sibs.index(e['id'])
    cat.insert(idx[0] + pos if idx else len(cat), e)
for e in moved:
    idx = [i for i, x in enumerate(cat) if x.get('g') == e['g']]
    cat.insert(idx[-1] + 1 if idx else len(cat), e)
# 팩션 묶음 첫 그림 메모 (짝이 없어진 팩션은 꼬리표를 지움)
for g in {m['faction_g'] for m in ALL}:
    for x in cat:
        if x.get('g') == g and ' || 주요 인물 (따로 묶음): ' in x.get('note', ''): x['note'] = x['note'].split(' || 주요 인물 (따로 묶음): ')[0]
for g, names in heroes.items():
    first = next((x for x in cat if x.get('g') == g), None)
    if not first: continue
    note = first.get('note', '').split(' || 주요 인물 (따로 묶음): ')[0]
    first['note'] = note + ' || 주요 인물 (따로 묶음): ' + ' · '.join(dict.fromkeys(names))
if 'v1.84:' not in head: head = head.replace('/* catalog.js v1.83 — v1.83:', '/* catalog.js v1.84 — v1.84: 팩션 시트 속 주요 인물을 그 인물 묶음으로 (tools/faction_heroes.py). v1.83:', 1)
open(P, 'w', encoding='utf-8').write(head + json.dumps(cat, ensure_ascii=False, indent=0) + ';\n')
print('옮김', len(moved), '· 되돌림', len(back), '· 팩션', len(heroes))
