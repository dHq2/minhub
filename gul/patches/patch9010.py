# v9.1.0 엔진 — patch9010.py v1.0 (v1.0: 2층 대규모 업데이트 2단계 — 전우조 (동등한 짝) · 대장-부하 (편대를 대신함))
#   · 전우조: 같은 cg 를 가진 아군 — 서로 붙어 다님 (한쪽이 명령으로 멀리 가면 곁으로) · 위급한 전우를 구함 (돌격 금지여도 구하러는 돌진) ·
#     전우가 붙든 적의 옆구리를 침 (약속 pin 재활용) · 전우의 표적을 함께 노림 · 치유는 전우를 먼저
#   · 대장-부하: 부하 (sqLead) 는 대장을 따름 — 대장이 또 하나의 인주 (명령이 바로 닿음 · 대장이 싸우는 적을 함께 봄 · 편대장 자율 지시 재활용)
#     편대의 '지휘망 밖이면 저절로 듦' 은 없어짐 (rules.sq.auto = false) — 모두 손으로 정한 관계
import subprocess, json, os
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9000.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# 수치표
rep("  squad: { t: 0.5, flank: 3.2,", "  cmates: { away: 7, bias: 1.6, chiefBias: 2.4, rescueHp: 0.4, rescueD: 10, flankD: 9 },   /* v9.1.0 전우조 · 대장-부하 */\n  squad: { t: 0.5, flank: 3.2,")
rep("  sq: { joinT: 4,", "  sq: { auto: false, joinT: 4,")
# 1) 시작: 대장-부하 · 전우조 읽기 (옛 2편대 = 부대장의 부하로)
rep("u.sqLead = Dp.i; u.sqAuto = false; u.sqFix = true; } }); }   // v7.13 시작 배치의 편대 (2편대 = 부대장의 편대)\n  formInit(W, setup);",
    "u.sqLead = Dp.i; u.sqAuto = false; u.sqFix = true; u.chiefLk = true; } }); }   // v7.13 시작 배치의 편대 (2편대 = 부대장의 편대) → v9.1 부대장의 부하\n  chiefInit(W, setup);   /* v9.1.0 전우조 · 대장-부하 (손으로 정한 관계) */\n  formInit(W, setup);")
