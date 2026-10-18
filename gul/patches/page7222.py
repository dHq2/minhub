# v7.22.2 페이지 — page7222.py v1.3 (v1.3: 기술 설명 (도약 강타 · 회전 투척) · [가호:바다] 설명 · v1.2: [보스] 특성 (대장군) · v1.1: 대장군 몸 크기 × 1.8 (rMul) · 체력 2400 · 5단계 인카운터 3: 중간보스 대장군 호레이쇼 — 3S 만남 (확률적으로) · 더 작은 맵 · 가운데 무대 같은 빛 (밝은 맵) · 조용히 앉아 있다가 다가가면 천천히 일어남 → 사각형 창 "대장군이 전쟁을 시작합니다" → 전투 · 도약 강타 그림자 · 회전하는 도끼 그림 · 로그 · 이야기)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.22.1 (2026-10-18)', '<!-- 굴의 전투판 v7.22.2 (2026-10-18)')
rep('     v7.22.1: ', '''     v7.22.2: 중간보스 대장군 호레이쇼 — 3S 만남에 확률적으로. 더 작은 맵 · 가운데 무대 같은 빛 (밝은 맵). 조용히 앉아 있다가 다가가면 천천히 일어남
         → 사각형 창 "대장군이 전쟁을 시작합니다" → 전투. 키 5M 중대형 · 전신 중갑 (투구) · 방패 없음 · 괴력 S.
         도약 강타: 멀리 뛰어 내려앉으며 넓은 충격 (바로 밑에 깔리면 중형까지 즉사) — 내려앉을 그림자를 본 쪽은 피함 (양쪽 같은 규칙).
         회전 투척: 대장군의 도끼를 던지면 직선으로 회전하며 베어 나감 (동료도) → 맨손 육탄전 · 도끼를 주우러 도약. 밝은 맵 (주변광).
     v7.22.1: ''')
rep('h1::after{content:" v7.22.1"', 'h1::after{content:" v7.22.2"')
rep('<footer>굴의 전투판 v7.22.1', '<footer>굴의 전투판 v7.22.2')
rep('return `굴의 전투판 v7.22.1 · ${title}', 'return `굴의 전투판 v7.22.2 · ${title}')
rep("copyText('굴의 전투판 v7.22.1 자동 판 기록", "copyText('굴의 전투판 v7.22.2 자동 판 기록")
rep('의 버전 기록에 — v7.22.1 토끼마차', '의 버전 기록에 — v7.22.2 대장군 호레이쇼 / v7.22.1 토끼마차')
rep('">v7.22.1 · 1F 인카운터 · 토끼마차</span>', '">v7.22.2 · 1F 인카운터 · 대장군</span>')
rep("ver: '7.22.1', at:", "ver: '7.22.2', at:")

