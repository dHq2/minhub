# v9.6.1 페이지 — page9100.py v1.0 (v1.0: 버전만 — 대장이 서둘러 뛰면 부하도 서둘러 (엔진 patch9080) · 암계 역장의 모습 (page9090 v1.1))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9090.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.6.0 (2026-10-24)', '<!-- 굴의 전투판 v9.6.1 (2026-10-24)')
rep('     v9.6.0: 되돌아가기 (명세 C1)', '''     v9.6.1: 대장이 서둘러 뛰면 부하도 서둘러 (명세 B6 — 따르는 이가 뛰는 동안 따라가는 이도 뜀걸음) · 암계 역장의 모습 (어두운 보랏빛 장 · 마름모 룬 · 이름표 "암계 역장" — 예전엔 정령 방벽의 파란 물)
     v9.6.0: 되돌아가기 (명세 C1)''')
for a, b in (('h1::after{content:" v9.6.0"', 'h1::after{content:" v9.6.1"'), ('<footer>굴의 전투판 v9.6.0', '<footer>굴의 전투판 v9.6.1'), ('return `굴의 전투판 v9.6.0 · ${title}', 'return `굴의 전투판 v9.6.1 · ${title}'),
             ("copyText('굴의 전투판 v9.6.0 자동 판 기록", "copyText('굴의 전투판 v9.6.1 자동 판 기록"), ("o.push(`굴의 전투판 v9.6.0 — ${C.run", "o.push(`굴의 전투판 v9.6.1 — ${C.run"),
             ('의 버전 기록에 — v9.6.0 되돌아가기 /', '의 버전 기록에 — v9.6.1 대장이 뛰면 부하도 · 암계 역장 모습 / v9.6.0 되돌아가기 /'),
             ('">v9.6.0 · 되돌아가기 · 사람 만남은 비전투 맵 · 심계 제3세력</span>', '">v9.6.1 · 대장 서둘러 · 암계 역장 · 되돌아가기 · 비전투 맵 만남</span>'),
             ("ver: '9.6.0', kind:", "ver: '9.6.1', kind:"), ("RULES_MIG = '9.6.0',", "RULES_MIG = '9.6.1',")):
    rep(a, b)
open(F, 'w', encoding='utf-8').write(s)
print('page9100 OK')
