# v9.8.1 페이지 — page9220.py v1.0 (v1.0: 버전 · 엔진 patch9170 — 길찾기 개선 (A* · 곧은 길 · 동료 비켜 감 · 끼임 풀기))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9210.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.8.0 (2026-10-25)', '<!-- 굴의 전투판 v9.8.1 (2026-10-25)')
rep('     v9.8.0: 대개편 (보는 재미)', '''     v9.8.1: 길찾기 개선 — A* (대각선 √2 · 예전엔 지그재그) · 곧게 걸을 수 있는 모퉁이는 건너뜀 · 앞을 막은 동료는 옆으로 비켜 감 (예전엔 6칸 넘게 밀어냄) · 0.5초 끼면 옆걸음 + 길 다시 찾음
     v9.8.0: 대개편 (보는 재미)''')
for a, b in (('h1::after{content:" v9.8.0"', 'h1::after{content:" v9.8.1"'), ('<footer>굴의 전투판 v9.8.0', '<footer>굴의 전투판 v9.8.1'), ('return `굴의 전투판 v9.8.0 · ${title}', 'return `굴의 전투판 v9.8.1 · ${title}'),
             ("copyText('굴의 전투판 v9.8.0 자동 판 기록", "copyText('굴의 전투판 v9.8.1 자동 판 기록"), ("o.push(`굴의 전투판 v9.8.0 — ${C.run", "o.push(`굴의 전투판 v9.8.1 — ${C.run"),
             ('의 버전 기록에 — v9.8.0 대개편', '의 버전 기록에 — v9.8.1 길찾기 개선 / v9.8.0 대개편'),
             ('">v9.8.0 대개편 · 무기 = 사거리 · 세포막 무리 · 돌격 방어 · 판을 깨끗하게</span>', '">v9.8.1 길찾기 개선 · 무기 = 사거리 · 세포막 무리 · 돌격 방어 · 판을 깨끗하게</span>'),
             ("ver: '9.8.0', kind:", "ver: '9.8.1', kind:"), ("RULES_MIG = '9.8.0',", "RULES_MIG = '9.8.1',")):
    rep(a, b)
open(F, 'w', encoding='utf-8').write(s)
print('page9220 OK')
