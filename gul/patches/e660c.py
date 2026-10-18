def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'; H='rt3_head.js'
# ---- 베테랑 궁수: 빨리 당김 ----
rep(H,"tal: 0.9, marks: 0.3 },","tal: 0.9, marks: 0.3, draw: 0.75, nock: 0.8 },   // v6.6 draw · nock = 베테랑 궁수의 활 당기는 준비 × · 다음 화살 회복 × (총은 그대로)")
rep(T,"wind: s.wind, rec: s.rec","wind: +(s.wind * (vet && far && wp.kind === '활' && rules.vet ? rules.vet.draw || 1 : 1)).toFixed(2), rec: +(s.rec * (vet && far && wp.kind === '활' && rules.vet ? rules.vet.nock || 1 : 1)).toFixed(2)")
# ---- 지침 · 탈진 규칙 ----
rep(H,"  stamina: { drain: 14,","  fatigue: { swing: 7, heavy: 10, charge: 12, bash: 7, shot: 2.5, gunShot: 0.4, hit: 2.5, recWalk: 5, recRest: 7, recGuard: 1.5, tired: 55, exhaust: 100, out: 50, vet: 0.8,   // v6.6 지침 · 탈진 (질주 숨과 별개): 휘두름 · 거구의 일격 · 돌진 · 밀치기 · 활 당기기 · 사격 · 맞음으로 쌓임 (막기 · 걷기는 안 침), 베테랑 ×0.8. 맞붙지 않고 걸으면 −5/초 · 서 있으면 −7/초 · 맞붙어 막기만 하면 −1.5/초\n    ti: { wind: 1.1, dodge: 0.85 }, ex: { block: 0.3, crit: 0.15, down: 1.5, dodge: 0.5, wind: 1.25, post: 1.3 } },   // 지침 (55 넘음 😓): 준비 ×1.1 · 피하기 ×0.85 / 탈진 (100 🥵, 50 아래로 회복할 때까지): 막아도 30% 뚫림 · 급소 +15% · 넘어짐 ×1.5 · 피하기 ×0.5 · 준비 ×1.25 · 막을 때 자세 ×1.3 · 질주 못 함 (숨 고르기)\n  stamina: { drain: 14,")
# ---- 엔진: 쌓고 · 회복 · 상태 ----
rep(T,"function startAct(W, u, t, why){","""// v6.6 지침 · 탈진: 힘쓰는 동작 · 맞음으로 쌓이고, 맞붙지 않고 걷거나 쉬면 풀림. 지침 😓 · 탈진 🥵 (질주 숨과 별개 — 지쳐도 아드레날린으로 몇 번은 뛰지만 탈진이면 숨 고르기)
const FATR = W => W.rules.fatigue;
function fatState(W, u){ const F = FATR(W); if (!F) return;
  if (!u.exhausted && u.fat >= F.exhaust){ u.exhausted = true; u.tired = true; L(W, { k: 'exhaust', a: u.i, vis: u.side === 0 || !!u.seenBy }); }
  else if (u.exhausted && u.fat <= F.out){ u.exhausted = false; L(W, { k: 'unexhaust', a: u.i, vis: u.side === 0 || !!u.seenBy }); }
  if (!u.tired && u.fat >= F.tired){ u.tired = true; L(W, { k: 'tired', a: u.i, fat: Math.round(u.fat), vis: u.side === 0 || !!u.seenBy }); }
  else if (u.tired && !u.exhausted && u.fat < F.tired - 10) u.tired = false; }
function tire(W, u, k, mul){ const F = FATR(W); if (!F || AI6.includes('fat') || !u.alive) return; u.fat = Math.min(100, (u.fat || 0) + (F[k] || 0) * (u.vet ? F.vet : 1) * (mul || 1)); fatState(W, u); }
const fatMul = (W, u, k) => { const F = FATR(W); if (!F || AI6.includes('fat')) return 1; return u.exhausted ? (F.ex[k] != null ? F.ex[k] : 1) : u.tired ? (F.ti[k] != null ? F.ti[k] : 1) : 1; };
function startAct(W, u, t, why){""")
rep(T,"  const mode = !heal && u.canSweep && !isFar(u) ? swingPlan(W, u, t) : null, wind = u.wind * (mode ? (W.rules.heavy || {}).wind || 1.3 : 1);","  const mode = !heal && u.canSweep && !isFar(u) ? swingPlan(W, u, t) : null, wind = u.wind * (mode ? (W.rules.heavy || {}).wind || 1.3 : 1) * (heal ? 1 : fatMul(W, u, 'wind'));\n  if (!heal) tire(W, u, isFar(u) ? (u.loud ? 'gunShot' : 'shot') : mode ? 'heavy' : 'swing');   // v6.6 지침")
rep(T,"function startBash(W, u, t, why, body){   // v5.8.6 body = 방패 없이 몸 (어깨) 으로 밀침 — 더 약함","function startBash(W, u, t, why, body){   // v5.8.6 body = 방패 없이 몸 (어깨) 으로 밀침 — 더 약함\n  tire(W, u, 'bash');   // v6.6")
rep(T,"  u.chargeCd = W.t + (C.cd || 8); stop(u); u.burst = null;","  u.chargeCd = W.t + (C.cd || 8); stop(u); u.burst = null; tire(W, u, 'charge');   // v6.6 지침")
# 회복 (매 걸음, 질주 숨 옆)
rep(T,"      else if (u.winded && u.sta >= ST.back){ u.winded = false; L(W, { k: 'breath', a: u.i, vis: u.side === 0 || !!u.seenBy }); } } }","""      else if (u.winded && u.sta >= ST.back){ u.winded = false; L(W, { k: 'breath', a: u.i, vis: u.side === 0 || !!u.seenBy }); } }
    const F = FATR(W); if (F && (u.fat || 0) > 0 && !AI6.includes('fat') && !(u.act && ['atk', 'charge', 'bash', 'throw'].includes(u.act.k))){   // v6.6 지침 풀림: 맞붙지 않고 걸으면 · 쉬면 · (맞붙어 막기만 하면 조금)
      const eng = W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < Math.max(isFar(u) ? 0.3 : u.rng, f.rng) + 0.6);
      u.fat = Math.max(0, u.fat - (eng ? F.recGuard : sp > 0.3 ? F.recWalk : F.recRest) * dt); fatState(W, u); } }""")
