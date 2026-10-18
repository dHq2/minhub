p='rt3_tail.js'; s=open(p).read()
def rep(a,b,n=1):
    global s; c=s.count(a); assert c==n,(c,a[:80]); s=s.replace(a,b)
# L: 지휘관과 닿지 않는 아군이 낀 일은 표시 (unk) · 그 아군이 쓰러지면 들리는 비명
rep("""const L = (W, o) => { o.t = +W.t.toFixed(2); W.log.push(o); if (DINK[o.k] && W.rules.din) dinLog(W, o);""","""const L = (W, o) => { o.t = +W.t.toFixed(2); W.log.push(o); if (DINK[o.k] && W.rules.din) dinLog(W, o); if (!UNK_FREE[o.k]) unkMark(W, o);""")
rep("""// v7.3 전장 소음: 소리""","""// v7.5 소식 없음: 지휘관과 닿지 않는 (위치 모름) 아군이 낀 일은 그때 지휘관이 모름 (unk) — 화면 로그 · 이야기에선 싸움이 끝나야 보임. 그 아군이 쓰러지면, 비명이 들리는 거리의 동료가 있을 때만 '멀리서 비명'
const UNK_FREE = { posLost: 1, posBack: 1, scoutRep: 1, deathFound: 1, scream: 1, din: 1, phase: 1, plan: 1, stance: 1, probeRes: 1, opOrder: 1, opRecv: 1, board: 1, taskSwap: 1, taskDrop: 1, taskEnd: 1, focus: 1, intel: 1, alarm: 1, sentry: 1 };
function unkMark(W, o){
  const ua = o.a != null && typeof o.a === 'number' ? W.units[o.a] : null, ub = o.b != null && typeof o.b === 'number' ? W.units[o.b] : null;
  const un = x => x && x.side === 0 && x.posUnk;
  if (!un(ua) && !un(ub)) return; o.unk = true;
  if (o.k === 'die' && un(ub) && !W.over){ const C = cmdBoss(W, 0), h = W.units.find(m => m.alive && m.side === 0 && !m.posUnk && dist(m, ub) <= hearR(W, m, ub) * 1.6);
    if (h){ const ref = C || h, a = Math.atan2(ub.y - ref.y, ub.x - ref.x), dir = ['동', '남동', '남', '남서', '서', '북서', '북', '북동'][((Math.round(a / (Math.PI / 4)) % 8) + 8) % 8];
      L(W, { k: 'scream', dir, d: Math.round(dist(ref, ub)), by: h.i, vis: true }); } }
}
// v7.3 전장 소음: 소리""")
# 적이 보이는지: 지휘관과 닿는 아군이 본 것만 (정찰 · 길 잃은 아군이 본 건 돌아와야 앎)
rep("""    const s = e.alive && W.units.some(a => a.alive && a.side === 0 && canSee(W, a, e));""","""    const s = e.alive && W.units.some(a => a.alive && a.side === 0 && !a.posUnk && canSee(W, a, e));   // v7.5 지휘관과 닿지 않는 아군이 본 것은 아직 모름""")
# 위치 모름 → 쓰러져도 모름 (동료가 시신을 봐야 앎)
rep("""  for (const u of W.units){ if (u.side !== 0) continue; if (!u.alive && !u.down){ u.posUnk = false; continue; }""","""  for (const u of W.units){ if (u.side !== 0) continue;
    if (!u.alive && !u.down){ if (u.posUnk && W.units.some(m => m.alive && m.side === 0 && !m.posUnk && canSee(W, m, u))){ u.posUnk = false; u.posK = { x: u.x, y: u.y, t: W.t }; L(W, { k: 'deathFound', a: u.i, vis: true }); } continue; }   // v7.5 소식 없던 동료의 시신을 찾음""")
