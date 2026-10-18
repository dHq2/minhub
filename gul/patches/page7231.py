# v7.23.1 페이지 — page7231.py v1.1 (v1.1: 특수 칸 기본 아이콘 (undefined 고침) · 알현실 밝기 0.85 · 6단계 5S 세자르 1: 원형 홀 (밝음 · 기둥 여덟 · 가운데 관) · 관을 연다 (2D 판 글) · 깨어남 (가까이 갔던 뒤 모두 멀어지거나 25초) · 세자르 (2D 판 두뇌) · 쓰러지면 계단 (관이 다음 층의 입구) · 동상 · 효과 · 로그)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.23.0 (2026-10-18)', '<!-- 굴의 전투판 v7.23.1 (2026-10-18)')
rep('     v7.23.0: ', '''     v7.23.1: 5S 세자르의 알현실 — 원형 홀 (밝음 · 기둥 여덟 · 가운데 관). 들어서면 "천장이 보이지 않을 만큼 높습니다. 가운데에 관 하나."
         관 곁에서 '관을 연다' (2D 판 글 · 늙은 왕의 얼굴). 가까이 갔던 뒤 모두 관에서 멀어지거나 25초가 지나면 — 관이 덜컹 → 툭. → 세자르가 일어남.
         세자르 (C-045 · 6성 · 체력 2000 · 공격 62 · [보스] [베테랑] [회피S] [속력S] [갑피] · 노인의 검 · 노인의 왕관 · 무게 70 · 자세 × 6) — 2D 판 두뇌:
         리듬 (탐색 4.5 ~ 7초 — 간격을 재며 천천히 돎 ↔ 딜타임 4.5초) · 빈틈 찌르기 (휘청 · 넘어짐 · 막 친 상대 → 3배로 달려가 확정 3연격) · 원형 베기 · 어깨 박치기 · 뒷걸음 점프 · 우회 · 돌진 · 연격 · 회피 반격 (확정 치명) · 동상 · 절단.
         세자르가 쓰러지면 빈 관 바닥이 꺼지고 계단 — '↑ 계단으로' = 계단에 닿으면 프롤로그 끝. (하늘 가르기 · 관통 찌르기 · 냉기 참격 · 마구 베기 · 권위는 다음 판)
     v7.23.0: ''')
rep('h1::after{content:" v7.23.0"', 'h1::after{content:" v7.23.1"')
rep('<footer>굴의 전투판 v7.23.0', '<footer>굴의 전투판 v7.23.1')
rep('return `굴의 전투판 v7.23.0 · ${title}', 'return `굴의 전투판 v7.23.1 · ${title}')
rep("copyText('굴의 전투판 v7.23.0 자동 판 기록", "copyText('굴의 전투판 v7.23.1 자동 판 기록")
rep('의 버전 기록에 — v7.23.0 4S 유적 (실내전)', '의 버전 기록에 — v7.23.1 5S 세자르 / v7.23.0 4S 유적 (실내전)')
rep('">v7.23.0 · 1F 4S 유적 · 6단계</span>', '">v7.23.1 · 1F 5S 세자르 · 6단계</span>')
rep("ver: '7.23.0', at:", "ver: '7.23.1', at:")

# 세자르 설계 · 설계 칸
rep("  { key: '각혈', side: 1, ref: 'C-097',", """  { key: '세자르', side: 1, ref: 'C-045', name: '세자르', tier: 6, cls: '근접', role: '공격수', weapon: '노인의 검', height: 2.1, weight: 70, poise: 6, sizeCls: '중대형', nv: true, nvG: 'S', bold: 1, ov: { hp: 2000, atk: 62 }, traits: ['보스', '베테랑', '회피S', '속력S', '갑피', '망자'], gear: { 머리: { name: '노인의 왕관', mat: '투구', tier: 1 } }, active: ['원형 베기', '어깨 박치기'], brain: 'cesar', dcounter: 0.5, frostP: 0.25, severP: 0.35, tactic: '1F 의 왕 · 리듬 (탐색 ↔ 딜타임) · 빈틈 응징', note: '보스란 무엇인가의 기준. 존경받는 왕이었으며, 칼을 대충 슥 하면 절단되어 버린다. 감정도 예측도 불가능 — 숨 막히는 압박만이 계속된다. 그의 검은 그냥 화려한 검일 뿐, 그야말로 인간의 정점. 말이 없다.' },   // v7.23.1 (2D 판 이식)
  { key: '각혈', side: 1, ref: 'C-097',""")