# 맞음
rep(T,"  if (o.far && !o.ff){ t.farHitT = W.t; t.farBy = u.i; }   // v6.4.2 사격받은 때 (노출 병력 회수)","  if (o.far && !o.ff){ t.farHitT = W.t; t.farBy = u.i; }   // v6.4.2 사격받은 때 (노출 병력 회수)\n  if (!o.block && real > 0) tire(W, t, 'hit', Math.min(2, real / 30));   // v6.6 맞으면 지침 (막은 건 안 침)")
# 효과: 막기 흔들림 · 급소 · 넘어짐 · 피하기 · 자세 · 질주
rep(T,"  if (arcX ? t.shield && guardOn(W, t) && W.rand() < (AR.shield != null ? AR.shield : 0.7) : inGuard(W, t, u, o.far || !!J)){","  const exFail = !arcX && t.exhausted && !AI6.includes('fat') && W.rand() < ((FATR(W) || {}).ex || {}).block && inGuard(W, t, u, o.far || !!J); if (exFail) o.exFail = true;   // v6.6 탈진: 막아도 뚫림\n  if (arcX ? t.shield && guardOn(W, t) && W.rand() < (AR.shield != null ? AR.shield : 0.7) : !exFail && inGuard(W, t, u, o.far || !!J)){")
rep(T,"crit = J ? W.rand() < J.crit : W.rand() < (CR.base || 0) + (pr ? CR.prone || 0 : 0) + ((extra && extra.heavyCrit) || 0);","crit = J ? W.rand() < J.crit : W.rand() < (CR.base || 0) + (pr ? CR.prone || 0 : 0) + ((extra && extra.heavyCrit) || 0) + (t.exhausted && !AI6.includes('fat') ? ((FATR(W) || {}).ex || {}).crit || 0 : 0);   // v6.6 탈진하면 급소가 열림")
rep(T,"  p /= 1 + 0.25 * formMates(W, u) + (u.line ? 0.15 * Math.min(4, u.line.n - 1) : 0);\n  return Math.max(0, Math.min(0.95, p));","  p /= 1 + 0.25 * formMates(W, u) + (u.line ? 0.15 * Math.min(4, u.line.n - 1) : 0);\n  p *= fatMul(W, u, 'down');   // v6.6 탈진하면 잘 넘어짐\n  return Math.max(0, Math.min(0.95, p));")
rep(T,"  if (backToWall(W, u, atk)) p *= D.wall != null ? D.wall : 0.35;","  if (backToWall(W, u, atk)) p *= D.wall != null ? D.wall : 0.35;\n  p *= fatMul(W, u, 'dodge');   // v6.6 지치면 덜 피함")
rep(T,"    t.post -= R.postCost * (t.gCost || 1) * (2 - (t.gTal != null ? t.gTal : 1))","    t.post -= fatMul(W, t, 'post') * R.postCost * (t.gCost || 1) * (2 - (t.gTal != null ? t.gTal : 1))")
rep(T,"const spdNow = (W, u) => (u.winded","const spdNow = (W, u) => (u.exhausted && !AI6.includes('fat') ? 1 : 1) * (u.winded")
rep(T,"* u.spd * u.spdMul * (!u.winded &&","* u.spd * u.spdMul * (!u.winded && !(u.exhausted && !AI6.includes('fat')) &&")
rep(T,"dark, led: o.led, dir: o.dir, block: !!o.block,","dark, led: o.led, dir: o.dir, block: !!o.block, exFail: !!o.exFail,")
# AI: 탈진한 마디 교대 · 탈진한 상대 노림
rep(T,": h.bleed ? '피를 흘림' :",": h.exhausted ? '탈진 🥵' : (h.fat || 0) >= 80 ? '지침 😓' : h.bleed ? '피를 흘림' :")
rep(T,"  return flee * val * (supportOf(W, f) === 0 ? 1.3 : 1) * 1000 / eff; }","  return flee * val * (supportOf(W, f) === 0 ? 1.3 : 1) * (f.exhausted && (S === 0 ? true : !!f.seenBy || W.units.some(e => e.alive && e.side === S && canSee(W, e, f))) ? 1.3 : 1) * 1000 / eff; }   // v6.6 탈진한 상대 (보이면) 노림")
rep(T,"module.exports = { directSpot,","module.exports = { tire, fatState, fatMul, directSpot,")
