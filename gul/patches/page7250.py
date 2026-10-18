# v7.25.0 페이지 — page7250.py v1.2 (v1.2: 관을 연 뒤 10초 또는 관의 시야를 벗어나면 (먼저 오는 쪽) · v1.1: 홀에 옅은 그늘을 깔고 빛줄기를 더함 (잘 보이게) · 둥근 벽을 매끈하게 · 세자르의 알현실: 처음부터 아주 밝음 · 흰 대리석 · 금빛 원 · 붉은 융단 · 대리석 기둥 · 관 · 높은 창에서 쏟아지는 빛줄기 · 관을 비추는 빛 · 떠도는 먼지 /
#   관을 조사하면 10초 뒤 세자르가 일어남 (6초에 긁는 소리) / 겨눈 기술 (영거리 사격 · 투창 · 돌진 · 암살 …) 중 엉뚱한 곳을 누르면 겨눔을 풀고 누른 대로 (이동 · 고르기) /
#   성장: 괴력 대신 근력 (괴력은 타고나거나 특별한 계기로만 — 예전에 싸워서 얻은 괴력은 근력으로 옮김) / 로그: 철퇴 놓침 · 감아 들임 · 보스가 치명상을 버팀 · 영거리 사격을 비켜 섬)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7245.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# 버전
rep('<!-- 굴의 전투판 v7.24.5 (2026-10-18)', '<!-- 굴의 전투판 v7.25.0 (2026-10-18)')
rep('     v7.24.5: ', '''     v7.25.0: 고침 묶음 — 세자르의 알현실은 처음부터 아주 밝고 장엄함 (흰 대리석 · 금빛 원 · 붉은 융단 · 대리석 기둥 · 높은 창의 빛줄기 · 관을 비추는 빛 · 떠도는 먼지). 관을 조사하면 10초 뒤 세자르가 일어남.
         모닝스타: 철퇴를 돌리다 넘어지면 (모으다 휘청이면) 기술 끝 — 공은 바닥에 떨어지고 일어나면 걸으며 감아 들임 · 던진 뒤 얼음이 되지 않음 (짧은 후속 동작 뒤 움직임). 세자르: 총알 · 화살을 거의 피함 (총구를 읽음) · 영거리 사격도 비킴 ·
         [보스] 는 치명상 (뇌 관통 · 심장 · 으깸 · 쪼갬) 으로 즉사하지 않고 큰 피해. 겨눈 기술 중 엉뚱한 곳을 누르면 겨눔을 풀고 누른 대로. 성장은 괴력 대신 근력 (괴력은 타고나거나 특별한 계기로만).
     v7.24.5: ''')
rep('h1::after{content:" v7.24.5"', 'h1::after{content:" v7.25.0"')
rep('<footer>굴의 전투판 v7.24.5', '<footer>굴의 전투판 v7.25.0')
rep('return `굴의 전투판 v7.24.5 · ${title}', 'return `굴의 전투판 v7.25.0 · ${title}')
rep("copyText('굴의 전투판 v7.24.5 자동 판 기록", "copyText('굴의 전투판 v7.25.0 자동 판 기록")
rep('의 버전 기록에 — v7.24.5 스토리 · 훈련장 나눔', '의 버전 기록에 — v7.25.0 알현실 빛 · 철퇴 · 세자르 고침 / v7.24.5 스토리 · 훈련장 나눔')
rep('">v7.24.5 · 스토리 · 훈련장</span>', '">v7.25.0 · 알현실 · 철퇴 · 세자르</span>')
rep("ver: '7.24.5', at:", "ver: '7.25.0', at:")
rep("RULES_MIG = '7.24.4'", "RULES_MIG = '7.25.0'")   # 새 칸 (철퇴 trec · reel · 세자르 bulletEv · evCd · 급소 bossFatal) 채움

