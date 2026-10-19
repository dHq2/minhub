# v8.2.0 페이지 — page8200.py v1.0 (30층 결승: page8100.py 를 먼저 돌린 뒤 run8_d.js 를 붙임 · 버전 8.2.0)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8100.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v8.1.0 (2026-10-19)', '<!-- 굴의 전투판 v8.2.0 (2026-10-19)')
rep('     v8.1.0: ', '''     v8.2.0: 30층 결승 — 마야 피라미드 꼭대기의 링 (스타디움 그림을 확대) · 양쪽에서 춤추는 거인 · 디스코 조명 · DJ 춘향의 드롭 · MC 더 플링 중계.
         동료 한 명을 골라 글리치 챔피언 (그 사람을 그대로 비춤) 과 단 한 번 1대1. 특수능력 (특성 · 기술 · 치료 · 유물 · 눈물 · 돌격) 은 양쪽 모두 봉인 — 직접 조작만:
         PC WASD · 방향키 이동 / J 공격 / K 막기 / Space 회피 대시 · 휴대폰 왼쪽 막대 + 공격 · 막기 · 회피 단추. 이기면 진엔딩, 지면 "다음 시즌, 또 만나요!".
     v8.1.0: ''')
for a, b in (('h1::after{content:" v8.1.0"', 'h1::after{content:" v8.2.0"'), ('<footer>굴의 전투판 v8.1.0', '<footer>굴의 전투판 v8.2.0'), ('return `굴의 전투판 v8.1.0 · ${title}', 'return `굴의 전투판 v8.2.0 · ${title}'),
             ("copyText('굴의 전투판 v8.1.0 자동 판 기록", "copyText('굴의 전투판 v8.2.0 자동 판 기록"), ("ver: '8.1.0', kind: '1F 여정 기록'", "ver: '8.2.0', kind: '1F 여정 기록'"),
             ("o.push('굴의 전투판 v8.1.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.2.0 — 1F 프롤로그 여정 기록'"),
             ('의 버전 기록에 — v8.1.0 챔피언 로드', '의 버전 기록에 — v8.2.0 30층 결승 (링 · 거인 · DJ 춘향 · 글리치 챔피언 1대1 직접 조작) / v8.1.0 챔피언 로드'),
             ('">v8.1.0 · 챔피언 로드</span>', '">v8.2.0 · 30층 결승</span>')):
    rep(a, b)

Dd = open(D + 'run8_d.js', encoding='utf-8').read()
rep("\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일", '\n' + Dd + "\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일")

open(F, 'w', encoding='utf-8').write(s)
print('page8200 OK')
