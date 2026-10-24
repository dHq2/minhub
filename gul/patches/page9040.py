# v9.4.0 페이지 — page9040.py v1.2 (v1.2: 비전투 맵의 이름표는 '만남' · v1.1: 층 정의 (F8) 에 peace 를 실음 · v1.0: 2층 대규모 업데이트 5단계 — ❓ 만남 구조: ❓ 에서 잠시 쉬기 (비전투) · 사람 만남은 그 층의 비전투 맵에서 (노숙악마 · 두건 — 모닥불 · 대사 · 적선 · 오래된 약병 ×5 · 싸우면 도망 · 쉼만) · 2층 비전투 맵 이벤트룸)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9030.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.3.0 (2026-10-24)', '<!-- 굴의 전투판 v9.4.0 (2026-10-24)')
rep('     v9.3.0: 2층 대규모 업데이트 4단계', '''     v9.4.0: 2층 대규모 업데이트 5단계 — ❓ 만남 구조 (명세 C):
         · ❓ 에서 잠시 쉴 수 있음 (비전투 · 만남을 피함 · 모두 20% 회복) — 미리 정해진 만남 (세르파 · 단달로) 에는 없음
         · 사람 만남 (노숙악마 · 두건) 은 그 층의 맵 중 하나 (적 없는 비전투 맵 · 2층은 이벤트룸) 에 모닥불과 함께 놓임 — 걸어가 말을 검 (맵 위 NPC)
         · 노숙악마: 적선하면 오래된 약병 ×5 (처음 한 번) · 말을 걸수록 대사가 바뀜 (6번째부터 쫓아냄 · 8번째에 잠듦) · 싸우면 저항하며 도망다니다 쓰러짐 · 두건: 쉼만 (모두 25% 회복) · 때리면 저항 없이 쓰러짐
     v9.3.0: 2층 대규모 업데이트 4단계''')
for a, b in (('h1::after{content:" v9.3.0"', 'h1::after{content:" v9.4.0"'), ('<footer>굴의 전투판 v9.3.0', '<footer>굴의 전투판 v9.4.0'), ('return `굴의 전투판 v9.3.0 · ${title}', 'return `굴의 전투판 v9.4.0 · ${title}'),
             ("copyText('굴의 전투판 v9.3.0 자동 판 기록", "copyText('굴의 전투판 v9.4.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.3.0 — ${C.run", "o.push(`굴의 전투판 v9.4.0 — ${C.run"),
             ('의 버전 기록에 — v9.3.0 2층 배치 (계단 고지대) /', '의 버전 기록에 — v9.4.0 ❓ 만남 구조 (쉬기 · 비전투 맵 · 노숙악마 · 두건) / v9.3.0 2층 배치 (계단 고지대) /'),
             ('">v9.3.0 · 2층 배치 (계단 고지대 · 거인 · 보스)</span>', '">v9.4.0 · ❓ 만남 구조 (쉬기 · 비전투 맵 · 노숙악마 · 두건)</span>'),
             ("ver: '9.3.0', kind:", "ver: '9.4.0', kind:"), ("RULES_MIG = '9.3.0',", "RULES_MIG = '9.4.0',")):
    rep(a, b)

# ---- ❓ 쉬기 (C2) ----
rep("  const k = n.enc || (n.enc = r8WPick(L.map(x => [x[0], x[1]]))); save();\n",
    """  const pre8 = !!n.enc;   /* v9.4.0 미리 정해진 만남 (세르파 · 단달로) 은 쉬기가 없음 */
  const k = n.enc || (n.enc = r8WPick(L.map(x => [x[0], x[1]]))); save();
  if (!pre8 && !n.restAsk){ n.restAsk = 1; save(); r8Hide();   /* v9.4.0 ❓ 에서 잠시 쉬는 선택 (명세 C2 — 비전투 · 만남은 놓침) */
    talkLines([{ narr: '길가에 무언가 있다 — 만남일 수도 있다. 다가갈 수도, 지금은 숨을 돌릴 수도 있다.' }, { ask: [['👣 다가간다 (만남)', '!r8:encGo'], ['⛺ 잠시 쉰다 (만남을 피함 · 모두 20% 회복)', '!r8:encRest']] }]); return; }
""")
rep("  if (a === 'done'){ done(); return; }\n",
    """  if (a === 'done'){ done(); return; }
  if (a === 'encGo'){ const n = r8Node(R.at); if (n) r8Enc(n); else r8MapShow(); return; }   /* v9.4.0 */
  if (a === 'encRest'){ r8HealAll(0.2); r8Say([{ narr: '잠시 숨을 돌린다. 아무 일도 일어나지 않았다 — 아니, 일어났을지도 모르지만, 우리는 보지 않았다.' }, { box: '모두 20% 회복' }]); return; }
""")

