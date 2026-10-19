# v8.4.1 페이지 — page8410.py v1.1 (v1.1: 시작 자리 무작위는 반올림한 자리로 검사 (14.996 → 15.00 이 벽 칸에 놓이던 것) · 몸 둘레도 벽에 닿지 않게 · v1.0: 조작 다듬기: page8400.py 를 먼저 돌린 뒤 — 겹친 자리 첫 클릭은 인물만 (아군 고르기 · 적 공격), 같은 인물을 다시 누르면 고르는 창 · 우회 미리보기는 곡선 · 전투를 시작하면 우리 편 자리가 살짝 무작위 (1칸 안 · 바닥 · 겹치지 않게 — 그 흩어짐은 옮길 수 없음) · 판 번호 8.4.1)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8400.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v8.4.0 (2026-10-19)', '<!-- 굴의 전투판 v8.4.1 (2026-10-19)')
rep('     v8.4.0: ', '''     v8.4.1: 조작 다듬기 — 인물과 물건이 겹친 자리: 첫 클릭은 인물만 (아군 고르기 · 적 공격), 같은 인물을 한 번 더 누르면 고르는 창 (흐름이 끊기지 않게).
         우회는 부드러운 곡선 (옆으로 최대 6칸 · 출발점 → 경유점 → 목적지 포물선) · 미리보기 선도 곡선. 전투를 시작하면 우리 편 자리가 1칸 안에서 살짝 무작위 (뭉쳐 있지만 변수 — 옮길 수 없음).
     v8.4.0: ''')
for a, b in (('h1::after{content:" v8.4.0"', 'h1::after{content:" v8.4.1"'), ('<footer>굴의 전투판 v8.4.0', '<footer>굴의 전투판 v8.4.1'), ('return `굴의 전투판 v8.4.0 · ${title}', 'return `굴의 전투판 v8.4.1 · ${title}'),
             ("copyText('굴의 전투판 v8.4.0 자동 판 기록", "copyText('굴의 전투판 v8.4.1 자동 판 기록"), ("ver: '8.4.0', kind: '1F 여정 기록'", "ver: '8.4.1', kind: '1F 여정 기록'"),
             ("o.push('굴의 전투판 v8.4.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.4.1 — 1F 프롤로그 여정 기록'"),
             ('의 버전 기록에 — v8.4.0 세르파 슬라임 조직', '의 버전 기록에 — v8.4.1 조작 다듬기 (겹친 자리 · 우회 곡선 · 시작 자리) / v8.4.0 세르파 슬라임 조직'),
             ('">v8.4.0 · 세르파 슬라임 조직</span>', '">v8.4.1 · 조작 다듬기</span>'),
             ("RULES_MIG = '8.4.0'", "RULES_MIG = '8.4.1'")):
    rep(a, b)

# 겹친 자리: 첫 클릭은 인물만
rep("    if (its.length){ askOverlap(u, its.sort(", "    if (its.length && ovSecond(u)){ askOverlap(u, its.sort(")
rep("function askOverlap(u, its, add){", """let ovLast = null;   // v8.4.1 겹친 자리: 아군은 이미 고른 이를 또 누를 때 · 적은 3초 안에 같은 적을 또 누를 때만 고르는 창
function ovSecond(u){ const now = performance.now(), L = ovLast; ovLast = { i: u.i, t: now }; return u.side === 0 ? sel.has(u.i) : !!(L && L.i === u.i && now - L.t < 3000); }
function askOverlap(u, its, add){""")
# 우회 미리보기 곡선
rep("ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); if (u.order.via && !u.order.viaOK) ctx.lineTo(ox + u.order.via.x * ts, oy + u.order.via.y * ts); ctx.lineTo(p.x, p.y); ctx.stroke();   // v7.12 우회 경유점",
    "ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); if (u.order.via && !u.order.viaOK) viaPath(u.order, u, ox, oy, ts, p); ctx.lineTo(p.x, p.y); ctx.stroke();   // v7.12 우회 경유점 · v8.4.1 곡선")
rep("function askOverlap(u, its, add){", """function viaPath(o, u, ox, oy, ts, p){   // v8.4.1 우회 곡선: 걷는 중이면 남은 점들을 · 아직이면 경유점을 지나는 포물선
  const V = o.via; if (V.pts && V.pts.length){ for (let k = V.k || 0; k < V.pts.length; k++) ctx.lineTo(ox + V.pts[k].x * ts, oy + V.pts[k].y * ts); return; }
  const tx = (p.x - ox) / ts, ty = (p.y - oy) / ts, cx = 2 * V.x - (u.x + tx) / 2, cy = 2 * V.y - (u.y + ty) / 2; ctx.quadraticCurveTo(ox + cx * ts, oy + cy * ts, p.x, p.y);
}
function askOverlap(u, its, add){""")
# 시작 자리 살짝 무작위
rep("  world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0); if (S.camp && !S.camp.end){ world.camp = true; world.over = false; world.result = null; checkEnd(world); }",
    "  world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0); if (S.camp && !S.camp.end){ world.camp = true; world.over = false; world.result = null; checkEnd(world); }\n  startJit(world);   /* v8.4.1 시작 자리 살짝 무작위 */")
rep("function start(){", """const START_JIT = 1.0;   // v8.4.1 전투를 시작하면 우리 편 자리가 이 칸 안에서 살짝 무작위 (바닥 · 겹치지 않게 · 갈 수 있는 곳) — 뭉쳐 있지만 변수. 옮길 수 없음
function startJit(W){
  if (!W || W.duel || window.__noJit) return; const m = W.map, free = (x, y) => { const cx = Math.floor(x), cy = Math.floor(y); return cx >= 0 && cy >= 0 && cx < m.W && cy < m.H && m.t[cy * m.W + cx] === 0; };
  const IN = typeof run8On === 'function' && run8On() && S.art8 && typeof MAPS8 !== 'undefined' && MAPS8[S.art8] ? MAPS8[S.art8].in : null;   // 여정: 들어선 곳 안에서만
  for (const u of W.units){ if (u.side !== 0 || !u.alive || u.gone) continue;
    for (let k = 0; k < 10; k++){ const a = Math.random() * 6.283, r = START_JIT * Math.sqrt(Math.random()), x = +(u.x + Math.cos(a) * r).toFixed(2), y = +(u.y + Math.sin(a) * r).toFixed(2);   // 반올림한 뒤에 검사 (칸 경계를 넘지 않게)
      if (IN && !(x >= IN[0] && x <= IN[2] + 1 && y >= IN[1] && y <= IN[3] + 1)) continue;
      if (!free(x, y) || rock(W.map, x, y) || boxRock(W, x, y, u.r * 0.9) || W.units.some(o => o !== u && o.alive && !o.gone && Math.hypot(o.x - x, o.y - y) < o.r + u.r + 0.05)) continue;
      u.x = u.px = x; u.y = u.py = y; break; } }
  if (W.fxOn) W.fx = [];
}
function start(){""")
rep("으로 크게 돌아감 (${coord(v.x, v.y)} 거쳐)", "으로 부드럽게 돌아감 (${coord(v.x, v.y)} 거쳐 · 곡선)")
open(F, 'w', encoding='utf-8').write(s)
print('page8410 OK')