# 정찰 · 횃불
rep("""// 지휘관이 아는 아군의 자리:""","""/* ---------- v7.5 정찰 ----------
   명령한 곳까지 숨어서 감 (은신 걸음) — 보이는 적에게 near 칸까지 다가가면 멈춰 look 초 둘러봄 (다다라도). 그다음 명령받은 때 지휘관이 있던 자리로 돌아옴.
   들키면 (나를 보는 적이 나를 노리거나 2.2칸 안) 뛰어 도망. 나가 있는 동안 본 것은 지휘관에게 닿지 않음 — 돌아와 지휘관과 닿으면 보고:
   본 적은 실루엣 (대략의 무장 · 본 그때의 자리를 흔들어 · 몇 초 전) 으로만. 누구인지 · 지금 어디인지는 모름. 후각이 없으면 어둠 속 귀환 길을 헤맴 (로그에만).
   누구나 할 수 있지만 크고 무거운 몸 (거구 · 중갑) 은 거의 숨지 못함 */
function scoutStep(W, u, dt){
  const o = u.order, SC = W.rules.scout || {};
  if (!u.sc || u.sc.oid !== o){ u.sc = { oid: o, ph: 'out', t0: W.t, x: o.x, y: o.y, hx: o.hx != null ? o.hx : u.x, hy: o.hy != null ? o.hy : u.y, seen: {}, st0: !!u.stealth, lostT: 0, wander: null, nextLost: W.t + 2, wentOut: false }; u.stealth = true;
    L(W, { k: 'scout', a: u.i, x: +o.x.toFixed(1), y: +o.y.toFixed(1), e: +u.stealthE.toFixed(2), vis: true }); }
  const S = u.sc; if (u.posUnk) S.wentOut = true;
  for (const f of W.units) if (f.alive && f.side !== u.side && canSee(W, u, f)) S.seen[f.i] = { x: f.x, y: f.y, t: W.t, look: looks(f) };
  if (S.ph !== 'flee' && W.units.some(e => e.alive && e.side !== u.side && canSee(W, e, u) && (e.target === u || focusOf(W, e) === u || dist(e, u) < 2.2))){ S.ph = 'flee'; L(W, { k: 'scoutFlee', a: u.i, vis: true }); }
  if (S.ph === 'out'){
    const near = W.units.filter(f => f.alive && f.side !== u.side && canSee(W, u, f)).sort((a, b) => dist(u, a) - dist(u, b))[0];
    if (Math.hypot(S.x - u.x, S.y - u.y) < 0.8 || (near && dist(u, near) <= (SC.near || 4.5)) || W.t - S.t0 > (SC.max || 16) * 0.6){ S.ph = 'look'; S.lookT = W.t; stop(u); }
    else { setMood(W, u, '정찰 — 숨어서 감'); goTo(W, u, S.x, S.y, dt); if (!u.path){ S.ph = 'look'; S.lookT = W.t; } return; }
  }
  if (S.ph === 'look'){ stop(u); u.fg = (u.fg != null ? u.fg : u.face) + dt * 1.4; setMood(W, u, '정찰 — 둘러봄'); if (W.t - S.lookT >= (SC.look || 1.5)) S.ph = 'back'; return; }
  // 돌아옴: 지휘관과 닿으면 (나가 있다 돌아왔거나 · 처음 자리 가까이) 보고
  if (!u.posUnk && (S.wentOut || Math.hypot(S.hx - u.x, S.hy - u.y) < 2.2)){ scoutReport(W, u); return; }
  if (S.ph === 'flee') u.mv = { k: 'scoutRun', run: true, until: W.t + 0.3, x: S.hx, y: S.hy };
  if (S.wander && W.t < S.wander.until){ setMood(W, u, '정찰 — 길을 찾음'); goTo(W, u, S.wander.x, S.wander.y, dt); return; }
  if (!u.smellG && !litAt(W, u.x, u.y) && W.t >= S.nextLost){ S.nextLost = W.t + 2;   // 후각 없이 어둠 속 — 길을 헤맴
    if (W.rand() < (SC.lost != null ? SC.lost : 0.35)){ const T0 = SC.lostT || [0.8, 1.6], sec = T0[0] + W.rand() * (T0[1] - T0[0]), a = Math.atan2(S.hy - u.y, S.hx - u.x) + (W.rand() < 0.5 ? 1 : -1) * (1.2 + W.rand() * 0.8);
      const wx = Math.max(0.6, Math.min(W.map.W - 0.6, u.x + Math.cos(a) * 2.5)), wy = Math.max(0.6, Math.min(W.map.H - 0.6, u.y + Math.sin(a) * 2.5));
      if (!boxRock(W, wx, wy, u.r)){ S.wander = { x: wx, y: wy, until: W.t + sec }; S.lostT += sec; L(W, { k: 'scoutLost', a: u.i, sec: +sec.toFixed(1), vis: true }); return; } } }
  setMood(W, u, S.ph === 'flee' ? '정찰 — 들켜서 도망' : '정찰 — 돌아옴'); goTo(W, u, S.hx, S.hy, dt);
  if (!u.path && Math.hypot(S.hx - u.x, S.hy - u.y) < 0.8){ scoutReport(W, u); }
}
function scoutReport(W, u){
  const S = u.sc, SC = W.rules.scout || {}, M = W.scoutMarks || (W.scoutMarks = []), list = Object.values(S.seen);
  for (const r of list){ const age = W.t - r.t, j = (SC.jit != null ? SC.jit : 1.2) * (0.6 + Math.min(1, age / 10)); M.push({ x: Math.max(0.5, Math.min(W.map.W - 0.5, r.x + (W.rand() * 2 - 1) * j)), y: Math.max(0.5, Math.min(W.map.H - 0.5, r.y + (W.rand() * 2 - 1) * j)), t: r.t, at: W.t, look: r.look, by: u.i, smell: !!r.smell }); }
  const cnt = {}; for (const r of list) for (const k of r.look) cnt[k] = (cnt[k] || 0) + 1;
  L(W, { k: 'scoutRep', a: u.i, n: list.length, cnt, age: list.length ? [Math.round(Math.min(...list.map(r => W.t - r.t))), Math.round(Math.max(...list.map(r => W.t - r.t)))] : null, sec: +(W.t - S.t0).toFixed(1), lost: +S.lostT.toFixed(1), smell: !!u.smellG, vis: true });
  u.order = null; u.stay = { x: u.x, y: u.y }; u.stealth = S.st0; u.sc = null; u.mv = null;
}
// v7.5 횃불 켜고 끄기: 켜는 데 torchOn · 끄는 데 torchOff 초 (든 이가 하는 일)
function torchSet(W, u, on){ if (!u.torch || !u.alive) return false; if (on === !u.torchOff && !u.torchSw) return false; u.torchSw = { on, at: W.t + (on ? (W.rules.torchOn != null ? W.rules.torchOn : 0.8) : (W.rules.torchOff != null ? W.rules.torchOff : 0.2)) }; L(W, { k: 'torchSw', a: u.i, on, vis: true }); return true; }
function torchTick(W){ for (const u of W.units){ const T = u.torchSw; if (!T || W.t < T.at) continue; u.torchSw = null; if (!u.alive || !u.torch) continue; u.torchOff = !T.on; computeLight(W); L(W, { k: 'torch', a: u.i, on: T.on, vis: true }); } }
// 지휘관이 아는 아군의 자리:""")
rep("""  cmdTick(W);   // v7.4 아군 명령이 닿음 (또는 못 받음)""","""  cmdTick(W);   // v7.4 아군 명령이 닿음 (또는 못 받음)
  torchTick(W);   // v7.5 횃불을 켜고 끔""")
