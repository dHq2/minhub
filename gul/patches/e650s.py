def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'; H='rt3_head.js'
# 조준 흔들림은 뺌 (카이팅에 효과 없음)
rep(T,"\n  if (W.t - (u.runT == null ? -9 : u.runT) < 0.8 && !AI6.includes('settle')) p *= 1 - 0.3 * (1 - mk * 0.5);   // v6.5 전력으로 뛴 직후 (0.8초) 는 숨 · 자세가 흔들려 덜 맞음 (양쪽 같음)","")
# 규칙: 질주 숨
rep(H,"  run: 1.3,           // v5.7 서두르기 (연달아 준 이동) 속력 ×","  run: 1.3,           // v5.7 서두르기 (연달아 준 이동) 속력 ×\n  stamina: { drain: 14, walk: 4, rest: 12, low: 15, back: 40 },   // v6.5 질주 숨 (양쪽 같음): 서둘러 뛰면 초당 −14 (가득 차 있으면 약 6초), 걸으면 +4 · 서 있으면 +12. 15 아래로 떨어지면 '숨이 참' — 40까지 차기 전엔 못 뜀")
# 속력: 숨이 차면 서두르기 · 기동 질주가 안 됨
rep(T,"const spdNow = (W, u) => u.spd * u.spdMul * ((u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack')) || (u.mv && u.mv.run && W.t < u.mv.until) ? (W.rules.run || 1.3) : 1)","const spdNow = (W, u) => u.spd * u.spdMul * (!u.winded && ((u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack')) || (u.mv && u.mv.run && W.t < u.mv.until)) ? (W.rules.run || 1.3) : 1)")
# 숨 줄고 차기 (매 걸음)
rep(T,"for (const u of W.units) if (u.alive){ turnTo(W, u, dt); if (Math.hypot(u.vx || 0, u.vy || 0) > u.spd * (u.spdMul || 1) * 1.1) u.runT = W.t; }   // v6.5 전력으로 뛴 때","""for (const u of W.units) if (u.alive){ turnTo(W, u, dt); const sp = Math.hypot(u.vx || 0, u.vy || 0), ST = W.rules.stamina;
    if (ST){ if (u.sta == null) u.sta = 100; const run = sp > u.spd * (u.spdMul || 1) * 1.08 && !(u.act && u.act.k === 'charge') && !u.kb;   // v6.5 질주 숨: 서둘러 뛰면 줄고, 걷거나 서 있으면 참 (돌진 · 날아감은 따로)
      u.sta = Math.max(0, Math.min(100, u.sta + (run ? -ST.drain : sp > 0.3 ? ST.walk : ST.rest) * dt));
      if (!u.winded && u.sta < ST.low){ u.winded = true; L(W, { k: 'winded', a: u.i, vis: u.side === 0 || !!u.seenBy }); }
      else if (u.winded && u.sta >= ST.back){ u.winded = false; L(W, { k: 'breath', a: u.i, vis: u.side === 0 || !!u.seenBy }); } } }""")
