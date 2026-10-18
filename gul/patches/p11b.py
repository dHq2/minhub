s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
# guard arc = gArc, plus wedge
rep("""    if (u.canGuard){ ctx.strokeStyle = gOn ? '#e9e4da' : 'rgba(255,120,95,.85)'; ctx.lineWidth = Math.max(3, r * 0.2); if (!gOn) ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, r + 1, fa - 0.75, fa + 0.75); ctx.stroke(); ctx.setLineDash([]); }""",
"""    if (u.canGuard){ const ga2 = Math.max(0.12, (u.gArc || 45) * Math.PI / 180);
      // 막는 방향 (부채꼴): 바라보는 방향 ±gArc. 고른 · 커서를 올린 인물은 진하게
      if (vis){ const strong = u.pid === hoverPid || (!ed && sel.has(u.i) && u.side === 0) || (ed && u.pid === selId), R2 = r + ts * 1.25;
        const g = ctx.createRadialGradient(px, py, r, px, py, R2); g.addColorStop(0, `rgba(233,228,218,${gOn ? (strong ? .32 : .14) : .06})`); g.addColorStop(1, 'rgba(233,228,218,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(px + Math.cos(fa - ga2) * r, py + Math.sin(fa - ga2) * r); ctx.arc(px, py, R2, fa - ga2, fa + ga2); ctx.arc(px, py, r, fa + ga2, fa - ga2, true); ctx.closePath(); ctx.fill(); }
      ctx.strokeStyle = gOn ? '#e9e4da' : 'rgba(255,120,95,.85)'; ctx.lineWidth = Math.max(3, r * 0.2); if (!gOn) ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, r + 1, fa - ga2, fa + ga2); ctx.stroke(); ctx.setLineDash([]); }""")
# noises: kinds
rep("""  if (!ed) for (const n of Wd.noises || []){
    const age = now - n.t0, k = Math.max(0, 1 - age / Wd.rules.noiseTime), p = { x: ox + n.x * ts, y: oy + n.y * ts };""","""  // 브리핑 (포렌의 냄새): 보이지 않는 적의 대략적인 방향 · 거리 띠 (보라 부채꼴). 다음 브리핑까지 남음
  if (!ed && Wd.brief && now - Wd.brief.t < Wd.rules.briefT + 1){
    const B = Wd.brief, k = Math.max(0, 1 - (now - B.t) / (Wd.rules.briefT + 1)), cx = ox + B.x * ts, cy = oy + B.y * ts, BR = [[0.8, 3], [3, 6], [6, 9.5]];
    for (const g of B.groups){
      const [r0, r1] = BR[g.band], a0 = g.ang - Math.PI / 8, a1 = g.ang + Math.PI / 8;
      ctx.fillStyle = `rgba(190,140,255,${0.16 * k + 0.04})`; ctx.beginPath(); ctx.arc(cx, cy, r1 * ts, a0, a1); ctx.arc(cx, cy, r0 * ts, a1, a0, true); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = `rgba(200,160,255,${0.6 * k + 0.15})`; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
      const lx = cx + Math.cos(g.ang) * (r0 + r1) / 2 * ts, ly = cy + Math.sin(g.ang) * (r0 + r1) / 2 * ts, t = `냄새 ${g.n}${g.closer ? ' ↘ 가까워짐' : ''}`;
      ctx.font = '600 10.5px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width;
      ctx.globalAlpha = 0.4 + 0.6 * k; ctx.fillStyle = 'rgba(20,12,30,.75)'; ctx.fillRect(lx - tw / 2 - 4, ly - 8, tw + 8, 16); ctx.fillStyle = '#dcc6ff'; ctx.fillText(t, lx, ly); ctx.globalAlpha = 1;
    }
  }
  if (!ed) for (const n of Wd.noises || []){
    const age = now - n.t0, k = Math.max(0, 1 - age / Wd.rules.noiseTime), p = { x: ox + n.x * ts, y: oy + n.y * ts };
    if (n.kind === 'bark' || n.kind === 'scream'){   // 짖는 소리 '멍!' · 비명 '악!' (소리라 어둠 속이어도 보임)
      if (age > 1.6) continue; const kk = 1 - age / 1.6, t = n.kind === 'bark' ? '멍!' : '악!';
      ctx.globalAlpha = kk; ctx.font = `800 ${Math.max(12, ts * 0.42)}px IBM Plex Sans KR, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = 'rgba(0,0,0,.8)'; ctx.lineWidth = 3.5; ctx.strokeText(t, p.x, p.y - ts * 0.6 - age * 10); ctx.fillStyle = n.kind === 'bark' ? '#ffb070' : '#ff6b57'; ctx.fillText(t, p.x, p.y - ts * 0.6 - age * 10); ctx.globalAlpha = 1;
      continue;
    }""")
