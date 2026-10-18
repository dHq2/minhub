# v7.24.5 페이지 — page7245.py v1.2 (v1.2: 스토리 첫 화면에서 ▶ 전투 시작 (Space) = 프롤로그 시작 · 오른쪽 안내 글도 스토리 말로 · v1.1: 이야기 탭 글을 따로 · 다시 그리는 열쇠에 진행 상태 · 끝 창 · 그만두기 말 · 처음 고르기 표시는 변수로 · 스토리 · 훈련장 나눔: 머리글 모드 단추 · 처음 열 때 고르기 · 스토리 첫 화면 (판 위) · 이야기 탭 · 탭 · 단추를 모드마다 ·
#   모드마다 판이 따로 (프롤로그는 훈련장에 가 있는 동안 맡겨 둠 S.story) · 프롤로그 기록 (S.storyLog) · 모바일 조작판 · 더 보기)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7244.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# 버전
rep('<!-- 굴의 전투판 v7.24.4 (2026-10-18)', '<!-- 굴의 전투판 v7.24.5 (2026-10-18)')
rep('     v7.24.4: ', '''     v7.24.5: 스토리 · 훈련장 나눔 — 머리글의 📖 스토리 / 🛠 훈련장 (처음 열 때 고름 · 모바일은 ☰ 더 보기에도). 스토리 = 1F 프롤로그만 (이야기 · 전투 · 특성 탭 · 판 위 첫 화면 · 모두 보기 없음)
         · 훈련장 = 배치 · 층 · 수치 · 특성 · 기록 · 자동 돌리기. 판은 모드마다 따로 — 훈련장에 가 있는 동안 진행 중인 프롤로그는 맡겨 둠 (돌아오면 그 맵 들어온 때부터). 끝난 프롤로그는 기록에 남음.
     v7.24.4: ''')
rep('h1::after{content:" v7.24.4"', 'h1::after{content:" v7.24.5"')
rep('<footer>굴의 전투판 v7.24.4', '<footer>굴의 전투판 v7.24.5')
rep('return `굴의 전투판 v7.24.4 · ${title}', 'return `굴의 전투판 v7.24.5 · ${title}')
rep("copyText('굴의 전투판 v7.24.4 자동 판 기록", "copyText('굴의 전투판 v7.24.5 자동 판 기록")
rep('의 버전 기록에 — v7.24.4 모닝스타 철퇴 다시 (관성 · 철퇴 후리기)', '의 버전 기록에 — v7.24.5 스토리 · 훈련장 나눔 / v7.24.4 모닝스타 철퇴 다시 (관성 · 철퇴 후리기)')
rep('">v7.24.4 · 모닝스타 철퇴 다시</span>', '">v7.24.5 · 스토리 · 훈련장</span>')
rep("ver: '7.24.4', at:", "ver: '7.24.5', at:")

