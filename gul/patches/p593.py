import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.9.2 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.9.3 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.9.3: 전열 다듬기.
             · 전열은 스스로 생김 (보병끼리 나란히 · 같은 쪽 · 적을 봄). 마디 바로 뒤의 근접 (창 2열 · 뒤로 밀린 쪽) 은 '뒷줄' 로 전열에 포함 — 판에 점선으로 이어 보임 ·
               돌격을 버티는 무게에 셈 · 쓰러진 마디 자리를 먼저 메움. 다른 마디 바로 뒤에 선 쪽은 대각선으로 닿아도 마디가 아니라 뒷줄.
             · 후퇴 = 전열 붕괴: 뒤쪽으로 가는 이동 명령 · 뒤로 걷는 속력 (0.35칸/초 넘게) 이면 그 마디는 빠짐 ('레베카 후퇴 — 전열에서 빠짐').
               가까운 적에게 등을 돌려도 빠짐 ('등을 돌림'). 이어져 있던 마디는 조금 더 버팀 (멈칫한 것은 후퇴가 아님).
             · 전열 명령 = 전열에 참여: 명령받은 인물만 — 가까운 우리 전열 끝 (없으면 가까운 근접 동료 옆에 새 전열) 에 붙어 자리를 지킴 (손 닿는 앞의 상대만 · 쫓거나 협공하러 떠나지 않음 · 옆 · 뒤에서 오면 돌아서 막음).
               창은 마디 뒤 2열 (전열이 없으면 가까운 보병 뒤), 사수는 전열 가운데 뒤에 섬. 모두에게 새 전열을 만들게 하던 것은 없앰.
             · 꾹 누름 부채의 ▬ 전열은 고르면 바로 (대상 탭 없음).
