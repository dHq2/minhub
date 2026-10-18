# v7.19.2 엔진 — patch7192.py v1.3 (v1.3: 턴 끝 상태표 동작에 고유 기술 열쇠 s · v1.2: 역장 로그는 wardOn (지킬 사람 ward 와 겹침) · v1.1: 무기 잡기 5% (상한 15%) · 같은 이가 2.5초에 한 번만 굴림 · 딸기: 역장 (둘레 1.6칸 · 6초 · 탄 3발을 막음 — 강한 탄은 40% 뚫음) · 뿌리 벽 (5칸 안에 2칸짜리 · 못 지나감 · 탄 · 시야도 막음 · 솟을 때 위의 적은 맞고 밀림 · 붙은 적이 뜯어내면 부서짐 · 둘까지 유지) · 열매 맺기 (20초마다 곁에 딸기 열매 — 아군이 지나가며 먹으면 5 ~ 10) / 공통: 무기 잡기 (창 · 철퇴를 막거나 피하면 확률로 자루를 잡아 뺏어 떨굼))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "hurl: { rng: 3.6, wind: 0.8, rec: 0.6, cd: 6, mul: 2.0, kb: 1.6, head: 0.5, kill: 0.02 } },", "hurl: { rng: 3.6, wind: 0.8, rec: 0.6, cd: 6, mul: 2.0, kb: 1.6, head: 0.5, kill: 0.02 }, ward: { r: 1.6, t: 6, n: 3, pierce: 0.4, wind: 0.4, rec: 0.3, cd: 14 }, root: { rng: 5, len: 2, hp: 120, wind: 0.6, rec: 0.4, cd: 12, mul: 1.2, kb: 0.8, chew: 0.4, max: 2 } },   /* v7.19.2 딸기: 역장 (반지름 · 초 · 막는 탄 수 · 강한 탄이 뚫을 확률) · 뿌리 벽 (닿는 칸 · 길이 · 단단함 · 솟을 때 피해 × · 밀침 · 붙은 적이 뜯는 속도 (공격 × 초당) · 동시에 유지) */\n  berry: { gap: 20, first: 8, max: 3, heal: [5, 10], r: 1.4 },   /* v7.19.2 열매 맺기: 맺는 간격 · 처음 · 판에 최대 · 회복 · 곁 거리 */\n  grab: { p: 0.05, cap: 0.15, cd: 2.5, list: ['창', '어부의 창', '모닝스타'], vet: 1.3 },   /* v7.19.2 무기 잡기 (공통): 막거나 피했을 때 상대 창 · 철퇴 자루를 잡아 뺏을 확률 (× 회피 등급 · 베테랑) */")
wr('rt3_head.js', h)

m = rd('rt3_mid.js')
m = rep(m, "const solid = (m, x, y) => x < 0 || y < 0 || x >= m.W || y >= m.H || m.t[(y | 0) * m.W + (x | 0)] === 1;", "const solid = (m, x, y) => x < 0 || y < 0 || x >= m.W || y >= m.H || m.t[(y | 0) * m.W + (x | 0)] === 1 || m.t[(y | 0) * m.W + (x | 0)] === 3;   // v7.19.2 뿌리 벽 (3) 도 시야 · 탄을 막음")
wr('rt3_mid.js', m)

