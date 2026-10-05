/* greyland.js v1.0 — (v0.59) 1층 고정: 회색 대지 → 무덤 → 알현실 → 세자르 (2D판 1층을 그대로 옮김 · FLOORS.md §2)
   ■ 들어갈 때 달 그림 한 장: "달에는 길이 없었다. 지도만 있었다."
   ■ 회색 대지 (x 1~74): 길고 넓은 가로 들판. 어두운 회색 하늘 · 먼 언덕 두 겹 · 가끔 내리는 재. 바위는 엄폐
     · 무리 둘 (두리번거리는 검사 · 창병 / 방패벽 + 바위 뒤 붉은 망토 궁수), 강적은 곤봉 거한 하나
     · 뒤를 밟는 자객 하나 (경계를 안 세우면 맨 뒤부터)
   ■ 무덤 (x 75~95): 어두운 복도 · 촛불 · 무덤. 복도 끝마다 보초 (고정된 눈), 기둥 뒤에 숨은 자
   ■ 알현실 (x 96~122): 기둥 · 붉은 카펫 · 푸른 횃불. 가운데 관 — 다가가면 세자르가 일어남. 혼자 (부하를 부르지 않음)
   ■ 세자르 (2D 원본 두뇌): 탐색 (4.5~7초: 아주 천천히 걸으며 2.6칸 간격, 붙으면 원형 베기 또는 투욱 투욱 백스텝)
     ↔ 휘몰아침 (4.5초: 기술을 쏟아냄 — 원형 베기 · 마구 베기 (12연격) · 하늘 가르기 · 관통 찌르기 · 냉기 참격 · 어깨 박치기 · 3배 속도 우회 · 돌진)
     · 빈틈 (휘청 · 헛친 · 막 친 상대 4칸 안)은 절대 놓치지 않음: 뛰어들어 3연격
     · 권위: 처음에 손을 들면 눈이 내림 (손을 드는 1.1초는 끊을 수 있음). 크게 휘청이면 6초 동안 눈이 멎고 받는 피해 +25%
   ■ 1층에서는 훈련장 규칙이 켜짐: 조 · 교전 자리 · 은신 · 암살 · 방어 · 엄폐 · 자객 · 경계 (동료 적성 · 보직은 저장된 것)
   ■ 그림: 지금은 있는 세자르 그림 (foe 시트). 민수가 새 스프라이트를 주면 CZ_POSE만 바꿔 끼움 */
'use strict';
const GREY = { on: true, W: 124, H: 30, ash: null, sky: [] };
if (typeof CAM_MODES !== 'undefined') CAM_MODES.greyside = { base: { y: 3.4, back: 12.5 }, look: { y: 1.7, fwd: 0 } };   // 대지: 옆에서 멀찍이 (언덕 · 하늘)
const CZ3 = { keep: 2.6, probe: [4.5, 7], fury: 4.5, punish: 2.2, spinR: 2.6, runMul: 3, backDist: 1.25,
  cd: { ult: 22, wave: 9, spin: 8, shoulder: 5, thrust: 6, back: 6, flank: 5, rush: 5, upcut: 20 } };
// 2D 동작 이름 → 지금 있는 그림 (새 스프라이트가 오면 여기만)
const CZ_POSE = { prep: 'windup', strike: 'attack', special: 'special', back: 'back', thrust: 'thrust', raise: 'raise', raiseWait: 'raise', idle: 'idle', guard: 'guard', walk: 'idle' };
const czPose = (u, k) => setPose(u, u.S.poses[CZ_POSE[k]] ? CZ_POSE[k] : u.S.poses[k] ? k : 'idle');

/* ---------- 맵 ---------- */
function greyRows(){
  const W = GREY.W, H = GREY.H, g = Array.from({ length: H }, () => Array(W).fill('.'));
  const put = (x, z, c) => { if (x >= 0 && z >= 0 && x < W && z < H) g[z][x] = c; };
  for (let x = 75; x < W; x++){ put(x, 0, '#'); put(x, H - 1, '#'); } for (let z = 0; z < H; z++){ put(0, z, '#'); put(W - 1, z, '#'); }   // 대지 (x < 75)의 위아래는 보이는 벽 없이 막음 (greyPost) — 언덕 · 하늘이 보이게
  // 대지의 바위 (엄폐)
  for (const [x, z] of [[14, 10], [15, 10], [18, 20], [27, 8], [28, 21], [33, 13], [42, 11], [42, 12], [42, 14], [42, 15], [42, 17], [42, 18], [50, 9], [52, 22], [57, 12], [63, 18], [64, 18], [69, 10], [70, 21]]) put(x, z, 'r');
  // 무덤: 위아래 벽, 가운데 복도 + 곁방
  for (let x = 75; x <= 95; x++) for (let z = 1; z < H - 1; z++) if (z < 10 || z > 19) put(x, z, '#');
  for (const x of [78, 83, 88, 93]){ put(x, 11, 'o'); put(x, 18, 'o'); }
  for (let z = 6; z < 10; z++) for (let x = 80; x <= 82; x++) put(x, z, '.');   // 위 곁방
  for (let z = 20; z < 24; z++) for (let x = 86; x <= 88; x++) put(x, z, '.');  // 아래 곁방
  // 알현실
  for (let x = 96; x < W - 1; x++) for (let z = 1; z < H - 1; z++) if (z < 6 || z > 23) put(x, z, '#');
  put(96, 10, '#'); put(96, 19, '#'); for (let z = 6; z < 10; z++) put(96, z, '#'); for (let z = 20; z < 24; z++) put(96, z, '#');
  for (let x = 100; x <= 118; x += 4){ put(x, 9, 'o'); put(x, 20, 'o'); }
  return g.map(r => r.join(''));
}
function greyGen(){
  const W = GREY.W, H = GREY.H, R = rngOf(4242);
  const room = (id, type, x, z, w, h) => ({ id, type, x, z, w, h, cx: x + w / 2, cz: z + h / 2 });
  const start = room(0, 'start', 2, 11, 6, 8), stairs = room(1, 'stairs', 117, 12, 5, 6);
  const D = { ...FLOOR_DEF[1], name: '회색 대지', sub: '달에는 길이 없었다. 지도만 있었다.', boss: null, cam: 'iso', fog: 3, floor: 0x5c5b60, wall: 0x2a2830, pillar: 0x45414e, glow: 0x9fc6ff, grey: true };
  return { F: 1, W, H, rows: greyRows(), rooms: [start, stairs], start, stairs, R: Object.assign(() => 0.99, R), D, dist: new Map([[0, 0], [1, 9]]), traps: [], pools: [] };
}
const _genDungeonG = genDungeon;
genDungeon = function(F, seed){ return F === 1 && GREY.on ? greyGen() : _genDungeonG(F, seed); };

