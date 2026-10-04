/* prologue.js v0.1 — 프롤로그 (PROLOGUE.md v1.1 대본)
   낙하 (돼지 · 시체 · 갑옷과 함께) → 어둠 속 청광묵 (줌인 · 초상화 · 말풍선 "크아아!!") → 맞짱 (튜토리얼)
   → 이기면 컷신 (슬로모션 완벽 투척 · 끄아아 · 3초 무너짐 · 주저앉음 · 기어감 · 암전 · 캉캉) → 몽환적인 굴
   전투 규칙은 1층과 같음 (예고 장판 · 투창 · 구르기 · 방어). 맵 (둥근 구덩이) · 카메라 연출만 따로
   청광묵에게 잡히면 (돌격에 닿으면) 바로 먹힘 = 게임 오버 → 맞짱부터 다시 */
'use strict';
const PA = 'art/pro/';
SPR.cheong = { h0: 512, tall: 1.3, poses: { idle: { src: PA + 'goblin.webp', w: 205, h: 512, ax: 102, ay: 510, f: 1 } } };
SPR.karius = { h0: 512, tall: 1.9, poses: { idle: { src: PA + 'karius.webp', w: 328, h: 512, ax: 150, ay: 512, f: 1 } } };   // 원화 배경 지움
SPR.snail = { h0: 342, tall: 0.62, poses: { idle: { src: PA + 'snail.webp', w: 512, h: 342, ax: 256, ay: 336, f: 1 } } };
DEFS.cheong = { spr: 'cheong', name: '청광묵', hp: 220, atk: 18, spd: 2.8, r: 0.34, weight: 60, think: cheongThink };
DEFS.cheongNpc = { spr: 'cheong', name: '청광묵', hp: 100, atk: 0, spd: 0, r: 0.34, weight: 60 };
DEFS.karius = { spr: 'karius', name: '카리우스', hp: 300, atk: 0, spd: 0, r: 0.4, weight: 200 };
DEFS.snail = { spr: 'snail', name: '인광달팽이', hp: 40, atk: 0, spd: 0.3, r: 0.45, weight: 80 };

// 특성 태그 (사각형 색 태그): 등급 S ~ F 색 · 저주는 보라
const TAG = (txt, cls) => `<span class="tag ${cls}">${txt}</span>`;
const CHEONG_TAGS = () => (PRO.cursed ? TAG('저주: 실명 · 좌안', 'curse') : '') + TAG('발화 A', 'gA');
const FACE = { cheong: PA + 'goblin_face.webp', karius: PA + 'karius_face.webp' };

const PRO = { bills: [], fallers: [], bubbles: [], motes: null, glows: [], cursed: false, gob: null, tries: 0 };

/* ---------- 소리 ---------- */
SFX.clink = function(v = 1){ this.burst({ type: 'bandpass', f: 3400, q: 9, gain: 0.5 * v, dec: 0.22 }); this.burst({ type: 'bandpass', f: 1900, q: 5, gain: 0.3 * v, dec: 0.12 }); this.thump(240, 0.25 * v, 0.1); };
SFX.roar = function(v = 1){ this.burst({ type: 'lowpass', f: 520, f2: 140, q: 2, gain: 0.8 * v, att: 0.08, dec: 1.1 * v }); this.burst({ type: 'bandpass', f: 900, f2: 300, q: 3, gain: 0.35 * v, att: 0.05, dec: 0.8 }); this.thump(70, 0.5 * v, 0.6); };

/* ---------- 화면 도우미 ---------- */
const $p = id => document.getElementById(id);
function dark(v, sec = 1){ const el = $p('dark'); el.style.transition = `opacity ${sec}s ease`; el.style.opacity = v; }
let guideTimer = 0;
function guide(html, sec = 4){ const el = $p('guide'); clearTimeout(guideTimer); if (!html){ el.classList.remove('on'); return; } el.innerHTML = html; el.classList.add('on'); guideTimer = setTimeout(() => el.classList.remove('on'), sec * 1000); }
function mid(text){ const el = $p('mid'); el.textContent = text; el.classList.toggle('on', !!text); }
// 말풍선: 인물 (또는 {x, y, z}) 머리 위. cls: big (외침, 떨림) · soft (혼잣말) · zzz (떠오름)
function say(who, text, cls = '', life = 1.6){
  const el = document.createElement('div'); el.className = 'bubble ' + cls; el.textContent = text; UI.layer.appendChild(el);
  PRO.bubbles.push({ el, who, t0: G.t, life, rise: cls === 'zzz' });
}
function updateBubbles(){
  PRO.bubbles = PRO.bubbles.filter(b => {
    const k = (G.t - b.t0) / b.life;
    if (k >= 1){ b.el.remove(); return false; }
    const w = b.who, y = w.S ? w.y + bodyH(w) + 0.35 + (w.lift || 0) + (w.jy || 0) : w.y;
    const p = toScreen(w.x, y + (b.rise ? k * 0.8 : 0), w.z, UI.W, UI.H);
    b.el.style.display = p.behind ? 'none' : 'block';
    b.el.style.left = p.x + 'px'; b.el.style.top = p.y + 'px';
    b.el.style.opacity = Math.min(1, (1 - k) * 4, k * 12);
    return true;
  });
}

