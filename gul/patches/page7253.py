# v7.25.3 페이지 — page7253.py v1.2 (v1.2: 무리 · 상황은 로그에만 (이야기 칸에 미리 드러나지 않게) · v1.1: 인카운터 표는 줄바꿈 (휴대폰에서 넓어지지 않게) · 공통 전투: 1S · 2S (· 3S 의 싸움) 는 같은 만남 — 들어설 때 무리 · 상황을 뽑음 / 맵을 넘어갈 때 나레이션 · 로딩 /
#   여정 기록: 1S 부터 끝까지 모든 맵을 파일 하나로 (요약 · 사람이 읽는 글 · 원본) · 지난 여정은 새 프롤로그까지 남김 / 인카운터 목록 탭 (훈련장 · 개발 · 정비용 · 바로 해 보기))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7252.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.25.2 (2026-10-18)', '<!-- 굴의 전투판 v7.25.3 (2026-10-18)')
rep('     v7.25.2: ', '''     v7.25.3: 공통 전투 — 1S · 2S (그리고 3S 에서 싸움이 뽑히면) 는 같은 만남: 들어설 때 무리 (적 구성 다섯 가운데 · 2S 는 1S 와 다르게) 와
         상황 (떠도는 망자 · 정면 대치 · 양쪽 협공 · 매복 · 후방 기습 · 행군 중 조우) 을 뽑음. 맵을 넘어갈 때 짧은 나레이션 · 로딩 (누르면 건너뜀).
         여정 기록 — 1S 부터 끝 (계단 · 전멸) 까지 모든 맵을 파일 하나로: 요약 · 사람이 읽는 글 (맵마다 동료 · 만남 · 대화 · 이야기 · 자세한 기록 · 결과 ·
         성장 · 전리품) · 원본 사건. 이 브라우저에 저장 + 메모리 사본 · 지난 여정은 새 프롤로그를 시작할 때까지 남음 (이야기 탭에서 받기).
         인카운터 목록 탭 (훈련장) — 모든 만남을 갈래 · 나오는 곳 · 확률 · 대화 마디 · 결말로 · 바로 해 보기.
     v7.25.2: ''')
rep('h1::after{content:" v7.25.2"', 'h1::after{content:" v7.25.3"')
rep('<footer>굴의 전투판 v7.25.2', '<footer>굴의 전투판 v7.25.3')
rep('return `굴의 전투판 v7.25.2 · ${title}', 'return `굴의 전투판 v7.25.3 · ${title}')
rep("copyText('굴의 전투판 v7.25.2 자동 판 기록", "copyText('굴의 전투판 v7.25.3 자동 판 기록")
rep('의 버전 기록에 — v7.25.2 정산 화면 · 전리품 · 장비', '의 버전 기록에 — v7.25.3 공통 전투 · 로딩 · 여정 기록 · 인카운터 목록 / v7.25.2 정산 화면 · 전리품 · 장비')
rep('">v7.25.2 · 정산 · 전리품 · 장비</span>', '">v7.25.3 · 공통 전투 · 여정 기록 · 인카운터</span>')

# ---------- CSS ----------
rep("/* v7.25.2 정산 · 전리품 카드 */\n", """/* v7.25.3 맵을 넘어갈 때 — 나레이션 · 로딩 */
.ldfx{position:fixed;inset:0;z-index:66;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:24px 18px;text-align:center;cursor:pointer;color:#ece4d6;
  background:radial-gradient(ellipse at 50% 60%,#1d1611 0%,#0b0909 58%,#050405 100%);opacity:0;transition:opacity .4s ease;overflow:hidden}
.ldfx.on{opacity:1} .ldfx.out{opacity:0;pointer-events:none}
.ldfx.sand{background:radial-gradient(ellipse at 50% 35%,#efe6cf 0%,#a89676 34%,#2c241b 72%,#0b0909 100%)}
.ldfx.lite{background:radial-gradient(ellipse at 50% 18%,#fffaf0 0%,#f3dca0 22%,#9b7a3f 52%,#241b12 82%,#0b0909 100%)}
.ldfx .lf{font:600 12px var(--mono);letter-spacing:.38em;color:#9a8c78;animation:ldIn .9s ease both}
.ldfx .ls{font:800 clamp(46px,13vw,92px)/1 var(--display);color:#d9a94e;letter-spacing:.04em;text-shadow:0 0 30px rgba(217,169,78,.38);animation:ldIn 1s .1s ease both}
.ldfx .lk{font:600 14px var(--body);color:#d6cbb8;animation:ldIn 1s .3s ease both}
.ldfx .ln{max-width:min(540px,92vw);margin:10px 0 0;font:italic 500 15.5px/1.75 var(--display);color:#efe4d0;animation:ldIn 1.1s .55s ease both}
.ldfx .ln + .ln{margin-top:0;animation-delay:1.15s}
.ldfx .lb{width:min(260px,62vw);height:2px;margin-top:18px;background:rgba(217,169,78,.16);border-radius:2px;overflow:hidden}
.ldfx .lb i{display:block;height:100%;width:0;background:linear-gradient(90deg,rgba(217,169,78,.1),#e6b85a);animation:ldBar var(--ldMs,2600ms) linear forwards}
.ldfx .lh{margin-top:4px;font:500 11px var(--body);color:#7d7262;animation:ldIn .8s 1.4s ease both}
.ldfx.sand .lf,.ldfx.lite .lf{color:#5b4c37} .ldfx.sand .lk,.ldfx.lite .lk{color:#3b2f22} .ldfx.sand .ln,.ldfx.lite .ln{color:#2a2118} .ldfx.lite .ls{color:#8a5d14;text-shadow:0 0 34px rgba(255,236,190,.9)} .ldfx.sand .ls{color:#7a5a24}
.ldfx .le{position:absolute;bottom:18%;width:5px;height:5px;border-radius:50%;background:#f0a64a;box-shadow:0 0 10px 2px rgba(240,166,74,.7);opacity:0;animation:ldEm 3.2s ease-in infinite}
.ldfx.lite .le{background:#fff6dc;box-shadow:0 0 12px 3px rgba(255,240,200,.9);bottom:auto;top:-4%;animation-name:ldMote}
@keyframes ldIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes ldBar{to{width:100%}}
@keyframes ldEm{0%{opacity:0;transform:translate(0,0)}15%{opacity:.95}100%{opacity:0;transform:translate(var(--dx,12px),-190px)}}
@keyframes ldMote{0%{opacity:0;transform:translate(0,0)}20%{opacity:.9}100%{opacity:0;transform:translate(var(--dx,12px),62vh)}}
@media (prefers-reduced-motion:reduce){.ldfx *{animation:none!important}.ldfx .lb i{width:100%}}
/* v7.25.3 인카운터 목록 */
.encT td,.encT th{vertical-align:top;white-space:normal} .encT tbody th{white-space:nowrap;width:1%;padding-right:10px}
.eb{display:inline-block;padding:0 7px;border-radius:999px;font:700 11px/1.7 var(--body);border:1px solid currentColor;white-space:nowrap}
.eb.b-com{color:var(--heal)} .eb.b-rnd{color:var(--accent)} .eb.b-fix{color:var(--ally)} .eb.b-ev{color:var(--foe)} .eb.b-plan{color:var(--dim)}
.ef{display:inline-flex;align-items:center;gap:4px;margin:1px 8px 1px 0;font:500 12px var(--body);white-space:nowrap} .ef i{display:inline-block;width:22px;height:22px;border-radius:5px;flex:none;background-color:var(--well)}
.etk{font:500 12px/1.55 var(--body);margin:3px 0} .etk b{font:600 11px var(--mono);color:var(--dim);margin-right:4px}
.encD .lab .eb{margin-left:6px} .encD .row{flex-wrap:wrap;gap:6px} .encD select{min-height:32px}
.encD ul{margin:4px 0;padding-left:18px;font-size:12.5px} .encD li{margin:1px 0}
/* v7.25.2 정산 · 전리품 카드 */
""")

# ---------- 판 위 덮개 · 탭 ----------
rep('<div class="gacha" id="gacha" hidden role="dialog" aria-label="굴에 떨어진 이들"></div>',
    '<div class="gacha" id="gacha" hidden role="dialog" aria-label="굴에 떨어진 이들"></div><div class="ldfx" id="ldFx" hidden role="status" aria-live="polite"></div>')
rep('        <button class="tab" type="button" data-tab="traits" role="tab">특성</button>\n',
    '        <button class="tab" type="button" data-tab="traits" role="tab">특성</button>\n        <button class="tab trainOnly" type="button" data-tab="enc" role="tab">인카운터</button>\n')
rep('      <div class="pane" id="pane-traits" hidden>\n',
    '      <div class="pane encD" id="pane-enc" hidden></div>\n      <div class="pane" id="pane-traits" hidden>\n')
