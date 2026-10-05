/* foes2.js v1.2 — (v1.2: 쥐 기사를 1 · 2층 적에서 뺌 — 포렌의 소환수로만) (v1.1: 보스가 깨어날 때 넓게 비추고 초상화 대사)  층마다 고유한 적 · 강적 · 보스 (그림: 도감 → tools/foe_art.py → art/foe · foe_sheets.js)
   층 구성 (dungeon.js FLOOR_DEF를 여기서 고쳐 씀)
   1 무덤 어귀 · 3 젖은 묘지: 강적 슬라임녀 · 5 세자르의 알현실: 보스 세자르 (계단 방의 관에서 일어남, 쓰러뜨려야 내려감)
   6 안개 늪: 검냥이 · 강적 보르마 · 7 도깨비 시장: 보광 · 광냥 · 강적 청승 · 작약 · 8 쇠의 진지: 흑기사 · 흑기사 방패병 · 창병 · 강적 도끼기사
   9 눈알의 굴: 눈깔괴물 · 푸른 뚱보 · 강적 장군님 · 10 대장군의 전장: 흑기사 군단 · 보스 대장군 (군단과 함께, 쓰러뜨리면 원정 끝 — 지름길)
   고유 기술 (붉은 예고 장판, 읽으면 피함): 덮치기 (검냥이) · 뛰어 내려찍기 (청승) · 북소리 (보광: 주변 적 강해짐) · 마력 폭발 (보르마) · 응시 (눈깔괴물: 정신도) · 짓누르기 (푸른 뚱보)
   세자르: 하늘 가르기 (긴 줄) · 마구 베기 (세 번) · 뒤로 빠져 찌르기 · 손을 들어 해골 검사를 부름 (체력 절반 아래)
   대장군: 함성 (모든 적 강해짐 · 아군 공포) · 돌격 (긴 줄) · 휩쓸기 · 증원 (흑기사) */
