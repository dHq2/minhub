def rep(path, a, b, n=1):
    s = open(path).read(); c = s.count(a); assert c == n, (path, a[:90], c); open(path, 'w').write(s.replace(a, b))
T, H = 'rt3_tail.js', 'rt3_head.js'
rep(H, "   v6.7.3: 단검 =", "   v6.7.4: [도약] = 앞 · 뒤 · 옆 어디로든 단숨에 뛰는 이동 기술 — 명령은 바닥 (그 자리로) · 적 (그 적에게 뛰어듦), 스스로는 근접이 오면 뒤로 (사수) · 다쳐서 빠질 때 뒤로 · 돌진 예고선에서 옆으로 · 달아나는 사수 · 빈틈의 상대에게 앞으로 (근접) · 막고 선 방패 옆으로 돌아 들어감.\n   v6.7.3: 단검 =")
rep(H, "  leap: { dist: 1.7, time: 0.3, cd: 1.1, near: 2.2 },   // [도약]: 근접 상대가 near 칸 안으로 오면 뒤로 dist 칸을 time 초에 뛰어 물러남 (cd 초마다)",
       "  leap: { dist: 1.7, time: 0.3, cd: 1.1, near: 2.2 },   // [도약]: 앞 · 뒤 · 옆 어디로든 dist 칸을 time 초에 뜀 (cd 초마다) — 사수는 근접 상대가 near 칸 안으로 오면 뒤로 (v6.7.4 방향 자유)")
