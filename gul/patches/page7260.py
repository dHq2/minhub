# v7.26.0 페이지 — page7260.py v1.4 (v1.4: PC 캠페인 띠를 왼쪽 위로 (오른쪽 위 상태 글자와 겹침 없음) / v1.3: PC 캠페인 띠가 이야기 상자를 덮던 것 → 상자를 띠 아래로 / v1.2: 들어설 때 소파의 오딜 그림을 가운데 장면 그림 (cg) 으로 — 흐리게 늘어나던 배경 대신 · 양쪽 인물 비움 / v1.1: 차 · 쉬기 · 레베카 회복이 소수로 찍히던 것 → 정수 / 오딜의 방 — 비전투 · 쉼 · 이야기 · 인연 · 분리된 차원 / 3S 랜덤 인카운터의 하나 (몫 1) /
#   16 × 12 작은 방 (위아래 문) · 도감 가구 스프라이트 21점 (낡은 붉은 소파 · 티 테이블 · 찻잔 협탁 · 스탠드 · 책장 · 그릇 진열장 · 장식장 · 칸막이 · 가면과 장미 · 검은 고양이 …) ·
#   희미하지만 아늑한 빛 / 들어서면 "어머나." · 말을 건다 · 조용히 쉬고 간다 · 방을 나간다 · 공격한다 / 차를 받는다 (조금 회복 · 한 번) · 차 두 잔 가져가기 (무료 · 그 방문에 다시 생기지 않음) ·
#   쉬기 (대화 없이) / 동료 자율 (인물마다 가중치 — 카리우스는 서 있음 · 탕아는 앉음 · 청광묵은 돌아다님 · 레베카는 구경하다 먼저 인사) · 반쯤만 움직임 · 물건을 챙기거나 공격하지 않음 /
#   레베카 · 카리우스 (만듦새 · 광대) · 탕아 전용 장면 / 인연 (판마다 한 번 셈): 1 무관심 · 2 알아봄 · 3 개인적인 질문 → 장미장식 <축복:오딜> (공격 × 1.1 · 회피 +10%) · 4~ 익숙함 /
#   죽일 수 있음 (도감 C-027 · 1성) — 그 뒤로는 소파 위의 시신 · 인연 멈춤 · 저주 없음 / 대화 뒤 장면 그림 (방 · 붉은 소파))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7254.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.25.4 (2026-10-18)', '<!-- 굴의 전투판 v7.26.0 (2026-10-18)')
rep('     v7.25.4: ', '''     v7.26.0: 오딜의 방 — 3S 랜덤 인카운터의 하나 (싸우지 않는 쉼 · 이야기 · 인연). 작은 방 (분리된 차원) 을 도감 가구로 꾸밈. 들어서면 "어머나." —
         말을 건다 · 조용히 쉬고 간다 · 방을 나간다 · 공격한다. 차를 받으면 모두 조금 회복 · 차 두 잔은 무료로 가져감 (다음 맵부터 지님).
         동료는 알아서 구경 · 서성 · 앉음 (레베카는 먼저 인사 · 카리우스 · 탕아 전용 장면). 판마다 한 번 만남을 셈 — 세 번째에 장미장식 <축복:오딜>
         (공격 × 1.1 · 회피 +10%). 죽일 수 있고, 그 뒤로는 소파 위에 시신으로 남음 (인연 멈춤 · 저주 없음).
     v7.25.4: ''')
rep('h1::after{content:" v7.25.4"', 'h1::after{content:" v7.26.0"')
rep('<footer>굴의 전투판 v7.25.4', '<footer>굴의 전투판 v7.26.0')
rep('return `굴의 전투판 v7.25.4 · ${title}', 'return `굴의 전투판 v7.26.0 · ${title}')
rep("copyText('굴의 전투판 v7.25.4 자동 판 기록", "copyText('굴의 전투판 v7.26.0 자동 판 기록")
rep('의 버전 기록에 — v7.25.4 대화 화면 (양 끝 큰 그림 · 가로 띠)', '의 버전 기록에 — v7.26.0 오딜의 방 / v7.25.4 대화 화면 (양 끝 큰 그림 · 가로 띠)')
rep('">v7.25.4 · 대화 화면 · 양 끝 그림</span>', '">v7.26.0 · 오딜의 방</span>')
rep("ver: '7.25.4', kind: '1F 여정 기록'", "ver: '7.26.0', kind: '1F 여정 기록'")
rep("o.push('굴의 전투판 v7.25.4 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v7.26.0 — 1F 프롤로그 여정 기록'")
rep("RULES_MIG = '7.25.2'", "RULES_MIG = '7.26.0'")   # 새 칸 bless
rep("  '축복:바다': ", "  '축복:오딜': '오딜의 축복 (장미장식) — 공격 × 1.1 · 회피 +10%p (오딜과 세 번째 만남에 받음 · 도감의 \"공격력 +100 · 회피율 +10%\" 를 이 판의 크기로)',\n  '축복:바다': ")

# ---------- CSS ----------
rep("/* v7.25.3 맵을 넘어갈 때 — 나레이션 · 로딩 */\n", """/* v7.26.0 대화 뒤 장면 그림 (오딜의 방) */
.talk.tk-bgi{background-size:cover;background-position:center 30%}
/* v7.26.0 PC: 캠페인 띠는 왼쪽 위 (오른쪽 위 상태 글자와 겹치지 않게) · 이야기 상자는 그 아래 (campNarrTop) */
body:not(.mob) .campbar{left:8px;transform:none;max-width:calc(100% - 350px)}
/* v7.25.3 맵을 넘어갈 때 — 나레이션 · 로딩 */
""")

# ---------- 판 상태 (방) ----------
rep("const BOARD_K = ['type', 'W', 'H', 'mapC', 'randStart', 'startK',", "const BOARD_K = ['type', 'W', 'H', 'mapC', 'randStart', 'startK', 'room',")
rep("const boardSet = B => Object.assign(S, { startK: null,", "const boardSet = B => Object.assign(S, { startK: null, room: false,")
rep("S.indoor = false; S.hall = false; S.startK = null;", "S.indoor = false; S.hall = false; S.startK = null; S.room = false;")

# ---------- 만남 · 인물 · 대화 ----------
rep("{ k: 'lost', name: '당신들을 따라온 누군가', w: 1.5, npc: 'lost' }];", "{ k: 'lost', name: '당신들을 따라온 누군가', w: 1.5, npc: 'lost' }, { k: 'odile', name: '오딜의 방', w: 1, npc: 'odile' }];   /* v7.26.0 */")
rep("} };   /* v7.22.4 버린 아군 (얼굴 · 이름은 그 사람) */",
    "} };   /* v7.22.4 버린 아군 (얼굴 · 이름은 그 사람) */\n"
    "NPC.odile = { key: '오딜', ref: 'C-027', who: '가면을 쓴 여자', x: 8, y: 3.35, img: 'odile_t1', st0: 'od', fromRef: true, talkR: 13, node: E => odNode(E), foeLine: '그녀는 찻잔을 내려놓는다. 아무 말도 하지 않는다.',   /* v7.26.0 오딜의 방 */\n"
    "  map: { W: 16, H: 12, amb: 0.5, room: true, water: [], torches: [], piles: [] }, seen: null };")
