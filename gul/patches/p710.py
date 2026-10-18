# v7.1 엔진: 조준 시간 = 발사 간격 · 무기 익숙함 3단 · 투창 빠르게 · 궤적선 fx · 위협을 보며 물러서기
p='rt3_head.js'; s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:90],s.count(a)); s=s.replace(a,b)
rep("'샷건':{rng:2.5, ammo:4, loud:true, aim:0.6, vel:220, P:45,", "'샷건':{rng:2.5, ammo:4, loud:true, aim:0.6, vel:220, P:45, cyc:0.45,")
rep("'총':{rng:6, ammo:8, loud:true, vel:280, P:75,", "'총':{rng:6, ammo:8, loud:true, vel:280, P:75, cyc:0.3,")
rep("'활':{rng:6, ammo:30, aim:0.5, vel:110, P:70,", "'활':{rng:6, ammo:30, aim:0.5, vel:110, P:70, cyc:0.35,")
rep("'저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:400, P:130,", "'저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:400, P:130, cyc:0.9,")
rep("burstMul:0.65, loud:true, aim:0.55, vel:320, P:85,", "burstMul:0.65, loud:true, aim:0.55, vel:320, P:85, cyc:0.15,")
rep("  javelin: { wind: 0.45, vel: 30, P: 90,", "  javelin: { wind: 0.45, vel: 45, P: 90,")
rep("  knife: { wind: 0.25, vel: 32, P: 45,", "  knife: { wind: 0.25, vel: 48, P: 45,")
rep("  alien: { aim: 0.6, wind: 1.4, reload: 1.5, tied: 1.5 },", "  alien: { aim: 0.6, wind: 1.4, reload: 1.5, tied: 1.5, skill: 1.15, skillAim: 0.92 },   // v7.1 skill = 사격 솜씨는 있으나 다른 종류의 원거리 무기 (노먼이 활을 듦): 조준 시간 × · 조준 ×")
rep("  accel: 10,", "  backstep: { near: 2.5, side: 0.85, back: 0.65, ang: 1.0 },   // v7.1 위협을 보며 움직임: 근접 상대 손 + near 칸 안 · 나를 노리는 상대 쪽으로 몸 (방어) 을 둔 채 — 옆걸음 × side · 뒷걸음 × back (움직임과 위협 방향이 ang rad 넘게 벌어지면). 서두르기 · 질주 · 돌진은 돌아서 뜀\n  accel: 10,")
open(p,'w').write(s)

p='rt3_tail.js'; s=open(p).read()
# 조준 시간
rep("  const mode = !heal && u.canSweep && !isFar(u) ? swingPlan(W, u, t) : null, wind = u.wind * (mode ?",
    "  const mode = !heal && u.canSweep && !isFar(u) ? swingPlan(W, u, t) : null, wind = (!heal && isFar(u) ? aimT(W, u) : u.wind) * (mode ?")
rep(" * (u.alien && isFar(u) ? (W.rules.alien || {}).wind || 1.4 : 1) * (tied ?", " * (tied ?")
rep("    A.phase = 'rec'; A.end = W.t + u.rec * (far ? (A.sm === 'rapid' ? ((R.sshot || {}).rapid || {}).rec || 0.7 : 1) : wpnSpd(W, u)); A.t1 = W.t;",
    "    A.phase = 'rec'; A.end = W.t + (far ? wCyc(W, u) * (A.sm === 'rapid' ? ((R.sshot || {}).rapid || {}).rec || 0.7 : 1) : u.rec * wpnSpd(W, u)); A.t1 = W.t;   // v7.1 쏜 뒤엔 다음 발만 재고 (무기 cyc), 간격은 조준 시간이 정함")
rep("const wpnProf = (W, u, wp) =>", """// v7.1 발사 간격 = 조준 시간 + 다음 발 (무기 cyc). 조준 시간 = (그 사람의 준비 + 회복) − cyc — 제 무기를 든 사람의 한 발 주기는 그대로. 익숙함: 제 무기 ×1 · 솜씨는 있으나 다른 종류 × skill · 낯선 무기 × wind
const wCyc = (W, u) => { const wp = (W.rules.weapons || {})[u.weapon] || {}; return wp.cyc != null ? wp.cyc : 0.3; };
const famMul = (W, u) => { const A = W.rules.alien || {}; return u.alien ? A.wind || 1.4 : u.fam2 ? A.skill || 1.15 : 1; };
const aimT = (W, u) => Math.max(0.15, u.wind + u.rec - wCyc(W, u)) * famMul(W, u);
const wpnProf = (W, u, wp) =>""")
rep("  u.alien = far && !wpnProf(W, u, wp);   // v7.0 낯선 무기",
    "  u.alien = far && !wpnProf(W, u, wp);   // v7.0 낯선 무기\n  u.fam2 = far && !u.alien && (((W.rules.weapons || {})[(u.kit0 && u.kit0.weapon) || ''] || {}).kind) !== wp.kind;   // v7.1 솜씨는 있으나 다른 종류 (살짝 느림)")
