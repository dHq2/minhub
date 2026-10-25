# v9.8.0 페이지 — page9200.py v1.1 (v1.1: 지휘망 늘 보기 기본 끔 (예전 저장값이 켜 두던 것) · 돌격 방어 글은 무리 위로 / v1.0: 대개편 — 판을 "보는 재미" 위주로. ① 무기를 실제 사거리 길이로 그림 (검 날 · 창대 · 둔기 · 도끼 · 활 · 총 · 지팡이 · 주먹 — 휘두를 땐 당겼다 뻗음) ② 방패는 들면 몸 앞으로 · 내리면 옆에 ③ 맞닿은 무리는 세포막 하나로 감쌈 — 돌격 방어 (뭉침 · 받침 · 돌격이 오는 중) 면 막이 굵고 밝아지며 실제 버팀 배율 표시 ④ 덜어내기: 막는 부채꼴 · 기분 글 · 상태 아이콘 · 방어구 · 탄약 · 이름 · 야시 점 · 의도 글 · 관계선 · 전열 곡선은 고른 인물 · 커서 · 자세히 보기일 때만 · 지휘망은 명령할 때 (멈춰 고른 동안) 만 ⑤ 조작판: ⚙ 설정 하나로 모음 · 긴 안내는 두 줄 (누르면 펼침) · 관계 목록 접음 · 빈 기술 칸 · 편대 · 희생 돌격 · 고르기 단추 · 긴 클릭 설명 지움)
import subprocess, re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9190.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.7.4 (2026-10-25)', '<!-- 굴의 전투판 v9.8.0 (2026-10-25)')
rep('     v9.7.4: 겹쳐 보기', '''     v9.8.0: 대개편 (보는 재미) — 무기를 실제 사거리 길이로 그림 · 방패는 들면 앞으로 · 맞닿은 무리는 세포막 (돌격 방어면 굵게 + 버팀 배율) · 뭉친 몸은 서로 밀어붙임 · 판의 잔글씨 · 아이콘 · 선은 고른 인물 · 자세히 보기일 때만 · 지휘망은 명령할 때만 · ⚙ 설정 하나로 · 안 쓰는 단추 정리
     v9.7.4: 겹쳐 보기''')
for a, b in (('h1::after{content:" v9.7.4"', 'h1::after{content:" v9.8.0"'), ('<footer>굴의 전투판 v9.7.4', '<footer>굴의 전투판 v9.8.0'), ('return `굴의 전투판 v9.7.4 · ${title}', 'return `굴의 전투판 v9.8.0 · ${title}'),
             ("copyText('굴의 전투판 v9.7.4 자동 판 기록", "copyText('굴의 전투판 v9.8.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.7.4 — ${C.run", "o.push(`굴의 전투판 v9.8.0 — ${C.run"),
             ('의 버전 기록에 — v9.7.4 겹쳐 보기', '의 버전 기록에 — v9.8.0 대개편 (보는 재미) / v9.7.4 겹쳐 보기'),
             ('">v9.7.4 시험판 · 겹쳐 보기 (전열 · 사선 · 돌격 · 감각) · 돌격 방식 · 🧱 뭉침 · 버팀은 닿은 몸만</span>', '">v9.8.0 대개편 · 무기 = 사거리 · 세포막 무리 · 돌격 방어 · 판을 깨끗하게</span>'),
             ("ver: '9.7.4', kind:", "ver: '9.8.0', kind:"), ("RULES_MIG = '9.7.4',", "RULES_MIG = '9.8.0',")):
    rep(a, b)

