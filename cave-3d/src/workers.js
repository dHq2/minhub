/* workers.js v1.0 — (v0.49) 굴 일꾼
   청광묵 · 도축과 요리 (알아서): 창고 끼니가 사람 수 × 2보다 적고 우리에 돼지가 있으면 하루 한 번
     우리로 가서 한 마리를 잡고 ("…미안하다 돼지.") → 모닥불로 (꺼져 있으면 손바닥 발화로 붙임 — 설정: 발화 E) → 굽고 → 창고에 구운 고기 넷 (끼니 8)
     우리 앞에서 E로 켜고 끔 (처음엔 켜짐)
   구출한 생존자 = 일꾼: 원정의 구출작전에서 살린 사람은 줄을 타고 굴로 올라와 삶 (RPG.meta.staff)
     · 굴을 돌아다니고, E로 말을 걸면 맡은 일이 바뀜: 재봉 (붕대) · 땔감 줍기 · 채집 (달팽이 먹이) · 요리 (절임) · 쉼
     · 밤마다 끼니 하나를 먹고 일한 것을 내놓음 (끼니가 없으면 굶어서 다음 날은 일 못 함) */
'use strict';
const COOKED = { k: 'd_I-043', name: '구운 고기', type: 'food', food: 2, h: 0.3 };
const STAFF_JOB = {
  sew:    { n: '재봉', d: '밤마다 붕대 하나', out: () => { storePut({ k: 'd_I-061', name: '붕대', type: 'supply', h: 0.28 }); return '붕대 +1'; } },
  scav:   { n: '땔감 줍기', d: '밤마다 땔감 15', out: () => { PRO.wood = Math.min(WOOD_MAX, (PRO.wood || 0) + 15); return '땔감 +15'; } },
  forage: { n: '채집', d: '밤마다 달팽이 먹이 2', out: () => { PRO.penFood = Math.min(PEN_MAX, (PRO.penFood || 0) + 2); if (typeof penGarden === 'function') penGarden(); return '달팽이 먹이 +2'; } },
  cook:   { n: '요리', d: '밤마다 절임 한 단지 (끼니 2)', out: () => { storePut({ k: 'd_H-788', name: '절임 단지', type: 'food', food: 2, h: 0.45 }); return '끼니 +2'; } },
  rest:   { n: '쉼', d: '쉰다 (끼니는 먹음)', out: () => null },
};
const JOB_ORDER = ['sew', 'scav', 'forage', 'cook', 'rest'];
const STAFF_PREF = { 'X-blackash-07': 'sew', 'X-blackash-10': 'scav', 'X-redclay-08': 'forage', 'X-beastsurv-03': 'cook' };
const STAFF_LINES = { 'X-blackash-07': ['붕대라도 지을게요. 수의보다는 낫죠.', '…여기 사람들은 아직 살아 있네요.'], 'X-blackash-10': ['형아! 나뭇가지 주워 왔어!', '(작은 짐승이 품에서 꼼지락거린다)'],
  'X-redclay-08': ['에구, 버섯은 이렇게 따는 거여.', '굶으면 귀신 된다니까.'], 'X-beastsurv-03': ['흠. 항아리에 절여 두면 오래 가지.', '아래로 내려가는 놈들 밥은 내가 챙기마.'] };
function storePut(d){ PRO.store.push(d); if (typeof pileAdd === 'function' && G.mode === 'cave') pileAdd(d, PRO.store.length - 1); }

