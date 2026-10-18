# v7.25.0 엔진 — patch7250.py v1.3 (v1.3: 세자르 회피 뒤 쉬는 틈 × 0.35 · v1.2: 세자르는 총구를 읽음 — 탄 반응 시간 검사 건너뜀 · v1.1: 갑피 등급 조정은 뺌 — 세자르 몸 갑피는 이미 샷건을 거의 박히게 함 · 모닝스타: 돌리다 넘어지면 (휘청이면) 기술 끝 · 공은 그 자리에 떨어짐 → 일어나면 걸으며 감아 들임 · 던진 뒤 얼음 풀림 (짧은 후속 동작만) · 공이 나가 있으면 후리기 · 휘둘러 치기 못 씀 /
#   세자르: 총알을 거의 다 피함 (cz.bulletEv) · 영거리 사격도 회피 굴림 · [보스] 는 치명상 (뇌 · 심장 · 으깸 · 쪼갬) 으로 즉사하지 않음 — 큰 피해)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def load(n): return open(D + 'rt3_%s_v7245.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)

# 규칙
H = rep(H, "flail:{sw:1.3, close:0.9, swingP:0.25, v:14, back:11, ball:0.2, rec:0.15, drag:1.2, pull:70, damp:3, e:0.35, minV:3}}",
           "flail:{sw:1.3, close:0.9, swingP:0.25, v:14, back:11, ball:0.2, rec:0.15, drag:1.2, pull:70, damp:3, e:0.35, minV:3, trec:0.3, reel:30}}")
H = rep(H, "  cz: { probe: [4.5, 7],", "  cz: { bulletEv: 0.7, probe: [4.5, 7],")
H = rep(H, "  vital: { boss: 400, head: 0.4,", "  vital: { bossFatal: 0.15, boss: 400, head: 0.4,")


# 던진 뒤 얼음 풀림
T = rep(T, "    if (A.k === 'atk' && A.fl && t.alive && flailOf(W, u)){ throwFlail(W, u, t); A.phase = 'rec'; A.end = W.t + 3; A.t1 = W.t; return; }   /* v7.24.1 철퇴를 던짐 — 공이 돌아오면 끝 */",
           "    if (A.k === 'atk' && A.fl && t.alive && flailOf(W, u)){ throwFlail(W, u, t); A.phase = 'rec'; A.end = W.t + ((flailOf(W, u) || {}).trec || 0.3); A.t1 = W.t; return; }   /* v7.24.1 철퇴를 던짐 · v7.25.0 짧은 후속 동작 뒤엔 움직임 (공은 걸으며 감아 들임 — 돌아오기 전엔 다시 못 던짐) */")

# 넘어짐 · 휘청 → 공이 떨어짐
T = rep(T, "  u.proneT = W.t + s; interrupt(W, u, '넘어져 준비가 끊김'); stop(u);",
           "  u.proneT = W.t + s; flailDrop(W, u, '넘어짐'); interrupt(W, u, '넘어져 준비가 끊김'); stop(u);   /* v7.25.0 */")
T = rep(T, "  u.stunT = Math.max(u.stunT || -9, W.t + sec); interrupt(W, u, '휘청여 준비가 끊김'); stop(u);",
           "  u.stunT = Math.max(u.stunT || -9, W.t + sec); if (!(u.act && u.act.k === 'spec' && u.act.s === 'sweep' && u.act.phase === 'swing')) flailDrop(W, u, '휘청'); interrupt(W, u, '휘청여 준비가 끊김'); stop(u);   /* v7.25.0 한 바퀴 도는 중엔 기세로 끝까지 */")

