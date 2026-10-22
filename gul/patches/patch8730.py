# v8.7.3 엔진 — patch8730.py v1.21 (v1.21: 사수 — 지금 표적에 각이 없으면 (사선이 늘 동료에게 막힘) 가까운 다른 표적 (내가 보거나 · 동료가 보거나 알려 준) 의 각을 찾아 옮김 · 4초는 그 표적 (노먼이 맵 6 내내 한 발도 못 쏘던 것) · 자리 찾기를 spotFor 로 떼어 냄 · v1.20: 이어진 휘청 · 넘어짐은 짧아짐 — 풀린 지 0.8초 안에 또 걸리면 ×0.6 · ×0.2 · 그다음은 버팀 (곤봉적이 휘청 → 휘청 → 넘어짐으로 한 번도 못 치고 죽던 것 · 양쪽 같음) · v1.19: 하나뿐인 창은 코앞의 상대에게도 아낌 (끝낼 수 있을 때만) — '투창을 아낌 — 모닝스타가 곁에 있음' 뒤에 그 모닝스타에게 던지던 것 · v1.18: 기습 (×3) 은 그 공격자를 몰랐을 때만 — 10초 안에 보거나 들어 알았으면 묶여 있어도 뒤치기 (×1.5) 만 (교전 중인 호레이쇼에게 '기습 ×3' 이던 것) · v1.17: 밀치기 · 넓게 휘두르기를 미리 비킬 때는 그 일격 밖으로 나갈 수 있는 자리만 — '피함' 0.2초 뒤 같은 휘두르기에 맞던 것 · v1.16: 버팀이 하나로 — 세자르 버팀 (poise · ccRes) 이 돌격 · 튕김 · 팜 버스트에도 걸림 (휘청은 버티고 1.65칸 날아가던 것) · 괴력으로 버티면 휘청 · 넘어짐 없이 '버텨 밀려남' · 괴력 되튕김 막기는 막을 수 있을 때만 ('되튕기지 않고' 뒤에 튕겨 나가던 것) · v1.15: 돌격을 받쳐 준 동료는 날아온 몸을 받아 줌 — 부딪힘 피해 · 넘어짐 · 연쇄 없이 함께 조금 밀림 (기록 caught) — '뒤 동료가 받쳐 줌' 이라 써 놓고 그 동료와 부딪히던 것 · v1.14: 공중제비 내려찍기는 태세면 막힘 · 아니면 맞음 — 태세가 아닌데 무구로 받아 내 (×0.5) 그대로 죽던 '막아도 즉사' · v1.13: 넉백 무게 — 한도도 받는 몸무게로 (가벼운 몸은 더 멀리 · 무거운 몸은 덜) · 던진 도끼는 도끼 무게 · 산탄 · 흙덩이 · 뿌리는 정한 무게 · 날아와 부딪힌 몸은 그 몸 무게 (기록에 am · tag · via · wn · fix) · v1.12: 마지막 순간 추적은 밀려난 만큼만 — 일부러 피하는 상대 (흘려 빠지기 · 스텝 · 도약 · 비킴) 는 쫓지 않음 · v1.11: 맵 시작 채움은 여정 맵 (createWorld opt.camp) 만 · 여정 맵 표시는 만들 때부터 · 20% 아래 미리 채움은 누가 나를 겨누는 중이면 하지 않음 · v1.10: 큰 공격 예고를 보고 비킬 때 이미 휘두르는 기술 (철퇴 한 바퀴 등) 은 끊지 않음 — 한 바퀴 도중 투창 예고에 끊기던 것 · v1.9: 혈영보는 대상 둘레가 막히면 여덟 방향 · 세 거리까지 자리를 찾음 (촘촘히 선 무리에서 '나타날 자리가 없음') · v1.8: 1대1 링에서 플레이어가 직접 움직이는 쪽은 큰 공격 예고에 저절로 비키지 않음 (조작을 빼앗던 것) · v1.7: 0.3초 발견 없음은 여정 맵 (W.camp) 만 — 훈련장 · 엔진 시험은 예전처럼 0초부터 봄 · v1.6: 진형 기록에 그때의 지휘관 (죽은 곤봉적이 '지휘한다' 던 것) · 다 쓰러진 편은 판단하지 않음 · 나간 이는 판단 대상 아님 · 끝난 맵에서 싸움 소리가 커지지 않음 · 전열 이룸 · 흩어짐 기록은 적이 남아 있을 때만 · 자기 치료는 따로 셈 (healedSelf) · 마법은 떨어뜨리지 않음 · 급소 (심장 · 머리) 를 맞히면 상처 · 죽음 글도 그 부위 · v1.5: 시작 0.3초는 서로 발견하지 않음 (양쪽 같음 · 몸이 닿은 것만 · 1대1 링은 그대로) · v1.4: 화살통 · 탄 크기는 설계 (p.ammoMax) — 맵이 끝난 뒤 남은 탄이 다음 맵의 크기가 되어 맵마다 줄던 것 (트라카 60 → 13 · 6 · 5) · 가방에서 채우거나 두 번째 총으로 바꿔 들어도 크기는 그대로 · v1.3: 화살통 · 탄창은 맵 시작 때 가방 탄으로 가득 · 싸움 중 20% 아래면 곁에 적이 없을 때 미리 채움 (꺼내는 양은 빈 만큼) · 탄이 떨어져도 가방에 있으면 '맨손' 이 아님 (기록에 가방 탄 수) · 던진 단검이 떨어질 때 창이 아니라 그 무기 (기록에 kn · w) · 총 · 화살이 목을 꿰뚫음 (throatP — '목이 베임' 은 칼날만) · 받침 글 (을 · 를 · 이 · 가) 숫자까지 · 치유 · 속력 수치는 소수 한 자리 · 나간 이의 [살핌] 없음 · 적이 없는 맵 (끝난 맵 · 오딜의 방) 에선 부르면 닿고 (멀면 늦게) 자리도 앎 — '명령이 닿지 않음 · 소식 끊김' 없음 · 기록의 상황 스냅샷에서 방 구경 · 합류 이동은 '자동' · 끝난 맵에서 기준이 둘러보는 건 숨은 출구를 아직 못 찾았을 때만 (1층처럼 출구가 보이는 맵은 그 자리에서 기다림) · 근접 명중 식 가운데 주석이 뒤를 잘라 싸움 첫 1초 명중률이 시각 (0.4초 = 40%) 이 되고 어둠 속 0.96 이 빠지던 것 바로잡음 · 고립 판단에서 나를 따르는 편대원은 곁의 동료로 치지 않음 · v1.2: 바로잡기 3 — [무장기] 장기가 없는 몸 (급소 · 꿰뚫어 즉사 · 머리 직격 즉사 · 출혈 · 내출혈 · 실명 · 장기 상처 없음 — 팔다리는 다침) · 벽 짓눌림은 밀린 힘만큼 (살짝 밀리면 기대 버팀 — 보통 타격이 벽에 87 을 내던 것) · 회전 투척 도끼는 근접 일격처럼 · 넓게 · 뒤로 갈수록 약하게 · 큰 공격 예고 (도끼 던지기 · 투창 조준 · 넓게 휘두르기 · 도약 강타) 를 보면 하던 짓을 끊고 비킴 ('!' — 적 · 아군 같게) · 근접은 준비 끝 0.15초 전까지 0.6칸 따라감 · 후리기는 원 밖으로 밀려난 적에게 0.4M 늘림 · 샷건 산탄 부채꼴 (여러 몸 · 가까울수록 많이) · 바꿔 들기는 1초 머문 적에게만 · 투창 → 찌르기 바뀜을 알림 · 창을 던진 적은 5초 숨다가 창을 주우러 감 · 배 안 출혈뿐인 성한 동료에게 약을 버리지 않음 · 철퇴는 2열 찌르기에서 뺌 · v1.1: 바로잡기 2 — 다시 쥔 근접 무기가 사수로 바뀌던 것 (리치를 더한 길이로 장창 판정 · 맨손도) · 공중제비 내려찍기는 태세 (방패 · 무구를 들고 마주 봄) 에 막힘 — 막히면 짧게 휘청 · 오는 걸 보면 돌진처럼 태세 · 철퇴 던지기는 던지는 순간 사선을 다시 봄 (넓게) · 도약 사격도 사선을 봄 · 자동 점사는 동료가 사선 곁이면 멈춤 (더 엄격) · 트라카 곡사는 같은 표적이면 직사 각을 다시 찾지 않고 같은 짧은 주기로 · 철퇴 후리기 준비 중엔 원 안의 동료가 '!' 하고 비켜섬 · 단추를 한 번 더 = 그만둠 · 고유 기술 대기 초 · v1.0: patch8720.py 를 먼저 돌린 뒤 — 바로잡기 1: 우리 편의 기준 = 주인공, 없으면 지휘관 (따라감 · 탐험 · 출구로 따라 나감 · 낙오자 합류) · 끝난 맵의 옛 지킴 자리 풂 · 싸움이 붙은 지킴이는 그 자리를 새 자리로 · 지휘관이 먼저 나가면 끊김 없이 이어받음 (나감 ≠ 쓰러짐 — 전열 · 지휘 · 적의 판단 · 집결) · 명령 줄 (가는 명령은 모두 도착 · 같은 명령은 한 번 · 나중 명령이 먼저 닿으면 옛것은 버림 · 바로 걸린 명령은 옛 줄을 지움) · 출구는 발견해야 앎 (발견 전 출구 명령 = 찾으러) · 대장은 마지막에 나감 · 출구 두 번 = 서둘러 · 고유 기술 명령 글 (제자리 → 기술 이름) · 막힌 공중제비 알림)
import subprocess, json, os, shutil, re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8720.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- A. 실제로 본 칸 (found) · 출구 발견 ----------
rep("explored: new Uint8Array(map.W * map.H), spare: rules.spareTorches,",
    "explored: new Uint8Array(map.W * map.H), found: new Uint8Array(map.W * map.H), spare: rules.spareTorches,")
rep("""  const m = W.map, al = W.units.filter(u => u.alive && u.side === 0);
  if (m.indoor){ markIndoor(W, al); return; }   /* v7.23 실내는 벽을 봄 */
  for (let i = 0; i < m.W * m.H; i++){
    if (W.explored[i] === 2) continue;""",
"""  const m = W.map, al = W.units.filter(u => u.alive && u.side === 0);
  if (!W.found || W.found.length !== m.W * m.H) W.found = new Uint8Array(m.W * m.H);   /* v8.7.3 실제로 본 칸 (다 그려진 지도라도) — 탐험 · 출구 발견은 이것으로 */
  if (m.indoor){ markIndoor(W, al); exitSeenTick(W); return; }   /* v7.23 실내는 벽을 봄 */
  for (let i = 0; i < m.W * m.H; i++){
    if (W.explored[i] === 2 && W.found[i]) continue;""")
rep("""      if (W.light[i] > LIT){ W.explored[i] = 2; break; }
      if (a.nv && d <= (a.nvG === 'D' ? W.rules.nvD || 2.5 : a.nvG === 'C' ? W.rules.nvC || 3.75 : a.nvG === 'B' ? W.rules.nvB || 5 : W.rules.sight)){ W.explored[i] = Math.max(W.explored[i], 1); } }
  }
}""",
"""      if (W.light[i] > LIT){ W.explored[i] = 2; W.found[i] = 1; break; }
      if (a.nv && d <= (a.nvG === 'D' ? W.rules.nvD || 2.5 : a.nvG === 'C' ? W.rules.nvC || 3.75 : a.nvG === 'B' ? W.rules.nvB || 5 : W.rules.sight)){ W.explored[i] = Math.max(W.explored[i], 1); W.found[i] = 1; }
      if (d <= 1.5) W.found[i] = 1; }
  }
  exitSeenTick(W);
}""")
rep("""      V[i] = 1; if (W.explored[i] === 2) continue;""",
    """      V[i] = 1; if (W.light[i] > LIT || d <= nvR || d <= 1.5) W.found[i] = 1; if (W.explored[i] === 2) continue;""")
rep("""/* ---------- 움직임 ---------- */
const dist = (a, b) =>""",
"""// v8.7.3 출구 발견: 출구 칸을 우리 편 누군가 실제로 보면 (found) 그때부터 출구를 앎 — 표시 · 출구 명령은 그 뒤에야 곧장 감 (그 전엔 찾으러)
function exitSeenTick(W){
  const S0 = W.stairs; if (!S0 || W.exitSeen || !W.found) return; const m = W.map, cx = Math.max(0, Math.min(m.W - 1, S0.x | 0)), cy = Math.max(0, Math.min(m.H - 1, S0.y | 0));
  let ok = W.exitForce || W.found[cy * m.W + cx]; if (!ok) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const x = cx + dx, y = cy + dy; if (x >= 0 && y >= 0 && x < m.W && y < m.H && W.found[y * m.W + x] && m.t[cy * m.W + cx] !== 0){ ok = 1; break; } }   // 출구 칸이 벽 그림 위면 그 앞 칸
  if (!ok) return; W.exitSeen = true; W.exitSeenT = W.t;
  const by = W.units.filter(a => a.alive && a.side === 0 && !a.gone && !a.summon).sort((a, b) => dist(a, S0) - dist(b, S0))[0];
  L(W, { k: 'exitFound', a: by ? by.i : null, x: +S0.x.toFixed(1), y: +S0.y.toFixed(1), lock: !!(W.exitLock && !W.cleared), vis: true });
  if (W.fxOn) W.fx.push({ k: 'num', x: S0.x, y: S0.y, s: W.exitLock && !W.cleared ? '출구! (잠김)' : '출구!', c: 'h', t0: W.t });
}

/* ---------- 움직임 ---------- */
const dist = (a, b) =>""")

# ---------- B. 우리 편의 기준 (주인공 → 지휘관 → 남은 이) ----------
rep("""// v6.8 지휘가 끊기면 (지휘관이 쓰러짐) 2.5초 동안 각자 싸우다가""",
"""// v8.7.3 우리 편의 기준: 따라감 · 탐험 · 출구로 따라 나감 · 낙오자 합류 · 나간 대장 따라가기 — 주인공이 있으면 주인공, 없으면 지휘관 (임시 지휘 포함), 그도 없으면 남은 이 가운데 하나
function ancOf(W){
  if (W.ancT === W.t) return W.anc;
  const ok = a => a && a.alive && a.side === 0 && !a.gone && !a.summon;
  let h = W.units.find(a => a.hero && ok(a)) || null;
  if (!h){ const c = cmdBoss(W, 0); if (ok(c) && !c.down && !c.crawl) h = c; }
  if (!h) h = W.units.find(a => ok(a) && !a.down && !a.crawl) || null;
  W.ancT = W.t; W.anc = h; return h;
}
const isAnc = (W, u) => u.side === 0 && ancOf(W) === u;
// v8.7.3 지휘관이 맵을 떠나면 (먼저 올라감) 남은 이 가운데 가장 노련한 이가 바로 이어받음 — 쓰러진 게 아니니 끊김 (2.5초 각자 싸움) 이 없음
function cmdHand(W, u){
  if (!(u.cmd > 0) || !W.hadCmd || !W.hadCmd[u.side] || AI6.includes('acting')) return;
  if (W.units.some(a => a.alive && !a.crawl && a.side === u.side && a.cmd > 0)) return;
  const mine = W.units.filter(a => a.alive && !a.crawl && !a.down && a.side === u.side && !a.summon && !a.gone); if (!mine.length) return;
  const c = mine.sort((a, b) => (b.vet ? 1 : 0) - (a.vet ? 1 : 0) || b.tier - a.tier || b.hp - a.hp)[0];
  c.cmd = 1; c.cmdTmp = true; const A = W.acting || (W.acting = [{}, {}]), st = A[u.side]; st.lossT = null; st.n = (st.n || 0) + 1;
  if (u.side === 0) W.bossI = c.i;   // 이어받음 줄은 아래 하나로 (지휘 계승 줄과 겹치지 않게)
  L(W, { k: 'acting', side: u.side, a: c.i, n: st.n, left: u.i, vis: u.side === 0 || !!c.seenBy });
}
// v6.8 지휘가 끊기면 (지휘관이 쓰러짐) 2.5초 동안 각자 싸우다가""")
# 혼자 남은 이의 합류: 주인공 대신 기준
rep("  const hero = W.units.find(h => h.hero && h.alive && h.side === 0), anc = hero && hero !== u ? hero : nb, an = Math.atan2(u.y - anc.y, u.x - anc.x);",
    "  const A0 = ancOf(W), anc = A0 && A0 !== u ? A0 : nb, an = Math.atan2(u.y - anc.y, u.x - anc.x);   /* v8.7.3 기준 (주인공 · 지휘관) */")
