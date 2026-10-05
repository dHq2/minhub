/* qol.js v1.3 — 편의 · 굴 손님 (v1.3: 대련 더미 근접 공격이 하 · 중 · 상단으로) (v1.2: 아래 UI 비킴 · N 바로 먹기 · 굴 가구 옮기기 · 의자에 앉기 · 대련 더미 근접 공격 켜고 끄기 · 상인은 적뢰전 뒤에만 · 쥐 기사 순찰) (v1.1: 초상화 대화 vnTalk · Esc 일시정지 창)
   · H: 기술표 창 (무리별: 움직임 · 막기 · 맨손 · 레슬링 · 무기 · 원정 · 굴). 열려 있는 동안 멈춤. H · Esc로 닫음
   · 지름길: 보스 (5층 세자르 · 10층 대장군)를 쓰러뜨리면 원정 준비 창에서 그 아래층부터 떠날 수 있음
   · 토끼마차 (아이텐): 사흘마다 아침에 굴에 들름 (그날 하루). 장비 셋 (그날 고른 것) · 탄약 · 물약 · 횃불을 판다 */
'use strict';
const MOVES = [
  ['움직임', [['WASD', '이동'], ['Shift', '달리기'], ['Space', '점프'], ['Q', '구르기 (무적)'], ['G', '숙이기 — 높은 공격이 머리 위로'], ['Shift + G', '슬라이딩 — 닿은 적이 넘어짐'], ['T', '태클 — 벽에 같이 박으면 큰 피해 (Shift와 함께 더 세게)']]],
  ['막기 · 반격', [['F', '막기 (맞는 순간 누르면 튕겨냄) · 맨손이면 무에타이 가드'], ['G로 피한 뒤 J', '어퍼컷 (확정 치명)']]],
  ['맨손', [['J 연타', '잽 → 주먹 → 앞차기 → 회전 하이킥'], ['점프 중 J', '플라잉 니킥'], ['달리며 점프 중 J', '드롭킥 — 발끝에 걸리면 빠아악!'], ['G 숙인 채 J', '다리후리기 — 넘어뜨림'], ['넘어진 적에게 J', '발목 부수기 (느려짐)']]],
  ['레슬링', [['V', '잡기 → 클린치'], ['클린치 J · K · Q', '니킥 · 주먹 · 잽 / 메치기 / 두 손 밀기'], ['그라운드 J · K · Q', '파운딩 / 끝내기 / 일어섬'], ['잡혔을 때', 'Space · A · D 연타로 빠져나옴, 막대가 차면 Q로 구름']]],
  ['무기', [['J', '기본 공격 (무기마다 연타)'], ['K (누르고 있기)', '무기 스킬 · 투창 (끝까지 당기면 강한 투창)'], ['R', '재장전'], ['X', '무기 ↔ 보조 무기']]],
  ['원정 · 굴', [['E', '살펴보기 · 줍기 · 대화 · 가구 옮기기 · 의자에 앉기'], ['N', '냠 — 바로 먹기 (굴: 창고 끼니 · 원정: 가방의 음식)'], ['I · C', '가방 · 장비 / 상태'], ['4 ~ 7', '소모품'], ['1 · 2 · 3', '동료 지시 (따라와 · 집중 · 자유)'], ['M', '큰 지도'], ['Z · C', '카메라 돌리기']]],
];
function moveListToggle(force){
  let el = document.getElementById('movelist');
  if (!el){
    el = document.createElement('div'); el.id = 'movelist'; el.hidden = true;
    el.style.cssText = 'position:fixed;inset:0;z-index:20;display:grid;place-items:center;background:rgba(0,0,0,.55);';
    el.innerHTML = `<div class="cf-box" style="width:min(760px,94vw);max-height:86vh;overflow:auto"><b>기술표</b><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:10px 18px;margin-top:8px;display:grid">${MOVES.map(([t, rows]) =>
      `<section><h4 style="margin:6px 0 4px;color:#ffd35a;font-family:'Do Hyeon';font-weight:normal;font-size:17px">${t}</h4>${rows.map(([k, d]) => `<div style="display:flex;gap:10px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#d8ccb8;font-size:13px"><kbd style="min-width:128px;text-align:left;color:#f0e4c8">${k}</kbd><span>${d}</span></div>`).join('')}</section>`).join('')}</div><p style="margin-top:10px;font-size:12px;opacity:.7">H · Esc 닫기 · 굴의 대련 더미로 연습 (한 대 치면 연습 공을 굴려 보냄)</p></div>`;
    el.addEventListener('click', () => moveListToggle(false));
    document.body.appendChild(el);
  }
  const show = force ?? el.hidden;
  el.hidden = !show; G.paused = show;
}
addEventListener('keydown', e => { const el = document.getElementById('movelist'); if (el && !el.hidden && (e.code === 'Escape' || e.code === 'KeyH')){ e.preventDefault(); pressed.delete(e.code); moveListToggle(false); } });   // 멈춘 동안엔 게임이 H를 안 읽으니 여기서 닫음

