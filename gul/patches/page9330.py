# v9.10.0 페이지 — page9330.py v1.0 (v1.0: 점검 바로잡기의 글 — 로그 · 이야기 줄: 따를이가 사수에게 (🤝🏹) · 방패 뒤로 숨음 (hitCover) · 이유 글 (HIT_COVER) · 버전 v9.10.0 · 엔진 patch9280 (양쪽 편 견제사격 · 날아온 쪽으로 돌아섬 · 사수 · 치유는 방패 뒤로 · 빼꼼 넓힘 · 무거운 돌격만 받침 · 재집결 거리 바로잡기 · 2편대 조합 버프 없앰 · 따를이 적극 가담))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9320.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.9.9 (2026-10-26)', '<!-- 굴의 전투판 v9.10.0 (2026-10-26)')
rep('     v9.9.9: 보호 = 대장 관계', '''     v9.10.0: 점검 — 보이지 않는 궁수 하나에 무너지던 판 바로잡기: 견제사격 양쪽 편 · 맞으면 날아온 쪽으로 돌아섬 · 사수 · 치유는 방패 뒤로 · 따를이는 사수에게 적극 · 빼꼼 넓힘 · 개의 덮침엔 받치러 뛰지 않음
     v9.9.9: 보호 = 대장 관계''')
for a, b in (('h1::after{content:" v9.9.9"', 'h1::after{content:" v9.10.0"'), ('<footer>굴의 전투판 v9.9.9', '<footer>굴의 전투판 v9.10.0'), ('return `굴의 전투판 v9.9.9 · ${title}', 'return `굴의 전투판 v9.10.0 · ${title}'),
             ("copyText('굴의 전투판 v9.9.9 자동 판 기록", "copyText('굴의 전투판 v9.10.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.9.9 — ${C.run", "o.push(`굴의 전투판 v9.10.0 — ${C.run"),
             ('의 버전 기록에 — v9.9.9 보호 = 대장 관계 (보호받을이)', '의 버전 기록에 — v9.10.0 점검 바로잡기 (보이지 않는 궁수) / v9.9.9 보호 = 대장 관계 (보호받을이)'),
             ('">v9.9.9 보호 = 대장의 보호받을이', '">v9.10.0 보이지 않는 궁수에 맞서기 (견제사격 · 돌아섬 · 따를이 적극) · v9.9.9 보호 = 대장의 보호받을이'),
             ("ver: '9.9.9', kind:", "ver: '9.10.0', kind:"), ("RULES_MIG = '9.9.9',", "RULES_MIG = '9.10.0',")):
    rep(a, b)
rep("      case 'pairGo': out.push(", "      case 'hitCover': out.push(`${T(e)}🛡 ${n(e.a)} — ${n(e.c)}의 화살을 피해 ${n(e.b)} 뒤로`); break;   /* v9.10.0 */\n      case 'pairGo': if (e.how === 'shooter'){ out.push(`${T(e)}🤝🏹 ${n(e.a)} — ${n(e.b)}의 따를이 · 사수 ${n(e.tg)}에게 달려감`); break; }\n      case 'pairGo_': out.push(")
rep("    case 'pairGo': return e.how === 'keep'", "    case 'hitCover': return { c: '', s: `${ga(n(e.a))} ${n(e.b)}의 등 뒤로 몸을 숨긴다.` };   /* v9.10.0 */\n    case 'pairGo': return e.how === 'shooter' ? { c: 'good', s: `${ga(n(e.a))} 활을 든 ${n(e.tg)}에게 달려든다.` } : e.how === 'keep'")
rep("PAIR_COVER: '대장을 방패로 (겨눠짐)' };", "PAIR_COVER: '대장을 방패로 (겨눠짐)', HIT_COVER: '방패 뒤로 (사수를 피함)', PAIR_SHOOTER: '사수에게 달려감' };")
open(F, 'w', encoding='utf-8').write(s)
print('page9330 OK')
