# v7.14.1 엔진 — patch7141.py v1.1 (v1.1: 징검다리 — 중간 동료를 거치면 명령이 더 빨리 닿음)
# 엎드린 몸 위로 지나감: 노린 몸이 아니면 서서 쏜 탄 · 화살 · 창은 거의 넘어감 (over) — 사선 판단 · 오사 확률 · 실제 탄 모두. 아군 · 적 같은 규칙
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "hitArc: 0.85, hitR: 0.6, near: 1.8,", "hitArc: 0.85, hitR: 0.6, over: 0.08, overLow: 0.5, near: 1.8,")
h = rep(h, "  lie: { down: 0.6, up: 0.2, upFast: 0.15,", "  // v7.14.1 over: 노린 몸이 아닌 엎드린 몸이 사선에 있을 때 서서 쏜 탄 · 화살 · 창에 맞을 확률 (나머지는 위로 넘어감) · overLow: 쏘는 쪽도 엎드렸을 때 (낮게 날아감 — 이때는 사선을 막는 몸으로 봄)\n  lie: { down: 0.6, up: 0.2, upFast: 0.15,")
wr('rt3_head.js', h)

s = rd('rt3_tail.js')
s = rep(s, "function lineBodies(W, a, t, self, know){\n", """// v7.14.1 엎드린 몸 위로 지나감: 노린 몸이 아니면 서서 쏜 탄 · 화살 · 창은 거의 넘어감 (over). 쏘는 쪽도 엎드렸으면 낮게 날아 overLow
const lieLow = b => !!(b && b.lie && !b.lieSw);
const lieOverP = (W, sh) => { const LL = W.rules.lie || {}; return lieLow(sh) ? (LL.overLow != null ? LL.overLow : 0.5) : (LL.over != null ? LL.over : 0.08); };
function lieOver(W, s, b){ const P = s.over || (s.over = {}); if (P[b.i] == null) P[b.i] = W.rand() >= lieOverP(W, W.units[s.a]) ? 1 : 0; return P[b.i] === 1; }   // 한 탄에 한 몸마다 한 번만 굴림
function lineBodies(W, a, t, self, know){
""")
s = rep(s, "    if (know && !know(b)) continue;\n    const k = ((b.x - a.x) * vx + (b.y - a.y) * vy) / L2; if (k <= 0 || k * len >= len - t.r * 0.5) continue;",
        "    if (know && !know(b)) continue;\n    if (lieLow(b) && lieOverP(W, self) < 0.5) continue;   // v7.14.1 엎드린 몸은 사선을 막지 않음 (위로 넘어감)\n    const k = ((b.x - a.x) * vx + (b.y - a.y) * vy) / L2; if (k <= 0 || k * len >= len - t.r * 0.5) continue;")
s = rep(s, "    if (!b.alive || b === u || b === t || b.side !== u.side) continue;\n    // 지금 자리와, 준비하는 동안 움직여 갈 자리 둘 다 봄",
        "    if (!b.alive || b === u || b === t || b.side !== u.side) continue;\n    if (lieLow(b) && lieOverP(W, u) < 0.5) continue;   // v7.14.1 엎드린 동료 위로 쏨\n    // 지금 자리와, 준비하는 동안 움직여 갈 자리 둘 다 봄")
# 오사 확률: 엎드린 몸은 막는 몸이 아니라 over 만큼만
s = rep(s, "    let hb = null, hk = 1e9;\n    for (const b of bodies){\n      const P = [[b.x, b.y]];",
        "    let hb = null, hk = 1e9; const lo = [];   // v7.14.1 lo = 사선 위의 엎드린 몸 (노린 몸 빼고)\n    for (const b of bodies){\n      const P = [[b.x, b.y]], low = b !== t && lieLow(b);")
s = rep(s, "        const k = (bx - x) * dx + (by - y) * dy; if (k <= u.r || k > lim || k >= hk) continue;\n        if (Math.hypot(bx - (x + dx * k), by - (y + dy * k)) <= b.r + (b.side === u.side ? 0.08 : 0)){ hk = k; hb = b; }",
        "        const k = (bx - x) * dx + (by - y) * dy; if (k <= u.r || k > lim || (!low && k >= hk)) continue;\n        if (Math.hypot(bx - (x + dx * k), by - (y + dy * k)) <= b.r + (b.side === u.side ? 0.08 : 0)){ if (low){ lo.push([k, b]); break; } hk = k; hb = b; }")