# CSS
rep('.gacha .btn{min-height:40px}\n', '''.gacha .btn{min-height:40px}
/* v7.24.5 스토리 · 훈련장 */
.modeSeg{align-self:center} .modeSeg button{padding:5px 11px;font-size:12.5px}
body.story .trainOnly{display:none!important} body:not(.story) .storyOnly{display:none!important}
.shome{position:absolute;inset:0;z-index:7;background:radial-gradient(ellipse at 50% 32%,rgba(58,40,24,.93),rgba(8,6,10,.97));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;text-align:center;color:#ece4d6;overflow:auto}
.shome h3{margin:0;font:800 27px var(--display);color:#d9a94e;letter-spacing:.02em}
.shome .ssub{margin:0;max-width:460px;font:500 13.5px/1.65 var(--body);color:#b8ad9c}
.shome .sst{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:2px 0 4px;max-width:520px}
.shome .sst span{font:600 11.5px var(--mono);padding:3px 9px;border:1px solid rgba(217,169,78,.38);border-radius:999px;color:#dccba8}
.shome .row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.shome .btn{min-height:42px} .shome .slast{margin:0;max-width:460px;font:500 12px/1.5 var(--body);color:#9d927f}
.mpick{position:fixed;inset:0;z-index:70;background:rgba(8,6,10,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:16px;overflow:auto;color:#ece4d6;text-align:center}
.mpick h3{margin:0;font:800 28px var(--display);color:#d9a94e} .mpick .gsub{margin:0;font:500 13px var(--body);color:#a39a8c;max-width:520px}
.mpick .mcards{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.mpick .mcard{width:min(300px,88vw);text-align:left;border:1px solid rgba(217,169,78,.42);border-radius:12px;background:rgba(40,30,22,.88);color:#ece4d6;padding:14px 16px;cursor:pointer;font:500 13px/1.6 var(--body)}
.mpick .mcard b{display:block;font:800 19px var(--display);color:#f0d9a8;margin-bottom:4px} .mpick .mcard em{display:block;margin-top:6px;font-style:normal;font-weight:700;color:#9fd18b}
.mpick .mcard:hover,.mpick .mcard:focus-visible{border-color:#d9a94e;background:rgba(62,46,28,.94)}
.spty{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.spty .sp1{display:flex;align-items:center;gap:6px;padding:4px 9px 4px 4px;border:1px solid var(--line);border-radius:8px;background:var(--panel)}
.spty .sp1 i{width:34px;height:34px;border-radius:6px;flex:none} .spty .sp1 b{display:block;font:700 12.5px var(--body)} .spty .sp1 small{display:block;font:500 11px var(--mono);color:var(--dim)}
.srec{margin:3px 0;font:500 12px/1.5 var(--body);color:var(--dim)}
''')

# 머리글: 모드 단추 · 스토리 소개 글
rep('<h1>굴의 전투판</h1><span class="assist" id="assist"', '<h1>굴의 전투판</h1><span class="seg modeSeg" id="modeSeg" role="group" aria-label="모드"><button type="button" data-mode="story" title="1F 프롤로그 — 인주와 동료들의 이야기">📖 스토리</button><button type="button" data-mode="train" title="도감 인물을 마음대로 놓고 싸워 보는 곳">🛠 훈련장</button></span><span class="assist" id="assist"')
rep('<p class="lede">', '<p class="lede storyOnly">1F 프롤로그 — 굴에 떨어진 인주와 동료들. S 다섯을 지나 관 속의 왕까지. 쓰러진 이는 돌아오지 않고, 싸운 대로 자라요.</p>\n    <p class="lede trainOnly">')
# 판 위 스토리 첫 화면 · 처음 고르기
rep('<div class="ovl" id="ovl"></div>', '<div class="ovl" id="ovl"></div>\n        <div class="shome" id="sHome" hidden aria-label="스토리"></div>')
rep('<div class="toast" id="toast" role="status"></div>', '<div class="toast" id="toast" role="status"></div>\n<div class="mpick" id="mPick" hidden role="dialog" aria-label="모드 고르기"></div>')
# 탭
rep('<button class="tab" type="button" data-tab="fight" role="tab">전투</button>', '<button class="tab storyOnly" type="button" data-tab="story" role="tab">이야기</button>\n        <button class="tab" type="button" data-tab="fight" role="tab">전투</button>')
rep('<button class="tab on" type="button" data-tab="place" role="tab">배치</button>', '<button class="tab on trainOnly" type="button" data-tab="place" role="tab">배치</button>')
rep('<button class="tab" type="button" data-tab="rules" role="tab">수치</button>', '<button class="tab trainOnly" type="button" data-tab="rules" role="tab">수치</button>')
rep('<button class="tab" type="button" data-tab="log" role="tab">기록</button>', '<button class="tab trainOnly" type="button" data-tab="log" role="tab">기록</button>')
rep('      <div class="pane" id="pane-fight" hidden>', '      <div class="pane" id="pane-story" hidden></div>\n\n      <div class="pane" id="pane-fight" hidden>')
rep("for (const p of ['fight', 'place', 'rules', 'traits', 'log']) $('pane-' + p).hidden = p !== k; if (k === 'traits') renderTraitsTab(); }",
    "for (const p of ['story', 'fight', 'place', 'rules', 'traits', 'log']) $('pane-' + p).hidden = p !== k; if (k === 'traits') renderTraitsTab(); if (k === 'story') renderStory(); }   // v7.24.5 이야기 탭")
