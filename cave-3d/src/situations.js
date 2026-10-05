/* situations.js v1.0 — 상황 방 (v0.31)
   · 진지전 (fort): 낮은 바위 벽 한 줄 + 두 칸 문. 앞에 검방패병 (방패벽), 뒤에 궁수. 맨 뒤 검은 깃발 — 뽑으면 사기 붕괴 (공격 · 속도 ↓, 몇은 달아남)
   · 포격전 (artillery): 방 끝의 대포 + 포수. 원정대 머리 위로 붉은 원 셋 (1.6초 뒤 떨어짐, 적도 맞음). 포수를 다 잡으면 느려지고, 대포를 부수면 끝
   · 구출작전 (rescue): 철창 안의 포로 + 지키는 놈들. 지키는 놈이 없을 때 E로 꺼냄 → 약한 동료로 따라옴. 귀환 줄까지 데려가면 보답
   · 각개전투 (ambush): 방에 들어서면 어둠 속에서 원정대 하나하나 곁에 적이 떨어짐. 모두 흩어져 제 몫을 싸움
   · 만남 (meet): 2층 — 적에게 둘러싸여 싸우는 GOOD WILL. 살아남게 도우면 말을 걸 수 있고, 원정대에 들어옴 */
'use strict';

/* ---------- 대포 ---------- */
SPR.cannon = { h0: 350, tall: 1.15, poses: { idle: { src: DA + 'H-084.webp', w: 360, h: 350, ax: 180, ay: 345, f: 1 } } };
DEFS.cannon = { spr: 'cannon', name: '대포', hp: 300, atk: 24, spd: 0, r: 0.62, weight: 5000, think: cannonThink };
Object.assign(FOE_XP, { cannon: 45 }); Object.assign(FOE_DEF, { cannon: 18 });
function cannonThink(u, dt){
  u.kx = u.kz = 0; u.moving = false;
  if (u.st === 'hurt'){ u.st = 'idle'; }
  if (!u.alert){
    u.scanT = (u.scanT || 0) - dt; if (u.scanT > 0) return; u.scanT = 0.3;
    const t = allies().find(a => dist(a, u) < 12 && sees(u, a)); if (t) alertGroup(u, t);
    return;
  }
  const crew = foes().filter(e => e.crew === u && dist(e, u) < 6).length;
  if (!crew && !u.saidCrew){ u.saidCrew = true; popText(u.x, u.y + 1.8, u.z, '포수가 없다 — 느려짐', 'miss', 1.3); }
  u.cd -= dt * (crew ? 1 : 0.4);
  if (u.cd > 0) return;
  const pool = allies().filter(a => dist(a, u) < 16); if (!pool.length){ u.cd = 1; return; }
  u.cd = rnd(4.6, 5.8);
  const tgt = pool[Math.floor(Math.random() * pool.length)];
  // 쏨: 포구 불꽃 · 연기 → 1.6초 뒤 원 셋에 떨어짐 (적도 맞음, 그 자리 연기)
  setAim(u, tgt.x, tgt.z); smoke(u.x, u.z, 4, 0.8, 0.9); spark(u.x, 1.0, u.z, 0xffb070, 12, 5); SFX.boom(0.45); camShake(0.12, 0.15);
  popText(u.x, u.y + 1.9, u.z, '포격!', 'alert', 0.8);
  for (let i = 0; i < 3; i++){
    const x = tgt.x + (i ? rnd(-2.2, 2.2) : rnd(-0.4, 0.4)), z = tgt.z + (i ? rnd(-2.2, 2.2) : rnd(-0.4, 0.4));
    if (solidAt(G.map, x, z)) continue;
    const dd = decal('circle', { x, z, r: 1.35, dur: 1.6 + i * 0.25, color: RED, hostile: true });
    dd.onDone = () => {
      for (const t of G.units) if (!t.dead && t !== u && t.side !== 'neutral' && inShape(dd, t) && (t.jy || 0) < 0.6){
        hurt(u, t, u.atk * (t.side === 'enemy' ? 0.6 : 1.15), { from: { x, z }, kb: 2.6, stun: 0.5, ranged: true });
        if (t.side === 'enemy' && t !== u) popText(t.x, t.y + 2, t.z, '아군 포격!', 'miss', 0.8);
      }
      camShake(0.3, 0.25); dust(x, z, 14); smoke(x, z, 5, 1.1, 1.2); ring(x, z, 0xffa060, 1.6, 0.3); SFX.boom(0.6);
      if (typeof bloodPool === 'function') bloodPool(x, z, 0.7, 4, 0x141010);   // 그을음
    };
  }
}

