p='run8_h.js'; s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)
rep('/* ===== run8_h.js v1.5 (v1.5:','/* ===== run8_h.js v1.6 (v1.6: 맵 장치 — 구획 안에 돌벽 토막 (타일 벽 · 이어짐 검사) · 진지의 큰 설비 표시 (포대 자리) · 두 맵을 잘라 이은 싸움판 (MS 싸움 15% · 다른 그림 둘 · 뚫은 통로) · 판 그림 위에 v8.7.1.1 장치를 그림 · v1.5:')
# 벽 토막 · 큰 설비 표시
rep("""  for (let i = 0; i < nCover; i++) place(RS[Math.floor(rnd() * RS.length)], null, 50);""",
"""  for (let i = 0; i < nCover; i++) place(RS[Math.floor(rnd() * RS.length)], null, 50);
  // 돌벽 토막 (타일 벽): 싸움 · 진지 · 지나가기 — 길을 끊지 않을 때만
  if (o.kind === 'fight' || o.kind === 'fort' || o.kind === 'pass'){ const nW = 1 + Math.floor(rnd() * 3); for (let i = 0; i < nW; i++){ const len = 3 + Math.floor(rnd() * 4), hor = rnd() < 0.5; place(['wall', hor ? len : 1, hor ? 1 : len, '#'], null, 40); } }""")
rep("""    for (let i = 0; i < nL; i++) place(F[1][Math.floor(rnd() * F[1].length)], (x, y) => dist[y * w + x] > far * 0.7, 40); }""",
"""    for (let i = 0; i < nL; i++) if (place(F[1][Math.floor(rnd() * F[1].length)], (x, y) => dist[y * w + x] > far * 0.7, 40)) props[props.length - 1].big = 1; }   // 큰 설비 = 포대 자리 (v8.7.1.1)""")
# 두 맵 잇기
rep("""// 구획을 MAPS8 에 올림 (판을 다시 열 때도 같은 씨앗으로 다시 만듦)""",
"""// 두 맵을 잘라 이은 싸움판: 왼쪽 구획 A · 오른쪽 구획 B · 사이 두 칸 벽을 뚫어 통로 (두 줄)
function r8Stitch(a, b, seed, o){
  const A = r8Sec(a, seed, { ...o, kind: 'fight' }), B = r8Sec(b, seed + 77, { ...o, kind: 'fight' }); if (!A || !B) return A;
  const gap = 2, W = A.NX + gap + B.NX, H = Math.max(A.NY, B.NY), fill = n => '#'.repeat(n);
  const g = Array.from({ length: H }, (_, y) => [...((A.rows[y] || fill(A.NX)) + fill(gap) + (B.rows[y] || fill(B.NX)))]);
  let best = null;
  for (let y = 1; y < H - 2; y++){ const ax = (A.rows[y] || '').lastIndexOf('.'), bx = (B.rows[y] || '').indexOf('.'); if (ax < 0 || bx < 0) continue; const c = (A.NX - 1 - ax) + bx; if (!best || c < best.c) best = { y, ax, bx, c }; }
  if (!best) return A;
  const cut = []; for (const y of [best.y, best.y + 1]) for (let x = best.ax; x <= A.NX + gap + best.bx; x++) if (g[y][x] !== '.'){ g[y][x] = '.'; cut.push([x, y]); }
  const off = A.NX + gap, props = [...A.props, ...B.props.map(p => ({ ...p, x: p.x + off }))];
  return { name: A.name + ' → ' + B.name, tag: A.tag, src: A.src, pw: A.pw, ph: A.ph, cs: A.cs, NX: W, NY: H, rows: g.map(r => r.join('')), in: A.in, out: [B.out[0] + off, B.out[1]], amb: Math.min(A.amb, B.amb), fall: A.fall || B.fall, sx: A.sx, sy: A.sy, props, cut, base: a, base2: b, sec: true,
    parts: [{ src: A.src, sx: A.sx, sy: A.sy, cs: A.cs, pw: A.pw, ph: A.ph, ox: 0, w: A.NX, h: A.NY }, { src: B.src, sx: B.sx, sy: B.sy, cs: B.cs, pw: B.pw, ph: B.ph, ox: off, w: B.NX, h: B.NY }] };
}
// 구획을 MAPS8 에 올림 (판을 다시 열 때도 같은 씨앗으로 다시 만듦)""")
rep("""  const M = r8Sec(srcId, seed, opt); if (!M) return null; MAPS8[key] = M; return key;""",
"""  const M = opt && opt.src2 ? r8Stitch(srcId, opt.src2, seed, opt) : r8Sec(srcId, seed, opt); if (!M) return null; MAPS8[key] = M; return key;""")
rep("""  const key = `~${R.f}_${n.id}_${n.seed || 7}`; S.art8sec = { key, src: n.src8, seed: n.seed || 7, kind, theme: F.theme };
  return r8SecReg(key, n.src8, n.seed || 7, { kind, theme: F.theme });""",
"""  // 두 맵 잇기: 보통 MS 싸움의 15% (그 지대에 맵이 둘 넘을 때 · 관중 통로 · 히든 빼고)
  if (n.stitch === undefined) n.stitch = kind === 'fight' && n.t === 'fight' && !n.champ && !n.empty && L.length >= 2 && ((n.seed || 7) % 100) < 15 ? L.filter(k => k !== n.src8)[(n.seed || 7) % (L.length - 1)] || null : null;
  const src2 = n.stitch && r8MapOk(n.stitch) ? n.stitch : null;
  const key = `~${R.f}_${n.id}_${n.seed || 7}`; S.art8sec = { key, src: n.src8, src2, seed: n.seed || 7, kind, theme: F.theme };
  return r8SecReg(key, n.src8, n.seed || 7, { kind, theme: F.theme, src2 });""")
