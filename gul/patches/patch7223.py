# v7.22.3 엔진 — patch7223.py v1.1 (v1.1: 장판 느려짐 자리를 [가호:바다] 뒤로 · 히든보스 각혈의 기술 — 양쪽 같은 규칙: 혈영보 (순간이동 — 상대 등 뒤로) · 혈염 (둘레를 태우는 화염 · 동료도) · 핏빛 장판 (찍은 자리에 타는 웅덩이 · 그 안은 타고 느려짐 · 본 쪽은 피함) · 피의 검기 (곧게 날아가는 검기 · 둘까지 꿰뚫음) · 불 붙는 무기 (weapons fire — 근접으로 베면 화상) · 무기가 주는 기술 (weapons spec — 열화판) · 새 갑옷 재질 각혈갑)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "  spec: { quake: {", "  spec: { blink: { d: 9, min: 2.5, wind: 0.35, rec: 0.25, cd: 5, behind: 0.4 }, pyre: { r: 3, wind: 0.9, rec: 0.5, cd: 9, mul: 1.3, stacks: 2 }, pool: { rng: 7, r: 2, t: 6, wind: 0.6, rec: 0.4, cd: 12, tick: 0.5, stacks: 1, slow: 0.7 }, wave: { rng: 8, v: 16, w: 0.45, pierce: 2, wind: 0.45, rec: 0.35, cd: 4, mul: 1.6, stacks: 1, weak: 0.6 },   /* v7.22.3 혈영보 (d 칸 안 상대의 등 뒤로) · 혈염 (둘레 r 칸 · 화상 stacks) · 핏빛 장판 (rng 칸 안에 r 칸 · t 초 · tick 초마다 화상 · 걸음 × slow) · 피의 검기 (rng 칸 · 초당 v · pierce 명까지 · 무기가 준 열화판은 × weak) */\n    quake: {")
h = rep(h, "'대장군의 도끼':{rng:1.0, guard:true, two:true, kind:'날붙이'}", "'대장군의 도끼':{rng:1.0, guard:true, two:true, kind:'날붙이'}, '각혈의 장검':{rng:0.65, kind:'날붙이', fire:2, spec:'wave', specName:'피의 검기 (열화)'}")
h = rep(h, "    '두건': { slot: '머리',", "    '각혈갑': { slot: '몸', w: 0.012, vs: { '날붙이': 0.55, '둔기': 0.8, '짐승': 0.6, '활': 0.45, '총포류': 0.7, '마법': 0.8, '맨손': 0.7 } },   // v7.22.3 각혈의 갑옷 — 판금보다 가볍고 단단함 · 불 · 마법도 조금 막음\n    '두건': { slot: '머리',")
h = rep(h, "'투구': [90, 90], '두건': [0, 0] },", "'투구': [90, 90], '두건': [0, 0], '각혈갑': [110, 110] },")
wr('rt3_head.js', h)

s = rd('rt3_tail.js')
s = rep(s, "const SPEC_K = { '도약 강타': 'quake',", "const SPEC_K = { '혈영보': 'blink', '혈염': 'pyre', '핏빛 장판': 'pool', '피의 검기': 'wave', '도약 강타': 'quake',")
# 무기가 주는 기술 (열화판)
s = rep(s, "  setup.units.forEach((p, i) => unitInit(W, p, i));", "  setup.units.forEach((p, i) => unitInit(W, p, i));\n  for (const u of W.units) wpnSpec(W, u);   // v7.22.3 무기가 주는 기술 (열화판)")
s = rep(s, "  const i = W.units.length; unitInit(W, p, i); const u = W.units[i], rules = W.rules;", "  const i = W.units.length; unitInit(W, p, i); const u = W.units[i], rules = W.rules; wpnSpec(W, u);")
# 불 붙는 무기: 근접으로 베면 화상
s = rep(s, "  if (u.fire && !o.far && !J && unarmed(u) && t.alive && t.side !== u.side) burnOn(W, t, u, 1, !!AM0.it);   // v6.7 [발화X] 손바닥이 닿음 → 화상",
    "  if (u.fire && !o.far && !J && unarmed(u) && t.alive && t.side !== u.side) burnOn(W, t, u, 1, !!AM0.it);   // v6.7 [발화X] 손바닥이 닿음 → 화상\n  { const fw = !u.weaponGone && ((R.weapons || {})[u.weaponNow || u.weapon] || {}).fire; if (fw && !o.far && !J && t.alive && t.side !== u.side && !(extra && extra.noFire)) burnOn(W, t, { i: u.i, fire: fw }, 1, !!AM0.it); }   // v7.22.3 불 붙는 무기 (각혈의 장검)")
