# ---------- M. 사수 자리 (J24 · J25): 같은 까닭 (바위에 가림 · 보이지 않음) 으로 같은 자리에서 두 번 빗나가면 자리를 옮김 (그 둘레는 3초 동안 안 고름) · 도약이 있는 사수는 각 잡기 대신 도약으로 사선 열린 자리로 ----------
rep("      L(W, { k: 'miss', a: u.i, b: t.i, why, man, whiff: stp || null });",
    "      L(W, { k: 'miss', a: u.i, b: t.i, why, man, whiff: stp || null }); if (far && (why === '바위에 가림' || why === '보이지 않음')) missSpot(W, u, t, why);   /* v8.7.4 J24 */")
rep("  if (g > u.rng || !losClear(W.map, u.x, u.y, t.x, t.y)){ reposition(W, u, t, dt, ordered ? '공격' : '자리 잡기'); return; }",
    "  if (!ordered && u.reloc && u.reloc.b === t.i && W.t < u.reloc.until && Math.hypot(u.x - u.reloc.x, u.y - u.reloc.y) < 1.3){ reposition(W, u, t, dt, '각 잡기'); return; }   /* v8.7.4 J24 같은 자리에서 두 번 빗나감 — 옮김 */\n"
    "  if (g > u.rng || !losClear(W.map, u.x, u.y, t.x, t.y)){ reposition(W, u, t, dt, ordered ? '공격' : '자리 잡기'); return; }")
rep("    if (old) cands.push([old.x, old.y, Math.hypot(old.x - u.x, old.y - u.y), true]);",
    "    const RL = u.reloc && u.reloc.b === t.i && W.t < u.reloc.until ? u.reloc : null;   /* v8.7.4 J24 빗나간 자리 둘레는 고르지 않음 */\n"
    "    if (old && !(RL && Math.hypot(old.x - RL.x, old.y - RL.y) < 1.3)) cands.push([old.x, old.y, Math.hypot(old.x - u.x, old.y - u.y), true]);")
rep("      if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r)) continue;\n      const g = Math.hypot(x - t.x, y - t.y) - u.r - t.r;",
    "      if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r)) continue;\n      if (RL && Math.hypot(x - RL.x, y - RL.y) < 1.3) continue;\n      const g = Math.hypot(x - t.x, y - t.y) - u.r - t.r;")
rep("  const p = u.spot.p;\n  if (p && Math.hypot(p.x - u.x, p.y - u.y) > 0.1){\n    setMood(W, u, mood, mb);",
    "  const p = u.spot.p;\n"
    "  if (p && isFar(u) && u.canLeap && W.t >= u.leapCd && !u.crawl && !u.lie && Math.hypot(p.x - u.x, p.y - u.y) >= 0.7 && leapTo(W, u, p.x, p.y, 'side', t, '도약 — 사선 열린 자리로')){ u.spot = null; return; }   /* v8.7.4 J25 도약이 있는 사수는 각 잡기 대신 뜀 */\n"
    "  if (p && Math.hypot(p.x - u.x, p.y - u.y) > 0.1){\n    setMood(W, u, mood, mb);")
rep("function reposition(W, u, t, dt, mood, mb){",
    "// v8.7.4 J24: 같은 표적 · 같은 까닭 · 같은 자리 (1.2칸 안) 로 두 번 빗나가면 그 자리를 떠남 (3초 동안 그 둘레는 고르지 않음)\n"
    "function missSpot(W, u, t, why){\n"
    "  const M = u.mRun && u.mRun.b === t.i && u.mRun.why === why && Math.hypot(u.x - u.mRun.x, u.y - u.mRun.y) < 1.2 ? u.mRun : (u.mRun = { b: t.i, why, x: u.x, y: u.y, n: 0 }); M.n++;\n"
    "  if (M.n >= 2){ u.reloc = { b: t.i, x: M.x, y: M.y, until: W.t + 3 }; u.spot = null; u.mRun = null; L(W, { k: 'reloc', a: u.i, b: t.i, why, vis: u.side === 0 || !!u.seenBy }); }\n"
    "}\n"
    "function reposition(W, u, t, dt, mood, mb){")
