/* drill.js v1.3 — (v1.3, v0.58: 경계 (뒤를 봄) 체크 · 자객 기록 · 사각 · 자객 보이기 버튼 · 적성 저장) (v1.2, v0.57: 진지 버튼 · 진지 기록 · 도움말) (v1.1, v0.56: 사격 규율 고르기 · 치명 규칙 켜고 끄기 · 은신 시나리오 · 은신 통계) (v1.0, v0.55) 훈련장: 지금까지 이야기한 것을 한 곳에서 다 해 보는 넓은 들판 (주소 #drill · 굴의 일시정지 창 '훈련장')
   ■ 맵 (밝은 낮, 78 × 48칸)
     · 서쪽 사격장: 사선 (낮은 바위) 뒤에서 5 · 10 · 16칸 표적 — 보통 · 방패 · 갑옷 · 괴물 허수아비 (적성 · 약점 · 방패 시험)
     · 가운데 교전장: 넓은 빈 들 — 무리 · 진형 · 교전 자리 연습. 북쪽 망루 (높은 단 · 경사로)
     · 북동 전략병기 우리: 낮은 바위 울타리 — 장군님 (5m 거구)을 묶고 · 넘어뜨리고 · 벽에 박는 연습
     · 남동 골목: 좁은 벽 미로 — 모퉁이 · 매복 · 총소리 시험
   ■ 동료 일곱: 인주 · 청광묵 · 카리우스 · 레베카 + 새 1성 영웅 셋 (소천사녀 · 금기사 · 갱스터, 임시 그림 art/h1)
     처음 편성: 1조 (인주 · 청광묵 척후 · 금기사 선봉 방패 · 소천사녀 지원 완드) / 2조 (레베카 지휘 · 카리우스 선봉 · 갱스터 사수 권총)
   ■ 훈련 창 (P · 손가락 화면은 위 줄 과녁 그림): 멈춘 채로
     편성 — 보직 · 조 · 주무기 · 방패 · 적성 훈련 (훈련 점수 8, 성향에 따라 비용이 다름 — 몰빵 저격수 / 고르게 만능형) · 인주 무기
     시나리오 — 근접 무리 · 날랜 놈들 · 방패 벽 · 주술사 (예고 끊기) · 갑옷 기사 · 괴물 · 전략병기 · 골목 매복 · 대규모 · 치우기 · 멈춤
     규칙 · 기록 — 교전 자리 규칙 켜고 끄기 (비교) · 자리 표시 · 사격 · 끊기 · 회피 · 연계 · 일으키기 수, 동료마다 명중률
   ■ 이 판에서만 켜지는 새 규칙: engage.js · sol.js · squad.js · tackle2.js (확정되면 모든 판으로) */
