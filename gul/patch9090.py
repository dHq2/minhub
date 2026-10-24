# v9.6.3 엔진 — patch9090.py v1.0 (v1.0: 민수 판 분석 — ① 버팀 계산이 전열 명단에 이름을 계속 밀어 넣던 것 (로그에 이름 수백 번) ② 카리우스의 기술은 자리 안의 동료도 맞음 (오사 — 노인의 팔 · 라이트 훅 · 철퇴 · 짓밟기 · 몸박) · 찍기는 한 점 (표적 자리 둘레 0.45칸 — 곁에 붙은 몸도 휩쓸림) ③ 위험 범위의 동료는 비켜! 를 듣고 서둘러 피함 (모든 예고 공격 · 같은 편이면 더 잘 피함 · 제자리 명령이어도) ④ 카리우스는 못 피할 동료 (넘어짐 · 붙잡힘 · 제자리) 가 있거나 동료가 적보다 많이 걸리면 그 기술을 아낌 ⑥ 물레의 정령 계약 기록은 pact8 (협공 약속과 이름이 겹쳐 로그가 섞이던 것) ⑤ 자리를 지키던 근접이 화살을 맞으면 (따라다니던 날쌘 이도 보이지 않는 사수에게 4초 안에 두 번 맞으면) — 쏜 자가 보이면 그에게, 안 보이면 날쌘 이 (기동 · 대담) 는 날아온 쪽으로 · 아니면 본대로)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9080.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# ① 버팀: 전열 명단 (ln.ids) 을 건드리지 않음
rep("if (t.line){ const ids = t.line.ln.ids, k = t.line.k;", "if (t.line){ const lids = t.line.ln.ids, k = t.line.k;   /* v9.6.3 전열 명단은 읽기만 (예전엔 받쳐 준 몸을 거기 밀어 넣어 로그에 이름이 수백 번) */")
rep("const o = ids[j] != null ? W.units[ids[j]] : null;", "const o = lids[j] != null ? W.units[lids[j]] : null;")
# ② 카리우스 오사: 부채꼴 · 자리 · 줄 안의 동료도
rep("const karFan = (W, u, ang, R, arc, air) => W.units.filter(e => e.alive && !e.gone && e.side !== u.side &&",
    "const karFan = (W, u, ang, R, arc, air, ff) => W.units.filter(e => e.alive && !e.gone && e !== u && (ff || e.side !== u.side) && !(ff && e.side === u.side && e.summon === 'slime') &&")
rep("hit = karFan(W, u, ang, S.r || 2.7, arc, true);", "hit = karFan(W, u, ang, S.r || 2.7, arc, true, true);   /* v9.6.3 동료도 맞음 */")
rep("hit = karFan(W, u, ang, S.r || 1.9, arc, last);", "hit = karFan(W, u, ang, S.r || 1.9, arc, last, true);")
rep("for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || airOf(e) || e.jrFly || Math.hypot(e.x - px, e.y - py) > R + e.r) continue; n++;\n      if (prone(W, e)){",
    "for (const e of W.units){ if (!e.alive || e.gone || e === u || airOf(e) || e.jrFly || Math.hypot(e.x - px, e.y - py) > R + e.r) continue; n++;   /* v9.6.3 동료도 밟힘 (누운 동료는 확인사살 아님) */\n      if (prone(W, e) && e.side !== u.side){")
rep("for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || e.jrFly || Math.hypot(e.x - px, e.y - py) > R + e.r) continue; n++;\n      const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.67",
    "for (const e of W.units){ if (!e.alive || e.gone || e === u || e.jrFly || Math.hypot(e.x - px, e.y - py) > R + e.r) continue; n++;   /* v9.6.3 동료도 */\n      const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.67")
rep("if (!e.alive || e.gone || e.side === u.side || A.hit.includes(e.i) || airOf(e) || e.jrFly || dist(u, e) > u.r + e.r + 0.15) continue;",
    "if (!e.alive || e.gone || e === u || A.hit.includes(e.i) || airOf(e) || e.jrFly || dist(u, e) > u.r + e.r + 0.15) continue;   /* v9.6.3 길의 동료도 */")
