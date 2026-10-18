def rep(path, a, b, n=1):
    s = open(path).read()
    c = s.count(a)
    assert c == n, (path, a[:90], c)
    s = s.replace(a, b)
    open(path, 'w').write(s)
T = 'rt3_tail.js'
# 1 helpers
rep(T, "function gradeMul(rules, traits, key){",
"""// v6.7 [급소X]: 치명 (약점) 확률 + (없으면 0) · [발화X]: 화상 등급 배율 (없으면 0)
function vitOf(rules, traits){ for (const t of traits || []) if (/^급소[SABC]$/.test(t)){ const g = rules.grades && rules.grades['급소']; return (g && g[t.slice(-1)]) || { S: 0.25, A: 0.18, B: 0.12, C: 0.06 }[t.slice(-1)]; } return 0; }
function fireOf(rules, traits){ for (const t of traits || []) if (/^발화[SABCDE]$/.test(t)){ const g = (rules.burn || {}).g || {}; return g[t.slice(-1)] || 1; } return 0; }
function gradeMul(rules, traits, key){""")
# 2 createWorld fields
rep(T, "r: bodyR(p.tier) * ((p.traits || []).includes('거구') ? 1.3 : 1), hp: s.hp",
       "r: bodyR(p.tier) * ((p.traits || []).includes('거구') ? 1.3 : 1) * (hh < 1.55 ? Math.max(0.8, hh / 1.6) : 1), hp: s.hp")
rep(T, "canLeap: tr.includes('도약') || acts.includes('도약'), leapCd: -9, active: acts,",
       "canLeap: tr.includes('도약') || acts.includes('도약'), leapCd: -9, active: acts,   // v5.2 액티브 스킬 (p.active)\n      ev: gradeMul(rules, tr, '회피'), vit: vitOf(rules, tr), fire: fireOf(rules, tr), palm: acts.includes('팜 버스트'), palmCd: -9, evadeCd: -9, evN: 0, blindL: tr.includes('실명:좌안'), burn: null, recoil: null,   // v6.7 [회피X] · [급소X] · [발화X] · [팜 버스트] · [실명:좌안] · 화상 · 반동")
rep(T, "jav: ((p.traits || []).includes('공통스킬:투창') || /창$/.test(p.weapon || '')) && (wp.kind === '날붙이' || /창$/.test(p.weapon || '')),",
       "jav: ((p.traits || []).includes('공통스킬:투창') || /창$/.test(p.weapon || '') || !!wp.thr) && (wp.kind === '날붙이' || /창$/.test(p.weapon || '')),   // v6.7 던지는 단검 (thr) 도")
rep(T, "  let k = 0; for (const u of W.units) if (u.side === 0 && !u.hero) u.slot = k++;\n",
"""  let k = 0; for (const u of W.units) if (u.side === 0 && !u.hero) u.slot = k++;
  for (const u of W.units) if (u.blindL && !u.eyeLost){ const M = rules.maim || {}; u.eyeLost = 1; u.sightMul = 1 - (1 - (M.oneEye != null ? M.oneEye : 0.75)) * 2 / u.eyes; u.eyeAim = 1 - (1 - (M.oneEyeAim != null ? M.oneEyeAim : 0.85)) * 2 / u.eyes; maimAim(u); }   // v6.7 [실명:좌안] 처음부터 왼눈이 없음 (보는 거리 · 조준 — 눈 하나를 잃은 것과 같음)
""")
# 4 JV helpers + call sites
rep(T, "const JV = W => W.rules.javelin || { wind: 0.7, vel: 18, rng: 6, aimNear: 0.97, aimFar: 0.75, mul: 2.2, crit: 0.35, critMul: 1.8, post: 2 };\n",
"""const JV = W => W.rules.javelin || { wind: 0.7, vel: 18, rng: 6, aimNear: 0.97, aimFar: 0.75, mul: 2.2, crit: 0.35, critMul: 1.8, post: 2 };
const KN = W => W.rules.knife || { wind: 0.25, vel: 26, rng: 5, aimNear: 0.95, aimFar: 0.62, mul: 0.8, crit: 0.2, critMul: 1.5, post: 0.5, pen: 0.45, penK: 0.6, jit: 0.25 };
const isKnife = (W, u) => !!(((W.rules.weapons || {})[u.weapon] || {}).thr);   // v6.7 던지는 단검 — 투창과 같은 길 (조준 → 던짐 → 맨손 → 주움), 수치만 knife
const JVu = (W, u) => isKnife(W, u) ? KN(W) : JV(W);
const wpnSpd = (W, u) => ((W.rules.weapons || {})[u.weaponNow || u.weapon] || {}).spdW || 1;   // v6.7 단검은 빠름 (근접 준비 · 회복 ×)
""")
rep(T, "-(jav ? JV(W).wind : u.wind || 0.5)", "-(jav ? JVu(W, u).wind : u.wind || 0.5)")
rep(T, "  const J = JV(W), f = Math.min(1, Math.max(0, gap(u, t)) / J.rng);", "  const J = JVu(W, u), f = Math.min(1, Math.max(0, gap(u, t)) / J.rng);")
rep(T, "function startThrow(W, u, t, why, ord){\n  const J = JV(W);", "function startThrow(W, u, t, why, ord){\n  const J = JVu(W, u);")
rep(T, "  const A = u.act, t = W.units[A.b], J = JV(W);\n  if (A.phase !== 'wind'){ u.act = null; return; }\n  let why = '';",
       "  const A = u.act, t = W.units[A.b], J = JVu(W, u);\n  if (A.phase !== 'wind'){ u.act = null; return; }\n  let why = '';")
