/* canon.js v1.0 — (v0.89) 정사는 레베카의 이야기 (민수, 2026-10-11 · CORE_LORE.md v1.20)
   ■ 시작: 인주가 굴에 떨어짐 → (적뢰전 — 나중에 넣음) → 성해포를 두른 채 깨어남 · 석문은 이미 열려 있음 → 벽에서 "저기요!" (레베카)
     · 굴은 인주 혼자 + 벽 속 레베카. 레베카는 확정 등장 · 세 번 파면 꺼냄 (안 꺼내도 됨) → 다음 날부터 원정 동료
   ■ 청광묵 · 카리우스는 다른 세계선의 동료 (그런 세계선이 있을 뿐, 정사 아님): 처음엔 굴에 없음
     · 낙하: 초반 한 번 (셋째 날 아침) 은 둘 중 하나 · 그 뒤 드문 낙하 (하루 2%) 의 절반은 남은 한 명
     · 원정: '쓰러진 낙하자' 문 너머에 30% 로 둘 중 하나 → 일으켜 세우면 굴로 먼저 감 (굴 식구)
     · 내버려 두면 떠남 (다시 마주칠 수 있음)
   ■ RPG.meta.wl = { cheong: 들어온 날, karius: 들어온 날 }. 굴의 유닛은 늘 만들어 두되, 아직이면 숨김 (gone · away — 무덤 없음) */
'use strict';
const WL = { ids: ['cheong', 'karius'], key: { cheong: 'ch', karius: 'ka' }, unit: { cheong: 'cheongNpc', karius: 'karius' } };
const wlHere = id => !!(RPG.meta.wl && RPG.meta.wl[id]) && !(RPG.heroes[id] && RPG.heroes[id].st === 'dead');
const wlLeft = () => WL.ids.filter(id => !(RPG.meta.wl && RPG.meta.wl[id]));

/* ---------- 새 판: 성해포 · 석문 ---------- */
function canonStart(){
  PRO.jrDone = true; PRO.dig = 100; PRO.cursed = false;   // 적뢰전은 나중에 — 석문은 열려 있음
  RPG.meta.wl = RPG.meta.wl || {};
  const h = hero('inju');
  if (!h.eq.body || h.eq.body.id !== 'B-3'){ const it = makeItem('B-3', { q: 1, aff: [] }); if (it) h.eq.body = it; }
  RPG.meta.r6 = RPG.meta.r6 || []; if (!RPG.meta.r6.includes('B-3')) RPG.meta.r6.push('B-3');   // 6등급은 한 번만 — 원정에서 또 나오지 않게
  if (typeof saveRpg === 'function') saveRpg();
}

/* ---------- 굴: 아직 만나지 않은 동료는 숨김 · 들어오면 다시 보임 ---------- */
function wlAway(u){
  if (!u || u.gone) return;
  u.gone = true; u.away = true; u.dead = true; u.downed = false; u.lock = true; u.moving = false;
  if (u.group) u.group.visible = false; if (u.bar) u.bar.remove(); if (u.tag) u.tag.remove();
  G.inspect = G.inspect.filter(o => o.unit !== u);
}
function wlCave(ch, ka){ if (!wlHere('cheong')) wlAway(ch); if (!wlHere('karius')) wlAway(ka); }
function wlBack(u, x, z){
  if (!u || !u.away) return;
  Object.assign(u, { gone: false, away: false, dead: false, downed: false, lock: false, x, z, home: { x, z }, st: 'idle' });
  if (u.group){ u.group.visible = true; u.group.position.set(x, heightAt(G.map, x, z), z); }
  if (u.tag) UI.layer.appendChild(u.tag);
  const C = PRO.cave, T = C && C.talk && C.talk[u === C.ka ? 'ka' : 'ch'];
  if (T && !G.inspect.includes(T)) G.inspect.push(T);
}
function wlJoin(id, how, x, z){
  RPG.meta.wl = RPG.meta.wl || {}; RPG.meta.wl[id] = PRO.day || 1;
  const h = hero(id); h.st = 'ok'; h.hp = null; h.joined = PRO.day; h.how = how;
  const k = WL.key[id]; PRO.hpf[k] = 1; PRO.meal[k] = PRO.meal[k] || { fed: false, hd: 0 };
  const C = PRO.cave;
  if (G.mode === 'cave' && C && C[k]) wlBack(C[k], x ?? C[k].home.x, z ?? C[k].home.z);
  caption(`${h.name} — 굴 식구`, how === '낙하' ? '다른 곳에서 떨어져 왔다' : '굴로 먼저 가 있겠다고 한다');
  if (typeof saveRpg === 'function') saveRpg();
  if (typeof proSave === 'function' && G.mode === 'cave') proSave();
}

