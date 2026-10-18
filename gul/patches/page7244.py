# v7.24.4 페이지 — page7244.py v1.0 (모닝스타 철퇴 그림 · 명령: 들고 있는 공은 관성으로 흔들림 (손을 따라 늦게 · 출렁임) · 머리 위로 돌릴 때 스미어 (시계방향 꼬리) ·
#   철퇴 후리기 = 모으는 동안 범위 원 예고 (정한 거리) → 한 바퀴 (팽팽한 사슬 · 큰 스미어 · 지나간 궤적) → 막히면 그 자리에서 튕김 / 단추 → 휘두를 거리를 탭 (PC 는 마우스 따라 원 미리 보기) · 한 번 더 누르면 바로 (1.9M) /
#   설명 · 로그 (한 바퀴 거리 · 막혀 멈춤) · 수치표 이전 7.24.4 (후리기 · 철퇴 속력))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7243.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.24.3 (2026-10-18)', '<!-- 굴의 전투판 v7.24.4 (2026-10-18)')
rep('     v7.24.3: ', '''     v7.24.4: 모닝스타 철퇴 다시 — 공이 관성으로 움직임 (던지면 속도가 줄고 사슬 끝에서 되튕겨 끌려 돌아옴 · 들고 있을 땐 손을 따라 늦게 출렁임 · 머리 위로 돌릴 땐 스미어).
         철퇴 후리기: 머리 위로 시계방향 빙빙 (0.8초 · 범위 원 예고) → 사슬을 정한 거리 (1.2 ~ 2.6M) 만큼 풀어 한 바퀴를 아주 세게 (0.45초) — 지나는 순서대로 둘레의 모두 (동료도) · 못 막고 크게 밀림 (대형은 덜) ·
         방패 (65%) · 무구 (35%) 로 막는 데 성공하면 그 자리에서 튕기고 멈춤. 단추 → 휘두를 거리를 탭 (PC 는 마우스를 따라 원 미리 보기) · 한 번 더 누르면 바로.
     v7.24.3: ''')
rep('h1::after{content:" v7.24.3"', 'h1::after{content:" v7.24.4"')
rep('<footer>굴의 전투판 v7.24.3', '<footer>굴의 전투판 v7.24.4')
rep('return `굴의 전투판 v7.24.3 · ${title}', 'return `굴의 전투판 v7.24.4 · ${title}')
rep("copyText('굴의 전투판 v7.24.3 자동 판 기록", "copyText('굴의 전투판 v7.24.4 자동 판 기록")
rep('의 버전 기록에 — v7.24.3 PC 전열 · 전열 지원', '의 버전 기록에 — v7.24.4 모닝스타 철퇴 다시 (관성 · 철퇴 후리기) / v7.24.3 PC 전열 · 전열 지원')
rep('">v7.24.3 · PC 전열 · 전열 지원</span>', '">v7.24.4 · 모닝스타 철퇴 다시</span>')
rep("ver: '7.24.3', at:", "ver: '7.24.4', at:")
rep("RULES_MIG = '7.24.2', RULES_GONE = [['spec', 'quake', 'down'],", "RULES_MIG = '7.24.4', RULES_GONE = [['spec', 'sweep', 'stop'], ['spec', 'quake', 'down'],")
# 설명
rep("'철퇴 후리기': '모닝스타 — 뒤로 먼저 돌려 관성을 실어 둘레 1.9칸을 한 바퀴 (뒤부터): 닿는 모두 (동료도!) 피해 ×1.5 · 쓸려 나감. 관통 없음 — 중대형 이상이 막으면 50% 로 회전이 멈춤. 8초마다. 스스로: 둘레에 적 둘 넘고 동료가 없을 때 (셋 넘으면 동료 하나까지)',",
    "'철퇴 후리기': '모닝스타 — 머리 위로 시계방향 빙빙 (0.8초 · 범위 원 예고) → 사슬을 정한 거리 (1.2 ~ 2.6M) 만큼 풀어 한 바퀴를 아주 세게 (0.45초): 지나는 순서대로 안의 모두 (동료도!) 피해 ×1.6 · 못 막음 · 크게 쓸려 나감 (대형은 덜). 방패 (65%) · 무구 (35%) 로 막는 데 성공하면 그 자리에서 튕기고 멈춤 (뒤의 몸은 안 맞음) · 피할 수도 있음. 8초마다. 명령: 휘두를 거리를 탭 · 한 번 더 누르면 바로. 스스로: 둘레에 적 둘 넘고 동료가 없을 때 (셋 넘으면 동료 하나까지) — 그 적들을 덮는 거리로',")
