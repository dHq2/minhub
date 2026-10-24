# v9.6.5 엔진 — patch9120.py v1.0 (v1.0: ① 개인 본능은 양쪽 편 모두 — 망치 (붙들린 상대의 옆 · 뒤로) · '뒤로!' 를 들으면 탱커 뒤로 · 동료 거구의 휘두르기 부채꼴에서 미리 비켜섬 · 총구 피하기 (예전엔 한쪽에만) ② 전우조를 유동적으로 — 짝이 붙든 적은 반대 옆 · 뒤로 돌아 함께 포위 · 짝이 적을 마주한 채 물러나면 같이 적을 보고 방패를 들고 물러남 · 짝이 둘 넘게에게 몰리거나 노려진 채 다쳤으면 (60%) 구하러 감)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9110.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# ① 개인 본능 — 양쪽
rep("  if (u.side === 0 && hammerStep(W, u, dt)) return;", "  if (hammerStep(W, u, dt)) return;   /* v9.6.5 개인 본능 — 양쪽 편 */")
rep("  if (u.side === 1 && clearSweep(W, u, dt)) return;", "  if (clearSweep(W, u, dt)) return;   /* v9.6.5 개인 본능 — 양쪽 편 */")
rep("  if (u.side === 1 && !u.order && mvStep(W, u, dt)) return;", "  if (!u.order && mvStep(W, u, dt)) return;   /* v9.6.5 아군은 본능 (총구 피하기) 만 — 지휘관 전술은 적만 (아군은 플레이어가) */")
rep("  if (u.side === 0 && u.role !== '전선' && !u.stay && behindCover(W, u, dt)) return;", "  if (u.role !== '전선' && !u.stay && behindCover(W, u, dt)) return;   /* v9.6.5 개인 본능 — 양쪽 편 */")
rep("  if (u.side !== 1 || AI6.includes('mv')) return false;", "  if (AI6.includes('mv')) return false;\n  if (u.side !== 1) return jinkStep(W, u, dt);   /* v9.6.5 아군: 총구 피하기 (본능) 만 */")
rep("function mvStep(W, u, dt){", """// v9.6.5 총구 피하기 (본능 — 양쪽 편): 나를 겨눈 사수가 보이면 사선만 비키며 하던 쪽으로 파고듦
function jinkStep(W, u, dt){
  if (u.mv && u.mv.k === 'jink' && mvOn(W, u)){ if (Math.hypot(u.mv.x - u.x, u.mv.y - u.y) < 0.35){ u.mv = null; return false; } setGoal(W, u, u.mv.x, u.mv.y); follow(W, u, dt, 1); return true; }
  if (AI6.includes('nojink') || mvOn(W, u) || W.t < (u.jinkT || 0) || u.line || u.lurk || u.crawl || u.lie || busyW(W, u) || u.stay) return false;
  const g = W.units.find(x => x.alive && x.side !== u.side && isFar(x) && x.act && x.act.k === 'atk' && x.act.phase === 'wind' && x.act.b === u.i && canSee(W, u, x)); if (!g) return false;
  const a = Math.atan2(u.y - g.y, u.x - g.x), sc = p => W.units.filter(m => m.alive && m !== u && m.side === u.side && (m.shield || m.bodyShield || m.giant) && segD(g, p.x, p.y, m) < m.r + 0.2).length;
  const fw = u.target && u.target.alive ? Math.atan2(u.target.y - u.y, u.target.x - u.x) : a + Math.PI, fx = Math.cos(fw) * 0.8, fy = Math.sin(fw) * 0.8;
  const p = [a + Math.PI / 2, a - Math.PI / 2].map(b => ({ x: u.x + Math.cos(b) * 1.1 + fx, y: u.y + Math.sin(b) * 1.1 + fy })).filter(p => p.x > 0.6 && p.y > 0.6 && p.x < W.map.W - 0.6 && p.y < W.map.H - 0.6 && !boxRock(W, p.x, p.y, u.r)).sort((p, q) => sc(q) - sc(p))[0];
  if (!p) return false; u.mv = { k: 'jink', x: p.x, y: p.y, b: g.i, run: true, until: W.t + 0.7 }; u.jinkT = W.t + 2.5; L(W, { k: 'mvr', side: u.side, m: 'jink', a: u.i, b: g.i, cover: sc(p) > 0, obs: true, vis: true }); return false;
}
function mvStep(W, u, dt){""")
# 망치: 양쪽 편의 붙들린 몸
rep("  for (const f of W.units){ if (!f.alive || f.side !== 1 || !(f.seenBy)) continue;\n    for (const a of W.units){ if (!a.alive || a.side !== 0 || a.down || isFar(a)",
    "  for (const f of W.units){ if (!f.alive || f.gone || (f.side === 1 && !f.seenBy)) continue;   /* v9.6.5 양쪽 편 */\n    for (const a of W.units){ if (!a.alive || a.side === f.side || a.down || isFar(a)")
