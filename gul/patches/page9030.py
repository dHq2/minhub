# v9.3.0 페이지 — page9030.py v1.5 (v1.5: 2층 싸움 칸에는 맵 위 NPC 가 끼지 않음 (명세 C1 — 전투맵과 비전투맵 분리) · v1.4: 비탈이 그림의 계단 구간에만 (계단1: 11.5 → 3줄 · 2.6M / 계단2: 12 → 7줄 · 1.5M — 아래 마당은 평지) · v1.3: 계단 맵은 그려 둔 나가는 곳을 그대로 · v1.2: gstair1 맨 위 줄의 r 다섯 칸을 바닥으로 (위쪽 구석이 섬이 되어 막히던 것) · v1.1: 정해진 자리가 있는 싸움은 randStart 끔 · stairs 를 판 저장 목록에 · v1.0: 2층 대규모 업데이트 4단계 — 2층 배치: 계단 (고지대 판정 · 비탈 그림) · 계단1 창방패병 10 + 장궁병 4 (위쪽 주력 · 아래 U자 둘) · 계단2 반 · 테리 (전우조) · 보스룸 흑익 · 하류 (전우조 · 출구 잠김) · 나머지 싸움은 암계 랜덤 · 열 한 칸 모두 적이 있음)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9020.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.2.0 (2026-10-24)', '<!-- 굴의 전투판 v9.3.0 (2026-10-24)')
rep('     v9.2.0: 2층 대규모 업데이트 3단계', '''     v9.3.0: 2층 대규모 업데이트 4단계 — 2층 배치:
         · 계단은 고지대 판정 (setup.stairs): 올라가는 쪽이 불리 — 걸음 느림 (오르막 × 1.7) · 잘 넘어짐 · 돌격이 힘을 못 얻음 (× 0.7) · 아래에서 위로 쏘면 잘 안 맞음 (높이 보정 × 2.4) / 위에서 막는 쪽은 그대로. 계단 그림 (층계 · 오르막 화살) 을 맵 위에 덧그림
         · 지상 계단1: 창방패병 10 (위쪽 8 + 아래 U자 둘) + 장궁병 4 (맨 위 줄) / 지상 계단2: 반 · 테리만 (전우조) / 보스룸: 흑익 · 하류 (전우조 · 출구 잠김)
         · 나머지 2층 싸움 (유적 입구 · 계단 · 전투룸 1 ~ 3) 은 암계 병사 랜덤 (지나가기 칸은 ×0.7) · 열한 칸 모두 적이 있음 (예전엔 비어 있었음)
     v9.2.0: 2층 대규모 업데이트 3단계''')
for a, b in (('h1::after{content:" v9.2.0"', 'h1::after{content:" v9.3.0"'), ('<footer>굴의 전투판 v9.2.0', '<footer>굴의 전투판 v9.3.0'), ('return `굴의 전투판 v9.2.0 · ${title}', 'return `굴의 전투판 v9.3.0 · ${title}'),
             ("copyText('굴의 전투판 v9.2.0 자동 판 기록", "copyText('굴의 전투판 v9.3.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.2.0 — ${C.run", "o.push(`굴의 전투판 v9.3.0 — ${C.run"),
             ('의 버전 기록에 — v9.2.0 2층의 적 /', '의 버전 기록에 — v9.3.0 2층 배치 (계단 고지대) / v9.2.0 2층의 적 /'),
             ('">v9.2.0 · 2층의 적 (암계 · 망자 · 거인)</span>', '">v9.3.0 · 2층 배치 (계단 고지대 · 거인 · 보스)</span>'),
             ("ver: '9.2.0', kind:", "ver: '9.3.0', kind:"), ("RULES_MIG = '9.2.0',", "RULES_MIG = '9.3.0',")):
    rep(a, b)