# 예고 모양: 동료도 피함 (foe 를 뗌) · 짓밟기 · 철퇴는 자리 (원)
rep("what: A.s === 'ksw' ? '노인의 팔' : '라이트 훅', foe: true };", "what: A.s === 'ksw' ? '노인의 팔' : '라이트 훅', ff: true };")
rep("  if (A.s === 'kslam') return { k: 'fan', ang, arc: 1.0, R: (S.ahead || 1.3) + (S.r || 1.3) + 0.3, what: '노인의 팔 철퇴', foe: true };",
    "  if (A.s === 'kslam') return { k: 'circle', ang, x: A.px != null ? A.px : a.x + Math.cos(ang) * (S.ahead || 1.3), y: A.py != null ? A.py : a.y + Math.sin(ang) * (S.ahead || 1.3), R: (S.r || 1.3) + 0.3, what: '노인의 팔 철퇴', ff: true };   /* v9.6.3 자리 (원) */\n  if (A.s === 'kstomp') return { k: 'circle', ang, x: A.px != null ? A.px : t.x, y: A.py != null ? A.py : t.y, R: (S.r || 0.95) + 0.3, what: '짓밟으려는 발', ff: true };")
rep("what: '돌진 몸박', foe: true };\n  return { k: 'one'", "what: '돌진 몸박', ff: true };\n  return { k: 'one'")
# 예고 안에 있나 (한 곳에서) + 카리우스가 기술을 아낄지
rep("function tgTick(W){", """function tgIn(W, a, Z, e){   // v9.6.3 예고 범위 안에 있나 — 한 몸 · 원 (자리) · 줄 · 부채꼴
  const dx = e.x - a.x, dy = e.y - a.y, d = Math.hypot(dx, dy), al = dx * Math.cos(Z.ang) + dy * Math.sin(Z.ang), lat = -dx * Math.sin(Z.ang) + dy * Math.cos(Z.ang);
  return Z.k === 'one' ? e.i === Z.b : Z.k === 'circle' ? Math.hypot(e.x - Z.x, e.y - Z.y) - e.r < Z.R : Z.k === 'line' ? al > 0 && al < Z.len && Math.abs(lat) < Z.w + e.r : d - e.r < Z.R && angDiff(Math.atan2(dy, dx), Z.ang) < Z.arc + 0.25;
}
function karFFOk(W, u, t, k){   // v9.6.3 카리우스: 못 피할 동료가 걸리거나 동료가 적보다 많이 걸리면 그 기술을 아낌
  if (!t) return true; const Z = karTg(W, u, { s: k, ...karAim(W, u, t, k) }, t); if (Z.k === 'one') return true;
  const M = W.units.filter(e => e.alive && !e.gone && e !== u && e.side === u.side && e.summon !== 'slime' && tgIn(W, u, Z, e)); if (!M.length) return true;
  if (M.some(e => e.down || e.crawl || prone(W, e) || e.heldBy != null || W.t < (e.stunT || -9) || (e.act && e.act.k === 'charge' && e.act.phase === 'run'))) return false;
  return W.units.filter(e => e.alive && !e.gone && e.side !== u.side && tgIn(W, u, Z, e)).length > M.length;
}
function tgTick(W){""")
rep("    else if (A.k === 'atk' && A.mode === 'sweep' && t){ const S = W.rules.sweep || {}; Z = { k: 'fan', ang: Math.atan2(t.y - a.y, t.x - a.x), arc: (S.arc || 65) * Math.PI / 180, R: a.rng + (S.reach || 0.35) + 0.3, what: '넓게 휘두르기' }; }",
    "    else if (A.k === 'atk' && A.mode === 'sweep' && t){ const S = W.rules.sweep || {}; Z = { k: 'fan', ang: Math.atan2(t.y - a.y, t.x - a.x), arc: (S.arc || 65) * Math.PI / 180, R: a.rng + (S.reach || 0.35) + 0.3, what: '넓게 휘두르기' }; }\n    else if (A.k === 'atk' && A.mode === 'smash' && t){ const H = W.rules.heavy || {}; Z = { k: 'circle', ang: Math.atan2(t.y - a.y, t.x - a.x), x: t.x, y: t.y, R: (H.splash != null ? H.splash : 0.45) + 0.25, what: '찍기', skip: t.i }; }   /* v9.6.3 찍기 = 한 점 (곁에 붙은 몸은 비킴) */")
rep("      const inZ = Z.k === 'one' ? e.i === Z.b : Z.k === 'line' ? al > 0 && al < Z.len && Math.abs(lat) < Z.w + e.r : d - e.r < Z.R && angDiff(Math.atan2(dy, dx), Z.ang) < Z.arc + 0.25;",
    "      const inZ = tgIn(W, a, Z, e) && e.i !== Z.skip, ff = e.side === a.side;   /* v9.6.3 같은 편 공격 (비켜!) */")
