import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
# header / notes
rep("<!-- 굴의 전투판 v5.6 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.7 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.7: 전열 = 하나의 몸 (애벌레) — 나란히 같은 쪽을 보고 선 근접 둘 이상이 관절로 이어짐 (양쪽 같음). 판에 앞면을 잇는 곡선 · 관절 점 (방패를 든 마디는 네모) ·
           앞쪽 옅은 띠 (쥐고 있는 영역) · 양 끝 눈금 (약한 곳) · 끊긴 자리 붉은 ✕. 가운데 마디는 옆 동료가 가려 측면이 없음 (옆 동료가 방패를 들고 있으면 그 방패가 막음),
           덜 밀리고 덜 넘어짐, 손 닿는 곳에서 빠지는 적에게 공짜 일격, 쓰러진 자리는 뒷줄이 메움. 지휘가 있는 편은 자석 전열 — 흩어지지 않고 같이 나아감.
           전열 명령 (L): 고른 근접이 나란히 붙어 적 쪽을 봄, 같이 고른 사수 · 의무는 가운데 뒤로.
     v5.7: 막기는 선택 (B: 자동 → 유지 → 공격 위주). 방패 · 대검은 들어야 막음 — 드는 동안 못 치고 걸음이 느려짐. 맨몸으로 창칼을 막지 않음 (막는 역할은 방패병 —
           [반사신경] 맨몸은 막기 유지 명령일 때만 막고, 무기를 막으면 팔이 받아 낼 수 있음).
     v5.7: 서두르기 — 같은 곳을 빠르게 연달아 우클릭하면 (0.7초 안) '급함': 방패를 내리고 뜀. 한 번이면 급하지 않은 이동 (위협이 보이면 방패를 든 채 천천히).
     v5.7: 지킬 사람 — 약 · 사수 · 지휘를 가진 노먼이 우리 편의 '지킬 사람' (판에 금빛 점선 고리). 탱커가 먼저 감싸고, 막기 자동은 노먼을 노리는 적도 위협으로 봄.
           인주는 기동하는 일반 보병 (주인공이라고 더 감싸지 않음). 급소 (머리 · 심장 — 투창 · 화살이 머리에 박히면 즉사할 수 있음, 머리 넷은 머리 하나씩) · 무게 어림 · 넘어짐 확률.
""",'notes')
rep('<span class="ver">v5.6 · 줍기','<span class="ver">v5.7 · 전열 · 막기는 선택 · 서두르기 · 지킬 사람 · 급소 · 줍기','ver')
rep("<footer>굴의 전투판 v5.6","<footer>굴의 전투판 v5.7",'footer')
rep("return `굴의 전투판 v5.6 · ${title}","return `굴의 전투판 v5.7 · ${title}",'export')
# keys
rep("const m = { h: 'hold', g: 'auto', q: 'skill', e: 'pick', r: 'throw', f: 'active', v: 'swing', a: 'amove', x: 'cancel', backspace: 'cancel', delete: 'cancel' }[k];",
    "const m = { h: 'hold', g: 'auto', q: 'skill', e: 'pick', r: 'throw', f: 'active', v: 'swing', a: 'amove', b: 'guard', l: 'line', x: 'cancel', backspace: 'cancel', delete: 'cancel' }[k];",'keys')
# ordKey branches
rep("  else if (k === 'amove'){ amovePick = !amovePick;",
"""  else if (k === 'guard'){   // v5.7 막기는 선택: 자동 → 유지 → 공격 위주
    const C = L.filter(u => u.canGuard);
    if (!C.length){ toast('막을 방패 · 대검이 없어요 — 맨몸으로 창칼을 막지 않고 움직여서 피해요 (막는 역할은 방패병)'); return; }
    const nx = { auto: 'hold', hold: 'off', off: 'auto' }[C[0].guardMode || 'auto'];
    C.forEach(u => { u.guardMode = nx; if (nx === 'hold' && u.order && ['attack', 'amove', 'charge', 'throw'].includes(u.order.k)) u.order = null; logEv(world, { k: 'guardMode', a: u.i, m: nx, why: '명령' }); });
    const bare = C.filter(u => bareGuard(world, u));
    toast(`${C.map(u => u.name).join(' · ')} 막기: ${GM_TXT[nx]}${bare.length && nx === 'hold' ? ` — ${bare.map(u => u.name).join(' · ')}: 맨몸이라 무기를 막으면 팔을 다칠 수 있어요` : ''}`);
  }
  else if (k === 'line') giveLine(L);   // v5.7 전열 명령
  else if (k === 'amove'){ amovePick = !amovePick;""",'ordKey')
# GM_TXT + giveLine before cancelOrders
rep("// v5.1 명령 취소: 준 명령을 거둠",
"""// v5.7 막기 모드 · 전열 명령
const GM_TXT = { auto: '자동 (위협이 보이면 듦)', hold: '유지 (늘 듦 — 못 치고 방패 밀치기만)', off: '공격 위주 (안 듦)' }, GM_SHORT = { auto: '자동', hold: '유지', off: '공격 위주' };
// 고른 근접이 자석처럼 나란히: 가장 가까운 아는 적 쪽을 보는 줄, 마디 간격 line.gap. 옆 순서는 지금 선 자리대로 (엇갈리지 않음). 같이 고른 사수 · 의무는 가운데 뒤로
function giveLine(L){
  const M = L.filter(u => !isFar(u) && !u.crawl), back = L.filter(u => isFar(u) && !u.crawl);
  if (M.length < 2){ toast('전열은 근접 둘부터예요 (사수는 전열 뒤에 섬)'); return; }
  const c = { x: M.reduce((a, u) => a + u.x, 0) / M.length, y: M.reduce((a, u) => a + u.y, 0) / M.length };
  const e = world.units.filter(f => f.alive && f.side === 1 && (f.seenBy || $('seeAll').checked)).sort((a, b) => Math.hypot(a.x - c.x, a.y - c.y) - Math.hypot(b.x - c.x, b.y - c.y))[0];
  const f = e ? Math.atan2(e.y - c.y, e.x - c.x) : Math.atan2(M.reduce((a, u) => a + Math.sin(u.face || 0), 0), M.reduce((a, u) => a + Math.cos(u.face || 0), 0));
  const px = -Math.sin(f), py = Math.cos(f), G = (world.rules.line || {}).gap || 1.05;
  const sorted = [...M].sort((a, b) => ((a.x - c.x) * px + (a.y - c.y) * py) - ((b.x - c.x) * px + (b.y - c.y) * py));
  sorted.forEach((u, k) => { const off = (k - (sorted.length - 1) / 2) * G; let x = c.x + px * off, y = c.y + py * off; const q = freeSpot(world, x, y, u.r); if (q){ x = q.x; y = q.y; } u.order = { k: 'line', x, y, f }; });
  back.forEach((u, k) => { const off = (k - (back.length - 1) / 2) * 1.2; let x = c.x - Math.cos(f) * 1.6 + px * off, y = c.y - Math.sin(f) * 1.6 + py * off; const q = freeSpot(world, x, y, u.r); if (q){ x = q.x; y = q.y; } u.order = { k: 'move', x, y }; });
  noteOrders([...sorted, ...back]); hud();
  toast(`전열 ${sorted.length}마디: ${sorted.map(u => u.name).join(' · ')}${e ? ` — ${e.name} 쪽을 봄` : ''}${back.length ? ` · ${back.map(u => u.name).join(' · ')}는 가운데 뒤로` : ''}`);
}
// v5.1 명령 취소: 준 명령을 거둠""",'giveLine')
# order panel buttons
rep("""<button class="btn" type="button" data-ord="all">모두 고르기</button><button class="btn" type="button" data-ord="none">고르기 풀기</button></div>""",
"""${L.filter(u => !isFar(u)).length >= 2 ? `<button class="btn" type="button" data-ord="line" title="고른 근접이 자석처럼 나란히 붙어 적 쪽을 봄 · 같이 고른 사수 · 의무는 가운데 뒤로">전열 <kbd>L</kbd></button>` : ''}${L.some(u => u.canGuard) ? `<button class="btn ${L.find(u => u.canGuard).guardMode === 'hold' ? 'on' : ''}" type="button" data-ord="guard" title="자동: 위협이 보이면 듦 · 유지: 늘 듦 (못 치고 걸음이 느림, 방패 밀치기만) · 공격 위주: 안 듦 (갑옷만)">막기: ${GM_SHORT[L.find(u => u.canGuard).guardMode || 'auto']} <kbd>B</kbd></button>` : ''}<button class="btn" type="button" data-ord="all">모두 고르기</button><button class="btn" type="button" data-ord="none">고르기 풀기</button></div>""",'buttons')
# hurry: rightClick
rep("""  skillPick = null; throwPick = null; chargePick = null; groupMove(L, w.x, w.y, 'move'); hud();
}""","""  skillPick = null; throwPick = null; chargePick = null;
  // v5.7 서두르기: 같은 아군에게 같은 곳 (2칸 안) 을 0.7초 안에 다시 찍으면 급함 — 방패를 내리고 뜀
  const now = performance.now(), key = L.map(u => u.i).join(','), hurry = !!(lastRC && now - lastRC.t < 700 && lastRC.key === key && Math.hypot(lastRC.x - w.x, lastRC.y - w.y) < 2);
  lastRC = { t: now, key, x: w.x, y: w.y };
  groupMove(L, w.x, w.y, 'move', hurry); if (hurry) toast(`${L.map(u => u.name).join(' · ')}: 서둘러! — 방패를 내리고 뜀 (×${world.rules.run || 1.3})`); hud();
}
let lastRC = null;""",'rc')
rep("""function groupMove(L, wx, wy, kind){
  kind = kind || 'move';   // v5.2 'amove' = 공격 이동""","""function groupMove(L, wx, wy, kind, hurry){
  kind = kind || 'move';   // v5.2 'amove' = 공격 이동 · v5.7 hurry = 서두르기""",'gm1')
rep("""  if (L.length === 1){ L[0].order = { k: kind, x: tx, y: ty }; noteOrders(L); return; }""","""  if (L.length === 1){ L[0].order = { k: kind, x: tx, y: ty, ...(hurry ? { hurry: true } : {}) }; noteOrders(L); return; }""",'gm2')
rep("""    taken.add(gx + ',' + gy); u.order = { k: kind, x: gx + 0.5, y: gy + 0.5 };""","""    taken.add(gx + ',' + gy); u.order = { k: kind, x: gx + 0.5, y: gy + 0.5, ...(hurry ? { hurry: true } : {}) };""",'gm3')
# ACK
rep("""o.k === 'move' ? ['➜ 이동', '#d9a94e']""","""o.k === 'move' && o.hurry ? ['➜➜ 서둘러!', '#ffcf6e'] : o.k === 'move' ? ['➜ 이동', '#d9a94e'] : o.k === 'line' ? ['▬ 전열', '#9fd0ff']""",'ack')
open(P,'w').write(s); print('ok part1')
