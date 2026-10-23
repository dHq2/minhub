# v8.8.5 페이지 — page8850.py v1.0 (v1.0: 간두 샷건 — 특수탄 50 · 설명 · 저장된 간두 이전)
import subprocess, re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8840.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v8.8.4 (2026-10-23)', '<!-- 굴의 전투판 v8.8.5 (2026-10-23)')
rep('     v8.8.4: 옐로 (', '''     v8.8.5: 간두의 샷건 (민수 — "조준이 거의 필요 없으니 사격이 더 빨라야 … 코앞에선 강한 위력과 넉백을 내는 히든카드 … 초기 탄약 50발 … 위력도 더 좋아야"):
         샷건 (모든 샷건 — 적 샷건병 · 카밀라도 같은 규칙): 조준 시간 ×0.2 (등급 조준의 1/5 + 0.02초) · 쏜 뒤 거둠 ×0.55 → 발 사이 0.5초 안팎 (전엔 1.0 ~ 1.5초) · 산탄 한 알 × 0.32 → × 0.4 · 코앞 (2.2칸 안 — 전엔 1.8) 은 × 2.2 → × 3.2 · 밀침 1.0 → 1.5 · 관통 0.3 → 0.5 (갑옷 · 껍질 위로 덜 막힘) · 관통력 45 → 55. 간두의 특수탄 (샷건 탄) 은 처음 50발 (전엔 100).
     v8.8.4: 옐로 (''')
for a, b in (('h1::after{content:" v8.8.4"', 'h1::after{content:" v8.8.5"'), ('<footer>굴의 전투판 v8.8.4', '<footer>굴의 전투판 v8.8.5'), ('return `굴의 전투판 v8.8.4 · ${title}', 'return `굴의 전투판 v8.8.5 · ${title}'),
             ("copyText('굴의 전투판 v8.8.4 자동 판 기록", "copyText('굴의 전투판 v8.8.5 자동 판 기록"), ("o.push(`굴의 전투판 v8.8.4 — ${C.run", "o.push(`굴의 전투판 v8.8.5 — ${C.run"),
             ('의 버전 기록에 — v8.8.4 옐로 (돌진 · 3~5타 · 도약 스택) /', '의 버전 기록에 — v8.8.5 간두 샷건 / v8.8.4 옐로 (돌진 · 3~5타 · 도약 스택) /'),
             ('">v8.8.4 · 옐로 돌진 · 3~5타 · 도약 스택</span>', '">v8.8.5 · 간두 샷건 (빠르게 · 세게 · 특수탄 50)</span>'),
             ("ver: '8.8.4', kind:", "ver: '8.8.5', kind:"), ("RULES_MIG = '8.8.4',", "RULES_MIG = '8.8.5',"),
             ("alt: { name: '샷건', ammo: 100 }, sm: 0.95", "alt: { name: '샷건', ammo: 50 }, sm: 0.95"),
             ("두 번째 총 샷건 (특수탄 100) 을 늘 지니고 바꿔 듦 — 코앞에서 크게 맞히고 날려 보냄", "두 번째 총 샷건 (특수탄 50) 을 늘 지니고 바꿔 듦 — 조준이 거의 필요 없어 빠르게 연달아 쏘고, 코앞에서 크게 맞히고 크게 날려 보냄 (히든카드)")):
    rep(a, b)
# 한 번: 저장된 간두의 샷건 탄 100 → 50 (손으로 바꾼 값은 그대로)
rep("if (!S.v7251m){ try {", """const fix885 = p => { if (!p || p.ref !== 'C-195' || (p.side || 0) !== 0 || !p.alt || p.alt.name !== '샷건' || p.alt.ammo !== 100) return false; p.alt.ammo = 50; return true; };   /* v8.8.5 간두의 특수탄은 처음 50발 */
if (!S.v885k){ let n = 0; for (const u of S.units || []) if (fix885(u)) n++; try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fix885(d)){ dc = true; n++; } if (dc) saveMyDesigns(mine); } catch (e) {}
  S.v885k = true; if (n) setTimeout(() => { save(); toast(`간두의 특수탄을 50발로 맞췄어요 (${n}곳)`); }, 1600); }
if (!S.v7251m){ try {""")
open(F, 'w', encoding='utf-8').write(s)
print('page8850 OK')
