# v9.14.0 페이지 — page9380.py v1.1 (v1.1: 2층 1S 헌팅나이프 · 카밀라 = 제3세력 (2편 · 전우조 · 우리 편에 비선공 · 공격하면 적대) · 다시 하기에도 r8 설정 (제3세력 · 손님 · 출구) 이 다시 얹힘 · 로그 provoke · v1.0: 엔진 patch9340 (역장 몸 · 방패 파동 · 질주 · 돌격 닿음) · 역장을 누르면 역장 치기 · 암계 방패병에 방패 파동 · 헌팅나이프 기동 (세모) · 나달 보병 (동그라미) · 시간 표기 = 현실 초 — 빠르기는 예전 1× 그대로 (v9.13.0 의 ×4 되돌림) · 판의 0.25초 = 현실 1초라 보이는 시간 수치는 모두 ×4 (칸/초 · 초당 · /초 는 ÷4): 로그 · 상세 · 상태 · 알림 · 판 위 글 · 복사한 기록 모두)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9370.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep("    let budget = dt * speed * 4 * (slowNow() ? FOCUS_SLOW : 1) * fxTimeK();   /* v9.13.0 1× = 현실 시간 (단추 값 0.25 = 1× · 1 = 4×) — 전엔 1× 가 실제로 0.25배 */", "    let budget = dt * speed * (slowNow() ? FOCUS_SLOW : 1) * fxTimeK();   /* v9.14.0 빠르기는 예전 1× 그대로 (v9.13.0 의 ×4 되돌림) — 보이는 시간 수치를 현실 초로 (rtTxt) */")
TS = open(D + '_rt_tsc.js', encoding='utf-8').read().replace("if (typeof module !== 'undefined') module.exports = { rtTxt };\n", '')
rep("function toast(msg){ const t = $('toast');", "/* v9.14.0 시간 표기 = 현실 초: 1× 에서 판의 0.25초가 현실 1초 — 보이는 시간 수치 ×4 · 칸/초 · 초당 · /초 ÷4 (판 안의 셈은 그대로) */\n" + TS + """const rtTitle = el => { if (el.title && el.title.indexOf('초') >= 0) el.title = rtTxt(el.title); };
function rtNode(n){ if (n.nodeType === 3){ const v = n.nodeValue; if (v && v.indexOf('초') >= 0){ const w = rtTxt(v); if (w !== v) n.nodeValue = w; } return; } if (n.nodeType !== 1 || n.closest && n.closest('[data-rawtime],script,style,textarea,input')) return; if (n.title) rtTitle(n); const T = document.createTreeWalker(n, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT); let c; while ((c = T.nextNode())){ if (c.nodeType === 1){ if (c.title) rtTitle(c); continue; } const v = c.nodeValue; if (v && v.indexOf('초') >= 0){ const w = rtTxt(v); if (w !== v) c.nodeValue = w; } } }
{ const cp = CanvasRenderingContext2D.prototype; for (const k of ['fillText', 'strokeText']){ const f = cp[k]; cp[k] = function(t, ...a){ return f.call(this, typeof t === 'string' && t.indexOf('초') >= 0 ? rtTxt(t) : t, ...a); }; } }   /* 판 위 글 */
function toast(msg){ msg = rtTxt(msg); const t = $('toast');""")
rep("async function copyText(txt, ok){\n", "async function copyText(txt, ok){\n  txt = rtTxt(txt);   /* v9.14.0 복사한 기록도 현실 초 */\n")
rep("requestAnimationFrame(frame);\n</script>", """requestAnimationFrame(frame);
/* v9.14.0 보이는 글의 시간 수치를 현실 초로 — #app 안 (머리말 · 버전 기록은 그대로) */
{ const A = document.getElementById('app'); if (A){ rtNode(A); new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) rtNode(n); }).observe(A, { childList: true, subtree: true }); } }
</script>""")
rep('<!-- 굴의 전투판 v9.13.0 (2026-10-29)', '<!-- 굴의 전투판 v9.14.0 (2026-10-29)')
rep('     v9.13.0: 총안 다시', '''     v9.14.0: 시간 표기 = 현실 초 (빠르기는 예전 1× — 보이는 시간 ×4 · 칸/초 ÷4) · 역장 = 방패병과 함께 움직이는 몸 (따로 칠 수 있음 · 방패병이 천천히 돎) · 방패 파동 · 돌격 닿음 (무기 먼저 · 몸 확률 · 피해도 관성으로 부딪힘) · 헌팅나이프 기동 · 암습 = 우회 질주 · 나달 보병
     v9.13.0: 총안 다시''')
