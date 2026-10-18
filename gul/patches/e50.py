import sys
def patch(p, pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        c=s.count(o)
        if c!=1: print('MISMATCH',p,c,o[:90]); sys.exit(1)
        s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)

# ---------- 규칙 ----------
patch('rt3_head.js',[
("""  ffBase: 0.02,""","""  // v5.0 역할 (포지션): hp · atk · spd 배율, guard = 방어 재능 (방패 · 대검을 얼마나 제대로 쓰나: 1 = 전선만큼, 막는 폭 · 덜 받는 피해 · 자세 깎임에 곱함)
  roles: {
    '전선': { hp: 1.15, atk: 0.9, spd: 1, guard: 1 },
    '미드필더': { hp: 1, atk: 1, spd: 1.05, guard: 0.6 },
    '공격수': { hp: 0.85, atk: 1.2, spd: 1, guard: 0.5 },
    '사수': { hp: 1, atk: 1, spd: 1, guard: 0.5 },
    '지원': { hp: 1, atk: 1, spd: 1, guard: 0.5 },
  },
  pushEdge: 1.5,      // 치고 나가기: 둘레 힘의 비 (우리 / 아는 상대) 가 pushEdge − 대담함 × pushBold 이상이면 (대담 0.8 → 0.94배, 신중 0.35 → 1.26배)
  pushBold: 0.7,
  ffBase: 0.02,"""),
])

