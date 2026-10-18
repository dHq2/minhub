# v7.13.0 엔진 — patch713.py v1
# 지휘망 그물 (이중 전달 · 지휘 솜씨) · 편대장 자율 지시 (이득 확률 · 지휘 등급) · 시작 배치 편대 · 무스킬 D · 서둘러 이동은 일어나 뜀
# 검토 반영: 피한 일격의 손 안으로 다시 안 들어감 · 교전 규칙이 막는 몸은 약속에 안 듦 · 모루 판정 (넘어짐 · 너무 가벼움) · 엎드림 전열 로그 · 끝난 공격 뒤 먼 옛 자리
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

# ---------- head ----------
h = rd('rt3_head.js')
h = rep(h, "  cmdLinkW: { hops: 3, tol: 0.12 },", "  cmdLinkW: { hops: 6, tol: 0.12 },   // v7.13 그물: 받은 이가 곁의 못 받은 이에게 거듭 전함 (6단계까지)\n ")
h = rep(h, "  cmdLinkX: { relayBusy: 0.6, relayCmd: 1.05, hop2: 0.85, hop2T: 0.6 },", "  cmdLinkX: { relayBusy: 0.6, relayCmd: 1.05, hop2: 0.85, hop2T: 0.6, relaySkill: 0.06, relayFast: 0.12, meshT: 0.9 },   // v7.13 전달자의 지휘 점수마다 확실함 + relaySkill · 늦음 − relayFast (지휘 거리도 늘어남) · 그물로만 닿을 때 meshT 초\n ")
h = rep(h, "  sq: { joinT: 4, leaveT: 4, near: 14, fall: 0.6, fallT: 10, bonus: 1.2, callT: 6 },",
        "  sq: { joinT: 4, leaveT: 4, near: 14, fall: 0.6, fallT: 10, bonus: 1.2, callT: 6, brain: { dec: [0, 3, 2, 1.5, 1], noise: [0, 0.35, 0.2, 0.12, 0.06], pMin: 0.35, keep: 1.15, hold: 0.25, peel: 3.5, killT: 5 } },   // v7.13 편대장 자율 지시 (brain): 지휘 D 는 못 함 · C 는 dec[1] 초마다 기본만 (흔들림 noise) · B 이상은 붙들린 · 고립된 · 지휘하는 적까지 봄 — 이득 확률 pMin 넘을 때만 · 바꾸려면 keep 배\n ")
h = rep(h, "  hm: { pinGap: 0.9, face: 0.9, bonus: 1.6, err: 0.3, errVet: 0.15, offT: 6 },", "  hm: { pinGap: 0.9, face: 0.9, bonus: 1.6, err: 0.3, errVet: 0.15, offT: 6, pinMass: 0.3 },   // v7.13 모루는 서 있어야 · 상대 무게의 pinMass 넘거나 방패 · 큰 몸\n ")
wr('rt3_head.js', h)

# ---------- tail ----------
s = rd('rt3_tail.js')
# 지휘 점수: 스킬이 없으면 D (0) — 부대장도 · 직책은 배치가 정함
s = rep(s, "cmd: Math.max(cmdOf0(p, rules), (p.rank || RANK_REF[p.ref]) === '부대장' ? 1 : 0), rank: p.rank || RANK_REF[p.ref] || ''",
        "cmd: cmdOf0(p, rules), rank: p.rank != null ? p.rank : RANK_REF[p.ref] || ''")
# 시작 배치의 편대
s = rep(s, "  W.giants = W.units.filter(u => u.h >= 2.2);   // 시야를 가릴 만큼 큰 몸\n",
        "  W.giants = W.units.filter(u => u.h >= 2.2);   // 시야를 가릴 만큼 큰 몸\n  { const Dp = W.units.find(u => u.side === 0 && u.rank === '부대장'); if (Dp) setup.units.forEach((p, k) => { const u = W.units[k]; if (u && u !== Dp && u.side === 0 && !u.hero && p.sq === 'B'){ u.sqLead = Dp.i; u.sqAuto = false; u.sqFix = true; } }); }   // v7.13 시작 배치의 편대 (2편대 = 부대장의 편대)\n")

