/* ---------- v8.3.0 히든보스 적뢰 — run8_e.js v1.3 (v1.3: 성해포를 줄 사람 목록에서 소환 (슬라임) 은 뺌 · v1.2: 판 재기 마무리 — 체력 5200 · 평타 16 · 자동 판 3/10 승 · 평균 25초 (직접 피하면 더 오름) · v1.1: 아군은 예고를 보면 가끔 스스로 피함 (붉은 원 55% · 번개창 45% · 날라차기 35% · 회피 특성 +20%) · 판 재기로 수치 (체력 5200 · 평타 16 · 패턴은 고정 피해) · 착지 뒤 포효 2.5초 · v1.0: 1F 1S 에서 아래로 — "굴 밖으로?" → 30초 기다리면 폭우 · 적뢰 낙하 · 천벌 · [낙인:적뢰] · 성해포) ----------
   적뢰 (C-044 · 7성의 기준 · 신이 아닌 신의 피조물): 키 5M · 신성A · 갑피 · 초속 육탄 (맨손) · 잘 넘어지지 않음.
   패턴 — 낙하 (떨어지는 자리는 즉사 · 둘레 큰 피해) → 날라차기 (첫 패턴 · 예고선 뒤 돌진 · 넘어뜨림) · 붉은 번개창 (예고선 → 감전 + 작은 천벌) · 천벌:적뢰 (붉은 원 → 직격 · 둘레).
   2페이즈 (체력 절반): 붉은 번개 폭발 · 빨라짐 · 천벌이 셋 · 쿨이 짧아짐.
   천벌을 직격으로 맞고 살아남으면 낮은 확률로 [낙인:적뢰] (수전증 — 엔진). 신성 (카리우스 · 성해포) 은 낙인이 남지 않음. 오딜의 방에서 지울 수 있음.
   성해포 (적뢰를 쓰러뜨리면): 낀 사람 [신성E] · 재생 초당 1.5. 낙인이 있는 이가 끼면 수전증이 사라지고 붉은 번개창 (14초마다 스스로) 을 씀. */
