# v7.24.3 엔진 — patch7243.py v1.2 (v1.2: 사수는 전열 양 끝 뒤 비스듬히 (사선이 트임) · 치유는 가운데 뒤 · v1.1: 전열이 아직 안 섰으면 전열 참여 중인 근접 동료 뒤로 · 치유는 전열 마디가 되지 않음 · 전열 지원: 사수 · 치유 (지원 역할) 가 전열 참여 명령을 받으면 가장 가까운 내 전열 뒤 제 자리 (가운데 뒤 1.7M · 지원끼리 옆으로 1.3M 씩) 를 계속 지키며 따라다님 —
#   자리에 서면 제자리처럼 쏘고 (사선 · 오사 판단 그대로) 치료함. 전열이 없어지면 자동으로. 그림용으로 따라가는 전열의 가운데 (supAt) 를 적어 둠)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
FS = {k: open(D + k + '_v7242.js', encoding='utf-8').read() for k in ('rt3_head', 'rt3_mid', 'rt3_tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in FS.values())
    assert n == c, (n, c, a[:100])
    for k in FS:
        FS[k] = FS[k].replace(a, b)

rep("""function joinStep(W, u, dt){
  if (isFar(u)){
    const ln = (W.lines || []).filter(l => l.side === u.side).sort((a, b) => dist(u, centroid(a.ids.map(i => W.units[i]))) - dist(u, centroid(b.ids.map(i => W.units[i]))))[0];
    if (ln){ const c = centroid(ln.ids.map(i => W.units[i])), x = c.x - Math.cos(ln.face) * 1.7, y = c.y - Math.sin(ln.face) * 1.7; const p = freeSpot(W, x, y, u.r) || { x, y }; u.order = { k: 'move', x: p.x, y: p.y }; return; }
    u.order = null; return;
  }""", """// v7.24.3 전열 지원 (사수 · 치유): 가까운 내 전열 · 그 전열을 따르는 지원 역할 순서 · 제 자리 (가운데 뒤 back M · 옆으로 gap M 씩)
const isSup = u => isFar(u) || u.cls === '치유';
const nearLine = (W, u) => (W.lines || []).filter(l => l.side === u.side && l.ids.some(i => W.units[i] && W.units[i].alive)).sort((a, b) => dist(u, centroid(a.ids.map(i => W.units[i]).filter(x => x && x.alive))) - dist(u, centroid(b.ids.map(i => W.units[i]).filter(x => x && x.alive))))[0] || null;
function supSlot(W, u, ln){   // 사수: 전열 양 끝 뒤 비스듬히 (사선이 트임 · 번갈아 왼쪽 · 오른쪽 · 더 있으면 한 줄 뒤) · 치유: 가운데 뒤 (옆으로 1.3M 씩)
  const M = ln.ids.map(i => W.units[i]).filter(x => x && x.alive), c = centroid(M), fx = Math.cos(ln.face), fy = Math.sin(ln.face), px = -fy, py = fx;
  const S2 = W.units.filter(f => f.alive && f.side === u.side && f.order && f.order.k === 'line' && f.order.join && isSup(f) && isFar(f) === isFar(u) && nearLine(W, f) === ln).sort((a, b) => a.i - b.i), j = Math.max(0, S2.indexOf(u));
  let x, y;
  if (isFar(u)){ const side = j % 2 ? -1 : 1, tier = Math.floor(j / 2), pr = m => (m.x - c.x) * px + (m.y - c.y) * py, end = M.slice().sort((a, b) => side * (pr(b) - pr(a)))[0], back = 0.9 + tier * 1.2;
    x = end.x - fx * back + px * side * (end.r + u.r + 0.45); y = end.y - fy * back + py * side * (end.r + u.r + 0.45); }
  else { const back = 1.7 + (M.length > 4 ? 0.3 : 0), off = j === 0 ? 0 : (j % 2 ? 1 : -1) * Math.ceil(j / 2) * 1.3; x = c.x - fx * back + px * off; y = c.y - fy * back + py * off; }
  return { c, p: freeSpot(W, x, y, u.r) || { x, y } };
}
function joinStep(W, u, dt){
  if (isSup(u)){   /* v7.24.3 지원: 전열 뒤 제 자리를 계속 지키며 따라다님 → 자리에 서면 제자리처럼 쏘고 치료함 ('hold' 를 돌려줌) */
    const ln = nearLine(W, u); u.order.sup = true; let c, p, face;
    if (ln){ ({ c, p } = supSlot(W, u, ln)); face = ln.face; }
    else { const mates = W.units.filter(f => f.alive && f.side === u.side && f.order && f.order.k === 'line' && f.order.join && !isSup(f));   // 전열이 아직 안 섰으면 전열 참여 중인 근접 동료 뒤로
      if (!mates.length){ u.order = null; u.supAt = null; return; }
      c = centroid(mates); const e = lineFoes(W, u).sort((a, b) => dist(c, a) - dist(c, b))[0]; face = e ? Math.atan2(e.y - c.y, e.x - c.x) : (mates[0].face || 0); const x = c.x - Math.cos(face) * 1.7, y = c.y - Math.sin(face) * 1.7; p = freeSpot(W, x, y, u.r) || { x, y }; }
    u.supAt = { x: +c.x.toFixed(2), y: +c.y.toFixed(2) };
    if (Math.hypot(p.x - u.x, p.y - u.y) > 0.55){ setMood(W, u, '전열 뒤로'); goTo(W, u, p.x, p.y, dt); return; }
    stop(u); u.fg = face; return 'hold';
  }""")
rep("  if (o.k === 'line' && o.join){ joinStep(W, u, dt); return; }   // v5.9.3 전열 참여\n  if (o.k === 'line'){",
    "  if (o.k === 'line' && o.join){ if (joinStep(W, u, dt) !== 'hold') return; }   // v5.9.3 전열 참여   /* v7.24.3 지원은 자리에서 제자리처럼 */\n  if (o.k === 'line' && !o.join){")
rep("  if (o.k === 'hold' || o.k === 'watch'){   // v7.7 사주경계", "  if (o.k === 'hold' || o.k === 'watch' || (o.k === 'line' && o.join)){   // v7.7 사주경계   /* v7.24.3 전열 지원 (자리에 섬) */")
rep("&& !(u.act && u.act.k === 'charge' && u.act.phase === 'run') && !lineWhyOut(W, u, !!u.lineJ));   // v5.9.3 후퇴 · 등을 돌린 쪽은 마디가 아님",
    "&& !(u.act && u.act.k === 'charge' && u.act.phase === 'run') && !lineWhyOut(W, u, !!u.lineJ) && !(u.cls === '치유' && u.order && u.order.k === 'line' && u.order.join));   // v5.9.3 후퇴 · 등을 돌린 쪽은 마디가 아님   /* v7.24.3 전열 지원 치유는 마디가 아님 */")
rep("module.exports = { mightReady,", "module.exports = { supSlot, nearLine, isSup, mightReady,")
for k, v in FS.items():
    open(D + k + '.js', 'w', encoding='utf-8').write(v)
print('ok')
