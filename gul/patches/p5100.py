def rep(path, a, b, n=1):
    s = open(path, encoding='utf8').read(); c = s.count(a)
    assert c == n, (path, a[:80], c); s = s.replace(a, b); open(path, 'w', encoding='utf8').write(s)
T='rt3_tail.js'; P='page10.tpl.html'
# 엔진: 한 자리에 떨어지는 무기 · 방패를 양옆으로 (따로 탭할 수 있게)
rep(T, "function dropItem(W, u, k, name, extra, how){\n  const p = freeSpot(W, u.x + (W.rand() - 0.5) * 0.5, u.y + (W.rand() - 0.5) * 0.5, 0.15) || { x: u.x, y: u.y };",
       "function dropItem(W, u, k, name, extra, how){\n  const sd = k === 'shield' ? -1 : k === 'weapon' ? 1 : 0, fa = (u.face || 0) + Math.PI / 2;   // v5.10.0 방패는 왼쪽 · 무기는 오른쪽으로 0.35칸 — 한 자리에 겹쳐 떨어지지 않게\n  const p = freeSpot(W, u.x + Math.cos(fa) * 0.35 * sd + (W.rand() - 0.5) * 0.3, u.y + Math.sin(fa) * 0.35 * sd + (W.rand() - 0.5) * 0.3, 0.15) || { x: u.x, y: u.y };")
# 페이지: 무구로 막기 태그 (방패 아님) · 팔 방패 태그
rep(P, "...(u.armShield ? ['팔 방패'] : u.shield ? ['방패'] : u.canGuard &&", "...(u.armShield ? ['팔 방패'] : u.shield ? ['방패'] : u.parry ? ['무구로 막기'] : u.canGuard &&")
rep(P, "  '방어 자세': '방패 · 대검: 앞에서 오는 공격을 막음", "  '팔 방패': '◆개조된 신체 — 팔을 들어 방패처럼 막음 (방패와 같은 막기 · 밀치기 · 돌격 버팀 · 방패벽). 몸이라 떨어뜨리지 않고, 그 팔을 잃으면 못 막음',\n  '무구로 막기': '방패가 아님 — 들고 있는 무기 (창 · 검) 로 받아 냄: 근접만 · 받는 피해 ×0.5 · 화살 · 돌진 · 거구의 휘두르기는 못 받음 · 치는 동안 못 막음. 방패를 주우면 방패로 막음',\n  '방어 자세': '방패 · 대검: 앞에서 오는 공격을 막음")
rep(P, "const EXTRA_TRAITS = Object.keys(TRAITS).filter(k => k !== '야시' && k !== '방패' && k !== '방어 자세');", "const EXTRA_TRAITS = Object.keys(TRAITS).filter(k => k !== '야시' && k !== '방패' && k !== '방어 자세' && k !== '팔 방패' && k !== '무구로 막기');")
# 줍기: 여럿이 겹치면 고른 아군에게 쓸모 있는 쪽 (방패가 없으면 방패 · 맨손이면 무기 · 들던 무기를 바꾸는 건 뒤로)
rep(P, "const itemAt = (Wd, x, y) => (Wd.items || []).filter(it => Math.hypot(it.x - x, it.y - y) < 0.45).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0] || null;",
       "// v5.10.0 줍기 고르기: 누른 자리 둘레의 물건 중 고른 아군이 들 수 있고 쓸모 있는 쪽 (방패가 없으면 방패 · 맨손이면 무기 · 들던 무기를 바꾸는 건 맨 뒤) → 같으면 가까운 쪽\nconst pickScore = (Wd, L, it) => { const C = (L || []).filter(u => canTake(Wd, u, it)); if (!C.length) return 9; if (it.k === 'shield') return C.some(u => !u.shield || u.armShield) ? 0 : 3; return C.some(u => unarmed(u)) ? 0 : 2; };\nconst pickAt = (Wd, L, x, y, r) => (Wd.items || []).filter(it => it.k !== 'spear' && Math.hypot(it.x - x, it.y - y) < r).sort((a, b) => pickScore(Wd, L, a) - pickScore(Wd, L, b) || Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0] || null;\nconst itemAt = (Wd, x, y) => (Wd.items || []).filter(it => Math.hypot(it.x - x, it.y - y) < 0.45).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0] || null;")
rep(P, "{ const it = L.length && !amovePick ? itemAt(world, w.x, w.y) : null; if (it){ givePick(it); return; } }", "{ const it = L.length && !amovePick ? pickAt(world, L, w.x, w.y, 0.45) : null; if (it){ givePick(it); return; } }")
rep(P, "if (k === 'pick'){ const it = (Wd.items || []).filter(x => x.k !== 'spear' && Math.hypot(x.x - w.x, x.y - w.y) < 0.9).sort((a, b) => Math.hypot(a.x - w.x, a.y - w.y) - Math.hypot(b.x - w.x, b.y - w.y))[0]; if (it && givePick(it)) return done();",
       "if (k === 'pick'){ const it = pickAt(Wd, L, w.x, w.y, 0.9); if (it && givePick(it)) return done();")
rep(P, "const nearItem = (Wd, L, r) => { let best = null, bd = r || 8; for (const u of L) for (const it of Wd.items || []){ if (!canTake(Wd, u, it)) continue; const d = Math.hypot(it.x - u.x, it.y - u.y); if (d < bd){ bd = d; best = it; } } return best; };",
       "const nearItem = (Wd, L, r) => { let best = null, bs = 1e9; for (const u of L) for (const it of Wd.items || []){ if (!canTake(Wd, u, it)) continue; const d = Math.hypot(it.x - u.x, it.y - u.y); if (d >= (r || 8)) continue; const s = pickScore(Wd, [u], it) * 100 + d; if (s < bs){ bs = s; best = it; } } return best; };   // v5.10.0 쓸모 있는 쪽 먼저")
# 줍기 알림: 무기를 바꿔 들면 들던 무기를 내려놓는다고
rep(P, "const u = C[0]; u.order = { k: 'pick', id: it.id }; noteOrders([u]); toast(`${u.name} → ${it.name} 주우러`); hud(); return true;",
       "const u = C[0]; u.order = { k: 'pick', id: it.id }; noteOrders([u]); toast(`${u.name} → ${it.name} 주우러${it.k === 'weapon' && !unarmed(u) && u.weapon && !ITEM_NATURAL.includes(u.weapon) ? ' (들던 ' + u.weapon + '은 발밑에 내려놓음)' : it.k === 'shield' && u.armShield ? ' (팔 대신 방패로 막음)' : ''} — 이 판에서만`); hud(); return true;")
print('ok')