s = rd('rt3_tail.js')
s = rep(s, "const SPEC_K = { '공중제비': 'flip', '머리 찍기': 'head', '영거리 사격': 'pb', '철퇴 후리기': 'sweep', '휘둘러 치기': 'hurl' };", "const SPEC_K = { '공중제비': 'flip', '머리 찍기': 'head', '영거리 사격': 'pb', '철퇴 후리기': 'sweep', '휘둘러 치기': 'hurl', '역장': 'ward', '뿌리 벽': 'root' };   // v7.19.2 딸기")
s = rep(s, "if (x.n != null && x.n <= 0) return false; return k !== 'pb' || u.shells > 0; }", "if (x.n != null && x.n <= 0) return false; if ((k === 'sweep' || k === 'hurl') && u.weaponGone) return false; if (k === 'root' && (W.roots || []).filter(r => r.by === u.i).length >= (SPR(W, 'root').max || 2)) return false; return k !== 'pb' || u.shells > 0; }   // v7.19.2 철퇴를 뺏기면 못 씀 · 뿌리 벽은 둘까지")
s = rep(s, "shells: acts.includes('영거리 사격') ? (p.shells != null ? +p.shells : 100) : null,", "shells: acts.includes('영거리 사격') ? (p.shells != null ? +p.shells : 100) : null, berry: tr.includes('열매 맺기'), berryT: tr.includes('열매 맺기') ? (rules.berry || {}).first || 8 : null,")   # v7.19.2
# 역장 · 뿌리 벽 (기술 본체)
s = rep(s, "  if (k === 'hurl'){   // 휘둘러 치기", """  if (k === 'ward'){   // v7.19.2 역장: 시전자 둘레 r 칸 · t 초 · 상대 탄 n 발까지 막음 (시전자와 함께 움직임)
    (W.wards || (W.wards = [])).push({ by: u.i, side: u.side, r: S.r || 1.6, until: W.t + (S.t || 6), left: S.n || 3, n: S.n || 3 });
    L(W, { k: 'wardOn', a: u.i, n: S.n || 3, sec: S.t || 6, vis: u.side === 0 || !!u.seenBy }); return;
  }
  if (k === 'root'){   // v7.19.2 뿌리 벽: 찍은 자리에 시전자 → 자리 방향과 직각으로 len 칸 (바위처럼 못 지나감 · 탄 · 시야도 막음) — 솟는 칸의 적은 맞고 밀려남, 동료는 비켜 세움
    const px = A.px != null ? A.px : t ? t.x : u.x, py = A.py != null ? A.py : t ? t.y : u.y, dx0 = px - u.x, dy0 = py - u.y, l = Math.hypot(dx0, dy0) || 1, nx = -dy0 / l, ny = dx0 / l, n = Math.max(1, Math.round(S.len || 2)), cells = [];
    for (let i = 0; i < n * 2; i++){ const o = (i / (n * 2 - 1) - 0.5) * (n - 0.01), cx = Math.floor(px + nx * o), cy = Math.floor(py + ny * o); if (cx < 1 || cy < 1 || cx >= W.map.W - 1 || cy >= W.map.H - 1 || W.map.t[cy * W.map.W + cx] !== 0 || cells.some(c => c[0] === cx && c[1] === cy)) continue; cells.push([cx, cy]); }
    if (!cells.length){ L(W, { k: 'miss', a: u.i, why: '뿌리를 내릴 자리가 없음', spec: k }); return; }
    for (const e of W.units){ if (!e.alive) continue; const on = cells.find(c => Math.floor(e.x) === c[0] && Math.floor(e.y) === c[1] || Math.hypot(e.x - c[0] - 0.5, e.y - c[1] - 0.5) < 0.5 + e.r * 0.6); if (!on) continue;
      const ax = e.x - on[0] - 0.5, ay = e.y - on[1] - 0.5, al = Math.hypot(ax, ay) || 1, sx = ax / al || nx, sy = ay / al || ny;
      if (e.side !== u.side){ strike(W, u, e, e, 1, true, { mul: S.mul || 1.2, tag: '솟는 뿌리', wk: '둔기' }); if (e.alive && !e.kb) shove(W, u, e, S.kb || 0.8, sx, sy, { tag: '뿌리에 밀려남' }); }
      else tryMove(W, e, on[0] + 0.5 + sx * (0.55 + e.r), on[1] + 0.5 + sy * (0.55 + e.r)); }
    const root = { id: (W.rootN = (W.rootN || 0) + 1), by: u.i, side: u.side, cells: cells.filter(c => !W.units.some(e => e.alive && Math.floor(e.x) === c[0] && Math.floor(e.y) === c[1])), hp: S.hp || 120, max: S.hp || 120 };
    for (const [cx, cy] of root.cells) W.map.t[cy * W.map.W + cx] = 3;
    (W.roots || (W.roots = [])).push(root); W.lightT = 0;
    L(W, { k: 'root', a: u.i, n: root.cells.length, x: +px.toFixed(1), y: +py.toFixed(1), vis: u.side === 0 || !!u.seenBy }); return;
  }
  if (k === 'hurl'){   // 휘둘러 치기""")
