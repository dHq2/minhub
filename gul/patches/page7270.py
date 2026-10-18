# v7.27.0 페이지 — page7270.py v1.0 (레지나 — 9층의 보스 (C-085) 를 인카운터로 (목록에서만 · 3S 랜덤 몫 0): 복도 (도감 bg_regina_hall1) → 알현실 (bg_regina_boss) 한 맵 ·
#   그림의 벽 · 기둥 · 화로 · 옥좌는 못 지나감 · 옥좌의 레지나 (regina_throne) / 들어서면 장면 그림 (regina_cutscene) · 권태로운 레지나 — 이야기 · 칼을 맞대 본다 · 지나간다 · 세 번째 만남부터 같이 가자 /
#   죽으면 다음부터 빈 옥좌 · 지나가거나 이기면 옥좌 뒤 길 (↑) / 새 대화 그림: 레지나 5 · 레베카 4 · 모닝스타 8 · 친칠라 10 (새 그림으로) · 리완 8 · 세르파 5 · 페흐토 · 포렌 5 (앞으로 쓸 자리))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7262.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.26.2 (2026-10-18)', '<!-- 굴의 전투판 v7.27.0 (2026-10-18)')
rep('     v7.26.2: ', '''     v7.27.0: 레지나 (9층의 보스) 인카운터 — 인카운터 목록에서만 해 볼 수 있음. 푸른 화로가 늘어선 복도를 지나 알현실로 (도감 그림 · 벽 · 기둥 · 화로 · 옥좌는 못 지나감).
         권태로운 레지나와 이야기 · 싸움 · 그냥 지나감 · 세 번째 만남부터 영입. 새 대화 그림 (레지나 · 레베카 · 모닝스타 · 친칠라 · 리완 · 세르파 · 페흐토 · 포렌).
     v7.26.2: ''')
rep('h1::after{content:" v7.26.2"', 'h1::after{content:" v7.27.0"')
rep('<footer>굴의 전투판 v7.26.2', '<footer>굴의 전투판 v7.27.0')
rep('return `굴의 전투판 v7.26.2 · ${title}', 'return `굴의 전투판 v7.27.0 · ${title}')
rep("copyText('굴의 전투판 v7.26.2 자동 판 기록", "copyText('굴의 전투판 v7.27.0 자동 판 기록")
rep("ver: '7.26.2', kind: '1F 여정 기록'", "ver: '7.27.0', kind: '1F 여정 기록'")
rep("o.push('굴의 전투판 v7.26.2 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v7.27.0 — 1F 프롤로그 여정 기록'")
rep('의 버전 기록에 — v7.26.2 인카운터 바로 해 보기', '의 버전 기록에 — v7.27.0 레지나 인카운터 · 새 대화 그림 / v7.26.2 인카운터 바로 해 보기')
rep('">v7.26.2 · 인카운터 바로 해 보기</span>', '">v7.27.0 · 레지나</span>')

# ---------- 대화 그림 등록표 ----------
rep("'C-005': ['mstar_t1', 'mstar_t2', 'mstar_t3'], 'C-002': ['C-002_art'] };",
    "'C-005': ['mstar_t1', 'mstar_t2', 'mstar_t3', 'mstar_t4', 'mstar_t5', 'mstar_t6', 'mstar_t7', 'mstar_t8'], 'C-002': ['C-002_art', 'rebecca_t2', 'rebecca_t3', 'rebecca_t4'],\n"
    "  'C-085': ['regina_t1', 'regina_t2', 'regina_t3', 'regina_t4', 'regina_t5'],   /* v7.27.0 레지나 */\n"
    "  'C-282': ['riwan_t1', 'riwan_t2', 'riwan_t3', 'riwan_t4', 'riwan_t5', 'riwan_t6', 'riwan_t7', 'riwan_t8'], 'C-277': ['serpa_t1', 'serpa_t2', 'serpa_t3', 'serpa_t4', 'serpa_t5'], 'C-108': ['pehto_t1'], 'C-006': ['poren_t1', 'poren_t2', 'poren_t3', 'poren_t4', 'poren_t5'] };   /* v7.27.0 리완 · 세르파 · 페흐토 · 포렌 — 나오게 되면 바로 씀 */")

