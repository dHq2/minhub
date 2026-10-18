# v7.21.0 페이지 — page721.py v1.1 (v1.1: 판에 위 · 아래 끝 띠 (넘어가는 곳) 를 옅게 그림 · 4단계 1F 캠페인 뼈대: 시작 (확정 카리우스 · 레베카 · 청광묵 + 랜덤 둘) · S 다섯 (1S · 2S 고정 전투 · 3S 랜덤 인카운터 · 4S 알현실 입구 · 5S 알현실 — 4S · 5S 는 6단계 전까지 임시) · 위 / 아래 맵으로 · 아군을 버린다 · 끝난 맵 전리품 · 이어지는 것 (체력 · 치료 횟수 · 탄 · 내구도 · 가방) · 다시 오면 남긴 적 그대로 · 끝 화면 · 그만두기 (원래 배치로))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 판 번호 ----------
rep('<!-- 굴의 전투판 v7.20.1 (2026-10-18)', '<!-- 굴의 전투판 v7.21.0 (2026-10-18)')
rep('     v7.20.1: ', '''     v7.21.0: 4단계 1F 캠페인 (뼈대).
         배치 탭 '1F 캠페인' → 동료: 확정 카리우스 · 레베카 · 청광묵 + 랜덤 둘 (노먼 · 친칠라 · 딸기 · 옐로 · 트라카 · 쟝 · 나달 · 가윤 · 간두 · 모닝스타 중) → 1S.
         S 다섯: 1S · 2S 고정 전투 · 3S 랜덤 인카운터 (전투 셋 중 하나 — 대화형은 5단계) · 4S 알현실 입구 · 5S 알현실 (실내전 · 세자르는 6단계 전까지 임시).
         맵 위쪽 끝 = 다음 S · 아래쪽 끝 = 이전 S (판 위 띠의 '↑ / ↓' 단추 — 고른 아군 (없으면 모두) 이 끝으로 가서 넘어감). 모두 넘어가야 다음 맵 · 남은 이가 있으면 '아군을 버린다'.
         적을 다 쓰러뜨려도 판은 끝나지 않음 ('끝난 맵' — 전리품 · 정비 후 원할 때 이동) · 은신해서 그냥 지나가도 됨 · 적은 다른 맵으로 쫓아오지 않음 · 다시 오면 남긴 적 그대로.
         이어지는 것: 체력 · 치료 횟수 · 탄 · 내구도 · 가방 · 부서진 장비 (쉬지 않음). 쓰러진 아군은 빠짐. 5S 를 넘으면 무덤 · 계단 → 끝 화면.
     v7.20.1: ''')
rep('h1::after{content:" v7.20.1"', 'h1::after{content:" v7.21.0"')
rep('<footer>굴의 전투판 v7.20.1', '<footer>굴의 전투판 v7.21.0')
rep('return `굴의 전투판 v7.20.1 · ${title}', 'return `굴의 전투판 v7.21.0 · ${title}')
rep("copyText('굴의 전투판 v7.20.1 자동 판 기록", "copyText('굴의 전투판 v7.21.0 자동 판 기록")
rep('의 버전 기록에 — v7.20.1 전리품 · 장비 반영', '의 버전 기록에 — v7.21.0 1F 캠페인 (S 다섯 · 맵 사이 이동) / v7.20.1 전리품 · 장비 반영')
rep('">v7.20.1 · 소지품 · 전리품 · 내구도</span>', '">v7.21.0 · 1F 캠페인</span>')
rep("RULES_MIG = '7.20.0'", "RULES_MIG = '7.21.0'")