rep("  if (u.alien) p *= ((W.rules.alien || {}).aim || 0.6);   // v7.0 낯선 무기", "  if (u.alien) p *= ((W.rules.alien || {}).aim || 0.6); else if (u.fam2) p *= ((W.rules.alien || {}).skillAim || 0.92);   // v7.0 낯선 무기 · v7.1 다른 종류")
# 궤적 fx: 총 = 레이저처럼 궤적선만 · 화살 · 창은 짧은 잔상
rep("  if (W.shots.length) W.shots = W.shots.filter(s => !s.done);",
    "  if (W.fxOn) for (const s of W.shots) if (s.done && !s.arc && !s.fxd){ s.fxd = 1; W.fx.push({ k: 'tracer', x0: s.x0, y0: s.y0, x1: s.x, y1: s.y, t0: W.t, side: s.side, gun: !!s.gun, jav: !!s.jav, dur: s.gun ? 0.18 : s.jav ? 0.14 : 0.12 }); }   // v7.1 지나간 궤적\n  if (W.shots.length) W.shots = W.shots.filter(s => !s.done);")
rep("left: u.rng + u.r + 2.5, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1 });",
    "left: u.rng + u.r + 2.5, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1, gun: wp.kind === '총포류' });")
# 위협을 보며 물러서기 · 옆걸음
rep("""  const wv = u.side === 1 && !u.order && !u.act && !u.raised && underGun(W, u) ? weaveAng(W, u) : 0;   // v7.0 사선 안: 지그재그""",
"""  const wv = u.side === 1 && !u.order && !u.act && !u.raised && underGun(W, u) ? weaveAng(W, u) : 0;   // v7.0 사선 안: 지그재그
  const ft = faceThreat(W, u), w00 = u.path[0], fa = ft && w00 ? Math.atan2(ft.y - u.y, ft.x - u.x) : null, ma = w00 ? Math.atan2(w00.y - u.y, w00.x - u.x) : null, dA = fa != null ? angDiff(ma, fa) : 0, BS = W.rules.backstep || {};
  const keepF = fa != null && dA > (BS.ang || 1.0);   // v7.1 위협을 보며 물러서기 · 옆걸음
  if (keepF){ rem *= dA > 2.1 ? BS.back || 0.65 : BS.side || 0.85; if (!u.bsT || W.t - u.bsT > 3){ u.bsT = W.t; if (u.side === 0 || u.seenBy) L(W, { k: 'backstep', a: u.i, b: ft.i, back: dA > 2.1, vis: u.side === 0 || !!u.seenBy }); } }""")
rep("""    if (wv && d > 0.6){ const ux = (w.x - u.x) / d, uy = (w.y - u.y) / d, c = Math.cos(wv), sn = Math.sin(wv), s2 = Math.min(rem, d * 0.5); u.fg = Math.atan2(w.y - u.y, w.x - u.x); tryMove(""",
    """    if (wv && d > 0.6){ const ux = (w.x - u.x) / d, uy = (w.y - u.y) / d, c = Math.cos(wv), sn = Math.sin(wv), s2 = Math.min(rem, d * 0.5); u.fg = keepF ? fa : Math.atan2(w.y - u.y, w.x - u.x); tryMove(""")
rep("""    const s = Math.min(rem, d); u.fg = Math.atan2(w.y - u.y, w.x - u.x);""", """    const s = Math.min(rem, d); u.fg = keepF ? fa : Math.atan2(w.y - u.y, w.x - u.x);""")
rep("function goTo(W, u, x, y, dt){ setGoal(W, u, x, y); follow(W, u, dt); }", """function goTo(W, u, x, y, dt){ setGoal(W, u, x, y); follow(W, u, dt); }
// v7.1 움직이는 동안 몸 (방어) 을 둘 위협: 나를 치려는 · 돌진해 오는 · 겨누는 상대가 먼저, 그다음 가장 가까운 아는 근접 상대 (손 + near 칸 안). 서두르기 · 질주 · 돌진 · 기어다님은 없음 (돌아서 뜀)
function faceThreat(W, u){
  if (AI6.includes('backstep') || u.crawl || u.quadOn || (u.order && u.order.hurry) || (u.mv && u.mv.run && W.t < u.mv.until) || (u.side === 1 && u.ug && !u.raised)) return null;
  const near = (W.rules.backstep || {}).near || 2.5; let best = null, bs = 1e9;
  for (const f of W.units){ if (!f.alive || f.side === u.side || f.crawl || f.down) continue;
    if (!(u.side === 0 ? (f.seenBy || canSee(W, u, f)) : (canSee(W, u, f) || fresh(W, u.sense[f.i], 1.5)))) continue;
    const g = gap(u, f), on = !!(f.act && f.act.b === u.i && (f.act.k === 'atk' || f.act.k === 'charge' || f.act.k === 'throw'));
    if (!on && (isFar(f) || g > f.rng + near)) continue;
    const sc = g - (on ? 6 : 0); if (sc < bs){ bs = sc; best = f; } }
  return best;
}""")
open(p,'w').write(s); print('ok')
