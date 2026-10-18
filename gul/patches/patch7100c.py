# v7.10.0 C: 명령은 동시에 퍼지고, 들은 이가 2차로 전함 (전파 파동 cmdWave)
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    return s.replace(a,b)
h=open(D+'rt3_head.js').read()
h=rep(h,"   v7.9.5: 사용자 검수","""           명령은 동시에 퍼짐 (전파 파동): 지휘관의 외침 · 손짓은 닿는 모두에게 한꺼번에 가고, 그걸 받은 이가 못 받은 이에게 2차로 전함 (받은 이만 전할 수 있음 — 받지 못한 이는 못 전함). 받은 이는 바쁘면 덜 확실, 부지휘관 · 부대장은 더 확실. 두 번 전하면 (3단) 더 늦고 덜 확실.
   v7.9.5: 사용자 검수""")
h=rep(h,"cmdLink: { near: 2.5,","cmdLinkW: { hops: 3, tol: 0.12 },   // v7.10 전파 파동: 받음 단계 (지휘관 → 1차 → 2차 → 3차 = 두 다리 전달까지) · 이보다 낮은 확률은 시도 안 함\n  cmdLink: { near: 2.5,")
open(D+'rt3_head.js','w').write(h)
t=open(D+'rt3_tail.js').read()
t=rep(t,"/* ---------- v7.9 교전 규칙 (태세) ----------","""// v7.10 전파 파동: 지휘관의 말이 닿는 모두에게 동시에 가고, 받은 이가 못 받은 이에게 2차로 전함. list 의 각 이에게 {p: 기대 확률 (표시용), ok: 이번에 받았나, t: 받는 때, via, m, m2: 거친 이, hop: 받음 단계} 를 돌려줌
function cmdWave(W, C, list){
  if (!C) return list.map(() => ({ p: 0, t: 0, via: 'none', why: '지휘관이 없음', c: null, ok: false }));
  if (AI6.includes('cmdlink')) return list.map(u => ({ p: 1, t: 0, via: 'self', why: '', c: C.i, ok: true }));
  const K = W.rules.cmdLink || {}, X = W.rules.cmdLinkX || {}, V = W.rules.cmdLinkW || {}, hops = V.hops || 3, tol = V.tol != null ? V.tol : 0.12, near = K.near != null ? K.near : 2.5;
  const okm = m => m !== C && m.alive && !m.crawl && m.side === C.side && !(m.koT && W.t < m.koT);
  const cand = W.units.filter(okm), got = new Map(), tried = new Set();
  const qf = m => (m.act && ['atk', 'skill', 'reload', 'heal'].includes(m.act.k) || W.units.some(f => f.alive && f.side !== m.side && !isFar(f) && gap(m, f) < Math.max(m.rng, f.rng) + 0.3) ? (X.relayBusy != null ? X.relayBusy : 0.6) : 1) * (m.rank === '부대장' ? (X.relayRank || 1.12) : m.cmd > 0 ? (X.relayCmd || 1.05) : 1);
  const leg = (s, m) => dist(s, m) <= near && !(s.koT && W.t < s.koT) ? { p: 1, t: K.nearT != null ? K.nearT : 0.08, via: s.mute ? 'sign' : 'voice' } : cmdLink1(W, s, m);
  let src = [{ u: C, t: 0, hop: 0, chain: [] }];
  for (let hop = 1; hop <= hops && src.length; hop++){
    const nx = [];
    for (const s of src){
      for (const m of cand){
        if (got.has(m.i) || tried.has(s.u.i + '>' + m.i)) continue;
        const l = leg(s.u, m); let p = l.p * (s.hop > 0 ? (K.relay || 0.9) * qf(s.u) * (s.hop > 1 ? X.hop2 || 0.85 : 1) : 1); p = Math.min(K.max || 0.98, p);
        if (p < tol) continue; tried.add(s.u.i + '>' + m.i);
        if (W.rand() < p){ const r = { t: s.t + l.t + (s.hop > 0 ? 0.3 + (s.hop > 1 ? X.hop2T || 0.6 : 0) : 0), hop, via: s.hop === 0 ? l.via : 'relay', chain: s.hop === 0 ? [] : s.chain.concat([s.u.i]), from: s.u.i, p }; got.set(m.i, r); nx.push({ u: m, t: r.t, hop, chain: r.chain }); } } }
    src = nx; }
  return list.map(u => {
    if (u === C) return { p: 1, t: 0, via: 'self', why: '', c: C.i, ok: true };
    const a = cmdLink(W, C, u), r = got.get(u.i);
    if (!r) return { p: a.p, t: a.t, via: a.via, why: a.why, c: C.i, m: a.m, m2: a.m2, ok: false };
    const nm = i => W.units[i].name;
    return { p: Math.max(a.p, r.p), t: r.t, via: r.via, why: r.via === 'relay' ? (r.chain.length === 1 ? nm(r.chain[0]) + '을 거쳐 전함' : r.chain.map(nm).join(' → ') + ' 두 다리로 전함') + ' (2차 전파)' : a.why, c: C.i, m: r.chain[0], m2: r.chain[1], hop: r.hop, ok: true }; });
}
/* ---------- v7.9 교전 규칙 (태세) ----------""")
t=rep(t,"""  for (const u of list){ if (!u.alive || u.side !== 0) continue;
    const lk = raw || pre ? { p: 1, t: 0, via: 'self' } : cmdLink(W, C, u);
    u.posPend = (u.posPend || []).filter(q => q.key !== key);
    if (lk.via === 'self'){ applyPosture(W, u, key, val, C ? C.i : null); continue; }
    u.posPend.push({ key, val, at: W.t + lk.t, ok: W.rand() < lk.p,""","""  const lst = list.filter(u => u.alive && u.side === 0), wv = raw || pre ? null : cmdWave(W, C, lst);
  for (const u of lst){ const k0 = lst.indexOf(u);
    const lk = wv ? wv[k0] : { p: 1, t: 0, via: 'self' };
    u.posPend = (u.posPend || []).filter(q => q.key !== key);
    if (lk.via === 'self'){ applyPosture(W, u, key, val, C ? C.i : null); continue; }
    u.posPend.push({ key, val, at: W.t + lk.t, ok: lk.ok !== undefined ? lk.ok : W.rand() < lk.p,""")
