/* prologue.js v0.112 — (v0.112: 굴에 대련 더미) (v0.111: 밤에 잠든 자세 · 로비 패배는 뻗은 자세) 프롤로그 (PROLOGUE.md v1.1 대본)
   낙하 (돼지 · 시체 · 갑옷과 함께) → 어둠 속 청광묵 (줌인 · 초상화 · 말풍선 "크아아!!") → 맞짱 (튜토리얼)
   → 이기면 컷신 (슬로모션 완벽 투척 · 끄아아 · 3초 무너짐 · 주저앉음 · 기어감 · 암전 · 캉캉) → 몽환적인 굴
   전투 규칙은 1층과 같음 (예고 장판 · 투창 · 구르기 · 방어). 맵 (둥근 구덩이) · 카메라 연출만 따로
   청광묵에게 잡히면 (돌격에 닿으면) 바로 먹힘 = 게임 오버 → 맞짱부터 다시 */
'use strict';
const PA = 'art/pro/';
SPR.cheong = { h0: 512, tall: 1.3, poses: { idle: { src: PA + 'goblin.webp', w: 205, h: 512, ax: 102, ay: 510, f: 1 } } };
// 카리우스: 2D판 그림 (drawKarius)을 프레임별로 뜬 시트 (8 x 8칸, 한 칸 180 x 160). 줄: 대기 · 걷기 · 굴 파기 · 두 번 치기 · 노인의 팔 쓸기 · 잡아찢기 · 내려찍기 (불경자) · 불경자 대기
const kp = (row, fps, once = false) => ({ src: PA + 'karius2d.webp', w: 180, h: 160, cols: 8, rows: 8, n: 64, from: row * 8, count: 8, fps, ax: 90, ay: 156, f: 1, once });
SPR.karius = { h0: 94, tall: 2.4, poses: { idle: kp(0, 2.2), walk: kp(1, 9), dig: kp(2, 7), punch: kp(3, 16, true), sweep: kp(4, 7, true), grab: kp(5, 5.7, true), slam: kp(6, 7, true), heretic: kp(7, 2.2) } };
SPR.snail = { h0: 342, tall: 0.24, poses: { idle: { src: PA + 'snail.webp', w: 512, h: 342, ax: 256, ay: 336, f: 1 } } };
DEFS.cheong = { spr: 'cheong', name: '청광묵', hp: 220, atk: 18, spd: 2.8, r: 0.34, weight: 60, think: cheongThink };
DEFS.cheongNpc = { spr: 'cheong', name: '청광묵', hp: 100, atk: 0, spd: 0, r: 0.34, weight: 60 };
DEFS.karius = { spr: 'karius', name: '카리우스', hp: 300, atk: 0, spd: 0, r: 0.4, weight: 200 };
DEFS.snail = { spr: 'snail', name: '인광달팽이', hp: 40, atk: 0, spd: 0.3, r: 0.16, weight: 20, hittable: true };   // 손바닥만 한 귀여운 달팽이

// 특성 태그 (사각형 색 태그): 등급 S ~ F 색 · 저주는 보라
const TAG = (txt, cls) => `<span class="tag ${cls}">${txt}</span>`;
const CHEONG_TAGS = () => (PRO.cursed ? TAG('저주: 실명 · 좌안', 'curse') : '') + TAG('발화 A', 'gA');
const FACE = { cheong: PA + 'goblin_face.webp', karius: PA + 'karius_face.webp' };

const PRO = { bills: [], fallers: [], bubbles: [], motes: null, glows: [], cursed: false, gob: null, tries: 0, store: [], trash: [], buried: 0, day: 1, didBury: false, pigData: [], pigs: [], eggs: [], babies: 0, eggBills: [], meal: { inju: { fed: false, hd: 0 }, ch: { fed: false, hd: 0 }, ka: { fed: false, hd: 0 } }, hpf: { ch: 1, ka: 1 }, fireLit: true, wood: 30, snailLost: 0, penFood: 4, snailHd: 0, ap: 10, dig: 0, jrDone: false, rebOut: false, rebDig: 0, equip: { weapon: null, armor: null }, placed: [] };

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
  if (PRO.cave && (who === PRO.cave.ch || who === PRO.cave.ka) && text.replace(/[.…!?\s]/g, '').length >= 3) barTalk(who === PRO.cave.ch ? '청광묵' : '카리우스', text, life + 1.5);
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
  const b = { g, m, t, h, x, z, flat: !!o.flat, sized: false, fit: o.fit || 0, lie: o.lie || 0 };
  if (o.flat) m.rotation.x = -Math.PI / 2;
  PRO.bills.push(b); return b;
}
function sizeBills(){
  for (const b of PRO.bills){
    if (!b.sized && b.t.image && b.t.image.width){
      const r = b.t.image.width / b.t.image.height; let h = b.h, w = h * r;
      if (b.fit && w > b.fit){ w = b.fit; h = w / r; }   // 한 칸 폭을 넘지 않게
      b.m.scale.set(w, h, 1); b.m.position.y = b.flat ? 0.02 : h / 2; b.sized = true;
      if (b.lie){ b.m.rotation.z = b.lie * Math.PI / 2 * 0.94; b.m.position.y = w / 2 * 0.9 + 0.01; }   // 옆으로 누운 시체: 바닥에 닿게
    }
    // v0.2: 소품은 카메라 쪽 (각도)만 봄 → 카메라가 돌지 않는 한 그대로 서 있음 (따라 돌지 않음)
    if (!b.flat) b.g.rotation.y = CAM.yaw;
  }
}
// 벽에 붙이는 그림: 벽 앞면에 납작한 판 (남쪽을 봄). 소품처럼 돌지 않음
function wallSprite(src, x, z, w, h, tint = 1){
  const mat = new THREE.MeshBasicMaterial({ map: loadTex(src), transparent: true, alphaTest: 0.25, fog: true });
  mat.color.setScalar(tint);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.set(x, h / 2 - 0.02, z);
  G.scene.add(m); G.props.push(m); return m;
}
// 한 칸을 차지하는 소품: 칸 가운데에 세우고, 그 칸은 막힘 (지나갈 수 없음)
function tileProp(src, i, j, h, o = {}){
  const b = bill(src, i, j, h, { fit: 0.92, ...o });
  G.map.solid[j * G.map.w + i] = 1; G.map.nav = {};
  return b;
}
// 장면마다 카메라 높이 · 거리 (굴은 낮게: 오딜방처럼 옆에서 보는 느낌)
const CAM_DEF = { base: { ...CAM.base }, look: { ...CAM.look } };
function camPreset(base, look){ Object.assign(CAM.base, base || CAM_DEF.base); Object.assign(CAM.look, look || CAM_DEF.look); }
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
  Object.assign(PRO, { bills: [], fallers: [], bubbles: [], glows: [], motes: null, lamp: null, shaft: null, flies: [], stage: null, pigs: [], blizzard: null, eggBills: [], loose: [], carry: null, storeBills: [], trashBills: [], idleT: 0, fly: null, collapse: null, crawl: null, fight: false, over: false, won: false, cave: null, pl: null, bar: null, woodBill: null, stains: [], bossCam: false });
  guide(''); mid(''); $p('dream').classList.remove('on');
  for (const el of Object.values(PRO.todoEls || {})) el.remove(); PRO.todoEls = {}; if (PRO.menu) closeStore();
  camPreset(); if (camera.view && camera.view.enabled) camera.clearViewOffset(); PRO.barH = PRO.barHs = 0; if (camera.fov !== 40){ camera.fov = 40; camera.updateProjectionMatrix(); } PRO.pen = null;
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
// 둥근 로비: 타일로 만든 원 (반지름 6.4). 정면 (북쪽)은 굴 — 카리우스가 파는 굴길, 끝에 석문
const LOBBY_C = { x: 9, z: 10 };
function lobbyRows(){
  const W = 19, H = 18, g = [];
  for (let z = 0; z < H; z++){ const r = []; for (let x = 0; x < W; x++) r.push(Math.hypot(x - LOBBY_C.x, z - LOBBY_C.z) <= 6.4 || (x >= 8 && x <= 10 && z >= 2 && z <= 4) ? '.' : '#'); g.push(r); }
  // 굴 끝 (1, 9)은 벽: 그 앞에 높이 5칸 (약 5m) 석문 그림을 세움 (막혀 있음)
  for (const [c, x, z] of [['P', 9, 11], ['K', 8, 2], ['C', 11, 10], ['S', 13, 9], ['S', 13, 11], ['S', 14, 11], ['B', 3, 10], ['f', FIRE.x, FIRE.z]]) g[z][x] = c;
  return g.map(r => r.join(''));
}
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
  const sp = loadLevel(lobbyRows(), { bg: 0x110c1c, fogNear: 12, fogFar: 28, hemi: 0.45, moon: 0.12, floor: 0x3b3448, wall: 0x261f33,
    lights: [{ x: 13.2, z: 10.5, c: 0x5fffd8, i: 1.5, d: 6.5 }, { x: 8.5, z: 3, c: 0xffb070, i: 1.3, d: 6 }, { x: 3.6, z: 10, c: 0xc8a0ff, i: 0.9, d: 5 }, { x: 9, z: 10, c: 0x9f8cff, i: 0.7, d: 10 }] });
  hemi.color.setHex(0xb8a0ff); hemi.groundColor.setHex(0x1a1030);
  camPreset({ y: 8.4, back: 12.8 }, { y: 0.6, fwd: 0.6 });   // 로비 한눈에: 가운데를 고정해서 봄 (인주를 따라가지 않음)
  G.camAnchor = { x: LOBBY_C.x, z: LOBBY_C.z - 0.4, k: 0.12, sway: 0.18 };   // 아주 살짝만 움직임
  camera.fov = CAVE_CAM.fov; camera.updateProjectionMatrix(); fitCaveCam();
  G.map.wallH = 3.2; G.map.round = LOBBY_C; layoutWalls(G.map, CAM.yawT);
  $p('dream').classList.add('on');
  const p = sp('P')[0], K = sp('K')[0], Cc = sp('C')[0], B = sp('B')[0];
  P.spear = true;
  const pl = G.player = spawn('player', p.x, p.z, 'ally'); applyEquip(true);
  const ka = spawn('karius', K.x, K.z, 'neutral'); ka.face = -1;
  const ch = spawn('cheongNpc', Cc.x, Cc.z, 'neutral'); ch.face = 1;
  const snails = sp('S').map(s => { const n = spawn('snail', s.x, s.z, 'neutral'); if (n.tag){ n.tag.remove(); n.tag = null; } n.face = Math.random() < 0.5 ? 1 : -1; return n; });
  snails.splice(0, Math.min(PRO.snailLost, snails.length)).forEach(removeUnit);
  if (typeof sparSpawn === 'function') sparSpawn();   // v0.40 대련 더미 (격투 연습)
  PRO.cave = { ka, ch, snails, B, K, digT: 1, cuteT: 4, zzzT: 1.5, dropT: 30, dropped: PRO.dropDay === PRO.day };   // v0.30: 원정에서 돌아와도 오늘의 낙하는 한 번
  if (!PRO.weather) PRO.weather = rollWeather();
  PRO.pigs = [];
  buildStage(); applyWeather();
  // 벽에 머리만 내민 레베카 (얼굴은 하늘을 봄) + 둘레 돌
  if (!PRO.rebOut) PRO.rebHead = tileProp(PA + 'rebecca_head.webp', B.x, B.z, 0.62, { y: 0.02, tint: 0.95 }); else G.map.solid[B.z * G.map.w + B.x] = 1;
  // 소품 (도감 에셋): 하나가 한 칸씩 (칸 가운데, 칸 폭 안). 버섯 · 바위 · 상자 · 등불 · 곡괭이 · 물그릇 · 통나무 · 풀 · 흰 바위
  [['mush1', 5, 6, 1.2], ['crates', 13, 6, 1.0], ['rock1', 4, 8, 0.9], ['pick', 10, 2, 0.45], ['lantern', 7, 4, 1.1], ['basin', 14, 9, 0.5],
   ['pillars', 4, 13, 0.9], ['mush2', 6, 15, 1.4], ['grass', 8, 16, 0.7], ['log', 11, 16, 0.6], ['mush4', 12, 15, 0.9], ['grass', 5, 14, 0.8], ['mush3', 3, 12, 1.3]]
    .forEach(([k, i, j, h]) => tileProp(PA + k + '.webp', i, j, h));
  buildPen(12, 8, 15, 12);
  restoreLivestock();
  // 발광 이끼 (바닥에 번지는 빛)
  [[13.4, 10.6, 2.2, 0x5fffd8], [5, 13.6, 1.6, 0x9f7cff], [9, 3.4, 1.3, 0x7fd8ff], [6.2, 7, 1.4, 0x5fffd8], [3.8, 10.2, 1.2, 0xc8a0ff], [9, 10, 2.4, 0x8f7cff]]
    .forEach(([x, z, r, c]) => moss(x, z, r, c));
  makeMotes(G.map.w, G.map.h);
  // 말 걸기
  const talk = (u, who, lines, o) => G.inspect.push({ unit: u, r: 1.7, talk: true, label: `${who}에게 말을 건다`, fn: async () => { u.face = Math.sign(G.player.x - u.x) || u.face; camFocus(u.x, u.z, 99, ...lens(3.0, 4.4), 0.05); await textbox(who, lines, o); camFocusOff(); } });
  talk(ka, '카리우스', ['...캉. 캉.'], { face: FACE.karius });
  G.inspect.push({ unit: ch, r: 1.7, talk: true, label: '청광묵에게 말을 건다', fn: async () => { ch.face = Math.sign(G.player.x - ch.x) || ch.face; camFocus(ch.x, ch.z, 99, ...lens(3.0, 4.4), 0.05);
    await textbox('청광묵', ['대장! 아직 먹으면 안된다! 알! 낳아야한다!'], { face: FACE.cheong, tags: CHEONG_TAGS() }); camFocusOff(); } });
  if (!PRO.rebOut) G.inspect.push({ x: B.x, z: B.z, r: 1.6, mark: '레베카', far: 5, get used(){ return PRO.rebOut; }, set used(v){}, get label(){ return `벽을 파서 레베카를 꺼낸다 (${PRO.rebDig}/3${apTag()})`; }, fn: digRebecca });
  if (PRO.rebOut) spawnRebecca(B.x + 1, B.z);
  G.inspect.push({ unit: snails[0], r: 1.6, talk: true, label: '인광달팽이를 본다', fn: async () => { await textbox('', ['인광달팽이. 껍데기에서 청록빛이 은은하게 번진다.', '…알을 낳을 때까지는 먹으면 안 된다고 한다.']); } });
  // 석문: 높이 5m쯤 되는 엄청 단단한 문. 지금은 막혀 있음
  // 굴 끝 벽 (z = 1)의 앞면 (z = 1.5)에 납작하게 붙임: 카메라를 따라 돌지 않고 벽 앞에 딱 (굴 폭 3칸 = 문 폭, 높이 약 4.6)
  wallSprite(PA + 'stonedoor.webp', 9, 1.5 + 0.02, 3.0, 4.6, 0.85);
  G.inspect.push({ x: 9, z: 2.5, r: 1.6, mark: '석문', far: 16, get label(){ return doorLabel(); }, fn: doorAction });
  buildRubble();
  buildStorage(); buildFire(); caveBarInit(); restorePlaced();
  G.inspect.push({ x: 12, z: 10, r: 1.3, mark: '우리', far: 0.1, keep: true, get label(){ return penLabel(); }, fn: penAction });
  if (!cine){ camSnapTo(G.camAnchor.x, G.camAnchor.z); caption('굴', '떨어진 자들이 사는 곳'); return; }
  // 화면이 점점 밝아지며 굴. 카리우스 → 청광묵 → 움직이기 가능
  pl.lying = true; G.lock = true; letterbox(true); dark(1, 0); PRO.caveIntro = true;
  camSnapTo(K.x, K.z + 2.5); camWide(K.x + 0.6, K.z + 1.2, ...lens(5.5, 6.5), 99);
  await wait(0.3); dark(0, 3.4); await wait(3.6);
  await textbox('카리우스', ['.....'], { face: FACE.karius, hold: 1.2 });
  await textbox('', ['(굴을 파는 중이다)']);
  camWide(Cc.x, Cc.z, ...lens(4.6, 6), 99); await wait(1.8);
  await textbox('', ['(청광묵의 왼눈에 흉터가 남아 있다)']);
  await textbox('청광묵', ['대장! 일어났나!'], { face: FACE.cheong, tags: CHEONG_TAGS() });
  pl.lying = false; CAM.wide = null; letterbox(false); G.lock = false; PRO.caveIntro = false;
  caption('굴', '떨어진 자들이 사는 곳');
  guide('<em>WASD</em> 움직이기 · <em>E</em> 말 걸기', 5);
}

/* ---------- 매 프레임 (글상자가 떠 있어도 돎) ---------- */
function proTick(dt){
  updateSkip();
  if (G.mode === 'cave' && G.camAnchor) fitCaveCam();
  if (!PRO.bills.length && !PRO.bubbles.length && G.mode !== 'prologue' && G.mode !== 'cave') return;
  sizeBills(); updateFallers(); updateBubbles(); tickStains(); tickSelect(); todoMarks();
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
    const atDig = !hBusy(Cv.ka) && !G.lobbyFight && Math.hypot(Cv.ka.x - Cv.K.x, Cv.ka.z - Cv.K.z) < 0.5;
    if (atDig && Cv.ka.pose !== 'dig'){ setPose(Cv.ka, 'dig'); Cv.digT = 0.85; } if (!atDig && Cv.ka.pose === 'dig') setPose(Cv.ka, 'idle');
    Cv.digT -= dt; if (Cv.digT <= 0 && atDig){ Cv.digT = 8 / 7; const k = Cv.ka; SFX.clink(0.35); spark(k.x + 0.4, 1.3, k.z - 0.6, 0xffe0b0, 6, 2.5, 0.12, 0.25); say(k, '캉', 'soft', 0.7); }
    // 청광묵: 달팽이를 보며 가끔 "아우.... 귀여워!"
    Cv.cuteT -= dt; if (Cv.cuteT <= 0 && Cv.ch.sadT > 0){ Cv.cuteT = rnd(3, 5); say(Cv.ch, Cv.ch.sadT > 45 ? '😭' : '😢', 'emo', 2.4); }
    else if (Cv.cuteT <= 0 && !hBusy(Cv.ch)){ Cv.cuteT = rnd(6, 9); const s = Cv.snails[0]; if (s) Cv.ch.face = Math.sign(s.x - Cv.ch.x) || 1; say(Cv.ch, '아우.... 귀여워!', 'soft', 2.4); }
    // 레베카: zzz
    Cv.zzzT -= dt; if (!PRO.rebOut && Cv.zzzT <= 0){ Cv.zzzT = 2.4; say({ x: Cv.B.x - 0.3, y: 0.75, z: Cv.B.z }, 'z z z…', 'zzz', 2.2); }
    // 달팽이: 집 근처를 아주 천천히 기어다님
    if (!G.waitInput) tickSnails(dt);
    if (PRO.carry && !G.lock && !G.waitInput && hit('KeyG')) dropHere();
    tickStorage(dt); tickFlies(dt); tickStage(dt); tickPigs(dt); tickStorm(dt); tickFire(dt); tickBody(dt); tickHungry(dt);
    // 오늘의 낙하: 움직일 수 있게 된 뒤 30초
    if (!Cv.dropped && !G.lock && !G.waitInput){ Cv.dropT -= dt; if (Cv.dropT <= 0) todayFall(); }
    if (PRO.shaft){ const k = clamp((G.t - PRO.shaft.t0) / 7, 0, 1); PRO.shaft.m.material.opacity = 0.13 * Math.sin(Math.PI * Math.min(1, k * 1.15)); PRO.shaft.l.intensity = 2.2 * (1 - k); }
  }
  const M = PRO.motes;
  if (M){ M.seed.forEach((m, i) => { const t = G.t * m.s + m.p; M.pos[i * 3] = m.x + Math.sin(t) * 0.6; M.pos[i * 3 + 1] = m.y + Math.sin(t * 0.7) * 0.4; M.pos[i * 3 + 2] = m.z + Math.cos(t * 0.8) * 0.6; }); M.geo.attributes.position.needsUpdate = true; M.pts.material.opacity = 0.55 + 0.25 * Math.sin(G.t * 0.8); }
}

/* ---------- 오늘의 낙하 (가챠 = 낙하): 로비에서 30초 기다리면 하늘 (천장 구멍)에서 몇 가지가 떨어짐. 동료는 떨어지지 않음
   가구 = 그 칸에 남음 (막힘) · 식량 · 보급 = E로 주움 · 장비 = 빛남, E로 주움 · 잡동사니 (시체 등) = E로 치움 */
