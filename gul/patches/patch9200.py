# v9.9.1 엔진 — patch9200.py v1.0 (v1.0: 관계 다시 — ① 추종 (부하): 평소엔 대장 등 뒤에 비비듯 붙음 (부하가 여럿이면 등 뒤로 부채처럼) · 쫓아갈 땐 서둘러 · 대장이 싸우면: 팔이 닿는 부하는 뒤에서 함께 치고 · 발 빠른 근접 부하는 상대의 등 뒤로 돌아 들어가고 · 끝나면 다시 등 뒤로 / 치유는 한 걸음 뒤에서 치료가 먼저 ② 전우조: 짝이 제자리 명령이면 옆에서 같이 기다림 · 치유는 포위 · 옆구리 대신 곁만 ③ 보호 (새 관계 u.protOf): 평소엔 자유롭게 싸우되 (4칸 줄) 보호 대상이 노려지면 (적이 3.5칸 안 · 대상을 겨눔 · 대상에게 공격) 대상과 위협 사이로 들어가 막기를 듦 ④ 지휘: 부하에게 가는 명령은 대장을 거치면 더 빠르고 확실함 (대장 연결 × 0.98 + 0.08 · 시간 × 0.8) — 양쪽 편 같은 규칙)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9190.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# 치료가 먼저
rep("  if ((!u.cg && !u.chiefLk) || pairBusy(W, u) || u.cls === '치유' && u.act) return false;", "  if ((!u.cg && !u.chiefLk) || pairBusy(W, u) || u.cls === '치유' && u.act || (u.state === 'heal' && u.target && u.target.alive)) return false;   /* v9.9.1 치료가 먼저 */")
# 전우조: 치유는 포위 · 옆구리 대신 곁만
rep("  if (!chg && !isFar(u)){ const fp = matesOf(W, u).find(", "  if (u.cls === '치유') chg = null;   /* v9.9.1 치유는 짝의 돌격을 따라 뛰어들지 않음 */\n  if (!chg && !isFar(u) && u.cls !== '치유'){ const fp = matesOf(W, u).find(")
# 전우조: 짝이 제자리면 옆에서 기다림 + 추종 다시
rep("""  u.pairOn = false;
  // 부하: 대장에게서 3칸 넘게 떨어지지 않음 (측후방)
  const C = chiefOfU(W, u); if (!C || C.down || C.crawl || C.gone) return false;
  if (dist(u, C) <= (u.pairOnC ? keep - 0.8 : keep)){ u.pairOnC = false; return false; }
  u.pairOnC = true; const f = C.face || 0, s = Math.sin(Math.atan2(u.y - C.y, u.x - C.x) - f) >= 0 ? 1 : -1;
  return go(C.x - Math.cos(f) * 1.1 + Math.cos(f + s * 1.57) * 1.0, C.y - Math.sin(f) * 1.1 + Math.sin(f + s * 1.57) * 1.0, running(W, C) || dist(u, C) > keep + 1.5, 'keep', C, null);
}""", """  u.pairOn = false;
  const seenF = f => f.alive && !f.gone && !f.down && f.side !== u.side && (u.side === 0 ? (f.seenBy || canSee(W, u, f)) : canSee(W, u, f));
  const busyHere = () => W.units.some(f => seenF(f) && gap(u, f) < Math.max(u.rng, 0.5) + 0.6) || (isFar(u) && W.units.some(f => seenF(f) && dist(u, f) <= u.rng + 0.5 && losClear(W.map, u.x, u.y, f.x, f.y)));
  // v9.9.1 전우조: 짝이 제자리 (명령) 면 옆에서 같이 기다림
  const WM = MS.find(p => p.order && p.order.k === 'hold' && dist(u, p) < 3.5);
  if (WM && !busyHere()){ const f = WM.face || 0, s = Math.sin(Math.atan2(u.y - WM.y, u.x - WM.x) - f) >= 0 ? 1 : -1, x = WM.x + Math.cos(f + s * 1.57) * (WM.r + u.r + 0.1), y = WM.y + Math.sin(f + s * 1.57) * (WM.r + u.r + 0.1);
    if (Math.hypot(x - u.x, y - u.y) > 0.15) return go(x, y, false, 'link', WM, null); stop(u); u.fg = f; u.pairHow = 'wait'; setMood(W, u, WM.name + '와 함께 기다림'); return true; }
  // v9.9.1 추종 (부하): 평소엔 대장 등 뒤에 비비듯 · 대장이 싸우면 닿으면 같이 치고 · 발 빠르면 상대 등 뒤로 · 치유는 한 걸음 뒤
  const C = chiefOfU(W, u); if (!C || C.down || C.crawl || C.gone) return false;
  const heal = u.cls === '치유', ft = C.target && C.target.alive && !C.target.gone && !C.target.down && C.target.side !== u.side && gap(C, C.target) < C.rng + 1.0 ? C.target : null;
  if (ft && !heal && !isFar(u)){
    const fast = u.role === '미드필더' || u.role === '공격수' || (u.spd || 0) >= (C.spd || 2) * 1.12;
    if (!fast && gap(u, ft) <= u.rng + 0.05){ u.target = ft; u.state = 'fight'; return false; }   // 대장 뒤에서 닿음 → 같이 침
    if (fast){ const fa = Math.atan2(ft.y - C.y, ft.x - C.x), R = ft.r + u.r + Math.max(0.25, u.rng * 0.7);
      if (gap(u, ft) < u.rng + 0.35 && angDiff(Math.atan2(u.y - ft.y, u.x - ft.x), fa) < 0.8){ u.target = ft; u.state = 'hunt'; return false; }
      return go(ft.x + Math.cos(fa) * R, ft.y + Math.sin(fa) * R, true, 'rear', C, ft); } }   // 상대의 등 뒤로 (서둘러)
  if (busyHere()) return false;   // 내 손 · 사선에 적 — 제 싸움 (끝나면 다시 등 뒤로)
  const th = W.units.filter(f => seenF(f) && dist(f, C) < 8).sort((a, b) => dist(a, C) - dist(b, C))[0], back = th ? Math.atan2(C.y - th.y, C.x - th.x) : (C.face || 0) + Math.PI;
  const FL = W.units.filter(m => m.alive && !m.down && !m.gone && m.chiefLk && m.sqLead === C.i).sort((a, b) => a.i - b.i), k = FL.indexOf(u), n = FL.length, sp = n > 1 ? (k - (n - 1) / 2) * 0.8 : 0;
  const R = C.r + u.r + (heal ? 0.9 : 0.08), sx = C.x + Math.cos(back + sp) * R, sy = C.y + Math.sin(back + sp) * R, dd = Math.hypot(sx - u.x, sy - u.y);
  if (dd < 0.15){ stop(u); u.fg = th ? Math.atan2(th.y - u.y, th.x - u.x) : C.face || 0; u.pairHow = 'back'; return true; }
  return go(sx, sy, running(W, C) || dist(u, C) > 2.2, dist(u, C) > 2.5 ? 'keep' : 'link', C, null);
}
// v9.9.1 보호 (u.protOf): 평소엔 자유롭게 싸우되 대상에게서 4칸 넘게 벌어지지 않음 · 대상이 노려지면 대상과 위협 사이로 들어가 막기를 듦 (몸 · 방패로 탄과 일격을 막음)
function protStep(W, u, dt){
  if (u.protOf == null) return false; const P = W.units[u.protOf];
  if (!P || !P.alive || P.gone || P.side !== u.side || P === u){ u.protOf = null; return false; }
  if (pairBusy(W, u) || u.cls === '치유') return false;
  const vis = f => f.alive && !f.gone && !f.down && f.side !== u.side && (u.side === 0 ? (f.seenBy || canSee(W, u, f)) : canSee(W, u, f));
  const th = W.units.filter(f => vis(f) && ((f.act && f.act.b === P.i) || f.target === P || (isFar(f) && dist(f, P) <= f.rng + 1 && f.act && f.act.b === P.i) || dist(f, P) < 3.5)).sort((a, b) => ((b.act && b.act.b === P.i) ? 1 : 0) - ((a.act && a.act.b === P.i) ? 1 : 0) || dist(a, P) - dist(b, P))[0];
  if (!th){ if (dist(u, P) <= 4) return false; u.pairHow = 'prot'; const f = P.face || 0; goTo(W, u, P.x - Math.cos(f) * (P.r + u.r + 0.1), P.y - Math.sin(f) * (P.r + u.r + 0.1), dt); setMood(W, u, P.name + ' 곁으로 (보호)'); return true; }
  if (!isFar(u) && !u.act && gap(u, th) <= u.rng + 0.05){ u.target = th; u.state = 'fight'; return false; }   // 닿으면 쳐서 막음
  const d = dist(P, th) || 1, dx = (th.x - P.x) / d, dy = (th.y - P.y) / d, R = P.r + u.r + 0.05, sx = P.x + dx * R, sy = P.y + dy * R;
  if (Math.hypot(sx - u.x, sy - u.y) > 0.12){ if (Math.hypot(sx - u.x, sy - u.y) > 1.5) u.mv = { k: 'crun', run: true, until: W.t + 0.35 }; goTo(W, u, sx, sy, dt); } else stop(u);
  u.fg = Math.atan2(th.y - u.y, th.x - u.x); u.wantT = W.t; if (u.canGuard && !u.raised && !u.guardOff){ u.raised = true; u.raiseAt = W.t + ((W.rules.guard || {}).raise != null ? W.rules.guard.raise : 0.25) * (u.vet ? VETR(W).raise : 1); }
  if (u.protLog == null || W.t - u.protLog > 4){ u.protLog = W.t; L(W, { k: 'protGo', a: u.i, b: P.i, c: th.i, vis: u.side === 0 || !!u.seenBy }); }
  setMood(W, u, P.name + ' 앞을 막음 (보호)', th.i); return true;
}""")
rep("  if (!u.order && pairStep(W, u, dt)) return whyS(W, u, 'PAIR');", "  if (!u.order && protStep(W, u, dt)) return whyS(W, u, 'PROTECT');   /* v9.9.1 보호 */\n  if (!u.order && pairStep(W, u, dt)) return whyS(W, u, 'PAIR');")
# 지휘: 대장을 거치면 더 빠르고 확실함
rep("function cmdLink(W, C, u){", "function cmdLink(W, C, u, dep){")
rep("""    else if (MT != null && best.via !== 'none' && MT < best.t - 0.05 && MP >= best.p - 0.1) best = { ...best, t: MT, via: 'relay', mesh: true, fast: true, why: (best.why ? best.why + ' · ' : '') + '징검다리 — 곁의 동료를 거쳐 더 빨리' }; }   // v7.14.1""",
"""    else if (MT != null && best.via !== 'none' && MT < best.t - 0.05 && MP >= best.p - 0.1) best = { ...best, t: MT, via: 'relay', mesh: true, fast: true, why: (best.why ? best.why + ' · ' : '') + '징검다리 — 곁의 동료를 거쳐 더 빨리' }; }   // v7.14.1
  if (!dep && u.chiefLk && u.sqLead != null && W.units[u.sqLead] && W.units[u.sqLead] !== C && W.units[u.sqLead].alive && !W.units[u.sqLead].gone){ const Ch = W.units[u.sqLead], a0 = cmdLink(W, C, Ch, true);   /* v9.9.1 대장을 거침 — 부하는 대장이 단도리 */
    if (a0.p >= 0.3){ const pc = Math.min(K.max || 0.98, a0.p * 0.98 + 0.08), tc = a0.t * 0.8 + 0.05; if (pc > best.p + 0.01 || (pc >= best.p - 0.05 && tc < best.t - 0.05)) best = { p: Math.max(pc, best.p), t: Math.min(tc, best.t), via: 'relay', m: Ch.i, chief: true, why: Ch.name + ' (대장) 을 거쳐 — 부하는 대장이 단도리', c: C.i }; } }""")
