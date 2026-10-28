# v9.11.0 엔진 — patch9300.py v1.0 (v1.0: ① 빼꼼은 맞닿은 전열 (근접 · 지원 아님) 뒤에서만 — 나머지는 오사 규칙 ② 몸 사이 틈: 사수의 사선이 몸 + 0.15칸 안을 지나면 막힘 (손 · 무기 · 옷깃 — 던지기는 그대로) ③ 보호받을이 사수는 서둘러 대장 등 뒤에 붙고 거기서 빼꼼 ④ 빼꼼 상태 peekState (판 표시) ⑤ 사수는 망치 (옆으로 돌아 협공) 대상이 아님 — 바로 쫓아 침 · 사수 쫓기 3초 유지 ⑥ 지휘관 임명 (cmdHat) — 임명된 이가 그 편 지휘 · 지휘 재능이 없으면 기본 (C) ⑦ 전리품 목록에 제 것 (던진 창 · 놓친 무기) 도 보임 — '제 것 · 저절로 돌아감')
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9290.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# ② 틈
rep("if (Math.hypot(b.x - px, b.y - py) <= b.r + 0.06) out.push([k, b]);", "if (Math.hypot(b.x - px, b.y - py) <= b.r + (self && isFar(self) ? 0.15 : 0.06)) out.push([k, b]);   /* v9.11.0 사수의 사선: 몸 + 0.15칸 (손 · 무기 · 옷깃) — 몸 사이 좁은 틈으로는 못 쏨 */")
# ① 빼꼼: 맞닿은 전열 뒤에서만
rep("fb.side !== u.side || gap(u, fb) > 2.5) return null;", "fb.side !== u.side || gap(u, fb) > 0.3 || !frontL(fb)) return null;   /* v9.11.0 맞닿은 전열 (근접 · 지원 아님) 뒤에서만 — 아니면 오사 규칙 */")
rep("const f2 = W.units.find(o => o !== fb && o.alive && o.side === u.side && !o.down && gap(o, fb) <= 0.25", "const f2 = W.units.find(o => o !== fb && o.alive && o.side === u.side && !o.down && frontL(o) && gap(o, fb) <= 0.25")
# ⑤ 사수는 망치 대상이 아님 · 사수 쫓기 유지
rep(".filter(f => f.side !== u.side && !W.hm.pins.get(f.i).includes(u.i)", ".filter(f => f.side !== u.side && !isFar(f) && !W.hm.pins.get(f.i).includes(u.i)")
rep("W.hm.pins.has(u.hmS.b) ? W.units[u.hmS.b] : null;", "W.hm.pins.has(u.hmS.b) && !isFar(W.units[u.hmS.b]) ? W.units[u.hmS.b] : null;   /* v9.11.0 사수는 돌아 들어가지 않고 바로 쫓아 침 */")
rep("if (known){ u.target = sh; u.state = 'hunt'; return false; }", "if (known){ u.target = sh; u.state = 'hunt'; u.shGo = { b: sh.i, until: W.t + 3 }; return false; }")
rep("const fast1 = u.role === '미드필더'", "{ const S0 = u.shGo && W.t < u.shGo.until ? W.units[u.shGo.b] : null; if (S0 && S0.alive && !S0.down && !S0.gone){ u.target = S0; u.state = 'hunt'; return false; } }   /* v9.11.0 사수를 쫓기 시작하면 3초는 이어감 (대장 곁 ↔ 사수 오가지 않음) */\n    const fast1 = u.role === '미드필더'")
# ③ 보호받을이 사수: 대장 등 뒤에 붙은 뒤에 쏨 (빼꼼)
rep("if (isFar(u) && u.cls !== '치유'){ const know = knows(W, u); if (W.units.some(", "if (isFar(u) && u.cls !== '치유' && (!frontL(C) || gap(u, C) <= 0.45 || W.units.some(f => seenF(f) && gap(u, f) < 2.2))){ const know = knows(W, u); if (W.units.some(")
rep("return go(sx, sy, running(W, C) || dist(u, C) > 2.2,", "return go(sx, sy, running(W, C) || dist(u, C) > 2.2 || (heal && isFar(u) && dd > 0.6),")
# ⑥ 지휘관 임명
rep(".sort((a, b) => b.cmd - a.cmd)[0]", ".sort(cmdSort)[0]", 2)
rep(".sort((p, q) => q.cmd - p.cmd)[0]", ".sort(cmdSort)[0]")
rep("function hitCover(W, u, dt){", """const frontL = o => !!o && !isFar(o) && !isSupport(o) && o.cls !== '치유' && !o.down && !o.lie && !o.crawl;   /* v9.11.0 전열 몸 (빼꼼을 받쳐 줌) */
// v9.11.0 빼꼼 상태: 사수가 맞닿은 전열 등 뒤에 붙어 그 너머를 겨누는 중 (총안) — 그 전열을 돌려줌
function peekState(W, u){ if (!u.alive || u.down || !isFar(u) || u.lie || u.crawl) return null; const t = u.target && u.target.alive ? u.target : null, fa = t ? Math.atan2(t.y - u.y, t.x - u.x) : (u.face || 0);
  let best = null; for (const o of W.units){ if (o === u || o.side !== u.side || !frontL(o) || gap(u, o) > 0.3) continue; if (angDiff(Math.atan2(o.y - u.y, o.x - u.x), fa) > 1.3) continue; if (!best || dist(u, o) < dist(u, best)) best = o; } return best; }
const cmdSort = (a, b) => (b.cmdHat ? 1 : 0) - (a.cmdHat ? 1 : 0) || (b.cmd || 0) - (a.cmd || 0);   /* v9.11.0 임명된 지휘관이 먼저 */
function appointCmdr(W, u){ if (!u || !u.alive) return false;
  for (const o of W.units) if (o.side === u.side && o !== u){ if (o.cmdHat){ o.cmdHat = false; if (o.cmdHatTmp){ o.cmd = 0; o.cmdHatTmp = false; } } if (o.cmdTmp){ o.cmd = 0; o.cmdTmp = false; } }
  u.cmdHat = true; if (!(u.cmd > 0)){ u.cmd = 1; u.cmdHatTmp = true; } L(W, { k: 'cmdHat', a: u.i, c: u.cmd, vis: u.side === 0 }); return true; }
function hitCover(W, u, dt){""")
rep("sig = (W.items || []).filter(it => it.k === 'weapon' || it.k === 'shield').map(it => it.id).join(',')", "sig = (W.items || []).filter(it => it.k === 'weapon' || it.k === 'shield' || it.k === 'spear').map(it => it.id).join(',')")
rep("for (const it of W.items || []){ if (it.k !== 'weapon' && it.k !== 'shield') continue; if (it.own && mine.has(it.own)) continue;", """for (const it of W.items || []){ { const o = W.units[it.owner], back = it.k === 'spear' ? (o && o.side === 0 && (o.alive || o.gone) ? o : null) : (it.k === 'weapon' || it.k === 'shield') && it.own && mine.has(it.own) ? W.units.find(u => u.side === 0 && ownKey(u) === it.own) : null;   /* v9.11.0 제 것 (던진 창 · 놓친 무기) — 목록에 보이고 저절로 돌아감 */
      if (back){ const nm = String(back.name || '').replace(/\\s*\\d+$/, ''); put('own' + it.id, { k: it.k === 'shield' ? 'shield' : 'weapon', name: it.name, label: it.label || nm + '의 ' + it.name, dur: it.dur != null ? +it.dur : 100, own: ownKey(back), taken: nm + ' (제 것 — 판이 끝나면 저절로 돌아감)', mineBack: true }); continue; } }
    if (it.k !== 'weapon' && it.k !== 'shield') continue; if (it.own && mine.has(it.own)) continue;""")
