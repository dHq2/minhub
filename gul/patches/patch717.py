# v7.17.0 엔진 — patch717.py v1.8 (v1.8: 돌격해 오는 상대는 옆으로 비켜섬 (사수도) · v1.7: 자기 치료 중에도 위협이 오면 끊음 · v1.6: 회피기동의 맞붙음 · 뛰기 거리를 상대 리치에 맞춤 · v1.5: 덮칠 땐 순간 가속 ×3 · v1.4: 같은 순간 휘두르면 비켜설 수도 · 무기로 막는 자세 (방패 아님) 에서도 스텝 · v1.3: 스텝 쿨은 성공했을 때만 · v1.2: 치는 중 · 거두는 중에도 스텝 (상대 일격이 먼저면) · v1.1: 스텝은 막기와 견줌 — 막을 수 있어도 반 확률로 비켜섬 · 1F 1단계: 팜 버스트 돌입 ×2 · 시전 0.2 · 기습 가속 · 사이드 / 백스텝 (헛침 · 빈틈) · 이동 사격 (등급별 명중) · 도약 사격은 사격 A 이상 · 질주 중 사격 없음 · 의학 등급 · 영웅 · 체급 · 근력 제한 무기 · 몸 리치 · 궁수의 활 · 레베카의 검)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "  palm: { wind: 0.25, rec: 0.45, cd: 5, reach: 0.08,", "  palm: { wind: 0.2, dash: 2, dashD: 1.4, rec: 0.45, cd: 5, reach: 0.08,")   # v7.17 시전 0.25 → 0.2 · 마지막 dashD 칸은 ×dash 로 파고듦
h = rep(h, "shotAt: 0.5, shotAim: 0.6 },", "shotAt: 0.5, shotAim: 0.6, shotMin: 0.55 },")   # v7.17 도약 사격은 사격 A (0.55) 이상
h = rep(h, "move: { spd: 0.8, aim: 0.88, step: 1.1 } },", "move: { spd: 0.8, aim: 0.88, step: 1.1, aimG: { S: 0.97, A: 0.88, B: 0.76, C: 0.68, none: 0.6 }, threat: 3 } },")   # v7.17 이동 사격 명중 (등급별)
h = rep(h, "'은신': { S: 1, A: 0.85, B: 0.7, C: 0.55, D: 0.4, E: 0.3 } },", "'은신': { S: 1, A: 0.85, B: 0.7, C: 0.55, D: 0.4, E: 0.3 }, '의학': { S: 1.45, A: 1.3, B: 1.15, C: 1 } },")   # v7.17 [의학X] = 치료량 ×
h = rep(h, "'하얀 나무':{rng:10, ammo:30, aim:0.5, vel:200, P:70, draw:0.15, kind:'활', pen:0.65, penK:0.85, jit:0.35},",
        "'하얀 나무':{rng:10, ammo:30, aim:0.5, vel:200, P:70, draw:0.15, kind:'활', pen:0.65, penK:0.85, jit:0.35}, '궁수의 활':{rng:12, ammo:40, aim:0.5, vel:240, P:70, draw:0.15, kind:'활', pen:0.65, penK:0.85, jit:0.35, req:'중대형'}, '레베카의 검':{rng:0.52, kind:'날붙이'},")
