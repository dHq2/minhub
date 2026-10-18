def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
# ---- planMoves 앞부분: 순찰조 합류 · 궁수 카이팅 (본능) ----
rep(T,"""function planMoves(W, mine, known){
  const reach = (a, b) => Math.max(isFar(a) ? 0.3 : a.rng, isFar(b) ? 0.3 : b.rng) + 0.6;""","""function planMoves(W, mine, known){
  const reach = (a, b) => Math.max(isFar(a) ? 0.3 : a.rng, isFar(b) ? 0.3 : b.rng) + 0.6;
  // v6.5 순찰조 합류: 경보 뒤 본대 (순찰 · 초병이 아닌 근접) 에서 떨어진 순찰조 · 초병은, 맞붙지 않았고 상대가 코앞이 아니면 본대로 모임. 본대는 그동안 (경보 뒤 4초까지, 상대가 6칸 안에 오면 그만) 기다림
  if (W.alarm1 && W.alarm1.spread && !AI6.includes('rejoin') && !(W.plan && ['ambush', 'withdraw'].includes(W.plan.k))){
    const core = mine.filter(m => !m.patrol && !m.sentry && !isFar(m));
    if (core.length >= 2){ const cc = centroid(core); let going = 0;
      for (const u of mine){ if (!(u.patrol || u.sentry) || u.rejoined || busyW(W, u)) continue;
        if (dist(u, cc) < 3.2 || known.some(f => !f.down && gap(u, f) < (isFar(f) ? 0.3 : f.rng) + 2.5) || W.t - W.alarm1.t > 9){ u.rejoined = true; continue; }
        if (!mvFree(W, u) && !(u.mv && u.mv.k === 'rejoin')) continue;
        u.mv = { k: 'rejoin', x: cc.x, y: cc.y, run: true, until: W.t + 0.8 }; going++;
        if (!u.rejoinLog){ u.rejoinLog = true; L(W, { k: 'mvr', side: 1, m: 'rejoin', a: u.i, c: core[0].i, d: +dist(u, cc).toFixed(1), obs: !!u.seenBy, vis: true }); } }
      if (going && W.t - W.alarm1.t < 4 && !known.some(f => !f.down && dist(f, cc) < 6)){
        for (const u of core) if (mvFree(W, u) && !busyW(W, u)){ const f0 = known.filter(f => !f.down).sort((a, b) => dist(a, u) - dist(b, u))[0]; u.mv = { k: 'rally', b: f0 ? f0.i : null, x: W.alarm1.x, y: W.alarm1.y, until: W.t + 0.6 }; }
        if (!W.rallyLog){ W.rallyLog = true; L(W, { k: 'mvr', side: 1, m: 'rally', ids: core.map(u => u.i), n: going, vis: true }); } } } }
  // v6.5 궁수 카이팅 (본능): 근접 상대가 다가오면 (3.8칸) 쏜 다음에 한 걸음씩 물러남 — 동료 쪽으로, 다른 근접 손 닿는 곳은 피함. 쏘지 않고 물러나기만 하지 않음 (코앞 2.4칸이면 예외), 다른 궁수가 움직이는 중이면 그는 쏨
  for (const a of mine){ if (AI6.includes('kite') || !isFar(a) || !mvFree(W, a) || busyW(W, a)) continue;
    const x = known.filter(f => !isFar(f) && !f.down && !f.crawl && gap(a, f) < 3.8 && (f.target === a || (f.order && f.order.b === a.i) || (Math.hypot(f.vx || 0, f.vy || 0) > 0.3 && (f.vx || 0) * (a.x - f.x) + (f.vy || 0) * (a.y - f.y) > 0))).sort((p, q) => gap(a, p) - gap(a, q))[0]; if (!x) continue;
    const close = gap(a, x) < 2.4, shot = (a.lastFireT != null ? a.lastFireT : -9) > (a.kiteT0 != null ? a.kiteT0 : -9);
    if (!close && (!shot || mine.some(o => o !== a && isFar(o) && o.alive && ((o.mv && o.mv.k === 'kite' && W.t < o.mv.until) || (o.act && o.act.k === 'leap'))))) continue;
    const mc = mine.filter(m => m !== a && !isFar(m)), base = Math.atan2(a.y - x.y, a.x - x.x); let best = null, bs = -1e9;
    for (const da of [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = a.x + Math.cos(ang) * 2.2, py = a.y + Math.sin(ang) * 2.2;
      if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, a.r)) continue;
      if (known.some(f => !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - a.r < f.rng + 1.2)) continue;
      const s = -Math.abs(da) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (s > bs){ bs = s; best = { x: px, y: py }; } }
    if (!best) continue; a.mv = { k: 'kite', x: best.x, y: best.y, b: x.i, run: true, until: W.t + 1.0 }; a.kiteT0 = W.t;
    if (W.t >= (a.kiteLogT || 0)){ a.kiteLogT = W.t + 5; L(W, { k: 'mvr', side: 1, m: 'kite', a: a.i, b: x.i, obs: !!a.seenBy, vis: true }); } }""")