rep("{ go: '!foe2' }] } };   /* v7.22.2 */",
    "{ go: '!foe2' }] } };   /* v7.22.2 */\n"
    "TALK.odile = { cur: [], more: [], q3a: [{ t: '그래. 다들 그렇게 말하더라.', img: 'odile_t5' }, { go: '!ogift' }], q3b: [{ t: '솔직하네. 그게 나아.', img: 'odile_t5' }, { go: '!ogift' }] };   /* v7.26.0 (cur · more 는 그때그때) */")
rep("const ENC_LIVE = ['sleep', 'awake', 'sit', 'greeted', 'declined', 'shop', 'smoke', 'rise'];", "const ENC_LIVE = ['sleep', 'awake', 'sit', 'greeted', 'declined', 'shop', 'smoke', 'rise', 'od'];   /* v7.26.0 od = 오딜 (방) */")
rep("const encNear = () => !!world && !world.over && encAll().some(E => encLive(E) && E.seen && encDist(world, E) <= 6);",
    "const encNear = () => !!world && !world.over && encAll().some(E => encLive(E) && E.seen && encDist(world, E) <= (NPC[E.npc].talkR || 6));   /* v7.26.0 방은 어디서든 */")
rep("const lb = (E.seen && encDist(Wd, E) <= 6 ? '💬 ' : '') + N.who", "const lb = (E.seen && encDist(Wd, E) <= (N.talkR || 6) ? '💬 ' : '') + (E.known ? N.key : N.who)")
rep("known = !!E && (E.st === 'joined' || E.st === 'foe');", "known = !!E && (E.st === 'joined' || E.st === 'foe' || !!E.known);")
rep("ally ? ally.name : N ? (known ? N.key : N.who)", "ally ? (L.name || ally.name) : N ? (known ? N.key : N.who)")
rep("function encMake(E, side){ const N = NPC[E.npc], p = E.p ? { ...clone(E.p), id: uid(), side, x: E.x, y: E.y } : { ...fromDesign(designByKey(N.key), side), x: E.x, y: E.y };",
    "function encMake(E, side){ const N = NPC[E.npc], p = E.p ? { ...clone(E.p), id: uid(), side, x: E.x, y: E.y } : N.fromRef ? { ...unitFromRef(N.ref, side, {}), id: uid(), x: E.x, y: E.y } : { ...fromDesign(designByKey(N.key), side), x: E.x, y: E.y };   /* v7.26.0 fromRef = 도감 그대로 (오딜) */")
rep("  if (a === '!foe2'){ talkClose(); encFoe(E); return; }",
    "  if (a === '!foe2'){ talkClose(); if (E && E.npc === 'odile'){ E.x = OD.stand.x; E.y = OD.stand.y; } encFoe(E); return; }   /* v7.26.0 오딜은 소파에서 일어남 */\n"
    "  if (a === '!otea'){ odTea(E); return; } if (a === '!orest'){ talkClose(); odRest(); return; } if (a === '!oleave'){ talkClose(); odLeave(); return; }   /* v7.26.0 오딜의 방 */\n"
    "  if (a === '!oask'){ TK.lines = [odTalkAsk(E)]; TK.i = 0; talkShow(); return; } if (a === '!obless'){ talkClose(); odBless(); return; }\n"
    "  if (a === '!ogift'){ TK.lines = [{ narr: '(그녀가 머리에서 장미 장식을 하나 떼어 내민다.)', img: 'odile_t4' }, { t: '가져가. 별건 아니야.', img: 'odile_t1' }, { box: '<축복:오딜> — 오딜의 장미장식' }, { go: '!obless' }]; TK.i = 0; talkShow(); return; }")
rep("  tkSlot('L', Lr, Li); tkSlot('R', Rr, Ri);", "  if (L.cg){ Lr = Li = Rr = Ri = null; sp = ''; }   /* v7.26.0 가운데 장면 그림 — 양쪽 인물 비움 */\n  tkSlot('L', Lr, Li); tkSlot('R', Rr, Ri);")
# 대화 뒤 장면 그림 (TK.bg — 줄의 bg 가 바꿈 · 오딜과 말할 땐 방)
rep("  $('tkCh').innerHTML = ''; $('tkNx').hidden = true;\n",
    "  if (L.bg) TK.bg = L.bg; else if (!TK.bg && TK.npc === 'odile') TK.bg = 'bg_room'; const T0 = $('talk'); T0.classList.toggle('tk-bgi', !!TK.bg || !!L.cg);   /* v7.26.0 장면 그림 (TK.bg = 뒤 배경 · L.cg = 그 줄에만 가운데 큰 그림 — 양쪽 인물은 비움) */\n"
    "  T0.style.backgroundImage = L.cg ? `linear-gradient(to top,rgba(6,5,8,.97) 0%,rgba(6,5,8,.9) 24%,rgba(6,5,8,0) 40%),url(art/room/${L.cg}.webp),linear-gradient(rgba(6,5,8,.8),rgba(6,5,8,.8))${TK.bg ? `,url(art/room/${TK.bg}.webp)` : ''}` : TK.bg ? `linear-gradient(to top,rgba(6,5,8,.95) 0%,rgba(6,5,8,.66) 42%,rgba(6,5,8,.5) 100%),url(art/room/${TK.bg}.webp)` : '';\n"
    "  T0.style.backgroundSize = L.cg ? 'auto,auto 64%,auto,cover' : ''; T0.style.backgroundPosition = L.cg ? '0 0,center 6%,0 0,center 30%' : ''; T0.style.backgroundRepeat = L.cg ? 'no-repeat' : '';\n"
    "  $('tkCh').innerHTML = ''; $('tkNx').hidden = true;\n")
rep("function talkClose(){ if (!TK) return; clearInterval(TK.timer); const pv = TK.prev; TK = null; $('talk').hidden = true;",
    "function talkClose(){ if (!TK) return; clearInterval(TK.timer); const pv = TK.prev; TK = null; $('talk').hidden = true; $('talk').style.backgroundImage = ''; $('talk').style.backgroundSize = $('talk').style.backgroundPosition = $('talk').style.backgroundRepeat = ''; $('talk').classList.remove('tk-bgi');")

# ---------- 프롤로그 시작: 축복을 지님 ----------
rep("  const party = [{ ...fromDesign(designByKey('인주'), 0), hero: true }",
    "  const party = [{ ...fromDesign(designByKey('인주'), 0), hero: true, ...((S.odile || {}).blessed ? { traits: [...new Set([...(fromDesign(designByKey('인주'), 0).traits || []), '축복:오딜'])] } : {}) }")   # v7.26.0 장미장식

# ---------- 맵 만들기 ----------
rep("  if (!HL) S.holdClear = false;",
    "  S.room = !!(NP && NP.map.room); if (S.room) Object.assign(S, { flips: odFlips(), piles: odPiles(), torches: [], hills: [], indoor: true, zones: [], sandY: null });   /* v7.26.0 오딜의 방 (벽 · 가구 칸) */\n"
    "  if (S.room && st.enc && !st.enc.entered) st.enc.seen = true;   // 들어설 때 나레이션은 odEnter 가\n"
    "  if (!HL) S.holdClear = false;")
