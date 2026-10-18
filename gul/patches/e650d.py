def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
# 달리는 사수는 바로 못 쏨 (돌진 판단 · 총구 위험)
rep(T,"    out.push({ g, aim, w: (aim ? 2 : 1) * (g.loud ? 1.3 : 1) });","    const run = !aim && !g.act && Math.hypot(g.vx || 0, g.vy || 0) > 1.2 && !AI6.includes('runw');   // v6.5 달아나는 사수는 서서 겨눠야 쏨 — 바로 못 쏨\n    out.push({ g, aim, w: (aim ? 2 : 1) * (g.loud ? 1.3 : 1) * (run ? 0.35 : 1) });")
# 못 잡을 놈을 쫓지 않음 (본능) + 달아나는 빠른 사수는 표적에서 미룸
rep(T,"""  // v6.4.2 본능: 노출 병력 회수""","""  // v6.5 못 잡을 놈은 쫓지 않음 (본능): 나보다 빠른 사수가 달아나며 쏘면 (돌진 거리 밖) 쫓지 않고 느린 그의 동료를 침 — 그가 돌아와 서서 쏠 때 돌진으로 잡음
  const fl = W.fleeT || (W.fleeT = {});
  for (const G of known) if (isFar(G) && !G.down && Math.hypot(G.vx || 0, G.vy || 0) > 1.5 && mine.some(m => !isFar(m) && dist(m, G) < 7 && ((G.vx || 0) * (G.x - m.x) + (G.vy || 0) * (G.y - m.y)) > 0)) fl[G.i] = W.t;
  for (const u of mine){ if (AI6.includes('nochase') || isFar(u) || !mvFree(W, u) || busyW(W, u) || W.t < (u.chaseT || 0)) continue; const G = u.target;
    if (!G || !G.alive || !isFar(G) || W.t - (fl[G.i] == null ? -9 : fl[G.i]) > 1.5 || gap(u, G) < u.rng + 1 || (u.canCharge && W.t >= u.chargeCd && gap(u, G) <= ((W.rules.charge || {}).max || 5))) continue;
    if (G.spd * (G.spdMul || 1) * (W.rules.run || 1.3) <= u.spd * (u.spdMul || 1) * (W.rules.run || 1.3) * 1.05) continue;   // 따라잡을 수 있으면 쫓음
    const x = known.filter(f => f !== G && !f.down && !(isFar(f) && W.t - (fl[f.i] == null ? -9 : fl[f.i]) < 1.5)).sort((p, q) => dist(p, u) - dist(q, u))[0]; if (!x) continue;
    u.mv = { k: 'near', b: x.i, until: W.t + 3 }; u.chaseT = W.t + 3;
    if (W.t >= (u.ncLogT || 0)){ u.ncLogT = W.t + 8; L(W, { k: 'mvr', side: 1, m: 'nochase', a: u.i, b: x.i, c: G.i, why: `${G.name} 속력 ${G.spd} > 나 ${u.spd}`, obs: !!u.seenBy, vis: true }); } }
  // v6.4.2 본능: 노출 병력 회수""")
rep(T,"function weakScore(W, f, S){ S = S != null ? S : 1 - f.side; const r = iRec(W, S, f), tg = r.tags;","function weakScore(W, f, S){ S = S != null ? S : 1 - f.side; const r = iRec(W, S, f), tg = r.tags; const flee = !AI6.includes('nochase') && W.fleeT && W.t - (W.fleeT[f.i] == null ? -9 : W.fleeT[f.i]) < 3 && !W.units.some(m => m.alive && m.side === S && dist(m, f) < 3.5) ? 0.4 : 1;   // v6.5 달아나는 빠른 사수는 표적에서 미룸")