const DROP_TABLE = [
  { k: 'd_H-120', name: '낡은 나무 침대', type: 'furn', h: 0.8, w: 2 },
  { k: 'd_H-239', name: '붉은 방석 나무 의자', type: 'furn', h: 0.8, w: 3 },
  { k: 'd_H-255', name: '나무 통', type: 'furn', h: 0.7, w: 3 },
  { k: 'd_H-130', name: '상자 · 통 · 항아리', type: 'furn', h: 0.8, w: 2 },
  { k: 'd_H-101', name: '다섯 갈래 촛대', type: 'furn', h: 1.0, w: 2 },
  { k: 'd_H-788', name: '음식 담긴 가죽 그릇', type: 'food', h: 0.45, w: 3, food: 3 },
  { k: 'd_I-050', name: '빵', type: 'food', h: 0.3, w: 6, food: 1 },
  { k: 'd_I-043', name: '고기', type: 'food', h: 0.3, w: 5, food: 2 },
  { k: 'd_I-053', name: '사과', type: 'food', h: 0.26, w: 6, food: 1 },
  { k: 'd_I-052', name: '생선', type: 'food', h: 0.28, w: 5, food: 1 },
  { k: 'd_I-054', name: '치즈', type: 'food', h: 0.26, w: 4, food: 1 },
  { k: 'pig_big', name: '돼지', type: 'live', h: 0.6, w: 3 },   // 살아 있는 가축: 떨어지면 뽈뽈 돌아다님 → 우리로
  { k: 'd_I-037', name: '빨간 물약', type: 'supply', h: 0.32, w: 4 },
  { k: 'd_I-061', name: '붕대', type: 'supply', h: 0.28, w: 4 },
  { k: 'd_H-402', name: '끈으로 묶은 회색 담요', type: 'supply', h: 0.4, w: 3 },
  { k: 'd_H-036', name: '간이 화장실', type: 'furn', h: 1.3, w: 2, toilet: true },   // 떨어지면 변소 구덩이 자리에 설치 (하나만)
  { k: 'd_EQ-005', name: '초록 수정 붉은 창', type: 'equip', h: 0.6, w: 2 },
  { k: 'd_EQ-123', name: '돌덩이 머리 붉은 자루 망치', type: 'equip', h: 0.6, w: 2 },
  { k: 'd_EQ-340', name: '붉은 목도리 은빛 판금 갑옷', type: 'equip', h: 0.6, w: 2 },
  { k: 'corpse1', name: '피 흘린 시체', type: 'junk', h: 0.5, w: 1 },
  { k: 'corpse3', name: '쓰러진 시체', type: 'junk', h: 0.35, w: 1 },
  { k: 'd_H-305', name: '작은 깡통', type: 'junk', h: 0.22, w: 2 },
  { k: 'd_I-035', name: '천 쪼가리', type: 'junk', h: 0.24, w: 3, wood: 15 },     // 땔감이 되는 쓰레기 (모닥불로)
  { k: 'd_I-058', name: '해진 파란 천', type: 'junk', h: 0.24, w: 2, wood: 15 },
  { k: 'd_I-034', name: '부서진 나무 판자', type: 'junk', h: 0.26, w: 5, wood: 25 },
  { k: 'd_I-057', name: '판자 더미', type: 'junk', h: 0.3, w: 3, wood: 40 },
];
const DROP_TYPE = { live: ['가축', 'tlive'], furn: ['가구', 'tfurn'], food: ['식량', 'tfood'], supply: ['보급', 'tsup'], equip: ['장비', 'tequip'], junk: ['잡동사니', 'tjunk'] };
function rollDrops(){
  const n = 4 + Math.floor(Math.random() * 3), total = DROP_TABLE.reduce((a, d) => a + d.w, 0), out = [];
  for (let i = 0; i < n; i++){ let r = Math.random() * total; for (const d of DROP_TABLE){ r -= d.w; if (r <= 0){ out.push(d); break; } } }
  // 화장실은 하나만: 이미 있거나 · 바닥에 있거나 · 오늘 이미 나왔으면 빵으로
  const hasT = () => PRO.hasToilet || PRO.loose.some(it => it.d.toilet && !it.done);
  for (let i = 0; i < out.length; i++) if (out[i].toilet && (hasT() || out.indexOf(out[i]) !== i)) out[i] = DROP_TABLE.find(d => d.k === 'd_I-050');
  if (!out.some(d => d.type === 'food')) out[0] = DROP_TABLE.find(d => d.k === 'd_I-050');   // 하루에 식량 하나는
  return out;
}
// 떨어질 칸: 가운데에서 3.6칸 안, 막히지 않고, 누가 서 있지 않은 칸
function freeTiles(n){
  const C = LOBBY_C, list = [];
  for (let z = C.z - 4; z <= C.z + 4; z++) for (let x = C.x - 4; x <= C.x + 4; x++){
    if (Math.hypot(x - C.x, z - C.z) > 3.6 || G.map.solid[z * G.map.w + x]) continue;
    if (PRO.pen && x >= PRO.pen.x0 && x <= PRO.pen.x1 && z >= PRO.pen.z0 && z <= PRO.pen.z1) continue;   // 달팽이 우리 안은 빼고
    if (G.units.some(u => Math.hypot(u.x - x, u.z - z) < 0.9)) continue;
    if (PRO.loose.some(it => !it.carrier && Math.hypot(it.x - x, it.z - z) < 0.6)) continue;
    list.push({ x, z });
  }
  for (let i = list.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  return list.slice(0, n);
}
function proHud(){
  if (G.mode !== 'cave' || !PRO.cave) return '';
  const Cv = PRO.cave, food = PRO.store.reduce((a, d) => a + (d.food || 0), 0), rot = PRO.trash.filter(t => t.rot > 0).length;
  return `<div class="sp">📦 창고 ${PRO.store.length} (🍖 식량 ${food}) · 🗑 쓰레기 ${PRO.trash.length}${rot ? ` (썩는 중 ${rot})` : ''}${PRO.carry ? ` · ✋ ${PRO.carry.d.name}` : ''}</div>`
    + livestockHud()
    + `<div class="sp">${PRO.day}일째 · ${Cv.dropped ? '오늘의 낙하 끝 · 잠자리에서 하루를 마침' : `오늘의 낙하까지 ${Math.max(0, Math.ceil(Cv.dropT))}초`}${PRO.didBury ? ' · 오늘 묻기 끝' : ''}</div>`;
}
// 오늘의 낙하 = 큰 목록: 한 줄씩 채워짐 (날씨가 맨 위, 떨어질 때마다 한 줄, 적은 붉은 줄)
function fallPanel(){
  const el = $p('fallres'); el.hidden = false; el.querySelector('b').textContent = `${PRO.day}일째 · 오늘의 낙하`;
  el.querySelector('.rows').innerHTML = ''; el.querySelector('small').hidden = true;
}
function listRow(icon, name, tagText, tagCls, note = '', cls = ''){
  const row = document.createElement('div'); row.className = 'row ' + cls;
  row.innerHTML = `<span class="ic">${icon}</span><span class="nm">${name}</span><span class="tag ${tagCls}">${tagText}</span><span class="nt">${note}</span>`;
  const rows = $p('fallres').querySelector('.rows'); rows.appendChild(row); rows.scrollTop = rows.scrollHeight; SFX.clink(0.18);   // 넘치면 새 줄이 보이게
}
function fallSlot(i, d){ const [tn, tc] = d.wood ? ['땔감', 'twood'] : DROP_TYPE[d.type]; listRow(`<img src="${PA + d.k}.webp" alt="">`, d.name, tn, tc, d.toilet ? '변소 자리에 설치' : d.type === 'live' ? '우리로' : d.wood ? `모닥불로 (장작 ${d.wood})` : d.type === 'junk' ? '구덩이로' : d.type === 'food' ? `식량 ${d.food}` : '창고로'); }
// 받침 있으면 을, 없으면 를
const eul = w => { const c = w.charCodeAt(w.length - 1) - 0xac00; return w + (c >= 0 && c < 11172 && c % 28 ? '을' : '를'); };
function landDrop(d, b, t, i){
  fallSlot(i, d); spark(t.x, 0.4, t.z, 0xd8c8ff, 8, 2.5);
  addLoose(d, b, t.x, t.z);
}
async function todayFall(){
  const Cv = PRO.cave; if (Cv.dropped) return; Cv.dropped = true; PRO.dropDay = PRO.day;
  G.lock = true; letterbox(true); guide('');
  const C = LOBBY_C;
  // 예고: 우르르 · 천장 먼지 · 빛기둥 (천장의 구멍)
  SFX.roar(0.5); SFX.burst({ type: 'lowpass', f: 160, gain: 0.6, att: 0.4, dec: 1.6 }); camShake(0.22, 1.6);
  say(Cv.ch, '대장! 낙하다!', 'soft', 2.2); say(Cv.ka, '...!', 'soft', 1.6);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(2.8, 16, 36, 1, true), new THREE.MeshBasicMaterial({ color: 0xd8e4ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
  cone.position.set(C.x, 8, C.z); const l = new THREE.PointLight(0xd8e4ff, 2.2, 10, 1.4); l.position.set(C.x, 4, C.z);
  G.scene.add(cone); G.scene.add(l); G.props.push(cone, l); PRO.shaft = { m: cone, l, t0: G.t };
  for (let i = 0; i < 4; i++) dust(C.x + rnd(-2, 2), C.z + rnd(-2, 2), 5);
  await wait(0.9);
  const picks = rollDrops(), tiles = freeTiles(picks.length);
  fallPanel();
  await wait(0.4);
  picks.forEach((d, i) => { const t = tiles[i]; if (!t) return;
    if (d.type === 'live'){ const data = { penned: false, hungry: 0, fed: false }; PRO.pigData.push(data); const u = spawnPig(data, t.x, t.z); fallUnit(u, 14, 0.15 + i * 0.32, 0.6, () => { fallSlot(i, d); say(u, '꿀꿀!!', 'soft', 1.2); }); return; }
    const b = bill(PA + d.k + '.webp', t.x, t.z, Math.max(0.34, d.h * 1.3), { fit: 1.0, tint: 0.95 });
    fallObj(b.g, 14, 0.15 + i * 0.32, 0.6, t, () => landDrop(d, b, t, i)); });
  await wait(0.15 + picks.length * 0.32 + 0.6);
  // 날씨가 한 번 더 (낮은 확률, 최대 1개): 다른 날씨로 바뀌거나 재해 (폭우 · 폭설, 나중에 적뢰 기믹에도 씀)
  let storm = null, wx = null;
  if (!PRO.storm && Math.random() < 0.22){
    if (Math.random() < 0.45){ storm = Math.random() < 0.5 ? 'downpour' : 'blizzard'; const S = STORMS[storm]; listRow(S.icon, `재해: ${S.name}!`, '재해', 'tstorm', S.note, 'storm'); SFX.roar(0.4); }
    else { const ks = Object.keys(WEATHER).filter(k => k !== PRO.weather); wx = ks[Math.floor(Math.random() * ks.length)]; const W = WEATHER[wx]; listRow(W.icon, `날씨가 바뀐다: ${W.name}`, '날씨', 'tweather', W.note, 'weather'); }
    await wait(0.6);
  }
  // 적: 가벼운 적 한둘 (첫날은 꼭, 그 뒤로는 가끔). 하나라도 떨어지면 동료 머리에 ! → 전투 준비
  const foesToday = PRO.day === 1 || Math.random() < 0.4;
  if (foesToday){
    const kinds = pickFoes(), ft = freeTiles(kinds.length);
    kinds.forEach((k, i) => { const t = ft[i]; if (!t) return; const e = spawn(k, t.x, t.z, 'enemy'); e.band = 'lobby'; scaleFoe(e); e.face = rnd(0, 1) < 0.5 ? 1 : -1; fallUnit(e, 16, 0.15 + i * 0.3, 0.7, () => { dust(e.x, e.z, 10); camShake(0.15, 0.15); if (i === 0) battleReady(e); }); });
    await wait(0.2 + kinds.length * 0.3 + 0.9);
    listRow('⚠', '적: ' + kinds.map(k => DEFS[k].name + (ROLE_NOTE[k] ? ` (${ROLE_NOTE[k]})` : '')).join(' · '), `적 ${kinds.length}`, 'tfoe', PRO.day > 1 ? `날이 갈수록 세짐 (+${(PRO.day - 1) * 10}%)` : '떨어지자마자 덤빔', 'foe');
    SFX.roar(0.6); await wait(0.6);
  }
  // 결과: E · 클릭으로 닫음
  const el = $p('fallres'); el.querySelector('small').hidden = false;
  await new Promise(res => { const t0 = G.t; G.waitInput = () => { if (G.t - t0 < 0.6) return; G.waitInput = null; el.hidden = true; res(); }; });
  letterbox(false); G.lock = false;
  if (storm) startStorm(storm);
  if (wx){ PRO.weather = wx; applyWeather(true); caption(`${WEATHER[wx].icon} ${WEATHER[wx].name}`, WEATHER[wx].note); if (PRO.tentGoneNow) setTimeout(() => say(Cv.ch, '대장! 변소 천막 날아갔다!', 'soft', 2.4), 1500); }
  if (foes().length) startLobbyFight();
  else guide('<em>E</em>로 들어서 창고 (팔레트)로 · 쓰레기는 구덩이로 — 동료들도 알아서 정리함 (가끔 딴짓)', 6);
}

/* ---------- 프롤로그 건너뛰기: 오른쪽 위 버튼 (프롤로그 · 굴 첫 장면 동안). 기다리던 연출 · 글상자를 모두 버리고 바로 굴 (로비)로 ---------- */
function proSkip(){
  G.waits = []; G.waitInput = null; G.slow = 1; G.hitstop = 0;
  $p('textbox').hidden = true; $p('fallres').hidden = true; $p('load').hidden = true; G.lobbyFight = false;
  dark(0, 0); mid(''); letterbox(false); PRO.caveIntro = false; camReset();
  startCave(false);
}
$p('skipBtn').addEventListener('click', e => { e.stopPropagation(); proSkip(); });
function updateSkip(){ $p('skipBtn').hidden = !(G.mode === 'prologue' || (G.mode === 'cave' && PRO.caveIntro)); }

/* ---------- 굴 카메라: 낮은 각도 + 좁은 화각 (멀리서 당겨 봄 → 원근감이 약함). 창 크기 (가로 · 세로 비)에 맞춰 거리를 정해 방 전체가 늘 다 보이게 ---------- */
const CAVE_CAM = { fov: 15, elev: 21 * Math.PI / 180, halfW: 8.7, spanZ: 16.4, wallH: 5.0 };   // wallH: 화면에 넣을 높이 (뒤쪽 5m 석문까지)
const lens = (h, back) => { const k = Math.tan(20 * Math.PI / 180) / Math.tan(CAVE_CAM.fov / 2 * Math.PI / 180); return [h * k, back * k]; };   // 다가가 보기 (말 걸기 등)도 같은 화면 크기로
function fitCaveCam(){
  const H = innerHeight, W = innerWidth; PRO.barHs = lerp(PRO.barHs || 0, PRO.barH || 0, 0.12); const bh = Math.min(PRO.barHs, H * 0.45), kv = (H - bh) / H;
  if (bh > 1) camera.setViewOffset(W, H, 0, bh / 2, W, H); else if (camera.view && camera.view.enabled) camera.clearViewOffset();   // 아래 창만큼 화면을 위로
  const tv = Math.tan(camera.fov / 2 * Math.PI / 180) * kv, th = tv / kv * camera.aspect, e = CAVE_CAM.elev;
  const needV = (CAVE_CAM.spanZ * Math.sin(e) + CAVE_CAM.wallH * Math.cos(e)) / 2 + 1.2;
  const D = Math.max(CAVE_CAM.halfW / th, needV / tv);
  CAM.base.y = D * Math.sin(e); CAM.base.back = D * Math.cos(e); CAM.look.y = 1.0; CAM.look.fwd = 0;
}
/* ---------- 달팽이 우리: 낮은 나무 울타리 (바위처럼 막지만 점프로 넘음). x0..x1 · z0..z1 테두리 칸이 울타리 ---------- */
function buildPen(x0, z0, x1, z1){
  PRO.pen = { x0, z0, x1, z1 };
  const wood = new THREE.MeshStandardMaterial({ color: 0x8a6440, roughness: 0.9 }), g = new THREE.Group();
  const post = new THREE.BoxGeometry(0.1, 0.5, 0.1), m = G.map;
  const isF = (x, z) => (x === x0 || x === x1 || z === z0 || z === z1) && x >= x0 && x <= x1 && z >= z0 && z <= z1;
  for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++){
    if (!isF(x, z)) continue;
    const k = z * m.w + x; m.solid[k] = 1; m.low[k] = 1;   // 막힘 · 낮음 (점프로 넘음) · 시야는 안 막음
    const p = new THREE.Mesh(post, wood); p.position.set(x, 0.25, z); g.add(p);
    for (const [dx, dz] of [[1, 0], [0, 1]]) if (isF(x + dx, z + dz)){
      for (const y of [0.18, 0.38]){ const r = new THREE.Mesh(new THREE.BoxGeometry(dx ? 1 : 0.06, 0.06, dz ? 1 : 0.06), wood); r.position.set(x + dx / 2, y, z + dz / 2); g.add(r); }
    }
  }
  g.traverse(o => { if (o.isMesh){ o.castShadow = true; o.receiveShadow = true; } });
  G.map.group.add(g); m.nav = {};
}

/* ---------- 로비 = 창고 (v0.13)
   떨어진 것은 들어서 (E) 한 곳으로 모음: 창고 (팔레트 자리) — 놓을수록 겹쳐 쌓임. 쓰레기 (시체 · 깡통)는 쓰레기 구덩이로
   하루에 한 번 쓰레기를 묻을 수 있음 (구덩이에서 E). 안 묻고 하루를 넘기면 다음날부터 상하기 시작 (파리 · 냄새, 날이 갈수록 심해짐)
   가만히 있으면 (2초) 동료 (청광묵 · 카리우스)가 발발 돌아다니며 같이 정리함. 잠자리 (담요)에서 하루를 마침 → 다음 날, 오늘의 낙하 30초 다시
   화장실 (간이 화장실)도 하나 */
const STORE = { x0: 6, z0: 12, x1: 7, z1: 13, cx: 6.5, cz: 12.5 }, PIT = { x: 12, z: 14 }, TOILET = { x: 12, z: 5 }, BED = { x: 4, z: 11 };
function buildStorage(){
  const m = G.map;
  for (let z = STORE.z0; z <= STORE.z1; z++) for (let x = STORE.x0; x <= STORE.x1; x++) m.solid[z * m.w + x] = 1;
  bill(PA + 'd_H-467.webp', STORE.cx, STORE.cz + 0.35, 0.55, { fit: 2.0, tint: 0.85 });              // 팔레트 (창고 자리)
  tileProp(PA + 'd_H-655.webp', PIT.x, PIT.z, 0.9, { tint: 0.85 });                                    // 쓰레기 구덩이
  PRO.toiletBill = PRO.hasToilet ? tileProp(PA + 'd_H-036.webp', TOILET.x, TOILET.z, 1.6) : tileProp(PA + 'd_H-547.webp', TOILET.x, TOILET.z, 0.45, { tint: 0.8 });   // 화장실이 떨어지기 전엔 변소 구덩이
  PRO.latrine = [];
  if (!PRO.hasToilet){
    // 변소 구덩이: 묽은 똥 (늘 있음) + 앞을 가리는 찢어진 천막 + 큰 똥 (볼일 본 만큼) + 파리
    PRO.latrine.push(bill(PA + 'poop_runny.webp', TOILET.x - 0.05, TOILET.z - 0.1, 0.2, { fit: 0.7, y: 0.03 }));
    for (let i = 0; i < (PRO.bigPoop || 0); i++) PRO.latrine.push(bill(PA + 'poop_big.webp', TOILET.x + rnd(-0.25, 0.2), TOILET.z - 0.15 + rnd(-0.1, 0.1), 0.26, { fit: 0.4, y: 0.04 }));
    if (!PRO.tentGone) PRO.latrine.push(PRO.tent = bill(PA + 'd_H-116.webp', TOILET.x, TOILET.z + 0.38, 1.05, { fit: 1.05, tint: 0.85 }));
  }
  makeFlies(TOILET.x, TOILET.z, PRO.hasToilet ? 1 : 3 + Math.min(4, PRO.bigPoop || 0));
  tileProp(PA + 'd_H-402.webp', BED.x, BED.z, 0.45, { tint: 0.9 });                                    // 잠자리 (담요)
  m.nav = {};
  PRO.storeBills = []; PRO.trashBills = [];
  PRO.store.forEach((d, i) => pileAdd(d, i)); PRO.trash.forEach((t, i) => trashAdd(t, i));
  // 창고 · 구덩이 · 화장실 · 잠자리 (글씨는 들고 있는지에 따라 바뀜)
  G.inspect.push({ x: STORE.cx, z: STORE.cz, r: 1.9, mark: '창고', far: 6, keep: true, get label(){ return PRO.carry ? (PRO.carry.pig ? '돼지는 우리로' : PRO.carry.d.raw ? '날것은 모닥불에 구워야 함' : PRO.carry.d.toilet ? '화장실은 변소 구덩이 자리로' : PRO.carry.d.type === 'junk' ? '쓰레기는 구덩이로 — 창고에 못 둠' : `${eul(PRO.carry.d.name)} 창고에 내려놓는다`) : storeIdleLabel(); },
    fn: () => { const c = PRO.carry; if (!c) return openStore(); if (c.d.raw) return popText(G.player.x, G.player.y + 2, G.player.z, '모닥불에 구워야 함!', 'miss', 1.2); if (c.pig) return popText(G.player.x, G.player.y + 2, G.player.z, '돼지는 우리로!', 'miss', 1.2); if (c.d.toilet) return popText(G.player.x, G.player.y + 2, G.player.z, '화장실은 변소 구덩이 자리로!', 'miss', 1.2); if (c.d.type === 'junk') return popText(G.player.x, G.player.y + 2, G.player.z, '쓰레기는 구덩이로!', 'miss', 1.2); putStore(c); } });
  G.inspect.push({ x: PIT.x, z: PIT.z, r: 1.6, mark: '쓰레기 구덩이', far: 6, keep: true, get label(){ return PRO.carry ? (PRO.carry.d.type === 'junk' ? `${eul(PRO.carry.d.name)} 구덩이에 버린다` : '쓸 만한 건 창고로') : PRO.trash.length ? (PRO.didBury ? '오늘은 이미 묻었다' : `쓰레기를 묻는다 (${PRO.trash.length}개${apTag()})`) : '쓰레기 구덩이 (비었음)'; },
    fn: () => { const c = PRO.carry; if (c){ if (c.pig) return popText(G.player.x, G.player.y + 2, G.player.z, '돼지는 우리로!', 'miss', 1.2); if (c.d.type !== 'junk') return popText(G.player.x, G.player.y + 2, G.player.z, '쓸 만한 건 창고로!', 'miss', 1.2); return putTrash(c); } if (PRO.trash.length && !PRO.didBury && spendAp()) buryTrash(); } });
  G.inspect.push({ x: TOILET.x, z: TOILET.z, r: 1.5, far: 6, keep: true, get mark(){ return PRO.hasToilet ? '화장실' : '변소 구덩이'; },
    get label(){ const c = PRO.carry; return c && c.d.toilet ? '간이 화장실을 설치한다' : c ? '여기엔 둘 수 없음' : PRO.hasToilet ? '화장실에 들어간다' : PRO.tentGone ? `천막을 다시 친다 (비에 쓸려 감${apTag()})` : '변소 구덩이에서 볼일을 본다'; },
    fn: async () => {
      const c = PRO.carry; if (c){ if (c.d.toilet) installToilet(c); return; }
      if (!PRO.hasToilet && PRO.tentGone){ if (spendAp()) await rebuildTent(); return; }
      G.lock = true;
      if (PRO.hasToilet){ G.player.group.visible = false; SFX.thump(120, 0.3, 0.2); await wait(1.4); SFX.burst({ type: 'bandpass', f: 600, f2: 200, gain: 0.35, att: 0.1, dec: 0.9 }); await wait(1.0); G.player.group.visible = true; await textbox('', ['(개운하다)']); }
      else { G.player.group.visible = false; SFX.thump(90, 0.25, 0.2); await wait(1.6); G.player.group.visible = true;   // 천막 뒤로
        PRO.bigPoop = (PRO.bigPoop || 0) + 1; PRO.latrine.push(bill(PA + 'poop_big.webp', TOILET.x + rnd(-0.25, 0.2), TOILET.z - 0.15, 0.26, { fit: 0.4, y: 0.04 }));
        addFly(TOILET.x, TOILET.z);
        await textbox('', ['(구덩이에 볼일을 봤다)', '…제대로 된 화장실이 하나 떨어지면 좋겠다.']); }
      G.lock = false; } });
  G.inspect.push({ x: BED.x, z: BED.z, r: 1.5, mark: '잠자리', far: 6, get label(){ return PRO.cave && PRO.cave.dropped ? '잠자리에 눕는다 — 하루를 마친다' : '잠자리 (오늘의 낙하가 아직)'; },
    fn: () => { if (!PRO.cave.dropped) return popText(G.player.x, G.player.y + 2, G.player.z, '아직 낙하가 오지 않았다', 'miss', 1.2); endDay(); } });
}
// 떨어져 있는 물건: 누가 들기 전까지 바닥에. 인주는 E로 들고, 동료는 가만히 있을 때 알아서 듦
function addLoose(d, b, x, z){
  const it = { d, b, x, z, carrier: null, claimed: null, age: 0 };
  it.gl = d.type === 'equip' ? glowAt(x, z) : null;
  it.ring = typeRing(d, x, z);
  it.insp = { x, z, r: 1.0, mark: d.name, far: 2.2, get label(){ return PRO.carry ? '한 번에 하나만 들 수 있음' : `${eul(d.name)} 든다`; }, get used(){ return !!it.carrier || it.done || !!PRO.carry; }, set used(v){},
    fn: () => { if (PRO.carry || it.carrier) return; pickUp(it, G.player); } };
  G.inspect.push(it.insp); PRO.loose.push(it);
  return it;
}
function pickUp(it, who){
  it.carrier = who; it.claimed = who; if (it.gl){ G.scene.remove(it.gl); it.gl = null; }
  if (who === G.player) PRO.carry = it; else who.job.it = it;
  SFX.clink(0.3); dust(it.x, it.z, 3);
}
// 창고에 쌓기: 팔레트 위 2x2칸 안에 이리저리, 놓을수록 위로 겹침
function pileAdd(d, i){
  const b = bill(PA + d.k + '.webp', STORE.x0 + 0.1 + ((i * 0.618) % 1) * 1.0 + rnd(-0.08, 0.08), STORE.z0 + 0.15 + ((i * 0.382 + 0.3) % 1) * 1.0, d.h * 0.8, { fit: 0.8, y: 0.12 + Math.floor(i / 4) * 0.16, tint: 0.92 });
  PRO.storeBills.push(b);
}
function trashAdd(t, i){
  const b = bill(PA + t.d.k + '.webp', PIT.x + rnd(-0.25, 0.25), PIT.z + rnd(-0.2, 0.15), t.d.h * 0.7, { fit: 0.75, y: 0.05 + i * 0.05, tint: 0.85 });
  t.b = b; if (t.rot) rotTint(t); PRO.trashBills.push(b);
}
function dropCarried(it){ G.scene.remove(it.b.g); if (it.ring){ G.scene.remove(it.ring); it.ring = null; } it.done = true; it.carrier = null; PRO.loose = PRO.loose.filter(o => o !== it); if (PRO.carry === it) PRO.carry = null; }
function putStore(it){ dropCarried(it); PRO.store.push({ ...it.d }); pileAdd(it.d, PRO.store.length - 1); SFX.thump(140, 0.3, 0.15); spark(STORE.cx, 0.6, STORE.cz, 0xffe0b0, 6, 2); popText(STORE.cx, 1.4, STORE.cz, `창고 +1 (${PRO.store.length})`, 'heal', 1); }
function putTrash(it){ dropCarried(it); const t = { d: it.d, rot: it.age > 0 ? 1 : 0 }; PRO.trash.push(t); trashAdd(t, PRO.trash.length - 1); SFX.thump(90, 0.3, 0.2); dust(PIT.x, PIT.z, 6); popText(PIT.x, 1.3, PIT.z, '버림', 'miss', 0.9); }
async function showStore(){
  if (!PRO.store.length) return textbox('', ['창고 자리가 비어 있다.']);
  const cnt = {}; PRO.store.forEach(d => cnt[d.name] = (cnt[d.name] || 0) + 1);
  await textbox('', ['창고: ' + Object.entries(cnt).map(([n, c]) => c > 1 ? `${n} x${c}` : n).join(' · ')]);
}
// 쓰레기 묻기 (하루 한 번): 구덩이에 흙을 덮음
async function buryTrash(){
  const pl = G.player; G.lock = true; PRO.didBury = true;
  for (let k = 0; k < 4; k++){ pl.leanT = 0.3; SFX.burst({ type: 'lowpass', f: 380, gain: 0.45, dec: 0.25 }); dust(PIT.x + rnd(-0.4, 0.4), PIT.z + rnd(-0.3, 0.3), 7); await wait(0.45); }
  for (const t of PRO.trash) if (t.b) G.scene.remove(t.b.g);
  PRO.buried += PRO.trash.length; PRO.trash = []; PRO.trashBills = [];
  popText(PIT.x, 1.4, PIT.z, '묻었다', 'heal', 1.2); G.lock = false;
}
function rotTint(t){ if (t.b) t.b.m.material.color.setRGB(0.62 + 0.1 / t.rot, 0.78, 0.45); }
// 하루를 마침: 암전 → 다음 날. 안 묻은 쓰레기 (구덩이 · 바닥)는 상하기 시작 (날마다 더)
async function endDay(){
  const Cv = PRO.cave; G.lock = true; letterbox(true); guide('');
  G.player.lying = true; G.player.poseHold = 'sleep'; dark(1, 1.4); await wait(1.6);   // 잠든 인주
  PRO.day++; PRO.didBury = false; Cv.dropped = false; Cv.dropT = 30;
  PRO.nightCold = PRO.weather === 'snow' || PRO.storm === 'blizzard'; endStorm(); PRO.weather = rollWeather(); applyWeather(true);
  const dayNews = dayLivestock().concat(dayBody()); ageStains();
  let rotNow = 0;
  for (const t of PRO.trash){ t.rot++; rotTint(t); rotNow++; }
  for (const it of PRO.loose) if (it.d.type === 'junk'){ it.age++; it.b.m.material.color.setRGB(0.62, 0.78, 0.45); rotNow++; }
  for (const it of PRO.loose) if (it.d.type !== 'junk') it.age++;
  mid(`${PRO.day}일째`); await wait(1.6); mid('');
  dark(0, 1.6); await wait(1.2); G.player.lying = false; G.player.poseHold = null;
  if (rotNow){ say(Cv.ch, '대장! 냄새난다! 쓰레기 썩는다!', 'soft', 2.6); }
  dayNews.forEach((t, i) => setTimeout(() => say(Cv.ch, t, 'soft', 2.6), 2800 + i * 2600));
  letterbox(false); G.lock = false;
  if (PRO.day >= 3 && Math.random() < 0.25) setTimeout(nightRaid, 1800);
  setTimeout(() => G.mode === 'cave' && guide(`아침 — <em>밥</em> · <em>불</em>은 언제든 · 행동 <em>${AP_MAX}</em>번: <em>달팽이 먹이</em> · <em>묻기</em> · <em>석문 파기</em> · <em>레베카</em>`, 7), 2600);
  caption(`${PRO.day}일째 · ${WEATHER[PRO.weather].icon} ${WEATHER[PRO.weather].name}`, rotNow ? '어디선가 썩는 냄새가 난다' : WEATHER[PRO.weather].note);
  if (PRO.weather === 'rain' && PRO.tentGoneNow) setTimeout(() => say(Cv.ch, '대장! 변소 천막 날아갔다!', 'soft', 2.4), 1800);
}
// 매 프레임: 들고 있는 것 · 동료 정리 · 썩는 쓰레기 (파리)
function tickStorage(dt){
  const pl = G.player, Cv = PRO.cave;
  for (const it of PRO.loose) if (it.ring){ it.ring.visible = !it.carrier && !it.done; if (it.ring.visible){ it.ring.position.set(it.x, 0.03, it.z); it.ring.material.opacity = 0.55 + 0.3 * Math.sin(G.t * 3 + it.x); } }
  for (const it of PRO.loose) if (it.carrier){ const c = it.carrier; it.b.g.position.set(c.x, c.y + bodyH(c) * (c === pl ? 0.95 : 0.85) + 0.05 + Math.abs(Math.sin(G.t * 9)) * 0.04, c.z + 0.05); it.x = c.x; it.z = c.z; }
  // 가만히 있는지: 움직임 · 키 입력이 없으면 쌓임
  const busy = !!inputDir() || keys.size > 0 || G.lock || G.waitInput;
  PRO.idleT = busy ? 0 : PRO.idleT + dt;
  for (const h of mates()) helperTick(h, dt);
  // 썩는 쓰레기: 파리 · 가끔 냄새
  const rotten = PRO.trash.filter(t => t.rot > 0).concat(PRO.loose.filter(it => it.d.type === 'junk' && it.age > 0));
  for (const t of rotten){ if (Math.random() < dt * (2 + (t.rot || t.age || 1) * 2)){ const x = (t.b ? t.b.g.position.x : t.x) + rnd(-0.4, 0.4), z = (t.b ? t.b.g.position.z : t.z) + rnd(-0.4, 0.4); dot(x, rnd(0.3, 0.9), z, 0x2a3a1a, 0.07, 0.6); } }
  if (rotten.length){ Cv.smellT = (Cv.smellT || 4) - dt; if (Cv.smellT <= 0){ Cv.smellT = rnd(7, 11); const t = rotten[0]; say({ x: t.b ? t.b.g.position.x : t.x, y: 1.0, z: t.b ? t.b.g.position.z : t.z }, '(썩는 냄새)', 'zzz', 2); } }
}
// 동료 정리 (v0.17): 인주가 뭘 하든 낙하 뒤엔 기본으로 정리함. 단 약간 랜덤 — 그냥 가만히 있기도, 바로 정리하기도, 정리하다 딴 데로 새기도
// 동료도 화장실에 감 (가끔. 변소 구덩이면 큰 똥 · 파리가 늘어남)
const hBusy = h => !!(h.job || h.potty || h.wander || h.pigJob || h.rescue || h.ready || h.eat || h.stopPl || h.sadT > 45);
const HSAY = { ch: { work: ['정리한다!', '청광묵 돕는다!', '영차!'], hungry: ['배고프다! 밥!', '청광묵 아침 먹는다!'], ate: ['맛있다!', '배부르다! 대장!'], starve: ['먹을 거… 먹을 거…', '대장… 먹을 거 없다…', '꼬르륵…'], forage: ['…버섯… 조금만…', '배고프다… 달팽이 거 조금만…'], off: ['어? 저거 뭐냐', '달팽이 보고 온다!', '킁킁…', '배고프다…'], potty: ['청광묵 똥 싸러 간다!', '급하다!'], done: ['시원하다!', '대장! 개운하다!'] },
               ka: { work: ['.....', '…'], hungry: ['.....'], ate: ['…'], starve: ['…(꼬르륵)'], forage: ['.....'], off: ['.....', '캉.'], potty: ['.....'], done: ['…'] } };
function helperTick(h, dt){
  if (!h) return;
  h.home = h.home || { x: h.x, z: h.z };
  const isCh = h === PRO.cave.ch, L = HSAY[h === PRO.cave.reb ? 'reb' : isCh ? 'ch' : 'ka'], pick = a => a[Math.floor(Math.random() * a.length)];
  const sp = isCh ? 3.1 : 2.2;
  if (G.lobbyFight){ if (!isCh){ h.lift = 0; } return; }   // 싸우는 중엔 정리 안 함 (같이 싸움)
  if (h.ready){ h.ready -= dt; if (h.ready <= 0) h.ready = 0; else return; }   // 전투 준비 (! 뜬 뒤 잠깐)
  if (isCh && h.stopPl) return stopPlayer(h, sp, dt);   // 인주가 달팽이를 때림 → 말리러
  if (isCh && h.sadT > 0){ h.sadT -= dt; if (h.sadT > 45){ h.sit = true; h.lift = 0; return; } h.sit = false; }   // 달팽이가 죽음: 주저앉아 움
  if (isCh && snailRescue(h, sp, dt)) return;   // 달팽이 탈출이 먼저
  if (isCh && pigRescue(h, sp, dt)) return;      // 그다음 돼지
  let moving = false;
  // 화장실: 가끔 (들고 있지 않을 때)
  h.pottyT = (h.pottyT ?? rnd(60, 160)) - dt;
  if (h.pottyT <= 0 && !h.potty && !(h.job && h.job.it) && !G.lock){
    h.pottyT = rnd(110, 220); if (h.job){ h.job.target.claimed = null; h.job = null; } h.wander = null;
    h.potty = { phase: 'go', t: 0 }; say(h, pick(L.potty), 'soft', 1.4);
  }
  if (h.potty){
    const P = h.potty, D = { x: TOILET.x - 1, z: TOILET.z + 0.4 };
    if (P.phase === 'go'){ if (Math.hypot(D.x - h.x, D.z - h.z) > 0.4){ navTo(h, D.x, D.z, sp * 0.9, dt, 0.3); moving = true; } else { P.phase = 'in'; P.t = rnd(1.8, 3); h.group.visible = false; SFX.thump(100, 0.25, 0.2); } }
    else { P.t -= dt; if (P.t <= 0){ h.group.visible = true; h.potty = null; h.restT = rnd(1, 4);
      if (!PRO.hasToilet){ PRO.bigPoop = (PRO.bigPoop || 0) + 1; PRO.latrine.push(bill(PA + 'poop_big.webp', TOILET.x + rnd(-0.25, 0.2), TOILET.z - 0.15, 0.26, { fit: 0.4, y: 0.04 })); addFly(TOILET.x, TOILET.z); }
      else SFX.burst({ type: 'bandpass', f: 600, f2: 200, gain: 0.25, att: 0.1, dec: 0.8 });
      say(h, pick(L.done), 'soft', 1.4); } }
    return hMove(h, moving);
  }
  // 끼니 (하루 한 번): 일어나면 먹을 걸 찾아다님. 창고에 있으면 창고, 없으면 한참 찾다가 우리의 버섯 · 이끼를 따 먹음 (달팽이 먹이가 줄어듦)
  const key = h === PRO.cave.reb ? 'reb' : isCh ? 'ch' : 'ka', M = PRO.meal[key];
  if (!M.fed && !h.eat && !(h.job && h.job.it) && !G.lock){
    h.mealT = (h.mealT ?? rnd(1, 6)) - dt;
    if (h.mealT <= 0){
      const src = edible() ? 'store' : PRO.penFood > 0 && (h.seekT = (h.seekT || 0) + 1) > 2 ? 'pen' : null;
      h.mealT = rnd(8, 14);
      if (src){ if (h.job){ h.job.target.claimed = null; h.job = null; } h.wander = null; h.eat = src; say(h, src === 'pen' ? pick(L.forage) : pick(L.hungry), 'soft', 1.6); }
      else if (!h.eat){ say(h, pick(L.starve), 'soft', 2); const a = rnd(0, 6.3); h.wander = { x: clamp(LOBBY_C.x + Math.cos(a) * rnd(1, 4), 3, 15), z: clamp(LOBBY_C.z + Math.sin(a) * rnd(1, 3.5), 6, 14), t: 3, stay: 1 }; }
    }
  }
  if (h.eat){
    const D = h.eat === 'pen' ? { x: PRO.pen.x0 - 0.9, z: (PRO.pen.z0 + PRO.pen.z1) / 2 + (isCh ? 0.6 : -0.6) } : { x: STORE.cx + 1.4, z: STORE.cz + 0.5 };
    if (Math.hypot(D.x - h.x, D.z - h.z) > 0.5){ navTo(h, D.x, D.z, sp * 0.9, dt, 0.3); moving = true; }
    else {
      const ok = h.eat === 'pen' ? pickPenFood() : takeMeal();
      if (ok){ M.fed = true; h.seekT = 0; say(h, h.eat === 'pen' ? (isCh ? '…달팽이 미안하다…' : '…') : pick(L.ate), 'soft', 1.8); popText(h.x, h.y + 2, h.z, h.eat === 'pen' ? '버섯 냠 (달팽이 먹이 -1)' : '냠 (끼니)', 'heal', 1.3); SFX.burst({ type: 'bandpass', f: 500, q: 3, gain: 0.2, dec: 0.3 }); }
      h.eat = false; h.restT = rnd(2, 5);
    }
    return hMove(h, moving);
  }
  // 딴짓: 아무 데나 갔다가 잠깐 서 있음
  if (h.wander){ const W = h.wander; if (Math.hypot(W.x - h.x, W.z - h.z) > 0.3 && W.t > 0){ navTo(h, W.x, W.z, sp * 0.6, dt, 0.2); moving = true; } W.t -= dt; if (W.t <= -W.stay) h.wander = null; return hMove(h, moving); }
  h.restT = (h.restT || 0) - dt;
  if (!h.job && h.restT <= 0 && !G.lock){
    const free = PRO.loose.filter(it => !it.claimed && !it.carrier && !it.done && !(it.heldT > G.t) && !(it.d.raw && (isCh || !PRO.fireLit)));   // 청광묵은 죽은 달팽이를 못 만짐
    const it = nearest(h, free, 30);
    if (it){
      const r = Math.random();
      if (r < 0.28) h.restT = rnd(3, 12);   // 그냥 가만히
      else { it.claimed = h; h.job = { target: it, it: null }; if (Math.random() < 0.45) say(h, pick(L.work), 'soft', 1.2); }
    } else h.restT = 1;
  }
  if (h.job){
    const J = h.job;
    if (!J.it){
      const it = J.target;
      if (it.carrier || it.done){ h.job = null; return hMove(h, false); }   // 인주가 먼저 들었음
      if (Math.random() < dt * 0.06){   // 정리하러 가다가 딴 데로 샘
        it.claimed = null; h.job = null; const a = rnd(0, 6.3);
        h.wander = { x: clamp(LOBBY_C.x + Math.cos(a) * rnd(1, 4), 3, 15), z: clamp(LOBBY_C.z + Math.sin(a) * rnd(1, 3.5), 6, 14), t: 4, stay: rnd(2, 6) };
        say(h, pick(L.off), 'soft', 1.3); return hMove(h, false);
      }
      if (Math.hypot(it.x - h.x, it.z - h.z) > 0.75){ navTo(h, it.x, it.z, sp, dt, 0.6); moving = true; }
      else pickUp(it, h);
    } else {
      const d = J.it.d, junk = d.type === 'junk', toFire = d.raw || (d.wood && PRO.wood < WOOD_MAX), D = d.toilet ? { x: TOILET.x - 1, z: TOILET.z } : toFire ? { x: FIRE.x + 1, z: FIRE.z } : junk ? { x: PIT.x, z: PIT.z - 1 } : { x: STORE.cx + 1.4, z: STORE.cz - 0.4 };
      if (Math.hypot(D.x - h.x, D.z - h.z) > 0.6){ navTo(h, D.x, D.z, sp * 0.85, dt, 0.4); moving = true; }
      else { if (d.toilet) installToilet(J.it); else if (d.raw) roast(J.it); else if (toFire) feedWood(J.it); else if (junk) putTrash(J.it); else putStore(J.it); h.job = null; if (Math.random() < 0.35) h.restT = rnd(2, 7); }
    }
  } else if (Math.hypot(h.home.x - h.x, h.home.z - h.z) > 0.3){ navTo(h, h.home.x, h.home.z, sp * 0.7, dt, 0.2); moving = true; }
  hMove(h, moving);
}
function hMove(h, moving){
  h.lift = h === PRO.cave.ch && moving ? Math.abs(Math.sin(G.t * 16)) * 0.09 : 0;   // 발발 (청광묵)
  if (h === PRO.cave.ka){ if (moving) setPose(h, 'walk'); else if (h.pose === 'walk') setPose(h, 'idle'); }
}
// 적이 하나라도 떨어지면: 동료 머리에 ! → 하던 것 내려놓고 적 쪽을 보며 전투 준비
function battleReady(e){
  for (const h of mates()){
    if (!h) continue;
    if (h.job){ const J = h.job; if (J.it){ const it = J.it; it.carrier = null; it.claimed = null; it.x = h.x; it.z = h.z; it.b.g.position.set(h.x, heightAt(G.map, h.x, h.z), h.z); it.insp.x = h.x; it.insp.z = h.z; } else if (J.target) J.target.claimed = null; h.job = null; }
    if (h.potty){ h.potty = null; h.group.visible = true; }
    h.wander = null; h.pigJob && h.pigJob.u && (h.pigJob.u.carrier = null); h.pigJob = null; h.ready = 99; h.lift = 0;
    h.face = Math.sign(e.x - h.x) || 1; if (h === PRO.cave.ka) setPose(h, 'idle');
    say(h, '!', 'alert', 1.6);
  }
  SFX.clink(0.5);
}

// 간이 화장실 설치: 변소 구덩이 그림을 화장실로 바꿈 (이후로는 화장실이 다시 떨어지지 않음)
function installToilet(it){
  dropCarried(it); PRO.hasToilet = true;
  if (PRO.toiletBill) G.scene.remove(PRO.toiletBill.g);
  for (const b of PRO.latrine || []) G.scene.remove(b.g); PRO.latrine = []; PRO.bigPoop = 0;   // 천막 · 똥 치움
  while (PRO.flies.length > 1){ const f = PRO.flies.pop(); G.scene.remove(f.g); }
  PRO.toiletBill = bill(PA + 'd_H-036.webp', TOILET.x, TOILET.z, 1.6, { fit: 0.92 });
  SFX.boom(0.5); dust(TOILET.x, TOILET.z, 12); spark(TOILET.x, 1.0, TOILET.z, 0x9fd0ff, 12, 3);
  popText(TOILET.x, 2.2, TOILET.z, '화장실 설치!', 'crit', 1.6);
  if (PRO.cave) say(PRO.cave.ch, '대장! 화장실 생겼다!', 'soft', 2.2);
}

/* ---------- 달팽이 기믹: 가끔 (25 ~ 55초에 한 마리) 울타리를 기어올라 넘어가 로비를 돌아다님. 청광묵이 쫓아가 잡아 우리 안에 다시 넣음
   상태: pen (우리 안) · climb (울타리를 넘는 중, 3초) · out (밖에서 꼬물꼬물) · carried (청광묵이 듦) */
const PEN_IN = () => ({ x: (PRO.pen.x0 + PRO.pen.x1) / 2, z: (PRO.pen.z0 + PRO.pen.z1) / 2 });
function tickSnails(dt){
  const Cv = PRO.cave, pen = PRO.pen; if (!pen) return;
  for (const s of Cv.snails){
    s.st2 = s.st2 || 'pen'; s.escT = s.escT ?? rnd(20, 45);
    if (s.st2 === 'pen'){
      s.wT = (s.wT || 0) - dt;
      if (s.wT <= 0){ s.wT = rnd(3, 6); const a = rnd(0, 6.3); s.goal = { x: clamp(s.home.x + Math.cos(a) * 0.8, pen.x0 + 0.7, pen.x1 - 0.7), z: clamp(s.home.z + Math.sin(a) * 0.8, pen.z0 + 0.7, pen.z1 - 0.7) }; }
      if (s.goal && Math.hypot(s.goal.x - s.x, s.goal.z - s.z) > 0.1){ const n = norm(s.goal.x - s.x, s.goal.z - s.z); moveBy(s, n.x * 0.16 * dt, n.z * 0.16 * dt); faceToward(s, n.x, n.z); }
      // 알: 가끔 우리 안에 낳음 (한 번에 무더기 셋까지)
      s.eggT = (s.eggT ?? rnd(45, 100)) - dt; if (s.eggT <= 0){ s.eggT = rnd(60, 130); if (PRO.eggs.length < 3 && !s.baby && !PRO.snailHd) layEgg(s); }
      // 탈출: 한 번에 한 마리만
      if (!G.lock){ s.escT -= dt; if (s.escT <= 0 && !Cv.snails.some(o => o !== s && o.st2 !== 'pen')) startEscape(s); }
    } else if (s.st2 === 'climb'){
      const C = s.climb, k = clamp((G.t - C.t0) / C.dur, 0, 1);
      s.x = lerp(C.a.x, C.b.x, k); s.z = lerp(C.a.z, C.b.z, k); s.lift = Math.sin(Math.PI * k) * 0.5; s.tiltOverride = (k < 0.5 ? -1 : 1) * 0.5 * Math.sin(Math.PI * k) * s.face;   // 기어오르다 내려감
      if (k >= 1){ s.lift = 0; s.tiltOverride = null; s.wT = 0; if (s.homeBack){ s.homeBack = false; s.st2 = 'pen'; s.goal = null; } else s.st2 = 'out'; }
    } else if (s.st2 === 'out'){
      s.wT -= dt;
      if (s.wT <= 0){ s.wT = rnd(2.5, 5); const a = rnd(0, 6.3); s.goal = { x: s.x + Math.cos(a) * 1.2, z: s.z + Math.sin(a) * 1.2 }; }
      if (s.goal){ const n = norm(s.goal.x - s.x, s.goal.z - s.z); moveBy(s, n.x * 0.22 * dt, n.z * 0.22 * dt); faceToward(s, n.x, n.z); }
    } else if (s.st2 === 'carried'){
      const c = s.carrier; s.x = c.x; s.z = c.z + 0.02; s.lift = bodyH(c) * 0.9;
    }
  }
}
function startEscape(s){
  const pen = PRO.pen, ways = [];
  for (let z = pen.z0 + 1; z < pen.z1; z++){ ways.push({ f: { x: pen.x0, z }, o: { x: pen.x0 - 1, z } }); }
  for (let x = pen.x0 + 1; x < pen.x1; x++){ ways.push({ f: { x, z: pen.z0 }, o: { x, z: pen.z0 - 1 } }); ways.push({ f: { x, z: pen.z1 }, o: { x, z: pen.z1 + 1 } }); }
  const ok = ways.filter(w => !solidAt(G.map, w.o.x, w.o.z)).sort((a, b) => Math.hypot(a.f.x - s.x, a.f.z - s.z) - Math.hypot(b.f.x - s.x, b.f.z - s.z));
  if (!ok.length){ s.escT = rnd(20, 40); return; }
  const w = ok[0];
  s.st2 = 'climb'; s.climb = { a: { x: s.x, z: s.z }, b: w.o, t0: G.t, dur: 3.2 }; faceToward(s, w.o.x - s.x, w.o.z - s.z);
  say({ x: w.f.x, y: 0.8, z: w.f.z }, '꼬물꼬물…', 'zzz', 2.2);
}
// 청광묵: 밖에 나온 달팽이를 잡아 우리에 넣음 (다른 정리보다 먼저, 인주가 움직여도). 하던 물건 나르기는 끝내고 감
function snailRescue(h, sp, dt){
  const Cv = PRO.cave, pen = PRO.pen;
  if (h.job && h.job.it) return false;   // 물건을 들고 있으면 그것부터
  let R = h.rescue;
  if (!R){
    const s = Cv.snails.find(o => o.st2 === 'out');
    if (!s) return false;
    if (h.job){ if (h.job.target) h.job.target.claimed = null; h.job = null; }
    R = h.rescue = { s, phase: 'go' }; say(h, ['어디 가냐! 달팽이!', '달팽이 나왔다! 대장!', '거기 서라!'][Math.floor(Math.random() * 3)], 'soft', 1.6);
  }
  const s = R.s, IN = PEN_IN(), gate = { x: pen.x0 - 1, z: IN.z };   // 우리 왼쪽 바깥에서 넣음
  let moving = false;
  if (R.phase === 'go'){
    if (s.st2 !== 'out'){ h.rescue = null; return false; }
    if (Math.hypot(s.x - h.x, s.z - h.z) > 0.6){ navTo(h, s.x, s.z, sp * 1.1, dt, 0.45); moving = true; }
    else { s.st2 = 'carried'; s.carrier = h; R.phase = 'back'; SFX.clink(0.25); say(h, '잡았다!', 'soft', 1); }
  } else if (R.phase === 'back'){
    if (Math.hypot(gate.x - h.x, gate.z - h.z) > 0.5){ navTo(h, gate.x, gate.z, sp, dt, 0.3); moving = true; }
    else {   // 울타리 너머로 쏙
      s.st2 = 'climb'; s.carrier = null; s.climb = { a: { x: h.x, z: h.z }, b: { x: IN.x + rnd(-0.4, 0.4), z: IN.z + rnd(-0.6, 0.6) }, t0: G.t, dur: 0.6 };
      s.escT = rnd(25, 55); s.homeBack = true; R.phase = 'done'; say(h, '들어가라!', 'soft', 1.4);
    }
  } else if (R.phase === 'done'){ h.rescue = null; return false; }
  h.lift = moving ? Math.abs(Math.sin(G.t * 16)) * 0.09 : 0;
  return true;
}

/* ---------- 파리: 변소 구덩이 (· 썩는 쓰레기) 둘레를 윙윙. 옆모습 그림, 가는 쪽으로 뒤집힘, 날개 떨림 ---------- */
function addFly(cx, cz, r = 0.7){
  const b = bill(PA + 'fly.webp', cx, cz, 0.17, { y: 0.6 });
  const f = { g: b.g, b, cx, cz, r: r * rnd(0.6, 1.2), ph: rnd(0, 6.3), sp: rnd(1.6, 3.2), lx: cx };
  PRO.flies.push(f); return f;
}
function makeFlies(cx, cz, n){ for (let i = 0; i < n; i++) addFly(cx, cz); }
function tickFlies(dt){
  const pl = G.player;
  for (const f of PRO.flies){
    const t = G.t * f.sp + f.ph, x = f.cx + Math.sin(t) * f.r + Math.sin(t * 2.7) * 0.15, z = f.cz + Math.cos(t * 1.3) * f.r * 0.6, y = 0.45 + Math.sin(t * 2.1) * 0.25 + Math.sin(t * 7) * 0.05;
    f.g.position.set(x, y, z);
    if (f.b.sized){ const dir = x > f.lx ? 1 : -1; f.b.m.scale.x = Math.abs(f.b.m.scale.x) * dir * (0.85 + 0.15 * Math.abs(Math.sin(G.t * 60 + f.ph))); }   // 가는 쪽 · 날개 떨림
    f.lx = x;
  }
  // 가까이 가면 윙윙
  if (pl && PRO.flies.length){ const near = PRO.flies.some(f => Math.hypot(f.g.position.x - pl.x, f.g.position.z - pl.z) < 2); PRO.buzzT = (PRO.buzzT || 0) - dt;
    if (near && PRO.buzzT <= 0){ PRO.buzzT = rnd(0.8, 1.6); SFX.burst({ type: 'bandpass', f: rnd(190, 260), q: 9, gain: 0.08, att: 0.15, dec: 0.5 }); } }
}

/* ---------- 가벼운 적 5: 오늘의 낙하에 섞여 떨어짐 → 바로 덤빔. 카메라 앵글은 그대로 (로비 고정). 청광묵도 같이 싸움
   쓰러진 적은 사체 (쓰레기)로 남음 → 구덩이로 */
const FOES = {
  foeJelly:   { spr: 'foeJelly', name: '녹색 젤리', hp: 40, atk: 8, spd: 1.6, r: 0.4, weight: 60, melee: { range: 1.3, arc: 1.7, windup: 0.6, cd: 1.7, mul: 1, kb: 0.5 } },
  foeDevil:   { spr: 'foeDevil', name: '꼬마악마', hp: 28, atk: 7, spd: 3.6, r: 0.3, weight: 35, melee: { range: 1.35, arc: 1.4, windup: 0.32, cd: 1.1, mul: 1, kb: 0.4 } },
  foeFairy:   { spr: 'foeFairy', name: '꼬마요정', hp: 24, atk: 7, spd: 3.0, r: 0.3, weight: 25, bow: { range: 7, windup: 0.6, cd: 1.9, speed: 15 }, leap: 3 },
  foeSlime:   { spr: 'foeSlime', name: '슬라임', hp: 55, atk: 10, spd: 1.5, r: 0.45, weight: 90, melee: { range: 1.6, arc: 2.2, windup: 0.75, cd: 2.0, mul: 1, kb: 1.0 } },
  foeCultist: { spr: 'foeCultist', name: '광신도', hp: 32, atk: 8, spd: 2.4, r: 0.32, weight: 55, line: { len: 4.2, w: 0.55, windup: 0.75, cd: 1.9, mul: 1, kb: 0.6 } },
};
Object.assign(DEFS, FOES);
const foeSpr = (file, w, h, tall) => ({ h0: h, tall, poses: { idle: { src: PA + file + '.webp', w, h, ax: w / 2, ay: h - 2, f: 1 } } });
Object.assign(SPR, { foeJelly: foeSpr('foe_jelly', 370, 311, 0.7), foeDevil: foeSpr('foe_devil', 157, 384, 1.0), foeFairy: foeSpr('foe_fairy', 167, 384, 0.95), foeSlime: foeSpr('foe_slime', 304, 328, 1.05), foeCultist: foeSpr('foe_cultist', 294, 384, 1.35) });
const FOE_FILE = { foeJelly: 'foe_jelly', foeDevil: 'foe_devil', foeFairy: 'foe_fairy', foeSlime: 'foe_slime', foeCultist: 'foe_cultist' };
DEFS.cheongAlly = { spr: 'cheong', name: '청광묵', hp: 140, atk: 12, spd: 3.3, r: 0.34, weight: 60, melee: { range: 1.5, arc: 1.8, windup: 0.35, cd: 1.0, mul: 1, kb: 0.6 } };
function startLobbyFight(){
  G.lobbyFight = true; G.cmd = 'free';
  for (const e of foes()){ e.alert = true; e.seen = G.t; e.home = { x: LOBBY_C.x, z: LOBBY_C.z }; }
  const ch = PRO.cave.ch; ch.side = 'ally'; ch.D = DEFS.cheongAlly; ch.max = DEFS.cheongAlly.hp; ch.hp = Math.max(1, Math.round(ch.max * PRO.hpf.ch)); ch.atk = DEFS.cheongAlly.atk; ch.spd = DEFS.cheongAlly.spd; ch.job = null; ch.rescue = null; ch.lift = 0;
  say(ch, '!', 'alert', 1.1); say(PRO.cave.ka, '!', 'alert', 1.1); setTimeout(() => G.lobbyFight && say(ch, '대장! 적이다! 청광묵도 싸운다!', 'soft', 2), 1100);   // 리스트 뒤에 가렸던 ! 를 한 번 더
  const ka = PRO.cave.ka; Object.assign(ka, { side: 'ally', D: DEFS.kariusAlly, hp: Math.max(1, Math.round(DEFS.kariusAlly.hp * PRO.hpf.ka)), max: DEFS.kariusAlly.hp, atk: DEFS.kariusAlly.atk, spd: DEFS.kariusAlly.spd, job: null, kc: null, p2: false, cd: 0.5, swCd: 2.5, grCd: 4, slCd: 2, rsCd: 3 }); setPose(ka, 'idle');
  setTimeout(() => G.lobbyFight && say(ka, '.....', 'soft', 1.4), 1500);
  guide('적이다! <em>좌클릭</em> 찌르기 · <em>우클릭</em> 투창 · <em>Q</em> 구르기 · <em>F</em> 방어', 5);
  G.onKill = (u) => { if (u.side === 'enemy' && G.mode === 'cave' && u.R) dropLoot(u);
    if (u.side === 'enemy' && G.mode === 'cave' && !u.D.boss){
    const d = { k: FOE_FILE[u.kind], name: u.D.name + ' 사체', type: 'junk', h: bodyH(u), lie: -u.face || 1 };   // v0.19: 몸 크기 그대로
    bloodBurst(u.x, u.z, bodyH(u)); bloodPool(u.x, u.z, 0.45 + bodyH(u) * 0.35, 2.4);
    setTimeout(() => { removeUnit(u); if (G.mode !== 'cave') return; const b = bill(PA + d.k + '.webp', u.x, u.z, d.h, { tint: 0.6, lie: d.lie }); addLoose(d, b, u.x, u.z); }, 2600);
  } };
}
function endLobbyFight(win){
  G.lobbyFight = false;
  for (const h of [PRO.cave.ch, PRO.cave.ka]){ h.ready = 0; h.restT = rnd(1, 5); PRO.hpf[h === PRO.cave.ch ? 'ch' : 'ka'] = h.downed ? 0.05 : Math.max(0.05, h.hp / h.max); }
  const ch = PRO.cave.ch; ch.side = 'neutral'; ch.D = DEFS.cheongNpc; ch.downed = false; ch.st = 'idle'; ch.tilt = 0;
  const ka = PRO.cave.ka; if (ka.kc && ka.kc.dec) cancelDecal(ka.kc.dec); Object.assign(ka, { side: 'neutral', D: DEFS.karius, hp: DEFS.karius.hp, max: DEFS.karius.hp, downed: false, st: 'idle', tilt: 0, kc: null, p2: false }); setPose(ka, 'idle');
  if (win){ say(ch, '대장! 다 잡았다!', 'soft', 2.2); caption('정리', '사체는 쓰레기 구덩이로'); }
}
// 로비에서 인주가 쓰러지면: 암전 → 적은 사라지고, 반쯤 회복
async function lobbyDefeat(){
  if (PRO.lobbyLost) return; PRO.lobbyLost = true; G.lock = true; letterbox(true); G.player.poseHold = 'dead';
  dark(1, 1.2); await wait(1.4);
  for (const e of foes()) removeUnit(e);
  const wasJr = !!G.boss; if (G.boss){ $('bossbar').hidden = true; G.boss = null; G.rain.on = PRO.storm === 'downpour'; bossCam(false); }
  const pl = G.player; pl.downed = false; pl.st = 'idle'; pl.hp = Math.round(pl.max * 0.5); pl.poseHold = null;
  endLobbyFight(false);
  dark(0, 1.2); await textbox('', wasJr ? ['…눈을 뜨니 잠자리 위.', '적뢰는 하늘로 돌아갔다. 석문은 그대로 열려 있다.', '(준비가 되면 다시 석문 앞에서)'] : ['…눈을 뜨니 잠자리 위.', '청광묵이 끌어다 놓은 모양이다. 놈들은 어디론가 사라졌다.']);
  pl.x = BED.x + 1; pl.z = BED.z; letterbox(false); G.lock = false; PRO.lobbyLost = false;
}

/* ---------- 날씨 (그날의 날씨): 맑음 · 흐림 · 비 · 눈 · 안개. 굴 가운데 천장 구멍으로 무대 조명처럼 은은한 빛이 내려옴 (날씨에 따라 색 · 세기)
   비 · 눈은 그 빛기둥 안으로만 내림. 비가 오면 변소 천막이 쓸려 감 → 다시 쳐야 함 */
const WEATHER = {
  clear:  { name: '맑음', icon: '☀', note: '구멍으로 햇살이 내려온다', col: 0xffe6b8, I: 2.6, op: 0.07, w: 3 },
  cloudy: { name: '흐림', icon: '☁', note: '빛이 희미하다', col: 0xc8ccd8, I: 1.3, op: 0.04, w: 3 },
  rain:   { name: '비', icon: '☂', note: '구멍으로 빗물이 쏟아진다', col: 0x9fb8e8, I: 1.5, op: 0.05, w: 2 },
  snow:   { name: '눈', icon: '❄', note: '눈송이가 천천히 내려온다', col: 0xe8f0ff, I: 1.9, op: 0.06, w: 1.5 },
  fog:    { name: '안개', icon: '≋', note: '안개가 깔렸다', col: 0xd8d0f0, I: 1.1, op: 0.09, w: 1.5 },
};
function rollWeather(){ const ks = Object.keys(WEATHER), tot = ks.reduce((a, k) => a + WEATHER[k].w, 0); let r = Math.random() * tot; for (const k of ks){ r -= WEATHER[k].w; if (r <= 0) return k; } return 'clear'; }
function buildStage(){
  const C = LOBBY_C;
  const spot = new THREE.SpotLight(0xffffff, 2, 30, 0.3, 0.85, 1.2); spot.position.set(C.x, 17, C.z); spot.target.position.set(C.x, 0, C.z);
  G.scene.add(spot); G.scene.add(spot.target); G.props.push(spot, spot.target);
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 3.0, 17, 40, 1, true), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
  cone.position.set(C.x, 8.5, C.z); G.scene.add(cone); G.props.push(cone);
  const poolTex = canvasTex(256, 256, (c, w, h) => { const g = c.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(0.6, 'rgba(255,255,255,.18)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  pool.rotation.x = -Math.PI / 2; pool.position.set(C.x, 0.02, C.z); G.scene.add(pool); G.props.push(pool);
  // 빛기둥 안의 비 (선) · 눈 (점)
  const N = 260, rp = new Float32Array(N * 6), rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(rp, 3));
  const rain = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: 0xbfd4ff, transparent: true, opacity: 0.5 })); rain.frustumCulled = false; G.scene.add(rain); G.props.push(rain);
  const sp = new Float32Array(N * 3), sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const snow = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.09, map: sparkTex, color: 0xffffff, transparent: true, opacity: 0.9, depthWrite: false })); snow.frustumCulled = false; G.scene.add(snow); G.props.push(snow);
  const drops = Array.from({ length: N }, () => { const a = rnd(0, 6.3), r = Math.sqrt(Math.random()) * 2.4; return { x: C.x + Math.cos(a) * r, z: C.z + Math.sin(a) * r, y: rnd(0, 12), v: rnd(9, 13), p: rnd(0, 6.3) }; });
  PRO.stage = { spot, cone, pool, rain, rg, rp, snow, sg, sp, drops };
}
function applyWeather(newDay){
  const W = WEATHER[PRO.weather], S = PRO.stage; if (!S) return;
  S.spot.color.setHex(W.col); S.spot.intensity = W.I; S.cone.material.color.setHex(W.col); S.cone.material.opacity = W.op; S.pool.material.color.setHex(W.col); S.pool.material.opacity = 0.25 + W.I * 0.12;
  S.rain.visible = PRO.weather === 'rain'; S.snow.visible = PRO.weather === 'snow';
  G.fogK = PRO.weather === 'fog' ? 0.62 : 1;   // 안개: 화면 안개를 당김 (game.js 한 프레임 끝에서 씀)
  // 비: 변소 천막이 쓸려 감
  PRO.tentGoneNow = false;
  if (newDay && PRO.weather === 'rain' && !PRO.hasToilet && !PRO.tentGone){ PRO.tentGone = true; PRO.tentGoneNow = true; if (PRO.tent){ G.scene.remove(PRO.tent.g); PRO.tent = null; } }
}
function tickStage(dt){
  const S = PRO.stage; if (!S) return;
  if (S.rain.visible){ const a = S.rp; S.drops.forEach((d, k) => { d.y -= d.v * dt; if (d.y < 0){ d.y = rnd(10, 13); if (Math.random() < 0.3) dust(d.x, d.z, 1, 0x9fb8e8); } a[k * 6] = d.x; a[k * 6 + 1] = d.y; a[k * 6 + 2] = d.z; a[k * 6 + 3] = d.x; a[k * 6 + 4] = d.y - 0.45; a[k * 6 + 5] = d.z; }); S.rg.attributes.position.needsUpdate = true; }
  if (S.snow.visible){ const a = S.sp; S.drops.forEach((d, k) => { d.y -= d.v * 0.07 * dt; if (d.y < 0) d.y = rnd(10, 13); a[k * 3] = d.x + Math.sin(G.t * 0.8 + d.p) * 0.25; a[k * 3 + 1] = d.y; a[k * 3 + 2] = d.z + Math.cos(G.t * 0.6 + d.p) * 0.25; }); S.sg.attributes.position.needsUpdate = true; }
  S.cone.material.opacity = WEATHER[PRO.weather].op * (0.85 + 0.15 * Math.sin(G.t * 0.7));   // 은은하게 숨 쉼
  // 싸움 끝 · 쓰러짐
  if (G.lobbyFight){ if (!foes().length) endLobbyFight(true); else if (G.player && G.player.downed) lobbyDefeat(); else stuckFoes(); }
}
async function rebuildTent(){
  const pl = G.player; G.lock = true;
  for (let k = 0; k < 3; k++){ pl.leanT = 0.3; SFX.thump(150, 0.3, 0.15); dust(TOILET.x, TOILET.z + 0.3, 5); await wait(0.5); }
  PRO.tentGone = false; PRO.latrine.push(PRO.tent = bill(PA + 'd_H-116.webp', TOILET.x, TOILET.z + 0.38, 1.05, { fit: 1.05, tint: 0.85 }));
  popText(TOILET.x, 1.6, TOILET.z, '천막을 다시 쳤다', 'heal', 1.3); G.lock = false;
}

