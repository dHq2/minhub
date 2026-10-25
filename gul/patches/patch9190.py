# v9.9.0 엔진 — patch9190.py v1.0 (v1.0: ① 막기 자동 — 막기 방식 (자동 · 유지 · 공격 위주) 을 없애고, 그 편이 적을 알고 맵이 정리되기 전 (경계 · 전투) 엔 방패 · 무구를 늘 들고 있음 · 평소엔 위협에만 · 플레이어는 '막기 풀기' 로만 끔 (u.guardOff) — 양쪽 편 ② 인주도 공통 — 부하가 될 수 있고 대장이 될 수 있음 ③ 넓게 휘두르기 준비 중 동료가 부채꼴에 들어오면 (휘두르기 명령이 아니면) 찍기로 바꿈 ④ 대기 몸짓 — 멈춰 있으면 3 ~ 6초마다 고개를 돌리거나 제자리에서 0.3칸 안쪽으로 조금 움직임 (모두) ⑤ 돌격은 한 가지 — 방패 · 맨손 · 거구는 몸으로 들이받음 (밀침) · 그 밖은 무기가 먼저 닿으면 무기 판정 (날붙이 · 둔기 · 찌르기) 으로 치고 넉백 (돌격 방식 고르기 없앰))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9180.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ① 막기 자동 (경계 · 전투 중 늘 듦)
rep("    if (u.guardMode === 'hold' || (lretOn(W, u) && u.guardMode !== 'off')) want = true;",
    "    if (u.guardMode === 'hold' || (lretOn(W, u) && u.guardMode !== 'off') || (u.guardMode !== 'off' && !isFar(u) && alertOn(W, u.side))) want = true;   /* v9.9.0 경계 · 전투 중엔 늘 듦 (기습 대비) */")
rep("const isFar = u => u.rng > 1 && !u.longReach;", """const isFar = u => u.rng > 1 && !u.longReach;
// v9.9.0 경계: 그 편이 적을 알고 (아군: 보이는 적 · 적 편: 쫓는 · 싸우는 · 찾는 몸) 15초 안 · 맵이 정리되기 전
function alertOn(W, side){ const A = W.alertT || (W.alertT = {});
  if (W._alT !== W.t){ W._alT = W.t; for (const u of W.units){ if (!u.alive || u.gone) continue; if (u.side !== 0 && u.seenBy) A[0] = W.t; if (u.side !== 0 && ['hunt', 'fight', 'search'].includes(u.state)) A[u.side] = W.t; if (u.side === 0 && ['hunt', 'fight'].includes(u.state)) A[0] = W.t; } }
  return !(side === 0 && W.cleared) && W.t - (A[side] == null ? -99 : A[side]) < 15; }""")
rep("  const forced = (a && !shieldAct) || hurry || u.guardMode === 'off' || u.crawl || u.kb;", "  const forced = (a && !shieldAct) || hurry || u.guardMode === 'off' || u.guardOff || u.crawl || u.kb;")
rep("  const G = W.rules.guard || {}, a = u.act, shieldAct =", "  if (u.guardMode === 'hold') u.guardMode = 'auto'; if (u.guardOff) u.guardMode = 'off'; else if (u.guardMode === 'off') u.guardMode = 'auto';   /* v9.9.0 막기 방식 없앰 — 풀기만 */\n  const G = W.rules.guard || {}, a = u.act, shieldAct =")

# ② 인주도 공통
rep("const F = followers.filter(u => u && u.alive && u.side === 0 && !u.hero && !u.summon && u !== chief); if (!F.length) return { ok: false, why: '부하로 삼을 아군을 먼저 고르세요 (인주는 부하가 될 수 없어요)' };\n  if (chief.hero){ F.forEach(u => { u.sqLead = null; u.chiefLk = false; u.sqFix = false; }); L(W, { k: 'chiefOff', ids: F.map(u => u.i), b: chief.i, vis: true }); return { ok: true, on: false }; }",
    "const F = followers.filter(u => u && u.alive && u.side === 0 && !u.summon && u !== chief); if (!F.length) return { ok: false, why: '부하로 삼을 아군을 먼저 고르세요' };   /* v9.9.0 인주도 공통 (부하 · 대장 모두) */")

