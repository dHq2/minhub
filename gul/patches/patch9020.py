# v9.2.0 엔진 — patch9020.py v1.0 (v1.0: 2층 대규모 업데이트 3단계 (가) — 암계 병사 넷의 기술 · 방패 크기)
#   · 암계 역장 (방패병): 곧은 선 (5~7칸 · 3초) — 상대 편은 못 넘고 (몸이 걸림) · 근접 일격도 못 닿고 · 곧은 탄도 막힘 (곡사는 못 막음) · 같은 편은 지나감
#   · 밀치기 돌진 (창방패병): 빠른 짧은 돌진 — 부딪힌 상대를 크게 밀어냄 (초대형은 못 밂 · 되려 휘청) · 파동
#   · 장송 치유 · 장송 부활 · 방사 절단 (장송기사): 다친 동료 치유 · 쓰러진 동료를 10초 (최대 둘 · 근성처럼 안 죽음 · 힘 ×1.5 · 장송기사가 쓰러지면 끝) · 둘레를 쓸어 베기
#   · 어둠의 화살비 (장궁병): 하늘로 쏘면 작은 원 여럿 — 피아 구분 없이 어둠의 화살이 쏟아짐
#   · 방패 크기 (소형 · 중형 · 대형): 막는 폭 × 0.8 / 1 / 1.2
import subprocess, json, os
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9010.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# 수치표
rep("  squad: { t: 0.5, flank: 3.2,", "  shSz: { 소형: 0.8, 중형: 1, 대형: 1.2 },   /* v9.2.0 방패 크기 — 막는 폭 배수 (소형 버클러 · 중형 · 대형 팔 방패 · 암계 대방패) */\n  squad: { t: 0.5, flank: 3.2,")
rep("    pthrow: { rng: 12, min: 3,", "    bfield: { ahead: 3, len: 6, lenV: 2, t: 3, wind: 0.5, rec: 0.4, cd: 12 }, bshove: { len: 5, mul: 0.6, kb: 3.2, wind: 0.35, rec: 0.7, cd: 7 }, bmend: { rng: 7, pct: 0.25, wind: 0.6, rec: 0.3, cd: 6 }, braise: { rng: 8, t: 10, hp: 0.4, atk: 1.5, max: 2, win: 25, wind: 1.2, rec: 0.5, cd: 14 }, bcut: { r: 2.6, mul: 1.1, kb: 1.3, wind: 0.7, rec: 0.5, cd: 7 }, brain: { rng: 16, minD: 6, cnt: 7, r: 1.3, spread: 4.5, mul: 0.8, delay: 1.1, gap: 0.12, wind: 0.9, rec: 0.6, cd: 14 },   /* v9.2.0 암계 병사 */\n    pthrow: { rng: 12, min: 3,")
# 방패 크기
rep("      gArc: Math.round(Math.max(sh ? rules.frontArc : 0,", "      shSize: sh ? (p.shSize || '중형') : null, gArc: Math.round((sh ? ((rules.shSz || {})[p.shSize || '중형'] || 1) : 1) * Math.max(sh ? rules.frontArc : 0,")
# 기술 이름 · 목록
rep("'은빛 비행': 'tflight',", "'은빛 비행': 'tflight', '암계 역장': 'bfield', '밀치기 돌진': 'bshove', '장송 치유': 'bmend', '장송 부활': 'braise', '방사 절단': 'bcut', '어둠의 화살비': 'brain',")
rep("const SUP_K = ['mdesc', 'mwall', 'mspirit', 'mvolley', 'cgate', 'cstar', 'cveil', 'clure', 'tsweep', 'tflight', 'twing', 'tdream'];", "const SUP_K = ['mdesc', 'mwall', 'mspirit', 'mvolley', 'cgate', 'cstar', 'cveil', 'clure', 'tsweep', 'tflight', 'twing', 'tdream', 'bfield', 'bshove', 'bmend', 'braise', 'bcut', 'brain'];")
rep("const SUP_SELF = ['mspirit', 'cveil', 'twing', 'tdream'];", "const SUP_SELF = ['mspirit', 'cveil', 'twing', 'tdream', 'bcut'];")
rep("const SUP_FOE = ['mvolley', 'cstar', 'clure'];", "const SUP_FOE = ['mvolley', 'cstar', 'clure', 'bshove'];")
# 역장: 곧은 탄만 막음 (곡사는 못 막음) · 몸을 못 넘게 · 근접도 못 닿게
rep("  for (const F of W.sf8){ if (W.t >= F.until || F.side === s.side) continue;\n    let k = null, how = '';", "  for (const F of W.sf8){ if (W.t >= F.until || F.side === s.side) continue; if (F.hard && arc) continue;   /* v9.2.0 역장은 곡사를 못 막음 */\n    let k = null, how = '';")
rep("  if (F.k === 'wall'){ for (const e of W.units){ if (!e.alive || e.gone || e.side === F.side || F.pushed[e.i]", "  if (F.k === 'wall' && F.hard){ wallHold(W, F); return; }   /* v9.2.0 암계 역장: 못 넘음 */\n  if (F.k === 'wall'){ for (const e of W.units){ if (!e.alive || e.gone || e.side === F.side || F.pushed[e.i]")
rep("function strike(W, u, t, meant, p, far, extra){\n  const R = W.rules, J = extra && extra.jav ? (extra.kn ? KNIFE(W) : JV(W)) : null;",
    "function strike(W, u, t, meant, p, far, extra){\n  const R = W.rules, J = extra && extra.jav ? (extra.kn ? KNIFE(W) : JV(W)) : null;\n  if (W.sup8 && W.sf8 && t !== u && t.side !== u.side && !(extra && (extra.far || extra.arc || extra.rain || extra.jav || extra.kn || extra.nowall)) && !(far != null ? far : isFar(u))){ const FW = wallBetween(W, u, t); if (FW){ if (W.t - (FW.blkT || -9) > 0.4){ FW.blkT = W.t; L(W, { k: 'bfieldBlock', a: FW.by, b: u.i, c: t.i, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '역장에 막힘', c: 'b', t0: W.t }); } u.atkT = W.t; return { block: true, wall: true, led: false, dir: 'front', meant: null, ff: false, far: false, p: null, arc: false, kn: false }; } }   /* v9.2.0 역장 너머는 못 침 */")