/* ---------- 하늘 · 언덕 · 재 ---------- */
function greySky(){
  const mk = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); return t; };
  const sky = mk(4, 256, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#141518'); gr.addColorStop(1, '#3a3b40'); x.fillStyle = gr; x.fillRect(0, 0, w, h); });
  const hill = (col, seed, amp) => mk(1024, 128, (x, w, h) => { let s = seed; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; x.fillStyle = col; x.beginPath(); x.moveTo(0, h);
    let y = h * 0.5; for (let i = 0; i <= w; i += 16){ y = Math.max(h * 0.15, Math.min(h * 0.85, y + (r() - 0.5) * amp)); x.lineTo(i, y); } x.lineTo(w, h); x.fill(); });
  const plane = (tex, w, h, x, y, z, transparent) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent, fog: false, depthWrite: false })); m.position.set(x, y, z); G.scene.add(m); G.props.push(m); GREY.sky.push(m); return m; };
  plane(sky, 300, 70, 60, 20, -46, false);
  plane(hill('#303136', 7, 40), 280, 18, 55, 5, -36, true);
  plane(hill('#26272b', 19, 30), 260, 12, 60, 3, -26, true);
  // 재
  const N = 600, pos = new Float32Array(N * 3), sp = [];
  for (let i = 0; i < N; i++){ pos[i * 3] = rnd(-22, 22); pos[i * 3 + 1] = rnd(0, 12); pos[i * 3 + 2] = rnd(-16, 12); sp.push({ v: rnd(0.25, 0.7), w: rnd(0, 6.28) }); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xb4b2ae, size: 0.075, transparent: true, opacity: 0.75, depthWrite: false }));
  pts.frustumCulled = false; G.scene.add(pts); G.props.push(pts);
  GREY.ash = { pts, sp, gust: 0 };
}
function greyAshTick(dt){
  const A = GREY.ash; if (!A || !G.player) return;
  // 가끔 (재가 내리는 때): 15초 내리고 10~20초 그침
  A.t = (A.t ?? 0) - dt; if (A.t <= 0){ A.on = !A.on; A.t = A.on ? rnd(12, 18) : rnd(10, 20); }
  A.k = (A.k || 0) + ((A.on && G.player.x < 75 ? 1 : 0) - (A.k || 0)) * Math.min(1, dt * 0.6);
  A.pts.material.opacity = 0.75 * A.k; A.pts.visible = A.k > 0.02;
  const a = A.pts.geometry.attributes.position.array, cx = CAM.follow.x, cz = CAM.follow.z;
  for (let i = 0; i < A.sp.length; i++){
    const s = A.sp[i]; a[i * 3 + 1] -= s.v * dt; a[i * 3] += Math.sin(G.t * 0.7 + s.w) * 0.25 * dt + 0.15 * dt;
    if (a[i * 3 + 1] < 0 || Math.abs(a[i * 3] - cx) > 22 || Math.abs(a[i * 3 + 2] - cz) > 16){ a[i * 3] = cx + rnd(-22, 22); a[i * 3 + 1] = rnd(6, 12); a[i * 3 + 2] = cz + rnd(-16, 10); }
  }
  A.pts.geometry.attributes.position.needsUpdate = true;
}
function moonCard(){
  let el = document.getElementById('moonCard');
  if (!el){ el = document.createElement('div'); el.id = 'moonCard'; el.innerHTML = '<img src="assets/load_moon.jpg" alt=""><p>달에는 길이 없었다. 지도만 있었다.</p>'; document.body.appendChild(el); }
  el.classList.remove('off'); el.hidden = false;
  setTimeout(() => el.classList.add('off'), 2600); setTimeout(() => { el.hidden = true; }, 4200);
}

/* ---------- 빛: 대지는 흐린 낮, 무덤은 어둠 + 촛불, 알현실은 푸른 횃불 ---------- */
const _lightAtG = lightAt;
lightAt = function(x, z){ const L = _lightAtG(x, z); if (!(EXP && EXP.gen && EXP.gen.D.grey)) return L; return x < 74 ? Math.max(L, 0.62) : x > 96 ? Math.max(L, 0.22) : L; };

// 흐린 낮엔 횃불이 거의 안 보임 (바닥이 하얗게 날아가지 않게)
const _tickLightsG = tickLights;
tickLights = function(dt, vision, lit){ _tickLightsG(dt, vision, lit); if (EXP && EXP.gen && EXP.gen.D.grey && G.player && G.player.x < 73 && DUN.torch) DUN.torch.intensity *= 0.2; };

