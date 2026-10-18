# v7.24.4 엔진 — patch7244.py v1.2 (v1.2: 후리기는 철퇴의 기본 밀침 대신 제 밀침 · 시작 각을 로그에 · v1.1: 한 바퀴의 진행은 휘두른 시간만 셈 (휘청 · 넘어짐 동안은 멈춤) · 모닝스타 철퇴 다시: ① 던지기 = 관성 물리 — 공이 속도를 갖고 날아가다 공기 저항으로 줄고 · 사슬이 팽팽해지면 되튕겨 · 맞거나 바위면 튕김 · 끌어당기면 손 쪽으로 가속하며 돌아옴 (넘쳐 흔들림) /
#   ② 철퇴 후리기 = 머리 위로 시계방향 빙빙 (모음 0.8초) → 사슬을 정한 거리 (1.2 ~ 2.6M) 만큼 풀어 한 바퀴를 아주 세게 (0.45초) — 지나는 순서대로 둘레의 모두 (동료도) · 못 막고 크게 밀림 (대형은 × 0.4) ·
#   방패 (65%) · 무구 (35%) 로 막는 데 성공하면 그 자리에서 튕기고 멈춤 · 피할 수도 있음 / 명령은 거리를 정해 (R) · 스스로 쓸 땐 둘레의 적을 덮는 거리)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
FS = {k: open(D + k + '_v7243.js', encoding='utf-8').read() for k in ('rt3_head', 'rt3_mid', 'rt3_tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in FS.values())
    assert n == c, (n, c, a[:100])
    for k in FS:
        FS[k] = FS[k].replace(a, b)
def cut(a, b):   # a 부터 b 앞까지를 돌려줌 (tail 에서)
    s = FS['rt3_tail']; i = s.index(a); j = s.index(b, i); return s[i:j]

rep("sweep: { r: 1.9, wind: 0.6, rec: 0.6, cd: 8, mul: 1.5, kb: 0.8, stop: 0.5 }",
    "sweep: { r: 1.9, rMin: 1.2, rMax: 2.6, wind: 0.8, ws: 13, spin: 0.45, rec: 0.6, cd: 8, mul: 1.6, kb: 1.6, w: 0.3, blk: { shield: 0.65, weapon: 0.35 }, big: 0.4 }")
rep("flail:{sw:1.3, close:0.9, swingP:0.25, v:13, back:11, ball:0.2, rec:0.15}}",
    "flail:{sw:1.3, close:0.9, swingP:0.25, v:14, back:11, ball:0.2, rec:0.15, drag:1.2, pull:70, damp:3, e:0.35, minV:3}}")
# ① 던지기: 관성 물리
old = cut("// v7.24.1 철퇴 던지기:", "// 회전 투척이 날아감:")
new = """// v7.24.1 철퇴 던지기 · v7.24.4 관성 물리: 공은 속도 (vx · vy) 를 가짐 — 날아가며 공기 저항 (drag) 으로 줄고, 사슬 (L) 이 팽팽해지면 바깥쪽 속도가 되튕겨 (e) 끌어당김이 시작됨.
// 처음 닿는 적 몸 (투사체처럼: 피할 수 있음 · 방패로 막힘 · 동료는 비껴감) 이나 바위에 부딪히면 튕김. 끌어당김 = 손 쪽으로 pull M/초² · damp 로 잦아듦 (넘쳐 흔들림) — 손에 닿으면 다음 공격
function throwFlail(W, u, t){
  const FL = flailOf(W, u) || {}, lead = 0.12, tx = t.x + (t.vx || 0) * lead, ty = t.y + (t.vy || 0) * lead, d = Math.hypot(tx - u.x, ty - u.y) || 1, dx = (tx - u.x) / d, dy = (ty - u.y) / d, v = FL.v || 14, sw = 1.2;   // 머리 위로 돌리던 기세 (시계방향) 가 살짝 실림
  (W.flails || (W.flails = [])).push({ by: u.i, side: u.side, b: t.i, x: u.x + dx * u.r * 0.6, y: u.y + dy * u.r * 0.6, vx: dx * v - dy * sw, vy: dy * v + dx * sw, L: u.r + u.rng + (FL.ball || 0.2), br: FL.ball || 0.2, ph: 'out', hit: null, ev: [], t0: W.t });
  u.fg = u.face = Math.atan2(dy, dx); L(W, { k: 'flail', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy });
}
function stepFlails(W, dt){
  for (const F of W.flails){ const u = W.units[F.by]; if (!u || !u.alive){ F.done = true; continue; } const FL = flailOf(W, u) || {}, N = 3, ds = dt / N;
    for (let q = 0; q < N && !F.done; q++){
      if (F.ph === 'out'){ const x0 = F.x, y0 = F.y, k = Math.max(0, 1 - (FL.drag || 1.2) * ds); F.x += F.vx * ds; F.y += F.vy * ds; F.vx *= k; F.vy *= k;
        if (rock(W.map, F.x, F.y)){ F.x = x0; F.y = y0; F.vx *= -0.3; F.vy *= -0.3; F.ph = 'back'; F.wall = true; continue; }
        let best = null, bt = 9;   // 길에 처음 닿는 적 몸 (선분 x0 → x)
        if (Math.hypot(F.vx, F.vy) > (FL.minV || 3)) for (const e of W.units){ if (!e.alive || e === u || e.side === F.side || e.lie || F.ev.includes(e.i) || (e.act && e.act.k === 'leap')) continue;
          const sx = F.x - x0, sy = F.y - y0, ll = sx * sx + sy * sy || 1e-9, kk = Math.max(0, Math.min(1, ((e.x - x0) * sx + (e.y - y0) * sy) / ll)), px = x0 + sx * kk - e.x, py = y0 + sy * kk - e.y;
          if (px * px + py * py <= (e.r + F.br) * (e.r + F.br) && kk < bt){ bt = kk; best = e; } }
        if (best){ const p = evadeP(W, best, u, 'shot', { sp: Math.hypot(F.vx, F.vy) });
          if (p && W.rand() < p){ F.ev.push(best.i); evaded(W, best, u, 'shot', '날아오는 철퇴를 피함', p); }
          else { strike(W, u, best, best, 1, false, { tag: '철퇴 던지기', wk: '둔기' }); F.hit = best.i; F.ph = 'back';   // 몸에 맞고 튕김
            const nx = F.x - best.x, ny = F.y - best.y, nl = Math.hypot(nx, ny) || 1, vn = (F.vx * nx + F.vy * ny) / nl; if (vn < 0){ F.vx -= 1.35 * vn * nx / nl; F.vy -= 1.35 * vn * ny / nl; } F.vx *= 0.5; F.vy *= 0.5; continue; } }
        const rx = F.x - u.x, ry = F.y - u.y, rd = Math.hypot(rx, ry) || 1;
        if (rd > F.L){ F.x = u.x + rx / rd * F.L; F.y = u.y + ry / rd * F.L; const vr = (F.vx * rx + F.vy * ry) / rd; if (vr > 0){ F.vx -= (1 + (FL.e || 0.35)) * vr * rx / rd; F.vy -= (1 + (FL.e || 0.35)) * vr * ry / rd; } F.ph = 'back'; }   // 사슬이 팽팽 → 되튕김
        else if (Math.hypot(F.vx, F.vy) < (FL.minV || 3) * 0.5) F.ph = 'back';
        continue; }
      const hx = u.x, hy = u.y, d = Math.hypot(hx - F.x, hy - F.y) || 1e-6, kd = Math.max(0, 1 - (FL.damp || 3) * ds);   // 끌어당김: 손 쪽으로 가속 · 잦아듦
      F.vx = (F.vx + (hx - F.x) / d * (FL.pull || 70) * ds) * kd; F.vy = (F.vy + (hy - F.y) / d * (FL.pull || 70) * ds) * kd; F.x += F.vx * ds; F.y += F.vy * ds; F.L = Math.max(u.r, Math.min(F.L, d + 0.05));
      const d2 = Math.hypot(hx - F.x, hy - F.y); if (d2 > F.L){ F.x = hx + (F.x - hx) / d2 * F.L; F.y = hy + (F.y - hy) / d2 * F.L; }
      if (d2 <= u.r * 0.75 || W.t - F.t0 > 3){ F.done = true; if (u.act && u.act.k === 'atk' && u.act.fl && u.act.phase === 'rec') u.act.end = Math.min(u.act.end, W.t + (FL.rec || 0.15)); } } }
  W.flails = W.flails.filter(F => !F.done);
}
"""
rep(old, new)
# ② 철퇴 후리기
old2 = cut("  if (k === 'sweep'){   // 철퇴 후리기", "  if (k === 'ward'){")
new2 = """  if (k === 'sweep'){   // v7.24.4 철퇴 후리기: 모음이 끝나면 사슬을 R 만큼 풀어 한 바퀴 (stepSweep) — 머리 위로 돌던 각에서 이어 시계방향으로
    const R = Math.max(S.rMin || 1.2, Math.min(S.rMax || 2.6, A.R || S.r || 1.9)); A.R = R; A.phase = 'swing'; A.t1 = W.t; A.ang0 = A.angP = A.ang = (A.a0 != null ? A.a0 : (u.face || 0) + Math.PI) + (W.t - A.t0) * (S.ws || 13); A.hit = []; A.n = 0; A.end = W.t + (S.spin || 0.45) + 0.3;
    L(W, { k: 'flailSpin', a: u.i, R: +R.toFixed(2), a0: +A.ang0.toFixed(3), vis: u.side === 0 || !!u.seenBy }); return;
  }
"""
rep(old2, new2)
rep("// 스스로 쓰기 (적 · 아군 같은 판단 — 그 상황일 때만)\nfunction specAuto(W, u, t, see){", """// v7.24.4 철퇴 후리기의 한 바퀴: spin 초에 2π (시계방향) — 이번 틱에 공 (R) 과 사슬이 지난 각 안의 몸을 차례로. 막기 (방패 · 무구 확률) 에 성공하면 그 자리에서 튕기고 멈춤
function stepSweep(W, u, dt){
  const A = u.act, S = SPR(W, 'sweep'), R = A.R, el = (A.el = (A.el || 0) + dt), k1 = Math.min(1, el / (S.spin || 0.45)), a1 = A.ang0 + k1 * 2 * Math.PI, rp = A.angP - A.ang0, rn = a1 - A.ang0; A.angP = A.ang = a1;
  const L0 = W.units.filter(e => e.alive && e !== u && !A.hit.includes(e.i) && dist(u, e) - e.r <= R + (S.w || 0.3)).map(e => { let r = Math.atan2(e.y - u.y, e.x - u.x) - A.ang0; r = ((r % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); return { e, r }; }).filter(o => o.r > rp - 1e-9 && o.r <= rn).sort((p, q) => p.r - q.r);
  for (const { e, r } of L0){ A.hit.push(e.i); const a = A.ang0 + r, B = S.blk || {}, gs = e.side !== u.side && inGuard(W, e, u) ? (e.shield || e.armShield ? B.shield || 0.65 : e.parry ? B.weapon || 0.35 : 0) : 0;
    if (gs && W.rand() < gs){ strike(W, u, e, e, 1, false, { mul: S.mul || 1.6, tag: '철퇴 후리기', wk: '둔기' }); A.stop = e.i; A.ang = A.angP = a; A.phase = 'rec'; A.end = W.t + (S.rec || 0.6);   // 막힘 → 그 자리에서 튕기고 멈춤
      L(W, { k: 'flailSweep', a: u.i, n: A.n, stop: e.i, R: +R.toFixed(2), vis: u.side === 0 || !!u.seenBy || e.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y, s: '튕김!', c: 'g', t0: W.t }); return; }
    if (e.side !== u.side && evadeMelee(W, e, u)) continue;
    const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.6, tag: '철퇴 후리기', wk: '둔기', grab: true }); A.n++;
    if (o && e.alive && e.kb && e.kb.by === u.i) e.kb = null;   /* 무기의 기본 밀침 대신 후리기의 큰 밀침 */
    if (o && e.alive && !e.kb){ const big = (SIZE_RANK[sizeOf(e)] || 0) >= (SIZE_RANK['대형'] || 3) ? (S.big || 0.4) : 1, d = dist(u, e) || 1, ox = (e.x - u.x) / d, oy = (e.y - u.y) / d, tx = -Math.sin(a), ty = Math.cos(a);   // 바깥 + 도는 쪽으로 쓸려 나감
      shove(W, u, e, (S.kb || 1.6) * (u.strMul || 1) * big, ox * 0.75 + tx * 0.55, oy * 0.75 + ty * 0.55, { tag: '철퇴에 쓸려 나감' }); } }
  if (k1 >= 1){ A.phase = 'rec'; A.end = W.t + (S.rec || 0.6); L(W, { k: 'flailSweep', a: u.i, n: A.n, stop: null, R: +R.toFixed(2), vis: u.side === 0 || !!u.seenBy }); }
}
// 스스로 쓰기 (적 · 아군 같은 판단 — 그 상황일 때만)
function specAuto(W, u, t, see){""")
rep("  if (specReady(W, u, 'sweep')){ const r = SPR(W, 'sweep').r || 1.9, fe = near(r, false), al = near(r, true); if ((fe >= 2 && al === 0) || (fe >= 3 && al <= 1)) return startSpec(W, u, null, 'sweep', '둘러싼 적을 쓸어 버림'); }",
    "  if (specReady(W, u, 'sweep')){ const S3 = SPR(W, 'sweep'), fs = W.units.filter(e => e.alive && e.side !== u.side && dist(u, e) - e.r <= (S3.rMax || 2.6)).map(e => dist(u, e));   /* v7.24.4 둘레의 적을 덮는 거리 */\n    if (fs.length >= 2){ const r = Math.max(S3.rMin || 1.2, Math.min(S3.rMax || 2.6, Math.max(...fs) - 0.1)), fe = near(r, false), al = near(r, true); if ((fe >= 2 && al === 0) || (fe >= 3 && al <= 1)){ startSpec(W, u, null, 'sweep', '둘러싼 적을 쓸어 버림'); u.act.R = r; return true; } } }")
rep("    if (o.s === 'sweep' || o.s === 'ward'){ if (specReady(W, u, o.s)){ startSpec(W, u, null, o.s, '명령'); u.order = null; }",
    "    if (o.s === 'sweep' || o.s === 'ward'){ if (specReady(W, u, o.s)){ startSpec(W, u, null, o.s, '명령'); if (o.R) u.act.R = o.R; u.order = null; }   /* v7.24.4 정한 거리 */")
rep("  u.act = { k: 'spec', s: k, b: t ? t.i : null, phase: 'wind', t0: W.t, end: W.t + wind, why: why || x.name }; x.cdT = W.t + (S.cd || 5); stop(u); u.waitT = 0;",
    "  u.act = { k: 'spec', s: k, b: t ? t.i : null, phase: 'wind', t0: W.t, end: W.t + wind, why: why || x.name, ...(k === 'sweep' || k === 'hurl' ? { a0: (u.face || 0) + Math.PI } : {}) }; x.cdT = W.t + (S.cd || 5); stop(u); u.waitT = 0;   /* v7.24.4 머리 위로 돌리기 시작 각 */")
rep("  if (u.act && (u.act.k === 'leap' || u.act.k === 'dodge')){ stepLeap(W, u, dt); return; }",
    "  if (u.act && u.act.k === 'spec' && u.act.s === 'sweep' && u.act.phase === 'swing'){ stepSweep(W, u, dt); return; }   /* v7.24.4 철퇴 후리기 한 바퀴 */\n  if (u.act && (u.act.k === 'leap' || u.act.k === 'dodge')){ stepLeap(W, u, dt); return; }")
rep("module.exports = { supSlot,", "module.exports = { stepSweep, supSlot,")
for k, v in FS.items():
    open(D + k + '.js', 'w', encoding='utf-8').write(v)
print('ok')
