# v7.9.4 페이지: 측면 기동 명령 (단추 · 도크 · 탭) · 집결 깃발 · 망치 · 모루 표시 · 연락 두절 표시 · 로그 · 복기 · 노트 · 버전
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v7.9.3 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v7.9.4 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.9.4: 지휘 체계 4 — 임시 집결 · 망치와 모루 · 연락 두절 시 임무 판단.
             ① 임시 집결: 싸움이 열린 뒤 12초 안에 동료가 둘 이상 쓰러지고 우리가 밀리면 (힘의 비 1 아래), 또는 지휘관이 쓰러지면, 지금 지휘관 (인주 → 안 되면 부지휘관 노먼) 이 집결지를 부름 — 모인 동료 한가운데에서 적 반대쪽으로 2.5칸.
               부름은 지휘 전달망 그대로 (못 들은 이는 모른 채 각자 판단 — 로그 · 복기에 '못 들음'). 맞붙은 이는 싸움이 먼저, 도착하면 그 자리를 지킴. 판에는 🚩 집결 깃발 (20초).
             ② 망치와 모루: 동료가 붙들어 선 상대 (상대가 그 동료를 보고 겨눔 = 모루 ⚓) 를 알아보고, 자유로운 미드필더 · 공격수 (망치 🔨) 가 호를 그려 상대의 옆 · 뒤로 돌아 들어감. 앞을 가로지르지 않음.
               판단은 틀릴 수 있음 — 베테랑이 아니면 30% (베테랑 15%) 로 반대편을 골라 앞으로 들어감 (본인은 모름, 로그 · 복기에 '틀린 쪽'). 시험: 옆 · 뒤 공격 22% → 41%.
             ③ 🔄 측면 기동 명령: 적 하나를 찍으면 그 적의 옆 · 뒤 (모루 반대쪽) 로 돌아 들어가 침. 받쳐 줄 이가 아직 안 붙었으면 '이른 기동' 으로 로그에 남김 (위험).
             ④ 연락 두절: 지휘관과 6초 넘게 닿지 않은 (명령 없는) 아군은 마지막 임무로 판단 — 자리 임무는 그 자리 · 표적 임무는 그 표적 (교전 규칙도 허락) · 임무가 없거나 끝났으면 마지막으로 지휘관을 본 자리로 합류 (20% 는 엉뚱하게 어림).
               칩에 📵 N초 · 상세정보에 '연락' · '최근 판단'. 연락이 돌아오면 로그에 남음.
             측정 (자동 전투): /*MEAS794*/
