# v7.12.0 엔진 — patch712.py v1
# 포복 v2 (빨리 일어남 · 카리우스 못 엎드림 · 스스로 엎드림 양쪽) · 곡사 면 제압 · 청광묵 돌격 · 측후방 도약 · 우회 경유점
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

# ---------- head ----------
h = rd('rt3_head.js')
h = rep(h, "  lie: { down: 0.6, up: 0.9, upFast: 0.55, ", "  lie: { down: 0.6, up: 0.2, upFast: 0.15, arcR: 1.3, auto: { n: 2, win: 3, alone: 5, calm: 6, near: 4, no: 8, noGate: 4 }, ")
h = rep(h, "trample: { mass: 180, v: 0.8, cd: 1.5, k: 0.12 } },   // v7.11 포복 (엎드림): ",
        "trample: { mass: 180, v: 0.8, cd: 1.5, k: 0.12 } },   // v7.12 일어남은 순식간 (up · upFast) · [개조된 신체] 는 못 엎드림 · 스스로 엎드림 (auto): 곁 alone 칸 안에 동료가 없고 win 초 안에 n 발 넘게 날아와 스치거나 맞음 (쏜 자를 못 봄 · 총이면 엎드려 맞쏨) — 사격이 calm 초 멎으면 일어남 · 근접이 near 칸 안이면 안 엎드림 · 명령으로 일어나면 no 초 · 치려고 일어나면 noGate 초 동안은 스스로 안 엎드림 · 곡사가 떨어질 때 엎드린 몸은 위에서 넓음 (× arcR)   // v7.11 포복 (엎드림): ")
h = rep(h, "  leap: { dist: 1.7, time: 0.3, cd: 1.1, near: 2.2 },", "  leap: { dist: 1.7, time: 0.3, cd: 1.1, near: 2.2, flank: { cd: 3, chk: 0.4, ang: [1.9, 2.6] } },   // v7.12 flank = 측후방 도약: 나를 앞으로 보고 선 근접 상대의 옆 (ang[0] rad) · 뒤 (ang[1]) 로 뛰어 들어감 (cd 초마다 · chk 초마다 살핌)\n ")
h = rep(h, "ffWait: 3, est: [0.7, 1.3], lat: 1, incT: 6, ai: 1, cd: 4 },", "ffWait: 3, est: [0.7, 1.3], lat: 1, incT: 6, ai: 1, cd: 4, arcSpread: 1.0, arcSpreadD: 0.1, seen: 4, fireT: 8 },   // v7.12 활은 곡사 면 제압: 자리 둘레 arcSpread + 거리 × arcSpreadD 칸에 떨굼 — 든 방패는 머리 위를 못 막음 · 바위 너머는 못 넘김 · 적 지휘관은 날아온 쪽 말고도 숨은 사수 (fireT 초 안에 쏨) 의 seen 초 안에 정확히 안 자리에 시킴\n ")
i = h.index('\n  lie: { down:'); j = h.index('\n', i + 1)
h = h[:j] + "\n  detour: { min: 3, k: 0.45, max: 8, near: 3 },   // v7.12 우회 (Shift + 이동 · 공격): 곧장 가는 길에서 옆으로 길이 × k 칸 (min ~ max) 떨어진 경유점 — 아는 적이 적은 쪽 · 적에게서 먼 곳 · 갈 수 있는 곳 (1칸 = 1M)" + h[j:]
wr('rt3_head.js', h)

# ---------- tail ----------
s = rd('rt3_tail.js')

# 카리우스 (개조된 신체) 못 엎드림 · 명령 · 판단에 따른 스스로 엎드림 막기
s = rep(s, "  if (on){\n    if ((u.lie && !(u.lieSw && !u.lieSw.to)) || u.crawl || u.kb || (u.act && u.act.k === 'charge' && u.act.phase === 'run')) return false;",
        "  if (on){\n    if ((u.lie && !(u.lieSw && !u.lieSw.to)) || u.crawl || u.kb || u.modBody || (u.act && u.act.k === 'charge' && u.act.phase === 'run')) return false;   // v7.12 [개조된 신체] (카리우스) 는 몸 구조상 못 엎드림\n    if (why === '명령') u.lieAuto = null;")
