def rep(path, a, b, n=1):
    s = open(path).read(); c = s.count(a); assert c == n, (path, a[:90], c); open(path, 'w').write(s.replace(a, b))
H, T, P = 'rt3_head.js', 'rt3_tail.js', 'page10.tpl.html'
# ---- rules
rep(H, "busy: 0.5, cap: 0.75, cd: 1.4, twist: 0.22, step: 0.5, time: 0.15, crowd: 0.6, wall: 0.7 },   // v6.7 회피 (확률):",
       "busy: 0.75, cap: 0.75, cd: 1.4, twist: 0.22, step: 0.5, time: 0.15, crowd: 1, wall: 0.9, sense: 0.35 },   // v6.7.1 확률 회피 = 반사신경 · 센스 — 난투 (둘러싸여도 crowd 1) · 중거리 (맞붙어 있어도) 에서도 일어남 · 못 본 쪽 (옆 · 뒤 · 어둠) 도 감으로 × sense · 자기도 치는 중 × busy 0.75 · 벽 × 0.9 (몸을 비트는 데 자리가 거의 안 듦). 유저가 직접 움직여 피하는 건 따로 (노린 회피)   // v6.7 회피 (확률):")
rep(H, "   v6.7: 투창 사거리 8 ·", "   v6.7.1: 확률 회피 = 반사신경 · 센스 (난투 · 중거리에서도 · 못 본 쪽도 감으로 ×0.35). 유저가 직접 움직여 피한 것은 '노린 회피' 로 따로 남김 (피함!).\n   v6.7: 투창 사거리 8 ·")
# ---- evadeP
rep(T, "// 알아차린 상대 (보임 · 등 뒤 아님) 만. 넘어짐", "// v6.7.1 반사신경 · 센스: 못 알아챈 상대 (옆 · 뒤 · 어둠) 도 감으로 × sense. 넘어짐")
rep(T, "  if (a && !aware(W, u, a)) return 0;\n  const agi", "  const sense = a && !aware(W, u, a) ? (E.sense != null ? E.sense : 0.35) : 1; if (!sense) return 0;   // v6.7.1\n  const agi")
rep(T, "  let p = (kind === 'melee' ? E.melee : E.shot) * Math.pow(agi, 1.3) * sz * (u.ev || 1);", "  let p = (kind === 'melee' ? E.melee : E.shot) * Math.pow(agi, 1.3) * sz * (u.ev || 1) * sense;")
rep(T, "  if (u.act && u.act.phase === 'wind') p *= E.busy != null ? E.busy : 0.5;", "  if (u.act && u.act.phase === 'wind') p *= E.busy != null ? E.busy : 0.75;")
rep(T, "p *= E.wall != null ? E.wall : 0.7; if (W.units.filter(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < f.rng + 0.5).length >= 3) p *= E.crowd != null ? E.crowd : 0.6; }\n  else if (busyW(W, u)) p *= 0.7;\n",
       "p *= E.wall != null ? E.wall : 0.9; if (E.crowd != null && E.crowd < 1 && W.units.filter(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < f.rng + 0.5).length >= 3) p *= E.crowd; }   // v6.7.1 난투 · 중거리 (맞붙어 있어도) 에서도 그대로\n")
