# v7.23.0 페이지 — page7230.py v1.2 (v1.2: 유적 나레이션은 따라온 이의 나레이션 뒤에 이어서 · v1.1: 사막 햇살 0.45 — 모바일에서 너무 어두움 · 6단계 4S 실내전: 유적 맵 (하얀 사막의 끝 · 유적 정면 · 입구의 곤봉적 · 가운데 복도 + 양옆 방 · 알현실 문) · 방 지킴이 넷 · 실내 그리기 (지금 보이는 곳만 밝게 · 돌벽 · 돌바닥 · 모래) · 로그 · 5S 는 세자르 전까지 기사 셋)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.22.4 (2026-10-18)', '<!-- 굴의 전투판 v7.23.0 (2026-10-18)')
rep('     v7.22.4: ', '''     v7.23.0: 6단계 시작 — 4S 알현실 입구 (실내전). 아래 하얀 사막의 끝 (햇살 0.45 · 무너진 담) → 유적 정면 (입구 4칸 · 1F 유일의 곤봉적이 지킴)
         → 안 (미약한 빛 · 가운데 복도 + 양옆 방 · 씨앗마다 합친 방 · 문틈 · 기둥 · 무더기가 다름) → 맨 위 알현실 문 (= 5S).
         방 지킴이 넷 (검기사 둘 · 검방패기사 · 궁수): 방 안 어둠에 숨어 문 쪽을 봄 — 방마다 따로 · 가까이 오면 · 맞으면 · 같은 방이 싸우면 · 들킨 걸 느끼면 덮침.
         문틈으로 우리를 보면 문 옆 모퉁이에 붙어 기다리고, 오지 않으면 (지나쳐 가면) 어둠 속으로 뒤따름 (등 뒤 · 들키지 않으면 암살).
         실내 규칙 (실내 맵만): 벽이 시야를 자름 — 지금 보이는 곳만 밝게, 나머지는 기억한 모습. 가 본 곳도 보이는 칸만. 구역 빛 (사막 끝 햇살 · 안의 미약한 빛).
         5S 의 곤봉적은 4S 입구로 (5S 는 세자르 전까지 기사 셋).
     v7.22.4: ''')
rep('h1::after{content:" v7.22.4"', 'h1::after{content:" v7.23.0"')
rep('<footer>굴의 전투판 v7.22.4', '<footer>굴의 전투판 v7.23.0')
rep('return `굴의 전투판 v7.22.4 · ${title}', 'return `굴의 전투판 v7.23.0 · ${title}')
rep("copyText('굴의 전투판 v7.22.4 자동 판 기록", "copyText('굴의 전투판 v7.23.0 자동 판 기록")
rep('의 버전 기록에 — v7.22.4 따라온 누군가', '의 버전 기록에 — v7.23.0 4S 유적 (실내전) / v7.22.4 따라온 누군가')
rep('">v7.22.4 · 1F 인카운터 · 5단계</span>', '">v7.23.0 · 1F 4S 유적 · 6단계</span>')
rep("ver: '7.22.4', at:", "ver: '7.23.0', at:")

