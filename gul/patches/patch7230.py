# v7.23.0 엔진 — patch7230.py v1.3 (v1.3: 이름 warden — rules.ward · W.ward 는 딸기 역장 · v1.2: 모퉁이로 갈 때 먼저 옆으로 비켜섬 · v1.1: 지킴이 칸 이름 (post 아님) — u.post 는 이미 막기 자세 수치 · 6단계 4S 실내전: 실내 규칙 — 지금 보이는 곳 (visNow) · 벽을 보는 가 본 곳 · 구역 빛 (zones) · 방 지킴이 (post) — 방마다 따로 숨어 기다림 · 보이면 문 옆 모퉁이 · 지나치면 어둠 속 뒤따름)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
FS = {k: open(D + k + '.js', encoding='utf-8').read() for k in ('rt3_head', 'rt3_mid', 'rt3_tail')}
def rep(f, a, b, c=1):
    n = FS[f].count(a)
    assert n == c, (f, n, c, a[:100])
    FS[f] = FS[f].replace(a, b)

# 규칙
rep('rt3_head', '  spec: { blink:', '''  warden: { near: 3.5, mate: 7, corner: 8, see: 0.6 },   /* v7.23 방 지킴이: near = 이만큼 안 (벽 너머는 아님) 이면 터짐 · mate = 방이 없을 때 곁의 동료 · corner = 모퉁이에서 기다리는 최대 초 · see = 우리를 본 지 이만큼 뒤 모퉁이로 */
  spec: { blink:''')

# 지형: 실내 · 구역 빛
rep('rt3_mid', 'm.hills = hills.length ? hills : null; m.pk = null; m.piles = 0;',
    'm.hills = hills.length ? hills : null; m.pk = null; m.piles = 0;\n  m.indoor = !!setup.indoor; { const Z = (setup.zones || []).filter(z => z && isFinite(+z.amb)).map(z => ({ x0: Math.max(0, +z.x0 | 0), y0: Math.max(0, +z.y0 | 0), x1: Math.min(m.W - 1, +z.x1 | 0), y1: Math.min(m.H - 1, +z.y1 | 0), amb: Math.max(0, Math.min(1, +z.amb)) })); m.zones = Z.length ? Z : null; }   /* v7.23 실내 (벽이 시야를 자름) · 구역 빛 (맵 일부에만 주변광 — 사막 끝 햇살 등) */')
rep('rt3_mid', 'const m = W.map, Lm = W.light; Lm.fill(W.amb || 0);   // v7.22.2 주변광 (밝은 맵)',
    'const m = W.map, Lm = W.light; Lm.fill(W.amb || 0);   // v7.22.2 주변광 (밝은 맵)\n  if (m.zones) for (const z of m.zones) for (let y = z.y0; y <= z.y1; y++) for (let x = z.x0; x <= z.x1; x++){ const i = y * m.W + x; if (z.amb > Lm[i]) Lm[i] = z.amb; }   /* v7.23 구역 빛 */')

# 가 본 곳 · 지금 보이는 곳 (실내만 — 다른 맵은 그대로)
rep('rt3_tail', 'function markExplored(W){\n  const m = W.map, al = W.units.filter(u => u.alive && u.side === 0);',
    '''function markExplored(W){
  const m = W.map, al = W.units.filter(u => u.alive && u.side === 0);
  if (m.indoor){ markIndoor(W, al); return; }   /* v7.23 실내는 벽을 봄 */''')
rep('rt3_tail', '/* ---------- 움직임 ---------- */\nconst dist = (a, b) =>',
    '''// v7.23 실내: 아군 눈에서 벽에 막히지 않고 보는 거리 안인 칸 = 지금 보이는 곳 (visNow — 그림은 이 밖을 '기억한 모습' 으로만). 가 본 곳도 보이는 칸만 (벽 너머 불 켜진 방이 저절로 밝혀지지 않음)
function markIndoor(W, al){
  const m = W.map, V = W.visNow && W.visNow.length === m.W * m.H ? W.visNow : (W.visNow = new Uint8Array(m.W * m.H)), sr = W.rules.sight; V.fill(0);
  for (const a of al){ const nvR = a.nv ? (a.nvG === 'D' ? W.rules.nvD || 2.5 : a.nvG === 'C' ? W.rules.nvC || 3.75 : a.nvG === 'B' ? W.rules.nvB || 5 : sr) : 0;
    const x0 = Math.max(0, Math.floor(a.x - sr)), x1 = Math.min(m.W - 1, Math.floor(a.x + sr)), y0 = Math.max(0, Math.floor(a.y - sr)), y1 = Math.min(m.H - 1, Math.floor(a.y + sr));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++){ const i = y * m.W + x, cx = x + 0.5, cy = y + 0.5, d = Math.hypot(cx - a.x, cy - a.y); if (d > sr) continue;
      if (d > 1.2){ const wall = m.t[i] === 1 || m.t[i] === 3, tx = wall ? cx - (cx - a.x) / d * 0.6 : cx, ty = wall ? cy - (cy - a.y) / d * 0.6 : cy; if (!V[i] && !losClear(m, a.x, a.y, tx, ty)) continue; }   // 벽 칸은 앞면까지
      V[i] = 1; if (W.explored[i] === 2) continue;
      if (W.light[i] > LIT) W.explored[i] = 2; else if (d <= nvR) W.explored[i] = Math.max(W.explored[i], 1); } }
}

/* ---------- 움직임 ---------- */
const dist = (a, b) =>''')

