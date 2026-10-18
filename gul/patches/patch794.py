# v7.9.4 엔진: ① 임시 집결 (전선이 무너지면 지휘관 · 부지휘관이 집결지를 부름 — 전달은 지휘 전달망, 못 들은 이는 혼자 판단) ② 망치와 모루 (붙들린 상대를 알아보고 옆 · 뒤로 — 명령 '측면 기동' 포함, 틀릴 수 있음) ③ 연락 두절 시 마지막 임무로 자율 판단
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    return s.replace(a,b)
h=open(D+'rt3_head.js').read()
h=rep(h,"   v7.9.3: 로그 4건 추적 수리","""   v7.9.4: ① 임시 집결 — 열린 싸움에서 최근 12초에 동료가 둘 이상 쓰러졌고 우리가 밀리거나 (힘의 비 1 아래), 지휘관이 쓰러졌으면, 지금 지휘관 (인주 → 안 되면 부지휘관 노먼) 이 집결지 (아직 모여 있는 동료들 한가운데에서 적 반대쪽으로 2.5칸) 를 부름.
           전달은 지휘 전달망 그대로 — 못 들은 이는 모른 채 각자 판단 (로그 rallyMiss). 맞붙은 이는 싸움이 먼저, 20초 안에 도착하면 그 자리를 지킴. 같은 계기로 적도 후퇴 · 재집결을 가짐 (v6.0).
           ② 망치와 모루 — 동료가 붙들어 (모루: 적이 그 동료를 보고 겨눔) 선 상대를 알아보고, 자유로운 미드필더 · 공격수 · 사수가 그 상대를 더 값지게 봄 (옆 · 뒤는 모루 반대쪽). 호 (arc) 를 그려 돌아 들어가 앞을 가로지르지 않음. 판단은 틀릴 수 있음 — 베테랑이 아니면 30% (베테랑 15%) 로 반대편을 고름.
           명령 '측면 기동' (flank): 적 하나를 찍으면 그 적의 옆 · 뒤 (모루 반대쪽) 로 돌아 들어가 침 — 받쳐 줄 이가 아직 안 붙었으면 '이른 기동' 으로 로그에 남김.
           ③ 연락 두절 — 지휘관과 6초 넘게 닿지 않은 명령 없는 아군은 마지막 임무로 판단: 자리 임무 (이동 · 제자리 · 전열 · 사주경계) 는 그 자리를 지킴 · 표적 임무 (공격 · 암살 …) 는 아는 한 그 표적을 계속 (교전 규칙도 허락) · 임무가 없거나 끝났으면 마지막으로 지휘관을 본 자리로 합류 — 가끔 (20%) 엉뚱한 쪽으로 어림함.
   v7.9.3: 로그 4건 추적 수리""")
