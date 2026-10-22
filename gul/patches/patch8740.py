# v8.7.4 엔진 — patch8740.py v2.3 (v2.3: 사수 자리 (J24 · J25) — 같은 까닭으로 같은 자리에서 두 번 빗나가면 옮김 (3초 그 둘레 안 고름) · 도약이 있는 사수는 각 잡기 대신 도약으로 사선 열린 자리로 · v2.2: 역할 진화 (I25) — 미드필더가 방패와 한 손 날붙이 · 둔기를 함께 들면 전선 (전열 쪽으로) · 방패를 잃으면 본디 역할 · 들고 온 장비도 판 시작에 · v2.1: 전열 끝 (I22) — 측면 기동 · 협공 · 적 우회조는 곧은 길이 상대 전열을 가로지르면 그 가까운 끝을 돌아 들어감 · 우회 자리는 표적 가까이부터 · v2.0: 길 비켜 주기 (I21) — 같은 편 둘이 겹치면 마주 올 땐 둘 다 오른쪽으로 · 하나만 가는 중이면 서 있는 쪽이 길 옆으로 (앞으로 떠밀려 비비던 것) · v1.9: 모닝스타 (C2) — 철퇴를 든 이는 붙은 상대가 치려고 준비하면 철퇴 거리 (1.6칸) 로 물러섬 (헛치게 함) · 손이 빈 상대 · 빈틈 (휘청 · 넘어짐 · 거두는 중) 이면 그대로 침 · 틈을 기다리며 도는 자리도 철퇴 거리 (몸 옆 0.3칸으로 걸어 들어가 붙던 것 — 손이 빈 상대와 붙어 있으면 지금 거리로) · v1.8: 제3세력 (I6 — 각혈) — 2편은 누구의 편도 아님: 보이는 누구든 침 · 망자 (1편) 와도 서로 싸움 · 쓰러뜨려야 맵이 정리됨 · 1편의 지휘 · 경보 · 작전 · 집중은 1편만 · 아군이 본 것만 보임 · 짐작은 두 편 모두가 · v1.7: 세자르 (C4 · 2D 그대로) — 하늘 가르기 · 관통 찌르기 · 냉기 참격은 가장 가까운 이를 노림 (rules.cz.aim 'best' 면 예전처럼 가장 많이 걸리는 쪽) · v1.6: 노인의 왕관 [★권위E] (C1) — 맵의 모든 신성 상대 ([개조된 신체] · [대리석 피부] (받아 내는 몫 · 스텝 간격) · 성해포의 [재생]) 효과 15% 약화 · 권위 (신성 봉인) 중엔 대리석 피부 · 신성의 재생도 꺼짐 (개조된 신체처럼) · v1.5: 돌진 길 — 물러나는 사수 (아군 회피기동 · 적 궁수 본능 같은 규칙) 는 나를 노린 돌진의 길 (띠) 밖 옆으로 빠짐 · 띠를 가로지르지 않음 · 가던 자리가 띠 안이 되면 다시 고름 · 쉬는 중 · '따라붙음' 이어도 돌진 길은 비킴 (ev715 A: 곧장 뒷걸음질하다 받히던 것) · 맞붙음 (손이 빈 근접의 손 닿는 곳) 이면 물러나기를 멈추고 그 자리에서 쏨 — 고를 때의 규칙을 이어 갈 때도 · 사수의 맞붙음: 쏘지도 걷지도 않고 그 일격을 기다렸다가 (준비가 보이면) 물러남 (1.5초까지 — 서서 쏘면 60판에 맞음 13 · 피해 716, 걸어서 빠지면 틈에 맞음) · 돌진이 닿기 전에 한 발 쏘고 비킬 시간이 있으면 먼저 쏨 (60판: 켬 맞음 1 · 피해 36 · 사격 81% / 끔 6 · 144) · 적 궁수도 같은 규칙 (걸어서 빠지다 교전 구속에 맞던 것) · v1.4: 시험용 내보내기 (기술표 · 잡아찢기 · 큰 몸 길) · v1.3: 갑피SS 는 6성 (S 보다 한 단계 위 — 특성대로 · 전엔 S 와 같은 5성이라 SS 의 뜻이 없었음) · 바위던지기 배율 1.6 → 1.3 (3D 붉은암석의 큰 기술 — 대지 내려찍기 · 암석 돌진 × 1.3) · v1.2: 붉은암석 (민수 메모 J22) — 잡아찢기 (붙잡음 · 끊을 수 있음 · 체급대로 찢김 / 팔다리) · 딥 킥 (볼링 핀) · 방어모드 (피해 1 · 느림 · 치지 않음 — 상대는 기다리거나 다른 상대) · 바위던지기 (대포 — 처음 닿는 몸) · 점프 찍기 체급 (몸마다) · 겹친 몸 넘어짐 · 붙잡힌 동료를 구함 · 3D 기술표의 밀침은 넘어뜨리지 않음 · v1.1: 기술표 준비 기록은 고유 기술처럼 (spec) · 그림자는 곡사처럼 떨어지되 기록에 곡사 배율 없음 · 갑피 등급 (SS · S · A · B · C · D) · v1.0: patch8730.py 를 먼저 돌린 뒤 — 3D 보스 기술표 (h2 · 2기 훈련장) 를 그대로 돌리는 틀 (망각: 기본 일격 · 돌진 할퀴기 · 망각의 아가리 · 어슬렁 포위 · 갈퀴 덮치기 · 망각의 그림자 · 2페이즈) · 예고 모양 (부채꼴 · 줄 · 원) 을 보면 비킴 (양쪽 같음) · [비늘 깃털 갑옷] (정면 원거리 ×0.7 · 옆 · 뒤 ×1.15) · 큰 몸 (반지름 0.55 넘게) 은 몸 전체로 벽을 보고 · 몸이 지나갈 수 있는 길로 감 · 시작 자리도 몸이 들어가는 곳으로)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8730.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- A. 큰 몸: 몸 전체로 벽을 봄 · 몸이 지나갈 수 있는 길 ----------
rep("const boxRock = (W, x, y, r) => rock(W.map, x - r, y - r) || rock(W.map, x + r, y - r) || rock(W.map, x - r, y + r) || rock(W.map, x + r, y + r);",
    "const boxRock = (W, x, y, r) => r > 0.55 ? !bigOk(W.map, x, y, r) : rock(W.map, x - r, y - r) || rock(W.map, x + r, y - r) || rock(W.map, x - r, y + r) || rock(W.map, x + r, y + r);   /* v8.7.4 큰 몸은 몸 전체 */\n"
    "// v8.7.4 큰 몸 (반지름 0.55 넘게 — 망각): 네 모서리만 보면 몸 안에 바위 칸이 숨음 → 1칸보다 촘촘한 점으로 몸 전체를 봄\n"
    "function bigOk(m, x, y, r){ const n = Math.ceil(2 * r) + 1; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (rock(m, x - r + 2 * r * i / (n - 1), y - r + 2 * r * j / (n - 1))) return false; return true; }\n"
    "// 몸이 곧장 지나갈 수 있는 줄 (0.3칸마다 몸 전체)\n"
    "function bigWalk(m, x0, y0, x1, y1, r){ const l = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(l / 0.3)); for (let i = 1; i <= n; i++){ const t = i / n; if (!bigOk(m, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r)) return false; } return true; }\n"
    "// 몸이 들어가는 가장 가까운 자리 (6칸까지)\n"
    "function bigSpot(W, x, y, r){ for (let d = 0.5; d <= 6; d += 0.5) for (let k = 0; k < 16; k++){ const a = k * Math.PI / 8, xx = x + Math.cos(a) * d, yy = y + Math.sin(a) * d; if (xx > r && yy > r && xx < W.map.W - r && yy < W.map.H - r && !boxRock(W, xx, yy, r * 0.9)) return { x: xx, y: yy }; } return null; }")
rep("  const ok = (x, y) => !rock(m, x - r, y - r) && !rock(m, x + r, y - r) && !rock(m, x - r, y + r) && !rock(m, x + r, y + r);",
    "  const ok = r > 0.55 ? (x, y) => bigOk(m, x, y, r) : (x, y) => !rock(m, x - r, y - r) && !rock(m, x + r, y - r) && !rock(m, x - r, y + r) && !rock(m, x + r, y + r);   /* v8.7.4 큰 몸은 몸 전체 */")
# 길찾기: cr (몸 반지름 × 0.9) 이 0.55 넘으면 몸이 들어가는 칸으로만 · 목표 칸에 몸이 안 들어가면 가장 가까이 닿는 칸까지
rep("""function findPath(m, sx, sy, gx, gy, maxN){
  const W = m.W, s = (sy | 0) * W + (sx | 0); let g = (gy | 0) * W + (gx | 0);
  if (rock(m, gx, gy)) return null;
  if (s === g) return [];
  const prev = new Int32Array(m.W * m.H).fill(-1); prev[s] = s; const q = [s];
  for (let h = 0; h < q.length && h < (maxN || 4000); h++){
    const p = q[h], x = p % W, y = (p / W) | 0;
    for (const [dx, dy] of DIR8){
      const nx = x + dx, ny = y + dy; if (rock(m, nx, ny)) continue;
      if (dx && dy && (rock(m, x + dx, y) || rock(m, x, y + dy))) continue;
      const np = ny * W + nx; if (prev[np] >= 0) continue; prev[np] = p; q.push(np);
      if (np === g){ const path = []; let c = g; while (c !== s){ path.push({ x: c % W + 0.5, y: ((c / W) | 0) + 0.5 }); c = prev[c]; } return path.reverse(); }
    }
  }
  return null;
}""",
"""function findPath(m, sx, sy, gx, gy, maxN, cr){
  const W = m.W, s = (sy | 0) * W + (sx | 0); let g = (gy | 0) * W + (gx | 0);
  const big = cr > 0.55, no = big ? (x, y) => x < 0 || y < 0 || x >= m.W || y >= m.H || !bigOk(m, x + 0.5, y + 0.5, cr) : (x, y) => rock(m, x, y);   /* v8.7.4 큰 몸: 몸이 들어가는 칸만 */
  if (rock(m, gx, gy)) return null;
  if (s === g) return [];
  const prev = new Int32Array(m.W * m.H).fill(-1); prev[s] = s; const q = [s]; let best = s, bd = Math.hypot((s % W) + 0.5 - gx, ((s / W) | 0) + 0.5 - gy);
  const back = c => { const path = []; while (c !== s){ path.push({ x: c % W + 0.5, y: ((c / W) | 0) + 0.5 }); c = prev[c]; } return path.reverse(); };
  for (let h = 0; h < q.length && h < (maxN || 4000); h++){
    const p = q[h], x = p % W, y = (p / W) | 0;
    for (const [dx, dy] of DIR8){
      const nx = x + dx, ny = y + dy; if (no(nx, ny)) continue;
      if (dx && dy && (no(x + dx, y) || no(x, y + dy))) continue;
      const np = ny * W + nx; if (prev[np] >= 0) continue; prev[np] = p; q.push(np);
      if (np === g) return back(g);
      if (big){ const d = Math.hypot(nx + 0.5 - gx, ny + 0.5 - gy); if (d < bd){ bd = d; best = np; } }
    }
  }
  return big && best !== s ? back(best) : null;   // 큰 몸: 목표 칸에 몸이 안 들어가면 가장 가까이 닿는 칸까지
}""")
rep("""  u.path = walkClear(W.map, u.x, u.y, x, y, u.r * 1.12) ? [{ x, y }] : findPath(W.map, u.x, u.y, x, y) || null;   // v7.21 무더기는 돌아감
  if (u.path && u.path.length) u.path[u.path.length - 1] = { x, y };""",
"""  const big = u.r > 0.6;   /* v8.7.4 큰 몸 (망각): 몸 전체가 지나가는 줄 · 몸이 들어가는 칸으로 길을 찾음 */
  u.path = (big ? bigWalk(W.map, u.x, u.y, x, y, u.r * 0.9) : walkClear(W.map, u.x, u.y, x, y, u.r * 1.12)) ? [{ x, y }] : findPath(W.map, u.x, u.y, x, y, undefined, big ? u.r * 0.9 : 0) || null;   // v7.21 무더기는 돌아감
  if (u.path && u.path.length && (!big || bigOk(W.map, x, y, u.r * 0.9))) u.path[u.path.length - 1] = { x, y };""")

