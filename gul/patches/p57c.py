import sys
def check(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        if s.count(o)!=1: print('MISMATCH',p,s.count(o),o[:140]); sys.exit(1)
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs: s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)
H=[
("""   v5.7: 막기는 선택 —""", """   v5.7: 급소 — 체력이 아무리 많아도 급소는 급소. 화살 · 투창 · 총이 머리 · 심장을 꿰뚫으면 (갑옷이 없거나 뚫음) 최대 체력의 vital.head · heart 만큼을 한 번에,
         근접은 치명타가 머리 · 심장에 들어갈 때. 투창이 머리에 박히면 vital.javKill, 화살 · 총은 arrowKill 확률로 즉사. 머리가 여럿이면 (카리우스) 그 머리를 잃음 (눈 둘 · 체력 headLoss) —
         마지막 머리면 보통 급소. 급소는 피를 흘림 (절단의 vital.bleedMul 배).
   v5.7: 막기는 선택 —"""),
("""  guard: { raise: 0.25,""", """  vital: { head: 0.4, heart: 0.3, melee: 0.35, heartP: 0.25, javKill: 0.25, arrowKill: 0.12, headLoss: 0.2, bleedMul: 1.5 },   // v5.7 급소: 최대 체력 몫 (머리 · 심장 · 근접 치명) · 몸통이 심장일 확률 · 즉사 (투창 · 화살 · 총) · 머리 하나를 잃을 때 · 출혈 ×
  guard: { raise: 0.25,"""),
]
T=[
("""function startBleed(W, t, by){
  const M = W.rules.maim || {}, b = t.bleed;
  t.bleed = { dps: (b ? b.dps : 0) + t.max * (M.bleed != null ? M.bleed : 0.02), until: W.t + (M.bleedT || 10), by };""",
 """function startBleed(W, t, by, mul){
  const M = W.rules.maim || {}, b = t.bleed;
  t.bleed = { dps: (b ? b.dps : 0) + t.max * (M.bleed != null ? M.bleed : 0.02) * (mul || 1), until: W.t + (M.bleedT || 10), by };"""),
("""  if (amb){ u.ambushes++;
    // 비명""", """  // v5.7 급소: 머리 · 심장을 꿰뚫으면 (원거리 · 투창은 갑옷이 없거나 뚫었을 때, 근접은 치명타 — 날붙이 · 둔기) 최대 체력의 몫을 한 번에. 머리가 여럿이면 그 머리를 잃음
  { const V = R.vital || {}, through = !AM0.it || pen, rangedV = (o.far || J) && through, meleeV = !o.far && !J && crit && wk !== '맨손';
    const heart = part === '몸통' && (rangedV || meleeV) && W.rand() < (V.heartP != null ? V.heartP : 0.25);
    const vp = part === '머리' && (rangedV || meleeV) ? '머리' : heart ? '심장' : null;
    if (vp && !(extra && extra.noWound)){
      o.vital = vp;
      if (vp === '머리' && (t.heads || 1) > 1){   // 머리 넷: 그 머리를 잃음
        o.headLost = true; dmg = Math.max(dmg, Math.round(t.max * (V.headLoss != null ? V.headLoss : 0.2)));
      } else {
        dmg = Math.max(dmg, Math.round(t.max * (meleeV ? (V.melee != null ? V.melee : 0.35) : vp === '머리' ? (V.head != null ? V.head : 0.4) : (V.heart != null ? V.heart : 0.3))));
        const kp = vp === '머리' && rangedV ? (J ? (V.javKill != null ? V.javKill : 0.25) : (V.arrowKill != null ? V.arrowKill : 0.12)) : 0;
        if (kp && W.rand() < kp){ dmg = Math.max(dmg, Math.ceil(t.hp)); o.tag = (J ? '투창' : pw && pw.kind === '총포류' ? '총알' : '화살') + '이 머리에 박힘 — 즉사'; }
      }
      if (!o.tag) o.tag = vp === '머리' ? (o.headLost ? '머리 하나가 꿰뚫림' : '머리를 꿰뚫음') : '심장을 꿰뚫음';
    }
  }
  if (amb){ u.ambushes++;
    // 비명"""),
("""  t.pinT = W.t + R.pinTime * (J ? 1.5 : 1) * (t.modBody ? (R.modBody || {}).pin || 0.5 : 1);
  applyDmg(W, u, t, dmg, o);""", """  t.pinT = W.t + R.pinTime * (J ? 1.5 : 1) * (t.modBody ? (R.modBody || {}).pin || 0.5 : 1);
  applyDmg(W, u, t, dmg, o);
  // v5.7 급소의 뒤: 피를 흘림 · 머리 넷은 그 머리를 잃음 (눈 둘)
  if (o.vital && t.alive && !t.undying){ startBleed(W, t, u.i, (R.vital || {}).bleedMul || 1.5);
    if (o.headLost){ t.heads--; t.eyes = Math.max(0, t.eyes - 2); t.eyeLost = Math.min(t.eyeLost, t.eyes); if (t.eyes && t.eyeLost >= t.eyes) t.blind = true; t.wounds.push('머리 하나를 잃음');
      L(W, { k: 'headLost', a: u.i, b: t.i, left: t.heads, vis: t.side === 0 || !!t.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '머리 하나를 잃음!', c: 'd', t0: W.t }); } }"""),
("""ambush: !!o.ambush, blade: !o.far && !!u.bladeHands, jav: !!o.jav, crit: !!o.crit });""", """ambush: !!o.ambush, blade: !o.far && !!u.bladeHands, jav: !!o.jav, crit: !!o.crit, vital: o.vital || null });"""),
]
check('rt3_head.js',H); check('rt3_tail.js',T)
patch('rt3_head.js',H); patch('rt3_tail.js',T)
print('ok')
