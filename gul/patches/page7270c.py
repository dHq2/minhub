# v7.27.0 페이지 — page7270c.py v1.1 (v1.1: 들어오는 자리는 아래 네 줄 (예전 알현실과 비슷한 거리 — 세자르가 일어나는 자리에서 10칸쯤) · 지형 그리기 주석 · v1.0: 세자르의 알현실 (5S) 을 도감 그림으로: bg_cesar_boss (체크무늬 → 투명 · art/cesar/boss.webp · 74px = 한 칸) ·
#   벽 · 옥좌 · 서 있는 부러진 기둥 = 막힘 (시야도) · 쓰러진 기둥 · 돌무더기 = 잔해 (더미 4 — 못 지나감 · 1.0M 낮은 엄폐) · 관은 옥좌 앞으로 (13 ~ 14, 12) ·
#   빛은 그림의 두 빛줄기를 따라 옅게 일렁임 · 권위의 눈이 내리면 홀이 푸르게 · 들어오는 자리는 아래 입구 쪽 넓게 · 수치표 이전 7.27.0 (잔해 높이 칸))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7270a.tpl.html', encoding='utf-8').read()   # 레지나까지 (page7270.py 결과)
CZMAP = open(D + '_czmap.txt', encoding='utf-8').read().strip()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
def cut(a, b, new):   # a 부터 b 앞까지를 new 로
    global s
    i = s.index(a); j = s.index(b, i)
    assert s.count(a) == 1
    s = s[:i] + new + s[j:]

# ---------- 버전 표기 ----------
rep('         권태로운 레지나와 이야기 · 싸움 · 그냥 지나감 · 세 번째 만남부터 영입. 새 대화 그림 (레지나 · 레베카 · 모닝스타 · 친칠라 · 리완 · 세르파 · 페흐토 · 포렌).\n',
    '         권태로운 레지나와 이야기 · 싸움 · 그냥 지나감 · 세 번째 만남부터 영입. 새 대화 그림 (레지나 · 레베카 · 모닝스타 · 친칠라 · 리완 · 세르파 · 페흐토 · 포렌).\n'
    '         5S 세자르의 알현실을 도감 그림으로 — 벽 · 옥좌 · 서 있는 기둥은 막힘, 쓰러진 기둥 · 돌무더기는 잔해 (못 지나가는 낮은 엄폐). 관은 빈 옥좌 앞.\n')
rep('버전 기록에 — v7.27.0 레지나 인카운터 · 새 대화 그림 /', '버전 기록에 — v7.27.0 레지나 인카운터 · 세자르 알현실 그림 · 새 대화 그림 /')
rep('">v7.27.0 · 레지나</span>', '">v7.27.0 · 레지나 · 세자르 알현실</span>')
rep("RULES_MIG = '7.26.1'", "RULES_MIG = '7.27.0'")   # 잔해 높이 칸 (terrain.pileH.잔해) 을 채움

# ---------- 맵 칸 그리기: 바탕만 (그림은 draw 에서) ----------
rep("    if (S.hall){ hallCell(g, x, y, P, R); continue; }   // v7.25.0 알현실: 흰 대리석",
    "    if (S.hall){ hallCell(g, x, y, P); continue; }   /* v7.27.0 알현실: 바탕만 — 그림은 draw 에서 (원본 해상도) */")
rep("  if (S.hall) hallDeco(g, P);   // v7.25.0\n", "")
cut("// v7.25.0 알현실 칸: 바닥 = 흰 대리석 (결 · 줄눈) · 원 밖 = 어두운 돌. 기둥 · 금빛 원 · 융단 · 관은 hallDeco\nfunction hallCell(", "function ruinCell(",
    "// v7.27.0 알현실 칸: 바탕만 (홀 밖 · 벽 = 어둠 · 바닥 = 어두운 돌빛). 도감 그림 · 관은 drawCzRoom (매 장면)\n"
    "function hallCell(g, x, y, P){ const c = (CZ_MAP[y] || '')[x] || 'x'; g.fillStyle = c === 'x' ? '#07060a' : c === '#' ? '#121016' : '#2b2622'; g.fillRect(x * P, y * P, P, P); }\n")

