# v8.7.8 엔진 (3) — patch8780c.py v1.2 (v1.2: 초돌진을 스스로 — 맞붙어 있지 않을 때 진형 뒤의 먼 적 (사수 먼저 · 길에 휩쓸 적이 많을수록 · 보는 거리 9칸 밖이면 동료가 알려 준 자리로 — 돌진 명령과 같음) 에게도 · 돌진 · 초돌진의 '들어가!' 기다림은 편이 둘 이상일 때만 (지휘 · 방패를 든 혼자인 몸이 돌진을 못 하던 것 — cmdHold) · v1.1: 갑옷을 무시한 일격은 기록에도 갑옷 없음 (잡아뚫기 · 굿윌 니킥) · 카리우스 딥 킥은 발이 넉넉히 닿을 때 (거구 앞을 피해 물러서는 적에게 헛차던 것) · v1.0: 어퐁 (명세 C6 · 도감 C-103) — 초돌진 (5칸 넘게 떨어진 적에게만 · 돌진 걸음 × 1.8 · 길 둘레 몸 + 0.9칸의 적을 넓게 밀어냄 — 가벼우면 넘어짐 ·
#   휩쓸린 적은 막지 못함 · 노린 적엔 돌진 충돌 그대로) · 앞차기 (붙은 적을 차 밀어냄 · 휘청) · 버클러 (작은 방패 — 막는 폭 ±40° · 관통 방호 80) /
#   카리우스 (명세 C7 — 3D karius.js v1.3 · 2D 불경자 · 근성): 잡아뚫기 (광대의 팔 — 끌어와 레프트 꿰뚫기 · 치명 50% · 갑옷 무시 · 뛰어오른 적은 보스도 끌어내림) · 노인의 팔 후려치기 ·
#   라이트 훅 세 번 · 딥 킥 (붉은암석과 같은 기술 — 벽을 등진 적을 먼저) · 짓밟기 (누운 적 확인사살 · 보스 빼고 / 선 적은 넘어뜨림) · 불경자 (체력 15% 아래 — 공격 × 2.5 · 받는 피해 × 0.33 ·
#   걸음 × 1.4 · 공격 간격 × 0.8 · 막지 않음 · 노인의 팔 철퇴 · 돌진 몸박 / 체력 50% 넘으면 풀림) · 근성 (체력 0 → 3초 무적 발버둥 → 포효 → 7초 쓰러지지 않음 (공격 속도 × 1.5 · 모든 공격 치명 · 슈퍼아머)
#   → 실이 끊긴 듯 쓰러짐 · 그 사이 싸움이 끝나면 체력 5% 로 쓰러져 살아남음) · 벼락을 맞으면 (◆개조된 신체) 6초 공격 × 1.3 — 적 · 아군 같은 규칙 · 수치는 이 판의 비율 (3D 기본 주먹 두 대 = 이 판의 기본 일격 하나))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8780b.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- 수치표 ----------
rep("  gw: { lo: 3,", """  buckler: { arc: 40 },   /* v8.7.8 버클러 (어퐁 — 작은 방패): 막는 폭 ±arc° (보통 방패 ±60°) · 관통 방호는 pen.buckler */
  karius: { grit: { agony: 3, roar: 0.8, last: 7, spd: 1.5, endHp: 0.05 }, heretic: { at: 0.15, off: 0.5, atk: 2.5, def: 0.33, spd: 1.4, gap: 0.8, roar: 0.6 }, rage: { t: 6, atk: 1.3 } },   /* v8.7.8 카리우스 (3D karius.js v1.3 · 2D 원본): 근성 (발버둥 agony 초 무적 → 포효 roar 초 → last 초 쓰러지지 않음 — 공격 속도 × spd · 모든 공격 치명 · 슈퍼아머 → 쓰러짐 · 그 사이 싸움이 끝나면 체력 endHp) · 불경자 (체력 at 아래 — 공격 × atk · 받는 피해 × def · 걸음 × spd · 공격 간격 × gap · 막지 않음 / off 넘으면 풀림) · 벼락 (t 초 공격 × atk) */
  gw: { lo: 3,""")
rep("  spec: { pmark: { cd: 12, rng: 9 },",
    "  spec: { asup: { cd: 10, rng: 12, min: 5, spd: 1.8, w: 0.9, kd: 1, mul: 0.5, shove: 1.4, heavy: 1.3 }, akick: { rng: 0.9, reach: 0.5, wind: 0.25, rec: 0.35, cd: 5, mul: 1.2, push: 1.5, stun: 0.5, post: 35 },   /* v8.7.8 어퐁: 초돌진 (min 칸 넘게 · rng 칸까지 · 돌진 걸음 × spd · 길 둘레 몸 + w 칸의 적 — 공격 × mul · 밀침 shove · 넘어짐 kd 초 (무게가 어퐁 × heavy 넘으면 밀기만)) · 앞차기 (공격 × mul · push 칸 밀림 · 휘청 stun · 막으면 자세 post) */\n"
    "    kgrab: { rng: 1.0, d: 1.9, dAir: 3.4, wind: 0.4, pull: 0.6, rec: 0.5, cd: 11, mul: 1.25, crit: 0.5, stun: 0.4 }, ksw: { rng: 1.7, r: 2.7, arc: 137, wind: 0.55, rec: 0.55, cd: 4, mul: 1.25, kb: 1.6, stun: 0.5 }, khook: { rng: 1.0, r: 1.9, arc: 97, wind: 0.55, gap: 0.15, n: 3, mul: 0.45, kb: 1, kb1: 0.2, rec: 0.3, cd: 6 },\n"
    "    kstomp: { rng: 0.6, d: 1.5, r: 0.95, wind: 0.55, rec: 0.4, cd: 4, cdUp: 8, mul: 1.1, down: 1, boss: 2.5 }, kslam: { rng: 1.3, d: 2.3, r: 1.3, ahead: 1.3, wind: 0.7, rec: 0.45, cd: 5, mul: 1.67, stun: 0.6, kb: 0.8 }, krush: { rng: 6, min: 2.8, max: 7, wind: 0.5, time: 0.5, v: 9, mul: 1.46, kb: 4.5, rec: 0.4, cd: 8 },   /* v8.7.8 카리우스 (3D 그대로 — 거리 d · r 은 몸 가운데부터 · 피해는 3D 의 기본 주먹 두 대 (24) 에 대한 비: 잡아뚫기 30 · 후려치기 30 · 훅 10.8 × 3 · 짓밟기 26 · 불경자 철퇴 40 · 몸박 35) */\n"
    "    pmark: { cd: 12, rng: 9 },")
