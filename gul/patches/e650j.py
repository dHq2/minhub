def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'; H='rt3_head.js'
rep(H,"  stamina: { drain: 14, walk: 4, rest: 12, low: 15, back: 40 },   // v6.5 질주 숨 (양쪽 같음): 서둘러 뛰면 초당 −14 (가득 차 있으면 약 6초), 걸으면 +4 · 서 있으면 +12. 15 아래로 떨어지면 '숨이 참' — 40까지 차기 전엔 못 뜀","  stamina: { drain: 14, walk: 4, rest: 12, low: 15, back: 40, jog: 2.4 },   // v6.5 질주 숨 (양쪽 같음): 초당 2.4칸보다 빠르게 움직이면 (서두르기 · 기동 질주 · 본디 빠른 몸) 초당 −14 (가득 차 있으면 약 6초), 그보다 느리게 걸으면 +4 · 서 있으면 +12. 15 아래로 떨어지면 '숨이 참' — 40까지 찰 때까지 못 뛰고 2.4칸/초로 묶임")
rep(T,"const run = sp > u.spd * (u.spdMul || 1) * 1.08 && !(u.act && u.act.k === 'charge') && !u.kb;","const run = (sp > u.spd * (u.spdMul || 1) * 1.08 || sp > (ST.jog || 99)) && !(u.act && u.act.k === 'charge') && !u.kb;")
rep(T,"const spdNow = (W, u) => u.spd * u.spdMul * (!u.winded","const spdNow = (W, u) => (u.winded && W.rules.stamina && W.rules.stamina.jog ? Math.min(1, W.rules.stamina.jog / Math.max(0.1, u.spd * u.spdMul)) : 1) * u.spd * u.spdMul * (!u.winded")
