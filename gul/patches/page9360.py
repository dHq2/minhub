# v9.12.0 페이지 — page9360.py v1.0 (v1.0: 버전 v9.12.0 · 엔진 patch9310 (세자르 다시) · 세자르 검 사거리 1.0 (0.75 에서 · 긴 검 + 내딛기) · 세자르 기술 중 상태 글 (공격 뒤 회복 8초 → 기술 이름) · 불쑥 기술 기록)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9350.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.11.0 (2026-10-28)', '<!-- 굴의 전투판 v9.12.0 (2026-10-28)')
rep('     v9.11.0: 빼꼼은', '''     v9.12.0: 세자르 다시 (2D 판 결) — 빠르게 몸을 돌리고 · 걸음 박자가 바뀜 (아주 천천히 · 걷기 · 뜀 · 질주 · 짧은 도약) · 탐색 중엔 일행 전체의 둘레를 돎 · 기술이 일찍 · 탐색 중에도 불쑥 하늘 가르기 · 관통 찌르기 · 냉기 참격 · 딜타임 기술 순서 무작위 · 검 사거리 1.0
     v9.11.0: 빼꼼은''')
for a, b in (('h1::after{content:" v9.11.0"', 'h1::after{content:" v9.12.0"'), ('<footer>굴의 전투판 v9.11.0', '<footer>굴의 전투판 v9.12.0'), ('return `굴의 전투판 v9.11.0 · ${title}', 'return `굴의 전투판 v9.12.0 · ${title}'),
             ("copyText('굴의 전투판 v9.11.0 자동 판 기록", "copyText('굴의 전투판 v9.12.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.11.0 — ${C.run", "o.push(`굴의 전투판 v9.12.0 — ${C.run"),
             ('의 버전 기록에 — v9.11.0 빼꼼 · 지휘관 임명', '의 버전 기록에 — v9.12.0 세자르 다시 / v9.11.0 빼꼼 · 지휘관 임명'),
             ('">v9.11.0 총안 (빼꼼)', '">v9.12.0 세자르 다시 (박자 · 둘레 · 불쑥 하늘 가르기) · v9.11.0 총안 (빼꼼)'),
             ("ver: '9.11.0', kind:", "ver: '9.12.0', kind:"), ("RULES_MIG = '9.11.0',", "RULES_MIG = '9.12.0',")):
    rep(a, b)
rep("weapon: '노인의 검', height: 2.1, weight: 70, poise: 6, ccRes: 0.85, sizeCls: '중대형', nv: true, nvG: 'S', bold: 1, ov: { hp: 500, atk: 62 },", "weapon: '노인의 검', height: 2.1, weight: 70, poise: 6, ccRes: 0.85, sizeCls: '중대형', nv: true, nvG: 'S', bold: 1, ov: { hp: 500, atk: 62, rng: 1.0 },   /* v9.12.0 긴 검 + 내딛기 (0.75 → 1.0 · 1.25 는 일행이 늘 전멸해 줄임) */")
rep("  return `공격 뒤 회복 (${f2(a.left)}초 남음)`;", "  if (a.k === 'cz') return '👑 ' + ({ auth: '권위 — 손을 듦', upcut: '하늘 가르기', thrust: '관통 찌르기', wave: '냉기 참격', ult: '마구 베기', spin: '원형 베기', shoulder: '어깨 박치기', backs: '뒷걸음 점프', rush: '돌진', flank: '뒤로 돌아 들어감', step: '스텝' }[a.s] || '기술') + (b ? ' → ' + b.name : '');   /* v9.12.0 ('공격 뒤 회복 8초' 로 보이던 것) */\n  return `공격 뒤 회복 (${f2(a.left)}초 남음)`;")
rep("      case 'czMode': out.push(", "      case 'czSurp': out.push(`${T(e)}👑 ${n(e.a)} — 불쑥 ${({ upcut: '하늘 가르기', thrust: '관통 찌르기', wave: '냉기 참격' })[e.s] || e.s} → ${n(e.b)} (탐색 중)`); break;   /* v9.12.0 */\n      case 'czMode': out.push(")
rep("    case 'czMode': return e.fury", "    case 'czSurp': return { c: 'bad', s: '👑 세자르의 검끝이 갑자기 낮아진다.' };   /* v9.12.0 */\n    case 'czMode': return e.fury")
open(F, 'w', encoding='utf-8').write(s)
print('page9360 OK')