# MOOD_TAG additions
rep("""'거리 벌리기': '거리 벌리기', '지킴': '지킴' };""","""'거리 벌리기': '거리 벌리기', '지킴': '지킴',
  '위협': '위협', '물러섬': '물러섬', '우회': '우회', '숨어 지켜봄': '지켜봄', '어둠으로': '어둠으로', '어둠으로 물러남': '빠짐', '짖으며 위협': '짖음', '포위': '포위', '살핌': '살핌', '어둠 속 접근': '접근', '파고듦': '파고듦' };""")
# log lines: brief, bark, ambush tag
rep("""      case 'mood': out.push(`${T(e)}${n(e.a)} [${e.m}]""","""      case 'brief': out.push(`${T(e)}${n(e.a)} 브리핑 (냄새): ${e.groups.map(g => `${g.rel} ${g.n} (${BANDK[g.band]}${g.closer ? ', 가까워짐' : ''})`).join(' · ')} [실제: ${e.groups.flatMap(g => g.foes).map(i => n(i) + ' ' + coord(Wd.units[i].x, Wd.units[i].y)).join(', ')} — 지금 자리]`); break;
      case 'bark': out.push(`${T(e)}${n(e.a)} 짖음 (${coord(e.x, e.y)})${e.vis ? '' : ' [안 보임 · 소리로 방향을 앎]'}`); break;
      case 'mood': out.push(`${T(e)}${n(e.a)} [${e.m}]""")
rep("""        if (e.ff) tags.push('아군 오사');""","""        if (e.ambush) tags.push(`암살 (알아차리지 못함) ×${R.ambushMul} · 비명`);
        if (e.ff) tags.push('아군 오사');""")
rep("""const guardName = u => u.shield ? '방패' : u.weapon || '무기';""","""const guardName = u => u.shield ? '방패' : (Wd_rules_guard(u) ? u.weapon : '반사신경');
const Wd_rules_guard = u => !!((rules.weapons[u.weapon] || {}).guard);
const BANDK = ['가까이', '조금 떨어져', '멀리'], NUMK = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟'];""")
# narration
rep("""    case 'noise': return e.vis ? null : { c: 'bad', s: `어둠 속에서 총성이 울린다. 소리 난 자리에 '!'.` };""","""    case 'noise': return e.vis ? null : { c: 'bad', s: `어둠 속에서 총성이 울린다. 소리 난 자리에 '!'.` };
    case 'brief': return { c: 'brief', s: `${n(e.a)}: "${e.groups.map(g => `${g.rel}, ${NUMK[g.n] || g.n} — ${BANDK[g.band]}${g.closer ? '. 가까워진다' : ''}`).join(' / ')}."` };
    case 'bark': { const k = 'b' + e.a; if (!e.vis) return { c: 'dim', s: '어둠 속에서 개가 짖는다.' }; if (narr.seenBark && narr.seenBark[k] && Wd.t - narr.seenBark[k] < 8) return null; (narr.seenBark = narr.seenBark || {})[k] = Wd.t; return { c: 'bad', s: `${ga(n(e.a))} 짖으며 으르렁댄다.` }; }""")
