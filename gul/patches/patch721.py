# v7.21.0 엔진 — patch721.py v1.2 (v1.2: 걷는 길 지름길은 무더기 · 뿌리 벽도 막힘으로 봄 (walkClear — 무더기 앞에서 멈추던 것, v7.18 부터) · v1.1: 나가는 목표는 끝 줄의 가장 가까운 빈 칸 · 몸이 띠에 닿으면 넘어감 · 4단계 캠페인: 맵 끝으로 나감 (명령 exit · 위 / 아래 끝 띠) · 캠페인 판 (W.camp) 은 적을 다 쓰러뜨려도 끝나지 않고 '끝난 맵' · 아군이 모두 나가거나 쓰러지면 끝 (exit / lose) · 시간 제한 없음 · 이어받은 체력 hpNow · 남은 치료 횟수 skLeft)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "  inv: { cap: {", "  camp: { band: 0.9 },   /* v7.21 캠페인: 맵 위 · 아래 끝 띠 (칸) — 닿으면 맵에서 나감 */\n  inv: { cap: {")
wr('rt3_head.js', h)

s = rd('rt3_tail.js')
s = rep(s, "function checkEnd(W){", """function checkEnd(W){
  if (W.camp){   // v7.21 캠페인 판: 적을 다 쓰러뜨려도 끝나지 않음 ('끝난 맵' — 정리하고 원할 때 이동) · 아군이 모두 나가거나 쓰러지면 끝 · 시간 제한 없음
    const a = W.units.some(u => u.alive && u.side === 0), b = W.units.some(u => u.alive && u.side === 1);
    if (!b && !W.cleared){ W.cleared = true; L(W, { k: 'cleared', vis: true }); }
    if (!a){ W.over = true; W.result = W.units.some(u => u.side === 0 && u.gone && u.gone !== 'left') ? 'exit' : 'lose'; }
    return W.over; }""")
s = rep(s, "  if (o.k === 'swap'){ invOrder(W, u, o); return; }", "  if (o.k === 'swap'){ invOrder(W, u, o); return; }\n  if (o.k === 'exit'){ exitStep(W, u, o, dt); return; }   // v7.21 맵 끝으로")
s = rep(s, "pool: +p.skill.pool, left: +p.skill.pool,", "pool: +p.skill.pool, left: p.skLeft != null && isFinite(+p.skLeft) ? Math.max(0, Math.min(+p.skill.pool, +p.skLeft)) : +p.skill.pool,")   # v7.21 남은 치료 횟수 이어받음
s = rep(s, "hp: s.hp, max: s.hp,", "hp: p.hpNow != null && isFinite(+p.hpNow) ? Math.max(1, Math.min(s.hp, +p.hpNow)) : s.hp, max: s.hp,")   # v7.21 이어받은 체력
s = rep(s, "/* ---------- v7.20 소지품 (가방) · 내구도", r"""/* ---------- v7.21 캠페인: 맵 끝으로 나감 — 위 · 아래 끝 띠 (camp.band 칸) 에 닿으면 맵에서 빠짐 (다른 맵으로 · 적은 쫓아오지 않음) ---------- */
function exitStep(W, u, o, dt){
  const m = W.map, H = m.H, band = (W.rules.camp || {}).band || 0.9, dn = o.dir === 'down', row = dn ? H - 1 : 0;
  if (dn ? u.y + u.r >= H - band : u.y - u.r <= band){ leaveMap(W, u, dn ? 'down' : 'up'); return; }
  if (o.tx == null){ const x0 = Math.floor(o.x != null ? o.x : u.x); let bx = null;   // 끝 줄의 가장 가까운 빈 칸
    for (let d = 0; d < m.W && bx == null; d++) for (const x of [x0 - d, x0 + d]) if (x >= 0 && x < m.W && m.t[row * m.W + x] === 0){ bx = x; break; }
    o.tx = (bx != null ? bx : x0) + 0.5; }
  setMood(W, u, dn ? '아래 맵으로' : '위 맵으로'); goTo(W, u, o.tx, row + 0.5, dt);
}
function leaveMap(W, u, dir){
  u.gone = dir; u.alive = false; u.order = null; u.ordPend = null; u.act = null; u.path = null; u.vx = 0; u.vy = 0; u.posUnk = false; u.leftT = W.t;
  L(W, { k: 'leave', a: u.i, dir, vis: true }); W.lightT = 0;
}
/* ---------- v7.20 소지품 (가방) · 내구도""")
s = rep(s, "if (typeof module !== 'undefined') module.exports = { ", "if (typeof module !== 'undefined') module.exports = { walkClear, exitStep, leaveMap, checkEnd, ")
s = rep(s, "const orderTxt = (o, u) => o && o.k === 'swap' ? ['swap', o.uid] :", "const orderTxt = (o, u) => o && o.k === 'exit' ? ['exit', o.dir] : o && o.k === 'swap' ? ['swap', o.uid] :")
s = rep(s, "function setGoal(W, u, x, y){", """// v7.21 걷는 길: 지름길 (곧장 감) 은 무더기 · 뿌리 벽도 막힘으로 봄 — 시야 (losClear) 는 무더기를 높이로 따로 보므로 걷기와 다름
function walkLine(m, x0, y0, x1, y1){ const dx = x1 - x0, dy = y1 - y0, n = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) * 2.5); for (let i = 1; i < n; i++){ const t = i / n; if (rock(m, x0 + dx * t, y0 + dy * t)) return false; } return true; }
function walkClear(m, x0, y0, x1, y1, r){ const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, ox = -dy / l * r, oy = dx / l * r; return walkLine(m, x0, y0, x1, y1) && walkLine(m, x0 + ox, y0 + oy, x1 + ox, y1 + oy) && walkLine(m, x0 - ox, y0 - oy, x1 - ox, y1 - oy); }
function setGoal(W, u, x, y){""")
s = rep(s, "  u.path = fatClear(W.map, u.x, u.y, x, y, u.r * 0.92) ? [{ x, y }] : findPath(W.map, u.x, u.y, x, y) || null;", "  u.path = walkClear(W.map, u.x, u.y, x, y, u.r * 0.92) ? [{ x, y }] : findPath(W.map, u.x, u.y, x, y) || null;   // v7.21 무더기는 돌아감")
s = rep(s, "u.skipT = W.t; if (fatClear(W.map, u.x, u.y, u.goal.x, u.goal.y, u.r * 0.92)) u.path = [u.goal]; }", "u.skipT = W.t; if (walkClear(W.map, u.x, u.y, u.goal.x, u.goal.y, u.r * 0.92)) u.path = [u.goal]; }")
s = rep(s, "  if (d > 0.06){ if (fatClear(W.map, u.x, u.y, sx, sy, u.r * 0.92)){ u.goal = { x: sx, y: sy };", "  if (d > 0.06){ if (walkClear(W.map, u.x, u.y, sx, sy, u.r * 0.92)){ u.goal = { x: sx, y: sy };")
wr('rt3_tail.js', s)
print('patch721 OK')
