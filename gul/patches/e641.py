def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
# ---- 1) 궁수: 동료가 가리면 직사 각 먼저 ----
rep(T,"""function blockedShot(W, u, t, dt, ordered, b){
  if (arcOK(W, u, t) && arcRisk(W, u, t).p <= ffLim(u, W)){""","""// v6.4.1 직사 각: 동료가 가리면 1 ~ 2칸 안에서 곧게 쏠 자리를 먼저 찾음 (0.5초마다). 근접 상대 손 닿는 곳 · 바위 · 사거리 밖 · 오사 위험은 뺌
function directSpot(W, u, t){
  const c = u.dspot && u.dspot.b === t.i && W.t - u.dspot.t < 0.5 ? u.dspot : null; if (c) return c.p;
  const know = knows(W, u), lim = ffLim(u, W); let best = null, bd = 1e9;
  for (const r of [0.7, 1.2, 1.8]) for (let k = 0; k < 10; k++){ const a = k * Math.PI / 5 + r, x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r;
    if (x < 0.6 || y < 0.6 || x > W.map.W - 0.6 || y > W.map.H - 0.6 || boxRock(W, x, y, u.r)) continue;
    const P = { x, y }; if (Math.hypot(t.x - x, t.y - y) - t.r - u.r > u.rng || !losClear(W.map, x, y, t.x, t.y)) continue;
    if (W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && Math.hypot(f.x - x, f.y - y) - f.r - u.r < f.rng + 0.8)) continue;
    if (firstOnLine(W, P, t, u, know) !== t || ffOdds(W, u, t, x, y).p > lim) continue;
    if (r < bd){ bd = r; best = P; } }
  u.dspot = { b: t.i, t: W.t, p: best }; return best;
}
const angleFirst = (W, u, t, dt) => { if (!u.lob || AI6.includes('angle') || (u.angT || 0) >= 1.2) return false; const sp = directSpot(W, u, t); if (!sp) return false; u.angT = (u.angT || 0) + dt; setMood(W, u, '직사 각 잡기', t.i); goTo(W, u, sp.x, sp.y, dt); return true; };   // 1.2초 안에 못 잡으면 곡사
function blockedShot(W, u, t, dt, ordered, b){
  if (!ordered && angleFirst(W, u, t, dt)) return;   // v6.4.1 곡사보다 직사 각 먼저
  if (arcOK(W, u, t) && arcRisk(W, u, t).p <= ffLim(u, W)){""")
rep(T,"""  if (first !== t && arcOK(W, u, t) && (first.side === u.side || first.bodyShield || ordered || inGuard(W, first, u, true)) && arcRisk(W, u, t).p <= (now ? (W.rules.arc || {}).rapid || 0.25 : ffLim(u, W))){ u.ffWait = 0; startArc(""","""  if (first === t) u.angT = 0;
  if (first !== t && first.side === u.side && !ordered && arcOK(W, u, t) && angleFirst(W, u, t, dt)) return;   // v6.4.1 동료가 가리면 곡사보다 직사 각 먼저 (방패 · 큰 몸이 가리면 바로 곡사 — 방패 너머)
  if (first !== t && arcOK(W, u, t) && (first.side === u.side || first.bodyShield || ordered || inGuard(W, first, u, true)) && arcRisk(W, u, t).p <= (now ? (W.rules.arc || {}).rapid || 0.25 : ffLim(u, W))){ u.ffWait = 0; u.angT = 0; startArc(""")
# ---- 3) 접근 판단: 돌진 값 ----
rep(T,"""    if (W.units.some(o => o.alive && o !== t && o.side === t.side && !isFar(o) && o.role === '전선' && (o.canGuard || o.bodyShield) && dist(u, o) < dist(u, t) && segD(u, t.x, t.y, o) < o.r + u.r)) v -= 2;
  }""","""    if (W.units.some(o => o.alive && o !== t && o.side === t.side && !isFar(o) && o.role === '전선' && (o.canGuard || o.bodyShield) && dist(u, o) < dist(u, t) && segD(u, t.x, t.y, o) < o.r + u.r)) v -= 2;
  }
  if (u.side === 1 && !AI6.includes('appr')){   // v6.4.1 접근 판단: 다친 몸 · 길목에서 칠 수 있는 놈 · 붙어 싸우던 상대에게 등을 보임
    if (u.hp / u.max < 0.5) v -= (0.5 - u.hp / u.max) * 4;
    v -= gauntlet(W, u, t) * 0.8;
    if (W.units.some(o => o.alive && o !== t && o.side !== u.side && !isFar(o) && gap(u, o) < Math.max(u.rng, o.rng) + 0.4)) v -= 0.8;
  }""")
