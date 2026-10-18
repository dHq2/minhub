import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.8.1 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.8.2 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.8.2: 모바일 — 판에서 아군을 탭하면 그 인물 머리 위에 기술 고리가 뜸 (가진 기술만: 돌진 · 방패 돌진 · 투창 · 도약 · 약, 대기 시간 덮개).
             기술을 탭하면 대상 고르기 (돌진 = 적이나 바닥 · 투창 = 적 · 약 = 아군) 로 바로 들어가고, 도약은 바로 뜀. 고리는 인물을 따라다니고,
             같은 아군을 다시 탭하거나 다른 곳을 탭하면 닫힘 (바닥 탭 = 그대로 이동).
""",'notes')
rep('<span class="ver">v5.8.1 · 레베카 정체성','<span class="ver">v5.8.2 · 탭하면 기술 고리 · 레베카 정체성','ver')
rep("<footer>굴의 전투판 v5.8.1","<footer>굴의 전투판 v5.8.2",'footer')
rep("return `굴의 전투판 v5.8.1 · ${title}","return `굴의 전투판 v5.8.2 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.8.1\";","body.mob .top h1::after{content:\" v5.8.2\";",'mobver')
# HTML ring
rep('        <div class="tip" id="tip" hidden></div>','        <div class="tip" id="tip" hidden></div>\n        <div class="ring" id="ring" hidden aria-label="기술 고리"></div>','html')
# CSS
rep("/* v5.8 가로 화면 (폰을 눕힘)","""/* v5.8.2 기술 고리: 탭한 아군 머리 위에 가진 기술 */
.ring{position:absolute;left:0;top:0;width:0;height:0;z-index:5;pointer-events:none}
.ring .rb{position:absolute;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;pointer-events:auto;background:rgba(20,17,22,.94);border:2px solid var(--accent);color:#ece4d6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;font:700 9.5px/1.1 var(--body);box-shadow:0 4px 14px rgba(0,0,0,.55);touch-action:manipulation;-webkit-tap-highlight-color:transparent;overflow:hidden;padding:0}
.ring .rb .ic{font-size:19px;line-height:1.05}
.ring .rb small{font:600 9px var(--mono);color:#ffd77a}
.ring .rb.on{background:color-mix(in srgb,var(--accent) 45%,#141116);border-color:#ffe196}
.ring .rb[disabled]{opacity:.45;border-color:#5a5060}
.ring .rb.cd::after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.5);transform-origin:bottom;transform:scaleY(var(--cd,0));border-radius:50%}
.ring .rx{width:30px;height:30px;margin:-15px 0 0 -15px;border-color:#5a5060;font-size:13px}
/* v5.8 가로 화면 (폰을 눕힘)""",'css')
# touchTap: ring
rep("""  const u = unitNear(world, w.x, w.y);
  if (u || skillPick || throwPick || chargePick || amovePick){ playClick(w, false, u); return; }""",
"""  const u = unitNear(world, w.x, w.y);
  // v5.8.2 아군 탭 = 고르기 + 그 머리 위에 기술 고리 (다시 탭하면 닫힘)
  if (u && u.side === 0 && !skillPick){ const again = ringFor === u.i && sel.size === 1 && sel.has(u.i); playClick(w, false, u); if (again) closeRing(); else openRing(u); return; }
  closeRing();
  if (u || skillPick || throwPick || chargePick || amovePick){ playClick(w, false, u); return; }""",'tap')
# ring functions after touchTap definition: insert before function longPress
rep("function longPress(w){","""let ringFor = null, ringHtml = '';
function openRing(u){ if (!MOB || !world || !u || !u.alive) return closeRing(); const any = [1, 2, 3, 4].some(n => !slotState(world, [u], n).off); if (!any){ closeRing(); return; } ringFor = u.i; ringHtml = ''; renderRing(); }
function closeRing(){ ringFor = null; ringHtml = ''; const r = $('ring'); if (r){ r.hidden = true; r.innerHTML = ''; } }
// 가진 기술만 머리 위 반원에 (위쪽이 모자라면 아래로). 대기 중이면 남은 초 · 덮개, 고르는 중이면 빛남
function renderRing(){
  const r = $('ring'); if (!r) return;
  const u = ringFor != null && world ? world.units[ringFor] : null;
  if (!MOB || !u || !u.alive || world.over || mode === 'edit'){ if (ringFor != null) closeRing(); return; }
  const st = [1, 2, 3, 4].map(n => slotState(world, [u], n)).filter(x => !x.off);
  if (!st.length){ closeRing(); return; }
  const ts = TS * cam.z, py = (u.y - cam.y) * ts + cv.clientHeight / 2, down = py < 96, R = Math.max(54, u.r * ts + 34), k = st.length;
  const html = st.map((x, j) => { const a = (down ? 1 : -1) * (Math.PI / 2) + (k > 1 ? (j - (k - 1) / 2) * 0.82 : 0), cdF = x.cd > 0 ? Math.min(1, x.cd / Math.max(0.1, x.cdMax)) : 0;
      return `<button type="button" class="rb ${x.on ? 'on' : ''} ${cdF ? 'cd' : ''}" data-rs="${x.n}" style="left:${(Math.cos(a) * R).toFixed(1)}px;top:${(Math.sin(a) * R).toFixed(1)}px;${cdF ? '--cd:' + cdF.toFixed(2) : ''}"><span class="ic">${x.ic}</span>${esc(x.nm.length > 4 ? x.nm.slice(0, 4) : x.nm)}${x.cd > 0 ? `<small>${f2(x.cd)}초</small>` : ''}</button>`; }).join('')
    + `<button type="button" class="rb rx" data-rs="x" style="left:${((down ? -1 : 1) * 0 + R * 0.95).toFixed(1)}px;top:${((down ? 1 : -1) * R * 0.35).toFixed(1)}px">✕</button>`;
  if (html !== ringHtml){ ringHtml = html; r.innerHTML = html; }
  r.hidden = false; positionRing();
}
function positionRing(){ const r = $('ring'); if (!r || r.hidden || ringFor == null || !world) return; const u = world.units[ringFor]; if (!u || !u.alive){ closeRing(); return; } const ts = TS * cam.z; r.style.transform = `translate(${((u.x - cam.x) * ts + cv.clientWidth / 2).toFixed(1)}px, ${((u.y - cam.y) * ts + cv.clientHeight / 2).toFixed(1)}px)`; }
function longPress(w){""",'ringfn')
# ring tap handler (register after dockTap definition: put after dockTap($('dMenu'), ...) block end — use the renderDock definition anchor)
rep("const dockState = (Wd, u) =>","""dockTap($('ring'), b => {   // v5.8.2 기술 고리
  const k = b.dataset.rs; if (k === 'x'){ closeRing(); return; }
  const u = ringFor != null && world ? world.units[ringFor] : null; if (!u || !u.alive) { closeRing(); return; }
  sel = new Set([u.i]); useSlot(+k); closeRing(); hud();
});
const dockState = (Wd, u) =>""",'ringtap')
# dockTap selector includes data-rs
rep("const b = el && el.closest('[data-dk],[data-dc],[data-dm]'); if (!b || b.disabled || !root.contains(b)) return; e.preventDefault(); fn(b); });",
    "const b = el && el.closest('[data-dk],[data-dc],[data-dm],[data-rs]'); if (!b || b.disabled || !root.contains(b)) return; e.preventDefault(); e.stopPropagation(); fn(b); });",'dt1')
rep("  root.addEventListener('click', e => { if (e.detail === 0){ const b = e.target.closest('[data-dk],[data-dc],[data-dm]'); if (b && !b.disabled) fn(b); } });",
    "  root.addEventListener('click', e => { if (e.detail === 0){ const b = e.target.closest('[data-dk],[data-dc],[data-dm],[data-rs]'); if (b && !b.disabled) fn(b); } });",'dt2')
# frame: position ring each frame; hud: re-render ring
rep("  draw();\n  hudT -= dt;","  draw();\n  if (ringFor != null) positionRing();   // v5.8.2 기술 고리가 인물을 따라감\n  hudT -= dt;",'frame')
rep("  const Wd = W_(); renderSkillBar(Wd); renderDetail(); renderDock(Wd); if (!Wd) return;","  const Wd = W_(); renderSkillBar(Wd); renderDetail(); renderDock(Wd); if (ringFor != null) renderRing(); if (!Wd) return;",'hud')
# close ring when leaving play
rep("function resetToEdit(){\n  mode = 'edit'; world = null; cont = false; paused = false;","function resetToEdit(){\n  closeRing(); mode = 'edit'; world = null; cont = false; paused = false;",'reset')
# chip tap for selection also opens ring? keep chips as multi-select (no ring). Dock skill buttons close ring
rep("  if (/^sk\\d$/.test(k)){ useSlot(+k.slice(2)); hud(); return; }","  if (/^sk\\d$/.test(k)){ closeRing(); useSlot(+k.slice(2)); hud(); return; }",'dsk')
# mobile hint
rep("길게 누르기 = 상세정보. 아래 조작판:","길게 누르기 = 상세정보. 아군을 탭하면 머리 위에 기술 고리 (돌진 · 투창 · 도약 · 약 — 탭하면 대상 고르기). 아래 조작판:",'hint')
rep("  else if (!L.length) acts = `<span class=\"dhint\">아군을 탭해 고르세요 (판 · 위 칩). 그다음 바닥 탭 = 이동 · 적 탭 = 공격 · 빠르게 두 번 = 서두름 · 길게 누르기 = 상세</span>`;",
    "  else if (!L.length) acts = `<span class=\"dhint\">아군을 탭해 고르세요 (머리 위에 기술 고리). 그다음 바닥 탭 = 이동 · 적 탭 = 공격 · 빠르게 두 번 = 서두름 · 길게 누르기 = 상세</span>`;",'dhint')
open(P,'w').write(s); print('ok')