for a, b in (('h1::after{content:" v9.13.0"', 'h1::after{content:" v9.14.0"'), ('<footer>굴의 전투판 v9.13.0', '<footer>굴의 전투판 v9.14.0'), ('return `굴의 전투판 v9.13.0 · ${title}', 'return `굴의 전투판 v9.14.0 · ${title}'),
             ("copyText('굴의 전투판 v9.13.0 자동 판 기록", "copyText('굴의 전투판 v9.14.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.13.0 — ${C.run", "o.push(`굴의 전투판 v9.14.0 — ${C.run"),
             ('의 버전 기록에 — v9.13.0 총안 · 막힘', '의 버전 기록에 — v9.14.0 현실 초 · 역장 · 돌격 · 암습 / v9.13.0 총안 · 막힘'),
             ('">v9.13.0 총안 (총구가 전열 앞)', '">v9.14.0 현실 초 표기 · 역장 몸 · 방패 파동 · 돌격 닿음 · 암습 우회 · v9.13.0 총안 (총구가 전열 앞)'),
             ("ver: '9.13.0', kind:", "ver: '9.14.0', kind:"), ("RULES_MIG = '9.13.0',", "RULES_MIG = '9.14.0',")):
    rep(a, b)
rep("  return !o ? ['자동', '#d8cfc0'] : o.k === 'swap' ?", "  return !o ? ['자동', '#d8cfc0'] : o.k === 'fatk' ? ['🗡 역장 치기', '#c9a6ff'] : o.k === 'swap' ?")
rep("      case 'hamb': out.push(", """      case 'bwave': out.push(`${T(e)}🛡💥 ${n(e.a)} 방패 파동 — 앞의 ${e.n}명을 밀어냄`); break;   /* v9.14.0 */
      case 'fieldHit': out.push(`${T(e)}🗡 ${n(e.a)} → ${n(e.b)}의 역장 −${e.n} (남은 내구 ${e.left})`); break;
      case 'hambKill': out.push(`${T(e)}☠ ${n(e.a)} 암습 — 끝까지 들키지 않아 ${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 단숨에 끝냄`); break;
      case 'chgFollow': out.push(`${T(e)}💨 ${n(e.a)} — 무기를 박고도 멈추지 못해 몸까지 들이닥침 (남은 속력 ${e.v}칸/초)`); break;
      case 'hamb': out.push(""")
rep("    case 'hamb': return {", """    case 'bwave': return { c: 'bad', s: `${ga(n(e.a))} 방패를 내지르자 파동이 앞을 쓸어 낸다.` };   /* v9.14.0 */
    case 'hambKill': return { c: 'bad', s: `${n(e.b)}${jong(n(e.b)) ? '은' : '는'} 무엇이 다가왔는지도 모른 채 쓰러진다.` };
    case 'chgFollow': return { c: '', s: `${ga(n(e.a))} 무기를 박고도 멈추지 못한다 — 몸이 그대로 들이닥친다.` };
    case 'hamb': return {""")