s = rep(s, "    const sec = (u.cls === '기동' ? LL.upFast : LL.up) || 0.9;\n",
        "    const sec = (u.cls === '기동' ? LL.upFast : LL.up) || 0.2, AU = LL.auto || {};\n    u.lieNo = W.t + (why === '명령' ? AU.no || 8 : AU.noGate || 4); u.lieAuto = null;   // v7.12 일어난 뒤 한동안은 스스로 안 엎드림\n")
# 스스로 엎드림 · 사격이 멎으면 일어남
s = rep(s, "    if (t.lieSw || !roll) continue;\n    lieWatch(W, t, LL); if (t.lie && !t.lieSw) lieFeel(W, t, LL);\n  }\n}",
        """    if (t.lieSw || !roll) continue;
    lieWatch(W, t, LL); if (t.lie && !t.lieSw) lieFeel(W, t, LL);
    if (t.lie && !t.lieSw && t.lieAuto != null){ const P = t.fireP || [], last = Math.max(t.lieAuto, P.length ? P[P.length - 1].t : -9); if (W.t - last > ((LL.auto || {}).calm || 6)) lieSet(W, t, false, '사격이 멎음'); }   // v7.12
  }
  if (roll && LL.auto) for (const u of W.units) if (!u.lie && u.fireP && u.fireP.length) lieAutoChk(W, u, LL);   // v7.12 스스로 엎드림
}
// v7.12 스스로 엎드림 (양쪽 같음 · [개조된 신체] 빼고): 곁에 동료가 없는데 win 초 안에 n 발 넘게 날아와 스치거나 맞음 — 쏜 자를 못 봄 (어디선가) · 총이면 엎드려 맞쏨
function lieAutoChk(W, u, LL){
  const A = LL.auto || {}, P = u.fireP; while (P.length && W.t - P[0].t > (A.win || 3)) P.shift();
  if (P.length < (A.n || 2) || !u.alive || u.down || u.crawl || u.kb || u.act || u.modBody || W.t < (u.lieNo || -9) || W.t < u.proneT || W.t < (u.stunT || -9) || !lieOrdOK(W, u) || (u.order && (u.order.k === 'move' || u.order.k === 'amove'))) return;
  if (W.units.some(a => a !== u && a.alive && !a.down && a.side === u.side && dist(a, u) < (A.alone || 5))) return;   // 완전히 고립됐을 때만
  if (W.units.some(f => f.alive && !f.down && f.side !== u.side && !isFar(f) && dist(f, u) < (A.near || 4) && canSee(W, u, f))) return;   // 근접이 곁에 있으면 엎드리지 않음
  const unseen = P.some(p => !p.seen); if (!unseen && !gunOf(W, u)) return;
  if (lieSet(W, u, true, '고립 · 사격 집중' + (unseen ? ' (어디선가)' : ' — 엎드려 맞쏨'))) u.lieAuto = W.t;
}
// 날아온 탄 · 화살 (스침 · 맞음 · 곁에 떨어짐) 을 겪음 — 쏜 자를 보았나
function lieFire(W, b, s){ if (!b.alive || b.side === s.side) return; const a = W.units[s.a], P = b.fireP || (b.fireP = []); P.push({ t: W.t, seen: !!a && a.alive && canSee(W, b, a) }); if (P.length > 12) P.shift(); }""")
s = rep(s, "      if (nearL && !hit && SUP(W)) for (const b of nearL){ (s.nm || (s.nm = [])).push(b.i);",
        "      if (nearL && !hit && SUP(W)) for (const b of nearL){ lieFire(W, b, s); (s.nm || (s.nm = [])).push(b.i);")
s = rep(s, "        if (hit.side !== s.side){ incoming(W, hit, s);", "        if (hit.side !== s.side){ lieFire(W, hit, s); incoming(W, hit, s);")
# lieGate · lieFeel 로 일어난 뒤
s = rep(s, "function lieGate(W, u, why){ if (!u.lie) return false; if (!u.lieSw || u.lieSw.to) lieSet(W, u, false, why); return true; }",
        "function lieGate(W, u, why){ if (!u.lie) return false; if (!u.lieSw || u.lieSw.to) lieSet(W, u, false, why); return true; }   // (일어나면 lieNo 동안 스스로 안 엎드림)")