# ---------- 대화 화면: 가로로 긴 장면 그림 (cgw) · 레지나 뒤 배경 ----------
rep("if (L.bg) TK.bg = L.bg; else if (!TK.bg && TK.npc === 'odile') TK.bg = 'bg_room';",
    "if (L.bg) TK.bg = L.bg; else if (!TK.bg && TK.npc === 'odile') TK.bg = 'bg_room'; else if (!TK.bg && TK.npc === 'regina') TK.bg = 'rg_bg';")
rep("  T0.style.backgroundSize = L.cg ? 'auto,auto 64%,auto,cover' : ''; T0.style.backgroundPosition = L.cg ? '0 0,center 6%,0 0,center 30%' : '';",
    "  T0.style.backgroundSize = L.cg ? (L.cgw ? 'auto,min(96%,1500px) auto,auto,cover' : 'auto,auto 64%,auto,cover') : ''; T0.style.backgroundPosition = L.cg ? (L.cgw ? '0 0,center 14%,0 0,center 30%' : '0 0,center 6%,0 0,center 30%') : '';   /* v7.27.0 cgw = 가로로 긴 장면 그림 */")

# ---------- 만남 목록 · 인물 ----------
rep("{ k: 'odile', name: '오딜의 방', w: 1, npc: 'odile' }];",
    "{ k: 'odile', name: '오딜의 방', w: 1, npc: 'odile' }, { k: 'regina', name: '레지나의 알현실', w: 0, npc: 'regina', test: true }];   /* v7.27.0 레지나: 아직 랜덤에 없음 (목록에서만) */")
rep("TALK.odile = { cur: [], more: [],", "TALK.regina = { cur: [], more: [] };   /* v7.27.0 마디는 그때그때 (rgNode) */\nTALK.odile = { cur: [], more: [],")
rep("const ENC_LIVE = ['sleep', 'awake', 'sit', 'greeted', 'declined', 'shop', 'smoke', 'rise', 'od'];",
    "const ENC_LIVE = ['sleep', 'awake', 'sit', 'greeted', 'declined', 'shop', 'smoke', 'rise', 'od', 'throne', 'rpass'];   /* v7.27.0 throne · rpass = 레지나 (옥좌) */")
rep("NPC.odile = {", """NPC.regina = { key: '레지나', ref: 'C-085', who: '옥좌의 검은 기사', x: 12, y: 2.6, img: 'regina_t1', st0: 'throne', fromRef: true, throne: true, talkR: 6.5, node: E => rgNode(E),   /* v7.27.0 레지나 (9층의 보스) */
  mod: { traits: ['베테랑'], foeTraits: ['보스'], wName: '레지나의 검', gear: { 몸: { name: '레지나의 흑갑', mat: '판금', tier: 3 } } },
  foeLine: '그녀가 옥좌에서 천천히 일어난다. 붉은 검이 빛을 머금는다.', map: { W: 24, H: 40, amb: 0.85, regina: true, water: [], torches: [], piles: [] }, seen: null };
NPC.odile = {""")
rep("function encMake(E, side){ const N = NPC[E.npc], p = E.p ? { ...clone(E.p), id: uid(), side, x: E.x, y: E.y } : N.fromRef ? { ...unitFromRef(N.ref, side, {}), id: uid(), x: E.x, y: E.y } : { ...fromDesign(designByKey(N.key), side), x: E.x, y: E.y };",
    "function encMake(E, side){ const N = NPC[E.npc], p = E.p ? { ...clone(E.p), id: uid(), side, x: E.x, y: E.y } : N.fromRef ? { ...unitFromRef(N.ref, side, {}), id: uid(), x: E.x, y: E.y } : { ...fromDesign(designByKey(N.key), side), x: E.x, y: E.y };\n"
    "  if (N.mod && !E.p){ const Md = clone(N.mod); p.traits = [...new Set([...(p.traits || []), ...(Md.traits || []), ...(side === 1 ? Md.foeTraits || [] : [])])]; delete Md.traits; delete Md.foeTraits; Object.assign(p, Md); }   /* v7.27.0 인물 덧붙임 (레지나: 베테랑 · 적이면 보스 · 검 이름 · 흑갑) */")