# 2) 도우미 · 관계 API
HELP = r'''/* ---------- v9.1.0 전우조 · 대장-부하 (편대를 대신함) ----------
   전우조 (cg): 동등한 짝 — 둘 이상. 서로 붙어 다니고 (명령으로 멀리 간 전우 곁으로) · 위급한 전우를 구하고 · 전우가 붙든 적의 옆구리를 치고 · 전우의 표적을 함께 노림
   대장-부하 (sqLead + chiefLk): 부하는 대장을 따르고 (인주 대신) · 대장의 말은 바로 닿고 · 대장이 싸우는 적을 함께 봄 · 대장의 자율 지시 (편대장 두뇌) 를 받음
   둘은 별개 — 한 사람이 둘 다 가질 수 있음. 아군 기본 지침이 돌격 금지라도 위급한 전우를 구하는 돌진은 함 */
const matesOf = (W, u) => u.cg ? W.units.filter(a => a !== u && a.alive && !a.gone && a.side === u.side && a.cg === u.cg) : [];
const isMateOf = (u, b) => !!u.cg && u !== b && u.cg === b.cg;
const chiefOfU = (W, u) => u.chiefLk && u.sqLead != null && W.units[u.sqLead] && W.units[u.sqLead].alive ? W.units[u.sqLead] : null;
function chiefInit(W, setup){
  setup.units.forEach((p, k) => { const u = W.units[k]; if (!u || u.side !== 0) return;
    if (p.cg) u.cg = String(p.cg);
    if (p.chiefNm !== undefined && !u.hero){
      const C = p.chiefNm ? W.units.find(c => c.side === 0 && c !== u && c.name === p.chiefNm && !c.summon && !c.hero) : null;
      if (C){ u.sqLead = C.i; u.sqAuto = false; u.sqFix = true; u.chiefLk = true; }
      else if (p.chiefNm === ''){ u.sqLead = null; u.chiefLk = false; u.sqFix = false; } } });
  mateSlots(W);
}
function mateSlots(W){   // 전우는 서는 자리도 이웃 (서로 곁에)
  const A = W.units.filter(u => u.side === 0 && !u.hero && u.slot != null).sort((a, b) => a.slot - b.slot), out = [], done = new Set();
  for (const u of A){ if (done.has(u)) continue; out.push(u); done.add(u); if (u.cg) for (const m of A) if (!done.has(m) && m.cg === u.cg){ out.push(m); done.add(m); } }
  out.forEach((u, i) => { u.slot = i; });
}
// 관계 API (페이지가 부름): 모두 바로 — 지휘망을 거치지 않음
function cgJoin(W, list){
  const T = list.filter(u => u && u.alive && u.side === 0 && !u.gone && !u.summon); if (T.length < 2) return { ok: false, why: '둘 이상 고르세요' };
  if (T.every(u => u.cg && u.cg === T[0].cg)){ T.forEach(u => { u.cg = null; }); L(W, { k: 'cgOff', ids: T.map(u => u.i), vis: true }); return { ok: true, on: false }; }
  const key = 'c' + (W.cgN = (W.cgN || 0) + 1); T.forEach(u => { u.cg = key; }); mateSlots(W); L(W, { k: 'cgOn', ids: T.map(u => u.i), vis: true }); return { ok: true, on: true, key };
}
function cgLeave(W, list){ const T = list.filter(u => u && u.cg); T.forEach(u => { u.cg = null; }); if (T.length) L(W, { k: 'cgOff', ids: T.map(u => u.i), vis: true }); return T.length; }
function chiefSet(W, followers, chief){
  if (!chief || !chief.alive || chief.side !== 0) return { ok: false, why: '대장이 될 아군을 고르세요' };
  const F = followers.filter(u => u && u.alive && u.side === 0 && !u.hero && !u.summon && u !== chief); if (!F.length) return { ok: false, why: '부하로 삼을 아군을 먼저 고르세요 (인주는 부하가 될 수 없어요)' };
  if (chief.hero){ F.forEach(u => { u.sqLead = null; u.chiefLk = false; u.sqFix = false; }); L(W, { k: 'chiefOff', ids: F.map(u => u.i), b: chief.i, vis: true }); return { ok: true, on: false }; }
  for (let c = chief, n = 0; c && c.sqLead != null && n < 8; c = W.units[c.sqLead], n++) if (F.includes(W.units[c.sqLead])) return { ok: false, why: '서로가 서로의 부하가 될 수는 없어요' };
  if (F.every(u => u.chiefLk && u.sqLead === chief.i)){ F.forEach(u => { u.sqLead = null; u.chiefLk = false; u.sqFix = false; }); L(W, { k: 'chiefOff', ids: F.map(u => u.i), b: chief.i, vis: true }); return { ok: true, on: false }; }
  F.forEach(u => { u.sqLead = chief.i; u.chiefLk = true; u.sqFix = true; u.sqAuto = false; u.order = u.order && u.order.k === 'follow' ? null : u.order; }); L(W, { k: 'chiefOn', ids: F.map(u => u.i), b: chief.i, vis: true }); return { ok: true, on: true };
}
function chiefClear(W, list){ const T = list.filter(u => u && u.chiefLk); T.forEach(u => { u.sqLead = null; u.chiefLk = false; u.sqFix = false; }); if (T.length) L(W, { k: 'chiefOff', ids: T.map(u => u.i), b: null, vis: true }); return T.length; }
function relSync(W, setup){   // 바뀐 관계를 배치 칸에 적어 둠 (다음 판 · 층에도)
  for (const u of W.units){ if (u.side !== 0 || u.summon) continue; const p = setup.units[u.i]; if (!p) continue;
    p.cg = u.cg || ''; const C = u.chiefLk && u.sqLead != null ? W.units[u.sqLead] : null; p.chiefNm = C ? C.name : ''; }
}
// 전우의 표적 · 대장의 표적을 함께 노림
function mateBias(W, u, f){
  if (!u.cg && !u.chiefLk) return 0; const K = W.rules.cmates || {}; let b = 0;
  const hit = m => m.target === f || (m.act && m.act.k === 'atk' && m.act.b === f.i);
  for (const m of matesOf(W, u)) if (!m.down && !m.crawl && hit(m)) b += K.bias || 1.6;
  const C = chiefOfU(W, u); if (C && hit(C)) b += K.chiefBias || 2.4;
  return b;
}
// 위급한 전우 (쓰러짐 · 다침) 를 노리는 적 — 있으면 그 적을 침. 돌격 금지여도 구하러는 돌진
function mateRescue(W, u, seen){
  const M = matesOf(W, u); if (!M.length) return null; const K = W.rules.cmates || {}; let best = null, bs = -1e9;
  for (const m of M){ if (!(m.down || m.crawl || m.hp / m.max < (K.rescueHp || 0.4))) continue;
    for (const f of seen){ if (!(focusOf(W, f) === m || f.target === m) || dist(f, m) > (K.rescueD || 10)) continue;
      const s = 10 - dist(u, f) * 0.5 + (m.down || m.crawl ? 3 : 0); if (s > bs){ bs = s; best = f; } } }
  if (best){ if (!isFar(u)) u.rescueGo = W.t + 2; if (u.target !== best) L(W, { k: 'mateRescue', a: u.i, b: best.i, v: (M.find(m => focusOf(W, best) === m || best.target === m) || M[0]).i, vis: true }); }
  return best;
}
const mateNear = (W, u, f, lim) => matesOf(W, u).some(m => !m.down && dist(f, m) <= lim);
// 명령으로 멀리 간 전우 곁으로 (인주 대신 전우를 따라감)
function mateAnchor(W, u, hero){
  if (!u.cg || u.order || u.hero || !hero) return null; const K = W.rules.cmates || {}; let best = null;
  for (const m of matesOf(W, u)){ if (m.down || m.crawl || m === hero || !(m.order || m.stay) || dist(m, hero) <= (K.away || 7)) continue; if (!best || dist(m, u) < dist(best, u)) best = m; }
  return best;
}
const pactFreeM = (W, u) => u.alive && u.side === 0 && !!u.cg && !u.crawl && !u.pact && !u.shadow && !u.supp && !u.pack && !u.stalk && !(u.warden && u.warden.on) && !u.order && !u.ordPend && u.lretId == null && u.cls !== '치유' && ['fight', 'idle', 'follow'].includes(u.state) && !(u.sq && u.sq.k === 'flank' && !u.sq.done) && W.t >= u.proneT && !u.kb && !(u.hp / u.max < 0.3 && u.bold < 0.5);
function stepWorld(W, dt){
  if (W.over) return;'''
