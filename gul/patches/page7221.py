# v7.22.1 페이지 — page7221.py v1.1 (v1.1: 거래 창이 열린 동안 캠페인 띠를 숨김 (모바일에서 가리던 것) · 5단계 인카운터 2: 토끼마차 — 상인 아이텐 (거래 창: 가진 물건을 건네면 가치가 쌓이고 그 가치로 화살 · 탄 · 회복약을 삼) · 청갑 (뭘 봐 → 꺼져 → 무시) · 공격하면 확정 패배 이벤트 · 장면 인물 여럿 · 사각형 나레이션 창 · 회복약 (가방에서 마시기))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.22.0 (2026-10-18)', '<!-- 굴의 전투판 v7.22.1 (2026-10-18)')
rep('     v7.22.0: ', '''     v7.22.1: 토끼마차 — 3S 만남에 상인 아이텐 · 청갑. 아이텐: "안녕하세요. 토끼마차 1호점입니다." → 거래 창 (가진 물건을 건네면 가치가 쌓이고,
         그 가치로 화살 · 일반 탄 · 특수 탄 · 회복약을 삼 · 산 것은 받는 동료의 가방으로 · 다음 맵부터 지님). 청갑: 뭘 봐 → 꺼져 → 그 뒤로는 무시.
         둘 중 누구든 공격하면 확정 패배 이벤트 (전투는 나중에 제대로). 장면 인물이 여럿일 수 있음 · 사각형 나레이션 창.
         회복약: 가방에서 마시기 (명령 · 1초) — 최대 체력의 30% (20 ~ 80).
     v7.22.0: ''')
rep('h1::after{content:" v7.22.0"', 'h1::after{content:" v7.22.1"')
rep('<footer>굴의 전투판 v7.22.0', '<footer>굴의 전투판 v7.22.1')
rep('return `굴의 전투판 v7.22.0 · ${title}', 'return `굴의 전투판 v7.22.1 · ${title}')
rep("copyText('굴의 전투판 v7.22.0 자동 판 기록", "copyText('굴의 전투판 v7.22.1 자동 판 기록")
rep('의 버전 기록에 — v7.22.0 인카운터', '의 버전 기록에 — v7.22.1 토끼마차 · 거래 · 회복약 / v7.22.0 인카운터')
rep('">v7.22.0 · 1F 인카운터 · 대화</span>', '">v7.22.1 · 1F 인카운터 · 토끼마차</span>')
rep("ver: '7.22.0', at:", "ver: '7.22.1', at:")

# ---------- 만남 · 인물 · 대화 ----------
rep("  { k: 'chin', name: '잠든 사냥꾼', w: 1.2, npc: 'chin' }, { k: 'tang', name: '불가에 앉은 이', w: 1.2, npc: 'tang' }];",
    "  { k: 'chin', name: '잠든 사냥꾼', w: 1.2, npc: 'chin' }, { k: 'tang', name: '불가에 앉은 이', w: 1.2, npc: 'tang' },\n  { k: 'shop', name: '토끼마차', w: 1, npc: 'aiten', more: ['cheong'] }];   // v7.22.1 상인 (more = 곁의 인물)")
rep("pass: '멀찍이서 무거운 발소리가 따라온다. ...그였다.', foeLine: '사내가 천천히 대검을 쥐고 일어선다.' } };",
    """pass: '멀찍이서 무거운 발소리가 따라온다. ...그였다.', foeLine: '사내가 천천히 대검을 쥐고 일어선다.' },
  aiten: { key: '아이텐', ref: 'C-033', who: '토끼마차 상인', x: 15, y: 9.8, img: 'C-033_art', st0: 'shop', cart: { x: 16.9, y: 8.7 }, node: E => E.n > 1 ? 'again' : 'start',   /* v7.22.1 */
    map: { water: [], torches: [{ x: 16.2, y: 9.3 }], piles: [] }, seen: '어둠 속에 마차 한 대. 등불 아래 누군가 손을 흔든다.' },
  cheong: { key: '청갑', ref: 'C-036', who: '마차 위의 사내', x: 18.1, y: 8.3, img: 'C-036_art', st0: 'smoke', smoke: true, node: E => E.n >= 3 ? 't3' : E.n === 2 ? 't2' : 't1',
    seen: '마차 위의 사내는 담배를 줄줄이 피고 있었다.' } };""")