/* ---------- 포로 (구출작전) ---------- */
// 도감 인물 그림 (팩션 사람들) → 철창 안 포로. 이름 · 사연 · 고맙다는 말 · 보답
const CAPTIVES = [
  { k: 'X-blackash-07', name: '수의 짓는 이네', w: 196, h: 360, tall: 1.5, lines: ['…살아 있는 사람이네요.', '죽은 이들 옷을 지어 주던 사람이에요. 이번엔 제 차례인 줄 알았는데.'], thanks: '…빚을 졌어요. 이걸로 갚을게요.', give: 'relic', san: 15 },
  { k: 'X-blackash-10', name: '꼬마 토비', w: 125, h: 303, tall: 1.05, lines: ['(작은 짐승을 꼭 끌어안고 있다)', '…얘도 같이 가도 돼요?'], thanks: '형아… 고마워. 이거 주웠어. 반짝여.', give: 'gear', san: 20 },
  { k: 'X-redclay-08', name: '광주리 할멈 오숙', w: 204, h: 360, tall: 1.35, lines: ['에구, 늦었다 이것들아.', '광주리는 안 놔. 이 안에 먹을 게 있어.'], thanks: '자, 먹고 살아. 굶으면 귀신 된다.', give: 'food', san: 12 },
  { k: 'X-beastsurv-03', name: '수염 노인 바르크', w: 272, h: 359, tall: 1.45, lines: ['흠. 아래로 내려가는 놈들은 오랜만이군.', '항아리는 내 거다. 따라가 주지.'], thanks: '항아리에 금화를 모아 뒀지. 반 가져가라.', give: 'gold', san: 12 },
];
CAPTIVES.forEach((c, i) => {
  SPR['cap' + i] = { h0: c.h, tall: c.tall, poses: { idle: { src: 'art/npc/' + c.k + '.webp', w: c.w, h: c.h, ax: c.w / 2, ay: c.h - 2, f: 1 } } };
  DEFS['cap' + i] = { spr: 'cap' + i, name: c.name, hp: 70, atk: 0, spd: 2.9, r: 0.3, weight: 55, think: captiveThink };
});
function captiveThink(u, dt){
  if (u.downed || u.st === 'held') return;
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  const pl = G.player; if (!pl) return;
  // 적이 가까우면 인주 뒤로 숨음, 아니면 따라감
  const e = nearest(u, foes().filter(f => f.alert), 4);
  let tx = pl.x - Math.cos(pl.aim) * 1.4, tz = pl.z - Math.sin(pl.aim) * 1.4;
  if (e){ const n = norm(u.x - e.x, u.z - e.z); tx = u.x + n.x * 2; tz = u.z + n.z * 2; u.cowerT = (u.cowerT || 0) - dt; if (u.cowerT <= 0){ u.cowerT = rnd(3, 6); popText(u.x, u.y + bodyH(u) + 0.3, u.z, R2(['살려…!', '오지 마!', '(덜덜)', '…!']), 'whisper', 1); } }
  if (solidAt(G.map, tx, tz)){ tx = pl.x; tz = pl.z; }
  if (Math.hypot(tx - u.x, tz - u.z) > 0.6) navTo(u, tx, tz, u.spd * (e ? 1.3 : 1), dt, 0.4); else u.moving = false;
  // 귀환 줄에 닿음 → 구출
  if (EXP && EXP.rope && Math.hypot(u.x - EXP.rope.x, u.z - EXP.rope.z) < 1.8 && !u.saved){ u.saved = true; rescueDone(u); }
}
const R2 = a => a[Math.floor(Math.random() * a.length)];
async function rescueDone(u){
  const c = u.cap, F = EXP.F;
  popText(u.x, u.y + bodyH(u) + 0.5, u.z, '구출!', 'crit', 1.6); ring(u.x, u.z, 0xbfd8ff, 2, 0.6);
  await textbox(c.name, [c.thanks], { face: 'art/npc/' + c.k + '.webp' });
  if (c.give === 'relic') dropLootAt(u.x, u.z, rollItem(F, { type: 'relic', bonus: 0.35 }));
  else if (c.give === 'gear') dropLootAt(u.x, u.z, rollItem(F, { type: 'gear', bonus: 0.3, plus: 1 }));
  else if (c.give === 'food'){ for (let i = 0; i < 3; i++) dropLootAt(u.x, u.z, R2(['I-050', 'I-043', 'I-053'])); }
  else dropLootAt(u.x, u.z, { gold: Math.round((30 + Math.random() * 20) * F) });
  for (const a of allies()) if (a.hero) a.hero.san = Math.min(derive(a.hero).maxSan, (a.hero.san ?? 50) + c.san);
  gainXp(25 * F, 'rescue'); RPG.meta.rescued = (RPG.meta.rescued || 0) + 1;
  caption('구출작전 성공', `${c.name} — 줄을 타고 올라갔다 · 정신도 +${c.san}`);
  // 줄을 타고 올라감
  const y0 = u.y; u.side = 'neutral'; u.bar && u.bar.remove(); u.bar = null;
  for (let k = 0; k < 30; k++){ u.lift = (u.lift || 0) + 0.15; await wait(0.05); }
  u.dead = true; removeUnit(u);
}

