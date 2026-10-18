# v7.22.1 엔진 — patch7221.py v1.0 (회복약: 가방의 회복약을 마심 (명령 · 들기와 같은 길) — 마시는 데 drink 초 (그동안 멈춤) · 최대 체력 × heal (min ~ cap) 만큼 회복 · 양쪽 같은 규칙 (적은 지니지 않음))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "  camp: { band: 0.9 },", "  camp: { band: 0.9 },\n  potion: { heal: 0.3, min: 20, cap: 80, drink: 1.0 },   /* v7.22.1 회복약: 최대 체력 × heal (min ~ cap) · 마시는 데 drink 초 (그동안 멈춤) */")
wr('rt3_head.js', h)

s = rd('rt3_tail.js')
s = rep(s, "function invOrder(W, u, o){\n  u.order = null; const it = (u.bag || []).find(x => x.uid === o.uid);",
    "function invOrder(W, u, o){\n  u.order = null; const it = (u.bag || []).find(x => x.uid === o.uid);\n  if (it && it.k === 'potion'){ if (u.act && u.act.phase === 'wind' && u.act.k !== 'charge') u.act = null; if (!u.act){ u.act = { k: 'drink', phase: 'wind', t0: W.t, end: W.t + ((W.rules.potion || {}).drink || 1), it }; stop(u); setMood(W, u, (it.label || it.name) + ' 마시는 중'); } return; }   // v7.22.1 회복약")
s = rep(s, "  if (u.act.k === 'bagSwap'){ resolveSwap(W, u); return; }   // v7.20", "  if (u.act.k === 'bagSwap'){ resolveSwap(W, u); return; }   // v7.20\n  if (u.act.k === 'drink'){ resolveDrink(W, u); return; }   // v7.22.1")
s = rep(s, "function resolveSwap(W, u){", r"""// v7.22.1 회복약을 다 마심: 가방에서 빠지고 최대 체력 × heal (min ~ cap) 만큼 (최대 체력까지)
function resolveDrink(W, u){
  const A = u.act, it = A.it; u.act = null; if (!u.alive || !u.bag) return; const k = u.bag.indexOf(it); if (k < 0) return;
  u.bag.splice(k, 1); const P = W.rules.potion || {}, amt = Math.round(Math.max(P.min != null ? P.min : 20, Math.min(P.cap != null ? P.cap : 80, u.max * (P.heal != null ? P.heal : 0.3)))), real = Math.max(0, Math.min(amt, u.max - u.hp));
  u.hp += real; L(W, { k: 'drink', a: u.i, w: it.label || it.name, amt: Math.round(real), hp: Math.round(u.hp), vis: u.side === 0 || !!u.seenBy });
}
function resolveSwap(W, u){""")
s = rep(s, "module.exports = { addUnit,", "module.exports = { resolveDrink, addUnit,")
wr('rt3_tail.js', s)
print('patch7221 OK')
