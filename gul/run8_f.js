/* ---------- v8.4.0 세르파 슬라임 조직 — run8_f.js v1.1 (v1.1: 보스판 세르파 체력 240 (160 은 평균 15초 만에 쓰러져 조직이 자랄 틈이 없었음) · v1.0: 세르파는 작은 슬라임을 계속 뽑아 곁에 두고 (코스트) · 넷을 모아 굴란 · 몽 · 핀 · 튤린으로 합침 · 수정 우박 · 세르파가 쓰러지면 작은 슬라임은 녹음 (합친 넷은 남음) · 보스든 동료든 같은 규칙) ----------
   코스트: 작은 슬라임 (cap 마리까지) — 세르파가 gap 초마다 하나씩 뽑음. 넷이 모이면 상황을 보고 합침 (mergeT 초 동안 한데 엉김 — 그사이 셋 아래로 줄면 흩어짐).
   무엇으로 합치나: 다친 동료가 있으면 튤린 (치유) · 적이 가까우면 몽 (탱커) · 멀면 핀 (저격) · 그 밖엔 굴란 (검사). 같은 것은 하나씩 · 합친 것은 upMax 까지.
   합친 넷은 [레이더] (엔진 v8.4.0 — 3초마다 둘레 14칸의 적을 앎). 아군 쪽 소환은 우리 동료가 모두 떠나거나 쓰러지면 녹아 사라짐 · 여정이 끝나면 남지 않음. */
