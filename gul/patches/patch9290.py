# v9.10.1 엔진 — patch9290.py v1.1 (v1.1: 빼꼼 자리로 가는 동안 '각 잡기' 옮김이 끼어들지 않음 (적 사수가 빼꼼을 버리던 것) · 쏘는 자세 (당김 · 거둠) 중에도 빼꼼 자리로 걸어감 — 전엔 자세가 없는 틈에만 조금씩 움직여 적 사수가 빼꼼을 놓침 · v1.0: 움직임 점검 (유저 판 관계 그대로 재현 · audit_move.js) — ① 빼꼼 순간이동 바로잡기: 쏘는 그 틱에 어깨 너머 자리로 0.6칸을 단번에 옮기던 것 → 먼저 그 자리로 빠르게 걸어가 (초당 약 3칸) 다음 사격에 쏨 ② 전우이면서 같은 대장의 따를이 · 보호받을이인 몸은 대장 자리 규칙을 따름 (전우 곁 붙기와 대장 등 뒤 자리가 서로 끌어당겨 끝없이 오가던 것 — 청광묵 · 모닝스타 되돌기 35 · 42번) · 대장 등 뒤 자리는 지금 선 좌우 순서대로 나눔 (가로질러 서로 자리를 바꾸며 비비던 것 — 이웃해 선 전우는 이웃 자리) ③ 대장 등 뒤 자리 간격을 몸 폭대로 (고정 각도라 셋이면 자리가 겹쳐 서로 밀던 것) ④ 대장이 걷는 동안 그 앞길 (몸 폭 + 1.2칸) 에 선 따를이는 옆으로 비켜 서둘러 등 뒤로 돌아감 (대장 길을 막지 않음 · 비키는 쪽은 0.6초 유지 — 좌우로 흔들리지 않게) ⑤ 따를이 · 보호받을이는 대장을 밀지 않고 비킴 (대장이 제자리 명령인데 0.9칸 밀려나고 따를이가 그 자리를 끝없이 쫓던 것) · 등 뒤 자리 간격 0.12 · 자리에 닿으면 0.35칸 벗어나기 전엔 그대로 — 양쪽 편)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9280.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# ① 빼꼼: 걸어가서 쏨
rep("if (pk){ const bx = u.peekB ? u.peekB.x : u.x, by = u.peekB ? u.peekB.y : u.y; tryMove(W, u, pk.x, pk.y);",
    "if (pk){ const pd = Math.hypot(pk.x - u.x, pk.y - u.y); if (pd > 0.1 && !(u.peekTo && W.t > u.peekTo.t)){ if (!u.peekB) u.peekB = { x: u.x, y: u.y, t: W.t + 3 }; u.peekTo = { x: pk.x, y: pk.y, t: W.t + 1 }; u.fg = Math.atan2(t.y - u.y, t.x - u.x); if (u.peekLog == null || W.t - u.peekLog > 3){ u.peekLog = W.t; L(W, { k: 'peek', a: u.i, b: t.i, c: pk.by, vis: u.side === 0 || !!u.seenBy }); } return true; }   /* v9.10.1 먼저 그 자리로 걸어감 (순간이동 없음) — 다음 사격에 쏨 */\n      u.peekTo = null; const bx = u.peekB ? u.peekB.x : u.x, by = u.peekB ? u.peekB.y : u.y; tryMove(W, u, pk.x, pk.y);")
rep("function peekBack(W, u, dt){ const B = u.peekB; if (!B) return;", "function peekBack(W, u, dt){\n  if (u.peekTo){ const T = u.peekTo, dx = T.x - u.x, dy = T.y - u.y, dd = Math.hypot(dx, dy); if (W.t > T.t || u.kb || (u.path && u.path.length) || dd < 0.04) u.peekTo = null; else if (!(u.act && u.act.phase === 'rec' && W.t - (u.act.t1 || 0) > 0.2)){ const s = Math.min(dd, 3.2 * dt); tryMove(W, u, u.x + dx / dd * s, u.y + dy / dd * s); return; } }   /* v9.10.1 빼꼼 자리로 걸어감 */\n  const B = u.peekB; if (!B) return;")
# ② 대장이 있으면 전우 곁 붙기보다 대장 자리
rep("  if (LP){ const vx = LP.vx || 0", "  if (LP && !(chiefOfU(W, u) && !chiefOfU(W, u).down)){ const vx = LP.vx || 0")   # v9.10.1 대장이 있는 몸은 대장 자리 규칙 (전우는 그 안에서 이웃)
# ③ 대장 등 뒤 자리: 전우끼리 이웃 · 몸 폭대로
rep("  const FL = W.units.filter(m => m.alive && !m.down && !m.gone && m.chiefLk && m.sqLead === C.i).sort((a, b) => a.i - b.i), k = FL.indexOf(u), n = FL.length, sp = n > 1 ? (k - (n - 1) / 2) * 0.8 : 0;",
    "  const FL = W.units.filter(m => m.alive && !m.down && !m.gone && m.chiefLk && m.sqLead === C.i).sort((a, b) => { const sa = m => { const t = Math.atan2(m.y - C.y, m.x - C.x) - back; return Math.atan2(Math.sin(t), Math.cos(t)); }; return (sa(a) - sa(b)) || a.i - b.i; }), k = FL.indexOf(u), n = FL.length;   /* v9.10.1 지금 선 순서대로 (좌우를 가로지르지 않음 — 이웃이면 이웃 자리) */\n  const Rm = C.r + Math.max(...FL.map(m => m.r)) + 0.06, step0 = n > 1 ? Math.max(0.8, (2 * Math.max(...FL.map(m => m.r)) + 0.1) / Rm) : 0, sp = n > 1 ? (k - (n - 1) / 2) * step0 : 0;   /* v9.10.1 몸 폭대로 (겹쳐 서로 밀지 않게) */")
