# v7.14.0 엔진 — patch714.py v1.1 (v1.1: 야시 S 줄 가운데 // 주석 → /* */ · v1.2: 손짓 전달 야시 S · v1.3: 숨지 않을 때의 은신 등급 (stealthP) — 어둠 속 보이는 거리 ×)
# 은신 등급 (S ~ E) · 도약 중 사격 (활) · 야시 S · 친칠라의 하얀 나무 (장궁)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "'활':{rng:6, ammo:30, aim:0.5, vel:240, P:70, draw:0.15, kind:'활', pen:0.65, penK:0.85, jit:0.35}",
        "'활':{rng:6, ammo:30, aim:0.5, vel:240, P:70, draw:0.15, kind:'활', pen:0.65, penK:0.85, jit:0.35}, '하얀 나무':{rng:10, ammo:30, aim:0.5, vel:200, P:55, draw:0.15, kind:'활', pen:0.55, penK:0.85, jit:0.35}")
h = rep(h, "'급소': { S: 0.25, A: 0.18, B: 0.12, C: 0.06 } },", "'급소': { S: 0.25, A: 0.18, B: 0.12, C: 0.06 }, '은신': { S: 1, A: 0.85, B: 0.7, C: 0.55, D: 0.4, E: 0.3 } },   // v7.14 [은신X] = 숨는 솜씨 (몸 · 직업 · 갑옷으로 어림하던 것 대신) — E 는 어둠 속에 가만히 있을 때만")
h = rep(h, "  darkHit: { A: 0.95, B: 0.9, C: 0.88, D: 0.85,", "  darkHit: { S: 1, A: 0.95, B: 0.9, C: 0.88, D: 0.85,")
h = rep(h, "  leap: { dist: 1.7, time: 0.3, cd: 1.1, near: 2.2, flank: { cd: 3, chk: 0.4, ang: [1.9, 2.6] } },",
        "  leap: { dist: 1.7, time: 0.3, cd: 1.1, near: 2.2, flank: { cd: 3, chk: 0.4, ang: [1.9, 2.6] }, shotAt: 0.5, shotAim: 0.6 },   // v7.14 활은 도약 중에도 쏨 (뛴 shotAt 쯤 · 조준 × shotAim)")
h = rep(h, "busySign: 0.7, retry: 1.2, nv: { A: 0.85, B: 0.7, C: 0.6, D: 0.5 } },", "busySign: 0.7, retry: 1.2, nv: { S: 0.9, A: 0.85, B: 0.7, C: 0.6, D: 0.5 } },")
h = rep(h, "back: 1, dim: 0.5, min: 0.2, feel: 0.3 },", "back: 1, dim: 0.5, min: 0.2, feel: 0.3, passive: { k: 0.25, mid: 0.6 } },   // v7.14 passive: 숨지 않을 때도 [은신X] 가 어둠 속 보이는 거리를 × (1 − (솜씨 − mid) × k) · 1 넘게는 안 늘림 (S 0.9 · A 0.94 · B 0.975)")
wr('rt3_head.js', h)
m = rd('rt3_mid.js')
m = rep(m, "if (!glowAt(W, t.x, t.y)){ if (!u.nv) return false; if (glareAt(W, u) && d > glareReach(W, u) * sk) return false; if (u.nvG === 'B' && d > (W.rules.nvB || 5) * sk) return false; if (u.nvG === 'C' && d > (W.rules.nvC || 3.75) * sk) return false; if (u.nvG === 'D' && d > (W.rules.nvD || 2.5) * sk) return false; }",
        "if (!glowAt(W, t.x, t.y)){ if (!u.nv) return false; const sp = sk >= 1 && t.stealthG && t.side !== u.side ? stealthP(W, t) : 1, sq = sk * sp; /* v7.14 숨지 않아도 은신 등급만큼 어둠 속에선 덜 멀리 보임 */ if (sp < 1 && d > W.rules.sight * sp) return false; if (glareAt(W, u) && d > glareReach(W, u) * sq) return false; if (u.nvG === 'B' && d > (W.rules.nvB || 5) * sq) return false; if (u.nvG === 'C' && d > (W.rules.nvC || 3.75) * sq) return false; if (u.nvG === 'D' && d > (W.rules.nvD || 2.5) * sq) return false; }")
wr('rt3_mid.js', m)

