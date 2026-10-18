def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'; H='rt3_head.js'
# 탄속
rep(H,"'샷건':{rng:2.5, ammo:4, loud:true, aim:0.6, vel:45,","'샷건':{rng:2.5, ammo:4, loud:true, aim:0.6, vel:60,")
rep(H,"'총':{rng:6, ammo:8, loud:true, vel:60,","'총':{rng:6, ammo:8, loud:true, vel:85,")
rep(H,"'활':{rng:6, ammo:30, aim:0.5, vel:16,","'활':{rng:6, ammo:30, aim:0.5, vel:32,")
rep(H,"'저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:80,","'저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:110,")
rep(H,"burstMul:0.65, loud:true, aim:0.55, vel:70,","burstMul:0.65, loud:true, aim:0.55, vel:100,")
# 베테랑 사수 솜씨
rep(H,"  vet: { pin: 0.7, post: 0.75, regen: 1.5, back: 55, raise: 0.7, low: 0.15, tal: 0.9 },","  vet: { pin: 0.7, post: 0.75, regen: 1.5, back: 55, raise: 0.7, low: 0.15, tal: 0.9, marks: 0.3 },   // v6.6 marks = 베테랑 사수의 사격 솜씨 (자기 솜씨가 더 높으면 그대로)")
rep(T,"      marks: marksOf(rules, p.traits),   // v5.5.2 사격 솜씨 [사격X]","      marks: Math.max(marksOf(rules, p.traits), vet && rules.vet && rules.vet.marks ? rules.vet.marks : 0),   // v5.5.2 사격 솜씨 [사격X] · v6.6 베테랑은 적어도 0.3")
# 움직이는 표적의 앞을 겨눔 (솜씨만큼)
rep(T,"  const d = Math.max(0.3, dist(u, t)), p = aimP(W, u, t) * (pMul || 1), base = Math.atan2(t.y - u.y, t.x - u.x);","  const d = Math.max(0.3, dist(u, t)), p = aimP(W, u, t) * (pMul || 1), ld = AI6.includes('nolead') ? 0 : Math.min(1, 0.6 + (u.marks || 0)) * d / (wp.vel || 40), base = Math.atan2(t.y + (t.vy || 0) * ld - u.y, t.x + (t.vx || 0) * ld - u.x);   // v6.6 움직이는 표적은 날아가는 동안 갈 자리를 겨눔 (솜씨가 좋을수록 정확히)")
rep(T,"  const lx = t.x + Math.cos(a) * rr, ly = t.y + Math.sin(a) * rr, ll = Math.hypot(lx - u.x, ly - u.y) || 1, T = Math.max(0.25, ll / Math.max(1, (wp.vel || 16) * (A.vel || 0.55)));","  const T0 = Math.max(0.25, d / Math.max(1, (wp.vel || 16) * (A.vel || 0.55))), ld = AI6.includes('nolead') ? 0 : Math.min(1, 0.6 + (u.marks || 0)) * T0;   // v6.6 곡사도 떨어질 때의 자리를 겨눔\n  const lx = t.x + (t.vx || 0) * ld + Math.cos(a) * rr, ly = t.y + (t.vy || 0) * ld + Math.sin(a) * rr, ll = Math.hypot(lx - u.x, ly - u.y) || 1, T = Math.max(0.25, ll / Math.max(1, (wp.vel || 16) * (A.vel || 0.55)));")