# 장판에서는 느려짐
s = rep(s, "(TER(W).water != null ? TER(W).water : 0.7)) : 1);   // v7.22 얕은 물 (v7.22.2 [가호:바다] 는 빨라짐)",
    "(TER(W).water != null ? TER(W).water : 0.7)) : 1) * (W.t < (u.poolSlowT == null ? -9 : u.poolSlowT) ? (SPR(W, 'pool').slow || 0.7) : 1);   // v7.22 얕은 물 (v7.22.2 [가호:바다] 는 빨라짐)   // v7.22.3 핏빛 장판")
s = rep(s, "  if (W.spins && W.spins.length) stepSpins(W, dt);   // v7.22.2 회전 투척", "  if (W.spins && W.spins.length) stepSpins(W, dt);   // v7.22.2 회전 투척 (v7.22.3 피의 검기도)\n  if (W.pools && W.pools.length) stepPools(W, dt);   // v7.22.3 핏빛 장판")
# 회전 투척 칼날 · 피의 검기: 검기는 pierce 명까지 · 떨어뜨리는 것 없음 · 화상
s = rep(s, "        const o = strike(W, by, e, e, 1, true, { mul: S.mul, tag: '회전하는 도끼', wk: '날붙이' });\n        if (e.alive && !e.kb && !(o && o.block)) shove(W, by, e, S.kb, S.dx, S.dy, { tag: '도끼에 쓸려 나감' }); } }",
    "        const o = strike(W, by, e, e, 1, true, { mul: S.mul, tag: S.wave ? '피의 검기' : '회전하는 도끼', wk: S.wave ? '마법' : '날붙이', noFire: true });\n        if (S.wave){ if (o && !o.block && e.alive && by) burnOn(W, e, { i: by.i, fire: Math.max(by.fire || 0, 2) }, S.burn || 1, !!(e.gear || {})['몸']); if (S.hit.length >= (S.pierce || 2)){ S.done = true; break; } }   // v7.22.3 검기는 pierce 명까지 · 화상\n        else if (e.alive && !e.kb && !(o && o.block)) shove(W, by, e, S.kb, S.dx, S.dy, { tag: '도끼에 쓸려 나감' }); } }")