# ---------- B. 3D 보스 기술표 (h2) ----------
H2 = r"""/* ---------- v8.7.4 3D 보스 기술표 (h2 — 2기 훈련장의 기술을 그대로) ----------
   설계 p.h2 = 기술표 이름 (망각 'mangak'). 3D 처럼: 가장 가까운 아는 상대를 노림 · 기술은 차례대로 (대기가 끝났고 · 거리가 맞는 첫 것) 매 순간 dt × 4 확률로 ·
   아니면 기본 일격 (몸 가운데부터 range 칸 부채꼴 — range × 0.8 밖이거나 안 보이면 range × 0.7 까지 다가감) · 체력이 phase.at 아래면 2페이즈 (공격 × k · 속력 × spd · 대기 모두 풂).
   모양은 3D 와 같이 몸 가운데부터 — 부채꼴: 가운데에서 r + 상대 몸 × 0.6 · 각 arc/2 + 0.15 / 줄: 길이 len · 폭 w / 원 (그림자): 가운데에서 r. 예고 동안 모양이 보이고, 끝나는 순간 그 안의 상대가 맞음 (공중 · 쓰러진 이는 빼고).
   피해 · 막기 · 갑옷 · 치명 · 측면 · 급소는 이 판의 규칙 (strike) — 양쪽 같음. 밀침은 3D 가 따로 정한 것 (기본 일격 kb 3) 만 × H2KB 의 힘 (사람 70kg 이 3D 와 같은 거리만큼 날아감 — 3D 의 기본 0.8 은 이 판의 보통 일격처럼 밀지 않음).
   이 판에 맞춘 것 (3D 와 다른 곳): 몸이 겹치지 않으므로 어슬렁 포위 (3D: 가운데 1.4칸 — 몸 밑으로 파고든 상대) 는 몸에 바싹 붙은 상대 (0.3칸) 에게 · 줄 · 부채꼴 · 원은 벽 너머를 치지 않음 · 기술은 보이는 상대에게만. */
const H2K = {
  mangak: { ml: { range: 5.5, mul: 1.2, wind: 0.8, cd: 1.8, arc: 2.0, kb: 3.0 },
    sk: [{ id: 'rush', n: '돌진 할퀴기', type: 'dash', cd: 8, use: 8, len: 8, w: 2.4, mul: 1.6, trip: true, wind: 0.9 },
      { id: 'maw', n: '망각의 아가리', type: 'slash', cd: 12, use: 5.5, r: 5.5, arc: 1.6, mul: 2.4, stun: 1.5, wind: 1.3, say: '(아가리가 네 갈래로 벌어진다)' },
      { id: 'prowl', n: '어슬렁 포위', type: 'backstep', cd: 9, use: 3, len: 4 },
      { id: 'pounce', n: '갈퀴 덮치기', type: 'dash', cd: 12, use: 10, len: 10, w: 3, mul: 1.8, trip: true, wind: 0.8 },
      { id: 'shadow', n: '망각의 그림자', type: 'rain', cd: 14, use: 10, cnt: 6, r: 1.5, spread: 4, mul: 0.8, delay: 0.9, gap: 0.22, ph: 2 }],
    phase: { at: 0.5, k: 1.2, spd: 1.15, say: '(망각의 눈이 붉게 타오른다)' } } };
const H2KB = 0.5;   // 3D 밀침 → 이 판의 밀치는 힘
const h2Kit = u => (u && u.h2 && H2K[u.h2.k]) || null;
const h2Ml = K => ({ id: 'ml', n: '할퀴기', type: 'slash', r: K.ml.range, arc: K.ml.arc, mul: K.ml.mul, wind: K.ml.wind, cd: K.ml.cd, kb: K.ml.kb });
// 모양 안인가 (몸 가운데 Z.x, Z.y 에서) — 벽 너머는 아님
function h2In(W, Z, e){
  const dx = e.x - Z.x, dy = e.y - Z.y, rr = e.r * 0.6;
  if (Z.sh === 'circ'){ if (Math.hypot(dx, dy) >= Z.r) return false; }
  else if (Z.sh === 'fan'){ const d = Math.hypot(dx, dy); if (d > Z.r + rr || (d >= 0.5 && angDiff(Math.atan2(dy, dx), Z.ang) > Z.arc / 2 + 0.15)) return false; }
  else { const c = Math.cos(Z.ang), s = Math.sin(Z.ang), al = dx * c + dy * s, pp = -dx * s + dy * c; if (al < -rr || al > Z.len + rr || Math.abs(pp) > Z.w / 2 + rr) return false; }
  return losClear(W.map, Z.x, Z.y, e.x, e.y);
}
const h2Hittable = (u, e) => e.alive && !e.gone && !e.down && e !== u && e.side !== u.side && !(e.act && e.act.k === 'leap');   // 공중 (도약 · 공중제비 · 도약 강타 중) 은 바닥 공격을 피함
// 쓸 기술 (3D h2Pick): 차례대로 — 대기 중 · 2페이즈 기술은 건너뜀 · 어슬렁 포위는 몸에 바싹 붙은 상대에게만 · 나머지는 거리 (몸 가운데끼리) 가 use 안
function h2Pick(W, u, t, d){
  const K = h2Kit(u); if (!K) return null;
  for (const s of K.sk){
    if (W.t < (u.h2.cd[s.id] != null ? u.h2.cd[s.id] : -9)) continue;
    if (s.ph && !u.h2.ph) continue;
    if (s.type === 'backstep'){ if (gap(u, t) < 0.3) return s; continue; }
    if (d <= s.use && d >= (s.min || 0)) return s;
  }
  return null;
}
// 몸이 그 쪽으로 len 까지 옮겨 갈 수 있는 거리 (벽 앞에서 멈춤 — 3D 의 잔상 이동)
function h2Reach(W, u, x0, y0, ang, len){ const c = Math.cos(ang), s = Math.sin(ang); let k = 0; for (; k + 0.3 <= len + 1e-6; k += 0.3) if (boxRock(W, x0 + c * (k + 0.3), y0 + s * (k + 0.3), u.r * 0.9)) break; return k; }
function h2Ghost(W, u, x, y){ const fx = u.x, fy = u.y; if (Math.hypot(x - fx, y - fy) < 0.05) return; u.x = x; u.y = y; stop(u); if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: fx, y: fy, t0: W.t }); }
function h2Cast(W, u, s, t){
  const K = h2Kit(u); if (!K || !t) return false;
  const d = dist(u, t), ang = Math.atan2(t.y - u.y, t.x - u.x), ml = s.id === 'ml', vis = u.side === 0 || !!u.seenBy;
  if (ml) u.h2.mlT = W.t + s.cd; else u.h2.cd[s.id] = W.t + s.cd;
  stop(u); u.waitT = 0; u.fg = u.face = ang; u.target = t; u.state = u.side ? 'hunt' : 'fight';
  if (!ml) L(W, { k: 'h2', a: u.i, b: t.i, s: s.id, n: s.n, say: s.say || null, vis });
  if (W.fxOn && s.say) W.fx.push({ k: 'say', a: u.i, s: s.say, t0: W.t });
  setMood(W, u, s.n, t.i);
  if (s.type === 'backstep'){   // 3D: 상대에게서 len 물러남 (보스는 잔상으로 곧장)
    const a = Math.atan2(u.y - t.y, u.x - t.x), k = h2Reach(W, u, u.x, u.y, a, s.len); h2Ghost(W, u, u.x + Math.cos(a) * k, u.y + Math.sin(a) * k);
    u.act = { k: 'h2', s: s.id, n: s.n, type: s.type, b: t.i, phase: 'rec', t0: W.t, end: W.t + 0.35 };
    L(W, { k: 'h2Step', a: u.i, b: t.i, n: s.n, d: +k.toFixed(1), vis }); return true; }
  if (s.type === 'rain'){   // 3D: 표적 자리에 하나 · 나머지는 그 둘레 spread 안 아무 데 — gap 초마다 하나씩 생기고 delay 초 뒤에 떨어짐
    const Z = W.h2z || (W.h2z = []), m = W.map;
    for (let i = 0; i < s.cnt; i++){ const x = i ? t.x + (W.rand() * 2 - 1) * s.spread : t.x, y = i ? t.y + (W.rand() * 2 - 1) * s.spread : t.y;
      Z.push({ by: u.i, side: u.side, x: Math.max(0.5, Math.min(m.W - 0.5, x)), y: Math.max(0.5, Math.min(m.H - 0.5, y)), r: s.r, t0: W.t + i * (s.gap || 0.22), at: W.t + i * (s.gap || 0.22) + (s.delay || 0.9), mul: s.mul, n: s.n, stun: s.stun || 0 }); }
    u.act = { k: 'h2', s: s.id, n: s.n, type: s.type, b: t.i, phase: 'rec', t0: W.t, end: W.t + 0.6 }; return true; }
  const Z = s.type === 'dash' ? { sh: 'line', x: u.x, y: u.y, ang, len: Math.min(s.len, d + 0.6), w: s.w } : { sh: 'fan', x: u.x, y: u.y, ang, r: s.r, arc: s.arc };   // 3D: 돌진은 표적 바로 뒤까지
  const wind = s.wind != null ? s.wind : 0.5;
  u.act = { k: 'h2', s: s.id, n: s.n, type: s.type, b: t.i, phase: 'wind', t0: W.t, end: W.t + wind, Z, mul: s.mul, stun: s.stun || 0, trip: !!s.trip, kb: s.kb || 0 };
  L(W, { k: 'wind', a: u.i, b: t.i, h2: s.id, spec: 'h2', w: s.n, end: +(W.t + wind).toFixed(2), why: '', hid: u.side === 1 && !u.seenBy });
  return true;
}
// 예고가 끝남: 모양 안의 상대가 맞음 → 돌진은 줄 끝까지 잔상 이동 (벽 앞에서 멈춤)
function resolveH2(W, u){
  const A = u.act; if (A.phase !== 'wind'){ u.act = null; return; }
  A.phase = 'rec'; A.end = W.t + 0.3; A.t1 = W.t; u.atkT = W.t;
  const Z = A.Z, hit = W.units.filter(e => h2Hittable(u, e) && h2In(W, Z, e));
  for (const e of hit){
    const o = strike(W, u, e, e, 1, false, { mul: A.mul, tag: A.n });
    if (!e.alive) continue;
    if (A.kb && !e.kb) shove(W, u, e, A.kb * H2KB * (o && o.block ? 0.7 : 1), e.x - Z.x, e.y - Z.y, { tag: A.n + '에 날아감', noDown: true });   // 3D: 밀침은 넘어뜨리지 않음 (넘어뜨림은 trip)
    if (A.stun) stun(W, e, A.stun, u.i);
    if (A.trip && !(e.traits || []).includes('보스') && !e.giant) knockDown(W, e, 1.2, u.i, A.n);   // 3D: 무거운 몸 · 보스는 안 넘어짐
  }
  L(W, { k: 'h2Hit', a: u.i, s: A.s, n: A.n, hit: hit.map(e => e.i), vis: u.side === 0 || !!u.seenBy || hit.some(e => e.side === 0) });
  if (W.fxOn) W.fx.push({ k: 'h2Fx', sh: Z.sh, x: Z.x, y: Z.y, ang: Z.ang, r: Z.r, arc: Z.arc, len: Z.len, w: Z.w, side: u.side, t0: W.t });
  if (A.type === 'dash' && u.alive){ const k = h2Reach(W, u, Z.x, Z.y, Z.ang, Z.len); h2Ghost(W, u, Z.x + Math.cos(Z.ang) * k, Z.y + Math.sin(Z.ang) * k); }
}
// 2페이즈: 체력이 phase.at 아래로 — 공격 × k · 속력 × spd · 기술 대기 모두 풂 (3D h2Tick)
function h2Tick(W, u){
  const K = h2Kit(u), P = K && K.phase; if (!P || u.h2.ph || !u.alive || u.hp >= u.max * P.at) return;
  u.h2.ph = true; u.atk = Math.round(u.atk * P.k); u.spd *= P.spd; u.h2.cd = {}; u.h2.mlT = Math.min(u.h2.mlT, W.t);
  L(W, { k: 'h2Phase', a: u.i, say: P.say || '', vis: true });
  if (W.fxOn){ if (P.say) W.fx.push({ k: 'say', a: u.i, s: P.say, t0: W.t }); W.fx.push({ k: 'num', x: u.x, y: u.y, s: '2페이즈', c: 'd', t0: W.t }); }
}
// 싸움 두뇌 (3D h2EnemyThink + 근접 enemyThink): 아는 상대가 없으면 보통 두뇌 (찾기 · 쫓기)
function h2Brain(W, u, dt){
  const K = h2Kit(u); if (!K || u.act) return false;
  const F = czKnown(W, u).filter(f => !f.down); if (!F.length){ u.h2.close = false; return false; }
  const t = F.reduce((a, b) => dist(u, b) < dist(u, a) ? b : a), d = dist(u, t), see = canSee(W, u, t), M = K.ml;
  u.target = t; u.state = u.side ? 'hunt' : 'fight'; if (see) u.last = { x: t.x, y: t.y };
  if (see){ const s = h2Pick(W, u, t, d); if (s && W.rand() < dt * 4) return h2Cast(W, u, s, t); }
  if (!see || d > M.range * 0.8 || (u.h2.close && d > M.range * 0.7)){ u.h2.close = see; const p = see ? t : (u.sense[t.i] || u.last || t); setMood(W, u, see ? '다가감' : '쫓음', t.i); goTo(W, u, p.x, p.y, dt); return true; }
  u.h2.close = false;
  if (W.t >= u.h2.mlT) return h2Cast(W, u, h2Ml(K), t);
  stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '노려봄', t.i); return true;
}
// 그림자 (원): 떨어지는 순간 안의 상대가 맞음 (마법 · 위에서) — 시전자가 쓰러지면 아직 안 생긴 것은 없음
function stepH2Z(W){
  W.h2z = W.h2z.filter(Z => { const by = W.units[Z.by];
    if (W.t < Z.t0) return !!(by && by.alive);
    if (W.t < Z.at) return true;
    const hit = W.units.filter(e => e.alive && !e.gone && !e.down && e.side !== Z.side && !(e.act && e.act.k === 'leap') && h2In(W, { sh: 'circ', x: Z.x, y: Z.y, r: Z.r }, e));
    for (const e of hit){ strike(W, by, e, e, 1, false, { mul: Z.mul, tag: Z.n, wk: '마법', arc: true, rain: true }); if (e.alive && Z.stun) stun(W, e, Z.stun, by.i); }
    L(W, { k: 'h2Rain', a: Z.by, n: Z.n, hit: hit.map(e => e.i), x: +Z.x.toFixed(1), y: +Z.y.toFixed(1), vis: hit.some(e => e.side === 0) || litAt(W, Z.x, Z.y) });
    if (W.fxOn) W.fx.push({ k: 'h2Boom', x: Z.x, y: Z.y, r: Z.r, side: Z.side, t0: W.t });
    return false; });
}
"""
rep("function startPalm(W, u, t, why){", H2 + "function startPalm(W, u, t, why){")

