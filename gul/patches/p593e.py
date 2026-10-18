import sys
def patch(P, reps):
    s=open(P).read()
    for a,b,n in reps:
        c=s.count(a)
        if c!=1: print('ANCHOR',P,n,c); sys.exit(1)
        s=s.replace(a,b)
    open(P,'w').write(s)
patch('rt3_head.js',[
("  line: { link: 1.6, opp: 0.6, fill: 2.6, gap: 1.05, hold: 1.3, walk: 0.8 },",
 "  line: { link: 1.6, opp: 0.6, fill: 2.6, gap: 1.05, hold: 1.3, walk: 0.8, back: 0.35, turn: 1.9, rear: 1.6 },   // v5.9.3 back = 이만큼 (칸/초) 뒤로 물러나면 후퇴 (전열에서 빠짐) · turn = 가까운 적에게서 이만큼 (rad) 넘게 몸을 돌리면 등을 돌림 · rear = 마디 뒤 이 칸 안의 근접은 뒷줄 (전열에 포함)",'rule'),
])
patch('rt3_tail.js',[
# 1) 마디 자격: 후퇴 · 등을 돌림이면 빠짐
("function planLines(W){",
 """// v5.9.3 전열 마디가 될 수 없는 까닭: 뒤로 물러나는 중 (후퇴 — 뒤쪽 이동 명령 · 뒤로 걷는 속력) · 가까운 적에게 등을 돌림. was = 이어져 있던 마디 (조금 더 버팀)
function lineWhyOut(W, u, was){
  const LN = W.rules.line || {}, hy = was ? 1.3 : 1, f = lineFaceOf(W, u), fx = Math.cos(f), fy = Math.sin(f);
  const o = u.order; if (o && (o.k === 'move' || o.k === 'amove') && o.x != null && ((o.x - u.x) * fx + (o.y - u.y) * fy) < -0.6) return '후퇴';
  if (-((u.vx || 0) * fx + (u.vy || 0) * fy) > (LN.back != null ? LN.back : 0.35) * hy) return '후퇴';
  const foes = lineFoes(W, u); if (foes.length){ const e = foes.reduce((m, x) => dist(x, u) < dist(m, u) ? x : m); if (angDiff(u.face, Math.atan2(e.y - u.y, e.x - u.x)) > Math.min(3.0, (LN.turn != null ? LN.turn : 1.9) * (was ? 1.12 : 1))) return '등을 돌림'; }
  return null;
}
function planLines(W){""",'why'),
("    const M = W.units.filter(u => u.alive && u.side === side && !isFar(u) && !u.crawl && !u.kb && W.t >= u.proneT && W.t >= (u.stunT || -9) && !(u.act && u.act.k === 'charge' && u.act.phase === 'run'));",
 "    const M = W.units.filter(u => u.alive && u.side === side && !isFar(u) && !u.crawl && !u.kb && W.t >= u.proneT && W.t >= (u.stunT || -9) && !(u.act && u.act.k === 'charge' && u.act.phase === 'run') && !lineWhyOut(W, u, !!u.lineJ));   // v5.9.3 후퇴 · 등을 돌린 쪽은 마디가 아님",'M'),
# 2) 뒷줄: 마디 바로 뒤 (rear 칸 안 · 같은 쪽을 봄 · 후퇴 아님) 의 근접 = 전열에 포함
("      lines.push(ln);\n",
 """      lines.push(ln);
      // v5.9.3 뒷줄: 마디 바로 뒤의 근접 (창 2열 등) 도 전열에 포함 — 버팀 무게 · 빈자리 메움에 셈
      ln.rear = []; { const fx = Math.cos(f), fy = Math.sin(f);
        for (const r of W.units){ if (!r.alive || r.side !== side || r.line || isFar(r) || r.crawl || r.kb || W.t < r.proneT || angDiff(r.face, f) > 1.0 || lineWhyOut(W, r, !!r.rearJ)) continue;
          let best = null, bd = 1e9; for (const j of comp){ const rx = r.x - j.x, ry = r.y - j.y, fw = rx * fx + ry * fy, lat = Math.abs(rx * -fy + ry * fx); if (fw < -0.25 && fw > -(LN.rear || 1.6) && lat < 0.95 && Math.hypot(rx, ry) < bd){ bd = Math.hypot(rx, ry); best = j; } }
          if (best){ ln.rear.push({ i: r.i, j: best.i }); r.rearOf = { ln, j: best.i }; } } }
""",'rear'),
("  for (const u of W.units){ u.lineJ = u.line ? { left: u.line.left, right: u.line.right } : null; u.line = null; }",
 "  for (const u of W.units){ u.lineJ = u.line ? { left: u.line.left, right: u.line.right } : null; u.line = null; u.rearJ = !!u.rearOf; u.rearOf = null; }",'reset'),
# 이탈 까닭
("    if (!fell){ L(W, { k: 'lineLeave', a: u.i, n: ln.n, vis: u.side === 0 || !!u.seenBy }); continue; }",
 "    if (!fell){ L(W, { k: 'lineLeave', a: u.i, n: ln.n, how: lineWhyOut(W, u, true) || (u.rearOf ? '뒷줄로' : '떨어짐'), vis: u.side === 0 || !!u.seenBy }); continue; }   // v5.9.3 까닭 (후퇴 · 등을 돌림 · 떨어짐)",'leave'),
("      if (U2.every(u => W.t - (u.lineOutT || -9) >= 2) && !U2.every(u => u.order && u.order.k === 'line')) L(W, { k: 'lineBreak', side: ln.side, ids: ln.ids.slice(), n: ln.n, vis: ln.side === 0 || U2.some(u => u.seenBy) });",
 "      if (U2.every(u => W.t - (u.lineOutT || -9) >= 2) && !U2.every(u => u.order && u.order.k === 'line')){ const hw = U2.map(u => lineWhyOut(W, u, true)); L(W, { k: 'lineBreak', side: ln.side, ids: ln.ids.slice(), n: ln.n, how: hw.every(h => h === '후퇴') ? '후퇴' : hw.some(h => h) ? hw.find(h => h) : '', vis: ln.side === 0 || U2.some(u => u.seenBy) }); }",'break'),
# 빈자리 메움: 뒷줄이 먼저
("    const fl = W.units.filter(f => f.alive && f.side === u.side && f !== u && !isFar(f) && !f.line && !f.crawl && !(f.side === 0 && f.order) && dist(f, u) < ((W.rules.line || {}).fill || 2.6)",
 "    const fl = W.units.filter(f => f.alive && f.side === u.side && f !== u && !isFar(f) && !f.line && !f.crawl && (!(f.side === 0 && f.order) || (f.order.k === 'line' && f.order.join)) && dist(f, u) < ((W.rules.line || {}).fill || 2.6) * (f.rearOf && f.rearOf.j === u.i ? 1.3 : 1)",'fill'),
# 3) lineKeep · lineJoin: 명령 (전열 참여) 이면 자동 조건 없이
("function lineKeep(W, u, dt){\n  if (!u.line || !lineAuto(W, u) || W.t - (u.lineT0 != null ? u.lineT0 : W.t) < 0.5) return false;\n  const ln = u.line.ln, LN = W.rules.line || {}, foes = lineFoes(W, u); if (!foes.length) return false;\n  if (u.hp / u.max < 0.25 && u.bold < 0.5) return false;   // 겁 — 물러남\n  if (foes.some(f =>",
 "function lineKeep(W, u, dt, ord){   // v5.9.3 ord = 전열 참여 명령 (겁 · 끝내러 나감 없이 자리를 지킴)\n  if (!u.line || (!ord && (!lineAuto(W, u) || W.t - (u.lineT0 != null ? u.lineT0 : W.t) < 0.5))) return false;\n  const ln = u.line.ln, LN = W.rules.line || {}, foes = lineFoes(W, u); if (!foes.length) return false;\n  if (!ord && u.hp / u.max < 0.25 && u.bold < 0.5) return false;   // 겁 — 물러남\n  if (!ord && foes.some(f =>",'keep'),
("  if (W.stance && W.stance[u.side] && W.stance[u.side].k === 'hold') return false;\n  const fx = Math.cos(ln.face), fy = Math.sin(ln.face), px = -fy, py = fx, G = LN.gap || 1.05;",
 "  if (W.stance && W.stance[u.side] && W.stance[u.side].k === 'hold') return false;\n  const fx = Math.cos(ln.face), fy = Math.sin(ln.face), px = -fy, py = fx, G = LN.gap || 1.05;   // (대치 중이면 명령받은 마디는 그 자리 — joinStep)",'keepHold'),
("function lineJoin(W, u, dt){\n  if (u.line || !lineAuto(W, u) || u.rng >= 0.9 || u.giant && u.role !== '전선') return false;\n  const foes = lineFoes(W, u); if (!foes.length) return false;\n  if (foes.some(f => gap(u, f) <= Math.max(u.rng, isFar(f) ? 0.3 : f.rng) + 0.8)) return false;   // 맞붙음 — 보통 싸움\n  const f0 = foes.sort((a, b) => dist(u, a) - dist(u, b))[0]; if (dist(u, f0) > 8) return false;",
 "function lineJoin(W, u, dt, ord){   // v5.9.3 ord = 전열 참여 명령 (맞붙어 있어도 · 적이 멀어도 · 거구 · 창도)\n  if (u.line || (!ord && (!lineAuto(W, u) || u.rng >= 0.9 || u.giant && u.role !== '전선'))) return false;\n  const foes = lineFoes(W, u); if (!ord && !foes.length) return false;\n  if (!ord && foes.some(f => gap(u, f) <= Math.max(u.rng, isFar(f) ? 0.3 : f.rng) + 0.8)) return false;   // 맞붙음 — 보통 싸움\n  const f0 = foes.sort((a, b) => dist(u, a) - dist(u, b))[0] || { x: u.x + Math.cos(u.face || 0) * 5, y: u.y + Math.sin(u.face || 0) * 5 }; if (!ord && dist(u, f0) > 8) return false;\n  if (ord && u.rng >= 0.9){   // 창 (장창): 가장 가까운 마디의 뒷줄 (2열) — 비어 있는 마디 뒤\n    let rb = null, rd = 1e9; for (const ln of W.lines || []){ if (ln.side !== u.side) continue; for (const id of ln.ids){ const j = W.units[id]; if (!j || !j.alive || (ln.rear || []).some(r => r.j === id && r.i !== u.i)) continue; const x = j.x - Math.cos(ln.face) * 1.05, y = j.y - Math.sin(ln.face) * 1.05, d = Math.hypot(x - u.x, y - u.y); if (d < rd && !rock(W.map, x, y)){ rd = d; rb = { x, y, f: ln.face }; } } }\n    if (rb && rd < 10){ if (rd > 0.2){ setGoal(W, u, rb.x, rb.y); follow(W, u, dt); } else stop(u); u.fg = rb.f; setMood(W, u, '뒷줄로'); return true; } }",'join'),
("  let best = null, bd = 3;\n  for (const ln of W.lines || []){ if (ln.side !== u.side) continue;",
 "  let best = null, bd = ord ? 10 : 3;\n  for (const ln of W.lines || []){ if (ln.side !== u.side) continue;",'joinRange'),
("    const m = W.units.filter(a => a.alive && a !== u && a.side === u.side && ((a.role === '전선' && u.role !== '전선') || (a.i < u.i && !(u.role === '전선' && a.role !== '전선'))) && !a.line && !isFar(a) && !a.crawl && a.rng < 0.9 && dist(a, u) < 3",
 "    const m = W.units.filter(a => a.alive && a !== u && a.side === u.side && (ord || (a.role === '전선' && u.role !== '전선') || (a.i < u.i && !(u.role === '전선' && a.role !== '전선'))) && !a.line && !isFar(a) && !a.crawl && a.rng < 0.9 && dist(a, u) < (ord ? 8 : 3)",'joinNew'),
# 4) 전열 참여 명령
("  if (o.k === 'line'){\n",
 """  if (o.k === 'line' && o.join){ joinStep(W, u, dt); return; }   // v5.9.3 전열 참여
  if (o.k === 'line'){
""",'dispatch'),
("// v5.8.5 도움닫기: 달린 거리만큼 빨라짐",
 """// v5.9.3 전열 참여 명령: 마디면 자리를 지킴 (손 닿는 앞의 상대만 · 쫓거나 협공하러 떠나지 않음) · 아니면 가까운 전열 끝 (창은 마디 뒤 2열) 에 붙음 · 전열이 없으면 가까운 근접 동료 옆에 새 전열.
// 사수는 가까운 전열 가운데 뒤에 서서 스스로 싸움 (명령은 거기서 끝). 붙을 데가 없으면 그 자리에서 가까운 적을 보고 섬
function joinStep(W, u, dt){
  if (isFar(u)){
    const ln = (W.lines || []).filter(l => l.side === u.side).sort((a, b) => dist(u, centroid(a.ids.map(i => W.units[i]))) - dist(u, centroid(b.ids.map(i => W.units[i]))))[0];
    if (ln){ const c = centroid(ln.ids.map(i => W.units[i])), x = c.x - Math.cos(ln.face) * 1.7, y = c.y - Math.sin(ln.face) * 1.7; const p = freeSpot(W, x, y, u.r) || { x, y }; u.order = { k: 'move', x: p.x, y: p.y }; return; }
    u.order = null; return;
  }
  if (u.line){ if (lineKeep(W, u, dt, true)) return; stop(u); u.fg = u.line.ln.face; u.lineHoldF = u.line.ln.face; u.lineHoldT = W.t; setMood(W, u, '전열'); return; }
  if (u.rearOf && u.rng >= 0.9){   // 뒷줄 창: 앞 마디 너머 손 닿는 상대를 찌름
    const ln = u.rearOf.ln, t = lineFoes(W, u).filter(f => gap(u, f) <= u.rng + 0.05 && angDiff(ln.face, Math.atan2(f.y - u.y, f.x - u.x)) < 1.2).sort((a, b) => dist(u, a) - dist(u, b))[0];
    if (t){ u.target = t; stop(u); startAct(W, u, t, '2열 찌르기'); return; }
    stop(u); u.fg = ln.face; setMood(W, u, '2열'); return;
  }
  if (lineJoin(W, u, dt, true)) return;
  const e = lineFoes(W, u).sort((a, b) => dist(u, a) - dist(u, b))[0]; stop(u); if (e) u.fg = Math.atan2(e.y - u.y, e.x - u.x); setMood(W, u, '전열 (혼자)');
}
// v5.8.5 도움닫기: 달린 거리만큼 빨라짐""",'joinStep'),
# 5) 버팀: 뒷줄은 1.3칸 넘어도 셈
("    const ox = o.x - t.x, oy = o.y - t.y, d = Math.hypot(ox, oy); if (d > 1.3) continue;",
 "    const ox = o.x - t.x, oy = o.y - t.y, d = Math.hypot(ox, oy); if (d > (o.rearOf && o.rearOf.j === t.i ? 1.8 : 1.3)) continue;   // v5.9.3 뒷줄은 조금 멀어도 받쳐 줌",'brace'),
# 6) 명령 글
("const orderTxt = (o, u) => o && o.k === 'amove' ?",
 "const orderTxt = (o, u) => o && o.k === 'line' && o.join ? ['lineJoin'] : o && o.k === 'amove' ?",'orderTxt'),
])
print('ok')
