def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
# 1) 옆으로 가로지르는 표적은 더 맞히기 어려움 (양쪽 같은 규칙)
rep(T,"  if (Math.hypot(t.vx, t.vy) > 0.6) p *= 1 - 0.15 * (1 - mk);   // 움직이는 상대 (솜씨가 좋을수록 덜 흔들림)","""  if (Math.hypot(t.vx, t.vy) > 0.6) p *= 1 - 0.15 * (1 - mk);   // 움직이는 상대 (솜씨가 좋을수록 덜 흔들림)
  { const d = dist(u, t) || 1, lat = Math.abs((t.vx || 0) * (t.y - u.y) - (t.vy || 0) * (t.x - u.x)) / d; if (lat > 1.2) p *= 1 - 0.15 * (1 - mk * 0.5); }   // v6.4 사선을 가로질러 뛰는 상대 (지그재그) 는 더 어려움""")
# 2) 총구 피하기: 옆 + 앞으로 (지그재그로 파고듦)
rep(T,"""      const p = [a + Math.PI / 2, a - Math.PI / 2].map(b => ({ x: u.x + Math.cos(b) * 1.3, y: u.y + Math.sin(b) * 1.3 }))""","""      const fw = u.target && u.target.alive ? Math.atan2(u.target.y - u.y, u.target.x - u.x) : a + Math.PI, fx = Math.cos(fw) * 0.8, fy = Math.sin(fw) * 0.8;   // 하던 쪽으로 파고들며 사선만 비킴
      const p = [a + Math.PI / 2, a - Math.PI / 2].map(b => ({ x: u.x + Math.cos(b) * 1.1 + fx, y: u.y + Math.sin(b) * 1.1 + fy }))""")
# 3) 끌고 오기: 쫓는 놈이 더 빠르면 등을 보이지 않고 맞섬
rep(T,"const big = near.find(f => f.giant || iDanger(W, 1, f) >= 60) || (near.length >= 2 ? near[0] : null); if (!big || (busyW(W, u) && u.hp / u.max > 0.5 && !big.giant)) continue;","const big = near.find(f => f.giant || iDanger(W, 1, f) >= 60) || (near.length >= 2 ? near[0] : null); if (!big || (busyW(W, u) && u.hp / u.max > 0.5 && !big.giant) || big.spd * (big.spdMul || 1) > u.spd * (u.spdMul || 1) * 1.05) continue;   // 못 떼어 놓으면 맞섬")
# 4) 교대 · 끌고 오기 · 총구 피하기는 상대를 마주 본 채 뒷걸음 (방패 · 막기가 앞에 남음)
rep(T,"h.mv = { k: 'swap', x: bx, y: by, run: true, until: W.t + 2.5 };","h.mv = { k: 'swap', x: bx, y: by, b: f.i, run: true, until: W.t + 2.5 };")
rep(T,"""      if (p){ u.mv = { k: 'jink', x: p.x, y: p.y, run: true, until: W.t + 0.7 };""","""      if (p){ u.mv = { k: 'jink', x: p.x, y: p.y, b: g.i, run: true, until: W.t + 0.7 };""")
rep(T,"""  setMood(W, u, M.k === 'swap' ? '교대 — 물러남' : M.k === 'drag' ? '끌고 감' : '총구를 피함', T ? T.i : null); goTo(W, u, M.x, M.y, dt); return true;""","""  setMood(W, u, M.k === 'swap' ? '교대 — 물러남' : M.k === 'drag' ? '끌고 감' : '총구를 피함', T ? T.i : null);
  const back = M.k !== 'jink' && T && T.alive; setGoal(W, u, M.x, M.y); follow(W, u, dt, back ? 0.8 : 1); if (T && T.alive) u.fg = Math.atan2(T.y - u.y, T.x - u.x);   // 마주 본 채 (물러날 땐 뒷걸음 ×0.8)
  return true;""")