# ---------- ④ 덜어내기 (판) ----------
rep("const detail = () => $('detailAll').checked;", "const detail = () => $('detailAll').checked;\nconst NETV = () => $('netShow').checked || ((paused || mode === 'plan') && sel.size > 0);   /* v9.8.0 지휘망은 명령할 때 (멈춰서 고른 동안) 만 */")
rep("      if (vis){ const strong = u.pid === hoverPid", "      if (vis && (ed || detail() || u.pid === hoverPid || sel.has(u.i))){ const strong = u.pid === hoverPid")
rep("      ctx.strokeStyle = gOn ? '#7fe3a0' : 'rgba(255,120,95,.85)'; ctx.lineWidth = Math.max(3, r * 0.2); if (!gOn) ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, r + 1, fa - ga2, fa + ga2); ctx.stroke(); ctx.setLineDash([]); }",
    "      if (ed || detail() || u.pid === hoverPid || sel.has(u.i)){ ctx.strokeStyle = gOn ? '#7fe3a0' : 'rgba(255,120,95,.85)'; ctx.lineWidth = Math.max(3, r * 0.2); if (!gOn) ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, r + 1, fa - ga2, fa + ga2); ctx.stroke(); ctx.setLineDash([]); } }")
rep("(detail() || u.side !== 0 || u.pid === hoverPid || sel.has(u.i))))){", "(detail() || u.pid === hoverPid || sel.has(u.i))))){")
rep("    if (u.ammo != null && (ed || u.side === 0 || u.engaged || see)){", "    if (u.ammo != null && (ed || see || detail() || sel.has(u.i) || u.pid === hoverPid || (u.side === 0 && u.ammo <= 3))){")
tri = "ctx.beginPath(); ctx.moveTo(px + Math.cos(fa) * (r + 10), py + Math.sin(fa) * (r + 10)); ctx.lineTo(px + Math.cos(fa + 0.34) * (r + 1.5), py + Math.sin(fa + 0.34) * (r + 1.5)); ctx.lineTo(px + Math.cos(fa - 0.34) * (r + 1.5), py + Math.sin(fa - 0.34) * (r + 1.5)); ctx.closePath(); ctx.stroke(); ctx.fill();"
rep(tri, "if (ed || !wpIcon(Wd, u)){ " + tri + " }   /* v9.8.0 무기를 그리는 몸은 무기가 바라보는 쪽 */")
rep("    if (!ed && vis){ const is = Math.max(6, Math.min(11, r * 0.36));", "    if (!ed && vis && (detail() || sel.has(u.i) || u.pid === hoverPid)){ const is = Math.max(6, Math.min(11, r * 0.36));")
rep("    if (vis && ts >= 12 && u.gear){", "    if (vis && ts >= 12 && u.gear && (ed || detail() || sel.has(u.i) || u.pid === hoverPid)){")
rep("    if (ts >= 30){\n      ctx.font = `500 ${ts >= 60 ? 12 : 10}px", "    if (ts >= 30 && (ed || ts >= 56 || detail() || sel.has(u.i) || u.pid === hoverPid || u.hero)){\n      ctx.font = `500 ${ts >= 60 ? 12 : 10}px")
rep("    if (u.nv && (ed || u.side === 0) && !noPick(u)){", "    if (u.nv && (ed || u.side === 0) && !noPick(u) && (ed || detail())){")
rep("  if (!ed && $('netShow').checked && Wd.t > 0.01 && Wd.mesh0){", "  if (!ed && NETV() && Wd.t > 0.01 && Wd.mesh0){")
rep("  if (!ed && $('netShow').checked && Wd.t > 0.01){", "  if (!ed && NETV() && Wd.t > 0.01){")
rep("  drawRel(Wd, ox, oy, ts);", "  if (ed || Wd.t < 0.01 || detail() || sel.size) drawRel(Wd, ox, oy, ts);   /* v9.8.0 관계선은 고를 때만 */\n  if (!ed) drawMembranes(Wd, ox, oy, ts, $('seeAll').checked);   /* v9.8.0 세포막 (몸 밑에) */")
rep("      Wd._itN = {}; for (const u of Wd.units){ if (!u.alive || u.side !== 0 || hid0(u)) continue;", "      Wd._itN = {}; for (const u of Wd.units){ if (!u.alive || u.side !== 0 || hid0(u) || !(detail() || sel.has(u.i))) continue;")
rep("  if (!ed) drawBattleLines(Wd, ox, oy, ts, see);", "  if (!ed && (detail() || OVL.line)) drawBattleLines(Wd, ox, oy, ts, see);   /* v9.8.0 전열 곡선은 세포막이 대신함 */")