rep("module.exports = { volStart,", "module.exports = { protStep, volStart,")
rep("  let rc = free.filter(m => !roeBlock(W, m, f, isFar(m) ? 'fire' : 'melee') && !(m.order && m.order.dep && m.order.b === f.i));", "  let rc = free.filter(m => !roeBlock(W, m, f, isFar(m) ? 'fire' : 'melee') && !(m.order && m.order.dep && m.order.b === f.i) && !(!isFar(m) && m.chiefLk && m.sqLead === D.i && (m.role === '미드필더' || m.role === '공격수' || (m.spd || 0) >= (D.spd || 2) * 1.12)));   /* v9.9.1 발 빠른 근접 부하는 추종 규칙이 맡음 (등 뒤로) */")
rep("  if (!u.order && protStep(W, u, dt)) return whyS(W, u, 'PROTECT');   /* v9.9.1 보호 */\n", "")
rep("  if (hammerStep(W, u, dt)) return whyS(W, u, 'HAMMER');", "  if (!u.order && protStep(W, u, dt)) return whyS(W, u, 'PROTECT');   /* v9.9.1 보호 (망치보다 먼저) */\n  if (hammerStep(W, u, dt)) return whyS(W, u, 'HAMMER');")
rep("  if (W.t < (u.hmCd || 0)) return false;\n  if (unarmed(u)", "  if (W.t < (u.hmCd || 0)) return false;\n  if (u.chiefLk && u.sqLead != null && W.units[u.sqLead] && W.units[u.sqLead].alive && W.units[u.sqLead].target && W.units[u.sqLead].target.alive) return false;   /* v9.9.1 대장이 싸우면 추종 규칙 (등 뒤로 돌기) 이 맡음 */\n  if (unarmed(u)")
rep("  if (eng) return false;\n", "  let rearGo = false;\n  { const C0 = chiefOfU(W, u), f0 = C0 && C0.target && C0.target.alive && !C0.target.down && C0.target.side !== u.side && gap(C0, C0.target) < C0.rng + 1.0 ? C0.target : null, fast0 = u.role === '미드필더' || u.role === '공격수' || (u.spd || 0) >= ((C0 && C0.spd) || 2) * 1.12;   /* v9.9.1 발 빠른 부하는 대장의 적에게만 닿아 있으면 등 뒤로 계속 돎 */\n    rearGo = !!(f0 && fast0 && !isFar(u) && u.cls !== '치유' && !W.units.some(f => f !== f0 && f.alive && !f.gone && !f.down && f.side !== u.side && gap(u, f) < Math.max(u.rng, 0.5) + 0.35)); if (eng && !rearGo) return false; }\n")
rep("  if (W.units.some(f => f.alive && !f.gone && f.side !== u.side && u.target === f && gap(u, f) < u.rng + 0.3)) return false;   // 팔이 닿는 적을 치는 중", "  if (!rearGo && W.units.some(f => f.alive && !f.gone && f.side !== u.side && u.target === f && gap(u, f) < u.rng + 0.3)) return false;   // 팔이 닿는 적을 치는 중")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9200 OK')
