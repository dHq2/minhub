# v7.22.0 페이지 — page722.py v1.3 (v1.3: 대화 창 클래스 이름을 tk- 로 (이야기 칸 .narr 과 겹쳐 창이 작아지던 것) · v1.2: 적이 없는 맵 (만남) 이 시작하자마자 끝나던 것 · v1.1: 공격하면 마주 보던 상대를 앎 (맞았을 때와 같은 hunt) · 5단계 인카운터 1: 3S 에 들어설 때 만남을 뽑음 (파티에 있는 인물의 만남은 빠짐) · 대화 창 (말하는 이의 그림 · 이름 · 한 글자씩 · 선택지 · 나레이션) · 장면 인물 (싸움 셈 밖 — 말 걸기 · 공격하면 그 자리에서 적 · 영입하면 동료) · 친칠라 (얕은 호수 · 졸고 있음 · 깜짝 도약 · 말 걸기 셋 · 동행 제안) · 탕아 (가운데 불빛 · 장비 무더기 · 인사 · 같이 가자) · 그냥 넘어가면 다음 맵에 따라옴 · 얕은 물 그림 · 친칠라의 후드)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.21.4 (2026-10-18)', '<!-- 굴의 전투판 v7.22.0 (2026-10-18)')
rep('     v7.21.4: ', '''     v7.22.0: 5단계 인카운터 — 3S 에 들어설 때 만남을 뽑음 (전투 셋 · 친칠라 · 탕아 — 파티에 있는 인물의 만남은 빠짐).
         대화 창: 말하는 이의 그림 (대화 표정 · 원화) · 이름 · 한 글자씩 · 선택지 · 나레이션. 창이 열린 동안 판은 멈춤.
         장면 인물: 싸움 셈 밖 (아무도 노리지 않음). 말 걸기 (가까이 · 판에서 누르거나 캠페인 띠 '말 걸기'). 공격하면 그 자리에서 적 · 영입하면 동료.
         친칠라: 얕은 호수 (물 속 걸음 0.7 배 · 양쪽 같음) · 바위에서 졸고 있음 · 다가가면 깜짝 도약 · 말 걸기 셋 · 동행 제안. 쓰러뜨리면 하얀 나무 · 친칠라의 후드.
         탕아: 가운데 불빛 · 장비 무더기와 시체 · 다가가면 인사 · 같이 가자 / 두고 간다. 둘 다 그냥 넘어가면 다음 맵에서 따라옴.
         친칠라의 후드 (두건): 막지는 못하고 쓰면 숨는 솜씨가 적어도 B.
     v7.21.4: ''')
rep('h1::after{content:" v7.21.4"', 'h1::after{content:" v7.22.0"')
rep('<footer>굴의 전투판 v7.21.4', '<footer>굴의 전투판 v7.22.0')
rep('return `굴의 전투판 v7.21.4 · ${title}', 'return `굴의 전투판 v7.22.0 · ${title}')
rep("copyText('굴의 전투판 v7.21.4 자동 판 기록", "copyText('굴의 전투판 v7.22.0 자동 판 기록")
rep('의 버전 기록에 — v7.21.4 로그 받기 (받기 기능)', '의 버전 기록에 — v7.22.0 인카운터 · 대화 창 (친칠라 · 탕아) / v7.21.4 로그 받기 (받기 기능)')
rep('">v7.21.4 · 1F 캠페인 · 로그 받기</span>', '">v7.22.0 · 1F 인카운터 · 대화</span>')
rep("ver: '7.21.4', at:", "ver: '7.22.0', at:")

# 친칠라의 후드 (두건) — 주운 장비 · 후드 (설정 그대로)
rep("weapon: '하얀 나무', ammo: 30,", "weapon: '하얀 나무', ammo: 30, gear: { 머리: { name: '친칠라의 후드', mat: '두건', tier: 1 } },")

rep("note: '어떤 만남인지는 들어서야 앎 (대화형은 5단계)',", "note: '어떤 만남인지는 들어서야 앎',")

