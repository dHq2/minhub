/* ===== run8_i.js v1.6 — v8.7.1 · v8.7.1.1 인카운터 · 맵 위 NPC (민수 명세 spec_870 B 절 · A4 · A7 · A12 · A15 ~ A17 · A19)
   · 맵 위 상시 NPC: MS 싸움판 구석에 — 야전병원 천막 (간호사장 · 파비 · 1성 간호사) · 로지나 · 대장장이 · 배신자 셰도르 · 노라 · 왐 · 마리와 와킨 · 아이텐 · 아해 (요괴 마을)
     싸움에 끼지 않고 · 일부는 싸움이 끝날 때까지 숨음 (천막 · 노라) · 일부는 다음 싸움을 도움 (로지나 — 위험하면 튐 · 셰도르)
   · 항복: 아해 (마지막 하나 · 빈사) · 페흐토 (빈사) — 죽이면 끝 · 살리면 영입 이벤트
   · S 칸 인카운터: 도감 조우 장면 카드 212장 (기본 카드 · 조우 장면 · 인카운터 그림 + 글) · 이름 있는 만남 19 (장작방 · 고독방 · 붉은 소녀 · 치킨룸 · 해변 · 행성 · 지껄이는 입 · 신성 오딜의 방 · 갈대밭 · 유적의 페흐토 · 호수 유적 · 해양 유적 가뮤 · 지식의 나선 · 단달로 저택 · 인공천사 벨 · 러버덕 · 광대 마카로니 · 노란악마 · 테헤라 · 아템)
   · 히든 층: 하르겐의 성당 (16 ~ 28층) · 과거의 칼데라 (2 ~ 9층 · 히든보스 데두라)
   · 대화 그림 (배경 딴 투명 그림) 등록: 벨 18 · 딸기 6 · 옐로 5 · 로지나 3 · 아해 · 간호사장 · 파비
   v1.6: 도감 카드 212장은 묶음 그림 3장 (art/card/atlasN — 파일 수 한도) · 대화 줄의 card: id 를 가운데 큰 그림으로 (묶음에서 그 칸만)
   v1.5: 좁은 지나가기 맵에도 봉인 문양 셋 (사이 7 → 5 → 3칸)
   v1.4: v8.7.1.1 맵 장치 — 봉인된 출구 (지나가기의 35%: 빛나는 문양 셋을 밟아야 열림 · 적은 자고 있음 · 다 쓰러뜨려도 열림) · 진지 설비 (진지 MS 의 큰 설비 자리에 팩션 보급 포대 — 움직이지 않는 적 · 같은 사격 규칙 · 부술 수 있음)
   v1.3: 비전투 맵 (남은 적 없음) 에선 대장이 나가면 모두 함께 나간 것으로 침 (기다리지 않음 · 명세 A9)
   v1.2: 자기 검토 — 페흐토가 가끔 싸움을 도움 (4층 뒤 · 손님) · 페흐토를 죽이면 투구 · 망토 갑주 (고급) 를 반드시 떨어뜨림 · 노라를 쓰러뜨리면 상품 모두 (탄 · 귀한 총 · 약 · 동전) · 죽은 단독 개체 (마리 · 아해 · 셰도르 …) 는 맵 위에 다시 안 나옴
   v1.1: 판 안 대화 (r8InMap) — 영입은 판에 바로 (r8PutIn) · 끝나면 지도로 가지 않음 · 히든 층은 줄 (rows) 로 — 마지막 줄은 보스 / 돌아 나가는 계단 · 이름 있는 만남은 여정에 한 번 · 판을 만든 뒤 r8HookI (손님 · 맵 위 NPC · 항복) */

// ---------- 대화 그림 ----------
Object.assign(TALK_ART, {
  'C-189': Array.from({ length: 18 }, (_, i) => 'talk/bell_t' + (i + 1)),
  'C-218': Array.from({ length: 6 }, (_, i) => 'talk/ddalgi_t' + (i + 1)),
  'C-008': Array.from({ length: 5 }, (_, i) => 'talk/yellow_t' + (i + 1)),
  'C-028': ['talk/rosina_t1', 'talk/rosina_t2', 'talk/rosina_t3'], 'C-082': ['talk/ahae_t1'], 'C-095': ['talk/lumi_t1'], 'C-170': ['talk/fabi_t1'] });
const IMG8 = { lumi: 'talk/lumi_t1', fabi: 'talk/fabi_t1', rosina: 'talk/rosina_t1', rosina2: 'talk/rosina_t2', rosina3: 'talk/rosina_t3', nora: 'talk/nora_t1', ahae: 'talk/ahae_t1', bell: 'talk/bell_t1', duck: 'talk/duck_t1', macaroni: 'talk/macaroni_t1', sardil: 'talk/sardil_t1', sardil2: 'talk/sardil_t2', gamyu: 'talk/gamyu_t1', holy1: 'talk/holyodile_t1', holy2: 'talk/holyodile_t2', moran: 'talk/moran_t1', rokto: 'talk/rokto_t1', mokel: 'talk/mokel_t1' };

// ---------- 적 설계 더하기 (인카운터 인물) ----------
[['아해', 'C-082', 3, { weapon: '둔기', height: 1.9, weight: 90, ov: { hp: 300, atk: 40 }, traits: ['야시', '회피B', '베테랑'] }, '떠돌이 도깨비 — 400살 · 담배를 좋아함'],
 ['페흐토', 'C-108', 5, { cls: '기동', weapon: '장검', height: 2.0, weight: 110, ov: { hp: 620, atk: 56 }, traits: ['베테랑', '갑피', '회피A', '속력A', '보스'], active: ['공중제비'], gear: { 머리: { name: '페흐토의 투구', mat: '판금', tier: 3 }, 몸: { name: '페흐토의 망토 갑주', mat: '사슬', tier: 3 } } }, '청염계 마족 기사 — 매우 뛰어난 기동'],
 ['사르딜 락', null, 6, { weapon: '이빨·발톱', height: 4, weight: 2600, sizeCls: '초대형', ov: { hp: 1500, atk: 64 }, traits: ['거구', '갑피', '보스', '근력A'] }, '푸른 비늘의 용 — 호수 유적의 주인'],
 ['가뮤', null, 6, { weapon: '대검', height: 6, weight: 4200, sizeCls: '초대형', ov: { hp: 1700, atk: 70 }, traits: ['거구', '갑피', '보스', '가호:바다'] }, '해양 유적의 거대 해양괴수 — 하체가 수룡 · 상반신도 큼 · 3M 극대검'],
 ['소녀와 죄수', 'C-098', 4, { weapon: '둔기', height: 2.6, weight: 300, sizeCls: '중대형', ov: { hp: 620, atk: 46 }, traits: ['거구', '보스'] }, '저주에 잡힌 소녀와 그 죄수'],
 ['단달로', 'C-058', 5, { weapon: '장검', height: 2.2, weight: 120, ov: { hp: 820, atk: 58 }, traits: ['베테랑', '지휘A', '갑피', '보스'] }, '어느 마계의 대귀족 — 현명하지만 화나면 무섭다'],
 ['광대 마카로니', null, 5, { cls: '기동', weapon: '단검', height: 2.1, weight: 90, ov: { hp: 700, atk: 50 }, traits: ['회피S', '보스', '속력A'], active: ['도약'] }, '뿔 달린 광대 — 잡기 · 칼 던지기'],
 ['러버덕', null, 3, { role: '사수', weapon: '권총', ammo: 60, height: 1.7, weight: 60, ov: { hp: 220, atk: 44 }, traits: ['사격S', '회피B', '베테랑'] }, '3성 — 아주 강한 리볼버 사수'],
 ['배신자 셰도르', 'C-219', 4, { weapon: '장검', shield: true, height: 1.95, weight: 110, ov: { hp: 420, atk: 46 }, traits: ['베테랑', '갑피', '방어 자세'] }, '굴에서 신을 등진 기사 — 4성'],
 ['인공천사 벨', 'C-189', 1, { role: '사수', weapon: '권총', ammo: 40, height: 1.65, weight: 55, ov: { hp: 110, atk: 22 }, traits: ['신성B', '회피B'] }, '인공천사 — 천사종의 피조물 · 지능은 그렇게 높지 않다 · 양손 권총'],
 ['노라', null, 3, { role: '사수', weapon: '권총', ammo: 50, height: 1.8, weight: 70, ov: { hp: 300, atk: 42 }, traits: ['사격A', '은신S', '회피A'] }, '그림자 속 상인 — 탄약 · 희귀 총 · 약'],
 ['간호사장', 'C-095', 3, { role: '지원', cls: '치유', weapon: '마법', height: 1.7, weight: 60, ov: { hp: 220, atk: 18 }, traits: ['의학S'] }, '야전병원의 간호사장 — 본명은 비밀 (루미)']
].forEach(([key, ref, tier, o, note]) => { if (FOE8[key]) return; const d = { key, name: key, side: 1, ref: ref || undefined, tier, cls: o.cls || (o.role === '사수' || o.role === '지원' ? '원거리' : '근접'), role: o.role || '공격수', nv: true, nvG: 'A', tactic: note, note, ...o };
  if (ref && typeof idTraits === 'function') for (const t of idTraits(ref)) if (!d.traits.includes(t)) d.traits.push(t); FOE8[key] = d; });
// 인카운터 정예 · 히든 보스
Object.assign(ELITE8, {
  x_redgirl: { name: '붉은 소녀', foes: [['소녀와 죄수', 1], ['귀신 유령', 3]] },
  x_sardil: { name: '사르딜 락', foes: [['사르딜 락', 1]], relic: 'scale' },
  x_gamyu: { name: '거대 해양괴수 가뮤', foes: [['가뮤', 1], ['산호천사', 2]], relic: 'gamyu' },
  x_dandal: { name: '단달로', foes: [['단달로', 1], ['검은 뿔 귀족', 2], ['검은 장막 술사', 1]] },
  x_macaroni: { name: '광대 마카로니', foes: [['광대 마카로니', 1], ['꼬마악마', 3]] },
  x_yellow: { name: '노란악마의 영역', foes: [['노란악마녀', 1], ['노란악마', 5]] },
  x_pehto: { name: '페흐토', foes: [['페흐토', 1]] },
  x_mimic: { name: '미믹', foes: [['이질적인 기묘한 적', 2], ['기묘한 적 생물', 3]] },
  x_beast: { name: '짐승의 습격', foes: [['똥개', 4], ['굴 개', 2]] },
  x_ghost: { name: '유령들', foes: [['귀신 유령', 4]] },
  x_nora: { name: '노라', foes: [['노라', 1]] } });