# ---- 교대 일찍 ----
rep(T,"  for (const h of mine){ if (used >= cap) return; if (AI6.includes('noswap') || !mvFree(W, h) || isFar(h) || h.hp / h.max >= 0.35 || !busyW(W, h)) continue;","""  const swapWhy = h => h.hp / h.max < 0.35 ? '체력 ' + Math.round(h.hp / h.max * 100) + '%' : AI6.includes('early') || h.hp / h.max >= 0.65 ? null : h.bleed ? '피를 흘림' : (h.arms && (h.arms.L || h.arms.R)) ? '팔을 다침' : h.eyeLost ? '눈을 잃음' : h.legLoss ? '다리를 다침' : W.t < h.brokenT ? '자세가 무너짐' : (h.post != null && h.post < 25) ? '자세가 바닥' : null;   // v6.5 바닥까지 기다리지 않음
  for (const h of mine){ if (used >= cap) return; if (AI6.includes('noswap') || !mvFree(W, h) || isFar(h) || !swapWhy(h) || !busyW(W, h)) continue;""")
rep(T,"    L(W, { k: 'mvr', side: 1, m: 'swap', a: h.i, b: m.i, c: f.i, hp: Math.round(h.hp / h.max * 100), obs: !!(h.seenBy || m.seenBy), vis: true }); }","    L(W, { k: 'mvr', side: 1, m: 'swap', a: h.i, b: m.i, c: f.i, hp: Math.round(h.hp / h.max * 100), why: swapWhy(h), obs: !!(h.seenBy || m.seenBy), vis: true }); }")
# ---- 몸으로 막는 호위 · 사수 몰이 (지휘) ----
rep(T,"""  // v6.4.1 거구와 궁수 사이를 막음""","""  // v6.5 몸으로 막는 호위: 사수가 동료를 겨누거나 막 쏘았으면 (2초) 곁의 방패 동료가 그 사선 위에 서서 사수를 마주 보고 방패를 듦 — 사수가 움직이면 자리를 고침
  for (const P2 of mine){ if (used >= cap) return; if (AI6.includes('bguard') || P2.shield || P2.armShield || !P2.alive) continue;
    const G = known.find(g => isFar(g) && !g.down && ((g.act && g.act.k === 'atk' && g.act.b === P2.i) || (P2.farBy === g.i && W.t - (P2.farHitT == null ? -9 : P2.farHitT) < 2))); if (!G) continue;
    if (mine.some(s => s.mv && s.mv.k === 'bguard' && s.mv.c === P2.i && W.t < s.mv.until)) continue;
    const s = mine.filter(x => x !== P2 && mvFree(W, x) && (x.shield || x.armShield) && !busyW(W, x) && x.hp / x.max > 0.35 && dist(x, P2) < 4.5).sort((p, q) => dist(p, P2) - dist(q, P2))[0]; if (!s) continue;
    s.mv = { k: 'bguard', b: G.i, c: P2.i, run: true, until: W.t + 3 }; used++;
    L(W, { k: 'mvr', side: 1, m: 'bguard', a: s.i, b: G.i, c: P2.i, obs: !!(s.seenBy || P2.seenBy), vis: true }); }
  // v6.5 사수 몰이: 사수가 빠지며 쏘아 근접이 3초 넘게 못 붙으면 — 끊을 조 둘이 사수의 퇴로 쪽 (우리 본대 반대편 ±45°) 으로 돌아가고, 자리 잡으면 (또는 5초) 쫓던 놈들과 함께 조여 들어감. 그동안 표적은 그 사수 (궁수도 그쪽)
  if (!AI6.includes('hunt')) huntStep(W, mine, known, C, () => used, k => { used += k; }, cap);
  // v6.4.1 거구와 궁수 사이를 막음""")
