def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
rep(T,"    const G = AI6.includes('bguard') ? null : W.units.filter(g => g.alive && g.side !== u.side && isFar(g) && !g.down && (g.seenBy || canSee(W, u, g) || canSee(W, P2, g))).sort((a, b) => (b.loud ? 1 : 0) - (a.loud ? 1 : 0) || dist(a, P2) - dist(b, P2))[0] || T;","    const G = (AI6.includes('bguard') ? null : W.units.filter(g => g.alive && g.side !== u.side && isFar(g) && !g.down && (g.seenBy || canSee(W, u, g) || canSee(W, P2, g))).sort((a, b) => (b.loud ? 1 : 0) - (a.loud ? 1 : 0) || dist(a, P2) - dist(b, P2))[0]) || T;")
# 궁수 카이팅 좁힘: 나를 노리고 오는 놈 · 3칸 · 막아 줄 근접 동료가 없을 때
rep(T,"    const x = known.filter(f => !isFar(f) && !f.down && !f.crawl && gap(a, f) < 3.8 && (f.target === a || (f.order && f.order.b === a.i) || (Math.hypot(f.vx || 0, f.vy || 0) > 0.3 && (f.vx || 0) * (a.x - f.x) + (f.vy || 0) * (a.y - f.y) > 0))).sort((p, q) => gap(a, p) - gap(a, q))[0]; if (!x) continue;",
"    const x = known.filter(f => !isFar(f) && !f.down && !f.crawl && gap(a, f) < 3 && (f.target === a || (f.order && f.order.b === a.i) || focusOf(W, f) === a)).sort((p, q) => gap(a, p) - gap(a, q))[0]; if (!x) continue;\n    if (mine.some(m => m !== a && !isFar(m) && dist(m, x) < dist(a, x) && segD(x, a.x, a.y, m) < m.r + x.r)) continue;   // 사이에 근접 동료가 막아 주면 그 자리에서 쏨")
