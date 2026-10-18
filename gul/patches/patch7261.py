# v7.26.1 엔진 — patch7261.py v1.4 (v1.4: 직선 지름길은 몸 둘레 여유 × 1.12 (문 모서리를 스치는 길 대신 문 가운데로) · v1.3: 덜 밀어내기는 좁은 문 · 통로 앞에서만 (들판 근접전은 그대로 — 세자르 스텝 빈도 되찾음) · v1.2: 적이 없는 끝난 맵에서도 혼자 남으면 대장 곁으로 (예전엔 적이 없으면 판단이 멈춰 그대로 서 있었음) · v1.1: 문 앞에 나란히 막힌 둘은 한쪽에 차례 · 대장이 맵을 나가면 남은 동료가 따라 나감 (제자리 명령은 그대로) · 고립 합류: 6칸 안에 동료가 없이 4초면 지키던 자리를 풀고 합류 (사수는 9칸 · 시간은 같음) /
#   명령이 안 닿음 로그는 한 사람에 3초에 한 번 · 간두 자동 샷건: 보이는 적이 몸 가장자리 2.6칸 안 (나를 노리면 3.4칸) — 겨누는 중 · 재장전 중에도 끊고 바꿔 듦 · 돌아갈 때는 4.2칸 밖 1.5초 /
#   문 낑김: 같은 편끼리 둘 다 길을 가는 중이면 덜 밀어냄 (비켜 지나감) · 이동 명령의 끝자리가 막히면 1.2칸 안에서 0.8초 멈추면 도착으로 · 멀리서 1.5초 멈추면 길을 다시 찾음)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def load(n): return open(D + 'rt3_%s_v7260.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)

# ---------- 수치 ----------
H = rep(H, "  rejoin: { near: 8, hero: 14, t: 1.2, idle: 6, ranged: 2 },",
        "  rejoin: { near: 6, hero: 14, t: 1.2, idle: 4, ranged: 1.5 },   /* v7.26.1 고립: near 칸 안에 동료가 없이 idle 초면 합류 (사수는 거리만 × ranged) */")
H = rep(H, "altIn: 2.2, altOut: 3.6, altCalm: 1.5,", "altIn: 2.6, altWatch: 3.4, altOut: 4.2, altCalm: 1.5,")   # v7.26.1
H = rep(H, "  camp: { band: 0.9 },", "  camp: { band: 0.9, follow: true },   /* v7.26.1 follow = 대장이 맵을 나가면 남은 동료가 따라 나감 */\n  sepSoft: 0.35,      // v7.26.1 같은 편 둘이 다 길을 가는 중이면 서로 미는 힘 × (좁은 문에서 비켜 지나감)")

# ---------- 고립 합류: 거리 · 시간 ----------
T = rep(T, "      const far = nearest > (J.near || 8) * k || dH > (J.hero || 14) * k; u.farT = far ? (u.farT || 0) + 0.2 : 0;\n"
           "      if ((far && noise && u.farT >= (J.t || 1.2)) || u.farT >= (J.idle || 6) * k){",
        "      const alone = nearest > (J.near || 6) * k, far = alone || dH > (J.hero || 14) * k; u.farT = far ? (u.farT || 0) + 0.2 : 0; u.aloneT = alone ? (u.aloneT || 0) + 0.2 : 0;   /* v7.26.1 둘레에 아무도 없음 = 고립 */\n"
        "      if ((far && noise && u.farT >= (J.t || 1.2)) || u.aloneT >= (J.idle || 4)){")
T = rep(T, "u.stay = null; u.farT = 0; u.state = hero ? 'follow' : 'explore'; setMood(W, u, '합류'); } } }",
        "u.stay = null; u.farT = 0; u.aloneT = 0; u.state = hero ? 'follow' : 'explore'; setMood(W, u, '합류'); } } }")