# ---------- 인카운터 · 대화 ----------
rep("function campPlace(m, units, y0, y1, x0, x1){", r"""// v7.22 5단계 인카운터: 3S 에 처음 들어설 때 뽑음 (파티 · 쓰러짐 · 버림에 있는 인물의 만남은 빠짐) — fight = CAMP_S[3].pick 번호 · npc = 장면 인물
const ENC3 = [
  { k: 'f0', name: '똥개 무리', w: 1, fight: 0 }, { k: 'f1', name: '똥개와 기사', w: 1, fight: 1 }, { k: 'f2', name: '기사들', w: 1, fight: 2 },
  { k: 'chin', name: '잠든 사냥꾼', w: 1.2, npc: 'chin' }, { k: 'tang', name: '불가에 앉은 이', w: 1.2, npc: 'tang' }];
// 장면 인물: 싸움 셈 밖 (아무도 노리지 않고 노려지지도 않음) — 말 걸기 · 공격 (그 자리에서 적) · 영입 (동료). map = 그 맵 (물 · 횃불 · 더미)
const NPC = {
  chin: { key: '친칠라', ref: 'C-106', who: '활을 든 인물', x: 16.5, y: 5.2, rock: true, sleep: true, img: 'C-106_talk06',
    map: { water: [{ x: 15, y: 9, rx: 7.5, ry: 2.6 }, { x: 23, y: 10.8, rx: 4.2, ry: 2 }, { x: 8, y: 11.6, rx: 3.2, ry: 1.5 }], torches: [], piles: [] },
    seen: '활을 든 인물이 졸고 있다.', wake: '...(깜짝)', pass: '누군가 따라온 것 같다. ...내비둘까', foeLine: '활시위가 소리 없이 당겨진다.' },
  tang: { key: '탕아', ref: 'C-221', who: '불가에 앉은 사내', x: 16.5, y: 8.4, img: 'C-221_art',
    map: { water: [], torches: [{ x: 16.5, y: 9.6 }], piles: ['14,9,1', '14,10,1', '15,11,1', '13,10,2', '18,10,2', '19,8,2', '18,11,1'] },
    seen: '어둠 한가운데 작은 불빛. 장비 무더기와 시체 곁에 누군가 앉아 있다.', pass: '멀찍이서 무거운 발소리가 따라온다. ...그였다.', foeLine: '사내가 천천히 대검을 쥐고 일어선다.' } };
// 대화: 줄 = { t (말) | narr (나레이션), img } · { ask: [[단추, 다음]] } (다음 = 마디 · '' 닫기 · '!join' '!foe' '!decline') · { go: '!…' }
const TALK = {
  chin: {
    start: [{ narr: '말을 걸어도 대답이 없다. 노려보기만 한다.', img: 'C-106_talk03' }, { ask: [['계속 말을 건다', 'q1'], ['그만둔다', ''], ['공격한다', '!foe']] }],
    q1: [{ t: '...너, 어디로 가는 거야?', img: 'C-106_talk09' }, { ask: [['(위쪽 길을 가리킨다)', 'q2'], ['그만둔다', '']] }],
    q2: [{ t: '...응.. 일단 간다고? 흐음..', img: 'C-106_talk08' }, { narr: '그녀는 말이 통하는 사람을 아주 오랜만에 본 듯 하였습니다. 동행을 제안해 볼까요?', img: 'C-106_talk04' }, { ask: [['동행을 제안한다', 'join'], ['그만둔다', '!decline']] }],
    join: [{ narr: '...뚫어져라 쳐다보다가, 말없이 활을 챙긴다.', img: 'C-106_talk10' }, { go: '!join' }],
    declined: [{ narr: '그녀는 더는 눈길을 주지 않는다.', img: 'C-106_talk06' }, { ask: [['그만둔다', ''], ['공격한다', '!foe']] }] },
  tang: {
    greet: [{ t: '....오, 오랜만에 보는 살아있는 사람이군.', img: 'C-221_art' }, { narr: '그는 더 이상 아무 말도 하지 않고 다시 멍하니 걸터앉았다.', img: 'C-221_art' }],
    start: [{ narr: '함께 가자고 손짓한다.', img: 'C-221_art' }, { t: '같이 가자고?', img: 'C-221_art' }, { ask: [['같이 가자', 'join'], ['두고 간다', '!decline'], ['공격한다', '!foe']] }],
    join: [{ t: '....그래. 언제까지 이렇게 있을 순 없지. 오래 있었어. 정말 오래.', img: 'C-221_art' }, { go: '!join' }],
    declined: [{ narr: '그는 다시 불빛만 멍하니 바라본다.', img: 'C-221_art' }, { ask: [['그만둔다', ''], ['공격한다', '!foe']] }] } };
const ENC_LIVE = ['sleep', 'awake', 'sit', 'greeted', 'declined'];
function encPick(C, party){
  const have = new Set([...party.map(p => p.name), ...(C.fallen || []), ...(C.lost || [])]), L = ENC3.filter(e => !e.npc || !have.has(NPC[e.npc].key));
  let r = Math.random() * L.reduce((a, e) => a + e.w, 0); for (const e of L){ r -= e.w; if (r <= 0) return e; } return L[0];
}
const enc3Of = C => { const st = (C.stages || {})[3] || {}; return ENC3.find(e => e.k === st.e3) || ENC3[C.n3 || 0] || ENC3[0]; };
function encCur(){ const C = S.camp; if (!C || C.end || !world || !world.camp || C.s !== 3) return null; const E = ((C.stages || {})[3] || {}).enc; return E && NPC[E.npc] ? E : null; }
const encLive = E => !!E && ENC_LIVE.includes(E.st);
const encDist = (Wd, E) => Math.min(99, ...Wd.units.filter(u => u.alive && u.side === 0).map(u => Math.hypot(u.x - E.x, u.y - E.y)));
const encNear = () => { const E = encCur(); return encLive(E) && E.seen && !world.over && encDist(world, E) <= 6; };
// 다가감 · 보임: 처음 보이면 나레이션 · 졸던 친칠라는 3칸 안이면 깜짝 도약 · 탕아는 불빛 안 4칸이면 인사
function encTick(Wd){
  const E = encCur(); if (!E || TK || !encLive(E) || Wd.over) return; const N = NPC[E.npc], al = Wd.units.filter(u => u.alive && u.side === 0); if (!al.length) return;
  let nu = null, nd = 99; for (const u of al){ const d = Math.hypot(u.x - E.x, u.y - E.y); if (d < nd){ nd = d; nu = u; } }
  const lit = litAt(Wd, E.x, E.y), sees = al.some(u => { const d = Math.hypot(u.x - E.x, u.y - E.y); return d <= (lit ? Wd.rules.sight : u.nv ? 4.5 : 2.2); });
  const nb = encNear(); if (nb !== !!E.nearB){ E.nearB = nb; campBarRender(); }
  if (!E.seen && sees){ E.seen = true; logEv(Wd, { k: 'encSeen', npc: E.npc }); talkLines([{ narr: N.seen, img: N.img }]); return; }
  if (E.st === 'sleep' && nd <= 3) encWake(Wd, E, nu);
  else if (E.st === 'sit' && nd <= 4 && lit){ E.st = 'greeted'; logEv(Wd, { k: 'encGreet', npc: E.npc }); talkOpen(E.npc, 'greet'); }
}
function encWake(Wd, E, from){
  const N = NPC[E.npc], a = from ? Math.atan2(E.y - from.y, E.x - from.x) : -Math.PI / 2; E.st = 'awake'; E.hop = { fx: E.x, fy: E.y, t0: performance.now() };
  for (let k = 2.4; k > 0.4; k -= 0.4){ const tx = Math.max(1, Math.min(Wd.map.W - 1, E.x + Math.cos(a) * k)), ty = Math.max(1.4, Math.min(Wd.map.H - 1.4, E.y + Math.sin(a) * k)); if (!rock(Wd.map, tx, ty)){ E.x = +tx.toFixed(2); E.y = +ty.toFixed(2); break; } }
  E.bub = { t: N.wake || '...!', until: performance.now() + 2200 }; logEv(Wd, { k: 'encWake', npc: E.npc, x: E.x, y: E.y });
}
function encTalk(){
  const E = encCur(); if (!encLive(E)) return; const Wd = world, d = encDist(Wd, E);
  if (!(d <= 6)){ toast(`가까이 가야 말을 걸 수 있어요 (아군이 6칸 안 · 지금 ${d.toFixed(1)}칸)`); return; }
  if (E.st === 'sleep'){ let nu = null, nd = 99; for (const u of Wd.units) if (u.alive && u.side === 0){ const q = Math.hypot(u.x - E.x, u.y - E.y); if (q < nd){ nd = q; nu = u; } } encWake(Wd, E, nu); }
  E.seen = true; E.n = (E.n || 0) + 1; logEv(Wd, { k: 'encTalk', npc: E.npc, n: E.n });
  talkOpen(E.npc, E.st === 'declined' ? 'declined' : E.st === 'sit' ? (E.st = 'greeted', 'greet') : 'start');
}
function encClick(w){ const E = encCur(); if (!encLive(E) || !(E.seen || $('seeAll').checked) || Math.hypot(w.x - E.x, w.y - E.y) > 0.8) return false; encTalk(); return true; }
function encMake(E, side){ const N = NPC[E.npc], p = { ...fromDesign(designByKey(N.key), side), x: E.x, y: E.y }; lockIdentity(p); S.units.push(p); return addUnit(world, p); }
function encJoin(){ const E = encCur(); if (!E) return; const u = encMake(E, 0); E.st = 'joined'; logEv(world, { k: 'encJoin', npc: E.npc, a: u.i, name: u.name }); save(); hud(); campBarRender(true); toast(`${ga(u.name)} 동료가 됐어요 — 함께 넘어가요`); }
function encFoe(){ const E = encCur(); if (!E) return; const u = encMake(E, 1), Wd = world; E.st = 'foe';
  { let a = null, d0 = 99; for (const o of Wd.units) if (o.alive && o.side === 0){ const q = Math.hypot(o.x - u.x, o.y - u.y); if (q < d0){ d0 = q; a = o; } } if (a){ u.state = 'hunt'; u.target = a; u.last = { x: a.x, y: a.y }; u.searchT = 6; u.sense[a.i] = { x: a.x, y: a.y, t: Wd.t, exact: true }; } }   // 마주 보고 말하던 상대 — 누군지 앎 (맞았을 때와 같음)
  logEv(world, { k: 'encFoe', npc: E.npc, a: u.i, name: u.name }); save(); hud(); campBarRender(true); toast(`${wa(u.name)} 싸움이 벌어졌어요`); }
// 넘어갈 때: 장면 인물이 아직 그대로면 (공격 · 거절 · 영입 없이) 따라옴 — 다음 맵 시작에 나레이션
function encFollow(C, s, party){
  const E = s === 3 ? ((C.stages || {})[3] || {}).enc : null; if (!E || !['sleep', 'awake', 'sit', 'greeted'].includes(E.st) || !party.length) return;
  const N = NPC[E.npc], p = fromDesign(designByKey(N.key), 0); lockIdentity(p); party.push(p); E.st = 'followed'; C.follow = { t: N.pass, img: N.img, name: N.key };
}
// ---------- 대화 창 ----------
let TK = null;
const talkImgOk = new Set(), talkImgBad = new Set();
function talkPic(img, ref){
  const el = $('tkPic'), im = $('tkImg'); el.classList.remove('tk-face'); el.style.cssText = ''; if (!img && !ref){ $('talk').classList.add('tk-nopic'); return; } $('talk').classList.remove('tk-nopic');
  const face = () => { el.classList.add('tk-face'); im.removeAttribute('src'); el.style.cssText = faceCss(faceOf(ref), 120); };
  if (!img || talkImgBad.has(img)){ face(); return; }
  im.onerror = () => { talkImgBad.add(img); face(); }; im.onload = () => talkImgOk.add(img); im.src = `art/${img}.webp`;
}
function talkOpen(npc, node){ const T = (TALK[npc] || {})[node]; if (!T) return; talkLines(T, npc); }
function talkLines(lines, npc){
  if (!TK){ TK = { prev: paused }; if (mode === 'run') paused = true; }
  Object.assign(TK, { npc: npc || null, lines, i: 0 }); $('talk').hidden = false; talkShow();
}
function talkShow(){
  const L = TK.lines[TK.i]; if (!L){ talkClose(); return; }
  if (L.go){ talkDo(L.go); return; }
  if (L.ask){ $('tkNx').hidden = true; $('tkCh').innerHTML = L.ask.map(([lb, nx], k) => `<button class="btn${/^!foe/.test(nx) ? ' warn' : k === 0 ? ' go' : ''}" type="button" data-tk="${esc(nx)}">${esc(lb)}</button>`).join(''); return; }
  const N = TK.npc ? NPC[TK.npc] : null, E = encCur(), known = E && (E.st === 'joined' || E.st === 'foe');
  $('talk').classList.toggle('tk-narr', !!L.narr); $('tkName').textContent = L.narr ? '' : N ? (known ? N.key : N.who) : '';
  talkPic(L.img, N ? N.ref : null); $('tkCh').innerHTML = ''; $('tkNx').hidden = true;
  const full = L.t || L.narr || '', el = $('tkText'); clearInterval(TK.timer); TK.full = full; TK.n = 0; el.textContent = '';
  TK.timer = setInterval(() => { TK.n += 2; el.textContent = full.slice(0, TK.n); if (TK.n >= full.length) talkDone(); }, 32);
}
function talkDone(){ if (!TK) return; clearInterval(TK.timer); TK.timer = null; $('tkText').textContent = TK.full; const nx = TK.lines[TK.i + 1]; if (nx && nx.ask){ TK.i++; talkShow(); } else $('tkNx').hidden = false; }
function talkAdv(){ if (!TK) return; if (TK.timer){ talkDone(); return; } const L = TK.lines[TK.i]; if (L && L.ask) return; TK.i++; talkShow(); }
function talkPick(nx){ if (!TK) return; if (!nx){ talkClose(); return; } if (nx[0] === '!'){ talkDo(nx); return; } talkOpen(TK.npc, nx); }
function talkDo(a){
  const N = TK && TK.npc ? NPC[TK.npc] : null, E = encCur();
  if (a === '!join'){ talkClose(); encJoin(); return; }
  if (a === '!decline'){ if (E){ E.st = 'declined'; logEv(world, { k: 'encDecline', npc: E.npc }); save(); } talkClose(); campBarRender(true); return; }
  if (a === '!foe'){ TK.lines = [{ narr: N ? N.foeLine : '싸움이 시작된다.', img: N ? N.img : null }, { go: '!foe2' }]; TK.i = 0; talkShow(); return; }
  if (a === '!foe2'){ talkClose(); encFoe(); return; }
  talkClose();
}
function talkClose(){ if (!TK) return; clearInterval(TK.timer); const pv = TK.prev; TK = null; $('talk').hidden = true; if (mode === 'run') paused = pv; hud(); }
$('talk').addEventListener('click', e => { const b = e.target.closest('button[data-tk]'); if (b){ talkPick(b.dataset.tk); return; } if (e.target.closest('.tk-box') || e.target === $('talk')) talkAdv(); });
// 판 위 장면 인물 그림 (바위 · 졸음 zzz · 놀람 말풍선 · 이름) — 보일 때만
function drawNpc(Wd, E, ox, oy, ts, see){
  const N = NPC[E.npc], now = performance.now(); let x = E.x, y = E.y, lift = 0;
  if (E.hop && now - E.hop.t0 < 380){ const k = (now - E.hop.t0) / 380, q = 1 - (1 - k) * (1 - k); x = E.hop.fx + (E.x - E.hop.fx) * q; y = E.hop.fy + (E.y - E.hop.fy) * q; lift = Math.sin(k * Math.PI) * 0.6; }
  if (!(see || E.seen || litAt(Wd, x, y))) return;
  const px = ox + x * ts, py = oy + (y - lift) * ts, r = 0.36 * ts, fi = faceOf(N.ref);
  if (N.rock){ const rx = ox + N.x * ts, ry = oy + (N.y + 0.25) * ts; ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(rx + 3, ry + 4, ts * 0.55, ts * 0.32, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#4a4650'; ctx.beginPath(); ctx.ellipse(rx, ry, ts * 0.52, ts * 0.3, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.ellipse(rx - ts * 0.12, ry - ts * 0.08, ts * 0.22, ts * 0.1, -0.3, 0, 6.283); ctx.fill(); }
  ctx.save(); ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.fillStyle = '#1c1a20'; ctx.fill(); ctx.clip();
  if (fi >= 0 && atlasOK) ctx.drawImage(atlas, (fi % FACE.COLS) * FACE.S, Math.floor(fi / FACE.COLS) * FACE.S, FACE.S, FACE.S, px - r, py - r, r * 2, r * 2);
  if (E.st === 'sleep'){ ctx.fillStyle = 'rgba(10,8,14,.35)'; ctx.fillRect(px - r, py - r, r * 2, r * 2); }
  ctx.restore(); ctx.setLineDash([4, 3]); ctx.strokeStyle = '#e0c06a'; ctx.lineWidth = Math.max(1.6, r * 0.14); ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (E.st === 'sleep') for (let k = 0; k < 3; k++){ const ph = ((now / 900) + k / 3) % 1; ctx.globalAlpha = 1 - ph; ctx.fillStyle = '#cfd8ff'; ctx.font = `700 ${Math.round(ts * (0.26 + k * 0.06))}px sans-serif`; ctx.fillText('z', px + r * 0.8 + ph * ts * 0.35, py - r - ph * ts * 0.7); } ctx.globalAlpha = 1;
  if (E.bub && now < E.bub.until){ ctx.font = `700 ${Math.max(11, Math.round(ts * 0.34))}px IBM Plex Sans KR, sans-serif`; const t = E.bub.t, tw = ctx.measureText(t).width + 12, bx = px - tw / 2, by = py - r - ts * 0.75; ctx.fillStyle = 'rgba(245,238,224,.95)'; ctx.fillRect(bx, by, tw, ts * 0.46); ctx.fillStyle = '#1a1520'; ctx.fillText(t, px, by + ts * 0.23); }
  ctx.font = `600 ${Math.max(10, Math.round(ts * 0.28))}px IBM Plex Sans KR, sans-serif`; const lb = (encNear() ? '💬 ' : '') + N.who, lw = ctx.measureText(lb).width + 8; ctx.fillStyle = 'rgba(10,8,12,.75)'; ctx.fillRect(px - lw / 2, py + r + 3, lw, Math.max(13, ts * 0.36)); ctx.fillStyle = '#f0dca0'; ctx.fillText(lb, px, py + r + 3 + Math.max(13, ts * 0.36) / 2);
}
function campPlace(m, units, y0, y1, x0, x1){""")

