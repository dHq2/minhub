/* drill.js v1.16 — (v1.16, v0.83: 콜로세움 기수 탭을 명단에서 만듦 — 노트에 gen: 4 가 오면 '4기' 탭이 저절로 (전엔 1 · 3 이 아니면 다 2기로 감)) (v1.15, v0.82: '업뎃!' 칸에 돌진 · 광냥 · 보광 · 보르마 묶음 (가장 오래된 v0.79 묶음은 뺌) · 콜로세움 명단에서 검냥이 (catw) 를 뺌 (광냥과 같은 인물) · 훈련 '날랜 놈들' · '대규모' 등에서 검냥이 → 궁수 · 꼬마악마) (v1.14, v0.81: '업뎃!' 칸에 모닝스타 대기 (원래 그림) 묶음 — 가장 오래된 v0.78 묶음은 뺌) (v1.13, v0.80: 싸움이 끝나면 0.5초 뒤 남은 인물이 서 있음으로 (휘두르던 그림 그대로 굳던 것) · '업뎃!' 칸에 동작 점검 묶음 (걷기 · 달리기 그림 · 움찔 · 깡충 · 예고 그림 · 넘어짐) — 가장 오래된 v0.77 묶음은 뺌 · 싸움 중 불려 나온 인물 (소환수 · 세자르의 검사 · 대장군 증원) 도 비우기 · 다시 배치 때 지우고 경기장 안에 가둠) (v1.12, v0.79: '업뎃!' 칸에 고대사슴 산호 (도감 설정 크기) · 카리우스 (불경자 스킬 그림) — 가장 오래된 v0.76 묶음은 뺌) (v1.11, v0.78: '업뎃!' 칸에 용묘화 · 테헤라 (도감 움짤로 움직임) — 가장 오래된 v0.70 묶음은 뺌) (v1.10, v0.77: '업뎃!' 칸에 1차 업뎃 2 · 3기 28명 묶음 — 가장 오래된 v0.69 묶음은 뺌) (v1.9, v0.76: '업뎃!' 칸에 1차 업뎃 잡몹 10명 묶음 · 시험판에서 적으로만 나오는 인물의 상대가 안 서던 것 고침 — 검사 대신 청광묵) (v1.8, v0.73: 콜로세움 '업뎃!' 칸 — 모션 고친 인물을 맨 위에 노란 테두리로 · 묶음 시험판) (v1.7, v0.72: 콜로세움 #colo — 2D 훈련장처럼 끌어 놓고 구경, 맨 아래) (v1.6: 2기 · 3기 보스는 적뢰 보스 초기화 (bossInit) 안 함 — 몸 크기가 0.8로 덮이던 것) (v1.5, v0.61: 훈련장 초기화 drillReset — 시나리오 · 규칙 탭 버튼) (v1.4, v0.60: 2기 탭 — h2.js) (v1.3, v0.58: 경계 (뒤를 봄) 체크 · 자객 기록 · 사각 · 자객 보이기 버튼 · 적성 저장) (v1.2, v0.57: 진지 버튼 · 진지 기록 · 도움말) (v1.1, v0.56: 사격 규율 고르기 · 치명 규칙 켜고 끄기 · 은신 시나리오 · 은신 통계) (v1.0, v0.55) 훈련장: 지금까지 이야기한 것을 한 곳에서 다 해 보는 넓은 들판 (주소 #drill · 굴의 일시정지 창 '훈련장')
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
    if (e.D.boss && typeof bossInit === 'function' && k !== 'drillCaster' && !e.D.h2) bossInit(e, { x, z });
    dust(x, z, 6);
  });
  caption(o.title || '적이 나타났다', o.sub || '');
}
const DRILL_SC = [
  { k: 'mob', n: '근접 무리', d: '검사 셋 · 창병 둘. 교전 자리: 둘만 앞에서 치고 나머지는 돌며 등 뒤를 노림', go: () => drillSpawn(['swordsman', 'swordsman', 'swordsman', 'spearman', 'spearman'], { title: '근접 무리', sub: '등을 지켜라 (등맞대기 · 삼각)' }) },
  { k: 'fast', n: '날랜 놈들', d: '광냥 · 보광 (강적) · 궁수 둘. 조준을 보면 옆으로 피함 — 우리 편이 붙어 묶으면 못 피함 (묶고 쏘기)', go: () => drillSpawn(['gwangnyang', 'bogwang', 'archer', 'archer'], { title: '날랜 놈들', sub: '묶어 두고 쏴라' }) },
  { k: 'shield', n: '방패 벽', d: '검방패병 셋이 앞, 궁수 둘이 뒤. 정면 사격은 방패가 막음 — 옆으로 돌기 (척후 · 돌아 들어가)', go: () => { drillSpawn(['shieldman', 'shieldman', 'bkShield'], { title: '방패 벽', sub: '옆으로 돌아라' }); const c = drillAhead(15); drillSpawn(['archer', 'archer'], { at: c, title: '방패 벽', sub: '뒤에 궁수' }); } },
  { k: 'caster', n: '주술사', d: '멀리서 1.8초 동안 큰 원을 준비함. 원거리로 맞히면 끊김 — 사수의 일', go: () => drillSpawn(['drillCaster', 'drillCaster', 'swordsman', 'swordsman'], { dist: 13, title: '주술사', sub: '예고를 끊어라 (총 · 활 · 마법)' }) },
  { k: 'armor', n: '갑옷 기사', d: '고딕 기사 둘 · 흑기사창병 하나. 칼 · 활은 갑옷에 튕기고, 총 (특히 소총)이 잘 뚫음', go: () => drillSpawn(['bk', 'bk', 'bkSpear'], { title: '갑옷 기사', sub: '소총이 잘 뚫는다' }) },
  { k: 'monster', n: '괴물', d: '푸른 뚱보 · 슬라임녀 · 눈깔괴물. 총이 거의 안 먹힘 — 마법 · 칼이 약점', go: () => drillSpawn(['bluefat', 'slimeGirl', 'eyemon'], { title: '괴물', sub: '총은 안 먹힌다 — 마법 · 칼' }) },
  { k: 'titan', n: '전략병기', d: '장군님 (5m). 정면 대결 금지 — 묶고 · 넘어뜨리고 · 벽에 박고 · 등 뒤로', go: () => drillSpawn(['janggun'], { at: { x: 65, z: 9 }, title: '전략병기', sub: '우리에서 나온다 — 묶고 돌아라' }) },
  { k: 'alley', n: '골목 매복', d: '골목 곳곳에 잠든 적 다섯. 총소리에 깨어남 — 활 · 칼로 조용히', go: () => { const P2 = [[58, 30], [66, 34], [60, 42], [70, 38], [73, 28]]; P2.forEach(([x, z], i) => drillSpawn([['swordsman', 'spearman', 'catw', 'swordsman', 'archer'][i]], { at: { x, z }, alert: false, title: '골목 매복', sub: '조용히 — 총은 깨운다' })); } },
  { k: 'sneak', n: '은신 · 암살', d: '들키지 않은 적 여섯이 들판에 흩어져 두리번거림. 숙이고 (G) 등 뒤로 가서 공격 = 암살 (은신 적성). 조 지시 \'은밀히\'로 동료도 암살', go: () => {
      const c = drillAhead(13); [[0, 0, 0], [3.5, -1.5, 2.6], [-3.5, -1, 0.6], [1, -5, 1.6], [-4, -5.5, 3.6], [5, -5, 4.4]].forEach(([dx, dz, a], i) => { const k = ['swordsman', 'spearman', 'swordsman', 'archer', 'shieldman', 'foeDevil'][i]; drillSpawn([k], { at: { x: c.x + dx, z: c.z + dz }, alert: false, title: '은신 · 암살', sub: 'G 숙이기 · 등 뒤에서 공격 · O → 은밀히' }); const e = foes()[foes().length - 1]; e.aim = e.aim0 = a; });
    } },
  { k: 'big', n: '대규모', d: '섞어서 열둘. 조를 나눠 지휘', go: () => { drillSpawn(['swordsman', 'swordsman', 'spearman', 'shieldman', 'foeDevil', 'bk'], { title: '대규모', sub: '1조 · 2조로 나눠라' }); drillSpawn(['archer', 'archer', 'drillCaster', 'swordsman', 'spearman', 'gwangnyang'], { at: drillAhead(17), title: '대규모', sub: '뒤에 궁수 · 주술사' }); } },
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
// v0.61 훈련장 초기화: 처음 들어왔을 때 그대로 (적 · 부른 2기 · 소환수 · 진지 · 재료 · 맵 · 동료 자리 · 체력). 적성 · 훈련 점수 · 보직은 저장된 대로 남음. 기록은 '기록 지우기'로 따로
function drillReset(){
  if (typeof solSaveAll === 'function') solSaveAll();
  if (typeof FORT !== 'undefined' && FORT.plan) fortPlan(false);
  G.slow = 1; DRILL.range = false; DRILL.freeze = false; ENG.tok.clear();
  for (const sq of SQ.list){ sq.tgt = null; sq.at = null; sq.post = null; sq.order = 'follow'; }
  drillPanel(false); startDrill();
  caption('훈련장 초기화', '처음 상태로 — 적성 · 훈련 · 보직은 그대로');
}
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
  return `<div class="dp-u"><div class="dp-id"><img src="${artSrc(face)}" alt=""><div><b>${u.D.name}</b><small>${TAGS[S.tag].n} · 훈련 점수 <em>${S.pts}</em></small><small class="pas">${S.pas[0]} — ${S.pas[1]}</small></div></div>
    <div class="dp-set"><label>보직 ${sel('role', Object.entries(ROLES), S.role)}</label><label>조 ${isP ? '<b>1조 조장</b>' : sel('sq', [[1, '1조'], [2, '2조'], [0, '단독']], S.sq)}</label>
      <label>무기 ${wsel}</label>${isP ? '' : `<label>사격 ${sel('fire', [['free', '아끼지 않음'], ['save', '아낌 (쏠 만한 놈만)']], S.fire || 'free')}</label>`}${isP ? '' : `<label class="ck"><input type="checkbox" data-u="${u.uid}" data-k="shield" ${S.kit.shield ? 'checked' : ''}> 방패</label><label class="ck"><input type="checkbox" data-u="${u.uid}" data-k="watch" ${S.watch ? 'checked' : ''}> 경계 (뒤를 봄)</label>`}</div>
    <div class="dp-apt">${FAMS.map(f => `<div><span>${FAM[f]}</span>${aptBar(u, f)}<b>${aptOf(u, f)}</b><button data-u="${u.uid}" data-tr="${f}" data-d="-1">−</button><button data-u="${u.uid}" data-tr="${f}" data-d="1" title="비용 ${aptOf(u, f) < 5 ? trainCost(u, f) : '-'}">+${aptOf(u, f) < 5 ? `<small>${trainCost(u, f)}</small>` : ''}</button></div>`).join('')}</div>
    ${isP ? '' : `<div class="dp-pack">소지품 <b>${packUsed(u)}/${packSlots(u)}칸</b> ${Object.keys(AMMO_SLOT).map(k => `<span>${AMMO_KN[k]} ${S.ammo[k]} <button data-u="${u.uid}" data-pk="${k}" data-d="-1">−</button><button data-u="${u.uid}" data-pk="${k}" data-d="1">+</button></span>`).join('')}<small>한 칸 = 총알 20 · 화살 30 · 산탄 8</small></div>`}
    <div class="dp-st">사격 ${S.stat.shots} · 명중 ${S.stat.shots ? Math.round(S.stat.hits / S.stat.shots * 100) : 0}% · 끊기 ${S.stat.cuts}</div></div>`;
}
function drillPanelRender(){
  const el = document.getElementById('drillPanel'); if (!el) return;
  const crew = G.units.filter(u => u.side === 'ally' && u.sol && !u.dead);
  const tabs = [['crew', '편성 · 적성'], ['sc', '시나리오'], ['rule', '규칙 · 기록'], ['h2', '2기'], ['help', '도움말']];
  let body = '';
  if (DP.tab === 'crew') body = `<p class="dp-note">적성 0~5 (진한 칸 = 타고남, 밝은 칸 = 훈련). 훈련 비용은 성향이 정함 — 군인은 총이 싸고, 마법 계열은 총이 비쌈. 5를 찍은 계열은 고유 기술이 열림 (총 5 헤드샷 · 활 5 꿰뚫기). 적성 0인 무기는 억지로 쥠.</p>` + crew.map(crewRow).join('');
  if (DP.tab === 'sc') body = `<div class="dp-sc">${DRILL_SC.map(s => `<button data-sc="${s.k}"><b>${s.n}</b><small>${s.d}</small></button>`).join('')}</div>
    <div class="dp-row"><button data-act="range" class="${DRILL.range ? 'on' : ''}">사격 훈련 (동료가 표적을 쏨) ${DRILL.range ? '켜짐' : '꺼짐'}</button><button data-act="dreset" class="warn">훈련장 초기화 (처음 상태로)</button><button data-act="clear">적 모두 치우기</button><button data-act="heal">우리 편 회복 · 일으키기</button><button data-act="freeze" class="${DRILL.freeze ? 'on' : ''}">적 멈춤 ${DRILL.freeze ? '켜짐' : '꺼짐'}</button></div>
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
    <div class="dp-row"><button data-act="dreset" class="warn">훈련장 초기화 (처음 상태로)</button><button data-act="reset">기록 지우기</button><button data-act="exit">훈련장 나가기 (굴로)</button></div>`;
  }
  if (DP.tab === 'h2' && typeof h2Panel === 'function') body = h2Panel();
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
  if (b.dataset.h2 && typeof h2PanelClick === 'function'){ h2PanelClick(b); return drillPanelRender(); }
  if (b.dataset.sc){ const s = DRILL_SC.find(o => o.k === b.dataset.sc); drillPanel(false); s && s.go(); return; }
  const a = b.dataset.act;
  if (a === 'close') return drillPanel(false);
  if (a === 'dreset') return drillReset();
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

/* ---------- v1.7 (v0.72) 콜로세움 (#colo) — 2D 훈련장을 3D 경기장으로 ----------
   ■ 둥근 모래 경기장 + 둘레 관중석. 카메라는 낮게, 남쪽 관중석에서 보는 각도로 고정 (돌지 않음 · 휠로 당기고 밀기만)
   ■ 2D 훈련장처럼: 왼쪽 편성 창의 얼굴을 바닥으로 끌어 놓음. 가운데 선 왼쪽 = 아군, 오른쪽 = 적군
     얼굴을 눌러 고른 뒤 바닥을 눌러도 놓임 · 놓인 인물을 끌면 옮김 (선을 넘기면 편이 바뀜) · 우클릭 / 🧹 지우기 = 빼기
   ■ ▶ 시작 → 구경. 한쪽이 모두 쓰러지면 결과 · ⟲ 재시작 (R) = 시작했던 배치로 다시 · 💾 배치 저장 / 📂 불러오기 · 속도 x1 / x2
   ■ 인주는 숨어서 구경 (그림 · 체력 줄 · 조작 없음, 아무도 노리지 않음) */
