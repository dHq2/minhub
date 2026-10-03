/* player.js v0.6 — 인주 직접 조작
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
// 마우스가 적의 그림 (발 ~ 머리, 날고 있으면 하늘에 있는 그 그림) 위에 있나: 화면에서 그림 상자로 판단
function mouseOverEnemy(){
  if (!mouse.inside) return null;
  let best = null, bd = 1e9;
  for (const e of G.units){
    if (e.side !== 'enemy' || e.dead) continue;
    const base = e.y + (e.lift || 0) + (e.jy || 0), f = toScreen(e.x, base, e.z, UI.W, UI.H), h = toScreen(e.x, base + bodyH(e), e.z, UI.W, UI.H);
    if (f.behind) continue;
    const hh = Math.max(30, f.y - h.y), hw = Math.max(22, hh * 0.32);
    if (mouse.x < f.x - hw || mouse.x > f.x + hw || mouse.y < h.y - 10 || mouse.y > f.y + 12) continue;
    const d = Math.abs(mouse.x - f.x) + Math.abs(mouse.y - (f.y + h.y) / 2) * 0.5;
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
  if (!ix && !iy){ P.inYaw = null; return null; }
  // 누르고 있는 동안 카메라가 돌아도 (구역 · Z · C) 방향 기준은 누르기 시작한 때 그대로 → 손을 떼면 새 각도로
  if (P.inYaw == null) P.inYaw = CAM.yawT || 0;
  const y = P.inYaw, fx = -Math.sin(y), fz = -Math.cos(y), rx = Math.cos(y), rz = -Math.sin(y);
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
    aimPath(u);
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
// 투창 궤적 (포물선): 마우스가 가리키는 곳 (2 ~ 13칸)에 떨어지게 계산. 그 근처 (1.4칸)에 적이 있으면 그 적의 몸통을 노림 (보정)
// 적 위에서 누르면 그 적. 마우스를 안 쓰면 앞의 가까운 적. 모을수록 빠르고 낮게 날아감. 놓는 순간의 궤적 그대로 날아감
const ARC = { g: 16, v0: 10, v1: 7, assist: 1.4 };
function aimPath(u){
  let tp = P.lockT && !P.lockT.dead ? P.lockT : null, gp = null;
  if (!tp) tp = mouse.over && !mouse.over.dead ? mouse.over : null;   // 그림 위에 마우스 → 그 적 (날고 있으면 하늘의 몸통)
  if (!tp){
    gp = aimPoint(u);
    if (gp){ let bd = ARC.assist; for (const e of foes()){ if (e.dead || e.downed) continue; const d = Math.hypot(e.x - gp.x, e.z - gp.z) - e.r; if (d < bd && Math.hypot(e.x - u.x, e.z - u.z) <= THROW.range + 1){ bd = d; tp = e; } } }
    else tp = nearest(u, foes().filter(e => Math.abs(angDiff(Math.atan2(e.z - u.z, e.x - u.x), u.aim)) < 1.1 && losClear(G.map, u.x, u.z, e.x, e.z)), THROW.range);
  }
  let tx, tz, ty;
  if (tp){ tx = tp.x; tz = tp.z; ty = tp.y + (tp.lift || 0) + (tp.jy || 0) + bodyH(tp) * 0.55; }
  else {
    if (!gp) gp = { x: u.x + Math.cos(u.aim) * THROW.range, z: u.z + Math.sin(u.aim) * THROW.range };
    const a = Math.atan2(gp.z - u.z, gp.x - u.x), L = clamp(Math.hypot(gp.x - u.x, gp.z - u.z), 2, THROW.range);
    tx = u.x + Math.cos(a) * L; tz = u.z + Math.sin(a) * L; ty = heightAt(G.map, tx, tz);
  }
  const a = Math.atan2(tz - u.z, tx - u.x), L = Math.max(0.5, Math.hypot(tx - u.x, tz - u.z));
  setAim(u, u.x + Math.cos(a), u.z + Math.sin(a));
  const k = Math.min(1, (P.charge || 0) / THROW.full), vh = ARC.v0 + ARC.v1 * k, T = L / vh, y0 = u.y + (u.jy || 0) + 1.25;
  const vy = (ty - y0) / T + ARC.g * T / 2;
  // 미리 날려 보기: 벽 · 땅 (높은 바닥 포함)에 닿는 곳까지
  const pts = [], m = G.map, n = 28, Tmax = T * 1.6;
  let land = null, hit = null;
  const bodies = G.units.filter(e => !e.dead && !e.downed && (e.side === 'enemy' || e.D.dummy));
  for (let i = 0; i <= n; i++){
    const t = Tmax * i / n, x = u.x + Math.cos(a) * vh * t, z = u.z + Math.sin(a) * vh * t, y = y0 + vy * t - ARC.g * t * t / 2;
    // 날아가는 길에 닿는 적의 그림 (몸통 기둥): 거기서 끊고 "맞음"으로 보여줌
    if (i > 0){ const b = bodies.find(e => { const base = e.y + (e.lift || 0) + (e.jy || 0); return Math.hypot(e.x - x, e.z - z) < e.r + 0.4 && y > base - 0.1 && y < base + bodyH(e) + 0.2; });
      if (b){ hit = b; land = { x, y, z }; pts.push(land); break; } }
    const ti = Math.round(x), tj = Math.round(z), tk = tj * m.w + ti;
    if (ti < 0 || tj < 0 || ti >= m.w || tj >= m.h || (m.solid[tk] && !m.low[tk] && y < 2.4)){ land = pts[pts.length - 1] || { x: u.x, y: y0, z: u.z }; break; }
    if (i > 0 && y <= heightAt(m, x, z) + 0.05){ land = { x, y: heightAt(m, x, z), z }; pts.push(land); break; }
    pts.push({ x, y, z });
  }
  if (!land) land = pts[pts.length - 1];
  P.aim = { a, vh, vy, y0, T, tp, pts, land, hit };
}
function throwSpear(u, k, perfect){
  aimPath(u);
  const A = P.aim, tp = A.tp, a = A.a; P.aim = null;
  setPose(u, 'throw'); u.st = 'strike'; u.stT = 0.3;
  P.spear = false;
  const dmg = u.atk * (1.2 + 1.6 * k);
  if (perfect){ popText(u.x, u.y + 2.2, u.z, '완벽!', 'crit', 1); ring(u.x, u.z, 0x5ab4ff, 2.2, 0.4); G.hitstop = 0.08; }
  else if (k >= 1) popText(u.x, u.y + 2.1, u.z, '힘껏', 'big', 0.7);
  spark(u.x + Math.cos(a) * 0.6, u.y + 1.3, u.z + Math.sin(a) * 0.6, perfect ? 0x7fc8ff : 0xfff0d0, perfect ? 16 : 6, 4);
  const p = shoot({ x: u.x, y: A.y0, z: u.z, a, speed: A.vh, vy: A.vy, g: ARC.g, homing: A.hit, hitR: 0.4, range: THROW.range * 2, side: 'ally', len: 1.5, thick: 0.035, tip: true, color: perfect ? 0xd8eeff : 0xc8b8a0,
    glow: perfect ? 0x5ab4ff : null, pierce: perfect, hitsAir: true, trail: perfect ? 0x5ab4ff : null,
    onHit: (p, t) => {
      hurt(u, t, dmg, { hitsAir: true, ranged: true, from: { x: p.x - Math.cos(p.a), z: p.z - Math.sin(p.a) }, crit: perfect, critMul: 2.5, pierce: perfect, noCam: perfect, kb: 1.2 * k, stun: perfect ? 0.6 : 0 });
      if (G.cmd === 'focus') G.focusTarget = t;
    },
    end: (p, x, z, wall, t) => { if (CAM.track === p) CAM.trackUntil = G.t + 0.25; dropSpear(t ? t.x + rnd(-0.6, 0.6) : x - Math.cos(p.a) * (wall ? 0.4 : 0), t ? t.z + rnd(0.3, 0.9) : z - Math.sin(p.a) * (wall ? 0.4 : 0), p.a); } });
  // 보통은 카메라가 그대로. 완벽이면 화면이 물러나 (줌아웃) 푸른 점 궤적이 보이고, 적에게 닿는 순간만 그 자리를 살짝 당겨 봄 (각도는 그대로)
  if (perfect){ CAM.track = p; CAM.trackUntil = G.t + 1.6; CAM.punch = null; }
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
let guardArc = null, aimLine = null;
// 궤적 표시: 점선 포물선 (모은 만큼 밝아짐, 완벽 구간에선 하얗게) + 떨어질 자리 고리 · 노린 적은 발밑 고리. 무엇에 가려도 보임
function updateAimLine(u){
  if (!aimLine){
    const mat = (c, o) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthTest: false, depthWrite: false, side: THREE.DoubleSide });
    aimLine = { dots: [], g: new THREE.Group() };
    for (let i = 0; i < 29; i++){ const d = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 4), mat(0xffd35a, 0.9)); d.renderOrder = 50; aimLine.dots.push(d); aimLine.g.add(d); }
    aimLine.land = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.36, 24).rotateX(-Math.PI / 2), mat(0xffd35a, 0.9)); aimLine.land.renderOrder = 50; aimLine.g.add(aimLine.land);
    aimLine.foe = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.74, 32).rotateX(-Math.PI / 2), mat(0xffd35a, 0.85)); aimLine.foe.renderOrder = 50; aimLine.g.add(aimLine.foe);
    G.scene.add(aimLine.g);
  }
  aimLine.g.visible = !!P.aiming && !!P.aim;
  if (!aimLine.g.visible){ const el = document.getElementById('aimtag'); if (el) el.hidden = true; return; }
  const A = P.aim, k = Math.min(1, P.charge / THROW.full), win = P.charge >= THROW.full - THROW.perfect, c = win ? 0xffffff : 0xffd35a;
  aimLine.dots.forEach((d, i) => {
    const p = A.pts[i]; d.visible = !!p && i > 0; if (!d.visible) return;
    d.position.set(p.x, p.y, p.z); d.material.color.setHex(c); d.material.opacity = i / A.pts.length <= k ? 0.95 : 0.3;
    d.scale.setScalar(win ? 1.4 : 1);
  });
  // 맞는 적이 있으면 그 발밑에 고리 + 머리 위 "맞음", 없으면 떨어질 자리에 작은 고리 (노린 적이 있는데 안 맞으면 붉게)
  aimLine.land.visible = !A.hit; aimLine.land.position.set(A.land.x, heightAt(G.map, A.land.x, A.land.z) + 0.05, A.land.z); aimLine.land.material.color.setHex(A.tp ? 0xff6a5a : win ? 0x8fd8ff : c);
  aimLine.foe.visible = !!A.hit; if (A.hit){ aimLine.foe.position.set(A.hit.x, A.hit.y + 0.05, A.hit.z); aimLine.foe.scale.setScalar(A.hit.r / 0.6 + 0.4); aimLine.foe.material.color.setHex(win ? 0x8fd8ff : c); }
  const el = document.getElementById('aimtag'); if (el){ const t = A.hit || (A.tp ? null : null); el.hidden = !A.hit && !A.tp;
    if (!el.hidden){ const e = A.hit || A.tp, sp = toScreen(e.x, e.y + (e.lift || 0) + bodyH(e) + 0.3, e.z, UI.W, UI.H); el.style.transform = `translate(${sp.x}px,${sp.y}px) translate(-50%,-100%)`; el.textContent = A.hit ? '맞음' : '안 닿음'; el.className = A.hit ? 'ok' : 'no'; } }
}
function updateChargeRing(u){
  updateAimLine(u);
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