# ---- 맵: 계단 비탈 (언덕 합) ----
rep("for (const k of ['ruin2a', 'ruin2b', 'ruin2c', 'gboss1', 'gevent1', 'gstair1', 'gstair2', 'gfight1', 'fmap2', 'fmap3', 'pearl1']) if (MAPS8[k]) MAPS8[k].z = 1;",
    """/* v9.3.0 계단: 아래 (yBot, 높이 0) 에서 위 (yTop) 로 곧게 오르는 비탈 · yEnd 까지 평평한 고지 (hTop M). 가로로는 고르게 (언덕 여럿의 합이라 칸 폭 전체가 같은 높이) */
const stairRamp8 = (x0, x1, yBot, yTop, yEnd, hTop) => { const sy = 2, r = 2.6, sx = 4, c = sy * sx / (r * r * Math.PI), L = [];
  for (let y = yBot + 3; y >= yEnd - 3; y -= sy){ const t = Math.max(0, Math.min(1, (yBot - y) / (yBot - yTop))), h = hTop * t * c; if (h < 0.005) continue; for (let x = x0; x <= x1 + 1e-9; x += sx) L.push({ x, y: +y.toFixed(2), r, h: +h.toFixed(3) }); }
  return L; };
if (MAPS8.gstair1){ MAPS8.gstair1.rows[2] = '#..........#'; MAPS8.gstair1.stairs = true; MAPS8.gstair1.hl = stairRamp8(1.5, 9.5, 11.5, 3, 3, 2.6); }   /* 12 × 18 · 그림의 계단은 11.5줄 → 3줄 (8.5칸) · 오르는 높이 2.6M (기울기 0.31) · 아래 넓은 마당 (12줄 아래) 은 평지 · 맨 위 줄의 무너진 돌 (r) 다섯 칸을 걸을 수 있는 바닥으로 — 돌이 위쪽 구석 둘 (U자 위) 을 섬으로 끊어 막혀 버렸음 */
if (MAPS8.gstair2){ MAPS8.gstair2.stairs = true; MAPS8.gstair2.hl = stairRamp8(1.5, 9.5, 12, 7, 1, 1.5); }   /* 그림의 계단은 가운데 좁은 층계 (7 ~ 11줄) · 5칸에 1.5M (0.3) · 아래 마당과 위 방 (4 ~ 6줄) 은 평평 */
for (const k of ['ruin2a', 'ruin2b', 'ruin2c', 'gboss1', 'gevent1', 'gstair1', 'gstair2', 'gfight1', 'fmap2', 'fmap3', 'pearl1']) if (MAPS8[k]) MAPS8[k].z = 1;""")
# 구획을 뜰 때 계단 · 비탈을 함께 (z = 1 · 통째로 쓰는 맵만 — 좌표가 그대로)
rep("amb: M.amb, fall: M.fall, sx: win.x0, sy: win.y0, props, base: srcId, sec: true };",
    "amb: M.amb, fall: M.fall, stairs: z === 1 && whole && M.hl ? true : undefined, hl: z === 1 && whole && M.hl ? clone(M.hl) : undefined, sx: win.x0, sy: win.y0, props, base: srcId, sec: true };")

# ---- 2층 열한 칸: 적을 채움 ----
rep("{ t: 'fight', ms: 'pass', src8: 'ruin2a', empty: true, bare: true }", "{ t: 'fight', ms: 'pass', src8: 'ruin2a', comp: 'abyss', npc8: null, bare: true }")
rep("{ t: 'fight', ms: 'pass', src8: 'ruin2b', empty: true, bare: true }", "{ t: 'fight', ms: 'pass', src8: 'ruin2b', comp: 'abyss', npc8: null, bare: true }")
rep("{ t: 'fight', ms: 'pass', src8: 'gfight1', empty: true, bare: true, mid: true }", "{ t: 'fight', ms: 'pass', src8: 'gfight1', comp: 'abyss', npc8: null, bare: true, mid: true }")
rep("{ t: 'fight', ms: 'pass', src8: 'fmap2', empty: true, bare: true }", "{ t: 'fight', ms: 'pass', src8: 'fmap2', comp: 'abyss', npc8: null, bare: true }")
rep("{ t: 'fight', ms: 'pass', src8: 'fmap3', empty: true, bare: true }", "{ t: 'fight', ms: 'pass', src8: 'fmap3', comp: 'abyss', npc8: null, bare: true }")
rep("{ t: 'fight', ms: 'pass', src8: 'gstair1', empty: true, bare: true }",
    "{ t: 'fight', src8: 'gstair1', comp: 'stair1', lay: 'stair1', stitch: null, npc8: null, bare: true, narr8: '넓은 계단 위로 방패와 장창이 벽을 이룬다. 맨 위에서는 활시위 당기는 소리 — 올라가는 쪽이 불리하다.' }")