# ---------- 지휘망 그물 ----------
s = rep(s, "function cmdLink(W, C, u){\n  if (!C) return { p: 0, t: 0, via: 'none', why: '지휘관이 없음', c: null };",
        """// v7.13 지휘망 (그물): 모두가 곁의 동료에게 거듭 전함 (이중 · 삼중) — 받을 확률 = 1 − (지휘관에게 직접 못 받음) × Π (곁의 동료가 받아 전해 주지 못함).
//   전달자의 지휘 점수가 높을수록 멀리 (지휘 거리) · 확실히 (relaySkill) · 빨리 (relayFast). 사람이 많을수록 닿을 길이 늘어남. 아군 · 적 같음
function meshNet(W, side, C){
  const K = W.rules.cmdLink || {}, X = W.rules.cmdLinkX || {}, near = K.near != null ? K.near : 2.5, key = side + ':' + (C ? C.i : -1), M = W.meshC || (W.meshC = {}), c0 = M[key];
  if (c0 && W.t - c0.t < 0.25 && W.t >= c0.t) return c0;
  const N = W.units.filter(m => m.alive && !m.crawl && !m.down && m.side === side && !(m.koT && W.t < m.koT)), Lg = new Map();
  const busy = m => (m.act && ['atk', 'skill', 'reload', 'heal'].includes(m.act.k)) || W.units.some(f => f.alive && f.side !== m.side && !isFar(f) && gap(m, f) < Math.max(m.rng, f.rng) + 0.3);
  const rf = m => (K.relay || 0.9) * (busy(m) ? (X.relayBusy != null ? X.relayBusy : 0.6) : 1) * (1 + (X.relaySkill != null ? X.relaySkill : 0.06) * (m.cmd || 0)) * (m.rank === '부대장' ? X.relayRank || 1.12 : 1);
  for (const a of N) for (const b of N) if (a !== b) Lg.set(a.i * 1000 + b.i, dist(a, b) <= near ? 1 : cmdLink1(W, a, b).p);
  const P = {}, R = {}; for (const m of N){ P[m.i] = !C ? 0 : m === C ? 1 : Lg.get(C.i * 1000 + m.i) || 0; R[m.i] = rf(m); }
  if (C) for (let it = 0; it < 5; it++) for (const m of N){ if (m === C) continue; let miss = 1 - (Lg.get(C.i * 1000 + m.i) || 0);
    for (const q of N){ if (q === m || q === C || !P[q.i]) continue; const v = P[q.i] * (Lg.get(q.i * 1000 + m.i) || 0) * R[q.i]; if (v > 0) miss *= 1 - Math.min(0.98, v); }
    P[m.i] = Math.min(K.max || 0.98, 1 - miss); }
  const edges = []; for (let x = 0; x < N.length; x++) for (let y = x + 1; y < N.length; y++){ const a = N[x], b = N[y], p = Math.max(Lg.get(a.i * 1000 + b.i) || 0, Lg.get(b.i * 1000 + a.i) || 0); if (p >= 0.45) edges.push([a.i, b.i, +p.toFixed(2)]); }
  return (M[key] = { t: W.t, P, edges });
}
function cmdLink(W, C, u){
  if (!C) return { p: 0, t: 0, via: 'none', why: '지휘관이 없음', c: null };""")
s = rep(s, "      if (pr > best.p) best = { p: Math.min(K.max || 0.98, pr), t: b1.t + b12.t + b2.t + 0.3 + (X.hop2T || 0.6), via: 'relay', m: m1.i, m2: m2.i, why: m1.name + ' → ' + m2.name + ' 두 다리로 전함', c: C.i }; }\n  }\n  return best;\n}",
        "      if (pr > best.p) best = { p: Math.min(K.max || 0.98, pr), t: b1.t + b12.t + b2.t + 0.3 + (X.hop2T || 0.6), via: 'relay', m: m1.i, m2: m2.i, why: m1.name + ' → ' + m2.name + ' 두 다리로 전함', c: C.i }; }\n  }\n  { const MP = (meshNet(W, u.side, C).P[u.i]) || 0, X2 = W.rules.cmdLinkX || {}; if (MP > best.p + 0.02) best = { ...best, p: Math.min(K.max || 0.98, MP), via: 'relay', t: best.via === 'relay' ? best.t : (X2.meshT || 0.9) + (best.via === 'none' ? 0 : best.t), why: '지휘망 — 곁의 동료들이 거듭 전함', c: C.i, mesh: true }; }   // v7.13 그물 (이중 전달)\n  return best;\n}")
