def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
rep(T,"else if (l.k === 'stance' || (l.k === 'plan' && l.side === 1)){","else if (l.k === 'stance' || (l.side === 1 && (l.k === 'plan' || l.k === 'focus' || ((l.k === 'wedge' || l.k === 'env') && l.s === 'form')))){")
rep(T,"iTag(W, S, c, '지휘', l.k === 'plan' ? '작전을 외침' : '진형을 외침'); } }","iTag(W, S, c, '지휘', l.k === 'plan' ? '작전을 외침' : l.k === 'focus' ? '표적을 가리키며 외침' : '진형을 외침'); } }")
rep(T,"for (const t of ['총', '활', '횃불', '구급', '외침', '불사']) if (tg.includes(t)) p.push(t === '외침' ? '외침 (지휘하는 듯)' : t);","for (const t of ['총', '활', '횃불', '구급', '지휘', '외침', '불사']) if (tg.includes(t)) p.push(t === '외침' ? '외침 (지휘하는 듯)' : t);")
