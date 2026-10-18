import sys
p='page10.tpl.html'; s=open(p,encoding='utf-8').read()
for a in ['굴의 전투판 v5.5.2 (', '굴의 전투판 v5.5.2 —', '굴의 전투판 v5.5.2 ·']:
    s=s.replace(a, a.replace('v5.5.2','v5.5.3'))
s=s.replace("'들이받을 적을 누르세요 (Esc 취소)'", "'들이받을 적이나 돌격할 바닥을 누르세요 (Esc 취소)'")
s=s.replace("— 누른 적 앞 돌진 자리에서 기다려요`", "— 그 자리에서 노려보며 기다려요`").replace("— 누른 적에게 다가가 기다려요`", "— 그 자리에서 노려보며 기다려요`")
pairs=[
("""     v5.5.2: 사격 솜씨 [사격X]""", """     v5.5.3: 돌진 명령 = "정한 곳으로 돌격!!" — 1 을 누르고 적이나 바닥을 찍으면 예고 뒤 곧장 달림 (아군 사이는 비집고 나감). 막지 않은 상대는 반드시 휘청 (💫 스턴).
             방패를 든 쪽은 🛡 방패 돌진 — 달리는 동안에도 앞을 막고 더 세게 밀침. 방패가 없으면 달리는 동안 공격에 노출.
     v5.5.2: 사격 솜씨 [사격X]"""),
("""<span class="ver">v5.5.2 · 사격 솜씨""", """<span class="ver">v5.5.3 · 정한 곳으로 돌격 · 사격 솜씨"""),
# 바닥 찍기 = 그 자리로 돌격
("""  if (chargePick){ chargePick = null; toast('돌진을 취소했어요'); hud(); return; }""", """  if (chargePick){ giveChargePt(w.x, w.y); return; }   // v5.5.3 바닥 = 그 자리로 돌격"""),
("""const SWING_NM = { '': '자동', '휘두르기': '넓게', '찍기': '찍기' };""", """// v5.5.3 바닥 자리로 돌격: 찍은 곳까지 곧장 달림 (가는 길에 부딪힌 적은 들이받음), 닿으면 그 자리를 지킴
function giveChargePt(x, y){
  const C = (chargePick || []).map(i => world.units[i]).filter(u => u && u.alive && u.canCharge && !u.crawl); chargePick = null;
  if (!C.length){ hud(); return; }
  if (rock(world.map, x, y)){ toast('바위로는 돌격할 수 없어요'); hud(); return; }
  C.forEach((u, k) => { const a = k * 2.4, rr = k ? 0.7 : 0; u.order = { k: 'charge', x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr }; }); noteOrders(C); toast(`${C.map(u => u.name).join(' · ')} → ${coord(x, y)} 로 돌격!`); hud();
}
const SWING_NM = { '': '자동', '휘두르기': '넓게', '찍기': '찍기' };"""),
("""return chargePick ? '들이받을 적을 누르세요' : '돌진'""", """return chargePick ? '적 · 바닥을 누르세요' : (C.some(u => u.shield) ? '방패 돌진' : '돌진')"""),
# 명령 확인 · 명령표
("""o.k === 'charge' ? [""", """o.k === 'charge' && o.b == null ? ['💨 돌격!', '#8ccaff'] : o.k === 'charge' ? ["""),
("""  if (o[0] === 'charge') return `${Wd.units[o[1]].name}에게 돌진`;""", """  if (o[0] === 'charge') return `${Wd.units[o[1]].name}에게 돌진`;
  if (o[0] === 'chargePt') return `${ro(coord(o[1], o[2]))} 돌격`;"""),
("""u.order && u.order.k === 'charge' ? ['charge', u.order.b] :""", """u.order && u.order.k === 'charge' ? (u.order.b == null ? ['chargePt', u.order.x, u.order.y] : ['charge', u.order.b]) :"""),
# 그리기: 준비선 · 돌격 예고선 · 명령 선
("""      if (u.side === 1 && !u.seenBy && !see) continue;
      const t = Wd.units[u.act.b];
      ctx.strokeStyle = u.act.k === 'heal'""", """      if (u.side === 1 && !u.seenBy && !see) continue;
      const t = Wd.units[u.act.b]; if (!t || u.act.k === 'charge') continue;   // 돌격은 따로 (예고선)
      ctx.strokeStyle = u.act.k === 'heal'"""),
("""      const t = Wd.units[u.act.b]; if (!t) continue;
      const x0 = ox + u.x * ts, y0 = oy + u.y * ts, x1 = ox + t.x * ts, y1 = oy + t.y * ts,""", """      const t = u.act.b != null && Wd.units[u.act.b] && Wd.units[u.act.b].alive ? Wd.units[u.act.b] : u.act.px != null ? { x: u.act.px, y: u.act.py } : null; if (!t) continue;   // v5.5.3 정한 자리로도
      const x0 = ox + u.x * ts, y0 = oy + u.y * ts, x1 = ox + t.x * ts, y1 = oy + t.y * ts,"""),
("""        if (u.order.k === 'throw') ctx.strokeStyle = `rgba(201,168,255,${al})`;   // v5.5.1 투창 명령 = 보라 선""", """        if (u.order.k === 'throw') ctx.strokeStyle = `rgba(201,168,255,${al})`;   // v5.5.1 투창 명령 = 보라 선
        if (u.order.k === 'charge' && u.order.b == null){ const p = { x: ox + u.order.x * ts, y: oy + u.order.y * ts }, a = Math.atan2(p.y - (oy + u.y * ts), p.x - (ox + u.x * ts)); ctx.strokeStyle = `rgba(140,202,255,${Math.max(al, .75)})`;   // v5.5.3 바닥으로 돌격 = 파란 선 + 화살촉
          ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - Math.cos(a - 0.45) * 12, p.y - Math.sin(a - 0.45) * 12); ctx.lineTo(p.x - Math.cos(a + 0.45) * 12, p.y - Math.sin(a + 0.45) * 12); ctx.closePath(); ctx.fill(); ctx.setLineDash([5, 4]); }"""),
("""        if (u.order.k === 'attack' || u.order.k === 'charge' || u.order.k === 'throw'){ const t = Wd.units[u.order.b]; if (t.alive""", """        if ((u.order.k === 'attack' || u.order.k === 'charge' || u.order.k === 'throw') && u.order.b != null){ const t = Wd.units[u.order.b]; if (t.alive"""),
# 준비 띠: 방패 돌진
("""k === 'charge' ? '💨 ' + (u.chargeName || '돌진') + ' 준비'""", """k === 'charge' ? (u.shield ? '🛡 ' : '💨 ') + (u.chargeName || '돌진') + (A.phase === 'run' ? '!' : ' 준비')"""),
("""    if (!ed && u.act && (u.act.phase === 'wind' || u.act.k === 'reload') && ts >= 16){""", """    if (!ed && u.act && (u.act.phase === 'wind' || u.act.k === 'reload' || (u.act.k === 'charge' && u.act.phase === 'run')) && ts >= 16){"""),
# 휘청 표시
("""    if (lying && vis && ts >= 22){""", """    if (!ed && vis && now < (u.stunT || -9) && !lying){ const t = '💫 휘청'; ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width; ctx.fillStyle = 'rgba(60,40,8,.88)'; ctx.fillRect(px - tw / 2 - 3, py - 6, tw + 6, 13); ctx.fillStyle = '#ffd77a'; ctx.fillText(t, px, py + 0.5); }   // v5.5.3 휘청 (스턴)
    if (lying && vis && ts >= 22){"""),
# 자세한 기록
("""      case 'charge': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.name || '돌진'}! "${e.cry || ''}"`); break;""",
 """      case 'charge': out.push(`${T(e)}${n(e.a)} → ${e.b != null ? n(e.b) : coord(e.x, e.y)} ${e.name || '돌진'}! "${e.cry || ''}"${e.shield ? ' (방패를 앞세움 — 달리는 동안에도 막음)' : ' (달리는 동안 못 막음)'}`); break;
      case 'stun': out.push(`${T(e)}💫 ${n(e.b)} 휘청 ${e.sec}초 (못 움직이고 못 치고 못 막음 · ${n(e.a)})`); break;
      case 'squeeze': out.push(`${T(e)}${n(e.a)} 동료 사이를 비집고 나감 (${n(e.b)} 비켜섬)`); break;"""),
("""    case 'charge': if (!(e.vis || U(e.a).side === 0)) return { c: 'dim', s: '어둠 속에서 무언가 달려오는 발소리가 난다!' };""", """    case 'charge': if (!(e.vis || U(e.a).side === 0)) return { c: 'dim', s: '어둠 속에서 무언가 달려오는 발소리가 난다!' };
      if (e.b == null) return { c: U(e.a).side ? 'bad' : 'good', s: `${U(e.a).mute ? ga(n(e.a)) + ' ' + (e.cry || '') : n(e.a) + ': "' + (e.cry || '이야아아!') + '" —'} ${e.shield ? '방패를 앞세우고 ' : ''}정한 곳으로 돌격!` };   // v5.5.3
      if (e.shield) return { c: U(e.a).side ? 'bad' : 'good', s: `${U(e.a).mute ? ga(n(e.a)) + ' ' + (e.cry || '') : n(e.a) + ': "' + (e.cry || '이야아아!') + '" —'} 방패를 앞세우고 ${reul(n(e.b))} 향해 돌진!` };"""),
("""    case 'impact': if (e.clash) return""", """    case 'stun': return { c: U(e.b).side ? 'good' : 'bad', s: `${ga(n(e.b))} 휘청인다!` };   // v5.5.3
    case 'squeeze': return U(e.a).side === 0 || e.vis ? { c: 'dim', s: `${ga(n(e.a))} 동료 사이를 비집고 튀어나간다!` } : null;
    case 'impact': if (e.clash) return"""),
# 설명 칸: 돌진
("""보병 · 탱커 공통 기술 — 전력질주해 들이받음 (무게 × 속력)""", """보병 · 탱커 공통 기술 — 정한 적 · 바닥으로 곧장 전력질주해 들이받음 (무게 × 속력) · 막지 않은 상대는 휘청 (스턴) · 아군 사이는 비집고 나감${u.shield ? ' · 방패 돌진 (달리는 동안에도 앞을 막고 더 세게 밀침)' : ' · 달리는 동안 못 막음 (공격에 노출)'}"""),
# 수치표
("""    ['charge.min', '[돌격 · 돌진]: 가장 가까운 거리 (칸)'],""", """    ['charge.stun', '[돌진]: 막지 않은 상대가 휘청이는 초 (× 무게 비)'], ['charge.maxOrd', '[돌진] 명령: 곧장 뛰는 거리 (칸)'], ['charge.shieldKb', '[방패 돌진]: 밀침 ×'], ['charge.shieldStun', '[방패 돌진]: 휘청 ×'],
    ['charge.min', '[돌격 · 돌진]: 가장 가까운 거리 (칸)'],"""),
("""if (!S.v552){""", """if (!S.v553){ const c = S.rules.charge, d = DEFAULT_RULES.charge; if (c) for (const j in d) if (c[j] === undefined) c[j] = d[j]; S.v553 = true; }   // v5.5.3 돌진 새 수치
if (!S.v552){"""),
]
for o,n in pairs:
    if s.count(o)!=1: print('MISMATCH',s.count(o),o[:120]); sys.exit(1)
for o,n in pairs: s=s.replace(o,n)
open(p,'w',encoding='utf-8').write(s); print('ok')
