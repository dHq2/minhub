# renames.py v1.0 — 민수가 확정한 이름을 도감에 적용 (파이프라인 맨 끝: h2_poses → h3_extra → faction_heroes → renames → pack · hipack)
#  · 발용 → 테이론 (본명, 2026-10-06) · 왕님 → 하르겐 (2026-10-06)
import os, json
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
open(P, 'w', encoding='utf-8').write(head + json.dumps(cat, ensure_ascii=False, indent=0) + ';\n')
print('바꾼 칸', n)
