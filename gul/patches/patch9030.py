# v9.2.1 엔진 — patch9030.py v1.0 (v1.0: 2층 대규모 업데이트 3단계 (나) — 망자 보조 (밀치는 주먹 · 점점 빨라짐) · 초대형을 지속 돌격으로 넘어뜨리기 · 반 · 테리 (거인 기술표) · 흑익 · 하류 (보스 기술표) · 헌팅나이프 암습 · 무기뺏기 · 카밀라 방탄복 · 생존자 · 레이더)
import subprocess, json, os
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9020.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# 수치표
rep("  shSz: { 소형: 0.8,", "  giantFall: { n: 4, win: 12, down: 8 },   /* v9.2.1 초대형: 지속적으로 돌격하면 (win 초 안에 n 번 들이받으면) 넘어짐 — 일어나는 데 down 초 */\n  shSz: { 소형: 0.8,")
rep("    '방탄': { slot: '몸', w: 0.01,", "    '방탄복': { slot: '몸', w: 0.012, vs: { '날붙이': 0.6, '둔기': 1, '짐승': 0.7, '활': 0.6, '총포류': 0.5, '마법': 1, '맨손': 0.85 } },   // v9.2.1 카밀라의 방탄복 (투구 없음) — 갑피와 비슷하나 둔기에 약하고 방탄 · 날붙이에 강함\n    '방탄': { slot: '몸', w: 0.01,")
rep("    pthrow: { rng: 12, min: 3,", "    hamb: { dmin: 2.2, dmax: 9, mul: 2.1, crit: 0.5, wind: 0.3, rec: 0.5, cd: 9 }, hdisarm: { rng: 1.6, p: 0.65, wind: 0.35, rec: 0.5, cd: 12 },   /* v9.2.1 헌팅나이프: 암습 · 무기뺏기 */\n    pthrow: { rng: 12, min: 3,")
rep("'은빛 비행': 'tflight',", "'은빛 비행': 'tflight', '암습': 'hamb', '무기뺏기': 'hdisarm',")
rep("'bfield', 'bshove', 'bmend', 'braise', 'bcut', 'brain'];", "'bfield', 'bshove', 'bmend', 'braise', 'bcut', 'brain', 'hamb', 'hdisarm'];")
rep("const SUP_FOE = ['mvolley', 'cstar', 'clure', 'bshove'];", "const SUP_FOE = ['mvolley', 'cstar', 'clure', 'bshove', 'hamb', 'hdisarm'];")
# 몸: 주먹의 밀침 · 점점 빨라짐
rep("      shSize: sh ? (p.shSize || '중형') : null,", "      hitKb: +p.hitKb || 0, ramp: p.ramp || null, shSize: sh ? (p.shSize || '중형') : null,")
rep("if (u.cz) czHit(W, u, t, so); if (u.cleave) prnCleave(W, u, wr || t);", "if (u.cz) czHit(W, u, t, so); if (u.hitKb && so && !so.block && !so.wall && t.alive && !t.kb) shove(W, u, t, u.hitKb, t.x - u.x, t.y - u.y, { tag: '강한 일격에 밀림', noDown: true }); if (u.cleave) prnCleave(W, u, wr || t);")
# 초대형: 지속 돌격에 넘어짐
rep("    let setBroke = false;\n    if (!hc && setFor(W, hit, u)){", "    if (hit.alive && hit.side !== u.side && (SIZE_RANK[sizeOf(hit)] || 0) >= SIZE_RANK['초대형']) giantChg(W, u, hit);   /* v9.2.1 초대형은 지속 돌격에 넘어짐 (태세로 받아도 셈) */\n    let setBroke = false;\n    if (!hc && setFor(W, hit, u)){")
rep("function sfEnd(W, F){", r'''function giantChg(W, u, g){
  const G = W.rules.giantFall || { n: 4, win: 12, down: 8 }; g.cgHits = (g.cgHits || []).filter(t => W.t - t < G.win); g.cgHits.push(W.t);
  if (g.cgHits.length >= G.n && W.t >= (g.proneT || -9)){ g.cgHits = []; const dn = G.down;
    g.saT = -9; g.ccRes = 0; g.act = null; g.burst = null; stop(g); g.proneT = W.t + dn; g.giantDown = W.t + dn; flailDrop(W, g, '넘어짐');
    L(W, { k: 'giantFall', a: u.i, b: g.i, sec: dn, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: g.x, y: g.y, s: '거인이 넘어짐!', c: 'd', t0: W.t }); }
  else if (W.fxOn) W.fx.push({ k: 'num', x: g.x, y: g.y - 0.8, s: '돌격 ' + g.cgHits.length + ' / ' + G.n, c: 'b', t0: W.t });
}
// 점점 빨라지는 몸 (기형 망자): 싸움이 붙은 때부터 from → to (초당 칸) 까지 t 초에 걸쳐
function rampTick(W){
  for (const u of W.units){ if (!u.ramp || !u.alive) continue; const R = u.ramp;
    if (u.rampT0 == null){ if (u.state === 'hunt' || u.state === 'fight' || u.state === 'search') u.rampT0 = W.t; u.spd = R.from; continue; }
    const k = Math.min(1, (W.t - u.rampT0) / (R.t || 25)); u.spd = +(R.from + (R.to - R.from) * k).toFixed(3); }
}
function sfEnd(W, F){''')
rep("  bfTick(W);   /* v9.2.0 장송기사가 살린 몸 */", "  bfTick(W); rampTick(W); radarTick(W);   /* v9.2.0 장송기사가 살린 몸 · v9.2.1 점점 빨라짐 · 레이더 */")
# 레이더 (카밀라): 전 거리에서 적의 점을 앎 (기척)
rep("function sfEnd(W, F){", r'''function radarTick(W){
  if (W.t < (W.radarT || 0)) return; W.radarT = W.t + 0.5;
  for (const u of W.units){ if (!u.alive || u.gone || !u.radar) continue;
    for (const f of W.units){ if (!f.alive || f.gone || f.side === u.side || f.summon === 'slime') continue; const s = u.sense[f.i]; if (s && W.t - s.t < 0.6 && s.sight) continue; u.sense[f.i] = { x: f.x, y: f.y, t: W.t, exact: false, radar: true }; } }
}
function sfEnd(W, F){''')
rep("      hitKb: +p.hitKb || 0, ramp: p.ramp || null,", "      hitKb: +p.hitKb || 0, ramp: p.ramp || null, radar: (p.traits || []).includes('레이더'), survivor: (p.traits || []).includes('생존자'),")
# ---- h2: 새 모양 (stomp · grab · behind) · 장판의 으깸 · 지축 울림 · 마법 탄
rep("    : { sh: 'fan', x: u.x, y: u.y, ang, r: s.r, arc: s.arc };\n  const wind = s.wind != null ? s.wind : 0.5;", "    : s.type === 'stomp' ? { sh: 'circ', x: u.x, y: u.y, r: s.r }\n    : s.type === 'grab' ? { sh: 'fan', x: u.x, y: u.y, ang, r: s.r, arc: s.arc || 1.6 }\n    : { sh: 'fan', x: u.x, y: u.y, ang, r: s.r, arc: s.arc };\n  const wind = s.wind != null ? s.wind : 0.5;")
rep("  if (s.type === 'backstep'){   // 3D: 상대에게서 len 물러남", """  if (s.type === 'behind'){   /* v9.2.1 어둠 속 이동: 상대 등 뒤로 (막힌 데면 옆) */
    const fa = t.face != null ? t.face : Math.atan2(t.y - u.y, t.x - u.x); let ok = false;
    for (const da of [Math.PI, Math.PI - 0.7, Math.PI + 0.7, Math.PI / 2, -Math.PI / 2]){ const bx = t.x + Math.cos(fa + da) * (t.r + u.r + 0.15), by = t.y + Math.sin(fa + da) * (t.r + u.r + 0.15);
      if (!boxRock(W, bx, by, u.r * 0.9) && !W.units.some(o => o.alive && o !== u && o !== t && Math.hypot(o.x - bx, o.y - by) < o.r + u.r * 0.8)){ h2Ghost(W, u, bx, by); ok = true; break; } }
    u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x);
    u.act = { k: 'h2', s: s.id, n: s.n, type: s.type, b: t.i, phase: 'rec', t0: W.t, end: W.t + (s.rec || 0.2), via, cmb };
    L(W, { k: 'h2Step', a: u.i, b: t.i, n: s.n, d: 0, vis }); return true; }
  if (s.type === 'backstep'){   // 3D: 상대에게서 len 물러남""")
