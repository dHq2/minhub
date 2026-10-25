# v9.9.3 페이지 — page9260.py v1.0 (v1.0: 버전 · 빼꼼 사격 로그 글 · 이유 글 (대장을 방패로) · 엔진 patch9210 (빼꼼 · 틈 사격) · patch9220 (지원 추종 · 부하 · 전우의 돌격 받침))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9250.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.9.1 (2026-10-25)', '<!-- 굴의 전투판 v9.9.3 (2026-10-25)')
rep('     v9.9.1: 관계 다시', '''     v9.9.3: 지원 추종 — 치유 · 사수 부하는 돌지 않고 대장 등 뒤 · 겨눠지면 대장을 방패 삼는 자리로 · 쏠 수 있을 때만 쏨 (치유라도 창 · 방패를 쥐면 보병) · 돌격이 대장 · 전우에게 오면 부하 · 전우가 (사수 · 치유도) 달려와 등 뒤를 받침
     v9.9.2: 빼꼼 사격 — 맞닿은 (0.2칸 안) 동료 하나 뒤의 사수는 어깨 너머로 몸을 내밀어 쏘고 돌아옴 · 맞닿은 앞줄 둘 사이 (이음매) 로도 · 그 자리에서 오사 판정은 그대로 · 두 줄 넘게 겹치면 막힘 (양쪽 편)
     v9.9.1: 관계 다시''')
for a, b in (('h1::after{content:" v9.9.1"', 'h1::after{content:" v9.9.3"'), ('<footer>굴의 전투판 v9.9.1', '<footer>굴의 전투판 v9.9.3'), ('return `굴의 전투판 v9.9.1 · ${title}', 'return `굴의 전투판 v9.9.3 · ${title}'),
             ("copyText('굴의 전투판 v9.9.1 자동 판 기록", "copyText('굴의 전투판 v9.9.3 자동 판 기록"), ("o.push(`굴의 전투판 v9.9.1 — ${C.run", "o.push(`굴의 전투판 v9.9.3 — ${C.run"),
             ('의 버전 기록에 — v9.9.1 관계 다시', '의 버전 기록에 — v9.9.3 지원 추종 · 받침 / v9.9.2 빼꼼 사격 / v9.9.1 관계 다시'),
             ('">v9.9.1 부하는 대장 등 뒤 · 🛡 보호 · 전우는 함께 기다림 · 막기 자동 · 돌격 한 가지</span>', '">v9.9.3 빼꼼 사격 · 지원 추종 · 부하는 대장 등 뒤 · 🛡 보호 · 막기 자동</span>'),
             ("ver: '9.9.1', kind:", "ver: '9.9.3', kind:"), ("RULES_MIG = '9.9.1',", "RULES_MIG = '9.9.3',")):
    rep(a, b)
rep("      case 'protGo': out.push(", "      case 'peek': out.push(`${T(e)}👀 ${n(e.a)} — ${n(e.c)}의 어깨 너머로 몸을 내밀어 ${n(e.b)}을(를) 겨눔 (빼꼼)`); break;   /* v9.9.2 */\n      case 'protGo': out.push(")
rep("    case 'protGo': return {", "    case 'peek': return { c: '', s: `${ga(n(e.a))} ${n(e.c)}의 어깨 너머로 몸을 내민다.` };   /* v9.9.2 */\n    case 'protGo': return {")
rep("PAIR_PROT: '보호 대상 곁으로' };", "PAIR_PROT: '보호 대상 곁으로', PAIR_COVER: '대장을 방패로 (겨눠짐)' };")
open(F, 'w', encoding='utf-8').write(s)
print('page9260 OK')