rep("for (const p of ['story', 'fight', 'place', 'rules', 'traits', 'log']) $('pane-' + p).hidden = p !== k; if (k === 'traits') renderTraitsTab();",
    "for (const p of ['story', 'fight', 'place', 'rules', 'traits', 'enc', 'log']) $('pane-' + p).hidden = p !== k; if (k === 'traits') renderTraitsTab(); if (k === 'enc') renderEncTab();   /* v7.25.3 인카운터 목록 */")

# ---------- 공통 전투 ----------
rep("""  { name: '1S', kind: '고정 전투', note: '어둠 속 개활지 — 떠도는 기사들', foes: [['검방패기사', 2], ['창병', 2], ['궁수', 1]] },
  { name: '2S', kind: '고정 전투', note: '언덕과 무더기 — 똥개 무리와 검기사', foes: [['C-076', 4], ['검기사', 1], ['궁수', 1]] },
  { name: '3S', kind: '랜덤 인카운터', note: '어떤 만남인지는 들어서야 앎', pick: [['똥개 무리', [['C-076', 6]]], ['똥개와 기사', [['C-076', 3], ['검방패기사', 1], ['창병', 1]]], ['기사들', [['검방패기사', 1], ['검기사', 1], ['창병', 1], ['궁수', 1]]]] },""",
"""  { name: '1S', kind: '공통 전투', note: '어둠 속 개활지 — 무엇과 어떻게 마주칠지는 들어서야 앎', btl: true },   /* v7.25.3 공통 전투 (BTL_COMP · BTL_SIT) */
  { name: '2S', kind: '공통 전투', note: '언덕과 무더기 — 무엇과 어떻게 마주칠지는 들어서야 앎', btl: true },
  { name: '3S', kind: '랜덤 인카운터', note: '어떤 만남인지는 들어서야 앎' },""")
rep("const CAMP_FIX = ['카리우스', '레베카', '청광묵'], CAMP_NO = ['인주', '탕아'];", """// v7.25.3 공통 전투 — 1S · 2S (그리고 3S 에서 싸움이 뽑히면) 는 같은 만남: 처음 들어설 때 무리 (적 구성) 하나 · 상황 (적의 시작) 하나를 뽑음 · 2S 는 바로 앞 싸움과 다른 무리
const BTL_COMP = [
  { k: 'c0', name: '떠도는 기사들', foes: [['검방패기사', 2], ['창병', 2], ['궁수', 1]], w: 1, note: '방패 둘이 앞을 막고 창 둘 · 활 하나가 뒤에서' },
  { k: 'c1', name: '똥개 무리와 검기사', foes: [['C-076', 4], ['검기사', 1], ['궁수', 1]], w: 1, note: '빠른 똥개 넷이 먼저 덮치고 검기사 · 궁수가 뒤따름' },
  { k: 'c2', name: '똥개 무리', foes: [['C-076', 6]], w: 0.8, note: '여섯 마리가 떼로 — 흩어진 이를 하나씩 물어뜯음' },
  { k: 'c3', name: '똥개와 기사', foes: [['C-076', 3], ['검방패기사', 1], ['창병', 1]], w: 0.9, note: '방패 · 창 둘에 똥개 셋' },
  { k: 'c4', name: '기사들', foes: [['검방패기사', 1], ['검기사', 1], ['창병', 1], ['궁수', 1]], w: 0.9, note: '고루 갖춘 기사 넷' }];
const BTL_SIT = [
  { k: 'roam', name: '떠도는 망자', w: 2, note: '흩어져 저마다 떠돎 — 서로 모르는 채 시작 · 마주치면 뭉침 · 먼저 본 쪽이 소리쳐 경보', narr: '어둠 어딘가에서 발소리가 흩어졌다 모인다.' },
  { k: 'front', name: '정면 대치', w: 1, note: '한 덩어리로 앞 (7.5칸) 에 마주 섬', narr: '앞쪽 어둠이 유난히 두텁다. 무언가 줄지어 서 있다.' },
  { k: 'pincer', name: '양쪽 협공', w: 0.8, note: '두 무리로 갈라져 양옆 앞에서', narr: '양쪽에서 쇠붙이 스치는 소리가 난다.' },
  { k: 'ambush', name: '매복', w: 0.8, note: '양옆 어둠 속에 숨어 기다림 (은신) — 다가가면 덮침', narr: '…너무 조용하다.' },
  { k: 'rear', name: '후방 기습', w: 0.6, note: '본대는 앞 · 빠른 둘은 지나온 길 쪽에서', narr: '지나온 길 쪽에서 무언가 따라붙는 기척이 있다.' },
  { k: 'column', name: '행군 중 조우', w: 0.8, note: '길게 늘어선 채 옆에서 마주침', narr: '길 저편에서 줄지은 그림자가 걸어온다.' }];
const BTL_DEF = { 1: { c: 'c0', s: 'roam' }, 2: { c: 'c1', s: 'roam' }, 3: { c: 'c4', s: 'roam' } };   // 자동 시험 (webdriver) 의 기본 — 예전 1S · 2S 그대로
const wPick = (L, avoid) => { const P = L.filter(x => x.w > 0 && x.k !== avoid); let r = Math.random() * P.reduce((a, x) => a + x.w, 0); for (const x of P){ r -= x.w; if (r <= 0) return x; } return P[0]; };
const btlComp = bt => BTL_COMP.find(x => x.k === (bt && bt.c)) || BTL_COMP[0], btlSit = bt => BTL_SIT.find(x => x.k === (bt && bt.s)) || BTL_SIT[0];
function btlPick(C, s){
  const D = BTL_DEF[s] || BTL_DEF[1], F = C.btForce; if (F){ delete C.btForce; return { c: F.c || wPick(BTL_COMP).k, s: F.s || wPick(BTL_SIT).k }; }   // 인카운터 목록에서 고른 무리 · 상황
  if (navigator.webdriver) return { ...D };
  const prev = Object.values(C.stages || {}).map(q => q.bt && q.bt.c).filter(Boolean).pop();
  return { c: wPick(BTL_COMP, prev).k, s: wPick(BTL_SIT).k };
}
const btlTxt = bt => bt ? `${btlComp(bt).name} · ${btlSit(bt).name}` : '';
const CAMP_FIX = ['카리우스', '레베카', '청광묵'], CAMP_NO = ['인주', '탕아'];""")
rep("  { k: 'f0', name: '똥개 무리', w: 1, fight: 0 }, { k: 'f1', name: '똥개와 기사', w: 1, fight: 1 }, { k: 'f2', name: '기사들', w: 1, fight: 2 },",
    "  { k: 'fight', name: '공통 전투', w: 3, fight: 'btl' },   /* v7.25.3 싸움은 공통 전투 하나 (무리 · 상황은 들어설 때) */\n"
    "  { k: 'f0', name: '똥개 무리', w: 0, fight: 0, comp: 'c2', old: true }, { k: 'f1', name: '똥개와 기사', w: 0, fight: 1, comp: 'c3', old: true }, { k: 'f2', name: '기사들', w: 0, fight: 2, comp: 'c4', old: true },   /* 예전 저장 · 시험용 (뽑히지 않음) */")
rep("L = ENC3.filter(e => e.npc === 'lost' ? (C.lostP || []).length > 0 : !e.npc || !have.has(NPC[e.npc].key));",
    "L = ENC3.filter(e => e.w > 0 && (e.npc === 'lost' ? (C.lostP || []).length > 0 : !e.npc || !have.has(NPC[e.npc].key)));")
rep("  const E3 = s === 3 ? enc3Of(C) : null, NP = E3 && E3.npc ? NPC[E3.npc] : null;\n",
    "  const E3 = s === 3 ? enc3Of(C) : null, NP = E3 && E3.npc ? NPC[E3.npc] : null;\n"
    "  const bt = !def.ruin && !def.hall && (!E3 || E3.fight != null) ? (st.bt || (st.seen ? null : (st.bt = E3 && E3.comp ? { c: E3.comp, s: 'roam' } : btlPick(C, s)))) : null;   /* v7.25.3 공통 전투: 무리 · 상황 */\n")
rep(": HL ? [] : (E3 ? (E3.fight != null ? def.pick[E3.fight][1] : []) : def.foes).flatMap(", ": HL ? [] : (bt ? btlComp(bt).foes : []).flatMap(")
rep("  S.units = [...party, ...foes]; rebuildMap();\n  const m = buildMap(S), up = from === 'up';",
    "  S.startK = bt && !st.seen ? bt.s : null;   /* v7.25.3 적의 시작 (엔진 startScenario · patrolStart) */\n  S.units = [...party, ...foes]; rebuildMap();\n  const m = buildMap(S), up = from === 'up';")
