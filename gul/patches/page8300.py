# v8.3.0 페이지 — page8300.py v1.0 (히든보스 적뢰: page8210.py 를 먼저 돌린 뒤 run8_e.js 를 붙이고 · 캠페인 띠 · 판마다 · 그림 · 수전증 서술 · 오딜의 낙인 지우기 · 프롤로그 기록 · 수치표 이전 8.3.0)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8210.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v8.2.1 (2026-10-19)', '<!-- 굴의 전투판 v8.3.0 (2026-10-19)')
rep('     v8.2.1: ', '''     v8.3.0: 히든보스 적뢰 — 1F 1S 에서 "↓ 굴 밖으로" → 30초 기다리면 폭우 · 하늘이 갈라지며 적뢰가 떨어짐 (떨어지는 자리 즉사 · 둘레 큰 피해).
         날라차기 (예고선) · 붉은 번개창 (감전 + 작은 천벌) · 천벌:적뢰 (붉은 원 — 직격 · 여파) · 2페이즈 (붉은 번개 폭발 · 빨라짐 · 천벌 셋).
         천벌을 직격으로 맞고 살아남으면 가끔 [낙인:적뢰] (수전증 — 행동이 가끔 안 나감, 신성은 면함) · 오딜의 방에서 지움. 쓰러뜨리면 성해포 ([신성E] · 재생 · 낙인 있는 이는 붉은 번개창).
     v8.2.1: ''')
for a, b in (('h1::after{content:" v8.2.1"', 'h1::after{content:" v8.3.0"'), ('<footer>굴의 전투판 v8.2.1', '<footer>굴의 전투판 v8.3.0'), ('return `굴의 전투판 v8.2.1 · ${title}', 'return `굴의 전투판 v8.3.0 · ${title}'),
             ("copyText('굴의 전투판 v8.2.1 자동 판 기록", "copyText('굴의 전투판 v8.3.0 자동 판 기록"), ("ver: '8.2.1', kind: '1F 여정 기록'", "ver: '8.3.0', kind: '1F 여정 기록'"),
             ("o.push('굴의 전투판 v8.2.1 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.3.0 — 1F 프롤로그 여정 기록'"),
             ('의 버전 기록에 — v8.2.1 그만두기 고침', '의 버전 기록에 — v8.3.0 히든보스 적뢰 (낙인 · 성해포) / v8.2.1 그만두기 고침'),
             ('">v8.2.1 · 그만두기 고침</span>', '">v8.3.0 · 히든보스 적뢰</span>'),
             ("RULES_MIG = '7.29.0'", "RULES_MIG = '8.3.0'")):
    rep(a, b)

# 캠페인 띠 · 판마다 · 그림
rep("  if (h !== campBarH || el.hidden){ campBarH = h;", "  if (typeof jrBarHook === 'function') h = jrBarHook(h, C, W);   /* v8.3.0 적뢰 */\n  if (h !== campBarH || el.hidden){ campBarH = h;")
rep("if (world.r8 && run8On()) r8Tick(world); }", "if (world.r8 && run8On()) r8Tick(world); jrTickAll(world); }   /* v8.3.0 적뢰 · 성해포 */")
rep("  if (!ed && Wd.snow) drawSnow(Wd);   // v7.23.2 권위의 눈", "  if (!ed && Wd.snow) drawSnow(Wd);   // v7.23.2 권위의 눈\n  if (!ed && (Wd.jr8 || Wd.jrq || Wd.jrLines || Wd.rain)) jr8Draw(Wd, ox, oy, ts);   /* v8.3.0 적뢰 예고 · 번개 · 비 */")
# 수전증 서술 · 로그
rep("    case 'r8': return { c: e.c || 'dim', s: e.s };", "    case 'tremor': return { c: U(e.a).side ? 'good' : 'bad', s: `${ga(n(e.a))} 손이 떨린다 — [낙인:적뢰], 행동이 나가지 않는다.` };   /* v8.3.0 */\n    case 'r8': return { c: e.c || 'dim', s: e.s };")
rep("      case 'r8': out.push(`${T(e)}${e.s}`); break;", "      case 'tremor': out.push(`${T(e)}☠ ${n(e.a)} 수전증 — 행동이 나가지 않음 ([낙인:적뢰])`); break;   /* v8.3.0 */\n      case 'r8': out.push(`${T(e)}${e.s}`); break;")
# 오딜: 낙인 지우기
rep("const odTalkAsk = E => ({ ask: [...(!E.teaDrunk ? [['차를 받는다', '!otea']] : []),", "const odTalkAsk = E => ({ ask: [...(!E.teaDrunk ? [['차를 받는다', '!otea']] : []), ...(typeof jrBranded === 'function' && jrBranded().length ? [['낙인을 지워 달라고 한다', '!r8:jrCure']] : []),")
# 프롤로그 기록
rep("  if (C.kh && (st[C.kh] || {}).khDone) rows.push(", "  if (C.jr8 && C.jr8.st !== 'wait') rows.push(['적뢰', C.jr8.st === 'won' ? '폭우 속에서 천벌의 화신을 쓰러뜨림 — 성해포' : C.jr8.st === 'lost' ? '적뢰의 천벌에 쓰러짐' : '굴 밖으로 나가려다 적뢰를 만남']);   /* v8.3.0 */\n  if (C.kh && (st[C.kh] || {}).khDone) rows.push(")

E = open(D + 'run8_e.js', encoding='utf-8').read()
rep("\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일", '\n' + E + "\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일")
open(F, 'w', encoding='utf-8').write(s)
print('page8300 OK')
