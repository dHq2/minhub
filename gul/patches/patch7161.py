# v7.16.1 엔진 — patch7161.py v1 (교전 금지는 싸움이 시작되면 한 번 판단 교전으로 풀림 · 포복 · 일어남도 명령 (지휘관을 거쳐 닿고 닿는 즉시 처리) · 자동 · 명령 취소 = 포복도 스스로 판단)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "  roe: { def: 'smart', chase: 6.5, odds: 0.9, out: 0.7, outLim: 4.5, impulse: 0.62, hitT: 6, noticeD: 10, selfD: 0.35, logGap: 6 },",
        "  roe: { def: 'smart', chase: 6.5, odds: 0.9, out: 0.7, outLim: 4.5, impulse: 0.62, hitT: 6, noticeD: 10, selfD: 0.35, logGap: 6, autoLift: true },   /* v7.16.1 autoLift 싸움이 시작되면 교전 금지 → 판단 교전 (한 번) */")
wr('rt3_head.js', h)

s = rd('rt3_tail.js')
# 누가 맞혔나 (우리가 먼저 침)
s = rep(s, "  t.hp -= real; t.hitT = W.t; t.hitFar = !!(o && o.far); u.dealt += real; t.taken += real;   // v7.11 hitFar",
        "  t.hp -= real; t.hitT = W.t; t.hitFar = !!(o && o.far); t.hitSide = u.side; u.dealt += real; t.taken += real;   // v7.11 hitFar   // v7.16.1 hitSide")
# 싸움이 시작되면 교전 금지 → 판단 교전 (한 번)
s = rep(s, "  if (open && !was) L(W, { k: 'engOpen', why: hit ? '동료가 맞음' : '적이 우리를 쫓음', odds: odds === Infinity ? null : +odds.toFixed(2), nF: foes.length, vis: true });\n}",
        """  if (open && !was) L(W, { k: 'engOpen', why: hit ? '동료가 맞음' : '적이 우리를 쫓음', odds: odds === Infinity ? null : +odds.toFixed(2), nF: foes.length, vis: true });
  roeLift(W, open, hit);
}
/* v7.16.1 교전 금지는 싸움 전의 태세: 싸움이 시작되면 (전선이 열림 — 동료가 맞음 · 적이 우리를 쫓음 — 또는 우리가 먼저 맞힘) 교전 금지인 아군 모두 판단 교전으로 (전달 없이 · 한 번만).
   가는 중인 교전 금지 지시도 판단 교전으로 바뀜. 그 뒤에 다시 교전 금지를 주면 그대로 지킴 */
function roeLift(W, open, hit){
  const R = W.rules.roe || {}; if (W.battle0 != null || R.autoLift === false) return;
  const first = !open && W.units.some(f => f.alive && f.side === 1 && f.hitSide === 0 && W.t - (f.hitT == null ? -99 : f.hitT) < 1);
  if (!open && !first) return;
  W.battle0 = W.t; const A = [], P = [];
  for (const a of W.units){ if (a.side !== 0 || !a.alive) continue;
    if (roeOf(W, a) === 'hold'){ a.roe = 'smart'; a.roeAuto = W.t; A.push(a.i); }
    for (const q of a.posPend || []) if (q.key === 'roe' && q.val === 'hold'){ q.val = 'smart'; if (!A.includes(a.i)) P.push(a.i); } }
  if (A.length || P.length) L(W, { k: 'roeAuto', a: A, pend: P, why: first ? '우리가 먼저 침' : hit ? '동료가 맞음' : '적이 우리를 쫓음', vis: true });
}""")
# 포복 · 일어남 = 태세처럼 지휘관을 거쳐 닿는 명령 (닿으면 바로)
s = rep(s, "const POSTURES = { roe: ['free', 'smart', 'hold', 'nofire'], heal: ['dying', 'free', 'order'], sq: ['main', 'dep'] };",
        "const POSTURES = { roe: ['free', 'smart', 'hold', 'nofire'], heal: ['dying', 'free', 'order'], sq: ['main', 'dep'], lie: ['down', 'up'] };   // v7.16.1 포복 · 일어남")
s = rep(s, "function applyPosture(W, u, key, val, c){\n",
        "function applyPosture(W, u, key, val, c){\n  if (key === 'lie'){ lieSet(W, u, val === 'down', '명령'); return; }   /* v7.16.1 포복 · 일어남 명령이 닿음 — 제자리처럼 바로 */\n")
s = rep(s, "o: (P.key === 'roe' ? ROE_TXT[P.val] : '치료 방침') + ' 태세', vis: true }); } }",
        "o: P.key === 'lie' ? (P.val === 'down' ? '엎드려 (포복)' : '일어나') : (P.key === 'roe' ? ROE_TXT[P.val] : P.key === 'sq' ? '편대' : '치료 방침') + ' 태세', vis: true }); } }   /* v7.16.1 포복 · 편대 이름 */")
# 자동 · 명령 취소가 닿으면 포복도 스스로 판단 (명령으로 엎드린 몸 — 사격이 멎으면 일어남)
s = rep(s, "    if (P.ok){ u.order = P.o; u.ordLive = P.o; u.missT = null; preempt(W, u);",
        "    if (P.ok){ u.order = P.o; u.ordLive = P.o; u.missT = null; preempt(W, u); if (!P.o) lieFree(W, u);")
s = rep(s, "function lieGate(W, u, why){",
        "function lieFree(W, u){ if (u.lie && !u.lieSw && u.lieAuto == null) u.lieAuto = W.t; }   /* v7.16.1 명령으로 엎드린 몸을 스스로 판단에 맡김 (조용하면 일어남) */\nfunction lieGate(W, u, why){")
s = rep(s, "ordFxAdd, evadeMove, kiteMove, slipMove };", "ordFxAdd, evadeMove, kiteMove, slipMove, roeLift, lieFree, applyPosture, POSTURES };")
wr('rt3_tail.js', s)
print('patch7161 OK')