rep("module.exports = { hitCover,", "module.exports = { peekState, appointCmdr, cmdSort, frontL, lineBodies, lootOf, hammerStep, hitCover,")
rep("if (!rearGo && W.units.some(f => f.alive && !f.gone && f.side !== u.side && u.target === f && gap(u, f) < u.rng + 0.3)) return false;", "if (!rearGo && !(isFar(u) && coverU(u)) && W.units.some(f => f.alive && !f.gone && f.side !== u.side && u.target === f && gap(u, f) < u.rng + 0.3)) return false;   /* v9.11.0 보호받을이 사수는 사거리 안이어도 먼저 대장 등 뒤로 (아래에서 판단) */")
rep("const eng = W.units.some(f => f.alive && !f.gone && f.side !== u.side && !f.down && gap(u, f) < Math.max(u.rng, 0.5) + 0.35);", "const eng = W.units.some(f => f.alive && !f.gone && f.side !== u.side && !f.down && gap(u, f) < (isFar(u) && coverU(u) ? 0.5 : Math.max(u.rng, 0.5)) + 0.35);   /* v9.11.0 보호받을이 사수: 사거리 안의 적은 '맞붙음' 이 아님 */")
rep("L0 = Math.min(fb.r + u.r, (fb.r + 0.12)", "L0 = Math.min(fb.r + u.r + 0.1, (fb.r + 0.2)")   # v9.11.0 사선 여유가 넓어진 만큼 어깨 자리도 조금 더 옆
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9300 OK')