# 집결
t=rep(t,"""  for (const u of al){ if (u.order) continue; if (u === C){ u.rally = { x: px, y: py, t0: W.t, until: W.t + (R.hold || 20), by: C.i }; got.push(u.i); continue; }
    const lk = cmdLink(W, C, u); if (W.rand() < lk.p){""","""  const rl = al.filter(u => !u.order && u !== C), rw = cmdWave(W, C, rl);
  for (const u of al){ if (u.order) continue; if (u === C){ u.rally = { x: px, y: py, t0: W.t, until: W.t + (R.hold || 20), by: C.i }; got.push(u.i); continue; }
    const lk = rw[rl.indexOf(u)]; if (lk.ok){""")
# 전열 후퇴
t=rep(t,"""  for (const m of M){ const lk = by === 'user' && W.t <= 1e-6 ? { p: 1, t: 0, via: 'self' } : cmdLink(W, boss, m), ok = W.rand() < lk.p;""","""  const lw = by === 'user' && W.t <= 1e-6 ? null : cmdWave(W, boss, M);
  for (const m of M){ const lk = lw ? lw[M.indexOf(m)] : { p: 1, t: 0, via: 'self' }, ok = lk.ok !== undefined ? lk.ok : W.rand() < lk.p;""")
t=rep(t,"module.exports = { identOK,","module.exports = { cmdWave, identOK,")
open(D+'rt3_tail.js','w').write(t)
p=open(D+'page10.tpl.html').read()
p=rep(p,"  const lks = list.map(u => raw || pre ? { p: 1, t: 0, via: 'self' } : cmdLink(W, C, u));","  const wv = raw || pre ? null : cmdWave(W, C, list), lks = list.map((u, k) => wv ? wv[k] : { p: 1, t: 0, via: 'self' });   // v7.10 명령은 동시에 퍼지고 들은 이가 2차로 전함")
p=rep(p,"u.ordPend = { o: nu, m2: lk.m2, at: W.t + lk.t, ok: W.rand() < lk.p,","u.ordPend = { o: nu, m2: lk.m2, at: W.t + lk.t, ok: lk.ok !== undefined ? lk.ok : W.rand() < lk.p, hop: lk.hop,")
open(D+'page10.tpl.html','w').write(p); print('ok')
