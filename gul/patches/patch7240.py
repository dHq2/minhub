# v7.24.0 엔진 — patch7240.py v1.4 (v1.4: 도약 강타 약한 피해 × 0.3 · v1.3: 스텝 사이 0.15 ~ 0.45초 · 제 일격을 모으는 중에도 상대 일격이 먼저 닿으면 끊고 비켜 섬 · v1.2: 막 친 뒤 = 거두는 동안 계속 적어 둠 · 비켜 섬 0.5초마다 75% · v1.1: 비켜 섬은 매 틱 (치고 거두는 중에도) · 탐색 중에도 옆걸음 · 연격이 끝난 뒤도 치고 빠짐 · 높이 뛴 몸 (도약 강타) 은 겹쳐도 밀지 않음 · 세자르: 스텝을 마구 밟는 난도질 — 들어오는 일격을 옆 · 뒤로 비켜 섬 (딜타임엔 바로 되벰) · 치고 빠짐 · 밟아 들어가며 벰 · 간격을 잴 때도 옆걸음 스텝 · 스텝 중엔 잘 피함 /
#   호레이쇼 도약 강타: 공중 (도약 · 공중제비 중) 은 피해 없음 · 그림 (몸 동그라미) 과 절반 넘게 겹치면 찌부러짐 · 몸에 걸친 이는 몸 밖으로 밀려나며 약한 피해 · 충격 범위는 약한 피해와 약한 밀림 (넘어짐 없음))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
FS = {k: open(D + k + '_v7233.js', encoding='utf-8').read() for k in ('rt3_head', 'rt3_mid', 'rt3_tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in FS.values())
    assert n == c, (n, c, a[:100])
    for k in FS:
        FS[k] = FS[k].replace(a, b)

# 규칙: 세자르 스텝 · 걸음 (조금 빠르게) · 도약 강타
rep("  cz: { probe: [4.5, 7], fury: 4.5, punish: 2.2, punR: 6, keep: 3.5, orbit: 0.25, walk: 0.45, jog: 1.4,",
    "  cz: { probe: [4.5, 7], fury: 4.5, punish: 2.2, punR: 6, keep: 3.5, orbit: 0.25, walk: 0.6, jog: 1.4,")
rep("furyWalk: 0.8, run: 3,", "furyWalk: 1.0, run: 3,")
rep("    auth: { at: 0.6, raise: 1.1, done: 1.6, retry: 6, shake: 0.3, shaken: 6, cool: 4 } },",
    "    auth: { at: 0.6, raise: 1.1, done: 1.6, retry: 6, shake: 0.3, shaken: 6, cool: 4 },\n    step: { gap: [0.15, 0.45], d: 1.6, T: 0.13, inR: 3.2, out: 0.7, react: 0.75, rcd: 0.5, win: 0.32, ev: 0.6, frost: 0.6 } },   /* v7.24 스텝: gap = 스스로 밟는 사이 (초) · d = 한 번에 M · T = 걸리는 초 · inR = 밟아 들어가 벨 거리 · out = 친 뒤 빠질 확률 · react = 들어오는 일격을 비켜 설 확률 (rcd 초마다) · win = 그 일격이 이만큼 안에 닿을 때 · ev = 스텝 중 회피 바닥 · frost = 동상이면 거리 × */")
rep("quake: { d: 9, min: 3, time: 1.1, cd: 6, r: 2.4, under: 1, kill: '중형', mul: 2.2, kb: 1.6, down: 1.4, react: 0.3, flee: 0.85 },",
    "quake: { d: 9, min: 3, time: 1.1, cd: 6, r: 2.4, under: 1, kill: '중형', mul: 0.3, kb: 0.7, crush: 0.5, react: 0.3, flee: 0.85 },   /* v7.24 도약 강타: 공중은 피해 없음 · 그림과 crush (절반) 넘게 겹치면 찌부러짐 · 나머지는 약한 피해 (mul) · 약한 밀림 (kb) · 넘어짐 없음 */")

# 세자르 상태: 스텝 시계
rep("auth: (p.unique || []).includes('권위') ? 0.6 : null, shaken: 0, cool: 0 }; }",
    "auth: (p.unique || []).includes('권위') ? 0.6 : null, shaken: 0, cool: 0, stepT: 0, rstep: 0, nStep: 0, wasAtk: false, afterAtk: -9 }; }   /* v7.24 스텝 */")
# 틱: 스텝 시계 · 막 친 뒤를 앎
rep("  for (const k of ['spin', 'shoulder', 'back', 'punish', 'upcut', 'thrust', 'wave', 'ult']) z[k] -= dt;",
    "  for (const k of ['spin', 'shoulder', 'back', 'punish', 'upcut', 'thrust', 'wave', 'ult', 'rstep']) z[k] -= dt;\n  if (u.act && u.act.k === 'atk' && u.act.phase === 'rec') z.afterAtk = W.t;   /* v7.24 막 친 뒤 (거두는 동안 계속 — 치고 빠짐) */")
# 스텝 중엔 잘 피함
rep("  if (u.act && u.act.k === 'cz' && !['backs', 'rush', 'flank'].includes(u.act.s)) return 0;",
    "  if (u.act && u.act.k === 'cz' && !['backs', 'rush', 'flank', 'step'].includes(u.act.s)) return 0;")
rep("  if (u.act && u.act.k === 'cz' && u.act.hop) p = Math.max(p, 0.5);   /* v7.23.1 뒷걸음 점프 중 */",
    "  if (u.act && u.act.k === 'cz' && u.act.hop) p = Math.max(p, 0.5);   /* v7.23.1 뒷걸음 점프 중 */\n  if (u.act && u.act.k === 'cz' && u.act.s === 'step') p = Math.max(p, ((W.rules.cz || {}).step || {}).ev || 0.6);   /* v7.24 스텝 중 */")
# 스텝 실행 (czRun)
rep("  if (A.s === 'backs'){ const hop = Z.backT || 0.34,",
    """  if (A.s === 'step'){ const T = A.T || 0.13, k = Math.min(1, el / T), nx = A.fx + (A.tx - A.fx) * k, ny = A.fy + (A.ty - A.fy) * k;   /* v7.24 스텝: T 초에 d M */
    tryMove(W, u, nx, ny); if (t && t.alive) u.fg = Math.atan2(t.y - u.y, t.x - u.x);
    if (k >= 1){ if (A.then === 'atk' && t && t.alive){ z.atkNow = true; z.atkB = t.i; } czEnd(W, u); } return true; }
  if (A.s === 'backs'){ const hop = Z.backT || 0.34,""")
# 스텝 고르기 · 시작 (로그 없이 — 하도 잦아서. 셈만)
rep("function czEnd(W, u, k, cd){", """// v7.24 스텝: 상대 t 기준 ang 쪽으로 d M (빈 곳만) — then = 'atk' 면 내려서며 바로 벰
function czStep(W, u, t, angs, d, then, why){
  const S = (CZR(W).step || {}), z = u.cz; if (W.t < (u.hobbleT || -9) || u.kb || prone(W, u)) return false; const dd = d * (W.t < (u.frostT || -9) ? S.frost || 0.6 : 1);
  for (const a of angs){ const x = u.x + Math.cos(a) * dd, y = u.y + Math.sin(a) * dd;
    if (x < u.r || y < u.r || x > W.map.W - u.r || y > W.map.H - u.r || boxRock(W, x, y, u.r * 0.9) || !fatClear(W.map, u.x, u.y, x, y, u.r * 0.8)) continue;
    if (W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r * 0.85)) continue;
    u.act = { k: 'cz', s: 'step', b: t ? t.i : null, t0: W.t, end: W.t + 1, fx: u.x, fy: u.y, tx: x, ty: y, T: S.T || 0.13, then: then || null }; stop(u); u.waitT = 0;
    z.nStep = (z.nStep || 0) + 1; (z.stepK = z.stepK || {})[why || '-'] = ((z.stepK || {})[why || '-'] || 0) + 1; z.stepT = W.t + (S.T || 0.13) + (S.gap || [0.15, 0.45])[0] + W.rand() * (((S.gap || [0.15, 0.45])[1]) - ((S.gap || [0.15, 0.45])[0]));
    if (why) setMood(W, u, why, t ? t.i : null); if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t });
    return true; }
  return false;
}
// v7.24 비켜 섬: 매 틱 — 손이 비었거나 막 치고 거두는 중이면, 나를 노린 일격이 win 초 안에 닿을 때 옆 · 뒤로 (rcd 초마다 · react 확률). 딜타임이면 내려서며 되벰
function czReact(W, u){
  const z = u.cz, S = (CZR(W).step || {}); if (!z || !z.on || !u.alive || z.rstep > 0 || z.combo || u.kb || prone(W, u) || W.t < (u.stunT || -9) || W.t < (u.hobbleT || -9)) return false;
  if (u.act && !(u.act.k === 'atk' && (u.act.phase === 'rec' || u.act.phase === 'wind'))) return false;
  const inc = W.units.find(e => e.alive && e.side !== u.side && e.act && e.act.phase === 'wind' && e.act.b === u.i && ['atk', 'bash', 'spec'].includes(e.act.k) && e.act.end - W.t < (S.win || 0.32) && !(e.act.czSt || []).includes(u.i) && dist(e, u) < (e.rng || 1) + e.r + u.r + 1.2 && aware(W, u, e) && !(u.act && u.act.phase === 'wind' && u.act.end <= e.act.end - 0.02));   // 제 일격이 먼저 닿으면 그대로 침
  if (!inc) return false; (inc.act.czSt = inc.act.czSt || []).push(u.i); z.rstep = S.rcd || 0.7; if (W.rand() >= (S.react || 0.7)) return false;
  const aw = Math.atan2(u.y - inc.y, u.x - inc.x), sg = W.rand() < 0.5 ? 1 : -1, was = u.act; u.act = null;
  if (czStep(W, u, inc, [aw + sg * 1.25, aw - sg * 1.25, aw + sg * 0.6, aw, aw - sg * 0.6], S.d || 1.6, z.fury || W.rand() < 0.4 ? 'atk' : null, '비켜 섬')){ L(W, { k: 'czSide', a: u.i, b: inc.i, vis: u.side === 0 || !!u.seenBy || inc.side === 0 }); return true; }
  u.act = was; return false;
}
function czEnd(W, u, k, cd){""")
# 두뇌: 스텝 (권위 · 빈틈 찌르기 · 이어 치기 다음, 큰 기술 앞)
rep("  const close = byD.filter(o => gap(u, o) < (Z.close || 1.2));\n  if (close.length && !z.fury && z.spin <= 0 && W.rand() < 0.5) return czStart(W, u, 'spin', t);",
    """  { const S = Z.step || {}, aT = Math.atan2(t.y - u.y, t.x - u.x), sg = W.rand() < 0.5 ? 1 : -1, rd = S.d || 1.6;   /* v7.24 스텝을 마구 밟음 */
    if (W.t >= (z.stepT || 0) && !z.combo){
      if (W.t - (z.afterAtk || -9) < 0.3 && W.rand() < (z.fury ? (S.out || 0.7) * 0.6 : S.out || 0.7) && czStep(W, u, t, [aT + Math.PI + sg * 0.5, aT + Math.PI - sg * 0.5, aT + Math.PI, aT + sg * 1.4], rd, null, '치고 빠짐')) return true;   // 치고 빠짐
      const g = gap(u, t), reach = u.rng + 0.05;
      if (g > reach && g - reach < Math.min(S.inR || 3.2, rd + 0.6) && (z.fury || W.rand() < 0.35)){ const k = Math.min(rd, g - u.rng * 0.6);   // 밟아 들어가며 벰
        if (k > 0.3 && czStep(W, u, t, [aT + sg * 0.35, aT - sg * 0.35, aT], k, 'atk', '밟아 들어가 벰')) return true; }
      if (z.fury && g > reach && g < reach + rd * 2.2 && czStep(W, u, t, [aT + sg * 0.5, aT - sg * 0.5], rd, null, '파고듦')) return true;   // 두 번에 걸쳐 파고듦
      if (g < (Z.keep || 3.5) + 2.5){ const o = z.orbit || 1, side = W.rand() < 0.25 ? -o : o; if (side !== o) z.orbit = side;   // 간격을 잴 때도 옆걸음 (돌던 쪽 · 가끔 반대로)
        if (czStep(W, u, t, z.fury ? [aT + side * 1.1, aT + side * 0.7, aT - side * 1.1] : [aT + side * 1.57 + (g < (Z.keep || 3.5) - 0.8 ? 0.6 * side : 0), aT - side * 1.57, aT + Math.PI + side * 0.8], rd * (z.fury ? 0.8 : 1), null, z.fury ? '옆으로 파고듦' : '옆걸음')) return true; } } }
  const close = byD.filter(o => gap(u, o) < (Z.close || 1.2));
  if (close.length && !z.fury && z.spin <= 0 && W.rand() < 0.5) return czStart(W, u, 'spin', t);""")

# 호레이쇼 도약 강타
rep("""    if (d < u.r * (Q.under || 1) + e.r * 0.5 && (SIZE_RANK[sizeOf(e)] != null ? SIZE_RANK[sizeOf(e)] : 1) <= kr){ applyDmg(W, u, e, Math.ceil(e.hp) + 999, { tag: '깔림', death: 'crush', ff: e.side === u.side }); kills++; continue; }
    const f = 1 - Math.min(1, Math.max(0, d - e.r) / R) * 0.6, o = strike(W, u, e, e, 1, false, { mul: (Q.mul || 2.2) * f, tag: '도약 강타 충격', wk: '둔기' });
    if (e.alive && !e.kb) shove(W, u, e, (Q.kb || 1.6) * f * (o && o.block ? 0.6 : 1), ax, ay, { tag: '충격에 날아감' });
    if (e.alive && !e.kb && e.mass * (e.poise || 1) <= u.mass * 0.8 && W.rand() < 0.6 * f) knockDown(W, e, Q.down || 1.4, u.i, '도약 강타'); }
  L(W, { k: 'quakeHit', a: u.i, n, kills, x: +u.x.toFixed(2), y: +u.y.toFixed(2), vis: true }); W.lightT = 0;""",
    """    if (e.act && e.act.k === 'leap'){ air++; if (e.side === 0 || e.seenBy) L(W, { k: 'quakeAir', a: u.i, b: e.i, vis: true }); continue; }   /* v7.24 공중 (도약 · 공중제비 중) 은 피해 없음 */
    const ov = circOv(d, u.r * (Q.under || 1), e.r) / (Math.PI * e.r * e.r);   /* v7.24 그림 (몸 동그라미) 과 겹친 몫 */
    if (ov > (Q.crush != null ? Q.crush : 0.5) && (SIZE_RANK[sizeOf(e)] != null ? SIZE_RANK[sizeOf(e)] : 1) <= kr){ applyDmg(W, u, e, Math.ceil(e.hp) + 999, { tag: '찌부러짐', death: 'crush', ff: e.side === u.side }); kills++; continue; }
    const body = d < u.r + e.r, f = body ? 1 : 1 - Math.min(1, Math.max(0, d - u.r - e.r) / Math.max(0.5, R - u.r)) * 0.5, o = strike(W, u, e, e, 1, false, { mul: (Q.mul || 0.3) * f, tag: body ? '몸에 밀려남' : '도약 강타 충격', wk: '둔기' });
    if (e.alive && body){ const D2 = u.r + e.r + 0.05, x = u.x + ax * D2, y = u.y + ay * D2, p = !boxRock(W, x, y, e.r * 0.9) ? { x, y } : freeSpot(W, x, y, e.r); if (p){ e.x = p.x; e.y = p.y; } push++; }   // 몸에 걸친 이는 몸 밖으로
    if (e.alive && !e.kb) shove(W, u, e, (Q.kb || 0.7) * f * (o && o.block ? 0.6 : 1), ax, ay, { tag: body ? '몸에 밀려남' : '충격에 밀림' }); }
  L(W, { k: 'quakeHit', a: u.i, n, kills, air, push, x: +u.x.toFixed(2), y: +u.y.toFixed(2), vis: true }); W.lightT = 0;""")
rep("  const Q = SPR(W, 'quake'), R = A.r || Q.r || 2.4, kr = SIZE_RANK[Q.kill || '중형'] != null ? SIZE_RANK[Q.kill || '중형'] : 1; let n = 0, kills = 0;",
    "  const Q = SPR(W, 'quake'), R = A.r || Q.r || 2.4, kr = SIZE_RANK[Q.kill || '중형'] != null ? SIZE_RANK[Q.kill || '중형'] : 1; let n = 0, kills = 0, air = 0, push = 0;")
rep("function quakeHit(W, u, A){", """// v7.24 두 원이 겹친 넓이 (반지름 R1 · r2 · 중심 거리 d)
function circOv(d, R1, r2){ if (d >= R1 + r2) return 0; if (d <= Math.abs(R1 - r2)) return Math.PI * Math.min(R1, r2) ** 2;
  const a = r2 * r2 * Math.acos(Math.max(-1, Math.min(1, (d * d + r2 * r2 - R1 * R1) / (2 * d * r2)))) + R1 * R1 * Math.acos(Math.max(-1, Math.min(1, (d * d + R1 * R1 - r2 * r2) / (2 * d * R1)))); return a - 0.5 * Math.sqrt(Math.max(0, (-d + r2 + R1) * (d + r2 - R1) * (d - r2 + R1) * (d + r2 + R1))); }
function quakeHit(W, u, A){""")
rep("module.exports = { czFront, mbOn,", "module.exports = { circOv, czStep, czReact, czFront, mbOn,")
rep("  if (u.cz){ czTick(W, u, dt); if (u.act && u.act.k === 'cz' && czRun(W, u, dt)) return; }   /* v7.23.1 세자르 */",
    "  if (u.cz){ czTick(W, u, dt); if (czReact(W, u)) return; if (u.act && u.act.k === 'cz' && czRun(W, u, dt)) return; }   /* v7.23.1 세자르 */   /* v7.24 비켜 섬 */")
rep("      if (C.left <= 0){ L(W, { k: 'czCombo', a: u.i, b: t.i, n: C.n, vis: u.side === 0 || !!u.seenBy }); z.combo = null; } }",
    "      if (C.left <= 0){ L(W, { k: 'czCombo', a: u.i, b: t.i, n: C.n, vis: u.side === 0 || !!u.seenBy }); z.combo = null; z.afterAtk = W.t; } }   /* v7.24 연격 뒤도 치고 빠짐 */")
rep("    if (d >= need) continue;\n    if (P.lie || Q.lie) lieTrample(W, P, Q);", "    if (d >= need) continue;\n    if ((P.act && P.act.air) || (Q.act && Q.act.air)) continue;   /* v7.24 높이 뛴 몸 (도약 강타) 은 겹쳐도 밀지 않음 — 내려앉는 자리의 몸이 미리 비켜 나지 않게 */\n    if (P.lie || Q.lie) lieTrample(W, P, Q);")
for k, v in FS.items():
    open(D + k + '.js', 'w', encoding='utf-8').write(v)
print('ok')