rep("{ t: 'fight', ms: 'pass', src8: 'gstair2', empty: true, bare: true }",
    "{ t: 'fight', src8: 'gstair2', comp: 'ban', lay: 'ban', stitch: null, npc8: null, bare: true, narr8: '계단 끝, 하늘을 가린 두 그림자. 키가 8m는 되는 거인 둘이 나란히 길을 막고 서 있다.' }")
rep("{ t: 'fight', ms: 'pass', src8: 'gboss1', empty: true, bare: true }",
    "{ t: 'fight', src8: 'gboss1', comp: 'boss', lay: 'boss', lock: true, stitch: null, npc8: null, bare: true, narr8: '둥근 방. 검은 날개를 접은 암계의 장수 둘이 우리를 기다리고 있었다 — 흑익과 하류.' }")

# ---- 무리 · 배치 ----
rep("function r8Foes(n){\n  const R = R8S(), f = R.f, F = F8[f] || {};\n  if (n.empty) return [];   // 빈 회랑 (히든 층)",
    """/* v9.3.0 2층 무리: abyss = 암계 병사 랜덤 (방패 · 창방패 · 장궁 · 가끔 장송기사 · 지나가기는 ×0.7) · stair1 = 창방패병 10 + 장궁병 4 · ban = 반 + 테리 · boss = 흑익 + 하류 */
const COMP8 = {
  abyss: (n, R) => { const nP = R.party.length, P = [['암계 방패병', 3], ['암계 창방패병', 3], ['암계 장궁병', 2.4], ['암계 장송기사', 1.1]];
    let n0 = Math.max(4, Math.min(9, Math.round(nP * 0.8 + 1.6 + Math.random() * 1.8))); if (n.ms === 'pass') n0 = Math.max(3, Math.round(n0 * 0.7));
    const out = []; for (let i = 0; i < n0; i++){ let k = r8WPick(P); if (k === '암계 장송기사' && out.filter(x => x === k).length >= 2) k = '암계 방패병'; out.push(k); } return out; },
  stair1: () => [...Array(10).fill('암계 창방패병'), ...Array(4).fill('암계 장궁병')],
  ban: () => ['반', '테리'],
  boss: () => ['흑익', '하류'] };
const PAIR8 = { ban: ['반', '테리'], boss: ['흑익', '하류'] };   /* 같이 나오면 전우조 (명세 B2) */
/* 놓을 자리 (맵 칸 좌표 · 위 줄이 주력): 같은 이름의 적이 앞에서부터 차례로 선다. 칸이 막혔으면 가까운 빈 바닥 */
const LAY8 = {
  stair1: [['암계 창방패병', [[1, 3], [2, 3], [4, 3], [5, 3], [6, 3], [7, 3], [9, 3], [10, 3], [1, 12], [10, 12]]], ['암계 장궁병', [[1, 2], [4, 2], [6, 2], [10, 2]]]],
  ban: [['반', [[4, 5]]], ['테리', [[8, 5]]]],
  boss: [['흑익', [[8, 3]]], ['하류', [[11, 3]]]] };
function r8Lay(lay, m, foes){
  const L = LAY8[lay]; if (!L) return; const used = new Set(), done = new Set(), ok = (x, y) => x >= 0 && y >= 0 && x < m.W && y < m.H && m.t[y * m.W + x] === 0;
  const spot = (x, y) => { const seen = new Set([x + ',' + y]), q = [[x, y]]; for (let i = 0; i < q.length; i++){ const [a, b] = q[i]; if (ok(a, b) && !used.has(a + ',' + b)) return [a, b];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, -1], [0, 1]]){ const p = a + dx, r = b + dy, k = p + ',' + r; if (!seen.has(k) && p >= 0 && r >= 0 && p < m.W && r < m.H){ seen.add(k); q.push([p, r]); } } } return null; };
  for (const [nm, cells] of L){ const us = foes.filter(f => f.name === nm && !done.has(f)); cells.forEach((c, i) => { const u = us[i]; if (!u) return; const p = spot(c[0], c[1]); if (!p) return; used.add(p[0] + ',' + p[1]); done.add(u); u.x = p[0] + 0.5; u.y = p[1] + 0.5; }); }
}
function r8Foes(n){
  const R = R8S(), f = R.f, F = F8[f] || {};
  if (n.empty) return [];   // 빈 회랑 (히든 층)
  if (n.comp && COMP8[n.comp]) return COMP8[n.comp](n, R);   // v9.3.0 2층 고정 무리""")