# 곡사가 떨어질 때: 곁에 떨어짐 = 겪음 · 면 제압 화살 · 엎드린 몸은 위에서 넓음
s = rep(s, """function landArc(W, s){
  const u = W.units[s.a], A = W.rules.arc || {};
  let hit = null;
  for (;;){ let hd = 1e9; hit = null;
    for (const b of W.units){ if (!b.alive || b.i === s.a || (s.ev && s.ev.includes(b.i))) continue; const d = Math.hypot(b.x - s.lx, b.y - s.ly); if (d <= b.r + 0.04 && d < hd){ hd = d; hit = b; } }""",
"""function landArc(W, s){
  const u = W.units[s.a], A = W.rules.arc || {};
  let hit = null;
  for (const b of W.units) if (b.alive && b.side !== s.side && Math.hypot(b.x - s.lx, b.y - s.ly) < b.r + 0.8) lieFire(W, b, s);   // v7.12 곁에 떨어짐도 겪음
  for (;;){ let hd = 1e9; hit = null;
    for (const b of W.units){ if (!b.alive || b.i === s.a || (s.ev && s.ev.includes(b.i))) continue; const d = Math.hypot(b.x - s.lx, b.y - s.ly), br = b.lie && !b.lieSw ? b.r * ((W.rules.lie || {}).arcR || 1) : b.r; if (d <= br + 0.04 && d < hd){ hd = d; hit = b; } }   // v7.12 엎드린 몸은 위에서 넓음""")
s = rep(s, "    if (!hit || !evadeShot(W, hit, s)) break; }   // v6.7 떨어지는 화살 · 창을 보고 비켜섬\n",
        """    if (!hit || !evadeShot(W, hit, s)) break; }   // v6.7 떨어지는 화살 · 창을 보고 비켜섬
  if (s.supp){   // v7.12 곡사 면 제압: 빈 바닥이면 둘레를 움찔 · 날아온 쪽을 앎. 맞으면 든 방패도 못 막음 (머리 위)
    if (!hit){ for (const b of W.units) if (b.alive && b.side !== s.side && Math.hypot(b.x - s.lx, b.y - s.ly) < b.r + ((SUP(W) || {}).near || 0.6)){ b.pinT = Math.max(b.pinT || 0, W.t + ((SUP(W) || {}).pin || 0.6)); incoming(W, b, s); } return; }
    if (hit.side !== s.side){ incoming(W, hit, s); if (s.so) s.so.hits = (s.so.hits || 0) + 1; }
    const o3 = strike(W, u, hit, hit, 0.9, true, { arc: true, over: true, mul: (A.mul != null ? A.mul : 0.85) });
    if (W.fxOn) W.fx.push({ k: 'stuck', b: hit.i, ang: Math.atan2(s.dy, s.dx), blk: !!(o3 && o3.block), top: true, t0: W.t, dur: 1.4 });
    return;
  }
""")
s = rep(s, "  if (arcX ? t.shield && guardOn(W, t) && W.rand() < (AR.shield != null ? AR.shield : 0.7) :",
        "  if (arcX ? !(extra && extra.over) && t.shield && guardOn(W, t) && W.rand() < (AR.shield != null ? AR.shield : 0.7) :")

# 견제사격: 활이면 곡사 면 제압
s = rep(s, "  fire(W, u); launchAt(W, u, A.px, A.py, A.so); A.so.left--; A.so.fired++;",
        "  fire(W, u); if (u.lob) launchArcAt(W, u, A.px, A.py, A.so); else launchAt(W, u, A.px, A.py, A.so); A.so.left--; A.so.fired++;   // v7.12 활 = 곡사 면 제압")