# ---------- 알현실 ----------
rep("const HALL = { W: 28, H: 28, cx: 14, cy: 13.5, r: 12.6, pr: 8, coffin: [[13, 11], [14, 11]], king: { x: 14, y: 11.5 }, stairs: { x: 14, y: 11.5, r: 0.9 }, amb: 0.85, near: 2.6, far: 6, wait: 25 };",
    "const HALL = { W: 28, H: 28, cx: 14, cy: 13.5, r: 12.6, pr: 8, coffin: [[13, 11], [14, 11]], king: { x: 14, y: 11.5 }, stairs: { x: 14, y: 11.5, r: 0.9 }, amb: 1, near: 2.6, far: 6, wait: 25, rise: 10, hint: 6 };   /* v7.25.0 아주 밝음 · 관을 조사하면 10초 뒤 */")
rep("    if ((E.near && nd > HALL.far) || Wd.t - E.t0 > HALL.wait) czRise(Wd, E);   // 관의 시야를 벗어나는 순간 (가까이 갔던 뒤) · 너무 오래 머뭇거려도\n",
    "    if (E.st === 'open'){ if (E.tOpen == null) E.tOpen = Wd.t; const dt = Wd.t - E.tOpen; if (dt >= HALL.hint && !E.hint){ E.hint = true; toast('…관 안에서 무언가 긁는 소리가 납니다'); } if (dt >= HALL.rise || nd > HALL.far) czRise(Wd, E); return; }   /* v7.25.0 조사한 뒤 (나레이션이 끝나고) 10초 · 그 전에 관의 시야를 벗어나도 */\n"
    "    if ((E.near && nd > HALL.far) || Wd.t - E.t0 > HALL.wait) czRise(Wd, E);   // 관의 시야를 벗어나는 순간 (가까이 갔던 뒤) · 너무 오래 머뭇거려도\n")
rep("  if (!HL) S.holdClear = false;", "  S.hall = !!HL; if (HL && st.cz.st === 'open'){ delete st.cz.tOpen; delete st.cz.hint; }   /* v7.25.0 알현실 그림 · 다시 들어오면 10초를 다시 셈 */\n  if (!HL) S.holdClear = false;")
rep("  selId = null; rebuildMap(); setMapUI(); save(); start(); renderFloors();\n",
    "  selId = null; rebuildMap(); setMapUI(); save(); start(); renderFloors();\n  if (HL && world && world.explored) world.explored.fill(2);   /* v7.25.0 밝은 홀 — 한눈에 다 보임 */\n")
rep("S.indoor = false; S.zones = []; S.sandY = null; S.holdClear = false;   // v7.22", "S.indoor = false; S.hall = false; S.zones = []; S.sandY = null; S.holdClear = false;   // v7.22")
rep("'indoor', 'zones', 'sandY', 'holdClear'];", "'indoor', 'hall', 'zones', 'sandY', 'holdClear'];")
rep("const boardSet = B => Object.assign(S, { water: [], amb: 0, indoor: false,", "const boardSet = B => Object.assign(S, { water: [], amb: 0, indoor: false, hall: false,")
rep("    if (MAP.indoor){ ruinCell(g, x, y, P, R); continue; }   // v7.23 유적: 돌바닥 · 모래 · 돌벽\n",
    "    if (S.hall){ hallCell(g, x, y, P, R); continue; }   // v7.25.0 알현실: 흰 대리석\n    if (MAP.indoor){ ruinCell(g, x, y, P, R); continue; }   // v7.23 유적: 돌바닥 · 모래 · 돌벽\n")
