/* expedition.js v1.12 — 원정 (한 번의 런). v1.12: 땅 기믹 (mapfx.js) · 망루 위 궁수 · 단상 위 강적 · 보물. v1.11: 전멸하면 인주가 뻗은 자세. v1.1: 상황 방 (situations.js) · 포로 · 손님은 전멸 판정에서 뺌
   준비 (동료 · 식량 · 횃불) → 층마다 절차 생성 맵 → 적 무리 · 강적 · 상자 · 모닥불 · 무덤 · 제단 → 계단으로 아래로 / 귀환 줄로 굴로
   · 횃불: 하나에 4분. 다 타면 시야 2칸 + 정신도가 빨리 줆
   · 정신도: 어둠 속에서 천천히 줆. 낮으면 환청 · 화면 가장자리가 어두워짐, 0이면 공포 (몸이 굳음)
   · 전리품: 쓰러뜨린 적 · 상자 · 무덤에서. 등급은 층이 깊을수록 좋음. 바닥에 떨어진 것은 걸어가면 주움
   · 생환: 가방은 그대로 (식량 · 땔감 · 달팽이 먹이는 굴 창고로). 전멸: 가방은 그 층 바닥에 (3일 안에 가면 주울 수 있음) */
'use strict';
let EXP = null;
const EXP_TORCH = 240;

/* ---------- 전리품 표 ---------- */
const LOOT = { gear: null, relic: null, cons: [
  ['I-037', 10, 1], ['I-061', 8, 1], ['I-046', 4, 1], ['I-038', 6, 1], ['I-104', 7, 1], ['I-282', 5, 1], ['I-283', 3, 1], ['I-285', 6, 1], ['I-050', 5, 1], ['I-043', 3, 1],
  ['I-053', 4, 1], ['I-073', 2, 1], ['I-074', 2, 1], ['I-021', 2, 2], ['I-064', 2, 3], ['I-065', 1, 3], ['I-048', 2, 1], ['I-059', 1, 2], ['I-071', 1, 1], ['I-041', 1, 2],
  ['I-056', 2, 1], ['I-030', 5, 1], ['I-031', 8, 1], ['I-276', 4, 1], ['I-034', 3, 1], ['I-057', 1, 1], ['I-262', 2, 1], ['I-274', 1, 1], ['I-279', 4, 1], ['I-261', 3, 1],
  ['I-254', 2, 2], ['I-244', 1, 3], ['I-258', 1, 4], ['I-284', 2, 2], ['I-281', 1, 3], ['I-009', 1, 2], ['I-016', 1, 2], ['I-015', 1, 1], ['I-017', 1, 1], ['I-270', 2, 1],
  ['I-280', 2, 1], ['I-246', 1, 2], ['I-275', 1, 1], ['I-265', 1, 2], ['I-278', 1, 2], ['I-250', 1, 3], ['I-248', 1, 3], ['I-076', 1, 5], ['I-077', 1, 4], ['I-004', 1, 3]] };