/* ---------- 카리우스 전투 (2D판 kariusUpdate 그대로 옮김, 3D 장판으로)
   체력 500 · 개조된 신체 (모든 피해 60% 감소) · 느림 · 무거움. 기본: 두 번 치기 (팔이 많아 한 번에 두 대)
   노인의 팔 쓸기 (앞 2.7칸 부채꼴, 30 · 밀침 · 경직, 4초) · 잡아찢기 (1.9칸 안 하나를 끌어와 광대의 파일로 30, 치명 50%, 11초)
   체력 15% 아래: 불경자 카리우스 (공격력 1.6배 · 빠름 · 걸을 때 쿵쿵) + 내려찍기 (앞 1.3칸 원, 40 · 경직) · 돌진 (일직선으로 밀고 나가 후려침, 35) */
DEFS.kariusAlly = { spr: 'karius', name: '카리우스', hp: 500, atk: 12, spd: 2.0, r: 0.6, weight: 300, dr: 0.6, think: kariusThink };
function kariusThink(u, dt){
  if (u.downed) return;
  for (const k of ['cd', 'swCd', 'grCd', 'slCd', 'rsCd']) u[k] = (u[k] ?? 0) - dt;
  const m = u.p2 ? 1.6 : 1, K = u.kc;
  if (K){ K.t += dt; kariusSkill(u, K, m, dt); return; }
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0) u.st = 'idle'; return; }
  if (!u.p2 && u.hp <= u.max * 0.15){   // 불경자
    u.kc = { type: 'heretic', t: 0 }; setPose(u, 'heretic'); popText(u.x, u.y + 3.4, u.z, '불경자 카리우스', 'crit', 1.6); camShake(0.4, 0.4); ring(u.x, u.z, 0xfff6c0, 3, 0.5); return;
  }
  const list = foes().filter(e => e.alert && !e.dead), tg = nearest(u, list, 30);
  if (!tg){ setPose(u, u.p2 ? 'heretic' : 'idle'); return; }
  const d = dist(u, tg), a = Math.atan2(tg.z - u.z, tg.x - u.x);
  setAim(u, tg.x, tg.z);
  const front = o => { const dd = Math.hypot(o.x - u.x, o.z - u.z); return dd < 2.7 && Math.abs(angDiff(Math.atan2(o.z - u.z, o.x - u.x), a)) < 1.2; };
  if (u.p2 && u.rsCd <= 0 && d > 2.8 && d < 7){ u.rsCd = 8; u.kc = { type: 'rush', t: 0, a, dec: decal('line', { x: u.x, z: u.z, len: 4.5, w: 1.3, a, dur: 0.5, color: BLUE }), hit: new Set() }; say(u, '우오오오!', 'soft', 0.8); return; }
  if (u.p2 && u.slCd <= 0 && d <= 2.3){ u.slCd = 5; const px = u.x + Math.cos(a) * 1.3, pz = u.z + Math.sin(a) * 1.3; u.kc = { type: 'slam', t: 0, px, pz, dec: decal('circle', { x: px, z: pz, r: 1.3, dur: 0.7, color: BLUE }) }; u.poseT = 0; setPose(u, 'slam'); return; }
  if (u.grCd <= 0 && d <= 1.9 && !tg.D.boss){ u.grCd = 11; u.kc = { type: 'grab', t: 0, tg }; u.poseT = 0; setPose(u, 'grab'); popText(tg.x, tg.y + 1.8, tg.z, '잡힘!', 'hurt big', 1); return; }
  if (u.swCd <= 0 && list.some(front)){ u.swCd = 4; u.kc = { type: 'sweep', t: 0, a, dec: decal('sector', { x: u.x, z: u.z, r: 2.7, a, arc: 2.4, dur: 0.5, color: BLUE }) }; u.poseT = 0; setPose(u, 'sweep'); return; }
  if (d > 1.8){ navTo(u, tg.x, tg.z, u.spd * (u.p2 ? 1.4 : 1), dt, 1.5); setPose(u, 'walk'); if (u.p2){ u.stomp = (u.stomp || 0) - dt; if (u.stomp <= 0){ u.stomp = 0.42; camShake(0.08, 0.1); dust(u.x, u.z, 4); } } return; }
  setPose(u, u.p2 ? 'heretic' : 'idle');
  if (u.cd <= 0){ u.cd = u.p2 ? 1.1 : 1.4; u.kc = { type: 'punch', t: 0, a, n: 0, dec: decal('sector', { x: u.x, z: u.z, r: 1.9, a, arc: 1.5, dur: 0.45, color: BLUE }) }; setPose(u, 'punch'); u.poseT = 0; }
}
function kariusSkill(u, K, m, dt){
  const hitIn = (pred, dmg, o) => { for (const e of foes()) if (!e.dead && pred(e)) hurt(u, e, dmg * m, { from: u, ...o }); };
  const inDec = e => K.dec && inShape(K.dec, e);
  if (K.type === 'heretic'){ if (K.t >= 0.6){ u.kc = null; u.p2 = true; u.atk = DEFS.kariusAlly.atk * 1.6; say(u, '으으으…', 'soft', 1.2); camShake(0.5, 0.3); } return; }
  if (K.type === 'punch'){   // 팔이 많아 한 번에 두 대
    if (K.n === 0 && K.t >= 0.45){ K.n = 1; hitIn(inDec, u.atk / m, { kb: 0.4 }); }
    if (K.n === 1 && K.t >= 0.6){ K.n = 2; hitIn(inDec, u.atk / m, { kb: 0.7 }); spark(u.x + Math.cos(K.a) * 1.4, 1.3, u.z + Math.sin(K.a) * 1.4, 0xd8d0e8, 6, 3); }
    if (K.t >= 0.8) u.kc = null; return;
  }
  if (K.type === 'sweep'){   // 노인의 팔: 쓸어버림
    if (!K.hit && K.t >= 0.62){ K.hit = true; camShake(0.3, 0.2); G.hitstop = Math.max(G.hitstop, 0.08); hitIn(inDec, 30, { kb: 1.6, stun: 0.5 }); SFX.boom(0.5); }
    if (K.t >= 1.15) u.kc = null; return;
  }
  if (K.type === 'grab'){    // 잡아찢기: 끌어와 광대의 파일로
    const t = K.tg; if (!t || t.dead){ u.kc = null; return; }
    if (t.D.boss){ u.kc = null; return; }   // v0.32: 보스는 잡히지 않음 (전엔 적뢰가 하던 동작이 끊긴 채 멈춤)
    t.st = 'hurt'; t.stT = 0.3; interrupt(t);
    if (K.t > 0.4 && K.t < 1.0){ const gx = u.x + Math.cos(u.aim) * 0.9, gz = u.z + Math.sin(u.aim) * 0.9, k = Math.min(1, dt * 8); t.x += (gx - t.x) * k; t.z += (gz - t.z) * k; }
    if (!K.hit && K.t >= 1.0){ K.hit = true; hurt(u, t, 30 * m, { from: u, crit: Math.random() < 0.5, critMul: 2 }); spark(t.x, 1, t.z, 0xb3122a, 22, 5); camShake(0.35, 0.2); }
    if (K.t >= 1.45){ u.kc = null; } return;
  }
  if (K.type === 'slam'){
    if (!K.hit && K.t >= 0.7){ K.hit = true; camShake(0.55, 0.3); G.hitstop = Math.max(G.hitstop, 0.12); hitIn(e => Math.hypot(e.x - K.px, e.z - K.pz) < 1.3 + e.r, 40, { kb: 0.8, stun: 0.6 }); dust(K.px, K.pz, 16); popText(K.px, 1.4, K.pz, '쾅!', 'big', 0.6); SFX.boom(0.9); }
    if (K.t >= 1.15) u.kc = null; return;
  }
  if (K.type === 'rush'){    // 몸을 낮췄다가 일직선으로 밀고 나가 후려침
    if (K.t < 0.5) return;
    setPose(u, 'walk');
    if (K.t < 1.0){ moveBy(u, Math.cos(K.a) * 9 * dt, Math.sin(K.a) * 9 * dt); dust(u.x, u.z, 1); if (Math.random() < dt * 20) camShake(0.12, 0.08);
      for (const e of foes()) if (!e.dead && !K.hit.has(e) && Math.hypot(e.x - u.x, e.z - u.z) < 1.1){ K.hit.add(e); hurt(u, e, 35 * m, { from: u, kb: 3, stun: 1.0 }); } }
    else u.kc = null;
  }
}