rep("  if (a === '!join'){ talkClose(); encJoin(E); return; }",
    "  if (a === '!join'){ talkClose(); encJoin(E); if (E && E.npc === 'regina'){ rgS().joined = true; world.stairs = { ...RG.door }; save(); campBarRender(true); } return; }\n"
    "  if (a === '!rask'){ TK.lines = [rgAsk(E)]; TK.i = 0; talkShow(); return; } if (a === '!rpass2'){ talkClose(); rgPass(E); return; }   /* v7.27.0 레지나 */\n"
    "  if (a === '!rfoe'){ TK.lines = [{ t: '좋아. 오랜만에 몸이 좀 풀리겠네.', img: 'regina_t5' }, { narr: '(그녀가 옥좌에서 천천히 일어난다. 붉은 검이 빛을 머금는다.)', img: 'regina_t5' }, { go: '!foe2' }]; TK.i = 0; talkShow(); return; }\n"
    "  if (a === '!rpass'){ TK.lines = [{ t: '가 봐. 문은 안 잠갔어.', img: 'regina_t3' }, { narr: '(그녀가 다시 턱을 괸다.)', img: 'regina_t1' }, { go: '!rpass2' }]; TK.i = 0; talkShow(); return; }\n"
    "  if (a === '!rjoin'){ TK.lines = [{ t: '...여기 앉아 있는 것도 질렸어.', img: 'regina_t2' }, { t: '좋아, 따라가 줄게. 대신 지루하게 하지 마.', img: 'regina_t4' }, { go: '!join' }]; TK.i = 0; talkShow(); return; }")
rep("  if (a === '!foe2'){ talkClose(); if (E && E.npc === 'odile'){ E.x = OD.stand.x; E.y = OD.stand.y; }",
    "  if (a === '!foe2'){ talkClose(); if (E && E.npc === 'odile'){ E.x = OD.stand.x; E.y = OD.stand.y; } if (E && E.npc === 'regina'){ E.x = RG.stand.x; E.y = RG.stand.y; }")

# ---------- 맵 짓기 ----------
rep("  S.room = !!(NP && NP.map.room); if (S.room) Object.assign(S, { flips: odFlips(), piles: odPiles(), torches: [], hills: [], indoor: true, zones: [], sandY: null });",
    "  S.room = !!(NP && NP.map.room); if (S.room) Object.assign(S, { flips: odFlips(), piles: odPiles(), torches: [], hills: [], indoor: true, zones: [], sandY: null });\n"
    "  S.regina = !!(NP && NP.map.regina); if (S.regina) Object.assign(S, { flips: rgFlips(), piles: [], torches: [], hills: [], indoor: true, zones: [], sandY: null });   /* v7.27.0 레지나: 복도 → 알현실 (그림의 벽 · 기둥 · 화로 · 옥좌는 막힘) */\n"
    "  if (S.regina && st.enc) st.enc.seen = true;   // 들어설 때 장면은 rgEnter 가")
rep("  campPlace(m, party, up ? 0.5 : S.H - 3,", "  if (S.regina && up) campPlace(m, party, 3.4, 6, 9, 15); else   /* v7.27.0 위에서 돌아오면 옥좌 앞 */\n  campPlace(m, party, up ? 0.5 : S.H - 3,")
rep("  if ((HL || S.room) && world && world.explored) world.explored.fill(2);",
    "  if ((HL || S.room || S.regina) && world && world.explored) world.explored.fill(2);\n"
    "  if (S.regina && st.enc && ['rpass', 'rdead', 'joined'].includes(st.enc.st)) world.stairs = { ...RG.door };   /* v7.27.0 옥좌 뒤 길 */")