/* ---------- 방 채우기 (fillRoom에서 부름) ---------- */
function sitFill(r, gen, tiles, edges, band, lights, deco){
  const R = gen.R, F = gen.F, D = gen.D;
  if (r.type === 'fort') return fortFill(r, gen, tiles, band, lights, deco);
  if (r.type === 'artillery'){
    // 대포는 시작에서 먼 쪽 벽에 붙임
    const far = farSide(r, gen), x = Math.round(r.cx), z = far > 0 ? r.z + r.h - 2 : r.z + 1;
    const cn = spawnFoe('cannon', x, z, F, band); cn.face = 1; cn.noTilt = true;
    const crewN = 2 + (F >= 6 ? 1 : 0);
    for (let i = 0; i < crewN; i++){ const e = spawnFoe(i === 0 && F >= 4 ? 'shieldman' : R.pick(['swordsman', 'spearman']), x + (i - (crewN - 1) / 2) * 1.3, z - far * 1.3, F, band); e.crew = cn; }
    spawnGroup(r, gen, tiles.filter(t => (t.z - r.cz) * far < 0), 1 + Math.floor(F / 4), band);
    addSource(x, z, 3.5, 0xff8040, 0.6, 1.2); lights(1); deco(2);
    DUN.marks.push({ x, z, icon: '✸', col: '#ff8a6a' });
    r.reward = true; return;
  }
  if (r.type === 'rescue'){
    const x = Math.round(r.cx), z = Math.round(r.cz), c = CAPTIVES[Math.floor(R() * CAPTIVES.length)];
    const cage = dbill(DA + 'H-412.webp', x, z, 1.9, { fit: 1.6, tint: 0.85 });
    const who = dbill('art/npc/' + c.k + '.webp', x, z + 0.02, c.tall * 0.95, { fit: 1.2, tint: 0.7 });
    G.map.solid[z * G.map.w + x] = 1;
    spawnGroup(r, gen, tiles.filter(t => Math.hypot(t.x - x, t.z - z) > 1.5), 2 + Math.floor(F / 2), band);
    const S = { done: false };
    G.inspect.push({ x, z, r: 1.7, mark: '철창', far: 8, get used(){ return S.done; }, set used(v){},
      get label(){ return guardsNear(x, z, band) ? `철창 — 지키는 놈이 있다 (${c.name})` : `철창을 연다 — ${c.name}`; },
      fn: async () => {
        if (guardsNear(x, z, band)){ popText(x, 2, z, '지키는 놈부터', 'miss', 0.9); return; }
        S.done = true; G.map.solid[z * G.map.w + x] = 0; G.scene.remove(who.g); cage.m.material.color.setScalar(0.45);
        SFX.burst({ type: 'bandpass', f: 500, f2: 1400, q: 3, gain: 0.3, dec: 0.4 }); dust(x, z, 8);
        await textbox(c.name, c.lines, { face: 'art/npc/' + c.k + '.webp' });
        const k = 'cap' + CAPTIVES.indexOf(c), u = spawn(k, x, z + 0.8, 'ally'); u.cap = c; u.captive = true;
        u.max = u.hp = Math.round(60 + F * 12);
        caption('구출작전', `${c.name}를 귀환 줄까지 데려가라 (↑)`);
        for (const m of DUN.marks) if (m.icon === '↑') m.known = true;
      } });
    DUN.marks.push({ x, z, icon: '☗', col: '#bfd8ff' });
    lights(1); deco(1); return;
  }
  if (r.type === 'ambush'){
    r.ambush = { done: false, n: Math.min(3, 1 + Math.floor(F / 3)) };
    deco(3 + Math.floor(R() * 2));   // 어둡고 조용한 방 (빛 없음)
    if (R() < 0.5){ const t = takeTile(tiles, R); if (t) corpseProp(t.x, t.z, R); }
    return;
  }
  if (r.type === 'meet'){
    if (F === 2 && !RPG.meta.gw) return meetGoodwill(r, gen, tiles, band, lights, deco);
    // 이미 만났으면 그냥 싸움 방
    spawnGroup(r, gen, tiles, Math.min(6, 2 + Math.floor((F + 1) / 2)), band); lights(1); deco(2); return;
  }
}
// 시작 방에서 먼 쪽: +1 (z가 큰 쪽) / -1
function farSide(r, gen){ return gen.start.cz <= r.cz ? 1 : -1; }
function guardsNear(x, z, band){ return foes().some(e => e.band === band && dist(e, { x, z }) < 6); }