# 훈련장에만: 모두 보기 · 자동 돌리기 · 자동 한 판 로그
rep('<label class="ck" for="seeAll">', '<label class="ck trainOnly" for="seeAll">')
rep('<button class="btn" id="autoLogBtn" type="button">', '<button class="btn trainOnly" id="autoLogBtn" type="button">')
rep('''        <div class="row">
          <select id="nRuns"''', '''        <div class="row trainOnly">
          <select id="nRuns"''')
rep('<span class="brush" id="batchMsg">', '<span class="brush trainOnly" id="batchMsg">')
rep('<div class="res" id="res"></div>', '<div class="res trainOnly" id="res"></div>')

# 층 칸의 캠페인 단추 → 스토리로
rep('''<button class="btn go" type="button" id="campBtn" title="S 다섯을 차례로 — 확정 카리우스 · 레베카 · 청광묵 + 랜덤 둘">${S.camp && !S.camp.end ? '1F 캠페인 (진행 중)' : '1F 캠페인 시작'}</button>''',
    '''<button class="btn go" type="button" id="campBtn" title="스토리로 넘어가요 — 1F 프롤로그 (S 다섯을 차례로 · 확정 카리우스 · 레베카 · 청광묵 + 랜덤 둘)">${S.story || (S.camp && !S.camp.end) ? '📖 스토리로 (진행 중인 프롤로그)' : '📖 스토리 — 1F 프롤로그 시작'}</button>''')
rep("  if (e.target.id === 'campBtn'){ campStart(); return; }   // v7.21",
    "  if (e.target.id === 'campBtn'){ if (!setMode('story')) return; if (S.camp && !S.camp.end){ toast('진행 중인 프롤로그로 돌아왔어요'); return; } campStart(); return; }   // v7.21   // v7.24.5 스토리로 넘어가서")

# 시작 막기: 스토리인데 프롤로그가 없음
rep("function canFight(){\n", "function canFight(){\n  if (S.mode === 'story' && !S.camp){ campStart(); return false; }   // v7.24.5 스토리 첫 화면에서 ▶ 전투 시작 (Space) = 프롤로그 시작\n")
rep("  const ti = ed ? (S.draft.done ? `배치 중이에요.", "  const ti = ed && S.mode === 'story' ? (S.camp ? `📖 1F · ${esc((CAMP_S[Math.min(5, S.camp.s)] || {}).name || '')} ${esc((CAMP_S[Math.min(5, S.camp.s)] || {}).kind || '')} — <b>전투 시작</b> (Space) 으로 들어가요. 위쪽 끝 띠 = 다음 맵 · 아래쪽 끝 = 앞 맵${opTxt}` : `📖 스토리 — <b>전투 시작</b> (Space) 또는 판 위의 ▶ 프롤로그 시작. 배치 · 수치는 머리글의 🛠 훈련장에서.`) : ed ? (S.draft.done ? `배치 중이에요.")  # v7.24.5
# 캠페인 시작 · 끝 · 그만둠
rep("  gachaShow(party, pick);   // v7.21.1 뽑기 연출 → 1S\n}", "  gachaShow(party, pick);   // v7.21.1 뽑기 연출 → 1S\n  sHomeRender();   // v7.24.5\n}")
rep("function campEnd(kind){\n  const C = S.camp; C.end = kind; C.t1 = Date.now(); save();",
    """function campEnd(kind){
  const C = S.camp; C.end = kind; C.t1 = Date.now();
  (S.storyLog = S.storyLog || []).unshift({ t: C.t1, kind, s: Math.min(5, C.s), mins: Math.round((C.t1 - C.t0) / 60000), why: C.why || '', alive: kind === 'clear' ? S.units.filter(u => u.side === 0).map(u => u.name) : [], fallen: C.fallen.slice(), lost: C.lost.slice() }); S.storyLog.length = Math.min(S.storyLog.length, 8);   // v7.24.5 프롤로그 기록
  save();""")
