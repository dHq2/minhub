h=open('rt3_head.js').read()
def rh(a,b):
    global h
    assert h.count(a)==1,(a[:80],h.count(a)); h=h.replace(a,b)
rh("""/* ===== 전투 엔진 v4.2 —""","""/* ===== 전투 엔진 v4.3 —""")
rh("""   v3.4: 맵 종류 gridC""","""   v4.3: 투사체: 원거리 공격은 쏘는 순간 그 자리를 향해 날아가는 탄 (W.shots). 명중률로 겨눔이 흔들리고 (빗나가면 몸 옆으로 지나감),
         날아가는 길에 먼저 닿는 몸이 맞음 (뒤 · 옆의 다른 적 · 아군도). 쏜 뒤엔 대상을 따라가지 않음. 무기마다 탄속 (vel, 칸/초) — 화살 · 마법은 느려서 피할 수 있음.
         명령이 끝나면 자동: 이동 명령은 도착한 자리 (stay) 를 지키며 스스로 판단 (stayLeash 칸 안의 적과 싸우고, 없으면 그 자리로 돌아옴). '자동' 을 누르면 다시 주인공을 따라감.
   v3.4: 맵 종류 gridC""")
rh("""             '샷건':{rng:2.5, ammo:4, loud:true, aim:0.6}, '마법':{rng:4, aim:0.6}, '총':{rng:5, ammo:8, loud:true}, '활':{rng:6, ammo:12, aim:0.5}, '저격총':{rng:7, ammo:5, loud:true, aim:0.8} },""",
"""             '샷건':{rng:2.5, ammo:4, loud:true, aim:0.6, vel:45}, '마법':{rng:4, aim:0.6, vel:12}, '총':{rng:5, ammo:8, loud:true, vel:60}, '활':{rng:6, ammo:12, aim:0.5, vel:16}, '저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:80} },""")
rh("""  // ammo = 탄약 (없으면 무한), loud = 총성 (소리 난 자리가 알려짐), guard = 방어 자세로 막을 수 있는 무기, aim = 사거리 끝 명중률 (없으면 aimFar)""","""  // ammo = 탄약 (없으면 무한), loud = 총성 (소리 난 자리가 알려짐), guard = 방어 자세로 막을 수 있는 무기, aim = 사거리 끝 명중률 (없으면 aimFar), vel = 탄속 (칸/초)""")
rh("""  leash: 8,           // 자동인 동료가 주인공에게서 이 이상 떨어지면 돌아옴""","""  leash: 8,           // 자동인 동료가 주인공에게서 이 이상 떨어지면 돌아옴
  stayLeash: 4,       // 이동 명령으로 자리 잡은 뒤 (자동): 그 자리에서 이 거리 안의 적만 쫓아 싸움""")
open('rt3_head.js','w').write(h)

s=open('rt3_tail.js').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:80],s.count(a)); s=s.replace(a,b)
rep("""fx: [], log: [], noises: [], brief: null,""","""fx: [], log: [], noises: [], brief: null, shots: [], shotN: 0,""")
# ranged resolve -> launch projectile
rep("""      // 쏨: 선 위에 먼저 걸리는 몸이 맞음 (보이든 안 보이든). 준비를 시작한 뒤 끼어든 아군이면 오사
      fire(W, u);
      const recv = firstOnLine(W, u, t, u), p = recv === t ? aimP(W, u, t) : Math.max(aimP(W, u, recv), 0.9);
      if (W.fxOn) W.fx.push({ k: 'shot', a: u.i, b: recv.i, t0: W.t, dur: Math.min(0.25, 0.04 * dist(u, recv)) });
      if (W.rand() >= p){ u.miss++; L(W, { k: 'miss', a: u.i, b: t.i, why: `빗맞음 (명중률 ${Math.round(p * 100)}%)`, fired: true, p: +p.toFixed(2) }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '빗나감', c: 'm', t0: W.t }); }
      else strike(W, u, recv, t, p);
      if (u.ammo === 0) outOfAmmo(W, u);""","""      // 쏨: 이 순간 대상이 있는 쪽으로 탄이 날아감 (따라가지 않음). 길에 먼저 닿는 몸이 맞음 — 다른 적 · 아군 (오사) 도
      fire(W, u);
      launch(W, u, t);
      if (u.ammo === 0) outOfAmmo(W, u);""")