rep(T,"function planMoves(W, mine, known){","""function huntStep(W, mine, known, C, getUsed, addUsed, cap){
  const H = W.hunt, melee = mine.filter(u => !isFar(u) && !u.crawl && u.alive);
  if (H){ const G = W.units[H.g];
    if (!G.alive || G.down || W.t - H.t0 > 12 || !H.cut.some(i => W.units[i].alive)){ L(W, { k: 'hunt', side: 1, s: 'end', b: H.g, why: !G.alive || G.down ? '쓰러뜨림' : W.t - H.t0 > 12 ? '12초 — 놓침' : '끊을 조를 잃음', vis: true }); for (const u of mine) if (u.mv && (u.mv.k === 'cut' || u.mv.k === 'close')) u.mv = null; W.hunt = null; return; }
    if (H.phase === 'cut' && (W.t - H.t0 > 5 || H.cut.every(i => { const u = W.units[i]; return !u.alive || (u.mv && u.mv.k === 'cut' && Math.hypot(G.x + u.mv.ox - u.x, G.y + u.mv.oy - u.y) < 1.2) || gap(u, G) < u.rng + 1; }))){
      H.phase = 'close'; const ids = melee.filter(u => (H.cut.includes(u.i) || u.target === G) && !busyW(W, u)).map(u => u.i);
      for (const i of ids){ const u = W.units[i]; u.mv = { k: 'close', b: G.i, run: true, until: W.t + 4 }; }
      L(W, { k: 'hunt', side: 1, s: 'close', b: H.g, ids, why: W.t - H.t0 > 5 ? '5초 — 모인 만큼' : '끊을 자리 잡음', vis: true }); }
    return; }
  if (!C) return;
  const W0 = W.huntW || (W.huntW = {});
  for (const G of known){ if (!isFar(G) || !G.loud || G.down) { continue; }
    const chasing = melee.filter(u => u.target === G && gap(u, G) > u.rng + 0.5), touch = melee.some(u => gap(u, G) < u.rng + 0.5);
    if (!chasing.length || touch){ W0[G.i] = 0; continue; }
    W0[G.i] = (W0[G.i] || 0) + 0.5; if (W0[G.i] < 3 || cap - getUsed() < 2) continue;
    const E2 = centroid(melee), d = dist(G, E2) || 1, dx = (G.x - E2.x) / d, dy = (G.y - E2.y) / d, base = Math.atan2(dy, dx);
    const cut = melee.filter(u => mvFree(W, u) && !u.giant && !u.line && !busyW(W, u) && u.spd >= 1.8 && u.hp / u.max > 0.4 && dist(u, G) < 14).sort((p, q) => dist(p, G) / p.spd - dist(q, G) / q.spd).slice(0, 2); if (!cut.length) continue;
    const ids = [];
    cut.forEach((u, k) => { let o = null; for (const da of k ? [-0.8, -1.2, -0.4] : [0.8, 1.2, 0.4]){ const ox = Math.cos(base + da) * 3.2, oy = Math.sin(base + da) * 3.2, x = G.x + ox, y = G.y + oy; if (x > 0.8 && y > 0.8 && x < W.map.W - 0.8 && y < W.map.H - 0.8 && !boxRock(W, x, y, u.r)){ o = { ox, oy }; break; } }
      if (!o) return; u.mv = { k: 'cut', b: G.i, ox: o.ox, oy: o.oy, run: true, until: W.t + 6 }; ids.push(u.i); });
    if (!ids.length) continue; addUsed(ids.length);
    W.hunt = { g: G.i, cut: ids, phase: 'cut', t0: W.t }; W0[G.i] = 0; W.focus = { b: G.i, t0: W.t };
    L(W, { k: 'hunt', side: 1, s: 'start', b: G.i, ids, chase: chasing.map(u => u.i), why: '빠지며 쏨 — 3초 넘게 못 붙음', vis: true }); return; }
}
function planMoves(W, mine, known){""")
# ---- mvStep: 새 기동 ----
rep(T,"""  if (M.k === 'pace'){""","""  if (M.k === 'rally'){ stop(u); if (T && T.alive) u.fg = Math.atan2(T.y - u.y, T.x - u.x); else u.fg = Math.atan2(M.y - u.y, M.x - u.x); setMood(W, u, '집결 — 순찰조를 기다림'); return true; }   // v6.5
  if (M.k === 'rejoin'){ if (Math.hypot(M.x - u.x, M.y - u.y) < 2.5){ u.mv = null; u.rejoined = true; return false; } setMood(W, u, '합류 — 본대로'); goTo(W, u, M.x, M.y, dt); return true; }
  if (M.k === 'bguard'){ const P2 = W.units[M.c]; if (!T || !T.alive || T.down || !P2 || !P2.alive){ u.mv = null; return false; }
    const d = dist(P2, T) || 1, k = P2.r + u.r + 0.12, x = P2.x + (T.x - P2.x) / d * k, y = P2.y + (T.y - P2.y) / d * k;   // 사수 — 보호 대상 사선 위, 보호 대상 바로 앞
    setMood(W, u, '몸으로 막음 — ' + P2.name + ' 앞', T.i);
    if (Math.hypot(x - u.x, y - u.y) < 0.3){ stop(u); } else goTo(W, u, x, y, dt);
    u.fg = Math.atan2(T.y - u.y, T.x - u.x); u.wantT = W.t; if (!u.raised && u.guardMode !== 'off'){ u.raised = true; u.raiseAt = W.t + ((W.rules.guard || {}).raise != null ? W.rules.guard.raise : 0.25) * (u.vet ? VETR(W).raise : 1); }   // 사수를 마주 보고 방패를 듦
    return true; }
  if (M.k === 'cut'){ if (!T || !T.alive || T.down){ u.mv = null; return false; } const x = Math.max(0.8, Math.min(W.map.W - 0.8, T.x + M.ox)), y = Math.max(0.8, Math.min(W.map.H - 0.8, T.y + M.oy));
    if (gap(u, T) < u.rng + 0.3){ u.mv = null; u.target = T; u.state = 'hunt'; return false; } setMood(W, u, '퇴로를 끊음 — ' + T.name + ' 뒤로', T.i); goTo(W, u, x, y, dt); return true; }
  if (M.k === 'close'){ if (!T || !T.alive || T.down){ u.mv = null; return false; } u.target = T; u.state = 'hunt'; return false; }   // 조여 들어감 — 싸움은 그대로 (따라잡을 자리로)
  if (M.k === 'pace'){""")
