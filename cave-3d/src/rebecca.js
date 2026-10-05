/* rebecca.js v1.2 — (v1.2, v0.54: 재생이 강함 — 싸우는 중 초당 2.5% 회복 · 쓰러져도 8초 (짓뭉개지면 25초) · 방패로 앞에서 오는 공격을 잘 막고 (55%) 예고 장판은 옆으로 피함. 굴: 따라다니기 ↔ 여기저기 돌아다니며 일 (정리 · 불 피우기 · 죽은 달팽이로 달팽이구이)) (v1.1, v0.53: 굴에 적이 들어오면 레베카도 같이 싸움 · 끝나면 다시 굴 주민) (v1.0, v0.47: 꺼낸 뒤 굴에서 움직이고 따라다님 · 원정 동료)
   설정 (민수): 루비색 장발 · 늘 조용한 눈웃음 · 158cm · 27세 · 낡은 판금 갑옷 · 장검. 순수한 절대선. 침착 · 백절불굴 · 희망을 잃지 않는 소녀 기사 (전투력은 평범, 심장 100)
     매사 긍정 · 존댓말. 던전 괴수와 함께 무너져 흙 속에 2년 — 불사가 한계까지 부서지고 다시 붙기를 반복. 꺼내지면 하늘을 보며 대자로 누워 소리 없이 운다 → 하루 쉬면 다 재생
   · 꺼낸 날: 누워서 쉼 (말을 걸면 짧게). 다음 날부터 일어나 굴을 돌아다님 — 끼니 · 화장실은 다른 동료처럼, 한가하면 인주 뒤를 따라다님
   · 원정 동료 (석문 준비 창에서 고름): 선봉 · 장검 + 낡은 방패
     기본: 내려베기 ↔ 올려베기 (부채꼴 1.6칸) · 찌르기 (2.8칸 줄, 방어 무시) · 회전베기 (둘레 1.9칸, 둘 이상 붙으면) · 어깨 박기 (밀침 2 → 벽이면 짓눌림)
     방패 돌진 (3~6칸 떨어진 적에게 일직선, 밀침) · 방패 막기 (자기를 노린 예고가 보이면 0.8초 방어 자세 — 피해 90% 막음)
   · 불사 (재생): 쓰러져도 20초 뒤 일어남 (짓뭉개져 쓰러지면 60초). 치명상은 남지 않음 (다 재생). 밥을 안 먹었으면 공격 -20% · 재생 1.5배 느림, 먹었으면 재생 빠름 */
'use strict';
SPR.rebecca = foeSheet('rebecca', 1.3, 1);
Object.assign(SPR.rebecca.poses.run, { once: false, fps: 12 }); SPR.rebecca.poses.hurt = SPR.rebecca.poses.block;
DEFS.rebecca.spd = 2.8;   // 굴: 이제 걸어 다님 (전엔 0이라 꺼내도 제자리)
DEFS.rebeccaAlly = { spr: 'rebecca', name: '레베카', hp: 100, atk: 17, spd: 3.3, r: 0.32, weight: 80, think: rebThink, undying: true };
HERO_DEF.rebecca = { name: '레베카', unit: 'rebeccaAlly', face: 'art/pro/rebecca_face.webp', attr: { str: 5, dex: 6, vit: 4, wil: 9, per: 5 },
  note: '늘 조용한 눈웃음 · 존댓말. 선봉. 불사 — 쓰러져도 8초면 일어남 (치명상이 남지 않음). 굶으면 약해짐', innate: '낡은 장검', wts: ['sword', 'greatsword', 'spear', 'shield'],
  line: ['제가 앞에 설게요.', '괜찮아요, 금방 나아요.', '꼭 다 같이 나가요.'] };