# ---- 사람 만남 = 비전투 맵 (C1) ----
rep("  if (k.startsWith('x:')){ r8XEvent(n, k.slice(2)); return; } if (k.startsWith('c:')){ r8Card(n); return; }",
    "  if (k.startsWith('p:')){ r8PeaceMap(n, k.slice(2)); return; }   /* v9.4.0 사람 만남은 비전투 맵에서 */\n  if (k.startsWith('x:')){ r8XEvent(n, k.slice(2)); return; } if (k.startsWith('c:')){ r8Card(n); return; }")
rep("// 1F 인카운터를 그대로 (3S 처럼) — 맵을 나가면 r8Over 가 받음", """// v9.4.0 비전투 맵 (명세 C1): 그 층의 맵 중 하나 (낙사 · 계단 · 보스룸 빼고 · 2층은 이벤트룸) 에 적 없이 NPC 만 놓고 그 맵을 걸어 다님 — 출구는 처음부터 열림
function r8PeaceMap(n, key){
  const R = R8S(), F = F8[R.f] || {}; (R.npcDone = R.npcDone || []).push('p:' + key);
  const L = (F.peace || F.maps || []).filter(k => r8MapOk(k) && !MAPS8[k].fall && !MAPS8[k].stairs && !/boss/.test(k));
  n.t = 'fight'; n.empty = true; n.bare = true; n.ms = 'pass'; n.npc8 = key; n.peace = true; n.stitch = null; if (L.length) n.src8 = r8Pick(L);
  save(); r8Hide(); r8Battle(n);
}
// 1F 인카운터를 그대로 (3S 처럼) — 맵을 나가면 r8Over 가 받음""")
rep("if (!W || !C || n.t !== 'fight' || n.ms === 'open' || n.champ || n.empty) return;", "if (!W || !C || n.t !== 'fight' || n.ms === 'open' || n.champ || (n.empty && !n.npc8)) return;")
rep("const L = Object.entries(MNPC8).filter(([k, M]) =>", "const L = Object.entries(MNPC8).filter(([k, M]) => !M.only &&")
rep("(C.stages[1] = C.stages[1] || {}).enc = E; if (M.prop){",
    "(C.stages[1] = C.stages[1] || {}).enc = E; if (M.fire && W.torches){ W.torches.push({ x: E.x + 0.95, y: E.y + 0.15 }); try { computeLight(W); } catch (e) {} }   /* v9.4.0 모닥불 빛 */\n  if (M.prop){")
rep("  2: { name: '무너진 유적', band: 'ruin', maps: ['ruin2a', 'ruin2b', 'gfight1', 'fmap2', 'gstair1', 'gstair2', 'fmap3', 'gboss1'],",
    "  2: { name: '무너진 유적', band: 'ruin', maps: ['ruin2a', 'ruin2b', 'gfight1', 'fmap2', 'gstair1', 'gstair2', 'fmap3', 'gboss1'], peace: ['gevent1', 'ruin2c'],   /* v9.4.0 비전투 맵 (이벤트룸) */")

# ---- 노숙악마 · 두건 ----
rep("  serpa: { who: '왕관을 쓴 아이'",
    """  hobo: { who: '모닥불 곁의 노숙악마', ref: 'C-145', d: [2, 30], only: true, fire: true, seen: '모닥불 곁에서 낡은 외투를 둘둘 만 악마 하나가 졸고 있다. 발치엔 빈 병과 깡통.' },   /* v9.4.0 명세 C5 */
  hood: { who: '모닥불 곁의 두건', ref: 'C-171', d: [2, 30], only: true, fire: true, seen: '모닥불 곁에 두건을 쓴 이가 말없이 앉아 있다.' },   /* v9.4.0 명세 C6 */
  serpa: { who: '왕관을 쓴 아이'""")
