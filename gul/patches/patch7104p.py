import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    s=s.replace(a,b)
# CSS
rep(".sk.on{border-color:#e9c46a;",""".sp-leap{--sc:#4fc3f7}.sp-palm{--sc:#ff8a4a}.sp-skill{--sc:#5fe08a}.sp-charge,.sp-swing{--sc:#c58bff}
.sk.sp{border:2px solid var(--sc);background:color-mix(in srgb,var(--sc) 14%,#1a161e);box-shadow:0 0 0 1px color-mix(in srgb,var(--sc) 35%,transparent) inset,0 0 10px color-mix(in srgb,var(--sc) 55%,transparent)}
.sk.sp::after{content:"특수";position:absolute;right:4px;top:2px;font:800 8.5px var(--mono);color:var(--sc)}
.sk.sp .nm{color:color-mix(in srgb,var(--sc) 55%,#fff)}
.sk.on{border-color:#e9c46a;""")
rep(".db.on{border-color:var(--accent);",".db.sp{border:2px solid var(--sc);background:color-mix(in srgb,var(--sc) 14%,var(--panel));box-shadow:0 0 8px color-mix(in srgb,var(--sc) 50%,transparent)}\n.db.on{border-color:var(--accent);")
rep(".ring .rb.on{",".ring .rb.sp{border-color:var(--sc);background:color-mix(in srgb,var(--sc) 20%,#141116);box-shadow:0 0 10px color-mix(in srgb,var(--sc) 60%,transparent)}\n.ring .rb.on{")
# 상태: 특수
rep("  if (st.ord && !st.on) st.sb = '▶ ' + st.ord;\n  return st;","  if (st.ord && !st.on) st.sb = '▶ ' + st.ord;\n  if (spOf(C, S2.k)) st.sp = S2.k;   // v7.10.4 특수 스킬 (색 테두리 · 맨 앞)\n  return st;")
rep("const SLOT_IC = {","""// v7.10.4 특수 스킬: 인물 고유 기술 (청광묵 도약 · 팜 버스트, 노먼 응급처치, 카리우스 돌진 · 광역 휘두르기) 은 색 테두리 + '특수' 표시, 기술 칸에서 맨 앞에
const spOf = (C, k) => k === 'leap' || k === 'palm' || k === 'skill' || ((k === 'charge' || k === 'swing') && C.some(u => u.modBody));
const slotOrder = (Wd, L) => SLOTS.map((_, i) => i + 1).map(n => ({ n, s: slotState(Wd, L, n) })).sort((a, b) => (a.s.off ? 2 : a.s.sp ? 0 : 1) - (b.s.off ? 2 : b.s.sp ? 0 : 1));
const SLOT_IC = {""")
# skbar
rep("  const html = `<div class=\"who\">${who}</div>` + SLOTS.map((_, i) => i + 1).map(n => { const s2 = slotState(Wd, L, n), cdF =","  const swU = L.find(u => u.modBody && u.canSweep), swb = swU ? `<button type=\"button\" class=\"sk sp sp-swing\" data-sw=\"1\" title=\"카리우스의 광역기 — 넓게 휘두르기 모드를 돌림 (V)\"><kbd>V</kbd><span class=\"ic\">🔨</span><span class=\"nm\">휘두르기</span><span class=\"sb\">${esc(SWING_NM[swU.swing || ''])}</span></button>` : '';\n  const html = `<div class=\"who\">${who}</div>` + swb + slotOrder(Wd, L).map(({ n, s: s2 }) => { const cdF =")
rep("<button type=\"button\" class=\"sk ${s2.off ? 'off' : ''} ${s2.on ? 'on' : ''} ${s2.ord ? 'ord' : ''}\"","<button type=\"button\" class=\"sk ${s2.off ? 'off' : ''} ${s2.sp ? 'sp sp-' + s2.sp : ''} ${s2.on ? 'on' : ''} ${s2.ord ? 'ord' : ''}\"")
rep("$('skbar').addEventListener('click', e => { const b = e.target.closest('[data-sk]');","$('skbar').addEventListener('click', e => { if (e.target.closest('[data-sw]') && world && !world.over){ ordKey('swing'); renderSkillBar(world); hud(); return; } const b = e.target.closest('[data-sk]');")
# 도크
rep("const sk = SLOTS.map((_, i) => i + 1).map(n => { const s2 = slotState(Wd, L, n); if (s2.off) return ''; const cdF","const sk = slotOrder(Wd, L).map(({ n, s: s2 }) => { if (s2.off) return ''; const cdF")
rep("return `<button type=\"button\" class=\"db ${s2.on ? 'on' : ''} ${cdF ? 'cd' : ''}\" style=\"${cdF ? '--cd:' + cdF.toFixed(2) : ''}\" data-dk=\"sk${n}\">","return `<button type=\"button\" class=\"db ${s2.sp ? 'sp sp-' + s2.sp : ''} ${s2.on ? 'on' : ''} ${cdF ? 'cd' : ''}\" style=\"${cdF ? '--cd:' + cdF.toFixed(2) : ''}\" data-dk=\"sk${n}\">")
rep("sw = L.find(u => u.canSweep);","sw = L.find(u => u.canSweep), swS = L.find(u => u.modBody && u.canSweep);")
rep("    acts = sk + `<button type=\"button\" class=\"db ${amovePick","    acts = (swS ? `<button type=\"button\" class=\"db sp sp-swing\" data-dk=\"swing\"><span class=\"ic\">🔨</span>휘두르기<small>${SWING_NM[swS.swing || '']}</small></button>` : '') + sk + `<button type=\"button\" class=\"db ${amovePick")
rep("      + (sw ? `<button type=\"button\" class=\"db\" data-dk=\"swing\">","      + (sw && !swS ? `<button type=\"button\" class=\"db\" data-dk=\"swing\">")
# 링
rep("const st = SLOTS.map((_, i) => i + 1).map(n => slotState(world, [u], n)).filter(x => !x.off);","const st = SLOTS.map((_, i) => i + 1).map(n => slotState(world, [u], n)).filter(x => !x.off).sort((a, b) => (b.sp ? 1 : 0) - (a.sp ? 1 : 0));")
rep("<button type=\"button\" class=\"rb ${x.on ? 'on' : ''} ${cdF ? 'cd' : ''}\" data-rs=","<button type=\"button\" class=\"rb ${x.sp ? 'sp sp-' + x.sp : ''} ${x.on ? 'on' : ''} ${cdF ? 'cd' : ''}\" data-rs=")
# 버전
rep("<!-- 굴의 전투판 v7.10.3 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v7.10.4 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v7.10.4: 특수 스킬 강조 — 인물 고유 기술 (청광묵 도약 · 팜 버스트, 노먼 응급처치, 카리우스 돌진 · 광역 휘두르기) 은 기술 칸 (데스크톱 아래 막대 · 모바일 도크 · 꾹 누름 부채) 에서 맨 앞에, 기술마다 색 테두리 (도약 하늘 · 팜 버스트 주황 · 응급처치 초록 · 카리우스 보라) + '특수' 표시. 숫자키 번호는 그대로 (칸 위치만 앞으로). 카리우스에게 광역 휘두르기 (V) 칸 추가.\n")
rep("바뀐 것은 머리 주석 (소스 보기) 의 버전 기록에 — v7.10.3","바뀐 것은 머리 주석 (소스 보기) 의 버전 기록에 — v7.10.4 특수 스킬 강조 / v7.10.3")
rep(">v7.10.3 · 야시 C 3.75칸 (D 신설)</span>",">v7.10.4 · 특수 스킬 강조 · 야시 D</span>")
rep('h1::after{content:" v7.10.3"','h1::after{content:" v7.10.4"')
rep("<footer>굴의 전투판 v7.10.3","<footer>굴의 전투판 v7.10.4")
rep("return `굴의 전투판 v7.10.3 · ${title}","return `굴의 전투판 v7.10.4 · ${title}")
rep("copyText('굴의 전투판 v7.10.3 자동 판 기록","copyText('굴의 전투판 v7.10.4 자동 판 기록")
open(f,'w').write(s); print('ok')
