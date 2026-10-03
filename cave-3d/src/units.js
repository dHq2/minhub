/* units.js v0.1 — 인물 (세워 놓은 그림) · 체력 줄 · 글씨 · 예고 장판 · 투사체 · 불꽃 · 피해 규칙 */
'use strict';
const UI = { layer: null, W: 1, H: 1 };
const DEFS = {
  player:      { spr: 'player', name: '인주', hp: 120, atk: 16, spd: 3.4, r: 0.32, weight: 55 },
  morningstar: { spr: 'morningstar', name: '모닝스타', hp: 230, atk: 15, spd: 3.0, r: 0.34, weight: 70, melee: { range: 1.5, arc: 1.9, windup: 0.45, cd: 1.5, mul: 1, kb: 0.8 } },
  norman:      { spr: 'norman', name: '노먼', hp: 100, atk: 8, spd: 3.1, r: 0.32, weight: 70, ranged: { range: 7, windup: 0.35, cd: 1.1 }, medic: true },
  rebecca:     { spr: 'rebecca', name: '레베카', hp: 100, atk: 0, spd: 0, r: 0.35, weight: 60 },
  dummy:       { spr: 'dummy', name: '허수아비', hp: 99999, atk: 0, spd: 0, r: 0.35, weight: 999, dummy: true },
  swordsman:   { spr: 'swordsman', name: '검사', hp: 120, atk: 15, spd: 2.7, r: 0.36, weight: 110, melee: { range: 1.9, arc: 1.8, windup: 0.55, cd: 1.5, mul: 1, kb: 0.6 } },
  spearman:    { spr: 'spearman', name: '창병', hp: 110, atk: 14, spd: 2.5, r: 0.36, weight: 100, line: { len: 2.9, w: 0.6, windup: 0.6, cd: 1.7, mul: 1.1, kb: 1.0 } },
  shieldman:   { spr: 'shieldman', name: '검방패병', hp: 150, atk: 11, spd: 2.3, r: 0.38, weight: 130, block: 0.25, melee: { range: 1.4, arc: 1.6, windup: 0.45, cd: 1.6, mul: 1, kb: 1.4 } },
  archer:      { spr: 'archer', name: '붉은 망토 궁수', hp: 75, atk: 17, spd: 3.6, r: 0.32, weight: 60, bow: { range: 10, windup: 0.5, cd: 1.6, speed: 30 }, leap: 4.2 },
  brute:       { spr: 'brute', name: '곤봉 거한', hp: 360, atk: 28, spd: 1.9, r: 0.6, weight: 900, armor: 0.4, heavy: true, slam: { r: 2.0, windup: 0.95, cd: 2.4, mul: 1, kb: 2.2, stun: 0.9 } },
  jeokroe:     { spr: 'jeokroe', name: '적뢰', hp: 1100, atk: 30, spd: 1.7, r: 0.8, weight: 2000, heavy: true, boss: true, marble: true },
};