rep("for (const [k, M] of Object.entries(MNPC8)) NPC['m_' + k] = { key: '', ref: M.ref || undefined, who: M.who, x: 0, y: 0, img: M.img || null, st0: 'sit', fromRef: !!M.ref, talkR: 6, node: () => 'start', seen: M.seen, foeLine: '…' };",
    "for (const [k, M] of Object.entries(MNPC8)) NPC['m_' + k] = { key: '', ref: M.ref || undefined, who: M.who, x: 0, y: 0, img: M.img || null, st0: 'sit', fromRef: !!M.ref, talkR: 6, node: () => 'start', seen: M.seen, foeLine: '…', fire: !!M.fire };")
rep("r8T('serpa', [", """const HB8 = { list: [], menu: [['🎁 적선한다 (소지품 · 동전)', '!r8:mnHoboGive'], ['💬 말을 건다', '!r8:mnHoboTalk'], ['⚔ 싸운다', '!r8:mnHoboFight'], ['지나간다', '']] };
r8T('hobo', [{ t: '오..? 오옷? 뭐냐 너희는. 난 아무것도없다구.', name: '노숙악마', who: 'C-145' }, { ask: HB8.menu }]);
r8T('hood', [{ t: '..........오오...많이도 짊어졌구나', name: '두건', who: 'C-171' }, { ask: [['⛺ 곁에서 쉰다 (모두 25% 회복)', '!r8:mnHoodRest'], ['⚔ 공격한다', '!r8:mnHoodHit'], ['지나간다', '']] }]);
r8T('serpa', [""")
# 오래된 약병 · 노숙악마 · 두건 처리
rep("Object.assign(R8X, X8);", """/* v9.4.0 노숙악마 (명세 C5) · 두건 (명세 C6) */
const OLD_VIAL8 = { k: 'potion', name: '오래된 약병', label: '', heal: 0.25, min: 15, cap: 60 };   // 마시면 최대 체력 25% (15 ~ 60) — 회복약보다 조금 적음
const hoboJunk8 = it => (it.dur != null && it.dur <= 0) || (it.k === 'ammo' && !(it.n > 0)) || /쓰레기|부러진|깨진/.test(it.name || '');
const hoboT8 = t => ({ t, name: '노숙악마', who: 'C-145' });
function hoboLines8(first){
  const R = R8S(), N = R.flags.hoboN = (R.flags.hoboN || 0) + 1; save();
  if (N >= 8) return { L: [{ narr: '그는 잠에 든 것 같다. 자는 척하는 것인지.' }], end: true };
  if (N >= 6) return { L: [hoboT8(r8Pick(['슬슬 가지 그래?', '너 정말 심심한가 보구나']))] };
  if (first) return { L: [hoboT8('오옷. 이런세계에도 너같은 녀석이 있다니. 고맙다.'), { narr: '[그는 자신의 품을 뒤적입니다]' }, hoboT8('받아라. 어디가서 구할수 없는거라구.')], gift: true };
  if (!R.flags.hoboGave) return { L: [hoboT8(r8Pick(['난 아무것도없다구.', '진짜 아무것도 없다니까.']))] };
  return { L: [hoboT8(r8Pick(['고맙다구.', '더 나올건 없다구.', '나도 한때는 부와 영예를 한몸에 가지고 있었지. 지금은 다 뺐겼지만.']))] };
}
function hoboShow8(o){ const L = o.L.slice(); if (!o.end) L.push({ ask: HB8.menu }); else { const E = encCur(); if (E) E.st = 'sleep'; save(); } talkLines(L); }
function hoboGive8(){   // 오래된 약병 ×5 를 가방에 (자리 있는 이부터)
  const W = world; let n = 0; if (!W) return 0;
  for (let i = 0; i < 5; i++){ const u = W.units.filter(x => x.side === 0 && x.alive && !x.summon && (x.bag || []).length < bagCapOf(W, x)).sort((a, b) => (b.hero ? 1 : 0) - (a.hero ? 1 : 0) || a.bag.length - b.bag.length)[0]; if (!u) break; u.bag.push({ ...OLD_VIAL8, uid: (W.bagN = (W.bagN || 10000) + 1) }); n++; }
  return n;
}
function hoboDonate8(why, take){   // take() — 건넨 것을 빼는 일 (쓰레기면 안 받음)
  const R = R8S(); R.flags = R.flags || {};
  const first = !R.flags.hoboGave; let o;
  if (take === 'junk'){ R.flags.hoboN = (R.flags.hoboN || 0) + 1; save(); talkLines([{ narr: '그에게 건넨다 — 그가 들여다보고, 코를 찡그린다.' }, hoboT8('이게 뭐야! 날 놀리는 거냐! 쓰레기 말고 쓸 만한 걸 달라구!'), { ask: HB8.menu }]); return; }
  take(); o = hoboLines8(first); if (o.gift){ R.flags.hoboGave = 1; const n = hoboGive8(); o.L.push({ box: n ? `🧪 오래된 약병 ×${n}${n < 5 ? ' (가방이 가득해 ' + (5 - n) + '개는 못 받음)' : ''}` : '가방이 가득해 받지 못했다' }); }
  hoboShow8(o);
}
Object.assign(X8, {
  mnHoboGive(){ const W = world, R = R8S(); if (!W) return; const L = []; for (const u of W.units) if (u.side === 0 && u.alive && !u.summon) for (const it of u.bag || []) L.push({ u, it }); HB8.list = L.slice(0, 6);
    const asks = HB8.list.map((x, i) => [`${x.u.name} — ${itName(x.it)}${hoboJunk8(x.it) ? ' (쓰레기?)' : ''}`, '!r8:mnHoboItem' + i]); if (R.gold >= 10) asks.push(['동전 10 을 건넨다', '!r8:mnHoboCoin']); asks.push(['…관둔다', '!r8:mnHoboMenu']);
    if (asks.length === 1){ talkLines([{ narr: '건넬 만한 것이 없다. 주머니가 가볍다.' }, hoboT8('…거 봐. 너도 아무것도 없잖아.'), { ask: HB8.menu }]); return; }
    talkLines([{ narr: '무엇을 건넬까?' }, { ask: asks }]); },
  mnHoboMenu(){ talkLines([hoboT8('…뭐냐, 안 줄 거냐?'), { ask: HB8.menu }]); },
  mnHoboCoin(){ const R = R8S(); hoboDonate8('coin', () => { R.gold -= 10; save(); }); },
  mnHoboTalk(){ hoboShow8(hoboLines8(false)); },
  mnHoboFight(){ talkLines([{ narr: '노숙악마가 벌떡 일어나 빈 병을 움켜쥔다.' }, hoboT8('뭐, 뭐야! 난 아무것도 없다니까!'), { go: '!r8:mnHoboFight2' }]); },
  mnHoboFight2(){ const E = encCur(); if (!E) { campBarRender(true); return; } encFoe(E); const u = world.units[world.units.length - 1]; if (u && u.side === 1){ u.bold = 0.02; u.spd *= 1.15; u.name = '노숙악마'; } },   /* 저항하며 도망다니다 쓰러짐 — 겁이 많고 발이 빠름 */
  mnHoodRest(){ const R = R8S(); if ((R.flags || {}).hoodRest){ r8Say([{ t: '..........', name: '두건', who: 'C-171' }, { narr: '두건은 이미 할 말을 다 한 듯 불만 바라본다.' }], () => campBarRender(true)); return; } R.flags.hoodRest = 1; r8HealAll(0.25);
    r8Say([{ narr: '두건은 말없이 자리를 내준다. 불이 따뜻하다 — 짊어진 것이 잠깐 가벼워진다.' }, { box: '모두 25% 회복' }], () => campBarRender(true)); },
  mnHoodHit(){ const E = encCur(); if (E){ E.st = 'dead'; } const R = R8S(); R.flags.hoodSlain = 1; save();
    r8Say([{ narr: '두건은 저항하지 않는다. 손을 들지도 않는다. 맞다가 — 조용히 쓰러진다.' }, { narr: '불이 잦아든다.' }], () => campBarRender(true)); } });
for (let i = 0; i < 6; i++) X8['mnHoboItem' + i] = () => { const x = HB8.list[i]; if (!x) { X8.mnHoboMenu(); return; } if (hoboJunk8(x.it)){ hoboDonate8('junk', 'junk'); return; } hoboDonate8('item', () => { const k = x.u.bag.indexOf(x.it); if (k >= 0) x.u.bag.splice(k, 1); }); };
Object.assign(R8X, X8);""")
# 만남 목록: 사람 만남 (비전투 맵)
rep("['pearl', 0.45, 4, 16]];", "['pearl', 0.45, 4, 16]];\nENC8.push(['p:hobo', 0.7, 2, 30], ['p:hood', 0.55, 3, 30]);   /* v9.4.0 비전투 맵 만남 (사람) — 옛 t:hood (저주 제거) 는 두건으로 대신함 */\nfor (const e of ENC8) if (e[0] === 't:hood') e[1] = 0;")