/* ---------- 날씨 인카운터: 낙하에 가끔 (최대 1개) 섞여 갑자기 몰아침. 그날 하루 내내
   폭우: 굴 전체에 비 · 어두워짐 · 가끔 천둥 · 변소 천막 날아감 / 폭설: 굴 전체에 눈보라 · 걸음 느려짐 (70%) */
const STORMS = { downpour: { name: '폭우', icon: '⛈', note: '굴 전체에 비가 쏟아진다' }, blizzard: { name: '폭설', icon: '🌨', note: '눈보라 · 걸음이 느려짐' } };
function startStorm(type){ PRO.storm = type; applyStorm(true); }
function applyStorm(fresh){
  const S = PRO.storm; if (!S) return;
  if (S === 'downpour'){
    if (PRO.fireLit){ PRO.fireLit = false; if (fresh) setTimeout(() => PRO.cave && say(PRO.cave.ch, '대장! 비 때문에 불 꺼졌다!', 'soft', 2.4), 2800); }
    G.rain.on = true; if (PRO.hemi0 == null) PRO.hemi0 = hemi.intensity; hemi.intensity = 0.26;
    if (!PRO.hasToilet && !PRO.tentGone){ PRO.tentGone = true; if (PRO.tent){ G.scene.remove(PRO.tent.g); PRO.tent = null; } if (fresh) setTimeout(() => PRO.cave && say(PRO.cave.ch, '대장! 변소 천막 날아갔다!', 'soft', 2.4), 1500); }
  }
  if (S === 'blizzard' && !PRO.blizzard){
    const N = 1400, pos = new Float32Array(N * 3), geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.26, map: sparkTex, color: 0xffffff, transparent: true, opacity: 1, depthWrite: false })); pts.frustumCulled = false;
    G.scene.add(pts); G.props.push(pts);
    PRO.blizzard = { pts, geo, pos, f: Array.from({ length: N }, () => ({ x: rnd(1, 17), z: rnd(1, 17), y: rnd(0, 9), v: rnd(1.6, 3), p: rnd(0, 6.3) })) };
    G.fogK = Math.min(G.fogK || 1, 0.8);
  }
  if (fresh){ const W = STORMS[S]; caption(`${W.icon} ${W.name}`, W.note); camShake(0.2, 0.8); if (S === 'downpour'){ SFX.thunder(); flashScreen('#cfd8ff', 0.5); } else SFX.burst({ type: 'highpass', f: 1500, f2: 600, gain: 0.3, att: 0.6, dec: 2.4 }); }
}
function endStorm(){
  if (!PRO.storm) return;
  PRO.storm = null; G.rain.on = false; if (PRO.hemi0 != null){ hemi.intensity = PRO.hemi0; PRO.hemi0 = null; }
  if (PRO.blizzard){ G.scene.remove(PRO.blizzard.pts); PRO.blizzard = null; }
  applyWeather();
}
function tickStorm(dt){
  const S = PRO.storm;
  if (S === 'downpour'){ PRO.thunderT = (PRO.thunderT ?? 6) - dt; if (PRO.thunderT <= 0){ PRO.thunderT = rnd(8, 16); SFX.thunder(); flashScreen('#cfd8ff', 0.35); camShake(0.12, 0.3); } }
  const B = PRO.blizzard;
  if (B){ B.f.forEach((f, i) => { f.y -= f.v * dt; if (f.y < 0) f.y = rnd(7, 9); B.pos[i * 3] = f.x + Math.sin(G.t * 1.7 + f.p) * 0.6 + G.t * 0.8 % 1; B.pos[i * 3 + 1] = f.y; B.pos[i * 3 + 2] = f.z + Math.cos(G.t * 1.3 + f.p) * 0.4; }); B.geo.attributes.position.needsUpdate = true; }
  // 걸음: 폭설이면 느려짐, 돼지를 들면 많이 느려짐
  if (G.player) G.player.spd = DEFS.player.spd * (S === 'blizzard' ? 0.7 : 1) * (PRO.carry && PRO.carry.pig ? 0.42 : 1);
}

