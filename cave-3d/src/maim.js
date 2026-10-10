/* maim.js v1.3 — (v1.3, v0.86: 신체 이상이 더 아픔 — 숫자 (팔 -30% · 팔 절단 -45% · 다리 절단 -50% · 갈비뼈 -20% …) + 못 하는 동작 (INJ: 다리 → 점프 · 슬라이딩, 다리 절단 → 달리기 · 구르기 · 태클, 팔 → 투창 · 활 · 잡기, 팔 절단 → 막기까지, 갈비뼈 → 태클 · 잡기, 손 떨림 · 눈 → 조준 흔들림) · 반병신 동료는 원정 못 감 · 반시체 인주를 싸움 중에도 업으러 감 (세자르 앞 · 마지막 동료 · 크게 다친 동료) — 들쳐업기 1.2초 · 3초 버티면 빠져나감) (v1.2, v0.86: 인주가 반시체면 싸움이 끝나고 3초 뒤 서 있는 동료가 들쳐업고 굴로 (업을 사람이 없으면 전멸) — 전엔 조작도 못 하고 원정도 안 끝나 멈췄음 (9층) · 반시체 동료는 다음 층에 업혀 감 (expedition.js) · 보스도 부위 치명상 (덜 자주 · 덜 세게) · 레베카 확인사살 · 머리 깨짐도 7초면 재생) (v1.1, v0.82: 테이크다운이 실제로 뛰어듦 — 전엔 한 프레임에 2칸 가까이 옮김) (v1.0, v0.48) 하 · 중 · 상단 공격 · 부위 치명상 · 반시체 · 수술과 후유증 · 적의 확인사살 · 레슬링 테이크다운
   공격 높이 (적의 근접 · 찌르기는 휘두를 때마다 하나를 고름. 예고 장판 색 + 머리 위 표시로 미리 보임):
   · ▲ 상단 (주황): G 숙이면 머리 위로 빗나감 (빈틈 → 어퍼컷). 막기 됨
   · ■ 중단 (빨강): F 막기 · 튕겨내기. 숙여도 맞음
   · ▼ 하단 (보라): Space 뛰면 피함. 막기는 반만 막고 튕겨내기 안 됨. 맞으면 25%로 넘어짐
   부위 치명상 (영웅, 원정 중): 맞은 높이가 부위를 정함 — 상단: 눈 · 뇌 · 목 · 팔 / 중단: 심장 · 갈비뼈 · 배 · 팔 / 하단: 다리 · 배
   · 치명타 14% (+ 한 방에 최대 체력 25% 넘게 6%). 가슴을 안 막고 앞에서 중단 치명을 맞으면 절반은 심장 관통
   · 재수 없으면 (10%) 더 나빠짐: 다리 → 다리 절단 · 팔 → 팔 절단 · 뇌 → 뇌 손상 (영구). 안구 파괴도 영구
   · 짓뭉개지면 40%로 뼈가 부러짐 (갈비뼈 · 팔 · 다리). 영구 둘 이상 · 골절 둘 이상 = 반병신 (영웅 칸에 표시)
   적도 부위가 있음: 치명타 22%로 눈 (경직) · 팔 (공격 -25%) · 다리 (속도 -40%), 재수 없으면 팔 · 다리가 떨어져 나감. 인주의 동작 (하이킥 · 어퍼컷 = 상단, 다리후리기 · 발목 = 하단 …)이 높이를 정함
   반시체 · 수술 (적들은 바보가 아님):
   · 쓰러진 동료 곁에 적이 있으면 확인사살하러 옴 (검붉은 원 예고 0.9초 — 그 사이 치거나 밀면 끊김). 맞으면 반시체 — 그 원정에선 못 일어남. 반시체에서 또 맞으면 죽음 (인주는 전멸)
   · 크게 넘치게 맞아 쓰러져도 반시체
   · 데리고 굴로 돌아오면 수술 (레베카 · 청광묵): 살아남지만 빈사 3일 (원정 못 감) + 평생 후유증 하나 (절뚝임 · 손 떨림 · 큰 흉터 · 악몽)
   · 레베카는 불사: 확인사살은 재생만 늦춤. 상단 치명에 머리가 깨지면 그 자리에서 쓰러져 7초 뒤 재생 (v1.2 — 짓뭉개져도 7초)
   · v1.2 인주가 반시체: 조작할 수 없음 — 싸움이 끝나면 (3초 조용) 서 있는 동료 (카리우스 · 레베카 먼저) 가 들쳐업고 굴로. 서 있는 동료가 없으면 전멸
   맨손 막기 (F)로 칼 · 창을 막으면 12%로 팔이 베임 (팔 부러짐 칸 · 출혈)
   테이크다운 (Shift + V): 앞 2.6칸 안의 적에게 다리를 잡으러 뛰어듦 → 확률 (힘 · 무게 · 넘어짐 · 등 뒤 · 휘두르는 중)로 성공하면 바로 깔고 앉음 (그라운드: J 파운딩 · K 끝내기), 실패하면 스프롤 (눌려 넘어지고 무릎을 맞음) */
