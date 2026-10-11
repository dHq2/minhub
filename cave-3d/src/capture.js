/* capture.js v1.1 — (v1.1, v0.89: 초반 낙하 한 번은 청광묵 · 카리우스 중 하나 (다른 세계선 동료 · canon.js) · 레베카를 안 꺼내도 옴) (v1.0, v0.89) 포획 · 동행 · 굴 식구 (민수 · ROGUELIKE_PLAN.md 2.3)
   ■ 떠도는 인물: 2 · 3 · 4기 인물이 원정 층의 싸움 방에 가끔 홀로 섞여 나옴 (이름표 '떠도는 자')
     · 1층 20% → 층마다 +6% (최대 60%) · 사냥의 길이면 둘 · 층이 깊을수록 별 높은 인물
   ■ 제압: 떠도는 인물은 쓰러져도 죽지 않고 무릎 꿇음 → 다가가 E '묶는다' → 포로가 되어 원정대를 따라옴 (싸우지 않음)
     · 포로가 맞아 쓰러지면 놓침 (그 인물은 다시 안 나옴) · 층을 내려가도 따라옴
     · 굴로 살아서 돌아오면 굴 식구 (영구 동료) — 원정 준비 창에서 고름. 전멸하면 놓침
   ■ 이벤트로도 (rogue.js): 나그네 '함께 가자' · 쓰러진 낙하자 '데려간다' → 같은 식으로 따라옴 (동행 · 부상자)
   ■ 낙하 동료 (민수: 아주 드물게): 초반 한 번 (셋째 날 아침) · 그 뒤로는 하루 2%
   ■ 굴 식구는 굴에 머묾 (말을 걸 수 있음) · 영웅 틀은 HERO_DEF['x_' + slug] (유닛 h2_slug · 얼굴은 2기 얼굴 묶음에서 잘라 씀) */
'use strict';
const CAP = { pool: null, faces: {}, atlas: null, day: -1 };
const CAP_SKIP = new Set(['poren', 'ratknight', 'ratvet', 'ratsmall', 'pearl', 'pearlgak', 'tehera', 'mstar']);
function capPool(){
  if (CAP.pool) return CAP.pool;
  CAP.pool = H2.list.filter(s => { const o = H2R[s], K = H2K[s] || {}; return o && DEFS['h2_' + s] && DEFS['h2e_' + s] && !K.boss && !H2NOMIX.has(s) && (o.gen || 2) >= 2 && !CAP_SKIP.has(s); });
  return CAP.pool;
}
const capStar = s => parseInt((/([1-5])성/.exec((H2R[s] || {}).rank || '') || [])[1] || '2', 10);
const capName = s => (DEFS['h2_' + s] || {}).name || s;
function capPickSlug(F){
  const crew = new Set(RPG.meta.crew || []), lost = new Set(RPG.meta.capLost || []), seen = new Set((EXP && EXP.capSeen) || []);
  const L = capPool().filter(s => !crew.has(s) && !lost.has(s) && !seen.has(s)); if (!L.length) return null;
  const want = Math.min(5, 1 + Math.floor((F - 1) / 2)), near = L.filter(s => Math.abs(capStar(s) - want) <= 1), P = near.length ? near : L;
  const s = P[Math.floor(Math.random() * P.length)];
  if (EXP) EXP.capSeen = (EXP.capSeen || []).concat(s);
  return s;
}
// 이름표
function capTag(u, text, cls = 'ntag'){ if (!u.tag){ u.tag = document.createElement('div'); UI.layer.appendChild(u.tag); } u.tag.className = cls; u.tag.textContent = text; u.tagEl = true; }