# ---------- 판 위 띠 ----------
rep('<div class="banner" id="banner" hidden></div>', '<div class="banner" id="banner" hidden></div><div class="campbar" id="campBar" hidden></div>')
rep('<button class="btn" type="button" id="floorSave">지금 배치를 층으로 저장</button></div>', '<button class="btn" type="button" id="floorSave">지금 배치를 층으로 저장</button><button class="btn go" type="button" id="campBtn" title="S 다섯을 차례로 — 확정 카리우스 · 레베카 · 청광묵 + 랜덤 둘">${S.camp && !S.camp.end ? \'1F 캠페인 (진행 중)\' : \'1F 캠페인 시작\'}</button></div>')
rep("  if (e.target.id === 'floorSave'){", "  if (e.target.id === 'campBtn'){ campStart(); return; }   // v7.21\n  if (e.target.id === 'floorSave'){")
rep("world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0);", "world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0); if (S.camp && !S.camp.end) world.camp = true;   // v7.21 캠페인 판")
rep("function onOver(){", "function onOver(){\n  if (world && world.camp && S.camp){ campOver(); return; }   // v7.21 캠페인: 맵을 넘어감 · 전멸")
rep("const dockState = (Wd, u) => u.down ? '쓰러짐 · 일어나는 중' : !u.alive ? '쓰러짐' :", "const dockState = (Wd, u) => u.gone ? (u.gone === 'left' ? '버림' : u.gone === 'up' ? '↑ 위 맵으로 넘어감' : '↓ 아래 맵으로 넘어감') : u.down ? '쓰러짐 · 일어나는 중' : !u.alive ? '쓰러짐' :")
rep("for (const u of Wd.units) if (!u.alive && !(u.side === 0 && u.posUnk", "if (S.camp && !S.camp.end && Wd.camp && Wd.map){ const band = (Wd.rules.camp || {}).band || 0.9, mw = Wd.map.W * ts, nx = (CAMP_S[S.camp.s + 1] || {}).name || '계단', pv = (CAMP_S[S.camp.s - 1] || {}).name;   /* v7.21 넘어가는 끝 띠 */\n    ctx.save(); ctx.fillStyle = 'rgba(185,224,160,.09)'; ctx.fillRect(ox, oy, mw, band * ts); if (pv) ctx.fillRect(ox, oy + (Wd.map.H - band) * ts, mw, band * ts);\n    ctx.fillStyle = 'rgba(185,224,160,.8)'; ctx.font = `600 ${Math.max(10, Math.round(ts * 0.4))}px sans-serif`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('↑ ' + nx, ox + ts * 0.3, oy + band * ts * 0.5); if (pv) ctx.fillText('↓ ' + pv, ox + ts * 0.3, oy + (Wd.map.H - band * 0.5) * ts); ctx.restore(); }\n  for (const u of Wd.units) if (!u.alive && !u.gone && !(u.side === 0 && u.posUnk")
rep("function hud(){", "function hud(){\n  campBarRender();   // v7.21")

rep("function canFight(){", "function canFight(){\n  if (S.camp && !S.camp.end) return S.units.some(u => u.side === 0);   // v7.21 캠페인: 끝난 맵 (적 없음) 도 그대로")
# ---------- 로그 · 서술 · 명령 이름 ----------
rep("      case 'bagSwap': out.push(", """      case 'leave': out.push(`${T(e)}${e.dir === 'up' ? '↑' : '↓'} ${n(e.a)} ${e.dir === 'up' ? '위' : '아래'} 맵으로 넘어감`); break;   // v7.21 캠페인
      case 'cleared': out.push(`${T(e)}🏳 이 맵의 적을 모두 쓰러뜨림 — 끝난 맵 (전리품 · 정비하고 원할 때 이동)`); break;
      case 'campIn': out.push(`${T(e)}🗺 1F · ${e.name} ${e.kind}${e.back ? ' — 다시 돌아옴' : ''} (${e.from === 'up' ? '위' : '아래'}에서 들어섬)`); break;
      case 'bagSwap': out.push(""")
rep("    case 'wBreak': return {", """    case 'cleared': return { c: 'good', s: '주변이 고요해졌다. 이제 숨을 돌릴 수 있다.' };   // v7.21
    case 'campIn': return { c: 'dim', s: `1F · ${e.name} — ${e.kind}.` };
    case 'leave': return e.vis ? { c: 'dim', s: `${ga(n(e.a))} ${e.dir === 'up' ? '위' : '아래'}로 난 길을 따라 사라진다.` } : null;
    case 'wBreak': return {""")