# ---------- ② 방패: 들면 앞으로 ----------
rep("const a = fa - 0.75, s = Math.max(9, r * 0.72), cx = x + Math.cos(a) * r * 1.0, cy = y + Math.sin(a) * r * 1.0;",
    "const a = fa - (on ? 0.3 : 1.1), s = Math.max(9, r * (on ? 0.82 : 0.66)), cx = x + Math.cos(a) * r * (on ? 1.12 : 0.92), cy = y + Math.sin(a) * r * (on ? 1.12 : 0.92);   /* v9.8.0 들면 몸 앞으로 · 내리면 옆에 */")

# ---------- ① 무기 = 사거리 ----------
rep("ctx.globalAlpha = vis ? 1 : 0.42; weaponMark(ox + u.x * ts, oy + u.y * ts, u.r * ts, u.face || 0, ic, SIDEC[u.side]); ctx.globalAlpha = 1; }",
    "ctx.globalAlpha = vis ? 1 : 0.42; weaponMark2(Wd, u, ox, oy, ts, ic); ctx.globalAlpha = 1; }")
rep("function weaponMark(x, y, r, fa, ic, sc){", r"""// v9.8.0 무기 = 사거리: 손 (오른쪽 앞) 에서 바라보는 쪽으로, 끝이 실제로 닿는 곳 (몸 + 사거리) 까지. 준비 중엔 당기고 · 친 순간 뻗음
function weaponMark2(Wd, u, ox, oy, ts, ic){
  const x = ox + u.x * ts, y = oy + u.y * ts, r = u.r * ts, A = u.act, far = isFar(u);
  let fa = u.face || 0, ext = 1;
  if (A && A.k === 'atk' && !far){ if (A.phase === 'wind') ext = 0.72; else if (A.phase === 'rec' && Wd.t - (A.t1 || A.t0 || 0) < 0.18) ext = 1.06; }
  if (A && A.k === 'charge' && A.mode === 'atk') ext = 1.04;
  const hx = x + Math.cos(fa + 0.85) * r * 0.82, hy = y + Math.sin(fa + 0.85) * r * 0.82;   // 손
  const tipD = (r + u.rng * ts) * ext, tx = x + Math.cos(fa) * tipD, ty = y + Math.sin(fa) * tipD;   // 끝 = 사거리
  const da = Math.atan2(ty - hy, tx - hx), dl = Math.hypot(tx - hx, ty - hy), ux = Math.cos(da), uy = Math.sin(da), nx = -uy, ny = ux, W0 = Math.max(1.6, ts * 0.05);
  const seg = (x1, y1, x2, y2, w, c) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const out = (x1, y1, x2, y2, w, c) => { seg(x1, y1, x2, y2, w + 2.2, 'rgba(10,8,12,.9)'); seg(x1, y1, x2, y2, w, c); };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (ic === '🏹'){ const cx = x + Math.cos(fa) * r * 1.02, cy = y + Math.sin(fa) * r * 1.02, R = r * 0.78;
    ctx.strokeStyle = 'rgba(10,8,12,.9)'; ctx.lineWidth = W0 + 2.4; ctx.beginPath(); ctx.arc(x, y, r * 1.02 + R * 0.25, fa - 0.75, fa + 0.75); ctx.stroke(); ctx.strokeStyle = '#a8763c'; ctx.lineWidth = W0 + 0.4; ctx.stroke();
    const pull = A && A.k === 'atk' && A.phase === 'wind' ? r * 0.35 : 0, e1 = [x + Math.cos(fa - 0.75) * (r * 1.02 + R * 0.25), y + Math.sin(fa - 0.75) * (r * 1.02 + R * 0.25)], e2 = [x + Math.cos(fa + 0.75) * (r * 1.02 + R * 0.25), y + Math.sin(fa + 0.75) * (r * 1.02 + R * 0.25)], mx = cx - Math.cos(fa) * pull, my = cy - Math.sin(fa) * pull;
    ctx.strokeStyle = 'rgba(235,228,214,.9)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(e1[0], e1[1]); ctx.lineTo(mx, my); ctx.lineTo(e2[0], e2[1]); ctx.stroke();
    if (pull) out(mx, my, mx + Math.cos(fa) * r * 0.9, my + Math.sin(fa) * r * 0.9, 1.4, '#e8e2d4');
  } else if (ic === '🔫'){ const L = r * 1.15; out(hx, hy, hx + Math.cos(fa) * L, hy + Math.sin(fa) * L, W0 + 1.6, '#3a3a42'); seg(hx + Math.cos(fa) * L * 0.25, hy + Math.sin(fa) * L * 0.25, hx - Math.cos(fa) * r * 0.25, hy - Math.sin(fa) * r * 0.25, W0 + 2, '#6b4a2c');
  } else if (ic === '🪄'){ const L = r * 0.9, ex = hx + Math.cos(fa) * L, ey = hy + Math.sin(fa) * L; out(hx, hy, ex, ey, W0, '#8a6a4a'); ctx.fillStyle = '#c9a8ff'; ctx.beginPath(); ctx.arc(ex, ey, Math.max(2.5, ts * 0.07), 0, 6.283); ctx.fill();
  } else if (ic === '👊'){ for (const k of [-0.55, 0.55]){ const fx = x + Math.cos(fa + k) * (r * 0.95 + (ext > 1 && k > 0 ? r * 0.3 : 0)), fy = y + Math.sin(fa + k) * (r * 0.95 + (ext > 1 && k > 0 ? r * 0.3 : 0)); ctx.fillStyle = '#d9a37a'; ctx.strokeStyle = 'rgba(10,8,12,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(fx, fy, Math.max(3.5, r * 0.24), 0, 6.283); ctx.fill(); ctx.stroke(); }
  } else {
    const back = ic === '🔱' ? r * 0.45 : r * 0.18, bx = hx - ux * back, by = hy - uy * back;
    if (ic === '🔱'){ const tl = Math.min(dl * 0.3, Math.max(5, ts * 0.22)), sx = tx - ux * tl, sy = ty - uy * tl; out(bx, by, sx, sy, W0, '#8a5a2c');
      ctx.fillStyle = '#d6dde6'; ctx.strokeStyle = 'rgba(10,8,12,.9)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(sx + nx * tl * 0.32, sy + ny * tl * 0.32); ctx.lineTo(sx - nx * tl * 0.32, sy - ny * tl * 0.32); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    else if (ic === '🔨' || ic === '🪓'){ const hl = Math.max(4, ts * 0.13); out(bx, by, tx, ty, W0, '#8a5a2c'); ctx.fillStyle = ic === '🔨' ? '#9aa0aa' : '#cfd6de'; ctx.strokeStyle = 'rgba(10,8,12,.9)'; ctx.lineWidth = 1.6; ctx.beginPath();
      if (ic === '🔨'){ ctx.moveTo(tx + nx * hl - ux * hl * 0.6, ty + ny * hl - uy * hl * 0.6); ctx.lineTo(tx + nx * hl, ty + ny * hl); ctx.lineTo(tx - nx * hl, ty - ny * hl); ctx.lineTo(tx - nx * hl - ux * hl * 0.6, ty - ny * hl - uy * hl * 0.6); }
      else { ctx.moveTo(tx - ux * hl * 0.2, ty - uy * hl * 0.2); ctx.quadraticCurveTo(tx + nx * hl * 1.4, ty + ny * hl * 1.4, tx - ux * hl * 1.1, ty - uy * hl * 1.1); }
      ctx.closePath(); ctx.fill(); ctx.stroke(); }
    else { const gx = hx + ux * Math.min(dl * 0.12, r * 0.25), gy = hy + uy * Math.min(dl * 0.12, r * 0.25), gw = Math.max(4, ts * (ic === '🔪' ? 0.09 : 0.14));   // 검 · 단검
      seg(bx, by, gx, gy, W0 + 1.5, '#6b4a2c'); out(gx, gy, tx, ty, W0 + (ic === '🔪' ? 0 : 0.6), '#d6dde6'); seg(gx + nx * gw, gy + ny * gw, gx - nx * gw, gy - ny * gw, W0 + 0.8, '#b08a3e'); }
  }
  ctx.restore();
}
function weaponMark(x, y, r, fa, ic, sc){""")

