# v7.24.2 엔진 — patch7242.py v1.2 (v1.2: 마주 돌격에서도 튕겨 나가려는 쪽이 괴력으로 밀어붙임 · v1.1: 무기 뿌리치기의 몸무게 몫 ^0.15 (팔을 비트는 순간 — 몸 전체를 던지는 게 아님) · 근력 · 괴력 나눔: [근력X] = 타고난 힘 — 예전 [괴력X] 가 하던 늘 쓰는 몫 그대로 (공격 × · 막힐 때 상대 자세 · 관통 · 무기 밀침 · 무거운 무기) /
#   [괴력X] = 싸우며 깨우친 힘 — 결정적인 순간에만 × (S 2.0 · A 1.7 · B 1.4 · C 1.2): 크게 밀리려 할 때 버팀 · 넘어지려 할 때 버팀 · 잡힌 무기를 뿌리침 (몸무게 · 근력 차이는 그대로) · 무너지려던 막기를 튕겨냄 (상대를 밀고 휘청) ·
#   들이받히는 순간 버팀 · 되튕기려는 순간 밀어붙임 · 밀치기가 안 먹힐 때 밀어붙임. 쓰면 잠깐 빈틈 (막기 어려움) · 등급마다 대기 (S 4 · A 5 · B 6 · C 7초). 양쪽 같은 규칙)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
FS = {k: open(D + k + '_v7241.js', encoding='utf-8').read() for k in ('rt3_head', 'rt3_mid', 'rt3_tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in FS.values())
    assert n == c, (n, c, a[:100])
    for k in FS:
        FS[k] = FS[k].replace(a, b)

# 규칙
rep("'괴력': { S: 1.6, A: 1.45, B: 1.3, C: 1.15 }", "'근력': { S: 1.6, A: 1.45, B: 1.3, C: 1.15 }, '괴력': { S: 2.0, A: 1.7, B: 1.4, C: 1.2 }")
rep("  grab: { p: 0.05, cap: 0.15, cd: 2.5,", "  might: { cd: { S: 4, A: 5, B: 6, C: 7 }, open: 0.4, offBal: 0.35, min: 0.5, weak: 0.35, counter: 0.5, cStun: 0.3 },   /* v7.24.2 괴력 (순간): 등급마다 대기 · 쓴 뒤 빈틈 (open 초 · 막기 어려움 offBal 초) · min = 이만큼 넘게 밀려날 때만 버팀 · weak = 밀치기가 이만큼도 안 먹히면 밀어붙임 · counter · cStun = 무너지려던 막기를 튕겨낼 때 */\n  grab: { p: 0.05, cap: 0.15, cd: 2.5,")
# 늘 쓰는 몫 = 근력
rep("Math.round(T.atk * C.atk * (p.am || 1) * gradeMul(rules, p.traits, '괴력') * (RO.atk || 1))),   // am = 인물 공격 배율, [괴력X], 역할",
    "Math.round(T.atk * C.atk * (p.am || 1) * gradeMul(rules, p.traits, '근력') * (RO.atk || 1))),   // am = 인물 공격 배율, [근력X] (v7.24.2 — 예전 [괴력X]), 역할")
rep("strMul: gradeMul(rules, p.traits, '괴력'),   // 날붙이 판정 · 괴력 (막힐 때 상대 자세를 더 깎음)",
    "strMul: gradeMul(rules, p.traits, '근력'), might: gradeMul(rules, p.traits, '괴력'), mightG: ((p.traits || []).map(x => /^괴력([SABC])$/.exec(x)).find(Boolean) || [])[1] || null, mightCd: -9,   // 날붙이 판정 · 근력 (막힐 때 상대 자세를 더 깎음) · v7.24.2 괴력 (순간)")
rep("(p.traits || []).some(x => /^괴력/.test(x)))) return '근력이 모자람 (' + wp.req + ' 이상 · 괴력)';", "(p.traits || []).some(x => /^근력/.test(x)))) return '근력이 모자람 (' + wp.req + ' 이상 · 근력)';")
rep("if (wp.req && !sizeOK(u, wp.req, (u.traits || []).some(x => /^괴력/.test(x))", "if (wp.req && !sizeOK(u, wp.req, (u.traits || []).some(x => /^근력/.test(x))")
# 괴력 도우미
rep("// 밀침: 처음부터 벽에 붙어 있으면", """/* v7.24.2 괴력: 결정적인 순간에만 힘을 집중 — 쓸 수 있나 · 씀 (대기 · 빈틈 · 로그) */
const MIGHT = W => W.rules.might || {};
const mightReady = (W, u) => !!u && u.alive && (u.might || 1) > 1 && W.t >= (u.mightCd || -9) && !u.kb && W.t >= (u.stunT || -9) && !prone(W, u) && !u.crawl;
function mightUse(W, u, how, b){ const M = MIGHT(W); u.mightCd = W.t + ((M.cd || {})[u.mightG] || 6); u.openT = Math.max(u.openT == null ? -9 : u.openT, W.t + (M.open || 0.4)); u.offBal = Math.max(u.offBal || -9, W.t + (M.offBal || 0.35)); u.mightN = (u.mightN || 0) + 1;
  L(W, { k: 'might', a: u.i, b: b ? b.i : null, how, m: u.might, vis: u.side === 0 || !!u.seenBy || !!(b && (b.side === 0 || b.seenBy)) }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '괴력!', c: 'v', t0: W.t }); return u.might; }
// 밀침: 처음부터 벽에 붙어 있으면""")
# 밀침: 버팀 (받는 쪽) · 밀어붙임 (미는 쪽 — 밀치기)
rep("""  const len = kbLen(W, a, t, power) * (t.crawl ? 0.5 : 1);
  if (wallBehind(W, t, dx, dy, t.r + 0.3)){ crushWall(W, a, t, S.wall || 1.2, o, true); return 'pinned'; }""",
    """  let len = kbLen(W, a, t, power) * (t.crawl ? 0.5 : 1);
  { const M = MIGHT(W);   /* v7.24.2 괴력: 크게 밀리려는 순간 버팀 (받는 쪽) · 밀치기가 안 먹히는 순간 밀어붙임 (미는 쪽) */
    if (a && t.side !== a.side && len >= (M.min || 0.5) && mightReady(W, t)) len /= mightUse(W, t, 'resist', a);
    else if (a && o && (o.how === 'bash' || o.how === 'body') && t.side !== a.side && len < (M.weak || 0.35) && mightReady(W, a)) len *= mightUse(W, a, 'push', t); }
  if (wallBehind(W, t, dx, dy, t.r + 0.3)){ crushWall(W, a, t, S.wall || 1.2, o, true); return 'pinned'; }""")
# 넘어지려 할 때 버팀
rep("  if (K.left <= 0.01){ u.kb = null; if (W.rand() < downOdds(W, u, K)) knockDown(W, u, S.prone || 0.9, K.by, '나가떨어짐'); }",
    "  if (K.left <= 0.01){ u.kb = null; if (W.rand() < downOdds(W, u, K)){ if (a && a.side !== u.side && W.t >= (u.mightCd || -9) && (u.might || 1) > 1 && u.alive){ u.kb = null; mightUse(W, u, 'stand', a); } else knockDown(W, u, S.prone || 0.9, K.by, '나가떨어짐'); } }   /* v7.24.2 괴력: 넘어지지 않고 버팀 */")
# 잡힌 무기를 뿌리침
rep("  const p = Math.min(G.cap || 0.15, (G.p || 0.05) * (t.ev || 1) * (t.vet ? G.vet || 1.3 : 1)); if (W.rand() >= p) return false;",
    "  const p = Math.min(G.cap || 0.15, (G.p || 0.05) * (t.ev || 1) * (t.vet ? G.vet || 1.3 : 1)); if (W.rand() >= p) return false;\n  if (mightReady(W, a) && (a.might || 1) * (a.strMul || 1) * Math.pow((a.mass || 62) / Math.max(20, t.mass || 62), 0.15) >= (t.strMul || 1)){ mightUse(W, a, 'grip', t); return false; }   /* v7.24.2 괴력: 잡힌 무기를 순간 뿌리침 (몸무게 · 근력 차이는 그대로 — 거구에겐 안 됨) */")
# 무너지려던 막기를 튕겨냄
rep("    t.post -= fatMul(W, t, 'post') * (t.injPost || 1) * R.postCost", "    const post0 = t.post; t.post -= fatMul(W, t, 'post') * (t.injPost || 1) * R.postCost")
rep("    if (t.post <= 0){ t.post = 0; t.brokenT = W.t + R.breakTime; o.broke = true; }",
    """    if (t.post <= 0 && !o.far && !J && u.side !== t.side && mightReady(W, t)){ const M = MIGHT(W), cost = post0 - t.post; t.post = Math.max(1, post0 - cost / mightUse(W, t, 'parry', u)); o.mightParry = true;   /* v7.24.2 괴력: 무너지려던 막기를 튕겨냄 — 상대를 밀고 잠깐 휘청 */
      if (u.alive && !u.kb){ shove(W, t, u, (M.counter || 0.5) * (t.strMul || 1), u.x - t.x, u.y - t.y, { tag: '괴력으로 튕겨냄' }); stun(W, u, M.cStun || 0.3, t.i); } }
    if (t.post <= 0){ t.post = 0; t.brokenT = W.t + R.breakTime; o.broke = true; }""")
# 돌격 충돌: 들이받히는 순간 버팀 · 되튕기려는 순간 밀어붙임 · 태세가 무너지려 할 때 버팀
rep("    const br = hc ? { mass: hit.mass, trained: false, mates: false } : braceOf(W, hit, u, nx, ny), mA = u.mass, mB = br.mass, e = C.e != null ? C.e : 0.3;",
    """    const br = hc ? { mass: hit.mass, trained: false, mates: false } : braceOf(W, hit, u, nx, ny), e = C.e != null ? C.e : 0.3; let mA = u.mass, mB = br.mass;
    { const M = MIGHT(W), KB0 = C.kb != null ? C.kb : 0.3;   /* v7.24.2 괴력: 들이받히는 순간 버팀 (받는 쪽) · 되튕기려는 순간 밀어붙임 (돌격한 쪽) */
      if (hit.side !== u.side && (vB + (1 + e) * mA / (mA + mB) * vr) * KB0 >= (M.min || 0.5) && mightReady(W, hit)) mB *= mightUse(W, hit, hc ? 'ram' : 'brace', u);
      else if (hit.side !== u.side && vA - (1 + e) * mB / (mA + mB) * vr < -0.2 && mightReady(W, u)) mA *= mightUse(W, u, 'ram', hit); }""")
rep("    if (!hc && setFor(W, hit, u)){ const cost = setCost(W, u, hit, k, br.mass / (br.trained ? C.trained || 1.6 : 1));   // 훈련 버팀 배율은 태세에 이미 들어 있음",
    "    if (!hc && setFor(W, hit, u)){ let cost = setCost(W, u, hit, k, br.mass / (br.trained ? C.trained || 1.6 : 1));   // 훈련 버팀 배율은 태세에 이미 들어 있음\n      if (hit.post <= cost && hit.post > cost / ((hit.might || 1) * 1.05) && hit.side !== u.side && mightReady(W, hit)) cost /= mightUse(W, hit, 'brace', u);   /* v7.24.2 괴력: 무너지려던 태세를 버팀 */")
rep("module.exports = { flailOf,", "module.exports = { mightReady, mightUse, flailOf,")
for k, v in FS.items():
    open(D + k + '.js', 'w', encoding='utf-8').write(v)
print('ok')