/* ---------- 진지전 ---------- */
function fortFill(r, gen, tiles, band, lights, deco){
  const R = gen.R, F = gen.F, far = farSide(r, gen), wz = r.wallZ;
  const back = tiles.filter(t => (t.z - wz) * far > 1), front = tiles.filter(t => (t.z - wz) * far === 1);
  // 벽 바로 뒤에 검방패병 (방패벽), 맨 뒤에 궁수, 깃발
  const nShield = Math.min(front.length, 2 + Math.floor(F / 3));
  for (let i = 0; i < nShield; i++){ const t = takeTile(front, R); if (t){ const e = spawnFoe('shieldman', t.x, t.z, F, band); e.post = { x: t.x, z: t.z }; e.face = 1; } }
  const nArch = Math.min(back.length, 2 + Math.floor(F / 4));
  for (let i = 0; i < nArch; i++){ const t = takeTile(back, R); if (t){ const e = spawnFoe('archer', t.x, t.z, F, band); e.post = { x: t.x, z: t.z }; } }
  if (F >= 4){ const t = takeTile(back, R); if (t) spawnFoe(R.pick(['spearman', 'swordsman']), t.x, t.z, F, band); }
  // 깃발: 방 맨 뒤 가운데
  const fx = Math.round(r.cx), fz = far > 0 ? r.z + r.h - 2 : r.z + 1;
  const flag = dbill(DA + 'H-424.webp', fx, fz, 2.1, { fit: 1.4, tint: 0.95 }); dbill(DA + 'H-117.webp', fx + 1.2, fz, 1.6, { fit: 1, tint: 0.85 });
  addSource(fx, fz, 3.4, 0xff5040, 0.7, 1.8);
  const S = { done: false };
  G.inspect.push({ x: fx, z: fz, r: 1.6, mark: '적의 깃발', far: 12, get used(){ return S.done; }, set used(v){},
    get label(){ return guardsNear(fx, fz, band) && foes().some(e => e.band === band && dist(e, { x: fx, z: fz }) < 2.5) ? '깃발 — 곁에 적이 있다' : '깃발을 뽑는다 (사기 붕괴)'; },
    fn: async () => {
      if (foes().some(e => e.band === band && dist(e, { x: fx, z: fz }) < 2.5)){ popText(fx, 2, fz, '곁의 적부터', 'miss', 0.9); return; }
      const pl = G.player; G.lock = true;
      for (let k = 0; k < 3; k++){ pl.leanT = 0.3; SFX.thump(160, 0.3, 0.12); dust(fx, fz, 4); await wait(0.35); }
      G.lock = false; S.done = true; flag.g.rotation.z = 1.3; flag.m.material.color.setScalar(0.4);
      fortRout(band, r); dropLootAt(fx, fz, { gold: Math.round(20 * F) });
    } });
  DUN.marks.push({ x: fx, z: fz, icon: '⚑', col: '#ff6a5a' });
  r.reward = true; lights(2); deco(1);
}
function fortRout(band, r){
  caption('깃발을 뽑았다', '사기 붕괴 — 적이 흔들린다 (공격 · 속도 ↓, 몇은 달아남)');
  camShake(0.25, 0.3); SFX.thump(90, 0.6, 0.3);
  gainXp(15 * EXP.F, 'flag');
  for (const e of foes().filter(e => e.band === band)){
    e.atk = Math.round(e.atk * 0.7); e.spd *= 0.85; e.baseSpd = e.spd; e.wall = false; e.routed = true; e.alert = true;
    popText(e.x, e.y + bodyH(e) + 0.3, e.z, Math.random() < 0.5 ? '깃발이…!' : '물러서!', 'miss', 1);
    if (Math.random() < 0.35){ e.home = { x: e.x + rnd(-10, 10), z: e.z + rnd(-10, 10) }; e.alert = false; e.fleeT = G.t; }
  }
}

