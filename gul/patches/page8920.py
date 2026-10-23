# v8.9.2 페이지 — page8920.py v1.1 (v1.1: 소품 없이 (bare) · v1.0: 각펄 전용맵 — 각펄 싸움 맵을 고대 폐허 그림에서 민수가 준 무너진 다리 (pearl1) 로 고정 · 칸 확대 없음 · 버전)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8900.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v8.9.0 (2026-10-23)', '<!-- 굴의 전투판 v8.9.2 (2026-10-23)')
rep('     v8.9.0: 2층 짜기 (', '''     v8.9.2: 각펄 전용맵 (민수 — "이건 각펄 전용맵임. 일부 맵에서 각펄이 ?로 등장 가능함. 일단 각펄 맵만 이걸로 고정해두면 되 ㅇㅋ? · 가로로 인주 5명이 설 정도의 너비면 됨"):
         pearl1 (각펄 전용맵 · 무너진 다리) — 세로로 긴 돌다리 (10 × 30칸, 칸 67px, 가장 좁은 줄도 다섯 칸 · 인주 다섯 명이 나란히). 각펄 싸움 (x_pearlFight) 의 맵을 고대 폐허 (ancient) 에서 이 맵으로 바꿈 — 만남 장면 그림 (고대 폐허) 은 그대로. 소품은 놓지 않음 (그림의 기둥 · 잔해만). 낙사 없음 (그림 가장자리는 허공이지만 낙사 규칙은 안 켬 — 켜려면 d5/poly/pearl1.json 에 fall: 1).
     v8.9.0: 2층 짜기 (''')
for a, b in (('h1::after{content:" v8.9.0"', 'h1::after{content:" v8.9.2"'), ('<footer>굴의 전투판 v8.9.0', '<footer>굴의 전투판 v8.9.2'), ('return `굴의 전투판 v8.9.0 · ${title}', 'return `굴의 전투판 v8.9.2 · ${title}'),
             ("copyText('굴의 전투판 v8.9.0 자동 판 기록", "copyText('굴의 전투판 v8.9.2 자동 판 기록"), ("o.push(`굴의 전투판 v8.9.0 — ${C.run", "o.push(`굴의 전투판 v8.9.2 — ${C.run"),
             ('의 버전 기록에 — v8.9.0 2층 짜기 /', '의 버전 기록에 — v8.9.2 각펄 전용맵 / v8.9.0 2층 짜기 /'),
             ('">v8.9.0 · 2층 짜기 (여덟 칸) · 맵 이름 정리</span>', '">v8.9.2 · 각펄 전용맵 (무너진 다리)</span>'),
             ("ver: '8.9.0', kind:", "ver: '8.9.2', kind:"), ("RULES_MIG = '8.9.0',", "RULES_MIG = '8.9.2',")):
    rep(a, b)
rep("'fmap2', 'fmap3']) if (MAPS8[k]) MAPS8[k].z = 1;", "'fmap2', 'fmap3', 'pearl1']) if (MAPS8[k]) MAPS8[k].z = 1;")
rep("x_pearlFight(){ r8XFight('x_pearl', 'ancient', { pearl8: true,", "x_pearlFight(){ r8XFight('x_pearl', 'pearl1', { bare: true, pearl8: true,")   # bare = 소품 없이 (그림의 기둥 · 잔해만)
open(F, 'w', encoding='utf-8').write(s)
print('page8920 OK')
