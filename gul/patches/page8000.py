# v8.0.0 페이지 — page8000.py v1.4 (v1.4: 띠의 맵 종류 자리에 층 이름 · v1.3: 결승 링에선 나가기 · 물러나기 단추 없음 · v1.2: 여정 판에 들어섬 로그 · 서술에서 '1F ·' 뺌 · v1.1: 그림 맵 그림 · 촛대 · 낙사는 여정이 켜졌을 때만 · v1.0: 30층 여정: run8_a.js · run8_b.js 를 붙이고 (MAPS8 = d5/maps8.json) · 그림 맵 바탕 · 판 끝 · 대화 '!r8:' · 캠페인 띠 · 로딩 · 버전)
import json
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7290.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.29.0 (2026-10-18)', '<!-- 굴의 전투판 v8.0.0 (2026-10-19)')
rep('     v7.29.0: ', '''     v8.0.0: 30층 여정 — 프롤로그 (1F) 를 마치면 ▼ 2층으로. 층마다 갈림길 지도 (싸움 · 정예 · 만남 · 쉼터 · 상인 · 보물 · 보스 · 고정) 를 골라 내려감.
         싸움 칸은 드라이브 5기의 그림 맵 (하수구 · 동굴 · 네온 · 요괴 · 지옥 · 마계 · 정령 · 기계천사 · 성전 · 옥상 · 공성 · 야전 · 차원 · 데이터 …) 위에서 — 들어온 자리 · 출구 계단 · 낮은 엄폐.
         층에 들어설 때 뽑기 세 장 (동료 · 유물) · 유물 18 · 여신의 눈물 ①②③ · 보스 (세르파 · 레지나 · 하딤/사슴 · 테이론 · 삼신) · 10층 · 20층 정산 (나감 / 계속) · 20층부터 MC 더 플링 · 결말 다섯.
     v7.29.0: ''')
rep('h1::after{content:" v7.29.0"', 'h1::after{content:" v8.0.0"')
rep('<footer>굴의 전투판 v7.29.0', '<footer>굴의 전투판 v8.0.0')
rep('return `굴의 전투판 v7.29.0 · ${title}', 'return `굴의 전투판 v8.0.0 · ${title}')
rep("copyText('굴의 전투판 v7.29.0 자동 판 기록", "copyText('굴의 전투판 v8.0.0 자동 판 기록")
rep("ver: '7.29.0', kind: '1F 여정 기록'", "ver: '8.0.0', kind: '1F 여정 기록'")
rep("o.push('굴의 전투판 v7.29.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.0.0 — 1F 프롤로그 여정 기록'")
rep('의 버전 기록에 — v7.29.0 싸움 바로잡기', '의 버전 기록에 — v8.0.0 30층 여정 (갈림길 지도 · 그림 맵 · 뽑기 · 유물 · 보스 · 정산 · 결말) / v7.29.0 싸움 바로잡기')
rep('">v7.29.0 · 싸움 바로잡기</span>', '">v8.0.0 · 30층 여정</span>')

# ---------- 그림 맵: 바탕 · 그림 ----------
rep("    if (S.room){ roomCell(g, x, y, P, R); continue; }",
    "    if (S.art8){ g.fillStyle = MAP.t[y * S.W + x] === 1 ? '#07060a' : '#1c1820'; g.fillRect(x * P, y * P, P, P); continue; }   /* v8.0.0 그림 맵: 바탕만 — 그림은 draw 에서 */\n"
    "    if (S.room){ roomCell(g, x, y, P, R); continue; }")
rep("  drawTerrain(g, P);   // v7.18", "  if (!S.art8) drawTerrain(g, P);   // v7.18   /* v8.0.0 그림 맵은 그림이 더미 · 엄폐 */")
rep("  if (S.hall && Wd.camp) drawCzRoom(Wd, ox, oy, ts);",
    "  if (S.hall && Wd.camp) drawCzRoom(Wd, ox, oy, ts);\n  if (S.art8 && Wd.camp && run8On()) drawArt8(Wd, ox, oy, ts);   /* v8.0.0 그림 맵 · 출구 */")
rep("  if (S.camp && !S.camp.end && Wd.camp && Wd.map){ const band", "  if (S.camp && !S.camp.end && Wd.camp && Wd.map && !S.art8 && !run8On()){ const band")

# ---------- 판 끝 · 결말 ----------
rep("function campOver(){\n  const W = world, C = S.camp; if (!C || C.end) return;",
    "function campOver(){\n  const W = world, C = S.camp; if (!C || C.end) return;\n  if (run8On()){ r8Over(); return; }   /* v8.0.0 30층 여정 */")
