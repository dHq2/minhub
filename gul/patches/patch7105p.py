import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    s=s.replace(a,b)
# CSS
rep("/* v5.8 가로 화면 (폰을 눕힘):","""/* v7.10.5 PC 조작 편의: 범례 접기 · 상세 패널 접기 (판이 넓어짐) · 카드 간단히 (명령 칸이 접힘 위로) · 안내 접기 · 단축키 도움말 */
.legbtn{position:absolute;left:8px;bottom:8px;z-index:6;opacity:.85}
.view.hasbar .legbtn{bottom:84px}
body.mob .legbtn,body.mob .keybtn{display:none!important}
body.nodet:not(.mob) .app{grid-template-columns:minmax(0,1fr) 430px}
body.nodet:not(.mob) .app > .detail{display:none}
body.nodet:not(.mob) .app > .boardcol{grid-column:1;grid-row:1} body.nodet:not(.mob) .app > .side{grid-column:2;grid-row:1}
body:not(.mob) .party.cmp{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}
body:not(.mob) .party.cmp .pm{min-width:0;padding:3px 6px 3px 3px;gap:5px}
body:not(.mob) .party.cmp .pm .fc{width:26px!important;height:26px!important;background-size:cover}
body:not(.mob) .party.cmp .pm .at{display:none} body:not(.mob) .party.cmp .pm .at.warn{display:block}
body:not(.mob) .party.cmp .pm .hb{width:100%}
body:not(.mob) .turninfo.fold{max-height:2.9em;overflow:hidden;cursor:pointer;position:relative;-webkit-mask-image:linear-gradient(#000 62%,transparent);mask-image:linear-gradient(#000 62%,transparent)}
body:not(.mob) .turninfo.fold button{pointer-events:auto}
.kbsheet{position:fixed;inset:0;z-index:60;background:rgba(6,5,8,.72);display:flex;align-items:center;justify-content:center;padding:16px}
.kbsheet[hidden]{display:none}
.kbsheet .kbc{background:var(--bg);color:var(--fg);border:1px solid var(--line);border-radius:12px;max-width:760px;width:100%;max-height:88vh;overflow:auto;padding:14px 18px;box-shadow:0 12px 40px rgba(0,0,0,.5)}
.kbsheet h3{margin:0 0 8px;font:800 16px var(--display)} .kbsheet h4{margin:12px 0 4px;font:700 12px var(--body);color:var(--dim);letter-spacing:.04em}
.kbsheet .kbg{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:4px 14px}
.kbsheet .kbr{display:flex;gap:7px;align-items:baseline;font-size:12.5px} .kbsheet kbd{min-width:20px;text-align:center}
/* v5.8 가로 화면 (폰을 눕힘):""")
# HTML: 머리 단추 · 범례 단추 · 체크 · 도움말
rep('<div class="legend2" id="legend1" hidden>','<button class="btn sm legbtn" id="legBtn" type="button" title="판 위의 그림 · 표시 설명 보기 / 닫기 (?)">❔ 범례</button>\n        <div class="legend2" id="legend1" hidden>')
rep('<label class="ck" for="detailAll"','<label class="ck" for="detShow" title="오른쪽 상세 패널 열기 / 접기 — 접으면 판이 넓어져요 (좁은 화면은 처음부터 접힘)"><input id="detShow" type="checkbox"> 📋 상세 열기</label>\n          <label class="ck" for="cmpShow" title="아군 카드를 둘씩 간단히 — 명령 단추가 위로 올라와요"><input id="cmpShow" type="checkbox"> ▤ 카드 간단히</label>\n          <button class="btn sm keybtn" id="keyBtn" type="button" title="단축키 보기 (?)">⌨ 단축키</button>\n          <label class="ck" for="detailAll"')
rep("      <div class=\"pane\" id=\"pane-fight\" hidden>","      <div class=\"pane\" id=\"pane-fight\" hidden>")
rep("</footer>","</footer>\n  <div class=\"kbsheet\" id=\"kbsheet\" hidden role=\"dialog\" aria-label=\"단축키\"><div class=\"kbc\" id=\"kbc\"></div></div>")
# 범례 보임
rep("  $('legend2').hidden = ed || Wd.over || mode !== 'plan' || !detail();\n  $('legend1').hidden = ed || Wd.over || mode !== 'plan' || detail();","  const legOff = !MOB && !S.pcLeg;   // v7.10.5 PC 는 범례를 눌러서 (기본 접힘)\n  $('legend2').hidden = ed || Wd.over || mode !== 'plan' || !detail() || legOff;\n  $('legend1').hidden = ed || Wd.over || mode !== 'plan' || detail() || legOff;\n  $('legBtn').hidden = ed || MOB || mode !== 'plan' || Wd.over; $('legBtn').classList.toggle('on', !!S.pcLeg);")
# JS
rep("$('netShow').checked = S.showNet !== false;","""// v7.10.5 PC 조작 편의
const cmpOn = () => S.pcCmp != null ? !!S.pcCmp : true, detOn = () => S.pcDet != null ? !!S.pcDet : window.innerWidth >= 1500;
function applyPc(){ document.body.classList.toggle('nodet', !detOn()); $('detShow').checked = detOn(); $('cmpShow').checked = cmpOn(); $('party').classList.toggle('cmp', cmpOn()); }
applyPc(); window.addEventListener('resize', () => { if (S.pcDet == null) applyPc(); });
$('detShow').addEventListener('change', () => { S.pcDet = $('detShow').checked; save(); applyPc(); });
$('cmpShow').addEventListener('change', () => { S.pcCmp = $('cmpShow').checked; save(); applyPc(); });
$('legBtn').addEventListener('click', () => { S.pcLeg = !S.pcLeg; save(); hud(); });
$('turnInfo').addEventListener('click', e => { if (e.target.closest('button, a')) return; $('turnInfo').classList.toggle('fold'); S.pcFold = !$('turnInfo').classList.contains('fold'); });
const KB_GROUPS = [['고르기', [['1 ~ 9', '아군 고르기 (고른 뒤엔 1 ~ 5 = 기술 칸)'], ['Shift + 클릭', '더하기'], ['Ctrl + A', '모두 고르기'], ['끌기', '네모로 여럿'], ['판 빈 곳 클릭', '고르기 풀기']]],
  ['판에서', [['왼쪽 클릭', '적 = 공격'], ['오른쪽 클릭', '이동 (가서 지킴)'], ['A → 바닥', '공격 이동'], ['휠 · + −', '확대 · 축소']]],
  ['기술 · 행동', [['1 ~ 5', '기술 칸 (색 테두리 = 특수 스킬)'], ['Q', '약 · 응급처치'], ['F', '돌진 · 도약'], ['R', '투창'], ['E', '줍기'], ['V', '휘두르기 모드'], ['B', '막기 모드'], ['T', '횃불 켜고 끔'], ['Shift + T', '횃불 내려놓기'], ['I', '횃불 던지기']]],
  ['명령', [['G', '자동 · 따라감'], ['H', '제자리'], ['Y', '정찰'], ['U', '암살'], ['J', '견제사격'], ['O', '사주경계'], ['Z', '은신'], ['N', '측면 기동'], ['L', '전열'], ['K', '전열 후퇴'], ['X · Backspace', '명령 취소']]],
  ['진행', [['Space', '재생 · 멈춤'], ['Enter', '한 턴만'], ['?', '이 창 열기 · 닫기'], ['Esc', '고르는 중인 것 취소 · 창 닫기']]]];
function kbOpen(on){ const el = $('kbsheet'); if (on === undefined) on = el.hidden; if (on) $('kbc').innerHTML = '<h3>⌨ 단축키 <small style="font:500 11px var(--body);color:var(--dim)">(? 또는 Esc 로 닫기)</small></h3>' + KB_GROUPS.map(([t, rows]) => `<h4>${t}</h4><div class="kbg">${rows.map(([k, v]) => `<div class="kbr"><kbd>${esc(k)}</kbd><span>${esc(v)}</span></div>`).join('')}</div>`).join(''); el.hidden = !on; }
$('keyBtn').addEventListener('click', () => kbOpen());
$('kbsheet').addEventListener('click', e => { if (e.target === $('kbsheet')) kbOpen(false); });
$('netShow').checked = S.showNet !== false;""")
# 키: ? 와 Esc
rep("  const k = e.key.toLowerCase();\n  if (k === ' '){","  const k = e.key.toLowerCase();\n  if (k === '?' || (k === '/' && e.shiftKey)){ e.preventDefault(); kbOpen(); return; }   // v7.10.5\n  if (k === 'escape' && !$('kbsheet').hidden){ kbOpen(false); return; }\n  if (k === ' '){")
# 안내 접기: 처음엔 펼침, 첫 판 진행 뒤 접음
rep("  if (ti2 !== lastTI){ lastTI = ti2; $('turnInfo').innerHTML = ti2; }","  if (ti2 !== lastTI){ lastTI = ti2; $('turnInfo').innerHTML = ti2; }\n  { const ti3 = $('turnInfo'); if (!MOB && !ed && Wd.turn >= 1 && !S.pcFold && !ti3.dataset.fd){ ti3.dataset.fd = '1'; ti3.classList.add('fold'); } }   // v7.10.5 두 번째 턴부터 안내는 두 줄로 (눌러 펼침)")
# 버전
rep("<!-- 굴의 전투판 v7.10.4 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v7.10.5 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v7.10.5: PC 조작 편의 — ① 범례는 '❔ 범례' 단추로 (기본 접힘 — 판을 가리던 것) ② 📋 상세 패널 접기 (1500px 아래는 처음부터 접힘 — 판이 520 → 800px 로 넓어짐) ③ ▤ 아군 카드 간단히 (둘씩 · 명령 단추가 접힘 위로) ④ 턴 안내는 두 번째 턴부터 두 줄로 (눌러 펼침) ⑤ ⌨ 단축키 도움말 (? 키 · 단추) — 모든 단축키를 한 창에. 설정은 이 브라우저에 기억.\n")
rep("바뀐 것은 머리 주석 (소스 보기) 의 버전 기록에 — v7.10.4","바뀐 것은 머리 주석 (소스 보기) 의 버전 기록에 — v7.10.5 PC 조작 편의 / v7.10.4")
rep(">v7.10.4 · 특수 스킬 강조 · 야시 D</span>",">v7.10.5 · PC 조작 편의 · 특수 스킬 강조</span>")
rep('h1::after{content:" v7.10.4"','h1::after{content:" v7.10.5"')
rep("<footer>굴의 전투판 v7.10.4","<footer>굴의 전투판 v7.10.5")
rep("return `굴의 전투판 v7.10.4 · ${title}","return `굴의 전투판 v7.10.5 · ${title}")
rep("copyText('굴의 전투판 v7.10.4 자동 판 기록","copyText('굴의 전투판 v7.10.5 자동 판 기록")
open(f,'w').write(s); print('ok')
