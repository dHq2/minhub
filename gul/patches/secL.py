# ---------- L. 역할 진화 (I25): 미드필더가 방패와 한 손 검 (또는 둔기) 을 함께 들면 전열 쪽으로 (전선) · 방패를 잃으면 본디 역할로 — 양쪽 같음 ----------
rep("function takeItem(W, u, it){",
    "// v8.7.4 역할 진화 (I25 — 청광묵이 방패와 검을 쓰기 시작하면 전열 쪽으로): 본디 미드필더 (role0) 가 방패 (팔 방패 아님) + 한 손 날붙이 · 둔기 (단검 · 창 · 사격 무기 아님) 를 함께 들면 전선 · 아니면 본디 역할\n"
    "function evoRole(W, u){\n"
    "  const base = u.role0 || u.role; if (base !== '미드필더') return; u.role0 = base;\n"
    "  const wp = (W.rules.weapons || {})[u.weaponNow || u.weapon] || {}, arms = !u.weaponGone && !unarmed(u) && !isRangedW(wp) && !u.jav && (wp.rng || 0) >= 0.45 && (wp.kind === '날붙이' || wp.kind === '둔기');\n"
    "  const want = u.shield && !u.armShield && arms ? '전선' : base;\n"
    "  if (want !== u.role){ const was = u.role; u.role = want; L(W, { k: 'roleEvo', a: u.i, from: was, to: want, w: u.weaponNow || u.weapon, vis: u.side === 0 || !!u.seenBy }); }\n"
    "}\n"
    "function takeItem(W, u, it){")
rep("  L(W, { k: 'pickItem', a: u.i, item: it.k, name: it.name, label: it.label || '', own: it.owner === u.i, from: it.owner != null ? it.owner : null, x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy });\n}",
    "  L(W, { k: 'pickItem', a: u.i, item: it.k, name: it.name, label: it.label || '', own: it.owner === u.i, from: it.owner != null ? it.owner : null, x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy });\n  evoRole(W, u);   /* v8.7.4 I25 */\n}")
rep("  if (u.shield){ dropItem(W, u, 'shield', '방패', { dur: u.sDur, label: u.sName || '', own: u.sOwn || ownKey(u) }, how); u.shield = false; } }",
    "  if (u.shield){ dropItem(W, u, 'shield', '방패', { dur: u.sDur, label: u.sName || '', own: u.sOwn || ownKey(u) }, how); u.shield = false; if (u.alive) evoRole(W, u); } }   /* v8.7.4 I25 */")
rep("  for (const u of W.units) wpnSpec(W, u);   // v7.22.3", "  for (const u of W.units){ wpnSpec(W, u); evoRole(W, u); }   /* v8.7.4 I25 (들고 온 방패 · 검) */   // v7.22.3")
rep("  const i = W.units.length; unitInit(W, p, i); const u = W.units[i], rules = W.rules; wpnSpec(W, u);", "  const i = W.units.length; unitInit(W, p, i); const u = W.units[i], rules = W.rules; wpnSpec(W, u); evoRole(W, u);   /* v8.7.4 I25 */")