'use strict';
const ZONE = {
  high: { n: '상단', c: 0xffa040, mark: '▲ 상단', cls: 'zhigh' },
  mid:  { n: '중단', c: RED, mark: '■ 중단', cls: 'zmid' },
  low:  { n: '하단', c: 0xb070ff, mark: '▼ 하단', cls: 'zlow' },
};
if (typeof ORB !== 'undefined') ORB.kinds.low.c = ZONE.low.c;   // 대련 더미의 낮은 공도 같은 색
const pickW = W => { let r = Math.random() * W.reduce((a, [, w]) => a + w, 0); for (const [k, w] of W){ r -= w; if (r <= 0) return k; } return W[0][0]; };
function pickZone(u, shape){
  if (u.D.zones) return pickW(u.D.zones);
  if (u.D.heavy) return pickW([['high', 50], ['low', 40], ['mid', 10]]);
  if (shape === 'line') return pickW([['mid', 60], ['high', 30], ['low', 10]]);
  return pickW([['mid', 45], ['high', 30], ['low', 25]]);
}
const _windupM = windup;
windup = function(u, shape, o, onHit, color){
  if (u.side === 'enemy' && !u.D.boss && (shape === 'sector' || shape === 'line') && !o.zoneSkip){
    const z = pickZone(u, shape); u.atkZone = z; color = ZONE[z].c;
    popText(u.x, u.y + bodyH(u) + 0.55, u.z, ZONE[z].mark, 'zone ' + ZONE[z].cls, Math.max(0.5, o.windup || 0.5));
  } else if (u.side === 'enemy') u.atkZone = null;
  return _windupM(u, shape, o, onHit, color);
};
// 인주 · 동료의 동작 → 높이 (적 부위용)
const PZONE = { highKick: 'high', uppercut: 'high', flyKnee: 'high', dk1: 'high', dk2: 'high', spin: 'high', jab: 'high', upper: 'high', mace: 'high', hook: 'high', slashDown: 'high', bungkwon: 'mid',
  punch: 'mid', kick: 'mid', kickPrep: 'mid', knee: 'mid', dk3: 'mid', pierce: 'mid', swat: 'mid', slashUp: 'mid', thrust: 'mid', bash: 'mid', shoulder: 'mid',
  sweep: 'low', slide: 'low', stomp: 'low', step: 'low', pound: 'high' };

/* ---------- 부위 치명상 ---------- */
const PERM = 9999;
Object.assign(WOUND, {
  eye:    { n: '안구 파괴', days: PERM, perm: true, note: '시야 -40% · 치명 -5% · 조준이 흔들림' },
  arm:    { n: '팔 부러짐', days: 8, bone: true, note: '공격 -30% · 투창 · 활 · 잡기 못 함' },
  ribs:   { n: '갈비뼈 골절', days: 6, bone: true, note: '최대 체력 -20% · 태클 · 잡기 못 함 · 달리기 느림' },
  gut:    { n: '배 관통', days: 8, note: '피를 흘림 · 최대 체력 -15% · 달리기 느림' },
  armCut: { n: '팔 절단', days: PERM, perm: true, note: '공격 -45% · 투창 · 활 · 잡기 · 막기 · 태클 못 함' },
  legCut: { n: '다리 절단', days: PERM, perm: true, note: '이동 -50% · 달리기 · 점프 · 구르기 · 슬라이딩 · 태클 못 함' },
  brainP: { n: '뇌 손상', days: PERM, perm: true, note: '정신도 -35 · 자주 혼란' },
  limp:   { n: '절뚝임', days: PERM, perm: true, after: true, note: '수술 후유증 · 이동 -15% · 달리기 느림 · 슬라이딩 못 함' },
  tremor: { n: '손 떨림', days: PERM, perm: true, after: true, note: '수술 후유증 · 공격 -15% · 조준이 크게 흔들림' },
  scar:   { n: '큰 흉터', days: PERM, perm: true, after: true, note: '수술 후유증 · 최대 체력 -8%' },
  dread:  { n: '악몽', days: PERM, perm: true, after: true, note: '수술 후유증 · 최대 정신도 -15' },
});
WOUND.leg.bone = true;
const ZW = { high: [['eye', 30], ['brain', 25], ['neck', 25], ['arm', 20]], mid: [['heart', 22], ['ribs', 30], ['gut', 28], ['arm', 20]], low: [['leg', 80], ['gut', 20]] };
const WORSE = { leg: 'legCut', arm: 'armCut', brain: 'brainP' };
const _deriveM = derive;
derive = function(h){
  const S = _deriveM(h);
  for (const w of h.wounds || []){
    const k = w.k;
    if (k === 'eye'){ S.vision *= 0.6; S.crit = Math.max(0, S.crit - 0.05); }   // v1.3 (v0.86) 모두 더 세게 (민수)
    if (k === 'arm') S.atk = Math.round(S.atk * 0.7);
    if (k === 'armCut') S.atk = Math.round(S.atk * 0.55);
    if (k === 'tremor') S.atk = Math.round(S.atk * 0.85);
    if (k === 'ribs') S.maxHp = Math.round(S.maxHp * 0.8);
    if (k === 'gut') S.maxHp = Math.round(S.maxHp * 0.85);
    if (k === 'scar') S.maxHp = Math.round(S.maxHp * 0.92);
    if (k === 'legCut'){ S.spd *= 0.5; S.spd0 *= 0.5; }
    if (k === 'limp'){ S.spd *= 0.85; S.spd0 *= 0.85; }
    if (k === 'brainP') S.maxSan = Math.max(10, S.maxSan - 35);
    if (k === 'dread') S.maxSan = Math.max(10, S.maxSan - 15);
  }
  return S;
};
/* v1.3 (v0.86) 몸이 망가지면 '못 하는 것' 이 생김 (민수: 신체 이상 패널티는 더 심해야 — 그것 때문에 진행이 막혀도 됨)
   인주: 그 동작 키를 눌러도 안 됨 (머리 위에 이유) · 동료: 숫자 (위) + 카리우스 돌격 · 레베카는 불사라 없음
   반병신 (영구 둘 · 골절 둘) 동료는 원정에 못 감 (굴에서만 지냄, ui_rpg.js) */