rep("    declined: [{ narr: '그는 다시 불빛만 멍하니 바라본다.', img: 'C-221_art' }, { ask: [['그만둔다', ''], ['공격한다', '!foe']] }] } };",
    """    declined: [{ narr: '그는 다시 불빛만 멍하니 바라본다.', img: 'C-221_art' }, { ask: [['그만둔다', ''], ['공격한다', '!foe']] }] },
  aiten: {   /* v7.22.1 토끼마차 */
    start: [{ t: '안녕하세요. 토끼마차 1호점입니다.', img: 'C-033_art' }, { ask: [['물건을 본다', '!shop'], ['그만둔다', ''], ['공격한다', '!war']] }],
    again: [{ t: '또 오셨네요, 고객님.', img: 'C-033_art' }, { ask: [['물건을 본다', '!shop'], ['그만둔다', ''], ['공격한다', '!war']] }] },
  cheong: {
    t1: [{ t: '뭘 봐.', img: 'C-036_art' }, { ask: [['그만둔다', ''], ['공격한다', '!war']] }],
    t2: [{ t: '꺼져', img: 'C-036_art' }, { ask: [['그만둔다', ''], ['공격한다', '!war']] }],
    t3: [{ narr: '그는 대꾸하지 않는다. 담배 연기만 길게 내뿜는다.', img: 'C-036_art' }, { ask: [['그만둔다', ''], ['공격한다', '!war']] }] } };
// v7.22.1 토끼마차를 건드림: 확정 패배 이벤트 (6성 창병 청갑 · 4성 서폿 아이텐 — 전투는 나중에 제대로)
const TALK_WAR = [{ narr: '청갑이 담배를 비벼 끄고 천천히 창을 든다.', img: 'C-036_art', npc: 'cheong' }, { t: '고객님, 이러시면 곤란해요.', img: 'C-033_art', npc: 'aiten' }, { box: '...눈 깜짝할 사이였다.' }, { go: '!lose' }];""")
rep("const ENC_LIVE = ['sleep', 'awake', 'sit', 'greeted', 'declined'];", "const ENC_LIVE = ['sleep', 'awake', 'sit', 'greeted', 'declined', 'shop', 'smoke'];")
rep("function encCur(){ const C = S.camp; if (!C || C.end || !world || !world.camp || C.s !== 3) return null; const E = ((C.stages || {})[3] || {}).enc; return E && NPC[E.npc] ? E : null; }",
    "function encCur(){ const C = S.camp; if (!C || C.end || !world || !world.camp || C.s !== 3) return null; const E = ((C.stages || {})[3] || {}).enc; return E && NPC[E.npc] ? E : null; }\nfunction encAll(){ const E = encCur(); if (!E) return []; const st = S.camp.stages[3]; return [E, ...(st.enc2 || []).filter(q => q && NPC[q.npc])]; }   // v7.22.1 장면 인물 여럿 (곁의 인물)")
rep("const encNear = () => { const E = encCur(); return encLive(E) && E.seen && !world.over && encDist(world, E) <= 6; };",
    "const encNear = () => !!world && !world.over && encAll().some(E => encLive(E) && E.seen && encDist(world, E) <= 6);")
# encTick: 인물마다
rep("function encTick(Wd){\n  const E = encCur(); if (!E || TK || !encLive(E) || Wd.over) return; const N = NPC[E.npc],",
    "function encTick(Wd){ const L = encAll(); if (!L.length) return; for (const E of L){ if (TK || SH) break; encTick1(Wd, E); } const nb = encNear(); if (nb !== !!Wd.encNearB){ Wd.encNearB = nb; campBarRender(); } }\nfunction encTick1(Wd, E){\n  if (TK || !encLive(E) || Wd.over) return; const N = NPC[E.npc],")