rep("""// 탄약 · 총성: 쏜 자리에""","""// 투사체: 명중률만큼 대상 몸 안쪽을, 아니면 몸 옆 (0.12~0.67칸 비켜) 을 겨눔. 사거리 + 2.5칸까지 날아감
function launch(W, u, t){
  const wp = (W.rules.weapons && W.rules.weapons[u.weapon]) || {};
  const d = Math.max(0.3, dist(u, t)), p = aimP(W, u, t), base = Math.atan2(t.y - u.y, t.x - u.x);
  const off = W.rand() < p ? (W.rand() * 2 - 1) * t.r * 0.55 : (W.rand() < 0.5 ? -1 : 1) * (t.r + 0.12 + W.rand() * 0.55);
  const ang = base + Math.atan2(off, d), dx = Math.cos(ang), dy = Math.sin(ang);
  W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: wp.vel || 40, left: u.rng + u.r + 2.5, p: +p.toFixed(2), t0: W.t, side: u.side });
}
function stepShots(W, dt){
  for (const s of W.shots){
    let rem = s.sp * dt;
    while (rem > 1e-6 && !s.done){
      const st = Math.min(0.15, rem, s.left); rem -= st;
      const nx = s.x + s.dx * st, ny = s.y + s.dy * st;
      let hit = null, hk = 2;
      for (const b of W.units){
        if (!b.alive || b.i === s.a) continue;
        const k = Math.max(0, Math.min(1, ((b.x - s.x) * s.dx + (b.y - s.y) * s.dy) / st));
        if (Math.hypot(b.x - (s.x + s.dx * st * k), b.y - (s.y + s.dy * st * k)) <= b.r && k < hk){ hk = k; hit = b; }
      }
      const u = W.units[s.a];
      if (hit){
        s.done = true; s.x += s.dx * st * hk; s.y += s.dy * st * hk;
        strike(W, u, hit, W.units[s.meant], hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true);
        break;
      }
      if (rock(W.map, nx, ny)){ s.done = true; u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: '빗나가 바위에 맞음', fired: true, p: s.p }); break; }
      s.x = nx; s.y = ny; s.left -= st;
      if (s.left <= 1e-6){ s.done = true; u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: `빗나감 (명중률 ${Math.round(s.p * 100)}%)`, fired: true, p: s.p }); if (W.fxOn){ const m = W.units[s.meant]; W.fx.push({ k: 'num', x: m.x, y: m.y, s: '빗나감', c: 'm', t0: W.t }); } }
    }
    if (s.done && W.fxOn) W.fx.push({ k: 'spark', x: s.x, y: s.y, t0: W.t, side: s.side });
  }
  if (W.shots.length) W.shots = W.shots.filter(s => !s.done);
}
// 탄약 · 총성: 쏜 자리에""")
# strike: far override
rep("""function strike(W, u, t, meant, p){""","""function strike(W, u, t, meant, p, far){""")
rep("""  const o = { led, dir, meant: meant !== t ? meant.i : null, ff: t.side === u.side, far: isFar(u), p: p < 1 ? +p.toFixed(2) : null };""","""  const o = { led, dir, meant: meant !== t ? meant.i : null, ff: t.side === u.side, far: far != null ? far : isFar(u), p: p < 1 ? +p.toFixed(2) : null };""")
# step shots in stepWorld after acts
rep("""  separate(W);
  for (const u of W.units) if (u.alive) turnTo(W, u, dt);""","""  stepShots(W, dt);
  separate(W);
  for (const u of W.units) if (u.alive) turnTo(W, u, dt);""")
# orders end -> auto (stay)
rep("""    if (Math.hypot(u.x - o.x, u.y - o.y) < 0.12){ L(W, { k: 'arrive', a: u.i }); u.order = { k: 'hold' }; stop(u); return; }""","""    // 도착 → 자동 (그 자리를 지키며 스스로 판단)
    if (Math.hypot(u.x - o.x, u.y - o.y) < 0.12){ L(W, { k: 'arrive', a: u.i }); u.order = null; u.stay = { x: o.x, y: o.y }; stop(u); return; }""")