# ---------- ③ 세포막 ----------
rep("// v9.7.4 겹쳐 보기 (리모델 3.5):", r"""// v9.8.0 세포막: 서로 닿은 (0.22칸 안) 같은 편 몸 둘 이상 = 한 무리. 바깥 테두리만 그림 (안쪽 겹친 선 없음).
// 돌격 방어 (뭉침 · 동료 뒤 받침 · 이 무리의 누군가에게 돌격이 오는 중) 면 막이 굵고 밝아지고 실제 버팀 배율을 붙임
let MB_CV = null;
function drawMembranes(Wd, ox, oy, ts, see){
  const vis = u => u.side === 0 || see || u.seenBy, hid = u => u.side === 0 && !!u.posUnk && !!u.posK && !see;
  const U = Wd.units.filter(u => u.alive && !u.down && !u.gone && !hid(u) && vis(u) && !(u.act && u.act.air)); if (U.length < 2) return;
  const par = U.map((_, i) => i), f = i => par[i] === i ? i : (par[i] = f(par[i]));
  for (let i = 0; i < U.length; i++) for (let j = i + 1; j < U.length; j++){ const a = U[i], b = U[j]; if (a.side !== b.side) continue; if (Math.hypot(a.x - b.x, a.y - b.y) - a.r - b.r <= 0.22) par[f(i)] = f(j); }
  const G = {}; U.forEach((u, i) => { (G[f(i)] = G[f(i)] || []).push(u); });
  const cv = ctx.canvas; if (!MB_CV){ MB_CV = document.createElement('canvas'); } if (MB_CV.width !== cv.width || MB_CV.height !== cv.height){ MB_CV.width = cv.width; MB_CV.height = cv.height; }
  const oc = MB_CV.getContext('2d'), T = ctx.getTransform();
  for (const k in G){ const M = G[k]; if (M.length < 2) continue;
    const ch = Wd.units.find(e => e.alive && e.side !== M[0].side && e.act && e.act.k === 'charge' && e.act.b != null && M.includes(Wd.units[e.act.b]) && vis(e));
    const brace = !!ch || M.some(m => m.why === 'CLUMP' || m.why === 'BRACE_CHARGE');
    const col = M[0].side === 0 ? (brace ? '#9fd4ff' : '#5aa3dc') : M[0].side === 1 ? (brace ? '#ffa294' : '#e0574b') : '#b06ae8';
    const pad = ts * (brace ? 0.16 : 0.1), ring = brace ? Math.max(3, ts * 0.085) : Math.max(1.4, ts * 0.04);
    ctx.save(); ctx.globalAlpha = brace ? 0.2 : 0.09; ctx.fillStyle = col; ctx.beginPath(); for (const m of M){ const R = m.r * ts + pad; ctx.moveTo(ox + m.x * ts + R, oy + m.y * ts); ctx.arc(ox + m.x * ts, oy + m.y * ts, R, 0, 6.283); } ctx.fill(); ctx.restore();
    oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, MB_CV.width, MB_CV.height); oc.setTransform(T);
    oc.fillStyle = col; oc.beginPath(); for (const m of M){ const R = m.r * ts + pad + ring; oc.moveTo(ox + m.x * ts + R, oy + m.y * ts); oc.arc(ox + m.x * ts, oy + m.y * ts, R, 0, 6.283); } oc.fill();
    oc.globalCompositeOperation = 'destination-out'; oc.beginPath(); for (const m of M){ const R = m.r * ts + pad; oc.moveTo(ox + m.x * ts + R, oy + m.y * ts); oc.arc(ox + m.x * ts, oy + m.y * ts, R, 0, 6.283); } oc.fill(); oc.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = brace ? 0.95 : 0.55; ctx.drawImage(MB_CV, 0, 0); ctx.restore();
    if (brace){ const th = ch || Wd.units.filter(e => e.alive && !e.down && e.side !== M[0].side && vis(e)).sort((a, b) => Math.hypot(a.x - M[0].x, a.y - M[0].y) - Math.hypot(b.x - M[0].x, b.y - M[0].y))[0];
      const cx = M.reduce((a, m) => a + m.x, 0) / M.length, cy = M.reduce((a, m) => a + m.y, 0) / M.length; let mul = 1, lx = cx, ly = cy - 1.1;
      if (th){ const d = Math.hypot(th.x - cx, th.y - cy) || 1, dx = (cx - th.x) / d, dy = (cy - th.y) / d; const front = (ch ? Wd.units[ch.act.b] : M.slice().sort((a, b) => Math.hypot(a.x - th.x, a.y - th.y) - Math.hypot(b.x - th.x, b.y - th.y))[0]);
        const br = braceOf(Wd, front, th, dx, dy); mul = br.mass / Math.max(1, front.mass * (front.poise || 1)); }
      lx = cx; ly = Math.min(...M.map(m => m.y - m.r)) - 0.62;   /* 무리 위 */
      const s2 = `🛡 돌격 방어 · 버팀 ×${mul.toFixed(1)}`; ctx.save(); ctx.font = `800 ${Math.max(11, ts * 0.28)}px IBM Plex Sans KR, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(s2).width + 10, h = Math.max(15, ts * 0.38), X = ox + lx * ts, Y = oy + ly * ts;
      ctx.fillStyle = 'rgba(12,10,16,.85)'; ctx.fillRect(X - w / 2, Y - h / 2, w, h); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.strokeRect(X - w / 2 + 0.5, Y - h / 2 + 0.5, w - 1, h - 1); ctx.fillStyle = col; ctx.fillText(s2, X, Y + 0.5); ctx.restore(); } }
}
// v9.7.4 겹쳐 보기 (리모델 3.5):""")