Object.assign(KSK, {
  rUndying: { icon: 'art/pro/rebecca_face.webp', n: '불사 (재생)', d: '고유 특성 — 싸우는 중에도 초당 2.5% 재생. 쓰러져도 8초면 일어남 (짓뭉개지면 25초). 치명상이 남지 않음. 굶으면 재생이 느리고 약해짐' },
  rCharge: { icon: '', n: '방패 돌진', d: '3~6칸 떨어진 적에게 일직선으로 — 밀침 · 경직 (7초)' },
  rSpin: { icon: '', n: '회전베기', d: '둘 이상 붙으면 둘레 1.9칸 (6초)' },
  rThrust: { icon: '', n: '찌르기', d: '2.8칸 줄 · 방어 무시 (4초)' },
  rBlock: { icon: '', n: '방패 막기 · 회피', d: '앞에서 오는 공격의 55%를 방패로 막음 (85% 감소). 자기를 노린 예고가 보이면 옆으로 피하거나 0.8초 방어 자세 (90% 막음)' },
});
HERO_SK.rebecca = ['rUndying', 'rCharge', 'rSpin', 'rThrust', 'rBlock'];
const REB = { swing: { r: 1.6, arc: 1.6, wind: 0.32, cd: 0.95 }, thrust: { len: 2.8, w: 0.6, wind: 0.42, cd: 4 }, spin: { r: 1.9, wind: 0.45, cd: 6 }, bash: { cd: 5 }, charge: { len: 4.6, cd: 7 }, block: { cd: 1.0 } };
const rebThin = () => !!(PRO.meal && PRO.meal.reb && !PRO.meal.reb.fed);
const REB_SAY = { down: ['…조금만, 기다려 주세요.', '…아파요. 그래도 괜찮아요.'], up: ['다녀왔어요.', '…괜찮아요. 다시 갈게요.'], fight: ['제가 앞에 설게요!', '물러서지 않아요.', '…이쪽이에요!'] };
const pickR = a => a[Math.floor(Math.random() * a.length)];

