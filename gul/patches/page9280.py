# v9.9.5 페이지 — page9280.py v1.0 (v1.0: 뭉침 = 태세 하나로 — 1명: 제자리 태세 (막기 · 버팀 ×1.25) · 2명 이상: 가장 단단한 이가 그 자리에 먼저 서고 나머지가 어깨에 붙음 · 이어서 판에 선을 그으면 (끌기) 그 선 길이에 몸 폭이 들어가는 만큼 앞줄 · 나머지는 휜 뒷줄 (끄는 동안 '앞줄 N명' 미리 보기) · 탭 = 그 자리로 · Esc 취소 · 휴대폰 막대는 그대로 (단추 글만 '선 긋기') · 휴대폰: 정찰 창이 손가락 아래에 뜨면 그 탭이 '살펴보기' 로 새던 것 (뜬 뒤 0.2초는 단추 무시) · 결승 직접 조작 K 막기 유지가 다시 됨 · 엔진 patch9240)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9270.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.9.4 (2026-10-25)', '<!-- 굴의 전투판 v9.9.5 (2026-10-25)')
rep('     v9.9.4: 모닝스타', '''     v9.9.5: 뭉침 = 태세 — 1명은 제자리 태세 · 여럿은 가장 단단한 이가 먼저 서고 옆에 붙음 · 선을 그으면 몸 폭대로 앞줄 (큰 몸은 넓게) · 나머지 휜 뒷줄 · 방패 · 튼튼한 이 앞 · 다친 이 뒤 (양쪽 편)
     v9.9.4: 모닝스타''')
for a, b in (('h1::after{content:" v9.9.4"', 'h1::after{content:" v9.9.5"'), ('<footer>굴의 전투판 v9.9.4', '<footer>굴의 전투판 v9.9.5'), ('return `굴의 전투판 v9.9.4 · ${title}', 'return `굴의 전투판 v9.9.5 · ${title}'),
             ("copyText('굴의 전투판 v9.9.4 자동 판 기록", "copyText('굴의 전투판 v9.9.5 자동 판 기록"), ("o.push(`굴의 전투판 v9.9.4 — ${C.run", "o.push(`굴의 전투판 v9.9.5 — ${C.run"),
             ('의 버전 기록에 — v9.9.4 모닝스타', '의 버전 기록에 — v9.9.5 뭉침 = 태세 / v9.9.4 모닝스타'),
             ('">v9.9.4 모닝스타 사거리 원 · 빼꼼 사격 · 지원 추종', '">v9.9.5 뭉침 = 태세 (선 긋기) · 모닝스타 사거리 원 · 빼꼼 사격 · 지원 추종'),
             ("ver: '9.9.4', kind:", "ver: '9.9.5', kind:"), ("RULES_MIG = '9.9.4',", "RULES_MIG = '9.9.5',")):
    rep(a, b)
# 상태
rep("let sel = new Set(), hudT = 0, boxSel = null,", "let clumpLine = null, clDraw = null;   /* v9.9.5 뭉침 선 긋기 */\nlet sel = new Set(), hudT = 0, boxSel = null,")
# 단추 글
rep('data-ord="clump" title="돌격 방어 — 고른 무리가 어깨를 붙여 적 쪽으로 섬 (근접 앞줄 · 사수 뒷줄 · 막기를 든 채). 붙어 있을수록 돌격에 덜 밀림 · 대신 사선이 좁아지고 옆 · 뒤 · 범위 공격에 약함">🧱 뭉침</button>',
    'data-ord="clump" title="뭉침 = 태세 — 1명: 제자리에서 막기를 든 채 버팀 (돌격에 ×1.25). 여럿: 가장 단단한 이가 그 자리에 먼저 서고 나머지가 어깨에 붙음 · 이어서 판에 선을 그으면 그 길이만큼 앞줄 (몸 폭대로) · 나머지는 뒷줄. 방패 · 튼튼한 이 앞 · 다친 이 · 사수 뒤. 옆 · 뒤 · 범위 공격에 약함">🧱 ${clumpLine ? \'선을 그으세요…\' : L.length === 1 ? \'태세\' : \'뭉침\'}</button>')
