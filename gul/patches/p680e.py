def rep(path, a, b, n=1):
    s = open(path).read(); c = s.count(a); assert c == n, (path, a[:90], c); open(path, 'w').write(s.replace(a, b))
T, H = 'rt3_tail.js', 'rt3_head.js'
rep(H, "   v6.7.6:", "   v6.8.0: HP 0 = 쓰러짐 (0.5 아래는 살아 있지 않음 — 0/150 으로 움직이던 것). 지휘가 끊기면 공동 표적 · 협동 기동 · 지휘관의 돌진 명령이 멈추고 각자 싸움 → 2.5초 뒤 가장 노련한 병사가 임시 지휘 (지휘C).\n         작전 실패 판정: 그 작전을 떠받치던 것이 무너지면 (방패 전열 전멸 · 지휘관 쓰러짐 · 짧은 사이 둘 넘게 잃음) 이유를 남기고 다시 짬 — 재편 (궁수를 남은 거구 · 근접 뒤로 모음) · 밀어붙임 · 사냥. 표적을 쓰러뜨리면 그것도 남김.\n   v6.7.6:", 1) if open(H).read().count("   v6.7.6:") == 1 else None
s = open(H).read()
if "v6.8.0:" not in s:
    s = s.replace("   v6.7.5:", "   v6.8.0: HP 0 = 쓰러짐 (0.5 아래는 살아 있지 않음 — 0/150 으로 움직이던 것). 지휘가 끊기면 공동 표적 · 협동 기동 · 지휘관의 돌진 명령이 멈추고 각자 싸움 → 2.5초 뒤 가장 노련한 병사가 임시 지휘 (지휘C).\n         작전 실패 판정: 그 작전을 떠받치던 것이 무너지면 (방패 전열 전멸 · 지휘관 쓰러짐 · 짧은 사이 둘 넘게 잃음) 이유를 남기고 다시 짬 — 재편 (궁수를 남은 거구 · 근접 뒤로 모음) · 밀어붙임 · 사냥. 표적을 쓰러뜨리면 그것도 남김.\n   v6.7.5:", 1)
    open(H, 'w').write(s)
# A. HP death threshold
rep(T, "  if (t.hp <= 0){\n", "  if (t.hp < 0.5){   // v6.8 반올림해 0 이면 쓰러짐 (0/150 으로 움직이던 것)\n")
rep(T, "  if (u.hp - d <= 0){ const by = W.units[b.by] || u; u.bleed = null;", "  if (u.hp - d < 0.5){ const by = W.units[b.by] || u; u.bleed = null;")
rep(T, "  if (u.hp - d <= 0){ const by = W.units[b.by] || u; u.burn = null;", "  if (u.hp - d < 0.5){ const by = W.units[b.by] || u; u.burn = null;")
# B. hadCmd + acting commander
rep(T, "  W.giants = W.units.filter(u => u.h >= 2.2);", "  W.hadCmd = [0, 1].map(s => W.units.some(u => u.side === s && u.cmd > 0));   // v6.8 처음에 지휘관이 있던 편 (지휘가 끊기면 임시 지휘)\n  W.giants = W.units.filter(u => u.h >= 2.2);")
rep(T, "// 편마다 0.5초에: 지휘가 있고 탱커가 있으면 대치",
"""// v6.8 지휘가 끊기면 (지휘관이 쓰러짐) 2.5초 동안 각자 싸우다가, 가장 노련한 병사 (베테랑 · 등급 · 체력) 가 임시 지휘 (지휘C = 1점)
function actingCmd(W, side){
  if (!W.hadCmd || !W.hadCmd[side] || AI6.includes('acting')) return;
  const A = W.acting || (W.acting = [{}, {}]), st = A[side];
  if (W.units.some(u => u.alive && !u.crawl && u.side === side && u.cmd > 0)){ st.lossT = null; return; }
  const mine = W.units.filter(u => u.alive && !u.crawl && !u.down && u.side === side); if (!mine.length) return;
  if (st.lossT == null){ st.lossT = W.t; L(W, { k: 'cmdLost', side, vis: true }); return; }
  if (W.t - st.lossT < 2.5) return;
  const c = mine.slice().sort((a, b) => (b.vet ? 1 : 0) - (a.vet ? 1 : 0) || b.tier - a.tier || b.hp - a.hp)[0];
  c.cmd = 1; c.cmdTmp = true; st.lossT = null; st.n = (st.n || 0) + 1;
  L(W, { k: 'acting', side, a: c.i, n: st.n, vis: side === 0 || !!c.seenBy });
}
const cmdBoss = (W, side) => W.units.filter(u => u.alive && !u.crawl && u.side === side && u.cmd > 0).sort((a, b) => b.cmd - a.cmd)[0] || null;
// 편마다 0.5초에: 지휘가 있고 탱커가 있으면 대치""")
rep(T, "    const S = W.stance[side] || (W.stance[side] = { k: 'free', t0: W.t, ph: W.rand() * 6.283 });\n",
       "    const S = W.stance[side] || (W.stance[side] = { k: 'free', t0: W.t, ph: W.rand() * 6.283 });\n    actingCmd(W, side);   // v6.8\n")
rep(T, "    if (side === 1 && known.length && awake){ planFocus(W, mine, known);",
       "    const coord = cmd > 0 || !(W.hadCmd && W.hadCmd[side]) || AI6.includes('acting');   // v6.8 지휘가 끊긴 동안은 공동 표적 · 쐐기 · 포위 · 돌진 명령 · 협동 기동이 없음 (각자 싸움)\n    if (side === 1 && W.focus && !coord){ L(W, { k: 'focusLost', side: 1, b: W.focus.b, vis: true }); W.focus = null; }\n    if (side === 1 && known.length && awake && coord){ planFocus(W, mine, known);")