# 근성 (장송기사가 살린 동료)
rep("  if (t.spare8 && t.alive && u !== t && dmg >= t.hp){", "  if (t.grit8 && W.t < t.grit8 && t.alive && dmg >= t.hp){ dmg = Math.max(0, t.hp - 1); t.deathKind = null; t.headAt = null; if (!(dmg > 0)) return; }   /* v9.2.0 장송기사가 살린 몸: 근성처럼 안 죽음 */\n  if (t.spare8 && t.alive && u !== t && dmg >= t.hp){")
# 화살비: 피아 구분 없이
rep("const hit = W.units.filter(e => e.alive && !e.gone && !e.down && e.side !== Z.side && !(e.act && e.act.k === 'leap') && h2In(W, { sh: 'circ', x: Z.x, y: Z.y, r: Z.r }, e));", "const hit = W.units.filter(e => e.alive && !e.gone && !e.down && (e.side !== Z.side || Z.ff) && !(e.act && e.act.k === 'leap') && h2In(W, { sh: 'circ', x: Z.x, y: Z.y, r: Z.r }, e));")
# supStart: 동료 · 쓰러진 동료를 겨누는 기술
rep("  if (k === 'cgate' && sfOf(W, 'gate', u.i)) return false;   // 문은 하나",
    "  if (k === 'cgate' && sfOf(W, 'gate', u.i)) return false;   // 문은 하나\n  if ((k === 'bmend' || k === 'braise') && t){ startSpec(W, u, null, k, why); if (!u.act) return false; u.act.tp = t.i; u.act.ang = Math.atan2(t.y - u.y, t.x - u.x); u.fg = u.act.ang; return true; }   /* v9.2.0 동료 · 쓰러진 동료 */")
