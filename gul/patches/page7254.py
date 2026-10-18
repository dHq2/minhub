# v7.25.4 페이지 — page7254.py v1.2 (v1.2: 뒤를 더 어둡게 · 그림 자리를 띠 위로 올리고 넓게 (가로로 긴 그림도 크게) · 휴대폰은 띠 바로 위 · 말하는 쪽이 앞으로 · v1.1: NPC 와 말한 아군은 그 대화가 끝날 때까지 왼쪽에 남음 · 대화 화면 드라마틱하게: 양 끝에 큰 그림 — 왼쪽 = 우리 (인주 · NPC 와 말하는 아군) · 오른쪽 = 말하는 NPC 또는 아군 /
#   말하는 쪽은 밝게 · 듣는 쪽은 어둡게 · 새로 나오면 미끄러져 들어옴 / 가로 띠 (반투명) · 이름표는 말하는 쪽 · ▼ SPACE (휴대폰 ▼ 탭) / 대화 그림 등록표 (TALK_ART) —
#   배경 투명 그림 · 없으면 얼굴 / 오딜 5 · 모닝스타 3 · 레베카 · 탕아 투명본 (talkcut.py — 흰 배경만 지운 임시본))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7253.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.25.3 (2026-10-18)', '<!-- 굴의 전투판 v7.25.4 (2026-10-18)')
rep('     v7.25.3: ', '''     v7.25.4: 대화 화면 — 양 끝에 큰 그림: 왼쪽 = 우리 (인주 · NPC 와 말하는 아군) · 오른쪽 = 말하는 NPC 또는 아군. 말하는 쪽은 밝게 · 듣는 쪽은 어둡게 ·
         새 인물은 미끄러져 들어옴. 아래 반투명 가로 띠 · 이름표 (말하는 쪽) · ▼ SPACE. 대화 그림 등록표 (도감 번호 → 배경 투명 그림 · 없으면 얼굴) —
         오딜 5 · 모닝스타 3 · 레베카 · 탕아 그림 더함 (흰 배경만 지운 임시본 — 투명본이 오면 바꿔 끼움).
     v7.25.3: ''')
rep('h1::after{content:" v7.25.3"', 'h1::after{content:" v7.25.4"')
rep('<footer>굴의 전투판 v7.25.3', '<footer>굴의 전투판 v7.25.4')
rep('return `굴의 전투판 v7.25.3 · ${title}', 'return `굴의 전투판 v7.25.4 · ${title}')
rep("copyText('굴의 전투판 v7.25.3 자동 판 기록", "copyText('굴의 전투판 v7.25.4 자동 판 기록")
rep('의 버전 기록에 — v7.25.3 공통 전투 · 로딩 · 여정 기록 · 인카운터 목록', '의 버전 기록에 — v7.25.4 대화 화면 (양 끝 큰 그림 · 가로 띠) / v7.25.3 공통 전투 · 로딩 · 여정 기록 · 인카운터 목록')
rep('">v7.25.3 · 공통 전투 · 여정 기록 · 인카운터</span>', '">v7.25.4 · 대화 화면 · 양 끝 그림</span>')
rep("ver: '7.25.3', kind: '1F 여정 기록'", "ver: '7.25.4', kind: '1F 여정 기록'")
rep("o.push('굴의 전투판 v7.25.3 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v7.25.4 — 1F 프롤로그 여정 기록'")

