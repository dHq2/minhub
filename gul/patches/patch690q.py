# v6.9.0 page patch 2: 지휘 체계 (보고 · 임무판 · 영향 지도 · 교리)
p='page10.tpl.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:90],s.count(a)); s=s.replace(a,b)
# mvTxt
rep("""    : e.m === 'jink' ? `총구 피하기 (본능): ${ga(n(e.a))} ${n(e.b)}의 겨눔을 보고 사선을 가로질러 파고듦${e.cover ? ' (방패 · 큰 몸 동료 뒤로)' : ''}` : e.m; }""",
    """    : e.m === 'jink' ? `총구 피하기 (본능): ${ga(n(e.a))} ${n(e.b)}의 겨눔을 보고 사선을 가로질러 파고듦${e.cover ? ' (방패 · 큰 몸 동료 뒤로)' : ''}`
    : e.m === 'shift' ? `자리 옮김 (영향 지도): ${ga(n(e.a))} 상대의 손 · 돌진이 닿는 칸 (위협 ${e.th0}) 에서 ${e.th} 인 칸으로 비켜섬${e.cv ? ' — 방패 · 거구 뒤' : ''} (${n(e.b)}을(를) 계속 겨눔)`
    : e.m === 'screen' ? `${e.c != null ? '지휘관 호위' : '사수 호위'} (임무): ${ga(n(e.a))} ${e.c != null ? n(e.c) : '궁수들'} 앞, ${n(e.b)} 쪽을 막아섬` : e.m; }""")
# 로그 줄
rep("""      case 'focusLost': out.push(""", """      case 'report': out.push(`${T(e)}◆ 적 보고: ${n(e.a)} → 지휘 ${n(e.c)} — ${n(e.b)}${e.again ? ' (다시 봄)' : ''} · 본 때보다 ${e.lag}초 늦게 닿음 (그사이 움직였을 수 있음)`); break;   // v6.9
      case 'board': out.push(`${T(e)}📋 적 임무판 (${PLAN_K[e.p] || e.p || '-'} · 지휘 ${n(e.by)}${e.tmp ? ', 임시' : ''}): ${e.s.filter(x => x[0] !== 'reserve').map(x => TASK_N[x[0]] + ' ' + (x[1] != null ? n(x[1]) : '(맡을 병사 없음)') + (x[2] != null && x[0] !== 'guard' ? ' → ' + n(x[2]) : '')).join(' · ')}${e.s.some(x => x[0] === 'reserve') ? ' · 예비 ' + e.s.filter(x => x[0] === 'reserve').map(x => n(x[1])).join(' · ') : ''}`); break;
      case 'taskSwap': out.push(`${T(e)}📋 적 임무 교대: ${TASK_N[e.tk] || e.tk} — ${n(e.a)} (${e.why}) → ${n(e.b)}${e.from ? ' (' + (TASK_N[e.from] || e.from) + '에서)' : ''}`); break;
      case 'taskDrop': out.push(`${T(e)}📋 적 임무 포기: ${TASK_N[e.tk] || e.tk} ${e.had} → ${e.now}칸 (맡을 병사가 없음)`); break;
      case 'taskEnd': out.push(`${T(e)}📋 적 임무판 끝 — ${e.why}, 각자 싸움`); break;
      case 'doctrine': { const D = (Wd.rules.doctrine || {})[e.d] || {}; out.push(`${T(e)}◆ 적 교리: ${D.n || e.d} — ${D.d || ''}`); break; }
      case 'focusLost': out.push(""")
# 이야기: 보이는 기동만
rep("""      if (e.m === 'escort') return { c: 'bad', s: `${ga(A)} 앞장서고 ${ga(n(e.c))} 그 뒤에 붙어 ${n(e.b)} 쪽으로 다가온다!` };""",
    """      if (e.m === 'escort') return { c: 'bad', s: `${ga(A)} 앞장서고 ${ga(n(e.c))} 그 뒤에 붙어 ${n(e.b)} 쪽으로 다가온다!` };
      if (e.m === 'shift') return { c: 'dim', s: `${ga(A)} 우리 손이 닿지 않는 쪽으로 슬쩍 자리를 옮긴다.` };   // v6.9 영향 지도
      if (e.m === 'screen') return { c: 'bad', s: `${ga(A)} ${e.c != null ? n(e.c) + ' 앞' : '궁수들 앞'}을 막아선다.` };""")
