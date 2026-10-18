s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
# version
rep("""<!-- 굴의 전투판 v4.2 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
""","""<!-- 굴의 전투판 v4.3 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v4.3: 보기를 둘로: '간단' (기본) = 얼굴 · 체력 · 바라보는 방향 · 막는 호 · 적의 기분 · 공격 준비선 · 명령 · 소리 · 냄새만.
           고른 아군 · 커서를 올린 인물만 시선 부채꼴 · 공격 범위 · 막는 부채꼴을 그림. '자세히 보기' 를 켜면 모두 (맞붙은 칸 · 협공 칸 · 노림 화살 포함).
           범례는 지금 보이는 것만, 긴 설명은 접어 둠.
           명령이 끝나면 자동: 이동은 도착한 자리를 지키며 스스로 판단 (4칸 안의 적과 싸우고, 없으면 그 자리로 돌아와 살핌). 공격 대상이 쓰러져도 자동.
           '자동' 단추 = 자리를 풀고 주인공을 따라감. 지키는 자리는 작은 마름모로 표시.
           투사체: 원거리 공격은 쏘는 순간 그쪽으로 날아가는 탄 · 화살 (따라가지 않음). 빗나가면 몸 옆으로 지나가 뒤 · 옆의 다른 몸 (아군도) 에 맞을 수 있음.
           탄속 (칸/초): 저격총 80 · 총 60 · 샷건 45 · 활 16 · 마법 12 — 화살 · 마법은 보고 피할 수 있음.
""")
rep("""<span class="ver">v4.2 · 한 턴씩 · 사선 · 감각 · expert 적 · 기술 · 도감 2026-10-10 기준</span>""","""<span class="ver">v4.3 · 한 턴씩 · 사선 · 감각 · expert 적 · 기술 · 투사체 · 도감 2026-10-10 기준</span>""")
rep("""  <footer>굴의 전투판 v4.2 — ""","""  <footer>굴의 전투판 v4.3 — """)
rep("""copyText('굴의 전투판 v4.2 자동 판 기록""","""copyText('굴의 전투판 v4.3 자동 판 기록""")
rep("""  return `굴의 전투판 v4.2 · ${title}""","""  return `굴의 전투판 v4.3 · ${title}""")
# controls
rep("""          <label class="ck" for="sightAll"><input id="sightAll" type="checkbox" checked> 시선</label>
          <label class="ck" for="rangeAll"><input id="rangeAll" type="checkbox" checked> 공격 범위</label>""","""          <label class="ck" for="detailAll" title="끄면 고른 아군 · 커서를 올린 인물만 시선 · 공격 범위를 그려요"><input id="detailAll" type="checkbox"> 자세히 보기</label>""")
rep("""const W_ = () => mode === 'edit' ? preview : world;""","""const W_ = () => mode === 'edit' ? preview : world;
const detail = () => $('detailAll').checked;   // 자세히 보기: 모두의 시선 · 범위 · 칸 구분 · 노림 화살""")
rep("""  if (!ed && mode === 'plan' && !Wd.over) drawTactics(Wd, ox, oy, ts, see);""","""  if (!ed && mode === 'plan' && !Wd.over && detail()) drawTactics(Wd, ox, oy, ts, see);""")
rep("""  { const all = $('rangeAll').checked, done = new Set();""","""  { const all = detail(), done = new Set();""")
rep("""  if (!ed) drawLinks(Wd, ox, oy, ts, see);""","""  if (!ed && detail()) drawLinks(Wd, ox, oy, ts, see);""")
rep("""    if ($('sightAll').checked && !ed){
      const fa0 = u.face || 0, F = Wd.rules.frontArc * Math.PI / 180, Sd = (180 - Wd.rules.frontArc) * Math.PI / 180, strong = u.pid === hoverPid || (sel.has(u.i) && u.side === 0),""","""    const picked0 = !ed && sel.has(u.i) && u.side === 0, hov0 = u.pid === hoverPid;
    if (!ed && (detail() || hov0 || picked0)){
      const fa0 = u.face || 0, F = Wd.rules.frontArc * Math.PI / 180, Sd = (180 - Wd.rules.frontArc) * Math.PI / 180, strong = hov0 || (picked0 && sel.size === 1),""")
