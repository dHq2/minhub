def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
CODE = r"""/* ---------- v6.4 적의 기동: 지휘관이 플레이어처럼 유닛을 움직임 ----------
   지휘관이 있을 때 (한 번에 1 + 지휘력 가지까지): 포위 사냥 (한 상대에 둘 넘게 붙으면 앞은 하나가 붙들고 나머지는 옆 · 뒤로 돌아감) ·
   교대 (빈사 마디는 성한 동료 뒤로 빠지고 그 동료가 그 자리로 뛰어듦) · 양동 (큰 싸움이 붙으면 빠른 놈이 크게 돌아 사수 · 구급 · 궁수를 노림 —
   누가 막으러 나오면 동료 쪽으로 끌고 오고, 아무도 안 막으면 그대로 붙음).
   지휘관이 없어도 각자 본능으로: 총구 피하기 (사수가 나를 겨누면 옆으로 뜀 — 방패 · 큰 몸 동료 뒤 쪽을 먼저) · 끌고 오기 (혼자 거구 · 위험한 놈 · 둘에게 몰리면 동료 쪽으로 물러남).
   기동은 서둘러 뜀 (×run). 상대를 고르는 건 본 것 · 겪은 것 (v6.3) 으로. 로그에 모두, 이야기엔 우리 눈에 보인 것만 */
const MV_ORG = ['surround', 'swap', 'cover', 'feint'];
const mvOn = (W, u) => !!(u.mv && W.t < u.mv.until);
const mvFree = (W, u) => u.alive && u.side === 1 && !u.crawl && !u.kb && !u.lurk && !u.pact && W.t >= u.proneT && W.t >= (u.stunT || -9) && !mvOn(W, u) && !(u.act && u.act.k === 'charge') && !(W.wedge && (W.wedge.tip === u.i || W.wedge.sh.includes(u.i) || W.wedge.body.includes(u.i))) && !(W.env && W.env.wp && W.env.wp[u.i]) && !(W.plan && W.plan.k === 'withdraw');
function planMoves(W, mine, known){
  const reach = (a, b) => Math.max(isFar(a) ? 0.3 : a.rng, isFar(b) ? 0.3 : b.rng) + 0.6;
  // 본능: 끌고 오기
  for (const u of mine){ if (!mvFree(W, u) || isFar(u) || u.line || W.t < (u.dragT || 0)) continue;
    const near = known.filter(f => !isFar(f) && !f.down && gap(u, f) < 3); if (!near.length || mine.some(m => m !== u && !isFar(m) && dist(m, u) < 3)) continue;
    const big = near.find(f => f.giant || iDanger(W, 1, f) >= 60) || (near.length >= 2 ? near[0] : null); if (!big || (busyW(W, u) && u.hp / u.max > 0.5 && !big.giant)) continue;
    const g = mine.filter(m => m !== u && !isFar(m) && dist(m, u) > 3 && dist(m, u) < 10).sort((a, b) => dist(a, u) - dist(b, u))[0]; if (!g) continue;
    u.mv = { k: 'drag', x: g.x, y: g.y, b: big.i, run: true, until: W.t + 2.5 }; u.dragT = W.t + 6;
    L(W, { k: 'mvr', side: 1, m: 'drag', a: u.i, b: big.i, c: g.i, why: big.giant ? '거구와 혼자 맞서지 않음' : near.length >= 2 ? '혼자 ' + near.length + '명에게 몰림' : '위험한 놈 (' + iWhyD(W, 1, big) + ')', obs: !!u.seenBy, vis: true }); }
  const C = mine.filter(u => u.cmd && !u.down && W.t >= u.proneT).sort((a, b) => b.cmd - a.cmd)[0]; if (!C) return;
  const cap = 1 + C.cmd; let used = mine.filter(u => mvOn(W, u) && MV_ORG.includes(u.mv.k)).length;
  // 교대
  for (const h of mine){ if (used >= cap) return; if (!mvFree(W, h) || isFar(h) || h.hp / h.max >= 0.35 || !busyW(W, h)) continue;
    const f = known.filter(x => !x.down && gap(h, x) < reach(h, x)).sort((a, b) => gap(h, a) - gap(h, b))[0]; if (!f) continue;
    const m = mine.filter(x => x !== h && mvFree(W, x) && !isFar(x) && x.hp / x.max > 0.6 && !busyW(W, x) && dist(x, h) < 4.5).sort((a, b) => dist(a, h) - dist(b, h))[0]; if (!m) continue;
    const d = dist(m, f) || 1, bx = Math.max(0.7, Math.min(W.map.W - 0.7, m.x + (m.x - f.x) / d * 1.3)), by = Math.max(0.7, Math.min(W.map.H - 0.7, m.y + (m.y - f.y) / d * 1.3));
    h.mv = { k: 'swap', x: bx, y: by, run: true, until: W.t + 2.5 }; m.mv = { k: 'cover', b: f.i, run: true, until: W.t + 2.2 }; m.target = f; m.state = 'hunt'; used += 2;
    L(W, { k: 'mvr', side: 1, m: 'swap', a: h.i, b: m.i, c: f.i, hp: Math.round(h.hp / h.max * 100), obs: !!(h.seenBy || m.seenBy), vis: true }); }
  // 포위 사냥
  const sT = W.surT || (W.surT = {});
  for (const f of known){ if (used >= cap) return; if (f.down || W.t < (sT[f.i] || 0)) continue;
    const A = mine.filter(u => !isFar(u) && !u.giant && u.target === f && dist(u, f) < 4.5); if (A.length < 2) continue;
    const ao = u => Math.atan2(u.y - f.y, u.x - f.x), front = A.slice().sort((a, b) => angDiff(ao(a), f.face) - angDiff(ao(b), f.face))[0];
    const free = [1.9, -1.9, Math.PI].map(o => f.face + o), ids = [];
    for (const u of A){ if (u === front || !mvFree(W, u) || u.line || used >= cap || !free.length) continue;
      const k = free.reduce((bk, s, j) => angDiff(ao(u), s) < angDiff(ao(u), free[bk]) ? j : bk, 0), s = free.splice(k, 1)[0];
      if (angDiff(ao(u), s) < 0.7) continue;   // 이미 그쪽
      u.mv = { k: 'surround', b: f.i, ang: s, back: angDiff(s, f.face) > 2.6, run: true, until: W.t + 2.8 }; used++; ids.push(u.i); }
    if (ids.length){ sT[f.i] = W.t + 3; L(W, { k: 'mvr', side: 1, m: 'surround', a: front.i, b: f.i, ids, obs: ids.some(i => W.units[i].seenBy), vis: true }); } }
  // 양동
  if (used < cap && W.t >= (W.feintT || 0) && mine.filter(u => busyW(W, u)).length >= 2){
    const tg = known.filter(t => !t.down && iKnow(W, 1, t) && !busyW(W, t) && ['총', '구급', '활'].some(x => iRec(W, 1, t).tags.includes(x))).sort((a, b) => iCenter(W, 1, b) + iDanger(W, 1, b) - iCenter(W, 1, a) - iDanger(W, 1, a))[0];
    if (tg){ const fc = centroid(mine.filter(u => busyW(W, u)));
      const r = mine.filter(u => mvFree(W, u) && !isFar(u) && !u.giant && !u.line && !busyW(W, u) && u.hp / u.max > 0.6 && u.spd >= 1.9 && dist(u, tg) < 14).sort((a, b) => dist(a, tg) - dist(b, tg))[0];
      if (r){ const a0 = Math.atan2(tg.y - fc.y, tg.x - fc.x), ar = Math.atan2(r.y - tg.y, r.x - tg.x), sg = Math.sin(ar - a0) >= 0 ? 1 : -1, wa = a0 + sg * 1.3;
        const wx = Math.max(0.8, Math.min(W.map.W - 0.8, tg.x + Math.cos(wa) * 3)), wy = Math.max(0.8, Math.min(W.map.H - 0.8, tg.y + Math.sin(wa) * 3));
        r.mv = { k: 'feint', b: tg.i, wx, wy, leg: boxRock(W, wx, wy, r.r) ? 1 : 0, run: true, until: W.t + 5 }; used++; W.feintT = W.t + 8;
        L(W, { k: 'mvr', side: 1, m: 'feint', a: r.i, b: tg.i, why: iRec(W, 1, tg).tags.filter(x => ['총', '구급', '활', '지휘'].includes(x)).join(' · '), obs: !!r.seenBy, vis: true }); } } }
}
function mvStep(W, u, dt){
  if (u.side !== 1 || AI6.includes('mv')) return false;
  // 본능: 총구 피하기
  if (!mvOn(W, u) && W.t >= (u.jinkT || 0) && !u.line && !u.lurk && !u.crawl && !busyW(W, u)){
    const g = W.units.find(x => x.alive && x.side !== u.side && isFar(x) && x.act && x.act.k === 'atk' && x.act.phase === 'wind' && x.act.b === u.i && canSee(W, u, x));
    if (g){ const a = Math.atan2(u.y - g.y, u.x - g.x), sc = p => W.units.filter(m => m.alive && m !== u && m.side === u.side && (m.shield || m.bodyShield || m.giant) && segD(g, p.x, p.y, m) < m.r + 0.2).length;
      const p = [a + Math.PI / 2, a - Math.PI / 2].map(b => ({ x: u.x + Math.cos(b) * 1.3, y: u.y + Math.sin(b) * 1.3 })).filter(p => p.x > 0.6 && p.y > 0.6 && p.x < W.map.W - 0.6 && p.y < W.map.H - 0.6 && !boxRock(W, p.x, p.y, u.r)).sort((p, q) => sc(q) - sc(p))[0];
      if (p){ u.mv = { k: 'jink', x: p.x, y: p.y, run: true, until: W.t + 0.7 }; u.jinkT = W.t + 2.5; L(W, { k: 'mvr', side: 1, m: 'jink', a: u.i, b: g.i, cover: sc(p) > 0, obs: !!u.seenBy, vis: true }); } } }
  if (!mvOn(W, u)){ if (u.mv && u.mv.k === 'feint') L(W, { k: 'mvr', side: 1, m: 'feintRes', r: 'time', a: u.i, b: u.mv.b, vis: true }); u.mv = null; return false; }
  const M = u.mv, T = M.b != null ? W.units[M.b] : null;
  if (M.k === 'surround'){
    if (!T || !T.alive || T.down){ u.mv = null; return false; }
    const R = T.r + u.r + Math.max(0.3, u.rng * 0.8), au = Math.atan2(u.y - T.y, u.x - T.x), d = angDiff(au, M.ang);
    if (d < 0.45 && gap(u, T) < u.rng + 0.6){ u.mv = null; return false; }   // 자리 잡음 → 침
    const na = au + (Math.sin(M.ang - au) >= 0 ? 1 : -1) * Math.min(d, 0.9), rr = Math.max(R, Math.min(dist(u, T), R + 1.2));
    setMood(W, u, M.back ? '포위 — 뒤로 돎' : '포위 — 옆으로 돎', T.i); goTo(W, u, T.x + Math.cos(na) * rr, T.y + Math.sin(na) * rr, dt); return true; }
  if (M.k === 'cover'){ if (!T || !T.alive || T.down || gap(u, T) < u.rng + 0.3){ u.mv = null; return false; } u.target = T; setMood(W, u, '교대 — 뛰어듦', T.i); goTo(W, u, T.x, T.y, dt); return true; }
  if (M.k === 'feint'){
    if (!T || !T.alive || T.down){ u.mv = null; return false; }
    const ic = W.units.find(x => x.alive && x !== T && x.side !== u.side && !isFar(x) && dist(x, u) < 3.2 && (x.target === u || (x.order && x.order.b === u.i) || (Math.hypot(x.vx || 0, x.vy || 0) > 0.3 && (x.vx || 0) * (u.x - x.x) + (x.vy || 0) * (u.y - x.y) > 0)));
    if (ic){ const g = W.units.filter(m => m.alive && m !== u && m.side === u.side && !isFar(m) && dist(m, u) > 2.5).sort((a, b) => dist(a, u) - dist(b, u))[0];
      L(W, { k: 'mvr', side: 1, m: 'feintRes', r: 'pulled', a: u.i, b: T.i, c: ic.i, obs: !!(u.seenBy || ic.seenBy), vis: true });
      u.mv = g ? { k: 'drag', x: g.x, y: g.y, b: ic.i, run: true, until: W.t + 2.5 } : null; u.dragT = W.t + 6; return !!g; }
    if (gap(u, T) < u.rng + 0.4){ L(W, { k: 'mvr', side: 1, m: 'feintRes', r: 'strike', a: u.i, b: T.i, obs: !!(u.seenBy || T.side === 0), vis: true }); u.mv = null; u.target = T; u.state = 'hunt'; return false; }
    if (M.leg === 0 && Math.hypot(M.wx - u.x, M.wy - u.y) < 1) M.leg = 1;
    setMood(W, u, '양동 — ' + T.name + ' 쪽으로 크게 돎', T.i); if (M.leg === 0) goTo(W, u, M.wx, M.wy, dt); else goTo(W, u, T.x, T.y, dt); return true; }
  if (Math.hypot(M.x - u.x, M.y - u.y) < 0.35){ u.mv = null; return false; }   // swap · drag · jink: 그 자리까지
  setMood(W, u, M.k === 'swap' ? '교대 — 물러남' : M.k === 'drag' ? '끌고 감' : '총구를 피함', T ? T.i : null); goTo(W, u, M.x, M.y, dt); return true;
}
function wedgeStep(W, u, dt){"""
rep(T,"function wedgeStep(W, u, dt){",CODE)
rep(T,"if (!AI6.includes('cmdchg')) cmdCharge(W, mine, known); }","if (!AI6.includes('cmdchg')) cmdCharge(W, mine, known); if (!AI6.includes('mv')) planMoves(W, mine, known); }")
rep(T,"  if (u.side === 1 && !u.order && (wedgeStep(W, u, dt) || encircleStep(W, u, dt))) return;   // v6.1 쐐기 돌파 · 산개 포위","  if (u.side === 1 && !u.order && (wedgeStep(W, u, dt) || encircleStep(W, u, dt))) return;   // v6.1 쐐기 돌파 · 산개 포위\n  if (u.side === 1 && !u.order && mvStep(W, u, dt)) return;   // v6.4 적의 기동 (포위 사냥 · 교대 · 양동 · 총구 피하기 · 끌고 오기)")
rep(T,"const spdNow = (W, u) => u.spd * u.spdMul * (u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack') ? (W.rules.run || 1.3) : 1)","const spdNow = (W, u) => u.spd * u.spdMul * ((u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack')) || (u.mv && u.mv.run && W.t < u.mv.until) ? (W.rules.run || 1.3) : 1)")
rep(T,"module.exports = { wedgeFix,","module.exports = { planMoves, mvStep, mvFree, wedgeFix,")