rep("""    if (!u.path){ L(W, { k: 'stuck', a: u.i }); u.order = { k: 'hold' }; }""","""    if (!u.path){ L(W, { k: 'stuck', a: u.i }); u.order = null; u.stay = { x: u.x, y: u.y }; }""")
rep("""    if (!t || !t.alive){ u.order = { k: 'hold' }; return; }
    const see = canSee(W, u, t);""","""    if (!t || !t.alive){ u.order = null; return; }   // 상대가 쓰러지면 자동
    const see = canSee(W, u, t);""")
rep("""L(W, { k: 'lost', a: u.i, b: t.i }); u.order = { k: 'hold' }; return; }""","""L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return; }""")
rep("""    if (Math.hypot(tc.x - u.x, tc.y - u.y) <= 0.7){ pickTorch(W, u, tc); u.order = { k: 'hold' }; return; }""","""    if (Math.hypot(tc.x - u.x, tc.y - u.y) <= 0.7){ pickTorch(W, u, tc); u.order = null; u.stay = u.stay || { x: u.x, y: u.y }; return; }""")
rep("""    if (u.order && u.order.k === 'skill' && u.order.b === t.i) u.order = { k: 'hold' };""","""    if (u.order && u.order.k === 'skill' && u.order.b === t.i){ u.order = null; u.stay = u.stay || { x: u.x, y: u.y }; }""")
rep("""    if (t.hp >= t.max - 0.5){ L(W, { k: 'skillSkip', a: u.i, b: t.i }); u.order = { k: 'hold' }; return; }""","""    if (t.hp >= t.max - 0.5){ L(W, { k: 'skillSkip', a: u.i, b: t.i }); u.order = null; return; }""")
# think: stay anchor
rep("""  const anchor = hero && !u.hero ? hero : u;
  const seen = foes.filter(f => canSee(W, u, f) && (u.hero || dist(f, anchor) <= R.leash)).sort((a, b) => dist(u, a) - dist(u, b));""","""  // 자리를 잡은 동료 (stay): 그 자리에서 stayLeash 안의 적만. 아니면 주인공 둘레 leash 안 (주인공은 어디든)
  const anchor = u.stay || (hero && !u.hero ? hero : u), lim = u.stay ? R.stayLeash || 4 : R.leash;
  const seen = foes.filter(f => canSee(W, u, f) && ((u.hero && !u.stay) || dist(f, anchor) <= lim)).sort((a, b) => dist(u, a) - dist(u, b));""")
rep("""  u.state = u.hero || !hero ? 'explore' : 'follow';   // 주인공이 쓰러지면 남은 동료가 직접 찾아 나섬""","""  u.state = u.stay ? 'stay' : u.hero || !hero ? 'explore' : 'follow';   // 주인공이 쓰러지면 남은 동료가 직접 찾아 나섬""")
rep("""  if (u.state === 'follow' && hero){""","""  if (u.state === 'stay' && u.stay){   // 지키는 자리로 돌아와 섬 (살핌은 act 에서)
    if (Math.hypot(u.x - u.stay.x, u.y - u.stay.y) > 0.4){ setMood(W, u, '자리로'); goTo(W, u, u.stay.x, u.stay.y, dt); } else stop(u);
    return;
  }
  if (u.state === 'follow' && hero){""")
rep("""const orderTxt = o => !o ? ['auto'] :""","""const orderTxt = (o, u) => !o ? (u && u.stay ? ['auto', +u.stay.x.toFixed(2), +u.stay.y.toFixed(2)] : ['auto']) :""")
s=s.replace("""orders: W.units.filter(u => u.side === 0 && u.alive).map(u => [u.i, orderTxt(u.order)])""","""orders: W.units.filter(u => u.side === 0 && u.alive).map(u => [u.i, orderTxt(u.order, u)])""")
s=s.replace("""order: u.side === 0 ? orderTxt(u.order) : null""","""order: u.side === 0 ? orderTxt(u.order, u) : null""")
s=s.replace("module.exports = { pickTorch,","module.exports = { launch, stepShots, pickTorch,")
open('rt3_tail.js','w').write(s)
print('ok', s.count('orderTxt(u.order, u)'))
