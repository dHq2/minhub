# v7.9.2 엔진: 지휘 전달망 (두 다리 · 전달자의 바쁨 · 부지휘관) · 임무 기록 · 못 들은 명령 기록 · 독단 표시
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    return s.replace(a,b)
h=open(D+'rt3_head.js').read()
h=rep(h,"   v7.9.1: 정찰은 방침을 정함","""   v7.9.2: 지휘 전달망 — 지휘관이 닿지 않으면 동료를 거침 (전엔 한 다리, 이제 두 다리까지). 거치는 이가 맞붙었거나 · 쏘고 · 붓는 중이면 덜 전함 (relayBusy ×0.6), 지휘 점수가 있는 동료 (노먼 · 부지휘관) 는 더 믿음직 (×1.05).
           임무 (mission) = 마지막으로 받은 명령 (끝나도 남음 — 명령이 끊겨도 무엇을 하러 온 건지는 앎, 자율 판단의 근거). 못 들은 명령은 기록 (missT) — 화면에 ✗ 와 '재전달'. 충동으로 규칙을 어긴 일은 독단 (deviT) 으로 표시.
   v7.9.1: 정찰은 방침을 정함""")
h=rep(h,"  roe: { def: 'smart',","  cmdLinkX: { relayBusy: 0.6, relayCmd: 1.05, hop2: 0.85, hop2T: 0.6 },   // v7.9.2 전달망\n  roe: { def: 'smart',")
open(D+'rt3_head.js','w').write(h)
t=open(D+'rt3_tail.js').read()
OLD="""  if (a.p < 0.5) for (const m of W.units){ if (m === C || m === u || !m.alive || m.crawl || m.side !== u.side || (m.koT && W.t < m.koT)) continue;
    const b1 = cmdLink1(W, C, m); if (b1.p < 0.3) continue; const b2 = cmdLink1(W, m, u), pr = b1.p * b2.p * (K.relay || 0.9);
    if (pr > best.p) best = { p: Math.min(K.max || 0.98, pr), t: b1.t + b2.t + 0.3, via: 'relay', m: m.i, why: m.name + '을 거쳐 전함', c: C.i }; }
  return best;"""
NEW="""  if (a.p < 0.5){
    const X = W.rules.cmdLinkX || {}, ok = m => m !== C && m !== u && m.alive && !m.crawl && m.side === u.side && !(m.koT && W.t < m.koT);
    const q = m => (m.act && ['atk', 'skill', 'reload', 'heal'].includes(m.act.k) || W.units.some(f => f.alive && f.side !== m.side && !isFar(f) && gap(m, f) < Math.max(m.rng, f.rng) + 0.3) ? (X.relayBusy != null ? X.relayBusy : 0.6) : 1) * (m.cmd > 0 ? (X.relayCmd || 1.05) : 1);   // v7.9.2 전달자의 바쁨 · 지휘 점수
    const near = W.units.filter(m => ok(m) && dist(m, C) < 40), L1 = new Map();
    for (const m of near){ const b1 = cmdLink1(W, C, m); if (b1.p >= 0.3) L1.set(m, b1); }
    for (const [m, b1] of L1){ const b2 = cmdLink1(W, m, u), pr = b1.p * b2.p * (K.relay || 0.9) * q(m);   // 한 다리
      if (pr > best.p) best = { p: Math.min(K.max || 0.98, pr), t: b1.t + b2.t + 0.3, via: 'relay', m: m.i, why: m.name + '을 거쳐 전함' + (q(m) < 1 && !(m.cmd > 0) ? ' (바빠 덜 확실)' : ''), c: C.i }; }
    if (best.p < 0.4) for (const [m1, b1] of L1) for (const m2 of near){ if (m2 === m1) continue;   // 두 다리: 지휘관 → m1 → m2 → 나
      const b12 = cmdLink1(W, m1, m2); if (b12.p < 0.3) continue; const b2 = cmdLink1(W, m2, u), pr = b1.p * b12.p * b2.p * (K.relay || 0.9) * (K.relay || 0.9) * (X.hop2 || 0.85) * q(m1) * q(m2);
      if (pr > best.p) best = { p: Math.min(K.max || 0.98, pr), t: b1.t + b12.t + b2.t + 0.3 + (X.hop2T || 0.6), via: 'relay', m: m1.i, m2: m2.i, why: m1.name + ' → ' + m2.name + ' 두 다리로 전함', c: C.i }; }
  }
  return best;"""
t=rep(t,OLD,NEW)
# 명령 도착: 임무 · 못 들음 기록
t=rep(t,"    if (P.ok){ u.order = P.o; u.ordLive = P.o; preempt(W, u);","    if (P.ok){ u.order = P.o; u.ordLive = P.o; u.missT = null; preempt(W, u);")
t=rep(t,"    else { L(W, { k: 'cmdMiss', side: 0, a: u.i, c: P.c, via: P.via, why: P.why, p: +P.p.toFixed(2), o: orderTxt(P.o, u), vis: true });","    else { u.missT = W.t; u.missO = P.o; L(W, { k: 'cmdMiss', side: 0, a: u.i, c: P.c, via: P.via, why: P.why, p: +P.p.toFixed(2), o: orderTxt(P.o, u), vis: true });")
t=rep(t,"L(W, { k: 'cmdRecv', a: u.i, c: P.c, via: P.via, m: P.m != null ? P.m : null,","L(W, { k: 'cmdRecv', a: u.i, c: P.c, via: P.via, m: P.m != null ? P.m : null, m2: P.m2 != null ? P.m2 : null,")
# 임무: 마지막으로 받은 명령 기억 (stepWorld)
t=rep(t,"  for (const u of W.units) if (u.side === 0) u.ordLive = u.order;","  for (const u of W.units) if (u.side === 0){ u.ordLive = u.order; if (u.order && (!u.mission || u.mission.o !== u.order)) u.mission = { o: u.order, k: u.order.k, t: W.t, x: u.order.x, y: u.order.y, b: u.order.b }; }   // v7.9.2 임무 = 마지막으로 받은 명령")
t=rep(t,"  if (W.t - u.impT > 8){ u.impT = W.t;","  if (W.t - u.impT > 8){ u.impT = W.t; u.deviT = W.t;")
open(D+'rt3_tail.js','w').write(t); print('ok')
