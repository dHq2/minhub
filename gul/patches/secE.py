# ---------- E. 돌진 길 (ev715 A — v8.7.2 부터 남은 실패): 물러나는 사수가 나를 노린 돌진의 길 위로 곧장 뒷걸음질 → 받힘 (돌진은 달아나는 몸의 앞자리를 노림) ----------
# 물러날 자리는 돌진 길 (띠) 밖 옆으로 · 띠를 가로질러 건너편으로는 안 감 · 가던 자리가 띠 안이 되면 다시 고름 — 아군 (회피기동) · 적 궁수 (본능) 같은 규칙
rep("const evLog = (W, u, f, m, ex) =>",
    "// v8.7.4 돌진 길: 나를 노린 돌진 (준비 · 달림) 의 앞쪽 띠 (돌진하는 몸 + 내 몸 + 0.45칸 폭)\n"
    "function chargeLane(W, u, ok){ const c = W.units.find(e => e.alive && e.side !== u.side && e.act && e.act.k === 'charge' && (e.act.phase === 'run' || e.act.phase === 'wind') && e.act.b === u.i && ok(e)); if (!c) return null;\n"
    "  const A = c.act, a = A.phase === 'run' && A.dx != null ? Math.atan2(A.dy, A.dx) : Math.atan2(u.y - c.y, u.x - c.x);\n"
    "  return { c, x: c.x, y: c.y, dx: Math.cos(a), dy: Math.sin(a), w: c.r + u.r + 0.45 }; }\n"
    "const laneSide = (L, x, y) => (y - L.y) * L.dx - (x - L.x) * L.dy;   // 띠 가운데 줄의 어느 쪽 (부호) · 얼마나 (크기)\n"
    "const laneIn = (L, x, y) => (x - L.x) * L.dx + (y - L.y) * L.dy > -0.3 && Math.abs(laneSide(L, x, y)) < L.w;\n"
    "const laneOk = (L, u, x, y) => !laneIn(L, x, y) && !(Math.abs(laneSide(L, u.x, u.y)) > 0.05 && laneSide(L, x, y) * laneSide(L, u.x, u.y) < 0);   // 띠 밖 · 지금 있는 쪽 그대로 (띠를 가로지르지 않음)\n"
    "const evLog = (W, u, f, m, ex) =>")
# 아군 회피기동: 하던 물러나기를 이어 갈 때 — 가는 자리가 돌진 길 안 (또는 건너편) 이면 다시 고름
rep("""  if (u.mv && (u.mv.k === 'kite' || u.mv.k === 'slip' || u.mv.k === 'out') && W.t < u.mv.until && u.mv.ev){   // 하던 회피를 이어 감
    if (Math.hypot(u.mv.x - u.x, u.mv.y - u.y) > 0.12){ setMood(W, u, u.mv.m, u.mv.b); goTo(W, u, u.mv.x, u.mv.y, dt); return true; }
    u.mv = null; stop(u); }""",
"""  if (u.mv && (u.mv.k === 'kite' || u.mv.k === 'slip' || u.mv.k === 'out') && W.t < u.mv.until && u.mv.ev){   // 하던 회피를 이어 감
    const LN = chargeLane(W, u, f => canSee(W, u, f)); if (LN && !laneOk(LN, u, u.mv.x, u.mv.y)) u.mv = null;   /* v8.7.4 가는 자리가 돌진 길 안 (또는 건너편) — 다시 고름 */
    else if (Math.hypot(u.mv.x - u.x, u.mv.y - u.y) > 0.12){ setMood(W, u, u.mv.m, u.mv.b); goTo(W, u, u.mv.x, u.mv.y, dt); return true; }
    else { u.mv = null; stop(u); } }""")
