import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    s=s.replace(a,b)
# A. 명령 칸 다시 그림 줄이기 + 눌렀다 뗀 사이 바뀌어도 누른 것으로
rep("function renderOrders(Wd){\n  const box = $('orders');","""const ordTmp = document.createElement('div'); let ordCache = '';
function renderOrders(Wd){   // v7.10.6 속이 같으면 다시 그리지 않음 (눌리는 중에 단추가 바뀌지 않게)
  ordTmp.hidden = false; renderOrders0(Wd); const real = $('orders'); real.hidden = ordTmp.hidden;
  if (ordTmp.innerHTML !== ordCache){ ordCache = ordTmp.innerHTML; real.innerHTML = ordCache; }
}
function renderOrders0(Wd){
  const box = ordTmp;""")
rep("$('orders').addEventListener('click', e => {","""// v7.10.6 PC: 판이 계속 다시 그려져 누르고 뗀 사이 단추가 바뀌면 click 이 안 오던 것 (교전 금지 · 태세 · 아군 카드가 안 눌림) — 누른 자리와 뗀 자리가 같은 단추면 누른 것으로
(function(){
  const KEYS = ['data-ord', 'data-ally', 'data-foe', 'data-slot', 'data-cancel', 'data-pst'], SEL = KEYS.map(k => '[' + k + ']').join(',');
  let down = null, swallow = 0;
  const keyOf = el => { for (const k of KEYS) if (el.hasAttribute(k)) return k + '=' + el.getAttribute(k); return null; };
  for (const id of ['orders', 'party', 'foes']){ const root = $(id); if (!root) continue;
    root.addEventListener('pointerdown', e => { if (MOB || e.button !== 0) return; const el = e.target.closest(SEL); down = el ? keyOf(el) : null; }, true);
    root.addEventListener('pointerup', e => { if (MOB || e.button !== 0 || !down) return; const k0 = down; down = null; const el = e.target.closest(SEL); if (!el || keyOf(el) !== k0) return;
      swallow = performance.now() + 600; el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey })); }, true);
    root.addEventListener('click', e => { if (e.isTrusted && performance.now() < swallow){ e.stopImmediatePropagation(); e.preventDefault(); } }, true); }
})();
$('orders').addEventListener('click', e => {""")
# B. 휘두르기: 카리우스만 따로 줄 (자동 · 넓게 · 찍기) + 지금 모드 표시
rep(".sk.on{border-color:#e9c46a;",""".swbar{position:absolute;left:50%;bottom:80px;transform:translateX(-50%);display:flex;gap:5px;align-items:center;background:rgba(18,12,28,.92);border:2px solid #c58bff;border-radius:10px;padding:4px 8px;z-index:7;font:700 11.5px var(--body);color:#e6d6ff;box-shadow:0 0 12px rgba(197,139,255,.45);white-space:nowrap}
.swbar[hidden],body.mob .swbar{display:none}
.swbar .swt{display:flex;flex-direction:column;line-height:1.2;padding-right:6px;border-right:1px solid #5a4670;margin-right:2px} .swbar .swt small{font:500 10px var(--body);color:#b9a3d6}
.swbar button{border:1px solid #6a5188;background:#241a36;color:#e6d6ff;border-radius:7px;padding:5px 11px;font:700 12px var(--body);cursor:pointer}
.swbar button:hover{border-color:#c58bff}
.swbar button.on{background:#c58bff;color:#1a0f2a;border-color:#fff}
.sk.on{border-color:#e9c46a;""")
rep('        <div class="skbar" id="skbar" hidden aria-label="기술 칸"></div>','        <div class="swbar" id="swbar" hidden aria-label="카리우스 휘두르기 모드"></div>\n        <div class="skbar" id="skbar" hidden aria-label="기술 칸"></div>')
# skbar 의 옛 휘두르기 칸 제거
rep("  const swU = L.find(u => u.modBody && u.canSweep), swb = swU ? `<button type=\"button\" class=\"sk sp sp-swing\" data-sw=\"1\" title=\"카리우스의 광역기 — 넓게 휘두르기 모드를 돌림 (V)\"><kbd>V</kbd><span class=\"ic\">🔨</span><span class=\"nm\">휘두르기</span><span class=\"sb\">${esc(SWING_NM[swU.swing || ''])}</span></button>` : '';\n  const html = `<div class=\"who\">${who}</div>` + swb + slotOrder","  const html = `<div class=\"who\">${who}</div>` + slotOrder")
rep("  if (html !== skbarHtml){ skbarHtml = html; el.innerHTML = html; }\n}","""  if (html !== skbarHtml){ skbarHtml = html; el.innerHTML = html; }
  const sw = $('swbar'), swL = L.filter(u => u.modBody && u.canSweep && u.alive);   // v7.10.6 카리우스 휘두르기 모드 줄
  sw.hidden = !swL.length;
  if (swL.length){ const cur = swL[0].swing || '', mix = swL.some(u => (u.swing || '') !== cur), nm = swL.map(u => u.name).join(' · ');
    const hh = `<span class="swt">🔨 ${esc(nm)} 휘두르기<small>${mix ? '모드가 섞임' : cur ? '명령 중: ' + esc(cur === '휘두르기' ? '넓게 휘두르기' : cur) : '명령 없음 — 스스로 판단'}</small></span>` + [['', '자동'], ['휘두르기', '넓게'], ['찍기', '찍기']].map(([m, t]) => `<button type="button" data-swm="${m}" class="${!mix && cur === m ? 'on' : ''}" title="${m === '' ? '이득을 따져 스스로 (동료가 곁에 있으면 웬만하면 안 휘두름)' : m === '휘두르기' ? '동료가 곁에 있어도 넓게 휘두름' : '한 놈씩 찍기만'}">${t}</button>`).join('');
    if (hh !== swHtml){ swHtml = hh; sw.innerHTML = hh; } }
}
let swHtml = '';
function setSwing(m){ const W = world; if (!W || W.over) return; const C = selUnits(W).filter(u => u.modBody && u.canSweep); if (!C.length) return;
  C.forEach(u => { u.swing = m || null; }); logCmd(W, C, { by: 'user', kind: 'swing', m: m || '자동' });
  toast(`🔨 ${C.map(u => u.name).join(' · ')}: ${m === '휘두르기' ? '넓게 휘두르기 (동료가 곁에 있어도)' : m === '찍기' ? '찍기만 (한 놈씩)' : '자동 (스스로 판단)'}`); renderSkillBar(W); hud(); }
$('swbar').addEventListener('pointerdown', e => e.stopPropagation());
$('swbar').addEventListener('click', e => { const b = e.target.closest('[data-swm]'); if (b) setSwing(b.dataset.swm); });""")
rep("$('skbar').addEventListener('click', e => { if (e.target.closest('[data-sw]') && world && !world.over){ ordKey('swing'); renderSkillBar(world); hud(); return; } const b","$('skbar').addEventListener('click', e => { const b")
# 판 위 표시 (카리우스 머리 근처) · 카드
rep("    // v7.10 교전 금지 태세: 머리 위에 🕊","""    // v7.10.6 휘두르기 명령 중이면 몸 오른쪽 아래에 보라 표시
    if (!ed && u.side === 0 && u.alive && vis && u.swing){ const fs = Math.max(10, Math.min(14, r * 0.45)), t = u.swing === '찍기' ? '🔨찍기' : '🔨넓게'; ctx.save(); ctx.font = `800 ${fs}px IBM Plex Sans KR, sans-serif`; const tw = ctx.measureText(t).width, bx = px + r * 0.5, by = py + r * 0.95; ctx.fillStyle = 'rgba(40,18,70,.94)'; ctx.strokeStyle = '#c58bff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.rect(bx - 3, by - fs * 0.7, tw + 6, fs * 1.4); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#ecdcff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(t, bx, by); ctx.restore(); }
    // v7.10 교전 금지 태세: 머리 위에 🕊""")