rep("  logEv(world, { k: 'campIn', s, name: def.name, kind: def.kind + (E3 ? ' — ' + E3.name : ''), from, back: !!st.seen });",
    "  logEv(world, { k: 'campIn', s, name: def.name, kind: def.kind + (E3 ? ' — ' + E3.name : ''), bt: bt ? btlTxt(bt) : null, from, back: !!st.seen });   /* v7.25.3 무리 · 상황은 로그에만 */\n"
    "  jrIn(C, s, from, st, E3, bt);   /* v7.25.3 여정 기록 */")
rep("setTimeout(() => talkLines([{ narr: f.t, img: f.img }, ...RN]), 350); } else if (RN.length) setTimeout(() => talkLines(RN), 350);",
    "ldAfter(() => talkLines([{ narr: f.t, img: f.img }, ...RN])); } else if (RN.length) ldAfter(() => talkLines(RN));   /* v7.25.3 로딩이 걷힌 뒤 */")
rep("  if (!st.seen) toast(`1F · ${def.name} ${def.kind}${E3 ? ' — ' + E3.name : ''} · ${def.note}`); else toast(`1F · ${def.name} 로 돌아옴 — 남긴 적 ${foes.length}`);",
    "  { const tt = !st.seen ? `1F · ${def.name} ${def.kind}${E3 ? ' — ' + E3.name : ''} · ${def.note}` : `1F · ${def.name} 로 돌아옴 — 남긴 적 ${foes.length}`; ldAfter(() => toast(tt), 0); }")
rep("const BOARD_K = ['type', 'W', 'H', 'mapC', 'randStart', 'seed', 'flips', 'units', 'torches', 'terr', 'tseed', 'piles', 'hills', 'pileOff', 'openers', 'water', 'amb', 'indoor', 'hall', 'zones', 'sandY', 'holdClear'];",
    "const BOARD_K = ['type', 'W', 'H', 'mapC', 'randStart', 'startK', 'seed', 'flips', 'units', 'torches', 'terr', 'tseed', 'piles', 'hills', 'pileOff', 'openers', 'water', 'amb', 'indoor', 'hall', 'zones', 'sandY', 'holdClear'];   /* v7.25.3 startK */")
rep("const boardSet = B => Object.assign(S, { water: [], amb: 0, indoor: false, hall: false,", "const boardSet = B => Object.assign(S, { startK: null, water: [], amb: 0, indoor: false, hall: false,")
rep("S.water = (B && B.water) || []; S.amb = (B && B.amb) || 0; S.indoor = false; S.hall = false;", "S.water = (B && B.water) || []; S.amb = (B && B.amb) || 0; S.indoor = false; S.hall = false; S.startK = null;")

# 정산 · 끝 화면에 무리 · 상황
rep("    b.innerHTML = `<b>${def.name} 정산</b><span>${esc(def.kind || '')} · 넘어간 이 ${rows.filter(r => r.alive).length}${nG ?",
    "    b.innerHTML = `<b>${def.name} 정산</b><span>${esc(stKindTxt(s))} · 넘어간 이 ${rows.filter(r => r.alive).length}${nG ?")
rep("function campResult(rows, s, btn, go, party){\n",
    "const stKindTxt = s => { const C = S.camp || {}, def = CAMP_S[s] || {}, st = (C.stages || {})[s] || {}; return (def.kind || '') + (s === 3 ? ' — ' + enc3Of(C).name : '') + (st.bt ? ' — ' + btlTxt(st.bt) : ''); };   /* v7.25.3 */\n"
    "function campResult(rows, s, btn, go, party){\n")
rep("    b.hidden = false; $('campNext').onclick = () => { b.hidden = true; lootPL = null; crCtx = null; invPick = null; go(); }; return; }",
    "    b.hidden = false; $('campNext').onclick = () => { jrLoot(W, s); b.hidden = true; lootPL = null; crCtx = null; invPick = null; go(); }; return; }   /* v7.25.3 여정 기록에 전리품 */")
rep("  if (C.kh && (st[C.kh] || {}).khDone) rows.push(",
    "  { const B = ss.filter(k => st[k] && st[k].bt).map(k => `${CAMP_S[k].name} ${btlTxt(st[k].bt)}`); if (B.length) rows.push(['전투', esc(B.join(' · '))]); }   /* v7.25.3 공통 전투의 무리 · 상황 */\n"
    "  if (C.kh && (st[C.kh] || {}).khDone) rows.push(")

# ---------- 맵을 넘어갈 때: 나레이션 · 로딩 ----------
rep("  $('gGo').onclick = () => { g.hidden = true; g.innerHTML = ''; campBuild(1, 'down', party); toast(`1F 캠페인 — 동료 ${party.slice(1).map(u => u.name).join(' · ')} · 맵 위쪽 끝 = 2S`); };",
    "  $('gGo').onclick = () => { g.hidden = true; g.innerHTML = ''; campGo(1, 'down', party); ldAfter(() => toast(`1F 캠페인 — 동료 ${party.slice(1).map(u => u.name).join(' · ')} · 맵 위쪽 끝 = 2S`), 0); };   /* v7.25.3 로딩 */")
rep("  campResult(rows, s, (CAMP_S[Math.max(1, ns)] || {}).name + ' 로', () => { C.s = Math.max(1, ns); campBuild(C.s, dir === 'up' ? 'down' : 'up', party); }, party);",
    "  campResult(rows, s, (CAMP_S[Math.max(1, ns)] || {}).name + ' 로', () => { C.s = Math.max(1, ns); campGo(C.s, dir === 'up' ? 'down' : 'up', party); }, party);   /* v7.25.3 로딩 */")
rep("function campBuild(s, from, party){\n", r"""// v7.25.3 맵을 넘어갈 때: 덮개를 먼저 펴고 그 아래에서 판을 바로 만듦 → 짧은 나레이션 · 로딩 → 걷힘 (누르면 건너뜀). 맵에 들어선 뒤의 나레이션 · 알림은 걷힌 다음
const LOAD_FX = { on: !navigator.webdriver, ms: 2600, min: 450 };   // 자동 시험은 끔 (시험이 켤 수 있음)
let LD = null;
const LD_NARR = {
  1: ['횃불 하나에 의지해 어둠 속으로 들어선다.', '굴의 바닥은 차갑고, 공기는 오래 고여 있다.'],
  2: ['위로 난 길을 따라 걷는다. 발소리가 어둠에 먹힌다.', '흙이 솟고 무너진 자리마다 그림자가 고인다.'],
  3: ['길이 갈라진다. 이번엔 무엇과 마주칠까.', '어둠 저편에서 무언가 움직인다 — 혹은 기다린다.'],
  4: ['발밑의 모래가 하얗게 빛나기 시작한다.', '사막이 끝나는 곳, 무너진 담 너머로 유적이 보인다.'],
  5: ['유적 가장 깊은 곳의 문이 열린다.', '빛이 쏟아져 내린다.'],
  down: ['왔던 길을 되짚어 내려간다.', '등 뒤의 어둠이 다시 앞이 된다.'], again: ['다시 그 길이다. 남겨 둔 것들이 그대로 있다.'] };
const LD_ENC = { chin: '어디선가 물 흐르는 소리가 난다.', tang: '멀리, 아주 작은 불빛 하나.', shop: '바퀴가 삐걱이는 소리 — 그리고 등불.', hora: '앞쪽 어딘가가 무대처럼 환하다.', lost: '누군가의 발자국이 뒤따라온다.' };
const ldPick = L => L[Math.floor(Math.random() * L.length)];
function ldAfter(fn, ms){ if (LD) LD.q.push(fn); else setTimeout(fn, ms == null ? 350 : ms); }
function campGo(s, from, party){ const fx = LOAD_FX.on; if (fx) LD = { q: [], t0: performance.now() }; campBuild(s, from, party); if (fx) ldShow(s, from); }
function ldShow(s, from){
  const el = $('ldFx'), C = S.camp; if (!el || !LD || !C) { ldEnd(true); return; }
  const st = (C.stages || {})[s] || {}, def = CAMP_S[s] || {}, J = (C.jr || {}).visits || [], back = J.filter(v => v.s === s).length > 1;
  const L = back ? [from === 'up' ? ldPick(LD_NARR.down) : LD_NARR.again[0]] : s === 5 ? LD_NARR[5].slice() : s === 4 ? LD_NARR[4].slice() : [ldPick(LD_NARR[s] || LD_NARR[3])];
  if (!back){ const E3 = s === 3 ? enc3Of(C) : null; if (st.bt) L.push(btlSit(st.bt).narr); else if (E3 && LD_ENC[E3.k]) L.push(LD_ENC[E3.k]); }
  const ms = LOAD_FX.ms + (L.length > 1 ? 700 : 0); LD.ms = ms;
  el.className = 'ldfx' + (s === 5 ? ' lite' : s === 4 ? ' sand' : ''); el.style.setProperty('--ldMs', ms + 'ms');
  el.innerHTML = `<div class="lf">1F · 프롤로그</div><div class="ls">${esc(def.name || s + 'S')}</div><div class="lk">${esc(back ? '다시 들어섬' : def.kind || '')}</div>${L.map(t => `<p class="ln">${esc(t)}</p>`).join('')}<div class="lb"><i></i></div><div class="lh">누르면 건너뜀</div>`
    + Array.from({ length: 7 }, (_, k) => `<span class="le" style="left:${8 + k * 13 + Math.round(Math.random() * 6)}%;animation-delay:${(k * 0.43).toFixed(2)}s;--dx:${Math.round(Math.random() * 40 - 20)}px"></span>`).join('');
  el.hidden = false; requestAnimationFrame(() => el.classList.add('on'));
  logEv(world, { k: 'campLoad', s, lines: L });
  LD.tm = setTimeout(() => ldEnd(), ms);
}
function ldEnd(now){
  if (!LD) return; const el = $('ldFx'), q = LD.q; clearTimeout(LD.tm); LD = null;
  if (el){ el.classList.add('out'); setTimeout(() => { if (!LD){ el.hidden = true; el.className = 'ldfx'; el.innerHTML = ''; } }, now ? 0 : 420); }
  q.forEach((fn, k) => setTimeout(fn, now ? 0 : 260 + k * 30));
}
const ldSkip = () => { if (LD && performance.now() - LD.t0 >= LOAD_FX.min) ldEnd(); };
$('ldFx').addEventListener('click', ldSkip);
function campBuild(s, from, party){
""")
rep("  if (TK){ if (k === ' ' || (k === 'enter' && !e.target.closest('button'))){ e.preventDefault(); talkAdv(); } return; }   // v7.22 대화 창",
    "  if (LD){ if (k === ' ' || k === 'enter' || k === 'escape'){ e.preventDefault(); ldSkip(); } return; }   /* v7.25.3 로딩 중 — 건너뛰기만 */\n"
    "  if (TK){ if (k === ' ' || (k === 'enter' && !e.target.closest('button'))){ e.preventDefault(); talkAdv(); } return; }   // v7.22 대화 창")

