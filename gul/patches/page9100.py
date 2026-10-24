# v9.6.1 페이지 — page9100.py v1.1 (v1.1: 범례에 전우조 · 대장-부하 선 · 계단 화살표 · 암계 역장 · v1.0: 버전만 — 대장이 서둘러 뛰면 부하도 서둘러 (엔진 patch9080) · 암계 역장의 모습 (page9090 v1.1))
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
# 범례 (판 위 그림 설명) 에 새 표시 셋
rep('<span><i class="ln" style="color:#9fd2ff">◇</i>지키는 자리</span>', '<span><i class="ln" style="color:#9fd2ff">◇</i>지키는 자리</span><span><i class="ln" style="color:#7fb4ff">━</i>굵은 파란 선 = 전우조 · 금빛 점선 + ♛ = 대장-부하</span><span><i class="ln" style="color:#e8d7a0">⌃</i>계단 위의 오르막 화살표 = 고지대 판정 — 올라가는 쪽은 느리고 · 잘 넘어지고 · 돌격이 힘을 못 얻고 · 아래에서 위로 쏘면 잘 안 맞음 (내려가는 쪽은 그대로)</span><span><i class="ln" style="color:#c9a6ff">◇</i>보랏빛 장 = 암계 역장 — 상대 편은 못 넘고 · 곧은 탄도 · 근접 일격이 막힘 (곡사는 못 막음 · 같은 편은 지나감)</span>')
open(F, 'w', encoding='utf-8').write(s)
print('page9100 OK')