# ---- 노린 회피 (유저가 직접 움직여 피함): 탄이 겨눔은 맞았는데 명령으로 움직이던 아군이 비켜 감 · 근접이 손이 안 닿음
rep(T, "function evaded(W, t, a, how, why, p){",
"""// v6.7.1 노린 회피: 유저가 직접 움직인 (이동 · 공격 이동 · 서두르기 · 전열 · 줍기 · 돌진 · 도약 명령) 아군이 그 움직임으로 피함 — 확률 회피와 따로 셈
const manDodge = (W, u) => !!u && u.alive && u.side === 0 && !!u.order && ['move', 'amove', 'line', 'pick', 'charge', 'leap', 'attack', 'throw', 'palm'].includes(u.order.k) && (Math.hypot(u.vx || 0, u.vy || 0) > 0.6 || !!(u.act && u.act.k === 'leap'));
function manNote(W, t, a){ t.manN = (t.manN || 0) + 1; if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '피함!', c: 'g', t0: W.t }); }
function evaded(W, t, a, how, why, p){""")
rep(T, "      if (s.left <= 1e-6){ s.done = true; u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: `빗나감 (명중률 ${Math.round(s.p * 100)}%)${s.good ? ' · 겨눔은 맞았으나 상대가 움직임' : ''}`, fired: true, p: s.p, good: !!s.good }); if (W.fxOn){ const m = W.units[s.meant]; W.fx.push({ k: 'num', x: m.x, y: m.y, s: '빗나감', c: 'm', t0: W.t }); }",
       "      if (s.left <= 1e-6){ s.done = true; u.miss++; const m = W.units[s.meant], man = !!s.good && manDodge(W, m); L(W, { k: 'miss', a: s.a, b: s.meant, why: `빗나감 (명중률 ${Math.round(s.p * 100)}%)${man ? ' · 직접 움직여 피함 (노린 회피)' : s.good ? ' · 겨눔은 맞았으나 상대가 움직임' : ''}`, fired: true, p: s.p, good: !!s.good, man }); if (man) manNote(W, m, u); else if (W.fxOn) W.fx.push({ k: 'num', x: m.x, y: m.y, s: '빗나감', c: 'm', t0: W.t });")
rep(T, "  if (!hit){ u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: `곡사 — 빈 바닥에 꽂힘 (명중률 ${Math.round(s.p * 100)}%)${s.good ? ' · 겨눔은 맞았으나 상대가 움직임' : ''}`, fired: true, p: s.p, arc: true, good: !!s.good, jav: !!s.jav }); if (W.fxOn) W.fx.push({ k: 'num', x: s.lx, y: s.ly, s: '빗나감', c: 'm', t0: W.t });",
       "  if (!hit){ u.miss++; const m = W.units[s.meant], man = !!s.good && manDodge(W, m); L(W, { k: 'miss', a: s.a, b: s.meant, why: `곡사 — 빈 바닥에 꽂힘 (명중률 ${Math.round(s.p * 100)}%)${man ? ' · 직접 움직여 피함 (노린 회피)' : s.good ? ' · 겨눔은 맞았으나 상대가 움직임' : ''}`, fired: true, p: s.p, arc: true, good: !!s.good, jav: !!s.jav, man }); if (man) manNote(W, m, u); else if (W.fxOn) W.fx.push({ k: 'num', x: s.lx, y: s.ly, s: '빗나감', c: 'm', t0: W.t });")
rep(T, "    else if (gap(u, t) > u.rng + (far ? 0.5 : R.reach)) why = far ? '사거리 밖으로 벗어남' : W.t - t.dodgedT < 0.5 ? '몸을 빼 피함' : `손이 안 닿음 (${gap(u, t).toFixed(1)}칸 떨어짐)`;",
       "    else if (gap(u, t) > u.rng + (far ? 0.5 : R.reach)) why = far ? '사거리 밖으로 벗어남' : W.t - t.dodgedT < 0.5 ? '몸을 빼 피함' : manDodge(W, t) ? (manNote(W, t, u), `직접 움직여 피함 (노린 회피 · ${gap(u, t).toFixed(1)}칸)`) : `손이 안 닿음 (${gap(u, t).toFixed(1)}칸 떨어짐)`;   // v6.7.1")
rep(T, "    if (why){ u.miss++; L(W, { k: 'miss', a: u.i, b: t.i, why }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '빗나감', c: 'm', t0: W.t }); }",
       "    if (why){ u.miss++; const man = /노린 회피/.test(why); L(W, { k: 'miss', a: u.i, b: t.i, why, man }); if (W.fxOn && !man) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '빗나감', c: 'm', t0: W.t }); }")
