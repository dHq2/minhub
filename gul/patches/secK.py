# ---------- K. 전열 끝 (I22): 기동 분대 · 측면 기동 · 협공은 멀리 돌지 않고 상대 전열의 가까운 끝을 돌아 들어감 (전선 개념) — 양쪽 같음 ----------
rep("// 망치: 붙들린 상대의 옆 · 뒤로 스스로 돌아 들어감 (명령 없이 — 알아본 만큼만, 틀릴 수 있음)",
    "// v8.7.4 전열 끝 (I22): u 에서 p 로 가는 곧은 길이 상대 전열 (t 편 근접 몸 — 길에서 몸 + 0.9칸 안 · 서로 2.2칸으로 이어진 무리) 을 가로지르면 그 전열의 가까운 끝 (끝 몸 옆 몸 + 1.2칸) 을 거쳐 감 — 아는 몸만\n"
    "function lineEndVia(W, u, t, p){\n"
    "  const F = W.units.filter(f => f.alive && !f.down && !f.lie && f.side === t.side && f !== t && !isFar(f) && (u.side === 0 ? (f.seenBy || canSee(W, u, f)) : (canSee(W, u, f) || fresh(W, u.sense[f.i], 2))));\n"
    "  const dx = p.x - u.x, dy = p.y - u.y, L = Math.hypot(dx, dy); if (L < 1.5 || !F.length) return null;\n"
    "  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux, al = f => (f.x - u.x) * ux + (f.y - u.y) * uy, lt = f => (f.x - u.x) * nx + (f.y - u.y) * ny;\n"
    "  const block = F.filter(f => al(f) > 0.3 && al(f) < L - 0.3 && Math.abs(lt(f)) < f.r + u.r + 0.9); if (!block.length) return null;\n"
    "  const line = new Set(block); for (let grew = true; grew;){ grew = false; for (const f of F) if (!line.has(f) && [...line].some(g => dist(f, g) < 2.2)){ line.add(f); grew = true; } }\n"
    "  let best = null, bs = 1e9;\n"
    "  for (const sg of [1, -1]){ const end = [...line].reduce((a, f) => lt(f) * sg > lt(a) * sg ? f : a), s = lt(end) + sg * (end.r + u.r + 1.2), x = u.x + ux * al(end) + nx * s, y = u.y + uy * al(end) + ny * s;\n"
    "    if (x < 0.8 || y < 0.8 || x > W.map.W - 0.8 || y > W.map.H - 0.8 || boxRock(W, x, y, u.r)) continue;\n"
    "    const c = Math.hypot(x - u.x, y - u.y) + Math.hypot(p.x - x, p.y - y); if (c < bs){ bs = c; best = { x, y }; } }\n"
    "  return best;\n"
    "}\n"
    "// 망치: 붙들린 상대의 옆 · 뒤로 스스로 돌아 들어감 (명령 없이 — 알아본 만큼만, 틀릴 수 있음)")
rep("  const via = arcVia(W, u, t, spot); setMood(W, u, '측면 기동', t.i); goTo(W, u, via.x, via.y, dt);",
    "  const via = lineEndVia(W, u, t, spot) || arcVia(W, u, t, spot); setMood(W, u, '측면 기동', t.i); goTo(W, u, via.x, via.y, dt);   /* v8.7.4 상대 전열이 막으면 그 끝을 돌아 (I22) */")
rep("const spot = approachPt(W, u, t, base, [0, 0.5, -0.5, 0.9, -0.9, 1.4, -1.4]) || { x: t.x, y: t.y }, via = arcVia(W, u, t, spot);",
    "const spot = approachPt(W, u, t, base, [0, 0.5, -0.5, 0.9, -0.9, 1.4, -1.4]) || { x: t.x, y: t.y }, via = lineEndVia(W, u, t, spot) || arcVia(W, u, t, spot);   /* v8.7.4 I22 */")
rep("  setMood(W, u, u.sqStl ? '우회 (조) — 숨어서' : '우회 (조)', q.aim); goTo(W, u, q.wp.x, q.wp.y, dt);",
    "  const qa = W.units[q.aim], qv = qa && qa.alive ? lineEndVia(W, u, qa, q.wp) : null;   /* v8.7.4 상대 전열이 막으면 그 끝을 돌아 (I22) */\n"
    "  setMood(W, u, u.sqStl ? '우회 (조) — 숨어서' : '우회 (조)', q.aim); goTo(W, u, (qv || q.wp).x, (qv || q.wp).y, dt);")
rep("  for (const s of [-1, 1]) for (const k of [1, 0.75, 0.5]){", "  for (const s of [-1, 1]) for (const k of [0.5, 0.75, 1]){   /* v8.7.4 표적 가까이부터 (멀리 돌지 않음 — I22) */")