# ---------- 적이 없을 때도 고립 합류 (끝난 맵) ----------
T = rep(T, "  if (!foes.length){ stop(u); return; }\n  smellTick(W, u);",
        "  if (!foes.length){ stop(u); if (u.side === 0 && !u.order && !u.hero && !u.down && !u.crawl) isoRejoin(W, u); return; }   /* v7.26.1 적이 없어도 혼자 남으면 합류 */\n  smellTick(W, u);")
T = rep(T, "function think(W, u){\n",
        "// v7.26.1 적이 없는 판 (끝난 맵): 둘레 near 칸에 동료가 없이 idle 초 → 대장 (없으면 가장 가까운 동료) 곁으로 걸어감 (도착하면 그 자리 · 제자리 명령은 그대로)\n"
        "function isoRejoin(W, u){\n"
        "  const J = W.rules.rejoin || {}, k = isFar(u) ? (J.ranged || 1.5) : 1, mates = W.units.filter(a => a.alive && a !== u && a.side === 0 && !a.down && !a.crawl);\n"
        "  if (!mates.length){ u.aloneT = 0; return; }\n"
        "  const nb = mates.reduce((b, a) => dist(a, u) < dist(b, u) ? a : b); if (dist(nb, u) <= (J.near || 6) * k){ u.aloneT = 0; return; }\n"
        "  u.aloneT = (u.aloneT || 0) + 0.2; if (u.aloneT < (J.idle || 4)) return;\n"
        "  const hero = W.units.find(h => h.hero && h.alive && h.side === 0), anc = hero && hero !== u ? hero : nb, an = Math.atan2(u.y - anc.y, u.x - anc.x);\n"
        "  let x = Math.max(0.6, Math.min(W.map.W - 0.6, anc.x + Math.cos(an) * 1.5)), y = Math.max(0.6, Math.min(W.map.H - 0.6, anc.y + Math.sin(an) * 1.5)); if (boxRock(W, x, y, u.r)){ const q = freeSpot(W, x, y, u.r); if (q){ x = q.x; y = q.y; } else { x = anc.x; y = anc.y; } }\n"
        "  u.order = { k: 'move', x, y, rejoin: true }; u.ordLive = u.order; u.stay = null; u.aloneT = 0;\n"
        "  L(W, { k: 'rejoin', a: u.i, d: +dist(nb, u).toFixed(1), why: '혼자 남음', vis: true }); u.lastDec = { t: W.t, s: `둘레 ${((J.near || 6) * k).toFixed(0)}칸에 동료가 없음 — ${anc.name} 곁으로` };\n"
        "}\n"
        "function think(W, u){\n")

# ---------- 대장이 맵을 나가면 따라감 ----------
T = rep(T, "  L(W, { k: 'leave', a: u.i, dir, vis: true }); W.lightT = 0;\n}",
        "  L(W, { k: 'leave', a: u.i, dir, vis: true }); W.lightT = 0;\n"
        "  if (W.camp && u.hero && u.side === 0 && ((W.rules.camp || {}).follow !== false)){   /* v7.26.1 대장이 넘어가면 남은 동료도 같은 길로 (제자리 명령 · 쓰러진 이는 그대로) */\n"
        "    const F = W.units.filter(a => a.alive && a.side === 0 && !a.down && !(a.order && (a.order.k === 'hold' || a.order.k === 'exit')));\n"
        "    for (const a of F){ a.order = { k: 'exit', dir, x: a.x, follow: true }; a.ordLive = a.order; a.ordPend = null; a.stay = null; }\n"
        "    if (F.length) L(W, { k: 'followOut', a: u.i, dir, n: F.map(a => a.i), vis: true }); }\n}")

# ---------- 명령이 안 닿음: 한 사람에 3초에 한 번만 로그 ----------
T = rep(T, "    else { u.missT = W.t; u.missO = P.o; L(W, { k: 'cmdMiss', side: 0, a: u.i, c: P.c, via: P.via, why: P.why, p: +P.p.toFixed(2), o: orderTxt(P.o, u), vis: true });",
        "    else { u.missT = W.t; u.missO = P.o; if (W.t - (u.missLogT == null ? -9 : u.missLogT) > 3){ u.missLogT = W.t; L(W, { k: 'cmdMiss', side: 0, a: u.i, c: P.c, via: P.via, why: P.why, p: +P.p.toFixed(2), o: orderTxt(P.o, u), vis: true }); }   /* v7.26.1 같은 줄이 쌓이지 않게 */")