const SP8 = { gap: 3.2, cap: 5, need: 4, mergeMin: 3, mergeT: 1.4, mergeCd: 5, upMax: 2, first: 1.2, hailCd: [12, 15], hailWarn: 1.3, hailR: 1.8, hailDmg: 18, hailStun: 0.35, hailRng: 11, allyHp: 90 };
const SP8_UP = ['굴란', '몽', '핀', '튤린'];
if (FOE8['세르파']){ FOE8['세르파'].ov = { ...FOE8['세르파'].ov, hp: 240 }; FOE8['세르파'].allyOv = { hp: SP8.allyHp }; }   // 도감: 체력 90 · 보스판은 240 (조직이 자랄 틈 — 판 재기 160 은 15초 만에 쓰러짐)
if (BOSS8.serpa) BOSS8.serpa.foes = [['세르파', 1], ['몽', 1], ['슬라임', 4]];   // 조직은 싸우면서 커짐
const sp8Is = u => u && (u.ref === 'C-277' || u.name === '세르파');
const sp8Rf = (a, b) => a + Math.random() * (b - a);
function sp8Busy(W, u){ return !u.alive || u.gone || W.t < (u.stunT || 0) || prone(W, u); }
function sp8Free(W, x, y){ const m = W.map, cx = Math.floor(x), cy = Math.floor(y); return cx >= 0 && cy >= 0 && cx < m.W && cy < m.H && m.t[cy * m.W + cx] === 0; }
function sp8Spot(W, u, r){
  for (let k = 0; k < 12; k++){ const a = Math.random() * 6.283, rr = (r || 1) * (0.7 + Math.random() * 0.6), x = u.x + Math.cos(a) * rr, y = u.y + Math.sin(a) * rr; if (sp8Free(W, x, y) && !W.units.some(o => o.alive && !o.gone && Math.hypot(o.x - x, o.y - y) < 0.45)) return { x, y }; }
  return { x: u.x + (Math.random() - 0.5) * 0.4, y: u.y + (Math.random() - 0.5) * 0.4 };
}
function sp8Make(W, own, kind, x, y){
  const R = (typeof run8On === 'function' && run8On()) ? R8S() : null;
  const base = own.side === 1 ? foe8(kind, R ? R.f : 2) : { ...fromDesign({ ...clone(FOE8[kind]), side: 0 }, 0), id: uid() };
  const p = { ...base, side: own.side, x, y, summon: kind === '슬라임' ? 'slime' : 'up', owner: own.pid || own.i }; S.units.push(p);
  const b = addUnit(W, p); b.summon = p.summon; b.owner = own.i; b.sk = kind;
  if (own.side === 1){ b.state = own.state || 'hunt'; if (own.target){ b.target = own.target; b.last = own.last ? { ...own.last } : { x: own.target.x, y: own.target.y }; } }
  return b;
}
function sp8Melt(W, s){ s.alive = false; s.hp = 0; s.gone = 'merge'; s.act = null; s.order = null; }
function sp8Kind(W, u, have){
  const mine = W.units.filter(x => x.alive && !x.gone && x.side === u.side), foes = W.units.filter(x => x.alive && !x.gone && x.side !== u.side);
  const nd = foes.length ? Math.min(...foes.map(f => Math.hypot(f.x - u.x, f.y - u.y))) : 99, L = [];
  if (mine.some(x => !x.summon && x.hp < x.max * 0.55)) L.push('튤린');
  if (nd < 4) L.push('몽'); if (nd > 7) L.push('핀');
  L.push('굴란', '몽', '핀', '튤린');
  return L.find(k => !have.includes(k)) || null;
}
// ===== 판마다 =====
function sp8Tick(W){
  if (!W || W.over || W.duel) return;
  const Z = W.sp8 || (W.sp8 = { o: {}, hail: [], seen: false });
  for (const u of W.units){
    if (!sp8Is(u) || !u.alive || u.gone) continue;
    const o = Z.o[u.i] || (Z.o[u.i] = { next: W.t + SP8.first, mgT: W.t + 3, hailT: W.t + sp8Rf(6, 9), mg: null });
    for (const s of W.units) if (s.side === u.side && s.alive && !s.gone && s.owner == null && (s.name === '슬라임' || SP8_UP.includes(s.name))){ s.owner = u.i; s.summon = s.name === '슬라임' ? 'slime' : 'up'; s.sk = s.name; }   // 처음부터 곁에 있던 것도 조직
    const sl = W.units.filter(s => s.alive && !s.gone && s.owner === u.i && s.summon === 'slime'), ups = W.units.filter(s => s.alive && !s.gone && s.side === u.side && s.summon === 'up');
    const foes = W.units.filter(f => f.alive && !f.gone && f.side !== u.side), war = foes.some(f => canSee(W, u, f) || (u.side === 1 && u.state === 'hunt'));
    // 합치는 중
    if (o.mg){ if (W.t >= o.mg.t){ const left = o.mg.ids.map(i => W.units[i]).filter(s => s && s.alive && !s.gone);
        if (left.length >= SP8.mergeMin){ const x = left.reduce((a, s) => a + s.x, 0) / left.length, y = left.reduce((a, s) => a + s.y, 0) / left.length; left.forEach(s => sp8Melt(W, s));
          const at = sp8Free(W, x, y) ? { x, y } : { x: left[0].x, y: left[0].y }, b = sp8Make(W, u, o.mg.kind, at.x, at.y);
          (W.sp8Fx || (W.sp8Fx = [])).push({ x: b.x, y: b.y, t: W.t, big: true });
          logEv(W, { k: 'r8', s: `🫧 슬라임 ${left.length}이 하나로 — ${o.mg.kind}!`, c: u.side ? 'bad' : 'good', vis: u.side === 0 || !!u.seenBy || !!b.seenBy }); }
        else logEv(W, { k: 'r8', s: '🫧 엉기던 슬라임이 흩어졌다.', c: u.side ? 'good' : 'bad', vis: u.side === 0 || !!u.seenBy });
        o.mg = null; o.mgT = W.t + SP8.mergeCd; }
      continue; }
    if (sp8Busy(W, u)) continue;
    // 뽑기 (코스트 유지)
    if (W.t >= o.next && sl.length < SP8.cap){ o.next = W.t + SP8.gap; const at = sp8Spot(W, u, u.r + 0.6), b = sp8Make(W, u, '슬라임', at.x, at.y);
      (W.sp8Fx || (W.sp8Fx = [])).push({ x: b.x, y: b.y, t: W.t });
      if (!Z.seen){ Z.seen = true; logEv(W, { k: 'r8', s: '🫧 세르파가 바닥의 젤리를 손끝으로 끌어올린다 — 작은 슬라임.', c: 'dim', vis: u.side === 0 || !!u.seenBy }); } }
    // 합치기 (넷 · 싸우는 중)
    if (war && W.t >= o.mgT && sl.length >= SP8.need && ups.length < SP8.upMax){ const kind = sp8Kind(W, u, ups.map(s => s.sk || s.name));
      if (kind){ const pick = sl.sort((a, c) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(c.x - u.x, c.y - u.y)).slice(0, SP8.need);
        o.mg = { t: W.t + SP8.mergeT, ids: pick.map(s => s.i), kind, t0: W.t }; pick.forEach(s => stun(W, s, SP8.mergeT, null));
        logEv(W, { k: 'r8', s: `🫧 세르파가 손뼉을 친다 — 슬라임 넷이 한데 엉긴다 (${kind}).`, c: u.side ? 'bad' : 'good', vis: u.side === 0 || !!u.seenBy }); continue; } }
    // 수정 우박 (보이는 적 무리)
    if (war && W.t >= o.hailT){ const T = foes.filter(f => canSee(W, u, f) && Math.hypot(f.x - u.x, f.y - u.y) <= SP8.hailRng);
      if (T.length){ const c = T.map(f => ({ f, n: T.filter(g => Math.hypot(g.x - f.x, g.y - f.y) < SP8.hailR * 1.4).length })).sort((a, b) => b.n - a.n)[0].f;
        Z.hail.push({ x: c.x, y: c.y, t: W.t + SP8.hailWarn, t0: W.t, by: u.i, side: u.side }); o.hailT = W.t + sp8Rf(SP8.hailCd[0], SP8.hailCd[1]);
        logEv(W, { k: 'r8', s: '💎 천장에서 수정이 반짝인다 — 우박!', c: u.side ? 'bad' : 'good', vis: u.side === 0 || !!u.seenBy }); } else o.hailT = W.t + 1.5; }
  }
  // 우박이 떨어짐
  if (Z.hail.length) Z.hail = Z.hail.filter(h => { if (W.t < h.t) return true; const by = W.units[h.by];
    for (const t of W.units) if (t.alive && !t.gone && t.side !== h.side && Math.hypot(t.x - h.x, t.y - h.y) <= SP8.hailR){ hurtRaw(W, by || t, t, SP8.hailDmg, { tag: '수정 우박' }); if (t.alive) stun(W, t, SP8.hailStun, by ? by.i : null); }
    (W.sp8Fx || (W.sp8Fx = [])).push({ x: h.x, y: h.y, t: W.t, hail: true }); return false; });
  // 세르파가 쓰러지면 작은 슬라임은 녹음 · 우리 동료가 판에 아무도 없으면 아군 소환은 녹음
  for (const s of W.units){ if (!s.alive || s.gone || !s.summon) continue; const ow = W.units[s.owner];
    if (s.summon === 'slime' && (!ow || !ow.alive || ow.gone)){ sp8Melt(W, s); (W.sp8Fx || (W.sp8Fx = [])).push({ x: s.x, y: s.y, t: W.t }); if (!Z.meltLog){ Z.meltLog = true; logEv(W, { k: 'r8', s: '🫧 왕을 잃은 작은 슬라임들이 바닥으로 녹아내린다.', c: s.side ? 'good' : 'bad', vis: true }); } } }
  if (W.units.some(s => s.side === 0 && s.summon && s.alive && !s.gone) && !W.units.some(u => u.side === 0 && !u.summon && u.alive && !u.gone)) for (const s of W.units) if (s.side === 0 && s.summon && s.alive && !s.gone) sp8Melt(W, s);
  if (W.sp8Fx && W.sp8Fx.length) W.sp8Fx = W.sp8Fx.filter(f => W.t - f.t < 0.8);
}
// ===== 그림 =====
function sp8Draw(Wd, ox, oy, ts){
  const Z = Wd.sp8, now = Wd.t, pulse = 0.5 + 0.5 * Math.sin(performance.now() / 110); ctx.save();
  const ring = (x, y, r, col, w) => { ctx.beginPath(); ctx.arc(ox + x * ts, oy + y * ts, r * ts, 0, 6.283); ctx.strokeStyle = col; ctx.lineWidth = w || Math.max(1.5, ts * 0.05); ctx.stroke(); };
  if (Z){ for (const h of Z.hail){ const k = Math.min(1, (now - h.t0) / SP8.hailWarn); ctx.beginPath(); ctx.arc(ox + h.x * ts, oy + h.y * ts, SP8.hailR * ts, 0, 6.283); ctx.fillStyle = `rgba(150,230,255,${(0.08 + 0.18 * k).toFixed(2)})`; ctx.fill(); ring(h.x, h.y, SP8.hailR, `rgba(170,240,255,${(0.4 + 0.5 * pulse * k).toFixed(2)})`); ring(h.x, h.y, SP8.hailR * (1 - k) + 0.05, 'rgba(220,250,255,.7)'); }
    for (const k in Z.o){ const o = Z.o[k], u = Wd.units[k]; if (!o.mg || !u) continue; const L = o.mg.ids.map(i => Wd.units[i]).filter(s => s && s.alive && !s.gone); if (!L.length) continue;
      const cx = L.reduce((a, s) => a + s.x, 0) / L.length, cy = L.reduce((a, s) => a + s.y, 0) / L.length, q = Math.min(1, (now - o.mg.t0) / SP8.mergeT);
      ctx.strokeStyle = `rgba(120,255,170,${(0.35 + 0.4 * pulse).toFixed(2)})`; ctx.lineWidth = Math.max(2, ts * 0.08); ctx.beginPath(); for (const s of L){ ctx.moveTo(ox + s.x * ts, oy + s.y * ts); ctx.lineTo(ox + cx * ts, oy + cy * ts); } ctx.stroke();
      ctx.beginPath(); ctx.arc(ox + cx * ts, oy + cy * ts, ts * (0.15 + 0.45 * q), 0, 6.283); ctx.fillStyle = `rgba(130,255,180,${(0.25 + 0.35 * q).toFixed(2)})`; ctx.fill(); } }
  for (const f of Wd.sp8Fx || []){ const a = 1 - (now - f.t) / 0.8; if (a <= 0) continue; ring(f.x, f.y, (f.big ? 0.9 : f.hail ? SP8.hailR : 0.4) * (1.3 - a * 0.5), f.hail ? `rgba(200,245,255,${a.toFixed(2)})` : `rgba(120,255,170,${a.toFixed(2)})`, Math.max(2, ts * 0.07)); }
  for (const u of Wd.units){ if (!u.alive || u.gone || !u.radar || u.rpLast == null) continue; const a = 1 - (now - u.rpLast) / 0.7; if (a <= 0) continue; if (u.side === 1 && !u.seenBy) continue; ring(u.x, u.y, 0.6 + (1 - a) * 3.4, `rgba(110,240,200,${(a * 0.5).toFixed(2)})`); }
  ctx.restore();
}