Object.assign(BOSS8, {
  hargen: { name: '하르겐', foes: [['하르겐', 1]], map: 'hargen1', tear: 0 },
  dedura: { name: '과거의 칼데라 — 고대 몬스터 데두라', foes: [['고대 몬스터 데두라', 1], ['괴수 A', 2]], map: 'calderap' } });

// ---------- 히든 층 ----------
function r8Hidden(f){
  const R = R8S(); R.flags = R.flags || {}; R.hid = R.hid || {};
  if (R.hid[f]) return R.hid[f] === 'none' ? null : r8HiddenDef(R.hid[f]);
  let k = 'none';
  if (f >= 16 && f <= 28 && !R.flags.hargenSeen && !FIX8[f] && Math.random() < 0.07){ k = 'hargen'; R.flags.hargenSeen = 1; }
  else if (f >= 2 && f <= 9 && !R.flags.calderapSeen && !FIX8[f] && Math.random() < 0.06){ k = 'calderap'; R.flags.calderapSeen = 1; }
  R.hid[f] = k; return k === 'none' ? null : r8HiddenDef(k);
}
function r8HiddenDef(k){
  if (k === 'hargen') return { name: '✦ 하르겐의 성당 (히든)', band: 't_gothic', maps: [], narr: ['길이 갑자기 성당 쪽으로 꺾인다. 아무도 이 길을 말해 주지 않았다.', '긴 회랑 끝에 — 누군가 등을 돌리고 서 있다.'], hidden8: true,
    rows: [[{ t: 'fight', ms: 'pass', src8: 'hargen0a', empty: true }], [{ t: 'fight', ms: 'pass', src8: 'hargen0b', empty: true }], [{ t: 'boss', b: 'hargen' }, { t: 'stairs' }]] };
  if (k === 'calderap') return { name: '✦ 과거의 칼데라 (히든)', band: 't_caldera', maps: [], narr: ['칼데라 — 그러나 지금이 아닌 언젠가의.', '구멍 위로 무언가 둥둥 떠 있다. 가까이 갈수록 속이 뒤집힌다.'], hidden8: true, rows: [[{ t: 'fight', ms: 'open', src8: 'calderap' }], [{ t: 'boss', b: 'dedura' }, { t: 'stairs' }]] };
  return null;
}

// ---------- 손님 · 항복 (판마다) ----------
function r8GuestSpawn(W, n){
  const R = R8S(); if (!W || !R) return; R.flags = R.flags || {}; const hero = W.units.find(u => u.side === 0 && u.hero) || W.units.find(u => u.side === 0); if (!hero) return;
  const spawn = (key, tag) => { const d = foe8(key, R.f); const p = { ...fromDesign({ ...clone(d), side: 0, traits: (d.traits || []).filter(t => t !== '보스') }, 0), id: uid(), summon: true, r8guest: tag, x: hero.x + 0.6, y: hero.y + 0.4 }; lockIdentity(p); S.units.push(p); const u = addUnit(W, p); u.summon = true; u.r8guest = tag; logEv(W, { k: 'r8', s: `🤝 ${p.name} — 이번 싸움을 함께한다`, c: 'good', vis: true }); return u; };
  if (R.flags.rosinaHelp > 0){ R.flags.rosinaHelp--; spawn('로지나 (손님)', 'rosina'); }
  if (R.flags.shedorHelp > 0){ R.flags.shedorHelp--; spawn('배신자 셰도르', 'shedor'); }
  // 페흐토 — 4층 뒤 떠돌이 · 가끔 보통 싸움에 끼어듦 (죽였거나 · 동료거나 · 죽었으면 안 나옴)
  if (n && n.t === 'fight' && !n.champ && R.f >= 4 && !R.flags.pehtoDead && !R.party.some(p => p.name === '페흐토') && !R.dead.includes('페흐토') && Math.random() < 0.04){ spawn('페흐토', 'pehto'); logEv(W, { k: 'r8', s: '청염이 번진다 — 떠돌이 기사 페흐토가 이쪽 편에 선다. "이번만이다."', c: 'good', vis: true }); }
}
// 노라를 쓰러뜨림 (퇴로가 막혀 도망치지 못함) — 상품 모두 · 다시 안 나옴
function r8NoraLoot(rew){ const R = R8S(); R.gold += 120; for (const p of R.party) if (p.ammo) p.ammoLeft = p.ammo; const L = R.party.filter(p => /총|활|저격|소총|권총/.test(p.weapon || '')); for (const p of L){ p.ov = p.ov || {}; p.ov.atk = Math.round((p.ov.atk != null ? +p.ov.atk : statsOf({ ...p, ov: {} }, rules).atk) * 1.15); }
  for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, Math.round((p.hpNow != null ? p.hpNow : mx) + mx * 0.4)); }
  rew.push('노라의 짐 — 👛 120 · 탄 가득 · 귀한 총 (사수 ' + L.length + '명 공격 +15%) · 약 (모두 40% 회복)'); }
FOE8['로지나 (손님)'] = { key: '로지나 (손님)', name: '로지나', side: 1, ref: 'C-028', tier: 3, cls: '기동', role: '공격수', weapon: '단검', height: 1.75, weight: 60, nv: true, nvG: 'A', ov: { hp: 260, atk: 40 }, traits: ['회피A', '속력A', '야시'], active: ['도약'], tactic: '단달로의 시녀 — 위험하면 튐', note: '단달로의 부하이자 파트너 · 마족' };
function r8GuestTick(W){
  for (const u of W.units){
    if (u.anchor8 && u.alive){ u.x = u.anchor8.x; u.y = u.anchor8.y; u.vx = 0; u.vy = 0; if (u.kb) u.kb = null; }   // 진지 설비는 박혀 있음 (밀려도 제자리)
    if (u.side === 1 && u.name === '페흐토' && !u.alive && u.gone !== 'surr' && !u.r8drop){ u.r8drop = 1; R8S().flags.pehtoDead = 1;   // 죽이면 투구 · 망토 갑주 (고급) — 검은 쓰러질 때 떨어짐
      try { dropItem(W, u, 'helm', '페흐토의 투구', { mat: '판금', tier: 3, dur: 100, label: '페흐토의 투구 (고급)' }, 'pehto'); dropItem(W, u, 'armor', '페흐토의 망토 갑주', { mat: '사슬', tier: 3, dur: 100, label: '페흐토의 망토 갑주 (고급)' }, 'pehto'); } catch (e) {}
      logEv(W, { k: 'r8', s: '페흐토가 쓰러졌다. 청염이 꺼진 투구와 망토가 바닥에 남는다.', c: 'dim', vis: true }); }
    if (u.r8guest === 'rosina' && u.alive && !u.gone && u.hp / u.max < 0.35){ try { leaveMap(W, u, 'down'); } catch (e) { u.alive = false; u.gone = 'left'; } logEv(W, { k: 'r8', s: '로지나 — "위험하면 튄다고 했지?" (도망쳤다)', c: 'dim', vis: true }); }
    if (u.r8surr && u.alive && !u.gone && u.hp / u.max < 0.22){ const left = W.units.filter(o => o.side === 1 && o.alive && o !== u).length; if (u.r8surr.last && left) continue;
      u.alive = false; u.gone = 'surr'; u.order = null; u.act = null; W.r8.surr = { ref: u.ref, key: u.r8surr.key, name: u.name }; logEv(W, { k: 'r8', s: `🏳 ${u.name} — 무기를 내려놓는다. 항복.`, c: 'good', vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '항복', c: 'h', t0: W.t }); try { checkEnd(W); } catch (e) {} } }
}
function r8AfterSurr(W, then){
  const S8 = W && W.r8 && W.r8.surr; if (!S8) return false;
  const L = S8.key === '아해' ? [{ narr: '도깨비가 방망이를 내려놓고 털썩 주저앉는다.', img: IMG8.ahae }, { t: '…졌다, 졌어. 사람 주제에 제법이네. 담배 한 대만 줘.', name: '아해', img: IMG8.ahae }]
    : [{ narr: '청염이 꺼진다. 페흐토가 한쪽 무릎을 꿇는다.' }, { t: '…베어라. 아니면 — 데려가든가.', name: '페흐토' }];
  L.push({ ask: [['데려간다 (영입)', '!r8:surrJoin'], ['보내 준다', '!r8:surrLet']] }); R8T = then; R8S().flags.surr = S8; talkLines(L); return true;
}

// ---------- 맵 위 상시 NPC (MS 싸움판 구석) ----------
const MNPC8 = {
  tent: { who: '야전병원 천막', ref: 'C-095', img: IMG8.lumi, d: [2, 29], w: 1.2, hide: true, prop: 'H-132', seen: '하얀 천막 하나 — 소독약 냄새. 간호사장과 야전의사 파비가 있다. (싸움이 끝날 때까지 숨어 있었다)' },
  rosina: { who: '뿔 달린 여자', ref: 'C-028', img: IMG8.rosina, d: [4, 24], w: 0.8, seen: '골목 끝에서 뿔 달린 여자가 사탕을 굴리며 웃는다.' },
  smith: { who: '대장장이', ref: 'C-168', d: [2, 29], w: 0.8, prop: 'H-163', seen: '모루 소리. 대장장이 탄탄만이 화로 곁에 있다.' },
  shedor: { who: '홀로 선 기사', ref: 'C-219', d: [6, 28], w: 0.6, seen: '신의 문장을 긁어 지운 갑옷의 기사가 벽에 기대 있다.' },
  nora: { who: '그림자 속 상인', ref: null, img: IMG8.nora, d: [3, 29], w: 0.8, hide: true, seen: '그림자가 일어선다. 검은 꼬리 — 상인 노라다. (싸움 동안 어디 있었는지 모른다)' },
  wam: { who: '카드를 섞는 노인', ref: 'C-020', d: [3, 29], w: 0.55, prop: 'H-045', seen: '구석에 처박혀 앉은 노인이 카드를 섞는다. 머리 위에 촛대가 탄다 — 왐이다.' },
  marie: { who: '모닥불 곁의 부부', ref: 'C-022', d: [5, 25], w: 0.5, seen: '모닥불 곁에 부부가 앉아 있다. 마리와 와킨.' },
  aiten: { who: '토끼마차', ref: 'C-033', d: [2, 29], w: 0.45, seen: '어둠 속에 마차 한 대. 등불 아래 토끼 귀 소녀가 손을 흔든다 — 아이텐.' },
  ahae: { who: '처마 위의 도깨비', ref: 'C-082', img: IMG8.ahae, d: [6, 14], themes: ['yokai'], w: 1.4, seen: '처마 위에서 담배를 문 도깨비가 내려다본다 — 아해.' } };