/* ---------- 가축 (돼지): 낙하로 떨어짐. 뽈뽈 도망 다니고 (가까이 오면 달아남), 냅두면 창고 식량을 훔쳐먹으러 감
   E로 잡으면 많이 무거움 (걸음 42%, 꿀꿀!). 우리에 넣으면 못 나감. 우리 앞에서 E로 먹이 (창고 식량 1)
   청광묵도 가만히 냅두면 잡아서 우리에 넣음. 하루 동안 못 먹으면 굶은 날 +1, 5일을 넘기면 굶어 죽음 */
DEFS.pig = { spr: 'pig', name: '돼지', hp: 60, atk: 0, spd: 2.3, r: 0.3, weight: 120 };
SPR.pig = { h0: 196, tall: 0.62, poses: { idle: { src: PA + 'pig_big.webp', w: 244, h: 196, ax: 122, ay: 192, f: 1 } } };
DEFS.snailBaby = { spr: 'snailBaby', name: '새끼 달팽이', hp: 10, atk: 0, spd: 0.2, r: 0.1, weight: 8, hittable: true };
SPR.snailBaby = { h0: 342, tall: 0.13, poses: { idle: { src: PA + 'snail.webp', w: 512, h: 342, ax: 256, ay: 336, f: 1 } } };
const PEN_AT = () => ({ x: rnd(PRO.pen.x0 + 0.8, PRO.pen.x1 - 0.8), z: rnd(PRO.pen.z0 + 0.8, PRO.pen.z1 - 0.8) });
function spawnPig(data, x, z){
  const u = spawn('pig', x, z, 'neutral'); if (u.tag){ u.tag.remove(); u.tag = null; }
  u.pig = data; data.u = u; PRO.pigs.push(u);
  G.inspect.push({ unit: u, r: 1.25, label: '돼지를 잡는다 (무거움)', get used(){ return !!u.carrier || u.pig.penned || !!PRO.carry || u.dead; }, set used(v){},
    fn: () => { if (PRO.carry || u.carrier || u.pig.penned) return; u.carrier = G.player; PRO.carry = { d: { name: '돼지', type: 'live' }, pig: u }; say(u, '꿀꿀!!', 'soft', 1); SFX.thump(120, 0.3, 0.2); } });
  return u;
}
function restoreLivestock(){
  PRO.pigData = PRO.pigData.filter(d => !d.dead);
  for (const d of PRO.pigData){ const at = d.penned ? PEN_AT() : { x: LOBBY_C.x + rnd(-2, 2), z: LOBBY_C.z + rnd(-1, 2) }; spawnPig(d, at.x, at.z); }
  for (let i = 0; i < PRO.babies; i++) spawnBaby();
  PRO.eggBills = PRO.eggs.map(e => bill(PA + 'snail_eggs.webp', e.x, e.z, 0.16, { fit: 0.4, y: 0.01 }));
}
function spawnBaby(){
  const at = PEN_AT(), n = spawn('snailBaby', at.x, at.z, 'neutral'); if (n.tag){ n.tag.remove(); n.tag = null; }
  n.baby = true; n.home = { x: at.x, z: at.z }; n.face = Math.random() < 0.5 ? 1 : -1; PRO.cave.snails.push(n); return n;
}
function layEgg(s){
  const e = { x: clamp(s.x, PRO.pen.x0 + 0.7, PRO.pen.x1 - 0.7), z: clamp(s.z, PRO.pen.z0 + 0.7, PRO.pen.z1 - 0.7), day: PRO.day };
  PRO.eggs.push(e); PRO.eggBills.push(bill(PA + 'snail_eggs.webp', e.x, e.z, 0.16, { fit: 0.4, y: 0.01 }));
  say({ x: e.x, y: 0.5, z: e.z }, '뽀글…', 'zzz', 1.8);
}
function eatFromStore(){
  const i = PRO.store.findIndex(d => d.food); if (i < 0) return false;
  PRO.store.splice(i, 1);
  for (const b of PRO.storeBills) G.scene.remove(b.g); PRO.storeBills = []; PRO.store.forEach((d, k) => pileAdd(d, k));
  return true;
}
function tickPigs(dt){
  const Cv = PRO.cave; if (!Cv) return;
  for (const u of PRO.pigs){
    if (u.dead) continue;
    const d = u.pig;
    u.oinkT = (u.oinkT ?? rnd(3, 8)) - dt;
    if (u.carrier){ const c = u.carrier; u.x = c.x; u.z = c.z + 0.02; u.lift = bodyH(c) * 0.72; if (u.oinkT <= 0){ u.oinkT = rnd(0.8, 1.4); say(u, '꿀꿀!', 'soft', 0.8); SFX.burst({ type: 'bandpass', f: 420, f2: 260, q: 4, gain: 0.25, att: 0.03, dec: 0.25 }); } continue; }
    u.lift = 0; u.freeT = d.penned ? 0 : (u.freeT || 0) + dt;
    if (d.penned){   // 우리 안: 못 나감
      u.wT = (u.wT || 0) - dt; if (u.wT <= 0){ u.wT = rnd(2, 5); u.goal = PEN_AT(); }
      if (u.goal && Math.hypot(u.goal.x - u.x, u.goal.z - u.z) > 0.1){ const n = norm(u.goal.x - u.x, u.goal.z - u.z); moveBy(u, n.x * 0.6 * dt, n.z * 0.6 * dt); faceToward(u, n.x, n.z); }
      if (u.oinkT <= 0){ u.oinkT = rnd(6, 12); say(u, d.hungry > 0 ? '꿀… (배고픔)' : '꿀꿀', 'soft', 1.2); }
      continue;
    }
    // 뽈뽈 도망: 인주 · 청광묵이 가까이 오면
    const threat = [G.player, Cv.ch].find(o => o && Math.hypot(o.x - u.x, o.z - u.z) < 2.6);
    if (threat){
      const n = norm(u.x - threat.x, u.z - threat.z), sp = 2.4 * dt;
      if (!moveBy(u, n.x * sp, n.z * sp)){ const side = (u.uid % 2 ? 1 : -1); moveBy(u, -n.z * sp * side, n.x * sp * side); }
      faceToward(u, n.x, n.z); u.lift = Math.abs(Math.sin(G.t * 18)) * 0.06;
      if (u.oinkT <= 0){ u.oinkT = rnd(1.2, 2.2); say(u, '꿀꿀!', 'soft', 0.8); }
      continue;
    }
    // 냅두면 창고 식량을 훔쳐먹으러 감 (15초마다 하나)
    if (!d.fed && edible()){
      const T = { x: STORE.cx + 1.35, z: STORE.cz };
      if (Math.hypot(T.x - u.x, T.z - u.z) > 0.5){ navTo(u, T.x, T.z, 1.6, dt, 0.3); continue; }
      u.eatT = (u.eatT ?? 1.5) - dt;
      if (u.eatT <= 0){ u.eatT = 15; if (takeMeal()){ d.fed = true; d.hungry = 0; say(u, '냠냠 꿀꿀', 'soft', 1.6); SFX.burst({ type: 'bandpass', f: 500, q: 3, gain: 0.2, dec: 0.3 }); } }
      continue;
    }
    u.wT = (u.wT || 0) - dt; if (u.wT <= 0){ u.wT = rnd(2, 4); const a = rnd(0, 6.3); u.goal = { x: u.x + Math.cos(a) * 1.5, z: u.z + Math.sin(a) * 1.5 }; }
    if (u.goal){ const n = norm(u.goal.x - u.x, u.goal.z - u.z); moveBy(u, n.x * 0.9 * dt, n.z * 0.9 * dt); faceToward(u, n.x, n.z); }
  }
}
function penPig(u){
  u.carrier = null; u.pig.penned = true; const at = PEN_AT(); u.x = at.x; u.z = at.z; u.lift = 0;
  if (PRO.carry && PRO.carry.pig === u) PRO.carry = null;
  dust(u.x, u.z, 8); say(u, '꿀…', 'soft', 1.2); popText(u.x, 1.4, u.z, '우리에 넣음', 'heal', 1.1);
}
const penPigs = () => PRO.pigs.filter(u => !u.dead && u.pig.penned);
function penLabel(){
  if (PRO.carry && PRO.carry.pig) return '돼지를 우리에 넣는다';
  const fl = penFeedLabel(); if (fl) return fl;
  if (PRO.carry) return '우리 (들고 있는 건 다른 곳으로)';
  const hungry = penPigs().filter(u => !u.pig.fed);
  if (hungry.length) return edible() ? `돼지에게 먹이를 준다 (식량 -1)` : '돼지가 배고프다 (창고에 식량이 없음)';
  return '우리를 본다';
}
async function penAction(){
  if (PRO.carry && PRO.carry.pig) return penPig(PRO.carry.pig);
  if (penFeedLabel()) return penFeed();
  if (PRO.carry) return;
  const hungry = penPigs().filter(u => !u.pig.fed);
  if (hungry.length && takeMeal()){ for (const u of hungry){ u.pig.fed = true; u.pig.hungry = 0; say(u, '냠냠 꿀꿀!', 'soft', 1.4); } return; }
  const n = PRO.cave.snails.length, pigs = penPigs().length;
  await textbox('', [`우리: 인광달팽이 ${n}마리${PRO.babies ? ` (새끼 ${PRO.babies})` : ''}${pigs ? ` · 돼지 ${pigs}` : ''}${PRO.eggs.length ? ` · 알 무더기 ${PRO.eggs.length}` : ''}`, '(낮은 나무 울타리. Space로 뛰어넘을 수 있다)']);
}
// 청광묵: 밖에서 돌아다니는 돼지를 잡아 우리로 (가만히 있을 때 시작, 하던 건 끝까지). 무거워서 느려짐
function pigRescue(h, sp, dt){
  if (h.job && h.job.it) return false;
  let R = h.pigJob;
  if (!R){
    const u = PRO.pigs.find(p => !p.dead && !p.pig.penned && !p.carrier && (p.freeT || 0) > 6);
    if (!u) return false;
    if (h.job){ if (h.job.target) h.job.target.claimed = null; h.job = null; }
    R = h.pigJob = { u, phase: 'go' }; say(h, '돼지! 거기 서라!', 'soft', 1.4);
  }
  const u = R.u, pen = PRO.pen, gate = { x: pen.x0 - 1, z: (pen.z0 + pen.z1) / 2 };
  let moving = false;
  if (R.phase === 'go'){
    if (u.dead || u.pig.penned || (u.carrier && u.carrier !== h)){ h.pigJob = null; return false; }
    if (Math.hypot(u.x - h.x, u.z - h.z) > 0.65){ navTo(h, u.x, u.z, sp * 1.05, dt, 0.5); moving = true; }
    else { u.carrier = h; R.phase = 'back'; say(h, '무겁다!', 'soft', 1.2); }
  } else if (R.phase === 'back'){
    if (Math.hypot(gate.x - h.x, gate.z - h.z) > 0.5){ navTo(h, gate.x, gate.z, 1.4, dt, 0.3); moving = true; }
    else { penPig(u); h.pigJob = null; say(h, '들어가라 돼지!', 'soft', 1.4); return false; }
  }
  h.lift = moving ? Math.abs(Math.sin(G.t * 16)) * (R.phase === 'back' ? 0.04 : 0.09) : 0;
  return true;
}
// 하루가 지날 때: 돼지 허기 (5일 넘게 굶으면 죽음) · 달팽이 알 부화 (3일 뒤 새끼 3 ~ 6)
function dayLivestock(){
  const news = [];
  for (const d of PRO.pigData){
    if (d.dead) continue;
    if (!d.fed) d.hungry++;
    d.fed = false;
    if (d.hungry > 5){ d.dead = true; const u = d.u; if (u && !u.dead){ removeUnit(u); u.dead = true; const dd = { k: 'pig_big', name: '돼지 사체', type: 'junk', h: bodyH(u), lie: 1 }; const b = bill(PA + dd.k + '.webp', u.x, u.z, dd.h, { tint: 0.55, lie: 1 }); addLoose(dd, b, u.x, u.z); } news.push('대장… 돼지가 굶어 죽었다…'); }
    else if (d.hungry >= 3) news.push(`대장! 돼지가 ${d.hungry}일째 굶었다!`);
  }
  PRO.pigs = PRO.pigs.filter(u => !u.dead);
  const hatch = PRO.eggs.filter(e => PRO.day - e.day >= 3);
  if (hatch.length){
    let n = 0;
    for (const e of hatch){ const k = 3 + Math.floor(Math.random() * 4); n += k; for (let i = 0; i < k; i++) spawnBaby(); }
    PRO.babies += n; PRO.eggs = PRO.eggs.filter(e => !hatch.includes(e));
    for (const b of PRO.eggBills) G.scene.remove(b.g); PRO.eggBills = PRO.eggs.map(e => bill(PA + 'snail_eggs.webp', e.x, e.z, 0.16, { fit: 0.4, y: 0.01 }));
    news.unshift(`대장! 새끼 달팽이다! ${n}마리!`);
  }
  return news;
}
function livestockHud(){
  const pigs = PRO.pigs.filter(u => !u.dead), maxH = Math.max(0, ...PRO.pigData.filter(d => !d.dead).map(d => d.hungry));
  if (!pigs.length && !PRO.eggs.length && !PRO.babies) return '';
  return `<div class="sp">${pigs.length ? `🐷 돼지 ${pigs.length} (우리 ${penPigs().length}${maxH ? ` · 굶은 지 ${maxH}일` : ''})` : ''}${PRO.eggs.length ? ` · 🥚 알 ${PRO.eggs.length}` : ''}${PRO.babies ? ` · 🐌 새끼 ${PRO.babies}` : ''}</div>`;
}


/* ---------- v0.19 하루 루틴: 끼니 · 불 · 달팽이 먹이 (실시간으로 줄지 않음. 하루가 지날 때만 갱신)
   - 끼니: 각자 그날 한 번 먹어야 함 (창고 식량 1 = 끼니 1, 음식 그릇은 셋이 나눠 먹음). 안 먹고 하루를 넘기면 굶은 날 +1
     먹은 날: 자연 회복 (싸움 밖, 1초에 최대 체력 0.6%, 모닥불 곁 2배) · 잠에 35% 회복 / 굶은 날: 회복 없음 · 밤마다 체력 15% 잃음 (1까지)
   - 불: 아침마다 꺼져 있음 → 장작 더미 20으로 다시 피움 (E). 땔감 쓰레기 (천 쪼가리 · 판자)는 장작 더미로. 폭우가 오면 꺼짐
     불이 있는 날: 곁에서 회복 2배 · 죽은 달팽이를 구울 수 있음 (→ 달팽이구이)
   - 달팽이 먹이: 우리에 이끼 · 버섯이 자람 (아침마다 +2, 최대 8). 밤에 달팽이가 먹음 (어른 1 · 새끼 4마리에 1)
     모자라면 달팽이가 굶음 (알을 안 낳음, 3일 굶으면 한 마리 죽음). 창고 식량 1 = 먹이 2로 넣어 줄 수 있음
     배고프다고 우리 버섯을 따 먹으면 (사람 · 동료) 달팽이 먹이가 줄어듦 */