rep("""      if (e.ff) return { c: 'bad', s: `${a.name}의 ${far ? '탄환' : '공격'}이 사선에 끼어든 ${b.name}에게 맞는다!${v.replace(')', ', 아군 오사)')}` };""","""      if (e.ff) return { c: 'bad', s: `${a.name}의 ${far ? '탄환' : '공격'}이 사선에 끼어든 ${b.name}에게 맞는다!${v.replace(')', ', 아군 오사)')}` };
      if (e.ambush) return { c: b.side === 0 ? 'bad' : 'good', s: `${a.name}의 칼날이 무방비한 ${b.name}의 등을 파고든다 — 치명상! (−${e.dmg}) ${ga(b.name)} 비명을 지른다.` };""")
rep("""        '물러남': { c: 'good', s: `${ga(a)} 물러난다.` }, '막아서기': { s: `${ga(a)} 동료 앞을 막아선다.` },""","""        '물러남': { c: 'good', s: `${ga(a)} 물러난다.` }, '막아서기': { s: `${ga(a)} 동료 앞을 막아선다.` },
        '위협': { c: 'dim', s: `${ga(a)} ${reul(b)} 노려보며 거리를 잰다.` }, '물러섬': { c: 'dim', s: `${ga(a)} 한발 물러선다. 쉽게 들어오지 않는다.` }, '우회': { c: 'bad', s: `${ga(a)} 어둠을 따라 옆으로 돈다.` }, '숨어 지켜봄': { c: 'dim', s: `${ga(a)} 어둠 가장자리에서 지켜본다.` },
        '포위': { c: 'bad', s: `${ga(a)} ${b}의 옆으로 돈다.` }, '어둠으로 물러남': { s: `${ga(a)} 어둠 속으로 빠진다.` }, '파고듦': { c: 'bad', s: `${ga(a)} ${b}의 등 뒤로 파고든다!` },""")
rep(""".narr .bad{color:#ff9b85} .narr .good{color:#9fd2ff} .narr .dim{color:#b8b0a6;font-style:italic}""",""".narr .bad{color:#ff9b85} .narr .good{color:#9fd2ff} .narr .dim{color:#b8b0a6;font-style:italic} .narr .brief{color:#d8c2ff}""")
# log header who
rep("""${u.shield ? ' · 방패 (방어 자세)' : u.canGuard ? ' · 방어 자세 (' + u.weapon + ')' : ''}""","""${u.canGuard ? ' · 방어 ±' + u.gArc + '°' + (u.shield ? ' (방패)' : '') : ''}${u.smellG ? ' · 후각 ' + u.smellG : ''}${u.pack ? ' · 포위 사냥' : u.stalk ? ' · 어둠 속 우회' : ''}""")
# rules tab rows
rep("""['pinTime', '맞으면 움찔 (이동 ×0.4) 하는 시간 (초)', 0.1]].map(row).join('') + '</tbody>';""","""['pinTime', '맞으면 움찔 (이동 ×0.4) 하는 시간 (초)', 0.1],
    ['turnRate', '돌아서는 빠르기 (초당 도)', 30], ['guardArcW', '대검으로 막는 폭 (±도, 방패는 앞쪽 범위)', 5], ['guardArcR', '[반사신경] 맨몸으로 막는 폭 (±도)', 5], ['guardArcRW', '[반사신경] + 대검 · 방패로 막는 폭 (±도)', 5], ['reflexCost', '[반사신경] 자세 깎임 ×', 0.05],
    ['smellFar', '후각 A: 대략적인 방향 · 거리를 맡는 거리 (칸)', 0.5], ['briefT', '아군 후각 브리핑 간격 (초)', 0.5], ['senseT', '감지 (냄새 · 브리핑 · 짖는 소리) 가 남는 시간 (초)', 0.5], ['barkT', '개가 짖는 간격 (초)', 0.5], ['ambushMul', '암살 (알아차리지 못한 옆 · 뒤 근접) 피해 ×', 0.25]].map(row).join('') + '</tbody>';""")