h = rep(h, "  dodge: { p: 0.4, step: 0.6, time: 0.18, cd: 1.6, win: 0.22, wall: 0.35 },",
        """  dodge: { p: 0.4, step: 0.6, time: 0.18, cd: 1.6, win: 0.22, wall: 0.35 },
  step: { on: true, p: 0.3, cd: 3, dist: 0.85, time: 0.16, open: 0.8, openCrit: 0.2, recAdd: 0.3, chargeD: 1.5, chargeK: 1.6 },   /* v7.17 사이드 · 백스텝: 근접 일격이 떨어지기 직전 짧게 비켜섬 (자동만 · cd 초에 한 번) — 헛치면 친 쪽에 open 초 빈틈 (치명 +openCrit · 거둠 +recAdd) */
  lunge: { on: true, d: 1.6, back: 0.25, side: 0.1, unseen: 0.25, t: 0.2 },   /* v7.17 기습 가속: 마지막 d 칸 — 배후 · 측면 · 들키지 않음만큼 빨라짐 */
  size: { kb: { 소형: 3, 중형: 2, 중대형: 1, 대형: 0.5, 초대형: 0.2 } },   /* v7.17 체급 (소형 · 중형 · 중대형 · 대형 · 초대형) — 큰 충격에 밀리는 칸 */
  reachB: { k: 0.25, lo: -0.1, hi: 0.25 },   /* v7.17 몸 리치: 든 근접 무기 사거리 + k × (키 − 1.7) (lo ~ hi) */""")
wr('rt3_head.js', h)

s = rd('rt3_tail.js')
# ---------- 몸 리치 (든 근접 무기) ----------
s = rep(s, "rng: o.rng != null ? o.rng : p.weapon && rules.weapons && rules.weapons[p.weapon] ? rules.weapons[p.weapon].rng : C.rng, wind: pick('wind'),",
        "rng: o.rng != null ? o.rng : p.weapon && rules.weapons && rules.weapons[p.weapon] ? +(rules.weapons[p.weapon].rng + bodyReach(p, rules)).toFixed(3) : C.rng, wind: pick('wind'),")
s = rep(s, "const bodyR = t => 0.26 + Math.min(7, Math.max(1, t)) * 0.025;",
        """const bodyR = t => 0.26 + Math.min(7, Math.max(1, t)) * 0.025;
/* v7.17 몸 리치: 든 근접 무기 (날붙이 · 둔기) 만 키만큼 길어지고 짧아짐. 체급: 소형 · 중형 · 중대형 · 대형 · 초대형 */
function bodyReach(p, rules){ const w = (rules.weapons || {})[p.weapon] || {}, B = rules.reachB || {}; if (!B.k || (w.kind !== '날붙이' && w.kind !== '둔기') || w.ammo != null || w.thr) return 0; return Math.max(B.lo != null ? B.lo : -0.1, Math.min(B.hi != null ? B.hi : 0.25, B.k * ((+p.height || 1.7) - 1.7))); }
const SIZE_RANK = { 소형: 0, 중형: 1, 중대형: 2, 대형: 3, 초대형: 4 };
const sizeOf = u => u.sizeCls || (u.modBody || u.giant ? '대형' : (u.h || 1.7) >= 2 ? '중대형' : ((u.h || 1.7) < 1.45 || (u.mass || 70) < 45) ? '소형' : '중형');
const sizeOK = (u, req, strong) => !req || (SIZE_RANK[sizeOf(u)] || 0) >= (SIZE_RANK[req] || 0) || !!strong;""")
# 체급을 인물에 (무게 · 키가 정해진 뒤)
s = rep(s, "      mass: massOf(p, rules, hh, gearOf(p, rules), s.hp),", "      mass: massOf(p, rules, hh, gearOf(p, rules), s.hp), sizeCls: p.sizeCls || null, heroic: tr.includes('영웅'),")
# ---------- 근력 제한 무기 (궁수의 활 = 중대형 이상 · 괴력) ----------
s = rep(s, "  if (wp.kind === '활' && u.arms && (u.arms.L || u.arms.R)) return false;\n  return true;\n}",
        "  if (wp.kind === '활' && u.arms && (u.arms.L || u.arms.R)) return false;\n  if (wp.req && !sizeOK(u, wp.req, (u.traits || []).some(x => /^괴력/.test(x)))) return false;   /* v7.17 일반 근력의 중형은 궁수의 활을 못 당김 */\n  return true;\n}")
