# v8.8.1 페이지 — page8810.py v1.0 (v1.0: 진형 폐기 — 민수 "적어도 진형은 폐기하자 … 개별로 했을 때가 훨씬 좋았던 것 같아".
#   대형 (편대장 기준 · 모양 · 공세선 · 모여 깃발 · 편성 창 · 대형 띠 · 진형 버프) 을 판에 넘기지 않음 — 아군은 v8.7.4 까지처럼 각자 (고른 대로 이동 · 공격 · 기술). 조합 버프는 그대로.)
import subprocess, re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8800.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.8.0 (2026-10-23)', '<!-- 굴의 전투판 v8.8.1 (2026-10-23)')
rep('     v8.8.0: ', '''     v8.8.1: 진형 폐기 (민수 — "적어도 진형은 폐기하자 … 개별로 했을 때가 훨씬 좋았던 것 같아"):
         대형 (편대장 기준 · 모양 · 공세선 · 모여 깃발 · 편성 창 · 대형 띠) 을 판에 넘기지 않음 — 아군은 v8.7.4 까지처럼 각자: 고른 대로 이동 · 공격 · 기술, 명령은 고른 이에게만.
         진형 버프 (방패벽 · 쐐기 돌파 · 삼각 엄호 · 사방 경계 · 흩어짐 — 적의 대치 진형 · 쐐기 돌파 포함) 도 끔 (수치표 fbuf.on = 0). 조합 버프는 그대로.
         단축키 W (모여) · Shift + W (깃발) · D (편성 창) · 도움말의 대형 글을 걷어냄. 엔진 코드는 남김 (되살릴 수 있게).
     v8.8.0: ''')
for a, b in (('h1::after{content:" v8.8.0"', 'h1::after{content:" v8.8.1"'), ('<footer>굴의 전투판 v8.8.0', '<footer>굴의 전투판 v8.8.1'), ('return `굴의 전투판 v8.8.0 · ${title}', 'return `굴의 전투판 v8.8.1 · ${title}'),
             ("copyText('굴의 전투판 v8.8.0 자동 판 기록", "copyText('굴의 전투판 v8.8.1 자동 판 기록"), ("o.push(`굴의 전투판 v8.8.0 — ${C.run", "o.push(`굴의 전투판 v8.8.1 — ${C.run"),
             ('의 버전 기록에 — v8.8.0 위층으로 · 한 일대로 성장 / v8.7.9', '의 버전 기록에 — v8.8.1 진형 폐기 / v8.8.0 위층으로 · 한 일대로 성장 / v8.7.9'),
             ('">v8.8.0 · 위층으로 · 한 일대로 성장</span>', '">v8.8.1 · 진형 폐기 (각자 지휘)</span>'),
             ("ver: '8.8.0', kind:", "ver: '8.8.1', kind:")):
    rep(a, b)
rep("RULES_MIG = '8.8.0',", "RULES_MIG = '8.8.1',")   # 수치표: fbuf.on 새 칸

# ---------- 대형을 판에 넘기지 않음 ----------
rep("""function form8Setup(S0){
  const C = form8Cfg(), pick = c => ({ shape: c.shape, on: c.on, style: c.style, lead: c.lead, swaps: c.swaps, pin: c.pin });
  S0.form = { A: pick(C.A), B: pick(C.B) };
  for (const p of S0.units) if (p.side === 0){ p.fkey = fkeyOf(p, S0.units); p.fsq = fsqOf(p); }
}""", "function form8Setup(S0){ delete S0.form; }   /* v8.8.1 진형 폐기 (민수): 대형은 더는 판에 넘기지 않음 — 아군은 각자 */")
# 단축키: 모여 · 깃발 · 편성 창
rep("""  if (k === 'w' && !e.ctrlKey && !e.metaKey && mode !== 'edit' && world && !world.over){ e.preventDefault(); formRallyKey(e.shiftKey); return; }   /* v8.7.5 모여 · 깃발 */
  if (k === 'd' && !e.ctrlKey && !e.metaKey){ e.preventDefault(); fmOpen(); return; }   /* v8.7.5 편성 창 */
""", "  /* v8.8.1 W (모여) · Shift + W (깃발) · D (편성 창) 는 진형과 함께 폐기 */\n")
rep("['W', '🚩 모여 — 떼어 맡긴 편대원을 대형으로'], ", "")
rep("['Shift + W', '📍 깃발 — 꽂을 바닥을 찍으면 기준이 그리로'], ", "")
rep("['D', '⚑ 편성 창 (편대 · 기준 · 모양 · 자리 · 버프 · 시작 · 싸울 때)'], ", "")
rep(" 머리줄 ⚑ = 대형 (누르면 판 왼쪽 위에 펼침 — 🚩 모여 · 📍 깃발 · ⏻ 켜고 끔 · ⚑ 편성 창 · ▴ 접기 · 가로 화면은 판 왼쪽 위 칩).", "")

rep("""</p>' + '<div class="row"><button type="button" class="btn sm" data-fopen="1" title="편성 창 (D)">⚑ 편성 창 — 대형 · 기준 · 모양 · 버프 · 시작할 때 · 싸울 때</button></div>';   /* v8.7.5 */""", """</p>';   /* v8.8.1 편성 창 단추 폐기 */""")

open(F, 'w', encoding='utf-8').write(s)
print('page8810 OK')