rep("  const nb = encNear(); if (nb !== !!E.nearB){ E.nearB = nb; campBarRender(); }\n  if (!E.seen && sees){ E.seen = true; logEv(Wd, { k: 'encSeen', npc: E.npc }); talkLines([{ narr: N.seen, img: N.img }]); return; }",
    "  if (!E.seen && sees){ E.seen = true; logEv(Wd, { k: 'encSeen', npc: E.npc }); talkLines([{ narr: N.seen, img: N.img }], E.npc, E); return; }")
rep("E.st = 'greeted'; logEv(Wd, { k: 'encGreet', npc: E.npc }); talkOpen(E.npc, 'greet'); }", "E.st = 'greeted'; logEv(Wd, { k: 'encGreet', npc: E.npc }); talkOpen(E.npc, 'greet', E); }")
rep("function encTalk(){\n  const E = encCur(); if (!encLive(E)) return; const Wd = world, d = encDist(Wd, E);",
    "function encTalk(E){\n  const Wd = world; if (!E){ let bd = 99; for (const q of encAll()) if (encLive(q) && (q.seen || $('seeAll').checked)){ const dq = encDist(Wd, q); if (dq < bd){ bd = dq; E = q; } } }   // v7.22.1 가장 가까운 인물\n  if (!encLive(E)) return; const d = encDist(Wd, E), N = NPC[E.npc];")
rep("  talkOpen(E.npc, E.st === 'declined' ? 'declined' : E.st === 'sit' ? (E.st = 'greeted', 'greet') : 'start');\n}",
    "  talkOpen(E.npc, N.node ? N.node(E) : E.st === 'declined' ? 'declined' : E.st === 'sit' ? (E.st = 'greeted', 'greet') : 'start', E);\n}")
rep("function encClick(w){ const E = encCur(); if (!encLive(E) || !(E.seen || $('seeAll').checked) || Math.hypot(w.x - E.x, w.y - E.y) > 0.8) return false; encTalk(); return true; }",
    "function encClick(w){ const E = encAll().find(q => encLive(q) && (q.seen || $('seeAll').checked) && Math.hypot(w.x - q.x, w.y - q.y) <= 0.8); if (!E) return false; encTalk(E); return true; }")
rep("function encJoin(){ const E = encCur(); if (!E) return;", "function encJoin(E){ E = E || encCur(); if (!E) return;")
rep("function encFoe(){ const E = encCur(); if (!E) return;", "function encFoe(E){ E = E || encCur(); if (!E) return;")
# 대화 창: 인물 · 사각형 나레이션
rep("function talkOpen(npc, node){ const T = (TALK[npc] || {})[node]; if (!T) return; talkLines(T, npc); }\nfunction talkLines(lines, npc){",
    "function talkOpen(npc, node, E){ const T = (TALK[npc] || {})[node]; if (!T) return; talkLines(T, npc, E); }\nfunction talkLines(lines, npc, E){")
rep("  Object.assign(TK, { npc: npc || null, lines, i: 0 });", "  Object.assign(TK, { npc: npc || null, E: E || null, lines, i: 0 });")
rep("  const N = TK.npc ? NPC[TK.npc] : null, E = encCur(), known = E && (E.st === 'joined' || E.st === 'foe');\n  $('talk').classList.toggle('tk-narr', !!L.narr); $('tkName').textContent = L.narr ? '' : N ? (known ? N.key : N.who) : '';\n  talkPic(L.img, N ? N.ref : null);",
    "  const N = NPC[L.npc || TK.npc] || null, E = L.npc ? null : TK.E, known = !!E && (E.st === 'joined' || E.st === 'foe');\n  $('talk').classList.toggle('tk-narr', !!L.narr); $('talk').classList.toggle('tk-boxed', !!L.box); $('tkName').textContent = L.narr || L.box ? '' : N ? (known ? N.key : N.who) : '';   // v7.22.1 box = 사각형 나레이션\n  talkPic(L.box ? null : L.img, L.box || !N ? null : N.ref);")
rep("  const full = L.t || L.narr || '', el = $('tkText');", "  const full = L.t || L.narr || L.box || '', el = $('tkText');")
rep("talkOpen(TK.npc, nx); }", "talkOpen(TK.npc, nx, TK.E); }")
rep("  const N = TK && TK.npc ? NPC[TK.npc] : null, E = encCur();\n  if (a === '!join'){ talkClose(); encJoin(); return; }",
    "  const N = TK && TK.npc ? NPC[TK.npc] : null, E = (TK && TK.E) || encCur();\n  if (a === '!join'){ talkClose(); encJoin(E); return; }")
