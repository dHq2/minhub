import sys
def patch(p, pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        c=s.count(o)
        if c!=1: print('MISMATCH',p,c,o[:100]); sys.exit(1)
        s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)

patch('rt3_head.js',[
("""'활':{rng:6, ammo:12, aim:0.5, vel:16, kind:'활'}, '저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:80, kind:'총포류'} },""",
"""'활':{rng:6, ammo:30, aim:0.5, vel:16, kind:'활'}, '저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:80, kind:'총포류'},
             '소총':{rng:6, ammo:120, mag:30, reload:2.5, burst:2, burstMax:6, burstP:0.1, burstGap:0.09, burstMul:0.65, loud:true, aim:0.55, vel:70, kind:'총포류'} },"""),
("""  ffBase: 0.02,""","""  // v5.1 갑옷 · 투구 ([갑피] = 둘 다 몸에): 맞은 무기 종류별 받는 피해 × — 갑옷은 몸통 · 팔 · 다리, 투구는 머리 (헤드샷 · 날붙이에 강하고 둔기에 약함)
  armor: {
    '갑옷': { '날붙이': 0.7, '둔기': 0.9, '짐승': 0.75, '활': 0.6, '총포류': 0.85, '마법': 1, '맨손': 0.8 },
    '투구': { '날붙이': 0.5, '둔기': 0.85, '짐승': 0.6, '활': 0.45, '총포류': 0.6, '마법': 1, '맨손': 0.7 },
  },
  undying: { rise: 8, hp: 0.3, regen: 0.025 },   // [불사]: 쓰러져도 rise 초 뒤 최대 체력의 hp 로 일어남 · 초당 regen 재생 · 상처 (팔 · 다리) 가 남지 않음
  ffBase: 0.02,"""),
])