/* ---------- 구출 → 굴 일꾼 ---------- */
if (typeof rescueDone === 'function'){
  const _rescueW = rescueDone;
  rescueDone = async function(u){
    const c = u.cap; const r = await _rescueW(u);
    if (c){ RPG.meta.staff = RPG.meta.staff || []; if (!RPG.meta.staff.some(s => s.k === c.k)){ RPG.meta.staff.push({ k: c.k, job: STAFF_PREF[c.k] || 'scav', hungry: false }); typeof uiToast === 'function' && uiToast(`<b>${c.name}</b> — 굴로 올라가 일꾼이 된다`, 'loot r2'); typeof saveRpg === 'function' && saveRpg(); } }
    return r;
  };
}
const STAFF = { units: [] };
function staffSpawn(){
  for (const u of STAFF.units) if (G.units.includes(u)) removeUnit(u); STAFF.units = [];
  if (G.mode !== 'cave' || typeof CAPTIVES === 'undefined') return;
  const spots = [[6.5, 10.5], [8, 11.5], [10.5, 10], [12, 11.5], [9, 9.5], [7.5, 9]];
  (RPG.meta.staff || []).forEach((s, n) => {
    const i = CAPTIVES.findIndex(c => c.k === s.k); if (i < 0) return;
    const key = 'staff' + i; if (!DEFS[key]) DEFS[key] = { ...DEFS['cap' + i], think: undefined, wander: staffWander, spd: 1.6 };
    const at = spots.find(([x, z]) => !solidAt(G.map, x, z) && !G.units.some(o => Math.hypot(o.x - x, o.z - z) < 0.9)) || spots[n % spots.length];
    const u = spawn(key, at[0], at[1], 'neutral'); u.staff = s; u.home = { x: at[0], z: at[1] }; STAFF.units.push(u);
    const c = CAPTIVES[i];
    G.inspect.push({ unit: u, r: 1.5, talk: true, get label(){ return `${c.name} — 일: ${STAFF_JOB[s.job].n} (E로 바꿈)`; }, fn: async () => {
      const L = STAFF_LINES[c.k] || ['…'];
      s.job = JOB_ORDER[(JOB_ORDER.indexOf(s.job) + 1) % JOB_ORDER.length];
      popText(u.x, u.y + bodyH(u) + 0.5, u.z, `일: ${STAFF_JOB[s.job].n} — ${STAFF_JOB[s.job].d}`, 'heal', 1.8);
      typeof saveRpg === 'function' && saveRpg();
      await (typeof vnTalk === 'function' ? vnTalk(c.name, [L[Math.floor(Math.random() * L.length)]], { face: 'art/npc/' + c.k + '.webp' }) : null);
    } });
  });
}
function staffWander(u, dt){
  u.wT = (u.wT ?? rnd(2, 5)) - dt;
  if (!u.wTo || u.wT <= 0){ u.wT = rnd(5, 10); for (let k = 0; k < 6; k++){ const x = u.home.x + rnd(-2.5, 2.5), z = u.home.z + rnd(-2, 2); if (!solidAt(G.map, x, z)){ u.wTo = { x, z }; break; } } }
  if (u.wTo && Math.hypot(u.wTo.x - u.x, u.wTo.z - u.z) > 0.4 && u.wT < 8) navTo(u, u.wTo.x, u.wTo.z, u.D.spd, dt, 0.3); else u.moving = false;
  u.chatT = (u.chatT ?? rnd(15, 30)) - dt; if (u.chatT <= 0){ u.chatT = rnd(30, 60); const L = STAFF_LINES[u.staff.k]; if (L) say(u, L[Math.floor(Math.random() * L.length)], 'soft', 2.2); }
}
// 밤: 끼니 하나 먹고 일한 것을 내놓음
function staffNight(){
  const news = [];
  for (const s of RPG.meta.staff || []){
    const c = (typeof CAPTIVES !== 'undefined' ? CAPTIVES : []).find(x => x.k === s.k); if (!c) continue;
    if (!s.hungry && s.job !== 'rest'){ const o = STAFF_JOB[s.job].out(); if (o) news.push(`${c.name}: ${o}`); }
    else if (s.hungry) news.push(`${c.name}: 굶어서 일을 못 했다`);
    s.hungry = !(typeof takeMeal === 'function' && takeMeal());
  }
  return news;
}
if (typeof endDay === 'function'){
  const _endDayW2 = endDay;
  endDay = async function(){
    const news = (RPG.meta.staff || []).length ? staffNight() : [];
    const r = await _endDayW2.apply(this, arguments);
    if (news.length && typeof uiToast === 'function') setTimeout(() => uiToast('일꾼 — ' + news.join(' · '), 'loot r2'), 1400);
    typeof saveRpg === 'function' && saveRpg();
    return r;
  };
}
if (typeof startCave === 'function'){
  const _startCaveW = startCave;
  startCave = async function(...a){ const r = await _startCaveW.apply(this, a); staffSpawn(); cookInsp(); return r; };
}

