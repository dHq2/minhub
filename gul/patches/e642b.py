def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
rep(T,"""  for (const u of mine){ if (AI6.includes('recall') || isFar(u) || u.line || !mvFree(W, u) || W.t < (u.recT || 0) || busyW(W, u)) continue;
    if (mine.some(m => m !== u && dist(m, u) < 3.5)) continue;""","""  for (const u of mine){ if (AI6.includes('recall') || isFar(u) || u.line || !mvFree(W, u) || W.t < (u.recT || 0) || busyW(W, u)) continue;
    if (mine.filter(m => m !== u && dist(m, u) < 4).length > 1) continue;   // 혼자 · 둘이 떨어진 조 (순찰조) 일 때""")
rep(T,"""    const grp = mine.filter(m => m !== u && dist(m, u) > 3.5 && dist(m, u) < 14 && mine.some(o => o !== m && o !== u && dist(o, m) < 3)).sort((a, b) => dist(a, u) - dist(b, u))[0]; if (!grp) continue;""","""    const grp = mine.filter(m => m !== u && dist(m, u) > 5 && dist(m, u) < 16 && mine.filter(o => o !== m && o !== u && dist(o, m) < 3).length >= 2).sort((a, b) => dist(a, u) - dist(b, u))[0]; if (!grp) continue;   // 셋 넘게 모인 본대""")
rep(T,"""  // v6.4.2 본능: 보조 맞춤""","""  // v6.4.2 합류: 동료가 맞붙거나 사격받으면 (3 ~ 12칸) 본대가 서둘러 그쪽으로 — 흩어져 하나씩 소모되지 않게 (유인 · 매복 · 후퇴 · 포위 중엔 안 함)
  { const pk = W.plan && W.plan.k, rl = W.rushLog || (W.rushLog = {});
    if (!AI6.includes('rush') && pk !== 'bait' && pk !== 'ambush' && pk !== 'withdraw' && pk !== 'encircle'){
      const hot = mine.filter(m => busyW(W, m) || W.t - (m.farHitT == null ? -9 : m.farHitT) < 2);
      for (const u of mine){ if (u.line || !mvFree(W, u) || busyW(W, u) || W.t < (u.rushT || 0) || hot.includes(u)) continue;
        const m = hot.filter(h => dist(h, u) > 3 && dist(h, u) < 12 && !(h.mv && h.mv.k === 'recall' && W.t < h.mv.until)).sort((a, b) => dist(a, u) - dist(b, u))[0]; if (!m) continue;
        if (isFar(u) && dist(m, u) < u.rng) continue;   // 사수는 이미 닿으면 그 자리에서 쏨
        u.mv = { k: 'rush', b: m.i, run: true, until: W.t + 1.2 }; u.rushT = W.t + 1.2;
        if (W.t >= (rl[m.i] || 0)){ rl[m.i] = W.t + 6; L(W, { k: 'mvr', side: 1, m: 'rush', a: u.i, b: m.i, why: busyW(W, m) ? '맞붙음' : '사격받음', obs: !!u.seenBy, vis: true }); } } } }
  // v6.4.2 본능: 보조 맞춤""")
rep(T,"""  if (M.k === 'recall' && Math.hypot(M.x - u.x, M.y - u.y) < 1.6){ u.mv = null; return false; }""","""  if (M.k === 'recall' && Math.hypot(M.x - u.x, M.y - u.y) < 1.6){ u.mv = null; return false; }
  if (M.k === 'rush'){ if (!T || !T.alive || dist(u, T) < 2.5){ u.mv = null; return false; } setMood(W, u, '합류 — ' + T.name + ' 쪽으로', T.i); goTo(W, u, T.x, T.y, dt); return true; }   // v6.4.2""")