# ---------- 장면마다: 그림 · 관 ----------
rep("  if (S.regina && Wd.camp) drawRegina(Wd, ox, oy, ts);   /* v7.27.0 복도 · 알현실 그림 · 옥좌의 레지나 */\n",
    "  if (S.regina && Wd.camp) drawRegina(Wd, ox, oy, ts);   /* v7.27.0 복도 · 알현실 그림 · 옥좌의 레지나 */\n"
    "  if (S.hall && Wd.camp) drawCzRoom(Wd, ox, oy, ts);   /* v7.27.0 세자르의 알현실 그림 · 옥좌 앞의 관 */\n")

# ---------- 5S 맵 ----------
rep("{ name: '5S', kind: '알현실', note: '세자르의 알현실 — 천장이 보이지 않는 원형 홀 · 가운데에 관 하나', hall: true }",
    "{ name: '5S', kind: '알현실', note: '세자르의 알현실 — 무너진 원형 홀 · 빈 옥좌 앞에 관 하나', hall: true }")
cut("// v7.23.1 5S 알현실: 28 × 28 원형 홀", "const czNearCoffin",
"""// v7.23.1 5S 알현실 → v7.27.0 도감 그림 (bg_cesar_boss · 2066 × 2048 · 74px = 한 칸 · 왼쪽 13px 여백): 28 × 28 무너진 원형 홀 (밝음 · 아래 입구 · 위 = 높은 문틈과 벽) ·
//   빈 옥좌 앞에 관 (2칸 · 더미 3) — 관 속의 왕 (세자르) · 쓰러지면 관 자리에 계단
const HALL = { W: 28, H: 28, coffin: [[13, 12], [14, 12]], king: { x: 14, y: 12.5 }, stairs: { x: 14, y: 12.5, r: 0.9 }, amb: 1, near: 2.6, far: 6, wait: 25, rise: 10, hint: 6, img: { src: 'art/cesar/boss.webp', x: -13 / 74, y: 0, s: 1 / 74 } };   /* v7.25.0 아주 밝음 · 관을 조사하면 10초 뒤 */
// 칸: x = 홀 밖 · # = 벽 · 옥좌 · 서 있는 부러진 기둥 (높음 — 시야 · 탄을 막음) · r = 잔해 (쓰러진 기둥 · 돌무더기 — 못 지나감 · 너머로 보이는 낮은 엄폐) · . = 바닥
const CZ_MAP = [
  """ + CZMAP + """];
const czRubble = () => { const o = []; CZ_MAP.forEach((r, y) => [...r].forEach((c, x) => { if (c === 'r') o.push(x + ',' + y + ',4'); })); return o; };
function hallLayout(){
  const { W, H } = HALL, flips = [];
  CZ_MAP.forEach((r, y) => [...r].forEach((c, x) => { if (c === 'x' || c === '#') flips.push(x + ',' + y); }));
  return { W, H, flips, piles: HALL.coffin.map(([x, y]) => x + ',' + y + ',3'), rubble: czRubble() };
}
""")
rep("piles: st.cz.st === 'stairs' ? [] : HL.piles.slice(), hills: [], indoor: true, zones: [], sandY: null, holdClear: st.cz.st !== 'stairs' }",
    "piles: (st.cz.st === 'stairs' ? [] : HL.piles.slice()).concat(HL.rubble), hills: [], indoor: true, zones: [], sandY: null, holdClear: st.cz.st !== 'stairs' }")   # v7.27.0 잔해는 늘 그대로
rep("  if (S.regina && up) campPlace(m, party, 3.4, 6, 9, 15); else   /* v7.27.0 위에서 돌아오면 옥좌 앞 */\n",
    "  if (S.regina && up) campPlace(m, party, 3.4, 6, 9, 15); else   /* v7.27.0 위에서 돌아오면 옥좌 앞 */\n"
    "  if (HL && !up) campPlace(m, party, S.H - 4, S.H - 0.5, 8, 20); else   /* v7.27.0 알현실은 아래 입구가 좁음 — 아래 네 줄 (세자르가 일어나는 자리에서 10칸쯤) */\n")