rep("  if (HL && world && world.explored) world.explored.fill(2);", "  if ((HL || S.room) && world && world.explored) world.explored.fill(2);   /* v7.26.0 방도 한눈에 */")
rep("  jrIn(C, s, from, st, E3, bt);   /* v7.25.3 여정 기록 */", "  jrIn(C, s, from, st, E3, bt);   /* v7.25.3 여정 기록 */\n  if (S.room && st.enc) ldAfter(() => odEnter(st.enc), 420);   /* v7.26.0 오딜의 방에 들어섬 */")
rep("if (Wd && mode !== 'edit' && Wd.camp){ encTick(Wd); khTick(Wd); czEvTick(Wd); }", "if (Wd && mode !== 'edit' && Wd.camp){ encTick(Wd); khTick(Wd); czEvTick(Wd); odTick(Wd); }   /* v7.26.0 오딜의 방 */")

# ---------- 그리기 ----------
rep("    if (S.hall){ hallCell(g, x, y, P, R); continue; }", "    if (S.room){ roomCell(g, x, y, P, R); continue; }   /* v7.26.0 오딜의 방: 마루 · 벽지 */\n    if (S.hall){ hallCell(g, x, y, P, R); continue; }")
rep("  if (S.hall) hallDeco(g, P);   // v7.25.0", "  if (S.hall) hallDeco(g, P);   // v7.25.0\n  if (S.room) roomDeco(g, P);   /* v7.26.0 융단 · 문틀 */")
rep("  if (m.piles && !S.hall) for", "  if (m.piles && !S.hall && !S.room) for")
rep("indoor && !S.hall", "indoor && !S.hall && !S.room", 2)
rep("  if (S.camp && S.camp.s === 5 && Wd.camp) drawHall(Wd, ox, oy, ts);", "  if (S.camp && S.camp.s === 5 && Wd.camp) drawHall(Wd, ox, oy, ts);\n  if (S.room && Wd.camp) drawRoomProps(Wd, ox, oy, ts);   /* v7.26.0 가구 · 시신 */")
rep("  if (S.hall) drawHallLight(Wd, ox, oy, ts);", "  if (S.room) drawRoomLight(Wd, ox, oy, ts);   /* v7.26.0 스탠드 · 촛불 */\n  if (S.hall) drawHallLight(Wd, ox, oy, ts);")

# ---------- 캠페인 띠 · 전리품 창 ----------
rep("  if (C.s === 5 && W){ const E = ((C.stages || {})[5] || {}).cz;",
    "  if (C.s === 3 && W && S.room){ const E = encCur(), O = odS(); if (E && E.npc === 'odile' && !O.dead && E.st === 'od'){ const left = 2 - (E.teaTaken || []).filter(Boolean).length; h = h.replace('<span class=\"cb\">', `<span class=\"cb\">${left > 0 ? `<button class=\"btn sm\" type=\"button\" data-otea=\"1\" title=\"오딜의 차 — 무료 두 잔 (이번 방문)\">🍵 차 ${left}</button>` : ''}${!E.rested ? '<button class=\"btn sm\" type=\"button\" data-orest=\"1\" title=\"대화 없이 잠시 쉬어 감 (체력 조금)\">🛋 쉬기</button>' : ''}`); } }   /* v7.26.0 */\n"
    "  if (C.s === 5 && W){ const E = ((C.stages || {})[5] || {}).cz;")
rep("  if (b.dataset.ccoffin){ czOpenCoffin(); return; }", "  if (b.dataset.otea){ odTeaOpen(); return; } if (b.dataset.orest){ odRest(); return; }   /* v7.26.0 */\n  if (b.dataset.ccoffin){ czOpenCoffin(); return; }")
rep("  const g = e.target.closest('[data-lgive]'); if (g && world){",
    "  { const ot = e.target.closest('[data-otake]'); if (ot){ odTake(+ot.dataset.otake, ot.dataset.lp); return; } if (e.target.closest('[data-oclose]')){ $('banner').hidden = true; campBarRender(true); return; } }   /* v7.26.0 오딜의 차 */\n"
    "  const g = e.target.closest('[data-lgive]'); if (g && world){")

# ---------- 기록 · 이야기 ----------
rep("    case 'campIn': return { c: 'dim', s: `1F · ${e.name} — ${e.kind}.` };",
    "    case 'odAct': return { c: 'dim', s: e.s };   /* v7.26.0 오딜의 방 */\n"
    "    case 'odTea': return { c: 'good', s: '오딜이 건넨 차로 몸이 조금 데워진다.' };\n"
    "    case 'odRest': return { c: 'good', s: '낡은 의자에서 잠시 숨을 고른다.' };\n"
    "    case 'odBless': return { c: 'good', s: '오딜이 장미장식을 건넨다 — <축복:오딜>.' };\n"
    "    case 'odDead': return { c: 'bad', s: '가면을 쓴 여자가 소파 곁에 쓰러진다. 찻잔이 바닥을 구른다.' };\n"
    "    case 'odMeet': case 'odTake': return null;\n"
    "    case 'campIn': return { c: 'dim', s: `1F · ${e.name} — ${e.kind}.` };")
rep("      case 'campIn': out.push(",
    "      case 'odAct': out.push(`${T(e)}🫖 ${e.s}`); break;   /* v7.26.0 오딜의 방 */\n"
    "      case 'odMeet': out.push(`${T(e)}🫖 오딜과의 만남 ${e.n}번째${e.n === 3 ? ' — 장미장식을 줄 때' : ''}`); break;\n"
    "      case 'odTea': out.push(`${T(e)}🍵 오딜의 차를 받음 — ${(e.who || []).join(' · ') || '다친 이 없음'}`); break;\n"
    "      case 'odRest': out.push(`${T(e)}🛋 조용히 쉼 — ${(e.who || []).join(' · ') || '다친 이 없음'}`); break;\n"
    "      case 'odTake': out.push(`${T(e)}🍵 오딜의 차 한 잔 → ${e.to} 가방 (다음 맵부터)`); break;\n"
    "      case 'odBless': out.push(`${T(e)}🌹 <축복:오딜> — 장미장식 · 인주 (공격 × 1.1 · 회피 +10%)`); break;\n"
    "      case 'odDead': out.push(`${T(e)}✝ 오딜이 죽음 — 다음 방문부터 소파 위의 시신 · 인연 멈춤`); break;\n"
    "      case 'campIn': out.push(")

