/* game.js v0.6 — 장면: 굴 (로비) → 석문 → 로딩 (입력을 기다림) → 1층 (맵이 곧 전장) → 적뢰 */
'use strict';
const LOBBY = [
  '################',
  '#######GG#######',
  '##............##',
  '#..............#',
  '#...D..........#',
  '#..........M...#',
  '#.....f........#',
  '#....R.....N...#',
  '#..............#',
  '#.....P........#',
  '################'];
const FLOOR1 = [
  '##############################',
  '#............................#',
  '#............................#',
  '#.....o..............o.......#',
  '#............................#',
  '#.............J..............#',
  '#............................#',
  '#.....o..............o.......#',
  '#............................#',
  '#............................#',
  '#############....#############',
  '#############..m.#############',
  '#############....#############',
  '#^^^^^A^...............^A^^^^#',
  '#^^^^^^^...............^^^^^^#',
  '#^^^^^^/...............//^^^^#',
  '#.......r.......b......r.....#',
  '#............................#',
  '#.....r..............r.......#',
  '#............................#',
  '#############....#############',
  '######......#....#############',
  '######.fx.........############',
  '######......#....#############',
  '#############....#############',
  '#............................#',
  '#...o....o....o....o....^^^^.#',
  '#.................p.....^A^^.#',
  '#...o....o.d..o....o....//^^.#',
  '#............................#',
  '#...o....o....o....o.........#',
  '#############....#############',
  '#############....#############',
  '#...........s....s...........#',
  '#.......r..........r.........#',
  '#............................#',
  '#............................#',
  '#....r.................r.....#',
  '#............................#',
  '#.............P..............#',
  '##############################'];
const ENEMY_OF = { s: 'swordsman', p: 'spearman', d: 'shieldman', b: 'brute', A: 'archer' };

let hemi, moon;
const $ = id => document.getElementById(id);
function init(){
  G.renderer = new THREE.WebGLRenderer({ antialias: true });
  G.renderer.outputEncoding = THREE.sRGBEncoding;
  G.renderer.shadowMap.enabled = true; G.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  $('stage').appendChild(G.renderer.domElement);
  UI.layer = $('ui');
  G.scene = new THREE.Scene();
  initCamera();
  hemi = new THREE.HemisphereLight(0x8fa6d8, 0x1a120d, 0.55); G.scene.add(hemi);
  moon = new THREE.DirectionalLight(0xc8d4ff, 0.55); moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048);
  Object.assign(moon.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 }); G.scene.add(moon); G.scene.add(moon.target);
  G.rain = makeRain(); G.scene.add(G.rain.lines);
  bindMouse(G.renderer.domElement);
  addEventListener('resize', resize); resize();
  $('ver').textContent = VERSION;
  preload().then(() => { $('boot').remove(); startLobby(); requestAnimationFrame(loop); });
}
function resize(){
  const w = innerWidth, h = innerHeight; UI.W = w; UI.H = h;
  G.renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); G.renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
}
function preload(){
  const srcs = new Set(); for (const S of Object.values(SPR)) for (const P of Object.values(S.poses)) if (P.src) srcs.add(P.src);
  return Promise.all([...srcs].map(src => new Promise(res => { const t = texLoader.load(src, () => res(), undefined, () => res()); t.encoding = THREE.sRGBEncoding; texCache[src] = t; })));
}

