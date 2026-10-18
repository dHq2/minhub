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
("/* ===== 전투 엔진 v5.5 —", "/* ===== 전투 엔진 v5.5.1 —"),
("""   v5.5: 부위 파괴 · 절단 (굴 3D maim.js""", """   v5.5.1: [불사] (레베카) 는 죽지 않음 — 피가 0 이면 쓰러지고, 쓰러진 채로도 계속 재생해 피가 움직일 만큼 (undying.move) 차면 그 적은 피로 일어나 움직이며 계속 재생.
           쓰러진 [불사] 를 상대가 계속 치면 (pinDown — 칠 때마다 피를 깎음) 피가 차오르지 못해 계속 제압됨. 아군이 하나도 없으면 그때가 진짜 죽음.
           명령 (공격 · 투창) 은 아군 오사를 감수하고 쏨 — 사선의 동료를 맞힐지는 탄이 실제로 날아가 정함 (확률 싸움). 준비 때 오사 확률을 기록.
           새 명령은 바로 끼어듦: 준비 중인 공격 · 사격 · 투창 · 밀치기 · 약과 이어 쏘던 점사를 끊음 (같은 일이면 그대로). 약 명령은 위급 자동 판단보다 먼저.
   v5.5: 부위 파괴 · 절단 (굴 3D maim.js"""),
