/* wounds.js v1.3 — 치명상 · 상태 이상 정리 (v0.33) (v1.3, v0.86: 치명상이 더 아픔 — 다리 이동 -30% (점프 · 슬라이딩 못 함) · 심장 최대 체력 -25% · 뇌 정신도 -25 · 반병신 칩에 '원정 못 감') (v1.2, v0.86: 밤에 굴에서 쉬면 정신도가 돌아옴 — 최대의 40% (원정 간 날은 20%). 전엔 안 돌아와서 한 번 0이면 다음 원정 시작부터 '절망' (영웅 칸에 절망 9999)) (v1.1: 영웅 칸 칩에 영구 · 빈사 · 반시체 · 반병신 — 부위 치명상은 maim.js)
   치명상 (영웅에게 남는 상처, 굴에 돌아와도 안 나음):
   · 생기는 때: 쓰러질 때 25% · 한 방에 최대 체력 35% 넘게 맞을 때 7%
   · 다리: 이동 -30% · 점프 · 슬라이딩 못 함 (7일) · 심장: 최대 체력 -25%, 생길 때 크게 피 흘림 (9일) · 뇌: 정신도 -25, 가끔 혼란 · 헛소리 (10일) · 목: 생길 때 크게 피 흘림 (5일)
     목 치명상은 쓰러진 채로 받으면 3%로 목이 떨어짐 (동료는 영영 잃음, 인주는 겨우 숨이 붙음)
   · 낫는 법: 원정을 안 간 날 밤마다 하루씩 줆. 은실 바늘 (꿰매기)은 심장 · 목을 3일 줄임. 붕대 · 초록 물약은 상처의 피만 멈춤
   상태 이상 (원정 중, 영웅 칸에 칩):
   · 공포: 정신도가 바닥 → 가끔 몸이 굳음 · 절망: 정신도 0 → 공격 -20% (정신도 10 넘으면 풀림)
   · 혼란: 무기 스킬 (K) 못 씀 + 칠 때 15%로 자해 (광신도 저주 · 뇌 치명상)
   · 취약: 받는 피해 ×1.4 · 무력: 그라운드에 깔림 (레슬링) */
