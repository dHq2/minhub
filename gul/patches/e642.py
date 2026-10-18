def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
rep(T,"  if (o.far && !o.ff && W.farDmg) W.farDmg[t.side] += real;","  if (o.far && !o.ff && W.farDmg) W.farDmg[t.side] += real;\n  if (o.far && !o.ff){ t.farHitT = W.t; t.farBy = u.i; }   // v6.4.2 사격받은 때 (노출 병력 회수)")
rep(T,"""  // v6.4.1 본능: 가까운 위협 먼저 — 나를 노려 붙은 놈이 있는데 먼 표적을 쫓으면 등을 보임""","""  // v6.4.2 본능: 노출 병력 회수 — 혼자 떨어져 사격받는 근접은 가까운 본대 (둘 넘게 모인 동료) 로 물러남. 근접 상대가 곁이면 등을 보이지 않음 (끌고 오기 · 교대가 맡음)
  for (const u of mine){ if (AI6.includes('recall') || isFar(u) || u.line || !mvFree(W, u) || W.t < (u.recT || 0) || busyW(W, u)) continue;
    if (mine.some(m => m !== u && dist(m, u) < 3.5)) continue;
    const shot = W.t - (u.farHitT == null ? -9 : u.farHitT) < 2.5; if (!shot && !gunDanger(W, u, u.x, u.y)) continue;
    if (known.some(f => !isFar(f) && !f.down && gap(u, f) < f.rng + 1.8)) continue;
    const grp = mine.filter(m => m !== u && dist(m, u) > 3.5 && dist(m, u) < 14 && mine.some(o => o !== m && o !== u && dist(o, m) < 3)).sort((a, b) => dist(a, u) - dist(b, u))[0]; if (!grp) continue;
    const g = (u.farBy != null && W.units[u.farBy] && W.units[u.farBy].alive) ? W.units[u.farBy] : known.find(f => isFar(f) && f.loud);
    u.mv = { k: 'recall', x: grp.x, y: grp.y, b: g ? g.i : null, run: true, until: W.t + 3 }; u.recT = W.t + 5;
    L(W, { k: 'mvr', side: 1, m: 'recall', a: u.i, b: g ? g.i : null, c: grp.i, why: shot ? '혼자 사격받음' : '혼자 총구 앞', obs: !!u.seenBy, vis: true }); }
  // v6.4.2 본능: 보조 맞춤 — 접근 중 혼자 앞선 근접은 뒤따르는 본대 (둘 넘게) 를 기다림. 앞에서 동료가 싸우면 도우러 가고, 사격받으면 회수가 맡음, 4초 넘게 기다렸으면 6초는 그냥 감
  { const pk = W.plan && W.plan.k;
    if (!AI6.includes('pace') && pk !== 'bait' && pk !== 'ambush' && pk !== 'withdraw' && pk !== 'encircle') for (const u of mine){
      if (isFar(u) || u.line || !mvFree(W, u) || busyW(W, u) || W.t < (u.paceBan || 0)){ continue; }
      const f0 = known.filter(f => !f.down).sort((a, b) => dist(a, u) - dist(b, u))[0], d0 = f0 ? dist(u, f0) : 99;
      const behind = f0 ? mine.filter(m => m !== u && !isFar(m) && !busyW(W, m) && dist(m, f0) > d0 + 2.5 && dist(m, f0) < d0 + 10) : [];
      const want = f0 && d0 <= 12 && gap(u, f0) >= f0.rng + 3 && !mine.some(m => busyW(W, m) && dist(m, u) < 9) && !(W.t - (u.farHitT == null ? -9 : u.farHitT) < 2.5) && !gunDanger(W, u, u.x, u.y)
        && behind.length >= 2 && mine.filter(m => m !== u && !isFar(m) && dist(m, u) < 3 && Math.abs(dist(m, f0) - d0) < 2).length < behind.length;
      if (!want){ u.paceT0 = 0; continue; }
      if (!u.paceT0) u.paceT0 = W.t; if (W.t - u.paceT0 > 4){ u.paceBan = W.t + 6; u.paceT0 = 0; continue; }
      u.mv = { k: 'pace', b: f0.i, until: W.t + 0.6 };
      if (W.t >= (u.paceLogT || 0)){ u.paceLogT = W.t + 8; L(W, { k: 'mvr', side: 1, m: 'pace', a: u.i, b: f0.i, n: behind.length, obs: !!u.seenBy, vis: true }); } } }
  // v6.4.1 본능: 가까운 위협 먼저 — 나를 노려 붙은 놈이 있는데 먼 표적을 쫓으면 등을 보임""")
rep(T,"""  if (M.k === 'near'){ if (!T || !T.alive || T.down){ u.mv = null; return false; }""","""  if (M.k === 'pace'){ if (!T || !T.alive || T.down){ u.mv = null; return false; } stop(u); u.fg = Math.atan2(T.y - u.y, T.x - u.x); setMood(W, u, '보조 맞춤 — 본대를 기다림', T.i); return true; }   // v6.4.2
  if (M.k === 'recall' && Math.hypot(M.x - u.x, M.y - u.y) < 1.6){ u.mv = null; return false; }
  if (M.k === 'near'){ if (!T || !T.alive || T.down){ u.mv = null; return false; }""")
rep(T,"""  setMood(W, u, M.k === 'swap' ? '교대 — 물러남' : M.k === 'drag' ? '끌고 감' : M.k === 'scatter' ? '흩어짐 — 거구를 피해' : '총구를 피함', T ? T.i : null);
  if (M.k === 'scatter'){ goTo(W, u, M.x, M.y, dt); return true; }""","""  setMood(W, u, M.k === 'swap' ? '교대 — 물러남' : M.k === 'drag' ? '끌고 감' : M.k === 'scatter' ? '흩어짐 — 거구를 피해' : M.k === 'recall' ? '회수 — 본대로' : '총구를 피함', T ? T.i : null);
  if (M.k === 'scatter' || M.k === 'recall'){ goTo(W, u, M.x, M.y, dt); return true; }""")
