# v7.24.3 페이지 — page7243.py v1.0 (PC 전열: 오른쪽 명령 칸의 '전열' 단추를 늘 보이게 (근접 둘 넘게 고를 때만 보이던 것) · 아래 기술 막대에도 '▬ 전열 (L)' · '🛡 전열 후퇴 (K)' ·
#   모바일 조작판도 늘 · 지원 (사수 · 치유) 이 전열 뒤를 따라다니는 모습 (전열 가운데까지 점선 · '지원' 표) · 명령 이름 '전열 지원' · 안내 글)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7242.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.24.2 (2026-10-18)', '<!-- 굴의 전투판 v7.24.3 (2026-10-18)')
rep('     v7.24.2: ', '''     v7.24.3: PC 전열 — 오른쪽 명령 칸의 '전열' 을 늘 보임 (근접 둘 넘게 고를 때만 보이던 것) · 아래 기술 막대에도 '▬ 전열 (L)' · '🛡 전열 후퇴 (K)' · 모바일 조작판도 늘.
         전열 지원: 사수 · 치유가 전열 참여를 받으면 전열 뒤 제 자리 (사수 = 양 끝 뒤 비스듬히 — 사선이 트임 · 치유 = 가운데 뒤) 를 계속 지키며 따라다니고, 그 자리에서 쏘고 치료함 (전열 가운데까지 점선 · '지원' 표).
     v7.24.2: ''')
rep('h1::after{content:" v7.24.2"', 'h1::after{content:" v7.24.3"')
rep('<footer>굴의 전투판 v7.24.2', '<footer>굴의 전투판 v7.24.3')
rep('return `굴의 전투판 v7.24.2 · ${title}', 'return `굴의 전투판 v7.24.3 · ${title}')
rep("copyText('굴의 전투판 v7.24.2 자동 판 기록", "copyText('굴의 전투판 v7.24.3 자동 판 기록")
rep('의 버전 기록에 — v7.24.2 근력 · 괴력', '의 버전 기록에 — v7.24.3 PC 전열 · 전열 지원 / v7.24.2 근력 · 괴력')
rep('">v7.24.2 · 근력 · 괴력</span>', '">v7.24.3 · PC 전열 · 전열 지원</span>')
rep("ver: '7.24.2', at:", "ver: '7.24.3', at:")
# 오른쪽 명령 칸 · 모바일 조작판: 늘
rep("${L.filter(u => !isFar(u)).length >= 2 ? `<button class=\"btn\" type=\"button\" data-ord=\"line\" title=\"고른 근접이 자석처럼 나란히 붙어 적 쪽을 봄 · 같이 고른 사수 · 의무는 가운데 뒤로\">전열 <kbd>L</kbd></button>` : ''}",
    "<button class=\"btn\" type=\"button\" data-ord=\"line\" title=\"근접은 자석처럼 나란히 붙어 적 쪽을 봄 · 사수는 전열 양 끝 뒤 (사선이 트임) · 치유는 가운데 뒤 — 지원은 전열을 따라다니며 쏘고 치료함\">▬ 전열 <kbd>L</kbd></button>")
rep("+ (melee >= 2 ? `<button type=\"button\" class=\"db\" data-dk=\"line\"><span class=\"ic\">▬</span>전열</button>` : '')",
    "+ `<button type=\"button\" class=\"db\" data-dk=\"line\"><span class=\"ic\">▬</span>전열<small>${melee ? '' : '지원'}</small></button>`")
# 아래 기술 막대: 전열 · 전열 후퇴
rep("  if (html !== skbarHtml){ skbarHtml = html; el.innerHTML = html; }",
    """  const lr = L.find(u => lretLine(Wd, u)), cmd = L.length ? `<span class="sksep"></span><button type="button" class="sk cmd ${L.length && L.every(u => u.order && u.order.k === 'line') ? 'on' : ''}" data-cmd="line" title="전열 (L) — 근접은 나란히 · 사수는 양 끝 뒤 · 치유는 가운데 뒤에서 따라다니며 지원"><kbd>L</kbd><span class="ic">▬</span><span class="nm">전열</span><span class="sb">${L.some(u => !isFar(u) && u.cls !== '치유') ? (L.some(u => isFar(u) || u.cls === '치유') ? '근접 · 지원' : '나란히') : '지원 (뒤에서)'}</span></button>${lr ? `<button type="button" class="sk cmd ${armed && armed.k === 'lret' ? 'on' : ''}" data-cmd="lret" title="전열 후퇴 (K) — 전열째로 방패를 든 채 물러섬"><kbd>K</kbd><span class="ic">🛡</span><span class="nm">전열 후퇴</span><span class="sb">${(lretLine(Wd, lr) || { ids: [] }).ids.length}마디</span></button>` : ''}` : '';   /* v7.24.3 PC 전열 단추 */
  html += cmd;
  if (html !== skbarHtml){ skbarHtml = html; el.innerHTML = html; }""")
