s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
rep("""<!-- 굴의 전투판 v4.4 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
""","""<!-- 굴의 전투판 v4.5 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v4.5: 상태 아이콘 — 눈 = 경계 중 (경계 · 살핌 · 지킴 · 위협 · 지켜봄 · 두리번), 방패 = 방어 자세 (초록, 무너지면 붉게) + 막는 방향을 초록 부채꼴로 늘 그림,
           초록 방패 배지 + 초록 고리 = 확실히 보호받는 중 (보이는 위협의 사선이 모두 동료의 방어 자세에 막힘).
           탱커 (방어 자세가 있는 자동 아군): 붙어 싸우는 적이 없으면 아는 위협 쪽 전선으로 나가며 '뒤로!' (말풍선), 다른 자동 동료는 그 뒤로. 오래 맞서면 전선을 조금씩 밀고 나감.
           아군이 너무 노출되면 (사선이 열린 사수 · 노리는 근접, 체력이 낮을수록 더) 그 아군 앞을 막아섬 ('내 뒤로!'). 위협이 없으면 주인공 앞에서 걸음.
           어둠 속에서 누가 맞으면 자동 동료들이 두리번거림 (총성을 들었으면 그쪽). 이어받기 버그 고침 (v4.4 의 옐로 무기 확인이 수치표보다 먼저 돌던 것).
""")
for a,b in [("""<span class="ver">v4.4 · 한 턴씩""","""<span class="ver">v4.5 · 한 턴씩"""),("""  <footer>굴의 전투판 v4.4 — ""","""  <footer>굴의 전투판 v4.5 — """),("""copyText('굴의 전투판 v4.4 자동 판 기록""","""copyText('굴의 전투판 v4.5 자동 판 기록"""),("""  return `굴의 전투판 v4.4 · ${title}""","""  return `굴의 전투판 v4.5 · ${title}""")]: rep(a,b)
# green guard wedge always (stronger when focused), green arc
rep("""      if (vis && (detail() || u.pid === hoverPid || (!ed && sel.has(u.i) && u.side === 0) || (ed && u.pid === selId))){ const strong = u.pid === hoverPid || (!ed && sel.has(u.i) && u.side === 0) || (ed && u.pid === selId), R2 = r + ts * 1.25;
        const g = ctx.createRadialGradient(px, py, r, px, py, R2); g.addColorStop(0, `rgba(233,228,218,${gOn ? (strong ? .32 : .14) : .06})`); g.addColorStop(1, 'rgba(233,228,218,0)');""","""      if (vis){ const strong = u.pid === hoverPid || (!ed && sel.has(u.i) && u.side === 0) || (ed && u.pid === selId), R2 = r + ts * (strong ? 1.35 : 1.0);
        const g = ctx.createRadialGradient(px, py, r, px, py, R2); g.addColorStop(0, gOn ? `rgba(110,225,140,${strong ? .42 : .26})` : 'rgba(255,120,95,.08)'); g.addColorStop(1, gOn ? 'rgba(110,225,140,0)' : 'rgba(255,120,95,0)');""")
rep("""      ctx.strokeStyle = gOn ? '#e9e4da' : 'rgba(255,120,95,.85)'; ctx.lineWidth = Math.max(3, r * 0.2); if (!gOn) ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, r + 1, fa - ga2, fa + ga2); ctx.stroke(); ctx.setLineDash([]); }""","""      ctx.strokeStyle = gOn ? '#7fe3a0' : 'rgba(255,120,95,.85)'; ctx.lineWidth = Math.max(3, r * 0.2); if (!gOn) ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, r + 1, fa - ga2, fa + ga2); ctx.stroke(); ctx.setLineDash([]); }""")
rep("""    ctx.fillStyle = u.canGuard ? (gOn ? '#e9e4da' : '#ff8a70') : SIDEC[u.side]; ctx.strokeStyle = 'rgba(0,0,0,.75)'; ctx.lineWidth = 1.2;""","""    ctx.fillStyle = u.canGuard ? (gOn ? '#7fe3a0' : '#ff8a70') : SIDEC[u.side]; ctx.strokeStyle = 'rgba(0,0,0,.75)'; ctx.lineWidth = 1.2;""")
# icons: after the facing triangle draw (anchor: act ring)
rep("""    if (!ed && u.act){ const a = u.act, span =""","""    // 상태 아이콘: 눈 (경계 중) · 방패 (방어 자세) · 초록 방패 배지 (보호받는 중)
    if (!ed && vis){ const is = Math.max(6, Math.min(11, r * 0.36));
      if (WATCH.has(u.mood) && !u.act) iconEye(px - r * 0.82, py - r * 0.82, is, u.side ? '#ffb8a8' : '#bfe0ff');
      if (u.canGuard) iconShield(px + r * 0.82, py - r * 0.82, is, gOn ? '#7fe3a0' : '#ff8a70', gOn ? 'rgba(110,225,140,.55)' : 'rgba(255,120,95,.15)');
      const pg = protectedBy(Wd, u, see);
      if (pg){ ctx.strokeStyle = 'rgba(110,225,140,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, r + 3, 0, 6.283); ctx.stroke(); iconShield(px - r * 0.82, py + r * 0.82, is, '#d8ffe4', 'rgba(70,190,110,.95)'); }
    }
    if (!ed && u.act){ const a = u.act, span =""")
