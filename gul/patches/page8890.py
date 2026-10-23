# v8.8.9 페이지 — page8890.py v1.0 (v1.0: 전투맵2 (낙사) · 전투맵3 (좁은 복도) 등록 — 칸 확대 없음 · 낙사는 기존 옥상 낙사 (fall) 그대로 · 버전)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8880.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v8.8.8 (2026-10-23)', '<!-- 굴의 전투판 v8.8.9 (2026-10-23)')
rep('     v8.8.8: 지상 맵 5장 (', '''     v8.8.9: 전투맵 2 · 3 (민수 — "1. 전투맵2, 낙사 가능함 (낙사 안 하려고 버티는 기믹 있을 거임. 모든 적 아군 동일하게. 더 밀면 진짜 떨어져서 사망) 2. 전투맵3. 좁은 복도"):
         fmap2 (전투맵2) — 두 옥상판 + 대각선 계단, 둘레는 허공 → 기존 옥상 낙사 (fall) 규칙 그대로: 판 가장자리 밖으로 밀려나가면 아군 · 적군 가리지 않고 떨어져 사망. (낙사 안 하려고 버티는 기믹은 아직 안 만듦.) fmap3 (전투맵3) — 폭 4 ~ 5칸 긴 복도 (석관 · 탑 · 부서진 벽이 길을 좁힘, 칸 111px). 층에는 아직 안 걸었음.
     v8.8.8: 지상 맵 5장 (''')
for a, b in (('h1::after{content:" v8.8.8"', 'h1::after{content:" v8.8.9"'), ('<footer>굴의 전투판 v8.8.8', '<footer>굴의 전투판 v8.8.9'), ('return `굴의 전투판 v8.8.8 · ${title}', 'return `굴의 전투판 v8.8.9 · ${title}'),
             ("copyText('굴의 전투판 v8.8.8 자동 판 기록", "copyText('굴의 전투판 v8.8.9 자동 판 기록"), ("o.push(`굴의 전투판 v8.8.8 — ${C.run", "o.push(`굴의 전투판 v8.8.9 — ${C.run"),
             ('의 버전 기록에 — v8.8.8 지상 맵 5장 /', '의 버전 기록에 — v8.8.9 전투맵 2 · 3 / v8.8.8 지상 맵 5장 /'),
             ('">v8.8.8 · 지상 맵 5장 (보스룸 · 이벤트룸 · 계단 · 전투룸)</span>', '">v8.8.9 · 전투맵 2 (낙사) · 3 (좁은 복도)</span>'),
             ("ver: '8.8.8', kind:", "ver: '8.8.9', kind:"), ("RULES_MIG = '8.8.8',", "RULES_MIG = '8.8.9',")):
    rep(a, b)
rep("'gstair2', 'gfight1']) if (MAPS8[k]) MAPS8[k].z = 1;", "'gstair2', 'gfight1', 'fmap2', 'fmap3']) if (MAPS8[k]) MAPS8[k].z = 1;")
open(F, 'w', encoding='utf-8').write(s)
print('page8890 OK')