rep("function stepWorld(W, dt){\n  if (W.over) return;", HELP)
# 3) 대장의 말은 바로 닿음
rep("  if (C === u || AI6.includes('cmdlink')) return { p: 1, t: 0, via: 'self', why: '', c: C.i };\n  const K = W.rules.cmdLink || {};",
    "  if (C === u || AI6.includes('cmdlink')) return { p: 1, t: 0, via: 'self', why: '', c: C.i };\n  if (u.chiefLk && u.sqLead === C.i && !(C.koT && W.t < C.koT)) return { p: 1, t: 0.05, via: C.mute ? 'sign' : 'voice', why: '', c: C.i, near: true };   /* v9.1.0 대장의 말은 부하에게 바로 */\n  const K = W.rules.cmdLink || {};")
rep("  if (AI6.includes('cmdlink')) return list.map(u => ({ p: 1, t: 0, via: 'self', why: '', c: C.i, ok: true }));",
    "  if (AI6.includes('cmdlink')) return list.map(u => ({ p: 1, t: 0, via: 'self', why: '', c: C.i, ok: true }));\n  if (list.length && list.every(u => u.chiefLk && u.sqLead === C.i)) return list.map(u => ({ p: 1, t: 0.05, via: C.mute ? 'sign' : 'voice', why: '', c: C.i, ok: true, hop: 0, legs: [[C.i, u.i, 0, 0.05]], echo: [] }));   /* v9.1.0 대장 → 부하는 바로 (지시 점도 한 번에) */")
