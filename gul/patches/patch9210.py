# v9.9.2 엔진 — patch9210.py v1.0 (v1.0: 빼꼼 사격 — 사선의 첫 몸이 맞닿은 (몸 사이 0.2칸 안) 같은 편 하나뿐이면, 사수는 그 어깨 너머 (옆으로 반 걸음) 로 몸을 내밀어 그 자리에서 다시 오사 판정 — 트이면 거기서 쏘고 0.4초 뒤 제자리로 돌아옴 · 두 줄 넘게 겹치면 (다른 몸이 사선에) 그대로 막힘 · 양쪽 편 같음)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9200.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("""function holdFire(W, u, t, jav){
  const fb = firstOnLine(W, u, t, u, knows(W, u));
  let b = fb !== t && fb.side === u.side ? fb : null;
  if (!b){ const f = ffOdds(W, u, t, u.x, u.y, -(jav ? JVu(W, u).wind : u.wind || 0.5), jav); if (f.p > 0.2) b = f.who; }
  if (!b) return false;""", """// v9.9.2 빼꼼 사격: 사선의 첫 몸이 맞닿은 같은 편 하나 → 어깨 너머 (옆으로) 자리. 그 자리에서 사선이 트이고 오사 위험이 낮을 때만
function peekSpot(W, u, t, jav){
  if (u.lie || u.crawl || u.kb || u.modBody || u.giant) return null;
  const know = knows(W, u), fb = firstOnLine(W, u, t, u, know); if (fb === t || fb.side !== u.side || gap(u, fb) > 0.2) return null;
  const d = dist(u, t) || 1, ux = (t.x - u.x) / d, uy = (t.y - u.y) / d, px = -uy, py = ux, lim = Math.min(0.2, ffLim(u, W)), lead = -(jav ? JVu(W, u).wind : u.wind || 0.5);
  const latF = (fb.x - u.x) * px + (fb.y - u.y) * py, s0 = Math.max(0, Math.min(0.9, ((fb.x - u.x) * ux + (fb.y - u.y) * uy) / d)), L0 = Math.min(fb.r + u.r, (fb.r + 0.12) / Math.max(0.1, 1 - s0) + Math.abs(latF) * 0.5);
  const tryAt = (x, y, ex) => { if (boxRock(W, x, y, u.r * 0.9) || W.units.some(o => o.alive && o !== u && !(ex || [fb.i]).includes(o.i) && Math.hypot(o.x - x, o.y - y) < o.r + u.r * 0.85)) return false;
    if (!losClear(W.map, x, y, t.x, t.y)) return false; const ox = u.x, oy = u.y; u.x = x; u.y = y; const B = lineBodies(W, u, t, u, know).filter(b => !(ex || []).includes(b.i)); u.x = ox; u.y = oy;
    if (B.length && B[0].side === u.side) return false; const k0 = u._pkT, e0 = u._pkEx; u._pkT = W.t; u._pkEx = ex || null; const f = ffOdds(W, u, t, x, y, lead, jav); u._pkT = k0; u._pkEx = e0; return f.p <= lim; };
  for (const sg of latF >= 0 ? [-1, 1] : [1, -1]) for (const L of [L0, L0 + 0.18]){ const x = u.x + px * sg * L, y = u.y + py * sg * L; if (tryAt(x, y, null)) return { x, y, by: fb.i }; }
  // 두 사람 사이 (틈): 맞닿은 앞줄 둘의 이음매 바로 뒤에서 — 그 둘만 지나감 (그 너머 몸은 그대로 막음)
  const f2 = W.units.find(o => o !== fb && o.alive && o.side === u.side && !o.down && gap(o, fb) <= 0.25 && ((o.x - u.x) * ux + (o.y - u.y) * uy) > 0 && gap(o, u) <= 0.6);
  if (f2){ const mx = (fb.x + f2.x) / 2, my = (fb.y + f2.y) / 2, lat = (mx - u.x) * px + (my - u.y) * py, x = u.x + px * lat, y = u.y + py * lat;
    const la = (fb.x - x) * px + (fb.y - y) * py, lb = (f2.x - x) * px + (f2.y - y) * py; if (la * lb < 0 && tryAt(x, y, [fb.i, f2.i])) return { x, y, by: fb.i, ex: [fb.i, f2.i] }; }
  return null;
}
function peekBack(W, u, dt){ const B = u.peekB; if (!B) return; if ((u.path && u.path.length) || u.kb || u.order && ['move', 'amove', 'attack'].includes(u.order.k)){ u.peekB = null; return; }
  if (W.t < B.t || (u.act && u.act.phase === 'wind')) return; const dx = B.x - u.x, dy = B.y - u.y, dd = Math.hypot(dx, dy); if (dd < 0.03 || W.t > B.t + 1){ u.peekB = null; return; } const s = Math.min(dd, 2.2 * dt); tryMove(W, u, u.x + dx / dd * s, u.y + dy / dd * s); }