rep("  const html = `<div class=\"who\">${who}</div>` + slotOrder(Wd, L).map(", "  let html = `<div class=\"who\">${who}</div>` + slotOrder(Wd, L).map(")
rep("$('skbar').addEventListener('click', e => { const b = e.target.closest('[data-sk]');", "$('skbar').addEventListener('click', e => { const c = e.target.closest('[data-cmd]'); if (c && world && !world.over){ ordKey(c.dataset.cmd); renderSkillBar(world); return; }   /* v7.24.3 전열 · 전열 후퇴 */\n  const b = e.target.closest('[data-sk]');")
rep(".sk.off{opacity:.32;cursor:default}", ".sk.off{opacity:.32;cursor:default}\n.skbar .sksep{width:1px;align-self:stretch;background:#3a3240;margin:0 2px}   /* v7.24.3 */\n.sk.cmd{border-color:#5a7896;background:#141c26}.sk.cmd .nm{color:#cfe6ff}")
# 명령 이름
rep("  if (o[0] === 'lineJoin') return '전열 참여';", "  if (o[0] === 'lineJoin') return o[1] ? '전열 지원' : '전열 참여';   /* v7.24.3 */")
rep("u.order && u.order.k === 'line' && u.order.join ? ['lineJoin'] :", "u.order && u.order.k === 'line' && u.order.join ? ['lineJoin', u.order.sup ? 1 : 0] :")
rep("o.k === 'line' && o.join ? ['▬ 전열 참여', '#9fd0ff']", "o.k === 'line' && o.join ? [o.sup ? '▬ 전열 지원' : '▬ 전열 참여', '#9fd0ff']")
# 그림: 지원이 따라가는 전열 가운데까지 점선 · '지원' 표
rep("function drawBattleLines(Wd, ox, oy, ts, see){\n  ctx.save(); ctx.setLineDash([]); ctx.lineCap = 'round';",
    """function drawBattleLines(Wd, ox, oy, ts, see){
  ctx.save(); ctx.setLineDash([]); ctx.lineCap = 'round';
  for (const u of Wd.units){ if (!u.alive || u.side !== 0 || !u.supAt || !u.order || u.order.k !== 'line' || !u.order.join) continue;   /* v7.24.3 전열 지원: 전열 가운데까지 점선 · 지원 표 */
    const x0 = ox + u.x * ts, y0 = oy + u.y * ts, x1 = ox + u.supAt.x * ts, y1 = oy + u.supAt.y * ts; ctx.strokeStyle = 'rgba(140,200,255,.55)'; ctx.lineWidth = 1.6; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([]);
    if (ts >= 22){ const t = isFar(u) ? '지원 · 사격' : '지원 · 치료', y = y0 + u.r * ts + 15; ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width; ctx.fillStyle = 'rgba(10,14,22,.82)'; ctx.fillRect(x0 - tw / 2 - 4, y - 7, tw + 8, 14); ctx.fillStyle = '#9fd0ff'; ctx.fillText(t, x0, y); } }""")
# 전열 참여 안내
rep("  toast(`${C.map(u => u.name).join(' · ')} 전열 참여 — 가까운 전열에 붙어 자리를 지킴${C.some(u => !isFar(u) && u.rng >= 0.9) ? ' · 창은 뒷줄' : ''}${C.some(isFar) ? ' · 사수는 전열 뒤' : ''}`);",
    "  toast(`${C.map(u => u.name).join(' · ')} 전열 참여 — 가까운 전열에 붙어 자리를 지킴${C.some(u => !isFar(u) && u.rng >= 0.9) ? ' · 창은 뒷줄' : ''}${C.some(isFar) ? ' · 사수는 전열 양 끝 뒤에서 따라다니며 쏨' : ''}${C.some(u => u.cls === '치유') ? ' · 치유는 가운데 뒤에서 따라다니며 치료' : ''}`);   /* v7.24.3 */")
open(F, 'w', encoding='utf-8').write(s)
print('ok')