/* ---------- 인물 ---------- */
let UID = 0;
function spawn(kind, x, z, side){
  const D = DEFS[kind], S = SPR[D.spr];
  const u = { uid: ++UID, kind, D, S, side, x, z, y: heightAt(G.map, x, z), r: D.r, hp: D.hp, max: D.hp, atk: D.atk, spd: D.spd,
    face: side === 'enemy' ? -1 : 1, aim: side === 'enemy' ? Math.PI / 2 * 3 : -Math.PI / 2, pose: 'idle', poseT: 0, flash: 0,
    st: 'idle', stT: 0, cd: rnd(0.3, 1), kx: 0, kz: 0, inv: 0, dead: false, downed: false, moving: false, home: { x, z }, alert: false, lift: 0, tilt: 0 };
  u.group = new THREE.Group();
  u.tex = {};
  u.mat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.35, side: THREE.DoubleSide, fog: true });
  u.mat.color.setScalar(0.92);
  u.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), u.mat);
  u.pivot = new THREE.Group(); u.pivot.add(u.mesh); u.group.add(u.pivot);
  const sh = new THREE.Mesh(new THREE.CircleGeometry(1, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.42, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.scale.setScalar(D.r * 1.15); sh.position.y = 0.02; u.group.add(sh); u.shadow = sh;
  G.scene.add(u.group);
  if (side !== 'neutral' || D.dummy){
    u.bar = document.createElement('div'); u.bar.className = 'hpbar ' + side + (D.boss ? ' boss' : ''); u.bar.innerHTML = '<i></i>';
    UI.layer.appendChild(u.bar);
  }
  if (side === 'ally' || side === 'neutral'){ u.tag = document.createElement('div'); u.tag.className = 'ntag ' + side; u.tag.textContent = D.name; UI.layer.appendChild(u.tag); }
  G.units.push(u);
  return u;
}
function removeUnit(u){ G.scene.remove(u.group); u.bar && u.bar.remove(); u.tag && u.tag.remove(); G.units = G.units.filter(o => o !== u); }
function setPose(u, p){ if (u.pose !== p){ u.pose = p; u.poseT = 0; } }
function texFor(u, P){
  if (P.canvas){ return P._tex || (P._tex = canvasTex(P.w, P.h, P.canvas)); }
  if (!u.tex[P.src]){ const t = loadTex(P.src).clone(); t.needsUpdate = true; u.tex[P.src] = t; }
  return u.tex[P.src];
}
const camRight = new THREE.Vector3();
function updateSprite(u, dt){
  u.poseT += dt;
  const P = u.S.poses[u.pose] || u.S.poses.idle, t = texFor(u, P);
  if (u.mat.map !== t){ u.mat.map = t; u.mat.needsUpdate = true; }
  if (P.n){
    const cnt = P.count || P.n, from = P.from || 0;
    let fi = Math.floor(u.poseT * P.fps); fi = P.once ? Math.min(cnt - 1, fi) : fi % cnt;
    t.repeat.set(1 / P.n, 1); t.offset.set((from + fi) / P.n, 0);
  }
  const k = u.S.tall * SPRITE_SCALE / u.S.h0 * (P.scale || 1), w = P.w * k, h = P.h * k;
  const flip = (P.f || 1) === u.face ? 1 : -1;
  u.mesh.scale.set(w * flip, h, 1);
  u.mesh.position.set((P.w / 2 - P.ax) * k * flip, (P.ay - P.h / 2) * k, 0);
  // 쓰러짐: 옆으로 눕힘
  const tiltT = u.downed || u.dead ? Math.PI / 2 * 0.92 * -u.face : 0;
  u.tilt += (tiltT - u.tilt) * Math.min(1, dt * 10);
  u.lean = (u.lean || 0) + ((u.leanT || 0) - (u.lean || 0)) * Math.min(1, dt * 18);
  if (u.st !== 'windup') u.leanT = (u.leanT || 0) * Math.max(0, 1 - dt * 6);
  u.pivot.rotation.z = u.tilt + u.lean * -u.face;
  u.pivot.position.y = u.lift + (u.jy || 0) + (u.tilt ? -0.05 : 0);
  // 그림은 카메라를 봄 (세로축만 돎)
  u.group.position.set(u.x, u.y, u.z);
  u.pivot.rotation.y = Math.atan2(camera.position.x - u.x, camera.position.z - u.z);
  u.shadow.material.opacity = 0.42 * Math.max(0.2, 1 - u.lift / 3);
  u.flash = Math.max(0, u.flash - dt * 6);
  u.mat.color.setScalar(0.92 + u.flash * 2.6);
  if (u.redTint) u.mat.color.setRGB(1.6, 0.6, 0.6);
}
// 바라보는 각 → 화면의 왼쪽 · 오른쪽
function faceToward(u, ax, az){
  camRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
  const d = ax * camRight.x + az * camRight.z;
  if (Math.abs(d) > 0.05) u.face = d > 0 ? 1 : -1;
}
function setAim(u, tx, tz){ u.aim = Math.atan2(tz - u.z, tx - u.x); faceToward(u, Math.cos(u.aim), Math.sin(u.aim)); }

/* ---------- 이동: 벽은 막고, 높이 차는 경사로만. 막혀도 달리는 동작은 이어짐 (제자리 달리기 대신 미끄러지듯 벽을 따라감) ---------- */
// 원 (몸) 대 칸 (벽): 일단 움직이고, 겹친 막힌 칸에서 밀려 나옴 → 벽을 따라 미끄러짐, 끼어도 빠져나옴
// 높이 차가 0.45 넘는 칸 (경사를 거치지 않은 높은 바닥 · 낭떠러지)도 벽처럼
function blockedFor(m, i, j, h0, jy = 0){
  if (i < 0 || j < 0 || i >= m.w || j >= m.h) return true;
  const k = j * m.w + i;
  if (m.solid[k] && !(m.low[k] && jy > 0.5)) return true;   // 점프 중이면 바위를 넘음
  return Math.abs(m.hgt[k] - h0) > 0.45 + jy;               // 점프하면 높은 바닥에 오르거나 뛰어내림
}
function moveBy(u, dx, dz){
  const m = G.map, h0 = heightAt(m, u.x, u.z), r = u.r * 0.85, ox = u.x, oz = u.z;
  let x = u.x + dx, z = u.z + dz;
  for (let pass = 0; pass < 2; pass++){
    const ci = Math.round(x), cj = Math.round(z);
    for (let j = cj - 1; j <= cj + 1; j++) for (let i = ci - 1; i <= ci + 1; i++){
      if (!blockedFor(m, i, j, h0, u.jy || 0)) continue;
      const px = clamp(x, i - 0.5, i + 0.5), pz = clamp(z, j - 0.5, j + 0.5), ddx = x - px, ddz = z - pz, d = Math.hypot(ddx, ddz);
      if (d >= r) continue;
      if (d > 1e-5){ x += ddx / d * (r - d); z += ddz / d * (r - d); }
      else { const ex = x - i, ez = z - j; if (Math.abs(ex) > Math.abs(ez)) x = i + Math.sign(ex || 1) * (0.5 + r); else z = j + Math.sign(ez || 1) * (0.5 + r); }
    }
  }
  u.x = x; u.z = z;
  return Math.hypot(x - ox, z - oz) > Math.hypot(dx, dz) * 0.25;
}
// 길 찾기 대신: 곧장 가다 막히면 ±45° · ±90°로 비켜 감
function steerTo(u, tx, tz, speed, dt, stopAt = 0){
  const dx = tx - u.x, dz = tz - u.z, d = Math.hypot(dx, dz);
  if (d <= stopAt) return false;
  const step = Math.min(d - stopAt, speed * dt), base = Math.atan2(dz, dx);
  for (const off of [0, 0.6, -0.6, 1.2, -1.2, 1.7, -1.7]){
    const a = base + off * (u.uid % 2 ? 1 : -1);
    if (moveBy(u, Math.cos(a) * step, Math.sin(a) * step)){ faceToward(u, Math.cos(a), Math.sin(a)); u.moving = true; return true; }
  }
  return false;
}
// 길찾기를 섞은 이동: 곧장 걸어갈 수 있으면 곧장, 아니면 거리 지도를 따라 한 칸씩 (벽 너머 상대에게도 돌아서 감)
function walkable(m, ax, az, bx, bz){
  const d = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(d / 0.3)); let h = heightAt(m, ax, az);
  for (let k = 1; k <= n; k++){
    const x = ax + (bx - ax) * k / n, z = az + (bz - az) * k / n;
    for (const [ox, oz] of [[0.25, 0], [-0.25, 0], [0, 0.25], [0, -0.25]]) if (solidAt(m, x + ox, z + oz)) return false;
    const hh = heightAt(m, x, z); if (Math.abs(hh - h) > 0.45) return false; h = hh;
  }
  return true;
}
function navTo(u, tx, tz, speed, dt, stopAt = 0){
  if (Math.hypot(tx - u.x, tz - u.z) <= stopAt) return false;
  if (walkable(G.map, u.x, u.z, tx, tz)) return steerTo(u, tx, tz, speed, dt, stopAt);
  const f = navField(G.map, tx, tz), nx = f && navNext(G.map, f, u.x, u.z);
  if (!nx) return steerTo(u, tx, tz, speed, dt, stopAt);
  return steerTo(u, nx.x, nx.z, speed, dt, 0);
}
// 겹치면 살짝 밀어냄 (무거운 쪽이 덜 밀림). 서로 지나갈 수는 있게 약하게
function separate(dt){
  const us = G.units.filter(u => !u.dead && !u.downed && u.lift < 0.5);
  for (let i = 0; i < us.length; i++) for (let j = i + 1; j < us.length; j++){
    const a = us[i], b = us[j], dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz), m = (a.r + b.r) * 0.85;
    if (d >= m || d < 1e-4) continue;
    const push = (m - d) * Math.min(1, dt * 8), wa = b.D.weight / (a.D.weight + b.D.weight), nx = dx / d, nz = dz / d;
    if (!a.D.dummy) moveBy(a, -nx * push * wa, -nz * push * wa);
    if (!b.D.dummy) moveBy(b, nx * push * (1 - wa), nz * push * (1 - wa));
  }
}