function holdFire(W, u, t, jav){
  const fb = firstOnLine(W, u, t, u, knows(W, u));
  let b = fb !== t && fb.side === u.side ? fb : null;
  if (!b){ const f = ffOdds(W, u, t, u.x, u.y, -(jav ? JVu(W, u).wind : u.wind || 0.5), jav); if (f.p > 0.2) b = f.who; }
  if (b && !AI6.includes('peek')){ const pk = peekSpot(W, u, t, jav); if (pk){ const bx = u.peekB ? u.peekB.x : u.x, by = u.peekB ? u.peekB.y : u.y; tryMove(W, u, pk.x, pk.y); u.peekPass = pk.ex ? { ids: pk.ex, t: W.t } : null; u.peekB = { x: bx, y: by, t: W.t + 0.4 + (u.rec || 0.3) }; u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x);   /* v9.9.2 어깨 너머로 몸을 내밂 */
      if (u.peekLog == null || W.t - u.peekLog > 3){ u.peekLog = W.t; L(W, { k: 'peek', a: u.i, b: t.i, c: pk.by, vis: u.side === 0 || !!u.seenBy }); } return false; } }
  if (!b) return false;""")
rep("  act2(W, u, dt); idleFid(W, u, dt, x0, y0);   /* v9.9.0 대기 몸짓 */", "  act2(W, u, dt); idleFid(W, u, dt, x0, y0);   /* v9.9.0 대기 몸짓 */ peekBack(W, u, dt);   /* v9.9.2 빼꼼 뒤 제자리로 */")
rep("module.exports = { protStep,", "module.exports = { peekSpot, protStep,")
rep("function peekBack(W, u, dt){", """// v9.9.2 판단용: 첫 몸이 맞닿은 같은 편이고 어깨 너머가 트이면 그 적이 첫 몸 (오사 위험은 어깨 자리에서 셈)
function firstOnLineP(W, u, t, know){ const f = firstOnLine(W, u, t, u, know); if (f === t || f.side !== u.side || !isFar(u) || AI6.includes('peek')) return f; const pk = peekSpot(W, u, t, false); if (!pk) return f; u._pkT = W.t; u._pkTg = t.i; u._pkX = pk.x; u._pkY = pk.y; u._pkEx = pk.ex || null; return t; }
function peekBack(W, u, dt){""")
rep("function ffOdds(W, u, t, x, y, lead, jav){", "function ffOdds(W, u, t, x, y, lead, jav){\n  if (u._pkT === W.t && u._pkTg === t.i && x === u.x && y === u.y){ x = u._pkX; y = u._pkY; }   /* v9.9.2 빼꼼 자리에서 셈 */")
rep("    const first = firstOnLine(W, u, f, u, know); if (first !== f && (first.side === u.side || blocksFor(W, first, u))) continue;", "    const first = firstOnLineP(W, u, f, know); if (first !== f && (first.side === u.side || blocksFor(W, first, u))) continue;")
rep("  const first = firstOnLine(W, u, t, u, know);\n  const now = ordered", "  const first = firstOnLineP(W, u, t, know);\n  const now = ordered")
rep("      const f = firstOnLine(W, u, t, u, know);\n      if (f !== t){ if (f.side === u.side) ffBlock = f; continue; }", "      const f = firstOnLineP(W, u, t, know);\n      if (f !== t){ if (f.side === u.side) ffBlock = f; continue; }")
rep("        if (!b.alive || b.i === s.a || (s.ev && s.ev.includes(b.i))) continue;   // v6.7 이미 피한 몸은 지나감", "        if (s.pass === undefined){ const sh0 = W.units[s.a]; s.pass = sh0 && sh0.peekPass && W.t - sh0.peekPass.t < 0.15 ? sh0.peekPass.ids : null; }   /* v9.9.2 두 사람 사이로 쏜 탄은 그 둘을 지나감 */\n        if (!b.alive || b.i === s.a || (s.ev && s.ev.includes(b.i)) || (s.pass && s.pass.includes(b.i))) continue;   // v6.7 이미 피한 몸은 지나감")
rep("  const bodies = W.units.filter(b => b.alive && b !== u && (b === t || know(b)));", "  const bodies = W.units.filter(b => b.alive && b !== u && (b === t || know(b)) && !(u._pkEx && u._pkT === W.t && u._pkEx.includes(b.i)));   /* v9.9.2 틈 사격: 이음매의 둘은 뺌 */")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9210 OK')