rep("  drawTerrain(g, P);   // v7.18\n}\n", "  drawTerrain(g, P);   // v7.18\n  if (S.hall) hallDeco(g, P);   // v7.25.0\n}\n")
rep("  if (m.piles) for (let y = 0; y < S.H; y++) for (let x = 0; x < S.W; x++){", "  if (m.piles && !S.hall) for (let y = 0; y < S.H; y++) for (let x = 0; x < S.W; x++){   /* v7.25.0 알현실의 관은 hallDeco */")
rep("function ruinCell(g, x, y, P, R){\n", r"""// v7.25.0 알현실 칸: 바닥 = 흰 대리석 (결 · 줄눈) · 원 밖 = 어두운 돌. 기둥 · 금빛 원 · 융단 · 관은 hallDeco
function hallCell(g, x, y, P, R){
  const X = x * P, Y = y * P, d = Math.hypot(x + 0.5 - HALL.cx, y + 0.5 - HALL.cy);
  if (MAP.t[y * S.W + x] === 1 && d > HALL.r - 0.6){ g.fillStyle = '#17141b'; g.fillRect(X, Y, P, P); g.fillStyle = 'rgba(255,240,210,.035)'; for (let k = 0; k < 3; k++) g.fillRect(X + R() * P, Y + R() * P, 3, 2); return; }
  g.fillStyle = ['#e4ddce', '#ddd5c3', '#e8e2d4', '#d9d0be', '#e1d9c8'][(x * 37 + y * 17) % 5]; g.fillRect(X, Y, P, P);
  g.strokeStyle = 'rgba(120,100,70,.26)'; g.lineWidth = 1; g.strokeRect(X + 0.5, Y + 0.5, P - 1, P - 1);
  if (R() < 0.55){ g.strokeStyle = `rgba(140,128,110,${(0.1 + R() * 0.14).toFixed(3)})`; g.lineWidth = 0.8 + R(); g.beginPath(); g.moveTo(X + R() * P, Y); g.bezierCurveTo(X + R() * P, Y + P * 0.35, X + R() * P, Y + P * 0.65, X + R() * P, Y + P); g.stroke(); }   // 대리석 결
}
function hallDeco(g, P){
  const cx = HALL.cx * P, cy = HALL.cy * P; g.save();
  g.save(); g.beginPath(); g.rect(0, 0, S.W * P, S.H * P); g.rect(12 * P, (S.H - 5) * P, 4 * P, 5 * P); g.clip('evenodd');   // 둥근 벽: 칸 모서리를 덮어 매끈한 원 (아래 입구는 열어 둠)
  g.fillStyle = '#17141b'; g.beginPath(); g.rect(0, 0, S.W * P, S.H * P); g.arc(cx, cy, (HALL.r - 0.2) * P, 0, 6.283, true); g.fill('evenodd'); g.restore();
  g.strokeStyle = '#8a6a2c'; g.lineWidth = 5; g.beginPath(); g.arc(cx, cy, (HALL.r - 0.2) * P, 0, 6.283); g.stroke();
  g.fillStyle = 'rgba(70,50,20,.22)'; g.beginPath(); g.arc(cx, cy, (HALL.r - 0.1) * P, 0, 6.283); g.arc(cx, cy, (HALL.r - 0.9) * P, 0, 6.283, true); g.fill();   // 벽 밑 그늘
  g.strokeStyle = 'rgba(190,150,60,.8)'; g.lineWidth = 3; for (const r of [3.2, 6.2, HALL.r - 0.45]){ g.beginPath(); g.arc(cx, cy, r * P, 0, 6.283); g.stroke(); }   // 금빛 원
  g.strokeStyle = 'rgba(190,150,60,.45)'; g.lineWidth = 1.5; for (const r of [3.45, 5.95]){ g.beginPath(); g.arc(cx, cy, r * P, 0, 6.283); g.stroke(); }
  for (let k = 0; k < 16; k++){ const a = k * Math.PI / 8; g.beginPath(); g.moveTo(cx + Math.cos(a) * 3.45 * P, cy + Math.sin(a) * 3.45 * P); g.lineTo(cx + Math.cos(a) * 5.95 * P, cy + Math.sin(a) * 5.95 * P); g.stroke(); }   // 바퀴살
  const x0 = (HALL.king.x - 1.15) * P, x1 = (HALL.king.x + 1.15) * P, y0 = (HALL.king.y + 1.15) * P, y1 = S.H * P, xm = (x0 + x1) / 2;   // 붉은 융단: 아래 입구 → 관
  g.fillStyle = '#6d1522'; g.fillRect(x0, y0, x1 - x0, y1 - y0); g.fillStyle = 'rgba(0,0,0,.16)'; for (let y = y0; y < y1; y += P * 0.5) g.fillRect(x0, y, x1 - x0, 1);
  g.strokeStyle = '#c9a24a'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0 + 4, y0); g.lineTo(x0 + 4, y1); g.moveTo(x1 - 4, y0); g.lineTo(x1 - 4, y1); g.stroke();
  g.fillStyle = 'rgba(214,176,90,.6)'; for (let y = y0 + P * 0.6; y < y1; y += P * 1.2){ g.beginPath(); g.moveTo(xm, y - 6); g.lineTo(xm + 6, y); g.lineTo(xm, y + 6); g.lineTo(xm - 6, y); g.closePath(); g.fill(); }
  for (let y = 0; y < S.H; y++) for (let x = 0; x < S.W; x++){ if (MAP.t[y * S.W + x] !== 1 || Math.hypot(x + 0.5 - HALL.cx, y + 0.5 - HALL.cy) > HALL.r - 0.6) continue;   // 대리석 기둥
    const px = (x + 0.5) * P, py = (y + 0.5) * P, r = P * 0.64; g.fillStyle = 'rgba(60,44,24,.3)'; g.beginPath(); g.ellipse(px - 7, py + 9, r * 1.05, r * 0.9, 0, 0, 6.283); g.fill();
    const gr = g.createRadialGradient(px + r * 0.3, py - r * 0.4, r * 0.1, px, py, r); gr.addColorStop(0, '#fffbf2'); gr.addColorStop(0.6, '#e8dfcf'); gr.addColorStop(1, '#a99d87'); g.fillStyle = gr; g.beginPath(); g.arc(px, py, r, 0, 6.283); g.fill();
    g.strokeStyle = '#c9a24a'; g.lineWidth = 2.5; g.beginPath(); g.arc(px, py, r - 1.5, 0, 6.283); g.stroke(); g.strokeStyle = 'rgba(150,130,100,.45)'; g.lineWidth = 1; for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4; g.beginPath(); g.moveTo(px + Math.cos(a) * r * 0.35, py + Math.sin(a) * r * 0.35); g.lineTo(px + Math.cos(a) * r * 0.88, py + Math.sin(a) * r * 0.88); g.stroke(); } }
  if ((S.piles || []).length){ const qx = HALL.coffin[0][0] * P, qy = HALL.coffin[0][1] * P, w = P * 2, h = P, L = qx + 3, Rr = qx + w - 3, T = qy + 4, B = qy + h - 4, mid = (T + B) / 2;   // 관
    g.fillStyle = 'rgba(40,28,14,.35)'; g.beginPath(); g.ellipse(qx + w / 2 - 6, qy + h / 2 + 8, w * 0.55, h * 0.5, 0, 0, 6.283); g.fill();
    const path = (i) => { g.beginPath(); g.moveTo(L + i, mid); g.lineTo(L + w * 0.2 + i * 0.4, T + i); g.lineTo(Rr - i, T + h * 0.1 + i); g.lineTo(Rr - i, B - h * 0.1 - i); g.lineTo(L + w * 0.2 + i * 0.4, B - i); g.closePath(); };
    const wg = g.createLinearGradient(0, T, 0, B); wg.addColorStop(0, '#6a4428'); wg.addColorStop(0.5, '#3e2614'); wg.addColorStop(1, '#2a180c'); g.fillStyle = wg; path(0); g.fill(); g.strokeStyle = '#d4ad55'; g.lineWidth = 2.5; path(0); g.stroke();
    g.strokeStyle = 'rgba(212,173,85,.6)'; g.lineWidth = 1.2; path(5); g.stroke(); }
  g.restore();
}
function ruinCell(g, x, y, P, R){
""")
rep("const D = lightImg.data, vNow = Wd.map && Wd.map.indoor && !ed && !see && Wd.visNow", "const D = lightImg.data, vNow = Wd.map && Wd.map.indoor && !S.hall && !ed && !see && Wd.visNow")
rep("(litAt(Wd, u.x, u.y) && !(Wd.map.indoor && Wd.visNow &&", "(litAt(Wd, u.x, u.y) && !(Wd.map.indoor && !S.hall && Wd.visNow &&")
rep("  if (!ed) drawCzWarn(Wd, ox, oy, ts);   // v7.23.2 세자르 예고 범위\n", "  if (S.hall) drawHallLight(Wd, ox, oy, ts);   // v7.25.0 알현실의 빛\n  if (!ed) drawCzWarn(Wd, ox, oy, ts);   // v7.23.2 세자르 예고 범위\n")
rep("// 관 속의 왕관 (반짝임) · 계단\n", r"""// v7.25.0 알현실의 빛: 높은 창에서 비스듬히 쏟아지는 빛줄기 (천천히 일렁임) · 관을 곧게 비추는 빛 · 빛 속을 떠도는 먼지. 권위의 눈이 내리면 차가운 빛
function drawHallLight(Wd, ox, oy, ts){
  const t = performance.now() / 1000, col = Wd && Wd.snow ? '215,232,255' : '255,236,196', cx = ox + HALL.cx * ts, cy = oy + HALL.cy * ts, R = HALL.r * ts, kx = ox + HALL.king.x * ts, ky = oy + HALL.king.y * ts;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.clip(); ctx.fillStyle = 'rgba(46,30,14,.24)'; ctx.fillRect(cx - R, cy - R, R * 2, R * 2); ctx.globalCompositeOperation = 'lighter';   // 그늘을 깔고 빛을 더함 (빛줄기가 보이게)
  const ang = 1.2, dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx, Lh = R * 2.8;
  for (let k = 0; k < 7; k++){ const off = (k - 3) * R * 0.34 + Math.sin(t * 0.13 + k * 2.1) * ts * 0.35, w = ts * (1.1 + (k % 3) * 0.55), a = 0.15 + 0.06 * Math.sin(t * 0.6 + k * 1.7);
    const sx = cx + nx * off - dx * Lh / 2, sy = cy + ny * off - dy * Lh / 2, gr = ctx.createLinearGradient(sx - nx * w, sy - ny * w, sx + nx * w, sy + ny * w);
    gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(0.5, `rgba(${col},${a.toFixed(3)})`); gr.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = gr;
    ctx.beginPath(); ctx.moveTo(sx + nx * w, sy + ny * w); ctx.lineTo(sx + nx * w + dx * Lh, sy + ny * w + dy * Lh); ctx.lineTo(sx - nx * w + dx * Lh, sy - ny * w + dy * Lh); ctx.lineTo(sx - nx * w, sy - ny * w); ctx.closePath(); ctx.fill(); }
  { const g0 = ctx.createRadialGradient(kx, ky, 0, kx, ky, ts * 4.6); g0.addColorStop(0, `rgba(${col},${(0.3 + 0.05 * Math.sin(t * 0.9)).toFixed(3)})`); g0.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(kx, ky, ts * 4.6, 0, 6.283); ctx.fill();   // 관을 비추는 빛
    const g1 = ctx.createLinearGradient(kx - ts * 1.4, 0, kx + ts * 1.4, 0); g1.addColorStop(0, `rgba(${col},0)`); g1.addColorStop(0.5, `rgba(${col},0.16)`); g1.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g1; ctx.fillRect(kx - ts * 1.4, cy - R, ts * 2.8, ky - (cy - R)); }
  ctx.fillStyle = `rgba(${col},1)`;
  for (let k = 0; k < 90; k++){ const sp = 0.6 + (k % 5) * 0.25, x = cx - R + (((k * 97.31 + t * 9 * sp) % (2 * R)) + 2 * R) % (2 * R), y = cy - R + (((k * 61.7 + t * 14 * sp) % (2 * R)) + 2 * R) % (2 * R), al = 0.18 + 0.32 * (0.5 + 0.5 * Math.sin(t * 1.4 + k * 1.3));
    ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(x, y, 0.7 + (k % 3) * 0.55, 0, 6.283); ctx.fill(); }   // 떠도는 먼지
  ctx.restore();
}
// 관 속의 왕관 (반짝임) · 계단
""")