'use strict';
// ---------- 새 1성 영웅 셋 (서 있는 그림 하나 — 걸을 땐 흔들고, 칠 땐 기울임) ----------
const h1p = (k, w) => ({ src: 'art/h1/' + k + '.webp', w, h: 700, ax: Math.round(w / 2), ay: 697, f: 1 });
Object.assign(SPR, {
  angel:      { h0: 700, tall: 1.3, poses: { idle: h1p('angel', 350), walk: h1p('angel', 350) } },
  goldknight: { h0: 700, tall: 1.45, poses: { idle: h1p('goldknight', 309), walk: h1p('goldknight', 309) } },
  gangster:   { h0: 700, tall: 1.5, poses: { idle: h1p('gangster', 322), walk: h1p('gangster', 322) } },
});
Object.assign(DEFS, {
  angelAlly:      { spr: 'angel', name: '소천사녀', hp: 95, atk: 10, spd: 3.2, r: 0.32, weight: 50, melee: { range: 1.5, arc: 1.6, windup: 0.42, cd: 1.4, mul: 0.8, kb: 0.6 } },
  goldknightAlly: { spr: 'goldknight', name: '금기사', hp: 170, atk: 16, spd: 2.8, r: 0.36, weight: 95, melee: { range: 1.85, arc: 2.0, windup: 0.45, cd: 1.3, mul: 1.1, kb: 0.8 } },
  gangsterAlly:   { spr: 'gangster', name: '갱스터', hp: 140, atk: 15, spd: 3.4, r: 0.36, weight: 85, melee: { range: 1.35, arc: 1.4, windup: 0.26, cd: 0.8, mul: 0.8, kb: 0.5 } },
  // 훈련용 허수아비 (맞으면 숫자만, 제자리로 돌아옴) · 결이 다름
  drillDummy:   { spr: 'dummy', name: '허수아비', hp: 99999, atk: 0, spd: 0, r: 0.35, weight: 60, dummy: true, spar: true, drill: true },
  drillShield:  { spr: 'dummy', name: '방패 허수아비', hp: 99999, atk: 0, spd: 0, r: 0.35, weight: 60, dummy: true, spar: true, drill: true, block: 0.35 },
  drillArmor:   { spr: 'dummy', name: '갑옷 허수아비', hp: 99999, atk: 0, spd: 0, r: 0.35, weight: 60, dummy: true, spar: true, drill: true },
  drillMonster: { spr: 'dummy', name: '괴물 허수아비', hp: 99999, atk: 0, spd: 0, r: 0.35, weight: 60, dummy: true, spar: true, drill: true },
  // 주술사: 멀리서 긴 예고 (1.8초)로 큰 원을 터뜨림 — 원거리로 맞히면 끊김 (사수의 일)
  drillCaster:  { spr: 'eyemon', name: '주술사', hp: 170, atk: 26, spd: 1.9, r: 0.36, weight: 80, think: casterThink },
});
Object.assign(TRAIT, { drillArmor: 'armored', drillMonster: 'monster' });
const HERO_FACE = { player: 'assets/inju_face.png', cheongAlly: 'art/pro/goblin_face.webp', kariusAlly: 'art/pro/karius_face.webp', rebeccaAlly: 'art/pro/rebecca_face.webp', angelAlly: 'art/h1/angel.webp', goldknightAlly: 'art/h1/goldknight.webp', gangsterAlly: 'art/h1/gangster.webp' };
function casterThink(u, dt){
  u.cd -= dt;
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  if (u.st === 'windup' || u.st === 'strike'){ if (u.st === 'strike'){ u.stT -= dt; if (u.stT <= 0) u.st = 'idle'; } return; }
  const team = allies(); if (!u.alert){ const t = team.find(a => dist(a, u) < 9 && sees(u, a)); if (t) alertGroup(u, t); return; }
  const t = nearest(u, team.filter(a => sees(u, a)), 20) || nearest(u, team, 30); if (!t) return;
  const d = dist(u, t); u.moving = false;
  if (d < 5.5) { const n = norm(u.x - t.x, u.z - t.z); steerTo(u, u.x + n.x * 2, u.z + n.z * 2, u.spd, dt); }
  else if (d > 9 || !sees(u, t)) navTo(u, t.x, t.z, u.spd, dt, 8);
  setAim(u, t.x, t.z);
  if (u.cd <= 0 && d < 10 && sees(u, t)){
    u.cd = rnd(3.6, 4.6); popText(u.x, u.y + bodyH(u) + 0.5, u.z, '주문…', 'alert', 1.6);
    windup(u, 'circle', { x: t.x, z: t.z, r: 2.2, windup: 1.8 }, v => hurt(u, v, u.atk * 1.6, { from: { x: t.x, z: t.z }, kb: 1.4, stun: 0.6 }), 0xb070ff);
  }
}
// ---------- 맵 ----------
const DRILL = { on: false, W: 78, H: 48, freeze: false, range: false, wpn0: null, signs: [] };
function drillRows(){
  const W = DRILL.W, H = DRILL.H, g = Array.from({ length: H }, (_, z) => Array.from({ length: W }, (_, x) => (x === 0 || z === 0 || x === W - 1 || z === H - 1) ? '#' : '.'));
  const put = (x, z, c) => { if (x > 0 && z > 0 && x < W - 1 && z < H - 1) g[z][x] = c; };
  // 서쪽 사격장: 사선 (낮은 바위 · 사이사이 틈)
  for (let z = 4; z <= 26; z++) if (z % 3) put(22, z, 'r');
  for (let x = 2; x <= 22; x++){ put(x, 3, '#'); put(x, 27, '#'); }   // 사격장 담
  // 가운데 교전장: 듬성듬성 바위 · 기둥 둘
  for (const [x, z] of [[30, 14], [31, 14], [47, 12], [44, 26], [45, 26], [33, 30], [50, 33]]) put(x, z, 'r');
  put(36, 22, 'o'); put(43, 18, 'o');
  // 북쪽 망루: 높은 단 + 경사로
  for (let z = 3; z <= 6; z++) for (let x = 35; x <= 42; x++) put(x, z, '^');
  for (let x = 37; x <= 40; x++) put(x, 7, '/');
  // 북동 전략병기 우리: 낮은 바위 울타리 (남쪽에 입구)
  for (let x = 56; x <= 74; x++){ put(x, 2, 'r'); put(x, 17, x >= 63 && x <= 66 ? '.' : 'r'); }
  for (let z = 2; z <= 17; z++){ put(56, z, 'r'); put(74, z, 'r'); }
  // 남동 골목: 벽 미로
  const maze = ['###########.#######', '#.....#.......#...#', '#.###.#.#####.#.#.#', '#.#...#.#...#...#.#', '#.#.###.#.#.#####.#', '#...#...#.#.....#.#', '###.#.###.#####.#.#', '#...#.#...#...#...#', '#.###.#.###.#.###.#', '#.....#.....#.....#', '#######.##########.'];
  maze.forEach((row, j) => [...row].forEach((c, i) => put(56 + i, 25 + j * 2, c) || put(56 + i, 26 + j * 2, c === '#' && j < maze.length - 1 && maze[j + 1][i] === '#' ? '#' : c === '#' ? '.' : c)));
  return g.map(r => r.join(''));
}
const DRILL_SIGNS = [
  { x: 23.5, z: 15, n: '사격장', d: ['사선 너머 5 · 10 · 16칸에 표적.', '보통 · 방패 (정면은 막음 — 옆으로) · 갑옷 (총이 잘 뚫음) · 괴물 (총이 거의 안 먹힘 · 마법과 칼이 약점).', '동료 주무기와 적성을 훈련 창 (P)에서 바꿔 보며 명중률을 비교.'] },
  { x: 39, z: 32, n: '교전장', d: ['넓은 빈 들. 훈련 창 (P) → 시나리오로 적을 부름.', '교전 자리: 한 사람을 앞에서 동시에 치는 적은 둘. 나머지는 둘레를 돌며 등 뒤를 노림.', '진형 (O 지휘 창)으로 등을 지키면 기다리는 놈이 들어오지 못함.'] },
  { x: 38.5, z: 8.5, n: '망루', d: ['높은 단. 위에서 쏘면 내려다보며 맞힘.', '사수 보직 동료를 여기 두고 "여기 지켜" (O).'] },
  { x: 64.5, z: 18.5, n: '전략병기 우리', d: ['장군님 (5m 거구)을 부르는 곳 (시나리오 → 전략병기).', '정면 대결은 못 이김. 묶고 (카리우스 · 금기사) · 넘어뜨리고 · 벽에 박고 · 등 뒤로 돌아 (척후) 친다.'] },
  { x: 63.5, z: 23.5, n: '골목', d: ['좁은 벽 미로. 시나리오 → 골목 매복.', '총소리는 벽 너머까지 들림 (둘레 12 ~ 16칸 적이 깨어남). 활은 조용함.'] },
];
function startDrill(){
  clearLevel(); G.mode = 'drill';
  DRILL.on = true; SQ.on = true; ENG.on = true; document.body.classList.add('drill');
  const theme = { bg: 0x9db0c4, fogNear: 30, fogFar: 80, hemi: 0.62, moon: 0.7, floor: 0x6e6a58, wall: 0x5a5648, pillar: 0x7a7262 };
  loadLevel(drillRows(), theme); G.fogK = 3.2;
  hemi.color.setHex(0xdfe8ff); hemi.groundColor.setHex(0x5a5040); moon.color.setHex(0xfff2d8);
  G.map.wallH = 1.6; layoutWalls(G.map, 0);
  // 동료
  const px = 39, pz = 40;
  G.player = spawn('player', px, pz, 'ally'); applyHero(G.player, hero('inju')); G.player.hp = G.player.max; solInit(G.player, { role: 'leader', sq: 1 });
  const crew = [['cheongAlly', -1.4, -1, { role: 'scout', sq: 1 }], ['goldknightAlly', 1.4, -1, { role: 'vanguard', sq: 1, shield: true }], ['angelAlly', 0, 1.2, { role: 'support', sq: 1, main: 'wand' }],
    ['rebeccaAlly', 4, 1.5, { role: 'leader', sq: 2 }], ['kariusAlly', 5.5, 0, { role: 'vanguard', sq: 2 }], ['gangsterAlly', 6.5, 2.5, { role: 'marksman', sq: 2, main: 'pistol' }]];
  for (const [k, dx, dz, o] of crew){ const u = spawn(k, px + dx, pz + dz, 'ally'); u.face = 1; if (k === 'kariusAlly') Object.assign(u, { kc: null, p2: false, cd: 0.5, swCd: 2.5, grCd: 4, slCd: 2, rsCd: 3 }); solInit(u, o); }
  G.cmd = 'free'; SQ.list[0].order = SQ.list[1].order = 'follow'; SQ.list[0].form = 'wedge'; SQ.list[1].form = 'wedge'; SQ.list[0].head = SQ.list[1].head = -Math.PI / 2;
  // 사격장 표적
  const T = [['drillDummy', 17, 6], ['drillDummy', 12, 6], ['drillDummy', 6, 6], ['drillShield', 17, 11], ['drillShield', 11, 11], ['drillArmor', 17, 16], ['drillArmor', 10, 16], ['drillMonster', 17, 21], ['drillMonster', 9, 21]];
  for (const [k, x, z] of T){ const d = spawn(k, x, z, 'neutral'); d.face = 1; d.aim = 0; d.home = { x, z }; }
  // 표지판
  for (const S of DRILL_SIGNS) G.inspect.push({ x: S.x, z: S.z, r: 1.6, mark: S.n, far: 40, keep: true, label: `${S.n} — 안내판`, fn: () => textbox(S.n, S.d) });
  G.onKill = () => {};
  if (!DRILL.wpn0){ const h = hero('inju'); DRILL.wpn0 = { w: h.eq.weapon || null }; }
  camSnapTo(px, pz); CAM.yaw = CAM.yawT = 0;
  caption('훈련장', '넓은 들판 — P 훈련 창 · O 지휘 · L 진지 · 안내판 E');
  sqHudRender();
  setTimeout(() => G.mode === 'drill' && guide('<em>P</em> 훈련 창 (편성 · 시나리오 · 규칙) · <em>O</em> 지휘 (조 · 진형) · <em>L</em> 진지 계획 · 표지판 <em>E</em>', 8), 1200);
}
function drillExit(){
  const h = hero('inju'); if (DRILL.wpn0){ h.eq.weapon = DRILL.wpn0.w; DRILL.wpn0 = null; saveRpg(); }
  SQ.on = false; ENG.on = false; DRILL.on = false;
  location.hash = ''; location.reload();
}
// 금기사 (철벽): 방패를 든 금기사 곁 2.6칸의 동료를 노리던 적은 금기사를 먼저 노림
{ const _engPickD = engPick; engPick = function(e){ const t = _engPickD(e); if (!DRILL.on || !t) return t; const gk = G.units.find(u => u.kind === 'goldknightAlly' && !u.dead && !u.downed && u.sol && u.sol.kit.shield && u.sol.mode === 'melee'); return gk && t !== gk && dist(gk, t) < 2.6 && dist(e, gk) < 5 ? gk : t; }; }
// ---------- 시나리오 ----------
function drillAhead(L = 11){
  const pl = G.player, a = -Math.PI / 2; let x = clamp(pl.x + Math.cos(a) * L, 27, 52), z = clamp(pl.z + Math.sin(a) * L, 8, 36);
  return { x, z };
}
function drillSpawn(list, o = {}){
  const c = o.at || drillAhead(o.dist || 11);
  list.forEach((k, i) => {
    const a = (i / Math.max(1, list.length)) * Math.PI * 2 + rnd(-0.3, 0.3), R = list.length > 1 ? (o.spread || 1.6) + (i % 3) * 0.5 : 0;
    let x = c.x + Math.cos(a) * R, z = c.z + Math.sin(a) * R; if (solidAt(G.map, x, z)){ x = c.x; z = c.z; }
    const e = spawn(k, x, z, 'enemy'); e.band = 'drill'; e.home = { x, z }; e.alert = o.alert !== false; if (e.alert) e.seen = G.t;
    if (e.D.boss && typeof bossInit === 'function' && k !== 'drillCaster') bossInit(e, { x, z });
    dust(x, z, 6);
  });
  caption(o.title || '적이 나타났다', o.sub || '');
}
const DRILL_SC = [
  { k: 'mob', n: '근접 무리', d: '검사 셋 · 창병 둘. 교전 자리: 둘만 앞에서 치고 나머지는 돌며 등 뒤를 노림', go: () => drillSpawn(['swordsman', 'swordsman', 'swordsman', 'spearman', 'spearman'], { title: '근접 무리', sub: '등을 지켜라 (등맞대기 · 삼각)' }) },
  { k: 'fast', n: '날랜 놈들', d: '검냥이 · 광냥. 조준을 보면 옆으로 피함 — 우리 편이 붙어 묶으면 못 피함 (묶고 쏘기)', go: () => drillSpawn(['catw', 'catw', 'gwangnyang', 'bogwang'], { title: '날랜 놈들', sub: '묶어 두고 쏴라' }) },
  { k: 'shield', n: '방패 벽', d: '검방패병 셋이 앞, 궁수 둘이 뒤. 정면 사격은 방패가 막음 — 옆으로 돌기 (척후 · 돌아 들어가)', go: () => { drillSpawn(['shieldman', 'shieldman', 'bkShield'], { title: '방패 벽', sub: '옆으로 돌아라' }); const c = drillAhead(15); drillSpawn(['archer', 'archer'], { at: c, title: '방패 벽', sub: '뒤에 궁수' }); } },
  { k: 'caster', n: '주술사', d: '멀리서 1.8초 동안 큰 원을 준비함. 원거리로 맞히면 끊김 — 사수의 일', go: () => drillSpawn(['drillCaster', 'drillCaster', 'swordsman', 'swordsman'], { dist: 13, title: '주술사', sub: '예고를 끊어라 (총 · 활 · 마법)' }) },
  { k: 'armor', n: '갑옷 기사', d: '흑기사 셋. 칼 · 활은 갑옷에 튕기고, 총 (특히 소총)이 잘 뚫음', go: () => drillSpawn(['bk', 'bk', 'bkSpear'], { title: '갑옷 기사', sub: '소총이 잘 뚫는다' }) },
  { k: 'monster', n: '괴물', d: '푸른 뚱보 · 슬라임녀 · 눈깔괴물. 총이 거의 안 먹힘 — 마법 · 칼이 약점', go: () => drillSpawn(['bluefat', 'slimeGirl', 'eyemon'], { title: '괴물', sub: '총은 안 먹힌다 — 마법 · 칼' }) },
  { k: 'titan', n: '전략병기', d: '장군님 (5m). 정면 대결 금지 — 묶고 · 넘어뜨리고 · 벽에 박고 · 등 뒤로', go: () => drillSpawn(['janggun'], { at: { x: 65, z: 9 }, title: '전략병기', sub: '우리에서 나온다 — 묶고 돌아라' }) },
  { k: 'alley', n: '골목 매복', d: '골목 곳곳에 잠든 적 다섯. 총소리에 깨어남 — 활 · 칼로 조용히', go: () => { const P2 = [[58, 30], [66, 34], [60, 42], [70, 38], [73, 28]]; P2.forEach(([x, z], i) => drillSpawn([['swordsman', 'spearman', 'catw', 'swordsman', 'archer'][i]], { at: { x, z }, alert: false, title: '골목 매복', sub: '조용히 — 총은 깨운다' })); } },
  { k: 'sneak', n: '은신 · 암살', d: '들키지 않은 적 여섯이 들판에 흩어져 두리번거림. 숙이고 (G) 등 뒤로 가서 공격 = 암살 (은신 적성). 조 지시 \'은밀히\'로 동료도 암살', go: () => {
      const c = drillAhead(13); [[0, 0, 0], [3.5, -1.5, 2.6], [-3.5, -1, 0.6], [1, -5, 1.6], [-4, -5.5, 3.6], [5, -5, 4.4]].forEach(([dx, dz, a], i) => { const k = ['swordsman', 'spearman', 'swordsman', 'archer', 'shieldman', 'catw'][i]; drillSpawn([k], { at: { x: c.x + dx, z: c.z + dz }, alert: false, title: '은신 · 암살', sub: 'G 숙이기 · 등 뒤에서 공격 · O → 은밀히' }); const e = foes()[foes().length - 1]; e.aim = e.aim0 = a; });
    } },
  { k: 'big', n: '대규모', d: '섞어서 열둘. 조를 나눠 지휘', go: () => { drillSpawn(['swordsman', 'swordsman', 'spearman', 'shieldman', 'catw', 'bk'], { title: '대규모', sub: '1조 · 2조로 나눠라' }); drillSpawn(['archer', 'archer', 'drillCaster', 'swordsman', 'spearman', 'gwangnyang'], { at: drillAhead(17), title: '대규모', sub: '뒤에 궁수 · 주술사' }); } },
];
// 사격 훈련: 원거리를 든 동료가 사선에 서서 표적을 번갈아 쏨 (적성 · 무기별 명중률 비교 — 기록 탭)
function drillRangeAct(u, dt){
  const S = u.sol, R = RW[S.kit.main], M = G.units.filter(o => o.sol && o.sol.kit.main && o.kind !== 'player' && !o.dead), i = M.indexOf(u);
  const spot = { x: 23.6, z: 5 + i * 3.2 }; S.mode = 'ranged'; S.swapT = 0;
  if (Math.hypot(spot.x - u.x, spot.z - u.z) > 0.5){ u.moving = false; navTo(u, spot.x, spot.z, u.spd * 1.3, dt, 0.3); walkPose(u); return true; }
  const T = G.units.filter(o => o.D.drill && o.side === 'neutral'); if (!T.length) return false;
  S.rtI = S.rtI ?? i; const t = T[Math.floor((S.rtI) / 4) % T.length];
  setAim(u, t.x, t.z); u.moving = false; setPose(u, 'idle'); S.cd -= dt;
  if (S.cd <= 0 && dist(u, t) <= R.range + 0.5){ solShoot(u, t); S.rtI++; }
  else if (dist(u, t) > R.range + 0.5){ S.rtI += 4; }
  return true;
}
{ const _solControlD = solControl; solControl = function(u, dt){ if (DRILL.on && DRILL.range && u.sol && u.sol.kit.main && u.kind !== 'player' && !u.downed && !foes().length) return drillRangeAct(u, dt); return _solControlD(u, dt); }; }
// 훈련장 표적은 연습 공을 쏘지 않음 (제자리로만)
if (typeof sparThink === 'function'){ const _sparThinkD = sparThink; sparThink = function(u, dt){ if (u.D.drill) return; return _sparThinkD(u, dt); }; }
function drillClear(){ for (const e of foes()) removeUnit(e); for (const sq of SQ.list) sq.tgt = null; ENG.tok.clear(); }
function drillHeal(){ for (const u of G.units) if (u.side === 'ally' && !u.dead){ if (u.downed) revivePut(u); u.hp = u.max; u.lying = false; if (u.sol) u.sol.mp = u.sol.mpMax; } if (G.player) G.player.hp = G.player.max; }
TICKS.push(dt => {
  if (!DRILL.on || G.mode !== 'drill') return;
  reviveCheck(dt);
  if (DRILL.freeze) for (const e of foes()){ e.alert = false; e.scanT = 9; e.home = { x: e.x, z: e.z }; e.cd = Math.max(e.cd || 0, 0.5); }
  // 허수아비는 쓰러지지 않음 · 제자리로
  for (const u of G.units) if (u.D.dummy && u.D.spar && u.side === 'neutral'){ u.hp = u.max; if (u.home && Math.hypot(u.home.x - u.x, u.home.z - u.z) > 0.15 && !u.lock && !u.lying){ moveBy(u, (u.home.x - u.x) * dt * 2, (u.home.z - u.z) * dt * 2); } }
});

