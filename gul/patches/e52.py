import sys
def patch(p, pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        c=s.count(o)
        if c!=1: print('MISMATCH',p,c,o[:120]); sys.exit(1)
        s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)

patch('rt3_head.js',[
("/* ===== 전투 엔진 v5.1 —", "/* ===== 전투 엔진 v5.2 —"),
("   v5.1: 방어구 칸 (u.gear", """   v5.2: 몸으로 싸우기 (굴 3D karius.js · maim.js 의 규칙을 판에 맞춰 옮김). 무게 (u.mass, kg — 키 · [거구] · 방어구, 카리우스 300).
         밀침 = 힘 × (무게 비)^0.6 칸 날아감 → 바위에 박히면 짓뭉개짐 (막을 수 없음 · 넘어짐), 처음부터 벽에 붙어 있으면 그 자리에서 짓눌림, 날아가다 부딪히면 둘 다 다침 (볼링).
         넘어짐 (proneT): 못 움직이고 못 막고 못 침, 받는 피해 ×proneHit · 치명 +crit.prone. 치명타 (crit.base) 가 다리에 크게 들어가면 다리 불구 (날붙이 = 절단, 그 밖 = 파괴)
         → 기어다님 (u.crawl: 못 일어남, 속력 ×crawl, 쏠 수는 있고 근접은 못 함). [불사] 는 불구가 되지 않음.
         [거구] = 몸이 방패 (중전차): 역할 전선 · 노출된 동료 앞을 막아섬 · 사선을 가림 (blocksFor). 공격은 셋 — 넓게 휘두르기 (앞 부채꼴, 동료도 맞음, 넉백) ·
         찍기 (한 놈, 무거움, 막아도 자세 크게 깎임, 치명이면 넘어뜨림) · 짓밟기 (넘어진 상대, 확률로 확인사살). 어느 것을 쓸지는 기대 이득 (피해 몫 + 넉백 이득: 벽 · 진형에서 떼어 냄 ·
         동료를 노리던 놈을 떼어 냄 − 사수에게 거리를 줌) 에서 동료가 맞을 몫을 뺀 값으로 확률적으로 (오사 규칙처럼 이득이 크면 감수). 명령으로 정할 수도 있음 (u.swing).
         방패 밀치기 (bash): 벽으로 밀어 짓뭉갬 · 동료를 치려는 놈의 준비를 끊음 · 둘러싸여 자리를 만듦. 피하기 (dodge): 근접 준비가 끝나기 직전 알아차리면 날렵함 · 둘레 여유만큼
         비켜섬 — 벽을 등지면 (backToWall) 잘 못 피하고, 막아도 자세가 더 깎이고, 밀리면 짓뭉개짐. 발놀림 (footwork): 기다릴 때도 상대를 본 채 옆으로 움직임.
         적의 조 나누기 (planSquads): 아군 전선 뒤에 사수 · 구급이 있으면 빠른 근접 절반이 트인 쪽으로 우회해 뒤를 노림. 사수끼리 떨어져 각을 나눔.
         떼어 내기 (peel): 사수 · 구급 · 다친 · 넘어진 동료에게 붙은 근접 상대를 먼저. 넘어진 상대는 모두가 노림 (확인사살). 협공 자리는 상대 등 뒤가 벽인 쪽 (벽으로 몰아 넣기).
         액티브 스킬 (p.active: 돌진 · 도약) · 공격 이동 명령 (amove) · 돌진 명령 (charge). [개조된 신체] 는 ◆고유특성 (p.modBody) 으로도 받음 (v5.1 에서 빠져 있던 것 고침).
   v5.1: 방어구 칸 (u.gear"""),
("""  modBody: { dmg: 0.7, pin: 0.5 },   // [개조된 신체]: 받는 피해 × · 움찔 시간 ×""",
"""  modBody: { dmg: 0.7, pin: 0.5 },   // [개조된 신체]: 받는 피해 × · 움찔 · 넘어짐 시간 ×
  // v5.2 무게 (kg) = base × (키/1.7)^exp × ([거구] giant) + 방어구 (등급 × w × armor). 인물마다 weight 로 따로 (카리우스 300)
  mass: { base: 62, exp: 2.5, giant: 1.3, armor: 400 },
  // v5.2 밀침: 밀려나는 거리 = 힘 × (무게 비)^exp (최소 min · 최대 cap 배), 초당 vel 칸. 바위에 박히면 남은 기세만큼 짓뭉개짐 (공격 × crush · 막을 수 없음 · crushProne 초 넘어짐),
  // 처음부터 벽에 붙어 있으면 그 자리에서 × wall. downLen 칸 넘게 날아가면 prone 초 넘어짐. 날아가다 부딪힌 몸은 둘 다 공격 × bowl
  shove: { exp: 0.6, min: 0.12, cap: 1.6, vel: 7, crush: 0.9, wall: 1.2, crushProne: 1.6, downLen: 0.9, prone: 0.9, bowl: 0.35 },
  // v5.2 거구의 넓게 휘두르기: 앞 ±arc° · 사거리 + reach 안 모두 (동료도), 공격 × mul · 힘 p 로 밀침 · 치명 + crit
  sweep: { arc: 65, reach: 0.35, mul: 0.8, p: 0.8, crit: 0.06 },
  // v5.2 거구의 찍기: 공격 × mul · 막아도 자세 −post · 치명 + crit (넘어뜨림 down 초, 상대가 1.7배 넘게 무거우면 안 넘어짐) · 준비 시간 × wind.
  // 짓밟기: 넘어진 상대를 stompKill 확률로 확인사살, 아니면 공격 × stomp (막을 수 없음)
  heavy: { mul: 1.3, post: 45, crit: 0.2, down: 1.2, wind: 1.3, stomp: 2.2, stompKill: 0.45 },
  // v5.2 치명타 (모든 근접 · 원거리): base 확률 (+ 넘어진 상대 prone) · 피해 × mul. 다리에 치명 (최대 체력의 legMin 넘게) 이면 cripple 확률로 다리 불구 → 기어다님
  crit: { base: 0.05, prone: 0.3, mul: 1.5, cripple: 0.6, legMin: 0.12 },
  proneHit: 1.5,      // v5.2 넘어진 · 기어다니는 몸이 받는 피해 ×
  crawl: 0.2,         // v5.2 기어다닐 때 속력 ×
  // v5.2 방패 밀치기: 힘 p · 공격 × dmg (둔기) · 상대 자세 −post · 준비 wind · 회복 rec · 다시 쓰기 cd 초
  bash: { p: 0.7, dmg: 0.3, post: 30, wind: 0.25, rec: 0.35, cd: 4 },
  // v5.2 피하기: 근접 준비가 win 초 남았을 때 확률 p × 날렵함 (속력 ÷ 3) × 둘레 여유로 step 칸을 time 초에 비켜섬 (cd 초마다). 벽을 등지면 × wall
  dodge: { p: 0.4, step: 0.6, time: 0.18, cd: 1.6, win: 0.22, wall: 0.35 },
  wallPost: 1.3,      // v5.2 벽을 등지고 막으면 자세 깎임 × (물러서며 받아 낼 곳이 없음)
  footwork: 0.35,     // v5.2 맞붙기 전 기다릴 때 발놀림 속력 × (0 = 멈춰 섬)
  squad: { t: 1, flank: 3.2, spread: 1.15 },   // v5.2 적 조 나누기: t 초마다 다시 봄 · 우회 조가 도는 거리 (칸) · 큰 몸 앞에서 서로 떨어지는 거리 (칸)"""),
])