# ---------- 대화 창 CSS ----------
a0 = s.index('/* v7.22 대화 창 */\n'); a1 = s.index('.banner.shop{width:min(560px')
rep(s[a0:a1], r"""/* v7.25.4 대화 — 드라마틱: 양 끝에 큰 그림 (왼쪽 = 우리 · 오른쪽 = 말하는 NPC · 아군) · 반투명 가로 띠 · 이름표 · ▼ SPACE */
.talk{--tkBand:max(168px,27vh);position:fixed;inset:0;z-index:55;background:linear-gradient(to top,rgba(6,5,8,.95) 0%,rgba(6,5,8,.7) 40%,rgba(6,5,8,.52) 100%);overflow:hidden;animation:tkFade .25s ease backwards}
.talk[hidden]{display:none}
.talk .tk-stage{position:absolute;inset:0;pointer-events:none}
.talk .tk-pic{position:absolute;bottom:calc(var(--tkBand) * .4);height:calc(100% - var(--tkBand) * .4 - 18px);width:min(58vw,820px);display:flex;align-items:flex-end;transform-origin:50% 100%;filter:brightness(.4) saturate(.55);transform:scale(.97);transition:filter .25s ease,transform .3s ease,opacity .25s ease}
.talk .tk-l{left:0;justify-content:flex-start}
.talk .tk-r{right:0;justify-content:flex-end}
.talk .tk-pic img{max-width:100%;max-height:100%;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 10px 28px rgba(0,0,0,.7))}
.talk .tk-pic.on{filter:none;transform:none;z-index:1}
.talk.tk-narr .tk-r:not(.none){filter:brightness(.8) saturate(.85);transform:none}
.talk .tk-pic.none{display:none}
.talk .tk-pic.tk-face{width:180px;height:180px;bottom:calc(var(--tkBand) + 16px);border-radius:14px;border:2px solid rgba(217,169,78,.55);box-shadow:0 12px 34px rgba(0,0,0,.6)}
.talk .tk-l.tk-face{left:max(16px,calc(50vw - 600px))} .talk .tk-r.tk-face{right:max(16px,calc(50vw - 600px))}
.talk .tk-pic.tk-face img{display:none}
.talk .tk-r.enter{animation:tkInR .45s cubic-bezier(.2,.8,.2,1) backwards} .talk .tk-l.enter{animation:tkInL .45s cubic-bezier(.2,.8,.2,1) backwards}
.talk .tk-in{position:absolute;left:0;right:0;bottom:0;z-index:1}
.talk .tk-box{position:relative;min-height:var(--tkBand);padding:28px max(22px,calc(50vw - 430px)) calc(32px + env(safe-area-inset-bottom,0px));background:linear-gradient(to bottom,rgba(14,11,16,.5),rgba(14,11,16,.86) 26%,rgba(12,10,14,.94));border-top:1px solid rgba(217,169,78,.42);box-shadow:0 -14px 44px rgba(0,0,0,.4);color:#ece4d6;cursor:pointer;text-align:left;animation:tkUp .35s ease backwards}
.talk .tk-box::before{content:"";position:absolute;left:0;right:0;top:4px;height:1px;background:linear-gradient(90deg,transparent,rgba(217,169,78,.22) 20%,rgba(217,169,78,.22) 80%,transparent)}
.talk .tk-box b{position:absolute;top:-18px;left:max(22px,calc(50vw - 430px));display:inline-block;padding:5px 20px 6px;font:800 16px/1.2 var(--display);letter-spacing:.08em;color:#f5e3b5;background:linear-gradient(90deg,#3b2817,#22160d);border:1px solid #d9a94e;border-radius:2px;box-shadow:0 4px 16px rgba(0,0,0,.55)}
.talk.tk-sp-r .tk-box b{left:auto;right:max(22px,calc(50vw - 430px))}
.talk .tk-box b:empty{display:none}
.talk .tk-box p{margin:4px 0 0;font:500 17px/1.8 var(--body);white-space:pre-wrap;text-shadow:0 1px 3px rgba(0,0,0,.7)}
.talk.tk-narr .tk-box p{font:italic 500 17px/1.8 var(--display);color:#ddd2c0}
.talk .tk-ch{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.talk .tk-ch:empty{display:none}
.talk .tk-ch .btn{min-height:42px;padding:0 16px}
.talk .tk-nx{position:absolute;right:max(22px,calc(50vw - 430px));bottom:calc(10px + env(safe-area-inset-bottom,0px));color:#d9a94e;font:700 11px var(--mono);letter-spacing:.14em;animation:tkb 1.1s infinite}
.talk .tk-nx kbd{display:inline-block;margin-left:4px;padding:1px 6px;border:1px solid rgba(217,169,78,.6);border-radius:3px;font:700 10.5px var(--mono)}
@keyframes tkb{50%{opacity:.25}}
@keyframes tkFade{from{opacity:0}} @keyframes tkUp{from{opacity:0;transform:translateY(24px)}}
@keyframes tkInR{from{opacity:0;transform:translateX(70px)}} @keyframes tkInL{from{opacity:0;transform:translateX(-70px)}}
@media (max-width:640px){.talk{--tkBand:max(200px,33vh)}.talk .tk-pic{bottom:calc(var(--tkBand) - 34px);height:calc(100% - var(--tkBand) + 18px);width:100vw}.talk .tk-l{width:72vw;left:-14vw}.talk .tk-pic.tk-face{width:116px;height:116px}.talk .tk-l.tk-face{left:12px}.talk .tk-r.tk-face{right:12px}
  .talk .tk-box{padding:26px 16px calc(32px + env(safe-area-inset-bottom,0px))}.talk .tk-box b{left:16px}.talk.tk-sp-r .tk-box b{right:16px}.talk .tk-box p,.talk.tk-narr .tk-box p{font-size:15.5px;line-height:1.7}.talk .tk-ch .btn{flex:1 1 40%}.talk .tk-nx{right:16px}}
@media (prefers-reduced-motion:reduce){.talk,.talk *{animation:none!important;transition:none!important}}
/* v7.22.1 사각형 나레이션 · 거래 창 */
.talk.tk-boxed{background:rgba(6,5,8,.8)}
.talk.tk-boxed .tk-pic{opacity:.16}
.talk.tk-boxed .tk-in{top:0;display:flex;align-items:center;justify-content:center}
.talk.tk-boxed .tk-box{width:min(520px,92vw);min-height:0;margin:0 auto;padding:26px 24px;text-align:center;border:2px solid #d9a94e;border-radius:4px;background:rgba(14,11,16,.95)}
.talk.tk-boxed .tk-box b,.talk.tk-boxed .tk-box::before{display:none}
.talk.tk-boxed .tk-box p{font:700 20px/1.5 var(--display);color:#f2e6cf;letter-spacing:.04em}
""")