rep("for (const [x, y] of HALL.coffin){ Wd.map.t[y * Wd.map.W + x] = 0; if (Wd.map.pk) Wd.map.pk[y * Wd.map.W + x] = 0; } S.piles = []; S.camp.stages[5].piles = []; rebuildMap();",
    "for (const [x, y] of HALL.coffin){ Wd.map.t[y * Wd.map.W + x] = 0; if (Wd.map.pk) Wd.map.pk[y * Wd.map.W + x] = 0; } S.piles = czRubble(); S.camp.stages[5].piles = S.piles.slice(); rebuildMap();")   # v7.27.0 잔해는 남음
rep("const RN = HL && !st.seen ? [{ narr: '천장이 보이지 않을 만큼 높습니다. 가운데에 관 하나.' }]",
    "const RN = HL && !st.seen ? [{ narr: '천장이 보이지 않을 만큼 높습니다. 거미줄 앉은 옥좌 앞에, 관 하나.' }]")

# ---------- 빛: 그림의 빛줄기를 따라 옅게 ----------
cut("// v7.25.0 알현실의 빛: 높은 창에서", "// 관 속의 왕관 (반짝임) · 계단",
"""// v7.25.0 알현실의 빛 → v7.27.0 그림에 빛줄기가 그려져 있어 그 위에 일렁임만: 위 문틈에서 내려오는 두 빛줄기 (옅게) · 관을 비추는 빛 · 떠도는 먼지. 권위의 눈이 내리면 홀이 푸르게
function czClip(ox, oy, ts){ ctx.beginPath(); CZ_MAP.forEach((r, y) => { let x0 = -1; for (let x = 0; x <= r.length; x++){ const o = x < r.length && r[x] !== 'x'; if (o && x0 < 0) x0 = x; if (!o && x0 >= 0){ ctx.rect(ox + x0 * ts, oy + y * ts, (x - x0) * ts, ts); x0 = -1; } } }); ctx.clip(); }
function drawHallLight(Wd, ox, oy, ts){
  const t = performance.now() / 1000, snow = Wd && Wd.snow, col = snow ? '215,232,255' : '255,236,196', kx = ox + HALL.king.x * ts, ky = oy + HALL.king.y * ts;
  ctx.save(); czClip(ox, oy, ts);
  if (snow){ ctx.fillStyle = 'rgba(110,150,225,.16)'; ctx.fillRect(ox, oy, HALL.W * ts, HALL.H * ts); }
  ctx.globalCompositeOperation = 'lighter';
  for (const [ax, b0, b1, ye, ph] of [[13.3, 8, 11, 23, 0], [14.95, 17.3, 20, 22, 2.2]]){ const a = 0.04 + 0.03 * Math.sin(t * 0.5 + ph), y0 = oy + 0.6 * ts, y1 = oy + ye * ts;   // 그림의 두 빛줄기
    const gr = ctx.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, `rgba(${col},${(a * 1.6).toFixed(3)})`); gr.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = gr;
    ctx.beginPath(); ctx.moveTo(ox + (ax - 0.35) * ts, y0); ctx.lineTo(ox + (ax + 0.35) * ts, y0); ctx.lineTo(ox + b1 * ts, y1); ctx.lineTo(ox + b0 * ts, y1); ctx.closePath(); ctx.fill(); }
  { const g0 = ctx.createRadialGradient(kx, ky, 0, kx, ky, ts * 3.2); g0.addColorStop(0, `rgba(${col},${(0.16 + 0.04 * Math.sin(t * 0.9)).toFixed(3)})`); g0.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(kx, ky, ts * 3.2, 0, 6.283); ctx.fill(); }   // 관을 비추는 빛
  ctx.fillStyle = `rgba(${col},1)`; const X0 = ox + ts, Y0 = oy + ts, w = 26 * ts, h = 26 * ts;
  for (let k = 0; k < 90; k++){ const sp = 0.6 + (k % 5) * 0.25, x = X0 + (((k * 97.31 + t * 9 * sp) % w) + w) % w, y = Y0 + (((k * 61.7 + t * 14 * sp) % h) + h) % h, al = 0.16 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.4 + k * 1.3));
    ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(x, y, 0.7 + (k % 3) * 0.55, 0, 6.283); ctx.fill(); }   // 떠도는 먼지
  ctx.restore();
}
// v7.27.0 세자르의 알현실 그림 (처음 그릴 때 불러옴) · 그림이 28칸에 조금 모자란 아래 입구는 마지막 줄을 늘려 이음 · 옥좌 앞의 관
let CZIMG = null; const czImg = () => CZIMG || (CZIMG = Object.assign(new Image(), { src: HALL.img.src }));
function drawCzRoom(Wd, ox, oy, ts){
  const a = czImg(), I = HALL.img;
  if (a.complete && a.naturalWidth){ const w = a.naturalWidth * I.s * ts, h = a.naturalHeight * I.s * ts, x = ox + I.x * ts, y = oy + I.y * ts; ctx.drawImage(a, x, y, w, h);
    if (h < HALL.H * ts) ctx.drawImage(a, 0, a.naturalHeight - 6, a.naturalWidth, 6, x, y + h - 1, w, HALL.H * ts - h + 1); }
  if ((S.piles || []).some(k => String(k).endsWith(',3'))) czCoffin(ox, oy, ts);
}
function czCoffin(ox, oy, ts){
  const g = ctx, P = ts, qx = ox + HALL.coffin[0][0] * P, qy = oy + HALL.coffin[0][1] * P, w = P * 2, h = P, L = qx + P * 0.1, Rr = qx + w - P * 0.1, T = qy + P * 0.13, B = qy + h - P * 0.13, mid = (T + B) / 2;
  g.save(); g.fillStyle = 'rgba(30,20,10,.45)'; g.beginPath(); g.ellipse(qx + w / 2 - P * 0.18, qy + h / 2 + P * 0.25, w * 0.55, h * 0.5, 0, 0, 6.283); g.fill();
  const path = i => { g.beginPath(); g.moveTo(L + i, mid); g.lineTo(L + w * 0.2 + i * 0.4, T + i); g.lineTo(Rr - i, T + h * 0.1 + i); g.lineTo(Rr - i, B - h * 0.1 - i); g.lineTo(L + w * 0.2 + i * 0.4, B - i); g.closePath(); };
  const wg = g.createLinearGradient(0, T, 0, B); wg.addColorStop(0, '#6a4428'); wg.addColorStop(0.5, '#3e2614'); wg.addColorStop(1, '#2a180c'); g.fillStyle = wg; path(0); g.fill(); g.strokeStyle = '#d4ad55'; g.lineWidth = Math.max(1.5, P * 0.08); path(0); g.stroke();
  g.strokeStyle = 'rgba(212,173,85,.6)'; g.lineWidth = Math.max(1, P * 0.04); path(P * 0.16); g.stroke(); g.restore();
}
""")