s = rep(s, "    if (S.done){ const p = freeSpot(W, S.x, S.y, 0.15) || { x: S.x, y: S.y },", "    if (S.done && S.wave) L(W, { k: 'waveEnd', a: S.by, n: S.hit.length, vis: true });\n    else if (S.done){ const p = freeSpot(W, S.x, S.y, 0.15) || { x: S.x, y: S.y },")
# 기술 풀기
s = rep(s, "  if (k === 'spin'){   // v7.22.2 회전 투척:", r"""  if (k === 'blink'){   // v7.22.3 혈영보: 상대 등 뒤 (막힌 데면 옆 · 앞) 로 순간이동
    if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    const D0 = t.r + u.r + (S.behind || 0.4), f = t.face || 0, cand = [f + Math.PI, f + Math.PI / 2, f - Math.PI / 2, f].map((a, j) => ({ j, x: t.x + Math.cos(a) * D0, y: t.y + Math.sin(a) * D0 })).filter(p => p.x > u.r && p.y > u.r && p.x < W.map.W - u.r && p.y < W.map.H - u.r && !boxRock(W, p.x, p.y, u.r * 0.9) && !W.units.some(o => o.alive && o !== u && o !== t && Math.hypot(o.x - p.x, o.y - p.y) < o.r + u.r));
    if (!cand.length){ L(W, { k: 'miss', a: u.i, b: t.i, why: '나타날 자리가 없음', spec: k }); return; }
    const fx = u.x, fy = u.y, c = cand[0]; u.x = c.x; u.y = c.y; u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x); stop(u);   // 등 뒤 (j 0) → 옆 → 앞
    L(W, { k: 'blink', a: u.i, b: t.i, fx: +fx.toFixed(2), fy: +fy.toFixed(2), x: +u.x.toFixed(2), y: +u.y.toFixed(2), back: c.j === 0, vis: true });
    if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '혈영보', c: 'd', t0: W.t }); return;
  }
  if (k === 'pyre'){   // v7.22.3 혈염: 둘레 r 칸을 태움 (동료도) — 가까울수록 셈 · 화상
    const R2 = S.r || 3; let n = 0;
    for (const e of W.units){ if (!e.alive || e === u) continue; const d = dist(u, e); if (d > R2 + e.r) continue; n++; const f = 1 - Math.min(1, Math.max(0, d - e.r) / R2) * 0.5;
      const o = strike(W, u, e, e, 1, false, { mul: (S.mul || 1.3) * f, tag: '혈염', wk: '마법', noFire: true }); if (e.alive && !(o && o.block)) burnOn(W, e, u.fire ? u : { i: u.i, fire: 2 }, S.stacks || 2, !!(e.gear || {})['몸']); }
    L(W, { k: 'pyre', a: u.i, n, vis: true }); W.lightT = 0; if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '혈염!', c: 'd', t0: W.t }); return;
  }
  if (k === 'pool'){   // v7.22.3 핏빛 장판: 찍은 자리에 r 칸 · t 초
    const px = A.px != null ? A.px : t ? t.x : u.x, py = A.py != null ? A.py : t ? t.y : u.y;
    (W.pools || (W.pools = [])).push({ by: u.i, side: u.side, x: px, y: py, r: S.r || 2, until: W.t + (S.t || 6), tickT: W.t, t0: W.t });
    L(W, { k: 'pool', a: u.i, x: +px.toFixed(2), y: +py.toFixed(2), r: S.r || 2, sec: S.t || 6, vis: true }); return;
  }
  if (k === 'wave'){   // v7.22.3 피의 검기: 상대 쪽으로 곧게 날아감 (pierce 명까지 · 화상) — 무기가 준 열화판은 약함
    const x0 = specOf(u, 'wave') || {}, tx = t && t.alive ? t.x : u.x + Math.cos(u.face || 0), ty = t && t.alive ? t.y : u.y + Math.sin(u.face || 0), d = Math.hypot(tx - u.x, ty - u.y) || 1, dx = (tx - u.x) / d, dy = (ty - u.y) / d;
    (W.spins || (W.spins = [])).push({ wave: true, weak: !!x0.weak, by: u.i, side: u.side, x: u.x + dx * (u.r + 0.2), y: u.y + dy * (u.r + 0.2), dx, dy, v: S.v || 16, left: S.rng || 8, w: S.w || 0.45, mul: (S.mul || 1.6) * (x0.weak ? S.weak || 0.6 : 1), kb: 0, pierce: S.pierce || 2, burn: S.stacks || 1, hit: [], t0: W.t });
    L(W, { k: 'wave', a: u.i, b: t ? t.i : null, weak: !!x0.weak, vis: true }); return;
  }
  if (k === 'spin'){   // v7.22.2 회전 투척:""")