# ---------- 인카운터 목록 ----------
rep(", ['오딜의 방', B('plan', '예정'), '— (v7.26.0)', '—', '쉼 · 이야기 · 인연 (싸우지 않음)', '']];", "];")
a0 = s.index("  h += `<div class=\"box\"><p class=\"lab\">오딜의 방 ${B('plan', '예정 v7.26.0')}</p>"); a1 = s.index("\n", a0) + 1
rep(s[a0:a1], "")
rep("  for (const e of ENC3.filter(q => q.npc)){ const N = NPC[e.npc], Dc = ENC_DOC[e.k] || {}, ppl = [N, ...(e.more || []).map(k => NPC[k])].filter(Boolean);\n",
    "  for (const e of ENC3.filter(q => q.npc)){ if (e.k === 'odile'){ h += odDocBox(B, tryB); continue; }   /* v7.26.0 */ const N = NPC[e.npc], Dc = ENC_DOC[e.k] || {}, ppl = [N, ...(e.more || []).map(k => NPC[k])].filter(Boolean);\n")
rep("  lost: { what: '버린 동료가 기적적으로 따라잡음',", "  odile: { end: '쉼 · 차 · 인연 (축복) · 싸움 (죽이면 시신으로 남음)' },\n  lost: { what: '버린 동료가 기적적으로 따라잡음',")

