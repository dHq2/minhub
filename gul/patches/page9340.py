# v9.10.1 페이지 — page9340.py v1.0 (v1.0: 버전 v9.10.1 · 엔진 patch9290 (빼꼼 순간이동 없음 · 전우이면서 같은 대장의 따를이는 대장 자리 규칙 · 등 뒤 자리 몸 폭대로 · 지금 선 순서대로 · 대장 앞길 비키기 · 대장을 밀지 않음 · 자리에서 멈춤))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9330.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.10.0 (2026-10-26)', '<!-- 굴의 전투판 v9.10.1 (2026-10-28)')
rep('     v9.10.0: 점검', '''     v9.10.1: 움직임 점검 — 빼꼼 순간이동 없음 · 따를이는 대장 앞길을 비키고 대장을 밀지 않음 · 등 뒤 자리에서 멈춤 (끝없이 비비던 것)
     v9.10.0: 점검''')
for a, b in (('h1::after{content:" v9.10.0"', 'h1::after{content:" v9.10.1"'), ('<footer>굴의 전투판 v9.10.0', '<footer>굴의 전투판 v9.10.1'), ('return `굴의 전투판 v9.10.0 · ${title}', 'return `굴의 전투판 v9.10.1 · ${title}'),
             ("copyText('굴의 전투판 v9.10.0 자동 판 기록", "copyText('굴의 전투판 v9.10.1 자동 판 기록"), ("o.push(`굴의 전투판 v9.10.0 — ${C.run", "o.push(`굴의 전투판 v9.10.1 — ${C.run"),
             ('의 버전 기록에 — v9.10.0 점검 바로잡기', '의 버전 기록에 — v9.10.1 움직임 점검 / v9.10.0 점검 바로잡기'),
             ('">v9.10.0 보이지 않는 궁수에 맞서기', '">v9.10.1 비비지 않는 대장 등 뒤 자리 · 빼꼼 순간이동 없음 · v9.10.0 보이지 않는 궁수에 맞서기'),
             ("ver: '9.10.0', kind:", "ver: '9.10.1', kind:"), ("RULES_MIG = '9.10.0',", "RULES_MIG = '9.10.1',")):
    rep(a, b)
open(F, 'w', encoding='utf-8').write(s)
print('page9340 OK')