rep("  if (a === '!foe2'){ talkClose(); encFoe(); return; }\n  talkClose();",
    "  if (a === '!foe2'){ talkClose(); encFoe(E); return; }\n  if (a === '!shop'){ talkClose(); shopOpen(E); return; }   // v7.22.1 토끼마차\n  if (a === '!war'){ TK.lines = TALK_WAR; TK.i = 0; talkShow(); return; }\n  if (a === '!lose'){ talkClose(); encWar(); return; }\n  talkClose();")
# 판 그림: 여럿 · 마차 · 담배 연기
rep("  { const E = !ed ? encCur() : null; if (encLive(E)) drawNpc(Wd, E, ox, oy, ts, see); }   // v7.22 장면 인물",
    "  if (!ed) for (const E of encAll()) if (encLive(E)) drawNpc(Wd, E, ox, oy, ts, see);   // v7.22 장면 인물 (v7.22.1 여럿)")
rep("  if (!(see || E.seen || litAt(Wd, x, y))) return;\n  const px = ox + x * ts, py = oy + (y - lift) * ts, r = 0.36 * ts, fi = faceOf(N.ref);",
    "  if (!(see || E.seen || litAt(Wd, x, y))) return;\n  const px = ox + x * ts, py = oy + (y - lift) * ts, r = 0.36 * ts, fi = faceOf(N.ref);\n  if (N.cart) drawCart(ox + N.cart.x * ts, oy + N.cart.y * ts, ts);   // v7.22.1 토끼마차")
