import sys
def patch(p, pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        c=s.count(o)
        if c!=1: print('MISMATCH',p,c,o[:100]); sys.exit(1)
        s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)
patch('rt3_head.js',[
("""    '방탄': { slot: '몸', w: 0.01,""","""    '경갑': { slot: '몸', w: 0.008, vs: { '날붙이': 0.72, '둔기': 0.92, '짐승': 0.78, '활': 0.7, '총포류': 0.9, '마법': 1, '맨손': 0.85 } },   // 전신 경갑옷 (궁수)
    '방탄': { slot: '몸', w: 0.01,"""),
("""  galpi: 3,""","""  galpi: 3,
  gunTough: 0.6,      // 굴의 생물 · 낙하자는 곰처럼 단단함: 총포류에 맞는 피해 × (일반 인간계 사람 = [일반인] 은 그대로) — 총이 만능은 아님
  leap: { dist: 1.7, time: 0.3, cd: 1.1, near: 2.2 },   // [도약]: 근접 상대가 near 칸 안으로 오면 뒤로 dist 칸을 time 초에 뛰어 물러남 (cd 초마다)
  charge: { min: 1.5, max: 5, spd: 2.6, dmg: 0.6, post: 60, push: 1.2, pin: 1.2, cd: 8 },   // [돌진]: min~max 칸 앞 상대에게 속력 ×spd 로 들이받음 — 공격 ×dmg · 방패 자세 −post · push 칸 밀침 · pin 초 움찔 · 준비 끊음
  giantBlock: 0.7,    // [거구] 의 몸이 시야를 가리는 폭 (몸 반지름 ×) — 바로 뒤에 선 쪽만 가려짐, 조금 돌면 보임"""),
])
patch('rt3_mid.js',[
("""  if (!litAt(W, t.x, t.y)){ if (!u.nv) return false; if (u.nvG === 'B' && d > (W.rules.nvB || 5)) return false; }   // 야시 B 는 어둠 속에선 nvB 칸까지
  return d < 1.2 || losClear(W.map, u.x, u.y, t.x, t.y);""",
"""  if (!litAt(W, t.x, t.y)){ if (!u.nv) return false; if (u.nvG === 'B' && d > (W.rules.nvB || 5)) return false; }   // 야시 B 는 어둠 속에선 nvB 칸까지
  // v5.1 [거구] (3M): 몸이 시야를 가림 — 보는 쪽과 대상 사이 (양 끝은 빼고) 줄 가까이 (몸 반지름 × giantBlock) 에 서 있으면 안 보임
  if (W.giants) for (const g of W.giants){
    if (!g.alive || g === u || g === t) continue;
    const vx = t.x - u.x, vy = t.y - u.y, L2 = vx * vx + vy * vy || 1, k = ((g.x - u.x) * vx + (g.y - u.y) * vy) / L2;
    if (k > 0.05 && k < 0.95 && Math.hypot(g.x - u.x - vx * k, g.y - u.y - vy * k) < g.r * (W.rules.giantBlock || 0.7)) return false;
  }
  return d < 1.2 || losClear(W.map, u.x, u.y, t.x, t.y);"""),
])
patch('rt3_tail.js',[
# 거구: 몸 크기 · 목록, 돌진 · 도약 준비값
("""      x: p.x, y: p.y, home: { x: p.x, y: p.y }, r: bodyR(p.tier),""","""      x: p.x, y: p.y, home: { x: p.x, y: p.y }, r: bodyR(p.tier) * ((p.traits || []).includes('거구') ? 1.3 : 1),"""),
("""      gear: gearOf(p, rules), undying: tr.includes('불사'), down: false, riseT: null,""",
"""      gear: gearOf(p, rules), undying: tr.includes('불사'), down: false, riseT: null, human: tr.includes('일반인'), giant: tr.includes('거구'),
      canCharge: tr.includes('돌진'), chargeCd: -9, canLeap: tr.includes('도약'), leapCd: -9,"""),
("""  let k = 0; for (const u of W.units) if (u.side === 0 && !u.hero) u.slot = k++;""","""  let k = 0; for (const u of W.units) if (u.side === 0 && !u.hero) u.slot = k++;
  W.giants = W.units.filter(u => u.giant);"""),
# 단단함: 총포류
("""  const AM = armorMul(R, t, part, wk), armMul = AM.m;""","""  const AM = armorMul(R, t, part, wk), armMul = AM.m * (wk === '총포류' && !t.human ? (R.gunTough != null ? R.gunTough : 1) : 1);   // 굴의 몸은 총에 단단함"""),
("""  o.part = part; o.ambush = amb; o.jav = !!J; o.crit = crit; o.armor = armMul < 1 ? AM.it.name : null;""","""  o.part = part; o.ambush = amb; o.jav = !!J; o.crit = crit; o.armor = AM.m < 1 && AM.it ? AM.it.name : null;"""),
# 행동: 도약 · 돌진 진행
("""function act(W, u, dt){
  if (u.act){ if (u.burst) tickBurst(W, u);""","""function act(W, u, dt){
  if (u.act && u.act.k === 'leap'){ stepLeap(W, u, dt); return; }
  if (u.act && u.act.k === 'charge' && u.act.phase === 'run'){ stepCharge(W, u, dt); return; }
  if (u.act){ if (u.burst) tickBurst(W, u);"""),
("""function resolveAct(W, u){""","""/* ---------- v5.1 [도약] · [돌진] ---------- */
// 도약: 뒤로 dist 칸을 time 초에 (상대를 본 채). 바위에 막히면 거기까지
function startLeap(W, u, t){
  const R = W.rules.leap || {}, p = fallbackPt(W, u, t, R.dist || 1.7); if (!p) return false;
  u.act = { k: 'leap', phase: 'run', t0: W.t, end: W.t + (R.time || 0.3), fx: u.x, fy: u.y, tx: p.x, ty: p.y, b: t.i };
  u.leapCd = W.t + (R.cd || 1.1); stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  L(W, { k: 'leap', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); setMood(W, u, '뒤로 도약', t.i);
  return true;
}
function stepLeap(W, u, dt){
  const A = u.act, q = Math.min(1, (W.t - A.t0) / Math.max(0.05, A.end - A.t0));
  tryMove(W, u, A.fx + (A.tx - A.fx) * q, A.fy + (A.ty - A.fy) * q);
  if (q >= 1) u.act = null;
}
// 돌진: 곧은 길로 속력 ×spd. 처음 닿는 상대를 들이받음 (막아도 자세가 크게 깎임) — 밀치고 움찔 · 준비 끊음. 바위 · 끝이면 멈춤
function tryCharge(W, u, t){
  const C = W.rules.charge || {}, g = gap(u, t);
  if (!u.canCharge || u.act || W.t < u.chargeCd || g < (C.min || 1.5) || g > (C.max || 5) || !canSee(W, u, t) || !fatClear(W.map, u.x, u.y, t.x, t.y, u.r * 0.9)) return false;
  if (W.units.some(o => o.alive && o !== u && o !== t && o.side === u.side && segD(u, t.x, t.y, o) < o.r + u.r)) return false;   // 길에 동료가 있으면 안 함
  const d = dist(u, t) || 1, sp = spdNow(W, u) * (C.spd || 2.6);
  u.act = { k: 'charge', phase: 'run', b: t.i, t0: W.t, end: W.t + (d + 0.6) / sp, dx: (t.x - u.x) / d, dy: (t.y - u.y) / d, sp };
  u.chargeCd = W.t + (C.cd || 8); stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); u.face = u.fg;
  L(W, { k: 'charge', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); setMood(W, u, '돌진', t.i);
  if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '돌진!', t0: W.t });
  return true;
}
function stepCharge(W, u, dt){
  const A = u.act, C = W.rules.charge || {}, x0 = u.x, y0 = u.y;
  tryMove(W, u, u.x + A.dx * A.sp * dt, u.y + A.dy * A.sp * dt);
  const hit = W.units.filter(f => f.alive && f.side !== u.side && dist(f, u) <= f.r + u.r + 0.06).sort((a, b) => dist(a, u) - dist(b, u))[0];
  const stuck = Math.hypot(u.x - x0, u.y - y0) < A.sp * dt * 0.3;
  if (hit){
    const blocked = inGuard(W, hit, u);
    strike(W, u, hit, hit, 1, false, { mul: C.dmg || 0.6 });
    if (blocked && hit.alive){ hit.post -= C.post || 60; if (hit.post <= 0){ hit.post = 0; hit.brokenT = W.t + W.rules.breakTime; } }
    if (hit.alive){
      const push = C.push || 1.2; for (let k = 0; k < 6; k++) tryMove(W, hit, hit.x + A.dx * push / 6, hit.y + A.dy * push / 6);
      hit.pinT = W.t + (C.pin || 1.2); if (hit.act && hit.act.phase === 'wind' && hit.act.k !== 'skill'){ L(W, { k: 'miss', a: hit.i, b: hit.act.b, why: '들이받혀 준비가 끊김' }); hit.act = null; hit.burst = null; }
    }
    L(W, { k: 'impact', a: u.i, b: hit.i, block: blocked, broke: blocked && hit.brokenT > W.t, vis: u.side === 0 || !!u.seenBy || !!hit.seenBy });
    u.act = { k: 'atk', phase: 'rec', b: hit.i, t0: W.t, end: W.t + 0.5, t1: W.t };
    return;
  }
  if (stuck || W.t >= A.end) u.act = null;
}
function resolveAct(W, u){"""),
# 싸움: 돌진 (근접 · 우위 · 명령) · 도약 (사수)
("""  if (isFar(u)) shoot(W, u, t, dt, ordered); else melee(W, u, t, dt, ordered);
}""","""  if (u.canCharge && !isFar(u) && (ordered || u.side === 1 || pushing(W, u, t) || u.role !== '전선') && tryCharge(W, u, t)) return;   // v5.1 돌진으로 들어감
  if (isFar(u)) shoot(W, u, t, dt, ordered); else melee(W, u, t, dt, ordered);
}"""),
("""  if (!ordered && !isFar(t) && g < Math.min(1.2, u.rng * 0.3) + (u.mood === '거리 벌리기' ? 0.4 : 0) && u.bold < 0.6 && !cornered(W, u)){""",
"""  // v5.1 [도약]: 근접 상대가 가까이 오면 뒤로 뛰어 단숨에 거리를 벌림 (기동 사수)
  if (!ordered && u.canLeap && !isFar(t) && g < ((W.rules.leap || {}).near || 2.2) && W.t >= u.leapCd && !cornered(W, u) && startLeap(W, u, t)) return;
  if (!ordered && !isFar(t) && g < Math.min(1.2, u.rng * 0.3) + (u.mood === '거리 벌리기' ? 0.4 : 0) && u.bold < 0.6 && !cornered(W, u)){"""),
("""if (typeof module !== 'undefined') module.exports = { gearOf,""","""if (typeof module !== 'undefined') module.exports = { tryCharge, startLeap, gearOf,"""),
])
print('ok')