/* ---------- 층 채우기 ---------- */
function greyPost(gen){
  const F = 1;
  greySky(); moonCard();
  hemi.intensity = 0.38; hemi.color.setHex(0xc8ccd8); hemi.groundColor.setHex(0x2a2826); moon.intensity = 0.22; moon.color.setHex(0xdfe4f0);
  G.scene.background = new THREE.Color(0x26272b); G.scene.fog.color.setHex(0x2c2d32); G.fogK = 2.4;
  // 대지 경계: 보이는 벽 대신 안 보이는 막 (언덕이 보이게)
  for (let x = 0; x < 75; x++) for (const z of [0, GREY.H - 1]){ const k = z * G.map.w + x; G.map.solid[k] = 1; G.map.los[k] = 1; }
  G.map.nav = {};
  // 대지 구간의 돌 타일은 숨김 (흙바닥만 보이게) — buildWorld와 같은 순서로 셈
  { const m = G.map, fm = m.floorMesh, z4 = new THREE.Matrix4().makeScale(0, 0, 0); let k = 0;
    for (let z = 0; z < m.h; z++) for (let x = 0; x < m.w; x++){ const c = m.rows[z][x]; if (c === '#' || c === 'G') continue; if (x < 75 && fm) fm.setMatrixAt(k, z4); k++; }
    if (fm) fm.instanceMatrix.needsUpdate = true; }
  // 흙바닥: 타일 틈을 덮는 잿빛 땅 (얼룩 · 재)
  const c = document.createElement('canvas'); c.width = c.height = 512; const x2 = c.getContext('2d');
  x2.fillStyle = '#545357'; x2.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++){ const r = 4 + Math.random() * 38, v = 70 + Math.random() * 40 | 0; x2.fillStyle = `rgba(${v},${v},${v + 3},${0.05 + Math.random() * 0.1})`; x2.beginPath(); x2.arc(Math.random() * 512, Math.random() * 512, r, 0, 6.3); x2.fill(); }
  for (let i = 0; i < 2500; i++){ const v = Math.random() < 0.5 ? 40 : 120; x2.fillStyle = `rgba(${v},${v},${v},0.25)`; x2.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5); }
  const gt = new THREE.CanvasTexture(c); gt.wrapS = gt.wrapT = THREE.RepeatWrapping; gt.repeat.set(76 / 9, (GREY.H + 34) / 9);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(76, GREY.H + 34), new THREE.MeshStandardMaterial({ map: gt, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.set(37, 0.006, (GREY.H - 34) / 2 - 0.5);   // 언덕 밑까지 이어진 땅 ground.receiveShadow = true; G.scene.add(ground); G.props.push(ground);
  // 무리 1: 두리번거리는 검사 · 창병
  const g1 = [['swordsman', 23, 13], ['swordsman', 25, 16], ['spearman', 26, 13]].map(([k, x, z]) => spawnFoe(k, x, z, F, 'g1'));
  // 무리 2: 방패벽 + 바위 줄 뒤 궁수 (엄폐)
  for (const [k, x, z] of [['shieldman', 40.6, 13], ['shieldman', 40.6, 16]]){ const e = spawnFoe(k, x, z, F, 'g2'); e.post = { x, z }; e.aim = e.aim0 = Math.PI; }
  for (const [x, z] of [[43.1, 11.5], [43.1, 17.5]]){ const e = spawnFoe('archer', x, z, F, 'g2'); e.post = { x, z }; e._fortPost = true; e.aim = e.aim0 = Math.PI; }
  // 강적: 곤봉 거한 하나
  const br = spawnFoe('brute', 60, 15, F, 'elite', true); br.aim = br.aim0 = Math.PI;
  // 뒤를 밟는 자객
  const pr = spawnFoe('swordsman', 9, 26, F, 'prowl'); pr.prowl = true; pr.stl = 3;
  // 무덤: 촛불 · 무덤 · 보초 · 숨은 자
  for (const [x, z] of [[77, 10.4], [81, 19.6], [85, 10.4], [90, 19.6], [94, 10.4]]){ dbill(DA + 'H-196.webp', x, z, 0.6, { fit: 0.8, glow: 1 }); addSource(x, z, 3.4, 0xffb070, 0.8, 0.8); }
  for (const [x, z, k] of [[79.5, 21, 'H-191'], [87, 22.5, 'H-205'], [81, 7, 'H-283'], [91, 8.6, 'H-191']]) dbill(DA + k + '.webp', x, z, 1.1, { fit: 1.3, tint: 0.8 });
  for (const [k, x, z, a] of [['spearman', 94.5, 12.5, Math.PI], ['archer', 81, 7.2, Math.PI / 2], ['spearman', 87, 22.6, -Math.PI / 2]]){ const e = spawnFoe(k, x, z, F, 'tomb'); e.lookT = 1e9; e.aim = e.aim0 = a; e.post = { x, z }; }
  for (const [x, z] of [[83.6, 12], [88.6, 17.2]]){ const e = spawnFoe('swordsman', x, z, F, 'tomb2'); e.lurk = true; e.aim = e.aim0 = Math.PI; }
  // 알현실: 카펫 · 푸른 횃불 · 왕좌 · 관
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(24, 2.4), new THREE.MeshStandardMaterial({ color: 0x5a1624, roughness: 1 })); carpet.rotation.x = -Math.PI / 2; carpet.position.set(109, 0.015, 14.5); G.scene.add(carpet); G.props.push(carpet);
  for (let x = 100; x <= 118; x += 4) for (const z of [9, 20]){ addSource(x, z + (z < 15 ? 0.8 : -0.8), 3.8, 0x9fc6ff, 0.9, 2.0); }
  const throne = new THREE.Group(); const stone = new THREE.MeshStandardMaterial({ color: 0x2e2a3a, roughness: 0.9 }), cloth = new THREE.MeshStandardMaterial({ color: 0x24346e, roughness: 1 });
  const bx = (w, h, d, x, y, z, m) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = true; throne.add(b); };
  bx(1.2, 0.5, 1.2, 0, 0.25, 0, stone); bx(1.2, 2.2, 0.25, 0.55, 1.1, 0, stone); bx(1.0, 0.08, 1.0, 0, 0.54, 0, cloth); bx(0.08, 1.6, 0.9, 0.45, 1.3, 0, cloth);
  throne.position.set(120.5, 0, 14.5); G.scene.add(throne); G.props.push(throne);
  // 관 → 세자르 (bossTick이 깨움)
  const cx = 108, cz = 14.5;
  EXP.boss = { kind: 'cesar', alive: true, woke: false, x: cx, z: cz, grey: true };
  EXP.boss.coffin = dbill(DA + 'H-198.webp', cx, cz, 1.3, { fit: 1.6, tint: 0.9 });
  addSource(cx, cz, 4.5, 0xbfd8ff, 0.7, 1.6);
  G.inspect.push({ x: cx, z: cz, r: 1.8, mark: '관', far: 12, label: '녹슬지 않은 왕관을 쓴 관', once: true, fn: () => bossWake() });
  const st = G.inspect.find(o => o.mark === '계단');
  if (st){ const fn = st.fn, lb = st.label; st.fn = () => EXP.boss && EXP.boss.alive ? popText(G.player.x, G.player.y + 2.2, G.player.z, '세자르를 쓰러뜨려야 내려간다', 'miss', 1.2) : fn(); Object.defineProperty(st, 'label', { get: () => EXP.boss && EXP.boss.alive ? '계단 — 봉인됨 (세자르)' : lb }); }
  DUN.marks.push({ x: cx, z: cz, icon: '♛', col: '#ff6a6a', known: true });
  // 훈련장 규칙을 1층에
  greyRules(true);
  caption('1층 · 회색 대지', '달에는 길이 없었다. 지도만 있었다.');
}
function greyRules(on){
  if (typeof SQ === 'undefined') return;
  SQ.on = on; ENG.on = on; FORT.on = on; ENG.tok.clear && ENG.tok.clear();
  if (!on){ sqHudRender && sqHudRender(); return; }
  const ROLE0 = { player: 'leader', cheongAlly: 'scout', kariusAlly: 'vanguard', rebeccaAlly: 'vanguard', goodwill: 'vanguard' };
  for (const u of G.units) if (u.side === 'ally' && u.hero && !u.sol) solInit(u, { role: ROLE0[u.kind] || 'vanguard', sq: 1 });
  SQ.list[0].order = 'follow'; SQ.list[0].form = 'wedge'; SQ.list[0].head = 0; SQ.list[1].order = 'follow';
  sqHudRender && sqHudRender();
}
const _expLoadFloorG = expLoadFloor;
expLoadFloor = async function(F, how){
  if (typeof SQ !== 'undefined') greyRules(false);
  GREY.ash = null; GREY.snow = false; GREY.snowFx = null; GREY.sky = [];
  const r = await _expLoadFloorG(F, how);
  if (F === 1 && GREY.on && EXP && EXP.gen && EXP.gen.D.grey) greyPost(EXP.gen);
  return r;
};
if (typeof expToCave === 'function'){ const _e2c = expToCave; expToCave = function(...a){ if (typeof SQ !== 'undefined') greyRules(false); return _e2c.apply(this, a); }; }
TICKS.push(dt => {
  if (!(EXP && EXP.gen && EXP.gen.D.grey && G.mode === 'exp')) return;
  greyAshTick(dt);
  // 무덤에 들어서면 하늘빛이 꺼짐
  const pl = G.player; if (!pl) return;
  const k = clamp((pl.x - 70) / 8, 0, 1); hemi.intensity = 0.38 - 0.28 * k; moon.intensity = 0.22 * (1 - k); G.scene.fog.color.setHex(k > 0.5 ? 0x030305 : 0x2c2d32);
  // 대지는 옆에서 (2D처럼 하늘 · 언덕이 보이게), 무덤부터는 위에서
  const want = pl.x < 73 ? 'greyside' : 'iso'; if (CAM.mode !== want && typeof camMode === 'function' && !G.boss) camMode(want, 0);
  for (const m of GREY.sky) m.visible = pl.x < 92;
});
// 5층에는 이제 세자르가 없음 (1층의 왕)
if (FLOOR_DEF[5] && FLOOR_DEF[5].boss === 'cesar') FLOOR_DEF[5].boss = null;