rep("/* v7.25.0 알현실의 관은 hallDeco */", "/* v7.27.0 알현실의 관 · 잔해는 그림 (drawCzRoom) */")

# ---------- 엄폐 곁 글 ----------
rep("if (pk) out.push(pk === 2 ? '엄폐 곁 (굳은 시체 0.6M)' : '엄폐 곁 (갑옷 무더기 1.1M)');",
    "if (pk) out.push(pk === 2 ? '엄폐 곁 (굳은 시체 0.6M)' : pk === 3 ? '엄폐 곁 (관 0.9M)' : pk === 4 ? '엄폐 곁 (쓰러진 기둥 1.0M)' : '엄폐 곁 (갑옷 무더기 1.1M)');")   # v7.27.0

# ---------- 인카운터 탭 ----------
rep("encTr('무엇', '천장이 보이지 않는 원형 홀 — 빛이 쏟아져 내리는 장엄한 곳 · 가운데에 관 하나')",
    "encTr('무엇', '무너진 원형 알현실 — 높은 문틈으로 빛이 쏟아져 내림 · 거미줄 앉은 빈 옥좌 앞에 관 하나 (도감 그림 bg_cesar_boss)')")
rep("encTr('맵', `${HALL.W} × ${HALL.H} 원형 홀 · 빛 ${HALL.amb} (한눈에 다 보임) · 기둥 여덟`)",
    "encTr('맵', `${HALL.W} × ${HALL.H} 원형 홀 · 빛 ${HALL.amb} (한눈에 다 보임) · 벽 · 옥좌 · 서 있는 부러진 기둥은 막힘 (시야도) · 쓰러진 기둥 · 돌무더기 ${czRubble().length}칸은 잔해 (못 지나감 · 1.0M 낮은 엄폐 — 너머로 보이고 쏠 수 있음)`)")

open(F, 'w', encoding='utf-8').write(s)
print('page7270c OK')
