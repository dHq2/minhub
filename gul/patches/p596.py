import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.9.5 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.9.6 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.9.6: (고침) 빠르게 공격 (같은 적을 두 번 탭) 한 근접이 적에게 붙은 뒤에도 치는 사이마다 방패를 내리고 있던 것 — 서두름은 달리는 동안만, 붙으면 다시 듦.
             빠르게 이동 (바닥 두 번 탭) 은 가는 동안 내림. 알림 글도 '달리는 동안 방패를 내림 · 붙으면 다시 듦' 으로.
""",'notes')
rep('<span class="ver">v5.9.5 · 빈 곳 · 고른 아군 다시 탭 = 고르기 풀기 (모바일)','<span class="ver">v5.9.6 · 빠르게 공격해도 붙으면 방패를 듦 · v5.9.5 · 빈 곳 · 고른 아군 다시 탭 = 고르기 풀기 (모바일)','ver')
rep("<footer>굴의 전투판 v5.9.5","<footer>굴의 전투판 v5.9.6",'footer')
rep("return `굴의 전투판 v5.9.5 · ${title}","return `굴의 전투판 v5.9.6 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.9.5\";","body.mob .top h1::after{content:\" v5.9.6\";",'mobver')
rep("'서둘러 들이침 (방패를 내리고 뜀)'","'서둘러 들이침 (달리는 동안 방패를 내림 · 붙으면 다시 듦)'",'toastA')
rep("toast(`${L.map(u => u.name).join(' · ')}: 서둘러! — 방패를 내리고 뜀 (×${world.rules.run || 1.3})`);",
    "toast(`${L.map(u => u.name).join(' · ')}: 서둘러! — 가는 동안 방패를 내리고 뜀 (×${world.rules.run || 1.3})`);",'toastM')
open(P,'w').write(s); print('ok')