rep("""      if (vis){ const strong = u.pid === hoverPid || (!ed && sel.has(u.i) && u.side === 0) || (ed && u.pid === selId), R2 = r + ts * 1.25;""","""      if (vis && (detail() || u.pid === hoverPid || (!ed && sel.has(u.i) && u.side === 0) || (ed && u.pid === selId))){ const strong = u.pid === hoverPid || (!ed && sel.has(u.i) && u.side === 0) || (ed && u.pid === selId), R2 = r + ts * 1.25;""")
rep("""      if (!ed && ts >= 30 && u.mood && !u.act && MOOD_TAG[u.mood]){""","""      if (!ed && ts >= 30 && u.mood && !u.act && MOOD_TAG[u.mood] && (detail() || u.side === 1 || u.pid === hoverPid || sel.has(u.i))){""")
# legends
rep("""        <div class="legend2" id="legend2" hidden><span><i class="lc"></i>맞붙은 칸</span>""","""        <div class="legend2" id="legend1" hidden><span><i class="ln" style="color:#ffb347">◔</i>주황 고리 = 공격 준비</span><span><i class="lg"></i>흰 호 = 막는 방향</span><span><i class="lb2"></i>보라 = 냄새로 안 적 (대략)</span><span><i class="ln">!</i>총성 · 멍!</span><span><i class="ln" style="color:#9fd2ff">◇</i>지키는 자리</span><span style="color:#b8b0a6">커서를 올리거나 고르면 시선 · 공격 범위</span></div>
        <div class="legend2" id="legend2" hidden><span><i class="lc"></i>맞붙은 칸</span>""")
rep("""  $('legend2').hidden = ed || Wd.over || mode !== 'plan';""","""  $('legend2').hidden = ed || Wd.over || mode !== 'plan' || !detail();
  $('legend1').hidden = ed || Wd.over || mode !== 'plan' || detail();""")
# help collapse
i=s.index('        <p class="keys">고르기: 판에서 아군을 누르거나'); j=s.index('</p>', i)+4
old=s[i:j]
body=old[len('        <p class="keys">'):-4]
new='''        <p class="keys">아군을 고르고 → 바닥 = 그 칸으로 가서 지킴 (도착하면 스스로 판단) · 보이는 적 = 공격 · <kbd>Space</kbd> 다음 턴. 커서를 올리면 그 인물의 시선 (등 뒤는 못 알아챔) · 공격 범위 · 하는 일이 보여요.</p>
        <details class="keys"><summary>자세한 설명</summary><p class="keys">'''+body+''' 이동 명령이 끝나면 그 자리 (작은 마름모) 를 지키며 자동으로 싸우고, '자동' 을 누르면 다시 주인공을 따라가요. 원거리 공격은 쏘는 순간 그쪽으로 날아가는 탄이라, 빗나가면 옆 · 뒤의 다른 몸 (아군도) 에 맞을 수 있어요. '자세히 보기' 를 켜면 모두의 시선 · 공격 범위와 칸 구분이 보여요.</p></details>'''
s=s[:i]+new+s[j:]
# projectiles + spark drawing (before fx loop)
rep("""  // 효과
  if (!ed) for (const f of Wd.fx){""","""  // 날아가는 탄 · 화살 · 마법 (쏜 뒤 따라가지 않음): 짧은 꼬리 + 머리
  if (!ed) for (const sh of Wd.shots || []){
    const tl = Math.min(0.9, Math.hypot(sh.x - sh.x0, sh.y - sh.y0)), hx = ox + sh.x * ts, hy = oy + sh.y * ts;
    ctx.strokeStyle = sh.side ? 'rgba(255,150,110,.9)' : 'rgba(160,215,255,.9)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx - sh.dx * tl * ts, hy - sh.dy * tl * ts); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.fillStyle = '#fff4d6'; ctx.beginPath(); ctx.arc(hx, hy, 2.5, 0, 6.283); ctx.fill();
  }
  // 효과
  if (!ed) for (const f of Wd.fx){""")
rep("""    } else if (f.k === 'num' && age < 0.9){""","""    } else if (f.k === 'spark' && age < 0.25){
      const p = { x: ox + f.x * ts, y: oy + f.y * ts }; ctx.strokeStyle = `rgba(255,236,190,${1 - age / 0.25})`; ctx.lineWidth = 1.5;
      for (let k = 0; k < 6; k++){ const a = k * 1.047 + f.t0, r1 = 3 + age * 40; ctx.beginPath(); ctx.moveTo(p.x + Math.cos(a) * 2, p.y + Math.sin(a) * 2); ctx.lineTo(p.x + Math.cos(a) * r1, p.y + Math.sin(a) * r1); ctx.stroke(); }
    } else if (f.k === 'num' && age < 0.9){""")
