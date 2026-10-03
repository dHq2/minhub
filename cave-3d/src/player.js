/* player.js v0.3 — 인주 직접 조작
   WASD 이동 (카메라 기준) · Shift 달리기 · Space 점프 (바닥 공격을 넘음 · 바위를 넘음 · 높은 곳에 오름)
   좌클릭/J 찌르기 (3연격, 3타째는 강공) · Q 구르기 (무적 0.3초) · F 누르고 있기 = 방어 (앞에서 오는 것 70% 줄임, 맞기 직전 0.2초 안에 올리면 튕겨냄)
   우클릭/K 누르고 있기 → 놓으면 투창. 적 위에서 누르면 그 적을 정조준 (핀포인트), 아니면 마우스 쪽 · 마우스를 안 쓰면 앞의 가까운 적
   완벽: 게이지가 다 차기 직전 0.065초 (약 5%) 안에 놓기. 다 차면 그냥 던져짐 (완벽 아님)
   앉기: 자세 (u.posture = 'stand' | 'crouch')만 마련해 둠. 몸 키 (bodyH)가 자세를 따름 → 나중에 Ctrl로 붙이면 됨 */
'use strict';
const THROW = { full: 1.25, perfect: 0.065, speed: 26, range: 13 };
const P = { spear: true, spearObj: null, combo: 0, comboT: 0, atkCd: 0, dodgeCd: 0, charge: 0, aiming: false, lockT: null, ghostT: 0 };
const JUMP = { v: 5.8, g: 16 };

