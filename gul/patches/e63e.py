def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'; P='page10.tpl.html'
rep(T,"if (w && !isFar(f) && !r.tags.includes(w) && !r.tags.includes('총') && !r.tags.includes('활')) iTag(W, S, f, w, '무기를 바꿔 듦');","if (w && !isFar(f) && !r.tags.includes(w) && !r.tags.includes('총') && !r.tags.includes('활')) iTag(W, S, f, w, w === '맨손' || f.weaponGone || (f.jav && !f.spearHeld) ? '무기를 놓침 · 던짐' : '무기를 바꿔 듦');")
rep(T,"""    else if (l.k === 'shout' && a && !l.mute){""","""    else if (l.k === 'stance' || (l.k === 'plan' && l.side === 1)){ const X = l.side, S = 1 - X, c = W.units.filter(u => u.side === X && u.alive && u.cmd && !u.mute).sort((p, q) => q.cmd - p.cmd)[0];   // 진형 · 작전이 바뀔 때 외치는 놈 = 지휘 (보이거나, 본 적 있고 들리는 거리)
      if (c && (sees(S, c) || (iKnow(W, S, c) && W.units.some(e => e.alive && e.side === S && dist(e, c) < (W.rules.hear || 9))))){ const r = iRec(W, S, c); r.orders = (r.orders || 0) + 1; iTag(W, S, c, '지휘', l.k === 'plan' ? '작전을 외침' : '진형을 외침'); } }
    else if (l.k === 'shout' && a && !l.mute){""")
rep(T,"return r.heals * 30 + (r.tags.includes('횃불') ? 20 : 0) + r.shouts * 8","return r.heals * 30 + (r.tags.includes('지휘') ? 25 + (r.orders || 0) * 3 : 0) + (r.tags.includes('횃불') ? 20 : 0) + r.shouts * 8")
rep(T,"if (r.heals) p.push(`약을 씀 ${r.heals}번`);","if (r.heals) p.push(`약을 씀 ${r.heals}번`); if (r.tags.includes('지휘')) p.push(`지휘를 외침${r.orders > 1 ? ' ' + r.orders + '번' : ''}`);")
rep(P,"""  if (al || pl || fo){ o.push('적이 움직이기 시작함 (우리는 몰랐음)');
    if (al) o.push(`  ${at(al)} 경보 — ${(al.n || []).map(n).join(' · ') || '모두 이미 움직이는 중'} → 본 그 자리로`);
    if (pl) o.push(`  ${at(pl)} 첫 작전: ${PLAN_K[pl.p] || pl.p}${pl.why ? ' (' + pl.why + ')' : ''}`);
    if (fo) o.push(`  ${at(fo)} 첫 표적: ${n(fo.b)} — ${fo.why}`); }""","""  if (al || pl || fo){ o.push('적이 움직이기 시작함 (우리는 몰랐음)');
    o.push(...[al && [al.t, `  ${at(al)} 경보 — ${(al.n || []).map(n).join(' · ') || '모두 이미 움직이는 중'} → 본 그 자리로`], pl && [pl.t, `  ${at(pl)} 첫 작전: ${PLAN_K[pl.p] || pl.p}${pl.why ? ' (' + pl.why + ')' : ''}`], fo && [fo.t, `  ${at(fo)} 첫 표적: ${n(fo.b)} — ${fo.why}`]].filter(Boolean).sort((x, y) => x[0] - y[0]).map(x => x[1])); }""")
