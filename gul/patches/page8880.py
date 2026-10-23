# v8.8.8 페이지 — page8880.py v1.0 (v1.0: 지상 맵 5장 (보스룸 · 이벤트룸 · 계단 1 · 2 · 전투룸) 등록 — 칸 확대 없음 (z=1) · 버전)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8870.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v8.8.7 (2026-10-23)', '<!-- 굴의 전투판 v8.8.8 (2026-10-23)')
rep('     v8.8.7: 2층 맵 (', '''     v8.8.8: 지상 맵 5장 (민수 — "1. 지상보스룸1 원형 공간, 보스룸 2. 지상이벤트룸1 직사각형 공간, 이벤트룸 3. 지상계단1 4. 지상계단2 (계단 1 에서 이어짐) 5. 지상전투룸1, 전투룸"):
         gboss1 · gevent1 · gstair1 · gstair2 · gfight1 을 도감 맵으로 등록만 함 (칸 지도 · 들어서는 곳 · 나가는 칸 · 밝기). 아직 어느 층에도 안 걸었음. 칸 크기는 2층 맵과 같음 (한 칸 85px ≒ 사람 한 명 0.7칸).
     v8.8.7: 2층 맵 (''')
for a, b in (('h1::after{content:" v8.8.7"', 'h1::after{content:" v8.8.8"'), ('<footer>굴의 전투판 v8.8.7', '<footer>굴의 전투판 v8.8.8'), ('return `굴의 전투판 v8.8.7 · ${title}', 'return `굴의 전투판 v8.8.8 · ${title}'),
             ("copyText('굴의 전투판 v8.8.7 자동 판 기록", "copyText('굴의 전투판 v8.8.8 자동 판 기록"), ("o.push(`굴의 전투판 v8.8.7 — ${C.run", "o.push(`굴의 전투판 v8.8.8 — ${C.run"),
             ('의 버전 기록에 — v8.8.7 2층 맵 /', '의 버전 기록에 — v8.8.8 지상 맵 5장 / v8.8.7 2층 맵 /'),
             ('">v8.8.7 · 2층 맵 (무너진 유적)</span>', '">v8.8.8 · 지상 맵 5장 (보스룸 · 이벤트룸 · 계단 · 전투룸)</span>'),
             ("ver: '8.8.7', kind:", "ver: '8.8.8', kind:"), ("RULES_MIG = '8.8.7',", "RULES_MIG = '8.8.8',")):
    rep(a, b)
rep("for (const k of ['ruin2a', 'ruin2b', 'ruin2c', 'ruin2c1', 'ruin2c2']) if (MAPS8[k]) MAPS8[k].z = 1;", "for (const k of ['ruin2a', 'ruin2b', 'ruin2c', 'ruin2c1', 'ruin2c2', 'gboss1', 'gevent1', 'gstair1', 'gstair2', 'gfight1']) if (MAPS8[k]) MAPS8[k].z = 1;")
open(F, 'w', encoding='utf-8').write(s)
print('page8880 OK')