# ---------- 기습 가속 · 팜 버스트 돌입 (이동 속력 ×) ----------
s = rep(s, "const spdNow = (W, u) => spdNow0(W, u) * (u.lie && !u.lieSw ? (W.rules.lie || {}).spd || 0.25 : 1);",
        "const spdNow = (W, u) => spdNow0(W, u) * (u.lie && !u.lieSw ? (W.rules.lie || {}).spd || 0.25 : 1) * (W.t < (u.lungeT == null ? -9 : u.lungeT) ? u.lungeK || 1 : 1);   // v7.17 기습 가속 · 팜 버스트 돌입")
s = rep(s, "  if (!ordered && assnAI(W, u, dt)) return;   // v7.6 어둠 속에서 등이 열린 상대를 숨어서 노림",
        "  lungeChk(W, u, t);   /* v7.17 기습 가속 */\n  if (!ordered && assnAI(W, u, dt)) return;   // v7.6 어둠 속에서 등이 열린 상대를 숨어서 노림")
s = rep(s, "function fight(W, u, t, dt, see, ordered){",
        """/* v7.17 기습 가속: 근접이 상대에게 붙기 마지막 d 칸 — 배후 · 측면 · 들키지 않음만큼 빨라짐 (팜 버스트 · 장도리처럼 덮침). 피해 보정은 원래대로 (배후 > 측면) */
function lungeChk(W, u, t){
  const LG = W.rules.lunge || {}; if (!LG.on || !t || !t.alive || t.side === u.side || isFar(u) || u.crawl || u.lie || u.act) return;
  const g = gap(u, t); if (g > (LG.d || 1.6) || g <= u.rng + 0.05) return;
  const sd = sideOf(W, t, u), un = !canSee(W, t, u) || !aware(W, t, u), k = 1 + (sd === 'back' ? LG.back || 0.25 : sd === 'side' ? LG.side || 0.1 : 0) + (un ? LG.unseen || 0.25 : 0);
  if (k <= 1.001) return;
  if (W.t >= (u.lungeT == null ? -9 : u.lungeT) + 0.5) L(W, { k: 'lunge', a: u.i, b: t.i, sd, un, mul: +k.toFixed(2), vis: u.side === 0 || !!u.seenBy });
  u.lungeT = W.t + (LG.t || 0.2); u.lungeK = k;
}
function fight(W, u, t, dt, see, ordered){""")
s = rep(s, "    setMood(W, u, gap(u, t) < 0.8 ? '바싹 파고듦' : '팜 버스트하러', t.i); goTo(W, u, t.x, t.y, dt);",
        "    if (palmReady(W, u) && gap(u, t) < (PALM(W).dashD || 1.4)){ if (W.t >= (u.lungeT == null ? -9 : u.lungeT) + 0.5) L(W, { k: 'palmDash', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); u.lungeT = W.t + 0.15; u.lungeK = PALM(W).dash || 2; }   /* v7.17 마지막 순간 ×2 로 들러붙음 */\n    setMood(W, u, gap(u, t) < 0.8 ? '바싹 파고듦' : '팜 버스트하러', t.i); goTo(W, u, t.x, t.y, dt);")
# ---------- 사이드 · 백스텝 ----------
s = rep(s, "    else if (e.side !== u.side && a.b === u.i && (!W.rules.evade || AI6.includes('evade'))){ atk = e; break; }",
        "    else if (e.side !== u.side && a.b === u.i && (!W.rules.evade || AI6.includes('evade'))){ atk = e; break; }\n    else if (e.side !== u.side && a.b === u.i && stepOK(W, u)){ atk = e; stepK = true; break; }   /* v7.17 사이드 · 백스텝 */")
s = rep(s, "  const D = W.rules.dodge || {}, win = D.win || 0.22;\n  let atk = null;",
        "  const D = W.rules.dodge || {}, win = D.win || 0.22, ST = W.rules.step || {};\n  let atk = null, stepK = false;")