rep("    Z.push({ by: u.i, side: u.side, x, y, r: s.r, t0: W.t, at: W.t + (s.delay || 1), mul: s.mul, n: s.n, stun: s.stun || 0, wk: s.wk || null, tag: s.tag || null, up: !!s.up, trap: s.type === 'trap' });", "    Z.push({ by: u.i, side: u.side, x, y, r: s.r, t0: W.t, at: W.t + (s.delay || 1), mul: s.mul, n: s.n, stun: s.stun || 0, wk: s.wk || null, tag: s.tag || null, up: !!s.up, trap: s.type === 'trap', crush: s.crush || null, quake: s.quake || null });")
rep("    for (const e of hit){ strike(W, by, e, e, 1, false, { mul: Z.mul, tag: Z.tag || Z.n, wk: Z.wk || '마법', arc: !Z.up, rain: !Z.up }); if (e.alive && Z.stun) stun(W, e, Z.stun, by.i); }", """    for (const e of hit){ const o = strike(W, by, e, e, 1, false, { mul: Z.mul, tag: Z.tag || Z.n, wk: Z.wk || '마법', arc: !Z.up, rain: !Z.up }); if (e.alive && Z.stun) stun(W, e, Z.stun, by.i);
      if (e.alive && Z.crush && !(o && o.block)){ const pc = Z.crush[sizeOf(e)] || 0; if (pc && W.rand() < pc){ applyDmg(W, by, e, Math.max(1, Math.ceil(e.hp)) + 1, { far: false, part: '몸통', tag: '찌부러짐', death: 'squash' }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y, s: '찌부러짐!', c: 'd', t0: W.t }); } } }
    if (Z.quake){ const Qk = Z.quake; let qn = 0;   /* 지축 울림: 땅의 중대형까지 잠깐 뜸 · 행동 끊김 · 확률로 넘어짐 */
      for (const e of W.units){ if (!e.alive || e.gone || e.side === Z.side || e.down || airOf(e) || (e.act && e.act.k === 'leap') || e.giant || (SIZE_RANK[sizeOf(e)] || 0) > SIZE_RANK['중대형'] || Math.hypot(e.x - Z.x, e.y - Z.y) > Z.r + (Qk.extra != null ? Qk.extra : 3)) continue;
        interrupt(W, e, '지축이 울려 준비가 끊김'); stun(W, e, Qk.stun != null ? Qk.stun : 0.8, by.i); qn++; if (e.alive && W.rand() < (Qk.down != null ? Qk.down : 0.35)) knockDown(W, e, 1.4, by.i, '지축 울림'); }
      L(W, { k: 'quake', a: Z.by, n: qn, x: +Z.x.toFixed(1), y: +Z.y.toFixed(1), vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: Z.x, y: Z.y - 1, s: '쿵 —', c: 'd', t0: W.t }); }""")