# 시작 설정: 적 교리
rep("""          <div class="row"><label class="ck" for="randStart"><input id="randStart" type="checkbox"> 적 시작 무작위 (조우 전 — 적의 진 · 순찰조 · 초병 자리가 판마다 다름. 서로 모르는 채 시작)</label></div>""",
    """          <div class="row"><label class="ck" for="randStart"><input id="randStart" type="checkbox"> 적 시작 무작위 (조우 전 — 적의 진 · 순찰조 · 초병 자리가 판마다 다름. 서로 모르는 채 시작)</label></div>
          <div class="row"><label for="doc1">적 교리</label> <select id="doc1"></select> <span class="note" id="doc1d"></span></div>""")
rep("""  $('randStart').checked = !!S.randStart;   // v6.1""",
    """  $('randStart').checked = !!S.randStart;   // v6.1
  { const D = DEFAULT_RULES.doctrine || {}, el = $('doc1'); if (el && !el.options.length) for (const k in D){ const o = document.createElement('option'); o.value = k; o.textContent = D[k].n; el.appendChild(o); } if (el){ el.value = S.doctrine1 && D[S.doctrine1] ? S.doctrine1 : '용병'; $('doc1d').textContent = (D[el.value] || {}).d || ''; } }   // v6.9 적 교리""")
rep("""$('randStart').addEventListener('change', e => {""",
    """$('doc1').addEventListener('change', e => { S.doctrine1 = e.target.value; const D = (DEFAULT_RULES.doctrine || {})[S.doctrine1] || {}; $('doc1d').textContent = D.d || ''; changed(); toast(`적 교리: ${D.n} — ${D.d}`); });   // v6.9
$('randStart').addEventListener('change', e => {""")
# 상세: 적의 임무 (모두 보기)
rep("""    ${!ed && u.alive && !isFar(u) ? `<span class="tr"><span class="lb">전열</span>""",
    """    ${!ed && u.side === 1 && u.alive && $('seeAll').checked && u.task ? `<span class="tr" style="color:#ffb27a"><span class="lb">임무</span> ${TASK_N[u.task.k] || u.task.k}${u.task.b != null && Wd.units[u.task.b] ? ' → ' + esc(Wd.units[u.task.b].name) : ''}${Wd.t < u.task.at ? ' (명령이 ' + f2(u.task.at - Wd.t) + '초 뒤 닿음)' : ''} · 적 교리 ${esc(((Wd.rules.doctrine || {})[Wd.docK] || {}).n || '')} [모두 보기]</span>` : ''}
    ${!ed && u.alive && !isFar(u) ? `<span class="tr"><span class="lb">전열</span>""")
# 영향 지도 (모두 보기 + 자세히 보기)
rep("""  // 횃불 온기
  ctx.globalCompositeOperation = 'lighter';""",
    """  // v6.9 적의 영향 지도 (모두 보기 + 자세히 보기): 붉은 칸 = 적이 보기에 우리 손 · 돌진 · 사거리가 닿는 곳, 파란 점 = 적 방패 · 거구 뒤 (엄호)
  if (see && detail() && !ed && Wd.infl && Wd.infl[1]){ const I = Wd.infl[1];
    for (let cy = y0; cy < y1; cy++) for (let cx = x0; cx < x1; cx++){ const k = cy * S.W + cx, th = I.th[k], cv = I.cv[k];
      if (th > 0.05){ ctx.fillStyle = `rgba(255,70,60,${Math.min(0.3, th * 0.14).toFixed(3)})`; ctx.fillRect(ox + cx * ts, oy + cy * ts, ts, ts); }
      if (cv > 0.05){ ctx.fillStyle = `rgba(90,170,255,${Math.min(0.45, cv * 0.45).toFixed(3)})`; ctx.beginPath(); ctx.arc(ox + (cx + 0.5) * ts, oy + (cy + 0.5) * ts, ts * 0.14, 0, 6.283); ctx.fill(); } } }
  // 횃불 온기
  ctx.globalCompositeOperation = 'lighter';""")
# 로그 머리: 교리
rep("""  return `굴의 전투판 v6.8.0 · ${title}""", """  return `굴의 전투판 v6.8.0 · ${title}${Wd.docK ? ' · 적 교리 ' + (((Wd.rules.doctrine || {})[Wd.docK] || {}).n || Wd.docK) : ''}""")
# 범례
rep("""<span><i class="ln" style="color:#ff9a86">✕</i>시체 = """, """<span><i class="ln" style="color:#ff7a6e">▦</i>모두 보기 + 자세히 보기: 적의 영향 지도 (붉은 칸 = 적이 보기에 우리 손 · 돌진 · 사거리가 닿는 곳 · 파란 점 = 적 방패 · 거구 뒤)</span><span><i class="ln" style="color:#ff9a86">✕</i>시체 = """)
open(p,'w').write(s); print('ok')