const FIRE = { x: 5, z: 8 }, WOOD_MAX = 200, FIRE_COST = 20, PEN_MAX = 8;
const RAW_SNAIL = { k: 'snail', name: '죽은 인광달팽이', type: 'food', raw: true, food: 0, h: 0.12 };
const ROAST = { k: 'snail_roast', name: '달팽이구이', type: 'food', food: 2, h: 0.14 };
function buildFire(){
  PRO.woodBill = null; woodPile(); penGarden();
  G.inspect.push({ x: FIRE.x, z: FIRE.z, r: 1.55, far: 6, mark: '모닥불',
    get label(){ const c = PRO.carry;
      if (c && c.d.wood) return `${eul(c.d.name)} 장작 더미에 (장작 +${c.d.wood})`;
      if (c && c.d.raw) return PRO.fireLit ? `${eul(c.d.name)} 굽는다` : '불이 꺼져 있어 구울 수 없다';
      if (c) return '불에 넣을 수 없는 것';
      if (PRO.fireLit) return `모닥불 (오늘 피움 · 장작 더미 ${PRO.wood}) — 곁에 있으면 빨리 회복`;
      return PRO.wood >= FIRE_COST ? `불을 피운다 (장작 ${FIRE_COST} / 더미 ${PRO.wood})` : `불이 꺼졌다 — 장작이 모자람 (${PRO.wood}/${FIRE_COST}, 천 · 판자를 가져오기)`; },
    fn: () => { const c = PRO.carry; if (c){ if (c.d.wood) return feedWood(c); if (c.d.raw && PRO.fireLit) return roast(c); return; } if (!PRO.fireLit && PRO.wood >= FIRE_COST) lightFire(); } });
}
function woodPile(){
  if (PRO.woodBill){ G.scene.remove(PRO.woodBill.g); PRO.woodBill = null; }
  if (PRO.wood > 0) PRO.woodBill = bill(PA + 'log.webp', FIRE.x - 0.55, FIRE.z + 0.75, 0.22 + Math.min(0.3, PRO.wood / 400), { fit: 0.75, tint: 0.85 });
}
function feedWood(it){
  dropCarried(it); PRO.wood = Math.min(WOOD_MAX, PRO.wood + it.d.wood); woodPile();
  popText(FIRE.x, 1.6, FIRE.z, `장작 +${it.d.wood} (${PRO.wood})`, 'heal', 1.1); SFX.thump(150, 0.25, 0.15);
}
async function lightFire(){
  const pl = G.player; G.lock = true;
  for (let k = 0; k < 3; k++){ pl.leanT = 0.3; SFX.clink(0.3); spark(FIRE.x, 0.4, FIRE.z, 0xffc070, 6, 2); await wait(0.4); }
  PRO.wood -= FIRE_COST; PRO.fireLit = true; woodPile();
  spark(FIRE.x, 0.8, FIRE.z, 0xffb050, 18, 3.5); SFX.burst({ type: 'bandpass', f: 900, f2: 300, gain: 0.35, att: 0.02, dec: 0.8 }); popText(FIRE.x, 1.7, FIRE.z, '불이 붙었다!', 'heal', 1.3);
  G.lock = false;
}
function roast(it){
  dropCarried(it); let n = 0;
  popText(FIRE.x, 1.5, FIRE.z, '지글지글…', 'heal', 2.4);
  const iv = setInterval(() => {
    if (G.mode !== 'cave'){ clearInterval(iv); return; }
    spark(FIRE.x, 0.7, FIRE.z, 0xffd080, 5, 2); SFX.burst({ type: 'highpass', f: 2500, gain: 0.12, dec: 0.2 });
    if (++n < 6) return;
    clearInterval(iv);
    const x = FIRE.x + 0.85, z = FIRE.z + 0.55, b = bill(PA + ROAST.k + '.webp', x, z, ROAST.h, { fit: 0.4, tint: 0.95 });
    addLoose(ROAST, b, x, z); popText(x, 1.2, z, '달팽이구이!', 'crit', 1.4);
    const ch = PRO.cave.ch; if (ch.sadT > 0) setTimeout(() => say(ch, '😢', 'emo', 2.4), 800);
  }, 450);
}
function tickFire(dt){
  const f = G.map && G.map.fires[0]; if (!f) return;
  const lit = PRO.fireLit; f.k = lit ? 1 : 0; f.flame.visible = lit;
  if (!lit && Math.random() < dt * 2) dot(f.x + rnd(-0.1, 0.1), rnd(0.2, 0.9), f.z, 0x55506a, 0.06, 1.4);   // 꺼진 불: 연기만
}
// 우리 안 이끼 · 버섯 (달팽이 먹이): 보이는 만큼 그림으로
function penGarden(){
  for (const b of PRO.gardenBills || []) G.scene.remove(b.g);
  PRO.gardenBills = []; const pen = PRO.pen; if (!pen) return;
  const spots = [[0.6, 0.5], [2.2, 0.7], [1.3, 1.6], [0.5, 2.6], [2.4, 2.4], [1.6, 3.0], [0.9, 1.1], [2.0, 1.4]];
  for (let i = 0; i < Math.min(PEN_MAX, PRO.penFood); i++){
    const [dx, dz] = spots[i], k = ['mush1', 'grass', 'mush3', 'grass', 'mush2', 'mush4', 'grass', 'mush1'][i];
    PRO.gardenBills.push(bill(PA + k + '.webp', pen.x0 + 0.5 + dx, pen.z0 + 0.5 + dz, k === 'grass' ? 0.16 : 0.22, { fit: 0.3, tint: 0.85 }));
  }
}
function pickPenFood(){ if (PRO.penFood <= 0) return false; PRO.penFood--; penGarden(); return true; }
const snailNeed = () => { const Cv = PRO.cave; if (!Cv) return 0; const a = Cv.snails.filter(s => !s.baby).length; return a + Math.ceil(PRO.babies / 4); };
const edible = () => PRO.store.some(d => d.food && !d.raw);
const meals = () => PRO.store.reduce((a, d) => a + (d.raw ? 0 : d.food || 0), 0);
function takeMeal(){   // 끼니 하나: 작은 것부터 (음식 그릇은 여럿이 나눠 먹음)
  let best = -1;
  PRO.store.forEach((d, i) => { if (d.food && !d.raw && (best < 0 || d.food < PRO.store[best].food)) best = i; });
  if (best < 0) return null;
  const d = PRO.store[best];
  if (d.food > 1) PRO.store[best] = { ...d, food: d.food - 1 };
  else { PRO.store.splice(best, 1); for (const b of PRO.storeBills) G.scene.remove(b.g); PRO.storeBills = []; PRO.store.forEach((x, k) => pileAdd(x, k)); }
  return d;
}
function storeIdleLabel(){ return `창고를 연다 (${PRO.store.length}개${!PRO.meal.inju.fed && edible() ? ' · 밥 먹기' : ''})`; }
async function storeIdle(){
  if (PRO.meal.inju.fed || !edible()) return showStore();
  const pl = G.player; G.lock = true;
  for (let k = 0; k < 2; k++){ pl.leanT = 0.3; SFX.burst({ type: 'bandpass', f: 500 + k * 20, q: 3, gain: 0.25, dec: 0.3 }); await wait(0.5); }
  const d = takeMeal(); if (d){ PRO.meal.inju.fed = true; popText(pl.x, pl.y + 2, pl.z, `냠 (${d.name})`, 'heal', 1.2); }
  G.lock = false;
}
const nearFire = u => PRO.fireLit && Math.hypot(u.x - FIRE.x, u.z - FIRE.z) < 2.8;
const regenRate = (k, u) => PRO.meal[k].fed ? 0.006 * (nearFire(u) ? 2 : 1) : 0;
function tickBody(dt){
  const Cv = PRO.cave, pl = G.player; if (!Cv || !pl) return;
  if (!G.lobbyFight && !(G.lock && !G.waitInput)){
    if (!pl.downed) pl.hp = Math.min(pl.max, pl.hp + pl.max * regenRate('inju', pl) * dt);
    for (const [k, h] of [['ch', Cv.ch], ['ka', Cv.ka]]) PRO.hpf[k] = Math.min(1, PRO.hpf[k] + regenRate(k, h) * dt);
    for (const s of Cv.snails) if (!s.dead && s.hp < s.max) s.hp = Math.min(s.max, s.hp + 0.4 * dt);
  }
  // 청광묵: 펄쩍 (놀람) · 눈물
  const ch = Cv.ch;
  if (ch.hop > 0){ ch.hop -= dt; ch.lift = Math.max(0, Math.sin((1 - ch.hop / 0.5) * Math.PI)) * 0.7; }
  if (ch.sadT > 45 && Math.random() < dt * 8) dot(ch.x + rnd(-0.18, 0.18), ch.y + bodyH(ch) * 0.62, ch.z + 0.05, 0x7fc8ff, 0.05, 0.5);
}
// 우리 (12, 10)에서: 들고 있는 식량을 먹이로 · 창고 식량으로 먹이 · 배고프면 버섯을 따 먹기
function penFeedLabel(){
  const c = PRO.carry, need = snailNeed();
  if (c && c.d.type === 'food' && !c.d.raw) return `${eul(c.d.name)} 달팽이 먹이로 넣는다 (먹이 +${c.d.food * 2})`;
  if (!c && PRO.penFood < need && edible()) return `창고 식량으로 달팽이 먹이 채우기 (끼니 ${Math.min(meals(), Math.ceil((need - PRO.penFood) / 2))} → 먹이 ${need}${apTag()})`;
  if (!c && !PRO.meal.inju.fed && !edible() && PRO.penFood > 0) return `우리 버섯을 따 먹는다 (달팽이 먹이 -1 · ${PRO.penFood}/${need})`;
  return null;
}
function penFeed(){
  const c = PRO.carry, pl = G.player, need = snailNeed();
  if (c && c.d.type === 'food' && !c.d.raw){ dropCarried(c); PRO.penFood += c.d.food * 2; }
  else if (!c && PRO.penFood < need && edible()){ if (!spendAp()) return; while (PRO.penFood < need && takeMeal()) PRO.penFood += 2; }
  else if (!c && !PRO.meal.inju.fed && PRO.penFood > 0){ pickPenFood(); PRO.meal.inju.fed = true; popText(pl.x, pl.y + 2, pl.z, '버섯 냠 (끼니)', 'heal', 1.2); if (Math.hypot(PRO.cave.ch.x - pl.x, PRO.cave.ch.z - pl.z) < 6) say(PRO.cave.ch, '대장! 그거 달팽이 밥이다!', 'soft', 2); return; }
  penGarden(); popText(12, 1.2, 10, `달팽이 먹이 ${PRO.penFood}/${need}`, 'heal', 1.2); SFX.burst({ type: 'lowpass', f: 600, gain: 0.25, dec: 0.3 });
}
// 하루가 지날 때 (잠): 끼니 · 불 · 달팽이 먹이 정산
function dayBody(){
  const news = [], pl = G.player, Cv = PRO.cave;
  for (const k of mealKeys()){
    const M = PRO.meal[k];
    const sl = 0.35 + (hasPlaced('d_H-120', BED, 2.6) ? 0.2 : 0) - (PRO.nightCold && !hasPlaced('d_H-402') ? 0.25 : 0);   // 침대 곁 +20% · 담요 없이 눈 오는 밤 -25%
    if (M.fed){ M.hd = 0; if (k === 'inju') pl.hp = Math.min(pl.max, pl.hp + pl.max * sl); else PRO.hpf[k] = Math.min(1, PRO.hpf[k] + sl); }
    else { M.hd++; if (k === 'inju') pl.hp = Math.max(1, pl.hp - pl.max * 0.15); else PRO.hpf[k] = Math.max(0.05, PRO.hpf[k] - 0.15); }
    M.fed = false;
  }
  for (const h of mates()){ h.mealT = rnd(2, 8); h.seekT = 0; }
  PRO.sleepHint = false;
  if (PRO.nightCold && !hasPlaced('d_H-402')) news.push('대장… 밤에 추웠다… 담요 있으면 좋겠다…');
  // 석문: 카리우스가 밤새 팜 (먹었으면 4, 굶었으면 1)
  if (PRO.dig < 100){ PRO.dig = Math.min(100, PRO.dig + (PRO.meal.ka.hd ? 1 : 4)); if (PRO.dig >= 100) setTimeout(doorDone, 4000); }
  else if (PRO.jrDone && typeof RPG !== 'undefined'){   // v0.32 채굴: 석문을 연 뒤엔 카리우스가 밤마다 벽을 팜 (먹었을 때만). 금화 · 가끔 쓸 것 (보관함) · 굴 넓히기 진척
    if (!PRO.meal.ka.hd){ const g = 4 + Math.floor(Math.random() * 9); RPG.gold += g; PRO.mine = (PRO.mine || 0) + 5;
      let got = ''; if (Math.random() < 0.3 && typeof rollItem === 'function'){ const id = rollItem(Math.max(1, RPG.depth || 1), { type: 'cons' }), it = makeItem(id); if (it){ RPG.stash.push(it); got = ` · ${itemDef(it).n}`; } }
      news.push(`카리우스가 밤새 팠다… 금화 ${g}${got} (넓히기 ${Math.min(100, PRO.mine)}%)`); if (typeof saveRpg === 'function') saveRpg(); }
    else news.push('카리우스는 굶어서 파지 않았다…');
  }
  PRO.ap = AP_MAX;
  if (PRO.meal.ch.hd) news.push(`대장… 어제 못 먹었다… (${PRO.meal.ch.hd}일째)`);
  // 달팽이: 밤에 우리 먹이를 먹음
  const need = snailNeed();
  if (need){
    if (PRO.penFood >= need){ PRO.penFood -= need; PRO.snailHd = 0; }
    else { PRO.penFood = 0; PRO.snailHd++; news.push(`대장! 달팽이들 배고프다! (${PRO.snailHd}일째)`);
      if (PRO.snailHd >= 3){ const s = Cv.snails.find(x => !x.baby) || Cv.snails[0]; if (s){ kill(s, null); snailDie(s); news.push('…달팽이가 굶어 죽었다…'); } PRO.snailHd = 1; } }
  }
  PRO.penFood = Math.min(PEN_MAX, PRO.penFood + 2); penGarden();   // 밤새 이끼 · 버섯이 자람
  PRO.fireLit = false;   // 아침이면 불이 꺼져 있음
  return news;
}
/* ---------- 달팽이 체력 (싸움 · 인주가 때릴 때)
   인주가 때리면: 청광묵이 펄쩍 놀라며 "뭐하는거냣! 대장! 아직 안된다!" → 달려와 말림 (밀어내고 잠깐 못 때리게)
   그래도 죽이면: 청광묵이 주저앉아 엉엉 욺 (한동안 슬픔). 죽은 달팽이는 모닥불에 구우면 달팽이구이 */
const _hurtBase = hurt;
hurt = function(att, tgt, base, o){
  const was = tgt.dead, r = _hurtBase(att, tgt, base, o);
  if (tgt.D && tgt.D.hittable && G.mode === 'cave' && PRO.cave) snailHit(att, tgt, !was && tgt.dead);
  if (r > 0 && (G.mode === 'cave' || G.mode === 'prologue') && !tgt.D.hittable && !tgt.D.dummy){ bloodHit(tgt, r); }
  return r;
};
function snailHit(att, s, died){
  const ch = PRO.cave.ch;
  if (s.st2 === 'carried' && s.carrier && s.carrier.rescue){ s.carrier.rescue = null; }
  if (att === G.player && !G.lobbyFight && !died && !(ch.sadT > 45)){
    if (ch.job){ if (ch.job.it){ const it = ch.job.it; it.carrier = null; it.claimed = null; it.x = ch.x; it.z = ch.z; it.b.g.position.set(ch.x, heightAt(G.map, ch.x, ch.z), ch.z); it.insp.x = ch.x; it.insp.z = ch.z; } else if (ch.job.target) ch.job.target.claimed = null; ch.job = null; }
    if (ch.potty){ ch.potty = null; ch.group.visible = true; }
    ch.wander = null; ch.eat = false;
    if (!ch.stopPl){ ch.hop = 0.5; say(ch, '뭐하는거냣! 대장! 아직 안된다!', 'big', 2.4); SFX.burst({ type: 'bandpass', f: 900, f2: 1400, q: 3, gain: 0.3, att: 0.02, dec: 0.3 }); }
    else say(ch, ['대장!! 그만!!', '안된다! 안된다!!'][Math.floor(Math.random() * 2)], 'big', 1.8);
    ch.stopPl = { t: 5, held: false };
  }
  if (died) snailDie(s);
}
function snailDie(s){
  const Cv = PRO.cave, ch = Cv.ch;
  Cv.snails = Cv.snails.filter(o => o !== s);
  if (s.baby) PRO.babies = Math.max(0, PRO.babies - 1); else PRO.snailLost++;
  if (s.carrier){ s.carrier = null; } if (ch.rescue && ch.rescue.s === s) ch.rescue = null;
  setTimeout(() => removeUnit(s), 900);
  const d = { ...RAW_SNAIL, name: s.baby ? '죽은 새끼 달팽이' : RAW_SNAIL.name, h: bodyH(s) }, x = s.x, z = s.z;
  bloodBurst(x, z, 0.3, 0x2fbfa0); bloodPool(x, z, 0.28, 1.2, 0x1f7f6a);   // 달팽이 체액 (청록)
  setTimeout(() => { if (G.mode !== 'cave') return; const b = bill(PA + d.k + '.webp', x, z, d.h, { tint: 0.5 }); b.m.rotation.z = Math.PI * 0.94; addLoose(d, b, x, z); }, 900);
  ch.stopPl = null; ch.sadT = 75; ch.hop = 0; ch.job = null;
  say(ch, '아…', 'soft', 1.2);
  setTimeout(() => PRO.cave && say(ch, '달팽이…!! 으아아아앙!!', 'big', 2.6), 1300);
  setTimeout(() => PRO.cave && say(ch, '😭', 'emo', 2.6), 4200); PRO.cave.cuteT = 7;
}
function stopPlayer(h, sp, dt){
  const S = h.stopPl, pl = G.player; S.t -= dt;
  let moving = false;
  const d = Math.hypot(pl.x - h.x, pl.z - h.z);
  if (!S.held){
    if (d > 0.95){ navTo(h, pl.x, pl.z, sp * 1.25, dt, 0.8); moving = true; }
    else {
      S.held = true;
      const s0 = nearest(pl, PRO.cave.snails, 6), n = s0 ? norm(pl.x - s0.x, pl.z - s0.z) : norm(pl.x - h.x, pl.z - h.z);
      moveBy(pl, n.x * 0.9, n.z * 0.9); P.atkCd = Math.max(P.atkCd || 0, 1.6);
      say(h, '안된다!! 대장!', 'soft', 1.6); popText(pl.x, pl.y + 2, pl.z, '말림', 'miss', 1); SFX.thump(140, 0.3, 0.2); camShake(0.08, 0.15);
    }
  } else h.face = Math.sign(pl.x - h.x) || h.face;
  if (S.t <= 0){ h.stopPl = null; say(h, '…달팽이 아직 안된다. 알 낳아야 한다.', 'soft', 2.2); }
  hMove(h, moving);
}

/* ---------- 아래 창 (v0.19, 민수 스케치): 화면 아래를 넓게. 왼쪽 = 초상화 세로 셋 + 옆에 체력 · 끼니 줄 / 오른쪽 = 아이콘 목록 (오늘 할 일 · 창고 · 불 · 달팽이 · 날)
   가끔 그 위로 대사. 3D 화면은 이 창 위쪽에 맞춰 그림 (굴 전체가 창에 가리지 않게) */
const BAR_WHO = [['inju', '인주', 'assets/inju_face.png'], ['ch', '청광묵', PA + 'goblin_face.webp'], ['ka', '카리우스', PA + 'karius_face.webp'], ['reb', '레베카', PA + 'rebecca_face.webp']];
function caveBarInit(){
  const el = $p('cavebar');
  el.innerHTML = '<div class="talk"><em></em><span></span></div><div class="people">' + BAR_WHO.map(([k, n, src]) => `<div class="who" data-k="${k}"><img src="${src}" alt=""><div class="nm">${n}<small></small></div><div class="g hp"><b></b><i></i></div><div class="meal"></div></div>`).join('') + '</div><div class="st"></div>';
  PRO.bar = { el, talk: el.querySelector('.talk'), rows: Object.fromEntries(BAR_WHO.map(([k]) => { const r = el.querySelector(`[data-k="${k}"]`); return [k, { st: r.querySelector('small'), hp: r.querySelector('.hp b'), hpn: r.querySelector('.hp i'), meal: r.querySelector('.meal'), r }]; })), st: el.querySelector('.st'), talkT: 0, last: '', lastP: {} };
}
function barTalk(name, text, life){
  const B = PRO.bar; if (!B) return;
  B.talk.querySelector('em').textContent = name; B.talk.querySelector('span').textContent = text;
  B.talk.classList.add('on'); B.talkT = G.t + life;
}
function caveBar(){
  const B = PRO.bar, el = $p('cavebar'), on = G.mode === 'cave' && !!PRO.cave && !PRO.caveIntro && !!B && !PRO.bossCam;
  el.hidden = !on; document.body.classList.toggle('cavebar', on);
  PRO.barH = on && !document.body.classList.contains('cine') ? el.offsetHeight + 14 : 0;
  $p('prompt').style.bottom = on ? (el.offsetHeight + 46) + 'px' : ''; $p('guide').style.bottom = on ? (el.offsetHeight + 96) + 'px' : '';
  if (!on) return;
  const Cv = PRO.cave, pl = G.player;
  const hp = { inju: [pl.hp, pl.max], ch: G.lobbyFight ? [Cv.ch.hp, Cv.ch.max] : [PRO.hpf.ch * DEFS.cheongAlly.hp, DEFS.cheongAlly.hp], ka: G.lobbyFight ? [Cv.ka.hp, Cv.ka.max] : [PRO.hpf.ka * DEFS.kariusAlly.hp, DEFS.kariusAlly.hp], reb: [(PRO.hpf.reb || 1) * 100, 100] };
  for (const [k] of BAR_WHO){
    const R = B.rows[k]; R.r.hidden = k === 'reb' && !PRO.rebOut; if (R.r.hidden) continue;
    const [h, m] = hp[k], M = PRO.meal[k];
    R.hp.style.width = Math.max(0, h / m * 100) + '%'; R.hpn.textContent = `${Math.max(0, Math.round(h))}/${m}`;
    const sad = k === 'ch' && Cv.ch.sadT > 0, down = (k === 'ch' && Cv.ch.downed) || (k === 'ka' && Cv.ka.downed) || (k === 'inju' && pl.downed);
    const st = down ? '쓰러짐' : sad ? '😢' : (M.fed && h < m * 0.999 && !G.lobbyFight ? '회복 중' : '');
    const meal = M.fed ? '🍖 오늘 먹음' : M.hd ? `😫 배고픔 · 굶은 지 ${M.hd}일` : '🤤 배고픔 · 아직 안 먹음';
    const key = st + '|' + meal;
    if (B.lastP[k] !== key){ B.lastP[k] = key; R.st.textContent = st; R.meal.textContent = meal; R.meal.className = 'meal ' + (M.fed ? 'ok' : M.hd ? 'bad' : 'warn'); }
  }
  if (B.talkT && G.t > B.talkT){ B.talk.classList.remove('on'); B.talkT = 0; }
  const W = PRO.storm ? STORMS[PRO.storm] : WEATHER[PRO.weather], need = snailNeed(), fedN = mealKeys().filter(k => PRO.meal[k].fed).length, nMeal = mealKeys().length;
  const pigs = PRO.pigs.filter(u => !u.dead).length, rot = PRO.trash.filter(t => t.rot > 0).length;
  const ck = (ok, t) => `<span class="${ok ? 'ok' : 'todo'}">${ok ? '✔' : '☐'} ${t}</span>`;
  const apDots = '●'.repeat(PRO.ap) + '○'.repeat(Math.max(0, AP_MAX - PRO.ap)), E = PRO.equip;
  const html = `<div class="ap-row">행동 <b>${apDots}</b> <small>${PRO.ap}/${AP_MAX}</small> · ⛏ 석문 <b>${Math.floor(PRO.dig)}%</b>${PRO.dig >= 100 && !PRO.jrDone ? ' <b class="bad">열 수 있음</b>' : ''}</div><div class="todo-row">${ck(fedN === nMeal, `밥 ${fedN}/${nMeal}`)}${ck(PRO.fireLit, '불')}${ck(PRO.penFood >= need, '달팽이 먹이')}${PRO.trash.length ? ck(PRO.didBury, '묻기') : ''}</div>`
    + `<div><i>📦</i> 창고 ${PRO.store.length} · 끼니 ${meals()}${PRO.carry ? ` · ✋ ${PRO.carry.d.name} <b class="warn">(G 내려놓기)</b>` : ''}${E.weapon || E.armor ? ` · ${E.weapon ? '🗡' : ''}${E.armor ? '🛡' : ''}` : ''}</div>`
    + `<div><i>🔥</i> ${PRO.fireLit ? '불 피움' : '<b class="bad">불 꺼짐</b>'} · 장작 ${PRO.wood}${PRO.trash.length ? ` · 🗑 ${PRO.trash.length}${rot ? ` <b class="warn">(썩음 ${rot})</b>` : ''}` : ''}</div>`
    + `<div><i>🐌</i> ${Cv.snails.filter(s => !s.baby).length}${PRO.babies ? `+${PRO.babies}` : ''} · 먹이 <b class="${PRO.penFood >= need ? '' : 'warn'}">${PRO.penFood}/${need}</b>${PRO.snailHd ? ` <b class="bad">굶음 ${PRO.snailHd}일</b>` : ''}${PRO.eggs.length ? ` · 🥚 ${PRO.eggs.length}` : ''}${pigs ? ` · 🐷 ${pigs}` : ''}</div>`
    + `<div class="day"><i>☾</i> ${PRO.day}일째 · ${W.icon} ${W.name} · ${Cv.dropped ? '낙하 끝 — 잠자리에서 하루를 마침' : `낙하까지 ${Math.max(0, Math.ceil(Cv.dropT))}초`}</div>`;
  if (html !== B.last){ B.st.innerHTML = html; B.last = html; }

}


