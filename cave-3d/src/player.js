/* player.js v0.1 — 인주 직접 조작
   WASD 이동 · Shift 달리기 · 좌클릭/J 찌르기 (3연격) · Space 구르기 (무적 0.3초)
   우클릭/K 누르고 있기 → 놓으면 투창. 적 위에서 누르면 그 적을 정조준 (핀포인트), 아니면 마우스 쪽 · 마우스를 안 쓰면 앞의 가까운 적 (자동 조준)
   완벽: 게이지가 다 차기 직전 0.065초 (전체 1.25초의 약 5%) 안에 놓기. 다 차면 그냥 던져짐 (완벽 아님) */
'use strict';
const THROW = { full: 1.25, perfect: 0.065, speed: 26, range: 13 };
const P = { spear: true, spearObj: null, combo: 0, comboT: 0, atkCd: 0, dodgeCd: 0, charge: 0, aiming: false, lockT: null, ghostT: 0 };

function aimPoint(u){
  if (mouse.inside && G.t - mouse.moved < 4){ const g = screenToGround(mouse.x, mouse.y, UI.W, UI.H, u.y); if (g) return g; }
  return null;
}
function mouseOverEnemy(){
  if (!mouse.inside) return null;
  let best = null, bd = 46;
  for (const e of G.units){
    if (e.side !== 'enemy' || e.dead) continue;
    const p = toScreen(e.x, e.y + e.S.tall * SPRITE_SCALE * 0.5 + e.lift, e.z, UI.W, UI.H), d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    if (d < bd){ bd = d; best = e; }
  }
  return best;
}
function playerUpdate(u, dt){
  P.atkCd -= dt; P.dodgeCd -= dt; P.comboT -= dt; u.inv = Math.max(0, u.inv - dt);
  mouse.over = mouseOverEnemy();
  document.body.style.cursor = mouse.over ? 'crosshair' : 'default';
  if (u.downed) return;
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; } setPose(u, 'hurt'); return; }
  // 이동 입력 (화면 기준: 위 = 북쪽 = -z)
  let mx = 0, mz = 0;
  if (!G.lock){
    if (down('KeyW') || down('ArrowUp')) mz -= 1; if (down('KeyS') || down('ArrowDown')) mz += 1;
    if (down('KeyA') || down('ArrowLeft')) mx -= 1; if (down('KeyD') || down('ArrowRight')) mx += 1;
  }
  const mv = mx || mz ? norm(mx, mz) : null;
  // 구르기
  if (u.st === 'dodge'){
    u.stT -= dt; moveBy(u, u.dvx * dt, u.dvz * dt);
    P.ghostT -= dt; if (P.ghostT <= 0){ P.ghostT = 0.04; ghost(u); }
    if (u.stT <= 0){ u.st = 'idle'; }
    setPose(u, 'run'); return;
  }
  if (!G.lock && hit('Space') && P.dodgeCd <= 0 && u.st !== 'strike'){
    const dir = mv || { x: -Math.cos(u.aim), z: -Math.sin(u.aim) };
    u.st = 'dodge'; u.stT = 0.24; u.inv = 0.32; u.dvx = dir.x * 11; u.dvz = dir.z * 11; P.dodgeCd = 0.75;
    P.aiming = false; P.charge = 0; interrupt(u); dust(u.x, u.z, 6);
    return;
  }
  // 찌르기
  if (u.st === 'windup'){ return; }
  if (u.st === 'strike'){ u.stT -= dt; if (mv) moveBy(u, mv.x * 0.8 * dt, mv.z * 0.8 * dt); if (u.stT <= 0) u.st = 'idle'; return; }
  const wantAtk = !G.lock && (hit('Mouse0') || hit('KeyJ'));
  if (wantAtk && P.atkCd <= 0 && !P.aiming){
    const ap = aimPoint(u), tgt = mouse.over || (!ap && nearest(u, foes().filter(e => Math.abs(angDiff(Math.atan2(e.z - u.z, e.x - u.x), u.aim)) < 1.2), 3));
    if (tgt) setAim(u, tgt.x, tgt.z); else if (ap) setAim(u, ap.x, ap.z); else if (mv) setAim(u, u.x + mv.x, u.z + mv.z);
    if (tgt && G.cmd === 'focus') G.focusTarget = tgt;
    P.combo = P.comboT > 0 ? (P.combo + 1) % 3 : 0; P.comboT = 0.75;
    const third = P.combo === 2, armed = P.spear;
    const M = armed ? { r: third ? 2.2 : 1.9, arc: third ? 1.2 : 1.6, mul: third ? 1.6 : 1, kb: third ? 1.4 : 0.5, wind: third ? 0.2 : 0.11 } : { r: 1.25, arc: 1.4, mul: 0.55, kb: 0.8, wind: 0.12 };
    setPose(u, 'windup'); P.atkCd = third ? 0.55 : 0.32;
    windup(u, 'sector', { x: u.x, z: u.z, r: M.r, a: u.aim, arc: M.arc, windup: M.wind, follow: u }, (t) => {
      const crit = Math.random() < 0.1;
      hurt(u, t, u.atk * M.mul, { kb: M.kb, from: u, crit, stun: third && !t.D.heavy ? 0.35 : 0 });
      if (t.side === 'enemy' && G.cmd === 'focus') G.focusTarget = t;
    }, armed ? GOLD : 0xb0a090);
    u.decal.onDone = ((orig) => (d) => { d.a = u.aim; d.x = u.x; d.z = u.z; orig(d); u.stT = third ? 0.28 : 0.16; setPose(u, armed ? 'attack' : 'throw'); spark(u.x + Math.cos(u.aim) * 1.3, u.y + 0.9, u.z + Math.sin(u.aim) * 1.3, 0xffe2a0, 3, 2, 0.14, 0.12); })(u.decal.onDone);
    return;
  }
  // 투창: 누르고 있기
  const holding = !G.lock && (mouse.right || down('KeyK'));
  if (!P.aiming && P.spear && (hit('Mouse2') || hit('KeyK'))){ P.aiming = true; P.charge = 0; P.lockT = mouse.over; if (P.lockT) popText(P.lockT.x, P.lockT.y + P.lockT.S.tall * SPRITE_SCALE + 0.6, P.lockT.z, '조준', 'aim', 0.6); }
  if (!P.spear && (hit('Mouse2') || hit('KeyK'))) popText(u.x, u.y + 2, u.z, '창이 없음 — 주워야 함', 'miss', 0.9);
  if (P.aiming){
    P.charge = Math.min(THROW.full, P.charge + dt);
    const tp = throwTarget(u); if (tp) setAim(u, tp.x, tp.z);
    setPose(u, 'aim');
    if (mv) moveBy(u, mv.x * u.spd * 0.45 * dt, mv.z * u.spd * 0.45 * dt);
    const full = P.charge >= THROW.full;
    if (!holding || full){
      const perfect = !full && P.charge >= THROW.full - THROW.perfect;
      if (P.charge < 0.25 && !full){ P.aiming = false; P.charge = 0; return; }
      throwSpear(u, P.charge / THROW.full, perfect);
      P.aiming = false; P.charge = 0;
    }
    return;
  }
  // 걷기 · 달리기 (벽에 막혀도 달리는 모습은 그대로)
  if (mv){
    const run = down('ShiftLeft') || down('ShiftRight'), sp = u.spd * (run ? 1.55 : 1);
    moveBy(u, mv.x * sp * dt, mv.z * sp * dt);
    u.aim = Math.atan2(mv.z, mv.x); faceToward(u, mv.x, mv.z);
    setPose(u, run ? 'run' : 'walk');
  } else setPose(u, 'idle');
  // 창 줍기
  if (!P.spear && P.spearObj && Math.hypot(P.spearObj.x - u.x, P.spearObj.z - u.z) < 0.9){
    G.scene.remove(P.spearObj.m); P.spearObj = null; P.spear = true; popText(u.x, u.y + 2, u.z, '창을 주움', 'heal', 0.7);
  }
}
function throwTarget(u){
  if (P.lockT && !P.lockT.dead) return P.lockT;
  const ap = aimPoint(u); if (ap) return ap;
  return nearest(u, foes().filter(e => Math.abs(angDiff(Math.atan2(e.z - u.z, e.x - u.x), u.aim)) < 1.1 && losClear(G.map, u.x, u.z, e.x, e.z)), THROW.range);
}
function throwSpear(u, k, perfect){
  const tp = throwTarget(u), a = tp ? Math.atan2(tp.z - u.z, tp.x - u.x) : u.aim;
  setAim(u, u.x + Math.cos(a), u.z + Math.sin(a));
  setPose(u, 'throw'); u.st = 'strike'; u.stT = 0.3;
  P.spear = false;
  const dmg = u.atk * (1.2 + 1.6 * k);
  if (perfect){ popText(u.x, u.y + 2.2, u.z, '완벽!', 'crit', 1); ring(u.x, u.z, 0xffd35a, 2.2, 0.4); G.hitstop = 0.08; }
  else if (k >= 1) popText(u.x, u.y + 2.1, u.z, '힘껏', 'big', 0.7);
  spark(u.x + Math.cos(a) * 0.6, u.y + 1.3, u.z + Math.sin(a) * 0.6, perfect ? 0xffd35a : 0xfff0d0, perfect ? 14 : 6, 4);
  camZoomPulse(perfect ? 0.8 : 0.3);
  let first = true;
  shoot({ x: u.x, y: u.y + 1.25, z: u.z, a, speed: THROW.speed * (0.8 + 0.4 * k), range: THROW.range, side: 'ally', len: 1.5, thick: 0.035, tip: true, color: perfect ? 0xffe6a0 : 0xc8b8a0,
    glow: perfect ? 0xffc040 : null, pierce: perfect, hitsAir: true,
    onHit: (p, t) => {
      hurt(u, t, dmg, { hitsAir: true, from: { x: p.x - Math.cos(a), z: p.z - Math.sin(a) }, crit: perfect, critMul: 2.5, pierce: perfect, kb: 1.2 * k, stun: perfect ? 0.6 : 0 });
      if (perfect && first){ camCrit(t.x, t.z, t.y + 0.4, 0.38); first = false; }
      if (!perfect){ p.stuckIn = t; }
      if (G.cmd === 'focus') G.focusTarget = t;
    },
    end: (p, x, z, wall, t) => dropSpear(t ? t.x + rnd(-0.6, 0.6) : x - Math.cos(a) * (wall ? 0.4 : 0), t ? t.z + rnd(0.3, 0.9) : z - Math.sin(a) * (wall ? 0.4 : 0), a) });
}
function dropSpear(x, z, a){
  const geo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6), m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xc8b8a0 }));
  const y = heightAt(G.map, x, z);
  m.position.set(x, y + 0.5, z); m.rotation.z = (Math.cos(a) > 0 ? -1 : 1) * 0.6; m.rotation.y = rnd(-0.3, 0.3); G.scene.add(m);
  const glow = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.32, 24), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
  glow.rotation.x = -Math.PI / 2; glow.position.set(x, y + 0.03, z); G.scene.add(glow);
  m.add(new THREE.Object3D());
  P.spearObj = { x, z, m: new THREE.Group() }; P.spearObj.m.add(m); P.spearObj.m.add(glow); G.scene.add(P.spearObj.m);
}
// 잔상 (구르기)
function ghost(u){
  const m = u.mesh.clone(); m.material = u.mat.clone(); m.material.transparent = true; m.material.opacity = 0.5; m.material.color.setRGB(0.6, 0.8, 1.2);
  const g = new THREE.Group(); g.position.copy(u.group.position); const pv = u.pivot.clone(false); pv.add(m); pv.rotation.copy(u.pivot.rotation); g.add(pv); G.scene.add(g);
  G.fx.push({ s: { position: { x: 0, y: 0, z: 0 }, material: m.material, scale: { setScalar(){} } }, g, t: 0, life: 0.25, ghost: true, vx: 0, vy: 0, vz: 0 });
}
// 투창 게이지: 발밑 금색 고리 (완벽 구간에서 하얗게 번쩍)
let chargeRing = null;
function updateChargeRing(u){
  if (!chargeRing){
    chargeRing = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.68, 48, 1, 0, Math.PI * 2), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
    chargeRing.rotation.x = -Math.PI / 2; G.scene.add(chargeRing);
  }
  chargeRing.visible = P.aiming;
  if (!P.aiming) return;
  const k = P.charge / THROW.full, inWin = P.charge >= THROW.full - THROW.perfect;
  chargeRing.geometry.dispose();
  chargeRing.geometry = new THREE.RingGeometry(0.55, inWin ? 0.85 : 0.68, 48, 1, Math.PI / 2, Math.PI * 2 * k);
  chargeRing.material.color.setHex(inWin ? 0xffffff : 0xffd35a);
  chargeRing.position.set(u.x, u.y + 0.04, u.z);
}