rep("'포렌의 대검':{rng:0.75, guard:true, two:true, kind:'날붙이'}", "'포렌의 대검':{rng:0.75, guard:true, two:true, kind:'날붙이'}, '어퐁의 철퇴':{rng:0.6, kind:'둔기'}")   # v8.7.8 어퐁 (한 손 철퇴 + 버클러)
rep("kick: { wind: 0.35, rec: 0.45, cd: 7, mul: 0.9, kb: 2.2 }", "kick: { wind: 0.35, rec: 0.45, cd: 7, mul: 0.9, kb: 2.2, rng: 1.0 }")   # 명령으로 쓸 때 다가갈 거리 (발이 닿는 곳)
rep("'혈영보': 'blink', '쥐 표식'", "'혈영보': 'blink', '초돌진': 'asup', '앞차기': 'akick', '잡아뚫기': 'kgrab', '노인의 팔': 'ksw', '라이트 훅': 'khook', '짓밟기': 'kstomp', '노인의 팔 철퇴': 'kslam', '돌진 몸박': 'krush', '쥐 표식'")
rep("shield: 110, armShield: 140, pavise: 160,", "shield: 110, armShield: 140, pavise: 160, buckler: 80,")
rep("t.pavise ? PN.pavise || 160 : PN.shield", "t.pavise ? PN.pavise || 160 : t.buckler ? PN.buckler || 80 : PN.shield", 2)   # v8.7.8 버클러는 덜 막음

# ---------- 몸: 근성 · 불경자 · 버클러 ----------
rep("if (p.javSide) U.javSide = p.javSide; if (+p.javK > 0) U.javK = +p.javK;",
    "if (p.javSide) U.javSide = p.javSide; if (+p.javK > 0) U.javK = +p.javK; U.grit = (p.traits || []).includes('근성'); U.heretic0 = (p.traits || []).includes('불경자'); U.karKit = U.grit || U.heretic0 || (U.spec || []).some(x => ['kgrab', 'ksw', 'khook', 'kstomp'].includes(x.k)); if (U.shield && !U.armShield && /버클러/.test(U.sName || '')){ U.buckler = true; U.gArc = Math.round(U.gArc * ((rules.buckler || {}).arc || 40) / (rules.frontArc || 60)); }   /* v8.7.8 카리우스 [근성] [불경자] · 어퐁 버클러 */")
rep("u.gArc = Math.round((W.rules.frontArc || 60) * (0.6 + 0.4 * (u.gTal != null ? u.gTal : 1))); u.post = Math.max(u.post || 0, 60);",
    "u.gArc = Math.round((W.rules.frontArc || 60) * (0.6 + 0.4 * (u.gTal != null ? u.gTal : 1))); u.post = Math.max(u.post || 0, 60); u.buckler = /버클러/.test(u.sName || ''); if (u.buckler) u.gArc = Math.round(u.gArc * ((W.rules.buckler || {}).arc || 40) / (W.rules.frontArc || 60));   /* v8.7.8 주운 방패가 버클러면 좁게 */")

# ---------- 초돌진: 돌진 그대로 + 빠름 · 길 둘레를 휩쓺 ----------
rep("sp, v0, run: 0 };", "sp, v0, run: 0, ...(u.act.sup ? { sup: true, lim: d + 1.5 } : {}) };")
rep("  if (A.v0 != null) A.sp = chargeSp(C, A.v0, A.run || 0);   // v5.8.5 도움닫기",
    "  if (A.v0 != null) A.sp = chargeSp(C, A.v0, A.run || 0);   // v5.8.5 도움닫기\n  if (A.sup) A.sp *= APR(W).spd || 1.8;   /* v8.7.8 초돌진 */")
rep("  A.run = (A.run || 0) + Math.hypot(u.x - x0, u.y - y0);",
    "  A.run = (A.run || 0) + Math.hypot(u.x - x0, u.y - y0);\n  if (A.sup){ apSweep(W, u, A); if (!u.act) return; if (A.run > (A.lim || 99)){ u.act = null; return; } }   /* v8.7.8 초돌진: 길 둘레의 적을 휩쓺 · 노린 적을 놓치면 그만 */")

# ---------- 돌진 · 초돌진의 '들어가!' 기다림: 편이 혼자 (둘보다 적음) 면 대형이 없으니 기다리지 않음 (지휘 · 방패를 든 혼자인 몸이 돌진을 못 하던 것) ----------
rep("  if (!forced && !noStance && cmdOf(W, u.side) > 0 && W.units.some(o => o.alive && o.side === u.side && o.role === '전선' && (o.canGuard || o.bodyShield)) && !(W.stance[u.side] && W.stance[u.side].k === 'engage')) return false;",
    "  if (!forced && !noStance && cmdHold(W, u)) return false;   /* v8.7.8 혼자인 편은 기다리지 않음 (cmdHold) */")

# ---------- 기술: 불경자의 기술은 불경자일 때만 · 겨눈 방향은 처음에 정함 ----------
rep("if (GW_K.includes(k) && !gwOn(u)) return false;",
    "if (GW_K.includes(k) && !gwOn(u)) return false; if ((k === 'kslam' || k === 'krush') && !u.heretic) return false;   /* v8.7.8 불경자의 기술 */")
rep("...(k === 'sweep' || k === 'hurl' ? { a0: (u.face || 0) + Math.PI } : {}) };",
    "...(k === 'sweep' || k === 'hurl' ? { a0: (u.face || 0) + Math.PI } : {}), ...(KAR_TG.includes(k) ? karAim(W, u, t, k) : {}) };   /* v8.7.8 카리우스 · 앞차기: 겨눈 방향 · 자리는 처음에 정함 (보고 피할 수 있음) */")
rep("  if (GW_K.includes(k)){ gwResolve(W, u, A, S, t); return; }   /* v8.7.8 굿윌 */",
    "  if (GW_K.includes(k)){ gwResolve(W, u, A, S, t); return; }   /* v8.7.8 굿윌 */\n  if (KAR_K.includes(k)){ karResolve(W, u, A, S, t); return; }   /* v8.7.8 카리우스 */")
rep("  if (k === 'kick'){   // v8.7.4 딥 킥", """  if (k === 'akick'){   // v8.7.8 앞차기 (어퐁 — 그림 '높이 앞차기'): 붙은 적을 차 밀어냄 · 휘청 (막으면 자세가 깎이고 덜 밀림)
    if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    if (gap(u, t) > u.rng + (S.reach || 0.5)){ L(W, { k: 'miss', a: u.i, b: t.i, why: '발이 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); return; }
    if (t.side !== u.side && evadeMelee(W, t, u)) return;
    const o = strike(W, u, t, t, 1, false, { mul: S.mul || 1.2, wk: '둔기', tag: '앞차기' }); if (o && t.alive && t.kb && t.kb.by === u.i) t.kb = null;
    if (o && o.block && t.alive){ t.post -= S.post || 35; if (t.post <= 0){ t.post = 0; t.brokenT = W.t + W.rules.breakTime; } }
    if (t.alive && !t.kb) shove(W, u, t, (S.push || 1.5) * (o && o.block ? 0.6 : 1), t.x - u.x, t.y - u.y, { tag: '앞차기에 밀려남', how: 'kick' });
    if (t.alive && o && !o.block) stun(W, t, S.stun || 0.5, u.i);
    L(W, { k: 'akick', a: u.i, b: t.i, block: !!(o && o.block), vis: u.side === 0 || t.side === 0 || !!u.seenBy }); return;
  }
  if (k === 'kick'){   // v8.7.4 딥 킥""")