const JR8 = { kickDmg: 45, spearDmg: 40, miniDmg: 25, blastDmg: 35, wait: 30, rainT: 3, warnFall: 1.8, fallR: 1.1, fallR2: 3.5, kickCd: [7, 10], spearCd: [10, 13], boltCd: [13, 16], p2: 0.5, p2cd: 0.6, kickV: 16, kickLen: 8, kickWarn: 0.55, spearWarn: 0.8, spearLen: 13, spearW: 0.6, boltWarn: 1.6, boltR: 1.2, boltR2: 2.6, brandP: 0.35, allyCd: 14 };
const jrRnd = ([a, b]) => a + Math.random() * (b - a);
function jrDesign(){ return fromDesign({ key: '적뢰', name: '적뢰', side: 1, ref: 'C-044', tier: 7, cls: '기동', role: '공격수', weapon: '맨손', height: 5.0, weight: 420, sizeCls: '초대형', nv: true, nvG: 'S', ccRes: 0.8, noChg: true, ov: { hp: 5200, atk: 16, spd: 3.4 }, traits: ['갑피', '신성A', '베테랑', '보스'], note: '천벌의 화신 — 신이 아닌 신의 피조물 (7성)' }, 1); }
const jrHoly = u => u.ref === 'C-003' || (u.traits || []).some(t => /^신성/.test(t));
// ===== 캠페인 띠: 1S 에서 "↓ 굴 밖으로" · 기다리는 시간 =====
function jrBarHook(h, C, W){
  if (!C || typeof run8On === 'function' && run8On() || C.s !== 1 || !W || W.over) return h;
  if (C.jr8 && !['won', 'lost'].includes(C.jr8.st) && !W.jr8) C.jr8 = null;   // 새로 고침으로 판이 다시 만들어졌으면 처음부터
  if (!C.jr8) return h.replace('<span class="cb">', '<span class="cb"><button class="btn sm" type="button" data-jr8="ask" title="처음 떨어졌던 아래쪽 틈 — 굴 밖으로 이어질지도">↓ 굴 밖으로</button>');
  if (W.jr8 && W.jr8.st === 'wait') return h.replace('<span class="cb">', `<span class="cb"><span class="ck">⏳ ${Math.max(0, Math.ceil(JR8.wait - (W.t - W.jr8.t0)))}초</span>`);
  return h;
}
document.addEventListener('click', e => { const b = e.target.closest('[data-jr8]'); if (!b) return; if (b.dataset.jr8 === 'ask') jrAsk(); });
function jrAsk(){
  talkLines([{ narr: '아래쪽 바위틈에서 바람이 올라온다. 처음 떨어졌던 그 길 — 굴 밖으로 이어질지도 모른다.' }, { narr: '틈은 좁고, 위로는 아무것도 보이지 않는다. 기다리면… 무언가 달라질까.' },
    { ask: [['굴로 돌아간다 (그 자리에서 기다린다)', '!r8:jrWait'], ['아니다, 안으로 간다', '']] }]);
}
function jrWait(){
  const W = world, C = S.camp; if (!W || !C) return;
  C.jr8 = { st: 'wait' }; W.jr8 = { st: 'wait', t0: W.t, q: [] };
  for (const u of W.units) if (u.side === 0 && u.alive && !u.down){ u.order = { k: 'move', x: Math.max(1.5, Math.min(W.map.W - 1.5, u.x)), y: W.map.H - 1.6 }; }
  logEv(W, { k: 'r8', s: '🌧 아래쪽 틈 앞에서 기다린다 — 30초.', c: 'dim', vis: true }); toast('틈 앞에서 기다려요 — 30초'); save(); campBarRender(true);
}
// ===== 판마다 =====
function jrTickAll(W){
  if (!W) return; const J = W.jr8;
  if (J) jrBoss(W, J);
  if (W.jrq && W.jrq.length) for (const e of W.jrq.splice(0)){ if (W.t < e.t){ W.jrq.push(e); continue; } jrFire(W, e); }
  jrAllies(W);
  if (W.jr8 && W.camp && S.camp && W.t - (W.jrBarT || 0) > 0.5){ W.jrBarT = W.t; campBarRender(); }
}
function jrBoss(W, J){
  const C = S.camp;
  if (J.st === 'wait' && W.t - J.t0 >= JR8.wait){ J.st = 'rain'; J.t1 = W.t; W.rain = 1; logEv(W, { k: 'r8', s: '🌧 갑자기 비가 퍼붓기 시작한다. 하늘이 낮게 울린다.', c: 'bad', vis: true }); campBarRender(true); return; }
  if (J.st === 'rain' && W.t - J.t1 >= JR8.rainT){
    const al = W.units.filter(u => u.side === 0 && u.alive); if (!al.length) return;
    let x = al.reduce((a, u) => a + u.x, 0) / al.length + (Math.random() - 0.5) * 2.4, y = al.reduce((a, u) => a + u.y, 0) / al.length + (Math.random() - 0.5) * 2.4;
    x = Math.max(2, Math.min(W.map.W - 2, x)); y = Math.max(2, Math.min(W.map.H - 2, y));
    J.st = 'fall'; J.mark = { x, y, t: W.t + JR8.warnFall, r: JR8.fallR, r2: JR8.fallR2, big: true };
    const M = J.mark; jrDodge(W, u => Math.hypot(u.x - M.x, u.y - M.y) < M.r2, 0.6, u => { const dx = u.x - M.x, dy = u.y - M.y, d = Math.hypot(dx, dy) || 1, k = M.r2 + 0.6; return { x: dx / d * k - dx, y: dy / d * k - dy }; });
    logEv(W, { k: 'r8', s: '⚡ 하늘이 붉게 갈라진다 — 무언가 떨어진다! 붉은 원에서 벗어나!', c: 'bad', vis: true }); return; }
  if (J.st === 'fall' && W.t >= J.mark.t){
    const p = { ...jrDesign(), id: uid(), x: J.mark.x, y: J.mark.y }; S.units.push(p); const b = addUnit(W, p); J.bi = b.i; J.st = 'fight';
    for (const t of W.units){ if (t === b || !t.alive) continue; const d = Math.hypot(t.x - b.x, t.y - b.y);
      if (d < J.mark.r){ hurtRaw(W, b, t, t.hp * 10 + 999, { tag: '적뢰 낙하' }); }
      else if (d < J.mark.r2){ hurtRaw(W, b, t, t.max * 0.35, { tag: '낙하의 충격' }); if (t.alive) knockDown(W, t, 1.2, b.i, '낙하의 충격'); } }
    if (W.fxOn) W.fx.push({ k: 'num', x: b.x, y: b.y - 1, s: '⚡ 적뢰', c: 'd', t0: W.t });
    const near = W.units.filter(u => u.side === 0 && u.alive).sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y))[0];
    if (near){ b.state = 'hunt'; b.target = near; b.last = { x: near.x, y: near.y }; b.sense && (b.sense[near.i] = { x: near.x, y: near.y, t: W.t, exact: true }); }
    b.stunT = W.t + 2.5; b.saT = W.t + 2.5; logEv(W, { k: 'r8', s: '⚡ 적뢰가 몸을 일으키며 포효한다 — 비가 거꾸로 솟는다.', c: 'bad', vis: true });   // 착지 뒤 포효 (반응할 틈)
    J.kickT = W.t + 3.4; J.spearT = W.t + 9; J.boltT = W.t + 12; J.mark = null; J.lastT = W.t; C.jr8.st = 'fight';
    logEv(W, { k: 'r8', s: '⚡ 적뢰가 떨어졌다 — 천벌의 화신.', c: 'bad', vis: true }); save(); campBarRender(true);
    talkLines([{ box: '히든보스 — 적뢰. 신이 아닌, 신의 피조물. 붉은 원 · 붉은 선이 보이면 피하세요.' }]); return; }
  if (J.st !== 'fight') return;
  const b = W.units[J.bi], dt = Math.max(0, Math.min(0.1, W.t - (J.lastT || W.t))); J.lastT = W.t;
  if (!b || !b.alive){ J.st = 'won'; W.rain = 0; jrWin(W); return; }
  if (!W.units.some(u => u.side === 0 && u.alive)){ C.why = '적뢰의 천벌에 쓰러졌다'; C.jr8.st = 'lost'; return; }
  if (!J.p2 && b.hp < b.max * JR8.p2){ J.p2 = true; b.spd *= 1.25; b.atk = Math.round(b.atk * 1.15); W.rain = 2;
    for (const t of W.units) if (t.side === 0 && t.alive && Math.hypot(t.x - b.x, t.y - b.y) < 3.2){ hurtRaw(W, b, t, JR8.blastDmg, { tag: '붉은 번개 폭발' }); if (t.alive) knockDown(W, t, 1.0, b.i, '붉은 번개 폭발'); }
    logEv(W, { k: 'r8', s: '⚡ 적뢰의 몸에서 붉은 번개가 터진다 — 2페이즈!', c: 'bad', vis: true }); }
  const cf = J.p2 ? JR8.p2cd : 1, busy = b.down || b.kb || W.t < (b.stunT || -9);
  // 날라차기 진행
  if (J.kick){ const K = J.kick;
    if (busy){ J.kick = null; J.kickT = W.t + jrRnd(JR8.kickCd) * cf; return; }
    b.act = null; stop(b);
    if (W.t < K.warn) return;
    const st = JR8.kickV * dt, nx = b.x + K.dx * st, ny = b.y + K.dy * st;
    if (rock(W.map, nx, ny) || K.gone >= K.len){ J.kick = null; J.kickT = W.t + jrRnd(JR8.kickCd) * cf; return; }
    b.x = nx; b.y = ny; K.gone += st;
    for (const t of W.units){ if (t.side === b.side || !t.alive || K.hit.includes(t.i)) continue; if (Math.hypot(t.x - b.x, t.y - b.y) < b.r + t.r + 0.2){ K.hit.push(t.i); hurtRaw(W, b, t, JR8.kickDmg * (J.p2 ? 1.2 : 1), { tag: '날라차기' }); if (t.alive){ knockDown(W, t, 1.6, b.i, '날라차기'); const px = t.x + K.dx * 1.2, py = t.y + K.dy * 1.2; if (!rock(W.map, px, py)){ t.x = px; t.y = py; } } } }
    return; }
  if (busy) return;
  const foes = W.units.filter(u => u.side === 0 && u.alive && !u.gone);
  if (!foes.length) return;
  if (W.t >= J.kickT){ const t = foes.filter(u => Math.hypot(u.x - b.x, u.y - b.y) < 9).sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y))[0];
    if (t){ const d = Math.hypot(t.x - b.x, t.y - b.y) || 1; J.kick = { dx: (t.x - b.x) / d, dy: (t.y - b.y) / d, len: Math.min(JR8.kickLen, d + 2), gone: 0, hit: [], warn: W.t + JR8.kickWarn, x0: b.x, y0: b.y }; const K = J.kick; jrDodge(W, u => { const px = u.x - b.x, py = u.y - b.y, s = px * K.dx + py * K.dy; return s > 0 && s < K.len + 1 && Math.abs(px * K.dy - py * K.dx) < 1.2; }, 0.35, u => { const side = ((u.x - b.x) * K.dy - (u.y - b.y) * K.dx) >= 0 ? 1 : -1; return { x: K.dy * 1.6 * side, y: -K.dx * 1.6 * side }; });
      logEv(W, { k: 'r8', s: `🦶 적뢰가 몸을 낮춘다 — 날라차기 (${t.name})`, c: 'bad', vis: true }); return; }
    J.kickT = W.t + 1; }
  if (W.t >= J.spearT){ const t = foes.filter(u => Math.hypot(u.x - b.x, u.y - b.y) < JR8.spearLen).sort((a, c) => Math.hypot(c.x - b.x, c.y - b.y) - Math.hypot(a.x - b.x, a.y - b.y))[0];
    J.spearT = W.t + jrRnd(JR8.spearCd) * cf;
    if (t){ const d = Math.hypot(t.x - b.x, t.y - b.y) || 1, sx = (t.x - b.x) / d, sy = (t.y - b.y) / d; jrDodge(W, u => { const px = u.x - b.x, py = u.y - b.y, s = px * sx + py * sy; return s > 0 && s < JR8.spearLen && Math.abs(px * sy - py * sx) < JR8.spearW + 0.5; }, 0.45, u => { const side = ((u.x - b.x) * sy - (u.y - b.y) * sx) >= 0 ? 1 : -1; return { x: sy * 1.4 * side, y: -sx * 1.4 * side }; });
      (W.jrq = W.jrq || []).push({ k: 'spear', t: W.t + JR8.spearWarn, src: b.i, x0: b.x, y0: b.y, dx: (t.x - b.x) / d, dy: (t.y - b.y) / d, len: JR8.spearLen, w: JR8.spearW, dmg: JR8.spearDmg * (J.p2 ? 1.2 : 1), stun: 1.0, mini: { r: 1.0, dmg: JR8.miniDmg }, warn0: W.t, any: true }); logEv(W, { k: 'r8', s: `🔺 적뢰가 붉은 번개창을 겨눈다 (${t.name})`, c: 'bad', vis: true }); } }
  if (W.t >= J.boltT){ J.boltT = W.t + jrRnd(JR8.boltCd) * cf; const n = J.p2 ? 3 : 2, L = foes.slice().sort(() => Math.random() - 0.5).slice(0, n);
    for (const t of L){ const e = { k: 'bolt', t: W.t + JR8.boltWarn, src: b.i, x: t.x + (Math.random() - 0.5) * 0.8, y: t.y + (Math.random() - 0.5) * 0.8, r: JR8.boltR, r2: JR8.boltR2, warn0: W.t, brand: true }; (W.jrq = W.jrq || []).push(e);
      jrDodge(W, u => Math.hypot(u.x - e.x, u.y - e.y) < e.r + 0.4, 0.55, u => { const dx = u.x - e.x, dy = u.y - e.y, d = Math.hypot(dx, dy) || 1, k = e.r + 1.1; return { x: dx / d * k - dx, y: dy / d * k - dy }; }); }
    logEv(W, { k: 'r8', s: `⚡ 하늘에서 천벌이 겨눠진다 — 붉은 원 ${n}개, 벗어나!`, c: 'bad', vis: true }); }
}
// 아군의 피하기 (예고를 보고 — 확률)
function jrDodge(W, ok, p, away){
  for (const u of W.units){ if (u.side !== 0 || !u.alive || u.down || W.t < (u.stunT || -9) || !ok(u)) continue;
    const q = p + ((u.traits || []).some(t => /^회피/.test(t)) ? 0.2 : 0); if (Math.random() >= q) continue;
    const v = away(u); let tx = u.x + v.x, ty = u.y + v.y; tx = Math.max(1, Math.min(W.map.W - 1, tx)); ty = Math.max(1, Math.min(W.map.H - 1, ty)); if (rock(W.map, tx, ty)) continue;
    u.order = { k: 'move', x: tx, y: ty, dodge: true }; if (typeof preempt === 'function') preempt(W, u); }
}
// 예고가 끝난 공격
function jrFire(W, e){
  const src = W.units[e.src]; if (!src) return;
  if (e.k === 'spear'){ const ex = e.x0 + e.dx * e.len, ey = e.y0 + e.dy * e.len;
    for (const t of W.units){ if (!t.alive || t === src || (!e.any && t.side === src.side)) continue; const px = t.x - e.x0, py = t.y - e.y0, s = px * e.dx + py * e.dy; if (s < 0 || s > e.len) continue; if (Math.abs(px * e.dy - py * e.dx) > e.w + t.r * 0.6) continue;
      hurtRaw(W, src, t, e.dmg, { tag: '붉은 번개창' }); if (t.alive) stun(W, t, e.stun, src.i); }
    if (W.fxOn) W.fx.push({ k: 'num', x: ex, y: ey, s: '⚡', c: 'd', t0: W.t });
    if (e.mini){ const tgt = W.units.filter(t => t.alive && t.side !== src.side).map(t => ({ t, s: (t.x - e.x0) * e.dx + (t.y - e.y0) * e.dy, o: Math.abs((t.x - e.x0) * e.dy - (t.y - e.y0) * e.dx) })).filter(q => q.s > 0 && q.s < e.len && q.o < 1.2).sort((a, c) => a.s - c.s)[0];
      const mx = tgt ? tgt.t.x : ex, my = tgt ? tgt.t.y : ey; (W.jrq = W.jrq || []).push({ k: 'bolt', t: W.t + 0.8, src: e.src, x: mx, y: my, r: e.mini.r, r2: 0, dmg: e.mini.dmg, warn0: W.t, mini: true, foeOnly: !e.any }); }
    W.jrLines = (W.jrLines || []).concat([{ x0: e.x0, y0: e.y0, x1: ex, y1: ey, t: W.t, flash: true }]).slice(-6);
    return; }
  if (e.k === 'bolt'){
    for (const t of W.units){ if (!t.alive || t === src || (e.foeOnly && t.side === src.side) || (t.ref === 'C-044' && t.side === src.side)) continue; const d = Math.hypot(t.x - e.x, t.y - e.y);
      if (d < e.r){ const dmg = e.dmg != null ? e.dmg : t.max * 0.6 + 30; hurtRaw(W, src, t, dmg, { tag: e.mini ? '작은 천벌' : '천벌:적뢰' }); if (t.alive){ if (!e.mini) knockDown(W, t, 2.0, src.i, '천벌:적뢰'); if (e.brand && t.side === 0 && Math.random() < JR8.brandP) jrBrand(W, t); } }
      else if (e.r2 && d < e.r2){ hurtRaw(W, src, t, t.max * 0.2, { tag: '천벌의 여파' }); } }
    W.jrHits = (W.jrHits || []).concat([{ x: e.x, y: e.y, r: e.r, t: W.t }]).slice(-8);
    if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.6, s: e.mini ? '⚡' : '⚡ 천벌', c: 'd', t0: W.t }); }
}
function jrBrand(W, t){
  if (jrHoly(t)){ logEv(W, { k: 'r8', s: `✨ ${t.name} — 신성이 천벌을 받아 내어 낙인이 남지 않는다.`, c: 'good', vis: true }); return; }
  const p = S.units.find(x => x.id === t.pid); if (!p || (p.curses || []).includes('낙인:적뢰')) return;
  p.curses = [...(p.curses || []), '낙인:적뢰']; if (p.trinket !== '성해포') t.tremor = true;
  logEv(W, { k: 'r8', s: `☠ ${t.name} — 천벌을 맞고 살아남았다. [낙인:적뢰] (수전증 — 가끔 행동이 나가지 않음)`, c: 'bad', vis: true }); save();
}
// 성해포 + 낙인 = 붉은 번개창 (스스로 · 14초마다)
function jrAllies(W){
  for (const u of W.units){ if (u.side !== 0 || !u.alive || u.down) continue;
    if (u.jrS == null){ const p = S.units.find(x => x.id === u.pid); u.jrS = !!(p && p.trinket === '성해포' && (p.curses || []).includes('낙인:적뢰')); u.jrCd = W.t + 6; }
    if (!u.jrS || W.t < u.jrCd || u.act || W.t < (u.stunT || -9)) continue;
    const t = W.units.filter(o => o.alive && o.side !== u.side && !o.gone && canSee(W, u, o) && Math.hypot(o.x - u.x, o.y - u.y) < 10).sort((a, c) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(c.x - u.x, c.y - u.y))[0];
    if (!t) continue; u.jrCd = W.t + JR8.allyCd; const d = Math.hypot(t.x - u.x, t.y - u.y) || 1;
    (W.jrq = W.jrq || []).push({ k: 'spear', t: W.t + 0.6, src: u.i, x0: u.x, y0: u.y, dx: (t.x - u.x) / d, dy: (t.y - u.y) / d, len: 10, w: 0.5, dmg: u.atk * 1.3, stun: 0.8, mini: { r: 0.9, dmg: 22 }, warn0: W.t, any: false });
    logEv(W, { k: 'r8', s: `🔺 ${u.name} — 성해포의 붉은 번개창 (${t.name})`, c: 'good', vis: true }); }
}
// ===== 이김 · 성해포 =====
function jrWin(W){
  const C = S.camp; C.jr8 = { st: 'won', t: Date.now() }; save(); campBarRender(true);
  logEv(W, { k: 'r8', s: '⚡ 적뢰가 무릎을 꿇는다. 비가 그친다.', c: 'good', vis: true });
  talkLines([{ narr: '적뢰가 무릎을 꿇는다. 붉은 번개가 하늘로 거두어지고, 비가 그친다.' }, { narr: '그을린 바위 위에 하얀 천 한 장이 남았다 — 성해포.' },
    { box: '성해포 — 낀 사람: [신성E] · 재생 (초당 1.5). [낙인:적뢰] 가 있는 사람이 끼면 수전증이 사라지고 붉은 번개창을 스스로 씀.' }, { go: '!r8:jrGive' }]);
}
function jrGive(){
  const W = world, L = S.units.filter(p => p.side === 0 && !p.summon && (!W || W.units.some(u => u.pid === p.id && (u.alive || u.gone))));
  const el = r8Panel(`<h2>성해포를 누구에게?</h2><div class="r8sub">한 사람만 낄 수 있어요. 낙인이 있는 이가 끼면 붉은 번개창을 씁니다.</div><div class="r8pan">${L.map((p, i) => `<button class="btn" type="button" data-jrg="${i}" style="display:flex;gap:8px;align-items:center;width:100%;margin:4px 0;text-align:left"><i style="${r8Face(p.ref, 36)};border-radius:8px"></i><span><b>${esc(p.name)}</b>${(p.curses || []).includes('낙인:적뢰') ? ' <small style="color:#f88">☠ 낙인</small>' : ''}</span></button>`).join('')}</div>`);
  el.querySelectorAll('[data-jrg]').forEach(b => b.onclick = () => { jrEquip(L[+b.dataset.jrg]); r8Hide(); });
}
function jrEquip(p){
  for (const q of S.units) if (q.trinket === '성해포'){ delete q.trinket; q.traits = (q.traits || []).filter(t => t !== '신성E'); }
  p.trinket = '성해포'; if (!(p.traits || []).includes('신성E')) p.traits = [...(p.traits || []), '신성E'];
  const u = world && world.units.find(x => x.pid === p.id); if (u){ u.regenHp = 1.5; u.tremor = false; u.jrS = null; if (!u.traits.includes('신성E')) u.traits = [...u.traits, '신성E']; }
  save(); toast(`${p.name} — 성해포를 꼈어요`); if (world) logEv(world, { k: 'r8', s: `✨ ${p.name} — 성해포 (신성E · 재생)`, c: 'good', vis: true });
}
// ===== 오딜: 낙인 지우기 =====
const jrBranded = () => S.units.filter(p => p.side === 0 && (p.curses || []).includes('낙인:적뢰'));
function jrCure(){
  const L = jrBranded(); if (!L.length) return;
  for (const p of L) p.curses = p.curses.filter(c => c !== '낙인:적뢰');
  if (world) for (const u of world.units) if (L.some(p => p.id === u.pid)){ u.tremor = false; u.jrS = null; }
  save();
  talkLines([{ t: '…적뢰의 낙인이구나. 가만히 있어. 조금 뜨거울 거야.', name: '오딜', img: 'odile_t1' }, { narr: '오딜의 손끝에서 하얀 불이 번진다. 떨리던 손이 멎는다.' }, { box: `[낙인:적뢰] 가 지워졌다 — ${L.map(p => p.name).join(' · ')}` }]);
}
Object.assign(R8X, { jrWait: () => jrWait(), jrGive: () => jrGive(), jrCure: () => jrCure() });
// ===== 그림: 예고선 · 붉은 원 · 번개 · 비 =====
function jr8Draw(Wd, ox, oy, ts){
  const J = Wd.jr8, now = Wd.t, pulse = 0.5 + 0.5 * Math.sin(performance.now() / 90);
  ctx.save();
  const circ = (x, y, r, a, fill) => { ctx.beginPath(); ctx.arc(ox + x * ts, oy + y * ts, r * ts, 0, 6.283); if (fill){ ctx.fillStyle = `rgba(255,40,40,${a})`; ctx.fill(); } ctx.strokeStyle = `rgba(255,70,70,${Math.min(1, a * 3)})`; ctx.lineWidth = Math.max(2, ts * 0.06); ctx.stroke(); };
  if (J && J.mark){ const k = 1 - Math.max(0, (J.mark.t - now) / JR8.warnFall); circ(J.mark.x, J.mark.y, J.mark.r2, 0.08 + 0.1 * k, true); circ(J.mark.x, J.mark.y, J.mark.r, 0.2 + 0.3 * k * pulse, true); }
  for (const e of Wd.jrq || []){ const k = Math.min(1, (now - e.warn0) / Math.max(0.1, e.t - e.warn0));
    if (e.k === 'bolt'){ if (e.r2) circ(e.x, e.y, e.r2, 0.06, true); circ(e.x, e.y, e.r, 0.15 + 0.3 * k * pulse, true); }
    if (e.k === 'spear'){ ctx.strokeStyle = `rgba(255,50,60,${(0.25 + 0.5 * k).toFixed(2)})`; ctx.lineWidth = Math.max(2, e.w * ts * 1.2 * (0.4 + 0.6 * k)); ctx.setLineDash([ts * 0.3, ts * 0.15]); ctx.beginPath(); ctx.moveTo(ox + e.x0 * ts, oy + e.y0 * ts); ctx.lineTo(ox + (e.x0 + e.dx * e.len) * ts, oy + (e.y0 + e.dy * e.len) * ts); ctx.stroke(); ctx.setLineDash([]); } }
  if (J && J.kick && now < J.kick.warn){ const K = J.kick; ctx.strokeStyle = `rgba(255,170,60,${(0.35 + 0.4 * pulse).toFixed(2)})`; ctx.lineWidth = Math.max(3, ts * 0.5); ctx.beginPath(); ctx.moveTo(ox + K.x0 * ts, oy + K.y0 * ts); ctx.lineTo(ox + (K.x0 + K.dx * K.len) * ts, oy + (K.y0 + K.dy * K.len) * ts); ctx.stroke(); }
  for (const l of Wd.jrLines || []){ const a = 1 - (now - l.t) / 0.4; if (a <= 0) continue; ctx.strokeStyle = `rgba(255,${120 + Math.round(100 * Math.random())},120,${a.toFixed(2)})`; ctx.lineWidth = Math.max(2, ts * 0.12); ctx.beginPath(); ctx.moveTo(ox + l.x0 * ts, oy + l.y0 * ts); const n = 6; for (let i = 1; i <= n; i++){ const f = i / n; ctx.lineTo(ox + (l.x0 + (l.x1 - l.x0) * f) * ts + (i < n ? (Math.random() - 0.5) * ts * 0.4 : 0), oy + (l.y0 + (l.y1 - l.y0) * f) * ts + (i < n ? (Math.random() - 0.5) * ts * 0.4 : 0)); } ctx.stroke(); }
  for (const h of Wd.jrHits || []){ const a = 1 - (now - h.t) / 0.5; if (a <= 0) continue; ctx.fillStyle = `rgba(255,230,230,${(a * 0.6).toFixed(2)})`; ctx.beginPath(); ctx.arc(ox + h.x * ts, oy + h.y * ts, h.r * ts * (1 + (1 - a)), 0, 6.283); ctx.fill(); ctx.strokeStyle = `rgba(255,60,60,${a.toFixed(2)})`; ctx.lineWidth = Math.max(2, ts * 0.1); ctx.beginPath(); ctx.moveTo(ox + h.x * ts, oy + (h.y - 12) * ts); for (let i = 1; i <= 8; i++) ctx.lineTo(ox + (h.x + (Math.random() - 0.5) * 0.8) * ts, oy + (h.y - 12 + i * 1.5) * ts); ctx.stroke(); }
  if (Wd.rain){ const c = ctx.canvas, w = c.clientWidth || c.width, h = c.clientHeight || c.height, n = Wd.rain > 1 ? 260 : 150, t0 = performance.now() / 1000; ctx.strokeStyle = Wd.rain > 1 ? 'rgba(255,190,200,.32)' : 'rgba(190,210,255,.3)'; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let i = 0; i < n; i++){ const sx = ((i * 97.3 + t0 * 380 * (1 + (i % 3) * 0.2)) % (w + 80)) - 40, sy = ((i * 53.7 + t0 * 900 * (1 + (i % 5) * 0.1)) % (h + 60)) - 30; ctx.moveTo(sx, sy); ctx.lineTo(sx - 6, sy + 16); } ctx.stroke(); }
  ctx.restore();
}