rep("""<p class="lab">사선 · 방어 자세 · 죽기 쉬움 (v4.0)</p>""","""<p class="lab">사선 · 방어 · 감각 · 죽기 쉬움 (v4.0 ~ v4.1)</p>""")
# editor: smell grade select
rep("""    ${EXTRA_TRAITS.length ? `<div class="row">${EXTRA_TRAITS.map(t => `<label class="ck" for="tr-${t}" title="${esc(TRAITS[t])}"><input id="tr-${t}" type="checkbox" data-trait="${t}" ${(p.traits || []).includes(t) ? 'checked' : ''}> [${t}]</label>`).join('')}</div>` : ''}""",
"""    ${EXTRA_TRAITS.length ? `<div class="row">${EXTRA_TRAITS.map(t => `<label class="ck" for="tr-${t}" title="${esc(TRAITS[t])}"><input id="tr-${t}" type="checkbox" data-trait="${t}" ${(p.traits || []).includes(t) ? 'checked' : ''}> [${t}]</label>`).join('')}${(p.traits || []).includes('높은후각') ? `<select id="selSmellG" aria-label="후각 등급"><option value="A" ${p.smellG !== 'S' ? 'selected' : ''}>후각 A (대략 9칸)</option><option value="S" ${p.smellG === 'S' ? 'selected' : ''}>후각 S (맵 전체)</option></select>` : ''}</div>` : ''}""")
rep("""  if (e.target.id === 'selBold'){""","""  if (e.target.id === 'selSmellG'){ p.smellG = e.target.value; changed(); return; }
  if (e.target.id === 'selBold'){""")
# tooltip: trait names with grade, guard arc
rep("""    ${traits.length ? traits.map(t => `<span class="tr"><i>[${esc(t)}]</i> ${esc(TRAITS[t] || '')}${t === '높은후각' ? ' (' + Wd.rules.smell + '칸)' : ''}</span>`).join('') : '<span class="tr lb">특성 없음</span>'}""",
"""    ${traits.length ? traits.map(t => `<span class="tr"><i>[${esc(t === '높은후각' ? t + ' ' + (u.smellG || 'A') : t)}]</i> ${esc(TRAITS[t] || '')}</span>`).join('') : '<span class="tr lb">특성 없음</span>'}""")
rep("""    ${u.canGuard && known ? `<span class="tr"><span class="lb">자세</span> ${!ed && Wd.t < u.brokenT ? '무너짐 (' + f2(u.brokenT - Wd.t) + '초 뒤 다시 잡음)' : Math.round(u.post) + '/100'}${!u.shield ? ' · 대검은 자기 공격 중엔 못 막음' : ''}</span>` : ''}""",
"""    ${u.canGuard && known ? `<span class="tr"><span class="lb">방어</span> 바라보는 방향 ±${u.gArc}° · 자세 ${!ed && Wd.t < u.brokenT ? '무너짐 (' + f2(u.brokenT - Wd.t) + '초 뒤 다시 잡음)' : Math.round(u.post) + '/100'}${!u.shield ? ' · 자기 공격 중엔 못 막음' : ''}</span>` : ''}""")
rep("""  const traits = [...(u.nv ? ['야시'] : []), ...(u.shield ? ['방패'] : u.canGuard ? ['방어 자세'] : []), ...(p.traits || [])];""","""  const traits = [...(u.nv ? ['야시'] : []), ...(u.shield ? ['방패'] : u.canGuard && !(p.traits || []).includes('반사신경') ? ['방어 자세'] : []), ...(p.traits || [])];""")
# keys help
rep("""노란 ! = 총성 난 자리.""","""노란 ! = 총성 난 자리, '멍!' = 개 짖는 소리 (안 보여도 방향을 앎), 보라 부채꼴 = 포렌이 냄새로 알린 보이지 않는 적 (대략적인 방향 · 거리), 흰 부채꼴 = 방어로 막는 방향. 왼쪽 위 이야기 상자는 위아래로 올려 지난 일을 볼 수 있어요.""")
open('page10.tpl.html','w').write(s)
print('ok')