rep("const ordOf = u => u.order && u.order.k === 'swap' ?", "const ordOf = u => u.order && u.order.k === 'exit' ? ['exit', u.order.dir] : u.order && u.order.k === 'swap' ?")
rep("  if (o[0] === 'swap') return '가방에서 꺼내 듦';", "  if (o[0] === 'exit') return o[1] === 'down' ? '아래 맵으로' : '위 맵으로';   // v7.21\n  if (o[0] === 'swap') return '가방에서 꺼내 듦';")
rep("o.k === 'swap' ? ['🎒 꺼내 듦', '#e6d3a3'] :", "o.k === 'swap' ? ['🎒 꺼내 듦', '#e6d3a3'] : o.k === 'exit' ? [o.dir === 'down' ? '↓ 아래 맵으로' : '↑ 위 맵으로', '#b9e0a0'] :")

# ---------- 캠페인 ----------
rep("function onOver(){", r"""// v7.21 1F 캠페인: S 다섯 — 위 끝 = 다음 S · 아래 끝 = 이전 S. 파티는 그 맵의 S.units (아군) 로 이어짐 · 원래 배치는 S.campBak 에 맡겨 둠
const CAMP_FIX = ['카리우스', '레베카', '청광묵'], CAMP_NO = ['인주', '탕아'];   // 확정 동료 · 뽑기에서 빼는 이 (주인공 · 탕아는 인카운터로만)
const CAMP_S = [null,
  { name: '1S', kind: '고정 전투', note: '어둠 속 개활지 — 떠도는 기사들', foes: [['검방패기사', 2], ['창병', 2], ['궁수', 1]] },
  { name: '2S', kind: '고정 전투', note: '언덕과 무더기 — 똥개 무리와 검기사', foes: [['C-076', 4], ['검기사', 1], ['궁수', 1]] },
  { name: '3S', kind: '랜덤 인카운터', note: '어떤 만남인지는 들어서야 앎 (대화형은 5단계)', pick: [['똥개 무리', [['C-076', 6]]], ['똥개와 기사', [['C-076', 3], ['검방패기사', 1], ['창병', 1]]], ['기사들', [['검방패기사', 1], ['검기사', 1], ['창병', 1], ['궁수', 1]]]] },
  { name: '4S', kind: '알현실 입구', note: '약한 햇살이 드는 유적 입구 — 정예와 매복 (실내전은 6단계)', foes: [['검기사', 2], ['궁수', 1]], torches: 3 },
  { name: '5S', kind: '알현실', note: '문을 지키는 1F 유일의 곤봉적 (세자르는 6단계)', foes: [['곤봉적', 1], ['검방패기사', 1], ['창병', 1]] }];
const foeOf = k => /^C-\d+$/.test(k) ? unitFromRef(k, 1, {}) : fromDesign(designByKey(k), 1);
function campStart(){
  if (mode !== 'edit'){ toast('⟲ 배치로를 누른 뒤에 시작할 수 있어요'); return; }
  if (S.camp && !S.camp.end && !confirm('진행 중인 캠페인을 버리고 새로 시작할까요?')) return;
  if (!S.camp) S.campBak = clone({ type: S.type, W: S.W, H: S.H, mapC: S.mapC, randStart: S.randStart, seed: S.seed, flips: S.flips || [], units: S.units, torches: S.torches || [], terr: S.terr || '', tseed: S.tseed || 1, piles: S.piles || [], hills: S.hills || [], pileOff: S.pileOff || [], openers: S.openers || [] });
  const pool = DESIGN_DEFAULTS.filter(d => d.side === 0 && !CAMP_FIX.includes(d.key) && !CAMP_NO.includes(d.key)).map(d => d.key), pick = [];
  while (pick.length < 2 && pool.length) pick.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  const party = [{ ...fromDesign(designByKey('인주'), 0), hero: true }, ...[...CAMP_FIX, ...pick].map(k => fromDesign(designByKey(k), 0))].map(u => ({ ...u, id: uid() }));
  S.camp = { v: 1, s: 1, pick, lost: [], fallen: [], stages: {}, t0: Date.now(), n3: Math.floor(Math.random() * 3), log: [] }; S.openers = [];
  campBuild(1, 'down', party);
  toast(`1F 캠페인 — 동료 ${party.slice(1).map(u => u.name).join(' · ')} (뽑기: ${pick.join(' · ')}) · 맵 위쪽 끝 = 2S`);
}
function campPlace(m, units, y0, y1, x0, x1){
  const taken = new Set();
  for (const u of units){ for (let k = 0; k < 600; k++){ const x = Math.floor(x0 + Math.random() * (x1 - x0)), y = Math.floor(y0 + Math.random() * (y1 - y0)), key = x + ',' + y;
    if (taken.has(key) || x < 1 || y < 0 || x >= m.W - 1 || y >= m.H || m.t[y * m.W + x] !== 0) continue; taken.add(key); u.x = x + 0.5; u.y = y + 0.5; break; } }
}
// 맵을 만듦: 처음이면 적은 묶음대로 (조우 전 떠돎) · 다시 오면 남긴 그대로. from = 들어온 쪽 ('down' = 아래에서 올라옴)
function campBuild(s, from, party){
  const C = S.camp, def = CAMP_S[s], st = C.stages[s] || (C.stages[s] = { seed: 1 + Math.floor(Math.random() * 999999), tseed: 1 + Math.floor(Math.random() * 999999) });
  Object.assign(S, { type: 'grid', W: 32, H: 20, mapC: false, randStart: !st.seen, seed: st.seed, flips: [], torches: [], terr: '1F', tseed: st.tseed, piles: st.piles || [], hills: st.hills || [], pileOff: [] });
  const foes = st.seen ? (st.foes || []).map(f => ({ ...clone(f), id: uid() })) : (def.pick ? def.pick[C.n3][1] : def.foes).flatMap(([k, n]) => Array.from({ length: n }, () => ({ ...foeOf(k), id: uid() })));
  S.units = [...party, ...foes]; rebuildMap();
  const m = buildMap(S), up = from === 'up';
  campPlace(m, party, up ? 0.5 : S.H - 3, up ? 3 : S.H - 0.5, 10, 22);
  if (!st.seen) campPlace(m, foes, 2, S.H - 8, 2, S.W - 2);
  if (def.torches) S.torches = autoTorches(buildMap(S), S.seed, def.torches);
  st.piles = S.piles; st.hills = S.hills;
  selId = null; rebuildMap(); setMapUI(); save(); start(); renderFloors();
  logEv(world, { k: 'campIn', s, name: def.name, kind: def.kind + (def.pick ? ' — ' + def.pick[C.n3][0] : ''), from, back: !!st.seen });
  if (!st.seen) toast(`1F · ${def.name} ${def.kind}${def.pick ? ' — ' + def.pick[C.n3][0] : ''} · ${def.note}`); else toast(`1F · ${def.name} 로 돌아옴 — 남긴 적 ${foes.length}`);
  campBarRender(true);
}
// 맵을 넘어감: 나간 아군은 상태를 설계에 (v7.20.1 반영과 같음 + 체력 · 치료 횟수) · 쓰러진 이는 파티에서 빠짐 · 버린 이도
function campOver(){
  const W = world, C = S.camp; if (!C || C.end) return;
  const s = C.s, party = [], dirs = {};
  for (const u of W.units){ if (u.side !== 0) continue; const p = S.units.find(x => x.id === u.pid); if (!p) continue;
    if (u.gone === 'up' || u.gone === 'down'){ dirs[u.gone] = (dirs[u.gone] || 0) + 1; settleWorld({ units: [{ ...u, alive: true }], items: W.items }); p.hpNow = Math.round(u.hp); if (u.skill) p.skLeft = u.skill.left; else delete p.skLeft; party.push(p); }
    else if (u.gone === 'left') C.lost.push(p.name); else C.fallen.push(p.name); }
  C.stages[s] = { ...C.stages[s], seen: true, cleared: !!W.cleared, foes: W.units.filter(u => u.side === 1 && u.alive).map(u => { const p = S.units.find(x => x.id === u.pid) || {}; const f = clone(p); delete f.id; return { ...f, x: +u.x.toFixed(2), y: +u.y.toFixed(2), hpNow: Math.round(u.hp) }; }) };
  C.log.push({ s, t: +W.t.toFixed(1), res: W.result, kills: (W.kills || [0])[0], party: party.map(p => p.name) });
  if (W.result === 'lose' || !party.length){ campEnd('wipe'); return; }
  const dir = (dirs.up || 0) >= (dirs.down || 0) ? 'up' : 'down', ns = s + (dir === 'up' ? 1 : -1);
  if (ns > 5){ C.s = 6; S.units = party; campEnd('clear'); return; }
  C.s = Math.max(1, ns); campBuild(C.s, dir === 'up' ? 'down' : 'up', party);
}
function campEnd(kind){
  const C = S.camp; C.end = kind; C.t1 = Date.now(); save();
  const b = $('banner'), al = S.units.filter(u => u.side === 0), mins = Math.round((C.t1 - C.t0) / 60000);
  b.className = 'banner ' + (kind === 'clear' ? 'win' : 'lose');
  b.innerHTML = `<b>${kind === 'clear' ? '무덤이 열리고 계단이 나타났다' : '1F 에서 전멸했다'}</b><span>${kind === 'clear' ? '1F 프롤로그 끝' : CAMP_S[Math.min(5, C.s)].name + ' 에서'} · ${mins}분 · 살아남은 이 ${kind === 'clear' ? al.length : 0} · 쓰러진 이 ${C.fallen.length} · 버린 이 ${C.lost.length}</span>
    <div class="cend">${kind === 'clear' ? al.map(p => `<span class="ce"><i style="${faceCss(faceOf(p.ref), 40)}"></i>${esc(p.name)}<small>${p.hpNow != null ? '피 ' + p.hpNow : ''}</small></span>`).join('') : ''}${C.fallen.length ? `<p>쓰러진 이: ${esc(C.fallen.join(' · '))}</p>` : ''}${C.lost.length ? `<p>버린 이: ${esc(C.lost.join(' · '))}</p>` : ''}<p class="note">${C.log.map(l => `${CAMP_S[l.s].name} ${l.t}초 ${l.res === 'exit' ? '→ 넘어감' : '전멸'}`).join(' · ')}</p></div>
    <div class="row"><button class="btn go" type="button" id="campDone">캠페인 끝내기 (원래 배치로)</button></div>`;
  b.hidden = false; $('campDone').onclick = campQuit; campBarRender(true);
}
function campQuit(){
  const B = S.campBak; delete S.camp; delete S.campBak; if (B) Object.assign(S, clone(B));
  resetToEdit(); selId = null; rebuildMap(); setMapUI(); changed(); renderFloors(); campBarRender(true); showTab('place');
  toast('캠페인을 끝내고 원래 배치로 돌아왔어요');
}
let campBarH = '';
function campBarRender(force){
  const el = $('campBar'); if (!el) return; const C = S.camp;
  if (!C || C.end){ if (!el.hidden || force){ el.hidden = true; el.innerHTML = ''; campBarH = ''; } return; }
  const def = CAMP_S[C.s] || {}, W = world && world.camp ? world : null, gone = W ? W.units.filter(u => u.side === 0 && u.gone && u.gone !== 'left').length : 0, left = W ? W.units.filter(u => u.side === 0 && u.alive).length : 0, nx = CAMP_S[C.s + 1], pv = CAMP_S[C.s - 1];
  const h = `<b>1F · ${def.name}</b><span class="ck">${esc(def.kind)}${def.pick ? ' — ' + esc(def.pick[C.n3][0]) : ''}${W && W.cleared ? ' · 🏳 끝난 맵' : ''}${gone ? ` · 넘어간 이 ${gone}` : ''}</span><span class="cb">${W && !W.over ? `<button class="btn sm" type="button" data-cexit="up" title="고른 아군 (없으면 모두) 이 맵 위쪽 끝으로 가서 넘어감">↑ ${nx ? nx.name + '로' : '계단으로'}</button>${pv ? `<button class="btn sm" type="button" data-cexit="down" title="고른 아군 (없으면 모두) 이 맵 아래쪽 끝으로">↓ ${pv.name}로</button>` : ''}${gone && left ? `<button class="btn sm warn" type="button" data-cabandon="1" title="남은 아군은 이후 나오지 않음">아군을 버린다 (${left})</button>` : ''}${W.cleared ? '<button class="btn sm" type="button" data-cloot="1">전리품</button>' : ''}` : ''}<button class="btn sm" type="button" data-cquit="1">그만두기</button></span>`;
  if (h !== campBarH || el.hidden){ campBarH = h; el.innerHTML = h; el.hidden = false; }
}
$('campBar').addEventListener('click', e => {
  const C = S.camp; if (!C) return; const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.cquit){ if (confirm('캠페인을 그만두고 원래 배치로 돌아갈까요? (이 캠페인은 사라져요)')) campQuit(); return; }
  if (!world || !world.camp || world.over) return;
  if (b.dataset.cexit){ const dir = b.dataset.cexit, L0 = selUnits(world).filter(u => u.alive), L = L0.length ? L0 : world.units.filter(u => u.side === 0 && u.alive && !u.down);
    if (!L.length) return; for (const u of L) u.order = { k: 'exit', dir, x: u.x }; noteOrders(L); toast(`${L.map(u => u.name).join(' · ')} — ${dir === 'up' ? '위' : '아래'} 맵으로 (끝 띠에 닿으면 넘어감)`); hud(); return; }
  if (b.dataset.cabandon){ const L = world.units.filter(u => u.side === 0 && u.alive); if (!L.length || !confirm(`${L.map(u => u.name).join(' · ')} 을(를) 두고 갈까요? (이후 나오지 않음)`)) return;
    for (const u of L){ u.gone = 'left'; u.alive = false; u.order = null; } checkEnd(world); if (world.over){ mode = 'plan'; cont = false; paused = false; onOver(); } hud(); return; }
  if (b.dataset.cloot){ const bn = $('banner'); bn.className = 'banner win'; bn.innerHTML = `<b>끝난 맵 — 전리품</b><span>고른 동료의 가방으로 · 다음 맵에도 지님</span><div class="loot" id="lootBox">${lootHtml(world)}</div><div class="row"><button class="btn" type="button" id="lootClose">닫기</button></div>`; bn.hidden = false; $('lootClose').onclick = () => { bn.hidden = true; }; return; }
});
function onOver(){""")

