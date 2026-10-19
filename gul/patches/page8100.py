# v8.1.0 페이지 — page8100.py v1.0 (챔피언 로드: page8000.py 를 먼저 돌린 뒤 run8_c.js 를 붙이고 · 여정 글 ('r8') 서술 · 로그 · 버전 8.1.0)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8000.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.0.0 (2026-10-19)', '<!-- 굴의 전투판 v8.1.0 (2026-10-19)')
rep('     v8.0.0: ', '''     v8.1.0: 챔피언 로드 — 20층에서 MC 더 플링이 나온 뒤 21 ~ 29층: 관중 열기 (0 ~ 100) 가 싸움에 끼어듦 — 응원 (공격 +12%) · 야유 (빠르기 −10%) · 축복 (가장 다친 이 회복) · 증오 (빈 병).
         열기는 처치 + · 동료가 쓰러짐 − · 이김 + · 물러남 −. 상금은 열기만큼 (× 0.75 ~ 1.25). 싸움마다 MC 실황 · 깜짝 규칙 (암전 · 상금 두 배 · 관중 열광 · 90초 승부).
     v8.0.0: ''')
rep('h1::after{content:" v8.0.0"', 'h1::after{content:" v8.1.0"')
rep('<footer>굴의 전투판 v8.0.0', '<footer>굴의 전투판 v8.1.0')
rep('return `굴의 전투판 v8.0.0 · ${title}', 'return `굴의 전투판 v8.1.0 · ${title}')
rep("copyText('굴의 전투판 v8.0.0 자동 판 기록", "copyText('굴의 전투판 v8.1.0 자동 판 기록")
rep("ver: '8.0.0', kind: '1F 여정 기록'", "ver: '8.1.0', kind: '1F 여정 기록'")
rep("o.push('굴의 전투판 v8.0.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.1.0 — 1F 프롤로그 여정 기록'")
rep('의 버전 기록에 — v8.0.0 30층 여정', '의 버전 기록에 — v8.1.0 챔피언 로드 (관중 · MC 실황 · 깜짝 규칙) / v8.0.0 30층 여정')
rep('">v8.0.0 · 30층 여정</span>', '">v8.1.0 · 챔피언 로드</span>')

# ---------- 여정 글 ('r8'): 서술 · 로그 ----------
rep("    case 'campIn': return { c: 'dim',", "    case 'r8': return { c: e.c || 'dim', s: e.s };   /* v8.1.0 여정 · 관중 · MC */\n    case 'campIn': return { c: 'dim',")
rep("      case 'campIn': out.push(", "      case 'r8': out.push(`${T(e)}${e.s}`); break;   /* v8.1.0 */\n      case 'campIn': out.push(")

# ---------- 모듈 ----------
C = open(D + 'run8_c.js', encoding='utf-8').read()
rep("\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일", '\n' + C + "\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일")

open(F, 'w', encoding='utf-8').write(s)
print('page8100 OK')