rep("function campQuit(){\n  clogClear();   // v7.21.3", "function campQuit(q){\n  clogClear();   // v7.21.3")
rep("  resetToEdit(); selId = null; rebuildMap(); setMapUI(); changed(); renderFloors(); campBarRender(true); showTab('place');\n  toast('캠페인을 끝내고 원래 배치로 돌아왔어요');\n}",
    "  resetToEdit(); selId = null; rebuildMap(); setMapUI(); changed(); renderFloors(); campBarRender(true); showTab(S.mode === 'story' ? 'story' : 'place'); sHomeRender();   // v7.24.5 스토리면 첫 화면으로\n  if (q !== true) toast(S.mode === 'story' ? '프롤로그를 접었어요 — 다시 시작할 수 있어요' : '캠페인을 끝내고 원래 배치로 돌아왔어요');\n}")
rep("function campBarRender(force){\n  const el = $('campBar'); if (!el) return; const C = S.camp;", "function campBarRender(force){\n  sHomeRender();   // v7.24.5\n  const el = $('campBar'); if (!el) return; const C = S.camp;")

# 모바일 조작판
rep("  const allies = Wd ? Wd.units.filter(u => u.side === 0) : [];\n  const chips = allies.map(",
    "  const allies = Wd && !(S.mode === 'story' && !S.camp) ? Wd.units.filter(u => u.side === 0) : [];   // v7.24.5 스토리 첫 화면엔 칩 없음\n  const chips = allies.map(")
rep("  if (ed) acts = `<span class=\"dhint\">배치 중 — 아래 배치 칸에서 인물 · 맵을 고치고 ▶ 전투 시작. 판: 끌기 = 옮기기 · 두 손가락 = 확대</span>`;",
    "  if (ed) acts = S.mode === 'story' ? `<span class=\"dhint\">${S.camp ? `📖 1F · ${esc((CAMP_S[Math.min(5, S.camp.s)] || {}).name || '')} — ▶ 전투 시작으로 들어가요 · 판: 두 손가락 = 확대` : '📖 스토리 — 1F 프롤로그를 시작하세요 (훈련장은 ☰ 더 보기)'}</span>` : `<span class=\"dhint\">배치 중 — 아래 배치 칸에서 인물 · 맵을 고치고 ▶ 전투 시작. 판: 끌기 = 옮기기 · 두 손가락 = 확대</span>`;   // v7.24.5")
rep("  const play = ed ? `<button type=\"button\" class=\"db go\" data-dk=\"start\">▶ 전투 시작</button><button type=\"button\" class=\"db\" data-dk=\"edit\"><span class=\"ic\">✎</span><small>배치 고치기</small></button>",
    "  const stA = S.mode === 'story', stH = stA && !S.camp;   // v7.24.5\n  const play = ed ? `${stH ? '<button type=\"button\" class=\"db go\" data-dk=\"sstart\">📖 프롤로그 시작</button>' : '<button type=\"button\" class=\"db go\" data-dk=\"start\">▶ 전투 시작</button>'}${stA ? '<button type=\"button\" class=\"db\" data-dk=\"story\"><span class=\"ic\">📖</span><small>이야기</small></button>' : '<button type=\"button\" class=\"db\" data-dk=\"edit\"><span class=\"ic\">✎</span><small>배치 고치기</small></button>'}")
rep("    : over ? `<button type=\"button\" class=\"db go\" data-dk=\"again\">▶ 다시</button><button type=\"button\" class=\"db\" data-dk=\"reset\"><span class=\"ic\">⟲</span><small>배치로</small></button>",
    "    : over ? `<button type=\"button\" class=\"db go\" data-dk=\"again\">▶ 다시</button><button type=\"button\" class=\"db\" data-dk=\"reset\"><span class=\"ic\">⟲</span><small>${stA ? '맵 처음부터' : '배치로'}</small></button>")
