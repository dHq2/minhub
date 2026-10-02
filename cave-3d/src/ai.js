/* ai.js v0.1 — 적: 맵에 서 있다가 들키면 무리째 덤빔 (멀어지면 제자리로 돌아감). 동료: 지시 (따라와 · 집중 · 자유)를 따름 */
'use strict';
const allies = () => G.units.filter(u => u.side === 'ally' && !u.dead && !u.downed);
const foes = () => G.units.filter(u => u.side === 'enemy' && !u.dead);
function nearest(u, list, max = 99){ let b = null, bd = max; for (const o of list){ const d = dist(u, o); if (d < bd){ bd = d; b = o; } } return b; }
function alertGroup(u, by){
  for (const o of G.units) if (o.side === 'enemy' && !o.dead && o.band === u.band && !o.alert){
    o.alert = true; o.seen = G.t; popText(o.x, o.y + o.S.tall * SPRITE_SCALE + 0.4, o.z, '!', 'alert', 0.8);
  }
}
// 한 번 휘두르기 · 찌르기 · 내려찍기: 예고 장판이 다 차는 순간 그 안의 상대가 맞음
function windup(u, shape, o, onHit, color = RED){
  u.st = 'windup';
  u.decal = decal(shape, { ...o, color, dur: o.windup, onDone: d => {
    u.decal = null;
    if (u.dead || u.downed || u.st !== 'windup') return;
    const targets = G.units.filter(t => !t.dead && !t.downed && t.side !== u.side && t.side !== 'neutral' && !t.airborne && inShape(d, t));
    if (u.side === 'ally') for (const t of G.units) if (t.D.dummy && inShape(d, t)) targets.push(t);
    targets.forEach(t => onHit(t, d));
    u.st = 'strike'; u.stT = 0.3; setPose(u, u.S.poses.attack ? 'attack' : 'idle');
    o.after && o.after(d, targets);
  } });
}
const meleeHit = (u, M) => (t) => hurt(u, t, u.atk * M.mul, { kb: M.kb, from: u, crit: Math.random() < 0.08 });