# ---------- 오딜의 방: 본체 ----------
rep("function renderTraitsTab(){\n", r"""// v7.26.0 오딜의 방 — 분리된 차원의 작은 방. 오딜은 낡은 소파에서 차를 마심 · 먼저 다가오지 않음. 플레이어 · 오딜 · 동료의 세 흐름이 함께 감
const OD = { W: 16, H: 12, doors: [7, 8], stand: { x: 8, y: 4.5 }, greet: { x: 9.4, y: 4.6 } };
const OD_PROPS = [   // [도감 그림, 아래 가운데 x, y (칸), 너비 (칸), 막는 칸, 이름]
  ['H-042', 2.0, 2.95, 2.0, [[1, 1], [2, 1], [1, 2], [2, 2]], '책장'], ['H-094', 4.5, 2.95, 1.35, [[4, 1], [4, 2]], '그릇 진열장'],
  ['H-217', 12.0, 2.95, 2.9, [[11, 1], [12, 1], [11, 2], [12, 2]], '꽃병과 촛대를 올린 장식장'], ['H-221', 14.3, 2.75, 0.75, [[14, 2]], '리본 촛대'],
  ['H-229', 5.6, 1.2, 0.85, [], '꽃 액자'], ['H-226', 10.4, 1.2, 0.85, [], '나비 표본 액자'],
  ['H-212', 8.0, 4.15, 3.8, [[6, 3], [7, 3], [8, 3], [9, 3]], '낡은 붉은 소파'], ['H-223', 8.0, 6.15, 1.9, [[7, 5], [8, 5]], '티 테이블'],
  ['H-213', 5.5, 6.0, 1.35, [[5, 5]], '붉은 안락의자'], ['H-142', 10.5, 6.0, 1.45, [[10, 5]], '고딕 안락의자'], ['H-214', 12.7, 5.05, 1.0, [[12, 4]], '찻잔 협탁'],
  ['H-222', 1.6, 5.3, 1.0, [[1, 4]], '붉은 갓 스탠드'], ['H-186', 14.4, 6.6, 0.8, [[14, 5]], '술 달린 스탠드'], ['H-095', 1.9, 9.3, 1.9, [[1, 8], [2, 8]], '접이 칸막이'],
  ['H-228', 8.0, 8.95, 1.9, [[7, 8], [8, 8]], '둥근 오토만'], ['H-216', 5.6, 8.9, 0.8, [[5, 8]], '붉은 쿠션 스툴'], ['H-231', 14.2, 8.85, 1.1, [[14, 8]], '붉은 책 더미'],
  ['H-238', 3.6, 10.95, 2.1, [[3, 10], [4, 10]], '쿠션 더미'], ['H-175', 13.3, 10.85, 2.1, [[12, 10], [13, 10]], '가면과 장미 더미'], ['H-237', 10.4, 10.9, 0.85, [[10, 10]], '가면 받침'],
  ['H-309', 11.3, 9.35, 0.75, [], '검은 고양이']];
const OD_SEAT = [[5.5, 6.7, '붉은 안락의자'], [10.5, 6.7, '고딕 안락의자'], [8.0, 9.65, '둥근 오토만'], [5.6, 9.6, '쿠션 스툴'], [3.7, 9.7, '쿠션 더미']];
const OD_LOOK = [[2.0, 3.6, '책장'], [4.5, 3.6, '그릇 진열장'], [12.0, 3.6, '장식장'], [3.0, 8.5, '접이 칸막이'], [13.2, 9.6, '가면과 장미 더미'], [11.8, 9.9, '검은 고양이'], [14.0, 7.6, '술 달린 스탠드'], [6.0, 2.0, '꽃 액자'], [10.4, 2.0, '나비 표본 액자'], [14.2, 9.6, '붉은 책 더미'], [12.7, 3.8, '찻잔 협탁']];
const OD_W0 = { stand: 2, sit: 2, look: 2.5, wander: 1.5, mate: 1 }, OD_W = { 레베카: { look: 3, wander: 2, stand: 1, sit: 1, mate: 0.5 }, 카리우스: { stand: 7, look: 1, sit: 0, wander: 0, mate: 0 }, 탕아: { sit: 7, look: 1, stand: 1, wander: 0, mate: 0 }, 청광묵: { wander: 5, look: 4, stand: 0.5, sit: 0.3, mate: 1 }, 인주: { stand: 3, look: 2, sit: 2, wander: 0.5, mate: 0.5 } };
const OD_TEA = { k: 'potion', name: '오딜의 차', label: '', heal: 0.15, min: 8, cap: 30 };   // 마시면 최대 체력 15% (8 ~ 30) — 회복약보다 적게
const odS = () => S.odile || (S.odile = { met: 0, dead: false, blessed: false, lastRun: null });   // 판 (캠페인) 을 넘어 남는 인연
const odFlips = () => { const f = []; for (let y = 0; y < OD.H; y++) for (let x = 0; x < OD.W; x++){ const edge = x === 0 || y === 0 || x === OD.W - 1 || y === OD.H - 1, door = (y === 0 || y === OD.H - 1) && OD.doors.includes(x); if (edge && !door) f.push(x + ',' + y); } return f; };
const odPiles = () => OD_PROPS.flatMap(p => p[4].map(([x, y]) => `${x},${y},1`));
const pickW = Wt => { let r = Math.random() * Object.values(Wt).reduce((a, b) => a + b, 0); for (const k in Wt){ r -= Wt[k]; if (r <= 0) return k; } return Object.keys(Wt)[0]; };
// 들어섬 — 만남을 셈 (판마다 한 번) · 인연 단계에 따라 첫마디
function odEnter(E){
  const Wd = world, C = S.camp, O = odS(); if (!E || !Wd || !C) return;
  E.seen = true; E.teaTaken = E.teaTaken || [null, null];
  if (!O.dead && O.lastRun !== C.t0){ O.lastRun = C.t0; O.met = (O.met || 0) + 1; logEv(Wd, { k: 'odMeet', n: O.met }); }
  if (O.dead) E.st = 'dead'; else if (O.met >= 2) E.known = true;
  E.t0 = Wd.t; E.scnK = !O.dead && Math.random() < 0.55 ? Wd.t + 10 + Math.random() * 15 : -1; E.scnT = !O.dead && Math.random() < 0.6 ? Wd.t + 12 + Math.random() * 18 : -1; E.entered = true;
  save(); campBarRender(true); talkLines(odEnterLines(E), 'odile', E);
}
function odEnterLines(E){
  const O = odS(), m = O.met;
  if (O.dead) return [{ narr: '문을 지나자 작고 어두운 방이 나온다.', bg: 'bg_room' }, { narr: '낡은 소파 위에 가면을 쓴 여자가 쓰러져 있다. 찻잔은 식은 지 오래다.' }, { narr: '방도, 가구도 그대로다. 그녀만 더는 차를 마시지 않는다.' }];
  const head = m <= 1 ? [{ narr: '문을 지나자 작고 어두운 방이 나온다.', cg: 'bg_enc', bg: 'bg_room' }, { narr: '낡은 소파에 가면을 쓴 여자가 앉아 있다. 그녀 앞에는 차가 놓여 있다.', cg: 'bg_enc' }, { t: '어머나.', img: 'odile_t5' }, { narr: '(그녀는 아무 말 없이, 당신을 응시합니다.)', img: 'odile_t1' }]
    : m === 2 ? [{ narr: '문을 지나자 그 작은 방이 나온다. 차 향이 그대로다.', cg: 'bg_enc', bg: 'bg_room' }, { t: '...또 왔네.', img: 'odile_t4' }, { narr: '(그녀가 당신을 알아본다. 찻잔은 내려놓지 않는다.)', img: 'odile_t3' }]
    : m === 3 ? [{ narr: '익숙한 문. 작은 방.', cg: 'bg_enc', bg: 'bg_room' }, { t: '어서 와. 이번엔 조금 덜 죽어 있네.', img: 'odile_t5' }]
    : [{ narr: '작은 방. 그녀는 오늘도 차를 마시고 있다.', cg: 'bg_enc', bg: 'bg_room' }, { t: '왔어?', img: 'odile_t3' }, { narr: '(찻잔 하나를 더 꺼내 놓는다.)', img: 'odile_t1' }];
  odNode(E); return [...head, { ask: [['말을 건다', 'cur'], ['조용히 쉬고 간다', '!orest'], ['방을 나간다', '!oleave'], ['공격한다', '!foe']] }];
}
// 말을 건다 — 단계마다 (1 무관심 · 2 알아봄 · 3 개인적인 질문 → 장미장식 · 4~ 익숙함). 대화 마디는 그때그때 TALK.odile 에
const odTalkAsk = E => ({ ask: [...(!E.teaDrunk ? [['차를 받는다', '!otea']] : []), ['이야기를 더 한다', 'more'], ['그만둔다', ''], ['공격한다', '!foe']] });
const OD_MORE = [['이 방? 오래됐지. 나보다는 조금 덜.', 'odile_t5'], ['바깥은 여전히 시끄러워?', 'odile_t3'], ['차는 식기 전에 마시는 게 좋아.', 'odile_t4'], [null, 'odile_t1', '(그녀는 대답 대신 찻잔을 기울인다.)'], ['저 애들, 네 동료야? ...시끄럽진 않네.', 'odile_t2']];
function odNode(E){
  const O = odS(), m = O.met, ask = odTalkAsk(E), M = OD_MORE[Math.floor(Math.random() * OD_MORE.length)];
  TALK.odile.more = [M[0] ? { t: M[0], img: M[1] } : { narr: M[2], img: M[1] }, { go: '!oask' }];
  TALK.odile.cur = m <= 1 ? [{ narr: '(홀짝홀짝)', img: 'odile_t3' }, { narr: '큰 관심은 없는 듯하다.', img: 'odile_t3' }, { t: '용케 살아 왔네. 반 죽어있다고 해야하나.', img: 'odile_t4' }, ask]
    : m === 2 ? [{ narr: '(홀짝)', img: 'odile_t3' }, { t: '지난번에도 반쯤 죽어 있었지. 기억해.', img: 'odile_t4' }, ask]
    : m === 3 && !O.blessed ? [{ narr: '(그녀가 찻잔을 내려놓는다. 드문 일이다.)', img: 'odile_t1' }, { t: '...너는 어디까지 갈 생각이야?', img: 'odile_t3' }, { ask: [['끝까지', 'q3a'], ['모르겠어', 'q3b']] }]
    : [{ t: '오늘은 무슨 일로?', img: 'odile_t3' }, { narr: '(대답을 기다리는 것 같지는 않다.)', img: 'odile_t1' }, ask];
  return 'cur';
}
const odHeal = (k, lo, hi) => { const out = []; for (const u of world.units.filter(u => u.side === 0 && u.alive)){ const real = Math.max(0, Math.min(Math.round(Math.max(lo, Math.min(hi, u.max * k))), Math.floor(u.max - u.hp)));   /* v1.1: 소수 피 → 정수로 */ u.hp += real; if (real) out.push(`${u.name} +${real}`); } return out; };
function odTea(E){
  if (!E || E.teaDrunk){ TK.lines = [odTalkAsk(E || {})]; TK.i = 0; talkShow(); return; }
  E.teaDrunk = true; const out = odHeal(0.1, 6, 30); logEv(world, { k: 'odTea', who: out }); save(); hud();
  TK.lines = [{ narr: '(오딜이 찻잔 하나를 건넨다. 따뜻하다.)', img: 'odile_t4' }, { t: '마셔. 식기 전에.', img: 'odile_t3' }, { narr: out.length ? '몸이 조금 데워진다 — ' + out.join(' · ') : '몸이 조금 데워진다.' }, { go: '!oask' }]; TK.i = 0; talkShow();
}
function odRest(){
  const E = encCur(); if (!E || E.npc !== 'odile' || !world) return; if (E.rested){ toast('이번 방문엔 이미 쉬었어요'); return; }
  E.rested = true; const out = odHeal(0.08, 5, 25); E.restUntil = world.t + 10; for (const u of world.units) if (u.side === 0) u.odT = 0;   // 모두 앉으러
  logEv(world, { k: 'odRest', who: out }); save(); campBarRender(true); hud();
  talkLines([{ narr: '(당신은 낡은 의자에 앉아 잠시 숨을 고른다. 오딜은 차를 마실 뿐이다.)', img: 'odile_t1' }, ...(out.length ? [{ narr: '숨이 고르게 돌아온다 — ' + out.join(' · ') }] : [])], 'odile', E);
}
function odLeave(){ const L = world.units.filter(u => u.side === 0 && u.alive && !u.down); for (const u of L) u.order = { k: 'exit', dir: 'up', x: u.x }; noteOrders(L); hud(); toast('방을 나서요 — 위쪽 문 (4S) · ▶ 재생하면 걸어 나가요'); }
function odBless(){
  const O = odS(), T = '축복:오딜'; if (O.blessed) return; O.blessed = true;
  const hp = S.units.find(p => p.side === 0 && p.hero); if (hp && !(hp.traits || []).includes(T)) hp.traits = [...(hp.traits || []), T];
  const hu = world.units.find(u => u.side === 0 && u.hero), b = (rules.bless || {})[T] || {}; if (hu && !(hu.traits || []).includes(T)){ hu.traits = [...(hu.traits || []), T]; hu.atk = Math.round(hu.atk * (b.atk || 1)); hu.blessEv = (hu.blessEv || 0) + (b.ev || 0); }
  logEv(world, { k: 'odBless' }); save(); hud(); toast('🌹 <축복:오딜> — 인주가 오딜의 장미장식을 받았어요 (공격 × 1.1 · 회피 +10%)');
}
// 차 두 잔 — 무료 · 그 방문에 다시 생기지 않음 · 받은 동료의 가방으로 (다음 맵부터 — 상점과 같음)
function odTeaOpen(){
  const E = encCur(); if (!E || E.npc !== 'odile') return; if (odS().dead){ toast('차는 식은 지 오래예요'); return; } E.teaTaken = E.teaTaken || [null, null];
  const PL = lootParty(), b = $('banner');
  b.className = 'banner win'; b.innerHTML = `<b>오딜의 방 — 가져갈 수 있는 것</b><span>무료 · 이번 방문에 두 잔 · 동료 얼굴을 누르면 그 가방으로 (다음 맵부터 지님)</span><div class="loot"><div class="lgrid">${E.teaTaken.map((tk, i) => `<div class="lcard${tk ? ' tk' : ''}"><div class="lci"><span class="lic">🍵</span><span class="lnm">오딜의 차<small>마시면 체력 조금 (최대 체력 15% · 8 ~ 30)</small></span></div>`
    + (tk ? `<em>→ ${esc(tk)}</em>` : `<div class="lto">${PL.map(p => { const w = bagRoom(p, OD_TEA); return `<button type="button" class="lp" data-otake="${i}" data-lp="${esc(String(p.id))}" ${w ? 'disabled' : ''} title="${esc(p.name)}${w ? ' — ' + esc(w) : ''}"><i style="${faceCss(faceOf(p.ref), 28)}"></i><small>${esc(p.name)}</small></button>`; }).join('')}</div>`) + '</div>').join('')}</div></div><div class="row"><button class="btn go" type="button" data-oclose="1">닫기</button></div>`;
  b.hidden = false;
}
function odTake(i, pid){
  const E = encCur(), p = S.units.find(x => String(x.id) === String(pid)); if (!E || !p || !E.teaTaken || E.teaTaken[i]) return;
  const r = bagPut(p, { ...OD_TEA }); if (typeof r === 'string'){ toast(`${p.name}: ${r}`); return; }
  E.teaTaken[i] = p.name; logEv(world, { k: 'odTake', to: p.name }); save(); toast(`오딜의 차 → ${p.name}의 가방`); campBarRender(true); odTeaOpen();
}
// 동료의 자율 행동 · 전용 장면 · 오딜의 홀짝 · 죽음
function odTick(Wd){
  if (!S.room || !Wd.camp || Wd.over || mode === 'edit') return; const E = encCur(); if (!E || E.npc !== 'odile') return; const O = odS();
  if (E.st === 'foe'){ const u = Wd.units.find(x => x.ref === 'C-027' && x.side === 1); if (u && !u.alive && !O.dead){ O.dead = true; E.st = 'dead'; logEv(Wd, { k: 'odDead' }); save(); campBarRender(true); toast('오딜이 쓰러졌다 — 다음에 와도 그녀는 소파 위에 쓰러져 있을 거예요'); } return; }
  if (O.dead || E.st !== 'od' || !E.entered) return;
  const al = Wd.units.filter(u => u.side === 0 && u.alive && !u.down), free = !TK && !SH && !LD && $('banner').hidden, has = ref => al.find(u => u.ref === ref);
  const now = performance.now(); if (free && (!E.bub || now > E.bub.until + 7000) && Math.random() < 0.006) E.bub = { t: '(홀짝)', until: now + 1600 };
  E.scn = E.scn || {};
  const rb = has('C-002');   // 레베카: 방을 구경하다 오딜 곁으로 → 먼저 인사
  if (rb && !E.scn.reb){ if (!rb.odGreet && Wd.t > E.t0 + 4){ rb.odGreet = true; rb.order = { k: 'move', x: OD.greet.x, y: OD.greet.y, room: true }; rb.odDo = null; rb.odT = Wd.t + 40; }
    if (rb.odGreet && free && Math.hypot(rb.x - OD.greet.x, rb.y - OD.greet.y) < 1.1){ E.scn.reb = true; const real = Math.max(0, Math.min(Math.round(Math.max(6, Math.min(30, rb.max * 0.1))), Math.floor(rb.max - rb.hp))); rb.hp += real;
      logEv(Wd, { k: 'odAct', a: rb.i, s: '레베카가 오딜에게 먼저 인사를 건넨다.' });
      talkLines([{ who: 'C-002', t: '...안녕하세요! 와... 예쁜 방이네요' }, { narr: '(오딜이 찻잔을 가볍게 들어 보인다.)', img: 'odile_t4' }, { t: '고마워. 아가씨도 한잔?', img: 'odile_t5' }, { who: 'C-002', t: '...네 넷!' }, { narr: '(두 사람 사이에 은은한 귀품이 흐른다.)' + (real ? ` — 레베카 +${real}` : ''), img: 'odile_t5' }], 'odile', E); return; } }
  if (free && E.scnK > 0 && Wd.t >= E.scnK && has('C-003')){ E.scnK = -1; talkLines(Math.random() < 0.5 ? [{ narr: '(오딜이 카리우스를 바라본다.)', img: 'odile_t3' }, { t: '...만듦새가 좋네. 사랑받았어?', img: 'odile_t3' }, { who: 'C-003', t: '(무시)' }]
    : [{ narr: '(오딜이 카리우스의 광대를 바라본다.)', img: 'odile_t3' }, { who: 'C-003', name: '광대', t: '낄낄. 낄낄.' }, { narr: '(오딜은 조금 싫어하는 듯하다.)', img: 'odile_t2' }], 'odile', E); return; }
  if (free && E.scnT > 0 && Wd.t >= E.scnT && has('C-221')){ E.scnT = -1; talkLines([{ narr: '(오딜이 탕아를 바라본다.)', img: 'odile_t3' }, { t: '...어머나, 진짜 용사님이시네.', img: 'odile_t5' }, { who: 'C-221', t: '(무반응)' }], 'odile', E); return; }
  if (mode !== 'run') return;
  const cap = Math.ceil(al.length / 2), moving = () => al.filter(u => u.order && u.order.room && u.order.k === 'move' && Math.hypot(u.x - u.order.x, u.y - u.order.y) > 0.6).length;
  for (const u of al){
    if (u.order && !u.order.room) continue;   // 유저 명령은 그대로
    if (u.odDo && !u.odDo.said && Math.hypot(u.x - u.odDo.x, u.y - u.odDo.y) < 0.7){ u.odDo.said = true; if (Wd.t > (E.sayT || 0) + 3.5 && Wd.t > (u.odSay || 0) + 14){ E.sayT = u.odSay = Wd.t; logEv(Wd, { k: 'odAct', a: u.i, s: odSay(u, u.odDo) }); } }
    if (Wd.t < (u.odT || 0)) continue;
    const Wt = { ...OD_W0, ...(OD_W[u.name] || {}) }; if (E.restUntil && Wd.t < E.restUntil){ for (const k in Wt) Wt[k] = k === 'sit' ? 1 : 0; } else if (moving() >= cap){ Wt.look = Wt.wander = Wt.mate = 0; if (!Wt.stand && !Wt.sit) Wt.stand = 1; }
    const k = pickW(Wt), go = (x, y, d) => { u.order = { k: 'move', x, y, room: true }; u.odDo = d ? { ...d, x, y } : null; };
    if (k === 'sit'){ const sp = OD_SEAT.filter(q => !al.some(o => o !== u && Math.hypot(o.x - q[0], o.y - q[1]) < 0.8 || (o.order && o.order.room && Math.hypot(o.order.x - q[0], o.order.y - q[1]) < 0.3))); const q = sp[Math.floor(Math.random() * sp.length)]; if (q){ go(q[0], q[1], { k: 'sit', at: q[2] }); u.odT = Wd.t + 12 + Math.random() * 10; continue; } }
    if (k === 'look'){ const q = OD_LOOK[Math.floor(Math.random() * OD_LOOK.length)]; go(q[0] + (Math.random() - 0.5) * 0.4, q[1], { k: 'look', at: q[2] }); u.odT = Wd.t + 6 + Math.random() * 6; continue; }
    if (k === 'wander'){ for (let t = 0; t < 12; t++){ const x = 1.5 + Math.random() * 13, y = 1.6 + Math.random() * 9; if (!rock(Wd.map, x, y)){ go(x, y, null); break; } } u.odT = Wd.t + 4 + Math.random() * 4; continue; }
    if (k === 'mate'){ const o = al.filter(q => q !== u)[Math.floor(Math.random() * (al.length - 1))]; if (o){ const x = o.x + (Math.random() < 0.5 ? -0.85 : 0.85), y = o.y + 0.2; if (!rock(Wd.map, x, y)) go(x, y, { k: 'mate', at: o.name }); } u.odT = Wd.t + 5 + Math.random() * 5; continue; }
    u.odT = Wd.t + 5 + Math.random() * 6;   // 서 있음
  }
}
function odSay(u, d){
  const n = u.name, V = { 책장: '책 등을 하나하나 훑어본다', '그릇 진열장': '그릇 진열장을 들여다본다', 장식장: '장식장 위의 꽃병을 바라본다', '가면과 장미 더미': '가면 더미 앞에서 멈춰 선다', '검은 고양이': '검은 고양이 앞에 쪼그려 앉는다', '꽃 액자': '벽의 꽃 액자를 올려다본다', '나비 표본 액자': '나비 표본을 오래 바라본다', '붉은 책 더미': '붉은 책 더미를 기웃거린다', '찻잔 협탁': '찻잔 협탁을 기웃거린다' };
  if (d.k === 'sit') return n === '탕아' ? `탕아가 ${d.at}에 말없이 앉는다.` : `${ga(n)} ${d.at}에 걸터앉는다.`;
  if (d.k === 'mate') return `${ga(n)} ${d.at} 곁으로 간다.`;
  return `${ga(n)} ${V[d.at] || reul(d.at) + ' 구경한다'}.`;
}
// 그리기: 마루 · 벽지 (칸) · 융단 · 문틀 (한 번) / 가구 · 시신 (매 화면) / 스탠드 · 촛불 빛
function roomCell(g, x, y, P, R){
  const X = x * P, Y = y * P, edge = x === 0 || y === 0 || x === OD.W - 1 || y === OD.H - 1, door = (y === 0 || y === OD.H - 1) && OD.doors.includes(x);
  if (edge && !door){ if (y === 0){ g.fillStyle = '#3a1418'; g.fillRect(X, Y, P, P); g.fillStyle = 'rgba(120,40,46,.38)'; for (let k = 0; k < 4; k++) g.fillRect(X + k * 8 + 2, Y, 2, P); g.fillStyle = '#24130f'; g.fillRect(X, Y + P - 7, P, 7); g.fillStyle = 'rgba(201,162,74,.5)'; g.fillRect(X, Y + P - 8, P, 1.5); }
    else { g.fillStyle = '#1f1512'; g.fillRect(X, Y, P, P); g.fillStyle = 'rgba(255,220,180,.04)'; g.fillRect(X + R() * P, Y + R() * P, 3, 2); } return; }
  g.fillStyle = ['#3a2a20', '#35261d', '#3e2d22', '#33241b'][(y * 7 + Math.floor((x + (y % 2)) / 2)) % 4]; g.fillRect(X, Y, P, P);   // 낡은 마루 (판자)
  g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(X, Y + P - 1, P, 1); if ((x + y) % 2 === 0) g.fillRect(X + P - 1, Y, 1, P);
  if (R() < 0.3){ g.fillStyle = 'rgba(255,230,190,.04)'; g.fillRect(X + R() * P, Y + R() * P, 6, 1); }
  if (door){ g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(X, Y, P, P); }
}
function roomDeco(g, P){
  const x0 = 3.4 * P, y0 = 4.4 * P, x1 = 12.6 * P, y1 = 9.7 * P, R2 = mulberry32(31);
  g.fillStyle = '#5a1820'; g.fillRect(x0, y0, x1 - x0, y1 - y0); g.strokeStyle = '#a07a3a'; g.lineWidth = 3; g.strokeRect(x0 + 6, y0 + 6, x1 - x0 - 12, y1 - y0 - 12);   // 낡은 붉은 융단
  g.strokeStyle = 'rgba(160,122,58,.45)'; g.lineWidth = 1.5; g.strokeRect(x0 + 14, y0 + 14, x1 - x0 - 28, y1 - y0 - 28);
  g.fillStyle = 'rgba(190,120,80,.16)'; for (let yy = y0 + 30; yy < y1 - 20; yy += 26) for (let xx = x0 + 30; xx < x1 - 20; xx += 26){ g.beginPath(); g.moveTo(xx, yy - 7); g.lineTo(xx + 7, yy); g.lineTo(xx, yy + 7); g.lineTo(xx - 7, yy); g.closePath(); g.fill(); }
  g.fillStyle = 'rgba(20,8,8,.24)'; for (let k = 0; k < 18; k++){ g.beginPath(); g.ellipse(x0 + R2() * (x1 - x0), y0 + R2() * (y1 - y0), 6 + R2() * 18, 3 + R2() * 8, R2() * 3, 0, 6.283); g.fill(); }   // 바랜 자국
  for (const yy of [0, OD.H - 1]){ g.fillStyle = '#6a4a2a'; g.fillRect(OD.doors[0] * P - 4, yy * P, 4, P); g.fillRect((OD.doors[1] + 1) * P, yy * P, 4, P); }   // 문틀
}
const ODIMG = {}; const odImg = n => ODIMG[n] || (ODIMG[n] = Object.assign(new Image(), { src: `art/room/${n}.webp` }));
function drawRoomProps(Wd, ox, oy, ts){
  ctx.save(); ctx.beginPath(); ctx.rect(ox, oy, Wd.map.W * ts, Wd.map.H * ts); ctx.clip();
  for (const [n, x, y, w] of OD_PROPS.slice().sort((a, b) => a[2] - b[2])){ const im = odImg(n); if (!im.complete || !im.naturalWidth) continue; const h = w * im.naturalHeight / im.naturalWidth, px = ox + (x - w / 2) * ts, py = oy + (y - h) * ts;
    ctx.fillStyle = 'rgba(0,0,0,.32)'; ctx.beginPath(); ctx.ellipse(ox + x * ts, oy + (y - 0.05) * ts, w * ts * 0.46, ts * 0.16, 0, 0, 6.283); ctx.fill(); ctx.drawImage(im, px, py, w * ts, h * ts); }
  const O = odS(), E = encCur(); if (O.dead && E && E.npc === 'odile' && E.st === 'dead'){ const px = ox + 8.3 * ts, py = oy + 3.25 * ts, r = 0.34 * ts, fi = faceOf('C-027');   // 소파 위의 시신
    ctx.save(); ctx.translate(px, py); ctx.rotate(1.2); ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fillStyle = '#1c1a20'; ctx.fill(); ctx.clip(); if (fi >= 0 && atlasOK){ ctx.filter = 'grayscale(1) brightness(.55)'; ctx.drawImage(atlas, (fi % FACE.COLS) * FACE.S, Math.floor(fi / FACE.COLS) * FACE.S, FACE.S, FACE.S, -r, -r, r * 2, r * 2); ctx.filter = 'none'; } ctx.restore();
    ctx.strokeStyle = 'rgba(120,20,30,.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px - r * 0.7, py + r * 0.9); ctx.lineTo(px + r * 0.9, py + r * 1.1); ctx.stroke();
    ctx.font = `600 ${Math.max(10, Math.round(ts * 0.26))}px IBM Plex Sans KR, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const lb = '오딜 (시신)', lw = ctx.measureText(lb).width + 8; ctx.fillStyle = 'rgba(10,8,12,.75)'; ctx.fillRect(px - lw / 2, py + r + 4, lw, Math.max(13, ts * 0.34)); ctx.fillStyle = '#c9b8a8'; ctx.fillText(lb, px, py + r + 4 + Math.max(13, ts * 0.34) / 2); }
  ctx.restore();
}
function drawRoomLight(Wd, ox, oy, ts){
  const t = performance.now() / 1000; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, r, a] of [[1.6, 4.0, 3.2, 0.2], [14.4, 5.0, 2.8, 0.18], [14.3, 1.9, 2.0, 0.15], [12.6, 1.6, 2.2, 0.13], [8.0, 5.2, 3.2, 0.09]]){
    const cx = ox + x * ts, cy = oy + y * ts, R = r * ts * (1 + Math.sin(t * 3.1 + x) * 0.05), gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); gr.addColorStop(0, `rgba(255,170,90,${a})`); gr.addColorStop(1, 'rgba(255,140,60,0)'); ctx.fillStyle = gr; ctx.fillRect(cx - R, cy - R, R * 2, R * 2); }
  ctx.restore();
}
// 인카운터 목록의 오딜 칸
function odDocBox(B, tryB){
  const O = odS(), st = O.dead ? '죽음 (시신으로 남음 · 인연 멈춤)' : `${O.met || 0}번 만남${O.blessed ? ' · 장미장식 받음' : ''}`;
  return `<div class="box"><p class="lab">오딜의 방 ${B('rnd', '3S 랜덤')}</p><table class="tbl encT"><tbody>${encTr('무엇', '분리된 차원의 작은 방 — 낡은 붉은 소파에서 가면을 쓴 여자가 차를 마심. 과거엔 신이었지만 지금은 평범하게 차를 마실 뿐 · 먼저 다가오지 않음')}${encTr('뽑힐 몫', esc(encShare('odile')))}
    ${encTr('맵', `16 × 12 · 빛 0.5 (스탠드 · 촛불) · 위아래 문 · 가구 ${OD_PROPS.length}점 (도감 스프라이트)`)}${encTr('등장', encFace('C-027', '오딜', 'C-027 · 1성 · NPC'))}
    ${encTr('흐름', '<ul><li>들어서면 "어머나." — 말을 건다 · 조용히 쉬고 간다 · 방을 나간다 · 공격한다</li><li>차를 받는다: 모두 조금 회복 (최대 체력 10% · 6 ~ 30) — 방문마다 한 번</li><li>🍵 차 두 잔: 무료로 가져감 (마시면 15% · 8 ~ 30) — 그 방문에 다시 생기지 않음 · 다음 판에 다시</li><li>🛋 쉬기: 대화 없이 (8% · 5 ~ 25) · 동료가 모두 앉음</li><li>동료 자율: 카리우스 서 있음 · 탕아 앉음 · 청광묵 돌아다님 · 레베카 구경하다 먼저 인사 · 반쯤만 움직임 · 물건을 챙기거나 공격하지 않음</li><li>전용 장면: 레베카 (늘) · 카리우스 (55% — 만듦새 · 광대) · 탕아 (60%)</li></ul>')}
    ${encTr('인연 (판마다 한 번)', '<ul><li>1 — 큰 관심 없음 · 차와 쉼을 허락</li><li>2 — 알아보고 지난 일을 기억함 (이름이 보임)</li><li>3 — 개인적인 질문 → 장미장식 &lt;축복:오딜&gt; (공격 × 1.1 · 회피 +10%)</li><li>4~ — 익숙함 (찻잔을 하나 더 꺼냄)</li><li>죽으면 — 다음 방문부터 소파 위의 시신 · 대화 · 차 없음 · 저주 없음</li></ul>')}
    ${encTr('지금', esc(st))}${encTr('결말', esc(ENC_DOC.odile.end))}</tbody></table><div class="row">${tryB('odile', '▶ 3S 에서 해 보기')}</div></div>`;
}
function renderTraitsTab(){
""")
# v1.3 PC: 캠페인 띠가 이야기 상자를 덮던 것 → 이야기 상자를 띠 아래로 (모든 캠페인 맵)
rep("  if (h !== campBarH || el.hidden){ campBarH = h; el.innerHTML = h; el.hidden = false; }\n}",
    "  if (h !== campBarH || el.hidden){ campBarH = h; el.innerHTML = h; el.hidden = false; }\n  campNarrTop();\n}\n"
    "function campNarrTop(){ const n = $('narr'), el = $('campBar'); if (!n || !el) return; const t = !el.hidden && !document.body.classList.contains('mob') ? el.offsetTop + el.offsetHeight + 6 : 0; const v = t ? t + 'px' : ''; if (n.style.top !== v) n.style.top = v; }   /* v7.26.0 PC: 이야기 상자는 캠페인 띠 아래 (겹침 없음) */")
rep("if (!el.hidden || force){ el.hidden = true; el.innerHTML = ''; campBarH = ''; } return; }", "if (!el.hidden || force){ el.hidden = true; el.innerHTML = ''; campBarH = ''; campNarrTop(); } return; }")
open(F, 'w', encoding='utf-8').write(s)
print('page7260 OK')