rep("      if (!aware(W, e, a) || (e.order && e.order.k === 'hold') || (W.duel && e.i === W.duel.me)",
    "      if (!(ff ? canSee(W, e, a) || dist(e, a) < 6 : aware(W, e, a)) || (e.order && e.order.k === 'hold' && !ff) || (W.duel && e.i === W.duel.me)")
rep("      if (W.rand() >= tgDodgeP(W, e)){ L(W, { k: 'tgLate', a: e.i, b: a.i, what: Z.what, vis: e.side === 0 || !!e.seenBy }); continue; }\n      const s = Z.k === 'fan' ? 0 : (lat >= 0 ? 1 : -1), D = Z.k === 'fan' ? Math.max(Z.R - d + e.r + 0.4, 0.8) : Math.max(0.9, (Z.w || 0.6) + e.r + 0.3 - Math.abs(lat)) + 0.2;\n      const ox = Z.k === 'fan' ? dx / (d || 1) : -Math.sin(Z.ang) * s, oy = Z.k === 'fan' ? dy / (d || 1) : Math.cos(Z.ang) * s;",
    "      if (W.rand() >= Math.min(0.95, tgDodgeP(W, e) * (ff ? 1.6 : 1))){ L(W, { k: 'tgLate', a: e.i, b: a.i, what: Z.what, ff, vis: e.side === 0 || !!e.seenBy }); continue; }\n      const cd = Z.k === 'circle' ? Math.hypot(e.x - Z.x, e.y - Z.y) || 0.01 : 1, s = Z.k === 'fan' ? 0 : (lat >= 0 ? 1 : -1), D = Z.k === 'circle' ? Math.max(Z.R - cd + e.r + 0.4, 0.8) : Z.k === 'fan' ? Math.max(Z.R - d + e.r + 0.4, 0.8) : Math.max(0.9, (Z.w || 0.6) + e.r + 0.3 - Math.abs(lat)) + 0.2;\n      const ox = Z.k === 'circle' ? (e.x - Z.x) / cd : Z.k === 'fan' ? dx / (d || 1) : -Math.sin(Z.ang) * s, oy = Z.k === 'circle' ? (e.y - Z.y) / cd : Z.k === 'fan' ? dy / (d || 1) : Math.cos(Z.ang) * s;")
rep("      e.flee = { x: fx, y: fy, until: A.end + 0.35, why: Z.what + ' — 피함' };\n      L(W, { k: 'tgDodge', a: e.i, b: a.i, what: Z.what, vis: e.side === 0 || !!e.seenBy || a.side === 0 });",
    "      e.flee = { x: fx, y: fy, until: A.end + 0.35, why: Z.what + ' — 피함' }; e.mv = { k: 'crun', run: true, until: A.end + 0.35 };   /* v9.6.3 서둘러 (호다닥) */\n      L(W, { k: 'tgDodge', a: e.i, b: a.i, what: Z.what, ff, vis: e.side === 0 || !!e.seenBy || a.side === 0 });")
# 카리우스 스스로: 기술을 아낌
rep("    if (dn) return startSpec(W, u, dn, 'kstomp',", "    if (dn && karFFOk(W, u, dn, 'kstomp')) return startSpec(W, u, dn, 'kstomp',")
rep(") return startSpec(W, u, t, 'krush',", " && karFFOk(W, u, t, 'krush')) return startSpec(W, u, t, 'krush',")
rep("d <= (SPR(W, 'kslam').d || 2.3) + t.r) return startSpec(W, u, t, 'kslam',", "d <= (SPR(W, 'kslam').d || 2.3) + t.r && karFFOk(W, u, t, 'kslam')) return startSpec(W, u, t, 'kslam',")
rep("!airOf(t) && W.rand() < 0.3) return startSpec(W, u, t, 'kstomp',", "!airOf(t) && W.rand() < 0.3 && karFFOk(W, u, t, 'kstomp')) return startSpec(W, u, t, 'kstomp',")
rep("d <= (SPR(W, 'khook').r || 1.9) + t.r) return startSpec(W, u, t, 'khook',", "d <= (SPR(W, 'khook').r || 1.9) + t.r && karFFOk(W, u, t, 'khook')) return startSpec(W, u, t, 'khook',")
rep(".length) return startSpec(W, u, t, 'ksw',", ".length && karFFOk(W, u, t, 'ksw')) return startSpec(W, u, t, 'ksw',")
# 찍기: 한 점 — 표적 자리 둘레 몸 (동료 포함) 도 휩쓸림
rep("  // 찍기: 한 놈에게 무겁게. 막아도 자세가 크게 깎임 (방패벽을 깨는 망치)\n  const o = strike(W, u, t, t, 1, false, { mul: H.mul || 1.3, wk, tag: '찍기', heavyCrit: H.crit || 0.2 });",
    "  // 찍기: 한 놈에게 무겁게. 막아도 자세가 크게 깎임 (방패벽을 깨는 망치)\n  const spx = t.x, spy = t.y, spR = H.splash != null ? H.splash : 0.45;   /* v9.6.3 찍기는 한 점 — 그 자리 둘레 (0.45칸) 에 몸을 걸친 이는 동료든 적이든 휩쓸림 */\n  for (const e of W.units){ if (!e.alive || e.gone || e === u || e === t || airOf(e) || e.jrFly || Math.hypot(e.x - spx, e.y - spy) > spR + e.r) continue; strike(W, u, e, e, 1, false, { mul: (H.mul || 1.3) * (H.splashMul != null ? H.splashMul : 0.6), wk, tag: '찍기 — 휩쓸림' }); }\n  const o = strike(W, u, t, t, 1, false, { mul: H.mul || 1.3, wk, tag: '찍기', heavyCrit: H.crit || 0.2 });")
