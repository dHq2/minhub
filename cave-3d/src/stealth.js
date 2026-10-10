/* stealth.js v1.3 — (v1.3, v0.86: 모닥불에 앉아 쉬는 적은 덜 봄 (보이는 거리 55%) — 이제 모든 층에서 이 규칙) (v1.2, v0.59: 시야 부채꼴 표시는 훈련장에서만) (v1.1, v0.58: 어둠 · 엄폐 뒤 숙임이 발견을 막음) (v1.0, v0.56, 은밀히: 시야 안이면 시야 둘레로 크게 돌아 등 쪽으로) 은신 · 암살 · 방어가 중요한 싸움 · 숙이기 (훈련장 규칙)
   ■ 은신: 들키지 않은 적은 제자리에서 두리번거림. 앞쪽 (±65°)만 봄 + 바로 곁 발소리
     · 보이면 의심 (?)이 차오름 — 다 차면 ! (무리가 깨어남). 숙이면 (G · 동료는 '은밀히') 보이는 거리 절반, 은신 적성마다 7%씩 더 줄어듦
     · 달리면 4칸 안의 적이 발소리를 들음. 총소리는 벽 너머까지 (sol.js)
   ■ 암살: 들키지 않은 적의 등 뒤에서 근접으로 치면 암살 — 성공률 = 30% + 은신 적성 × 14% (5면 반드시). 무거운 놈은 1/3, 보스는 안 됨
     · 성공하면 소리 없이 쓰러짐 (보던 놈만 의심). 실패하면 크게 다치게 하고 들킴
     · 활 · 돌팔매로 들키지 않은 적을 쏘면 기습 (피해 2배)
     · 조 지시 '은밀히': 숙인 채 진형으로 따라오고, 혼자 있는 적의 등 뒤로 돌아 암살. 하나라도 들키면 '따라와'로 바뀜
   ■ 방어가 중요: 막는 동안 정면 피해 90% 감소 (화살 · 주술도). 막지 않을 때 맞으면 1.35배 — 원거리라고 안전하지 않음
     · 궁수 · 주술사 · 날랜 놈은 쏘고 있는 우리 편 (원거리)부터 노림
     · 거구 (곤봉 거한 · 장군님 · 도끼기사 …)의 내려찍기는 막기를 깸 (휘청)
   ■ 동료도 막고 숙임: 자기를 노린 예고가 보이면 — 상단이면 숙여서 흘리고, 아니면 막기 자세 (근접 적성이 높을수록 잘 반응)
     · 숙이는 그림이 없는 동료는 몸을 눌러 쭈그림. 카리우스 같은 거구는 숙여도 소용없어서 안 숙임 */