rep("{ mul: s.mul || 1, tag: A.n, wk: '날붙이' }); out.push(e.i);", "{ mul: s.mul || 1, tag: A.n, wk: s.wk || '날붙이' }); out.push(e.i);")
# resolveH2: 잡아 던지기 · 짓밟기 · 돌진의 밟기
rep("  A.phase = 'rec'; A.end = W.t + h2RecT(A); A.t1 = W.t; u.atkT = W.t;\n  const Z = A.Z, hit = W.units.filter(e => h2Hittable(u, e) && h2In(W, Z, e)), hc = (A.sk || {}).heavyCrit || 0;",
    "  if (A.type === 'grab'){ h2Grab(W, u, A); return; }   /* v9.2.1 잡아 던지기 */\n  A.phase = 'rec'; A.end = W.t + h2RecT(A); A.t1 = W.t; u.atkT = W.t;\n  const Z = A.Z, hit = W.units.filter(e => h2Hittable(u, e) && h2In(W, Z, e)), hc = (A.sk || {}).heavyCrit || 0;")
rep("  L(W, { k: 'h2Hit', a: u.i, s: A.s, n: A.n, hit: hit.map(e => e.i), vis: u.side === 0 || !!u.seenBy || hit.some(e => e.side === 0) });\n  if (W.fxOn) W.fx.push({ k: 'h2Fx',",
    "  { const P1 = A.type === 'stomp' ? (A.sk || {}).p : (A.sk || {}).stompP;   /* v9.2.1 밟기: 중대형까지 확률 즉사 (작을수록 높음) */\n    if (P1) for (const e of hit){ if (!e.alive || e.giant || (SIZE_RANK[sizeOf(e)] || 0) > SIZE_RANK['중대형'] || e.down) continue; const pp = P1 * ((SIZE_RANK[sizeOf(e)] || 0) === 0 ? 1.4 : 1);\n      if (W.rand() < pp){ applyDmg(W, u, e, Math.max(1, Math.ceil(e.hp)) + 1, { far: false, part: '몸통', tag: '짓밟혀 죽음', death: 'squash' }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y, s: '짓밟힘!', c: 'd', t0: W.t }); } } }\n  L(W, { k: 'h2Hit', a: u.i, s: A.s, n: A.n, hit: hit.map(e => e.i), vis: u.side === 0 || !!u.seenBy || hit.some(e => e.side === 0) });\n  if (W.fxOn) W.fx.push({ k: 'h2Fx',")