# ---------- 스스로 쓰기 · 명령 ----------
rep("function specAuto(W, u, t, see){\n  if (!u.spec || !u.spec.length || !t || !t.alive || !see || u.act) return false;",
    "function specAuto(W, u, t, see){\n  if (!u.spec || !u.spec.length || !t || !t.alive || !see || u.act) return false;\n  if (apAuto(W, u, t)) return true;   /* v8.7.8 어퐁: 초돌진 · 앞차기 */\n  if (u.karKit && karAuto(W, u, t)) return true;   /* v8.7.8 카리우스 (3D kariusThink 의 차례) */")
rep("GW_K.includes(o.s) ? gwStart(W, u, t, o.s, '명령') : o.s === 'pmark' ? prnMark(W, u, t, '명령') : startSpec(W, u, t, o.s, '명령')",
    "GW_K.includes(o.s) ? gwStart(W, u, t, o.s, '명령') : o.s === 'pmark' ? prnMark(W, u, t, '명령') : o.s === 'asup' ? apSup(W, u, t, '명령') : startSpec(W, u, t, o.s, '명령')")
rep("    if (o.s === 'head'){ if (specReady(W, u, 'head')){",
    "    if (o.s === 'asup' && gap(u, t) <= (APR(W).min || 5)){ L(W, { k: 'specFail', a: u.i, s: 'asup', why: (APR(W).min || 5) + '칸 안 — 초돌진은 멀리 떨어진 적에게만', vis: true }); u.order = { k: 'attack', b: t.i }; return; }   /* v8.7.8 */\n"
    "    if (o.s === 'head'){ if (specReady(W, u, 'head')){")

# ---------- 받는 피해: 근성 (발버둥 무적 · 마지막 7초는 쓰러지지 않음) · 왕관 조각은 근성이 다한 것을 버티지 않음 ----------
rep("  const real = Math.min(dmg, t.hp), dark = t.side === 0 && !canSee(W, t, u);",
    "  if (t.grit && !t.lsEnd && t.alive){ dmg = karGritHit(W, u, t, dmg, o); if (!(dmg > 0)) return; }   /* v8.7.8 근성 */\n  const real = Math.min(dmg, t.hp), dark = t.side === 0 && !canSee(W, t, u);")
rep("!/출혈|화상/.test((o && o.tag) || '')", "!/출혈|화상|근성/.test((o && o.tag) || '')")
rep("o.armor = AM.m < 1 && AM.it ? AM.it.name : null;", "o.armor = AM.m < 1 && AM.it && !(extra && extra.noArmor) ? AM.it.name : null;")   # v8.7.8 갑옷을 무시한 일격 (잡아뚫기 · 니킥 헤드샷) 은 기록에도 갑옷이 막지 않음
rep("crit = (extra && extra.crit) || HM ||", "crit = (extra && extra.crit) || (u.ls && u.ls.ph === 'last') || HM ||")   # v8.7.8 근성: 모든 공격 치명

# ---------- 동작 ----------
rep("function act(W, u, dt){\n  if (u.h2) h2Tick(W, u);",
    "function act(W, u, dt){\n  if ((u.karKit || u.modBody) && karTick(W, u, dt)) return;   /* v8.7.8 근성 (발버둥 · 포효 동안은 아무것도 못 함) · 불경자 · 벼락 */\n  if (u.h2) h2Tick(W, u);")
rep("stop(u); u.act = null; u.burst = null; u.vx = u.vy = 0; return; } u.heldBy = null; }   /* v8.7.4 잡아찢기에 붙잡힘 */",
    "stop(u); u.act = null; u.burst = null; u.vx = u.vy = 0; return; } if (g && g.alive && A && A.k === 'spec' && A.s === 'kgrab' && A.held === u.i && karHeld(W, g, u, dt)) return; u.heldBy = null; }   /* v8.7.4 잡아찢기에 붙잡힘 · v8.7.8 광대의 팔에 끌려옴 */")
rep("  if (u.act && u.act.k === 'gwHop'){ gwHopStep(W, u); return; }   /* v8.7.8 굿윌 순간이동 도약 */",
    "  if (u.act && u.act.k === 'gwHop'){ gwHopStep(W, u); return; }   /* v8.7.8 굿윌 순간이동 도약 */\n"
    "  if (u.act && u.act.k === 'karRoar'){ stop(u); if (W.t >= u.act.end) u.act = null; return; }   /* v8.7.8 불경자 — 울부짖음 */\n"
    "  if (u.act && u.act.k === 'spec' && u.act.s === 'krush' && u.act.phase === 'go'){ karRushStep(W, u, dt); if (u.act && W.t >= u.act.end) resolveAct(W, u); return; }   /* v8.7.8 돌진 몸박 */")
rep("  porenTick(W, dt);   /* v8.7.8 포렌:", "  karWorld(W);   /* v8.7.8 근성 중에 싸움이 끝나면 쓰러져 살아남음 */\n  porenTick(W, dt);   /* v8.7.8 포렌:")
rep("    else if (A.k === 'spec' && (A.s === 'tear' || A.s === 'kick') && t && t.side !== a.side){",
    "    else if (A.k === 'spec' && KAR_TG.includes(A.s) && t && t.side !== a.side){ Z = karTg(W, a, A, t); }   /* v8.7.8 카리우스 · 앞차기 (보고 피함) */\n"
    "    else if (A.k === 'spec' && (A.s === 'tear' || A.s === 'kick') && t && t.side !== a.side){")
rep("function rise(W, t, pct, cure){", "function rise(W, t, pct, cure){\n  if (t.heretic) karHeretic(W, t, false);   /* v8.7.8 일어나면 공격 · 걸음 배수가 처음으로 — 불경자도 풂 (다시 15% 아래면 다시) */")