rep("""function r8SecRestore(){ const A = S.art8sec; if (A && S.art8 === A.key && !MAPS8[A.key]) r8SecReg(A.key, A.src, A.seed, { kind: A.kind, theme: A.theme }); }""",
"""function r8SecRestore(){ const A = S.art8sec; if (A && S.art8 === A.key && !MAPS8[A.key]) r8SecReg(A.key, A.src, A.seed, { kind: A.kind, theme: A.theme, src2: A.src2 || null }); }""")
# 그리기: 이은 맵 (두 그림) · 뚫은 통로 · 돌벽 · v8.7.1.1 장치
rep("""  const M = MAPS8[S.art8]; if (!M) return; const a = ART8IMG[M.src] || (ART8IMG[M.src] = Object.assign(new Image(), { src: M.src }));
  if (a.complete && a.naturalWidth){ const k = ts / M.cs;""",
"""  const M = MAPS8[S.art8]; if (!M) return; const a = ART8IMG[M.src] || (ART8IMG[M.src] = Object.assign(new Image(), { src: M.src }));
  if (M.parts){ for (const P of M.parts){ const im = ART8IMG[P.src] || (ART8IMG[P.src] = Object.assign(new Image(), { src: P.src })); if (!im.complete || !im.naturalWidth) continue; const k = ts / P.cs;
      ctx.save(); ctx.beginPath(); ctx.rect(ox + P.ox * ts, oy, P.w * ts, P.h * ts); ctx.clip(); ctx.drawImage(im, ox + (P.ox - P.sx) * ts, oy - P.sy * ts, P.pw * k, P.ph * k); ctx.restore(); }
    ctx.save(); for (const [x, y] of M.cut || []){ ctx.fillStyle = '#2a2420'; ctx.fillRect(ox + x * ts, oy + y * ts, ts + 0.5, ts + 0.5); ctx.strokeStyle = 'rgba(120,96,70,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ox + x * ts, oy + (y + 0.5) * ts); ctx.lineTo(ox + (x + 1) * ts, oy + (y + 0.5) * ts); ctx.stroke(); } ctx.restore(); }
  else if (a.complete && a.naturalWidth){ const k = ts / M.cs;""")
rep("""  for (const p of M.props || []){ if (!p.id) continue; const im = PROPIMG8[p.id]""",
"""  for (const p of M.props || []){ if (p.id !== 'wall') continue; const x = ox + p.x * ts, y = oy + p.y * ts, wd = p.w * ts, ht = p.h * ts;   // 돌벽 토막
    ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x + ts * 0.12, y + ts * 0.18, wd, ht); ctx.fillStyle = '#4a443d'; ctx.fillRect(x, y, wd, ht); ctx.fillStyle = '#5f584f'; ctx.fillRect(x, y, wd, ts * 0.22);
    ctx.strokeStyle = 'rgba(20,16,12,.7)'; ctx.lineWidth = 1; for (let yy = 0; yy < p.h; yy++) for (let xx = 0; xx < p.w; xx++){ const bx = x + xx * ts, by = y + yy * ts; ctx.strokeRect(bx + 0.5, by + 0.5, ts - 1, ts - 1); ctx.beginPath(); ctx.moveTo(bx + ts * ((xx + yy) % 2 ? 0.5 : 0.3), by + ts * 0.5); ctx.lineTo(bx + ts * ((xx + yy) % 2 ? 0.5 : 0.3), by + ts); ctx.moveTo(bx, by + ts * 0.5); ctx.lineTo(bx + ts, by + ts * 0.5); ctx.stroke(); }
    ctx.restore(); }
  for (const p of M.props || []){ if (!p.id || p.id === 'wall') continue; const im = PROPIMG8[p.id]""")
rep("""  if (Wd.duel && typeof duel8Draw === 'function') duel8Draw(Wd, ox, oy, ts);   // v8.2 거인 · 조명
  const st = Wd.stairs;""","""  if (Wd.duel && typeof duel8Draw === 'function') duel8Draw(Wd, ox, oy, ts);   // v8.2 거인 · 조명
  if (typeof r8DrawI === 'function') r8DrawI(Wd, ox, oy, ts);   // v8.7.1.1 봉인 문양
  const st = Wd.stairs;""")
open(p,'w',encoding='utf-8').write(s)
print('ok')
