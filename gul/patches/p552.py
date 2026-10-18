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
("/* ===== 전투 엔진 v5.5.1 —", "/* ===== 전투 엔진 v5.5.2 —"),
("""   v5.5.1: [불사] (레베카) 는 죽지 않음""", """   v5.5.2: 사격 솜씨 [사격X] (S · A · B · C): 원거리 명중에서 남은 빗나감을 grades.사격 만큼 줄이고, 움직이는 상대 · 움찔 · 점사의 흔들림도 덜함. 노먼 = [사격A] (베테랑 정규군).
           돌진 명령은 지휘관을 믿고 뜀: 내가 못 봐도 동료가 보고 있으면 (아군 시야 연동) 그대로 들이받음. 아무도 못 보면 마지막으로 본 자리로 달려가 다시 보이면 들이받음.
           쓰러진 [불사] 를 치면 일어나는 게이지 (피 / 일어나는 피) 가 깎이고, 바닥까지 떨어뜨리면 '다시 죽임' (몇 번이고).
   v5.5.1: [불사] (레베카) 는 죽지 않음"""),
("""'지휘': { S: 4, A: 3, B: 2, C: 1 } },   // v5.4 [지휘X] = 편의 지휘력 점수""",
 """'지휘': { S: 4, A: 3, B: 2, C: 1 }, '사격': { S: 0.7, A: 0.55, B: 0.4, C: 0.25 } },   // v5.4 [지휘X] = 편의 지휘력 점수 · v5.5.2 [사격X] = 원거리 명중에서 남은 빗나감을 줄이는 몫"""),
]
T=[
("""      bladeHands: !!p.bladeHands, strMul: gradeMul(rules, p.traits, '괴력'),""", """      marks: marksOf(rules, p.traits),   // v5.5.2 사격 솜씨 [사격X]
      bladeHands: !!p.bladeHands, strMul: gradeMul(rules, p.traits, '괴력'),"""),
("""function gradeMul(rules, traits, key){""", """// v5.5.2 사격 솜씨 [사격X]: 원거리 명중에서 남은 빗나감을 줄이는 몫 (없으면 0)
function marksOf(rules, traits){ for (const t of traits || []) if (/^사격[SABC]$/.test(t)){ const g = rules.grades && rules.grades['사격']; return (g && g[t.slice(-1)]) || { S: 0.7, A: 0.55, B: 0.4, C: 0.25 }[t.slice(-1)]; } return 0; }
function gradeMul(rules, traits, key){"""),
("""  let p = R.aimNear + (far - R.aimNear) * f;
  if (Math.hypot(t.vx, t.vy) > 0.6) p *= 0.85;
  if (W.t < u.pinT) p *= 0.8;
  if (blindTo(W, u, t)) p *= R.darkAimFar != null ? R.darkAimFar : 0.1;""", """  let p = R.aimNear + (far - R.aimNear) * f;
  const mk = u.marks || 0; p += (1 - p) * mk;   // v5.5.2 사격 솜씨: 남은 빗나감을 mk 만큼 줄임
  if (Math.hypot(t.vx, t.vy) > 0.6) p *= 1 - 0.15 * (1 - mk);   // 움직이는 상대 (솜씨가 좋을수록 덜 흔들림)
  if (W.t < u.pinT) p *= 1 - 0.2 * (1 - mk * 0.5);   // 움찔
  if (blindTo(W, u, t)) p *= R.darkAimFar != null ? R.darkAimFar : 0.1;"""),
("""launch(W, u, t, B.mul, Math.max(0.5, 1 - 0.1 * B.k));""", """launch(W, u, t, B.mul, Math.max(0.5, 1 - 0.1 * B.k * (1 - 0.7 * (u.marks || 0))));"""),
# 돌진 명령: 시야 없이도
("""|| !canSee(W, u, t) || !fatClear(W.map, u.x, u.y, t.x, t.y, u.r * 0.9)) return false;""",
 """|| (!canSee(W, u, t) && !(forced && (u.side === 0 ? t.seenBy : fresh(W, u.sense[t.i], 1.5)))) || !fatClear(W.map, u.x, u.y, t.x, t.y, u.r * 0.9)) return false;   // v5.5.2 명령이면 내가 못 봐도 동료가 보면 들이받음"""),
("""    if (!see && !(u.side === 0 ? t.seenBy : fresh(W, u.sense[t.i], 1))){ toAtk(''); return; }   // 아무도 못 봄 → 공격 명령이 찾아감
    if (see && tryCharge(W, u, t, true)){ u.order = { k: 'attack', b: t.i }; return; }
    const ready = W.t >= u.chargeCd;
    if (see || gap(u, t) < (C.max || 5) + 1.5){""",
 """    // v5.5.2 지휘관을 믿고 뜀: 내가 못 봐도 동료가 보면 (아군 시야 연동) 그대로. 아무도 못 보면 마지막으로 본 자리로 달려가 다시 보이면 들이받음
    const known = see || (u.side === 0 ? !!t.seenBy : fresh(W, u.sense[t.i], 1));
    if (known) u.last = { x: t.x, y: t.y };
    else { const lp = u.last || { x: t.x, y: t.y }; if (Math.hypot(lp.x - u.x, lp.y - u.y) < 0.4){ toAtk(''); return; } setMood(W, u, '돌진 — 마지막 자리로', t.i); goTo(W, u, lp.x, lp.y, dt); return; }
    if (tryCharge(W, u, t, true)){ u.order = { k: 'attack', b: t.i }; return; }
    const ready = W.t >= u.chargeCd;
    if (known || gap(u, t) < (C.max || 5) + 1.5){"""),
# 다시 죽임
("""    u.pinHitT = W.t; d.pinnedT = W.t; d.hp = Math.max(0, d.hp - dm);
    L(W, { k: 'pinDown', a: u.i, b: d.i, dmg: dm, hp: Math.round(d.hp), need: Math.round(d.max * undMove(W)), vis: true });""",
 """    const hp0 = d.hp; u.pinHitT = W.t; d.pinnedT = W.t; d.hp = Math.max(0, d.hp - dm);
    const rk = hp0 > 0 && d.hp <= 0; if (rk) d.reKills = (d.reKills || 0) + 1;   // v5.5.2 게이지를 바닥까지 = 다시 죽임 (몇 번이고)
    L(W, { k: 'pinDown', a: u.i, b: d.i, dmg: dm, hp: Math.round(d.hp), need: Math.round(d.max * undMove(W)), rekill: rk, n: d.reKills || 0, vis: true });"""),
("""if (typeof module !== 'undefined') module.exports = { applyDmg,""", """if (typeof module !== 'undefined') module.exports = { marksOf, aimP, tryCharge, applyDmg,"""),
]
check('rt3_head.js',H); check('rt3_tail.js',T)
patch('rt3_head.js',H); patch('rt3_tail.js',T)
print('ok')