rep("const BOARD_K = ['type', 'W', 'H', 'mapC', 'randStart', 'startK', 'room',", "const BOARD_K = ['type', 'W', 'H', 'mapC', 'randStart', 'startK', 'room', 'regina',")
rep("const boardSet = B => Object.assign(S, { startK: null, room: false,", "const boardSet = B => Object.assign(S, { startK: null, room: false, regina: false,")
rep("S.startK = null; S.room = false;", "S.startK = null; S.room = false; S.regina = false;")
rep("    if (S.room){ roomCell(g, x, y, P, R); continue; }   /* v7.26.0 오딜의 방: 마루 · 벽지 */",
    "    if (S.room){ roomCell(g, x, y, P, R); continue; }   /* v7.26.0 오딜의 방: 마루 · 벽지 */\n"
    "    if (S.regina){ g.fillStyle = rgOpen(x, y) ? '#1b2c62' : '#04050c'; g.fillRect(x * P, y * P, P, P); continue; }   /* v7.27.0 바탕 — 그림은 draw 에서 (원본 해상도) */")
rep("!S.hall && !S.room", "!S.hall && !S.room && !S.regina", 3)
rep("  if (x1 > x0 && y1 > y0) ctx.drawImage(mapCv, x0 * 32, y0 * 32, (x1 - x0) * 32, (y1 - y0) * 32, ox + x0 * ts, oy + y0 * ts, (x1 - x0) * ts, (y1 - y0) * ts);\n",
    "  if (x1 > x0 && y1 > y0) ctx.drawImage(mapCv, x0 * 32, y0 * 32, (x1 - x0) * 32, (y1 - y0) * 32, ox + x0 * ts, oy + y0 * ts, (x1 - x0) * ts, (y1 - y0) * ts);\n"
    "  if (S.regina && Wd.camp) drawRegina(Wd, ox, oy, ts);   /* v7.27.0 복도 · 알현실 그림 · 옥좌의 레지나 */\n")
rep("  if (!(see || E.seen || litAt(Wd, x, y))) return;\n", "  if (!(see || E.seen || litAt(Wd, x, y))) return;\n  if (N.throne && (E.st === 'throne' || E.st === 'rpass')) return;   /* v7.27.0 옥좌에 앉아 있으면 그림 (drawRegina) */\n")
rep("odTick(Wd); }   /* v7.26.0 오딜의 방 */", "odTick(Wd); rgTick(Wd); }   /* v7.26.0 오딜의 방 · v7.27.0 레지나 */")
rep("  if (C.s === 5 && W){ const E = ((C.stages || {})[5] || {}).cz;",
    "  if (C.s === 3 && W && S.regina && !W.stairs) h = h.replace(/<button[^>]*data-cexit=\"up\"[^>]*>[^<]*<\\/button>/, '');   /* v7.27.0 레지나: 옥좌 뒤 길이 열려야 위로 */\n"
    "  if (C.s === 5 && W){ const E = ((C.stages || {})[5] || {}).cz;")

# ---------- 로그 · 이야기 ----------
rep("      case 'odMeet':", "      case 'rgMeet': out.push(`${T(e)}👑 레지나와의 만남 ${e.n}번째${e.n >= 3 ? ' — 영입할 수 있음' : ''}`); break;   /* v7.27.0 */\n"
    "      case 'rgPass': out.push(`${T(e)}👑 레지나가 길을 내줌 — 옥좌 뒤 길 (↑)`); break;\n      case 'rgDead': out.push(`${T(e)}👑 레지나 쓰러짐 — 다음부터 빈 옥좌 · 옥좌 뒤 길 (↑)`); break;\n      case 'odMeet':")
rep("    case 'odMeet': case 'odTake': return null;",
    "    case 'odMeet': case 'odTake': case 'rgMeet': return null;\n"
    "    case 'rgPass': return { c: 'dim', s: '레지나가 다시 턱을 괸다. 옥좌 뒤로 길이 열려 있다.' };   /* v7.27.0 */\n"
    "    case 'rgDead': return { c: 'good', s: '레지나가 무릎을 꿇고 쓰러진다. 푸른 불꽃이 잠시 흔들린다.' };")