function enemyThink(u, dt){
  u.cd -= dt; u.leapCd = (u.leapCd || 0) - dt;
  const D = u.D;
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  if (u.st === 'windup'){ return; }
  if (u.st === 'strike'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  if (u.st === 'leap'){ u.stT -= dt; const k = 1 - u.stT / u.leapDur; u.lift = Math.sin(Math.PI * Math.min(1, k)) * 1.2; moveBy(u, u.lvx * dt, u.lvz * dt); if (u.stT <= 0){ u.st = 'idle'; u.lift = 0; dust(u.x, u.z, 6); } return; }
  const team = allies();
  if (!u.alert){
    u.scanT = (u.scanT || 0) - dt;
    if (u.scanT <= 0){
      u.scanT = 0.25;
      const see = D.bow ? 9 : 5.5;
      const t = team.find(a => dist(a, u) < see && losClear(G.map, u.x, u.z, a.x, a.z));
      if (t) alertGroup(u, t);
    }
    // 제자리로
    if (dist(u, u.home) > 0.4) steerTo(u, u.home.x, u.home.z, u.spd * 0.8, dt, 0.3); else u.moving = false;
    return;
  }
  // 들킴: 대상 고르기 (가까운 쪽, 인주가 비슷하면 인주)
  let tgt = nearest(u, team, 30);
  const pl = G.player && !G.player.downed ? G.player : null;
  if (pl && tgt && dist(u, pl) < dist(u, tgt) + 1.5) tgt = pl;
  if (!tgt){ u.alert = false; return; }
  if (dist(u, tgt) < 13) u.seen = G.t;
  if (G.t - (u.seen || 0) > 3 && dist(u, u.home) > 6){ u.alert = false; u.hp = u.max; popText(u.x, u.y + 2, u.z, '…', 'miss'); return; }   // 멀어지면 돌아감
  const d = dist(u, tgt), ang = Math.atan2(tgt.z - u.z, tgt.x - u.x);
  u.moving = false;
  if (D.melee){
    const M = D.melee;
    if (d > M.range * 0.8) steerTo(u, tgt.x, tgt.z, u.spd, dt, M.range * 0.7);
    else if (u.cd <= 0){ setAim(u, tgt.x, tgt.z); u.cd = M.cd; setPose(u, u.S.poses.windup ? 'windup' : 'idle'); windup(u, 'sector', { x: u.x, z: u.z, r: M.range, a: ang, arc: M.arc, windup: M.windup }, meleeHit(u, M)); }
    else setAim(u, tgt.x, tgt.z);
  } else if (D.line){
    const L = D.line;
    if (d > L.len * 0.85) steerTo(u, tgt.x, tgt.z, u.spd, dt, L.len * 0.75);
    else if (u.cd <= 0){ setAim(u, tgt.x, tgt.z); u.cd = L.cd; windup(u, 'line', { x: u.x, z: u.z, len: L.len, w: L.w, a: ang, windup: L.windup }, meleeHit(u, L)); }
    else setAim(u, tgt.x, tgt.z);
  } else if (D.bow){
    const B = D.bow;
    // 붙으면 순식간에 뒤로 도약 (높은 곳 쪽을 우선)
    if (d < 3 && u.leapCd <= 0){
      u.leapCd = 4.5; const n = norm(u.x - tgt.x, u.z - tgt.z);
      let best = null;
      for (const off of [0, 0.7, -0.7, 1.3, -1.3]){ const a = Math.atan2(n.z, n.x) + off, tx = u.x + Math.cos(a) * D.leap, tz = u.z + Math.sin(a) * D.leap; if (!solidAt(G.map, tx, tz)){ best = { x: tx, z: tz }; break; } }
      if (best){ u.st = 'leap'; u.leapDur = 0.45; u.stT = 0.45; u.lvx = (best.x - u.x) / 0.45; u.lvz = (best.z - u.z) / 0.45; dust(u.x, u.z, 8); popText(u.x, u.y + 2, u.z, '휙', 'miss', 0.5); return; }
    }
    const seeIt = losClear(G.map, u.x, u.z, tgt.x, tgt.z);
    if (d > B.range || !seeIt) steerTo(u, tgt.x, tgt.z, u.spd, dt, 2);
    else if (d < 4.5 && u.y < 0.3) steerTo(u, u.x - (tgt.x - u.x), u.z - (tgt.z - u.z), u.spd * 0.8, dt);   // 거리 벌림 (높은 곳이면 버팀)
    if (u.cd <= 0 && d <= B.range && seeIt){
      setAim(u, tgt.x, tgt.z); u.cd = B.cd; setPose(u, 'aim');
      const len = Math.min(B.range + 1, d + 2.5);
      windup(u, 'line', { x: u.x, z: u.z, len, w: 0.22, a: ang, windup: B.windup, y: u.y }, () => {}, 0xff5040);
      u.decal.onDone = (dd) => {   // 레이저처럼: 장판이 다 차면 매우 빠른 화살 (그 사이 옆으로 비키면 빗나감)
        u.decal = null; if (u.dead) return;
        u.st = 'strike'; u.stT = 0.25;
        shoot({ x: u.x, y: u.y + 1.3, z: u.z, a: dd.a, speed: B.speed, range: B.range + 2, side: u.side, len: 0.8, tip: true, color: 0xd8c8a8,
          onHit: (p, t) => { const head = t.kind === 'player' && Math.random() < 0.2; hurt(u, t, u.atk, { from: { x: p.x - Math.cos(p.a), z: p.z - Math.sin(p.a) }, crit: head, critMul: 1.8 }); if (head) popText(t.x, t.y + 2.2, t.z, '헤드샷', 'crit'); } });
      };
    }
  } else if (D.slam){
    const S = D.slam;
    if (d > 2.2) steerTo(u, tgt.x, tgt.z, u.spd, dt, 1.8);
    else if (u.cd <= 0){
      setAim(u, tgt.x, tgt.z); u.cd = S.cd; setPose(u, 'idle');
      const cx = u.x + Math.cos(ang) * 1.1, cz = u.z + Math.sin(ang) * 1.1;
      windup(u, 'circle', { x: cx, z: cz, r: S.r, windup: S.windup }, t => hurt(u, t, u.atk * S.mul, { kb: S.kb, from: { x: cx, z: cz }, stun: S.stun }), RED);
      const dd = u.decal; dd.onDone = ((orig) => (x) => { orig(x); camShake(0.35, 0.25); ring(cx, cz, 0xffb070, S.r * 1.2, 0.45); dust(cx, cz, 14); })(dd.onDone);
    }
  }
}

/* ---------- 동료 ---------- */
function allyThink(u, dt){
  if (u.downed || u.kind === 'player') return;
  u.cd -= dt; u.healCd = (u.healCd || 4) - dt;
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  if (u.st === 'windup'){ return; }
  if (u.st === 'strike' || u.st === 'heal'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  u.moving = false;
  const pl = G.player;
  const enemiesNear = foes().filter(e => e.alert && dist(e, pl) < 14);
  // 노먼: 다친 동료 (60% 아래)가 있으면 응급처치
  if (u.D.medic && u.healCd <= 0){
    const hurtOne = allies().filter(a => a.hp < a.max * 0.6).sort((a, b) => a.hp / a.max - b.hp / b.max)[0];
    if (hurtOne){
      if (dist(u, hurtOne) > 1.4){ steerTo(u, hurtOne.x, hurtOne.z, u.spd * 1.3, dt, 1.2); return; }
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
    // 따라감: 인주 뒤 자리 (앞서가면 호다닥, 가까우면 천천히 둘러봄)
    const i = allies().filter(a => a !== pl).indexOf(u), side = i % 2 ? 1 : -1;
    const bx = pl.x + side * (1.1 + i * 0.3) - Math.cos(pl.aim) * 0.9, bz = pl.z + 1.2 + i * 0.4 - Math.sin(pl.aim) * 0.6;
    const d = Math.hypot(bx - u.x, bz - u.z);
    if (d > 0.6) steerTo(u, bx, bz, d > 4 ? u.spd * 1.7 : u.spd, dt, 0.4);
    else { u.lookT = (u.lookT || 0) - dt; if (u.lookT <= 0){ u.lookT = rnd(1.5, 3.5); u.face = -u.face; } }   // 두리번
    return;
  }
  const d = dist(u, tgt), ang = Math.atan2(tgt.z - u.z, tgt.x - u.x);
  if (u.D.melee){
    const M = u.D.melee;
    if (d > M.range * 0.8) steerTo(u, tgt.x, tgt.z, u.spd * 1.1, dt, M.range * 0.7);
    else if (u.cd <= 0){ setAim(u, tgt.x, tgt.z); u.cd = M.cd; windup(u, 'sector', { x: u.x, z: u.z, r: M.range, a: ang, arc: M.arc, windup: M.windup }, meleeHit(u, M), BLUE); }
  } else if (u.D.ranged){
    const R = u.D.ranged, see = losClear(G.map, u.x, u.z, tgt.x, tgt.z);
    if (d > R.range || !see) steerTo(u, tgt.x, tgt.z, u.spd, dt, 3);
    else if (d < 3.5) steerTo(u, u.x - (tgt.x - u.x), u.z - (tgt.z - u.z), u.spd, dt);
    if (u.cd <= 0 && d <= R.range && see){
      setAim(u, tgt.x, tgt.z); u.cd = R.cd; u.st = 'strike'; u.stT = 0.3; setPose(u, 'shoot');
      shoot({ x: u.x, y: u.y + 1.1, z: u.z, a: ang + rnd(-0.03, 0.03), speed: 40, range: R.range + 2, side: 'ally', len: 0.3, thick: 0.035, color: 0xffe08a, hitsAir: true,
        onHit: (p, t) => hurt(u, t, u.atk, { from: u, hitsAir: true, crit: Math.random() < 0.1 }) });
      spark(u.x + Math.cos(ang) * 0.5, u.y + 1.1, u.z + Math.sin(ang) * 0.5, 0xffd080, 4, 2, 0.15, 0.15);
    }
  }
}
// 싸움이 끝나고 4초 조용하면 쓰러진 동료가 30%로 일어남
function reviveCheck(dt){
  const busy = foes().some(e => e.alert);
  G.calmT = busy ? 0 : (G.calmT || 0) + dt;
  if (G.calmT > 4) for (const u of G.units) if (u.side === 'ally' && u.downed && u.kind !== 'player'){ u.downed = false; u.hp = Math.round(u.max * 0.3); u.st = 'idle'; popText(u.x, u.y + 1.6, u.z, '일어남', 'heal'); }
}