s = rep(s, "function suppStep(W, u, dt, o, end){",
        """// v7.12 곡사 면 제압: 그 자리 둘레에 높이 쏘아 떨굼 — 방패 너머 · 숨은 몸 (엎드림 · 은신) 을 노림, 화살 낭비를 감수
function launchArcAt(W, u, x, y, so){
  const SU = SUP(W) || {}, A = W.rules.arc || {}, wp = (W.rules.weapons || {})[u.weapon] || {}, d = Math.max(0.5, Math.hypot(x - u.x, y - u.y)), sp = (SU.arcSpread || 1) + (SU.arcSpreadD || 0.1) * d, a = W.rand() * 6.283, rr = Math.sqrt(W.rand()) * sp;
  const lx = Math.max(0.5, Math.min(W.map.W - 0.5, x + Math.cos(a) * rr)), ly = Math.max(0.5, Math.min(W.map.H - 0.5, y + Math.sin(a) * rr)), ll = Math.hypot(lx - u.x, ly - u.y) || 1, T = Math.max(0.1, ll / Math.max(1, (wp.vel || 16) * (A.vel || 0.55)));
  W.shots.push({ id: ++W.shotN, a: u.i, meant: null, x: u.x, y: u.y, x0: u.x, y0: u.y, dx: (lx - u.x) / ll, dy: (ly - u.y) / ll, lx, ly, T, el: 0, q: 0, arc: true, sp: 0, left: 0, p: 0, good: false, t0: W.t, side: u.side, mul: 1, pm: 1, supp: true, so });
}
function suppStep(W, u, dt, o, end){""")
s = rep(s, "  if (!o.on){ o.on = true; o.left = o.n || SU.n || 3; o.fired = 0; o.hits = 0; o.t0 = W.t; L(W, { k: 'supp', a: u.i, x: +o.x.toFixed(1), y: +o.y.toFixed(1), n: o.left, ai: !!o.ai, vis: u.side === 0 || !!u.seenBy }); }",
        "  if (!o.on){ o.on = true; o.left = o.n || SU.n || 3; o.fired = 0; o.hits = 0; o.t0 = W.t; L(W, { k: 'supp', a: u.i, x: +o.x.toFixed(1), y: +o.y.toFixed(1), n: o.left, ai: !!o.ai, arc: !!u.lob, hid: !!o.hid, vis: u.side === 0 || !!u.seenBy }); }")
s = rep(s, "  const ff = W.units.find(f => f.alive && f !== u && f.side === u.side && segDp(f, u.x, u.y, u.x + Math.cos(ang) * (d + (SU.over || 2)), u.y + Math.sin(ang) * (d + (SU.over || 2))) < f.r + 0.35);",
        "  if (u.lob && !losClear(W.map, u.x, u.y, o.x, o.y)){ fin('바위 너머는 못 넘김 (굴 천장)'); return; }   // v7.12\n  const ff = u.lob ? W.units.find(f => f.alive && f !== u && f.side === u.side && Math.hypot(f.x - o.x, f.y - o.y) < (SU.arcSpread || 1) + (SU.arcSpreadD || 0.1) * d + f.r + 0.3) : W.units.find(f => f.alive && f !== u && f.side === u.side && segDp(f, u.x, u.y, u.x + Math.cos(ang) * (d + (SU.over || 2)), u.y + Math.sin(ang) * (d + (SU.over || 2))) < f.r + 0.35);   // v7.12 곡사는 떨어질 둘레의 아군만")
# 적 지휘관: 날아온 쪽이 없어도 숨은 사수의 안 자리에 곡사 면 제압
s = rep(s, "  const rec = (W.inc || []).filter(r => r.side === 1 && W.t - r.t < 3); if (!rec.length) return;\n  const r = rec[rec.length - 1];",
        "  const rec = (W.inc || []).filter(r => r.side === 1 && W.t - r.t < 3), hs = rec.length ? null : suppHid(W); if (!rec.length && !hs) return;   // v7.12 숨은 사수의 안 자리\n  const r = rec[rec.length - 1];")
