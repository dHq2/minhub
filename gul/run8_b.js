/* ---------- v8.0.0 30층 여정 — run8_b.js v1.6 (v1.6: 챔피언 로드 고리 (run8_c — 깜짝 규칙 · MC 한마디 · 관중 · 상금 배율) · 촛대 · 낙사 로그는 'r8' 글로 · v1.5: 얼굴 칸 크기 · 지도 줄은 늘어나지 않게 · 로그의 '1F ·' 뺌 · v1.4: 무리 수 동료 × (0.6 + 층 × 0.01) · 적의 시작 상황을 켬 (싸움 = 떠돎 · 정면 · 협공 · 매복 · 행군 / 정예 · 보스 = 정면) · 출구는 맵을 끝내야 열림 · v1.3: 정산 제목은 N층 · 들어서는 곳에 바로 둠 (맵 끝 칸도 · 모자라면 가까운 바닥부터) · 도감 명단에 없는 동료 (세르파) 는 적 설계로 · v1.2: 페이지가 처음 뜰 때 먼저 불려도 괜찮게 (R8READY) · 보스가 주는 동료는 자리 수를 넘어도 합류 · v1.1: 라비스 대사 그림 · v1.0: 여정 상태 · 층 지도 · 칸 · 싸움 판 · 끝난 판 · 뽑기 · 쉼터 · 상인 · 보물 · 만남 · 정산 · 결말) ---------- */
var R8READY = false;   // 모듈을 다 읽은 뒤에만 켜짐 (처음 뜰 때 campBarRender · draw 가 먼저 불려도 괜찮게)
function run8On(){ return R8READY && !!(S.camp && S.camp.run && S.camp.run.on); }
function R8S(){ return (S.camp && S.camp.run) || null; }
const r8Rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const r8Pick = L => L[Math.floor(Math.random() * L.length)];
const r8WPick = L => { let r = Math.random() * L.reduce((a, x) => a + x[1], 0); for (const x of L){ r -= x[1]; if (r <= 0) return x[0]; } return L[0][0]; };
const r8Has = k => (R8S() || {}).relics && R8S().relics.includes(k);
const r8Face = (ref, px) => `${faceCss(faceOf(ref), px)};width:${px}px;height:${px}px;flex:none;background-color:#2a2438`;
const r8Party = () => (R8S() || {}).party || [];
const NODE8 = { fight: { ic: '⚔', nm: '싸움' }, elite: { ic: '☠', nm: '정예' }, enc: { ic: '❓', nm: '만남' }, rest: { ic: '⛺', nm: '쉼터' }, shop: { ic: '🛒', nm: '상인' }, chest: { ic: '💎', nm: '보물' }, boss: { ic: '👑', nm: '보스' }, fixed: { ic: '✧', nm: '고정' }, stairs: { ic: '▼', nm: '계단' }, final: { ic: '🏟', nm: '결승' } };

