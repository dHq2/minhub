import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.9.4 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.9.5 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.9.5: 모바일 고르기 풀기를 확실하게 — 판 밖의 빈 곳 (이야기 칸 · 맨 위 제목 · 조작판의 빈 자리 · 화면 바탕) 을 탭해도 풀림.
             고른 아군을 다시 탭해도 풀림 (혼자 골랐을 때). 판 바깥 · 벽 · 바위 탭도 그대로. 켜 둔 기술 · 공격 이동 · 열린 부채도 같이 꺼짐.
""",'notes')
rep('<span class="ver">v5.9.4 · 빈 곳 탭 = 고르기 풀기','<span class="ver">v5.9.5 · 빈 곳 · 고른 아군 다시 탭 = 고르기 풀기 (모바일)','ver')
rep("<footer>굴의 전투판 v5.9.4","<footer>굴의 전투판 v5.9.5",'footer')
rep("return `굴의 전투판 v5.9.4 · ${title}","return `굴의 전투판 v5.9.5 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.9.4\";","body.mob .top h1::after{content:\" v5.9.5\";",'mobver')
rep("  if ((w.x < 0 || w.y < 0 || w.x >= S.W || w.y >= S.H || rock(world.map, w.x, w.y)) && !unitNear(world, w.x, w.y)){ const had = sel.size || armedNow() || amovePick; chargePick = throwPick = skillPick = null; armed = null; amovePick = false; sel = new Set(); hud(); if (had) toast('고르기를 모두 풀었어요'); return; }",
    "  if ((w.x < 0 || w.y < 0 || w.x >= S.W || w.y >= S.H || rock(world.map, w.x, w.y)) && !unitNear(world, w.x, w.y)){ clearSel(); return; }",'outside')
rep("  if (u && u.side === 0){ pickAlly(u.i, false); hud(); return; }",
    "  if (u && u.side === 0){ if (sel.size === 1 && sel.has(u.i)){ clearSel(); return; } pickAlly(u.i, false); hud(); return; }   // v5.9.5 고른 아군을 다시 탭 = 풀기",'toggle')
rep("function cancelArmed(why){",
"""// v5.9.5 고르기 모두 풀기 (켜 둔 기술 · 공격 이동 · 열린 부채도 끔)
function clearSel(){ const had = sel.size || armedNow() || amovePick || !!focus; chargePick = throwPick = skillPick = null; armed = null; amovePick = false; if (focus) closeFan(); sel = new Set(); hud(); if (had) toast('고르기를 모두 풀었어요'); }
// 모바일: 판 밖의 빈 곳 (이야기 칸 · 제목 · 조작판의 빈 자리 · 바탕) 을 탭 = 고르기 풀기. 단추 · 입력 · 상세 · 메뉴 · 아래 기록 칸은 빼고
document.addEventListener('click', e => {
  if (!MOB || !world || world.over || mode === 'edit' || !e.target || !e.target.closest) return;
  if (e.target.closest('button, a, input, select, textarea, label, summary, details, canvas, .fan, .ring, #detail, #dMenu, #side, .tbl, [data-dk], [data-dc], [data-dm], [data-fk], [data-rs], [data-ord], [data-slot]')) return;
  clearSel();
});
function cancelArmed(why){""",'clearSel')
rep("터치: 탭은 이동 · 공격만 — 아군 = 고르기 (아래 칩 = 여럿) · 바닥 = 이동 · 적 = 공격 · 아무것도 없는 곳 (판 바깥 · 벽) = 고르기 모두 풀기",
    "터치: 탭은 이동 · 공격만 — 아군 = 고르기 (다시 탭 = 풀기 · 아래 칩 = 여럿) · 바닥 = 이동 · 적 = 공격 · 빈 곳 (이야기 칸 · 제목 · 조작판 빈 자리 · 판 바깥 · 벽) = 고르기 모두 풀기",'mobkeys')
open(P,'w').write(s); print('ok')
