# v7.29.0 엔진 — patch7290.py v1.3 (v1.3: 공중제비 3.2 → 6칸 (도감: 매우 먼 데서 순식간에 다가와 떨어짐 — 탕아는 돌격 대신) · v1.2: 버팀은 부위 파괴 (다리 · 팔 — 기어다님 → 짓밟기 · 확인사살) 도 그만큼 막음 · v1.1: 왕관은 갑피 밑에 써도 (under) · 거두는 공에 넘어지면 무기의 밀침 대신 그 자리에 넘어짐 · v1.0: 싸움 바로잡기: 모닝스타 철퇴 오사 (던질 때 · 거둘 때) · 돌격 성향 (chgBias · 돌격 안 함) · 세자르 2D 판처럼 (버팀 ccRes · 원형 베기 → 몇 초 뒤 돌진 원형 베기) · 왕관 [★권위E])
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def load(n): return open(D + 'rt3_%s_v7270.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)

# --- 수치 (양쪽 같은 규칙) ---
H = rep(H, "modBody: { dmg: 0.7, pin: 0.5 }", "modBody: { dmg: 0.7, pin: 0.5, authW: 0.15 }")   # v7.29.0 [★권위E]: 왕관을 쓴 이의 상대 신성 ([개조된 신체]) 효과 × (1 − authW)
H = rep(H, "trec:0.3, reel:30}}", "trec:0.3, reel:30, ff:0.55, backMul:0.6, backDown:0.35, backV:4}}")   # v7.29.0 오사 (동료 몸 반지름 × ff 안으로 지나면) · 거둘 때 맞힘 (× backMul · 넘어뜨릴 확률 backDown · 공 빠르기 backV 넘을 때)
H = rep(H, "hitStun: 0.45, frostT: 4,", "hitStun: 0.45, frostT: 4, spinP: 0.8, rspin: [3, 4.5],")   # v7.29.0 붙으면 원형 베기 (확률) · rspin 초 뒤 돌진해 다시 원형 베기
H = rep(H, "  cz: { bulletEv: 0.7,", "  cc: { shove: 0.6, fxGap: 0.6 },   /* v7.29.0 버팀 (ccRes): 넘어짐 · 휘청을 그 확률로 버팀 · 밀려나는 거리 × (1 − ccRes × shove) */\n  cz: { bulletEv: 0.7,")

H = rep(H, "flip: { d: 3.2, back: 2.6,", "flip: { d: 6, back: 2.6,")   # v7.29.0 (옛 기본값 3.2 는 oldrules.json 으로 이전)

# --- 유닛: 버팀 · 돌격 성향 ---
T = rep(T, "leapN: +p.leapN || 1,", "leapN: +p.leapN || 1, ccRes: Math.max(0, Math.min(0.95, +p.ccRes || 0)), chgBias: +p.chgBias || 0, noChg: !!p.noChg, noChg0: !!p.noChg,")   # v7.29.0

# --- [★권위E] ---
T = rep(T, "const mbOn = (W, u) => !!u.modBody && !W.seal;   /* v7.23.2 권위 (신성 봉인) 중엔 [개조된 신체] 가 꺼짐 */",
        "const mbOn = (W, u) => !!u.modBody && !W.seal;   /* v7.23.2 권위 (신성 봉인) 중엔 [개조된 신체] 가 꺼짐 */\n"
        "const crownOn = u => !!u && Object.values(u.gear || {}).some(g => g && [g, g.under].some(x => x && (x.auth || x.name === '노인의 왕관')));   /* v7.29.0 [★권위E] — 노인의 왕관 (쓰는 이는 누구든: 전리품으로 주워 써도) */\n"
        "const authOn = (W, u) => W.units.some(o => o.alive && o.side !== u.side && crownOn(o));\n"
        "function mbF(W, u, k){ const R = W.rules.modBody || {}, f = R[k] != null ? R[k] : k === 'dmg' ? 0.7 : 0.5; return authOn(W, u) ? 1 - (1 - f) * (1 - (R.authW != null ? R.authW : 0.15)) : f; }   // 신성 효과 (줄여 주는 몫) 를 authW 만큼 약하게")
T = rep(T, "(mbOn(W, hit) ? (W.rules.modBody || {}).pin || 0.5 : 1)", "(mbOn(W, hit) ? mbF(W, hit, 'pin') : 1)")
T = rep(T, "(mbOn(W, t) ? (R.modBody || {}).dmg || 0.7 : 1)", "(mbOn(W, t) ? mbF(W, t, 'dmg') : 1)", 2)
T = rep(T, "(mbOn(W, t) ? (R.modBody || {}).pin || 0.5 : 1)", "(mbOn(W, t) ? mbF(W, t, 'pin') : 1)", 2)
T = rep(T, "(mbOn(W, u) ? (W.rules.modBody || {}).pin || 0.5 : 1)", "(mbOn(W, u) ? mbF(W, u, 'pin') : 1)")
T = rep(T, "(mbOn(W, t) ? (W.rules.modBody || {}).dmg || 0.7 : 1)", "(mbOn(W, t) ? mbF(W, t, 'dmg') : 1)")

# --- 버팀 (ccRes) ---
T = rep(T, "function knockDown(W, u, sec, by, why){\n  if (!u.alive || u.crawl || W.t < (u.saT || -9)) return;   /* v7.23.2 슈퍼아머 */\n",
        "function knockDown(W, u, sec, by, why){\n  if (!u.alive || u.crawl || W.t < (u.saT || -9)) return;   /* v7.23.2 슈퍼아머 */\n"
        "  if (u.ccRes && W.rand() < u.ccRes){ ccShrug(W, u, by, 'prone'); return; }   /* v7.29.0 버팀 (세자르 — 잘 넘어지지 않음) */\n")
T = rep(T, "function stun(W, u, sec, by){\n  if (!u.alive || !(sec > 0) || W.t < (u.saT || -9)) return 0;   /* v7.23.2 슈퍼아머 */\n",
        "// v7.29.0 버팀: 넘어짐 · 휘청을 버팀 (글 · 반짝은 fxGap 초에 한 번)\n"
        "function ccShrug(W, u, by, what){ L(W, { k: 'ccRes', a: by != null ? by : u.i, b: u.i, what, vis: u.side === 0 || !!u.seenBy });\n"
        "  if (W.fxOn && W.t - (u.ccFxT || -9) >= ((W.rules.cc || {}).fxGap || 0.6)){ u.ccFxT = W.t; W.fx.push({ k: 'num', x: u.x, y: u.y, s: '버팀!', c: 'g', t0: W.t }); } }\n"
        "function stun(W, u, sec, by){\n  if (!u.alive || !(sec > 0) || W.t < (u.saT || -9)) return 0;   /* v7.23.2 슈퍼아머 */\n"
        "  if (u.ccRes && W.rand() < u.ccRes){ ccShrug(W, u, by, 'stun'); return 0; }   /* v7.29.0 버팀 (세자르 — 휘청도 거의 안 걸림) */\n")
T = rep(T, "  let len = kbLen(W, a, t, power) * (t.crawl ? 0.5 : 1);\n",
        "  let len = kbLen(W, a, t, power) * (t.crawl ? 0.5 : 1) * (t.ccRes ? 1 - t.ccRes * ((W.rules.cc || {}).shove != null ? W.rules.cc.shove : 0.6) : 1);   /* v7.29.0 버팀: 덜 밀림 */\n")

T = rep(T, "const maimRes = (W, t) => Math.min(1, Math.sqrt(((W.rules.maim || {}).massRes || 90) / Math.max(1, t.mass || 62))) * (mbOn(W, t) ? 0.6 : 1);",
        "const maimRes = (W, t) => Math.min(1, Math.sqrt(((W.rules.maim || {}).massRes || 90) / Math.max(1, t.mass || 62))) * (mbOn(W, t) ? 0.6 : 1) * (1 - (t.ccRes || 0));   /* v7.29.0 버팀: 다리 · 팔도 잘 안 부러짐 (세자르가 기어다니다 짓밟히지 않게) */")

# --- 돌격 성향 ---
T = rep(T, "function tryCharge(W, u, t, forced, noStance){\n  const C = W.rules.charge || {}, g = gap(u, t);\n",
        "function tryCharge(W, u, t, forced, noStance){\n  const C = W.rules.charge || {}, g = gap(u, t);\n"
        "  if (u.noChg) return false;   // v7.29.0 돌격 안 함 (성향 · 유저 설정) — 유저의 돌진 명령 (startCharge) 은 따로라 언제나 됨\n")
T = rep(T, "- u.bold * 0.8 + ((planOf(W, u.side) || {}).chg || 0);",
        "- u.bold * 0.8 + ((planOf(W, u.side) || {}).chg || 0) + (u.chgBias || 0);")   # v7.29.0 성향 (모닝스타 +2 — 중거리를 지키다 드물게)
T = rep(T, "  return best && bv >= (C.worth != null ? C.worth : 1.8) - u.bold * 0.8 ? best : null;",
        "  return best && bv >= (C.worth != null ? C.worth : 1.8) - u.bold * 0.8 + (u.chgBias || 0) ? best : null;")
T = rep(T, "  if (!u.canCharge || u.crawl || u.act || u.kb ||", "  if (!u.canCharge || u.crawl || u.act || u.kb ||")   # (자리 확인만)
T = rep(T, "const gapU = mine.some(u => u.canCharge && !u.act", "const gapU = mine.some(u => u.canCharge && !u.noChg && !u.act")

# --- 모닝스타: 던질 때 동료가 공 길에 깊이 서 있으면 기다림 (명령이면 오사 감수) ---
T = rep(T, "  const fl = !!FL && gap(u, t) > (FL.close || 0.9) && !(gap(u, t) <= (FL.sw || 1.3) && W.rand() < (FL.swingP || 0.25));\n",
        "  const fl = !!FL && gap(u, t) > (FL.close || 0.9) && !(gap(u, t) <= (FL.sw || 1.3) && W.rand() < (FL.swingP || 0.25));\n"
        "  if (fl && !u.order && !cornered(W, u) && flLane(W, u, t)){ setMood(W, u, '동료가 철퇴 길에 있음', t.i); u.waitT += 0.2; return; }   /* v7.29.0 오사가 되니 길이 트일 때까지 (명령 · 궁지는 감수) */\n")
T = rep(T, "const flailOut = (W, u) => (W.flails || []).some(F => F.by === u.i);",
        "const flailOut = (W, u) => (W.flails || []).some(F => F.by === u.i);\n"
        "const flLane = (W, u, t) => { const FL = flailOf(W, u) || {}, dt0 = dist(u, t); return W.units.some(o => o.alive && o !== u && o.side === u.side && !o.lie && dist(u, o) < dt0 && segD(u, t.x, t.y, o) < o.r * (FL.ff || 0.55) + (FL.ball || 0.2)); };   /* v7.29.0 */")
T = rep(T, "ph: 'out', hit: null, ev: [], t0: W.t });\n  u.fg = u.face", "ph: 'out', hit: null, ev: [], bk: [], t0: W.t });\n  u.fg = u.face")

# 나가는 공: 적은 몸 + 공 · 동료는 깊이 겹칠 때만 (몸 반지름 × ff) — 투사체처럼 오사
T = rep(T, "if (Math.hypot(F.vx, F.vy) > (FL.minV || 3)) for (const e of W.units){ if (!e.alive || e === u || e.side === F.side || e.lie || F.ev.includes(e.i) || (e.act && e.act.k === 'leap')) continue;\n"
           "          const sx = F.x - x0, sy = F.y - y0, ll = sx * sx + sy * sy || 1e-9, kk = Math.max(0, Math.min(1, ((e.x - x0) * sx + (e.y - y0) * sy) / ll)), px = x0 + sx * kk - e.x, py = y0 + sy * kk - e.y;\n"
           "          if (px * px + py * py <= (e.r + F.br) * (e.r + F.br) && kk < bt){ bt = kk; best = e; } }\n",
        "if (Math.hypot(F.vx, F.vy) > (FL.minV || 3)) for (const e of W.units){ if (!e.alive || e === u || e.lie || F.ev.includes(e.i) || (e.act && e.act.k === 'leap')) continue;\n"
        "          const sx = F.x - x0, sy = F.y - y0, ll = sx * sx + sy * sy || 1e-9, kk = Math.max(0, Math.min(1, ((e.x - x0) * sx + (e.y - y0) * sy) / ll)), px = x0 + sx * kk - e.x, py = y0 + sy * kk - e.y, rr = e.side === F.side ? e.r * (FL.ff || 0.55) : e.r + F.br;   /* v7.29.0 동료도 (깊이 겹치면) */\n"
        "          if (px * px + py * py <= rr * rr && kk < bt){ bt = kk; best = e; } }\n")
T = rep(T, "else { strike(W, u, best, best, 1, false, { tag: '철퇴 던지기', wk: '둔기' }); F.hit = best.i; F.ph = 'back';   // 몸에 맞고 튕김\n",
        "else { strike(W, u, best, best, 1, false, { tag: best.side === F.side ? '철퇴 던지기 (오사)' : '철퇴 던지기', wk: '둔기' }); F.hit = best.i; F.ph = 'back';   // 몸에 맞고 튕김\n"
        "            if (best.side === F.side) L(W, { k: 'flailFF', a: u.i, b: best.i, back: false, vis: true });\n")
# 돌아오는 공: 빠르게 지나는 길의 몸을 맞힘 (적 × backMul · 넘어뜨릴 수도 · 동료는 깊이 겹칠 때만) — 머리 위로 돌리기 (sweep) 는 따로라 그대로
T = rep(T, "      const pl = F.reel ? (FL.reel || 30) : (FL.pull || 70); F.vx = (F.vx + (hx - F.x) / d * pl * ds) * kd; F.vy = (F.vy + (hy - F.y) / d * pl * ds) * kd; F.x += F.vx * ds; F.y += F.vy * ds; F.L = Math.max(u.r, Math.min(F.L, d + 0.05));\n",
        "      const pl = F.reel ? (FL.reel || 30) : (FL.pull || 70), bx0 = F.x, by0 = F.y; F.vx = (F.vx + (hx - F.x) / d * pl * ds) * kd; F.vy = (F.vy + (hy - F.y) / d * pl * ds) * kd; F.x += F.vx * ds; F.y += F.vy * ds; F.L = Math.max(u.r, Math.min(F.L, d + 0.05));\n"
        "      if (!F.reel && F.bk && Math.hypot(F.vx, F.vy) > (FL.backV || 4)) flailBackHit(W, u, F, FL, bx0, by0);   /* v7.29.0 */\n")
T = rep(T, "// 회전 투척이 날아감:",
        "// v7.29.0 거두는 공이 지나는 길: 처음 닿는 몸 하나 (공마다 한 번씩 · 던질 때 맞은 이는 빼고) — 적은 피할 수 있음 · × backMul · backDown 확률로 넘어짐 / 동료는 깊이 겹치면 오사\n"
        "function flailBackHit(W, u, F, FL, x0, y0){\n"
        "  let best = null, bt = 9; const sx = F.x - x0, sy = F.y - y0, ll = sx * sx + sy * sy || 1e-9;\n"
        "  for (const e of W.units){ if (!e.alive || e === u || e.lie || e.i === F.hit || F.bk.includes(e.i) || F.ev.includes(e.i) || (e.act && e.act.k === 'leap')) continue;\n"
        "    const kk = Math.max(0, Math.min(1, ((e.x - x0) * sx + (e.y - y0) * sy) / ll)), px = x0 + sx * kk - e.x, py = y0 + sy * kk - e.y, rr = e.side === F.side ? e.r * (FL.ff || 0.55) : e.r + F.br;\n"
        "    if (px * px + py * py <= rr * rr && kk < bt){ bt = kk; best = e; } }\n"
        "  if (!best) return; F.bk.push(best.i);\n"
        "  if (best.side !== F.side){ const p = evadeP(W, best, u, 'shot', { sp: Math.hypot(F.vx, F.vy) }); if (p && W.rand() < p){ evaded(W, best, u, 'shot', '돌아오는 철퇴를 피함', p); return; } }\n"
        "  const o = strike(W, u, best, best, 1, false, { mul: FL.backMul || 0.6, tag: best.side === F.side ? '돌아오는 철퇴 (오사)' : '돌아오는 철퇴', wk: '둔기' });\n"
        "  if (best.side === F.side) L(W, { k: 'flailFF', a: u.i, b: best.i, back: true, vis: true });\n"
        "  else if (o && !o.block && best.alive && W.rand() < (FL.backDown != null ? FL.backDown : 0.35)){ if (best.kb && best.kb.by === u.i) best.kb = null; if (!best.kb) knockDown(W, best, 0.9, u.i, '돌아오는 철퇴에 걸려 넘어짐'); }   /* 무기의 밀침 대신 그 자리에 */\n"
        "  F.vx *= 0.7; F.vy *= 0.7;\n"
        "}\n"
        "// 회전 투척이 날아감:")

# --- 세자르: 붙으면 원형 베기 (spinP) → rspin 초 뒤 돌진해서 원형 베기 (대기 무시) ---
T = rep(T, "  for (const k of ['spin', 'shoulder', 'back', 'punish', 'upcut', 'thrust', 'wave', 'ult', 'rstep']) z[k] -= dt;\n",
        "  for (const k of ['spin', 'shoulder', 'back', 'punish', 'upcut', 'thrust', 'wave', 'ult', 'rstep']) z[k] -= dt;\n"
        "  if (z.rspinT != null) z.rspinT -= dt;   /* v7.29.0 */\n")
T = rep(T, "  if (z.atkNow){ const at = W.units[z.atkB]",
        "  if (z.rspinT != null && z.rspinT <= 0 && !u.act){ z.rspinT = null; const S = Z.spin || {}, g = gap(u, t);   /* v7.29.0 2D 판: 원형 베기로 밀어낸 몇 초 뒤 — 이번엔 돌진해서 원형 베기 */\n"
        "    if (dist(u, t) - t.r < (S.r || 2.6) - 0.5) return czStart(W, u, 'spin', t, { chain: true });\n"
        "    if (g < 9) return czStart(W, u, 'rush', t, { spinAfter: true }); }\n"
        "  if (z.atkNow){ const at = W.units[z.atkB]")
T = rep(T, "  if (close.length && !z.fury && z.spin <= 0 && W.rand() < 0.5) return czStart(W, u, 'spin', t);   // 탐색 중 붙으면: 베어서 밀어내거나\n",
        "  if (close.length && !z.fury && z.spin <= 0 && W.rand() < (Z.spinP != null ? Z.spinP : 0.5)){ const RS = Z.rspin || [3, 4.5]; z.rspinT = RS[0] + W.rand() * (RS[1] - RS[0]); return czStart(W, u, 'spin', t); }   // 탐색 중 붙으면: 베어서 밀어내거나 (v7.29.0 대개 — 몇 초 뒤 돌진 원형 베기가 이어짐)\n")
T = rep(T, "    if (Math.hypot(gx - u.x, gy - u.y) < 0.4 || (A.s === 'rush' && inReach(u, t)) || el > (A.s === 'rush' ? 1.5 : 2.5)){ z.atkNow = true;",
        "    if (A.spinAfter && (dist(u, t) - t.r < ((Z.spin || {}).r || 2.6) - 0.8 || el > 1.5)){ czEnd(W, u, 'rush', Z.rushCd || 5); return czStart(W, u, 'spin', t, { chain: true, rushed: true }); }   /* v7.29.0 돌진 원형 베기 (대기 무시) */\n"
        "    if (Math.hypot(gx - u.x, gy - u.y) < 0.4 || (A.s === 'rush' && inReach(u, t)) || el > (A.s === 'rush' ? 1.5 : 2.5)){ z.atkNow = true;")
T = rep(T, "  setMood(W, u, { auth: '손을 듦 — 권위',", "  setMood(W, u, o && o.spinAfter ? '돌진 — 원형 베기' : { auth: '손을 듦 — 권위',")
T = rep(T, "rush: o && o.punish ? '빈틈 찌르기' : '돌진', flank: '뒤로 돌아 들어감' }[s] || s, t ? t.i : null);",
        "rush: o && o.punish ? '빈틈 찌르기' : '돌진', flank: '뒤로 돌아 들어감' }[s] || s, t ? t.i : null);   /* v7.29.0 o.spinAfter */")

for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch7290 OK')