# focus: by + focusDown
rep(T, """  const cand = known.filter(f => f.alive && !f.down && iKnow(W, 1, f)); if (!cand.length) return;   // v6.3 본 적 있는 상대만""",
"""  if (W.focus && !W.focus.down && (!W.units[W.focus.b].alive || W.units[W.focus.b].down)){ W.focus.down = true; L(W, { k: 'focusDown', side: 1, b: W.focus.b, by: (cmdBoss(W, 1) || {}).i, vis: true }); }   // v6.8 표적을 쓰러뜨림 (작전 성공 하나)
  const cand = known.filter(f => f.alive && !f.down && iKnow(W, 1, f)); if (!cand.length) return;   // v6.3 본 적 있는 상대만""")
rep(T, "  L(W, { k: 'focus', side: 1, b: best.i, why: weakWhy(W, best), was: cur && cur.alive && cur !== best ? cur.i : null, vis: true });",
       "  const bs = cmdBoss(W, 1); L(W, { k: 'focus', side: 1, b: best.i, why: weakWhy(W, best), was: cur && cur.alive && cur !== best ? cur.i : null, by: bs ? bs.i : null, tmp: !!(bs && bs.cmdTmp), vis: true });   // v6.8 누가 정했나 (지휘관 · 임시 지휘)")
# C. operation failure
rep(T, "  const set = (k, why) => { const was = W.plan && W.plan.k; W.plan = { k, t0: W.t, why, was, cmd0: cmd,",
       "  const set = (k, why) => { const was = W.plan && W.plan.k; W.plan = { k, t0: W.t, why, was, cmd0: cmd, sh0: mine.filter(u => u.shield).length, dead0: W.units.filter(u => u.side === 1 && !u.alive && !u.down).length, failT: W.plan ? W.plan.failT : null,")
rep(T, """  if (P.k === 'withdraw'){
    if (W.t - P.t0 > 5) set(ratio > 1.2 ? 'assault' : 'hold', '다시 모임');
    return;
  }""",
"""  if (P.k === 'withdraw'){
    if (W.t - P.t0 > (P.regroup ? 4 : 5)) set(P.regroup ? (ratio > 1.2 ? 'assault' : mine.some(u => u.bodyShield || u.shield) ? 'hold' : fast >= 2 ? 'hunt' : 'assault') : ratio > 1.2 ? 'assault' : 'hold', P.regroup ? '재편을 마침 — 다시 짠 대열로' : '다시 모임');
    return;
  }
  // v6.8 작전 실패 판정: 그 작전을 떠받치던 것이 무너지면 이유를 남기고 다시 짬 (6초에 한 번까지) — 매 순간 더 나은 걸 찾아 갈아엎지는 않음 (계획의 관성)
  if (!AI6.includes('opfail') && W.t - (P.failT == null ? -9 : P.failT) > 6 && W.t - P.t0 > 1){
    const shNow = mine.filter(u => u.shield).length, deadNow = W.units.filter(u => u.side === 1 && !u.alive && !u.down).length;
    const why = ['hold', 'bait', 'wedge', 'ambush'].includes(P.k) && P.sh0 >= 1 && shNow === 0 ? `방패 ${P.sh0}을 모두 잃음 — ${P.k === 'wedge' ? '쐐기를 이룰 방패가 없음' : '궁수를 가릴 몸이 없음'}`
      : P.cmd0 > 0 && cmd === 0 ? '지휘관이 쓰러짐'
      : deadNow - (P.dead0 || 0) >= 2 && W.t - P.t0 < 10 ? `${deadNow - (P.dead0 || 0)}명을 ${Math.max(1, Math.round(W.t - P.t0))}초 만에 잃음 — 이대로는 못 버팀` : null;
    if (why){
      const heavy = mine.filter(u => !isFar(u) && !u.crawl).sort((a, b) => powerOf(b) - powerOf(a))[0], ec = centroid(known);
      let k, how, rally = null;
      if (bows && heavy && shNow === 0 && ratio < 1.3){ k = 'withdraw'; how = `재편 — 궁수를 ${heavy.name} 뒤로 모으고 다시 짬`; const d = Math.hypot(heavy.x - ec.x, heavy.y - ec.y) || 1; rally = freeSpot(W, heavy.x + (heavy.x - ec.x) / d * 1.6, heavy.y + (heavy.y - ec.y) / d * 1.6, 0.4) || { x: heavy.x, y: heavy.y }; }
      else if (ratio >= 1.2){ k = 'assault'; how = '아직 힘이 앞섬 — 밀어붙임'; }
      else if (fast >= 2){ k = 'hunt'; how = '빠른 근접으로 사수부터 몰아붙임'; }
      else { k = P.k === 'assault' ? 'hold' : 'assault'; how = k === 'hold' ? '무리하지 않고 버팀' : '거리를 좁혀 붙음'; }
      L(W, { k: 'opFail', side: 1, p: P.k, why, next: k, how, vis: true });
      const wd = P.wd; set(k, how); W.plan.failT = W.t; W.plan.wd = wd; if (rally){ W.plan.rally = rally; W.plan.regroup = true; }
      return;
    }
  }""")
rep(T, "module.exports = { leapTo,", "module.exports = { actingCmd, cmdBoss, leapTo,")
print('engine ok')
