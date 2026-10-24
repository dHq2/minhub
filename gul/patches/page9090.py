# v9.6.0 페이지 — page9090.py v1.1 (v1.1: 암계 역장 (hard 방벽) 의 모습 — 보랏빛 어두운 장 · 마름모 룬이 흐름 · 이름표 '암계 역장' (예전엔 정령 방벽의 파란 물방울 · 이름) · v1.0: 되돌아가기 (명세 C1) — 지나친 야전의사 (천막) · 오딜의 방으로 한 번 되돌아갔다 올 수 있음: 그 칸 바로 뒤 한 칸을 마친 뒤 층 지도에 '↩ 되돌아가기' · 낙사 · 계단 · 보스 · 정예 칸에서는 못 돌아감 (못 가는 맵) · 다녀오면 뒤 칸의 다음 칸으로 이어짐)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9080.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.5.2 (2026-10-24)', '<!-- 굴의 전투판 v9.6.0 (2026-10-24)')
rep('     v9.5.2: 사람 ❓', '''     v9.6.0: 되돌아가기 (명세 C1) — 지나친 야전의사 (천막) · 오딜의 방으로 한 번 되돌아갔다 올 수 있음: 그 칸 바로 뒤 한 칸을 마친 뒤 층 지도에 "↩ 되돌아가기" 가 뜸 (낙사 · 계단 · 보스 · 정예 · 잠긴 칸은 못 돌아가는 맵) · 다녀오면 그 뒤 칸의 다음 칸으로 이어짐 (뒤 칸을 다시 싸우지 않음) · 한 번뿐
     v9.5.2: 사람 ❓''')
for a, b in (('h1::after{content:" v9.5.2"', 'h1::after{content:" v9.6.0"'), ('<footer>굴의 전투판 v9.5.2', '<footer>굴의 전투판 v9.6.0'), ('return `굴의 전투판 v9.5.2 · ${title}', 'return `굴의 전투판 v9.6.0 · ${title}'),
             ("copyText('굴의 전투판 v9.5.2 자동 판 기록", "copyText('굴의 전투판 v9.6.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.5.2 — ${C.run", "o.push(`굴의 전투판 v9.6.0 — ${C.run"),
             ('의 버전 기록에 — v9.5.2 두건의 왕관 대사', '의 버전 기록에 — v9.6.0 되돌아가기 / v9.5.2 두건의 왕관 대사'),
             ('">v9.5.2 · 두건의 왕관 대사 · 암계 장비 그림 · 심계 제3세력</span>', '">v9.6.0 · 되돌아가기 · 사람 만남은 비전투 맵 · 심계 제3세력</span>'),
             ("ver: '9.5.2', kind:", "ver: '9.6.0', kind:"), ("RULES_MIG = '9.5.2',", "RULES_MIG = '9.6.0',")):
    rep(a, b)
# 표시: 야전의사 (천막) · 오딜의 방을 되돌아갈 수 있는 칸으로
rep("function r8PeaceMap(n, key){\n  const R = R8S(), F = F8[R.f] || {};", "function r8PeaceMap(n, key){\n  const R = R8S(), F = F8[R.f] || {}; if (key === 'tent') n.rv8 = true;   /* v9.6.0 되돌아갈 수 있는 칸 (야전의사) */")
rep("function r8NpcNode(n, k){\n  const C = S.camp, R = R8S(); r8Hide();", "function r8NpcNode(n, k){\n  const C = S.camp, R = R8S(); r8Hide(); if (k === 'odile') n.rv8 = true;   /* v9.6.0 오딜의 방 */")
# 들어갈 때: 바로 앞 칸이 되돌아갈 수 있는 칸이면 기록
rep("function r8Enter(n){\n  const R = R8S(); if (!R || !n) return; r8Sel = null; R.at = n.id;",
    """/* v9.6.0 되돌아가기: 못 가는 맵 (낙사 · 계단 · 보스 · 정예 · 잠김) 이 아닌 칸만 */
const r8OneWay = n => !n || n.t === 'boss' || n.t === 'elite' || n.t === 'stairs' || n.stair || n.lock || n.champ || /boss/.test(n.src8 || '') || !!(MAPS8[n.src8] && (MAPS8[n.src8].fall || MAPS8[n.src8].stairs));
const r8BackNode = () => { const R = R8S(); if (!R || !R.bk || R.bk.used || R.at !== R.bk.y || !R.done.includes(R.at)) return null; const X = r8Node(R.bk.x), Y = r8Node(R.bk.y); return X && Y && X.rv8 && !r8OneWay(Y) ? X : null; };
function r8Enter(n){
  const R = R8S(); if (!R || !n) return; r8Sel = null; { const pv = R.at ? r8Node(R.at) : null;   /* v9.6.0 */
    if (pv && pv.rv8 && pv.next.includes(n.id) && !(R.rv && R.rv.x === pv.id)) R.bk = { x: pv.id, y: n.id }; else if (R.bk && R.bk.y !== n.id && R.bk.x !== n.id) R.bk = null;
    if (R.rv && n.id !== R.rv.x) R.rv = null; }
  R.at = n.id;""")