function aimPoint(u){
  if (mouse.inside && G.t - mouse.moved < 4){ const g = screenToGround(mouse.x, mouse.y, UI.W, UI.H, u.y); if (g) return g; }
  return null;
}
function mouseOverEnemy(){
  if (!mouse.inside) return null;
  let best = null, bd = 46;
  for (const e of G.units){
    if (e.side !== 'enemy' || e.dead) continue;
    const p = toScreen(e.x, e.y + bodyH(e) * 0.5 + e.lift, e.z, UI.W, UI.H), d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    if (d < bd){ bd = d; best = e; }
  }
  return best;
}
// 점프 · 낙하 (모든 인물 공통: jy = 땅에서 뜬 높이)
function updateJump(u, dt){
  if (!u.jv && !u.jy) return;
  u.jv -= JUMP.g * dt; u.jy = Math.max(0, (u.jy || 0) + u.jv * dt);
  if (u.jy <= 0 && u.jv < 0){ u.jy = 0; u.jv = 0; dust(u.x, u.z, 4); }
}
// 화면 기준 입력 → 세계 방향 (카메라가 돌아도 W는 늘 화면 위)
function inputDir(){
  let ix = 0, iy = 0;
  if (down('KeyW') || down('ArrowUp')) iy += 1; if (down('KeyS') || down('ArrowDown')) iy -= 1;
  if (down('KeyA') || down('ArrowLeft')) ix -= 1; if (down('KeyD') || down('ArrowRight')) ix += 1;
  if (!ix && !iy) return null;
  const y = CAM.yaw || 0, fx = -Math.sin(y), fz = -Math.cos(y), rx = Math.cos(y), rz = -Math.sin(y);
  return norm(rx * ix + fx * iy, rz * ix + fz * iy);
}
function playerUpdate(u, dt){
  P.atkCd -= dt; P.dodgeCd -= dt; P.comboT -= dt; u.inv = Math.max(0, u.inv - dt);
  u.posture = u.posture || 'stand';
  mouse.over = mouseOverEnemy();
  document.body.style.cursor = mouse.over ? 'crosshair' : 'default';
  updateJump(u, dt);
  if (u.downed){ u.guard = false; return; }
  if (u.st === 'hurt'){ u.stT -= dt; u.guard = false; if (u.stT <= 0){ u.st = 'idle'; } setPose(u, 'hurt'); return; }
  const mv = G.lock ? null : inputDir();
  // 구르기
  if (u.st === 'dodge'){
    u.stT -= dt; moveBy(u, u.dvx * dt, u.dvz * dt);
    P.ghostT -= dt; if (P.ghostT <= 0){ P.ghostT = 0.04; ghost(u); }
    if (u.stT <= 0){ u.st = 'idle'; }
    setPose(u, 'run'); return;
  }
  if (!G.lock && hit('KeyQ') && P.dodgeCd <= 0 && u.st !== 'strike'){
    const dir = mv || { x: -Math.cos(u.aim), z: -Math.sin(u.aim) };
    u.st = 'dodge'; u.stT = 0.24; u.inv = 0.32; u.dvx = dir.x * 11; u.dvz = dir.z * 11; P.dodgeCd = 0.75; u.guard = false;
    P.aiming = false; P.charge = 0; interrupt(u); dust(u.x, u.z, 6);
    return;
  }
  // 점프
  if (!G.lock && hit('Space') && !u.jy && u.st !== 'windup'){ u.jv = JUMP.v; u.jy = 0.01; dust(u.x, u.z, 4); }
  // 방어 (누르고 있는 동안)
  const guarding = !G.lock && down('KeyF') && u.st !== 'windup' && u.st !== 'strike' && !P.aiming;
  if (guarding && !u.guard) u.guardAt = G.t;
  u.guard = guarding;
  if (u.guard){
    const ap = aimPoint(u), t = mouse.over || nearest(u, foes().filter(e => e.alert), 6);
    if (t) setAim(u, t.x, t.z); else if (ap) setAim(u, ap.x, ap.z);
    if (mv) moveBy(u, mv.x * u.spd * 0.4 * dt, mv.z * u.spd * 0.4 * dt);
    setPose(u, 'windup');
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
      hurt(u, t, u.atk * M.mul, { kb: M.kb, from: u, crit, strong: third && armed, stun: third && !t.D.heavy ? 0.35 : 0, hitsAir: u.jy > 0.6 });
      if (t.side === 'enemy' && G.cmd === 'focus') G.focusTarget = t;
    }, armed ? GOLD : 0xb0a090);
    u.decal.onDone = ((orig) => (d) => { d.a = u.aim; d.x = u.x; d.z = u.z; orig(d); u.stT = third ? 0.28 : 0.16; setPose(u, armed ? 'attack' : 'throw'); spark(u.x + Math.cos(u.aim) * 1.3, u.y + 0.9, u.z + Math.sin(u.aim) * 1.3, 0xffe2a0, 3, 2, 0.14, 0.12); })(u.decal.onDone);
    return;
  }
  // 투창: 누르고 있기
  const holding = !G.lock && (mouse.right || down('KeyK'));
  if (!P.aiming && P.spear && (hit('Mouse2') || hit('KeyK'))){ P.aiming = true; P.charge = 0; P.lockT = mouse.over; if (P.lockT) popText(P.lockT.x, P.lockT.y + bodyH(P.lockT) + 0.6 + P.lockT.lift, P.lockT.z, '조준', 'aim', 0.6); }
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
  // 걷기 · 달리기 (벽에 막혀도 미끄러지며 계속 감)
  if (mv){
    const run = down('ShiftLeft') || down('ShiftRight'), sp = u.spd * (run ? 1.55 : 1);
    moveBy(u, mv.x * sp * dt, mv.z * sp * dt);
    u.aim = Math.atan2(mv.z, mv.x); faceToward(u, mv.x, mv.z);
    setPose(u, u.jy ? 'run' : run ? 'run' : 'walk');
  } else setPose(u, u.jy ? 'run' : 'idle');
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
  const dmg = u.atk * (1.2 + 1.6 * k), speed = THROW.speed * (0.8 + 0.4 * k), y0 = u.y + (u.jy || 0) + 1.25;
  if (perfect){ popText(u.x, u.y + 2.2, u.z, '완벽!', 'crit', 1); ring(u.x, u.z, 0x5ab4ff, 2.2, 0.4); G.hitstop = 0.08; }
  else if (k >= 1) popText(u.x, u.y + 2.1, u.z, '힘껏', 'big', 0.7);
  spark(u.x + Math.cos(a) * 0.6, u.y + 1.3, u.z + Math.sin(a) * 0.6, perfect ? 0x7fc8ff : 0xfff0d0, perfect ? 16 : 6, 4);
  camZoomPulse(perfect ? 0.6 : 0.3);
  let first = true;
  const p = shoot({ x: u.x, y: y0, z: u.z, a, speed, range: THROW.range, side: 'ally', len: 1.5, thick: 0.035, tip: true, color: perfect ? 0xd8eeff : 0xc8b8a0,
    glow: perfect ? 0x5ab4ff : null, pierce: perfect, hitsAir: true, trail: perfect ? 0x5ab4ff : null,
    dy: tp && tp.S ? aimDy(u.x, y0, u.z, tp, speed) : 0,
    onHit: (p, t) => {
      hurt(u, t, dmg, { hitsAir: true, ranged: true, from: { x: p.x - Math.cos(a), z: p.z - Math.sin(a) }, crit: perfect, critMul: 2.5, pierce: perfect, kb: 1.2 * k, stun: perfect ? 0.6 : 0 });
      if (perfect && first){ camCrit(t.x, t.z, t.y + 0.4 + (t.lift || 0), 0.38); first = false; }
      if (G.cmd === 'focus') G.focusTarget = t;
    },
    end: (p, x, z, wall, t) => { if (CAM.track === p) CAM.trackUntil = G.t + 0.25; dropSpear(t ? t.x + rnd(-0.6, 0.6) : x - Math.cos(a) * (wall ? 0.4 : 0), t ? t.z + rnd(0.3, 0.9) : z - Math.sin(a) * (wall ? 0.4 : 0), a); } });
  // 완벽: 카메라가 살짝 당겨 창을 따라감
  if (perfect){ CAM.track = p; CAM.trackUntil = G.t + 1.2; }
}
function dropSpear(x, z, a){
  if (solidAt(G.map, x, z)){ x = G.player.x; z = G.player.z; }
  const y = heightAt(G.map, x, z), g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6), new THREE.MeshBasicMaterial({ color: 0xc8b8a0 }));
  m.position.set(x, y + 0.5, z); m.rotation.z = (Math.cos(a) > 0 ? -1 : 1) * 0.6; m.rotation.y = rnd(-0.3, 0.3);
  const glow = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.32, 24), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
  glow.rotation.x = -Math.PI / 2; glow.position.set(x, y + 0.03, z);
  g.add(m); g.add(glow); G.scene.add(g);
  P.spearObj = { x, z, m: g };
}
// 잔상 (구르기 · 적뢰 스텝)
function ghost(u){
  const m = u.mesh.clone(); m.material = u.mat.clone(); m.material.transparent = true; m.material.opacity = 0.5; m.material.color.setRGB(0.6, 0.8, 1.2);
  const g = new THREE.Group(); g.position.copy(u.group.position); const pv = u.pivot.clone(false); pv.add(m); pv.rotation.copy(u.pivot.rotation); pv.position.copy(u.pivot.position); g.add(pv); G.scene.add(g);
  G.fx.push({ s: { position: { x: 0, y: 0, z: 0 }, material: m.material, scale: { setScalar(){} } }, g, t: 0, life: 0.25, ghost: true, vx: 0, vy: 0, vz: 0 });
}
// 머리 위 게이지 (투창: 금색 → 완벽 구간에서 하얗게) · 방어 중엔 앞에 푸른 반원
let guardArc = null;
function updateChargeRing(u){
  const el = document.getElementById('gauge');
  if (P.aiming){
    const k = P.charge / THROW.full, inWin = P.charge >= THROW.full - THROW.perfect;
    const p = toScreen(u.x, u.y + (u.jy || 0) + bodyH(u) + 0.55, u.z, UI.W, UI.H);
    el.hidden = false; el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-100%)`;
    el.firstChild.style.width = (k * 100) + '%'; el.classList.toggle('win', inWin);
  } else el.hidden = true;
  if (!guardArc){
    guardArc = new THREE.Mesh(new THREE.RingGeometry(0.6, 0.75, 24, 1, -0.9, 1.8), new THREE.MeshBasicMaterial({ color: 0x8fd8ff, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false }));
    guardArc.rotation.x = -Math.PI / 2; G.scene.add(guardArc);
  }
  guardArc.visible = !!u.guard;
  if (u.guard){ guardArc.position.set(u.x, u.y + 0.05, u.z); guardArc.rotation.z = -u.aim; guardArc.material.opacity = G.t - u.guardAt < 0.2 ? 1 : 0.55; }
}