/* ---------- 글씨 (피해 숫자 · 회피 · 막음) ---------- */
G.texts = [];
function popText(x, y, z, text, cls = '', life = 0.9){
  const el = document.createElement('div'); el.className = 'pop ' + cls; el.textContent = text; UI.layer.appendChild(el);
  G.texts.push({ el, x, y, z, t: 0, life, dx: rnd(-0.25, 0.25) });
}
function updateTexts(dt){
  G.texts = G.texts.filter(o => {
    o.t += dt; if (o.t >= o.life){ o.el.remove(); return false; }
    const p = toScreen(o.x + o.dx * o.t, o.y + o.t * 0.9, o.z, UI.W, UI.H);
    o.el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-50%) scale(${o.t < 0.08 ? 1.5 - o.t * 6 : 1})`;
    o.el.style.opacity = Math.min(1, (o.life - o.t) * 3);
    return true;
  });
}
function updateBars(){
  for (const u of G.units){
    const top = u.S.tall * SPRITE_SCALE + 0.25 + u.lift + (u.jy || 0);
    const p = toScreen(u.x, u.y + top, u.z, UI.W, UI.H);
    const show = !u.dead && !p.behind && (u.side === 'ally' || u.D.dummy || u.alert || u.hp < u.max);
    if (u.bar){ u.bar.style.display = show && !u.D.boss ? 'block' : 'none'; if (show){ u.bar.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,0)`; u.bar.firstChild.style.width = Math.max(0, u.hp / u.max * 100) + '%'; if (u.side === 'ally'){ const t = Math.max(0, Math.ceil(u.hp)) + ''; if (u.bar.dataset.n !== t){ u.bar.dataset.n = t; } } } }
    if (u.tag){ u.tag.style.display = !u.dead && !p.behind ? 'block' : 'none'; u.tag.style.transform = `translate(${p.x}px,${p.y - 14}px) translate(-50%,0)`; u.tag.classList.toggle('down', !!u.downed); }
  }
}