s = rep(s, "  if (W.units.filter(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < f.rng + 0.5).length >= 3) p *= 0.5;\n  if (W.rand() >= p) return false;\n  const base = Math.atan2(u.y - atk.y, u.x - atk.x), st = D.step || 0.6, sg = W.rand() < 0.5 ? 1 : -1;\n  for (const da of [0, 0.7, -0.7, 1.3, -1.3]){",
        "  if (W.units.filter(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < f.rng + 0.5).length >= 3) p *= 0.5;\n"
        "  if (stepK) p = (ST.p != null ? ST.p : 0.3) * agi * Math.pow(gradeMul(W.rules, u.traits, '회피'), 0.6) * (u.vet ? 1.15 : 1) * fatMul(W, u, 'dodge') * (backToWall(W, u, atk) ? 0.3 : 1);   /* v7.17 스텝: 공격 · 막기 · 비켜섬의 심리전 (늦으면 그래도 맞음) */\n"
        "  if (stepK) u.stepCd = W.t + (ST.cd || 3);\n"
        "  if (W.rand() >= p) return false;\n"
        "  const base = Math.atan2(u.y - atk.y, u.x - atk.x), st = stepK ? ST.dist || 0.85 : D.step || 0.6, sg = W.rand() < 0.5 ? 1 : -1;\n"
        "  for (const da of stepK ? (W.rand() < 0.5 ? [1.3, -1.3, 0, 0.7, -0.7] : [0, 0.7, -0.7, 1.3, -1.3]) : [0, 0.7, -0.7, 1.3, -1.3]){")
s = rep(s, "    u.act = { k: 'dodge', phase: 'run', t0: W.t, end: W.t + (D.time || 0.18), fx: u.x, fy: u.y, tx: x, ty: y, b: atk.i };",
        "    u.act = { k: 'dodge', phase: 'run', t0: W.t, end: W.t + (stepK ? ST.time || 0.16 : D.time || 0.18), fx: u.x, fy: u.y, tx: x, ty: y, b: atk.i, step: stepK ? (Math.abs(da) > 1 ? 'side' : 'back') : null };\n    if (stepK) u.stepT = W.t;")
s = rep(s, "    L(W, { k: 'dodge', a: u.i, b: atk.i, mate, wall: backToWall(W, u, atk), vis: u.side === 0 || !!u.seenBy || !!atk.seenBy });",
        "    L(W, { k: 'dodge', a: u.i, b: atk.i, mate, wall: backToWall(W, u, atk), step: stepK ? (Math.abs(da) > 1 ? 'side' : 'back') : null, vis: u.side === 0 || !!u.seenBy || !!atk.seenBy });")
s = rep(s, "function tryDodge(W, u){",
        "const stepOK = (W, u) => { const ST = W.rules.step || {}; return !!ST.on && W.t >= (u.stepCd == null ? -9 : u.stepCd) && !u.raised && !isFar(u) && !u.lie && !u.crawl && !(u.side === 0 && u.order && u.order.k === 'hold') && !AI6.includes('step'); };\nfunction tryDodge(W, u){")
# 헛침 → 빈틈 (친 쪽)
s = rep(s, "    if (why){ u.miss++; const man = /노린 회피/.test(why); L(W, { k: 'miss', a: u.i, b: t.i, why, man }); if (W.fxOn && !man) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '빗나감', c: 'm', t0: W.t }); }",
        "    if (why){ u.miss++; const man = /노린 회피/.test(why), stp = !far && t.stepT != null && W.t - t.stepT < 0.6 && /몸을 빼|몸을 돌리지/.test(why); if (stp){ const ST = R.step || {}; u.openT = W.t + (ST.open || 0.8); A.whiff = true; why = (t.act && t.act.step === 'side' ? '사이드 스텝' : '백스텝') + '에 헛침 — 빈틈'; }   /* v7.17 */\n      L(W, { k: 'miss', a: u.i, b: t.i, why, man, whiff: stp || null }); if (W.fxOn && !man) W.fx.push({ k: 'num', x: t.x, y: t.y, s: stp ? '헛침!' : '빗나감', c: 'm', t0: W.t }); }")