# ---------- 겨눔: 엉뚱한 곳을 누르면 풀고 누른 대로 ----------
rep("  const done = () => { armed = null; hud(); };\n  if (k === 'charge'){",
    "  const done = () => { armed = null; hud(); }, armPass = what => { armed = null; chargePick = null; throwPick = null; palmPick = null; leapPick = null; skillPick = null; sweepAim = null; hud(); toast(`${what} 겨눔을 풀었어요 — 누른 대로 할게요`); return 'pass'; };   /* v7.25.0 엉뚱한 곳 = 겨눔을 풀고 그 누름을 그대로 (이동 · 고르기) */\n  if (k === 'charge'){")
rep("toast('돌진: 적이나 바닥을 탭 (아군 X) · 아래로 쓸면 취소'); return;", "return armPass('돌진');")
rep("toast('투창: 적을 탭 · 아래로 쓸면 취소'); return;", "return armPass('투창');")
rep("toast('팜 버스트: 적을 탭 · 아래로 쓸면 취소'); return;", "return armPass('팜 버스트');")
rep("toast(SPEC_TGT[A0.s] + ' · 아래로 쓸면 취소'); return;", "return armPass(nm);")
rep("toast('약: 아군을 탭 · 아래로 쓸면 취소'); return;", "return armPass('약');")
rep("toast('측면 기동: 옆 · 뒤로 돌아 들어갈 적을 탭 · 아래로 쓸면 취소'); return;", "return armPass('측면 기동');")
rep("toast('암살: 적을 탭 · 아래로 쓸면 취소'); return;", "return armPass('암살');")
rep("toast('정찰: 살펴볼 바닥을 탭 · 아래로 쓸면 취소'); return;", "return armPass('정찰');")
rep("toast('전열 후퇴: 물러설 바닥을 탭 · 아래로 쓸면 취소'); return;", "return armPass('전열 후퇴');")
rep("  if (armedNow()){ armedTap(w); return; }   // v5.9.0 기술이 켜져 있으면 그 기술의 대상만", "  if (armedNow() && armedTap(w) !== 'pass') return;   // v5.9.0 기술이 켜져 있으면 그 기술의 대상만 · v7.25.0 엉뚱한 곳이면 풀고 아래로")
rep("armed.k === 'spec')){ armedTap(w); return; }   // v7.2 전열 후퇴: 물러설 바닥", "armed.k === 'spec') && armedTap(w) !== 'pass') return;   // v7.2 전열 후퇴: 물러설 바닥")
rep("armed.k === 'spec')){ armedTap(w); return; }   // v7.2 전열 후퇴: 오른쪽 클릭도 물러설 바닥", "armed.k === 'spec') && armedTap(w) !== 'pass') return;   // v7.2 전열 후퇴: 오른쪽 클릭도 물러설 바닥")

