import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
# ---------- header ----------
rep("<!-- 굴의 전투판 v5.7.2 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.8 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.8: 모바일 (갤럭시 노트 20 · 412×915 기준) — 화면 아래 고정 조작판: 아군 칩 (탭 = 고르기 더하기 · 빼기, 약 고르는 중이면 그 아군에게 약),
           명령 줄 (기술 1 ~ 4 · 공격 이동 · 제자리 · 자동 · 전열 · 막기 · 줍기 · 휘두르기 · 횃불 · 취소), 재생 줄 (▶ · ⏸ · 한 턴 · 속도 · 전체 / 가까이 · 따라감 · 상세 · 더 보기).
           판: 탭 = 아군 고르기 · 적 공격 · 바닥 이동 · 물건 줍기 (같은 곳을 빠르게 두 번 = 서두름 · 바로 쏨), 한 손가락 끌기 = 화면 옮기기, 두 손가락 = 확대 · 축소,
           길게 누르기 = 그 인물 · 물건의 상세정보 (아래에서 올라오는 칸). 판은 가까이 (한 칸 ≈ 46px) 보고 아군을 따라감, ⤢ 로 전체.
           이야기는 판 아래 띠로, 범례는 더 보기에서. 머리글 · 긴 설명은 숨김. 버그: 막은 것 이름 (쓰러져 방패를 떨어뜨린 뒤 '반사신경로' 로 나오던 것) · 밀려남 ≠ 쓰러짐 · 결과표 소수점.
""",'notes')
rep('<span class="ver">v5.7.2 · Space 재생','<span class="ver">v5.8 · 모바일 조작판 · Space 재생','ver')
rep("<footer>굴의 전투판 v5.7.2","<footer>굴의 전투판 v5.8",'footer')
rep("return `굴의 전투판 v5.7.2 · ${title}","return `굴의 전투판 v5.8 · ${title}",'export')
# ---------- CSS ----------
rep("@media (max-width:640px){ .ab{width:80px} .pm .at{max-width:150px} pre.log{font-size:11px} }\n</style>",
"""@media (max-width:640px){ .ab{width:80px} .pm .at{max-width:150px} pre.log{font-size:11px} }
/* v5.8 모바일 (body.mob — 폭 700 이하, 또는 터치 화면 1000 이하) */
.dock,.dmenu,.detx{display:none}
body.mob .wrap{padding-inline:8px;padding-block:6px calc(var(--dockH,176px) + 18px)}
body.mob .top{gap:4px;margin-bottom:6px} body.mob .top h1{font-size:19px} body.mob .top .ver,body.mob .top .lede{display:none}
body.mob .top h1::after{content:" v5.8";font:600 11px var(--mono);color:var(--dim);letter-spacing:0}
body.mob .app{gap:8px}
body.mob .view{aspect-ratio:auto;max-height:none;min-height:0;height:var(--viewH,480px);border-radius:10px}
body.mob .skbar,body.mob .mini,body.mob .follow,body.mob .edittag{display:none!important}
body.mob .legend2{display:none!important}
body.mob.leg .legend2:not([hidden]){display:flex!important;max-width:94%;font-size:10.5px;left:6px;top:6px;bottom:auto;max-height:70%;overflow:auto}
body.mob .ovl{font-size:10.5px;padding:3px 7px;left:6px;bottom:6px;top:auto;right:auto}
body.mob .narr.strip{position:static;width:auto;max-height:96px;min-height:40px;margin-top:6px;font-size:12px;line-height:1.45;border-radius:8px;background:rgba(12,10,16,.92);border:1px solid #3a3240;padding:6px 9px}
body.mob .banner{width:min(92%,340px);padding:12px 14px} body.mob .banner b{font-size:20px}
body.mob .btn{min-height:40px}
body.mob .tabs .tab{min-height:42px}
body.mob .toast{bottom:calc(var(--dockH,176px) + 10px);max-width:92vw;text-align:center;font-size:13.5px}
body.mob .dock{display:flex;flex-direction:column;gap:6px;position:fixed;left:0;right:0;bottom:0;z-index:25;padding:6px 8px calc(7px + env(safe-area-inset-bottom,0px));background:color-mix(in srgb,var(--bg) 95%,transparent);border-top:1px solid var(--line);box-shadow:0 -6px 18px rgba(0,0,0,.28);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);user-select:none;-webkit-user-select:none}
body.mob .drow{display:flex;gap:6px;align-items:stretch;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;min-height:44px}
body.mob .drow::-webkit-scrollbar{display:none}
.db{flex:0 0 auto;min-width:48px;min-height:44px;padding:3px 8px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--fg);font:600 12.5px/1.15 var(--body);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;touch-action:manipulation;cursor:pointer;-webkit-tap-highlight-color:transparent}
.db small{font:500 10px/1.1 var(--body);color:var(--dim);max-width:86px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db .ic{font-size:17px;line-height:1.05}
.db.on{border-color:var(--accent);box-shadow:inset 0 0 0 1.5px var(--accent);background:color-mix(in srgb,var(--accent) 18%,var(--panel))}
.db.go{background:var(--accent);color:var(--ink-on);border-color:var(--accent);min-width:92px;font-size:14.5px}
.db.go small{color:var(--ink-on);opacity:.8}
.db[disabled]{opacity:.35}
.db.cd{position:relative;overflow:hidden} .db.cd::after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.45);transform-origin:left;transform:scaleX(var(--cd,0))}
.dchip{flex:1 0 74px;max-width:120px;min-height:46px;display:flex;align-items:center;gap:6px;padding:3px 7px 3px 4px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--fg);font:600 12px/1.2 var(--body);text-align:left;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.dchip .fc{flex:0 0 30px;width:30px;height:30px;border-radius:50%;background-color:var(--well)}
.dchip .dn{display:flex;flex-direction:column;min-width:0;gap:2px}
.dchip .dn b{color:var(--accent);font-family:var(--mono);margin-right:2px}
.dchip .dn small{font:500 10px/1.15 var(--body);color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:78px}
.dchip .hb{display:block;height:4px;width:64px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden} .dchip .hb i{display:block;height:100%;background:var(--heal)}
.dchip.on{border-color:var(--ally);box-shadow:inset 0 0 0 2px var(--ally);background:color-mix(in srgb,var(--ally) 16%,var(--panel))}
.dchip.dead{opacity:.45}
.dhint{flex:1 1 auto;align-self:center;font:500 12px/1.4 var(--body);color:var(--dim);white-space:normal;padding:2px 2px}
body.mob .dmenu:not([hidden]){display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;position:fixed;right:8px;left:8px;bottom:calc(var(--dockH,176px) + 6px);z-index:26;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:8px;box-shadow:0 -8px 24px rgba(0,0,0,.4)}
body.mob .dmenu .db{width:100%}
body.mob .dmenu .lab{grid-column:1/-1;font:600 11px var(--body);color:var(--dim);margin:2px 2px 0}
body.mob #detail{position:fixed;left:0;right:0;bottom:var(--dockH,176px);top:auto;height:auto;min-height:0;max-height:56svh;z-index:24;background:var(--bg);border-top:1px solid var(--line);border-radius:14px 14px 0 0;padding:8px 10px 10px;display:none;box-shadow:0 -10px 28px rgba(0,0,0,.45);overflow:auto}
body.mob #detail.open{display:flex}
body.mob .dethd{display:flex;align-items:center;justify-content:space-between;gap:8px}
body.mob .detx{display:inline-flex}
body.mob .tip.det{font-size:13px}
</style>""",'css')
# ---------- HTML ----------
rep('<aside class="detail" id="detail" aria-label="상세정보"><div class="dethd">상세정보</div>','<aside class="detail" id="detail" aria-label="상세정보"><div class="dethd">상세정보<button class="btn sm detx" id="detX" type="button">✕ 닫기</button></div>','det')
rep('<div class="toast" id="toast" role="status"></div>','<div class="dock" id="dock" aria-label="조작판"><div class="drow chips" id="dChips"></div><div class="drow acts" id="dActs"></div><div class="drow play" id="dPlay"></div></div>\n<div class="dmenu" id="dMenu" hidden></div>\n<div class="toast" id="toast" role="status"></div>','dock')
# ---------- ordOf line ----------
rep("const ordOf = u => u.order && u.order.k === 'pick' && u.order.id != null ?","const ordOf = u => u.order && u.order.k === 'line' ? ['line', u.order.x, u.order.y] : u.order && u.order.k === 'pick' && u.order.id != null ?",'ordOf')
rep("  if (o[0] === 'hold') return '제자리';","  if (o[0] === 'hold') return '제자리';\n  if (o[0] === 'line') return '전열';",'olab')
# ---------- playClick override ----------
rep("function playClick(w, add){\n  if (world.over) return;\n  const u = unitAt(world, w.x, w.y, false);","function playClick(w, add, u0){\n  if (world.over) return;\n  const u = u0 !== undefined ? u0 : unitAt(world, w.x, w.y, false);   // v5.8 터치는 넉넉히 고른 인물을 넘겨줌",'pc')
# ---------- pointer handlers ----------
rep("""cv.addEventListener('pointerdown', e => {
  cv.setPointerCapture(e.pointerId);
  const w = toWorld(e.clientX, e.clientY);
  pd = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, unit: null, box: mode !== 'edit' && e.button === 0, shift: e.shiftKey, right: e.button === 2 };""",
"""// v5.8 터치: 두 손가락 = 확대 · 축소 (가운데를 붙잡고), 길게 누르기 = 상세정보
const touches = new Map(); let pinch = null, lpT = null;
cv.addEventListener('pointerdown', e => {
  cv.setPointerCapture(e.pointerId);
  const w = toWorld(e.clientX, e.clientY);
  if (e.pointerType === 'touch'){
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (touches.size >= 2){ clearTimeout(lpT); pd = null; const [a, b] = [...touches.values()], mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: cam.z, w0: toWorld(mx, my) }; cam.follow = false; return; }
  }
  pd = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, unit: null, box: mode !== 'edit' && e.button === 0 && e.pointerType !== 'touch', shift: e.shiftKey, right: e.button === 2, touch: e.pointerType === 'touch' };
  if (pd.touch){ clearTimeout(lpT); lpT = setTimeout(() => { if (pd && !pd.moved && !pinch){ pd.long = true; longPress(toWorld(pd.x, pd.y)); } }, 480); }""",'pdown')
rep("""cv.addEventListener('pointermove', e => {
  if (!pd){ hoverTip(e); return; }""","""cv.addEventListener('pointermove', e => {
  if (e.pointerType === 'touch' && touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && touches.size >= 2){
    const [a, b] = [...touches.values()], mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, r = cv.getBoundingClientRect();
    cam.z = Math.min(4, Math.max(0.45, pinch.z0 * (Math.hypot(a.x - b.x, a.y - b.y) || 1) / pinch.d0)); const ts = TS * cam.z;
    cam.x = pinch.w0.x - (mx - r.left - r.width / 2) / ts; cam.y = pinch.w0.y - (my - r.top - r.height / 2) / ts; return;
  }
  if (!pd){ hoverTip(e); return; }
  if (pd.touch && Math.hypot(e.clientX - pd.x, e.clientY - pd.y) >= 9) clearTimeout(lpT);""",'pmove')
rep("""cv.addEventListener('pointerup', e => {
  const d = pd; pd = null; if (!d) return;""","""cv.addEventListener('pointerup', e => {
  touches.delete(e.pointerId); clearTimeout(lpT);
  if (pinch){ if (touches.size < 2) pinch = null; pd = null; return; }
  const d = pd; pd = null; if (!d) return;
  if (d.long) return;   // 길게 누름 = 상세정보만""",'pup')
rep("  if (mode === 'edit'){ if (d.right) editErase(w); else editClick(w); } else if (d.right) rightClick(w); else playClick(w, e.shiftKey);",
    "  if (mode === 'edit'){ if (d.right) editErase(w); else editClick(w); } else if (d.touch) touchTap(w); else if (d.right) rightClick(w); else playClick(w, e.shiftKey);",'pup2')
rep("cv.addEventListener('pointercancel', () => { pd = null; boxSel = null; });","cv.addEventListener('pointercancel', e => { touches.delete(e.pointerId); clearTimeout(lpT); if (touches.size < 2) pinch = null; pd = null; boxSel = null; });",'pcancel')
# ---------- fitBoard on mobile ----------
rep("function fitBoard(){ const w = cv.clientWidth || 600, h = cv.clientHeight || 400;","function fitBoard(){ if (MOB){ mobFit(); return; } const w = cv.clientWidth || 600, h = cv.clientHeight || 400;",'fit')
# ---------- follow camera on mobile ----------
rep("  if (Wd && cam.follow && mode !== 'edit' && !small()){","  if (MOB && Wd && mode !== 'edit') mobFollow(Wd, dt);   // v5.8 모바일: 가까이 볼 때 아군 (고른 아군) 을 따라감\n  if (Wd && cam.follow && mode !== 'edit' && !small() && !MOB){",'follow')
# ---------- ovl short on mobile ----------
rep("    : `${mode === 'run' && paused ? '⏸ 멈춤 · ' : ''}턴 ${Wd.turn} · ${f2(Wd.t)}초 · 보이는 적 ${seen}",
    "    : MOB ? `${mode === 'run' && paused ? '⏸ ' : ''}턴 ${Wd.turn} · ${f2(Wd.t)}초 · 적 ${seen} · 처치 ${Wd.kills[0]}`\n    : `${mode === 'run' && paused ? '⏸ 멈춤 · ' : ''}턴 ${Wd.turn} · ${f2(Wd.t)}초 · 보이는 적 ${seen}",'ovl')
# ---------- hud calls renderDock ----------
rep("  const Wd = W_(); renderSkillBar(Wd); renderDetail(); if (!Wd) return;   // v5.5.4 기술 막대 · v5.6 상세정보 칸",
    "  const Wd = W_(); renderSkillBar(Wd); renderDetail(); renderDock(Wd); if (!Wd) return;   // v5.5.4 기술 막대 · v5.6 상세정보 칸 · v5.8 모바일 조작판",'hud')
# detail empty text on mobile
rep("  let html = '<p class=\"empty\">판의 인물 · 떨어진 물건에 커서를 올리거나 아군을 고르면 여기에 자세히 나와요.</p>';",
    "  let html = MOB ? '<p class=\"empty\">판의 인물 · 떨어진 물건을 길게 누르거나 아군을 고르면 여기에 자세히 나와요.</p>' : '<p class=\"empty\">판의 인물 · 떨어진 물건에 커서를 올리거나 아군을 고르면 여기에 자세히 나와요.</p>';",'detempty')
# ---------- mobile JS block (before keyboard section) ----------
rep("/* ---------- 키보드 ---------- */","""/* ---------- v5.8 모바일 (갤럭시 노트 20 기준) ---------- */
let MOB = false, zoomAll = false, detOpen = false, dockHtml = ['', '', ''], dmTap = null;
const isMob = () => window.innerWidth <= 700 || (window.matchMedia && matchMedia('(pointer: coarse)').matches && window.innerWidth <= 1000);
function setMob(){
  const m = isMob();
  if (m !== MOB){ MOB = m; document.body.classList.toggle('mob', m); const nr = $('narr'); if (m){ $('view').after(nr); nr.classList.add('strip'); } else { $('view').appendChild(nr); nr.classList.remove('strip'); $('detail').classList.remove('open'); } dockHtml = ['', '', '']; }
  if (MOB){ layoutMob(); hud(); }
}
// 판 높이: 맵 세로가 다 들어오게 (한 칸 ≤ 46px), 화면에서 머리글 · 이야기 띠 · 조작판을 뺀 만큼까지
function layoutMob(){
  const dh = $('dock').offsetHeight || 176; document.body.style.setProperty('--dockH', dh + 'px');
  const head = (document.querySelector('.top') || { offsetHeight: 30 }).offsetHeight + 10, narrH = $('narr').hidden ? 0 : 104;
  const avail = Math.max(260, window.innerHeight - head - dh - narrH - 22), w = $('view').clientWidth || window.innerWidth - 16;
  const ts = Math.max(w / (S.W + 0.9), Math.min(avail / (S.H + 1.7), 46));
  document.body.style.setProperty('--viewH', Math.round(small() ? Math.min(avail, (S.H + 1.7) * ts) : avail) + 'px');
}
function mobFit(){
  const w = cv.clientWidth || 396, h = cv.clientHeight || 480, fitAll = Math.min(w / ((S.W + 0.9) * TS), h / ((S.H + 1.7) * TS));
  if (zoomAll || mode === 'edit' || !small()){ cam.z = small() ? fitAll : Math.max(cam.z, 1); if (small()){ cam.x = S.W / 2 - 0.2; cam.y = S.H / 2 - 0.35; } cam.follow = !small() && mode !== 'edit'; return; }
  cam.z = Math.min(46, h / (S.H + 1.7)) / TS; cam.y = S.H / 2 - 0.35; cam.follow = true;
}
// 가까이 볼 때: 고른 아군 (없으면 살아 있는 아군) 의 가운데를 부드럽게 따라감 · 맵 밖은 덜 보이게
function mobFollow(Wd, dt){
  if (!cam.follow || pd || pinch) return;
  const L = selUnits(Wd), G = L.length ? L : Wd.units.filter(u => u.side === 0 && u.alive); if (!G.length) return;
  const tx = G.reduce((a, u) => a + u.x, 0) / G.length, ty = G.reduce((a, u) => a + u.y, 0) / G.length, ts = TS * cam.z, hw = cv.clientWidth / 2 / ts, hh = cv.clientHeight / 2 / ts;
  const cx = S.W + 0.4 > hw * 2 ? Math.min(S.W - hw + 0.3, Math.max(hw - 0.5, tx)) : S.W / 2 - 0.2, cy = S.H + 1.2 > hh * 2 ? Math.min(S.H - hh + 0.6, Math.max(hh - 0.8, ty)) : S.H / 2 - 0.35;
  const k = 1 - Math.pow(0.004, dt); cam.x += (cx - cam.x) * k; cam.y += (cy - cam.y) * k;
}
// 탭: 아군 = 고르기 · 적 = 공격 (빠르게 두 번 = 급함) · 바닥 = 이동 (두 번 = 서두름) · 물건 = 줍기. 고르는 중 (돌진 · 투창 · 약 · 공격 이동) 이면 그 대상
function unitNear(Wd, x, y){ const ts = TS * cam.z; let best = null, bd = 1e9; for (const u of Wd.units){ if (!u.alive) continue; if (u.side === 1 && !u.seenBy && !$('seeAll').checked) continue; const d = Math.hypot(u.x - x, u.y - y); if (d < Math.max(u.r + 0.3, 26 / ts) && d < bd){ bd = d; best = u; } } return best; }
function touchTap(w){
  if (!world || world.over) return;
  if (menuOpen()) { toggleMenu(false); return; }
  const u = unitNear(world, w.x, w.y);
  if (u || skillPick || throwPick || chargePick || amovePick){ playClick(w, false, u); return; }
  const L = selUnits(world);
  if (!L.length){ toast('아군을 먼저 고르세요 — 판의 아군이나 아래 칩을 탭'); return; }
  const it = itemAt(world, w.x, w.y); if (it){ givePick(it); return; }
  rightClick(w);
}
function longPress(w){
  const Wd = W_(); if (!Wd) return;
  const u = unitNear(Wd, w.x, w.y) || (mode === 'edit' ? unitAt(Wd, w.x, w.y, true) : null), it = !u && mode !== 'edit' ? itemAt(Wd, w.x, w.y) : null;
  if (!u && !it) return;
  hoverPid = u ? u.pid : null; hoverItem = it ? it.id : null; openDet(true);
  try { navigator.vibrate && navigator.vibrate(12); } catch (e) {}
}
function openDet(on){ detOpen = on; $('detail').classList.toggle('open', on); if (!on){ hoverPid = null; hoverItem = null; } renderDetail(); dockHtml[2] = ''; renderDock(W_()); }
$('detX').addEventListener('click', () => openDet(false));
const menuOpen = () => !$('dMenu').hidden;
function toggleMenu(on){ $('dMenu').hidden = !on; if (on) renderMenu(); dockHtml[2] = ''; renderDock(W_()); }
function renderMenu(){
  const t = rules.turn;
  $('dMenu').innerHTML = `<p class="lab">보기</p><button class="db ${$('seeAll').checked ? 'on' : ''}" data-dm="see">👁<small>모두 보기</small></button><button class="db ${$('detailAll').checked ? 'on' : ''}" data-dm="det">🔎<small>자세히 보기</small></button><button class="db ${document.body.classList.contains('leg') ? 'on' : ''}" data-dm="leg">🗺<small>범례</small></button>
    <p class="lab">한 턴 길이 (Enter · ⏭ 한 턴)</p>${[0.5, 1, 1.5, 2].map(v => `<button class="db ${t === v ? 'on' : ''}" data-dm="turn" data-v="${v}">${v}초</button>`).join('')}
    <p class="lab">그 밖</p><button class="db" data-dm="fs">⛶<small>${document.fullscreenElement ? '전체 화면 끄기' : '전체 화면'}</small></button><button class="db" data-dm="reset">⟲<small>배치로</small></button><button class="db" data-dm="panel">☷<small>기록 · 수치</small></button>`;
}
// 조작판 단추: 누른 자리에서 손을 떼면 (9px 안) 실행 — 그사이 칸이 다시 그려져도 됨
function dockTap(root, fn){
  root.addEventListener('pointerdown', e => { dmTap = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  root.addEventListener('pointerup', e => { const d = dmTap; dmTap = null; if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 9 || performance.now() - d.t > 900) return; const el = document.elementFromPoint(e.clientX, e.clientY); const b = el && el.closest('[data-dk],[data-dc],[data-dm]'); if (!b || b.disabled || !root.contains(b)) return; e.preventDefault(); fn(b); });
  root.addEventListener('click', e => { if (e.detail === 0){ const b = e.target.closest('[data-dk],[data-dc],[data-dm]'); if (b && !b.disabled) fn(b); } });   // 키보드 (Enter) 로 누름
}
dockTap($('dock'), b => {
  const Wd = W_();
  if (b.dataset.dc != null){ if (!world || mode === 'edit') return; const u = world.units[+b.dataset.dc]; if (!u) return;
    if (skillPick && u.alive){ giveSkill(u); return; }
    if (!u.alive && !u.down){ toast(`${u.name}${jong(u.name) ? '은' : '는'} 쓰러졌어요`); return; }
    if (sel.has(u.i)) sel.delete(u.i); else sel.add(u.i); hud(); return; }
  const k = b.dataset.dk;
  if (k === 'start' || k === 'again'){ start(); if (MOB){ mobFit(); } return; }
  if (k === 'reset'){ resetToEdit(); return; }
  if (k === 'edit'){ showTab('place'); $('side').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if (k === 'play'){ togglePlay(); return; }
  if (k === 'step'){ nextTurn(); return; }
  if (k === 'speed'){ const L2 = [0.25, 0.5, 1, 2], v = L2[(L2.indexOf(speed) + 1) % L2.length]; const sb = $('speedSeg').querySelector(`[data-sp="${v}"]`); if (sb) sb.click(); hud(); return; }
  if (k === 'zoom'){ zoomAll = !zoomAll; mobFit(); hud(); return; }
  if (k === 'follow'){ cam.follow = !cam.follow; if (cam.follow && !zoomAll) mobFit(); hud(); return; }
  if (k === 'info'){ openDet(!detOpen); return; }
  if (k === 'menu'){ toggleMenu(!menuOpen()); return; }
  if (k === 'all'){ if (!world) return; const A = world.units.filter(u => u.side === 0 && u.alive); sel = A.every(u => sel.has(u.i)) ? new Set() : new Set(A.map(u => u.i)); hud(); return; }
  if (k === 'pickx'){ skillPick = null; throwPick = null; chargePick = null; amovePick = false; toast('고르기를 취소했어요'); hud(); return; }
  if (/^sk\\d$/.test(k)){ useSlot(+k.slice(2)); hud(); return; }
  if (['amove', 'hold', 'auto', 'line', 'guard', 'pick', 'swing', 'cancel', 'torch'].includes(k)){ ordKey(k); hud(); return; }
});
dockTap($('dMenu'), b => {
  const k = b.dataset.dm;
  if (k === 'see'){ $('seeAll').checked = !$('seeAll').checked; $('seeAll').dispatchEvent(new Event('change')); }
  else if (k === 'det'){ $('detailAll').checked = !$('detailAll').checked; $('detailAll').dispatchEvent(new Event('change')); }
  else if (k === 'leg') document.body.classList.toggle('leg');
  else if (k === 'turn'){ const sl = $('turnLen'); sl.value = b.dataset.v; sl.dispatchEvent(new Event('change')); }
  else if (k === 'fs'){ $('fsBtn').click(); }
  else if (k === 'reset'){ toggleMenu(false); resetToEdit(); return; }
  else if (k === 'panel'){ toggleMenu(false); showTab('log'); $('side').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  renderMenu(); hud();
});
const dockState = (Wd, u) => u.down ? '쓰러짐 · 일어나는 중' : !u.alive ? '쓰러짐' : u.act ? actLabel(Wd, u, liveAct(Wd, u)) : orderLabel(Wd, ordOf(u)) || moodLabel(Wd, u) || '';
function renderDock(Wd){
  if (!MOB) return;
  const ed = mode === 'edit', over = !!(Wd && Wd.over), L = Wd && !ed ? selUnits(Wd) : [];
  const allies = Wd ? Wd.units.filter(u => u.side === 0) : [];
  const chips = allies.map(u => `<button type="button" class="dchip ${!ed && sel.has(u.i) ? 'on' : ''} ${u.alive ? '' : 'dead'}" data-dc="${u.i}"><span class="fc" style="${faceCss(faceOf(u.ref), 30)}"></span><span class="dn"><span><b>${allyNo(Wd, u)}</b>${esc(u.name)}</span><i class="hb"><i style="width:${Math.max(0, u.hp / u.max * 100).toFixed(0)}%"></i></i><small>${esc(ed ? (u.role || u.cls || '') : dockState(Wd, u))}</small></span></button>`).join('')
    + (!ed && Wd ? `<button type="button" class="db" data-dk="all"><span class="ic">👥</span><small>${allies.filter(u => u.alive).every(u => sel.has(u.i)) && L.length ? '풀기' : '모두'}</small></button>` : '');
  let acts;
  const pickTxt = chargePick ? '돌진: 적이나 바닥을 탭' : throwPick ? '투창: 적을 탭' : skillPick ? '약: 아군 (판 · 칩) 을 탭' : amovePick ? '공격 이동: 바닥을 탭' : '';
  if (ed) acts = `<span class="dhint">배치 중 — 아래 배치 칸에서 인물 · 맵을 고치고 ▶ 전투 시작. 판: 끌기 = 옮기기 · 두 손가락 = 확대</span>`;
  else if (!Wd) acts = '';
  else if (over) acts = `<span class="dhint">${Wd.result === 'win' ? '적을 모두 쓰러뜨렸어요' : '전멸했어요'} — 다시 하거나 배치로. 이야기 · 로그는 아래에</span>`;
  else if (pickTxt) acts = `<span class="dhint"><b>${esc(pickTxt)}</b></span><button type="button" class="db" data-dk="pickx"><span class="ic">✕</span><small>취소</small></button>`;
  else if (!L.length) acts = `<span class="dhint">아군을 탭해 고르세요 (판 · 위 칩). 그다음 바닥 탭 = 이동 · 적 탭 = 공격 · 빠르게 두 번 = 서두름 · 길게 누르기 = 상세</span>`;
  else {
    const sk = [1, 2, 3, 4].map(n => { const s2 = slotState(Wd, L, n); if (s2.off) return ''; const cdF = s2.cd > 0 ? Math.min(1, s2.cd / Math.max(0.1, s2.cdMax)) : 0;
      return `<button type="button" class="db ${s2.on ? 'on' : ''} ${cdF ? 'cd' : ''}" style="${cdF ? '--cd:' + cdF.toFixed(2) : ''}" data-dk="sk${n}"><span class="ic">${s2.ic}</span>${esc(s2.nm)}<small>${esc(s2.cd > 0 ? f2(s2.cd) + '초' : s2.sb || '')}</small></button>`; }).join('');
    const melee = L.filter(u => !isFar(u)).length, gu = L.find(u => u.canGuard), canPick = L.some(u => u.jav && !u.spearHeld && mySpear(Wd, u)) || !!nearItem(Wd, L) || (Wd.torches.some(t => t.dropped) && L.some(u => !u.torch)), sw = L.find(u => u.canSweep);
    acts = sk + `<button type="button" class="db ${amovePick ? 'on' : ''}" data-dk="amove"><span class="ic">⚔</span>공격 이동</button>`
      + `<button type="button" class="db" data-dk="hold"><span class="ic">■</span>제자리</button>`
      + `<button type="button" class="db" data-dk="auto"><span class="ic">↺</span>자동</button>`
      + (melee >= 2 ? `<button type="button" class="db" data-dk="line"><span class="ic">▬</span>전열</button>` : '')
      + (gu ? `<button type="button" class="db ${gu.guardMode === 'hold' ? 'on' : ''}" data-dk="guard"><span class="ic">🛡</span>막기<small>${GM_SHORT[gu.guardMode || 'auto']}</small></button>` : '')
      + (canPick ? `<button type="button" class="db" data-dk="pick"><span class="ic">✋</span>줍기</button>` : '')
      + (sw ? `<button type="button" class="db" data-dk="swing"><span class="ic">🔨</span>휘두르기<small>${SWING_NM[sw.swing || '']}</small></button>` : '')
      + (L.some(u => u.hero) && Wd.spare > 0 ? `<button type="button" class="db" data-dk="torch"><span class="ic">🔥</span>횃불<small>${Wd.spare}개</small></button>` : '')
      + (L.some(u => u.order || u.stay) ? `<button type="button" class="db" data-dk="cancel"><span class="ic">✕</span>취소</button>` : '');
  }
  const playing = mode === 'run' && !paused;
  const spT = { 0.25: '½×', 0.5: '1×', 1: '2×', 2: '4×' }[speed] || speed + '×';
  const play = ed ? `<button type="button" class="db go" data-dk="start">▶ 전투 시작</button><button type="button" class="db" data-dk="edit"><span class="ic">✎</span><small>배치 고치기</small></button><button type="button" class="db ${detOpen ? 'on' : ''}" data-dk="info"><span class="ic">ⓘ</span><small>상세</small></button><button type="button" class="db" data-dk="menu"><span class="ic">☰</span><small>더 보기</small></button>`
    : over ? `<button type="button" class="db go" data-dk="again">▶ 다시</button><button type="button" class="db" data-dk="reset"><span class="ic">⟲</span><small>배치로</small></button><button type="button" class="db ${detOpen ? 'on' : ''}" data-dk="info"><span class="ic">ⓘ</span><small>상세</small></button><button type="button" class="db" data-dk="menu"><span class="ic">☰</span><small>더 보기</small></button>`
    : `<button type="button" class="db go" data-dk="play">${playing ? '⏸ 멈춤' : '▶ 재생'}<small>${playing ? '멈추고 명령' : Wd && Wd.t < 1e-6 ? '시작' : '이어서'}</small></button>`
      + `<button type="button" class="db" data-dk="step" ${playing ? 'disabled' : ''}><span class="ic">⏭</span><small>${mode === 'run' && paused ? '턴 끝까지' : '한 턴'}</small></button>`
      + `<button type="button" class="db" data-dk="speed"><span class="ic" style="font-size:14px">${spT}</span><small>속도</small></button>`
      + `<button type="button" class="db" data-dk="zoom"><span class="ic">${zoomAll ? '🔍' : '⤢'}</span><small>${zoomAll ? '가까이' : '전체'}</small></button>`
      + `<button type="button" class="db ${cam.follow ? 'on' : ''}" data-dk="follow"><span class="ic">◎</span><small>따라감</small></button>`
      + `<button type="button" class="db ${detOpen ? 'on' : ''}" data-dk="info"><span class="ic">ⓘ</span><small>상세</small></button>`
      + `<button type="button" class="db ${menuOpen() ? 'on' : ''}" data-dk="menu"><span class="ic">☰</span><small>더 보기</small></button>`;
  const parts = [chips, acts, play], ids = ['dChips', 'dActs', 'dPlay'];
  for (let k = 0; k < 3; k++) if (parts[k] !== dockHtml[k]){ dockHtml[k] = parts[k]; $(ids[k]).innerHTML = parts[k]; }
  const dh = $('dock').offsetHeight; if (dh && Math.abs(dh - (parseFloat(getComputedStyle(document.body).getPropertyValue('--dockH')) || 0)) > 2) document.body.style.setProperty('--dockH', dh + 'px');
}
window.addEventListener('resize', () => { setMob(); if (MOB && small()) mobFit(); });
window.addEventListener('orientationchange', () => setTimeout(() => { setMob(); if (MOB) mobFit(); }, 200));

/* ---------- 키보드 ---------- */""",'mobjs')
# start(): mobile fit after start
rep("  cam.follow = !small(); if (small()) fitBoard(); else if (h){ cam.x = h.x; cam.y = h.y; }","  cam.follow = !small(); if (small()) fitBoard(); else if (h){ cam.x = h.x; cam.y = h.y; }\n  if (MOB){ zoomAll = false; detOpen = false; $('detail').classList.remove('open'); requestAnimationFrame(() => { layoutMob(); mobFit(); }); }",'startmob')
rep("function resetToEdit(){\n  mode = 'edit'; world = null; cont = false; paused = false;","function resetToEdit(){\n  mode = 'edit'; world = null; cont = false; paused = false; if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });",'resetmob')
open(P,'w').write(s); print('ok')