# 인물 설계: 대장군 호레이쇼 (적)
rep("const ACTIVE = {", "const ACTIVE = {\n  '도약 강타': '대장군 호레이쇼 — 이동기가 곧 공격기. 3 ~ 9칸을 1.1초에 뛰어 (몸 위로 넘어감) 내려앉으며 2.4칸 충격 (가까울수록 셈 · 날아감 · 넘어짐 · 동료도). 몸 밑에 깔린 중형까지는 즉사. 내려앉을 그림자를 본 쪽은 피함. 셋 넘게 둘러싸이면 먼 상대 (사수 먼저) 에게 · 무기를 잃었으면 그 자리로 뛰어 집어 듦. 6초마다',\n  '회전 투척': '대장군 호레이쇼 — 든 도끼를 던져 9칸을 회전하며 곧게 베어 나감 (줄에 선 모두 · 동료도) → 끝에 떨어지고 맨손 (육탄전 · 도끼를 주우러 뜀). 11초마다',   // v7.22.2")
rep("  '가호:바다': '바다의 가호 (바다 종족) — 익사하지 않음 · 물속에서 더 빨리 움직임. 아직 글로만 (물 지형이 생기면 효과)',", "  '가호:바다': '바다의 가호 (바다 종족) — 익사하지 않음 · 얕은 물속에서 오히려 빨라짐 (× 1.15 — 다른 이는 0.7 배)',")   # v7.22.2 물이 생김
rep("const TRAITS = {", "const TRAITS = {\n  '보스': '대장 · 보스 — 급소 일격 · 출혈 · 내출혈은 최대 체력 대신 400 으로 셈 (머리 · 심장을 꿰뚫어도 몇 번은 버팀) · 급소 즉사 · 투구째 즉사 없음',   // v7.22.2")
rep("const DKEEP = ['name',", "const DKEEP = ['rMul', 'name',")   # v7.22.2 몸 크기 배수
rep("  { key: '곤봉적', side: 1,", "  { key: '호레이쇼', side: 1, ref: 'C-158', name: '호레이쇼', tier: 4, cls: '근접', role: '공격수', weapon: '대장군의 도끼', height: 5, weight: 1100, sizeCls: '중대형', rMul: 1.8, nv: true, nvG: 'A', bold: 0.8, ov: { hp: 2400, atk: 75 }, traits: ['거구', '괴력S', '베테랑', '망자', '보스'], gear: { 몸: { name: '대장군의 갑옷', mat: '판금', tier: 3 }, 머리: { name: '대장군의 투구', mat: '투구', tier: 3 } }, active: ['도약 강타', '회전 투척'], tactic: '대장군 · 도약 강타 · 회전 투척 · 맨손 육탄전', note: '1F 중간보스. 키 5M 중대형 · 전신 중갑 (투구 포함) · 방패 없음 · 괴력. 이동기가 곧 공격기 — 멀리 뛰어 내려앉으며 넓은 충격 (밑에 깔리면 중형까지 즉사) · 빠른 휘두르기 · 도끼를 옆으로 던져 회전하며 베어 나감 · 도끼를 주우러 뜀 · 맨손 육탄전도 매우 강함' },   // v7.22.2\n  { key: '곤봉적', side: 1,")

rep("  { k: 'shop', name: '토끼마차', w: 1, npc: 'aiten', more: ['cheong'] }];", "  { k: 'shop', name: '토끼마차', w: 1, npc: 'aiten', more: ['cheong'] }, { k: 'hora', name: '대장군의 무대', w: 0.6, npc: 'hora' }];   // v7.22.2 중간보스 (확률적으로)")
rep("    seen: '마차 위의 사내는 담배를 줄줄이 피고 있었다.' } };", """    seen: '마차 위의 사내는 담배를 줄줄이 피고 있었다.' },
  hora: { key: '호레이쇼', ref: 'C-158', who: '앉아 있는 거대한 기사', x: 13, y: 6, img: 'C-158_art', st0: 'sit', boss: true, big: 1.9, node: () => 'war',   /* v7.22.2 중간보스 */
    map: { W: 26, H: 16, amb: 0.55, water: [], torches: [], piles: ['8,5,1', '9,5,1', '17,5,1', '18,6,1', '7,9,2', '19,10,2'] }, seen: '무대 같은 빛 한가운데, 거대한 기사가 조용히 앉아 있다.' } };""")
rep("    t3: [{ narr: '그는 대꾸하지 않는다. 담배 연기만 길게 내뿜는다.', img: 'C-036_art' }, { ask: [['그만둔다', ''], ['공격한다', '!war']] }] } };",
    """    t3: [{ narr: '그는 대꾸하지 않는다. 담배 연기만 길게 내뿜는다.', img: 'C-036_art' }, { ask: [['그만둔다', ''], ['공격한다', '!war']] }] },
  hora: { war: [{ narr: '거대한 기사가 천천히 일어선다. 갑옷이 삐걱이는 소리가 무대를 채운다.', img: 'C-158_art' }, { box: '대장군이 전쟁을 시작합니다' }, { go: '!foe2' }] } };   /* v7.22.2 */""")