# 적이 없을 때: 끝난 맵의 옛 지킴 자리는 풂 · 기준을 따라감 (기준은 둘러봄)
rep("  if (!foes.length){ stop(u); if (u.side === 0 && !u.order && !u.hero && !u.down && !u.crawl) isoRejoin(W, u); return; }   /* v7.26.1 적이 없어도 혼자 남으면 합류 */",
    "  if (!foes.length){ stop(u); if (u.side === 0 && !u.order && !u.down && !u.crawl){ const A = ancOf(W);   /* v8.7.3 */\n"
    "      if (u.stay && u.stay.old){ u.stay = null; }   // 싸울 때 잡은 자리는 끝난 맵에선 풂 (끝난 뒤에 보낸 자리는 지킴)\n"
    "      u.target = null; u.state = u.stay ? 'stay' : !A || A === u ? 'explore' : 'follow';\n"
    "      if (A !== u) isoRejoin(W, u); } return; }   /* v7.26.1 적이 없어도 혼자 남으면 합류 */")
rep("  const hero = W.units.find(h => h.hero && h.alive);\n  // 횃불은 멀리서도 보임",
    "  const hero = u.side === 0 ? ancOf(W) : W.units.find(h => h.hero && h.alive), me = !!hero && hero === u;   /* v8.7.3 기준 (주인공 · 지휘관) */\n  // 횃불은 멀리서도 보임")
rep("  if (u.stay && !u.hero && !u.crawl && !u.down){   // v7.9.5",
    "  if (u.stay && !me && !u.crawl && !u.down){   // v7.9.5")
rep("dH = hero && !u.hero ? dist(hero, u) : nearest;", "dH = hero && !me ? dist(hero, u) : nearest;")
rep("u.stay = null; u.farT = 0; u.aloneT = 0; u.state = hero ? 'follow' : 'explore'; setMood(W, u, '합류');",
    "u.stay = null; u.farT = 0; u.aloneT = 0; u.state = hero && !me ? 'follow' : 'explore'; setMood(W, u, '합류');")
rep("  const lead = leadOf(W, u) || hero, anchor = u.stay || (lead && !u.hero ? lead : u); let lim = u.stay ? R.stayLeash || 4 : R.leash;",
    "  const lead = leadOf(W, u) || hero, anchor = u.stay || (lead && lead !== u ? lead : u); let lim = u.stay ? R.stayLeash || 4 : R.leash;")
rep("  const seen = foes.filter(f => canSee(W, u, f) && ((u.hero && !u.stay) || dist(f, anchor) <= lim)).sort((a, b) => dist(u, a) - dist(u, b));",
    "  const near0 = Math.max(2.5, isFar(u) ? 0 : u.rng + 1);   /* v8.7.3 지킴이도 몸에 붙은 적은 봄 */\n"
    "  const seen = foes.filter(f => canSee(W, u, f) && ((me && !u.stay) || dist(f, anchor) <= lim || (u.stay && dist(f, u) <= near0))).sort((a, b) => dist(u, a) - dist(u, b));\n"
    "  if (u.stay && seen.some(f => dist(f, u) <= near0) && Math.hypot(u.x - u.stay.x, u.y - u.stay.y) > 2.5) u.stay = { x: u.x, y: u.y };   /* v8.7.3 싸움이 붙은 곳이 새 자리 (싸우다 옛 자리로 물러나 동료를 두고 가던 것) */")
rep("u.target = null; u.state = u.stay ? 'stay' : u.hero || !hero ? 'explore' : 'follow'; return; }",
    "u.target = null; u.state = u.stay ? 'stay' : me || !hero ? 'explore' : 'follow'; return; }")
rep("W.t - s.t < 1 && ((u.hero && !u.stay) || Math.hypot(s.x - anchor.x, s.y - anchor.y) <= lim)",
    "W.t - s.t < 1 && ((me && !u.stay) || Math.hypot(s.x - anchor.x, s.y - anchor.y) <= lim)")
rep("  u.state = u.stay ? 'stay' : u.hero || !hero ? 'explore' : 'follow';   // 주인공이 쓰러지면 남은 동료가 직접 찾아 나섬",
    "  u.state = u.stay ? 'stay' : me || !hero ? 'explore' : 'follow';   // 주인공이 쓰러지면 지휘관 (v8.7.3) 이 기준")
rep("      const hero0 = W.units.find(h => h.hero && h.alive), mates0 = W.units.filter(a => a.alive && !a.down && a.side === 0 && a !== u), tet = (W.rules.roe || {}).chase || 6.5;",
    "      const hero0 = ancOf(W), mates0 = W.units.filter(a => a.alive && !a.down && a.side === 0 && a !== u), tet = (W.rules.roe || {}).chase || 6.5;   /* v8.7.3 기준 */")
rep("u.stay ? dist(u, u.stay) : 1e9, hero0 && !u.hero ? dist(u, hero0) : 1e9]",
    "u.stay ? dist(u, u.stay) : 1e9, hero0 && hero0 !== u ? dist(u, hero0) : 1e9]")
# 걸음 (act): 따라감 · 탐험의 기준
rep("  if (!u.order && scavenge(W, u, dt)) return;   // v5.6 무기가 없으면 안전할 때 주움\n  const hero = W.units.find(h => h.hero && h.alive);",
    "  if (!u.order && scavenge(W, u, dt)) return;   // v5.6 무기가 없으면 안전할 때 주움\n  const hero = ancOf(W);   /* v8.7.3 기준 (주인공 · 지휘관) */")
rep("  const HL = leadOf(W, u) || hero;   // v7.10 편대원은 부대장을 따라감",
    "  const HL = leadOf(W, u) || (hero !== u ? hero : null);   // v7.10 편대원은 부대장을 따라감")
rep("  if (u.state === 'explore' && (u.hero || !hero)){", "  if (u.state === 'explore' && (hero === u || !hero)){")
rep("      if (!u.hero || !W.units.some(a => a.alive && a.side === 0 && !a.hero && !a.order && dist(a, u) > 4.5)) follow(W, u, dt);",
    "      if (hero !== u || !W.units.some(a => a.alive && a.side === 0 && a !== u && !a.summon && !a.order && dist(a, u) > 4.5)) follow(W, u, dt);")
rep("      const f = u.hero ? frontier(W, u) || (qt ? null : nearestFoe(W, u)) : (qt ? null : nearestFoe(W, u));",
    "      const f = hero === u ? (W.cleared && (!W.exitHide || W.exitSeen) ? null : frontier(W, u)) || (qt ? null : nearestFoe(W, u)) : (qt ? null : nearestFoe(W, u));   /* v8.7.3 끝난 맵: 출구를 알면 (처음부터 보이는 출구 포함) 더 둘러보지 않음 — 숨은 출구를 못 찾았을 때만 둘러봄 */")
rep("    let lag = u.hero && W.units.some(a => a.alive && a.side === 0 && !a.hero && !a.order && dist(a, u) > 4.5);",
    "    let lag = hero === u && W.units.some(a => a.alive && a.side === 0 && a !== u && !a.summon && !a.down && !a.crawl && !a.order && dist(a, u) > 4.5);")
# 안 가 본 곳: 실제로 본 칸 (found) 기준 — 횃불을 든 이는 아직 밝혀지지 않은 칸도
rep("""  const m = W.map, Wd = m.W, s = (u.y | 0) * Wd + (u.x | 0), seen = new Uint8Array(m.W * m.H), q = [s], dd = new Int32Array(m.W * m.H); seen[s] = 1;
  for (let h = 0; h < q.length; h++){
    const p = q[h], x = p % Wd, y = (p / Wd) | 0;
    if (dd[p] >= 3 && W.explored[p] !== 2) return { x: x + 0.5, y: y + 0.5 };""",
"""  const m = W.map, Wd = m.W, s = (u.y | 0) * Wd + (u.x | 0), seen = new Uint8Array(m.W * m.H), q = [s], dd = new Int32Array(m.W * m.H); seen[s] = 1;
  const F = W.found || W.explored, tch = u.torch && !u.torchOff, unk = p => !F[p] || (tch && W.explored[p] !== 2);   /* v8.7.3 다 그려진 지도라도 실제로 본 적 없는 곳 */
  for (let h = 0; h < q.length; h++){
    const p = q[h], x = p % Wd, y = (p / Wd) | 0;
    if (dd[p] >= 3 && unk(p)) return { x: x + 0.5, y: y + 0.5 };""")
# 끝난 맵: 그때까지 잡은 지킴 자리는 '옛 자리'
rep("    if (!b && !W.cleared && !W.holdClear){ W.cleared = true; L(W, { k: 'cleared', vis: true }); }",
    "    if (!b && !W.cleared && !W.holdClear){ W.cleared = true; W.clearT = W.t; for (const s of W.units) if (s.side === 0 && s.stay) s.stay.old = true; L(W, { k: 'cleared', vis: true }); }   /* v8.7.3 */")

# ---------- C. 출구: 찾기 · 서둘러 · 대장은 마지막 · 나감 ≠ 쓰러짐 ----------
rep("  if (!dn && W.stairs && W.exitLock && !W.cleared){ const S0 = W.stairs;",
    "  if (!dn && W.stairs && W.exitHide && !W.exitSeen){ exitSearch(W, u, o, dt); return; }   /* v8.7.3 아직 못 찾은 출구 — 찾으러 */\n"
    "  if (!dn && W.stairs && W.exitLock && !W.cleared){ const S0 = W.stairs;")
rep("  if (!dn && W.stairs){ const S0 = W.stairs; if (Math.hypot(S0.x - u.x, S0.y - u.y) <= (S0.r || 0.9)){ leaveMap(W, u, 'up'); return; } setMood(W, u, '계단으로'); goTo(W, u, S0.x, S0.y, dt); return; }",
    "  if (!dn && W.stairs){ const S0 = W.stairs, d0 = Math.hypot(S0.x - u.x, S0.y - u.y);\n"
    "    if (d0 <= 2.2 && exitWait(W, u)){ stop(u); u.fg = Math.atan2(u.y - S0.y, u.x - S0.x); setMood(W, u, '출구 앞 — 동료를 기다림'); return; }   /* v8.7.3 대장은 마지막에 나감 */\n"
    "    if (d0 <= (S0.r || 0.9)){ leaveMap(W, u, 'up'); return; } setMood(W, u, o.hurry ? '출구로 — 서둘러' : '계단으로'); goTo(W, u, S0.x, S0.y, dt); return; }")
rep("function leaveMap(W, u, dir){\n  u.gone = dir; u.alive = false; u.order = null; u.ordPend = null;",
"""// v8.7.3 출구를 아직 못 찾음: 대장 (출구 명령을 받았으면) 을 중심으로 안 가 본 곳으로 함께 — 누가 출구를 보면 그때부터 곧장
function exitSearch(W, u, o, dt){
  const A = ancOf(W), lead = A && A !== u && A.order && A.order.k === 'exit' && !A.down ? A : null;
  let Q = W.exitQ; const m = W.map;
  if (!Q || (W.found && W.found[(Q.y | 0) * m.W + (Q.x | 0)]) || W.t - Q.t > 10 || (Q.by !== (lead || u).i && !lead && Math.hypot(Q.x - u.x, Q.y - u.y) > 16)){ const f = frontier(W, lead || u); Q = W.exitQ = f ? { x: f.x, y: f.y, t: W.t, by: (lead || u).i } : null; }
  if (!u.exQlog){ u.exQlog = true; if (isAnc(W, u) || !lead) L(W, { k: 'exitSearch', a: u.i, vis: true }); }
  setMood(W, u, o.hurry ? '출구 찾기 — 서둘러' : '출구 찾기');
  if (!Q){ if (!W.exitSeen){ W.exitForce = true; exitSeenTick(W); } stop(u); return; }   // 다 뒤졌는데 못 봄 (그림 속 벽 출구) — 거기 있음을 앎
  if (lead && dist(u, lead) > 2.6){ goTo(W, u, lead.x, lead.y, dt); return; }   // 대장 곁을 지키며 함께 뒤짐
  goTo(W, u, Q.x, Q.y, dt);
}
// v8.7.3 대장은 마지막에 나감: 출구 명령을 받고 오는 동료가 있으면 출구 곁에서 기다림 (최대 10초 — 남은 이는 대장이 나갈 때 따라 나섬)
function exitWait(W, u){
  if (!isAnc(W, u) || W.over) return false;
  const rest = W.units.filter(a => a !== u && a.alive && a.side === 0 && !a.gone && !a.summon && !a.down && !a.crawl && a.order && a.order.k === 'exit' && a.order.dir !== 'down');
  if (!rest.length){ u.exWaitT0 = null; return false; }
  if (u.exWaitT0 == null){ u.exWaitT0 = W.t; L(W, { k: 'exitWait', a: u.i, n: rest.map(a => a.i), vis: true }); }
  return W.t - u.exWaitT0 < 10;
}
function leaveMap(W, u, dir){
  const wasAnc = u.side === 0 && ancOf(W) === u;   /* v8.7.3 */
  u.gone = dir; u.alive = false; u.order = null; u.ordPend = null; u.ordQ = null;""")
rep("  L(W, { k: 'leave', a: u.i, dir, vis: true }); W.lightT = 0;\n  if (W.camp && u.hero && u.side === 0 && ((W.rules.camp || {}).follow !== false)){",
    "  L(W, { k: 'leave', a: u.i, dir, vis: true }); W.lightT = 0; W.ancT = null;\n"
    "  cmdHand(W, u);   /* v8.7.3 지휘관이 먼저 나가면 바로 이어받음 */\n"
    "  if (wasAnc) W.ancLeft = { i: u.i, dir, t: W.t };\n"
    "  if (W.camp && (u.hero || wasAnc) && u.side === 0 && ((W.rules.camp || {}).follow !== false)){   /* v8.7.3 주인공이 없으면 대장 (지휘관) */")
rep("    for (const a of F){ a.order = { k: 'exit', dir, x: a.x, follow: true }; a.ordLive = a.order; a.ordPend = null; a.stay = null; }",
    "    for (const a of F){ a.order = { k: 'exit', dir, x: a.x, follow: true }; a.ordLive = a.order; a.ordPend = null; a.ordQ = null; a.ordT0 = W.t; a.stay = null; }")
# 서둘러 (출구 두 번): 뜀 · 방패를 내림
rep("const running = (W, u) => (u.mv && u.mv.run && W.t < u.mv.until) || (u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove'));",
    "const running = (W, u) => (u.mv && u.mv.run && W.t < u.mv.until) || (u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'exit'));   /* v8.7.3 출구 서둘러 */")
rep("  let hurry = u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack') &&",
    "  let hurry = u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack' || u.order.k === 'exit') &&")
rep("((u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack')) || (u.mv && u.mv.run && W.t < u.mv.until) || (u.flee && W.t < u.flee.until)",
    "((u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack' || u.order.k === 'exit')) || (u.mv && u.mv.run && W.t < u.mv.until) || (u.flee && W.t < u.flee.until)")