/* ---------- 첫 장면: 굴에 떨어짐 → 깨어남 → 벽에서 '저기요!' ---------- */
const REB_MEET = ['……아.', '사람이다. 진짜, 살아 있는 사람.', '……아, 실례했어요. 놀라셨죠? 저는 괜찮아요. 그냥 조금 끼어 있을 뿐이에요.',
  '혹시… 정말 혹시, 시간 괜찮으시면요. 저 좀 꺼내 주실 수 있을까요?', '저, 체력 좋아요. 그리고 강해요. 꽤 많이요.', '……어머, 머리만 내놓고 하기엔 좀 우스운 자기소개네요.'];
async function canonIntro(pl, B){
  PRO.caveIntro = true; G.lock = true; letterbox(true); dark(1, 0);
  if (PRO.cave) PRO.cave.zzzT = 90;   // 벽 속 혼잣말 풍선은 첫 장면이 끝난 뒤부터
  camSnapTo(pl.x, pl.z + 1); camWide(pl.x, pl.z + 0.8, ...lens(5.4, 6.6), 99);
  fallUnit(pl, 22, 1.0, 1.0, () => { pl.lying = true; SFX.boom(1.1); camShake(0.5, 0.4); flashScreen('#ffffff', 0.25); dust(pl.x, pl.z, 16); });
  await wait(0.4); dark(0.25, 1.2); SFX.whoosh(); await wait(0.9); SFX.whoosh();
  await wait(1.0); dark(1, 0.5); await wait(0.8);
  caption('낙하', '빛도 닿지 않는 구덩이');
  await wait(2.4);
  // (적뢰전 — 나중에 이 자리에 넣음 · 민수 2026-10-11)
  dark(0, 3.2); await wait(3.4);
  await textbox('', ['(몸에 성해포가 둘러져 있다)']);
  pl.lying = false; popText(pl.x, pl.y + 2, pl.z, '…', 'miss', 1.2); await wait(1.4);
  // 벽 속에서: 희미한 소리 → 꿈틀 → 마지막 힘을 짜내 "저기요!"
  const at = { x: B.x, y: 0.75, z: B.z };
  dust(B.x + 0.3, B.z, 6); SFX.clink(0.2); await wait(0.7); dust(B.x + 0.3, B.z, 5); SFX.clink(0.15); await wait(1.1);
  say(at, '(……)', 'zzz', 1.6); await wait(1.9);
  camWide(B.x + 0.8, B.z, ...lens(3.4, 4.6), 99);
  say(at, '저기요!', 'big', 2.2); camShake(0.08, 0.2); await wait(1.8);
  pl.face = Math.sign(B.x - pl.x) || -1;
  await textbox('레베카', REB_MEET, { face: PA + 'rebecca_face.webp' });
  CAM.wide = null; letterbox(false); G.lock = false; PRO.caveIntro = false; if (PRO.cave) PRO.cave.zzzT = 12;
  caption('굴', '떨어진 자들이 사는 곳');
  guide('<em>WASD</em> 움직이기 · <em>E</em> 살펴보기 — 벽 속 사람은 <em>세 번</em> 파면 꺼낼 수 있다 (안 꺼내도 된다) · 석문 너머로 <em>원정</em>', 9);
  if (typeof proSave === 'function') proSave();
}