rep(T, "  const J = JV(W), know = knows(W, u);", "  const J = JVu(W, u), know = knows(W, u);")
rep(T, "J = jav ? JV(W) : null, vel = J ? J.vel : wp.vel || 40;", "J = jav ? JVu(W, u) : null, vel = J ? J.vel : wp.vel || 40;")
rep(T, "(isFar(e) ? e.rng : JV(W).rng)", "(isFar(e) ? e.rng : JVu(W, e).rng)")
rep(T, "if (see && gap(u, t) <= JV(W).rng + 0.5 && tryThrow(", "if (see && gap(u, t) <= JVu(W, u).rng + 0.5 && tryThrow(")
rep(T, "const R = W.rules, J = extra && extra.jav ? JV(W) : null;", "const R = W.rules, J = extra && extra.jav ? (extra.kn ? KN(W) : JV(W)) : null;")
# javOdds rewrite
rep(T, """  const J = JV(W), P0 = { x, y, r: u.r, side: u.side, i: u.i }, g = Math.hypot(t.x - x, t.y - y) - u.r - t.r;
  if (g <= u.rng + 0.25 || g > J.rng || !losClear(W.map, x, y, t.x, t.y)) return 0;
  const first = firstOnLine(W, P0, t, u, knows(W, u));
  if (first !== t && ((first.side === u.side && ordered !== true) || (first.side !== u.side && inGuard(W, first, P0, true)))) return 0;""",
"""  const J = JVu(W, u), P0 = { x, y, r: u.r, side: u.side, i: u.i }, g = Math.hypot(t.x - x, t.y - y) - u.r - t.r;
  if (g <= u.rng + 0.25 || g > J.rng || !losClear(W.map, x, y, t.x, t.y)) return 0;
  const w = javWay(W, u, t, x, y);   // v6.7 앞이 막혔으면 곡사 (방패 틈이 열려 있으면 직사)
  if (w.arc){ if (ordered !== true && javArcRisk(W, u, t).p > ffLim(u, W)) return 0; const ox = u.x, oy = u.y; u.x = x; u.y = y; const p = aimJ(W, u, t) * (J.arc.aim != null ? J.arc.aim : 0.75); u.x = ox; u.y = oy; return Math.max(0.02, p); }
  const first = w.first;
  if (first !== t && ((first.side === u.side && ordered !== true) || (first.side !== u.side && inGuard(W, first, P0, true)))) return 0;""")
# javWay + arc helpers inserted before javOdds
rep(T, "// 이 자리 (x, y) 에서 t 에게 던질 수 있나:",
"""// v6.7 투창 곡사: 사선 앞이 막히면 (상대의 방패 · 큰 몸 · 동료 · 상대가 이쪽으로 든 방패) 높이 던져 넘김. 방패 틈 (사선이 열림) 이면 직사.
// 너무 가까우면 (arc.min 칸 아래) · 단검이면 곡사 없음 (no) — 그때는 예전처럼 직사 판단
function javWay(W, u, t, x, y){
  const J = JVu(W, u), P0 = { x, y, r: u.r, side: u.side, i: u.i }, first = firstOnLine(W, P0, t, u, knows(W, u));
  let blk = null;
  if (first !== t){ if (first.side === u.side || blocksFor(W, first, P0)) blk = first; }
  else if (inGuard(W, t, P0, true)) blk = t;
  if (!blk) return { arc: false, blk: null, first };
  const g = Math.hypot(t.x - x, t.y - y) - u.r - t.r;
  if (!J.arc || AI6.includes('jarc') || g < (J.arc.min != null ? J.arc.min : 2)) return { arc: false, blk, first, no: true };
  return { arc: true, blk, first };
}
const javArcSpread = (W, u, d) => { const J = JVu(W, u), A = J.arc || {}; return (A.miss != null ? A.miss : 0.9) * (0.4 + 0.6 * Math.min(1, d / Math.max(1, J.rng))); };
function javArcRisk(W, u, t){ const J = JVu(W, u), A = J.arc || {}, d = Math.max(0.3, dist(u, t)); return arcRisk(W, u, t, null, { p: aimJ(W, u, t) * (A.aim != null ? A.aim : 0.75), sp: javArcSpread(W, u, d), fly: Math.max(0.3, d / Math.max(1, J.vel * (A.vel || 0.7))), wind: J.wind }); }
// 곡사 투창: 떨어질 때의 자리를 겨눔 (솜씨만큼). 빗나가면 둘레에 떨어져 그 자리의 몸 (동료도) 에 맞음
function launchJavArc(W, u, t, p){
  const J = JVu(W, u), A = J.arc || {}, d = Math.max(0.3, dist(u, t)), vA = Math.max(1, J.vel * (A.vel || 0.7));
  const a = W.rand() * 2 * Math.PI, good = W.rand() < p, rr = good ? Math.sqrt(W.rand()) * t.r * 0.5 : t.r + 0.1 + W.rand() * javArcSpread(W, u, d);
  const T0 = Math.max(0.3, d / vA), ld = AI6.includes('nolead') ? 0 : Math.min(1, 0.5 + (u.marks || 0)) * T0;
  const lx = t.x + (t.vx || 0) * ld + Math.cos(a) * rr, ly = t.y + (t.vy || 0) * ld + Math.sin(a) * rr, ll = Math.hypot(lx - u.x, ly - u.y) || 1, T = Math.max(0.3, ll / vA);
  W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x, y: u.y, x0: u.x, y0: u.y, dx: (lx - u.x) / ll, dy: (ly - u.y) / ll, lx, ly, T, el: 0, q: 0, arc: true, sp: 0, left: 0, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: 1, jav: true, kn: isKnife(W, u), wpn: u.weapon });
}
// 이 자리 (x, y) 에서 t 에게 던질 수 있나:""")
# arcRisk overrides
rep(T, """function arcRisk(W, u, t, lead){
  const p = arcAim(W, u, t), sp = arcSpread(W, u, Math.max(0.3, dist(u, t))), R0 = t.r + 0.1;""",
"""function arcRisk(W, u, t, lead, ov){   // v6.7 ov = 곡사 투창 (명중 · 둘레 · 날아가는 시간)
  const p = ov ? ov.p : arcAim(W, u, t), sp = ov ? ov.sp : arcSpread(W, u, Math.max(0.3, dist(u, t))), R0 = t.r + 0.1;""")