const INJ = {
  leg:    { noJump: 1, noSlide: 1, run: 0.7 },
  legCut: { noJump: 1, noSlide: 1, noRun: 1, noDodge: 1, noTackle: 1, noCharge: 1 },
  limp:   { noSlide: 1, run: 0.8 },
  arm:    { noThrow: 1, noDraw: 1, noGrab: 1 },
  armCut: { noThrow: 1, noDraw: 1, noGrab: 1, noGuard: 1, noTackle: 1 },
  ribs:   { noTackle: 1, noGrab: 1, run: 0.8 },
  gut:    { run: 0.85 },
  tremor: { shake: 1.8 },
  eye:    { shake: 1.35 },
};
const INJ_N = { noJump: '다리가 버티지 못한다 — 뛸 수 없다', noSlide: '다리가 버티지 못한다 — 미끄러질 수 없다', noRun: '달릴 수 없다', noDodge: '구를 수 없다', noTackle: '몸이 버티지 못한다 — 태클할 수 없다', noThrow: '팔이 말을 듣지 않는다 — 던질 수 없다', noDraw: '팔이 말을 듣지 않는다 — 당길 수 없다', noGrab: '붙잡을 수 없다', noGuard: '막을 팔이 없다' };
function injOf(u){
  const h = u && u.hero; if (!h || !h.wounds || !h.wounds.length || (u.D && u.D.undying)) return null;
  let o = null;
  for (const w of h.wounds){ const f = INJ[w.k]; if (!f) continue; o = o || {}; for (const k in f){ if (k === 'run') o.run = Math.min(o.run ?? 1, f.run); else if (k === 'shake') o.shake = Math.max(o.shake ?? 1, f.shake); else o[k] = 1; } }
  return o;
}
function injSay(u, k){ if (G.t - (u._injSaid || -9) < 1.2) return; u._injSaid = G.t; popText(u.x, u.y + bodyH(u) + 0.5, u.z, INJ_N[k] || '몸이 말을 듣지 않는다', 'hurt', 1.1); SFX.thump && SFX.thump(90, 0.25, 0.15); }
const crippled = h => { const W = h.wounds || []; return W.filter(w => WOUND[w.k] && WOUND[w.k].perm && !WOUND[w.k].after).length >= 2 || W.filter(w => WOUND[w.k] && WOUND[w.k].bone).length >= 2; };
function zoneWound(u, zone, why){
  let k = pickW(ZW[zone] || ZW.mid);
  if (WORSE[k] && Math.random() < 0.1){ k = WORSE[k]; popText(u.x, u.y + bodyH(u) + 1.2, u.z, '재수 없게도…', 'whisper', 1.6); }
  addWound(u, k, why);
  if (k === 'gut') addStatus(u, 'bleed', { dps: 4, t: 8 });
  if (k === 'eye' && typeof clashLog === 'function') clashLog(`${u.hero.name}의 눈이 터졌다. 다시는 보이지 않는다.`);
  if ((k === 'armCut' || k === 'legCut') && typeof clashLog === 'function') clashLog(`${u.hero.name}의 ${k === 'armCut' ? '팔' : '다리'}이 떨어져 나갔다.`);
  if (crippled(u.hero) && !u.hero.crippledSaid){ u.hero.crippledSaid = true; popText(u.x, u.y + bodyH(u) + 1.5, u.z, '반병신', 'crit', 1.8); }
}
// 적의 부위: 눈 · 팔 · 다리 (재수 없으면 떨어져 나감)
function enemyMaim(e, zone){
  const M = e.maim = e.maim || {}, bad = Math.random() < 0.06;
  const say = (t, c = 'crit') => { popText(e.x, e.y + bodyH(e) + 0.6, e.z, t, c, 1.3); spark(e.x, e.y + bodyH(e) * 0.6, e.z, 0x8a0a14, 18, 5); };
  const boss = !!e.D.boss;   // v1.2 보스도 다침 — 경직 · 넘어짐 없이, 덜 깎임
  if (zone === 'high' && !M.eye){ M.eye = 1; say('눈이 터졌다'); if (!boss){ interrupt(e); e.st = 'hurt'; e.stT = 1.1; } e.cdMul = (e.cdMul || 1) * (boss ? 1.15 : 1.3); return; }
  if (zone === 'low' || (zone === 'high' && M.eye)){
    if (M.leg === 2 || (M.leg && !bad)) return; M.leg = bad ? 2 : 1; e.spd *= boss ? (bad ? 0.6 : 0.82) : bad ? 0.3 : 0.6; say(bad ? '다리가 떨어져 나갔다' : '다리가 꺾였다');
    if (bad && !boss){ e.lying = true; e.tripT = G.t + 2; e.st = 'hurt'; e.stT = 2; } return;
  }
  if (M.arm === 2 || (M.arm && !bad)) return; M.arm = bad ? 2 : 1; e.atk = Math.round(e.atk * (boss ? (bad ? 0.72 : 0.88) : bad ? 0.5 : 0.75)); say(bad ? '팔이 떨어져 나갔다' : '팔이 꺾였다');
}
function crushWound(t){
  if (t.dead) return;
  if (t.hero && G.mode === 'exp' && !t.D.undying && Math.random() < 0.4) addWound(t, pickW([['ribs', 45], ['arm', 30], ['leg', 25]]), 'crush');
  else if (t.side === 'enemy' && Math.random() < (t.D.boss ? 0.2 : 0.5)) enemyMaim(t, Math.random() < 0.6 ? 'mid' : 'low');   // v1.2 보스도 (덜 자주)
}
const frontOf = (src, tgt) => src && Math.abs(angDiff(Math.atan2(src.z - tgt.z, src.x - tgt.x), tgt.aim)) < 1.25;
const _hurtM = hurt;
hurt = function(att, tgt, base, o = {}){
  let zone = o.zone || (att && att.side === 'enemy' && att.st === 'windup' && att.atkZone) || null;
  if (!zone && att && (att === G.player || att.side === 'ally') && att.pose) zone = PZONE[att.pose] || null;
  if (zone && !o.zone) o = { ...o, zone };
  if (zone === 'high' && !o.high) o = { ...o, high: true };
  if (!tgt || tgt.dead || tgt.downed) return _hurtM(att, tgt, base, o);
  const foeHit = att && att.side !== tgt.side;
  // 하단: 뛰면 피함 · 막기는 반만 (튕겨내기 안 됨)
  if (zone === 'low' && foeHit && tgt.side !== 'enemy'){
    if ((tgt.jy || 0) > 0.3 || tgt.airborne){ popText(tgt.x, tgt.y + 1.6, tgt.z, '뛰어 피함!', 'aim', 0.9); return 0; }
    if (tgt.guard){
      const g0 = tgt.guardAt, m0 = tgt.guardMul; tgt.guardAt = -9; tgt.guardMul = 0.7;
      const r = _hurtM(att, tgt, base, o); tgt.guardAt = g0; tgt.guardMul = m0;
      popText(tgt.x, tgt.y + 2.1, tgt.z, '하단 — 막기 반만', 'miss', 0.8); return r;
    }
  }
  const hp0 = tgt.hp, guarded = !!tgt.guard, wasDown = tgt.downed;
  const dmg = _hurtM(att, tgt, base, o);
  if (!(dmg > 0)) return dmg;
  // 하단에 맞으면 25%로 넘어짐
  if (zone === 'low' && foeHit && !tgt.dead && !tgt.downed && tgt.side !== 'enemy' && !tgt.D.heavy && Math.random() < 0.25){ tgt.lying = true; tgt.tripT = G.t + 0.8; tgt.st = 'hurt'; tgt.stT = Math.max(tgt.stT || 0, 0.8); popText(tgt.x, tgt.y + 1.4, tgt.z, '다리를 걸렸다', 'hurt', 0.8); }
  // 크게 넘치게 맞고 쓰러짐 → 반시체
  if (tgt.hero && tgt.downed && !wasDown && G.mode === 'exp' && hp0 - dmg < -tgt.max * 0.5 && !tgt.D.undying) makeHalfDead(tgt, '크게 당했다');
  if (tgt.dead || o.dot || o.crush) return dmg;
  // 맨손으로 칼을 막음 (v0.35에서 남은 것): 막긴 했어도 12%로 팔이 베임
  if (guarded && tgt === G.player && G.mode === 'exp' && typeof fistNow === 'function' && fistNow() && foeHit && att.side === 'enemy' && (att.D.melee || att.D.line) && Math.random() < 0.12){
    addWound(tgt, 'arm', 'bareBlock'); popText(tgt.x, tgt.y + bodyH(tgt) + 1.0, tgt.z, '맨손으로 칼을 막았다 — 팔이 베였다', 'hurt', 1.6); addStatus(tgt, 'bleed', { dps: 3, t: 6 });
  }
  if (tgt.hero && G.mode === 'exp' && foeHit){
    if (tgt.D.undying){   // 레베카: 머리가 깨지면 1분
      if (zone === 'high' && o.crit && Math.random() < 0.3 && !tgt.downed){ tgt.crushed = true; popText(tgt.x, tgt.y + 2, tgt.z, '머리가 깨졌다… (7초 뒤 재생)', 'crit', 1.8); kill(tgt, att); }
      return dmg;
    }
    const heart = zone === 'mid' && o.crit && !guarded && frontOf(att, tgt);
    const p = (o.crit ? 0.14 : 0.02) + (dmg >= tgt.max * 0.25 ? 0.06 : 0) + (heart ? 0.36 : 0);
    if (Math.random() < p){ if (heart && Math.random() < 0.5){ addWound(tgt, 'heart', 'pierce'); popText(tgt.x, tgt.y + bodyH(tgt) + 1.2, tgt.z, '가슴을 안 막았다 — 심장 관통', 'crit', 1.8); } else zoneWound(tgt, zone || pickW([['high', 1], ['mid', 2], ['low', 1]]), 'zone'); }
  } else if (tgt.side === 'enemy' && o.crit && Math.random() < (tgt.D.boss ? 0.12 : 0.22)) enemyMaim(tgt, zone || 'mid');   // v1.2 보스도 (덜 자주)
  return dmg;
};