rep(T,"  setMood(W, u, M.k === 'swap' ? '교대 — 물러남' : M.k === 'drag' ? '끌고 감' : M.k === 'scatter' ? '흩어짐 — 거구를 피해' : M.k === 'recall' ? '회수 — 본대로' : '총구를 피함', T ? T.i : null);\n  if (M.k === 'scatter' || M.k === 'recall'){ goTo(W, u, M.x, M.y, dt); return true; }",
"  setMood(W, u, M.k === 'swap' ? '교대 — 물러남' : M.k === 'drag' ? '끌고 감' : M.k === 'scatter' ? '흩어짐 — 거구를 피해' : M.k === 'recall' ? '회수 — 본대로' : M.k === 'kite' ? '거리 벌림 — 쏘고 물러남' : '총구를 피함', T ? T.i : null);\n  if (M.k === 'scatter' || M.k === 'recall' || M.k === 'kite'){ goTo(W, u, M.x, M.y, dt); return true; }")
rep(T,"const MV_ORG = ['surround', 'swap', 'cover', 'feint', 'interpose', 'lead', 'follow'];","const MV_ORG = ['surround', 'swap', 'cover', 'feint', 'interpose', 'lead', 'follow', 'bguard', 'cut'];")
# ---- 호위 (lead) 도 사선 위로 ----
rep(T,"""  if (M.k === 'lead'){ if (!T || !T.alive || T.down || W.units.some(f => f.alive && f.side !== u.side && gap(u, f) < Math.max(isFar(f) ? 0.3 : f.rng, u.rng) + 0.4)){ u.mv = null; return false; }
    setMood(W, u, '호위 — 앞장섬', T.i); goTo(W, u, T.x, T.y, dt); return true; }""","""  if (M.k === 'lead'){ const P2 = W.units[M.c]; if (!T || !T.alive || T.down || !P2 || !P2.alive || W.units.some(f => f.alive && f.side !== u.side && gap(u, f) < Math.max(isFar(f) ? 0.3 : f.rng, u.rng) + 0.4)){ u.mv = null; return false; }
    const G = AI6.includes('bguard') ? null : W.units.filter(g => g.alive && g.side !== u.side && isFar(g) && !g.down && (g.seenBy || canSee(W, u, g) || canSee(W, P2, g))).sort((a, b) => (b.loud ? 1 : 0) - (a.loud ? 1 : 0) || dist(a, P2) - dist(b, P2))[0] || T;   // v6.5 가장 위험한 사수 — 보호 대상 사선 위에 섬 (사수가 움직이면 따라 고침)
    const d = dist(P2, G) || 1, k = P2.r + u.r + 0.12, x = P2.x + (G.x - P2.x) / d * k, y = P2.y + (G.y - P2.y) / d * k;
    setMood(W, u, '호위 — ' + P2.name + ' 앞, ' + G.name + ' 쪽을 막음', T.i); goTo(W, u, x, y, dt); u.fg = Math.atan2(G.y - u.y, G.x - u.x); u.wantT = W.t; return true; }""")
rep(T,"""    const d = dist(S2, T) || 1, x = S2.x - (T.x - S2.x) / d * 1.2, y = S2.y - (T.y - S2.y) / d * 1.2; setMood(W, u, '호위 — ' + S2.name + ' 뒤', T.i); goTo(W, u, x, y, dt); return true; }""","""    setMood(W, u, '호위 — ' + S2.name + ' 뒤', T.i); const lp = leadPt(W, u, T); setGoal(W, u, lp.x, lp.y); follow(W, u, dt, 0.8); return true; }   // v6.5 보호받는 쪽이 표적으로 가고 방패가 그 앞 사선을 막음 (방패가 따라오게 조금 느리게)""")