# 나감 ≠ 쓰러짐: 전열 · 지휘 계승 · 다시 닿음 · 적의 표적 · 집결
rep("    const u = W.units[i]; if (u.line) continue;\n    const fell = !u.alive || prone(W, u) || u.crawl || u.kb;",
    "    const u = W.units[i]; if (u.line) continue;\n    if (u.gone){ u.lineOutT = W.t; continue; }   /* v8.7.3 맵을 나간 이는 전열이 끊긴 게 아님 */\n    const fell = !u.alive || prone(W, u) || u.crawl || u.kb;")
rep("  if (C && W.bossI != null && W.bossI !== C.i){ L(W, { k: 'succeed', a: C.i, from: W.bossI, deputy: C.rank === '부대장', vis: true }); } if (C) W.bossI = C.i;",
    "  if (C && W.bossI != null && W.bossI !== C.i){ const B0 = W.units[W.bossI]; L(W, { k: 'succeed', a: C.i, from: W.bossI, deputy: C.rank === '부대장', left: B0 && B0.gone && B0.gone !== 'left' ? 1 : null, vis: true }); } if (C) W.bossI = C.i;   /* v8.7.3 먼저 올라간 지휘관 */")
rep("    if (p >= 0.4){ if (u.offFrom != null && W.t - u.offFrom >= (H.offT || 6)) L(W, { k: 'netBack',",
    "    if (p >= 0.4){ if (u !== C && u.offFrom != null && W.t - u.offFrom >= (H.offT || 6)) L(W, { k: 'netBack',")   # v8.7.3 스스로 지휘를 이어받은 이는 '다시 닿음' 이 아님
rep("  if (W.focus && !W.focus.down && (!W.units[W.focus.b].alive || W.units[W.focus.b].down)){ W.focus.down = true; L(W, { k: 'focusDown', side: 1, b: W.focus.b, by: (cmdBoss(W, 1) || {}).i, vis: true }); }",
    "  if (W.focus && !W.focus.down && (!W.units[W.focus.b].alive || W.units[W.focus.b].down)){ W.focus.down = true; if (!W.units[W.focus.b].gone) L(W, { k: 'focusDown', side: 1, b: W.focus.b, by: (cmdBoss(W, 1) || {}).i, vis: true }); }   /* v8.7.3 나간 이는 쓰러뜨린 게 아님 */")
rep("  const fallen = new Set(W.units.filter(u => u.side === 0 && (!u.alive || u.down)).map(u => u.i)), prev = W.fallenSet || new Set();",
    "  const fallen = new Set(W.units.filter(u => u.side === 0 && ((!u.alive && !u.gone) || u.down)).map(u => u.i)), prev = W.fallenSet || new Set();   /* v8.7.3 나감은 잃음이 아님 */")
rep("const b0 = W.units[W.boss0]; if (b0 && !b0.alive && W.bossLostT == null) W.bossLostT = W.t;",
    "const b0 = W.units[W.boss0]; if (b0 && !b0.alive && !b0.gone && W.bossLostT == null) W.bossLostT = W.t;")
rep("  const dead = W.units.filter(u => u.side === 1 && !u.alive).length; if (dead >= 2 && ratio < 1.2)",
    "  const dead = W.units.filter(u => u.side === 1 && !u.alive && !u.gone).length; if (dead >= 2 && ratio < 1.2)")

# ---------- D. 명령 줄 ----------
rep("""// 아군 명령 전달: 유저가 준 명령 (ordPend) 은 닿는 때 받음 — 못 받으면 하던 대로. 0초 (싸움 전 작전 회의) 는 바로
function cmdTick(W){
  postureTick(W);   // v7.9 태세가 닿음
  for (const u of W.units){ if (u.side !== 0) continue; const P = u.ordPend; if (!P || W.t < P.at) continue; u.ordPend = null; if (!u.alive) continue;
    if (P.ok){ u.order = P.o; u.ordLive = P.o;""",
"""// v8.7.3 명령 줄: 가는 중인 명령은 모두 도착 (먼저 닿는 것부터 · 한 틱에 하나 — 무기 바꾸기 같은 짧은 일이 다음 명령에 지워지지 않게) · 같은 명령은 한 번 (두 번 외치면 닿을 확률만 오름) · 나중에 낸 명령이 먼저 닿았으면 옛것은 버림 · 바로 걸린 명령 (끝난 맵 · 스스로) 은 옛 줄을 지움
const ordSig = (o, u) => JSON.stringify(orderTxt(o, u)) + (o && o.hurry ? 'h' : '') + (o && o.now ? 'n' : '') + (o && o.via ? 'd' : '');
function ordPush(W, u, P){
  const Q = u.ordQ || (u.ordQ = []); if (u.ordPend && !Q.includes(u.ordPend)) Q.push(u.ordPend);
  const k = ordSig(P.o, u), last = Q.length ? Q.reduce((a, b) => b.t0 >= a.t0 ? b : a) : null;
  if (last && ordSig(last.o, u) === k){ last.ok = last.ok || P.ok; last.p = Math.max(last.p || 0, P.p || 0); u.ordPend = last; return last; }   // 가장 최근에 낸 것과 같으면 한 번 (두 번 외치면 닿을 확률만)
  if (!Q.length && ordSig(u.order, u) === k){ u.ordQ = null; return null; }   // 지금 하고 있는 그 명령
  Q.push(P); u.ordPend = P; return P;
}
// 아군 명령 전달: 유저가 준 명령 (ordPend) 은 닿는 때 받음 — 못 받으면 하던 대로. 0초 (싸움 전 작전 회의) 는 바로
function cmdTick(W){
  postureTick(W);   // v7.9 태세가 닿음
  for (const u of W.units){ if (u.side !== 0) continue;
    if (u.ordPend && !(u.ordQ || []).includes(u.ordPend)) (u.ordQ = u.ordQ || []).push(u.ordPend);   // 줄 밖에서 넣은 한 칸도
    const Q = u.ordQ; if (!Q || !Q.length){ u.ordQ = null; continue; }
    if (!u.alive){ u.ordQ = null; u.ordPend = null; continue; }
    const due = Q.filter(q => W.t >= q.at).sort((a, b) => a.at - b.at || a.t0 - b.t0); if (!due.length) continue;
    let P = null; for (const q of due){ Q.splice(Q.indexOf(q), 1); if (u.ordT0 != null && q.t0 < u.ordT0) continue; P = q; break; }
    u.ordPend = Q.length ? Q.reduce((a, b) => b.t0 >= a.t0 ? b : a) : null; if (!Q.length) u.ordQ = null;
    if (!P) continue;
    if (P.ok){ u.ordT0 = P.t0; u.order = P.o; u.ordLive = P.o;""")
rep("rc.forEach((m, k) => { const lk = wv[k]; m.ordPend = { o: { k: 'attack', b: f.i, dep: D.i }, m2: lk.m2, at: W.t + lk.t, ok: lk.ok, hop: lk.hop, p: lk.p, via: lk.via, why: lk.why, c: D.i, m: lk.m, t0: W.t, legs: !!lk.legs };",
    "rc.forEach((m, k) => { const lk = wv[k]; ordPush(W, m, { o: { k: 'attack', b: f.i, dep: D.i }, m2: lk.m2, at: W.t + lk.t, ok: lk.ok, hop: lk.hop, p: lk.p, via: lk.via, why: lk.why, c: D.i, m: lk.m, t0: W.t, legs: !!lk.legs });   /* v8.7.3 명령 줄 */")
rep("!(m.ordPend && !(m.ordPend.o && m.ordPend.o.dep)) && !(m.koT && W.t < m.koT));",
    "!(m.ordPend && !(m.ordPend.o && m.ordPend.o.dep)) && !(m.ordQ || []).some(q => !(q.o && q.o.dep)) && !(m.koT && W.t < m.koT));")

# ---------- E. 고유 기술 명령 글 · 막힌 공중제비 ----------
rep("const SPEC_K = { '혈영보': 'blink',", "const SPEC_NM = k => (Object.entries(SPEC_K).find(e => e[1] === k) || [k])[0];   /* v8.7.3 기술 이름 (명령 글) */\nconst SPEC_K = { '혈영보': 'blink',")
rep("const orderTxt = (o, u) => o && o.k === 'alt' ? ['alt'] : o && o.k === 'exit' ? ['exit', o.dir] :",
    "const orderTxt = (o, u) => o && o.k === 'alt' ? ['alt'] : o && o.k === 'exit' ? ['exit', o.dir, o.hurry ? 1 : 0] : o && o.k === 'specCancel' ? ['specCancel', o.s || null] : o && o.k === 'spec' ? ['spec', o.s, o.b != null ? o.b : null, o.x != null ? +o.x.toFixed(2) : null, o.y != null ? +o.y.toFixed(2) : null, o.R != null ? +(+o.R).toFixed(2) : null] :")
rep("    if (o.s === 'flip' && o.x != null){ if (specReady(W, u, 'flip')){ startFlip(W, u, null, true, o.x, o.y); u.order = null; } else setMood(W, u, '공중제비 대기'); return; }",
    "    if (o.s === 'flip' && o.x != null){ if (specReady(W, u, 'flip')){ if (!startFlip(W, u, null, true, o.x, o.y)){ L(W, { k: 'specFail', a: u.i, s: 'flip', why: '내려앉을 자리가 막힘', vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y - 0.35, s: '막힘 — 못 뜀', c: 'm', t0: W.t }); } u.order = null; } else setMood(W, u, '공중제비 대기 (' + Math.max(0, specOf(u, 'flip').cdT - W.t).toFixed(1) + '초)'); return; }   /* v8.7.3 막히면 알림 · 대기 초 */")

# ---------- F. 바로잡기 2: 리치 · 공중제비 태세 · 사선 · 곡사 주기 · 후리기 경고/그만둠 ----------
# 다시 쥔 근접 무기 = 사수 (리치를 더한 길이가 1 을 넘는데 장창이 아님) — 최종 길이로 장창 판정 · 맨손도
rep("u.longReach = !far && wp.rng > 1;", "u.longReach = !far && u.rng > 1;   /* v8.7.3 몸 리치를 더한 길이로 (호레이쇼가 도끼를 다시 쥐면 사수가 되던 것) */")
n5 = sum(len(re.findall(r"(\w)\.rng = \(\(W\.rules\.weapons \|\| \{\}\)\['맨손'\] \|\| \{ rng: 0\.3 \}\)\.rng \+ \(\1\.reachX \|\| 0\); \1\.longReach = false;", v)) for v in P.values())
assert n5 == 5, n5
for k in P:
    P[k] = re.sub(r"(\w)\.rng = \(\(W\.rules\.weapons \|\| \{\}\)\['맨손'\] \|\| \{ rng: 0\.3 \}\)\.rng \+ \(\1\.reachX \|\| 0\); \1\.longReach = false;", r"\1.rng = ((W.rules.weapons || {})['맨손'] || { rng: 0.3 }).rng + (\1.reachX || 0); \1.longReach = \1.rng > 1;", P[k])
# 공중제비가 나를 향해 오면 돌진처럼 태세 (막을 수 있는 이)
rep("  if (!heal && t.side !== u.side && t.act && t.act.k === 'charge' && t.act.b === u.i && u.canGuard && !isFar(u) && u.guardMode !== 'off' && aware(W, u, t)){",
    "  if (!heal && t.side !== u.side && t.act && (t.act.k === 'charge' || (t.act.k === 'leap' && t.act.flip && t.act.slam)) && t.act.b === u.i && u.canGuard && !isFar(u) && u.guardMode !== 'off' && aware(W, u, t)){   /* v8.7.3 공중제비 내려찍기도 */")
rep("    const ce = u.guardMode !== 'off' && !isFar(u) ? W.units.find(e => e.alive && e.side !== u.side && e.act && e.act.k === 'charge' && e.act.b === u.i && aware(W, u, e)) : null;",
    "    const ce = u.guardMode !== 'off' && !isFar(u) ? W.units.find(e => e.alive && e.side !== u.side && e.act && (e.act.k === 'charge' || (e.act.k === 'leap' && e.act.flip && e.act.slam)) && e.act.b === u.i && aware(W, u, e)) : null;   /* v8.7.3 공중제비 내려찍기도 태세로 받음 */")
# 내려찍기: 태세 (방패 · 무구를 들고 마주 봄 · 알아챔) 면 막힘 — 피해 · 넘어짐 없음, 뛴 쪽은 짧게 휘청 (손해는 작음)
rep("""    const ex = e.x - u.x, ey = e.y - u.y, al = ex * dx + ey * dy, lat = Math.abs(ex * dy - ey * dx);
    if (al < -0.3 || al > L0 + e.r || lat > w + e.r) continue;
    const o = strike(W, u, e, e, 1, false, { mul: F.mul || 2.3, heavyCrit: F.crit || 0.25, tag: '공중제비 내려찍기' }); n++;""",
"""    const ex = e.x - u.x, ey = e.y - u.y, al = ex * dx + ey * dy, lat = Math.abs(ex * dy - ey * dx);
    if (al < -0.3 || al > L0 + e.r || lat > w + e.r) continue;
    if ((e.canGuard || e.shield || e.armShield) && setFor(W, e, u)){ held = e; L(W, { k: 'slamHeld', a: u.i, b: e.i, how: e.armShield ? '팔' : e.shield ? '방패' : '무구', vis: u.side === 0 || e.side === 0 || !!u.seenBy || !!e.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y, s: '태세 — 막힘!', c: 'b', t0: W.t }); continue; }   /* v8.7.3 태세에 막힘 */
    const o = strike(W, u, e, e, 1, false, { mul: F.mul || 2.3, heavyCrit: F.crit || 0.25, tag: '공중제비 내려찍기' }); n++;""")
rep("  const F = SPR(W, 'flip'), dx0 = A.tx - A.fx, dy0 = A.ty - A.fy, l = Math.hypot(dx0, dy0) || 1, dx = dx0 / l, dy = dy0 / l, L0 = F.len || 1.5, w = (F.w || 0.9) / 2; let n = 0;",
    "  const F = SPR(W, 'flip'), dx0 = A.tx - A.fx, dy0 = A.ty - A.fy, l = Math.hypot(dx0, dy0) || 1, dx = dx0 / l, dy = dy0 / l, L0 = F.len || 1.5, w = (F.w || 0.9) / 2; let n = 0, held = null;")
rep("  L(W, { k: 'slam', a: u.i, n, vis: u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: A.tx, y: A.ty, s: '내려찍기!', c: 'd', t0: W.t });",
    "  if (held && u.alive) stun(W, u, F.heldStun != null ? F.heldStun : 0.35, held.i);   /* v8.7.3 막히면 짧게 휘청 (돌진보다 손해가 작음) */\n"
    "  L(W, { k: 'slam', a: u.i, n, held: held ? held.i : null, vis: u.side === 0 || !!u.seenBy }); if (W.fxOn && n) W.fx.push({ k: 'num', x: A.tx, y: A.ty, s: '내려찍기!', c: 'd', t0: W.t });")
# 철퇴 던지기: 던지는 순간 사선을 다시 봄 · 사선 폭은 몸 전체 (공이 휘어 날아감)
rep("const flLane = (W, u, t) => { const FL = flailOf(W, u) || {}, dt0 = dist(u, t); return W.units.some(o => o.alive && o !== u && o.side === u.side && !o.lie && dist(u, o) < dt0 && segD(u, t.x, t.y, o) < o.r * (FL.ff || 0.55) + (FL.ball || 0.2)); };",
    "const flLane = (W, u, t) => { const FL = flailOf(W, u) || {}, dt0 = dist(u, t) + 0.3; return W.units.some(o => o.alive && o !== u && o.side === u.side && !o.lie && dist(u, o) < dt0 && segD(u, t.x, t.y, o) < o.r * (FL.laneR || 0.95) + (FL.ball || 0.2) + 0.15); };   /* v8.7.3 몸 전체 + 휘어 날아가는 몫 */")