rep("  if (k === 'edit'){ showTab('place'); $('side').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }",
    "  if (k === 'edit'){ showTab('place'); $('side').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }\n  if (k === 'story'){ showTab('story'); $('side').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }   // v7.24.5\n  if (k === 'sstart'){ campStart(); return; }")
# 더 보기
rep("  $('dMenu').innerHTML = `<p class=\"lab\">보기</p><div class=\"mrow\"><button class=\"db ${$('seeAll').checked ? 'on' : ''}\" data-dm=\"see\">👁<small>모두 보기</small></button>",
    "  const stA = S.mode === 'story';   // v7.24.5 모드 · 스토리엔 모두 보기 · 층 없음\n  $('dMenu').innerHTML = `<p class=\"lab\">모드</p><div class=\"mrow\"><button class=\"db ${stA ? 'on' : ''}\" data-dm=\"mode\" data-v=\"story\">📖<small>스토리</small></button><button class=\"db ${stA ? '' : 'on'}\" data-dm=\"mode\" data-v=\"train\">🛠<small>훈련장</small></button></div><p class=\"lab\">보기</p><div class=\"mrow\">${stA ? '' : `<button class=\"db ${$('seeAll').checked ? 'on' : ''}\" data-dm=\"see\">👁<small>모두 보기</small></button>`}")
rep("    <p class=\"lab\">층 (기초 배치 — 지금 판을 접고 그 배치로)</p><div class=\"mrow\">${floorList().map(f => `<button class=\"db\" data-dm=\"floor\" data-v=\"${esc(f.name)}\">▦<small>${esc(f.name)}</small></button>`).join('')}</div>",
    "    ${stA ? '' : `<p class=\"lab\">층 (기초 배치 — 지금 판을 접고 그 배치로)</p><div class=\"mrow\">${floorList().map(f => `<button class=\"db\" data-dm=\"floor\" data-v=\"${esc(f.name)}\">▦<small>${esc(f.name)}</small></button>`).join('')}</div>`}")
rep("<button class=\"db\" data-dm=\"reset\">⟲<small>배치로</small></button><button class=\"db\" data-dm=\"panel\">☷<small>기록 · 수치</small></button></div>`;",
    "<button class=\"db\" data-dm=\"reset\">⟲<small>${stA ? '맵 처음부터' : '배치로'}</small></button><button class=\"db\" data-dm=\"panel\">☷<small>${stA ? '이야기' : '기록 · 수치'}</small></button></div>`;")
rep("  else if (k === 'panel'){ toggleMenu(false); showTab('log'); $('side').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }",
    "  else if (k === 'panel'){ toggleMenu(false); showTab(S.mode === 'story' ? 'story' : 'log'); $('side').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }\n  else if (k === 'mode'){ toggleMenu(false); setMode(b.dataset.v); return; }   // v7.24.5")

# 끝 창 · 그만두기 말
rep('id="campDone">캠페인 끝내기 (원래 배치로)</button>', 'id="campDone">${S.mode === \'story\' ? \'프롤로그 끝내기\' : \'캠페인 끝내기 (원래 배치로)\'}</button>')
rep("confirm('캠페인을 그만두고 원래 배치로 돌아갈까요? (이 캠페인은 사라져요)')", "confirm(S.mode === 'story' ? '프롤로그를 그만둘까요? (이 진행은 사라져요)' : '캠페인을 그만두고 원래 배치로 돌아갈까요? (이 캠페인은 사라져요)')")