s = rep(s, "    const e = SU.est || [0.7, 1.3], dE = Math.max(2, Math.min(12, r.tr * (e[0] + W.rand() * (e[1] - e[0])))), lat = (W.rand() - 0.5) * 2 * (SU.lat || 1);\n    const x = Math.max(0.5, Math.min(W.map.W - 0.5, r.x + r.dx * dE - r.dy * lat)), y = Math.max(0.5, Math.min(W.map.H - 0.5, r.y + r.dy * dE + r.dx * lat));",
        "    if (hs && !u.lob) continue;   // 안 자리 면 제압은 곡사 (활) 만\n    const e = SU.est || [0.7, 1.3], dE = hs ? 0 : Math.max(2, Math.min(12, r.tr * (e[0] + W.rand() * (e[1] - e[0])))), lat = (W.rand() - 0.5) * 2 * (SU.lat || 1);\n    const x = hs ? Math.max(0.5, Math.min(W.map.W - 0.5, hs.x + (W.rand() - 0.5) * 0.8)) : Math.max(0.5, Math.min(W.map.W - 0.5, r.x + r.dx * dE - r.dy * lat)), y = hs ? Math.max(0.5, Math.min(W.map.H - 0.5, hs.y + (W.rand() - 0.5) * 0.8)) : Math.max(0.5, Math.min(W.map.H - 0.5, r.y + r.dy * dE + r.dx * lat));")
s = rep(s, "    if (W.rand() < lk.p) u.suppPend = { x, y, at: W.t + lk.t };", "    if (W.rand() < lk.p) u.suppPend = { x, y, at: W.t + lk.t, hid: !!hs };")
s = rep(s, "u.supp = { x: P.x, y: P.y, n: (SUP(W) || {}).n || 3, ai: true }; }", "u.supp = { x: P.x, y: P.y, n: (SUP(W) || {}).n || 3, ai: true, hid: !!P.hid }; }")
s = rep(s, "function suppAI(W){", """// v7.12 숨은 사수 (fireT 초 안에 쏨) 를 지금 아무도 못 보는데 seen 초 안에 정확히 안 자리 (총구 화염 · 놓치기 전 · 비명) — 적 지휘관의 곡사 면 제압
function suppHid(W){
  const SU = SUP(W) || {}; let best = null;
  for (const t of W.units){
    if (!t.alive || t.down || t.side !== 0 || !isFar(t) || W.t - (t.lastFireT == null ? -99 : t.lastFireT) > (SU.fireT || 8)) continue;
    if (W.units.some(e => e.alive && e.side === 1 && canSee(W, e, t))) continue;
    for (const e of W.units){ if (!e.alive || e.side !== 1) continue; const q = e.sense[t.i]; if (q && q.exact && W.t - q.t <= (SU.seen || 4) && (!best || q.t > best.t)) best = { x: q.x, y: q.y, t: q.t, b: t.i }; }
  }
  return best;
}
function suppAI(W){""")

# 청광묵 (기동 근접): 공격 명령이면 돌격을 아끼지 않음 · 팜 버스트하러 갈 때도
s = rep(s, "  if (u.canCharge && !isFar(u) && tryCharge(W, u, t, false, ordered)) return;",
        "  if (u.canCharge && !isFar(u) && tryCharge(W, u, t, !!ordered && u.cls === '기동', ordered)) return;   // v7.12 기동 근접 (청광묵) 은 공격 명령이면 돌격을 아끼지 않음 (먼 거리를 단숨에)")
s = rep(s, "    setMood(W, u, gap(u, t) < 0.8 ? '바싹 파고듦' : '팜 버스트하러', t.i); goTo(W, u, t.x, t.y, dt);",
        "    if (see && palmReady(W, u) && u.cls === '기동' && u.canCharge && tryCharge(W, u, t, true)) return;   // v7.12 팜 버스트하러 갈 때 돌격이 있으면 씀\n    setMood(W, u, gap(u, t) < 0.8 ? '바싹 파고듦' : '팜 버스트하러', t.i); goTo(W, u, t.x, t.y, dt);")

# 측후방 도약
s = rep(s, "    const op = openingOf(W, u, t);\n    const fin = u.role === '공격수'",
        "    const op = openingOf(W, u, t);\n    if (!op && flankLeap(W, u, t)) return;   // v7.12 측후방 도약\n    const fin = u.role === '공격수'")
s = rep(s, "    if (!u.order && pounce(W, u, t)) return;   // v6.7.4 앞으로 도약 (달아나는 사수 · 빈틈 · 넘어진 상대)",
        "    if (flankLeap(W, u, t)) return;   // v7.12 측후방 도약\n    if (!u.order && pounce(W, u, t)) return;   // v6.7.4 앞으로 도약 (달아나는 사수 · 빈틈 · 넘어진 상대)")