/* ---------- 세워 놓은 그림 (소품) · 바닥에 눕힌 그림 ---------- */
function bill(src, x, z, h, o = {}){
  const t = loadTex(src);
  const mat = new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.25, side: THREE.DoubleSide, fog: true });
  mat.color.setScalar(o.tint || 0.9);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  const g = new THREE.Group(); g.add(m); g.position.set(x, (o.y || 0) + heightAt(G.map, x, z), z);
  G.scene.add(g); G.props.push(g);
  const b = { g, m, t, h, x, z, flat: !!o.flat, sized: false };
  if (o.flat) m.rotation.x = -Math.PI / 2;
  PRO.bills.push(b); return b;
}
function sizeBills(){
  for (const b of PRO.bills){
    if (!b.sized && b.t.image && b.t.image.width){ const w = b.h * b.t.image.width / b.t.image.height; b.m.scale.set(w, b.h, 1); b.m.position.y = b.flat ? 0.02 : b.h / 2; b.sized = true; }
    if (!b.flat) b.g.rotation.y = Math.atan2(camera.position.x - b.g.position.x, camera.position.z - b.g.position.z);
  }
}
// 빛나는 장비 표시: 바닥 고리 + 엷은 금빛 기둥 (창은 dropSpear가 같은 것을 만듦)
function glowAt(x, z){
  const g = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.4, 28), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.set(x, 0.03, z); g.add(ring);
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.16, 4, 10, 1, true), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  pillar.position.set(x, 2, z); g.add(pillar);
  const light = new THREE.PointLight(0xffd080, 0.7, 3.2, 1.6); light.position.set(x, 0.6, z); g.add(light);
  G.scene.add(g); G.props.push(g); PRO.glows.push({ g, pillar });
  return g;
}
// 떨어뜨리기: 3D 물체 (y를 위에서 0으로) 또는 인물 (lift를 위에서 0으로). 가속하며 떨어지고 닿으면 쿵
function fallObj(obj, from, delay, dur, at, onLand){ obj.position.y += from; PRO.fallers.push({ obj, from, base: obj.position.y - from, t0: G.t + delay, dur, at: at || obj.position, onLand }); }
function fallUnit(u, from, delay, dur, onLand){ u.lift = from; PRO.fallers.push({ unit: u, from, t0: G.t + delay, dur, onLand }); }
function updateFallers(){
  PRO.fallers = PRO.fallers.filter(f => {
    const k = clamp((G.t - f.t0) / f.dur, 0, 1), y = f.from * (1 - k * k);
    if (f.unit) f.unit.lift = y; else f.obj.position.y = f.base + y;
    if (k >= 1){
      const x = f.unit ? f.unit.x : f.at.x, z = f.unit ? f.unit.z : f.at.z;
      SFX.thump(f.unit ? 55 : 90, f.unit ? 0.7 : 0.35, 0.35); camShake(f.unit ? 0.4 : 0.12, 0.25); dust(x, z, f.unit ? 14 : 6);
      f.onLand && f.onLand(); return false;
    }
    return true;
  });
}

/* ---------- 정리 (clearLevel이 부름) ---------- */
function proClear(){
  PRO.bubbles.forEach(b => b.el.remove());
  Object.assign(PRO, { bills: [], fallers: [], bubbles: [], glows: [], motes: null, lamp: null, fly: null, collapse: null, crawl: null, fight: false, over: false, won: false, cave: null, pl: null });
  guide(''); mid(''); $p('dream').classList.remove('on');
  if (typeof hemi !== 'undefined' && hemi){ hemi.color.setHex(0x8fa6d8); hemi.groundColor.setHex(0x1a120d); }
}