# 스스로: 역장 · 뿌리 벽
s = rep(s, "  if (specReady(W, u, 'head') && !u.headMark && g <= u.rng + 1.5", """  if (specReady(W, u, 'ward')){ const r = SPR(W, 'ward').r || 1.6; if (W.units.some(a => a.alive && a.side === u.side && dist(u, a) <= r && W.t - (a.farHitT == null ? -9 : a.farHitT) < 1.5)) return startSpec(W, u, null, 'ward', '사격받는 동료를 감쌈'); }   // v7.19.2
  if (specReady(W, u, 'root') && !isFar(t) && g > 1.6 && g < 4.5 && (t.vx || 0) * (u.x - t.x) + (t.vy || 0) * (u.y - t.y) > 0){ const d = dist(u, t) || 1; startSpec(W, u, null, 'root', '다가오는 상대 앞에 뿌리 벽'); u.act.px = u.x + (t.x - u.x) / d * 1.5; u.act.py = u.y + (t.y - u.y) / d * 1.5; return true; }   // v7.19.2
  if (specReady(W, u, 'head') && !u.headMark && g <= u.rng + 1.5""")
# 명령: 역장 (바로) · 뿌리 벽 (찍은 자리)
s = rep(s, "    if (o.s === 'sweep'){ if (specReady(W, u, 'sweep')){ startSpec(W, u, null, 'sweep', '명령'); u.order = null; } else setMood(W, u, '철퇴 후리기 대기'); return; }",
        """    if (o.s === 'sweep' || o.s === 'ward'){ if (specReady(W, u, o.s)){ startSpec(W, u, null, o.s, '명령'); u.order = null; } else setMood(W, u, sp.name + ' 대기'); return; }   // v7.19.2 역장도 바로
    if (o.s === 'root'){ const px = o.x != null ? o.x : t && t.alive ? t.x : null, py = o.y != null ? o.y : t && t.alive ? t.y : null; if (px == null){ u.order = null; return; }   // v7.19.2 뿌리 벽: 찍은 자리 (적이면 그 앞)
      const d = Math.hypot(px - u.x, py - u.y), R2 = SPR(W, 'root').rng || 5;
      if (specReady(W, u, 'root') && d <= R2){ startSpec(W, u, null, 'root', '명령'); const k2 = o.b != null && d > 1.5 ? (d - 1.2) / d : 1; u.act.px = u.x + (px - u.x) * k2; u.act.py = u.y + (py - u.y) * k2; u.order = null; return; }
      if (d > R2){ setMood(W, u, '뿌리 벽 자리로'); goTo(W, u, px, py, dt); return; } setMood(W, u, '뿌리 벽 대기'); return; }""")
# 역장이 탄을 막음 (직사 · 곡사)
s = rep(s, "      const nx = s.x + s.dx * st, ny = s.y + s.dy * st;", "      const nx = s.x + s.dx * st, ny = s.y + s.dy * st;\n      if (W.wards && W.wards.length && wardStop(W, s, s.x, s.y, nx, ny)) break;   // v7.19.2 역장")
s = rep(s, "    if (s.arc){ s.el += dt; s.q = Math.min(1, s.el / s.T); s.x = s.x0 + (s.lx - s.x0) * s.q; s.y = s.y0 + (s.ly - s.y0) * s.q; if (s.q >= 1){ s.done = true; landArc(W, s);",
        "    if (s.arc){ s.el += dt; s.q = Math.min(1, s.el / s.T); s.x = s.x0 + (s.lx - s.x0) * s.q; s.y = s.y0 + (s.ly - s.y0) * s.q; if (s.q >= 1){ s.done = true; if (!(W.wards && W.wards.length && wardStop(W, s, s.x0, s.y0, s.lx, s.ly, true))) landArc(W, s);")