# 4S · 5S
rep("  { name: '4S', kind: '알현실 입구', note: '약한 햇살이 드는 유적 입구 — 정예와 매복 (실내전은 6단계)', foes: [['검기사', 2], ['궁수', 1]], torches: 3 },\n  { name: '5S', kind: '알현실', note: '문을 지키는 1F 유일의 곤봉적 (세자르는 6단계)', foes: [['곤봉적', 1], ['검방패기사', 1], ['창병', 1]] }];",
    """  { name: '4S', kind: '알현실 입구', note: '하얀 사막의 끝 — 입구를 지키는 곤봉적 · 안은 방마다 숨은 적 (실내전)', ruin: true },   // v7.23 유적 (ruinLayout)
  { name: '5S', kind: '알현실', note: '세자르의 알현실 — 세자르는 다음 판 (지금은 기사 셋)', foes: [['검방패기사', 1], ['창병', 1], ['검기사', 1]] }];
// v7.23 4S 유적 (알현실 입구): 30 × 36 — 아래 하얀 사막의 끝 (햇살 · 무너진 담) · 유적 정면 (입구 4칸 · 곤봉적) · 안 = 가운데 복도 + 양옆 방 (씨앗마다 합친 방 · 문틈 · 기둥 · 무더기가 다름) · 맨 위 알현실 문 (2칸)
const RUIN = { W: 30, H: 36, face: 22, gate: [13, 16], door: [14, 15], sun: 0.45, dim: 0.04, foes: ['검기사', '검기사', '검방패기사', '궁수'] };
function ruinLayout(seed){
  const R = mulberry32((seed ^ 0x4a11) >>> 0), { W, H, face } = RUIN, wall = new Set(), piles = [], key = (x, y) => x + ',' + y;
  const put = (x, y) => { if (x >= 0 && y >= 0 && x < W && y < H) wall.add(key(x, y)); }, del = (x, y) => wall.delete(key(x, y)), isW = (x, y) => wall.has(key(x, y)), isP = (x, y) => piles.some(p => p[0] === x && p[1] === y);
  for (let x = 0; x < W; x++){ put(x, 0); put(x, face); }   // 위 끝 벽 (알현실 문만 뚫림) · 유적 정면
  for (let y = 0; y <= face; y++){ put(0, y); put(W - 1, y); put(11, y); put(18, y); }   // 바깥 벽 · 복도 양쪽 벽
  for (const x of RUIN.door) del(x, 0); for (let x = RUIN.gate[0]; x <= RUIN.gate[1]; x++) del(x, face);
  const rooms = [];
  for (const side of [0, 1]){ const xa = side ? 19 : 1, xb = side ? 28 : 10, wx = side ? 18 : 11, cut = [7, 14].filter(() => R() > 0.3);   // 가로 벽 (가끔 빠져 방이 합쳐짐)
    for (const dy of cut) for (let x = xa; x <= xb; x++) put(x, dy);
    const ys = [0, ...cut, face]; for (let k = 0; k + 1 < ys.length; k++) rooms.push({ id: (side ? 'R' : 'L') + k, side, x0: xa, x1: xb, y0: ys[k] + 1, y1: ys[k + 1] - 1, wx }); }
  for (const r of rooms){ const w2 = R() < 0.4 ? 2 : 1, h = r.y1 - r.y0 + 1, dy = r.y0 + 1 + Math.floor(R() * Math.max(1, h - 1 - w2)); for (let k = 0; k < w2; k++) del(r.wx, dy + k); r.door = { x: r.wx + 0.5, y: dy + w2 / 2 }; r.dy = dy; r.dw = w2; }   // 복도 쪽 문틈 (폭 1 ~ 2)
  for (const a of rooms) for (const b of rooms) if (a.side === b.side && b.y0 === a.y1 + 2 && R() < 0.45) del(a.x0 + 1 + Math.floor(R() * (a.x1 - a.x0 - 1)), a.y1 + 1);   // 이웃 방 사이 문틈
  for (const y of [4, 10, 16]) if (R() < 0.6){ put(13, y); put(16, y); }   // 복도 기둥
  for (const r of rooms){ const n = Math.floor(R() * 3); for (let k = 0, t = 0; k < n && t < 40; t++){ const x = r.x0 + Math.floor(R() * (r.x1 - r.x0 + 1)), y = r.y0 + Math.floor(R() * (r.y1 - r.y0 + 1)); if (Math.hypot(x + 0.5 - r.door.x, y + 0.5 - r.door.y) < 3 || isW(x, y) || isP(x, y)) continue; piles.push([x, y, R() < 0.6 ? 1 : 2]); k++; } }   // 방 안 무더기 (엄폐)
  const segs = []; for (let k = 0, t = 0; k < 6 && t < 80; t++){ const hz = R() < 0.6, L = 2 + Math.floor(R() * 3), x = 1 + Math.floor(R() * (W - 2 - (hz ? L : 0))), y = face + 2 + Math.floor(R() * (H - face - 5 - (hz ? 0 : L))), cells = [];   // 사막 끝의 무너진 담
    for (let i = 0; i < L; i++) cells.push(hz ? [x + i, y] : [x, y + i]);
    if (cells.some(([cx, cy]) => isW(cx, cy) || (Math.abs(cx + 0.5 - W / 2) < 3 && cy <= face + 3) || cy >= H - 2)) continue; for (const [cx, cy] of cells) put(cx, cy); segs.push(cells); k++; }
  for (let k = 0; k < 3; k++){ const x = 2 + Math.floor(R() * (W - 4)), y = face + 3 + Math.floor(R() * (H - face - 6)); if (!isW(x, y) && !isP(x, y)) piles.push([x, y, 1]); }
  const reach = () => { const seen = new Set([key(15, H - 1)]), q = [[15, H - 1]]; while (q.length){ const [x, y] = q.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const nx = x + dx, ny = y + dy, kk = key(nx, ny); if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen.has(kk) || isW(nx, ny) || isP(nx, ny)) continue; seen.add(kk); q.push([nx, ny]); } } return seen; };
  for (let t = 0; t < 12; t++){ const ok = reach(); if (RUIN.door.every(x => ok.has(key(x, 0))) && rooms.every(r => ok.has(key(r.wx, r.dy)))) break; const sg = segs.pop(); if (sg) for (const [cx, cy] of sg) del(cx, cy); else piles.splice(0, piles.length); }   // 알현실 문 · 모든 방에 닿게
  const torches = []; for (let t = 0; t < 60 && torches.length < 2; t++){ const x = R() < 0.5 ? 12 : 17, y = 2 + Math.floor(R() * 18); if (isW(x, y) || torches.some(q => Math.abs(q.y - y - 0.5) < 8)) continue; torches.push({ x: x + 0.5, y: y + 0.5 }); }   // 복도의 화로 둘
  const order = rooms.slice().sort(() => R() - 0.5), foes = [{ k: '곤봉적', x: +(14.4 + R()).toFixed(2), y: face + 2.2 }];   // 입구를 지키는 곤봉적 (햇살 안)
  RUIN.foes.forEach((k, j) => { const r = order[j % order.length], c = [];
    for (let y = r.y0; y <= r.y1; y++) for (let x = r.x0; x <= r.x1; x++){ const d = Math.hypot(x + 0.5 - r.door.x, y + 0.5 - r.door.y); if (isW(x, y) || isP(x, y) || d < 3 || d > 7.5 || Math.abs(y + 0.5 - r.door.y) < 1.3 || foes.some(f => Math.hypot(f.x - x - 0.5, f.y - y - 0.5) < 1.5)) continue; c.push([x, y]); }
    const p = c.length ? c[Math.floor(R() * c.length)] : [Math.round((r.x0 + r.x1) / 2), Math.round((r.y0 + r.y1) / 2)], up = p[1] + 0.5 < r.door.y;
    foes.push({ k, x: p[0] + 0.5, y: p[1] + 0.5, warden: { room: r.id, door: { ...r.door }, corner: { x: r.side ? r.wx + 1.5 : r.wx - 0.5, y: up ? r.dy - 0.5 : r.dy + r.dw + 0.5 } } }); });   // 문 옆 모퉁이 = 지킴이와 같은 쪽
  return { W, H, sandY: face, flips: [...wall], piles: piles.map(p => p.join(',')), torches, foes, rooms: rooms.map(r => ({ id: r.id, x0: r.x0, x1: r.x1, y0: r.y0, y1: r.y1, door: r.door })),
    zones: [{ x0: 0, y0: face, x1: W - 1, y1: H - 1, amb: RUIN.sun }, { x0: 1, y0: 1, x1: W - 2, y1: face - 1, amb: RUIN.dim }] };
}""")
rep("  Object.assign(S, { type: 'grid', W: (NP && NP.map.W) || 32,", "  const RL = def.ruin ? (st.ruin || (st.ruin = ruinLayout(st.seed))) : null;   // v7.23 4S 유적\n  Object.assign(S, { type: 'grid', W: (NP && NP.map.W) || 32,")
rep("water: NP ? clone(NP.map.water) : [] });   // v7.22 장면 인물 맵 (물 · 불빛 · 더미)",
    "water: NP ? clone(NP.map.water) : [] });   // v7.22 장면 인물 맵 (물 · 불빛 · 더미)\n  if (RL) Object.assign(S, { W: RL.W, H: RL.H, amb: 0, randStart: false, flips: RL.flips.slice(), torches: clone(RL.torches), terr: '', piles: st.piles || RL.piles.slice(), hills: [], indoor: true, zones: clone(RL.zones), sandY: RL.sandY }); else Object.assign(S, { indoor: false, zones: [], sandY: null });   /* v7.23 실내 (벽이 시야를 자름) · 구역 빛 */")