/* ---------- 예고 장판: 바닥에 그려지고, 차오르는 만큼 시간이 흐름 → 다 차는 순간 그 범위에 맞음 (안에 있으면 맞고, 밖으로 나가면 피함) ---------- */
const RED = 0xff3b30, BLUE = 0x5ab4ff, GOLD = 0xffc04a;
function decal(shape, o){
  const g = new THREE.Group(), col = o.color ?? RED;
  const mk = (geo, op) => { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; return m; };
  let area, fill;
  if (shape === 'circle'){ area = mk(new THREE.CircleGeometry(o.r, 40), 0.16); fill = mk(new THREE.CircleGeometry(o.r, 40), 0.32); const ring = mk(new THREE.RingGeometry(o.r - 0.05, o.r, 48), 0.85); g.add(ring); }
  if (shape === 'sector'){
    const s = -o.a - o.arc / 2;
    area = mk(new THREE.CircleGeometry(o.r, 24, s, o.arc), 0.18); fill = mk(new THREE.CircleGeometry(o.r, 24, s, o.arc), 0.34);
    g.add(mk(new THREE.RingGeometry(o.r - 0.05, o.r, 24, 1, s, o.arc), 0.85));
  }
  if (shape === 'line'){
    const geo = () => { const p = new THREE.PlaneGeometry(o.len, o.w); p.translate(o.len / 2, 0, 0); return p; };
    area = mk(geo(), 0.16); fill = mk(geo(), 0.36);
    const edge = mk(new THREE.PlaneGeometry(0.08, o.w), 0.9); edge.position.x = o.len; area.add(edge); edge.rotation.x = 0;
    area.rotation.z = fill.rotation.z = -o.a; area.rotation.order = fill.rotation.order = 'XYZ';
    // 바닥 평면 위에서 돌리기: x축으로 눕힌 뒤 z축 회전 = 세계에서 y축 회전
    area.rotation.set(-Math.PI / 2, 0, -o.a); fill.rotation.set(-Math.PI / 2, 0, -o.a);
  }
  g.add(area); g.add(fill); fill.scale.setScalar(0.001);
  g.position.set(o.x, (o.y ?? heightAt(G.map, o.x, o.z)) + 0.03 + (o.lift || 0), o.z);
  G.scene.add(g);
  const d = { shape, ...o, g, fill, t: 0, dur: o.dur, done: false };
  G.decals.push(d);
  return d;
}
function updateDecals(dt){
  G.decals = G.decals.filter(d => {
    if (d.done){ G.scene.remove(d.g); return false; }
    d.t += dt; const p = Math.min(1, d.t / d.dur);
    if (d.shape === 'line') d.fill.scale.set(p, 1, 1); else d.fill.scale.setScalar(Math.max(0.001, p));
    if (d.follow){ d.g.position.x = d.follow.x; d.g.position.z = d.follow.z; d.x = d.follow.x; d.z = d.follow.z; }
    if (d.t >= d.dur){ d.done = true; d.onDone && d.onDone(d); }
    return true;
  });
}
function cancelDecal(d){ if (d) d.done = true; }
function inShape(d, u){
  const dx = u.x - d.x, dz = u.z - d.z, r = u.r * 0.6;
  if (d.shape === 'circle') return Math.hypot(dx, dz) <= d.r + r;
  if (d.shape === 'sector'){ const dd = Math.hypot(dx, dz); return dd <= d.r + r && (dd < 0.5 || Math.abs(angDiff(Math.atan2(dz, dx), d.a)) <= d.arc / 2 + 0.15); }
  if (d.shape === 'line'){ const c = Math.cos(d.a), s = Math.sin(d.a), along = dx * c + dz * s, perp = -dx * s + dz * c; return along >= -r && along <= d.len + r && Math.abs(perp) <= d.w / 2 + r; }
  return false;
}