/* ---------- 반시체 · 적의 확인사살 ---------- */
function makeHalfDead(u, why){
  if (u.halfDead || !u.hero) return;
  u.halfDead = true; u.hero.halfDead = true;
  popText(u.x, u.y + 1.6, u.z, '반시체', 'crit', 2); spark(u.x, u.y + 0.5, u.z, 0x8a0a14, 30, 6); camShake(0.3, 0.3);
  if (typeof uiToast === 'function') uiToast(`<b style="color:#ff5a4a">${u.hero.name} — 반시체</b> <small>${why} · 이 원정에선 못 일어남 · 데리고 돌아가면 수술. 한 번 더 당하면 죽는다</small>`, 'warn');
  if (typeof clashLog === 'function') clashLog(`${u.hero.name}는 숨만 붙어 있다. 한 번 더 당하면 끝이다.`);
}
function finishBlow(e, a){
  if (a.dead || !a.downed) return;
  spark(a.x, a.y + 0.3, a.z, 0x8a0a14, 26, 6); camShake(0.35, 0.25); SFX.thump && SFX.thump(90, 0.5, 0.2); dust(a.x, a.z, 10);
  if (a.D.undying){ a.crushed = true; if (a.reb && a.reb.upAt) a.reb.upAt = Math.max(a.reb.upAt, G.t + 7); popText(a.x, a.y + 1.2, a.z, '곤죽… (7초 뒤 재생)', 'hurt', 1.4); return; }
  if (!a.halfDead) return makeHalfDead(a, `${e.D.name}의 확인사살`);
  // 반시체를 또: 죽음 (인주는 전멸)
  if (a === G.player){ popText(a.x, a.y + 1.6, a.z, '…', 'crit', 2); if (typeof expWipe === 'function' && EXP && !EXP.ending) expWipe(); return; }
  const h = a.hero; h.st = 'dead'; h.halfDead = false; RPG.party = RPG.party.filter(k => k !== h.id);
  a.dead = true; a.downed = false; a.fading = G.t; a.bar && a.bar.remove(); a.tag && a.tag.remove();
  caption(`${h.name}를 잃었다`, `${e.D.name}가 확인사살했다. 다시는 돌아오지 않는다`);
  for (const b of allies()) if (b.hero) b.hero.san = Math.max(0, (b.hero.san ?? 50) - 25);
}
const _enemyThinkM = enemyThink;
enemyThink = function(u, dt){
  if (G.mode === 'exp' && u.alert && u.st === 'idle' && !u.D.boss && !u.lock && (u.D.melee || u.D.line)){
    u.finCd = (u.finCd ?? rnd(2, 4)) - dt;
    if (u.finCd <= 0){
      u.finCd = rnd(3, 6);
      const dn = G.units.find(a => a.side === 'ally' && a.hero && a.downed && !a.dead && !a.carriedBy && dist(a, u) < 2.8);   // v1.3 업혀 가는 인주는 못 노림 (업은 동료를 쓰러뜨려야)
      if (dn && (!allies().some(a => dist(a, u) < 2.2) || Math.random() < 0.35)){
        setAim(u, dn.x, dn.z); popText(u.x, u.y + bodyH(u) + 0.5, u.z, '확인사살…', 'alert', 0.9);
        windup(u, 'circle', { x: dn.x, z: dn.z, r: 0.75, windup: 0.9, zoneSkip: true, after: d => { if (Math.hypot(dn.x - d.x, dn.z - d.z) < 1.0) finishBlow(u, dn); } }, () => {}, 0x8a0a14);
        return;
      }
    }
  }
  if (u.cdMul > 1 && u.cd > 0) u.cd += dt * (1 - 1 / u.cdMul);   // 눈이 터짐: 공격 대기가 느려짐
  return _enemyThinkM(u, dt);
};
// 반시체는 싸움이 끝나도 · 물약으로도 못 일어남
{ const keepDown = () => { for (const u of G.units) if (u.halfDead && !u.dead){ u.downed = true; u.st = 'down'; u.hp = 0; } };
  const _rcM = reviveCheck; reviveCheck = function(dt){ const r = _rcM(dt); keepDown(); return r; };
  const _uiM = useItem; useItem = function(it, u){ const r = _uiM(it, u); keepDown(); return r; }; }