/* ---------- 토끼마차 (굴 손님) ---------- */
const WAGON = { every: 3, at: null };
function wagonStock(){
  if (!RPG.meta.wagon || RPG.meta.wagon.day !== PRO.day){
    lootPools(); const F = Math.max(1, Math.min(10, (RPG.depth || 1) + 1)), gear = [];
    for (let i = 0; i < 3; i++) gear.push(rollItem(F, { type: 'gear', bonus: 0.15 }));
    RPG.meta.wagon = { day: PRO.day, gear };
  }
  return RPG.meta.wagon.gear.concat(['I-282', 'I-283', 'I-285', 'I-037', 'I-061', 'I-104']);
}
function caveVisitors(){
  if (G.mode !== 'cave') return;
  if (WAGON.at){ WAGON.at.g.parent && WAGON.at.g.parent.remove(WAGON.at.g); const i = G.inspect.indexOf(WAGON.insp); if (i >= 0) G.inspect.splice(i, 1); WAGON.at = null; }
  ratPatrol();
  if (!PRO.jrDone) return;   // v1.2 상인은 적뢰전 전엔 못 옴
  if (!PRO.day || PRO.day % WAGON.every !== 0) return;
  const cand = [[11, 4.5], [10.5, 5], [7.5, 4.5], [11, 6], [6, 5]], spot = cand.find(([x, z]) => !solidAt(G.map, x, z) && !G.units.some(u => Math.hypot(u.x - x, u.z - z) < 1)) || cand[0];
  WAGON.at = bill('art/enc/aiten.webp', spot[0], spot[1], 2.0, { fit: 1.3 });
  WAGON.insp = { x: spot[0], z: spot[1], r: 1.8, mark: '토끼마차', far: 12, keep: true, label: '토끼마차 — 아이텐의 가게', fn: () => encShop('아이텐 · 토끼마차', wagonStock()) };
  G.inspect.push(WAGON.insp);
  setTimeout(() => G.mode === 'cave' && guide('<em>토끼마차</em>가 왔다 — 아이텐이 장비 · 탄약을 판다 (오늘만)', 6), 3200);
}
if (typeof endDay === 'function'){ const _endDay = endDay; endDay = async function(...a){ const r = await _endDay.apply(this, a); caveVisitors(); return r; }; }

/* ---------- v1.1 초상화 대화 (미연시처럼 큰 얼굴 + 이름) ---------- */
const VN_FACE = { 인주: 'assets/inju_face.png', 청광묵: 'art/pro/goblin_face.webp', 카리우스: 'art/pro/karius_face.webp', 'GOOD WILL': 'assets/goodwill_face.png', 노먼: 'assets/norman_face.png', 모닝스타: 'assets/morningstar_face.png',
  세자르: 'assets/cesar_face.png', 적뢰: 'assets/jeokroe_face.png', 벤킨: 'assets/benkin_face.png', 단달로: 'assets/dandalo_face.png', 테헤라: 'art/enc/tehera_sit.webp', '게 요리사': 'art/enc/crabchef.webp', 아이텐: 'art/enc/aiten.webp', '돼지들의 신': 'art/enc/piggod.webp', '담배 피는 노인': 'art/enc/H-341.webp' };
function vnTalk(who, lines, o = {}){ return textbox(who, lines, { ...o, face: o.face || VN_FACE[who], vn: true }); }