# 3S: 들어설 때 뽑음 · 장면 인물 맵
rep("world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0); if (S.camp && !S.camp.end) world.camp = true;", "world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0); if (S.camp && !S.camp.end){ world.camp = true; world.over = false; world.result = null; checkEnd(world); }   // v7.22 적이 없는 맵 (만남) 도 캠페인 판이면 끝나지 않음")
rep("  const C = S.camp, def = CAMP_S[s], st = C.stages[s] || (C.stages[s] = { seed: 1 + Math.floor(Math.random() * 999999), tseed: 1 + Math.floor(Math.random() * 999999) });",
    "  const C = S.camp, def = CAMP_S[s], st = C.stages[s] || (C.stages[s] = { seed: 1 + Math.floor(Math.random() * 999999), tseed: 1 + Math.floor(Math.random() * 999999) });\n  if (s === 3 && !st.seen && !st.e3) st.e3 = encPick(C, party).k;   // v7.22 3S 만남은 들어설 때 뽑음\n  const E3 = s === 3 ? enc3Of(C) : null, NP = E3 && E3.npc ? NPC[E3.npc] : null;\n  if (NP && !st.enc) st.enc = { npc: E3.npc, st: NP.sleep ? 'sleep' : 'sit', x: NP.x, y: NP.y, seen: false, n: 0 };")