for (const [k, M] of Object.entries(MNPC8)) NPC['m_' + k] = { key: '', ref: M.ref || undefined, who: M.who, x: 0, y: 0, img: M.img || null, st0: 'sit', fromRef: !!M.ref, talkR: 6, node: () => 'start', seen: M.seen, foeLine: '…' };
const r8T = (k, L) => { TALK['m_' + k] = { start: L, greet: L, declined: L }; };
r8T('tent', [{ t: '다친 사람부터 눕혀요. 순서는 내가 정해요.', name: '간호사장', img: IMG8.lumi }, { t: '…(파비가 말없이 붕대를 꺼낸다)', name: '야전의사 파비', img: IMG8.fabi }, { ask: [['치료받는다 (모두 50%)', '!r8:mnTentHeal'], ['조금 쉰다 (바이올린)', '!r8:mnTentRest'], ['간호사장과 이야기한다', '!r8:mnTentTalk'], ['간호사를 데려간다 (1성)', '!r8:mnTentNurse'], ['떠난다', '']] }]);
r8T('rosina', [{ t: '재밌어 보이네. 다음 싸움, 내가 끼어 줄까? 위험하면 튈 거지만.', name: '로지나', img: IMG8.rosina }, { ask: [['같이 싸워 줘 (두 판)', '!r8:mnRosinaHelp'], ['단달로의 저택으로 데려가 줘', '!r8:mnRosinaHouse'], ['괜찮아', '']] }]);
r8T('smith', [{ t: '날 무뎌진 거 다 보여. 동전 40 이면 한 놈 무기를 손봐 주지.', name: '탄탄만' }, { ask: [['맡긴다 (40)', '!r8:smith'], ['지나간다', '']] }]);
r8T('shedor', [{ t: '…신을 등진 놈하고 말을 섞겠다고?', name: '배신자 셰도르' }, { t: '좋아. 싸움이라면 거들지. 배신? 그건 신한테만 했어.', name: '배신자 셰도르' }, { ask: [['함께 싸워 줘 (두 판)', '!r8:mnShedorHelp'], ['같이 가자 (영입)', '!r8:mnShedorJoin'], ['지나간다', '']] }]);
r8T('nora', [{ t: '살 거야, 말 거야? 탄약 · 귀한 총 · 그리고 — 조금 위험한 약.', name: '노라', img: IMG8.nora }, { ask: [['탄약 (25) — 모두 탄 가득', '!r8:mnNoraAmmo'], ['귀한 총 (70) — 사수 한 명 공격 +15%', '!r8:mnNoraGun'], ['약 (30) — 모두 40% 회복 · 가끔 탈', '!r8:mnNoraDrug'], ['덮친다', '!r8:mnNoraFight'], ['됐어', '']] }]);
r8T('wam', [{ t: '한 판 할래? 이기면 하나 주고, 지면 하나 가져가지.', name: '왐' }, { ask: [['한 판 한다 (유물을 건다)', '!r8:wamPlay'], ['지나간다', '']] }]);
r8T('marie', [{ t: '아래로 가요? 우리도 마침 내려가려던 참인데.', name: '마리' }, { ask: [['함께 가자', '!r8:marie'], ['지나간다', '']] }]);
r8T('aiten', [{ t: '구경은 공짜예요! 사는 건 공짜가 아니고요.', name: '아이텐' }, { ask: [['물건을 본다', '!r8:mnAiten'], ['지나간다', '']] }]);
r8T('ahae', [{ t: '사람이네? 오랜만이다. 술 있냐?', name: '아해', img: IMG8.ahae }, { ask: [['동전 30 을 건넨다 (영입)', '!r8:ahae'], ['지나간다', '']] }]);
// MS 판을 만든 뒤: 구석에 NPC 하나 (보스 · 정예 · 칼데라 · 지나가기 빼고 28%)
function r8NpcPlace(n, W){
  const R = R8S(), F = F8[R.f] || {}, C = S.camp; if (!W || !C || n.t !== 'fight' || n.ms === 'open' || n.champ || n.empty) return;
  if (n.npc8 === undefined){ n.npc8 = null; if (Math.random() < 0.28){ const have = new Set([...R.party.map(p => p.name), ...R.dead]);   /* 죽은 단독 개체는 다시 안 나옴 */ const L = Object.entries(MNPC8).filter(([k, M]) => R.f >= M.d[0] && R.f <= M.d[1] && (!M.themes || M.themes.includes(F.theme)) && !(R.npcGone || []).includes(k) && !(k === 'ahae' && have.has('아해')) && !(k === 'marie' && have.has('마리')) && !(k === 'nora' && R.flags.noraDead)).map(([k, M]) => [k, M.w]); if (L.length) n.npc8 = r8WPick(L); } save(); }
  const k = n.npc8; if (!k) return; const M = MNPC8[k], m = W.map;
  // 들어선 곳에서 25 ~ 50% 거리 · 둘레가 빈 바닥
  const inn = (MAPS8[S.art8] || {}).in || [0, 0, 1, 1], cx = (inn[0] + inn[2]) / 2, cy = (inn[1] + inn[3]) / 2, cand = [];
  for (let y = 1; y < m.H - 1; y++) for (let x = 1; x < m.W - 1; x++){ if (m.t[y * m.W + x] !== 0) continue; let free = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (m.t[(y + dy) * m.W + x + dx] === 0) free++; if (free < 9) continue; const d = Math.hypot(x - cx, y - cy); cand.push({ x, y, d }); }
  if (!cand.length) return; cand.sort((a, b) => a.d - b.d); const far = cand[cand.length - 1].d, L2 = cand.filter(c => c.d > far * 0.25 && c.d < far * 0.5); const c = r8Pick(L2.length ? L2 : cand);
  const E = { npc: 'm_' + k, st: M.hide ? 'hidden' : 'sit', x: c.x + 0.5, y: c.y + 0.5, seen: false, n: 0, r8: k, hide: !!M.hide };
  (C.stages[1] = C.stages[1] || {}).enc = E; if (M.prop){ const MM = MAPS8[S.art8]; if (MM){ MM.props = (MM.props || []).filter(p => !p.npc8); MM.props.push({ id: M.prop, x: c.x - 0.5, y: c.y - 1.6, w: 2, h: 1, decor: true, npc8: true }); } }
  if (k === 'ahae' && Math.random() < 0.5){ C.stages[1].enc = null; const d = foe8('아해', R.f); const p = { ...fromDesign(clone(d), 1), id: uid(), x: c.x + 0.5, y: c.y + 0.5 }; lockIdentity(p); S.units.push(p); const u = addUnit(W, p); u.r8surr = { key: '아해', last: true }; logEv(W, { k: 'r8', s: '도깨비 아해가 적 쪽에 섞여 있다 — 마지막에 혼자 남아 빈사면 항복할지도.', c: 'dim', vis: true }); }
}
function r8FollowTick(W){   // 명세 A9: 비전투 맵 — 대장이 방 · 길로 들어서면 모두 들어선 것으로 침
  if (W.over || W.r8fol) return; const h = W.units.find(u => u.side === 0 && u.hero); if (!h || (h.gone !== 'up' && h.gone !== 'down')) return;
  if (W.units.some(u => u.side === 1 && u.alive)) return; W.r8fol = 1;
  const L = W.units.filter(u => u.side === 0 && u.alive && !u.down && !u.r8guest); for (const u of L) leaveMap(W, u, h.gone);
  if (L.length) logEv(W, { k: 'r8', s: '남은 이들도 함께 넘어간다.', c: 'dim', vis: true }); try { checkEnd(W); } catch (e) {}
}
function r8NpcTick(W){
  r8FollowTick(W); r8SealTick(W);
  const C = S.camp, E = C && C.stages && C.stages[1] && C.stages[1].enc; if (!E || !E.r8) return;
  if (E.st === 'hidden' && W.cleared){ E.st = 'sit'; logEv(W, { k: 'r8', s: `${MNPC8[E.r8].who} — 숨어 있다가 나온다`, c: 'dim', vis: true }); campBarRender(true); }
}