// v1.2 인주가 반시체: 조작할 수 없음 → 싸움이 끝나고 3초 조용하면 서 있는 동료가 들쳐업고 굴로 (수술). 업을 동료가 없으면 전멸
// v1.3 싸움 중에도 업으러 감 (민수: 세자르에게 쓰러지면 레베카나 카리우스가 들쳐업고 이탈하지 않는 한 게임 오버) —
//   세자르 앞이거나 (그는 업고 가는 자를 막지 않음 · retreat.js) · 서 있는 동료가 하나뿐이거나 · 업을 동료가 크게 다쳤으면 지금 달려감
//   → 들쳐업기 1.2초 → 3초 동안 빠져나감 (그 사이 업은 동료가 쓰러지면 떨어뜨리고, 다음 동료가) → 굴로
const CARRY = { t: 0, said: false, go: false, c: null, ph: '', pt: 0, lifted: 0 };
function carryReset(){
  if (CARRY.c && CARRY.c.lock === 'carry') CARRY.c.lock = null;
  const pl = G.player; if (pl && pl.carriedBy){ pl.carriedBy = null; pl.lift = 0; }
  Object.assign(CARRY, { t: 0, go: false, c: null, ph: '', pt: 0 });
}
TICKS.push(dt => {
  const pl = G.player;
  if (G.mode !== 'exp' || !EXP || EXP.ending || !pl || !pl.halfDead){ if (CARRY.c || CARRY.said){ carryReset(); CARRY.said = false; CARRY.lifted = 0; } return; }
  if (!CARRY.said){ CARRY.said = true; caption('인주 — 반시체', '조작할 수 없다 · 동료가 업고 빠져나간다 · Tab 보는 동료 바꾸기'); }
  const alertN = foes().filter(e => e.alert && !e.dead).length;
  CARRY.t = alertN ? 0 : CARRY.t + dt;
  let c = CARRY.c;
  if (c && (c.dead || c.downed || c.halfDead)){ if (CARRY.ph !== 'walk') popText(pl.x, pl.y + 1.2, pl.z, '떨어뜨렸다', 'hurt', 1); carryReset(); c = null; }
  if (pl.carriedBy && c){ pl.x = c.x; pl.z = c.z + 0.02; pl.lift = 0.85; }
  if (CARRY.go) return;
  if (!c){
    const pref = ['kariusAlly', 'rebeccaAlly', 'goodwill'], rank = a => { const i = pref.indexOf(a.kind); return i < 0 ? 9 : i; };
    const cands = allies().filter(a => a !== pl && a.hero && !a.guest && !a.halfDead && !a.lock).sort((a, b) => rank(a) - rank(b));
    if (!cands.length){ if (!alertN || !allies().some(a => a !== pl)) expWipe(); return; }
    const cz = foes().some(e => !e.dead && e.kind === 'cesar' && (e.alert || e.czRest));
    if (!(CARRY.t >= 3 || (alertN && (cz || cands.length <= 1 || cands[0].hp < cands[0].max * 0.4)))) return;
    c = CARRY.c = cands[0]; CARRY.ph = 'walk'; CARRY.pt = 0; c.lock = 'carry'; interrupt(c); c.st = 'idle';
    if (alertN){ popText(c.x, c.y + bodyH(c) + 0.5, c.z, '인주!', 'big', 1); caption(`${c.D.name}가 인주에게 달려간다`, '싸움 한가운데서 — 업고 빠져나간다'); }
  }
  if (CARRY.ph === 'walk'){
    CARRY.pt += dt;
    if (dist(c, pl) > 1.0 && CARRY.pt < 12){ navTo(c, pl.x, pl.z, c.spd * 1.35, dt, 0.8); c.moving = true; setPose(c, c.S.poses.run ? 'run' : 'walk'); return; }
    CARRY.ph = 'lift'; CARRY.pt = 0; c.moving = false; setPose(c, c.S.poses.kneel ? 'kneel' : 'idle'); return;
  }
  if (CARRY.ph === 'lift'){
    CARRY.pt += dt; if (CARRY.pt < (alertN ? 1.2 : 0.3)) return;
    CARRY.ph = 'flee'; CARRY.pt = 0; CARRY.lifted = G.t; pl.carriedBy = c; c.moving = false; setPose(c, c.S.poses.carry ? 'carry' : 'idle');
    caption(`${c.D.name}가 인주를 들쳐업었다`, alertN ? '빠져나간다 — 3초만 버티면' : '숨만 붙어 있다 — 굴로 돌아가 수술');
    if (typeof clashLog === 'function') clashLog(`${c.D.name}가 반시체가 된 인주를 들쳐업고 빠져나간다.`);
    if (!alertN){ CARRY.go = true; setTimeout(() => { if (EXP && !EXP.ending) expReturn(); }, 1800); }
    return;
  }
  if (CARRY.ph === 'flee'){
    CARRY.pt += dt;
    const e = nearest(c, foes().filter(f => f.alert && !f.dead), 30);
    if (e){ const a = Math.atan2(c.z - e.z, c.x - e.x); navTo(c, c.x + Math.cos(a) * 3, c.z + Math.sin(a) * 3, c.spd * 0.9, dt, 0); c.moving = true; setPose(c, c.S.poses.carry ? 'carry' : 'walk'); }
    if (CARRY.pt >= 3){ CARRY.go = true; caption(`${c.D.name}가 빠져나갔다`, '인주를 업고 — 굴로, 수술'); setTimeout(() => { if (EXP && !EXP.ending) expReturn(); }, 700); }
  }
});