# ---------- 간두: 자동 샷건 ----------
T = rep(T, """function altAuto(W, u){
  if (!u.alt || u.act || u.weaponGone || u.down || u.crawl || u.kb || u.lie || (u.order && u.order.k !== 'attack')) return false;
  const I = INV(W), nearW = n => !!((W.rules.weapons || {})[n] || {}).near, holdNear = nearW(u.weapon), altNear = nearW(u.alt.name);
  const seen = W.units.filter(f => f.alive && !f.down && f.side !== u.side && !isFar(f) && canSee(W, u, f));
  if (!holdNear && altNear && (u.alt.ammo == null || u.alt.ammo > 0)){ const f = seen.find(f => gap(u, f) < (I.altIn || 2.2) && (f.target === u || (f.act && f.act.b === u.i) || gap(u, f) < 1.2)); if (f) return startAlt(W, u, f.name + '이(가) 붙음'); }
  if (holdNear && !altNear){""",
"""// v7.26.1 지근거리: 보이는 적 (근접 · 사수 모두) 이 altIn 칸 안 · 나를 노리거나 덮쳐 오면 altWatch 칸 안 → 바로 바꿔 듦. 겨누는 중 · 재장전 중 (busy) 에도 끊고 바꿈
function altAuto(W, u, busy){
  if (!u.alt || u.weaponGone || u.down || u.crawl || u.kb || u.lie || (u.order && (u.order.k === 'alt' || u.order.k === 'swap'))) return false;
  if (u.act && !(busy && (u.act.k === 'reload' || (u.act.k === 'atk' && u.act.phase === 'wind' && isFar(u))))) return false;
  const I = INV(W), nearW = n => !!((W.rules.weapons || {})[n] || {}).near, holdNear = nearW(u.weapon), altNear = nearW(u.alt.name);
  const seen = W.units.filter(f => f.alive && !f.down && f.side !== u.side && canSee(W, u, f));
  if (!holdNear && altNear && (u.alt.ammo == null || u.alt.ammo > 0)){ const f = seen.filter(f => gap(u, f) < (I.altIn || 2.6) || (gap(u, f) < (I.altWatch || 3.4) && (f.target === u || (f.act && f.act.b === u.i)))).sort((a, b) => gap(u, a) - gap(u, b))[0];
    if (f){ if (u.act){ u.act = null; u.burst = null; } return startAlt(W, u, f.name + (gap(u, f) < 1.2 ? '이(가) 붙음' : '이(가) 다가옴')); } }
  if (busy || u.act) return false;
  if (holdNear && !altNear){""")
T = rep(T, "if (holdNear && !altNear){ if (u.ammo === 0) return startAlt(W, u, '산탄이 떨어짐'); const any = seen.some(f => gap(u, f) < (I.altOut || 3.6));",
        "if (holdNear && !altNear){ if (u.ammo === 0) return startAlt(W, u, '산탄이 떨어짐'); const any = seen.some(f => gap(u, f) < (I.altOut || 4.2));")
T = rep(T, "  if (u.act){ if (u.act.k === 'skill' && u.act.phase === 'tend'){ tendStep(W, u); if (!u.act) return; }",
        "  if (u.act && u.alt && altAuto(W, u, true)) return;   /* v7.26.1 겨누는 · 재장전 중에도 코앞이면 샷건으로 */\n  if (u.act){ if (u.act.k === 'skill' && u.act.phase === 'tend'){ tendStep(W, u); if (!u.act) return; }")