s = rep(s, "    A.phase = 'rec'; A.end = W.t + u.rec * (far ? (A.sm === 'rapid' ? ((R.sshot || {}).rapid || {}).rec || 0.7 : 1) : wpnSpd(W, u)); A.t1 = W.t;",
        "    A.phase = 'rec'; A.end = W.t + u.rec * (far ? (A.sm === 'rapid' ? ((R.sshot || {}).rapid || {}).rec || 0.7 : 1) : wpnSpd(W, u)) + (A.whiff ? (R.step || {}).recAdd || 0.3 : 0); A.t1 = W.t;   // v7.17 헛치면 더 늦게 거둠")
s = rep(s, "  if (t.act) return t.act.b === u.i && t.act.phase === 'wind' && inGuard(W, t, u) ? '' : '틈';",
        "  if (W.t < (t.openT == null ? -9 : t.openT)) return '헛침 빈틈';   // v7.17\n  if (t.act) return t.act.b === u.i && t.act.phase === 'wind' && inGuard(W, t, u) ? '' : '틈';")
s = rep(s, "const CR = R.crit || {}, pr = prone(W, t), crit = J ? W.rand() < J.crit + (u.vit || 0) : W.rand() < (CR.base || 0) + (u.vit || 0) + (pr ? CR.prone || 0 : 0)",
        "const CR = R.crit || {}, pr = prone(W, t), crit = J ? W.rand() < J.crit + (u.vit || 0) : W.rand() < (CR.base || 0) + (u.vit || 0) + (pr ? CR.prone || 0 : 0) + (W.t < (t.openT == null ? -9 : t.openT) ? (R.step || {}).openCrit || 0.2 : 0)")
# ---------- 이동 사격 (모든 사수 · 등급별 명중) · 질주 중엔 안 쏨 ----------
s = rep(s, "const SS = (R.sshot || {})[A.sm] || {}, mvA = u.strafe && W.t < u.strafe.until ? ((R.sshot || {}).move || {}).aim || 0.88 : 1;",
        "const SS = (R.sshot || {})[A.sm] || {}, mvA = u.strafe && W.t < u.strafe.until ? mvAim(W, u) : 1;   /* v7.17 이동 사격 명중 = 사격 등급별 */")
s = rep(s, "const sGrade = u => (u.marks || 0) >= 0.69 && /활/.test(u.weapon || '') && !u.weaponGone;",
        """const sGrade = u => (u.marks || 0) >= 0.69 && /활/.test(u.weapon || '') && !u.weaponGone;
/* v7.17 이동 사격: 사수 · 궁수 누구나 — 명중 × 사격 등급 (S 거의 그대로 · A 어느 정도 · B 이하 떨어짐). 위협 (나를 겨누는 사수 · threat 칸 안의 근접) 이 있을 때 옆으로 걸으며 쏨 */
const mvAim = (W, u) => { const G = ((W.rules.sshot || {}).move || {}).aimG || {}, m = u.marks || 0; return m >= 0.69 ? G.S || 0.97 : m >= 0.54 ? G.A || 0.88 : m >= 0.39 ? G.B || 0.76 : m >= 0.24 ? G.C || 0.68 : G.none || 0.6; };
const strafeWant = (W, u) => { const M = (W.rules.sshot || {}).move || {}; return W.units.some(f => f.alive && !f.down && f.side !== u.side && ((f.act && f.act.b === u.i && isFar(f)) || (!isFar(f) && gap(u, f) < (M.threat || 3)))); };
const running = (W, u) => (u.mv && u.mv.run && W.t < u.mv.until) || (u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove'));""")
s = rep(s, "  if (!heal && sm !== 'aimed' && sGrade(u) && u.side === 1 && !u.order && !AI6.includes('strafe')) setStrafe(W, u, t, wind * smW + u.rec);   // v7.0 이동 사격: 당기는 동안 옆으로",
        "  if (!heal && sm !== 'aimed' && !AI6.includes('strafe') && isFar(u) && !u.lie && ((sGrade(u) && u.side === 1 && !u.order) || ((!u.order || (u.order.k === 'attack' && !u.order.now)) && strafeWant(W, u)))) setStrafe(W, u, t, wind * smW + u.rec);   // v7.0 이동 사격: 당기는 동안 옆으로   // v7.17 누구나 (위협이 있을 때 · 명중은 등급별)")
