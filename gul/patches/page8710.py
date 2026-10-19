# v8.7.1 페이지 — page8710.py v1.5 (v1.5: 도감 카드는 묶음 그림 (cardatlas.json 을 넣음) · 대화 줄마다 r8CardShow · v1.4: 맵 장치 (run8_h v1.6 · run8_i v1.4 — 돌벽 · 두 맵 잇기 · 봉인된 출구 · 진지 설비) 를 v8.7.1 에 함께 · v1.3: 노라의 짐 r8NoraLoot · 페흐토가 죽었거나 동료면 유적의 페흐토 안 나옴 · v1.2: 맵 위 NPC 대화 이름띠는 줄의 이름 · v1.1: 장면 배경 bg_tehera · bg_aitem 을 build/art/room 으로 · v1.0: 인카운터 · 맵 위 NPC — page8700.py 를 먼저 돌린 뒤: run8_i.js (맵 위 상시 NPC · 손님 · 항복 · 도감 조우 카드 212 · 이름 있는 만남 20 · 히든 층) 를 붙이고 · 판 안 장면 인물 (stage 1) · 판 안 대화는 지도로 가지 않음 · 영입은 판에 바로 · 만남 x: / c: 갈래 · 단달로의 저택 약속 · 정예 전용 유물 · 항복 뒤 대화 · 판 번호 8.7.1)
import subprocess, json
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8700.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v8.7.0 (2026-10-19)', '<!-- 굴의 전투판 v8.7.1 (2026-10-19)')
rep('     v8.7.0: ', '''     v8.7.1: 인카운터 · 맵 위 NPC — 싸움판 구석의 상시 NPC (야전병원 천막 · 로지나 · 대장장이 · 셰도르 · 노라 · 왐 · 마리와 와킨 · 아이텐 · 아해) · 숨었다가 싸움이 끝나면 나옴 · 손님 (로지나는 위험하면 튐 · 셰도르) · 항복 (아해 · 페흐토 — 죽이면 끝 · 살리면 영입) · 도감 조우 카드 212장 · 이름 있는 만남 20 (장작방 · 고독방 · 붉은 소녀 · 치킨룸 · 해변 · 행성 · 지껄이는 입 · 신성 오딜 · 갈대밭 · 유적의 페흐토 · 호수 유적 · 가뮤 · 지식의 나선 · 단달로 저택 · 인공천사 벨 · 러버덕 · 광대 마카로니 · 노란악마 · 테헤라 · 아템) · 히든 층 (하르겐의 성당 · 과거의 칼데라) · 맵 장치 (구획 안 돌벽 토막 · 두 맵을 이은 싸움판 · 봉인된 출구 퍼즐 · 진지 설비 포대 — 팩션 보급 · 움직이지 않음 · 부술 수 있음) · 비전투 맵은 대장이 나가면 모두 · 대화 그림 (벨 · 딸기 · 옐로 · 로지나 · 아해 · 간호사장 · 파비)
     v8.7.0: ''')
for a, b in (('h1::after{content:" v8.7.0"', 'h1::after{content:" v8.7.1"'), ('<footer>굴의 전투판 v8.7.0', '<footer>굴의 전투판 v8.7.1'), ('return `굴의 전투판 v8.7.0 · ${title}', 'return `굴의 전투판 v8.7.1 · ${title}'),
             ("copyText('굴의 전투판 v8.7.0 자동 판 기록", "copyText('굴의 전투판 v8.7.1 자동 판 기록"), ("ver: '8.7.0', kind: '1F 여정 기록'", "ver: '8.7.1', kind: '1F 여정 기록'"),
             ("o.push('굴의 전투판 v8.7.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.7.1 — 1F 프롤로그 여정 기록'"),
             ('의 버전 기록에 — v8.7.0 여정 구조 v2', '의 버전 기록에 — v8.7.1 인카운터 · 맵 위 NPC / v8.7.0 여정 구조 v2'),
             ('">v8.7.0 · 여정 구조 v2</span>', '">v8.7.1 · 인카운터 · 맵 위 NPC · 맵 장치</span>'),
             ("RULES_MIG = '8.7.0'", "RULES_MIG = '8.7.1'")):
    rep(a, b)
# 장면 인물: 여정 싸움판 (stage 1) 에도
rep("function encCur(){ const C = S.camp; if (!C || C.end || !world || !world.camp || C.s !== 3) return null; const E = ((C.stages || {})[3] || {}).enc;",
    "function encCur(){ const C = S.camp; if (!C || C.end || !world || !world.camp || (C.s !== 3 && !(C.s === 1 && world.r8))) return null; const E = ((C.stages || {})[C.s] || {}).enc;   /* v8.7.1 맵 위 NPC (stage 1) */")
rep("function encAll(){ const E = encCur(); if (!E) return []; const st = S.camp.stages[3];", "function encAll(){ const E = encCur(); if (!E) return []; const st = S.camp.stages[S.camp.s];")
# 판 안 대화는 지도로 가지 않음 · 영입은 판에 바로
rep("  const done = () => r8NodeDone(), say = (L, then) =>", "  const done = () => (typeof r8InMap === 'function' && r8InMap()) ? campBarRender(true) : r8NodeDone(), say = (L, then) =>")
rep("if (!p){ then && then(); return; } p = { ...p, id: uid(), side: 0 }; R.party.push(p); save();",
    "if (!p){ then && then(); return; } p = { ...p, id: uid(), side: 0 }; if (typeof r8InMap === 'function' && r8InMap()) r8PutIn(p); else R.party.push(p); save();   /* v8.7.1 판 안이면 판에 바로 */")