function lootPools(){
  if (LOOT.gear) return;
  LOOT.gear = [[], [], [], [], [], [], []]; LOOT.relic = [[], [], [], [], [], [], []];
  for (const [id, d] of Object.entries(ITEMS)){
    if (id.startsWith('B-') || id.startsWith('EQ-60')) continue;          // 보스 장비는 보스만
    if (isGear(d) && !d.relic) LOOT.gear[d.r].push(id);
    else if (d.relic || d.s === 'carry') LOOT.relic[Math.min(6, d.r)].push(id);
  }
}
function rollRarity(F, bonus = 0){
  const luck = ((G.player && G.player.fx && G.player.fx.luck) || 0) / 100 + bonus;
  const w = [Math.max(0, 30 - 6 * F), Math.max(4, 40 - 2.5 * F), 22 + 2 * F, 6 + 2.6 * F, 1 + 1.5 * F, Math.max(0, (F - 3) * 0.9), 0];
  for (let i = 6; i >= 1; i--) w[i] *= 1 + luck * i;
  const tot = w.reduce((a, b) => a + b, 0); let r = Math.random() * tot;
  for (let i = 0; i < 7; i++){ r -= w[i]; if (r <= 0) return i; }
  return 1;
}
function rollItem(F, o = {}){
  lootPools();
  const t = o.type || (Math.random() < 0.46 ? 'gear' : Math.random() < 0.8 ? 'cons' : 'relic');
  if (t === 'cons'){
    const pool = LOOT.cons.filter(c => c[2] <= F), tot = pool.reduce((a, c) => a + c[1], 0); let r = Math.random() * tot;
    for (const c of pool){ r -= c[1]; if (r <= 0) return c[0]; } return 'I-037';
  }
  let rr = Math.min(5, rollRarity(F, o.bonus || 0) + (o.plus || 0));
  const P2 = t === 'relic' ? LOOT.relic : LOOT.gear;
  while (rr >= 0 && !P2[rr].length) rr--;
  const pool = P2[Math.max(0, rr)];
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ---------- 바닥의 전리품 (걸어가면 주움) ---------- */
const iconSheets = [];
function iconMesh(d, size = 0.5){
  const A2 = ITEM_ART.icon, per = A2.cols * A2.cols, si = Math.floor(d.i / per), k = d.i % per;
  const base = iconSheets[si] || (iconSheets[si] = loadTex(A2.sheets[si]));
  const geo = new THREE.PlaneGeometry(1, 1), [Wd, Ht] = A2.size[si], col = k % A2.cols, row = Math.floor(k / A2.cols);
  const u0 = col * A2.cell / Wd, u1 = (col + 1) * A2.cell / Wd, v1 = 1 - row * A2.cell / Ht, v0 = 1 - (row + 1) * A2.cell / Ht, uv = geo.attributes.uv;
  uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: base, transparent: true, alphaTest: 0.2, side: THREE.DoubleSide, fog: false }));
  m.scale.set(size, size, 1); return m;
}
function dropLootAt(x, z, what, o = {}){
  // what: 아이템 id · 아이템 · { gold: n }
  const ang = rnd(0, 6.28), L = o.spread ?? rnd(0.3, 1.1);
  let tx = x + Math.cos(ang) * L, tz = z + Math.sin(ang) * L; if (solidAt(G.map, tx, tz)){ tx = x; tz = z; }
  const it = what && what.gold ? null : typeof what === 'string' ? makeItem(what) : what;
  if (!it && !(what && what.gold)) return;
  const d = it ? itemDef(it) : null, r = d ? d.r || 0 : 0;
  const g = new THREE.Group(); g.position.set(x, heightAt(G.map, x, z), z); G.scene.add(g); G.props.push(g);
  let m;
  if (d) { m = iconMesh(d, d.c === 'weapon' || d.c === 'armor' ? 0.62 : 0.48); m.position.y = 0.45; g.add(m); }
  else { m = new THREE.Mesh(new THREE.CircleGeometry(0.12, 12), new THREE.MeshBasicMaterial({ color: 0xffd35a, side: THREE.DoubleSide })); m.position.y = 0.2; g.add(m); }
  const col = d ? new THREE.Color(RAR[r].c) : new THREE.Color(0xffd35a);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.26, 24), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; g.add(ring);
  let pillar = null;
  if (r >= 3){ pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.16, 5, 10, 1, true), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    pillar.position.y = 2.5; g.add(pillar); if (r >= 5){ SFX.burst({ type: 'bandpass', f: 1800, q: 8, gain: 0.25, dec: 0.9 }); } }
  const o2 = { x: tx, z: tz, sx: x, sz: z, t0: G.t, it, gold: what && what.gold, g, m, ring, pillar, r };
  DUN.items.push(o2);
  return o2;
}
function tickLoot(dt){
  const pl = G.player;
  DUN.items = DUN.items.filter(o => {
    const k = Math.min(1, (G.t - o.t0) / 0.45);
    const x = lerp(o.sx, o.x, k), z = lerp(o.sz, o.z, k);
    o.g.position.set(x, heightAt(G.map, x, z) + Math.sin(k * Math.PI) * 0.8, z);
    if (o.m){ o.m.rotation.y = CAM.yaw; o.m.position.y = (o.it ? 0.45 : 0.2) + Math.sin(G.t * 3 + o.x) * 0.05; }
    if (o.ring) o.ring.material.opacity = 0.45 + 0.3 * Math.sin(G.t * 4 + o.z);
    if (!pl || pl.downed || k < 1) return true;
    if (Math.hypot(pl.x - o.x, pl.z - o.z) > 0.85) return true;
    if (o.gold){ RPG.gold += o.gold; popText(o.x, 1.2, o.z, `+${o.gold} 금화`, 'gold', 0.8); SFX.burst({ type: 'bandpass', f: 2400, q: 6, gain: 0.14, dec: 0.12 }); G.scene.remove(o.g); return false; }
    const d = itemDef(o.it), res = addItem(o.it);
    if (!res){ if (G.t - (EXP.fullT || -9) > 3){ EXP.fullT = G.t; popText(pl.x, pl.y + 2.4, pl.z, '가방이 가득 (I로 정리)', 'miss', 1.4); } return true; }
    EXP.got.push(o.it.id);
    if (res.ammo) popText(o.x, 1.3, o.z, Object.entries(res.ammo).map(([k, v]) => `+${v} ${AMMO_N[k]}`).join(' '), 'heal', 0.9);
    if (res.gold) popText(o.x, 1.3, o.z, `+${res.gold} 금화`, 'gold', 0.9);
    if (res.put || res.stacked){ if (typeof uiToast === 'function') uiToast(itemLine(o.it), 'loot r' + (d.r || 0)); autoQuick(o.it); }
    SFX.burst({ type: 'bandpass', f: 900 + (d.r || 0) * 300, q: 4, gain: 0.16, dec: 0.15 });
    G.scene.remove(o.g); saveRpg(); return false;
  });
}
function itemLine(it){ const d = itemDef(it); return `<span class="r${d.r || 0}">${d.n}</span>${it.n > 1 ? ` ×${it.n}` : ''} <small>${CAT_N[d.c] || ''}${d.wt ? ' · ' + WT_N[d.wt] : ''}</small>`; }
// 물약 · 붕대 · 수류탄 같은 것은 빈 소모품 칸에 자동으로
function autoQuick(it){
  const d = itemDef(it); if (!['potion', 'use', 'food'].includes(d.c)) return;
  if (RPG.quick.includes(it.id)) return;
  const i = RPG.quick.indexOf(null); if (i >= 0) RPG.quick[i] = it.id;
}