# ---------- 엔진 ----------
patch('rt3_tail.js',[
# 역할 · 스탯
("""function statsOf(p, rules){
  const T = rules.tiers[p.tier] || rules.tiers[1], C = rules.classes[p.cls] || rules.classes['근접'], o = p.ov || {};
  const pick = k => o[k] != null ? o[k] : C[k];
  return {
    hp: o.hp != null ? o.hp : Math.max(1, Math.round(T.hp * C.hp)),
    atk: o.atk != null ? o.atk : Math.max(1, Math.round(T.atk * C.atk * (p.am || 1) * gradeMul(rules, p.traits, '괴력'))),   // am = 인물 공격 배율, [괴력X]
    spd: o.spd != null ? o.spd : +(C.spd * (p.sm || 1) * gradeMul(rules, p.traits, '속력')).toFixed(2),""",
"""// v5.0 역할 (포지션): 따로 정하지 않으면 장비 · 직업으로 — 방패 = 전선, 포위 사냥 · 기동 = 미드필더, 원거리 무기 = 사수, 치유 · 지휘 = 지원, 근접 = 공격수
const ROLE_NAMES = ['전선', '미드필더', '공격수', '사수', '지원'];
function roleOf(p, rules){
  if (p.role && ROLE_NAMES.includes(p.role)) return p.role;
  const w = p.weapon && rules && rules.weapons && rules.weapons[p.weapon];
  if (p.shield) return '전선';
  if (p.tac === 'pack' || p.cls === '기동') return '미드필더';
  if (w ? w.rng > 1 : p.cls === '원거리') return '사수';
  if (p.cls === '치유' || p.cls === '지휘') return '지원';
  return '공격수';
}
const roleStat = (p, rules) => (rules.roles && rules.roles[roleOf(p, rules)]) || {};
function statsOf(p, rules){
  const T = rules.tiers[p.tier] || rules.tiers[1], C = rules.classes[p.cls] || rules.classes['근접'], o = p.ov || {}, RO = roleStat(p, rules);
  const pick = k => o[k] != null ? o[k] : C[k];
  return {
    hp: o.hp != null ? o.hp : Math.max(1, Math.round(T.hp * C.hp * (RO.hp || 1))),
    atk: o.atk != null ? o.atk : Math.max(1, Math.round(T.atk * C.atk * (p.am || 1) * gradeMul(rules, p.traits, '괴력') * (RO.atk || 1))),   // am = 인물 공격 배율, [괴력X], 역할
    spd: o.spd != null ? o.spd : +(C.spd * (p.sm || 1) * gradeMul(rules, p.traits, '속력') * (RO.spd || 1)).toFixed(2),"""),
# 방어 재능
("""      canGuard: !!p.shield || !!wp.guard || (p.traits || []).includes('반사신경'), post: 100,
      gArc: Math.max(p.shield ? rules.frontArc : 0, wp.guard ? rules.guardArcW || 40 : 0, (p.traits || []).includes('반사신경') ? (wp.guard || p.shield ? rules.guardArcRW || 55 : rules.guardArcR || 20) : 0),""",
"""      canGuard: !!p.shield || !!wp.guard || (p.traits || []).includes('반사신경'), post: 100, role: roleOf(p, rules),
      // v5.0 방어 재능 (역할): 방패 · 대검을 든 쪽만 — 막는 폭 ×(0.6 + 0.4g), 막을 때 받는 피해 1 − (1 − blockMul)·g, 자세 깎임 ×(2 − g). [반사신경] 은 몸에 밴 것이라 최소 0.9
      gTal: (p.shield || wp.guard) ? Math.max((roleStat(p, rules).guard != null ? roleStat(p, rules).guard : 1), (p.traits || []).includes('반사신경') ? 0.9 : 0) : 1,
      gArc: Math.round(Math.max(p.shield ? rules.frontArc : 0, wp.guard ? rules.guardArcW || 40 : 0, (p.traits || []).includes('반사신경') ? (wp.guard || p.shield ? rules.guardArcRW || 55 : rules.guardArcR || 20) : 0) * ((p.shield || wp.guard) ? 0.6 + 0.4 * Math.max((roleStat(p, rules).guard != null ? roleStat(p, rules).guard : 1), (p.traits || []).includes('반사신경') ? 0.9 : 0) : 1)),"""),
("""    t.post -= R.postCost * (t.gCost || 1) * (J ? J.post * (u.strMul || 1) : o.far ? 1 : u.strMul || 1); t.blockT = W.t; t.blocked++;""",
"""    t.post -= R.postCost * (t.gCost || 1) * (2 - (t.gTal != null ? t.gTal : 1)) * (J ? J.post * (u.strMul || 1) : o.far ? 1 : u.strMul || 1); t.blockT = W.t; t.blocked++;"""),
("""    applyDmg(W, u, t, Math.max(1, Math.round(base * R.blockMul)), o);""",
"""    applyDmg(W, u, t, Math.max(1, Math.round(base * (1 - (1 - R.blockMul) * (t.gTal != null ? t.gTal : 1)))), o);"""),
# 표적 고르기 (적): 역할 기울기
("""      const score = f => (u.threat[f.i] || 0) + Math.max(0, 6 - dist(u, f)) * 3;""",
"""      const score = f => (u.threat[f.i] || 0) + Math.max(0, 6 - dist(u, f)) * 3 + roleBias(W, u, f) * 3;"""),
# 표적 고르기 (아군)
("""  if (seen.length){ if (u.target !== seen[0]) u.waitT = 0; u.state = 'fight'; u.target = seen[0]; return; }""",
"""  if (seen.length){
    // v5.0 역할: 미드필더는 상대 전선 뒤 (사수 · 치유) · 막고 서지 않은 쪽, 공격수는 잡을 수 있는 (다친 · 동료와 맞붙은) 쪽을 고름. 지금 상대가 크게 나쁘지 않으면 그대로
    let pick = seen[0];
    if (u.role === '미드필더' || u.role === '공격수'){
      const sc = f => -dist(u, f) * 0.8 + roleBias(W, u, f);
      pick = seen.reduce((a, b) => sc(b) > sc(a) ? b : a, seen[0]);
      if (u.target && u.target.alive && seen.includes(u.target) && sc(pick) < sc(u.target) + 1) pick = u.target;
    }
    if (u.target !== pick) u.waitT = 0; u.state = 'fight'; u.target = pick; return;
  }"""),
# 적 근접: 방패 뒤 대기 — 전선 · 미드필더는 아님
("""  if (!ordered && u.side === 1 && !u.canGuard && !isFar(u) && gap(u, t) > u.rng + 0.6){""",
"""  if (!ordered && u.role === '미드필더' && !u.pack && !isFar(u) && midfield(W, u, t, dt)) return;   // v5.0 미드필더: 전선을 돌아 들어감 · 치고 빠짐
  if (!ordered && u.side === 1 && u.role !== '전선' && u.role !== '미드필더' && !isFar(u) && gap(u, t) > u.rng + 0.6){"""),
# 근접: 궁지 · 마무리
("""    if (ordered || op || cornered(W, u)){ startAct(W, u, t, op === '틈' ? '틈을 노림' : op === '측면' ? '측면 공격' : op === '자세 무너짐' ? '자세 무너짐' : cornered(W, u) ? '반격' : '공격'); return; }""",
"""    const fin = u.role === '공격수' && t.hp / t.max < 0.35;   // 공격수: 다친 상대는 바로 마무리
    if (ordered || op || cornered(W, u) || fin){ startAct(W, u, t, fin && !op ? '마무리' : op === '틈' ? '틈을 노림' : op === '측면' ? '측면 공격' : op === '자세 무너짐' ? '자세 무너짐' : cornered(W, u) ? '반격' : '공격'); return; }"""),
# 근접: 아군 치고 나가기 (성향 · 우위)
("""  let go = ordered || u.bold >= 0.65 || busyOther || !!t.act || isFar(t) || u.waitT > 3 || !canSee(W, t, u) || alone || cornered(W, u);""",
"""  let go = ordered || u.bold >= 0.65 || busyOther || !!t.act || isFar(t) || u.waitT > 3 || !canSee(W, t, u) || alone || cornered(W, u) || (u.role === '공격수' && t.hp / t.max < 0.35);
  // v5.0 치고 나가기: 둘레 힘이 우세하면 (기준은 성향 — 대담할수록 작은 우위에도) 들어감. 한 번 나가면 1.5초는 (우위가 크게 꺾이지 않는 한) 그대로
  const push = u.side === 0 && !ordered && !go && pushing(W, u, t);
  if (push) go = true;"""),
("""    setMood(W, u, ordered ? '공격' : cornered(W, u) ? u.cornerK : u.bold >= 0.65 ? '뛰어듦' : '다가감', t.i); goTo(W, u, t.x, t.y, dt); return;""",
"""    setMood(W, u, ordered ? '공격' : cornered(W, u) ? u.cornerK : push ? '치고 나감' : u.role === '공격수' && t.hp / t.max < 0.35 ? '마무리' : u.bold >= 0.65 ? '뛰어듦' : '다가감', t.i); goTo(W, u, t.x, t.y, dt); return;"""),
# 탱커: 우위면 치고 나감 (양쪽) — v4.9 의 수 세기 대신
("""  let adv = false;
  if (u.side === 1){
    const known = W.units.filter(f => f.alive && f.side !== u.side && (canSee(W, u, f) || fresh(W, u.sense[f.i], 3)));
    const mine = W.units.filter(a => a.alive && a.side === u.side).length;
    adv = known.length > 0 && (mine >= 2 * known.length || known.every(f => (f.ammoMax != null && f.ammo === 0) || f.hp / f.max < 0.3));
  }
  u.frontT = u.side === 0 || adv ? (u.frontT || 0) + dt : 0;""",
"""  u.frontT = u.side === 0 ? (u.frontT || 0) + dt : 0;"""),
("""function tankAI(W, u, dt){""",
"""function tankAI(W, u, dt){
  // v5.0 우위면 전선을 지키지 않고 치고 나감 (가까운 보이는 상대에게) — 같은 편도 '뒤로!' 가 없으니 각자 싸움
  const f0 = W.units.filter(f => f.alive && f.side !== u.side && (u.side === 0 ? f.seenBy : canSee(W, u, f))).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (f0 && pushing(W, u, f0)){ u.frontT = 0; if (u.side === 1 || !u.target || !u.target.alive){ u.target = f0; u.state = u.side ? 'hunt' : 'fight'; } return false; }"""),
# 아군 · 적 방패 뒤: 전선 · 미드필더는 아님
("""  const others = W.units.filter(a => a.alive && a.side === u.side && a !== g && !a.order && !a.canGuard && !a.pack && !a.stalk).sort((a, b) => a.i - b.i), k = Math.max(0, others.indexOf(u));""",
"""  if (u.role === '미드필더') return false;   // 미드필더는 방패 뒤에 서지 않음
  const others = W.units.filter(a => a.alive && a.side === u.side && a !== g && !a.order && a.role !== '전선' && a.role !== '미드필더' && !a.pack && !a.stalk).sort((a, b) => a.i - b.i), k = Math.max(0, others.indexOf(u));"""),
("""  if (u.side === 0 && u.canGuard && tankAI(W, u, dt)) return;
  if (u.side === 1 && u.canGuard && !u.pack && !u.stalk && (u.state === 'hunt' || u.state === 'search') && tankAI(W, u, dt)) return;   // 적 탱커 (방패병 등)""",
"""  if (u.side === 0 && u.canGuard && u.role === '전선' && tankAI(W, u, dt)) return;   // v5.0 전선 역할만 탱커
  if (u.side === 1 && u.canGuard && u.role === '전선' && !u.pack && !u.stalk && (u.state === 'hunt' || u.state === 'search') && tankAI(W, u, dt)) return;   // 적 탱커 (방패병 등)"""),
("""  if (u.side === 0 && !u.canGuard && !u.stay && behindCover(W, u, dt)) return;""",
"""  if (u.side === 0 && u.role !== '전선' && !u.stay && behindCover(W, u, dt)) return;"""),
# helpers: 힘 · 우위 · 역할 기울기 · 미드필더
("""/* ---------- v4.8 물러서기""",
"""/* ---------- v5.0 역할 · 우위 ---------- */
// 힘: √(체력 × 초당 공격). 탄약이 떨어진 사수는 ×0.3
const powerOf = a => Math.sqrt(Math.max(1, a.hp) * a.atk * a.atkMul / Math.max(0.3, a.wind + a.rec)) * (a.ammoMax != null && a.ammo === 0 ? 0.3 : 1);
// 우위 짐작: t 둘레 3.5칸 안 (또는 t 를 노리는) 우리 편 힘 ÷ 아는 상대 힘 (아군은 누구든 보고 있는 적, 적은 보이거나 2초 안에 감지한 상대)
function edgeAt(W, u, t){
  const kn = f => f === t || (u.side === 0 ? f.seenBy : canSee(W, u, f) || fresh(W, u.sense[f.i], 2));
  let a = 0, b = 0;
  for (const o of W.units){
    if (!o.alive) continue;
    if (o.side === u.side){ if (o === u || dist(o, t) <= 3.5 || focusOf(W, o) === t) a += powerOf(o); }
    else if (kn(o) && (o === t || dist(o, t) <= 3.5)) b += powerOf(o);
  }
  return a / Math.max(1e-6, b);
}
const pushNeed = (W, u) => rv(W, 'pushEdge', 1.5) - rv(W, 'pushBold', 0.7) * u.bold;
// 치고 나가는 중인가: 우위 ≥ 기준이면 시작, 시작한 뒤 1.5초는 우위가 기준의 0.8 아래로 꺾이지 않는 한 그대로 (들락날락 없음)
function pushing(W, u, t){
  const e = edgeAt(W, u, t), need = pushNeed(W, u);
  if (e >= need){ u.pushT = W.t; return true; }
  return W.t - (u.pushT == null ? -9 : u.pushT) < 1.5 && e >= need * 0.8;
}
// 역할에 따른 표적 기울기 (클수록 고름): 미드필더 = 전선 뒤 사수 · 치유 · 막고 서지 않은 쪽, 공격수 = 다친 · 동료와 맞붙은 · 고립된 쪽. 막고 선 방패는 둘 다 피함
function roleBias(W, u, f){
  if (u.role !== '미드필더' && u.role !== '공격수') return 0;
  const shut = f.canGuard && guardOn(W, f) && inGuard(W, f, u) ? -1.5 : 0;
  if (u.role === '미드필더') return shut + (isFar(f) ? 2.5 : 0) + (f.cls === '치유' ? 2 : 0) + (f.hp / f.max < 0.4 ? 1 : 0);
  const fo = focusOf(W, f);
  return shut + (1 - f.hp / f.max) * 3 + (fo && fo.side === u.side && fo !== u ? 1.5 : 0) + (supportOf(W, f) === 0 ? 1 : 0);
}
// 미드필더: 상대 전선 (이쪽을 막고 선 방패 · 대검) 을 정면으로 들이받지 않고 막는 폭 밖으로 돌아 들어감. 친 뒤 둘레에 상대가 둘 이상이면 빠졌다가 다시
function midfield(W, u, t, dt){
  const near = W.units.filter(f => f.alive && f.side !== u.side && dist(f, u) < 2.2).length;
  if (u.atkT > 0 && W.t - u.atkT < 1 && near >= 2){ const p = fallbackPt(W, u, t, 1.8); if (p){ setMood(W, u, '빠져나감', t.i); goTo(W, u, p.x, p.y, dt); return true; } }
  if (inReach(u, t)) return false;   // 손이 닿으면 보통 싸움 (틈 · 측면)
  // 가는 길을 막고 선 상대 전선 (방어 자세가 이쪽을 봄), 또는 상대 자체가 이쪽을 막고 섬
  const wall = W.units.find(g => g.alive && g.side !== u.side && g !== t && guardOn(W, g) && inGuard(W, g, u) && dist(u, g) < dist(u, t) && segD(u, t.x, t.y, g) < g.r + u.r + 0.7);
  const G = wall || (guardOn(W, t) && inGuard(W, t, u) && gap(u, t) < 3 ? t : null);
  if (!G) return false;
  // 돌아 들어갈 자리: G 의 막는 폭 밖 (왼쪽 · 오른쪽) 중 트이고, 다른 상대 손이 닿지 않고, 가까운 쪽
  const off = G.gArc * Math.PI / 180 + 0.7, R = G.r + u.r + 0.8;
  let best = null, bs = -1e9;
  for (const s of [-1, 1]){
    const a = G.face + s * off, x = G.x + Math.cos(a) * R, y = G.y + Math.sin(a) * R;
    if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r)) continue;
    let sc = -Math.hypot(x - u.x, y - u.y) + roomAt(W, x, y).avg;
    for (const f of W.units) if (f.alive && f.side !== u.side && f !== G && !isFar(f) && Math.hypot(f.x - x, f.y - y) - f.r - u.r < f.rng + 0.4) sc -= 2;
    if (sc > bs){ bs = sc; best = { x, y }; }
  }
  if (!best) return false;
  setMood(W, u, '돌파', G.i); goTo(W, u, best.x, best.y, dt);
  return true;
}
/* ---------- v4.8 물러서기"""),
# export roleOf
("""if (typeof module !== 'undefined') module.exports = { tryThrow,""","""if (typeof module !== 'undefined') module.exports = { roleOf, ROLE_NAMES, edgeAt, powerOf, tryThrow,"""),
])
print('ok')