rep(T, """  const A = W.rules.arc || {}, wp = (W.rules.weapons || {})[u.weapon] || {}, fly = Math.max(0.25, dist(u, t) / Math.max(1, (wp.vel || 16) * (A.vel || 0.55)));
  const lk = Math.min(1.6, lead != null ? lead : (u.act && u.act.k === 'atk' && u.act.phase === 'wind' ? Math.max(0, u.act.end - W.t) : u.wind || 0.5) + fly);""",
"""  const A = W.rules.arc || {}, wp = (W.rules.weapons || {})[u.weapon] || {}, fly = ov ? ov.fly : Math.max(0.25, dist(u, t) / Math.max(1, (wp.vel || 16) * (A.vel || 0.55)));
  const lk = Math.min(1.6, lead != null ? lead : (u.act && (u.act.k === 'atk' || u.act.k === 'throw') && u.act.phase === 'wind' ? Math.max(0, u.act.end - W.t) : ov ? ov.wind : u.wind || 0.5) + fly);""")
# resolveThrow: arc branch
rep(T, """  if (why) L(W, { k: 'miss', a: u.i, b: t.i, why: why + ' (창은 그대로)' });
  else if (!(A.ord && ordFire(u, t)) && holdFire(W, u, t, true)){ A.phase = 'rec'; A.end = W.t + 0.15; A.t1 = W.t; return; }   // v5.5.1 명령 투창은 멈추지 않음
  else {""",
"""  const way = why ? null : javWay(W, u, t, u.x, u.y);   // v6.7 던지는 순간 다시 봄: 앞이 막혔으면 곡사, 틈이 열렸으면 직사
  if (why) L(W, { k: 'miss', a: u.i, b: t.i, why: why + (isKnife(W, u) ? ' (단검은 그대로)' : ' (창은 그대로)') });
  else if (!(A.ord && ordFire(u, t)) && (way.arc ? javArcHold(W, u, t) : holdFire(W, u, t, true))){ A.phase = 'rec'; A.end = W.t + 0.15; A.t1 = W.t; return; }   // v5.5.1 명령 투창은 멈추지 않음
  else if (way.arc){
    const p = Math.max(0.02, aimJ(W, u, t) * (J.arc.aim != null ? J.arc.aim : 0.75));
    launchJavArc(W, u, t, p);
    u.shots++; u.spearHeld = false; u.rngSpear = u.rng; u.rng = (W.rules.weapons['맨손'] || { rng: 0.3 }).rng; u.weaponNow = '맨손';
    L(W, { k: 'throw', a: u.i, b: t.i, p: +p.toFixed(2), arc: true, over: way.blk.i, kn: isKnife(W, u), vis: u.side === 0 || !!u.seenBy });
  }
  else {""")
rep(T, "W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: J.vel, left: J.rng + u.r + 1.5, p: +p.toFixed(2), t0: W.t, side: u.side, jav: true, wpn: u.weapon });",
       "W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: J.vel, left: J.rng + u.r + 1.5, p: +p.toFixed(2), t0: W.t, side: u.side, jav: true, kn: isKnife(W, u), wpn: u.weapon });")
rep(T, "    L(W, { k: 'throw', a: u.i, b: t.i, p: +p.toFixed(2), vis: u.side === 0 || !!u.seenBy });\n  }\n  A.phase = 'rec'; A.end = W.t + u.rec; A.t1 = W.t;",
       "    L(W, { k: 'throw', a: u.i, b: t.i, p: +p.toFixed(2), kn: isKnife(W, u), vis: u.side === 0 || !!u.seenBy });\n  }\n  A.phase = 'rec'; A.end = W.t + u.rec; A.t1 = W.t;")
rep(T, "function holdFire(W, u, t, jav){",
"""// v6.7 곡사 투창의 오사: 빗나간 창이 떨어질 둘레에 동료가 있으면 멈춤 (20% 넘음)
function javArcHold(W, u, t){ const f = javArcRisk(W, u, t); if (f.p <= 0.2) return false; L(W, { k: 'hold', a: u.i, b: t.i, by: f.who.i, jav: true, arc: true, vis: u.side === 0 || !!u.seenBy }); u.ffWait = (u.ffWait || 0) + 0.3; return true; }
function holdFire(W, u, t, jav){""")
# tryThrow: arc threshold lower, why text
rep(T, "    if (p >= th && worth && sc > bs){ bs = sc; best = f; }\n  }\n  if (best){ startThrow(W, u, best, ordered ? '투창' : best.act ? '틈을 노림' : supportOf(W, best) === 0 ? '고립된 상대' : '투창', ordered); return true; }",
       "    const arc = javWay(W, u, f, u.x, u.y).arc, thA = arc ? th - 0.12 : th;   // v6.7 곡사 (방패 너머) 는 명중이 낮은 만큼 기준도 조금 낮춤\n    if (p >= thA && worth && sc + (arc ? 0.12 : 0) > bs){ bs = sc + (arc ? 0.12 : 0); best = f; bestArc = arc; }\n  }\n  if (best){ startThrow(W, u, best, (bestArc ? '방패 너머 곡사 · ' : '') + (ordered ? (isKnife(W, u) ? '투척' : '투창') : best.act ? '틈을 노림' : supportOf(W, best) === 0 ? '고립된 상대' : isKnife(W, u) ? '투척' : '투창'), ordered); return true; }")