/* ---------- 원정 시작 ---------- */
function expStart(o = {}){
  lootPools();
  const party = o.party || ['inju', 'cheong', 'karius'];
  RPG.party = party.slice();
  for (const k of party){ const h = hero(k); if (h.hp == null || h.hp <= 0) h.hp = null; if (h.san == null) h.san = derive(h).maxSan; h.tripDay = PRO.day; }
  EXP = { F: o.F || 1, startF: o.F || 1, seed: (Math.random() * 0xffffffff) >>> 0, torches: o.torches ?? 3, torchT: EXP_TORCH, food: o.food ?? party.length, hungry: (o.food ?? party.length) < party.length,
    kills: 0, gold0: RPG.gold, xp0: party.map(k => hero(k).lv * 1000 + hero(k).xp), got: [], test: !!o.test, deepest: o.F || 1, t0: G.t, day: PRO.day };
  if (o.test && !RPG.meta.testKit){ RPG.meta.testKit = 1; RPG.ammo.arrow += 20; RPG.ammo.bullet += 30; RPG.ammo.shell += 8; ['I-037', 'I-037', 'I-061', 'I-061', 'I-104'].forEach(id => addItem(id)); RPG.quick = ['I-037', 'I-061', null, null]; }
  RPG.trips++; saveRpg();
  expLoadFloor(EXP.F, 'start');
}
function syncPartyOut(){
  for (const u of G.units) if (u.hero && u.side === 'ally'){ syncHeroHp(u); if (u.downed) u.hero.hp = Math.round(u.max * 0.2); }
}
async function expLoadFloor(F, how){
  syncPartyOut();
  clearLevel(); G.mode = 'exp'; EXP.F = F; EXP.deepest = Math.max(EXP.deepest, F); RPG.depth = Math.max(RPG.depth, F);
  const gen = genDungeon(F, (EXP.seed + F * 977) >>> 0), D = gen.D; EXP.gen = gen;
  loadLevel(gen.rows, { bg: 0x030305, fogNear: 10, fogFar: 26, hemi: 0.1, moon: 0, floor: D.floor, wall: D.wall, pillar: D.pillar });
  G.map.wallH = 2.4; layoutWalls(G.map, CAM.yawT || 0);
  Object.assign(DUN, { bills: [], sources: [], items: [], marks: [], seen: new Uint8Array(gen.W * gen.H), rooms: gen.rooms });
  setupDarkness(D); G.fogK = D.fog || 0.9;
  if (typeof mapFxBuild === 'function') mapFxBuild(gen);   // v1.12 가시 · 물 · 진흙
  EXP.reveal = false; EXP.radar = false; EXP.lit = true; EXP.meet = null; G.locks = [];
  // 원정대
  const s = gen.start, px = Math.round(s.cx), pz = Math.round(s.cz) + 1;
  for (const [i, k] of RPG.party.entries()){
    const h = hero(k); if (h.st !== 'ok') continue;
    const u = spawn(HERO_DEF[k].unit, px + (i === 0 ? 0 : i % 2 ? -1.1 : 1.1), pz + (i === 0 ? 0 : 0.7), 'ally');
    applyHero(u, h); if (k === 'inju') G.player = u;
    if (EXP.hungry){ u.max = Math.round(u.max * 0.85); u.hp = Math.min(u.hp, u.max); }
  }
  if (!G.player){ G.player = spawn('player', px, pz, 'ally'); applyHero(G.player, hero('inju')); }
  // 방 채우기
  for (const r of gen.rooms) fillRoom(r, gen);
  if (RPG.lost && RPG.lost.F === F && PRO.day - RPG.lost.day <= 3) placeLostBag(gen);
  G.onKill = expOnKill;
  G.cmd = 'free';
  camSnapTo(px, pz); CAM.yaw = CAM.yawT = 0;
  caption(`${F}층 · ${D.name}`, D.sub);
  if (F >= 5 && typeof heroCount === 'function') for (const k of RPG.party) heroCount(hero(k), 'deep');
  if (how === 'start' && !RPG.meta.expHelp){ RPG.meta.expHelp = 1; setTimeout(() => guide('어둡다. <em>횃불</em>이 다 타기 전에 · <em>계단</em>은 가장 먼 방 · <em>귀환 줄</em>로 굴로 · <em>I</em> 가방 · <em>M</em> 지도', 9), 1500); }
  uiExpHud(true);
}

