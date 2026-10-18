# v7.22.4 페이지 — page7224.py v1.3 (모바일 캠프 막대 두 줄 · 로그 칸 tx — t 는 시각 · 조사 이었다/였다 · 5단계 인카운터 5: 당신들을 따라온 누군가 — 버린 아군을 기억함 (버릴 때 체력 그대로) · 3S 만남에 '당신들을 따라온 누군가' (버린 이가 있을 때만 · 무게 1.5) · 어둠 속에서 비틀거리며 다가옴 → 다가가면 나레이션 → 다시 합류 · 그냥 넘어가도 따라옴)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.22.3 (2026-10-18)', '<!-- 굴의 전투판 v7.22.4 (2026-10-18)')
rep('     v7.22.3: ', '''     v7.22.4: 당신들을 따라온 누군가 — 버린 아군을 기억함 (버릴 때 체력 그대로). 버린 이가 있으면 3S 만남에 '당신들을 따라온 누군가' (무게 1.5).
         어둠 속에서 비틀거리며 다가옴 → 다가가면 나레이션 "당신들을 따라온 누군가가 있다." → 다시 합류. 그냥 넘어가도 따라옴.
         모바일 캠프 막대 두 줄 (제목 한 줄 · 단추는 옆으로 밀기) — 맵을 덜 가림.
     v7.22.3: ''')
rep('h1::after{content:" v7.22.3"', 'h1::after{content:" v7.22.4"')
rep('<footer>굴의 전투판 v7.22.3', '<footer>굴의 전투판 v7.22.4')
rep('return `굴의 전투판 v7.22.3 · ${title}', 'return `굴의 전투판 v7.22.4 · ${title}')
rep("copyText('굴의 전투판 v7.22.3 자동 판 기록", "copyText('굴의 전투판 v7.22.4 자동 판 기록")
rep('의 버전 기록에 — v7.22.3 히든보스 각혈', '의 버전 기록에 — v7.22.4 따라온 누군가 / v7.22.3 히든보스 각혈')
rep('">v7.22.3 · 1F 인카운터 · 각혈</span>', '">v7.22.4 · 1F 인카운터 · 5단계</span>')
rep("ver: '7.22.3', at:", "ver: '7.22.4', at:")

# 버린 아군을 기억함
rep("    else if (u.gone === 'left') C.lost.push(p.name); else C.fallen.push(p.name); }",
    "    else if (u.gone === 'left'){ C.lost.push(p.name); (C.lostP = C.lostP || []).push({ ...clone(p), hpNow: Math.max(1, Math.round(u.hp)) }); } else C.fallen.push(p.name); }   // v7.22.4 버린 이를 기억 (따라올 수 있음)")
rep("  { k: 'shop', name: '토끼마차', w: 1, npc: 'aiten', more: ['cheong'] }, { k: 'hora', name: '대장군의 무대', w: 0.6, npc: 'hora' }];",
    "  { k: 'shop', name: '토끼마차', w: 1, npc: 'aiten', more: ['cheong'] }, { k: 'hora', name: '대장군의 무대', w: 0.6, npc: 'hora' }, { k: 'lost', name: '당신들을 따라온 누군가', w: 1.5, npc: 'lost' }];   // v7.22.4 버린 이가 있을 때만")
rep("  const have = new Set([...party.map(p => p.name), ...(C.fallen || []), ...(C.lost || [])]), L = ENC3.filter(e => !e.npc || !have.has(NPC[e.npc].key));",
    "  const have = new Set([...party.map(p => p.name), ...(C.fallen || []), ...(C.lost || [])]), L = ENC3.filter(e => e.npc === 'lost' ? (C.lostP || []).length > 0 : !e.npc || !have.has(NPC[e.npc].key));")
rep("    map: { W: 26, H: 16, amb: 0.55, water: [], torches: [], piles: ['8,5,1', '9,5,1', '17,5,1', '18,6,1', '7,9,2', '19,10,2'] }, seen: '무대 같은 빛 한가운데, 거대한 기사가 조용히 앉아 있다.' } };",
    """    map: { W: 26, H: 16, amb: 0.55, water: [], torches: [], piles: ['8,5,1', '9,5,1', '17,5,1', '18,6,1', '7,9,2', '19,10,2'] }, seen: '무대 같은 빛 한가운데, 거대한 기사가 조용히 앉아 있다.' },
  lost: { key: '', ref: '', who: '어둠 속의 누군가', x: 16, y: 7, img: null, st0: 'sit', lostNpc: true, map: { water: [], torches: [], piles: ['13,6,2', '19,8,2', '15,10,1'] }, seen: '어둠 속에서 누군가 비틀거리며 다가온다.' } };   /* v7.22.4 버린 아군 (얼굴 · 이름은 그 사람) */""")
rep("  if (NP && E3.more && !st.enc2)", "  if (NP && NP.lostNpc && st.enc && !st.enc.p && (C.lostP || []).length){ const lp = C.lostP[0]; Object.assign(st.enc, { p: clone(lp), ref: lp.ref, name: lp.name }); }   // v7.22.4 처음 버린 이부터\n  if (NP && E3.more && !st.enc2)")
# 만나면 다시 합류
rep("  else if (N.boss && E.st === 'sit' && nd <= 5.5){ encRise(Wd, E); }   // v7.22.2 대장군이 일어남",
    "  else if (N.lostNpc && E.st === 'sit' && nd <= 4){ encLostMeet(Wd, E); }   // v7.22.4 따라온 누군가\n  else if (N.boss && E.st === 'sit' && nd <= 5.5){ encRise(Wd, E); }   // v7.22.2 대장군이 일어남")