rep(T, "  let best = null, bs = 0;\n  for (const f of cands){\n    const p = javOdds(W, u, f, u.x, u.y, ordered); if (!p) continue;",
       "  let best = null, bs = 0, bestArc = false;\n  for (const f of cands){\n    const p = javOdds(W, u, f, u.x, u.y, ordered); if (!p) continue;")
# strike edits
rep(T, "pw = J ? R.javelin || {} : isF ?", "pw = J ? J : isF ?")
rep(T, "crit = J ? W.rand() < J.crit : W.rand() < (CR.base || 0) + (pr ? CR.prone || 0 : 0)",
       "crit = J ? W.rand() < J.crit + (u.vit || 0) : W.rand() < (CR.base || 0) + (u.vit || 0) + (pr ? CR.prone || 0 : 0)")
rep(T, "* (arcX ? (AR.pen != null ? AR.pen : 0.6) : 1);", "* (arcX ? (J && J.arc && J.arc.pen != null ? J.arc.pen : AR.pen != null ? AR.pen : 0.6) : 1);")
rep(T, "armMul = AM.m * (wk === '총포류' && !t.human ? (R.gunTough != null ? R.gunTough : 1) : 1);",
       "gapHit = crit && (u.vit || 0) > 0 && !!AM.it, armMul = (gapHit ? 1 - (1 - AM.m) * 0.5 : AM.m) * (wk === '총포류' && !t.human ? (R.gunTough != null ? R.gunTough : 1) : 1);   // v6.7 [급소X] 의 치명은 갑옷 틈으로 (막는 몫 절반)")
rep(T, "o.hcrit = crit && !J; o.pen = pen && !!AM0.it;", "o.hcrit = crit && !J; o.pen = pen && !!AM0.it; o.gapHit = gapHit;")
rep(T, "  if (amb){ u.ambushes++;\n", "  if (o.gapHit && !o.tag) o.tag = '갑옷 틈을 찌름';   // v6.7\n  if (amb){ u.ambushes++;\n")
rep(T, "  applyDmg(W, u, t, dmg, o);\n  // v5.7 급소의 뒤:", "  applyDmg(W, u, t, dmg, o);\n  if (u.fire && !o.far && !J && unarmed(u) && t.alive && t.side !== u.side) burnOn(W, t, u, 1, !!AM0.it);   // v6.7 [발화X] 손바닥이 닿음 → 화상\n  // v5.7 급소의 뒤:")
# stepShots
rep(T, "        if (!b.alive || b.i === s.a) continue;\n        const k = Math.max(0,", "        if (!b.alive || b.i === s.a || (s.ev && s.ev.includes(b.i))) continue;   // v6.7 이미 피한 몸은 지나감\n        const k = Math.max(0,")
rep(T, "      const u = W.units[s.a];\n      if (hit){\n        s.done = true;", "      const u = W.units[s.a];\n      if (hit && evadeShot(W, hit, s)){ rem += st; continue; }   // v6.7 회피 — 실제로 비켜섬 (탄은 그대로 날아감)\n      if (hit){\n        s.done = true;")
rep(T, "s.jav ? { jav: true } : s.mul && s.mul !== 1", "s.jav ? { jav: true, kn: !!s.kn } : s.mul && s.mul !== 1")
# landArc rewrite
rep(T, """  const u = W.units[s.a], A = W.rules.arc || {};
  let hit = null, hd = 1e9;
  for (const b of W.units){ if (!b.alive || b.i === s.a) continue; const d = Math.hypot(b.x - s.lx, b.y - s.ly); if (d <= b.r + 0.04 && d < hd){ hd = d; hit = b; } }
  if (!hit){ u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: `곡사 — 빈 바닥에 꽂힘 (명중률 ${Math.round(s.p * 100)}%)${s.good ? ' · 겨눔은 맞았으나 상대가 움직임' : ''}`, fired: true, p: s.p, arc: true, good: !!s.good }); if (W.fxOn) W.fx.push({ k: 'num', x: s.lx, y: s.ly, s: '빗나감', c: 'm', t0: W.t }); return; }
  strike(W, u, hit, W.units[s.meant], hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true, { arc: true, mul: (A.mul != null ? A.mul : 0.85) * (s.mul || 1) });
}""",
"""  const u = W.units[s.a], A = W.rules.arc || {};
  let hit = null;
  for (;;){ let hd = 1e9; hit = null;
    for (const b of W.units){ if (!b.alive || b.i === s.a || (s.ev && s.ev.includes(b.i))) continue; const d = Math.hypot(b.x - s.lx, b.y - s.ly); if (d <= b.r + 0.04 && d < hd){ hd = d; hit = b; } }
    if (!hit || !evadeShot(W, hit, s)) break; }   // v6.7 떨어지는 화살 · 창을 보고 비켜섬
  if (!hit){ u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: `곡사 — 빈 바닥에 꽂힘 (명중률 ${Math.round(s.p * 100)}%)${s.good ? ' · 겨눔은 맞았으나 상대가 움직임' : ''}`, fired: true, p: s.p, arc: true, good: !!s.good, jav: !!s.jav }); if (W.fxOn) W.fx.push({ k: 'num', x: s.lx, y: s.ly, s: '빗나감', c: 'm', t0: W.t }); if (s.jav) dropSpear(W, s, s.lx, s.ly, 'miss'); return; }
  const J = s.jav ? (s.kn ? KN(W) : JV(W)) : null;
  const o2 = strike(W, u, hit, W.units[s.meant], hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true, { arc: true, jav: !!s.jav, kn: !!s.kn, mul: J ? (J.arc && J.arc.mul != null ? J.arc.mul : 0.95) : (A.mul != null ? A.mul : 0.85) * (s.mul || 1) });
  if (s.jav){ if (o2 && o2.block) dropSpear(W, s, hit.x - s.dx * 0.6, hit.y - s.dy * 0.6, 'block'); else dropSpear(W, s, hit.x + (W.rand() - 0.5) * 0.6, hit.y + (W.rand() - 0.5) * 0.6, 'stuck'); }   // v6.7 곡사 투창
}""")
# melee evade + weapon speed
rep(T, "      else if (A.mode) heavyHit(W, u, t, A.mode); else strike(W, u, t, t, dp);",
       "      else if (!evadeMelee(W, t, u)){ if (A.mode) heavyHit(W, u, t, A.mode); else strike(W, u, t, t, dp); }   // v6.7 회피 (몸을 비틀어 흘림)")