""",'notes')
rep('<span class="ver">v5.9.2 · 부채에 ▬ 전열','<span class="ver">v5.9.3 · 전열 = 참여 명령 · 후퇴하면 빠짐 · 뒷줄 · v5.9.2 · 부채에 ▬ 전열','ver')
rep("<footer>굴의 전투판 v5.9.2","<footer>굴의 전투판 v5.9.3",'footer')
rep("return `굴의 전투판 v5.9.2 · ${title}","return `굴의 전투판 v5.9.3 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.9.2\";","body.mob .top h1::after{content:\" v5.9.3\";",'mobver')
# 전열 명령 = 참여 (명령받은 인물만)
i = s.index("function giveLine(L, at, faceTo){"); j = s.index("\n}\n", i) + 3
s = s[:i] + """function giveLine(L){   // v5.9.3 전열 참여: 명령받은 인물만 — 가까운 전열 끝 (창은 뒷줄 · 사수는 전열 뒤), 없으면 가까운 근접 동료 옆에 새 전열
  const C = L.filter(u => u.alive && !u.crawl); if (!C.length) return false;
  C.forEach(u => { u.order = { k: 'line', join: true }; });
  noteOrders(C); hud();
  toast(`${C.map(u => u.name).join(' · ')} 전열 참여 — 가까운 전열에 붙어 자리를 지킴${C.some(u => !isFar(u) && u.rng >= 0.9) ? ' · 창은 뒷줄' : ''}${C.some(isFar) ? ' · 사수는 전열 뒤' : ''}`);
  return true;
}
""" + s[j:]
rep("  if (k === 'pickSpear'){ ordKey('pick'); hud(); return; }",
    "  if (k === 'pickSpear'){ ordKey('pick'); hud(); return; }\n  if (k === 'line'){ giveLine(C); hud(); return; }   // v5.9.3 전열 참여 (바로)",'fanUse')
rep("  if (Wd.units.filter(u => u.alive && u.side === 0 && !isFar(u) && !u.crawl).length >= 2) out.push({ k: 'line', ic: '▬', nm: '전열' });   // v5.9.2",
    "  out.push({ k: 'line', ic: '▬', nm: '전열' });   // v5.9.3 전열 참여 (바로)",'fanItem')
rep("(아군을 꾹 = 그 아군 기술 · 인물을 꾹 = ⓘ 상세도 · ▬ 전열 = 바닥 탭 그 자리 / 적 탭 그 적을 봄).",
    "(아군을 꾹 = 그 아군 기술 · 인물을 꾹 = ⓘ 상세도 · ▬ 전열 = 가까운 전열에 참여).",'mobkeys')
# 명령 이름
rep("  if (o[0] === 'line') return '전열';", "  if (o[0] === 'line') return '전열';\n  if (o[0] === 'lineJoin') return '전열 참여';",'label')
rep("const ordOf = u => u.order && u.order.k === 'line' ? ['line', u.order.x, u.order.y] :",
    "const ordOf = u => u.order && u.order.k === 'line' && u.order.join ? ['lineJoin'] : u.order && u.order.k === 'line' ? ['line', u.order.x, u.order.y] :",'ordOf')
rep("  const KN = { move: '이동', amove: '공격 이동',", "  const KN = { lineJoin: '전열 참여', move: '이동', amove: '공격 이동',",'KN')
rep("    : o.k === 'leap' ? ['↩ 도약', '#8ccaff'] :", "    : o.k === 'leap' ? ['↩ 도약', '#8ccaff'] : o.k === 'line' && o.join ? ['▬ 전열 참여', '#9fd0ff'] :",'ack')
# 기록 · 서술: 까닭
rep("      case 'lineLeave': out.push(`${T(e)}▬ ${n(e.a)} 전열 이탈 — 틈 (${e.n}마디였음)`); break;",
    "      case 'lineLeave': out.push(`${T(e)}▬ ${n(e.a)} ${e.how === '후퇴' ? '후퇴 — 전열에서 빠짐' : e.how === '등을 돌림' ? '적에게 등을 돌림 — 전열에서 빠짐' : e.how === '뒷줄로' ? '뒷줄로 물러남' : '전열 이탈'} — 틈 (${e.n}마디였음)`); break;   // v5.9.3 까닭",'leaveLog')
rep("      case 'lineBreak': out.push(`${T(e)}▬ ${e.side ? '적 ' : ''}전열이 흩어짐: ${e.ids.map(n).join(' · ')}`); break;",
    "      case 'lineBreak': out.push(`${T(e)}▬ ${e.side ? '적 ' : ''}전열이 ${e.how === '후퇴' ? '후퇴로 무너짐' : '흩어짐'}: ${e.ids.map(n).join(' · ')}${e.how && e.how !== '후퇴' ? ' (' + e.how + ')' : ''}`); break;",'breakLog')
rep("    case 'lineLeave': return U(e.a).side === 0 ? { c: 'dim', s: `${ga(n(e.a))} 전열을 벗어난다 — 틈이 생겼다.` }",
    "    case 'lineLeave': return U(e.a).side === 0 ? { c: 'dim', s: e.how === '후퇴' ? `${ga(n(e.a))} 물러난다 — 전열에 틈이 생겼다.` : e.how === '등을 돌림' ? `${ga(n(e.a))} 적에게 등을 보인다 — 전열에 틈이 생겼다.` : `${ga(n(e.a))} 전열을 벗어난다 — 틈이 생겼다.` }",'leaveNarr')
# 뒷줄 그리기
rep("  for (const ln of Wd.lines || []){\n    const M = ln.ids.map(i => Wd.units[i]).filter(u => u && u.alive);\n    if (M.length < 2 || (ln.side === 1 && !see && !M.some(u => u.seenBy))) continue;\n    const fx = Math.cos(ln.face), fy = Math.sin(ln.face), col = ln.side ? '255,130,100' : '140,200,255';",
    """  for (const ln of Wd.lines || []){
    const M = ln.ids.map(i => Wd.units[i]).filter(u => u && u.alive);
    if (M.length < 2 || (ln.side === 1 && !see && !M.some(u => u.seenBy))) continue;
    const fx = Math.cos(ln.face), fy = Math.sin(ln.face), col = ln.side ? '255,130,100' : '140,200,255';
    for (const r of ln.rear || []){ const a = Wd.units[r.i], j = Wd.units[r.j]; if (!a || !j || !a.alive || !j.alive) continue;   // v5.9.3 뒷줄: 마디와 점선으로 이음
      ctx.strokeStyle = `rgba(${col},.75)`; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ox + a.x * ts, oy + a.y * ts); ctx.lineTo(ox + j.x * ts, oy + j.y * ts); ctx.stroke(); ctx.setLineDash([]);
      if (ts >= 26){ const t = '2열', x = ox + a.x * ts - fx * (a.r * ts + 9), y = oy + a.y * ts - fy * (a.r * ts + 9); ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width; ctx.fillStyle = 'rgba(10,8,12,.8)'; ctx.fillRect(x - tw / 2 - 3, y - 6, tw + 6, 12); ctx.fillStyle = `rgb(${col})`; ctx.fillText(t, x, y + 0.5); } }""",'drawRear')
open(P,'w').write(s); print('ok')
