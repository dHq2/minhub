# v7.16.1 페이지 — page7161.py v1 (교전 금지 자동 해제 로그 · 서술 · 포복 · 일어남을 명령으로 (지휘관을 거쳐 닿음) · 자동 = 포복도 스스로 판단)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.16.0 (2026-10-17)', '<!-- 굴의 전투판 v7.16.1 (2026-10-17)')
rep('     v7.16.0: ', '''     v7.16.1: 교전 금지는 싸움 전의 태세 — 싸움이 시작되면 (동료가 맞음 · 적이 우리를 쫓음 · 우리가 먼저 맞힘) 교전 금지인 아군 모두 판단 교전으로 (전달 없이 · 한 번만).
         가는 중인 교전 금지 지시도 판단 교전으로. 그 뒤에 다시 교전 금지를 주면 그대로 지킴. 로그 🕊→⚖.
         포복 · 일어남 (C) 도 명령 — 다른 명령처럼 지휘관을 거쳐 닿고, 닿으면 제자리처럼 바로 처리 (지휘관 자신 · 0초 작전 회의는 바로). 닿지 않으면 하던 대로.
         스스로 판단: 고립된 채 사격이 쏟아지면 엎드리고 · 사격이 멎거나 근접이 다가오면 일어남 (그대로). 명령으로 엎드린 몸에 자동 · 명령 취소를 주면 일어날지도 스스로 판단.
     v7.16.0: ''')
rep('h1::after{content:" v7.16.0"', 'h1::after{content:" v7.16.1"')
rep('<footer>굴의 전투판 v7.16.0', '<footer>굴의 전투판 v7.16.1')
rep('return `굴의 전투판 v7.16.0 · ${title}', 'return `굴의 전투판 v7.16.1 · ${title}')
rep("copyText('굴의 전투판 v7.16.0 자동 판 기록", "copyText('굴의 전투판 v7.16.1 자동 판 기록")
rep('의 버전 기록에 — v7.16.0 견제사격 · 지역사격 · 친칠라 관통력 /', '의 버전 기록에 — v7.16.1 교전 금지 자동 해제 · 포복 명령 / v7.16.0 견제사격 · 지역사격 · 친칠라 관통력 /')
rep('">v7.16.0 · 견제사격 · 지역사격 · 친칠라 관통력</span>', '">v7.16.1 · 교전 금지 자동 해제 · 포복 명령</span>')
rep("RULES_MIG = '7.16.0'", "RULES_MIG = '7.16.1'")

# ---------- 포복 · 일어남 = 명령 (지휘관을 거쳐) ----------
rep("    const on = !ok.every(u => u.lie && !(u.lieSw && !u.lieSw.to)); ok.forEach(u => lieSet(world, u, on, '명령')); logEv(world, { k: 'lieMode', a: ok.map(u => u.i), on, live: mode === 'run' && !paused });",
    "    const lieNow = u => { const q = (u.posPend || []).find(q => q.key === 'lie'); return q ? q.val === 'down' : u.lie && !(u.lieSw && !u.lieSw.to); }, on = !ok.every(lieNow);   /* v7.16.1 가는 중인 지시도 셈 */\n"
    "    logEv(world, { k: 'lieMode', a: ok.map(u => u.i), on, live: mode === 'run' && !paused }); sendPosture(world, ok, 'lie', on ? 'down' : 'up', {}); const lpend = ok.filter(u => (u.posPend || []).some(q => q.key === 'lie'));   /* v7.16.1 포복 · 일어남도 명령 — 지휘관을 거쳐 닿으면 바로 (제자리처럼) */")
rep("    toast(on ? `${nm} 엎드림 (", "    toast((lpend.length ? `📣 ${lpend.map(u => u.name).join(' · ')}에게 전하는 중 — ` : '') + (on ? `${nm} 엎드림 (")
rep("ok.some(u => u.cls === '기동') ? ' · 기동 ' + LR.upFast + '초' : ''})`); }", "ok.some(u => u.cls === '기동') ? ' · 기동 ' + LR.upFast + '초' : ''})`)); }")
# 자동 · 명령 취소 = 포복도 스스로 판단
rep("    if (lk.via === 'self'){ preempt(W, u); u.ordLive = u.order; u.ordPend = null; return; }",
    "    if (lk.via === 'self'){ preempt(W, u); u.ordLive = u.order; u.ordPend = null; if (!u.order) lieFree(W, u); return; }   /* v7.16.1 */")
rep("noteOrders(L, 'user', '자동 (자리를 풀고 주인공을 따라감)'); }",
    "noteOrders(L, 'user', '자동 (자리를 풀고 주인공을 따라감)'); { const lz = L.filter(u => u.lie); if (lz.length) toast(`${lz.map(u => u.name).join(' · ')} 자동 — 엎드린 채로, 일어날지는 스스로 판단 (사격이 멎거나 근접이 오면 일어남)`); } }   /* v7.16.1 */")

# ---------- 로그 · 서술 ----------
rep("      case 'engOpen': out.push(",
    "      case 'roeAuto': out.push(`${T(e)}🕊→⚖ 싸움이 시작됨 (${e.why}) — 교전 금지${e.a.length ? '였던 ' + e.a.map(n).join(' · ') : ''}${e.pend && e.pend.length ? (e.a.length ? ' · ' : ' ') + '가는 중이던 교전 금지 지시 (' + e.pend.map(n).join(' · ') + ')' : ''} → 판단 교전 (한 번만 — 다시 교전 금지를 주면 그대로)`); break;   /* v7.16.1 */\n      case 'engOpen': out.push(")
rep("    case 'engOpen': return {",
    "    case 'roeAuto': return { c: 'dim', s: `싸움이 시작됐다 — ${[...e.a, ...(e.pend || [])].map(n).join(' · ')}, 묶어 두었던 손을 푼다 (판단 교전).` };   /* v7.16.1 */\n    case 'engOpen': return {")

open(F, 'w', encoding='utf-8').write(s)
print('page7161 OK')