# ---------- ⑤ 조작판 ----------
rep('          <label class="ck trainOnly" for="seeAll"><input id="seeAll" type="checkbox"> 모두 보기</label>', '          <details class="cfg"><summary title="설정 — 지휘망 · 모두 보기 · 자세히 보기 · 연출 · 흔들림 · 단축키">⚙ 설정</summary><div class="cfgin">\n          <label class="ck trainOnly" for="seeAll"><input id="seeAll" type="checkbox"> 모두 보기</label>')
rep('<input id="netShow" type="checkbox" checked> 📡 지휘망</label>', '<input id="netShow" type="checkbox"> 📡 지휘망 늘 보기 (끄면 명령할 때만)</label>')
rep('          <span class="seg"><button type="button" id="zOut" aria-label="작게">−</button>', '          </div></details>\n          <span class="seg"><button type="button" id="zOut" aria-label="작게">−</button>')
rep(".row.sst{", """.cfg{display:inline-block;position:relative}
.cfg>summary{list-style:none;cursor:pointer;font:600 12.5px var(--mono),monospace;color:#d8cfc0;border:1px solid rgba(216,207,192,.28);border-radius:6px;padding:4px 10px;user-select:none}
.cfg>summary::-webkit-details-marker{display:none}
.cfg[open]>summary{background:#e8c46a;color:#14110c;border-color:#e8c46a}
.cfg .cfgin{position:absolute;z-index:40;top:calc(100% + 6px);left:0;min-width:230px;display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:12px;background:#1b1820;border:1px solid #4a4250;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.5)}
.turninfo{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;cursor:pointer}
.turninfo.open{display:block}
#pane-fight > p.sublab.ordleg, #pane-fight > p.keys{display:none}
.sqdet>summary{cursor:pointer;font-weight:700;color:#e8c46a;padding:4px 0}
.row.sst{""")
rep("  if (ti2 !== lastTI){ lastTI = ti2; $('turnInfo').innerHTML = ti2; }", "  if (ti2 !== lastTI){ lastTI = ti2; $('turnInfo').innerHTML = ti2; }\n  if (!$('turnInfo')._ck){ $('turnInfo')._ck = 1; $('turnInfo').addEventListener('click', () => $('turnInfo').classList.toggle('open')); }   /* v9.8.0 두 줄 · 누르면 펼침 */")
rep("const h = sqBoxHtml(); for (const id of ['sqBoxP', 'sqBoxF']){ const b = $(id); if (b && b._h !== h){ b._h = h; b.innerHTML = h; } }",
    "const h = sqBoxHtml(); for (const id of ['sqBoxP', 'sqBoxF']){ const b = $(id); if (b && b._h !== h){ const od = b.querySelector('details.sqdet'), wo = od ? od.open : false; b._h = h; b.innerHTML = id === 'sqBoxF' ? `<details class=\"sqdet\"${wo ? ' open' : ''}><summary>🤝 전우조 · 대장 정하기 (펼치기)</summary>${h}</details>` : h; } }   /* v9.8.0 싸움 칸에선 접음 */")