# ---------- 모양 ----------
rep("/* v7.20.1 전리품 (결과 창) */", """/* v7.21 캠페인 띠 · 끝 화면 */
.campbar{position:absolute;left:50%;top:8px;transform:translateX(-50%);z-index:3;display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;max-width:calc(100% - 16px);background:rgba(20,17,22,.88);border:1px solid #3a3240;border-radius:8px;padding:6px 10px;color:#ece4d6;font:500 12.5px var(--body)}
.campbar b{font:700 14px var(--display);color:#d9a94e}
.campbar .ck{color:#a39a8c}
.campbar .cb{display:flex;flex-wrap:wrap;gap:6px}
.campbar .btn{min-height:32px}
.banner .cend{margin-top:8px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.banner .cend .ce{display:flex;flex-direction:column;align-items:center;gap:2px;font:600 12px var(--body);color:#ece4d6}
.banner .cend .ce i{display:block;width:40px;height:40px;border-radius:6px;border:1px solid #3a3240}
.banner .cend p{width:100%;margin:4px 0 0;font:500 12px var(--body);color:#a39a8c}
body.mob .campbar{top:4px;padding:4px 8px;font-size:12px}
/* v7.20.1 전리품 (결과 창) */""")

open(F, 'w', encoding='utf-8').write(s)
print('page721 OK')