# 설계 → 몸: 기술표 · [비늘 깃털 갑옷] · 큰 몸은 몸이 들어가는 자리에서 시작
rep("afterAtk: -9 }; }   /* v7.24 스텝 */   /* v7.23.1 자세 · 회피 반격 · 세자르 */\n}",
    "afterAtk: -9 }; }   /* v7.24 스텝 */   /* v7.23.1 자세 · 회피 반격 · 세자르 */\n"
    "  { const U = W.units[i], K = p.h2 && H2K[p.h2]; U.scaleMail = (p.traits || []).includes('비늘 깃털 갑옷');   /* v8.7.4 3D 보스 기술표 · 비늘 깃털 갑옷 */\n"
    "    if (K){ U.h2 = { k: p.h2, cd: {}, mlT: -9, ph: false, close: false }; U.rng = Math.max(U.rng, +(K.ml.range - U.r - 0.12).toFixed(2)); U.longReach = true; }   // 닿는 거리 (남이 보는 손 길이) = 몸 가운데부터 range\n"
    "    if (U.r > 0.55 && boxRock(W, U.x, U.y, U.r * 0.9)){ const q = bigSpot(W, U.x, U.y, U.r); if (q){ U.x = q.x; U.y = q.y; U.home = { x: q.x, y: q.y }; } } }   /* v8.7.4 큰 몸은 몸이 들어가는 자리에서 */\n}")

# 두뇌 · 차례
rep("function act(W, u, dt){\n", "function act(W, u, dt){\n  if (u.h2) h2Tick(W, u);   /* v8.7.4 2페이즈 */\n")
rep("function act2(W, u, dt){\n  if (u.cz && !u.order && czBrain(W, u, dt)) return;   /* v7.23.1 세자르 */",
    "function act2(W, u, dt){\n  if (u.cz && !u.order && czBrain(W, u, dt)) return;   /* v7.23.1 세자르 */\n  if (u.h2 && !u.order && h2Brain(W, u, dt)) return;   /* v8.7.4 3D 보스 기술표 */")
rep("  if (u.act.k === 'spec'){ resolveSpec(W, u); return; }   // v7.19.1 고유 기술",
    "  if (u.act.k === 'spec'){ resolveSpec(W, u); return; }   // v7.19.1 고유 기술\n  if (u.act.k === 'h2'){ resolveH2(W, u); return; }   /* v8.7.4 */")
rep("function startAct(W, u, t, why){\n  if (u.jrB) return;",
    "function startAct(W, u, t, why){\n  if (u.jrB) return;\n  if (u.h2){ const K = h2Kit(u); if (K && !u.act && t && t.side !== u.side && W.t >= u.h2.mlT && dist(u, t) <= K.ml.range * 0.8) h2Cast(W, u, h2Ml(K), t); return; }   /* v8.7.4 기술표의 몸은 기본 일격도 기술표대로 */")
rep("function interrupt(W, u, why){\n  const a = u.act;\n",
    "function interrupt(W, u, why){\n  const a = u.act;\n  if (a && a.k === 'h2' && a.phase === 'wind') L(W, { k: 'h2Break', a: u.i, s: a.s, n: a.n, why, vis: u.side === 0 || !!u.seenBy });   /* v8.7.4 휘청 · 넘어짐으로 끊긴 예고 */\n")
rep("  if (W.pools && W.pools.length) stepPools(W, dt);   // v7.22.3 핏빛 장판",
    "  if (W.pools && W.pools.length) stepPools(W, dt);   // v7.22.3 핏빛 장판\n  if (W.h2z && W.h2z.length) stepH2Z(W);   /* v8.7.4 망각의 그림자 */")

# 예고 회피: 부채꼴 · 줄 (기술표) · 그림자 원 — 본 몸은 비킴 (양쪽 같음 · 같은 확률)
rep("    else if (A.k === 'atk' && A.mode === 'sweep' && t){ const S = W.rules.sweep || {}; Z = { k: 'fan',",
    "    else if (A.k === 'h2' && A.Z){ const Q = A.Z; Z = Q.sh === 'line' ? { k: 'line', ang: Q.ang, len: Q.len + 0.3, w: Q.w / 2 + 0.25, what: A.n, foe: true } : { k: 'fan', ang: Q.ang, arc: Q.arc / 2 + 0.15, R: Q.r + 0.3, what: A.n, foe: true }; }   /* v8.7.4 기술표 (몸 가운데부터) */\n"
    "    else if (A.k === 'atk' && A.mode === 'sweep' && t){ const S = W.rules.sweep || {}; Z = { k: 'fan',")
rep("      L(W, { k: 'tgDodge', a: e.i, b: a.i, what: Z.what, vis: e.side === 0 || !!e.seenBy || a.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.45, s: '!', c: 'g', t0: W.t }); } }\n}",
    "      L(W, { k: 'tgDodge', a: e.i, b: a.i, what: Z.what, vis: e.side === 0 || !!e.seenBy || a.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.45, s: '!', c: 'g', t0: W.t }); } }\n"
    "  if (W.h2z && W.h2z.length) for (const Q of W.h2z){ if (W.t < Q.t0 || Q.at - W.t < left) continue; const by = W.units[Q.by], seen = Q.seen || (Q.seen = []);   /* v8.7.4 그림자 원: 바닥에 번진 원을 본 몸 (밝거나 · 시전자가 보이면) 은 원 밖으로 */\n"
    "    for (const e of W.units){ if (!e.alive || e.side === Q.side || seen.includes(e.i) || e.down || e.kb || e.crawl || e.lie || e.summon === 'slime' || W.t < (e.proneT || -9) || W.t < (e.stunT || -9)) continue;\n"
    "      const dx = e.x - Q.x, dy = e.y - Q.y, d = Math.hypot(dx, dy); if (d >= Q.r + 0.3) continue; seen.push(e.i);\n"
    "      if (!(litAt(W, Q.x, Q.y) || (by && canSee(W, e, by))) || (e.order && e.order.k === 'hold') || (W.duel && e.i === W.duel.me) || (e.act && ((e.act.k === 'charge' && e.act.phase === 'run') || e.act.k === 'leap' || e.act.k === 'dodge' || (e.act.k === 'spec' && e.act.phase !== 'wind')))) continue;\n"
    "      if (W.rand() >= tgDodgeP(W, e)){ L(W, { k: 'tgLate', a: e.i, b: Q.by, what: Q.n, vis: e.side === 0 || !!e.seenBy }); continue; }\n"
    "      const a0 = d > 0.05 ? Math.atan2(dy, dx) : W.rand() * 6.283, D = Q.r - d + 0.45; let fx = Math.max(0.6, Math.min(W.map.W - 0.6, e.x + Math.cos(a0) * D)), fy = Math.max(0.6, Math.min(W.map.H - 0.6, e.y + Math.sin(a0) * D)); if (boxRock(W, fx, fy, e.r * 0.9)){ const q = freeSpot(W, fx, fy, e.r); if (!q) continue; fx = q.x; fy = q.y; }\n"
    "      const ea = e.act; if (ea){ if (ea.k === 'skill' && ea.phase === 'tend') tendEnd(W, e, ea, '피함'); e.act = null; e.burst = null; }\n"
    "      e.flee = { x: fx, y: fy, until: Q.at + 0.2, why: Q.n + ' — 피함' };\n"
    "      L(W, { k: 'tgDodge', a: e.i, b: Q.by, what: Q.n, vis: e.side === 0 || !!e.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.45, s: '!', c: 'g', t0: W.t }); } }\n}")

# [비늘 깃털 갑옷]: 정면에서 온 원거리 ×0.7 · 정면 근접 ×1 · 옆 · 뒤 ×1.15 (3D 패시브 그대로 — 이 판의 측면 · 뒤 배율과 겹침)
rep(" * (mbOn(W, t) ? mbF(W, t, 'dmg') : 1)));   // [개조된 신체]",
    " * (mbOn(W, t) ? mbF(W, t, 'dmg') : 1) * (t.scaleMail ? (dir === 'front' ? (o.far || J ? 0.7 : 1) : 1.15) : 1)));   // [개조된 신체]   /* v8.7.4 [비늘 깃털 갑옷] */")
rep("o.part = part; o.ambush = amb; o.jav = !!J; o.crit = crit;",
    "o.part = part; o.ambush = amb; o.jav = !!J; o.crit = crit; if (t.scaleMail) o.scale = dir === 'front' ? (o.far || J ? 0.7 : 1) : 1.15;")

# 그림자 (위에서 떨어짐): 곡사처럼 머리 · 어깨로 · 든 방패로만 막힘 — 기록에 '곡사' 배율은 없음 (곡사가 아님)
rep("p: p < 1 ? +p.toFixed(2) : null, arc: arcX, kn: !!(extra && extra.kn) };", "p: p < 1 ? +p.toFixed(2) : null, arc: arcX && !(extra && extra.rain), kn: !!(extra && extra.kn) };")
# 갑피 등급 (도감: 세르파 갑피C · 굴란 · 몽 갑피A · 붉은암석 갑피SS) — 등급이 없으면 예전처럼 rules.galpi (3성)
rep("  if ((p.traits || []).includes('갑피')){\n    const tg = rules.galpi || 3;",
    "  const gpT = (p.traits || []).map(x => /^갑피(SS|[SABCD])?$/.exec(x)).find(Boolean);   /* v8.7.4 갑피 등급 — SS 6 (S 보다 한 단계 위 — 이 판의 장비는 5성까지) · S 5 · A 4 · B 3 · C 2 · D 1 (등급 없으면 rules.galpi) */\n  if (gpT){\n    const tg = gpT[1] ? { SS: 6, S: 5, A: 4, B: 3, C: 2, D: 1 }[gpT[1]] : rules.galpi || 3;")

# ---------- C. 붉은암석 (민수 메모 J22 · 3D 명단 "동굴 관문 보스로 알맞음") — 잡아찢기 · 딥 킥 · 방어모드 · 바위던지기 · 점프 찍기 (중대형까지 · 겹친 몸 넘어짐) ----------
rep("'역장': 'ward', '뿌리 벽': 'root' };   // v7.19.2 딸기",
    "'역장': 'ward', '뿌리 벽': 'root', '잡아찢기': 'tear', '딥 킥': 'kick', '방어모드': 'stone', '바위던지기': 'boulder' };   // v7.19.2 딸기   /* v8.7.4 붉은암석 (J22) */")
rep(" spin: { rng: 9, v: 13, w: 0.55, wind: 0.75, rec: 0.5, cd: 11, mul: ",
    " tear: { rng: 0.6, wind: 0.6, rec: 0.6, hold: 2.2, cd: 12, brk: 0.06, mul: 0.6, kill: '중형' }, kick: { wind: 0.35, rec: 0.45, cd: 7, mul: 0.9, kb: 2.2 }, stone: { wind: 0.25, t: 5, cd: 14, slow: 0.4, near: 4, p: 0.06 }, boulder: { rng: 10, min: 3, wind: 0.8, rec: 0.6, cd: 10, v: 14, w: 0.6, mul: 1.3, kb: 1.6 },   /* v8.7.4 붉은암석 (민수 메모 J22): 잡아찢기 (손 닿는 상대를 hold 초 붙잡음 — 휘청 · 넘어짐 · 날아감 · 붙잡은 동안 받은 피해가 최대 체력 × brk 넘으면 놓침 → 끝까지 쥐면 kill 체급까지 찢김 · 더 크면 팔다리 하나) · 딥 킥 (차 날림 — 날아간 몸이 볼링 핀) · 방어모드 (t 초 받는 피해 1 · 걸음 × slow · 치지 않음 — near 칸 안에 상대가 있을 때 p 확률 (3D 바위 갑피 5초 · 14초)) · 바위던지기 (대포 — 곧게 날아가 처음 닿는 몸) */ spin: { rng: 9, v: 13, w: 0.55, wind: 0.75, rec: 0.5, cd: 11, mul: ")
# 방어모드: 받는 피해 1 · 걸음 느림 · 치지 않음 / 잡아찢기: 붙잡은 동안 맞은 피해로 놓침
rep("  if (t.marble || t.jrFly || t.jrInv){ dmg = marbleHit(W, u, t, dmg, o); if (!(dmg > 0)) return; }",
    "  if (t.marble || t.jrFly || t.jrInv){ dmg = marbleHit(W, u, t, dmg, o); if (!(dmg > 0)) return; }\n"
    "  if (t.stoneT != null && W.t < t.stoneT && dmg > 1){ dmg = 1; o = { ...(o || {}), stone: true, tag: '방어모드 — 피해 1' }; }   /* v8.7.4 방어모드 (붉은암석): 무엇이든 피해 1 */\n"
    "  { const G = t.act; if (G && G.k === 'spec' && G.s === 'tear' && G.phase === 'run' && u.side !== t.side){ G.dmg = (G.dmg || 0) + Math.min(dmg, t.hp); if (G.dmg >= t.max * (SPR(W, 'tear').brk || 0.06)) tearLet(W, t, '맞아서 놓침', u.i); } }   /* v8.7.4 잡아찢기는 끊을 수 있음 */")