rep("  const foes = st.seen ? (st.foes || []).map(f => ({ ...clone(f), id: uid() })) : (E3 ?",
    "  const foes = st.seen ? (st.foes || []).map(f => { const o = { ...clone(f), id: uid() }; delete o.warden; return o; }) : RL ? RL.foes.map(f => ({ ...foeOf(f.k), id: uid(), x: f.x, y: f.y, ...(f.warden ? { warden: clone(f.warden) } : {}) })) : (E3 ?")   # v7.23 다시 오면 지킴이는 풀린 채
rep("  campPlace(m, party, up ? 0.5 : S.H - 3, up ? 3 : S.H - 0.5, Math.max(1, S.W / 2 - 6), Math.min(S.W - 1, S.W / 2 + 6));   // v7.22.2 맵 크기에 맞춤\n  if (!st.seen) campPlace(m, foes, 2, S.H - 8, 2, S.W - 2);",
    "  campPlace(m, party, up ? 0.5 : S.H - 3, up ? 3 : S.H - 0.5, RL && up ? 12 : Math.max(1, S.W / 2 - 6), RL && up ? 18 : Math.min(S.W - 1, S.W / 2 + 6));   // v7.22.2 맵 크기에 맞춤   // v7.23 유적 위쪽은 복도로\n  if (!st.seen && !RL) campPlace(m, foes, 2, S.H - 8, 2, S.W - 2);")