# 명령: 거리를 탭
rep("    if (sp.k === 'sweep' || sp.k === 'ward'){ D.forEach(u => { u.order = { k: 'spec', s: sp.k }; });",
    "    if (sp.k === 'sweep' && armed && armed.k === 'spec' && armed.s === 'sweep'){ D.forEach(u => { u.order = { k: 'spec', s: 'sweep' }; }); armed = null; noteOrders(D); toast(`${D.map(u => u.name).join(' · ')}: 철퇴 후리기 — 바로 (${(rules.spec.sweep || {}).r || 1.9}M · 동료도 맞을 수 있어요)`); hud(); return; }   /* v7.24.4 한 번 더 = 바로 */\n    if (sp.k === 'ward'){ D.forEach(u => { u.order = { k: 'spec', s: sp.k }; });")
rep("SPEC_TGT = { flip:", "SPEC_TGT = { sweep: '🌀 철퇴 후리기: 휘두를 거리를 탭 (1.2 ~ 2.6M — 그 거리로 한 바퀴 · 동료도 맞음) · 단추를 한 번 더 = 바로', flip:")
rep("  if (k === 'spec'){ const A0 = armed, C = (A0.cas || []).map(i => Wd.units[i]).filter(x => x && x.alive), nm = (specOf(C[0] || {}, A0.s) || {}).name || '고유 기술';   // v7.19.1",
    """  if (k === 'spec'){ const A0 = armed, C = (A0.cas || []).map(i => Wd.units[i]).filter(x => x && x.alive), nm = (specOf(C[0] || {}, A0.s) || {}).name || '고유 기술';   // v7.19.1
    if (A0.s === 'sweep' && C.length){ const S3 = Wd.rules.spec.sweep || {}, R = Math.max(S3.rMin || 1.2, Math.min(S3.rMax || 2.6, Math.hypot(w.x - C[0].x, w.y - C[0].y))); C.forEach(x => { x.order = { k: 'spec', s: 'sweep', R: +R.toFixed(2) }; }); noteOrders(C); sweepAim = null; toast(`${C.map(x => x.name).join(' · ')}: 철퇴 후리기 — ${R.toFixed(1)}M 로 한 바퀴 (동료도 맞을 수 있어요)`); return done(); }   /* v7.24.4 휘두를 거리 */""")
rep("  if (!pd){ hoverTip(e); return; }", "  if (armed && armed.k === 'spec' && armed.s === 'sweep'){ sweepAim = toWorld(e.clientX, e.clientY); }   /* v7.24.4 철퇴 후리기 거리 미리 보기 */\n  if (!pd){ hoverTip(e); return; }")
rep("const SPEC_IC = {", "let sweepAim = null;   /* v7.24.4 */\nconst SPEC_IC = {")
# 로그 · 나레이션
rep("      case 'flailSweep': out.push(`${T(e)}🌀 ${n(e.a)} 철퇴 후리기 — ${e.n}명${e.stop != null ? ' · ' + n(e.stop) + '이(가) 막아 회전이 멈춤' : ''}`); break;",
    "      case 'flailSpin': out.push(`${T(e)}🌀 ${n(e.a)} 사슬을 ${e.R}M 풀어 한 바퀴`); break;   // v7.24.4\n      case 'flailSweep': out.push(`${T(e)}🌀 ${n(e.a)} 철퇴 후리기${e.R ? ' (' + e.R + 'M)' : ''} — ${e.n}명${e.stop != null ? ' · ' + n(e.stop) + '이(가) 막아 그 자리에서 튕기고 멈춤' : ''}`); break;")
rep("    case 'flailSweep': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 철퇴를 뒤로 돌려 한 바퀴 휘두른다${e.stop != null ? ' — ' + n(e.stop) + '이(가) 받아 내 멈춘다' : '!'}` };",
    "    case 'flailSweep': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 머리 위로 돌리던 철퇴를 풀어 크게 한 바퀴${e.stop != null ? ' — ' + n(e.stop) + '이(가) 받아 내 철퇴가 튕겨 멈춘다' : '! 둘레가 쓸려 나간다'}` };   // v7.24.4")
