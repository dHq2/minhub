# v7.23.1 엔진 — patch7231.py v1.3 (v1.3: setup.holdClear · v1.2: holdClear (끝난 맵을 미룸) · v1.1: 우회 · 돌진 · 빈틈 찌르기 뒤엔 붙어 있어도 먼저 벰 · 6단계 5S 세자르 1: 세자르 두뇌 (2D 판 cesarBrain 이식) — 리듬 (탐색 4.5 ~ 7초 ↔ 딜타임 4.5초) · 빈틈 찌르기 · 원형 베기 · 어깨 박치기 · 뒷걸음 점프 · 우회 · 돌진 · 연격 · 동상 · 절단 (출혈) · 휘청 (2D 판 힘 / 버팀)
#   양쪽 같은 규칙: 회피 반격 (dcounter) · 자세 (poise — 넘어짐 · 밀림 셈의 무게 ×) · 냉기 무기 (frost) · strike 의 crit (확정 치명) · grab (못 막음) · 무덤의 계단 (W.stairs) · 관 (더미 3))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
FS = {k: open(D + k + '.js', encoding='utf-8').read() for k in ('rt3_head', 'rt3_mid', 'rt3_tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in FS.values())
    assert n == c, (n, c, a[:100])
    for k in FS:
        FS[k] = FS[k].replace(a, b)

# 규칙
rep('  warden: { near:', '''  cz: { probe: [4.5, 7], fury: 4.5, punish: 2.2, punR: 6, keep: 3.5, orbit: 0.25, walk: 0.45, jog: 1.4, furyWalk: 0.8, run: 3, close: 1.2, back: 1.8, backT: 0.34, backRest: 0.16, backCd: 6, flankCd: 5, rushCd: 5, combo: 0.35, comboGap: 0.12, hitStun: 0.45, frostT: 4,
    spin: { r: 2.6, wind: 0.35, rec: 0.5, mul: 2.0, kb: 1.6, stun: 0.5, frost: 2, cd: 8, brk: 3 }, shoulder: { v: 10, max: 0.45, reach: 0.6, rng: 3.3, mul: 0.6, kb: 1.2, stun: 0.7, rec: 0.6, cd: 5 } },   /* v7.23.1 세자르 (2D 판 수치 · 거리 × 1.4 쯤) */
  frost: { spd: 0.55, wind: 1.6 },   /* v7.23.1 동상: 걸음 × · 준비 시간 × */
  dcounter: { delay: 0.12, reach: 0.8 },   /* v7.23.1 회피 반격: 피한 뒤 delay 초 · 사거리 + reach 안이면 확정 치명 */
  warden: { near:''')
rep("const PILE_NM = { 1: '갑옷', 2: '시체' };", "const PILE_NM = { 1: '갑옷', 2: '시체', 3: '관' };   /* v7.23.1 관 (5S 알현실) */")
rep("pileH: { 갑옷: 1.1, 시체: 0.6 }", "pileH: { 갑옷: 1.1, 시체: 0.6, 관: 0.9 }")
rep("'장검':{rng:0.6, kind:'날붙이'}", "'장검':{rng:0.6, kind:'날붙이'}, '노인의 검':{rng:0.75, kind:'날붙이', frost:0.08}")

# 만들 때: 세자르 두뇌 · 자세 · 회피 반격 · 동상 · 절단
rep("/* v7.23 방 지킴이 */\n}",
    "/* v7.23 방 지킴이 */\n  { const U = W.units[i]; U.poise = +p.poise > 0 ? +p.poise : 1; U.dcounter = Math.max(0, Math.min(1, +p.dcounter || 0)); U.frostP = +p.frostP || 0; U.severP = +p.severP || 0; U.brain = p.brain || null; if (p.brain === 'cesar') U.cz = { on: false, fury: false, phaseT: null, orbit: W.rand() < 0.5 ? 1 : -1, spin: 1, shoulder: 3, back: 0, flank: 3, rush: 5, punish: 0, combo: null, jog: 0 }; }   /* v7.23.1 자세 · 회피 반격 · 세자르 */\n}")

# strike: 확정 치명 · 못 막음 · 냉기 무기
rep("crit = HM || (HP && W.rand() < 0.7) ||", "crit = (extra && extra.crit) || HM || (HP && W.rand() < 0.7) ||")
rep("!exFail && inGuard(W, t, u, o.far || !!J)){", "!exFail && !(extra && extra.grab) && inGuard(W, t, u, o.far || !!J)){")
rep("const cov = dir === 'side' && !o.far ? lineCover(W, t, u) : null;", "const cov = dir === 'side' && !o.far && !(extra && extra.grab) ? lineCover(W, t, u) : null;")
rep("  { const fw = !u.weaponGone && ((R.weapons || {})[u.weaponNow || u.weapon] || {}).fire;",
    "  { const fz = !u.weaponGone && ((R.weapons || {})[u.weaponNow || u.weapon] || {}).frost; if (fz && !o.far && !J && !o.block && t.alive && t.side !== u.side && W.rand() < fz) frostOn(W, t, CZR(W).frostT || 4, u.i); }   /* v7.23.1 냉기 무기 (노인의 검) */\n  { const fw = !u.weaponGone && ((R.weapons || {})[u.weaponNow || u.weapon] || {}).fire;")
# 자세 (poise): 밀림 · 넘어짐 셈의 무게
rep("Math.pow(a.mass / Math.max(30, t.mass), S.exp || 0.6)", "Math.pow(a.mass / Math.max(30, t.mass * (t.poise || 1)), S.exp || 0.6)")
rep("Math.sqrt((a.mass || 62) / Math.max(20, u.mass || 62))", "Math.sqrt((a.mass || 62) / Math.max(20, (u.mass || 62) * (u.poise || 1)))")
rep("extra.heavyCrit && u.mass >= t.mass * 0.6)", "extra.heavyCrit && u.mass >= t.mass * (t.poise || 1) * 0.6)")
rep("e.mass <= u.mass * 1.6", "e.mass * (e.poise || 1) <= u.mass * 1.6")
rep("e.mass <= u.mass * 0.8", "e.mass * (e.poise || 1) <= u.mass * 0.8")
# 동상: 걸음 · 준비 시간
rep("(STL(W).spd || 0.6) : 1);   // v5.2 기어다님", "(STL(W).spd || 0.6) : 1) * (W.t < (u.frostT || -9) ? ((W.rules.frost || {}).spd || 0.55) : 1) * (u.czSpd || 1);   // v5.2 기어다님   /* v7.23.1 동상 · 세자르 걸음 */")
rep("const fatMul = (W, u, k) => { const F = FATR(W); if (!F || AI6.includes('fat')) return 1; return ",
    "const fatMul = (W, u, k) => { const fz = k === 'wind' && W.t < (u.frostT || -9) ? ((W.rules.frost || {}).wind || 1.6) : 1, F = FATR(W); if (!F || AI6.includes('fat')) return fz; return fz * ")
# 회피 반격 · 세자르는 기술을 쓰는 동안 못 피함 · 뒷걸음 점프 중엔 잘 피함
rep("evaded(W, t, a, 'melee', '몸을 비틀어 흘림', p);", "evaded(W, t, a, 'melee', '몸을 비틀어 흘림', p);\n  if (t.dcounter && !isFar(a) && !t.dcPend && W.rand() < t.dcounter) t.dcPend = { b: a.i, at: W.t + ((W.rules.dcounter || {}).delay || 0.12) };   /* v7.23.1 회피 반격 */")
rep("  if (u.act && u.act.k === 'charge' && u.act.phase === 'run') return 0;", "  if (u.act && u.act.k === 'charge' && u.act.phase === 'run') return 0;\n  if (u.act && u.act.k === 'cz' && !['backs', 'rush', 'flank'].includes(u.act.s)) return 0;   /* v7.23.1 세자르: 기술을 쓰는 동안엔 못 피함 */")
rep("p *= fatMul(W, u, 'dodge'); if (u.winded) p *= 0.85;\n  return Math.min(E.cap || 0.75, p);", "p *= fatMul(W, u, 'dodge'); if (u.winded) p *= 0.85;\n  if (u.act && u.act.k === 'cz' && u.act.hop) p = Math.max(p, 0.5);   /* v7.23.1 뒷걸음 점프 중 */\n  return Math.min(E.cap || 0.75, p);")
# 차례: 세자르 (매 순간 · 기술 진행) · 회피 반격
rep("function act(W, u, dt){\n  if (u.kb || W.t < u.proneT", "function act(W, u, dt){\n  if (u.cz){ czTick(W, u, dt); if (u.act && u.act.k === 'cz' && czRun(W, u, dt)) return; }   /* v7.23.1 세자르 */\n  if (u.dcPend && W.t >= u.dcPend.at) dcFire(W, u);   /* v7.23.1 회피 반격 */\n  if (u.kb || W.t < u.proneT")
rep("function act2(W, u, dt){\n", "function act2(W, u, dt){\n  if (u.cz && !u.order && czBrain(W, u, dt)) return;   /* v7.23.1 세자르 */\n")
rep("if (A.mode) heavyHit(W, u, t, A.mode); else strike(W, u, t, t, dp); }", "if (A.mode) heavyHit(W, u, t, A.mode); else { const so = strike(W, u, t, t, dp); if (u.cz) czHit(W, u, t, so); } }")
# 무덤의 계단 (위 끝 대신)
rep("  const m = W.map, H = m.H, band = (W.rules.camp || {}).band || 0.9, dn = o.dir === 'down', row = dn ? H - 1 : 0;",
    "  const m = W.map, H = m.H, band = (W.rules.camp || {}).band || 0.9, dn = o.dir === 'down', row = dn ? H - 1 : 0;\n  if (!dn && W.stairs){ const S0 = W.stairs; if (Math.hypot(S0.x - u.x, S0.y - u.y) <= (S0.r || 0.9)){ leaveMap(W, u, 'up'); return; } setMood(W, u, '계단으로'); goTo(W, u, S0.x, S0.y, dt); return; }   /* v7.23.1 무덤의 계단 */")

# 끝난 맵을 미룸 (5S: 세자르가 일어나기 전 · 쓰러지기 전)
rep("    if (!b && !W.cleared){ W.cleared = true; L(W, { k: 'cleared', vis: true }); }", "    if (!b && !W.cleared && !W.holdClear){ W.cleared = true; L(W, { k: 'cleared', vis: true }); }   /* v7.23.1 holdClear: 아직 끝나지 않은 맵 (관 속의 왕) */")

rep("W.amb = Math.max(0, Math.min(1, +setup.amb || 0));", "W.amb = Math.max(0, Math.min(1, +setup.amb || 0)); W.holdClear = !!setup.holdClear;   /* v7.23.1 */")

# 함수들
rep("// 판마다 다른 시작: 적의 시작 자리를 판 번호 (씨앗) 로 고름. 아군 자리는 그대로", r'''// v7.23.1 세자르 (C-045 · 2D 판 cesarBrain 이식): 리듬 (탐색 4.5 ~ 7초 — 천천히 간격을 재며 돎 ↔ 딜타임 4.5초 — 기술) · 빈틈 찌르기 (휘청 · 넘어짐 · 막 친 상대에게 3배로 달려가 확정 3연격)
//   원형 베기 · 어깨 박치기 · 뒷걸음 점프 (붙으면) · 우회 · 돌진 · 연격 · 동상 · 절단 (출혈). 기술 = u.act { k: 'cz' } — 판정은 모두 strike / 회피 / 밀침 / 휘청 (양쪽 같은 규칙)
const CZR = W => W.rules.cz || {};
const czFoes = (W, u) => W.units.filter(f => f.alive && !f.gone && f.side !== u.side);
const czKnown = (W, u) => czFoes(W, u).filter(f => canSee(W, u, f) || (u.sense[f.i] && W.t - u.sense[f.i].t < 4));
function frostOn(W, t, sec, by){
  if (!t.alive || !(sec > 0)) return; const was = W.t < (t.frostT || -9); t.frostT = Math.max(t.frostT || -9, W.t + sec);
  if (!was) L(W, { k: 'frost', a: by, b: t.i, sec: +sec.toFixed(1), vis: t.side === 0 || !!t.seenBy });
}
function czStagger(W, u, t, sec, k){   // 2D 판 휘청: 힘 = 무게 × 자세 × k · 버팀 = 무게 × 자세 × (막는 중 2)
  if (!t.alive || W.t < (t.saT || -9)) return false; const pw = u.mass * (u.poise || 1) * (k || 2.5), br = t.mass * (t.poise || 1) * (guardOn(W, t) ? 2 : 1);
  if (W.rand() < pw / (pw + br)){ stun(W, t, sec, u.i); return true; } return false;
}
function czTick(W, u, dt){
  const Z = CZR(W), z = u.cz;
  if (!z.on){ if (!u.alive || !czKnown(W, u).length) return; z.on = true; L(W, { k: 'czWake', a: u.i, vis: true }); }
  z.phaseT = (z.phaseT == null ? Z.probe[0] : z.phaseT) - dt;
  if (z.phaseT <= 0){ z.fury = !z.fury; z.phaseT = z.fury ? Z.fury : Z.probe[0] + W.rand() * (Z.probe[1] - Z.probe[0]); if (z.fury){ z.flank = Math.min(z.flank, 0.3); z.rush = Math.min(z.rush, 0.6); } L(W, { k: 'czMode', a: u.i, fury: z.fury, vis: u.side === 0 || !!u.seenBy }); }
  for (const k of ['spin', 'shoulder', 'back', 'punish']) z[k] -= dt; if (z.fury){ z.flank -= dt; z.rush -= dt; }
  const C = z.combo; if (C && W.t >= C.next){   // 연격: 기본 공격에 이어 comboGap 초마다
    const t = W.units[C.b];
    if (!t || !t.alive || W.t < (u.stunT || -9) || W.t < (u.proneT || -9) || u.kb || gap(u, t) > u.rng + 0.3) z.combo = null;
    else { C.left--; C.n++; C.next = W.t + (Z.comboGap || 0.12); u.fg = Math.atan2(t.y - u.y, t.x - u.x); if (!evadeMelee(W, t, u)){ const o = strike(W, u, t, t, 1, false, { tag: '연격' }); czHit(W, u, t, o, true); }
      if (C.left <= 0){ L(W, { k: 'czCombo', a: u.i, b: t.i, n: C.n, vis: u.side === 0 || !!u.seenBy }); z.combo = null; } }
  }
}
// 세자르의 일격이 맞음: 동상 · 절단 (출혈) · 휘청 · 연격 (빈틈 찌르기면 확정 3연격)
function czHit(W, u, t, o, noCombo){
  const Z = CZR(W), z = u.cz; if (!o || !t) return;
  if (!o.block && t.alive){ if (u.frostP && W.rand() < u.frostP) frostOn(W, t, Z.frostT || 4, u.i);
    if (u.severP && W.rand() < Math.min(0.95, u.severP * (o.crit ? 2 : 1))){ startBleed(W, t, u.i, o.crit ? 1.5 : 1); L(W, { k: 'sever', a: u.i, b: t.i, vis: t.side === 0 || !!t.seenBy }); }
    czStagger(W, u, t, Z.hitStun || 0.45, 2.5); }
  if (!noCombo && z && !z.combo && t.alive && (z.forceCombo || W.rand() < (Z.combo || 0.35))){ z.combo = { b: t.i, left: 1 + (z.forceCombo || W.rand() < 0.35 ? 1 : 0), next: W.t + (Z.comboGap || 0.12), n: 1 }; z.forceCombo = false; }
}
// 회피 반격: 근접을 피한 뒤 delay 초 — 그 상대가 손이 닿으면 확정 치명 (양쪽 같은 규칙)
function dcFire(W, u){
  const P = u.dcPend, b = W.units[P.b]; u.dcPend = null;
  if (!b || !b.alive || W.t > P.at + 0.5 || (u.act && u.act.k === 'cz') || W.t < (u.stunT || -9) || W.t < (u.proneT || -9) || u.kb || gap(u, b) > u.rng + ((W.rules.dcounter || {}).reach || 0.8)) return;
  u.act = null; u.fg = Math.atan2(b.y - u.y, b.x - u.x); const o = strike(W, u, b, b, 1, false, { crit: true, tag: '회피 반격' }); if (u.cz) czHit(W, u, b, o, true);
  L(W, { k: 'dcounter', a: u.i, b: b.i, vis: u.side === 0 || !!u.seenBy || b.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '반격!', c: 'd', t0: W.t });
}
function czStart(W, u, s, t, o){
  const Z = CZR(W); u.act = { k: 'cz', s, b: t ? t.i : null, t0: W.t, end: W.t + 9, ...(o || {}) }; stop(u); u.waitT = 0;
  if (t) u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  L(W, { k: 'czStart', a: u.i, b: t ? t.i : null, s, punish: !!(o && o.punish), vis: u.side === 0 || !!u.seenBy });
  if (s === 'spin' && W.fxOn) W.fx.push({ k: 'czWarn', a: u.i, s, t0: W.t, dur: (Z.spin || {}).wind || 0.35, r: (Z.spin || {}).r || 2.6 });
  setMood(W, u, { spin: '원형 베기', shoulder: '어깨 박치기', backs: '뒷걸음 점프', rush: o && o.punish ? '빈틈 찌르기' : '돌진', flank: '뒤로 돌아 들어감' }[s] || s, t ? t.i : null);
  return true;
}
function czEnd(W, u, k, cd){ const z = u.cz; if (z && k) z[k] = cd; u.act = null; u.czSpd = 1; }
function czRun(W, u, dt){
  const A = u.act, Z = CZR(W), z = u.cz || {}, t = A.b != null ? W.units[A.b] : null, el = W.t - A.t0;
  if (!u.alive){ u.act = null; return false; }
  if (W.t < (u.stunT || -9) || W.t < (u.proneT || -9) || u.kb){   // 끊김: 휘청 · 넘어짐 · 날아감
    const S = Z.spin || {}; if (A.s === 'spin' && !A.hit){ z.spin = S.brk || 3; L(W, { k: 'czBreak', a: u.i, s: A.s, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '끊김', c: 'g', t0: W.t }); }
    else if (A.s === 'shoulder') z.shoulder = (Z.shoulder || {}).cd || 5; else if (A.s === 'backs') z.back = Z.backCd || 6;
    u.act = null; u.czSpd = 1; return false; }
  if (A.s === 'spin'){ const S = Z.spin || {};
    if (!A.hit && el >= (S.wind || 0.35)){ A.hit = true; let n = 0;
      for (const e of czFoes(W, u)){ if (dist(u, e) - e.r > (S.r || 2.6)) continue; n++; if (evadeMelee(W, e, u)) continue;
        const o = strike(W, u, e, e, 1, false, { mul: S.mul || 2, tag: '원형 베기' }); if (!e.alive || !o) continue;
        if (!o.block){ if (!e.kb) shove(W, u, e, S.kb || 1.6, e.x - u.x, e.y - u.y, { tag: '원형 베기에 밀려남' }); czStagger(W, u, e, S.stun || 0.5, 3); frostOn(W, e, S.frost || 2, u.i); }
        else czStagger(W, u, e, (S.stun || 0.5) * 0.6, 3); }
      L(W, { k: 'czSpin', a: u.i, n, vis: u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'czSpin', x: u.x, y: u.y, r: S.r || 2.6, t0: W.t }); }
    if (el >= (S.wind || 0.35) + (S.rec || 0.5)) czEnd(W, u, 'spin', S.cd || 8); return true; }
  if (A.s === 'shoulder'){ const S = Z.shoulder || {};
    if (!A.hit){ const d = t && t.alive ? gap(u, t) : 99;
      if (t && t.alive && d > (S.reach || 0.6) * 0.5 && el < (S.max || 0.45)){ const v = Math.min((S.v || 10) * dt, d), l = Math.hypot(t.x - u.x, t.y - u.y) || 1; tryMove(W, u, u.x + (t.x - u.x) / l * v, u.y + (t.y - u.y) / l * v); u.fg = Math.atan2(t.y - u.y, t.x - u.x); return true; }
      A.hit = true; A.t1 = W.t;
      if (t && t.alive && gap(u, t) <= (S.reach || 0.6) && !evadeMelee(W, t, u)){ const o = strike(W, u, t, t, 1, false, { mul: S.mul || 0.6, tag: '어깨 박치기', wk: '둔기' });
        if (o && t.alive){ if (!t.kb) shove(W, u, t, (S.kb || 1.2) * (o.block ? 0.6 : 1), t.x - u.x, t.y - u.y, { tag: '어깨에 받혀 날아감' }); czStagger(W, u, t, S.stun || 0.7, 2); }
        L(W, { k: 'czShoulder', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy || t.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '쾅!', c: 'd', t0: W.t }); }
      else L(W, { k: 'czShoulder', a: u.i, b: t ? t.i : null, miss: true, vis: u.side === 0 || !!u.seenBy }); }
    if (W.t - A.t1 >= (S.rec || 0.6)) czEnd(W, u, 'shoulder', S.cd || 5); return true; }
  if (A.s === 'rush' || A.s === 'flank'){
    if (!t || !t.alive){ czEnd(W, u, A.punish ? null : A.s, A.s === 'rush' ? Z.rushCd || 5 : Z.flankCd || 5); return true; }
    let gx, gy;
    if (A.s === 'rush'){ const l = dist(u, t) || 1, k = t.r + u.r + u.rng * 0.6; gx = t.x + (u.x - t.x) / l * k; gy = t.y + (u.y - t.y) / l * k; }
    else { const O = czFoes(W, u).filter(f => f !== t && dist(f, t) < 8), cx = O.length ? O.reduce((s, f) => s + f.x, 0) / O.length : u.x, cy = O.length ? O.reduce((s, f) => s + f.y, 0) / O.length : u.y;   // 상대 무리의 반대편 (뒤)
      let bx = t.x - cx, by = t.y - cy, bl = Math.hypot(bx, by); if (bl < 0.3){ bx = t.x - u.x; by = t.y - u.y; bl = Math.hypot(bx, by) || 1; } bx /= bl; by /= bl;
      const sd = (A.side || 1) * 1.4 * (el < 0.6 ? 1 : 0.3); gx = t.x + bx * 1.2 - by * sd; gy = t.y + by * 1.2 + bx * sd; }
    gx = Math.max(u.r + 0.1, Math.min(W.map.W - u.r - 0.1, gx)); gy = Math.max(u.r + 0.1, Math.min(W.map.H - u.r - 0.1, gy));
    u.czSpd = Z.run || 3; goTo(W, u, gx, gy, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
    if (W.fxOn && W.rand() < dt * 12) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t });
    if (Math.hypot(gx - u.x, gy - u.y) < 0.4 || (A.s === 'rush' && inReach(u, t)) || el > (A.s === 'rush' ? 1.5 : 2.5)){ z.atkNow = true; z.atkB = t.i; if (A.punish) z.forceCombo = true; czEnd(W, u, A.punish ? null : A.s, A.s === 'rush' ? Z.rushCd || 5 : Z.flankCd || 5); }
    return true; }
  if (A.s === 'backs'){ const hop = Z.backT || 0.34, per = hop + (Z.backRest || 0.16), k = Math.floor(el / per), ph = el - k * per;
    if (k >= (A.n || 2)){ czEnd(W, u, 'back', Z.backCd || 6); return true; }
    if (ph < hop){ A.hop = true;
      if (A.k0 !== k){ A.k0 = k; const ax = t ? u.x - t.x : -Math.cos(u.face || 0), ay = t ? u.y - t.y : -Math.sin(u.face || 0), l = Math.hypot(ax, ay) || 1; A.dx = ax / l; A.dy = ay / l; L(W, { k: 'czBack', a: u.i, n: k + 1, vis: u.side === 0 || !!u.seenBy }); }
      const v = (Z.back || 1.8) / hop * dt; let nx = u.x + A.dx * v, ny = u.y + A.dy * v;
      if (boxRock(W, nx, ny, u.r * 0.9)){ const s = W.rand() < 0.5 ? 1 : -1, ex = A.dx * 0.5 - A.dy * s * 0.86, ey = A.dy * 0.5 + A.dx * s * 0.86; A.dx = ex; A.dy = ey; nx = u.x + ex * v; ny = u.y + ey * v; }   // 벽이면 비스듬히
      tryMove(W, u, nx, ny); if (t) u.fg = Math.atan2(t.y - u.y, t.x - u.x); }
    else A.hop = false;
    return true; }
  u.act = null; return false;
}
function czBrain(W, u, dt){
  const Z = CZR(W), z = u.cz; if (!z || !z.on) return false;
  const F = czKnown(W, u); if (!F.length){ u.czSpd = 1; return false; }
  const byD = F.slice().sort((a, b) => dist(a, u) - dist(b, u)), t = byD[0];
  const open = o => W.t < (o.stunT || -9) - 0.15 || prone(W, o) || (o.act && o.act.k === 'atk' && o.act.phase === 'rec' && W.t < o.act.end - 0.15);   // 빈틈: 휘청 · 넘어짐 · 막 친 뒤
  const gapT = byD.find(o => dist(o, u) < (Z.punR || 6) && open(o));
  if (gapT && z.punish <= 0){ z.punish = Z.punish || 2.2; L(W, { k: 'czPunish', a: u.i, b: gapT.i, vis: u.side === 0 || !!u.seenBy || gapT.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '빈틈', c: 'v', t0: W.t }); return czStart(W, u, 'rush', gapT, { punish: true }); }
  if (z.atkNow){ const at = W.units[z.atkB] && W.units[z.atkB].alive ? W.units[z.atkB] : t; if (inReach(u, at)){ z.atkNow = false; u.czSpd = 1; u.target = at; u.state = 'hunt'; startAct(W, u, at, '세자르의 베기'); if (u.act) return true; } else if (gap(u, at) > 2) z.atkNow = false; }   // 우회 · 돌진 · 빈틈 찌르기로 닿으면 바로 벰
  const close = byD.filter(o => gap(u, o) < (Z.close || 1.2));
  if (close.length && !z.fury && z.spin <= 0 && W.rand() < 0.5) return czStart(W, u, 'spin', t);   // 탐색 중 붙으면: 베어서 밀어내거나
  if (close.length && !z.fury && z.back <= 0) return czStart(W, u, 'backs', close[0], { n: 2 + (W.rand() < 0.4 ? 1 : 0) });   // 뒷걸음 점프 연달아
  if (z.fury){ const S = Z.spin || {}, SH = Z.shoulder || {};
    if (z.spin <= 0 && byD.some(o => dist(o, u) - o.r < (S.r || 2.6) - 0.3)) return czStart(W, u, 'spin', t);
    if (z.shoulder <= 0 && gap(u, t) < (SH.rng || 3.3) && gap(u, t) > 0.4 && W.rand() < dt * 1.5) return czStart(W, u, 'shoulder', t);
    if (z.flank <= 0 && W.rand() < dt * 1.5) return czStart(W, u, 'flank', t, { side: W.rand() < 0.5 ? 1 : -1 });
    if (z.rush <= 0 && gap(u, t) > 2 && W.rand() < dt * 1.5) return czStart(W, u, 'rush', t); }
  if (inReach(u, t) && (z.fury || z.atkNow || W.rand() < dt * 2)){ z.atkNow = false; u.czSpd = 1; u.target = t; u.state = 'hunt'; startAct(W, u, t, '세자르의 베기'); if (u.act) return true; }   // 딜타임은 닿으면 바로 · 탐색은 들어온 자만 가끔
  z.jog = (z.jog || 0) - dt; if (!z.fury && z.jog < -2.5 && W.rand() < dt * 0.3) z.jog = 0.7;   // 탐색 중 가끔 잠깐 뜀
  u.czSpd = z.fury ? (Z.furyWalk || 0.8) : z.jog > 0 ? (Z.jog || 1.4) : (Z.walk || 0.45);
  const keep = z.fury ? u.rng * 0.8 + t.r + u.r : (Z.keep || 3.5), a = Math.atan2(u.y - t.y, u.x - t.x) + z.orbit * (Z.orbit || 0.25), gx = t.x + Math.cos(a) * keep, gy = t.y + Math.sin(a) * keep;
  if (boxRock(W, gx, gy, u.r)) z.orbit = -z.orbit;
  setMood(W, u, z.fury ? '휘몰아침' : '간격을 잼', t.i); goTo(W, u, gx, gy, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x); u.target = t; u.state = 'hunt';
  return true;
}
// 판마다 다른 시작: 적의 시작 자리를 판 번호 (씨앗) 로 고름. 아군 자리는 그대로''')
rep("if (typeof module !== 'undefined') module.exports = { wardenStep,", "if (typeof module !== 'undefined') module.exports = { czBrain, czRun, czStart, czTick, czHit, frostOn, dcFire, wardenStep,")

for k, v in FS.items():
    open(D + k + '.js', 'w', encoding='utf-8').write(v)
print('patch7231 OK')
