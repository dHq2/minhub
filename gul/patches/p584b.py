import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("  const a = fa - 0.85, s = Math.max(7, r * 0.56), cx = x + Math.cos(a) * r * 0.92, cy = y + Math.sin(a) * r * 0.92;",
    "  const a = fa - 0.85, s = Math.max(9, r * 0.72), cx = x + Math.cos(a) * r * 1.0, cy = y + Math.sin(a) * r * 1.0;",'markSize')
rep("      if (u.canGuard && !u.shield) iconShield(px + r * 0.82, py - r * 0.82, is, gOn ? '#7fe3a0' : '#ff8a70', gOn ? 'rgba(110,225,140,.55)' : 'rgba(255,120,95,.15)');",
    "      if (u.canGuard && !u.shield) iconParry(px + r * 0.82, py - r * 0.82, is, gOn ? '#7fe3a0' : '#ff8a70');   // v5.8.4 무구 · 반사신경으로 막기 = 칼날 표시 (방패 표시와 헷갈리지 않게)",'parryIcon')
rep("function iconShield(x, y, s, col, fill){",
"""// v5.8.4 무구로 막기 · 반사신경: 둥근 바탕에 비스듬한 칼날 + 코등이
function iconParry(x, y, s, col){
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(10,8,12,.85)'; ctx.beginPath(); ctx.arc(0, 0, s, 0, 6.283); ctx.fill();
  ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.6, s * 0.22); ctx.beginPath(); ctx.moveTo(-s * 0.5, s * 0.5); ctx.lineTo(s * 0.55, -s * 0.55); ctx.stroke();
  ctx.lineWidth = Math.max(1.2, s * 0.16); ctx.beginPath(); ctx.moveTo(-s * 0.5, s * 0.05); ctx.lineTo(-s * 0.05, s * 0.5); ctx.stroke(); ctx.restore();
}
function iconShield(x, y, s, col, fill){""",'parryFn')
rep("    ctx.strokeStyle = `rgba(${c},${0.45 + 0.4 * q})`; ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(lx, ly, Math.max(5, ts * (0.22 + 0.18 * (1 - q))), 0, 6.283); ctx.stroke(); ctx.setLineDash([]);",
    "    { const rr = Math.max(6, ts * (0.24 + 0.2 * (1 - q))); ctx.fillStyle = `rgba(${c},${0.08 + 0.14 * q})`; ctx.beginPath(); ctx.arc(lx, ly, rr, 0, 6.283); ctx.fill(); ctx.strokeStyle = `rgba(${c},${0.55 + 0.4 * q})`; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);\n      ctx.beginPath(); ctx.moveTo(lx - rr * 0.35, ly); ctx.lineTo(lx + rr * 0.35, ly); ctx.moveTo(lx, ly - rr * 0.35); ctx.lineTo(lx, ly + rr * 0.35); ctx.lineWidth = 1.4; ctx.stroke(); }   // 떨어질 자리 (점선 고리 · 십자)",'ring')
rep("      if (e.arc) return { c: a.side ? 'bad' : 'good', s: a.side ?",
    "      if (e.arc){ const k = 'arc' + e.a; if (narr.seenArc && narr.seenArc[k] != null && Wd.t - narr.seenArc[k] < 8) return null; (narr.seenArc = narr.seenArc || {})[k] = Wd.t; }   // 같은 사수의 곡사는 8초에 한 번만 알림\n      if (e.arc) return { c: a.side ? 'bad' : 'good', s: a.side ?",'throttle')
rep("<span><i class=\"ln\" style=\"color:#7fe3a0\">⛨</i>초록 배지 · 고리 = 확실히 보호받는 중</span>",
    "<span><i class=\"ln\" style=\"color:#7fe3a0\">⛨</i>초록 배지 · 고리 = 확실히 보호받는 중</span><span><i class=\"ln\" style=\"color:#7fe3a0\">／</i>칼날 배지 = 무구 · 반사신경으로 막음 (방패 아님)</span>",'legendParry')
open(P,'w').write(s); print('ok')
