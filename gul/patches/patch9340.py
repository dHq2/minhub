# v9.14.0 엔진 — patch9340.py v1.0 (v1.0: ① 역장 = 방패병과 함께 움직이는 몸 — 방패병이 보는 쪽 앞에 붙어 따라 돎 (펼친 동안 방패병은 천천히 돎 × 0.25) · 방패병이 쓰러지면 꺼짐 · 따로 칠 수 있음 (명령 '역장 치기' · 길을 막힌 근접은 스스로 침) ② 방패 파동 (암계 방패병) — 제자리에서 방패 앞 (±70° · 몸 + 1.9칸) 을 밀어냄 · 피해는 작게 · 진형 붕괴 ③ 밀치기 돌진 · 암습 — 순간이동 없이 실제로 달려 닿음 (암습은 옆 · 뒤로 돌아 들어가는 자석 질주 · 끝까지 들키지 않았으면 즉사 확률) ④ 돌격 닿음 — 무기가 먼저 닿고 · 관성이 남으면 몸도 부딪힘 (멈추는 힘 무작위) · 무기를 피해도 길에 남으면 몸이 부딪힘)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9330.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
def cut(a, b):
    hits = [k for k in P if a in P[k]]; assert len(hits) == 1 and P[hits[0]].count(a) == 1, a[:80]
    v = P[hits[0]]; i = v.index(a); j = v.index(b, i); return v[i:j]
# ① 역장
rep("function sfAdd(W, F){ (W.sf8 || (W.sf8 = [])).push(F);", "function sfAdd(W, F){ if (F.id == null) F.id = (W.sfN = (W.sfN || 0) + 1); (W.sf8 || (W.sf8 = [])).push(F);")
rep("sfAdd(W, { k: 'wall', hard: true, by: u.i, side: u.side, x: u.x + c * d, y: u.y + s * d,", "sfAdd(W, { k: 'wall', hard: true, follow: true, ahead: d - u.r, by: u.i, side: u.side, x: u.x + c * d, y: u.y + s * d,")
rep("    L(W, { k: 'bfield', a: u.i, len: +len.toFixed(1), vis: true }); return; }", "    u.bfT = W.t + (S.t || 6); L(W, { k: 'bfield', a: u.i, len: +len.toFixed(1), vis: true }); return; }")
rep("  if (F.k === 'wall' && F.hard){ wallHold(W, F); return; }   /* v9.2.0 암계 역장: 못 넘음 */", """  if (F.k === 'wall' && F.hard){ if (F.follow){ const B = W.units[F.by];   /* v9.14.0 방패병과 함께 움직이는 몸 — 보는 쪽 앞에 붙어 따라 돎 */
      if (!B || !B.alive || B.down || B.crawl || B.gone){ F.until = W.t; L(W, { k: 'bfieldBreak', a: F.by, why: '방패병이 쓰러짐', vis: true }); return; }
      const a = B.face || 0, c = Math.cos(a), s = Math.sin(a), d = B.r + (F.ahead != null ? F.ahead : 0.9); F.x = B.x + c * d; F.y = B.y + s * d; F.ux = -s; F.uy = c; F.nx = c; F.ny = s; }
    wallHold(W, F); return; }   /* v9.2.0 암계 역장: 못 넘음 */""")
rep("const turnMul = (W, u) => u.cz ?", "const turnMul = (W, u) => u.bfT && W.t < u.bfT && (W.sf8 || []).some(f => f.by === u.i && f.hard && W.t < f.until) ? 0.25 : u.cz ?")
rep("  if (u.side === 0 && u.order){ doOrder(W, u, dt); return whyS(W, u, 'PLAYER_ORDER'); }", "  if (fieldAtk(W, u, dt)) return whyS(W, u, 'FIELD_ATK');   /* v9.14.0 역장 치기 (명령 · 길을 막힌 근접) */\n  if (u.side === 0 && u.order){ doOrder(W, u, dt); return whyS(W, u, 'PLAYER_ORDER'); }")
rep("  if (u.act && u.act.k === 'charge' && u.act.phase === 'run'){ stepCharge(W, u, dt); return; }", """  if (u.act && u.act.k === 'charge' && u.act.phase === 'run'){ stepCharge(W, u, dt); return; }
  if (u.act && u.act.k === 'fatk'){ stop(u); if (W.t >= u.act.end){ const A = u.act; if (A.phase === 'wind'){ const F = fieldOf(W, A.f); if (F){ const n = (u.atk || 10) * (u.atkMul || 1) * (W.rules.lethal || 1) * 0.8; wallHurt(W, F, n, '베기'); L(W, { k: 'fieldHit', a: u.i, b: F.by, n: Math.round(n), left: Math.max(0, Math.round(F.hp)), vis: u.side === 0 || F.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: F.x, y: F.y, s: '-' + Math.round(n), c: 'b', t0: W.t }); } u.act = { k: 'fatk', f: A.f, phase: 'rec', t0: W.t, end: W.t + (A.rec || 0.6) }; } else u.act = null; } return; }   /* v9.14.0 역장 치기 */
  if (u.act && u.act.k === 'spec' && (u.act.s === 'bshove' || u.act.s === 'hamb') && u.act.phase === 'go'){ supDash(W, u, dt); return; }   /* v9.14.0 밀치기 돌진 · 암습 — 실제로 달려 닿음 */""")