# startLeap log dir
rep(T, "  L(W, { k: 'leap', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); setMood(W, u, '뒤로 도약', t.i);", "  L(W, { k: 'leap', a: u.i, b: t.i, dir: 'back', vis: u.side === 0 || !!u.seenBy }); setMood(W, u, '뒤로 도약', t.i);")
# leapTo + helpers after stepLeap
rep(T, "function stepLeap(W, u, dt){",
"""// v6.7.4 [도약] = 앞 · 뒤 · 옆 어디로든: (x, y) 쪽으로 dist 칸까지 (바위 · 막힌 길이면 짧게). dir = fwd (그 상대에게 뛰어듦) · back · side · pt (바닥 자리)
function leapTo(W, u, x, y, dir, t, why){
  const R = W.rules.leap || {}, D = R.dist || 1.7, dx = x - u.x, dy = y - u.y, l = Math.hypot(dx, dy);
  if (l < 0.2 || u.crawl || u.kb) return false;
  const k = Math.min(1, D / l); let tx = u.x + dx * k, ty = u.y + dy * k;
  for (let s = 0; s < 6 && (boxRock(W, tx, ty, u.r * 0.9) || !fatClear(W.map, u.x, u.y, tx, ty, u.r * 0.8)); s++){ tx = u.x + (tx - u.x) * 0.75; ty = u.y + (ty - u.y) * 0.75; }
  const len = Math.hypot(tx - u.x, ty - u.y); if (boxRock(W, tx, ty, u.r * 0.9) || len < 0.3) return false;
  u.act = { k: 'leap', phase: 'run', t0: W.t, end: W.t + (R.time || 0.3) * Math.max(0.5, len / D), fx: u.x, fy: u.y, tx, ty, b: t ? t.i : null, dir };
  u.leapCd = W.t + (R.cd || 1.1); stop(u); u.fg = t && dir !== 'fwd' ? Math.atan2(t.y - u.y, t.x - u.x) : Math.atan2(ty - u.y, tx - u.x);
  L(W, { k: 'leap', a: u.i, b: t ? t.i : null, dir, why: why || '', x: +tx.toFixed(2), y: +ty.toFixed(2), len: +len.toFixed(2), vis: u.side === 0 || !!u.seenBy });
  setMood(W, u, { fwd: '앞으로 도약', back: '뒤로 도약', side: '옆으로 도약' }[dir] || '도약', t ? t.i : null);
  return true;
}
// 찍은 자리가 가까운 적에 견줘 앞 · 뒤 · 옆 어느 쪽인가 (적이 없으면 pt)
function leapDir(W, u, x, y){ const f = W.units.filter(o => o.alive && o.side !== u.side && (u.side === 0 ? o.seenBy : canSee(W, u, o))).sort((a, b) => dist(u, a) - dist(u, b))[0]; if (!f) return 'pt'; const d = angDiff(Math.atan2(y - u.y, x - u.x), Math.atan2(f.y - u.y, f.x - u.x)); return d < 1.05 ? 'fwd' : d > 2.1 ? 'back' : 'side'; }
// 상대에게 뛰어들 때 내릴 자리: 몸이 닿기 바로 앞
const leapIn = (u, t) => { const d = dist(u, t) || 1; return { x: t.x - (t.x - u.x) / d * (t.r + u.r + 0.04), y: t.y - (t.y - u.y) / d * (t.r + u.r + 0.04) }; };
// 스스로: 나를 노린 돌진 (예고 · 달려오는 중) 을 보면 옆으로 뜀 (명령으로 움직이는 중엔 안 함 — 플레이어의 선택)
function leapAside(W, u){
  if (u.order && !['attack', 'hold'].includes(u.order.k)) return false;
  const e = W.units.find(f => f.alive && f.side !== u.side && f.act && f.act.k === 'charge' && f.act.b === u.i && (f.act.phase === 'wind' || dist(f, u) > 1.2) && aware(W, u, f)); if (!e) return false;
  const a = Math.atan2(u.y - e.y, u.x - e.x), D = (W.rules.leap || {}).dist || 1.7, s0 = W.rand() < 0.5 ? 1 : -1;
  for (const s of [s0, -s0]) if (leapTo(W, u, u.x + Math.cos(a + s * Math.PI / 2) * D, u.y + Math.sin(a + s * Math.PI / 2) * D, 'side', e, '돌진 길에서 옆으로')) return true;
  return false;
}
// 스스로 (근접): 달아나는 사수 · 다른 이를 치려는 · 넘어진 상대에게 앞으로 뛰어듦 (내릴 자리 둘레에 다른 적 손이 둘 넘게 닿으면 안 함)
function pounce(W, u, t){
  if (!u.canLeap || u.crawl || W.t < u.leapCd || AI6.includes('pounce') || isFar(u)) return false;
  const D = (W.rules.leap || {}).dist || 1.7, g = gap(u, t); if (g <= u.rng + 0.5 || g > D + u.rng) return false;
  const away = Math.hypot(t.vx || 0, t.vy || 0) > 1.2 && ((t.vx || 0) * (t.x - u.x) + (t.vy || 0) * (t.y - u.y)) > 0;
  const why = isFar(t) ? '사수에게 뛰어듦' : away ? '달아나는 상대를 덮침' : t.act && t.act.phase === 'wind' && t.act.b !== u.i ? '빈틈에 뛰어듦' : prone(W, t) ? '넘어진 상대를 덮침' : null; if (!why) return false;
  const p = leapIn(u, t); if (W.units.filter(f => f.alive && f !== t && f.side !== u.side && !isFar(f) && Math.hypot(f.x - p.x, f.y - p.y) < f.rng + f.r + u.r + 0.4).length >= 2) return false;
  return leapTo(W, u, p.x, p.y, 'fwd', t, why);
}
function stepLeap(W, u, dt){""")
# order
s = open(T).read(); i = s.index("  if (o.k === 'leap'){"); j = s.index("  if (o.k === 'line' && o.join)", i)
s = s[:i] + """  if (o.k === 'leap'){
    // v6.7.4 도약 명령: 찍은 바닥 · 적 쪽으로 (앞 · 옆 · 뒤 어디든). 대기 중이면 기다렸다 뜀. 자리가 없는 예전 명령은 가장 가까이 보이는 적에게서 뒤로
    if (!u.canLeap || u.crawl){ u.order = null; return; }
    if (W.t < u.leapCd){ stop(u); setMood(W, u, '도약 준비'); return; }
    const t = o.b != null ? W.units[o.b] : null;
    if (o.b != null){ u.order = null; if (t && t.alive){ const p = leapIn(u, t); if (!leapTo(W, u, p.x, p.y, 'fwd', t, '명령')) L(W, { k: 'stuck', a: u.i }); } return; }
    if (o.x != null){ u.order = null; if (leapTo(W, u, o.x, o.y, leapDir(W, u, o.x, o.y), null, '명령')) u.stay = { x: u.act.tx, y: u.act.ty }; else L(W, { k: 'stuck', a: u.i }); return; }
    const f = foes.filter(f => canSee(W, u, f)).sort((a, b) => dist(u, a) - dist(u, b))[0];
    u.order = null; if (f) startLeap(W, u, f);
    return;
  }
""" + s[j:]
open(T, 'w').write(s)
# auto: side leap vs charge (before tryDodge), pounce (melee go), midfield flank
rep(T, "  if (tryDodge(W, u)) return;   // v5.2 피하기", "  if (u.canLeap && !u.crawl && W.t >= u.leapCd && !AI6.includes('sidel') && leapAside(W, u)) return;   // v6.7.4 돌진 길에서 옆으로 도약\n  if (tryDodge(W, u)) return;   // v5.2 피하기")
s = open(T).read(); i = s.index("    setMood(W, u, ordered ? '공격' : cornered(W, u) ? u.cornerK"); s = s[:i] + "    if (!u.order && pounce(W, u, t)) return;   // v6.7.4 앞으로 도약 (달아나는 사수 · 빈틈 · 넘어진 상대)\n" + s[i:]; open(T, 'w').write(s)
rep(T, "  setMood(W, u, '돌파', G.i); goTo(W, u, best.x, best.y, dt);", "  if (u.canLeap && !u.crawl && W.t >= u.leapCd && !AI6.includes('pounce') && Math.hypot(best.x - u.x, best.y - u.y) <= ((W.rules.leap || {}).dist || 1.7) + 0.2 && leapTo(W, u, best.x, best.y, 'side', G, '방패 옆으로 돌아 들어감')) return true;   // v6.7.4 옆으로 도약\n  setMood(W, u, '돌파', G.i); goTo(W, u, best.x, best.y, dt);")
rep(T, "const orderTxt = (o, u) => o && o.k === 'palm' ? ['palm', o.b] :", "const orderTxt = (o, u) => o && o.k === 'leap' ? (o.b != null ? ['leap', o.b] : o.x != null ? ['leapPt', +o.x.toFixed(2), +o.y.toFixed(2)] : ['leap0']) : o && o.k === 'palm' ? ['palm', o.b] :")
rep(T, "module.exports = { evadeP,", "module.exports = { leapTo, leapDir, pounce, leapAside, evadeP,")
print('engine ok')