rep("const lb = (encNear() ? '💬 ' : '') + N.who,", "const lb = (E.seen && encDist(Wd, E) <= 6 ? '💬 ' : '') + N.who,")
rep("ctx.fillStyle = '#f0dca0'; ctx.fillText(lb, px, py + r + 3 + Math.max(13, ts * 0.36) / 2);\n}",
    """ctx.fillStyle = '#f0dca0'; ctx.fillText(lb, px, py + r + 3 + Math.max(13, ts * 0.36) / 2);
  if (N.smoke) for (let k = 0; k < 4; k++){ const ph = ((now / 1600) + k / 4) % 1; ctx.globalAlpha = 0.45 * (1 - ph); ctx.fillStyle = '#c9c6cf'; ctx.beginPath(); ctx.arc(px + r * 0.7 + Math.sin(ph * 6 + k) * ts * 0.1, py - r - ph * ts * 0.9, ts * (0.06 + ph * 0.12), 0, 6.283); ctx.fill(); } ctx.globalAlpha = 1;   /* v7.22.1 담배 연기 */
}
// v7.22.1 토끼마차: 나무 짐칸 · 바퀴 둘 · 등불 · 토끼 귀 간판
function drawCart(cx, cy, ts){
  const w = ts * 2.4, h = ts * 1.3; ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(cx + 4, cy + h * 0.55, w * 0.55, ts * 0.3, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#5a3e26'; ctx.fillRect(cx - w / 2, cy - h / 2, w, h); ctx.strokeStyle = '#3a2716'; ctx.lineWidth = 2; for (let k = 1; k < 4; k++){ ctx.beginPath(); ctx.moveTo(cx - w / 2, cy - h / 2 + h * k / 4); ctx.lineTo(cx + w / 2, cy - h / 2 + h * k / 4); ctx.stroke(); }
  ctx.fillStyle = '#d9cbb0'; ctx.beginPath(); ctx.moveTo(cx - w / 2 - 3, cy - h / 2); ctx.quadraticCurveTo(cx, cy - h * 1.05, cx + w / 2 + 3, cy - h / 2); ctx.fill();
  ctx.fillStyle = '#2b2219'; for (const sx of [-1, 1]){ ctx.beginPath(); ctx.arc(cx + sx * w * 0.32, cy + h / 2, ts * 0.3, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#7a5a36'; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.fillStyle = '#f2e6cf'; for (const sx of [-1, 1]){ ctx.beginPath(); ctx.ellipse(cx + sx * ts * 0.16, cy - h * 0.95, ts * 0.08, ts * 0.24, sx * 0.25, 0, 6.283); ctx.fill(); }
  const g = ctx.createRadialGradient(cx - w * 0.42, cy - h * 0.55, 0, cx - w * 0.42, cy - h * 0.55, ts * 0.5); g.addColorStop(0, 'rgba(255,214,140,.95)'); g.addColorStop(1, 'rgba(255,170,80,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx - w * 0.42, cy - h * 0.55, ts * 0.5, 0, 6.283); ctx.fill();
}
// ---------- v7.22.1 거래 (토끼마차) ----------
// 가치: 화폐가 통일되지 않은 세상 — 물건마다 숫자. 건네면 그만큼 쌓이고 · 쌓인 가치로 삼 (탄은 반값으로 받음)
const SHOP = [{ id: 'arrow', name: '화살 10발', it: { k: 'ammo', at: '화살', n: 10 }, cost: 10, stock: 6 }, { id: 'norm', name: '일반 탄 10발', it: { k: 'ammo', at: '일반', n: 10 }, cost: 12, stock: 6 },
  { id: 'spec', name: '특수 탄 4발', it: { k: 'ammo', at: '특수', n: 4 }, cost: 12, stock: 6 }, { id: 'pot', name: '회복약', it: { k: 'potion', name: '회복약', label: '' }, cost: 15, stock: 5 }];
const VAL_W = { 날붙이: 10, 둔기: 9, 활: 12, 총포류: 18 }, VAL_A = { 판금: 26, 사슬: 16, 경갑: 14, 가죽: 7, 방탄: 20, 투구: 10, 두건: 6 };
function itemVal(it){ const d = it.dur != null ? Math.max(0.2, Math.min(1, it.dur / 100)) : 1;
  if (it.k === 'ammo') return Math.max(0, Math.round((it.n || 0) * (it.at === '특수' ? 2 : 1) * 0.5));
  if (it.k === 'potion') return 8;
  if (it.k === 'weapon'){ const w = rules.weapons[it.name] || {}; return w.kind === '마법' || ITEM_NATURAL.includes(it.name) ? 0 : Math.max(1, Math.round((VAL_W[w.kind] || 8) * d)); }
  if (it.k === 'shield') return Math.max(1, Math.round(10 * d));
  if (it.k === 'armor' || it.k === 'helm') return Math.max(1, Math.round((VAL_A[it.mat] || 6) * Math.max(1, it.tier || 1) / 2 * d));
  return 1; }
let SH = null;   // 열린 거래 창 { prev, say }
const shopState = () => { const st = S.camp.stages[3]; return st.shop || (st.shop = { credit: 0, left: Object.fromEntries(SHOP.map(x => [x.id, x.stock])), to: null }); };
const shopParty = () => world.units.filter(u => u.side === 0 && u.alive).map(u => S.units.find(p => p.id === u.pid)).filter(Boolean);
function ammoFit(p, at){ const st = stackOf(at), bag = p.bag || []; return bag.reduce((a, x) => a + (x.k === 'ammo' && x.at === at ? Math.max(0, st - x.n) : 0), 0) + Math.max(0, bagCapP(rules, p) - bag.length) * st; }
function shopOpen(E){
  const P = shopParty(), T = shopState(), any = P.some(p => (p.bag || []).some(it => itemVal(it) > 0));
  if (!T.credit && !any){ talkLines([{ t: '고객님. 쓸 만한 물건이 없으신걸요.', img: 'C-033_art', npc: 'aiten' }], 'aiten', E); return; }
  if (!SH){ SH = { prev: paused }; if (mode === 'run') paused = true; } SH.say = SH.say || '천천히 보세요, 고객님.'; logEv(world, { k: 'shopOpen' }); shopRender();
}
function shopRender(){
  const b = $('banner'), T = shopState(), P = shopParty(); if (!T.to || !P.some(p => p.id === T.to)) T.to = (P.find(p => p.hero) || P[0] || {}).id;
  b.className = 'banner shop'; b.innerHTML = `<b>토끼마차 1호점</b><span>가진 물건을 건네면 가치가 쌓여요 · 쌓인 가치로 사요 · 산 것은 받는 동료의 가방으로 (다음 맵부터 지님)</span>
    <div class="shop"><div class="shd"><span>쌓인 가치 <b id="shCr">${T.credit}</b></span><label>받는 동료 <select id="shTo">${P.map(p => `<option value="${esc(String(p.id))}" ${p.id === T.to ? 'selected' : ''}>${esc(p.name)} (가방 ${(p.bag || []).length}/${bagCapP(rules, p)})</option>`).join('')}</select></label></div>
    <div class="shs"><h5>파는 것</h5>${SHOP.map(x => `<div class="shr"><span>${x.it.k === 'potion' ? '🧪' : '➶'} ${esc(x.name)}<small>남음 ${T.left[x.id]}</small></span><button class="btn sm go" type="button" data-shbuy="${x.id}" ${T.credit < x.cost || T.left[x.id] <= 0 ? 'disabled' : ''}>${x.cost} 로 사기</button></div>`).join('')}</div>
    <div class="shs"><h5>건넬 것 (가방)</h5>${P.map(p => (p.bag || []).map((it, i) => ({ it, i, v: itemVal(it) })).filter(o => o.v > 0).map(o => `<div class="shr"><span>${INV_IC[o.it.k] || '·'} ${esc(itName(o.it))}<small>${esc(p.name)} · 가치 ${o.v}</small></span><button class="btn sm" type="button" data-shsell="${esc(String(p.id))}:${o.i}">건네기</button></div>`).join('')).join('') || '<p class="lnone">건넬 만한 물건이 없어요</p>'}</div>
    <p class="shsay"><i style="${faceCss(faceOf('C-033'), 28)}"></i>${esc(SH.say)}</p></div>
    <div class="row"><button class="btn" type="button" id="shClose">닫기</button></div>`;
  b.hidden = false; $('shClose').onclick = shopClose; $('shTo').onchange = e => { T.to = isNaN(+e.target.value) ? e.target.value : +e.target.value; shopRender(); };
}
function shopBuy(id){
  const T = shopState(), x = SHOP.find(q => q.id === id), p = S.units.find(q => q.id === T.to); if (!x || !p || T.left[id] <= 0 || T.credit < x.cost) return;
  if (x.it.k === 'ammo' ? ammoFit(p, x.it.at) < x.it.n : bagRoom(p, x.it)){ SH.say = `${p.name}의 가방에 자리가 모자라요, 고객님.`; shopRender(); return; }
  bagPut(p, clone(x.it)); T.credit -= x.cost; T.left[id]--; SH.say = '많이 이용해 주세요.'; logEv(world, { k: 'shopBuy', name: x.name, to: p.name, cost: x.cost, credit: T.credit }); save(); shopRender();
}
function shopSell(key){
  const [pid, si] = key.split(':'), p = S.units.find(q => String(q.id) === pid), i = +si, T = shopState(), it = p && (p.bag || [])[i]; if (!it) return; const v = itemVal(it); if (!(v > 0)) return;
  p.bag.splice(i, 1); const u = world.units.find(q => q.pid === p.id);
  if (u && u.bag){ if (it.k === 'ammo'){ let n = it.n || 0; for (const x of u.bag) if (x.k === 'ammo' && x.at === it.at && n > 0){ const m = Math.min(n, x.n); x.n -= m; n -= m; } u.bag = u.bag.filter(x => !(x.k === 'ammo' && x.n <= 0)); }   // 지금 판의 가방에서도 뺌 (넘어갈 때 되살아나지 않게)
    else { const j = u.bag.findIndex(x => x.k === it.k && x.name === it.name && (x.label || '') === (it.label || '')); if (j >= 0) u.bag.splice(j, 1); } }
  T.credit += v; SH.say = v >= 15 ? '좋은 물건이네요, 고객님.' : '받았습니다.'; logEv(world, { k: 'shopSell', name: itName(it), from: p.name, val: v, credit: T.credit }); save(); shopRender();
}
function shopClose(){ $('banner').hidden = true; if (SH){ const pv = SH.prev; SH = null; if (mode === 'run') paused = pv; } hud(); campBarRender(true); }
$('banner').addEventListener('click', e => { if (!SH) return; const b = e.target.closest('button'); if (!b || b.disabled) return; if (b.dataset.shbuy){ shopBuy(b.dataset.shbuy); return; } if (b.dataset.shsell){ shopSell(b.dataset.shsell); return; } });
// 토끼마차를 건드린 대가: 확정 패배
function encWar(){
  const C = S.camp, Wd = world; if (!C || !Wd) return; logEv(Wd, { k: 'encWar' });
  for (const u of Wd.units) if (u.side === 0 && u.alive){ u.alive = false; u.hp = 0; u.act = null; const p = S.units.find(q => q.id === u.pid); if (p) C.fallen.push(p.name); }
  Wd.over = true; Wd.result = 'lose'; mode = 'plan'; cont = false; paused = false; C.why = '토끼마차를 건드렸다'; campLogSave(Wd, C.s); C.log.push({ s: C.s, t: +Wd.t.toFixed(1), res: 'war', kills: 0, party: [] }); campEnd('wipe'); hud();
}""")
# campBuild: 곁의 인물
rep("  if (NP && !st.enc) st.enc = { npc: E3.npc, st: NP.sleep ? 'sleep' : 'sit', x: NP.x, y: NP.y, seen: false, n: 0 };",
    "  if (NP && !st.enc) st.enc = { npc: E3.npc, st: NP.st0 || (NP.sleep ? 'sleep' : 'sit'), x: NP.x, y: NP.y, seen: false, n: 0 };\n  if (NP && E3.more && !st.enc2) st.enc2 = E3.more.map(k => ({ npc: k, st: NPC[k].st0 || 'sit', x: NPC[k].x, y: NPC[k].y, seen: false, n: 0 }));   // v7.22.1 곁의 인물")