# 전파 파동: 단계 · 전달자의 지휘 솜씨
s = rep(s, "* (m.rank === '부대장' ? (X.relayRank || 1.12) : m.cmd > 0 ? (X.relayCmd || 1.05) : 1);\n  const leg = (s, m)",
        "* (m.rank === '부대장' ? (X.relayRank || 1.12) : 1) * (1 + (X.relaySkill != null ? X.relaySkill : 0.06) * (m.cmd || 0));   // v7.13 지휘 솜씨\n  const leg = (s, m)")
s = rep(s, "if (W.rand() < p){ const r = { t: s.t + l.t + (s.hop > 0 ? 0.3 + (s.hop > 1 ? X.hop2T || 0.6 : 0) : 0),",
        "if (W.rand() < p){ const r = { t: s.t + l.t + (s.hop > 0 ? (0.3 + (s.hop > 1 ? X.hop2T || 0.6 : 0)) * Math.max(0.4, 1 - (X.relayFast != null ? X.relayFast : 0.12) * (s.u.cmd || 0)) : 0),")
s = rep(s, "(r.chain.length === 1 ? nm(r.chain[0]) + '을 거쳐 전함' : r.chain.map(nm).join(' → ') + ' 두 다리로 전함') + ' (2차 전파)'",
        "(r.chain.length === 1 ? nm(r.chain[0]) + '을 거쳐 전함' : r.chain.map(nm).join(' → ') + ' ' + r.chain.length + '다리로 전함') + ' (지휘망)'")
# 적도 같은 그물 (한 다리만 보던 곳)
s = rep(s, "    const lk = u === C ? { p: 1, t: 0 } : cmdLink1(W, C, u);", "    const lk = u === C ? { p: 1, t: 0 } : cmdLink(W, C, u);   // v7.13 지휘망")
s = rep(s, "  const { u, t } = best, lk = u === C ? { p: 1, t: 0 } : cmdLink1(W, C, u);", "  const { u, t } = best, lk = u === C ? { p: 1, t: 0 } : cmdLink(W, C, u);   // v7.13 지휘망")
s = rep(s, "W.rand() < cmdLink1(W, C, u).p", "W.rand() < cmdLink(W, C, u).p")
# 판에 그릴 그물
s = rep(s, "  if (C && W.bossI != null && W.bossI !== C.i){", "  W.mesh0 = C ? meshNet(W, 0, C) : null;   // v7.13 판에 그릴 지휘망 (곁의 동료끼리 닿는 줄)\n  if (C && W.bossI != null && W.bossI !== C.i){")

# ---------- 편대장 자율 지시 ----------
s = rep(s, "  const members = sq(); if (!members.length || D.order || D.down || D.crawl){ if (!members.length) D.sqFocus = null; return; }",
        "  const members = sq(); if (!members.length || D.down || D.crawl || (D.koT && W.t < D.koT)){ if (!members.length) D.sqFocus = null; return; }   // v7.13 명령을 받은 편대장도 편대를 지휘함")
s = rep(s, "  if (odds < (S.fall != null ? S.fall : 0.6) && !(D.sqFall && W.t < D.sqFall)){",
        "  if (odds < (S.fall != null ? S.fall : 0.6) && !D.order && !(D.sqFall && W.t < D.sqFall)){")
