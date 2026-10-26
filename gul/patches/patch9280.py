# v9.10.0 엔진 — patch9280.py v1.0 (v1.0: 점검 바로잡기 (보이지 않는 궁수 한 명에게 다섯이 쓰러진 판) — ① 견제사격을 양쪽 편이 (적 편 전용이었음): 보이지 않는 사수에게 맞으면 지휘관이 견제 솜씨가 있는 사수에게 날아온 쪽으로 쏘게 함 (지휘망 · 우리 편은 사격 금지 · 명령 중이면 안 함) ② 보이지 않는 사수에게 맞으면 (양쪽 편) 날아온 방향을 알고 그쪽으로 돌아섬 — 맞은 몸 · 곁 2.5칸 동료 (맞붙지 않은 몸) · 움직일 때도 그쪽을 마주 보며 (방패가 그쪽) ③ 사수 · 치유가 사수에게 노려지거나 맞으면 가까운 방패 · 큰 몸 동료 뒤로 숨음 (그 사수가 보이고 닿으면 그냥 되쏨) ④ 빼꼼 넓힘 — 사선을 막은 첫 몸이 같은 편이고 2.5칸 안이면 옆으로 비켜 (최대 0.6칸 남짓) 쏨 (맞닿을 때만이던 것) ⑤ 돌격 받침은 대장 · 동료를 밀어낼 만한 돌격만 (돌격하는 몸이 받는 몸의 절반 무게 이상 · 거구 · 돌진) — 개 한 마리의 덮침에 부하들이 줄곧 대장 뒤로 질주하던 것 ⑥ 재집결 거리 1000000000칸 — 기댈 동료 · 자리가 없으면 쫓기를 그만두지 않음 ⑦ 조합 버프 '노먼의 2편대' 없앰 (2편대 · 부대장이 없어짐) ⑨ 따를이 = 적극 가담: 대장이 노리는 사수에게 발 빠른 따를이가 먼저 · 나를 쏘는 사수에게는 대장 곁으로 돌아가지 않고 감 (보이지 않으면 날아온 쪽으로) ⑧ 대장 관계인데 '(전우조)' 로 나오던 표시 → '따라감 (따를이 · 보호받을이)')
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9270.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# ② 날아온 방향 — 기록에 쏜 이 · 돌아섬
rep("tr: +Math.hypot(s.x - s.x0, s.y - s.y0).toFixed(1), t: W.t, gun: !!s.gun, by: b.i });", "tr: +Math.hypot(s.x - s.x0, s.y - s.y0).toFixed(1), t: W.t, gun: !!s.gun, by: b.i, a: s.a });   /* v9.10.0 쏜 이 (방향만 앎 — 자리는 모름) */\n  { const fa = Math.atan2(-s.dy, -s.dx); for (const o of W.units){ if (!o.alive || o.down || o.side !== b.side || o.act || (o !== b && dist(o, b) > 2.5) || W.units.some(f => f.alive && !f.down && f.side !== o.side && gap(o, f) < Math.max(o.rng, 0.5) + 0.6)) continue; o.fg = fa; o.incT = W.t; } }   /* v9.10.0 날아온 쪽으로 돌아섬 (맞은 몸 · 곁 동료) */")
rep("    if (!(u.side === 0 ? (f.seenBy || canSee(W, u, f)) : (canSee(W, u, f) || fresh(W, u.sense[f.i], 1.5)))) continue;\n    const g = gap(u, f), on =",
    "    const incF = (W.inc || []).some(q => q.a === f.i && q.side === u.side && W.t - q.t < 4 && (q.by === u.i || Math.hypot(q.x - u.x, q.y - u.y) < 2.5));   /* v9.10.0 보이지 않아도 화살이 날아온 쪽은 앎 */\n    if (!incF && !(u.side === 0 ? (f.seenBy || canSee(W, u, f)) : (canSee(W, u, f) || fresh(W, u.sense[f.i], 1.5)))) continue;\n    const g = gap(u, f), on =")
rep("    if (shooter){ const inc = arcAt(W, f, u);", "    if (shooter){ const inc = arcAt(W, f, u) || incF;")
# ① 견제사격 양쪽 편
rep("function suppHid(W){\n  const SU = SUP(W) || {}; let best = null;", "function suppHid(W, sd){ sd = sd == null ? 1 : sd;   /* v9.10.0 양쪽 편 — sd = 쏘게 하는 편 */\n  const SU = SUP(W) || {}; let best = null;")
rep("    if (!t.alive || t.down || t.side !== 0 || !isFar(t) || W.t - (t.lastFireT == null ? -99 : t.lastFireT) > (SU.fireT || 8)) continue;\n    if (W.units.some(e => e.alive && e.side === 1 && canSee(W, e, t))) continue;\n    for (const e of W.units){ if (!e.alive || e.side !== 1) continue;",
    "    if (!t.alive || t.down || t.side === sd || !isFar(t) || W.t - (t.lastFireT == null ? -99 : t.lastFireT) > (SU.fireT || 8)) continue;\n    if (W.units.some(e => e.alive && e.side === sd && canSee(W, e, t))) continue;\n    for (const e of W.units){ if (!e.alive || e.side !== sd) continue;")