rep("const spdNow = (W, u) => spdNow0(W, u) * (u.lie", "const spdNow = (W, u) => spdNow0(W, u) * (u.stoneT != null && W.t < u.stoneT ? (SPR(W, 'stone').slow || 0.4) : 1) * (u.lie")   # v8.7.4 방어모드는 느림
rep("function startAct(W, u, t, why){\n  if (u.jrB) return;", "function startAct(W, u, t, why){\n  if (u.jrB) return;\n  if (u.stoneT != null && W.t < u.stoneT) return;   /* v8.7.4 방어모드 동안은 치지 않음 */")
rep("function specReady(W, u, k){ const x = specOf(u, k); if (!x || !u.alive || u.down || u.noArms || u.crawl || u.lie || u.kb || W.t < x.cdT || W.t < u.brokenT || W.t < (u.proneT || -9)) return false;",
    "function specReady(W, u, k){ const x = specOf(u, k); if (!x || !u.alive || u.down || u.noArms || u.crawl || u.lie || u.kb || W.t < x.cdT || W.t < u.brokenT || W.t < (u.proneT || -9)) return false; if (u.stoneT != null && W.t < u.stoneT) return false;   /* v8.7.4 방어모드 */")
rep("function tryCharge(W, u, t, forced, noStance){\n  const C = W.rules.charge || {}, g = gap(u, t);\n",
    "function tryCharge(W, u, t, forced, noStance){\n  const C = W.rules.charge || {}, g = gap(u, t);\n  if (u.stoneT != null && W.t < u.stoneT) return false;   /* v8.7.4 방어모드 */\n")
# 끊김: 붙잡던 손이 휘청 · 넘어짐 · 날아감으로 풀림
rep("  if (a && (a.phase === 'wind' || a.phase === 'run') && a.k !== 'reload'){\n",
    "  if (a && a.k === 'spec' && a.s === 'tear' && a.phase === 'run'){ const v = W.units[a.held]; if (v) v.heldBy = null; L(W, { k: 'tearLet', a: u.i, b: a.held, why, vis: true }); }   /* v8.7.4 잡아찢기가 끊김 */\n"
    "  if (a && (a.phase === 'wind' || a.phase === 'run') && a.k !== 'reload'){\n")
# 붙잡힌 몸: 손 앞에 매달림 — 아무것도 못 함 (손이 풀리면 바로 놓임)
rep("  if (u.h2) h2Tick(W, u);   /* v8.7.4 2페이즈 */\n",
    "  if (u.h2) h2Tick(W, u);   /* v8.7.4 2페이즈 */\n"
    "  if (u.stoneT != null && W.t >= u.stoneT){ u.stoneT = null; L(W, { k: 'stoneOff', a: u.i, vis: u.side === 0 || !!u.seenBy }); }   /* v8.7.4 방어모드 풀림 */\n"
    "  if (u.heldBy != null){ const g = W.units[u.heldBy], A = g && g.act; if (g && g.alive && A && A.k === 'spec' && A.s === 'tear' && A.phase === 'run' && A.held === u.i){ const a = g.face || 0, D = g.r + u.r + 0.02; u.x = g.x + Math.cos(a) * D; u.y = g.y + Math.sin(a) * D; stop(u); u.act = null; u.burst = null; u.vx = u.vy = 0; return; } u.heldBy = null; }   /* v8.7.4 잡아찢기에 붙잡힘 */\n")
# 끝까지 쥐면 찢음: 손 닿는 동안 hold 초 — kill 체급까지는 찢겨 죽음 · 중대형 팔다리 하나 (부러지거나 찢김) · 대형 팔다리 하나 부러짐
rep("  if (A.phase !== 'wind'){ u.act = null; return; }\n  A.phase = 'rec'; A.end = W.t + (S.rec || 0.5); A.t1 = W.t; u.atkT = W.t;\n",
    "  if (k === 'tear' && A.phase === 'run'){ tearDone(W, u, A); return; }   /* v8.7.4 잡아찢기 — 끝까지 쥠 */\n"
    "  if (A.phase !== 'wind'){ u.act = null; return; }\n  A.phase = 'rec'; A.end = W.t + (S.rec || 0.5); A.t1 = W.t; u.atkT = W.t;\n"
    "  if (k === 'tear'){   // v8.7.4 잡아찢기 (J22): 손 닿는 상대를 붙잡음 (몸을 비틀어 피할 수 있음) — 초대형은 못 쥠 · 공중은 못 쥠\n"
    "    if (!t || !t.alive || t.down){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }\n"
    "    if (gap(u, t) > (S.rng || 0.6) + 0.3){ L(W, { k: 'miss', a: u.i, b: t.i, why: '손이 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); return; }\n"
    "    if ((SIZE_RANK[sizeOf(t)] || 0) >= SIZE_RANK['초대형'] || (t.act && t.act.k === 'leap')){ L(W, { k: 'miss', a: u.i, b: t.i, why: (t.act && t.act.k === 'leap') ? '공중 — 쥐지 못함' : '너무 커서 쥐지 못함', spec: k }); return; }\n"
    "    if (t.side !== u.side && evadeMelee(W, t, u)) return;\n"
    "    A.phase = 'run'; A.end = W.t + (S.hold || 2.2); A.held = t.i; A.dmg = 0; t.heldBy = u.i; interrupt(W, t, '붙잡혀 준비가 끊김'); stop(t); t.burst = null; flailDrop(W, t, '붙잡힘');\n"
    "    L(W, { k: 'tearGrab', a: u.i, b: t.i, sec: S.hold || 2.2, vis: u.side === 0 || t.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '붙잡힘!', c: 'd', t0: W.t }); return;\n"
    "  }\n"
    "  if (k === 'kick'){   // v8.7.4 딥 킥 (J22): 손 닿는 상대를 차 날림 (둔기 · 막으면 덜 날아감) — 날아간 몸이 볼링 핀처럼 둘레를 쓰러뜨림\n"
    "    if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }\n"
    "    if (gap(u, t) > u.rng + 0.45){ L(W, { k: 'miss', a: u.i, b: t.i, why: '발이 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); return; }\n"
    "    if (t.side !== u.side && evadeMelee(W, t, u)) return;\n"
    "    const o = strike(W, u, t, t, 1, false, { mul: S.mul || 0.9, wk: '둔기', tag: '딥 킥' }); if (o && t.alive && t.kb && t.kb.by === u.i) t.kb = null;\n"
    "    if (t.alive && !t.kb) shove(W, u, t, (S.kb || 2.2) * (o && o.block ? 0.6 : 1), t.x - u.x, t.y - u.y, { tag: '딥 킥에 날아감', how: 'kick' });\n"
    "    L(W, { k: 'kick', a: u.i, b: t.i, vis: u.side === 0 || t.side === 0 || !!u.seenBy }); return;\n"
    "  }\n"
    "  if (k === 'stone'){   // v8.7.4 방어모드 (J22 · 3D 바위 갑피): t 초 — 받는 피해 1 · 걸음 × slow · 치지 않음\n"
    "    u.stoneT = W.t + (S.t || 5); u.act = null; L(W, { k: 'stoneOn', a: u.i, sec: S.t || 5, vis: u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '방어모드', c: 'b', t0: W.t }); return;\n"
    "  }\n"
    "  if (k === 'boulder'){   // v8.7.4 바위던지기 (J22 — 대포): 둘레 바위를 뜯어 던짐 — 곧게 날아가 처음 닿는 몸 (동료도) 을 치고 크게 날려 보냄 · 바위에 닿으면 부서짐\n"
    "    const tx = t && t.alive ? t.x : u.x + Math.cos(u.face || 0), ty = t && t.alive ? t.y : u.y + Math.sin(u.face || 0), d = Math.hypot(tx - u.x, ty - u.y) || 1, dx = (tx - u.x) / d, dy = (ty - u.y) / d;\n"
    "    (W.spins || (W.spins = [])).push({ boulder: true, by: u.i, side: u.side, x: u.x + dx * (u.r + 0.3), y: u.y + dy * (u.r + 0.3), dx, dy, v: S.v || 14, left: S.rng || 10, w: S.w || 0.6, mul: S.mul || 1.6, kb: S.kb || 1.6, hit: [], t0: W.t });\n"
    "    u.fg = u.face = Math.atan2(dy, dx); L(W, { k: 'boulder', a: u.i, b: t ? t.i : null, vis: true }); return;\n"
    "  }\n")
# 바위: 처음 닿는 몸에서 멈춤 (볼링) · 바위에 닿으면 부서짐 (떨어지는 무기가 없음)
rep("        const o = strike(W, by, e, e, 1, !!S.wave,",
    "        if (S.boulder){ const o = strike(W, by, e, e, 1, false, { mul: S.mul, tag: '날아온 바위', wk: '둔기' }); if (o && e.alive && e.kb && e.kb.by === by.i) e.kb = null; if (e.alive && !e.kb) shove(W, by, e, S.kb * (o && o.block ? 0.6 : 1), S.dx, S.dy, { tag: '바위에 맞아 날아감', mass: 300, fix: true }); S.done = true; break; }   /* v8.7.4 바위던지기 — 처음 닿는 몸 */\n"
    "        const o = strike(W, by, e, e, 1, !!S.wave,")
rep("    if (S.done && S.wave) L(W, { k: 'waveEnd', a: S.by, n: S.hit.length, vis: true });",
    "    if (S.done && S.boulder){ L(W, { k: 'boulderEnd', a: S.by, b: S.hit.length ? S.hit[0] : null, x: +S.x.toFixed(1), y: +S.y.toFixed(1), vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: S.x, y: S.y, s: '쾅!', c: 'd', t0: W.t }); }   /* v8.7.4 */\n"
    "    else if (S.done && S.wave) L(W, { k: 'waveEnd', a: S.by, n: S.hit.length, vis: true });")
# 스스로 쓰기 (적 · 아군 같은 판단): 방어모드 (가까이 상대 · 3D 처럼 확률) · 잡아찢기 (손 닿음) · 딥 킥 (뒤에 상대가 줄지어 있으면 볼링) · 바위던지기 (먼 상대 · 길에 동료 없음)
rep("  if (specReady(W, u, 'quake')){ const Q = SPR(W, 'quake'), ",
    "  if (specReady(W, u, 'stone')){ const S5 = SPR(W, 'stone'); if (W.units.some(e => e.alive && !e.down && e.side !== u.side && gap(u, e) <= (S5.near || 4)) && W.rand() < (S5.p != null ? S5.p : 0.06)) return startSpec(W, u, null, 'stone', '방어모드');   /* v8.7.4 J22 */ }\n"
    "  if (specReady(W, u, 'tear') && g <= (SPR(W, 'tear').rng || 0.6) && !t.down && (SIZE_RANK[sizeOf(t)] || 0) < SIZE_RANK['초대형'] && !(t.act && t.act.k === 'leap') && W.rand() < 0.3) return startSpec(W, u, t, 'tear', '붙잡아 찢음');   /* v8.7.4 J22 */\n"
    "  if (specReady(W, u, 'kick') && g <= u.rng + 0.3){ const a0 = Math.atan2(t.y - u.y, t.x - u.x), row = W.units.some(e => e.alive && e !== t && e.side === t.side && dist(e, t) < 3.2 && angDiff(Math.atan2(e.y - t.y, e.x - t.x), a0) < 0.6); if (row || W.rand() < 0.08) return startSpec(W, u, t, 'kick', row ? '뒤의 무리 쪽으로 차 날림' : '차 날림'); }   /* v8.7.4 J22 */\n"
    "  if (specReady(W, u, 'boulder')){ const B = SPR(W, 'boulder'); if (g >= (B.min || 3) && g <= (B.rng || 10) - 1){ const d0 = dist(u, t) || 1, ex = u.x + (t.x - u.x) / d0 * (B.rng || 10), ey = u.y + (t.y - u.y) / d0 * (B.rng || 10), fb = W.units.filter(e => e.alive && e !== u && segD(u, ex, ey, e) < (B.w || 0.6) + e.r).sort((p, q) => dist(u, p) - dist(u, q))[0]; if (fb && fb.side !== u.side) return startSpec(W, u, fb === t ? t : fb, 'boulder', fb === t ? '바위를 뜯어 던짐' : '길목의 상대에게 바위를 던짐'); } }   /* v8.7.4 J22 */\n"
    "  if (specReady(W, u, 'quake')){ const Q = SPR(W, 'quake'), ")
# 예고 회피: 날아올 바위 (줄) · 잡아찢기 · 딥 킥 (한 사람)
rep("    else if (A.k === 'h2' && A.Z){",
    "    else if (A.k === 'spec' && A.s === 'boulder' && t){ const S = SPR(W, 'boulder'); Z = { k: 'line', ang: Math.atan2(t.y - a.y, t.x - a.x), len: S.rng || 10, w: (S.w || 0.6) + 0.25, what: '날아올 바위', foe: true }; }   /* v8.7.4 */\n"
    "    else if (A.k === 'spec' && (A.s === 'tear' || A.s === 'kick') && t && t.side !== a.side){ Z = { k: 'one', b: t.i, ang: Math.atan2(t.y - a.y, t.x - a.x), what: A.s === 'tear' ? '붙잡으려는 손' : '딥 킥' }; }   /* v8.7.4 */\n"
    "    else if (A.k === 'h2' && A.Z){")
