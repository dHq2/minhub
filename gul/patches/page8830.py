# v8.8.3 페이지 — page8830.py v1.0 (v1.0: 양동이 뿌리기 다시 — 아군 · 적군 모두 맞는 장판 · 맥아 상태 (초당 피해) · 부상 · 숫자 · 표시)
import subprocess, re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8820.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.8.2 (2026-10-23)', '<!-- 굴의 전투판 v8.8.3 (2026-10-23)')
rep('     v8.8.2: 옐로 업데이트 (', '''     v8.8.3: 양동이 뿌리기 다시 (민수 — "틱 피해가 들어가거나 부상에 가시적으로 나와야 하고, 아군 적군 모두 피해받는 장판기"):
         장판 안의 누구나 (아군도 · 뿌린 옐로만 빼고) <저주:맥아> — 초당 5 피해 (화상 같은 상태 · 나간 뒤 2초 더 · 떠오르는 숫자 · 🧪 표시 · 상세에 남은 초) · 부상이 2.5초마다 한 단계씩 쌓임 (살이 무름 → 살갗이 녹아내림 → 살이 문드러짐 → 뼈가 드러남) · 걸음 ×0.55 · 받는 피해 +30% · 장판을 본 쪽은 밖으로 피함 · 스스로 뿌릴 땐 곁에 동료가 없는 자리에만.
     v8.8.2: 옐로 업데이트 (''')
for a, b in (('h1::after{content:" v8.8.2"', 'h1::after{content:" v8.8.3"'), ('<footer>굴의 전투판 v8.8.2', '<footer>굴의 전투판 v8.8.3'), ('return `굴의 전투판 v8.8.2 · ${title}', 'return `굴의 전투판 v8.8.3 · ${title}'),
             ("copyText('굴의 전투판 v8.8.2 자동 판 기록", "copyText('굴의 전투판 v8.8.3 자동 판 기록"), ("o.push(`굴의 전투판 v8.8.2 — ${C.run", "o.push(`굴의 전투판 v8.8.3 — ${C.run"),
             ('의 버전 기록에 — v8.8.2 옐로 업데이트 /', '의 버전 기록에 — v8.8.3 양동이 뿌리기 다시 / v8.8.2 옐로 업데이트 /'),
             ('">v8.8.2 · 옐로 업데이트</span>', '">v8.8.3 · 양동이 뿌리기 다시</span>'),
             ("ver: '8.8.2', kind:", "ver: '8.8.3', kind:")):
    rep(a, b)
rep("RULES_MIG = '8.8.2',", "RULES_MIG = '8.8.3',")

# ---------- 글 ----------
s = re.sub(r"  '양동이 뿌리기': '옐로 — [^\n]*',   /\* v8\.8\.2 \*/",
           "  '양동이 뿌리기': '옐로 — 양동이의 약을 땅에 뿌림: 4칸 안의 자리에 반지름 1.6 의 장판 (약 120 을 쓰고, 남은 약이 많을수록 3 ~ 10초 오래 감). 장판 안에 선 누구나 (아군도 · 뿌린 옐로만 빼고) <저주:맥아> — 초당 5 피해 (갑옷과 상관없이 살이 녹음 · 나간 뒤 2초 더 · 떠오르는 숫자 · 🧪) · 2.5초마다 부상이 한 단계씩 쌓임 (살이 무름 → 살갗이 녹아내림 → 살이 문드러짐 → 뼈가 드러남) · 걸음 ×0.55 · 받는 피해 +30%. 장판을 본 쪽은 밖으로 피함. 10초마다. 양동이에 약이 60 은 남아야 함 (동료가 위급하면 약은 치료에 — 스스로는 곁에 동료가 없는 자리에만 뿌림). 명령: 적 · 바닥을 누름.',   /* v8.8.3 */", s, count=1)