/* ---------- v1.1 Esc: 일시정지 창 (이어하기 · 기술표 · 처음부터) ---------- */
function pauseOpen(){
  const el = $r('confirm'); G.paused = true;
  el.innerHTML = `<div class="cf-box"><b>잠깐</b><p>${G.mode === 'exp' ? `${EXP.F}층 · 횃불 ${EXP.torches} · 금화 ${RPG.gold}` : `${PRO.day || 1}일째 · 금화 ${RPG.gold}`}</p><div style="flex-direction:column;align-items:stretch">
    <button data-a="ok">이어하기 (Esc)</button><button data-p="moves">기술표 (H)</button><button data-p="cam">카메라 되돌리기</button><button data-p="new">처음부터 (저장 지움)</button></div></div>`;
  el.hidden = false;
  UIR.confirm = (yes) => { el.hidden = true; UIR.confirm = null; G.paused = false; el.onclick = null; };
  el.onclick = e => { const b = e.target.closest('button'); if (!b) return; e.stopPropagation();
    if (b.dataset.a === 'ok') return UIR.confirm(false);
    if (b.dataset.p === 'moves'){ UIR.confirm(false); moveListToggle(true); }
    if (b.dataset.p === 'cam'){ UIR.confirm(false); if (!CAM.lockYaw) setYaw(Math.round(CAM.yawT / (Math.PI * 2)) * Math.PI * 2); if (G.player) camSnapTo(G.player.x, G.player.z); }
    if (b.dataset.p === 'new'){ UIR.confirm(false); uiConfirm('처음부터?', '저장을 지우고 프롤로그부터 다시 시작합니다.', '지운다', () => newGame()); } };
}

/* ---------- v1.2 아래 UI 비킴: 스킬 줄과 가로로 겹치면 영웅 칸 · 지시 버튼을 스킬 줄 위로 올림 (크기 · 비율은 그대로) ---------- */
function uiDodgeBar(){
  const sb = document.getElementById('skillbar');
  if (sb){ const k = Math.min(1, (innerWidth - 12) / Math.max(1, sb.scrollWidth)), t = k < 1 ? `translateX(-50%) scale(${k.toFixed(3)})` : ''; if (sb.style.transform !== t){ sb.style.transform = t; sb.style.transformOrigin = 'bottom center'; } }   // 창이 좁으면 스킬 줄만 줄여 화면 안에
  const r = sb && getComputedStyle(sb).display !== 'none' ? sb.getBoundingClientRect() : null;
  for (const id of ['party', 'cmd']){
    const el = document.getElementById(id); if (!el) continue;
    const e = el.getBoundingClientRect(), over = r && r.width > 0 && e.width > 0 && e.right > r.left - 8 && e.left < r.right + 8;
    const want = over ? Math.round(innerHeight - r.top + 8) + 'px' : '';
    if (el.style.bottom !== want) el.style.bottom = want;
  }
}
setInterval(uiDodgeBar, 250); addEventListener('resize', uiDodgeBar);

/* ---------- v1.2 N: 바로 먹기 ---------- */
function quickEat(){
  const pl = G.player; if (!pl || pl.downed || G.lock || G.paused) return;
  if (G.mode === 'cave' && typeof PRO !== 'undefined' && PRO.cave){
    if (PRO.meal.inju.fed) return popText(pl.x, pl.y + 2.2, pl.z, '배부르다 (오늘 끼니는 먹음)', 'miss', 1);
    if (edible()){ const d = takeMeal(); PRO.meal.inju.fed = true; pl.hp = Math.min(pl.max, pl.hp + pl.max * 0.1); popText(pl.x, pl.y + 2, pl.z, `냠 (${d.name})`, 'heal', 1.2); SFX.burst({ type: 'bandpass', f: 500, q: 3, gain: 0.25, dec: 0.3 }); pl.raiseT = G.t + 0.4; return; }
    if (PRO.penFood > 0){ pickPenFood(); PRO.meal.inju.fed = true; popText(pl.x, pl.y + 2, pl.z, '버섯 냠 (달팽이 먹이 -1)', 'heal', 1.2); return; }
    return popText(pl.x, pl.y + 2.2, pl.z, '먹을 게 없다', 'miss', 1);
  }
  const it = RPG.bag.find(o => itemDef(o).c === 'food');
  if (!it) return popText(pl.x, pl.y + 2.2, pl.z, '가방에 먹을 게 없다', 'miss', 1);
  if (!useItem(it, pl)) popText(pl.x, pl.y + 2.2, pl.z, '지금은 못 먹는다', 'miss', 0.8); else if (pl.S.poses.raise) pl.raiseT = G.t + 0.5;
}