# 점프 찍기 (도약 강타): 몸마다 찌부러뜨리는 체급 (붉은암석 중대형 — J22) · 내려앉은 몸에 겹친 이는 넘어짐 (J22 '겹친 몸 넘어짐')
rep("const Q = SPR(W, 'quake'), R = A.r || Q.r || 2.4, kr = SIZE_RANK[Q.kill || '중형'] != null ? SIZE_RANK[Q.kill || '중형'] : 1;",
    "const Q = SPR(W, 'quake'), R = A.r || Q.r || 2.4, kq = u.quakeKill || Q.kill || '중형', kr = SIZE_RANK[kq] != null ? SIZE_RANK[kq] : 1;   /* v8.7.4 몸마다 (붉은암석 중대형) */")
rep("p = !boxRock(W, x, y, e.r * 0.9) ? { x, y } : freeSpot(W, x, y, e.r); if (p){ e.x = p.x; e.y = p.y; } push++; }   // 몸에 걸친 이는 몸 밖으로",
    "p = !boxRock(W, x, y, e.r * 0.9) ? { x, y } : freeSpot(W, x, y, e.r); if (p){ e.x = p.x; e.y = p.y; } push++; knockDown(W, e, 1.0, u.i, '내려앉은 몸에 깔림'); }   // 몸에 걸친 이는 몸 밖으로   /* v8.7.4 겹친 몸은 넘어짐 (J22) */")

rep("  if (K.left <= 0.01){ u.kb = null; if (!K.o.mt && W.rand() < downOdds(W, u, K))", "  if (K.left <= 0.01){ u.kb = null; if (!K.o.mt && !K.o.noDown && W.rand() < downOdds(W, u, K))")   # v8.7.4 3D 기술표의 밀침은 넘어뜨리지 않음
# 잡아찢기 마무리 · 놓침 · 붙잡힌 동료 구하기 · 방어모드 상대는 기다림
rep("function startPalm(W, u, t, why){", r"""// v8.7.4 잡아찢기 끝까지: kill 체급 (중형) 까지는 찢겨 죽음 · 중대형은 팔다리 하나 (부러지거나 찢김) · 대형은 팔다리 하나 부러짐 — 몸 전체가 재생하는 몸 ([불사] · [재생]) 은 팔다리 대신 크게 다침
function tearDone(W, u, A){
  const S = SPR(W, 'tear'), t = W.units[A.held]; u.act = { k: 'spec', s: 'tear', b: A.b, phase: 'rec', t0: W.t, end: W.t + (S.rec || 0.6) }; u.atkT = W.t;
  if (!t || !t.alive){ return; } t.heldBy = null; const sz = SIZE_RANK[sizeOf(t)] != null ? SIZE_RANK[sizeOf(t)] : 1, kr = SIZE_RANK[S.kill || '중형'] != null ? SIZE_RANK[S.kill || '중형'] : 1; let res;
  if (sz <= kr){ applyDmg(W, u, t, Math.ceil(t.hp) + 999, { ff: t.side === u.side, far: false, part: '몸통', tag: '잡아찢김', death: 'tear' }); res = 'kill'; }
  else { hurtRaw(W, u, t, u.atk * u.atkMul * (W.rules.lethal || 1) * (S.mul || 0.6), { tag: '잡아찢기' });
    if (t.alive && !wholeBody(t)){ const leg = W.rand() < 0.5, how = sz >= (SIZE_RANK['대형'] || 3) ? '둔기' : (W.rand() < 0.5 ? '날붙이' : '둔기'); if (leg && !t.crawl) cripple(W, t, u.i, how); else if (!maimArm(W, t, u.i, how)) cripple(W, t, u.i, how); res = how === '날붙이' ? 'tear' : 'break'; } else res = 'hurt'; }
  L(W, { k: 'tear', a: u.i, b: t.i, res, size: sizeOf(t), vis: u.side === 0 || t.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: res === 'kill' ? '찢김!' : res === 'tear' ? '찢겨 나감!' : res === 'break' ? '부러짐!' : '짓눌림!', c: 'd', t0: W.t });
}
// 잡아찢기를 놓침 (맞은 피해 · 끊김) — 붙잡힌 몸은 그 자리에 풀려남
function tearLet(W, u, why, by){ const A = u.act; if (!A || A.k !== 'spec' || A.s !== 'tear' || A.phase !== 'run') return; const v = W.units[A.held]; if (v) v.heldBy = null; u.act = { k: 'spec', s: 'tear', b: A.b, phase: 'rec', t0: W.t, end: W.t + 0.4 }; L(W, { k: 'tearLet', a: u.i, b: A.held, by: by != null ? by : null, why, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '놓침!', c: 'g', t0: W.t }); }
function startPalm(W, u, t, why){""")
rep("function fight(W, u, t, dt, see, ordered){\n",
    "function fight(W, u, t, dt, see, ordered){\n"
    "  if (!ordered){ const H = W.units.find(m => m.alive && m !== u && m.side === u.side && m.heldBy != null); const g = H && W.units[H.heldBy];   /* v8.7.4 붙잡힌 동료를 구함 — 붙잡은 상대를 침 (끊을 수 있음) */\n"
    "    if (g && g.alive && g !== t && g.side !== u.side && dist(u, g) < 9 && canSee(W, u, g)){ t = g; see = true; u.target = g; u.state = u.side ? 'hunt' : 'fight'; setMood(W, u, H.name + ' 구하기', g.i); } }\n"
    "  if (!ordered && t.stoneT != null && W.t < t.stoneT){   /* v8.7.4 방어모드인 상대 (피해 1) — 다른 상대가 보이면 그쪽 · 아니면 손 밖에서 기다림 */\n"
    "    const o2 = W.units.filter(e => e.alive && !e.down && e.side === t.side && e !== t && !(e.stoneT != null && W.t < e.stoneT) && canSee(W, u, e)).sort((p, q) => dist(u, p) - dist(u, q))[0];\n"
    "    if (o2 && dist(u, o2) < 12){ t = o2; u.target = o2; }\n"
    "    else { u.last = { x: t.x, y: t.y }; if (gap(u, t) < (t.rng || 0.5) + 0.8){ const p = fallbackPt(W, u, t, 1.2); if (p){ setMood(W, u, '방어모드 — 물러나 기다림', t.i); goTo(W, u, p.x, p.y, dt); return; } } stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '방어모드 — 기다림', t.i); return; } }\n")
# 설계: 점프 찍기가 찌부러뜨리는 체급 (몸마다)
rep("  { const U = W.units[i], K = p.h2 && H2K[p.h2]; U.scaleMail = (p.traits || []).includes('비늘 깃털 갑옷');",
    "  { const U = W.units[i], K = p.h2 && H2K[p.h2]; U.scaleMail = (p.traits || []).includes('비늘 깃털 갑옷'); if (p.quakeKill && SIZE_RANK[p.quakeKill] != null) U.quakeKill = p.quakeKill;   /* v8.7.4 점프 찍기 체급 (붉은암석 중대형) */")

# ---------- E. 돌진 길 (ev715 A — v8.7.2 부터 남은 실패): 물러나는 사수가 나를 노린 돌진의 길 위로 곧장 뒷걸음질 → 받힘 (돌진은 달아나는 몸의 앞자리를 노림) ----------
# 물러날 자리는 돌진 길 (띠) 밖 옆으로 · 띠를 가로질러 건너편으로는 안 감 · 가던 자리가 띠 안이 되면 다시 고름 — 아군 (회피기동) · 적 궁수 (본능) 같은 규칙
rep("const evLog = (W, u, f, m, ex) =>",
    "// v8.7.4 돌진 길: 나를 노린 돌진 (준비 · 달림) 의 앞쪽 띠 (돌진하는 몸 + 내 몸 + 0.45칸 폭)\n"
    "function chargeLane(W, u, ok){ const c = W.units.find(e => e.alive && e.side !== u.side && e.act && e.act.k === 'charge' && (e.act.phase === 'run' || e.act.phase === 'wind') && e.act.b === u.i && ok(e)); if (!c) return null;\n"
    "  const A = c.act, a = A.phase === 'run' && A.dx != null ? Math.atan2(A.dy, A.dx) : Math.atan2(u.y - c.y, u.x - c.x);\n"
    "  return { c, x: c.x, y: c.y, dx: Math.cos(a), dy: Math.sin(a), w: c.r + u.r + 0.45 }; }\n"
    "const laneSide = (L, x, y) => (y - L.y) * L.dx - (x - L.x) * L.dy;   // 띠 가운데 줄의 어느 쪽 (부호) · 얼마나 (크기)\n"
    "const laneIn = (L, x, y) => (x - L.x) * L.dx + (y - L.y) * L.dy > -0.3 && Math.abs(laneSide(L, x, y)) < L.w;\n"
    "const laneOk = (L, u, x, y) => !laneIn(L, x, y) && !(Math.abs(laneSide(L, u.x, u.y)) > 0.05 && laneSide(L, x, y) * laneSide(L, u.x, u.y) < 0);   // 띠 밖 · 지금 있는 쪽 그대로 (띠를 가로지르지 않음)\n"
    "// v8.7.4 맞붙음: 손이 빈 (치는 중이 아닌) 근접 상대의 손 닿는 곳 — 걸어서 빠지면 교전 구속 (등을 보인 틈에 일격 · 칠 수 있는 몸의 조건은 그 규칙과 같음) · 물러나기를 멈추고 그 자리에서 쏨 · 싸움 (물러나기를 고를 때의 규칙과 같음)\n"
    "const kiteEng = (W, u) => { const K = EVM(W).kite || {}; return W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && !f.down && !f.crawl && !f.noArms && !f.kb && !f.act && f.heldBy == null && !(f.stoneT != null && W.t < f.stoneT) && W.t >= (f.stunT || -9) && W.t >= (f.proneT || -9) && canSee(W, u, f) && gap(u, f) < Math.max(K.contact != null ? K.contact : 0.7, f.rng + 0.25)); };\n"
    "// v8.7.4 돌진이 닿기까지 남은 시간 (준비 남은 시간 + 남은 거리를 도움닫기 속력으로)\n"
    "function laneEta(W, c, u){ const A = c.act, C = W.rules.charge || {}, g = Math.max(0, gap(u, c)); if (A.phase === 'wind') return Math.max(0, A.end - W.t) + chargeTime(C, spdNow(W, c), g); const v0 = A.v0 != null ? A.v0 : spdNow(W, c), r0 = A.run || 0; return chargeTime(C, v0, r0 + g) - chargeTime(C, v0, r0); }\n"
    "// 한 발 쏘고 (준비 + 회복) 길 밖으로 나갈 (뛰어서) 시간이 남으면 먼저 쏨 — '쏜 다음에 물러남' 그대로\n"
    "const laneShootFirst = (W, u, L) => isFar(u) && !needReload(u) && u.mag !== 0 && u.ammo !== 0 && gap(u, L.c) <= u.rng && laneEta(W, L.c, u) > aimT(W, u) + (u.rec || 0.5) + (L.w - Math.abs(laneSide(L, u.x, u.y)) + 0.3) / Math.max(0.5, spdNow(W, u) * (W.rules.run || 1.3)) + 0.15;\n"
    "const evLog = (W, u, f, m, ex) =>")
# 아군 회피기동: 하던 물러나기를 이어 갈 때 — 가는 자리가 돌진 길 안 (또는 건너편) 이면 다시 고름
rep("""  if (u.mv && (u.mv.k === 'kite' || u.mv.k === 'slip' || u.mv.k === 'out') && W.t < u.mv.until && u.mv.ev){   // 하던 회피를 이어 감
    if (Math.hypot(u.mv.x - u.x, u.mv.y - u.y) > 0.12){ setMood(W, u, u.mv.m, u.mv.b); goTo(W, u, u.mv.x, u.mv.y, dt); return true; }
    u.mv = null; stop(u); }""",
"""  if (u.mv && (u.mv.k === 'kite' || u.mv.k === 'slip' || u.mv.k === 'out') && W.t < u.mv.until && u.mv.ev){   // 하던 회피를 이어 감
    const LN = chargeLane(W, u, f => canSee(W, u, f)); if (LN && !laneOk(LN, u, u.mv.x, u.mv.y)) u.mv = null;   /* v8.7.4 가는 자리가 돌진 길 안 (또는 건너편) — 다시 고름 */
    else if (u.mv.k === 'kite' && kiteEng(W, u)){ u.mv = null; stop(u); }   /* v8.7.4 맞붙음 — 걸어서 빠지면 등을 보인 틈에 맞음 */
    else if (Math.hypot(u.mv.x - u.x, u.mv.y - u.y) > 0.12){ setMood(W, u, u.mv.m, u.mv.b); goTo(W, u, u.mv.x, u.mv.y, dt); return true; }
    else { u.mv = null; stop(u); } }""")
rep("""  const x = W.units.filter(f => seen(f) && !isFar(f) && gap(u, f) < (K.trig || 3) && (f.target === u || (f.act && f.act.b === u.i) || focusOf(W, f) === u)).sort((p, q) => gap(u, p) - gap(u, q))[0];
  if (!x || W.t < (u.kiteNo || 0) || cornered(W, u)) return false;""",
"""  const LN = chargeLane(W, u, seen);   /* v8.7.4 나를 노린 돌진 (본 것만) — 길이 닿으면 trig 밖이어도 그 몸이 물러날 까닭 */
  const x = LN ? LN.c : W.units.filter(f => seen(f) && !isFar(f) && gap(u, f) < (K.trig || 3) && (f.target === u || (f.act && f.act.b === u.i) || focusOf(W, f) === u)).sort((p, q) => gap(u, p) - gap(u, q))[0];
  if (!x || (W.t < (u.kiteNo || 0) && !LN) || cornered(W, u)) return false;   // 돌진 길은 쉬는 중에도 비킴 (v8.7.4)""")