s = rep(s, "    if (hb && hb.side === u.side){ ff += w; if (w > ww){ ww = w; who = hb; } }\n  }\n  return { p: ff, who };",
        """    let pass = 1, lw2 = null; const op = lieOverP(W, u);
    for (const [k2, b2] of lo) if (k2 < hk && b2.side === u.side){ pass *= 1 - op; if (!lw2) lw2 = b2; }
    const fl = (1 - pass) + pass * (hb && hb.side === u.side ? 1 : 0);   // v7.14.1 엎드린 동료는 over 만큼만 · 그 너머 서 있는 동료는 그대로
    if (fl > 0){ ff += w * fl; if (w * fl > ww){ ww = w * fl; who = hb && hb.side === u.side ? hb : lw2; } }
  }
  return { p: ff, who };""")
# 실제 탄
s = rep(s, "        if (dd <= br && k < hk){ hk = k; hit = b; }\n        else if (dd <= b.r + NM",
        "        if (dd <= br && k < hk && !(b.i !== s.meant && lieLow(b) && lieOver(W, s, b))){ hk = k; hit = b; }   // v7.14.1 노린 몸이 아닌 엎드린 몸은 거의 위로 넘어감 (스침은 그대로)\n        else if (dd <= b.r + NM")
wr('rt3_tail.js', s)
print('patch7141 engine OK')

# ---------- 징검다리: 지휘 전달 시간 ----------
h = rd('rt3_head.js')
h = rep(h, "  cmdLinkX: { relayBusy: 0.6, relayCmd: 1.05, hop2: 0.85, hop2T: 0.6, relaySkill: 0.06, relayFast: 0.12, meshT: 0.9 },",
        "  cmdLinkX: { relayBusy: 0.6, relayCmd: 1.05, hop2: 0.85, hop2T: 0.05, relaySkill: 0.06, relayFast: 0.12, meshT: 0.9, hopT: 0.12, farT: 0.8, signFar: 0.8 },   // v7.14.1 징검다리: 명령을 꺼내는 시간 (report.base · signT) 은 지휘관만 · 전하는 동료는 들은 대로 바로 (hopT · 셋째 다리부터 + hop2T) · 멀리 외칠수록 되풀이 farT × ((거리 − near) / (외침 거리 − near))^1.5 · 멀리 손짓할수록 눈 맞추기 signFar × (… / (손짓 거리 − near))^1.5")
wr('rt3_head.js', h)
s = rd('rt3_tail.js')
s = rep(s, "function cmdLink1(W, C, u){\n  const K = W.rules.cmdLink || {}, d = dist(C, u), R = cmdRange(W, C), hear = Math.min(hearR(W, C, u), R), sr = R * 1.2, why = [];",
        """// v7.14.1 징검다리: 명령을 꺼내는 시간은 지휘관만 (relay = 전하는 동료는 들은 대로 바로 되외침) · 멀리 외칠수록 되풀이 · 멀리 손짓할수록 눈 맞추는 데 걸림 — 곁의 동료를 거치면 빨라짐
function cmdVoiceT(W, a, b, hr, relay){
  const K = W.rules.cmdLink || {}, X = W.rules.cmdLinkX || {}, R = W.rules.report || {}, d = dist(a, b), near = K.near != null ? K.near : 2.5, h0 = W.rules.hear || 9, loud = hr < h0 * 0.999 ? 1 - hr / h0 : 0;
  const t = (relay ? 0 : (R.base != null ? R.base : 0.4) * (1 + loud)) + d / (R.v || 15) + (X.farT != null ? X.farT : 0.8) * Math.pow(Math.max(0, d - near) / Math.max(1, hr - near), 1.5) * (1 + loud) + ((a.mute || b.mute) && !canSee(W, b, a) ? 1 : 0);
  return a.vet ? t * 0.8 : t;
}
const cmdSignT = (W, a, b, sr, lit, relay) => { const K = W.rules.cmdLink || {}, X = W.rules.cmdLinkX || {}, near = K.near != null ? K.near : 2.5; return ((relay ? 0 : K.signT || 0.35) + (X.signFar != null ? X.signFar : 0.8) * Math.pow(Math.max(0, dist(a, b) - near) / Math.max(1, sr - near), 1.5)) * (lit ? 1 : 1.4); };
function cmdLink1(W, C, u, relay){
  const K = W.rules.cmdLink || {}, d = dist(C, u), R = cmdRange(W, C), hr = hearR(W, C, u), hear = Math.min(hr, R), sr = R * 1.2, why = [];""")
