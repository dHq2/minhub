def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
rep('rt3_tail.js',"""const ic = W.units.find(x => x.alive && x !== T && x.side !== u.side && !isFar(x) && dist(x, u) < 3.2 && (x.target === u || (x.order && x.order.b === u.i) || (Math.hypot(x.vx || 0, x.vy || 0) > 0.3 && (x.vx || 0) * (u.x - x.x) + (x.vy || 0) * (u.y - x.y) > 0)));""",
"""const ic = W.units.find(x => { if (!x.alive || x === T || x.side === u.side || isFar(x) || dist(x, u) > 3.2) return false; const sp = Math.hypot(x.vx || 0, x.vy || 0), d = dist(x, u) || 1;
      return x.target === u || (x.order && x.order.b === u.i) || (sp > 0.5 && W.t - (M.t0 || 0) > 0.5 && ((x.vx || 0) * (u.x - x.x) + (x.vy || 0) * (u.y - x.y)) / (sp * d) > 0.85); });   // 막으러 나온 놈: 나를 노림 (명령 · 표적) · 나를 향해 똑바로 달려옴""")
rep('rt3_tail.js',"r.mv = { k: 'feint', b: tg.i, wx, wy, leg: boxRock(W, wx, wy, r.r) ? 1 : 0, run: true, until: W.t + 5 };","r.mv = { k: 'feint', b: tg.i, wx, wy, leg: boxRock(W, wx, wy, r.r) ? 1 : 0, run: true, until: W.t + 5, t0: W.t };")