rep("${gearTxt(Wd, u)}${ed ? '' : ' · 명령 ' + orderLabel(Wd, ordOf(u))}${linkBadge(Wd, u)}","${gearTxt(Wd, u)}${ed ? '' : ' · 명령 ' + orderLabel(Wd, ordOf(u))}${!ed && u.swing ? `<span class=\"lk c\" title=\"휘두르기 명령 중\">🔨 ${u.swing === '찍기' ? '찍기' : '넓게'}</span>` : ''}${linkBadge(Wd, u)}")
# 버전
rep("<!-- 굴의 전투판 v7.10.5 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v7.10.6 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v7.10.6: PC 명령 단추가 재생 중에 안 눌리던 것 고침 (교전 금지 · 태세 · 아군 카드 …) — 판이 계속 다시 그려져 누르고 뗀 사이 단추가 바뀌면 브라우저가 click 을 안 보냈음 → 누른 자리와 뗀 자리가 같은 단추면 누른 것으로 쳐 줌 + 명령 칸은 속이 같으면 다시 안 그림. 카리우스 휘두르기는 기술 칸 위 따로 줄 (자동 · 넓게 · 찍기, 지금 모드가 보라로 꽉 참 + '명령 중 / 명령 없음') · 판 위 몸 곁 보라 표시 · 카드 배지.\n")
rep("바뀐 것은 머리 주석 (소스 보기) 의 버전 기록에 — v7.10.5","바뀐 것은 머리 주석 (소스 보기) 의 버전 기록에 — v7.10.6 PC 명령 단추 · 휘두르기 줄 / v7.10.5")
rep(">v7.10.5 · PC 조작 편의 · 특수 스킬 강조</span>",">v7.10.6 · PC 명령 단추 고침 · 휘두르기 줄</span>")
rep('h1::after{content:" v7.10.5"','h1::after{content:" v7.10.6"')
rep("<footer>굴의 전투판 v7.10.5","<footer>굴의 전투판 v7.10.6")
rep("return `굴의 전투판 v7.10.5 · ${title}","return `굴의 전투판 v7.10.6 · ${title}")
rep("copyText('굴의 전투판 v7.10.5 자동 판 기록","copyText('굴의 전투판 v7.10.6 자동 판 기록")
open(f,'w').write(s); print('ok')