// ---------- 훈련 창 (P) ----------
const DP = { open: false, tab: 'crew' };
const INJU_W = [['W-spear', '창'], ['W-sword', '검'], ['W-pistol', '권총'], ['W-lever', '소총'], ['W-shotgun', '산탄총'], ['W-bow', '활'], ['EW13', '지팡이 (마법)'], ['', '맨손']];
function drillPanel(on = !DP.open){
  if (on && (G.lock || G.waitInput || G.mode !== 'drill')) return;
  DP.open = on; G.paused = on; if (on && SQ.wheel) sqWheel(false);
  let el = document.getElementById('drillPanel');
  if (!el){ el = document.createElement('div'); el.id = 'drillPanel'; document.body.appendChild(el);
    el.addEventListener('click', drillPanelClick); el.addEventListener('change', drillPanelChange);
    el.addEventListener('touchstart', e => e.stopPropagation(), { passive: true }); }
  el.hidden = !on; if (on) drillPanelRender();
}
const aptBar = (u, f) => { const b = u.sol.base[f], t = u.sol.train[f]; return `<span class="ap-bar">${[0, 1, 2, 3, 4].map(i => `<i class="${i < b ? 'b' : i < b + t ? 't' : ''}"></i>`).join('')}</span>`; };
function crewRow(u){
  const S = u.sol, isP = u.kind === 'player', face = HERO_FACE[u.kind] || '';
  const sel = (name, opts, cur) => `<select data-u="${u.uid}" data-k="${name}">${opts.map(([v, n]) => `<option value="${v}" ${String(cur) === String(v) ? 'selected' : ''}>${n}</option>`).join('')}</select>`;
  const curW = isP ? ((hero('inju').eq.weapon || {}).id || '') : S.kit.main || '';
  const pOpts = INJU_W.some(([v]) => v === curW) || !curW ? INJU_W : [[curW, `지금 무기 (${(ITEMS[curW] || {}).n || curW})`], ...INJU_W];
  const wsel = isP ? sel('pw', pOpts, curW) : sel('main', [['', '없음 (근접만)'], ...Object.entries(RW).map(([k, R]) => [k, `${R.n} (${FAM[R.fam]})`])], curW);
  return `<div class="dp-u"><div class="dp-id"><img src="${face}" alt=""><div><b>${u.D.name}</b><small>${TAGS[S.tag].n} · 훈련 점수 <em>${S.pts}</em></small><small class="pas">${S.pas[0]} — ${S.pas[1]}</small></div></div>
    <div class="dp-set"><label>보직 ${sel('role', Object.entries(ROLES), S.role)}</label><label>조 ${isP ? '<b>1조 조장</b>' : sel('sq', [[1, '1조'], [2, '2조'], [0, '단독']], S.sq)}</label>
      <label>무기 ${wsel}</label>${isP ? '' : `<label>사격 ${sel('fire', [['free', '아끼지 않음'], ['save', '아낌 (쏠 만한 놈만)']], S.fire || 'free')}</label>`}${isP ? '' : `<label class="ck"><input type="checkbox" data-u="${u.uid}" data-k="shield" ${S.kit.shield ? 'checked' : ''}> 방패</label><label class="ck"><input type="checkbox" data-u="${u.uid}" data-k="watch" ${S.watch ? 'checked' : ''}> 경계 (뒤를 봄)</label>`}</div>
    <div class="dp-apt">${FAMS.map(f => `<div><span>${FAM[f]}</span>${aptBar(u, f)}<b>${aptOf(u, f)}</b><button data-u="${u.uid}" data-tr="${f}" data-d="-1">−</button><button data-u="${u.uid}" data-tr="${f}" data-d="1" title="비용 ${aptOf(u, f) < 5 ? trainCost(u, f) : '-'}">+${aptOf(u, f) < 5 ? `<small>${trainCost(u, f)}</small>` : ''}</button></div>`).join('')}</div>
    ${isP ? '' : `<div class="dp-pack">소지품 <b>${packUsed(u)}/${packSlots(u)}칸</b> ${Object.keys(AMMO_SLOT).map(k => `<span>${AMMO_KN[k]} ${S.ammo[k]} <button data-u="${u.uid}" data-pk="${k}" data-d="-1">−</button><button data-u="${u.uid}" data-pk="${k}" data-d="1">+</button></span>`).join('')}<small>한 칸 = 총알 20 · 화살 30 · 산탄 8</small></div>`}
    <div class="dp-st">사격 ${S.stat.shots} · 명중 ${S.stat.shots ? Math.round(S.stat.hits / S.stat.shots * 100) : 0}% · 끊기 ${S.stat.cuts}</div></div>`;
}
function drillPanelRender(){
  const el = document.getElementById('drillPanel'); if (!el) return;
  const crew = G.units.filter(u => u.side === 'ally' && u.sol && !u.dead);
  const tabs = [['crew', '편성 · 적성'], ['sc', '시나리오'], ['rule', '규칙 · 기록'], ['help', '도움말']];
  let body = '';
  if (DP.tab === 'crew') body = `<p class="dp-note">적성 0~5 (진한 칸 = 타고남, 밝은 칸 = 훈련). 훈련 비용은 성향이 정함 — 군인은 총이 싸고, 마법 계열은 총이 비쌈. 5를 찍은 계열은 고유 기술이 열림 (총 5 헤드샷 · 활 5 꿰뚫기). 적성 0인 무기는 억지로 쥠.</p>` + crew.map(crewRow).join('');
  if (DP.tab === 'sc') body = `<div class="dp-sc">${DRILL_SC.map(s => `<button data-sc="${s.k}"><b>${s.n}</b><small>${s.d}</small></button>`).join('')}</div>
    <div class="dp-row"><button data-act="range" class="${DRILL.range ? 'on' : ''}">사격 훈련 (동료가 표적을 쏨) ${DRILL.range ? '켜짐' : '꺼짐'}</button><button data-act="clear">적 모두 치우기</button><button data-act="heal">우리 편 회복 · 일으키기</button><button data-act="freeze" class="${DRILL.freeze ? 'on' : ''}">적 멈춤 ${DRILL.freeze ? '켜짐' : '꺼짐'}</button></div>
    <div class="dp-row"><button data-act="fplan">진지 계획 (L)</button><button data-act="fmat">재료 더미 받기 (나무 · 돌 · 잔해 +6)</button><button data-act="fclear">진지 · 설계도 모두 치우기</button></div>`;
  if (DP.tab === 'rule'){
    const S = SOLS;
    body = `<div class="dp-row"><button data-act="eng" class="${ENG.on ? 'on' : ''}">교전 자리 규칙 ${ENG.on ? '켜짐' : '꺼짐'}</button><button data-act="engshow" class="${ENG.show ? 'on' : ''}">자리 표시 ${ENG.show ? '켜짐' : '꺼짐'}</button><button data-act="slots">한 사람당 자리 ${ENG.slots}</button><button data-act="lethal" class="${STL.lethal ? 'on' : ''}">방어 중요 (안 막으면 1.35배) ${STL.lethal ? '켜짐' : '꺼짐'}</button><button data-act="ammo" class="${SOLAMMO.inf ? 'on' : ''}">탄약 ${SOLAMMO.inf ? '무한' : '실제 (소지품 칸)'}</button><button data-act="refill">탄약 상자 — 모두 채우기</button><button data-act="blind" class="${PRW.show ? 'on' : ''}">사각 · 암살 구역 표시 ${PRW.show ? '켜짐' : '꺼짐'}</button><button data-act="preveal" class="${PRW.reveal ? 'on' : ''}">자객 늘 보이기 (연습) ${PRW.reveal ? '켜짐' : '꺼짐'}</button></div>
    <p class="dp-note">교전 자리를 끄면 적이 한꺼번에 몰려들어 일대일 기술 교환이 끊김 — 켜고 꺼서 비교. 자리 표시: 빨강 = 자리 잡음 · 회색 = 둘레를 돌며 기다림 · 주황 = 등이 열려 들어옴.</p>
    <table class="dp-tb"><tr><th>사격</th><td>${S.shots}</td><th>명중</th><td>${S.hits} (${S.shots ? Math.round(S.hits / S.shots * 100) : 0}%)</td><th>예고 끊기</th><td>${S.cuts}</td></tr>
    <tr><th>피함 (날랜 놈)</th><td>${S.dodged}</td><th>방패에 막힘</th><td>${S.blocked}</td><th>약점</th><td>${S.weak}</td></tr>
    <tr><th>바꿔 들기</th><td>${S.swaps}</td><th>탄 걸림</th><td>${S.jams}</td><th>연계</th><td>${S.combos}</td></tr>
    <tr><th>일으키기</th><td>${S.revives}</td><th>기다린 적</th><td>${ENG.stat.waits}</td><th>등 뒤로 들어옴</th><td>${ENG.stat.flanks}</td></tr>
    <tr><th>암살</th><td>${STL.stat.kills} (실패 ${STL.stat.fails})</td><th>들킴</th><td>${STL.stat.spotted}</td><th>기습 사격</th><td>${STL.stat.sneakShots}</td></tr>
    <tr><th>동료 막기</th><td>${STL.stat.guards}</td><th>동료 숙임</th><td>${STL.stat.ducks}</td><th>막기 깨짐</th><td>${STL.stat.breaks}</td></tr>
    <tr><th>지은 진지</th><td>${FORT.stat.built} (부서짐 ${FORT.stat.broken})</td><th>엄폐가 막음</th><td>${FORT.stat.blocked}</td><th>머리 · 투구 뚫림</th><td>${FORT.stat.heads}</td></tr>
    <tr><th>대기 사격</th><td>${FORT.stat.ambush}</td><th>모은 재료</th><td>${FORT.stat.harvested}</td><th>자객 잡음</th><td>${PRW.stat.caught}</td></tr>
    <tr><th>자객에게 당함</th><td>${PRW.stat.execs}</td><th>목 따임 · 쓰러짐</th><td>${PRW.stat.slain} · ${PRW.stat.downs}</td><th>치명상</th><td>${PRW.stat.wounds}</td></tr></table>
    <div class="dp-row"><button data-act="reset">기록 지우기</button><button data-act="exit">훈련장 나가기 (굴로)</button></div>`;
  }
  if (DP.tab === 'help') body = `<div class="dp-help">
    <h4>조작</h4><p>인주를 직접 조작, 동료는 조 단위 지시. <b>O</b> 지휘 창 (시간이 느려짐) — 조마다 따라와 · 여기 지켜 · 저놈 묶어 · 돌아 들어가 · 빠져 · 자유, 진형 삼각 · 가로 · 종대 · 등맞대기 · 흩어짐 · 포위. 바로: 8 · 9 (조 따라와) · 0 (모두 빠져).</p>
    <h4>태클 (T)</h4><p>달리면서 T = 어깨빵. 서서 T = 레슬링 자세 (천천히 걸음) → 공격으로 그래플링 태클 (성공하면 깔고 앉음 → J 파운딩 · K 끝내기). 정면에서 멀쩡한 적에게 들어가면 스프롤. 방향은 투창처럼 조준.</p>
    <h4>교전 자리</h4><p>앞에서 동시에 치는 적은 둘. 나머지는 둘레를 돌며 등 뒤로 감 — 등을 동료가 막고 있으면 못 들어옴.</p>
    <h4>적성 · 바꿔 들기</h4><p>원거리를 든 동료는 적이 가까워지면 등에 메고 근접으로 돌입, 멀어지면 다시 꺼냄. 적성이 높을수록 빨리 바꾸고 잘 맞힘.</p>
    <h4>총 · 활 · 마법</h4><p>총: 약하고 시끄러움 (벽 너머 적도 깸) · 예고를 끊음 · 갑옷을 뚫음 · 괴물엔 안 먹힘 · 날랜 놈은 피함 (묶으면 못 피함) · 방패는 정면을 막음. 활: 조용함. 마법: 탄약 대신 마력, 괴물에 강함.</p>
    <h4>탄약 · 소지품</h4><p>각자 들 수 있는 칸이 정해져 있음 (덩치 따라 4~10칸, 한 칸 = 총알 20 · 화살 30 · 산탄 8). 다 쓰면 근접으로만. 화살은 굴에서 일꾼이 깎을 수 있고 (화살 깎기), 총알 · 산탄은 상점 · 원정에서만 — 화약 무기는 흔치 않음.</p>
    <h4>은신 · 암살</h4><p>들키지 않은 적은 앞쪽만 봄 (의심 ? → 들킴 !). 숙이면 (G) 보이는 거리 절반 · 은신 적성마다 더 줄어듦 · 달리면 발소리. 등 뒤에서 근접 = 암살 (30% + 은신 적성 × 14%). 활 · 돌팔매 기습은 2배. 조 지시 '은밀히'.</p>
    <h4>방어</h4><p>막는 동안 정면 피해 90% 감소 (화살 · 주술도). 안 막고 맞으면 1.35배 — 원거리도 안전하지 않음 (궁수 · 주술사 · 날랜 놈은 쏘는 동료부터 노림). 거구의 내려찍기는 막기를 깸. 동료도 상단이면 숙이고, 아니면 막음.</p>
    <h4>사격 규율</h4><p>동료마다 '아낌' (예고 중 · 궁수 · 주술사 · 거의 죽은 놈 · 누운 놈에게만) / '아끼지 않음'. 완드 (마력) · 돌팔매는 끝없음.</p>
    <h4>진지 · 엄폐 (L)</h4><p>L = 계획 (시간 0.25배, 멈추진 않음). 바리케이드 · 잔해 더미 (낮은 엄폐) · 돌담 (시야까지 막음) · 말뚝 (밟으면 찔림) · 조 진지 (지킬 자리, R로 방향). 설계도는 동료가 둘레의 나무 · 바위 · 수레에서 재료를 모아 지음 — 인주도 곁에서 E. 막힌 적은 엄폐를 부숨.</p>
    <p>엄폐 바로 뒤에서 숙여 있으면 그 너머의 사격이 다 막힘. 쏘는 순간엔 머리를 내밀어 40%가 지나오고 맞으면 머리 (투구 뚫림, 치명). 서 있으면 70%. 거구는 숙여도 소용없음. 적도 똑같음.</p>
    <p>대기 사격: 1초 넘게 가만히 있다가 새로 보인 적을 1.5초 안에 쏘면 1.5배 — 벽 모퉁이에서 기다렸다 나오는 놈을 쏨. 적 궁수도 그렇게 기다림.</p>
    <h4>자객 · 경계 · 어둠</h4><p>적 자객은 무리와 따로 우리를 사냥함 — 아무의 시야에도 안 걸리는 길로 숨어 와서 맨 뒤 · 떨어진 · 싸우느라 한눈 판 동료의 등 뒤에서 목을 따거나 (즉사) 한 번에 쓰러뜨리거나 치명상. 우리 편 시야 밖에선 화면에도 안 보임. 아무도 못 보면 소리 없이 끝나고, 누가 쓰러진 걸 발견해야 외침.</p>
    <p>막는 법: 동료에게 '경계 (뒤를 봄)'를 맡김 (편성 탭) · 등맞대기 진형 · 서로 붙어 다니기. 등을 아무도 못 보는 동료는 발밑 뒤쪽이 붉게 표시됨. 자객이 시야에 들면 의심 → "뒤다!" 하고 드러남.</p>
    <p>어두운 곳 (골목 · 원정의 빛 없는 곳)에서는 서로 보이는 거리가 짧음. 엄폐 뒤에 숙인 자는 너머에서 안 보임. 숙이면 (G) 들키지 않은 적의 등 뒤에 푸른 암살 구역이 보임.</p>
    <h4>기절 · 연계</h4><p>쓰러진 동료는 누가 일으켜야 함 (곁에서 E, 1.3초). 쓰러진 · 잡힌 · 사격으로 끊긴 · 벽에 박힌 놈을 치면 연계. 슬라이딩 · 드롭킥은 정면에서 보고 있는 적에게 읽힘.</p></div>`;
  el.innerHTML = `<div class="dp-box"><div class="dp-head"><b>훈련 창</b><div class="dp-tabs">${tabs.map(([k, n]) => `<button data-tab="${k}" class="${DP.tab === k ? 'on' : ''}">${n}</button>`).join('')}</div><button data-act="close">닫기 (P)</button></div><div class="dp-body">${body}</div></div>`;
}
function drillPanelClick(e){
  const b = e.target.closest('button'); if (!b) { if (e.target.id === 'drillPanel') drillPanel(false); return; }
  e.stopPropagation();
  if (b.dataset.tab){ DP.tab = b.dataset.tab; return drillPanelRender(); }
  if (b.dataset.pk){ const u = G.units.find(o => o.uid === +b.dataset.u); if (u && !packAdd(u, b.dataset.pk, +b.dataset.d)) popText(u.x, u.y + 2, u.z, +b.dataset.d > 0 ? '소지품 칸이 가득' : '더 뺄 게 없음', 'miss', 0.6); solSaveAll(); return drillPanelRender(); }
  if (b.dataset.tr){ const u = G.units.find(o => o.uid === +b.dataset.u); if (u && !solTrain(u, b.dataset.tr, +b.dataset.d)) popText(u.x, u.y + 2, u.z, +b.dataset.d > 0 ? '훈련 점수가 모자람' : '더 못 내림', 'miss', 0.6); return drillPanelRender(); }
  if (b.dataset.sc){ const s = DRILL_SC.find(o => o.k === b.dataset.sc); drillPanel(false); s && s.go(); return; }
  const a = b.dataset.act;
  if (a === 'close') return drillPanel(false);
  if (a === 'range'){ DRILL.range = !DRILL.range; if (DRILL.range){ drillClear(); caption('사격 훈련', '원거리를 든 동료가 사선에서 표적을 쏨 — 기록 탭에서 명중률'); } }
  if (a === 'clear') drillClear(); if (a === 'heal') drillHeal(); if (a === 'freeze') DRILL.freeze = !DRILL.freeze;
  if (a === 'eng'){ ENG.on = !ENG.on; ENG.tok.clear(); } if (a === 'engshow') ENG.show = !ENG.show; if (a === 'slots') ENG.slots = ENG.slots >= 3 ? 1 : ENG.slots + 1;
  if (a === 'ammo') SOLAMMO.inf = !SOLAMMO.inf;
  if (a === 'lethal') STL.lethal = !STL.lethal;
  if (a === 'blind') PRW.show = !PRW.show; if (a === 'preveal') PRW.reveal = !PRW.reveal;
  if (a === 'fplan'){ drillPanel(false); return fortPlan(true); }
  if (a === 'fmat'){ for (const k in FORT.stock) FORT.stock[k] += 6; fortBarRender(); }
  if (a === 'fclear'){ fortClearAll(); FORT.wave = null; fortHudRender(); }
  if (a === 'refill') for (const u of G.units) if (u.sol && u.kind !== 'player') packFill(u);
  if (a === 'reset'){ for (const k in SOLS) SOLS[k] = 0; for (const k in STL.stat) STL.stat[k] = 0; for (const k in FORT.stat) FORT.stat[k] = 0; for (const k in PRW.stat) PRW.stat[k] = 0; ENG.stat.waits = ENG.stat.flanks = 0; for (const u of G.units) if (u.sol) u.sol.stat = { shots: 0, hits: 0, cuts: 0 }; }
  if (a === 'exit'){ solSaveAll(); return drillExit(); }
  drillPanelRender();
}
function drillPanelChange(e){
  const t = e.target, u = G.units.find(o => o.uid === +t.dataset.u); if (!u || !u.sol) return;
  const k = t.dataset.k, S = u.sol;
  if (k === 'role') S.role = t.value;
  if (k === 'fire') S.fire = t.value;
  if (k === 'sq') S.sq = +t.value;
  if (k === 'main'){ S.kit.main = t.value || null; S.mode = 'melee'; S.awk = false; solGear(u); const R = RW[S.kit.main]; if (R && R.ammo && !S.ammo[R.ammo]){ packAdd(u, R.ammo, 1); packAdd(u, R.ammo, 1); } }
  if (k === 'shield'){ S.kit.shield = t.checked; solGear(u); }
  if (k === 'watch') S.watch = t.checked;
  if (k === 'pw'){ const h = hero('inju'); h.eq.weapon = t.value ? makeItem(t.value) : null; refreshHero(h); }
  drillPanelRender(); sqHudRender(); solSaveAll();
}
const _uiKeysDrill = uiKeys;
uiKeys = function(){
  if (DP.open){ if (hit('KeyP') || hit('Escape')) drillPanel(false); return true; }
  if (G.mode === 'drill' && hit('KeyP') && !G.lock && !G.waitInput){ drillPanel(true); return true; }
  return _uiKeysDrill();
};
// 굴의 일시정지 창에 '훈련장'
if (typeof pauseOpen === 'function'){
  const _pauseD = pauseOpen;
  pauseOpen = function(){
    _pauseD();
    const box = document.querySelector('#confirm .cf-box div'); if (!box || box.querySelector('[data-p="drill"]')) return;
    const b = document.createElement('button'); b.dataset.p = 'drill'; b.textContent = G.mode === 'drill' ? '훈련장 나가기' : '훈련장 (새 전투 규칙 실험)';
    b.addEventListener('click', ev => { ev.stopPropagation(); if (G.mode === 'drill') return drillExit(); if (typeof proSave === 'function') proSave(); location.hash = '#drill'; location.reload(); });
    box.appendChild(b);
  };
}