rep("if (N.boss){ if (E.st === 'sit' && d <= 6) encRise(Wd, E);", "if (N.lostNpc){ if (E.st === 'sit' && d <= 6) encLostMeet(Wd, E); return; }   // v7.22.4\n  if (N.boss){ if (E.st === 'sit' && d <= 6) encRise(Wd, E);")
rep("function encRise(Wd, E){", "function encLostMeet(Wd, E){ E.st = 'greeted'; E.seen = true; logEv(Wd, { k: 'encLost', name: E.name }); talkLines([{ narr: '당신들을 따라온 누군가가 있다.' }, { narr: `${E.name} — 버려졌던 동료가 기적적으로 따라잡았다.` }, { go: '!join' }], E.npc, E); }   // v7.22.4\nfunction encRise(Wd, E){")
rep("function encMake(E, side){ const N = NPC[E.npc], p = { ...fromDesign(designByKey(N.key), side), x: E.x, y: E.y }; lockIdentity(p); S.units.push(p); return addUnit(world, p); }",
    "function encMake(E, side){ const N = NPC[E.npc], p = E.p ? { ...clone(E.p), id: uid(), side, x: E.x, y: E.y } : { ...fromDesign(designByKey(N.key), side), x: E.x, y: E.y }; if (E.p) lostBack(E.p.name); lockIdentity(p); S.units.push(p); return addUnit(world, p); }\nfunction lostBack(name){ const C = S.camp; if (!C) return; C.lostP = (C.lostP || []).filter(q => q.name !== name); C.lost = (C.lost || []).filter(n => n !== name); }   // v7.22.4 버린 이가 돌아옴")
rep("  const N = NPC[E.npc], p = fromDesign(designByKey(N.key), 0); lockIdentity(p); party.push(p); E.st = 'followed'; C.follow = { t: N.pass, img: N.img, name: N.key };",
    "  const N = NPC[E.npc]; if (N.lostNpc && !E.p) return; const p = E.p ? { ...clone(E.p), id: uid() } : fromDesign(designByKey(N.key), 0); if (E.p) lostBack(E.p.name); lockIdentity(p); party.push(p); E.st = 'followed'; C.follow = { t: N.lostNpc ? `당신들을 따라온 누군가가 있다. ...${E.name}${jong(E.name) ? '이었' : '였'}다.` : N.pass, img: N.img, name: E.p ? E.name : N.key };   // v7.22.4 따라온 누군가도")
rep("logEv(world, { k: 'encFollow', name: f.name });", "logEv(world, { k: 'encFollow', name: f.name, tx: f.t });")
rep("    case 'encFollow': return { c: 'good', s: NPC[ENC3.find(x => x.npc && NPC[x.npc].key === e.name).npc].pass };", "    case 'encFollow': { const q = ENC3.find(x => x.npc && NPC[x.npc].key === e.name); return { c: 'good', s: e.tx || (q ? NPC[q.npc].pass : `${ga(e.name)} 뒤따라 왔다.`) }; }")
# 얼굴 · 이름
rep("r = 0.36 * ts * (N.big || 1) * (E.st === 'rise' ? 1 + Math.min(1, (now - (E.riseT || now)) / 1200) * 0.15 : 1), fi = faceOf(N.ref);", "r = 0.36 * ts * (N.big || 1) * (E.st === 'rise' ? 1 + Math.min(1, (now - (E.riseT || now)) / 1200) * 0.15 : 1), fi = faceOf(E.ref || N.ref);")
# 로그
rep("      case 'khCome': out.push(", "      case 'encLost': out.push(`${T(e)}👣 ${ga(e.name)} 따라잡음 — 당신들을 따라온 누군가`); break;   // v7.22.4\n      case 'khCome': out.push(")
rep("    case 'khCome': return { c: 'bad', s: '피할 수 없는 죽음이 찾아왔다.' };   // v7.22.3", "    case 'khCome': return { c: 'bad', s: '피할 수 없는 죽음이 찾아왔다.' };   // v7.22.3\n    case 'encLost': return { c: 'good', s: `당신들을 따라온 누군가가 있다 — ${e.name}.` };   // v7.22.4")

# v1.3 모바일 캠프 막대 두 줄
rep('body.mob .campbar{top:4px;padding:4px 8px;font-size:12px}', 'body.mob .campbar{top:4px;padding:4px 8px;font-size:12px}\n/* v7.22.4 모바일 캠프 막대 두 줄 — 제목 한 줄 (넘치면 …) + 단추 한 줄 (옆으로 밀기) · 맵을 덜 가림 */\nbody.mob .campbar{gap:3px 6px;padding:4px 6px;width:calc(100% - 8px);box-sizing:border-box}\nbody.mob .campbar .ck{flex:1 1 0;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\nbody.mob .campbar .cb{flex:1 0 100%;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}\nbody.mob .campbar .cb::-webkit-scrollbar{display:none}\nbody.mob .campbar .btn{min-height:34px;white-space:nowrap;flex:none}')

open(F, 'w', encoding='utf-8').write(s)
print('page7224 OK')
