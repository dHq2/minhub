import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.9.1 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.9.2 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.9.2: 꾹 누름 기술 부채에 ▬ 전열 — 고르면 켜진 채 (슬로우), 바닥을 탭 = 그 자리를 가운데로 전열 (가까운 적 쪽을 봄), 적을 탭 = 지금 자리에서 그 적 쪽을 보고 전열.
             고른 근접이 둘 아래면 (아군 하나를 꾹) 살아 있는 아군 모두로 세움 — 근접은 마디, 사수는 가운데 뒤. (전 v5.9.2 초안 — 부채의 서둘러 · 바로 쏴 — 은 버림. 빠르게는 두 번 탭 그대로)
""",'notes')
rep('<span class="ver">v5.9.1 · 모바일: 탭 = 이동 · 공격 (빠르게 두 번 = 서둘러) · 꾹 = 슬로우 + 기술 부채','<span class="ver">v5.9.2 · 부채에 ▬ 전열 · v5.9.1 · 모바일: 탭 = 이동 · 공격 (빠르게 두 번 = 서둘러) · 꾹 = 슬로우 + 기술 부채','ver')
rep("<footer>굴의 전투판 v5.9.1","<footer>굴의 전투판 v5.9.2",'footer')
rep("return `굴의 전투판 v5.9.1 · ${title}","return `굴의 전투판 v5.9.2 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.9.1\";","body.mob .top h1::after{content:\" v5.9.2\";",'mobver')
# giveLine: 세울 곳 · 마주 볼 적 (선택)
rep("""function giveLine(L){
  const M = L.filter(u => !isFar(u) && !u.crawl), back = L.filter(u => isFar(u) && !u.crawl);
  if (M.length < 2){ toast('전열은 근접 둘부터예요 (사수는 전열 뒤에 섬)'); return; }
  const c = { x: M.reduce((a, u) => a + u.x, 0) / M.length, y: M.reduce((a, u) => a + u.y, 0) / M.length };
  const e = world.units.filter(f => f.alive && f.side === 1 && (f.seenBy || $('seeAll').checked)).sort((a, b) => Math.hypot(a.x - c.x, a.y - c.y) - Math.hypot(b.x - c.x, b.y - c.y))[0];""",
"""function giveLine(L, at, faceTo){   // v5.9.2 at = 세울 곳 (가운데) · faceTo = 마주 볼 적 (없으면 가까운 적)
  const M = L.filter(u => !isFar(u) && !u.crawl), back = L.filter(u => isFar(u) && !u.crawl);
  if (M.length < 2){ toast('전열은 근접 둘부터예요 (사수는 전열 뒤에 섬)'); return false; }
  const c = at && !rock(world.map, at.x, at.y) ? { x: at.x, y: at.y } : { x: M.reduce((a, u) => a + u.x, 0) / M.length, y: M.reduce((a, u) => a + u.y, 0) / M.length };
  const e = faceTo || world.units.filter(f => f.alive && f.side === 1 && (f.seenBy || $('seeAll').checked)).sort((a, b) => Math.hypot(a.x - c.x, a.y - c.y) - Math.hypot(b.x - c.x, b.y - c.y))[0];""",'giveLine')
rep("  toast(`전열 ${sorted.length}마디: ${sorted.map(u => u.name).join(' · ')}${e ? ` — ${e.name} 쪽을 봄` : ''}${back.length ? ` · ${back.map(u => u.name).join(' · ')}${jong(back[back.length - 1].name) ? '은' : '는'} 가운데 뒤로` : ''}`);\n}",
    "  toast(`전열 ${sorted.length}마디: ${sorted.map(u => u.name).join(' · ')}${e ? ` — ${e.name} 쪽을 봄` : ''}${back.length ? ` · ${back.map(u => u.name).join(' · ')}${jong(back[back.length - 1].name) ? '은' : '는'} 가운데 뒤로` : ''}`);\n  return true;\n}",'giveLineRet')
# 부채 · 켜진 기술
rep("  if (C.some(u => u.canSweep)) out.push({ k: 'swing', ic: '⚔', nm: '휘두르기' });",
    "  if (C.some(u => u.canSweep)) out.push({ k: 'swing', ic: '⚔', nm: '휘두르기' });\n  if (Wd.units.filter(u => u.alive && u.side === 0 && !isFar(u) && !u.crawl).length >= 2) out.push({ k: 'line', ic: '▬', nm: '전열' });   // v5.9.2",'fanLine')
rep("hurry: '➜➜ 서둘러: 바닥 (이동) · 적 (공격) 을 탭',",
    "line: '▬ 전열: 세울 곳 (바닥) 이나 마주 볼 적을 탭', hurry: '➜➜ 서둘러: 바닥 (이동) · 적 (공격) 을 탭',",'armedTxt')
rep("  if (k === 'pick'){ const it = (Wd.items || []).filter(x => x.k !== 'spear'",
    """  if (k === 'line'){   // v5.9.2 고른 근접이 둘 아래면 살아 있는 아군 모두로
    const team = L.filter(x => !isFar(x) && !x.crawl).length >= 2 ? L : Wd.units.filter(x => x.alive && x.side === 0);
    if (u && u.side === 0){ toast('전열: 세울 곳 (바닥) 이나 마주 볼 적을 탭 · 아래로 쓸면 취소'); return; }
    sel = new Set(team.map(x => x.i)); if (giveLine(team, u ? null : { x: w.x, y: w.y }, u && u.side === 1 ? u : null)) return done(); return; }
  if (k === 'pick'){ const it = (Wd.items || []).filter(x => x.k !== 'spear'""",'armedTap')
rep("(아군을 꾹 = 그 아군 기술 · 인물을 꾹 = ⓘ 상세도).",
    "(아군을 꾹 = 그 아군 기술 · 인물을 꾹 = ⓘ 상세도 · ▬ 전열 = 바닥 탭 그 자리 / 적 탭 그 적을 봄).",'mobkeys')
open(P,'w').write(s); print('ok')