/* ---------- 각개전투 (매복): 방에 들어서면 ---------- */
function sitTick(dt){
  if (!EXP || !DUN.rooms) return;
  const pl = G.player; if (!pl) return;
  for (const r of DUN.rooms){
    if (!r.ambush || r.ambush.done) continue;
    if (pl.x < r.x + 1.2 || pl.x > r.x + r.w - 2.2 || pl.z < r.z + 1.2 || pl.z > r.z + r.h - 2.2) continue;
    r.ambush.done = true; ambushSpring(r);
  }
  // 포로 머리 위 표시: 줄 방향 안내
  for (const u of G.units) if (u.captive && !u.dead && !u.saved && u.downed){ u.downed = false; u.dead = true; u.fading = G.t; popText(u.x, u.y + 1.5, u.z, '…', 'hurt', 1.5); caption('구하지 못했다', u.cap.name); for (const a of allies()) if (a.hero) a.hero.san = Math.max(0, (a.hero.san ?? 50) - 10); }
}
async function ambushSpring(r){
  const F = EXP.F, gen = EXP.gen, band = 'amb' + r.id, D = gen.D;
  caption('매복!', '흩어졌다 — 각자 살아남아라');
  dark(0.85, 0.15); SFX.thump(70, 0.7, 0.4); camShake(0.3, 0.4);
  // 원정대를 흩음
  for (const a of allies()){ const ang = rnd(0, 6.28); a.kx += Math.cos(ang) * 7; a.kz += Math.sin(ang) * 7; if (a.hero) a.hero.san = Math.max(0, (a.hero.san ?? 50) - 5); }
  await wait(0.35); dark(0, 0.5);
  G.cmd = 'free';
  for (const a of allies()){
    for (let i = 0; i < r.ambush.n; i++){
      let x = a.x, z = a.z;
      for (let k = 0; k < 12; k++){ const ang = rnd(0, 6.28), L = rnd(1.8, 3); x = a.x + Math.cos(ang) * L; z = a.z + Math.sin(ang) * L; if (!solidAt(G.map, x, z)) break; x = a.x; z = a.z; }
      const e = spawnFoe(gen.R.wpick(D.foes), x, z, F, band); e.alert = true; e.seen = G.t; e.focusOn = a;
      smoke(x, z, 3, 0.7, 0.8); dust(x, z, 6);
    }
  }
}