const COLO = { updFold: (() => { try { return !!localStorage.getItem('colo-upd-fold'); } catch (e) { return false; } })(), on: false, run: false, done: false, cx: 21, cz: 13, a: 13.5, b: 8.6, zoom: 1, tab: 'ally', pick: null, tool: null, drag: null, spd: 1, start: null, log: [] };
const COLO_SAVE = 'colo-save-v1', COLO_LAST = 'colo-last-v1';
function coloRows(){
  const W = 43, H = 27, g = [];
  for (let z = 0; z < H; z++){ let r = ''; for (let x = 0; x < W; x++){ const e = ((x - COLO.cx) / COLO.a) ** 2 + ((z - COLO.cz) / COLO.b) ** 2; r += e <= 1 ? '.' : '#'; } g.push(r); }
  return g;
}
// 관중석: 경기장 둘레 계단 (카메라 쪽 남쪽은 비움) + 사람 점들
function coloStands(){
  const grp = new THREE.Group(), box = new THREE.BoxGeometry(1, 1, 1), m4 = new THREE.Matrix4(), col = new THREE.Color();
  const tiers = 6, steps = [];
  for (let k = 0; k < tiers; k++){
    const ra = COLO.a + 2.2 + k * 1.15, rb = COLO.b + 2.2 + k * 1.15, n = Math.round(Math.PI * (ra + rb) / 0.95);
    for (let i = 0; i < n; i++){ const t = i / n * Math.PI * 2, s = Math.sin(t); if (s > 0.3) continue; steps.push({ x: COLO.cx + Math.cos(t) * ra, z: COLO.cz + s * rb, h: 0.7 + k * 0.62, t, k }); }
  }
  const st = new THREE.InstancedMesh(box, new THREE.MeshStandardMaterial({ roughness: 0.95 }), steps.length);
  steps.forEach((p, i) => { m4.makeRotationY(-p.t); m4.scale(new THREE.Vector3(1.25, p.h, 1.2)); m4.setPosition(p.x, p.h / 2 - 0.2, p.z); st.setMatrixAt(i, m4); col.setHex(0x9c8a6c).multiplyScalar(0.72 + (p.k % 2) * 0.1 + Math.random() * 0.08); st.setColorAt(i, col); });
  st.receiveShadow = true; grp.add(st);
  const fans = steps.filter(() => Math.random() < 0.62), cols = [0xb84a3a, 0x3a5ab8, 0xd8c060, 0x5a9a4a, 0xe0d8c8, 0x7a4a9a, 0x2a2a2a];
  const fm = new THREE.InstancedMesh(new THREE.BoxGeometry(0.34, 0.62, 0.3), new THREE.MeshStandardMaterial({ roughness: 1 }), fans.length);
  fans.forEach((p, i) => { m4.makeRotationY(-p.t); m4.setPosition(p.x + rnd(-0.3, 0.3), p.h - 0.2 + 0.31, p.z + rnd(-0.2, 0.2)); fm.setMatrixAt(i, m4); fm.setColorAt(i, col.setHex(cols[i % cols.length]).multiplyScalar(rnd(0.7, 1))); });
  grp.add(fm); COLO.fans = { m: fm, list: fans };
  // 바깥 땅 + 문 두 개 (서쪽 아군 · 동쪽 적군)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 110), new THREE.MeshStandardMaterial({ color: 0x6a5c44, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.position.set(COLO.cx, -0.21, COLO.cz); grp.add(ground);
  for (const [sx, c] of [[-1, 0x3a7a4a], [1, 0x9a3a32]]){
    const gate = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.6, 2.6), new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 }));
    gate.position.set(COLO.cx + sx * (COLO.a + 1.3), 1.1, COLO.cz); grp.add(gate);
  }
  // 가운데 선 (배치 중에만): 점선
  const line = new THREE.Group();
  for (let z = COLO.cz - COLO.b + 0.6; z < COLO.cz + COLO.b - 0.4; z += 0.9){ const d = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.5), new THREE.MeshBasicMaterial({ color: 0xfff2c8, transparent: true, opacity: 0.7, depthWrite: false })); d.rotation.x = -Math.PI / 2; d.position.set(COLO.cx, 0.03, z); line.add(d); }
  grp.add(line); COLO.line = line;
  // 양쪽 바닥 빛깔 (아군 초록 · 적군 빨강, 아주 옅게)
  for (const [sx, c] of [[-1, 0x4ad070], [1, 0xe04a3a]]){
    const s = new THREE.Mesh(new THREE.CircleGeometry(1, 48, sx < 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.08, depthWrite: false }));
    s.rotation.x = -Math.PI / 2; s.scale.set(COLO.a - 0.3, COLO.b - 0.3, 1); s.position.set(COLO.cx, 0.02, COLO.cz); line.add(s);
  }
  return grp;
}
// 고를 수 있는 인물: 동료 (1기 영웅) · 1기 · 2기 · 3기 · 4기 … (드라이브 명단, 양쪽 다 — 기수는 노트의 gen, 없으면 2기) · 적 (옛 적) · 보스
const COLO_HERO = ['cheongAlly', 'kariusAlly', 'rebeccaAlly', 'goldknightAlly', 'angelAlly', 'gangsterAlly', 'morningstar', 'norman'];
function coloRoster(){
  if (COLO.roster) return COLO.roster;
  const R = [];
  for (const k of COLO_HERO) if (DEFS[k]) R.push({ id: k, name: DEFS[k].name, tab: 'ally', ally: k, foe: null });
  for (const s of H2.list){ const o = H2R[s], K = H2K[s] || {}; if (!DEFS['h2_' + s] || H2NOMIX.has(s)) continue;
    R.push({ id: 'h2:' + s, slug: s, name: DEFS['h2_' + s].name, tab: K.boss ? 'boss' : 'g' + (o.gen || 2), ally: 'h2_' + s, foe: 'h2e_' + s, rank: h2Rank(o) }); }
  const skip = new Set(['player', 'rebecca', 'dummy', 'encMouth', 'ratV', 'ratKnightV', 'pig', 'cheongNpc', 'cannon', 'catw', ...COLO_HERO]);   // 소품 · 마을용 · 고정 포대는 뺌 · v1.15 검냥이 (catw) 는 광냥과 같은 인물
  for (const k of Object.keys(DEFS)){ const D = DEFS[k];
    if (skip.has(k) || k.startsWith('h2') || /Ally$/.test(k) || D.dummy || D.drill || D.spar || D.hittable || !SPR[D.spr] || !(D.hp > 0) || D.hp > 50000) continue;
    R.push({ id: k, name: D.name, tab: D.boss ? 'boss' : 'foe', ally: null, foe: k }); }
  return COLO.roster = R;
}
// v1.8 '업뎃!' 칸: 모션 · 크기 · 그림을 고친 인물 (모션 시험용). 새로 고치면 맨 앞에 묶음을 더하고, 3묶음이 넘으면 오래된 것을 뺌
const COLO_UPD = [
  { v: 'v0.82', n: '돌진 · 도약 · 뒤로 뛰기 · 끌어오기가 실제로 달려감 (전엔 한 프레임에 순간이동 — 세자르급 보스만 그대로) · 광냥 = 검냥이 (대기는 검냥이 움직이는 대기 20 · 12장, 덮치기 · 할퀴어 쓸기, 4성 강적) · 보광 · 보르마 마력탄 (4성 강적)', ids: ['gwangnyang', 'h2:gallia', 'h2:tanga', 'h2:mari', 'h2:moro', 'h2:grinvan', 'h2:stagbeast', 'h2:kanya', 'h2:hiddenkkaebi', 'bk', 'bogwang', 'borama'] },
  { v: 'v0.81', n: '모닝스타 (슈퍼스타) 대기를 원래 그림 (2D 판 대기 8장 움직임) 으로 — 새 걷기 · 맞음 · 기술 그림과 같은 키 · 발 자리', ids: ['h2:mstar', 'morningstar'] },
  { v: 'v0.80', n: '동작 점검 — 걷기 · 달리기 그림으로 걸음 (서 있는 그림으로 미끄러지던 것) · 출발 · 멈춤 깜빡임 없앰 · 맞으면 움찔 · 장판 피할 때 깡충 · 걷다 칠 때 예고 그림 · 넘어지면 누운 그림 · 싸움 끝나면 제자리 걷기 하던 것', ids: ['h2:tank', 'h2:moro', 'h2:collider', 'h2:hirari', 'h2:unitA', 'swordsman', 'bkSpear', 'rebeccaAlly'] },
];
const coloUpdOf = id => COLO_UPD.find(g => g.ids.includes(id));
// v1.16 기수 탭은 명단에서 만듦 — 4기 · 5기 노트 (gen: 4 …) 가 들어오면 탭이 저절로 생김
const coloTabs = () => { const gs = [...new Set(coloRoster().map(r => r.tab).filter(t => /^g\d+$/.test(t)))].sort((a, b) => a.slice(1) - b.slice(1)); return [['ally', '동료'], ...gs.map(g => [g, g.slice(1) + '기']), ['foe', '적'], ['boss', '보스']]; };
// 얼굴: 드라이브 명단은 얼굴 묶음, 나머지는 서 있는 그림의 윗부분을 잘라 씀
const coloFaceCache = {};
function coloFace(r){
  if (r.slug){ const F = typeof H2A !== 'undefined' && H2A.faces, i = F && F.i[r.slug]; if (i != null){ const s = 40 / F.cell; return `<i class="cf" style="background:url(${F.src}) ${-(i % F.cols) * 40}px ${-Math.floor(i / F.cols) * 40}px / ${F.cols * F.cell * s}px ${F.rows * F.cell * s}px"></i>`; } }
  const k = r.ally || r.foe; if (HERO_FACE[k]) return `<i class="cf" style="background:url(${artSrc(HERO_FACE[k])}) 50% 12% / cover"></i>`;
  return `<canvas class="cf" width="40" height="40" data-face="${k}"></canvas>`;
}
function coloDrawFaces(root){
  for (const c of root.querySelectorAll('canvas[data-face]')){
    const k = c.dataset.face, S = SPR[DEFS[k].spr], P = S && (S.poses.idle || Object.values(S.poses)[0]); if (!P || !P.src) continue;
    const draw = img => { const g = c.getContext('2d'); let fx = 0, fy = 0, fw = img.naturalWidth, fh = img.naturalHeight;
      if (P.rect){ [fx, fy, fw, fh] = P.rect; if (P.cols){ fw /= P.cols; fh /= P.rows; } } else if (P.cols){ fw /= P.cols; fh /= P.rows; } else if (P.n){ fw /= P.n; }
      const sx = fw / (P.w || fw), side = Math.min(fw, fh * 0.5), ax = (P.ax != null ? P.ax * sx : fw / 2);
      g.clearRect(0, 0, 40, 40); g.drawImage(img, fx + Math.max(0, Math.min(fw - side, ax - side / 2)), fy + fh * 0.04, side, side, 0, 0, 40, 40); };
    const im = coloFaceCache[P.src] || (coloFaceCache[P.src] = Object.assign(new Image(), { src: artSrc(P.src) }));
    if (im.complete && im.naturalWidth) draw(im); else im.addEventListener('load', () => draw(im), { once: true });
  }
}
function coloUI(){
  if ($('coUI')) return;
  const d = document.createElement('div'); d.id = 'coUI';
  d.innerHTML = `<div id="coPanel"><div class="co-title" id="coTitle">콜로세움 <small>접기</small></div>
    <div id="coUpd"></div><div class="co-tabs" id="coTabs"></div><div class="co-tools" id="coList"></div>
    <div class="co-sec">도구</div><div class="co-tools co-misc"><button data-tool="erase">🧹 지우기</button><button data-tool="mirror" title="아군 배치를 거울처럼 적군 쪽에 똑같이">⇄ 거울 배치</button></div>
    <div class="co-hint">얼굴을 바닥으로 끌어 배치 · 얼굴을 눌러 고른 뒤 바닥을 눌러도 됨 · 가운데 선 왼쪽 = 아군, 오른쪽 = 적군 · 놓인 인물을 끌어 옮김 (선을 넘기면 편이 바뀜) · 우클릭 = 빼기 · 휠 = 당기고 밀기<br>동료 탭은 아군만, 적 탭은 적군만 (기수 탭 · 보스는 양쪽 다)</div>
    <div class="co-row"><button id="coRun" class="primary">▶ 전투 시작</button><button id="coClear">🧹 비우기</button><button id="coSave">💾 배치 저장</button></div>
    <div class="co-row"><button id="coLast" class="primary">⟲ 마지막 세팅 재시작 [R]</button></div>
    <div class="co-row"><button id="coLoad">📂 저장한 배치</button><button id="coSpd">속도 x1</button><button id="coExit">나가기</button></div></div>
    <div id="coQuick"><button id="cqRun" class="primary">▶ 시작</button><button id="cqClear">비우기</button><button id="cqSave">저장</button><button id="cqLast">재시작</button><button id="cqSpd">x1</button><button id="cqPanel">☰ 편성</button></div>
    <div id="coCount"></div><div id="coLog"></div>`;
  document.body.appendChild(d);
  const on = (id, f) => $(id).addEventListener('click', e => { e.stopPropagation(); f(); });
  on('coTitle', () => $('coPanel').classList.toggle('collapsed')); on('cqPanel', () => $('coPanel').classList.toggle('collapsed'));
  on('coRun', coloToggle); on('cqRun', coloToggle); on('coClear', coloClear); on('cqClear', coloClear); on('coSave', coloSave); on('cqSave', coloSave);
  on('coLast', coloRestart); on('cqLast', coloRestart); on('coLoad', coloLoad); on('coSpd', coloSpeed); on('cqSpd', coloSpeed); on('coExit', coloExit);
  $('coTabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; e.stopPropagation(); COLO.tab = b.dataset.tab; coloPanel(); });
  $('coPanel').addEventListener('click', e => { const t = e.target.closest('[data-tool]'); if (!t) return; e.stopPropagation();
    if (t.dataset.tool === 'mirror') return coloMirror();
    COLO.tool = COLO.tool === 'erase' ? null : 'erase'; COLO.pick = null; coloPanel(); });
  $('coUpd').addEventListener('click', e => { const t = e.target.closest('[data-upd]'); if (!t) return; e.stopPropagation(); if (t.dataset.upd === 'fold'){ COLO.updFold = !COLO.updFold; try { localStorage.setItem('colo-upd-fold', COLO.updFold ? '1' : ''); } catch (er) {} coloPanel(); } else coloUpdTest(+t.dataset.upd); });
  for (const el of [$('coList'), $('coUpd')]) el.addEventListener('pointerdown', e => { const b = e.target.closest('[data-id]'); if (!b) return; e.preventDefault(); COLO.drag = { from: 'list', id: b.dataset.id, x0: e.clientX, y0: e.clientY, moved: false }; });
  coloPanel();
}
function coloPanel(){
  $('coTabs').innerHTML = coloTabs().map(([k, n]) => `<button data-tab="${k}" class="${COLO.tab === k ? 'on' : ''}">${n}</button>`).join('');
  const L = coloRoster().filter(r => r.tab === COLO.tab), btn = r => { const g = coloUpdOf(r.id);
    return `<button data-id="${r.id}" class="${COLO.pick === r.id ? 'on' : ''}${g ? ' upd' : ''}" title="${r.name}${r.rank ? ' · ' + r.rank : ''}${g ? ' — 업뎃 ' + g.v + ': ' + g.n : ''}">${coloFace(r)}<span>${r.name}</span>${g ? '<b class="ub">업뎃!</b>' : ''}</button>`; };
  $('coList').innerHTML = L.map(btn).join('') || '<small>없음</small>';
  coloDrawFaces($('coList'));
  // 업뎃! 칸: 묶음마다 (새것 먼저, 한 인물은 가장 새 묶음에만)
  const R = coloRoster(), seen = new Set();
  const groups = COLO_UPD.map((g, i) => ({ g, i, L: g.ids.filter(id => !seen.has(id) && seen.add(id)).map(id => R.find(r => r.id === id)).filter(Boolean) })).filter(x => x.L.length);
  $('coUpd').innerHTML = groups.length ? `<div class="co-upd-h" data-upd="fold">⚡ 업뎃! 모션 시험 <small>${COLO.updFold ? '펼치기' : '접기'}</small></div>` + (COLO.updFold ? '' : groups.map(({ g, i, L: GL }) =>
    `<div class="co-upd-g"><span>${g.v} · ${g.n}</span><button data-upd="${i}" title="이 묶음을 아군 · 적군 양쪽에 놓음 (같은 인물끼리 맞붙음)">시험판</button></div><div class="co-tools co-upd-l">${GL.map(btn).join('')}</div>`).join('')) : '';
  coloDrawFaces($('coUpd'));
  document.querySelectorAll('#coPanel [data-tool="erase"]').forEach(b => b.classList.toggle('on', COLO.tool === 'erase'));
  coloCount();
}
function coloCount(){
  const a = G.units.filter(u => u.colo && u.side === 'ally' && !u.dead && !u.downed).length, e = G.units.filter(u => u.colo && u.side === 'enemy' && !u.dead && !u.downed).length;
  const el = $('coCount'); if (el) el.innerHTML = `<b class="a">아군 ${a}</b> <i>vs</i> <b class="e">적군 ${e}</b>${COLO.run ? ' · 전투 중' : COLO.done ? '' : ' · 배치 중'}`;
  for (const id of ['coRun', 'cqRun']){ const b = $(id); if (b) b.textContent = COLO.run ? (id === 'coRun' ? '■ 멈추고 배치로' : '■ 멈춤') : (id === 'coRun' ? '▶ 전투 시작' : '▶ 시작'); }
}
function coloLog(t, cls = ''){ const el = $('coLog'); if (!el) return; const p = document.createElement('div'); p.className = cls; p.textContent = t; el.appendChild(p); while (el.children.length > 60) el.firstChild.remove(); el.scrollTop = el.scrollHeight; }
// 놓기 · 빼기
function coloSideAt(x){ return x < COLO.cx ? 'ally' : 'enemy'; }
function coloInside(x, z){ return ((x - COLO.cx) / (COLO.a - 0.7)) ** 2 + ((z - COLO.cz) / (COLO.b - 0.7)) ** 2 <= 1; }
function coloClamp(x, z){ const dx = x - COLO.cx, dz = z - COLO.cz, e = Math.sqrt((dx / (COLO.a - 0.8)) ** 2 + (dz / (COLO.b - 0.8)) ** 2); return e <= 1 ? { x, z } : { x: COLO.cx + dx / e, z: COLO.cz + dz / e }; }
function coloPut(id, x, z, side){
  const r = coloRoster().find(o => o.id === id); if (!r) return null;
  side = side || coloSideAt(x);
  const kind = side === 'ally' ? r.ally : r.foe;
  if (!kind){ popText(x, 1.2, z, side === 'ally' ? '적으로만 나옴' : '동료로만 나옴', 'miss', 1); return null; }
  ({ x, z } = coloClamp(x, z));
  const u = spawn(kind, x, z, side); u.colo = id; u.face = side === 'ally' ? 1 : -1; u.aim = side === 'ally' ? 0 : Math.PI; u.home = { x, z };
  if (kind === 'kariusAlly') Object.assign(u, { kc: null, p2: false, cd: 0.5, swCd: 2.5, grCd: 4, slCd: 2, rsCd: 3 });
  if (side === 'enemy' && !u.tag){ u.tag = document.createElement('div'); u.tag.className = 'ntag enemy'; u.tag.textContent = u.D.name; UI.layer.appendChild(u.tag); u.alert = true; }   // 구경용: 적도 이름표
  if (side === 'enemy'){ u.band = 'colo'; if (u.D.boss && !u.D.h2 && typeof bossInit === 'function'){ const g = G.boss; bossInit(u, { x: COLO.cx, z: COLO.cz }); G.boss = g || null; $('bossbar').hidden = true; } }
  if (side === 'ally' && u.kind.startsWith('h2_') && typeof BAG_CAP !== 'undefined') BAG_CAP[u.kind] = (H2R[r.slug] && H2R[r.slug].bag) || 8;
  if (COLO.run) coloWake(u); else COLO.dirty = true;
  dust(x, z, 6); coloCount(); return u;
}
function coloDel(u){ if (!u || !u.colo) return; removeUnit(u); COLO.dirty = true; if (G.boss === u) G.boss = null; coloCount(); }
function coloUnits(){ return G.units.filter(u => u.colo); }
function coloExtra(){ return G.units.filter(u => !u.colo && u !== G.player && (u.side === 'ally' || u.side === 'enemy')); }   // v1.13 싸움 중 불려 나온 인물 (소환수 · 세자르의 검사 · 대장군 증원)
function coloSnap(){ return coloUnits().filter(u => !u.dead && !(COLO.done && u.downed)).map(u => ({ id: u.colo, x: +u.home.x.toFixed(2), z: +u.home.z.toFixed(2), side: u.side })); }
function coloSet(list){ for (const u of [...coloUnits(), ...coloExtra()]) removeUnit(u); G.boss = null; for (const s of list || []) coloPut(s.id, s.x, s.z, s.side); coloCount(); }
function coloClear(){ coloStop(); COLO.done = false; for (const u of [...coloUnits(), ...coloExtra()]) removeUnit(u); G.boss = null; for (const d of [...G.decals]) G.scene.remove(d.g); G.decals = []; for (const p of [...G.projs]) G.scene.remove(p.m); G.projs = []; coloCount(); }
function coloSave(){ const s = COLO.run || COLO.done ? (COLO.start || coloSnap()) : coloSnap(); try { localStorage.setItem(COLO_SAVE, JSON.stringify(s)); } catch (e) {} coloLog(`💾 배치를 저장했어요 (${s.length}명). 콜로세움에 들어오면 이 배치로 시작하고, 📂로 언제든 불러와요.`, 'sys'); }
function coloLoad(){ let s = null; try { s = JSON.parse(localStorage.getItem(COLO_SAVE) || 'null'); } catch (e) {} if (!s){ coloLog('저장한 배치가 없어요', 'sys'); return; } coloClear(); coloSet(s); coloLog(`📂 저장한 배치를 불러왔어요 (${s.length}명)`, 'sys'); }
function coloMirror(){
  if (COLO.run) return; const A = coloUnits().filter(u => u.side === 'ally');
  for (const u of coloUnits().filter(u => u.side === 'enemy')) removeUnit(u);
  let n = 0; for (const u of A){ const r = coloRoster().find(o => o.id === u.colo); if (r && r.foe){ coloPut(u.colo, 2 * COLO.cx - u.home.x, u.home.z, 'enemy'); n++; } }
  coloLog(`⇄ 아군 ${A.length}명을 거울처럼 적군 쪽에 (${n}명 — 동료 탭 인물은 적으로 못 나옴)`, 'sys');
}
// 업뎃 시험판: 그 묶음 인물을 왼쪽 (아군) 에 세로로, 같은 인물을 오른쪽 (적군) 에 거울로. 한쪽만 되는 인물은 상대로 검사
function coloUpdTest(i){
  const g = COLO_UPD[i]; if (!g) return; coloClear();
  const L = g.ids.map(id => coloRoster().find(r => r.id === id)).filter(Boolean).slice(0, 8), n = L.length;
  L.forEach((r, k) => { const z = COLO.cz + (n > 1 ? (k / (n - 1) - 0.5) * Math.min(13, n * 2.2) : 0), xa = COLO.cx - 4.5 - (k % 2) * 1.6, xe = 2 * COLO.cx - xa;
    coloPut(r.ally ? r.id : 'cheongAlly', xa, z, 'ally'); coloPut(r.foe ? r.id : 'swordsman', xe, z, 'enemy'); });   // 적으로만 나오는 인물의 상대는 청광묵 (검사는 동료로 못 나옴)
  caption('업뎃 시험판 ' + g.v, g.n + ' — ▶ 시작'); coloLog(`⚡ 업뎃 시험판 ${g.v} (${n}명${g.ids.length > 8 ? ', 앞 8명' : ''}): ${L.map(r => r.name).join(' · ')}`, 'sys');
}
function coloSpeed(){ COLO.spd = COLO.spd === 1 ? 2 : COLO.spd === 2 ? 0.5 : 1; G.spd = COLO.spd; const t = COLO.spd === 0.5 ? 'x½' : 'x' + COLO.spd; $('coSpd').textContent = '속도 ' + t; $('cqSpd').textContent = t; }
// 시작 · 멈춤 · 결과
function coloWake(u){ if (u.side === 'enemy'){ u.alert = true; u.seen = G.t; } }
function coloToggle(){ if (COLO.run) return coloStop(true); coloGo(); }
function coloGo(){
  const A = coloUnits().filter(u => u.side === 'ally' && !u.dead), E = coloUnits().filter(u => u.side === 'enemy' && !u.dead);
  if (!A.length || !E.length){ caption('양쪽에 한 명씩은', '왼쪽 (아군) · 오른쪽 (적군)에 인물을 놓아 주세요'); return; }
  if (COLO.done) coloSet(COLO.dirty || !COLO.start ? coloSnap() : COLO.start);   // 끝난 뒤: 손대지 않았으면 시작했던 배치로, 손댔으면 지금 배치 (쓰러진 인물은 빼고, 나머지는 새로)
  COLO.start = coloSnap(); try { localStorage.setItem(COLO_LAST, JSON.stringify(COLO.start)); } catch (e) {}
  COLO.run = true; COLO.done = false; COLO.dirty = false; COLO.t0 = G.t; G.lock = false; COLO.line.visible = false;
  for (const u of coloUnits()) coloWake(u);
  const bs = coloUnits().find(u => u.side === 'enemy' && u.D.boss); G.boss = bs || null;
  caption('시작!', `아군 ${A.length} vs 적군 ${E.length}`); coloLog(`▶ 전투 시작 — 아군 ${A.map(u => u.D.name).join(' · ')} / 적군 ${E.map(u => u.D.name).join(' · ')}`, 'sys');
  if (typeof SFX !== 'undefined' && SFX.wake){ SFX.wake(); SFX.thump && SFX.thump(70, 0.5, 0.6); }
  coloCount();
}
function coloStop(back){
  if (!COLO.run && !COLO.done) return;
  COLO.run = false; G.lock = true; COLO.line.visible = true; $('bossbar').hidden = true;
  if (back && COLO.start){ coloSet(COLO.start); COLO.done = false; coloLog('■ 멈추고 시작 전 배치로 돌렸어요', 'sys'); }
  coloCount();
}
function coloRestart(){
  let s = COLO.start; if (!s) try { s = JSON.parse(localStorage.getItem(COLO_LAST) || 'null'); } catch (e) {}
  if (!s){ coloLog('아직 시작한 전투가 없어요', 'sys'); return; }
  COLO.run = false; COLO.done = false; G.lock = true; coloClear(); coloSet(s); coloGo();
}
function coloEnd(win){
  COLO.run = false; COLO.done = true; G.lock = true; $('bossbar').hidden = true; COLO.line.visible = true;
  setTimeout(() => { if (!COLO.done) return; for (const u of [...coloUnits(), ...coloExtra()]) if (!u.dead && !u.downed && !u.lock){ interrupt(u); u.st = 'idle'; u.stT = 0; u.moving = false; u.guardStance = false; u.lift = 0; u._rush = null; setPose(u, 'idle'); } }, 500);   // v1.13 끝난 뒤 휘두르던 그림 그대로 굳지 않게 (0.5초 뒤 서 있음)
  const sec = Math.round(G.t - COLO.t0), left = coloUnits().filter(u => u.side === (win === 'ally' ? 'ally' : 'enemy') && !u.dead && !u.downed);
  const big = win === 'ally' ? '아군 승리' : win === 'enemy' ? '적군 승리' : '무승부';
  caption(big, `${sec}초 · 남은 ${left.map(u => u.D.name).join(' · ') || '없음'} — R 재시작`);
  coloLog(`🏁 ${big} (${sec}초) — 남은 인물: ${left.map(u => `${u.D.name} ${Math.max(0, Math.round(u.hp))}/${u.max}`).join(', ') || '없음'}`, win === 'ally' ? 'heal' : 'dead');
  coloCount();
}
TICKS.push(dt => {
  if (!COLO.on) return;
  const pl = G.player; if (pl){ pl.x = COLO.cx; pl.z = COLO.cz; pl.lift = 1; pl.inv = 1e9; pl.hp = pl.max; pl.downed = false; }
  if (!COLO.run) return;
  for (const u of coloUnits()){
    if (u.side === 'enemy' && !u.dead) coloWake(u);
    if ((u.dead || u.downed) && !u._coOut){ u._coOut = true; coloLog(`${u.side === 'ally' ? '🟢' : '🔴'} ${u.D.name} 쓰러짐 (${Math.round(G.t - COLO.t0)}초)`, 'dead'); coloCount(); }
    if (!u.dead && !coloInside(u.x, u.z)){ const c = coloClamp(u.x, u.z); u.x = c.x; u.z = c.z; }
  }
  for (const u of coloExtra()) if (!u.dead && !coloInside(u.x, u.z)){ const c = coloClamp(u.x, u.z); u.x = c.x; u.z = c.z; }   // v1.13 불려 나온 인물도 경기장 안에
  const a = coloUnits().some(u => u.side === 'ally' && !u.dead && !u.downed), e = coloUnits().some(u => u.side === 'enemy' && !u.dead && !u.downed);
  if (!a || !e) coloEnd(a ? 'ally' : e ? 'enemy' : 'draw');
});
// 마우스 · 손가락: 끌어 놓기 · 옮기기 · 빼기
function coloGround(ev){ const r = G.renderer.domElement.getBoundingClientRect(); return screenToGround(ev.clientX - r.left, ev.clientY - r.top, r.width, r.height, 0); }
function coloUnitAt(ev){
  const r = G.renderer.domElement.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top; let best = null, bd = 1e9;
  for (const u of coloUnits()){ if (u.dead) continue; const f = toScreen(u.x, u.y, u.z, r.width, r.height), h = toScreen(u.x, u.y + bodyH(u), u.z, r.width, r.height);
    const w = Math.max(18, (f.y - h.y) * 0.32), inX = Math.abs(mx - f.x) < w, inY = my < f.y + 12 && my > h.y - 6; if (!inX || !inY) continue;
    const d = Math.abs(mx - f.x) + Math.abs(my - (f.y + h.y) / 2) * 0.3; if (d < bd){ bd = d; best = u; } }
  return best;
}
function coloGhost(on, id, ev){
  let g = $('coGhost'); if (!on){ if (g) g.remove(); return; }
  if (!g){ g = document.createElement('div'); g.id = 'coGhost'; const r = coloRoster().find(o => o.id === id); g.innerHTML = r ? coloFace(r) : ''; document.body.appendChild(g); coloDrawFaces(g); }
  g.style.left = ev.clientX + 'px'; g.style.top = ev.clientY + 'px';
  const p = coloGround(ev); g.className = p && coloInside(p.x, p.z) ? (coloSideAt(p.x) === 'ally' ? 'a' : 'e') : 'x';
}
function coloBind(){
  const cv = G.renderer.domElement;
  cv.addEventListener('pointerdown', ev => {
    if (!COLO.on) return; const p = coloGround(ev); if (!p) return;
    const u = coloUnitAt(ev);
    if (ev.button === 2){ if (u) coloDel(u); return; }
    if (COLO.tool === 'erase'){ if (u) coloDel(u); return; }
    if (u){ COLO.drag = { from: 'unit', u, x0: ev.clientX, y0: ev.clientY, moved: false }; cv.setPointerCapture && cv.setPointerCapture(ev.pointerId); return; }
    if (COLO.pick && coloInside(p.x, p.z)) coloPut(COLO.pick, p.x, p.z);
  });
  addEventListener('pointermove', ev => {
    const D = COLO.drag; if (!D || !COLO.on) return;
    if (Math.hypot(ev.clientX - D.x0, ev.clientY - D.y0) > 6) D.moved = true;
    if (D.from === 'list' && D.moved) coloGhost(true, D.id, ev);
    if (D.from === 'unit' && D.moved){ const p = coloGround(ev); if (p){ const c = coloClamp(p.x, p.z); D.u.x = c.x; D.u.z = c.z; D.u.home = { x: c.x, z: c.z }; D.u.kx = D.u.kz = 0; if (!COLO.run) COLO.dirty = true; } }
  });
  addEventListener('pointerup', ev => {
    const D = COLO.drag; COLO.drag = null; if (!D || !COLO.on) return; coloGhost(false);
    if (D.from === 'list'){
      if (!D.moved){ COLO.pick = COLO.pick === D.id ? null : D.id; COLO.tool = null; coloPanel(); return; }
      const over = document.elementFromPoint(ev.clientX, ev.clientY); if (over && over !== cv) return;
      const p = coloGround(ev); if (p && coloInside(p.x, p.z)) coloPut(D.id, p.x, p.z);
      return;
    }
    if (D.from === 'unit' && D.moved){ const u = D.u, side = coloSideAt(u.x);
      if (side !== u.side){ const id = u.colo, x = u.x, z = u.z; removeUnit(u); if (!coloPut(id, x, z, side)) coloPut(id, x + (side === 'ally' ? 1.2 : -1.2), z, side === 'ally' ? 'enemy' : 'ally'); }
      coloCount(); }
  });
  cv.addEventListener('wheel', ev => { if (!COLO.on) return; ev.preventDefault(); COLO.zoom = clamp(COLO.zoom * (ev.deltaY > 0 ? 1.08 : 0.93), 0.55, 1.35); }, { passive: false });
  addEventListener('keydown', ev => { if (!COLO.on || ev.repeat) return; if (ev.code === 'KeyR') coloRestart(); if (ev.code === 'Space'){ ev.preventDefault(); coloToggle(); } });
}
// 카메라: 남쪽 관중석에서 낮게, 고정 (돌지 않음). 흔들림만 받음
function coloCam(dt){
  const z = COLO.zoom, tx = COLO.cx, ty = 6.2 * z + 0.6, tz = COLO.cz + COLO.b + 9.5 * z, k = 1 - Math.pow(1 - 0.1, dt * 60);
  camera.position.x += (tx - camera.position.x) * k; camera.position.y += (ty - camera.position.y) * k; camera.position.z += (tz - camera.position.z) * k;
  if (G.t < CAM.shakeUntil){ const a = CAM.shakeAmp; camera.position.x += rnd(-0.5, 0.5) * a; camera.position.y += rnd(-0.5, 0.5) * a * 0.6; }
  camera.up.set(0, 1, 0); camera.lookAt(COLO.cx, 0.4, COLO.cz + 0.6);
  CAM.follow.x = COLO.cx; CAM.follow.z = COLO.cz;
  // 관중: 싸우는 동안 들썩
  if (COLO.run && COLO.fans && Math.random() < 0.5){ const F = COLO.fans, m4 = new THREE.Matrix4(); for (let n = 0; n < 12; n++){ const i = Math.floor(Math.random() * F.list.length), p = F.list[i]; m4.makeRotationY(-p.t); m4.setPosition(p.x, p.h + 0.11 + (Math.random() < 0.5 ? 0.18 : 0), p.z); F.m.setMatrixAt(i, m4); } F.m.instanceMatrix.needsUpdate = true; }
}
{ const _uc = updateCamera; updateCamera = function(dt, t){ if (COLO.on) return coloCam(dt); return _uc(dt, t); }; }
{ const _pu = playerUpdate; playerUpdate = function(u, dt){ if (COLO.on) return; return _pu(u, dt); }; }
{ const _lw = layoutWalls; layoutWalls = function(map, yaw){ _lw(map, yaw); if (!COLO.on || !map.wallInfo) return; const m4 = new THREE.Matrix4();   // 경기장 밖 덩어리 벽은 치움 (관중석이 보이게)
  map.wallInfo.forEach((w, k) => { if (!w.near){ m4.makeScale(0.001, 0.001, 0.001); m4.setPosition(w.x, -5, w.z); map.wallMesh.setMatrixAt(k, m4); } }); map.wallMesh.instanceMatrix.needsUpdate = true; }; }
function startColo(){
  clearLevel(); G.mode = 'colo'; COLO.on = true; COLO.run = false; COLO.done = false; G.cmd = 'free';
  document.body.classList.add('colo');
  const theme = { bg: 0x9fb4cc, fogNear: 40, fogFar: 120, hemi: 0.7, moon: 0.75, floor: 0xb89c6c, wall: 0x8a7458, pillar: 0x9a8a70 };
  loadLevel(coloRows(), theme); G.fogK = 2.4;
  hemi.color.setHex(0xfff4e0); hemi.groundColor.setHex(0x8a7050); moon.color.setHex(0xfff0d0);
  G.map.wallH = 1.1; layoutWalls(G.map, 0); CAM.lockYaw = true; CAM.yaw = CAM.yawT = 0;
  G.map.group.add(coloStands());
  G.player = spawn('player', COLO.cx, COLO.cz, 'neutral'); G.player.group.visible = false; if (G.player.bar){ G.player.bar.remove(); G.player.bar = null; } if (G.player.tag){ G.player.tag.remove(); G.player.tag = null; }
  G.onKill = () => {}; G.lock = true;
  camera.position.set(COLO.cx, 7, COLO.cz + COLO.b + 10);
  coloUI(); if (!COLO.bound){ COLO.bound = true; coloBind(); }
  let s = null; try { s = JSON.parse(localStorage.getItem(COLO_SAVE) || 'null'); } catch (e) {}
  if (!s) s = [{ id: 'kariusAlly', x: 15, z: 12, side: 'ally' }, { id: 'rebeccaAlly', x: 16.5, z: 15, side: 'ally' }, { id: 'cheongAlly', x: 14, z: 15.5, side: 'ally' }, { id: 'swordsman', x: 27, z: 12, side: 'enemy' }, { id: 'swordsman', x: 27.5, z: 15, side: 'enemy' }, { id: 'spearman', x: 29, z: 13.5, side: 'enemy' }];
  coloSet(s);
  caption('콜로세움', '얼굴을 끌어 놓고 ▶ 시작 — 왼쪽 아군 · 오른쪽 적군');
  coloLog('콜로세움 — 왼쪽 편성 창에서 얼굴을 바닥으로 끌어 놓으세요. 가운데 선 왼쪽은 아군, 오른쪽은 적군. Space 시작 · 멈춤, R 재시작.', 'sys');
}
function coloExit(){ COLO.on = false; location.hash = ''; location.reload(); }
// 굴의 일시정지 창에 '콜로세움'
if (typeof pauseOpen === 'function'){
  const _pauseC = pauseOpen;
  pauseOpen = function(){
    _pauseC();
    const box = document.querySelector('#confirm .cf-box div'); if (!box || box.querySelector('[data-p="colo"]')) return;
    const b = document.createElement('button'); b.dataset.p = 'colo'; b.textContent = G.mode === 'colo' ? '콜로세움 나가기' : '콜로세움 (배치하고 구경)';
    b.addEventListener('click', ev => { ev.stopPropagation(); if (G.mode === 'colo') return coloExit(); if (typeof proSave === 'function') proSave(); location.hash = '#colo'; location.reload(); });
    box.appendChild(b);
  };
}