rep("const ENC_LIVE = ['sleep', 'awake', 'sit', 'greeted', 'declined', 'shop', 'smoke'];", "const ENC_LIVE = ['sleep', 'awake', 'sit', 'greeted', 'declined', 'shop', 'smoke', 'rise'];")
# 다가가면 일어남 → 사각형 창 → 전투
rep("  if (E.st === 'sleep' && nd <= 3) encWake(Wd, E, nu);\n  else if (E.st === 'sit' && nd <= 4 && lit){",
    "  if (E.st === 'sleep' && nd <= 3) encWake(Wd, E, nu);\n  else if (N.boss && E.st === 'sit' && nd <= 5.5){ encRise(Wd, E); }   // v7.22.2 대장군이 일어남\n  else if (E.st === 'sit' && nd <= 4 && lit){")
rep("  if (!encLive(E)) return; const d = encDist(Wd, E), N = NPC[E.npc];", "  if (!encLive(E)) return; const d = encDist(Wd, E), N = NPC[E.npc]; if (N.boss){ if (E.st === 'sit' && d <= 6) encRise(Wd, E); else if (E.st === 'sit') toast(`가까이 가야 해요 (아군이 6칸 안 · 지금 ${d.toFixed(1)}칸)`); return; }   // v7.22.2 대장군은 말 대신 일어섬")
rep("function encWake(Wd, E, from){", "function encRise(Wd, E){ E.st = 'rise'; E.riseT = performance.now(); E.seen = true; logEv(Wd, { k: 'encRise', npc: E.npc }); talkOpen(E.npc, 'war', E); }   // v7.22.2\nfunction encWake(Wd, E, from){")
# 맵: 크기 · 주변광
rep("  Object.assign(S, { type: 'grid', W: 32, H: 20, mapC: false,", "  Object.assign(S, { type: 'grid', W: (NP && NP.map.W) || 32, H: (NP && NP.map.H) || 20, amb: (NP && NP.map.amb) || 0, mapC: false,")
rep("  campPlace(m, party, up ? 0.5 : S.H - 3, up ? 3 : S.H - 0.5, 10, 22);", "  campPlace(m, party, up ? 0.5 : S.H - 3, up ? 3 : S.H - 0.5, Math.max(1, S.W / 2 - 6), Math.min(S.W - 1, S.W / 2 + 6));   // v7.22.2 맵 크기에 맞춤")
rep("S.water = (B && B.water) || [];", "S.water = (B && B.water) || []; S.amb = (B && B.amb) || 0;")
# 그림: 큰 몸 · 일어남
rep("  const px = ox + x * ts, py = oy + (y - lift) * ts, r = 0.36 * ts, fi = faceOf(N.ref);", "  const px = ox + x * ts, py = oy + (y - lift) * ts, r = 0.36 * ts * (N.big || 1) * (E.st === 'rise' ? 1 + Math.min(1, (now - (E.riseT || now)) / 1200) * 0.15 : 1), fi = faceOf(N.ref);")
# 도약 강타 그림자 · 회전하는 도끼
rep("  if (!ed) for (const E of encAll()) if (encLive(E)) drawNpc(Wd, E, ox, oy, ts, see);", r"""  if (!ed) for (const E of encAll()) if (encLive(E)) drawNpc(Wd, E, ox, oy, ts, see);
  if (!ed) for (const u of Wd.units) if (u.alive && u.act && u.act.quake && (u.side === 0 || see || u.seenBy || litAt(Wd, u.act.tx, u.act.ty))){ const A = u.act, q = Math.min(1, (Wd.t - A.t0) / Math.max(0.05, A.end - A.t0)), qx = ox + A.tx * ts, qy = oy + A.ty * ts, R = (A.r || 2.4) * ts;   /* v7.22.2 도약 강타: 내려앉을 그림자 */
    ctx.fillStyle = `rgba(200,40,30,${(0.1 + 0.25 * q).toFixed(3)})`; ctx.beginPath(); ctx.arc(qx, qy, R, 0, 6.283); ctx.fill(); ctx.setLineDash([6, 4]); ctx.strokeStyle = 'rgba(255,120,100,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(qx, qy, R, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.ellipse(qx, qy, u.r * ts * (0.35 + 0.65 * q), u.r * ts * 0.55 * (0.35 + 0.65 * q), 0, 0, 6.283); ctx.fill(); }
  if (!ed) for (const S2 of Wd.spins || []){ if (!(see || litAt(Wd, S2.x, S2.y))) continue; const sx = ox + S2.x * ts, sy = oy + S2.y * ts; ctx.save(); ctx.translate(sx, sy); ctx.rotate((Wd.t - S2.t0) * 18);   /* v7.22.2 회전하는 도끼 */
    ctx.fillStyle = '#6b4a2c'; ctx.fillRect(-ts * 0.45, -ts * 0.05, ts * 0.9, ts * 0.1); ctx.fillStyle = '#c8ccd2'; ctx.beginPath(); ctx.moveTo(ts * 0.18, -ts * 0.34); ctx.lineTo(ts * 0.5, -ts * 0.12); ctx.lineTo(ts * 0.5, ts * 0.3); ctx.lineTo(ts * 0.18, ts * 0.06); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, ts * 0.55, 0, 6.283); ctx.stroke(); ctx.restore(); }""")