rep("    if (A.k === 'atk' && A.fl && t.alive && flailOf(W, u)){ throwFlail(W, u, t);",
    "    if (A.k === 'atk' && A.fl && t.alive && flailOf(W, u) && !ordFire(u, t) && !cornered(W, u) && flLane(W, u, t)){ A.phase = 'rec'; A.end = W.t + 0.15; A.t1 = W.t; setMood(W, u, '동료가 철퇴 길에 들어옴 — 멈춤', t.i); L(W, { k: 'hold', a: u.i, b: t.i, by: (W.units.find(o => o.alive && o !== u && o.side === u.side && segD(u, t.x, t.y, o) < o.r + 0.5) || t).i, flail: true, vis: u.side === 0 || !!u.seenBy }); return; }   /* v8.7.3 던지는 순간에도 사선을 봄 */\n"
    "    if (A.k === 'atk' && A.fl && t.alive && flailOf(W, u)){ throwFlail(W, u, t);")
rep("  if (fl && !u.order && !cornered(W, u) && flLane(W, u, t)){ setMood(W, u, '동료가 철퇴 길에 있음', t.i); u.waitT += 0.2; return; }",
    "  if (fl && !ordFire(u, t) && !cornered(W, u) && flLane(W, u, t)){ setMood(W, u, '동료가 철퇴 길에 있음', t.i); u.waitT += 0.2; return; }   /* v8.7.3 연타 (바로) 명령만 감수 — 사격과 같은 규칙 */")
# 도약 사격: 사선에 동료가 있으면 그 표적은 쏘지 않음 (다른 표적 · 아니면 안 쏨)
rep("""  let t = A.b != null ? W.units[A.b] : null; if (!okT(t)) t = W.units.filter(okT).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (!t) return;
  fire(W, u); launch(W, u, t, 1, LP.shotAim || 0.6);""",
"""  const know = knows(W, u), safe = f => { const fb = firstOnLine(W, u, f, u, know); return !(fb !== f && fb.side === u.side) && ffOdds(W, u, f, u.x, u.y).p <= ffLim(u, W); };   /* v8.7.3 도약 사격도 사선을 봄 */
  let t = A.b != null ? W.units[A.b] : null; const t0 = okT(t) ? t : null; if (!okT(t) || !safe(t)) t = W.units.filter(f => okT(f) && safe(f)).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (!t){ if (t0) L(W, { k: 'hold', a: u.i, b: t0.i, by: (firstOnLine(W, u, t0, u, know) || t0).i, leap: true, vis: u.side === 0 || !!u.seenBy }); return; }
  fire(W, u); launch(W, u, t, 1, LP.shotAim || 0.6);""")
# 자동 점사: 동료가 사선 곁이면 (10% 넘음) 남은 발을 쏘지 않음 (연타 명령은 그대로)
rep("if (!ordFire(u, t) && ((fb !== t && fb.side === u.side) || ffOdds(W, u, t, u.x, u.y, -0.4).p > 0.2)){",
    "if (!ordFire(u, t) && ((fb !== t && fb.side === u.side) || ffOdds(W, u, t, u.x, u.y, -0.4).p > 0.1)){   /* v8.7.3 0.2 → 0.1 */")
# 곡사 주기: 같은 표적을 곡사로 쏘고 있으면 (3초 안) 직사 각을 다시 찾느라 멈칫하지 않음 — 연사 = 최소 사격 간격 (단궁)
rep("const angleFirst = (W, u, t, dt) => { if (!u.lob || AI6.includes('angle') || (u.angT || 0) >= 1.5 ||",
    "const angleFirst = (W, u, t, dt) => { if (!u.lob || AI6.includes('angle') || (u.lobB === t.i && u.lobT != null && W.t - u.lobT < 3) || (u.angT || 0) >= 1.5 ||")
rep("arcRisk(W, u, t).p <= (now ? (W.rules.arc || {}).rapid || 0.25 : ffLim(u, W))){ u.ffWait = 0; u.angT = 0; startArc(",
    "arcRisk(W, u, t).p <= (now ? (W.rules.arc || {}).rapid || 0.25 : ffLim(u, W))){ u.ffWait = 0; u.angT = 0; u.lobB = t.i; u.lobT = W.t; startArc(")
rep("  if (arcOK(W, u, t) && arcRisk(W, u, t).p <= ffLim(u, W)){ u.ffWait = 0; startArc(W, u, t, '곡사 · 동료 너머로'); return; }",
    "  if (arcOK(W, u, t) && arcRisk(W, u, t).p <= ffLim(u, W)){ u.ffWait = 0; u.lobB = t.i; u.lobT = W.t; startArc(W, u, t, '곡사 · 동료 너머로'); return; }")
# 철퇴 후리기 준비 (머리 위로 돌림) 중: 원 안의 동료는 '!' 하고 원 밖으로 · 그만둠 명령
rep("  if (u.kb || W.t < u.proneT || W.t < (u.stunT || -9)) return;   // v5.2 날아가는 중",
    "  if (u.order && u.order.k === 'specCancel'){ const A0 = u.act; if (A0 && A0.k === 'spec' && A0.phase === 'wind' && (!u.order.s || A0.s === u.order.s)){ u.act = null; const x0 = specOf(u, A0.s); if (x0) x0.cdT = Math.min(x0.cdT, W.t + 1); L(W, { k: 'specCancel', a: u.i, s: A0.s, vis: true }); setMood(W, u, (x0 ? x0.name : '기술') + ' 그만둠'); } u.order = null; }   /* v8.7.3 준비 중에 그만둠 */\n"
    "  if (u.act && u.act.k === 'spec' && u.act.s === 'sweep' && u.act.phase === 'wind') sweepWarn(W, u, u.act);   /* v8.7.3 원 안의 동료가 비켜섬 */\n"
    "  if (u.kb || W.t < u.proneT || W.t < (u.stunT || -9)) return;   // v5.2 날아가는 중")
rep("function stepSweep(W, u, dt){",
    """// v8.7.3 철퇴 후리기 예고: 머리 위로 돌리는 동안 원 (휘두를 거리 + 공) 안의 동료는 보거나 가까우면 '!' 하고 원 밖으로 비켜섬 (제자리 명령 · 넘어진 이는 그대로)
function sweepWarn(W, u, A){
  const S = SPR(W, 'sweep'), R = Math.max(S.rMin || 1.2, Math.min(S.rMax || 2.6, A.R || S.r || 1.9)) + (S.w || 0.3); A.warned = A.warned || [];
  for (const e of W.units){ if (!e.alive || e === u || e.side !== u.side || e.summon === 'slime' || A.warned.includes(e.i) || e.down || e.kb || e.crawl || e.lie) continue;
    const d = dist(u, e); if (d - e.r > R + 0.25 || !(canSee(W, e, u) || d < 3)) continue; A.warned.push(e.i);
    if (e.order && e.order.k === 'hold') continue;
    const a = d > 0.05 ? Math.atan2(e.y - u.y, e.x - u.x) : W.rand() * 6.283, D = R + e.r + 0.5;
    let fx = Math.max(0.6, Math.min(W.map.W - 0.6, u.x + Math.cos(a) * D)), fy = Math.max(0.6, Math.min(W.map.H - 0.6, u.y + Math.sin(a) * D)); if (boxRock(W, fx, fy, e.r * 0.9)){ const q = freeSpot(W, fx, fy, e.r); if (q){ fx = q.x; fy = q.y; } }
    const ea = e.act; if (ea && !(ea.k === 'charge' && ea.phase === 'run') && ea.k !== 'leap' && ea.k !== 'dodge' && !(ea.k === 'spec' && ea.phase === 'swing')){ if (ea.k === 'skill' && ea.phase === 'tend') tendEnd(W, e, ea, '철퇴를 피함'); e.act = null; e.burst = null; }   // 곧 철퇴가 도니 하던 일을 놓고 비킴
    if (!e.act){ e.flee = { x: fx, y: fy, until: W.t + Math.max(0.6, A.end - W.t + 0.5), why: '철퇴 원 밖으로' }; }
    L(W, { k: 'sweepWarn', a: e.i, b: u.i, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.4, s: '!', c: 'g', t0: W.t }); }
}
function stepSweep(W, u, dt){""")
rep("  if (u.flee){ if (W.t < u.flee.until && !u.lie){ goTo(W, u, u.flee.x, u.flee.y, dt); setMood(W, u, '내려앉을 자리에서 피함'); return; } u.flee = null; }",
    "  if (u.flee){ if (W.t < u.flee.until && !u.lie){ goTo(W, u, u.flee.x, u.flee.y, dt); setMood(W, u, u.flee.why || '내려앉을 자리에서 피함'); return; } u.flee = null; }")
# 고유 기술 대기 초
rep("else setMood(W, u, sp.name + ' 대기'); return; }   // v7.19.2 역장도 바로",
    "else setMood(W, u, sp.name + ' 대기' + (sp.cdT > W.t ? ' (' + (sp.cdT - W.t).toFixed(1) + '초)' : flailOut(W, u) ? ' (철퇴를 거두는 중)' : '')); return; }   // v7.19.2 역장도 바로   /* v8.7.3 대기 초 */")
rep("    if (!specReady(W, u, o.s) && gap(u, t) <= u.rng + 0.3){ setMood(W, u, sp.name + ' 대기', t.i);",
    "    if (!specReady(W, u, o.s) && gap(u, t) <= u.rng + 0.3){ setMood(W, u, sp.name + ' 대기' + (sp.cdT > W.t ? ' (' + (sp.cdT - W.t).toFixed(1) + '초)' : ''), t.i);")

# ---------- G. 바로잡기 3: 보스 · 판정 · 예고 회피 · 샷건 ----------
# [무장기] 장기가 없는 몸
rep("marble: tr.includes('대리석 피부'),", "marble: tr.includes('대리석 피부'), noOrg: tr.includes('무장기'),   /* v8.7.3 */")
rep("    if (vp && !(extra && extra.noWound) && !o.deflect && !t.marble){   /* v8.6.0 [대리석 피부]: 급소가 없음 */",
    "    if (vp && !(extra && extra.noWound) && !o.deflect && !t.marble && !t.noOrg){   /* v8.6.0 [대리석 피부]: 급소가 없음 */   /* v8.7.3 [무장기] */")
rep("  if (pen && part === '머리' && pw.kind !== '총포류' && !(t.traits || []).includes('보스') &&", "  if (pen && part === '머리' && pw.kind !== '총포류' && !(t.traits || []).includes('보스') && !t.noOrg &&")
rep("&& W.rand() < kill){ dmg = Math.max(dmg, Math.ceil(t.hp)); o.tag = (HM ? '머리 찍기'", "&& !t.noOrg && W.rand() < kill){ dmg = Math.max(dmg, Math.ceil(t.hp)); o.tag = (HM ? '머리 찍기'")
rep("  const rnd = p => W.rand() < p, alive = t.alive;\n", "  const rnd = p => W.rand() < p, alive = t.alive;\n  if (t.noOrg && ['neck', 'skull', 'face', 'chest', 'belly'].includes(zone)) return;   /* v8.7.3 [무장기]: 장기 · 머리 · 목의 상처 없음 (팔다리만) */\n")
rep("function startBleed(W, t, by, mul){\n  const M = W.rules.maim || {}, b = t.bleed;", "function startBleed(W, t, by, mul){\n  if (t.noOrg) return;   /* v8.7.3 [무장기]: 피를 흘리지 않음 */\n  const M = W.rules.maim || {}, b = t.bleed;")
rep("function ibleed(W, t, a, mul){ const R = WR(W), b = t.ibleed;", "function ibleed(W, t, a, mul){ if (t.noOrg) return; const R = WR(W), b = t.ibleed;")
rep("function maimEye(W, t, by){\n  const M = W.rules.maim || {};\n  if (t.eyeLost >= t.eyes) return false;", "function maimEye(W, t, by){\n  const M = W.rules.maim || {};\n  if (t.noOrg || t.eyeLost >= t.eyes) return false;   /* v8.7.3 [무장기] */")
# 벽 짓눌림: 밀린 힘만큼 (살짝 밀리면 벽에 기대 버팀)
rep("  if (wallBehind(W, t, dx, dy, t.r + 0.3)){ crushWall(W, a, t, S.wall || 1.2, o, true); return 'pinned'; }\n  return fling(",
    "  if (wallBehind(W, t, dx, dy, t.r + 0.3)){ if (len < (S.crushMin != null ? S.crushMin : 0.35)) return null; crushWall(W, a, t, (S.wall || 1.2) * Math.min(1, len / (S.crushLen || 1.2)), o, true); return 'pinned'; }   /* v8.7.3 밀린 힘만큼 · 살짝은 기대 버팀 */\n  return fling(")
rep("  if (len >= 0.25 && wallBehind(W, t, dx, dy, t.r + 0.3)){ crushWall(W, a, t, S.wall || 1.2, o, true); return 'pinned'; }",
    "  if (len >= (S.crushMin != null ? S.crushMin : 0.35) && wallBehind(W, t, dx, dy, t.r + 0.3)){ crushWall(W, a, t, (S.wall || 1.2) * Math.min(1, len / (S.crushLen || 1.2)), o, true); return 'pinned'; }   /* v8.7.3 */")
rep("crushWall(W, a, u, 0.5 + 0.5 * Math.min(1, K.left / Math.max(0.01, K.len)), K.o, false); return; }",
    "crushWall(W, a, u, (0.5 + 0.5 * Math.min(1, K.left / Math.max(0.01, K.len))) * Math.min(1, K.len / (S.crushLen || 1.2)), K.o, false); return; }   /* v8.7.3 날아간 길이만큼 */")
rep("  if (t.alive) knockDown(W, t, S.crushProne || 1.6, a.i, '벽에 짓뭉개짐');",
    "  if (t.alive && k >= 0.5) knockDown(W, t, S.crushProne || 1.6, a.i, '벽에 짓뭉개짐'); else if (t.alive) stun(W, t, 0.25, a.i);   /* v8.7.3 약하게 박히면 휘청만 */")
# 회전 투척 도끼: 근접 일격처럼 (화살 관통 판정이 아님) · 뒤로 갈수록 조금씩 약하게
rep("        const o = strike(W, by, e, e, 1, true, { mul: S.mul, tag: S.wave ? '피의 검기' : '회전하는 도끼', wk: S.wave ? '마법' : '날붙이', noFire: true });",
    "        const o = strike(W, by, e, e, 1, !!S.wave, { mul: S.mul * (S.wave ? 1 : Math.max(0.55, 1 - 0.15 * (S.hit.length - 1))), tag: S.wave ? '피의 검기' : '회전하는 도끼', wk: S.wave ? '마법' : '날붙이', noFire: true, grab: !S.wave });   /* v8.7.3 도끼는 몸으로 받는 일격 (화살처럼 박혀 멈추지 않음) · 뒤로 갈수록 약하게 */")
