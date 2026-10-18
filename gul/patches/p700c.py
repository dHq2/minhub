p='rt3_tail.js'; s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:90],s.count(a)); s=s.replace(a,b)
rep("  u.act = { k: heal ? 'heal' : 'atk', b: t.i, phase: 'wind', t0: W.t, end: W.t + wind, why: heal ? '' : why || '', mode };\n  u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u); u.waitT = 0;",
    "  const sm = !heal && t.side !== u.side && isFar(u) ? shotMode(W, u, t) : null, smW = sm ? ((W.rules.sshot || {})[sm] || {}).wind || 1 : 1;   // v7.0 사격S: 조준사격 · 속사\n  u.act = { k: heal ? 'heal' : 'atk', b: t.i, phase: 'wind', t0: W.t, end: W.t + wind * smW, why: heal ? '' : why || '', mode, sm };\n  u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u); u.waitT = 0;\n  if (!heal && sm !== 'aimed' && sGrade(u) && u.side === 1 && !u.order && !AI6.includes('strafe')) setStrafe(W, u, t, wind * smW + u.rec);   // v7.0 이동 사격: 당기는 동안 옆으로")
rep("  L(W, { k: 'wind', a: u.i, b: t.i, heal, mode, w: u.weaponNow || u.weapon || '', end: +(W.t + wind).toFixed(2),",
    "  L(W, { k: 'wind', a: u.i, b: t.i, heal, mode, sm, mv: !!(u.strafe && W.t < u.strafe.until), w: u.weaponNow || u.weapon || '', end: +(W.t + wind * smW).toFixed(2),")
rep("  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind, heal, mode });", "  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind * smW, heal, mode });")
rep("      launch(W, u, t, n > 1 ? wp.burstMul || 0.65 : 1, 1, A.arc);",
    "      const SS = (R.sshot || {})[A.sm] || {}, mvA = u.strafe && W.t < u.strafe.until ? ((R.sshot || {}).move || {}).aim || 0.88 : 1;   // v7.0 쏘기 방식 · 이동 사격\n      launch(W, u, t, n > 1 ? wp.burstMul || 0.65 : 1, (SS.aim || 1) * mvA, A.arc, SS.pm || 1);")
rep("    A.phase = 'rec'; A.end = W.t + u.rec * (far ? 1 : wpnSpd(W, u)); A.t1 = W.t;   // v6.7 단검은 빨리 거둠",
    "    A.phase = 'rec'; A.end = W.t + u.rec * (far ? (A.sm === 'rapid' ? ((R.sshot || {}).rapid || {}).rec || 0.7 : 1) : wpnSpd(W, u)); A.t1 = W.t;   // v6.7 단검은 빨리 거둠   // v7.0 속사는 빨리 다음 화살")
rep("function launch(W, u, t, mul, pMul, arc){\n  if (arc){ launchArc(W, u, t, mul, pMul); return; }", "function launch(W, u, t, mul, pMul, arc, pm){\n  if (arc){ launchArc(W, u, t, mul, pMul, pm); return; }")
rep("left: u.rng + u.r + 2.5, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1 });", "left: u.rng + u.r + 2.5, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1 });")
rep("function launchArc(W, u, t, mul, pMul){", "function launchArc(W, u, t, mul, pMul, pm){")
rep("lx, ly, T, el: 0, q: 0, arc: true, sp: 0, left: 0, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1 });", "lx, ly, T, el: 0, q: 0, arc: true, sp: 0, left: 0, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1 });")
rep("true, { arc: true, jav: !!s.jav, kn: !!s.kn, mul: J ? (J.arc && J.arc.mul != null ? J.arc.mul : 0.95) : (A.mul != null ? A.mul : 0.85) * (s.mul || 1) });",
    "true, { arc: true, jav: !!s.jav, kn: !!s.kn, pm: s.pm || 1, mul: J ? (J.arc && J.arc.mul != null ? J.arc.mul : 0.95) : (A.mul != null ? A.mul : 0.85) * (s.mul || 1) });")
rep("true, s.jav ? { jav: true, kn: !!s.kn } : s.mul && s.mul !== 1 ? { mul: s.mul } : null);",
    "true, s.jav ? { jav: true, kn: !!s.kn } : (s.mul && s.mul !== 1) || (s.pm && s.pm !== 1) ? { mul: s.mul || 1, pm: s.pm || 1 } : null);")
rep("  if (u.act){ if (u.burst) tickBurst(W, u); if (u.act && W.t >= u.act.end) resolveAct(W, u); return; }",
    "  if (u.act){ if (u.burst) tickBurst(W, u); if (u.act && u.act.k === 'atk' && u.strafe && W.t < u.strafe.until && isFar(u)) strafeStep(W, u, dt); if (u.act && W.t >= u.act.end) resolveAct(W, u); return; }   // v7.0 이동 사격: 당기는 · 거두는 동안 옆으로")