i = s.index("  const cur = D.sqFocus && D.sqFocus.t0 != null ? W.units[D.sqFocus.b] : null;\n  if (cur && cur.alive && known.includes(cur)){ D.sqFocus.t = W.t; return; }")
j = s.index("\n}\n", i)
s = s[:i] + "  sqBrain(W, D, members, known, odds);   // v7.13 이득 확률로 고른 지시" + s[j:]
s = rep(s, "// 임시 집결: 전선이 무너지면 지휘관이 집결지를 부름 (못 들은 이는 각자)",
        """// v7.13 편대장 자율 지시: 아는 적마다 '지금 이 표적을 치면 이득일 확률' 을 셈 (편대의 화력으로 몇 초에 쓰러뜨리나 · 사수 · 다침 · 붙들림 · 고립 · 나를 노림 − 둘레의 적 · 거구 · 방패).
//   가장 높은 수가 pMin 을 넘으면 명령이 없는 편대원에게 지휘망으로 지시 (대장의 명령을 받은 이는 건드리지 않음 · 교전 규칙도 지킴). 편대장을 노리는 근접은 떼어 냄 (peel).
//   지휘 D = 지시 못 함 · C = dec 초마다 기본 셈만 (흔들림 큼) · B 이상 = 붙들림 · 고립 · 지휘하는 적까지 보고 덜 흔들림
function sqBrain(W, D, M, known){
  const S = W.rules.sq || {}, SB = S.brain || {}, g = Math.max(0, Math.min(4, Math.round(D.cmd || 0)));
  if (g < 1){ if (!D.sqWeakLog){ D.sqWeakLog = true; L(W, { k: 'sqWeak', a: D.i, vis: true }); } const cur0 = D.sqFocus && W.units[D.sqFocus.b]; if (cur0 && cur0.alive) D.sqFocus.t = W.t; return; }
  const cur = D.sqDec && W.units[D.sqDec.b] && W.units[D.sqDec.b].alive ? D.sqDec : null; if (D.sqFocus && cur) D.sqFocus.t = W.t;
  if (W.t < (D.sqBrainT || 0)) return; D.sqBrainT = W.t + ((SB.dec || [])[g] || 3);
  const nz = (SB.noise || [])[g] || 0, jit = () => Math.max(0, 1 + nz * ((W.rand() + W.rand() + W.rand() - 1.5) / 0.5)), R = W.rules;
  const free = M.filter(m => !m.hero && !m.down && !m.crawl && !(m.order && !m.order.dep) && !(m.ordPend && !(m.ordPend.o && m.ordPend.o.dep)) && !(m.koT && W.t < m.koT));
  const grp = [D].concat(M), dps = (m, f) => (m.atk || 20) * (m.atkMul || 1) * (R.lethal || 1) * (isFar(m) ? (m.ammo === 0 ? 0 : 0.6) : 0.75) / Math.max(0.4, (m.wind || 0.5) + (m.rec || 0.5));
  const opts = [];
  for (const f of known){ if (dist(f, D) > 14) continue;
    const hpE = pHp(W, D.side, f) * (iRec(W, D.side, f).guess || f.max), tK = hpE / Math.max(1, grp.reduce((a, m) => a + (dist(m, f) < 10 ? dps(m, f) : 0), 0)), pK = 1 / (1 + Math.exp((tK - (SB.killT || 5)) / 1.5));
    const near = W.units.filter(o => o.alive && o !== f && o.side === f.side && !isFar(o) && dist(o, f) < 2.5).length, thr = !isFar(f) && dist(f, D) < (SB.peel || 3.5) && (focusOf(W, f) === D || f.target === D);
    let val = 1 + (isFar(f) ? 0.4 : 0) + (pHp(W, D.side, f) < 0.4 ? 0.2 : 0) + (thr ? 0.5 : 0), why = [];
    if (isFar(f)) why.push('사수'); if (pHp(W, D.side, f) < 0.4) why.push('다침'); if (thr) why.push('나를 노림');
    if (g >= 2){ if (W.hm && W.hm.pins && W.hm.pins.has(f.i)){ val += 0.3; why.push('본대에 붙들림'); } if (!near){ val += 0.2; why.push('고립'); } if (f.cmd > 0){ val += 0.3; why.push('지휘'); } }
    const risk = Math.min(0.8, near * 0.15 + (f.giant ? 0.25 : 0) + (f.shield && guardOn(W, f) ? 0.15 : 0));
    const p = Math.min(0.99, pK * val * (1 - risk) * jit());
    opts.push({ k: thr ? 'peel' : 'focus', b: f.i, p: thr ? Math.max(p, 0.85 * jit()) : p, why: why.join(' · '), tK: +tK.toFixed(1) });
  }
  opts.push({ k: 'hold', b: null, p: (SB.hold != null ? SB.hold : 0.25) * jit(), why: '하던 대로' });
  opts.sort((a, b) => b.p - a.p);
  const best = opts[0]; if (!best || best.k === 'hold' || best.p < (SB.pMin || 0.35)) return;
  if (cur && cur.b === best.b) return;
  if (cur && best.p < (cur.p || 0) * (SB.keep || 1.15) && best.k !== 'peel') return;
  const f = W.units[best.b];
  let rc = free.filter(m => !roeBlock(W, m, f, isFar(m) ? 'fire' : 'melee') && !(m.order && m.order.dep && m.order.b === f.i));
  if (best.k === 'peel') rc = rc.filter(m => !isFar(m)).sort((a, b) => dist(a, f) - dist(b, f)).slice(0, 1);
  D.sqDec = { k: best.k, b: f.i, t: W.t, p: best.p }; D.sqFocus = { b: f.i, t: W.t, t0: W.t };
  if (rc.length){ const wv = cmdWave(W, D, rc); rc.forEach((m, k) => { const lk = wv[k]; m.ordPend = { o: { k: 'attack', b: f.i, dep: D.i }, m2: lk.m2, at: W.t + lk.t, ok: lk.ok, hop: lk.hop, p: lk.p, via: lk.via, why: lk.why, c: D.i, m: lk.m, t0: W.t }; }); }
  L(W, { k: 'sqDec', a: D.i, g, dk: best.k, b: f.i, p: +best.p.toFixed(2), why: best.why, tK: best.tK, to: rc.map(m => m.i), alt: opts.slice(1, 3).map(o => [o.k, o.b, +o.p.toFixed(2)]), vis: true });
  D.lastDec = { t: W.t, s: `편대에 ${f.name} — ${best.k === 'peel' ? '나를 노리는 근접을 떼어 냄' : '이득 확률 ' + Math.round(best.p * 100) + '%'}${best.why ? ' (' + best.why + ')' : ''}` };
}
// 임시 집결: 전선이 무너지면 지휘관이 집결지를 부름 (못 들은 이는 각자)""")