rep("  return cur ? cur.next.slice() : R.fm.rows[0].map(n => n.id); }", "  if (R.rv && cur && cur.id === R.rv.x){ const Y = r8Node(R.rv.y); if (Y) return Y.next.slice(); }   /* v9.6.0 되돌아갔다 온 뒤 — 뒤 칸의 다음 칸으로 */\n  return cur ? cur.next.slice() : R.fm.rows[0].map(n => n.id); }")
rep("const on = R.done.includes(n.id) && (R.at === n.id || r8Passed()) && av.includes(id);", "const on = R.done.includes(n.id) && (R.at === n.id || (R.rv && R.rv.y === n.id) || r8Passed()) && av.includes(id);")
rep("<div class=\"r8go\">${r8Sel && av.includes(r8Sel)", "<div class=\"r8go\">${(() => { const X = r8BackNode(); return X ? `<button class=\"btn go\" type=\"button\" data-r8=\"back\" title=\"지나친 곳으로 한 번 되돌아갔다 올 수 있어요 (그 칸의 만남을 다시 · 다녀오면 이어서 갈 수 있어요)\">↩ ${esc(X.npc8 === 'tent' ? '야전병원' : X.enc === 'odile' ? '오딜의 방' : '지난 칸')}으로 되돌아가기</button>` : ''; })()}${r8Sel && av.includes(r8Sel)")
rep("  if (k === 'up' || k === 'down'){ const R = R8S(); if (R) r8FloorGo(R.f + (k === 'up' ? -1 : 1)); return; }",
    "  if (k === 'back'){ const X = r8BackNode(), R = R8S(); if (!X) return; R.bk.used = 1; R.rv = { x: X.id, y: R.bk.y }; save(); toast('↩ 되돌아간다'); r8Enter(X); return; }   /* v9.6.0 */\n  if (k === 'up' || k === 'down'){ const R = R8S(); if (R) r8FloorGo(R.f + (k === 'up' ? -1 : 1)); return; }")
rep("  delete M[g]; R.f = g; R.fm = K.fm;", "  R.bk = null; R.rv = null;   /* v9.6.0 층을 옮기면 되돌아가기 기록 비움 */\n  delete M[g]; R.f = g; R.fm = K.fm;")
# 암계 역장의 모습 (명세 D5 — 정령 방벽의 파란 물 대신 어두운 보랏빛 장)
rep("      ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(110,190,255,.35)'; ctx.lineWidth = Math.max(8, ts * 0.45); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();\n      ctx.strokeStyle = `rgba(${rim},.9)`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();\n      ctx.strokeStyle = 'rgba(220,240,255,.6)'; ctx.lineWidth = 1.2; for (let k = 0; k < 4; k++){ const q = ((now * 0.8 + k * 0.25) % 1), px = x0 + (x1 - x0) * q, py = y0 + (y1 - y0) * q; ctx.beginPath(); ctx.arc(px, py, ts * 0.12, 0, 6.283); ctx.stroke(); } }",
    """      if (F.hard){ const nx = F.nx || 0, ny = F.ny || 0;   /* v9.6.0 암계 역장: 어두운 보랏빛 장 · 양쪽 가장자리 빛 · 마름모 룬이 선을 따라 흐름 */
        ctx.lineCap = 'butt'; const g = ctx.createLinearGradient(x0 - nx * ts * 0.5, y0 - ny * ts * 0.5, x0 + nx * ts * 0.5, y0 + ny * ts * 0.5); g.addColorStop(0, 'rgba(80,30,140,0)'); g.addColorStop(0.5, 'rgba(90,40,160,.55)'); g.addColorStop(1, 'rgba(80,30,140,0)');
        ctx.save(); ctx.translate(0, 0); ctx.strokeStyle = 'rgba(70,24,120,.5)'; ctx.lineWidth = Math.max(10, ts * 0.6); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
        ctx.lineCap = 'round'; ctx.strokeStyle = `rgba(${F.side === 0 ? '190,150,255' : '230,110,150'},.95)`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.strokeStyle = 'rgba(235,215,255,.7)'; ctx.lineWidth = 1.3; const len = Math.hypot(x1 - x0, y1 - y0), nR = Math.max(3, Math.round(len / (ts * 0.9)));
        for (let k = 0; k < nR; k++){ const q = ((now * 0.35 + k / nR) % 1), px = x0 + (x1 - x0) * q, py = y0 + (y1 - y0) * q, d = ts * 0.14; ctx.beginPath(); ctx.moveTo(px, py - d); ctx.lineTo(px + d, py); ctx.lineTo(px, py + d); ctx.lineTo(px - d, py); ctx.closePath(); ctx.stroke(); } }
      else {
      ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(110,190,255,.35)'; ctx.lineWidth = Math.max(8, ts * 0.45); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = `rgba(${rim},.9)`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = 'rgba(220,240,255,.6)'; ctx.lineWidth = 1.2; for (let k = 0; k < 4; k++){ const q = ((now * 0.8 + k * 0.25) % 1), px = x0 + (x1 - x0) * q, py = y0 + (y1 - y0) * q; ctx.beginPath(); ctx.arc(px, py, ts * 0.12, 0, 6.283); ctx.stroke(); } } }""")
rep("const t = `${SF_NM[F.k] || F.k} ${Math.ceil(left)}초`", "const t = `${F.k === 'wall' && F.hard ? '🛡 암계 역장' : SF_NM[F.k] || F.k} ${Math.ceil(left)}초`")
open(F, 'w', encoding='utf-8').write(s)
print('page9090 OK')