rep("'regenK', 'leapN', 'shells'];   /* v7.19 */", "'regenK', 'leapN', 'shells', 'brain', 'poise', 'dcounter', 'frostP', 'severP'];   /* v7.19 */   /* v7.23.1 세자르 두뇌 · 자세 · 회피 반격 · 동상 · 절단 */")
rep("const ACTIVE = {\n", """const ACTIVE = {
  '원형 베기': '세자르 — 0.35초 모았다가 (그동안 휘청이면 끊김 · 3초 뒤 다시) 둘레 2.6M 의 상대 모두를 벰 (× 2) · 밀어내고 휘청 · 동상 2초. 탐색 중 붙거나 딜타임에. 8초마다',
  '어깨 박치기': '세자르 — 3.3M 안의 상대에게 초속 10M 로 들이받음 (× 0.6 · 둔기) · 1.2M 밀어내고 휘청. 딜타임에. 5초마다',
""")

# 5S
rep("  { name: '5S', kind: '알현실', note: '세자르의 알현실 — 세자르는 다음 판 (지금은 기사 셋)', foes: [['검방패기사', 1], ['창병', 1], ['검기사', 1]] }];",
    """  { name: '5S', kind: '알현실', note: '세자르의 알현실 — 천장이 보이지 않는 원형 홀 · 가운데에 관 하나', hall: true }];   // v7.23.1
// v7.23.1 5S 알현실: 28 × 28 원형 홀 (밝음 · 기둥 여덟 · 아래 입구) · 가운데 관 (2칸 · 더미 3) — 관 속의 왕 (세자르) · 쓰러지면 관 자리에 계단
const HALL = { W: 28, H: 28, cx: 14, cy: 13.5, r: 12.6, pr: 8, coffin: [[13, 11], [14, 11]], king: { x: 14, y: 11.5 }, stairs: { x: 14, y: 11.5, r: 0.9 }, amb: 0.6, near: 2.6, far: 6, wait: 25 };
function hallLayout(){
  const { W, H, cx, cy, r } = HALL, flips = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++){ const door = y >= H - 5 && x >= 12 && x <= 15; if (Math.hypot(x + 0.5 - cx, y + 0.5 - cy) > r && !door) flips.add(x + ',' + y); }
  for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4 + Math.PI / 8; flips.add(Math.floor(cx + Math.cos(a) * HALL.pr) + ',' + Math.floor(cy + Math.sin(a) * HALL.pr)); }   // 기둥 여덟
  return { W, H, flips: [...flips], piles: HALL.coffin.map(([x, y]) => x + ',' + y + ',3') };
}
const czNearCoffin = Wd => Wd.units.some(u => u.alive && u.side === 0 && Math.hypot(u.x - HALL.king.x, u.y - HALL.king.y) <= HALL.near);
function czEvTick(Wd){
  const C = S.camp; if (!C || C.end || C.s !== 5 || !Wd.camp || Wd.over || TK) return; const E = ((C.stages || {})[5] || {}).cz; if (!E) return;
  const al = Wd.units.filter(u => u.alive && u.side === 0); if (!al.length) return;
  if (E.st === 'coffin' || E.st === 'open'){
    if (E.t0 == null) E.t0 = Wd.t;
    const nd = Math.min(...al.map(u => Math.hypot(u.x - HALL.king.x, u.y - HALL.king.y))); if (nd <= 4) E.near = true;
    const nb = nd <= HALL.near; if (nb !== !!Wd.coffinNear){ Wd.coffinNear = nb; campBarRender(true); }
    if ((E.near && nd > HALL.far) || Wd.t - E.t0 > HALL.wait) czRise(Wd, E);   // 관의 시야를 벗어나는 순간 (가까이 갔던 뒤) · 너무 오래 머뭇거려도
    return; }
  if (E.st === 'fight'){ const k = Wd.units.find(u => u.brain === 'cesar'); if (!k || !k.alive) czFall(Wd, E); }
}
function czOpenCoffin(){
  const C = S.camp, E = C && ((C.stages || {})[5] || {}).cz; if (!E || E.st !== 'coffin' || !world || !czNearCoffin(world)) return;
  E.st = 'open'; E.near = true; logEv(world, { k: 'czCoffin' }); save(); campBarRender(true);
  talkLines([{ narr: '관 뚜껑이 무겁게 밀려납니다.' }, { narr: '늙은 왕이 누워 있습니다. 앙상한 손이 검을 쥐고 있습니다.', img: 'C-045_face2d' }, { narr: '머리 위의 왕관만은 녹슬지 않았습니다.', img: 'C-045_face2d' }, { narr: '죽어 있습니다. 확실히.' }, { narr: '관을 닫았습니다. 왕의 무덤이라면, 어딘가 출구가 있을 텐데요.' }]);
}
function czRise(Wd, E){
  E.st = 'fight'; Wd.holdClear = true;
  const p = { ...foeOf('세자르'), id: uid(), x: HALL.king.x, y: HALL.king.y + 1.4 }; lockIdentity(p); S.units.push(p); const u = addUnit(Wd, p);
  const n = Wd.units.filter(o => o.alive && o.side === 0).sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y))[0]; if (n) u.fg = u.face = Math.atan2(n.y - u.y, n.x - u.x);
  logEv(Wd, { k: 'czRise', a: u.i }); save(); campBarRender(true);
  talkLines([{ narr: '관이 덜컹거립니다.' }, { narr: '툭.' }, { narr: '기둥, 돌, 그리고 당신들은 그에게 불경합니다.', img: 'C-045_face2d' }, { narr: '폐하의 앙상한 팔이 분노로 일그러집니다.', img: 'C-045_face2d' }]);
}
function czFall(Wd, E){
  E.st = 'stairs'; Wd.holdClear = false; S.holdClear = false; Wd.stairs = { ...HALL.stairs };
  for (const [x, y] of HALL.coffin){ Wd.map.t[y * Wd.map.W + x] = 0; if (Wd.map.pk) Wd.map.pk[y * Wd.map.W + x] = 0; } S.piles = []; S.camp.stages[5].piles = []; rebuildMap();
  checkEnd(Wd); logEv(Wd, { k: 'czFall' }); save(); campBarRender(true);
  talkLines([{ narr: Wd.snow ? '왕이 무너지자 눈이 멎습니다.' : '왕이 무너졌습니다.' }, { narr: '빈 관 바닥이 비스듬히 꺼져 있습니다.' }, { narr: '아래로 이어지는 계단.' }, { narr: '관이 다음 층의 입구였습니다.' }]);
}
// 관 속의 왕관 (반짝임) · 계단
function drawHall(Wd, ox, oy, ts){
  const E = (((S.camp || {}).stages || {})[5] || {}).cz; if (!E) return; const k = HALL.king, p = { x: ox + k.x * ts, y: oy + k.y * ts };
  if (E.st === 'coffin' || E.st === 'open'){ const s = ts * 0.22, f = 0.55 + 0.45 * Math.sin(performance.now() / 400); ctx.save(); ctx.globalAlpha = f; ctx.fillStyle = '#e8c35a';
    ctx.beginPath(); ctx.moveTo(p.x - s, p.y + s * 0.4); ctx.lineTo(p.x - s, p.y - s * 0.4); ctx.lineTo(p.x - s * 0.5, p.y); ctx.lineTo(p.x, p.y - s * 0.6); ctx.lineTo(p.x + s * 0.5, p.y); ctx.lineTo(p.x + s, p.y - s * 0.4); ctx.lineTo(p.x + s, p.y + s * 0.4); ctx.closePath(); ctx.fill(); ctx.restore(); }
  if (Wd.stairs){ const q = { x: ox + Wd.stairs.x * ts, y: oy + Wd.stairs.y * ts }; ctx.save(); ctx.fillStyle = '#0b090c'; ctx.fillRect(q.x - ts * 0.95, q.y - ts * 0.45, ts * 1.9, ts * 0.9);
    for (let i = 0; i < 4; i++){ ctx.fillStyle = `rgba(150,130,110,${(0.55 - i * 0.12).toFixed(2)})`; ctx.fillRect(q.x - ts * 0.85 + i * ts * 0.12, q.y - ts * 0.38 + i * ts * 0.2, ts * 1.7 - i * ts * 0.24, ts * 0.1); }
    ctx.strokeStyle = '#c9a24a'; ctx.lineWidth = 1.5; ctx.strokeRect(q.x - ts * 0.95, q.y - ts * 0.45, ts * 1.9, ts * 0.9); ctx.restore(); }
}""")
rep("  const RL = def.ruin ? (st.ruin || (st.ruin = ruinLayout(st.seed))) : null;   // v7.23 4S 유적",
    "  const RL = def.ruin ? (st.ruin || (st.ruin = ruinLayout(st.seed))) : null;   // v7.23 4S 유적\n  const HL = def.hall ? hallLayout() : null; if (HL && !st.cz) st.cz = { st: 'coffin', t0: null, near: false };   // v7.23.1 5S 알현실 (관 속의 왕)")