/* ---------- v1.2 굴 가구: 다시 들어 옮기기 · 의자에 앉기 ---------- */
const SEATS = new Set(['d_H-239']);   // 붉은 방석 나무 의자
function furnInsp(p){
  furnUninsp(p); p._insp = [];
  const seat = SEATS.has(p.k), add = o => { G.inspect.push(o); p._insp.push(o); };
  add({ x: p.x + (seat ? 0 : 0.5), z: p.z + 0.55, r: 1.25, far: 3, mark: p.name, keep: true, label: `${p.name} — 들어서 옮긴다`, fn: () => furnLift(p) });
  if (seat) add({ x: p.x + 1, z: p.z + 0.55, r: 1.25, far: 3, mark: '의자', keep: true, talk: true, label: `${p.name}에 앉는다`, fn: () => seatOn(p) });
}
function furnUninsp(p){ for (const o of p._insp || []){ const i = G.inspect.indexOf(o); if (i >= 0) G.inspect.splice(i, 1); } p._insp = []; }
function furnLift(p){
  const pl = G.player; if (PRO.carry) return popText(pl.x, pl.y + 2, pl.z, '손이 비어야 든다', 'miss', 1);
  if (pl.seatP) standUp(pl);
  const m = G.map, d = DROP_TABLE.find(x => x.k === p.k) || { k: p.k, name: p.name, type: 'furn', h: p.h };
  if (p._b) G.scene.remove(p._b.g); if (p._l) G.scene.remove(p._l);
  m.solid[p.z * m.w + p.x] = 0; m.solid[p.z * m.w + p.x + 1] = 0; m.nav = {};
  PRO.placed = PRO.placed.filter(o => o !== p); furnUninsp(p);
  const bb = bill(PA + d.k + '.webp', pl.x, pl.z, d.h, { fit: 1.0, tint: 0.95 }), it = addLoose(d, bb, pl.x, pl.z); pickUp(it, pl);
  SFX.thump(110, 0.25, 0.15); guide('놓을 자리에서 <em>E</em> (빈 두 칸) · <em>G</em> 잠깐 내려놓기', 4);
}
function seatOn(p){
  const pl = G.player; if (PRO.carry) return popText(pl.x, pl.y + 2, pl.z, '들고는 못 앉는다', 'miss', 1);
  pl.seatP = p; pl.seatBack = { x: pl.x, z: pl.z }; pl.x = p.x + 0.55; pl.z = p.z + 0.32; pl.lift = 0.12; pl.poseHold = 'seat'; pl.face = -1;
  popText(pl.x, pl.y + 2, pl.z, '앉았다 — 움직이면 일어남', 'heal', 1.2);
}
function standUp(pl){
  const p = pl.seatP; pl.seatP = null; if (pl.poseHold === 'seat') pl.poseHold = null; pl.lift = 0;
  const b = pl.seatBack || { x: p.x + 1, z: p.z + 1 }; if (!solidAt(G.map, b.x, b.z)){ pl.x = b.x; pl.z = b.z; } else { pl.x = p.x + 0.5; pl.z = p.z + 1; }
}
if (typeof placeProp === 'function'){ const _placePropQ = placeProp; placeProp = function(p){ _placePropQ(p); furnInsp(p); }; }
if (typeof breakProp === 'function'){ const _breakPropQ = breakProp; breakProp = function(p){ furnUninsp(p); if (G.player && G.player.seatP === p) standUp(G.player); return _breakPropQ(p); }; }
// 앉은 동안: 움직이면 일어남 · 천천히 숨을 고름 (체력 회복). N 바로 먹기
{ const _playerUpdateQ = playerUpdate;
  playerUpdate = function(u, dt){
    if (hit('KeyN')) quickEat();
    if (u.seatP){
      if (inputDir() || hit('Space') || hit('KeyQ') || G.mode !== 'cave' || u.downed) standUp(u);
      else { u.hp = Math.min(u.max, u.hp + u.max * 0.006 * dt); u.lift = 0.12; }
    }
    return _playerUpdateQ(u, dt);
  }; }