# 판을 만들 때: 언덕 · 계단 · 전우조 · 놓기 · 보스 잠금 · 첫 글
rep("tseed: st.tseed, piles, hills: [], pileOff: [], indoor: !!M,", "tseed: st.tseed, piles, hills: M && M.hl ? clone(M.hl) : [], stairs: !!(M && M.stairs && M.hl), pileOff: [], indoor: !!M,")
rep("  const foes = keys.map(k => foe8(k, R.f)); n.foeKeys = keys;\n",
    "  const foes = keys.map(k => foe8(k, R.f)); n.foeKeys = keys;\n  { const pr = n.comp && PAIR8[n.comp]; if (pr){ const a = foes.filter(f => pr.includes(f.name)); if (a.length > 1) a.forEach(f => { f.cg = 'p' + n.comp; }); } }   /* v9.3.0 반 · 테리 / 흑익 · 하류 는 처음부터 전우조 */\n")
rep("  r8PlaceFar(m, foes, inn);\n  selId = null;", "  r8PlaceFar(m, foes, inn); if (n.lay) r8Lay(n.lay, m, foes);   /* v9.3.0 정해진 자리 */\n  selId = null;")
rep("world.exitLock = n.t === 'elite' || n.t === 'boss';", "world.exitLock = n.t === 'elite' || n.t === 'boss' || !!n.lock;")
rep("[{ narr: r8Pick(F8[R.f].narr || ['어둠 속에서 무언가 움직인다.']) }];", "[{ narr: n.narr8 || r8Pick(F8[R.f].narr || ['어둠 속에서 무언가 움직인다.']) }];")
rep("  if (n.pearl8) r8PearlHook(W);   /* v8.7.9 각펄 */",
    "  if (n.pearl8) r8PearlHook(W);   /* v8.7.9 각펄 */\n  if (W.map && W.map.stairs) logEv(W, { k: 'r8', s: '⛰ 계단 — 고지대 판정: 올라가는 쪽이 불리하다 (걸음이 느리고 · 잘 넘어지고 · 돌격이 힘을 못 얻고 · 아래에서 위로 쏘면 잘 안 맞는다)', c: 'dim', vis: true });")
# 보스룸은 잠금: 지나가기 열림을 덮지 않음 (ms 가 없으니 열리지 않지만 분명히)
rep("  if (n.empty){ W.exitLock = false; W.r8.pass = true;", "  if (n.lock) W.exitLock = true;   /* v9.3.0 보스룸: 둘을 쓰러뜨려야 나감 */\n  if (n.empty){ W.exitLock = false; W.r8.pass = true;")