/* ---------- v1.2 죽은 동료는 굴에도 없음 — 그 자리에 무덤 (민수: 죽은 청광묵이 로비에 그대로 있는 건 NG) ----------
   굴 코드가 청광묵 · 카리우스를 늘 있다고 보고 쓰므로, 유닛은 남겨 두되 보이지 않고 (gone) 말 · 끼니 · 굴 싸움 · 아래 칸에서 빠짐 (prologue.js v0.117) */
const GRAVE_TXT = { cheong: ['(작은 흙무덤. 흑요석 단검이 꽂혀 있다)', '…"대장!" 하고 부르던 목소리가 없다.'], karius: ['(커다란 돌무덤. 깨진 안경이 놓여 있다)', '…캉. 캉. 그 소리가 그립다.'] };
function caveGone(u, id, spot){
  if (!u) return;
  u.gone = true; u.dead = true; u.downed = false; u.lock = true; u.moving = false; if (u.group) u.group.visible = false; if (u.bar) u.bar.remove(); if (u.tag) u.tag.remove();
  G.inspect = G.inspect.filter(o => o.unit !== u);
  const h = RPG.heroes[id], x = Math.round(spot.x), z = Math.round(spot.z);
  if (typeof tileProp === 'function') tileProp(DA + 'H-027.webp', x, z, 1.0, { tint: 0.85 });
  G.inspect.push({ x, z, r: 1.6, mark: '무덤', far: 6, label: `${h ? h.name : ''}의 무덤`, fn: () => textbox('', GRAVE_TXT[id] || ['(무덤)']) });
  if (h && !h.mourned){ h.mourned = PRO.day; setTimeout(() => caption(`${h.name}의 무덤`, '굴이 조용하다'), 1600); }
}
function caveGraves(ch, ka, C, K){
  if (RPG.heroes.cheong && RPG.heroes.cheong.st === 'dead') caveGone(ch, 'cheong', C);
  if (RPG.heroes.karius && RPG.heroes.karius.st === 'dead') caveGone(ka, 'karius', K);
}