rep(T,"const chargeOk = (W, u, t) =>","const gauntlet = (W, u, t) => W.units.filter(o => o.alive && o !== t && o.side !== u.side && !isFar(o) && !o.down && !o.crawl && dist(o, t) > 2.2 && segD(u, t.x, t.y, o) < o.rng + o.r + u.r + 0.2).length;   // v6.4.1 가는 길목에서 칠 수 있는 상대 (도착 자리 둘레 말고)\nconst chargeOk = (W, u, t) =>")
# ---- 4) 투창 판단 ----
rep(T,"""    if (p >= th && worth && sc > bs){ bs = sc; best = f; }""","""    if (!ordered && u.side === 1 && !AI6.includes('javx')){   // v6.4.1 하나뿐인 창: 곁에 나를 칠 놈이 있거나 · 붙어서 압박 중이거나 · 다쳤으면 확실히 끝낼 때만
      const near = W.units.find(x => x.alive && x !== f && x.side !== u.side && !isFar(x) && !x.down && gap(u, x) < x.rng + 1.2), press = busyW(W, u), hurt = u.hp / u.max < 0.4;
      const fin = p >= 0.75 && pHp(W, 1, f) * iRec(W, 1, f).guess <= u.atk * (J.mul || 2.2) * (W.rules.lethal || 1) * 0.6;
      if ((near || press || hurt) && !fin){ if (W.t >= (u.javHoldT || 0)){ u.javHoldT = W.t + 5; L(W, { k: 'javHold', a: u.i, b: f.i, why: near ? (near.name + '이(가) 곁에 있음 — 가까운 위협 먼저') : press ? '붙어서 압박 중 — 긴 무기를 버리지 않음' : '다친 몸 — 무기를 지킴', vis: u.side === 0 || !!u.seenBy }); } continue; }
    }
    if (p >= th && worth && sc > bs){ bs = sc; best = f; }""")
# ---- 2) 궁수진 보호 · 3) 호위 · 가까운 위협 먼저 (planMoves) ----
rep(T,"""  const C = mine.filter(u => u.cmd && !u.down && W.t >= u.proneT).sort((a, b) => b.cmd - a.cmd)[0]; if (!C) return;
  const cap = 1 + C.cmd;""","""  // v6.4.1 본능: 궁수 흩어짐 — 넓게 휘두르는 거구가 다가오면 붙어 선 사수끼리 서로 다른 쪽으로 (한 번 휘두름에 둘이 걸리지 않게)
  for (const a of mine){ if (AI6.includes('scat') || !isFar(a) || !mvFree(W, a) || W.t < (a.scatT || 0)) continue;
    const G = known.find(g => g.canSweep && !g.down && !g.crawl && gap(a, g) < g.rng + 3.2 && ((g.act && g.act.k === 'charge') || gap(a, g) < g.rng + 1.6 || (Math.hypot(g.vx || 0, g.vy || 0) > 0.3 && (g.vx || 0) * (a.x - g.x) + (g.vy || 0) * (a.y - g.y) > 0)));
    if (!G) continue; const b = mine.find(o => o !== a && o.alive && isFar(o) && dist(o, a) < 2.8); if (!b) continue;
    const d1 = dist(a, G) || 1, d2 = dist(a, b) || 1, vx = (a.x - G.x) / d1 + (a.x - b.x) / d2 * 0.9, vy = (a.y - G.y) / d1 + (a.y - b.y) / d2 * 0.9, a0 = Math.atan2(vy, vx);
    let p = null; for (const da of [0, 0.6, -0.6, 1.1, -1.1]){ const x = a.x + Math.cos(a0 + da) * 2.2, y = a.y + Math.sin(a0 + da) * 2.2; if (x > 0.7 && y > 0.7 && x < W.map.W - 0.7 && y < W.map.H - 0.7 && !boxRock(W, x, y, a.r)){ p = { x, y }; break; } }
    if (!p) continue; a.mv = { k: 'scatter', x: p.x, y: p.y, b: G.i, run: true, until: W.t + 1.6 }; a.scatT = W.t + 3;
    L(W, { k: 'mvr', side: 1, m: 'scatter', a: a.i, b: G.i, c: b.i, obs: !!a.seenBy, vis: true }); }
  // v6.4.1 본능: 가까운 위협 먼저 — 나를 노려 붙은 놈이 있는데 먼 표적을 쫓으면 등을 보임
  for (const u of mine){ if (AI6.includes('nearf') || isFar(u) || !mvFree(W, u) || W.t < (u.nearT || 0) || !u.target || !u.target.alive || gap(u, u.target) < u.rng + 0.4) continue;
    const x = known.find(f => f !== u.target && !f.down && !isFar(f) && gap(u, f) < Math.max(f.rng, u.rng) + 0.3 && (f.target === u || focusOf(W, f) === u || (f.act && f.act.b === u.i))); if (!x) continue;
    u.mv = { k: 'near', b: x.i, until: W.t + 2.5 }; u.nearT = W.t + 4;
    L(W, { k: 'mvr', side: 1, m: 'near', a: u.i, b: x.i, c: u.target.i, obs: !!u.seenBy, vis: true }); }
  const C = mine.filter(u => u.cmd && !u.down && W.t >= u.proneT).sort((a, b) => b.cmd - a.cmd)[0]; if (!C) return;
  const cap = 1 + C.cmd;""")