# ② 방패 파동 · ③ 질주
rep("'밀치기 돌진': 'bshove',", "'밀치기 돌진': 'bshove', '방패 파동': 'bwave',")
rep("'bfield', 'bshove', 'bmend',", "'bfield', 'bwave', 'bshove', 'bmend',")
rep("bshove: { len: 5, mul: 0.6, kb: 3.2, wind: 0.35, rec: 0.7, cd: 7 },", "bshove: { len: 5, mul: 0.6, kb: 3.2, wind: 0.35, rec: 0.7, cd: 7, v: 8.5, maxT: 1.0 }, bwave: { r: 1.9, arc: 140, mul: 0.35, kb: 2.2, stun: 0.3, post: 25, wind: 0.45, rec: 0.6, cd: 9 },")
rep("hamb: { dmin: 2.2, dmax: 9, mul: 2.1, crit: 0.5, wind: 0.3, rec: 0.5, cd: 9 },", "hamb: { dmin: 2.2, dmax: 9, mul: 2.1, crit: 0.5, wind: 0.3, rec: 0.5, cd: 9, v: 9.5, maxT: 1.6, kill: 0.35 },")
rep("  bshove(W, u, S){", """  // v9.14.0 방패 파동: 방패 앞 (±arc/2 · 몸 + r) 에 적이 둘 넘거나 · 하나가 붙어 동료를 노리면
  bwave(W, u, S){ const arc = (S.arc || 140) * Math.PI / 360, F = supFoes(W, u, (S.r || 1.9) + 1.2).filter(e => supKnown(W, u, e) && !e.down && dist(u, e) - e.r - u.r <= (S.r || 1.9) && angDiff(Math.atan2(e.y - u.y, e.x - u.x), u.face || 0) <= arc);
    if (F.length < 2 && !(F.length === 1 && gap(u, F[0]) < 0.6)) return false; return supStart(W, u, 'bwave', null, '방패 앞 적 ' + F.length); },
  bshove(W, u, S){""")
rep("  if (k === 'bshove'){ if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }", """  if (k === 'bwave'){ const arc = (S.arc || 140) * Math.PI / 360, fa = u.face || 0; let n = 0;   /* v9.14.0 방패 파동 — 제자리 · 방패 앞을 밀어냄 (피해는 작게 · 진형 붕괴) */
    for (const e of W.units){ if (!e.alive || e.gone || e.down || e.side === u.side || airOf(e) || dist(u, e) - e.r - u.r > (S.r || 1.9) || angDiff(Math.atan2(e.y - u.y, e.x - u.x), fa) > arc) continue; n++;
      const o = strike(W, u, e, e, 1, false, { mul: S.mul || 0.35, wk: '둔기', tag: '방패 파동' }); if (!e.alive) continue; interrupt(W, e, '파동에 밀려 준비가 끊김'); stun(W, e, S.stun || 0.3, u.i); e.post = Math.max(0, (e.post || 100) - (S.post || 25));
      const dx = e.x - u.x, dy = e.y - u.y, dl = Math.hypot(dx, dy) || 1, kv = (S.kb || 2.2) * Math.min(1.4, Math.max(0.35, (u.mass || 100) / Math.max(40, e.mass || 70))) * (o && o.block ? 0.7 : 1); shove(W, u, e, kv, dx / dl, dy / dl, { tag: '방패 파동에 밀려남', how: 'bash' }); }
    L(W, { k: 'bwave', a: u.i, n, vis }); if (W.fxOn) W.fx.push({ k: 'h2Boom', x: u.x + Math.cos(fa) * (u.r + 0.8), y: u.y + Math.sin(fa) * (u.r + 0.8), r: (S.r || 1.9) + 0.4, side: u.side, t0: W.t }); return; }
  if (k === 'bshove'){ if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    if (!A.go){ A.go = true; A.phase = 'go'; A.t1g = W.t; A.end = W.t + (S.maxT || 1.0); A.unseen = !aware(W, t, u); u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x); return; }   /* v9.14.0 순간이동 없이 실제로 달림 */""")