rep("  Object.assign(S, { type: 'grid', W: 32, H: 20, mapC: false, randStart: !st.seen, seed: st.seed, flips: [], torches: [], terr: '1F', tseed: st.tseed, piles: st.piles || [], hills: st.hills || [], pileOff: [] });",
    "  Object.assign(S, { type: 'grid', W: 32, H: 20, mapC: false, randStart: !st.seen, seed: st.seed, flips: [], torches: NP ? clone(NP.map.torches) : [], terr: NP ? '' : '1F', tseed: st.tseed, piles: st.piles || (NP ? NP.map.piles.slice() : []), hills: st.hills || [], pileOff: [], water: NP ? clone(NP.map.water) : [] });   // v7.22 장면 인물 맵 (물 · 불빛 · 더미)")
rep("(def.pick ? def.pick[C.n3][1] : def.foes).flatMap(", "(E3 ? (E3.fight != null ? def.pick[E3.fight][1] : []) : def.foes).flatMap(")
rep("  logEv(world, { k: 'campIn', s, name: def.name, kind: def.kind + (def.pick ? ' — ' + def.pick[C.n3][0] : ''), from, back: !!st.seen });\n  if (!st.seen) toast(`1F · ${def.name} ${def.kind}${def.pick ? ' — ' + def.pick[C.n3][0] : ''} · ${def.note}`);",
    "  logEv(world, { k: 'campIn', s, name: def.name, kind: def.kind + (E3 ? ' — ' + E3.name : ''), from, back: !!st.seen });\n  if (C.follow){ const f = C.follow; delete C.follow; logEv(world, { k: 'encFollow', name: f.name }); setTimeout(() => talkLines([{ narr: f.t, img: f.img }]), 350); }   // v7.22 그냥 지나친 만남 인물이 따라옴\n  if (!st.seen) toast(`1F · ${def.name} ${def.kind}${E3 ? ' — ' + E3.name : ''} · ${def.note}`);")