rep("""  const g = gap(u, x), close = g < (K.close || 2.4), shot = (u.lastFireT != null ? u.lastFireT : -9) > (u.kiteT0 != null ? u.kiteT0 : -9);
  if (!close && !shot) return false;   // 쏜 다음에 물러남""",
"""  const g = gap(u, x), close = g < (K.close || 2.4), shot = (u.lastFireT != null ? u.lastFireT : -9) > (u.kiteT0 != null ? u.kiteT0 : -9);
  if (!close && !shot && !LN) return false;   // 쏜 다음에 물러남 — 나를 노린 돌진이면 쏘기 전에도 길 밖으로 (v8.7.4)
  if (LN && !shot && laneShootFirst(W, u, LN)) return false;   // 돌진이 닿기 전에 한 발 쏘고 비킬 시간이 있으면 먼저 쏨 (v8.7.4)""")
rep("""  if (W.t - B.t0 > (K.stuck || 2.5) && g < B.g0 + 0.8){""", """  if (!LN && W.t - B.t0 > (K.stuck || 2.5) && g < B.g0 + 0.8){   /* v8.7.4 돌진이 오는데 '따라붙음' 으로 서 버리지 않음 */""")
rep("""  const mc = mates.filter(m => !isFar(m)), base = Math.atan2(u.y - x.y, u.x - x.x), st = K.step || 2.2; let best = null, bs = -1e9;
  for (const da of [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = u.x + Math.cos(ang) * st, py = u.y + Math.sin(ang) * st;
    if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, u.r) || !fatClear(W.map, u.x, u.y, px, py, u.r * 0.8)) continue;
    if (W.units.some(f => seen(f) && !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - u.r < f.rng + 1.2)) continue;
    const sc = -Math.abs(da) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (sc > bs){ bs = sc; best = { x: px, y: py }; } }
  if (!best) return false;
  const rn = g > Math.max(K.runG != null ? K.runG : 1.6, x.rng + 1.15);   /* v7.17 리치만큼 */   // 가까우면 상대를 보며 뒷걸음 (등을 안 보임) · 여유가 있으면 뜀
  u.mv = { k: 'kite', ev: true, x: best.x, y: best.y, b: x.i, run: rn, until: W.t + (K.dur || 0.9), m: rn ? '거리 벌림 — 쏘고 물러남' : '거리 벌림 — 보며 뒷걸음' }; u.kiteT0 = W.t;
  if (W.t >= (u.kiteLogT || 0)){ u.kiteLogT = W.t + 4; evLog(W, u, x, 'kite'); }""",
"""  const mc = mates.filter(m => !isFar(m)), base = LN ? Math.atan2(LN.dy, LN.dx) : Math.atan2(u.y - x.y, u.x - x.x), st = K.step || 2.2; let best = null, bs = -1e9;
  for (const da of LN ? [1.57, -1.57, 1.2, -1.2, 1.9, -1.9, 0.8, -0.8] : [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = u.x + Math.cos(ang) * st, py = u.y + Math.sin(ang) * st;   /* v8.7.4 돌진이 오면 길의 옆으로 */
    if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, u.r) || !fatClear(W.map, u.x, u.y, px, py, u.r * 0.8)) continue;
    if (LN && !laneOk(LN, u, px, py)) continue;
    if (W.units.some(f => seen(f) && !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - u.r < f.rng + 1.2)) continue;
    const sc = -Math.abs(Math.abs(da) - (LN ? 1.57 : 0)) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (sc > bs){ bs = sc; best = { x: px, y: py }; } }
  if (!best) return false;
  const rn = g > Math.max(K.runG != null ? K.runG : 1.6, x.rng + 1.15);   /* v7.17 리치만큼 */   // 가까우면 상대를 보며 뒷걸음 (등을 안 보임) · 여유가 있으면 뜀 (돌진 길을 비킬 때도 같음)
  u.mv = { k: 'kite', ev: true, lane: !!LN, x: best.x, y: best.y, b: LN ? LN.c.i : x.i, run: rn, until: W.t + (K.dur || 0.9), m: LN ? '돌진 길 밖으로 — 옆으로 빠짐' : rn ? '거리 벌림 — 쏘고 물러남' : '거리 벌림 — 보며 뒷걸음' }; u.kiteT0 = W.t;
  if (LN ? u.laneKey !== LN.c.i + ':' + LN.c.act.t0 : W.t >= (u.kiteLogT || 0)){ if (LN) u.laneKey = LN.c.i + ':' + LN.c.act.t0; else u.kiteLogT = W.t + 4; evLog(W, u, LN ? LN.c : x, 'kite', LN ? { lane: true } : null); }""")
# 적 궁수 카이팅 (본능) — 같은 규칙
rep("""    const x = known.filter(f => !isFar(f) && !f.down && !f.crawl && gap(a, f) < 3 && (f.target === a || (f.order && f.order.b === a.i) || focusOf(W, f) === a)).sort((p, q) => gap(a, p) - gap(a, q))[0]; if (!x) continue;""",
"""    const LN = chargeLane(W, a, f => known.includes(f)), x = LN ? LN.c : known.filter(f => !isFar(f) && !f.down && !f.crawl && gap(a, f) < 3 && (f.target === a || (f.order && f.order.b === a.i) || focusOf(W, f) === a)).sort((p, q) => gap(a, p) - gap(a, q))[0]; if (!x) continue;   /* v8.7.4 나를 노린 돌진 — 3칸 밖이어도 */""")
rep("""    const close = gap(a, x) < 2.4, shot = (a.lastFireT != null ? a.lastFireT : -9) > (a.kiteT0 != null ? a.kiteT0 : -9);
    if (!close && (!shot || mine.some(o => o !== a && isFar(o) && o.alive && ((o.mv && o.mv.k === 'kite' && W.t < o.mv.until) || (o.act && o.act.k === 'leap'))))) continue;
    const mc = mine.filter(m => m !== a && !isFar(m)), base = Math.atan2(a.y - x.y, a.x - x.x); let best = null, bs = -1e9;
    for (const da of [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = a.x + Math.cos(ang) * 2.2, py = a.y + Math.sin(ang) * 2.2;
      if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, a.r)) continue;
      if (known.some(f => !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - a.r < f.rng + 1.2)) continue;
      const s = -Math.abs(da) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (s > bs){ bs = s; best = { x: px, y: py }; } }
    if (!best) continue; a.mv = { k: 'kite', x: best.x, y: best.y, b: x.i, run: true, until: W.t + 1.0 }; a.kiteT0 = W.t;
    if (W.t >= (a.kiteLogT || 0)){ a.kiteLogT = W.t + 5; L(W, { k: 'mvr', side: 1, m: 'kite', a: a.i, b: x.i, obs: !!a.seenBy, vis: true }); } }""",
"""    const close = gap(a, x) < 2.4, shot = (a.lastFireT != null ? a.lastFireT : -9) > (a.kiteT0 != null ? a.kiteT0 : -9);   /* v8.7.4 나를 노린 돌진이면 길의 옆으로 (아군과 같은 규칙) */
    if (!LN && !close && (!shot || mine.some(o => o !== a && isFar(o) && o.alive && ((o.mv && o.mv.k === 'kite' && W.t < o.mv.until) || (o.act && o.act.k === 'leap'))))) continue;
    if (gap(a, x) < Math.max(((EVM(W).kite || {}).contact != null ? EVM(W).kite.contact : 0.7), x.rng + 0.25)) continue;   // 이미 맞붙음 — 등을 보이면 맞음 (그 자리에서 쏨 · 아군과 같은 규칙 · v8.7.4)
    if (LN && !shot && laneShootFirst(W, a, LN)) continue;   // 돌진이 닿기 전에 한 발 쏘고 비킬 시간이 있으면 먼저 쏨 (v8.7.4)
    const mc = mine.filter(m => m !== a && !isFar(m)), base = LN ? Math.atan2(LN.dy, LN.dx) : Math.atan2(a.y - x.y, a.x - x.x); let best = null, bs = -1e9;
    for (const da of LN ? [1.57, -1.57, 1.2, -1.2, 1.9, -1.9, 0.8, -0.8] : [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = a.x + Math.cos(ang) * 2.2, py = a.y + Math.sin(ang) * 2.2;
      if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, a.r)) continue;
      if (LN && !laneOk(LN, a, px, py)) continue;
      if (known.some(f => !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - a.r < f.rng + 1.2)) continue;
      const s = -Math.abs(Math.abs(da) - (LN ? 1.57 : 0)) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (s > bs){ bs = s; best = { x: px, y: py }; } }
    if (!best) continue; a.mv = { k: 'kite', lane: !!LN, x: best.x, y: best.y, b: LN ? LN.c.i : x.i, run: true, until: W.t + 1.0 }; a.kiteT0 = W.t;
    if (LN ? a.laneKey !== LN.c.i + ':' + LN.c.act.t0 : W.t >= (a.kiteLogT || 0)){ if (LN) a.laneKey = LN.c.i + ':' + LN.c.act.t0; else a.kiteLogT = W.t + 5; L(W, { k: 'mvr', side: 1, m: 'kite', a: a.i, b: LN ? LN.c.i : x.i, lane: LN ? true : undefined, obs: !!a.seenBy, vis: true }); } }""")
rep("""  const M = u.mv, T = M.b != null ? W.units[M.b] : null;
  if (M.k === 'surround'){""",
"""  const M = u.mv, T = M.b != null ? W.units[M.b] : null;
  if (M.k === 'kite'){ const LN = chargeLane(W, u, f => canSee(W, u, f)); if ((LN && !laneOk(LN, u, M.x, M.y)) || kiteEng(W, u)){ u.mv = null; return false; } }   /* v8.7.4 가던 자리가 돌진 길 안 (또는 건너편) — 다시 고름 · 맞붙음이면 멈춤 */
  if (M.k === 'surround'){""")
# 사수의 맞붙음 (아군 · 적 같음): 손이 빈 근접이 손 닿는 곳에 있으면 걸어서 빠지면 (교전 구속) 틈에 맞고 · 쏘면 준비 · 회복 동안 발이 묶여 맞음 →
# 쏘지도 걷지도 않고 그 일격을 기다림 (1.5초까지) — 상대가 치려고 준비하면 (구속이 풀림) 그때 물러나 헛치게 함 (60판: 켬 맞음 1 · 피해 36 / 그대로면 2 · 81)
rep("  if (!ordered && !isFar(t) && g < Math.min(1.2, u.rng * 0.3) + (u.mood === '거리 벌리기' ? 0.4 : 0) && u.bold < 0.6 && !cornered(W, u) && W.t >= (u.kiteNo || 0)){",
    "  if (!ordered && !isFar(t) && u.bold < 0.6 && !cornered(W, u) && kiteEng(W, u)){ if (u.engT == null || W.t - u.engT > 3) u.engT = W.t; if (W.t - u.engT < 1.5){ stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '맞붙음 — 일격을 기다림', t.i); return; } } else u.engT = null;   /* v8.7.4 */\n"
    "  if (!ordered && !isFar(t) && g < Math.min(1.2, u.rng * 0.3) + (u.mood === '거리 벌리기' ? 0.4 : 0) && u.bold < 0.6 && !cornered(W, u) && W.t >= (u.kiteNo || 0)){")


# ---------- F. 노인의 왕관 [★권위E] (C1): 맵의 모든 신성 상대 — [개조된 신체] · [대리석 피부] · 성해포의 [재생] — 효과 authW 만큼 약하게 · 권위 (신성 봉인) 중엔 셋 다 꺼짐 ----------
rep("function mbF(W, u, k){",
    "// v8.7.4 신성 (카리우스 · 신성 등급) · 신성 효과에 곱할 몫 (상대가 왕관을 썼으면 1 − authW)\n"
    "const holyOf = u => u.ref === 'C-003' || (u.traits || []).some(t => /^신성/.test(t));\n"
    "const authK = (W, u) => authOn(W, u) ? 1 - ((W.rules.modBody || {}).authW != null ? W.rules.modBody.authW : 0.15) : 1;\n"
    "function mbF(W, u, k){")
rep("  if (!t.marble) return dmg;\n", "  if (!t.marble || W.seal) return dmg;   /* v8.7.4 권위 (신성 봉인) 중엔 대리석 피부도 꺼짐 */\n")
rep("      t.mStepT = W.t + (R.stepCd || 4); t.x = x; t.y = y; stop(t);", "      t.mStepT = W.t + (R.stepCd || 4) / authK(W, t); t.x = x; t.y = y; stop(t);   /* v8.7.4 왕관: 스텝 간격이 그만큼 김 */")
rep("  if (!strong && W.rand() < (R.p != null ? R.p : 0.59)){ const d2 = Math.max(1, Math.round(dmg * (R.mul != null ? R.mul : 0.3))); L(W, { k: 'marble', a: u.i, b: t.i, how: 'block', dmg: Math.round(dmg), got: d2, vis });",
    "  if (!strong && W.rand() < (R.p != null ? R.p : 0.59)){ const ak = authK(W, t), d2 = Math.max(1, Math.round(dmg * (1 - (1 - (R.mul != null ? R.mul : 0.3)) * ak))); L(W, { k: 'marble', a: u.i, b: t.i, how: 'block', dmg: Math.round(dmg), got: d2, auth: ak < 1 || undefined, vis });   /* v8.7.4 왕관: 받아 내는 몫이 authW 만큼 적음 */")