/* ---------- 둥근 구덩이 ---------- */
function arenaRows(){ const N = 25, c = 12, R = 10, rows = []; for (let z = 0; z < N; z++){ let r = ''; for (let x = 0; x < N; x++) r += Math.hypot(x - c, z - c) <= R ? '.' : '#'; rows.push(r); } return rows; }
let floorTexP = null, rockTexP = null;
function arenaTextures(){
  if (floorTexP) return;
  floorTexP = canvasTex(1024, 1024, (c, w, h) => {
    c.fillStyle = '#1b191f'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++){ const v = rnd(16, 46) | 0; c.fillStyle = `rgba(${v + 8},${v + 5},${v + 12},${rnd(0.12, 0.45)})`; c.beginPath(); c.arc(Math.random() * w, Math.random() * h, rnd(2, 18), 0, 7); c.fill(); }
    c.strokeStyle = 'rgba(0,0,0,.55)'; c.lineWidth = 2;
    for (let i = 0; i < 46; i++){ let x = Math.random() * w, y = Math.random() * h; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 6; k++){ x += rnd(-40, 40); y += rnd(-40, 40); c.lineTo(x, y); } c.stroke(); }
    // 가운데 (빛이 떨어지는 자리)는 조금 밝고, 가장자리는 어둠
    const g = c.createRadialGradient(w / 2, h / 2, 30, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(130,140,170,0.16)'); g.addColorStop(0.55, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.85)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  });
  rockTexP = canvasTex(1024, 256, (c, w, h) => {
    c.fillStyle = '#17141b'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++){ const v = rnd(14, 40) | 0; c.fillStyle = `rgba(${v + 6},${v + 4},${v + 10},${rnd(0.2, 0.6)})`; c.fillRect(Math.random() * w, Math.random() * h, rnd(4, 26), rnd(10, 70)); }
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(0,0,0,.85)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  });
  rockTexP.wrapS = THREE.RepeatWrapping; rockTexP.repeat.set(4, 1);
}
function buildArena(){
  arenaTextures();
  loadLevel(arenaRows(), { bg: 0x030305, fogNear: 10, fogFar: 26, hemi: 0.15, moon: 0.05, floor: 0x24222a, wall: 0x141218 });
  const C = PRO.c = { x: 12, z: 12 }, R = 10;
  G.map.floorMesh.visible = false; G.map.wallMesh.visible = false;   // 칸 대신 둥근 바닥 · 둥근 벽
  const disk = new THREE.Mesh(new THREE.CircleGeometry(R + 0.7, 72), new THREE.MeshStandardMaterial({ map: floorTexP, roughness: 1 }));
  disk.rotation.x = -Math.PI / 2; disk.position.set(C.x, 0.002, C.z); disk.receiveShadow = true; G.map.group.add(disk);
  // 둥근 벽: 안쪽 면만 그림 → 카메라 쪽 벽은 저절로 안 보이고 건너편 벽만 보임
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.6, R + 1.2, 7, 72, 1, true), new THREE.MeshStandardMaterial({ map: rockTexP, color: 0x8a8090, roughness: 1, side: THREE.BackSide }));
  wall.position.set(C.x, 3.3, C.z); G.map.group.add(wall);
  // 위에서 떨어지는 희미한 빛 (구멍) + 빛기둥
  const spot = new THREE.SpotLight(0xb8c8ff, 2.4, 34, 0.36, 0.7, 1.1); spot.position.set(C.x, 18, C.z); spot.target.position.set(C.x, 0, C.z);
  G.map.group.add(spot); G.map.group.add(spot.target);
  const shaft = new THREE.Mesh(new THREE.ConeGeometry(3.4, 18, 40, 1, true), new THREE.MeshBasicMaterial({ color: 0x9fb4ff, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
  shaft.position.set(C.x, 9, C.z); G.map.group.add(shaft);
  // 가장자리 바위 몇 개 (어둠 속 윤곽)
  for (let i = 0; i < 14; i++){ const a = i / 14 * Math.PI * 2 + rnd(-0.1, 0.1), r = R - 0.4; bill(PA + (i % 2 ? 'rock2.webp' : 'rock3.webp'), C.x + Math.cos(a) * r, C.z + Math.sin(a) * r, rnd(0.6, 1.1), { tint: 0.55 }); }
  // 인주 곁 등불 (어둡지만 싸울 수는 있게)
  const lamp = new THREE.PointLight(0xffd9a8, 0.75, 6.5, 1.5); G.scene.add(lamp); G.props.push(lamp); PRO.lamp = lamp;
}
// 떨어진 것들: 돼지 · 시체 · 갑옷 (+ 빛나는 창 · 목걸이)
const DROPS = [['pig', -2.6, 2.6, 0.42], ['corpse1', 2.4, 1.5, 0.7], ['armor1', -1.3, 5.7, 0.72], ['corpse2', 3.5, 4.4, 0.42], ['armor2', 1.8, 6.5, 0.52], ['corpse3', -3.7, 0.7, 0.38], ['corpse1', -4.4, 4.6, 0.6]];
function placeDrops(fall){
  const C = PRO.c;
  DROPS.forEach(([k, dx, dz, h], i) => { const b = bill(PA + k + '.webp', C.x + dx, C.z + dz, h, { tint: 0.8 }); if (fall) fallObj(b.g, 22, 0.5 + i * 0.28, 0.8, { x: b.x, z: b.z }); });
  // 창 (어부의 창): 빛남. 걸어가면 주움
  dropSpear(C.x - 0.9, C.z + 2.4, 0.4);
  if (fall) fallObj(P.spearObj.m, 22, 1.2, 0.8, { x: P.spearObj.x, z: P.spearObj.z });
  // 목걸이 (황태자의 목걸이): 빛남. E로 주움
  if (!PRO.necklace){
    const nx = C.x + 1.6, nz = C.z + 3.0, b = bill(PA + 'necklace.webp', nx, nz, 0.42, { tint: 1.05 }), gl = glowAt(nx, nz);
    if (fall){ fallObj(b.g, 22, 1.5, 0.8, { x: nx, z: nz }); fallObj(gl, 22, 1.5, 0.8, { x: nx, z: nz }); }
    G.inspect.push({ x: nx, z: nz, r: 1.1, once: true, label: '빛나는 목걸이를 줍는다', mark: '빛나는 목걸이', fn: () => {
      PRO.necklace = true; G.scene.remove(b.g); G.scene.remove(gl);
      popText(G.player.x, G.player.y + 2.1, G.player.z, '황태자의 목걸이', 'heal', 1.4); SFX.clink(0.6);
    } });
  }
}
function spawnGob(x, z){
  const g = spawn('cheong', x, z, 'enemy'); g.aim = Math.PI / 2; g.face = 1;
  if (g.bar){ g.bar.remove(); g.bar = null; }   // 체력은 위쪽 큰 줄로
  return g;
}

/* ---------- 프롤로그 시작: 낙하 ---------- */
async function startPrologue(){
  clearLevel(); G.mode = 'prologue'; PRO.cursed = false; PRO.tries = 0; PRO.necklace = false;
  buildArena(); const C = PRO.c;
  G.lock = true; letterbox(true); dark(1, 0);
  P.spear = false;
  const pl = G.player = spawn('player', C.x + 0.4, C.z + 4.2, 'ally'); pl.face = 1;
  const gob = PRO.gob = spawnGob(C.x, C.z - 7.4);
  camSnapTo(C.x, C.z + 1.5); camWide(C.x, C.z + 1.8, 14, 12, 99);
  placeDrops(true);
  fallUnit(pl, 24, 2.3, 1.0, () => { pl.lying = true; SFX.boom(1.1); camShake(0.5, 0.4); flashScreen('#ffffff', 0.25); });
  await wait(0.5); dark(0, 2.6); SFX.whoosh();
  await wait(1.6); SFX.whoosh();
  await wait(2.4);
  caption('낙하', '빛도 닿지 않는 구덩이');
  await wait(1.6);
  // 일어남 → 둘러봄 (빛나는 것들)
  pl.lying = false; popText(pl.x, pl.y + 2, pl.z, '…', 'miss', 1.2);
  CAM.wide = null; camFocus(C.x, C.z + 3.2, 99, 4.2, 5.2, 0.04, false); await wait(2.0);
  // 어둠 속 무언가 → 줌인: 청광묵
  SFX.burst({ type: 'lowpass', f: 300, gain: 0.35, att: 0.2, dec: 0.9 });
  camFocus(gob.x, gob.z, 99, 1.9, 3.6, 0.025, false); await wait(2.6);
  await textbox('청광묵', ['…킁. 킁킁.', '고기. 고기 냄새.', '…떨어졌다. 고기가, 또.'], { face: FACE.cheong, tags: CHEONG_TAGS() });
  await roar();
  fightOn();
}
async function roar(){
  const gob = PRO.gob; setAim(gob, G.player.x, G.player.z);
  say(gob, '......크아아!!', 'big', 1.8); SFX.roar(1.2); camShake(0.4, 0.6); flashScreen('#3a0606', 0.35);
  await wait(1.1);
}
function fightOn(){
  camFocusOff(); CAM.wide = null; letterbox(false); G.lock = false;
  const gob = PRO.gob; gob.alert = true; G.boss = gob; G.bossFit = 0.35; gob.cd = PRO.tries ? 1.0 : 1.8; gob.cd2 = 0;
  $p('bossbar').hidden = false; $p('bossname').innerHTML = '청광묵 ' + CHEONG_TAGS(); $p('bossphase').textContent = '돌격에 닿으면 잡아먹힘 — 붉은 줄에서 비키기';
  G.onKill = u => { if (u === PRO.gob) proWin(u); };
  PRO.fight = true; PRO.over = false; PRO.won = false; PRO.hadSpear = P.spear; PRO.thrown = false;
  guide(P.spear ? '<em>우클릭</em>을 누르고 있다 놓으면 창을 던집니다' : '빛나는 <em>창</em>을 주우세요 — 가까이 걸어가면 주움', 6);
}

/* ---------- 청광묵: 이성 없이 돌격. 붉은 줄 (돌격 예고) → 닿으면 잡아먹음. 가까우면 할퀴기. 벽에 박으면 휘청 ---------- */
function cheongThink(u, dt){
  const pl = G.player; if (!pl || pl.downed || PRO.over) return;
  u.cd -= dt; u.cd2 = (u.cd2 || 0) - dt;
  if (u.st === 'hurt' || u.st === 'stun'){ u.stT -= dt; u.leanT = -0.12; if (u.stT <= 0) u.st = 'idle'; return; }
  if (u.st === 'windup') return;
  if (u.st === 'strike'){ u.stT -= dt; if (u.stT <= 0) u.st = 'idle'; return; }
  if (u.st === 'charge'){
    u.stT -= dt; const sp = 12.5, ox = u.x, oz = u.z;
    moveBy(u, Math.cos(u.chA) * sp * dt, Math.sin(u.chA) * sp * dt); dust(u.x, u.z, 1); u.leanT = 0.35; faceToward(u, Math.cos(u.chA), Math.sin(u.chA));
    if (Math.hypot(pl.x - u.x, pl.z - u.z) < u.r + pl.r + 0.3 && (pl.jy || 0) < 0.6){
      const front = Math.abs(angDiff(Math.atan2(u.z - pl.z, u.x - pl.x), pl.aim)) < 1.25;
      if (pl.guard && front && G.t - (pl.guardAt || -9) <= 0.2){   // 맞는 순간 방어 = 튕겨냄
        popText(pl.x, pl.y + 2, pl.z, '튕겨냄!', 'crit', 1); ring(pl.x, pl.z, 0x8fd8ff, 1.8, 0.35); spark(pl.x, pl.y + 1, pl.z, 0x8fd8ff, 18, 6);
        G.hitstop = 0.12; camShake(0.3, 0.2); u.st = 'stun'; u.stT = 1.6; say(u, '끅?!', 'soft', 1); return;
      }
      if (pl.inv > 0){ if (!u.dodged){ u.dodged = true; popText(pl.x, pl.y + 2, pl.z, '회피', 'miss'); } }
      else { proGrab(u); return; }
    }
    const moved = Math.hypot(u.x - ox, u.z - oz);
    if (moved < sp * dt * 0.35 && G.t - u.chAt > 0.12){   // 벽에 박음 → 길게 휘청 (때릴 기회)
      u.st = 'stun'; u.stT = 1.9; camShake(0.35, 0.3); SFX.boom(0.7); dust(u.x, u.z, 14);
      popText(u.x, u.y + 2.2, u.z, '쿵!', 'alert', 0.8); say(u, '끄으…', 'soft', 1.4); return;
    }
    if (u.stT <= 0){ u.st = 'stun'; u.stT = 0.8; say(u, '헉… 헉…', 'soft', 1); }
    return;
  }
  const d = dist(u, pl), ang = Math.atan2(pl.z - u.z, pl.x - u.x);
  u.moving = false;
  if (d < 1.9 && u.cd2 <= 0){   // 할퀴기
    u.cd2 = 1.5; setAim(u, pl.x, pl.z);
    windup(u, 'sector', { x: u.x, z: u.z, r: 1.75, a: ang, arc: 1.7, windup: 0.42 }, t => hurt(u, t, u.atk, { kb: 1.0, from: u }));
    return;
  }
  if (u.cd <= 0 && d > 2.2 && d < 12){   // 돌격 예고: 붉은 줄
    const first = !PRO.sawCharge, len = Math.min(13, d + 3);
    setAim(u, pl.x, pl.z); u.cd = rnd(2.3, 3.3); u.dodged = false;
    windup(u, 'line', { x: u.x, z: u.z, len, w: 1.15, a: ang, windup: first ? 1.3 : 0.8 }, () => {});
    u.decal.onDone = dd => { u.decal = null; if (u.dead || u.st !== 'windup') return; u.st = 'charge'; u.chA = dd.a; u.stT = len / 12.5; u.chAt = G.t; say(u, '크아아!', 'big', 0.7); SFX.roar(0.5); };
    say(u, '그르르…', 'soft', 0.9);
    if (first){ PRO.sawCharge = true; guide('<em>Q</em>로 회피할 수 있습니다! — 붉은 줄에서 옆으로', 4); }
    return;
  }
  if (d > 2.4) navTo(u, pl.x, pl.z, u.spd, dt, 1.5); else setAim(u, pl.x, pl.z);
}

/* ---------- 잡아먹힘 → 다시 ---------- */
function proEaten(){ if (!PRO.over && PRO.gob) proGrab(PRO.gob); }
async function proGrab(u){
  if (PRO.over || PRO.won) return; PRO.over = true; PRO.fight = false;
  const pl = G.player; G.lock = true; letterbox(true); guide('');
  for (const d of G.decals) d.done = true;
  u.st = 'idle'; u.x = lerp(u.x, pl.x, 0.7); u.z = lerp(u.z, pl.z, 0.7); u.lift = 0.4;
  G.slow = 0.35; say(u, '크아악!!', 'big', 1.4); camShake(0.6, 0.6); SFX.roar(1.3); SFX.boom(1.0); $p('redflash').style.opacity = 0.85;
  camFocus(pl.x, pl.z, 99, 1.9, 3.0, 0.08, false);
  await wait(0.45); G.slow = 1; pl.lying = true; u.lift = 0;
  dark(1, 1.6); await wait(1.8);
  await textbox('', ['콰득.', '…먹혔다.'], { hold: 1.2 });
  restartFight();
}
async function restartFight(){
  const neck = PRO.necklace, tries = PRO.tries + 1;
  clearLevel(); G.mode = 'prologue'; PRO.cursed = false; PRO.tries = tries; PRO.necklace = neck;
  buildArena(); const C = PRO.c;
  P.spear = false;
  const pl = G.player = spawn('player', C.x + 0.4, C.z + 4.2, 'ally'); pl.face = 1;
  PRO.gob = spawnGob(C.x, C.z - 6.8);
  placeDrops(false);
  G.lock = true; camSnapTo(C.x, C.z + 1); dark(0, 1.2);
  caption('다시', '청광묵과 맞짱');
  await wait(1.2); await roar(); fightOn();
}

/* ---------- 이김: 슬로모션 완벽 투척 → 끄아아 → 무너짐 → 주저앉음 → 기어감 → 암전 → 캉캉 → 굴 ---------- */
function spearModel(){
  const g = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ color: 0xd8eeff });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6), mat); shaft.rotation.z = Math.PI / 2; g.add(shaft);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.24, 8), mat); tip.rotation.z = -Math.PI / 2; tip.position.x = 0.85; g.add(tip);
  return g;
}
async function proWin(u){
  if (PRO.won) return; PRO.won = true; PRO.fight = false;
  u.dead = false; u.hp = 1; u.st = 'idle'; interrupt(u); u.alert = false;
  const pl = G.player; G.lock = true; letterbox(true); guide(''); $p('bossbar').hidden = true;
  for (const d of G.decals) d.done = true;
  for (const g of PRO.glows) g.g.visible = false;   // 빛기둥이 옆 카메라를 가리지 않게
  let d = dist(pl, u); if (d < 4.2){ const a = Math.atan2(u.z - pl.z, u.x - pl.x); moveBy(u, Math.cos(a) * (4.6 - d), Math.sin(a) * (4.6 - d)); }
  setAim(pl, u.x, u.z); setAim(u, pl.x, pl.z); pl.st = 'idle'; P.aiming = false; P.spear = true;
  // 슬로모션: 옆에서 낮게
  G.slow = 0.3; camSide(pl, u, 3.2, 1.0);
  setPose(pl, 'aim'); await wait(0.42);
  setPose(pl, 'throw'); popText(pl.x, pl.y + 2.3, pl.z, '완벽!', 'crit', 1.4); ring(pl.x, pl.z, 0x5ab4ff, 2.2, 0.4); SFX.whoosh();
  const sp = spearModel(); G.scene.add(sp); G.props.push(sp);
  const from = { x: pl.x, y: pl.y + 1.3, z: pl.z }, to = { x: u.x, y: u.y + bodyH(u) * 0.86, z: u.z };
  sp.rotation.y = -Math.atan2(to.z - from.z, to.x - from.x);
  PRO.fly = { m: sp, from, to, t0: G.t, dur: 0.3, done: false };
  await waitUntil(() => PRO.fly.done);
  // 파악! 대사 & 진동
  G.scene.remove(sp); G.slow = 1; G.hitstop = 0.16; CAM.sideUntil = -1;
  flashScreen('#ffffff', 0.9); camShake(0.75, 0.7); SFX.boom(1.5); SFX.hit(); SFX.roar(1.4);
  spark(to.x, to.y, to.z, 0x9fd0ff, 34, 7); spark(to.x, to.y, to.z, 0xff6a5a, 14, 5); u.flash = 1;
  const stuck = spearModel(); stuck.children.forEach(c => { c.material = c.material.clone(); c.material.color.setHex(0xc8b8a0); });
  stuck.position.set(-0.32 * u.face, SPR.cheong.tall * SPRITE_SCALE * 0.9, 0.06); stuck.rotation.z = -0.5 * u.face; stuck.rotation.y = u.face > 0 ? Math.PI : 0;
  u.pivot.add(stuck);
  say(u, '끄아아아아아아아!!!!!!!!!!!!!!', 'big', 2.8);
  PRO.cursed = true;
  // 3초 동안 천천히 무너짐
  PRO.collapse = { u, t0: G.t, dur: 3 };
  camFocus(lerp(pl.x, u.x, 0.62), lerp(pl.z, u.z, 0.62), 99, 3.8, 7.4, 0.03, false);   // 둘 다 보이게 (인주가 글상자에 가리지 않게)
  await wait(3.0);
  // 털썩
  pl.sit = true; setPose(pl, 'idle'); SFX.thump(70, 0.4, 0.3); dust(pl.x, pl.z, 8); dark(0.35, 2.5);
  await textbox('인주', ['아. 아아..!!'], { hold: 3 });
  // 버둥대며 기어감
  PRO.crawl = { u, a: Math.atan2(u.z - pl.z, u.x - pl.x) }; dark(0.72, 3);
  await textbox('청광묵', ['흐윽....끄아아...'], { hold: 3, face: FACE.cheong });
  // 깜깜
  dark(1, 0.6); await wait(0.8); PRO.crawl = null;
  await textbox('', ['.......'], { hold: 3 });
  await wait(1.2);
  SFX.clink(); mid('캉!'); await wait(0.75); SFX.clink(0.8); mid('캉! 캉'); await wait(3.0); mid('');
  startCave(true);
}