# 큰 공격 예고 → 비킴 (적 · 아군 같게)
rep("  cmdTick(W);   // v7.4", "  cmdTick(W); tgTick(W);   /* v8.7.3 예고 회피 */   // v7.4")
rep("function stepSweep(W, u, dt){",
    """// v8.7.3 큰 공격의 예고 (도끼 던지기 · 투창 조준 · 넓게 휘두르기): 범위 안에서 그것을 본 몸은 준비가 tg.left 초 넘게 남았으면 하던 짓 (돌진 · 도약 중이 아니면) 을 끊고 비킴 — 회피 등급 · 지침 · 무게로 성공률 · 머리 위 '!' (적 · 아군 같은 규칙)
const tgDodgeP = (W, e) => { const T = W.rules.tg || {}; return Math.max(0.1, Math.min(0.95, (T.p != null ? T.p : 0.55) * (e.ev || 1) * (e.exhausted ? 0.5 : e.tired ? 0.8 : 1) * ((e.mass || 62) > 150 ? 0.6 : 1) * (e.blind ? 0.3 : 1))); };
function tgTick(W){
  const T = W.rules.tg || {}, left = T.left != null ? T.left : 0.25;
  for (const a of W.units){ const A = a.act; if (!a.alive || !A || A.phase !== 'wind' || A.end - W.t < left) continue;
    const t = A.b != null ? W.units[A.b] : null; let Z = null;
    if (A.k === 'spec' && A.s === 'spin' && t){ const S = SPR(W, 'spin'); Z = { k: 'line', ang: Math.atan2(t.y - a.y, t.x - a.x), len: S.rng || 9, w: (S.w || 0.55) + 0.25, what: '날아올 도끼', foe: true }; }
    else if (A.k === 'throw' && t && t.side !== a.side){ Z = { k: 'one', b: t.i, ang: Math.atan2(t.y - a.y, t.x - a.x), what: isKnife(W, a) ? '단검 겨눔' : '투창 겨눔' }; }
    else if (A.k === 'atk' && A.mode === 'sweep' && t){ const S = W.rules.sweep || {}; Z = { k: 'fan', ang: Math.atan2(t.y - a.y, t.x - a.x), arc: (S.arc || 65) * Math.PI / 180, R: a.rng + (S.reach || 0.35) + 0.3, what: '넓게 휘두르기' }; }
    if (!Z) continue;
    const seen = A.tgSeen || (A.tgSeen = []);
    for (const e of W.units){ if (!e.alive || e === a || seen.includes(e.i) || e.down || e.kb || e.crawl || e.lie || e.summon === 'slime' || W.t < (e.proneT || -9) || W.t < (e.stunT || -9)) continue;
      if ((Z.foe || Z.k === 'one') && e.side === a.side) continue;
      const dx = e.x - a.x, dy = e.y - a.y, d = Math.hypot(dx, dy), al = dx * Math.cos(Z.ang) + dy * Math.sin(Z.ang), lat = -dx * Math.sin(Z.ang) + dy * Math.cos(Z.ang);
      const inZ = Z.k === 'one' ? e.i === Z.b : Z.k === 'line' ? al > 0 && al < Z.len && Math.abs(lat) < Z.w + e.r : d - e.r < Z.R && angDiff(Math.atan2(dy, dx), Z.ang) < Z.arc + 0.25;
      if (!inZ) continue; seen.push(e.i);
      if (!aware(W, e, a) || (e.order && e.order.k === 'hold') || (e.act && ((e.act.k === 'charge' && e.act.phase === 'run') || e.act.k === 'leap' || e.act.k === 'dodge'))) continue;
      if (W.rand() >= tgDodgeP(W, e)){ L(W, { k: 'tgLate', a: e.i, b: a.i, what: Z.what, vis: e.side === 0 || !!e.seenBy }); continue; }
      const s = Z.k === 'fan' ? 0 : (lat >= 0 ? 1 : -1), D = Z.k === 'fan' ? Math.max(Z.R - d + e.r + 0.4, 0.8) : Math.max(0.9, (Z.w || 0.6) + e.r + 0.3 - Math.abs(lat)) + 0.2;
      const ox = Z.k === 'fan' ? dx / (d || 1) : -Math.sin(Z.ang) * s, oy = Z.k === 'fan' ? dy / (d || 1) : Math.cos(Z.ang) * s;
      let fx = Math.max(0.6, Math.min(W.map.W - 0.6, e.x + ox * D)), fy = Math.max(0.6, Math.min(W.map.H - 0.6, e.y + oy * D)); if (boxRock(W, fx, fy, e.r * 0.9)){ fx = Math.max(0.6, Math.min(W.map.W - 0.6, e.x - ox * D)); fy = Math.max(0.6, Math.min(W.map.H - 0.6, e.y - oy * D)); if (boxRock(W, fx, fy, e.r * 0.9)) continue; }
      const ea = e.act; if (ea){ if (ea.k === 'skill' && ea.phase === 'tend') tendEnd(W, e, ea, '피함'); e.act = null; e.burst = null; }
      e.flee = { x: fx, y: fy, until: A.end + 0.35, why: Z.what + ' — 피함' };
      L(W, { k: 'tgDodge', a: e.i, b: a.i, what: Z.what, vis: e.side === 0 || !!e.seenBy || a.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.45, s: '!', c: 'g', t0: W.t }); } }
}
function stepSweep(W, u, dt){""")
# 도약 강타: 하던 일이 있어도 끊고 비킴 (예고 회피와 같게)
rep("    if (e.act && e.act.phase === 'wind' && e.act.k !== 'charge') e.act = null;\n    if (!e.act){ e.flee = { x: fx, y: fy, until: W.t + (Q.flee || 0.85) }; L(W, { k: 'quakeFlee'",
    "    { const ea = e.act; if (ea && !(ea.k === 'charge' && ea.phase === 'run') && ea.k !== 'leap' && ea.k !== 'dodge'){ if (ea.k === 'skill' && ea.phase === 'tend') tendEnd(W, e, ea, '피함'); e.act = null; e.burst = null; } }   /* v8.7.3 하던 짓을 끊고 */\n    if (!e.act){ if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.45, s: '!', c: 'g', t0: W.t }); e.flee = { x: fx, y: fy, until: W.t + (Q.flee || 0.85), why: '내려앉을 자리에서 피함' }; L(W, { k: 'quakeFlee'")
# 근접: 준비 끝 0.15초 전까지 밀려난 상대를 0.6칸 따라감 (적 · 아군 같게)
rep("  if (u.act && u.act.k === 'atk' && u.act.phase === 'wind' && !isFar(u)){ const tt = W.units[u.act.b]; if (tt && tt.alive) u.fg = Math.atan2(tt.y - u.y, tt.x - u.x); }",
    "  if (u.act && u.act.k === 'atk' && u.act.phase === 'wind' && !isFar(u)){ const tt = W.units[u.act.b]; if (tt && tt.alive){ u.fg = Math.atan2(tt.y - u.y, tt.x - u.x);\n"
    "      const A = u.act, TR = (W.rules.track || {}).d != null ? W.rules.track.d : 0.6, need = gap(u, tt) - u.rng; if (need > 0.02 && A.end - W.t > 0.15 && (A.trk || 0) < TR && !u.kb){ const d0 = dist(u, tt) || 1, st = Math.min(need + 0.05, TR - (A.trk || 0), spdNow(W, u) * dt * 1.2), x0 = u.x, y0 = u.y; tryMove(W, u, u.x + (tt.x - u.x) / d0 * st, u.y + (tt.y - u.y) / d0 * st); A.trk = (A.trk || 0) + Math.hypot(u.x - x0, u.y - y0); } } }   /* v8.7.3 마지막까지 조금 따라감 */")
# 후리기: 원 밖으로 막 밀려난 적이 있으면 0.4M 까지 늘림
rep("    const R = Math.max(S.rMin || 1.2, Math.min(S.rMax || 2.6, A.R || S.r || 1.9)); A.R = R; A.phase = 'swing';",
    "    let R = Math.max(S.rMin || 1.2, Math.min(S.rMax || 2.6, A.R || S.r || 1.9)); { const w0 = S.w || 0.3, fo = W.units.filter(e => e.alive && e.side !== u.side), inR = fo.some(e => dist(u, e) - e.r <= R + w0), out = fo.filter(e => dist(u, e) - e.r > R + w0 && dist(u, e) - e.r <= R + w0 + 0.4); if (!inR && out.length) R = Math.min(R + 0.4, Math.min(...out.map(e => dist(u, e) - e.r - w0)) + 0.05); }   /* v8.7.3 밀려난 적을 0.4M 까지 따라감 */\n"
    "    A.R = R; A.phase = 'swing';")
# 샷건 산탄: 부채꼴로 여러 알 (가까울수록 한 몸에 많이) · 여러 적
rep("  W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: wp.vel || 40, left: u.rng + u.r + 2.5, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1, gun: wp.kind === '총포류', cov, wn: u.weapon });\n}",
    "  if (wp.cone && !(u.weaponNow && u.weaponNow !== u.weapon)){ const C = wp.cone, n = C.n || 5, sp = C.ang || 0.32;   /* v8.7.3 산탄 부채꼴 */\n"
    "    for (let k = 0; k < n; k++){ const a2 = ang + (n > 1 ? (k / (n - 1) - 0.5) * sp : 0) + (W.rand() - 0.5) * sp * 0.12, ddx = Math.cos(a2), ddy = Math.sin(a2); W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + ddx * (u.r + 0.02), y: u.y + ddy * (u.r + 0.02), x0: u.x, y0: u.y, dx: ddx, dy: ddy, sp: wp.vel || 40, left: u.rng + u.r + 1.0, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: (mul || 1) * (C.mul || 0.32), pm: pm || 1, gun: true, cov: k === (n >> 1) ? cov : null, wn: u.weapon, pel: k + 1 }); }\n"
    "    return; }\n"
    "  W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: wp.vel || 40, left: u.rng + u.r + 2.5, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1, gun: wp.kind === '총포류', cov, wn: u.weapon });\n}")
rep("'샷건':{rng:2.5, ammo:4, loud:true,", "'샷건':{rng:2.5, cone:{n:5, ang:0.32, mul:0.32}, ammo:4, loud:true,")
# 바꿔 들기: 보이는 근접이 1초 넘게 머물 때만 (코앞이면 바로)
rep("    if (f){ if (u.act){ u.act = null; u.burst = null; } return startAlt(W, u, f.name + (gap(u, f) < 1.2 ? '이(가) 붙음' : '이(가) 다가옴')); } }",
    "    if (!f) u.altNearT = null; else if (gap(u, f) >= 1.2 && (u.altNearT == null ? (u.altNearT = W.t, true) : W.t - u.altNearT < (I.altDwell || 1))){ /* v8.7.3 1초 머물면 */ } else { u.altNearT = null; if (u.act){ u.act = null; u.burst = null; } return startAlt(W, u, f.name + (gap(u, f) < 1.2 ? '이(가) 붙음' : '이(가) 다가옴')); } }")
# 투창 명령 → 찌르기로 바뀌면 알림
rep("    if (see && gap(u, t) <= u.rng + 0.3){ u.order = { k: 'attack', b: t.i }; return; }   // 너무 가까움 → 그냥 찌름",
    "    if (see && gap(u, t) <= u.rng + 0.3){ L(W, { k: 'ordSwap', a: u.i, b: t.i, from: 'throw', to: 'attack', why: '너무 가까움 — 그냥 찌름', vis: u.side === 0 }); u.order = { k: 'attack', b: t.i }; return; }   // 너무 가까움 → 그냥 찌름   /* v8.7.3 알림 */")
# 창을 던진 적: 방패 뒤에서 5초 넘게 기다렸으면 무릅쓰고 창을 주우러 감
rep("function rearm(W, u, t, dt){\n  if (retrieveSpear(W, u, dt) || scavenge(W, u, dt)) return true;",
    "function rearm(W, u, t, dt){\n  if (retrieveSpear(W, u, dt) || scavenge(W, u, dt)){ u.rearmT0 = null; return true; }\n  if (u.rearmT0 == null) u.rearmT0 = W.t; if (W.t - u.rearmT0 > ((W.rules.rearm || {}).wait || 5) && retrieveSpear(W, u, dt, true)){ setMood(W, u, '창을 되찾으러 — 무릅씀'); return true; }   /* v8.7.3 끝없이 숨지 않음 */")
# 치유: 배 안 출혈뿐인 성한 동료에게 약을 버리지 않음 · 같은 알림은 10초에 한 번 · 제자리 명령이어도 1.2칸 안의 위급한 동료는 돌봄
rep("const injUrgent = (W, a) => !!(a.koT && a.koT > W.t) || (a.shock || 0) >= 2 || !!a.ibleed;",
    "const injUrgent = (W, a) => !!(a.koT && a.koT > W.t) || (a.shock || 0) >= 2 || (!!a.ibleed && a.hp / a.max < 0.8);   /* v8.7.3 성한 몸의 배 안 출혈은 급하지 않음 (약을 버리던 것) */")
rep("  if (ord && !(ord.k === 'hold' && (v === u || gap(u, v) <= K.rng))){ if (u.healNote !== v.i || W.t - (u.healNoteT || -9) > 4){",
    "  if (ord && !(ord.k === 'hold' && (v === u || gap(u, v) <= Math.max(K.rng, healTier(W, u, v, thr) >= 2 ? 1.2 : 0)))){ if (u.healNote !== v.i || W.t - (u.healNoteT || -9) > 10){   /* v8.7.3 제자리여도 곁의 위급한 동료 · 알림은 10초에 한 번 */")
# 철퇴는 2열 찌르기에서 뺌 (창 · 장창만)
rep("const flLane = (W, u, t) =>", "const rank2 = (W, u) => u.rng >= 0.9 && !flailOf(W, u);   /* v8.7.3 2열 (앞 동료 너머) 은 창 · 장창만 — 철퇴는 던지는 공이라 앞 동료를 맞힘 */\nconst flLane = (W, u, t) =>")
rep("  if (u.rearOf && u.rng >= 0.9){   // 뒷줄 창", "  if (u.rearOf && rank2(W, u)){   // 뒷줄 창")
rep("  if (u.line || (!ord && (!lineAuto(W, u) || u.rng >= 0.9 || u.giant && u.role !== '전선'))) return false;", "  if (u.line || (!ord && (!lineAuto(W, u) || rank2(W, u) || u.giant && u.role !== '전선'))) return false;")
rep("  if (ord && u.rng >= 0.9){   // 창 (장창)", "  if (ord && rank2(W, u)){   // 창 (장창)")
rep("&& !isFar(a) && !a.crawl && a.rng < 0.9 && !W.units.some(o => o !== u && o.rearOf && o.rearOf.j === a.i))", "&& !isFar(a) && !a.crawl && !rank2(W, a) && !W.units.some(o => o !== u && o.rearOf && o.rearOf.j === a.i))")
rep("  if (isFar(u) || u.rng < 0.9 || u.crawl) return false;", "  if (isFar(u) || !rank2(W, u) || u.crawl) return false;")
rep("const spears = mine.filter(u => !isFar(u) && u.role !== '전선' && u.rng >= 0.9)", "const spears = mine.filter(u => !isFar(u) && u.role !== '전선' && rank2(W, u))")
rep("const swords = mine.filter(u => !isFar(u) && u.role !== '전선' && u.rng < 0.9 &&", "const swords = mine.filter(u => !isFar(u) && u.role !== '전선' && !rank2(W, u) &&")

# ---------- H. (v1.3) 근접 명중 식 · 고립 판단 ----------
# 식 가운데 주석이 ": 이하" 를 잘라 dp = (u.revealT = W.t) 가 되던 것 — 싸움 첫 1초는 명중률이 시각, 그 뒤엔 어둠 속 0.96 이 빠짐
rep("dp = blind0 ? Math.max(R.darkAim != null ? R.darkAim : 0.25, gap(u, t) < 0.45 ? 0.6 : 0) :   // v7.9.3 몸이 닿는 거리면 어둠에서도 어느 정도 맞춤 !litAt(W, t.x, t.y) && R.darkHit ? (R.darkHit.melee || 0.96) : 1;   // v7.5 어둠 속은 보여도 살짝 헛침",
    "dp = blind0 ? Math.max(R.darkAim != null ? R.darkAim : 0.25, gap(u, t) < 0.45 ? 0.6 : 0) : !litAt(W, t.x, t.y) && R.darkHit ? (R.darkHit.melee || 0.96) : 1;   // v7.9.3 몸이 닿는 거리면 어둠에서도 어느 정도 맞춤 · v7.5 어둠 속은 보여도 살짝 헛침 · v8.7.3 식 가운데 주석이 뒤를 잘라 (첫 1초 명중 = 시각) 바로잡음")
# 고립: 나를 따라온 편대원은 '곁의 동료' 가 아님 — 편대장이 혼자 떨어져 있으면 편대원과 함께 본대로
rep("  const J = W.rules.rejoin || {}, k = isFar(u) ? (J.ranged || 1.5) : 1, mates = W.units.filter(a => a.alive && a !== u && a.side === 0 && !a.down && !a.crawl);",
    "  const J = W.rules.rejoin || {}, k = isFar(u) ? (J.ranged || 1.5) : 1, mates = W.units.filter(a => a.alive && a !== u && a.side === 0 && !a.down && !a.crawl && !a.gone && leadOf(W, a) !== u);   /* v8.7.3 나를 따르는 편대원 · 나간 이는 곁의 동료로 치지 않음 */")