# ⑤ 자리를 지키다 화살을 맞음
rep("  const seen = foes.filter(f => canSee(W, u, f) && ((me && !u.stay) || dist(f, anchor) <= lim || (u.stay && dist(f, u) <= near0) || (u.cg && mateNear(W, u, f, lim)))).sort((a, b) => dist(u, a) - dist(u, b));",
    "  const shotMe = f => isFar(f) && (f.target === u || (f.act && f.act.b === u.i && f.act.phase === 'wind'));   /* v9.6.3 나를 쏘는 사수는 자리 밖이어도 봄 */\n  const seen = foes.filter(f => canSee(W, u, f) && ((me && !u.stay) || dist(f, anchor) <= lim || (u.stay && dist(f, u) <= near0) || (u.cg && mateNear(W, u, f, lim)) || (u.stay && !isFar(u) && shotMe(f)))).sort((a, b) => dist(u, a) - dist(u, b));")
rep("  if (u.stay && seen.some(f => dist(f, u) <= near0) && Math.hypot(u.x - u.stay.x, u.y - u.stay.y) > 2.5) u.stay = { x: u.x, y: u.y };",
    """  if (u.stay && seen.some(f => dist(f, u) <= near0) && Math.hypot(u.x - u.stay.x, u.y - u.stay.y) > 2.5) u.stay = { x: u.x, y: u.y };
  const inc2 = !u.stay && u.side === 0 && (W.inc || []).filter(q => q.by === u.i && W.t - q.t < 4).length >= 2;   /* 따라다니던 이도 보이지 않는 사수에게 거듭 맞으면 */
  if (u.side === 0 && (u.stay || inc2) && !u.order && !isFar(u) && W.t - (u.stayShotT || -9) > 3){   /* v9.6.3 자리를 지키다 화살을 맞음 — 가만히 서서 맞지 않음 */
    const sh = u.stay ? seen.find(f => shotMe(f) && dist(f, u) > lim) : null, r = sh ? null : (W.inc || []).filter(q => q.by === u.i && W.t - q.t < 1.5).pop();
    if ((sh || (r && !seen.some(f => dist(f, u) <= near0))) && (u.stay || ((u.cls === '기동' || u.bold >= 0.6) && u.hp / u.max > 0.35))){ u.stayShotT = W.t;
      if (sh){ u.stay = null; L(W, { k: 'stayShot', a: u.i, b: sh.i, how: 'hunt', vis: true }); }
      else { const go = (u.cls === '기동' || u.bold >= 0.6) && u.hp / u.max > 0.35, dl = Math.hypot(r.dx, r.dy) || 1, rr = Math.min(Math.max(r.tr || 6, 3), 9);
        u.stay = go ? { x: Math.max(0.6, Math.min(W.map.W - 0.6, r.x + r.dx / dl * rr)), y: Math.max(0.6, Math.min(W.map.H - 0.6, r.y + r.dy / dl * rr)) } : null;
        L(W, { k: 'stayShot', a: u.i, how: go ? 'hunt' : 'back', dir: dirName(r.dx, r.dy), vis: true }); } } }""")
rep("    L(W, { k: 'pact', side: s, n, vis: s === 0 }); }", "    L(W, { k: 'pact8', side: s, n, vis: s === 0 }); }   /* v9.6.3 협공 약속 (pact) 과 이름이 겹쳐 로그가 섞이던 것 */")
rep("module.exports = { abyssTag,", "module.exports = { tgIn, karFFOk, abyssTag,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9090 OK')