rep("// v8.7.9 연계의 i 번째 (그때 표적 쪽으로 다시 겨눔) · 다음 것 (표적이 쓰러졌으면 끝)", r'''// v9.2.1 잡아 던지기 (반): 손에 닿는 (대형 아래) 상대를 움켜쥐고 정면으로 내던짐 — 벽에 부딪히면 뭉개지고 · 사이에 낀 몸은 서로 튕김 (밀침의 날아감 규칙)
function h2Grab(W, u, A){
  A.phase = 'rec'; A.end = W.t + 0.9; A.t1 = W.t; u.atkT = W.t; const Z = A.Z, S = A.sk, vis = u.side === 0 || !!u.seenBy;
  const v = W.units.filter(e => h2Hittable(u, e) && h2In(W, Z, e) && !e.giant && (SIZE_RANK[sizeOf(e)] || 0) < SIZE_RANK['대형']).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (!v){ L(W, { k: 'miss', a: u.i, b: A.b, why: '붙잡을 수 있는 상대가 없음', spec: 'h2' }); return; }
  if (evadeMelee(W, v, u)) return;
  strike(W, u, v, v, 1, false, { mul: S.mul || 0.8, tag: '움켜쥠', grab: true });
  if (v.alive){ interrupt(W, v, '움켜쥐여 준비가 끊김'); shove(W, u, v, S.toss || 6.5, Math.cos(Z.ang), Math.sin(Z.ang), { tag: '내던져짐', how: 'bash' }); }
  L(W, { k: 'h2Grab', a: u.i, b: v.i, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: v.x, y: v.y, s: '내던짐!', c: 'd', t0: W.t });
}
// v8.7.9 연계의 i 번째 (그때 표적 쪽으로 다시 겨눔) · 다음 것 (표적이 쓰러졌으면 끝)''')
# ---- 기술표: 반 · 테리 · 흑익 · 하류
rep("const H2KB = 0.5;   // 3D 밀침", r'''/* v9.2.1 반 · 테리 (암계 중간보스 — 8m 초대형 · 전우조) · 흑익 · 하류 (암계 2층 보스 — 전우조). 기본 공격 + 기술 차례대로 (h2) — 도감 메모 + 민수의 명세 (D7 · D10)
   공통 (거인): 밟기 (중대형까지 확률 즉사 — 작을수록 높음) · 돌진은 막을 수 없음 (막으면 피해만 줄고 멀리 튕김 · 확률로 밟아 죽임) · 지속 돌격에 넘어짐 (giantFall) */
H2K.ban = { ml: { n: '광역 베기', range: 7, mul: 1.1, wind: 1.1, cd: 2.2, arc: 2.6, kb: 7 }, stalk: 0.8,
  sk: [{ id: 'smash', n: '찍기', type: 'thrust', cd: 7, use: 9, len: 9, w: 2.2, mul: 2.1, wind: 1.0, kb: 4 },
    { id: 'grab', n: '잡아 던지기', type: 'grab', cd: 14, use: 5, r: 3.4, arc: 2.0, mul: 0.8, toss: 6.5, wind: 0.9 },
    { id: 'stomp', n: '밟기', type: 'stomp', cd: 9, use: 3.4, r: 3.4, mul: 1.5, p: 0.4, trip: true, wind: 0.6 },
    { id: 'rush', n: '돌진', type: 'dash', cd: 12, use: 12, min: 4, len: 11, w: 3.2, mul: 1.4, kb: 9, trip: true, stompP: 0.15, wind: 0.8 }],
  phase: { at: 0.4, k: 1.15, spd: 1.1, say: '(거인이 대검을 고쳐 쥔다)' } };
H2K.teri = { ml: { n: '망치 휘두르기', range: 7.5, mul: 1.2, wind: 1.2, cd: 2.4, arc: 2.4, kb: 7 }, stalk: 0.8,
  sk: [{ id: 'hit', n: '망치 찍기', type: 'zone', cd: 6, use: 8, r: 2.6, delay: 0.9, mul: 2.2, tag: '망치에 맞음', wk: '둔기', crush: { 소형: 0.45, 중형: 0.3, 중대형: 0.12 } },
    { id: 'big', n: '망치 내려찍기', type: 'zone', cd: 16, use: 10, min: 3, r: 4.2, delay: 1.6, mul: 3.2, stun: 1.6, tag: '망치에 으깨짐', wk: '둔기', air: true, crush: { 소형: 0.9, 중형: 0.8, 중대형: 0.55, 대형: 0.2 }, quake: { extra: 3, stun: 0.8, down: 0.35 } },
    { id: 'launch', n: '망치 후리기', type: 'slash', cd: 10, use: 6.5, r: 6.5, arc: 2.0, mul: 1.6, kb: 14, wind: 1.3 },
    { id: 'stomp', n: '밟기', type: 'stomp', cd: 9, use: 3.4, r: 3.4, mul: 1.5, p: 0.4, trip: true, wind: 0.6 },
    { id: 'rush', n: '돌진', type: 'dash', cd: 12, use: 12, min: 4, len: 11, w: 3.2, mul: 1.4, kb: 9, trip: true, stompP: 0.15, wind: 0.8 }],
  phase: { at: 0.4, k: 1.15, spd: 1.1, say: '(거인이 망치를 어깨에서 내린다)' } };
H2K.heugik = { ml: { n: '장검 베기', range: 2.1, mul: 1.0, wind: 0.45, cd: 1.1, arc: 1.6, kb: 1.2 }, stalk: 0.9,
  sk: [{ id: 'jump', n: '도약', type: 'leap', cd: 6, use: 12, min: 4, len: 12, r: 1.8, mul: 0.7, mul2: 1.5, wind: 0.45 },
    { id: 'lunge', n: '찌르기 돌격', type: 'dash', cd: 7, use: 9, min: 2.5, len: 9, w: 1.0, mul: 1.7, wind: 0.3 },
    { id: 'orbs', n: '에너지탄 5연발', type: 'combo', cd: 11, use: 14, min: 4, gap: 0.2, sub: [0, 1, 2, 3, 4].map(i => ({ type: 'shot', len: 15, w: 0.4, mul: 0.5, wind: 0.14, far: true, wk: '마법', pm: 1.2, track: 0.1 })) },
    { id: 'fly', n: '비행 강하', type: 'leap', cd: 13, use: 12, min: 3, len: 12, r: 2.0, mul: 0.7, mul2: 1.9, wind: 0.5, over: true },
    { id: 'sidekick', n: '사이드킥', type: 'dash', cd: 5, use: 4.5, min: 1.2, len: 4.5, w: 1.1, mul: 1.0, kb: 3, wind: 0.22 },
    { id: 'deepkick', n: '딥킥', type: 'dash', cd: 9, use: 6.5, min: 2, len: 7, w: 1.2, mul: 1.6, kb: 5, wind: 0.5 }],
  phase: { at: 0.5, k: 1.15, spd: 1.12, say: '(에너지 날개가 펼쳐진다)' } };
H2K.hareu = { ml: { n: '대검 베기', range: 2.7, mul: 1.3, wind: 0.6, cd: 1.5, arc: 1.8, kb: 2 }, stalk: 0.9,
  sk: [{ id: 'shade', n: '어둠 속 이동 · 원형 베기', type: 'combo', cd: 9, use: 12, min: 3, gap: 0.2, sub: [{ type: 'behind', rec: 0.25 }, { type: 'slash', r: 4.2, arc: 6.3, mul: 1.6, wind: 0.35, kb: 2 }] },
    { id: 'flip', n: '공중제비 · 원형 돌리기', type: 'combo', cd: 8, use: 6, min: 1.5, gap: 0.12, sub: [{ type: 'leap', len: 4.5, r: 1.8, mul: 0.5, mul2: 1.1, wind: 0.25 }, { type: 'slash', r: 3.3, arc: 6.3, mul: 1.0, wind: 0.15 }] },
    { id: 'pierce', n: '잡아뚫기', type: 'thrust', cd: 10, use: 3.4, min: 0.5, len: 3.4, w: 0.9, mul: 2.2, wind: 0.45, kb: 2 },
    { id: 'dash', n: '대검 돌진', type: 'dash', cd: 7, use: 8, min: 3, len: 7, w: 1.1, mul: 1.4, wind: 0.3 }],
  phase: { at: 0.5, k: 1.15, spd: 1.12, say: '(대검이 어둠을 머금는다)' } };
const H2KB = 0.5;   // 3D 밀침''')
rep("module.exports = { wallBetween,", "module.exports = { giantChg, rampTick, radarTick, h2Grab, wallBetween,")
# ---- 헌팅나이프: 암습 · 무기뺏기 (sup 기술)
rep("  if (k === 'bmend'){ const a = A.tp != null", r"""  if (k === 'hamb'){ if (!t || !t.alive || t.down){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    const fa = t.face != null ? t.face : Math.atan2(t.y - u.y, t.x - u.x); let moved = false;
    for (const da of [Math.PI, Math.PI - 0.7, Math.PI + 0.7, Math.PI / 2, -Math.PI / 2]){ const bx = t.x + Math.cos(fa + da) * (t.r + u.r + 0.12), by = t.y + Math.sin(fa + da) * (t.r + u.r + 0.12);
      if (!boxRock(W, bx, by, u.r * 0.9) && !W.units.some(o => o.alive && o !== u && o !== t && Math.hypot(o.x - bx, o.y - by) < o.r + u.r * 0.8)){ h2Ghost(W, u, bx, by); moved = true; break; } }
    u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x); const big = (SIZE_RANK[sizeOf(t)] || 0) > SIZE_RANK['중대형'] || t.giant;
    const o = strike(W, u, t, t, 1, false, { mul: (S.mul || 2.1) * (big ? 0.5 : 1), heavyCrit: big ? 0 : S.crit || 0.5, tag: '암습', grab: true });
    L(W, { k: 'hamb', a: u.i, b: t.i, back: moved, big, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.6, s: '암습!', c: 'd', t0: W.t }); return; }
  if (k === 'hdisarm'){ if (!t || !t.alive || gap(u, t) > (S.rng || 1.6) + 0.4){ L(W, { k: 'miss', a: u.i, b: A.b, why: '손이 닿지 않음', spec: k }); return; }
    if (t.weaponGone || t.noArms || !t.weapon || t.weapon === '맨손' || (SIZE_RANK[sizeOf(t)] || 0) > SIZE_RANK['중대형'] || t.giant){ L(W, { k: 'miss', a: u.i, b: t.i, why: '뺏을 무기가 없음', spec: k }); return; }
    if (evadeMelee(W, t, u)) return; if (W.rand() >= (S.p || 0.65)){ L(W, { k: 'hdisarm', a: u.i, b: t.i, ok: false, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '뺏지 못함', c: 'b', t0: W.t }); return; }
    const nm = t.wName || t.weapon; dropHeld(W, t, 'disarm'); interrupt(W, t, '무기를 뺏겨 준비가 끊김');
    L(W, { k: 'hdisarm', a: u.i, b: t.i, ok: true, w: nm, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '무기를 뺏김!', c: 'd', t0: W.t }); return; }
  if (k === 'bmend'){ const a = A.tp != null""")
