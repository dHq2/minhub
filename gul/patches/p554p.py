import sys
p='page10.tpl.html'; s=open(p,encoding='utf-8').read()
for a in ['굴의 전투판 v5.5.3 (', '굴의 전투판 v5.5.3 —', '굴의 전투판 v5.5.3 ·']:
    s=s.replace(a, a.replace('v5.5.3','v5.5.4'))
pairs=[
("""     v5.5.3: 돌진 명령 = "정한 곳으로 돌격!!\"""", """     v5.5.4: 기술 막대 — 판 아래 가운데에 고른 아군의 기술 칸 1 ~ 4 (아이콘 · 이름 · 대기 시간 덮개 · 명령 중 ▶ 대상 · 고르는 중 빛남). 눌러서 써도 됨.
     v5.5.3: 돌진 명령 = "정한 곳으로 돌격!!\""""),
("""<span class="ver">v5.5.3 · 정한 곳으로 돌격""", """<span class="ver">v5.5.4 · 기술 막대 · 정한 곳으로 돌격"""),
# CSS
(""".legend2 span{display:inline-flex;align-items:center;gap:5px}""", """.legend2 span{display:inline-flex;align-items:center;gap:5px}
/* v5.5.4 기술 막대 (판 아래 가운데) */
.skbar{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);display:flex;gap:6px;align-items:stretch;background:rgba(12,10,16,.84);border:1px solid #3a3240;border-radius:10px;padding:6px 8px;z-index:2;font:500 11px var(--body);color:#ece4d6;box-shadow:0 6px 24px rgba(0,0,0,.5);max-width:calc(100% - 16px)}
.skbar .who{display:flex;flex-direction:column;justify-content:center;padding-right:8px;border-right:1px solid #3a3240;max-width:120px;font-weight:700;font-size:11.5px;line-height:1.35}
.skbar .who small{font-weight:500;color:#a39a8c;font-size:10px}
.sk{position:relative;width:78px;height:58px;border-radius:8px;border:1px solid #4a4050;background:#1a161e;color:#ece4d6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;cursor:pointer;overflow:hidden;padding:0;font:inherit}
.sk:hover{border-color:#8a7a60}
.sk .ic{font-size:19px;line-height:1.1}
.sk .nm{font-size:10.5px;font-weight:700;white-space:nowrap}
.sk .sb{font-size:9.5px;color:#b9ae9c;max-width:74px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sk kbd{position:absolute;left:4px;top:3px;font:700 9.5px var(--mono);color:#e9c46a;background:none;border:0;padding:0}
.sk .cd{position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.66);pointer-events:none}
.sk .cdt{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:800 15px var(--mono);color:#fff;text-shadow:0 1px 3px #000;pointer-events:none}
.sk.on{border-color:#e9c46a;box-shadow:0 0 0 2px rgba(233,196,106,.5) inset,0 0 14px rgba(233,196,106,.55)}
.sk.ord{border-color:#6fe08f;box-shadow:0 0 0 1px rgba(111,224,143,.5) inset}
.sk.off{opacity:.32;cursor:default}
.view.hasbar .legend2{bottom:84px}
@media (max-width:640px){ .sk{width:60px;height:52px} .sk .ic{font-size:16px} .skbar .who{display:none} }"""),
# DOM
("""        <div class="tip" id="tip" hidden></div>""", """        <div class="tip" id="tip" hidden></div>
        <div class="skbar" id="skbar" hidden aria-label="기술 칸"></div>"""),
# 그리기 · 갱신
("""function useSlot(n){""", """// v5.5.4 기술 막대: 고른 아군의 기술 칸 1 ~ 4 — 아이콘 · 이름 · 대기 시간 (덮개 + 초) · 명령 중 (▶ 대상) · 고르는 중 (빛남). 바뀐 때만 다시 그림
const SLOT_IC = { charge: '💨', throw: '🔱', leap: '↩', skill: '✚' };
function slotState(Wd, L, n){
  const S2 = SLOTS[n - 1], C = L.filter(S2.has), R = Wd.rules;
  const st = { n, k: S2.k, ic: SLOT_IC[S2.k], nm: S2.name, sb: '', cd: 0, cdMax: 1, on: false, ord: null, off: !C.length };
  if (st.off){ st.sb = L.length ? '없음' : ''; return st; }
  const ordOf2 = k => { const o = C.find(u => u.order && u.order.k === k); return o ? (o.order.b != null && Wd.units[o.order.b] ? Wd.units[o.order.b].name : '정한 자리') : null; };
  if (S2.k === 'charge'){ const sh = C.some(u => u.shield); st.ic = sh ? '🛡' : '💨'; st.nm = sh ? '방패 돌진' : '돌진'; st.cd = Math.max(0, ...C.map(u => u.chargeCd - Wd.t)); st.cdMax = (R.charge || {}).cd || 8; st.on = !!chargePick; st.ord = ordOf2('charge'); st.sb = st.on ? '적 · 바닥을 누름' : C.some(u => u.act && u.act.k === 'charge') ? '달리는 중!' : ''; }
  else if (S2.k === 'throw'){ st.on = !!throwPick; st.ord = ordOf2('throw'); const held = C.some(u => u.spearHeld); st.sb = st.on ? '적을 누름' : held ? '' : '창 없음 · E 줍기'; if (!held) st.cd = 1, st.cdMax = 1; }
  else if (S2.k === 'leap'){ st.cd = Math.max(0, ...C.map(u => u.leapCd - Wd.t)); st.cdMax = (R.leap || {}).cd || 1.1; }
  else { const K = C[0].skill; st.nm = K.name; st.cd = Math.max(0, ...C.map(u => u.skill.kit ? u.skill.cdT - Wd.t : 0)); st.cdMax = K.cd || 5; st.on = !!skillPick; st.ord = ordOf2('skill'); st.sb = st.on ? '아군을 누름' : '남은 ' + C.map(u => u.skill.left).join('·'); }
  if (st.ord && !st.on) st.sb = '▶ ' + st.ord;
  return st;
}
let skbarHtml = '';
function renderSkillBar(Wd){
  const el = $('skbar'); if (!el) return;
  const show = !!Wd && mode !== 'edit' && !Wd.over && Wd.units.some(u => u.side === 0 && u.alive);
  el.hidden = !show; $('view').classList.toggle('hasbar', show); if (!show) return;
  const L = selUnits(Wd);
  const who = L.length === 1 ? `${esc(L[0].name)}<small>${L[0].act ? esc(actLabel(Wd, L[0], liveAct(Wd, L[0]))) : L[0].order ? '명령 받음' : '자동'}</small>` : L.length ? `${L.length}명<small>${esc(L.map(u => u.name).join(' · '))}</small>` : `아군을 고르세요<small>숫자키 1 ~ 4 = 기술</small>`;
  const html = `<div class="who">${who}</div>` + [1, 2, 3, 4].map(n => { const s2 = slotState(Wd, L, n), cdF = s2.cd > 0 ? Math.min(1, s2.cd / Math.max(0.1, s2.cdMax)) : 0;
    return `<button type="button" class="sk ${s2.off ? 'off' : ''} ${s2.on ? 'on' : ''} ${s2.ord ? 'ord' : ''}" data-sk="${n}" title="${esc(s2.nm)} (숫자키 ${n})" ${s2.off ? 'disabled' : ''}><kbd>${n}</kbd><span class="ic">${s2.ic}</span><span class="nm">${esc(s2.nm)}</span><span class="sb">${esc(s2.sb || (s2.cd > 0 ? '' : '준비됨'))}</span>${cdF > 0 ? `<span class="cd" style="height:${(cdF * 100).toFixed(0)}%"></span>${s2.k !== 'throw' ? `<span class="cdt">${s2.cd.toFixed(1)}</span>` : ''}` : ''}</button>`; }).join('');
  if (html !== skbarHtml){ skbarHtml = html; el.innerHTML = html; }
}
$('skbar').addEventListener('pointerdown', e => e.stopPropagation());
$('skbar').addEventListener('click', e => { const b = e.target.closest('[data-sk]'); if (!b || b.disabled || !world || world.over) return; useSlot(+b.dataset.sk); renderSkillBar(world); });
function useSlot(n){"""),
("""function hud(){
  const Wd = W_(); if (!Wd) return;""", """function hud(){
  const Wd = W_(); renderSkillBar(Wd); if (!Wd) return;   // v5.5.4 기술 막대"""),
]
for o,n in pairs:
    if s.count(o)!=1: print('MISMATCH',s.count(o),o[:120]); sys.exit(1)
for o,n in pairs: s=s.replace(o,n)
open(p,'w',encoding='utf-8').write(s); print('ok')