# 스스로 쓰기: 혈염 (둘러싸임) · 혈영보 (멀면 등 뒤로 · 둘러싸이면 먼 사수에게) · 핏빛 장판 (사수 · 모인 무리) · 피의 검기 (먼 상대 · 동료가 길에 없을 때)
s = rep(s, "  if (specReady(W, u, 'quake')){ const Q = SPR(W, 'quake'), mn = Q.min || 3, mx = Q.d || 9;",
    r"""  { const crowd = W.units.filter(e => e.alive && e.side !== u.side && gap(u, e) <= 1.2).length;   // v7.22.3 각혈의 기술 (갖춘 이는 누구나 같은 판단)
    if (specReady(W, u, 'pyre')){ const r = SPR(W, 'pyre').r || 3, fe = W.units.filter(e => e.alive && e.side !== u.side && dist(u, e) <= r + e.r).length, al = W.units.filter(e => e.alive && e !== u && e.side === u.side && dist(u, e) <= r + e.r).length; if (fe >= 2 && al === 0) return startSpec(W, u, null, 'pyre', '둘레를 피의 불길로 태움'); }
    if (specReady(W, u, 'blink')){ const B = SPR(W, 'blink');
      if (crowd >= 3){ const far = W.units.filter(e => e.alive && e.side !== u.side && canSee(W, u, e) && dist(u, e) >= (B.min || 2.5) && dist(u, e) <= (B.d || 9)).sort((a, b) => (isFar(b) - isFar(a)) || (dist(u, b) - dist(u, a)))[0]; if (far) return startSpec(W, u, far, 'blink', '둘러싼 무리를 빠져 먼 상대 뒤로'); }
      else if (g >= (B.min || 2.5) + 1.5 && g <= (B.d || 9)) return startSpec(W, u, t, 'blink', '상대 등 뒤로 순간이동'); }
    if (specReady(W, u, 'pool') && g >= 3 && g <= (SPR(W, 'pool').rng || 7)){ const near = W.units.filter(e => e.alive && e.side !== u.side && dist(e, t) <= 2).length; if (isFar(t) || near >= 2){ startSpec(W, u, t, 'pool', '핏빛 장판'); u.act.px = t.x + (t.vx || 0) * 0.5; u.act.py = t.y + (t.vy || 0) * 0.5; return true; } }
    if (specReady(W, u, 'wave')){ const P3 = SPR(W, 'wave'); if (g > u.rng + 1 && g <= (P3.rng || 8) - 0.5){ const d0 = dist(u, t) || 1, ex = u.x + (t.x - u.x) / d0 * (P3.rng || 8), ey = u.y + (t.y - u.y) / d0 * (P3.rng || 8); if (!W.units.some(e => e.alive && e !== u && e.side === u.side && segD(u, ex, ey, e) < (P3.w || 0.45) + e.r)) return startSpec(W, u, t, 'wave', '피의 검기'); } } }
  if (specReady(W, u, 'quake')){ const Q = SPR(W, 'quake'), mn = Q.min || 3, mx = Q.d || 9;""")
s = rep(s, "function startQuake(W, u, tx, ty, why){", r"""// v7.22.3 무기가 주는 기술 (열화판): 든 무기의 spec 을 아직 없으면 더함 (weak)
function wpnSpec(W, u){ const wp = (W.rules.weapons || {})[u.weapon] || {}; if (!wp.spec || u.weaponGone || (u.spec || []).some(x => x.k === wp.spec)) return; (u.spec = u.spec || []).push({ k: wp.spec, name: wp.specName || wp.spec, cdT: -9, n: null, weak: true }); }
// v7.22.3 핏빛 장판: tick 초마다 안에 선 모두 (깐 이는 빼고 · 동료도) 화상 · 느려짐 — 장판을 본 쪽은 밖으로 피함
function stepPools(W, dt){
  const S = SPR(W, 'pool');
  for (const P of W.pools){ if (W.t >= P.until) continue; const by = W.units[P.by];
    for (const e of W.units){ if (!e.alive || e.i === P.by) continue; const d = Math.hypot(e.x - P.x, e.y - P.y); if (d > P.r + e.r * 0.5) continue;
      e.poolSlowT = W.t + 0.3;
      if (!e.flee && !e.down && !e.kb && (litAt(W, P.x, P.y) || d < 1.5) && !(e.act && e.act.phase !== 'wind')){ const a = d > 0.05 ? Math.atan2(e.y - P.y, e.x - P.x) : W.rand() * 6.283, D = P.r + e.r + 0.4;
        e.flee = { x: Math.max(0.6, Math.min(W.map.W - 0.6, P.x + Math.cos(a) * D)), y: Math.max(0.6, Math.min(W.map.H - 0.6, P.y + Math.sin(a) * D)), until: W.t + 1.2 }; L(W, { k: 'poolFlee', a: e.i, b: P.by, vis: e.side === 0 || !!e.seenBy }); } }
    if (W.t >= P.tickT){ P.tickT = W.t + (S.tick || 0.5);
      for (const e of W.units){ if (!e.alive || e.i === P.by || Math.hypot(e.x - P.x, e.y - P.y) > P.r + e.r * 0.5) continue; burnOn(W, e, by && by.fire ? by : { i: P.by, fire: 2 }, S.stacks || 1, !!(e.gear || {})['몸']); } } }
  W.pools = W.pools.filter(P => W.t < P.until);
}
function startQuake(W, u, tx, ty, why){""")
s = rep(s, "module.exports = { startQuake,", "module.exports = { wpnSpec, stepPools, startQuake,")
wr('rt3_tail.js', s)
print('patch7223 OK')
