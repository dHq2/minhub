def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
rep(T,"c = W.units.filter(u => u.side === X && u.alive && u.cmd && !u.mute).sort((p, q) => q.cmd - p.cmd)[0];   // 진형 · 작전이 바뀔 때 외치는 놈 = 지휘 (보이거나, 본 적 있고 들리는 거리)","c = W.units.filter(u => u.side === X && u.alive && u.cmd).sort((p, q) => q.cmd - p.cmd)[0];   // 진형 · 작전이 바뀔 때 외치는 놈 = 지휘 (보이거나, 본 적 있고 들리는 거리 · 말 못 하는 놈은 몸짓이라 보여야 앎)")
rep(T,"if (c && (sees(S, c) || (iKnow(W, S, c) && W.units.some(e => e.alive && e.side === S && dist(e, c) < (W.rules.hear || 9))))){ const r = iRec(W, S, c); r.orders = (r.orders || 0) + 1; iTag(W, S, c, '지휘', l.k === 'plan' ? '작전을 외침' : l.k === 'focus' ? '표적을 가리키며 외침' : '진형을 외침'); } }","if (c && (sees(S, c) || (!c.mute && iKnow(W, S, c) && W.units.some(e => e.alive && e.side === S && dist(e, c) < (W.rules.hear || 9))))){ const r = iRec(W, S, c); r.orders = (r.orders || 0) + 1; iTag(W, S, c, '지휘', c.mute ? (l.k === 'focus' ? '표적을 가리키며 포효' : '포효 · 몸짓에 무리가 따라 움직임') : l.k === 'plan' ? '작전을 외침' : l.k === 'focus' ? '표적을 가리키며 외침' : '진형을 외침'); } }")
