# ---------- H. 제3세력 (I6 — 각혈): 2편 = 누구의 편도 아님 — 보이는 누구든 침 · 망자 (1편) 와도 서로 싸움 · 쓰러뜨려야 맵이 정리됨 ----------
# 적대는 원래부터 '편이 다르면' (side !==) 이라 그대로 · 1편의 지휘 (작전 · 대치 · 경보 · 암살조) 는 1편만 · 2편은 제 눈으로 보고 쫓고 찾음 (1편의 혼자 판단과 같은 규칙)
rep("farDmg: [0, 0]", "farDmg: [0, 0, 0]")
rep("kills: [0, 0]", "kills: [0, 0, 0]")
rep("  if (u.side === 1){\n    for (const k in u.threat) u.threat[k] *= 0.97;", "  if (u.side >= 1){   /* v8.7.4 제3세력 (2편) 도 제 눈으로 보고 쫓음 */\n    for (const k in u.threat) u.threat[k] *= 0.97;")
rep("+ (W.plan && W.plan.k === 'hunt' && supportOf(W, f) === 0 ? 6 : 0) + focusBonus(W, u, f) + taskBias(W, u, f);",
    "+ (u.side === 1 ? (W.plan && W.plan.k === 'hunt' && supportOf(W, f) === 0 ? 6 : 0) + focusBonus(W, u, f) + taskBias(W, u, f) : 0);   /* v8.7.4 1편의 작전 · 집중 · 임무는 1편만 */")
rep("        if (!W.alarm1){ W.alarm1 = { t: W.t, by: u.i, b: seen[0].i,", "        if (u.side === 1 && !W.alarm1){ W.alarm1 = { t: W.t, by: u.i, b: seen[0].i,")
rep("    const see = canSee(W, u, t) || (u.side === 1 && gap(u, t) < 0.6);", "    const see = canSee(W, u, t) || (u.side >= 1 && gap(u, t) < 0.6);")
rep("    if (!see && u.side === 1 && u.last && Math.hypot(u.x - u.last.x, u.y - u.last.y) < 0.8) u.state = 'search';", "    if (!see && u.side >= 1 && u.last && Math.hypot(u.x - u.last.x, u.y - u.last.y) < 0.8) u.state = 'search';")
rep("  if (u.side === 1){\n    if (u.state === 'hunt') u.state = 'search';", "  if (u.side >= 1){   /* v8.7.4 2편도 찾고 · 돌아가고 · 서성임 */\n    if (u.state === 'hunt') u.state = 'search';")
rep("b = W.units.some(u => u.alive && u.side === 1);", "b = W.units.some(u => u.alive && u.side >= 1);   /* v8.7.4 2편 (각혈) 도 쓰러뜨려야 정리 */")
rep("b = W.units.some(u => up(u) && u.side === 1);", "b = W.units.some(u => up(u) && u.side >= 1);")
rep("  for (const e of W.units) if (e.side === 1){ e.seenBy = W.units.some(a => a.side === 0 && canSee(W, a, e));", "  for (const e of W.units) if (e.side !== 0){ e.seenBy = W.units.some(a => a.side === 0 && canSee(W, a, e));")
rep("  if (u.side === 1){ u.seenBy = W.units.some(a => a.alive && a.side === 0 && canSee(W, a, u)); u.visLog = u.seenBy; u.visPend = null; if (W.camp) W.cleared = false; }",
    "  if (u.side !== 0){ u.seenBy = W.units.some(a => a.alive && a.side === 0 && canSee(W, a, u)); u.visLog = u.seenBy; u.visPend = null; if (W.camp) W.cleared = false; }   /* v8.7.4 2편도 */")
rep("  for (const e of W.units) if (e.side === 1){\n    const s = e.alive", "  for (const e of W.units) if (e.side !== 0){   /* v8.7.4 2편도 (아군이 본 것만 보임) */\n    const s = e.alive")
# 짐작 (intel): 두 편 (0 · 1) 이 저마다 — 2편은 두 편 모두가 봄 · 2편은 따로 짐작을 쌓지 않음
rep("const iRec = (W, S, f) => { const I = (W.intel || (W.intel = [{}, {}]))[S]; return I[f.i] ||",
    "const iRec = (W, S, f) => { const I = (W.intel || (W.intel = [{}, {}]))[S]; if (!I) return { seenT: null, tags: [], dmg: 0, dealt: 0, kills: 0, heals: 0, shouts: 0, shots: 0, guess: guessMax(f) };   /* v8.7.4 2편은 짐작을 쌓지 않음 */\n  return I[f.i] ||")
rep("const iTag = (W, S, f, tag, why) => { const r = iRec(W, S, f);", "const iTag = (W, S, f, tag, why) => { if (S !== 0 && S !== 1) return false; const r = iRec(W, S, f);")
rep("  for (const f of W.units){ if (!f.alive) continue; const S = 1 - f.side;", "  for (const f of W.units){ if (!f.alive) continue; for (const S of f.side > 1 ? [0, 1] : [1 - f.side]){   /* v8.7.4 2편은 두 편 모두가 봄 */")
rep("if (f.torch && !r.tags.includes('횃불')) iTag(W, S, f, '횃불', '불빛'); } }", "if (f.torch && !r.tags.includes('횃불')) iTag(W, S, f, '횃불', '불빛'); } } }")