rep("  if (k === 'mspirit'){ spiritCall(W, u); return; }", """  if (k === 'mspirit'){ spiritCall(W, u); return; }
  if (k === 'bfield'){ const c = Math.cos(A.ang), s = Math.sin(A.ang); let d = S.ahead || 3; while (d > 1 && solid(W.map, u.x + c * d, u.y + s * d)) d -= 0.5;
    const len = (S.len || 6) + (W.rand() - 0.5) * (S.lenV || 2);
    sfAdd(W, { k: 'wall', hard: true, by: u.i, side: u.side, x: u.x + c * d, y: u.y + s * d, ux: -s, uy: c, nx: c, ny: s, h: len / 2, push: 0, t0: W.t, until: W.t + (S.t || 3), pushed: {}, blkT: -9 });
    L(W, { k: 'bfield', a: u.i, len: +len.toFixed(1), vis: true }); return; }
  if (k === 'bshove'){ if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    const ang = Math.atan2(t.y - u.y, t.x - u.x), len = Math.min(S.len || 5, Math.max(0, gap(u, t)) + 0.3), reach = h2Reach(W, u, u.x, u.y, ang, len); if (reach > 0.25) h2Ghost(W, u, u.x + Math.cos(ang) * reach, u.y + Math.sin(ang) * reach);
    if (gap(u, t) > u.rng + 0.9){ L(W, { k: 'miss', a: u.i, b: t.i, why: '닿지 못함', spec: k }); return; }
    if ((SIZE_RANK[sizeOf(t)] || 0) >= SIZE_RANK['초대형']){ stun(W, u, 0.5, t.i); L(W, { k: 'bshove', a: u.i, b: t.i, big: true, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '너무 커서 안 밀림', c: 'b', t0: W.t }); return; }
    if (t.side !== u.side && evadeMelee(W, t, u)) return;
    const o = strike(W, u, t, t, 1, false, { mul: S.mul || 0.6, tag: '밀치기 돌진' });
    if (t.alive && !(o && o.wall)) shove(W, u, t, (S.kb || 3.2) * (o && o.block ? 0.6 : 1), t.x - u.x, t.y - u.y, { tag: '밀치기에 날아감', how: 'bash' });
    L(W, { k: 'bshove', a: u.i, b: t.i, vis }); if (W.fxOn) W.fx.push({ k: 'h2Boom', x: t.x, y: t.y, r: 1.4, side: u.side, t0: W.t }); return; }
  if (k === 'bmend'){ const a = A.tp != null ? W.units[A.tp] : null; if (!a || !a.alive || a.gone || a.side !== u.side || dist(u, a) > (S.rng || 7) + 1){ L(W, { k: 'miss', a: u.i, b: A.tp != null ? A.tp : null, why: '치유할 동료가 없음', spec: k }); return; }
    const add = Math.max(0, Math.min(Math.round(a.max * (S.pct || 0.25)), Math.round(a.max - a.hp))); a.hp += add; u.healed += add;
    L(W, { k: 'bmend', a: u.i, b: a.i, n: add, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: a.x, y: a.y, s: '+' + add, c: 'h', t0: W.t }); return; }
  if (k === 'braise'){ const d = A.tp != null ? W.units[A.tp] : null; if (!d || d.alive || d.gone || d.side !== u.side || dist(u, d) > (S.rng || 8) + 1){ L(W, { k: 'miss', a: u.i, b: A.tp != null ? A.tp : null, why: '살릴 동료가 없음', spec: k }); return; }
    if (W.units.filter(e => e.alive && e.riseBy === u.i).length >= (S.max || 2)){ L(W, { k: 'miss', a: u.i, b: d.i, why: '이미 둘을 살렸음', spec: k }); return; }
    rise(W, d, S.hp || 0.4, true); d.riseBy = u.i; d.riseUntil = W.t + (S.t || 10); d.grit8 = d.riseUntil; d.atkMul = (d.atkMul || 1) * (S.atk || 1.5); d.sense = d.sense || {}; d.faceSide = u.side;
    L(W, { k: 'braise', a: u.i, b: d.i, t: S.t || 10, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: d.x, y: d.y - 0.6, s: '장송 — 되살아남!', c: 'h', t0: W.t }); return; }
  if (k === 'bcut'){ const r = S.r || 2.6; let n = 0;
    for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || e.down || airOf(e) || Math.hypot(e.x - u.x, e.y - u.y) > r + e.r * 0.6 || !losClear(W.map, u.x, u.y, e.x, e.y)) continue;
      strike(W, u, e, e, 1, false, { mul: S.mul || 1.1, tag: '방사 절단' }); n++; if (e.alive && S.kb) shove(W, u, e, S.kb, e.x - u.x, e.y - u.y, { tag: '방사 절단에 밀림', noDown: true }); }
    L(W, { k: 'bcut', a: u.i, n, vis }); if (W.fxOn) W.fx.push({ k: 'h2Fx', sh: 'circ', x: u.x, y: u.y, r, side: u.side, t0: W.t }); return; }
  if (k === 'brain'){ const tx = A.px != null ? A.px : (t ? t.x : u.x), ty = A.py != null ? A.py : (t ? t.y : u.y), Z = W.h2z || (W.h2z = []), m = W.map;
    for (let i = 0; i < (S.cnt || 7); i++){ const x = i ? tx + (W.rand() * 2 - 1) * (S.spread || 4.5) : tx, y = i ? ty + (W.rand() * 2 - 1) * (S.spread || 4.5) : ty;
      Z.push({ by: u.i, side: u.side, x: Math.max(0.5, Math.min(m.W - 0.5, x)), y: Math.max(0.5, Math.min(m.H - 0.5, y)), r: S.r || 1.3, t0: W.t + i * (S.gap || 0.12), at: W.t + i * (S.gap || 0.12) + (S.delay || 1.1), mul: S.mul || 0.8, n: '어둠의 화살비', stun: 0, wk: '날붙이', tag: '어둠의 화살', diag: true, ff: true }); }
    L(W, { k: 'brain', a: u.i, cnt: S.cnt || 7, x: +tx.toFixed(1), y: +ty.toFixed(1), vis: true }); return; }""")