rep("<b>${kind === 'clear' ? '무덤이 열리고 계단이 나타났다' : '1F 에서 전멸했다'}</b>", "<b>${kind === 'clear' ? '무덤이 열리고 계단이 나타났다' : C.why ? esc(C.why) : '1F 에서 전멸했다'}</b>")
# 회복약: 가방 · 마시기
rep("const INV_IC = { weapon: '🗡', shield: '🛡', armor: '🥋', helm: '⛑', ammo: '➶' };", "const INV_IC = { weapon: '🗡', shield: '🛡', armor: '🥋', helm: '⛑', ammo: '➶', potion: '🧪' };")
rep("${u.side === 0 && u.alive && !Wd.over && (it.k === 'weapon' || it.k === 'shield') ? ` <button type=\"button\" class=\"ivb\" data-bswap=\"${it.uid}\" data-u=\"${u.i}\" ${canHold(Wd, u, it) ? '' : 'disabled'}>들기</button>` :",
    "${u.side === 0 && u.alive && !Wd.over && it.k === 'potion' ? ` <button type=\"button\" class=\"ivb\" data-bswap=\"${it.uid}\" data-u=\"${u.i}\" ${u.hp < u.max ? '' : 'disabled'}>마시기</button>` : u.side === 0 && u.alive && !Wd.over && (it.k === 'weapon' || it.k === 'shield') ? ` <button type=\"button\" class=\"ivb\" data-bswap=\"${it.uid}\" data-u=\"${u.i}\" ${canHold(Wd, u, it) ? '' : 'disabled'}>들기</button>` :")