rep(T,"""  // 포위 사냥
  const sT = W.surT || (W.surT = {});""","""  // v6.4.1 거구와 궁수 사이를 막음: 성한 근접 동료 (방패 먼저) 가 거구 앞 · 궁수 쪽으로 들어가 붙듦
  for (const a of mine){ if (used >= cap) return; if (AI6.includes('intp') || !isFar(a)) continue;
    const G = known.find(g => (g.canSweep || g.giant) && !g.down && !g.crawl && gap(a, g) < g.rng + 4 && !mine.some(m => m.mv && m.mv.k === 'interpose' && m.mv.b === g.i && W.t < m.mv.until)); if (!G) continue;
    if (mine.some(m => m !== a && !isFar(m) && dist(m, G) < dist(a, G) && segD(G, a.x, a.y, m) < m.r + G.r * 0.6)) continue;   // 이미 누가 사이에 섬
    const m = mine.filter(x => x !== a && mvFree(W, x) && !isFar(x) && !x.giant && !busyW(W, x) && x.hp / x.max > 0.4 && dist(x, a) < 5.5).sort((p, q) => ((q.shield || q.armShield) ? 1 : 0) - ((p.shield || p.armShield) ? 1 : 0) || dist(p, a) - dist(q, a))[0]; if (!m) continue;
    m.mv = { k: 'interpose', b: G.i, c: a.i, run: true, until: W.t + 2.5 }; used++;
    L(W, { k: 'mvr', side: 1, m: 'interpose', a: m.i, b: G.i, c: a.i, obs: !!(m.seenBy || G.side === 0), vis: true }); }
  // v6.4.1 호위: 뒷줄 (사수 · 구급) 을 노리는 근접이 다쳤거나 길목에 칠 놈이 있으면 방패 동료를 앞세워 함께 접근 — 방패가 없으면 가까운 놈부터
  for (const u of mine){ if (used >= cap) return; const t = u.target; if (AI6.includes('esc') || !t || !t.alive || t.down || isFar(u) || u.line || !mvFree(W, u) || gap(u, t) < 2.5) continue;
    if (!(isFar(t) || iRec(W, 1, t).tags.includes('구급'))) continue; const gt = gauntlet(W, u, t); if (!(u.hp / u.max < 0.6 || gt >= 1)) continue;
    const s = mine.filter(x => x !== u && mvFree(W, x) && (x.shield || x.armShield || (x.bodyShield && !x.giant)) && !busyW(W, x) && x.hp / x.max > 0.5 && dist(x, u) < 5).sort((p, q) => dist(p, u) - dist(q, u))[0];
    if (s){ s.mv = { k: 'lead', b: t.i, c: u.i, until: W.t + 4 }; u.mv = { k: 'follow', b: t.i, c: s.i, until: W.t + 4 }; used += 2;
      L(W, { k: 'mvr', side: 1, m: 'escort', a: s.i, b: t.i, c: u.i, why: u.hp / u.max < 0.6 ? '다친 몸 (' + Math.round(u.hp / u.max * 100) + '%)' : '길목에 ' + gt + '명', obs: !!(s.seenBy || u.seenBy), vis: true }); continue; }
    if (u.hp / u.max < 0.5 || gt >= 2){ const x = known.filter(f => f !== t && !f.down && !isFar(f) && dist(f, u) < 3.5).sort((p, q) => dist(p, u) - dist(q, u))[0];
      if (x && W.t >= (u.nearT || 0)){ u.mv = { k: 'near', b: x.i, until: W.t + 2.5 }; u.nearT = W.t + 4; L(W, { k: 'mvr', side: 1, m: 'near', a: u.i, b: x.i, c: t.i, why: '앞세울 방패가 없음', obs: !!u.seenBy, vis: true }); } } }
  // 포위 사냥
  const sT = W.surT || (W.surT = {});""")