rep("  for (const u of W.units) if (u.alive && u.regenHp > 0 && u.hp < u.max) u.hp = Math.min(u.max, u.hp + u.regenHp * dt);",
    "  for (const u of W.units) if (u.alive && u.regenHp > 0 && u.hp < u.max){ const hk = holyOf(u) ? (W.seal ? 0 : authK(W, u)) : 1; if (hk > 0) u.hp = Math.min(u.max, u.hp + u.regenHp * hk * dt); }   /* v8.7.4 신성의 재생 (성해포): 왕관 앞에선 authW 만큼 · 권위 (봉인) 중엔 멎음 */")


# ---------- G. 세자르 (C4 · 2D 그대로): 하늘 가르기 · 관통 찌르기 · 냉기 참격은 가장 가까운 이를 노림 (그 거리가 기술 거리 안일 때) — rules.cz.aim 'best' 면 예전처럼 가장 많이 걸리는 쪽 ----------
rep("    if (z.upcut <= 0){ const o = best(inR(UP.d0 || 2.1, UP.d1 || 10), ang => czLineN(W, u, ang, UP.len || 16, UP.w || 0.8)); if (o) return czStart(W, u, 'upcut', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) }); }",
    "    const pick = (a0, a1, f) => { if (Z.aim === 'best') return best(inR(a0, a1), f); const q = dist(u, t); return q > a0 && q < a1 ? t : null; };   /* v8.7.4 2D 그대로: 가장 가까운 이 (그 거리가 기술 거리 안일 때만) */\n"
    "    if (z.upcut <= 0){ const o = pick(UP.d0 || 2.1, UP.d1 || 10, ang => czLineN(W, u, ang, UP.len || 16, UP.w || 0.8)); if (o) return czStart(W, u, 'upcut', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) }); }")
rep("    if (z.thrust <= 0){ const o = best(inR(TH.d0 || 1.8, TH.d1 || 6.3), ang =>", "    if (z.thrust <= 0){ const o = pick(TH.d0 || 1.8, TH.d1 || 6.3, ang =>")
rep("    if (z.wave <= 0){ const o = best(inR((WV.d0 || 3.1) - 0.01, (WV.d1 || 7) + 0.01), ang =>", "    if (z.wave <= 0){ const o = pick((WV.d0 || 3.1) - 0.01, (WV.d1 || 7) + 0.01, ang =>")

# ---------- H. 제3세력 (I6 — 각혈): 2편 = 누구의 편도 아님 — 보이는 누구든 침 · 망자 (1편) 와도 서로 싸움 · 쓰러뜨려야 맵이 정리됨 ----------
# 적대는 원래부터 '편이 다르면' (side !==) 이라 그대로 · 1편의 지휘 (작전 · 대치 · 경보 · 암살조) 는 1편만 · 2편은 제 눈으로 보고 쫓고 찾음 (1편의 혼자 판단과 같은 규칙)
rep("farDmg: [0, 0]", "farDmg: [0, 0, 0]")
rep("kills: [0, 0]", "kills: [0, 0, 0]")
rep("  if (u.side === 1){\n    for (const k in u.threat) u.threat[k] *= 0.97;", "  if (u.side >= 1){   /* v8.7.4 제3세력 (2편) 도 제 눈으로 보고 쫓음 */\n    for (const k in u.threat) u.threat[k] *= 0.97;")
rep("+ (W.plan && W.plan.k === 'hunt' && supportOf(W, f) === 0 ? 6 : 0) + focusBonus(W, u, f) + taskBias(W, u, f);",
    "+ (u.side === 1 ? (W.plan && W.plan.k === 'hunt' && supportOf(W, f) === 0 ? 6 : 0) + focusBonus(W, u, f) + taskBias(W, u, f) : 0);   /* v8.7.4 1편의 작전 · 집중 · 임무는 1편만 */")
rep("        if (!W.alarm1){ W.alarm1 = { t: W.t, by: u.i, b: seen[0].i,", "        if (u.side === 1 && !W.alarm1){ W.alarm1 = { t: W.t, by: u.i, b: seen[0].i,")
rep("    const see = canSee(W, u, t) || (u.side === 1 && gap(u, t) < 0.6);", "    const see = canSee(W, u, t) || (u.side >= 1 && gap(u, t) < 0.6);")
rep("    if (!see && u.side === 1 && u.last && Math.hypot(u.x - u.last.x, u.y - u.last.y) < 0.8) u.state = 'search';", "    if (!see && u.side >= 1 && u.last && Math.hypot(u.x - u.last.x, u.y - u.last.y) < 0.8) u.state = 'search';")
rep("  if (u.side === 1){\n    if (u.state === 'hunt') u.state = 'search';", "  if (u.side >= 1){   /* v8.7.4 2편도 찾고 · 돌아가고 · 서성임 */\n    if (u.state === 'hunt') u.state = 'search';")
rep("b = W.units.some(u => u.alive && u.side === 1);", "b = W.units.some(u => u.alive && u.side >= 1);   /* v8.7.4 2편 (각혈) 도 쓰러뜨려야 정리 */")
rep("b = W.units.some(u => up(u) && u.side === 1);", "b = W.units.some(u => up(u) && u.side >= 1);")
rep("  for (const e of W.units) if (e.side === 1){ e.seenBy = W.units.some(a => a.side === 0 && canSee(W, a, e));", "  for (const e of W.units) if (e.side !== 0){ e.seenBy = W.units.some(a => a.side === 0 && canSee(W, a, e));")
rep("  if (u.side === 1){ u.seenBy = W.units.some(a => a.alive && a.side === 0 && canSee(W, a, u)); u.visLog = u.seenBy; u.visPend = null; if (W.camp) W.cleared = false; }",
    "  if (u.side !== 0){ u.seenBy = W.units.some(a => a.alive && a.side === 0 && canSee(W, a, u)); u.visLog = u.seenBy; u.visPend = null; if (W.camp) W.cleared = false; }   /* v8.7.4 2편도 */")
rep("  for (const e of W.units) if (e.side === 1){\n    const s = e.alive", "  for (const e of W.units) if (e.side !== 0){   /* v8.7.4 2편도 (아군이 본 것만 보임) */\n    const s = e.alive")
# 짐작 (intel): 두 편 (0 · 1) 이 저마다 — 2편은 두 편 모두가 봄 · 2편은 따로 짐작을 쌓지 않음
rep("const iRec = (W, S, f) => { const I = (W.intel || (W.intel = [{}, {}]))[S]; return I[f.i] ||",
    "const iRec = (W, S, f) => { const I = (W.intel || (W.intel = [{}, {}]))[S]; if (!I) return { seenT: null, tags: [], dmg: 0, dealt: 0, kills: 0, heals: 0, shouts: 0, shots: 0, guess: guessMax(f) };   /* v8.7.4 2편은 짐작을 쌓지 않음 */\n  return I[f.i] ||")
rep("const iTag = (W, S, f, tag, why) => { const r = iRec(W, S, f);", "const iTag = (W, S, f, tag, why) => { if (S !== 0 && S !== 1) return false; const r = iRec(W, S, f);")
rep("  for (const f of W.units){ if (!f.alive) continue; const S = 1 - f.side;", "  for (const f of W.units){ if (!f.alive) continue; for (const S of f.side > 1 ? [0, 1] : [1 - f.side]){   /* v8.7.4 2편은 두 편 모두가 봄 */")
rep("if (f.torch && !r.tags.includes('횃불')) iTag(W, S, f, '횃불', '불빛'); } }", "if (f.torch && !r.tags.includes('횃불')) iTag(W, S, f, '횃불', '불빛'); } } }")

# ---------- I. 모닝스타 (C2 · 민수 메모 1018: '중거리를 유지하는 인원 — 적을 보자마자 닥돌 아님'): 철퇴를 든 이는 붙은 상대가 치려고 준비 · 거두는 동안 (교전 구속이 없음) 철퇴 거리로 물러섬 ----------
# 손이 빈 상대가 손 닿는 곳이면 그대로 침 (걸어서 빠지면 틈에 맞음 — 사수의 맞붙음과 같은 규칙) · 궁지 · 명령이면 그대로 · 양쪽 같음 (철퇴를 든 누구나)
rep("  if (!ordered && avoidGiant(W, u, t, dt)) return;   // v5.3 거구 앞에 서지 않음",
    "  if (!ordered && flailKeep(W, u, t, dt)) return;   /* v8.7.4 철퇴: 중거리를 지킴 (C2) */\n"
    "  if (!ordered && avoidGiant(W, u, t, dt)) return;   // v5.3 거구 앞에 서지 않음")
rep("// 개 (포위 사냥): 앞의 개가 짖으며 붙잡아 두고,",
    "// v8.7.4 철퇴 (모닝스타 — 중거리를 지키는 인원): 붙은 상대 (close 칸 안) 가 치려고 준비하면 (교전 구속이 없음 · 그 일격은 헛침) mid 칸으로 물러섬\n"
    "// 손이 빈 상대 (걸어서 빠지면 틈에 맞음) · 휘청 · 넘어짐 · 거두는 중 (빈틈) 이면 그대로 침 · 궁지면 그대로\n"
    "function flailKeep(W, u, t, dt){\n"
    "  const FL = flailOf(W, u); if (!FL || isFar(t) || !t.alive || t.down || cornered(W, u)) return false;\n"
    "  const g = gap(u, t); if (g >= (FL.close || 0.9)) return false;\n"
    "  if (!(t.act && t.act.phase === 'wind')) return false;   // 치려고 준비할 때만 — 손이 빈 상대 · 빈틈은 그대로 침\n"
    "  const p = fallbackPt(W, u, t, (FL.mid || 1.6) - g + 0.3); if (!p) return false;\n"
    "  setMood(W, u, '중거리 — 물러섬', t.i); goTo(W, u, p.x, p.y, dt); return true;\n"
    "}\n"
    "// 개 (포위 사냥): 앞의 개가 짖으며 붙잡아 두고,")
rep("flail:{sw:1.3, close:0.9, swingP:0.25,", "flail:{sw:1.3, close:0.9, mid:1.6, swingP:0.25,")
rep("    const a = Math.atan2(u.y - t.y, u.x - t.x) + (u.i % 2 ? 1 : -1) * 0.9, d = t.r + u.r + Math.min(u.rng, 0.3);",
    "    const a = Math.atan2(u.y - t.y, u.x - t.x) + (u.i % 2 ? 1 : -1) * 0.9, d = flailOf(W, u) ? (kiteEng(W, u) && !t.act ? dist(u, t) : t.r + u.r + (flailOf(W, u).mid || 1.6)) : t.r + u.r + Math.min(u.rng, 0.3);   /* v8.7.4 철퇴는 틈을 기다리며 도는 자리도 철퇴 거리 (몸 옆으로 걸어 들어가 붙던 것) · 손이 빈 상대와 붙어 있으면 지금 거리로 돎 (걸어서 빠지면 틈에 맞음) */")


# ---------- J. 길 비켜 주기 (I21): 같은 편 둘이 겹칠 때 — 마주 오면 둘 다 제 오른쪽으로 (오른쪽 통행) · 하나만 가는 중이면 서 있는 쪽이 가는 쪽 길 옆으로 비켜섬 (앞으로 떠밀려 비비지 않음) ----------
rep("    if (pw) tryMove(W, P, P.x - ux * push * pw, P.y - uy * push * pw);\n    if (qw) tryMove(W, Q, Q.x + ux * push * qw, Q.y + uy * push * qw);\n    P.moved = pm; Q.moved = qm;",
    "    if (pw) tryMove(W, P, P.x - ux * push * pw, P.y - uy * push * pw);\n    if (qw) tryMove(W, Q, Q.x + ux * push * qw, Q.y + uy * push * qw);\n"
    "    if (P.side === Q.side && !P.act && !Q.act && !P.kb && !Q.kb) giveWay(W, P, Q, need - d);   /* v8.7.4 길 비켜 주기 (I21) */\n"
    "    P.moved = pm; Q.moved = qm;")
rep("/* ---------- 방향: 앞 · 측면 · 뒤 ---------- */",
    "// v8.7.4 길 비켜 주기 (I21): 가는 쪽 (다음 길목) · 마주 오면 둘 다 제 오른쪽으로 · 하나만 가는 중이면 서 있는 쪽이 그 길 옆으로 (교전 중 · 붙잡힘 · 엎드림은 그대로)\n"
    "const hdOf = u => u.path && u.path[0] && Math.hypot(u.path[0].x - u.x, u.path[0].y - u.y) > 0.05 ? Math.atan2(u.path[0].y - u.y, u.path[0].x - u.x) : null;\n"
    "function giveWay(W, P, Q, ov){\n"
    "  if (P.lie || Q.lie || P.heldBy != null || Q.heldBy != null || P.line || Q.line) return;\n"
    "  const hP = hdOf(P), hQ = hdOf(Q), k = Math.min(0.06, ov * 0.6);\n"
    "  if (hP != null && hQ != null){ if (Math.cos(hP - hQ) < -0.5){ tryMove(W, P, P.x + Math.cos(hP - Math.PI / 2) * k, P.y + Math.sin(hP - Math.PI / 2) * k); tryMove(W, Q, Q.x + Math.cos(hQ - Math.PI / 2) * k, Q.y + Math.sin(hQ - Math.PI / 2) * k); } return; }   // 마주 옴 — 오른쪽 통행\n"
    "  if (hP == null && hQ == null) return;\n"
    "  const M = hP != null ? P : Q, S = M === P ? Q : P, h = M === P ? hP : hQ; if (S.order && S.order.k === 'hold') return;   // 제자리 명령은 그대로\n"
    "  const cr = Math.cos(h) * (S.y - M.y) - Math.sin(h) * (S.x - M.x), sg = cr >= 0 ? 1 : -1, kk = k * 1.5;\n"
    "  tryMove(W, S, S.x + Math.cos(h + sg * Math.PI / 2) * kk, S.y + Math.sin(h + sg * Math.PI / 2) * kk);   // 서 있는 쪽이 길 옆으로\n"
    "}\n"
    "/* ---------- 방향: 앞 · 측면 · 뒤 ---------- */")

