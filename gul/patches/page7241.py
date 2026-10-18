# v7.24.1 페이지 — page7241.py v1.0 (모닝스타 철퇴 그림: 줄 (처지는 곡선) + 가시 달린 큰 공 · 던질 때 머리 위로 돌림 · 들고 있을 땐 손 옆에 매달림 / 설명 · 수치표 이전 7.24.1 (도약 강타 · 세자르 걸음 · 모닝스타 사거리 — 옛 기본값 그대로인 칸만))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7240.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.24.0 (2026-10-18)', '<!-- 굴의 전투판 v7.24.1 (2026-10-18)')
rep('     v7.24.0: ', '''     v7.24.1: 모닝스타 철퇴 물리 — 기본 공격 = 철퇴를 휙 던졌다 당겨 옴 (최대 2.3M · 날아가는 공이 처음 닿는 적을 투사체처럼 맞힘 — 피할 수 있음 · 방패 정면은 막힘 · 동료는 비껴감 · 바위에 막힘 ·
         공이 돌아와야 다음 공격) · 붙어 있으면 (0.9M 안) 휘두르고 1.3M 안이면 가끔 휘두름. 그림 = 줄 (처지는 곡선) + 가시 달린 큰 공 (던질 땐 머리 위로 돌림).
         저장된 수치표 이전 7.24.1: 도약 강타 (피해 · 밀림) · 세자르 걸음 · 모닝스타 사거리 — 옛 기본값 그대로인 칸만 새 값으로.
     v7.24.0: ''')
rep('h1::after{content:" v7.24.0"', 'h1::after{content:" v7.24.1"')
rep('<footer>굴의 전투판 v7.24.0', '<footer>굴의 전투판 v7.24.1')
rep('return `굴의 전투판 v7.24.0 · ${title}', 'return `굴의 전투판 v7.24.1 · ${title}')
rep("copyText('굴의 전투판 v7.24.0 자동 판 기록", "copyText('굴의 전투판 v7.24.1 자동 판 기록")
rep('의 버전 기록에 — v7.24.0 세자르 스텝', '의 버전 기록에 — v7.24.1 모닝스타 철퇴 (던졌다 당겨 옴) / v7.24.0 세자르 스텝')
rep('">v7.24.0 · 세자르 스텝 · 찌부러짐</span>', '">v7.24.1 · 모닝스타 철퇴</span>')
rep("ver: '7.24.0', at:", "ver: '7.24.1', at:")
# 수치표 이전
rep("RULES_MIG = '7.21.0', RULES_GONE = [['camp'],", "RULES_MIG = '7.24.1', RULES_GONE = [['spec', 'quake', 'down'], ['camp'],")
# 모닝스타 설명
rep("tactic: '슈퍼스타 · 철퇴 (긴 근접) · 넉백', note: '\"슈퍼스타\". 철퇴를 신나게 휘두름 — 1.3칸까지 닿고 맞으면 밀림 (괴력).",
    "tactic: '슈퍼스타 · 철퇴를 던졌다 당겨 옴 (2.3M) · 넉백', note: '\"슈퍼스타\". 철퇴를 휙 던졌다 당겨 옴 — 최대 2.3M · 날아가는 공이 처음 닿는 적을 맞힘 (피할 수 있음 · 방패 정면은 막힘 · 동료는 비껴감) · 공이 돌아와야 다음. 붙으면 가끔 휘두름 · 맞으면 밀림 (괴력).")
# 그림: 줄 + 공
rep("  // 효과\n  if (!ed) for (const f of Wd.fx){", "  if (!ed) drawFlails(Wd, ox, oy, ts, see);   // v7.24.1 철퇴 (줄 + 공)\n  // 효과\n  if (!ed) for (const f of Wd.fx){")
rep("function drawCzWarn(Wd, ox, oy, ts){", """// v7.24.1 철퇴: 날아가는 공 (손에서 줄 — 멀수록 팽팽 · 가까울수록 처짐) · 던지려고 머리 위로 돌리는 공 · 들고 있는 공 (손 옆에 매달림)
function flailBall(x, y, rr, rot){
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.fillStyle = '#2b2f36'; for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(Math.cos(a - 0.22) * rr * 0.9, Math.sin(a - 0.22) * rr * 0.9); ctx.lineTo(Math.cos(a) * rr * 1.55, Math.sin(a) * rr * 1.55); ctx.lineTo(Math.cos(a + 0.22) * rr * 0.9, Math.sin(a + 0.22) * rr * 0.9); ctx.closePath(); ctx.fill(); }
  const g = ctx.createRadialGradient(-rr * 0.35, -rr * 0.35, rr * 0.15, 0, 0, rr); g.addColorStop(0, '#9aa3ad'); g.addColorStop(1, '#3a3f47'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rr, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
}
function flailChain(x0, y0, x1, y1, sag, ts){
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, l = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / l, ny = (x1 - x0) / l, cx = mx + nx * sag + 0, cy = my + ny * sag + Math.abs(sag) * 0.4;
  ctx.save(); ctx.strokeStyle = 'rgba(40,40,46,.9)'; ctx.lineWidth = Math.max(2, ts * 0.07); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,205,215,.75)'; ctx.lineWidth = Math.max(1, ts * 0.03); ctx.setLineDash([Math.max(2, ts * 0.06), Math.max(2, ts * 0.05)]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1); ctx.stroke(); ctx.restore();
}
function drawFlails(Wd, ox, oy, ts, see){
  const out = new Set();
  for (const F of Wd.flails || []){ const u = Wd.units[F.by]; if (!u) continue; out.add(u.i); if (!(u.side === 0 || see || u.seenBy || litAt(Wd, F.x, F.y))) continue;
    const hx = ox + u.x * ts, hy = oy + u.y * ts, bx = ox + F.x * ts, by = oy + F.y * ts, d = Math.hypot(F.x - u.x, F.y - u.y), slack = Math.max(0, 1 - d / Math.max(0.5, F.L)), side = (F.t0 * 7 % 2 < 1 ? 1 : -1);
    flailChain(hx, hy, bx, by, side * slack * ts * 0.45, ts); flailBall(bx, by, Math.max(4, ts * F.br * 1.1), (Wd.t - F.t0) * 9); }
  for (const u of Wd.units){ if (!u.alive || out.has(u.i) || !(u.side === 0 || see || u.seenBy) || !flailOf(Wd, u) || u.lie) continue;
    const A = u.act, hx = ox + u.x * ts, hy = oy + u.y * ts, rr = Math.max(3.5, ts * 0.2);
    if (A && A.k === 'atk' && A.fl && A.phase === 'wind'){ const a = (Wd.t - A.t0) * 13, R = (u.r + 0.45) * ts, bx = hx + Math.cos(a) * R, by = hy + Math.sin(a) * R * 0.55 - u.r * ts * 0.5;   // 머리 위로 돌림
      flailChain(hx, hy - u.r * ts * 0.3, bx, by, 0, ts); flailBall(bx, by, rr, a); continue; }
    const f = u.face || 0, bx = hx + Math.cos(f + 0.9) * (u.r + 0.22) * ts, by = hy + Math.sin(f + 0.9) * (u.r + 0.22) * ts + ts * 0.12;   // 손 옆에 매달림
    flailChain(hx + Math.cos(f + 0.6) * u.r * ts * 0.8, hy + Math.sin(f + 0.6) * u.r * ts * 0.8, bx, by, ts * 0.08, ts); flailBall(bx, by, rr * 0.85, f); }
}
function drawCzWarn(Wd, ox, oy, ts){""")
open(F, 'w', encoding='utf-8').write(s)
print('ok')