/* ---------- 영웅 틀 (굴 식구) ---------- */
function capEnsureHero(slug){
  const k = 'x_' + slug; if (HERO_DEF[k]) return k;
  if (!DEFS['h2_' + slug]) return null;
  const K = H2K[slug] || {};
  HERO_DEF[k] = { name: capName(slug), unit: 'h2_' + slug, face: CAP.faces[slug] || '', h2: slug, crew: true, attr: { str: 5, dex: 5, vit: 5, wil: 5, per: 5 },
    note: `굴 식구 (${(H2R[slug] || {}).rank || ''}).${K.pas ? ` ${K.pas[0]} — ${K.pas[1]}` : ''}` };
  capFace(slug);
  return k;
}
// 얼굴: 2기 얼굴 묶음 (H2A.faces) 에서 한 칸을 잘라 그림 주소로
function capFace(slug){
  if (CAP.faces[slug]) return;
  const F = typeof H2A !== 'undefined' && H2A.faces, i = F && F.i[slug]; if (i == null) return;
  const cut = im => { const c = document.createElement('canvas'); c.width = c.height = F.cell; c.getContext('2d').drawImage(im, (i % F.cols) * F.cell, Math.floor(i / F.cols) * F.cell, F.cell, F.cell, 0, 0, F.cell, F.cell);
    try { CAP.faces[slug] = c.toDataURL('image/webp', 0.9); if (HERO_DEF['x_' + slug]) HERO_DEF['x_' + slug].face = CAP.faces[slug]; } catch (e) {} };
  if (CAP.atlas && CAP.atlas.complete && CAP.atlas.naturalWidth) return cut(CAP.atlas);
  if (!CAP.atlas){ CAP.atlas = new Image(); CAP.atlas.crossOrigin = 'anonymous'; CAP.atlas.src = F.src; }
  CAP.atlas.addEventListener('load', () => cut(CAP.atlas), { once: true });
}
const capCrew = () => (RPG.meta.crew || []).map(s => capEnsureHero(s)).filter(k => k && RPG.heroes[k] && RPG.heroes[k].st !== 'dead');
{ const _heroCap = hero; hero = function(key){ if (!HERO_DEF[key] && String(key).startsWith('x_')) capEnsureHero(String(key).slice(2)); return _heroCap.apply(this, arguments); }; }
{ const _lrCap = loadRpg; loadRpg = function(){ const r = _lrCap.apply(this, arguments); for (const s of RPG.meta.crew || []) capEnsureHero(s); return r; }; }
function capJoinCrew(slug, how){
  const k = capEnsureHero(slug); if (!k) return;
  RPG.meta.crew = RPG.meta.crew || []; if (!RPG.meta.crew.includes(slug)) RPG.meta.crew.push(slug);
  const h = hero(k); h.st = 'ok'; h.hp = null; h.joined = PRO.day; h.how = how;
  if (typeof saveRpg === 'function') saveRpg();
}

