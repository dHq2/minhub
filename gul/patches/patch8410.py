# v8.4.1 엔진 — patch8410.py v1.0 (patch8400.py 를 먼저 돌린 뒤: 우회는 부드러운 곡선 — 옆으로 벗어나는 폭을 최대 6칸으로 (예전엔 8 × 1.8 = 14칸까지) · 출발점 → 경유점 → 목적지를 잇는 포물선 (2차 베지어) 위의 점들을 차례로 밟음 · 꺾이는 모서리 없음)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8400.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)

H = rep(H, "detour: { min: 3, k: 0.45, max: 8, near: 3 }", "detour: { min: 2.5, k: 0.35, max: 6, near: 3, curve: [0.2, 0.35, 0.5, 0.65, 0.8] }")
T = rep(T, "for (const k of [0.5, 0.35, 0.65]) for (const m of [1, 1.4, 0.7, 1.8]){\n      const Dd = Math.min(DT.max || 8, Math.max(DT.min || 3, Ld * (DT.k || 0.45))) * m,",
        "for (const k of [0.5, 0.4, 0.6]) for (const m of [1, 1.2, 0.8, 0.6]){\n      const Dd = Math.min(DT.max || 6, Math.min(DT.max || 6, Math.max(DT.min || 2.5, Ld * (DT.k || 0.35))) * m),   /* v8.4.1 옆으로 최대 6칸 */")
T = rep(T, "  if (o.via.t0 == null) o.via.t0 = W.t;\n  const done = d < 0.7 ? '닿음'",
        "  if (o.via.t0 == null){ o.via.t0 = W.t; o.via.pts = viaCurve(W, u, o, t); o.via.k = 0; }   /* v8.4.1 포물선 위의 점들 */\n"
        "  const P = o.via.pts && o.via.pts.length ? o.via.pts : [o.via]; while (o.via.k < P.length - 1 && Math.hypot(u.x - P[o.via.k].x, u.y - P[o.via.k].y) < 1.0) o.via.k++;\n"
        "  const q = P[Math.min(o.via.k || 0, P.length - 1)], dq = Math.hypot(u.x - q.x, u.y - q.y), last = (o.via.k || 0) >= P.length - 1;\n"
        "  const done = last && dq < 0.7 ? '닿음'")
T = rep(T, "  setMood(W, u, '우회'); setGoal(W, u, o.via.x, o.via.y); follow(W, u, dt);", "  setMood(W, u, '우회'); setGoal(W, u, q.x, q.y); follow(W, u, dt);")
T = rep(T, "function detourVia(W, L, tx, ty){",
        "// v8.4.1 우회 곡선: 출발점 P0 · 경유점 V · 목적지 P2 — V 를 지나는 2차 베지어 (조절점 C = 2V − (P0 + P2) / 2) 위의 점 (바위 · 벽 칸은 건너뜀). 마지막 점을 밟으면 본래 명령대로 목적지로\n"
        "function viaCurve(W, u, o, t){\n"
        "  const V = o.via, P2 = t ? { x: t.x, y: t.y } : o.x != null ? { x: o.x, y: o.y } : null; if (!P2) return [V];\n"
        "  const cx = 2 * V.x - (u.x + P2.x) / 2, cy = 2 * V.y - (u.y + P2.y) / 2, S = (W.rules.detour || {}).curve || [0.2, 0.35, 0.5, 0.65, 0.8], out = [];\n"
        "  for (const s of S){ const a = (1 - s) * (1 - s), b = 2 * (1 - s) * s, c = s * s, x = a * u.x + b * cx + c * P2.x, y = a * u.y + b * cy + c * P2.y;\n"
        "    if (s === 0.5){ out.push({ x: V.x, y: V.y }); continue; } if (x < 1 || y < 1 || x > W.map.W - 1 || y > W.map.H - 1 || boxRock(W, x, y, 0.4)) continue; out.push({ x: +x.toFixed(2), y: +y.toFixed(2) }); }\n"
        "  return out.length ? out : [V];\n"
        "}\n"
        "function detourVia(W, L, tx, ty){")
for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8410 OK')
