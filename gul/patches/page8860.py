# v8.8.6 페이지 — page8860.py v1.0 (v1.0: 영거리 사격 — 버전 · 안내 글)
import subprocess, re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8850.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v8.8.5 (2026-10-23)', '<!-- 굴의 전투판 v8.8.6 (2026-10-23)')
rep('     v8.8.5: 간두의 샷건 (', '''     v8.8.6: 영거리 사격 (민수 — "총이나 화살류가 지근거리에서 더 효과를 받는 영거리 사격 판정"):
         총 · 활 (곡사 · 투창 · 마법 제외) 이 코앞에서 쏠수록 관통력이 오름 — 몸 사이 틈이 0 이면 총 ×1.8 · 활 ×1.5, 틈이 영향 거리 (총 2.0 · 활 1.8 칸) 에 닿을수록 1 로 줄어듦. 샷건은 따로 ×2.4 · 2.4 칸. 원래 있던 ±15% 흔들림 때문에 경계에선 확률로 뚫림 (판금도 코앞 산탄은 뚫음). 적 · 아군 똑같이 (적 궁수 · 사수가 코앞에 붙어도 그만큼 아픔). 방패 관통에도 같이 얹힘. 기록: "영거리 사격 — 갑옷을 뚫음".
     v8.8.5: 간두의 샷건 (''')
for a, b in (('h1::after{content:" v8.8.5"', 'h1::after{content:" v8.8.6"'), ('<footer>굴의 전투판 v8.8.5', '<footer>굴의 전투판 v8.8.6'), ('return `굴의 전투판 v8.8.5 · ${title}', 'return `굴의 전투판 v8.8.6 · ${title}'),
             ("copyText('굴의 전투판 v8.8.5 자동 판 기록", "copyText('굴의 전투판 v8.8.6 자동 판 기록"), ("o.push(`굴의 전투판 v8.8.5 — ${C.run", "o.push(`굴의 전투판 v8.8.6 — ${C.run"),
             ('의 버전 기록에 — v8.8.5 간두 샷건 /', '의 버전 기록에 — v8.8.6 영거리 사격 / v8.8.5 간두 샷건 /'),
             ('">v8.8.5 · 간두 샷건 (빠르게 · 세게 · 특수탄 50)</span>', '">v8.8.6 · 영거리 사격 (총 · 활 코앞 관통)</span>'),
             ("ver: '8.8.5', kind:", "ver: '8.8.6', kind:"), ("RULES_MIG = '8.8.5',", "RULES_MIG = '8.8.6',")):
    rep(a, b)
open(F, 'w', encoding='utf-8').write(s)
print('page8860 OK')