# 4) 편대장 두뇌를 모든 대장에게 (저절로 드는 것은 없음)
rep("function deputyTick(W){\n  const S = W.rules.sq || {}, D = deputyOf(W, 0); if (!D || AI6.includes('deputy')) return;\n  const boss = cmdBoss(W, 0), sq = () => W.units.filter(u => u.alive && u.side === 0 && u.sqLead === D.i && !u.down);\n  for (const u of W.units){ if (u.side !== 0 || !u.alive || u === D || u.hero) continue;",
    "function deputyTick(W){\n  if (AI6.includes('deputy')) return; const Dp = deputyOf(W, 0), auto = (W.rules.sq || {}).auto === true, ch = new Set(); if (Dp && auto) ch.add(Dp);\n  for (const u of W.units) if (u.side === 0 && u.alive && u.sqLead != null && !u.hero){ const c = W.units[u.sqLead]; if (c && c.alive && c !== u) ch.add(c); }   /* v9.1.0 대장마다 (손으로 정한 부하) */\n  for (const D of ch) chiefTick(W, D, auto && D === Dp);\n}\nfunction chiefTick(W, D, auto){\n  const S = W.rules.sq || {};\n  const boss = cmdBoss(W, 0), sq = () => W.units.filter(u => u.alive && u.side === 0 && u.sqLead === D.i && !u.down);\n  for (const u of W.units){ if (u.side !== 0 || !u.alive || u === D || u.hero || !auto || u.chiefLk) continue;")
rep("  const S = W.rules.sq || {}, SB = S.brain || {}, g = Math.max(0, Math.min(4, Math.round(D.cmd || 0)));",
    "  const S = W.rules.sq || {}, SB = S.brain || {}, g = Math.max(M.some(m => m.chiefLk) ? 1 : 0, Math.min(4, Math.round(D.cmd || 0)));   /* v9.1.0 부하를 둔 대장은 지휘 스킬이 없어도 기본 지시는 함 (C) */")
# 5) 생각: 치유는 전우 먼저 · 전우 곁의 적도 봄 · 전우의 표적 · 구원
rep(".sort((a, b) => (injUrgent(W, b) ? 1 : 0) - (injUrgent(W, a) ? 1 : 0) || a.hp / a.max - b.hp / b.max);   // v6.9",
    ".sort((a, b) => (injUrgent(W, b) ? 1 : 0) - (injUrgent(W, a) ? 1 : 0) || (isMateOf(u, b) ? 1 : 0) - (isMateOf(u, a) ? 1 : 0) || a.hp / a.max - b.hp / b.max);   // v6.9 · v9.1 전우 먼저")
rep("const seen = foes.filter(f => canSee(W, u, f) && ((me && !u.stay) || dist(f, anchor) <= lim || (u.stay && dist(f, u) <= near0))).sort(",
    "const seen = foes.filter(f => canSee(W, u, f) && ((me && !u.stay) || dist(f, anchor) <= lim || (u.stay && dist(f, u) <= near0) || (u.cg && mateNear(W, u, f, lim)))).sort(")