rep("${def.pick ? ' — ' + esc(def.pick[C.n3][0]) : ''}${W && W.cleared ? ' · 🏳 끝난 맵' : ''}", "${C.s === 3 ? ' — ' + esc(enc3Of(C).name) : ''}${W && W.cleared ? ' · 🏳 끝난 맵' : ''}")
# 넘어갈 때 따라옴
rep("  const dir = (dirs.up || 0) >= (dirs.down || 0) ? 'up' : 'down', ns = s + (dir === 'up' ? 1 : -1); save();",
    "  const dir = (dirs.up || 0) >= (dirs.down || 0) ? 'up' : 'down', ns = s + (dir === 'up' ? 1 : -1); if (dir === 'up') encFollow(C, s, party); save();   // v7.22 그냥 지나친 만남 인물")
rep("if (B) Object.assign(S, clone(B));", "if (B) Object.assign(S, clone(B)); S.water = (B && B.water) || [];   // v7.22 얕은 물은 캠페인 맵에만")
# 캠페인 띠: 말 걸기
rep('<span class="cb">${W && !W.over ? `', '<span class="cb">${encNear() ? \'<button class="btn sm go" type="button" data-ctalk="1" title="가까이 있는 만남 인물에게 말을 검">💬 말 걸기</button>\' : \'\'}${W && !W.over ? `')
rep("  if (b.dataset.clog){", "  if (b.dataset.ctalk){ encTalk(); return; }   // v7.22\n  if (b.dataset.clog){")
# 판 누름: 장면 인물을 누르면 말 걸기
rep("  if (mode === 'edit'){ if (d.right) editErase(w); else editClick(w); } else if (d.touch) touchTap(w); else if (d.right) rightClick(w, e.shiftKey); else playClick(w, e.shiftKey);",
    "  if (mode !== 'edit' && !d.right && encClick(w)) return;   // v7.22 장면 인물을 누르면 말 걸기\n  if (mode === 'edit'){ if (d.right) editErase(w); else editClick(w); } else if (d.touch) touchTap(w); else if (d.right) rightClick(w, e.shiftKey); else playClick(w, e.shiftKey);")