# ---------- 프롤로그 시작 · 끝 ----------
rep("function campStart(){\n  if (mode !== 'edit'){", "function campStart(opt){   /* v7.25.3 opt.direct: 뽑기 연출 없이 일행을 돌려줌 (인카운터 시험) */\n  if (mode !== 'edit'){")
rep("  S.camp = { v: 1, s: 1, pick, lost: [], fallen: [], stages: {}, t0: Date.now(), n3: Math.floor(Math.random() * 3), log: [] }; S.openers = [];\n  gachaShow(party, pick);   // v7.21.1 뽑기 연출 → 1S",
    "  S.camp = { v: 1, s: 1, pick, lost: [], fallen: [], stages: {}, t0: Date.now(), n3: Math.floor(Math.random() * 3), log: [], jr: { v: 1, visits: [], party0: party.map(p => p.name) } }; S.openers = []; delete S.jrLast;   /* v7.25.3 여정 기록 · 지난 여정은 이제 지움 */\n"
    "  if (opt && opt.direct){ sHomeRender(); return party; }\n"
    "  gachaShow(party, pick);   // v7.21.1 뽑기 연출 → 1S")
rep("function campEnd(kind){\n  const C = S.camp; C.end = kind; C.t1 = Date.now();",
    "function campEnd(kind){\n  const C = S.camp; C.end = kind; C.t1 = Date.now(); if (C.jr){ C.jr.end = kind; C.jr.t1 = C.t1; }   /* v7.25.3 */")
rep("  clogClear();   // v7.21.3\n",
    "  if (S.camp && S.camp.jr && (S.camp.jr.visits || []).length){ const C = S.camp; S.jrLast = { jr: clone(C.jr), camp: { s: C.s, end: C.end || null, pick: C.pick, fallen: C.fallen, lost: C.lost, log: C.log, t0: C.t0, t1: C.t1 || Date.now() } }; }   /* v7.25.3 지난 여정 — 로그와 함께 새 프롤로그까지 남김 */\n")
rep("const clogGet = () => { try { const L = JSON.parse(localStorage.getItem(CLOG_LS) || '[]'); return Array.isArray(L) ? L : []; } catch (e) { return []; } };\nconst clogClear = () => { try { localStorage.removeItem(CLOG_LS); } catch (e) {} };",
    "let clogMem = [];   // v7.25.3 메모리 사본 (저장이 막힌 곳에서도 이 판 동안은)\n"
    "const clogGet = () => { let L = null; try { L = JSON.parse(localStorage.getItem(CLOG_LS) || 'null'); } catch (e) {} return Array.isArray(L) && L.length >= clogMem.length ? L : clogMem.slice(); };\n"
    "const clogClear = () => { clogMem = []; try { localStorage.removeItem(CLOG_LS); } catch (e) {} };")