# 적이 없는 맵: 서두를 일 · 싸움 소리가 없으니 부르면 닿음 (멀면 늦게) — 명령 놓침 · 소식 끊김 없음 (양쪽 같음)
rep("function cmdLink1(W, C, u, relay){\n",
    "function cmdLink1(W, C, u, relay){\n  if (!W.units.some(f => f.alive && !f.gone && f.side !== C.side)) return { p: 1, t: 0.15 + dist(C, u) * 0.04, via: C.mute ? 'sign' : 'voice', why: [], busy: false, calm: true };   /* v8.7.3 적이 없는 맵 (끝난 맵 · 오딜의 방) */\n")
rep("  const C = cmdBoss(W, 0);\n  for (const u of W.units){ if (u.side !== 0) continue;",
    "  const C = cmdBoss(W, 0), calm = !W.units.some(f => f.alive && !f.gone && f.side === 1);   /* v8.7.3 적이 없으면 서로 자리를 앎 */\n  for (const u of W.units){ if (u.side !== 0) continue;")
rep("    const k = !C || u === C || AI6.includes('cmdlink') ||", "    const k = !C || calm || u === C || AI6.includes('cmdlink') ||")
# 상황 스냅샷: 방 구경 · 합류 이동은 유저 명령이 아님
rep("order: u.side === 0 ? orderTxt(u.order, u) : null", "order: u.side === 0 ? (u.order && (u.order.room || u.order.rejoin) ? ['auto'] : orderTxt(u.order, u)) : null")

# ---------- (v1.3) 화살통 · 탄창 채우기 ----------
rep("function pullAmmo(W, u){\n  const at = ammoTOf(W, u.weapon); if (!at) return 0; const wp = (W.rules.weapons || {})[u.weapon] || {}, cap = Math.max(1, wp.ammo || (INV(W).stack || {})[at] || 20); let got = 0;\n  for (const it of (u.bag || []).filter(x => x.k === 'ammo' && x.at === at)){ const n = Math.min(it.n || 0, cap - got); it.n -= n; got += n; if (got >= cap) break; }",
    "function pullAmmo(W, u, quiet){   /* v8.7.3 빈 만큼만 (화살통 · 탄창을 가득) · quiet = 맵 시작 (기록 없이) */\n  const at = ammoTOf(W, u.weapon); if (!at) return 0; const wp = (W.rules.weapons || {})[u.weapon] || {}, cap = Math.max(1, u.ammoMax || wp.ammo || (INV(W).stack || {})[at] || 20), need = Math.max(0, cap - (u.ammo || 0)); let got = 0; if (!need) return 0;\n  for (const it of (u.bag || []).filter(x => x.k === 'ammo' && x.at === at)){ const n = Math.min(it.n || 0, need - got); it.n -= n; got += n; if (got >= need) break; }")
rep("  setWeapon(W, u, u.weapon, { ammo: (u.ammo || 0) + got }); if (u.magMax) u.mag = Math.min(u.magMax, u.ammo);\n  L(W, { k: 'bagAmmo',",
    "  setWeapon(W, u, u.weapon, { ammo: (u.ammo || 0) + got }); if (u.magMax) u.mag = Math.min(u.magMax, u.ammo);\n  if (quiet) return got;\n  L(W, { k: 'bagAmmo',")
rep("  for (const u of W.units){ u.stealthE = stealthOf(W, u); u.assnE = assnSkill(W, u); }",
    "  for (const u of W.units){ u.stealthE = stealthOf(W, u); u.assnE = assnSkill(W, u); }\n  for (const u of W.units) if (u.ammoMax != null && !u.weaponGone && (u.bag || []).some(x => x.k === 'ammo' && x.n > 0)) pullAmmo(W, u, true);   /* v8.7.3 맵 사이엔 시간이 있음 — 가방 탄으로 화살통 · 탄창을 채우고 시작 */")
rep("  if (dry){ const at = ammoTOf(W, u.weapon); if (at && u.bag.some(x => x.k === 'ammo' && x.at === at && x.n > 0)){",
    "  const low = !dry && u.ammoMax != null && !u.weaponGone && u.ammo != null && u.ammo < u.ammoMax * ((INV(W).lowAmmo != null ? INV(W).lowAmmo : 0.2)) && !W.units.some(f => f.alive && f.side !== u.side && !f.down && dist(f, u) < 4.5);   /* v8.7.3 20% 아래 · 곁에 적이 없으면 미리 채움 */\n  if (dry || low){ const at = ammoTOf(W, u.weapon); if (at && u.bag.some(x => x.k === 'ammo' && x.at === at && x.n > 0)){")
rep("  L(W, { k: 'ammoOut', a: u.i, w: u.weapon, vis: u.side === 0 || !!u.seenBy });",
    "  const at0 = ammoTOf(W, u.weapon); L(W, { k: 'ammoOut', a: u.i, w: u.weapon, bag: at0 ? (u.bag || []).filter(x => x.k === 'ammo' && x.at === at0).reduce((s, x) => s + (x.n || 0), 0) : 0, vis: u.side === 0 || !!u.seenBy });   /* v8.7.3 가방에 남은 탄 (맨손이 아님) */")
# ---------- (v1.3) 기록 글 ----------
rep("  L(W, { k: 'spearDrop', a: s.a, x: +x.toFixed(2), y: +y.toFixed(2), how });", "  L(W, { k: 'spearDrop', a: s.a, x: +x.toFixed(2), y: +y.toFixed(2), how, kn: !!s.kn, w: s.wpn || null });   /* v8.7.3 던진 단검은 창이 아님 */")
rep("  if (zone === 'neck') return m === 'c' ? (heavy && (sc >= 0.25 || o.crit) ? 'decap' : 'throat') : m === 'p' ? 'throat' : 'neck';",
    "  if (zone === 'neck') return m === 'c' ? (heavy && (sc >= 0.25 || o.crit) ? 'decap' : 'throat') : m === 'p' ? 'throatP' : 'neck';   /* v8.7.3 찌름 · 총 · 화살은 꿰뚫음 (베임은 칼날) */")
rep("throat: '목이 베임', ", "throat: '목이 베임', throatP: '목이 꿰뚫림', ", 1)
rep("const jongE = w => { const c = String(w || '').charCodeAt(String(w || '').length - 1) - 0xAC00; return c >= 0 && c <= 11171 && c % 28 !== 0; };",
    "const jongE = w => { const s = String(w || '').replace(/[\\s)\\]]+$/, ''), d = s.slice(-1); if (/[0-9]/.test(d)) return [1, 1, 0, 1, 0, 0, 1, 1, 1, 0][+d] === 1; const c = s.charCodeAt(s.length - 1) - 0xAC00; return c >= 0 && c <= 11171 && c % 28 !== 0; };   /* v8.7.3 숫자 끝도 (망자 5 · 일) */")
rep("(it.label || it.name) + '을(를) 들 수 없음'", "(it.label || it.name) + (jongE(it.label || it.name) ? '을' : '를') + ' 들 수 없음'")
rep("why: m.name + '을 거쳐 전함'", "why: m.name + (jongE(m.name) ? '을' : '를') + ' 거쳐 전함'")
rep("nm(r.chain[0]) + '을 거쳐 전함'", "nm(r.chain[0]) + (jongE(nm(r.chain[0])) ? '을' : '를') + ' 거쳐 전함'")
rep("C.name + '이(가) 이어받음'", "C.name + (jongE(C.name) ? '이' : '가') + ' 이어받음'")
rep("      L(W, { k: 'heal', a: u.i, b: t.i, amt, hp: Math.round(t.hp), stanch });", "      L(W, { k: 'heal', a: u.i, b: t.i, amt: Math.round(amt * 10) / 10, hp: Math.round(t.hp), stanch });   /* v8.7.3 소수 한 자리 */")
rep("why: `${G.name} 속력 ${G.spd} > 나 ${u.spd}`", "why: `${G.name} 속력 ${(+G.spd).toFixed(1)} > 나 ${(+u.spd).toFixed(1)}`")
rep("  if (m && W.t - u.moodLogT >= 1.2){ u.moodLogT = W.t; L(W, { k: 'mood', a: u.i, m, b: u.moodB, vis: u.side === 0 || !!u.seenBy }); }",
    "  if (m && !u.gone && W.t - u.moodLogT >= 1.2){ u.moodLogT = W.t; L(W, { k: 'mood', a: u.i, m, b: u.moodB, vis: u.side === 0 || !!u.seenBy }); }   /* v8.7.3 나간 이는 기록 없음 */")

# ---------- (v1.4) 화살통 크기 = 설계 (남은 탄과 따로) ----------
# 맵이 끝나면 남은 탄이 다음 맵의 화살통 크기가 되어 맵마다 줄던 것 (트라카 60 → 13 · 6 · 5) — 크기는 p.ammoMax 로 따로 받음
rep("      ammo: am0, ammoMax: am0, lob: far && wp.kind === '활'",
    "      ammo: am0, ammoMax: am0 != null ? Math.max(am0, +p.ammoMax > 0 ? Math.round(+p.ammoMax) : 0) : null, /* v8.7.3 화살통 · 탄 크기 (p.ammoMax) 는 남은 탄 (p.ammo) 과 따로 */ lob: far && wp.kind === '활'")
# 가방에서 채워도 · 두 번째 총으로 바꿔 들어도 크기는 그대로 (setWeapon 이 무기 기본 탄으로 되돌리던 것)
rep("  setWeapon(W, u, u.weapon, { ammo: (u.ammo || 0) + got }); if (u.magMax) u.mag = Math.min(u.magMax, u.ammo);\n  if (quiet) return got;",
    "  const mx0 = u.ammoMax; setWeapon(W, u, u.weapon, { ammo: (u.ammo || 0) + got }); if (mx0 != null) u.ammoMax = Math.max(mx0, u.ammo || 0); if (u.magMax) u.mag = Math.min(u.magMax, u.ammo);   /* v8.7.3 크기는 그대로 */\n  if (quiet) return got;")
rep("  const cur = { name: u.weapon, ammo: u.ammo, mag: u.mag }, nx = u.alt; setWeapon(W, u, nx.name, { ammo: nx.ammo, mag: nx.mag }); u.alt = cur; u.altFarT = null;",
    "  const cur = { name: u.weapon, ammo: u.ammo, mag: u.mag, ammoMax: u.ammoMax }, nx = u.alt; setWeapon(W, u, nx.name, { ammo: nx.ammo, mag: nx.mag }); if (nx.ammoMax != null && u.ammoMax != null) u.ammoMax = Math.max(nx.ammoMax, u.ammo || 0); u.alt = cur; u.altFarT = null;   /* v8.7.3 바꿔 들어도 총마다 탄 크기는 그대로 */")

# ---------- (v1.5) 시작 0.3초는 발견 없음 (양쪽 같음) ----------
# 맵이 열리자마자 (0.00초) 서로 '발견' 하던 것 (이번 여정 150번) — 몸이 닿은 것만 앎. 레이더 · 후각도 0.3초부터
rep("function canSee(W, u, t){\n  const d = Math.hypot(u.x - t.x, u.y - t.y);\n",
    "function canSee(W, u, t){\n  const d = Math.hypot(u.x - t.x, u.y - t.y);\n  if (W.camp && W.t < (W.rules.see0 != null ? W.rules.see0 : 0.3) && !W.duel && t.side !== u.side && d > (u.r || 0) + (t.r || 0) + 0.35) return false;   /* v8.7.3 여정 맵에 들어선 첫 0.3초는 발견 없음 (양쪽 같음) — 몸이 닿은 것만 (훈련장은 그대로) */\n")

# ---------- (v1.6) 끝난 뒤의 판단 · 소음 · 전열 기록 · 지휘관 · 자기 치료 · 마법 · 급소 부위 ----------
# 진형 기록에 그때의 지휘관 (이야기가 판이 끝난 뒤 명단에서 고르며 죽은 곤봉적이 '지휘한다' 던 것)
rep("L(W, { k: 'stance', side, s: k, why, was, cmd }); };", "L(W, { k: 'stance', side, s: k, why, was, cmd, by: (cmdBoss(W, side) || {}).i }); };   /* v8.7.3 그때의 지휘관 */")
rep("was: 'hold', cmd }); } } }", "was: 'hold', cmd, by: (cmdBoss(W, 1) || {}).i }); } } }")
# 판단: 그 편이 다 쓰러졌거나 나갔으면 판단하지 않음 · 나간 이는 판단 대상이 아님
rep("for (const S of [0, 1]){ const K = W.units.filter(f => f.alive && f.side !== S && iKnow(W, S, f)), J = (W.judge || (W.judge = [{}, {}]))[S]; let ch = false;",
    "for (const S of [0, 1]){ if (!W.units.some(u => u.alive && !u.gone && u.side === S)) continue;   /* v8.7.3 다 쓰러진 편 (끝난 맵의 '◆ 적의 판단') */\n    const K = W.units.filter(f => f.alive && !f.gone && f.side !== S && iKnow(W, S, f)), J = (W.judge || (W.judge = [{}, {}]))[S]; let ch = false;")
rep("if (J.d != null && !W.units[J.d].alive){ J.d = null; ch = true; } if (J.c != null && !W.units[J.c].alive){ J.c = null; ch = true; }",
    "if (J.d != null && (!W.units[J.d].alive || W.units[J.d].gone)){ J.d = null; ch = true; } if (J.c != null && (!W.units[J.c].alive || W.units[J.c].gone)){ J.c = null; ch = true; }")
# 소음: 적이 다 쓰러진 뒤엔 '커진다' 를 남기지 않음 (가라앉는 것만)
rep("if (lv !== (W.dinLogLv || 0) && W.t - (W.dinLogT == null ? -9 : W.dinLogT) >= 2){",
    "if (lv !== (W.dinLogLv || 0) && W.t - (W.dinLogT == null ? -9 : W.dinLogT) >= 2 && !(lv > (W.dinLogLv || 0) && !W.units.some(f => f.alive && !f.gone && f.side === 1))){   /* v8.7.3 끝난 맵에서 '싸움 소리가 커진다' 없음 */")
# 전열 이룸 · 흩어짐 기록은 맞설 적이 남아 있을 때만 (끝난 맵 · 적 없는 맵의 '틈')
rep("if ((!old || old.n < 2) && W.t - (W.lineLogT ? W.lineLogT[side] || -9 : -9) > 3){",
    "if ((!old || old.n < 2) && W.t - (W.lineLogT ? W.lineLogT[side] || -9 : -9) > 3 && W.units.some(f => f.alive && !f.gone && f.side !== side)){   /* v8.7.3 적이 남아 있을 때만 */")
rep("if (U2.every(u => W.t - (u.lineOutT || -9) >= 2) && !U2.every(u => u.order && u.order.k === 'line')){ const hw",
    "if (U2.every(u => W.t - (u.lineOutT || -9) >= 2) && !U2.every(u => u.order && u.order.k === 'line') && W.units.some(f => f.alive && !f.gone && f.side !== ln.side)){ const hw")
# 자기 치료는 따로 셈 (전투 일지의 '동료의 상처를 메웠다' 에서 빼려고)
rep("K.cdT = W.t + K.cd; u.healed += amt;", "K.cdT = W.t + K.cd; u.healed += amt; if (t === u) u.healedSelf = (u.healedSelf || 0) + amt;")
rep("t.hp += amt; if (!K.inf) K.left = Math.max(0, K.left - Math.ceil(amt / medB)); u.healed += amt;", "t.hp += amt; if (!K.inf) K.left = Math.max(0, K.left - Math.ceil(amt / medB)); u.healed += amt; if (t === u) u.healedSelf = (u.healedSelf || 0) + amt;")
rep("t.hp += add; A.sum += add; u.healed += add; A.n++;", "t.hp += add; A.sum += add; u.healed += add; if (t === u) u.healedSelf = (u.healedSelf || 0) + add; A.n++;")
rep("t.hp += amt; u.healed += amt; const stanch = !!t.bleed;", "t.hp += amt; u.healed += amt; if (t === u) u.healedSelf = (u.healedSelf || 0) + amt; const stanch = !!t.bleed;")
# 마법은 손에 든 물건이 아님 — 쓰러져도 '세르파의 마법' 이 바닥에 떨어지지 않음
rep("if (u.weapon && !ITEM_NATURAL.includes(u.weapon) && !(u.jav && !u.spearHeld) && !u.weaponGone) dropItem(",
    "if (u.weapon && !ITEM_NATURAL.includes(u.weapon) && ((W.rules.weapons || {})[u.weapon] || {}).kind !== '마법' && !(u.jav && !u.spearHeld) && !u.weaponGone) dropItem(")