// ---------- 도감 조우 장면 카드 (S 칸) ----------
const CARD8 = /*CARDS8*/[];
const CARDATLAS8 = /*CARDATLAS8*/{};   // id → [묶음, x, y, w, h, 묶음 너비, 묶음 높이]
// 대화 줄 { card: id } → 가운데 큰 그림 (talkShow 가 줄마다 부름 · 없는 줄이면 숨김)
function r8CardShow(L){
  const T0 = $('talk'); if (!T0) return; let el = $('tkCard8'); const a = L && L.card && CARDATLAS8[L.card];
  if (!a){ if (el) el.hidden = true; return; }
  if (!el){ el = document.createElement('div'); el.id = 'tkCard8'; el.style.cssText = 'position:absolute;left:50%;top:5%;transform:translateX(-50%);background-repeat:no-repeat;border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.6);pointer-events:none;z-index:0'; T0.insertBefore(el, T0.firstChild); }
  const H = Math.max(120, Math.min(T0.clientHeight * 0.6, (T0.clientWidth * 0.9) * a[4] / a[3])), k = H / a[4];
  el.style.height = H + 'px'; el.style.width = (a[3] * k) + 'px'; el.style.backgroundImage = `url(art/card/atlas${a[0]}.webp)`; el.style.backgroundSize = `${a[5] * k}px ${a[6] * k}px`; el.style.backgroundPosition = `${-a[1] * k}px ${-a[2] * k}px`; el.hidden = false;
}
// 카드 이름으로 갈래를 어림: 쉼 · 거래 · 보물 · 습격 · 망자 · 신성 · 문 · 기묘
function r8CardKind(c){
  const s = c.name + ' ' + (c.txt || '');
  if (/모닥불|야영|샘|쉼|온천|여관|식당|요리|커피|팬케이크|빨래/.test(s)) return 'rest';
  if (/상인|거래|마트|자판기|현금|저울|정비소|가게|팔/.test(s)) return 'trade';
  if (/보물|상자|지도|금화|왕관|수정/.test(s)) return 'treasure';
  if (/습격|짐승|괴물|아가리|늑대|창병|전투|미믹|사냥/.test(s)) return 'fight';
  if (/유령|해골|시체|사체|무덤|관|장례|난파|쓰러진/.test(s)) return 'dead';
  if (/기도|제단|성|수도자|부적|여신|신|천사|일식|달/.test(s)) return 'holy';
  if (/문|계단|차원|이정표|갈림길|탑|다리/.test(s)) return 'door';
  return 'odd';
}
const CARD_TXT8 = {
  rest: ['잠깐 숨을 돌릴 수 있을 것 같다.', [['쉰다 (모두 25% 회복)', 'cRest'], ['지나간다', 'done']]],
  trade: ['누군가 무언가를 팔고 있다. 값은 — 굴의 값이다.', [['동전 45 를 낸다 (유물 하나)', 'cBuy'], ['동전 20 을 낸다 (모두 15% 회복)', 'cBuyHeal'], ['지나간다', 'done']]],
  treasure: ['반짝이는 것이 있다. 너무 쉽게 놓여 있다.', [['연다', 'cOpen'], ['손대지 않는다', 'done']]],
  fight: ['무언가가 이쪽을 노린다. 피할 수 있을까?', [['맞선다 (싸움)', 'cFight'], ['몰래 돌아간다 (들킬 수도)', 'cSneak']]],
  dead: ['죽은 것들의 자리. 무언가 남아 있다.', [['뒤진다 (동전 · 저주가 붙을 수도)', 'cLoot'], ['고개를 숙이고 지나간다', 'cBow']]],
  holy: ['무언가 성스러운 — 혹은 그런 척하는 것.', [['기도한다', 'cPray'], ['지나간다', 'done']]],
  door: ['길이 하나 더 있다. 어디로 이어질지 모른다.', [['들어간다', 'cDoor'], ['원래 길로 간다', 'done']]],
  odd: ['굴은 가끔 이상한 것을 보여 준다.', [['다가간다', 'cOdd'], ['못 본 척한다', 'done']]] };
function r8Card(n){
  const R = R8S(); R.cardSeen = R.cardSeen || [];
  let c = n.card8 && CARD8.find(x => x.id === n.card8);
  if (!c){ const L = CARD8.filter(x => !R.cardSeen.includes(x.id)); c = r8Pick(L.length ? L : CARD8); n.card8 = c.id; R.cardSeen.push(c.id); save(); }
  const k = r8CardKind(c), T = CARD_TXT8[k]; R.cardNow = { id: c.id, k, name: c.name };
  r8Hide(); talkLines([{ narr: c.name + (c.txt ? ' — ' + c.txt : ''), card: c.id }, { narr: T[0], card: c.id }, { ask: T[1].map(([a, b]) => [a, '!r8:' + b]) }]);
}

// ---------- 이름 있는 만남 (S 칸 · x:) ----------
const XENC8 = [   // [키, 무게, 층 범위]
  ['firewood', 1, 2, 22], ['lonely', 0.8, 4, 28], ['redgirl', 0.6, 6, 20], ['chicken', 0.7, 3, 25], ['beach', 0.6, 10, 26], ['planet', 0.5, 14, 29], ['mouth', 0.5, 16, 29], ['odileh', 0.12, 5, 25],
  ['reeds', 0.8, 6, 14], ['pehtoR', 0.45, 4, 28], ['lakeruin', 0.35, 5, 20], ['gamyu', 0.3, 12, 26], ['spiral', 0.55, 4, 28], ['dandal', 0.35, 6, 22], ['bell', 0.7, 2, 20], ['duck', 0.4, 8, 26], ['macaroni', 0.35, 10, 28], ['yellowd', 0.45, 11, 19], ['tehera2', 0.2, 12, 29], ['aitem', 0.4, 6, 26]];
const cg8 = k => ({ cg: 's_' + k, cgw: true });
function r8XEvent(n, k){
  const R = R8S(); R.flags = R.flags || {}; r8Hide(); const go = a => '!r8:x_' + a; if (!(R.npcDone = R.npcDone || []).includes('x:' + k)) R.npcDone.push('x:' + k); save();
  const EV = {
    firewood: [{ narr: '벽난로가 있는 방. 수녀와 악마가 나란히 앉아, 말없이 장작에 무언가를 넣고 있다.', ...cg8('firewood') }, { narr: '불 속에서 — 종이 같은 것이 타며 누군가의 웃음소리가 난다.', ...cg8('firewood') }, { ask: [['불가에 앉는다', go('fireSit')], ['무엇을 넣는지 들여다본다', go('fireLook')], ['조용히 나간다', '!r8:done']] }],
    lonely: [{ narr: '흑백의 체크 바닥. 의자 하나. 아무도 없다.', ...cg8('lonely') }, { narr: '의자가 — 누군가를 기다리는 것 같다.', ...cg8('lonely') }, { ask: [['누군가 앉는다', go('lonelySit')], ['아무도 앉지 않는다', '!r8:done']] }],
    redgirl: [{ narr: '붉은 숲 사이로 하얀 길. 길 끝에 소녀가 서 있고, 그 뒤에 쇠사슬에 묶인 거대한 죄수가 있다.', ...cg8('redgirl') }, { t: '…같이 놀아 줄래?', name: '붉은 소녀' }, { ask: [['싸운다 (정예)', go('redFight')], ['돌아간다', '!r8:done']] }],
    chicken: [{ narr: '모니터와 기계로 가득한 방. 의자에 — 닭 한 마리가 앉아 있다.', ...cg8('chicken') }, { narr: '닭이 키보드를 쪼고, 화면에 숫자가 흐른다. 닭이 이쪽을 본다.', cg: 's_chickenp' }, { ask: [['닭에게 말을 건다', go('chickTalk')], ['모니터를 본다', go('chickScreen')], ['닭을 잡는다', go('chickGrab')]] }],
    beach: [{ narr: '굴 속의 해변. 파도가 진짜처럼 밀려온다.', ...cg8('beach') }, { narr: '모래 위에 누워 잠깐 눈을 감는다.', ...cg8('beach') }, { ask: [['쉰다 (모두 회복)', go('beachRest')], ['바닷가를 걷는다', go('beachWalk')]] }],
    planet: [{ narr: '하늘이 없다. 회색 달의 표면 — 머리 위로 별이 쏟아진다.', ...cg8('planet') }, { narr: '분화구 가장자리에 둥근 머리의 외계인이 뭔가를 재고 있다. 차원을 연구하는 비키다.', ...cg8('space') }, { ask: [['말을 건다', go('vicky')], ['지나간다', '!r8:done']] }],
    mouth: [{ narr: '끝없는 사막. 하늘은 우주. 저 끝에 — 거대한 붉은 입이 놓여 있다.', ...cg8('mouth') }, { narr: '입이 지껄인다. 지금까지 우리가 한 일을, 하나도 빠짐없이.', ...cg8('mouth') }, { go: go('mouthTalk') }],
    odileh: [{ narr: '남색 응접실. 찻잔이 두 개. 휠체어에 앉은 여인이 눈을 감고 있다.', ...cg8('odileh') }, { t: '…이 시간의 나를 만나다니. 운이 좋은 건지, 나쁜 건지.', name: '신성 오딜', img: IMG8.holy1 }, { ask: [['차를 마신다', go('holyTea')], ['낙인을 지워 달라고 한다', go('holyBrand')], ['인사하고 나간다', '!r8:done']] }],
    reeds: [{ narr: '은빛 갈대밭. 바람도 없는데 갈대가 흔들린다. 요괴 장사꾼이 갈대 사이에 좌판을 폈다.', ...cg8('reeds') }, { ask: [['좌판을 본다 (동전 30 — 모두 10% 회복 · 유물이 섞였을지도)', go('reedShop')], ['갈대밭 깊이 들어간다', go('reedDeep')], ['지나간다', '!r8:done']] }],
    pehtoR: [{ narr: '흰 원형 신전. 나침반 무늬 바닥 한가운데에 청염이 이는 검을 든 마족 기사가 서 있다.', ...cg8('ruina') }, { t: '지나가려면 실력을 보여라.', name: '페흐토' }, { ask: [['싸운다', go('pehtoFight')], ['돌아간다', '!r8:done']] }],
    lakeruin: [{ narr: '둥근 검은 못. 테두리 회랑에 아무도 없다 — 잡몹 하나 없다.', ...cg8('lakeruin') }, { narr: '못 가운데에서 푸른 비늘의 용이 고개를 든다.', img: IMG8.sardil2 }, { t: '…또 왔나, 작은 것들.', name: '사르딜 락', img: IMG8.sardil }, { ask: [['싸운다 (보스)', go('sardilFight')], ['말을 건다', go('sardilTalk')], ['물러난다', '!r8:done']] }],
    gamyu: [{ narr: '바다 밑의 흰 산호 성소. 물이 무겁다.', ...cg8('deep2') }, { narr: '산호 너머에서 — 하체가 거대한 수룡인 괴수가 몸을 일으킨다. 3M 짜리 극대검을 든 채로.', cg: 's_gamyu' }, { t: '…누가 내 바다에 불을 들고 왔지?', name: '가뮤', img: IMG8.gamyu }, { ask: [['싸운다 (보스 · 가뮤의 대검)', go('gamyuFight')], ['물러난다', '!r8:done']] }],
    spiral: [{ narr: '아래로, 아래로 감기는 나선 계단. 지식의 나선.', ...cg8('spiral0') }, { narr: '계단 중간에 피곤한 직원이 서류를 넘긴다. "입장권은 필요 없어요. 나갈 때 내는 거라."', cg: 's_clerk' }, { narr: '하층의 사무실들을 지나 — 맨 아래, DVD 방.', ...cg8('spiral4') }, { narr: '계산대 뒤에 해골 왕이 앉아 있다. "골라. 하나만."', cg: 's_dvdking' }, { ask: [['낡은 전쟁 기록 (한 명 성장)', go('dvdWar')], ['누군가의 일기 (모두 최대 체력 +4)', go('dvdDiary')], ['제목 없는 것', go('dvdBlank')], ['아무것도 안 고른다', '!r8:done']] }],
    dandal: [{ narr: '로지나가 문을 연다. 단달로의 저택.', ...cg8('dandal1') }, { narr: '긴 복도. 초상화의 눈이 따라온다.', ...cg8('dandal2') }, { narr: '메인 룸. 소파에 앉은 대귀족이 잔을 든다.', ...cg8('dandal3') }, { t: '로지나가 데려온 손님이로군. 앉게. 굴에서 이런 대접은 드물 테니.', name: '단달로' }, { ask: [['쉬어 간다 (모두 회복 · 로지나의 방)', go('dandalRest')], ['거래한다 (동전 80 — 유물)', go('dandalDeal')], ['검을 뽑는다', go('dandalFight')]] }],
    bell: [{ narr: '하늘에서 무언가 떨어진다 — 광륜, 푸른 날개, 그리고 양손에 권총.', img: IMG8.bell }, { t: '앗! 사람이다! 저기, 저기요! 여기가 어디예요?', name: '인공천사 벨', img: 'talk/bell_t6' }, { t: '저 길을 잃었는데… 같이 가도 돼요? 저 총은 잘 쏴요! …아마도요!', name: '인공천사 벨', img: 'talk/bell_t5' }, { ask: [['같이 가자', go('bellJoin')], ['미안하지만…', go('bellNo')]] }],
    duck: [{ narr: '검은 마녀 모자의 여자가 리볼버를 돌린다. 발밑에 고무 오리가 굴러다닌다.', img: IMG8.duck }, { t: '러버덕이라고 불러. 동전 60 이면 한동안 같이 쏴 주지. 3성이야, 싸게 부르는 거라고.', name: '러버덕', img: IMG8.duck }, { ask: [['고용한다 (60 — 영입)', go('duckJoin')], ['됐어', '!r8:done']] }],
    macaroni: [{ narr: '천막도 없는 서커스. 뿔 달린 광대가 칼을 저글링한다.', img: IMG8.macaroni }, { t: '관객이다! 관객이 왔어! 자, 한 판 — 맞히면 상품, 틀리면… 웃어 줘.', name: '광대 마카로니', img: IMG8.macaroni }, { ask: [['내기를 한다 (동전 30)', go('macBet')], ['광대를 친다 (보스)', go('macFight')], ['박수만 치고 간다', '!r8:done']] }],
    yellowd: [{ narr: '보라색 문 앞의 넓은 터. 바닥이 노랗게 그을렸다 — 노란악마들의 영역.', ...cg8('abyss5') }, { narr: '노란 뿔의 악마들이 일제히 고개를 든다. 사냥감을 본 눈이다.' }, { ask: [['싸운다 (정예)', go('yellowFight')], ['도망친다 (한 명 다칠 수도)', go('yellowRun')]] }],
    tehera2: [{ narr: '우주 한가운데 바위 다리. 잠자리 같은 날개의 여인이 다리 끝에 앉아 있다.', cg: 'bg_tehera', cgw: true }, { t: '…같이 가자고?', name: '테헤라' }, { ask: [['같이 가자', '!r8:tehera1'], ['지나간다', '!r8:done']] }],
    aitem: [{ narr: '금빛 아치가 끝없이 이어진 회랑.', cg: 'bg_aitem', cgw: true }, { narr: '거대한 몸, 목에 빛나는 보석을 단 누군가가 수수께끼를 낸다 — 아템.', card: 'ENC-riddle' }, { t: '아침엔 넷, 낮엔 둘, 밤엔 셋. 그런데 굴에선 몇이지?', name: '아템' }, { ask: [['"하나"', go('riddleA')], ['"없어"', go('riddleB')], ['"세는 사람 마음"', go('riddleC')]] }] };
  talkLines(EV[k] || EV.firewood);
}
// 만남 목록에 넣기: x: 와 카드 c:
ENC8.push(...XENC8.map(([k, w, a, b]) => ['x:' + k, w, a, b]), ['c:card', 7, 2, 29]);
for (const e of ENC8) if (e[0] === 't:pehto' || e[0] === 't:tehera') e[1] = 0;   // 유적의 페흐토 · 테헤라 맵으로 옮김