# ---------- 여정 기록 ----------
old_save = s[s.index("function campLogSave(W, s){"):s.index("// v7.21.4 받기는 보는 곳의 downloads 기능으로만")]
rep(old_save, r"""// v7.25.3 여정 기록 — 1S 부터 끝 (계단 · 전멸) 까지 모든 맵: 들어선 때 · 동료 (피 · 무기 · 가방) · 적 · 만남 · 상황 · 대화 (고른 것까지) · 걸린 시간 · 결과 · 처치 · 나간 동료 · 성장 · 전리품
//   맵마다 무거운 것 (원본 사건 z · 이야기와 자세한 기록 zt) 은 gzip 으로 이 브라우저에 + 메모리 사본 · 가벼운 줄거리는 캠페인 (C.jr) 에 · 받으면 파일 하나 (요약 · 사람이 읽는 글 · 맵마다 원본)
const jrP = p => ({ name: p.name, ref: p.ref || null, hp: p.hpNow != null ? p.hpNow : null, w: p.wName || p.weapon || null, sh: p.shield ? (p.sName || '방패') : null, gear: Object.values(p.gear || {}).filter(Boolean).map(g => g.name + (g.dur != null ? ' ' + Math.round(g.dur) : '')), bag: (p.bag || []).map(x => x.k === 'ammo' ? `${x.at} ${x.n}` : (x.label || x.name)), tr: (p.traits || []).slice() });
const jrCur = () => { const J = S.camp && S.camp.jr; return J && J.cur != null ? J.visits[J.cur] : null; };
function jrIn(C, s, from, st, E3, bt){
  const J = C.jr || (C.jr = { v: 1, visits: [] }), def = CAMP_S[s] || {}, E = st.enc;
  const fo = {}; for (const u of S.units) if (u.side === 1) fo[u.name.replace(/\s*\d+$/, '')] = (fo[u.name.replace(/\s*\d+$/, '')] || 0) + 1;
  const v = { n: J.visits.length + 1, s, name: def.name, kind: def.kind, at: Date.now(), from, back: J.visits.some(q => q.s === s), enc: E3 ? E3.name : null, npc: E && E.name ? E.name : null, btl: bt ? { c: bt.c, s: bt.s, comp: btlComp(bt).name, sit: btlSit(bt).name } : null,
    foes: Object.entries(fo).map(([k, n]) => n > 1 ? `${k} ×${n}` : k), in: S.units.filter(u => u.side === 0).map(jrP), talk: [] };
  J.visits.push(v); J.cur = J.visits.length - 1;
}
function jrTalk(o){ const v = jrCur(); if (!v || v.t != null) return; (v.talk = v.talk || []).push({ at: world ? +world.t.toFixed(1) : null, ...o }); if (v.talk.length > 300) v.talk.shift(); }
function jrStory(Wd){   /* 이야기 칸과 같은 글 (그때 몰랐던 일은 빼고) */
  const out = ['횃불 하나에 의지해 어둠 속으로 들어선다.']; if (Wd.start && Wd.start.k === 'roam') out.push('이 어둠 어딘가를 망자들이 떠돈다 — 지치지도, 잠들지도 않는다.');
  let lastTn = false; for (const e of Wd.log || []){ if (e.unk) continue; let l = null; try { l = narrOf(Wd, e); } catch (x) {} if (!l) continue; const t = typeof l === 'string' ? l : l.s; if (!t) continue; const tn = l.c === 'tn'; if (tn && lastTn) out[out.length - 1] = t; else out.push(t); lastTn = tn; }
  if (Wd.over){ out.push(Wd.result === 'win' ? '마지막 적이 쓰러지고, 횃불 소리만 남는다.' : Wd.result === 'lose' ? '횃불이 바닥에 떨어져 꺼져 간다…' : '— 맵을 떠남 —'); try { const ch = chronicle(Wd); if (ch.length) out.push('— 전투 일지 —', ...ch); } catch (x) {} }
  return out;
}
function jrOut(W, s){
  const C = S.camp; if (!C) return null; const J = C.jr || (C.jr = { v: 1, visits: [] }); let v = jrCur();
  if (!v || v.t != null || v.s !== s){ v = { n: J.visits.length + 1, s, name: (CAMP_S[s] || {}).name, kind: (CAMP_S[s] || {}).kind, at: Date.now(), stub: true, talk: [] }; J.visits.push(v); J.cur = J.visits.length - 1; }   // 들어선 기록이 없으면 (시험 · 예전 저장)
  v.t = +W.t.toFixed(1); v.res = W.result; v.kills = (W.kills || [0])[0]; v.cleared = !!W.cleared; v.foesLeft = W.units.filter(u => u.side === 1 && u.alive).length;
  v.out = W.units.filter(u => u.side === 0).map(u => ({ name: u.name, hp: Math.max(0, Math.round(u.hp)), how: u.gone === 'up' ? '위로' : u.gone === 'down' ? '아래로' : u.gone === 'left' ? '버림' : u.alive ? '남음' : '쓰러짐' }));
  return v;
}
const jrGrow = rows => { const v = jrCur(); if (v) v.grow = rows.filter(r => r.grow && r.grow.length).map(r => `${r.name} — ${r.grow.join(' · ')}`); };
function jrLoot(W, s){ const J = S.camp && S.camp.jr; if (!J || !W) return; const v = [...J.visits].reverse().find(q => q.s === s && q.t != null); if (v) v.loot = lootOf(W).filter(x => x.taken).map(x => `${itName(x)}${x.k === 'ammo' && x.n0 ? ' ' + x.n0 : ''} → ${x.taken}`); save(); }
function campLogSave(W, s){
  const v = jrOut(W, s), raw = JSON.stringify(W.log || []), meta = { s, vn: v ? v.n : null, t: +W.t.toFixed(1), res: W.result, n: (W.log || []).length, raw: raw.length, at: Date.now() };
  let txt = ''; try { txt = JSON.stringify({ text: logLines(W), story: jrStory(W) }); } catch (e) {}
  clogBusy = clogBusy.then(() => Promise.all([gzB64(raw), txt ? gzB64(txt) : null])).then(([z, zt]) => { const it = { ...meta, z: z || null, j: z ? null : raw.slice(0, 200000), zt: zt || null, jt: zt ? null : txt.slice(0, 200000) };
    clogMem.push(it); const L = clogGet(); if (L !== clogMem && !L.some(x => x.at === it.at && x.s === it.s)) L.push(it); let tot = 0;
    for (let i = L.length - 1; i >= 0; i--){ tot += (L[i].z || L[i].j || '').length + (L[i].zt || L[i].jt || '').length; if (tot > 3.4e6){ L.splice(0, i + 1); break; } }
    try { localStorage.setItem(CLOG_LS, JSON.stringify(L)); } catch (e) {} }).catch(() => {});
  return clogBusy;
}
// 사람이 읽는 여정 (맵마다: 머리 · 적 · 들어선 동료 · 대화 · 이야기 · 자세한 기록 · 결과 · 나간 동료 · 성장 · 전리품)
const jrTime = t => t ? new Date(t).toLocaleString('ko-KR', { hour12: false }) : '—';
const jrMmss = t => t >= 60 ? `${Math.floor(t / 60)}분 ${Math.round(t % 60)}초` : `${Math.round(t || 0)}초`;
const JR_RES = { exit: '넘어감', win: '모두 쓰러뜨림', lose: '전멸', time: '시간 끝', war: '확정 패배' };
const JR_END = { clear: '계단 — 1F 프롤로그 끝', wipe: '전멸' };
function jrSummary(C, J, M){
  const done = M.filter(m => !m.live), kills = done.reduce((a, m) => a + (m.kills || 0), 0), tsum = done.reduce((a, m) => a + (m.t || 0), 0), last = M[M.length - 1] || {};
  return { start: C.t0 ? new Date(C.t0).toISOString() : null, end: C.t1 ? new Date(C.t1).toISOString() : null, mins: C.t0 ? Math.round(((C.t1 || Date.now()) - C.t0) / 60000) : null,
    result: C.end ? JR_END[C.end] || C.end : `진행 중 — ${(CAMP_S[Math.min(5, C.s || 1)] || {}).name || ''}`, why: C.why || null, route: M.map(m => m.name || (m.s + 'S')), maps: M.length, time: +tsum.toFixed(1), kills,
    party0: (J && J.party0) || null, pick: C.pick || null, partyEnd: (last.out || []).filter(o => o.how === '위로' || o.how === '아래로' || o.how === '남음').map(o => o.name), fallen: C.fallen || [], lost: C.lost || [] };
}
function jrText(C, J, M){
  const Su = jrSummary(C, J, M), o = [], P = p => `${p.name}${p.hp != null ? ' 피 ' + p.hp : ''}${p.w ? ' · ' + p.w : ''}${p.sh ? ' · ' + p.sh : ''}${(p.gear || []).length ? ' · ' + p.gear.join(' · ') : ''}${(p.bag || []).length ? ' · 가방 [' + p.bag.join(', ') + ']' : ''}`;
  o.push('굴의 전투판 v7.25.3 — 1F 프롤로그 여정 기록', `기록한 때: ${jrTime(Date.now())}`, `시작: ${jrTime(C.t0)} · 끝: ${C.t1 ? jrTime(C.t1) : '—'}${Su.mins != null ? ` (${Su.mins}분)` : ''}`, `결과: ${Su.result}${Su.why ? ' — ' + Su.why : ''}`,
    `길: ${Su.route.join(' → ') || '—'}`, `처음 동료: ${(Su.party0 || []).map(n => n + ((C.pick || []).includes(n) ? ' (뽑기)' : '')).join(' · ') || '—'}`, `쓰러진 이: ${Su.fallen.join(' · ') || '없음'} · 버린 이: ${Su.lost.join(' · ') || '없음'}`, `맵 ${Su.maps}번 · 싸운 시간 모두 ${jrMmss(Su.time)} · 처치 ${Su.kills}`, '');
  M.forEach((m, i) => {
    o.push(`════════ ${i + 1}. ${m.name || m.s + 'S'} · ${m.kind || ''}${m.enc ? ' — ' + m.enc : ''}${m.btl ? ' — ' + m.btl.comp + ' · ' + m.btl.sit : ''}${m.npc ? ' (' + m.npc + ')' : ''} — ${m.back ? '다시 들어섬' : '처음'}${m.from ? (m.from === 'up' ? ' · 위에서 내려옴' : ' · 아래에서 올라옴') : ''}${m.live ? ' · 지금 이 맵' : ''} ════════`);
    if (m.at) o.push(`들어선 때: ${jrTime(m.at)}`); if ((m.foes || []).length) o.push(`적: ${m.foes.join(' · ')}`);
    if ((m.in || []).length){ o.push('들어선 동료:'); for (const p of m.in) o.push('  ' + P(p)); }
    if ((m.talk || []).length){ o.push('── 대화 ──'); for (const t of m.talk) o.push(t.pick ? `  ▸ ${t.pick}` : `  ${t.at != null ? '[' + t.at + '초] ' : ''}${t.who ? t.who + ': ' : ''}${t.s}`); }
    if ((m.story || []).length){ o.push('── 이야기 ──'); for (const l of m.story) o.push('  ' + l); }
    if ((m.text || []).length){ o.push('── 자세한 기록 ──'); for (const l of m.text) for (const q of String(l).split('\n')) o.push('  ' + q); }
    if (m.t != null) o.push(`결과: ${m.live ? '진행 중' : JR_RES[m.res] || m.res || '—'} · ${jrMmss(m.t)}${m.kills != null ? ' · 처치 ' + m.kills : ''}${m.foesLeft != null ? ' · 남은 적 ' + m.foesLeft : ''}${m.cleared ? ' · 끝난 맵' : ''}`);
    if ((m.out || []).length) o.push('나간 동료: ' + m.out.map(q => `${q.name} ${q.how}${q.hp != null && q.how !== '쓰러짐' ? ' (피 ' + q.hp + ')' : ''}`).join(' · '));
    if ((m.grow || []).length) o.push('성장: ' + m.grow.join(' / '));
    if ((m.loot || []).length) o.push('전리품: ' + m.loot.join(' · '));
    if (m.stub) o.push('(들어선 기록 없음 — 맵 로그만)');
    o.push(''); });
  return o;
}
// 파일 모양: 위는 한 줄에 하나씩 (읽기 쉽게) · 맵의 원본 사건은 한 줄에 사건 하나
function jsonLines(v, ind, d){ ind = ind || ''; d = d || 0;
  if (Array.isArray(v)){ if (!v.length) return '[]'; return '[\n' + v.map(x => ind + ' ' + (x && typeof x === 'object' && d < 2 ? jsonLines(x, ind + ' ', d + 1) : JSON.stringify(x))).join(',\n') + '\n' + ind + ']'; }
  if (v && typeof v === 'object'){ if (d >= 3) return JSON.stringify(v); const E = Object.entries(v).filter(([, x]) => x !== undefined); if (!E.length) return '{}'; return '{\n' + E.map(([k, x]) => ind + ' ' + JSON.stringify(k) + ': ' + jsonLines(x, ind + ' ', d + 1)).join(',\n') + '\n' + ind + '}'; }
  return JSON.stringify(v);
}
async function campLogAll(){
  await clogBusy; const last = !S.camp && S.jrLast, C = S.camp || (last ? last.camp : {}) || {}, J = (S.camp ? S.camp.jr : last && last.jr) || null, L = clogGet(), M = [];
  for (const x of L){ let log = null, tx = null; try { log = x.z ? JSON.parse(await gunB64(x.z)) : JSON.parse(x.j || '[]'); } catch (e) {} try { tx = x.zt ? JSON.parse(await gunB64(x.zt)) : x.jt ? JSON.parse(x.jt) : null; } catch (e) {}
    const v = J && x.vn != null ? (J.visits || []).find(q => q.n === x.vn) : null; M.push({ ...(v || { s: x.s, name: (CAMP_S[x.s] || {}).name, stub: true }), t: x.t, res: x.res, ev: x.n, story: tx ? tx.story : null, text: tx ? tx.text : null, log }); }
  if (S.camp && !S.camp.end && world && world.camp){ const v = jrCur(); if (v && v.t == null) M.push({ ...v, live: true, t: +world.t.toFixed(1), res: world.over ? world.result : null, ev: world.log.length, story: jrStory(world), text: logLines(world), log: world.log.slice() }); }   // 아직 넘어가지 않은 지금 맵
  return { game: '굴의 전투판', ver: '7.25.3', kind: '1F 여정 기록', at: new Date().toISOString(), summary: jrSummary(C, J, M), text: jrText(C, J, M),
    camp: { s: C.s, end: C.end || null, pick: C.pick, fallen: C.fallen, lost: C.lost, log: C.log }, stages: M.map(({ story, text, ...m }) => m) };
}
""")
rep("  const out = await campLogAll(); if (!out.stages.length){ toast('아직 저장된 맵 로그가 없어요 (맵을 넘어가면 쌓여요)'); return; }",
    "  const out = await campLogAll(); if (!out.stages.length){ toast('아직 여정 기록이 없어요 (맵에 들어서면 쌓여요)'); return; }")