rep("u.order = { k: 'swap', uid: it.uid }; noteOrders([u]); toast(`${u.name} — 가방에서 ${itName(it)} 꺼내 듦`); hud(); });",
    "u.order = { k: 'swap', uid: it.uid }; noteOrders([u]); toast(it.k === 'potion' ? `${u.name} — ${itName(it)} 마심 (${(rules.potion || {}).drink || 1}초)` : `${u.name} — 가방에서 ${itName(it)} 꺼내 듦`); hud(); });")
rep("act = `<div class=\"iva\">${it.k !== 'ammo' ? `<button", "act = `<div class=\"iva\">${it.k !== 'ammo' && it.k !== 'potion' ? `<button")
rep("  if (a.k === 'bagSwap') return `가방에서 꺼내는 중 (${f2(a.left)}초)`;   // v7.20", "  if (a.k === 'bagSwap') return `가방에서 꺼내는 중 (${f2(a.left)}초)`;   // v7.20\n  if (a.k === 'drink') return `회복약을 마시는 중 (${f2(a.left)}초)`;   // v7.22.1")
# 로그 · 이야기
rep("      case 'encFollow': out.push(", """      case 'drink': out.push(`${T(e)}🧪 ${n(e.a)} ${reul(e.w)} 마심 +${e.amt} (${e.hp})`); break;   // v7.22.1
      case 'shopOpen': out.push(`${T(e)}🐰 토끼마차 — 거래 창`); break;
      case 'shopBuy': out.push(`${T(e)}🐰 ${e.name} 삼 → ${e.to}의 가방 (가치 −${e.cost} · 남은 ${e.credit})`); break;
      case 'shopSell': out.push(`${T(e)}🐰 ${e.from}의 ${reul(e.name)} 건넴 (가치 +${e.val} · 쌓인 ${e.credit})`); break;
      case 'encWar': out.push(`${T(e)}☠ 토끼마차를 건드림 — 확정 패배`); break;
      case 'encFollow': out.push(""")