/* ---------- 원정 두뇌 ---------- */
function rebThink(u, dt){
  const R = u.reb || (u.reb = { cd: { swing: 0, thrust: 1, spin: 2, bash: 1, charge: 2, block: 0, dodge: 0 }, act: null, n: 0 });
  if (u.downed){   // 불사: 재생
    if (!R.upAt){ const k = rebThin() ? 1.5 : 0.8; R.upAt = G.t + (u.crushed ? 25 : 8) * k; R.tick = 0; say(u, pickR(REB_SAY.down), 'soft', 2); }
    R.tick -= dt; if (R.tick <= 0){ R.tick = 5; popText(u.x, u.y + 1.2, u.z, `재생 중… ${Math.ceil(R.upAt - G.t)}초`, 'heal', 1.2); }
    if (G.t >= R.upAt){ R.upAt = 0; u.crushed = false; u.downed = false; u.lying = false; u.st = 'idle'; u.hp = Math.round(u.max * (rebThin() ? 0.6 : 1)); popText(u.x, u.y + 1.8, u.z, '재생', 'heal', 1.2); ring(u.x, u.z, 0xff8a8a, 1.4, 0.5); say(u, pickR(REB_SAY.up), 'soft', 1.8); }
    return;
  }
  for (const k in R.cd) R.cd[k] -= dt;
  if (u.inv > 0) u.inv = Math.max(0, u.inv - dt);
  if (u.hp < u.max) u.hp = Math.min(u.max, u.hp + u.max * (rebThin() ? 0.01 : 0.025) * dt);   // v1.2 재생 (싸우는 중에도)
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0) u.st = 'idle'; R.act = null; u.guardStance = false; return; }
  if (R.act) return rebAct(u, R, dt);
  const pl = G.player, list = foes().filter(e => e.alert && !e.dead && (!pl || dist(e, pl) < 16));
  const tg = G.cmd === 'focus' && G.focusTarget && !G.focusTarget.dead ? G.focusTarget : nearest(u, list.filter(e => pl && dist(e, pl) < 4).length ? list.filter(e => pl && dist(e, pl) < 4) : list, 20);
  if (!tg || G.cmd === 'follow' && pl && !pl.downed) return allyThink(u, dt);
  const d = dist(u, tg), a = Math.atan2(tg.z - u.z, tg.x - u.x); setAim(u, tg.x, tg.z);
  if (!R.said && Math.random() < 0.5){ R.said = true; say(u, pickR(REB_SAY.fight), 'soft', 1.6); }
  // 막기: 나를 노린 예고 (붉은 장판)가 보이면
  const th = foes().find(e => e.decal && !e.dead && dist(e, u) < 7 && inShape(e.decal, u));
  if (th && (R.cd.dodge ?? 0) <= 0 && (th.D.boss || dist(th, u) > 3.4 || Math.random() < 0.45)){   // v1.2 옆으로 피함 (보스 · 먼 데서 오는 것은 늘)
    const a0 = Math.atan2(u.z - th.z, u.x - th.x); let a = a0 + (Math.random() < 0.5 ? 1.5 : -1.5);
    if (solidAt(G.map, u.x + Math.cos(a) * 1.6, u.z + Math.sin(a) * 1.6)) a = a0 * 2 - a;
    R.cd.dodge = 2.2; R.act = { type: 'dodge', t: 0, a }; u.st = 'skill'; u.inv = Math.max(u.inv || 0, 0.32); setPose(u, 'run'); return;
  }
  if (th && R.cd.block <= 0 && dist(th, u) < 3.6){ R.cd.block = REB.block.cd; R.act = { type: 'block', t: 0 }; u.guardStance = true; setPose(u, 'block'); return; }
  const near = list.filter(e => dist(e, u) < 1.9).length;
  const go = (type, o) => { R.act = { type, t: 0, a, tg, ...o }; u.st = 'skill'; };
  if (R.cd.charge <= 0 && d > 3 && d < 6 && sees(u, tg)){ R.cd.charge = REB.charge.cd; go('charge', { dec: decal('line', { x: u.x, z: u.z, len: REB.charge.len, w: 0.9, a, dur: 0.35, color: BLUE }), hit: new Set() }); setPose(u, 'charge'); return; }
  if (R.cd.spin <= 0 && near >= 2){ R.cd.spin = REB.spin.cd; go('spin', { dec: decal('circle', { x: u.x, z: u.z, r: REB.spin.r, dur: REB.spin.wind, color: BLUE }) }); setPose(u, 'spin'); return; }
  if (R.cd.bash <= 0 && d < 1.3 && wallBehind(tg, a, 2.2)){ R.cd.bash = REB.bash.cd; go('bash', {}); setPose(u, 'bash'); return; }   // 벽을 등진 놈 → 어깨로 밀어붙임
  if (R.cd.thrust <= 0 && d > 1.5 && d < 2.7){ R.cd.thrust = REB.thrust.cd; go('thrust', { dec: decal('line', { x: u.x, z: u.z, len: REB.thrust.len, w: REB.thrust.w, a, dur: REB.thrust.wind, color: BLUE }) }); setPose(u, 'thrust'); return; }
  if (d > 1.4){ navTo(u, tg.x, tg.z, u.spd * (d > 4 ? 1.3 : 1), dt, 1.1); setPose(u, d > 4 ? 'run' : 'walk'); return; }
  if (R.cd.bash <= 0 && Math.random() < 0.25){ R.cd.bash = REB.bash.cd; go('bash', {}); setPose(u, 'bash'); return; }
  setPose(u, 'idle');
  if (R.cd.swing <= 0){ R.cd.swing = REB.swing.cd; R.n++; go('swing', { dec: decal('sector', { x: u.x, z: u.z, r: REB.swing.r, a, arc: REB.swing.arc, dur: REB.swing.wind, color: BLUE }) }); setPose(u, R.n % 2 ? 'slashDown' : 'slashUp'); }
}
function rebAct(u, R, dt){
  const K = R.act; K.t += dt;
  const m = rebThin() ? 0.8 : 1, inDec = e => K.dec && inShape(K.dec, e);
  const end = () => { R.act = null; u.st = 'idle'; u.guardStance = false; setPose(u, 'idle'); };
  const hitAll = (pred, mul, o = {}) => { for (const e of foes()) if (!e.dead && pred(e)) hurt(u, e, u.atk * mul * m, { from: u, ...o }); };
  if (K.type === 'block'){ if (K.t >= 0.8) end(); return; }
  if (K.type === 'dodge'){ if (K.t < 0.26){ moveBy(u, Math.cos(K.a) * 7 * dt, Math.sin(K.a) * 7 * dt); if (Math.random() < 0.5) dust(u.x, u.z, 1); } if (K.t >= 0.36) end(); return; }
  if (K.type === 'swing'){ if (!K.hit && K.t >= REB.swing.wind){ K.hit = true; hitAll(inDec, 1, { kb: 0.4 }); } if (K.t >= 0.6) end(); return; }
  if (K.type === 'thrust'){ if (!K.hit && K.t >= REB.thrust.wind){ K.hit = true; moveBy(u, Math.cos(K.a) * 0.5, Math.sin(K.a) * 0.5); hitAll(inDec, 1.4, { pierce: true, kb: 0.5 }); } if (K.t >= 0.75) end(); return; }
  if (K.type === 'spin'){ if (!K.hit && K.t >= REB.spin.wind){ K.hit = true; hitAll(inDec, 1.2, { kb: 0.9 }); spark(u.x, 1, u.z, 0xe8e0f0, 12, 4); SFX.whoosh && SFX.whoosh(); } if (K.t >= 0.85) end(); return; }
  if (K.type === 'bash'){ if (!K.hit && K.t >= 0.3){ K.hit = true; const t = K.tg; if (t && !t.dead && dist(u, t) < 1.7){ hurt(u, t, u.atk * 0.8 * m, { from: u, kb: 2.0, stun: 0.5 }); SFX.thump && SFX.thump(130, 0.4, 0.15); } } if (K.t >= 0.7) end(); return; }
  if (K.type === 'charge'){
    if (K.t < 0.35) return;
    if (K.t < 0.75){ const sp = REB.charge.len / 0.4; moveBy(u, Math.cos(K.a) * sp * dt, Math.sin(K.a) * sp * dt); if (Math.random() < 0.5) dust(u.x, u.z, 1);
      for (const e of foes()) if (!e.dead && !K.hit.has(e) && Math.hypot(e.x - u.x, e.z - u.z) < u.r + e.r + 0.2){ K.hit.add(e); hurt(u, e, u.atk * 1.1 * m, { from: u, kb: 1.5, stun: 0.6 }); camShake(0.15, 0.12); popText(e.x, e.y + bodyH(e), e.z, '쿵!', 'big', 0.6); } return; }
    end();
  }
}
// 불사: 치명상이 남지 않음 · 짓뭉개져 쓰러지면 재생이 오래 걸림
if (typeof addWound === 'function'){ const _addWoundR = addWound; addWound = function(u, k, why){ if (u && u.D && u.D.undying){ popText(u.x, u.y + bodyH(u) + 0.6, u.z, '…재생', 'heal', 1); return; } return _addWoundR(u, k, why); }; }
{ const _hurtR = hurt; hurt = function(att, tgt, base, o = {}){
  if (tgt && tgt.D === DEFS.rebeccaAlly && !tgt.downed && !tgt.guardStance && !o.unblockable && !o.pierce && !o.dot && Math.random() < 0.55){   // v1.2 방패: 앞에서 오면 잘 막음
    const s = o.from || att; if (s && Math.abs(angDiff(Math.atan2(s.z - tgt.z, s.x - tgt.x), tgt.aim)) < 1.3){ base *= 0.15; o = { ...o, stun: 0, kb: (o.kb || 0) * 0.4 }; setPose(tgt, 'block'); spark(tgt.x + Math.cos(tgt.aim) * 0.4, tgt.y + 1, tgt.z + Math.sin(tgt.aim) * 0.4, 0xd8e8ff, 10, 4); SFX.clink && SFX.clink(0.4); }
  }
  const r = _hurtR(att, tgt, base, o); if (tgt && tgt.D && tgt.D.undying && tgt.downed && o.crush) tgt.crushed = true; return r; }; }