/* ---------- v0.19 피: 맞으면 튐 (방울 + 바닥에 작은 자국) · 쓰러지면 크게 튀고 바닥에 웅덩이가 천천히 번짐
   핏자국은 시체를 치워도 남음 → 하루가 지날 때마다 바래고 이틀 뒤 사라짐 */
let bloodTex = null;
function bloodTexture(){
  if (bloodTex) return bloodTex;
  bloodTex = canvasTex(256, 256, (c, w, h) => {
    const blob = (x, y, r, a) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(0.7, `rgba(255,255,255,${a * 0.9})`); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
    blob(128, 128, 78, 0.95);
    for (let i = 0; i < 14; i++){ const a = Math.random() * 6.3, d = 50 + Math.random() * 55; blob(128 + Math.cos(a) * d, 128 + Math.sin(a) * d * 0.8, 10 + Math.random() * 26, 0.9); }
    for (let i = 0; i < 22; i++){ const a = Math.random() * 6.3, d = 95 + Math.random() * 25; blob(128 + Math.cos(a) * d, 128 + Math.sin(a) * d * 0.85, 3 + Math.random() * 6, 0.85); }
  });
  return bloodTex;
}
function bloodPool(x, z, r, grow = 2, color = 0x3a0407){
  if (!G.scene) return;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: bloodTexture(), color, transparent: true, opacity: 0.92, depthWrite: false, fog: false }));
  m.rotation.x = -Math.PI / 2; m.rotation.z = rnd(0, 6.3); m.position.set(x, 0.012 + Math.random() * 0.004, z); m.scale.setScalar(0.01);
  G.scene.add(m); G.props.push(m);
  const st = { m, r: r * 2, t0: G.t, grow, age: 0 }; (PRO.stains = PRO.stains || []).push(st);
  if (!PRO.stainTick){ PRO.stainTick = true; }
  return st;
}
function bloodBurst(x, z, hgt, color = 0x9a0f16){
  spark(x, Math.max(0.4, hgt * 0.55), z, color, 26, 4.5); spark(x, Math.max(0.3, hgt * 0.4), z, 0x5a080c, 14, 2.6);
  for (let i = 0; i < 6; i++){ const a = rnd(0, 6.3), d = rnd(0.4, 1.3); bloodPool(x + Math.cos(a) * d, z + Math.sin(a) * d, rnd(0.05, 0.13), 0.25, color === 0x9a0f16 ? 0x5a0a0e : 0x1f7f6a); }
}
function bloodHit(u, dmg){
  if (u.dead && u.fading) return;
  spark(u.x, u.y + bodyH(u) * 0.55, u.z, 0xa0101a, Math.min(16, 4 + Math.round(dmg / 3)), 3.2);
  if (Math.random() < 0.55) bloodPool(u.x + rnd(-0.35, 0.35), u.z + rnd(-0.35, 0.35), rnd(0.06, 0.12) + Math.min(0.12, dmg / 250), 0.3);
}
function tickStains(){
  for (const st of PRO.stains || []){ if (st.done) continue; const k = clamp((G.t - st.t0) / st.grow, 0, 1), e = 1 - (1 - k) * (1 - k); st.m.scale.setScalar(Math.max(0.01, st.r * e)); if (k >= 1) st.done = true; }
}
function ageStains(){
  PRO.stains = (PRO.stains || []).filter(st => { st.age++; if (st.age >= 2){ G.scene.remove(st.m); return false; } st.m.material.opacity *= 0.5; st.m.material.color.multiplyScalar(0.8); return true; });
}