'use strict';
const FA = 'art/foe/';
// 시트 → 자세 (움직이면 fps, 공격은 한 번만)
function foeSheet(key, tall, f, o = {}){
  const T = FOE_SHEETS[key], idle = T.idle, poses = {};
  for (const [k, d] of Object.entries(T)){
    const once = k !== 'idle' && k !== 'walk' && k !== 'groove';
    poses[k] = { src: FA + d.file, w: d.w, h: d.h, cols: d.cols, rows: d.rows, n: d.cols * d.rows, from: 0, count: d.n, fps: once ? Math.max(8, d.n / 0.55) : 9, ax: d.ax, ay: d.ay, f, once };
  }
  if (!poses.windup) poses.windup = poses.idle;
  if (!poses.attack) poses.attack = poses.idle;
  if (!poses.hurt) poses.hurt = poses.idle;
  if (o.alias) for (const [a, b] of Object.entries(o.alias)) if (poses[b]) poses[a] = poses[b];
  return { h0: idle.h, tall, poses };
}
Object.assign(SPR, {
  ratKnight: foeSheet('ratKnight', 1.45, -1), slimeGirl: foeSheet('slimeGirl', 1.9, 1), catw: foeSheet('catw', 1.75, 1), borama: foeSheet('borama', 2.0, 1),
  bogwang: foeSheet('bogwang', 1.7, 1), gwangnyang: foeSheet('gwangnyang', 1.8, 1), cs: foeSheet('cs', 2.0, 1), jakyak: foeSheet('jakyak', 1.9, -1),
  bk: foeSheet('bk', 1.85, 1, { alias: { windup: 'idle' } }), bkShield: foeSheet('bkShield', 1.8, -1), bkSpear: foeSheet('bkSpear', 1.85, 1), axeKnight: foeSheet('axeKnight', 2.3, -1),
  eyemon: foeSheet('eyemon', 2.0, 1), bluefat: foeSheet('bluefat', 2.3, 1), janggun: foeSheet('janggun', 2.8, -1),
  cesar: foeSheet('cesar', 2.1, 1), general: foeSheet('general', 2.4, 1),
});
const M = (range, arc, windup, cd, mul = 1, kb = 0.8) => ({ range, arc, windup, cd, mul, kb });
Object.assign(DEFS, {
  ratKnight:  { spr: 'ratKnight', name: '쥐 기사', hp: 80, atk: 11, spd: 3.3, r: 0.32, weight: 50, line: { len: 2.5, w: 0.5, windup: 0.5, cd: 1.5, mul: 1, kb: 0.7 } },
  slimeGirl:  { spr: 'slimeGirl', name: '슬라임녀', hp: 360, atk: 20, spd: 1.8, r: 0.5, weight: 200, melee: M(1.9, 2.6, 0.7, 1.8, 1.1, 1.2) },
  catw:       { spr: 'catw', name: '검냥이', hp: 150, atk: 17, spd: 4.0, r: 0.36, weight: 70, melee: M(1.6, 1.8, 0.32, 1.0, 0.9, 0.5) },
  borama:     { spr: 'borama', name: '보르마', hp: 540, atk: 26, spd: 2.6, r: 0.42, weight: 90, bow: { range: 8, windup: 0.6, cd: 1.6, speed: 14 }, melee: M(1.7, 2.0, 0.5, 1.6, 1.1, 1.2) },
  bogwang:    { spr: 'bogwang', name: '보광', hp: 130, atk: 15, spd: 3.4, r: 0.32, weight: 55, melee: M(1.5, 1.8, 0.4, 1.2, 1, 0.6) },
  gwangnyang: { spr: 'gwangnyang', name: '광냥', hp: 160, atk: 18, spd: 3.8, r: 0.36, weight: 75, melee: M(1.7, 2.0, 0.38, 1.2, 1, 0.7) },
  cs:         { spr: 'cs', name: '청승', hp: 640, atk: 30, spd: 2.8, r: 0.45, weight: 160, armor: 0.75, melee: M(2.2, 2.2, 0.6, 1.8, 1.2, 1.6) },
  jakyak:     { spr: 'jakyak', name: '작약', hp: 560, atk: 28, spd: 3.1, r: 0.4, weight: 120, melee: M(2.0, 2.4, 0.55, 1.6, 1.15, 1.4), grab: { reach: 1.7, cd: 8, wind: 0.55 } },
  bk:         { spr: 'bk', name: '흑기사', hp: 200, atk: 20, spd: 2.9, r: 0.38, weight: 120, armor: 0.8, melee: M(1.9, 1.9, 0.5, 1.5, 1, 0.8) },
  bkShield:   { spr: 'bkShield', name: '흑기사 방패병', hp: 240, atk: 14, spd: 2.3, r: 0.4, weight: 150, block: 0.35, melee: M(1.4, 1.6, 0.45, 1.6, 1, 1.4) },
  bkSpear:    { spr: 'bkSpear', name: '흑기사 창병', hp: 190, atk: 18, spd: 2.6, r: 0.38, weight: 120, line: { len: 3.0, w: 0.6, windup: 0.6, cd: 1.7, mul: 1.1, kb: 1.0 } },
  axeKnight:  { spr: 'axeKnight', name: '도끼기사', hp: 760, atk: 34, spd: 2.4, r: 0.5, weight: 600, heavy: true, armor: 0.6, slam: { r: 2.3, windup: 0.85, cd: 2.2, mul: 1.1, kb: 2.4, stun: 0.9 } },
  eyemon:     { spr: 'eyemon', name: '눈깔괴물', hp: 150, atk: 18, spd: 2.2, r: 0.36, weight: 80, melee: M(1.8, 1.6, 0.6, 1.6, 1, 0.7) },
  bluefat:    { spr: 'bluefat', name: '푸른 뚱보', hp: 420, atk: 22, spd: 1.6, r: 0.6, weight: 700, heavy: true, slam: { r: 2.0, windup: 1.0, cd: 2.6, mul: 1, kb: 2.0, stun: 0.7 } },
  janggun:    { spr: 'janggun', name: '장군님', hp: 980, atk: 34, spd: 2.2, r: 0.7, weight: 1200, heavy: true, armor: 0.55, slam: { r: 2.6, windup: 0.95, cd: 2.4, mul: 1.2, kb: 2.6, stun: 1.0 }, grab: { reach: 2.0, cd: 7, wind: 0.6 } },
  cesar:      { spr: 'cesar', name: '세자르', hp: 1100, atk: 28, spd: 3.0, r: 0.45, weight: 400, boss: true, armor: 0.8, melee: M(2.1, 2.2, 0.5, 1.4, 1.1, 1.2), think: cesarThink },
  general:    { spr: 'general', name: '대장군', hp: 1400, atk: 30, spd: 2.6, r: 0.5, weight: 800, boss: true, armor: 0.7, line: { len: 3.4, w: 0.8, windup: 0.6, cd: 1.6, mul: 1.15, kb: 1.6 }, think: generalThink },
});
Object.assign(FOE_XP, { ratKnight: 9, slimeGirl: 90, catw: 22, borama: 120, bogwang: 20, gwangnyang: 24, cs: 140, jakyak: 130, bk: 30, bkShield: 32, bkSpear: 30, axeKnight: 170, eyemon: 26, bluefat: 60, janggun: 220, cesar: 400, general: 800 });
Object.assign(FOE_DEF, { ratKnight: 2, slimeGirl: 6, catw: 4, borama: 8, bogwang: 3, gwangnyang: 5, cs: 16, jakyak: 12, bk: 12, bkShield: 16, bkSpear: 10, axeKnight: 18, eyemon: 4, bluefat: 10, janggun: 20, cesar: 20, general: 22 });
// 층 구성 고쳐 씀
(() => {
  const set = (F, o) => Object.assign(FLOOR_DEF[F], o);
  set(1, { foes: { swordsman: 3, spearman: 3, shieldman: 2, foeJelly: 1 } });   // v1.2 쥐 기사는 적으로 안 나옴 (포렌의 소환수 · 굴 순찰은 qol.js)
  set(2, { foes: { archer: 3, shieldman: 3, spearman: 2, foeDevil: 1 } });
  set(3, { elite: ['slimeGirl', 'dandalo', 'brute'] });
  set(5, { boss: 'cesar' });
  set(6, { foes: { catw: 3, foeSlime: 2, foeFairy: 2, archer: 1 }, elite: ['borama', 'benkin'] });
  set(7, { foes: { bogwang: 3, gwangnyang: 3, foeDevil: 2, archer: 1 }, elite: ['cs', 'jakyak'] });
  set(8, { foes: { bk: 3, bkShield: 3, bkSpear: 3, archer: 2 }, elite: ['axeKnight', 'dandalo'] });
  set(9, { foes: { eyemon: 3, bluefat: 2, foeCultist: 2, foeDevil: 1 }, elite: ['janggun', 'benkin'] });
  set(10, { foes: { bk: 3, bkShield: 2, bkSpear: 2, swordsman: 2, archer: 2 }, elite: ['axeKnight', 'cs'], boss: 'general' });
})();
Object.assign(SIG, {
  catw: { cd: 5, fn: sigDash }, bk: { cd: 6, fn: sigDash }, bkShield: { cd: 5, fn: sigBash }, gwangnyang: { cd: 6, fn: sigSweep },
  cs: { cd: 6, fn: sigLeap }, jakyak: { cd: 6, fn: sigSweep }, bogwang: { cd: 9, fn: sigDrum }, borama: { cd: 7, fn: sigNova },
  eyemon: { cd: 8, fn: sigStare }, slimeGirl: { cd: 7, fn: sigAcid }, ratKnight: { cd: 7, fn: sigDash },
});
// 뛰어 내려찍기: 표적 자리에 원 → 0.8초 뒤 날아와 내려찍음
function sigLeap(u, tgt){
  const d = dist(u, tgt); if (d < 2.5 || d > 8) return false;
  const x = tgt.x, z = tgt.z; if (solidAt(G.map, x, z)) return false;
  setAim(u, x, z); sigSay(u, '뛰어 내려찍기'); setPose(u, u.S.poses.jump ? 'jump' : 'windup'); u.st = 'strike'; u.stT = 1.0; u.airborne = true;
  const dd = decal('circle', { x, z, r: 1.6, dur: 0.85, color: RED, hostile: true });
  const x0 = u.x, z0 = u.z, t0 = G.t;
  const fly = setInterval(() => { if (u.dead){ clearInterval(fly); return; } const k = Math.min(1, (G.t - t0) / 0.8); u.x = x0 + (x - x0) * k; u.z = z0 + (z - z0) * k; u.lift = Math.sin(k * Math.PI) * 2.2; if (k >= 1) clearInterval(fly); }, 16);
  dd.onDone = () => { u.airborne = false; u.lift = 0; if (u.dead) return; camShake(0.35, 0.25); dust(x, z, 18); ring(x, z, 0xff6a4a, 1.8, 0.35);
    for (const t of allies()) if (inShape(dd, t) && (t.jy || 0) < 0.45) hurt(u, t, u.atk * 1.3, { from: u, kb: 2, stun: 0.6 }); };
  return true;
}
// 북소리: 주변 적 6초 동안 공격 +25% (보광의 춤)
function sigDrum(u, tgt){
  if (!foes().some(e => e !== u && dist(e, u) < 7)) return false;
  sigSay(u, '♪ 북소리'); setPose(u, u.S.poses.groove ? 'groove' : 'idle'); u.st = 'strike'; u.stT = 1.0; ring(u.x, u.z, 0xffc070, 7, 0.6);
  for (const e of foes()) if (dist(e, u) < 7 && !e.drumT){ e.drumT = true; e.atk = Math.round(e.atk * 1.25); popText(e.x, e.y + bodyH(e) + 0.2, e.z, '흥!', 'alert', 0.6); setTimeout(() => { e.drumT = false; e.atk = Math.round(e.atk / 1.25); }, 6000); }
  return true;
}
// 마력 폭발: 자기 둘레 큰 원
function sigNova(u, tgt){
  if (dist(u, tgt) > 3.2) return false;
  sigSay(u, '마력 폭발'); setPose(u, u.S.poses.heavy ? 'heavy' : 'windup');
  windup(u, 'circle', { x: u.x, z: u.z, r: 3.0, windup: 0.9, follow: u }, t => hurt(u, t, u.atk * 1.2, { from: u, kb: 2.2, stun: 0.5 }));
  return true;
}
// 응시: 눈이 마주치면 (시야 안 6칸) 정신도 −12 · 공포 2초. 등을 돌리거나 기둥 뒤로 숨으면 안 걸림
function sigStare(u, tgt){
  if (dist(u, tgt) > 6) return false;
  sigSay(u, '응시'); u.st = 'strike'; u.stT = 0.9;
  setTimeout(() => { if (u.dead) return; for (const t of allies()) if (dist(u, t) < 6.5 && sees(u, t)){ if (t.hero) t.hero.san = Math.max(0, (t.hero.san ?? 50) - 12); if (typeof addStatus === 'function') addStatus(t, 'fear', { t: 2 }); popText(t.x, t.y + 2, t.z, '눈이 마주쳤다', 'hurt', 0.8); } }, 700);
  return true;
}

