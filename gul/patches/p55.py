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
("/* ===== 전투 엔진 v5.4.3 —", "/* ===== 전투 엔진 v5.5 —"),
("""   v5.4.3: 명령은 길을 찾아 끝까지""", """   v5.5: 부위 파괴 · 절단 (굴 3D maim.js 의 부위 치명상을 판에 맞춰 옮김). 머리 · 팔에 치명 (또는 아주 크게) 맞으면 확률로 — 머리 → 눈 파괴, 팔 → 왼팔 · 오른팔.
         근접 날붙이 = 절단 (피를 흘림 — 응급처치 · 약이 지혈), 둔기 · 화살 · 총 · 투창 = 파괴 (뼈가 부러짐). 다리 (치명) → 기어다님 (전부터), 절단이면 피도 흘림.
         눈 하나 = 보는 거리 · 조준이 줄고, 다 잃으면 실명 (몸에 닿는 것만 앎 · 휘두르면 자주 헛침). 카리우스는 눈이 여덟 (머리 넷) 이라 하나쯤은 덜 아픔.
         팔: 방패 팔 → 방패를 놓침, 무기 팔 → 다른 손 (공격 ↓), 활 → 못 쏨, 총 → 한 손 (조준 ↓), 두 팔 → 발길질뿐. 거구의 찍기 · 짓밟기를 막지 못하면 뼈가 부러질 수 있음.
         무거운 몸 (거구) 은 팔다리가 굵어 잘 안 부서지고 안 잘림. [불사] 는 부위가 상하지 않음 (재생).
         아군 시야 연동 (브리핑): 누군가 본 상대를 말이 닿는 동료에게 불러 줌 (대략의 자리) — 못 보는 동료도 그쪽으로 움직임. 눈이 먼 아군도 신호로 더듬어 감.
   v5.4.3: 명령은 길을 찾아 끝까지"""),