rep("else Object.assign(S, { indoor: false, zones: [], sandY: null });",
    "else if (HL) Object.assign(S, { W: HL.W, H: HL.H, amb: HALL.amb, randStart: false, flips: HL.flips.slice(), torches: [], terr: '', piles: st.cz.st === 'stairs' ? [] : HL.piles.slice(), hills: [], indoor: true, zones: [], sandY: null, holdClear: st.cz.st !== 'stairs' }); else Object.assign(S, { indoor: false, zones: [], sandY: null });\n  if (!HL) S.holdClear = false;")
rep(": (E3 ? (E3.fight != null ? def.pick[E3.fight][1] : []) : def.foes).flatMap", ": HL ? [] : (E3 ? (E3.fight != null ? def.pick[E3.fight][1] : []) : def.foes).flatMap")
rep("selId = null; rebuildMap(); setMapUI(); save(); start(); renderFloors();", "selId = null; rebuildMap(); setMapUI(); save(); start(); renderFloors();\n  if (HL && st.cz.st === 'stairs') world.stairs = { ...HALL.stairs };   // v7.23.1 계단은 그대로")
rep("  const RN = RL && !st.seen ? ", "  const RN = HL && !st.seen ? [{ narr: '천장이 보이지 않을 만큼 높습니다. 가운데에 관 하나.' }] : RL && !st.seen ? ")
rep("S.indoor = false; S.zones = []; S.sandY = null;", "S.indoor = false; S.zones = []; S.sandY = null; S.holdClear = false;")
# 캠프 막대: 5S 는 계단이 나오기 전엔 위로 못 감 · 관을 연다
rep("  const h = `<b>1F · ${def.name}</b>", "  let h = `<b>1F · ${def.name}</b>")
rep("  if (h !== campBarH || el.hidden){", """  if (C.s === 5 && W){ const E = ((C.stages || {})[5] || {}).cz; if (!W.stairs) h = h.replace(/<button[^>]*data-cexit="up"[^>]*>[^<]*<\\/button>/, ''); if (E && E.st === 'coffin' && czNearCoffin(W)) h = h.replace('<span class="cb">', '<span class="cb"><button class="btn sm go" type="button" data-ccoffin="1" title="관 뚜껑을 밀어 엶">⚰ 관을 연다</button>'); }   // v7.23.1
  if (h !== campBarH || el.hidden){""")