rep(T, "    A.phase = 'rec'; A.end = W.t + u.rec; A.t1 = W.t;\n    if (u.burst) A.end", "    A.phase = 'rec'; A.end = W.t + u.rec * (far ? 1 : wpnSpd(W, u)); A.t1 = W.t;   // v6.7 단검은 빨리 거둠\n    if (u.burst) A.end")
rep(T, "* (heal ? 1 : fatMul(W, u, 'wind'));", "* (heal ? 1 : fatMul(W, u, 'wind')) * (heal || isFar(u) || mode ? 1 : wpnSpd(W, u));   // v6.7 단검은 빠름")
rep(T, "  if (u.act.k === 'bash'){ resolveBash(W, u); return; }", "  if (u.act.k === 'bash'){ resolveBash(W, u); return; }\n  if (u.act.k === 'palm'){ resolvePalm(W, u); return; }   // v6.7")
# tryDodge: ordinary single blows go to evade
rep(T, "    else if (e.side !== u.side && a.b === u.i){ atk = e; break; }", "    else if (e.side !== u.side && a.b === u.i && (!W.rules.evade || AI6.includes('evade'))){ atk = e; break; }   // v6.7 보통 일격은 회피 (맞는 순간 몸을 비틂) 로 — 피하기 (비켜서기) 는 밀치기 · 휘두르기만")
# evade functions + burn + palm after tryDodge
rep(T, "// 발놀림: 맞붙기 전 기다릴 때 서 있지 않음",
"""/* ---------- v6.7 회피 (확률): 아슬아슬하게 살짝 움직여 피함 — '회피!' ---------- */
// 회피 확률 = 기본 (근접 · 원거리) × 민첩 (속력 ÷ 3, 0.3 ~ 1.35)^1.3 × 몸집 ((62 ÷ 무게)^0.25, 0.8 ~ 1.2) × [회피X] × 지침 · 숨.
// 알아차린 상대 (보임 · 등 뒤 아님) 만. 넘어짐 · 날아감 · 휘청 · 거구 · 기어다님 · 실명 · 달리는 중 (돌진 · 도약 · 비켜서기 · 팜 버스트) 은 못 피함.
// 원거리는 탄이 느릴수록 (v0 ÷ 탄속)² — 투창 · 투척 · 화살은 피할 수 있고 총알은 거의 못 피함. 곡사는 위에서 떨어져 × arc. 준비 중 × busy
function evadeP(W, u, a, kind, s){
  const E = W.rules.evade; if (!E || AI6.includes('evade') || !u.alive || u.giant || u.crawl || u.kb || u.blind || prone(W, u) || W.t < (u.stunT || -9) || W.t < (u.evadeCd || -9)) return 0;
  if (u.act && ['leap', 'dodge', 'palm'].includes(u.act.k)) return 0;
  if (u.act && u.act.k === 'charge' && u.act.phase === 'run') return 0;
  if (a && !aware(W, u, a)) return 0;
  const agi = Math.max(0.3, Math.min(1.35, u.spd * (u.spdMul || 1) * (W.t < u.pinT ? 0.4 : 1) / 3)), sz = Math.max(0.8, Math.min(1.2, Math.pow(62 / Math.max(25, u.mass || 62), 0.25)));
  let p = (kind === 'melee' ? E.melee : E.shot) * Math.pow(agi, 1.3) * sz * (u.ev || 1);
  if (kind === 'shot') p *= Math.min(1, Math.pow((E.v0 || 20) / Math.max(1, (s && s.sp) || 40), 2));
  if (kind === 'arc') p *= E.arc != null ? E.arc : 0.6;
  if (u.act && u.act.phase === 'wind') p *= E.busy != null ? E.busy : 0.5;
  if (kind === 'melee'){ if (a && backToWall(W, u, a)) p *= E.wall != null ? E.wall : 0.7; if (W.units.filter(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < f.rng + 0.5).length >= 3) p *= E.crowd != null ? E.crowd : 0.6; }
  else if (busyW(W, u)) p *= 0.7;
  p *= fatMul(W, u, 'dodge'); if (u.winded) p *= 0.85;
  return Math.min(E.cap || 0.75, p);
}
function evaded(W, t, a, how, why, p){
  const E = W.rules.evade || {};
  t.evadeCd = W.t + (E.cd || 1.4) / Math.max(1, t.ev || 1); t.evN = (t.evN || 0) + 1; if (a && how === 'melee') a.miss++;
  L(W, { k: 'evade', a: a ? a.i : null, b: t.i, how, why, p: +p.toFixed(2), vis: t.side === 0 || !!t.seenBy || (a && (a.side === 0 || !!a.seenBy)) });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '회피!', c: 'v', t0: W.t });
}
// 근접 회피: 맞는 순간 몸을 비틀어 흘림 (twist 칸 옆으로). 막을 수 있으면 (방패 · 무구가 그쪽) 막음
function evadeMelee(W, t, a){
  if (!t.alive || t.side === a.side || inGuard(W, t, a)) return false;
  const p = evadeP(W, t, a, 'melee'); if (!p || W.rand() >= p) return false;
  const E = W.rules.evade || {}, base = Math.atan2(t.y - a.y, t.x - a.x), sg = W.rand() < 0.5 ? 1 : -1, tw = E.twist || 0.22;
  for (const s of [sg, -sg]){ const ang = base + s * Math.PI / 2, x = t.x + Math.cos(ang) * tw, y = t.y + Math.sin(ang) * tw;
    if (!boxRock(W, x, y, t.r * 0.9) && !W.units.some(o => o.alive && o !== t && Math.hypot(o.x - x, o.y - y) < o.r + t.r * 0.8)){ tryMove(W, t, x, y); break; } }
  evaded(W, t, a, 'melee', '몸을 비틀어 흘림', p);
  return true;
}
// 원거리 회피: 날아오는 탄을 보고 실제로 비켜섬 (탄이 오는 줄의 옆으로 step 칸, 곡사는 떨어질 자리 밖으로). 탄은 그대로 날아가 뒤의 몸에 맞을 수 있음
function evadeShot(W, b, s){
  if (s.side === b.side || (s.ev && s.ev.includes(b.i))) return false;
  const a = W.units[s.a], p = evadeP(W, b, a, s.arc ? 'arc' : 'shot', s); if (!p || W.rand() >= p) return false;
  const E = W.rules.evade || {}, sg = W.rand() < 0.5 ? 1 : -1;
  let dirs;
  if (s.arc){ const d0 = Math.hypot(b.x - s.lx, b.y - s.ly), ax = d0 > 0.01 ? (b.x - s.lx) / d0 : Math.cos(W.rand() * 6.28), ay = d0 > 0.01 ? (b.y - s.ly) / d0 : Math.sin(W.rand() * 6.28), st = Math.max(E.step || 0.5, b.r + 0.12 - d0);
    dirs = [[ax, ay, st], [ax * 0.7 - ay * 0.7 * sg, ay * 0.7 + ax * 0.7 * sg, st]]; }
  else { const st = E.step || 0.5; dirs = [[-s.dy * sg, s.dx * sg, st], [s.dy * sg, -s.dx * sg, st]]; }
  for (const [dx, dy, st] of dirs){ const x = b.x + dx * st, y = b.y + dy * st;
    if (boxRock(W, x, y, b.r * 0.9) || !fatClear(W.map, b.x, b.y, x, y, b.r * 0.8) || W.units.some(o => o.alive && o !== b && Math.hypot(o.x - x, o.y - y) < o.r + b.r * 0.8)) continue;
    if (b.act && b.act.k !== 'charge') interrupt(W, b, '피하느라 준비가 끊김');
    b.burst = null; b.act = { k: 'dodge', phase: 'run', t0: W.t, end: W.t + (E.time || 0.15), fx: b.x, fy: b.y, tx: x, ty: y, b: a.i, ev: true }; stop(b);
    (s.ev = s.ev || []).push(b.i);
    evaded(W, b, a, s.arc ? 'arc' : 'shot', s.jav ? (s.kn ? '날아오는 단검을 보고 비켜섬' : '날아오는 창을 보고 비켜섬') : s.arc ? '떨어지는 화살을 보고 비켜섬' : '날아오는 탄을 보고 비켜섬', p);
    return true; }
  return false;
}
/* ---------- v6.7 [발화X] 화상 · [팜 버스트] (청광묵) ---------- */
// 화상: 손바닥이 닿으면 초당 dps × [발화] 등급 · t 초 (겹치면 max 까지, 다시 닿으면 시간이 새로). 갑옷 위로는 × armor
function burnOn(W, t, by, stacks, armored){
  const B = W.rules.burn || {}; if (!t.alive || !by.fire || AI6.includes('burn')) return;
  const was = t.burn && W.t < t.burn.until ? t.burn : null, add = (B.dps || 3) * by.fire * stacks * (armored ? (B.armor != null ? B.armor : 0.6) : 1);
  t.burn = { dps: Math.min((B.max || 9) * by.fire, (was ? was.dps : 0) + add), until: W.t + (B.t || 3), by: by.i };
  if (!was) L(W, { k: 'burn', a: by.i, b: t.i, dps: +t.burn.dps.toFixed(1), vis: t.side === 0 || by.side === 0 || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.35, s: '🔥', c: 'd', t0: W.t });
}
function stepBurn(W, u, dt){
  const b = u.burn; if (!b) return;
  if (W.t >= b.until){ u.burn = null; L(W, { k: 'burnStop', a: u.i, vis: u.side === 0 || !!u.seenBy }); return; }
  const d = b.dps * dt; u.burned = (u.burned || 0) + d;
  if (u.hp - d <= 0){ const by = W.units[b.by] || u; u.burn = null; applyDmg(W, by, u, Math.max(1, Math.ceil(u.hp)), { ff: by !== u && by.side === u.side, far: false, part: null, tag: '화상' }); return; }
  u.hp -= d;
}
const PALM = W => W.rules.palm || { wind: 0.25, rec: 0.45, cd: 5, reach: 0.35, kb: 1, kbExp: 0.6, skin: [1, 0.55, 0.55, 0.3, 0.3, 0.3], skinMul: 1.5, armMul: 0.55, armIgn: 0.5, post: 40, burnSkin: 2, burnArm: 1, recoil: 0.45, guard: 0.35 };
const palmReady = (W, u) => !!u.palm && u.alive && !u.noArms && W.t >= u.palmCd && W.t >= u.brokenT && !AI6.includes('palm');
function startPalm(W, u, t, why){
  const P = PALM(W), wind = P.wind * fatMul(W, u, 'wind');
  u.act = { k: 'palm', b: t.i, phase: 'wind', t0: W.t, end: W.t + wind, why: why || '팜 버스트' };
  u.palmCd = W.t + P.cd; u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u); u.waitT = 0;
  tire(W, u, 'bash');
  setMood(W, u, '팜 버스트', t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, palm: true, w: '손바닥', end: +(W.t + wind).toFixed(2), why: why || '', hid: u.side === 1 && !u.seenBy });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind });
}
// 손바닥을 대고 터뜨림: 막는 방패 · 무구에 닿으면 피해는 적고 자세를 크게 깎음. 몸에 닿으면 맨살일 확률 (몸 갑옷 등급) —
// 맨살 = 큰 피해 · 화상 두 겹, 갑옷 위 = 충격 (갑옷이 막는 몫 절반 무시) · 자세 · 화상 한 겹. 밀침 (가벼울수록 멀리 · 벽이면 짓눌림) · 본인은 반동으로 조금 튕겨 나감
function resolvePalm(W, u){
  const A = u.act, t = W.units[A.b], P = PALM(W), R = W.rules;
  if (A.phase !== 'wind'){ u.act = null; return; }
  A.phase = 'rec'; A.end = W.t + P.rec; A.t1 = W.t;
  let why = '';
  if (!t.alive) why = '대상이 이미 쓰러짐';
  else if (gap(u, t) > P.reach + R.reach) why = W.t - t.dodgedT < 0.5 ? '몸을 빼 피함' : '손바닥이 닿지 않음';
  else if (angDiff(u.face, Math.atan2(t.y - u.y, t.x - u.x)) > rv(W, 'faceArc', 70) * Math.PI / 180) why = '몸을 돌리지 못함';
  if (why){ u.miss++; L(W, { k: 'miss', a: u.i, b: t.i, why, palm: true }); return; }
  if (evadeMelee(W, t, u)) return;
  u.atkT = W.t;
  const d = dist(u, t) || 1, dx = (t.x - u.x) / d, dy = (t.y - u.y) / d, base = u.atk * u.atkMul * (R.lethal || 1) * (0.85 + 0.3 * W.rand());
  const o = { far: false, dir: sideOf(W, t, u), palm: true, wk: '맨손', part: '몸통' };
  let dmg, kbMul = 1, burnS = 0;
  if (inGuard(W, t, u)){
    t.post -= P.post * (t.gCost || 1) * fatMul(W, t, 'post'); t.blockT = W.t; t.blocked++; if (t.post <= 0){ t.post = 0; t.brokenT = W.t + R.breakTime; o.broke = true; }
    o.block = true; o.gn = t.armShield ? '팔' : t.shield ? '방패' : t.weapon || '반사신경'; o.tag = '팜 버스트 — ' + o.gn + '에 대고 터뜨림';
    dmg = Math.max(1, Math.round(base * (P.guard != null ? P.guard : 0.35))); kbMul = 0.6;
  } else {
    const it = t.gear && t.gear['몸'], tier = it ? it.tier : 0, sk = P.skin[Math.min(P.skin.length - 1, tier)], skin = W.rand() < (sk != null ? sk : 1);
    if (skin){ dmg = base * P.skinMul; burnS = P.burnSkin; o.skin = true; o.tag = '맨살에 팜 버스트 — 살이 타들어감'; }
    else { const AM = armorMul(R, t, '몸통', '맨손'); dmg = base * P.armMul * (1 - (1 - AM.m) * (1 - P.armIgn)); burnS = P.burnArm; o.armor = it ? it.name : null; o.tag = '팜 버스트 — ' + (it ? it.name : '갑옷') + ' 위로 충격'; t.post = Math.max(0, t.post - P.post * 0.5); }
    dmg = Math.max(1, Math.round(dmg * (t.modBody ? (R.modBody || {}).dmg || 0.7 : 1) * (prone(W, t) ? rv(W, 'proneHit', 1.5) : 1)));
    t.pinT = W.t + R.pinTime * (t.modBody ? (R.modBody || {}).pin || 0.5 : 1) * (t.vet ? VETR(W).pin : 1);
  }
  L(W, { k: 'palm', a: u.i, b: t.i, skin: !!o.skin, block: !!o.block, vis: u.side === 0 || t.side === 0 || !!u.seenBy || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'crush', x: (u.x + t.x) / 2, y: (u.y + t.y) / 2, t0: W.t });
  applyDmg(W, u, t, dmg, o);
  if (burnS && t.alive) burnOn(W, t, u, burnS, !o.skin);
  if (t.alive){ const kb = (P.kb || 1) * kbMul * Math.max(0.25, Math.min(1.4, Math.pow(80 / Math.max(30, t.mass || 62), P.kbExp || 0.6))); fling(W, u, t, kb, dx, dy, { how: '팜 버스트', downMul: 0.4 }); }
  const rc = P.recoil || 0; if (rc > 0 && u.alive && !wallBehind(W, u, -dx, -dy, u.r + 0.3)) u.recoil = { dx: -dx, dy: -dy, left: rc };   // 반동 (등 뒤가 벽이면 벽이 받아 줌)
}
function stepRecoil(W, u, dt){ const Q = u.recoil, st = Math.min(Q.left, 5 * dt); tryMove(W, u, u.x + Q.dx * st, u.y + Q.dy * st); Q.left -= st; if (Q.left <= 0.01) u.recoil = null; }
// 발놀림: 맞붙기 전 기다릴 때 서 있지 않음""")
# downOdds downMul + no-down
rep(T, "  p *= fatMul(W, u, 'down');   // v6.6 탈진하면 잘 넘어짐\n", "  p *= fatMul(W, u, 'down');   // v6.6 탈진하면 잘 넘어짐\n  if (K.o && K.o.downMul != null) p *= K.o.downMul;   // v6.7 팜 버스트는 덜 넘어뜨림\n")
# step loop: burn + recoil
rep(T, "  for (const u of W.units) if (u.alive && u.bleed) stepBleed(W, u, dt);   // v5.5 출혈\n",
       "  for (const u of W.units) if (u.alive && u.bleed) stepBleed(W, u, dt);   // v5.5 출혈\n  for (const u of W.units) if (u.alive && u.burn) stepBurn(W, u, dt);   // v6.7 화상\n  for (const u of W.units) if (u.alive && u.recoil && !u.kb) stepRecoil(W, u, dt);   // v6.7 팜 버스트 반동\n")