# 그림
i0 = s.index('// v7.24.1 철퇴: 날아가는 공'); i1 = s.index('function drawCzWarn(Wd, ox, oy, ts){')
s = s[:i0] + """// v7.24.1 철퇴 · v7.24.4 관성 · 스미어: 날아가는 공 (손에서 줄 — 멀수록 팽팽 · 가까울수록 처짐) · 머리 위로 돌리는 공 (시계방향 꼬리) · 들고 있는 공 (손을 따라 늦게 출렁임) · 철퇴 후리기 (예고 원 · 한 바퀴 · 튕김)
function flailBall(x, y, rr, rot){
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.fillStyle = '#2b2f36'; for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(Math.cos(a - 0.22) * rr * 0.9, Math.sin(a - 0.22) * rr * 0.9); ctx.lineTo(Math.cos(a) * rr * 1.55, Math.sin(a) * rr * 1.55); ctx.lineTo(Math.cos(a + 0.22) * rr * 0.9, Math.sin(a + 0.22) * rr * 0.9); ctx.closePath(); ctx.fill(); }
  const g = ctx.createRadialGradient(-rr * 0.35, -rr * 0.35, rr * 0.15, 0, 0, rr); g.addColorStop(0, '#9aa3ad'); g.addColorStop(1, '#3a3f47'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rr, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
}
function flailChain(x0, y0, x1, y1, sag, ts){
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, l = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / l, ny = (x1 - x0) / l, cx = mx + nx * sag, cy = my + ny * sag + Math.abs(sag) * 0.4;
  ctx.save(); ctx.strokeStyle = 'rgba(40,40,46,.9)'; ctx.lineWidth = Math.max(2, ts * 0.07); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1); ctx.stroke();
  ctx.strokeStyle = 'rgba(200,205,215,.75)'; ctx.lineWidth = Math.max(1, ts * 0.03); ctx.setLineDash([Math.max(2, ts * 0.06), Math.max(2, ts * 0.05)]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1); ctx.stroke(); ctx.restore();
}
// 스미어: 중심 (cx, cy) 둘레 반지름 R 의 a 까지 len 라디안 꼬리 (시계방향으로 돌아온 길) — 끝으로 갈수록 옅고 가늘게
function flailSmear(cx, cy, R, a, len, w, col){
  ctx.save(); ctx.lineCap = 'round'; const N = 14; for (let k = 0; k < N; k++){ const a0 = a - len * (k + 1) / N, a1 = a - len * k / N, al = (1 - k / N) * 0.55; ctx.strokeStyle = `rgba(${col},${al.toFixed(3)})`; ctx.lineWidth = Math.max(1.5, w * (1 - k / N * 0.6)); ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1); ctx.stroke(); } ctx.restore();
}
const flailHang = new Map(); let flailHangT = 0;   // 들고 있는 공의 관성 (그림만): 손 옆 매달린 자리로 용수철 · 잦아듦
function drawFlails(Wd, ox, oy, ts, see){
  const out = new Set(), nowP = performance.now(), dtv = Math.min(0.05, Math.max(0, (nowP - flailHangT) / 1000)); flailHangT = nowP;
  for (const F of Wd.flails || []){ const u = Wd.units[F.by]; if (!u) continue; out.add(u.i); if (!(u.side === 0 || see || u.seenBy || litAt(Wd, F.x, F.y))) continue;
    const hx = ox + u.x * ts, hy = oy + u.y * ts, bx = ox + F.x * ts, by = oy + F.y * ts, d = Math.hypot(F.x - u.x, F.y - u.y), slack = Math.max(0, 1 - d / Math.max(0.5, F.L)), side = (F.t0 * 7 % 2 < 1 ? 1 : -1), sp = Math.hypot(F.vx || 0, F.vy || 0);
    if (sp > 6){ ctx.save(); ctx.strokeStyle = 'rgba(200,210,225,.28)'; ctx.lineWidth = Math.max(3, ts * F.br * 1.8); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - (F.vx || 0) / sp * Math.min(0.9, sp * 0.05) * ts, by - (F.vy || 0) / sp * Math.min(0.9, sp * 0.05) * ts); ctx.stroke(); ctx.restore(); }   // 빠를 때 꼬리
    flailChain(hx, hy, bx, by, side * slack * ts * 0.45, ts); flailBall(bx, by, Math.max(4, ts * F.br * 1.1), (Wd.t - F.t0) * 9); flailHang.delete(u.i); }
  for (const u of Wd.units){ if (!u.alive || out.has(u.i) || !(u.side === 0 || see || u.seenBy) || !flailOf(Wd, u) || u.lie) continue;
    const A = u.act, hx = ox + u.x * ts, hy = oy + u.y * ts, rr = Math.max(3.5, ts * 0.2), SW = (Wd.rules.spec || {}).sweep || {};
    if (A && A.k === 'spec' && A.s === 'sweep' && (A.phase === 'swing' || (A.phase === 'rec' && A.R))){   // 철퇴 후리기: 팽팽한 사슬 · 큰 스미어 · 지나간 궤적 · 막혔으면 그 자리에서 튕김
      const R = (A.R || SW.r || 1.9) * ts, a = A.ang != null ? A.ang : 0, done = A.phase === 'rec', shake = done && A.stop != null && Wd.t - A.t0 < 9 ? Math.sin(Wd.t * 60) * 0.06 : 0, bx = hx + Math.cos(a + shake) * R, by = hy + Math.sin(a + shake) * R;
      ctx.save(); ctx.strokeStyle = 'rgba(255,190,120,.22)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.arc(hx, hy, R, 0, 6.283); ctx.stroke(); ctx.restore();
      if (!done) flailSmear(hx, hy, R, a, Math.min(2.6, (a - A.ang0) || 0.01), Math.max(5, ts * 0.42), '255,214,150');
      flailChain(hx, hy, bx, by, 0, ts); flailBall(bx, by, rr * 1.15, a * 3); flailHang.delete(u.i); continue; }
    const spin = A && ((A.k === 'atk' && A.fl && A.phase === 'wind') || (A.k === 'spec' && (A.s === 'sweep' || A.s === 'hurl') && A.phase === 'wind'));
    if (spin){ const a = (A.a0 != null ? A.a0 : (u.face || 0) + Math.PI) + (Wd.t - A.t0) * (SW.ws || 13), Rr = (u.r + 0.45) * ts, cy0 = hy - u.r * ts * 0.45, bx = hx + Math.cos(a) * Rr, by = cy0 + Math.sin(a) * Rr * 0.55;   // 머리 위로 시계방향 · 스미어
      if (A.k === 'spec' && A.s === 'sweep'){ const R2 = (A.R || SW.r || 1.9) * ts, k = Math.min(1, (Wd.t - A.t0) / Math.max(0.1, A.end - A.t0)); ctx.save(); ctx.strokeStyle = `rgba(255,170,90,${(0.35 + 0.45 * k).toFixed(2)})`; ctx.lineWidth = 2 + 2 * k; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.arc(hx, hy, R2, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = `rgba(255,150,70,${(0.06 + 0.1 * k).toFixed(3)})`; ctx.beginPath(); ctx.arc(hx, hy, R2, 0, 6.283); ctx.fill();
        ctx.font = '700 11px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd29a'; ctx.fillText(`🌀 ${(R2 / ts).toFixed(1)}M`, hx, hy - R2 - 6); ctx.restore(); }   // 범위 원 예고
      ctx.save(); ctx.translate(hx, cy0); ctx.scale(1, 0.55); flailSmear(0, 0, Rr, a, 3.2, Math.max(4, ts * 0.3), '210,220,235'); ctx.restore();
      flailChain(hx, hy - u.r * ts * 0.3, bx, by, 0, ts); flailBall(bx, by, rr, a); flailHang.delete(u.i); continue; }
    const f = u.face || 0, tx = u.x + Math.cos(f + 0.9) * (u.r + 0.22), ty = u.y + Math.sin(f + 0.9) * (u.r + 0.22) + 0.12; let H = flailHang.get(u.i);   // 손 옆에 매달림 — 관성으로 늦게 따라와 출렁임
    if (!H || Math.hypot(H.x - tx, H.y - ty) > 3){ H = { x: tx, y: ty, vx: 0, vy: 0 }; flailHang.set(u.i, H); }
    if (dtv > 0){ H.vx += ((tx - H.x) * 55 - H.vx * 6) * dtv; H.vy += ((ty - H.y) * 55 - H.vy * 6) * dtv; H.x += H.vx * dtv; H.y += H.vy * dtv; const dl = Math.hypot(H.x - u.x, H.y - u.y), mx = u.r + 0.5; if (dl > mx){ H.x = u.x + (H.x - u.x) / dl * mx; H.y = u.y + (H.y - u.y) / dl * mx; } }
    const bx = ox + H.x * ts, by = oy + H.y * ts;
    flailChain(hx + Math.cos(f + 0.6) * u.r * ts * 0.8, hy + Math.sin(f + 0.6) * u.r * ts * 0.8, bx, by, ts * 0.08, ts); flailBall(bx, by, rr * 0.85, f + H.vx * 0.3); }
  if (armed && armed.k === 'spec' && armed.s === 'sweep' && sweepAim){ const SW = (Wd.rules.spec || {}).sweep || {};   // PC: 마우스를 따라 휘두를 거리 미리 보기
    for (const i of armed.cas || []){ const u = Wd.units[i]; if (!u || !u.alive) continue; const R = Math.max(SW.rMin || 1.2, Math.min(SW.rMax || 2.6, Math.hypot(sweepAim.x - u.x, sweepAim.y - u.y))), hx = ox + u.x * ts, hy = oy + u.y * ts;
      ctx.save(); ctx.strokeStyle = 'rgba(255,190,110,.85)'; ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.arc(hx, hy, R * ts, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); ctx.font = '700 11px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd29a'; ctx.fillText(`🌀 ${R.toFixed(1)}M`, hx, hy - R * ts - 6); ctx.restore(); } }
}
""" + s[i1:]
open(F, 'w', encoding='utf-8').write(s)
print('ok')