rep("    const ang = Math.atan2(t.y - u.y, t.x - u.x), len = Math.min(S.len || 5, Math.max(0, gap(u, t)) + 0.3), reach = h2Reach(W, u, u.x, u.y, ang, len); if (reach > 0.25) h2Ghost(W, u, u.x + Math.cos(ang) * reach, u.y + Math.sin(ang) * reach);\n", "")
hb = cut("    const fa = t.face != null ? t.face : Math.atan2(t.y - u.y, t.x - u.x); let moved = false;\n    for (const da of [Math.PI, Math.PI - 0.7, Math.PI + 0.7, Math.PI / 2, -Math.PI / 2]){", "    u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x); const big =")
rep(hb, "    if (!A.go){ A.go = true; A.phase = 'go'; A.t1g = W.t; A.end = W.t + (S.maxT || 1.6); A.unseen = t.target !== u && (!canSee(W, t, u) || sideV(W, t, u) === 'back'); return; }   /* v9.14.0 암습 — 순간이동 없이 옆 · 뒤로 돌아 들어가는 자석 질주 */\n    const moved = sideOf(W, t, u) !== 'front';\n")
rep("    L(W, { k: 'hamb', a: u.i, b: t.i, back: moved, big, vis });", """    if (t.alive && A.unseen && !big && t.target !== u && sideV(W, t, u) !== 'front' && W.rand() < (S.kill != null ? S.kill : 0.35)){ applyDmg(W, u, t, Math.ceil(t.hp) + 999, { ff: false, far: false, part: '몸통', tag: '암습 — 즉사' }); L(W, { k: 'hambKill', a: u.i, b: t.i, vis }); }   /* v9.14.0 끝까지 들키지 않았으면 즉사 확률 */
    L(W, { k: 'hamb', a: u.i, b: t.i, back: moved, big, unseen: !!A.unseen, vis });""")