rep(T, "!(u.act && ['atk', 'charge', 'bash', 'throw'].includes(u.act.k))){   // v6.6", "!(u.act && ['atk', 'charge', 'bash', 'throw', 'palm'].includes(u.act.k))){   // v6.6")
# interrupt palm
rep(T, "(a.k === 'atk' || a.k === 'throw' || a.k === 'bash' || a.k === 'skill' || a.k === 'heal')) L(W, { k: 'miss', a: u.i, b: a.b, why });",
       "(a.k === 'atk' || a.k === 'throw' || a.k === 'bash' || a.k === 'skill' || a.k === 'heal' || a.k === 'palm')) L(W, { k: 'miss', a: u.i, b: a.b, why });")
# parry dagger name
rep(T, "return name === '단검' ? P.dagger || 15", "return /단검$/.test(name) ? P.dagger || 15")
# setWeapon jav
rep(T, "  u.jav = !far && /창$/.test(name); u.spearHeld = true;", "  u.jav = !far && (/창$/.test(name) || !!wp.thr); u.spearHeld = true;   // v6.7 던지는 단검")
# melee: palm
rep(T, """  if (inReach(u, t)){
    const bw = bashWhy(W, u, t); if (bw){ startBash(W, u, t, bw); return; }   // v5.2 방패 밀치기""",
"""  if (inReach(u, t)){
    const bw = bashWhy(W, u, t); if (bw){ startBash(W, u, t, bw); return; }   // v5.2 방패 밀치기
    if (palmReady(W, u) && gap(u, t) <= PALM(W).reach){ startPalm(W, u, t, inGuard(W, t, u) ? '방패째 터뜨림' : wallBehind(W, t, (t.x - u.x) / (dist(u, t) || 1), (t.y - u.y) / (dist(u, t) || 1), t.r + 0.6) ? '벽으로 날려 보냄' : '팜 버스트'); return; }   // v6.7 [팜 버스트]""")