s = rep(s, "  if (g > want + 0.6){ setMood(W, u, '다가감', t.i); goTo(W, u, t.x, t.y, dt); return; }\n  footwork(W, u, t, dt, want);   // v5.2 발놀림 (서 있지 않음)",
        "  if (g > want + 0.6){ setMood(W, u, '다가감', t.i); goTo(W, u, t.x, t.y, dt); return; }\n  if (flankLeap(W, u, t)) return;   // v7.12 측후방 도약\n  footwork(W, u, t, dt, want);   // v5.2 발놀림 (서 있지 않음)")
s = rep(s, "const leapIn = (u, t) => {", """// v7.12 측후방 도약 (도약이 있는 근접): 나를 앞으로 보고 선 근접 상대의 옆 · 뒤로 뛰어 들어감 — 내려앉을 자리 둘레에 다른 적의 손이 닿으면 안 함
function flankLeap(W, u, t){
  const LP = W.rules.leap || {}, F = LP.flank; if (!F || !u.canLeap || isFar(u) || u.crawl || u.lie || u.kb || u.act || W.t < u.leapCd || W.t < (u.flankT || -9) || W.t < (u.flChk || -9) || AI6.includes('flank')) return false;
  u.flChk = W.t + (F.chk || 0.4);
  if (!t || !t.alive || t.down || isFar(t) || prone(W, t) || sideOf(W, t, u) !== 'front' || gap(u, t) > (LP.dist || 1.7) + 0.6) return false;
  const Dl = LP.dist || 1.7, rr = t.r + u.r + 0.12; let best = null, bs = -1e9;
  for (const a of F.ang || [1.9, 2.6]) for (const sg of [1, -1]){
    const ang = (t.face || 0) + sg * a, x = t.x + Math.cos(ang) * rr, y = t.y + Math.sin(ang) * rr, l = Math.hypot(x - u.x, y - u.y);
    if (l > Dl + 0.15 || l < 0.4 || boxRock(W, x, y, u.r * 0.9) || !fatClear(W.map, u.x, u.y, x, y, u.r * 0.6)) continue;
    if (W.units.some(f => f.alive && f !== t && f !== u && Math.hypot(f.x - x, f.y - y) < f.r + u.r + (f.side !== u.side && !isFar(f) ? f.rng + 0.3 : 0.05))) continue;
    const sc = (a > 2.2 ? 1 : 0.6) - l * 0.1; if (sc > bs){ bs = sc; best = { x, y, back: a > 2.2 }; }
  }
  if (!best) return false;
  u.flankT = W.t + (F.cd || 3);
  return leapTo(W, u, best.x, best.y, 'side', t, best.back ? '측후방 도약 — 뒤로 돌아 들어감' : '측후방 도약 — 옆으로 돌아 들어감');
}
const leapIn = (u, t) => {""")

# 우회: 경유점을 먼저
s = rep(s, "function doOrder(W, u, dt){\n  const o = u.order, foes = W.units.filter(f => f.alive && f.side !== u.side);\n",
        "function doOrder(W, u, dt){\n  const o = u.order, foes = W.units.filter(f => f.alive && f.side !== u.side);\n  if (o.via && !o.viaOK && (o.k === 'move' || o.k === 'amove' || o.k === 'attack') && viaStep(W, u, o, dt)) return;   // v7.12 우회 경유점\n")