/* ---------- 낙하: 다른 세계선 동료 ---------- */
const WL_MEET = {
  cheong: { text: ['(웅크린 채 이를 드러낸다. 킁킁, 냄새를 맡는다)', '…고기 냄새. …아니다. 사람이다.', '…청광묵, 배고프다. 여기 먹을 거 있나?'],
    sub: '굴 식구가 된다 — 단순 · 충직. 원정 준비 창에서 데려갈 수 있다' },
  karius: { text: ['(커다란 몸이 천천히 일어난다. 안경 너머로 당신을 내려다본다)', '(한참 동안, 서로를 노려본다)', '....떨어진 건가. 이번엔 이곳으로.', '적의는 없다. ....그렇다면야, 백지장도 맞들면 낫다.'],
    sub: '굴 식구가 된다 — 아주 강하다 (5성급). 원정 준비 창에서 데려갈 수 있다' },
};
async function wlFall(id){
  const C = PRO.cave, pl = G.player; if (!C || !pl) return;
  const x = Math.min(13, Math.max(4, pl.x + rnd(-2, 2))), z = Math.min(14, Math.max(5, pl.z + rnd(1, 3)));
  const u = spawn(WL.unit[id], x, z, 'neutral'); u.lock = 'fallen'; u.downed = true; u.st = 'down'; u.face = -1;
  if (typeof fallUnit === 'function') fallUnit(u, 16, 0.2, 1.1, () => { camShake(0.35, 0.4); dust(u.x, u.z, 14); SFX.boom(0.8); });
  caption('낙하다!', '누군가 떨어졌다');
  G.inspect.push({ unit: u, r: 1.7, talk: true, once: true, label: '떨어진 자를 살핀다', fn: async () => {
    u.downed = false; u.st = 'idle'; u.face = Math.sign(pl.x - u.x) || 1;
    const M = WL_MEET[id];
    const i = await rgCard({ img: CA + 'U-007.webp', kicker: `${PRO.day}일째 · 낙하`, title: HERO_DEF[id].name, text: M.text.join('\n'),
      choices: [{ t: '굴에 들인다', sub: M.sub }, { t: '내버려 둔다', sub: '스스로 어딘가로 떠난다 — 원정에서 다시 마주칠지도' }] });
    if (i === 0){ const ux = u.x, uz = u.z; removeUnit(u); wlJoin(id, '낙하', ux, uz); }
    else setTimeout(() => { fadeOut(u); u.dead = true; }, 800);
  } });
}
// capture.js 의 아침 낙하가 부름: 처음 한 번은 둘 중 하나 · 그 뒤엔 절반의 확률로 남은 한 명
function wlFirstFall(){ const L = wlLeft(); if (!L.length) return false; wlFall(L[Math.floor(Math.random() * L.length)]); return true; }
function wlRareFall(){ const L = wlLeft(); if (!L.length || Math.random() < 0.5) return false; wlFall(L[0]); return true; }

/* ---------- 원정: '쓰러진 낙하자' 문 너머에 (30%) ---------- */
const WL_EXP = {
  cheong: ['…끄응. …사람?', '…청광묵, 다쳤다. 근데 안 죽는다.', '(내민 손을 한참 보다가, 잡는다)', '…굴 있나? 청광묵, 거기 간다. 먼저 간다!'],
  karius: ['....쓰러져 있던 건 아니다. 생각 중이었다.', '굴이 있는 건가? ....그렇다면야, 거기서 기다리지.'],
};
{ const _fill = ENC_FILL.fallen;
  ENC_FILL.fallen = function(r){
    const L = wlLeft(); if (!L.length || Math.random() >= 0.3) return _fill.apply(this, arguments);
    const id = L[Math.floor(Math.random() * L.length)], p = encSpot(r);
    const u = spawn(WL.unit[id], p.x, p.z, 'neutral'); u.lock = 'npc'; u.downed = true; u.st = 'down'; u.face = -1;
    r.encData = { p, wl: id, u }; addSource(p.x, p.z, 3, 0xffc0a0, 0.5, 2);
  }; }
{ const _ch = RG_ENC.fallen.choices;
  RG_ENC.fallen.choices = function(E){
    const L = _ch.apply(this, arguments), d = (E && E.r && E.r.encData) || {}; if (!d.wl) return L;
    const nm = HERO_DEF[d.wl].name;
    L[0] = { t: '일으켜 세운다', sub: `${nm} — 굴로 먼저 가 있겠다고 한다 (굴 식구가 된다)`, fn: async () => {
      const u = d.u; if (u){ u.downed = false; u.st = 'idle'; u.face = Math.sign(G.player.x - u.x) || 1; }
      await textbox(nm, WL_EXP[d.wl], { face: HERO_DEF[d.wl].face });
      wlJoin(d.wl, '원정'); if (u) setTimeout(() => { fadeOut(u); u.dead = true; }, 600);
    } };
    return L;
  }; }
