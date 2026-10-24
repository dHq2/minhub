# v9.6.3 페이지 — page9120.py v1.0 (v1.0: 민수 판 분석 — 로그 버그 (협공 약속이 '💧 정령 계약 — undefined명' 으로 찍히던 것 · 자율 판단의 undefined · 종류의 spec · 철퇴를 '던지려다') · 로그 머리에 전우조 · 대장 · 협공 약속에 (전우조) 표시 · 찍기 예고는 한 점 (표적 자리 원 + 겨눈 점선) · 카리우스 기술 예고는 동료도 맞으니 아군 쪽도 주황 · 동료 공격을 피함 · 자리를 지키다 화살 맞고 움직임 로그)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9110.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.6.2 (2026-10-24)', '<!-- 굴의 전투판 v9.6.3 (2026-10-24)')
rep('     v9.6.2: 전우조 · 대장 연결이 눈에 띄게', '''     v9.6.3: 판 분석 고침 — 로그에 전열 이름이 수백 번 찍히던 것 (버팀 계산이 명단을 늘림) · 협공 약속이 '💧 정령 계약 — undefined명' 으로 찍히던 것 · 자율 판단 undefined · 카리우스 기술은 자리 안의 동료도 맞음 (오사) · 찍기는 한 점 (표적 둘레 0.45칸) — 예고도 점으로 · 위험 범위의 동료는 서둘러 피함 (모든 예고 공격 · 제자리 명령이어도) · 카리우스는 못 피할 동료가 걸리면 기술을 아낌 · 자리를 지키다 화살을 맞으면 쏜 쪽으로 (날쌘 이) 또는 본대로 · 로그 머리에 전우조 · 대장
     v9.6.2: 전우조 · 대장 연결이 눈에 띄게''')
for a, b in (('h1::after{content:" v9.6.2"', 'h1::after{content:" v9.6.3"'), ('<footer>굴의 전투판 v9.6.2', '<footer>굴의 전투판 v9.6.3'), ('return `굴의 전투판 v9.6.2 · ${title}', 'return `굴의 전투판 v9.6.3 · ${title}'),
             ("copyText('굴의 전투판 v9.6.2 자동 판 기록", "copyText('굴의 전투판 v9.6.3 자동 판 기록"), ("o.push(`굴의 전투판 v9.6.2 — ${C.run", "o.push(`굴의 전투판 v9.6.3 — ${C.run"),
             ('의 버전 기록에 — v9.6.2 전우조', '의 버전 기록에 — v9.6.3 판 분석 고침 (오사 · 피하기 · 로그) / v9.6.2 전우조'),
             ('">v9.6.2 · 전우조 · 대장 단추 눈에 띄게 · 대장 서둘러 · 암계 역장</span>', '">v9.6.3 · 찍기 한 점 · 동료 공격 피하기 · 로그 고침 · 전우조 단추</span>'),
             ("ver: '9.6.2', kind:", "ver: '9.6.3', kind:"), ("RULES_MIG = '9.6.2',", "RULES_MIG = '9.6.3',")):
    rep(a, b)
# 협공 약속 (pact) 과 물레의 정령 계약이 같은 이름이라 앞의 것만 걸려 약속이 '💧 정령 계약 — undefined명' 으로 찍히던 것 → 물레 쪽은 pact8 (엔진 patch9090)
rep("      case 'pact': out.push(`${T(e)}💧 ◆정령 계약", "      case 'pact8': out.push(`${T(e)}💧 ◆정령 계약")
rep("    case 'pact': return e.side === 0 ? { c: 'good', s: `물레가 두 손을 모은다", "    case 'pact8': return e.side === 0 ? { c: 'good', s: `물레가 두 손을 모은다")
# 협공 약속에 (전우조) 표시
rep("function pactTxt(Wd, e){ const n = i => Wd.units[i] ? Wd.units[i].name : '?', A = n(e.a), B = n(e.b), X = n(e.x);\n  return e.p === 'pin'",
    "function pactTxt(Wd, e){ const n = i => Wd.units[i] ? Wd.units[i].name : '?', A = n(e.a), B = n(e.b), X = n(e.x), ua = Wd.units[e.a], ub = Wd.units[e.b], mate = ua && ub && ua.cg && ua.cg === ub.cg;\n  return (mate ? '[전우조] ' : '') + (e.p === 'pin'")