/* ---------- 수술 (굴로 돌아온 뒤) · 빈사 · 후유증 ---------- */
{ const _e2c = expToCave;
  expToCave = function(sum){
    const hd = Object.values(RPG.heroes).filter(h => h.halfDead && h.st !== 'dead').map(h => h.id);
    const r = _e2c(sum);
    if (hd.length){ const iv = setInterval(() => { if (G.mode === 'cave' && PRO.cave && !G.lock && !G.waitInput){ clearInterval(iv); surgery(hd); } }, 500); }
    return r;
  }; }
async function surgery(ids){
  G.lock = true;
  const doc = !PRO.rebOut && PRO.cave && PRO.cave.ch && PRO.cave.ch.gone ? ['카리우스', ['(말없이 상처를 불로 지진다)', '…캉.']] : PRO.rebOut ? ['레베카', ['…숨이 붙어 있어요.', '제가 꿰맬게요. 조금 아플 거예요. …괜찮아요, 괜찮아요.']] : ['청광묵', ['대장! 피 많이 난다!', '청광묵이 불로 지진다! 참아라!!']];
  await (typeof vnTalk === 'function' ? vnTalk(doc[0], doc[1]) : textbox(doc[0], doc[1]));
  for (const id of ids){
    const h = hero(id); h.halfDead = false;
    const pool = ['limp', 'tremor', 'scar', 'dread'].filter(k => !(h.wounds || []).some(w => w.k === k)), k = pool[Math.floor(Math.random() * pool.length)] || 'scar';
    h.wounds = h.wounds || []; h.wounds.push({ k, d: PERM });
    if (id === 'inju'){ if (G.player){ G.player.hp = Math.max(1, Math.round(G.player.max * 0.3)); applyHero(G.player, h); } }
    else { h.st = 'moribund'; h.moribund = 3; h.hp = Math.round((h.hpMax || 100) * 0.15); const key = { cheong: 'ch', karius: 'ka', rebecca: 'reb' }[id]; if (key) PRO.hpf[key] = 0.15; }
    caption(`${h.name} — 살았다`, `${id === 'inju' ? '' : '빈사 3일 (원정 못 감) · '}평생 후유증: ${WOUND[k].n} (${WOUND[k].note.replace('수술 후유증 · ', '')})`);
    await wait(2.6);
  }
  G.lock = false; typeof saveRpg === 'function' && saveRpg();
}
if (typeof endDay === 'function'){
  const _endDayM = endDay;
  endDay = async function(){
    const up = [];
    for (const h of Object.values(RPG.heroes)) if (h.st === 'moribund'){ h.moribund = (h.moribund || 1) - 1; if (h.moribund <= 0){ h.st = 'ok'; h.moribund = 0; up.push(h.name); } }
    const r = await _endDayM.apply(this, arguments);
    up.forEach((n, i) => setTimeout(() => typeof uiToast === 'function' && uiToast(`${n} — 빈사에서 회복 (다시 원정 갈 수 있음)`, 'loot r2'), 900 + i * 900));
    return r;
  };
}
// 뇌 손상 (영구): 가끔 혼란
setInterval(() => { if (!EXP || G.mode !== 'exp' || G.paused) return; for (const u of allies()) if (u.hero && (u.hero.wounds || []).some(w => w.k === 'brainP') && Math.random() < 0.22) addStatus(u, 'confuse', { t: 3.5 }); }, 4000);   // v1.3 더 자주