/* ---------- 불꽃 · 먼지 ---------- */
const sparkTex = canvasTex(32, 32, (c, w, h) => { const g = c.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.4, 'rgba(255,255,255,0.6)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
function dot(x, y, z, color, size = 0.2, life = 0.9){
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  s.position.set(x + rnd(-0.04, 0.04), y + rnd(-0.04, 0.04), z + rnd(-0.04, 0.04)); s.scale.setScalar(size); G.scene.add(s);
  G.fx.push({ s, vx: 0, vy: 0, vz: 0, t: 0, life, size, grav: 0 });
}
function spark(x, y, z, color, n = 8, speed = 4, size = 0.18, life = 0.35){
  for (let i = 0; i < n; i++){
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.position.set(x, y, z); s.scale.setScalar(size); G.scene.add(s);
    const a = Math.random() * Math.PI * 2, v = speed * rnd(0.4, 1);
    G.fx.push({ s, vx: Math.cos(a) * v, vy: rnd(0.5, 1.5) * v * 0.6, vz: Math.sin(a) * v, t: 0, life: life * rnd(0.7, 1.2), size, grav: 9 });
  }
}
function dust(x, z, n = 6, color = 0x8a8070){
  for (let i = 0; i < n; i++){
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color, transparent: true, opacity: 0.5, depthWrite: false }));
    s.position.set(x + rnd(-0.3, 0.3), heightAt(G.map, x, z) + 0.1, z + rnd(-0.3, 0.3)); s.scale.setScalar(0.4); G.scene.add(s);
    G.fx.push({ s, vx: rnd(-0.8, 0.8), vy: rnd(0.3, 0.9), vz: rnd(-0.8, 0.8), t: 0, life: rnd(0.5, 0.8), size: 0.4, grow: 1.6, grav: 0 });
  }
}
function ring(x, z, color, r = 1.5, life = 0.4, y){
  const m = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, (y ?? heightAt(G.map, x, z)) + 0.05, z); G.scene.add(m);
  G.fx.push({ s: m, ring: r, t: 0, life });
}
function updateFx(dt){
  G.fx = G.fx.filter(f => {
    f.t += dt; const k = f.t / f.life;
    if (f.ghost){ if (k >= 1){ G.scene.remove(f.g); return false; } f.s.material.opacity = 0.5 * (1 - k); return true; }
    if (k >= 1){ G.scene.remove(f.s); f.s.material.dispose(); return false; }
    if (f.ring){ f.s.scale.setScalar(0.2 + f.ring * k); f.s.material.opacity = 0.9 * (1 - k); return true; }
    f.vy -= (f.grav || 0) * dt; f.s.position.x += f.vx * dt; f.s.position.y += f.vy * dt; f.s.position.z += f.vz * dt;
    f.s.material.opacity = (f.grow ? 0.5 : 1) * (1 - k); if (f.grow) f.s.scale.setScalar(f.size * (1 + f.grow * k));
    return true;
  });
}