("""  crit: { base: 0.05, prone: 0.3, mul: 1.5, cripple: 0.6, legMin: 0.12 },""", """  crit: { base: 0.05, prone: 0.3, mul: 1.5, cripple: 0.6, legMin: 0.12 },
  // v5.5 부위 파괴 · 절단 (굴 3D maim.js): 머리 · 팔에 치명 (최대 체력의 min 넘게) 이면 p, 치명이 아니어도 크게 (big 넘게) 맞으면 bigP 확률로 — 머리 → 눈 파괴, 팔 → 팔 (근접 날붙이 = 절단, 그 밖 = 파괴).
  // 무거운 몸은 덜 (√(massRes / 무게)). 거구의 찍기 · 짓밟기를 막지 못하면 crush 확률로 뼈가 부러짐 (팔 · 다리). 절단 = 피를 흘림 (최대 체력 × bleed / 초, bleedT 초 — 응급처치 · 약이 멈춤)
  // 눈 하나 = 보는 거리 ×oneEye · 조준 ×oneEyeAim (눈이 많으면 그만큼 덜), 다 잃으면 실명 (몸에 닿는 것만 앎 · 휘두르면 blindMiss 로 헛침)
  // 팔: 방패 팔 = 방패를 놓침, 무기 팔 = 다른 손 (공격 ×offHand), 받치는 팔 = ×twoHand, 활 = 못 쏨 (맨손), 총 = 한 손 (조준 ×gunOneArm), 투창 = 다른 손 (×javOff). 두 팔 = 발길질 (×kick, 거구 ×kickG)
  maim: { p: 0.5, min: 0.1, big: 0.35, bigP: 0.1, crush: 0.25, massRes: 90, bleed: 0.02, bleedT: 10, oneEye: 0.75, oneEyeAim: 0.85, blindMiss: 0.35, offHand: 0.6, twoHand: 0.85, gunOneArm: 0.55, javOff: 0.7, kick: 0.3, kickG: 0.6 },
  // v5.5 아군 시야 연동 (브리핑): 0.5초마다 누군가 본 상대를 r 칸 안 동료에게 불러 줌 — 대략의 자리 (±err 칸 + 거리 × 0.03). 못 보는 동료도 그쪽으로 움직임 (쏘거나 치려면 직접 봐야 함)
  call: { on: true, r: 10, err: 0.4 },"""),
]
M=[
("""  if (d <= (u.r || 0) + (t.r || 0) + 0.35 && (u.face == null || u.heads > 1 || sideOf(W, u, t) !== 'back')) return true;   // v4.0: 몸이 닿을 만큼 붙으면 어둠 속에서도 앎 (v4.1: 등 뒤는 모름)""",
 """  if (d <= (u.r || 0) + (t.r || 0) + 0.35 && (u.face == null || u.heads > 1 || sideOf(W, u, t) !== 'back')) return true;   // v4.0: 몸이 닿을 만큼 붙으면 어둠 속에서도 앎 (v4.1: 등 뒤는 모름)
  if (u.blind) return false;   // v5.5 실명: 몸에 닿는 것만 앎
  if (u.sightMul != null && u.sightMul < 1 && d > W.rules.sight * u.sightMul) return false;   // v5.5 눈을 잃음: 보는 거리 ×"""),
]
T=[
("""      heads: tr.includes('머리 넷') ? 4 : 1, cry:""", """      eyes: (tr.includes('머리 넷') ? 4 : 1) * 2, eyeLost: 0, blind: false, sightMul: 1, aimMaim: 1, arms: { L: null, R: null }, noArms: false, bleed: null, bled: 0,   // v5.5 부위 (눈 · 팔) · 출혈
      heads: tr.includes('머리 넷') ? 4 : 1, cry:"""),
("""  if (W.t < u.pinT) p *= 0.8;
  if (blindTo(W, u, t)) p *= R.darkAimFar != null ? R.darkAimFar : 0.1;""", """  if (W.t < u.pinT) p *= 0.8;
  if (blindTo(W, u, t)) p *= R.darkAimFar != null ? R.darkAimFar : 0.1;
  p *= u.aimMaim || 1;   // v5.5 눈 · 팔을 잃음"""),
("""  if (blindTo(W, u, t)) p *= W.rules.darkAimFar != null ? W.rules.darkAimFar : 0.1;
  return Math.max(0.02, Math.min(0.99, p));
}
function startThrow""", """  if (blindTo(W, u, t)) p *= W.rules.darkAimFar != null ? W.rules.darkAimFar : 0.1;
  p *= u.aimMaim || 1;   // v5.5 눈 · 팔을 잃음
  return Math.max(0.02, Math.min(0.99, p));
}
function startThrow"""),
("""  if (crit && !J && t.alive){
    if (part === '다리' && dmg >= t.max * (CR.legMin || 0.12) && W.rand() < (CR.cripple != null ? CR.cripple : 0.6)) cripple(W, t, u.i, wk);
    else if (extra && extra.heavyCrit && u.mass >= t.mass * 0.6) knockDown(W, t, (R.heavy || {}).down || 1.2, u.i, '치명타');
  }
  return o;
}""", """  // v5.5 자르는 것은 근접 날붙이뿐 (투창 · 화살 · 총은 꿰뚫어 부숨)
  const cutK = wk === '날붙이' && (o.far || J) ? '찌름' : wk;
  if (crit && t.alive){
    if (part === '다리' && dmg >= t.max * (CR.legMin || 0.12) && W.rand() < (CR.cripple != null ? CR.cripple : 0.6) * maimRes(W, t)) cripple(W, t, u.i, cutK);   // v5.5 무거운 몸은 덜 · 투창도
    else if (!J && extra && extra.heavyCrit && u.mass >= t.mass * 0.6) knockDown(W, t, (R.heavy || {}).down || 1.2, u.i, '치명타');
  }
  // v5.5 부위 파괴 · 절단: 머리 → 눈, 팔 → 팔. 치명 (최대 체력의 min 넘게) 이면 maim.p, 치명이 아니어도 크게 (big 넘게) 맞으면 bigP. 무거운 몸은 덜
  if (t.alive && !t.undying && (part === '머리' || part === '팔') && !(extra && extra.noWound)){
    const M = R.maim || {}, big = dmg >= t.max * (M.big != null ? M.big : 0.35);
    const pm = crit && dmg >= t.max * (M.min != null ? M.min : 0.1) ? (M.p != null ? M.p : 0.5) : big ? (M.bigP != null ? M.bigP : 0.1) : 0;
    if (pm && W.rand() < pm * maimRes(W, t)){ if (part === '머리') maimEye(W, t, u.i); else maimArm(W, t, u.i, cutK); }
  }
  return o;
}"""),
("""  L(W, { k: 'cripple', a: by, b: u.i, how: u.legLoss, vis: u.side === 0 || !!u.seenBy });""", """  if (u.legLoss === '절단') startBleed(W, u, by);   // v5.5 잘린 다리는 피를 흘림
  L(W, { k: 'cripple', a: by, b: u.i, how: u.legLoss, bleed: u.legLoss === '절단', vis: u.side === 0 || !!u.seenBy });"""),
("""// 등 뒤 (dx, dy 쪽) reach 칸 안이 바위인가""", open('maim_block.js',encoding='utf-8').read() + """// 등 뒤 (dx, dy 쪽) reach 칸 안이 바위인가"""),
("""  if (o && o.block && t.alive){ t.post -= H.post || 45;""", """  if (o && !o.block) crushBone(W, u, t);   // v5.5 막지 못하고 맞으면 뼈가 부러질 수 있음
  if (o && o.block && t.alive){ t.post -= H.post || 45;"""),
("""    else hurtRaw(W, u, t, u.atk * u.atkMul * (W.rules.lethal || 1) * (H.stomp || 2.2), { tag: nm });""", """    else { hurtRaw(W, u, t, u.atk * u.atkMul * (W.rules.lethal || 1) * (H.stomp || 2.2), { tag: nm }); crushBone(W, u, t); }   // v5.5 짓밟혀 뼈가 부러짐"""),
("""    else if (A.k === 'atk' && !far && angDiff(u.face, Math.atan2(t.y - u.y, t.x - u.x)) > rv(W, 'faceArc', 70) * Math.PI / 180) why = '몸을 돌리지 못함';""", """    else if (A.k === 'atk' && !far && angDiff(u.face, Math.atan2(t.y - u.y, t.x - u.x)) > rv(W, 'faceArc', 70) * Math.PI / 180) why = '몸을 돌리지 못함';
    else if (A.k === 'atk' && u.blind && W.rand() < ((R.maim || {}).blindMiss != null ? R.maim.blindMiss : 0.35)) why = '눈이 멀어 헛침';   // v5.5"""),
("""      t.hp += amt; u.healed += amt;
      L(W, { k: 'heal', a: u.i, b: t.i, amt, hp: Math.round(t.hp) });""", """      t.hp += amt; u.healed += amt; const stanch = !!t.bleed; t.bleed = null;   // v5.5 지혈
      L(W, { k: 'heal', a: u.i, b: t.i, amt, hp: Math.round(t.hp), stanch });"""),
("""    L(W, { k: 'skill', a: u.i, b: t.i, amt, hp: Math.round(t.hp), left: K.left, name: K.name, auto: A.auto, kit: true, revive });""", """    const stanch = !!t.bleed; t.bleed = null;   // v5.5 지혈
    L(W, { k: 'skill', a: u.i, b: t.i, amt, hp: Math.round(t.hp), left: K.left, name: K.name, auto: A.auto, kit: true, revive, stanch });"""),
("""    L(W, { k: 'skill', a: u.i, b: t.i, amt, hp: Math.round(t.hp), left: K.left, name: K.name, auto: A.auto });""", """    const stanch = !!t.bleed; t.bleed = null;   // v5.5 지혈
    L(W, { k: 'skill', a: u.i, b: t.i, amt, hp: Math.round(t.hp), left: K.left, name: K.name, auto: A.auto, stanch });"""),
("""  const K = u.skill; if (!K || K.left <= 0 || (K.kit && W.t < K.cdT)) return false;""", """  const K = u.skill; if (!K || u.noArms || K.left <= 0 || (K.kit && W.t < K.cdT)) return false;"""),
("""  const v = W.units.filter(a => a.side === u.side && ((a.alive && a.hp < a.max * thr) || (K.kit && a.down)) && dist(a, u) <= far).sort((a, b) => (b.down ? 1 : 0) - (a.down ? 1 : 0) || a.hp / a.max - b.hp / b.max)[0];""",
 """  const v = W.units.filter(a => a.side === u.side && ((a.alive && (a.hp < a.max * thr || a.bleed)) || (K.kit && a.down)) && dist(a, u) <= far).sort((a, b) => (b.down ? 1 : 0) - (a.down ? 1 : 0) || (b.bleed ? 1 : 0) - (a.bleed ? 1 : 0) || a.hp / a.max - b.hp / b.max)[0];   // v5.5 피 흘리는 동료 (지혈)"""),
("""    const hurt = W.units.filter(a => a.alive && a.side === u.side && a.hp < a.max * R.healAt).sort(""", """    const hurt = W.units.filter(a => a.alive && a.side === u.side && (a.hp < a.max * R.healAt || a.bleed)).sort("""),
("""  if (sx){ u.state = 'fight'; u.target = sx[0]; u.last = { x: sx[1].x, y: sx[1].y }; return; }
  u.target = null;""", """  if (sx){ u.state = 'fight'; u.target = sx[0]; u.last = { x: sx[1].x, y: sx[1].y }; return; }
  // v5.5 동료가 불러 준 자리 (브리핑 연동): 내가 못 봐도 동료가 본 상대 쪽으로 — 1초 안 소식, 지키는 자리 (stay) · 주인공 둘레 안만.
  // 눈이 먼 쪽은 사수면 따라가지 않고, 근접은 2.5칸 안이면 더듬어 다가감
  const cl = foes.map(f => [f, u.sense[f.i]]).filter(([f, s]) => s && s.call && W.t - s.t < 1 && ((u.hero && !u.stay) || Math.hypot(s.x - anchor.x, s.y - anchor.y) <= lim) && !(u.blind && (isFar(u) || Math.hypot(s.x - u.x, s.y - u.y) > 2.5))).sort((a, b) => Math.hypot(a[1].x - u.x, a[1].y - u.y) - Math.hypot(b[1].x - u.x, b[1].y - u.y))[0];
  if (cl){ u.state = 'fight'; u.target = cl[0]; u.last = { x: cl[1].x, y: cl[1].y }; return; }
  u.target = null;"""),
("""    setMood(W, u, '추적', t.i);""", """    setMood(W, u, u.sense[t.i] && u.sense[t.i].call && W.t - u.sense[t.i].t < 1 ? (u.blind ? '더듬어 감' : '동료가 부른 쪽으로') : '추적', t.i);   // v5.5 브리핑 연동"""),
("""  for (const u of W.units) if (u.alive && u.kb) stepKb(W, u, dt);   // v5.2 밀려나 날아가는 몸""", """  for (const u of W.units) if (u.alive && u.kb) stepKb(W, u, dt);   // v5.2 밀려나 날아가는 몸
  for (const u of W.units) if (u.alive && u.bleed) stepBleed(W, u, dt);   // v5.5 출혈"""),
("""W.sqT = (R.squad || {}).t || 0.5; planSquads(W); planStance(W); }""", """W.sqT = (R.squad || {}).t || 0.5; planSquads(W); planStance(W); callouts(W); }   // v5.5 아군 시야 연동 (브리핑)"""),
("""* (a.ammoMax != null && a.ammo === 0 ? 0.3 : 1);""", """* (a.ammoMax != null && a.ammo === 0 ? 0.3 : 1) * (a.blind ? 0.4 : 1);   // v5.5 실명"""),
("""wounds: u.wounds.slice(), prone: W.t < u.proneT, crawl: !!u.crawl })) });""", """wounds: u.wounds.slice(), prone: W.t < u.proneT, crawl: !!u.crawl, blind: !!u.blind, eyeLost: u.eyeLost, eyes: u.eyes, arms: { L: u.arms.L, R: u.arms.R }, bleed: !!u.bleed })) });   // v5.5 부위"""),
("""if (typeof module !== 'undefined') module.exports = { laneSpot,""", """if (typeof module !== 'undefined') module.exports = { maimEye, maimArm, crushBone, startBleed, maimRes, callouts, laneSpot,"""),
]
check('rt3_head.js',H); check('rt3_mid.js',M); check('rt3_tail.js',T)
patch('rt3_head.js',H); patch('rt3_mid.js',M); patch('rt3_tail.js',T)
print('ok')