// ===== 시작 · 층 =====
function r8Start(){
  const C = S.camp; if (!C) return;
  const party = S.units.filter(u => u.side === 0).map(p => ({ ...p }));
  C.end = null; delete C.t1; C.s = 1; C.stages = {};
  C.run = { v: 1, on: true, f: 1, gold: 40, relics: [], tears: 0, party, dead: [], log: [], t0: Date.now(), crowd: 50, fm: null, at: null, done: [], seen: {}, npcDone: [], flags: {} };
  $('banner').hidden = true; save();
  talkLines([{ narr: '관 바닥의 계단은 끝이 보이지 않을 만큼 길었다.' }, { narr: '횃불이 흔들린다. 바람은 아래에서 위로 분다 — 아래에, 무언가 있다.' }, { box: '30층 여정 — 층마다 갈림길을 골라 내려가세요. 10층 · 20층에서 정산할 수 있어요.' }, { go: '!r8:floor2' }]);
}
function r8FloorEnter(f){
  const R = R8S(); if (!R) return; R.f = f; R.at = null; R.done = []; R.fm = r8Gen(f); R.floorT = Date.now();
  const F = F8[f] || {}; R.log.push({ f, t: Date.now(), k: 'floor', name: F.name });
  for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, Math.round((p.hpNow != null ? p.hpNow : mx) + mx * (R8.floorHeal + (r8Has('tea') ? 0.2 : 0)))); }
  save(); world = null; mode = 'plan';
  r8FloorCard(f, () => r8DrawShow(f));
}
const r8MaxHp = p => { try { return Math.round(statsOf(p, rules).hp * (1 + 0.06 * ((R8S() || {}).tears || 0)) * (r8Has('rabis') ? 1.1 : 1)); } catch (e) { return 100; } };
// 층 카드 (나레이션)
function r8FloorCard(f, then){
  const F = F8[f] || {}, el = $('ldFx'); if (!el){ then(); return; }
  el.className = 'ldfx' + (F.band === 'stadium' ? ' lite' : ''); el.style.setProperty('--ldMs', '3200ms');
  el.innerHTML = `<div class="lf">${f}층${f >= 20 ? ' · 챔피언 로드' : ''}</div><div class="ls">${esc(F.name || '')}</div><div class="lk">${F.boss ? '👑 보스층' : F.final ? '🏟 결승' : F.fixed ? '✧ 고정층' : '갈림길'}</div>${(F.narr || []).map(t => `<p class="ln">${esc(t)}</p>`).join('')}<div class="lb"><i></i></div><div class="lh">누르면 넘어감</div>`;
  el.hidden = false; requestAnimationFrame(() => el.classList.add('on'));
  let done = false; const go = () => { if (done) return; done = true; el.classList.add('out'); setTimeout(() => { el.hidden = true; el.className = 'ldfx'; el.innerHTML = ''; }, 380); el.onclick = null; then(); };
  el.onclick = go; setTimeout(go, navigator.webdriver ? 10 : 3200);
}
// ===== 갈림길 지도 =====
function r8Gen(f){
  const F = F8[f] || {}, rows = [], nR = F.final ? 0 : 4 + (Math.random() < 0.5 ? 1 : 0);
  const W8 = [['fight', 46], ['enc', 20], ['rest', 9], ['shop', 8], ['chest', 8], ['elite', f >= 3 ? 9 : 0]];
  for (let r = 0; r < nR; r++){ const n = r === 0 ? 2 + (Math.random() < 0.4 ? 1 : 0) : 1 + Math.floor(Math.random() * 3), row = [];
    for (let i = 0; i < n; i++){ let t = r === 0 ? 'fight' : r === nR - 1 && Math.random() < 0.5 ? 'rest' : r8WPick(W8.filter(x => x[1] > 0)); row.push({ id: `n${r}_${i}`, r, i, t, x: (i + 0.5) / n, next: [] }); }
    rows.push(row); }
  if (F.elite && nR > 2){ const rr = rows[1 + Math.floor(Math.random() * (nR - 2))]; const nd = r8Pick(rr); nd.t = 'elite'; nd.e = F.elite; }
  for (const row of rows) for (const nd of row) if (nd.t === 'elite' && !nd.e) nd.e = f >= 8 && Math.random() < 0.3 ? r8Pick(['hall', 'lady']) : null;
  for (const row of rows) for (const nd of row) if (nd.t === 'elite' && !nd.e) nd.t = 'fight';
  const top = F.final ? { id: 'final', r: nR, i: 0, t: 'final', x: 0.5, next: [] } : F.boss ? { id: 'boss', r: nR, i: 0, t: 'boss', b: F.boss, x: 0.5, next: [] } : F.fixed ? { id: 'fixed', r: nR, i: 0, t: 'fixed', k: F.fixed, x: 0.5, next: [] } : { id: 'stairs', r: nR, i: 0, t: 'stairs', x: 0.5, next: [] };
  rows.push([top]);
  for (let r = 0; r < rows.length - 1; r++){ const A = rows[r], B = rows[r + 1];
    for (const a of A){ const near = B.slice().sort((p, q) => Math.abs(p.x - a.x) - Math.abs(q.x - a.x)); a.next.push(near[0].id); if (near[1] && Math.random() < 0.45) a.next.push(near[1].id); }
    for (const b of B) if (!A.some(a => a.next.includes(b.id))){ const a = A.slice().sort((p, q) => Math.abs(p.x - b.x) - Math.abs(q.x - b.x))[0]; a.next.push(b.id); } }
  return { rows };
}
const r8Node = id => { const R = R8S(); if (!R || !R.fm) return null; for (const row of R.fm.rows) for (const n of row) if (n.id === id) return n; return null; };
function r8Avail(){ const R = R8S(); if (!R || !R.fm) return []; if (!R.at) return R.fm.rows[0].map(n => n.id); const cur = r8Node(R.at); return cur && R.done.includes(cur.id) ? cur.next.slice() : [R.at]; }
// 지도 화면
function r8Css(){ if ($('r8css')) return; const st = document.createElement('style'); st.id = 'r8css'; st.textContent = `
.r8{position:fixed;inset:0;z-index:60;background:radial-gradient(ellipse at 50% 20%,#1d1830 0%,#0b0910 70%);color:#e8e2d6;overflow:auto;font-family:inherit;padding:14px 16px 90px}
.r8 h2{margin:2px 0 2px;font-size:20px;letter-spacing:.5px}.r8 .r8sub{color:#a99f8f;font-size:13px;margin-bottom:8px}
.r8 .r8top{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-bottom:6px;font-size:13px}.r8 .r8top b{color:#f0d690}
.r8 .r8rel{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}.r8 .r8rel span{background:#241f33;border:1px solid #3b3350;border-radius:8px;padding:2px 7px;font-size:12px}
.r8 .r8map{position:relative;margin:6px auto 10px;max-width:560px;height:var(--h,420px)}
.r8 .r8map svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.r8 .r8n{position:absolute;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;border:2px solid #4a4160;background:#1b1726;color:#ddd;font-size:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
.r8 .r8n small{position:absolute;bottom:-17px;font-size:10.5px;color:#a99f8f;white-space:nowrap}
.r8 .r8n.done{opacity:.45;filter:grayscale(.7)}.r8 .r8n.av{border-color:#f0c060;box-shadow:0 0 0 3px rgba(240,192,96,.25),0 0 18px rgba(240,192,96,.35);animation:r8p 1.4s infinite}
.r8 .r8n.at{border-color:#8fd18a}.r8 .r8n.sel{background:#3a2f12}.r8 .r8n.big{width:66px;height:66px;font-size:28px}
@keyframes r8p{50%{box-shadow:0 0 0 6px rgba(240,192,96,.12),0 0 22px rgba(240,192,96,.5)}}
.r8 .r8party{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.r8 .r8p{display:flex;gap:6px;align-items:center;background:#17141f;border:1px solid #2e283c;border-radius:10px;padding:4px 8px 4px 4px;font-size:12px}
.r8 .r8p i{display:block;border-radius:8px}.r8 .r8p .hb{width:62px;height:5px;background:#3a2020;border-radius:3px;overflow:hidden;margin-top:3px}.r8 .r8p .hb b{display:block;height:100%;background:#7fcf6a}
.r8 .r8go{position:fixed;left:0;right:0;bottom:0;background:linear-gradient(transparent,#0b0910 40%);padding:16px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.r8 .r8desc{max-width:560px;margin:0 auto;color:#cfc6b6;font-size:13px;min-height:34px;text-align:center}
.r8pan{max-width:560px;margin:10px auto;background:#17141f;border:1px solid #2e283c;border-radius:12px;padding:12px}.r8pan h3{margin:0 0 6px}
.r8pan .row{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.r8card{display:inline-flex;flex-direction:column;align-items:center;gap:4px;width:150px;padding:10px;border-radius:12px;background:#221d2e;border:1px solid #3b3350;text-align:center;font-size:12px;vertical-align:top;margin:4px}
.r8card b{font-size:14px}.r8card .ic{font-size:30px}.r8card.back{background:#2a2140;cursor:pointer;min-height:150px;justify-content:center;font-size:40px}
.r8mc{margin:2px 0 4px;color:#ffb3d9;font-size:13px}
.r8crowd{display:inline-block;width:120px;height:8px;background:#2a2238;border-radius:4px;overflow:hidden;vertical-align:middle}.r8crowd b{display:block;height:100%;background:linear-gradient(90deg,#7a5cff,#ff5ca8)}
`; document.head.appendChild(st); }
let r8Sel = null;
function r8MapShow(){
  const R = R8S(); if (!R || !R.on) return; r8Css();
  let el = $('run8'); if (!el){ el = document.createElement('div'); el.id = 'run8'; el.className = 'r8'; document.body.appendChild(el); }
  el.hidden = false; el.classList.remove('hide');
  const F = F8[R.f] || {}, rows = R.fm.rows, av = r8Avail(), H = 90 + rows.length * 86;
  const pos = n => ({ x: 8 + n.x * 84, y: 100 - ((n.r + 0.6) / (rows.length + 0.4)) * 100 });
  let lines = ''; for (const row of rows) for (const n of row){ const a = pos(n); for (const id of n.next){ const b = pos(r8Node(id)); const on = R.done.includes(n.id) && (R.at === n.id) && av.includes(id); lines += `<line x1="${a.x}%" y1="${a.y}%" x2="${b.x}%" y2="${b.y}%" stroke="${on ? '#f0c060' : R.done.includes(n.id) && R.done.includes(id) ? '#8fd18a' : '#3b3350'}" stroke-width="${on ? 3 : 2}" stroke-dasharray="${on ? '' : '5 5'}" vector-effect="non-scaling-stroke"/>`; } }
  const nodes = rows.flat().map(n => { const p = pos(n), N = NODE8[n.t] || {}, big = ['boss', 'fixed', 'final', 'stairs'].includes(n.t);
    const lb = n.t === 'elite' ? (ELITE8[n.e] || {}).name || '정예' : n.t === 'boss' ? r8BossName(n.b) : n.t === 'fixed' ? r8FixedName(n.k) : N.nm;
    return `<button type="button" class="r8n${big ? ' big' : ''}${R.done.includes(n.id) ? ' done' : ''}${av.includes(n.id) ? ' av' : ''}${R.at === n.id ? ' at' : ''}${r8Sel === n.id ? ' sel' : ''}" data-r8n="${n.id}" style="left:${p.x}%;top:${p.y}%">${N.ic || '?'}<small>${esc(lb)}</small></button>`; }).join('');
  const mcl = typeof r8McLine === 'function' ? r8McLine() : '';   // v8.1
  const crowd = R.f >= 20 ? `<span>관중 열기 <span class="r8crowd"><b style="width:${Math.round(R.crowd)}%"></b></span></span>` : '';
  el.innerHTML = `<h2>${R.f}층 · ${esc(F.name || '')}</h2>${mcl ? `<div class="r8mc">🎤 MC 더 플링: "${esc(mcl)}"</div>` : ''}<div class="r8sub">${F.final ? '결승 — 링 위에서 1대1' : F.boss ? '보스가 기다리는 층' : '갈림길 — 빛나는 칸을 골라 나아가세요'}</div>
    <div class="r8top"><span>👛 <b>${R.gold}</b></span><span>💧 여신의 눈물 <b>${R.tears}</b></span><span>동료 <b>${R.party.length}</b>/${R8.cap}</span>${crowd}<span style="color:#8a8070">${r8Elapsed()}</span></div>
    <div class="r8rel">${R.relics.length ? R.relics.map(k => `<span title="${esc((RELIC8[k] || {}).d || '')}">${(RELIC8[k] || {}).ic || '?'} ${esc((RELIC8[k] || {}).name || k)}</span>`).join('') : '<span style="opacity:.6">유물 없음</span>'}</div>
    <div class="r8map" style="--h:${H}px"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>${nodes}</div>
    <div class="r8desc" id="r8desc">${r8Sel ? esc(r8NodeDesc(r8Node(r8Sel))) : '빛나는 칸을 누르면 무엇이 있는지 보여요.'}</div>
    <div class="r8party">${R.party.map(p => { const mx = r8MaxHp(p), hp = p.hpNow != null ? p.hpNow : mx; return `<div class="r8p"><i style="${r8Face(p.ref, 34)}"></i><div><b>${esc(p.name)}</b>${p.hero ? ' 🔥' : ''}<div class="hb"><b style="width:${Math.max(0, Math.min(100, Math.round(hp / mx * 100)))}%"></b></div><small>${hp}/${mx}</small></div></div>`; }).join('')}</div>
    <div class="r8go">${r8Sel && av.includes(r8Sel) ? `<button class="btn go" type="button" data-r8="enter">${(NODE8[r8Node(r8Sel).t] || {}).ic} 들어가기</button>` : ''}<button class="btn" type="button" data-r8="party">동료 정리</button><button class="btn" type="button" data-r8="log">여정 기록</button><button class="btn" type="button" data-r8="quit">그만두기</button></div>`;
}
function r8Elapsed(){ const R = R8S(); if (!R) return ''; const m = Math.round((Date.now() - R.t0) / 60000); return m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60}분` : `${m}분`; }
const r8BossName = b => b === 'regina' ? '레지나' : b === 'neo' ? ((R8S() || {}).neo === 'neospirit' ? '사슴' : (R8S() || {}).neo === 'neodemon' ? '대악마 하딤' : '네오의 문') : (BOSS8[b] || {}).name || '보스';
const r8FixedName = k => ({ goddess: '여신의 호수' }[k] || k);
function r8NodeDesc(n){
  if (!n) return '';
  const T = { fight: '그 층의 무리와 싸움 — 이기면 동전 · 가끔 유물', elite: `정예: ${(ELITE8[n.e] || {}).name || ''} — 강하지만 유물을 줌`, enc: '누군가 · 무언가를 만남 (말 · 거래 · 싸움 · 영입)', rest: '쉬기 (모두 회복) 또는 수련 (한 명 성장)', shop: '상인 — 동전으로 유물 · 약 · 탄', chest: '보물 — 유물 하나 (가끔 함정)', stairs: '아래층으로 내려가는 계단', boss: `보스: ${r8BossName(n.b)}`, fixed: r8FixedName(n.k), final: '결승 — 글리치 챔피언과 1대1' };
  return `${(NODE8[n.t] || {}).ic} ${T[n.t] || ''}`;
}
document.addEventListener('click', e => {
  const el = e.target.closest('#run8'); if (!el) return;
  const nb = e.target.closest('[data-r8n]'); if (nb){ const id = nb.dataset.r8n; if (r8Avail().includes(id)){ if (r8Sel === id){ r8Enter(r8Node(id)); return; } r8Sel = id; } else { r8Sel = id; } r8MapShow(); return; }
  const b = e.target.closest('[data-r8]'); if (!b) return; const k = b.dataset.r8;
  if (k === 'enter' && r8Sel){ r8Enter(r8Node(r8Sel)); return; }
  if (k === 'party'){ r8PartyPanel(); return; }
  if (k === 'log'){ try { campLogDownload(); } catch (x) { toast('기록을 받을 수 없어요'); } return; }
  if (k === 'quit'){ if (confirm('여정을 그만둘까요? (이 진행은 사라져요)')){ r8Hide(); campQuit(); } return; }
});
function r8Hide(){ const el = $('run8'); if (el) el.hidden = true; }

// ===== 칸에 들어감 =====
function r8Enter(n){
  const R = R8S(); if (!R || !n) return; r8Sel = null; R.at = n.id; save();
  if (n.t === 'stairs'){ R.done.push(n.id); r8Next(); return; }
  if (n.t === 'rest'){ r8RestPanel(n); return; }
  if (n.t === 'shop'){ r8ShopPanel(n); return; }
  if (n.t === 'chest'){ r8ChestPanel(n); return; }
  if (n.t === 'enc'){ r8Enc(n); return; }
  if (n.t === 'fixed'){ r8Fixed(n); return; }
  if (n.t === 'final'){ r8Final(n); return; }
  if (n.t === 'boss' && n.b === 'regina'){ r8NpcNode(n, 'regina'); return; }
  r8Hide(); r8Battle(n);
}
function r8Next(){ const R = R8S(); if (!R) return; if (R.f >= F8_MAX){ r8End('true'); return; } r8FloorEnter(R.f + 1); }
// 싸움 판 (그림 맵)
function r8MapFor(n){
  const R = R8S(), F = F8[R.f] || {};
  if (n.t === 'boss' && n.b === 'neo'){ const k = R.neo || (R.neo = Math.random() < 0.5 ? 'neodemon' : 'neospirit'); return BOSS8[k].map; }
  const L = (F.maps || []).filter(k => MAPS8[k]); return L.length ? r8Pick(L) : null;
}
function r8Foes(n){
  const R = R8S(), f = R.f, F = F8[f] || {};
  if (n.t === 'elite') return (ELITE8[n.e] || ELITE8.hall).foes.flatMap(([k, c]) => Array.from({ length: c }, () => k));
  if (n.t === 'boss'){ let B = BOSS8[n.b]; if (n.b === 'neo') B = BOSS8[R.neo || 'neodemon']; if (B.waves) return B.waves[0].slice(0, 1).flatMap(([k, c]) => Array.from({ length: c }, () => k)); return (B.foes || []).flatMap(([k, c]) => Array.from({ length: c }, () => k)); }
  const P = BAND8[F.band] || BAND8.sewer, nP = R.party.length, n0 = Math.max(R8.foeN[0], Math.min(R8.foeN[1] + 2, Math.round(nP * (0.6 + f * 0.01) + Math.random() * 1.6)));
  return Array.from({ length: n0 }, () => r8WPick(P));
}
function r8Battle(n, waveK){
  const C = S.camp, R = R8S(), id = r8MapFor(n), M = id ? MAPS8[id] : null, party = R.party.filter(p => !R.dead.includes(p.name));
  const keys = n.t === 'boss' && n.b === 'gods' ? BOSS8.gods.waves[waveK || 0].length && Array.from({ length: BOSS8.gods.waves[waveK || 0][1] }, () => BOSS8.gods.waves[waveK || 0][0]) : r8Foes(n);
  const foes = keys.map(k => foe8(k, R.f)); n.foeKeys = keys;
  C.s = 1; C.stages = { 1: { seed: 1 + Math.floor(Math.random() * 999999), tseed: 1 + Math.floor(Math.random() * 999999), r8: true } }; const st = C.stages[1];
  const flips = [], piles = [];
  if (M){ for (let y = 0; y < M.NY; y++) for (let x = 0; x < M.NX; x++){ const c = M.rows[y][x]; if (c === '#') flips.push(x + ',' + y); else if (c === 'r') piles.push(`${x},${y},4`); } }
  Object.assign(S, { type: 'grid', W: M ? M.NX : 32, H: M ? M.NY : 20, amb: M ? M.amb : 0.15, mapC: false, randStart: true, seed: st.seed, flips, torches: [], terr: M ? '' : '1F', tseed: st.tseed, piles, hills: [], pileOff: [], indoor: !!M, zones: [], sandY: null, water: [], startK: n.t === 'fight' ? r8Pick(['roam', 'front', 'pincer', 'ambush', 'column']) : 'front' });
  S.art8 = id || null; S.hall = false; S.room = false; S.regina = false; S.holdClear = false;
  const rule = typeof r8CrowdRule === 'function' ? r8CrowdRule(n) : null;   // v8.1 깜짝 규칙 (암전은 판을 만들기 전에)
  const pre = r8Pre(party);
  S.units = [...party, ...foes]; rebuildMap();
  const m = buildMap(S), inn = M && M.in ? M.in : [Math.floor(S.W / 2) - 5, S.H - 3, Math.floor(S.W / 2) + 5, S.H - 1];
  r8PlaceIn(m, party, inn);
  r8PlaceFar(m, foes, inn);
  selId = null; rebuildMap(); setMapUI(); save(); start(); renderFloors(); pre();
  r8Post(world);
  if (world){ world.explored && world.explored.fill(2); const o = M && M.out ? M.out : [Math.floor(S.W / 2), 0]; world.stairs = { x: o[0] + 0.5, y: o[1] + 0.5, r: 0.9 }; world.entry = { x: (inn[0] + inn[2]) / 2 + 0.5, y: (inn[1] + inn[3]) / 2 + 0.5, r: 1.6 }; world.r8 = { node: n.id, t: n.t, wave: waveK || 0, rule }; world.exitLock = true; if (M && M.fall) world.fall8 = true; }
  logEv(world, { k: 'campIn', s: 1, name: `${R.f}층 ${(NODE8[n.t] || {}).nm}`, kind: n.t === 'elite' ? (ELITE8[n.e] || {}).name : n.t === 'boss' ? r8BossName(n.b) : (F8[R.f] || {}).name, bt: null, from: 'down', back: false, r8: true });
  jrIn(C, 1, 'down', st, null, null);
  const B = n.t === 'boss' ? (n.b === 'neo' ? BOSS8[R.neo] : BOSS8[n.b]) : null;
  const intro = n.t === 'boss' ? r8BossIntro(n.b, waveK) : n.t === 'elite' ? [{ narr: `${(ELITE8[n.e] || {}).name} — 길을 막고 선다.` }] : [{ narr: r8Pick(F8[R.f].narr || ['어둠 속에서 무언가 움직인다.']) }];
  if (typeof crowdOn === 'function' && crowdOn()) intro.unshift(...r8CrowdIntro(n, rule || 'none'));   // v8.1 MC 더 플링
  r8LoadFx(n, () => { if (intro && intro.length) talkLines(intro); });
  campBarRender(true);
}
function r8PlaceIn(m, units, inn){   // 들어서는 곳의 바닥 칸 → 모자라면 그 가운데에서 가까운 바닥 (이어진 칸만)
  const ok = (x, y) => x >= 0 && y >= 0 && x < m.W && y < m.H && m.t[y * m.W + x] === 0, inR = [];
  for (let y = inn[1]; y <= inn[3]; y++) for (let x = inn[0]; x <= inn[2]; x++) if (ok(x, y)) inR.push([x, y]);
  let cells = inR.sort(() => Math.random() - 0.5);
  if (cells.length < units.length){ const seen = new Set(cells.map(c => c + '')), q = cells.slice(); if (!q.length){ const cx = Math.floor((inn[0] + inn[2]) / 2), cy = Math.floor((inn[1] + inn[3]) / 2); q.push([cx, cy]); seen.add(cx + ',' + cy); }
    for (let i = 0; i < q.length && cells.length < units.length; i++){ const [x, y] = q[i]; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (seen.has(k) || !ok(nx, ny)) continue; seen.add(k); q.push([nx, ny]); cells.push([nx, ny]); } } }
  units.forEach((u, i) => { const c = cells[i % Math.max(1, cells.length)]; if (!c) return; const j = i >= cells.length ? 0.25 : 0; u.x = c[0] + 0.5 + (Math.random() - 0.5) * j; u.y = c[1] + 0.5 + (Math.random() - 0.5) * j; });
}
function r8PlaceFar(m, foes, inn){
  const cx = (inn[0] + inn[2]) / 2, cy = (inn[1] + inn[3]) / 2, cells = [];
  for (let y = 0; y < m.H; y++) for (let x = 0; x < m.W; x++) if (m.t[y * m.W + x] === 0) cells.push({ x, y, d: Math.hypot(x - cx, y - cy) });
  cells.sort((a, b) => b.d - a.d); const far = cells.slice(0, Math.max(foes.length * 4, Math.floor(cells.length * 0.4))), used = new Set();
  for (const u of foes){ for (let k = 0; k < 60; k++){ const c = r8Pick(far); const key = c.x + ',' + c.y; if (used.has(key)) continue; used.add(key); u.x = c.x + 0.5; u.y = c.y + 0.5; break; } }
}
// 유물 효과 (판을 만들기 전 설계 · 만든 뒤 몸)
function r8Pre(party){
  const undo = []; const add = (p, t) => { if (!(p.traits || []).includes(t)){ p.traits = [...(p.traits || []), t]; undo.push(() => { p.traits = (p.traits || []).filter(x => x !== t); }); } };
  const hero = party.find(p => p.hero) || party[0];
  if (hero && r8Has('odtear')) add(hero, '축복:오딜');
  if (r8Has('rokto')) for (const p of party){ const cur = (p.traits || []).find(t => /^은신[SABCD]$/.test(t)); const up = { D: 'C', C: 'B', B: 'A', A: 'S', S: 'S' }[cur ? cur.slice(-1) : 'D'] || 'C'; if (cur){ p.traits = p.traits.filter(t => t !== cur); undo.push(() => { p.traits = [...p.traits.filter(t => t !== '은신' + up), cur]; }); } add(p, '은신' + up); }
  if (r8Has('nurse')) for (const p of party) if (p.skill && p.skill.pool){ const s0 = p.skill.pool; p.skill.pool += 2; if (p.skLeft != null) p.skLeft += 2; undo.push(() => { p.skill.pool = s0; }); }
  return () => undo.forEach(f => f());
}
function r8Post(W){
  if (!W) return; const R = R8S(), al = W.units.filter(u => u.side === 0), hero = al.find(u => u.hero) || al[0];
  const mul = (u, k) => { const r = u.hp / u.max; u.max = Math.round(u.max * k); u.hp = Math.max(1, Math.round(u.max * r)); };
  const tk = 1 + 0.06 * R.tears; for (const u of al){ if (tk > 1) mul(u, tk); if (r8Has('rabis')) mul(u, 1.1); if (r8Has('boots')) u.spd *= 1.06; }
  if (hero && r8Has('scale')) mul(hero, 1.2);
  if (hero && r8Has('moran')) hero.ev = (hero.ev || 1) * 1.15;
  if (r8Has('gamyu')){ const big = al.filter(u => ['중대형', '대형', '초대형'].includes(sizeOf(u))).sort((a, b) => b.mass - a.mass)[0]; if (big){ big.atk = Math.round(big.atk * 1.3); big.r8gamyu = true; } }
  for (const u of al){ if (r8Has('duck') && isFar(u)) u.atk = Math.round(u.atk * 1.2); if (r8Has('branch') && /활/.test(u.weaponNow || u.weapon || '')) u.atk = Math.round(u.atk * 1.25); }
  W.r8dmg = { hero: hero ? hero.i : null, odile: r8Has('odtear') ? 0.9 : 1, mokel: r8Has('mokel') ? 0.85 : 1 };
  if (r8Has('candle')){ const c = R.flags.candle == null ? (R.flags.candle = 5) : R.flags.candle; if (c > 0 && hero) W.r8candle = { i: hero.i, left: c }; }
  if (r8Has('crown')) W.r8crown = 1;
}
// 판마다 (draw 쪽에서 부름): 촛대 · 옥상 낙사
function r8Tick(W){
  if (!W || !W.r8) return; const R = R8S(); if (!R) return;
  const c = W.r8candle; if (c && c.left > 0){ const u = W.units[c.i]; if (u && !u.alive && !u.gone && !u.down){ try { rise(W, u, 0.1); } catch (e) {} c.left--; R.flags.candle = c.left; logEv(W, { k: 'r8', s: `🕯 촛대의 불꽃 — ${u.name} 이(가) 다시 일어난다 (남은 불꽃 ${c.left})`, c: 'good', vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '🕯 다시 일어남', c: 'h', t0: W.t }); } }
  if (W.fall8) for (const u of W.units){ if (!u.alive || u.r8fell) continue; const cx = Math.floor(u.x), cy = Math.floor(u.y); if (u.kb && rock(W.map, u.x + (u.kb.dx || 0) * 0.6, u.y + (u.kb.dy || 0) * 0.6) && !solid(W.map, u.x, u.y) && W.map.t[cy * W.map.W + cx] === 0 && u.kb.left > 0.3){ u.r8fell = true; u.alive = false; u.hp = 0; u.down = false; u.kb = null; logEv(W, { k: 'r8', s: `${u.name} — 옥상 끝에서 밀려 떨어졌다!`, c: 'bad', vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '추락!', c: 'd', t0: W.t }); } }
  if (typeof r8CrowdTick === 'function') r8CrowdTick(W);   // v8.1 관중
}
function r8LoadFx(n, then){
  const R = R8S(), F = F8[R.f] || {}, el = $('ldFx'); if (!el || navigator.webdriver){ setTimeout(then, 30); return; }
  const N = NODE8[n.t] || {};
  el.className = 'ldfx'; el.style.setProperty('--ldMs', '2200ms');
  el.innerHTML = `<div class="lf">${R.f}층 · ${esc(F.name || '')}</div><div class="ls">${N.ic || ''} ${esc(n.t === 'boss' ? r8BossName(n.b) : n.t === 'elite' ? (ELITE8[n.e] || {}).name || '' : N.nm || '')}</div><div class="lk">${n.t === 'fight' ? '싸움' : ''}</div><div class="lb"><i></i></div><div class="lh">누르면 건너뜀</div>`;
  el.hidden = false; requestAnimationFrame(() => el.classList.add('on'));
  let done = false; const go = () => { if (done) return; done = true; el.classList.add('out'); setTimeout(() => { el.hidden = true; el.className = 'ldfx'; el.innerHTML = ''; }, 380); el.onclick = null; then(); };
  el.onclick = go; setTimeout(go, 2200);
}
// 판 그림 (그림 맵)
const ART8IMG = {};
function drawArt8(Wd, ox, oy, ts){
  const M = MAPS8[S.art8]; if (!M) return; const a = ART8IMG[S.art8] || (ART8IMG[S.art8] = Object.assign(new Image(), { src: M.src }));
  if (a.complete && a.naturalWidth){ const k = ts / M.cs; ctx.drawImage(a, ox, oy, M.pw * k, M.ph * k); }
  const st = Wd.stairs; if (st && Wd.cleared){ const x = ox + st.x * ts, y = oy + st.y * ts, t = performance.now() / 600; ctx.save(); ctx.strokeStyle = `rgba(240,200,110,${0.55 + 0.35 * Math.sin(t)})`; ctx.lineWidth = Math.max(2, ts * 0.08); ctx.beginPath(); ctx.arc(x, y, ts * 0.75, 0, 6.283); ctx.stroke(); ctx.fillStyle = 'rgba(240,200,110,.9)'; ctx.font = `bold ${Math.max(11, ts * 0.38)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('▼ 출구', x, y - ts * 0.95); ctx.restore(); }
}
// ===== 판을 나감 (캠페인 campOver 대신) =====
function r8Over(){
  const W = world, C = S.camp, R = R8S(); if (!W || !C || !R) return;
  const party = [], dirs = {}, rows = stageStats(W); try { campLogSave(W, 1); } catch (e) {}
  const node = r8Node(R.at) || { t: 'fight' };
  for (const u of W.units){ if (u.side !== 0) continue; const p = S.units.find(x => x.id === u.pid); if (!p) continue;
    if (u.gone === 'up' || u.gone === 'down'){ dirs[u.gone] = (dirs[u.gone] || 0) + 1; settleWorld({ units: [{ ...u, alive: true }], items: W.items }); p.hpNow = Math.round(u.hp); if (u.skill) p.skLeft = u.skill.left; else delete p.skLeft; party.push(p); }
    else if (u.gone === 'left'){ C.lost.push(p.name); } else { C.fallen.push(p.name); R.dead.push(p.name); } }
  // 판 밖에서 만난 동료 (만남 칸 영입 · 레지나 …) 도 party 에 — encJoin 은 S.units 에 넣음
  R.party = party; C.log.push({ s: 1, f: R.f, t: +W.t.toFixed(1), res: W.result, kills: (W.kills || [0])[0], party: party.map(p => p.name) });
  if (W.result === 'lose' || !party.length){ r8End('wipe'); return; }
  const up = (dirs.up || 0) >= (dirs.down || 0);
  if (!up && !W.cleared){ if (typeof r8CrowdOver === 'function') r8CrowdOver(W, node, false, true); R.at = r8PrevAt(); save(); toast('물러났어요 — 그 칸은 다시 고를 수 있어요'); world = null; r8MapShow(); return; }   // 물러남: 칸은 그대로
  for (const r of rows){ const p = party.find(x => x.id === r.pid); r.grow = p ? growFor(p, r) : []; }
  try { jrGrow(rows); } catch (e) {}
  if (r8Has('violin')) for (const p of party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, (p.hpNow || 0) + Math.round(mx * 0.1)); }
  // 보상
  const G = R8.gold[node.t === 'elite' ? 'elite' : node.t === 'boss' ? 'boss' : 'fight'] || R8.gold.fight, cm = typeof r8CrowdOver === 'function' ? r8CrowdOver(W, node, true, false) : { mul: 1, add: 0, txt: [] }, gold = Math.round(r8Rnd(G[0], G[1]) * (r8Has('coin') ? 1.5 : 1) * cm.mul) + cm.add; R.gold += gold;   // v8.1 관중 · 규칙
  const rew = [`👛 ${gold}`, ...cm.txt]; let relic = null;
  if (node.t === 'elite' || (node.t === 'fight' && Math.random() < 0.18)) relic = r8GiveRelic();
  if (relic) rew.push(`${RELIC8[relic].ic} ${RELIC8[relic].name}`);
  const B = node.t === 'boss' ? (node.b === 'neo' ? BOSS8[R.neo] : BOSS8[node.b]) : null;
  if (B && B.tear){ R.tears++; if (!R.relics.includes('tear')) R.relics.push('tear'); rew.push(`💧 여신의 눈물 ${B.tear === 2 ? '②' : '③'}`); }
  R.done.push(node.id); R.log.push({ f: R.f, k: node.t, res: 'win', t: Date.now(), gold, relic, kills: (W.kills || [0])[0] });
  save();
  const after = () => {
    if (node.t === 'boss' && node.b === 'gods' && (W.r8 || {}).wave < 2){ r8Battle(node, ((W.r8 || {}).wave || 0) + 1); return; }
    if (B && B.reward && !R.flags['rw' + B.reward]){ R.flags['rw' + B.reward] = 1; r8Recruit(B.reward, B.reward === 'C-175' ? '콜라이더가 무너진 하딤 곁에 내려선다. "…좋은 싸움이었어요. 당신들, 어디까지 갈 생각이죠?"' : '빛나는 물방울이 모여 사람 모양이 된다. 물레가 웃는다. "정령계는 당신들 편이에요."', () => r8AfterBoss(node), true); return; }
    if (B && B.join && !R.flags['jn' + B.join]){ R.flags['jn' + B.join] = 1; r8Recruit(B.join, B.joinTxt, () => r8AfterBoss(node), true); return; }
    if (node.t === 'boss'){ r8AfterBoss(node); return; }
    world = null; r8MapShow(); };
  campResult(rows, 1, node.t === 'boss' && node.b === 'gods' && (W.r8 || {}).wave < 2 ? '다음 심판으로' : '지도로', after, party);
  const bn = $('banner'); if (bn){ const hb = bn.querySelector('b'); if (hb) hb.textContent = `${R.f}층 정산`; const sp = bn.querySelector('span'); if (sp) sp.textContent = `${R.f}층 · ${(NODE8[node.t] || {}).nm} · 얻은 것: ${rew.join(' · ')}`; }
}
function r8PrevAt(){ const R = R8S(); const prev = R.done[R.done.length - 1]; return prev || null; }
function r8AfterBoss(node){
  const R = R8S(); world = null;
  if (F8[R.f] && F8[R.f].settle){ r8Settle(); return; }
  if (R.f === 20) r8McIntro(() => r8Next()); else r8Next();
}
// ===== 영입 · 유물 =====
function r8Recruit(ref, txt, then, force){
  const R = R8S(); if (!R) { then && then(); return; }
  if (R.party.length >= R8.cap && !force){ talkLines([{ narr: txt || '' }, { box: `동료가 가득 차서 (${R8.cap}) 함께 갈 수 없었다.` }, { go: '!r8:then' }]); R8T = then; return; }
  let p; const d = DESIGN_DEFAULTS.find(x => x.ref === ref && x.side === 0), fd = Object.values(FOE8).find(x => x.ref === ref);   // 도감 명단에 없으면 (세르파) 적 설계를 아군으로
  p = d ? fromDesign(d, 0) : RBY[ref] ? unitFromRef(ref, 0, {}) : fd ? fromDesign({ ...clone(fd), side: 0, traits: (fd.traits || []).filter(t => t !== '보스') }, 0) : null;
  if (!p){ then && then(); return; } p = { ...p, id: uid(), side: 0 }; R.party.push(p); save();
  talkLines([{ narr: txt || `${p.name} — 동료가 되었다.` }, { box: `${p.name} 합류` }, { go: '!r8:then' }]); R8T = then;
}
let R8T = null;
function r8GiveRelic(force){
  const R = R8S(); const L = RELIC8_POOL.filter(k => !R.relics.includes(k)); if (!L.length) return null; const k = force || r8Pick(L); R.relics.push(k); if (k === 'candle') R.flags.candle = 5; return k;
}
// ===== 뽑기 (층에 들어설 때 세 번) =====
function r8DrawShow(f){
  const R = R8S(); if (!R) return; r8Css(); const el = $('run8') || (() => { const d = document.createElement('div'); d.id = 'run8'; d.className = 'r8'; document.body.appendChild(d); return d; })(); el.hidden = false;
  const have = new Set([...R.party.map(p => p.name), ...R.dead]);
  const pool = DESIGN_DEFAULTS.filter(d => d.side === 0 && !have.has(d.key) && !have.has(d.name) && d.key !== '인주');
  const cards = Array.from({ length: R8.draws }, () => { if (Math.random() < R8.relicP || !pool.length){ const L = RELIC8_POOL.filter(k => !R.relics.includes(k)); if (L.length) return { k: 'relic', id: r8Pick(L) }; } const d = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]; return d ? { k: 'ally', key: d.key, ref: d.ref, name: d.name || d.key, tier: d.tier } : { k: 'gold', n: 30 }; });
  R.drawCards = cards; R.drawOpen = []; save();
  const card = (c, i) => R.drawOpen.includes(i) ? (c.k === 'relic' ? `<div class="r8card"><span class="ic">${RELIC8[c.id].ic}</span><b>${esc(RELIC8[c.id].name)}</b><small>${esc(RELIC8[c.id].d)}</small></div>` : c.k === 'ally' ? `<div class="r8card"><i style="${r8Face(c.ref, 72)};border-radius:10px"></i><b>${esc(c.name)}</b><small>${TIER_STAR(c.tier)} · 동료</small></div>` : `<div class="r8card"><span class="ic">👛</span><b>동전 ${c.n}</b></div>`) : `<div class="r8card back" data-r8d="${i}">?</div>`;
  const render = () => { el.innerHTML = `<h2>${f}층 — 뽑기</h2><div class="r8sub">계단 아래에서 무언가를 주웠다. 세 장을 뒤집으세요 (동료 · 유물).</div><div class="r8pan" style="text-align:center">${cards.map(card).join('')}<div class="row" style="justify-content:center"><button class="btn" type="button" id="r8dAll">모두 뒤집기</button><button class="btn go" type="button" id="r8dGo" ${R.drawOpen.length < cards.length ? 'disabled' : ''}>지도로</button></div></div>`;
    el.querySelectorAll('[data-r8d]').forEach(b => b.onclick = () => { R.drawOpen.push(+b.dataset.r8d); render(); });
    $('r8dAll').onclick = () => { R.drawOpen = cards.map((_, i) => i); render(); };
    $('r8dGo').onclick = () => { r8DrawTake(cards); }; };
  render();
}
function r8DrawTake(cards){
  const R = R8S(); const got = [];
  for (const c of cards){ if (c.k === 'relic'){ if (!R.relics.includes(c.id)){ R.relics.push(c.id); if (c.id === 'candle') R.flags.candle = 5; got.push(RELIC8[c.id].name); } }
    else if (c.k === 'gold'){ R.gold += c.n; got.push('동전 ' + c.n); }
    else if (c.k === 'ally'){ if (R.party.length >= R8.cap){ R.gold += 25; got.push(`${c.name} (자리가 없어 동전 25 로)`); continue; } const d = designByKey(c.key); if (d){ R.party.push({ ...fromDesign(d, 0), id: uid() }); got.push(c.name + ' 합류'); } } }
  delete R.drawCards; R.drawOpen = []; save(); toast(got.join(' · ')); r8MapShow();
}
// ===== 쉼터 · 상인 · 보물 =====
function r8Panel(html){ r8Css(); const el = $('run8') || (() => { const d = document.createElement('div'); d.id = 'run8'; d.className = 'r8'; document.body.appendChild(d); return d; })(); el.hidden = false; el.innerHTML = html; return el; }
function r8NodeDone(){ const R = R8S(); if (R.at && !R.done.includes(R.at)) R.done.push(R.at); save(); r8MapShow(); }
function r8RestPanel(n){
  const R = R8S();
  const el = r8Panel(`<h2>⛺ 쉼터</h2><div class="r8sub">작은 불을 피웠다. 무엇을 할까?</div><div class="r8pan"><div class="row"><button class="btn go" type="button" id="r8rest">쉬기 — 모두 최대 체력의 ${Math.round(R8.rest * 100)}% 회복</button></div><div class="row">${R.party.map((p, i) => `<button class="btn" type="button" data-r8train="${i}">수련: ${esc(p.name)}</button>`).join('')}</div><small style="color:#a99f8f">수련 — 한 명이 한 갈래 (사격 · 회피 · 속력 · 근력) 를 한 단계 얻거나, 체력 +10</small></div>`);
  $('r8rest').onclick = () => { for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, (p.hpNow != null ? p.hpNow : mx) + Math.round(mx * R8.rest)); } toast('모두 쉬었어요'); r8NodeDone(); };
  el.querySelectorAll('[data-r8train]').forEach(b => b.onclick = () => { const p = R.party[+b.dataset.r8train]; const out = growFor(p, { hits: 99, dodges: 99, moved: 999, meleeDealt: 999, taken: 0 }).slice(0, 1); if (!out.length){ p.ov = p.ov || {}; p.ov.hp = (p.ov.hp != null ? +p.ov.hp : statsOf({ ...p, ov: {} }, rules).hp) + 10; out.push('체력 +10'); } toast(`${p.name} — ${out.join(' · ')}`); r8NodeDone(); });
}
function r8ShopPanel(n){
  const R = R8S(), off = r8Has('dice') ? 0.8 : 1;
  if (!n.stock){ const L = RELIC8_POOL.filter(k => !R.relics.includes(k)); n.stock = [...Array.from({ length: Math.min(3, L.length) }, () => L.splice(Math.floor(Math.random() * L.length), 1)[0]).map(k => ({ k: 'relic', id: k, cost: r8Rnd(110, 170) })), { k: 'heal', cost: 40 }, { k: 'potion', cost: 30 }, { k: 'ammo', cost: 15 }]; save(); }
  const nm = it => it.k === 'relic' ? `${RELIC8[it.id].ic} ${RELIC8[it.id].name}` : it.k === 'heal' ? '⛑ 치료 (모두 30%)' : it.k === 'potion' ? '🧪 회복약 (인주 가방)' : '🏹 화살 · 탄 한 묶음';
  const el = r8Panel(`<h2>🛒 상인</h2><div class="r8sub">노라가 그림자 속에서 손을 흔든다. "구경은 공짜야~"</div><div class="r8pan"><div>👛 <b>${R.gold}</b></div><div class="row">${n.stock.map((it, i) => it.sold ? `<button class="btn" type="button" disabled>${esc(nm(it))} — 팔림</button>` : `<button class="btn" type="button" data-r8buy="${i}" title="${esc(it.k === 'relic' ? RELIC8[it.id].d : '')}">${esc(nm(it))} — ${Math.round(it.cost * off)}</button>`).join('')}</div><div class="row"><button class="btn go" type="button" id="r8shopX">떠난다</button></div></div>`);
  el.querySelectorAll('[data-r8buy]').forEach(b => b.onclick = () => { const it = n.stock[+b.dataset.r8buy], c = Math.round(it.cost * off); if (R.gold < c){ toast('동전이 모자라요'); return; } R.gold -= c;
    if (it.k === 'relic'){ R.relics.push(it.id); if (it.id === 'candle') R.flags.candle = 5; it.sold = true; }
    else if (it.k === 'heal'){ for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, (p.hpNow != null ? p.hpNow : mx) + Math.round(mx * 0.3)); } }
    else { const h = R.party.find(p => p.hero) || R.party[0]; if (h){ h.bag = h.bag || []; h.bag.push(it.k === 'potion' ? { k: 'potion', name: '회복약' } : { k: 'ammo', name: '화살', n: 20 }); } }
    save(); r8ShopPanel(n); });
  $('r8shopX').onclick = () => r8NodeDone();
}
function r8ChestPanel(n){
  const R = R8S();
  if (Math.random() < 0.2 && !n.mimic){ n.mimic = true; n.t = 'fight'; save(); talkLines([{ narr: '상자가 입을 벌렸다 — 미믹이다!' }, { go: '!r8:battle' }]); return; }
  const k = r8GiveRelic(); save();
  r8Panel(`<h2>💎 보물</h2><div class="r8pan" style="text-align:center">${k ? `<div class="r8card"><span class="ic">${RELIC8[k].ic}</span><b>${esc(RELIC8[k].name)}</b><small>${esc(RELIC8[k].d)}</small></div>` : '<p>비어 있다. 누군가 먼저 다녀갔다.</p>'}<div class="row" style="justify-content:center"><button class="btn go" type="button" id="r8chX">챙긴다</button></div></div>`);
  $('r8chX').onclick = () => r8NodeDone();
}
// ===== 만남 =====
const ENC8 = [   // [키, 무게, 층 범위]
  ['odile', 1, 2, 9], ['chin', 1, 2, 12], ['tang', 1, 2, 12], ['aiten', 1, 2, 30], ['hora', 0.6, 3, 14], ['lost', 0.8, 2, 30],
  ['t:curse', 1.2, 2, 30], ['t:wam', 0.8, 3, 30], ['t:nurse', 1, 4, 30], ['t:rosina', 0.8, 6, 20], ['t:lang', 0.8, 3, 18], ['t:marie', 0.6, 5, 25], ['t:smith', 0.8, 2, 30], ['t:hood', 0.6, 8, 30], ['t:uncle', 0.6, 4, 30], ['t:tehera', 0.25, 12, 29], ['t:pehto', 0.6, 5, 20], ['t:ahae', 0.6, 8, 10], ['t:admin', 1, 21, 29]];