# ---------- 문 낑김 ----------
T = rep(T, "function separate(W){\n", "// v7.26.1 좁은 곳: 지금 칸이나 다음 길목 칸이 양옆 (또는 위아래) 이 벽 — 한 칸 문 · 통로\nconst tightCell = (m, cx, cy) => (rock(m, cx - 0.5, cy + 0.5) && rock(m, cx + 1.5, cy + 0.5)) || (rock(m, cx + 0.5, cy - 0.5) && rock(m, cx + 0.5, cy + 1.5));\nconst tightAt = (W, u) => tightCell(W.map, Math.floor(u.x), Math.floor(u.y)) || (!!u.path && !!u.path[0] && tightCell(W.map, Math.floor(u.path[0].x), Math.floor(u.path[0].y)));\nfunction separate(W){\n")
T = rep(T, "    const push = (need - d) / 2, ux = dx / d, uy = dy / d;\n",
        "    const soft = P.side === Q.side && !P.act && !Q.act && P.path && P.path.length && Q.path && Q.path.length && (tightAt(W, P) || tightAt(W, Q)) ? (W.rules.sepSoft != null ? W.rules.sepSoft : 0.35) : 1;   /* v7.26.1 좁은 문 · 통로 앞에서 둘 다 길을 가는 같은 편은 덜 밂 — 비켜 지나감 (넓은 곳은 그대로) */\n"
        "    const push = (need - d) / 2 * soft, ux = dx / d, uy = dy / d;\n")
T = rep(T, "    const pw = P.act ? 0 : Q.act ? 2 : 1, qw = Q.act ? 0 : P.act ? 2 : 1;\n",
        "    let pw = P.act ? 0 : Q.act ? 2 : 1, qw = Q.act ? 0 : P.act ? 2 : 1;\n"
        "    if (soft < 1){ if (P.i < Q.i){ pw = 0.25; qw = 1.75; } else { pw = 1.75; qw = 0.25; } }   /* v7.26.1 둘이 문 앞에 나란히 서서 서로 막지 않게 — 먼저 온 (번호가 앞선) 쪽이 지나갈 차례 */\n")
T = rep(T, """    if (Math.hypot(u.x - o.x, u.y - o.y) < 0.12){ L(W, { k: 'arrive', a: u.i }); u.order = null; u.stay = { x: o.x, y: o.y }; stop(u); return; }
    setMood(W, u, '이동');""",
"""    if (Math.hypot(u.x - o.x, u.y - o.y) < 0.12){ L(W, { k: 'arrive', a: u.i }); u.order = null; u.stay = { x: o.x, y: o.y }; stop(u); return; }
    { const d0 = Math.hypot(u.x - o.x, u.y - o.y), pc = o.pc || (o.pc = { t: W.t, d: d0 });   /* v7.26.1 막힘: 끝자리가 차 있으면 가까이서 멈춘 채 도착 · 멀리서 막히면 길을 다시 */
      if (pc.d - d0 > 0.08){ pc.t = W.t; pc.d = d0; }
      else if (d0 < 1.2 && W.t - pc.t > 0.8){ L(W, { k: 'arrive', a: u.i, near: +d0.toFixed(2) }); u.order = null; u.stay = { x: u.x, y: u.y }; stop(u); return; }
      else if (W.t - pc.t > 1.5){ pc.t = W.t; pc.d = d0; u.goal = null; u.path = null; L(W, { k: 'repath', a: u.i, d: +d0.toFixed(1) }); } }
    setMood(W, u, '이동');""")

# 직선 지름길은 몸 둘레에 여유 (모서리에 걸리는 길을 고르지 않게 — 아니면 칸 가운데 길)
T = rep(T, "  u.path = walkClear(W.map, u.x, u.y, x, y, u.r * 0.92) ? [{ x, y }]", "  u.path = walkClear(W.map, u.x, u.y, x, y, u.r * 1.12) ? [{ x, y }]")   # v7.26.1
T = rep(T, "if (walkClear(W.map, u.x, u.y, u.goal.x, u.goal.y, u.r * 0.92)) u.path = [u.goal];", "if (walkClear(W.map, u.x, u.y, u.goal.x, u.goal.y, u.r * 1.12)) u.path = [u.goal];")   # v7.26.1
for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch7261 OK')
