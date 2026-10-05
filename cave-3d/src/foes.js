/* foes.js v1.0 — 적마다 고유 기술 (평소 공격 위에 하나씩 얹음). 모두 붉은 예고 장판이 보이고, 읽으면 피할 수 있음
   검사: 돌진 베기 (줄) · 창병: 휩쓸기 (넓은 부채꼴) · 검방패병: 방패 밀치기 (휘청) + 방패벽 (둘이 붙으면 더 단단)
   궁수: 화살비 (원 셋) · 곤봉 거한 · 단달로: 붙잡기 (grapple.js) · 벤킨: 사슬 당기기
   녹색 젤리: 죽으면 둘로 갈라짐 · 꼬마악마: 인주를 치면 금화를 훔쳐 달아남 (잡으면 돌려받음) · 꼬마요정: 꽃가루 (둔화)
   슬라임: 산성 웅덩이 (중독) · 광신도: 저주의 말 (정신도 · 둔화), 동료 광신도가 죽으면 광분 */
'use strict';
const SIG = {
  swordsman: { cd: 6, fn: sigDash }, spearman: { cd: 5.5, fn: sigSweep }, shieldman: { cd: 5, fn: sigBash }, archer: { cd: 7, fn: sigRain },
  benkin: { cd: 6, fn: sigChain }, foeFairy: { cd: 6.5, fn: sigPollen }, foeSlime: { cd: 7, fn: sigAcid }, foeCultist: { cd: 7, fn: sigCurse },
};
const _enemyThinkSig = enemyThink;
enemyThink = function(u, dt){
  if (u.lock) return;
  if (u.alert && u.st === 'idle' && !G.lock){
    const tgt = nearest(u, allies(), 30);
    if (tgt){
      if (u.D.grab && enemyGrabTry(u, tgt, dt)) return;
      const S = SIG[u.kind];
      if (S){ u.sigCd = (u.sigCd ?? rnd(2, S.cd)) - dt; if (u.sigCd <= 0 && sees(u, tgt) && S.fn(u, tgt)){ u.sigCd = S.cd * rnd(0.85, 1.2); return; } }
    }
  }
  // 방패벽: 검방패병 둘이 붙어 서면 더 단단
  if (u.kind === 'shieldman'){ const buddy = foes().some(o => o !== u && o.kind === 'shieldman' && dist(o, u) < 1.8); u.wall = buddy; }
  return _enemyThinkSig(u, dt);
};
const sigSay = (u, t) => popText(u.x, u.y + bodyH(u) + 0.35, u.z, t, 'alert', 0.7);
function sigDash(u, tgt){
  const d = dist(u, tgt); if (d < 2.4 || d > 6) return false;
  const a = Math.atan2(tgt.z - u.z, tgt.x - u.x), len = Math.min(7, d + 1.2);
  setAim(u, tgt.x, tgt.z); sigSay(u, '돌진 베기');
  windup(u, 'line', { x: u.x, z: u.z, len, w: 0.9, a, windup: 0.6 }, () => {});
  u.decal.onDone = ((orig) => (dd) => {
    u.decal = null; if (u.dead || u.st !== 'windup') return;
    const hitS = new Set();
    for (let s = 0; s < len; s += 0.3){ const x = u.x + Math.cos(dd.a) * 0.3, z = u.z + Math.sin(dd.a) * 0.3; if (solidAt(G.map, x, z)) break; u.x = x; u.z = z; for (const t of allies()) if (!hitS.has(t) && dist(t, u) < t.r + 0.6 && (t.jy || 0) < 0.45){ hitS.add(t); hurt(u, t, u.atk * 1.3, { from: u, kb: 1.2 }); } }
    dust(u.x, u.z, 8); u.st = 'strike'; u.stT = 0.45; setPose(u, u.S.poses.attack ? 'attack' : 'idle');
  })(u.decal.onDone);
  return true;
}
function sigSweep(u, tgt){
  if (dist(u, tgt) > 2.7) return false;
  setAim(u, tgt.x, tgt.z); sigSay(u, '휩쓸기');
  windup(u, 'sector', { x: u.x, z: u.z, r: 2.8, a: u.aim, arc: 3.6, windup: 0.75 }, t => hurt(u, t, u.atk * 1.05, { from: u, kb: 1.6, stun: 0.35 }));
  return true;
}
function sigBash(u, tgt){
  if (dist(u, tgt) > 1.8) return false;
  setAim(u, tgt.x, tgt.z); sigSay(u, '방패 밀치기');
  const x = u.x + Math.cos(u.aim) * 0.9, z = u.z + Math.sin(u.aim) * 0.9;
  windup(u, 'circle', { x, z, r: 1.0, windup: 0.45 }, t => hurt(u, t, u.atk * 0.8, { from: u, kb: 2.4, stun: 0.9 }));
  return true;
}
function sigRain(u, tgt){
  const d = dist(u, tgt); if (d < 3.5 || d > 11) return false;
  setAim(u, tgt.x, tgt.z); sigSay(u, '화살비'); setPose(u, 'aim'); u.st = 'strike'; u.stT = 1.0;
  for (let i = 0; i < 3; i++){
    const x = tgt.x + (i ? rnd(-1.8, 1.8) : 0), z = tgt.z + (i ? rnd(-1.8, 1.8) : 0); if (solidAt(G.map, x, z)) continue;
    const dd = decal('circle', { x, z, r: 1.15, dur: 1.15, color: RED, hostile: true });
    dd.onDone = () => { for (const t of allies()) if (inShape(dd, t) && (t.jy || 0) < 0.45) hurt(u, t, u.atk * 0.9, { from: { x, z }, ranged: true }); for (let k = 0; k < 5; k++) groundArrowFoe(x + rnd(-0.8, 0.8), z + rnd(-0.8, 0.8)); spark(x, 0.4, z, 0xd8c8a8, 6, 3); };
  }
  return true;
}
// 적의 화살비도 바닥에 꽂힘 → 주울 수 있음 (화살 보급)
function groundArrowFoe(x, z){ if (typeof groundArrow === 'function' && Math.random() < 0.5) groundArrow(x, z, rnd(0, 6.28), false, false); }
function sigChain(u, tgt){
  const d = dist(u, tgt); if (d < 2.5 || d > 5.5) return false;
  const a = Math.atan2(tgt.z - u.z, tgt.x - u.x); setAim(u, tgt.x, tgt.z); sigSay(u, '사슬');
  windup(u, 'line', { x: u.x, z: u.z, len: 5.5, w: 0.5, a, windup: 0.6 }, t => { hurt(u, t, u.atk * 0.7, { from: u }); const n = norm(u.x - t.x, u.z - t.z), L = Math.max(0, dist(u, t) - 1.2); t.kx += n.x * L * 7; t.kz += n.z * L * 7; if (t.st !== 'held'){ t.st = 'hurt'; t.stT = 0.5; } popText(t.x, t.y + 1.8, t.z, '끌려감!', 'hurt', 0.8); });
  return true;
}
function sigPollen(u, tgt){
  if (dist(u, tgt) > 7) return false;
  sigSay(u, '꽃가루');
  const x = tgt.x, z = tgt.z, dd = decal('circle', { x, z, r: 1.6, dur: 0.9, color: 0xd8a0ff, hostile: true });
  dd.onDone = () => { for (const t of allies()) if (inShape(dd, t)) addStatus(t, 'slow', { k: 0.5, t: 3 }); spark(x, 0.6, z, 0xf0c8ff, 14, 2); };
  return true;
}
function sigAcid(u, tgt){
  if (dist(u, tgt) > 3) return false;
  sigSay(u, '부글');
  const x = u.x, z = u.z, pool = decal('circle', { x, z, r: 1.4, dur: 6, color: 0x7aff5a, hostile: false });
  pool.fill.material.opacity = 0.25;
  const tick = setInterval(() => { if (pool.done || G.mode !== 'exp'){ clearInterval(tick); return; } for (const t of allies()) if (inShape(pool, t) && (t.jy || 0) < 0.3) addStatus(t, 'poison', { dps: 4 + u.atk * 0.15, t: 2.5 }); }, 400);
  return true;
}
function sigCurse(u, tgt){
  const d = dist(u, tgt); if (d > 6) return false;
  const a = Math.atan2(tgt.z - u.z, tgt.x - u.x); setAim(u, tgt.x, tgt.z); sigSay(u, '…저주를');
  windup(u, 'line', { x: u.x, z: u.z, len: 6.5, w: 0.7, a, windup: 0.8 }, t => { hurt(u, t, u.atk * 0.6, { from: u, ranged: true }); addStatus(t, 'slow', { k: 0.4, t: 2.5 }); addStatus(t, 'confuse', { t: 2.5 }); if (t.hero){ t.hero.san = Math.max(0, (t.hero.san ?? 50) - 7); popText(t.x, t.y + 2, t.z, '정신도 -7', 'san', 0.9); } }, 0xb06aff);
  return true;
}
// 죽을 때: 젤리 분열 · 광신도 광분 · 꼬마악마가 훔친 금화
const _killFoes = kill;
kill = function(u, by){
  const r = _killFoes(u, by);
  if (u.side !== 'enemy' || !u.dead || G.mode !== 'exp') return r;
  if (u.kind === 'foeJelly' && !u.small){
    for (let i = 0; i < 2; i++){ const e = spawnFoe('foeJelly', u.x + rnd(-0.6, 0.6), u.z + rnd(-0.6, 0.6), EXP.F, u.band); e.small = true; e.max = e.hp = Math.round(u.max * 0.35); e.atk = Math.round(u.atk * 0.6); e.xp = 2; e.alert = true; e.seen = G.t; e.S = { ...e.S, tall: e.S.tall * 0.62 }; }
    popText(u.x, u.y + 1, u.z, '갈라진다!', 'alert', 0.8);
  }
  if (u.kind === 'foeCultist') for (const o of foes()) if (o.kind === 'foeCultist' && dist(o, u) < 7 && !o.frenzy){ o.frenzy = true; o.atk = Math.round(o.atk * 1.3); o.spd *= 1.25; o.baseSpd = o.spd; popText(o.x, o.y + bodyH(o) + 0.3, o.z, '광분!', 'alert', 0.9); o.mat.color.setRGB(1.3, 0.7, 0.7); }
  if (u.stolen){ dropLootAt(u.x, u.z, { gold: u.stolen }); popText(u.x, u.y + 1.5, u.z, '금화를 되찾았다', 'gold', 1); }
  return r;
};
// 꼬마악마: 인주를 치면 금화를 훔쳐 달아남
const _hurtThief = hurt;
hurt = function(att, tgt, base, o = {}){
  if (tgt && tgt.wall && !o.pierce && !o.dot && att){ const toA = Math.atan2(att.z - tgt.z, att.x - tgt.x); if (Math.abs(angDiff(toA, tgt.aim)) < 1.3) base *= 0.65; }   // 방패벽: 앞에서 오는 것 35% 더 막음
  const dmg = _hurtThief(att, tgt, base, o);
  if (dmg && att && att.kind === 'foeDevil' && tgt === G.player && !att.stolen && RPG.gold > 0 && G.mode === 'exp'){
    const g = Math.min(RPG.gold, 8 + Math.round(Math.random() * 12 * (EXP ? EXP.F : 1))); RPG.gold -= g; att.stolen = g;
    popText(att.x, att.y + 1.8, att.z, `금화 ${g} 훔침! 키킥`, 'alert', 1.2);
    att.home = { x: att.x + rnd(-8, 8), z: att.z + rnd(-8, 8) }; att.alert = false; att.spd *= 1.6; att.baseSpd = att.spd; att.fleeT = G.t;
  }
  return dmg;
};
