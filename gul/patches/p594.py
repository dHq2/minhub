import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.9.3 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.9.4 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.9.4: 모바일 — 아무것도 없는 곳 (판 바깥 · 벽 · 바위) 을 탭하면 고른 아군이 모두 풀림 (켜 둔 기술 · 공격 이동도 꺼짐). 바닥 탭 = 이동은 그대로.
""",'notes')
rep('<span class="ver">v5.9.3 · 전열 = 참여 명령','<span class="ver">v5.9.4 · 빈 곳 탭 = 고르기 풀기 · v5.9.3 · 전열 = 참여 명령','ver')
rep("<footer>굴의 전투판 v5.9.3","<footer>굴의 전투판 v5.9.4",'footer')
rep("return `굴의 전투판 v5.9.3 · ${title}","return `굴의 전투판 v5.9.4 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.9.3\";","body.mob .top h1::after{content:\" v5.9.4\";",'mobver')
rep("  closeRing();\n  if (armedNow()){ armedTap(w); return; }",
    "  closeRing();\n  // v5.9.4 아무것도 없는 곳 (판 바깥 · 벽 · 바위, 인물 없음) 을 탭 = 고르기 모두 풀기 (켜 둔 기술 · 공격 이동도 끔)\n  if ((w.x < 0 || w.y < 0 || w.x >= S.W || w.y >= S.H || rock(world.map, w.x, w.y)) && !unitNear(world, w.x, w.y)){ const had = sel.size || armedNow() || amovePick; chargePick = throwPick = skillPick = null; armed = null; amovePick = false; sel = new Set(); hud(); if (had) toast('고르기를 모두 풀었어요'); return; }\n  if (armedNow()){ armedTap(w); return; }",'tap')
rep("터치: 탭은 이동 · 공격만 — 아군 = 고르기 (아래 칩 = 여럿) · 바닥 = 이동 · 적 = 공격",
    "터치: 탭은 이동 · 공격만 — 아군 = 고르기 (아래 칩 = 여럿) · 바닥 = 이동 · 적 = 공격 · 아무것도 없는 곳 (판 바깥 · 벽) = 고르기 모두 풀기",'mobkeys')
open(P,'w').write(s); print('ok')