/* ---------- 방 채우기 ---------- */
function roomTiles(r, pad = 1){
  const out = [];
  for (let j = r.z + pad; j < r.z + r.h - pad; j++) for (let i = r.x + pad; i < r.x + r.w - pad; i++) if (!G.map.solid[j * G.map.w + i]) out.push({ x: i, z: j });
  return out;
}
function takeTile(list, R){ if (!list.length) return null; return list.splice(Math.floor(R() * list.length), 1)[0]; }
function edgeTiles(r){ return roomTiles(r, 1).filter(t => t.x === r.x + 1 || t.x === r.x + r.w - 2 || t.z === r.z + 1 || t.z === r.z + r.h - 2); }
function lightProp(x, z, D, R){
  const k = R.pick(D.lights), b = dbill(DA + k + '.webp', x, z, k === 'H-293' || k === 'H-236' ? 0.6 : 1.25, { fit: 0.9, glow: 1 });
  const s = addSource(x, z, 3.6, D.glow, 0.95, 1.4);
  const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color: D.glow, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85 }));
  fl.scale.set(0.5, 0.7, 1); fl.position.set(x, heightAt(G.map, x, z) + (k === 'H-293' || k === 'H-236' ? 0.62 : 1.2), z); G.scene.add(fl); G.props.push(fl); s.flame = fl;
  return b;
}
function fillRoom(r, gen){
  const R = gen.R, D = gen.D, F = gen.F, tiles = roomTiles(r, 1), edges = edgeTiles(r);
  const deco = n => { for (let i = 0; i < n; i++){ const t = takeTile(edges, R); if (!t) return; const k = R.pick(D.props); dbill(DA + k + '.webp', t.x + rnd(-0.2, 0.2), t.z + rnd(-0.2, 0.2), 0.9 + R() * 0.6, { fit: 1.4, tint: 0.85 }); } };
  const lights = n => { for (let i = 0; i < n; i++){ const t = takeTile(edges, R); if (t) lightProp(t.x, t.z, D, R); } };
  const band = 'r' + r.id;
  if (r.type === 'start'){
    makeRope(Math.round(r.cx), Math.round(r.cz) - 1); lights(1); deco(1);
    addSource(r.cx, r.cz - 1, 4.5, 0xbfd8ff, 0.55, 3);
  } else if (r.type === 'stairs'){
    makeStairs(Math.round(r.cx), Math.round(r.cz)); lights(2); deco(2);
    if (F >= 2 || R() < 0.5) spawnGroup(r, gen, tiles, 2 + Math.floor(F / 3), band);
  } else if (r.type === 'fight'){
    if (r.build === 'tower' && r.top){ const a = spawnFoe('archer', r.top.x, r.top.z, F, band); a.post = { x: r.top.x, z: r.top.z }; }   // 망루 위 궁수 (자리를 지킴)
    spawnGroup(r, gen, tiles, Math.min(7, 2 + Math.floor((F + 1) / 2) + (R() < 0.4 ? 1 : 0)), band); lights(R() < 0.7 ? 1 : 2); deco(2 + Math.floor(R() * 3));
    if (R() < 0.35){ const t = takeTile(tiles, R); if (t) corpseProp(t.x, t.z, R); }
  } else if (r.type === 'elite'){
    const t = takeTile(tiles, R) || { x: Math.round(r.cx), z: Math.round(r.cz) };
    const ep = r.top || { x: r.cx, z: r.cz }, e = spawnFoe(R.pick(D.elite), ep.x, ep.z, F, band, true);   // 단상이 있으면 그 위에
    spawnGroup(r, gen, tiles, 1 + Math.floor(R() * 2), band);
    lights(2); deco(2); r.reward = true;
  } else if (r.type === 'treasure'){
    const n = R() < 0.35 ? 2 : 1; for (let i = 0; i < n; i++){ const t = i === 0 && r.top ? { x: Math.round(r.top.x), z: Math.round(r.top.z) } : takeTile(tiles, R); if (t) makeChest(t.x, t.z, F, { locked: R() < 0.35, bonus: 0.15 }); }   // 단상 위 상자
    if (R() < 0.45) spawnGroup(r, gen, tiles, 1 + Math.floor(F / 3), band);
    lights(1); deco(1);
    DUN.marks.push({ x: r.cx, z: r.cz, icon: '◆', col: '#ffd35a', treasure: true });
  } else if (r.type === 'rest'){
    const x = Math.round(r.cx), z = Math.round(r.cz); G.map.fires.push(makeFire(G.map, x, z)); G.map.solid[z * G.map.w + x] = 1;
    addSource(x, z, 5, 0xffa050, 1.1, 1);
    G.inspect.push({ x, z, r: 1.8, mark: '모닥불', far: 9, label: '모닥불 곁에서 쉰다 (체력 35% · 정신도 +30)', once: true, fn: () => campRest(x, z) });
    DUN.marks.push({ x, z, icon: '♨', col: '#ffa050' });
    deco(2);
  } else if (r.type === 'graves'){
    for (let i = 0; i < (D.graves || 2) + 1; i++){ const t = takeTile(tiles, R); if (t) makeGrave(t.x, t.z, F, R); }
    lights(2);
  } else if (r.type === 'altar'){
    const x = Math.round(r.cx), z = Math.round(r.cz); dbill(DA + 'H-033.webp', x, z, 1.7, { fit: 1.2, tint: 0.9 }); G.map.solid[z * G.map.w + x] = 1;
    addSource(x, z, 4, 0xff6a5a, 0.8, 1.6);
    G.inspect.push({ x, z, r: 1.9, mark: '제단', far: 9, label: '제단에 기도한다 (축복 · 저주)', once: true, fn: () => altarPray(x, z, F) });
    spawnGroup(r, gen, tiles, 2, band); lights(2); deco(2);
  } else if (typeof sitFill === 'function') sitFill(r, gen, tiles, edges, band, lights, deco);
}
function spawnFoe(kind, x, z, F, band, elite){
  const e = spawn(kind, x, z, 'enemy');
  const hm = 1 + 0.15 * (F - 1), am = 1 + 0.12 * (F - 1);
  e.max = e.hp = Math.round(e.D.hp * hm * (elite ? 1.35 : 1)); e.atk = Math.round(e.D.atk * am * (elite ? 1.15 : 1));
  e.def = Math.round((FOE_DEF[kind] || 0) * (1 + 0.12 * (F - 1))); e.critP = 0.04 + 0.005 * F;
  e.band = band; e.home = { x, z }; e.face = Math.random() < 0.5 ? 1 : -1; e.elite = !!elite;
  e.xp = Math.round((FOE_XP[kind] || 8) * (1 + 0.25 * (F - 1)) * (elite ? 1.6 : 1));
  if (HOLY_FOE.has(kind)) e.D = { ...e.D, holy: true };
  if (elite){ e.tagEl = true; popText; if (!e.tag){ e.tag = document.createElement('div'); e.tag.className = 'ntag enemy elite'; e.tag.textContent = '강적 · ' + e.D.name; UI.layer.appendChild(e.tag); } }
  return e;
}
function spawnGroup(r, gen, tiles, n, band){
  const R = gen.R, D = gen.D;
  for (let i = 0; i < n; i++){ const t = takeTile(tiles, R); if (!t) break; spawnFoe(R.wpick(D.foes), t.x + rnd(-0.2, 0.2), t.z + rnd(-0.2, 0.2), gen.F, band); }
}
// 귀환 줄: 천장에서 늘어진 밧줄 + 푸른 빛
function makeRope(x, z){
  const y = heightAt(G.map, x, z);
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 9, 6), new THREE.MeshBasicMaterial({ color: 0xc8b088 })); rope.position.set(x, y + 4.5, z); G.scene.add(rope); G.props.push(rope);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.1, 9, 18, 1, true), new THREE.MeshBasicMaterial({ color: 0xbfd8ff, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
  beam.position.set(x, y + 4.5, z); G.scene.add(beam); G.props.push(beam);
  const coil = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 6, 16), new THREE.MeshBasicMaterial({ color: 0xa8906a })); coil.rotation.x = Math.PI / 2; coil.position.set(x, y + 0.06, z); G.scene.add(coil); G.props.push(coil);
  G.inspect.push({ x, z, r: 1.5, mark: '귀환 줄', far: 30, label: '귀환 줄 — 굴로 돌아간다', fn: () => uiConfirm('굴로 돌아갈까요?', '들고 있는 것은 모두 가져갑니다. 이번 원정은 여기서 끝.', '돌아간다', expReturn) });
  DUN.marks.push({ x, z, icon: '↑', col: '#9fd0ff', known: true });
  EXP.rope = { x, z };
}
// 계단: 바닥에 검은 구멍 + 계단 + 붉은 빛
function makeStairs(x, z){
  const y = heightAt(G.map, x, z);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.85, 24), new THREE.MeshBasicMaterial({ color: 0x000000 })); hole.rotation.x = -Math.PI / 2; hole.position.set(x, y + 0.025, z); G.scene.add(hole); G.props.push(hole);
  for (let i = 0; i < 4; i++){ const st = new THREE.Mesh(new THREE.BoxGeometry(0.9 - i * 0.12, 0.08, 0.3), new THREE.MeshStandardMaterial({ color: 0x4a444e, roughness: 1 })); st.position.set(x, y + 0.02 - i * 0.12, z - 0.4 + i * 0.26); G.scene.add(st); G.props.push(st); }
  const rim = new THREE.Mesh(new THREE.RingGeometry(0.85, 1.0, 28), new THREE.MeshBasicMaterial({ color: 0xff6a4a, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })); rim.rotation.x = -Math.PI / 2; rim.position.set(x, y + 0.03, z); G.scene.add(rim); G.props.push(rim);
  addSource(x, z, 3.2, 0xff6a4a, 0.6, 0.5);
  const next = EXP.F + 1;
  G.inspect.push({ x, z, r: 1.6, mark: '계단', far: 30, label: `계단 — ${next}층으로 내려간다`, fn: () => uiConfirm(`${next}층으로 내려갈까요?`, `${next}층: ${(FLOOR_DEF[Math.min(next, 10)] || {}).name || '?'} — 더 깊고, 더 어둡고, 더 좋은 것이 있다.`, '내려간다', expDescend) });
  DUN.marks.push({ x, z, icon: '▼', col: '#ff8a6a' });
  EXP.stairs = { x, z };
}
function makeChest(x, z, F, o = {}){
  const locked = !!o.locked, k = locked ? 'H-253' : Math.random() < 0.5 ? 'H-128' : 'H-360';
  const b = dbill(DA + k + '.webp', x, z, locked ? 0.55 : 0.7, { fit: 1.1, tint: 0.95 });
  const ch = { x, z, b, locked, opened: false, F, bonus: o.bonus || 0, plus: o.plus || 0 };
  G.inspect.push({ x, z, r: 1.4, mark: locked ? '잠긴 상자' : '상자', far: 7, get used(){ return ch.opened; }, set used(v){},
    get label(){ return ch.locked ? `잠긴 상자 — ${chestHow()}` : '상자를 연다'; }, fn: () => openChest(ch) });
  return ch;
}
function chestHow(){
  const key = RPG.bag.find(it => itemDef(it).fx && itemDef(it).fx.key === 'gold'), ham = RPG.bag.find(it => itemDef(it).fx && itemDef(it).fx.smash) || (W.def.kind === 'hammer' ? W.def.it : null);
  return key ? '금 열쇠로 연다' : ham ? '망치로 부순다 (시끄러움)' : '자물쇠를 딴다 (민첩)';
}
async function openChest(ch){
  const pl = G.player;
  if (ch.locked){
    const key = RPG.bag.find(it => itemDef(it).fx && itemDef(it).fx.key === 'gold');
    const ham = RPG.bag.find(it => itemDef(it).fx && itemDef(it).fx.smash) || (W.def.kind === 'hammer' ? true : null);
    if (key){ const save = ((pl.fx && pl.fx.keySave) || 0) / 100; if (Math.random() >= save) removeItem(key, RPG.bag, 1); else popText(pl.x, pl.y + 2.2, pl.z, '열쇠가 남았다', 'heal', 0.9); }
    else if (ham){ G.lock = true; for (let k = 0; k < 3; k++){ pl.leanT = 0.3; SFX.thump(120, 0.4, 0.15); spark(ch.x, 0.5, ch.z, 0xffe0b0, 6, 3); camShake(0.1, 0.1); await wait(0.35); } G.lock = false;
      for (const e of foes()) if (!e.alert && dist(e, ch) < 12) alertGroup(e, pl);   // 시끄러움
    } else {
      const A = pl.rpg ? pl.rpg.A : { dex: 5 }, ch2 = Math.min(0.9, 0.3 + A.dex * 0.04 + ((pl.fx && pl.fx.pick) || 0) / 100);
      G.lock = true; for (let k = 0; k < 3; k++){ SFX.burst({ type: 'bandpass', f: 2600, q: 8, gain: 0.08, dec: 0.05 }); await wait(0.4); } G.lock = false;
      if (Math.random() > ch2){ popText(ch.x, 1.4, ch.z, `실패 (${Math.round(ch2 * 100)}%)`, 'miss', 1.1); if (Math.random() < 0.3){ addStatus(pl, 'poison', { dps: 3, t: 5 }); popText(pl.x, pl.y + 2, pl.z, '바늘 함정!', 'hurt', 1); } return; }
      popText(ch.x, 1.4, ch.z, '찰칵', 'heal', 0.8);
    }
    ch.locked = false;
  }
  ch.opened = true;
  ch.b.m.material.color.setScalar(0.55);
  spark(ch.x, 0.7, ch.z, 0xffe9a0, 14, 3); dust(ch.x, ch.z, 6); SFX.burst({ type: 'bandpass', f: 600, f2: 1600, q: 2, gain: 0.25, dec: 0.25 });
  const n = 2 + Math.floor(Math.random() * 2) + (ch.plus ? 1 : 0);
  for (let i = 0; i < n; i++) setTimeout(() => dropLootAt(ch.x, ch.z, rollItem(ch.F, { bonus: ch.bonus, plus: i === 0 ? ch.plus : 0 })), i * 130);
  if (Math.random() < 0.7) setTimeout(() => dropLootAt(ch.x, ch.z, { gold: Math.round((6 + Math.random() * 10) * ch.F) }), n * 130);
}
function makeGrave(x, z, F, R){
  const k = R.pick(['H-007', 'H-027', 'H-191', 'H-205', 'H-283', 'H-052']), b = dbill(DA + k + '.webp', x, z, 1.0, { fit: 1.1, tint: 0.85 });
  const gr = { x, z, b, done: false };
  G.inspect.push({ x, z, r: 1.3, mark: '무덤', far: 6, get used(){ return gr.done; }, set used(v){}, get label(){ return RPG.bag.some(it => itemDef(it).fx && itemDef(it).fx.dig) ? '무덤을 판다 (삽 · 빠름)' : '무덤을 판다'; }, fn: () => digGrave(gr, F) });
}
async function digGrave(gr, F){
  const pl = G.player, fast = RPG.bag.some(it => itemDef(it).fx && itemDef(it).fx.dig) || (W.def.it && itemDef(W.def.it).fx && itemDef(W.def.it).fx.dig);
  G.lock = true; for (let k = 0; k < (fast ? 2 : 4); k++){ pl.leanT = 0.3; SFX.thump(140, 0.3, 0.15); dust(gr.x, gr.z, 6); await wait(0.4); } G.lock = false;
  gr.done = true; gr.b.m.material.color.setScalar(0.5);
  const h = hero('inju'); const r = Math.random();
  if (r < 0.55){ dropLootAt(gr.x, gr.z, rollItem(F, { bonus: 0.1 })); if (Math.random() < 0.5) dropLootAt(gr.x, gr.z, { gold: 5 + Math.round(Math.random() * 8 * F) }); popText(gr.x, 1.4, gr.z, '무언가 묻혀 있었다', 'heal', 1.1); }
  else if (r < 0.82){ const e = spawnFoe(Math.random() < 0.5 ? 'swordsman' : 'spearman', gr.x, gr.z, F, 'grave' + gr.x, false); e.alert = true; e.seen = G.t; popText(gr.x, 2, gr.z, '송장이 일어났다!', 'hurt big', 1.3); dust(gr.x, gr.z, 14); h.san = Math.max(0, (h.san ?? 50) - 6); }
  else { popText(gr.x, 1.4, gr.z, '…빈 무덤', 'miss', 1.1); h.san = Math.max(0, (h.san ?? 50) - 3); }
}
function corpseProp(x, z, R){
  const k = R.pick(['H-008', 'H-286', 'H-287', 'H-327', 'H-023']), b = dbill(DA + k + '.webp', x, z, 0.55, { fit: 1.3, tint: 0.8 });
  const c = { x, z, done: false };
  G.inspect.push({ x, z, r: 1.3, mark: '시체', far: 5, get used(){ return c.done; }, set used(v){}, label: '시체를 뒤진다', fn: () => {
    c.done = true; b.m.material.color.setScalar(0.5); const h = hero('inju'); h.san = Math.max(0, (h.san ?? 50) - 3);
    const n = 1 + ((G.player.fx && G.player.fx.lootPlus) ? 1 : 0);
    for (let i = 0; i < n; i++){ if (Math.random() < 0.65) dropLootAt(x, z, rollItem(EXP.F, { type: Math.random() < 0.75 ? 'cons' : 'gear' })); else dropLootAt(x, z, { gold: 3 + Math.round(Math.random() * 5 * EXP.F) }); }
    popText(x, 1.3, z, '(차갑다)', 'miss', 1);
  } });
}
async function campRest(x, z){
  G.lock = true; letterbox(true); camFocus(x, z, 99, 2.4, 3.8, 0.04); await wait(1.4);
  const bonus = 1 + (((G.player.fx && G.player.fx.restHeal) || 0) / 100);
  for (const u of G.units) if (u.side === 'ally' && !u.dead){ if (u.downed){ u.downed = false; u.st = 'idle'; u.hp = 1; } u.hp = Math.min(u.max, u.hp + u.max * 0.35 * bonus); if (u.hero){ u.hero.san = Math.min(derive(u.hero).maxSan, (u.hero.san ?? 50) + 30); } popText(u.x, u.y + 1.9, u.z, '+', 'heal'); }
  const lines = [['불이 탁탁 튄다.', '청광묵이 손을 녹인다. "대장… 따뜻하다."'], ['불이 탁탁 튄다.', '카리우스는 불빛을 등지고 앉아 벽을 본다.'], ['불이 탁탁 튄다.', '누군가 낮게 노래를 흥얼거린다. 잠깐, 무섭지 않다.']];
  await textbox('', lines[Math.floor(Math.random() * lines.length)].concat(['모두 체력 35% · 정신도 +30']));
  camFocusOff(); letterbox(false); G.lock = false;
}
async function altarPray(x, z, F){
  const h = hero('inju'), pl = G.player; h.san = Math.max(0, (h.san ?? 50) - 8);
  G.lock = true; ring(x, z, 0xff6a5a, 2, 0.8); await wait(0.8); G.lock = false;
  const r = Math.random();
  if (r < 0.45){ addBuff(pl, 'altar', 999, u => { u.atk = Math.round(u.atk * 1.2); }, u => applyHero(u, u.hero)); EXP.blessing = '축복: 이 층에서 공격 +20%'; popText(pl.x, pl.y + 2.4, pl.z, '축복 — 공격 +20%', 'crit', 1.6); }
  else if (r < 0.7){ dropLootAt(x, z, rollItem(F, { type: 'relic', bonus: 0.3 })); popText(x, 2, z, '제단이 무언가를 내어 준다', 'heal', 1.5); }
  else { addStatus(pl, 'bleed', { dps: 4, t: 6 }); h.san = Math.max(0, h.san - 10); popText(pl.x, pl.y + 2.4, pl.z, '저주 — 피가 흐른다', 'hurt big', 1.6); camShake(0.2, 0.3); }
}
function placeLostBag(gen){
  const r = gen.rooms.filter(o => o.type !== 'start')[Math.floor(Math.random() * (gen.rooms.length - 1))] || gen.rooms[0];
  const x = Math.round(r.cx), z = Math.round(r.cz), b = dbill(DA + 'H-114.webp', x, z, 0.6, { fit: 0.9 });
  G.inspect.push({ x, z, r: 1.4, mark: '잃어버린 가방', far: 30, label: '잃어버린 가방을 줍는다', once: true, fn: () => {
    const L = RPG.lost; RPG.lost = null; let n = 0; for (const it of L.items){ if (addItem(it)) n++; else dropLootAt(x, z, it); }
    G.scene.remove(b.g); popText(x, 1.6, z, `가방을 되찾았다 (${n})`, 'crit', 1.6); saveRpg(); } });
  DUN.marks.push({ x, z, icon: '✚', col: '#ffd35a', known: true });
}