/* ---------- 떠도는 인물 · 제압 · 묶기 ---------- */
function capSpawnWanderers(){
  if (!EXP || G.mode !== 'exp') return;
  const F = EXP.F, hunt = EXP.route && EXP.route.F === F && EXP.route.k === 'hunt';
  const n = hunt ? 2 : Math.random() < Math.min(0.6, 0.2 + 0.06 * (F - 1)) ? 1 : 0;
  const cl = new Set(EXP.cleared || []), rooms = (DUN.rooms || []).filter(r => (r.type === 'fight' || r.type === 'elite') && !cl.has(r.id));
  for (let i = 0; i < n && rooms.length; i++){
    const r = rooms.splice(Math.floor(Math.random() * rooms.length), 1)[0], s = capPickSlug(F); if (!s) break;
    const T = roomTiles(r, 2), p = T.length ? T[Math.floor(Math.random() * T.length)] : { x: Math.round(r.cx), z: Math.round(r.cz) };
    const e = spawnFoe('h2e_' + s, p.x, p.z, F, 'r' + r.id, false);
    e.capturable = true; e.capSlug = s; capTag(e, `${e.D.name} · 떠도는 자`, 'ntag enemy elite');
  }
}
function capSubdue(u, by){
  u.subdued = true; u.hp = Math.max(1, Math.round(u.max * 0.05)); interrupt(u);
  u.side = 'neutral'; u.alert = false; u.lock = 'subdued'; u.downed = true; u.st = 'down'; u.moving = false;
  capTag(u, `${u.D.name} · 제압됨`, 'ntag');
  popText(u.x, u.y + 1.7, u.z, '제압!', 'crit', 1.6); dust(u.x, u.z, 10); camShake(0.15, 0.2);
  if (EXP){ EXP.kills++; gainXp(u.xp || 30, 'kill'); }
  G.inspect.push({ unit: u, r: 1.7, mark: '제압됨', far: 9, get used(){ return !!u.captive || u.dead || !G.units.includes(u); }, set used(v){}, label: `묶는다 — ${u.D.name}`, fn: () => capBind(u, '포로') });
  if (!RPG.meta.capHelp){ RPG.meta.capHelp = 1; setTimeout(() => guide(`<em>${u.D.name}</em>이(가) 무릎 꿇었다 · 다가가 <em>E</em> 로 묶으면 데려갈 수 있다`, 7), 600); }
}
{ const _killCap = kill; kill = function(u, by){ if (u && u.capturable && !u.subdued && !u.captive && u.side === 'enemy'){ capSubdue(u, by); return; } return _killCap.apply(this, arguments); }; }
// 포로 · 동행 · 부상자: 원정대 뒤를 따라옴 (싸우지 않음, 맞으면 쓰러져 놓침)
function capBind(u, kind){
  if (!u || u.captive) return;
  Object.assign(u, { captive: kind, subdued: false, downed: false, side: 'ally', lock: 'captive', st: 'idle', alert: false });
  u.hp = Math.max(u.hp, Math.round(u.max * (kind === '부상자' ? 0.25 : 0.35)));
  capTag(u, `⛓ ${u.D.name} · ${kind}`, 'ntag');
  EXP.captives = (EXP.captives || []).filter(c => c.slug !== u.capSlug).concat({ slug: u.capSlug, kind, hpf: u.hp / u.max });
  caption(`${u.D.name} — ${kind}`, '굴까지 살아서 데려가면 굴 식구가 된다 · 맞아 쓰러지면 놓친다');
}
// 이벤트 (rogue.js): 서 있는 · 누운 인물을 보여 주기만 (중립)
function capShowNpc(slug, x, z, how){
  const u = spawn('h2_' + slug, x, z, 'neutral'); u.capSlug = slug; u.lock = 'npc'; u.face = -1;
  if (how === 'down'){ u.downed = true; u.st = 'down'; }
  capTag(u, u.D.name, 'ntag'); return u;
}
function capJoinWalk(slug, u, kind){
  if (!slug) return;
  if (!u || u.dead || !G.units.includes(u)){ const pl = G.player; u = spawn('h2_' + slug, pl.x + 1, pl.z + 1, 'ally'); }
  u.capSlug = slug; capBind(u, kind);
  say(u, kind === '부상자' ? '…고마워' : '…같이 가지', '', 2.2);
}
TICKS.push(dt => {
  if (G.mode !== 'exp' || !EXP) return;
  const pl = G.player; if (!pl) return;
  let i = 0;
  for (const u of G.units){
    if (!u.captive || u.dead) continue;
    if (u.downed || u.hp <= 0){   // 놓침
      u.dead = true; u.st = 'dead'; popText(u.x, u.y + 1.6, u.z, `${u.D.name}를 놓쳤다`, 'hurt big', 2);
      caption(`${u.D.name}를 놓쳤다`, '다시는 볼 수 없을 것이다');
      RPG.meta.capLost = (RPG.meta.capLost || []).concat(u.capSlug); EXP.captives = (EXP.captives || []).filter(c => c.slug !== u.capSlug);
      if (u.tag){ u.tag.remove(); u.tag = null; } setTimeout(() => fadeOut(u), 1200); continue;
    }
    const c = (EXP.captives || []).find(c => c.slug === u.capSlug); if (c) c.hpf = u.hp / u.max;
    const a = (pl.aim ?? 0) + Math.PI + (i++ % 2 ? 0.6 : -0.6), tx = pl.x + Math.cos(a) * 2.2, tz = pl.z + Math.sin(a) * 2.2;
    if (Math.hypot(u.x - pl.x, u.z - pl.z) > 2.6){ navTo(u, tx, tz, (u.spd || 3) * 0.95, dt, 0.6); u.moving = true; } else u.moving = false;
  }
});
// 층이 바뀌면: 떠도는 인물을 깔고, 포로 · 동행을 원정대 곁에 다시 세움
{ const _elfCap = expLoadFloor; expLoadFloor = async function(F, how){
    const r = await _elfCap.apply(this, arguments);
    if (EXP && G.mode === 'exp'){
      capSpawnWanderers();
      const pl = G.player;
      for (const c of EXP.captives || []){ if (!DEFS['h2_' + c.slug]) continue; const u = spawn('h2_' + c.slug, pl.x + rnd(-1.2, 1.2), pl.z + rnd(0.8, 1.6), 'ally'); u.capSlug = c.slug; u.hp = Math.max(1, Math.round(u.max * (c.hpf || 0.3)));
        Object.assign(u, { captive: c.kind, side: 'ally', lock: 'captive' }); capTag(u, `⛓ ${u.D.name} · ${c.kind}`, 'ntag'); }
    }
    return r;
  }; }