s = rep(s, "/* ---------- v7.19.1 고유 기술:", """/* ---------- v7.19.2 역장 · 뿌리 벽 · 열매 · 무기 잡기 ---------- */
// 역장: 상대 탄이 둘레 밖에서 안으로 들어오면 (곡사는 안에 떨어지면) 막음 — 투창 · 총알 · 센 탄은 pierce 확률로 뚫음
function wardStop(W, s, x0, y0, x1, y1, arc){
  for (const w of W.wards){ if (w.side === s.side || w.left <= 0 || W.t >= w.until) continue; const c = W.units[w.by]; if (!c || !c.alive) continue;
    const d1 = Math.hypot(x1 - c.x, y1 - c.y), d0 = Math.hypot(x0 - c.x, y0 - c.y); if (d1 > w.r || (!arc && d0 <= w.r)) continue;
    if ((s.jav || s.gun || (s.mul || 1) >= 1.5) && W.rand() < (SPR(W, 'ward').pierce != null ? SPR(W, 'ward').pierce : 0.4)){ (s.ev || (s.ev = [])); L(W, { k: 'wardPierce', a: s.a, b: w.by, vis: true }); w.left--; continue; }
    w.left--; s.done = true; if (!arc){ s.x = x0; s.y = y0; } const u = W.units[s.a]; if (u && !s.supp) u.miss++;
    L(W, { k: 'miss', a: s.a, b: s.meant, why: '역장에 막힘', fired: true, p: s.p, ward: w.by }); if (W.fxOn) W.fx.push({ k: 'num', x: x1, y: y1, s: '역장!', c: 'b', t0: W.t });
    if (s.jav) dropSpear(W, s, x0, y0, 'bounce');
    return true; }
  return false;
}
// 매 프레임: 역장 끝 · 뿌리 벽 뜯김 · 열매 맺기 · 먹기
function stepFlora(W, dt){
  if (W.wards && W.wards.length) W.wards = W.wards.filter(w => W.t < w.until && w.left > 0 && W.units[w.by] && W.units[w.by].alive);
  if (W.roots && W.roots.length){ const S = SPR(W, 'root');
    for (const r of W.roots){ for (const e of W.units){ if (!e.alive || e.side === r.side || isFar(e) || e.act || e.kb) continue; if (!r.cells.some(c => Math.hypot(e.x - c[0] - 0.5, e.y - c[1] - 0.5) < 0.62 + e.r)) continue;
        if (W.units.some(f => f.alive && f.side !== e.side && gap(e, f) <= e.rng + 0.2)) continue; r.hp -= e.atk * (e.atkMul || 1) * (S.chew != null ? S.chew : 0.4) * dt; if (W.t - (e.chewT || -9) > 2){ e.chewT = W.t; L(W, { k: 'rootChew', a: e.i, r: r.id, hp: Math.round(r.hp), vis: e.side === 0 || !!e.seenBy }); } }
      if (r.hp <= 0){ for (const [cx, cy] of r.cells) if (W.map.t[cy * W.map.W + cx] === 3) W.map.t[cy * W.map.W + cx] = 0; r.gone = true; W.lightT = 0; L(W, { k: 'rootBreak', a: r.by, r: r.id, vis: true }); } }
    W.roots = W.roots.filter(r => !r.gone); }
  const B = W.rules.berry || {};
  for (const u of W.units){ if (!u.berry || !u.alive || W.t < u.berryT) continue; u.berryT = W.t + (B.gap || 20);
    if ((W.items || []).filter(it => it.k === 'berry' && it.owner === u.i).length >= (B.max || 3)) continue;
    for (let k = 0; k < 8; k++){ const a = W.rand() * 6.283, rr = 0.6 + W.rand() * ((B.r || 1.4) - 0.6), x = u.x + Math.cos(a) * rr, y = u.y + Math.sin(a) * rr; if (rock(W.map, x, y)) continue;
      const H = B.heal || [5, 10], it = { id: (W.itemN = (W.itemN || 0) + 1), k: 'berry', name: '딸기 열매', x: +x.toFixed(2), y: +y.toFixed(2), owner: u.i, t: W.t, how: 'berry', heal: Math.round(H[0] + W.rand() * (H[1] - H[0])) };
      W.items.push(it); L(W, { k: 'berrySpawn', a: u.i, x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy }); break; } }
  if (W.items && W.items.some(it => it.k === 'berry')) for (const it of W.items){ if (it.k !== 'berry' || it.eaten) continue; const o = W.units[it.owner];
    const e = W.units.find(a => a.alive && !a.down && o && a.side === o.side && a.hp < a.max - 1 && Math.hypot(a.x - it.x, a.y - it.y) < a.r + 0.25); if (!e) continue;
    const amt = Math.min(it.heal, Math.round(e.max - e.hp)); e.hp += amt; it.eaten = true; L(W, { k: 'berry', a: e.i, by: it.owner, amt, hp: Math.round(e.hp), vis: e.side === 0 || !!e.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y, s: '+' + amt, c: 'h', t0: W.t }); }
  if (W.items && W.items.some(it => it.eaten)) W.items = W.items.filter(it => !it.eaten);
}
// 무기 잡기 (공통): 막거나 피했을 때 — 상대의 창 · 철퇴 자루를 잡아 뺏어 곁 바닥에 떨굼 (근접 솜씨: 회피 등급 · 베테랑). 노리스크 (실패해도 아무 일 없음)
function grabTry(W, t, a, how){
  const G = W.rules.grab || {}; if (!t.alive || !a.alive || t.side === a.side || isFar(t) || t.noArms || (t.arms && t.arms.L && t.arms.R) || a.weaponGone || isFar(a) || !(G.list || []).includes(a.weaponNow || a.weapon) || (a.jav && !a.spearHeld)) return false;
  if (W.t < (t.grabT || -9)) return false; t.grabT = W.t + (G.cd || 2.5);
  const p = Math.min(G.cap || 0.15, (G.p || 0.05) * (t.ev || 1) * (t.vet ? G.vet || 1.3 : 1)); if (W.rand() >= p) return false;
  const wn = a.weapon, it = dropItem(W, a, 'weapon', wn, null, 'grab'); it.x = +(t.x + (W.rand() - 0.5) * 0.9).toFixed(2); it.y = +(t.y + (W.rand() - 0.5) * 0.9).toFixed(2);
  a.weaponGone = true; a.weaponNow = '맨손'; a.rng = ((W.rules.weapons || {})['맨손'] || { rng: 0.3 }).rng; a.longReach = false; a.parry = false; if (!a.shield && !a.reflex) a.canGuard = false; if (a.jav) a.spearHeld = false;
  L(W, { k: 'grab', a: t.i, b: a.i, w: wn, how, vis: t.side === 0 || a.side === 0 || !!t.seenBy || !!a.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: a.x, y: a.y, s: '무기를 뺏김!', c: 'd', t0: W.t });
  return true;
}
/* ---------- v7.19.1 고유 기술:""")
s = rep(s, "  evaded(W, t, a, 'melee', '몸을 비틀어 흘림', p);", "  evaded(W, t, a, 'melee', '몸을 비틀어 흘림', p);\n  grabTry(W, t, a, 'evade');   // v7.19.2 피하며 자루를 잡음")
s = rep(s, "    applyDmg(W, u, t, Math.max(1, Math.round(base * (1 - (1 - (pr ? (PR.mul != null ? PR.mul : 0.5) : R.blockMul)) * (t.gTal != null ? t.gTal : 1)))), o);\n    return o;\n  }",
        "    applyDmg(W, u, t, Math.max(1, Math.round(base * (1 - (1 - (pr ? (PR.mul != null ? PR.mul : 0.5) : R.blockMul)) * (t.gTal != null ? t.gTal : 1)))), o);\n    if (!o.far && !J) grabTry(W, t, u, 'block');   // v7.19.2 막으며 자루를 잡음\n    return o;\n  }")
s = rep(s, "  for (const u of W.units) if (u.alive && u.skill && u.skill.regen > 0 && u.skill.left < u.skill.pool)", "  stepFlora(W, dt);   // v7.19.2 역장 · 뿌리 벽 · 열매\n  for (const u of W.units) if (u.alive && u.skill && u.skill.regen > 0 && u.skill.left < u.skill.pool)")
s = rep(s, "if (typeof module !== 'undefined') module.exports = { ", "if (typeof module !== 'undefined') module.exports = { wardStop, stepFlora, grabTry, ")
s = rep(s, "why: u.act.why || '' } : null, order: u.side === 0 ? orderTxt", "why: u.act.why || '', s: u.act.s || '' } : null, order: u.side === 0 ? orderTxt")   # v1.3
wr('rt3_tail.js', s)
print('patch7192 OK')
