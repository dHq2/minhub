/* qol.js v1.1 — 편의 · 굴 손님 (v1.1: 초상화 대화 vnTalk · Esc 일시정지 창)
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
  ['원정 · 굴', [['E', '살펴보기 · 줍기 · 대화'], ['I · C', '가방 · 장비 / 상태'], ['4 ~ 7', '소모품'], ['1 · 2 · 3', '동료 지시 (따라와 · 집중 · 자유)'], ['M', '큰 지도'], ['Z · C', '카메라 돌리기']]],
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