/* ---------- 굴: 꺼낸 날은 누워 쉼 → 다음 날부터 돌아다니며 인주를 따라다님 ---------- */
HSAY.reb = { work: ['정리할게요.', '이건 저쪽에 둘까요?'], hungry: ['…배가 조금 고프네요.', '밥, 먹어도 될까요?'], ate: ['잘 먹었습니다.', '맛있어요. 금방 통통해져요.'], starve: ['…괜찮아요. 참을 수 있어요.', '(꼬르륵)'],
  forage: ['…이끼라도 괜찮아요.'], off: ['…'], potty: ['잠깐 다녀올게요.'], done: ['다녀왔어요.'] };
const REB_TALK = [['…대장님, 오늘도 무사히 돌아오셨네요.'], ['하늘이 보이는 곳이 이렇게 좋은 줄 몰랐어요.'], ['저는 괜찮아요. 조금 아플 뿐이에요.'], ['밥… 조금만 더 먹어도 될까요?', '먹으면 금방 나아요.'], ['꼭 다 같이 나가요.', '저, 포기 안 해요.'], ['…놀리시는 거죠?', '(볼이 빨개졌다)']];
const rebResting = () => PRO.rebOutDay != null && PRO.rebOutDay === PRO.day;
spawnRebecca = function(x, z){
  const r = spawn('rebecca', x, z, 'neutral'); r.face = 1; r.home = { x, z }; PRO.cave.reb = r;
  G.inspect.push({ unit: r, r: 1.6, talk: true, get label(){ return rebResting() ? '누워 있는 레베카' : '레베카에게 말을 건다'; }, fn: async () => {
    r.face = Math.sign(G.player.x - r.x) || r.face;
    if (rebResting()) return textbox('레베카', [['(하늘을 보며 대자로 누워 있다. 소리 없이 운다)'], ['……고마워요. 정말로.'], ['(눈을 감은 채 웃는다)']][Math.floor(Math.random() * 3)], { face: PA + 'rebecca_face.webp' });
    await textbox('레베카', REB_TALK[Math.floor(Math.random() * REB_TALK.length)], { face: PA + 'rebecca_face.webp' });
  } });
  return r;
};
rebeccaOut = async function(){
  const Cv = PRO.cave, B = Cv.B; G.lock = true; letterbox(true);
  camFocus(B.x + 0.6, B.z, 99, ...lens(2.6, 3.8), 0.05); await wait(0.6);
  camShake(0.35, 0.6); SFX.boom(0.7); dust(B.x + 0.5, B.z, 24); spark(B.x + 0.5, 0.8, B.z, 0xc8b8a0, 24, 4);
  if (PRO.rebHead){ G.scene.remove(PRO.rebHead.g); PRO.rebHead = null; }
  PRO.rebOut = true; PRO.rebOutDay = PRO.day; PRO.meal.reb = { fed: false, hd: 0 }; PRO.hpf.reb = 1;
  const r = spawnRebecca(B.x + 1, B.z); r.lying = true; await wait(1.2);
  await textbox('레베카', ['…하늘이다.', '(대자로 누워 위를 올려다본다. 소리 없이 눈물이 흐른다)', '……고마워요. 정말로, 고마워요.'], { face: PA + 'rebecca_face.webp' });
  await textbox('청광묵', ['대장! 레베카 나왔다! 같이 산다!'], { face: FACE.cheong, tags: CHEONG_TAGS() });
  camFocusOff(); letterbox(false); G.lock = false;
  caption('레베카', '오늘은 누워서 쉰다 — 내일이면 다 재생해 일어난다 (끼니도 하나 더)');
};
const _helperTickR = helperTick;
helperTick = function(h, dt){
  if (!h || h !== PRO.cave.reb) return _helperTickR(h, dt);
  if (rebResting()){ h.lying = true; h.moving = false; h.cryT = (h.cryT ?? 6) - dt; if (h.cryT <= 0){ h.cryT = rnd(9, 14); say(h, '(소리 없이 운다)', 'zzz', 2.2); } return; }
  h.lying = false;
  const M = PRO.meal.reb;
  if (G.lobbyFight || hBusy(h) || (M && !M.fed) || (h.job && h.job.it)) return _helperTickR(h, dt);
  // v1.2 굴 일: 불이 꺼졌는데 구울 달팽이가 있으면 불부터 피움
  if (!G.lock && !PRO.fireLit && PRO.wood >= FIRE_COST && PRO.loose.some(it => it.d.raw && !it.done && !it.carrier)){
    if (Math.hypot(FIRE.x + 1 - h.x, FIRE.z - h.z) > 0.6){ navTo(h, FIRE.x + 1, FIRE.z, 3.0, dt, 0.4); setPose(h, 'walk'); return; }
    PRO.wood -= FIRE_COST; PRO.fireLit = true; if (typeof woodPile === 'function') woodPile(); spark(FIRE.x, 0.8, FIRE.z, 0xffb050, 18, 3.5); popText(FIRE.x, 1.7, FIRE.z, '불이 붙었다! (레베카)', 'heal', 1.3); say(h, '불, 피워 둘게요. 달팽이 구워요.', 'soft', 1.8); return;
  }
  // 따라다니기 ↔ 일 (정리 · 달팽이구이 · 여기저기 돌아다님)을 번갈아. 죽은 달팽이가 있으면 늘 일
  h.rmodeT = (h.rmodeT ?? 0) - dt;
  if (h.rmodeT <= 0){ h.rmode = Math.random() < 0.6 ? 'work' : 'follow'; h.rmodeT = rnd(25, 45); if (h.rmode === 'work' && Math.random() < 0.5) say(h, pickR(['저, 정리 좀 할게요.', '뭐 도울 일 없을까요?', '오늘은 제가 구울게요.']), 'soft', 1.8); }
  if (h.rmode === 'work' || PRO.loose.some(it => it.d.raw && !it.done && !it.carrier)){
    h.homeT = (h.homeT ?? 0) - dt; if (h.homeT <= 0){ h.homeT = rnd(8, 15); const a = rnd(0, 6.3); h.home = { x: clamp(LOBBY_C.x + Math.cos(a) * rnd(1, 4.5), 3, 15), z: clamp(LOBBY_C.z + Math.sin(a) * rnd(1, 3.5), 6, 14) }; }
    const was = h.x, wz = h.z; _helperTickR(h, dt); const mv = Math.hypot(h.x - was, h.z - wz) > 1e-4;
    setPose(h, mv ? 'walk' : 'idle'); return;
  }
  // 한가함: 인주 뒤를 따라다님 (멀면 뜀)
  const pl = G.player; if (!pl || G.lock){ h.moving = false; setPose(h, 'idle'); return; }
  let bx = pl.x - Math.cos(pl.aim) * 1.3 + 0.5, bz = pl.z - Math.sin(pl.aim) * 1.3; if (solidAt(G.map, bx, bz)){ bx = pl.x; bz = pl.z; }   // 뒤가 막혔으면 인주 곁으로
  const d = Math.hypot(bx - h.x, bz - h.z), dp = Math.hypot(pl.x - h.x, pl.z - h.z);
  if (d > 0.9 && dp > 1.3){ navTo(h, bx, bz, d > 4 ? 4.4 : 2.8, dt, 0.5); setPose(h, d > 4 ? 'run' : 'walk'); }
  else { h.moving = false; setPose(h, 'idle'); h.face = Math.sign(pl.x - h.x) || h.face; }
  h.chatT = (h.chatT ?? rnd(20, 40)) - dt; if (h.chatT <= 0){ h.chatT = rnd(35, 60); say(h, pickR(['대장님, 어디 가세요?', '…같이 가요.', '(조용히 웃는다)', '오늘 하늘은 어떨까요.']), 'soft', 2); }
};

