# v7.16.0 엔진 — patch716.py v1.1 (v1.1: resolveSupp 줄 가운데 // 주석 → /* */ — 남은 발 · 쏜 수를 삼키던 것)
# 견제사격 (직사) / 지역사격 (곡사 · 활만 — 총은 견제사격과 같음) 나눔 · 아군 · 적 같은 규칙 (적 궁수는 상황 따라 고름) · 베테랑 또는 사격 A 이상 · 하얀 나무 관통력 70
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "'하얀 나무':{rng:10, ammo:30, aim:0.5, vel:200, P:55, draw:0.15, kind:'활', pen:0.55, penK:0.85, jit:0.35}",
        "'하얀 나무':{rng:10, ammo:30, aim:0.5, vel:200, P:70, draw:0.15, kind:'활', pen:0.65, penK:0.85, jit:0.35}")
wr('rt3_head.js', h)

s = rd('rt3_tail.js')
s = rep(s, "const suppOK = u => isFar(u) && !!u.vet && u.ammo !== 0 && !u.crawl;",
        """const suppSkill = u => !!u.vet || (u.traits || []).some(t => t === '사격S' || t === '사격A');   // v7.16 베테랑 또는 사격 A 이상 (친칠라 · 궁수 · 노먼)
const suppOK = u => isFar(u) && suppSkill(u) && u.ammo !== 0 && !u.crawl;
// v7.16 견제사격 = 그 자리 쪽으로 곧게 (직사 — 방패 · 몸에 막히고 엎드린 몸 위로 넘어감) · 지역사격 = 그 자리 바닥에 곡사로 떨굼 (활만 — 방패 너머 · 엎드린 몸 · 흩어짐). 총은 지역사격 = 견제사격. o.arc 가 없으면 (옛 명령) 활은 곡사
const suppArc = (u, o) => !!u.lob && !(o && o.arc === false);""")
s = rep(s, "  if (!o.on){ o.on = true; o.left = o.n || SU.n || 3; o.fired = 0; o.hits = 0; o.t0 = W.t; L(W, { k: 'supp', a: u.i, x: +o.x.toFixed(1), y: +o.y.toFixed(1), n: o.left, ai: !!o.ai, arc: !!u.lob, hid: !!o.hid, vis: u.side === 0 || !!u.seenBy }); }",
        "  const arc = suppArc(u, o);\n  if (!o.on){ o.on = true; o.left = o.n || SU.n || 3; o.fired = 0; o.hits = 0; o.t0 = W.t; L(W, { k: 'supp', a: u.i, x: +o.x.toFixed(1), y: +o.y.toFixed(1), n: o.left, ai: !!o.ai, arc, area: !!o.arc, hid: !!o.hid, vis: u.side === 0 || !!u.seenBy }); }")
s = rep(s, "  if (!suppOK(u)){ fin(!isFar(u) ? '사수가 아님' : !u.vet ? '베테랑만 할 수 있음' : '탄이 없음'); return; }",
        "  if (!suppOK(u)){ fin(!isFar(u) ? '사수가 아님' : !suppSkill(u) ? '베테랑 · 사격 A 이상만 할 수 있음' : '탄이 없음'); return; }")
s = rep(s, "  if (u.lob && !losClear(W.map, u.x, u.y, o.x, o.y)){ fin('바위 너머는 못 넘김 (굴 천장)'); return; }   // v7.12",
        "  if (arc && !losClear(W.map, u.x, u.y, o.x, o.y)){ fin('바위 너머는 못 넘김 (굴 천장)'); return; }   // v7.12")
s = rep(s, "  const ff = u.lob ? W.units.find(", "  const ff = arc ? W.units.find(")
s = rep(s, "  fire(W, u); if (u.lob) launchArcAt(W, u, A.px, A.py, A.so); else launchAt(W, u, A.px, A.py, A.so);",
        "  fire(W, u); if (suppArc(u, A.so)) launchArcAt(W, u, A.px, A.py, A.so); else launchAt(W, u, A.px, A.py, A.so); /* v7.16 지역사격 (곡사) / 견제사격 (직사) */")
# 적: 궁수는 상황 따라 고름 · 총도 안 자리를 직사로
s = rep(s, "    if (hs && !u.lob) continue;   // 안 자리 면 제압은 곡사 (활) 만\n", "")
s = rep(s, "    u.suppCd = W.t + (SU.cd || 6);\n    const lk = u === C ? { p: 1, t: 0 } : cmdLink(W, C, u);   // v7.13 지휘망\n    if (W.rand() < lk.p) u.suppPend = { x, y, at: W.t + lk.t, hid: !!hs };",
        """    u.suppCd = W.t + (SU.cd || 6);
    const busy = W.units.some(f => f.alive && f !== u && segDp(f, u.x, u.y, x, y) < f.r + 0.45 && (f.side === u.side || ((f.shield || f.armShield || f.bodyShield) && canSee(W, u, f)))), arc = !!u.lob && (!!hs || busy);   // v7.16 궁수: 숨은 사수의 안 자리 · 사선에 동료나 방패가 있으면 지역사격 (곡사) · 아니면 견제사격 (직사)
    const lk = u === C ? { p: 1, t: 0 } : cmdLink(W, C, u);   // v7.13 지휘망
    if (W.rand() < lk.p) u.suppPend = { x, y, at: W.t + lk.t, hid: !!hs, arc };""")
s = rep(s, "u.supp = { x: P.x, y: P.y, n: (SUP(W) || {}).n || 3, ai: true, hid: !!P.hid }; }",
        "u.supp = { x: P.x, y: P.y, n: (SUP(W) || {}).n || 3, ai: true, hid: !!P.hid, arc: P.arc !== undefined ? !!P.arc : undefined }; }")
s = rep(s, "cmdLinkM: cmdLink, ffOdds,", "cmdLinkM: cmdLink, ffOdds, suppArc, suppOK,")
wr('rt3_tail.js', s)
print('patch716 OK')