# midfield escape: leap
rep(T, "    const p = fallbackPt(W, u, t, 2); if (p){ setMood(W, u, '빠져나감', t.i); goTo(W, u, p.x, p.y, dt); return true; }",
       "    const p = fallbackPt(W, u, t, 2); if (p){ if (u.canLeap && !u.crawl && W.t >= u.leapCd && startLeap(W, u, t)) return true; setMood(W, u, '빠져나감', t.i); goTo(W, u, p.x, p.y, dt); return true; }   // v6.7 도약이 있으면 뛰어 빠짐")
# doOrder palm
rep(T, "  if (o.k === 'throw'){\n    // 투창 명령:",
"""  if (o.k === 'palm'){   // v6.7 팜 버스트 명령: 그 상대에게 붙어 손바닥을 댐 (대기 중이면 붙어 싸우며 기다림)
    const t = W.units[o.b];
    if (!t || !t.alive || !u.palm || u.noArms){ u.order = null; return; }
    const see = canSee(W, u, t);
    if (!see && !(u.side === 0 ? t.seenBy : false)){ L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return; }
    if (see && gap(u, t) <= PALM(W).reach){ if (palmReady(W, u)){ startPalm(W, u, t, '팜 버스트'); u.order = null; return; } setMood(W, u, '팜 버스트 준비', t.i); fight(W, u, t, dt, see, true); return; }
    setMood(W, u, '팜 버스트하러', t.i); goTo(W, u, t.x, t.y, dt); return;
  }
  if (o.k === 'throw'){
    // 투창 명령:""")
