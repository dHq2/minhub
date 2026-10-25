# v9.7.2 엔진 — patch9140.py v1.1 (v1.1: 뭉침 앞줄은 근접 모두 (여섯까지) · 사수는 뒷줄 / v1.0: 리모델 P1b 1단계 ① 버팀은 실제로 닿은 몸만 — 옆에 닿으면 0.3 · 뒤에 닿으면 0.6 · 그 뒤에 닿은 둘째 줄은 반 (예전: 1.3칸 안이면 닿지 않아도 · 전열 이웃은 떨어져 있어도 무게를 더함) ② 돌격 방어 본능 (양쪽 편) — 곁의 동료에게 돌격이 오면 근접병은 그 뒤 · 옆뒤에 몸을 붙이고 돌격자를 보며 막기를 듦 ③ 뭉침 명령 (clump) — 고른 무리가 어깨를 붙여 적 쪽으로 한두 줄로 서고 막기를 든 채 버팀 · 닿는 적은 그 자리에서 침)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9130.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ① 버팀 — 닿은 몸만
rep("""  for (const o of W.units){
    if (!o.alive || o === t || o.side !== t.side || o.kb || prone(W, o)) continue;
    const ox = o.x - t.x, oy = o.y - t.y, d = Math.hypot(ox, oy); if (d > (o.rearOf && o.rearOf.j === t.i ? 1.8 : 1.3)) continue;   // v5.9.3 뒷줄은 조금 멀어도 받쳐 줌
    if ((ox * dx + oy * dy) / (d || 1) < -0.2) continue;
    m += o.mass * (C.brace != null ? C.brace : 0.6); ids.push(o.i);
  }
  // v5.7 전열의 관절: 두 마디 건너까지 무게를 나눠 받음 (한 마디 0.3 · 두 마디 0.15)
  if (t.line){""", """  /* v9.7.2 버팀은 실제로 닿은 몸만 (리모델 5.2 — 이웃해 있어도 떨어져 있으면 무게가 오지 않음): 옆에 닿음 0.3 · 뒤에 닿음 brace (0.6) · 그 뒤에 닿은 둘째 줄은 반 */
  const TOUCH = C.touch != null ? C.touch : 0.2, ok0 = o => o.alive && o !== t && o.side === t.side && !o.kb && !prone(W, o) && !o.down && !(o.act && o.act.air);
  const rearW = C.brace != null ? C.brace : 0.6, sideW = C.braceSide != null ? C.braceSide : 0.3, L1 = [];
  for (const o of W.units){ if (!ok0(o)) continue; const ox = o.x - t.x, oy = o.y - t.y, d = Math.hypot(ox, oy) || 0.001; if (d - o.r - t.r > TOUCH) continue;
    const c = (ox * dx + oy * dy) / d; if (c < -0.2) continue; m += o.mass * (c > 0.5 ? rearW : sideW); ids.push(o.i); L1.push(o); }
  for (const o of W.units){ if (!ok0(o) || ids.includes(o.i)) continue; const s = L1.find(q => Math.hypot(o.x - q.x, o.y - q.y) - o.r - q.r <= TOUCH && ((o.x - q.x) * dx + (o.y - q.y) * dy) / (Math.hypot(o.x - q.x, o.y - q.y) || 1) > 0.3); if (!s) continue;
    m += o.mass * rearW * 0.5; ids.push(o.i); }
  if (false && t.line){   /* v9.7.2 옛 전열 관절 무게 (떨어져 있어도 더하던 것) — 닿음으로 바뀜 */""")