T='rt3_tail.js'
blk=open('v52_block.js',encoding='utf-8').read()
patch(T,[
# 역할: 거구 = 전선
("""  if (p.shield) return '전선';""", """  if (p.shield || (p.traits || []).includes('거구')) return '전선';   // v5.2 [거구] = 몸이 방패 (중전차)"""),
# 유닛
("""    const s = statsOf(p, rules), wp = (p.weapon && rules.weapons && rules.weapons[p.weapon]) || {}, far = s.rng > 1, tr = p.traits || [];""",
 """    const s = statsOf(p, rules), wp = (p.weapon && rules.weapons && rules.weapons[p.weapon]) || {}, far = s.rng > 1, tr = p.traits || [], acts = Array.isArray(p.active) ? p.active : p.active ? [p.active] : [], hh = heightOf(p);"""),
("""giant: tr.includes('거구'), h: p.height != null && +p.height > 0 ? +p.height : tr.includes('거구') ? 3 : p.tac === 'pack' ? 0.8 : 1.7,   // 키 (m) modBody: tr.includes('개조된 신체'),
      canCharge: tr.includes('돌진'), chargeCd: -9, canLeap: tr.includes('도약'), leapCd: -9,""",
 """giant: tr.includes('거구'), h: hh, modBody: !!p.modBody || tr.includes('개조된 신체'),   // 키 (m) · [개조된 신체] (v5.2: ◆고유특성이면 p.modBody)
      canCharge: tr.includes('돌진') || acts.includes('돌진'), chargeCd: -9, canLeap: tr.includes('도약') || acts.includes('도약'), leapCd: -9, active: acts,   // v5.2 액티브 스킬 (p.active)
      // v5.2 무게 · 몸 방패 · 거구의 공격 · 방패 밀치기 · 피하기 · 넘어짐 · 기어다님 · 밀려남 · 조 · 휘두르기 명령
      mass: massOf(p, rules, hh, gearOf(p, rules)), bodyShield: tr.includes('거구'), canSweep: tr.includes('거구'), canBash: !!p.shield, bashCd: -9, dodgeCd: -9, dodgedT: -9, proneT: -9, crawl: false, legLoss: null, kb: null, sq: null, swing: null,"""),
("""const spdNow = (W, u) => u.spd * u.spdMul * (W.t < u.pinT ? 0.4 : 1) * (u.quadOn ? W.rules.quadMul || 1.4 : 1);""",
 """const spdNow = (W, u) => u.spd * u.spdMul * (W.t < u.pinT ? 0.4 : 1) * (u.quadOn ? W.rules.quadMul || 1.4 : 1) * (u.crawl ? (W.rules.crawl != null ? W.rules.crawl : 0.2) : 1);   // v5.2 기어다님"""),
("""const guardOn = (W, u) => u.alive && u.canGuard && W.t >= u.brokenT && !(u.act && !u.shield);""",
 """const guardOn = (W, u) => u.alive && u.canGuard && W.t >= u.brokenT && !(u.act && !u.shield) && !u.crawl && W.t >= u.proneT && !u.kb;   // v5.2 넘어지면 못 막음"""),
# 공격 시작: 거구의 공격 고르기
("""  const heal = u.cls === '치유' && t.side === u.side;
  u.act = { k: heal ? 'heal' : 'atk', b: t.i, phase: 'wind', t0: W.t, end: W.t + u.wind, why: heal ? '' : why || '' };
  u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u); u.waitT = 0;
  if (!heal) setMood(W, u, why || '공격', t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, heal, end: +(W.t + u.wind).toFixed(2), hid: u.side === 1 && !u.seenBy, why: heal ? '' : why || '' });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: u.wind, heal });
}""",
 """  const heal = u.cls === '치유' && t.side === u.side;
  // v5.2 거구의 근접: 넓게 휘두르기 · 찍기 · 짓밟기 중 고름 (준비가 더 김 — 크게 휘두르는 만큼 피할 틈이 보임)
  const mode = !heal && u.canSweep && !isFar(u) ? swingPlan(W, u, t) : null, wind = u.wind * (mode ? (W.rules.heavy || {}).wind || 1.3 : 1);
  if (mode) why = heavyName(u, mode) + (why && why !== '공격' ? ' · ' + why : '');
  u.act = { k: heal ? 'heal' : 'atk', b: t.i, phase: 'wind', t0: W.t, end: W.t + wind, why: heal ? '' : why || '', mode };
  u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u); u.waitT = 0;
  if (!heal) setMood(W, u, why || '공격', t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, heal, mode, end: +(W.t + wind).toFixed(2), hid: u.side === 1 && !u.seenBy, why: heal ? '' : why || '' });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind, heal, mode });
  if (mode === 'sweep' && swingArc(W, u, Math.atan2(t.y - u.y, t.x - u.x)).M.length){ L(W, { k: 'shout', a: u.i, s: '비켜!' }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '비켜!', t0: W.t }); }
}"""),
# 돌진: 무게 비로 날려 보냄 (벽이면 짓뭉개짐)
("""  if (!u.canCharge || u.act || W.t < u.chargeCd""", """  if (!u.canCharge || u.crawl || u.act || W.t < u.chargeCd"""),
("""    if (hit.alive){
      const push = C.push || 1.2; for (let k = 0; k < 6; k++) tryMove(W, hit, hit.x + A.dx * push / 6, hit.y + A.dy * push / 6);
      hit.pinT = W.t + (C.pin || 1.2); if (hit.act && hit.act.phase === 'wind' && hit.act.k !== 'skill'){ L(W, { k: 'miss', a: hit.i, b: hit.act.b, why: '들이받혀 준비가 끊김' }); hit.act = null; hit.burst = null; }
    }
    L(W, { k: 'impact', a: u.i, b: hit.i, block: blocked, broke: blocked && hit.brokenT > W.t, vis: u.side === 0 || !!u.seenBy || !!hit.seenBy });""",
 """    if (hit.alive){ hit.pinT = W.t + (C.pin || 1.2) * (hit.modBody ? (W.rules.modBody || {}).pin || 0.5 : 1); interrupt(W, hit, '들이받혀 준비가 끊김'); }
    L(W, { k: 'impact', a: u.i, b: hit.i, block: blocked, broke: blocked && hit.brokenT > W.t, vis: u.side === 0 || !!u.seenBy || !!hit.seenBy });
    if (hit.alive) shove(W, u, hit, (C.push || 1.2) * (blocked ? 0.8 : 1), A.dx, A.dy, { how: 'charge' });   // v5.2 무게 비만큼 날아감 — 벽이면 짓뭉개짐"""),
# resolveAct
("""  if (u.act.k === 'throw'){ resolveThrow(W, u); return; }""", """  if (u.act.k === 'throw'){ resolveThrow(W, u); return; }
  if (u.act.k === 'bash'){ resolveBash(W, u); return; }"""),
("""  if (A.phase === 'wind'){
    const far = isFar(u);""", """  if (A.phase === 'wind'){
    // v5.2 넓게 휘두르기: 노린 상대가 비켜서도 부채꼴 안의 모두 (동료도) 를 침
    if (A.k === 'atk' && A.mode === 'sweep'){ heavyHit(W, u, t, 'sweep'); A.phase = 'rec'; A.end = W.t + u.rec; A.t1 = W.t; return; }
    const far = isFar(u);"""),
("""why = far ? '사거리 밖으로 벗어남' : `손이 안 닿음""", """why = far ? '사거리 밖으로 벗어남' : W.t - t.dodgedT < 0.5 ? '몸을 빼 피함' : `손이 안 닿음"""),
("""      else strike(W, u, t, t, dp);""", """      else if (A.mode) heavyHit(W, u, t, A.mode); else strike(W, u, t, t, dp);"""),
# strike
("""t.blockT = W.t; t.blocked++;""", """ * (!o.far && backToWall(W, t, u) ? rv(W, 'wallPost', 1.3) : 1); t.blockT = W.t; t.blocked++;   // v5.2 벽을 등지면 더 깎임"""),
("""    o.block = true;
    applyDmg""", """    o.block = true; o.tag = (extra && extra.tag) || null;
    applyDmg"""),
("""  const exposed = dir !== 'front' || !!t.act, P = """, """  const exposed = dir !== 'front' || !!t.act || prone(W, t), P = """),
("""  const crit = !!J && W.rand() < J.crit;   // 투창: 치명""", """  // v5.2 치명타: 투창은 투창 표, 나머지는 crit.base (+ 넘어진 상대 crit.prone, + 거구의 공격 heavyCrit). 넘어진 몸은 받는 피해 ×proneHit
  const CR = R.crit || {}, pr = prone(W, t), crit = J ? W.rand() < J.crit : W.rand() < (CR.base || 0) + (pr ? CR.prone || 0 : 0) + ((extra && extra.heavyCrit) || 0);"""),
("""* (crit ? J.critMul : 1) * armMul""", """* (crit ? (J ? J.critMul : CR.mul || 1.5) : 1) * (pr ? rv(W, 'proneHit', 1.5) : 1) * armMul"""),
("""o.armMul = +armMul.toFixed(2); o.wk = wk;""", """o.armMul = +armMul.toFixed(2); o.wk = wk; o.tag = (extra && extra.tag) || null; o.hcrit = crit && !J;"""),
("""  if (!t.undying && dmg >= t.max * 0.1 && t.hp > dmg){""", """  if (!t.undying && !(extra && extra.noWound) && dmg >= t.max * 0.1 && t.hp > dmg){"""),
("""  applyDmg(W, u, t, dmg, o);
  return o;
}
function applyDmg""", """  applyDmg(W, u, t, dmg, o);
  // v5.2 치명타의 뒤: 다리에 크게 → 다리 불구 (기어다님). 거구의 치명은 넘어뜨림 (상대가 너무 무거우면 안 넘어짐)
  if (crit && !J && t.alive){
    if (part === '다리' && dmg >= t.max * (CR.legMin || 0.12) && W.rand() < (CR.cripple != null ? CR.cripple : 0.6)) cripple(W, t, u.i, wk);
    else if (extra && extra.heavyCrit && u.mass >= t.mass * 0.6) knockDown(W, t, (R.heavy || {}).down || 1.2, u.i, '치명타');
  }
  return o;
}
function applyDmg"""),
("""  L(W, { k: 'hit', armor: o.armor || null, a: u.i,""", """  L(W, { k: 'hit', armor: o.armor || null, tag: o.tag || null, hcrit: !!o.hcrit, a: u.i,"""),
("""    t.alive = false; t.hp = 0; t.act = null; t.burst = null; stop(t);""", """    t.alive = false; t.hp = 0; t.act = null; t.burst = null; t.kb = null; stop(t);"""),
# 생각: 적 점수 (넘어진 상대 · 우회 조의 목표 · 떼어 내기)
("""      const score = f => (u.threat[f.i] || 0) + Math.max(0, 6 - dist(u, f)) * 3 + roleBias(W, u, f) * 3;""",
 """      const score = f => (u.threat[f.i] || 0) + Math.max(0, 6 - dist(u, f)) * 3 + roleBias(W, u, f) * 3 + (prone(W, f) ? 8 : 0) + (u.sq && u.sq.k === 'flank' && u.sq.aim === f.i ? 12 : 0) + (peelOf(W, u, f) ? 6 : 0);   // v5.2 확인사살 · 우회 조 · 떼어 내기"""),
("""    let pick = seen[0];
    if (u.role === '미드필더'""", """    let pick = seen[0];
    // v5.2 떼어 내기: 사수 · 구급 · 다친 · 넘어진 동료에게 달라붙은 근접 상대를 먼저 (내가 다른 상대와 맞붙어 있지 않으면). 가까이 넘어진 상대는 마무리
    const busy = W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < 0.6 && focusOf(W, f) === u);
    const pv = !isFar(u) && !u.crawl && !busy ? seen.filter(f => dist(u, f) < 4.5 && peelOf(W, u, f)).sort((a, b) => dist(u, a) - dist(u, b))[0] : null;
    if (pv){ if (u.target !== pv){ u.waitT = 0; L(W, { k: 'peel', a: u.i, b: pv.i, v: peelOf(W, u, pv).i }); } u.state = 'fight'; u.target = pv; return; }
    const pz = !u.crawl && (isFar(u) || !busy) ? seen.filter(f => prone(W, f) && (isFar(u) ? gap(u, f) < u.rng : dist(u, f) < 4)).sort((a, b) => dist(u, a) - dist(u, b))[0] : null; if (pz) pick = pz;   // 넘어진 상대에게 몰려가 확인사살
    if (u.role === '미드필더'"""),
# 싸움
("""function fight(W, u, t, dt, see, ordered){
  if (!see){""", """function fight(W, u, t, dt, see, ordered){
  if (u.crawl && !isFar(u)){ if (see) crawlAway(W, u, t, dt); else stop(u); return; }   // v5.2 기어다님: 근접은 못 함
  if (!see){"""),
("""  if (!ordered && cover(W, u, t, dt)) return;""", """  if (!ordered && cover(W, u, t, dt)) return;
  if (!ordered && u.side === 1 && u.sq && flankStep(W, u, t, dt)) return;   // v5.2 우회 조"""),
("""(ordered || u.side === 1 || pushing(W, u, t) || u.role !== '전선') && tryCharge(W, u, t)) return;""", """(ordered || u.side === 1 || pushing(W, u, t) || u.role !== '전선' || t.canGuard || t.bodyShield) && tryCharge(W, u, t)) return;"""),
# 틈
("""function openingOf(W, u, t){
  if (t.act)""", """function openingOf(W, u, t){
  if (prone(W, t) || t.kb) return '넘어짐';   // v5.2
  if (t.act)"""),
# 근접
("""  if (inReach(u, t)){
    const op = openingOf(W, u, t);""", """  if (inReach(u, t)){
    const bw = bashWhy(W, u, t); if (bw){ startBash(W, u, t, bw); return; }   // v5.2 방패 밀치기
    const op = openingOf(W, u, t);"""),
("""fin && !op ? '마무리' : op === '틈' ? '틈을 노림'""", """fin && !op ? '마무리' : op === '넘어짐' ? '넘어진 상대' : op === '틈' ? '틈을 노림'"""),
("""    if (W.rand() < dt * (u.bold * 0.6 + u.waitT * 0.12)){ startAct(W, u, t, '밀어붙임'); return; }""",
 """    if (u.canBash && W.t >= u.bashCd && W.t >= u.brokenT && gap(u, t) <= 0.35 && W.rand() < dt * 0.35){ startBash(W, u, t, '밀어붙임'); return; }   // v5.2
    if (W.rand() < dt * (u.bold * 0.6 + u.waitT * 0.12)){ startAct(W, u, t, '밀어붙임'); return; }"""),
("""  let go = ordered || u.bold >= 0.65 || busyOther || !!t.act ||""", """  let go = ordered || u.bold >= 0.65 || busyOther || !!t.act || prone(W, t) ||"""),
("""    go = sup === 0 || mine >= sup + 1 ||""", """    go = sup === 0 || mine >= sup + 1 || prone(W, t) ||"""),
("""        stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '위협', t.i); return;""", """        footwork(W, u, t, dt, want); setMood(W, u, '위협', t.i); return;   // v5.2 발놀림"""),
("""    if (busyOther && !ordered){
      const ax = t.x - f.x, ay = t.y - f.y, al = Math.hypot(ax, ay) || 1, d = t.r + u.r + Math.min(u.rng, 0.25);
      let px = t.x + ax / al * d, py = t.y + ay / al * d;
      if (rock(W.map, px, py)){ const s = Math.atan2(ay, ax) + 1.2; px = t.x + Math.cos(s) * d; py = t.y + Math.sin(s) * d; }
      if (rock(W.map, px, py)){ px = t.x; py = t.y; }
      setMood(W, u, '협공', t.i); goTo(W, u, px, py, dt); return;
    }""", """    if (busyOther && !ordered){
      // v5.2 협공 자리: 붙은 동료 반대쪽 · 옆 (겹치지 않게). 상대 등 뒤가 벽이 되는 쪽 (벽으로 몰아 넣기) 을 좋아함
      const p = approachPt(W, u, t, Math.atan2(t.y - f.y, t.x - f.x), [0, 0.9, -0.9, 1.6, -1.6, 2.2, -2.2]);
      setMood(W, u, '협공', t.i); goTo(W, u, p ? p.x : t.x, p ? p.y : t.y, dt); return;
    }"""),
("""u.bold >= 0.65 ? '뛰어듦' : '다가감', t.i); goTo(W, u, t.x, t.y, dt); return;""", """u.bold >= 0.65 ? '뛰어듦' : '다가감', t.i);
    const ap = gap(u, t) < 3 ? approachPt(W, u, t, Math.atan2(u.y - t.y, u.x - t.x), [0, 0.5, -0.5, 0.9, -0.9]) : null;   // v5.2 벽으로 몰아 넣는 쪽 · 큰 몸 앞에선 흩어짐
    goTo(W, u, ap ? ap.x : t.x, ap ? ap.y : t.y, dt); return;"""),
("""  stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  setMood(W, u, '경계', t.i);
}""", """  footwork(W, u, t, dt, want);   // v5.2 발놀림 (서 있지 않음)
  setMood(W, u, '경계', t.i);
}"""),
# 쏘기
("""  if (!ordered && u.canLeap && !isFar(t)""", """  if (!ordered && u.canLeap && !u.crawl && !isFar(t)"""),
("""    tgt = first; why = '앞을 가로막은 상대';""", """    // v5.2 큰 몸 (몸이 방패) 이 노리는 상대를 가림: 다른 표적 · 각 잡기 (오래 막히면 그 몸이라도 쏨)
    if (first.bodyShield && !ordered && !prone(W, first) && u.waitT < 2.5){ const alt = altTarget(W, u, t); if (alt){ startAct(W, u, alt, '다른 표적'); return; } u.waitT += dt; reposition(W, u, t, dt, '막힘', first.i); return; }
    tgt = first; why = '앞을 가로막은 상대';"""),
("""    const first = firstOnLine(W, u, f, u, know); if (first !== f && (first.side === u.side || inGuard(W, first, u))) continue;""",
 """    const first = firstOnLine(W, u, f, u, know); if (first !== f && (first.side === u.side || blocksFor(W, first, u))) continue;"""),
("""      if (W.units.some(o => o.alive && o !== u && o.side === u.side && isFar(o) && o.target && o.target.alive && o.target.side !== u.side && segD(o, o.target.x, o.target.y, P0) < u.r + 0.15)) s -= 1.5;   // 다른 사수의 사선""",
 """      if (W.units.some(o => o.alive && o !== u && o.side === u.side && isFar(o) && o.target && o.target.alive && o.target.side !== u.side && segD(o, o.target.x, o.target.y, P0) < u.r + 0.15)) s -= 1.5;   // 다른 사수의 사선
      // v5.2 사수끼리 떨어져 각을 나눔 (십자 사격)
      for (const o of W.units) if (o.alive && o !== u && o.side === u.side && isFar(o)){ const dd = Math.hypot(o.x - x, o.y - y); if (dd < 2.2) s -= (2.2 - dd) * 0.8; if (o.target === t && angDiff(Math.atan2(y - t.y, x - t.x), Math.atan2(o.y - t.y, o.x - t.x)) > 0.7) s += 0.6; }"""),
("""    const f = firstOnLine(W, e, P0, e); if (f !== P0 && f.side === u.side && inGuard(W, f, e)) continue;""",
 """    const f = firstOnLine(W, e, P0, e); if (f !== P0 && f.side === u.side && blocksFor(W, f, e)) continue;"""),
# 역할 기울기: 넘어진 상대
("""function roleBias(W, u, f){""", """function roleBias(W, u, f){ return roleBias0(W, u, f) + (prone(W, f) ? 1.5 : 0); }   // v5.2 넘어진 상대
function roleBias0(W, u, f){"""),
# 살아남기 · 숨기 · 막아서기 (몸 방패)
("""function cover(W, u, t, dt){
  const know = knows(W, u);""", """function cover(W, u, t, dt){
  if (u.crawl) return false;
  const know = knows(W, u);"""),
("""  if (u.canGuard){
    if (W.t < u.brokenT) return false;""", """  if (u.canGuard || u.bodyShield){   // v5.2 큰 몸은 방패 없이도 몸으로 막아섬
    if (!u.bodyShield && W.t < u.brokenT) return false;"""),
("""  const guards = W.units.filter(g => g.alive && g !== u && g.side === u.side && guardOn(W, g));""", """  const guards = W.units.filter(g => g.alive && g !== u && g.side === u.side && (guardOn(W, g) || g.bodyShield));"""),
("""<= g.r + 0.04 && inGuard(W, g, e); });""", """<= g.r + 0.04 && blocksFor(W, g, e); });"""),
# 노출
("""if (fl === a || !inGuard(W, fl, f)) w = """, """if (fl === a || !blocksFor(W, fl, f)) w = """),
("""  return { e: e * (1 + Math.max(0, 1 - a.hp / a.max)), main };""", """  return { e: e * (1 + Math.max(0, 1 - a.hp / a.max)) * (prone(W, a) ? 1.8 : 1), main };   // v5.2 넘어진 동료는 더 지켜야 함"""),
# 탱커: 돌진으로 전선을 깸
("""  if (f0 && pushing(W, u, f0)){ u.frontT = 0;""", """  // v5.2 돌진 (중전차): 막고 선 상대 전선 (방패 · 큰 몸) · 동료를 치려는 상대가 돌진 거리 안이면 들이받아 전선을 깸
  if (u.canCharge && f0 && W.t >= u.chargeCd && (f0.canGuard || f0.bodyShield || (focusOf(W, f0) && focusOf(W, f0).side === u.side)) && tryCharge(W, u, f0)) return true;
  if (f0 && pushing(W, u, f0)){ u.frontT = 0;"""),
# 한 순간
("""function act(W, u, dt){
  if (u.act && u.act.k === 'leap'){ stepLeap(W, u, dt); return; }""", """function act(W, u, dt){
  if (u.kb || W.t < u.proneT) return;   // v5.2 날아가는 중 · 넘어짐: 아무것도 못 함 (기어다니는 쪽은 움직임)
  if (u.act && (u.act.k === 'leap' || u.act.k === 'dodge')){ stepLeap(W, u, dt); return; }"""),
("""  const x0 = u.x, y0 = u.y;
  act2(W, u, dt);""", """  if (tryDodge(W, u)) return;   // v5.2 피하기
  const x0 = u.x, y0 = u.y;
  act2(W, u, dt);"""),
("""  if (u.side === 0 && u.canGuard && u.role === '전선' && tankAI(W, u, dt)) return;""", """  if (u.side === 0 && (u.canGuard || u.bodyShield) && !u.crawl && u.role === '전선' && tankAI(W, u, dt)) return;   // v5.2 큰 몸도 탱커"""),
("""  if (u.side === 1 && u.canGuard && u.role === '전선' && """, """  if (u.side === 1 && (u.canGuard || u.bodyShield) && !u.crawl && u.role === '전선' && """),
# 명령
("""function doOrder(W, u, dt){
  const o = u.order, foes = W.units.filter(f => f.alive && f.side !== u.side);""", """function doOrder(W, u, dt){
  const o = u.order, foes = W.units.filter(f => f.alive && f.side !== u.side);
  if (o.k === 'amove'){
    // v5.2 공격 이동 (판의 바닥을 왼쪽 클릭): 그 자리로 가며, 가는 길에 보이는 상대 (근접은 stayLeash 칸, 사수는 사거리 + 1.5칸 안) 와 스스로 싸움.
    // 다 쓰러뜨리거나 안 보이면 다시 감. 도착하면 그 자리를 지킴 (자동)
    const lim = isFar(u) ? u.rng + 1.5 : rv(W, 'stayLeash', 4);
    const seen = foes.filter(f => canSee(W, u, f) && dist(u, f) <= lim).sort((a, b) => (prone(W, b) ? 1 : 0) - (prone(W, a) ? 1 : 0) || dist(u, a) - dist(u, b));
    if (seen.length){
      const t = u.target && u.target.alive && seen.includes(u.target) ? u.target : seen[0];
      if (u.target !== t) u.waitT = 0; u.target = t; u.state = 'fight';
      fight(W, u, t, dt, true, false); return;
    }
    if (Math.hypot(u.x - o.x, u.y - o.y) < 0.15){ L(W, { k: 'arrive', a: u.i }); u.order = null; u.stay = { x: o.x, y: o.y }; stop(u); return; }
    setMood(W, u, '공격 이동'); setGoal(W, u, o.x, o.y); follow(W, u, dt);
    if (!u.path){ L(W, { k: 'stuck', a: u.i }); u.order = null; u.stay = { x: u.x, y: u.y }; }
    return;
  }
  if (o.k === 'charge'){
    // v5.2 돌진 명령 (액티브 스킬): 돌진 거리 (min ~ max) 안 · 길이 트이면 들이받음 → 그 상대 공격. 다시 쓰기 전 · 너무 가까우면 그냥 공격
    const t = W.units[o.b], C = W.rules.charge || {};
    if (!t || !t.alive || !u.canCharge){ u.order = null; return; }
    if (!canSee(W, u, t) || W.t < u.chargeCd || gap(u, t) < (C.min || 1.5)){ u.order = { k: 'attack', b: t.i }; u.last = { x: t.x, y: t.y }; return; }
    if (tryCharge(W, u, t)){ u.order = { k: 'attack', b: t.i }; return; }
    setMood(W, u, '돌진 거리로', t.i); goTo(W, u, t.x, t.y, dt); return;
  }
  if (o.k === 'leap'){
    // v5.2 도약 명령 (액티브 스킬): 가장 가까이 보이는 상대에게서 뒤로 뜀
    const f = foes.filter(f => canSee(W, u, f)).sort((a, b) => dist(u, a) - dist(u, b))[0];
    u.order = null; if (f && u.canLeap && !u.crawl && W.t >= u.leapCd) startLeap(W, u, f);
    return;
  }"""),
# 세상 한 걸음
("""  const doThink = W.thinkT <= 0; if (doThink) W.thinkT = 0.2;""", """  const doThink = W.thinkT <= 0; if (doThink) W.thinkT = 0.2;
  W.sqT = (W.sqT || 0) - dt; if (W.sqT <= 0){ W.sqT = (R.squad || {}).t || 1; planSquads(W); }   // v5.2 적의 조 나누기"""),
("""  stepShots(W, dt);
  // [불사]""", """  for (const u of W.units) if (u.alive && u.kb) stepKb(W, u, dt);   // v5.2 밀려나 날아가는 몸
  stepShots(W, dt);
  // [불사]"""),
("""  t.wounds = []; t.atkMul = 1; t.spdMul = 1;""", """  t.wounds = []; t.atkMul = 1; t.spdMul = 1; t.proneT = -9; t.kb = null; t.crawl = false; t.legLoss = null;"""),
("""const orderTxt = (o, u) => o && o.k === 'throw'""", """const orderTxt = (o, u) => o && o.k === 'amove' ? ['amove', +o.x.toFixed(2), +o.y.toFixed(2)] : o && o.k === 'charge' ? ['charge', o.b] : o && o.k === 'throw'"""),
("""wounds: u.wounds.slice() })) });""", """wounds: u.wounds.slice(), prone: W.t < u.proneT, crawl: !!u.crawl })) });"""),
("""if (typeof module !== 'undefined') module.exports = { """, """if (typeof module !== 'undefined') module.exports = { shove, knockDown, cripple, swingPlan, swingArc, heavyHit, startBash, bashWhy, tryDodge, prone, massOf, heightOf, backToWall, blocksFor, planSquads, kbLen, kbValue, peelOf, footwork, """),
# 새 함수 묶음: 명령 앞에
("""/* ---------- 한 순간 (dt 초) 의 움직임 · 공격 ---------- */""", blk + """// 떼어 낼 상대인가: f 가 u 편의 약한 동료 (사수 · 구급 · 다친 · 넘어진) 에게 붙어 있으면 그 동료
const peelOf = (W, u, f) => { if (isFar(f)) return null; const v = focusOf(W, f); return v && v !== u && v.side === u.side && v.alive && gap(f, v) < 1.2 && (isFar(v) || (v.skill && v.skill.kit) || v.hp / v.max < 0.4 || prone(W, v)) ? v : null; };

/* ---------- 한 순간 (dt 초) 의 움직임 · 공격 ---------- */"""),
])
print('ok')