/* ---------- 피해 규칙
   · 등 뒤 (바라보는 쪽에서 110° 넘게)에서 치면 사각: +25%, 방패도 소용없음
   · 방패병은 앞에서 오는 것을 막음 (25%만)
   · 곤봉 거한은 중갑: 치명 · 사각 · 완벽 투창이 아니면 40%만
   · 높은 곳에서 치면 +15%
   · 무적 (구르기) 중이면 회피 ---------- */
function hurt(att, tgt, base, o = {}){
  if (!tgt || tgt.dead || tgt.downed) return 0;
  if (tgt.D.dummy){ /* 허수아비: 숫자만 */ }
  else if (tgt.inv > 0 && !o.unblockable){ popText(tgt.x, tgt.y + 1.6 + tgt.lift, tgt.z, tgt.D.boss ? '무적' : '회피', 'miss'); return 0; }
  if (tgt.airborne && !o.hitsAir){ popText(tgt.x, tgt.y + 2, tgt.z, '닿지 않음', 'miss'); return 0; }
  let dmg = base * rnd(0.9, 1.1), tag = '';
  const src = o.from || att;
  let back = false, front = true;
  if (src){ const toSrc = Math.atan2(src.z - tgt.z, src.x - tgt.x), ad = Math.abs(angDiff(toSrc, tgt.aim)); back = !tgt.D.boss && ad > 1.9; front = ad < 1.25; }
  // 인주 방어 (F): 앞에서 오는 것만. 맞기 직전 0.2초 안에 올렸으면 튕겨냄 (피해 0, 상대가 휘청)
  if (tgt.guard && front && !o.unblockable){
    if (G.t - (tgt.guardAt || -9) <= 0.2){
      popText(tgt.x, tgt.y + 2, tgt.z, '튕겨냄!', 'crit', 1); spark(tgt.x + Math.cos(tgt.aim) * 0.5, tgt.y + 1, tgt.z + Math.sin(tgt.aim) * 0.5, 0x8fd8ff, 18, 6); ring(tgt.x, tgt.z, 0x8fd8ff, 1.8, 0.35);
      G.hitstop = Math.max(G.hitstop, 0.12); camZoomPulse(0.7);
      if (att && !att.dead){ if (att.D.boss){ att.parried = 0.9; if (att.B) att.B.act = null; interrupt(att); att.lift = att.airborne ? att.lift : 0; } else { interrupt(att); att.st = 'hurt'; att.stT = 0.9; setPose(att, 'hurt'); } popText(att.x, att.y + 2.4 + (att.lift || 0), att.z, '휘청', 'miss'); }
      return 0;
    }
    dmg *= 0.3; tag = '막음 '; spark(tgt.x + Math.cos(tgt.aim) * 0.5, tgt.y + 1, tgt.z + Math.sin(tgt.aim) * 0.5, 0x9fc8ff, 8, 4);
  }
  // 적뢰: 대리석 피부 (강공이 아니면 59%로 막음) · 강공 (치명 · 완벽 투창 · 3타째)이 오면 옆으로 스텝 (4초마다)
  if (tgt.D.marble && !o.unblockable){
    const strong = o.crit || o.strong || o.pierce;
    if (strong && !tgt.airborne && G.t >= (tgt.stepAt || 0) && !(tgt.B && tgt.B.act && tgt.B.act.type === 'kick')){
      tgt.stepAt = G.t + 4; const s = src || att, a = s ? Math.atan2(tgt.z - s.z, tgt.x - s.x) + (Math.random() < 0.5 ? 1.4 : -1.4) : Math.random() * 6;
      ghost(tgt); moveBy(tgt, Math.cos(a) * 2.2, Math.sin(a) * 2.2); dust(tgt.x, tgt.z, 8);
      popText(tgt.x, tgt.y + 4, tgt.z, '스텝', 'miss', 0.8); return 0;
    }
    if (!strong && Math.random() < 0.59){ dmg *= 0.3; tag = '대리석 '; spark(tgt.x, tgt.y + 1.6 + (tgt.lift || 0), tgt.z, 0xd8d0c0, 8, 4); }
  }
  if (back){ dmg *= 1.25; tag = '사각! '; }
  if (tgt.guardStance && !back && !o.pierce){ dmg *= 0.1; tag = '방어 자세 '; spark(tgt.x, tgt.y + 1.5, tgt.z, 0xd8d8d8, 8, 4); }
  else if (tgt.D.block && !back && !o.pierce){ dmg *= tgt.D.block; tag = '막음 '; spark(tgt.x, tgt.y + 1, tgt.z, 0xd8d8d8, 10, 5); }
  else if (tgt.D.armor && !back && !o.crit && !o.pierce){ dmg *= tgt.D.armor; tag = '갑옷 '; spark(tgt.x, tgt.y + 1.4, tgt.z, 0xb0b0b0, 6, 3); }
  if (att && att.y > tgt.y + 0.3) dmg *= 1.15;
  if (o.crit) dmg *= o.critMul || 2;
  dmg = Math.max(1, Math.round(dmg));
  if (!tgt.D.dummy) tgt.hp -= dmg;
  tgt.flash = 1;
  const big = o.crit || dmg >= 40;
  popText(tgt.x, tgt.y + tgt.S.tall * SPRITE_SCALE * 0.7 + tgt.lift, tgt.z, tag + dmg, (tgt.side === 'ally' ? 'hurt ' : '') + (o.crit ? 'crit' : big ? 'big' : ''), o.crit ? 1.2 : 0.9);
  spark(tgt.x, tgt.y + 0.9 + tgt.lift, tgt.z, o.crit ? 0xffd35a : tgt.side === 'ally' ? 0xff6a5a : 0xfff0d0, o.crit ? 16 : 7, o.crit ? 6 : 4);
  G.hitstop = Math.max(G.hitstop, o.crit ? 0.09 : big ? 0.06 : 0.035);
  if (o.crit && !o.noCam) camZoomPulse(1);
  // 밀려남 (무게에 따라)
  if (o.kb && !tgt.D.heavy && !tgt.D.dummy){
    const s = src || att, n = s ? norm(tgt.x - s.x, tgt.z - s.z) : { x: 0, z: 0 }, k = o.kb * 60 / Math.max(40, tgt.D.weight);
    tgt.kx += n.x * k * 8; tgt.kz += n.z * k * 8;
  }
  if (o.stun && !tgt.D.boss){ interrupt(tgt); tgt.st = 'hurt'; tgt.stT = o.stun; setPose(tgt, 'hurt'); }
  if (tgt.side === 'ally' && tgt.kind === 'player'){ document.getElementById('redflash').style.opacity = Math.min(0.55, 0.18 + dmg / 80); camShake(0.12 + dmg / 300, 0.18); }
  if (tgt.side === 'enemy' && !tgt.alert) alertGroup(tgt, att);
  if (tgt.hp <= 0) kill(tgt, att);
  return dmg;
}
function interrupt(u){ if (u.decal){ cancelDecal(u.decal); u.decal = null; } }
function kill(u, by){
  u.hp = 0; interrupt(u);
  if (u.side === 'ally'){ u.downed = true; u.st = 'down'; popText(u.x, u.y + 1.5, u.z, '쓰러짐', 'hurt big'); return; }
  u.dead = true; u.st = 'dead';
  dust(u.x, u.z, 10);
  G.onKill && G.onKill(u, by);
  setTimeout(() => { if (u.dead) fadeOut(u); }, 2500);
}
function fadeOut(u){ const t0 = G.t; u.fading = t0; }