rep("  try { await dl.save({ filename: `gul_1F_log_${new Date().toISOString().slice(0, 10)}.json`, data: new Blob([JSON.stringify(out)]) }); toast(`맵 ${out.stages.length}개의 로그를 파일로 받았어요`); }",
    "  try { await dl.save({ filename: `gul_1F_journey_${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')}.json`, data: new Blob([jsonLines(out)], { type: 'application/json' }) }); toast(`여정 기록 — 맵 ${out.stages.length}번을 파일 하나로 받았어요`); }   /* v7.25.3 여정 기록 */")
rep("async function campLogCopy(){ const out = await campLogAll(); if (!out.stages.length){ toast('아직 저장된 맵 로그가 없어요'); return; } copyText(JSON.stringify(out), `맵 ${out.stages.length}개의 로그를 복사했어요`); }",
    "async function campLogCopy(){ const out = await campLogAll(); if (!out.stages.length){ toast('아직 여정 기록이 없어요'); return; } copyText(jsonLines(out), `여정 기록 — 맵 ${out.stages.length}번을 복사했어요`); }   /* v7.25.3 */")
rep("  for (const r of rows){ const p = party.find(x => x.id === r.pid); r.grow = p ? growFor(p, r) : []; }   // v7.21.2 성장 (넘어간 이만)",
    "  for (const r of rows){ const p = party.find(x => x.id === r.pid); r.grow = p ? growFor(p, r) : []; }   // v7.21.2 성장 (넘어간 이만)\n  jrGrow(rows);   /* v7.25.3 여정 기록 */")
rep("title=\"모든 맵의 로그 · 캠페인 요약을 JSON 파일 하나로\"", "title=\"1S 부터 끝까지 여정 전체 (요약 · 맵마다 이야기 · 자세한 기록 · 원본) 를 파일 하나로\"")
rep(">로그 받기</button><button class=\"btn\" type=\"button\" id=\"campLogCp\">로그 복사</button>", ">여정 기록 받기</button><button class=\"btn\" type=\"button\" id=\"campLogCp\">여정 기록 복사</button>")
rep("'<button class=\"btn sm\" type=\"button\" data-clog=\"1\" title=\"지금까지 넘어간 맵의 로그를 파일로\">로그</button>' : '<button class=\"btn sm\" type=\"button\" data-clog=\"cp\" title=\"지금까지 넘어간 맵의 로그를 복사\">로그 복사</button>'",
    "'<button class=\"btn sm\" type=\"button\" data-clog=\"1\" title=\"지금까지의 여정 (이 맵까지) 을 파일 하나로\">여정 기록</button>' : '<button class=\"btn sm\" type=\"button\" data-clog=\"cp\" title=\"지금까지의 여정 (이 맵까지) 을 복사\">여정 복사</button>'")
# 대화도 여정에
rep("  const full = L.t || L.narr || L.box || '', el = $('tkText'); clearInterval(TK.timer);",
    "  const full = L.t || L.narr || L.box || '', el = $('tkText'); clearInterval(TK.timer); jrTalk({ who: L.narr ? '나레이션' : L.box ? '알림' : $('tkName').textContent || (E && E.name) || '', s: full });   /* v7.25.3 여정 기록 */")
rep("$('talk').addEventListener('click', e => { const b = e.target.closest('button[data-tk]'); if (b){ talkPick(b.dataset.tk); return; }",
    "$('talk').addEventListener('click', e => { const b = e.target.closest('button[data-tk]'); if (b){ jrTalk({ pick: b.textContent }); talkPick(b.dataset.tk); return; }")
# 이야기 탭: 지난 여정 받기
rep("  if (L.length) h += `<div class=\"box\"><p class=\"lab\">지난 프롤로그</p>",
    "  if (!C && S.jrLast){ const J0 = S.jrLast.jr || {}, V = J0.visits || []; h += `<div class=\"box\"><p class=\"lab\">지난 여정 기록</p><p class=\"srec\">${esc(V.map(v => v.name).join(' → '))} — ${esc(J0.end ? JR_END[J0.end] || J0.end : '그만둠')} · 맵 ${V.length}번</p><div class=\"row\">${dlNs ? '<button class=\"btn go\" type=\"button\" data-sh=\"jdl\">여정 기록 받기</button>' : ''}<button class=\"btn\" type=\"button\" data-sh=\"jcp\">여정 기록 복사</button></div><p class=\"note\">새 프롤로그를 시작하면 지워져요.</p></div>`; }   /* v7.25.3 */\n"
    "  if (L.length) h += `<div class=\"box\"><p class=\"lab\">지난 프롤로그</p>")
rep("  if (k === 'log'){ campLogCopy(); return; }", "  if (k === 'log' || k === 'jcp'){ campLogCopy(); return; }\n  if (k === 'jdl'){ campLogDownload(); return; }   /* v7.25.3 지난 여정 */")
rep("<button class=\"btn\" type=\"button\" data-sh=\"log\">로그 복사</button>", "<button class=\"btn\" type=\"button\" data-sh=\"log\">여정 기록 복사</button>")

