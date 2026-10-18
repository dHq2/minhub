import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("""               (방패를 든 인물은 방패를 주우러 갈 수 없음 — 명령 · 자동 모두 막힘. 줍기 전 방패가 사라졌다면 그 앞에 '방패 떨어뜨림 (팔을 잃어 · 쓰러지며)' 이 남음)
""","""               (방패를 든 인물은 방패를 주우러 갈 수 없음 — 명령 · 자동 모두 막힘. 줍기 전 방패가 사라졌다면 그 앞에 '방패 떨어뜨림 (팔을 잃어 · 쓰러지며)' 이 남음)
             · 사선 표시: 사수 (총 · 활 · 창을 든 투창) 를 고르면 노리는 적 (커서를 올린 적 · 명령한 적 · 겨눈 적) 까지 선 — 초록 열림 · 노랑 오사 위험 · 빨강 동료가 가림 (그 동료에 고리) ·
               주황 적의 방패 · 앞의 적이 먼저 맞음 · 회색 사거리 밖 · 바위. 곡사가 되면 점선 포물선. 유저 지휘 로그에도 명령 순간의 사선 상태를 남김.
             · 로그 가독성: 기분 줄을 '행동한 이 [기분] → 대상' 으로, 공격 · 투창 준비 줄에 든 무기를 적음 (장비와 행동을 바로 맞춰 볼 수 있게).
""",'notes')
# 기분 줄 화살표 · 준비 줄 무기
rep("      case 'mood': out.push(`${T(e)}${n(e.a)} [${e.m}]${e.b != null && e.b !== e.a ? ' ' + n(e.b) : ''}",
    "      case 'mood': out.push(`${T(e)}${n(e.a)} [${e.m}]${e.b != null && e.b !== e.a ? ' → ' + n(e.b) : ''}",'mood')
rep("        out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.heal ? '치유' : '공격'} 준비 (",
    "        out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.heal ? '치유' : '공격'} 준비${!e.heal && e.w ? ' [' + e.w + ']' : ''} (",'windW')
rep("      case 'wind': if (e.jav){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 투창 조준 (",
    "      case 'wind': if (e.jav){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 투창 조준${e.w ? ' [' + e.w + ']' : ''} (",'windJ')
