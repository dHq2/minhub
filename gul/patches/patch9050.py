# v9.4.0 엔진 — patch9050.py v1.2 (v1.2: 끼우는 자리를 던지기 · 우회 앞으로 (창방패병은 창을 던지려 사선을 찾느라 대열에 안 섰음) · v1.1: 자리가 멀면 뜀걸음 (mv shift · run) · v1.0: 암계 전술 (명세 D6) — 방패병의 역장이 펼쳐져 있는 동안 같은 편 창 든 이는 선 바로 뒤에 나란히 서서 선 너머로 찌름 (선 방향 좌표 순으로 칸 · 선 길이 안에서 고르게))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9040.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("  if (!ordered && u.side === 1 && u.sq && flankStep(W, u, t, dt)) return;   // v5.2 우회 조",
    "  if (!ordered && wallLine(W, u, t, dt)) return;   /* v9.4.0 암계 전술 — 역장 뒤 창 대열 (던지기 · 우회보다 먼저) */\n  if (!ordered && u.side === 1 && u.sq && flankStep(W, u, t, dt)) return;   // v5.2 우회 조")
rep("// v9.2.0 암계 역장: 상대 편의 몸은 선을 못 넘음", """// v9.4.0 암계 전술 (명세 D6): 같은 편 역장이 펼쳐져 있는 동안 창 든 이 (근접) 는 선 바로 뒤 (아군 쪽 0.55 + 몸) 에 나란히 선다 — 칸은 선 방향 좌표 순 (서로 1.15칸 · 선 길이 안) · 선 너머로 찌름 (아군의 일격은 선을 지남)
function wallLine(W, u, t, dt){
  if (!W.sf8 || !W.sf8.length || !/창/.test(u.weapon || '') || isFar(u) || u.crawl || u.down || u.lie) return false;
  const F = W.sf8.find(f => f.k === 'wall' && f.hard && f.side === u.side && W.t < f.until - 0.3 && Math.hypot(f.x - u.x, f.y - u.y) < 11); if (!F) return false;
  const sg = (t.x - F.x) * F.nx + (t.y - F.y) * F.ny >= 0 ? 1 : -1;   // 적이 있는 쪽
  const al = a => (a.x - F.x) * F.ux + (a.y - F.y) * F.uy;
  const M = W.units.filter(a => a.alive && !a.gone && a.side === u.side && /창/.test(a.weapon || '') && !isFar(a) && !a.crawl && !a.down && Math.hypot(F.x - a.x, F.y - a.y) < 11 && Math.abs((a.x - F.x) * F.nx + (a.y - F.y) * F.ny) < 7).sort((a, b) => al(a) - al(b) || a.i - b.i);
  const k = M.indexOf(u); if (k < 0) return false; const n = M.length, sp = Math.min(1.15, (F.h * 2 - 0.8) / Math.max(1, n - 1)), a0 = (k - (n - 1) / 2) * sp;
  const off = 0.55 + u.r, sx = F.x + F.ux * Math.max(-F.h + 0.3, Math.min(F.h - 0.3, a0)) - F.nx * sg * off, sy = F.y + F.uy * Math.max(-F.h + 0.3, Math.min(F.h - 0.3, a0)) - F.ny * sg * off;
  if (boxRock(W, sx, sy, u.r * 0.9)) return false;
  if (Math.hypot(sx - u.x, sy - u.y) < 0.3){ u.goal = null; u.path = null; setMood(W, u, '대열', t.i); return true; }   // 자리에 섬 — 상대가 닿으면 보통 싸움이 이어서 처리
  if (gap(u, t) <= u.rng + 0.2) return false;   // 이미 닿는 상대가 있으면 대열보다 일격
  if (Math.hypot(sx - u.x, sy - u.y) > 1.2) u.mv = { k: 'shift', x: sx, y: sy, run: true, until: W.t + 0.5 };   // 3초 안에 서야 하니 뜀걸음
  setMood(W, u, '대열', t.i); goTo(W, u, sx, sy, dt); return true;
}
// v9.2.0 암계 역장: 상대 편의 몸은 선을 못 넘음""")
rep("module.exports = { giantChg,", "module.exports = { wallLine, giantChg,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9050 OK')