s = rep(s, "/* ---------- v4.0 싸움: 발견 → 경계 → 기회가 있을 때 공격 ----------",
        """// v7.12 우회 (Shift + 이동 · 공격): 경유점까지 먼저 (가는 길엔 싸우지 않음) — 닿거나 · 노린 적이 2.5칸 안이거나 · 길이 없거나 · 25초가 지나면 본래 명령대로
function viaStep(W, u, o, dt){
  const t = o.k === 'attack' ? W.units[o.b] : null, d = Math.hypot(u.x - o.via.x, u.y - o.via.y);
  if (o.via.t0 == null) o.via.t0 = W.t;
  const done = d < 0.7 ? '닿음' : t && (!t.alive || gap(u, t) < 2.5) ? '노린 적이 가까움' : W.t - o.via.t0 > 25 ? '너무 오래 걸림' : null;
  if (done){ o.viaOK = true; L(W, { k: 'viaDone', a: u.i, why: done, vis: u.side === 0 || !!u.seenBy }); return false; }
  setMood(W, u, '우회'); setGoal(W, u, o.via.x, o.via.y); follow(W, u, dt);
  if (!u.path){ o.viaOK = true; L(W, { k: 'viaDone', a: u.i, why: '길이 없음', vis: u.side === 0 || !!u.seenBy }); return false; }
  return true;
}
// v7.12 우회 경유점: (tx, ty) 까지 곧장 가는 길에서 옆으로 크게 — 아는 적이 적은 쪽 (아군은 본 · 보고받은 자리만) · 적에게서 먼 곳 · 갈 수 있는 곳. side +1 = 가는 쪽의 오른쪽
function detourVia(W, L, tx, ty){
  const DT = W.rules.detour || {}, S = L[0].side, cx = L.reduce((a, u) => a + u.x, 0) / L.length, cy = L.reduce((a, u) => a + u.y, 0) / L.length, dx = tx - cx, dy = ty - cy, Ld = Math.hypot(dx, dy);
  if (Ld < (DT.min || 3)) return null;
  const nx = -dy / Ld, ny = dx / Ld;
  const F = W.units.filter(f => f.alive && !f.down && f.side !== S).map(f => S === 0 ? (f.seenBy ? f : picAt(W, 0, f)) : (W.units.some(e => e.alive && e.side === S && (canSee(W, e, f) || fresh(W, e.sense[f.i], 6))) ? f : null)).filter(Boolean);
  const thr = sg => F.reduce((a, p) => { const c = ((p.x - cx) * nx + (p.y - cy) * ny) * sg, al = ((p.x - cx) * dx + (p.y - cy) * dy) / Ld; return a + (c > -0.5 ? (al > -2 && al < Ld + 2 ? 1 : 0.4) / (1 + Math.max(0, c) * 0.15) : 0); }, 0);   /* 그 쪽에 있는 적 (길에서 멀수록 조금 덜) */
  const tR = thr(1), tL = thr(-1), sides = tR <= tL ? [1, -1] : [-1, 1];
  for (const sg of sides){
    let best = null, bs = -1e9;
    for (const k of [0.5, 0.35, 0.65]) for (const m of [1, 1.4, 0.7, 1.8]){
      const Dd = Math.min(DT.max || 8, Math.max(DT.min || 3, Ld * (DT.k || 0.45))) * m, x = cx + dx * k + nx * sg * Dd, y = cy + dy * k + ny * sg * Dd;
      if (x < 1 || y < 1 || x > W.map.W - 1 || y > W.map.H - 1 || boxRock(W, x, y, 0.45)) continue;
      if (!findPath(W.map, cx, cy, x, y) || !findPath(W.map, x, y, tx, ty)) continue;
      const near = F.length ? Math.min(...F.map(p => Math.hypot(p.x - x, p.y - y))) : 99, sc = Math.min(near, (DT.near || 3) * 2) - Math.abs(m - 1) * 0.8 - Math.abs(k - 0.5) * 2;
      if (sc > bs){ bs = sc; best = { x: Math.floor(x) + 0.5, y: Math.floor(y) + 0.5, side: sg, near: +Math.min(near, 99).toFixed(1) }; }
    }
    if (best) return { ...best, alt: sg !== sides[0], thr: [+tR.toFixed(2), +tL.toFixed(2)], known: F.length };
  }
  return null;
}
/* ---------- v4.0 싸움: 발견 → 경계 → 기회가 있을 때 공격 ----------""")
s = rep(s, "dropTorch, lieSet, lieHid, lieTick, lieTrample, lieFlash, prone };", "dropTorch, lieSet, lieHid, lieTick, lieTrample, lieFlash, prone, detourVia, flankLeap, suppAI, suppHid };")
wr('rt3_tail.js', s)
print('patch712 engine OK')