/* ---------- 쓰러뜨림 ---------- */
function expOnKill(u, by){
  if (u.side !== 'enemy') return;
  EXP.kills++;
  gainXp(u.xp || 8, 'kill');
  if (typeof bloodBurst === 'function'){ bloodBurst(u.x, u.z, bodyH(u)); bloodPool(u.x, u.z, 0.4 + bodyH(u) * 0.3, 2.2); }
  const F = EXP.F;
  if (Math.random() < 0.7) dropLootAt(u.x, u.z, { gold: Math.round((2 + Math.random() * 4) * (1 + F * 0.6) * (u.elite ? 3 : 1)) });
  if (Math.random() < (u.elite ? 1 : 0.2)) dropLootAt(u.x, u.z, rollItem(F, { type: u.elite ? 'gear' : 'cons', bonus: u.elite ? 0.25 : 0, plus: u.elite ? 1 : 0 }));
  if (!u.elite && Math.random() < 0.06) dropLootAt(u.x, u.z, rollItem(F, { type: 'gear' }));
  if (u.kind === 'archer' && Math.random() < 0.5) for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) groundArrow(u.x + rnd(-0.8, 0.8), u.z + rnd(-0.8, 0.8), rnd(0, 6.28), false, true);
  // 강적 방을 비우면 보상 상자
  const room = DUN.rooms && DUN.rooms.find(r => 'r' + r.id === u.band);
  if (room && room.reward && !foes().some(e => e.band === u.band && !e.dead && e !== u)){ room.reward = false; setTimeout(() => { makeChest(Math.round(room.cx), Math.round(room.cz), F, { plus: 1, bonus: 0.2 }); caption('강적을 쓰러뜨렸다', '보상 상자가 나타났다'); }, 1200); }
  if (u.elite) camShake(0.3, 0.3);
}