s = rd('rt3_tail.js')
# 야시 S
s = rep(s, "nvG: p.nv ? (p.nvG === 'A' ? 'A' : p.nvG === 'C' ? 'C' : p.nvG === 'D' ? 'D' : 'B') : '',", "nvG: p.nv ? (p.nvG === 'S' ? 'S' : p.nvG === 'A' ? 'A' : p.nvG === 'C' ? 'C' : p.nvG === 'D' ? 'D' : 'B') : '', /* v7.14 야시 S */")
s = rep(s, "const glareAt = (W, u) => !!W.rules.glare && !AI6.includes('glare') &&", "const glareAt = (W, u) => !!W.rules.glare && !AI6.includes('glare') && u.nvG !== 'S' &&")
# 은신 등급
s = rep(s, "function stealthOf(W, u){ const S = STL(W), g = (u.gear || {})['몸'];",
        "function stealthOf(W, u){ const tg = (u.traits || []).find(t => /^은신[SABCDE]$/.test(t)); if (tg){ u.stealthG = tg.slice(-1); const G = (W.rules.grades || {})['은신'] || {}; return Math.max(0, Math.min(1, G[u.stealthG] != null ? G[u.stealthG] : 0.6)); }   // v7.14 [은신X]\n  const S = STL(W), g = (u.gear || {})['몸'];")
s = rep(s, "function stealthK(W, t){\n", """// v7.14 숨지 않을 때의 은신 등급 (어둠 속 · 횃불 끔 · 뛰지 않음 · 방금 치지 않음): 보이는 거리 × — 등 뒤 안 보임 (숨은 몸) 은 아님
function stealthP(W, t){
  const S = STL(W), P = S.passive; if (!P || !t.stealthG || AI6.includes('stealth') || (t.torch && !t.torchOff) || W.t - (t.revealT == null ? -9 : t.revealT) < (S.reveal || 2) || (t.order && t.order.hurry) || (t.mv && t.mv.run && W.t < t.mv.until)) return 1;
  if (t.stealthG === 'E' && Math.hypot(t.vx || 0, t.vy || 0) > 0.2) return 1;
  return Math.min(1, 1 - ((t.stealthE || 0) - (P.mid != null ? P.mid : 0.6)) * (P.k || 0.25));
}
function stealthK(W, t){\n""")
s = rep(s, "function stealthK(W, t){\n", "function stealthK(W, t){\n  if (t.stealthG === 'E' && (glowAt(W, t.x, t.y) || Math.hypot(t.vx || 0, t.vy || 0) > 0.2)) return 1;   // v7.14 [은신E] — 어둠 속에 가만히 있을 때만\n")
s = rep(s, "* ((t.h || 1.7) >= 2.2 ? LL.spotBig || 3 : 1) * stealthK(W, t));",
        "* ((t.h || 1.7) >= 2.2 ? LL.spotBig || 3 : 1) * stealthK(W, t) * (t.stealthG ? Math.max(0.5, Math.min(1.3, 1.5 - (t.stealthE || 0))) : 1));   // v7.14 은신 등급은 숨지 않을 때도 엎드린 몸을 덜 들키게")
# 도약 중 사격 (활)
s = rep(s, "function stepLeap(W, u, dt){\n  const A = u.act, q = Math.min(1, (W.t - A.t0) / Math.max(0.05, A.end - A.t0));\n  tryMove(W, u, A.fx + (A.tx - A.fx) * q, A.fy + (A.ty - A.fy) * q);\n",
        """function stepLeap(W, u, dt){
  const A = u.act, q = Math.min(1, (W.t - A.t0) / Math.max(0.05, A.end - A.t0));
  tryMove(W, u, A.fx + (A.tx - A.fx) * q, A.fy + (A.ty - A.fy) * q);
  if (A.k === 'leap' && !A.shot && u.lob && q >= ((W.rules.leap || {}).shotAt || 0.5)) leapShot(W, u, A);   // v7.14 도약 사격
""")
s = rep(s, "// 돌진: 곧은 길로 속력 ×spd.", """// v7.14 활은 도약 중에도 쏨 (도약 사격): 뛰게 만든 상대 (보이고 사거리 안) — 없으면 가장 가까이 보이는 상대. 조준 × shotAim · 교전 규칙이 막으면 안 쏨
function leapShot(W, u, A){
  A.shot = true; const LP = W.rules.leap || {}; if (u.ammo === 0 || (u.weaponNow && u.weaponNow !== u.weapon) || (u.arms && (u.arms.L || u.arms.R))) return;
  const okT = f => f && f.alive && !f.down && f.side !== u.side && canSee(W, u, f) && gap(u, f) <= u.rng && !(u.side === 0 && roeBlock(W, u, f, 'fire'));
  let t = A.b != null ? W.units[A.b] : null; if (!okT(t)) t = W.units.filter(okT).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (!t) return;
  fire(W, u); launch(W, u, t, 1, LP.shotAim || 0.6); if (u.ammo === 0) outOfAmmo(W, u);
  L(W, { k: 'leapShot', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy || !!t.seenBy });
}
// 돌진: 곧은 길로 속력 ×spd.""")
wr('rt3_tail.js', s)
print('patch714 engine OK')