rep("function hitCover(W, u, dt){", """// v9.14.0 밀치기 돌진 · 암습: 실제로 달려 닿음 (자석처럼 빠르게 붙음 — 출발 0.2초에 걸쳐 속력이 붙음). 암습은 상대 앞쪽이면 옆으로 돌아 (옆 2.0rad · 몸 + 0.9칸) 등 뒤로
function supDash(W, u, dt){ const A = u.act, S = SPR(W, A.s), t = A.b != null ? W.units[A.b] : null;
  const hit = () => { A.phase = 'wind'; supResolve(W, u, A, S, t); };
  if (!t || !t.alive || t.down || W.t >= A.end || u.kb || W.t < (u.stunT || -9) || W.t < (u.proneT || -9)){ if (t && t.alive && !t.down && gap(u, t) <= u.rng + 0.3) return hit(); u.act = { k: 'spec', s: A.s, b: A.b, phase: 'rec', t0: W.t, end: W.t + 0.3 }; L(W, { k: 'miss', a: u.i, b: A.b, why: !t || !t.alive || t.down ? '대상이 이미 쓰러짐' : '닿지 못함', spec: A.s }); return; }
  let wx = t.x, wy = t.y;
  if (A.s === 'hamb'){ const fa = t.face != null ? t.face : Math.atan2(u.y - t.y, u.x - t.x), au = Math.atan2(u.y - t.y, u.x - t.x), rel = Math.atan2(Math.sin(au - fa), Math.cos(au - fa)), sg = rel >= 0 ? 1 : -1, R0 = t.r + u.r + 0.08;
    if (Math.abs(rel) < 1.9){ const fl = fa + sg * 2.0, R1 = t.r + u.r + 0.9; wx = t.x + Math.cos(fl) * R1; wy = t.y + Math.sin(fl) * R1; if (Math.hypot(wx - u.x, wy - u.y) < 0.4){ wx = t.x + Math.cos(fa + Math.PI) * R0; wy = t.y + Math.sin(fa + Math.PI) * R0; } }
    else { wx = t.x + Math.cos(fa + Math.PI) * R0; wy = t.y + Math.sin(fa + Math.PI) * R0; } }
  const dx = wx - u.x, dy = wy - u.y, d = Math.hypot(dx, dy) || 1, sp = (S.v || 9) * Math.min(1, 0.45 + (W.t - (A.t1g || W.t)) * 2.75), st = Math.min(d, sp * dt);
  const x0 = u.x, y0 = u.y; tryMove(W, u, u.x + dx / d * st, u.y + dy / d * st); u.fg = u.face = A.s === 'hamb' ? Math.atan2(dy, dx) : Math.atan2(t.y - u.y, t.x - u.x);
  if (W.fxOn && (!A.gh || W.t - A.gh > 0.05)){ A.gh = W.t; W.fx.push({ k: 'ghost', a: u.i, x: x0, y: y0, t0: W.t }); }
  const g = gap(u, t); if (A.s === 'bshove' ? g <= 0.1 : (g <= u.rng + 0.05 && (sideOf(W, t, u) !== 'front' || W.t > A.end - 0.3))) hit(); }
// v9.14.0 역장 치기: 명령 (fatk) 이거나 · 노린 상대와 나 사이를 역장이 막고 가까우면 (근접) — 역장 앞 (내 쪽) 으로 가서 친다 (준비 · 회복은 제 무기대로)
function fieldOf(W, id){ return (W.sf8 || []).find(f => f.id === id && f.k === 'wall' && f.hard && W.t < f.until) || null; }
function fieldAtk(W, u, dt){
  if (isFar(u) || u.crawl || u.down || u.lie || u.kb || (u.act && u.act.k !== 'fatk')) return false;
  const ord = u.order && u.order.k === 'fatk'; let F = null;
  if (ord){ F = fieldOf(W, u.order.f); if (!F || F.side === u.side){ u.order = null; return false; } }
  else { if (u.order || (u.act && u.act.k === 'fatk' && !fieldOf(W, u.act.f))) return false; const t = u.target && u.target.alive ? u.target : null; if (!t || t.side === u.side) return false; const G = wallBetween(W, u, t); if (!G || G.id == null || wallQ(G, u.x, u.y).d > u.r + u.rng + 1.2) return false; F = G; }
  if (u.act && u.act.k === 'fatk') return true;
  const dx = u.x - F.x, dy = u.y - F.y, al = Math.max(-F.h + 0.2, Math.min(F.h - 0.2, dx * F.ux + dy * F.uy)), sg = dx * F.nx + dy * F.ny >= 0 ? 1 : -1, px = F.x + F.ux * al, py = F.y + F.uy * al, th = (F.th || 0.8) / 2, reach = Math.hypot(u.x - px, u.y - py) - u.r - th;
  u.fg = Math.atan2(py - u.y, px - u.x);
  if (reach > u.rng + 0.05){ setMood(W, u, '역장을 치러 감'); goTo(W, u, px + F.nx * sg * (u.r + th + Math.min(u.rng, 0.4)), py + F.ny * sg * (u.r + th + Math.min(u.rng, 0.4)), dt); return true; }
  stop(u); u.act = { k: 'fatk', f: F.id, phase: 'wind', t0: W.t, end: W.t + (u.wind || 0.4), rec: u.rec || 0.6 }; setMood(W, u, '역장을 침'); return true;
}
function hitCover(W, u, dt){""")
# ④ 돌격 닿음
rep("  if (A.mode === 'atk' && !hit && tg && tg.alive", """  if (A.stabbed && W.t - A.followT > 0.4){ u.act = { k: 'atk', phase: 'rec', b: A.b, t0: W.t, end: W.t + 0.45, t1: W.t }; u.offBal = W.t + 0.35; return; }   /* v9.14.0 관성이 다 빠짐 — 몸은 닿지 않음 */
  if (A.mode === 'atk' && !A.stabbed && !hit && tg && tg.alive""")
rep("    if (!(tg.act && tg.act.k === 'charge' && tg.act.phase === 'run') && evadeCharge(W, tg, u, A)) return;\n    const k = Math.max(0.6", "    if (!(tg.act && tg.act.k === 'charge' && tg.act.phase === 'run') && evadeCharge(W, tg, u, A)){ A.ev = (A.ev || []).filter(i => i !== tg.i); A.stabbed = true; A.followT = W.t; return; }   /* v9.14.0 무기는 피했어도 길에 남으면 몸이 부딪힘 */\n    const k = Math.max(0.6")
rep("    u.act = { k: 'atk', phase: 'rec', b: tg.i, t0: W.t, end: W.t + 0.45, t1: W.t }; u.offBal = W.t + 0.35; return; }", """    { const dec = (C.brake || 12) * (0.6 + W.rand() * 1.0), g0 = Math.max(0, gap(u, tg)), v2 = A.sp * A.sp - 2 * dec * g0;   /* v9.14.0 무기가 먼저 닿고 · 관성이 남으면 몸도 부딪힘 (멈추는 힘 무작위) */
      if (tg.alive && !tg.down && v2 > 0.81){ A.stabbed = true; A.followT = W.t; A.sp = Math.sqrt(v2); L(W, { k: 'chgFollow', a: u.i, b: tg.i, v: +A.sp.toFixed(1), vis: u.side === 0 || !!u.seenBy || !!tg.seenBy }); return; } }
    u.act = { k: 'atk', phase: 'rec', b: tg.i, t0: W.t, end: W.t + 0.45, t1: W.t }; u.offBal = W.t + 0.35; return; }""")
rep("module.exports = { loophole,", "module.exports = { supDash, fieldAtk, fieldOf, loophole,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9340 OK')