/* ---------- 세자르 (2D 원본 두뇌 이식) ---------- */
const _spawnFoeG = spawnFoe;
spawnFoe = function(kind, x, z, F, band, elite){
  const e = _spawnFoeG(kind, x, z, F, band, elite);
  if (kind === 'cesar' && EXP && EXP.gen && EXP.gen.D.grey){   // 1층 세자르: 5층 때의 세기 · 혼자 · 2D 두뇌
    e.max = e.hp = Math.round(DEFS.cesar.hp * 1.45); e.atk = Math.round(DEFS.cesar.atk * 1.36); e.def = Math.round((FOE_DEF.cesar || 20) * 1.4);
    e.D = { ...e.D, think: cz3Think }; e.cz3 = true;
  }
  return e;
};
const czFoes3 = u => G.units.filter(o => o.side === 'ally' && !o.dead && !o.downed);
function czRunTo(u, gx, gz, mul, dt){
  const d = Math.hypot(gx - u.x, gz - u.z); if (d < 0.15) return true;
  const ox = u.x, oz = u.z; navTo(u, gx, gz, u.spd * mul, dt, 0.1);
  const A = u.cz.act; if (A && (A.g = (A.g || 0) - dt) <= 0){ A.g = 0.07; dust(u.x, u.z, 2, 0x7a8aa8); spark(u.x, u.y + 1.2, u.z, 0x9fc6ff, 2, 1, 0.2, 0.25); }
  if (Math.hypot(u.x - ox, u.z - oz) < 0.002 && d < 1) return true;
  return false;
}
function czAuthorityTick(u, dt){
  const Z = u.cz;
  if (Z.shaken > 0){ Z.shaken -= dt; if (Z.shaken <= 0){ GREY.snow = true; caption('권위', '권위가 다시 홀을 채운다 — 눈이 내린다'); } }
  else if (GREY.snow && u.st === 'hurt' && (u.stT || 0) >= 0.4 && (Z.cool = (Z.cool || 0) - dt) <= 0){ Z.shaken = 6; Z.cool = 4; GREY.snow = false; caption('권위가 흔들린다', '6초 동안 눈이 멎고 더 아프게 맞는다'); }
}
function cz3Think(u, dt){
  if (u.lock || G.lock) return;
  const Z = u.cz || (u.cz = { phaseT: CZ3.probe[0], fury: false, orbit: Math.random() < 0.5 ? 1 : -1, act: null, auth: 0.6, shaken: 0, cd: { ult: 10, wave: 5, spin: 1, shoulder: 3, thrust: 4, back: 0, flank: 3, rush: 5, upcut: 8, punish: 0 } });
  for (const k in Z.cd) Z.cd[k] -= dt;
  czAuthorityTick(u, dt);
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; czPose(u, 'idle'); } if (Z.act && Z.act.breakable){ Z.act = null; popText(u.x, u.y + bodyH(u) + 0.4, u.z, '끊김', 'miss', 0.7); } return; }
  if (Z.act) return czAct(u, Z, dt);
  if (u.st === 'windup' || u.st === 'strike'){ if (u.st === 'strike'){ u.stT -= dt; if (u.stT <= 0) u.st = 'idle'; } return; }
  const all = czFoes3(u); if (!all.length) return;
  const tgt = nearest(u, all, 40), d = dist(u, tgt);
  if (!u.alert){ u.alert = true; u.seen = G.t; }
  // 권위: 손을 든다 (1.1초 — 끊을 수 있음)
  if (Z.auth >= 0 && !GREY.snow){ Z.auth -= dt; if (Z.auth <= 0){ Z.auth = -1; Z.act = { type: 'auth', t: 0, breakable: true }; return; } }
  // 리듬: 탐색 ↔ 휘몰아침
  Z.phaseT -= dt;
  if (Z.phaseT <= 0){ Z.fury = !Z.fury; Z.phaseT = Z.fury ? CZ3.fury : rnd(CZ3.probe[0], CZ3.probe[1]); if (Z.fury){ Z.cd.flank = Math.min(Z.cd.flank, 0.3); Z.cd.rush = Math.min(Z.cd.rush, 0.6); popText(u.x, u.y + bodyH(u) + 0.5, u.z, '휘몰아친다', 'alert', 0.9); } }
  // 빈틈: 휘청 · 헛친 · 막 친 상대
  const gap = all.filter(o => dist(o, u) < 4 && (o.st === 'hurt' || o.st === 'strike' || o.lying)).sort((a, b) => dist(a, u) - dist(b, u))[0];
  if (gap && Z.cd.punish <= 0){ Z.cd.punish = CZ3.punish; Z.act = { type: 'rush', t: 0, tgt: gap, punish: true }; popText(u.x, u.y + bodyH(u) + 0.4, u.z, '빈틈', 'aim', 0.6); return; }
  const close = all.filter(o => dist(o, u) < 1.5);
  if (close.length && !Z.fury && Z.cd.spin <= 0 && Math.random() < 0.5){ Z.act = { type: 'spin', t: 0, breakable: true }; return; }
  if (close.length && !Z.fury && Z.cd.back <= 0){ Z.act = { type: 'backsteps', t: 0, n: 2 + (Math.random() < 0.4 ? 1 : 0), from: close[0] }; return; }
  if (Z.fury){
    const near = all.filter(o => dist(o, u) < 1.7);
    if (near.length && Z.cd.spin <= 0){ Z.act = { type: 'spin', t: 0, breakable: true }; return; }
    if (Z.cd.ult <= 0 && d < 6){ Z.act = { type: 'ult', t: 0, tgt, hits: 0, breakable: true }; return; }
    if (Z.cd.upcut <= 0 && d > 1.5 && d < 7){ Z.act = { type: 'upcut', t: 0, tgt }; return; }
    if (Z.cd.thrust <= 0 && d > 1.3 && d < 4.5){ Z.act = { type: 'thrust', t: 0, tgt }; return; }
    if (Z.cd.wave <= 0 && d >= 2.2 && d <= 5){ Z.act = { type: 'wave', t: 0, tgt, breakable: true }; return; }
    if (Z.cd.shoulder <= 0 && d < 3.3 && Math.random() < dt * 1.5){ Z.act = { type: 'shoulder', t: 0, tgt }; return; }
    if (Z.cd.flank <= 0 && Math.random() < dt * 1.5){ Z.act = { type: 'flank', t: 0, tgt, side: Math.random() < 0.5 ? 1 : -1 }; return; }
    if (Z.cd.rush <= 0 && d > 2.4 && Math.random() < dt * 1.5){ Z.act = { type: 'rush', t: 0, tgt }; return; }
  }
  // 평소: 사거리 안이면 벰 (탐색 중엔 가끔만)
  if (d <= 2.3 && u.cd <= 0 && (Z.fury || Math.random() < dt * 2)){ czSlash(u, tgt, 1); return; }
  u.cd -= dt;
  // 간격 유지 (2.6칸 · 둘레를 돎). 탐색 중엔 아주 천천히, 가끔 잠깐 뜀
  const n = norm(u.x - tgt.x, u.z - tgt.z), gx = tgt.x + n.x * CZ3.keep - n.z * Z.orbit * 0.6, gz = tgt.z + n.z * CZ3.keep + n.x * Z.orbit * 0.6;
  Z.jog = (Z.jog || 0) - dt; if (!Z.fury && Z.jog < -2.5 && Math.random() < dt * 0.3) Z.jog = 0.7;
  if (solidAt(G.map, gx, gz)) Z.orbit *= -1;
  u.moving = false;
  if (Math.hypot(gx - u.x, gz - u.z) > 0.12) navTo(u, gx, gz, u.spd * (Z.fury ? 0.8 : Z.jog > 0 ? 1.4 : 0.45), dt, 0.08);
  setAim(u, tgt.x, tgt.z); czPose(u, 'idle');
}
// 기본 베기 (n번 연달아: 빈틈이면 3연격)
function czSlash(u, t, n){
  const Z = u.cz; u.cd = 1.8;
  const one = i => { if (u.dead || u.st === 'hurt') return; const tt = t && !t.dead && !t.downed ? t : nearest(u, czFoes3(u), 4); if (!tt) return; setAim(u, tt.x, tt.z); czPose(u, i % 2 ? 'strike' : 'thrust');
    windup(u, 'sector', { x: u.x, z: u.z, r: 2.3, a: u.aim, arc: 1.7, windup: i ? 0.22 : 0.45 }, o => hurt(u, o, u.atk * (i === 2 ? 1.2 : 0.9), { from: u, kb: i === 2 ? 1.8 : 0.6, crit: i === 2 })); };
  for (let i = 0; i < n; i++) setTimeout(() => one(i), i * 430 / Math.max(0.3, G.slow));
}
function czAct(u, Z, dt){
  const A = Z.act; A.t += dt;
  const end = () => { Z.act = null; u.st = 'idle'; u.superArmor = false; czPose(u, 'idle'); };
  const T = A.tgt && !A.tgt.dead && !A.tgt.downed ? A.tgt : null;
  if (A.type === 'auth'){
    czPose(u, A.t < 1.1 ? 'raiseWait' : 'raise');
    if (!A.done && A.t >= 1.1){ A.done = true; A.breakable = false; GREY.snow = true; camShake(0.25, 0.3); caption('권위', '눈이 내린다 — 늙은 왕이 홀을 채운다'); ring(u.x, u.z, 0xcfe6ff, 4, 0.8); }
    if (A.t >= 1.6) end(); return;
  }
  if (A.type === 'backsteps'){
    const HOP = 0.34, REST = 0.16;
    if (!A.hop || A.hop.t >= HOP + REST){
      if ((A.i || 0) >= A.n){ Z.cd.back = CZ3.cd.back; u.lift = 0; return end(); }
      A.i = (A.i || 0) + 1;
      const f = A.from && !A.from.dead ? A.from : null, n = f ? norm(u.x - f.x, u.z - f.z) : { x: -Math.cos(u.aim), z: -Math.sin(u.aim) };
      let tx = u.x + n.x * CZ3.backDist, tz = u.z + n.z * CZ3.backDist; if (solidAt(G.map, tx, tz)){ tx = u.x - n.z * CZ3.backDist; tz = u.z + n.x * CZ3.backDist; }
      A.hop = { t: 0, sx: u.x, sz: u.z, tx, tz, landed: false }; if (f) setAim(u, f.x, f.z);
    }
    const H = A.hop; H.t += dt; const k = Math.min(1, H.t / HOP), e = 1 - Math.pow(1 - k, 2.2);
    const nx = H.sx + (H.tx - H.sx) * e, nz = H.sz + (H.tz - H.sz) * e; moveBy(u, nx - u.x, nz - u.z);
    u.lift = k < 1 ? Math.sin(k * Math.PI) * 0.22 : 0; czPose(u, 'back');
    if (k >= 1 && !H.landed){ H.landed = true; dust(u.x, u.z, 5); SFX.thud && SFX.thud(); }
    return;
  }
  if (A.type === 'flank'){
    if (!T || A.t > 2.5){ Z.cd.flank = CZ3.cd.flank; return end(); }
    const all = czFoes3(u), cx = all.reduce((s, o) => s + o.x, 0) / all.length, cz = all.reduce((s, o) => s + o.z, 0) / all.length;
    const bn = norm(T.x - cx || 0.01, T.z - cz), gx = T.x + bn.x * 1.2 - bn.z * A.side * (A.t < 0.6 ? 1.4 : 0.4), gz = T.z + bn.z * 1.2 + bn.x * A.side * (A.t < 0.6 ? 1.4 : 0.4);
    czPose(u, 'idle');
    if (czRunTo(u, gx, gz, CZ3.runMul, dt)){ setAim(u, T.x, T.z); Z.cd.flank = CZ3.cd.flank; u.cd = 0; end(); popText(u.x, u.y + bodyH(u) + 0.4, u.z, '뒤로 돌아 들어온다', 'alert', 0.7); }
    return;
  }
  if (A.type === 'rush'){
    if (!T || A.t > 1.5){ Z.cd.rush = CZ3.cd.rush; return end(); }
    const n = norm(u.x - T.x, u.z - T.z); czPose(u, 'prep');
    if (czRunTo(u, T.x + n.x * 1.6, T.z + n.z * 1.6, CZ3.runMul, dt)){ if (!A.punish) Z.cd.rush = CZ3.cd.rush; end(); czSlash(u, T, A.punish ? 3 : 1); }
    return;
  }
  if (A.type === 'spin'){
    czPose(u, A.t < 0.35 ? 'prep' : 'special');
    if (!A.started){ A.started = true; u.st = 'windup'; u.decal = decal('circle', { x: u.x, z: u.z, r: CZ3.spinR, dur: 0.35, color: BLUE, hostile: true }); }
    if (!A.done && A.t >= 0.35){
      A.done = true; A.breakable = false; Z.cd.spin = CZ3.cd.spin; u.decal = null; camShake(0.3, 0.25); ring(u.x, u.z, 0x9fd8ff, CZ3.spinR, 0.45);
      for (const o of czFoes3(u)) if (dist(o, u) < CZ3.spinR){ hurt(u, o, u.atk * 2.0, { from: u, kb: 3, stun: 0.5 }); if (typeof addStatus === 'function') addStatus(o, 'slow', { t: 2, k: 0.4 }); }
    }
    if (A.t >= 0.85) end(); return;
  }
  if (A.type === 'shoulder'){
    if (!T){ return end(); }
    czPose(u, 'prep');
    if (!A.hit && dist(u, T) > 0.8 && A.t < 0.45){ const n = norm(T.x - u.x, T.z - u.z); moveBy(u, n.x * 9 * dt, n.z * 9 * dt); setAim(u, T.x, T.z); dust(u.x, u.z, 1); return; }
    if (!A.hit){ A.hit = true; Z.cd.shoulder = CZ3.cd.shoulder; if (dist(u, T) < 1.3){ hurt(u, T, u.atk * 0.6, { from: u, kb: 3.2, stun: 0.7 }); popText(T.x, T.y + bodyH(T) + 0.4, T.z, '쾅!', 'crit', 0.7); camShake(0.25, 0.2); G.hitstop = Math.max(G.hitstop, 0.08); } }
    czPose(u, 'strike'); if (A.t >= 0.75) end(); return;
  }
  if (A.type === 'thrust' || A.type === 'upcut' || A.type === 'wave'){
    const CH = A.type === 'thrust' ? 0.6 : A.type === 'upcut' ? 1.0 : 0.8;
    if (!A.started){
      A.started = true; if (T) setAim(u, T.x, T.z); u.superArmor = A.type !== 'wave'; u.st = 'windup';
      if (A.type === 'upcut'){ caption('하늘 가르기', '세자르가 검을 낮게 늘어뜨리고 숨을 고른다…'); popText(u.x, u.y + bodyH(u) + 0.5, u.z, '하늘 가르기', 'crit', 1.2); }
      const sh = A.type === 'wave' ? ['sector', { x: u.x, z: u.z, r: 5.2, a: u.aim, arc: 2.6 }] : ['line', { x: u.x, z: u.z, len: A.type === 'thrust' ? 4.2 : 7.4, w: A.type === 'thrust' ? 1.2 : 1.1, a: u.aim }];
      u.decal = decal(sh[0], { ...sh[1], dur: CH, color: A.type === 'wave' ? BLUE : RED, hostile: true }); A.d = u.decal;
    }
    if (A.t < CH){ czPose(u, 'prep'); if (Math.random() < dt * 20) spark(u.x, u.y + 1.4, u.z, 0xe8f4ff, 2, 1.5, 0.15, 0.25); return; }
    if (!A.done){
      A.done = true; u.superArmor = false; u.decal = null; const d = A.d, a = d.a ?? u.aim, dx = Math.cos(a), dz = Math.sin(a), x0 = u.x, z0 = u.z;
      if (A.type === 'thrust'){
        Z.cd.thrust = CZ3.cd.thrust; const len = 3.6; let k = 0;
        for (; k < len; k += 0.3){ if (solidAt(G.map, x0 + dx * (k + 0.3), z0 + dz * (k + 0.3))) break; } moveBy(u, dx * k, dz * k);
        for (let i = 1; i <= 5; i++) spark(x0 + dx * k * i / 6, u.y + 1.1, z0 + dz * k * i / 6, 0x9fc6ff, 3, 1.5, 0.2, 0.3);
        const hits = czFoes3(u).filter(o => { const px = o.x - x0, pz = o.z - z0, al = px * dx + pz * dz; return al > -0.2 && al < len + 0.6 && Math.abs(px * dz - pz * dx) < 0.6; }).sort((p, q) => ((p.x - x0) * dx + (p.z - z0) * dz) - ((q.x - x0) * dx + (q.z - z0) * dz));
        hits.forEach((o, i) => { hurt(u, o, u.atk * 1.2, { from: { x: x0, z: z0 }, crit: Math.random() < 0.5, kb: i === 0 && (o.D.weight || 60) <= 500 ? 4.5 : 0.5, stun: i === 0 ? 1.2 : 0.6 }); popText(o.x, o.y + bodyH(o) + 0.5, o.z, i === 0 && (o.D.weight || 60) <= 500 ? '꿰뚫어 내던짐!' : '관통!', 'crit', 0.9); if (i === 0 && (o.D.weight || 60) <= 500){ o.lying = true; o.tripT = G.t + 1.4; } });
        camShake(0.4, 0.25); G.hitstop = Math.max(G.hitstop, 0.12); czPose(u, 'thrust');
      } else if (A.type === 'upcut'){
        Z.cd.upcut = CZ3.cd.upcut; const L = 7.4;
        for (let k = 0; k < L; k += 0.5) spark(x0 + dx * k, u.y + 0.2, z0 + dz * k, 0xe8f4ff, 3, 4, 0.22, 0.6);
        const hits = czFoes3(u).filter(o => { const px = o.x - x0, pz = o.z - z0, al = px * dx + pz * dz; return al > -0.2 && al < L + 0.4 && Math.abs(px * dz - pz * dx) < 0.55 + o.r * 0.5; });   // 뜬 자도 벤다
        for (const o of hits){ hurt(u, o, u.atk * 2.2, { from: { x: x0, z: z0 }, stun: 1.0, crit: true, critMul: 1 }); if (o.dead || o.downed) continue; o.lift = 0; o.airborne = false; popText(o.x, o.y + bodyH(o) + 0.6, o.z, '절단!', 'crit', 1.1);
          setTimeout(() => { if (!o.dead && !o.downed){ o.lying = true; o.tripT = G.t + 1.6; } }, 1000); if (typeof addStatus === 'function') addStatus(o, 'slow', { t: 10, k: 0.35 }); }
        camShake(0.65, 0.7); G.hitstop = Math.max(G.hitstop, 0.3); czPose(u, 'special'); A.hold = 1.6;
      } else {
        Z.cd.wave = CZ3.cd.wave; ring(u.x, u.z, 0x9fd8ff, 5, 0.6);
        for (const o of czFoes3(u)){ const dd = dist(o, u), da = Math.abs(angDiff(Math.atan2(o.z - u.z, o.x - u.x), a)); if (dd < 5.2 && da < 1.3){ hurt(u, o, u.atk * 1.8, { from: u, kb: 1 }); if (typeof addStatus === 'function') addStatus(o, 'slow', { t: 4, k: 0.45 }); popText(o.x, o.y + bodyH(o) + 0.4, o.z, '냉기', 'aim', 0.6); } }
        camShake(0.45, 0.3); czPose(u, 'special');
      }
      u.st = 'strike';
    }
    if (A.t >= CH + (A.hold || 0.5)) end(); return;
  }
  if (A.type === 'ult'){
    if (!A.intro){ A.intro = true; Z.cd.ult = CZ3.cd.ult; caption('마구 베기', '세자르'); camShake(0.2, 0.3); }
    if (A.t < 1.0){ czPose(u, 'prep'); return; }
    let t = T; if (!t){ t = A.tgt = nearest(u, czFoes3(u), 8); if (!t) return end(); }
    if (!A.arrived){
      A.breakable = false; u.superArmor = true; czPose(u, 'prep');
      const n = norm(t.x - u.x, t.z - u.z), gx = t.x - n.x * 0.8, gz = t.z - n.z * 0.8;
      if (Math.hypot(gx - u.x, gz - u.z) > 0.15 && A.t < 1.5){ moveBy(u, n.x * Math.min(14 * dt, Math.hypot(gx - u.x, gz - u.z)), n.z * Math.min(14 * dt, Math.hypot(gx - u.x, gz - u.z))); spark(u.x, u.y + 1.2, u.z, 0x9fc6ff, 2, 1, 0.2, 0.2); return; }
      A.arrived = true; A.next = 0; u.superArmor = false; A.breakable = true;
    }
    A.next -= dt;
    if (A.next <= 0 && A.hits < 12){
      A.next = 0.1; A.hits++; czPose(u, A.hits % 2 ? 'strike' : 'special'); setAim(u, t.x, t.z);
      if (dist(u, t) < 1.9) hurt(u, t, u.atk * 0.3, { from: u, crit: true, critMul: 1.6, noCam: true });
      spark(t.x, t.y + 1.1, t.z, 0xe8f4ff, 3, 3, 0.18, 0.15);
    }
    if (A.hits >= 12 && A.next <= -0.3) end();
    return;
  }
  end();
}
// 권위가 흔들리는 동안 더 아프게 맞음 · 눈
const _hurtG = hurt;
hurt = function(att, tgt, dmg, o = {}){ if (tgt && tgt.cz3 && tgt.cz && tgt.cz.shaken > 0) dmg *= 1.25; return _hurtG(att, tgt, dmg, o); };
TICKS.push(dt => {
  const on = !!(GREY.snow && G.boss && G.boss.cz3 && !G.boss.dead);
  if (typeof G.rain !== 'undefined' && G.rain){ /* 비 시스템과는 따로 */ }
  if (!GREY.snowFx && on){
    const N = 500, pos = new Float32Array(N * 3); for (let i = 0; i < N; i++){ pos[i * 3] = rnd(-14, 14); pos[i * 3 + 1] = rnd(0, 9); pos[i * 3 + 2] = rnd(-10, 8); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    GREY.snowFx = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xe8f0ff, size: 0.09, transparent: true, opacity: 0.85, depthWrite: false })); GREY.snowFx.frustumCulled = false; G.scene.add(GREY.snowFx); G.props.push(GREY.snowFx);
  }
  if (GREY.snowFx){
    GREY.snowFx.visible = on; if (!on){ if (!G.boss || G.boss.dead) GREY.snow = false; return; }
    const a = GREY.snowFx.geometry.attributes.position.array, cx = CAM.follow.x, cz = CAM.follow.z;
    for (let i = 0; i < a.length; i += 3){ a[i + 1] -= dt * 0.9; a[i] += Math.sin(G.t + i) * dt * 0.2; if (a[i + 1] < 0 || Math.abs(a[i] - cx) > 14 || Math.abs(a[i + 2] - cz) > 10){ a[i] = cx + rnd(-14, 14); a[i + 1] = rnd(5, 9); a[i + 2] = cz + rnd(-10, 8); } }
    GREY.snowFx.geometry.attributes.position.needsUpdate = true;
  }
});