rep('<div class="row"><button class="btn go" type="button" id="campDone">',
    '<div class="row">${kind === \'clear\' && !C.run && !C.test ? \'<button class="btn go" type="button" id="campRun8" title="30층 여정 — 갈림길 지도를 골라 내려감 (10 · 20층 정산)">▼ 2층으로 — 30층 여정</button>\' : \'\'}<button class="btn${kind === \'clear\' && !C.run && !C.test ? \'\' : \' go\'}" type="button" id="campDone">')
rep("b.hidden = false; $('campDone').onclick = campQuit;", "b.hidden = false; $('campDone').onclick = campQuit; if ($('campRun8')) $('campRun8').onclick = r8Start;   /* v8.0.0 */")
rep("S.regina = false; S.zones = []; S.sandY = null; S.holdClear = false;", "S.regina = false; S.art8 = null; S.zones = []; S.sandY = null; S.holdClear = false;")

# ---------- 대화 '!r8:' · 이름 ----------
rep("function talkDo(a){\n", "function talkDo(a){\n  if (a.startsWith('!r8:')){ talkClose(); r8Act(a.slice(4)); return; }   /* v8.0.0 30층 여정 */\n")
rep("|| '' : '';   // v7.22.1 box", "|| '' : L.name || '';   // v7.22.1 box")

# ---------- 캠페인 띠 · 로딩 ----------
rep("  if (h !== campBarH || el.hidden){ campBarH = h;",
    "  if (run8On() && W){ const R = R8S(), nd = r8Node(R.at) || {}; h = h.replace(/^<b>1F · [^<]*<\\/b>/, `<b>${R.f}층 · ${esc((NODE8[nd.t] || {}).nm || '')}</b>`);   /* v8.0.0 30층 여정 */\n"
    "    h = h.replace(/<span class=\"ck\">[^<]*/, `<span class=\"ck\">${esc((F8[R.f] || {}).name || '')}${W.cleared ? ' · 🏳 끝난 맵' : ''}`);\n    if (W.duel) h = h.replace(/<button[^>]*data-cexit=\"[a-z]*\"[^>]*>[^<]*<\\/button>/g, '');\n    else if (S.art8){ h = W.cleared ? h.replace(/(<button[^>]*data-cexit=\"up\"[^>]*>)[^<]*/, '$1▼ 출구로') : h.replace(/<button[^>]*data-cexit=\"up\"[^>]*>[^<]*<\\/button>/, ''); if (!W.over && !/data-cexit=\"down\"/.test(h)) h = h.replace('<span class=\"cb\">', '<span class=\"cb\"><button class=\"btn sm\" type=\"button\" data-cexit=\"down\" title=\"들어온 자리로 물러남 (그 칸은 다시 고를 수 있어요)\">↩ 물러나기</button>'); } }\n"
    "  if (h !== campBarH || el.hidden){ campBarH = h;")
rep('<div class="lf">1F · 프롤로그</div>', '<div class="lf">${run8On() ? R8S().f + \'층 · 만남\' : \'1F · 프롤로그\'}</div>')

# ---------- 판마다 (촛대 · 낙사) ----------
rep("while (budget > 1e-9 && !world.over && world.t < world.turnEnd - 1e-6){ const s = Math.min(STEP, budget, world.turnEnd - world.t); stepWorld(world, s); budget -= s; }",
    "while (budget > 1e-9 && !world.over && world.t < world.turnEnd - 1e-6){ const s = Math.min(STEP, budget, world.turnEnd - world.t); stepWorld(world, s); budget -= s; if (world.r8 && run8On()) r8Tick(world); }   /* v8.0.0 촛대 · 옥상 낙사 */")

rep("🗺 1F · ${e.name} ${e.kind}", "🗺 ${e.r8 ? '' : '1F · '}${e.name} ${e.kind}")
rep("case 'campIn': return { c: 'dim', s: `1F · ${e.name} — ${e.kind}.` };", "case 'campIn': return { c: 'dim', s: `${e.r8 ? '' : '1F · '}${e.name} — ${e.kind}.` };")

# ---------- 모듈 ----------
M8 = json.load(open(D + 'd5/maps8.json', encoding='utf-8'))
A = open(D + 'run8_a.js', encoding='utf-8').read(); B = open(D + 'run8_b.js', encoding='utf-8').read()
assert A.count('/*MAPS8*/{}') == 1
A = A.replace('/*MAPS8*/{}', json.dumps(M8, ensure_ascii=False, separators=(',', ':')))
rep("setMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일",
    A + '\n' + B + "\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일")

open(F, 'w', encoding='utf-8').write(s)
print('page8000 OK maps', len(M8))
