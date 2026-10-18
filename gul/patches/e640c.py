def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
rep(T,"  for (const u of mine){ if (!mvFree(W, u) || isFar(u) || u.line || W.t < (u.dragT || 0)) continue;","  for (const u of mine){ if (AI6.includes('mv_drag') || !mvFree(W, u) || isFar(u) || u.line || W.t < (u.dragT || 0)) continue;")
rep(T,"  for (const h of mine){ if (used >= cap) return; if (!mvFree(W, h)","  for (const h of mine){ if (used >= cap) return; if (AI6.includes('mv_swap') || !mvFree(W, h)")
rep(T,"  for (const f of known){ if (used >= cap) return; if (f.down || W.t < (sT[f.i] || 0)) continue;","  for (const f of known){ if (used >= cap) return; if (AI6.includes('mv_sur') || f.down || W.t < (sT[f.i] || 0)) continue;")
rep(T,"  if (used < cap && W.t >= (W.feintT || 0) && mine.filter","  if (!AI6.includes('mv_feint') && used < cap && W.t >= (W.feintT || 0) && mine.filter")
rep(T,"  if (!mvOn(W, u) && W.t >= (u.jinkT || 0) && !u.line","  if (!AI6.includes('mv_jink') && !mvOn(W, u) && W.t >= (u.jinkT || 0) && !u.line")