rep("// v7.0 관통 판정 (원거리 · 던진 무기):", """// v7.0 사격S: 활을 쓰는 사격S 만 — 못 뚫을 갑옷 · 방패면 조준사격, 가깝거나 빨리 움직이면 속사
const sGrade = u => (u.marks || 0) >= 0.69 && /활/.test(u.weapon || '') && !u.weaponGone;
function shotMode(W, u, t){
  if (!sGrade(u) || !W.rules.pen || !W.rules.sshot || AI6.includes('sshot')) return null;
  const PN = W.rules.pen, dir = sideOf(W, t, u), it = t.gear && t.gear['몸'], wp = (W.rules.weapons || {})[u.weapon] || {};
  let A = it ? armorA(W, t, it, false) * (dir === 'side' ? PN.side || 0.7 : dir === 'back' ? PN.back || 0.6 : 1) : 0;
  if ((t.shield || t.armShield) && guardOn(W, t) && inGuard(W, t, u, true)) A = Math.max(A, t.armShield && !t.shield ? PN.armShield : PN.shield);
  const P = (wp.P || 70) * ((PN.bow || {}).S || 1);
  if (A >= P * 0.95) return 'aimed';
  if (gap(u, t) < 3 || Math.hypot(t.vx || 0, t.vy || 0) > 1.6) return 'rapid';
  return null;
}
// 이동 사격: 표적을 겨눈 채 옆으로 (번갈아 · 덜 위험한 쪽 · 바위 · 몸 피함)
function setStrafe(W, u, t, dur){
  const M = (W.rules.sshot || {}).move || {}, d = M.step || 1.1, a = Math.atan2(t.y - u.y, t.x - u.x), px = -Math.sin(a), py = Math.cos(a);
  u.strafeS = -(u.strafeS || 1);
  const cand = [u.strafeS, -u.strafeS].map(sg => ({ x: u.x + px * sg * d - Math.cos(a) * 0.25, y: u.y + py * sg * d - Math.sin(a) * 0.25 })).filter(p => p.x > 0.7 && p.y > 0.7 && p.x < W.map.W - 0.7 && p.y < W.map.H - 0.7 && !boxRock(W, p.x, p.y, u.r) && !W.units.some(o => o.alive && o !== u && Math.hypot(o.x - p.x, o.y - p.y) < o.r + u.r + 0.05));
  if (!cand.length){ u.strafe = null; return; }
  const p = cand.sort((p, q) => inflAt(W, u.side, p.x, p.y) - inflAt(W, u.side, q.x, q.y))[0];
  u.strafe = { x: p.x, y: p.y, until: W.t + dur };
}
function strafeStep(W, u, dt){
  const S = u.strafe, t = W.units[u.act.b]; if (Math.hypot(S.x - u.x, S.y - u.y) < 0.08){ u.strafe = null; return; }
  setGoal(W, u, S.x, S.y); follow(W, u, dt, ((W.rules.sshot || {}).move || {}).spd || 0.8); if (t && t.alive) u.fg = Math.atan2(t.y - u.y, t.x - u.x);
}
// v7.0 사선 안의 적: 아는 상대 사수 (총 · 활 · 창을 든 투창병) 의 사거리 + 2칸 안 · 사선이 열림 · 맞붙지 않음 → 지그재그로 질주
function underGun(W, u){
  if (u.side !== 1 || AI6.includes('weave') || !W.rules.weave) return false;
  if (W.t - (u.ugT == null ? -9 : u.ugT) < 0.25) return u.ug; u.ugT = W.t;
  const nr = W.rules.weave.near || 2;
  u.ug = !busyW(W, u) && W.units.some(f => f.alive && f.side !== u.side && ((isFar(f) && f.ammo !== 0) || (f.jav && f.spearHeld)) && (canSee(W, u, f) || fresh(W, u.sense[f.i], 2)) && dist(u, f) <= f.rng + f.r + u.r + nr && losClear(W.map, f.x, f.y, u.x, u.y));
  return u.ug;
}
const weaveAng = (W, u) => { const V = W.rules.weave; return V.amp * Math.sin(W.t * V.f1 + u.i * 1.9) + V.amp2 * Math.sin(W.t * V.f2 + u.i * 0.7); };
// v7.0 관통 판정 (원거리 · 던진 무기):""")
rep("""  let rem = spdNow(W, u) * dt * (slow || 1);
  while (rem > 0 && u.path.length){
    const w = u.path[0], d = Math.hypot(w.x - u.x, w.y - u.y);
    if (d < 0.05){ u.path.shift(); continue; }
    const s = Math.min(rem, d); u.fg = Math.atan2(w.y - u.y, w.x - u.x);""",
"""  let rem = spdNow(W, u) * dt * (slow || 1);
  const wv = u.side === 1 && !u.order && !u.act && !u.raised && underGun(W, u) ? weaveAng(W, u) : 0;   // v7.0 사선 안: 지그재그
  while (rem > 0 && u.path.length){
    const w = u.path[0], d = Math.hypot(w.x - u.x, w.y - u.y);
    if (d < 0.05){ u.path.shift(); continue; }
    if (wv && d > 0.6){ const ux = (w.x - u.x) / d, uy = (w.y - u.y) / d, c = Math.cos(wv), sn = Math.sin(wv), s2 = Math.min(rem, d * 0.5); u.fg = Math.atan2(w.y - u.y, w.x - u.x); tryMove(W, u, u.x + (ux * c - uy * sn) * s2, u.y + (ux * sn + uy * c) * s2); break; }
    const s = Math.min(rem, d); u.fg = Math.atan2(w.y - u.y, w.x - u.x);""")
rep("|| (u.mv && u.mv.run && W.t < u.mv.until)) ? (W.rules.run || 1.3) : 1)",
    "|| (u.mv && u.mv.run && W.t < u.mv.until) || (u.side === 1 && !u.order && u.ug && !u.raised && !u.act && W.t - (u.ugT == null ? -9 : u.ugT) < 0.5)) ? (W.rules.run || 1.3) : 1)")
open(p,'w').write(s); print('ok')
