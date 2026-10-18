# v7.23.2 엔진 — patch7232.py v1.2 (v1.2: 권위는 빈틈 찌르기보다 먼저 · v1.1: 하늘 가르기 · 관통 찌르기 · 냉기 참격은 가장 많이 걸리는 쪽으로 · 6단계 5S 세자르 2: 필살 · 권위 — 하늘 가르기 (16M 직선 · 못 막고 못 피함 · 절단 · 쓰러짐 · 이동 제약 10초 · 갈라진 자리의 폭풍) · 관통 찌르기 (5M 돌진 · 맨 앞을 꿰어 내던짐) · 냉기 참격 (7.3M 부채꼴 · 동상)
#   · 마구 베기 (최전방 하나에게 초속 18M 돌진 → 0.1초마다 확정 치명 12번 · 끊길 수 있음) · 권위 (손들기 1.1초 → 눈 · 신성 봉인 — 카리우스 [개조된 신체] 가 꺼짐 · 세자르가 0.4초 넘게 휘청이면 6초 흔들림)
#   · 슈퍼아머 (saT — 휘청 · 넘어짐 · 밀림 없음) · 이동 제약 (hobbleT — 걸음 × 0.4 · 못 뜀 · 스텝 · 도약 못 함) · 헛침 빈틈 (세자르가 헛치면 0.45초 휘청 — 2D 판))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
FS = {k: open(D + k + '.js', encoding='utf-8').read() for k in ('rt3_head', 'rt3_mid', 'rt3_tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in FS.values())
    assert n == c, (n, c, a[:100])
    for k in FS:
        FS[k] = FS[k].replace(a, b)

# 규칙
rep("shoulder: { v: 10, max: 0.45, reach: 0.6, rng: 3.3, mul: 0.6, kb: 1.2, stun: 0.7, rec: 0.6, cd: 5 } },",
    """shoulder: { v: 10, max: 0.45, reach: 0.6, rng: 3.3, mul: 0.6, kb: 1.2, stun: 0.7, rec: 0.6, cd: 5 },
    upcut: { cd: 20, d0: 2.1, d1: 10, charge: 1.0, len: 16, w: 0.8, mul: 2.2, stun: 1.0, down: 1.6, hobble: 10, galeAt: 1.1, gale: 1.5, galeV: 2.2, galeArc: 0.35, galeAdd: 4 },
    thrust: { cd: 6, d0: 1.8, d1: 6.3, charge: 0.6, dash: 5, w: 0.8, mul: 1.2, crit: 0.5, lift: 500, toss: 2.4, tossMul: 0.8, tossStun: 0.8, stun: 1.2, rec: 1.1 },
    wave: { cd: 9, brk: 4, d0: 3.1, d1: 7, charge: 0.8, r: 7.3, half: 1.3, mul: 1.8, frost: 4, rec: 0.7 },
    ult: { cd: 22, rng: 8.4, charge: 1.0, v: 18, maxT: 1.5, n: 12, gap: 0.1, mul: 0.3, end: 0.3 },
    auth: { at: 0.6, raise: 1.1, done: 1.6, retry: 6, shake: 0.3, shaken: 6, cool: 4 } },   /* shake 0.3: [베테랑] 은 휘청이 × 0.7 (2D 판 0.4 · 헛침 0.45 → 0.315) */""")
rep("  frost: { spd: 0.55, wind: 1.6 },", "  frost: { spd: 0.55, wind: 1.6 },\n  hobble: 0.4,   /* v7.23.2 이동 제약: 걸음 × (못 뜀 · 스텝 · 도약 못 함) */")
rep("punish: 0, combo: null, jog: 0 }", "punish: 0, combo: null, jog: 0, upcut: 8, thrust: 4, wave: 5, ult: 10, auth: (p.unique || []).includes('권위') ? 0.6 : null, shaken: 0, cool: 0 }")

# 신성 봉인 (권위): [개조된 신체] 의 덜 다침 · 덜 휘청 · 덜 잘림이 꺼짐
rep("const sizeOf = u =>", "const mbOn = (W, u) => !!u.modBody && !W.seal;   /* v7.23.2 권위 (신성 봉인) 중엔 [개조된 신체] 가 꺼짐 */\nconst sizeOf = u =>")
rep("t.modBody ? (R.modBody", "mbOn(W, t) ? (R.modBody", 4)
rep("hit.modBody ? (W.rules.modBody", "mbOn(W, hit) ? (W.rules.modBody")
rep("u.modBody ? (W.rules.modBody || {}).pin", "mbOn(W, u) ? (W.rules.modBody || {}).pin")
rep("(t.modBody ? 0.6 : 1)", "(mbOn(W, t) ? 0.6 : 1)")
rep("t.modBody ? (W.rules.modBody || {}).dmg", "mbOn(W, t) ? (W.rules.modBody || {}).dmg")

# 슈퍼아머 · 이동 제약
rep("function stun(W, u, sec, by){\n  if (!u.alive || !(sec > 0)) return 0;", "function stun(W, u, sec, by){\n  if (!u.alive || !(sec > 0) || W.t < (u.saT || -9)) return 0;   /* v7.23.2 슈퍼아머 */")
rep("function knockDown(W, u, sec, by, why){\n  if (!u.alive || u.crawl) return;", "function knockDown(W, u, sec, by, why){\n  if (!u.alive || u.crawl || W.t < (u.saT || -9)) return;   /* v7.23.2 슈퍼아머 */")
rep("function shove(W, a, t, power, dx, dy, o){\n  if (!t.alive || power <= 0 || t.kb) return null;", "function shove(W, a, t, power, dx, dy, o){\n  if (!t.alive || power <= 0 || t.kb || W.t < (t.saT || -9)) return null;   /* v7.23.2 슈퍼아머 */")
rep("function tryDodge(W, u, stepOnly){\n  if ((!stepOnly && W.t < u.dodgeCd) || u.kb || prone(W, u) || u.giant) return false;", "function tryDodge(W, u, stepOnly){\n  if ((!stepOnly && W.t < u.dodgeCd) || u.kb || prone(W, u) || u.giant || W.t < (u.hobbleT || -9)) return false;   /* v7.23.2 이동 제약: 스텝 못 함 */")
rep("function leapTo(W, u, x, y, dir, t, why){\n  if (u.lie) return false;", "function leapTo(W, u, x, y, dir, t, why){\n  if (u.lie || W.t < (u.hobbleT || -9)) return false;   /* v7.23.2 이동 제약: 도약 못 함 */")
rep("!u.noRun &&", "!u.noRun && !(W.t < (u.hobbleT || -9)) &&")
rep("* (u.czSpd || 1);   // v5.2 기어다님", "* (u.czSpd || 1) * (W.t < (u.hobbleT || -9) ? (W.rules.hobble || 0.4) : 1);   // v5.2 기어다님")
# 세자르의 헛침 빈틈 (2D 판: 강공 헛침 0.45초 — 권위가 흔들릴 수 있음)
rep("L(W, { k: 'miss', a: u.i, b: t.i, why, man, whiff: stp || null });", "L(W, { k: 'miss', a: u.i, b: t.i, why, man, whiff: stp || null }); if (stp && u.cz) stun(W, u, 0.45, t.i);   /* v7.23.2 세자르의 헛침 빈틈 */")

# 세자르: 대기 · 흔들림 · 끊김
rep("  for (const k of ['spin', 'shoulder', 'back', 'punish']) z[k] -= dt;", """  for (const k of ['spin', 'shoulder', 'back', 'punish', 'upcut', 'thrust', 'wave', 'ult']) z[k] -= dt; if (z.auth != null && z.auth > 0) z.auth -= dt; z.cool -= dt;
  { const AU = Z.auth || {};   // v7.23.2 권위 흔들림: 눈이 내리는 동안 세자르가 shake 초 넘게 휘청이면 shaken 초 동안 눈이 멎고 신성이 돌아옴
    if (z.shaken > 0){ z.shaken -= dt; if (z.shaken <= 0){ W.snow = true; W.seal = true; z.cool = AU.cool || 4; L(W, { k: 'czAuthBack', a: u.i, vis: true }); } }
    else if (W.snow && W.seal && (u.stunT || -9) - W.t >= (AU.shake || 0.4) && z.cool <= 0){ z.shaken = AU.shaken || 6; W.snow = false; W.seal = false; L(W, { k: 'czShaken', a: u.i, vis: true }); } }""")
rep("    else if (A.s === 'shoulder') z.shoulder = (Z.shoulder || {}).cd || 5; else if (A.s === 'backs') z.back = Z.backCd || 6;",
    """    else if (A.s === 'shoulder') z.shoulder = (Z.shoulder || {}).cd || 5; else if (A.s === 'backs') z.back = Z.backCd || 6;
    else if (A.s === 'wave' && !A.hit){ z.wave = (Z.wave || {}).brk || 4; L(W, { k: 'czBreak', a: u.i, s: A.s, vis: true }); }
    else if (A.s === 'auth' && !A.done){ z.auth = (Z.auth || {}).retry || 6; L(W, { k: 'czBreak', a: u.i, s: A.s, vis: true }); }
    else if (A.s === 'ult' && !A.over){ L(W, { k: 'czBreak', a: u.i, s: A.s, n: A.hits || 0, vis: true }); }
    if (W.fxOn && ['wave', 'auth', 'ult'].includes(A.s)) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '끊김', c: 'g', t0: W.t });""")
# 필살 · 권위 진행
rep("  if (A.s === 'backs'){", r'''  if (A.s === 'auth'){ const AU = Z.auth || {};   // 권위: 손을 들고 (끊길 수 있음) → 눈 · 신성 봉인
    if (!A.done && el >= (AU.raise || 1.1)){ A.done = true; W.snow = true; W.seal = true; L(W, { k: 'czAuth', a: u.i, vis: true }); }
    if (el >= (AU.done || 1.6)){ z.auth = null; czEnd(W, u); } return true; }
  if (A.s === 'upcut'){ const S = Z.upcut || {}, ch = S.charge || 1;   // 하늘 가르기: 모음 (슈퍼아머 · 방향은 상대를 따라감) → 16M 직선을 벰 → 정적 → 갈라진 자리의 폭풍
    if (el < ch){ u.saT = A.t0 + ch; if (t && t.alive) A.ang = Math.atan2(t.y - u.y, t.x - u.x); u.fg = A.ang; return true; }
    const cx = Math.cos(A.ang), cy = Math.sin(A.ang);
    if (!A.hit){ A.hit = true; let n = 0;
      for (const e of czFoes(W, u)){ const px = e.x - u.x, py = e.y - u.y, al = px * cx + py * cy; if (al < -0.2 || al > (S.len || 16) + 0.4 || Math.abs(px * cy - py * cx) > (S.w || 0.8) + e.r * 0.5) continue;
        n++; strike(W, u, e, e, 1, false, { mul: S.mul || 2.2, grab: true, tag: '하늘 가르기' }); if (!e.alive) continue;
        startBleed(W, e, u.i, 1.5); stun(W, e, S.stun || 1, u.i); knockDown(W, e, (S.stun || 1) + (S.down || 1.6), u.i, '하늘 가르기'); e.hobbleT = W.t + (S.stun || 1) + (S.down || 1.6) + (S.hobble || 10); }
      L(W, { k: 'czUpcut', a: u.i, n, ang: +A.ang.toFixed(3), vis: true }); if (W.fxOn) W.fx.push({ k: 'czCut', x: u.x, y: u.y, ang: A.ang, len: S.len || 16, t0: W.t }); }
    const gt = el - ch - (S.galeAt || 1.1);
    if (gt >= 0 && gt < (S.gale || 1.5)){ if (!A.gale){ A.gale = true; L(W, { k: 'czGale', a: u.i, vis: true }); }   // 폭풍: 앞쪽 ±70° · 무게가 가벼울수록 멀리 (1.5톤 넘으면 버팀) · 처음이 가장 셈
      const pw = 1 - 0.65 * gt / (S.gale || 1.5);
      for (const o of W.units){ if (!o.alive || o === u || o.gone) continue; const dx = o.x - u.x, dy = o.y - u.y, d = Math.hypot(dx, dy) || 1, al = (dx * cx + dy * cy) / d; if (al < (S.galeArc || 0.35) || d > (S.len || 16) + (S.galeAdd || 4)) continue;
        const w = (o.mass || 62) * (o.poise || 1), wf = w >= 1500 ? 0 : Math.min(1.6, 70 / w); if (wf <= 0.02) continue; const v = (S.galeV || 2.2) * wf * pw * Math.min(1, al + 0.2) * dt;
        tryMove(W, o, o.x + dx / d * v, o.y + dy / d * v); } }
    if (el >= ch + (S.galeAt || 1.1) + (S.gale || 1.5)){ czEnd(W, u, 'upcut', S.cd || 20); } return true; }
  if (A.s === 'thrust'){ const S = Z.thrust || {}, ch = S.charge || 0.6;   // 관통 찌르기: 모음 (슈퍼아머) → 5M 를 한순간에 → 줄 위의 모두 (못 막음) · 맨 앞이 가벼우면 꿰어 내던짐
    if (el < ch){ u.saT = A.t0 + ch; if (t && t.alive) A.ang = Math.atan2(t.y - u.y, t.x - u.x); u.fg = A.ang; return true; }
    if (!A.hit){ A.hit = true; const cx = Math.cos(A.ang), cy = Math.sin(A.ang), x0 = u.x, y0 = u.y; let L0 = 0;
      for (let s0 = 0.1; s0 <= (S.dash || 5); s0 += 0.1){ if (boxRock(W, x0 + cx * s0, y0 + cy * s0, u.r * 0.9)) break; L0 = s0; }
      const hits = czFoes(W, u).map(e => { const px = e.x - x0, py = e.y - y0; return { e, al: px * cx + py * cy, lat: Math.abs(px * cy - py * cx) }; }).filter(h => h.al > -0.2 && h.al < L0 + 0.8 && h.lat < (S.w || 0.8) + h.e.r * 0.5).sort((p, q) => p.al - q.al);
      let stopAt = L0; if (hits.length) stopAt = Math.min(L0, Math.max(0, hits[0].al - hits[0].e.r - u.r - 0.05)); tryMove(W, u, x0 + cx * stopAt, y0 + cy * stopAt);   // 맨 앞 상대 앞까지 튀어나감
      hits.forEach((h, i) => { const e = h.e; strike(W, u, e, e, 1, false, { mul: S.mul || 1.2, grab: true, crit: W.rand() < (S.crit || 0.5), tag: '관통 찌르기' }); if (!e.alive) return;
        const bw = (e.mass || 62) * (e.poise || 1) * (guardOn(W, e) ? 2 : 1);
        if (i === 0 && bw <= (S.lift || 500)){ shove(W, u, e, S.toss || 2.4, cx, cy, { tag: '꿰어 들어 올렸다가 내던짐' }); knockDown(W, e, 1.2, u.i, '관통 찌르기'); strike(W, u, e, e, 1, false, { mul: S.tossMul || 0.8, grab: true, tag: '내던져 떨어짐', noFire: true }); if (e.alive) stun(W, e, S.tossStun || 0.8, u.i); L(W, { k: 'czToss', a: u.i, b: e.i, vis: true }); }
        else stun(W, e, S.stun || 1.2, u.i); });
      L(W, { k: 'czThrust', a: u.i, n: hits.length, vis: true }); if (W.fxOn) W.fx.push({ k: 'czThr', x: x0, y: y0, ang: A.ang, len: L0, t0: W.t }); }
    if (el >= ch + (S.rec || 1.1)) czEnd(W, u, 'thrust', S.cd || 6); return true; }
  if (A.s === 'wave'){ const S = Z.wave || {}, ch = S.charge || 0.8;   // 냉기 참격: 모음 (끊길 수 있음) → 앞쪽 부채꼴 (막고 피할 수 있음) · 동상
    if (el < ch){ if (t && t.alive) A.ang = Math.atan2(t.y - u.y, t.x - u.x); u.fg = A.ang; return true; }
    if (!A.hit){ A.hit = true; let n = 0;
      for (const e of czFoes(W, u)){ const d = dist(u, e), da = Math.abs(Math.atan2(Math.sin(Math.atan2(e.y - u.y, e.x - u.x) - A.ang), Math.cos(Math.atan2(e.y - u.y, e.x - u.x) - A.ang))); if (d - e.r > (S.r || 7.3) || da > (S.half || 1.3)) continue;
        n++; if (evadeMelee(W, e, u)) continue; const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.8, tag: '냉기 참격' }); if (o && e.alive && !o.block) frostOn(W, e, S.frost || 4, u.i); }
      L(W, { k: 'czWave', a: u.i, n, vis: true }); if (W.fxOn) W.fx.push({ k: 'czFan', x: u.x, y: u.y, ang: A.ang, r: S.r || 7.3, half: S.half || 1.3, t0: W.t }); }
    if (el >= ch + (S.rec || 0.7)) czEnd(W, u, 'wave', S.cd || 9); return true; }
  if (A.s === 'ult'){ const S = Z.ult || {}, ch = S.charge || 1;   // 마구 베기: 모음 (끊길 수 있음) → 최전방에게 돌진 (슈퍼아머) → 0.1초마다 확정 치명 12번 (휘청이면 끊김)
    let tg = A.tb != null ? W.units[A.tb] : t; if (!tg || !tg.alive){ tg = czFront(W, u); A.tb = tg ? tg.i : null; }
    if (!tg){ A.over = true; czEnd(W, u); return true; }
    if (el < ch){ u.fg = Math.atan2(tg.y - u.y, tg.x - u.x); return true; }
    if (!A.arr){ u.saT = W.t + 0.05; const d = gap(u, tg);
      if (d > 0.5 && el < (S.maxT || 1.5)){ const v = Math.min((S.v || 18) * dt, d - 0.45), l = dist(u, tg) || 1; tryMove(W, u, u.x + (tg.x - u.x) / l * v, u.y + (tg.y - u.y) / l * v); u.fg = Math.atan2(tg.y - u.y, tg.x - u.x); if (W.fxOn && W.rand() < dt * 20) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t }); return true; }
      A.arr = true; A.next = W.t; A.hits = 0; u.saT = -9; L(W, { k: 'czUltGo', a: u.i, b: tg.i, vis: true }); }
    if (A.hits < (S.n || 12)){ if (W.t >= A.next){ A.next = W.t + (S.gap || 0.1); A.hits++;
        if (gap(u, tg) > 1.0){ const l = dist(u, tg) || 1, k = tg.r + u.r + 0.3; tryMove(W, u, tg.x + (u.x - tg.x) / l * k, tg.y + (u.y - tg.y) / l * k); if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t }); }   // 멀어지면 붙어 따라감
        u.fg = Math.atan2(tg.y - u.y, tg.x - u.x); strike(W, u, tg, tg, 1, false, { mul: S.mul || 0.3, crit: true, grab: true, tag: '마구 베기', noFire: true });
        if (!tg.alive){ const nx = czFront(W, u); if (nx){ A.tb = nx.i; } else A.hits = S.n || 12; } }
      return true; }
    if (!A.over){ A.over = true; A.t2 = W.t; L(W, { k: 'czUlt', a: u.i, n: A.hits, vis: true }); }
    if (W.t - A.t2 >= (S.end || 0.3)) czEnd(W, u); return true; }
  if (A.s === 'backs'){''')
# 판단: 권위 · 필살 (딜타임 순서 — 2D 판 표)
rep("  const byD = F.slice().sort((a, b) => dist(a, u) - dist(b, u)), t = byD[0];\n", """  const byD = F.slice().sort((a, b) => dist(a, u) - dist(b, u)), t = byD[0];
  if (z.auth != null && z.auth <= 0 && !W.snow) return czStart(W, u, 'auth', t);   /* v7.23.2 권위 (눈이 안 내리는 판이면 처음에 — 2D 판처럼 빈틈 찌르기보다 먼저) */
""")
rep("    if (z.shoulder <= 0 && gap(u, t) < (SH.rng || 3.3)", """    const d = dist(u, t), U = Z.ult || {}, UP = Z.upcut || {}, TH = Z.thrust || {}, WV = Z.wave || {}, fr = czFront(W, u);
    if (z.ult <= 0 && fr && dist(u, fr) < (U.rng || 8.4)){ z.ult = U.cd || 22; return czStart(W, u, 'ult', fr, { tb: fr.i }); }   // 마구 베기 (대기는 시작할 때 걸림)
    const inR = (a0, a1) => byD.filter(o => { const q = dist(u, o); return q > a0 && q < a1; }), best = (L0, f) => { let bo = null, bn = 0; for (const o of L0){ const n = f(Math.atan2(o.y - u.y, o.x - u.x)); if (n > bn){ bn = n; bo = o; } } return bo; };   // 가장 많이 걸리는 쪽 (2D 판은 가장 가까운 이 — 이 판은 일행이 몰려 붙으므로)
    if (z.upcut <= 0){ const o = best(inR(UP.d0 || 2.1, UP.d1 || 10), ang => czLineN(W, u, ang, UP.len || 16, UP.w || 0.8)); if (o) return czStart(W, u, 'upcut', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) }); }
    if (z.thrust <= 0){ const o = best(inR(TH.d0 || 1.8, TH.d1 || 6.3), ang => czLineN(W, u, ang, (TH.dash || 5) + 0.8, TH.w || 0.8)); if (o) return czStart(W, u, 'thrust', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) }); }
    if (z.wave <= 0){ const o = best(inR((WV.d0 || 3.1) - 0.01, (WV.d1 || 7) + 0.01), ang => czFanN(W, u, ang, WV.r || 7.3, WV.half || 1.3)); if (o) return czStart(W, u, 'wave', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) }); }
    if (z.shoulder <= 0 && gap(u, t) < (SH.rng || 3.3)""")
rep("function czEnd(W, u, k, cd){", """// 직선 · 부채꼴에 걸리는 상대 수 (아는 상대만)
const czLineN = (W, u, ang, len, w) => { const cx = Math.cos(ang), cy = Math.sin(ang); return czKnown(W, u).filter(e => { const px = e.x - u.x, py = e.y - u.y, al = px * cx + py * cy; return al > -0.2 && al < len && Math.abs(px * cy - py * cx) < w + e.r * 0.5; }).length; };
const czFanN = (W, u, ang, r, half) => czKnown(W, u).filter(e => { const a = Math.atan2(e.y - u.y, e.x - u.x) - ang; return dist(u, e) - e.r <= r && Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= half; }).length;
// 최전방: 상대 무리의 무게중심에서 세자르 쪽으로 가장 튀어나온 이 (2D 판 czFront)
function czFront(W, u){ const F = czKnown(W, u); if (!F.length) return null; const cx = F.reduce((s, f) => s + f.x, 0) / F.length, cy = F.reduce((s, f) => s + f.y, 0) / F.length; let vx = u.x - cx, vy = u.y - cy; const l = Math.hypot(vx, vy) || 1; vx /= l; vy /= l;
  return F.slice().sort((a, b) => ((b.x - cx) * vx + (b.y - cy) * vy) - ((a.x - cx) * vx + (a.y - cy) * vy))[0]; }
function czEnd(W, u, k, cd){""")
rep("  setMood(W, u, { spin: '원형 베기', shoulder: '어깨 박치기', backs: '뒷걸음 점프',", "  if (s === 'upcut') L(W, { k: 'czCharge', a: u.i, s, vis: true });   // 검을 낮게 늘어뜨리고 숨을 고른다\n  setMood(W, u, { auth: '손을 듦 — 권위', upcut: '하늘 가르기 — 모음', thrust: '관통 찌르기 — 모음', wave: '냉기 참격 — 모음', ult: '마구 베기', spin: '원형 베기', shoulder: '어깨 박치기', backs: '뒷걸음 점프',")
rep("if (typeof module !== 'undefined') module.exports = { czBrain,", "if (typeof module !== 'undefined') module.exports = { czFront, mbOn, czBrain,")

for k, v in FS.items():
    open(D + k + '.js', 'w', encoding='utf-8').write(v)
print('patch7232 OK')
