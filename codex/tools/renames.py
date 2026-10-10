# renames.py v1.3 — 민수가 확정한 이름 · 묶음을 도감에 적용 (파이프라인 끝쪽: h2_poses → h3_extra → faction_heroes → m10_poses → g4_extra → renames → trash_apply → cands → pack · hipack)
#  · v1.3 (2026-10-10) 승마 기사 → 기병기사 — 민수의 4기 드라이브 이름 ('4기/기병기사(3성정도).png'). '승마 기사' 는 Claude 가 그림만 보고 붙였던 임시 이름 (2026-10-03)
#  · 발용 → 테이론 (본명, 2026-10-06) · 왕님 → 하르겐 (2026-10-06)
#  · v1.1 (2026-10-09) 묶음 옮기기 MOVE: 그림 하나를 다른 인물로 (그 인물의 묶음 이름 · 번호 · g 를 따라감)
#    대검을 든 단발 산호 여인 (X-coralangel-03) → 러슬 (천사슬, C-104) — 민수 메모 '얘는 슬라천 쪽 전투 스프라이트'
#  · v1.2 (2026-10-09) 검냥이 = 광냥 — 민수 메모 (C-102) '검냥이 = 광냥이 임으로 통합 / 검냥이 idle은 여기의 애니메이션들로 활용'
#    검냥이 그림 6장 (초상화 · 대기 · 차분한 대기 · 할퀴기 · 세 번 할퀴기 · 덮쳐 찢기) → 광냥 (C-092) · 이름 '검냥이' → '광냥 (검냥이)'
#    게임 쓰임 (game) 칸: 광냥 대기 = 검냥이 차분한 대기 20장 · 싸움 중 대기 = 검냥이 대기 12장 (잡몹 시트의 기본 · 공격 대기 한 장은 이제 안 씀)
import os, json, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'catalog.js'); s = open(P, encoding='utf-8').read(); key = 'const CATALOG = '
head = s[:s.index(key) + len(key)]; cat = json.loads(s[len(head):].strip().rstrip(';'))
REN = [('발용 (= 테이론)', '테이론'), ('발용의 ', '테이론의 '), ('발용', '테이론'), ('왕님 · ', '하르겐 · '), ('승마 기사', '기병기사')]
n = 0
for e in cat:
    for k in ('name', 'sub'):
        v = e.get(k, '')
        for a, b in REN:
            if a in v: v = v.replace(a, b)
        if v != e.get(k, ''): e[k] = v; n += 1
MOVE = {'X-coralangel-03': ('C-104', '러슬의 전투 모습 (대검 · 산호 갑옷) — 산호천사 무리 그림에 있던 것, 민수 메모로 옮김 (2026-10-09)')}
CAT = ['F-auto-catwarrior', 'P-catwarrior-idle', 'P-catwarrior-calm_idle', 'P-catwarrior-scratch', 'P-catwarrior-triple_scratch', 'P-catwarrior-pounce']
for k in CAT: MOVE[k] = ('C-092', '검냥이 = 광냥 (민수 메모로 합침, 2026-10-09)')
GAME = {'P-catwarrior-calm_idle': '게임: 서 있을 때 (광냥 대기 20장)', 'P-catwarrior-idle': '게임: 싸움 중 서 있을 때 (광냥 대기 12장)',
        'O-m10-gwangnyang-idle': '게임: 아직 안 씀 (대기는 검냥이 그림 20장)', 'O-m10-gwangnyang-ready': '게임: 아직 안 씀 (싸움 중 대기는 검냥이 그림 12장)'}
mv = 0
for e in cat:
    if e['id'] in MOVE:
        cid, why = MOVE[e['id']]; to = next((x for x in cat if x.get('cid') == cid and x['id'] not in MOVE), None)
        if to and e.get('cid') != cid:
            e.update({'cid': cid, 'sub': to['sub'], 'g': to.get('g', e.get('g'))}); e['note'] = why + ' · ' + re.sub(r'^할 일: [^·]*· ', '', e.get('note') or ''); mv += 1
    if e['id'] in CAT and e.get('name', '').startswith('검냥이'): e['name'] = '광냥 (검냥이)' + e['name'][3:]
    if e['id'] in GAME: e['game'] = GAME[e['id']]
if 'v1.95:' not in head: head = head.replace('/* catalog.js v1.94 — ', '/* catalog.js v1.95 — v1.95: 승마 기사 → 기병기사 (민수의 4기 드라이브 이름, tools/renames.py v1.3). ', 1)   # v1.3
open(P, 'w', encoding='utf-8').write(head + json.dumps(cat, ensure_ascii=False, indent=0) + ';\n')
print('바꾼 칸', n, '· 옮긴 그림', mv)