# ---------- 성장: 괴력 대신 근력 ----------
rep("괴력: { need: 160, cap: 'B', by: 'meleeDealt' }", "근력: { need: 160, cap: 'B', by: 'meleeDealt' }")
rep("  for (const k of ['사격', '회피', '속력', '괴력']){ const G = GROW[k]", "  for (const k of ['사격', '회피', '속력', '근력']){ const G = GROW[k]")   # v7.25.0 괴력은 자라지 않음
rep("return `싸우며 깨우친 힘 — 결정적인 순간에만 힘 ×${k}:", "return `깨우친 힘 (아무나 얻지 못함 — 타고난 소질 · 특별한 계기나 만남으로만, 싸워서 자라지 않음) — 결정적인 순간에만 힘 ×${k}:")
rep("if (!S.v7242m){", """// v7.25.0 괴력은 자라지 않음: 예전 캠페인에서 싸워서 얻은 괴력 (grown 에 '괴력 …') 은 근력으로 옮김 (원래 괴력을 지닌 이는 그대로)
const fix7250 = p => { if (!p || !(p.grown || []).some(g => /^괴력 /.test(g))) return false; const d = designByKey(p.key || p.name), inn = d && (d.traits || []).some(t => /^괴력/.test(t)); if (inn) return false;
  const tr = p.traits || []; const g = tr.map(x => /^괴력([SABC])$/.exec(x)).find(Boolean); if (!g) return false; const GN = { C: 1, B: 2, A: 3, S: 4 }, cur = (tr.map(x => /^근력([SABC])$/.exec(x)).find(Boolean) || [])[1];
  p.traits = tr.filter(x => !/^괴력[SABC]$/.test(x) && !(cur && GN[cur] < GN[g[1]] && /^근력[SABC]$/.test(x))); if (!cur || GN[cur] < GN[g[1]]) p.traits.push('근력' + g[1]); p.grown = p.grown.map(x => x.replace(/^괴력 /, '근력 ')); return true; };
if (!S.v7250m){ try { const L = [...(S.units || []), ...((S.campBak || {}).units || []), ...(((S.story || {}).board || {}).units || []), ...(((S.camp || {}).lostP) || []), ...((((S.story || {}).camp || {}).lostP) || [])]; for (const u of L) fix7250(u); } catch (e) {} S.v7250m = true; }
if (!S.v7242m){""")

