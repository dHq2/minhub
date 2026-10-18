# v7.15.0 엔진 — patch715.py v1.3 (v1.3: ③ 팜 버스트 · 돌진도 우회 · v1.2: ② 지시 길 · 함께 외침 기록 (ordFx) · v1.1: 사수 회피 — 맞붙으면 안 물러남 (contact) · 가까우면 보며 뒷걸음 (runG))
# ① 회피기동: 아군 사수 · 기동 사수 (쏘고 물러남 · 도약) · 기동 근접 [회피X] (흘려 빠지기 · 포위 빠지기) — 아군 · 적 같은 규칙 (적 사수의 쏘고 물러남은 지휘 쪽 본능 그대로)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "  leap: { dist: 1.7,", """  // v7.15 회피기동: kite = 사수 (trig 칸 안에서 나를 노리는 근접 → 쏜 다음 step 칸 물러남 · close 칸 안이면 쏘기 전에도 · dur 초 · stuck 초 동안 거리가 안 벌어지면 rest 초 동안 그 자리에서 쏨 · contact 칸 안 (맞붙음) 이면 안 물러남 · runG 칸 안이면 상대를 보며 뒷걸음)
  //   slip = [회피X] 근접 (나를 노린 일격 준비를 등급만큼 read 로 읽고 남은 시간 min 초 넘으면 손 밖 옆 · 뒤로 빠짐 · 근접 crowd 넘게 crowdR 칸 안에서 노리면 빈 쪽으로 빠짐 — crowdCd 초마다)
  evadeMv: { on: true, kite: { trig: 3, close: 2.4, step: 2.2, dur: 0.9, stuck: 2.5, rest: 6, contact: 0.7, runG: 1.6 }, slip: { read: { S: 0.95, A: 0.8, B: 0.6, C: 0.4 }, min: 0.12, pad: 0.35, crowd: 2, crowdR: 2, crowdCd: 3, step: 2 } },
  leap: { dist: 1.7,""")
wr('rt3_head.js', h)

s = rd('rt3_tail.js')
s = rep(s, "  if (u.side === 0 && u.order){ doOrder(W, u, dt); return; }\n",
        "  if (evadeMove(W, u, dt)) return;   // v7.15 회피기동 (사수 · 기동 근접)\n  if (u.side === 0 && u.order){ doOrder(W, u, dt); return; }\n")
s = rep(s, "function act2(W, u, dt){\n", r"""/* ---------- v7.15 회피기동 (아군 · 적 같은 규칙) ----------
   사수 · 기동 사수: 근접이 나를 노리고 trig 칸 안으로 오면 쏜 다음 step 칸씩 물러남 (동료 쪽 · 다른 근접 손 닿는 곳은 피함) — 코앞 (close) 이면 쏘기 전에도 · 도약이 있으면 뒤로 뜀.
     사이에 근접 동료가 막아 주면 그 자리에서 쏨 · 물러나도 거리가 안 벌어지면 (stuck 초) 그만두고 rest 초 동안 그 자리에서 쏨. 적 사수는 같은 본능을 지휘 쪽 (궁수 카이팅) 에서 씀.
   기동 근접 [회피X] (청광묵): ① 흘려 빠지기 — 나를 노린 근접의 일격 준비를 보면 (등급만큼 읽음 · 왼눈 사각은 못 봄) 그 손 밖 옆 · 뒤 (상대 등 쪽) 로 빠짐 (도약이 있으면 뜀) →
     일격이 떨어질 때까진 그 손 안으로 다시 안 들어가고, 떨어진 뒤 그 상대를 침 (빈틈). ② 포위 빠지기 — 근접 crowd 넘게 crowdR 칸 안에서 나를 노리면 적이 적은 쪽으로 빠져나감.
   명령: '제자리' · 이동 · 급한 (연달아 준) 명령 중엔 안 함 — ① 은 공격 · 팜 버스트 명령 중에도 (피하고 다시 들어감) */
const EVM = W => W.rules.evadeMv || {};
const evGrade = u => u.evG !== undefined ? u.evG : (u.evG = ((u.traits || []).find(t => /^회피[SABC]$/.test(t)) || '').slice(-1));
function evadeMove(W, u, dt){
  const E = EVM(W); if (!E.on || AI6.includes('evm') || u.act || u.lie || u.crawl || u.down || u.kb || W.t < u.proneT) return false;
  const o = u.order, free = !o || (o.k === 'attack' && !o.now);
  if (u.mv && (u.mv.k === 'kite' || u.mv.k === 'slip' || u.mv.k === 'out') && W.t < u.mv.until && u.mv.ev){   // 하던 회피를 이어 감
    if (Math.hypot(u.mv.x - u.x, u.mv.y - u.y) > 0.12){ setMood(W, u, u.mv.m, u.mv.b); goTo(W, u, u.mv.x, u.mv.y, dt); return true; }
    u.mv = null; stop(u); }
  const seen = f => f.alive && !f.down && !f.crawl && f.side !== u.side && canSee(W, u, f);   // 내 눈으로 본 상대만
  if (isFar(u)) return u.side === 0 && free && kiteMove(W, u, dt, seen);
  if (evGrade(u) && (!o || ['attack', 'palm'].includes(o.k)) && !(o && o.now)) return slipMove(W, u, dt, seen, free);
  return false;
}
const evLog = (W, u, f, m, ex) => L(W, { k: 'evade', a: u.i, b: f ? f.i : null, m, ...(ex || {}), vis: u.side === 0 || !!u.seenBy });
function kiteMove(W, u, dt, seen){
  const K = EVM(W).kite || {}, mates = W.units.filter(m => m.alive && m !== u && m.side === u.side && !m.down);
  const x = W.units.filter(f => seen(f) && !isFar(f) && gap(u, f) < (K.trig || 3) && (f.target === u || (f.act && f.act.b === u.i) || focusOf(W, f) === u)).sort((p, q) => gap(u, p) - gap(u, q))[0];
  if (!x || W.t < (u.kiteNo || 0) || cornered(W, u)) return false;
  if (mates.some(m => !isFar(m) && dist(m, x) < dist(u, x) && segD(x, u.x, u.y, m) < m.r + x.r)) return false;   // 사이에 근접 동료가 막아 줌 → 그 자리에서 쏨
  const g = gap(u, x), close = g < (K.close || 2.4), shot = (u.lastFireT != null ? u.lastFireT : -9) > (u.kiteT0 != null ? u.kiteT0 : -9);
  if (!close && !shot) return false;   // 쏜 다음에 물러남
  if (u.canLeap && W.t >= u.leapCd && g < ((W.rules.leap || {}).near || 2.2) && startLeap(W, u, x)){ u.kiteT0 = W.t; evLog(W, u, x, 'leap'); return true; }
  if (g < (K.contact != null ? K.contact : 0.7)) return false;   // 이미 맞붙음 — 등을 보이면 맞음 (그 자리에서 쏨 · 싸움)
  const B = u.kvBk && u.kvBk.b === x.i && W.t - u.kvBk.t1 < 1.5 ? u.kvBk : (u.kvBk = { b: x.i, t0: W.t, g0: g, t1: W.t }); B.t1 = W.t;
  if (W.t - B.t0 > (K.stuck || 2.5) && g < B.g0 + 0.8){ u.kvBk = null; u.kiteNo = W.t + (K.rest || 6); evLog(W, u, x, 'stuck'); return false; }   // 같은 걸음으로 따라붙음 → 그 자리에서 쏨
  const mc = mates.filter(m => !isFar(m)), base = Math.atan2(u.y - x.y, u.x - x.x), st = K.step || 2.2; let best = null, bs = -1e9;
  for (const da of [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = u.x + Math.cos(ang) * st, py = u.y + Math.sin(ang) * st;
    if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, u.r) || !fatClear(W.map, u.x, u.y, px, py, u.r * 0.8)) continue;
    if (W.units.some(f => seen(f) && !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - u.r < f.rng + 1.2)) continue;
    const sc = -Math.abs(da) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (sc > bs){ bs = sc; best = { x: px, y: py }; } }
  if (!best) return false;
  const rn = g > (K.runG != null ? K.runG : 1.6);   // 가까우면 상대를 보며 뒷걸음 (등을 안 보임) · 여유가 있으면 뜀
  u.mv = { k: 'kite', ev: true, x: best.x, y: best.y, b: x.i, run: rn, until: W.t + (K.dur || 0.9), m: rn ? '거리 벌림 — 쏘고 물러남' : '거리 벌림 — 보며 뒷걸음' }; u.kiteT0 = W.t;
  if (W.t >= (u.kiteLogT || 0)){ u.kiteLogT = W.t + 4; evLog(W, u, x, 'kite'); }
  setMood(W, u, u.mv.m, x.i); goTo(W, u, best.x, best.y, dt); return true;
}
function slipMove(W, u, dt, seen, free){
  const S = EVM(W).slip || {}, rdP = (S.read || {})[evGrade(u)] || 0, LP = W.rules.leap || {};
  // ① 흘려 빠지기: 나를 노린 일격 준비 (넓게 휘두르기는 부채꼴 안이면)
  for (const x of W.units){
    if (!seen(x) || isFar(x) || !x.act || x.act.phase !== 'wind' || !['atk', 'bash'].includes(x.act.k)) continue;
    const A = x.act, reach = (A.k === 'bash' ? 0.35 : (x.rng || 0.5)) + W.rules.reach, sweep = A.mode === 'sweep';
    if (!(A.b === u.i || (sweep && gap(u, x) < reach + 0.2))) continue;
    const left = A.end - W.t; if (left < (S.min || 0.12) || gap(u, x) > reach + 0.3) continue;
    const key = x.i + ':' + A.t0; if (u.slipKey === key) continue; u.slipKey = key;   // 한 일격에 한 번만 읽음
    if (W.rand() >= rdP) continue;   // 못 읽음 (등급)
    const fa = x.face != null ? x.face : Math.atan2(u.y - x.y, u.x - x.x), R1 = x.r + u.r + reach + (S.pad || 0.35), canL = u.canLeap && W.t >= u.leapCd;
    const lim = canL ? (LP.dist || 1.7) + 0.1 : Math.max(0.5, spdNow(W, u) * (W.rules.run || 1.3) * left * 0.95);
    let best = null, bs = -1e9;
    for (const ra of [1.6, -1.6, 2.1, -2.1, 2.6, -2.6, 1.1, -1.1]){ const ang = fa + ra, px = x.x + Math.cos(ang) * R1, py = x.y + Math.sin(ang) * R1, l = Math.hypot(px - u.x, py - u.y);
      if (l > lim || px < 0.6 || py < 0.6 || px > W.map.W - 0.6 || py > W.map.H - 0.6 || boxRock(W, px, py, u.r) || !fatClear(W.map, u.x, u.y, px, py, u.r * 0.7)) continue;
      if (W.units.some(f => f !== x && f !== u && f.alive && Math.hypot(f.x - px, f.y - py) < f.r + u.r + (f.side !== u.side && !isFar(f) ? f.rng + 0.3 : 0.05))) continue;
      const sc = Math.abs(ra) * 0.5 - l * 0.6; if (sc > bs){ bs = sc; best = { x: px, y: py, back: Math.abs(ra) > 2 }; } }
    if (!best){ const p = fallbackPt(W, u, x, R1 - gap(u, x) + 0.2); if (p && Math.hypot(p.x - u.x, p.y - u.y) <= lim) best = { x: p.x, y: p.y, back: false }; }
    if (!best) continue;
    u.dodgeHold = { a: x.i, until: A.end + 0.1 };   // v7.13 일격이 떨어질 때까진 그 손 안으로 다시 안 들어감
    if ((free && u.side === 0) || u.side === 1){ u.target = x; u.state = u.side ? 'hunt' : 'fight'; }   // 떨어진 뒤 그 상대를 침 (빈틈)
    u.slipPun = { b: x.i, t: A.end };
    if (canL && leapTo(W, u, best.x, best.y, 'side', x, best.back ? '흘려 빠지기 — 등 쪽으로' : '흘려 빠지기 — 손 밖 옆으로')){ evLog(W, u, x, 'slip', { leap: true, back: best.back, left: +left.toFixed(2) }); return true; }
    u.mv = { k: 'slip', ev: true, x: best.x, y: best.y, b: x.i, run: true, until: W.t + left + 0.05, m: '흘려 빠지기' };
    evLog(W, u, x, 'slip', { back: best.back, left: +left.toFixed(2) }); setMood(W, u, u.mv.m, x.i); goTo(W, u, best.x, best.y, dt); return true;
  }
  // ② 포위 빠지기
  if (!free || W.t < (u.crowdT || -9)) return false;
  const th = W.units.filter(f => seen(f) && !isFar(f) && gap(u, f) < (S.crowdR || 2) && (f.target === u || (f.act && f.act.b === u.i) || focusOf(W, f) === u));
  if (th.length < (S.crowd || 2)) return false;
  u.crowdT = W.t + (S.crowdCd || 3);
  const foes = W.units.filter(f => seen(f)), st = S.step || 2; let best = null, bs = -1e9;
  for (let k = 0; k < 12; k++){ const ang = k * Math.PI / 6, px = u.x + Math.cos(ang) * st, py = u.y + Math.sin(ang) * st;
    if (px < 0.7 || py < 0.7 || px > W.map.W - 0.7 || py > W.map.H - 0.7 || boxRock(W, px, py, u.r) || !fatClear(W.map, u.x, u.y, px, py, u.r * 0.7)) continue;
    if (foes.some(f => !isFar(f) && Math.hypot(f.x - px, f.y - py) - f.r - u.r < f.rng + 0.4)) continue;
    const sc = Math.min(...foes.map(f => Math.hypot(f.x - px, f.y - py))) + W.units.filter(m => m.alive && m.side === u.side && m !== u && Math.hypot(m.x - px, m.y - py) < 3).length * 0.4; if (sc > bs){ bs = sc; best = { x: px, y: py }; } }
  if (!best) return false;
  if (u.canLeap && W.t >= u.leapCd && leapTo(W, u, best.x, best.y, 'side', th[0], '포위 빠지기 — 빈 쪽으로')){ evLog(W, u, th[0], 'out', { n: th.length, leap: true }); return true; }
  u.mv = { k: 'out', ev: true, x: best.x, y: best.y, b: th[0].i, run: true, until: W.t + 1.2, m: '포위 빠지기' }; evLog(W, u, th[0], 'out', { n: th.length });
  setMood(W, u, u.mv.m, th[0].i); goTo(W, u, best.x, best.y, dt); return true;
}
function act2(W, u, dt){
""")
s = rep(s, "cmdLinkM: cmdLink, ffOdds", "cmdLinkM: cmdLink, ffOdds, evadeMove, kiteMove, slipMove")
wr('rt3_tail.js', s)
print('patch715 ① 회피기동 OK')

# ---------- ② 지시가 거쳐 간 길 · 함께 외침 (화면의 지시 점) ----------
s = rd('rt3_tail.js')
s = rep(s, """    for (const m of cand){
      if (got.has(m.i) || tried.has(s.u.i + '>' + m.i)) continue;
      const l = leg(s.u, m, s.hop > 0);""", """    const sr = best.get(s.u.i);
    for (const m of cand){
      if (m === s.u || tried.has(s.u.i + '>' + m.i)) continue;
      const done = got.get(m.i); if (done && ((done.alt || []).length >= 3 || (sr && (sr.from === m.i || sr.chain.includes(m.i))))) continue;   // v7.15 이미 받은 이에게도 같이 외침 (함께 외침 · 3까지) — 내게 전해 준 이에겐 안 되외침
      const l = leg(s.u, m, s.hop > 0);""")
s = rep(s, """      if (W.rand() < p){ const t = s.t + l.t + (s.hop > 0 ? (hopT + (s.hop > 1 ? (X.hop2T != null ? X.hop2T : 0.05) : 0)) * Math.max(0.4, 1 - (X.relayFast != null ? X.relayFast : 0.12) * (s.u.cmd || 0)) : 0), cur = best.get(m.i);
        if (!cur || t < cur.t){ const r = { t, hop: s.hop + 1, via: s.hop === 0 ? l.via : 'relay', chain: s.hop === 0 ? [] : s.chain.concat([s.u.i]), from: s.u.i, p }; best.set(m.i, r); Q.push({ u: m, t, hop: s.hop + 1, chain: r.chain }); } } } }""",
"""      if (W.rand() < p){ const t = s.t + l.t + (s.hop > 0 ? (hopT + (s.hop > 1 ? (X.hop2T != null ? X.hop2T : 0.05) : 0)) * Math.max(0.4, 1 - (X.relayFast != null ? X.relayFast : 0.12) * (s.u.cmd || 0)) : 0), cur = best.get(m.i);
        if (done){ if (t > done.t) (done.alt || (done.alt = [])).push({ from: s.u.i, tf: s.t, t }); continue; }
        if (!cur || t < cur.t){ const r = { t, hop: s.hop + 1, via: s.hop === 0 ? l.via : 'relay', chain: s.hop === 0 ? [] : s.chain.concat([s.u.i]), from: s.u.i, tf: s.t, p, alt: cur ? [{ from: cur.from, tf: cur.tf, t: cur.t }, ...(cur.alt || [])].slice(0, 3) : [] }; best.set(m.i, r); Q.push({ u: m, t, hop: s.hop + 1, chain: r.chain }); }
        else if ((cur.alt || (cur.alt = [])).length < 3) cur.alt.push({ from: s.u.i, tf: s.t, t }); } } }""")
s = rep(s, """    const nm = i => W.units[i].name;
    return { p: Math.max(a.p, r.p), t: r.t, via: r.via,""", """    const nm = i => W.units[i].name, nodes = [C.i, ...r.chain, u.i], tms = [0, ...r.chain.map(i => (got.get(i) || {}).t || 0), r.t];   // v7.15 거쳐 간 길 (다리마다 떠난 때 · 닿은 때) · 함께 외침
    const legs = nodes.slice(1).map((b, k) => [nodes[k], b, +tms[k].toFixed(2), +tms[k + 1].toFixed(2)]), echo = (r.alt || []).filter(e => e.t < r.t + 3).map(e => [e.from, u.i, +(e.tf || 0).toFixed(2), +e.t.toFixed(2)]);
    return { legs, echo, p: Math.max(a.p, r.p), t: r.t, via: r.via,""")
s = rep(s, "function cmdWave(W, C, list){\n", """// v7.15 화면의 지시 점: 받은 명령이 거쳐 간 길 (다리마다) · 같이 외친 동료 — 출처 (대장 · 편대장) 를 남김 (아군만 그림)
function ordFxAdd(W, u, lk, src, dep){
  if (!lk || !lk.ok || !lk.legs || !lk.legs.length) return;
  const F = W.ordFx || (W.ordFx = []), end = Math.max(...lk.legs.map(l => l[3]), ...(lk.echo || []).map(l => l[3]));
  F.push({ u: u.i, src, dep: !!dep, t0: W.t, legs: lk.legs, echo: lk.echo || [], end: W.t + end + 0.5 });
  if (F.length > 60) W.ordFx = F.filter(f => W.t < f.end).slice(-60);
}
function cmdWave(W, C, list){
""")
s = rep(s, "m.ordPend = { o: { k: 'attack', b: f.i, dep: D.i }, m2: lk.m2, at: W.t + lk.t, ok: lk.ok, hop: lk.hop, p: lk.p, via: lk.via, why: lk.why, c: D.i, m: lk.m, t0: W.t }; }); }",
        "m.ordPend = { o: { k: 'attack', b: f.i, dep: D.i }, m2: lk.m2, at: W.t + lk.t, ok: lk.ok, hop: lk.hop, p: lk.p, via: lk.via, why: lk.why, c: D.i, m: lk.m, t0: W.t, legs: !!lk.legs }; ordFxAdd(W, m, lk, D.i, true); }); }   // v7.15 편대장의 지시 점")
s = rep(s, "    u.posPend.push({ key, val, at: W.t + lk.t, ok: lk.ok !== undefined ? lk.ok : W.rand() < lk.p, p: lk.p, via: lk.via, why: lk.why, c: lk.c, t0: W.t });",
        "    u.posPend.push({ key, val, at: W.t + lk.t, ok: lk.ok !== undefined ? lk.ok : W.rand() < lk.p, p: lk.p, via: lk.via, why: lk.why, c: lk.c, t0: W.t }); if (C) ordFxAdd(W, u, lk, C.i, false);   // v7.15")
s = rep(s, "    const lk = rw[rl.indexOf(u)]; if (lk.ok){ u.rally = { x: px, y: py, t0: W.t + lk.t, until: W.t + (R.hold || 20), by: C.i }; got.push(u.i); } else miss.push(u.i); }",
        "    const lk = rw[rl.indexOf(u)]; if (lk.ok){ u.rally = { x: px, y: py, t0: W.t + lk.t, until: W.t + (R.hold || 20), by: C.i }; got.push(u.i); ordFxAdd(W, u, lk, C.i, false); } else miss.push(u.i); }")
s = rep(s, "cmdLinkM: cmdLink, ffOdds, evadeMove,", "cmdLinkM: cmdLink, ffOdds, ordFxAdd, evadeMove,")
wr('rt3_tail.js', s)
print('patch715 ② 지시 길 OK')

# ---------- ③ 팜 버스트 · 돌진도 우회 ----------
s = rd('rt3_tail.js')
s = rep(s, "  const t = o.k === 'attack' ? W.units[o.b] : null, d = Math.hypot(u.x - o.via.x, u.y - o.via.y);",
        "  const t = ['attack', 'palm', 'charge'].includes(o.k) && o.b != null ? W.units[o.b] : null, d = Math.hypot(u.x - o.via.x, u.y - o.via.y), nearT = o.k === 'charge' ? 1.6 : 2.5;   // v7.15 팜 버스트 · 돌진도 우회 (돌진은 돌진 거리 안쪽까지만 붙어도 돌아감)")
s = rep(s, "  const done = d < 0.7 ? '닿음' : t && (!t.alive || gap(u, t) < 2.5) ? '노린 적이 가까움'", "  const done = d < 0.7 ? '닿음' : t && (!t.alive || gap(u, t) < nearT) ? '노린 적이 가까움'")
s = rep(s, "  if (o.via && !o.viaOK && (o.k === 'move' || o.k === 'amove' || o.k === 'attack') && viaStep(W, u, o, dt)) return;   // v7.12 우회 경유점",
        "  if (o.via && !o.viaOK && ['move', 'amove', 'attack', 'palm', 'charge'].includes(o.k) && viaStep(W, u, o, dt)) return;   // v7.12 우회 경유점   // v7.15 팜 버스트 · 돌진도")
wr('rt3_tail.js', s)
print('patch715 ③ 우회 확장 OK')