rep("  '밀치기 돌진': '암계 창방패병", "  '방패 파동': '암계 방패병 — 제자리에서 방패를 내질러 앞 (±70° · 몸 + 1.9칸) 의 적을 밀어냄 (가벼울수록 멀리) · 피해는 작고 (공격 × 0.35) 휘청 0.3초 · 자세 −25 — 붙은 진형을 무너뜨리는 기술. 대기 9초.',\n  '밀치기 돌진': '암계 창방패병")
rep("active: ['암계 역장'], gear: { 몸: { name: '암계 흉갑', mat: '판금', tier: 3 }, 머리: { name: '암계 투구', mat: '투구', tier: 3 } } }, '", "active: ['암계 역장', '방패 파동'], gear: { 몸: { name: '암계 흉갑', mat: '판금', tier: 3 }, 머리: { name: '암계 투구', mat: '투구', tier: 3 } } }, '")
rep("  ['헌팅나이프', 'C-290', 4, { cls: '기동', weapon: '단검', height: 1.85,", "  ['헌팅나이프', 'C-290', 4, { cls: '기동', role: '미드필더', weapon: '단검', height: 1.85,")
rep("  ['헌팅나이프', 'C-290', 4, { cls: '기동', weapon: '단검', height: 2.0,", "  ['헌팅나이프', 'C-290', 4, { cls: '기동', role: '미드필더', weapon: '단검', height: 2.0,")
rep("{ key: '나달', side: 0, ref: 'C-198', name: '나달', tier: 2, cls: '근접', role: '전선',", "{ key: '나달', side: 0, ref: 'C-198', name: '나달', tier: 2, cls: '근접', role: '공격수',")
rep("  if (u && u.side !== 0){ giveAttack(u, add || detourArm); return; }\n  // v5.4.2", """  if (u && u.side !== 0){ giveAttack(u, add || detourArm); return; }
  { const F = fieldAt(world, w.x, w.y); if (F && selUnits(world).length){ giveFieldAtk(F); return; } }   /* v9.14.0 역장을 누르면 역장 치기 */
  // v5.4.2""")
rep("function giveAttack(t, det){", """// v9.14.0 역장 = 따로 칠 수 있는 몸: 누른 자리 가까이 (두께 + 0.35칸) 의 상대 편 역장
function fieldAt(Wd, x, y){ return (Wd && Wd.sf8 || []).find(F => F.k === 'wall' && F.hard && F.side !== 0 && Wd.t < F.until && wallQ(F, x, y).d <= (F.th || 0.8) / 2 + 0.35) || null; }
function giveFieldAtk(F){ const L = selUnits(world).filter(u => u.side === 0 && u.alive); if (!L.length){ toast('먼저 명령할 아군을 고르세요'); return; }
  const M = L.filter(u => !isFar(u)), G = L.filter(isFar); M.forEach(u => { u.order = { k: 'fatk', f: F.id }; }); noteOrders(M); hud();
  toast(M.length ? `${M.map(u => u.name).join(' · ')} → ${(world.units[F.by] || {}).name || ''}의 역장 치기 (내구 ${Math.round(F.hp)})${G.length ? ' · 사수는 쏘면 역장이 깎여요' : ''}` : '사수는 역장을 쏘면 깎여요 — 근접을 골라 치게 하세요'); }
function giveAttack(t, det){""")
rep("if (!S.draft) S.draft = { ...newDraft(), done: true,", "for (const L0 of [S.units || [], ...(S.campBak ? [S.campBak.units || []] : [])]) for (const u of L0){ if (u.ref === 'C-198' && u.role === '전선') u.role = '공격수'; if (u.ref === 'C-290' && !u.role) u.role = '미드필더'; }   /* v9.14.0 나달 = 보병 (동그라미) · 헌팅나이프 = 기동 (세모) — 저장된 판도 */\nif (!S.draft) S.draft = { ...newDraft(), done: true,")
exec(open(D + '_p9380third.py', encoding='utf-8').read())   # v1.1 제3세력 심계 · 다시 하기
open(F, 'w', encoding='utf-8').write(s)
print('page9380 OK')