'use strict';
Object.assign(STS_N, { fear: ['공포', '#b48cff'], despair: ['절망', '#6a4a8a'], confuse: ['혼란', '#ff9ad8'], vuln: ['취약', '#ff7a4a'], helpless: ['무력', '#c8c8c8'] });
const WOUND = {
  leg:   { n: '다리 치명상', days: 7, note: '이동 -30% · 점프 · 슬라이딩 못 함 · 달리기 느림' },
  heart: { n: '심장 치명상', days: 9, note: '최대 체력 -25%' },
  brain: { n: '뇌 치명상', days: 10, note: '정신도 -25 · 가끔 혼란' },
  neck:  { n: '목 치명상', days: 5, note: '피를 많이 흘림' },
};
const WOUND_W = [['leg', 40], ['heart', 22], ['brain', 16], ['neck', 22]];
function rollWoundKind(){ let r = Math.random() * 100; for (const [k, w] of WOUND_W){ r -= w; if (r <= 0) return k; } return 'leg'; }
function addWound(u, k, why){
  const h = u.hero; if (!h) return;
  h.wounds = h.wounds || [];
  if (h.wounds.some(w => w.k === k)){ const w = h.wounds.find(w => w.k === k); w.d = Math.max(w.d, WOUND[k].days); return; }
  h.wounds.push({ k, d: WOUND[k].days }); typeof heroCount === 'function' && heroCount(h, 'wound');
  popText(u.x, u.y + bodyH(u) + 0.9, u.z, WOUND[k].n + '!', 'hurt big', 1.8);
  if (typeof clashLog === 'function') clashLog({ leg: `${h.name}의 다리가 꺾였다. 걸음이 무거워진다.`, heart: `${h.name}의 가슴에서 피가 솟는다.`, brain: `${h.name}의 눈이 잠깐 비었다. 무언가 망가졌다.`, neck: `${h.name}의 목에서 피가 쏟아진다.` }[k]);
  if (typeof uiToast === 'function') uiToast(`<b style="color:#ff5a4a">${h.name} — ${WOUND[k].n}</b> <small>${WOUND[k].note} · ${WOUND[k].days}일</small>`, 'warn');
  spark(u.x, u.y + bodyH(u) * 0.7, u.z, 0xb3122a, 20, 5); camShake(0.2, 0.25);
  if (k === 'heart' || k === 'neck') addStatus(u, 'bleed', { dps: k === 'heart' ? 7 : 5, t: 10 });
  if (k === 'brain'){ h.san = Math.max(0, (h.san ?? 50) - 10); addStatus(u, 'confuse', { t: 4 }); }
  // 목: 쓰러진 채로 받으면 3%로 목이 떨어짐
  if (k === 'neck' && u.downed && Math.random() < 0.03) beheaded(u);
  if (!u.dead) applyHero(u, h);
  if (typeof saveRpg === 'function') saveRpg();
}
function beheaded(u){
  const h = u.hero;
  popText(u.x, u.y + 1.6, u.z, '…목이', 'crit', 2.2); spark(u.x, u.y + 1.2, u.z, 0x8a0a14, 40, 7); camShake(0.5, 0.5);
  if (h.id === 'inju'){ h.wounds.find(w => w.k === 'neck').d = 12; caption('목이 반쯤 떨어졌다', '…겨우 숨이 붙어 있다'); return; }
  h.st = 'dead'; RPG.party = RPG.party.filter(k => k !== h.id);
  u.dead = true; u.downed = false; u.fading = G.t; u.bar && u.bar.remove(); u.tag && u.tag.remove();
  caption(`${h.name}를 잃었다`, '목이 떨어졌다. 다시는 돌아오지 않는다');
  for (const a of allies()) if (a.hero) a.hero.san = Math.max(0, (a.hero.san ?? 50) - 25);
}
// 수치에 반영
const _deriveW = derive;
derive = function(h){
  const S = _deriveW(h);
  for (const w of h.wounds || []){
    if (w.k === 'leg'){ S.spd *= 0.7; S.spd0 *= 0.7; }   // v1.3 (v0.86) 더 세게 (민수) — 못 하는 동작은 maim.js INJ
    if (w.k === 'heart') S.maxHp = Math.round(S.maxHp * 0.75);
    if (w.k === 'brain') S.maxSan = Math.max(10, S.maxSan - 25);
  }
  return S;
};
// 쓰러질 때 · 크게 맞을 때
const _killW = kill;
kill = function(u, by){
  const was = u.downed;
  const r = _killW(u, by);
  if (G.mode === 'exp' && u.side === 'ally' && u.hero && u.downed && !was && Math.random() < 0.25) addWound(u, rollWoundKind(), 'down');
  return r;
};
const _hurtW = hurt;
hurt = function(att, tgt, base, o = {}){
  // v0.35 숙이기: 높은 공격은 머리 위로 지나감 → 빈틈의 대가 (다음 공격 확정 치명)
  if (o.high && tgt && tgt.posture === 'crouch' && !tgt.dead && !tgt.downed){
    popText(tgt.x, tgt.y + 1.2, tgt.z, '숙여 피함!', 'aim', 1); tgt.critNext = true; tgt.upT = G.t + 1.2;   /* v0.40: 1.2초 안에 맨손 J = 어퍼컷 */ G.hitstop = Math.max(G.hitstop, 0.06);
    if (att && typeof clashLog === 'function') clashLog(`${att.D.name}의 일격이 숙인 머리 위로 빗나갔다. 빈틈의 대가는 크다 —`);
    return 0;
  }
  if (tgt && tgt.sts){
    if (tgt.sts.vuln && tgt.sts.vuln.t > 0 && !o.dot) base *= 1.4;
  }
  if (att && att.sts && att.sts.despair && att.sts.despair.t > 0 && !o.dot) base *= 0.8;
  const dmg = _hurtW(att, tgt, base, o);
  if (dmg && tgt && tgt.hero && G.mode === 'exp' && !tgt.dead && !o.dot && dmg >= tgt.max * 0.35 && Math.random() < 0.07) addWound(tgt, rollWoundKind(), 'big');
  return dmg;
};
// 혼란: K 못 씀 · 칠 때 15% 자해
const _weaponInputW = weaponInput;
weaponInput = function(u, dt, mv){
  const c = u.sts && u.sts.confuse && u.sts.confuse.t > 0;
  if (c){
    if (hit('KeyK') || hit('Mouse2')){ pressed.delete('KeyK'); pressed.delete('Mouse2'); popText(u.x, u.y + 2.2, u.z, '혼란 — 스킬을 못 씀', 'miss', 0.8); }
    if ((hit('KeyJ') || hit('Mouse0')) && P.atkCd <= 0 && Math.random() < 0.15){ _hurtW(null, u, u.max * 0.04, { dot: true, noCrit: true }); popText(u.x, u.y + 2.2, u.z, '자해!', 'hurt', 0.9); }
  }
  return _weaponInputW(u, dt, mv);
};
// 원정 한 프레임: 공포 · 절망 · 뇌 치명상 · 무력
function woundTick(dt){
  if (!EXP || G.mode !== 'exp') return;
  for (const u of allies()){
    const h = u.hero; if (!h) continue;
    const S = u.rpg || derive(h), san = h.san ?? S.maxSan;
    if (san <= 0 && !(u.sts && u.sts.despair && u.sts.despair.t > 0)) addStatus(u, 'despair', { t: 9999 });
    if (san > 10 && u.sts && u.sts.despair) u.sts.despair.t = 0;
    if (san < S.maxSan * 0.15 && Math.random() < dt * 0.06) addStatus(u, 'fear', { t: 3 });
    if ((h.wounds || []).some(w => w.k === 'brain') && Math.random() < dt * 0.012){ addStatus(u, 'confuse', { t: 3 }); popText(u.x, u.y + bodyH(u) + 0.4, u.z, ['…누구야?', '(웃음)', '…머리가'][Math.floor(Math.random() * 3)], 'whisper', 1.6); }
    // 공포: 3초 안에 한 번 몸이 굳음
    const f = u.sts && u.sts.fear; if (f && f.t > 0){ f.jT = (f.jT ?? rnd(0.5, 2.5)) - dt; if (f.jT <= 0 && !u.downed && !u.lock){ f.jT = 99; u.st = 'hurt'; u.stT = 0.7; setPose(u, 'hurt'); popText(u.x, u.y + bodyH(u) + 0.3, u.z, '몸이 굳었다', 'hurt', 0.9); } }
  }
  for (const L of G.locks || []) if (L.phase === 'ground') addStatus(L.d, 'helpless', { t: 0.3 });
}
// 낫기: 원정을 안 간 날 밤마다 하루씩
function woundNight(){
  const news = [];
  for (const h of Object.values(RPG.heroes)){   // v1.2 정신도 회복
    if (!h || h.st === 'dead' || h.san == null) continue;
    const S = derive(h); h.san = Math.min(S.maxSan, h.san + S.maxSan * (h.tripDay === PRO.day ? 0.2 : 0.4));
  }
  for (const h of Object.values(RPG.heroes)){
    if (!h.wounds || !h.wounds.length || h.st === 'dead') continue;
    if (h.tripDay === PRO.day) continue;   // 오늘 원정을 갔으면 안 나음
    for (const w of h.wounds) w.d--;
    const healed = h.wounds.filter(w => w.d <= 0); h.wounds = h.wounds.filter(w => w.d > 0);
    for (const w of healed) news.push(`${h.name} — ${WOUND[w.k].n}이 나았다`);
  }
  return news;
}
if (typeof endDay === 'function'){
  const _endDayW = endDay;
  endDay = async function(){ const news = woundNight(); const r = await _endDayW.apply(this, arguments); news.forEach((t, i) => setTimeout(() => typeof uiToast === 'function' && uiToast(t, 'loot r2'), 600 + i * 900)); if (typeof saveRpg === 'function') saveRpg(); return r; };
}
// 은실 바늘 (꿰매기): 심장 · 목 치명상 3일 줄임. 붕대 · 물약 (cure): 상처의 피만 멈춤
const _useItemW = useItem;
useItem = function(it, u = G.player){
  const d = itemDef(it), fx = d.fx || {};
  const r = _useItemW(it, u);
  const h = u && u.hero;
  if (h && h.wounds && it.id === 'I-246'){ for (const w of h.wounds) if (w.k === 'heart' || w.k === 'neck') w.d = Math.max(1, w.d - 3); popText(u.x, u.y + 2.4, u.z, '상처를 꿰맸다', 'heal', 1.2); }
  if (u && fx.cure && u.sts && u.sts.confuse) u.sts.confuse.t = 0;
  return r;
};
const woundChips = h => (h.st === 'moribund' ? `<em class="wd" title="수술 뒤 회복 중 — 원정 못 감">빈사 ${h.moribund || 1}일</em>` : '') + (h.halfDead ? '<em class="wd" title="데리고 돌아가면 수술">반시체</em>' : '') + (typeof crippled === 'function' && crippled(h) ? '<em class="wd" title="영구 손상 · 골절이 겹침 — 원정 못 감 (인주 빼고)">반병신</em>' : '')
  + (h.wounds || []).map(w => `<em class="wd" title="${WOUND[w.k].note}">${WOUND[w.k].n.replace(' 치명상', '')} ${WOUND[w.k].perm ? '영구' : w.d + '일'}</em>`).join('');   // v1.1: 영구 · 빈사 · 반시체 · 반병신 (maim.js)