/* ---------- 청광묵: 도축 · 요리 (알아서) ---------- */
function mouths(){ return 3 + (PRO.rebOut ? 1 : 0) + (RPG.meta.staff || []).length; }
function cookInsp(){
  if (!PRO.pen) return;
  G.inspect.push({ x: PRO.pen.x0 - 1.1, z: PRO.pen.z1 + 0.6, r: 1.1, far: 3, mark: '도축', keep: true, get label(){ return `청광묵에게 도축 · 요리 맡기기: ${PRO.autoCook === false ? '꺼짐 → 켜기' : '켜짐 → 끄기'}`; },
    fn: () => { PRO.autoCook = PRO.autoCook === false; popText(G.player.x, G.player.y + 2.2, G.player.z, PRO.autoCook === false ? '도축 · 요리 맡기기 끔' : '청광묵이 알아서 도축 · 요리', 'heal', 1.4); } });
}
function cookWanted(){
  if (PRO.autoCook === false || PRO.cookDay === PRO.day || G.lobbyFight || G.lock) return false;
  if (typeof penPigs !== 'function' || !penPigs().length) return false;
  return meals() < mouths() * 2;
}
const _helperTickW = helperTick;
helperTick = function(h, dt){
  const Cv = PRO.cave;
  if (!h || !Cv || h !== Cv.ch) return _helperTickW(h, dt);
  let J = PRO.cookJob;
  if (!J){ h.cookChk = (h.cookChk ?? 4) - dt; if (h.cookChk > 0 || hBusy(h) || (h.job && h.job.it)) return _helperTickW(h, dt); h.cookChk = 8; if (!cookWanted()) return _helperTickW(h, dt); J = PRO.cookJob = { ph: 'pen', t: 0 }; say(h, '대장! 청광묵 고기 만든다!', 'soft', 2); }
  if (G.lobbyFight){ PRO.cookJob = null; return _helperTickW(h, dt); }
  const go = (x, z) => { if (Math.hypot(x - h.x, z - h.z) > 0.55){ navTo(h, x, z, 3.0, dt, 0.4); h.moving = true; return false; } h.moving = false; return true; };
  J.t += dt; if (J.t > 60){ PRO.cookJob = null; return; }   // 막히면 그만둠
  if (J.ph === 'pen'){ if (go(PRO.pen.x0 - 0.9, (PRO.pen.z0 + PRO.pen.z1) / 2)){ J.ph = 'kill'; J.k = 0; } return; }
  if (J.ph === 'kill'){
    J.k += dt; if (J.k < 1.2) return;
    const pig = penPigs()[0]; if (!pig){ PRO.cookJob = null; return; }
    say(h, '…미안하다 돼지.', 'soft', 2); spark(pig.x, 0.4, pig.z, 0x8a0a14, 20, 4); SFX.thump && SFX.thump(90, 0.4, 0.2);
    pig.pig.dead = true; pig.dead = true; removeUnit(pig); PRO.pigs = PRO.pigs.filter(u => u !== pig); PRO.pigData = PRO.pigData.filter(d => !d.dead);
    PRO.cookDay = PRO.day; J.ph = 'fire'; return;
  }
  if (J.ph === 'fire'){
    if (!go(FIRE.x + 1, FIRE.z)) return;
    if (!PRO.fireLit){ PRO.fireLit = true; popText(FIRE.x, 1.6, FIRE.z, '발화! (청광묵 손바닥)', 'crit', 1.4); spark(FIRE.x, 0.6, FIRE.z, 0xffb050, 18, 3); say(h, '청광묵 손 뜨겁다!', 'soft', 1.6); }
    J.ph = 'cook'; J.k = 0; popText(FIRE.x, 1.5, FIRE.z, '지글지글…', 'heal', 2.4); return;
  }
  if (J.ph === 'cook'){ J.k += dt; if (Math.random() < dt * 4){ spark(FIRE.x, 0.7, FIRE.z, 0xffd080, 4, 2); } if (J.k >= 3.5) J.ph = 'store'; return; }
  if (J.ph === 'store'){
    if (!go(STORE.cx + 1.4, STORE.cz + 0.5)) return;
    for (let i = 0; i < 4; i++) storePut({ ...COOKED });
    popText(STORE.cx, 1.6, STORE.cz, '구운 고기 +4 (끼니 8)', 'heal', 1.6); say(h, '대장! 고기 구웠다! 아우.. 맛있겠다!!', 'soft', 2.4);
    PRO.cookJob = null; h.restT = rnd(2, 4);
  }
};