rep("function suppAI(W){\n  const SU = SUP(W); if (!SU || !SU.ai || AI6.includes('supp')) return;\n  const C = cmdBoss(W, 1); if (!C || roamIdle(C)) return;   // v7.8.1 떠도는 중인 지휘관은 모름\n  const rec = (W.inc || []).filter(r => r.side === 1 && W.t - r.t < 3), hs = rec.length ? null : suppHid(W);",
    "function suppAI(W){\n  const SU = SUP(W); if (!SU || !SU.ai || AI6.includes('supp')) return;\n  for (const sd of [1, 0]) suppAI1(W, SU, sd);   /* v9.10.0 양쪽 편 */\n}\nfunction suppAI1(W, SU, sd){\n  const C = cmdBoss(W, sd); if (!C || roamIdle(C)) return;   // v7.8.1 떠도는 중인 지휘관은 모름\n  const rec = (W.inc || []).filter(r => r.side === sd && W.t - r.t < 3), hs = rec.length ? null : suppHid(W, sd);")
rep("    if (!u.alive || u.down || u.side !== 1 || !suppOK(u) || u.supp || u.suppPend || u.act || W.t < (u.suppCd || 0) || u.shadow || u.lurk || roamIdle(u)) continue;\n    if (W.units.some(f => f.alive && f.side === 0 && canSee(W, u, f) && gap(u, f) <= u.rng)) continue;",
    "    if (!u.alive || u.down || u.side !== sd || !suppOK(u) || u.supp || u.suppPend || u.act || W.t < (u.suppCd || 0) || u.shadow || u.lurk || roamIdle(u) || (sd === 0 && (u.order || roeOf(W, u) === 'nofire'))) continue;   /* 우리 편: 명령 중 · 사격 금지면 안 함 */\n    if (W.units.some(f => f.alive && f.side !== sd && canSee(W, u, f) && gap(u, f) <= u.rng)) continue;")
rep("L(W, { k: 'cmdMiss', side: 1, a: u.i, c: C.i, via: lk.via, why: lk.why, p: +lk.p.toFixed(2), o: ['supp'], vis: !!u.seenBy }); }", "L(W, { k: 'cmdMiss', side: sd, a: u.i, c: C.i, via: lk.via, why: lk.why, p: +lk.p.toFixed(2), o: ['supp'], vis: sd === 0 || !!u.seenBy }); }")
# ③ 사수 · 치유는 방패 · 큰 몸 뒤로
rep("function chargeBrace(W, u, dt){", """// v9.10.0 사수 · 치유가 사수에게 노려지거나 맞으면 (보이지 않아도) 가까운 방패 · 큰 몸 동료 뒤로 — 그 사수가 보이고 닿으면 되쏨 (양쪽 편)
function hitCover(W, u, dt){
  if (!isSupport(u) || u.order || u.act || u.chiefLk || u.lie || u.crawl || u.kb || u.down) return false;
  const g = shooterOn(W, u) || (() => { const q = (W.inc || []).filter(r => r.by === u.i && W.t - r.t < 2).pop(); return q && W.units[q.a] && W.units[q.a].alive ? W.units[q.a] : null; })(); if (!g) return false;
  if (isFar(u) && canSee(W, u, g) && dist(u, g) <= u.rng + 0.3 && u.ammo !== 0) return false;   // 보이고 닿음 → 되쏨
  if (W.units.some(f => f.alive && !f.down && f.side !== u.side && gap(u, f) < 2)) return false;   // 코앞 적이 먼저
  const B = W.units.filter(o => o.alive && o !== u && o.side === u.side && !o.down && !o.crawl && (o.shield || o.armShield || o.giant || o.modBody || (o.mass || 0) >= 100) && dist(o, u) < 3.5).sort((a, b) => dist(a, u) - dist(b, u))[0]; if (!B) return false;
  const d = dist(B, g) || 1, x = B.x + (B.x - g.x) / d * (B.r + u.r + 0.05), y = B.y + (B.y - g.y) / d * (B.r + u.r + 0.05); if (Math.hypot(x - u.x, y - u.y) < 0.15) return false;
  if (u.hcLog == null || W.t - u.hcLog > 4){ u.hcLog = W.t; L(W, { k: 'hitCover', a: u.i, b: B.i, c: g.i, vis: u.side === 0 || !!u.seenBy }); }
  u.mv = { k: 'crun', run: true, until: W.t + 0.3 }; goTo(W, u, x, y, dt); u.fg = Math.atan2(g.y - u.y, g.x - u.x); setMood(W, u, B.name + ' 뒤로 (사수를 피함)', g.i); return true;
}
function chargeBrace(W, u, dt){""")
rep("  if (!u.order && pairStep(W, u, dt)) return whyS(W, u, 'PAIR');", "  if (hitCover(W, u, dt)) return whyS(W, u, 'HIT_COVER');   /* v9.10.0 */\n  if (!u.order && pairStep(W, u, dt)) return whyS(W, u, 'PAIR');")
# ④ 빼꼼 넓힘
rep("if (fb === t || fb.side !== u.side || gap(u, fb) > 0.2) return null;", "if (fb === t || fb.side !== u.side || gap(u, fb) > 2.5) return null;   /* v9.10.0 2.5칸 안이면 (맞닿을 때만이던 것) */")
rep("for (const L of [L0, L0 + 0.18])", "for (const L of [L0, L0 + 0.18, L0 + 0.4])")
# ⑤ 돌격 받침은 무거운 돌격만
rep("for (const e of W.units){ if (!e.alive || e.side === u.side || !e.act || e.act.k !== 'charge' || e.act.b == null) continue; const t = W.units[e.act.b];",
    "for (const e of W.units){ if (!e.alive || e.side === u.side || !e.act || e.act.k !== 'charge' || e.act.b == null) continue; const t = W.units[e.act.b]; if (t && !(e.giant || e.rush || e.modBody || (e.mass || 70) >= (t.mass || 70) * 0.5)) continue;   /* v9.10.0 밀어낼 만한 돌격만 */")