/* ---------- v1.1 굴 싸움 (적이 굴에 들어옴): 레베카도 같이 싸움 (꺼낸 날 누워 쉬는 중이면 빼고). 끝나면 다시 굴 주민으로 ---------- */
const _startLobbyR = startLobbyFight;
startLobbyFight = function(){
  _startLobbyR();
  const r = PRO.cave && PRO.cave.reb; if (!r || rebResting()) return;
  const D = DEFS.rebeccaAlly; Object.assign(r, { side: 'ally', D, max: D.hp, hp: Math.max(1, Math.round(D.hp * (PRO.hpf.reb || 1))), atk: D.atk, spd: D.spd, job: null, lift: 0, lying: false, eat: null, wander: null, potty: null });
  r.group.visible = true; r.reb = null; say(r, '!', 'alert', 1.1); setTimeout(() => G.lobbyFight && say(r, '제가 앞에 설게요!', 'soft', 1.8), 1300);
};
const _endLobbyR = endLobbyFight;
endLobbyFight = function(win){
  const r = PRO.cave && PRO.cave.reb;
  if (r && r.side === 'ally'){
    PRO.hpf.reb = r.downed ? 0.3 : Math.max(0.05, r.hp / r.max);
    if (r.reb && r.reb.act && r.reb.act.dec) cancelDecal(r.reb.act.dec);
    Object.assign(r, { side: 'neutral', D: DEFS.rebecca, downed: false, st: 'idle', tilt: 0, guardStance: false, reb: null, crushed: false }); setPose(r, 'idle');
  }
  _endLobbyR(win);
};