# 매 틀: 다가감 · 보임
rep("  const Wd = W_();\n  if (MOB && Wd && mode !== 'edit') mobFollow(Wd, dt);", "  const Wd = W_();\n  if (Wd && mode !== 'edit' && Wd.camp) encTick(Wd);   // v7.22 장면 인물\n  if (MOB && Wd && mode !== 'edit') mobFollow(Wd, dt);")
# 그리기: 장면 인물
rep("  // 말\n  const now = Wd.t;", "  { const E = !ed ? encCur() : null; if (encLive(E)) drawNpc(Wd, E, ox, oy, ts, see); }   // v7.22 장면 인물\n  // 말\n  const now = Wd.t;")
# 얕은 물 그림
rep("  const m = MAP; if (!m || (!m.hills && !m.piles)) return;", r"""  const m = MAP; if (!m || (!m.hills && !m.piles && !m.water)) return;
  if (m.water) for (const w of m.water){ const cx = w.x * P, cy = w.y * P, g0 = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w.rx, w.ry) * P);   /* v7.22 얕은 물 */
    g0.addColorStop(0, 'rgba(40,86,120,.62)'); g0.addColorStop(1, 'rgba(30,64,96,.38)'); g.fillStyle = g0; g.beginPath(); g.ellipse(cx, cy, w.rx * P, w.ry * P, 0, 0, 6.283); g.fill();
    g.strokeStyle = 'rgba(160,210,240,.35)'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(cx, cy, w.rx * P, w.ry * P, 0, 0, 6.283); g.stroke();
    const R = mulberry32(Math.round(w.x * 97 + w.y * 13)); g.strokeStyle = 'rgba(190,230,255,.22)'; g.lineWidth = 1; for (let k = 0; k < Math.round(w.rx * w.ry); k++){ const a = R() * 6.283, q = Math.sqrt(R()) * 0.8, x = cx + Math.cos(a) * w.rx * P * q, y = cy + Math.sin(a) * w.ry * P * q; g.beginPath(); g.ellipse(x, y, P * (0.18 + R() * 0.2), P * 0.05, 0, 0, 6.283); g.stroke(); } }""")