# 급소가 정해졌으면 상처 · 죽음도 그 부위 (심장을 맞혔는데 '배를 꿰뚫림' 이던 것)
rep("res = maimRes(W, t), zone = woundZone(W, t, part, o.dir), Z = { zone, mode: o.mode || null };",
    "res = maimRes(W, t), zone = o.vital === '심장' ? 'chest' : o.vital === '머리' && part === '머리' ? 'skull' : woundZone(W, t, part, o.dir), Z = { zone, mode: o.mode || null };   /* v8.7.3 급소 = 그 부위 */")

# 1대1 링 (직접 조작): 플레이어가 움직이는 쪽은 예고를 봐도 저절로 비키지 않음 — 스스로 대시로 피함 (조작을 빼앗던 것). 상대 (AI) 는 그대로
rep("if (!aware(W, e, a) || (e.order && e.order.k === 'hold') || (e.act && ((e.act.k === 'charge' && e.act.phase === 'run') || e.act.k === 'leap' || e.act.k === 'dodge'))) continue;",
    "if (!aware(W, e, a) || (e.order && e.order.k === 'hold') || (W.duel && e.i === W.duel.me) || (e.act && ((e.act.k === 'charge' && e.act.phase === 'run') || e.act.k === 'leap' || e.act.k === 'dodge'))) continue;   /* v8.7.3 링의 직접 조작은 그대로 */")

# 혈영보: 대상 둘레 네 자리가 막히면 (동료가 촘촘히 선 무리) 여덟 방향 · 세 거리까지 찾음 — 등 뒤가 먼저 (양쪽 같은 규칙)
rep("cand = [f + Math.PI, f + Math.PI / 2, f - Math.PI / 2, f].map((a, j) => ({ j, x: t.x + Math.cos(a) * D0, y: t.y + Math.sin(a) * D0 })).filter(",
    "cand = [0, 0.45, 0.9].flatMap(dd => [f + Math.PI, f + Math.PI / 2, f - Math.PI / 2, f + Math.PI * 0.75, f - Math.PI * 0.75, f + Math.PI / 4, f - Math.PI / 4, f].map((a, j) => ({ j: dd ? 9 : j, x: t.x + Math.cos(a) * (D0 + dd), y: t.y + Math.sin(a) * (D0 + dd) }))).filter(")

# 예고를 보고 비킬 때: 이미 휘두르는 중인 기술 (철퇴 한 바퀴 · 공중제비 등 — 준비 끝난 spec) 은 끊지 않음 (돌진 · 도약처럼 몸이 실려 있음)
rep("(W.duel && e.i === W.duel.me) || (e.act && ((e.act.k === 'charge' && e.act.phase === 'run') || e.act.k === 'leap' || e.act.k === 'dodge'))) continue;",
    "(W.duel && e.i === W.duel.me) || (e.act && ((e.act.k === 'charge' && e.act.phase === 'run') || e.act.k === 'leap' || e.act.k === 'dodge' || (e.act.k === 'spec' && e.act.phase !== 'wind')))) continue;")

# 맵 시작 채움은 여정 맵 (opt.camp) 만 — 훈련장 · 엔진 시험은 정한 탄 그대로 · 미리 채움 (20% 아래) 은 누가 나를 겨누는 중이면 하지 않음
rep("  for (const u of W.units) if (u.ammoMax != null && !u.weaponGone && (u.bag || []).some(x => x.k === 'ammo' && x.n > 0)) pullAmmo(W, u, true);",
    "  if (opt && opt.camp) W.camp = true;   /* v8.7.3 여정 맵 (만들 때부터 — 0.3초 발견 없음 · 시작 채움) */\n  if (W.camp) for (const u of W.units) if (u.ammoMax != null && !u.weaponGone && (u.bag || []).some(x => x.k === 'ammo' && x.n > 0)) pullAmmo(W, u, true);")

rep("u.ammo < u.ammoMax * ((INV(W).lowAmmo != null ? INV(W).lowAmmo : 0.2)) && !W.units.some(f => f.alive && f.side !== u.side && !f.down && dist(f, u) < 4.5);",
    "u.ammo < u.ammoMax * ((INV(W).lowAmmo != null ? INV(W).lowAmmo : 0.2)) && !W.units.some(f => f.alive && f.side !== u.side && !f.down && (dist(f, u) < 4.5 || (f.act && f.act.b === u.i && f.act.phase === 'wind')));")

# 마지막 순간 추적은 '밀려난 만큼' — 상대가 일부러 피하는 중 (흘려 빠지기 · 물러나기 · 스텝 · 도약 · 예고 비킴) 이면 따라가지 않음 (청광묵 흘려 빠지기가 반으로 줄던 것 · 양쪽 같음)
rep("const A = u.act, TR = (W.rules.track || {}).d != null ? W.rules.track.d : 0.6, need = gap(u, tt) - u.rng; if (need > 0.02 && A.end - W.t > 0.15 && (A.trk || 0) < TR && !u.kb){",
    "const A = u.act, TR = (W.rules.track || {}).d != null ? W.rules.track.d : 0.6, need = gap(u, tt) - u.rng, evd = (tt.mv && tt.mv.ev && W.t < tt.mv.until) || (tt.dodgeHold && tt.dodgeHold.a === u.i && W.t < tt.dodgeHold.until) || (tt.flee && W.t < tt.flee.until) || W.t - (tt.dodgedT || -9) < 0.5 || (tt.act && (tt.act.k === 'leap' || tt.act.k === 'dodge')); if (need > 0.02 && A.end - W.t > 0.15 && (A.trk || 0) < TR && !u.kb && !evd){   /* v8.7.3 피하는 상대는 쫓지 않음 */")

# 넉백 무게: 한도 (cap) 도 받는 몸무게로 (가벼운 몸은 더 멀리 · 무거운 몸은 덜 — 140kg 과 40kg 이 같은 휘두르기에 1.26 · 1.28칸이던 것) · 친 것의 무게 (am) — 날아온 것 (산탄 · 흙덩이 · 뿌리) 은 정한 무게 · 던진 무기는 무기 무게 · 날아와 부딪힌 몸은 그 몸 무게 (처음 친 이의 무게가 아님)
rep("shove: { exp: 0.6, min: 0.12, cap: 1.6, vel: 7, crush: 0.9, wall: 1.2, crushProne: 1.6, downLen: 0.9, prone: 0.9, bowl: 0.15 },",
    "shove: { exp: 0.6, min: 0.12, cap: 1.6, capRef: 80, capExp: 0.35, capLo: 0.6, capHi: 1.5, proj: 80, thrown: 0.12, vel: 7, crush: 0.9, wall: 1.2, crushProne: 1.6, downLen: 0.9, prone: 0.9, bowl: 0.15 },   /* v8.7.3 한도 = cap × (capRef ÷ 받는 무게)^capExp (capLo ~ capHi 배) · 날아온 것 (산탄 · 흙덩이 · 뿌리) 의 무게 proj kg · 던진 무기 = 던진 이 무게 × thrown (5 ~ 150kg) */")
rep("function kbLen(W, a, t, power){ const S = W.rules.shove || {}; return Math.min(power * (S.cap || 1.6), power * Math.max(S.min || 0.12, Math.pow(a.mass / Math.max(30, t.mass * (t.poise || 1)), S.exp || 0.6))) / (t.line ? 1 + 0.25 * Math.min(4, t.line.n - 1) : 1); }",
    "function kbLen(W, a, t, power, am){ const S = W.rules.shove || {}, tm = t.mass * (t.poise || 1), cap = (S.cap || 1.6) * Math.max(S.capLo || 0.6, Math.min(S.capHi || 1.5, Math.pow((S.capRef || 80) / Math.max(5, tm), S.capExp != null ? S.capExp : 0.35))); return Math.min(power * cap, power * Math.max(S.min || 0.12, Math.pow((am != null ? am : a.mass) / Math.max(30, tm), S.exp || 0.6))) / (t.line ? 1 + 0.25 * Math.min(4, t.line.n - 1) : 1); }   /* v8.7.3 한도도 받는 무게로 · am = 친 것의 무게 */\n// v8.7.3 던진 무기의 무게 (던진 이의 몸무게가 아님 — 호레이쇼 1100kg 이 아니라 대장군의 도끼)\nconst thrownMass = (W, u) => Math.max(5, Math.min(150, (u ? u.mass || 62 : 62) * ((W.rules.shove || {}).thrown || 0.12)));")
rep("let len = kbLen(W, a, t, power) * (t.crawl", "let len = kbLen(W, a, t, power, o && o.mass) * (t.crawl")
rep("L(W, { k: 'shove', a: a.i, b: t.i, len: +len.toFixed(2), how: (o && o.how) || '', arm: !!a.armShield, vis: a.side === 0 || t.side === 0 || !!a.seenBy || !!t.seenBy });",
    "L(W, { k: 'shove', a: a.i, b: t.i, len: +len.toFixed(2), how: (o && o.how) || '', arm: !!a.armShield, ...(o && o.mass != null ? { am: Math.round(o.mass) } : {}), ...(o && o.tag ? { tag: o.tag } : {}), ...(o && o.via != null ? { via: o.via } : {}), ...(o && o.wn ? { wn: o.wn } : {}), ...(o && o.fix ? { fix: true } : {}), vis: a.side === 0 || t.side === 0 || !!a.seenBy || !!t.seenBy });   /* v8.7.3 친 것의 무게 · 무엇에 밀렸나 */")
rep("shove(W, a, e, K.p * 0.4, K.dx, K.dy, { how: 'bowl', depth: 1 })", "shove(W, a, e, K.p * 0.4, K.dx, K.dy, { how: 'bowl', depth: 1, mass: u.mass, via: u.i })")
rep("shove(W, by, e, S.kb, S.dx, S.dy, { tag: '도끼에 쓸려 나감' })", "shove(W, by, e, S.kb, S.dx, S.dy, { tag: '도끼에 쓸려 나감', mass: thrownMass(W, by), wn: S.it && (S.it.label || S.it.name) })")
rep("shove(W, u, hit, NW.kb || 1, s.dx, s.dy, { tag: '샷건에 날아감' })", "shove(W, u, hit, NW.kb || 1, s.dx, s.dy, { tag: '샷건에 날아감', mass: (W.rules.shove || {}).proj || 80, fix: true })")
rep("shove(W, u, t, (S.kb || 1) * (o.block ? 0.5 : 1), t.x - u.x, t.y - u.y, { tag: '샷건에 날아감' })", "shove(W, u, t, (S.kb || 1) * (o.block ? 0.5 : 1), t.x - u.x, t.y - u.y, { tag: '샷건에 날아감', mass: (W.rules.shove || {}).proj || 80, fix: true })")
rep("{ tag: o.far ? '흙덩이에 밀림' : '철퇴에 밀림' }", "o.far ? { tag: '흙덩이에 밀림', mass: (W.rules.shove || {}).proj || 80, fix: true } : { tag: '철퇴에 밀림' }")
rep("shove(W, u, e, S.kb || 0.8, sx, sy, { tag: '뿌리에 밀려남' })", "shove(W, u, e, S.kb || 0.8, sx, sy, { tag: '뿌리에 밀려남', mass: (W.rules.shove || {}).proj || 80, fix: true })")

# 공중제비 내려찍기: 태세 (setFor) 면 막힘 (앞에서 처리) · 아니면 받아 내지 못함 — 손이 묶였거나 · 치는 중이거나 · 못 본 몸이 무구로 ×0.5 받아 내고도 그대로 죽던 것 ('막아도 즉사')
rep("const o = strike(W, u, e, e, 1, false, { mul: F.mul || 2.3, heavyCrit: F.crit || 0.25, tag: '공중제비 내려찍기' }); n++;",
    "const o = strike(W, u, e, e, 1, false, { mul: F.mul || 2.3, heavyCrit: F.crit || 0.25, tag: '공중제비 내려찍기', grab: true }); n++;   /* v8.7.3 태세가 아니면 받아 내지 못함 */")

# 돌격 버팀: 받쳐 준 동료 (braceOf 가 무게를 더한 몸) 는 날아온 몸을 받아 줌 — 부딪혀 둘 다 다치거나 · 넘어지거나 · 줄줄이 밀리지 않음 (함께 조금 밀림)
rep("  let m = 0;\n  for (const o of W.units){\n    if (!o.alive || o === t || o.side !== t.side || o.kb || prone(W, o)) continue;",
    "  let m = 0; const ids = [];   /* v8.7.3 받쳐 준 몸 */\n  for (const o of W.units){\n    if (!o.alive || o === t || o.side !== t.side || o.kb || prone(W, o)) continue;")
rep("    m += o.mass * (C.brace != null ? C.brace : 0.6);\n  }", "    m += o.mass * (C.brace != null ? C.brace : 0.6); ids.push(o.i);\n  }")
rep("if (o && o.alive && dist(o, t) > 1.3) m += o.mass * w; else if (o && o.alive) m += o.mass * w * 0.5; } }",
    "if (o && o.alive && dist(o, t) > 1.3){ m += o.mass * w; ids.push(o.i); } else if (o && o.alive){ m += o.mass * w * 0.5; ids.push(o.i); } } }")
rep("  return { mass: (t.mass + m) * (trained ? C.trained || 1.6 : 1), trained, mates: m > 0, line: !!t.line };",
    "  return { mass: (t.mass + m) * (trained ? C.trained || 1.6 : 1), trained, mates: m > 0, line: !!t.line, ids };")
rep("if (hit.alive && vB2 > 0.2) fling(W, u, hit, vB2 * KB * shK, nx, ny, { how: hc ? 'clash' : 'charge', v: vB2 });",
    "if (hit.alive && vB2 > 0.2) fling(W, u, hit, vB2 * KB * shK, nx, ny, { how: hc ? 'clash' : 'charge', v: vB2, brace: br.ids || [] });   /* v8.7.3 받쳐 준 몸은 받아 줌 */")
rep("    K.hit.push(e.i);\n    const c = a.atk * (W.rules.lethal || 1) * (S.bowl || 0.15);",
    "    K.hit.push(e.i);\n    if (K.o.brace && K.o.brace.includes(e.i) && e.side === u.side && !prone(W, e)){ const nb = Math.min(0.3, K.left * 0.5); if (nb > 0.02) tryMove(W, e, e.x + K.dx * nb, e.y + K.dy * nb); u.kb = null; L(W, { k: 'caught', a: e.i, b: u.i, vis: u.side === 0 || e.side === 0 || !!u.seenBy || !!e.seenBy }); return; }   /* v8.7.3 받쳐 준 동료가 받아 줌 — 부딪혀 다치지 않고 넘어지지 않음 (함께 조금 밀림) */\n    const c = a.atk * (W.rules.lethal || 1) * (S.bowl || 0.15);")

# 버팀을 하나로: (1) 세자르 같은 버팀 (poise) 은 돌격 충돌의 무게에도 · (2) [버팀] ccRes 는 밀침뿐 아니라 돌격 · 튕김 · 팜 버스트로 날아갈 때도 덜 날아감 · (3) 괴력으로 버티면 (resist · brace) 그 일격에 휘청 · 넘어짐이 없고 기록은 '버텨 밀려남' · (4) 돌격한 쪽의 괴력 (ram) 은 되튕김을 실제로 막을 수 있을 때만 씀
rep("  return { mass: (t.mass + m) * (trained ? C.trained || 1.6 : 1), trained, mates: m > 0, line: !!t.line, ids };",
    "  return { mass: (t.mass * (t.poise || 1) + m) * (trained ? C.trained || 1.6 : 1), trained, mates: m > 0, line: !!t.line, ids };   /* v8.7.3 버팀 (poise) 도 돌격에 걸림 */")
