import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.9.1 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.9.2 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.9.2: 빠르게 이동 · 빠르게 공격도 꾹 누름 부채에 다시 (➜➜ 서둘러 = 바닥 · 적 탭 / ⚡ 바로 쏴 = 사수, 적 탭) — 슬로우 속에서 골라 쓸 수 있게.
             빠르게 두 번 탭도 그대로 둠 (둘 다 됨).
""",'notes')
rep('<span class="ver">v5.9.1 · 모바일: 탭 = 이동 · 공격 (빠르게 두 번 = 서둘러) · 꾹 = 슬로우 + 기술 부채','<span class="ver">v5.9.2 · 모바일: 꾹 = 슬로우 + 기술 부채 (서둘러 · 바로 쏴 포함) · 탭 = 이동 · 공격 (빠르게 두 번 = 서둘러)','ver')
rep("<footer>굴의 전투판 v5.9.1","<footer>굴의 전투판 v5.9.2",'footer')
rep("return `굴의 전투판 v5.9.1 · ${title}","return `굴의 전투판 v5.9.2 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.9.1\";","body.mob .top h1::after{content:\" v5.9.2\";",'mobver')
rep("  if (C.some(u => u.canGuard)){ const m = { auto: 'hold', hold: 'off', off: 'auto' }",
    "  out.push({ k: 'hurry', ic: '➜➜', nm: '서둘러' });   // v5.9.2 빠르게 이동 · 공격도 부채에 (두 번 탭도 됨)\n  if (C.some(u => isFar(u))) out.push({ k: 'rapid', ic: '⚡', nm: '바로 쏴' });\n  if (C.some(u => u.canGuard)){ const m = { auto: 'hold', hold: 'off', off: 'auto' }",'fan')
rep("(아군을 꾹 = 그 아군 기술 · 인물을 꾹 = ⓘ 상세도).",
    "(아군을 꾹 = 그 아군 기술 · 인물을 꾹 = ⓘ 상세도 · ➜➜ 서둘러 · ⚡ 바로 쏴도 여기서).",'mobkeys')
open(P,'w').write(s); print('ok')