/* ---------- 굴 (몽환): 카리우스는 굴을 파고, 흉터 남은 청광묵은 인광달팽이를 돌보고, 레베카는 벽에 머리만 내밀고 잠 ---------- */
const CAVE = [
  '##################',
  '##########GG######',
  '#....K...........#',
  '#B...............#',
  '#..........S.....#',
  '#.......P......S.#',
  '#...........C....#',
  '#..............S.#',
  '#................#',
  '##################'];
let mossTex = null;
function moss(x, z, r, color){
  if (!mossTex) mossTex = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(0.5, 'rgba(255,255,255,.25)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: mossTex, color, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, 0.015, z); G.scene.add(m); G.props.push(m);
}
function makeMotes(w, h){
  const N = 170, pos = new Float32Array(N * 3), seed = [];
  for (let i = 0; i < N; i++){ seed.push({ x: rnd(1, w - 2), z: rnd(1.5, h - 2), y: rnd(0.2, 3.2), p: rnd(0, 6.3), s: rnd(0.15, 0.4) }); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.11, map: sparkTex, color: 0xc8b0ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
  pts.frustumCulled = false; G.scene.add(pts); G.props.push(pts);
  PRO.motes = { pts, seed, pos, geo };
}
async function startCave(cine = false){
  clearLevel(); G.mode = 'cave'; PRO.cursed = true;
  const sp = loadLevel(CAVE, { bg: 0x110c1c, fogNear: 12, fogFar: 28, hemi: 0.45, moon: 0.12, floor: 0x3b3448, wall: 0x261f33,
    lights: [{ x: 13.5, z: 5.5, c: 0x5fffd8, i: 1.5, d: 6.5 }, { x: 5, z: 2.4, c: 0xffb070, i: 1.3, d: 6 }, { x: 2, z: 3.2, c: 0xc8a0ff, i: 0.9, d: 5 }, { x: 8, z: 6, c: 0x9f8cff, i: 0.6, d: 9 }] });
  hemi.color.setHex(0xb8a0ff); hemi.groundColor.setHex(0x1a1030);
  $p('dream').classList.add('on');
  const p = sp('P')[0], K = sp('K')[0], Cc = sp('C')[0], B = sp('B')[0];
  P.spear = true;
  const pl = G.player = spawn('player', p.x, p.z, 'ally');
  const ka = spawn('karius', K.x, K.z, 'neutral'); ka.face = -1;
  const ch = spawn('cheongNpc', Cc.x, Cc.z, 'neutral'); ch.face = 1;
  const snails = sp('S').map(s => { const n = spawn('snail', s.x, s.z, 'neutral'); if (n.tag){ n.tag.remove(); n.tag = null; } n.face = Math.random() < 0.5 ? 1 : -1; return n; });
  PRO.cave = { ka, ch, snails, B, K, digT: 1, cuteT: 4, zzzT: 1.5 };
  // 벽에 머리만 내민 레베카 (얼굴은 하늘을 봄) + 둘레 돌
  bill(PA + 'rebecca_head.webp', B.x - 0.4, B.z, 0.62, { y: 0.02, tint: 0.95 });
  bill(PA + 'rock3.webp', B.x - 0.3, B.z + 0.32, 0.36, { tint: 0.7 });
  // 소품을 이어 붙여 꾸밈 (도감 에셋): 버섯 · 바위 · 상자 · 등불 · 물그릇 · 통나무 · 풀
  [['mush1', 14.6, 2.4, 1.2], ['mush2', 2.3, 7.6, 1.5], ['mush3', 16.3, 8.0, 1.4], ['mush4', 9.3, 8.3, 0.9], ['rock1', 3.2, 2.3, 0.9], ['crates', 16.0, 2.5, 1.0],
   ['lantern', 5.6, 1.6, 1.1], ['basin', 14.0, 5.2, 0.6], ['log', 6.6, 8.0, 0.6], ['grass', 11.6, 8.3, 0.8], ['pillars', 1.8, 5.8, 0.9], ['pick', 6.1, 2.6, 0.42], ['grass', 3.8, 8.4, 0.7]]
    .forEach(([k, x, z, h]) => bill(PA + k + '.webp', x, z, h));
  // 발광 이끼 (바닥에 번지는 빛)
  [[13.6, 5.6, 2.4, 0x5fffd8], [4.2, 7.4, 1.6, 0x9f7cff], [9.5, 3.4, 1.4, 0x7fd8ff], [15.6, 7.6, 1.5, 0x5fffd8], [2.2, 3.4, 1.2, 0xc8a0ff], [7.5, 6.2, 1.8, 0x8f7cff]]
    .forEach(([x, z, r, c]) => moss(x, z, r, c));
  makeMotes(G.map.w, G.map.h);
  // 말 걸기
  const talk = (u, who, lines, o) => G.inspect.push({ unit: u, r: 1.7, label: `${who}에게 말을 건다`, fn: async () => { u.face = Math.sign(G.player.x - u.x) || u.face; camFocus(u.x, u.z, 99, 3.0, 4.4, 0.05); await textbox(who, lines, o); camFocusOff(); } });
  talk(ka, '카리우스', ['...캉. 캉.'], { face: FACE.karius });
  G.inspect.push({ unit: ch, r: 1.7, label: '청광묵에게 말을 건다', fn: async () => { ch.face = Math.sign(G.player.x - ch.x) || ch.face; camFocus(ch.x, ch.z, 99, 3.0, 4.4, 0.05);
    await textbox('청광묵', ['대장! 아직 먹으면 안된다! 알! 낳아야한다!'], { face: FACE.cheong, tags: CHEONG_TAGS() }); camFocusOff(); } });
  G.inspect.push({ x: B.x, z: B.z, r: 1.6, label: '레베카에게 말을 건다', fn: async () => { camFocus(B.x, B.z, 99, 2.4, 3.4, 0.05); await textbox('레베카', ['...음냐..음냐...', '(자고 있는 모양이다)']); camFocusOff(); } });
  G.inspect.push({ unit: snails[0], r: 1.6, label: '인광달팽이를 본다', fn: async () => { await textbox('', ['인광달팽이. 껍데기에서 청록빛이 은은하게 번진다.', '…알을 낳을 때까지는 먹으면 안 된다고 한다.']); } });
  const gx = G.map.gate ? G.map.gate.x : 10.5;
  G.inspect.push({ x: gx, z: 1.9, r: 1.6, label: '석문을 연다 — 아래로 (시제품 1층)', fn: descend });
  if (!cine){ camSnapTo(p.x, p.z + 2); caption('굴', '떨어진 자들이 사는 곳'); return; }
  // 화면이 점점 밝아지며 굴. 카리우스 → 청광묵 → 움직이기 가능
  pl.lying = true; G.lock = true; letterbox(true); dark(1, 0);
  camSnapTo(K.x, K.z + 2.5); camWide(K.x + 0.6, K.z + 1.2, 5.5, 6.5, 99);
  await wait(0.3); dark(0, 3.4); await wait(3.6);
  await textbox('카리우스', ['.....'], { face: FACE.karius, hold: 1.2 });
  await textbox('', ['(굴을 파는 중이다)']);
  camWide(Cc.x, Cc.z, 4.6, 6, 99); await wait(1.8);
  await textbox('', ['(청광묵의 왼눈에 흉터가 남아 있다)']);
  await textbox('청광묵', ['대장! 일어났나!'], { face: FACE.cheong, tags: CHEONG_TAGS() });
  pl.lying = false; CAM.wide = null; letterbox(false); G.lock = false;
  caption('굴', '떨어진 자들이 사는 곳');
  guide('<em>WASD</em> 움직이기 · <em>E</em> 말 걸기', 5);
}

/* ---------- 매 프레임 (글상자가 떠 있어도 돎) ---------- */
function proTick(dt){
  if (!PRO.bills.length && !PRO.bubbles.length && G.mode !== 'prologue' && G.mode !== 'cave') return;
  sizeBills(); updateFallers(); updateBubbles();
  for (const g of PRO.glows) g.pillar.material.opacity = 0.18 + 0.14 * (0.5 + 0.5 * Math.sin(G.t * 4));
  const pl = G.player;
  if (PRO.lamp && pl) PRO.lamp.position.set(pl.x, pl.y + 1.7 + (pl.lift || 0), pl.z + 0.4);
  if (G.mode === 'prologue'){
    // 안내: 창을 처음 주웠을 때 · 처음 던졌을 때
    if (PRO.fight && !PRO.hadSpear && P.spear){ PRO.hadSpear = true; guide('<em>우클릭</em>을 누르고 있다 놓으면 창을 던집니다 · <em>좌클릭</em> 찌르기', 6); }
    if (PRO.fight && PRO.hadSpear && !P.spear && !PRO.thrown){ PRO.thrown = true; setTimeout(() => { if (PRO.fight) guide('게이지가 <em>하얗게</em> 빛나는 순간 놓으면 <em>완벽</em>! 던진 창은 다시 주워야 함', 5); }, 900); }
    // 이긴 뒤: 날아가던 창 · 땅에 떨어진 창은 치움 (컷신의 창만 남김)
    if (PRO.won){ for (const p of G.projs) G.scene.remove(p.m); G.projs.length = 0; if (P.spearObj){ G.scene.remove(P.spearObj.m); P.spearObj = null; } }
    const F = PRO.fly;
    if (F && !F.done){
      const k = clamp((G.t - F.t0) / F.dur, 0, 1);
      F.m.position.set(lerp(F.from.x, F.to.x, k), lerp(F.from.y, F.to.y, k) + Math.sin(k * Math.PI) * 0.15, lerp(F.from.z, F.to.z, k));
      dot(F.m.position.x, F.m.position.y, F.m.position.z, 0x5ab4ff, 0.2, 1.2);
      if (k >= 1) F.done = true;
    }
    const Cl = PRO.collapse;
    if (Cl){ const k = clamp((G.t - Cl.t0) / Cl.dur, 0, 1), e = k * k * (3 - 2 * k); Cl.u.tiltOverride = Math.PI / 2 * 0.92 * -Cl.u.face * e; Cl.u.leanT = 0; if (k < 1 && Math.random() < dt * 6) dust(Cl.u.x, Cl.u.z, 2); }
    const Cr = PRO.crawl;
    if (Cr){ const u = Cr.u; moveBy(u, Math.cos(Cr.a) * 0.3 * dt, Math.sin(Cr.a) * 0.3 * dt); u.tiltOverride = Math.PI / 2 * 0.92 * -u.face + Math.sin(G.t * 11) * 0.06; if (Math.random() < dt * 3) dust(u.x, u.z, 1); }
  }
  const Cv = PRO.cave;
  if (G.mode === 'cave' && Cv){
    // 카리우스: 캉. 캉. (굴을 팜)
    Cv.digT -= dt; if (Cv.digT <= 0){ Cv.digT = 1.35; const k = Cv.ka; k.leanT = 0.22; SFX.clink(0.35); spark(k.x - 0.5, 1.3, k.z - 0.7, 0xffe0b0, 6, 2.5, 0.12, 0.25); say(k, '캉', 'soft', 0.7); }
    // 청광묵: 달팽이를 보며 가끔 "아우.... 귀여워!"
    Cv.cuteT -= dt; if (Cv.cuteT <= 0){ Cv.cuteT = rnd(6, 9); const s = Cv.snails[0]; if (s) Cv.ch.face = Math.sign(s.x - Cv.ch.x) || 1; say(Cv.ch, '아우.... 귀여워!', 'soft', 2.4); }
    // 레베카: zzz
    Cv.zzzT -= dt; if (Cv.zzzT <= 0){ Cv.zzzT = 2.4; say({ x: Cv.B.x - 0.3, y: 0.75, z: Cv.B.z }, 'z z z…', 'zzz', 2.2); }
    // 달팽이: 집 근처를 아주 천천히 기어다님
    if (!G.waitInput) for (const s of Cv.snails){
      s.wT = (s.wT || 0) - dt;
      if (s.wT <= 0){ s.wT = rnd(3, 6); const a = rnd(0, 6.3); s.goal = { x: s.home.x + Math.cos(a) * 1.1, z: s.home.z + Math.sin(a) * 1.1 }; }
      if (s.goal && Math.hypot(s.goal.x - s.x, s.goal.z - s.z) > 0.1){ const n = norm(s.goal.x - s.x, s.goal.z - s.z); moveBy(s, n.x * 0.28 * dt, n.z * 0.28 * dt); faceToward(s, n.x, n.z); }
    }
  }
  const M = PRO.motes;
  if (M){ M.seed.forEach((m, i) => { const t = G.t * m.s + m.p; M.pos[i * 3] = m.x + Math.sin(t) * 0.6; M.pos[i * 3 + 1] = m.y + Math.sin(t * 0.7) * 0.4; M.pos[i * 3 + 2] = m.z + Math.cos(t * 0.8) * 0.6; }); M.geo.attributes.position.needsUpdate = true; M.pts.material.opacity = 0.55 + 0.25 * Math.sin(G.t * 0.8); }
}