rep("""function drawRange(u, ox, oy, ts, k){""","""// 눈 · 방패 아이콘 (작은 어두운 원 위)
const WATCH = new Set(['경계', '살핌', '지킴', '위협', '숨어 지켜봄', '두리번', '전선']);
function iconEye(x, y, s, col){
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(10,8,12,.85)'; ctx.beginPath(); ctx.arc(0, 0, s, 0, 6.283); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-s * 0.72, 0); ctx.quadraticCurveTo(0, -s * 0.8, s * 0.72, 0); ctx.quadraticCurveTo(0, s * 0.8, -s * 0.72, 0); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, s * 0.26, 0, 6.283); ctx.fill(); ctx.restore();
}
function iconShield(x, y, s, col, fill){
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(10,8,12,.85)'; ctx.beginPath(); ctx.arc(0, 0, s, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -s * 0.72); ctx.lineTo(s * 0.6, -s * 0.45); ctx.lineTo(s * 0.5, s * 0.25); ctx.lineTo(0, s * 0.74); ctx.lineTo(-s * 0.5, s * 0.25); ctx.lineTo(-s * 0.6, -s * 0.45); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.3; ctx.stroke(); ctx.restore();
}
// 확실히 보호받는 중: 플레이어가 아는 위협 (사거리 안 사수 · 2.5칸 안 근접) 이 하나 이상 있고, 그 사선이 모두 같은 편 방어 자세 (막는 방향 안) 에 먼저 걸림 → 그 방어자
function protectedBy(Wd, u, see){
  if (!u.alive) return null;
  const th = Wd.units.filter(f => f.alive && f.side !== u.side && (f.side === 0 || f.seenBy || see) && (isFar(f) ? gap(f, u) <= f.rng + 0.5 && losClear(Wd.map, f.x, f.y, u.x, u.y) : gap(f, u) <= 2.5));
  if (!th.length) return null;
  let g0 = null;
  for (const f of th){ const g = firstOnLine(Wd, f, u, f); if (g === u || g.side !== u.side || !inGuard(Wd, g, f)) return null; g0 = g; }
  return g0;
}
function drawRange(u, ox, oy, ts, k){""")
# speech bubble fx
rep("""    } else if (f.k === 'spark' && age < 0.25){""","""    } else if (f.k === 'say' && age < 1.6){
      const a = Wd.units[f.a]; if (!a.alive && age > 0.3) continue; const p = { x: ox + a.x * ts, y: oy + a.y * ts - a.r * ts - 26 };
      ctx.globalAlpha = Math.min(1, 2.2 * (1 - age / 1.6)); ctx.font = '800 13px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tw = ctx.measureText(f.s).width + 14; ctx.fillStyle = 'rgba(245,240,228,.95)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(p.x - tw / 2, p.y - 11, tw, 22, 8) : ctx.rect(p.x - tw / 2, p.y - 11, tw, 22); ctx.fill();
      ctx.beginPath(); ctx.moveTo(p.x - 5, p.y + 10); ctx.lineTo(p.x, p.y + 17); ctx.lineTo(p.x + 5, p.y + 10); ctx.fill();
      ctx.fillStyle = '#1b2a1f'; ctx.fillText(f.s, p.x, p.y + 0.5); ctx.globalAlpha = 1;
    } else if (f.k === 'spark' && age < 0.25){""")
# log + narration
rep("""      case 'order': out.push(""","""      case 'shout': out.push(`${T(e)}${n(e.a)}: "${e.s}" (${e.s === '뒤로!' ? '전선으로 나서며 동료를 뒤로' : '노출된 동료 앞을 막아섬'})`); break;
      case 'order': out.push(""")
rep("""    case 'quad': return""","""    case 'shout': return { c: 'good', s: `${n(e.a)}: "${e.s}"` };
    case 'quad': return""")
rep("""'약 받는 중': '약 받는 중', '자리로': '자리로' };""","""'약 받는 중': '약 받는 중', '자리로': '자리로', '전선': '전선', '보호': '보호', '탱커 뒤': '방패 뒤', '두리번': '두리번' };""")
# ally moods narration (protect)
rep("""'응급': { c: 'good', s: `${ga(a)} 양동이를 들고 ${b}에게 달려간다!` },""","""'응급': { c: 'good', s: `${ga(a)} 양동이를 들고 ${b}에게 달려간다!` }, '보호': { c: 'good', s: `${ga(a)} ${b} 앞을 막아선다.` }, '두리번': { c: 'dim', s: `${ga(a)} 어둠 속을 두리번거린다.` },""")
# legend1 update
rep("""<span><i class="lg"></i>흰 호 = 막는 방향</span>""","""<span><i class="ln" style="color:#bfe0ff">👁</i>눈 = 경계 중</span><span><i class="lg" style="background:radial-gradient(circle at 0 50%,rgba(110,225,140,.8),rgba(110,225,140,0) 80%)"></i>방패 · 초록 부채꼴 = 막는 중 · 막는 방향</span><span><i class="ln" style="color:#7fe3a0">⛨</i>초록 배지 · 고리 = 확실히 보호받는 중</span>""")
# tooltip: protection line
rep("""    ${u.torch && !ed ? `<span class="tr"><span class="lb">횃불</span>""","""    ${!ed && protectedBy(Wd, u, see) ? `<span class="tr" style="color:#9fe8b5"><span class="lb">보호</span> ${esc(protectedBy(Wd, u, see).name)}의 방어 뒤 — 보이는 위협의 사선이 모두 막힘</span>` : ''}
    ${u.torch && !ed ? `<span class="tr"><span class="lb">횃불</span>""")
open('page10.tpl.html','w').write(s)
print('ok')