# 명령 칸 정리
rep("return `<button class=\"btn ${on ? 'on' : ''}\" type=\"button\" data-slot=\"${n}\" ${lb ? '' : 'disabled'}", "return !lb ? '' : `<button class=\"btn ${on ? 'on' : ''}\" type=\"button\" data-slot=\"${n}\" ${lb ? '' : 'disabled'}")
rep(" 왼쪽 클릭: 적 = 공격 · 빈 바닥 = 고르기 풀기 · A → 바닥 = 공격 이동. 오른쪽 클릭: 이동${L.length > 1 ? ' (대형 그대로 각자 다른 칸)' : ''}.</p>", "</p>")
i0 = s.index('    <div class="row ogrp"><button class="btn ghd ${ordGrp.adv'); i1 = s.index('</div>\n', i0) + 7; s = s[:i0] + s[i1:]   # 고르기 · 그 밖 (모두 고르기 · 풀기 · 동시 선택) — 끌어 네모 · 숫자키 · 빈 바닥 클릭으로 충분
n0 = s.count('💀 희생 돌격</button>'); s = re.sub(r'<button class="btn" type="button" data-ord="sac"[^>]*>💀 희생 돌격</button>', '', s); assert s.count('💀 희생 돌격</button>') == n0 - 1
j0 = s.index("${(() => { const Dp = deputyOf(Wd, 0), T2 = Dp ?"); j1 = s.index("})()}", j0) + 5; assert j1 - j0 < 900; s = s[:j0] + s[j1:]   # 편대 (부대장) — 대장-부하가 대신함
rep("$('netShow').checked = S.showNet !== false;", "$('netShow').checked = S.showNet === true;   /* v9.8.0 지휘망은 기본으로 명령할 때만 */")
open(F, 'w', encoding='utf-8').write(s)
print('page9200 OK')