patch('rt3_tail.js',[
# 유닛: 탄약 (인물마다) · 탄창 · 갑옷 · 불사 · 구급상자
("""    const s = statsOf(p, rules), wp = (p.weapon && rules.weapons && rules.weapons[p.weapon]) || {}, far = s.rng > 1;""",
"""    const s = statsOf(p, rules), wp = (p.weapon && rules.weapons && rules.weapons[p.weapon]) || {}, far = s.rng > 1, tr = p.traits || [];
    // v5.1 탄약: 인물마다 따로 정할 수 있음 (p.ammo). 탄창 (mag) 이 있는 무기는 탄창이 비면 재장전
    const am0 = far ? (p.ammo != null && p.ammo !== '' && isFinite(+p.ammo) ? Math.max(0, Math.round(+p.ammo)) : wp.ammo != null ? wp.ammo : null) : null;"""),
("""      ammo: far && wp.ammo != null ? wp.ammo : null, ammoMax: far && wp.ammo != null ? wp.ammo : null, loud: far && !!wp.loud, aim: far && wp.aim != null ? wp.aim : null,""",
"""      ammo: am0, ammoMax: am0, loud: far && !!wp.loud, aim: far && wp.aim != null ? wp.aim : null,
      mag: wp.mag && am0 != null ? Math.min(wp.mag, am0) : null, magMax: wp.mag && am0 != null ? wp.mag : null, burst: null,
      arm: tr.includes('갑옷') || tr.includes('갑피'), helm: tr.includes('투구') || tr.includes('갑피'), undying: tr.includes('불사'), down: false, riseT: null,"""),
("""      skill: p.skill && +p.skill.pool > 0 ? { name: p.skill.name || '치유', pool: +p.skill.pool, left: +p.skill.pool, per: +(p.skill.per || 120), wind: +(p.skill.wind || 0.8), rec: +(p.skill.rec || 0.4), rng: +(p.skill.rng != null ? p.skill.rng : 0.5) } : null,""",
"""      skill: p.skill && +p.skill.pool > 0 ? { name: p.skill.name || '치유', pool: +p.skill.pool, left: +p.skill.pool, per: +(p.skill.per || 120), wind: +(p.skill.wind || 0.8), rec: +(p.skill.rec || 0.4), rng: +(p.skill.rng != null ? p.skill.rng : 0.5),
        // v5.1 구급상자 (kit): pool = 개수, 한 번에 최대 체력의 pct, 쓰고 나면 cd 초 대기, 동료 체력이 auto 아래면 스스로 (쓰러진 [불사] 동료는 일으킴)
        kit: !!p.skill.kit, pct: +(p.skill.pct || 0.4), cd: +(p.skill.cd || 0), cdT: -9, auto: p.skill.auto != null ? +p.skill.auto : null } : null,"""),
# 사격: 점사 · 탄창
("""    else if (far){
      // 쏨: 이 순간 대상이 있는 쪽으로 탄이 날아감 (따라가지 않음). 길에 먼저 닿는 몸이 맞음 — 다른 적 · 아군 (오사) 도
      fire(W, u);
      launch(W, u, t);
      if (u.ammo === 0) outOfAmmo(W, u);""",
"""    else if (far){
      // 쏨: 이 순간 대상이 있는 쪽으로 탄이 날아감 (따라가지 않음). 길에 먼저 닿는 몸이 맞음 — 다른 적 · 아군 (오사) 도
      // v5.1 점사 (소총): 보통 burst 발, burstP 확률로 burstMax 발 ("드르르륵!") — burstGap 초 간격, 한 발 피해 ×burstMul, 갈수록 조금씩 흩어짐
      const wp = (R.weapons && R.weapons[u.weapon]) || {};
      let n = 1;
      if (wp.burst){ n = W.rand() < (wp.burstP || 0) ? wp.burstMax || wp.burst : wp.burst; n = Math.max(1, Math.min(n, u.magMax ? u.mag : u.ammo != null ? u.ammo : n)); }
      fire(W, u);
      launch(W, u, t, n > 1 ? wp.burstMul || 0.65 : 1, 1);
      if (n > 1){ u.burst = { b: t.i, left: n - 1, gap: wp.burstGap || 0.09, next: W.t + (wp.burstGap || 0.09), mul: wp.burstMul || 0.65, k: 1 }; if (n >= (wp.burstMax || 6)) L(W, { k: 'burst', a: u.i, b: t.i, n, vis: u.side === 0 || !!u.seenBy }); }
      if (u.ammo === 0) outOfAmmo(W, u);"""),
("""    A.phase = 'rec'; A.end = W.t + u.rec; A.t1 = W.t;
    return;""","""    A.phase = 'rec'; A.end = W.t + u.rec; A.t1 = W.t;
    if (u.burst) A.end = Math.max(A.end, u.burst.next + (u.burst.left - 1) * u.burst.gap + 0.05);   // 점사가 끝날 때까지
    return;"""),
("""function launch(W, u, t){
  const wp = (W.rules.weapons && W.rules.weapons[u.weapon]) || {};
  const d = Math.max(0.3, dist(u, t)), p = aimP(W, u, t), base = Math.atan2(t.y - u.y, t.x - u.x);""",
"""function launch(W, u, t, mul, pMul){
  const wp = (W.rules.weapons && W.rules.weapons[u.weapon]) || {};
  const d = Math.max(0.3, dist(u, t)), p = aimP(W, u, t) * (pMul || 1), base = Math.atan2(t.y - u.y, t.x - u.x);"""),
("""dx, dy, sp: wp.vel || 40, left: u.rng + u.r + 2.5, p: +p.toFixed(2), t0: W.t, side: u.side });
}""","""dx, dy, sp: wp.vel || 40, left: u.rng + u.r + 2.5, p: +p.toFixed(2), t0: W.t, side: u.side, mul: mul || 1 });
}
// 점사의 다음 발들 (회복 중에 이어서): 대상이 쓰러지거나 탄이 떨어지거나 사선이 막히면 멈춤
function tickBurst(W, u){
  const B = u.burst, t = W.units[B.b];
  while (u.burst && W.t >= B.next){
    if (!t.alive || (u.ammo != null && u.ammo <= 0) || (u.magMax && u.mag <= 0) || !losClear(W.map, u.x, u.y, t.x, t.y)){ u.burst = null; break; }
    fire(W, u); launch(W, u, t, B.mul, Math.max(0.5, 1 - 0.1 * B.k)); B.k++; B.left--; B.next += B.gap;
    if (u.ammo === 0) outOfAmmo(W, u);
    if (B.left <= 0) u.burst = null;
  }
}
// 재장전: 탄창이 비면 (또는 싸움이 없을 때 반 넘게 비었으면) — reload 초 동안 못 쏘고 못 움직임 (틈)
function startReload(W, u){
  const wp = (W.rules.weapons && W.rules.weapons[u.weapon]) || {};
  u.act = { k: 'reload', phase: 'wind', t0: W.t, end: W.t + (wp.reload || 2), why: '재장전' };
  stop(u); setMood(W, u, '재장전');
  L(W, { k: 'reload', a: u.i, mag: u.mag, ammo: u.ammo, vis: u.side === 0 || !!u.seenBy });
}
const needReload = u => u.magMax && u.mag <= 0 && u.ammo > 0;"""),
("""function fire(W, u){
  u.shots++;
  if (u.ammo != null) u.ammo = Math.max(0, u.ammo - 1);""","""function fire(W, u){
  u.shots++;
  if (u.ammo != null) u.ammo = Math.max(0, u.ammo - 1);
  if (u.magMax && u.mag > 0) u.mag--;"""),
("""        const o2 = strike(W, u, hit, W.units[s.meant], hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true, s.jav ? { jav: true } : null);""",
"""        const o2 = strike(W, u, hit, W.units[s.meant], hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true, s.jav ? { jav: true } : s.mul && s.mul !== 1 ? { mul: s.mul } : null);"""),
("""  const dir = sideOf(W, t, u), base = u.atk * u.atkMul * (led ? 1 + R.aura : 1) * v * (R.lethal || 1) * (J ? J.mul : 1);""",
"""  const dir = sideOf(W, t, u), base = u.atk * u.atkMul * (led ? 1 + R.aura : 1) * v * (R.lethal || 1) * (J ? J.mul : 1) * (extra && extra.mul ? extra.mul : 1);"""),
# 갑옷 · 투구
("""  const dmg = Math.max(1, Math.round(base * flank * (P[part] ? P[part].mul : 1) * (amb ? R.ambushMul || 1 : 1) * (crit ? J.critMul : 1)));
  o.part = part; o.ambush = amb; o.jav = !!J; o.crit = crit;""",
"""  // v5.1 갑옷 · 투구: 맞은 무기 종류 (날붙이 · 둔기 · 짐승 · 활 · 총포류 · 마법 · 맨손) 에 따라 받는 피해 ×
  const wk = (u.bladeHands && !o.far) || J ? '날붙이' : (((R.weapons || {})[u.weaponNow || u.weapon] || {}).kind || '맨손');
  const armK = part === '머리' ? (t.helm ? '투구' : null) : (t.arm ? '갑옷' : null), AR = (R.armor || {})[armK] || {}, armMul = armK && AR[wk] != null ? AR[wk] : 1;
  const dmg = Math.max(1, Math.round(base * flank * (P[part] ? P[part].mul : 1) * (amb ? R.ambushMul || 1 : 1) * (crit ? J.critMul : 1) * armMul));
  o.part = part; o.ambush = amb; o.jav = !!J; o.crit = crit; o.armor = armMul < 1 ? armK : null; o.wk = wk;"""),
("""  if (dmg >= t.max * 0.1 && t.hp > dmg){""","""  if (!t.undying && dmg >= t.max * 0.1 && t.hp > dmg){   // [불사] 는 상처가 남지 않음"""),
# 쓰러짐: 불사
("""  if (t.hp <= 0){
    t.alive = false; t.hp = 0; t.act = null; u.kills++; if (!o.ff) W.kills[u.side]++; stop(t);
    L(W, { k: 'die', a: u.i, b: t.i, ff: !!o.ff });""",
"""  if (t.hp <= 0){
    t.alive = false; t.hp = 0; t.act = null; t.burst = null; stop(t);
    if (t.undying){ t.down = true; t.riseT = W.t + rv(W, 'undying', {}).rise || 8; L(W, { k: 'down', a: u.i, b: t.i, ff: !!o.ff, rise: +(t.riseT - W.t).toFixed(1) }); }   // [불사]: 쓰러져도 일어남
    else { u.kills++; if (!o.ff) W.kills[u.side]++; L(W, { k: 'die', a: u.i, b: t.i, ff: !!o.ff }); }"""),
("""  L(W, { k: 'hit', a: u.i, b: t.i, dmg: real,""","""  L(W, { k: 'hit', armor: o.armor || null, a: u.i, b: t.i, dmg: real,"""),
# 기술: 구급상자
("""  if (!t.alive) why = '대상이 이미 쓰러짐';
  else if (t !== u && gap(u, t) > K.rng + R.reach) why = `손이 안 닿음 (${gap(u, t).toFixed(1)}칸 떨어짐)`;
  else if (K.left <= 0) why = '약이 다 떨어짐';
  if (why) L(W, { k: 'miss', a: u.i, b: t.i, why, skill: K.name });
  else {""","""  if (!t.alive && !(K.kit && t.down)) why = '대상이 이미 쓰러짐';
  else if (t !== u && gap(u, t) > K.rng + R.reach) why = `손이 안 닿음 (${gap(u, t).toFixed(1)}칸 떨어짐)`;
  else if (K.left <= 0) why = '약이 다 떨어짐';
  if (why) L(W, { k: 'miss', a: u.i, b: t.i, why, skill: K.name });
  else if (K.kit){   // 구급상자: 쓰러진 [불사] 동료는 바로 일으킴, 아니면 최대 체력의 pct 만큼
    const revive = t.down;
    if (revive) rise(W, t, K.pct); else t.hp += Math.max(0, Math.min(Math.round(t.max * K.pct), Math.round(t.max - t.hp)));
    const amt = revive ? Math.round(t.hp) : Math.round(Math.min(t.max * K.pct, t.hp)); K.left--; K.cdT = W.t + K.cd; u.healed += amt;
    L(W, { k: 'skill', a: u.i, b: t.i, amt, hp: Math.round(t.hp), left: K.left, name: K.name, auto: A.auto, kit: true, revive });
    if (u.order && u.order.k === 'skill' && u.order.b === t.i){ u.order = null; u.stay = u.stay || { x: u.x, y: u.y }; }
    if (W.fxOn){ W.fx.push({ k: 'shot', a: u.i, b: t.i, t0: W.t, dur: 0.25, heal: true }); W.fx.push({ k: 'num', x: t.x, y: t.y, s: (revive ? '일으킴 ' : '+') + amt, c: 'h', t0: W.t }); }
  }
  else {"""),
("""function emergency(W, u, dt){
  const K = u.skill; if (!K || K.left <= 0) return false;
  const R = W.rules, far = u.side === 0 && u.order ? R.skillReach : R.leash;
  const v = W.units.filter(a => a.alive && a.side === u.side && a.hp < a.max * R.bucketAuto && dist(a, u) <= far).sort((a, b) => a.hp / a.max - b.hp / b.max)[0];""",
"""function emergency(W, u, dt){
  const K = u.skill; if (!K || K.left <= 0 || (K.kit && W.t < K.cdT)) return false;
  const R = W.rules, far = u.side === 0 && u.order ? R.skillReach : R.leash, thr = K.auto != null ? K.auto : R.bucketAuto;
  // 구급상자: 쓰러진 [불사] 동료가 먼저
  const v = W.units.filter(a => a.side === u.side && ((a.alive && a.hp < a.max * thr) || (K.kit && a.down)) && dist(a, u) <= far).sort((a, b) => (b.down ? 1 : 0) - (a.down ? 1 : 0) || a.hp / a.max - b.hp / b.max)[0];"""),
("""    const t = W.units[o.b], K = u.skill;
    if (!K || !t || !t.alive || K.left <= 0){ u.order = { k: 'hold' }; return; }
    if (t.hp >= t.max - 0.5){ L(W, { k: 'skillSkip', a: u.i, b: t.i }); u.order = null; return; }""",
"""    const t = W.units[o.b], K = u.skill;
    if (!K || !t || !(t.alive || (K.kit && t.down)) || K.left <= 0){ u.order = { k: 'hold' }; return; }
    if (t.alive && t.hp >= t.max - 0.5){ L(W, { k: 'skillSkip', a: u.i, b: t.i }); u.order = null; return; }
    if (K.kit && W.t < K.cdT){ setMood(W, u, '구급상자 준비', t.i); if (gap(u, t) > K.rng) goTo(W, u, t.x, t.y, dt); else stop(u); return; }"""),
# 행동: 점사 이어 쏘기 · 재장전 · 불사 일어남 · 재생
("""function act(W, u, dt){
  if (u.act){ if (W.t >= u.act.end) resolveAct(W, u); return; }   // 준비 · 회복 중엔 못 움직임""",
"""function act(W, u, dt){
  if (u.act){ if (u.burst) tickBurst(W, u); if (u.act && W.t >= u.act.end) resolveAct(W, u); return; }   // 준비 · 회복 중엔 못 움직임 (점사는 회복 중에 이어 쏨)"""),
("""function resolveAct(W, u){
  if (u.act.k === 'skill'){ resolveSkill(W, u); return; }""","""function resolveAct(W, u){
  if (u.act.k === 'reload'){ u.mag = Math.min(u.magMax, u.ammo); u.act = null; L(W, { k: 'reloaded', a: u.i, mag: u.mag, ammo: u.ammo, vis: u.side === 0 || !!u.seenBy }); return; }
  if (u.act.k === 'skill'){ resolveSkill(W, u); return; }"""),
("""function checkEnd(W){
  const a = W.units.some(u => u.alive && u.side === 0), b = W.units.some(u => u.alive && u.side === 1);""",
"""// [불사] 일어남: 체력 pct (없으면 undying.hp) · 상처가 사라짐 · 자세 다시
function rise(W, t, pct){
  const U = W.rules.undying || {};
  t.alive = true; t.down = false; t.riseT = null; t.hp = Math.max(1, Math.round(t.max * (pct != null ? pct : U.hp != null ? U.hp : 0.3)));
  t.wounds = []; t.atkMul = 1; t.spdMul = 1; t.act = null; t.pinT = -9; t.post = Math.max(t.post, 40); t.brokenT = -9; t.state = 'idle'; t.target = null;
  L(W, { k: 'rise', a: t.i, hp: Math.round(t.hp), vis: t.side === 0 || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '일어남', c: 'h', t0: W.t });
}
function checkEnd(W){
  const a = W.units.some(u => (u.alive || u.down) && u.side === 0), b = W.units.some(u => (u.alive || u.down) && u.side === 1);"""),
("""  stepShots(W, dt);
  separate(W);""","""  stepShots(W, dt);
  // [불사]: 쓰러진 쪽은 때가 되면 일어나고, 살아 있으면 조금씩 재생
  for (const u of W.units){ if (!u.undying) continue; if (u.down && W.t >= u.riseT) rise(W, u); else if (u.alive && u.hp < u.max) u.hp = Math.min(u.max, u.hp + u.max * ((W.rules.undying || {}).regen || 0) * dt); }
  separate(W);"""),
# 재장전 시점: 쏘려는데 탄창이 빔 · 제자리 · 싸움이 없을 때 반 넘게 빔
("""function shoot(W, u, t, dt, ordered){
  const know = knows(W, u), g = gap(u, t);""","""function shoot(W, u, t, dt, ordered){
  if (needReload(u)){ startReload(W, u); return; }
  const know = knows(W, u), g = gap(u, t);"""),
("""    const know = knows(W, u);
    let ffBlock = null;""","""    if (needReload(u)){ startReload(W, u); return; }
    const know = knows(W, u);
    let ffBlock = null;"""),
("""function act2(W, u, dt){
  if (u.skill && emergency(W, u, dt)) return;""","""function act2(W, u, dt){
  if (u.skill && emergency(W, u, dt)) return;
  // 싸움이 없고 탄창이 반 넘게 비었으면 미리 재장전 (8칸 안에 아는 상대가 없을 때)
  if (u.magMax && !u.order && u.mag < u.magMax * 0.5 && u.ammo > u.mag && !W.units.some(f => f.alive && f.side !== u.side && dist(f, u) < 8 && (u.side === 0 ? f.seenBy : canSee(W, u, f)))){ startReload(W, u); return; }"""),
# 사수 표적: 쏘는 · 겨누는 상대, 사수 · 궁수부터
("""function roleBias(W, u, f){
  if (u.role !== '미드필더' && u.role !== '공격수') return 0;""","""function roleBias(W, u, f){
  // v5.1 사수: 상대 사수 · 궁수, 겨누는 중인 상대, 거의 죽은 상대부터
  if (u.role === '사수') return (f.canGuard && guardOn(W, f) && inGuard(W, f, u) ? -1 : 0) + (isFar(f) ? 1.5 : 0) + (f.act && f.act.phase === 'wind' ? 1 : 0) + (f.hp / f.max < 0.3 ? 1 : 0);
  if (u.role !== '미드필더' && u.role !== '공격수') return 0;"""),
("""    if (u.role === '미드필더' || u.role === '공격수'){
      const sc = f => -dist(u, f) * 0.8 + roleBias(W, u, f);""","""    if (u.role === '미드필더' || u.role === '공격수' || u.role === '사수'){
      const sc = f => -dist(u, f) * 0.8 + roleBias(W, u, f);"""),
("""if (typeof module !== 'undefined') module.exports = { roleOf,""","""if (typeof module !== 'undefined') module.exports = { rise, startReload, roleOf,"""),
])
print('ok')