h=rep(h,"  roe: { def: 'smart', chase: 6.5,","  rally: { t: 12, n: 2, odds: 1, back: 2.5, hold: 20, cd: 25, near: 8 },   // v7.9.4 임시 집결: 최근 t 초에 n 명 이상 쓰러짐 + 힘의 비 odds 아래 · 집결지 = 모인 동료 중심에서 적 반대로 back 칸 · hold 초 동안 · cd 초 뒤에 다시 · 연락 두절 off 초\n  hm: { pinGap: 0.9, face: 0.9, bonus: 1.6, err: 0.3, errVet: 0.15, offT: 6 },   // v7.9.4 망치와 모루 (pinGap 붙든 거리 여유 · face 상대가 모루를 보는 각 · bonus 표적 점수 · err 틀릴 확률) · 연락 두절 offT 초\n  roe: { def: 'smart', chase: 6.5,")
open(D+'rt3_head.js','w').write(h)
t=open(D+'rt3_tail.js').read()
BLOCK = r"""/* ---------- v7.9.4 연락 · 임시 집결 · 망치와 모루 · 연락 두절 임무 ---------- */
const hash01 = (a, b, c) => { let x = Math.imul(a * 73856093 ^ b * 19349663 ^ c * 83492791, 2654435761) >>> 0; return (x % 10007) / 10007; };   // 무작위 아님 — 같은 (사람 · 일 · 때) 면 같은 판단
// 0.5초마다: 지휘관과 닿는 정도 (net) · 닿지 않은 시간 (offT) · 마지막으로 지휘관이 있던 자리 (bossAt)
function netTick(W){
  const C = cmdBoss(W, 0), H = W.rules.hm || {};
  for (const u of W.units){ if (u.side !== 0 || !u.alive) continue;
    const p = !C ? 0 : u === C ? 1 : cmdLink(W, C, u).p; u.net = p;
    if (p >= 0.4){ if (u.offFrom != null && W.t - u.offFrom >= (H.offT || 6)) L(W, { k: 'netBack', a: u.i, sec: Math.round(W.t - u.offFrom), vis: true }); u.offFrom = null; u.offLog = false; if (C) u.bossAt = { x: C.x, y: C.y, t: W.t }; }
    else if (p < 0.2){ if (u.offFrom == null) u.offFrom = W.t; if (!u.offLog && W.t - u.offFrom >= (H.offT || 6)){ u.offLog = true; L(W, { k: 'netLost', a: u.i, m: u.mission ? orderTxt(u.mission.o, u) : null, vis: true }); } } }
}
const offT = (W, u) => u.offFrom != null ? W.t - u.offFrom : 0;
// 임시 집결: 전선이 무너지면 지휘관이 집결지를 부름 (못 들은 이는 각자)
function rallyTick(W){
  const R = W.rules.rally || {}, al = W.units.filter(u => u.side === 0 && u.alive && !u.down), E = W.eng;
  const fallen = new Set(W.units.filter(u => u.side === 0 && (!u.alive || u.down)).map(u => u.i)), prev = W.fallenSet || new Set();
  for (const i of fallen) if (!prev.has(i)) (W.lossLog || (W.lossLog = [])).push(W.t);
  W.fallenSet = fallen;
  const C = cmdBoss(W, 0); if (!C || !E || !E.open || al.length < 2) return;
  if (W.rally && W.t < W.rally.until) return; if (W.rally && W.t < W.rally.t0 + (R.cd || 25)) return;
  if (W.boss0 == null) W.boss0 = C.i; const b0 = W.units[W.boss0]; if (b0 && !b0.alive && W.bossLostT == null) W.bossLostT = W.t;
  const recent = (W.lossLog || []).filter(x => W.t - x <= (R.t || 12)).length, bossLost = W.bossLostT != null && W.t - W.bossLostT < 15;
  if (!((recent >= (R.n || 2) && E.odds < (R.odds != null ? R.odds : 1)) || (bossLost && E.odds < 1.2 && recent >= 1))) return;
  const near = al.filter(a => dist(a, C) < 7), cx = near.reduce((s, a) => s + a.x, 0) / near.length, cy = near.reduce((s, a) => s + a.y, 0) / near.length;
  const foes = W.units.filter(f => f.alive && f.side === 1 && (f.seenBy || al.some(a => fresh(W, a.sense[f.i], 3))));
  let dx = 0, dy = 0; if (foes.length){ const fx = foes.reduce((s, f) => s + f.x, 0) / foes.length, fy = foes.reduce((s, f) => s + f.y, 0) / foes.length, d = Math.hypot(cx - fx, cy - fy) || 1; dx = (cx - fx) / d; dy = (cy - fy) / d; }
  let px = cx, py = cy; for (let k = (R.back || 2.5); k >= 0; k -= 0.5){ const x = Math.max(0.8, Math.min(W.map.W - 0.8, cx + dx * k)), y = Math.max(0.8, Math.min(W.map.H - 0.8, cy + dy * k)); if (!boxRock(W, x, y, 0.4)){ px = x; py = y; break; } }
  W.rally = { x: px, y: py, t0: W.t, until: W.t + (R.hold || 20), by: C.i }; const got = [], miss = [];
  for (const u of al){ if (u.order) continue; if (u === C){ u.rally = { x: px, y: py, t0: W.t, until: W.t + (R.hold || 20), by: C.i }; got.push(u.i); continue; }
    const lk = cmdLink(W, C, u); if (W.rand() < lk.p){ u.rally = { x: px, y: py, t0: W.t + lk.t, until: W.t + (R.hold || 20), by: C.i }; got.push(u.i); } else miss.push(u.i); }
  L(W, { k: 'rally', a: C.i, x: +px.toFixed(1), y: +py.toFixed(1), why: bossLost ? '지휘관이 쓰러져 ' + C.name + '이(가) 이어받음' : `최근 ${recent}명이 쓰러지고 힘의 비 ${E.odds === Infinity ? '—' : E.odds.toFixed(2)}`, got, miss, vis: true });
}
function rallyStep(W, u, dt){
  const r = u.rally; if (!r) return false;
  if (W.t > r.until){ u.rally = null; return false; }
  if (W.t < r.t0) return false;
  if (u.act || W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < Math.max(u.rng, f.rng) + 0.4 && (f.target === u || focusOf(W, f) === u))) return false;   // 맞붙었으면 싸움이 먼저
  if (Math.hypot(r.x - u.x, r.y - u.y) < 1.8){ if (!r.arr){ r.arr = true; u.stay = { x: r.x, y: r.y }; L(W, { k: 'rallyArrive', a: u.i, vis: true }); } return false; }
  setMood(W, u, '재집결'); u.lastDec = { t: W.t, s: `집결지로 (${r.by != null && W.units[r.by] ? W.units[r.by].name + '의 부름' : ''})` }; goTo(W, u, r.x, r.y, dt); return true;
}
// 연락 두절: 마지막 임무 (mission) 로 판단 — 자리면 그 자리 · 표적이면 그 표적 · 없으면 마지막으로 지휘관을 본 자리로 (가끔 엉뚱하게)
function offStep(W, u, dt){
  const H = W.rules.hm || {}; if (u.order || u.act || offT(W, u) < (H.offT || 6)) return false;
  if (W.units.some(f => f.alive && f.side !== u.side && canSee(W, u, f) && dist(u, f) < 7)) return false;   // 적이 가까우면 교전 규칙이 먼저
  const M = u.mission, K = M ? M.k : null; let kind, gx = null, gy = null;
  if (M && ['move', 'hold', 'amove', 'line', 'watch'].includes(K) && (M.x != null || u.stay)){ kind = 'post'; gx = M.x != null ? M.x : u.stay.x; gy = M.y != null ? M.y : u.stay.y; }
  else if (M && ['attack', 'charge', 'throw', 'assn', 'palm', 'leap'].includes(K) && M.b != null && W.units[M.b] && W.units[M.b].alive && fresh(W, u.sense[M.b], 10)){ kind = 'target'; gx = u.sense[M.b].x; gy = u.sense[M.b].y; }
  else if (u.bossAt){ kind = 'rejoin'; gx = u.bossAt.x; gy = u.bossAt.y; if (hash01(u.i, 7, Math.floor(W.t / 10)) < 0.2){ gx += (hash01(u.i, 3, Math.floor(W.t / 10)) - 0.5) * 8; gy += (hash01(u.i, 5, Math.floor(W.t / 10)) - 0.5) * 8; kind = 'rejoinErr'; } }
  else return false;
  if (u.offKind !== kind){ u.offKind = kind; u.lastDec = { t: W.t, s: kind === 'post' ? '연락 두절 — 마지막 임무대로 그 자리를 지킴' : kind === 'target' ? '연락 두절 — 마지막 임무의 표적을 계속' : kind === 'rejoin' ? '연락 두절 — 마지막으로 지휘관을 본 자리로 합류' : '연락 두절 — 지휘관 쪽으로 어림해 감 (빗나갈 수 있음)' };
    L(W, { k: 'offAct', a: u.i, kind, m: M ? orderTxt(M.o, u) : null, vis: true }); }
  if (Math.hypot(gx - u.x, gy - u.y) < 1.2){ if (kind === 'post' || kind === 'rejoin') u.stay = { x: gx, y: gy }; stop(u); return kind !== 'target'; }
  setMood(W, u, kind === 'post' ? '임무 자리로' : kind === 'target' ? '임무 표적을 찾아' : '지휘관 쪽으로'); goTo(W, u, gx, gy, dt); return true;
}
// 망치와 모루: 붙들린 상대 (모루: 동료가 붙들고 상대가 그 동료를 봄) 와 붙든 이를 알아봄 (0.5초마다)
function hmTick(W){
  const H = W.rules.hm || {}, pins = new Map();
  for (const f of W.units){ if (!f.alive || f.side !== 1 || !(f.seenBy)) continue;
    for (const a of W.units){ if (!a.alive || a.side !== 0 || a.down || isFar(a) || a.crawl) continue;
      if (gap(a, f) < Math.max(a.rng, f.rng) + (H.pinGap || 0.9) && focusOf(W, f) === a && angDiff(f.face, Math.atan2(a.y - f.y, a.x - f.x)) < (H.face || 0.9)){ if (!pins.has(f.i)) pins.set(f.i, []); pins.get(f.i).push(a.i); } } }
  W.hm = { pins };
  for (const u of W.units){ if (u.side !== 0) continue; const was = u.hm; let nu = null;
    for (const [fi, L2] of pins) if (L2.includes(u.i)) nu = { k: 'anvil', b: fi };
    if (!nu && u.alive && ((u.order && u.order.k === 'flank') || (/협공|측면|옆으로/.test(u.mood || '') && u.target && pins.has(u.target.i)))) nu = { k: 'hammer', b: u.order && u.order.k === 'flank' ? u.order.b : u.target.i };
    u.hm = nu; if (nu && (!was || was.k !== nu.k || was.b !== nu.b)) L(W, { k: 'hm', a: u.i, r: nu.k, b: nu.b, vis: true }); }
}
// 앞을 가로지르지 않고 호를 그려 돌아 들어갈 중간 지점
function arcVia(W, u, t, p){
  const R = t.r + u.r + Math.max(t.rng, 0.5) + 1.1, au = Math.atan2(u.y - t.y, u.x - t.x), ap = Math.atan2(p.y - t.y, p.x - t.x);
  let d = ap - au; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
  if (Math.abs(d) < 1.2 || dist(u, t) < R * 0.8) return p;
  const dd = angDiff(au + d / 2, t.face) < 0.9 ? (d > 0 ? d - 2 * Math.PI : d + 2 * Math.PI) : d, wa = au + dd * 0.5, q = { x: t.x + Math.cos(wa) * R, y: t.y + Math.sin(wa) * R };
  return boxRock(W, q.x, q.y, u.r * 0.9) ? p : q;
}
// 명령 '측면 기동': 찍은 적의 옆 · 뒤 (모루 반대쪽) 로 돌아 들어가 침
function flankOrder(W, u, dt){
  const o = u.order, t = W.units[o.b], H = W.rules.hm || {};
  if (!t || !t.alive){ u.order = null; u.stay = { x: u.x, y: u.y }; return; }
  if (o.t0 == null){ o.t0 = W.t; o.err = hash01(u.i, t.i, 11) < (u.vet ? H.errVet || 0.15 : H.err || 0.3); const pin = W.hm && W.hm.pins.get(t.i);
    L(W, { k: 'flankGo', a: u.i, b: t.i, early: !(pin && pin.length), err: false, vis: true }); }
  const see = canSee(W, u, t) || (u.side === 0 && !!t.seenBy);
  if (see) u.last = { x: t.x, y: t.y }; else if (!u.last || Math.hypot(u.x - u.last.x, u.y - u.last.y) < 0.4){ L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return; }
  if (W.t - o.t0 > 30){ u.order = null; u.stay = { x: u.x, y: u.y }; return; }
  const anv = W.units.filter(a => a.alive && a !== u && a.side === u.side && !isFar(a) && gap(a, t) < 2), ref = anv.length ? { x: anv.reduce((s, a) => s + a.x, 0) / anv.length, y: anv.reduce((s, a) => s + a.y, 0) / anv.length } : (W.units.filter(a => a.alive && a !== u && a.side === u.side).length ? { x: W.units.filter(a => a.alive && a !== u && a.side === u.side).reduce((s, a) => s + a.x, 0) / W.units.filter(a => a.alive && a !== u && a.side === u.side).length, y: W.units.filter(a => a.alive && a !== u && a.side === u.side).reduce((s, a) => s + a.y, 0) / W.units.filter(a => a.alive && a !== u && a.side === u.side).length } : { x: u.x, y: u.y });
  let base = Math.atan2(t.y - ref.y, t.x - ref.x); if (o.err){ base += (hash01(u.i, t.i, 13) < 0.5 ? 1 : -1) * 2.2; if (!o.errLog){ o.errLog = true; L(W, { k: 'flankMis', a: u.i, b: t.i, vis: false }); } }   // 틀린 쪽을 고름 — 상대 앞으로 돌아 들어감 (로그에만, 본인은 모름)
  const spot = approachPt(W, u, t, base, [0, 0.5, -0.5, 0.9, -0.9, 1.4, -1.4]) || { x: t.x, y: t.y };
  if (gap(u, t) <= u.rng + 0.6){ u.target = t; u.state = 'fight'; fight(W, u, t, dt, see, true); return; }
  const via = arcVia(W, u, t, spot); setMood(W, u, '측면 기동', t.i); goTo(W, u, via.x, via.y, dt);
  if (Math.hypot(spot.x - u.x, spot.y - u.y) < 0.9){ u.target = t; u.state = 'fight'; fight(W, u, t, dt, see, true); }
}
"""
t=rep(t,"// 아군 명령 전달: 유저가 준 명령 (ordPend) 은 닿는 때 받음",BLOCK+"// 아군 명령 전달: 유저가 준 명령 (ordPend) 은 닿는 때 받음")
# 틱
t=rep(t,"posKnownTick(W); engTick(W); planShadow(W);","posKnownTick(W); engTick(W); netTick(W); hmTick(W); rallyTick(W); planShadow(W);")
# act2: 집결 · 연락 두절
t=rep(t,"  if (u.side === 0 && u.order){ doOrder(W, u, dt); return; }\n","  if (u.side === 0 && u.order){ doOrder(W, u, dt); return; }\n  if (u.side === 0 && u.rally && rallyStep(W, u, dt)) return;   // v7.9.4 임시 집결\n  if (u.side === 0 && offStep(W, u, dt)) return;   // v7.9.4 연락 두절 — 마지막 임무로 판단\n")
# doOrder: 측면 기동
t=rep(t,"  if (o.k === 'sac'){ sacStep(W, u, dt); return; }","  if (o.k === 'sac'){ sacStep(W, u, dt); return; }\n  if (o.k === 'flank'){ flankOrder(W, u, dt); return; }   // v7.9.4 측면 기동")
# 표적 점수: 붙들린 상대
t=rep(t,"(f.i === fc ? 1.2 : 0);   // v7.4 지휘관이 마지막으로 정한 공격 표적을 함께 노림 (8초)","(f.i === fc ? 1.2 : 0) + (W.hm && W.hm.pins.has(f.i) && !W.hm.pins.get(f.i).includes(u.i) ? (W.rules.hm || {}).bonus || 1.6 : 0);   // v7.4 지휘관이 마지막으로 정한 공격 표적을 함께 노림 (8초)   // v7.9.4 동료가 붙들어 선 상대 (망치와 모루)")
# 교전 규칙: 연락 두절 + 표적 임무는 허락
t=rep(t,"  const m = roeOf(W, u); if (m === 'free') return '';\n  if (m === 'nofire')","  const m = roeOf(W, u); if (m === 'free') return '';\n  if (offT(W, u) >= ((W.rules.hm || {}).offT || 6) && u.mission && ['attack', 'charge', 'throw', 'assn', 'palm'].includes(u.mission.k) && u.mission.b === f.i && m !== 'nofire') return '';   // v7.9.4 연락이 끊겨도 받은 표적 임무는 계속\n  if (m === 'nofire')")
# orderTxt
t=rep(t,"const orderTxt = (o, u) => o && o.k === 'sac' ? ['sac'] :","const orderTxt = (o, u) => o && o.k === 'flank' ? ['flank', o.b] : o && o.k === 'sac' ? ['sac'] :")
t=rep(t,"module.exports = { scoutKillPick,","module.exports = { netTick, rallyTick, rallyStep, offStep, hmTick, flankOrder, arcVia, scoutKillPick,")
open(D+'rt3_tail.js','w').write(t); print('ok')
