# v9.6.4 페이지 — page9130.py v1.0 (v1.0: 떨어진 물건을 두 번 누르면 (더블클릭 · 두 번 탭) 서둘러 주우러 감 · 전우조 · 부하 붙어 다니기 로그 (곁으로 · 옆구리로 질주))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9120.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.6.3 (2026-10-24)', '<!-- 굴의 전투판 v9.6.4 (2026-10-24)')
rep('     v9.6.3: 판 분석 고침', '''     v9.6.4: 떨어진 물건을 두 번 누르면 서둘러 주우러 감 · 전우조 · 부하는 3칸 넘게 떨어지지 않으려 함 (짝의 측후방으로) · 짝이 돌격하면 그 대상의 옆구리로 질주해 함께 침 (사수는 짝의 측후방) — 양쪽 편 같은 규칙
     v9.6.3: 판 분석 고침''')
for a, b in (('h1::after{content:" v9.6.3"', 'h1::after{content:" v9.6.4"'), ('<footer>굴의 전투판 v9.6.3', '<footer>굴의 전투판 v9.6.4'), ('return `굴의 전투판 v9.6.3 · ${title}', 'return `굴의 전투판 v9.6.4 · ${title}'),
             ("copyText('굴의 전투판 v9.6.3 자동 판 기록", "copyText('굴의 전투판 v9.6.4 자동 판 기록"), ("o.push(`굴의 전투판 v9.6.3 — ${C.run", "o.push(`굴의 전투판 v9.6.4 — ${C.run"),
             ('의 버전 기록에 — v9.6.3 판 분석 고침', '의 버전 기록에 — v9.6.4 짝 붙어 다니기 · 두 번 눌러 서둘러 줍기 / v9.6.3 판 분석 고침'),
             ('">v9.6.3 · 찍기 한 점 · 동료 공격 피하기 · 로그 고침 · 전우조 단추</span>', '">v9.6.4 · 짝 붙어 다니기 (돌격하면 옆구리로) · 두 번 눌러 서둘러 줍기</span>'),
             ("ver: '9.6.3', kind:", "ver: '9.6.4', kind:"), ("RULES_MIG = '9.6.3',", "RULES_MIG = '9.6.4',")):
    rep(a, b)
# 두 번 눌러 서둘러 줍기
rep("function givePick(it){", "let pickTap = null;   // v9.6.4 같은 물건을 0.45초 안에 다시 누르면 서둘러\nfunction givePick(it, hurry){")
rep("  const u = C[0]; u.order = { k: 'pick', id: it.id }; noteOrders([u]); toast(`${u.name} → ${it.name} 주우러",
    "  const u = C.find(x => x.order && x.order.k === 'pick' && x.order.id === it.id) || C[0]; u.order = { k: 'pick', id: it.id, ...(hurry ? { hurry: true } : {}) }; noteOrders([u]); toast(`${u.name} → ${it.name} ${hurry ? '서둘러 ' : ''}주우러")
rep("  { const it = L.length && !amovePick ? pickAt(world, L, w.x, w.y, 0.45) : null; if (it){ givePick(it); return; } }",
    "  { const it = L.length && !amovePick ? pickAt(world, L, w.x, w.y, 0.45) : null; if (it){ const now0 = performance.now(), dbl = !!(pickTap && pickTap.id === it.id && now0 - pickTap.t < 450); pickTap = dbl ? null : { id: it.id, t: now0 }; givePick(it, dbl); return; } }   /* v9.6.4 두 번 누르면 서둘러 */")
# 로그 · 이야기 · 자율 판단
rep("      case 'stayShot': out.push(", "      case 'pairGo': out.push(`${T(e)}${e.how === 'flank' ? '🤝⚡' : '🤝'} ${n(e.a)} — ${e.how === 'flank' ? `${e.chief ? '대장' : '전우'} ${n(e.b)}의 돌격 → ${n(e.tg)}의 옆구리로 질주` : e.how === 'rear' ? `${e.chief ? '대장' : '전우'} ${n(e.b)}의 측후방으로 질주 (돌격을 받침)` : `${e.chief ? '대장' : '전우'} ${n(e.b)} 곁으로${e.run ? ' (질주)' : ''} — 3칸 넘게 떨어짐`}`); break;   // v9.6.4\n      case 'stayShot': out.push(")
rep("    case 'stayShot': return {", "    case 'pairGo': return e.how === 'keep' ? null : { c: 'good', s: e.how === 'flank' ? `${n(e.b)}${jong(n(e.b)) ? '이' : '가'} 내닫자 ${ga(n(e.a))} 곧장 ${n(e.tg)}의 옆구리로 달린다.` : `${ga(n(e.a))} ${n(e.b)}의 뒤를 받치러 달린다.` };   // v9.6.4\n    case 'stayShot': return {")
rep("'succeed', 'mateRescue', 'stayShot'].includes(e.k)", "'succeed', 'mateRescue', 'stayShot', 'pairGo'].includes(e.k) && !(e.k === 'pairGo' && e.how === 'keep')")
rep("stayShot: stayShotTxt(e, n) }[e.k] || e.k}", "stayShot: stayShotTxt(e, n), pairGo: `🤝 ${n(e.a)} ${e.how === 'flank' ? n(e.b) + '의 돌격 → ' + n(e.tg) + '의 옆구리로' : n(e.b) + '의 측후방으로'} (질주)` }[e.k] || e.k}")
open(F, 'w', encoding='utf-8').write(s)
print('page9130 OK')