// ---------- 행동 ----------
// 판 안 (MS 싸움판 · 맵 위 NPC 와 대화 중) 인지 — 그러면 대화가 끝나도 지도로 가지 않음 · 영입은 판에 바로
function r8InMap(){ return !!(world && world.r8 && !world.over && S.camp && S.camp.s === 1); }
function r8PutIn(p){ lockIdentity(p); const hero = world.units.find(u => u.side === 0 && u.alive && u.hero) || world.units.find(u => u.side === 0 && u.alive); p.x = (hero ? hero.x : 2) + 0.5; p.y = (hero ? hero.y : 2) + 0.5; S.units.push(p); const u = addUnit(world, p); logEv(world, { k: 'r8', s: `🤝 ${p.name} — 일행에 합류`, c: 'good', vis: true }); return u; }
// ---------- v8.7.1.1 봉인된 출구 (A4 퍼즐) ----------
function r8Seals(W){
  const m = W.map, al = W.units.filter(u => u.side === 0 && u.alive); if (!al.length) return; const h = al.find(u => u.hero) || al[0];
  const d = new Int32Array(m.W * m.H).fill(-1), q = [[Math.floor(h.x), Math.floor(h.y)]]; d[q[0][1] * m.W + q[0][0]] = 0;
  for (let i = 0; i < q.length; i++){ const [x, y] = q[i]; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const a = x + dx, b = y + dy; if (a < 1 || b < 1 || a >= m.W - 1 || b >= m.H - 1 || d[b * m.W + a] >= 0 || m.t[b * m.W + a] !== 0) continue; d[b * m.W + a] = d[y * m.W + x] + 1; q.push([a, b]); } }
  const far = Math.max(...d); const L = q.filter(([x, y]) => d[y * m.W + x] > far * 0.25); const S0 = [];
  for (let k = 0; k < 600 && S0.length < 3; k++){ const c = L[Math.floor(Math.random() * L.length)]; if (!c) break; const gap = k < 200 ? 7 : k < 400 ? 5 : 3; if (S0.some(o => Math.hypot(o.x - c[0], o.y - c[1]) < gap)) continue;   /* 좁은 맵은 문양 사이를 좁힘 */ if (W.stairs && Math.hypot(W.stairs.x - c[0], W.stairs.y - c[1]) < 4) continue; S0.push({ x: c[0] + 0.5, y: c[1] + 0.5, on: false }); }
  if (S0.length < 3) return; W.r8.seals = S0; W.exitLock = true;
  logEv(W, { k: 'r8', s: '🔮 출구가 봉인되어 있다 — 바닥의 빛나는 문양 셋을 밟으면 열린다 (적은 아직 자고 있다)', c: 'dim', vis: true });
}
function r8SealTick(W){
  const L = W.r8 && W.r8.seals; if (!L || W.r8.sealOpen) return; if (W.cleared){ W.r8.sealOpen = 1; return; }
  for (const s of L){ if (s.on) continue; const near = W.units.some(u => u.side === 0 && u.alive && Math.hypot(u.x - s.x, u.y - s.y) <= 0.8); if (!near){ s.since = null; continue; } if (s.since == null) s.since = W.t; if (W.t - s.since >= 0.8){ s.on = true; logEv(W, { k: 'r8', s: `문양 하나가 켜졌다 (${L.filter(o => o.on).length}/${L.length})`, c: 'good', vis: true }); } }
  if (L.every(o => o.on)){ W.r8.sealOpen = 1; W.exitLock = false; logEv(W, { k: 'r8', s: '🔓 봉인이 풀렸다 — 출구가 열렸다', c: 'good', vis: true }); try { campBarRender(true); } catch (e) {} }
}
function r8DrawI(Wd, ox, oy, ts){
  const L = Wd.r8 && Wd.r8.seals; if (!L) return; const t = performance.now() / 500;
  for (const s of L){ const x = ox + s.x * ts, y = oy + s.y * ts, r = ts * 0.55; ctx.save(); ctx.lineWidth = Math.max(1.5, ts * 0.07);
    ctx.strokeStyle = s.on ? 'rgba(250,210,120,.95)' : `rgba(170,130,255,${0.45 + 0.3 * Math.sin(t + s.x)})`; ctx.fillStyle = s.on ? 'rgba(250,210,120,.25)' : 'rgba(150,110,255,.12)';
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.beginPath(); for (let i = 0; i < 6; i++){ const a = i * 1.047 + (s.on ? 0 : t * 0.3); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); } ctx.stroke(); ctx.restore(); }
}
// ---------- v8.7.1.1 진지 설비 (A7): 팩션마다 보급한 포대 — 움직이지 않는 적 (같은 사격 규칙 · 부술 수 있음) ----------
const TURRET8 = { iron: ['철벽 포대', '소총', '판금'], urban: ['기관포 진지', '소총', '판금'], mech: ['기계 포탑', '소총', '판금'], arc: ['아크 방어탑', '마법', null], odd: ['기묘한 방어 장치', '마법', null], grim: ['생체 포탑', '총', '가죽'], camp: ['쇠뇌 노포', '활', null] };
function r8Turrets(W){
  const R = R8S(), F = F8[R.f] || {}, T = THEME8[F.theme] || {}, D = TURRET8[T.fort]; const M = MAPS8[S.art8]; if (!D || !M) return 0;
  const m = W.map, inn = M.in || [0, 0, 1, 1], cx = (inn[0] + inn[2]) / 2, cy = (inn[1] + inn[3]) / 2; let n = 0;
  const dIn = q => Math.hypot(q.x + q.w / 2 - cx, q.y + q.h / 2 - cy); let P = (M.props || []).filter(q => q.big).slice(0, 2);
  if (!P.length) P = (M.props || []).filter(q => q.id && q.id !== 'wall' && !q.decor && !q.npc8).sort((a, b) => dIn(b) - dIn(a)).slice(0, 1);   // 큰 설비를 못 놓은 좁은 진지: 가장 먼 바리케이드 뒤
  if (!P.length && M.out) P = [{ x: M.out[0] - 1, y: M.out[1] - 1, w: 2, h: 2 }];   // 소품이 하나도 없는 진지: 출구를 지키는 설비
  for (const p of P){
    let best = null; for (let y = p.y - 1; y <= p.y + p.h; y++) for (let x = p.x - 1; x <= p.x + p.w; x++){ if (x < 1 || y < 1 || x >= m.W - 1 || y >= m.H - 1 || m.t[y * m.W + x] !== 0) continue; if (W.units.some(u => u.alive && Math.hypot(u.x - x - 0.5, u.y - y - 0.5) < 0.9)) continue; const dd = Math.hypot(x - cx, y - cy); if (!best || dd > best.d) best = { x, y, d: dd }; }
    if (!best) continue;
    const d = { key: D[0], name: D[0], side: 1, tier: 3, cls: '원거리', role: '사수', weapon: D[1], ammo: 999, height: 1.5, weight: 900, sizeCls: '대형', nv: true, nvG: 'A', ov: { hp: 240 + R.f * 10, atk: 24 + R.f, spd: 0.01 }, traits: ['갑피'], tactic: '진지 설비 — 움직이지 않음', note: `${T.name || ''} 팩션이 보급한 설비`, turret8: true, ...(D[2] ? { gear: { 몸: { name: D[0] + ' 장갑', mat: D[2], tier: 3 } } } : {}) };
    const u0 = { ...fromDesign(d, 1), id: uid(), x: best.x + 0.5, y: best.y + 0.5 }; try { lockIdentity(u0); } catch (e) {} S.units.push(u0); const u = addUnit(W, u0); u.turret8 = true; u.mass = Math.max(u.mass || 0, 2000); u.anchor8 = { x: u.x, y: u.y }; n++; }
  if (n) logEv(W, { k: 'r8', s: `⚙ 적 진지에 설비 ${n} — ${D[0]} (움직이지 않음 · 부술 수 있음)`, c: 'dim', vis: true });
  return n;
}
// 판을 만든 뒤 (r8BattleHook 끝에서): 손님 · 맵 위 NPC · 항복할 수 있는 적 · 빈 회랑
function r8HookI(n, W){
  if (!W || !W.r8) return; r8GuestSpawn(W, n); r8NpcPlace(n, W);
  if (n.surr) for (const u of W.units) if (u.side === 1 && u.name === n.surr){ u.r8surr = { key: n.surr }; }
  if (n.empty){ W.exitLock = false; W.r8.pass = true; logEv(W, { k: 'r8', s: '…아무도 없다. 발소리만 울린다.', c: 'dim', vis: true }); }
  if (n.ms === 'pass' && !n.empty && !n.champ && ((n.seed || 7) % 100) < 35) r8Seals(W);   // v8.7.1.1 봉인된 출구
  if (n.ms === 'fort' && n.t === 'fight') r8Turrets(W);   // v8.7.1.1 진지 설비
}
function r8JoinNow(key, txt, then){   // 판 안이면 판에 바로 (여정 동료로 셈) · 판 밖이면 r8Recruit
  const R = R8S(), d = FOE8[key] ? foe8(key, Math.max(2, R.f - 4)) : null;
  if (!d){ then && then(); return; }
  if (R.party.length >= R8.cap){ talkLines([{ narr: txt || '' }, { box: `동료가 가득 차서 (${R8.cap}) 함께 갈 수 없었다.` }, { go: '!r8:then' }]); R8T = then; return; }
  const p = { ...fromDesign({ ...clone(d), side: 0, traits: (d.traits || []).filter(t => t !== '보스') }, 0), id: uid(), side: 0 }; lockIdentity(p);
  if (r8InMap()) r8PutIn(p); else R.party.push(p);
  save(); talkLines([{ narr: txt || `${p.name} — 동료가 되었다.` }, { box: `${p.name} 합류` }, { go: '!r8:then' }]); R8T = then;
}
const r8HealAll = k => { const R = R8S(); for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, Math.round((p.hpNow != null ? p.hpNow : mx) + mx * k)); } if (world && world.r8) for (const u of world.units) if (u.side === 0 && u.alive) u.hp = Math.min(u.max, u.hp + u.max * k); };
const r8MaxUp = (p, n) => { p.ov = p.ov || {}; p.ov.hp = (p.ov.hp != null ? +p.ov.hp : statsOf({ ...p, ov: {} }, rules).hp) + n; };
const r8Curse = (p, nm, hp) => { p.curses = [...(p.curses || []), nm]; r8MaxUp(p, -(hp || 6)); };
function r8XFight(key, src8, extra){ const R = R8S(), n = r8Node(R.at); if (!n) return; n.t = 'elite'; n.e = key; n.src8 = src8 || n.src8; n.s = true; Object.assign(n, extra || {}); save(); r8Hide(); r8Battle(n); }
const X8 = {};
const r8Say = (L, then) => { R8T = then || (() => r8NodeDone()); talkLines([...L, { go: '!r8:then' }]); };
const r8Who = () => { const R = R8S(); return r8Pick(R.party.filter(p => !p.hero).concat(R.party)); };
Object.assign(X8, {
  // 맵 위 NPC
  mnTentHeal(){ r8HealAll(0.5); const R = R8S(); R.flags.lumiV = (R.flags.lumiV || 0) + 1; r8Say([{ narr: '파비가 말없이 상처를 꿰맨다. 간호사장이 순서를 부른다.' }, { box: '모두 50% 회복' }], () => { campBarRender(true); }); },
  mnTentRest(){ r8HealAll(0.2); const R = R8S(); R.flags.lumi = (R.flags.lumi || 0) + 1; const L = [{ narr: '간호사장이 바이올린을 꺼낸다. 잠깐 — 굴을 잊는다.', img: IMG8.lumi }, { box: `모두 20% 회복 · 간호사장과의 인연 ${R.flags.lumi}` }];
    if (R.flags.lumi >= 5 && !R.relics.includes('violin')){ R.relics.push('violin'); L.push({ t: '…가져가요. 내가 없을 때도 들을 수 있게.', name: '간호사장', img: IMG8.lumi }, { box: '🎻 루미의 바이올린 (최대 인연) — 싸움이 끝날 때마다 모두 10% 회복' }); }
    r8Say(L, () => campBarRender(true)); },
  mnTentTalk(){ const R = R8S(); R.flags.lumi = (R.flags.lumi || 0) + 1; const L = [{ t: R.flags.lumi < 3 ? '이름? 비밀이에요. 간호사장이라고 부르면 돼요.' : '…루미. 아무한테도 말하지 마요.', name: '간호사장', img: IMG8.lumi }];
    const nu = R.party.filter(p => /간호사|노먼/.test(p.name)); if (R.flags.lumi >= 2 && nu.length){ for (const p of nu){ if (p.skill){ p.skill.pool = (p.skill.pool || 0) + 2; p.skill.pct = Math.min(0.4, (p.skill.pct || 0.12) + 0.03); } p.medUp = (p.medUp || 0) + 1; if (/노먼/.test(p.name)) R.flags.normanMed = 1; } L.push({ narr: `간호사장이 ${nu.map(p => p.name).join(' · ')} 에게 손놀림을 가르친다.` }, { box: '의료 기술 등급 업 (약 +2 · 치유량 ↑)' + (R.flags.normanMed ? ' · 노먼 — 전직 조건을 채움' : '') }); }
    if (R.flags.lumi >= 3 && R.party.some(p => /간호사/.test(p.name)) && !R.relics.includes('nurse')){ R.relics.push('nurse'); L.push({ box: '⛑ 간호사장의 모자 — 간호사에게 (치유하는 동료의 약이 두 번 더)' }); }
    r8Say(L, () => campBarRender(true)); },
  mnTentNurse(){ const R = R8S(); if (R.party.some(p => p.ref === 'C-018') || R.flags.nurseHired){ r8Say([{ t: '그 애는 이미 당신들이랑 갔잖아요.', name: '간호사장', img: IMG8.lumi }], () => campBarRender(true)); return; } R.flags.nurseHired = 1;
    const d = DESIGN_DEFAULTS.find(x => x.ref === 'C-018' && x.side === 0); if (!d){ r8Say([{ narr: '간호사는 지금 바쁘다.' }], () => campBarRender(true)); return; }
    const p = { ...fromDesign(d, 0), id: uid(), side: 0 }; lockIdentity(p); if (r8InMap()) r8PutIn(p); else R.party.push(p);
    r8Say([{ t: '데려가요. 대신 다치게 하면 가만 안 둬요.', name: '간호사장', img: IMG8.lumi }, { box: `${p.name} 합류` }], () => campBarRender(true)); },
  mnRosinaHelp(){ const R = R8S(); R.flags.rosinaHelp = 2; r8Say([{ t: '약속~ 위험하면 튈 거야.', name: '로지나', img: IMG8.rosina2 }, { box: '로지나 — 다음 두 싸움을 함께함 (체력이 35% 아래면 도망)' }], () => campBarRender(true)); },
  mnRosinaHouse(){ const R = R8S(); R.flags.dandal = 1; r8Say([{ t: '주인님 댁? 좋아, 다음에 길이 나면 데려가 줄게.', name: '로지나', img: IMG8.rosina3 }, { box: '다음 S 칸 하나가 단달로의 저택이 됨' }], () => campBarRender(true)); },
  mnShedorHelp(){ R8S().flags.shedorHelp = 2; r8Say([{ t: '두 번이다. 그 이상은 공짜가 아니야.', name: '배신자 셰도르' }, { box: '셰도르 — 다음 두 싸움을 함께함' }], () => campBarRender(true)); },
  mnShedorJoin(){ const R = R8S(); R.npcGone = [...(R.npcGone || []), 'shedor']; const E = S.camp.stages[1] && S.camp.stages[1].enc; if (E) E.st = 'joined'; r8JoinNow('배신자 셰도르', '"…신 대신 따라갈 게 생겼군." 셰도르가 검을 든다.', () => campBarRender(true)); },
  mnNoraAmmo(){ const R = R8S(); if (R.gold < 25) return r8Say([{ t: '빈손이네.', name: '노라', img: IMG8.nora }], () => campBarRender(true)); R.gold -= 25; for (const p of R.party) if (p.ammo) p.ammoLeft = p.ammo; if (world && world.r8) for (const u of world.units) if (u.side === 0 && u.ammoMax) u.ammo = u.ammoMax; r8Say([{ box: '모두 탄 가득' }], () => campBarRender(true)); },
  mnNoraGun(){ const R = R8S(); const L = R.party.filter(p => /총|활|저격|소총|권총/.test(p.weapon || '')); if (R.gold < 70 || !L.length) return r8Say([{ t: R.gold < 70 ? '빈손이네.' : '쏠 줄 아는 놈이 없잖아.', name: '노라', img: IMG8.nora }], () => campBarRender(true)); R.gold -= 70; const p = r8Pick(L); p.ov = p.ov || {}; p.ov.atk = Math.round((p.ov.atk != null ? +p.ov.atk : statsOf({ ...p, ov: {} }, rules).atk) * 1.15); r8Say([{ narr: `노라가 ${p.name} 에게 묵직한 총을 건넨다.` }, { box: `${p.name} — 공격 +15%` }], () => campBarRender(true)); },
  mnNoraDrug(){ const R = R8S(); if (R.gold < 30) return r8Say([{ t: '빈손이네.', name: '노라', img: IMG8.nora }], () => campBarRender(true)); R.gold -= 30; r8HealAll(0.4); const L = [{ box: '모두 40% 회복' }]; if (Math.random() < 0.25){ const p = r8Who(); r8Curse(p, '약 기운', 5); L.push({ narr: `${p.name} 의 손이 떨린다.` }, { box: `${p.name} — 최대 체력 −5 (약 기운)` }); } r8Say(L, () => campBarRender(true)); },
  mnNoraFight(){ const R = R8S(), E = S.camp.stages[1] && S.camp.stages[1].enc; if (Math.random() < 0.03){ R.flags.noraDead = 1; if (E) E.st = 'joined'; r8Say([{ narr: '퇴로가 모두 막혀 있었다. 노라가 처음으로 웃지 않는다.' }, { box: '노라 — 도망치지 못함 (싸움)' }], () => { const n = r8Node(R.at); world = null; r8XFight('x_nora', n && n.src8, { noraLoot: true }); }); return; }
    if (E){ E.st = 'joined'; E.x = -9; } r8Say([{ narr: '손을 뻗는 순간 — 노라는 그림자 속으로 뿅 사라졌다. 다음에 태연하게 나타날 것이다.' }], () => campBarRender(true)); },
  mnAiten(){ const C = S.camp, E = C && C.stages && C.stages[1] && C.stages[1].enc; if (E) E.stock = E.stock || null; const n = E || { id: 'x' }; paused = true; r8ShopPanel(n); },
  // 항복
  surrJoin(){ const R = R8S(), S8 = R.flags.surr; R.flags.surr = null; if (S8 && S8.key) { const cont = R8T; r8JoinNow(S8.key, S8.key === '아해' ? '아해가 담배를 비벼 끈다. "심심하던 참이다."' : '"…좋다. 이 검, 당분간 너희에게 빌려주지."', cont); return; } const f = R8T; R8T = null; f && f(); },
  surrLet(){ const R = R8S(); R.flags.surr = null; const f = R8T; R8T = null; talkLines([{ narr: '그는 아무 말 없이 어둠 속으로 사라졌다.' }, { go: '!r8:then' }]); R8T = f; },
  // 카드
  cRest(){ r8HealAll(0.25); r8Say([{ box: '모두 25% 회복' }]); },
  cBuy(){ const R = R8S(); if (R.gold < 45) return r8Say([{ narr: '동전이 모자라다.' }]); R.gold -= 45; const k = r8GiveRelic(); r8Say([{ box: k ? `${RELIC8[k].ic} ${RELIC8[k].name}` : '아무것도 남지 않았다 (동전은 돌려받음)' }]); if (!k) R.gold += 45; },
  cBuyHeal(){ const R = R8S(); if (R.gold < 20) return r8Say([{ narr: '동전이 모자라다.' }]); R.gold -= 20; r8HealAll(0.15); r8Say([{ box: '모두 15% 회복' }]); },
  cOpen(){ const R = R8S(); if (Math.random() < 0.2){ r8Say([{ narr: '상자에 이빨이 있었다!' }], () => r8XFight('x_mimic')); return; } if (Math.random() < 0.5){ const k = r8GiveRelic(); r8Say([{ box: k ? `${RELIC8[k].ic} ${RELIC8[k].name}` : '동전 40' }]); if (!k) R.gold += 40; } else { const g = r8Rnd(25, 60); R.gold += g; r8Say([{ box: `👛 ${g}` }]); } },
  cFight(){ r8XFight(Math.random() < 0.5 ? 'x_beast' : 'x_ghost'); },
  cSneak(){ if (Math.random() < 0.55) r8Say([{ narr: '숨을 죽이고 — 지나갔다.' }]); else r8Say([{ narr: '들켰다!' }], () => r8XFight('x_beast')); },
  cLoot(){ const R = R8S(), g = r8Rnd(20, 50); R.gold += g; const L = [{ box: `👛 ${g}` }]; if (Math.random() < 0.3){ const p = r8Who(); r8Curse(p, '망자의 원한', 6); L.push({ narr: `차가운 손이 ${p.name} 의 어깨를 잡는다.` }, { box: `${p.name} — 최대 체력 −6 (저주)` }); } r8Say(L); },
  cBow(){ const R = R8S(); if (Math.random() < 0.3){ const p = r8Who(); r8MaxUp(p, 4); r8Say([{ narr: '누군가 고맙다고 속삭인 것 같다.' }, { box: `${p.name} — 최대 체력 +4` }]); } else r8Say([{ narr: '고요하다.' }]); },
  cPray(){ const R = R8S(), r = Math.random(), p = r8Who(); if (r < 0.45){ r8MaxUp(p, 6); r8Say([{ box: `${p.name} — 최대 체력 +6 (축복)` }]); } else if (r < 0.7){ const q = R.party.find(x => (x.curses || []).length); if (q){ q.curses.pop(); r8MaxUp(q, 6); r8Say([{ box: `${q.name} — 저주 하나가 사라짐` }]); } else r8Say([{ narr: '아무 대답도 없다.' }]); } else { r8Curse(p, '거짓 신의 낙인', 6); r8Say([{ narr: '그것은 신이 아니었다.' }, { box: `${p.name} — 최대 체력 −6 (저주)` }]); } },
  cDoor(){ const R = R8S(), r = Math.random(); if (r < 0.35){ const g = r8Rnd(30, 70); R.gold += g; r8Say([{ narr: '문 너머에 누군가 숨겨 둔 것.' }, { box: `👛 ${g}` }]); } else if (r < 0.6){ const p = r8Who(); const out = growFor(p, { hits: 99, dodges: 9, moved: 99, meleeDealt: 99, taken: 99 }).slice(0, 1); r8Say([{ narr: `${p.name} 이(가) 무언가를 보았다.` }, { box: out.length ? `${p.name} ${out[0]}` : '깨달음' }]); } else r8Say([{ narr: '문은 — 같은 자리로 돌아왔다.' }]); },
  cOdd(){ const R = R8S(), r = Math.random(); if (r < 0.3){ const k = r8GiveRelic(); r8Say([{ narr: '이상한 것이 이상한 것을 주었다.' }, { box: k ? `${RELIC8[k].ic} ${RELIC8[k].name}` : '동전 30' }]); if (!k) R.gold += 30; } else if (r < 0.6){ r8HealAll(0.2); r8Say([{ narr: '이유는 모르겠지만 — 기분이 좋아졌다.' }, { box: '모두 20% 회복' }]); } else if (r < 0.8){ const g = r8Rnd(10, 40); R.gold = Math.max(0, R.gold - g); r8Say([{ narr: '정신을 차려 보니 주머니가 가볍다.' }, { box: `👛 −${g}` }]); } else r8Say([{ narr: '아무 일도 없었다. 정말로.' }]); },
  // 이름 있는 만남
  x_fireSit(){ r8HealAll(0.3); const p = r8Who(), L = [{ narr: '수녀가 자리를 비켜 준다. 악마는 아무 말도 하지 않는다.' }, { box: '모두 30% 회복' }]; if (Math.random() < 0.35){ r8Curse(p, '장작의 재', 4); L.push({ narr: `불똥이 ${p.name} 에게 튄다. 무언가 — 타 버렸다.` }, { box: `${p.name} — 최대 체력 −4` }); } r8Say(L); },
  x_fireLook(){ const p = r8Who(), out = growFor(p, { hits: 99, dodges: 9, moved: 99, meleeDealt: 99, taken: 99 }).slice(0, 1); r8Say([{ narr: `그것은 누군가의 기억이었다. ${p.name} 이(가) 한 장을 꺼내 읽는다.` }, { box: out.length ? `${p.name} ${out[0]}` : `${p.name} — 무언가를 깨달음` }]); },
  x_lonelySit(){ const p = r8Who(); if (Math.random() < 0.5){ const out = growFor(p, { hits: 99, dodges: 99, moved: 99, meleeDealt: 99, taken: 99 }).slice(0, 2); r8Say([{ narr: `${p.name} 이(가) 의자에 앉는다. 오래 — 아주 오래.` }, { box: out.length ? `${p.name} ${out.join(' · ')}` : '고독 속의 깨달음' }]); } else { r8Curse(p, '고독', 5); r8Say([{ narr: `${p.name} 이(가) 일어났을 때, 눈빛이 조금 달라져 있었다.` }, { box: `${p.name} — 최대 체력 −5 (고독)` }]); } },
  x_redFight(){ r8XFight('x_redgirl', 'redgirl'); },
  x_chickTalk(){ const R = R8S(); if (Math.random() < 0.35){ const k = r8GiveRelic(); r8Say([{ t: '꼬꼬.', name: '닭' }, { narr: '닭이 무언가를 부리로 밀어 준다.' }, { box: k ? `${RELIC8[k].ic} ${RELIC8[k].name}` : '동전 30' }]); if (!k) R.gold += 30; } else { R.gold += 15; r8Say([{ t: '꼬. 꼬꼬꼬.', name: '닭' }, { box: '👛 15 (닭이 거스름돈을 준 것 같다)' }]); } },
  x_chickScreen(){ const R = R8S(); const nx = R.f + 1, t = FIX8[nx] ? (FIX8[nx].name || '고정층') : '알 수 없음 (화면이 지지직거린다)'; r8Say([{ narr: `화면에 다음 층이 비친다 — ${nx}층: ${t}.` }]); },
  x_chickGrab(){ const R = R8S(); R.flags.chickCurse = 1; const p = r8Who(); r8Curse(p, '닭의 저주', 8); r8Say([{ narr: '닭을 잡으려는 순간 — 모든 모니터가 동시에 꺼졌다.' }, { box: `${p.name} — 최대 체력 −8 (닭의 저주)` }]); },
  x_beachRest(){ r8HealAll(1); r8Say([{ box: '모두 회복' }]); },
  x_beachWalk(){ const R = R8S(); if (Math.random() < 0.4){ const k = r8GiveRelic(); r8Say([{ narr: '모래 속에 반쯤 묻힌 것.' }, { box: k ? `${RELIC8[k].ic} ${RELIC8[k].name}` : '동전 30' }]); if (!k) R.gold += 30; } else { r8HealAll(0.3); r8Say([{ narr: '발가락 사이로 파도가 빠져나간다.' }, { box: '모두 30% 회복' }]); } },
  x_vicky(){ const R = R8S(); const nx = R.f + 1; r8Say([{ t: '굴은 차원이 접힌 곳이에요. 다음 층은… 흠, ' + (FIX8[nx] ? (FIX8[nx].name || '고정층') : '흔들려서 안 보이네요') + '.', name: '비키' }, { box: '👛 20 (재미있는 자료값)' }]); R.gold += 20; },
  x_mouthTalk(){ const R = R8S(), C = S.camp; const kills = (R.log || []).reduce((a, l) => a + (l.kills || 0), 0), dead = R.dead.length; const L = [{ t: `너희는 지금까지 ${kills} 을(를) 죽였어. 하나하나 다 기억하지? 아니, 기억 못 하지.`, name: '지껄이는 입' }];
    if (dead) L.push({ t: `${R.dead.join(', ')} — 너희가 두고 온 이름들. 누가 마지막으로 그들을 봤어?`, name: '지껄이는 입' }); L.push({ t: '이건 게임이야. 알고 있었어? …농담이야. 아마도.', name: '지껄이는 입' });
    const p = r8Who(); if (Math.random() < 0.5){ const out = growFor(p, { hits: 99, dodges: 99, moved: 99, meleeDealt: 99, taken: 99 }).slice(0, 1); L.push({ box: `${p.name} — 불편한 진실을 견딤: ${out[0] || '깨달음'}` }); } else { r8Curse(p, '지껄임', 5); L.push({ box: `${p.name} — 최대 체력 −5 (귀에서 떠나지 않는 목소리)` }); }
    r8Say(L); },
  x_holyTea(){ r8HealAll(1); const R = R8S(), holy = R.party.some(p => (p.traits || []).some(t => /^신성/.test(t))); const L = [{ narr: '차는 따뜻했다. 시간이 잠깐 멈춘다.', img: IMG8.holy2 }, { box: '모두 회복' }];
    if (holy && !R.relics.includes('odtear')){ R.relics.push('odtear'); L.push({ t: '신성을 지닌 아이가 있네. …이걸 주지. 미래의 내가 화내겠지만.', name: '신성 오딜', img: IMG8.holy2 }, { box: '🌹 오딜의 눈물 (신성일 때만 얻음) — 인주에게 [가호:오딜]' }); } r8Say(L); },
  x_holyBrand(){ const R = R8S(); let n0 = 0; for (const p of R.party){ const c = (p.traits || []).filter(t => /^낙인:/.test(t)).length; if (c){ p.traits = p.traits.filter(t => !/^낙인:/.test(t)); n0 += c; } } r8Say([{ narr: n0 ? '여인이 손끝으로 낙인을 쓸어 낸다. 하얀 재가 된다.' : '…지울 낙인이 없는데?', img: IMG8.holy1 }, ...(n0 ? [{ box: `낙인 ${n0}개가 지워짐` }] : [])]); },
  x_reedShop(){ const R = R8S(); if (R.gold < 30) return r8Say([{ narr: '요괴 장사꾼이 고개를 젓는다.' }]); R.gold -= 30; r8HealAll(0.1); const L = [{ box: '모두 10% 회복' }]; if (Math.random() < 0.35){ const k = r8GiveRelic(); if (k) L.push({ box: `좌판 구석의 물건 — ${RELIC8[k].ic} ${RELIC8[k].name}` }); } r8Say(L); },
  x_reedDeep(){ const R = R8S(); if (Math.random() < 0.06 && !R.flags.moranMet){ R.flags.moranMet = 1; const L = [{ narr: '갈대 사이에 붉은 꽃이 핀다. 흰 털, 여우 가면 — 초월자 모란이다.', img: IMG8.moran }, { t: '칼끝 같은 아이들이네. 가져가렴.', name: '모란', img: IMG8.moran }]; if (!R.relics.includes('moran')){ R.relics.push('moran'); L.push({ box: '🎭 모란의 가면 — 인주의 회피 +15%' }); } r8Say(L); return; } if (Math.random() < 0.5) r8Say([{ narr: '갈대가 길을 가린다. 한참을 헤맨 끝에 — 원래 자리.' }]); else r8Say([{ narr: '갈대 속에서 무언가 튀어나온다!' }], () => r8XFight('x_beast')); },
  x_pehtoFight(){ r8XFight('x_pehto', 'ruina', { surr: '페흐토' }); },
  x_sardilFight(){ r8XFight('x_sardil', 'lakeruin'); },
  x_sardilTalk(){ const R = R8S(); if (R.tears >= 1 && !R.relics.includes('scale')){ R.relics.push('scale'); r8Say([{ t: '여신의 눈물 냄새가 나는군. …위층의 그 호수를 지킨 자들인가.', name: '사르딜 락', img: IMG8.sardil }, { narr: '용이 비늘 한 조각을 떨어뜨린다.' }, { box: '🐉 사르딜락의 비늘조각 — 인주 최대 체력 +20% · 불 · 냉기에 강함' }]); } else r8Say([{ t: '…볼일 없으면 가라.', name: '사르딜 락', img: IMG8.sardil }]); },
  x_gamyuFight(){ r8XFight('x_gamyu', 'deep2'); },
  x_dvdWar(){ const p = r8Who(), out = growFor(p, { hits: 99, dodges: 99, moved: 99, meleeDealt: 99, taken: 99 }).slice(0, 2); r8Say([{ narr: `화면 속 전쟁. ${p.name} 이(가) 숨도 쉬지 않고 본다.` }, { box: out.length ? `${p.name} ${out.join(' · ')}` : '깨달음' }]); },
  x_dvdDiary(){ const R = R8S(); for (const p of R.party) r8MaxUp(p, 4); r8Say([{ narr: '누군가의 일기. 굴에 떨어진 첫날부터 — 마지막 날까지.' }, { box: '모두 최대 체력 +4' }]); },
  x_dvdBlank(){ const R = R8S(); if (Math.random() < 0.5){ const k = r8GiveRelic(); r8Say([{ narr: '화면에 — 우리가 나온다. 지금 이 장면이.' }, { box: k ? `${RELIC8[k].ic} ${RELIC8[k].name}` : '동전 50' }]); if (!k) R.gold += 50; } else { const p = r8Who(); r8Curse(p, '지식의 저주', 10); r8Say([{ narr: '글씨가 화면 밖으로 기어 나온다.' }, { box: `${p.name} — 최대 체력 −10 (지식의 저주)` }]); } },
  x_dandalRest(){ r8HealAll(1); R8S().flags.dandal = 0; r8Say([{ narr: '로지나의 방. 침대가 둘, 책상이 하나. 오랜만에 — 푹 잔다.', ...cg8('dandal4') }, { box: '모두 회복' }]); },
  x_dandalDeal(){ const R = R8S(); R.flags.dandal = 0; if (R.gold < 80) return r8Say([{ t: '거래는 공정해야 하는 법. 다음에 오게.', name: '단달로' }]); R.gold -= 80; const k = r8GiveRelic(); r8Say([{ t: '좋은 거래였네.', name: '단달로' }, { box: k ? `${RELIC8[k].ic} ${RELIC8[k].name}` : '동전 80 (돌려받음)' }]); if (!k) R.gold += 80; },
  x_dandalFight(){ R8S().flags.dandal = 0; r8Say([{ t: '…아쉽군. 로지나, 문을 닫거라.', name: '단달로' }], () => r8XFight('x_dandal', 'dandal3')); },
  x_bellJoin(){ R8S().flags.bellMet = 1; r8JoinNow('인공천사 벨', '"와아! 고마워요! 열심히 쏠게요!" 벨이 권총 두 자루를 빙글 돌린다.', () => r8NodeDone()); },
  x_bellNo(){ R8S().flags.bellMet = 1; r8Say([{ t: '에… 그럼 다음에 봐요! 아마도요!', name: '인공천사 벨', img: 'talk/bell_t11' }]); },
  x_duckJoin(){ const R = R8S(); if (R.gold < 60) return r8Say([{ t: '돈부터 가져와.', name: '러버덕', img: IMG8.duck }]); R.gold -= 60; R.flags.duckMet = 1; r8JoinNow('러버덕', '러버덕이 모자를 눌러쓴다. "총알값은 따로야."', () => r8NodeDone()); },
  x_macBet(){ const R = R8S(); if (R.gold < 30) return r8Say([{ t: '돈이 없으면 웃음이라도!', name: '광대 마카로니', img: IMG8.macaroni }]); R.gold -= 30; if (Math.random() < 0.45){ R.gold += 75; r8Say([{ t: '맞혔다! 상품!', name: '광대 마카로니', img: IMG8.macaroni }, { box: '👛 +75' }]); } else r8Say([{ t: '땡! 자, 웃어!', name: '광대 마카로니', img: IMG8.macaroni }, { box: '👛 −30' }]); },
  x_macFight(){ r8XFight('x_macaroni', 'medr1'); },
  x_yellowFight(){ r8XFight('x_yellow', 'abyss5'); },
  x_yellowRun(){ const p = r8Who(); const mx = r8MaxHp(p); p.hpNow = Math.max(1, (p.hpNow != null ? p.hpNow : mx) - Math.round(mx * 0.3)); r8Say([{ narr: `등 뒤로 노란 창이 날아온다. ${p.name} 이(가) 맞으며 빠져나온다.` }, { box: `${p.name} — 체력 −30%` }]); },
  x_riddleA(){ const R = R8S(); R.gold += 40; r8Say([{ t: '…하나. 그래, 굴에선 결국 하나지. 맞아.', name: '아템' }, { box: '👛 40' }]); },
  x_riddleB(){ const p = r8Who(); r8Curse(p, '아템의 실망', 4); r8Say([{ t: '틀렸어. 없으면 이 질문도 없지.', name: '아템' }, { box: `${p.name} — 최대 체력 −4` }]); },
  x_riddleC(){ const R = R8S(); const k = r8GiveRelic(); r8Say([{ t: '하하! 그런 대답은 처음이야. 가져가.', name: '아템' }, { box: k ? `${RELIC8[k].ic} ${RELIC8[k].name}` : '동전 40' }]); if (!k) R.gold += 40; } });
Object.assign(R8X, X8);