# ---------- 서둘러 이동 = 일어나 뜀 ----------
s = rep(s, "const lieOrdOK = (W, u) => !u.order || LIE_ORD.includes(u.order.k) ||",
        "const lieOrdOK = (W, u) => !u.order || (LIE_ORD.includes(u.order.k) && !((u.order.k === 'move' || u.order.k === 'amove') && u.order.hurry)) ||")
s = rep(s, "function lieHold(W, u){ if (u.lieSw) return true; if (lieOrdOK(W, u)) return false; lieSet(W, u, false, '명령 (' + u.order.k + ')'); return true; }",
        "function lieHold(W, u){ if (u.lieSw) return true; if (lieOrdOK(W, u)) return false; lieSet(W, u, false, u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove') ? '서둘러 — 일어나 뜀' : '명령 (' + u.order.k + ')'); return true; }   // v7.13")

# ---------- 검토 반영 ----------
# 피한 일격 (밀치기 · 휘두르기) 이 끝나기 전엔 그 손 안으로 다시 들어가지 않음
s = rep(s, "    u.dodgeCd = W.t + (D.cd || 1.6); stop(u); u.fg = Math.atan2(atk.y - u.y, atk.x - u.x); u.dodgedT = W.t;",
        "    u.dodgeCd = W.t + (D.cd || 1.6); stop(u); u.fg = Math.atan2(atk.y - u.y, atk.x - u.x); u.dodgedT = W.t; u.dodgeHold = { a: atk.i, until: atk.act.end + 0.1 };   // v7.13")
