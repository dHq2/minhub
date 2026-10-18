def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
rep(T,"  const off = W.rand() < p ? (W.rand() * 2 - 1) * t.r * 0.55 : (W.rand() < 0.5 ? -1 : 1) * (t.r + 0.12 + W.rand() * 0.55);","  const good = W.rand() < p, off = good ? (W.rand() * 2 - 1) * t.r * 0.55 : (W.rand() < 0.5 ? -1 : 1) * (t.r + 0.12 + W.rand() * 0.55);   // v6.6 good = 겨눔은 맞음 (그래도 상대가 움직이면 비켜 갈 수 있음)")
rep(T,"sp: wp.vel || 40, left: u.rng + u.r + 2.5, p: +p.toFixed(2), t0: W.t, side: u.side, mul: mul || 1 });","sp: wp.vel || 40, left: u.rng + u.r + 2.5, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1 });")
rep(T,"  const a = W.rand() * 2 * Math.PI, rr = W.rand() < p ? Math.sqrt(W.rand()) * t.r * 0.5 : t.r + 0.1 + W.rand() * arcSpread(W, u, d);","  const a = W.rand() * 2 * Math.PI, good = W.rand() < p, rr = good ? Math.sqrt(W.rand()) * t.r * 0.5 : t.r + 0.1 + W.rand() * arcSpread(W, u, d);")
rep(T,"arc: true, sp: 0, left: 0, p: +p.toFixed(2), t0: W.t, side: u.side, mul: mul || 1 });","arc: true, sp: 0, left: 0, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1 });")
rep(T,"why: `곡사 — 빈 바닥에 꽂힘 (명중률 ${Math.round(s.p * 100)}%)`, fired: true, p: s.p, arc: true });","why: `곡사 — 빈 바닥에 꽂힘 (명중률 ${Math.round(s.p * 100)}%)${s.good ? ' · 겨눔은 맞았으나 상대가 움직임' : ''}`, fired: true, p: s.p, arc: true, good: !!s.good });")
rep(T,"why: `빗나감 (명중률 ${Math.round(s.p * 100)}%)`, fired: true, p: s.p });","why: `빗나감 (명중률 ${Math.round(s.p * 100)}%)${s.good ? ' · 겨눔은 맞았으나 상대가 움직임' : ''}`, fired: true, p: s.p, good: !!s.good });")