s = rep(s, "function startAct(W, u, t, why){\n  const heal = u.cls === '치유' && t.side === u.side;",
        "function startAct(W, u, t, why){\n  const heal = u.cls === '치유' && t.side === u.side;\n  if (!heal && isFar(u) && t.side !== u.side && running(W, u)) return;   /* v7.17 질주 중엔 누구도 쏘지 않음 */")
# ---------- 도약 사격 = 사격 A 이상 ----------
s = rep(s, "  if (A.k === 'leap' && !A.shot && u.lob && q >= ((W.rules.leap || {}).shotAt || 0.5)) leapShot(W, u, A);",
        "  if (A.k === 'leap' && !A.shot && u.lob && (u.marks || 0) >= ((W.rules.leap || {}).shotMin != null ? W.rules.leap.shotMin : 0.55) - 0.01 && q >= ((W.rules.leap || {}).shotAt || 0.5)) leapShot(W, u, A);   // v7.17 사격 A 이상")
# ---------- 의학 등급 (치료량 ×) ----------
s = rep(s, "    const hp0 = t.hp, per = Math.max(K.min || 0, Math.min(t.max * K.pct, K.cap != null ? K.cap : Infinity));",
        "    const medK = gradeMul(W.rules, u.traits, '의학'), hp0 = t.hp, per = Math.max(K.min || 0, Math.min(t.max * K.pct, K.cap != null ? K.cap : Infinity)) * medK;   /* v7.17 [의학X] */")
s = rep(s, "  while (W.t >= A.tick - 1e-9 && A.n < K.hotN){ const add = Math.max(0, Math.min(K.hot, Math.round(t.max - t.hp)));",
        "  while (W.t >= A.tick - 1e-9 && A.n < K.hotN){ const add = Math.max(0, Math.min(Math.round(K.hot * gradeMul(W.rules, u.traits, '의학')), Math.round(t.max - t.hp)));")
# ---------- 영웅: 다쳐도 겁먹지 않음 ----------
s = rep(s, "  const fear = Math.min(1, (1 - hpF) * 0.6 + (u.exhausted ? 0.3 : u.tired ? 0.15 : 0)), cut = u.posUnk ? 0.1 : 0;",
        "  const fear = Math.min(1, (1 - hpF) * 0.6 + (u.exhausted ? 0.3 : u.tired ? 0.15 : 0)) * (u.heroic ? 0.3 : 1), cut = u.posUnk ? 0.1 : 0;   // v7.17 [영웅] 은 다쳐도 겁먹지 않음")
s = rep(s, "ordFxAdd, evadeMove, kiteMove, slipMove, roeLift, lieFree, applyPosture, POSTURES };",
        "ordFxAdd, evadeMove, kiteMove, slipMove, roeLift, lieFree, applyPosture, POSTURES, bodyReach, sizeOf, sizeOK, SIZE_RANK, lungeChk, stepOK, mvAim, strafeWant, running };")
s = rep(s, "  if (!mate && !atk.act.mode && inGuard(W, u, atk)) return false;   // 막을 수 있으면 막음 (거구의 공격은 피하려 함)",
        "  const canBlk = !mate && !atk.act.mode && inGuard(W, u, atk);\n  if (canBlk && !stepK) return false;   // 막을 수 있으면 막음 (거구의 공격은 피하려 함)   // v7.17 스텝은 막기와 견줌 (막을 수 있으면 덜 비켜섬)")