# ④ 대장 앞길 비키기
rep("  return go(sx, sy, running(W, C) || dist(u, C) > 2.2, dist(u, C) > 2.5 ? 'keep' : 'link', C, null);",
    """  { const hd = C.path && C.path[0] && Math.hypot(C.path[0].x - C.x, C.path[0].y - C.y) > 0.05 ? Math.atan2(C.path[0].y - C.y, C.path[0].x - C.x) : null;   /* v9.10.1 대장 앞길에 섰으면 옆으로 비켜 서둘러 등 뒤로 */
    if (hd != null && Math.hypot(C.vx || 0, C.vy || 0) > 0.3){ const hx = Math.cos(hd), hy = Math.sin(hd), ax = (u.x - C.x) * hx + (u.y - C.y) * hy, lat = (u.x - C.x) * -hy + (u.y - C.y) * hx;
      if (ax > -0.1 && ax < C.r + u.r + 1.2 && Math.abs(lat) < C.r + u.r + 0.05){ if (!u.sideSg || W.t > u.sideSg.t) u.sideSg = { s: lat >= 0 ? 1 : -1, t: W.t + 0.6 }; const sg = u.sideSg.s, off = C.r + u.r + 0.25; u.mv = { k: 'crun', run: true, until: W.t + 0.3 }; return go(C.x + hx * Math.max(0, ax) - hy * sg * off, C.y + hy * Math.max(0, ax) + hx * sg * off, true, 'link', C, null); } } }
  return go(sx, sy, running(W, C) || dist(u, C) > 2.2, dist(u, C) > 2.5 ? 'keep' : 'link', C, null);""")
# ⑤ 따를이는 대장을 밀지 않음 · 자리 간격 · 자리에서 멈춤 (흔들림 막이)
rep("    let pw = P.act ? 0 : Q.act ? 2 : 1, qw = Q.act ? 0 : P.act ? 2 : 1;", "    let pw = P.act ? 0 : Q.act ? 2 : 1, qw = Q.act ? 0 : P.act ? 2 : 1;\n    if (Q.chiefLk && Q.sqLead === P.i){ pw = 0; qw = 2; } else if (P.chiefLk && P.sqLead === Q.i){ pw = 2; qw = 0; }   /* v9.10.1 따를이 · 보호받을이는 대장을 밀지 않고 비킴 */")
rep("const R = C.r + u.r + (heal && u.cls === '치유' && isSupport(u) ? 0.3 : 0.06), sx", "const R = C.r + u.r + (heal && u.cls === '치유' && isSupport(u) ? 0.3 : 0.12), sx")
rep("  if (dd < 0.15){ stop(u); u.fg = th ? Math.atan2(th.y - u.y, th.x - u.x) : C.face || 0; u.pairHow = 'back'; return true; }", "  if (dd < 0.15 || (u.slotOk && dd < 0.35)){ u.slotOk = true; stop(u); u.fg = th ? Math.atan2(th.y - u.y, th.x - u.x) : C.face || 0; u.pairHow = 'back'; return true; }   /* v9.10.1 자리에 닿으면 0.35칸 벗어나기 전엔 그대로 (흔들림 막이) */\n  u.slotOk = false;")
rep("if (u.act && W.t >= u.act.end) resolveAct(W, u); return; }   // v7.0 이동 사격", "if (u.peekTo) peekBack(W, u, dt);   /* v9.10.1 v1.1 쏘는 자세 중에도 빼꼼 자리로 걸어감 */ if (u.act && W.t >= u.act.end) resolveAct(W, u); return; }   // v7.0 이동 사격")
rep("function blockedShot(W, u, t, dt, ordered, b){\n", "function blockedShot(W, u, t, dt, ordered, b){\n  if (u.peekTo && W.t <= u.peekTo.t){ u.path = null; u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '빼꼼 자리로', t.i); return; }   /* v9.10.1 v1.1 빼꼼 자리로 가는 중엔 각 잡기로 옮기지 않음 */\n")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9290 OK')