rep(" 겨눔 (교대 엄호)` : e.p; }", " 겨눔 (교대 엄호)` : e.p); }")
# 로그 머리: 전우조 · 대장
rep("]).map(t => ' · ◆[' + t + ']').join(''); })()}${(u.traits || []).map(t => ' · [' + t + ']').join('')}`).join('\\n');",
    "]).map(t => ' · ◆[' + t + ']').join(''); })()}${(u.traits || []).map(t => ' · [' + t + ']').join('')}${(() => { const ms = u.cg ? Wd.units.filter(m => m !== u && m.side === u.side && m.cg === u.cg) : [], C = u.chiefLk && u.sqLead != null ? Wd.units[u.sqLead] : null; return (ms.length ? ' · 🤝 전우조 ' + ms.map(m => m.name).join('·') : '') + (C ? ' · 🎖 대장 ' + C.name : ''); })()}`).join('\\n');   /* v9.6.3 관계 */")
# 자율 판단: 빠진 문구
rep("'sqFall', 'sqCall', 'sqJoin', 'sqLeave', 'succeed'].includes(e.k)", "'sqFall', 'sqCall', 'sqJoin', 'sqLeave', 'succeed', 'mateRescue', 'stayShot'].includes(e.k)")
rep("pushNo: `🛡 ${n(e.a)} ${n(e.b)}의 방패 정면을 피함` }[e.k]}",
    "pushNo: `🛡 ${n(e.a)} ${n(e.b)}의 방패 정면을 피함`, succeed: `🚩 ${n(e.a)} 지휘를 이어받음 (${n(e.from)} ${e.left ? '먼저 올라감' : '쓰러짐'})`, sqFall: `↩ ${n(e.a)} 편대가 밀려 본대로`, sqCall: `🎖 ${n(e.a)} 부하들에게 ${n(e.b)} 먼저 치라고 외침`, sqJoin: `🎖 ${n(e.a)} ${n(e.b)}를 따름 (지휘관과 닿지 않음)`, sqLeave: `🎖 ${n(e.a)} 지휘관과 닿아 본대로`, mateRescue: `🛟 ${n(e.a)} 위급한 전우 ${n(e.v)}을(를) 노리는 ${n(e.b)}에게`, stayShot: stayShotTxt(e, n) }[e.k] || e.k}")
rep("function pactTxt(Wd, e){", "const stayShotTxt = (e, n) => `🏹 ${n(e.a)} 자리를 지키다 화살을 맞음 → ${e.b != null ? n(e.b) + '에게 달려듦' : e.how === 'hunt' ? (e.dir || '') + ' 날아온 쪽으로 쫓아감' : '본대로 물러남'}`;   // v9.6.3\nfunction pactTxt(Wd, e){")
rep("      case 'mateRescue': out.push(", "      case 'stayShot': out.push(`${T(e)}${stayShotTxt(e, n)}`); break;   // v9.6.3\n      case 'mateRescue': out.push(")
rep("    case 'mateRescue': return {", "    case 'stayShot': return { c: 'dim', s: e.how === 'hunt' ? `${ga(n(e.a))} 화살이 날아온 어둠 쪽으로 몸을 날린다.` : `${ga(n(e.a))} 화살을 맞고 동료들 곁으로 물러난다.` };   // v9.6.3\n    case 'mateRescue': return {")
# 예고 피하기: 동료 공격
rep("      case 'tgDodge': out.push(`${T(e)}❗ ${n(e.a)} — ${n(e.b)}의 ${reul(e.what)} 보고 몸을 날려 피함`); break;",
    "      case 'tgDodge': out.push(e.ff ? `${T(e)}❗ ${n(e.a)} — \"비켜!\" ${n(e.b)}의 ${e.what} 범위에서 서둘러 빠짐 (동료의 공격)` : `${T(e)}❗ ${n(e.a)} — ${n(e.b)}의 ${reul(e.what)} 보고 몸을 날려 피함`); break;   /* v9.6.3 */")