# preempt lists
rep(T, "  if (o && ['attack', 'charge', 'throw', 'amove'].includes(o.k) && u.guardMode === 'hold'){", "  if (o && ['attack', 'charge', 'throw', 'amove', 'palm'].includes(o.k) && u.guardMode === 'hold'){")
rep(T, "  else if (mv && a && (['atk', 'throw', 'skill', 'bash', 'heal', 'reload'].includes(a.k)", "  else if (mv && a && (['atk', 'throw', 'skill', 'bash', 'heal', 'reload', 'palm'].includes(a.k)")
rep(T, "  else if (a && a.phase === 'wind' && (['atk', 'throw', 'skill', 'bash', 'heal'].includes(a.k) || (a.k === 'reload' && o && o.k === 'skill'))){\n    const same = o && a.b === o.b && ((o.k === 'attack' && a.k === 'atk') || (o.k === 'throw' && a.k === 'throw') || (o.k === 'skill' && a.k === 'skill'));",
       "  else if (a && a.phase === 'wind' && (['atk', 'throw', 'skill', 'bash', 'heal', 'palm'].includes(a.k) || (a.k === 'reload' && o && o.k === 'skill'))){\n    const same = o && a.b === o.b && ((o.k === 'attack' && (a.k === 'atk' || a.k === 'palm')) || (o.k === 'throw' && a.k === 'throw') || (o.k === 'skill' && a.k === 'skill') || (o.k === 'palm' && a.k === 'palm'));")
# orderTxt palm
rep(T, "const orderTxt = (o, u) => o && o.k === 'line' && o.join ? ['lineJoin'] :", "const orderTxt = (o, u) => o && o.k === 'palm' ? ['palm', o.b] : o && o.k === 'line' && o.join ? ['lineJoin'] :")
print('tail ok')