rep("sc = f => -dist(u, f) * 0.8 + roleBias(W, u, f) + (f.i === fc ? 1.2 : 0)", "sc = f => -dist(u, f) * 0.8 + roleBias(W, u, f) + mateBias(W, u, f) + (f.i === fc ? 1.2 : 0)")
rep("    if (u.altLock && W.t < u.altLock.until && u.target && u.target.alive && u.target.i === u.altLock.b && seen.includes(u.target)) pick = u.target;",
    "    { const rs = mateRescue(W, u, seen); if (rs) pick = rs; }   /* v9.1.0 위급한 전우를 구함 */\n    if (u.altLock && W.t < u.altLock.until && u.target && u.target.alive && u.target.i === u.altLock.b && seen.includes(u.target)) pick = u.target;")
# 대장이 싸우는 적을 부하도 앎 (불러 준 자리)
rep("  if (u.side === 0 && u.order) return;   // 명령을 받은 아군은 명령대로",
    "  if (u.side === 0 && u.order) return;   // 명령을 받은 아군은 명령대로\n  { const Cq = u.side === 0 ? chiefOfU(W, u) : null; if (Cq && !Cq.down && Cq.target && Cq.target.alive && Cq.target.side !== 0 && (Cq.state === 'fight' || (Cq.act && Cq.act.k === 'atk')) && dist(Cq, Cq.target) < 14){ const f = Cq.target; const s0 = u.sense[f.i]; if (!s0 || W.t - s0.t > 0.8) u.sense[f.i] = { x: f.x, y: f.y, t: W.t, exact: true, call: true, shared: true }; } }   /* v9.1.0 대장이 싸우는 적은 부하도 봄 (시야 공유) */")
# 6) 따라가기: 명령으로 멀리 간 전우 곁으로
rep("const HL = leadOf(W, u) || (hero !== u ? hero : null);   // v7.10 편대원은 부대장을 따라감", "const HL = leadOf(W, u) || mateAnchor(W, u, hero) || (hero !== u ? hero : null);   // v7.10 편대원은 부대장을 따라감 · v9.1 명령으로 멀리 간 전우 곁으로")
# 7) 돌격: 위급한 전우를 구하러 갈 땐 돌격 금지여도 돌진
rep("  if (u.noChg && !(forced && u.noChg0 && u.noChg === u.noChg0 && !u.noChgUser)) return false;", "  if (u.noChg && !(u.rescueGo && W.t < u.rescueGo) && !(forced && u.noChg0 && u.noChg === u.noChg0 && !u.noChgUser)) return false;   /* v9.1.0 전우 구원은 예외 */")
# 8) 전우가 붙든 적의 옆구리 (약속 pin 재활용)
rep("  const free = E.filter(e => pactFree(W, e)), taken = new Set();", "  const free = E.filter(e => pactFree(W, e)), freeM = S === 0 ? E.filter(e => pactFreeM(W, e)) : [], taken = new Set();")
rep("    if ((W.pacts || []).some(P => P.a === A.i)) continue;\n    // screen: 물러나는 동료를 쫓는 놈",
    "    if ((W.pacts || []).some(P => P.a === A.i)) continue;\n    // v9.1 전우가 맞붙었으면 전우가 아닌 쪽 전우가 그 적의 옆 · 뒤로 (측면 협공)\n    if (S === 0 && A.cg && !isFar(A) && !A.crawl && !A.down){ const X = W.units.find(f => f.alive && f.side !== A.side && !isFar(f) && gap(A, f) < Math.max(A.rng, f.rng) + 0.4 && (focusOf(W, f) === A || A.target === f));\n      if (X){ const F = pickF(freeM.filter(f => f !== A && f.cg === A.cg && !isFar(f)), X, (W.rules.cmates || {}).flankD || 9); if (F){ taken.add(F.i); pactMake(W, 'pin', A, F, X, { rear: null, mate: true }); continue; } } }\n    // screen: 물러나는 동료를 쫓는 놈")
# 내보내기
rep("module.exports = { h2Of,", "module.exports = { matesOf, isMateOf, chiefOfU, cgJoin, cgLeave, chiefSet, chiefClear, relSync, mateBias, mateRescue, mateAnchor, h2Of,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9010 OK')