# 키보드: 대화 창이 열리면 Space · Enter = 다음
rep("  const k = e.key.toLowerCase();\n  if (k === '?' ||", "  const k = e.key.toLowerCase();\n  if (TK){ if (k === ' ' || (k === 'enter' && !e.target.closest('button'))){ e.preventDefault(); talkAdv(); } return; }   // v7.22 대화 창\n  if (k === '?' ||")
# 로그 · 이야기
rep("      case 'campIn': out.push(", """      case 'encSeen': out.push(`${T(e)}👁 ${NPC[e.npc].who} 을(를) 발견`); break;   // v7.22 인카운터
      case 'encWake': out.push(`${T(e)}❗ ${NPC[e.npc].who} — 깜짝 놀라 뒤로 뛰어 물러남`); break;
      case 'encGreet': out.push(`${T(e)}💬 ${NPC[e.npc].who} — 인사`); break;
      case 'encTalk': out.push(`${T(e)}💬 ${NPC[e.npc].who} 에게 말을 검 (${e.n}번째)`); break;
      case 'encJoin': out.push(`${T(e)}🤝 ${ga(e.name)} 동료가 됨`); break;
      case 'encFoe': out.push(`${T(e)}⚔ ${wa(e.name)} 싸움이 벌어짐`); break;
      case 'encDecline': out.push(`${T(e)}… ${NPC[e.npc].who} — 따라오지 않음`); break;
      case 'encFollow': out.push(`${T(e)}👣 ${ga(e.name)} 뒤따라 옴`); break;
      case 'campIn': out.push(""")
