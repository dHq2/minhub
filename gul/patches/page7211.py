# v7.21.1 페이지 — page7211.py v1.0 (뽑기 연출: 캠페인을 시작하면 '굴에 떨어진 이들' 창 — 확정 셋은 앞면 · 랜덤 둘은 뒷면 카드 (누르면 뒤집힘 · 초상화 · 이름 · 등급 · 직업) → 둘 다 뒤집으면 '1S 로')
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.21.0 (2026-10-18)', '<!-- 굴의 전투판 v7.21.1 (2026-10-18)')
rep('     v7.21.0: ', '''     v7.21.1: 뽑기 연출 — 캠페인을 시작하면 '굴에 떨어진 이들': 확정 카리우스 · 레베카 · 청광묵은 앞면, 랜덤 둘은 뒷면 카드 (누르면 뒤집힘 · 초상화 · 이름 · 등급 · 직업). 둘 다 뒤집으면 1S 로.
     v7.21.0: ''')
rep('h1::after{content:" v7.21.0"', 'h1::after{content:" v7.21.1"')
rep('<footer>굴의 전투판 v7.21.0', '<footer>굴의 전투판 v7.21.1')
rep('return `굴의 전투판 v7.21.0 · ${title}', 'return `굴의 전투판 v7.21.1 · ${title}')
rep("copyText('굴의 전투판 v7.21.0 자동 판 기록", "copyText('굴의 전투판 v7.21.1 자동 판 기록")
rep('의 버전 기록에 — v7.21.0 1F 캠페인 (S 다섯 · 맵 사이 이동)', '의 버전 기록에 — v7.21.1 뽑기 연출 / v7.21.0 1F 캠페인 (S 다섯 · 맵 사이 이동)')
rep('">v7.21.0 · 1F 캠페인</span>', '">v7.21.1 · 1F 캠페인 · 뽑기</span>')

rep('<div class="campbar" id="campBar" hidden></div>', '<div class="campbar" id="campBar" hidden></div><div class="gacha" id="gacha" hidden role="dialog" aria-label="굴에 떨어진 이들"></div>')
# 캠페인 시작: 파티를 정한 뒤 바로 1S 가 아니라 뽑기 창을 거침
rep("  campBuild(1, 'down', party);\n  toast(`1F 캠페인 — 동료 ${party.slice(1).map(u => u.name).join(' · ')} (뽑기: ${pick.join(' · ')}) · 맵 위쪽 끝 = 2S`);",
    "  gachaShow(party, pick);   // v7.21.1 뽑기 연출 → 1S")
rep("function campPlace(m, units, y0, y1, x0, x1){", r"""// v7.21.1 뽑기 연출: 확정 셋은 앞면 · 랜덤 둘은 뒷면 (누르면 뒤집힘) → 둘 다 뒤집으면 1S 로
const TIER_STAR = t => '★'.repeat(Math.max(1, Math.min(7, t || 1)));
function gachaCard(p, fix){ return `<button type="button" class="gcard${fix ? ' fix flip' : ''}" ${fix ? 'tabindex="-1" aria-label="' + esc(p.name) + ' (확정)"' : 'aria-label="뒤집기"'}><span class="in"><span class="b">?</span><span class="f"><i style="${faceCss(faceOf(p.ref), 72)}"></i><b>${esc(p.name)}</b><small>${TIER_STAR(p.tier)} · ${esc(p.cls || '')}${p.role ? ' · ' + esc(p.role) : ''}</small>${fix ? '<em>확정</em>' : ''}</span></span></button>`; }
function gachaShow(party, pick){
  const g = $('gacha'), fixed = party.filter(p => CAMP_FIX.includes(p.name)), rnd = party.filter(p => pick.includes(p.name));
  g.innerHTML = `<h3>굴에 떨어진 이들</h3><p class="gsub">1F 프롤로그 — 인주와 함께 걷게 될 동료. 뒷면 카드를 눌러 뒤집으세요.</p>
    <div class="gcards">${fixed.map(p => gachaCard(p, true)).join('')}</div><div class="gcards rnd">${rnd.map(p => gachaCard(p, false)).join('')}</div>
    <div class="row"><button class="btn" type="button" id="gAll">모두 뒤집기</button><button class="btn go" type="button" id="gGo" disabled>1S 로</button></div>`;
  g.hidden = false;
  const done = () => { const left = g.querySelectorAll('.gcards.rnd .gcard:not(.flip)').length; $('gGo').disabled = left > 0; };
  g.querySelectorAll('.gcards.rnd .gcard').forEach(c => c.onclick = () => { c.classList.add('flip'); done(); });
  $('gAll').onclick = () => { g.querySelectorAll('.gcards.rnd .gcard').forEach(c => c.classList.add('flip')); done(); };
  $('gGo').onclick = () => { g.hidden = true; g.innerHTML = ''; campBuild(1, 'down', party); toast(`1F 캠페인 — 동료 ${party.slice(1).map(u => u.name).join(' · ')} · 맵 위쪽 끝 = 2S`); };
}
function campPlace(m, units, y0, y1, x0, x1){""")
rep("/* v7.21 캠페인 띠 · 끝 화면 */", """/* v7.21.1 뽑기 연출 */
.gacha{position:fixed;inset:0;z-index:60;background:rgba(8,6,10,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px;overflow:auto;color:#ece4d6;text-align:center}
.gacha h3{margin:0;font:800 24px var(--display);color:#d9a94e}
.gacha .gsub{margin:0;font:500 13px var(--body);color:#a39a8c}
.gacha .gcards{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.gcard{width:118px;height:168px;perspective:800px;cursor:pointer;background:none;border:0;padding:0;color:inherit;font:inherit}
.gcard .in{position:relative;display:block;width:100%;height:100%;transition:transform .6s;transform-style:preserve-3d}
.gcard.flip .in{transform:rotateY(180deg)}
.gcard .f,.gcard .b{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:10px;border:1px solid #3a3240;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:6px}
.gcard .b{background:repeating-linear-gradient(45deg,#2a2230 0 8px,#221c27 8px 16px);color:#d9a94e;font:800 44px var(--display)}
.gcard .f{transform:rotateY(180deg);background:#1d1920}
.gcard .f i{display:block;width:72px;height:72px;border-radius:8px;border:1px solid #3a3240}
.gcard .f b{font:700 15px var(--body)}
.gcard .f small{font:500 11px var(--mono);color:#a39a8c}
.gcard .f em{font-style:normal;font:600 10px var(--body);color:#7cc0ff}
.gcard.fix{cursor:default;width:96px;height:140px}
.gcard.fix .f i{width:56px;height:56px}
.gacha .row{display:flex;gap:8px;justify-content:center}
.gacha .btn{min-height:40px}
@media (prefers-reduced-motion: reduce){ .gcard .in{transition:none} }
/* v7.21 캠페인 띠 · 끝 화면 */""")

open(F, 'w', encoding='utf-8').write(s)
print('page7211 OK')