rep("  if (C.follow){ const f = C.follow; delete C.follow; logEv(world, { k: 'encFollow', name: f.name, tx: f.t }); setTimeout(() => talkLines([{ narr: f.t, img: f.img }]), 350); }",
    "  const RN = RL && !st.seen ? [{ narr: '하얀 사막이 끝나는 곳. 무너진 담 너머로 유적의 입구가 보인다.' }, { narr: '입구 안쪽은 미약한 빛뿐이다. 무언가 숨을 죽이고 있다.' }] : [];   // v7.23 유적에 들어섬 (따라온 이의 나레이션 뒤에 이어서)\n  if (C.follow){ const f = C.follow; delete C.follow; logEv(world, { k: 'encFollow', name: f.name, tx: f.t }); setTimeout(() => talkLines([{ narr: f.t, img: f.img }, ...RN]), 350); } else if (RN.length) setTimeout(() => talkLines(RN), 350);")
rep("S.water = (B && B.water) || []; S.amb = (B && B.amb) || 0;   // v7.22 얕은 물은 캠페인 맵에만",
    "S.water = (B && B.water) || []; S.amb = (B && B.amb) || 0; S.indoor = false; S.zones = []; S.sandY = null;   // v7.22 얕은 물은 캠페인 맵에만   // v7.23 실내 · 구역 빛도")

# 그리기: 실내 = 지금 보이는 곳만 밝게
rep("  const D = lightImg.data;\n", "  const D = lightImg.data, vNow = Wd.map && Wd.map.indoor && !ed && !see && Wd.visNow && Wd.visNow.length === S.W * S.H ? Wd.visNow : null;   // v7.23 실내: 지금 안 보이는 칸은 기억한 모습만\n")
rep("    let b = Wd.light[i]; const e = Wd.explored[i];", "    let b = vNow && !vNow[i] ? 0 : Wd.light[i]; const e = Wd.explored[i];")
rep("  for (const s of lightSourcesOf(Wd)){\n", "  for (const s of lightSourcesOf(Wd)){ if (vNow && !vNow[(s.y | 0) * S.W + (s.x | 0)]) continue;   // v7.23 벽 너머 불빛은 안 보임\n")
rep("  for (const t of Wd.torches){ const tx = ox + t.x * ts, ty = oy + t.y * ts;   // v7.8 꺼진 횃불\n",
    "  for (const t of Wd.torches){ const tx = ox + t.x * ts, ty = oy + t.y * ts;   // v7.8 꺼진 횃불\n    if (vNow && !vNow[(t.y | 0) * S.W + (t.x | 0)] && !Wd.explored[(t.y | 0) * S.W + (t.x | 0)]) continue;   // v7.23 실내: 못 본 화로\n")
rep("(u.side === 0 || litAt(Wd, u.x, u.y) || $('seeAll').checked)) drawCorpse(Wd, u, ox, oy, ts);",
    "(u.side === 0 || (litAt(Wd, u.x, u.y) && !(Wd.map.indoor && Wd.visNow && !Wd.visNow[(u.y | 0) * S.W + (u.x | 0)])) || $('seeAll').checked)) drawCorpse(Wd, u, ox, oy, ts);")