# 방 지킴이: 만들 때
rep('rt3_tail', "seenBy: false, engaged: false, slot: 0, wander: 0, moved: 0 });\n}",
    "seenBy: false, engaged: false, slot: 0, wander: 0, moved: 0 });\n  if (p.warden){ const P = p.warden, U = W.units[i]; U.warden = { on: true, room: P.room != null ? String(P.room) : null, door: P.door && isFinite(+P.door.x) ? { x: +P.door.x, y: +P.door.y } : null, corner: P.corner && isFinite(+P.corner.x) ? { x: +P.corner.x, y: +P.corner.y } : null, seen: null, seeT: null, cT: null }; if (U.warden.door) U.face = U.fg = Math.atan2(U.warden.door.y - U.y, U.warden.door.x - U.x); }   /* v7.23 방 지킴이 */\n}")
# 숨음: 지킴이는 가만히 웅크려 숨음 (은신 등급만큼)
rep('rt3_tail', 'if (!(t.stealth || t.lurk || t.stalk) || !t.stealthE', 'if (!(t.stealth || t.lurk || t.stalk || (t.warden && t.warden.on)) || !t.stealthE')
rep('rt3_tail', "if (!(a.stealth || a.lurk || a.stalk) || stealthK(W, a) >= 1) return { ok: false, why: '숨지 않음' };",
    "if (!(a.stealth || a.lurk || a.stalk || (a.warden && a.warden.on)) || stealthK(W, a) >= 1) return { ok: false, why: '숨지 않음' };")
# 들킴을 느낌
rep('rt3_tail', "if (!u.alive || u.down || !(u.stealth || u.lurk)){ u.feelT = null; continue; }",
    "if (!u.alive || u.down || !(u.stealth || u.lurk || (u.warden && u.warden.on))){ u.feelT = null; continue; }")
rep('rt3_tail', "    if (u.lurk){ u.lurkSeen = by != null ? by : -1; continue; }   // 매복: lurkStep 이 터뜨림",
    "    if (u.lurk){ u.lurkSeen = by != null ? by : -1; continue; }   // 매복: lurkStep 이 터뜨림\n    if (u.warden && u.warden.on){ u.warden.seen = by != null ? by : -1; continue; }   /* v7.23 지킴이: wardenStep 이 터뜨림 */")
# 지킴이는 다른 일 (약속 · 암살조) 에 뽑히지 않음
rep('rt3_tail', "const pactFree = (W, u) => u.alive && !u.crawl && !u.pact && !u.shadow &&", "const pactFree = (W, u) => u.alive && !u.crawl && !u.pact && !u.shadow && !(u.warden && u.warden.on) &&")
rep('rt3_tail', "const cand = E.filter(e => !isFar(e) && !e.shadow && e.role !== '전선'", "const cand = E.filter(e => !isFar(e) && !e.shadow && !(e.warden && e.warden.on) && e.role !== '전선'")
# AI 차례
rep('rt3_tail', "  if (u.side === 1 && lurkStep(W, u, dt)) return;   // v6.1 매복",
    "  if (u.side === 1 && lurkStep(W, u, dt)) return;   // v6.1 매복\n  if (u.warden && u.warden.on && wardenStep(W, u, dt)) return;   /* v7.23 방 지킴이 (양쪽 같은 규칙) */")