rep("  if (b.dataset.ctalk){ encTalk(); return; }   // v7.22", "  if (b.dataset.ctalk){ encTalk(); return; }   // v7.22\n  if (b.dataset.ccoffin){ czOpenCoffin(); return; }   // v7.23.1")
rep("encTick(Wd); khTick(Wd); }", "encTick(Wd); khTick(Wd); czEvTick(Wd); }")

# 그리기: 관 (더미 3) · 왕관 · 계단 · 동상 · 효과
rep("    if (k === 1){ g.fillStyle = '#33343b';", """    if (k === 3){ const lf = pileAt(m, x - 0.5, y + 0.5) === 3, rt = pileAt(m, x + 1.5, y + 0.5) === 3, x0 = x * P + (lf ? 0 : 3), x1 = x * P + P - (rt ? 0 : 3);   /* v7.23.1 관 */
      g.fillStyle = '#2b1d16'; g.fillRect(x0, y * P + 5, x1 - x0, P - 10); g.fillStyle = '#4a3326'; g.fillRect(x0 + 2, y * P + 7, x1 - x0 - 4, P - 14); g.strokeStyle = '#c9a24a'; g.lineWidth = 1.5; g.strokeRect(x0 + 1, y * P + 6, x1 - x0 - 2, P - 12); continue; }
    if (k === 1){ g.fillStyle = '#33343b';""")