# ③ 넓게 휘두르기 준비 중 동료가 들어오면 찍기로 (명령이 아니면)
rep("  if (u.act){ if (u.act.k === 'skill' && u.act.phase === 'tend'){ tendStep(W, u); if (!u.act) return; }   // v7.3 돌봄",
    "  if (u.act && u.act.k === 'atk' && u.act.mode === 'sweep' && u.act.phase === 'wind' && u.swing !== '휘두르기' && u.act.b != null && W.units[u.act.b]){ const t0 = W.units[u.act.b]; if (swingArc(W, u, Math.atan2(t0.y - u.y, t0.x - u.x)).M.length){ u.act.mode = 'smash'; L(W, { k: 'sweepCancel', a: u.i, vis: u.side === 0 || !!u.seenBy }); } }   /* v9.9.0 동료가 맞을 것 같으면 찍기로 */\n  if (u.act){ if (u.act.k === 'skill' && u.act.phase === 'tend'){ tendStep(W, u); if (!u.act) return; }   // v7.3 돌봄")

# ④ 대기 몸짓
rep("  const x0 = u.x, y0 = u.y;\n  act2(W, u, dt);", "  const x0 = u.x, y0 = u.y;\n  act2(W, u, dt); idleFid(W, u, dt, x0, y0);   /* v9.9.0 대기 몸짓 */")
rep("function act2(W, u, dt){", """// v9.9.0 대기 몸짓 (모두): 멈춰 있으면 3 ~ 6초마다 고개를 돌리거나, 처음 선 자리에서 0.3칸 안쪽으로 조금 옮겨 섬
function idleFid(W, u, dt, x0, y0){
  const still = u.alive && !u.down && !u.act && !u.kb && !u.lie && !u.crawl && (!u.path || !u.path.length) && u.x === x0 && u.y === y0 && !(u.order && ['clump', 'move', 'amove', 'attack'].includes(u.order.k)) && W.t >= (u.proneT || -9);
  if (!still){ u.fid = null; u.fidA = null; return; }
  if (!u.fidA){ u.fidA = { x: u.x, y: u.y }; u.fidT = W.t + 2 + W.rand() * 3; }
  if (u.fid && W.t < u.fid.until){ const dx = u.fid.x - u.x, dy = u.fid.y - u.y, d = Math.hypot(dx, dy); if (d > 0.02){ const s = Math.min(d, 0.5 * dt); tryMove(W, u, u.x + dx / d * s, u.y + dy / d * s); u.fidA.x2 = u.x; } return; }
  if (W.t < u.fidT) return; u.fidT = W.t + 3 + W.rand() * 3;
  if (W.rand() < 0.6){ u.fg = (u.face || 0) + (W.rand() - 0.5) * 1.4; return; }
  const a = W.rand() * 6.283, r = W.rand() * 0.3, x = u.fidA.x + Math.cos(a) * r, y = u.fidA.y + Math.sin(a) * r; if (!boxRock(W, x, y, u.r * 0.9)) u.fid = { x, y, until: W.t + 1 };
}
function act2(W, u, dt){""")

# ⑤ 돌격은 한 가지
rep("...(u.chgMode ? { mode: u.chgMode } : {}) };   /* v9.7.3 돌격 방식 */", "...(!u.shield && !u.armShield && !unarmed(u) && !u.modBody && !u.giant && !u.rush && u.rng >= 0.4 ? { mode: 'atk' } : {}) };   /* v9.9.0 돌격은 한 가지 — 무기가 먼저 닿으면 무기로 · 방패 · 맨손 · 거구는 몸으로 */")
rep("    else if (tg.alive) stun(W, tg, 0.35 * k, u.i);\n    if (tg.alive) interrupt(W, tg, '찔려 준비가 끊김');",
    "    else if (tg.alive) stun(W, tg, 0.35 * k, u.i);\n    if (tg.alive && !blocked){ const ddx = tg.x - u.x, ddy = tg.y - u.y, dl = Math.hypot(ddx, ddy) || 1, kv = Math.min(2.2, A.sp * 0.42 * u.mass / Math.max(30, tg.mass)) * (C.kb != null ? C.kb : 0.3) * 2.2; if (kv > 0.15) fling(W, u, tg, kv, ddx / dl, ddy / dl, { how: 'charge', v: +(kv / 0.66).toFixed(1), brace: [] }); }   /* v9.9.0 무기로 쳐도 넉백 */\n    if (tg.alive) interrupt(W, tg, '찔려 준비가 끊김');")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9190 OK')
