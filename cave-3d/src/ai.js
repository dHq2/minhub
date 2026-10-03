/* ai.js v0.3 — 적: 맵에 서 있다가 들키면 덤빔 (벽 너머는 모름, 돌아서 쫓아옴, 멀어지면 제자리로). 동료: 지시를 따르고, 예고 장판은 피함 */
'use strict';
const allies = () => G.units.filter(u => u.side === 'ally' && !u.dead && !u.downed);
const foes = () => G.units.filter(u => u.side === 'enemy' && !u.dead);
function nearest(u, list, max = 99){ let b = null, bd = max; for (const o of list){ const d = dist(u, o); if (d < bd){ bd = d; b = o; } } return b; }
const sees = (a, b) => losClear(G.map, a.x, a.z, b.x, b.z);
// 들킴: 본 녀석 + 같은 무리 중 그 녀석이나 상대를 직접 볼 수 있는 녀석만 (벽 너머 무리는 모름)
function alertGroup(u, by){
  const mark = o => { if (o.alert) return; o.alert = true; o.seen = G.t; popText(o.x, o.y + o.S.tall * SPRITE_SCALE + 0.4, o.z, '!', 'alert', 0.8); };
  mark(u);
  for (const o of G.units) if (o.side === 'enemy' && !o.dead && o !== u && o.band === u.band && !o.alert){
    if (sees(o, u) && dist(o, u) < 9 || by && sees(o, by) && dist(o, by) < 10) mark(o);
  }
}
// 몸의 키 (앉기가 생기면 여기서 낮춤)
const bodyH = u => u.S.tall * SPRITE_SCALE * (u.posture === 'crouch' ? 0.6 : 1);
// 공중 · 높은 곳의 상대도 맞히게: 화살 · 총알이 상대 몸 가운데 높이로 날아감
function aimDy(x, y0, z, t, speed){ const d = Math.hypot(t.x - x, t.z - z), time = Math.max(0.05, d / speed); return ((t.y + (t.lift || 0) + (t.jy || 0) + bodyH(t) * 0.5) - y0) / time; }

// 한 번 휘두르기 · 찌르기 · 내려찍기: 예고 장판이 다 차는 순간 그 안의 상대가 맞음 (뛰어올라 있으면 바닥 공격은 피함)
function windup(u, shape, o, onHit, color = RED){
  u.st = 'windup';
  if (!u.S.poses.windup && !u.S.poses.attack) u.leanT = -0.16;
  u.decal = decal(shape, { ...o, color, hostile: u.side === 'enemy', dur: o.windup, onDone: d => {
    u.decal = null;
    if (u.dead || u.downed || u.st !== 'windup') return;
    const targets = G.units.filter(t => !t.dead && !t.downed && t.side !== u.side && t.side !== 'neutral' && !t.airborne && (t.jy || 0) < 0.45 && inShape(d, t));
    if (u.side === 'ally') for (const t of G.units) if (t.D.dummy && inShape(d, t)) targets.push(t);
    targets.forEach(t => onHit(t, d));
    if (!u.S.poses.attack){
      u.leanT = 0.2; moveBy(u, Math.cos(d.a ?? u.aim) * 0.35, Math.sin(d.a ?? u.aim) * 0.35);
      if (shape === 'sector') for (let k = -2; k <= 2; k++){ const a = (d.a ?? u.aim) + k * (o.arc || 1) / 5; spark(u.x + Math.cos(a) * (o.r || 1.2) * 0.8, u.y + 0.8, u.z + Math.sin(a) * (o.r || 1.2) * 0.8, color === BLUE ? 0x9fd0ff : 0xffb0a0, 2, 1.5, 0.16, 0.2); }
    }
    u.st = 'strike'; u.stT = 0.3; setPose(u, u.S.poses.attack ? 'attack' : 'idle');
    o.after && o.after(d, targets);
  } });
}
const meleeHit = (u, M) => (t) => hurt(u, t, u.atk * M.mul, { kb: M.kb, from: u, crit: Math.random() < 0.08 });