rep("""  const g = gap(u, x), close = g < (K.close || 2.4), shot = (u.lastFireT != null ? u.lastFireT : -9) > (u.kiteT0 != null ? u.kiteT0 : -9);
  if (!close && !shot) return false;   // 쏜 다음에 물러남""",
"""  const g = gap(u, x), LN = chargeLane(W, u, seen), close = g < (K.close || 2.4), shot = (u.lastFireT != null ? u.lastFireT : -9) > (u.kiteT0 != null ? u.kiteT0 : -9);
  if (!close && !shot && !LN) return false;   // 쏜 다음에 물러남 — 나를 노린 돌진이면 쏘기 전에도 길 밖으로 (v8.7.4)""")
rep("""  const mc = mates.filter(m => !isFar(m)), base = Math.atan2(u.y - x.y, u.x - x.x), st = K.step || 2.2; let best = null, bs = -1e9;
  for (const da of [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = u.x + Math.cos(ang) * st, py = u.y + Math.sin(ang) * st;
    if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, u.r) || !fatClear(W.map, u.x, u.y, px, py, u.r * 0.8)) continue;
    if (W.units.some(f => seen(f) && !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - u.r < f.rng + 1.2)) continue;
    const sc = -Math.abs(da) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (sc > bs){ bs = sc; best = { x: px, y: py }; } }
  if (!best) return false;
  const rn = g > Math.max(K.runG != null ? K.runG : 1.6, x.rng + 1.15);   /* v7.17 리치만큼 */   // 가까우면 상대를 보며 뒷걸음 (등을 안 보임) · 여유가 있으면 뜀
  u.mv = { k: 'kite', ev: true, x: best.x, y: best.y, b: x.i, run: rn, until: W.t + (K.dur || 0.9), m: rn ? '거리 벌림 — 쏘고 물러남' : '거리 벌림 — 보며 뒷걸음' }; u.kiteT0 = W.t;
  if (W.t >= (u.kiteLogT || 0)){ u.kiteLogT = W.t + 4; evLog(W, u, x, 'kite'); }""",
"""  const mc = mates.filter(m => !isFar(m)), base = LN ? Math.atan2(LN.dy, LN.dx) : Math.atan2(u.y - x.y, u.x - x.x), st = K.step || 2.2; let best = null, bs = -1e9;
  for (const da of LN ? [1.57, -1.57, 1.2, -1.2, 1.9, -1.9, 0.8, -0.8] : [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = u.x + Math.cos(ang) * st, py = u.y + Math.sin(ang) * st;   /* v8.7.4 돌진이 오면 길의 옆으로 */
    if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, u.r) || !fatClear(W.map, u.x, u.y, px, py, u.r * 0.8)) continue;
    if (LN && !laneOk(LN, u, px, py)) continue;
    if (W.units.some(f => seen(f) && !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - u.r < f.rng + 1.2)) continue;
    const sc = -Math.abs(Math.abs(da) - (LN ? 1.57 : 0)) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (sc > bs){ bs = sc; best = { x: px, y: py }; } }
  if (!best) return false;
  const rn = !!LN || g > Math.max(K.runG != null ? K.runG : 1.6, x.rng + 1.15);   /* v7.17 리치만큼 */   // 가까우면 상대를 보며 뒷걸음 (등을 안 보임) · 여유가 있으면 뜀 · 돌진 길에선 뜀 (v8.7.4)
  u.mv = { k: 'kite', ev: true, lane: !!LN, x: best.x, y: best.y, b: LN ? LN.c.i : x.i, run: rn, until: W.t + (K.dur || 0.9), m: LN ? '돌진 길 밖으로 — 옆으로 빠짐' : rn ? '거리 벌림 — 쏘고 물러남' : '거리 벌림 — 보며 뒷걸음' }; u.kiteT0 = W.t;
  if (LN ? u.laneKey !== LN.c.i + ':' + LN.c.act.t0 : W.t >= (u.kiteLogT || 0)){ if (LN) u.laneKey = LN.c.i + ':' + LN.c.act.t0; else u.kiteLogT = W.t + 4; evLog(W, u, LN ? LN.c : x, 'kite', LN ? { lane: true } : null); }""")
