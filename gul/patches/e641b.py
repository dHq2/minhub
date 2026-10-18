def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
# 흩어짐: 둘 다 곧 휘두름 안 · 거구에 더 가까운 쪽만
rep(T,"""    const G = known.find(g => g.canSweep && !g.down && !g.crawl && gap(a, g) < g.rng + 3.2 && ((g.act && g.act.k === 'charge') || gap(a, g) < g.rng + 1.6 || (Math.hypot(g.vx || 0, g.vy || 0) > 0.3 && (g.vx || 0) * (a.x - g.x) + (g.vy || 0) * (a.y - g.y) > 0)));
    if (!G) continue; const b = mine.find(o => o !== a && o.alive && isFar(o) && dist(o, a) < 2.8); if (!b) continue;""","""    const G = known.find(g => g.canSweep && !g.down && !g.crawl && gap(a, g) < g.rng + 2.2 && ((g.act && g.act.k === 'charge') || gap(a, g) < g.rng + 1.2 || (Math.hypot(g.vx || 0, g.vy || 0) > 0.3 && (g.vx || 0) * (a.x - g.x) + (g.vy || 0) * (a.y - g.y) > 0)));
    if (!G) continue; const b = mine.find(o => o !== a && o.alive && isFar(o) && dist(o, a) < 2.4 && gap(o, G) < G.rng + 2.4 && dist(o, G) >= dist(a, G)); if (!b) continue;   // 둘 다 곧 한 휘두름 안 — 거구에 더 가까운 쪽 (나) 만 빠지고 다른 하나는 계속 쏨""")
rep(T,"a.scatT = W.t + 3;","a.scatT = W.t + 4;")
# 사이를 막음: 방패 든 동료만 (맨몸으로 거구를 붙들지 않음), 거구가 궁수 쪽으로 올 때만
rep(T,"""    const G = known.find(g => (g.canSweep || g.giant) && !g.down && !g.crawl && gap(a, g) < g.rng + 4 && !mine.some(m => m.mv && m.mv.k === 'interpose' && m.mv.b === g.i && W.t < m.mv.until)); if (!G) continue;""","""    const G = known.find(g => (g.canSweep || g.giant) && !g.down && !g.crawl && gap(a, g) < g.rng + 3.5 && ((g.act && g.act.k === 'charge' && g.act.b === a.i) || (Math.hypot(g.vx || 0, g.vy || 0) > 0.3 && (g.vx || 0) * (a.x - g.x) + (g.vy || 0) * (a.y - g.y) > 0)) && !mine.some(m => m.mv && m.mv.k === 'interpose' && m.mv.b === g.i && W.t < m.mv.until)); if (!G) continue;   // 거구가 궁수 쪽으로 올 때""")
rep(T,"""    const m = mine.filter(x => x !== a && mvFree(W, x) && !isFar(x) && !x.giant && !busyW(W, x) && x.hp / x.max > 0.4 && dist(x, a) < 5.5).sort((p, q) => ((q.shield || q.armShield) ? 1 : 0) - ((p.shield || p.armShield) ? 1 : 0) || dist(p, a) - dist(q, a))[0]; if (!m) continue;""","""    const m = mine.filter(x => x !== a && mvFree(W, x) && !isFar(x) && !x.giant && (x.shield || x.armShield) && !busyW(W, x) && x.hp / x.max > 0.4 && dist(x, a) < 5.5).sort((p, q) => dist(p, a) - dist(q, a))[0]; if (!m) continue;   // 방패 든 동료만""")
# 직사 각: 총구에 더 드러나는 자리는 빼고
rep(T,"""  const know = knows(W, u), lim = ffLim(u, W); let best = null, bd = 1e9;
  for (const r of [0.7, 1.2, 1.8]) for (let k = 0; k < 10; k++){""","""  const know = knows(W, u), lim = ffLim(u, W), guns = W.units.filter(f => f.alive && f.side !== u.side && know(f) && (isFar(f) || (f.jav && f.spearHeld))), ex0 = exposedAt(W, u, u.x, u.y, guns); let best = null, bd = 1e9;
  for (const r of [0.7, 1.2, 1.8, 2.5]) for (let k = 0; k < 10; k++){""")
rep(T,"""    if (firstOnLine(W, P, t, u, know) !== t || ffOdds(W, u, t, x, y).p > lim) continue;
    if (r < bd){ bd = r; best = P; } }""","""    if (firstOnLine(W, P, t, u, know) !== t || ffOdds(W, u, t, x, y).p > lim || exposedAt(W, u, x, y, guns) > ex0) continue;   // 총구에 더 드러나는 자리는 안 감 (엄폐 뒤면 곡사가 나음)
    if (r < bd){ bd = r; best = P; } }""")
rep(T,"if (!u.lob || AI6.includes('angle') || (u.angT || 0) >= 1.2) return false;","if (!u.lob || AI6.includes('angle') || (u.angT || 0) >= 1.5) return false;")