s = rep(s, "  return { p, t: via === 'voice' ? relayT(W, C, u) : via === 'sign' ? (K.signT || 0.35) * (lit || ct ? 1 : 1.4) : 0, via, why, busy };",
        "  return { p, t: via === 'voice' ? cmdVoiceT(W, C, u, hr, relay) : via === 'sign' ? cmdSignT(W, C, u, sr, lit || ct, relay) : 0, via, why, busy };")
# 그물: 다리마다 시간 · 가장 빨리 닿는 길
s = rep(s, "  for (const a of N) for (const b of N) if (a !== b) Lg.set(a.i * 1000 + b.i, dist(a, b) <= near ? 1 : cmdLink1(W, a, b).p);",
        "  const Lt = new Map(); for (const a of N) for (const b of N) if (a !== b){ const k = a.i * 1000 + b.i; if (dist(a, b) <= near){ Lg.set(k, 1); Lt.set(k, K.nearT != null ? K.nearT : 0.08); } else { const l = cmdLink1(W, a, b, a !== C); Lg.set(k, l.p); Lt.set(k, l.t); } }   // v7.14.1 다리마다 걸리는 시간도")
s = rep(s, "  return (M[key] = { t: W.t, P, edges });",
        """  const T = {}; if (C){ const hopT = X.hopT != null ? X.hopT : 0.12, fin = new Set(); T[C.i] = 0;   // v7.14.1 징검다리: 가장 빨리 닿는 길 (30% 넘게 닿는 다리만)
    for (;;){ let a = null; for (const m of N) if (T[m.i] != null && !fin.has(m.i) && (!a || T[m.i] < T[a.i])) a = m; if (!a) break; fin.add(a.i);
      for (const b of N){ if (b === a || fin.has(b.i) || (Lg.get(a.i * 1000 + b.i) || 0) < 0.3) continue; const t = T[a.i] + Lt.get(a.i * 1000 + b.i) + (a === C ? 0 : hopT * Math.max(0.4, 1 - (X.relayFast != null ? X.relayFast : 0.12) * (a.cmd || 0))); if (T[b.i] == null || t < T[b.i]) T[b.i] = t; } } }
  return (M[key] = { t: W.t, P, T, edges });""")
s = rep(s, "    for (const [m, b1] of L1){ const b2 = cmdLink1(W, m, u), pr = b1.p * b2.p * (K.relay || 0.9) * q(m);   // 한 다리\n      if (pr > best.p) best = { p: Math.min(K.max || 0.98, pr), t: b1.t + b2.t + 0.3, via: 'relay',",
        "    for (const [m, b1] of L1){ const b2 = cmdLink1(W, m, u, true), pr = b1.p * b2.p * (K.relay || 0.9) * q(m);   // 한 다리\n      if (pr > best.p) best = { p: Math.min(K.max || 0.98, pr), t: b1.t + b2.t + (X.hopT != null ? X.hopT : 0.12), via: 'relay',")
s = rep(s, "      const b12 = cmdLink1(W, m1, m2); if (b12.p < 0.3) continue; const b2 = cmdLink1(W, m2, u), pr = b1.p * b12.p * b2.p",
        "      const b12 = cmdLink1(W, m1, m2, true); if (b12.p < 0.3) continue; const b2 = cmdLink1(W, m2, u, true), pr = b1.p * b12.p * b2.p")