rep('rt3_tail', "// 판마다 다른 시작: 적의 시작 자리를 판 번호 (씨앗) 로 고름. 아군 자리는 그대로",
    '''// v7.23 방 지킴이: 방 안 어둠에 웅크려 문 쪽을 봄 — 방마다 따로, 시간 제한 없이. 터지는 때: 상대가 near 칸 안 (벽 너머는 아님) · 맞음 · 같은 방 동료가 싸움 · 들킴을 느낌.
//   문틈으로 상대를 보면 곧장 덮치지 않고 문 옆 모퉁이 (corner) 로 붙어 기다림 → 들어오면 (near) 터짐. corner 초가 지나도록 안 오면 (지나쳐 감) 어둠 속으로 뒤따름 (stalk — 등 뒤 · 들키지 않으면 기존 암살 규칙)
function wardenStep(W, u, dt){
  const P = u.warden, R = W.rules.warden || {}; if (!P || !P.on) return false;
  const foes = W.units.filter(a => a.alive && a.side !== u.side && !a.gone), m = W.map;
  const near = foes.find(a => { const d = dist(a, u); return d < (R.near || 3.5) && (d < 1.2 || losClear(m, u.x, u.y, a.x, a.y)); });
  const mate = !near && W.units.find(o => o !== u && o.alive && o.side === u.side && (P.room != null ? o.warden && o.warden.room === P.room : dist(o, u) < (R.mate || 7)) && busyW(W, o));
  const hurt = u.taken > 0, felt = P.seen != null;
  const out = (why, b, stalkOn) => { const lk = W.units.filter(o => o.alive && o.side === u.side && o.warden && o.warden.on && (o === u || (P.room != null && o.warden.room === P.room)));
    for (const o of lk){ o.warden.on = false; if (b && b.alive){ o.state = 'hunt'; o.target = b; o.last = { x: b.x, y: b.y }; o.searchT = 12; o.sense[b.i] = { x: b.x, y: b.y, t: W.t, exact: o === u && why !== 'heard' }; } if (stalkOn) o.stalk = true; }
    L(W, { k: 'wardenOut', side: u.side, a: u.i, n: lk.length, room: P.room, why, b: b ? b.i : null, vis: u.side === 0 || lk.some(o => o.seenBy) }); return false; };
  if (near) return out('near', near);
  if (hurt) return out('hit', foes.slice().sort((a, b) => dist(a, u) - dist(b, u))[0]);
  if (felt) return out('seen', P.seen >= 0 ? W.units[P.seen] : null);
  if (mate) return out('mate', mate.target && mate.target.alive ? mate.target : null);
  const see = foes.filter(a => canSee(W, u, a)).sort((a, b) => dist(a, u) - dist(b, u))[0];
  if (see){ if (P.seeT == null) P.seeT = W.t; P.last = see.i; }
  if (P.corner && P.seeT != null && W.t - P.seeT >= (R.see != null ? R.see : 0.6)){   // 본 뒤: 문 옆 모퉁이로 붙어 기다림
    if (P.cT == null){ P.cT = W.t; if (P.door){ const dx = u.x - P.door.x, dy = u.y - P.door.y; P.via = Math.abs(dx) > Math.abs(dy) ? { x: u.x, y: P.corner.y } : { x: P.corner.x, y: u.y }; } L(W, { k: 'wardenCorner', side: u.side, a: u.i, room: P.room, vis: u.side === 0 || !!u.seenBy }); }   // 먼저 문틈 줄에서 옆으로 비켜선 뒤 벽을 따라 (줄을 따라 걸으면 들킴)
    if (W.t - P.cT > (R.corner || 8)){ const b = W.units[P.last]; return out('pass', b && b.alive ? b : null, true); }   // 오지 않음 — 지나쳐 감 → 어둠 속으로 뒤따름
    if (P.via && Math.hypot(P.via.x - u.x, P.via.y - u.y) <= 0.3) P.via = null;
    if (P.via){ setMood(W, u, '문틈 줄에서 비켜섬'); goTo(W, u, P.via.x, P.via.y, dt); }
    else if (Math.hypot(P.corner.x - u.x, P.corner.y - u.y) > 0.25){ setMood(W, u, '문 옆 모퉁이로'); goTo(W, u, P.corner.x, P.corner.y, dt); }
    else { stop(u); setMood(W, u, '모퉁이에서 기다림'); if (P.door) u.fg = Math.atan2(P.door.y - u.y, P.door.x - u.x); }
    return true;
  }
  stop(u); setMood(W, u, '숨어 지킴'); const tg = see || (P.door ? null : foes.slice().sort((a, b) => dist(a, u) - dist(b, u))[0]);
  u.fg = tg ? Math.atan2(tg.y - u.y, tg.x - u.x) : P.door ? Math.atan2(P.door.y - u.y, P.door.x - u.x) : u.fg;
  return true;
}
// 판마다 다른 시작: 적의 시작 자리를 판 번호 (씨앗) 로 고름. 아군 자리는 그대로''')
rep('rt3_tail', "if (typeof module !== 'undefined') module.exports = { wpnSpec,", "if (typeof module !== 'undefined') module.exports = { wardenStep, markIndoor, wpnSpec,")

for k, v in FS.items():
    open(D + k + '.js', 'w', encoding='utf-8').write(v)
print('patch7230 OK')
