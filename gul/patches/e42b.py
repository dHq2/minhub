h=open('rt3_head.js').read()
def rh(a,b):
    global h
    assert h.count(a)==1,(a[:80],h.count(a)); h=h.replace(a,b)
rh("""         어둠 속 명중: 야시도 후각 (거리 안) 도 없는 쪽이 빛 없는 칸의 상대를 치면 근접 darkAim · 원거리 ×darkAimFar (횃불이 사라지면 극도로 낮아짐).""","""         어둠 속 명중: 야시도 후각 (거리 안) 도 없는 쪽이 빛 없는 칸의 상대를 치면 근접 darkAim · 원거리 ×darkAimFar (횃불이 사라지면 극도로 낮아짐).
         야시 등급: A = 어둠 속에서도 보는 거리 전부, B = 어둠 속에서는 nvB 칸까지. 횃불을 든 이 (torch) 가 쓰러지면 횃불이 그 자리에 떨어지고 (빛은 남음), 누구든 주워 들 수 있음.""")
rh("""  sight: 9,           // 보는 거리 (칸). 야시가 없으면 이 안이라도 빛 안에 있어야 보임""","""  sight: 9,           // 보는 거리 (칸). 야시가 없으면 이 안이라도 빛 안에 있어야 보임
  nvB: 5,             // 야시 B: 어둠 속에서 보는 거리 (칸). 야시 A 는 보는 거리 전부""")
open('rt3_head.js','w').write(h)

m=open('rt3_mid.js').read()
def rm(a,b):
    global m
    assert m.count(a)==1,(a[:80],m.count(a)); m=m.replace(a,b)
rm("""  const L = [], h = W.units.find(u => u.hero && u.alive);
  if (h) L.push({ x: h.x, y: h.y, r: W.rules.heroLight, f: 0 });""","""  const L = [];
  for (const h of W.units) if (h.torch && h.alive) L.push({ x: h.x, y: h.y, r: W.rules.heroLight, f: 0 });   // 횃불을 든 이 (처음엔 주인공)""")
rm("""  if (!u.nv && !litAt(W, t.x, t.y)) return false;""","""  if (!litAt(W, t.x, t.y)){ if (!u.nv) return false; if (u.nvG === 'B' && d > (W.rules.nvB || 5)) return false; }   // 야시 B 는 어둠 속에선 nvB 칸까지""")
open('rt3_mid.js','w').write(m)

s=open('rt3_tail.js').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:80],s.count(a)); s=s.replace(a,b)
rep("""hero: !!p.hero, nv: !!p.nv, weapon:""","""hero: !!p.hero, torch: !!p.hero, nv: !!p.nv, nvG: p.nv ? (p.nvG === 'A' ? 'A' : 'B') : '', weapon:""")
# drop torch on death
rep("""  if (t.hp <= 0){
    t.alive = false; t.hp = 0; t.act = null; u.kills++; if (!o.ff) W.kills[u.side]++; stop(t);
    L(W, { k: 'die', a: u.i, b: t.i, ff: !!o.ff });""","""  if (t.hp <= 0){
    t.alive = false; t.hp = 0; t.act = null; u.kills++; if (!o.ff) W.kills[u.side]++; stop(t);
    L(W, { k: 'die', a: u.i, b: t.i, ff: !!o.ff });
    if (t.torch){ t.torch = false; W.torches.push({ x: +t.x.toFixed(2), y: +t.y.toFixed(2), dropped: true, fell: true }); computeLight(W); L(W, { k: 'torchDrop', a: t.i, x: +t.x.toFixed(2), y: +t.y.toFixed(2) }); }""")