rep("    case 'encFollow': return { c: 'good', s:", """    case 'drink': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 회복약을 단숨에 들이켠다.` };   // v7.22.1
    case 'shopBuy': return { c: 'dim', s: '"많이 이용해 주세요."' };
    case 'encWar': return { c: 'bad', s: '...눈 깜짝할 사이였다.' };
    case 'encFollow': return { c: 'good', s:""")
# CSS: 사각형 나레이션 · 거래 창
rep("/* v7.21.2 정산 창 */", """/* v7.22.1 사각형 나레이션 · 거래 창 */
.talk.tk-boxed{align-items:center;background:rgba(6,5,8,.78)}
.talk.tk-boxed .tk-pic{display:none}
.talk.tk-boxed .tk-box{flex:0 1 auto;width:min(520px,100%);margin:0 auto;padding:26px 24px;text-align:center;border:2px solid #d9a94e;border-radius:4px;min-height:0}
.talk.tk-boxed .tk-box b{display:none}
.talk.tk-boxed .tk-box p{font:700 20px/1.5 var(--display);color:#f2e6cf;letter-spacing:.04em}
.banner.shop{width:min(560px,calc(100% - 16px));max-height:calc(100% - 16px);overflow:auto;text-align:left;background:rgba(20,17,22,.97)}
.banner.shop b{text-align:center}
.banner .shop{display:flex;flex-direction:column;gap:10px;margin-top:8px}
.banner .shd{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;font:500 13px var(--body)}
.banner .shd b{display:inline;font:800 18px var(--mono);color:#d9a94e}
.banner .shd select{min-height:36px}
.banner .shs h5{margin:0 0 4px;font:700 12px var(--body);color:#a39a8c;letter-spacing:.04em}
.banner .shr{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px dashed #3a3240}
.banner .shr span{font:600 13px var(--body);color:#ece4d6}
.banner .shr small{display:block;font:500 11px var(--mono);color:#a39a8c}
.banner .shr .btn{min-height:36px;flex:0 0 auto}
.banner .shsay{display:flex;align-items:center;gap:8px;margin:0;font:italic 500 13px var(--body);color:#e6d3a3}
.banner .shsay i{flex:0 0 28px;width:28px;height:28px;border-radius:6px}
/* v7.21.2 정산 창 */""")

rep("  if (!C || C.end || (world && world.over && !$('banner').hidden)){", "  if (!C || C.end || (world && world.over && !$('banner').hidden) || (!$('banner').hidden && $('banner').classList.contains('shop'))){")   # v7.22.1 거래 창이 열리면 띠를 숨김
rep("  b.hidden = false; $('shClose').onclick = shopClose;", "  b.hidden = false; campBarRender(true); $('shClose').onclick = shopClose;")
open(F, 'w', encoding='utf-8').write(s)
print('page7221 OK')