/* ---------- 만남: GOOD WILL ---------- */
function meetGoodwill(r, gen, tiles, band, lights, deco){
  const F = gen.F, x = Math.round(r.cx), z = Math.round(r.cz);
  const h = hero('goodwill'); if (h.hp == null) h.hp = Math.round(derive(h).maxHp * 0.6);
  const u = spawn('goodwill', x, z, 'ally'); applyHero(u, h); u.guest = true;
  // 둘러싼 적: GOOD WILL과 싸우는 중
  const n = 4 + Math.floor(F / 2);
  for (let i = 0; i < n; i++){ const a = i / n * 6.28, ex = x + Math.cos(a) * 2.4, ez = z + Math.sin(a) * 2.4; if (solidAt(G.map, ex, ez)) continue;
    const e = spawnFoe(i === 0 ? 'brute' : gen.R.wpick(gen.D.foes), ex, ez, F, band); e.alert = true; e.seen = G.t; e.focusOn = u; }
  r.meet = { u, band, done: false }; EXP.meet = r.meet;
  addSource(x, z, 4, 0x9fe0ff, 0.6, 1.5); lights(1); deco(1);
  DUN.marks.push({ x, z, icon: '★', col: '#9fe0ff', known: true });
}
function meetTick(){
  const M = EXP && EXP.meet; if (!M || M.done) return;
  const u = M.u, pl = G.player;
  if (u.dead){ M.done = true; return; }
  // 아직 싸우는 중이면 GOOD WILL은 제자리에서 버팀 (원정대가 오기 전까지 쓰러지지 않게)
  const left = foes().filter(e => e.band === M.band);
  if (left.length && dist(u, pl) > 12){ u.hp = Math.max(u.hp, u.max * 0.25); return; }
  if (!left.length && dist(u, pl) < 4 && !G.lock && !M.talking){ M.talking = true; meetTalk(M); }
}
async function meetTalk(M){
  const u = M.u, face = HERO_DEF.goodwill.face;
  G.lock = true; letterbox(true); camFocus((u.x + G.player.x) / 2, (u.z + G.player.z) / 2, 99, 4.2, 6.5, 0.04);
  if (u.downed){ u.downed = false; u.st = 'idle'; u.hp = Math.round(u.max * 0.3); }
  await textbox('GOOD WILL', ['하하! 살았다! 고마워, 고마워!', '난 GOOD WILL. 이 아래로 뭐가 있는지 보러 왔지. 혼자는… 좀 많더라고.', '너네 원정대지? 좋아, 좋아! 같이 가자! 주먹이랑 번개는 내가 맡을게!'], { face });
  M.done = true; RPG.meta.gw = 1;
  if (!RPG.party.includes('goodwill')) RPG.party.push('goodwill');
  u.guest = false; syncHeroHp(u); saveRpg();
  ring(u.x, u.z, 0x9fe0ff, 2.4, 0.7); bolt(u.x + 0.4, u.z, false);
  camFocusOff(); letterbox(false); G.lock = false;
  caption('GOOD WILL이 원정대에 들어왔다', '잡기 · 무릎 · 내리꽂기 · 번개. 굴 준비 창에서 데려갈 수 있음');
}