# ---------- 인카운터 목록 ----------
rep("    ...ENC3.filter(e => e.npc).map(e => [e.name, B('rnd', '랜덤'), '3S', encShare(e.k), ENC_DOC[e.k] ? ENC_DOC[e.k].end : '', e.k]),",
    "    ...ENC3.filter(e => e.npc).map(e => e.w > 0 ? [e.name, B('rnd', '랜덤'), '3S', encShare(e.k), ENC_DOC[e.k] ? ENC_DOC[e.k].end : '', e.k] : [e.name, B('plan', '시험용'), '3S 자리 (목록에서만)', '아직 랜덤에 없음 — ▶ 로만', ENC_DOC[e.k] ? ENC_DOC[e.k].end : '', e.k]),")
rep("if (e.k === 'odile'){ h += odDocBox(B, tryB); continue; }", "if (e.k === 'odile'){ h += odDocBox(B, tryB); continue; } if (e.k === 'regina'){ h += rgDocBox(B, tryB); continue; }")
rep("const ENC_DOC = {\n", "const ENC_DOC = {\n  regina: { end: '싸움 (이기면 옥좌 뒤 길) · 지나감 · 영입 (세 번째 만남부터)' },   /* v7.27.0 */\n")

# ---------- 레지나 본체 ----------
rep("function renderTraitsTab(){\n", r"""/* ---------- v7.27.0 레지나 — 9층의 보스 (C-085 · 수인 · 에너지 검술 · 5성쯤). 지금은 인카운터 목록에서만 (3S 랜덤 몫 0) ----------
   맵 24 × 40: 위 = 알현실 (24 × 16 · 도감 bg_regina_boss) · 아래 = 복도 (16 × 24 · bg_regina_hall1 · x 4 부터 · 걷는 길 7 ~ 16). 그림의 벽 · 기둥 · 화로 · 옥좌는 막힌 칸
   흐름: 복도를 지나 알현실 (y < 16) 에 들어서면 장면 그림 + 첫마디 — 이야기를 나눈다 · 칼을 맞대 본다 (싸움) · 지나간다 (옥좌 뒤 길) · 세 번째 만남부터 같이 가자 (영입)
   인연: 판마다 한 번 셈 (S.rgBond) · 죽으면 다음부터 빈 옥좌 */
const RG = { W: 24, H: 40, hallH: 16, cx: 4, stand: { x: 12, y: 3.8 }, door: { x: 12, y: 2.3, r: 0.9 }, thr: { x: 12, y: 3.55, w: 2.9 } };
function rgOpen(x, y){ return (y >= 2 && y <= 13 && x >= 2 && x <= 21) || (y >= 14 && y <= 15 && x >= 10 && x <= 13) || (y >= 16 && y < 40 && x >= 7 && x <= 16); }   // 함수 선언 (불러온 판을 처음 그릴 때도 쓰임)
const rgFlips = () => { const f = []; for (let y = 0; y < RG.H; y++) for (let x = 0; x < RG.W; x++) if (!rgOpen(x, y)) f.push(x + ',' + y); return f; };
const RGIMG = {}; const rgImg = n => RGIMG[n] || (RGIMG[n] = Object.assign(new Image(), { src: `art/regina/${n}.webp` }));
const rgS = () => S.rgBond || (S.rgBond = { met: 0, dead: false, joined: false, lastRun: null });
function drawRegina(Wd, ox, oy, ts){
  const a = rgImg('boss'), b = rgImg('hall');
  if (b.complete && b.naturalWidth) ctx.drawImage(b, ox + RG.cx * ts, oy + RG.hallH * ts, 16 * ts, 24 * ts);
  if (a.complete && a.naturalWidth) ctx.drawImage(a, ox, oy, 24 * ts, 16 * ts);
  const E = encCur(); if (!E || E.npc !== 'regina' || !(E.st === 'throne' || E.st === 'rpass')) return;
  const t = rgImg('throne'); if (!(t.complete && t.naturalWidth)) return; const w = RG.thr.w * ts, h = w * t.naturalHeight / t.naturalWidth, px = ox + RG.thr.x * ts, py = oy + RG.thr.y * ts;
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(px, py - ts * 0.1, w * 0.46, ts * 0.32, 0, 0, 6.283); ctx.fill(); ctx.drawImage(t, px - w / 2, py - h, w, h); ctx.restore();
  const near = encDist(Wd, E) <= (NPC.regina.talkR || 6), nm = (near ? '💬 ' : '') + (E.known ? '레지나' : NPC.regina.who);
  ctx.font = `700 ${Math.max(10, Math.round(ts * 0.36))}px IBM Plex Sans KR, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(nm).width + 12, ly = py + ts * 0.42;
  ctx.fillStyle = 'rgba(10,10,24,.82)'; ctx.fillRect(px - tw / 2, ly - ts * 0.24, tw, ts * 0.48); ctx.fillStyle = '#e8d8ff'; ctx.fillText(nm, px, ly);
}
function rgEnter(E){
  const Wd = world, C = S.camp, O = rgS(); if (!E || !Wd || !C) return;
  E.entered = true; E.seen = true;
  if (!O.dead && O.lastRun !== C.t0){ O.lastRun = C.t0; O.met = (O.met || 0) + 1; logEv(Wd, { k: 'rgMeet', n: O.met }); }
  if (O.met >= 2) E.known = true;
  if (O.dead){ E.st = 'rdead'; Wd.stairs = { ...RG.door }; save(); campBarRender(true); talkLines([{ narr: '복도 끝, 푸른 불꽃이 늘어선 알현실이 열린다.' }, { narr: '옥좌는 비어 있다. 붉은 검도, 검은 기사도 없다.' }, { narr: '불꽃만 여전히 조용히 타오른다. 옥좌 뒤로 길이 나 있다.' }], 'regina', E); return; }
  save(); campBarRender(true); talkLines(rgEnterLines(E), 'regina', E);
}
function rgEnterLines(E){
  const m = rgS().met;
  const head = m <= 1 ? [{ narr: '복도 끝, 푸른 불꽃이 늘어선 알현실이 열린다.', cg: 'rg_cut', cgw: true }, { narr: '옥좌에 검은 기사가 턱을 괴고 앉아 있다. 붉은 검이 발치에 꽂혀 있다.', cg: 'rg_cut', cgw: true }, { t: '...또 누가 왔네.', img: 'regina_t1' }, { narr: '(그녀는 일어나지 않는다. 권태로운 눈이 당신들을 훑는다.)', img: 'regina_t3' }]
    : m === 2 ? [{ narr: '다시 그 알현실. 푸른 불꽃은 그대로다.', cg: 'rg_cut', cgw: true }, { t: '또 너야? ...뭐, 반갑네. 여긴 아무도 안 오거든.', img: 'regina_t2' }]
    : [{ narr: '익숙한 알현실.', cg: 'rg_cut', cgw: true }, { t: '왔어? 이번엔 뭘 할 건데.', img: 'regina_t4' }];
  rgNode(E); return [...head, rgAsk(E)];
}
const rgAsk = E => ({ ask: [['이야기를 나눈다', 'more'], ['칼을 맞대 본다', '!rfoe'], ['지나간다', '!rpass'], ...(rgS().met >= 3 && !rgS().dead ? [['같이 가자', '!rjoin']] : [])] });
const RG_MORE = [['여기서 뭘 하냐고? ...앉아 있지. 오래.', 'regina_t1'], ['이 층의 주인이라는 건 그런 거야. 누가 올 때까지 기다리는 것.', 'regina_t3'], ['심심하면 칼이라도 맞대 볼래? 아니면 그냥 지나가. 어느 쪽이든 상관없어.', 'regina_t5'], ['떨어진 거야, 나도. 위에서. ...이제는 별로 궁금하지도 않아.', 'regina_t2'], [null, 'regina_t4', '(그녀가 하품을 참는다.)']];
function rgNode(E){
  const M = RG_MORE[Math.floor(Math.random() * RG_MORE.length)];
  TALK.regina.more = [M[0] ? { t: M[0], img: M[1] } : { narr: M[2], img: M[1] }, { go: '!rask' }];
  TALK.regina.cur = [{ t: rgS().met >= 3 ? '할 말 있으면 해.' : '용건은?', img: 'regina_t3' }, rgAsk(E)];
  return 'cur';
}
function rgPass(E){ const Wd = world; if (!E || !Wd) return; E.st = 'rpass'; Wd.stairs = { ...RG.door }; logEv(Wd, { k: 'rgPass' }); save(); campBarRender(true); toast('옥좌 뒤 길이 열렸어요 — ↑ 로 지나가요'); }
function rgTick(Wd){
  if (!S.regina || !Wd.camp || Wd.over || mode === 'edit') return; const E = encCur(); if (!E || E.npc !== 'regina') return; const O = rgS();
  if (E.st === 'foe'){ const u = Wd.units.find(x => x.ref === 'C-085' && x.side === 1); if (u && !u.alive && !O.dead){ O.dead = true; E.st = 'rdead'; Wd.stairs = { ...RG.door }; logEv(Wd, { k: 'rgDead' }); save(); campBarRender(true); toast('레지나가 쓰러졌다 — 옥좌 뒤 길이 열렸어요 · 다음부터 빈 옥좌'); } return; }
  if (!E.entered && !TK && !LD && Wd.units.some(u => u.side === 0 && u.alive && u.y < RG.hallH - 0.3)) rgEnter(E);
}
function rgDocBox(B, tryB){
  const O = rgS(), st = O.dead ? '쓰러짐 (다음부터 빈 옥좌)' : `${O.met || 0}번 만남${O.joined ? ' · 영입한 적 있음' : ''}`;
  return `<div class="box"><p class="lab">레지나의 알현실 ${B('plan', '시험용')}</p><table class="tbl encT"><tbody>${encTr('무엇', '9층의 보스 레지나 (수인 · 에너지 검술 · 5성쯤). 유폐에 가깝게 떨어져 권태로움 — 말 걸면 평범하게 받아 줌 · 싸워도 지나가도 상관없음 · 만남이 이어지면 영입')}${encTr('나오는 곳', '아직 랜덤 인카운터에 없음 — 이 목록의 ▶ 로만')}
    ${encTr('맵', '24 × 40 · 빛 0.85 · 아래 복도 (16 × 24 · 푸른 화로 · 기둥) → 위 알현실 (24 × 16 · 옥좌 · 화로 · 대리석 기둥) — 도감 그림 그대로 · 벽 · 기둥 · 화로 · 옥좌는 못 지나감')}${encTr('등장', encFace('C-085', '레지나', 'C-085 · 5성 · 적이면 [보스] · 레지나의 검 · 흑갑'))}
    ${encTr('흐름', '<ul><li>복도를 지나 알현실에 들어서면 장면 그림 — "...또 누가 왔네."</li><li>이야기를 나눈다 · 칼을 맞대 본다 (싸움) · 지나간다 (옥좌 뒤 길 ↑) · 세 번째 만남부터 같이 가자 (영입)</li><li>이기거나 지나가거나 영입하면 옥좌 뒤 길이 열림 — 그 전엔 ↑ 단추가 없음</li></ul>')}
    ${encTr('인연 (판마다 한 번)', '<ul><li>1 — 권태로운 첫 만남</li><li>2 — 알아봄 (이름이 보임)</li><li>3~ — 같이 가자 (영입)</li><li>죽으면 — 다음부터 빈 옥좌</li></ul>')}
    ${encTr('대화 그림', '레지나 5 (regina_t1 ~ t5) · 장면 그림 (regina_cutscene) · 옥좌 (regina_throne)')}${encTr('지금', esc(st))}${encTr('결말', esc(ENC_DOC.regina.end))}</tbody></table><div class="row">${tryB('regina', '▶ 해 보기')}</div></div>`;
}
function renderTraitsTab(){
""")

open(F, 'w', encoding='utf-8').write(s)
print('page7270 OK')