rep("  if (a.k === 'leap') return { fwd: '앞으로 도약',", "  if (a.k === 'leap' && a.quake) return '도약 강타 — 날아가는 중';   // v7.22.2\n  if (a.k === 'leap') return { fwd: '앞으로 도약',")
rep("const liveAct = (Wd, u) => u.act ? { body: !!u.act.body, arm: !!u.act.arm, k: u.act.k,", "const liveAct = (Wd, u) => u.act ? { quake: !!u.act.quake, body: !!u.act.body, arm: !!u.act.arm, k: u.act.k,")
# 로그 · 이야기
rep("      case 'encWar': out.push(", """      case 'quake': out.push(`${T(e)}💥 ${n(e.a)} 도약 강타 — ${coord(e.x, e.y)} 로 ${e.len}칸${e.why ? ' (' + e.why + ')' : ''}`); break;   // v7.22.2
      case 'quakeHit': out.push(`${T(e)}💥 ${n(e.a)} 내려앉음 — 충격 ${e.n}명${e.kills ? ' · 깔려 즉사 ' + e.kills : ''}`); break;
      case 'quakeFlee': out.push(`${T(e)}🏃 ${n(e.a)} 내려앉을 자리에서 피함`); break;
      case 'spin': out.push(`${T(e)}🪓 ${n(e.a)} ${reul(e.w)} 회전시켜 던짐${e.b != null ? ' → ' + n(e.b) + ' 쪽' : ''}`); break;
      case 'spinDrop': out.push(`${T(e)}🪓 ${e.label || e.name} 땅에 떨어짐 (맞은 ${e.n}) — ${coord(e.x, e.y)}`); break;
      case 'encRise': out.push(`${T(e)}⚔ ${NPC[e.npc].who} 일어섬`); break;
      case 'encWar': out.push(""")
rep("    case 'encWar': return { c: 'bad', s: '...눈 깜짝할 사이였다.' };", """    case 'encWar': return { c: 'bad', s: '...눈 깜짝할 사이였다.' };
    case 'quake': return e.vis ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 땅을 박차고 높이 뛰어오른다 — 거대한 그림자가 드리운다!` } : null;   // v7.22.2
    case 'quakeHit': return { c: U(e.a).side ? 'bad' : 'good', s: e.kills ? `쿵 — 대지가 울린다. ${e.kills}명이 그 아래 깔렸다.` : '쿵 — 대지가 울리고 둘레가 날아간다.' };
    case 'spin': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${reul(e.w)} 휘돌려 던진다! 회전하는 칼날이 일직선으로 날아간다.` };
    case 'spinDrop': return { c: 'dim', s: `날아가던 ${ga(e.label || e.name)} 땅에 박힌다.` };""")

open(F, 'w', encoding='utf-8').write(s)
print('page7222 OK')
