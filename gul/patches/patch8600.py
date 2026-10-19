# v8.6.0 엔진 — patch8600.py v1.1 (v1.1: [대리석 피부] 는 몇 톤 — 넘어지지 않음 · 급소 · 상처 없음 (판 재기: 넘어진 적뢰가 짓밟기 확인사살로 한 방에 녹던 것) · v1.0: patch8410.py 를 먼저 돌린 뒤: [대리석 피부] (굴 3D v0.9 units.js 그대로 — 강공이 아니면 59% 로 받아 내 피해 × 0.3 · 강공 (치명 · 관통 · 돌진 · 투창 · 큰 한 방) 이 오면 4초마다 옆으로 2.2칸 스텝해 흘림) · 하늘에 뜬 몸 (jrFly) 은 근접이 닿지 않음 · 떠오르는 동안 (jrInv) 은 무엇도 닿지 않음 · 대본으로 싸우는 몸 (jrB) 은 엔진 평타를 쓰지 않음 (대리석 주먹은 대본) · 양쪽 같음)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8410.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
P = {'head': H, 'mid': M, 'tail': T}
def rep(_, a, b, c=1):   # 세 조각 가운데 그 글이 있는 곳에서 바꿈
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
    return None

rep(H, "radar: { gap: 3, dur: 1.2, r: 14 },", "radar: { gap: 3, dur: 1.2, r: 14 },\n  marble: { p: 0.59, mul: 0.3, strong: 60, stepCd: 4, step: 2.2 },   /* v8.6.0 [대리석 피부] (굴 3D v0.9): 강공이 아니면 p 로 받아 냄 (× mul) · 강공 (치명 · 관통 · 돌진 · 투창 · strong 넘는 한 방 — 2D 의 강공 15 × 우리 한 방 / 2D 한 방 (≈ 4) ) 은 stepCd 초마다 step 칸 옆으로 흘림 */")
rep(T, "radar: tr.includes('레이더'),", "radar: tr.includes('레이더'), marble: tr.includes('대리석 피부'),")
rep(M, "function applyDmg(W, u, t, dmg, o){\n",
        "function applyDmg(W, u, t, dmg, o){\n"
        "  if (t.marble || t.jrFly || t.jrInv){ dmg = marbleHit(W, u, t, dmg, o); if (!(dmg > 0)) return; }   /* v8.6.0 [대리석 피부] · 하늘 · 떠오름 */\n")
rep(M, "function alertNear(W, e, target){",
        "// v8.6.0 [대리석 피부] · 하늘에 뜬 몸: 0 이면 닿지 않음 (흘림 · 받아 냄은 로그 'marble'). 감전 · 잔류 · 출혈 · 화상 같은 몸 안의 피해와 스스로의 기술 (jrOwn) 은 그대로\n"
        "function marbleHit(W, u, t, dmg, o){\n"
        "  if (!t.alive || !u || u === t || (o && (o.ff || o.dot || o.jrOwn)) || /출혈|화상|감전|잔류/.test((o && o.tag) || '')) return dmg;\n"
        "  const vis = t.side === 0 || u.side === 0 || !!t.seenBy;\n"
        "  if (t.jrInv && W.t < t.jrInv){ if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.8, s: '닿지 않음', c: 'b', t0: W.t }); return 0; }\n"
        "  if (t.jrFly && !(o && (o.far || o.jav))){ if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.8, s: '하늘 — 닿지 않음', c: 'b', t0: W.t }); return 0; }\n"
        "  if (!t.marble) return dmg;\n"
        "  const R = W.rules.marble || {}, strong = !!(o && (o.crit || o.hcrit || o.pen || o.strong || o.jav || /돌진|돌격|투창|찍기|내려찍|버팀 \\(큰 피해\\)/.test(o.tag || ''))) || dmg >= (R.strong || 30);\n"
        "  if (strong && !t.jrBusy && !t.jrFly && W.t >= (t.mStepT || -9) && !t.down && !t.kb && W.t >= (t.stunT || -9)){\n"
        "    const a0 = Math.atan2(t.y - u.y, t.x - u.x), L0 = R.step || 2.2;\n"
        "    for (const da of W.rand() < 0.5 ? [1.4, -1.4, 0.9, -0.9] : [-1.4, 1.4, -0.9, 0.9]) for (const k of [1, 0.7]){ const x = t.x + Math.cos(a0 + da) * L0 * k, y = t.y + Math.sin(a0 + da) * L0 * k;\n"
        "      if (x < 1 || y < 1 || x > W.map.W - 1 || y > W.map.H - 1 || boxRock(W, x, y, t.r * 0.9) || W.units.some(q => q.alive && q !== t && Math.hypot(q.x - x, q.y - y) < q.r + t.r * 0.8)) continue;\n"
        "      t.mStepT = W.t + (R.stepCd || 4); t.x = x; t.y = y; stop(t);\n"
        "      L(W, { k: 'marble', a: u.i, b: t.i, how: 'step', dmg: Math.round(dmg), vis }); if (W.fx && W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.8, s: '스텝', c: 'b', t0: W.t });\n"
        "      return 0; } }\n"
        "  if (!strong && W.rand() < (R.p != null ? R.p : 0.59)){ const d2 = Math.max(1, Math.round(dmg * (R.mul != null ? R.mul : 0.3))); L(W, { k: 'marble', a: u.i, b: t.i, how: 'block', dmg: Math.round(dmg), got: d2, vis }); o.tag = o.tag || '대리석 피부'; return d2; }\n"
        "  return dmg;\n"
        "}\n"
        "function alertNear(W, e, target){")
# 몇 톤의 대리석 (2D 무게 2000 · 3D marble): 넘어지지 않음 · 급소 (심장 · 머리 관통) 가 없음 · 상처 (부위 · 출혈 · 치명상) 가 나지 않음 — 그냥 맞음
rep(T, "function knockDown(W, u, sec, by, why){\n  if (!u.alive || u.crawl || W.t < (u.saT || -9)) return;", "function knockDown(W, u, sec, by, why){\n  if (!u.alive || u.crawl || W.t < (u.saT || -9)) return;\n  if (u.marble){ if (typeof ccShrug === 'function') ccShrug(W, u, by, 'prone'); return; }   /* v8.6.0 [대리석 피부]: 몇 톤 — 넘어지지 않음 */")
rep(T, "if (vp && !(extra && extra.noWound) && !o.deflect){", "if (vp && !(extra && extra.noWound) && !o.deflect && !t.marble){   /* v8.6.0 [대리석 피부]: 급소가 없음 */")
rep(T, "function woundRoll(W, a, t, o, dmg, part, crit, pen, mix0){\n  const R = WR(W); if (!R || AI6.includes('wound') ||", "function woundRoll(W, a, t, o, dmg, part, crit, pen, mix0){\n  const R = WR(W); if (!R || t.marble || AI6.includes('wound') ||")   # v8.6.0 [대리석 피부]: 상처가 나지 않음
rep(T, "function startAct(W, u, t, why){\n", "function startAct(W, u, t, why){\n  if (u.jrB) return;   /* v8.6.0 대본으로 싸우는 몸 (적뢰): 대리석 주먹은 대본이 침 */\n")
for n, s in P.items():
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8600 OK')