s = rep(s, "  if (u.lie && !lieMoves(u) && (u.x !== x0 || u.y !== y0)){ u.x = x0; u.y = y0; stop(u); }",
        """  if (u.lie && !lieMoves(u) && (u.x !== x0 || u.y !== y0)){ u.x = x0; u.y = y0; stop(u); }
  if (u.dodgeHold){ const A0 = W.units[u.dodgeHold.a], aa = A0 && A0.alive ? A0.act : null;   // v7.13 피한 일격이 아직 떨어지지 않았으면 그 손 안으로 다시 걸어 들어가지 않음 (명령이어도)
    if (W.t < u.dodgeHold.until && aa && aa.phase === 'wind' && (aa.b === u.i || aa.mode === 'sweep')){ const rr = (aa.k === 'bash' ? 0.35 : (A0.rng || 0.5)) + W.rules.reach + 0.12;
      if (gap(u, A0) < rr && dist(u, A0) < Math.hypot(x0 - A0.x, y0 - A0.y) - 1e-4){ u.x = x0; u.y = y0; stop(u); setMood(W, u, '피한 일격이 떨어지길 기다림', A0.i); } }
    else u.dodgeHold = null; }""")
# 교전 규칙이 막는 아군은 약속 (막아 주기 · 붙들기 · 몰기) 에 들지 않음
s = rep(s, "function pactMake(W, k, a, b, x, extra){ if (AI6.includes('k_' + k)) return null;",
        "function pactMake(W, k, a, b, x, extra){ if (AI6.includes('k_' + k)) return null; if (b.side === 0 && x && x.side !== b.side && roeBlock(W, b, x, isFar(b) ? 'fire' : 'melee')) return null;   /* v7.13 교전 규칙이 막는 몸은 약속에 안 듦 */")
# 모루: 서 있어야 · 너무 가볍지 않아야
s = rep(s, "    for (const a of W.units){ if (!a.alive || a.side !== 0 || a.down || isFar(a) || a.crawl) continue;\n      if (gap(a, f) < Math.max(a.rng, f.rng) + (H.pinGap || 0.9)",
        "    for (const a of W.units){ if (!a.alive || a.side !== 0 || a.down || isFar(a) || a.crawl || a.kb || prone(W, a) || (a.mass < f.mass * (H.pinMass != null ? H.pinMass : 0.3) && !a.shield && !a.bodyShield)) continue;   // v7.13 넘어진 · 너무 가벼운 몸은 모루가 아님\n      if (gap(a, f) < Math.max(a.rng, f.rng) + (H.pinGap || 0.9)")
# 엎드림 전열 로그
s = rep(s, "how: !u.alive || u.down ? '쓰러짐' : u.kb ? '밀려남' : '넘어짐',", "how: !u.alive || u.down ? '쓰러짐' : u.kb ? '밀려남' : u.lie ? '엎드림' : '넘어짐',")
# 공격 명령이 끝났는데 옛 자리가 멀면 그 자리를 지킴
s = rep(s, "    if (!t || !t.alive){ u.order = null; return; }   // 상대가 쓰러지면 자동",
        "    if (!t || !t.alive){ u.order = null; if (u.stay && Math.hypot(u.stay.x - u.x, u.stay.y - u.y) > 4) u.stay = { x: u.x, y: u.y }; return; }   // 상대가 쓰러지면 자동   // v7.13 옛 자리가 멀면 (4칸 넘게) 지금 자리를 지킴")
s = rep(s, "dropTorch, lieSet, lieHid, lieTick, lieTrample, lieFlash, prone, detourVia, flankLeap, suppAI, suppHid };", "dropTorch, lieSet, lieHid, lieTick, lieTrample, lieFlash, prone, detourVia, flankLeap, suppAI, suppHid, meshNet, sqBrain, cmdLinkM: cmdLink };")
s = rep(s, "      L(W, { k: 'cmdRecv', a: u.i, c: P.c, via: P.via,", "      L(W, { k: 'cmdRecv', a: u.i, c: P.c, dep: P.o && P.o.dep != null ? 1 : null, via: P.via,")   # v7.13 편대장의 지시

wr('rt3_tail.js', s)
print('patch713 engine OK')