# 그리기: 유적 바닥 · 모래 · 돌벽
rep("    const r = MAP.t[y * S.W + x] === 1 ? 1 : 0;   // v7.18 더미 칸은 바닥 위에 따로 그림\n",
    "    if (MAP.indoor){ ruinCell(g, x, y, P, R); continue; }   // v7.23 유적: 돌바닥 · 모래 · 돌벽\n    const r = MAP.t[y * S.W + x] === 1 ? 1 : 0;   // v7.18 더미 칸은 바닥 위에 따로 그림\n")
rep("// v7.18 지형 그림: 언덕 = 높이만큼 밝게",
    """// v7.23 유적 칸: 바닥 = 돌판 (안) · 하얀 모래 (sandY 아래) / 벽 = 돌벽 (줄눈 · 앞면 밝게)
function ruinCell(g, x, y, P, R){
  const X = x * P, Y = y * P;
  if (MAP.t[y * S.W + x] !== 1){
    if (S.sandY != null && y > S.sandY){ g.fillStyle = (x * 7 + y * 3) % 5 ? '#6f6656' : '#776d5c'; g.fillRect(X, Y, P, P); for (let k = 0; k < 4; k++){ g.fillStyle = `rgba(${R() < .5 ? '255,250,235' : '40,30,20'},${(0.04 + R() * 0.05).toFixed(3)})`; g.fillRect(X + R() * P, Y + R() * P, 2 + R() * 3, 1 + R() * 2); } }
    else { g.fillStyle = (x + y) % 2 ? '#34302c' : '#3b3631'; g.fillRect(X, Y, P, P); g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1.5; g.strokeRect(X + 1, Y + 1, P - 2, P - 2); if (R() < 0.25){ g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 1; g.beginPath(); g.moveTo(X + R() * P, Y + R() * P); g.lineTo(X + R() * P, Y + R() * P); g.stroke(); } }
    return; }
  g.fillStyle = '#26222b'; g.fillRect(X, Y, P, P);
  const o = (y % 2) * P / 2; g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(X, Y + P / 2); g.lineTo(X + P, Y + P / 2); g.moveTo(X + (P / 2 + o) % P, Y); g.lineTo(X + (P / 2 + o) % P, Y + P / 2); g.moveTo(X + o, Y + P / 2); g.lineTo(X + o, Y + P); g.stroke();
  const open = (dx, dy) => !rock(MAP, x + dx, y + dy);
  g.fillStyle = '#4d4655'; if (open(0, 1)) g.fillRect(X, Y + P - 7, P, 7);
  g.fillStyle = '#35303b'; if (open(0, -1)) g.fillRect(X, Y, P, 3); if (open(1, 0)) g.fillRect(X + P - 3, Y, 3, P); if (open(-1, 0)) g.fillRect(X, Y, 3, P);
}
// v7.18 지형 그림: 언덕 = 높이만큼 밝게""")
# 로그 · 이야기
rep("      case 'khCome': out.push(", "      case 'wardenOut': out.push(`${T(e)}🚪 ${e.room ? e.room + ' 방' : ''} 지킴이 ${e.n} 덮침 — ${e.why === 'near' ? (e.b != null ? ga(n(e.b)) + ' 가까이 옴' : '가까이 옴') : e.why === 'hit' ? '맞음' : e.why === 'mate' ? '같은 방이 싸움' : e.why === 'seen' ? '들킨 걸 느낌' : '지나쳐 감 — 어둠 속으로 뒤따름'}`); break;   // v7.23\n      case 'wardenCorner': out.push(`${T(e)}🚪 ${ga(n(e.a))} 문 옆 모퉁이에 붙어 기다림`); break;\n      case 'khCome': out.push(")
rep("    case 'khCome': return { c: 'bad', s: '피할 수 없는 죽음이 찾아왔다.' };   // v7.22.3",
    "    case 'khCome': return { c: 'bad', s: '피할 수 없는 죽음이 찾아왔다.' };   // v7.22.3\n    case 'wardenOut': return e.why === 'pass' || (!e.vis && e.why !== 'near') ? null : { c: 'bad', s: e.why === 'near' ? '방 안 어둠에 숨어 있던 적이 덮쳐 온다!' : e.why === 'seen' ? '들킨 걸 알아챈 적이 방에서 뛰쳐나온다!' : e.why === 'hit' ? '맞은 적의 방에서 숨어 있던 적이 일어선다!' : '싸움 소리에 같은 방의 적이 일어선다!' };   // v7.23 (지나쳐 뒤따르는 건 모름)")

open(F, 'w', encoding='utf-8').write(s)
print('page7230 OK')