# 적 궁수 카이팅 (본능) — 같은 규칙
rep("""    const close = gap(a, x) < 2.4, shot = (a.lastFireT != null ? a.lastFireT : -9) > (a.kiteT0 != null ? a.kiteT0 : -9);
    if (!close && (!shot || mine.some(o => o !== a && isFar(o) && o.alive && ((o.mv && o.mv.k === 'kite' && W.t < o.mv.until) || (o.act && o.act.k === 'leap'))))) continue;
    const mc = mine.filter(m => m !== a && !isFar(m)), base = Math.atan2(a.y - x.y, a.x - x.x); let best = null, bs = -1e9;
    for (const da of [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = a.x + Math.cos(ang) * 2.2, py = a.y + Math.sin(ang) * 2.2;
      if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, a.r)) continue;
      if (known.some(f => !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - a.r < f.rng + 1.2)) continue;
      const s = -Math.abs(da) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (s > bs){ bs = s; best = { x: px, y: py }; } }
    if (!best) continue; a.mv = { k: 'kite', x: best.x, y: best.y, b: x.i, run: true, until: W.t + 1.0 }; a.kiteT0 = W.t;
    if (W.t >= (a.kiteLogT || 0)){ a.kiteLogT = W.t + 5; L(W, { k: 'mvr', side: 1, m: 'kite', a: a.i, b: x.i, obs: !!a.seenBy, vis: true }); } }""",
"""    const LN = chargeLane(W, a, f => known.includes(f)), close = gap(a, x) < 2.4, shot = (a.lastFireT != null ? a.lastFireT : -9) > (a.kiteT0 != null ? a.kiteT0 : -9);   /* v8.7.4 나를 노린 돌진이면 길의 옆으로 (아군과 같은 규칙) */
    if (!LN && !close && (!shot || mine.some(o => o !== a && isFar(o) && o.alive && ((o.mv && o.mv.k === 'kite' && W.t < o.mv.until) || (o.act && o.act.k === 'leap'))))) continue;
    const mc = mine.filter(m => m !== a && !isFar(m)), base = LN ? Math.atan2(LN.dy, LN.dx) : Math.atan2(a.y - x.y, a.x - x.x); let best = null, bs = -1e9;
    for (const da of LN ? [1.57, -1.57, 1.2, -1.2, 1.9, -1.9, 0.8, -0.8] : [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = a.x + Math.cos(ang) * 2.2, py = a.y + Math.sin(ang) * 2.2;
      if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, a.r)) continue;
      if (LN && !laneOk(LN, a, px, py)) continue;
      if (known.some(f => !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - a.r < f.rng + 1.2)) continue;
      const s = -Math.abs(Math.abs(da) - (LN ? 1.57 : 0)) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (s > bs){ bs = s; best = { x: px, y: py }; } }
    if (!best) continue; a.mv = { k: 'kite', lane: !!LN, x: best.x, y: best.y, b: LN ? LN.c.i : x.i, run: true, until: W.t + 1.0 }; a.kiteT0 = W.t;
    if (LN ? a.laneKey !== LN.c.i + ':' + LN.c.act.t0 : W.t >= (a.kiteLogT || 0)){ if (LN) a.laneKey = LN.c.i + ':' + LN.c.act.t0; else a.kiteLogT = W.t + 5; L(W, { k: 'mvr', side: 1, m: 'kite', a: a.i, b: LN ? LN.c.i : x.i, lane: LN ? true : undefined, obs: !!a.seenBy, vis: true }); } }""")
rep("""  const M = u.mv, T = M.b != null ? W.units[M.b] : null;
  if (M.k === 'surround'){""",
"""  const M = u.mv, T = M.b != null ? W.units[M.b] : null;
  if (M.k === 'kite'){ const LN = chargeLane(W, u, f => canSee(W, u, f)); if (LN && !laneOk(LN, u, M.x, M.y)){ u.mv = null; return false; } }   /* v8.7.4 가던 자리가 돌진 길 안 (또는 건너편) — 다시 고름 */
  if (M.k === 'surround'){""")