rep("  for (const u of Wd.units) if (!u.alive && !u.gone && !(u.side === 0 && u.posUnk", "  if (S.camp && S.camp.s === 5 && Wd.camp) drawHall(Wd, ox, oy, ts);   // v7.23.1 관 속의 왕관 · 계단\n  for (const u of Wd.units) if (!u.alive && !u.gone && !(u.side === 0 && u.posUnk")
rep("ctx.fillText('🔥', px + r * 0.62, py + r * 0.55); ctx.restore(); }   // v6.7 화상 (초상화 오른쪽 아래)",
    "ctx.fillText('🔥', px + r * 0.62, py + r * 0.55); ctx.restore(); }   // v6.7 화상 (초상화 오른쪽 아래)\n    if (!ed && vis && u.alive && now < (u.frostT || -9)){ const fs = Math.max(11, Math.min(16, r * 0.5)); ctx.save(); ctx.globalAlpha = 0.85; ctx.font = `${fs}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('❄', px - r * 0.62, py + r * 0.55); ctx.strokeStyle = 'rgba(160,215,255,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, r * 1.08, 0, 6.283); ctx.stroke(); ctx.restore(); }   // v7.23.1 동상 (왼쪽 아래 · 푸른 서리)")
rep("    } else if (f.k === 'num' && age < 0.9){", """    } else if (f.k === 'czWarn' && age < f.dur){   // v7.23.1 세자르 원형 베기 예고 (하늘색 원)
      const a = Wd.units[f.a]; if (a && a.alive && (a.side === 0 || a.seenBy || $('seeAll').checked)){ const p = { x: ox + a.x * ts, y: oy + a.y * ts }, q = age / f.dur; ctx.strokeStyle = `rgba(160,215,255,${(0.35 + 0.4 * q).toFixed(2)})`; ctx.lineWidth = 2; ctx.setLineDash([ts * 0.2, ts * 0.12]); ctx.beginPath(); ctx.arc(p.x, p.y, f.r * ts, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = `rgba(160,215,255,${(0.08 + 0.12 * q).toFixed(2)})`; ctx.fill(); }
    } else if (f.k === 'czSpin' && age < 0.35){   // 원형 베기
      const p = { x: ox + f.x * ts, y: oy + f.y * ts }, q = age / 0.35; ctx.strokeStyle = `rgba(220,240,255,${(1 - q).toFixed(2)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p.x, p.y, f.r * ts * (0.6 + 0.4 * q), 0, 6.283); ctx.stroke();
    } else if (f.k === 'ghost' && age < 0.3){   // 잔상 (돌진 · 우회 · 빈틈 찌르기)
      const a = Wd.units[f.a]; if (a && (a.side === 0 || a.seenBy || $('seeAll').checked)){ ctx.fillStyle = `rgba(170,200,255,${(0.35 * (1 - age / 0.3)).toFixed(2)})`; ctx.beginPath(); ctx.arc(ox + f.x * ts, oy + f.y * ts, (a.r || 0.4) * ts, 0, 6.283); ctx.fill(); }
    } else if (f.k === 'num' && age < 0.9){""")
rep('    ${!ed && u.alive && u.burn && Wd.t < u.burn.until ? `<span class="tr" style="color:#ff9a86"><span class="lb">화상</span>',
    '    ${!ed && u.alive && Wd.t < (u.frostT || -9) ? `<span class="tr" style="color:#9fd0ff"><span class="lb">동상</span> ❄ 걸음 ×0.55 · 준비 느림 · ${f2(u.frostT - Wd.t)}초</span>` : \'\'}\n    ${!ed && u.alive && u.burn && Wd.t < u.burn.until ? `<span class="tr" style="color:#ff9a86"><span class="lb">화상</span>')