# stay marker: draw near order lines (after orders block) for allies with stay
rep("""      if (plan) for (const me of selUnits(Wd)){""","""      // 지키는 자리 (이동 명령 뒤 자동): 작은 마름모 + 번호. 간단 보기에선 고른 아군만
      for (const u of Wd.units){ if (!u.alive || u.side !== 0 || !u.stay || (u.order && u.order.k !== 'hold')) continue; if (!detail() && !sel.has(u.i)) continue;
        const p = { x: ox + u.stay.x * ts, y: oy + u.stay.y * ts }, k = ts * 0.18; ctx.setLineDash([]); ctx.strokeStyle = 'rgba(159,210,255,.85)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(p.x, p.y - k); ctx.lineTo(p.x + k, p.y); ctx.lineTo(p.x, p.y + k); ctx.lineTo(p.x - k, p.y); ctx.closePath(); ctx.stroke(); badge(p.x + k + 5, p.y - k, allyNo(Wd, u), 0.7); ctx.setLineDash([5, 4]); }
      if (plan) for (const me of selUnits(Wd)){""")
# order label: auto with stay
rep("""  if (!o || o[0] === 'auto') return '자동';""","""  if (!o || o[0] === 'auto') return o && o[1] != null ? `자동 (${coord(o[1], o[2])} 지킴)` : '자동';""")
rep("""const ordOf = u => !u.order ? ['auto'] :""","""const ordOf = u => !u.order ? (u.stay ? ['auto', u.stay.x, u.stay.y] : ['auto']) :""")
rep("""  if (k === 'auto') L.forEach(u => u.order = null);""","""  if (k === 'auto') L.forEach(u => { u.order = null; u.stay = null; });   // 자리를 풀고 주인공을 따라감""")
rep("""<button class="btn" type="button" data-ord="auto">자동</button>""","""<button class="btn" type="button" data-ord="auto" title="지키던 자리를 풀고 주인공을 따라가며 스스로 판단">자동 (따라감)</button>""")
rep("""      case 'arrive': out.push(`${T(e)}${n(e.a)} 목적지 도착 → 제자리`); break;""","""      case 'arrive': out.push(`${T(e)}${n(e.a)} 목적지 도착 → 자동 (그 자리를 지킴)`); break;""")
rep("""      case 'stuck': out.push(`${T(e)}${n(e.a)} 길이 막혀 멈춤 → 제자리`); break;""","""      case 'stuck': out.push(`${T(e)}${n(e.a)} 길이 막혀 멈춤 → 자동 (그 자리를 지킴)`); break;""")
rep("""      case 'lost': out.push(`${T(e)}${ga(n(e.a))} ${reul(n(e.b))} 놓침 → 제자리`); break;""","""      case 'lost': out.push(`${T(e)}${ga(n(e.a))} ${reul(n(e.b))} 놓침 → 자동`); break;""")
rep("""'약 받는 중': '약 받는 중' };""","""'약 받는 중': '약 받는 중', '자리로': '자리로' };""")
# migration: weapon vel
rep("""// v4.2: 기술 (옐로 양동이 약) · 야시 등급 (적은 모두 B, 검사 A)""","""// v4.3: 무기표에 탄속 (vel)
if (!S.v43){ for (const w in DEFAULT_RULES.weapons){ if (S.rules.weapons[w] && DEFAULT_RULES.weapons[w].vel != null && S.rules.weapons[w].vel == null) S.rules.weapons[w].vel = DEFAULT_RULES.weapons[w].vel; } S.v43 = true; }
// v4.2: 기술 (옐로 양동이 약) · 야시 등급 (적은 모두 B, 검사 A)""")
rep("""  const S = { v: 3, v4: true, v41: true, v42: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: newDraft() };""","""  const S = { v: 3, v4: true, v41: true, v42: true, v43: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: newDraft() };""")
rep("""  const S = { v: 3, v4: true, v41: true, v42: true, type: 'gridC',""","""  const S = { v: 3, v4: true, v41: true, v42: true, v43: true, type: 'gridC',""")
# weapon table: vel column
rep("""<th>총성</th><th>방어</th>""","""<th>탄속</th><th>총성</th><th>방어</th>""")
rep("""<td>${far ? ck(`weapons.${w}.loud`, W.loud) : ''}</td>""","""<td>${far ? o(`weapons.${w}.vel`, W.vel, 2, 40) : ''}</td><td>${far ? ck(`weapons.${w}.loud`, W.loud) : ''}</td>""")
# rules row stayLeash
rep("""const vis = [['sight', '보는 거리 (칸)', 0.5],""","""const vis = [['stayLeash', '이동 뒤 자동: 지키는 자리에서 쫓아가 싸우는 거리 (칸)', 0.5], ['sight', '보는 거리 (칸)', 0.5],""")
# details style
rep(""".keys{font-size:12px;color:var(--dim)}""",""".keys{font-size:12px;color:var(--dim)}
details.keys summary{cursor:pointer;color:var(--fg);font-weight:600;margin:2px 0} details.keys p{margin:6px 0 0}""")
open('page10.tpl.html','w').write(s)
print('ok')