# 자동 쓰기 (스스로 · 적 같은 두뇌)
rep("  // 은빛 비행: 붙은 근접 적 (다쳤거나 둘 이상 · 나를 치려 함) — 반대쪽 · 동료 쪽으로", """  // v9.2.0 암계 역장: 다가오는 근접 적 둘 이상 (또는 사격 준비하는 적 사수) — 그쪽으로 곧은 선 · 이미 펼친 게 있으면 안 펼침
  bfield(W, u, S){ if (sfOf(W, 'wall', u.i)) return false; const F = supFoes(W, u, 13).filter(e => supKnown(W, u, e));
    const near = F.filter(e => !isFar(e) && dist(u, e) >= (S.ahead || 3) + 0.5 && dist(u, e) <= 10 && ((e.vx || 0) * (u.x - e.x) + (e.vy || 0) * (u.y - e.y) > 0.2 || e.target === u || (e.target && e.target.side === u.side))), sh = F.filter(e => isFar(e) && e.act && e.act.phase === 'wind' && W.units[e.act.b] && W.units[e.act.b].side === u.side);
    if (near.length < 2 && !sh.length) return false; const e = sh[0] || near.sort((a, b) => dist(u, a) - dist(u, b))[0]; return supStart(W, u, 'bfield', null, sh.length ? '사격을 막음' : '다가오는 적 ' + near.length, e.x, e.y); },
  // v9.2.0 밀치기 돌진: 손이 닿지 않는 거리 (1.3 ~ 4.5칸) 의 근접 적 — 초대형은 빼고 · 동료를 노리는 적 먼저
  bshove(W, u, S){ const L0 = supFoes(W, u, (S.len || 5) + 0.5).filter(e => !isFar(e) && supKnown(W, u, e) && canSee(W, u, e) && gap(u, e) >= 1.3 && gap(u, e) <= (S.len || 5) - 0.3 && (SIZE_RANK[sizeOf(e)] || 0) < SIZE_RANK['초대형'] && losClear(W.map, u.x, u.y, e.x, e.y));
    if (!L0.length) return false; const sc = e => (e.target && e.target.side === u.side && e.target !== u ? 10 : 0) + (isFar(e) ? 6 : 0) - dist(u, e); const t = L0.reduce((a, b) => sc(b) > sc(a) ? b : a); return supStart(W, u, 'bshove', t, '밀어냄'); },
  // v9.2.0 장송 치유: 다친 (65% 아래) 동료 — 내 곁에 적이 붙지 않았을 때
  bmend(W, u, S){ if (supFoes(W, u, 2).length) return false; const a = supMates(W, u, S.rng || 7).filter(a => a !== u && !a.summon && !a.down && a.hp < a.max * 0.65 && a.hp > 0).sort((p, q) => p.hp / p.max - q.hp / q.max)[0]; if (!a) return false; return supStart(W, u, 'bmend', a, a.name + ' 치유'); },
  // v9.2.0 장송 부활: 가까이 (8칸) 쓰러진 동료 (최근 25초 · 이미 살린 몸 아님) — 싸움이 이어지는 동안 · 최대 둘
  braise(W, u, S){ if (!supFoes(W, u, 14).some(e => supKnown(W, u, e))) return false; if (W.units.filter(e => e.alive && e.riseBy === u.i).length >= (S.max || 2)) return false;
    const d = W.units.filter(a => !a.alive && !a.gone && !a.summon && a.side === u.side && a.riseBy == null && a.deadT != null && W.t - a.deadT <= (S.win || 25) && dist(u, a) <= (S.rng || 8)).sort((p, q) => dist(u, p) - dist(u, q))[0]; if (!d) return false; return supStart(W, u, 'braise', d, d.name + ' 부활'); },
  // v9.2.0 방사 절단: 둘레 2.6칸에 적 둘 이상 (또는 하나 · 위급할 때) · 동료가 끼면 안 씀
  bcut(W, u, S){ const r = S.r || 2.6, F = supFoes(W, u, r + 0.6).filter(e => Math.hypot(e.x - u.x, e.y - u.y) <= r + e.r * 0.6 && supKnown(W, u, e));
    if (F.length < 2 && !(F.length && u.hp < u.max * 0.5)) return false; return supStart(W, u, 'bcut', null, '둘러싼 적 ' + F.length); },
  // v9.2.0 어둠의 화살비: 적이 몰려 있는 곳 (6칸 밖 · 한 원 둘레 4.5칸 안에 적 둘 이상) — 피아 구분이 없으니 동료가 낀 곳은 피함 · 내 곁에 적이 붙지 않았을 때
  brain(W, u, S){ if (supFoes(W, u, 3).length) return false; const F = supFoes(W, u, S.rng || 16).filter(e => supKnown(W, u, e) && dist(u, e) >= (S.minD || 6) && losClear(W.map, u.x, u.y, e.x, e.y)); if (F.length < 2) return false;
    let best = null; for (const e of F){ const n = F.filter(x => Math.hypot(x.x - e.x, x.y - e.y) <= (S.spread || 4.5)).length, m = W.units.filter(a => a.alive && !a.gone && a.side === u.side && Math.hypot(a.x - e.x, a.y - e.y) <= (S.spread || 4.5) + 0.8).length, sc = n - m * 1.6; if (n >= 2 && sc >= 1 && (!best || sc > best.sc)) best = { e, n, m, sc }; }
    if (!best) return false; return supStart(W, u, 'brain', best.e, '적 ' + best.n + (best.m ? ' · 동료 ' + best.m + ' 감수' : ''), best.e.x, best.e.y); },
  // 은빛 비행: 붙은 근접 적 (다쳤거나 둘 이상 · 나를 치려 함) — 반대쪽 · 동료 쪽으로""")