# 모드 본체
rep("/* ---------- 시작 ---------- */\n", r"""/* v7.24.5 스토리 · 훈련장 — 모드마다 판이 따로. 스토리 = 1F 프롤로그 (캠페인) 만 · 훈련장 = 배치 · 층 · 수치 · 자동 돌리기.
   진행 중인 프롤로그는 훈련장에 가 있는 동안 S.story 에 맡겨 둠 (그 맵의 판 + 캠페인) · 훈련장 판은 프롤로그 동안 S.campBak 에 (예전과 같음) */
const BOARD_K = ['type', 'W', 'H', 'mapC', 'randStart', 'seed', 'flips', 'units', 'torches', 'terr', 'tseed', 'piles', 'hills', 'pileOff', 'openers', 'water', 'amb', 'indoor', 'zones', 'sandY', 'holdClear'];
const boardOf = () => { const o = {}; for (const k of BOARD_K) if (S[k] !== undefined) o[k] = clone(S[k]); return o; };
const boardSet = B => Object.assign(S, { water: [], amb: 0, indoor: false, zones: [], sandY: null, holdClear: false, piles: [], hills: [], pileOff: [], openers: [] }, clone(B || {}));
const MODE_NM = { story: '스토리', train: '훈련장' };
function storyStash(){ if (!S.camp) return; S.story = { camp: S.camp, board: boardOf() }; const B = S.campBak; delete S.camp; delete S.campBak; if (B) boardSet(B); }
function storyUnstash(){ if (!S.story || S.camp) return; S.campBak = boardOf(); const St = S.story; delete S.story; boardSet(St.board); S.camp = St.camp; }
function modeNorm(){ if (S.mode === 'train') storyStash(); else if (S.mode === 'story') storyUnstash(); }   // 저장이 어긋나 있으면 맞춤
function setMode(m){
  if (!MODE_NM[m]) return false;
  if (S.mode === m){ applyMode(); return true; }
  if (TK){ toast('대화를 마친 뒤에 바꿀 수 있어요'); return false; }
  if (world && world.over && world.camp && S.camp && !S.camp.end){ toast('정산 창에서 다음 맵으로 넘어간 뒤에 바꿀 수 있어요'); return false; }
  if (world && mode !== 'edit' && !world.over && world.t > 0.5 && !confirm(S.camp ? `${MODE_NM[m]}으로 갈까요? 이 맵은 나중에 들어온 때부터 다시 해요 (동료 · 진행은 그대로)` : `${MODE_NM[m]}으로 갈까요? 지금 판은 접어요`)) return false;
  if (!$('gacha').hidden){ $('gacha').hidden = true; $('gacha').innerHTML = ''; const B = S.campBak; delete S.camp; delete S.campBak; if (B) boardSet(B); }   // 뽑기 연출 중이면 시작을 거둠
  if (S.camp && S.camp.end) campQuit(true);   // 끝난 프롤로그는 접음 (기록은 남음)
  if (world || mode !== 'edit') resetToEdit();
  if (m === 'train') storyStash(); else storyUnstash();
  S.mode = m; selId = null; rebuildMap(); setMapUI(); changed(); centerStart(); renderFloors(); renderDraft(); campBarRender(true);
  applyMode(true); hud(); toast(m === 'story' ? (S.camp ? `📖 스토리 — 1F · ${(CAMP_S[Math.min(5, S.camp.s)] || {}).name} 로 돌아왔어요` : '📖 스토리 — 1F 프롤로그') : '🛠 훈련장 — 배치 · 수치 · 자동 돌리기');
  return true;
}
function applyMode(sw){
  const st = S.mode === 'story';
  document.body.classList.toggle('story', st); document.body.classList.toggle('train', !st);
  $('modeSeg').querySelectorAll('[data-mode]').forEach(b => { b.classList.toggle('on', b.dataset.mode === S.mode); b.setAttribute('aria-pressed', b.dataset.mode === S.mode ? 'true' : 'false'); });
  if (st && $('seeAll').checked){ S.seeTr = 1; $('seeAll').checked = false; $('seeAll').dispatchEvent(new Event('change')); }   // 스토리는 보이는 것만 (훈련장으로 돌아가면 다시 켬)
  else if (!st && S.seeTr){ delete S.seeTr; $('seeAll').checked = true; $('seeAll').dispatchEvent(new Event('change')); }
  $('resetBtn').textContent = st ? '⟲ 맵 처음부터' : '⟲ 배치로';
  $('edittag').textContent = st ? '들어서기 전 · ▶ 전투 시작' : '배치 중 · 판 전체가 보여요';
  const on = document.querySelector('.tab.on'), k = on ? on.dataset.tab : '';
  if (sw || (st ? ['place', 'rules', 'log'].includes(k) : k === 'story')) showTab(st ? 'story' : (S.draft.done ? 'fight' : 'place'));
  sHomeRender(true); if (menuOpen()) renderMenu(); save();
}
var sHomeK = '';
function sHomeRender(force){   // 판 위 스토리 첫 화면 (프롤로그가 없을 때) · 이야기 탭도 바뀐 게 있을 때만 다시 그림
  const el = $('sHome'); if (!el) return; const C = S.camp;
  const on = S.mode === 'story' && !C && $('gacha').hidden, key = [on, (S.storyLog || []).length, C ? [C.s, C.end || '', (C.log || []).length, mode === 'edit'].join(',') : ''].join('|');
  if (!force && key === sHomeK) return; sHomeK = key;
  el.hidden = !on; el.innerHTML = on ? storyHome() : '';
  if ($('pane-story') && !$('pane-story').hidden) renderStory();
}
const storyLast = r => r ? `${r.kind === 'clear' ? '무덤이 열림 — 끝까지' : `${(CAMP_S[r.s] || {}).name || r.s + 'S'} 에서 ${r.why || '전멸'}`} · ${r.mins}분${r.alive.length ? ' · 살아남은 이 ' + r.alive.join(' · ') : ''}${r.fallen.length ? ' · 쓰러진 이 ' + r.fallen.join(' · ') : ''}` : '';
const storyIntro = () => `굴에 떨어진 인주와 동료들 — 확정 ${CAMP_FIX.join(' · ')} + 뽑기 둘. 위쪽 끝으로 나아가 S 다섯을 지나 관 속의 왕까지. 쓰러진 이는 돌아오지 않고, 싸운 대로 자라요.`;
function storyHome(){
  const L = S.storyLog || [];
  return `<h3>1F 프롤로그</h3><p class="ssub">${esc(storyIntro())}</p>
    <div class="sst">${CAMP_S.slice(1).map(d => `<span title="${esc(d.note)}">${d.name} · ${esc(d.kind)}</span>`).join('')}</div>
    <div class="row"><button class="btn go" type="button" data-sh="start">▶ 프롤로그 시작</button><button class="btn" type="button" data-sh="train">🛠 훈련장으로</button></div>${L[0] ? `<p class="slast">지난 프롤로그: ${esc(storyLast(L[0]))}</p>` : ''}`;
}
function renderStory(){
  const el = $('pane-story'); if (!el) return; const C = S.camp, L = S.storyLog || [];
  let h;
  if (!C) h = `<div class="box"><p class="lab">1F 프롤로그</p><p class="note">${esc(storyIntro())}</p><p class="srec">${CAMP_S.slice(1).map(d => `${d.name} ${esc(d.kind)}`).join(' → ')}</p><div class="row"><button class="btn go" type="button" data-sh="start">▶ 프롤로그 시작</button></div></div>`;
  else { const def = CAMP_S[Math.min(5, C.s)] || {}, al = S.units.filter(u => u.side === 0), ed = mode === 'edit';
    h = `<div class="box"><p class="lab">1F 프롤로그 — ${C.end ? (C.end === 'clear' ? '끝 · 계단' : '전멸') : esc(def.name + ' · ' + def.kind)}</p>${C.end ? '' : `<p class="note">${esc(def.note || '')}</p>`}
      <div class="spty">${al.map(p => `<span class="sp1"><i style="${faceCss(faceOf(p.ref), 34)}"></i><span><b>${esc(p.name)}</b><small>${p.hpNow != null ? '피 ' + p.hpNow : '온전'}${(p.grown || []).length ? ' · ✦ ' + p.grown.length : ''}</small></span></span>`).join('')}</div>
      ${C.fallen.length ? `<p class="srec">쓰러진 이: ${esc(C.fallen.join(' · '))}</p>` : ''}${C.lost.length ? `<p class="srec">버린 이: ${esc(C.lost.join(' · '))}</p>` : ''}${(C.log || []).length ? `<p class="srec">지나온 길: ${esc(C.log.map(l => (CAMP_S[l.s] || {}).name || l.s + 'S').join(' → '))}</p>` : ''}
      <div class="row">${ed && !C.end ? '<button class="btn go" type="button" data-sh="go">▶ 이 맵 시작</button>' : ''}<button class="btn" type="button" data-sh="log">로그 복사</button><button class="btn warn" type="button" data-sh="quit">${C.end ? '끝내기' : '그만두기'}</button></div></div>`; }
  if (L.length) h += `<div class="box"><p class="lab">지난 프롤로그</p>${L.map(r => `<p class="srec">${new Date(r.t).toLocaleDateString('ko-KR')} · ${esc(storyLast(r))}</p>`).join('')}</div>`;
  el.innerHTML = h;
}
$('modeSeg').addEventListener('click', e => { const b = e.target.closest('[data-mode]'); if (b) setMode(b.dataset.mode); });
document.addEventListener('click', e => { const b = e.target.closest('[data-sh]'); if (!b) return; const k = b.dataset.sh;
  if (k === 'start'){ if (S.mode !== 'story' && !setMode('story')) return; if (S.camp && !S.camp.end){ toast('진행 중인 프롤로그가 있어요'); return; } campStart(); return; }
  if (k === 'train'){ setMode('train'); return; }
  if (k === 'go'){ start(); return; }
  if (k === 'log'){ campLogCopy(); return; }
  if (k === 'quit'){ if (S.camp && (S.camp.end || confirm('프롤로그를 그만둘까요? (이 진행은 사라져요)'))) campQuit(); return; }
});
function mPickShow(){
  const C = S.camp || (S.story && S.story.camp), el = $('mPick');
  el.innerHTML = `<h3>굴의 전투판</h3><p class="gsub">어디서 시작할까요? 머리글의 📖 스토리 · 🛠 훈련장으로 언제든 바꿀 수 있어요.</p>
    <div class="mcards"><button type="button" class="mcard" data-mp="story"><b>📖 스토리</b>1F 프롤로그 — 굴에 떨어진 인주와 동료들. S 다섯을 지나 관 속의 왕까지.${C && !C.end ? `<em>이어서 — 1F · ${esc((CAMP_S[Math.min(5, C.s)] || {}).name || '')}</em>` : ''}</button>
    <button type="button" class="mcard" data-mp="train"><b>🛠 훈련장</b>도감 인물을 마음대로 놓고 싸워 보는 곳 — 배치 · 층 · 수치 · 특성 · 자동 돌리기.</button></div>`;
  el.hidden = false; const f = el.querySelector('.mcard'); if (f) f.focus();
}
$('mPick').addEventListener('click', e => { const b = e.target.closest('[data-mp]'); if (!b) return; $('mPick').hidden = true; $('mPick').innerHTML = ''; setMode(b.dataset.mp); });

/* ---------- 시작 ---------- */
{ const fresh = !MODE_NM[S.mode]; if (fresh) S.mode = S.camp && !S.camp.end ? 'story' : 'train'; modeNorm(); var MPICK0 = fresh && !navigator.webdriver; }   // v7.24.5 처음 열면 모드를 고름 (자동 시험은 훈련장)
""")
rep("renderDraft(); renderChips(); renderRoster(); renderDesigns(); renderFloors(); setSide(1); setTool('select'); renderRules(); renderRes(); renderHist(); renderSel(); hud(); renderLog();\n",
    "renderDraft(); renderChips(); renderRoster(); renderDesigns(); renderFloors(); setSide(1); setTool('select'); renderRules(); renderRes(); renderHist(); renderSel(); hud(); renderLog();\napplyMode(true); if (MPICK0) mPickShow();   // v7.24.5\n")
open(F, 'w', encoding='utf-8').write(s)
print('page7245 OK')