/* ---------- 판 정리 · 불러오기 ---------- */
function clearLevel(){
  for (const u of [...G.units]) removeUnit(u);
  for (const d of G.decals) G.scene.remove(d.g); for (const p of G.projs) G.scene.remove(p.m); for (const f of G.fx) G.scene.remove(f.g || f.s);
  for (const o of G.props) G.scene.remove(o);
  G.texts.forEach(t => t.el.remove()); marks.forEach(m => m.remove()); marks.length = 0;
  Object.assign(G, { units: [], decals: [], projs: [], fx: [], props: [], inspect: [], texts: [], boss: null, focusTarget: null, flags: {}, lock: false, onKill: null, onBossPhase: null });
  if (G.map) G.scene.remove(G.map.group);
  if (P.spearObj){ G.scene.remove(P.spearObj.m); P.spearObj = null; } P.spear = true; P.aiming = false;
  G.rain.on = false; $('bossbar').hidden = true; letterbox(false);
}
function loadLevel(rows, theme){
  CAM.yaw = CAM.yawT = 0; CAM.yawBefore = null; CAM.track = null; CAM.zone = null;
  G.map = buildWorld(rows, theme); G.scene.add(G.map.group);
  G.scene.background = new THREE.Color(theme.bg); G.scene.fog = new THREE.Fog(theme.bg, theme.fogNear, theme.fogFar);
  hemi.intensity = theme.hemi; moon.intensity = theme.moon;
  for (const L of theme.lights || []){ const l = new THREE.PointLight(L.c, L.i, L.d, 1.6); l.position.set(L.x, L.y || 2.5, L.z); G.map.group.add(l); }
  const sp = c => G.map.spawns.filter(s => s.c === c);
  return sp;
}
function spawnParty(x, z){
  G.kits = MEDIC.kits;   // 노먼 구급상자: 판 (층)마다 다시 채움
  G.player = spawn('player', x, z, 'ally');
  spawn('morningstar', x - 1, z - 0.6, 'ally');
  spawn('norman', x + 1, z - 0.6, 'ally');
}

/* ---------- 굴 (로비) ---------- */
function startLobby(){
  clearLevel(); G.mode = 'lobby';
  const sp = loadLevel(LOBBY, { bg: 0x0d0a0c, fogNear: 14, fogFar: 30, hemi: 0.35, moon: 0.15, floor: 0x3e3530, wall: 0x2c2420 });
  const p = sp('P')[0]; G.player = spawn('player', p.x, p.z, 'ally');
  const R = sp('R')[0], M = sp('M')[0], N = sp('N')[0], D = sp('D')[0];
  const reb = spawn('rebecca', R.x, R.z, 'neutral'); reb.face = 1;
  const ms = spawn('morningstar', M.x, M.z, 'neutral'), nm = spawn('norman', N.x, N.z, 'neutral'); nm.face = -1;
  spawn('dummy', D.x, D.z, 'neutral');
  talkable(reb, ['(검을 무릎에 올려두고 불을 쬐고 있다)', '인주 님. 오늘도 내려가실 거죠?', '…조심하세요. 1층에서 말 없는 붉은 날개를 봤다는 사람이 있어요.']);
  talkable(ms, ['슈퍼스타 대기 중.', '무대는 아래에 있지? 데려가.']);
  talkable(nm, ['…붕대는 충분하다.', '…다치면 불러라.']);
  const gx = G.map.gate ? G.map.gate.x : 7.5, gz = 1.9;
  G.inspect.push({ x: gx, z: gz, r: 1.6, label: '석문을 연다 — 아래로', fn: descend });
  camSnapTo(p.x, p.z + 3); camWide(7.5, 5, 11, 9, 1.4);
  caption('굴', '떨어진 자들이 모여 사는 곳');
  if (!G.seenHelp){ $('help').hidden = false; G.seenHelp = true; }
}
function talkable(u, lines){ G.inspect.push({ unit: u, r: 1.6, label: `${u.D.name}에게 말을 건다`, fn: async () => { u.face = Math.sign(G.player.x - u.x) || u.face; camFocus(u.x, u.z, 99, 3.2, 4.6, 0.05); await textbox(u.D.name, lines); camFocusOff(); } }); }
async function descend(){
  G.lock = true;
  camFocus(G.player.x, 2, 1.2, 3.5, 4.5, 0.04); await wait(1.0);
  await loadScreen('assets/load_moon.jpg', ['석문이 열렸습니다.', '계단은 생각보다 길었습니다. 셀 수 없을 만큼.', '발소리가 돌아오지 않습니다. 아래로, 아래로.']);
  startFloor1();
}