rep("    case 'campIn': return { c: 'dim', s: `1F · ${e.name} — ${e.kind}.` };", """    case 'campIn': return { c: 'dim', s: `1F · ${e.name} — ${e.kind}.` };
    case 'encSeen': return { c: 'dim', s: NPC[e.npc].seen };   // v7.22 인카운터
    case 'encWake': return { c: 'dim', s: `${ga(NPC[e.npc].who)} 화들짝 놀라 뒤로 뛰어 물러난다.` };
    case 'encJoin': return { c: 'good', s: `${ga(e.name)} 일행에 합류했다.` };
    case 'encFoe': return { c: 'bad', s: NPC[e.npc].foeLine };
    case 'encFollow': return { c: 'good', s: NPC[ENC3.find(x => x.npc && NPC[x.npc].key === e.name).npc].pass };""")
# 대화 창 HTML · CSS
rep('<div class="gacha" id="gacha" hidden role="dialog" aria-label="굴에 떨어진 이들"></div>', '<div class="gacha" id="gacha" hidden role="dialog" aria-label="굴에 떨어진 이들"></div><div class="talk" id="talk" hidden role="dialog" aria-label="대화"><div class="tk-in"><div class="tk-pic" id="tkPic"><img id="tkImg" alt=""></div><div class="tk-box" id="tkBox"><b id="tkName"></b><p id="tkText"></p><div class="tk-ch" id="tkCh"></div><span class="tk-nx" id="tkNx" hidden>▸</span></div></div></div>')
rep("/* v7.21.2 정산 창 */", """/* v7.22 대화 창 */
.talk{position:fixed;inset:0;z-index:55;background:linear-gradient(to top,rgba(6,5,8,.9),rgba(6,5,8,.3) 55%,rgba(6,5,8,.12));display:flex;align-items:flex-end;justify-content:center;padding:12px}
.talk[hidden]{display:none}
.talk .tk-in{position:relative;width:min(840px,100%);display:flex;align-items:flex-end}
.talk .tk-pic{flex:0 0 auto;width:min(300px,34vw);height:min(62vh,470px);display:flex;align-items:flex-end;justify-content:center;margin-right:-34px;position:relative;z-index:1;pointer-events:none}
.talk .tk-pic img{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 6px 18px rgba(0,0,0,.7))}
.talk .tk-pic.tk-face{flex:0 0 120px;width:120px;height:120px;border-radius:12px;border:2px solid #4a4050;margin:0 -24px 40px 0}
.talk .tk-pic.tk-face img{display:none}
.talk.tk-nopic .tk-pic{display:none}
.talk .tk-box{position:relative;flex:1 1 auto;min-height:132px;background:rgba(20,17,22,.96);border:1px solid #4a4050;border-radius:12px;padding:14px 20px 16px 48px;color:#ece4d6;box-shadow:0 10px 40px rgba(0,0,0,.6);cursor:pointer;text-align:left}
.talk.tk-nopic .tk-box{padding-left:20px}
.talk .tk-box b{display:block;font:800 15px var(--display);color:#d9a94e;margin-bottom:6px;min-height:1.1em}
.talk .tk-box p{margin:0;font:500 15.5px/1.65 var(--body);white-space:pre-wrap}
.talk.tk-narr .tk-box p{font-style:italic;color:#d6cdbd}
.talk .tk-ch{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.talk .tk-ch:empty{display:none}
.talk .tk-ch .btn{min-height:42px;padding:0 14px}
.talk .tk-nx{position:absolute;right:16px;bottom:10px;color:#d9a94e;animation:tkb 1s infinite}
@keyframes tkb{50%{opacity:.25}}
@media (max-width:640px){.talk .tk-in{flex-direction:column;align-items:stretch}.talk .tk-pic{width:auto;height:34vh;margin:0 0 -16px}.talk .tk-pic.tk-face{width:96px;height:96px;flex:0 0 96px;margin:0 auto -12px}.talk .tk-box{padding:14px 16px 16px;min-height:120px}.talk .tk-ch .btn{flex:1 1 40%}}
/* v7.21.2 정산 창 */""")

open(F, 'w', encoding='utf-8').write(s)
print('page722 OK')