T = rep(T, "function stepFlails(W, dt){\n",
"""/* v7.25.0 철퇴를 돌리다 넘어지거나 (모으다) 휘청이면: 기술은 거기서 끝 (대기는 그대로 — 일어나도 이어 돌리지 않음) · 공은 그 자리에 떨어짐 (ph drop).
   나가 있던 공도 떨어짐. 일어나면 걸으며 감아 들임 (reel — 느린 당김 · 그동안 다시 던지거나 후리지 못함) */
function flailDrop(W, u, why){
  const FL = flailOf(W, u), a = u.act; if (!FL) return;
  const sp = !!(a && a.k === 'spec' && (a.s === 'sweep' || a.s === 'hurl')), ov = !!(a && a.k === 'atk' && a.fl && a.phase === 'wind');
  if (sp || ov){ const S = SPR(W, 'sweep'), sw = sp && a.phase === 'swing', ang = sw ? a.ang : (a.a0 != null ? a.a0 : (u.face || 0) + Math.PI) + (W.t - a.t0) * (S.ws || 13), R = sw ? a.R : u.r + 0.45;
    let x = u.x + Math.cos(ang) * R, y = u.y + Math.sin(ang) * R; if (rock(W.map, x, y)){ x = u.x + Math.cos(ang) * u.r; y = u.y + Math.sin(ang) * u.r; }
    const v = sw ? 2 * Math.PI * R / (S.spin || 0.45) * 0.25 : 3;
    (W.flails || (W.flails = [])).push({ by: u.i, side: u.side, b: null, x, y, vx: -Math.sin(ang) * v, vy: Math.cos(ang) * v, L: Math.max(R, u.r + 0.3), br: FL.ball || 0.2, ph: 'drop', hit: null, ev: [], t0: W.t, drop: true });
    u.act = null; L(W, { k: 'flailDrop', a: u.i, s: sp ? a.s : 'atk', why, vis: u.side === 0 || !!u.seenBy }); }
  for (const F of W.flails || []) if (F.by === u.i && F.ph !== 'drop'){ F.ph = 'drop'; F.vx *= 0.4; F.vy *= 0.4; }
}
const flailOut = (W, u) => (W.flails || []).some(F => F.by === u.i);
function stepFlails(W, dt){
""")
T = rep(T, "  for (const F of W.flails){ const u = W.units[F.by]; if (!u || !u.alive){ F.done = true; continue; } const FL = flailOf(W, u) || {}, N = 3, ds = dt / N;\n",
"""  for (const F of W.flails){ const u = W.units[F.by]; if (!u || !u.alive){ F.done = true; continue; } const FL = flailOf(W, u) || {}, N = 3, ds = dt / N;
    const down = !!(u.kb || W.t < (u.proneT || -9) || W.t < (u.stunT || -9) || u.down);   /* v7.25.0 주인이 넘어지면 공이 떨어짐 → 일어나면 감아 들임 */
    if (down && F.ph !== 'drop'){ F.ph = 'drop'; F.vx *= 0.4; F.vy *= 0.4; }
    if (F.ph === 'drop'){ const kk = Math.max(0, 1 - 7 * dt), nx = F.x + F.vx * dt, ny = F.y + F.vy * dt; F.vx *= kk; F.vy *= kk; if (!rock(W.map, nx, ny)){ F.x = nx; F.y = ny; } else { F.vx = 0; F.vy = 0; }
      const dd = Math.hypot(F.x - u.x, F.y - u.y); if (dd > F.L){ F.x = u.x + (F.x - u.x) / dd * F.L; F.y = u.y + (F.y - u.y) / dd * F.L; }   // 사슬 끝 — 바닥에 끌려옴
      F.t0 = W.t; if (!down){ F.ph = 'back'; F.reel = true; L(W, { k: 'flailReel', a: u.i, vis: u.side === 0 || !!u.seenBy }); } continue; }
""")
T = rep(T, "      F.vx = (F.vx + (hx - F.x) / d * (FL.pull || 70) * ds) * kd; F.vy = (F.vy + (hy - F.y) / d * (FL.pull || 70) * ds) * kd;",
           "      const pl = F.reel ? (FL.reel || 30) : (FL.pull || 70); F.vx = (F.vx + (hx - F.x) / d * pl * ds) * kd; F.vy = (F.vy + (hy - F.y) / d * pl * ds) * kd;")
T = rep(T, "      if (d2 <= u.r * 0.75 || W.t - F.t0 > 3){ F.done = true;",
           "      if (d2 <= u.r * 0.75 || W.t - F.t0 > (F.reel ? 4 : 3)){ F.done = true;")