rep(T, "evadeCd: -9, evN: 0, blindL:", "evadeCd: -9, evN: 0, manN: 0, blindL:")
# ---- page
rep(P, "<!-- 굴의 전투판 v6.7.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v6.7.1 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v6.7.1: 확률 회피 = 반사신경 · 센스 — 난투 (셋 넘게 둘러싸여도) · 중거리 (맞붙어 있어도) 에서도 그대로 일어남, 못 본 쪽 (옆 · 뒤 · 어둠) 도 감으로 ×0.35, 자기도 치는 중이면 ×0.75 (예전 ×0.5), 벽 ×0.9.
             유저가 직접 움직여 피한 것은 '노린 회피' 로 따로 — 금빛 '피함!' · 로그 '직접 움직여 피함 (노린 회피)' · 상세정보에 횟수. 청광묵 키 = 도감대로 130cm (저장된 판 · 내 설계 · 층도).
""")
rep(P, 'body.mob .top h1::after{content:" v6.7.0";', 'body.mob .top h1::after{content:" v6.7.1";')
rep(P, '<span class="ver">v6.7.0 · 투창 곡사 · 회피! · 청광묵 · ', '<span class="ver">v6.7.1 · 확률 회피 = 반사신경 · 노린 회피 · 청광묵 130cm · v6.7.0 · 투창 곡사 · 회피! · 청광묵 · ')
rep(P, '<footer>굴의 전투판 v6.7.0 —', '<footer>굴의 전투판 v6.7.1 —')
rep(P, "return `굴의 전투판 v6.7.0 · ${title}", "return `굴의 전투판 v6.7.1 · ${title}")
rep(P, "name: '청광묵', tier: 2, cls: '기동', role: '미드필더', weapon: '흑요석 단검', sm: 0.96, height: 1.45, weight: 38,", "name: '청광묵', tier: 2, cls: '기동', role: '미드필더', weapon: '흑요석 단검', sm: 0.96, height: 1.3, weight: 38,")
rep(P, "고블린 전사 (145cm · 가벼움 · 옷만)", "고블린 전사 (130cm · 가벼움 · 옷만)")
rep(P, "return `회피 ×${k} — 근접은 맞는 순간 몸을 비틀어 흘리고,", "return `회피 ×${k} — 반사신경 · 센스 (난투 · 중거리에서도, 못 본 쪽도 감으로). 근접은 맞는 순간 몸을 비틀어 흘리고,")
rep(P, " × 지침 · 숨 (알아차린 상대만 · 자기도 공격 준비 중이면 절반)</span>`; })() : ''}",
       " × 지침 · 숨 (반사신경 · 센스 — 못 본 쪽은 감으로 ×${(Wd.rules.evade || {}).sense != null ? Wd.rules.evade.sense : 0.35} · 자기도 치는 중이면 ×${(Wd.rules.evade || {}).busy || 0.75})${(u.manN || 0) ? ` · 직접 움직여 피함 (노린 회피) ${u.manN}번` : ''}</span>`; })() : ''}")
rep(P, "f.c === 'v' ? '#8ff0ff' : '#f2e9da';", "f.c === 'v' ? '#8ff0ff' : f.c === 'g' ? '#ffd27a' : '#f2e9da';   // v6.7.1 피함! (노린 회피, 금빛)")
rep(P, "    case 'miss': { const a = U(e.a), b = U(e.b);\n", "    case 'miss': { const a = U(e.a), b = U(e.b);\n      if (e.man) return { c: 'good', s: `${ga(b.name)} 직접 몸을 움직여 ${a.name}의 ${e.fired ? (e.jav ? '창' : /총/.test(a.weapon || '') ? '탄환' : '화살') : '공격'}을 피한다 — 노린 회피!` };   // v6.7.1\n")
# migration: 회피 수치 · 청광묵 키
rep(P, "if (!S.v662a){", """// v6.7.1 확률 회피 = 반사신경 (저장된 수치표의 v6.7.0 값만 바꿈) · 청광묵 키 145 → 130cm (도감대로 — 저장된 판 · 내 설계 · 층도)
const fixGob671 = p => { if (!p || p.ref !== 'C-004' || +p.height !== 1.45) return false; p.height = 1.3; if (p.note) p.note = p.note.replace('145cm', '130cm'); return true; };
if (!S.v671){ const E0 = S.rules.evade, D = DEFAULT_RULES.evade; if (E0){ if (E0.busy === 0.5) E0.busy = D.busy; if (E0.crowd === 0.6) E0.crowd = D.crowd; if (E0.wall === 0.7) E0.wall = D.wall; if (E0.sense === undefined) E0.sense = D.sense; }
  for (const u of S.units) fixGob671(u); try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fixGob671(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}
  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fixGob671(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {} S.v671 = true; }
if (!S.v662a){""")
print('ok')