# ---------- K. 전열 끝 (I22): 기동 분대 · 측면 기동 · 협공은 멀리 돌지 않고 상대 전열의 가까운 끝을 돌아 들어감 (전선 개념) — 양쪽 같음 ----------
rep("// 망치: 붙들린 상대의 옆 · 뒤로 스스로 돌아 들어감 (명령 없이 — 알아본 만큼만, 틀릴 수 있음)",
    "// v8.7.4 전열 끝 (I22): u 에서 p 로 가는 곧은 길이 상대 전열 (t 편 근접 몸 — 길에서 몸 + 0.9칸 안 · 서로 2.2칸으로 이어진 무리) 을 가로지르면 그 전열의 가까운 끝 (끝 몸 옆 몸 + 1.2칸) 을 거쳐 감 — 아는 몸만\n"
    "function lineEndVia(W, u, t, p){\n"
    "  const F = W.units.filter(f => f.alive && !f.down && !f.lie && f.side === t.side && f !== t && !isFar(f) && (u.side === 0 ? (f.seenBy || canSee(W, u, f)) : (canSee(W, u, f) || fresh(W, u.sense[f.i], 2))));\n"
    "  const dx = p.x - u.x, dy = p.y - u.y, L = Math.hypot(dx, dy); if (L < 1.5 || !F.length) return null;\n"
    "  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux, al = f => (f.x - u.x) * ux + (f.y - u.y) * uy, lt = f => (f.x - u.x) * nx + (f.y - u.y) * ny;\n"
    "  const block = F.filter(f => al(f) > 0.3 && al(f) < L - 0.3 && Math.abs(lt(f)) < f.r + u.r + 0.9); if (!block.length) return null;\n"
    "  const line = new Set(block); for (let grew = true; grew;){ grew = false; for (const f of F) if (!line.has(f) && [...line].some(g => dist(f, g) < 2.2)){ line.add(f); grew = true; } }\n"
    "  let best = null, bs = 1e9;\n"
    "  for (const sg of [1, -1]){ const end = [...line].reduce((a, f) => lt(f) * sg > lt(a) * sg ? f : a), s = lt(end) + sg * (end.r + u.r + 1.2), x = u.x + ux * al(end) + nx * s, y = u.y + uy * al(end) + ny * s;\n"
    "    if (x < 0.8 || y < 0.8 || x > W.map.W - 0.8 || y > W.map.H - 0.8 || boxRock(W, x, y, u.r)) continue;\n"
    "    const c = Math.hypot(x - u.x, y - u.y) + Math.hypot(p.x - x, p.y - y); if (c < bs){ bs = c; best = { x, y }; } }\n"
    "  return best;\n"
    "}\n"
    "// 망치: 붙들린 상대의 옆 · 뒤로 스스로 돌아 들어감 (명령 없이 — 알아본 만큼만, 틀릴 수 있음)")
rep("  const via = arcVia(W, u, t, spot); setMood(W, u, '측면 기동', t.i); goTo(W, u, via.x, via.y, dt);",
    "  const via = lineEndVia(W, u, t, spot) || arcVia(W, u, t, spot); setMood(W, u, '측면 기동', t.i); goTo(W, u, via.x, via.y, dt);   /* v8.7.4 상대 전열이 막으면 그 끝을 돌아 (I22) */")
rep("const spot = approachPt(W, u, t, base, [0, 0.5, -0.5, 0.9, -0.9, 1.4, -1.4]) || { x: t.x, y: t.y }, via = arcVia(W, u, t, spot);",
    "const spot = approachPt(W, u, t, base, [0, 0.5, -0.5, 0.9, -0.9, 1.4, -1.4]) || { x: t.x, y: t.y }, via = lineEndVia(W, u, t, spot) || arcVia(W, u, t, spot);   /* v8.7.4 I22 */")
rep("  setMood(W, u, u.sqStl ? '우회 (조) — 숨어서' : '우회 (조)', q.aim); goTo(W, u, q.wp.x, q.wp.y, dt);",
    "  const qa = W.units[q.aim], qv = qa && qa.alive ? lineEndVia(W, u, qa, q.wp) : null;   /* v8.7.4 상대 전열이 막으면 그 끝을 돌아 (I22) */\n"
    "  setMood(W, u, u.sqStl ? '우회 (조) — 숨어서' : '우회 (조)', q.aim); goTo(W, u, (qv || q.wp).x, (qv || q.wp).y, dt);")
rep("  for (const s of [-1, 1]) for (const k of [1, 0.75, 0.5]){", "  for (const s of [-1, 1]) for (const k of [0.5, 0.75, 1]){   /* v8.7.4 표적 가까이부터 (멀리 돌지 않음 — I22) */")

# ---------- L. 역할 진화 (I25): 미드필더가 방패와 한 손 검 (또는 둔기) 을 함께 들면 전열 쪽으로 (전선) · 방패를 잃으면 본디 역할로 — 양쪽 같음 ----------
rep("function takeItem(W, u, it){",
    "// v8.7.4 역할 진화 (I25 — 청광묵이 방패와 검을 쓰기 시작하면 전열 쪽으로): 본디 미드필더 (role0) 가 방패 (팔 방패 아님) + 한 손 날붙이 · 둔기 (단검 · 창 · 사격 무기 아님) 를 함께 들면 전선 · 아니면 본디 역할\n"
    "function evoRole(W, u){\n"
    "  const base = u.role0 || u.role; if (base !== '미드필더') return; u.role0 = base;\n"
    "  const wp = (W.rules.weapons || {})[u.weaponNow || u.weapon] || {}, arms = !u.weaponGone && !unarmed(u) && !isRangedW(wp) && !u.jav && (wp.rng || 0) >= 0.45 && (wp.kind === '날붙이' || wp.kind === '둔기');\n"
    "  const want = u.shield && !u.armShield && arms ? '전선' : base;\n"
    "  if (want !== u.role){ const was = u.role; u.role = want; L(W, { k: 'roleEvo', a: u.i, from: was, to: want, w: u.weaponNow || u.weapon, vis: u.side === 0 || !!u.seenBy }); }\n"
    "}\n"
    "function takeItem(W, u, it){")
rep("  L(W, { k: 'pickItem', a: u.i, item: it.k, name: it.name, label: it.label || '', own: it.owner === u.i, from: it.owner != null ? it.owner : null, x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy });\n}",
    "  L(W, { k: 'pickItem', a: u.i, item: it.k, name: it.name, label: it.label || '', own: it.owner === u.i, from: it.owner != null ? it.owner : null, x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy });\n  evoRole(W, u);   /* v8.7.4 I25 */\n}")
rep("  if (u.shield){ dropItem(W, u, 'shield', '방패', { dur: u.sDur, label: u.sName || '', own: u.sOwn || ownKey(u) }, how); u.shield = false; } }",
    "  if (u.shield){ dropItem(W, u, 'shield', '방패', { dur: u.sDur, label: u.sName || '', own: u.sOwn || ownKey(u) }, how); u.shield = false; if (u.alive) evoRole(W, u); } }   /* v8.7.4 I25 */")
rep("  if (t.chargeName === '방패 돌진') t.chargeName = '돌진';", "  if (t.chargeName === '방패 돌진') t.chargeName = '돌진';\n  if (t.alive) evoRole(W, t);   /* v8.7.4 I25 방패가 부서지면 본디 역할로 */")
rep("  for (const u of W.units) wpnSpec(W, u);   // v7.22.3", "  for (const u of W.units){ wpnSpec(W, u); evoRole(W, u); }   /* v8.7.4 I25 (들고 온 방패 · 검) */   // v7.22.3")
rep("  const i = W.units.length; unitInit(W, p, i); const u = W.units[i], rules = W.rules; wpnSpec(W, u);", "  const i = W.units.length; unitInit(W, p, i); const u = W.units[i], rules = W.rules; wpnSpec(W, u); evoRole(W, u);   /* v8.7.4 I25 */")

# ---------- M. 사수 자리 (J24 · J25): 같은 까닭 (바위에 가림 · 보이지 않음) 으로 같은 자리에서 두 번 빗나가면 자리를 옮김 (그 둘레는 3초 동안 안 고름) · 도약이 있는 사수는 각 잡기 대신 도약으로 사선 열린 자리로 ----------
rep("      L(W, { k: 'miss', a: u.i, b: t.i, why, man, whiff: stp || null });",
    "      L(W, { k: 'miss', a: u.i, b: t.i, why, man, whiff: stp || null }); if (far && (why === '바위에 가림' || why === '보이지 않음')) missSpot(W, u, t, why);   /* v8.7.4 J24 */")
rep("  if (g > u.rng || !losClear(W.map, u.x, u.y, t.x, t.y)){ reposition(W, u, t, dt, ordered ? '공격' : '자리 잡기'); return; }",
    "  if (!ordered && u.reloc && u.reloc.b === t.i && W.t < u.reloc.until && Math.hypot(u.x - u.reloc.x, u.y - u.reloc.y) < 1.3){ reposition(W, u, t, dt, '각 잡기'); return; }   /* v8.7.4 J24 같은 자리에서 두 번 빗나감 — 옮김 */\n"
    "  if (g > u.rng || !losClear(W.map, u.x, u.y, t.x, t.y)){ reposition(W, u, t, dt, ordered ? '공격' : '자리 잡기'); return; }")
rep("    if (old) cands.push([old.x, old.y, Math.hypot(old.x - u.x, old.y - u.y), true]);",
    "    const RL = u.reloc && u.reloc.b === t.i && W.t < u.reloc.until ? u.reloc : null;   /* v8.7.4 J24 빗나간 자리 둘레는 고르지 않음 */\n"
    "    if (old && !(RL && Math.hypot(old.x - RL.x, old.y - RL.y) < 1.3)) cands.push([old.x, old.y, Math.hypot(old.x - u.x, old.y - u.y), true]);")
rep("      if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r)) continue;\n      const g = Math.hypot(x - t.x, y - t.y) - u.r - t.r;",
    "      if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r)) continue;\n      if (RL && Math.hypot(x - RL.x, y - RL.y) < 1.3) continue;\n      const g = Math.hypot(x - t.x, y - t.y) - u.r - t.r;")
rep("  const p = u.spot.p;\n  if (p && Math.hypot(p.x - u.x, p.y - u.y) > 0.1){\n    setMood(W, u, mood, mb);",
    "  const p = u.spot.p;\n"
    "  if (p && isFar(u) && u.canLeap && W.t >= u.leapCd && !u.crawl && !u.lie && Math.hypot(p.x - u.x, p.y - u.y) >= 0.7 && leapTo(W, u, p.x, p.y, 'side', t, '도약 — 사선 열린 자리로')){ u.spot = null; return; }   /* v8.7.4 J25 도약이 있는 사수는 각 잡기 대신 뜀 */\n"
    "  if (p && Math.hypot(p.x - u.x, p.y - u.y) > 0.1){\n    setMood(W, u, mood, mb);")
rep("function reposition(W, u, t, dt, mood, mb){",
    "// v8.7.4 J24: 같은 표적 · 같은 까닭 · 같은 자리 (1.2칸 안) 로 두 번 빗나가면 그 자리를 떠남 (3초 동안 그 둘레는 고르지 않음)\n"
    "function missSpot(W, u, t, why){\n"
    "  const M = u.mRun && u.mRun.b === t.i && u.mRun.why === why && Math.hypot(u.x - u.mRun.x, u.y - u.mRun.y) < 1.2 ? u.mRun : (u.mRun = { b: t.i, why, x: u.x, y: u.y, n: 0 }); M.n++;\n"
    "  if (M.n >= 2){ u.reloc = { b: t.i, x: M.x, y: M.y, until: W.t + 3 }; u.spot = null; u.mRun = null; L(W, { k: 'reloc', a: u.i, b: t.i, why, vis: u.side === 0 || !!u.seenBy }); }\n"
    "}\n"
    "function reposition(W, u, t, dt, mood, mb){")

# ---------- D. 시험용 내보내기 (node 시험 — 페이지에선 쓰지 않음) ----------
rep("lungeChk, stepOK, mvAim, strafeWant, running };", "lungeChk, stepOK, mvAim, strafeWant, running, h2Cast, resolveH2, h2In, h2Pick, h2Tick, tearDone, tearLet, bigOk, bigWalk, bigSpot, findPath, interrupt, H2K, H2KB, chargeLane, laneOk, laneIn, kiteEng, laneEta, holyOf, authK, marbleHit, crownOn, authOn, flailKeep, giveWay, separate, lineEndVia, evoRole, missSpot, spotFor, reposition, dropShield };   /* v8.7.4 */")

for n, s in P.items():
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8740 OK')