assert '/* v8.8.3 */' in s
rep("장판 · <저주:맥아> · 남은 약만큼 오래 · 약 120 씀)", "장판 · <저주:맥아> — 아군도 맞음 · 초당 5 · 남은 약만큼 오래 · 약 120 씀)")
rep("'<저주:맥아>를 상대에게 부여할 수 있음 (양동이 뿌리기) — 살이 무르고 (받는 피해 +30%) · 이동이 느려지고 (×0.55) · 살이 녹음'", "'<저주:맥아>를 부여할 수 있음 (양동이 뿌리기 — 장판 안의 아군 · 적군 모두, 뿌린 옐로만 빼고) — 살이 무르고 (받는 피해 +30%) · 이동이 느려지고 (×0.55) · 초당 5 살이 녹음 · 부상이 쌓임'")
rep("양동이 뿌리기 (<저주:맥아> 장판) · ", "양동이 뿌리기 (<저주:맥아> 장판 — 아군도 맞음) · ", 2)

# ---------- 표시: 🧪 · 상태 줄 · 상세 · 기록 · 서술 ----------
rep("fillText('🔥', px + r * 0.62, py + r * 0.55); ctx.restore(); }   // v6.7 화상 (초상화 오른쪽 아래)",
    "fillText('🔥', px + r * 0.62, py + r * 0.55); ctx.restore(); }   // v6.7 화상 (초상화 오른쪽 아래)\n"
    "    if (!ed && vis && u.alive && u.malt && now < u.malt.until){ const fs = Math.max(11, Math.min(16, r * 0.5)); ctx.save(); ctx.globalAlpha = 0.75 + 0.25 * Math.sin(now * 7); ctx.font = `${fs}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🧪', px - r * 0.62, py + r * 0.55); ctx.restore(); }   /* v8.8.3 저주:맥아 (초상화 왼쪽 아래) */")
rep("${u.burn && Wd.t < u.burn.until ? ' · 🔥 화상' : ''}", "${u.burn && Wd.t < u.burn.until ? ' · 🔥 화상' : ''}${u.malt && Wd.t < u.malt.until ? ' · 🧪 맥아' : ''}")
rep("${!ed && u.alive && u.burn && Wd.t < u.burn.until ? `<span class=\"tr\" style=\"color:#ff9a86\">",
    "${!ed && u.alive && u.malt && Wd.t < u.malt.until ? `<span class=\"tr\" style=\"color:#d6b24a\"><span class=\"lb\">맥아</span> 🧪 초당 ${u.malt.dps.toFixed(1)} · ${f2(u.malt.until - Wd.t)}초 남음 · 받는 피해 +30% · 걸음 ×0.55 (${esc(Wd.units[u.malt.by] ? Wd.units[u.malt.by].name : '')})</span>` : ''}\n    ${!ed && u.alive && u.burn && Wd.t < u.burn.until ? `<span class=\"tr\" style=\"color:#ff9a86\">")
rep("(걸음 느려짐 · 살이 무름 · 살이 녹음)`); break;",
    "(걸음 ×0.55 · 받는 피해 +30% · 초당 5 · 장판 안은 아군 적군 모두)${e.ff ? ' [아군이 장판에 걸림]' : ''}`); break;\n      case 'maltStop': out.push(`${T(e)}${n(e.a)} 맥아가 가라앉음`); break;")
rep("녹아내린다.` };", "녹아내린다.${e.ff ? ' — 같은 편의 장판이다!' : ''}` };\n    case 'maltStop': return null;")
rep("      if (e.tag === '화상') return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(b.name)} 화상을 견디지 못하고 쓰러진다.` };",
    "      if (e.tag === '화상') return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(b.name)} 화상을 견디지 못하고 쓰러진다.` };\n      if (e.tag === '맥아 부식') return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(b.name)} 맥아에 살이 녹아내려 쓰러진다.` };   /* v8.8.3 */")

open(F, 'w', encoding='utf-8').write(s)
print('page8830 OK')