s = rep(s, "t: b1.t + b12.t + b2.t + 0.3 + (X.hop2T || 0.6), via: 'relay', m: m1.i,", "t: b1.t + b12.t + b2.t + 2 * (X.hopT != null ? X.hopT : 0.12) + (X.hop2T != null ? X.hop2T : 0.05), via: 'relay', m: m1.i,")
s = rep(s, "  { const MP = (meshNet(W, u.side, C).P[u.i]) || 0, X2 = W.rules.cmdLinkX || {}; if (MP > best.p + 0.02) best = { ...best, p: Math.min(K.max || 0.98, MP), via: 'relay', t: best.via === 'relay' ? best.t : (X2.meshT || 0.9) + (best.via === 'none' ? 0 : best.t), why: '지휘망 — 곁의 동료들이 거듭 전함', c: C.i, mesh: true }; }   // v7.13 그물 (이중 전달)",
        """  { const MN = meshNet(W, u.side, C), MP = MN.P[u.i] || 0, MT = MN.T ? MN.T[u.i] : null, X2 = W.rules.cmdLinkX || {};
    if (MP > best.p + 0.02) best = { ...best, p: Math.min(K.max || 0.98, MP), via: 'relay', t: MT != null ? MT : best.via === 'relay' ? best.t : (X2.meshT || 0.9) + (best.via === 'none' ? 0 : best.t), why: '지휘망 — 곁의 동료들이 거듭 전함', c: C.i, mesh: true };   // v7.13 그물 (이중 전달)
    else if (MT != null && best.via !== 'none' && MT < best.t - 0.05 && MP >= best.p - 0.1) best = { ...best, t: MT, via: 'relay', mesh: true, fast: true, why: (best.why ? best.why + ' · ' : '') + '징검다리 — 곁의 동료를 거쳐 더 빨리' }; }   // v7.14.1""")
# 파동: 가장 먼저 닿는 길 (시간 순)
s = rep(s, "  const leg = (s, m) => dist(s, m) <= near && !(s.koT && W.t < s.koT) ? { p: 1, t: K.nearT != null ? K.nearT : 0.08, via: s.mute ? 'sign' : 'voice' } : cmdLink1(W, s, m);",
        "  const leg = (s, m, rl) => dist(s, m) <= near && !(s.koT && W.t < s.koT) ? { p: 1, t: K.nearT != null ? K.nearT : 0.08, via: s.mute ? 'sign' : 'voice' } : cmdLink1(W, s, m, rl);")
i0 = s.index("  let src = [{ u: C, t: 0, hop: 0, chain: [] }];\n  for (let hop = 1; hop <= hops && src.length; hop++){")
i1 = s.index("    src = nx; }\n", i0) + len("    src = nx; }\n")
old = s[i0:i1]
assert "W.rand() < p" in old and old.count("got.set(m.i, r)") == 1, old[:200]
s = s[:i0] + """  // v7.14.1 징검다리: 받은 이가 곧바로 곁에 되외침 — 가장 먼저 닿는 길 (시간 순 · 6단계까지). 다리마다 한 번만 굴림 · 먼 외침보다 곁의 동료를 거친 길이 빠르면 그 길로
  const best = new Map(), Q = [{ u: C, t: 0, hop: 0, chain: [] }], hopT = X.hopT != null ? X.hopT : 0.12;
  while (Q.length){
    let qi = 0; for (let j = 1; j < Q.length; j++) if (Q[j].t < Q[qi].t) qi = j; const s = Q.splice(qi, 1)[0];
    if (s.u !== C){ if (got.has(s.u.i)) continue; const r0 = best.get(s.u.i); if (!r0 || r0.t !== s.t) continue; got.set(s.u.i, r0); }
    if (s.hop >= hops) continue;
    for (const m of cand){
      if (got.has(m.i) || tried.has(s.u.i + '>' + m.i)) continue;
      const l = leg(s.u, m, s.hop > 0); let p = l.p * (s.hop > 0 ? (K.relay || 0.9) * qf(s.u) * (s.hop > 1 ? X.hop2 || 0.85 : 1) : 1); p = Math.min(K.max || 0.98, p);
      if (p < tol) continue; tried.add(s.u.i + '>' + m.i);
      if (W.rand() < p){ const t = s.t + l.t + (s.hop > 0 ? (hopT + (s.hop > 1 ? (X.hop2T != null ? X.hop2T : 0.05) : 0)) * Math.max(0.4, 1 - (X.relayFast != null ? X.relayFast : 0.12) * (s.u.cmd || 0)) : 0), cur = best.get(m.i);
        if (!cur || t < cur.t){ const r = { t, hop: s.hop + 1, via: s.hop === 0 ? l.via : 'relay', chain: s.hop === 0 ? [] : s.chain.concat([s.u.i]), from: s.u.i, p }; best.set(m.i, r); Q.push({ u: m, t, hop: s.hop + 1, chain: r.chain }); } } } }
""" + s[i1:]
s = rep(s, "cmdLinkM: cmdLink", "cmdLinkM: cmdLink, ffOdds")   # v7.14.1 시험용
wr('rt3_tail.js', s)
print('patch7141 stepping stones OK')