/* ---------- 투사체: 날아가는 동안 그 자리에 없으면 빗나감. 벽 · 기둥이 막음 ---------- */
function shoot(o){
  const len = o.len || 0.7, geo = new THREE.CylinderGeometry(o.thick || 0.03, o.thick || 0.03, len, 6); geo.rotateZ(Math.PI / 2);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: o.color || 0xe8e0d0 }));
  if (o.tip){ const tip = new THREE.Mesh(new THREE.ConeGeometry((o.thick || 0.03) * 2.6, 0.22, 8), m.material); tip.rotation.z = -Math.PI / 2; tip.position.x = len / 2 + 0.1; m.add(tip); }
  if (o.glow){ const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color: o.glow, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); gl.scale.set(len * 1.4, 0.5, 1); m.add(gl); }
  m.position.set(o.x, o.y, o.z); m.rotation.y = -o.a; G.scene.add(m);
  const p = { ...o, m, t: 0, travelled: 0, hits: new Set() };
  G.projs.push(p);
  return p;
}
function updateProjs(dt){
  G.projs = G.projs.filter(p => {
    const step = p.speed * dt, nx = p.x + Math.cos(p.a) * step, nz = p.z + Math.sin(p.a) * step;
    p.t += dt;
    if (p.fall){ p.y = Math.max(p.yEnd ?? 0.2, p.y + p.vy * dt); p.vy -= 9 * dt; }
    if (p.dy){ p.y = Math.max(0.6, p.y + p.dy * dt); p.m.rotation.z = Math.atan2(p.dy, p.speed); }
    if (!losClear(G.map, p.x, p.z, nx, nz) || p.travelled > p.range){ p.end && p.end(p, p.x, p.z, true); G.scene.remove(p.m); return false; }
    p.x = nx; p.z = nz; p.travelled += step; p.m.position.set(p.x, p.y, p.z);
    if (p.trail){ p.trT = (p.trT || 0) - dt; if (p.trT <= 0){ p.trT = 0.012; dot(p.x, p.y, p.z, p.trail, 0.17, 1.1); } }   // 푸른 점 궤적 (지나간 자리에 점이 남았다 사라짐)
    for (const u of G.units){
      if (u.dead || u.downed || u.side === p.side || u.side === 'neutral' && !u.D.dummy || p.hits.has(u)) continue;
      if (u.airborne && !p.hitsAir) continue;
      if (Math.hypot(u.x - p.x, u.z - p.z) < u.r + 0.2 && Math.abs((u.y + u.lift + (u.jy || 0) + bodyH(u) * 0.5) - p.y) < bodyH(u) * 0.5 + 0.35){
        p.hits.add(u); p.onHit && p.onHit(p, u);
        if (!p.pierce){ p.end && p.end(p, p.x, p.z, false, u); G.scene.remove(p.m); return false; }
      }
    }
    return true;
  });
}