rep("  $('r8shopX').onclick = () => r8NodeDone();", "  $('r8shopX').onclick = () => { if (typeof r8InMap === 'function' && r8InMap()){ r8Hide(); paused = false; campBarRender(true); } else r8NodeDone(); };   /* v8.7.1 맵 위 아이텐 */")
rep("    else if (it.k === 'heal'){ for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, (p.hpNow != null ? p.hpNow : mx) + Math.round(mx * 0.3)); } }",
    "    else if (it.k === 'heal'){ for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, (p.hpNow != null ? p.hpNow : mx) + Math.round(mx * 0.3)); } if (typeof r8InMap === 'function' && r8InMap()) for (const u of world.units) if (u.side === 0 && u.alive) u.hp = Math.min(u.max, u.hp + u.max * 0.3); }")
# 만남: x: 이름 있는 만남 · c: 도감 카드 · 로지나가 약속한 단달로의 저택
rep("  const k = n.enc || (n.enc = r8WPick(L.map(x => [x[0], x[1]]))); save();\n  if (!k.startsWith('t:')){ r8NpcNode(n, k); return; }",
    "  if (!n.enc && (R.flags || {}).dandal) n.enc = 'x:dandal';   /* v8.7.1 */\n  const k = n.enc || (n.enc = r8WPick(L.map(x => [x[0], x[1]]))); save();\n  if (k.startsWith('x:')){ r8XEvent(n, k.slice(2)); return; } if (k.startsWith('c:')){ r8Card(n); return; }   /* v8.7.1 */\n  if (!k.startsWith('t:')){ r8NpcNode(n, k); return; }")
# 유적의 페흐토: 죽였거나 동료 · 죽은 뒤엔 안 나옴
rep("!(k === 'lost' && !(S.camp.lostP || []).length));", "!(k === 'lost' && !(S.camp.lostP || []).length) && !(k === 'x:pehtoR' && ((R.flags || {}).pehtoDead || have.has('페흐토') || R.dead.includes('페흐토'))));")
# 판마다: 손님 (로지나 튐) · 항복 · 숨은 NPC 나옴
rep("  if (typeof r8CrowdTick === 'function') r8CrowdTick(W);   // v8.1 관중", "  if (typeof r8CrowdTick === 'function') r8CrowdTick(W);   // v8.1 관중\n  if (typeof r8GuestTick === 'function'){ r8GuestTick(W); r8NpcTick(W); }   // v8.7.1 손님 · 항복 · 숨은 NPC")
# 정예 전용 유물 (사르딜 락 → 비늘 · 가뮤 → 대검) · 노라의 짐
rep("(node.t === 'elite' || (node.t === 'fight' && Math.random() < 0.18))) relic = r8GiveRelic();",
    "(node.t === 'elite' || (node.t === 'fight' && Math.random() < 0.18))) relic = r8GiveRelic(node.t === 'elite' && ELITE8[node.e] && ELITE8[node.e].relic && !R.relics.includes(ELITE8[node.e].relic) ? ELITE8[node.e].relic : undefined);\n  if (node.noraLoot && W.cleared && typeof r8NoraLoot === 'function') r8NoraLoot(rew);   /* v8.7.1 노라의 짐 */")
# 항복한 이와 이야기 (영입 / 보내 줌) 뒤에 정산을 이어감
rep("  const after = () => {\n    if (node.t === 'boss' && node.b === 'gods'", "  const after = () => {\n    if (typeof r8AfterSurr === 'function' && W.r8 && W.r8.surr && !W.r8.surrDone){ W.r8.surrDone = 1; if (r8AfterSurr(W, after)) return; }   /* v8.7.1 항복 */\n    if (node.t === 'boss' && node.b === 'gods'")
# 맵 위 NPC 대화는 줄마다 말하는 이 (간호사장 · 파비 …)
rep("ally ? (L.name || ally.name) : N ? (known ? N.key : N.who)", "ally ? (L.name || ally.name) : N ? (TK.npc && TK.npc.startsWith('m_') && L.name) || (known ? N.key : N.who)")
# 대화 줄마다 도감 카드 그림 (묶음에서 그 칸)
rep("T0.style.backgroundRepeat = L.cg ? 'no-repeat' : '';", "T0.style.backgroundRepeat = L.cg ? 'no-repeat' : ''; if (typeof r8CardShow === 'function') r8CardShow(L);")
# 모듈 (도감 카드 212 를 넣어서)
E = open(D + 'run8_i.js', encoding='utf-8').read()
cards = json.load(open(D + 'd5/cards.json', encoding='utf-8'))
E = E.replace('/*CARDS8*/[]', json.dumps([{ 'id': c['id'], 'name': c['name'], 'txt': c.get('txt', '') } for c in cards], ensure_ascii=False, separators=(',', ':')), 1)
assert '/*CARDS8*/' not in E
E = E.replace('/*CARDATLAS8*/{}', open(D + 'd5/cardatlas.json', encoding='utf-8').read(), 1)
assert '/*CARDATLAS8*/' not in E
rep("\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일", '\n' + E + "\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일")
open(F, 'w', encoding='utf-8').write(s)
# 장면 배경 (테헤라 바위 다리 · 아템 금빛 회랑) — 도감 배경 폴더에서
import shutil
for k in ('bg_tehera', 'bg_aitem'): shutil.copy(D + f'dogam_new/img/scene/{k}.webp', D + f'build/art/room/{k}.webp')
print('page8710 OK cards', len(cards))