/* ---------- 보스 방: 계단 방에 보스. 쓰러뜨려야 계단이 열림 ---------- */
function bossRoom(gen){
  const D = gen.D; if (!D.boss) return;
  const r = gen.stairs, cx = Math.round(r.cx), cz = Math.round(r.cz) - 2;
  EXP.boss = { kind: D.boss, alive: true, woke: false, x: cx, z: cz };
  // 계단 막기
  const st = G.inspect.find(o => o.mark === '계단');
  if (st){ const fn = st.fn, lb = st.label; st.fn = () => EXP.boss && EXP.boss.alive ? popText(G.player.x, G.player.y + 2.2, G.player.z, DEFS[D.boss].name + '을 쓰러뜨려야 내려간다', 'miss', 1.2) : fn(); Object.defineProperty(st, 'label', { get: () => EXP.boss && EXP.boss.alive ? '계단 — 봉인됨 (' + DEFS[D.boss].name + ')' : lb }); }
  if (D.boss === 'cesar'){   // 관 (깨어나기 전엔 소품)
    EXP.boss.coffin = dbill(DA + 'H-198.webp', cx, cz, 1.3, { fit: 1.6, tint: 0.9 });
    addSource(cx, cz, 4.5, 0xbfd8ff, 0.7, 1.6);
    G.inspect.push({ x: cx, z: cz, r: 1.8, mark: '관', far: 12, label: '녹슬지 않은 왕관을 쓴 관', once: true, fn: () => bossWake() });
  } else if (D.boss === 'general'){
    for (let i = 0; i < 6; i++){ const a = i / 6 * 6.28, x = cx + Math.cos(a) * 2.6, z = cz + Math.sin(a) * 2.2; if (!solidAt(G.map, x, z)){ const e = spawnFoe(i % 2 ? 'bkShield' : 'bk', x, z, gen.F, 'boss'); e.post = { x, z }; } }
    EXP.boss.flag = dbill(DA + 'H-165.webp', cx + 2, cz - 1.5, 2.2, { fit: 1.2, tint: 0.9 });
  }
  DUN.marks.push({ x: cx, z: cz, icon: '♛', col: '#ff6a6a', known: true });
}
function bossTick(dt){
  const B = EXP && EXP.boss; if (!B || !B.alive) return;
  const pl = G.player; if (!pl) return;
  if (!B.woke && Math.hypot(pl.x - B.x, pl.z - B.z) < 6.5) bossWake();
  if (B.u && B.u.dead){
    B.alive = false; $('bossbar').hidden = true; G.boss = null;
    caption(B.u.D.name + ' 쓰러짐', B.kind === 'general' ? '대장군의 깃발이 꺾였다 — 길이 열렸다' : '계단의 봉인이 풀렸다');
    for (let i = 0; i < 3; i++) setTimeout(() => dropLootAt(B.u.x, B.u.z, rollItem(EXP.F, { type: i ? 'gear' : 'relic', bonus: 0.5, plus: 2 })), 300 + i * 250);
    dropLootAt(B.u.x, B.u.z, { gold: 150 * EXP.F });
    RPG.meta.shortcut = Math.max(RPG.meta.shortcut || 1, EXP.F + 1); saveRpg && saveRpg();
    if (B.kind === 'general') setTimeout(() => guide('<em>대장군</em>을 쓰러뜨렸다. 이 아래는 아직 아무도 모른다 — <em>귀환 줄</em>로 돌아가자', 9), 1500);
  }
}
async function bossWake(){
  const B = EXP.boss; if (!B || B.woke) return; B.woke = true;
  const kind = B.kind;
  if (B.coffin){ B.coffin.g.visible = false; dust(B.x, B.z, 20); camShake(0.4, 0.5); }
  const u = spawnFoe(kind, B.x, B.z + (kind === 'cesar' ? 0.4 : 0), EXP.F, 'boss'); B.u = u; u.alert = true; u.elite = false;
  if (u.tag){ u.tag.remove(); u.tag = null; }
  G.boss = u; $('bossbar').hidden = false; $('bossname').textContent = kind === 'cesar' ? '세자르 — 관 속의 늙은 왕' : '대장군 — 열 번째 층의 주인'; $('bossphase').textContent = '';
  if (kind === 'cesar'){ setPose(u, 'raise'); u.st = 'strike'; u.stT = 3; G.lock = true; camWide(u.x, u.z, 4.5, 6, 4); await vnTalk('세자르', ['…누가 내 잠을 깨우나.', '왕관은 녹슬지 않았다. 나도 그렇다.', '무릎을 꿇어라. 아니면 — 베인다.']); G.lock = false; u.st = 'idle'; caption('세자르', '녹슬지 않는 왕관 · 관 속의 늙은 왕'); }
  else { G.lock = true; camWide(u.x, u.z, 6, 9, 3.5); await textbox('대장군', ['여기까지 내려온 자는 오랜만이군.', '군단이여 — 깃발 아래로.'], { face: 'art/foe/general_idle.webp', vn: true }); G.lock = false; caption('대장군', '열 번째 층의 주인 · 군단'); for (const e of foes()) e.alert = true; }
  SFX.roar && SFX.roar(0.5);
}
// 세자르: 평소 칼질 (enemyThink) 위에 큰 기술 넷
function cesarThink(u, dt){
  if (u.lock) return;
  const B = u.B || (u.B = { cd: { sky: 4, frenzy: 7, back: 5, raise: 0 }, raised: false });
  for (const k in B.cd) B.cd[k] -= dt;
  const tgt = nearest(u, allies(), 30);
  if (tgt && u.st === 'idle' && !G.lock){
    const d = dist(u, tgt);
    if (!B.raised && u.hp < u.max * 0.5){ B.raised = true; setPose(u, 'raise'); u.st = 'strike'; u.stT = 1.2; sigSay(u, '일어나라');
      for (let i = 0; i < 3; i++){ const a = rnd(0, 6.28), x = u.x + Math.cos(a) * 2.5, z = u.z + Math.sin(a) * 2.5; if (!solidAt(G.map, x, z)){ const e = spawnFoe('swordsman', x, z, EXP.F, 'boss'); e.alert = true; dust(x, z, 10); } }
      return; }
    if (B.cd.sky <= 0 && d < 9){   // 하늘 가르기: 긴 줄 · 큰 피해
      B.cd.sky = 9; setAim(u, tgt.x, tgt.z); sigSay(u, '하늘 가르기'); setPose(u, 'special');
      windup(u, 'line', { x: u.x, z: u.z, len: 9, w: 1.1, a: u.aim, windup: 1.0 }, t => hurt(u, t, u.atk * 1.8, { from: u, kb: 2.5, stun: 0.6 }));
      return;
    }
    if (B.cd.frenzy <= 0 && d < 2.6){   // 마구 베기: 부채꼴 세 번
      B.cd.frenzy = 10; sigSay(u, '마구 베기'); setAim(u, tgt.x, tgt.z);
      for (let i = 0; i < 3; i++) setTimeout(() => { if (u.dead) return; setPose(u, i % 2 ? 'attack' : 'thrust'); const tt = nearest(u, allies(), 6) || tgt; setAim(u, tt.x, tt.z);
        windup(u, 'sector', { x: u.x, z: u.z, r: 2.4, a: u.aim, arc: 2.2, windup: 0.35 }, t => hurt(u, t, u.atk * 0.8, { from: u, kb: 0.8 })); }, i * 520);
      u.st = 'strike'; u.stT = 1.6; return;
    }
    if (B.cd.back <= 0 && d < 2.0){   // 뒤로 빠졌다가 찌르기
      B.cd.back = 7; setPose(u, 'back'); const a = Math.atan2(u.z - tgt.z, u.x - tgt.x); u.kx += Math.cos(a) * 14; u.kz += Math.sin(a) * 14;
      setTimeout(() => { if (!u.dead && !u.lock) sigDash(u, nearest(u, allies(), 9) || tgt); }, 450); u.st = 'strike'; u.stT = 0.5; return;
    }
  }
  return enemyThink(u, dt);
}
// 대장군: 함성 · 돌격 · 휩쓸기 · 증원
function generalThink(u, dt){
  if (u.lock) return;
  const B = u.B || (u.B = { cd: { cry: 3, charge: 6, sweep: 4, call: 18 } });
  for (const k in B.cd) B.cd[k] -= dt;
  const tgt = nearest(u, allies(), 30);
  if (tgt && u.st === 'idle' && !G.lock){
    const d = dist(u, tgt);
    if (B.cd.cry <= 0){ B.cd.cry = 16; sigSay(u, '함성'); u.st = 'strike'; u.stT = 1.0; ring(u.x, u.z, 0xff5a3a, 9, 0.7); camShake(0.3, 0.4);
      for (const e of foes()) if (!e.cryT){ e.cryT = true; e.atk = Math.round(e.atk * 1.2); setTimeout(() => { e.cryT = false; e.atk = Math.round(e.atk / 1.2); }, 8000); }
      for (const a of allies()) if (dist(a, u) < 9 && typeof addStatus === 'function'){ addStatus(a, 'fear', { t: 1.2 }); if (a.hero) a.hero.san = Math.max(0, (a.hero.san ?? 50) - 6); }
      return; }
    if (B.cd.call <= 0){ B.cd.call = 22; sigSay(u, '증원!'); for (let i = 0; i < 3; i++){ const a = rnd(0, 6.28), x = u.x + Math.cos(a) * 3, z = u.z + Math.sin(a) * 3; if (!solidAt(G.map, x, z)){ const e = spawnFoe(R2(['bk', 'bkSpear', 'swordsman']), x, z, EXP.F, 'boss'); e.alert = true; } } u.st = 'strike'; u.stT = 0.8; return; }
    if (B.cd.charge <= 0 && d > 3 && d < 9){ B.cd.charge = 7; return sigDash(u, tgt) ? undefined : enemyThink(u, dt); }
    if (B.cd.sweep <= 0 && d < 2.8){ B.cd.sweep = 5; return sigSweep(u, tgt) ? undefined : enemyThink(u, dt); }
  }
  return enemyThink(u, dt);
}
