def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
rep(T,"""  for (const S of [0, 1]){ const K = W.units.filter(f => f.alive && f.side !== S && iKnow(W, S, f)); if (!K.length) continue;
    const d = K.reduce((x, y) => iDanger(W, S, y) > iDanger(W, S, x) ? y : x, K[0]), c = K.reduce((x, y) => iCenter(W, S, y) > iCenter(W, S, x) ? y : x, K[0]);
    const J = (W.judge || (W.judge = [{}, {}]))[S];
    if ((iDanger(W, S, d) > 0 && J.d !== d.i && iDanger(W, S, d) > (J.d != null && W.units[J.d].alive ? iDanger(W, S, W.units[J.d]) * 1.25 : 0)) || (iCenter(W, S, c) > 0 && J.c !== c.i && iCenter(W, S, c) > (J.c != null && W.units[J.c].alive ? iCenter(W, S, W.units[J.c]) * 1.25 : 0))){
      J.d = iDanger(W, S, d) > 0 ? d.i : J.d; J.c = iCenter(W, S, c) > 0 ? c.i : J.c;
      L(W, { k: 'judge', side: S, d: J.d, dWhy: J.d != null ? iWhyD(W, S, W.units[J.d]) : '', c: J.c, cWhy: J.c != null ? iWhyC(W, S, W.units[J.c]) : '', vis: true }); }
  }""","""  for (const S of [0, 1]){ const K = W.units.filter(f => f.alive && f.side !== S && iKnow(W, S, f)), J = (W.judge || (W.judge = [{}, {}]))[S]; let ch = false;
    if (J.d != null && !W.units[J.d].alive){ J.d = null; ch = true; } if (J.c != null && !W.units[J.c].alive){ J.c = null; ch = true; }   // 쓰러지면 다시 봄
    if (K.length){ const d = K.reduce((x, y) => iDanger(W, S, y) > iDanger(W, S, x) ? y : x, K[0]), c = K.reduce((x, y) => iCenter(W, S, y) > iCenter(W, S, x) ? y : x, K[0]);
      if (iDanger(W, S, d) > 0 && J.d !== d.i && iDanger(W, S, d) > (J.d != null ? iDanger(W, S, W.units[J.d]) * 1.25 : 0)){ J.d = d.i; ch = true; }
      if (iCenter(W, S, c) > 0 && J.c !== c.i && iCenter(W, S, c) > (J.c != null ? iCenter(W, S, W.units[J.c]) * 1.25 : 0)){ J.c = c.i; ch = true; } }
    if (ch && (J.d != null || J.c != null)) L(W, { k: 'judge', side: S, d: J.d, dWhy: J.d != null ? iWhyD(W, S, W.units[J.d]) : '', c: J.c, cWhy: J.c != null ? iWhyC(W, S, W.units[J.c]) : '', vis: true });
  }""")