rep("      case 'tgLate': out.push(`${T(e)}… ${n(e.a)} — ${n(e.b)}의 ${reul(e.what)} 봤지만 늦음`); break;",
    "      case 'tgLate': out.push(`${T(e)}… ${n(e.a)} — ${n(e.b)}의 ${reul(e.what)} ${e.ff ? '피하려 했지만 늦음 (동료의 공격)' : '봤지만 늦음'}`); break;")
rep("    case 'tgDodge': return { c: U(e.a).side ? 'dim' : 'good', s: `\"!\" — ${ga(n(e.a))} ${n(e.b)}의 ${reul(e.what)} 보고 몸을 날려 피한다.` };",
    "    case 'tgDodge': return { c: U(e.a).side ? 'dim' : 'good', s: e.ff ? `\"비켜!\" — ${ga(n(e.a))} ${n(e.b)}의 ${e.what} 자리에서 허둥지둥 빠진다.` : `\"!\" — ${ga(n(e.a))} ${n(e.b)}의 ${reul(e.what)} 보고 몸을 날려 피한다.` };")
# 종류 요약 · 철퇴 문구
rep("pickSpear: '창 줍기', leap: '도약' }", "pickSpear: '창 줍기', leap: '도약', spec: '기술', palm: '팜 버스트' }")
rep("${e.jav || e.flail ? '던지려다' :", "${e.jav ? '던지려다' : e.flail ? '휘두르려다' :")
# 예고 그림: 찍기 = 한 점 (표적 자리 원 + 겨눈 점선 + 가운데 점) · 넓게 휘두르기는 부채꼴 그대로
rep("    if (!ed && u.act && u.act.k === 'spec' && u.act.phase === 'wind' && u.act.s === 'boulder'){",
    "    if (!ed && u.act && u.act.k === 'atk' && u.act.phase === 'wind' && u.act.mode === 'smash' && Wd.units[u.act.b]){ const H2 = Wd.rules.heavy || {}, b = Wd.units[u.act.b], k = Math.min(1, (now - u.act.t0) / Math.max(0.05, u.act.end - u.act.t0)), cx = ox + b.x * ts, cy = oy + b.y * ts, R2 = ((H2.splash != null ? H2.splash : 0.45) + 0.25) * ts;   /* v9.6.3 찍기 예고: 한 점 (그 둘레에 걸친 몸은 동료도 맞음) */\n      ctx.save(); ctx.strokeStyle = 'rgba(255,170,80,.85)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = `rgba(255,150,60,${(0.14 + 0.24 * k).toFixed(2)})`; ctx.beginPath(); ctx.arc(cx, cy, R2, 0, 6.283); ctx.fill(); ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = 'rgba(255,190,110,.95)'; ctx.beginPath(); ctx.arc(cx, cy, Math.max(2.5, R2 * 0.18 + R2 * 0.25 * k), 0, 6.283); ctx.fill(); ctx.restore(); }\n    if (!ed && u.act && u.act.k === 'spec' && u.act.phase === 'wind' && u.act.s === 'boulder'){")
# 카리우스 기술 예고: 동료도 맞으니 아군 쪽 그림도 주황
rep("    if (A.k !== 'spec' || A.phase !== 'wind' || !KAR_TG.includes(A.s)) continue;", "    if (A.k !== 'spec' || A.phase !== 'wind' || !KAR_TG.includes(A.s)) continue;\n    if (!u.side && A.s !== 'akick') col = '255,160,70';   /* v9.6.3 카리우스 기술은 동료도 맞음 — 주황 */")
rep("    const col = u.side ? '255,70,60' : '110,190,255', px = ox + u.x * ts, py = oy + u.y * ts;\n    if (A.k === 'charge' && A.sup)", "    let col = u.side ? '255,70,60' : '110,190,255'; const px = ox + u.x * ts, py = oy + u.y * ts;\n    if (A.k === 'charge' && A.sup)")
open(F, 'w', encoding='utf-8').write(s)
print('page9120 OK')