rep("const br = hc ? { mass: hit.mass, trained: false, mates: false } : braceOf(W, hit, u, nx, ny)",
    "const br = hc ? { mass: hit.mass * (hit.poise || 1), trained: false, mates: false } : braceOf(W, hit, u, nx, ny)")
rep("let len = kbLen(W, a, t, power, o && o.mass) * (t.crawl", "let mt = false, len = kbLen(W, a, t, power, o && o.mass) * (t.crawl")
rep("    if (a && t.side !== a.side && len >= (M.min || 0.5) && mightReady(W, t)) len /= mightUse(W, t, 'resist', a);",
    "    if (a && t.side !== a.side && len >= (M.min || 0.5) && mightReady(W, t)){ len /= mightUse(W, t, 'resist', a); mt = true; }   /* v8.7.3 버팀 → 휘청 · 넘어짐 없음 */")
rep("  return fling(W, a, t, len, dx, dy, { ...(o || {}), p: power });",
    "  return fling(W, a, t, len, dx, dy, { ...(o || {}), p: power, ccDone: true, ...(mt ? { mt: true } : {}) });")
rep("function fling(W, a, t, len, dx, dy, o){\n  if (!t.alive || t.kb || !(len > 0)) return null;",
    "function fling(W, a, t, len, dx, dy, o){\n  if (!t.alive || t.kb || !(len > 0)) return null;\n  if (t.ccRes && !(o && o.ccDone)) len *= 1 - t.ccRes * ((W.rules.cc || {}).shove != null ? W.rules.cc.shove : 0.6);   /* v8.7.3 [버팀] 은 돌격 · 튕김 · 팜 버스트에도 (밀침은 shove 에서 이미) */")
rep("...(o && o.fix ? { fix: true } : {}), vis:", "...(o && o.fix ? { fix: true } : {}), ...(o && o.mt ? { mt: true } : {}), vis:")
rep("  if (K.left <= 0.01){ u.kb = null; if (W.rand() < downOdds(W, u, K)){", "  if (K.left <= 0.01){ u.kb = null; if (!K.o.mt && W.rand() < downOdds(W, u, K)){")
rep("let mA = u.mass, mB = br.mass;", "let mA = u.mass, mB = br.mass, mtB = false;")
rep("mB *= mightUse(W, hit, hc ? 'ram' : 'brace', u);", "{ mB *= mightUse(W, hit, hc ? 'ram' : 'brace', u); mtB = true; }")
rep("else if (hit.side !== u.side && vA - (1 + e) * mB / (mA + mB) * vr < -0.2 && mightReady(W, u)) mA *= mightUse(W, u, 'ram', hit); }",
    "else if (hit.side !== u.side && vA - (1 + e) * mB / (mA + mB) * vr < -0.2 && mightReady(W, u) && vA - (1 + e) * mB / (mA * (u.might || 1) + mB) * vr >= -0.2) mA *= mightUse(W, u, 'ram', hit); }   /* v8.7.3 막을 수 있을 때만 */")
rep("    if (!blocked && hit.alive && !pushOnly) stun(W, hit,", "    if (!blocked && hit.alive && !pushOnly && !mtB) stun(W, hit,")
rep("fling(W, u, hit, vB2 * KB * shK, nx, ny, { how: hc ? 'clash' : 'charge', v: vB2, brace: br.ids || [] });",
    "fling(W, u, hit, vB2 * KB * shK, nx, ny, { how: hc ? 'clash' : 'charge', v: vB2, brace: br.ids || [], ...(mtB ? { mt: true } : {}) });")
rep("braced: !!(br.trained || br.mates), trained: !!br.trained,", "braced: !!(br.trained || br.mates), trained: !!br.trained, mt: mtB,")

# 미리 비켜서기 (밀치기 · 넓게 휘두르기): 비켜설 자리가 그 일격 밖일 때만 — 0.6칸 비켜서도 휘두르는 범위 안이면 비키지 않음 (막거나 맞음). '피함' 이라 적고 같은 일격에 맞던 것 (양쪽 같음 · 스텝은 그대로 — 늦으면 맞는 심리전)
rep("function tryDodge(W, u, stepOnly){",
    "// v8.7.3 비켜설 자리 (x, y) 가 그 일격 밖인가 — 밀치기 · 보통 일격은 닿는 거리 밖 · 넓게 휘두르기는 닿는 거리 밖이거나 (노린 몸이 아니면) 부채꼴 밖\nfunction outOfSwing(W, atk, u, x, y){\n  const a = atk.act, SW = W.rules.sweep || {}, d = Math.hypot(x - atk.x, y - atk.y), g = d - atk.r - u.r, R = a.k === 'bash' ? 0.35 + W.rules.reach : a.mode === 'sweep' ? atk.rng + (SW.reach || 0.35) : atk.rng + W.rules.reach;\n  if (g > R + 0.05) return true;\n  if (a.mode !== 'sweep' || a.b === u.i) return false;   // 노린 몸은 휘두르는 쪽이 따라 돎 — 거리로만\n  const b = W.units[a.b]; if (!b) return false;\n  return angDiff(Math.atan2(y - atk.y, x - atk.x), Math.atan2(b.y - atk.y, b.x - atk.x)) > (SW.arc || 65) * Math.PI / 180 + Math.atan2(u.r, Math.max(0.3, d)) + 0.08;\n}\nfunction tryDodge(W, u, stepOnly){")
rep("    if (W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r * 0.8)) continue;\n    u.act = { k: 'dodge', phase: 'run',",
    "    if (W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r * 0.8)) continue;\n    if (!stepK && !chargeK && !outOfSwing(W, atk, u, x, y)) continue;   /* v8.7.3 비켜서도 그 일격 안이면 비키지 않음 */\n    u.act = { k: 'dodge', phase: 'run',")

# 기습 (알아차리지 못함 ×3): 그 공격자를 ambushKnow 초 안에 보거나 들어 알았으면 아님 — 공격 동작 · 앞의 적에 묶여 등 뒤를 못 봐도 '있는 줄 아는' 상대는 뒤치기 ×1.5 만 (양쪽 같음 · 몰래 다가온 이는 그대로 기습)
rep("  ambushMul: 3,       // 암살 (알아차리지 못한 옆 · 뒤에 들어간 근접 공격) 피해 ×",
    "  ambushMul: 3,       // 암살 (알아차리지 못한 옆 · 뒤에 들어간 근접 공격) 피해 ×\n  ambushKnow: 10,     // v8.7.3 이만큼 (초) 안에 그 공격자를 보거나 들어 알았으면 묶여 있어도 '알아차리지 못함' 이 아님 (뒤치기만)")
rep("&& !aware(W, t, u);   // 날붙이 판정이면 맨손 · 발톱이어도 암살",
    "&& !aware(W, t, u) && !fresh(W, t.sense[u.i], R.ambushKnow != null ? R.ambushKnow : 10);   // 날붙이 판정이면 맨손 · 발톱이어도 암살   /* v8.7.3 알고 있던 상대면 기습 아님 */")

# 하나뿐인 창: 곁의 위협에 던질 대상 자신도 넣음 — 코앞의 상대에게 창을 던지고 맨손이 되지 않음 (끝낼 수 있으면 던짐 · 양쪽 같은 규칙이나 이 판단은 적 창병)
rep("const near = W.units.find(x => x.alive && x !== f && x.side !== u.side && !isFar(x) && !x.down && gap(u, x) < x.rng + 1.2), press = busyW(W, u), hurt = u.hp / u.max < 0.4;",
    "const near = W.units.find(x => x.alive && x.side !== u.side && !isFar(x) && !x.down && gap(u, x) < x.rng + 1.2), press = busyW(W, u), hurt = u.hp / u.max < 0.4;   /* v8.7.3 던질 대상 자신이 코앞이어도 아낌 */")
rep("why: near ? (near.name + (jongE(near.name) ? '이' : '가') + ' 곁에 있음 — 가까운 위협 먼저') :",
    "why: near === f ? '코앞이라 창을 쥐고 맞섬' : near ? (near.name + (jongE(near.name) ? '이' : '가') + ' 곁에 있음 — 가까운 위협 먼저') :")

# 이어진 휘청 · 넘어짐 (양쪽 같음): 휘청 · 넘어짐이 풀린 지 chainGap 초 안에 또 걸리면 1 − chainDr × n 배 (1 → 0.6 → 0.2 → 버팀) — 여럿이 번갈아 묶어 한 번도 못 치게 하던 것
rep("cc: { shove: 0.6, fxGap: 0.6 }", "cc: { shove: 0.6, fxGap: 0.6, chainGap: 0.8, chainDr: 0.4 }")
rep("function ccShrug(W, u, by, what){",
    "// v8.7.3 이어진 휘청 · 넘어짐: 풀린 지 chainGap 초 안 (또는 아직 묶인 채) 에 또 걸리면 짧아짐 — 돌려주는 배수 (0 에 가까우면 버팀)\nfunction ccChain(W, u){ const C = W.rules.cc || {}, end0 = Math.max(u.stunT || -9, u.proneT || -9), n = W.t <= end0 + (C.chainGap != null ? C.chainGap : 0.8) ? (u.ccN || 0) + 1 : 0; u.ccN = n; return Math.max(0, 1 - (C.chainDr != null ? C.chainDr : 0.4) * n); }\nfunction ccShrug(W, u, by, what){")
rep("  if (u.ccRes && W.rand() < u.ccRes){ ccShrug(W, u, by, 'stun'); return 0; }   /* v7.29.0 버팀 (세자르 — 휘청도 거의 안 걸림) */",
    "  if (u.ccRes && W.rand() < u.ccRes){ ccShrug(W, u, by, 'stun'); return 0; }   /* v7.29.0 버팀 (세자르 — 휘청도 거의 안 걸림) */\n  { const dr = ccChain(W, u); if (dr <= 0.05){ ccShrug(W, u, by, 'chain'); return 0; } sec *= dr; }   /* v8.7.3 이어진 휘청은 짧아짐 */")
rep("  if (u.ccRes && W.rand() < u.ccRes){ ccShrug(W, u, by, 'prone'); return; }   /* v7.29.0 버팀 (세자르 — 잘 넘어지지 않음) */\n  const s = sec * (mbOn(W, u) ? mbF(W, u, 'pin') : 1) * (u.vet ? VETR(W).pin : 1);",
    "  if (u.ccRes && W.rand() < u.ccRes){ ccShrug(W, u, by, 'prone'); return; }   /* v7.29.0 버팀 (세자르 — 잘 넘어지지 않음) */\n  const dr = ccChain(W, u); if (dr <= 0.05){ ccShrug(W, u, by, 'chain'); return; }   /* v8.7.3 이어진 넘어짐은 짧아짐 */\n  const s = sec * dr * (mbOn(W, u) ? mbF(W, u, 'pin') : 1) * (u.vet ? VETR(W).pin : 1);")

# 사수: 지금 표적에 각이 없으면 다른 표적의 각 (자리 찾기를 spotFor 로 떼어 내 다른 표적에도 씀) · 옮긴 표적은 4초 그대로 (막힌 표적으로 되돌아가 헤매지 않게) — 공격 명령 · 바로 쏴는 그대로 그 표적 (양쪽 같음)
_a0 = "function reposition(W, u, t, dt, mood, mb){\n  if (mb == null) mb = t.i;\n  const careful = mood === '각 잡기' || mood === '막힘';\n  if (!u.spot || u.spot.dark || W.t - u.spot.t > 0.5 || u.spot.b !== t.i){\n"
_a1 = "    u.spot = { t: W.t, b: t.i, p: best };\n  }\n  const p = u.spot.p;"
_T = P['tail']; assert _T.count(_a0) == 1 and _T.count(_a1) == 1
_i0 = _T.find(_a0); _i1 = _T.find(_a1); assert 0 <= _i0 < _i1
_body = _T[_i0 + len(_a0):_i1]
P['tail'] = (_T[:_i0] + "// v8.7.3 사격 자리 찾기 (reposition 에서 떼어 냄 — 다른 표적의 각도 찾음): 사선이 열리고 · 사거리 안 · 오사가 기준 아래 · 근접 상대 손 밖인 자리 중 가장 나은 곳 (없으면 null)\nfunction spotFor(W, u, t, mood){\n" + _body + "    return best;\n}\n"
    + "function reposition(W, u, t, dt, mood, mb){\n  if (mb == null) mb = t.i;\n  const careful = mood === '각 잡기' || mood === '막힘';\n  if (!u.spot || u.spot.dark || W.t - u.spot.t > 0.5 || u.spot.b !== t.i) u.spot = { t: W.t, b: t.i, p: spotFor(W, u, t, mood) };\n  const p = u.spot.p;" + _T[_i1 + len(_a1):])
rep("  reposition(W, u, t, dt, '각 잡기', b ? b.i : t.i);\n}\n",
    "  reposition(W, u, t, dt, '각 잡기', b ? b.i : t.i);\n  if (!ordered && !(u.spot && u.spot.p) && (u.ffWait || 0) > 1.2 && W.t >= (u.altSpotT || -9)){   /* v8.7.3 이 표적엔 각이 없음 → 가까운 다른 표적의 각 */\n    u.altSpotT = W.t + 0.5; const know = knows(W, u);\n    for (const f of W.units.filter(f => f.alive && f !== t && f.side !== u.side && !f.down && (know(f) || fresh(W, u.sense[f.i], 2) || (u.side === 0 && !!f.seenBy)) && dist(u, f) < u.rng + u.r + f.r + 3 && !(u.side === 0 && roeBlock(W, u, f, 'fire'))).sort((x, y) => dist(u, x) - dist(u, y)).slice(0, 4)){\n      const p = spotFor(W, u, f, '각 잡기'); if (!p) continue;\n      u.target = f; u.altLock = { b: f.i, until: W.t + 4 }; u.altGo = { b: f.i, x: p.x, y: p.y, until: W.t + 4 }; u.spot = { t: W.t, b: f.i, p }; u.ffWait = 0; u.waitT = 0; setMood(W, u, '다른 표적 각 잡기', f.i); L(W, { k: 'altAim', a: u.i, b: f.i, was: t.i, vis: u.side === 0 || !!u.seenBy }); goTo(W, u, p.x, p.y, dt); break; }\n  }\n}\n")
rep("function blockedShot(W, u, t, dt, ordered, b){\n  if (!ordered && angleFirst(W, u, t, dt)) return;",
    "function blockedShot(W, u, t, dt, ordered, b){\n  if (!ordered && u.altGo && W.t < u.altGo.until){ const f = W.units[u.altGo.b]; if (f && f.alive && !canSee(W, u, f) && Math.hypot(u.altGo.x - u.x, u.altGo.y - u.y) > 0.15){ setMood(W, u, '다른 표적 각 잡기', f.i); goTo(W, u, u.altGo.x, u.altGo.y, dt); return; } u.altGo = null; }   /* v8.7.3 고른 다른 표적의 자리까지는 걸어감 (보이면 거기서 쏨) */\n  if (!ordered && angleFirst(W, u, t, dt)) return;")
rep("    if (u.target !== pick) u.waitT = 0; u.state = 'fight'; u.target = pick; return;",
    "    if (u.altLock && W.t < u.altLock.until && u.target && u.target.alive && u.target.i === u.altLock.b && seen.includes(u.target)) pick = u.target;   /* v8.7.3 막힌 표적에서 옮겨 온 표적은 잠시 그대로 */\n    if (u.target !== pick) u.waitT = 0; u.state = 'fight'; u.target = pick; return;")

for n, s in P.items():
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8730 OK')