# torch sensing from any carrier (also for nv B beyond range)
rep("""  const hero = W.units.find(h => h.hero && h.alive);
  if (u.side === 1 && !u.nv && hero && dist(u, hero) <= R.sight * 1.6 && losClear(W.map, u.x, u.y, hero.x, hero.y) && !fresh(W, u.sense[hero.i], 0.9)) u.sense[hero.i] = { x: hero.x + (W.rand() - 0.5), y: hero.y + (W.rand() - 0.5), t: W.t, exact: false, light: true };""","""  const hero = W.units.find(h => h.hero && h.alive);
  // 횃불은 멀리서도 보임 (보는 거리 × 1.6, 바위가 가리면 안 보임) → 든 이의 대략 자리를 앎
  for (const c of W.units) if (c.torch && c.alive && c.side !== u.side && dist(u, c) <= R.sight * 1.6 && !canSee(W, u, c) && losClear(W.map, u.x, u.y, c.x, c.y) && !fresh(W, u.sense[c.i], 0.9)) u.sense[c.i] = { x: c.x + (W.rand() - 0.5), y: c.y + (W.rand() - 0.5), t: W.t, exact: false, light: true };""")
# pick torch: order + auto
rep("""  if (o.k === 'skill'){
    // 기술 명령""","""  if (o.k === 'pick'){
    // 횃불 줍기: 떨어진 횃불 자리로 가서 주워 듦
    const tc = nearTorch(W, u, 99, o);
    if (!tc){ u.order = { k: 'hold' }; return; }
    if (Math.hypot(tc.x - u.x, tc.y - u.y) <= 0.7){ pickTorch(W, u, tc); u.order = { k: 'hold' }; return; }
    setMood(W, u, '횃불 줍기'); goTo(W, u, tc.x, tc.y, dt); return;
  }
  if (o.k === 'skill'){
    // 기술 명령""")
rep("""function faceTo(u, t){""","""// 떨어진 (내려놓은) 횃불 중 가장 가까운 것. o 가 있으면 그 자리 근처의 것
function nearTorch(W, u, far, o){
  let b = null, bd = far;
  for (const t of W.torches){ if (!t.dropped) continue; const d = o ? Math.hypot(t.x - o.x, t.y - o.y) + Math.hypot(t.x - u.x, t.y - u.y) * 0.01 : Math.hypot(t.x - u.x, t.y - u.y); if (d < bd){ bd = d; b = t; } }
  return b;
}
function pickTorch(W, u, tc){
  W.torches = W.torches.filter(t => t !== tc); u.torch = true; computeLight(W);
  L(W, { k: 'torchPick', a: u.i, x: +tc.x.toFixed(2), y: +tc.y.toFixed(2) });
}
function faceTo(u, t){""")
rep("""  if (!(u.mood === '살핌' && W.units.some(f => f.alive && f.side !== u.side && fresh(W, u.sense[f.i])))) setMood(W, u, '');""","""  // 횃불을 든 동료가 없으면, 4칸 안에 떨어진 횃불을 주우러 감 (자동일 때)
  if (!W.units.some(a => a.alive && a.side === u.side && a.torch)){ const tc = nearTorch(W, u, 4); if (tc){ if (Math.hypot(tc.x - u.x, tc.y - u.y) <= 0.7) pickTorch(W, u, tc); else { setMood(W, u, '횃불 줍기'); goTo(W, u, tc.x, tc.y, dt); } return; } }
  if (!(u.mood === '살핌' && W.units.some(f => f.alive && f.side !== u.side && fresh(W, u.sense[f.i])))) setMood(W, u, '');""")
rep("""const orderTxt = o => !o ? ['auto'] : o.k === 'move' ? ['move', +o.x.toFixed(2), +o.y.toFixed(2)] : o.k === 'attack' ? ['attack', o.b] : o.k === 'skill' ? ['skill', o.b] : ['hold'];""","""const orderTxt = o => !o ? ['auto'] : o.k === 'move' ? ['move', +o.x.toFixed(2), +o.y.toFixed(2)] : o.k === 'attack' ? ['attack', o.b] : o.k === 'skill' ? ['skill', o.b] : o.k === 'pick' ? ['pick', +o.x.toFixed(2), +o.y.toFixed(2)] : ['hold'];""")
s=s.replace("module.exports = { blindTo,","module.exports = { pickTorch, nearTorch, blindTo,")
open('rt3_tail.js','w').write(s)
print('ok')