# 사선 판단 (그림 · 로그 공용)
rep("// v5.8.8 유저 지휘 기록:",
"""// v5.8.9 사선: 사수 (총 · 활) · 창을 든 투창 → 적. 열림 · 오사 위험 · 동료가 가림 · 적의 방패 · 앞의 적 · 사거리 밖 · 바위 (+ 곡사가 되나)
function fireInfo(Wd, u, t){
  const far = isFar(u), rng = far ? u.rng : JV(Wd).rng, g = gap(u, t), know = knows(Wd, u), p = far ? aimP(Wd, u, t) : aimJ(Wd, u, t), pc = Math.round(p * 100);
  if (g > rng + 0.3) return { c: 'out', s: `사거리 밖 (${g.toFixed(1)} / ${rng}칸)` };
  if (!losClear(Wd.map, u.x, u.y, t.x, t.y)) return { c: 'rock', s: '바위에 가림' };
  const f = firstOnLine(Wd, u, t, u, know), lobOk = far && arcOK(Wd, u, t) && arcRisk(Wd, u, t).p <= 0.25, lob = lobOk ? `곡사 가능 · 명중 ${Math.round(arcAim(Wd, u, t) * 100)}%` : null;
  if (f !== t && f.side === u.side) return { c: 'ally', s: `${ga(f.name)} 사선을 가림`, by: f, lob };
  if (f !== t && inGuard(Wd, f, u, true)) return { c: 'guard', s: `${f.name}의 방어에 막힘`, by: f, lob };
  if (f !== t) return { c: 'enemy', s: `앞의 ${ga(f.name)} 먼저 맞음`, by: f, lob };
  const ff = ffOdds(Wd, u, t, u.x, u.y, 0, !far).p;
  if (ff > 0.03) return { c: 'risk', s: `오사 위험 ${Math.round(ff * 100)}% · 명중 ${pc}%`, p };
  return { c: 'clear', s: `사선 열림 · 명중 ${pc}%`, p };
}
const FIRE_C = { clear: '#7fe3a0', risk: '#ffd166', ally: '#ff6b57', guard: '#ffb347', enemy: '#ffb347', out: '#9a948a', rock: '#9a948a' };
function drawFireLines(Wd, ox, oy, ts, see){
  for (const u of selUnits(Wd)){
    if (!u.alive || !(isFar(u) || (u.jav && u.spearHeld))) continue;
    const hv = hoverPid != null ? Wd.units.find(x => x.pid === hoverPid && x.side !== u.side && x.alive) : null;
    const t = hv || (u.order && u.order.b != null && Wd.units[u.order.b]) || (u.act && u.act.b != null && Wd.units[u.act.b]) || (u.target && u.target.alive ? u.target : null);
    if (!t || !t.alive || t.side === u.side || !(t.seenBy || see)) continue;
    const F = fireInfo(Wd, u, t), col = FIRE_C[F.c], d = dist(u, t) || 1, ux = (t.x - u.x) / d, uy = (t.y - u.y) / d;
    const x0 = ox + (u.x + ux * u.r) * ts, y0 = oy + (u.y + uy * u.r) * ts, x1 = ox + (t.x - ux * t.r) * ts, y1 = oy + (t.y - uy * t.r) * ts;
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(8,6,10,.7)'; ctx.lineWidth = 5; ctx.setLineDash(F.c === 'out' || F.c === 'rock' ? [6, 5] : []); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([]);
    if (F.by){ const bx = ox + F.by.x * ts, by = oy + F.by.y * ts; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bx, by, F.by.r * ts + 5, 0, 6.283); ctx.stroke(); }
    if (F.lob){ const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - Math.max(18, d * ts * 0.32); ctx.strokeStyle = 'rgba(160,215,255,.9)'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke(); ctx.setLineDash([]); }
    const tx = (x0 + x1) / 2, ty = (y0 + y1) / 2 - 12, txt = F.s + (F.lob ? ' → ' + F.lob : '');
    ctx.font = '600 11px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(txt).width;
    ctx.fillStyle = 'rgba(10,8,12,.86)'; ctx.fillRect(tx - tw / 2 - 5, ty - 8, tw + 10, 16); ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.strokeRect(tx - tw / 2 - 5, ty - 8, tw + 10, 16); ctx.fillStyle = col; ctx.fillText(txt, tx, ty + 0.5);
    ctx.restore();
  }
}
// v5.8.8 유저 지휘 기록:""",'fire')
rep("  // v5.8.4 방패 표시: 전열 곡선 위에",
    "  if (!ed) drawFireLines(Wd, ox, oy, ts, see);   // v5.8.9 사선 표시 (고른 사수)\n  // v5.8.4 방패 표시: 전열 곡선 위에",'drawCall')
# 유저 지휘 상황: 사수의 공격 · 투창 명령이면 그 순간 사선
rep("      if (o.k === 'charge'){ q.push(g < (C.min || 1.5)",
    "      if ((o.k === 'attack' && isFar(u)) || o.k === 'throw'){ const F = fireInfo(Wd, u, t); q.push('사선: ' + F.s + (F.lob ? ' → ' + F.lob : '')); }   // v5.8.9\n      if (o.k === 'charge'){ q.push(g < (C.min || 1.5)",'ctxFire')
# 범례
rep("<span><i class=\"ln\" style=\"color:#ffb27a\">◌</i>점선 고리 = 곡사 화살이 떨어질 자리</span>",
    "<span><i class=\"ln\" style=\"color:#ffb27a\">◌</i>점선 고리 = 곡사 화살이 떨어질 자리</span><span><i class=\"ln\" style=\"color:#7fe3a0\">━</i>사선 (사수를 고르면): 초록 열림 · 노랑 오사 위험 · 빨강 동료가 가림 · 주황 방패 · 앞의 적 · 회색 사거리 밖 · 점선 포물선 = 곡사 가능</span>",'legend')
open(P,'w').write(s); print('ok')