# ② 돌격 방어 본능 (양쪽 편)
rep("function pairStep(W, u, dt){", """// v9.7.2 돌격 방어 (리모델 4.2 · 5.2): 곁 (2.2칸) 의 동료에게 오는 돌격을 보면 근접병은 그 뒤 · 옆뒤에 몸을 붙여 받치고 돌격자를 보며 막기를 듦 — 사수 · 치유는 제 일을 그대로
function chargeBrace(W, u, dt){
  if (AI6.includes('cbrace') || isFar(u) || u.cls === '치유' || u.crawl || u.lie || u.kb || u.act || W.t < u.proneT || u.down || (u.stunT && W.t < u.stunT)) return false;
  let best = null;
  for (const e of W.units){ if (!e.alive || e.side === u.side || !e.act || e.act.k !== 'charge' || e.act.b == null) continue; const t = W.units[e.act.b];
    if (!t || t === u || !t.alive || t.side !== u.side || t.down || dist(u, t) > 2.2 || !(u.side === 0 ? (e.seenBy || canSee(W, u, e)) : canSee(W, u, e))) continue;
    if (dist(e, t) < dist(e, u) - 0.2 || !best || dist(u, t) < dist(u, best.t)) best = { e, t }; }
  if (!best) return false;
  const { e, t } = best, d0 = dist(e, t) || 1, dx = (t.x - e.x) / d0, dy = (t.y - e.y) / d0, R = t.r + u.r + 0.02, a0 = Math.atan2(dy, dx);
  const spots = [0, 0.75, -0.75, 1.3, -1.3].map(k => ({ x: t.x + Math.cos(a0 + k) * R, y: t.y + Math.sin(a0 + k) * R }))
    .filter(p => !boxRock(W, p.x, p.y, u.r * 0.9) && !W.units.some(o => o !== u && o !== t && o.alive && Math.hypot(o.x - p.x, o.y - p.y) < o.r + u.r - 0.05));
  const p = spots.sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y))[0]; if (!p) return false;
  if (u.cbrLog == null || W.t - u.cbrLog > 3){ u.cbrLog = W.t; L(W, { k: 'cbrace', a: u.i, b: t.i, c: e.i, vis: u.side === 0 || !!u.seenBy }); }
  setMood(W, u, '돌격 방어 — ' + t.name + ' 뒤를 받침', e.i); u.stay = null;
  if (Math.hypot(p.x - u.x, p.y - u.y) > 0.08) goTo(W, u, p.x, p.y, dt); else stop(u);
  u.fg = Math.atan2(e.y - u.y, e.x - u.x); u.wantT = W.t; if (u.canGuard && !u.raised && u.guardMode !== 'off'){ u.raised = true; u.raiseAt = W.t + ((W.rules.guard || {}).raise != null ? W.rules.guard.raise : 0.25) * (u.vet ? VETR(W).raise : 1); }
  return true;
}
// v9.7.2 뭉침 (돌격 방어 명령): 고른 무리가 어깨를 붙여 적 쪽으로 서고 (근접 앞줄 · 사수 뒷줄) 막기를 든 채 버팀 — 닿는 적은 그 자리에서 침 · 다른 명령이 올 때까지
function clumpStep(W, u, dt){
  const o = u.order, M = W.units.filter(m => m.alive && m.side === u.side && m.order && m.order.k === 'clump' && m.order.g === o.g && !m.crawl && !m.down);
  const seen = W.units.filter(f => f.alive && !f.down && !f.gone && f.side !== u.side && (u.side === 0 ? (f.seenBy || canSee(W, u, f)) : canSee(W, u, f)));
  const ch = seen.find(f => f.act && f.act.k === 'charge' && f.act.b != null && M.includes(W.units[f.act.b]));
  const F = ch || seen.filter(f => Math.hypot(f.x - o.x, f.y - o.y) < 12).sort((a, b) => Math.hypot(a.x - o.x, a.y - o.y) - Math.hypot(b.x - o.x, b.y - o.y))[0];
  if (F){ const fa = Math.atan2(F.y - o.y, F.x - o.x); if (angDiff(fa, o.f) > 0.5) o.f = fa; }
  const A = [...M.filter(m => !isFar(m)), ...M.filter(m => isFar(m))].sort((a, b) => (isFar(a) - isFar(b)) || a.order.j - b.order.j), n = A.length, k = A.indexOf(u);
  const front = A.filter(m => !isFar(m)).length, rowN = front >= 2 ? Math.min(front, 6) : Math.min(n, 4), rr = Math.max(...A.map(m => m.r)), sp = rr * 2 + 0.03;
  const row = k < rowN ? 0 : 1, col = row ? k - rowN : k, cnt = row ? n - rowN : rowN, off = (col - (cnt - 1) / 2) * sp, back = row * sp;
  const px = o.x + Math.cos(o.f + Math.PI / 2) * off - Math.cos(o.f) * back, py = o.y + Math.sin(o.f + Math.PI / 2) * off - Math.sin(o.f) * back;
  u.fg = F ? Math.atan2(F.y - u.y, F.x - u.x) : o.f; u.wantT = W.t; setMood(W, u, '뭉침 — 어깨를 붙여 버팀', F ? F.i : null);
  if (u.canGuard && !u.raised && u.guardMode !== 'off'){ u.raised = true; u.raiseAt = W.t + ((W.rules.guard || {}).raise != null ? W.rules.guard.raise : 0.25) * (u.vet ? VETR(W).raise : 1); }
  const hit = !u.act && seen.filter(f => inReach(u, f)).sort((a, b) => gap(u, a) - gap(u, b))[0];
  if (hit && !(isFar(u) && !losClear(W.map, u.x, u.y, hit.x, hit.y))){ stop(u); u.target = hit; startAct(W, u, hit); return true; }
  if (Math.hypot(px - u.x, py - u.y) > 0.08 && !u.act) goTo(W, u, Math.max(0.6, Math.min(W.map.W - 0.6, px)), Math.max(0.6, Math.min(W.map.H - 0.6, py)), dt); else stop(u);
  return true;
}
function pairStep(W, u, dt){""")
rep("  if (u.side === 0 && u.order){ doOrder(W, u, dt); return whyS(W, u, 'PLAYER_ORDER'); }",
    """  if (u.order && u.order.k === 'clump' && clumpStep(W, u, dt)) return whyS(W, u, 'CLUMP');   /* v9.7.2 뭉침 */
  if ((!u.order || ['hold', 'line', 'watch'].includes(u.order.k)) && chargeBrace(W, u, dt)) return whyS(W, u, 'BRACE_CHARGE');   /* v9.7.2 돌격 방어 본능 (양쪽 편) — 명령 이동 · 공격 중엔 명령대로 */
  if (u.side === 0 && u.order){ doOrder(W, u, dt); return whyS(W, u, 'PLAYER_ORDER'); }""")
rep("const orderTxt = (o, u) => o && o.k === 'frally' ? ['frally'] :", "const orderTxt = (o, u) => o && o.k === 'clump' ? ['clump'] : o && o.k === 'frally' ? ['frally'] :")
rep("module.exports = { whyS, jinkStep,", "module.exports = { chargeBrace, clumpStep, whyS, jinkStep,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9140 OK')