// 굴로 돌아오면: 살아 있는 포로 · 동행은 굴 식구. 전멸하면 놓침
{ const _e2cCap = expToCave; expToCave = function(sum){
    const C = (EXP && EXP.captives) || [], won = sum && sum.kind === 'return';
    const r = _e2cCap.apply(this, arguments);
    if (C.length){
      if (won){ for (const c of C) capJoinCrew(c.slug, c.kind); setTimeout(() => caption(`${C.map(c => capName(c.slug)).join(' · ')} — 굴 식구가 되었다`, '원정 준비 창에서 데려갈 수 있다'), 3200); }
      else { RPG.meta.capLost = (RPG.meta.capLost || []).concat(C.map(c => c.slug)); setTimeout(() => caption(`${C.map(c => capName(c.slug)).join(' · ')}를 놓쳤다`, '아래에 남겨졌다'), 3200); }
      if (typeof saveRpg === 'function') saveRpg();
    }
    return r;
  }; }

/* ---------- 굴: 식구가 머묾 · 낙하 동료 ---------- */
const CAP_SPOT = [[5, 11], [6.5, 13], [11, 12.5], [12.5, 6.5], [4.5, 8], [7.5, 9.5], [10, 9], [6, 6.5], [13, 14], [3.5, 13.5]];
const CAP_FIRST = [   // 첫날 반응 (민수: 살아온 삶에 따라)
  ['(눈이 휘둥그레진다)', '…여긴 어디지.', '(그러고는 금방 조용히 구석으로 가 앉아, 굴을 하나하나 살핀다)'],
  ['(식은땀을 흘리며 주위를 둘러본다)', '자, 잠깐. 떨어졌다고? 위에서?', '…알았어. 뭘 하면 되지? 뭐든 도울게.'],
  ['(한참을 말없이 울기만 한다)', '…집에 갈 수 있어?', '(대답이 없자, 다시 고개를 묻는다)'],
  ['(일어나 먼지를 털고, 당신들을 하나씩 훑어본다)', '…대장은 누구지?', '좋아. 일단 따르지.'],
];
const CAP_IDLE = ['…아직도 위가 안 보이네.', '여기 밥은 누가 해?', '…괜찮아. 익숙해지는 중이야.', '다음엔 나도 데려가.', '저 벽, 계속 파는 거야?'];
function capCaveResidents(){
  if (G.mode !== 'cave') return;
  const party = new Set(RPG.party || []), out = capCrew().filter(k => !(EXP && party.has(k)));
  let n = 0;
  for (const k of out){
    const s = k.slice(2), sp = CAP_SPOT.find(([x, z]) => !solidAt(G.map, x, z) && !G.units.some(u => Math.hypot(u.x - x, u.z - z) < 1.2)) || CAP_SPOT[n % CAP_SPOT.length]; n++;
    const u = spawn('h2_' + s, sp[0], sp[1], 'neutral'); u.lock = 'resident'; u.face = Math.random() < 0.5 ? 1 : -1; u.capSlug = s;
    G.inspect.push({ unit: u, r: 1.6, talk: true, label: `${u.D.name}에게 말을 건다`, fn: async () => { u.face = Math.sign(G.player.x - u.x) || u.face; await textbox(u.D.name, [CAP_IDLE[Math.floor(Math.random() * CAP_IDLE.length)]], { face: CAP.faces[s] }); } });
  }
}
{ const _scCap = startCave; startCave = async function(){ const r = await _scCap.apply(this, arguments); try { capCaveResidents(); } catch (e) {} return r; }; }
async function capFallCrew(first){
  const s = capPickSlug(first ? 1 : Math.max(1, RPG.depth || 1)); if (!s) return;
  const pl = G.player, x = Math.min(13, Math.max(4, pl.x + rnd(-2, 2))), z = Math.min(14, Math.max(5, pl.z + rnd(1, 3)));
  const u = spawn('h2_' + s, x, z, 'neutral'); u.lock = 'fallen'; u.downed = true; u.st = 'down'; u.capSlug = s;
  if (typeof fallUnit === 'function') fallUnit(u, 16, 0.2, 1.1, () => { camShake(0.35, 0.4); dust(u.x, u.z, 14); });
  caption('낙하다!', '누군가 떨어졌다');
  const f = CAP_FIRST[s.length % CAP_FIRST.length];
  G.inspect.push({ unit: u, r: 1.7, talk: true, once: true, label: `떨어진 자를 일으킨다`, fn: async () => {
    u.downed = false; u.st = 'idle'; u.face = Math.sign(pl.x - u.x) || 1;
    const i = await rgCard({ img: CA + 'U-007.webp', kicker: `${PRO.day}일째 · 낙하`, title: u.D.name, text: f.join('\n'), choices: [{ t: '굴에 들인다', sub: '굴 식구가 된다 — 원정 준비 창에서 데려갈 수 있다' }, { t: '내버려 둔다', sub: '스스로 어딘가로 떠난다' }] });
    if (i === 0){ capJoinCrew(s, '낙하'); u.lock = 'resident'; caption(`${u.D.name} — 굴 식구`, '낙하로 왔다'); }
    else { RPG.meta.capLost = (RPG.meta.capLost || []).concat(s); setTimeout(() => { fadeOut(u); u.dead = true; }, 800); }
  } });
}
// 아침마다: 셋째 날 아침에 한 번 (초반 1회) · 그 뒤로는 하루 2%
TICKS.push(() => {
  if (G.mode !== 'cave' || !PRO.cave || G.lock || G.paused || PRO.day === CAP.day) return;
  CAP.day = PRO.day;
  if (!RPG.meta.firstFall && PRO.day >= 3){ RPG.meta.firstFall = 1; setTimeout(() => (typeof wlFirstFall === 'function' && wlFirstFall()) || capFallCrew(true), 4000); }
  else if (RPG.meta.firstFall && PRO.day > (RPG.meta.lastFallDay || 0) && Math.random() < 0.02){ RPG.meta.lastFallDay = PRO.day; setTimeout(() => (typeof wlRareFall === 'function' && wlRareFall()) || capFallCrew(false), 6000); }
});