rep('<span class="ic">🧱</span>뭉침<small>돌격 방어</small></button>`', '<span class="ic">🧱</span>${L.length === 1 ? \'태세\' : \'뭉침\'}<small>${clumpLine ? \'선 긋기\' : \'돌격 방어\'}</small></button>`')
rep("  if (o && o[0] === 'clump') return '🧱 뭉침 (돌격 방어)';", "  if (o && o[0] === 'clump') return '🧱 뭉침 · 태세 (돌격 방어)';")
# 명령
rep("""  else if (k === 'clump'){ const C = L.filter(u => !u.crawl && !u.down); if (!C.length) return; const cx = C.reduce((a, u) => a + u.x, 0) / C.length, cy = C.reduce((a, u) => a + u.y, 0) / C.length;   /* v9.7.2 뭉침 (돌격 방어) */""",
    """  else if (k === 'clump'){ const C = L.filter(u => !u.crawl && !u.down); if (!C.length) return; const T0 = C.slice().sort((a, b) => (isFar(a) - isFar(b)) || clumpTough(b) - clumpTough(a))[0], cx = T0.x, cy = T0.y;   /* v9.9.5 뭉침 = 태세: 가장 단단한 이 자리에 먼저 섬 */""")
rep("""    C.forEach((u, j) => { u.order = { k: 'clump', g, j, x: cx, y: cy, f: fa }; u.stay = null; }); noteOrders(C, 'user', '뭉침 (돌격 방어)'); toast(`🧱 ${C.map(u => u.name).join(' · ')} — 어깨를 붙여 ${F ? F.name + ' 쪽으로' : '앞으로'} 섬 (다른 명령을 주면 풀림)`); }""",
    """    C.forEach((u, j) => { u.order = { k: 'clump', g, j, x: cx, y: cy, f: fa }; u.stay = null; });
    if (C.length === 1){ clumpLine = null; noteOrders(C, 'user', '태세 (제자리 돌격 방어)'); toast(`🧱 ${C[0].name} — 제자리 태세: 막기를 든 채 ${F ? F.name + ' 쪽으로' : '앞으로'} 버팀 (다른 명령을 주면 풀림)`); }
    else { clumpLine = { g, ids: C.map(u => u.i), fa }; noteOrders(C, 'user', '뭉침 (돌격 방어)'); toast(`🧱 ${T0.name} 자리에 뭉침 — 판에 선을 그으면 그 선에 맞춰 섬`); } }""")
# 도우미: 선 미리 보기 · 적용
rep("function ordKey(k){", "function ordKey(k){\n  if (k !== 'clump' && clumpLine){ clumpLine = null; clDraw = null; }   /* v9.9.5 다른 명령이면 선 긋기 끔 */")
rep("const seenFoe = (u, see) =>", """// v9.9.5 뭉침 선: 앞줄 사람 수 (엔진 clumpStep 과 같은 셈 — 단단한 순 · 다친 이 · 사수 빼고 · 몸 폭 2r + 0.03)
function clumpFront(ids, len){ const M = ids.map(i => world.units[i]).filter(u => u && u.alive && !u.down && !isFar(u) && u.hp >= u.max * 0.5).sort((a, b) => clumpTough(b) - clumpTough(a)); let s = 0, n = 0; for (const m of M){ const w = m.r * 2 + 0.03; if (n && s + w > len + 0.15) break; s += w; n++; } return Math.max(M.length ? 1 : 0, n); }
function clumpApply(a, b){ const C = clumpLine; clumpLine = null; clDraw = null; if (!C || !world) return; const U = C.ids.map(i => world.units[i]).filter(u => u && u.alive && u.order && u.order.k === 'clump' && u.order.g === C.g); if (!U.length) return;
  const len = Math.hypot(b.x - a.x, b.y - a.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  let f = C.fa; if (len >= 0.8){ const n1 = Math.atan2(b.y - a.y, b.x - a.x) - Math.PI / 2, F = world.units.filter(q => q.alive && q.side !== 0 && !q.gone && q.seenBy).sort((p, q) => Math.hypot(p.x - mx, p.y - my) - Math.hypot(q.x - mx, q.y - my))[0], ref = F ? Math.atan2(F.y - my, F.x - mx) : C.fa; f = angDiff(n1, ref) <= Math.PI / 2 ? n1 : n1 + Math.PI; }
  U.forEach(u => { u.order = { ...u.order, x: mx, y: my, f, ...(len >= 0.8 ? { len } : {}) }; if (len < 0.8) delete u.order.len; });
  noteOrders(U, 'user', len >= 0.8 ? '뭉침 (선)' : '뭉침 (그 자리로)'); toast(len >= 0.8 ? `🧱 선 ${len.toFixed(1)}칸 — 앞줄 ${clumpFront(C.ids, len)}명 · 나머지 뒷줄` : '🧱 그 자리로 모여 뭉침'); hud(); }
const seenFoe = (u, see) =>""")
# 그리기
rep("  if (boxSel){ const x = Math.min(boxSel.x0, boxSel.x1),", """  if (clDraw && clumpLine){ const ax = ox + clDraw.a.x * ts, ay = oy + clDraw.a.y * ts, bx = ox + clDraw.b.x * ts, by = oy + clDraw.b.y * ts, len = Math.hypot(clDraw.b.x - clDraw.a.x, clDraw.b.y - clDraw.a.y);   /* v9.9.5 뭉침 선 */
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(10,8,12,.8)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.strokeStyle = '#d9a94e'; ctx.lineWidth = 4; ctx.stroke();
    ctx.font = '700 12px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffe2b0'; ctx.fillText(len >= 0.8 ? `🧱 앞줄 ${clumpFront(clumpLine.ids, len)}명 · ${len.toFixed(1)}칸` : '🧱 그 자리로', (ax + bx) / 2, (ay + by) / 2 - 10); ctx.restore(); }
  if (boxSel){ const x = Math.min(boxSel.x0, boxSel.x1),""")
