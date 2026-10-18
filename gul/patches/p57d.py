import sys
def check(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        if s.count(o)!=1: print('MISMATCH',p,s.count(o),o[:140]); sys.exit(1)
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs: s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)
H=[
("""   v5.7: 급소 —""", """   v5.7: 전열 = 하나의 몸 (애벌레) — 나란히 같은 쪽을 보고 선 근접 둘 이상이 관절로 이어짐 (양쪽 같음). 옆에 마디가 붙은 쪽으로는 측면이 없음 (그 마디가 가림 —
         방패를 들고 있으면 그 방패가 막음) · 버팀 무게를 나눠 받고 덜 밀리고 덜 넘어짐 · 손 닿는 곳에서 빠지는 적에게 공짜 일격 · 쓰러진 마디 자리는 뒷줄이 메움 · 이탈하면 틈.
         약점: 양 끝 (머리 · 꼬리), 둘레를 도는 적, 넓게 휘두르기. 전열 명령 (고른 근접이 자석처럼 나란히 붙음).
         서두르기: 이동 명령을 빠르게 연달아 주면 (급함) 방패를 내리고 뜀 (×run) — 한 번이면 급하지 않은 이동 (위협이 보이면 방패를 든 채 천천히).
   v5.7: 급소 —"""),
("""  vital: { head: 0.4,""", """  line: { link: 1.6, opp: 0.6, fill: 2.6, gap: 1.05 },   // v5.7 전열: 관절 거리 (칸) · 빠지는 적에게 일격 × · 쓰러진 자리를 메우러 오는 거리 · 전열 명령의 마디 간격
  run: 1.3,           // v5.7 서두르기 (연달아 준 이동) 속력 ×
  vital: { head: 0.4,"""),
]
T=[
("""  const dir = sideOf(W, t, u), base = u.atk * u.atkMul""", """  let dir = sideOf(W, t, u); const base = u.atk * u.atkMul"""),
("""  if (inGuard(W, t, u)){
    o.jav = !!J;""", """  // v5.7 전열의 관절: 옆에 마디가 붙은 쪽에서 오는 근접은 측면이 아님 (그 마디가 가림). 그 마디가 방패를 들고 있으면 그 방패가 막음
  const cov = dir === 'side' && !o.far ? lineCover(W, t, u) : null;
  if (cov){ dir = 'front'; o.dir = 'front'; o.cover = cov.i;
    if (cov.shield && guardOn(W, cov) && cov.side !== u.side){ cov.post -= R.postCost * (cov.gCost || 1); cov.blockT = W.t; cov.blocked++; if (cov.post <= 0){ cov.post = 0; cov.brokenT = W.t + R.breakTime; o.broke = true; }
      o.block = true; o.tag = '옆 동료 (' + cov.name + ') 방패가 막음'; applyDmg(W, u, t, Math.max(1, Math.round(base * R.blockMul)), o); return o; } }
  if (inGuard(W, t, u)){
    o.jav = !!J;"""),
("""function kbLen(W, a, t, power){ const S = W.rules.shove || {}; return Math.min(power * (S.cap || 1.6), power * Math.max(S.min || 0.12, Math.pow(a.mass / Math.max(30, t.mass), S.exp || 0.6))); }""",
 """function kbLen(W, a, t, power){ const S = W.rules.shove || {}; return Math.min(power * (S.cap || 1.6), power * Math.max(S.min || 0.12, Math.pow(a.mass / Math.max(30, t.mass), S.exp || 0.6))) / (t.line ? 1 + 0.25 * Math.min(4, t.line.n - 1) : 1); }   // v5.7 전열은 덜 밀림"""),
("""  const trained = guardOn(W, t) && inGuard(W, t, u) && t.role === '전선';
  return { mass: (t.mass + m) * (trained ? C.trained || 1.6 : 1), trained, mates: m > 0 };""",
 """  // v5.7 전열의 관절: 두 마디 건너까지 무게를 나눠 받음 (한 마디 0.3 · 두 마디 0.15)
  if (t.line){ const ids = t.line.ln.ids, k = t.line.k; for (const [j, w] of [[k - 1, 0.3], [k + 1, 0.3], [k - 2, 0.15], [k + 2, 0.15]]){ const o = ids[j] != null ? W.units[ids[j]] : null; if (o && o.alive && dist(o, t) > 1.3) m += o.mass * w; else if (o && o.alive) m += o.mass * w * 0.5; } }
  const trained = guardOn(W, t) && inGuard(W, t, u) && t.role === '전선';
  return { mass: (t.mass + m) * (trained ? C.trained || 1.6 : 1), trained, mates: m > 0, line: !!t.line };"""),
("""// 막을 수 없는 몸 충격 (짓뭉개짐 · 부딪힘 · 짓밟기)""", open('lines_block.js',encoding='utf-8').read() + """// 막을 수 없는 몸 충격 (짓뭉개짐 · 부딪힘 · 짓밟기)"""),
# 세상 한 걸음: 전열 · 교전 구속
("""  for (const u of W.units) if (u.alive && u.kb) stepKb(W, u, dt);   // v5.2 밀려나 날아가는 몸""", """  for (const u of W.units) if (u.alive && u.kb) stepKb(W, u, dt);   // v5.2 밀려나 날아가는 몸
  W.lnT = (W.lnT || 0) - dt; if (W.lnT <= 0){ W.lnT = 0.25; planLines(W); }   // v5.7 전열
  lineOpportunity(W);   // v5.7 교전 구속"""),
# 메우기 (자동)
("""  if (pinDown(W, u, dt)) return;   // v5.2 쓰러진 [불사] 를 눌러 둠""", """  if (!u.order && u.fill && W.t - u.fill.t < 2.5 && !u.line){   // v5.7 쓰러진 마디 자리를 메움
    if (Math.hypot(u.fill.x - u.x, u.fill.y - u.y) > 0.25){ setMood(W, u, '틈 메움'); goTo(W, u, u.fill.x, u.fill.y, dt); return; }
    stop(u); u.fg = u.fill.face; u.fill = null; }
  if (pinDown(W, u, dt)) return;   // v5.2 쓰러진 [불사] 를 눌러 둠"""),
# 전열 명령
("""  if (o.k === 'move'){""", """  if (o.k === 'line'){
    // v5.7 전열 명령: 제 마디 자리로 가서 그쪽을 보고 섬 (자석처럼 나란히). 손 닿는 상대만 침 — 자리를 지킴 (막기는 자동 · 유지 그대로)
    const d = Math.hypot(o.x - u.x, o.y - u.y);
    if (d > 0.15){ setMood(W, u, '전열로'); setGoal(W, u, o.x, o.y); follow(W, u, dt); if (!u.path && d > 0.6){ L(W, { k: 'stuck', a: u.i }); u.order = { k: 'hold' }; } return; }
    stop(u); u.fg = o.f;
    const t = W.units.filter(f => f.alive && f.side !== u.side && canSee(W, u, f) && gap(u, f) <= u.rng + 0.05).sort((a, b) => dist(u, a) - dist(u, b))[0];
    if (t){ u.target = t; startAct(W, u, t, '전열'); return; }
    setMood(W, u, '전열'); return;
  }
  if (o.k === 'move'){"""),
# 서두르기: 속력 · 방패를 내림
("""const spdNow = (W, u) => u.spd * u.spdMul * (u.raised""", """const spdNow = (W, u) => u.spd * u.spdMul * (u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove') ? (W.rules.run || 1.3) : 1) * (u.raised"""),
("""  if (shieldAct) want = true;
  else if (!a && u.alive""", """  const hurry = u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove');   // v5.7 서두르면 방패를 내리고 뜀
  if (shieldAct) want = true;
  else if (!a && !hurry && u.alive"""),
("""o && o.k === 'amove' ? ['amove', +o.x.toFixed(2), +o.y.toFixed(2)] :""", """o && o.k === 'amove' ? ['amove', +o.x.toFixed(2), +o.y.toFixed(2), o.hurry ? 1 : 0] : o && o.k === 'line' ? ['line', +o.x.toFixed(2), +o.y.toFixed(2)] :"""),
("""if (typeof module !== 'undefined') module.exports = { updateGuard,""", """if (typeof module !== 'undefined') module.exports = { planLines, lineCover, lineOpportunity, updateGuard,"""),
]
check('rt3_head.js',H); check('rt3_tail.js',T)
patch('rt3_head.js',H); patch('rt3_tail.js',T)
print('ok')
