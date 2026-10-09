# renames.py v1.1 — 민수가 확정한 이름 · 묶음을 도감에 적용 (파이프라인 끝쪽: h2_poses → h3_extra → faction_heroes → m10_poses → renames → trash_apply → pack · hipack)
#  · 발용 → 테이론 (본명, 2026-10-06) · 왕님 → 하르겐 (2026-10-06)
#  · v1.1 (2026-10-09) 묶음 옮기기 MOVE: 그림 하나를 다른 인물로 (그 인물의 묶음 이름 · 번호 · g 를 따라감)
#    대검을 든 단발 산호 여인 (X-coralangel-03) → 러슬 (천사슬, C-104) — 민수 메모 '얘는 슬라천 쪽 전투 스프라이트'
import os, json, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'catalog.js'); s = open(P, encoding='utf-8').read(); key = 'const CATALOG = '
head = s[:s.index(key) + len(key)]; cat = json.loads(s[len(head):].strip().rstrip(';'))
REN = [('발용 (= 테이론)', '테이론'), ('발용의 ', '테이론의 '), ('발용', '테이론'), ('왕님 · ', '하르겐 · ')]
n = 0
for e in cat:
    for k in ('name', 'sub'):
        v = e.get(k, '')
        for a, b in REN:
            if a in v: v = v.replace(a, b)
        if v != e.get(k, ''): e[k] = v; n += 1
MOVE = {'X-coralangel-03': ('C-104', '러슬의 전투 모습 (대검 · 산호 갑옷) — 산호천사 무리 그림에 있던 것, 민수 메모로 옮김 (2026-10-09)')}
mv = 0
for e in cat:
    if e['id'] in MOVE:
        cid, why = MOVE[e['id']]; to = next((x for x in cat if x.get('cid') == cid and x['id'] not in MOVE), None)
        if to and e.get('cid') != cid:
            e.update({'cid': cid, 'sub': to['sub'], 'g': to.get('g', e.get('g'))}); e['note'] = why + ' · ' + re.sub(r'^할 일: [^·]*· ', '', e.get('note') or ''); mv += 1
open(P, 'w', encoding='utf-8').write(head + json.dumps(cat, ensure_ascii=False, indent=0) + ';\n')
print('바꾼 칸', n, '· 옮긴 그림', mv)