/* ---------- 매 프레임 ---------- */
function expTick(dt){
  if (!EXP || G.mode !== 'exp') return;
  const pl = G.player; if (!pl) return;
  sizeDBills();
  if (typeof mapFxTick === 'function') mapFxTick(dt);
  // 횃불
  if (EXP.torchT > 0){ EXP.torchT -= dt; if (EXP.torchT <= 0){ if (EXP.torches > 0){ EXP.torches--; EXP.torchT = EXP_TORCH; popText(pl.x, pl.y + 2.4, pl.z, '새 횃불을 켰다', 'heal', 1.2); } else { EXP.torchT = 0; caption('횃불이 꺼졌다', '어둠이 가까워진다 — 시야 2칸, 정신도가 빨리 줆'); } } }
  EXP.lit = EXP.torchT > 0;
  EXP.visT = (EXP.visT || 0) - dt;
  if (EXP.visT <= 0){ EXP.visT = 0.5; EXP.vision = pl.rpg ? pl.rpg.vision : 4.7; EXP.radar = EXP.radar || !!(pl.fx && pl.fx.radar); }
  const vision = EXP.vision || 4.7;
  tickLights(dt, vision, EXP.lit);
  // 지도
  EXP.revT = (EXP.revT || 0) - dt;
  if (EXP.revT <= 0){ EXP.revT = 0.2; const vr = EXP.lit ? vision + 1 : 2.5; revealAround(pl.x, pl.z, vr); for (const u of allies()) if (u !== pl) revealAround(u.x, u.z, 2);
    for (const e of foes()) if ((dist(e, pl) < vr + 1 || lightAt(e.x, e.z) > 0.3) && sees(pl, e) || e.alert && dist(e, pl) < 12) e.visT = G.t; }
  EXP.mmT = (EXP.mmT || 0) - dt;
  if (EXP.mmT <= 0){ EXP.mmT = 0.25; drawMinimap(false); if (!document.getElementById('bigwrap').hidden) drawMinimap(true); }
  // 정신도
  const D = EXP.gen.D;
  for (const u of allies()){
    const h = u.hero; if (!h) continue;
    const S = u.rpg || derive(h), drain = (EXP.lit ? 0.1 : 0.45) * (D.dark ? 1.5 : 1) * (S.sanDrain || 1);
    h.san = Math.max(0, Math.min(S.maxSan, (h.san ?? S.maxSan) - drain * dt));
  }
  const hs = hero('inju'), sMax = pl.rpg ? pl.rpg.maxSan : 65, sk = (hs.san ?? sMax) / sMax;
  EXP.whT = (EXP.whT || rnd(8, 14)) - dt;
  if (sk < 0.3 && EXP.whT <= 0){ EXP.whT = rnd(6, 12); const W2 = ['…돌아가.', '…거기 누구 있어?', '(발소리)', '…배고파.', '…인주야.', '(누가 웃는다)', '…같이 있자.', '(숨소리)']; const a = rnd(0, 6.28); popText(pl.x + Math.cos(a) * 2.5, pl.y + 1.5, pl.z + Math.sin(a) * 2.5, W2[Math.floor(Math.random() * W2.length)], 'whisper', 2.2); }
  if (hs.san <= 0){ EXP.panT = (EXP.panT || rnd(4, 6)) - dt; if (EXP.panT <= 0 && !pl.downed){ EXP.panT = rnd(4, 7); pl.st = 'hurt'; pl.stT = 0.6; setPose(pl, 'hurt'); popText(pl.x, pl.y + 2.2, pl.z, '몸이 굳었다', 'hurt', 1); camShake(0.1, 0.4); } }
  uiVignette(EXP.lit ? 0.55 + (1 - sk) * 0.3 : 0.92, sk);
  tickLoot(dt);
  // 전멸 (모두 쓰러짐) — 일어나기보다 먼저 봄
  if (!allies().some(u => u.hero && !u.guest)){ if (!EXP.ending) expWipe(); return; }
  reviveCheck(dt);
  if (typeof sitTick === 'function'){ sitTick(dt); meetTick(); }
  // 원정대가 같이 내려가지 않으면 떨어짐 방지: 너무 멀어진 동료는 순간 이동 (벽에 끼임 방지)
  for (const u of allies()) if (u !== pl && dist(u, pl) > 22 && !foes().some(e => e.alert)){ u.x = pl.x + rnd(-1, 1); u.z = pl.z + rnd(-1, 1); if (solidAt(G.map, u.x, u.z)){ u.x = pl.x; u.z = pl.z; } }
  uiExpHud(false);
}

