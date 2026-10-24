# v9.4.1 엔진 — patch9060.py v1.0 (v1.0: 소모품 특수 스킬 (명세 A10) — 가방의 오래된 약병 (potion · vial) 이 있는 아군에게 특수 스킬 '오래된 약병' 이 뜸: 곁의 동료 (자기도) 에게 최대 체력 25% (15 ~ 60) 를 먹임 · 치료 스킬처럼 대상을 골라 씀 · 다 쓰면 스킬도 사라짐)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9050.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("bmend: { rng: 7, pct: 0.25,", "vial: { rng: 1.7, heal: 0.25, min: 15, cap: 60, wind: 0.5, rec: 0.3, cd: 1.0 }, bmend: { rng: 7, pct: 0.25,")   # v9.4.1 오래된 약병
rep("const SUP_K = ['mdesc', 'mwall', 'mspirit', 'mvolley', 'cgate', 'cstar', 'cveil', 'clure', 'tsweep', 'tflight', 'twing', 'tdream', 'bfield', 'bshove', 'bmend', 'braise', 'bcut', 'brain', 'hamb', 'hdisarm'];",
    "const SUP_K = ['mdesc', 'mwall', 'mspirit', 'mvolley', 'cgate', 'cstar', 'cveil', 'clure', 'tsweep', 'tflight', 'twing', 'tdream', 'bfield', 'bshove', 'bmend', 'braise', 'bcut', 'brain', 'hamb', 'hdisarm', 'vial'];")
rep("  if ((k === 'bmend' || k === 'braise') && t){ startSpec(", "  if ((k === 'bmend' || k === 'braise' || k === 'vial') && t){ startSpec(")
rep("  if (k === 'bmend'){ const a = A.tp != null ? W.units[A.tp] : null;", """  if (k === 'vial'){ const a = A.tp != null ? W.units[A.tp] : u; if (!a || !a.alive || a.gone || a.side !== u.side || dist(u, a) > (S.rng || 1.7) + 0.6){ L(W, { k: 'miss', a: u.i, b: A.tp != null ? A.tp : null, why: '먹일 동료가 없음 · 멀어짐', spec: k }); return; }
    const vi = (u.bag || []).findIndex(isVial8); if (vi < 0){ L(W, { k: 'miss', a: u.i, b: a.i, why: '약병이 없음', spec: k }); return; } const it = u.bag.splice(vi, 1)[0];
    const medK = gradeMul(W.rules, u.traits, '의학'), want = Math.round(Math.max(S.min || 15, Math.min(S.cap || 60, a.max * (S.heal != null ? S.heal : 0.25))) * medK), add = Math.max(0, Math.min(want, Math.round(a.max - a.hp)));
    a.hp += add; u.healed += add; if (a === u) u.healedSelf = (u.healedSelf || 0) + add; const left = (u.bag || []).filter(isVial8).length;
    L(W, { k: 'vial', a: u.i, b: a.i, n: add, left, w: it.label || it.name, vis }); if (W.fxOn){ W.fx.push({ k: 'shot', a: u.i, b: a.i, t0: W.t, dur: 0.25, heal: true }); W.fx.push({ k: 'num', x: a.x, y: a.y, s: '+' + add, c: 'h', t0: W.t }); } return; }
  if (k === 'bmend'){ const a = A.tp != null ? W.units[A.tp] : null;""")
rep("function bfTick(W){", """// v9.4.1 오래된 약병 (명세 A10): 가방의 약병이 있으면 특수 스킬 '오래된 약병' 이 뜸 (남은 수 = n) — 다 쓰면 스킬도 사라짐
const isVial8 = it => !!it && it.k === 'potion' && (it.vial || it.name === '오래된 약병');
function vialSync(W){
  if (W.t < (W.vialT || 0)) return; W.vialT = W.t + 0.5;
  for (const u of W.units){ if (!u.alive || u.gone || !u.bag) continue; const n = u.bag.filter(isVial8).length, i = (u.spec || []).findIndex(x => x.k === 'vial');
    if (n > 0 && i < 0 && !u.crawl) (u.spec || (u.spec = [])).push({ k: 'vial', name: '오래된 약병', cdT: -9, n });
    else if (i >= 0){ if (n > 0) u.spec[i].n = n; else { u.spec.splice(i, 1); if (u.order && u.order.k === 'spec' && u.order.s === 'vial') u.order = null; } } }
}
function bfTick(W){""")
rep("  bfTick(W); rampTick(W); radarTick(W);", "  bfTick(W); rampTick(W); radarTick(W); vialSync(W);   /* v9.4.1 */")
rep("module.exports = { wallLine,", "module.exports = { vialSync, isVial8, wallLine,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9060 OK')