("""  undying: { rise: 8, hp: 0.3, regen: 0.025, pin: 3 },   // [불사]: 쓰러져도 rise 초 뒤 최대 체력의 hp 로 일어남 · 초당 regen 재생 · 상처 (팔 · 다리) 가 남지 않음. v5.2 쓰러진 채 맞으면 (확인사살) 일어나는 때가 적어도 pin 초 뒤로 밀림""",
 """  // [불사]: 죽지 않음 — 피가 0 이면 쓰러지고, 쓰러진 채로도 초당 regen (최대 체력 비율) 재생, 피가 move 에 이르면 그 피로 일어남 (계속 재생). 상처 · 부위가 남지 않음.
  // v5.5.1 쓰러진 채 맞으면 (상대가 눌러 둠) 공격 × pinHit 만큼 피가 깎여 못 일어남 (계속 제압). 아군이 하나도 없으면 진짜 죽음
  undying: { move: 0.15, regen: 0.025, pinHit: 0.5 },"""),
]
T=[
# 불사: 쓰러짐 / 진짜 죽음
("""    if (t.undying){ t.down = true; t.riseT = W.t + (rv(W, 'undying', {}).rise || 8); L(W, { k: 'down', a: u.i, b: t.i, ff: !!o.ff, rise: +(t.riseT - W.t).toFixed(1) }); }   // [불사]: 쓰러져도 일어남
    else { u.kills++; if (!o.ff) W.kills[u.side]++; L(W, { k: 'die', a: u.i, b: t.i, ff: !!o.ff }); }""",
 """    // [불사]: 죽지 않음 — 쓰러져 재생하다 피가 move 에 이르면 일어남 (v5.5.1). 아군이 하나도 없으면 진짜 죽음
    if (t.undying && W.units.some(o2 => o2.alive && o2 !== t && o2.side === t.side)){ t.down = true; t.riseT = null; L(W, { k: 'down', a: u.i, b: t.i, ff: !!o.ff, need: Math.round(t.max * undMove(W)), eta: +undEta(W, t).toFixed(1) }); }
    else { u.kills++; if (!o.ff) W.kills[u.side]++; L(W, { k: 'die', a: u.i, b: t.i, ff: !!o.ff, last: !!t.undying }); }"""),
("""function rise(W, t, pct){
  const U = W.rules.undying || {};
  t.alive = true; t.down = false; t.riseT = null; t.hp = Math.max(1, Math.round(t.max * (pct != null ? pct : U.hp != null ? U.hp : 0.3)));""",
 """// v5.5.1 일어나는 피: undying.move (최대 체력 비율) · 거기까지 걸리는 초 (지금 피에서, 아무도 안 칠 때)
const undMove = W => { const U = W.rules.undying || {}; return U.move != null ? U.move : 0.15; };
const undEta = (W, t) => Math.max(0, (t.max * undMove(W) - t.hp) / Math.max(1e-6, t.max * ((W.rules.undying || {}).regen || 0.025)));
function rise(W, t, pct){
  t.alive = true; t.down = false; t.riseT = null; t.hp = Math.max(1, pct != null ? Math.max(t.hp, Math.round(t.max * pct)) : t.hp);   // v5.5.1 재생해 찬 그 적은 피로 (구급상자는 pct 까지)"""),
("""  for (const u of W.units){ if (!u.undying) continue; if (u.down && W.t >= u.riseT) rise(W, u); else if (u.alive && u.hp < u.max) u.hp = Math.min(u.max, u.hp + u.max * ((W.rules.undying || {}).regen || 0) * dt); }""",
 """  // v5.5.1 [불사]: 쓰러진 채로도 재생 → 피가 move 에 이르면 일어남. 아군이 하나도 없으면 진짜 죽음
  for (const u of W.units){ if (!u.undying) continue; const rg = u.max * ((W.rules.undying || {}).regen || 0) * dt;
    if (u.down){
      if (!W.units.some(o => o.alive && o !== u && o.side === u.side)){ u.down = false; u.hp = 0; L(W, { k: 'die', a: u.i, b: u.i, ff: false, last: true, alone: true }); continue; }
      u.hp = Math.min(u.max, u.hp + rg); if (u.hp >= u.max * undMove(W)) rise(W, u);
    } else if (u.alive && u.hp < u.max) u.hp = Math.min(u.max, u.hp + rg); }"""),
("""    u.pinHitT = W.t; d.pinnedT = W.t; d.riseT = Math.max(d.riseT, W.t + ((W.rules.undying || {}).pin || 3));
    L(W, { k: 'pinDown', a: u.i, b: d.i, rise: +(d.riseT - W.t).toFixed(1), vis: true });""",
 """    // v5.5.1 칠 때마다 피를 깎음 (공격 × pinHit) — 재생보다 빨리 깎으면 계속 못 일어남
    const dm = Math.max(1, Math.round(u.atk * u.atkMul * (W.rules.lethal || 1) * ((W.rules.undying || {}).pinHit != null ? W.rules.undying.pinHit : 0.5)));
    u.pinHitT = W.t; d.pinnedT = W.t; d.hp = Math.max(0, d.hp - dm);
    L(W, { k: 'pinDown', a: u.i, b: d.i, dmg: dm, hp: Math.round(d.hp), need: Math.round(d.max * undMove(W)), vis: true });"""),
("""  // v5.2 쓰러진 [불사] 는 상대가 눌러 두고 있으면 (2.5초 안에 쳤음) 셈에서 빠짐
  const up = u => u.alive || (u.down && !(W.t - (u.pinnedT == null ? -9 : u.pinnedT) < 2.5));""",
 """  // v5.5.1 쓰러진 [불사] 는 셈에서 빠짐 (일어날 때까지) — 아군이 다 쓰러지면 진짜 죽음
  const up = u => u.alive;"""),
# 명령 사격: 오사 감수
("""function holdFire(W, u, t, jav){""", """// v5.5.1 명령 (공격 · 투창) 받은 상대를 쏘는 중: 아군 오사를 감수함 (확률 싸움 — 탄이 실제로 날아가 정함)
const ordFire = (u, t) => u.side === 0 && !!u.order && (u.order.k === 'attack' || u.order.k === 'throw') && !!t && u.order.b === t.i;
function holdFire(W, u, t, jav){"""),
("""    } else if (far && holdFire(W, u, t, false)){""", """    } else if (far && !ordFire(u, t) && holdFire(W, u, t, false)){   // v5.5.1 명령이면 멈추지 않음"""),
("""    if ((fb !== t && fb.side === u.side) || ffOdds(W, u, t, u.x, u.y, -0.4).p > 0.2){""", """    if (!ordFire(u, t) && ((fb !== t && fb.side === u.side) || ffOdds(W, u, t, u.x, u.y, -0.4).p > 0.2)){   // v5.5.1 명령이면 이어 쏨"""),
("""  else if (holdFire(W, u, t, true)){ A.phase = 'rec'; A.end = W.t + 0.15; A.t1 = W.t; return; }""", """  else if (!A.ord && holdFire(W, u, t, true)){ A.phase = 'rec'; A.end = W.t + 0.15; A.t1 = W.t; return; }   // v5.5.1 명령 투창은 멈추지 않음"""),
("""function startThrow(W, u, t, why){
  const J = JV(W);
  u.act = { k: 'throw', b: t.i, phase: 'wind', t0: W.t, end: W.t + J.wind, why: why || '투창', sx: t.x, sy: t.y, saw: canSee(W, u, t) };   // v5.4.3 겨눈 자리 (sx, sy)""",
 """function startThrow(W, u, t, why, ord){
  const J = JV(W);
  u.act = { k: 'throw', b: t.i, phase: 'wind', t0: W.t, end: W.t + J.wind, why: why || '투창', sx: t.x, sy: t.y, saw: canSee(W, u, t), ord: !!ord };   // v5.4.3 겨눈 자리 (sx, sy) · v5.5.1 명령 (오사 감수)
  const ffr = ord ? ffOdds(W, u, t, u.x, u.y, 0, true).p : 0;"""),
("""  L(W, { k: 'wind', a: u.i, b: t.i, jav: true, end: +(W.t + J.wind).toFixed(2), hid: u.side === 1 && !u.seenBy, why: why || '' });""",
 """  L(W, { k: 'wind', a: u.i, b: t.i, jav: true, end: +(W.t + J.wind).toFixed(2), hid: u.side === 1 && !u.seenBy, why: why || '', ffRisk: ffr > 0.03 ? +ffr.toFixed(2) : null });"""),
("""  if (best){ startThrow(W, u, best, ordered ? '투창' : best.act ? '틈을 노림' : supportOf(W, best) === 0 ? '고립된 상대' : '투창'); return true; }""",
 """  if (best){ startThrow(W, u, best, ordered ? '투창' : best.act ? '틈을 노림' : supportOf(W, best) === 0 ? '고립된 상대' : '투창', ordered); return true; }"""),
("""    if (see && javOdds(W, u, t, u.x, u.y, true)){ startThrow(W, u, t, '투창'); o.n = (o.n || 0) + 1; return; }""",
 """    if (see && javOdds(W, u, t, u.x, u.y, true)){ startThrow(W, u, t, '투창', true); o.n = (o.n || 0) + 1; return; }"""),
("""  if (first !== t && (first.side === u.side || inGuard(W, first, P0))) return 0;
  if (first === t && inGuard(W, t, P0) && !ordered) return 0;   // 막는 방향으로는 안 던짐 (한 번뿐이니)
  if (ffOdds(W, u, t, x, y, 0, true).p > (ordered ? 0.2 : ffLim(u, W))) return 0;""",
 """  if (first !== t && ((first.side === u.side && !ordered) || (first.side !== u.side && inGuard(W, first, P0)))) return 0;   // v5.5.1 명령이면 동료가 사선에 있어도 던짐 (오사 감수)
  if (first === t && inGuard(W, t, P0) && !ordered) return 0;   // 막는 방향으로는 안 던짐 (한 번뿐이니)
  if (!ordered && ffOdds(W, u, t, x, y, 0, true).p > ffLim(u, W)) return 0;"""),
("""  const first = firstOnLine(W, u, t, u, know);
  if (first !== t){
    if (first.side === u.side){ blockedShot(W, u, t, dt, ordered, first); return; }   // 사선에 아군 → 쏘지 않음""",
 """  const first = firstOnLine(W, u, t, u, know);
  if (first !== t && first.side === u.side && ordered) why = '오사 감수';   // v5.5.1 명령: 사선에 아군이 있어도 쏨 (맞힐지는 탄이 정함)
  else if (first !== t){
    if (first.side === u.side){ blockedShot(W, u, t, dt, ordered, first); return; }   // 사선에 아군 → 쏘지 않음"""),
("""  L(W, { k: 'wind', a: u.i, b: t.i, heal, mode, end: +(W.t + wind).toFixed(2), hid: u.side === 1 && !u.seenBy, why: heal ? '' : why || '' });""",
 """  const ffr = !heal && isFar(u) && ordFire(u, t) ? ffOdds(W, u, t, u.x, u.y).p : 0;   // v5.5.1 명령 사격의 오사 확률 (기록)
  L(W, { k: 'wind', a: u.i, b: t.i, heal, mode, end: +(W.t + wind).toFixed(2), hid: u.side === 1 && !u.seenBy, why: heal ? '' : why || '', ffRisk: ffr > 0.03 ? +ffr.toFixed(2) : null });"""),
# 명령 우선
("""function act2(W, u, dt){
  if (u.skill && emergency(W, u, dt)) return;""", """// v5.5.1 새 명령은 바로 끼어듦: 준비 중 (wind) 인 공격 · 사격 · 투창 · 밀치기 · 약 (약 명령이면 재장전도) 과 이어 쏘던 점사를 끊음.
// 같은 상대에게 같은 일이면 그대로. 달리는 돌진 · 도약 · 피하기 · 휘두른 뒤 회복은 못 끊음
function preempt(W, u){
  const o = u.order, a = u.act; let did = false;
  if (u.burst && !(o && o.k === 'attack' && u.burst.b === o.b)){ u.burst = null; did = true; }
  if (a && a.phase === 'wind' && (['atk', 'throw', 'skill', 'bash', 'heal'].includes(a.k) || (a.k === 'reload' && o && o.k === 'skill'))){
    const same = o && a.b === o.b && ((o.k === 'attack' && a.k === 'atk') || (o.k === 'throw' && a.k === 'throw') || (o.k === 'skill' && a.k === 'skill'));
    if (!same){ u.act = null; did = true; }
  }
  if (did) L(W, { k: 'cancel', a: u.i, was: a ? a.k : 'burst', vis: true });
  return did;
}
function act2(W, u, dt){
  if (u.skill && !(u.side === 0 && u.order && u.order.k === 'skill') && emergency(W, u, dt)) return;   // v5.5.1 약 명령이 위급 자동 판단보다 먼저"""),
("""    if (t.alive && t.hp >= t.max - 0.5){ L(W, { k: 'skillSkip'""", """    if (t.alive && t.hp >= t.max - 0.5 && !t.bleed){ L(W, { k: 'skillSkip'"""),
("""if (typeof module !== 'undefined') module.exports = { maimEye,""", """if (typeof module !== 'undefined') module.exports = { preempt, ordFire, undMove, undEta, maimEye,"""),
]
check('rt3_head.js',H); check('rt3_tail.js',T)
patch('rt3_head.js',H); patch('rt3_tail.js',T)
print('ok')