/* ---------- 1층 ---------- */
function startFloor1(){
  clearLevel(); G.mode = 'floor';
  const sp = loadLevel(FLOOR1, { bg: 0x08090d, fogNear: 16, fogFar: 34, hemi: 0.32, moon: 0.36, floor: 0x3a3842, wall: 0x24222c, pillar: 0x4a4656,
    lights: [{ x: 9, z: 4, c: 0xff3a30, i: 1.6, d: 12 }, { x: 20, z: 6, c: 0xff3a30, i: 1.6, d: 12 }, { x: 15, z: 16, c: 0x7f9fff, i: 1.1, d: 14 },
             { x: 12, z: 28, c: 0x9fb4ff, i: 1.0, d: 14 }, { x: 15, z: 36, c: 0x9fb4ff, i: 0.9, d: 14 }] });
  const p = sp('P')[0]; spawnParty(p.x, p.z);
  for (const [c, kind] of Object.entries(ENEMY_OF)) for (const s of sp(c)){
    const e = spawn(kind, s.x, s.z, 'enemy');
    e.band = s.z < 11 ? 'arena' : s.z < 20 ? 'C' : s.z < 31 ? 'B' : 'A';
    e.face = 1; e.aim = Math.PI / 2;   // 내려오는 쪽 (카메라 쪽)을 봄
  }
  const J = sp('J')[0]; G.arena = { x: J.x, z: J.z };
  const x = sp('x')[0], m = sp('m')[0], fire = G.map.fires[0];
  G.inspect.push({ x: x.x, z: x.z, r: 1.3, label: '시체를 살핀다', fn: async () => { camFocus(x.x, x.z, 99, 2.4, 3.2, 0.05); await textbox('', ['모닥불 곁에 앉은 채로 굳은 시체.', '…그는 찾지 못한 듯하다.']); camFocusOff(); } });
  G.inspect.push({ x: m.x, z: m.z, r: 1.2, label: '바닥의 글씨를 읽는다', fn: async () => { camFocus(m.x, m.z, 99, 2.2, 2.6, 0.05); await textbox('', ['바닥에 손톱으로 긁어 쓴 글씨.', '"겁쟁이!"', '누가, 누구에게 쓴 걸까요.']); camFocusOff(); } });
  // 모닥불 곁방: 들어가면 카메라가 동쪽 (입구 쪽)으로 돌아 안을 보여줌, 나오면 원래대로
  G.map.zones = [{ x0: 5.6, x1: 11.7, z0: 20.6, z1: 23.4, yaw: Math.PI / 2, cut: true }];
  G.inspect.push({ x: fire.x, z: fire.z, r: 1.6, once: true, label: '모닥불 곁에서 쉰다', mark: '모닥불 (쉬기)', far: 40, fn: rest });
  G.onKill = (u) => { if (u === G.boss) bossDown(u); };
  // 넓게 먼저: 저 멀리 붉은 빛 (우물) → 천천히 인주에게
  G.lock = true; letterbox(true);
  camSnapTo(14.5, 22); camWide(14.5, 18, 30, 18, 99);
  caption('1층', '무덤 가는 길');
  (async () => {
    await wait(1.6); camWide(14.5, 5, 12, 12, 99); await wait(2.4, true);
    CAM.wide = null; letterbox(false); G.lock = false;
  })();
}
async function rest(){
  G.lock = true; letterbox(true);
  const f = G.map.fires[0]; camFocus(f.x, f.z, 99, 2.1, 3.6, 0.03);
  await wait(2.2);
  await textbox('', ['불이 탁탁 튑니다.', '잠시 쉽니다. 모두 체력을 40% 되찾습니다.']);
  for (const u of G.units) if (u.side === 'ally'){ if (u.downed){ u.downed = false; u.hp = 0; } u.hp = Math.min(u.max, u.hp + Math.round(u.max * 0.4)); popText(u.x, u.y + 1.8, u.z, '+', 'heal'); }
  camFocusOff(); letterbox(false); G.lock = false;
}