# ---------- 로그 · 이야기 ----------
rep("      case 'pb': out.push(`${T(e)}💥 ${n(e.a)} → ${n(e.b)} 샷건 영거리 사격 (남은 특수탄 ${e.left})`); break;",
    "      case 'pb': out.push(`${T(e)}💥 ${n(e.a)} → ${n(e.b)} 샷건 영거리 사격${e.miss ? ' — 비켜 섬 (빗나감)' : ''} (남은 특수탄 ${e.left})`); break;\n"
    "      case 'flailDrop': out.push(`${T(e)}🌀 ${n(e.a)} ${e.why || '넘어짐'} — ${e.s === 'sweep' ? '철퇴 후리기가 끊기고 ' : e.s === 'hurl' ? '휘둘러 치기가 끊기고 ' : ''}철퇴를 놓침 (공이 바닥에)`); break;   // v7.25.0\n"
    "      case 'flailReel': out.push(`${T(e)}🌀 ${n(e.a)} 일어나 철퇴를 감아 들임 (걸으며)`); break;\n"
    "      case 'bossFatal': out.push(`${T(e)}👑 ${n(e.b)} ${DK_TXT[e.how] || '치명상'} — 쓰러지지 않고 버팀 (큰 피해 ${e.dmg})`); break;")
rep("    case 'pb': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 코앞의 ${reul(n(e.b))} 샷건으로 날려 버린다!` };",
    "    case 'pb': return e.miss ? { c: U(e.a).side ? 'good' : 'bad', s: `${ga(n(e.b))} 총구를 읽고 몸을 비튼다 — 샷건이 허공을 찢는다` } : { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 코앞의 ${reul(n(e.b))} 샷건으로 날려 버린다!` };\n"
    "    case 'bossFatal': return { c: U(e.b).side ? 'good' : 'bad', s: `${ga(n(e.b))} 치명상을 입고도 쓰러지지 않는다` };   // v7.25.0\n"
    "    case 'flailDrop': return { c: U(e.a).side ? 'good' : 'bad', s: `${n(e.a)}의 철퇴가 손을 떠나 바닥을 구른다` };")
open(F, 'w', encoding='utf-8').write(s)
print('page7250 OK')