rep("const c = [...W.hm.pins.keys()].map(i => W.units[i]).filter(f => !W.hm.pins", "const c = [...W.hm.pins.keys()].map(i => W.units[i]).filter(f => f.side !== u.side && !W.hm.pins")
# ② 위급한 전우: 둘 넘게에게 몰림 · 노려진 채 60% 아래도
rep("if (!(m.down || m.crawl || m.hp / m.max < (K.rescueHp || 0.4))) continue;",
    "const mob = W.units.filter(f => f.alive && !f.gone && f.side !== m.side && !isFar(f) && gap(f, m) < f.rng + 0.6 && (f.target === m || focusOf(W, f) === m)).length;   /* v9.6.5 둘 넘게에게 몰리거나 노려진 채 다침 */\n    if (!(m.down || m.crawl || m.hp / m.max < (K.rescueHp || 0.4) || mob >= 2 || (mob >= 1 && m.hp / m.max < 0.6))) continue;")
# 전우가 붙든 적: 반대 옆 · 뒤로 돌아 포위 (돌격 옆구리와 같은 길)
rep("  if (chg && !eng){ const T = T0;", """  if (!eng){ const rs = mateRescue(W, u, W.units.filter(f => f.alive && !f.gone && !f.down && f.side !== u.side && (u.side === 0 ? f.seenBy : canSee(W, u, f)))); if (rs){ u.target = rs; u.state = 'hunt'; u.pairOn = false; u.stay = null; return false; } }   /* v9.6.5 위급한 전우 먼저 */
  if (!chg && !isFar(u)){ const fp = matesOf(W, u).find(p => !p.down && p.target && p.target.alive && !p.target.down && p.target.side !== u.side && gap(p, p.target) < p.rng + 0.5 && canSee(W, u, p.target) && dist(u, p.target) < 7);   /* v9.6.5 짝이 붙든 적 — 함께 포위 */
    if (fp && !W.units.some(f => f !== fp.target && f.alive && !f.gone && f.side !== u.side && !f.down && gap(u, f) < Math.max(u.rng, 0.5) + 0.35)){ const T = fp.target, a0 = Math.atan2(fp.y - T.y, fp.x - T.x), s = Math.sin(Math.atan2(u.y - T.y, u.x - T.x) - a0) >= 0 ? 1 : -1, fa = a0 + s * 2.0, R = T.r + u.r + Math.max(0.25, u.rng * 0.7);
      if (gap(u, T) < u.rng + 0.35 && angDiff(Math.atan2(u.y - T.y, u.x - T.x), fa) < (eng ? 0.6 : 0.45)){ u.target = T; u.state = 'hunt'; u.pincT = W.t + 0.6; return false; }
      u.pincT = W.t + 0.6; return go(T.x + Math.cos(fa) * R, T.y + Math.sin(fa) * R, dist(u, T) > 2.5, 'pincer', fp, T); } }
  if (chg && !eng){ const T = T0;""")
# 짝이 적을 마주한 채 물러남 — 같이 적을 보고 방패를 들고
rep("    u.pairOn = true; u.pairT = W.t; const d0 = dist(u, LP);\n    return go(x, y, running(W, LP) || d0 > 2.5 || sp > u.spd * 0.85, d0 > 2.5 ? 'keep' : 'link', LP, null); }",
    """    u.pairOn = true; u.pairT = W.t; const d0 = dist(u, LP);
    const th = sp > 0.3 ? W.units.filter(f => f.alive && !f.gone && f.side !== u.side && !f.down && dist(f, LP) < 7 && (u.side === 0 ? f.seenBy : canSee(W, u, f))).sort((a, b) => dist(a, LP) - dist(b, LP))[0] : null;
    const back = th && ((LP.x - th.x) * vx + (LP.y - th.y) * vy) / (dist(LP, th) || 1) > sp * 0.5;   /* v9.6.5 짝이 적에게서 물러나는 중 */
    const r0 = go(x, y, running(W, LP) || d0 > 2.5 || sp > u.spd * 0.85 || (back && d0 > 1.3), back ? 'retreat' : d0 > 2.5 ? 'keep' : 'link', LP, back ? th : null);
    if (r0 && back){ u.fg = Math.atan2(th.y - u.y, th.x - u.x); if (u.canGuard && !u.raised && u.guardMode !== 'off'){ u.raised = true; u.raiseAt = W.t + ((W.rules.guard || {}).raise != null ? W.rules.guard.raise : 0.25) * (u.vet ? VETR(W).raise : 1); } u.wantT = W.t; setMood(W, u, LP.name + '와 함께 물러남 — ' + th.name + '을 보며', th.i); }
    return r0; }""")
rep("module.exports = { pairStep,", "module.exports = { jinkStep, pairStep,")
rep("  for (const u of W.units){ if (u.side !== 0) continue; const was = u.hm; let nu = null;", "  for (const u of W.units){ const was = u.hm; let nu = null;   /* v9.6.5 망치 · 모루 — 양쪽 편 */")
rep("u.hm = nu; if (nu && (!was || was.k !== nu.k || was.b !== nu.b)) L(W, { k: 'hm', a: u.i, r: nu.k, b: nu.b, vis: true }); }", "u.hm = nu; if (nu && (!was || was.k !== nu.k || was.b !== nu.b)) L(W, { k: 'hm', a: u.i, r: nu.k, b: nu.b, vis: u.side === 0 || !!u.seenBy }); }")
rep("  if (!u.order && (lineKeep(W, u, dt) || lineJoin(W, u, dt))) return;", "  if (!u.order && !(u.pincT && W.t < u.pincT) && (lineKeep(W, u, dt) || lineJoin(W, u, dt))) return;   /* v9.6.5 전우와 포위 중엔 자석 전열로 끌려가지 않음 */")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9120 OK')