s = rep(s, "  if (stepK) u.stepCd = W.t + (ST.cd || 3);", "  if (stepK && canBlk) p *= 0.5;\n  if (stepK) u.stepCd = W.t + (ST.cd || 3);")
for a, b in [('  if (stepK && canBlk) p *= 0.5;\n  if (stepK) u.stepCd = W.t + (ST.cd || 3);\n', '  if (stepK && canBlk) p *= 0.5;\n'), ('    if (stepK) u.stepT = W.t;', '    if (stepK){ u.stepT = W.t; u.stepCd = W.t + (ST.cd || 3); }   /* 성공했을 때만 쿨 */'), ('function tryDodge(W, u){\n  if (W.t < u.dodgeCd || u.kb || prone(W, u) || u.giant) return false;', 'function tryDodge(W, u, stepOnly){\n  if ((!stepOnly && W.t < u.dodgeCd) || u.kb || prone(W, u) || u.giant) return false;'), ("    if (a.k === 'bash' && a.b === u.i){ atk = e; break; }", "    if (a.k === 'bash' && a.b === u.i && !stepOnly){ atk = e; break; }"), ('  if (!atk) return false;\n  (atk.act.tried = atk.act.tried || []).push(u.i);', "  if (!atk || (stepOnly && (!stepK || (u.act && u.act.phase === 'wind' && u.act.end <= atk.act.end + 0.05)))) return false;   /* v7.17 내 일격이 먼저면 그대로 침 (맞바꿈) */\n  (atk.act.tried = atk.act.tried || []).push(u.i);"), ("  if (u.act){ if (u.act.k === 'skill' && u.act.phase === 'tend'){ tendStep(W, u); if (!u.act) return; }   // v7.3 돌봄", "  if (u.act && u.act.k === 'atk' && !isFar(u) && !u.act.mode && (u.act.phase === 'rec' || u.act.phase === 'wind') && stepOK(W, u) && tryDodge(W, u, true)) return;   /* v7.17 치는 중 · 거두는 중에도 스텝 — 상대 일격이 먼저 떨어지면 내 공격을 버리고 비켜섬 (공격 · 막기 · 회피의 심리전) */\n  if (u.act){ if (u.act.k === 'skill' && u.act.phase === 'tend'){ tendStep(W, u); if (!u.act) return; }   // v7.3 돌봄")]:
    s = rep(s, a, b)
for a, b in [("(u.act && u.act.phase === 'wind' && u.act.end <= atk.act.end + 0.05)))) return false;   /* v7.17 내 일격이 먼저면 그대로 침 (맞바꿈) */", "(u.act && u.act.phase === 'wind' && u.act.end < atk.act.end - 0.02)))) return false;   /* v7.17 내 일격이 먼저 닿으면 그대로 침 · 같은 순간이면 맞바꿀지 비켜설지 고름 */"), ('return !!ST.on && W.t >= (u.stepCd == null ? -9 : u.stepCd) && !u.raised && !isFar(u)', 'return !!ST.on && W.t >= (u.stepCd == null ? -9 : u.stepCd) && !(u.raised && u.shield) && !isFar(u)')]:
    s = rep(s, a, b)
s = rep(s, '      u.curSp = Math.min(rem / dt, (u.curSp || 0) + ACC * dt); u.mvH = hd; u.mvT = W.t; rem = u.curSp * dt; } }', '      u.curSp = Math.min(rem / dt, (u.curSp || 0) + ACC * dt * (W.t < (u.lungeT == null ? -9 : u.lungeT) ? 3 : 1)); u.mvH = hd; u.mvT = W.t; rem = u.curSp * dt; } }   /* v7.17 덮칠 땐 순간 가속 ×3 */')
for a, b in [('  if (g < (K.contact != null ? K.contact : 0.7)) return false;', '  if (g < Math.max(K.contact != null ? K.contact : 0.7, x.rng + 0.25)) return false;   /* v7.17 맞붙음 = 상대의 리치 안 (리치가 길면 더 멀리서부터) */'), ('  const rn = g > (K.runG != null ? K.runG : 1.6);', '  const rn = g > Math.max(K.runG != null ? K.runG : 1.6, x.rng + 1.15);   /* v7.17 리치만큼 */')]:
    s = rep(s, a, b)
