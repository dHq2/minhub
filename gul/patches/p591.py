import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.9.0 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.9.1 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.9.1: 빠르게는 탭으로 남김 — 같은 바닥을 빠르게 두 번 = 서둘러 이동, 같은 적을 빠르게 두 번 = 빠르게 공격 (근접은 서둘러 뜀 · 사수는 바로 쏨, 오사 감수).
             꾹 누름 기술 부채에는 나머지 기술만 (돌진 · 투창 · 도약 · 약 · 막기 모드 · 휘두르기 · 줍기 · ⓘ 상세) — 서둘러 · 바로 쏴는 부채에서 뺌.
""",'notes')
rep('<span class="ver">v5.9.0 · 모바일: 꾹 = 슬로우 + 기술 부채 · 탭은 이동 · 공격만','<span class="ver">v5.9.1 · 모바일: 탭 = 이동 · 공격 (빠르게 두 번 = 서둘러) · 꾹 = 슬로우 + 기술 부채','ver')
rep("<footer>굴의 전투판 v5.9.0","<footer>굴의 전투판 v5.9.1",'footer')
rep("return `굴의 전투판 v5.9.0 · ${title}","return `굴의 전투판 v5.9.1 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.9.0\";","body.mob .top h1::after{content:\" v5.9.1\";",'mobver')
rep("""  // v5.9.0 탭은 이동 · 공격만: 아군 = 고르기 · 적 = 공격 · 바닥 = 이동 (물건 위여도). 두 번 탭 변형 (서두름 · 바로 쏨) 없음""",
    """  // v5.9.0 탭은 이동 · 공격만: 아군 = 고르기 · 적 = 공격 · 바닥 = 이동 (물건 위여도). v5.9.1 빠르게 두 번 = 서둘러 이동 · 빠르게 공격 (사수는 바로 쏨)""",'tapCmt')
rep("  if (u && u.side === 1){ lastAC = null; giveAttack(u); lastAC = null; return; }\n  lastRC = null; rightClick(w); lastRC = null;",
    "  if (u && u.side === 1){ giveAttack(u); return; }\n  rightClick(w);",'tap')
rep("  out.push({ k: 'hurry', ic: '➜➜', nm: '서둘러' });\n  if (C.some(u => isFar(u))) out.push({ k: 'rapid', ic: '⚡', nm: '바로 쏴' });\n", "",'fan')
rep("<span class=\"dhint\">아군을 탭해 고르세요. 바닥 탭 = 이동 · 적 탭 = 공격. 꾹 누르면 슬로우 + 기술 부채 (끌어서 고름 · 아래로 = 취소)</span>",
    "<span class=\"dhint\">아군을 탭해 고르세요. 바닥 탭 = 이동 · 적 탭 = 공격 (빠르게 두 번 = 서둘러 · 사수는 바로 쏨). 꾹 누르면 슬로우 + 기술 부채 (끌어서 고름 · 아래로 = 취소)</span>",'hint')
rep("터치: 탭은 이동 · 공격만 — 아군 = 고르기 (아래 칩 = 여럿) · 바닥 = 이동 · 적 = 공격.",
    "터치: 탭은 이동 · 공격만 — 아군 = 고르기 (아래 칩 = 여럿) · 바닥 = 이동 · 적 = 공격 · 같은 곳을 빠르게 두 번 = 서둘러 이동 · 빠르게 공격 (사수는 바로 쏨, 오사 감수).",'mobkeys')
open(P,'w').write(s); print('ok')
