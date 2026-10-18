import sys
def patch(P, reps):
    s=open(P).read()
    for a,b,n in reps:
        c=s.count(a)
        if c!=1: print('ANCHOR',P,n,c); sys.exit(1)
        s=s.replace(a,b)
    open(P,'w').write(s)

# ---------- head (rules) ----------
H=open('rt3_head.js').read()
i=H.index("  line: { link: 1.6, opp: 0.6,"); j=H.index("\n",i)+1
H=H[:j]+"  arc: { min: 2, aim: 0.7, miss: 1.0, mul: 0.85, pen: 0.6, shield: 0.7, head: 1.6, vel: 0.55, rapid: 0.25 },   // v5.8.4 곡사 (활): 앞이 막히면 높이 쏘아 넘김 — 최소 거리 (칸) · 명중 × · 빗나간 화살이 떨어지는 둘레 (칸, 멀수록 넓게) · 피해 × · 갑옷 꿰뚫기 × · 든 방패가 막을 확률 (어느 쪽이든) · 머리에 떨어지는 몫 × · 화살 속력 × · 연타 명령의 오사 허용\n"+H[j:]
open('rt3_head.js','w').write(H)

T='rt3_tail.js'
patch(T,[
# 1) 보병은 모두 돌진 (사수 · 원거리 · 개 · 사족보행 빼고)
("    // v5.3 돌격: 보병 (공격수) · 탱커 (전선) 의 공통 기술 (개 · 사족보행 빼고). [돌진] 은 카리우스의 돌격\n    const commonCharge = (rules.charge || {}).common !== false && !far && (role0 === '공격수' || role0 === '전선') && p.tac !== 'pack' && !tr.includes('사족보행');",
 "    // v5.3 돌격: 보병 (공격수) · 탱커 (전선) 의 공통 기술 (개 · 사족보행 빼고). [돌진] 은 카리우스의 돌격\n    // v5.8.4 근접 보병은 모두 (방패가 있든 없든 · 미드필더 · 지원도) — 사수 · 원거리 무기 · 무리 사냥 짐승 · 사족보행만 빼고. 방패를 들면 '방패 돌진' (달리는 동안에도 앞을 막음)\n    const commonCharge = (rules.charge || {}).common !== false && !far && role0 !== '사수' && p.tac !== 'pack' && !tr.includes('사족보행');",'charge'),
# 2) 활 = 곡사 가능
("      ammo: am0, ammoMax: am0, loud: far && !!wp.loud,",
 "      ammo: am0, ammoMax: am0, lob: far && wp.kind === '활', loud: far && !!wp.loud,   // v5.8.4 lob = 곡사 (활)\n     ",'lob'),
# 3) launch → 곡사
("function launch(W, u, t, mul, pMul){\n  const wp = (W.rules.weapons && W.rules.weapons[u.weapon]) || {};\n",
 "function launch(W, u, t, mul, pMul, arc){\n  if (arc){ launchArc(W, u, t, mul, pMul); return; }   // v5.8.4 곡사\n  const wp = (W.rules.weapons && W.rules.weapons[u.weapon]) || {};\n",'launch'),
("// 점사의 다음 발들 (회복 중에 이어서)",
 """// v5.8.4 곡사 (활): 높이 쏘아 올려 앞의 몸 (동료 · 방패 벽 · 큰 몸) 을 넘겨 떨굼. 쏜 순간 상대가 있던 자리로 떨어짐 (따라가지 않음 — 움직이면 피함).
// 맞힐 확률 = 직사 × arc.aim. 빗나가면 둘레 (몸 + 0.1 ~ + miss × (0.4 + 0.6 × 거리/사거리)) 에 떨어져, 그 자리의 몸 (아군도) 에 맞음. 날아가는 시간 = 거리 / (화살 속력 × arc.vel)
const arcSpread = (W, u, d) => ((W.rules.arc || {}).miss != null ? W.rules.arc.miss : 1) * (0.4 + 0.6 * Math.min(1, d / Math.max(1, u.rng)));
const arcAim = (W, u, t) => aimP(W, u, t) * ((W.rules.arc || {}).aim != null ? W.rules.arc.aim : 0.7);
function launchArc(W, u, t, mul, pMul){
  const A = W.rules.arc || {}, wp = (W.rules.weapons || {})[u.weapon] || {}, d = Math.max(0.3, dist(u, t)), p = Math.max(0.02, Math.min(0.99, arcAim(W, u, t) * (pMul || 1)));
  const a = W.rand() * 2 * Math.PI, rr = W.rand() < p ? Math.sqrt(W.rand()) * t.r * 0.5 : t.r + 0.1 + W.rand() * arcSpread(W, u, d);
  const lx = t.x + Math.cos(a) * rr, ly = t.y + Math.sin(a) * rr, ll = Math.hypot(lx - u.x, ly - u.y) || 1, T = Math.max(0.25, ll / Math.max(1, (wp.vel || 16) * (A.vel || 0.55)));
  W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x, y: u.y, x0: u.x, y0: u.y, dx: (lx - u.x) / ll, dy: (ly - u.y) / ll, lx, ly, T, el: 0, q: 0, arc: true, sp: 0, left: 0, p: +p.toFixed(2), t0: W.t, side: u.side, mul: mul || 1 });
}
// 떨어진 자리: 그 자리를 덮는 몸 (가장 가까운) 이 맞음 — 없으면 빈 바닥
function landArc(W, s){
  const u = W.units[s.a], A = W.rules.arc || {};
  let hit = null, hd = 1e9;
  for (const b of W.units){ if (!b.alive || b.i === s.a) continue; const d = Math.hypot(b.x - s.lx, b.y - s.ly); if (d <= b.r + 0.04 && d < hd){ hd = d; hit = b; } }
  if (!hit){ u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: `곡사 — 빈 바닥에 꽂힘 (명중률 ${Math.round(s.p * 100)}%)`, fired: true, p: s.p, arc: true }); if (W.fxOn) W.fx.push({ k: 'num', x: s.lx, y: s.ly, s: '빗나감', c: 'm', t0: W.t }); return; }
  strike(W, u, hit, W.units[s.meant], hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true, { arc: true, mul: (A.mul != null ? A.mul : 0.85) * (s.mul || 1) });
}
// 곡사로 쏠 수 있나: 활 · 탄이 있음 · 최소 거리 ~ 사거리 · 바위에 안 가림 (굴 천장 아래라 바위 너머로는 못 넘김)
function arcOK(W, u, t){
  const A = W.rules.arc; if (!A || !u.lob || (u.weaponNow && u.weaponNow !== u.weapon) || !t || !t.alive || (u.ammo != null && u.ammo <= 0)) return false;
  const g = gap(u, t); return g >= (A.min != null ? A.min : 2) && g <= u.rng && losClear(W.map, u.x, u.y, t.x, t.y);
}
// 곡사의 오사 확률: 빗나간 화살이 떨어지는 둘레에 서 있는 동료 (잠깐 뒤 자리까지)
function arcRisk(W, u, t){
  const p = arcAim(W, u, t), sp = arcSpread(W, u, Math.max(0.3, dist(u, t))), R0 = t.r + 0.1;
  const mates = W.units.filter(b => b.alive && b !== u && b.side === u.side && dist(b, t) < R0 + sp + b.r + 0.3);
  if (!mates.length) return { p: 0, who: null };
  let ff = 0, who = null, ww = 0; const cnt = {};
  for (let i = 0; i < 24; i++){ const a = i * Math.PI / 12, rr = R0 + sp * [0.2, 0.5, 0.85][i % 3], x = t.x + Math.cos(a) * rr, y = t.y + Math.sin(a) * rr;
    const b = mates.find(m => Math.hypot(m.x + (m.vx || 0) * 0.3 - x, m.y + (m.vy || 0) * 0.3 - y) <= m.r + 0.08);
    if (b){ ff += (1 - p) / 24; cnt[b.i] = (cnt[b.i] || 0) + 1; if (cnt[b.i] > ww){ ww = cnt[b.i]; who = b; } } }
  return { p: ff, who };
}
function startArc(W, u, t, why){
  startAct(W, u, t, why);
  if (u.act && u.act.k === 'atk'){ u.act.arc = true; const l = W.log[W.log.length - 1]; if (l && l.k === 'wind' && l.a === u.i) l.arc = true; }
}
function holdArc(W, u, t){
  const f = arcRisk(W, u, t); if (f.p <= 0.2) return false;
  L(W, { k: 'hold', a: u.i, b: t.i, by: f.who.i, arc: true, vis: u.side === 0 || !!u.seenBy }); u.ffWait = (u.ffWait || 0) + 0.3; return true;
}
// 점사의 다음 발들 (회복 중에 이어서)""",'arcfns'),
# 4) resolveAct: 곡사로 놓음 · 놓는 순간 떨어질 자리 둘레 확인
("    } else if (far && !ordFire(u, t) && holdFire(W, u, t, false)){ A.phase = 'rec'; A.end = W.t + 0.15; A.t1 = W.t; return; }",
 "    } else if (far && !ordFire(u, t) && (A.arc ? holdArc(W, u, t) : holdFire(W, u, t, false))){ A.phase = 'rec'; A.end = W.t + 0.15; A.t1 = W.t; return; }   // v5.8.4 곡사는 떨어질 자리 둘레를 봄",'hold'),
("      launch(W, u, t, n > 1 ? wp.burstMul || 0.65 : 1, 1);\n",
 "      launch(W, u, t, n > 1 ? wp.burstMul || 0.65 : 1, 1, A.arc);\n",'launchcall'),
# 5) stepShots: 곡사는 몸을 넘어 날아가 떨어진 자리에서만
("  for (const s of W.shots){\n    let rem = s.sp * dt;\n",
 "  for (const s of W.shots){\n    if (s.arc){ s.el += dt; s.q = Math.min(1, s.el / s.T); s.x = s.x0 + (s.lx - s.x0) * s.q; s.y = s.y0 + (s.ly - s.y0) * s.q; if (s.q >= 1){ s.done = true; landArc(W, s); if (W.fxOn) W.fx.push({ k: 'spark', x: s.lx, y: s.ly, t0: W.t, side: s.side }); } continue; }   // v5.8.4 곡사\n    let rem = s.sp * dt;\n",'step'),
# 6) strike: 곡사 — 옆 · 뒤 없음, 든 방패만 막음 (어느 쪽이든 arc.shield), 머리에 더, 덜 꿰뚫음
("  let dir = sideOf(W, t, u); const base",
 "  const arcX = !!(extra && extra.arc), AR = R.arc || {};   // v5.8.4 곡사: 위에서 떨어짐\n  let dir = arcX ? 'front' : sideOf(W, t, u); const base",'dir'),
("  const o = { led, dir, meant: meant !== t ? meant.i : null, ff: t.side === u.side, far: far != null ? far : isFar(u), p: p < 1 ? +p.toFixed(2) : null };",
 "  const o = { led, dir, meant: meant !== t ? meant.i : null, ff: t.side === u.side, far: far != null ? far : isFar(u), p: p < 1 ? +p.toFixed(2) : null, arc: arcX };",'o'),
("  if (inGuard(W, t, u, o.far || !!J)){",
 "  if (arcX ? t.shield && guardOn(W, t) && W.rand() < (AR.shield != null ? AR.shield : 0.7) : inGuard(W, t, u, o.far || !!J)){   // v5.8.4 곡사는 든 방패만 (머리 위로 기울여) 막음 — 무구 · 반사신경은 못 받음",'guard'),
("    o.block = true; o.tag = (extra && extra.tag) || null;\n",
 "    o.block = true; o.tag = (extra && extra.tag) || (arcX ? '방패를 들어 올려 막음' : null);\n",'tag'),
("  let tot = 0; for (const k in P) tot += P[k].w * (k === '머리' && exposed ? 2 : 1);\n  let r = W.rand() * tot, part = '몸통';\n  for (const k in P){ r -= P[k].w * (k === '머리' && exposed ? 2 : 1); if (r <= 0){ part = k; break; } }",
 "  const aH = arcX ? (AR.head != null ? AR.head : 1.6) : 1;   // v5.8.4 곡사는 머리 · 어깨로 떨어짐\n  let tot = 0; for (const k in P) tot += P[k].w * (k === '머리' ? (exposed ? 2 : 1) * aH : 1);\n  let r = W.rand() * tot, part = '몸통';\n  for (const k in P){ r -= P[k].w * (k === '머리' ? (exposed ? 2 : 1) * aH : 1); if (r <= 0){ part = k; break; } }",'head'),
("  const pen = !!pw && pw.pen != null && W.rand() < pw.pen + (pw.kind === '총포류' ? 0 : (pw.penStr != null ? pw.penStr : 0.5) * Math.max(0, (u.strMul || 1) - 1));",
 "  const pen = !!pw && pw.pen != null && W.rand() < (pw.pen + (pw.kind === '총포류' ? 0 : (pw.penStr != null ? pw.penStr : 0.5) * Math.max(0, (u.strMul || 1) - 1))) * (arcX ? (AR.pen != null ? AR.pen : 0.6) : 1);   // v5.8.4 곡사는 힘이 빠져 덜 꿰뚫음",'pen'),
# 7) shoot: 앞이 막히면 곡사
("  const now = ordered && u.order && u.order.now;   // v5.7.1 연달아 준 공격 = 바로 쏨 (오사 감수) · 한 번 = 사선을 열 자리를 먼저 잡음\n",
 "  const now = ordered && u.order && u.order.now;   // v5.7.1 연달아 준 공격 = 바로 쏨 (오사 감수) · 한 번 = 사선을 열 자리를 먼저 잡음\n  // v5.8.4 곡사: 앞이 막혔으면 (동료 · 이쪽을 막는 방패 · 큰 몸 · 명령한 상대 앞의 다른 적) 활은 높이 쏘아 넘김 — 떨어질 자리 둘레의 동료가 위험하면 안 함\n  if (first !== t && arcOK(W, u, t) && (first.side === u.side || first.bodyShield || ordered || inGuard(W, first, u, true)) && arcRisk(W, u, t).p <= (now ? (W.rules.arc || {}).rapid || 0.25 : ffLim(u, W))){ u.ffWait = 0; startArc(W, u, t, first.side === u.side ? '곡사 · 동료 너머로' : '곡사 · 앞을 넘겨'); return; }\n",'shoot'),
("function blockedShot(W, u, t, dt, ordered, b){\n",
 "function blockedShot(W, u, t, dt, ordered, b){\n  if (arcOK(W, u, t) && arcRisk(W, u, t).p <= ffLim(u, W)){ u.ffWait = 0; startArc(W, u, t, '곡사 · 동료 너머로'); return; }   // v5.8.4 사선에 동료 → 곡사로 넘김\n",'blocked'),
])
print('ok')