s = rep(s, '    if (pr && v && v !== u && !(v.down || v.hp / v.max < (H.rescue != null ? H.rescue : 0.12))){', '    if (pr && v && (v === u || !(v.down || v.hp / v.max < (H.rescue != null ? H.rescue : 0.12)))){   /* v7.17 자기 치료 중에도 치명적 일격이 오면 끊고 비킴 */')
for a, b in [('const stepOK = (W, u) => { const ST = W.rules.step || {}; return !!ST.on && W.t >= (u.stepCd == null ? -9 : u.stepCd) && !(u.raised && u.shield) && !isFar(u)', 'const stepOK = (W, u, ch) => { const ST = W.rules.step || {}; return !!ST.on && W.t >= (u.stepCd == null ? -9 : u.stepCd) && !(u.raised && u.shield) && (ch || !isFar(u))'), ('  let atk = null, stepK = false;\n  for (const e of W.units){', "  let atk = null, stepK = false, chargeK = false;\n  if (stepOK(W, u, true)){ const ce = W.units.find(e => e.alive && e.side !== u.side && e.act && e.act.k === 'charge' && e.act.phase === 'run' && e.act.b === u.i && !(e.act.tried || []).includes(u.i) && gap(u, e) < (ST.chargeD || 1.5)); if (ce){ atk = ce; stepK = true; chargeK = true; } }   /* v7.17 돌격해 오는 상대는 옆으로 비켜섬 (사수도) */\n  if (!atk) for (const e of W.units){"), ("  if (!atk || (stepOnly && (!stepK || (u.act && u.act.phase === 'wind' && u.act.end < atk.act.end - 0.02)))) return false;", "  if (!atk || (stepOnly && (!stepK || (!chargeK && (isFar(u) || (u.act && u.act.phase === 'wind' && u.act.end < atk.act.end - 0.02)))))) return false;"), ('  const canBlk = !mate && !atk.act.mode && inGuard(W, u, atk);', '  const canBlk = !mate && !atk.act.mode && inGuard(W, u, atk);\n  if (chargeK && u.shield && canBlk) return false;   /* 방패로 돌격을 버팀 */'), ('  if (stepK && canBlk) p *= 0.5;\n', '  if (stepK && canBlk) p *= 0.5;\n  if (chargeK) p *= ST.chargeK || 1.6;   /* 돌격은 크게 보여서 비켜서기 쉬움 */\n'), ('  for (const da of stepK ? (W.rand() < 0.5 ? [1.3, -1.3, 0, 0.7, -0.7] : [0, 0.7, -0.7, 1.3, -1.3]) : [0, 0.7, -0.7, 1.3, -1.3]){', '  for (const da of chargeK ? [1.57, 1.3, 1.85] : stepK ? (W.rand() < 0.5 ? [1.3, -1.3, 0, 0.7, -0.7] : [0, 0.7, -0.7, 1.3, -1.3]) : [0, 0.7, -0.7, 1.3, -1.3]){'), ("  if (u.act && u.act.k === 'atk' && !isFar(u) && !u.act.mode && (u.act.phase === 'rec' || u.act.phase === 'wind') && stepOK(W, u) && tryDodge(W, u, true)) return;", "  if (u.act && u.act.k === 'atk' && !u.act.mode && (u.act.phase === 'rec' || u.act.phase === 'wind') && stepOK(W, u, isFar(u)) && tryDodge(W, u, true)) return;")]:
    s = rep(s, a, b)
wr('rt3_tail.js', s)
print('patch717 OK')