'use strict';
const STL = { lethal: true, stat: { kills: 0, fails: 0, spotted: 0, sneakShots: 0, guards: 0, ducks: 0, breaks: 0 } };
const visR = e => (e.D.bow ? 10 : 7.5) * (e.camp ? 0.55 : 1);   // 서서 보이는 거리 (숙이면 절반 · 은신 적성 · 움직임으로 바뀜) · v1.3 쉬는 중이면 55%
const cantCrouch = u => (u.S.tall || 1) > 2 || u.kind === 'kariusAlly' || u.D.heavy;
const plRunning = () => !!(G.player && (down('ShiftLeft') || down('ShiftRight')) && inputDir());
function stealthOf(a){ return a.sol ? aptOf(a, 'stealth') : 2; }
function isCrouched(a){ return a.posture === 'crouch' || !!a.sneak; }
// 들키지 않은 적: 두리번 · 의심
const _enemyThinkSt = enemyThink;
enemyThink = function(e, dt){
  if (!(typeof SQ !== 'undefined' && SQ.on) || e.alert || e.D.boss || e.lock) return _enemyThinkSt(e, dt);
  if (e.st === 'hurt'){ e.stT -= dt; if (e.stT <= 0){ e.st = 'idle'; setPose(e, 'idle'); } return; }
  e.aim0 = e.aim0 ?? e.aim;
  e.lookT = (e.lookT ?? rnd(1, 4)) - dt;
  if (e.lookT <= 0 && (e.sus || 0) < 0.3){ e.lookT = rnd(2.5, 5.5); e.aim = e.aim0 + rnd(-1.2, 1.2); faceToward(e, Math.cos(e.aim), Math.sin(e.aim)); }
  let best = 0, who = null;
  for (const a of G.units){
    if (a.side !== 'ally' || a.dead || a.downed) continue;
    const d = dist(a, e), cr = isCrouched(a), mv = a === G.player ? !!inputDir() : a.moving;
    let R = visR(e) * (cr ? 0.5 : 1) * Math.max(0.5, 1 - stealthOf(a) * 0.06) * (mv ? 1.15 : 0.85) * (typeof lightMul === 'function' ? lightMul(a.x, a.z) : 1);   // v1.1 어두우면 덜 보임 (prowl.js)
    const steps = a === G.player ? plRunning() && d < 4 : false;
    if (d > R && !steps) continue;
    const ang = Math.abs(angDiff(Math.atan2(a.z - e.z, a.x - e.x), e.aim)), see = sees(e, a);
    const inCone = ang < 1.15 && see && d <= R && !(typeof hiddenFrom === 'function' && hiddenFrom(a, e)), near = d < (cr ? 0.8 : 1.5);
    if (!inCone && !near && !steps) continue;
    const rate = (inCone ? (1 - d / R) * 2.4 + 0.45 : 0) + (near ? 1.2 : 0) + (steps ? 1.6 : 0);
    if (rate > best){ best = rate; who = a; }
  }
  if (who){
    e.sus = (e.sus || 0) + best * dt;
    if (e.sus > 0.25 && !e.susSaid){ e.susSaid = true; popText(e.x, e.y + bodyH(e) + 0.4, e.z, '?', 'alert', 0.9); }
    if (e.sus > 0.45){ e.aim = Math.atan2(who.z - e.z, who.x - e.x); faceToward(e, Math.cos(e.aim), Math.sin(e.aim)); }
    if (e.sus >= 1){ e.sus = 0; STL.stat.spotted++; alertGroup(e, who); popText(e.x, e.y + bodyH(e) + 0.5, e.z, '들켰다!', 'alert', 1); }
  } else { e.sus = Math.max(0, (e.sus || 0) - dt * 0.25); if (e.sus < 0.1) e.susSaid = false; }
  if (dist(e, e.home) > 0.4) navTo(e, e.home.x, e.home.z, e.spd * 0.6, dt, 0.3); else e.moving = false;
};
// 의심: 보던 놈만 (시체를 본 적)
function witness(v, by){
  for (const o of foes()) if (o !== v && !o.alert && dist(o, v) < 7 && sees(o, v) && Math.abs(angDiff(Math.atan2(v.z - o.z, v.x - o.x), o.aim)) < 1.2){ o.sus = Math.max(o.sus || 0, 0.75); o.susSaid = true; popText(o.x, o.y + bodyH(o) + 0.4, o.z, '?!', 'alert', 0.9); o.aim = Math.atan2(v.z - o.z, v.x - o.x); }
}
// 암살 · 기습 · 방어 · 치명 (피해 규칙)
const _hurtSt = hurt;
hurt = function(att, tgt, base, o = {}){
  if (!(typeof SQ !== 'undefined' && SQ.on) || !att || !tgt || tgt.dead) return _hurtSt(att, tgt, base, o);
  // 암살 / 기습: 들키지 않은 적
  if (att.side === 'ally' && tgt.side === 'enemy' && !tgt.alert && !tgt.D.boss && !o.dot && !o.assass){
    const back = Math.abs(angDiff(Math.atan2(att.z - tgt.z, att.x - tgt.x), tgt.aim ?? 0)) > 1.9;
    if (!o.ranged && back){
      const apt = stealthOf(att); let p = Math.min(1, 0.3 + apt * 0.14); if (tgt.D.heavy || (tgt.D.weight || 60) > 300) p /= 3;
      if (Math.random() < p){
        STL.stat.kills++; tgt.hp = 0; interrupt(tgt); kill(tgt, att);
        popText(tgt.x, tgt.y + bodyH(tgt) + 0.5, tgt.z, `암살 (${Math.round(p * 100)}%)`, 'crit', 1.2); spark(tgt.x, tgt.y + 1, tgt.z, 0x8a0a14, 16, 4);
        if (typeof clashLog === 'function') clashLog(`${att.D.name}이(가) 등 뒤에서 ${tgt.D.name}의 숨을 끊었다. 소리가 나지 않았다.`);
        witness(tgt, att); return tgt.max;
      }
      STL.stat.fails++; popText(tgt.x, tgt.y + bodyH(tgt) + 0.5, tgt.z, `암살 실패 (${Math.round(p * 100)}%)`, 'miss', 1);
      o = { ...o, crit: true, critMul: 2.5, assass: true };
    } else if (o.ranged && (o.fam === 'bow' || o.fam === 'spear')){ STL.stat.sneakShots++; base *= 2; popText(tgt.x, tgt.y + bodyH(tgt) + 0.5, tgt.z, '기습!', 'crit', 0.8); }
  }
  // 방어: 막는 동안 정면 90% 감소, 안 막으면 1.35배. 거구의 내려찍기는 막기를 깸
  if (att.side === 'enemy' && tgt.side === 'ally' && !o.dot){
    const s = o.from || att, front = Math.abs(angDiff(Math.atan2(s.z - tgt.z, s.x - tgt.x), tgt.aim ?? 0)) < 1.25;
    const guarding = (tgt.guard || tgt.guardStance) && front;
    if (guarding && att.D.heavy && !o.ranged){
      STL.stat.breaks++; tgt.guard = false; tgt.guardStance = false; tgt.reactT = 0;
      const dmg = _hurtSt(att, tgt, base * 0.5, { ...o, unblockable: true });
      if (!tgt.dead && !tgt.downed){ interrupt(tgt); tgt.st = 'hurt'; tgt.stT = 0.8; setPose(tgt, 'hurt'); }
      popText(tgt.x, tgt.y + bodyH(tgt) + 0.5, tgt.z, '막기가 깨짐!', 'hurt big', 1.1); camShake(0.25, 0.2); return dmg;
    }
    if (guarding && tgt.guard && tgt === G.player && !o.unblockable){ const m0 = tgt.guardMul; tgt.guardMul = 0.1; const r = _hurtSt(att, tgt, base, o); tgt.guardMul = m0; return r; }
    if (guarding && tgt.guardStance && o.ranged){ base *= 0.15; }
    if (!guarding && STL.lethal) base *= 1.35;
  }
  return _hurtSt(att, tgt, base, o);
};
// 궁수 · 주술사 · 날랜 놈: 쏘고 있는 우리 편부터
const _enemyThinkFo = enemyThink;
enemyThink = function(e, dt){
  if (typeof SQ !== 'undefined' && SQ.on && e.alert && !e.D.boss && (e.D.bow || e.kind === 'drillCaster' || TRAIT[e.kind] === 'dodger')){
    e.foT = (e.foT || 0) - dt;
    if (e.foT <= 0){ e.foT = 1.5; const sh = nearest(e, G.units.filter(a => a.side === 'ally' && !a.dead && !a.downed && a.sol && a.sol.mode === 'ranged' && a.sol.kit.main), 11); if (sh){ e.focusOn = sh; e._stFo = true; } else if (e._stFo){ e.focusOn = null; e._stFo = false; } }
  }
  return _enemyThinkFo(e, dt);
};
// 동료: 자기를 노린 예고 → 상단이면 숙임, 아니면 막기 자세
function allyReact(u, dt){
  if (u.reactT > G.t){ u.moving = false; if (u.reactBy && !u.reactBy.dead) setAim(u, u.reactBy.x, u.reactBy.z); setPose(u, u.posture === 'crouch' ? (u.S.poses.squat ? 'squat' : 'idle') : (u.S.poses.block ? 'block' : 'idle')); return true; }
  if (u.reactT){ u.reactT = 0; u.guardStance = false; if (u.posture === 'crouch' && !u.sneak) u.posture = 'stand'; }
  if (u.D.undying || u.ls || (u.p2 && u.kind === 'kariusAlly')) return false;   // 레베카는 자기 방식 · 불경자 카리우스는 막지 않음
  for (const d of G.decals){
    if (d.done || !d.hostile || d.dur - d.t > 0.55 || u.reactFor === d || !inShape(d, u)) continue;
    u.reactFor = d;
    const owner = G.units.find(e => e.decal === d), zone = owner && owner.atkZone;
    const apt = aptOf(u, 'melee'), p = (cantCrouch(u) ? 0.25 : 0.35) + apt * 0.11;
    if (Math.random() > p) return false;
    u.reactBy = owner; u.reactT = G.t + Math.max(0.35, d.dur - d.t + 0.25);
    if (zone === 'high' && !cantCrouch(u)){ u.posture = 'crouch'; STL.stat.ducks++; popText(u.x, u.y + bodyH(u) + 0.2, u.z, '숙임', 'aim', 0.5); }
    else { u.guardStance = true; STL.stat.guards++; }
    return true;
  }
  return false;
}
// '은밀히': 숙인 채 따라오고, 혼자 있는 적의 등 뒤로 돌아 암살
function sneakAct(u, dt, sq){
  u.sneak = true; const S = u.sol;
  if (foes().some(e => e.alert)){ sq.order = 'follow'; u.sneak = false; say(u, '들켰다!', 'soft', 1.2); sqHudRender(); return false; }
  const L = sqLeader(sq), list = foes().filter(e => !e.alert && !e.D.boss && (dist(e, u) < 24 || dist(e, L || u) < 18));
  const lone = list.filter(e => !list.some(o => o !== e && dist(o, e) < 3.2 && Math.abs(angDiff(Math.atan2(e.z - o.z, e.x - o.x), o.aim)) < 1.2));
  if (aptOf(u, 'stealth') < 2){ u.moving = false; setPose(u, u.S.poses.squat ? 'squat' : 'idle'); if (!S.waitSaid){ S.waitSaid = true; say(u, '…(소리가 나서 여기서 기다린다)', 'soft', 1.6); } return true; }   // 판금 · 거구는 따라가면 들킴: 자리에서 숙여 기다림
  S.waitSaid = false;
  const tg = S.sneakT && !S.sneakT.dead && !S.sneakT.alert ? S.sneakT : nearest(u, lone.length ? lone : list, 24);
  S.sneakT = tg;
  const slow = 0.55;
  if (!tg){ const sp = u.spd; u.spd = sp * slow; const r = sqFormMove(u, sq, dt); u.spd = sp; return r; }
  const back = (tg.aim ?? 0) + Math.PI, bx = tg.x + Math.cos(back) * 0.9, bz = tg.z + Math.sin(back) * 0.9;
  const behind = Math.abs(angDiff(Math.atan2(u.z - tg.z, u.x - tg.x), back)) < 0.8;
  u.moving = false;
  const facing = Math.abs(angDiff(Math.atan2(u.z - tg.z, u.x - tg.x), tg.aim ?? 0)) < 1.3 && dist(u, tg) < visR(tg) * 0.6;
  if (facing){   // 이쪽을 보고 있으면: 수상해하면 멈춰 기다리고, 아니면 시야 밖 둘레로 크게 돌아 등 쪽으로
    if ((tg.sus || 0) > 0.25){ setPose(u, u.S.poses.squat ? 'squat' : 'idle'); return true; }
    const a0 = Math.atan2(u.z - tg.z, u.x - tg.x), dir = angDiff(back, a0) >= 0 ? 1 : -1, a1 = a0 + dir * 0.7, rr = visR(tg) * 0.62;
    navTo(u, tg.x + Math.cos(a1) * rr, tg.z + Math.sin(a1) * rr, u.spd * slow, dt, 0.2); walkPose(u); return true;
  }
  if (!behind || dist(u, tg) > 1.25){
    // 앞을 지나지 않게: 옆으로 크게 돌아 등 쪽으로
    const side = (tg.aim ?? 0) + Math.PI * 0.6 * (u.uid % 2 ? 1 : -1), wx = tg.x + Math.cos(side) * 2.4, wz = tg.z + Math.sin(side) * 2.4;
    const goBack = Math.abs(angDiff(Math.atan2(u.z - tg.z, u.x - tg.x), tg.aim ?? 0)) < 1.6 && dist(u, tg) < 4;
    navTo(u, goBack ? wx : bx, goBack ? wz : bz, u.spd * slow, dt, 0.2); walkPose(u); return true;
  }
  setAim(u, tg.x, tg.z); S.stabCd = (S.stabCd || 0) - dt;
  if (S.stabCd <= 0){ S.stabCd = 1.5; u.leanT = 0.3; hurt(u, tg, u.atk * 1.2, { from: u }); SFX.whoosh && SFX.whoosh(); }
  return true;
}
const _solControlSt = solControl;
solControl = function(u, dt){
  if (!(typeof SQ !== 'undefined' && SQ.on) || !u.sol || u.kind === 'player' || u.downed || u.lock) return _solControlSt(u, dt);
  if (allyReact(u, dt)) return true;
  const sq = sqOf(u);
  if (sq && sq.order === 'sneak'){ const r = sneakAct(u, dt, sq); if (r !== false) return r; }
  else if (u.sneak){ u.sneak = false; }
  return _solControlSt(u, dt);
};
ORDERS.sneak = '은밀히';
// 숙인 그림이 없는 동료: 몸을 눌러 쭈그림
TICKS.push(() => {
  if (!(typeof SQ !== 'undefined' && SQ.on)) return;
  for (const u of G.units){
    if (u.side !== 'ally' || u.kind === 'player' || u.dead) continue;
    const want = (u.posture === 'crouch' || u.sneak) && !cantCrouch(u) && !u.downed;
    if (want && !u.S.poses.squat){ u.sit = true; u._sitSt = true; } else if (u._sitSt){ u.sit = false; u._sitSt = false; }
    if (u.sneak && !cantCrouch(u)) u.posture = 'crouch'; else if (!u.reactT && u.posture === 'crouch' && !u.sneak && u.kind !== 'player') u.posture = 'stand';
  }
});