# ---- 그리기: 계단 ----
rep("function rebuildPreview(){", """/* v9.3.0 계단 그림 — 비탈 높이를 층계로 (한 단 = 0.25M): 어두운 줄 (챌판) + 밝은 줄 (디딤판) · 오르막 쪽을 가리키는 화살표. 그림 맵 위에 덧그림 · 한 번 그려 두고 재사용 */
let stairCv = null, stairKey = '';
function drawStairs8(ox, oy, ts){
  const m = MAP; if (!m || !m.hills || !m.stairs) return; const key = S.art8 + '|' + m.hills.length + '|' + S.W + 'x' + S.H;
  if (stairKey !== key || !stairCv){ stairKey = key; const P = 32, c = document.createElement('canvas'); c.width = S.W * P; c.height = S.H * P; const g = c.getContext('2d'), Q = 2, N = P / Q, lv = (x, y) => Math.floor(gH(m, x, y) / 0.25);
    for (let y = 0; y < S.H * N; y++) for (let x = 0; x < S.W * N; x++){ const wx = (x + 0.5) / N, wy = (y + 0.5) / N; if (m.t[(wy | 0) * S.W + (wx | 0)] === 1) continue; const h = gH(m, wx, wy); if (h < 0.06) continue;
      g.fillStyle = `rgba(236,214,160,${Math.min(0.3, 0.05 + h * 0.07).toFixed(3)})`; g.fillRect(x * Q, y * Q, Q, Q);
      const l0 = lv(wx, wy); if (lv(wx, wy + 1 / N) !== l0){ g.fillStyle = 'rgba(28,16,6,.5)'; g.fillRect(x * Q, y * Q, Q, Q); } else if (lv(wx, wy - 1 / N) !== l0){ g.fillStyle = 'rgba(255,242,210,.34)'; g.fillRect(x * Q, y * Q, Q, Q); } }
    g.strokeStyle = 'rgba(255,236,190,.8)'; g.lineWidth = 2.2; g.lineCap = 'round'; g.lineJoin = 'round';
    for (let cy = 0; cy < S.H; cy++) for (let cx = 0; cx < S.W; cx++){ if ((cx + cy * 2) % 3 !== 1 || m.t[cy * S.W + cx] === 1) continue; const wx = cx + 0.5, wy = cy + 0.5, [gx, gy] = gGrad(m, wx, wy), gl = Math.hypot(gx, gy); if (gl < 0.12) continue;
      const dx = gx / gl, dy = gy / gl, px = wx * P, py = wy * P, a = P * 0.2; g.beginPath(); g.moveTo(px - dx * a - dy * a, py - dy * a + dx * a); g.lineTo(px + dx * a, py + dy * a); g.lineTo(px - dx * a + dy * a, py - dy * a - dx * a); g.stroke(); }
    stairCv = c; }
  ctx.drawImage(stairCv, 0, 0, S.W * 32, S.H * 32, ox, oy, S.W * ts, S.H * ts);
}
function rebuildPreview(){""")
rep("  if (S.art8 && Wd.camp && run8On()) drawArt8(Wd, ox, oy, ts);   /* v8.0.0 그림 맵 · 출구 */",
    "  if (S.art8 && Wd.camp && run8On()) drawArt8(Wd, ox, oy, ts);   /* v8.0.0 그림 맵 · 출구 */\n  if (S.stairs && S.art8 && Wd.camp) drawStairs8(ox, oy, ts);   /* v9.3.0 계단 */")
rep("  S.units.forEach(lockIdentity);   // v5.8.1 정체성은 늘\n", "  S.units.forEach(lockIdentity);   // v5.8.1 정체성은 늘\n  if (!S.art8 || !(S.hills && S.hills.length)) S.stairs = false;   /* v9.3.0 계단 표시는 그림 맵의 비탈에서만 */\n")
rep("mapC: false, randStart: true, seed: st.seed, flips, torches: [], terr: M ? '' : '1F'", "mapC: false, randStart: !n.lay, seed: st.seed, flips, torches: [], terr: M ? '' : '1F'")   # 정해진 자리가 있는 싸움은 시작 무작위로 흩지 않음
rep("'piles', 'hills', 'pileOff', 'openers', 'water',", "'piles', 'hills', 'stairs', 'pileOff', 'openers', 'water',")
rep("piles: [], hills: [], pileOff: [], openers: [] }, clone(B || {}));", "piles: [], hills: [], stairs: false, pileOff: [], openers: [] }, clone(B || {}));")
rep("ox < w && oy < h && dist[oy * w + ox] >= far * 0.7) out = [ox, oy]; }", "ox < w && oy < h && (dist[oy * w + ox] >= far * 0.7 || (M.stairs && dist[oy * w + ox] >= 0))) out = [ox, oy]; }   /* v9.3.0 계단은 그린 출구 (맨 위) 를 그대로 */")
open(F, 'w', encoding='utf-8').write(s)
print('page9030 OK')