# ---------- 대화 창 구조: 무대 (양 끝 그림) + 띠 ----------
rep('<div class="talk" id="talk" hidden role="dialog" aria-label="대화"><div class="tk-in"><div class="tk-pic" id="tkPic"><img id="tkImg" alt=""></div><div class="tk-box" id="tkBox"><b id="tkName"></b><p id="tkText"></p><div class="tk-ch" id="tkCh"></div><span class="tk-nx" id="tkNx" hidden>▸</span></div></div></div>',
    '<div class="talk" id="talk" hidden role="dialog" aria-label="대화"><div class="tk-stage"><div class="tk-pic tk-l none" id="tkL"><img id="tkImgL" alt=""></div><div class="tk-pic tk-r none" id="tkPic"><img id="tkImg" alt=""></div></div><div class="tk-in"><div class="tk-box" id="tkBox"><b id="tkName"></b><p id="tkText"></p><div class="tk-ch" id="tkCh"></div><span class="tk-nx" id="tkNx" hidden>▼<kbd>SPACE</kbd></span></div></div></div>')

# ---------- 그림 등록표 · 자리 ----------
t0 = s.index('function talkPic(img, ref){'); t1 = s.index('\n}\n', t0) + 3
rep(s[t0:t1], r"""// v7.25.4 대화 그림 등록표 — 도감 번호 → 대화용 그림 (배경 투명 · art/이름.webp). 줄에 img 가 있으면 그 그림 · 없으면 첫 그림 · 그것도 없으면 얼굴 (도감 얼굴)
//   투명 그림을 새로 받으면 여기 한 줄만 고치면 됨 (인주 C-001 은 아직 없음 → 얼굴)
const TALK_ART = { 'C-106': ['C-106_talk06', 'C-106_talk01', 'C-106_talk02', 'C-106_talk03', 'C-106_talk04', 'C-106_talk05', 'C-106_talk07', 'C-106_talk08', 'C-106_talk09', 'C-106_talk10'],
  'C-221': ['C-221_art'], 'C-033': ['C-033_art'], 'C-036': ['C-036_art'], 'C-158': ['C-158_art'], 'C-027': ['odile_t1', 'odile_t2', 'odile_t3', 'odile_t4', 'odile_t5'], 'C-005': ['mstar_t1', 'mstar_t2', 'mstar_t3'], 'C-002': ['C-002_art'] };
const talkArt = (ref, img) => img || ((TALK_ART[ref] || [])[0]) || null;
function tkSlot(side, ref, img){
  const el = $(side === 'L' ? 'tkL' : 'tkPic'), im = $(side === 'L' ? 'tkImgL' : 'tkImg');
  if (!ref && !img){ el.classList.add('none'); el.dataset.k = ''; el.dataset.ref = ''; return; }
  const k = (ref || '') + '|' + (img || ''); if (el.dataset.k === k && !el.classList.contains('none')) return;
  const fresh = el.classList.contains('none') || el.dataset.ref !== (ref || ''); el.dataset.k = k; el.dataset.ref = ref || ''; el.classList.remove('none', 'tk-face'); el.style.cssText = '';
  if (fresh){ el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter'); }   // 새 인물은 미끄러져 들어옴
  const face = () => { if (faceOf(ref) < 0){ el.classList.add('none'); return; } el.classList.add('tk-face'); im.removeAttribute('src'); el.style.cssText = faceCss(faceOf(ref), MOB ? 116 : 180); };
  if (!img || talkImgBad.has(img)){ face(); return; }
  im.onerror = () => { talkImgBad.add(img); face(); }; im.onload = () => talkImgOk.add(img); im.src = `art/${img}.webp`;
}
""")
rep("  const N = NPC[L.npc || TK.npc] || null, E = L.npc ? null : TK.E, known = !!E && (E.st === 'joined' || E.st === 'foe');\n"
    "  $('talk').classList.toggle('tk-narr', !!L.narr); $('talk').classList.toggle('tk-boxed', !!L.box); $('tkName').textContent = L.narr || L.box ? '' : N ? (known ? N.key : N.who) : '';   // v7.22.1 box = 사각형 나레이션\n"
    "  talkPic(L.box ? null : L.img, L.box || !N ? null : N.ref); $('tkCh').innerHTML = ''; $('tkNx').hidden = true;",
    "  const N = NPC[L.npc || TK.npc] || null, E = L.npc ? null : TK.E, known = !!E && (E.st === 'joined' || E.st === 'foe');\n"
    "  // v7.25.4 누가 어느 쪽: 왼쪽 = 우리 (인주 · NPC 와 말하는 아군) · 오른쪽 = 말하는 NPC (없으면 말하는 아군) · 나레이션은 그림만 · 사각형 나레이션은 흐리게\n"
    "  const hero = (S.units.find(u => u.side === 0 && u.hero) || {}).ref || 'C-001', ally = L.who ? (S.units.find(u => u.ref === L.who) || (designList().find(d => d.ref === L.who) ? { ...designList().find(d => d.ref === L.who), name: designList().find(d => d.ref === L.who).key } : { ref: L.who, name: L.who })) : null;\n"
    "  const nRef = N ? (N.lostNpc ? (E && E.ref) || null : N.ref) : null; let Lr = TK.leftRef || hero, Li = talkArt(Lr), Rr = nRef, Ri = N ? talkArt(nRef, L.img || null) : null, sp = L.narr || L.box ? '' : N ? 'R' : '';\n"
    "  if (ally){ if (N){ Lr = TK.leftRef = ally.ref; Li = talkArt(ally.ref, L.img); sp = 'L'; } else { Rr = ally.ref; Ri = talkArt(ally.ref, L.img); sp = 'R'; } }\n"
    "  else if (!N){ if (L.img){ Rr = null; Ri = L.img; } else if (L.narr || L.box){ Lr = Li = null; } }   // 장면 그림만 · 그림 없는 나레이션은 비움\n"
    "  tkSlot('L', Lr, Li); tkSlot('R', Rr, Ri); $('tkL').classList.toggle('on', sp === 'L'); $('tkPic').classList.toggle('on', sp === 'R'); $('talk').classList.toggle('tk-sp-r', sp === 'R');\n"
    "  $('talk').classList.toggle('tk-narr', !!L.narr); $('talk').classList.toggle('tk-boxed', !!L.box); $('tkName').textContent = L.narr || L.box ? '' : ally ? ally.name : N ? (known ? N.key : N.who) || (E && E.name) || '' : '';   // v7.22.1 box = 사각형 나레이션\n"
    "  $('tkCh').innerHTML = ''; $('tkNx').hidden = true;")
rep("function talkClose(){ if (!TK) return; clearInterval(TK.timer); const pv = TK.prev; TK = null; $('talk').hidden = true;",
    "function talkClose(){ if (!TK) return; clearInterval(TK.timer); const pv = TK.prev; TK = null; $('talk').hidden = true; for (const id of ['tkL', 'tkPic']){ const el = $(id); el.classList.add('none'); el.dataset.k = ''; el.dataset.ref = ''; }   /* v7.25.4 다음엔 다시 미끄러져 들어옴 */")
rep("  Object.assign(TK, { npc: npc || null, E: E || null, lines, i: 0 }); $('talk').hidden = false; talkShow();",
    "  Object.assign(TK, { npc: npc || null, E: E || null, lines, i: 0 }); $('tkNx').innerHTML = MOB ? '▼ 탭' : '▼<kbd>SPACE</kbd>'; $('talk').hidden = false; talkShow();   /* v7.25.4 */")
open(F, 'w', encoding='utf-8').write(s)
print('page7254 OK')