function r8Enc(n){
  const R = R8S(), have = new Set(R.party.map(p => p.name));
  const NPCKEY = { odile: '오딜', chin: '친칠라', tang: '탕아', aiten: '아이텐', hora: '호레이쇼' };
  const L = ENC8.filter(([k, w, a, b]) => R.f >= a && R.f <= b && !(R.npcDone || []).includes(k) && !(NPCKEY[k] && have.has(NPCKEY[k])) && !(k === 'lost' && !(S.camp.lostP || []).length));
  const k = n.enc || (n.enc = r8WPick(L.map(x => [x[0], x[1]]))); save();
  if (!k.startsWith('t:')){ r8NpcNode(n, k); return; }
  r8TextEvent(n, k.slice(2));
}
// 1F 인카운터를 그대로 (3S 처럼) — 맵을 나가면 r8Over 가 받음
function r8NpcNode(n, k){
  const C = S.camp, R = R8S(); r8Hide();
  const E = ENC3.find(e => e.npc === k) || ENC3.find(e => e.k === k); if (!E){ r8TextEvent(n, 'curse'); return; }
  C.s = 3; C.stages = { 3: { seed: 1 + Math.floor(Math.random() * 999999), tseed: 1 + Math.floor(Math.random() * 999999), e3: E.k } };
  (R.npcDone = R.npcDone || []).push(k); S.art8 = null;
  const party = R.party.filter(p => !R.dead.includes(p.name));
  campGo(3, 'down', party);
  if (world){ world.r8 = { node: n.id, t: n.t, npc: k }; }
}
function r8TextEvent(n, k){
  const R = R8S(), hero = R.party.find(p => p.hero) || R.party[0];
  const EV = {
    curse: [{ narr: '벽 한 면이 끝없는 글씨로 덮여 있다. 읽을수록 글씨가 늘어난다. — 지식의 저주.' }, { ask: [['읽는다', '!r8:curseRead'], ['눈을 돌린다', '!r8:done']] }],
    wam: [{ narr: '구석에 앉은 누군가가 카드를 섞고 있다. 머리 위에 촛대가 타오른다.' }, { t: '한 판 할래? 이기면 하나 주고, 지면 하나 가져가지.', name: '왐' }, { ask: [['한 판 한다 (유물을 건다)', '!r8:wamPlay'], ['지나간다', '!r8:done']] }],
    nurse: [{ narr: '하얀 천막. 소독약 냄새. 야전의사 파비가 손짓하고, 간호사장이 바이올린을 내려놓는다.' }, { t: '다친 사람부터 눕혀요. 순서는 내가 정해요.', name: '간호사장' }, { ask: [['치료받는다 (모두 60%)', '!r8:nurseHeal'], ['지나간다', '!r8:done']] }],
    rosina: [{ narr: '골목 끝에서 뿔 달린 여자가 사탕을 굴리며 웃는다. 로지나다.' }, { t: '재밌어 보이네. 다음 싸움, 내가 끼어 줄까? 위험하면 튈 거지만.', name: '로지나' }, { ask: [['좋아', '!r8:rosina'], ['괜찮아', '!r8:done']] }],
    lang: [{ narr: '배낭을 멘 탐험가가 지도를 펼치고 있다. 랑팡이다.' }, { t: '여신의 시체를 찾고 있어요. 3층의 그건 껍데기예요. 심장이 없어요.', name: '랑팡' }, { t: '…그 횃불, 어디서 났어요?', name: '랑팡' }, { ask: [['같이 가자', '!r8:lang'], ['모른다고 한다', '!r8:done']] }],
    marie: [{ narr: '모닥불 곁에 부부가 앉아 있다. 마리와 와킨.' }, { t: '아래로 가요? 우리도 마침 내려가려던 참인데.', name: '마리' }, { ask: [['함께 가자', '!r8:marie'], ['지나간다', '!r8:done']] }],
    smith: [{ narr: '쇠 앞치마를 두른 대장장이 탄탄만이 망치를 내려놓는다.' }, { t: '날 무뎌진 거 다 보여. 동전 40 이면 한 놈 무기를 손봐 주지.', name: '탄탄만' }, { ask: [['맡긴다 (40)', '!r8:smith'], ['지나간다', '!r8:done']] }],
    hood: [{ narr: '두건을 쓴 이가 다가와 인주의 그림자를 오래 들여다본다.' }, { t: '나쁜 게 붙어 있네. 하나는 떼어 줄 수 있어.', name: '두건' }, { ask: [['부탁한다', '!r8:hood'], ['괜찮다', '!r8:done']] }],
    uncle: [{ narr: '험상궂은 아저씨가 팔짱을 끼고 서 있다.' }, { t: '…다치지 말고 다녀라.', name: '무서운 아재' }, { box: '모두 최대 체력 +5 (축복)' }, { go: '!r8:uncle' }],
    tehera: [{ narr: '가로로 길게 펼쳐진 빛의 정원. 초월자 테헤라가 정령왕의 축복 속에 서 있다.' }, { t: '…같이 가자고?', name: '테헤라' }, { ask: [['같이 가자', '!r8:tehera1'], ['지나간다', '!r8:done']] }],
    pehto: [{ narr: '청염이 이는 검을 든 마족 기사가 길을 막는다. 페흐토다.' }, { t: '지나가려면 실력을 보여라.', name: '페흐토' }, { ask: [['싸운다', '!r8:pehtoFight'], ['돌아간다', '!r8:done']] }],
    ahae: [{ narr: '담배를 문 도깨비가 처마 위에서 내려다본다. 아해다.' }, { t: '사람이네? 오랜만이다. 술 있냐?', name: '아해' }, { ask: [['동전 30 을 건넨다', '!r8:ahae'], ['지나간다', '!r8:done']] }],
    admin: [{ narr: '공간이 잠깐 멈춘다. 노이즈 낀 눈의 노인이 유리판을 들고 서 있다.', img: 'run8/admin' }, { t: '도전자 확인. 남은 층 ' + (30 - R.f) + '. 기록을 계속합니다.', name: '관리자', img: 'run8/admin' }, { t: '…그 불씨는, 반납하는 편이 좋습니다.', name: '관리자', img: 'run8/admin' }, { ask: [['대답하지 않는다', '!r8:done'], ['"이건 우리 거야"', '!r8:adminNo']] }] };
  r8Hide(); talkLines(EV[k] || EV.curse);
}
function r8Act(a){
  const R = R8S(); if (!R) return; const hero = R.party.find(p => p.hero) || R.party[0];
  const done = () => r8NodeDone(), say = (L, then) => { R8T = then || done; talkLines([...L, { go: '!r8:then' }]); };
  if (a === 'then'){ const f = R8T; R8T = null; if (f) f(); else r8MapShow(); return; }
  if (a === 'done'){ done(); return; }
  if (a === 'floor2'){ r8FloorEnter(2); return; }
  if (a === 'battle'){ const n = r8Node(R.at); r8Hide(); r8Battle(n); return; }
  if (a === 'curseRead'){ const p = r8Pick(R.party); if (Math.random() < 0.55){ const out = growFor(p, { hits: 99, dodges: 0, moved: 0, meleeDealt: 0, taken: 0 }); say([{ narr: `${p.name} 이(가) 무언가를 깨달았다.` }, { box: out.length ? out.join(' · ') : '깨달음 — 지휘가 조금 늘었다' }]); } else { p.ov = p.ov || {}; p.ov.hp = Math.max(40, (p.ov.hp != null ? +p.ov.hp : statsOf({ ...p, ov: {} }, rules).hp) - 10); p.curses = [...(p.curses || []), '지식의 저주']; say([{ narr: `글씨가 ${p.name} 의 눈으로 기어 들어간다.` }, { box: `${p.name} — 최대 체력 −10 (저주)` }]); } save(); return; }
  if (a === 'wamPlay'){ if (!R.relics.filter(k => k !== 'tear').length){ say([{ t: '걸 게 없잖아. 다음에 와.', name: '왐' }]); return; } if (Math.random() < 0.5){ const k = r8GiveRelic(); say([{ narr: '카드가 뒤집힌다 — 이겼다!' }, { box: k ? `${RELIC8[k].ic} ${RELIC8[k].name}` : '동전 40' }]); if (!k) R.gold += 40; } else { const L = R.relics.filter(k => k !== 'tear'), k = r8Pick(L); R.relics = R.relics.filter(x => x !== k); say([{ narr: '카드가 뒤집힌다 — 졌다.' }, { box: `${RELIC8[k].ic} ${RELIC8[k].name} 을(를) 잃었다` }]); } save(); return; }
  if (a === 'nurseHeal'){ for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, (p.hpNow != null ? p.hpNow : mx) + Math.round(mx * 0.6)); if (p.skill && p.skill.pool){ p.skLeft = p.skill.pool; } } const nu = R.party.find(p => /간호사|가윤|노먼/.test(p.name)); if (nu && !R.flags.nurseUp){ R.flags.nurseUp = 1; if (nu.skill) nu.skill.pool = (nu.skill.pool || 0) + 2; } say([{ narr: '간호사장이 바이올린을 켠다. 잠깐 굴을 잊는다.' }, { box: '모두 회복' + (nu ? ` · ${nu.name} 의 약 +2` : '') }]); save(); return; }
  if (a === 'rosina'){ R.flags.rosina = 1; say([{ t: '약속~ 위험하면 튈 거야.', name: '로지나' }]); save(); return; }
  if (a === 'lang'){ r8Recruit('C-207', '랑팡이 지도를 접는다. "좋아요, 같이 가요. 여신을 찾으면 반은 내 거예요."', done); return; }
  if (a === 'marie'){ r8Recruit('C-022', '마리가 웃는다.', () => r8Recruit('C-023', '와킨이 짐을 짊어진다.', done)); return; }
  if (a === 'smith'){ if (R.gold < 40){ say([{ t: '동전부터 가져와.', name: '탄탄만' }]); return; } R.gold -= 40; const p = r8Pick(R.party.filter(x => !isFarD(x)).concat(R.party)); p.ov = p.ov || {}; p.ov.atk = Math.round((p.ov.atk != null ? +p.ov.atk : statsOf({ ...p, ov: {} }, rules).atk) * 1.12); say([{ narr: `탄탄만이 ${p.name} 의 무기를 두드린다.` }, { box: `${p.name} — 공격 +12%` }]); save(); return; }
  if (a === 'hood'){ const p = R.party.find(x => (x.curses || []).length); if (p){ p.curses.pop(); p.ov = p.ov || {}; p.ov.hp = (p.ov.hp != null ? +p.ov.hp : statsOf({ ...p, ov: {} }, rules).hp) + 10; say([{ narr: `두건이 ${p.name} 의 그림자에서 무언가를 뜯어낸다.` }, { box: '저주 하나가 사라짐' }]); } else say([{ t: '…아니, 내가 잘못 봤네.', name: '두건' }]); save(); return; }
  if (a === 'uncle'){ for (const p of R.party){ p.ov = p.ov || {}; p.ov.hp = (p.ov.hp != null ? +p.ov.hp : statsOf({ ...p, ov: {} }, rules).hp) + 5; } save(); done(); return; }
  if (a === 'tehera1'){ R.flags.teh = (R.flags.teh || 0) + 1; if (R.flags.teh < 3){ R8T = null; talkLines([{ t: R.flags.teh === 1 ? '…글쎄.' : '…귀찮은데.', name: '테헤라' }, { ask: [['한 번 더 부탁한다', '!r8:tehera1'], ['포기한다', '!r8:done']] }]); return; } r8Recruit('C-016', '"그럴까?" 테헤라가 군말 없이 따라온다.', done); return; }
  if (a === 'pehtoFight'){ const n = r8Node(R.at); n.t = 'elite'; n.e = 'pehto'; ELITE8.pehto = ELITE8.pehto || { name: '페흐토', foes: [['페흐토', 1]], join: 'C-108' }; FOE8['페흐토'] = FOE8['페흐토'] || { key: '페흐토', name: '페흐토', side: 1, ref: 'C-108', tier: 5, cls: '기동', role: '공격수', weapon: '장검', height: 2.0, weight: 110, nv: true, nvG: 'A', ov: { hp: 620, atk: 56 }, traits: ['베테랑', '갑피', '회피A', '보스'], active: ['공중제비'], tactic: '청염 검술', note: '청염계 마족 기사' }; save(); r8Hide(); r8Battle(n); return; }
  if (a === 'ahae'){ if (R.gold < 30){ say([{ t: '빈손이네? 됐어.', name: '아해' }]); return; } R.gold -= 30; r8Recruit('C-082', '아해가 담배를 비벼 끈다. "심심하던 참이다."', done); return; }
  if (a === 'adminNo'){ R.flags.adminNo = 1; say([{ t: '…기록했습니다.', name: '관리자', img: 'run8/admin' }]); return; }
  done();
}
const isFarD = p => /활|총|저격|소총|권총|마법/.test(p.weapon || '');
// ===== 고정 칸: 여신의 호수 =====
function r8Fixed(n){
  const R = R8S(); const hero = R.party.find(p => p.hero);
  if (n.k === 'goddess'){
    const L = [{ narr: '동굴이 끝나는 곳, 끝없는 호수.', cg: 'r8_goddess', cgw: true }, { narr: '호수 위에 거대한 여인이 누워 있다. 유리 같은 몸, 감은 눈. 호수는 — 그녀의 눈물이다.', cg: 'r8_goddess', cgw: true }];
    if (hero){ L.push({ narr: '인주가 횃불을 들고 물가로 다가간다. 불빛이 그녀의 가슴께에 닿는 순간—', cg: 'r8_goddess', cgw: true }, { narr: '감은 눈가에서 눈물 한 방울이 떨어져, 빛나는 돌로 굳는다.', cg: 'r8_goddess', cgw: true }, { box: '💧 여신의 눈물 ① — 횃불이 더 밝아지고, 모두 조금 단단해진다' });
      R.tears++; if (!R.relics.includes('tear')) R.relics.push('tear'); }
    else L.push({ narr: '…아무 일도 일어나지 않는다. 횃불을 든 이가 없다.' });
    L.push({ narr: '그 몸은 텅 비어 있었다. 가슴 자리에, 빛이 없다.' }, { go: '!r8:fixedDone' });
    R.done.push(n.id); save(); r8Hide(); talkLines(L); return; }
  r8NodeDone();
}
// ===== 보스 소개 =====
function r8BossIntro(b, wave){
  const R = R8S();
  if (b === 'serpa') return [{ narr: '수정 기둥 사이로 작은 왕관이 반짝인다.' }, { t: '여긴 내 왕국이야. 나가.', name: '세르파' }, { narr: '바닥의 젤리가 일어서서 기사 · 방패 · 저격수 · 치유사가 된다.' }];
  if (b === 'neo'){ const k = R.neo; return k === 'neospirit' ? [{ narr: '빛나는 정령의 광장. 거대한 사슴이 앞발로 땅을 긁는다.' }, { box: '네오 정령계의 문 — 이기면 물레가 함께한다' }] : [{ narr: '네온 마계의 광장. 대악마 하딤이 도끼를 어깨에 걸친다.' }, { t: '오랜만에 위로 올라온 먹잇감이군.', name: '하딤' }, { box: '네오마계의 문 — 이기면 콜라이더가 함께한다' }]; }
  if (b === 'theron') return [{ narr: '하얀 공간. 아무 소리도 없다.' }, { narr: '테이론이 검을 뽑는 순간 — 하얀 공간이 우주로 무너진다. 별이 비처럼 쏟아진다.' }, { box: '테이론 — 말없이 싸움이 시작된다' }];
  if (b === 'gods'){ const W8 = BOSS8.gods.waves[wave || 0]; return wave ? [{ narr: `${W8[2]} 이(가) 손가락을 든다. 다음 심판.` }] : [{ narr: '붉은 바다 위의 무대. 세 개의 옥좌에 세 초월자가 앉아 있다.', cg: 'r8_gods' }, { narr: '흰 깃털의 라비스. 긴 흑발의 모란. 뿔 달린 모켈. 그리고 그들 위에 떠 있는 해골 — 록토.', cg: 'r8_gods' }, { t: '불씨를 든 아이가 왔구나.', name: '라비스', img: 'run8/rabis' }, { box: '삼신의 심판 — 세 판을 연달아 (라비스 · 모켈 · 모란이 고른 적)' }]; }
  return [{ narr: '보스가 기다리고 있다.' }];
}
// ===== 정산 (10 · 20층) =====
function r8Settle(){
  const R = R8S(); const f = R.f;
  const el = r8Panel(`<h2>${f}층 정산</h2><div class="r8sub">관리자의 승강기가 내려온다. 노이즈 낀 눈의 노인이 유리판을 내민다.</div>
    <div class="r8pan"><p>"${f === 10 ? '10층 돌파를 기록합니다. 여기서 나가면, 위로 돌아갈 수 있습니다.' : '20층 돌파 — 300년 만입니다. 기록이 깨졌습니다.'}"</p>
    <p style="color:#cfc6b6">동료 ${R.party.length} · 유물 ${R.relics.length} · 여신의 눈물 ${R.tears} · ${r8Elapsed()}</p>
    <div class="row"><button class="btn" type="button" id="r8out">⬆ 승강기를 탄다 — 여기서 나감 (${f}층 생환 결말)</button><button class="btn go" type="button" id="r8on">⬇ 계속 — 정산 보상 (모두 회복 · 성장 셋 · 유물 하나) 받고 아래로</button></div></div>`);
  $('r8out').onclick = () => r8End(f === 10 ? 'out10' : 'out20');
  $('r8on').onclick = () => { for (const p of R.party){ p.hpNow = r8MaxHp(p); } const gs = []; for (const p of R.party.slice().sort(() => Math.random() - 0.5).slice(0, 3)){ const o = growFor(p, { hits: 99, dodges: 99, moved: 999, meleeDealt: 999, taken: 999 }).slice(0, 1); if (o.length) gs.push(`${p.name} ${o[0]}`); } const k = r8GiveRelic(); toast([...gs, k ? RELIC8[k].name : ''].filter(Boolean).join(' · ')); save(); if (f === 20) r8McIntro(() => r8Next()); else r8Next(); };
}
// ===== MC 더 플링 (20층) =====
function r8McIntro(then){
  const R = R8S(); R.crowd = 60; R.flags.mc = 1; save(); R8T = then;
  talkLines([{ narr: '사방에서 조명이 켜진다. 굴의 천장 너머에서 함성이 쏟아진다.' }, { t: '자아아아—! 300년! 300년 만입니다, 여러분!!', name: 'MC 더 플링' }, { t: '아래를 보세요, 저 작은 불빛! 오늘부터 이 굴은…', name: 'MC 더 플링' }, { t: '챔피언 로드입니다!!!', name: 'MC 더 플링' }, { narr: '관중의 함성이 굴을 흔든다. 콜라이더와 물레가 멀리서 고개를 끄덕인다.' }, { t: '20층까지 돌파한 세력은 300년 만에 처음입니다. 우리는 당신을 돕고 싶습니다.', name: '콜라이더' }, { box: '챔피언 로드 — 이제부터 관중이 지켜봐요 (응원 · 야유 · 축복 · 증오)' }, { go: '!r8:then' }]);
}
// ===== 결승 (v8.2 에서 링 위 1대1) =====
function r8Final(n){
  if (typeof duel8Start === 'function'){ duel8Start(n); return; }
  talkLines([{ narr: '피라미드 꼭대기. 디스코볼이 돈다.' }, { box: '결승은 다음 판에서 열려요.' }, { go: '!r8:done' }]);
}
// ===== 결말 =====
function r8End(kind){
  const C = S.camp, R = R8S(); if (!C || !R) return; R.on = false; R.end = kind; C.end = kind === 'wipe' ? 'wipe' : 'clear'; C.t1 = Date.now();
  const T = { wipe: ['굴은 또 하나의 이야기를 삼켰다.', `${R.f}층에서 횃불이 꺼졌다.`], out10: ['횃불은 위로 올라갔다.', '아래에선 아무도 그 빛을 기억하지 못했다. — 10층 생환'], out20: ['300년 만의 돌파자는, 무대를 거절했다.', '탈출파의 문이 열리고, 횃불은 다른 하늘을 보았다. — 20층 생환'], lose30: ['다음 시즌, 또 만나요!', '화면이 찢어진다. 새 챔피언이 저장되었다.'], true: ['불씨 둘이 겹쳤다. 굴의 바닥이 열린다.', '진엔딩 — 여신의 심장이 다시 뛴다.'] }[kind] || ['여정이 끝났다.'];
  (S.storyLog = S.storyLog || []).unshift({ t: C.t1, kind: 'run:' + kind, s: R.f, mins: Math.round((C.t1 - R.t0) / 60000), why: T[0], alive: R.party.map(p => p.name), fallen: R.dead.slice(), lost: [] }); save();
  world = null;
  r8Panel(`<h2>${esc(T[0])}</h2><div class="r8sub">${esc(T[1] || '')}</div><div class="r8pan"><p>도달 ${R.f}층 · ${r8Elapsed()} · 유물 ${R.relics.length} · 여신의 눈물 ${R.tears}</p><div class="r8party">${R.party.map(p => `<div class="r8p"><i style="${r8Face(p.ref, 34)}"></i><b>${esc(p.name)}</b></div>`).join('')}</div>${R.dead.length ? `<p style="color:#c98">쓰러진 이: ${esc(R.dead.join(' · '))}</p>` : ''}<div class="row"><button class="btn go" type="button" id="r8fin">끝내기</button><button class="btn" type="button" id="r8finLog">여정 기록 받기</button></div></div>`);
  $('r8fin').onclick = () => { r8Hide(); campQuit(); };
  $('r8finLog').onclick = () => { try { campLogDownload(); } catch (e) {} };
}
// ===== 동료 정리 =====
function r8PartyPanel(){
  const R = R8S();
  const el = r8Panel(`<h2>동료</h2><div class="r8sub">최대 ${R8.cap}명. 떠나보낸 동료는 돌아오지 않아요.</div><div class="r8pan">${R.party.map((p, i) => { const mx = r8MaxHp(p), hp = p.hpNow != null ? p.hpNow : mx; return `<div class="r8p" style="margin:4px 0"><i style="${r8Face(p.ref, 40)}"></i><div style="flex:1"><b>${esc(p.name)}</b> ${TIER_STAR(p.tier)} <small>${hp}/${mx}${(p.grown || []).length ? ' · ✦ ' + esc(p.grown.slice(-3).join(' · ')) : ''}${(p.curses || []).length ? ' · ☠ ' + esc(p.curses.join(' · ')) : ''}</small></div>${p.hero ? '' : `<button class="btn sm warn" type="button" data-r8kick="${i}">떠나보냄</button>`}</div>`; }).join('')}<div class="row"><button class="btn go" type="button" id="r8pX">지도로</button></div></div>`);
  el.querySelectorAll('[data-r8kick]').forEach(b => b.onclick = () => { const p = R.party[+b.dataset.r8kick]; if (!confirm(`${p.name} 을(를) 떠나보낼까요?`)) return; R.party.splice(+b.dataset.r8kick, 1); S.camp.lost.push(p.name); save(); r8PartyPanel(); });
  $('r8pX').onclick = () => r8MapShow();
}
// ===== 처음 켤 때 · 다시 열 때 =====
function r8Boot(){ if (!run8On()) return; const R = R8S(); if (world && world.camp && !world.over && (S.art8 || S.camp.s === 3)){ world.r8 = world.r8 || { node: R.at }; return; } r8MapShow(); }
R8READY = true;
setTimeout(r8Boot, 900);