# ---------- 인카운터 목록 (훈련장 · 개발 · 정비용) ----------
rep("function renderTraitsTab(){\n", r"""// v7.25.3 인카운터 목록 — 1F 프롤로그의 모든 만남: 갈래 · 나오는 곳 · 확률 · 등장 · 맵 · 대화 마디 · 결말 · 바로 해 보기 (스토리에서 새 프롤로그로)
const ENC_DOC = {
  fight: { what: '떠도는 망자의 무리. 들어설 때 무리 하나 · 상황 하나를 뽑음 (2S 는 바로 앞 싸움과 다른 무리). 다시 들어오면 남긴 적이 그 자리에', how: ['적을 모두 쓰러뜨리면 끝난 맵 (전리품 창)', '위쪽 끝으로 나가면 다음 맵 · 아래쪽 끝은 앞 맵', '1S · 2S 에 처음 들어설 때 각혈 (7%, 캠페인에 한 번)'], end: '모두 쓰러뜨림 · 넘어감 · 전멸' },
  chin: { what: '물가 바위 위에서 졸고 있는 사냥꾼 (활)', how: ['처음 보이면 나레이션', '3칸 안에 다가가면 깜짝 놀라 물러남 (도약)', '말 걸기 → 계속 말을 건다 → 어디로 가냐 → 위쪽 길을 가리킴 → 동행 제안 → 동료', '그만두면 거절 (다시 말 걸면 눈길도 주지 않음)', '말 걸지 않고 위로 넘어가면 따라와 동료가 됨', '공격하면 그 자리에서 적'], end: '동료 · 거절 · 따라옴 · 싸움' },
  tang: { what: '어둠 한가운데 작은 불빛 — 장비 무더기와 시체 곁에 앉은 사내 (대검)', how: ['불빛 4칸 안이면 먼저 인사', '말 걸기 → 같이 가자 → 동료 / 두고 간다 → 거절', '그냥 지나쳐 위로 넘어가면 따라옴', '공격하면 대검을 쥐고 일어섬'], end: '동료 · 거절 · 따라옴 · 싸움' },
  shop: { what: '토끼마차 1호점 — 상인 아이텐과 마차 위에서 담배를 피우는 청갑', how: ['아이텐에게 말 걸기 → 물건을 본다 (상점)', '청갑에게 말 걸면: 뭘 봐 → 꺼져 → 대꾸 없음', '공격하면 확정 패배 (6성 창병 청갑 · 4성 서폿 아이텐)'], end: '거래 · 지나침 · 확정 패배' },
  hora: { what: '무대 같은 빛 한가운데 조용히 앉아 있는 거대한 기사 (중간보스)', how: ['5.5칸 안에 들어서면 천천히 일어남 — "대장군이 전쟁을 시작합니다"', '26 × 16 무대 · 빛 0.55'], end: '싸움 (쓰러뜨리거나 넘어감)' },
  lost: { what: '버린 동료가 기적적으로 따라잡음', how: ['버린 이가 있을 때만 뽑힘 (몫 1.5)', '4칸 안에 다가가면 다시 동료 (처음 버린 이부터)'], end: '동료로 돌아옴' } };
const TK_NX = nx => !nx ? '닫기' : ({ '!join': '동료가 됨', '!decline': '거절', '!foe': '그 자리에서 적', '!foe2': '싸움 (보스)', '!shop': '상점', '!war': '확정 패배', '!lose': '패배' })[nx] || nx;
const encFace = (ref, nm, sub) => `<span class="ef"><i style="${faceCss(faceOf(ref), 22)}"></i>${esc(nm)}${sub ? ' <small class="lb">' + esc(sub) + '</small>' : ''}</span>`;
const encFoes = F => F.map(([k, n]) => { const u = foeOf(k); return encFace(u.ref, u.name.replace(/\s*\d+$/, ''), (n > 1 ? '× ' + n + ' · ' : '') + (u.tier ? u.tier + '성' : '')); }).join('');
function encShare(k){ const P = ENC3.filter(e => e.w > 0), a = P.filter(e => e.k !== 'lost').reduce((x, e) => x + e.w, 0), b = a + ((ENC3.find(e => e.k === 'lost') || {}).w || 0), e = ENC3.find(q => q.k === k) || {};
  const pc = (x, t) => (x / t * 100).toFixed(1) + '%'; return k === 'lost' ? `버린 이가 있을 때 ${pc(e.w, b)}` : `${pc(e.w, a)} (버린 이가 있으면 ${pc(e.w, b)})`; }
const encTalkDoc = npc => Object.entries(TALK[npc] || {}).map(([node, L]) => `<div class="etk"><b>${esc(node)}</b>${L.map(x => x.ask ? '[' + x.ask.map(([lb, nx]) => esc(lb) + ' → ' + esc(TK_NX(nx))).join(' | ') + ']' : x.go ? '⇒ ' + esc(TK_NX(x.go)) : esc(x.t ? `"${x.t}"` : x.narr ? `(나레이션) ${x.narr}` : `(알림) ${x.box}`)).join(' · ')}</div>`).join('');
const encMap = M => M ? `${M.W || 32} × ${M.H || 20} · 빛 ${M.amb || 0}${(M.water || []).length ? ' · 얕은 물 ' + M.water.length : ''}${(M.torches || []).length ? ' · 불빛 ' + M.torches.length : ''}${(M.piles || []).length ? ' · 더미 ' + M.piles.length : ''}` : '';
const encTr = (a, b) => `<tr><th class="l">${a}</th><td class="l">${b}</td></tr>`;
function renderEncTab(){
  const el = $('pane-enc'); if (!el) return;
  const B = (k, t) => `<span class="eb b-${k}">${t}</span>`, tryB = (k, lb) => `<button class="btn sm" type="button" data-etry="${k}">${lb || '▶ 해 보기'}</button>`;
  const rows = [['공통 전투', B('com', '공통'), '1S · 2S (늘) · 3S (뽑히면)', `1S · 2S 100% · 3S ${encShare('fight')}`, ENC_DOC.fight.end, 'fight'],
    ...ENC3.filter(e => e.npc).map(e => [e.name, B('rnd', '랜덤'), '3S', encShare(e.k), ENC_DOC[e.k] ? ENC_DOC[e.k].end : '', e.k]),
    ['알현실 입구', B('fix', '고정'), '4S', '늘', '실내전 — 쓰러뜨리거나 지나감', '4'], ['알현실 — 관 속의 왕', B('fix', '고정'), '5S', '늘', '세자르가 쓰러지면 계단 → 프롤로그 끝', '5'],
    ['피할 수 없는 죽음 (각혈)', B('ev', '사건'), '1S · 2S', `${Math.round(KH_P * 100)}% (캠페인에 한 번)`, '쓰러뜨림 · 살아서 빠져나옴', 'kh'], ['따라온 이', B('ev', '사건'), '3S 다음 맵', '3S 만남 인물을 말 걸지 않고 지나치면', '따라와 동료가 됨', ''],
    ['토끼마차를 건드림', B('ev', '사건'), '3S (토끼마차)', '공격을 고르면', '확정 패배 (전멸)', ''], ['오딜의 방', B('plan', '예정'), '— (v7.26.0)', '—', '쉼 · 이야기 · 인연 (싸우지 않음)', '']];
  let h = `<div class="box"><p class="lab">인카운터 목록 — 개발 · 정비용</p><p class="note">1F 프롤로그에서 만나는 모든 것. 싸움은 공통 전투 하나로 치고 (무리 · 상황이 무작위), 3S 는 랜덤 인카운터, 4S · 5S 는 고정 (따로 된 맵), 사건은 조건이 맞을 때. ▶ 해 보기 = 스토리에서 새 프롤로그를 열고 그 만남으로 바로 (진행 중인 프롤로그는 사라짐).</p>
    <div class="tw"><table class="tbl encT"><thead><tr><th class="l">이름</th><th class="l">갈래</th><th class="l">나오는 곳</th><th class="l">확률 · 조건</th><th class="l">결말</th><th class="l"></th></tr></thead><tbody>${rows.map(r => `<tr><td class="l">${esc(r[0])}</td><td class="l">${r[1]}</td><td class="l">${esc(r[2])}</td><td class="l">${esc(r[3])}</td><td class="l">${esc(r[4])}</td><td class="l">${r[5] ? tryB(r[5], '▶') : ''}</td></tr>`).join('')}</tbody></table></div></div>`;
  const cTot = BTL_COMP.reduce((a, x) => a + x.w, 0), sTot = BTL_SIT.reduce((a, x) => a + x.w, 0);
  h += `<div class="box"><p class="lab">공통 전투 ${B('com', '공통')}</p><table class="tbl encT"><tbody>${encTr('무엇', esc(ENC_DOC.fight.what))}${encTr('나오는 곳', '1S · 2S 는 늘 · 3S 는 뽑히면 (' + esc(encShare('fight')) + ')')}${encTr('맵', '32 × 20 · 1F 지형 (언덕 · 무더기 · 바위) · 어둠 (빛 0) — 인주의 횃불뿐')}${encTr('흐름', '<ul>' + ENC_DOC.fight.how.map(x => `<li>${esc(x)}</li>`).join('') + '</ul>')}</tbody></table>
    <p class="sublab">무리 (적 구성)</p><div class="tw"><table class="tbl encT"><thead><tr><th class="l">무리</th><th class="l">구성</th><th class="l">몫</th><th class="l">설명</th></tr></thead><tbody>${BTL_COMP.map(c => `<tr><td class="l">${esc(c.name)}</td><td class="l">${encFoes(c.foes)}</td><td class="l">${(c.w / cTot * 100).toFixed(0)}%</td><td class="l">${esc(c.note)}</td></tr>`).join('')}</tbody></table></div>
    <p class="sublab">상황 (적의 시작)</p><div class="tw"><table class="tbl encT"><thead><tr><th class="l">상황</th><th class="l">몫</th><th class="l">적의 시작</th><th class="l">들어설 때 나레이션</th></tr></thead><tbody>${BTL_SIT.map(x => `<tr><td class="l">${esc(x.name)}</td><td class="l">${(x.w / sTot * 100).toFixed(0)}%</td><td class="l">${esc(x.note)}</td><td class="l">${esc(x.narr)}</td></tr>`).join('')}</tbody></table></div>
    <div class="row"><select id="encBtC" aria-label="무리"><option value="">무리 — 무작위</option>${BTL_COMP.map(c => `<option value="${c.k}">${esc(c.name)}</option>`).join('')}</select><select id="encBtS" aria-label="상황"><option value="">상황 — 무작위</option>${BTL_SIT.map(x => `<option value="${x.k}">${esc(x.name)}</option>`).join('')}</select>${tryB('fight', '▶ 1S 에서 해 보기')}</div></div>`;
  for (const e of ENC3.filter(q => q.npc)){ const N = NPC[e.npc], Dc = ENC_DOC[e.k] || {}, ppl = [N, ...(e.more || []).map(k => NPC[k])].filter(Boolean);
    h += `<div class="box"><p class="lab">${esc(e.name)} ${B('rnd', '3S 랜덤')}</p><table class="tbl encT"><tbody>${encTr('무엇', esc(Dc.what || ''))}${encTr('뽑힐 몫', esc(encShare(e.k)) + (e.npc !== 'lost' ? ' · 그 인물이 일행 · 쓰러짐 · 버림에 있으면 빠짐' : ''))}
      ${encTr('등장', ppl.map(n => n.lostNpc ? encFace(null, '버린 동료', '그 사람') : encFace(n.ref, n.key, n.who + (n.boss ? ' · 보스' : ''))).join(''))}${N.map ? encTr('맵', esc(encMap(N.map))) : ''}${N.seen ? encTr('처음 보일 때', esc(N.seen)) : ''}
      ${encTr('흐름', '<ul>' + (Dc.how || []).map(x => `<li>${esc(x)}</li>`).join('') + '</ul>')}${ppl.some(n => TALK[Object.keys(NPC).find(k => NPC[k] === n)]) ? encTr('대화 마디', ppl.map(n => encTalkDoc(Object.keys(NPC).find(k => NPC[k] === n))).join('')) : ''}
      ${e.k === 'shop' ? encTr('물건', SHOP.map(x => `${esc(x.name)} (${x.cost} · ${x.stock}개)`).join(' · ')) : ''}${N.pass ? encTr('지나치면', esc(N.pass)) : ''}${encTr('결말', esc(Dc.end || ''))}</tbody></table><div class="row">${tryB(e.k, '▶ 3S 에서 해 보기')}</div></div>`; }
  h += `<div class="box"><p class="lab">알현실 입구 ${B('fix', '4S 고정')}</p><table class="tbl encT"><tbody>${encTr('무엇', '하얀 사막의 끝 — 무너진 담 너머 유적. 입구를 지키는 곤봉적 (햇살 안) · 안은 방마다 숨은 적 (실내전 · 벽이 시야를 자름)')}${encTr('맵', `${RUIN.W} × ${RUIN.H} 유적 · 햇살 ${RUIN.sun} · 안쪽 빛 ${RUIN.dim}`)}${encTr('적', encFoes([['곤봉적', 1]]) + encFoes(Object.entries(RUIN.foes.reduce((a, k) => (a[k] = (a[k] || 0) + 1, a), {}))))}${encTr('흐름', '<ul><li>방마다 문 옆 모퉁이를 지키는 적 — 들어서면 덮침</li><li>위쪽 끝 = 5S 알현실</li></ul>')}</tbody></table><div class="row">${tryB('4', '▶ 4S 에서 해 보기')}</div></div>`;
  h += `<div class="box"><p class="lab">알현실 — 관 속의 왕 ${B('fix', '5S 고정')}</p><table class="tbl encT"><tbody>${encTr('무엇', '천장이 보이지 않는 원형 홀 — 빛이 쏟아져 내리는 장엄한 곳 · 가운데에 관 하나')}${encTr('맵', `${HALL.W} × ${HALL.H} 원형 홀 · 빛 ${HALL.amb} (한눈에 다 보임) · 기둥 여덟`)}${encTr('등장', encFoes([['세자르', 1]]))}
    ${encTr('흐름', `<ul><li>관에 ${HALL.near}칸 안 → ⚰ 관을 연다</li><li>관을 조사하고 ${HALL.rise}초 뒤 (${HALL.hint}초에 긁는 소리) — 세자르가 일어남</li><li>가까이 갔다가 ${HALL.far}칸 밖으로 벗어나도 · ${HALL.wait}초 넘게 머뭇거려도 일어남</li><li>쓰러지면 관 자리에 계단 → 프롤로그 끝</li></ul>`)}</tbody></table><div class="row">${tryB('5', '▶ 5S 에서 해 보기')}</div></div>`;
  h += `<div class="box"><p class="lab">사건 ${B('ev', '사건')}</p><table class="tbl encT"><tbody>${encTr('피할 수 없는 죽음', `${encFoes([['각혈', 1]])} 1S · 2S 에 처음 들어설 때 ${Math.round(KH_P * 100)}% (캠페인에 한 번) — 6 ~ 14초 뒤 일행에게서 먼 쪽 끝에서 나타나 가장 가까운 이를 쫓음 (처음 노린 이의 자리는 앎) · ${tryB('kh', '▶ 1S 에서 해 보기')}`)}
    ${encTr('따라온 이', '3S 의 잠든 사냥꾼 · 불가에 앉은 이를 말 걸지 않고 (또는 인사만) 지나쳐 위로 넘어가면 다음 맵에서 따라와 동료가 됨')}${encTr('토끼마차를 건드림', esc(TALK_WAR.filter(x => x.t || x.narr || x.box).map(x => x.t ? `"${x.t}"` : x.narr || x.box).join(' · ')) + ' → 확정 패배')}</tbody></table></div>`;
  h += `<div class="box"><p class="lab">오딜의 방 ${B('plan', '예정 v7.26.0')}</p><p class="note">문 너머 작고 어두운 방 — 낡은 붉은 소파에 가면을 쓴 여자와 차. 싸우지 않는 쉼 · 이야기 · 인연 (찾아올수록 깊어짐) · 죽일 수 있음. 다음 판에서 들어감.</p></div>`;
  el.innerHTML = h;
}
function encTry(k){
  if (!confirm('스토리에서 새 프롤로그를 열고 이 만남으로 바로 갈까요? (진행 중인 프롤로그는 사라져요)')) return;
  const cS = ($('encBtC') || {}).value || '', sS = ($('encBtS') || {}).value || '';
  if (S.mode !== 'story' && !setMode('story')) return;
  if (S.camp) campQuit(true); if (mode !== 'edit') resetToEdit();
  const party = campStart({ direct: true }); if (!party) return; const C = S.camp;
  const ts = k === '4' ? 4 : k === '5' ? 5 : (k === 'fight' || k === 'kh') ? 1 : 3;
  if (k === 'fight') C.btForce = { c: cS, s: sS }; if (k === 'kh') C.khForce = true;
  let P = party;
  if (ts === 3){ const E = ENC3.find(q => q.k === k); if (E && E.npc && NPC[E.npc].key) P = P.filter(p => p.name !== NPC[E.npc].key);
    if (k === 'lost'){ const q = P.filter(p => !p.hero && !CAMP_FIX.includes(p.name)).pop() || P[P.length - 1]; P = P.filter(p => p !== q); C.lost.push(q.name); (C.lostP = C.lostP || []).push({ ...clone(q), hpNow: Math.round(statsOf(q, rules).hp * 0.6) }); }
    C.stages[3] = { seed: 1 + Math.floor(Math.random() * 999999), tseed: 1 + Math.floor(Math.random() * 999999), e3: k }; }
  S.units = P; C.s = ts; campGo(ts, 'down', P); toast(`🧪 인카운터 시험 — ${ts}S`);
}
document.addEventListener('click', e => { const b = e.target.closest('[data-etry]'); if (b) encTry(b.dataset.etry); });
function renderTraitsTab(){
""")
rep("      case 'campIn': out.push(`${T(e)}🗺 1F · ${e.name} ${e.kind}${e.back ? ' — 다시 돌아옴' : ''}", "      case 'campIn': out.push(`${T(e)}🗺 1F · ${e.name} ${e.kind}${e.bt ? ' — ' + e.bt + ' (우리는 모름)' : ''}${e.back ? ' — 다시 돌아옴' : ''}")   # v1.2
open(F, 'w', encoding='utf-8').write(s)
print('page7253 OK')