/* ---------- 내려감 · 돌아옴 · 전멸 ---------- */
async function expDescend(){
  if (EXP.ending) return;
  G.lock = true; dark(1, 0.9); await wait(1.0);
  gainXp(12 * EXP.F, 'descend');
  delete EXP.blessing;
  await expLoadFloor(EXP.F + 1, 'down');
  G.lock = false; dark(0, 1.2);
}
function expAddTorch(sec){ if (!EXP) return; if (EXP.torchT <= 0) EXP.torchT = sec; else EXP.torchT += sec; }
function expReveal(foes2){ if (!EXP) return; EXP.reveal = true; if (foes2) EXP.radar = true; popText(G.player.x, G.player.y + 2.3, G.player.z, '지도가 보인다', 'heal', 1.2); }
function expRevealTreasure(){ if (!EXP) return; for (const m of DUN.marks) if (m.treasure) m.known = true; popText(G.player.x, G.player.y + 2.3, G.player.z, '보물 방이 표시되었다', 'heal', 1.2); }
function expEscape(){ if (EXP) expReturn(); }
function expUnlockNear(){ const it = G.inspect.find(o => o.mark === '잠긴 상자' && Math.hypot(o.x - G.player.x, o.z - G.player.z) < 2.5); if (!it) return false; it.fn(); return true; }
function placeCandle(u, t){
  const s = addSource(u.x, u.z, 3.4, 0xffc070, 0.9, 0.5), b = dbill('art/dun/H-293.webp', u.x, u.z, 0.45, { glow: 1 });
  setTimeout(() => { DUN.sources = DUN.sources.filter(o => o !== s); G.scene.remove(b.g); }, t * 1000);
}
async function expReturn(){
  if (EXP.ending) return; EXP.ending = true;
  G.lock = true; dark(1, 1.0); await wait(1.1);
  syncPartyOut();
  const sum = expSummary('return');
  await uiResult(sum);
  expToCave(sum);
}
async function expWipe(){
  if (EXP.ending) return; EXP.ending = true;
  G.slow = 0.3; G.lock = true; letterbox(true); if (G.player) G.player.poseHold = 'dead'; await wait(1.2); G.slow = 1;   // 전멸: 인주가 대자로 뻗음
  dark(1, 1.2); await wait(1.3);
  // 가방은 이 층 바닥에
  RPG.lost = { F: EXP.F, items: RPG.bag.slice(), day: PRO.day }; RPG.bag = [];
  for (const k of RPG.party){ const h = hero(k); h.hp = Math.round((h.hpMax || 100) * 0.1); h.san = Math.max(0, (h.san ?? 40) - 25); }
  const sum = expSummary('wipe');
  await uiResult(sum);
  letterbox(false); if (G.player) G.player.poseHold = null;
  expToCave(sum);
}
function expSummary(kind){
  const party = RPG.party.map(k => { const h = hero(k); return { name: h.name, lv: h.lv, hp: h.hp, hpMax: h.hpMax, san: Math.round(h.san ?? 0) }; });
  const toCave = { food: 0, wood: 0, snail: 0, items: [] };
  if (kind === 'return'){
    for (const it of RPG.bag.slice()){
      const d = itemDef(it), fx = d.fx || {};
      if (d.c === 'food' && fx.food){ for (let i = 0; i < it.n; i++) toCave.items.push({ k: 'd_' + (['I-043', 'I-050', 'I-052', 'I-053', 'I-054'].includes(it.id) ? it.id : 'I-050'), name: d.n, type: 'food', food: fx.food }); toCave.food += fx.food * it.n; removeItem(it); }
      else if (fx.wood){ toCave.wood += fx.wood * it.n; removeItem(it); }
      else if (fx.snail){ toCave.snail += fx.snail * it.n; removeItem(it); }
    }
  }
  return { kind, F: EXP.F, deepest: EXP.deepest, kills: EXP.kills, gold: RPG.gold - EXP.gold0, got: EXP.got.slice(), party, toCave, lost: kind === 'wipe' ? (RPG.lost ? RPG.lost.items.length : 0) : 0 };
}
function expToCave(sum){
  // 굴 창고로: 식량 · 땔감 · 달팽이 먹이
  for (const d of sum.toCave.items) PRO.store.push(d);
  PRO.wood = Math.min(typeof WOOD_MAX !== 'undefined' ? WOOD_MAX : 200, (PRO.wood || 0) + sum.toCave.wood);
  PRO.penFood = Math.min(typeof PEN_MAX !== 'undefined' ? PEN_MAX : 8, (PRO.penFood || 0) + sum.toCave.snail);
  // 동료 체력 → 굴
  const hch = hero('cheong'), hka = hero('karius');
  if (hch.hpMax) PRO.hpf.ch = Math.max(0.05, hch.hp / hch.hpMax); if (hka.hpMax) PRO.hpf.ka = Math.max(0.05, hka.hp / hka.hpMax);
  PRO.ap = 0;   // 원정은 하루를 씀
  EXP = null; uiExpHud(false); saveRpg();
  setTimeout(() => typeof proSave === 'function' && proSave(), 3000);
  startCave(false).then(() => {
    const pl = G.player; if (pl){ pl.x = 9; pl.z = 3.4; applyHero(pl, hero('inju')); }
    dark(0, 1.4); G.lock = false;
    caption(sum.kind === 'wipe' ? '…눈을 뜨니 굴' : '굴로 돌아왔다', sum.kind === 'wipe' ? '누군가 끌고 올라왔다. 가방은 그 아래에' : '오늘은 여기까지. 잠자리로');
  });
}