# 모닥불 그리기
rep("  if (N.cart) drawCart(ox + N.cart.x * ts, oy + N.cart.y * ts, ts);   // v7.22.1 토끼마차",
    "  if (N.cart) drawCart(ox + N.cart.x * ts, oy + N.cart.y * ts, ts);   // v7.22.1 토끼마차\n  if (N.fire) drawCampfire(ox + (x + 0.95) * ts, oy + (y + 0.15) * ts, ts, now);   /* v9.4.0 모닥불 */")
rep("function drawNpc(Wd, E, ox, oy, ts, see){", """function drawCampfire(cx, cy, ts, now){   // v9.4.0 모닥불 — 돌 둘레 · 장작 · 일렁이는 불꽃 셋 · 번지는 빛
  const f = 0.5 + 0.5 * Math.sin(now / 130) * Math.sin(now / 71 + 1.3); ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(cx + 2, cy + ts * 0.14, ts * 0.42, ts * 0.17, 0, 0, 6.283); ctx.fill();
  const g = ctx.createRadialGradient(cx, cy - ts * 0.2, 0, cx, cy - ts * 0.2, ts * (1.6 + f * 0.25)); g.addColorStop(0, 'rgba(255,170,60,.34)'); g.addColorStop(1, 'rgba(255,120,30,0)');
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy - ts * 0.2, ts * 1.9, 0, 6.283); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
  for (let k = 0; k < 7; k++){ const a = k / 7 * 6.283; ctx.fillStyle = k % 2 ? '#5b5750' : '#6f6a62'; ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * ts * 0.3, cy + Math.sin(a) * ts * 0.12, ts * 0.09, ts * 0.06, 0, 0, 6.283); ctx.fill(); }
  ctx.strokeStyle = '#4a3020'; ctx.lineWidth = Math.max(2, ts * 0.07); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - ts * 0.22, cy + ts * 0.04); ctx.lineTo(cx + ts * 0.2, cy - ts * 0.04); ctx.moveTo(cx - ts * 0.18, cy - ts * 0.05); ctx.lineTo(cx + ts * 0.22, cy + ts * 0.05); ctx.stroke();
  for (const [sc, col] of [[1, '#ff7a1c'], [0.72, '#ffb12e'], [0.4, '#fff1a8']]){ const h = ts * (0.5 + 0.14 * f) * sc, w = ts * 0.2 * sc, sw = Math.sin(now / 160 + sc * 3) * ts * 0.03; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx - w, cy); ctx.quadraticCurveTo(cx - w * 1.1 + sw, cy - h * 0.55, cx + sw, cy - h); ctx.quadraticCurveTo(cx + w * 1.1 + sw, cy - h * 0.55, cx + w, cy); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function drawNpc(Wd, E, ox, oy, ts, see){""")
rep("maps: X && X.maps ? X.maps : T ? T.maps.filter(r8MapOk) : [], narr:", "maps: X && X.maps ? X.maps : T ? T.maps.filter(r8MapOk) : [], peace: X && X.peace, narr:")   # 비전투 맵 목록을 층 정의에 실어 보냄
rep("name: `${R.f}층 ${(NODE8[n.t] || {}).nm}`", "name: `${R.f}층 ${n.peace ? '만남' : (NODE8[n.t] || {}).nm}`")   # 비전투 맵은 '싸움' 이 아니라 '만남'
open(F, 'w', encoding='utf-8').write(s)
print('page9040 OK')