AK = r"""
/* ---------- v8.7.8 어퐁 (명세 C6 · 도감 C-103) · 카리우스 (명세 C7 — 3D karius.js v1.3 · 2D 불경자 · 근성) — 적 · 아군 같은 규칙 ----------
   어퐁: 초돌진 (5칸 넘게 떨어진 적에게만 · 돌진 걸음 × 1.8 · 길 둘레 몸 + 0.9칸의 적을 넓게 밀어냄 — 가벼우면 넘어짐 · 휩쓸린 적은 막지 못함 · 노린 적엔 돌진 충돌 그대로 — 빠른 만큼 셈) ·
         앞차기 (붙은 적을 차 밀어냄 · 휘청) · 버클러 (작은 방패 — 막는 폭 ±40° · 관통 방호 80).
   카리우스: 3D kariusThink 의 차례 그대로 — 누운 적 짓밟기 > 딥 킥 > (불경자) 몸박 · 철퇴 > 잡아뚫기 > 선 적 짓밟기 > 라이트 훅 > 노인의 팔 후려치기 > 기본 일격 (넓게 휘두르기 · 찍기 — 이 판).
   수치는 이 판의 비율 (3D 기본 주먹 두 대 = 이 판의 기본 일격 하나 · 거리는 몸 가운데부터). */
const APR = W => SPR(W, 'asup');
const KAR = W => W.rules.karius || {};
const KAR_K = ['kgrab', 'ksw', 'khook', 'kstomp', 'kslam', 'krush'], KAR_TG = ['kgrab', 'ksw', 'khook', 'kstomp', 'kslam', 'krush', 'akick'];
const isBoss = t => (t.traits || []).includes('보스');
const airOf = t => !!(t && t.act && t.act.k === 'leap' && t.act.air);
// 초돌진: 돌진 (예고 0.35초) 그대로 시작 — 달리는 동안 stepCharge 가 걸음 × spd · 길 둘레를 휩쓺 (apSweep)
function apSup(W, u, t, why){
  const S = APR(W), x = specOf(u, 'asup');
  if (!x || !t || !t.alive || !specReady(W, u, 'asup') || u.act || u.kb || u.lie || W.t < (u.proneT || -9) || W.t < (u.stunT || -9)) return false;
  const g = gap(u, t); if (g <= (S.min || 5) || g > (S.rng || 12) || !fatClear(W.map, u.x, u.y, t.x, t.y, u.r * 0.9)) return false;
  const nm = u.chargeName; u.chargeName = '초돌진'; startCharge(W, u, t, null); u.chargeName = nm;
  if (!u.act || u.act.k !== 'charge') return false;
  u.act.sup = true; x.cdT = W.t + (S.cd || 10);
  L(W, { k: 'apSup', a: u.i, b: t.i, d: +g.toFixed(1), why: why || '', vis: u.side === 0 || !!u.seenBy || t.side === 0 });
  return true;
}
// 길 둘레 (몸 + w 칸) 의 적: 옆으로 크게 밀려나며 (가벼우면) 넘어짐 · 휩쓸린 몸은 막지 못함 · 돌진은 그들을 지나쳐 노린 적에게
function apSweep(W, u, A){
  const S = APR(W), w = S.w != null ? S.w : 0.9;
  for (const o of W.units){
    if (!o.alive || o.gone || o.side === u.side || o.i === A.b || airOf(o) || o.jrFly || (A.sw && A.sw.includes(o.i))) continue;
    const dx = o.x - u.x, dy = o.y - u.y; if (dx * A.dx + dy * A.dy < -0.3 || Math.hypot(dx, dy) > u.r + o.r + w) continue;
    (A.sw || (A.sw = [])).push(o.i); (A.ev || (A.ev = [])).push(o.i);
    const qx = -A.dy, qy = A.dx, s = dx * qx + dy * qy >= 0 ? 1 : -1, big = o.mass * (o.poise || 1) >= u.mass * (S.heavy || 1.3) || (SIZE_RANK[sizeOf(o)] || 0) >= SIZE_RANK['초대형'];
    strike(W, u, o, o, 1, false, { mul: S.mul || 0.5, wk: '둔기', grab: true, tag: '초돌진에 휩쓸림' });
    if (!o.alive) continue; if (o.kb && o.kb.by === u.i) o.kb = null;
    if (!o.kb) shove(W, u, o, (S.shove || 1.4) * (big ? 0.4 : 1), qx * s * 0.8 + A.dx * 0.6, qy * s * 0.8 + A.dy * 0.6, { tag: '초돌진에 휩쓸려 날아감' });
    if (!big) knockDown(W, o, S.kd || 1, u.i, '초돌진에 휩쓸려 나뒹굶');
    L(W, { k: 'apSweep', a: u.i, b: o.i, down: !big, vis: u.side === 0 || o.side === 0 || !!u.seenBy || !!o.seenBy });
  }
}
// 어퐁이 스스로: 초돌진 (5 ~ 12칸 · 길이 트임 · 지휘가 있는 편은 '들어가!' 뒤 — 돌진과 같은 규칙) · 앞차기 (둘러싸임 · 막고 선 적 · 나를 치려는 적)
// 돌진의 '들어가!' 기다림 (지휘가 있고 방패 · 큰 몸이 있는 편은 지휘가 들어가라 할 때까지) — 편이 혼자면 기다리지 않음
const cmdHold = (W, u) => cmdOf(W, u.side) > 0 && W.units.filter(o => o.alive && !o.gone && o.side === u.side && !o.crawl).length >= 2 && W.units.some(o => o.alive && o.side === u.side && o.role === '전선' && (o.canGuard || o.bodyShield)) && !(W.stance[u.side] && W.stance[u.side].k === 'engage');
function apAuto(W, u, t){
  if (specReady(W, u, 'asup') && !u.line && !cmdHold(W, u) && !W.units.some(f => f.alive && !f.gone && f.side !== u.side && !prone(W, f) && gap(u, f) <= u.rng + 0.6)){   // 맞붙어 있지 않을 때
    const S = APR(W), w = S.w != null ? S.w : 0.9;
    const C = W.units.filter(f => f.alive && !f.gone && f.side !== u.side && !f.jrFly && !airOf(f) && (canSee(W, u, f) || (u.side === 0 ? !!f.seenBy : fresh(W, u.sense[f.i], 1.5))) && gap(u, f) > (S.min || 5) && gap(u, f) <= (S.rng || 12) && fatClear(W.map, u.x, u.y, f.x, f.y, u.r * 0.9)
        && !W.units.some(o => o.alive && o !== u && o.side === u.side && segD(u, f.x, f.y, o) < o.r + u.r && W.units.some(e => e.alive && e.side !== o.side && gap(o, e) < Math.max(o.rng, e.rng) + 0.3)))
      .map(f => ({ f, s: (isFar(f) ? 2 : 0) + (f === t ? 1 : 0) + 0.6 * W.units.filter(e => e.alive && e !== f && e.side !== u.side && segD(u, f.x, f.y, e) < u.r + e.r + w).length - 0.05 * gap(u, f) }))
      .sort((a, b) => b.s - a.s)[0];   // 진형 뒤의 사수 먼저 · 길에 휩쓸 적이 많을수록 · 노린 적 · 가까울수록
    if (C && apSup(W, u, C.f, isFar(C.f) ? '진형 뒤의 사수에게 초돌진' : C.f === t ? '멀리 떨어진 적에게 초돌진' : '진형을 뚫고 초돌진')) return true; }
  if (specReady(W, u, 'akick') && gap(u, t) <= u.rng + 0.3 && !prone(W, t) && !airOf(t) && !t.jrFly){
    const adj = W.units.filter(e => e.alive && !e.gone && e.side !== u.side && !prone(W, e) && gap(u, e) <= u.rng + 0.4).length, gd = inGuard(W, t, u), thr = !!(t.act && t.act.b === u.i && t.act.phase === 'wind' && !isFar(t));
    if (adj >= 2 || gd || thr || W.rand() < 0.04) return startSpec(W, u, t, 'akick', adj >= 2 ? '둘러싼 적을 차서 떼어 냄' : gd ? '막고 선 적을 차서 밀어냄' : thr ? '치려는 적을 먼저 차 냄' : '앞차기'); }
  return false;
}
// 겨눈 방향 · 자리 (기술을 시작할 때 정함 — 예고를 보고 피할 수 있음)
function karAim(W, u, t, k){
  if (!t) return {};
  const ang = Math.atan2(t.y - u.y, t.x - u.x), S = SPR(W, k);
  if (k === 'kslam') return { ang, px: u.x + Math.cos(ang) * (S.ahead || 1.3), py: u.y + Math.sin(ang) * (S.ahead || 1.3) };
  if (k === 'kstomp') return { ang, px: t.x, py: t.y };
  if (k === 'krush') return { ang, dx: Math.cos(ang), dy: Math.sin(ang) };
  return { ang };
}
// 부채꼴 안의 적 (몸 가운데부터 R · 벽 너머는 못 침)
const karFan = (W, u, ang, R, arc, air) => W.units.filter(e => e.alive && !e.gone && e.side !== u.side && !e.jrFly && (air || !airOf(e)) && dist(u, e) - e.r <= R && angDiff(Math.atan2(e.y - u.y, e.x - u.x), ang) <= arc / 2 + Math.atan2(e.r, Math.max(0.3, dist(u, e))) && losClear(W.map, u.x, u.y, e.x, e.y));
// 카리우스가 스스로 (3D kariusThink 의 차례)
function karAuto(W, u, t){
  const d = dist(u, t);
  if (specReady(W, u, 'kstomp')){ const dn = W.units.filter(e => e.alive && !e.gone && e.side !== u.side && prone(W, e) && !e.jrFly && gap(u, e) <= 0.7 && canSee(W, u, e)).sort((p, q) => dist(u, p) - dist(u, q))[0];
    if (dn) return startSpec(W, u, dn, 'kstomp', isBoss(dn) ? '누운 보스를 짓밟음' : '누운 적을 확인사살'); }
  if (specReady(W, u, 'kick') && gap(u, t) <= u.rng + 0.15 && !isBoss(t) && !airOf(t) && !t.jrFly){ const a0 = Math.atan2(t.y - u.y, t.x - u.x), wb = wallBehind(W, t, Math.cos(a0), Math.sin(a0), 3.5);
    if (wb || W.rand() < 0.35) return startSpec(W, u, t, 'kick', wb ? '벽을 등진 적을 걷어참' : '앞의 적을 걷어참'); }
  if (u.heretic && specReady(W, u, 'krush')){ const S = SPR(W, 'krush'); if (d > (S.min || 2.8) && d < (S.max || 7) && fatClear(W.map, u.x, u.y, t.x, t.y, u.r * 0.9)) return startSpec(W, u, t, 'krush', '몸을 낮춰 일직선으로 몸박'); }
  if (u.heretic && specReady(W, u, 'kslam') && d <= (SPR(W, 'kslam').d || 2.3) + t.r) return startSpec(W, u, t, 'kslam', '노인의 팔이 부풀어 철퇴처럼');
  if (specReady(W, u, 'kgrab') && !t.jrFly){ const S = SPR(W, 'kgrab'), air = airOf(t);
    if (air ? d <= (S.dAir || 3.4) : d <= (S.d || 1.9) + t.r * 0.5 && !isBoss(t) && (SIZE_RANK[sizeOf(t)] || 0) < SIZE_RANK['초대형']) return startSpec(W, u, t, 'kgrab', air ? '뛰어오른 적을 광대의 팔로 끌어내림' : '광대의 팔로 끌어와 꿰뚫음'); }
  if (specReady(W, u, 'kstomp') && gap(u, t) <= 0.7 && !isBoss(t) && !airOf(t) && W.rand() < 0.3) return startSpec(W, u, t, 'kstomp', '짓밟아 넘어뜨림');
  if (specReady(W, u, 'khook') && d <= (SPR(W, 'khook').r || 1.9) + t.r) return startSpec(W, u, t, 'khook', '팔 여럿으로 라이트 훅 세 번');
  if (specReady(W, u, 'ksw')){ const S = SPR(W, 'ksw'); if (karFan(W, u, Math.atan2(t.y - u.y, t.x - u.x), S.r || 2.7, (S.arc || 137) * Math.PI / 180, true).length) return startSpec(W, u, t, 'ksw', '노인의 팔로 앞을 후려침'); }
  return false;
}
// 예고 (보고 피함): 부채꼴 · 줄 · 한 몸
function karTg(W, a, A, t){
  const S = SPR(W, A.s), ang = A.ang != null ? A.ang : Math.atan2(t.y - a.y, t.x - a.x);
  if (A.s === 'ksw' || A.s === 'khook') return { k: 'fan', ang, arc: (S.arc || (A.s === 'ksw' ? 137 : 97)) * Math.PI / 360 + 0.15, R: (S.r || (A.s === 'ksw' ? 2.7 : 1.9)) + 0.3, what: A.s === 'ksw' ? '노인의 팔' : '라이트 훅', foe: true };
  if (A.s === 'kslam') return { k: 'fan', ang, arc: 1.0, R: (S.ahead || 1.3) + (S.r || 1.3) + 0.3, what: '노인의 팔 철퇴', foe: true };
  if (A.s === 'krush') return { k: 'line', ang, len: (S.v || 9) * (S.time || 0.5) + 1, w: a.r + 0.4, what: '돌진 몸박', foe: true };
  return { k: 'one', b: t.i, ang, what: A.s === 'kgrab' ? '광대의 팔' : A.s === 'kstomp' ? '짓밟으려는 발' : '앞차기' };
}
// 카리우스의 기술이 떨어지는 때 (resolveSpec 맨 앞)
function karResolve(W, u, A, S, t){
  const k = A.s, vis = u.side === 0 || !!u.seenBy || !!(t && t.side === 0);
  if (A.phase === 'rec'){ u.act = null; return; }
  const rec = () => { A.phase = 'rec'; A.end = W.t + (S.rec || 0.5); A.t1 = W.t; u.atkT = W.t; };
  const ang = A.ang != null ? A.ang : t ? Math.atan2(t.y - u.y, t.x - u.x) : u.face || 0;
  if (k === 'kgrab'){   // 잡아뚫기: 광대의 팔이 돋아 붙잡아 끌어옴 (0.6초) → 레프트로 꿰뚫음
    if (A.phase === 'wind'){
      if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); rec(); return; }
      const air = airOf(t), d = dist(u, t);
      if (t.jrFly){ L(W, { k: 'miss', a: u.i, b: t.i, why: '하늘 — 광대의 팔이 닿지 않음', spec: k }); rec(); return; }
      if (isBoss(t) && !air){ L(W, { k: 'miss', a: u.i, b: t.i, why: '보스는 끌어오지 못함 (뛰어오른 때만 끌어내림)', spec: k }); rec(); return; }
      if (!air && (SIZE_RANK[sizeOf(t)] || 0) >= SIZE_RANK['초대형']){ L(W, { k: 'miss', a: u.i, b: t.i, why: '너무 커서 끌어오지 못함', spec: k }); rec(); return; }
      if (d > (air ? S.dAir || 3.4 : S.d || 1.9) + t.r * 0.5 + 0.3){ L(W, { k: 'miss', a: u.i, b: t.i, why: '광대의 팔이 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); rec(); return; }
      if (t.side !== u.side && !air && evadeMelee(W, t, u)){ rec(); return; }
      if (air) t.act = null;   // 뛰어오른 몸을 끌어내림
      A.phase = 'pull'; A.end = W.t + (S.pull || 0.6); A.held = t.i; A.air = air; t.heldBy = u.i; interrupt(W, t, '광대의 팔에 붙잡혀 준비가 끊김'); stop(t); t.burst = null; flailDrop(W, t, '붙잡힘');
      L(W, { k: 'karGrab', a: u.i, b: t.i, air, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: air ? '끌어내림!' : '잡힘!', c: 'd', t0: W.t }); return;
    }
    const v = A.held != null ? W.units[A.held] : null; if (v && v.heldBy === u.i) v.heldBy = null; A.held = null;
    if (v && v.alive){ const o = strike(W, u, v, v, 1, false, { mul: S.mul || 1.25, crit: W.rand() < (S.crit != null ? S.crit : 0.5), noArmor: true, grab: true, tag: '잡아뚫기 — 레프트 꿰뚫기' }); if (v.alive && A.air) stun(W, v, S.stun || 0.4, u.i); L(W, { k: 'karPierce', a: u.i, b: v.i, crit: !!(o && o.crit), air: !!A.air, vis }); }
    rec(); return;
  }
  if (k === 'ksw'){   // 노인의 팔 후려치기: 앞 부채꼴 — 밀침 · 휘청 (막으면 덜)
    const arc = (S.arc || 137) * Math.PI / 180, hit = karFan(W, u, ang, S.r || 2.7, arc, true);
    for (const e of hit){ const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.25, wk: '둔기', tag: '노인의 팔 — 후려치기' }); if (!e.alive) continue; if (e.kb && e.kb.by === u.i) e.kb = null;
      if (!e.kb) shove(W, u, e, (S.kb || 1.6) * (o && o.block ? 0.5 : 1), e.x - u.x, e.y - u.y, { tag: '노인의 팔에 밀려남' }); if (o && !o.block) stun(W, e, S.stun || 0.5, u.i); }
    L(W, { k: 'karSwat', a: u.i, n: hit.length, vis }); if (W.fxOn) W.fx.push({ k: 'kfan', a: u.i, x: u.x, y: u.y, ang, R: S.r || 2.7, arc, t0: W.t, c: 'old' }); rec(); return;
  }
  if (k === 'khook'){   // 라이트 훅 세 번: 팔 여럿으로 (마지막은 밀침 · 뛰어오른 몸도)
    const arc = (S.arc || 97) * Math.PI / 180, n = (A.n || 0) + 1, last = n >= (S.n || 3), hit = karFan(W, u, ang, S.r || 1.9, arc, last);
    for (const e of hit){ const o = strike(W, u, e, e, 1, false, { mul: S.mul || 0.45, wk: '둔기', tag: '라이트 훅 ' + n + '타' }); if (!e.alive) continue; if (e.kb && e.kb.by === u.i) e.kb = null; if (!e.kb && o && !o.block) shove(W, u, e, last ? S.kb || 1 : S.kb1 || 0.2, e.x - u.x, e.y - u.y, { tag: '라이트 훅에 밀려남' }); }
    L(W, { k: 'karHook', a: u.i, n, hit: hit.length, vis }); if (W.fxOn) W.fx.push({ k: 'kfan', a: u.i, x: u.x, y: u.y, ang, R: S.r || 1.9, arc, t0: W.t, c: 'hook' });
    if (!last){ A.n = n; A.phase = 'hook'; A.end = W.t + (S.gap || 0.15); return; }
    rec(); return;
  }
  if (k === 'kstomp'){   // 짓밟기: 발을 든 자리 (처음에 정함) — 누운 적은 확인사살 (보스는 크게 다침) · 선 적은 넘어뜨림 (대형부터는 버팀)
    const px = A.px != null ? A.px : t ? t.x : u.x, py = A.py != null ? A.py : t ? t.y : u.y, R = S.r || 0.95; let lying = false, n = 0;
    for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || airOf(e) || e.jrFly || Math.hypot(e.x - px, e.y - py) > R + e.r) continue; n++;
      if (prone(W, e)){ lying = true; const bs = isBoss(e);
        L(W, { k: 'stomp', a: u.i, b: e.i, kill: !bs, how: '짓밟기', vis: u.side === 0 || e.side === 0 || !!u.seenBy });
        if (!bs) applyDmg(W, u, e, Math.max(1, Math.ceil(e.hp)), { ff: false, far: false, part: '머리', tag: '짓밟기 · 확인사살' });
        else { hurtRaw(W, u, e, u.atk * u.atkMul * (W.rules.lethal || 1) * (S.boss || 2.5), { tag: '짓밟기' }); crushBone(W, u, e); } }
      else { const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.1, wk: '둔기', tag: '짓밟기' }); if (e.alive && o && !o.block && (SIZE_RANK[sizeOf(e)] || 0) < SIZE_RANK['대형']) knockDown(W, e, S.down || 1, u.i, '카리우스에게 짓밟혀 넘어짐'); } }
    const x = specOf(u, 'kstomp'); if (x && !lying) x.cdT = Math.max(x.cdT, A.t0 + (S.cdUp || 8));   // 선 적이면 대기 8초 (누운 적은 4초)
    if (W.fxOn) W.fx.push({ k: 'crush', x: px, y: py, t0: W.t }); if (!n) L(W, { k: 'miss', a: u.i, b: A.b, why: '발을 내린 자리에 아무도 없음', spec: k });
    rec(); return;
  }
  if (k === 'kslam'){   // 불경자 — 노인의 팔이 부풀어 철퇴처럼: 앞 1.3칸 자리 둘레 1.3칸 · 휘청
    const px = A.px != null ? A.px : u.x + Math.cos(ang) * (S.ahead || 1.3), py = A.py != null ? A.py : u.y + Math.sin(ang) * (S.ahead || 1.3), R = S.r || 1.3; let n = 0;
    for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || e.jrFly || Math.hypot(e.x - px, e.y - py) > R + e.r) continue; n++;
      const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.67, wk: '둔기', tag: '노인의 팔 철퇴' }); if (!e.alive) continue; if (e.kb && e.kb.by === u.i) e.kb = null;
      if (!e.kb) shove(W, u, e, (S.kb || 0.8) * (o && o.block ? 0.5 : 1), e.x - px, e.y - py, { tag: '철퇴에 밀려남' }); if (o && !o.block) stun(W, e, S.stun || 0.6, u.i); }
    L(W, { k: 'karSlam', a: u.i, n, vis }); if (W.fxOn){ W.fx.push({ k: 'crush', x: px, y: py, t0: W.t }); W.fx.push({ k: 'num', x: px, y: py, s: '쾅!', c: 'd', t0: W.t }); }
    rec(); return;
  }
  if (k === 'krush'){   // 불경자 — 돌진 몸박: 몸을 낮췄다가 (예고) 일직선으로 0.5초 밀고 나감 (karRushStep)
    if (A.phase === 'wind'){ A.phase = 'go'; A.end = W.t + (S.time || 0.5); A.hit = []; if (A.dx == null){ A.dx = Math.cos(ang); A.dy = Math.sin(ang); } L(W, { k: 'karRush', a: u.i, b: A.b, vis }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '우오오오!', t0: W.t }); return; }
    rec(); return;
  }
  u.act = null;
}
function karRushStep(W, u, dt){
  const A = u.act, S = SPR(W, 'krush'), x0 = u.x, y0 = u.y, st = (S.v || 9) * dt;
  tryMove(W, u, u.x + A.dx * st, u.y + A.dy * st); u.face = u.fg = Math.atan2(A.dy, A.dx);
  if (Math.hypot(u.x - x0, u.y - y0) < st * 0.3) A.end = W.t;   // 벽에 막힘
  for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || A.hit.includes(e.i) || airOf(e) || e.jrFly || dist(u, e) > u.r + e.r + 0.15) continue;
    A.hit.push(e.i); const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.46, wk: '둔기', tag: '돌진 몸박' }); if (!e.alive) continue; if (e.kb && e.kb.by === u.i) e.kb = null;
    if (!e.kb) shove(W, u, e, (S.kb || 4.5) * (o && o.block ? 0.6 : 1), A.dx, A.dy, { tag: '몸박에 밀려 날아감', how: 'kick' }); }
}
// 광대의 팔에 붙잡힘: 끌려옴 (몸 바로 앞까지) · 아무것도 못 함 — 카리우스가 휘청 · 넘어지면 놓침
function karHeld(W, g, u, dt){
  const A = g.act;
  if (g.kb || W.t < (g.proneT || -9) || W.t < (g.stunT || -9)){ u.heldBy = null; A.held = null; L(W, { k: 'karLet', a: g.i, b: u.i, vis: true }); return false; }
  if (A.phase === 'pull'){ const a = Math.atan2(u.y - g.y, u.x - g.x), D = g.r + u.r + 0.05, gx = g.x + Math.cos(a) * D, gy = g.y + Math.sin(a) * D, k = Math.min(1, dt * 8); tryMove(W, u, u.x + (gx - u.x) * k, u.y + (gy - u.y) * k); }
  stop(u); u.act = null; u.burst = null; u.vx = u.vy = 0; return true;
}
// 불경자 (체력 15% 아래): 공격 × 2.5 · 받는 피해 × 0.33 · 걸음 × 1.4 · 공격 간격 × 0.8 · 막지 않음 · 노인의 팔 철퇴 · 돌진 몸박 — 체력 50% 넘으면 풀림
function karHeretic(W, u, on){
  if (on === !!u.heretic) return;
  const H = KAR(W).heretic || {}, A = H.atk || 2.5, Df = H.def || 0.33, S = H.spd || 1.4, G = H.gap || 0.8;
  if (on){
    u.heretic = true; u.atk = +(u.atk * A).toFixed(2); u.spd = +(u.spd * S).toFixed(3); u.wind = +(u.wind * G).toFixed(3); u.rec = +(u.rec * G).toFixed(3); u.dmgK = (u.dmgK || 1) * Df; u.canGuard0 = u.canGuard; u.canGuard = false; u.raised = false;
    for (const [sk, nm] of [['kslam', '노인의 팔 철퇴'], ['krush', '돌진 몸박']]) if (!specOf(u, sk)) (u.spec || (u.spec = [])).push({ k: sk, name: nm, cdT: W.t + 0.8, n: null });
    if (!u.ls){ const A0 = u.act; if (A0 && A0.k === 'spec' && A0.s === 'kgrab' && A0.held != null){ const v = W.units[A0.held]; if (v) v.heldBy = null; } interrupt(W, u, '불경자 — 울부짖음'); u.act = { k: 'karRoar', t0: W.t, end: W.t + (H.roar || 0.6) }; stop(u); }
    L(W, { k: 'karHeretic', a: u.i, on: true, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y - 0.6, s: '불경자!', c: 'd', t0: W.t });
  } else {
    u.heretic = false; u.atk = +(u.atk / A).toFixed(2); u.spd = +(u.spd / S).toFixed(3); u.wind = +(u.wind / G).toFixed(3); u.rec = +(u.rec / G).toFixed(3); u.dmgK = (u.dmgK || 1) / Df; if (u.canGuard0 != null) u.canGuard = u.canGuard0;
    L(W, { k: 'karHeretic', a: u.i, on: false, vis: u.side === 0 || !!u.seenBy });
  }
}
// 근성: 숨이 끊길 피해 → 발버둥 (무적) 으로 바뀜 · 마지막 7초는 체력 1 은 남음
function karGritHit(W, u, t, dmg, o){
  const L0 = t.ls;
  if (L0){ if (u && u !== t && u.side !== t.side) L0.by = u.i;
    if (L0.ph !== 'last'){ if (W.fxOn && W.t - (t.lsFxT || -9) > 0.4){ t.lsFxT = W.t; W.fx.push({ k: 'num', x: t.x, y: t.y - 0.5, s: '무적 (근성)', c: 'b', t0: W.t }); } return 0; }
    const d = Math.min(dmg, Math.max(0, t.hp - 1)); if (d <= 0 && W.fxOn && W.t - (t.lsFxT || -9) > 0.4){ t.lsFxT = W.t; W.fx.push({ k: 'num', x: t.x, y: t.y - 0.5, s: '버팀 (근성)', c: 'g', t0: W.t }); } return d; }
  if (t.hp - dmg >= 0.5) return dmg;
  karGritStart(W, t, u, o); return 0;
}
function karGritStart(W, t, u, o){
  const A0 = t.act; if (A0 && A0.k === 'spec' && A0.s === 'kgrab' && A0.held != null){ const v = W.units[A0.held]; if (v) v.heldBy = null; }
  interrupt(W, t, '근성 — 무너짐'); t.act = null; t.burst = null; stop(t); t.hp = 1; t.deathKind = null; t.headAt = null;
  t.ls = { ph: 'agony', t0: W.t, by: u && u !== t ? u.i : null };
  if (t.heretic0 && !t.heretic) karHeretic(W, t, true);   // 3D: 근성이 켜지면 불경자도
  L(W, { k: 'karGrit', a: u && u !== t ? u.i : t.i, b: t.i, ph: 'agony', sec: (KAR(W).grit || {}).agony || 3, vis: true }); if (W.fxOn) W.fx.push({ k: 'say', a: t.i, s: '…(안경 빛이 꺼진다)', t0: W.t });
}
// 매 틱 (act 맨 앞): 벼락 → 차갑게 미쳐 감 · 불경자 켜고 끔 · 근성의 차례 (발버둥 → 포효 → 마지막 7초 → 쓰러짐). true = 이번 틱은 아무것도 못 함
function karTick(W, u, dt){
  const K = KAR(W), R = K.rage || {}, H = K.heretic || {};
  if (u.rageOn && W.t >= u.rageT){ u.rageOn = false; u.atk = +(u.atk / (R.atk || 1.3)).toFixed(2); L(W, { k: 'karRage', a: u.i, off: true, vis: u.side === 0 || !!u.seenBy }); }
  if (u.modBody && u.zap && u.zap.n > 0 && u.zap !== u.rageZap && !u.rageOn && !u.ls){ u.rageZap = u.zap; u.rageOn = true; u.rageT = W.t + (R.t || 6); u.atk = +(u.atk * (R.atk || 1.3)).toFixed(2); L(W, { k: 'karRage', a: u.i, sec: R.t || 6, vis: u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '…(연기를 토한다)', t0: W.t }); }
  if (u.heretic0 && !u.ls){ if (!u.heretic && u.hp <= u.max * (H.at || 0.15)) karHeretic(W, u, true); else if (u.heretic && !u.lsEnd && u.hp > u.max * (H.off || 0.5)) karHeretic(W, u, false); }
  const L0 = u.ls; if (!L0) return false;
  const G = K.grit || {}; u.hp = Math.max(1, u.hp);
  if (L0.ph === 'agony'){ stop(u); u.act = null; u.burst = null; if (W.t >= L0.t0 + (G.agony || 3)){ L0.ph = 'roar'; L0.t1 = W.t; L(W, { k: 'karGrit', a: u.i, b: u.i, ph: 'roar', vis: true }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '우어어어어!', t0: W.t }); } return true; }
  if (L0.ph === 'roar'){ stop(u); u.act = null; if (W.t >= L0.t1 + (G.roar || 0.8)){ const sp = G.spd || 1.5; L0.ph = 'last'; L0.t2 = W.t; u.wind = +(u.wind / sp).toFixed(3); u.rec = +(u.rec / sp).toFixed(3); u.saT = Math.max(u.saT || -9, W.t + (G.last || 7) + 0.05); u.stunT = -9; u.proneT = -9; L(W, { k: 'karGrit', a: u.i, b: u.i, ph: 'last', sec: G.last || 7, vis: true }); } return true; }
  for (const x of u.spec || []) if (x.cdT > W.t) x.cdT -= dt * ((G.spd || 1.5) - 1);   // 마지막 7초: 기술 대기도 1.5배 빨리
  if (W.t >= L0.t2 + (G.last || 7)){ karGritEnd(W, u); return true; }
  return false;
}
// 실이 끊긴 듯 쓰러짐 (숨을 끊은 이 = 마지막으로 친 적)
function karGritEnd(W, u){
  const G = KAR(W).grit || {}, sp = G.spd || 1.5, L0 = u.ls || {};
  u.ls = null; u.lsEnd = true; u.saT = W.t; if (L0.ph === 'last'){ u.wind = +(u.wind * sp).toFixed(3); u.rec = +(u.rec * sp).toFixed(3); }
  const by = L0.by != null && W.units[L0.by] ? W.units[L0.by] : u;
  L(W, { k: 'karGrit', a: u.i, b: u.i, ph: 'end', vis: true });
  applyDmg(W, by, u, Math.max(1, Math.ceil(u.hp)) + 1, { ff: by === u || by.side === u.side, far: false, part: null, tag: '근성이 다함 — 실이 끊긴 듯 쓰러짐', death: 'grit' });
}
// 근성 중에 싸움이 끝남: 이겨도 쓰러짐 — 체력 5% 로 살아남음 (3D 굴 싸움이 끝날 때처럼)
function karGritOver(W, u){
  const G = KAR(W).grit || {}, sp = G.spd || 1.5, L0 = u.ls || {};
  u.ls = null; u.lsEnd = true; u.saT = W.t; if (L0.ph === 'last'){ u.wind = +(u.wind * sp).toFixed(3); u.rec = +(u.rec * sp).toFixed(3); }
  u.hp = Math.max(1, Math.round(u.max * (G.endHp || 0.05))); u.act = null; stop(u); u.proneT = W.t + 2;
  L(W, { k: 'karGrit', a: u.i, b: u.i, ph: 'over', hp: u.hp, vis: true });
}
function karWorld(W){ for (const u of W.units) if (u.ls && u.alive && !W.units.some(e => e.alive && !e.gone && e.side !== u.side)) karGritOver(W, u); }
"""
rep("if (typeof module !== 'undefined') module.exports = { think, prnRat,", AK + "\nif (typeof module !== 'undefined') module.exports = { cmdHold, apSup, apSweep, apAuto, karAim, karFan, karAuto, karTg, karResolve, karRushStep, karHeld, karHeretic, karGritHit, karGritStart, karTick, karGritEnd, karGritOver, karWorld, think, prnRat,")

for n, s in P.items():
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8780c OK')