# 포인터
rep("  if (pd.touch && armedNow() && !boxArm) pd.armed = true;", "  if (clumpLine && mode !== 'edit' && e.button === 0){ pd.cl = true; pd.box = false; pd.armed = false; clDraw = { a: w, b: w }; clearTimeout(lpT); return; }   /* v9.9.5 뭉침 선 긋기 */\n  if (pd.touch && armedNow() && !boxArm) pd.armed = true;")
rep("  if (pd.fan){ fanDrag(e.clientX - pd.x, e.clientY - pd.y); return; }   // v5.9.0", "  if (pd.cl){ if (Math.hypot(e.clientX - pd.x, e.clientY - pd.y) >= 6) pd.moved = true; if (clDraw) clDraw.b = toWorld(e.clientX, e.clientY); return; }   /* v9.9.5 */\n  if (pd.fan){ fanDrag(e.clientX - pd.x, e.clientY - pd.y); return; }   // v5.9.0")
rep("  if (d.fan){ fanRelease(); return; }   // v5.9.0", "  if (d.cl){ const a = clDraw ? clDraw.a : toWorld(d.x, d.y), b = d.moved ? toWorld(e.clientX, e.clientY) : a; clumpApply(a, b); return; }   /* v9.9.5 */\n  if (d.fan){ fanRelease(); return; }   // v5.9.0")
# 취소
rep("  if (k === 'pickx'){ relPick = null; boxArm = false;", "  if (k === 'pickx'){ clumpLine = null; clDraw = null; relPick = null; boxArm = false;")
rep("  if (k === 'escape' && mode !== 'edit'){ ", "  if (k === 'escape' && mode !== 'edit' && clumpLine){ clumpLine = null; clDraw = null; toast('선 긋기를 껐어요 (뭉침은 그대로)'); hud(); return; }   /* v9.9.5 */\n  if (k === 'escape' && mode !== 'edit'){ ")
rep("me.guardMode = me.guardMode === 'hold' ? 'auto' : 'hold';", "me.guardMode = me.guardMode === 'hold' ? 'auto' : 'hold'; me.ctlHold = me.guardMode === 'hold';   /* v9.9.5 직접 조작의 막기 유지 */")
rep("  box.hidden = false; hud();\n}\nfunction askScoutDone(pol){", "  box.hidden = false; window.__askT = performance.now(); hud();   /* v9.9.5 휴대폰: 판을 누른 그 탭이 창 단추로 새지 않게 */\n}\nfunction askScoutDone(pol){")
rep("$('ask').addEventListener('click', e => { const b = e.target.closest('[data-pol]'); if (b) askScoutDone(b.dataset.pol); });", "$('ask').addEventListener('click', e => { const b = e.target.closest('[data-pol]'); if (b && !(performance.now() - (window.__askT || 0) < 200)) askScoutDone(b.dataset.pol); });")
open(F, 'w', encoding='utf-8').write(s)
print('page9280 OK')