/* ---------- v0.20 보이기: 낙하물 바닥 고리 (종류 색) · 지금 E 대상 노란 고리 · 할 일 화살표 ---------- */
const TYPE_COL = { food: 0x5fd38a, supply: 0x4ab0ff, equip: 0xffcf4a, furn: 0xc89a6a, junk: 0x9aa0a8, wood: 0xff9a3a, raw: 0x2fbfa0, live: 0xff8fb0 };
let ringGeo = null;
function typeRing(d, x, z){
  if (!G.scene) return null;
  ringGeo = ringGeo || new THREE.RingGeometry(0.3, 0.4, 28);
  const c = d.raw ? TYPE_COL.raw : d.wood ? TYPE_COL.wood : TYPE_COL[d.type] || 0xffffff;
  const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.8, depthWrite: false, fog: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, 0.03, z); G.scene.add(m); G.props.push(m); return m;
}
function tickSelect(){
  if (!G.scene) return;
  if (!PRO.selRing || !PRO.selRing.parent){
    PRO.selRing = new THREE.Mesh(new THREE.RingGeometry(0.46, 0.56, 32), new THREE.MeshBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0.9, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
    PRO.selRing.rotation.x = -Math.PI / 2; G.scene.add(PRO.selRing); G.props.push(PRO.selRing);
  }
  const it = G.nearIt, R = PRO.selRing, on = !!it && (G.mode === 'cave' || G.mode === 'prologue');
  R.visible = on; if (!on) return;
  const x = it.unit ? it.unit.x : it.x, z = it.unit ? it.unit.z : it.z, k = (it.unit ? Math.max(0.8, it.unit.r * 2.4) : 1) * (1 + 0.06 * Math.sin(G.t * 6));
  R.position.set(x, 0.035, z); R.scale.setScalar(k);
}
// 할 일 화살표: 아직 안 한 일의 자리 위에 ▼ (싸움 · 연출 중엔 숨김)
function todoMarks(){
  const host = UI.layer; PRO.todoEls = PRO.todoEls || {};
  const Cv = PRO.cave, show = G.mode === 'cave' && Cv && !G.lock && !G.waitInput && !G.lobbyFight && !PRO.caveIntro;
  const need = show ? snailNeed() : 0;
  const list = !show ? [] : [
    !PRO.meal.inju.fed && edible() && ['meal', '밥', STORE.cx, STORE.cz],
    !PRO.fireLit && PRO.wood >= FIRE_COST && ['fire', '불', FIRE.x, FIRE.z],
    PRO.penFood < need && ['pen', '먹이', 12, 10],
    PRO.trash.length && !PRO.didBury && ['bury', '묻기', PIT.x, PIT.z],
  ].filter(Boolean);
  const allDone = show && readyToSleep() && (PRO.ap <= 0 ? !list.some(l => l[0] === 'meal' || l[0] === 'fire') : true);
  if (allDone) list.splice(0, list.length, ['sleep', '잠자리', BED.x, BED.z]);   // 다 했으면 잠자리만
  if (allDone && !PRO.sleepHint){ PRO.sleepHint = true; guide(PRO.ap <= 0 ? '너무 피곤합니다. 더 이상 할 수 있는 것이 없습니다. — <em>잠자리</em>로' : '할 일을 다 한 것 같습니다. 더 이상 할 수 있는 것이 없습니다. 너무 피곤합니다. — <em>잠자리</em>로', 7); }
  const keep = () => new Set(list.map(l => l[0]));
  const kept = keep();
  for (const k of Object.keys(PRO.todoEls)) if (!kept.has(k)){ PRO.todoEls[k].remove(); delete PRO.todoEls[k]; if (PRO.todoRings && PRO.todoRings[k]){ G.scene.remove(PRO.todoRings[k]); delete PRO.todoRings[k]; } }
  PRO.todoRings = PRO.todoRings || {};
  for (const [k, t, x, z] of list){
    let el = PRO.todoEls[k]; if (!el){ el = PRO.todoEls[k] = document.createElement('div'); el.className = 'todoMark'; el.textContent = t; host.appendChild(el); }
    let rg = PRO.todoRings[k]; if (!rg || !rg.parent){ rg = PRO.todoRings[k] = new THREE.Mesh(new THREE.RingGeometry(0.75, 0.95, 40), new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })); rg.rotation.x = -Math.PI / 2; G.scene.add(rg); G.props.push(rg); }
    rg.position.set(x, 0.04, z); rg.material.opacity = 0.35 + 0.35 * Math.sin(G.t * 4); rg.scale.setScalar(1 + 0.08 * Math.sin(G.t * 4));   // 바닥에 그 자리 표시
    const p = toScreen(x, 1.15, z, UI.W, UI.H); el.style.display = p.behind ? 'none' : 'block'; el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-100%)`;
    el.style.opacity = Math.hypot(G.player.x - x, G.player.z - z) < 1.6 ? 0.25 : 1;
  }
}


/* ---------- v0.20 하루 행동 수: 큰 일 (불 · 달팽이 먹이 채우기 · 쓰레기 묻기 · 천막 · 석문 파기)은 하루 4번까지. 밥 · 나르기 · 창고는 공짜 ---------- */
const AP_MAX = 10;   // v0.32: 하루 행동 10 (초반은 넉넉하게). v0.22: 불 피우기 · 장작 넣기는 행동을 안 씀 (지쳐도 불은 피움)
const apTag = () => PRO.ap > 0 ? ' · 행동 1' : ' — 오늘은 지쳤다';
function spendAp(){
  const pl = G.player;
  if (PRO.ap <= 0){ popText(pl.x, pl.y + 2, pl.z, '오늘은 지쳤다 (내일)', 'miss', 1.4); SFX.thump(80, 0.2, 0.15); return false; }
  PRO.ap--; return true;
}

/* ---------- v0.20 석문 = 긴 목표: 앞을 돌무더기가 막고 있음. 파서 걷어냄 (인주 하루 행동 1 = +8, 망치면 +12 · 카리우스는 밤마다 +4, 굶으면 +1)
   다 걷어내면 하늘이 울고, 석문을 열면 적뢰가 굴 한가운데로 강림 (보스전). 이기면 석문 너머 계단 */
const RUBBLE = [[9.0, 1.95, 'rock1', 1.25], [8.2, 2.15, 'rock2', 0.95], [9.9, 2.1, 'rock3', 0.85], [10.5, 2.35, 'rock2', 0.8], [8.6, 2.55, 'rock3', 0.7], [9.5, 2.6, 'rock1', 0.85], [7.9, 2.5, 'rock1', 0.7], [10.1, 2.75, 'rock3', 0.6]];
function buildRubble(){
  for (const b of PRO.rubble || []) G.scene.remove(b.g);
  const n = Math.ceil((100 - PRO.dig) / 100 * RUBBLE.length);
  PRO.rubble = RUBBLE.slice(0, n).map(([x, z, k, h]) => bill(PA + k + '.webp', x, z, h, { fit: 1.3, tint: 0.62 }));
}
function doorLabel(){
  if (PRO.dig < 100) return `석문 앞 돌무더기를 판다 (${Math.floor(PRO.dig)}%${apTag()})`;
  if (!PRO.jrDone) return '석문을 연다 — 적뢰가 강림한다 (준비가 됐으면)';
  return '석문 너머 — 원정을 떠난다';
}
async function doorAction(){
  if (PRO.dig >= 100){
    if (PRO.jrDone){ if (PRO.ap <= 0) return textbox('', ['오늘은 너무 지쳤다. 원정은 내일 아침에.']); return expPrepOpen(); }
    return jeokroeDescend();
  }
  if (!spendAp()) return;
  const pl = G.player, w = PRO.equip.weapon && EQUIP[PRO.equip.weapon.k], gain = w && w.dig ? 12 : 8; G.lock = true;
  for (let k = 0; k < 4; k++){ pl.leanT = 0.3; SFX.clink(0.45); spark(9 + rnd(-0.6, 0.6), 0.6, 2.4, 0xffe0b0, 6, 2.5); dust(9 + rnd(-0.8, 0.8), 2.5, 6); camShake(0.06, 0.1); await wait(0.42); }
  PRO.dig = Math.min(100, PRO.dig + gain); buildRubble();
  popText(9, 2.2, 2.6, `석문 ${Math.floor(PRO.dig)}% (+${gain})`, 'heal', 1.4); G.lock = false;
  if (PRO.dig >= 100) doorDone(); else if (Math.random() < 0.4) say(PRO.cave.ka, '…캉.', 'soft', 1);
}
function doorDone(){
  if (G.mode !== 'cave' || !PRO.cave) return;
  buildRubble(); caption('석문', '돌무더기를 다 걷어냈다 — 하늘이 운다');
  SFX.thunder(); flashScreen('#ffe8e8', 0.45); camShake(0.25, 0.6);
  setTimeout(() => PRO.cave && say(PRO.cave.ch, '대장… 하늘이 운다… 준비하고 열어라…', 'soft', 3), 1200);
}
async function jeokroeDescend(){
  const C = LOBBY_C; G.lock = true; letterbox(true);
  battleReady({ x: C.x, z: C.z });
  camWide(C.x, C.z + 1, ...lens(7, 9), 99);
  G.rain.on = true;
  await wait(0.5); flashScreen('#ffffff', 0.5); camShake(0.15, 0.3); SFX.thunder();
  await wait(0.9); flashScreen('#ffe8e8', 0.6); camShake(0.2, 0.3); SFX.thunder();
  await wait(0.6);
  const streak = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color: 0xff3020, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  streak.scale.set(1.2, 6, 1); streak.position.set(C.x, 24, C.z); G.scene.add(streak);
  const t0 = G.t; await waitUntil(() => { const k = Math.min(1, (G.t - t0) / 0.4); streak.position.y = 24 - 21 * k; return k >= 1; });
  G.scene.remove(streak);
  flashScreen('#ffffff', 0.9); camShake(0.6, 0.5); ring(C.x, C.z, 0xff5040, 5, 0.6); dust(C.x, C.z, 24); spark(C.x, 1, C.z, 0xff8060, 30, 9); SFX.boom(1.6);
  const boss = spawn('jeokroe', C.x, C.z, 'enemy'); G.boss = boss; boss.alert = true; boss.band = 'lobby'; setAim(boss, G.player.x, G.player.z);
  G.rain.freeze = 1.3; await wait(1.3);
  CAM.wide = null; bossCam(true);
  startLobbyFight();
  const prev = G.onKill; G.onKill = u => { if (u === G.boss) jrDown(u); else if (prev) prev(u); };
  bossInit(boss, { x: C.x, z: C.z }); boss.B.cd.kick = 7; boss.B.cd.punch = 2; boss.B.cd.laser = 9; boss.B.cd.jump = 10;   // v0.32: 강림하자마자 날아차기 → 없앰 (숨 고르고 시작)
  popText(boss.x, boss.y + 4.4, boss.z, '…', 'alert', 1.5);
  $('bossbar').hidden = false; $('bossname').textContent = '적뢰 — 붉은 날개의 천사';
  letterbox(false); G.lock = false;
}
async function jrDown(u){
  G.slow = 0.25; setPose(u, 'hurt'); u.lift = 0; u.airborne = false;
  await wait(0.6); G.slow = 1; G.lock = true; letterbox(true); await wait(1.2);
  $('bossbar').hidden = true; G.boss = null; G.rain.on = PRO.storm === 'downpour'; bossCam(false);
  for (const e of foes()) removeUnit(e);
  await textbox('', ['적뢰가 무너집니다.', '대리석이 빗속에서 식어 갑니다.', '석문이 천천히 열립니다. 아래로 끝없는 계단.']);
  PRO.jrDone = true; endLobbyFight(true); letterbox(false); G.lock = false;
  if (typeof proSave === 'function') proSave();
  setTimeout(() => G.mode === 'cave' && guide('석문이 열렸다 — <em>석문</em>에서 <em>원정</em>을 떠날 수 있다 · <em>I</em> 가방 · 장비', 7), 1500);
}

/* ---------- v0.20 창고 창: 먹기 · 물약 / 붕대 (치료 스킬 대신) · 장비 장착 · 가구 꺼내 놓기 ---------- */
const HEAL = { 'd_I-037': 0.5, 'd_I-061': 0.25 };
const TAME = [['ch', '청광묵'], ['reb', '레베카']];   // v0.32 손으로 먹이를 줄 수 있는 (길들일 수 있는) 동료. 카리우스는 혼자 먹음. 청광묵은 받을 때마다 유대 +1 (3마다 힘 · 체력 +1)
const EQUIP = { 'd_EQ-005': { slot: 'weapon', atk: 6, note: '공격 +6' }, 'd_EQ-123': { slot: 'weapon', atk: 9, dig: true, note: '공격 +9 · 석문 파기 +4' }, 'd_EQ-340': { slot: 'armor', hp: 50, note: '체력 +50' } };
const FURN_NOTE = { 'd_H-120': '잠자리 곁에 두면 잠 회복 +20%', 'd_H-402': '눈 오는 밤 추위를 막음', 'd_H-101': '불빛 (굴이 밝아짐)' };
const hasPlaced = (k, near, r) => PRO.placed.some(p => p.k === k && (!near || Math.hypot(p.x + 0.5 - near.x, p.z - near.z) <= r));
function applyEquip(fill){
  const pl = G.player; if (!pl) return; const w = PRO.equip.weapon && EQUIP[PRO.equip.weapon.k], a = PRO.equip.armor && EQUIP[PRO.equip.armor.k];
  const max = DEFS.player.hp + (a ? a.hp : 0), ratio = pl.hp / pl.max;
  // v0.30: 인주 수치는 RPG (rpg.js)가 정함. 창고의 옛 장비는 RPG 장비로 바뀜
  if (typeof applyHero === 'function'){ applyHero(pl, hero('inju')); return; }
  pl.atk = DEFS.player.atk + (w ? w.atk : 0); pl.max = max; pl.hp = fill ? max * Math.min(1, ratio) : Math.min(max, pl.hp);
}
function openStore(){ if (PRO.menu) return; PRO.menu = true; G.lock = true; renderStore(); $p('storeMenu').hidden = false; }
function closeStore(){ $p('storeMenu').hidden = true; PRO.menu = false; G.lock = false; }
addEventListener('keydown', e => { if (PRO.menu && (e.code === 'Escape' || e.code === 'KeyE' || e.code === 'Tab')){ e.preventDefault(); pressed.delete(e.code); closeStore(); } });
function renderStore(){
  const box = $p('storeMenu').querySelector('.sm-body'), groups = new Map();
  PRO.store.forEach((d, i) => { const key = d.name; if (!groups.has(key)) groups.set(key, { d, idx: [], n: 0, food: 0 }); const g = groups.get(key); g.idx.push(i); g.n++; g.food += d.raw ? 0 : d.food || 0; });
  const fed = PRO.meal.inju.fed, E = PRO.equip;
  const eqRow = (slot, t) => E[slot] ? `<div class="sm-eq"><span>${t}</span><img src="${PA + E[slot].k}.webp" alt=""><b>${E[slot].name}</b><small>${EQUIP[E[slot].k].note}</small><button data-a="unequip" data-s="${slot}">벗기</button></div>` : `<div class="sm-eq off"><span>${t}</span><b>없음</b></div>`;
  const hj = typeof hero === 'function' ? hero('inju') : null, wq = hj && hj.eq.weapon ? itemDef(hj.eq.weapon).n : '맨손';
  let h = `<div class="sm-equip"><div class="sm-eq"><span>장비</span><b>${wq}</b><small>I 키 — 가방 · 장비 창</small></div></div>`;
  if (!groups.size) h += '<div class="sm-empty">창고가 비어 있다.</div>';
  for (const [name, g] of groups){
    const d = g.d, [tn, tc] = d.wood ? ['땔감', 'twood'] : DROP_TYPE[d.type] || ['', ''];
    let btn = '', note = '';
    if (d.type === 'food' && !d.raw){ note = `끼니 ${g.food}`; btn = (fed ? '<button disabled>오늘 먹음</button>' : `<button data-a="eat" data-i="${g.idx[0]}">먹기</button>`) + TAME.filter(([k]) => PRO.meal[k] && (k !== 'reb' || PRO.rebOut)).map(([k, n]) => PRO.meal[k].fed ? `<button disabled>${n} 먹음</button>` : `<button data-a="feed" data-w="${k}" data-i="${g.idx[0]}">${n}에게 주기</button>`).join(''); }
    else if (HEAL[d.k]){ note = `체력 +${HEAL[d.k] * 100}%`; btn = [['inju', '인주'], ['ch', '청광묵'], ['ka', '카리우스']].concat(PRO.rebOut ? [['reb', '레베카']] : []).map(([k, n]) => `<button data-a="heal" data-w="${k}" data-i="${g.idx[0]}">${n}</button>`).join(''); }
    else if (EQUIP[d.k]){ note = EQUIP[d.k].note; btn = `<button data-a="equip" data-i="${g.idx[0]}">장착</button>`; }
    else if (d.type === 'furn' || d.k === 'd_H-402'){ note = FURN_NOTE[d.k] || '굴 꾸미기'; btn = `<button data-a="take" data-i="${g.idx[0]}">꺼내 놓기</button>`; }
    h += `<div class="sm-row"><img src="${PA + d.k}.webp" alt=""><b>${name}${g.n > 1 ? ` ×${g.n}` : ''}</b><span class="tag ${tc}">${tn}</span><small>${note}</small><span class="sm-btns">${btn}</span></div>`;
  }
  box.innerHTML = h;
  $p('storeMenu').querySelector('.sm-head small').innerHTML = `인주 ${Math.round(G.player.hp)}/${G.player.max} · 청광묵 ${Math.round(PRO.hpf.ch * 100)}% · 카리우스 ${Math.round(PRO.hpf.ka * 100)}%${PRO.rebOut ? ` · 레베카 ${Math.round(PRO.hpf.reb * 100)}%` : ''} <button data-a="close" class="sm-close">닫기 ✕</button>`;
}
function storeTake(i){ const d = PRO.store.splice(i, 1)[0]; for (const b of PRO.storeBills) G.scene.remove(b.g); PRO.storeBills = []; PRO.store.forEach((x, k) => pileAdd(x, k)); return d; }
$p('storeMenu').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return; e.stopPropagation();
  const a = b.dataset.a, i = +b.dataset.i, pl = G.player;
  if (a === 'close') return closeStore();
  if (a === 'eat'){ const d = PRO.store[i]; if (d.food > 1) PRO.store[i] = { ...d, food: d.food - 1 }; else storeTake(i); PRO.meal.inju.fed = true; popText(pl.x, pl.y + 2, pl.z, `냠 (${d.name})`, 'heal', 1.2); SFX.burst({ type: 'bandpass', f: 500, q: 3, gain: 0.25, dec: 0.3 }); }
  if (a === 'feed'){ const d = PRO.store[i], w = b.dataset.w, u = PRO.cave[w]; if (d.food > 1) PRO.store[i] = { ...d, food: d.food - 1 }; else storeTake(i); PRO.meal[w].fed = true;
    const hk = w === 'ch' ? 'cheong' : null, h = hk && typeof hero === 'function' ? hero(hk) : null; let bond = 0;
    if (h){ h.bond = (h.bond || 0) + 1; bond = h.bond; if (h.bond % 3 === 0){ h.attr.str++; h.attr.vit++; } }
    if (u){ popText(u.x, u.y + 2.2, u.z, `냠! (${d.name})${bond ? ` · 유대 ${bond}` : ''}`, 'heal', 1.4); say(u, w === 'ch' ? ['대장이 줬다!', '대장… 맛있다…', '대장 최고다!'][Math.floor(Math.random() * 3)] : '…고마워.', 'soft', 1.8); }
    if (bond && bond % 3 === 0) caption('유대', `${h.name} — 힘 +1 · 체력 +1 (유대 ${bond})`);
    SFX.burst({ type: 'bandpass', f: 600, q: 3, gain: 0.25, dec: 0.3 }); }
  if (a === 'heal'){ const d = storeTake(i), k = HEAL[d.k], w = b.dataset.w;
    if (w === 'inju') pl.hp = Math.min(pl.max, pl.hp + pl.max * k); else PRO.hpf[w] = Math.min(1, PRO.hpf[w] + k);
    const u = w === 'inju' ? pl : PRO.cave[w]; popText(u.x, u.y + 2, u.z, `+${k * 100}% (${d.name})`, 'heal', 1.3); spark(u.x, 1, u.z, 0x8fffb0, 10, 2); }
  if (a === 'equip'){ const d = storeTake(i), it = typeof makeItem === 'function' && makeItem(d.k.replace('d_', ''));
    if (it){ RPG.bag.push(it); equip(hero('inju'), it); popText(pl.x, pl.y + 2, pl.z, `장착: ${itemDef(it).n} (I에서 바꿈)`, 'crit', 1.3); } SFX.clink(0.5); }
  if (a === 'unequip'){ const sl = b.dataset.s, d = PRO.equip[sl]; PRO.equip[sl] = null; PRO.store.push(d); pileAdd(d, PRO.store.length - 1); applyEquip(); }
  if (a === 'take'){ const d = storeTake(i); closeStore(); const bb = bill(PA + d.k + '.webp', pl.x, pl.z, d.h, { fit: 1.0, tint: 0.95 }); const it = addLoose(d, bb, pl.x, pl.z); pickUp(it, pl); guide('놓을 자리에서 <em>E</em> (빈 칸)', 4); return; }
  renderStore();
});
// 가구 놓기: 들고 있을 때 주변에 E 대상이 없으면 "여기에 놓는다"
function proFreeE(){
  const c = PRO.carry; if (G.mode !== 'cave' || !c) return null;
  if (!c.pig && (c.d.type === 'furn' || c.d.k === 'd_H-402') && !c.d.toilet) return { label: `${eul(c.d.name)} 여기에 놓는다 (두 칸)`, fn: placeFurn };
  return { label: `${eul(c.d.name)} 여기에 내려놓는다`, fn: dropHere };
}
// v0.22 들고 있는 것을 아무 데나 잠시 내려놓기 (G · 빈 곳에서 E). 동료는 30초 동안 손대지 않음
function dropHere(){
  const c = PRO.carry, pl = G.player; if (!c) return;
  if (c.pig){ const u = c.pig; u.carrier = null; u.lift = 0; PRO.carry = null; say(u, '꿀!', 'soft', 0.8); return; }
  const x = pl.x + Math.cos(pl.aim) * 0.55, z = pl.z + Math.sin(pl.aim) * 0.55, bad = solidAt(G.map, x, z), tx = bad ? pl.x : x, tz = bad ? pl.z : z;
  c.carrier = null; c.claimed = null; c.x = tx; c.z = tz; c.heldT = G.t + 30;
  c.b.g.position.set(tx, heightAt(G.map, tx, tz), tz); c.insp.x = tx; c.insp.z = tz; PRO.carry = null;
  SFX.thump(110, 0.2, 0.12); dust(tx, tz, 3);
}
function placeFurn(){
  const c = PRO.carry, pl = G.player, m = G.map;
  const busy = (i, j) => m.solid[j * m.w + i] || [STORE, PIT, TOILET, FIRE, BED].some(o => Math.hypot((o.cx ?? o.x) - i, (o.cz ?? o.z) - j) < 1.2) || (i >= PRO.pen.x0 - 1 && i <= PRO.pen.x1 && j >= PRO.pen.z0 && j <= PRO.pen.z1) || (j <= 4 && i >= 7 && i <= 11) || G.units.some(u => u !== pl && Math.hypot(u.x - i, u.z - j) < 0.7) || Math.hypot(i - LOBBY_C.x, j - LOBBY_C.z) < 1.5;
  // 두 칸 (오른쪽으로 이어서): 인주 앞쪽부터, 2칸 안에서 가장 가까운 빈 자리
  const fx = pl.x + Math.cos(pl.aim) * 0.8, fz = pl.z + Math.sin(pl.aim) * 0.8, cand = [];
  for (let j = Math.round(pl.z) - 2; j <= Math.round(pl.z) + 2; j++) for (let i = Math.round(pl.x) - 3; i <= Math.round(pl.x) + 2; i++) if (i > 0 && j > 0 && i + 1 < m.w && j < m.h) cand.push([i, j, Math.hypot(i + 0.5 - fx, j - fz)]);
  cand.sort((a, b) => a[2] - b[2]);
  const at = cand.find(([i, j]) => !busy(i, j) && !busy(i + 1, j) && Math.hypot(i + 0.5 - pl.x, j - pl.z) > 0.6);
  if (!at) return popText(pl.x, pl.y + 2, pl.z, '여기엔 놓을 수 없음', 'miss', 1.2);
  dropCarried(c); const [i, j] = at, d = c.d;
  PRO.placed.push({ k: d.k, name: d.name, x: i, z: j, h: d.h }); placeProp(PRO.placed[PRO.placed.length - 1]);
  dust(i, j, 8); SFX.thump(120, 0.3, 0.2); popText(i, 1.4, j, FURN_NOTE[d.k] ? `놓음 — ${FURN_NOTE[d.k]}` : '놓음', 'heal', 1.6);
}
function placeProp(p){   // 두 칸을 차지 · 크게
  const m = G.map; p.hp = p.hp ?? 2;
  p._b = bill(PA + p.k + '.webp', p.x + 0.5, p.z, Math.max(0.9, p.h * 2.0), { fit: 1.9, tint: 0.9 });
  m.solid[p.z * m.w + p.x] = 1; m.solid[p.z * m.w + p.x + 1] = 1; m.nav = {};
  if (p.k === 'd_H-101'){ p._l = new THREE.PointLight(0xffc070, 1.1, 5, 1.6); p._l.position.set(p.x + 0.5, 1.5, p.z); G.scene.add(p._l); G.props.push(p._l); }
}
function breakProp(p){
  const m = G.map; if (p._b) G.scene.remove(p._b.g); if (p._l) G.scene.remove(p._l);
  m.solid[p.z * m.w + p.x] = 0; m.solid[p.z * m.w + p.x + 1] = 0; m.nav = {};
  PRO.placed = PRO.placed.filter(o => o !== p);
  dust(p.x + 0.5, p.z, 16); spark(p.x + 0.5, 0.6, p.z, 0xc8a070, 18, 4); SFX.thump(90, 0.5, 0.25); camShake(0.15, 0.2);
  popText(p.x + 0.5, 1.6, p.z, `${p.name} 부서짐!`, 'hurt big', 1.4);
  if (PRO.cave) setTimeout(() => PRO.cave && say(PRO.cave.ch, `대장! ${p.name} 부서졌다!`, 'soft', 2), 600);
}
function restorePlaced(){ for (const p of PRO.placed) placeProp(p); }

/* ---------- v0.20 적: 날이 갈수록 늘고 (1 → 2 → 3) 세짐 (+10% / 날). 역할
   꼬마악마 = 도둑: 창고로 달려가 식량을 훔쳐 석문 쪽 굴로 도망 (잡으면 돌려받음)
   꼬마요정 = 달팽이 납치: 날아서 우리로, 달팽이를 들고 천장 구멍으로 (잡으면 달팽이가 풀려남)
   밤 습격: 3일째부터 가끔 자는 사이 놈들이 내려옴 */
const ROLE_NOTE = { foeDevil: '도둑', foeFairy: '달팽이 납치' };
function pickFoes(){
  const d = PRO.day, n = d <= 2 ? 1 : d <= 4 ? 1 + (Math.random() < 0.5 ? 1 : 0) : 2 + (Math.random() < 0.5 ? 1 : 0);
  const pool = d <= 1 ? ['foeJelly', 'foeSlime'] : Object.keys(FOES);
  return Array.from({ length: n }, () => pool[Math.floor(Math.random() * pool.length)]);
}
function scaleFoe(e){ const k = 1 + 0.1 * (PRO.day - 1); e.max = e.hp = Math.round(e.D.hp * k); e.atk = Math.round(e.D.atk * (1 + 0.06 * (PRO.day - 1))); }
FOES.foeDevil.think = (u, dt) => roleThink(u, dt, 'thief');
FOES.foeFairy.think = (u, dt) => roleThink(u, dt, 'snatch');
const DEN = { x: 9, z: 3.3 };   // 도둑이 도망치는 곳 (석문 앞 굴)
function roleThink(u, dt, role){
  if (G.mode !== 'cave' || !G.lobbyFight || !PRO.cave) return enemyThink(u, dt);
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  const R = u.R = u.R || { ph: 'go' }, Cv = PRO.cave;
  if (R.ph === 'fight') return enemyThink(u, dt);
  if (role === 'thief'){
    if (R.ph === 'go'){
      if (!edible()){ R.ph = 'fight'; return; }
      const T = { x: STORE.cx + 1.4, z: STORE.cz };
      if (Math.hypot(T.x - u.x, T.z - u.z) > 0.6){ navTo(u, T.x, T.z, u.spd * 1.1, dt, 0.4); return; }
      const d = takeMeal(); if (!d){ R.ph = 'fight'; return; }
      R.loot = { ...d, food: 1 }; R.ph = 'flee'; popText(u.x, 1.8, u.z, `${d.name} 훔침!`, 'hurt big', 1.3); say(Cv.ch, '도둑이다! 대장! 잡아라!', 'soft', 1.8); return;
    }
    navTo(u, DEN.x, DEN.z, u.spd * 1.15, dt, 0.3);
    if (Math.hypot(DEN.x - u.x, DEN.z - u.z) < 0.6){ escapeFoe(u); say(Cv.ch, '도둑맞았다… 끄응…', 'soft', 2); }
    return;
  }
  // 달팽이 납치: 난다 (울타리 · 벽 무시)
  const fly = (x, z, sp) => { const n = norm(x - u.x, z - u.z); u.x += n.x * sp * dt; u.z += n.z * sp * dt; faceToward(u, n.x, n.z); u.lift = 0.5 + Math.sin(G.t * 8) * 0.1; };
  if (R.ph === 'go'){
    const s = nearest(u, Cv.snails.filter(x => !x.dead && x.st2 !== 'carried'), 40); if (!s){ R.ph = 'fight'; return; }
    if (Math.hypot(s.x - u.x, s.z - u.z) > 0.4){ fly(s.x, s.z, u.spd * 1.1); return; }
    s.st2 = 'carried'; s.carrier = u; R.snail = s; R.ph = 'flee'; popText(u.x, 1.8, u.z, '달팽이 납치!', 'hurt big', 1.3); say(Cv.ch, '달팽이!! 내 달팽이!! 놔라!!', 'big', 2); return;
  }
  const C = LOBBY_C;
  if (Math.hypot(C.x - u.x, C.z - u.z) > 0.3) fly(C.x, C.z, u.spd * 0.9);
  else { u.lift += dt * 1.6; if (u.lift > 4.5){ const s = R.snail; if (s){ Cv.snails = Cv.snails.filter(o => o !== s); if (s.baby) PRO.babies = Math.max(0, PRO.babies - 1); else PRO.snailLost++; removeUnit(s); } escapeFoe(u); Cv.ch.sadT = 60; say(Cv.ch, '😭', 'emo', 2.4); } }
}
function escapeFoe(u){ u.R = null; removeUnit(u); u.dead = true; dust(u.x, u.z, 8); }
function dropLoot(u){
  const R = u.R; if (!R) return;
  if (R.loot){ const d = R.loot, b = bill(PA + d.k + '.webp', u.x + 0.3, u.z, Math.max(0.34, d.h * 1.3), { fit: 1.0, tint: 0.95 }); addLoose(d, b, u.x + 0.3, u.z); popText(u.x, 1.6, u.z, '되찾음!', 'heal', 1.2); }
  if (R.snail){ const s = R.snail; s.carrier = null; s.st2 = 'out'; s.lift = 0; s.wT = 0; say(PRO.cave.ch, '달팽이! 살았다!', 'soft', 1.8); }
  u.R = null;
}
function nightRaid(){
  if (G.mode !== 'cave' || !PRO.cave || G.lobbyFight || G.lock) return;
  caption('밤 습격!', '자는 사이 놈들이 내려왔다'); SFX.roar(0.7); camShake(0.2, 0.5);
  const kinds = pickFoes().concat(['foeCultist']).slice(0, 3), ft = freeTiles(kinds.length);
  kinds.forEach((k, i) => { const t = ft[i]; if (!t) return; const e = spawn(k, t.x, t.z, 'enemy'); e.band = 'lobby'; scaleFoe(e); fallUnit(e, 16, 0.2 + i * 0.3, 0.6, () => { dust(e.x, e.z, 10); camShake(0.15, 0.15); if (i === 0) battleReady(e); }); });
  setTimeout(() => { if (G.mode === 'cave' && foes().length) startLobbyFight(); }, 1500 + kinds.length * 300);
}


/* ---------- v0.21 동료 목록 · 끼니 대상 (레베카가 나오면 넷) ---------- */
const mates = () => PRO.cave ? [PRO.cave.ch, PRO.cave.ka, PRO.cave.reb].filter(Boolean) : [];
const mealKeys = () => PRO.rebOut ? ['inju', 'ch', 'ka', 'reb'] : ['inju', 'ch', 'ka'];
HSAY.reb = { work: ['…음냐, 정리할게.', '…하암.'], hungry: ['…배고파.'], ate: ['…맛있다. 졸려.'], starve: ['…배고파…', '…(꼬르륵)'], forage: ['…버섯 하나만.'], off: ['…하암.', '…졸려.', '(꾸벅)'], potty: ['…잠깐.'], done: ['…'] };
// 잘 때: 낙하가 끝났고, 행동을 다 썼거나 오늘 할 일을 다 했으면 → 잠자리에 ▼ + 청광묵이 알려 줌
function readyToSleep(){
  const Cv = PRO.cave; if (!Cv || !Cv.dropped || G.lobbyFight) return false;
  if (PRO.ap <= 0) return true;
  return PRO.meal.inju.fed && PRO.fireLit && PRO.penFood >= snailNeed() && (!PRO.trash.length || PRO.didBury);
}
// 배고픈 상태: 머리 위에 가끔 이모지 (아직 안 먹음 🤤 · 굶은 날이 있으면 😫)
function tickHungry(dt){
  const Cv = PRO.cave; if (!Cv || G.lock || G.lobbyFight || G.waitInput) return;
  const who = [['inju', G.player], ['ch', Cv.ch], ['ka', Cv.ka], ['reb', Cv.reb]];
  for (const [k, u] of who){
    const M = PRO.meal[k]; if (!u || !M || M.fed || u.dead) continue;
    u.hungT = (u.hungT ?? rnd(3, 8)) - dt;
    if (u.hungT <= 0){ u.hungT = rnd(10, 16); say(u, M.hd ? '😫' : '🤤', 'emo', 1.8); }
  }
}

/* ---------- v0.21 레베카 꺼내기: 벽에 박힌 머리 → 벽을 세 번 파면 (하루 행동 1씩) 쑥 빠져나옴. 그 뒤로 굴에 같이 삶 (정리 · 밥, 늘 졸림) ---------- */
async function digRebecca(){
  if (PRO.rebOut || !spendAp()) return;
  const B = PRO.cave.B, pl = G.player; G.lock = true;
  for (let k = 0; k < 4; k++){ pl.leanT = 0.3; SFX.clink(0.4); spark(B.x + 0.3, 0.6, B.z, 0xffe0b0, 6, 2.5); dust(B.x + 0.4, B.z, 6); await wait(0.4); }
  PRO.rebDig++; popText(B.x + 0.5, 1.4, B.z, `레베카 ${PRO.rebDig}/3`, 'heal', 1.2); G.lock = false;
  if (PRO.rebDig === 1) say({ x: B.x, y: 0.8, z: B.z }, '…음냐…?', 'zzz', 2);
  if (PRO.rebDig === 2) say({ x: B.x, y: 0.8, z: B.z }, '…으응… 시끄러…', 'zzz', 2);
  if (PRO.rebDig >= 3) rebeccaOut();
}
async function rebeccaOut(){
  const Cv = PRO.cave, B = Cv.B; G.lock = true; letterbox(true);
  camFocus(B.x + 0.6, B.z, 99, ...lens(2.6, 3.8), 0.05); await wait(0.6);
  camShake(0.35, 0.6); SFX.boom(0.7); dust(B.x + 0.5, B.z, 24); spark(B.x + 0.5, 0.8, B.z, 0xc8b8a0, 24, 4);
  if (PRO.rebHead){ G.scene.remove(PRO.rebHead.g); PRO.rebHead = null; }
  PRO.rebOut = true; PRO.meal.reb = { fed: false, hd: 0 }; PRO.hpf.reb = 1;
  const r = spawnRebecca(B.x + 1, B.z); r.lying = true; await wait(1.2);
  await textbox('레베카', ['…음냐…', '…어? 여기 어디야?', '…졸려. 조금만 더 잘게.'], { face: PA + 'rebecca_face.webp' });
  r.lying = false;
  await textbox('청광묵', ['대장! 레베카 나왔다! 같이 산다!'], { face: FACE.cheong, tags: CHEONG_TAGS() });
  camFocusOff(); letterbox(false); G.lock = false;
  caption('레베카', '굴에 한 명이 늘었다 — 끼니도 하나 더');
}
function spawnRebecca(x, z){
  const r = spawn('rebecca', x, z, 'neutral'); r.face = 1; r.home = { x, z }; PRO.cave.reb = r;
  G.inspect.push({ unit: r, r: 1.6, talk: true, label: '레베카에게 말을 건다', fn: async () => { r.face = Math.sign(G.player.x - r.x) || r.face; await textbox('레베카', [['…하암. 대장?', '…졸려.'], ['…밥 먹었어?', '…나는 아직.'], ['…벽 속이 더 따뜻했는데.']][Math.floor(Math.random() * 3)], { face: PA + 'rebecca_face.webp' }); } });
  return r;
}

/* ---------- v0.21 싸움이 굴을 부숨: 적 · 적뢰의 공격 (붉은 장판)이 떨어진 자리의 가구 (두 번 맞으면 부서짐) · 변소 천막 · 모닥불 · 창고 (물건이 튕겨 나감) · 달팽이 (22 피해) ---------- */
G.onArea = function caveArea(d){
  if (G.mode !== 'cave' || !PRO.cave) return;
  const Cv = PRO.cave, at = (x, z, r) => inShape(d, { x, z, r });
  for (const p of [...PRO.placed]) if (at(p.x + 0.5, p.z, 1.1)){ p.hp = (p.hp ?? 2) - 1; if (p.hp <= 0) breakProp(p); else { spark(p.x + 0.5, 0.6, p.z, 0xc8a070, 8, 3); popText(p.x + 0.5, 1.4, p.z, '쩍!', 'miss', 0.8); } }
  if (!PRO.hasToilet && !PRO.tentGone && at(TOILET.x, TOILET.z + 0.38, 0.9)){ PRO.tentGone = true; if (PRO.tent){ G.scene.remove(PRO.tent.g); PRO.tent = null; } popText(TOILET.x, 1.4, TOILET.z, '천막 찢어짐!', 'hurt', 1.2); }
  if (PRO.fireLit && at(FIRE.x, FIRE.z, 0.7)){ PRO.fireLit = false; spark(FIRE.x, 0.6, FIRE.z, 0xffb050, 20, 4); popText(FIRE.x, 1.4, FIRE.z, '불 꺼짐!', 'hurt', 1.2); }
  if (PRO.store.length && at(STORE.cx, STORE.cz, 1.1) && Math.random() < 0.6){
    const d2 = storeTake(Math.floor(Math.random() * PRO.store.length)), x = STORE.cx + rnd(0.8, 1.6), z = STORE.cz + rnd(-0.8, 0.8);
    const b = bill(PA + d2.k + '.webp', x, z, Math.max(0.34, (d2.h || 0.3) * 1.3), { fit: 1.0, tint: 0.95 }); addLoose(d2, b, x, z); popText(STORE.cx, 1.4, STORE.cz, '창고가 엎어졌다!', 'hurt', 1.2);
  }
  for (const s of [...Cv.snails]) if (!s.dead && s.st2 !== 'carried' && inShape(d, s)){
    s.hp -= 22; s.flash = 0.2; spark(s.x, 0.3, s.z, 0x2fbfa0, 8, 2);
    if (s.hp <= 0){ kill(s, null); snailDie(s); }
  }
};

// v0.21 안전장치: 싸움 중 적이 어딘가 끼어 20초 넘게 움직이지도 맞지도 않고 곁에 아무도 없으면 → 도망친 것으로 (싸움이 안 끝나 E가 막히던 것)
function stuckFoes(){
  for (const e of foes()){
    if (e.D.boss) continue;
    const c = e._chk;
    if (!c || Math.hypot(e.x - c.x, e.z - c.z) > 0.4 || e.hp !== c.hp){ e._chk = { t: G.t, x: e.x, z: e.z, hp: e.hp }; continue; }
    const near = G.units.some(u => u.side === 'ally' && !u.downed && Math.hypot(u.x - e.x, u.z - e.z) < 2.5);
    if (near){ c.t = G.t; continue; }
    if (G.t - c.t > 20){ popText(e.x, 1.6, e.z, '도망쳤다', 'miss', 1.2); escapeFoe(e); }
  }
}

// v0.22 적뢰전 카메라: 굴 전체를 멀리서 보던 것 → 프롤로그처럼 인주를 따라가는 3D 전투 화면 (아래 창은 숨김). 끝나면 굴 화면으로
function bossCam(on){
  PRO.bossCam = on;
  if (on){
    G.camAnchor = null; PRO.barH = PRO.barHs = 0; if (camera.view && camera.view.enabled) camera.clearViewOffset();
    camPreset(); camera.fov = 40; camera.updateProjectionMatrix(); G.map.wallH = 2.2; layoutWalls(G.map, CAM.yawT);
  } else {
    camPreset({ y: 8.4, back: 12.8 }, { y: 0.6, fwd: 0.6 });
    G.camAnchor = { x: LOBBY_C.x, z: LOBBY_C.z - 0.4, k: 0.12, sway: 0.18 };
    camera.fov = CAVE_CAM.fov; camera.updateProjectionMatrix(); G.map.wallH = 3.2; layoutWalls(G.map, CAM.yawT); fitCaveCam();
  }
}