rep("  // 은빛 비행: 붙은 근접 적 (다쳤거나 둘 이상 · 나를 치려 함) — 반대쪽 · 동료 쪽으로", """  // v9.2.1 암습: 등을 보이거나 (옆 · 뒤) 동료와 맞붙은 적 (2.2 ~ 9칸) — 중대형 아래를 먼저 · 사수 먼저
  hamb(W, u, S){ const L0 = supFoes(W, u, S.dmax || 9).filter(e => supKnown(W, u, e) && canSee(W, u, e) && dist(u, e) >= (S.dmin || 2.2) && !e.giant && (SIZE_RANK[sizeOf(e)] || 0) <= SIZE_RANK['중대형'] && !e.down);
    if (!L0.length) return false; const sc = e => (isFar(e) ? 8 : 0) + (sideOf(W, e, u) !== 'front' ? 6 : 0) + (W.units.some(a => a.alive && a.side === u.side && a !== u && !isFar(a) && gap(a, e) < a.rng + 0.4) ? 5 : 0) - dist(u, e) * 0.6;
    const t = L0.reduce((a, b) => sc(b) > sc(a) ? b : a); if (sc(t) < 1) return false; return supStart(W, u, 'hamb', t, '등 뒤로'); },
  // v9.2.1 무기뺏기: 손이 닿는 (1.6칸) 무기를 든 중대형 아래 적 — 위협적인 (공격력 큰) 쪽 먼저
  hdisarm(W, u, S){ const L0 = supFoes(W, u, 3).filter(e => !isFar(e) && !e.weaponGone && e.weapon && e.weapon !== '맨손' && !e.giant && (SIZE_RANK[sizeOf(e)] || 0) <= SIZE_RANK['중대형'] && gap(u, e) <= (S.rng || 1.6) && supKnown(W, u, e)); if (!L0.length) return false;
    const t = L0.reduce((a, b) => (b.atk || 0) > (a.atk || 0) ? b : a); return supStart(W, u, 'hdisarm', t, '무기를 노림'); },
  // 은빛 비행: 붙은 근접 적 (다쳤거나 둘 이상 · 나를 치려 함) — 반대쪽 · 동료 쪽으로""")
# 생존자 (카밀라): 회피기동을 더 일찍 · 더 멀리
rep("const close = gap(a, x) < 2.4, shot =", "const close = gap(a, x) < (a.survivor ? 3.1 : 2.4), shot =")
rep("px = a.x + Math.cos(ang) * 2.2, py = a.y + Math.sin(ang) * 2.2;\n      if (px < 0.8", "px = a.x + Math.cos(ang) * (a.survivor ? 3.0 : 2.2), py = a.y + Math.sin(ang) * (a.survivor ? 3.0 : 2.2);\n      if (px < 0.8")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9030 OK')