# ⑥ 재집결 거리
rep("anc = mates0.length || u.stay || hero0 ? { d: dMain } : null;", "anc = dMain < 1e8 ? { d: dMain } : null;   /* v9.10.0 기댈 곳이 없으면 그만두지 않음 */")
# ⑦ 조합 버프 2편대 없앰
rep("  { k: 'sq2', nm: '노먼의 2편대', min: 2, who: u => ['C-007', 'C-004', 'C-106'].includes(u.ref), need: u => u.ref === 'C-007', why: '2편대장 노먼 — 청광묵 · 친칠라 지휘 (도감)', fx: '노먼이 외친 표적을 칠 때 명중 · 피해 ×1.1' },\n", "")
# ⑧ 표시
rep("how === 'link' ? p.name + '와 붙어 감 (전우조)' :", "how === 'link' ? p.name + (u.cg && p.cg === u.cg ? '와 붙어 감 (전우조)' : ' 따라감 (' + (coverU(u) ? '보호받을이' : '따를이') + ')') :")
rep("  if (u.side === 1 && (u.supp || u.suppPend) && suppAct(W, u, dt)) return whyS(W, u, 'ENEMY_PLAN');", "  if ((u.side === 1 || (u.supp && u.supp.ai) || u.suppPend) && (u.supp || u.suppPend) && suppAct(W, u, dt)) return whyS(W, u, 'ENEMY_PLAN');   /* v9.10.0 지휘관이 시킨 견제사격은 양쪽 편 */")
rep("  if (ft && !heal && !isFar(u)){\n    const fast =", """  if (!heal && !isFar(u) && !u.cg){   /* v9.10.0 따를이 = 적극 가담: 대장이 노리는 사수 · 나를 쏘는 사수에게 (발 빠르거나 내가 맞을 때) — 보이지 않으면 날아온 쪽으로 */
    const fast1 = u.role === '미드필더' || u.role === '공격수' || (u.spd || 0) >= (C.spd || 2) * 1.12, myInc = (W.inc || []).filter(q => q.by === u.i && W.t - q.t < 2.5).pop(), onMe = shooterOn(W, u) || (myInc && W.units[myInc.a]);
    const ct = C.target && C.target.alive && !C.target.down && C.target.side !== u.side && isFar(C.target) ? C.target : null, sh = (fast1 && ct) || (onMe && onMe.alive && !onMe.down && isFar(onMe) ? onMe : null);
    if (sh && dist(sh, C) < 14 && !W.units.some(f => f.alive && !f.down && f.side !== u.side && f !== sh && gap(u, f) < Math.max(u.rng, 0.5) + 0.6)){
      if (u.shLog == null || W.t - u.shLog > 4){ u.shLog = W.t; L(W, { k: 'pairGo', a: u.i, b: C.i, tg: sh.i, how: 'shooter', run: true, chief: true, vis: u.side === 0 || !!u.seenBy }); }
      const known = u.side === 0 ? (sh.seenBy || canSee(W, u, sh)) : (canSee(W, u, sh) || fresh(W, u.sense[sh.i], 2));
      if (known){ u.target = sh; u.state = 'hunt'; return false; }
      const q = myInc || (W.inc || []).filter(r => r.a === sh.i && r.side === u.side && W.t - r.t < 3).pop(); if (q){ const dl = Math.hypot(q.dx, q.dy) || 1, rr = Math.min(Math.max(q.tr || 6, 3), 8); u.pairHow = 'shooter'; return go(Math.max(0.6, Math.min(W.map.W - 0.6, q.x + q.dx / dl * rr)), Math.max(0.6, Math.min(W.map.H - 0.6, q.y + q.dy / dl * rr)), true, 'rear', C, sh); } } }
  if (ft && !heal && !isFar(u)){
    const fast =""")
rep("module.exports = { coverU,", "module.exports = { hitCover, suppAI1, coverU,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9280 OK')