rep("""  if (o.k === 'lret'){ if (!lretStep(W, u, dt)) u.order = null; return; }""","""  if (o.k === 'scout'){ scoutStep(W, u, dt); return; }   // v7.5 정찰
  if (o.k === 'lret'){ if (!lretStep(W, u, dt)) u.order = null; return; }""")
rep("""const orderTxt = (o, u) => o && o.k === 'lret' ? ['lret', o.id] :""","""const orderTxt = (o, u) => o && o.k === 'scout' ? ['scout', +o.x.toFixed(2), +o.y.toFixed(2)] : o && o.k === 'lret' ? ['lret', o.id] :""")
rep("""['move', 'amove', 'line', 'lret', 'pick',""","""['move', 'amove', 'line', 'lret', 'scout', 'pick',""")
rep("""  const mv = o && (o.k === 'move' || o.k === 'amove' || o.k === 'hold' || o.k === 'lret');""","""  const mv = o && (o.k === 'move' || o.k === 'amove' || o.k === 'hold' || o.k === 'lret' || o.k === 'scout');""")
rep("if (typeof module !== 'undefined') module.exports = { cmdLink,","if (typeof module !== 'undefined') module.exports = { scoutStep, scoutReport, torchSet, stealthK, stealthOf, smellGrade, cmdLink,")
open(p,'w').write(s)
print('ok')