/* ---------- v1.2 대련 더미: E로 근접 공격 켜고 끄기 (피해 0 — 막기 · 튕겨내기 · 숙이기 연습) ---------- */
if (typeof sparSpawn === 'function'){
  const _sparSpawnQ = sparSpawn;
  sparSpawn = function(){
    const u = _sparSpawnQ();
    G.inspect.push({ unit: u, r: 1.6, talk: true, get label(){ return `대련 더미 — 근접 공격 ${RPG.meta.sparMelee ? '끄기' : '켜기'}`; },
      fn: () => { RPG.meta.sparMelee = !RPG.meta.sparMelee; popText(u.x, u.y + 1.8, u.z, RPG.meta.sparMelee ? '근접 공격 켬 — 붉은 예고를 보고 막거나 피하기' : '근접 공격 끔', 'aim', 1.6); typeof saveRpg === 'function' && saveRpg(); } });
    return u;
  };
}
if (typeof sparThink === 'function'){
  const _sparThinkQ = sparThink;
  sparThink = function(u, dt){
    if (u.st === 'windup') return;   // 예고 중
    if (u.st === 'strike'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
    const pl = G.player;
    if (RPG.meta.sparMelee && pl && !pl.downed && !u.lock && !u.lying && u.st !== 'hurt' && dist(u, pl) < 1.8){
      u.meleeCd = (u.meleeCd ?? 0.8) - dt;
      if (u.meleeCd <= 0){
        u.meleeCd = rnd(1.4, 2.2); setAim(u, pl.x, pl.z); const z = ['high', 'mid', 'low'][Math.floor(Math.random() * 3)], Z = typeof ZONE !== 'undefined' ? ZONE[z] : { c: RED, mark: '', cls: '' };
        windup(u, 'sector', { x: u.x, z: u.z, r: 1.7, a: u.aim, arc: 1.5, windup: 0.55 }, t => { const hp0 = t.hp; hurt(u, t, 1, { from: u, noCrit: true, zone: z, kb: 0.3 }); t.hp = hp0; }, Z.c);   // v1.3 하 · 중 · 상단 연습
        popText(u.x, u.y + 1.9, u.z, Z.mark, 'zone ' + Z.cls, 0.6);
        return;
      }
    }
    return _sparThinkQ(u, dt);
  };
}

/* ---------- v1.2 쥐 기사 순찰: 적으로는 안 나옴 (포렌의 소환수). 가끔 쥐들을 데리고 굴을 한 바퀴 돌고 감 ---------- */
SPR.ratV = { h0: 51, tall: 0.3, poses: { idle: { src: 'art/enc/rat.webp', w: 63, h: 51, ax: 31, ay: 50, f: -1 } } };
DEFS.ratKnightV = { spr: 'ratKnight', name: '쥐 기사', hp: 80, atk: 0, spd: 1.5, r: 0.3, weight: 50, wander: ratWander };
DEFS.ratV = { spr: 'ratV', name: '쥐', hp: 10, atk: 0, spd: 2.2, r: 0.16, weight: 3, wander: ratWander };
const RATS = { list: [] };
function ratPatrol(){
  for (const u of RATS.list) if (G.units.includes(u)) removeUnit(u);
  RATS.list = []; if (G.mode !== 'cave' || !PRO.day || PRO.day < 2 || Math.random() > 0.3) return;
  const at = [[4, 10], [5, 10.5], [4.5, 11], [3.5, 10.6]].filter(([x, z]) => !solidAt(G.map, x, z));
  if (!at.length) return;
  const k = spawn('ratKnightV', at[0][0], at[0][1], 'neutral'); RATS.list.push(k);
  for (let i = 1; i < Math.min(at.length, 1 + 2 + Math.floor(Math.random() * 2)); i++){ const r = spawn('ratV', at[i][0], at[i][1], 'neutral'); r.lead = k; r.tag && r.tag.remove(); r.tag = null; RATS.list.push(r); }
  G.inspect.push({ unit: k, r: 1.4, talk: true, label: '쥐 기사에게 말을 건다', fn: () => vnTalk('쥐 기사', [['(꾸벅) …포렌 님의 명으로 순찰 중입니다.'], ['찍. 찍찍. (쥐들이 따라 운다)'], ['이 굴은 조용하네요. 좋은 곳입니다.']][Math.floor(Math.random() * 3)], { face: 'art/foe/ratKnight_idle.webp' }) });
  setTimeout(() => G.mode === 'cave' && guide('<em>쥐 기사</em>가 쥐들을 데리고 굴을 돌고 있다', 5), 4200);
}
function ratWander(u, dt){
  if (u.lead){   // 쥐: 기사 뒤를 졸졸
    const L = u.lead, i = RATS.list.indexOf(u), bx = L.x - Math.cos(L.aim || 0) * (0.5 + i * 0.35), bz = L.z - Math.sin(L.aim || 0) * (0.5 + i * 0.35);
    if (Math.hypot(bx - u.x, bz - u.z) > 0.25) steerTo(u, bx, bz, u.spd, dt); else u.moving = false; return;
  }
  u.wT = (u.wT ?? 0) - dt;
  if (!u.wTo || u.wT <= 0 || Math.hypot(u.wTo.x - u.x, u.wTo.z - u.z) < 0.4){
    u.wT = rnd(5, 9); for (let k = 0; k < 8; k++){ const x = rnd(3, 15), z = rnd(5, 14); if (!solidAt(G.map, x, z)){ u.wTo = { x, z }; break; } }
  }
  if (u.wTo && u.wT < 7.5) navTo(u, u.wTo.x, u.wTo.z, u.spd, dt, 0.4); else u.moving = false;
}