# 공이 나가 있으면 후리기 · 휘둘러 치기 못 씀
T = rep(T, "if ((k === 'sweep' || k === 'hurl' || k === 'spin') && u.weaponGone) return false;",
           "if ((k === 'sweep' || k === 'hurl' || k === 'spin') && u.weaponGone) return false; if ((k === 'sweep' || k === 'hurl') && flailOut(W, u)) return false;   /* v7.25.0 공을 거둬야 */")

# 영거리 사격도 피할 수 있음 (세자르의 스텝 · 회피)
T = rep(T, "    u.shells = Math.max(0, (u.shells || 0) - 1); { const a0 = u.ammo, m0 = u.mag, l0 = u.loud; u.loud = true; fire(W, u); u.ammo = a0; u.mag = m0; u.loud = l0; }\n",
           "    u.shells = Math.max(0, (u.shells || 0) - 1); { const a0 = u.ammo, m0 = u.mag, l0 = u.loud; u.loud = true; fire(W, u); u.ammo = a0; u.mag = m0; u.loud = l0; }\n"
           "    { const p = t.side !== u.side ? evadeP(W, t, u, 'shot', { sp: 60 }) : 0; if (p && W.rand() < p){ evaded(W, t, u, 'shot', '영거리 샷건을 비켜 섬', p); L(W, { k: 'pb', a: u.i, b: t.i, left: u.shells, miss: true, vis: true }); return; } }   /* v7.25.0 총구를 보고 비킴 (세자르 · 회피 높은 몸) */\n")
# 세자르: 총알을 거의 다 피함
T = rep(T, "  if (u.act && u.act.k === 'cz' && u.act.s === 'step') p = Math.max(p, ((W.rules.cz || {}).step || {}).ev || 0.6);   /* v7.24 스텝 중 */",
           "  if (u.act && u.act.k === 'cz' && u.act.s === 'step') p = Math.max(p, ((W.rules.cz || {}).step || {}).ev || 0.6);   /* v7.24 스텝 중 */\n"
           "  if (u.cz && (kind === 'shot' || kind === 'arc')) p = Math.max(p, ((W.rules.cz || {}).bulletEv || 0) * sense);   /* v7.25.0 세자르: 총알 · 화살을 거의 다 쉭쉭 피함 */")
# 세자르는 총구를 읽음 — 탄이 날아오는 시간 (반응 시간) 과 상관없이 비킴
T = rep(T, "    if (tau < react) return false; }", "    if (tau < react && !b.cz) return false; }   /* v7.25.0 세자르는 총구를 읽고 미리 비킴 */")
T = rep(T, "  t.evadeCd = W.t + (E.cd || 1.4) / Math.max(1, t.ev || 1);", "  t.evadeCd = W.t + (E.cd || 1.4) / Math.max(1, t.ev || 1) * (t.cz ? ((W.rules.cz || {}).evCd || 0.35) : 1);   /* v7.25.0 세자르는 연달아 비킴 */")
H = rep(H, "  cz: { bulletEv: 0.7,", "  cz: { bulletEv: 0.7, evCd: 0.35,")
# [보스] 는 치명상으로 즉사하지 않음
T = rep(T, "function woundFatal(W, a, t, kind, o){\n  if (AI6.includes('wfat')) return;   // 시험용\n",
           "function woundFatal(W, a, t, kind, o){\n  if (AI6.includes('wfat')) return;   // 시험용\n"
           "  if ((t.traits || []).includes('보스') && t.alive){ const dmg = Math.max(1, Math.round(bossRef(W, t) * ((W.rules.vital || {}).bossFatal || 0.15)));   /* v7.25.0 [보스]: 치명상이어도 즉사하지 않음 — 큰 피해 */\n"
           "    applyDmg(W, a, t, dmg, { ff: a.side === t.side, far: !!o.far, part: o.part || null, tag: WTXT[kind] + ' — 버팀 (큰 피해)' }); L(W, { k: 'bossFatal', a: a.i, b: t.i, how: kind, dmg, vis: t.side === 0 || !!t.seenBy });\n"
           "    if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.3, s: '버팀!', c: 'd', t0: W.t }); return; }\n")
T = rep(T, "if (typeof module !== 'undefined') module.exports = { stepSweep,", "if (typeof module !== 'undefined') module.exports = { flailDrop, flailOut, woundFatal, evadeP, stepSweep,")

for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch7250 OK')