function enemyThink(u, dt){
  u.cd -= dt; u.leapCd = (u.leapCd || 0) - dt; u.tactCd = (u.tactCd ?? rnd(1, 3)) - dt;
  const D = u.D;
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  if (u.st === 'windup'){ return; }
  if (u.st === 'strike'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  if (u.st === 'leap'){ u.stT -= dt; const k = 1 - u.stT / u.leapDur; u.lift = Math.sin(Math.PI * Math.min(1, k)) * 1.2; moveBy(u, u.lvx * dt, u.lvz * dt); if (u.stT <= 0){ u.st = 'idle'; u.lift = 0; dust(u.x, u.z, 6); } return; }
  if (u.st === 'guardStance'){   // 거한: 방어 자세로 버팀 (앞에서 오는 것은 거의 안 들어감)
    u.stT -= dt; const t = G.player; if (t) setAim(u, t.x, t.z);
    if (u.stT <= 0 || (t && dist(u, t) < 2.1 && u.cd <= 0)){ u.st = 'idle'; u.guardStance = false; }
    return;
  }
  if (u.st === 'charge'){        // 거한: 들이받기 (일직선)
    u.stT -= dt; const sp = 9; moveBy(u, Math.cos(u.chA) * sp * dt, Math.sin(u.chA) * sp * dt); dust(u.x, u.z, 1);
    for (const t of allies()) if (!u.chHit.has(t) && Math.hypot(t.x - u.x, t.z - u.z) < u.r + t.r + 0.2 && (t.jy || 0) < 0.45){ u.chHit.add(t); hurt(u, t, u.atk * 0.8, { kb: 2.4, from: u, stun: 0.6 }); camShake(0.25, 0.2); }
    if (u.stT <= 0){ u.st = 'idle'; }
    return;
  }
  const team = allies();
  if (!u.alert){
    u.scanT = (u.scanT || 0) - dt;
    if (u.scanT <= 0){
      u.scanT = 0.25;
      const see = D.bow ? 9 : 5.5;
      const t = team.find(a => dist(a, u) < see && sees(u, a));
      if (t) alertGroup(u, t);
    }
    if (dist(u, u.home) > 0.4) navTo(u, u.home.x, u.home.z, u.spd * 0.8, dt, 0.3); else u.moving = false;
    return;
  }
  // 들킴: 대상 고르기 (보이는 쪽 우선, 가까운 쪽, 인주가 비슷하면 인주)
  const vis = team.filter(a => sees(u, a));
  let tgt = nearest(u, vis.length ? vis : team, 30);
  const pl = G.player && !G.player.downed ? G.player : null;
  if (pl && tgt && dist(u, pl) < dist(u, tgt) + 1.5 && (sees(u, pl) || !vis.length)) tgt = pl;
  if (!tgt){ u.alert = false; return; }
  if (dist(u, tgt) < 13 && (sees(u, tgt) || dist(u, tgt) < 6)) u.seen = G.t;
  if (G.t - (u.seen || 0) > 3 && dist(u, u.home) > 4){ u.alert = false; u.hp = u.max; popText(u.x, u.y + 2, u.z, '…', 'miss'); return; }   // 놓치면 돌아감
  const d = dist(u, tgt), ang = Math.atan2(tgt.z - u.z, tgt.x - u.x);
  u.moving = false;
  if (D.melee){
    const M = D.melee;
    if (d > M.range * 0.8 || !sees(u, tgt)) navTo(u, tgt.x, tgt.z, u.spd, dt, M.range * 0.7);
    else if (u.cd <= 0){ setAim(u, tgt.x, tgt.z); u.cd = M.cd; setPose(u, u.S.poses.windup ? 'windup' : 'idle'); windup(u, 'sector', { x: u.x, z: u.z, r: M.range, a: ang, arc: M.arc, windup: M.windup }, meleeHit(u, M)); }
    else setAim(u, tgt.x, tgt.z);
  } else if (D.line){
    const L = D.line;
    if (d > L.len * 0.85 || !sees(u, tgt)) navTo(u, tgt.x, tgt.z, u.spd, dt, L.len * 0.75);
    else if (u.cd <= 0){ setAim(u, tgt.x, tgt.z); u.cd = L.cd; windup(u, 'line', { x: u.x, z: u.z, len: L.len, w: L.w, a: ang, windup: L.windup }, meleeHit(u, L)); }
    else setAim(u, tgt.x, tgt.z);
  } else if (D.bow){
    const B = D.bow;
    if (d < 3 && u.leapCd <= 0){   // 붙으면 순식간에 뒤로 도약
      u.leapCd = 4.5; const n = norm(u.x - tgt.x, u.z - tgt.z);
      let best = null;
      for (const off of [0, 0.7, -0.7, 1.3, -1.3]){ const a = Math.atan2(n.z, n.x) + off, tx = u.x + Math.cos(a) * D.leap, tz = u.z + Math.sin(a) * D.leap; if (!solidAt(G.map, tx, tz)){ best = { x: tx, z: tz }; break; } }
      if (best){ u.st = 'leap'; u.leapDur = 0.45; u.stT = 0.45; u.lvx = (best.x - u.x) / 0.45; u.lvz = (best.z - u.z) / 0.45; dust(u.x, u.z, 8); popText(u.x, u.y + 2, u.z, '휙', 'miss', 0.5); return; }
    }
    const seeIt = sees(u, tgt);
    if (d > B.range || !seeIt) navTo(u, tgt.x, tgt.z, u.spd, dt, 2);
    else if (d < 4.5 && u.y < 0.3) steerTo(u, u.x - (tgt.x - u.x), u.z - (tgt.z - u.z), u.spd * 0.8, dt);
    if (u.cd <= 0 && d <= B.range && seeIt){
      setAim(u, tgt.x, tgt.z); u.cd = B.cd; setPose(u, 'aim');
      const len = Math.min(B.range + 1, d + 2.5);
      windup(u, 'line', { x: u.x, z: u.z, len, w: 0.22, a: ang, windup: B.windup, y: u.y }, () => {}, 0xff5040);
      u.decal.onDone = (dd) => {   // 레이저처럼: 장판이 다 차면 매우 빠른 화살 (그 사이 옆으로 비키면 빗나감)
        u.decal = null; if (u.dead) return;
        u.st = 'strike'; u.stT = 0.25;
        const y0 = u.y + 1.3;
        shoot({ x: u.x, y: y0, z: u.z, a: dd.a, speed: B.speed, range: B.range + 2, side: u.side, len: 0.8, tip: true, color: 0xd8c8a8, dy: aimDy(u.x, y0, u.z, tgt, B.speed), hitsAir: true,
          onHit: (p, t) => { const head = t.kind === 'player' && Math.random() < 0.2; hurt(u, t, u.atk, { from: { x: p.x - Math.cos(p.a), z: p.z - Math.sin(p.a) }, crit: head, critMul: 1.8, ranged: true }); if (head) popText(t.x, t.y + 2.2, t.z, '헤드샷', 'crit'); } });
      };
    }
  } else if (D.slam){
    // 곤봉 거한: 정직하게만 오지 않음. 거리 3~6에선 방어 자세로 기다리거나 · 들이받기로 견제, 붙으면 내려찍기, 가끔 옆으로 비킴
    const S = D.slam;
    if (u.tactCd <= 0 && d > 2.6 && d < 6.5 && sees(u, tgt)){
      u.tactCd = rnd(3.5, 5.5);
      const r = Math.random();
      if (r < 0.4){ u.st = 'guardStance'; u.guardStance = true; u.stT = rnd(1.6, 2.6); popText(u.x, u.y + 3.6, u.z, '방어 자세', 'miss', 0.9); return; }
      if (r < 0.8){
        setAim(u, tgt.x, tgt.z); const len = Math.min(7, d + 1.5);
        windup(u, 'line', { x: u.x, z: u.z, len, w: 1.3, a: ang, windup: 0.75 }, () => {});
        u.decal.onDone = (dd) => { u.decal = null; if (u.dead) return; u.st = 'charge'; u.stT = len / 9; u.chA = dd.a; u.chHit = new Set(); popText(u.x, u.y + 3.4, u.z, '쿵쿵쿵', 'alert', 0.6); };
        return;
      }
      u.sideT = 0.6; u.sideA = ang + (Math.random() < 0.5 ? 1.4 : -1.4);
    }
    if (u.sideT > 0){ u.sideT -= dt; steerTo(u, u.x + Math.cos(u.sideA), u.z + Math.sin(u.sideA), u.spd * 1.3, dt); setAim(u, tgt.x, tgt.z); return; }
    if (d > 2.2 || !sees(u, tgt)) navTo(u, tgt.x, tgt.z, u.spd, dt, 1.8);
    else if (u.cd <= 0){
      setAim(u, tgt.x, tgt.z); u.cd = S.cd; setPose(u, 'idle');
      const cx = u.x + Math.cos(ang) * 1.1, cz = u.z + Math.sin(ang) * 1.1;
      windup(u, 'circle', { x: cx, z: cz, r: S.r, windup: S.windup }, t => hurt(u, t, u.atk * S.mul, { kb: S.kb, from: { x: cx, z: cz }, stun: S.stun }), RED);
      const dd = u.decal; dd.onDone = ((orig) => (x) => { orig(x); camShake(0.35, 0.25); ring(cx, cz, 0xffb070, S.r * 1.2, 0.45); dust(cx, cz, 14); })(dd.onDone);
    }
  }
}

/* ---------- 동료 ---------- */
// 위험: 나를 덮은 적의 예고 장판이 곧 (0.65초 안에) 터지면, 장판 밖으로 피할 자리
function escapeSpot(u){
  for (const d of G.decals){
    if (d.done || !d.hostile || d.dur - d.t > 0.65 || !inShape(d, u)) continue;
    for (const L of [1.6, 2.4, 3.2]) for (let k = 0; k < 12; k++){
      const a = k / 12 * Math.PI * 2 + (u.uid % 3), x = u.x + Math.cos(a) * L, z = u.z + Math.sin(a) * L;
      if (solidAt(G.map, x, z) || !walkable(G.map, u.x, u.z, x, z)) continue;
      if (!G.decals.some(o => !o.done && o.hostile && inShape(o, { x, z, r: u.r }))) return { x, z };
    }
  }
  return null;
}
function allyThink(u, dt){
  if (u.downed || u.kind === 'player') return;
  u.cd -= dt; u.healCd = (u.healCd || 4) - dt;
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  // 피할 땐 피함 (휘두르는 중이 아니면)
  if (u.st !== 'windup'){
    u.dodgeCheck = (u.dodgeCheck || 0) - dt;
    if (u.dodgeCheck <= 0){ u.dodgeCheck = 0.1; u.escape = escapeSpot(u); if (u.escape && !u.saidDodge){ u.saidDodge = true; setTimeout(() => u.saidDodge = false, 3000); } }
    if (u.escape){
      if (Math.hypot(u.escape.x - u.x, u.escape.z - u.z) > 0.25){ steerTo(u, u.escape.x, u.escape.z, u.spd * 2.1, dt); u.st = 'idle'; return; }
      u.escape = null;
    }
  }
  if (u.st === 'windup'){ return; }
  if (u.burst && u.st === 'strike'){ u.stT -= dt; tickBurst(u, dt); if (!u.burst && u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  if (u.st === 'strike' || u.st === 'heal'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  u.moving = false;
  const pl = G.player;
  const enemiesNear = foes().filter(e => e.alert && dist(e, pl) < 14);
  // 노먼: 다친 동료 (60% 아래)가 있으면 응급처치
  if (u.D.medic && u.healCd <= 0){
    const hurtOne = allies().filter(a => a.hp < a.max * 0.6).sort((a, b) => a.hp / a.max - b.hp / b.max)[0];
    if (hurtOne){
      if (dist(u, hurtOne) > 1.4){ navTo(u, hurtOne.x, hurtOne.z, u.spd * 1.3, dt, 1.2); return; }
      u.st = 'heal'; u.stT = 1.1; setPose(u, 'heal'); u.healCd = 7;
      setTimeout(() => { if (!u.downed && !hurtOne.downed){ const h = Math.round(hurtOne.max * 0.3); hurtOne.hp = Math.min(hurtOne.max, hurtOne.hp + h); popText(hurtOne.x, hurtOne.y + 1.8, hurtOne.z, '+' + h, 'heal'); ring(hurtOne.x, hurtOne.z, 0x7dffa0, 1.2, 0.5); } }, 900);
      return;
    }
  }
  let tgt = null;
  if (G.cmd !== 'follow' && enemiesNear.length){
    tgt = G.cmd === 'focus' && G.focusTarget && !G.focusTarget.dead ? G.focusTarget : nearest(u, enemiesNear);
  }
  if (!tgt){
    // 따라감: 인주 뒤 자리 (앞서가면 호다닥, 가까우면 천천히 둘러봄). 길이 막혔으면 돌아서 감
    const i = allies().filter(a => a !== pl).indexOf(u), side = i % 2 ? 1 : -1;
    let bx = pl.x + side * (1.1 + i * 0.3) - Math.cos(pl.aim) * 0.9, bz = pl.z - Math.sin(pl.aim) * 0.9 + (i ? 0.4 : -0.2);
    if (solidAt(G.map, bx, bz) || !walkable(G.map, pl.x, pl.z, bx, bz)){ bx = pl.x - Math.cos(pl.aim) * 1.1; bz = pl.z - Math.sin(pl.aim) * 1.1; }
    if (solidAt(G.map, bx, bz)){ bx = pl.x; bz = pl.z; }
    const d = Math.hypot(bx - u.x, bz - u.z);
    if (d > 0.7) navTo(u, bx, bz, d > 4 ? u.spd * 1.7 : u.spd, dt, 0.5);
    else { u.lookT = (u.lookT || 0) - dt; if (u.lookT <= 0){ u.lookT = rnd(1.5, 3.5); u.face = -u.face; } }   // 두리번
    return;
  }
  const d = dist(u, tgt), ang = Math.atan2(tgt.z - u.z, tgt.x - u.x);
  if (u.D.melee){
    const M = u.D.melee;
    if (tgt.airborne){ navTo(u, tgt.x, tgt.z, u.spd, dt, 2.5); return; }   // 날고 있으면 밑에서 기다림
    if (d > M.range * 0.8 || !sees(u, tgt)) navTo(u, tgt.x, tgt.z, u.spd * 1.1, dt, M.range * 0.7);
    else if (u.cd <= 0){ setAim(u, tgt.x, tgt.z); u.cd = M.cd; windup(u, 'sector', { x: u.x, z: u.z, r: M.range, a: ang, arc: M.arc, windup: M.windup }, meleeHit(u, M), BLUE); }
  } else if (u.D.ranged){
    const R = u.D.ranged, see = sees(u, tgt);
    if (d > R.range || !see) navTo(u, tgt.x, tgt.z, u.spd, dt, 3);
    else if (d < 3.5) steerTo(u, u.x - (tgt.x - u.x), u.z - (tgt.z - u.z), u.spd, dt);
    // 점사 (2D판 그대로): 기본 2발, 10%는 손가락이 늦게 떨어져 6발 "드르르륵!" (0.09초 간격)
    if (u.burst){ tickBurst(u, dt); return; }
    if (u.cd <= 0 && d <= R.range && see){
      const n = Math.random() < 0.1 ? 6 : 2;
      u.cd = R.cd + (n === 6 ? 0.5 : 0); u.burst = { tgt, left: n, t: 0 };
      if (n === 6) popText(u.x, u.y + 2.2, u.z, '드르르륵!', 'big', 0.6);
      tickBurst(u, 0);
    }
  }
}
function tickBurst(u, dt){
  const bu = u.burst, t = bu.tgt;
  if (u.downed || u.st === 'hurt' || !t || t.dead || t.downed){ u.burst = null; return; }
  bu.t -= dt;
  while (bu.t <= 0 && bu.left > 0){ fireBullet(u, t); bu.left--; bu.t += 0.09; }
  if (bu.left <= 0) u.burst = null;
}
function fireBullet(u, tgt){
  const ang = Math.atan2(tgt.z - u.z, tgt.x - u.x);
  setAim(u, tgt.x, tgt.z); u.st = 'strike'; u.stT = 0.25; setPose(u, 'shoot');
  const y0 = u.y + 1.1, sp = 40;
  shoot({ x: u.x, y: y0, z: u.z, a: ang + rnd(-0.04, 0.04), speed: sp, range: u.D.ranged.range + 2, side: 'ally', len: 0.35, thick: 0.04, color: 0xffe08a, glow: 0xffc860, hitsAir: true, dy: aimDy(u.x, y0, u.z, tgt, sp),
    onHit: (p, t) => hurt(u, t, u.atk * 0.65, { from: u, hitsAir: true, ranged: true, crit: Math.random() < 0.1 }) });
  spark(u.x + Math.cos(ang) * 0.5, u.y + 1.1, u.z + Math.sin(ang) * 0.5, 0xffd080, 4, 2, 0.15, 0.12);
}
// 싸움이 끝나고 4초 조용하면 쓰러진 동료가 30%로 일어남
function reviveCheck(dt){
  const busy = foes().some(e => e.alert);
  G.calmT = busy ? 0 : (G.calmT || 0) + dt;
  if (G.calmT > 4) for (const u of G.units) if (u.side === 'ally' && u.downed && u.kind !== 'player'){ u.downed = false; u.hp = Math.round(u.max * 0.3); u.st = 'idle'; popText(u.x, u.y + 1.6, u.z, '일어남', 'heal'); }
}