/* ---------- 테이크다운 (Shift + V) ---------- */
const TD = { reach: 2.6, cd: 3 };
function takedown(u){
  if ((P.tdCd || 0) > G.t) return popText(u.x, u.y + 2.2, u.z, `테이크다운 ${Math.ceil(P.tdCd - G.t)}초`, 'miss', 0.6);
  const t = (mouse.over && !mouse.over.dead && dist(mouse.over, u) < TD.reach ? mouse.over : null) || nearest(u, fightTargets().filter(e => Math.abs(angDiff(Math.atan2(e.z - u.z, e.x - u.x), u.aim)) < 1.0), TD.reach) || nearest(u, fightTargets(), 1.9);
  if (!t) return popText(u.x, u.y + 2.2, u.z, '잡을 다리가 없다', 'miss', 0.7);
  if (!canGrab(u, t) || tooBig(u, t)) return popText(u.x, u.y + 2.2, u.z, t.D.boss ? '잡을 수 없다' : '너무 크다', 'miss', 0.7);
  P.tdCd = G.t + TD.cd;
  const back = Math.abs(angDiff(Math.atan2(u.z - t.z, u.x - t.x), t.aim)) > 1.9;
  let p = 0.55 + (grStr(u) - grStr(t)) * 0.04 + (isLying(t) || t.st === 'hurt' ? 0.25 : 0) + (back ? 0.2 : 0) + (t.st === 'windup' ? 0.15 : 0) - (t.D.heavy ? 0.25 : 0);
  p = Math.max(0.12, Math.min(0.92, p)); const pct = Math.round(p * 100);
  // 뛰어듦
  const n = norm(t.x - u.x, t.z - u.z), go = Math.max(0, dist(u, t) - u.r - t.r - 0.05);
  SFX.whoosh && SFX.whoosh(); dust(u.x, u.z, 4);
  if (go > 0.15 && typeof rushStart === 'function') rushStart(u, Math.atan2(n.z, n.x), go, { sp: 22, done: () => !t.dead && !u.dead && tdLand(u, t, p, pct, back) });   // v1.1 (v0.82) 실제로 뛰어듦 (전엔 한 프레임에 옮김)
  else tdLand(u, t, p, pct, back);
}
function tdLand(u, t, p, pct, back){
  setAim(u, t.x, t.z); dust(u.x, u.z, 8);
  if (Math.random() < p){
    const L = grab(u, t); if (!L) return;
    L.phase = 'ground'; L.t = 0; t.lying = true; hurt(u, t, u.atk * 0.4, { from: u, grapple: true, noCam: true });
    popText(t.x, t.y + 1.6, t.z, `테이크다운! (${pct}%)`, 'big', 1.1); camShake(0.3, 0.2); dust(t.x, t.z, 14); SFX.boom && SFX.boom(0.4); G.hitstop = Math.max(G.hitstop, 0.08);
    if (typeof clashLog === 'function') clashLog(`${t.D.name}의 다리를 낚아채 넘어뜨리고 올라탔다.`);
  } else {
    popText(u.x, u.y + 2.2, u.z, `스프롤! (${pct}%)`, 'hurt', 1.1);
    u.st = 'hurt'; u.stT = 0.9; u.lying = true; u.tripT = G.t + 0.9; setPose(u, u.S.poses.curl ? 'curl' : 'hurt'); addStatus(u, 'vuln', { t: 1.5 });
    setTimeout(() => { if (!t.dead && !u.dead && dist(t, u) < 2) hurt(t, u, t.atk * 0.5, { from: t, zone: 'high' }); }, 250);
    if (typeof clashLog === 'function') clashLog(`${t.D.name}가 다리를 빼며 위에서 짓눌렀다.`);
  }
}
if (typeof playerGrabInput === 'function'){
  const _pgiM = playerGrabInput;
  playerGrabInput = function(u){
    if (hit('KeyV') && (down('ShiftLeft') || down('ShiftRight')) && !u.lock && !G.lock && u.st !== 'windup' && !u.downed){ pressed.delete('KeyV'); takedown(u); return true; }
    return _pgiM(u);
  };
}
// 기술표
if (typeof MOVES !== 'undefined'){
  const wr = MOVES.find(m => m[0] === '레슬링'); if (wr) wr[1].splice(1, 0, ['Shift + V', '테이크다운 — 다리를 잡아 넘어뜨리고 올라탐 (확률, 실패하면 스프롤)']);
  MOVES.splice(2, 0, ['공격 높이 (적의 예고 색)', [['▲ 주황', '상단 — G 숙여 피함 (막기 됨)'], ['■ 빨강', '중단 — F 막기 · 튕겨내기'], ['▼ 보라', '하단 — Space 뛰어 피함 (막기는 반만)'], ['검붉은 원', '확인사살 — 쓰러진 동료를 노림, 치거나 밀어 끊기']]]);
}