# 로그 · 이야기
rep("      case 'khCome': out.push(", """      case 'czCoffin': out.push(`${T(e)}⚰ 관을 엶 — 늙은 왕이 누워 있음`); break;   // v7.23.1
      case 'czRise': out.push(`${T(e)}👑 ${n(e.a)} 일어남 — 관 속의 왕`); break;
      case 'czFall': out.push(`${T(e)}👑 왕이 무너짐 — 빈 관 바닥에 계단`); break;
      case 'czWake': out.push(`${T(e)}👑 ${n(e.a)} 깨어남`); break;
      case 'czMode': out.push(`${T(e)}👑 ${n(e.a)} ${e.fury ? '휘몰아침 (딜타임)' : '간격을 잼 (탐색)'}`); break;
      case 'czStart': out.push(`${T(e)}👑 ${n(e.a)} — ${CZ_NM[e.s] || e.s}${e.punish ? ' (빈틈)' : ''}${e.b != null ? ' → ' + n(e.b) : ''}`); break;
      case 'czSpin': out.push(`${T(e)}🌀 원형 베기 — ${e.n}명`); break;
      case 'czShoulder': out.push(`${T(e)}💥 어깨 박치기${e.miss ? ' — 빗나감' : ' → ' + n(e.b)}`); break;
      case 'czBack': out.push(`${T(e)}↩ 뒷걸음 점프 ${e.n}`); break;
      case 'czPunish': out.push(`${T(e)}👑 빈틈 — ${n(e.b)}`); break;
      case 'czCombo': out.push(`${T(e)}⚔ 연격 ${e.n}번 → ${n(e.b)}`); break;
      case 'czBreak': out.push(`${T(e)}👑 ${CZ_NM[e.s] || e.s} 끊김`); break;
      case 'dcounter': out.push(`${T(e)}↺ ${ga(n(e.a))} 피하며 되벰 → ${n(e.b)} (확정 치명)`); break;
      case 'frost': out.push(`${T(e)}❄ ${n(e.b)} 동상 ${e.sec}초`); break;
      case 'sever': out.push(`${T(e)}🩸 ${n(e.b)} 절단 — 피를 흘림`); break;
      case 'khCome': out.push(""")
rep("    case 'khCome': return { c: 'bad', s: '피할 수 없는 죽음이 찾아왔다.' };   // v7.22.3",
    """    case 'khCome': return { c: 'bad', s: '피할 수 없는 죽음이 찾아왔다.' };   // v7.22.3
    case 'czMode': return e.fury ? { c: 'bad', s: '👑 세자르가 휘몰아친다' } : null;   // v7.23.1
    case 'czSpin': return e.n ? { c: 'bad', s: `🌀 세자르의 원형 베기 — ${e.n}명이 베였다.` } : null;
    case 'czPunish': return { c: 'bad', s: `빈틈 — 세자르가 ${n(e.b)}에게 파고든다!` };
    case 'czCombo': return { c: 'bad', s: `⚔ 세자르의 연격 (${e.n}번)` };
    case 'czBreak': return { c: 'good', s: `세자르의 ${CZ_NM[e.s] || e.s} — 끊겼다!` };
    case 'dcounter': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 피하며 곧바로 되벤다!` };""")
rep("const ACTIVE = {\n", "const CZ_NM = { spin: '원형 베기', shoulder: '어깨 박치기', backs: '뒷걸음 점프', rush: '돌진', flank: '우회' };   // v7.23.1 세자르의 동작 이름\nconst ACTIVE = {\n")

# v1.1 기술 막대 특수 1 · 2 의 기본 아이콘 (고른 이가 없거나 그 기술이 없을 때 "undefined" 로 보이던 것 — v7.19.1 부터) · 알현실은 더 밝게
rep("const SLOT_IC = { charge: '💨', throw: '🔱', leap: '⤴', skill: '✚', palm: '💥' };", "const SLOT_IC = { charge: '💨', throw: '🔱', leap: '⤴', skill: '✚', palm: '💥', spec1: '★', spec2: '★' };   // v7.23.1 특수 칸 기본 아이콘")
rep("stairs: { x: 14, y: 11.5, r: 0.9 }, amb: 0.6,", "stairs: { x: 14, y: 11.5, r: 0.9 }, amb: 0.85,")

open(F, 'w', encoding='utf-8').write(s)
print('page7231 OK')