""")
rep('<span class="ver">v7.9.3 · 방패 정면','<span class="ver">v7.9.4 · 임시 집결 · 망치와 모루 · 측면 기동 · 연락 두절 임무 · v7.9.3 · 방패 정면')
rep("<footer>굴의 전투판 v7.9.3 —","<footer>굴의 전투판 v7.9.4 —")
rep("return `굴의 전투판 v7.9.3 · ${title}","return `굴의 전투판 v7.9.4 · ${title}")
rep("copyText('굴의 전투판 v7.9.3 자동 판 기록","copyText('굴의 전투판 v7.9.4 자동 판 기록")
rep('body.mob .top h1::after{content:" v7.9.3";','body.mob .top h1::after{content:" v7.9.4";')
# 이름 · 표시
rep("  if (o[0] === 'sac') return '💀 희생 돌격';","  if (o[0] === 'sac') return '💀 희생 돌격';\n  if (o[0] === 'flank') return `${Wd.units[o[1]].name} 측면 기동`;   // v7.9.4")
rep("const ordOf = u => u.order && u.order.k === 'sac' ? ['sac'] :","const ordOf = u => u.order && u.order.k === 'flank' ? ['flank', u.order.b] : u.order && u.order.k === 'sac' ? ['sac'] :")
rep(": o.k === 'sac' ? ['💀 희생 돌격!', '#ff8a7a'] :",": o.k === 'flank' ? ['🔄 ' + tn + ' 측면', '#9fd0ff'] : o.k === 'sac' ? ['💀 희생 돌격!', '#ff8a7a'] :")
# 로그 줄
rep("      case 'pushNo': out.push(","""      case 'rally': out.push(`${T(e)}🚩 임시 집결 — ${n(e.a)}이(가) ${coord(e.x, e.y)}로 부름 (${e.why}) · 들음 ${e.got.map(n).join(' · ') || '—'}${e.miss.length ? ' · 못 들음 ' + e.miss.map(n).join(' · ') + ' (각자 판단)' : ''}`); break;   // v7.9.4
      case 'rallyArrive': out.push(`${T(e)}🚩 ${n(e.a)} 집결지에 닿음 — 그 자리를 지킴`); break;
      case 'netLost': out.push(`${T(e)}📵 ${n(e.a)} 지휘관과 닿지 않음 (6초 넘게)${e.m ? ' — 마지막 임무: ' + orderLabel(Wd, e.m) : ' — 받은 임무 없음'}`); break;
      case 'netBack': out.push(`${T(e)}📶 ${n(e.a)} 다시 지휘관과 닿음 (${e.sec}초 만에)`); break;
      case 'offAct': out.push(`${T(e)}📵 ${n(e.a)} ${{ post: '마지막 임무대로 그 자리를 지킴', target: '마지막 임무의 표적을 계속 쫓음', rejoin: '마지막으로 지휘관을 본 자리로 합류', rejoinErr: '지휘관 쪽으로 어림해 감 (빗나갈 수 있음)' }[e.kind]}${e.m ? ' (' + orderLabel(Wd, e.m) + ')' : ''}`); break;
      case 'hm': out.push(`${T(e)}${e.r === 'anvil' ? '⚓' : '🔨'} ${n(e.a)} ${e.r === 'anvil' ? '모루 — ' + n(e.b) + '를 붙듦' : '망치 — ' + n(e.b) + '의 옆 · 뒤로'}`); break;
      case 'flankGo': out.push(`${T(e)}🔄 ${n(e.a)} ${n(e.b)}의 측면으로 기동${e.early ? ' — 받쳐 줄 이가 아직 안 붙음 (이른 기동)' : ''}`); break;
      case 'flankMis': out.push(`${T(e)}🔄 ${n(e.a)} (복기) ${n(e.b)}의 옆 · 뒤를 잘못 짐작 — 앞쪽으로 돌아 들어감`); break;
      case 'pushNo': out.push(""")
rep("    case 'pushNo': return","""    case 'rally': return { c: 'warn', s: `${ga(n(e.a))} 외친다 — 모여! ${coord(e.x, e.y)} 쪽으로.${e.miss.length ? ' ' + e.miss.map(n).join(' · ') + '에게는 닿지 않았다.' : ''}` };   // v7.9.4
    case 'rallyArrive': return { c: 'dim', s: `${ga(n(e.a))} 집결지에 닿아 자리를 잡는다.` };
    case 'netLost': return e.vis ? { c: 'dim', s: `${n(e.a)}의 소식이 끊겼다.` } : null;
    case 'netBack': return { c: 'dim', s: `${ga(n(e.a))} 다시 닿았다.` };
    case 'offAct': return null;
    case 'hm': return null;
    case 'flankGo': return { c: 'dim', s: `${ga(n(e.a))} ${n(e.b)}의 옆구리를 향해 돌아 나간다.` };
    case 'flankMis': return null;
    case 'pushNo': return""")
# 복기: 자율 판단 목록에 추가
rep("['impulse', 'regroup', 'healDefer', 'healRisk', 'healAbort', 'pushNo'].includes(e.k) && U(e.a) && U(e.a).side === 0)","['impulse', 'regroup', 'healDefer', 'healRisk', 'healAbort', 'pushNo', 'offAct', 'flankMis', 'rally', 'netBack'].includes(e.k) && U(e.a) && U(e.a).side === 0)")
rep("healAbort: `✚ ${n(e.a)} 붓던 치료를 끊음`,","healAbort: `✚ ${n(e.a)} 붓던 치료를 끊음`, offAct: `📵 ${n(e.a)} 연락 두절 — ${{ post: '마지막 임무대로 자리를 지킴', target: '마지막 임무의 표적을 계속', rejoin: '지휘관을 마지막으로 본 자리로 합류', rejoinErr: '지휘관 쪽으로 어림 (빗나갈 수 있음)' }[e.kind]}`, flankMis: `🔨 ${n(e.a)} ${n(e.b)}의 옆 · 뒤를 잘못 짐작해 앞쪽으로`, rally: `🚩 ${n(e.a)} 임시 집결 — ${e.why} (들음 ${e.got.length} · 못 들음 ${e.miss.length})`, netBack: `📶 ${n(e.a)} 연락 회복 (${e.sec}초 만에)`,")
# 칩 · 상세: 연락 두절 · 망치 · 모루
rep("  const xm = !u.ordPend &&","  const nf = u.offFrom != null && Wd.t - u.offFrom >= 6 && !u.posUnk ? `<span class=\"lk r\" title=\"지휘관과 ${Math.round(Wd.t - u.offFrom)}초째 닿지 않음 — 마지막 임무로 스스로 판단 중\">📵 ${Math.round(Wd.t - u.offFrom)}초</span>` : '', hm = u.hm ? `<span class=\"lk c\" title=\"${u.hm.k === 'anvil' ? '모루 — 상대를 붙들어 동료가 옆 · 뒤로 돌게 함' : '망치 — 붙들린 상대의 옆 · 뒤로 돌아 들어가는 중'}\">${u.hm.k === 'anvil' ? '⚓' : '🔨'}</span>` : '';\n  const xm = !u.ordPend &&")
rep("  return xm + dv + `<span class=\"lk ${cl}\"","  return nf + hm + xm + dv + `<span class=\"lk ${cl}\"")
rep("    ${!ed && u.alive && (u.side === 0 || see) && u.lastDec","    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) && (u.hm || u.offFrom != null || u.rally) ? `<span class=\"tr\"><span class=\"lb\">상황</span> ${[u.hm ? (u.hm.k === 'anvil' ? '⚓ 모루 — ' + esc(Wd.units[u.hm.b].name) + '를 붙듦' : '🔨 망치 — ' + esc(Wd.units[u.hm.b].name) + '의 옆 · 뒤로') : '', u.offFrom != null && Wd.t - u.offFrom >= 6 ? '📵 연락 두절 ' + Math.round(Wd.t - u.offFrom) + '초 — 마지막 임무로 판단' : '', u.rally && Wd.t < u.rally.until ? '🚩 집결지 ' + coord(u.rally.x, u.rally.y) + '로 (' + esc(Wd.units[u.rally.by] ? Wd.units[u.rally.by].name : '') + '의 부름)' : ''].filter(Boolean).join(' · ')}</span>` : ''}\n    ${!ed && u.alive && (u.side === 0 || see) && u.lastDec")
# 판: 집결 깃발
rep("  if (!ed && Wd.spareAt && Wd.spare > 0){ const cu = Wd.units[Wd.spareAt.by];","  if (!ed && Wd.rally && Wd.t < Wd.rally.until){ const rx = ox + Wd.rally.x * ts, ry = oy + Wd.rally.y * ts, fs = Math.max(13, Math.min(22, ts * 0.6)); ctx.save(); ctx.strokeStyle = 'rgba(255,214,110,.75)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(rx, ry, ts * 1.8, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); ctx.font = `${fs}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🚩', rx, ry); ctx.font = `700 ${Math.max(9, fs * 0.5)}px sans-serif`; ctx.fillStyle = '#ffd66e'; ctx.fillText('집결', rx, ry + fs * 0.85); ctx.restore(); }   // v7.9.4 임시 집결 깃발\n  if (!ed && Wd.spareAt && Wd.spare > 0){ const cu = Wd.units[Wd.spareAt.by];")
# 측면 기동: 명령 (단추 · 탭)
for old in ["armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn' || armed.k === 'supp' || armed.k === 'flare'"]:
    rep(old, old+" || armed.k === 'flank'", 2)
rep("  else if (k === 'assn'){ armed = armed && armed.k === 'assn' ? null :","  else if (k === 'flank'){ const ok = L.filter(u => !u.crawl && !isFar(u)); if (!ok.length){ toast('측면 기동은 근접 · 기동 아군만 (사수는 자리를 옮겨 쏨)'); return; } armed = armed && armed.k === 'flank' ? null : { k: 'flank', cas: ok.map(u => u.i) }; if (armed) toast(armedTxt() + ' — ' + ok.map(u => u.name).join(' · ') + (ok.length < L.length ? ' (사수는 빠짐)' : '')); }   // v7.9.4 측면 기동\n  else if (k === 'assn'){ armed = armed && armed.k === 'assn' ? null :")
rep("  if (k === 'assn'){ if (!(u && u.side === 1)){ toast('암살: 적을 탭 · 아래로 쓸면 취소'); return; }","""  if (k === 'flank'){ if (!(u && u.side === 1)){ toast('측면 기동: 옆 · 뒤로 돌아 들어갈 적을 탭 · 아래로 쓸면 취소'); return; }   // v7.9.4
    const L2 = armed.cas.map(i => Wd.units[i]).filter(x => x && x.alive); if (!L2.length) return done();
    L2.forEach(x => { x.order = { k: 'flank', b: u.i }; }); sel = new Set(L2.map(x => x.i)); noteOrders(L2, 'user', '측면 기동');
    const pin = Wd.hm && Wd.hm.pins.get(u.i);
    toast(`${L2.map(x => x.name).join(' · ')} → ${u.name}의 옆 · 뒤로 돌아 들어감${pin && pin.length ? ' — ' + pin.map(i => Wd.units[i].name).join(' · ') + '이(가) 붙들고 있어요 (모루)' : ' — 아직 붙들어 줄 이가 없어요 (이른 기동 · 위험)'}`); return done(); }
  if (k === 'assn'){ if (!(u && u.side === 1)){ toast('암살: 적을 탭 · 아래로 쓸면 취소'); return; }""")
rep("scout: '🔭 정찰: 살펴","flank: '🔄 측면 기동: 옆 · 뒤로 돌아 들어갈 적을 탭', scout: '🔭 정찰: 살펴")
# 도크 · 데스크톱 단추
rep("      + (L.length === 1 && !L[0].crawl ? `<button type=\"button\" class=\"db ${sacConf","      + (L.some(u => !u.crawl && !isFar(u)) ? `<button type=\"button\" class=\"db ${armed && armed.k === 'flank' ? 'on' : ''}\" data-dk=\"flank\"><span class=\"ic\">🔄</span>측면</button>` : '')\n      + (L.length === 1 && !L[0].crawl ? `<button type=\"button\" class=\"db ${sacConf")
rep("['amove', 'hold', 'auto', 'line', 'lret', 'scout', 'assn',","['amove', 'hold', 'auto', 'line', 'lret', 'scout', 'flank', 'assn',")
rep("""<button class="btn" type="button" data-ord="sac" title""","""<button class="btn ${armed && armed.k === 'flank' ? 'on' : ''}" type="button" data-ord="flank" title="적 하나를 찍으면 그 적의 옆 · 뒤 (붙들어 주는 동료 반대쪽) 로 돌아 들어가 침 — 붙들어 줄 이가 없으면 위험">🔄 측면 기동</button><button class="btn" type="button" data-ord="sac" title""")
rep("y: 'scout', u: 'assn',","y: 'scout', n: 'flank', u: 'assn',")
open(f,'w').write(s); print('ok')
