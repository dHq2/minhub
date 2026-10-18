# v7.8.4-a 소식 없는 아군: 칩 · 인물 칸 · 상세 · 은신 배지 · 칩 탭 — 마지막으로 안 것만 (판 · 로그 · 이야기와 같게)
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
# 도우미 (stlInfo 앞)
rep("// v7.8.3 은신 상태 (우리 몸): on = 숨어 있음","""// v7.8.4 지휘관이 모르는 아군 (소식 없음): 칩 · 인물 칸 · 상세도 판처럼 마지막으로 안 것만 (자리 · 체력 · 살았는지) — 모두 보기면 다 보임
const hidA = (Wd, u) => !!(Wd && u && u.side === 0 && mode !== 'edit' && u.posUnk && u.posK && !$('seeAll').checked);
const hpK = (Wd, u) => hidA(Wd, u) && u.posK.hp != null ? u.posK.hp : u.hp;
// v7.8.3 은신 상태 (우리 몸): on = 숨어 있음""")
rep("  if (!Wd || !u || !u.alive || u.side !== 0 || mode === 'edit') return null;\n","  if (!Wd || !u || !u.alive || u.side !== 0 || mode === 'edit' || hidA(Wd, u)) return null;\n")
# 칩
rep("""class="dchip ${!ed && sel.has(u.i) ? 'on' : ''} ${u.alive ? '' : 'dead'}" data-dc="${u.i}">""","""class="dchip ${!ed && sel.has(u.i) ? 'on' : ''} ${u.alive || hidA(Wd, u) ? '' : 'dead'} ${hidA(Wd, u) ? 'unk' : ''}" data-dc="${u.i}">""")
rep("""<i class="hb"><i style="width:${Math.max(0, u.hp / u.max * 100).toFixed(0)}%"></i></i><small>${ed ? '' : linkBadge(Wd, u)}${esc(ed ? (u.role || u.cls || '') : dockState(Wd, u))}</small>""",
    """<i class="hb"><i style="width:${Math.max(0, hpK(Wd, u) / u.max * 100).toFixed(0)}%"></i></i><small>${ed ? '' : linkBadge(Wd, u)}${esc(ed ? (u.role || u.cls || '') : hidA(Wd, u) ? '' : dockState(Wd, u))}</small>""")
rep(".dchip .fc{flex:0 0 28px;",".dchip.unk .fc{filter:grayscale(.7) brightness(.75)} .dchip.unk .hb i{background:#7d8590}\n.dchip .fc{flex:0 0 28px;")
# 칩 탭: 소식 없는 동료가 쓰러졌는지는 모름
rep("    if (!u.alive && !u.down){ toast(`${u.name}${jong(u.name) ? '은' : '는'} 쓰러졌어요`); return; }","    if (!u.alive && !u.down && !hidA(world, u)){ toast(`${u.name}${jong(u.name) ? '은' : '는'} 쓰러졌어요`); return; }   // v7.8.4 소식 없는 동료는 모름")
# 인물 칸
rep("    const dark = !ed && Wd.t - u.unseenHitT < 1.2;\n    const what = u.down","    const H = hidA(Wd, u), dark = !ed && !H && Wd.t - u.unseenHitT < 1.2;   // v7.8.4\n    const what = H ? `소식 없음 ${Math.round(Wd.t - u.posK.t)}초 — 무슨 일인지 모름 (마지막으로 안 자리 ${coord(u.posK.x, u.posK.y)})` : u.down")
rep("""return `<button type="button" class="pm ${u.alive ? '' : 'dead'} ${!ed && sel.has(u.i) ? 'sel' : ''}" data-ally="${u.i}">""","""return `<button type="button" class="pm ${u.alive || H ? '' : 'dead'} ${!ed && sel.has(u.i) ? 'sel' : ''}" data-ally="${u.i}">""")
rep(""" <i>${coord(u.x, u.y)}</i></span>
      <span class="hb"><i style="width:${Math.max(0, u.hp / u.max * 100)}%"></i></span>
      <span class="st">${Math.ceil(u.hp)}/${u.max}""",""" <i>${H ? coord(u.posK.x, u.posK.y) + '?' : coord(u.x, u.y)}</i></span>
      <span class="hb"><i style="width:${Math.max(0, hpK(Wd, u) / u.max * 100)}%"></i></span>
      <span class="st">${Math.ceil(hpK(Wd, u))}/${u.max}${H ? ' (마지막으로 안 것)' : ''}""")
rep("""      ${ed ? '' : bar(Wd, u)}<span class="at ${dark ? 'warn' : ''}">${dark ? '어둠 속에서 맞는 중 · ' : ''}${!ed && u.alive && u.crawl""","""      ${ed || H ? '' : bar(Wd, u)}<span class="at ${dark ? 'warn' : ''}">${H ? esc(what) + '</span></span></button>' : ''}${dark ? '어둠 속에서 맞는 중 · ' : ''}${!ed && u.alive && u.crawl""")
# 상세
rep("function unitDetailHtml(Wd, u){\n","function unitDetailHtml(Wd, u){\n  if (hidA(Wd, u)) return `<div class=\"dh\"><b>${esc(u.name)}</b> — 소식 없음 ${Math.round(Wd.t - u.posK.t)}초</div><p class=\"empty\">지휘관이 보지도 듣지도 못함 — 무슨 일이 있는지 몰라요. 마지막으로 안 자리 ${coord(u.posK.x, u.posK.y)} · 그때 체력 ${Math.ceil(hpK(Wd, u))}/${u.max}. 지휘관 곁으로 돌아오거나 동료가 보면 다시 알게 돼요.</p>`;   // v7.8.4\n")
open(f,'w').write(s); print('ok')
