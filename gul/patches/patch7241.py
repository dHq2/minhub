# v7.24.1 엔진 — patch7241.py v1.0 (모닝스타 철퇴 물리: 기본 공격 = 철퇴를 휙 던졌다 당겨 옴 (최대 2.3M) — 날아가는 공이 처음 닿는 적을 투사체처럼 맞힘 (피할 수 있음 · 방패로 막힘 · 동료는 비껴감) · 줄이 팽팽해지면 되돌아옴 · 바위에 막힘 · 공이 돌아와야 다음 공격 / 붙어 있으면 (0.9M 안) 휘두르고, 1.3M 안이면 가끔 (25%) 휘두름)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
FS = {k: open(D + k + '_v7240.js', encoding='utf-8').read() for k in ('rt3_head', 'rt3_mid', 'rt3_tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in FS.values())
    assert n == c, (n, c, a[:100])
    for k in FS:
        FS[k] = FS[k].replace(a, b)

rep("'모닝스타':{rng:1.3, kind:'둔기', spdW:1.15, kb:0.45}", "'모닝스타':{rng:2.3, kind:'둔기', spdW:1.15, kb:0.45, flail:{sw:1.3, close:0.9, swingP:0.25, v:13, back:11, ball:0.2, rec:0.15}}")
# 철퇴 무기인가 (제 무기를 든 채)
rep("const isFar = u => u.rng > 1 && !u.longReach;", "const isFar = u => u.rng > 1 && !u.longReach;\nconst flailOf = (W, u) => !u.weaponGone && !u.weaponNow ? (((W.rules.weapons || {})[u.weapon] || {}).flail || null) : null;   /* v7.24.1 철퇴 (던졌다 당겨 옴) */")
# 시작: 던질지 휘두를지 · 공이 아직 밖이면 기다림
rep("  const mode = !heal && u.canSweep && !isFar(u) ? swingPlan(W, u, t) : null, wind =",
    """  const FL = !heal && t.side !== u.side && !isFar(u) ? flailOf(W, u) : null;   /* v7.24.1 철퇴: 공이 돌아와야 다음 공격 · 붙어 있으면 휘두름 (가끔은 1.3M 안에서도) */
  if (FL && (W.flails || []).some(F => F.by === u.i)){ setMood(W, u, '철퇴를 거둠', t.i); return; }
  const fl = !!FL && gap(u, t) > (FL.close || 0.9) && !(gap(u, t) <= (FL.sw || 1.3) && W.rand() < (FL.swingP || 0.25));
  const mode = !heal && u.canSweep && !isFar(u) ? swingPlan(W, u, t) : null, wind =""")
rep("  u.act = { k: heal ? 'heal' : 'atk', b: t.i, phase: 'wind', t0: W.t, end: W.t + wind * smW, why: heal ? '' : why || '', mode, sm };",
    "  u.act = { k: heal ? 'heal' : 'atk', b: t.i, phase: 'wind', t0: W.t, end: W.t + wind * smW, why: heal ? '' : why || '', mode, sm, ...(fl ? { fl: true } : {}) };")
rep("  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind * smW, heal, mode });",
    "  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind * smW, heal, mode, ...(fl ? { fl: true } : {}) });")
# 풀림: 던짐
rep("    if (A.k === 'atk' && A.mode === 'sweep'){ heavyHit(W, u, t, 'sweep'); A.phase = 'rec'; A.end = W.t + u.rec; A.t1 = W.t; return; }",
    "    if (A.k === 'atk' && A.mode === 'sweep'){ heavyHit(W, u, t, 'sweep'); A.phase = 'rec'; A.end = W.t + u.rec; A.t1 = W.t; return; }\n    if (A.k === 'atk' && A.fl && t.alive && flailOf(W, u)){ throwFlail(W, u, t); A.phase = 'rec'; A.end = W.t + 3; A.t1 = W.t; return; }   /* v7.24.1 철퇴를 던짐 — 공이 돌아오면 끝 */")
# 휘두르기는 1.3M 까지만
rep("    else if (gap(u, t) > u.rng + (far ? 0.5 : R.reach)) why =",
    "    else if (gap(u, t) > (!far && flailOf(W, u) ? (flailOf(W, u).sw || 1.3) : u.rng) + (far ? 0.5 : R.reach)) why =")
# 공: 던짐 · 날아감 · 되돌아옴
rep("// 회전 투척이 날아감:", """// v7.24.1 철퇴 던지기: 손에서 노린 쪽으로 v M/초 — 줄 길이 (몸 반지름 + 사거리 + 공) 에 닿거나 처음 적 몸에 닿으면 (투사체처럼: 피할 수 있음 · 방패로 막힘) 되돌아옴 (back M/초) · 바위면 되돌아옴. 동료는 비껴감 (어깨 너머로)
function throwFlail(W, u, t){
  const FL = flailOf(W, u) || {}, lead = 0.12, tx = t.x + (t.vx || 0) * lead, ty = t.y + (t.vy || 0) * lead, d = Math.hypot(tx - u.x, ty - u.y) || 1, dx = (tx - u.x) / d, dy = (ty - u.y) / d;
  (W.flails || (W.flails = [])).push({ by: u.i, side: u.side, b: t.i, ox: u.x, oy: u.y, dx, dy, s: u.r * 0.6, L: u.r + u.rng + (FL.ball || 0.2), x: u.x + dx * u.r * 0.6, y: u.y + dy * u.r * 0.6, v: FL.v || 13, vb: FL.back || 11, br: FL.ball || 0.2, ph: 'out', hit: null, ev: [], t0: W.t });
  u.fg = u.face = Math.atan2(dy, dx); L(W, { k: 'flail', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy });
}
function stepFlails(W, dt){
  for (const F of W.flails){ const u = W.units[F.by]; if (!u || !u.alive){ F.done = true; continue; }
    if (F.ph === 'out'){ const s1 = Math.min(F.L, F.s + F.v * dt), x0 = F.x, y0 = F.y, x1 = F.ox + F.dx * s1, y1 = F.oy + F.dy * s1;
      if (rock(W.map, x1, y1)){ F.ph = 'back'; F.wall = true; continue; }
      let best = null, bt = 9;   // 길에 처음 닿는 적 몸 (선분 x0 → x1)
      for (const e of W.units){ if (!e.alive || e === u || e.side === F.side || e.lie || F.ev.includes(e.i) || (e.act && e.act.k === 'leap')) continue;
        const sx = x1 - x0, sy = y1 - y0, ll = sx * sx + sy * sy || 1e-9, k = Math.max(0, Math.min(1, ((e.x - x0) * sx + (e.y - y0) * sy) / ll)), px = x0 + sx * k - e.x, py = y0 + sy * k - e.y;
        if (px * px + py * py <= (e.r + F.br) * (e.r + F.br) && k < bt){ bt = k; best = e; } }
      F.s = s1; F.x = x1; F.y = y1;
      if (best){ const p = evadeP(W, best, u, 'shot', { sp: F.v });
        if (p && W.rand() < p){ F.ev.push(best.i); evaded(W, best, u, 'shot', '날아오는 철퇴를 피함', p); }
        else { strike(W, u, best, best, 1, false, { tag: '철퇴 던지기', wk: '둔기' }); F.hit = best.i; F.ph = 'back'; continue; } }
      if (F.s >= F.L - 1e-6) F.ph = 'back'; continue; }
    const hx = u.x, hy = u.y, d = Math.hypot(hx - F.x, hy - F.y), st = F.vb * dt;   // 되돌아옴: 지금 손 쪽으로
    if (d <= u.r * 0.6 + st){ F.done = true; if (u.act && u.act.k === 'atk' && u.act.fl && u.act.phase === 'rec') u.act.end = Math.min(u.act.end, W.t + ((flailOf(W, u) || {}).rec || 0.15)); continue; }
    F.x += (hx - F.x) / d * st; F.y += (hy - F.y) / d * st; }
  W.flails = W.flails.filter(F => !F.done);
}
// 회전 투척이 날아감:""")
rep("  if (W.spins && W.spins.length) stepSpins(W, dt);   // v7.22.2 회전 투척 (v7.22.3 피의 검기도)",
    "  if (W.spins && W.spins.length) stepSpins(W, dt);   // v7.22.2 회전 투척 (v7.22.3 피의 검기도)\n  if (W.flails && W.flails.length) stepFlails(W, dt);   /* v7.24.1 철퇴 */")
rep("module.exports = { circOv,", "module.exports = { flailOf, throwFlail, stepFlails, circOv,")
for k, v in FS.items():
    open(D + k + '.js', 'w', encoding='utf-8').write(v)
print('ok')