# 도우미 + 틱
rep("function sfEnd(W, F){", r'''// v9.2.0 암계 역장: 상대 편의 몸은 선을 못 넘음 (같은 편은 지나감) — 공중 · 도약 중은 넘음
function wallHold(W, F){
  for (const e of W.units){ if (!e.alive || e.gone || e.side === F.side || airOf(e) || (e.act && (e.act.k === 'tfly' || e.act.k === 'leap'))) continue;
    const dx = e.x - F.x, dy = e.y - F.y, al = Math.max(-F.h, Math.min(F.h, dx * F.ux + dy * F.uy)), px = F.x + F.ux * al, py = F.y + F.uy * al; let ex = e.x - px, ey = e.y - py; const d = Math.hypot(ex, ey), need = e.r + 0.22;
    if (d >= need) continue;
    if (d < 1e-4){ const sg = dx * F.nx + dy * F.ny >= 0 ? 1 : -1; ex = F.nx * sg; ey = F.ny * sg; } else { ex /= d; ey /= d; }
    const push = need - d + 0.02; tryMove(W, e, e.x + ex * push, e.y + ey * push);
    if (W.t - (F.blkT || -9) > 0.6){ F.blkT = W.t; L(W, { k: 'bfieldBlock', a: F.by, b: e.i, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y, s: '역장에 막힘', c: 'b', t0: W.t }); } }
}
function wallBetween(W, u, t){
  if (!W.sf8) return null;
  for (const F of W.sf8){ if (F.k !== 'wall' || !F.hard || W.t >= F.until || F.side === u.side) continue;
    if (segX(u.x, u.y, t.x, t.y, F.x - F.ux * F.h, F.y - F.uy * F.h, F.x + F.ux * F.h, F.y + F.uy * F.h) != null) return F; }
  return null;
}
// v9.2.0 장송기사가 살린 몸: 시간이 다 되거나 장송기사가 쓰러지면 쓰러짐
function bfTick(W){
  for (const d of W.units){ if (!d.riseBy && d.riseBy !== 0) continue; if (!d.alive){ d.riseBy = null; continue; }
    const by = W.units[d.riseBy];
    if (W.t >= d.riseUntil || !by || !by.alive){ const why = !by || !by.alive ? '장송기사가 쓰러져 힘이 끊김' : '장송의 힘이 다함'; d.grit8 = null; d.riseUntil = null; d.riseBy = null; d.atkMul = Math.max(0.1, (d.atkMul || 1) / 1.5);
      L(W, { k: 'braiseEnd', a: d.i, why, vis: d.side === 0 || !!d.seenBy }); applyDmg(W, d, d, Math.max(1, Math.ceil(d.hp)) + 1, { ff: true, far: false, part: null, tag: why, death: 'grit' }); } }
}
function sfEnd(W, F){''')
rep("  watchTick(W);   // v7.7 사주경계 (뒤돌아봄)", "  watchTick(W);   // v7.7 사주경계 (뒤돌아봄)\n  bfTick(W);   /* v9.2.0 장송기사가 살린 몸 */")
rep("module.exports = { matesOf,", "module.exports = { wallBetween, wallHold, bfTick, matesOf,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9020 OK')