# mvStep: 새 기동
rep(T,"""  if (M.k === 'cover'){ if (!T || !T.alive || T.down || gap(u, T) < u.rng + 0.3){ u.mv = null; return false; }""","""  if (M.k === 'near'){ if (!T || !T.alive || T.down){ u.mv = null; return false; } u.target = T; u.state = 'hunt'; return false; }   // 표적만 바꾸고 싸움은 그대로
  if (M.k === 'interpose'){ const A = W.units[M.c]; if (!T || !T.alive || T.down || !A || !A.alive){ u.mv = null; return false; }
    if (gap(u, T) < u.rng + 0.3){ u.mv = null; u.target = T; u.state = 'hunt'; return false; }   // 맞닿음 → 붙들고 싸움
    const d = dist(A, T) || 1, k = Math.min(1.6, Math.max(0.9, d / 2)), x = A.x + (T.x - A.x) / d * k, y = A.y + (T.y - A.y) / d * k;
    setMood(W, u, '사이를 막음 — ' + A.name + ' 앞', T.i); if (Math.hypot(x - u.x, y - u.y) < 0.3){ stop(u); u.fg = Math.atan2(T.y - u.y, T.x - u.x); } else goTo(W, u, x, y, dt); return true; }
  if (M.k === 'lead'){ if (!T || !T.alive || T.down || W.units.some(f => f.alive && f.side !== u.side && gap(u, f) < Math.max(isFar(f) ? 0.3 : f.rng, u.rng) + 0.4)){ u.mv = null; return false; }
    setMood(W, u, '호위 — 앞장섬', T.i); goTo(W, u, T.x, T.y, dt); return true; }
  if (M.k === 'follow'){ const S2 = W.units[M.c]; if (!T || !T.alive || T.down || !S2.alive || !mvOn(W, S2) || gap(u, T) < u.rng + 0.5){ u.mv = null; return false; }
    const d = dist(S2, T) || 1, x = S2.x - (T.x - S2.x) / d * 1.2, y = S2.y - (T.y - S2.y) / d * 1.2; setMood(W, u, '호위 — ' + S2.name + ' 뒤', T.i); goTo(W, u, x, y, dt); return true; }
  if (M.k === 'cover'){ if (!T || !T.alive || T.down || gap(u, T) < u.rng + 0.3){ u.mv = null; return false; }""")
rep(T,"""  setMood(W, u, M.k === 'swap' ? '교대 — 물러남' : M.k === 'drag' ? '끌고 감' : '총구를 피함', T ? T.i : null);
  const back = M.k !== 'jink' && T && T.alive;""","""  setMood(W, u, M.k === 'swap' ? '교대 — 물러남' : M.k === 'drag' ? '끌고 감' : M.k === 'scatter' ? '흩어짐 — 거구를 피해' : '총구를 피함', T ? T.i : null);
  if (M.k === 'scatter'){ goTo(W, u, M.x, M.y, dt); return true; }
  const back = M.k !== 'jink' && T && T.alive;""")
rep(T,"const MV_ORG = ['surround', 'swap', 'cover', 'feint'];","const MV_ORG = ['surround', 'swap', 'cover', 'feint', 'interpose', 'lead', 'follow'];")
rep(T,"module.exports = { planMoves,","module.exports = { directSpot, gauntlet, planMoves,")