/* ---------- 적뢰: 비 · 천둥 · 붉은 빛이 떨어짐 · 정적 · 예고 없는 날아차기 ---------- */
async function bossIntro(){
  G.flags.boss = true; G.lock = true; letterbox(true);
  // 들어온 길을 붉은 번개 벽이 막음
  for (let x = 13; x <= 16; x++){ G.map.solid[10 * G.map.w + x] = 1; }
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.7), new THREE.MeshBasicMaterial({ map: sparkTex, color: 0xff2a2a, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
  wall.position.set(14.5, 0.35, 10.45); G.map.group.add(wall); G.flags.barrier = wall;
  const C = G.arena;
  // 모두 우물 안으로 (막는 줄 위에 서 있지 않게)
  G.units.filter(u => u.side === 'ally').forEach((u, i) => { u.x = 14.5 + (i - 1) * 1.1; u.z = 8.6 + (i ? 0.3 : 0); u.kx = u.kz = 0; });
  camWide(C.x, C.z + 2, 9, 10, 99);
  G.rain.on = true;
  await wait(0.5); flashScreen('#ffffff', 0.5); camShake(0.15, 0.3);
  await wait(0.9); flashScreen('#ffe8e8', 0.6); camShake(0.2, 0.3);
  await wait(0.7);
  // 붉은 빛 하나가 떨어짐
  const streak = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color: 0xff3020, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  streak.scale.set(1.2, 6, 1); streak.position.set(C.x, 24, C.z); G.scene.add(streak);
  const t0 = G.t; await waitUntil(() => { const k = Math.min(1, (G.t - t0) / 0.4); streak.position.y = 24 - 21 * k; return k >= 1; });
  G.scene.remove(streak);
  flashScreen('#ffffff', 0.9); camShake(0.6, 0.5); ring(C.x, C.z, 0xff5040, 5, 0.6); dust(C.x, C.z, 24); spark(C.x, 1, C.z, 0xff8060, 30, 9);
  const boss = spawn('jeokroe', C.x, C.z, 'enemy'); G.boss = boss; boss.alert = true; boss.band = 'boss'; setAim(boss, G.player.x, G.player.z);
  // 정적: 빗방울이 멈춘 듯
  G.rain.freeze = 1.3; camFocus(boss.x, boss.z, 99, 3.4, 6.5, 0.07);
  await wait(1.3);
  // 예고 없이: 날아차기
  camFocusOff(); CAM.wide = null;
  const pl = G.player, a = Math.atan2(pl.z - boss.z, pl.x - boss.x), L = Math.max(0, dist(boss, pl) - 1);
  setPose(boss, 'leap');
  const t1 = G.t; await waitUntil(() => { const k = Math.min(1, (G.t - t1) / 0.22); boss.x = C.x + Math.cos(a) * L * k; boss.z = C.z + Math.sin(a) * L * k; boss.lift = Math.sin(Math.PI * k) * 1.2; return k >= 1; });
  boss.lift = 0; setPose(boss, 'kick');
  hurt(boss, pl, 22, { kb: 3, from: boss, stun: 0.7, unblockable: true });
  camShake(0.65, 0.5);   // 확대 · 앵글 없이 진동만
  bossInit(boss, C);
  $('bossbar').hidden = false; $('bossname').textContent = '적뢰 — 붉은 날개의 천사';
  await wait(0.5);
  letterbox(false); G.lock = false;
}
async function bossDown(u){
  G.slow = 0.25; camSide(G.player, u, 2.4, 1.9);
  setPose(u, 'hurt'); u.lift = 0; u.airborne = false;
  await wait(0.6);
  G.slow = 1; G.lock = true; letterbox(true);
  for (const e of G.units) if (e.side === 'enemy') e.alert = false;
  await wait(1.6);
  await textbox('', ['적뢰가 무너집니다.', '대리석이 빗속에서 식어 갑니다.', '— 1층 시제품은 여기까지입니다. 굴로 돌아갑니다.']);
  startLobby();
}
async function defeat(){
  if (G.flags.defeat) return; G.flags.defeat = true;
  G.slow = 0.3; G.lock = true; letterbox(true);
  await wait(0.8); G.slow = 1;
  await textbox('', ['…', '눈을 뜨니 굴입니다.', '누군가 당신들을 끌고 올라왔습니다.']);
  startLobby();
}

/* ---------- 글상자 · 로딩 · 자막 · 화면 효과 ---------- */
// 글상자: 한 줄씩. 줄마다 최소 0.5초는 머묾 (눌러도 넘어가지 않음), 그 뒤 E · Space · 클릭으로 다음
function textbox(who, lines){
  return new Promise(res => {
    const box = $('textbox'); box.hidden = false; let i = -1, shownAt = 0;
    const next = () => {
      if (G.t - shownAt < 0.5 && i >= 0) return;
      i++; if (i >= lines.length){ box.hidden = true; G.waitInput = null; res(); return; }
      box.innerHTML = `${who ? `<b>${who}</b>` : ''}<p>${lines[i]}</p><span class="more">${i < lines.length - 1 ? '▼' : '■'}</span>`;
      box.querySelector('p').classList.add('in'); shownAt = G.t;
    };
    G.waitInput = next; next();
  });
}
// 로딩: 한 줄씩 떠오름. 다 뜨고 0.8초 뒤에야 "계속"이 나타나고, 그때 눌러야 넘어감. 그 전에 누르면 남은 줄만 다 보여줌
function loadScreen(img, lines){
  return new Promise(res => {
    const el = $('load'); el.hidden = false; el.style.backgroundImage = `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.8)), url(${img})`;
    const box = el.querySelector('.lines'); box.innerHTML = ''; const go = el.querySelector('.go'); go.hidden = true;
    const t0 = performance.now(); let ready = false;
    lines.forEach((t, i) => { const d = document.createElement('p'); d.textContent = t; d.style.animationDelay = (0.4 + i * 1.3) + 's'; box.appendChild(d); });
    const total = 400 + lines.length * 1300 + 800;
    const timer = setTimeout(() => { ready = true; go.hidden = false; }, total);
    G.waitInput = () => {
      if (!ready){ box.querySelectorAll('p').forEach(p => { p.style.animationDelay = '0s'; }); clearTimeout(timer); setTimeout(() => { ready = true; go.hidden = false; }, 900); return; }
      if (performance.now() - t0 < 600) return;
      G.waitInput = null; el.hidden = true; res();
    };
  });
}
function caption(big, small){ const c = $('caption'); c.innerHTML = `<b>${big}</b><span>${small}</span>`; c.classList.remove('show'); void c.offsetWidth; c.classList.add('show'); }
function letterbox(on){ document.body.classList.toggle('cine', on); }
function flashScreen(color, a){ const f = $('flash'); f.style.background = color; f.style.transition = 'none'; f.style.opacity = a; requestAnimationFrame(() => { f.style.transition = 'opacity .5s'; f.style.opacity = 0; }); }
// 게임 시간 기다리기 (히트스톱 · 슬로우에 맞춰 흐름)
G.waits = [];
function wait(sec, skippable){ return new Promise(r => G.waits.push({ until: G.t + sec, r, skippable })); }
function waitUntil(fn){ return new Promise(r => G.waits.push({ fn, r })); }
function runWaits(){ G.waits = G.waits.filter(w => { if (w.fn ? w.fn() : G.t >= w.until){ w.r(); return false; } return true; }); }

/* ---------- 살펴보기 · 대화 ---------- */
function nearestInspect(){
  const p = G.player; let best = null, bd = 99;
  for (const it of G.inspect){
    if (it.used) continue;
    const x = it.unit ? it.unit.x : it.x, z = it.unit ? it.unit.z : it.z, d = Math.hypot(p.x - x, p.z - z);
    if (d < it.r && d < bd){ bd = d; best = it; }
  }
  return best;
}

/* ---------- 화면 위 정보 ---------- */
// 왼쪽 아래: 노먼 구급상자 (남은 수 · 다시 쓸 수 있을 때까지 도는 고리)
function medicHud(){
  const n = G.mode === 'floor' && G.units.find(u => u.D.medic && u.side === 'ally');
  if (!n) return '';
  const left = G.kits || 0, ready = Math.max(0, Math.min(1, 1 - (n.healCd || 0) / MEDIC.cd)), off = n.downed || !left;
  const pips = Array.from({ length: MEDIC.kits }, (_, i) => `<em class="${i < left ? 'on' : ''}"></em>`).join('');
  return `<div class="sk ${off ? 'off' : ready >= 1 ? 'ready' : ''}"><span class="cd" style="--p:${(off ? 0 : ready) * 360}deg"><i>✚</i></span><span>노먼 · 구급상자</span><span class="pips">${pips}</span><small>${n.downed ? '쓰러짐' : left ? (ready >= 1 ? '준비' : Math.ceil(n.healCd) + '초') : '없음'}</small></div>`;
}
function updateHud(){
  const party = G.units.filter(u => u.side === 'ally');
  $('party').innerHTML = party.map(u => `<div class="pm ${u.downed ? 'down' : ''}"><span>${u.D.name}</span><i><b style="width:${Math.max(0, u.hp / u.max * 100)}%"></b></i><small>${Math.max(0, Math.round(u.hp))}/${u.max}</small></div>`).join('')
    + medicHud()
    + (G.mode === 'floor' ? `<div class="sp">${P.spear ? '🔱 창을 쥠' : '창이 땅에 있음 (주워야 투창)'}</div>` : '');
  document.querySelectorAll('#cmd [data-c]').forEach(b => b.classList.toggle('on', b.dataset.c === G.cmd));
  $('cmd').hidden = G.mode !== 'floor';
  if (G.boss && !$('bossbar').hidden){ $('bossfill').style.width = Math.max(0, G.boss.hp / G.boss.max * 100) + '%'; $('bossphase').textContent = G.boss.B && G.boss.B.phase === 2 ? '2페이즈 — 하늘 (근접이 닿지 않음 · 기둥 뒤에 숨기)' : ''; }
  const it = !G.lock && !G.waitInput && G.player ? nearestInspect() : null;
  $('prompt').hidden = !it; if (it) $('prompt').innerHTML = `<kbd>E</kbd> ${it.label}`;
  G.nearIt = it;
  updateMarks();
}

// 살펴볼 수 있는 것: 멀리서도 ◆ + 이름이 떠 있음 (벽에 가려져도 보임). 가까이 가면 E 안내로 바뀜
const marks = [];
function updateMarks(){
  const list = G.player && !G.lock && (G.mode === 'floor' || G.mode === 'lobby') ? G.inspect.filter(it => !it.used) : [];
  while (marks.length < list.length){ const d = document.createElement('div'); d.className = 'mark'; UI.layer.appendChild(d); marks.push(d); }
  marks.forEach((m, i) => {
    const it = list[i]; if (!it){ m.hidden = true; return; }
    const x = it.unit ? it.unit.x : it.x, z = it.unit ? it.unit.z : it.z, d = Math.hypot(G.player.x - x, G.player.z - z);
    if (it === G.nearIt || d > (it.far || 16)){ m.hidden = true; return; }
    const y = heightAt(G.map, x, z) + (it.unit ? bodyH(it.unit) + 1.0 : 1.6), p = toScreen(x, y, z, UI.W, UI.H);
    if (p.behind){ m.hidden = true; return; }
    // 화면 밖이면 가장자리에 붙여서 (멀리 있는 모닥불도 처음부터 보이게)
    const px = clamp(p.x, 60, UI.W - 60), py = clamp(p.y, 70, UI.H - 150), edge = px !== p.x || py !== p.y;
    if (edge && !it.far){ m.hidden = true; return; }
    m.hidden = false; m.style.transform = `translate(${px}px,${py}px) translateX(-50%)`; m.style.opacity = edge || d > 11 ? 0.6 : 1;
    const label = it.unit ? '' : it.mark || it.label.split(' — ')[0]; if (m.textContent !== label) m.textContent = label;
  });
}

/* ---------- 한 프레임 ---------- */
let last = performance.now();
function loop(now){
  requestAnimationFrame(loop);
  let dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (G.hitstop > 0){ G.hitstop -= dt; dt *= 0.06; }
  dt *= G.slow;
  G.t += dt; G.dt = dt;
  // 입력: 글상자 · 로딩이 떠 있으면 거기로
  const act = hit('KeyE') || hit('Space') || hit('Enter') || hit('Mouse0');
  const waiting = !!G.waitInput;
  if (G.waitInput){ if (act) G.waitInput(); }
  else if (!G.lock && G.nearIt && hit('KeyE')){ const it = G.nearIt; if (it.once) it.used = true; it.fn(); }
  if (hit('Digit1')) order('follow'); if (hit('Digit2')) order('focus'); if (hit('Digit3')) order('free');
  if (hit('KeyH')) $('help').hidden = !$('help').hidden;
  if (!G.lock && !G.waitInput){ if (hit('KeyZ')) rotateCam(-1); if (hit('KeyC')) rotateCam(1); }
  const frozen = waiting || !!G.waitInput;
  if ((G.mode === 'lobby' || G.mode === 'floor') && !frozen){
    const pl = G.player;
    if (pl) playerUpdate(pl, dt);
    for (const u of G.units){
      if (u.dead){ if (u.fading){ u.mat.opacity = Math.max(0, 1 - (G.t - u.fading)); u.mat.transparent = true; u.mat.alphaTest = 0; } continue; }
      if (u.side === 'enemy' && !G.lock){ if (u.D.boss) bossThink(u, dt); else enemyThink(u, dt); }
      else if (u.side === 'ally' && G.mode === 'floor' && !G.lock) allyThink(u, dt);
      else if (u.side === 'ally' && G.mode === 'floor' && G.lock && u.kind !== 'player'){ u.moving = false; }
      if (u !== pl && (u.jy || u.jv)) updateJump(u, dt);   // 동료 점프 (높은 바닥에 오름)
      if (Math.abs(u.kx) + Math.abs(u.kz) > 0.02){ moveBy(u, u.kx * dt, u.kz * dt); const f = Math.exp(-dt * 8); u.kx *= f; u.kz *= f; }
      u.y += (heightAt(G.map, u.x, u.z) - u.y) * Math.min(1, dt * 12);
      if (u.kind !== 'player' && u.S.poses.walk == null && u.st === 'idle' && !u.D.boss) setPose(u, u.pose === 'shoot' || u.pose === 'heal' ? u.pose : 'idle');
    }
    separate(dt);
    if (G.mode === 'floor'){
      reviveCheck(dt);
      // 인주가 쓰러져도 싸움은 계속 (동료가 싸움). 모두 쓰러져야 끝
      if (pl.downed && !G.flags.plDown){ G.flags.plDown = true; caption('인주 쓰러짐', '동료가 버티는 동안 싸움이 끝나면 일어남'); }
      if (!pl.downed) G.flags.plDown = false;
      if (G.units.filter(u => u.side === 'ally').every(u => u.downed || u.dead)) defeat();
      if (!G.flags.boss && pl.z < 10.6) bossIntro();
    }
  }
  for (const u of G.units) updateSprite(u, dt);
  if (!frozen){ updateDecals(dt); updateProjs(dt); } updateFx(dt); runWaits();
  // 카메라: 평소엔 인주, 싸움 중엔 가까운 적 쪽으로 조금
  if (G.player){
    const eye = G.player.downed ? (allies()[0] || G.player) : G.player;   // 인주가 쓰러지면 버티는 동료를 봄
    let tx = eye.x, tz = eye.z;
    const foe = G.boss && !G.boss.dead ? G.boss : nearest(eye, foes().filter(e => e.alert), 9);
    if (foe){ const w = G.boss ? 0.45 : 0.3; tx = lerp(tx, foe.x, w); tz = lerp(tz, foe.z, w); }
    if (!G.lock) updateCamZone(G.player);
    updateCamera(dt, { x: tx, z: tz });
    moon.position.set(camera.position.x - 6, 14, camera.position.z - 2); moon.target.position.set(CAM.follow.x, 0, CAM.follow.z);
  }
  G.rain.freeze = Math.max(0, G.rain.freeze - dt); G.rain.update(dt, CAM.follow.x, CAM.follow.z);
  // 기둥 뒤에 서면 기둥을 반투명하게 (카메라가 어느 쪽에 있든)
  if (G.map){ const o = camOff(CAM.yaw, 1); for (const p of G.map.pillars){
    const hide = G.units.some(u => { if (u.side !== 'ally' || u.dead) return false; const dx = p.position.x - u.x, dz = p.position.z - u.z, along = dx * o.x + dz * o.z, side = Math.abs(dx * o.z - dz * o.x); return along > 0 && along < 2.4 && side < 0.9; });
    p.material.opacity += ((hide ? 0.28 : 1) - p.material.opacity) * Math.min(1, dt * 10);
    p.material.depthWrite = p.material.opacity > 0.9;
  } }
  if (G.map) for (const f of G.map.fires){ f.light.intensity = 1.9 + Math.sin(G.t * 13) * 0.2 + Math.random() * 0.35; f.flame.scale.set(1 + Math.sin(G.t * 9) * 0.06, 1 + Math.random() * 0.12, 1); f.flame.rotation.y = Math.atan2(camera.position.x - f.x, camera.position.z - f.z); }
  if (G.player) updateChargeRing(G.player);
  updateFocusRing();
  updateBars(); updateTexts(dt); updateHud();
  // 키보드가 다른 곳 (채팅 입력칸 등)으로 가 있으면 알려줌 → 화면을 누르면 돌아옴
  $('focusnote').hidden = document.hasFocus() || !!G.waitInput || G.mode === 'boot';
  const rf = $('redflash'); rf.style.opacity = Math.max(0, (+rf.style.opacity || 0) - dt * 1.6);
  if (G.scene.fog && G.map){ const cd = camera.position.distanceTo(new THREE.Vector3(CAM.follow.x, 0, CAM.follow.z)); G.scene.fog.near = cd * 0.95; G.scene.fog.far = cd * 1.9 + 6; }
  G.renderer.render(G.scene, camera);
  pressed.clear();
}
document.querySelectorAll('#cmd [data-c]').forEach(b => b.addEventListener('click', () => order(b.dataset.c)));
// 지시: 동료가 대답하고, "내 목표"면 마우스 아래 적 (없으면 가장 가까운 적)을 금색 고리로 표시
const ORDER_SAY = { follow: ['따라와!', '알겠어', '…뒤에 붙는다'], focus: ['저놈이다!', '맡겨', '…조준'], free: ['알아서 싸워!', '신난다', '…자유 사격'] };
function order(c){
  G.cmd = c;
  if (G.player) popText(G.player.x, G.player.y + 2.3, G.player.z, ORDER_SAY[c][0], 'aim', 0.9);
  G.units.filter(u => u.side === 'ally' && u.kind !== 'player' && !u.downed).forEach((u, i) => popText(u.x, u.y + 2.1, u.z, ORDER_SAY[c][1 + (i % 2)], 'miss', 0.9));
  if (c === 'focus') G.focusTarget = mouse.over || (G.player && nearest(G.player, foes().filter(e => e.alert || dist(e, G.player) < 9), 14)) || G.focusTarget;
}
let focusRing = null;
function updateFocusRing(){
  if (!focusRing){ focusRing = new THREE.Mesh(new THREE.RingGeometry(0.7, 0.86, 40), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false })); focusRing.rotation.x = -Math.PI / 2; G.scene.add(focusRing); }
  const t = G.focusTarget; focusRing.visible = G.cmd === 'focus' && !!t && !t.dead && G.mode === 'floor';
  if (focusRing.visible){ focusRing.position.set(t.x, t.y + 0.05, t.z); focusRing.scale.setScalar(t.r * 1.6 * (1 + Math.sin(G.t * 6) * 0.06)); }
}
init();