// 시야 표시 (훈련장): 들키지 않은 적 앞에 보는 부채꼴 — 노랑 → 의심이 찰수록 주황 · 빨강
const STLV = { show: true };
TICKS.push(() => {
  const on = typeof SQ !== 'undefined' && SQ.on && STLV.show && G.mode === 'drill';   // 시야 부채꼴은 훈련장에서만
  for (const e of G.units){
    if (e.side !== 'enemy') continue;
    const want = on && !e.alert && !e.dead && !e.D.boss && !e.prowl && G.player && dist(e, G.player) < 18;
    if (!want){ if (e.cone) e.cone.visible = false; continue; }
    if (!e.cone){ e.cone = new THREE.Mesh(new THREE.CircleGeometry(1, 24, -1.15, 2.3), new THREE.MeshBasicMaterial({ color: 0xffe070, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide })); e.cone.rotation.x = -Math.PI / 2; e.cone.position.y = 0.04; e.group.add(e.cone); }
    const R = visR(e), k = Math.min(1, e.sus || 0);
    e.cone.visible = true; e.cone.scale.setScalar(R); e.cone.rotation.z = -(e.aim ?? 0);
    e.cone.material.color.setRGB(1, 0.88 - k * 0.6, 0.44 - k * 0.4); e.cone.material.opacity = 0.14 + k * 0.18;
  }
});
