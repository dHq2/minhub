/* ---------- v8.6.0 히든보스 적뢰 — run8_e.js v2.0 (v2.0: 2D 미궁 프롤로그 v14.11 · 굴 3D v0.9 의 적뢰를 그대로 옮김 — 체력 · 평타로 맞추던 것 (5200 · 16) 을 버리고 원작의 패턴 · 수치: 대리석 주먹 (30 · 0.22초 · 파고듦 · 땅울림) · 천벌 (90 · 치명 270 · 감전 중첩 · 폭우면 맵 전체) · 번개비 (3번 · 2~4개) · 날아차기 (확정 치명 120 · 5% 머리가 터져 즉사 · 벽까지 날아감 · 끼면 +40 · 연쇄 튕김) · 정면 창 · 바닥 창 · 2페이즈 (55%: 떠올라 하늘에서 — 근접은 닿지 않음 · 붉은 창 셋 · 10초마다 내려와 4초 숨 고름) · [대리석 피부] (엔진) · 체력은 우리 쪽 화력에 맞춰 환산 · v1.3: 성해포를 줄 사람 목록에서 소환 (슬라임) 은 뺌 · v1.2: 판 재기 마무리 — 체력 5200 · 평타 16 · v1.1: 아군은 예고를 보면 가끔 스스로 피함 · 착지 뒤 포효 2.5초 · v1.0: 1F 1S 에서 아래로 — "굴 밖으로?" → 30초 기다리면 폭우 · 적뢰 낙하 · 천벌 · [낙인:적뢰] · 성해포) ----------
   적뢰 (C-044 · 7성의 기준 · 신이 아닌 신의 피조물): 키 5M · 대리석의 몸 (몇 톤) · 신성A · [대리석 피부] · 말이 없다.
   어디서 왔나 — 2D (미궁 프롤로그 v14.11 · ENEMIES.jeokroe · bossUpdate · kickHit · bounceHit · strikeThunder · BOLT_RAIN · SHOCKS · 5층 폭우):
     대리석 주먹 · 천벌 · 번개비 · 날아차기 · 뒤로 뛰기 · 감전 / 잔류 · 반쯤 무너지면 폭우.
   3D (굴 3D v0.9 · boss.js JR · units.js marble): 정면 창 · 바닥 창 · 2페이즈 (떠오름 · 하늘 · 붉은 창 · 내려와 숨 고름) · [대리석 피부].
   우리 판에 맞춘 것 — 피해 수치는 원작 그대로 (우리 동료 체력이 2D 와 거의 같음: 인주 85 / 100 · 레베카 106 / 100). 체력만 우리 동료의 화력 (2D 보다 높음) 에 맞춰 환산 (jrDesign 의 note).
   천벌을 직격으로 맞고 살아남으면 낮은 확률로 [낙인:적뢰] (수전증 — 엔진). 신성 (카리우스 · 성해포) 은 낙인이 남지 않음. 오딜의 방에서 지울 수 있음.
   성해포 (적뢰를 쓰러뜨리면): 낀 사람 [신성E] · 재생 초당 1.5. 낙인이 있는 이가 끼면 수전증이 사라지고 붉은 번개창 (14초마다 스스로) 을 씀. */
const JR8 = {
  wait: 30, rainT: 3, warnFall: 1.8, fallR: 1.1, fallR2: 3.5, roar: 2.5,   // 등장 (v1.0)
  // ── 2D 미궁 프롤로그 v14.11
  punch: { atk: 30, cd: 2.4, wind: 0.22, lunge: 2.8, reach: 1.0, quakeR: 1.2, quake: 0.5, kb: 0.6, qStun: 0.3 },   // 대리석 주먹: 천천히 걷다 2.8칸 안이면 0.22초 만에 파고들어 내리찍음 · 둘레 1.2칸 땅울림 (절반)
  th: { atk: 90, crit: 0.05, critMul: 3, rest: 6, roll: 0.3, cast: 2.0, lock: 0.6, r: 0.95, res: 20, stun: 1.6, resStun: 0.5 },   // 천벌: 숨 고르기 6초 뒤 매초 30% · 2초 겨눔 (마지막 0.6초 고정) · 직격 90 (치명 5% ×3) · 3×3 + 십자 방사 20
  storm: { cd: 20, first: 8, cast: 0.8, waves: 3, gap: 1.0, min: 2, max: 4, warn: 0.8, direct: 50, radial: 18, aimed: 0.7, r: 0.55, stun: 1.0, rStun: 0.4 },   // 번개비 (BOLT_RAIN)
  kick: { cd: [5, 7], first: 3.4, min: 1.8, max: 6.5, backP: 0.25, backLen: 3, back: 0.5, prep: 0.8, leap: 0.35, fly: 0.3, land: 0.35, len: 5, r: 0.75, atk: 40, critMul: 3, pin: 40, kill: 0.05, hold: 400, sp: 13, stun: 5, wallStun: 1.4, guardCut: 0.6, tMax: 3 },   // 날아차기 (kickHit)
  bounce: { max: 3, flat: 12, pct: 0.08, crit: 0.15, critMul: 3, keep: 0.75 },   // 연쇄 튕김 (BOUNCE)
  shock: { red: [10, 5, '감전: 적뢰'], res: [5, 5, '잔류'], redHalf: [7, 5, '감전: 적뢰 (약)'], resHalf: [4, 5, '잔류 (약)'], max: 5 },   // SHOCKS: 초당 피해 · 초 · 중첩 최대 5 (틱 × 중첩)
  // ── 굴 3D v0.9 (boss.js JR)
  laser: { cd: 7, first: 8, min: 4, max: 15, warn: 0.9, w: 1.1, len: 16, dmg: 40, stun: 0.35, kb: 1.8, rec: 0.8 },   // 정면으로 던지는 창
  jump: { cd: 9, first: 12, min: 3, max: 12, r: 1.8, follow: 0.6, fire: 1.2, air: 0.35, dmg: 45, kb: 2, stun: 0.4, rec: 0.9 },   // 뛰어올라 바닥으로 쏘는 창
  p2: { at: 0.55, ascend: 2.4, orbit: 0.25, ox: 4.5, oy: 3.2, spN: 3, spR: 1.5, spWarn: 1.0, spGap: 0.18, spDmg: 32, spKb: 2, spStun: 0.4, spCd: 3.4, spFirst: 1, spCast: 1.9, thFirst: 4, dCd: 10, dR: 2.6, dWarn: 1.0, dDmg: 35, dKb: 2.6, dStun: 0.5, rest: 4, reAsc: 1.2 },
  brandP: 0.2, allyCd: 14
};
const jrRnd = ([a, b]) => a + Math.random() * (b - a);
// 체력 환산 (v8.6.0 판 재기 · sim8600): 2D 동료 넷 (인주 · 레베카 · 카리우스 · 청광묵) 이 2D 적뢰 (방어 12 · 대리석) 에게 넣는 초당 피해 ≈ 39 → 2000 을 녹이는 데 ≈ 51초.
// 우리 판의 같은 넷이 [대리석 피부] 적뢰 (패턴 없이 서 있음) 에게 넣는 초당 피해 ≈ 108 (20판 평균) → 2000 × 108 / 39 ≈ 5500 (같은 51초). 피해 · 패턴 · 쿨은 원작 그대로.
const JR8_HP = 5500, JR8_SPD = 1.35;   // 걸음: 2D 1.6 × (우리 동료 걸음 / 2D 동료 걸음 ≈ 0.84)
function jrDesign(){ return fromDesign({ key: '적뢰', name: '적뢰', side: 1, ref: 'C-044', tier: 7, cls: '기동', role: '공격수', weapon: '맨손', height: 5.0, weight: 2000, sizeCls: '초대형', nv: true, nvG: 'S', ccRes: 0.8, noChg: true, ov: { hp: JR8_HP, atk: 30, spd: JR8_SPD }, traits: ['대리석 피부', '갑피', '신성A', '베테랑', '보스'], note: `천벌의 화신 — 신이 아닌 신의 피조물 (7성) · 2D 체력 2000 → 우리 판 ${JR8_HP} (동료 화력 환산)` }, 1); }
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
  if (!W) return; const J = W.jr8, dt = Math.max(0, Math.min(0.1, W.t - (W.jrLT == null ? W.t : W.jrLT))); W.jrLT = W.t;
  if (J) jrBoss(W, J, dt);
  if (W.jrq && W.jrq.length) for (const e of W.jrq.splice(0)){ if (W.t < e.t){ W.jrq.push(e); continue; } jrFire(W, e); }
  if (W.jrStorm && W.jrStorm.length) jrStormTick(W);
  jrFlyTick(W, dt); jrShockTick(W);
  jrAllies(W);
  if (W.jr8 && W.camp && S.camp && W.t - (W.jrBarT || 0) > 0.5){ W.jrBarT = W.t; campBarRender(); }
}
const jrFoes = (W, b) => W.units.filter(u => u.alive && !u.gone && !u.down && u.side !== b.side);
const jrD = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const jrLog = (W, s, c) => logEv(W, { k: 'r8', s, c: c || 'bad', vis: true });
const jrFx = (W, x, y, s) => { if (W.fxOn) W.fx.push({ k: 'num', x, y, s, c: 'd', t0: W.t }); };
// 몸 안의 피해 (갑옷이 막지 않음 — 천벌 · 번개 · 튕김): [개조된 신체] 만 줄임 (2D divineCut)
function jrPure(W, src, t, dmg, tag, o){ if (!t.alive) return 0; const d = Math.max(1, Math.round(dmg * (typeof mbOn === 'function' && mbOn(W, t) ? mbF(W, t, 'dmg') : 1))); applyDmg(W, src, t, d, { tag, jrOwn: true, ff: src.side === t.side, ...(o || {}) }); return d; }
// 벽 (바위 · 맵 끝) 까지 거리
function jrRay(W, x, y, dx, dy, max){ let s = 0; while (s < max){ const nx = x + dx * (s + 0.1), ny = y + dy * (s + 0.1); if (nx < 0.5 || ny < 0.5 || nx > W.map.W - 0.5 || ny > W.map.H - 0.5 || rock(W.map, nx, ny)) break; s += 0.1; } return s; }
// 노리는 상대 (3D bossTarget): 때린 만큼 · 가까울수록 · 인주에게 조금 더 · 3초는 붙듦
function jrTgt(W, J, b){
  const L = jrFoes(W, b); if (!L.length) return null;
  if (J.tg != null && W.t < (J.tgT || 0)){ const t = W.units[J.tg]; if (t && L.includes(t)) return t; }
  let best = null, bs = -1; for (const t of L){ const s = ((b.threat || {})[t.i] || 0) * 0.3 + 30 / (1 + jrD(b, t)) + (t.hero ? 6 : 0) + Math.random() * 8; if (s > bs){ bs = s; best = t; } }
  J.tg = best.i; J.tgT = W.t + 3; b.target = best; b.state = 'hunt'; b.last = { x: best.x, y: best.y }; return best;
}
function jrBoss(W, J, dt){
  const C = S.camp;
  if (J.st === 'wait' && W.t - J.t0 >= JR8.wait){ J.st = 'rain'; J.t1 = W.t; W.rain = 1; jrLog(W, '🌧 갑자기 비가 퍼붓기 시작한다. 하늘이 낮게 울린다.'); campBarRender(true); return; }
  if (J.st === 'rain' && W.t - J.t1 >= JR8.rainT){
    const al = W.units.filter(u => u.side === 0 && u.alive); if (!al.length) return;
    let x = al.reduce((a, u) => a + u.x, 0) / al.length + (Math.random() - 0.5) * 2.4, y = al.reduce((a, u) => a + u.y, 0) / al.length + (Math.random() - 0.5) * 2.4;
    x = Math.max(2, Math.min(W.map.W - 2, x)); y = Math.max(2, Math.min(W.map.H - 2, y));
    J.st = 'fall'; J.mark = { x, y, t: W.t + JR8.warnFall, r: JR8.fallR, r2: JR8.fallR2, big: true };
    const M = J.mark; jrDodge(W, u => Math.hypot(u.x - M.x, u.y - M.y) < M.r2, 0.6, u => { const dx = u.x - M.x, dy = u.y - M.y, d = Math.hypot(dx, dy) || 1, k = M.r2 + 0.6; return { x: dx / d * k - dx, y: dy / d * k - dy }; });
    jrLog(W, '⚡ 하늘이 붉게 갈라진다 — 무언가 떨어진다! 붉은 원에서 벗어나!'); return; }
  if (J.st === 'fall' && W.t >= J.mark.t){
    const p = { ...jrDesign(), id: uid(), x: J.mark.x, y: J.mark.y }; S.units.push(p); const b = addUnit(W, p); J.bi = b.i; J.st = 'fight'; b.jrB = true;
    { const q = boxRock(W, b.x, b.y, b.r) && typeof freeSpot === 'function' ? freeSpot(W, b.x, b.y, b.r) : null; if (q){ b.x = q.x; b.y = q.y; } }
    for (const t of W.units){ if (t === b || !t.alive) continue; const d = Math.hypot(t.x - b.x, t.y - b.y);
      if (d < J.mark.r){ hurtRaw(W, b, t, t.hp * 10 + 999, { tag: '적뢰 낙하', jrOwn: true }); }
      else if (d < J.mark.r2){ hurtRaw(W, b, t, t.max * 0.35, { tag: '낙하의 충격', jrOwn: true }); if (t.alive) knockDown(W, t, 1.2, b.i, '낙하의 충격'); } }
    jrFx(W, b.x, b.y - 1, '⚡ 적뢰');
    const near = W.units.filter(u => u.side === 0 && u.alive).sort((a, c) => jrD(a, b) - jrD(c, b))[0];
    if (near){ b.state = 'hunt'; b.target = near; b.last = { x: near.x, y: near.y }; b.sense && (b.sense[near.i] = { x: near.x, y: near.y, t: W.t, exact: true }); }
    const t0 = W.t + JR8.roar; b.stunT = t0; b.saT = t0; jrLog(W, '⚡ 적뢰가 몸을 일으키며 포효한다 — 비가 거꾸로 솟는다.');   // 착지 뒤 포효 (반응할 틈)
    Object.assign(J, { puT: t0, kickT: t0 + JR8.kick.first, stormT: t0 + JR8.storm.first, thT: t0 + 1, thRollT: 0, lsT: t0 + JR8.laser.first, jpT: t0 + JR8.jump.first, bkT: 0, mark: null, lastT: W.t });
    C.jr8.st = 'fight'; jrLog(W, '⚡ 적뢰가 떨어졌다 — 천벌의 화신.'); save(); campBarRender(true);
    talkLines([{ box: '히든보스 — 적뢰. 신이 아닌, 신의 피조물. 붉은 원 · 붉은 선이 보이면 피하세요. 날아차기는 막거나 비키지 않으면 벽까지 날아갑니다.' }]); return; }
  if (J.st !== 'fight') return;
  const b = W.units[J.bi]; J.lastT = W.t;
  if (!b || !b.alive){ J.st = 'won'; W.rain = 0; W.jrStorm = []; jrWin(W); return; }
  if (!W.units.some(u => u.side === 0 && u.alive)){ C.why = '적뢰의 천벌에 쓰러졌다'; C.jr8.st = 'lost'; return; }
  b.jrB = true;
  const c = b.jrC;
  if (c){ if (c.pin){ b.x = c.px; b.y = c.py; } b.act = null; stop(b);
    const brk = !c.noBreak && (b.down || b.kb || W.t < (b.stunT || -9));
    if (brk){ jrEnd(W, J, b, true); return; }
    jrCast(W, J, b, c, dt); return; }
  if (b.down || b.kb || W.t < (b.stunT || -9)) return;
  // 2페이즈: 55% 아래로 떨어지면 떠오름 (3D) · 폭우 (2D 5층: 반쯤 무너지면 천벌이 맵 전체로)
  if (!J.p2 && b.hp < b.max * JR8.p2.at) return jrStart(W, J, b, { k: 'asc', noBreak: true });
  const tgt = jrTgt(W, J, b); if (!tgt) return;
  const d = jrD(b, tgt), see = losClear(W.map, b.x, b.y, tgt.x, tgt.y);
  if (J.p2){
    // 하늘: 맵 가운데를 천천히 돎 · 근접은 닿지 않음
    J.orb = (J.orb || 0) + dt * JR8.p2.orbit; const cx = W.map.W / 2, cy = W.map.H / 2;
    const ox = Math.max(2, Math.min(W.map.W - 2, cx + Math.cos(J.orb) * Math.min(JR8.p2.ox, W.map.W / 2 - 2))), oy = Math.max(2, Math.min(W.map.H - 2, cy + Math.sin(J.orb) * Math.min(JR8.p2.oy, W.map.H / 2 - 2)));
    b.x += (ox - b.x) * Math.min(1, dt * 1.2); b.y += (oy - b.y) * Math.min(1, dt * 1.2); b.act = null; stop(b); b.face = Math.atan2(tgt.y - b.y, tgt.x - b.x);
    if (W.t >= J.dT) return jrStart(W, J, b, { k: 'desc', noBreak: true, x: b.x, y: b.y });
    if (jrThReady(W, J)) return jrStart(W, J, b, jrThPick(W, b));
    if (W.t >= J.spT) return jrStart(W, J, b, { k: 'spears' });
    return; }
  if (W.t >= J.stormT) return jrStart(W, J, b, { k: 'storm', pin: true });
  if (jrThReady(W, J)) return jrStart(W, J, b, jrThPick(W, b));
  if (W.t >= J.kickT && d <= JR8.kick.min && W.t >= J.bkT){ J.bkT = W.t + 1; if (Math.random() < JR8.kick.backP) return jrStart(W, J, b, { k: 'kick', ph: 'back', tg: tgt.i }); }
  if (W.t >= J.kickT && d > JR8.kick.min && d < JR8.kick.max && see) return jrStart(W, J, b, jrKickPlan(W, b, tgt));
  if (W.t >= J.lsT && d > JR8.laser.min && d < JR8.laser.max && see) return jrStart(W, J, b, { k: 'laser', pin: true, tg: tgt.i });
  if (W.t >= J.jpT && d > JR8.jump.min && d < JR8.jump.max) return jrStart(W, J, b, { k: 'jump', pin: true, tg: tgt.i, x: tgt.x, y: tgt.y });
  if (W.t >= J.puT && d <= JR8.punch.lunge + b.r - 0.8) return jrStart(W, J, b, { k: 'punch', tg: tgt.i });
  // 그 밖엔 천천히 걸어옴 (엔진: 쫓기)
}
const jrThReady = (W, J) => { if (W.t < J.thT || W.t < (J.thRollT || 0)) return false; J.thRollT = W.t + 1; return Math.random() < JR8.th.roll; };   // 숨 고르기가 끝나면 매초 30%
function jrThPick(W, b){   // 가장 체력이 많은 적 또는 가장 공격력이 높은 적 (반반)
  const L = jrFoes(W, b), byAtk = Math.random() < 0.5, t = L.reduce((x, o) => (byAtk ? o.atk > x.atk || (o.atk === x.atk && o.hp > x.hp) : o.hp > x.hp) ? o : x, L[0]);
  return { k: 'th', pin: !J8p2(W), tg: t.i, x: t.x, y: t.y, by: byAtk ? '가장 강한 자' : '가장 질긴 자' };
}
const J8p2 = W => !!(W.jr8 && W.jr8.p2);
function jrKickPlan(W, b, t){
  const K = JR8.kick, d = jrD(b, t) || 1, dx = (t.x - b.x) / d, dy = (t.y - b.y) / d, room = jrRay(W, b.x, b.y, dx, dy, K.len + b.r) - b.r * 0.9, len = Math.max(0.5, Math.min(K.len, room));
  return { k: 'kick', ph: 'prep', pin: true, tg: t.i, sx: b.x, sy: b.y, dx, dy, len, ex: b.x + dx * len, ey: b.y + dy * len, wall: room < K.len - 0.05, hit: [] };
}
function jrStart(W, J, b, c){
  c.t0 = W.t; c.px = b.x; c.py = b.y; b.jrC = c; b.act = null; stop(b); b.jrBusy = c.k === 'kick' || c.k === 'asc' || c.k === 'desc';
  const t = c.tg != null ? W.units[c.tg] : null;
  if (c.k === 'th'){ jrLog(W, `⚡ 적뢰가 손을 번쩍 든다… (${t ? t.name : ''} · ${c.by})`); }
  else if (c.k === 'storm') jrLog(W, '⛈ 적뢰가 두 손을 치켜든다… 번개비');
  else if (c.k === 'kick' && c.ph === 'back'){ const away = t ? Math.atan2(b.y - t.y, b.x - t.x) : Math.random() * 6.28, dx = Math.cos(away), dy = Math.sin(away), L0 = Math.max(0, Math.min(JR8.kick.backLen, jrRay(W, b.x, b.y, dx, dy, JR8.kick.backLen + b.r) - b.r * 0.9)); c.bx0 = b.x; c.by0 = b.y; c.bx = b.x + dx * L0; c.by = b.y + dy * L0; J.kickT = W.t + jrRnd(JR8.kick.cd); jrLog(W, '🦶 적뢰가 뒤로 크게 뛰어 물러난다…'); }
  else if (c.k === 'kick'){ J.kickT = W.t + jrRnd(JR8.kick.cd); jrKickWarn(W, b, c); }
  else if (c.k === 'laser'){ const d = jrD(b, t) || 1; c.dx = (t.x - b.x) / d; c.dy = (t.y - b.y) / d; c.len = Math.max(1, jrRay(W, b.x, b.y, c.dx, c.dy, JR8.laser.len)); jrLog(W, `🔺 적뢰가 손에 붉은 창을 만든다 — 정면 (${t.name})`);
    jrDodge(W, u => jrOnLine(u, b.x, b.y, c.dx, c.dy, c.len, JR8.laser.w / 2 + 0.4), 0.45, u => jrSide(u, b.x, b.y, c.dx, c.dy, 1.5)); }
  else if (c.k === 'jump'){ jrLog(W, `🔺 적뢰가 웅크렸다 뛰어오른다 — 바닥 창 (${t.name})`); }
  else if (c.k === 'punch'){ const d = jrD(b, t); c.need = Math.max(0, d - b.r - t.r - 0.15); c.went = 0; b.face = Math.atan2(t.y - b.y, t.x - b.x); }
  else if (c.k === 'asc'){ b.jrInv = W.t + JR8.p2.ascend; W.jrStorm = []; jrLog(W, '⚡ 적뢰가 날개를 편다 — 떠오른다! (2페이즈)'); if (W.fxOn) W.fx.push({ k: 'num', x: b.x, y: b.y - 1.4, s: '⚡ 떠오름', c: 'd', t0: W.t }); }
  else if (c.k === 'spears'){ const L = jrFoes(W, b).sort(() => Math.random() - 0.5).slice(0, JR8.p2.spN); L.forEach((u, i) => (W.jrq = W.jrq || []).push({ k: 'circ', t: W.t + JR8.p2.spWarn + i * JR8.p2.spGap, warn0: W.t, src: b.i, x: u.x, y: u.y, r: JR8.p2.spR, dmg: JR8.p2.spDmg, kb: JR8.p2.spKb, stun: JR8.p2.spStun, tag: '붉은 창' }));
    for (const u of L){ const x = u.x, y = u.y; jrDodge(W, v => v === u, 0.5, v => jrAway(v, x, y, JR8.p2.spR + 0.6)); }
    jrLog(W, `🔺 하늘에서 붉은 창 — ${L.map(u => u.name).join(' · ')}`); }
  else if (c.k === 'desc'){ jrLog(W, '⚡ 적뢰가 내려꽂힌다 — 붉은 원에서 벗어나!'); jrDodge(W, u => Math.hypot(u.x - c.x, u.y - c.y) < JR8.p2.dR + 0.4, 0.5, u => jrAway(u, c.x, c.y, JR8.p2.dR + 0.7)); }
}
function jrEnd(W, J, b, broke){
  const c = b.jrC; if (!c) return; b.jrC = null; b.jrBusy = false;
  if (c.k === 'jump') b.jrFly = false;
  if (c.k === 'kick' || c.k === 'jump'){ const q = boxRock(W, b.x, b.y, b.r * 0.9) && typeof freeSpot === 'function' ? freeSpot(W, b.x, b.y, b.r) : null; if (q){ b.x = q.x; b.y = q.y; } }
  if (broke && c.k === 'th'){ J.thT = W.t + 1; }
  if (broke) jrLog(W, '적뢰의 동작이 끊겼다', 'good');
}
function jrCast(W, J, b, c, dt){
  const e = W.t - c.t0, t = c.tg != null ? W.units[c.tg] : null;
  if (c.k === 'th'){
    if (!c.locked){ if (t && t.alive){ c.x = t.x; c.y = t.y; } if (e >= JR8.th.cast - JR8.th.lock){ c.locked = true; const x = c.x, y = c.y; jrDodge(W, u => Math.hypot(u.x - x, u.y - y) < JR8.th.r + 0.5, 0.55, u => jrAway(u, x, y, JR8.th.r + 1.1)); } }   // 마지막 0.6초는 자리 고정 → 그때 피하면 직격 회피
    if (e >= JR8.th.cast){ jrThunder(W, b, c); b.jrC = null; J.thT = W.t + JR8.th.rest; }
    return; }
  if (c.k === 'storm'){ if (e >= JR8.storm.cast){ (W.jrStorm = W.jrStorm || []).push({ src: b.i, t0: W.t, waves: 0, next: W.t, bolts: [] }); b.jrC = null; J.stormT = W.t + JR8.storm.cd; } return; }   // 시전 0.8초 뒤엔 번개비가 알아서 쏟아지고 적뢰는 자유
  if (c.k === 'punch'){ const P = JR8.punch;
    if (t && t.alive && c.went < c.need){ const d = jrD(b, t) || 1, st = Math.min(c.need - c.went, c.need / P.wind * dt + 0.02); tryMove(W, b, b.x + (t.x - b.x) / d * st, b.y + (t.y - b.y) / d * st); c.went += st; }   // 순식간에 파고듦
    if (e >= P.wind){ jrPunch(W, b, t); b.jrC = null; J.puT = W.t + P.cd; }
    return; }
  if (c.k === 'kick') return jrKickTick(W, J, b, c, e, dt);
  if (c.k === 'laser'){ const LZ = JR8.laser;
    if (!c.fired && e >= LZ.warn){ c.fired = true; W.jrLines = (W.jrLines || []).concat([{ x0: b.x, y0: b.y, x1: b.x + c.dx * c.len, y1: b.y + c.dy * c.len, t: W.t, w: LZ.w }]).slice(-6);
      for (const u of jrFoes(W, b)) if (jrOnLine(u, b.x, b.y, c.dx, c.dy, c.len, LZ.w / 2 + u.r * 0.6)){ hurtRaw(W, b, u, LZ.dmg, { tag: '붉은 창 (정면)', jrOwn: true }); if (u.alive){ stun(W, u, LZ.stun, b.i); fling(W, b, u, LZ.kb, c.dx, c.dy, { how: '붉은 창' }); } } }
    if (e >= LZ.warn + LZ.rec){ b.jrC = null; J.lsT = W.t + LZ.cd; }
    return; }
  if (c.k === 'jump'){ const JP = JR8.jump;
    if (e < JP.follow && t && t.alive){ c.x = t.x; c.y = t.y; } else if (!c.lock){ c.lock = true; const x = c.x, y = c.y; jrDodge(W, u => Math.hypot(u.x - x, u.y - y) < JP.r + 0.4, 0.5, u => jrAway(u, x, y, JP.r + 0.8)); }
    if (e >= JP.air) b.jrFly = true;   // 뛰어오름: 근접이 닿지 않음
    if (!c.fired && e >= JP.fire){ c.fired = true; jrCirc(W, b, { x: c.x, y: c.y, r: JP.r, dmg: JP.dmg, kb: JP.kb, stun: JP.stun, tag: '바닥 창' }); }
    if (e >= JP.fire + JP.rec){ b.jrFly = false; jrEnd(W, J, b); J.jpT = W.t + JP.cd; }
    return; }
  if (c.k === 'asc'){ const P2 = JR8.p2; if (e >= 0.8) b.jrFly = true;
    if (e >= P2.ascend){ b.jrC = null; b.jrBusy = false; b.jrFly = true; J.p2 = true; W.rain = 2; J.spT = W.t + P2.spFirst; J.thT = W.t + P2.thFirst; J.dT = W.t + P2.dCd;
      jrLog(W, '🌧 폭우 — 이제 천벌은 맵 전체로 번진다 (공중에 뜬 몸은 면함). 적뢰는 하늘에 — 근접은 닿지 않는다.');
      if (typeof talkLines === 'function' && !W.jrP2Told){ W.jrP2Told = true; talkLines([{ box: '2페이즈 — 적뢰는 하늘에 있습니다. 근접 공격은 닿지 않아요 (활 · 총 · 투창은 닿음). 10초마다 내려와 4초 숨을 고를 때가 기회.' }]); } }
    return; }
  if (c.k === 'spears'){ if (e >= JR8.p2.spCast){ b.jrC = null; J.spT = W.t + JR8.p2.spCd; } return; }
  if (c.k === 'desc'){ const P2 = JR8.p2;
    if (!c.landed && e >= P2.dWarn){ c.landed = true; b.jrFly = false; const q = typeof freeSpot === 'function' && boxRock(W, b.x, b.y, b.r) ? freeSpot(W, b.x, b.y, b.r) : null; if (q){ b.x = q.x; b.y = q.y; } c.px = b.x; c.py = b.y; c.pin = true;
      jrCirc(W, b, { x: c.x, y: c.y, r: P2.dR, dmg: P2.dDmg, kb: P2.dKb, stun: P2.dStun, tag: '내려꽂힘' }); jrLog(W, '적뢰가 숨을 고른다 — 지금!', 'good'); jrFx(W, b.x, b.y - 1.2, '숨을 고른다'); }
    if (c.landed && !c.up && e >= P2.dWarn + P2.rest){ c.up = true; jrLog(W, '⚡ 적뢰가 다시 떠오른다'); }
    if (c.up && e >= P2.dWarn + P2.rest + 0.4) b.jrFly = true;
    if (e >= P2.dWarn + P2.rest + P2.reAsc){ b.jrC = null; b.jrBusy = false; b.jrFly = true; J.dT = W.t + P2.dCd; }
    return; }
}
// ── 대리석 주먹 (2D: 0.22초 · 30 · 땅울림 1.2칸 절반 · 막으면 방패 60% / 맨몸 30% — 보스의 일격은 강공이라 그 절반)
function jrPunch(W, b, t){
  const P = JR8.punch; if (!t || !t.alive) return;
  if (gap(b, t) > P.reach){ jrFx(W, t.x, t.y - 0.6, '피함'); jrLog(W, `${t.name} — 대리석 주먹을 피함`, 'good'); }
  else { const g = typeof inGuard === 'function' && inGuard(W, t, b, true), cut = g ? (t.shield ? 0.6 : 0.3) / 2 : 0;
    hurtRaw(W, b, t, P.atk * (1 - cut), { tag: g ? '대리석 주먹 (막음)' : '대리석 주먹', jrOwn: true, block: g || undefined }); if (t.alive){ const d = jrD(b, t) || 1; fling(W, b, t, P.kb, (t.x - b.x) / d, (t.y - b.y) / d, { how: '대리석 주먹' }); } }
  for (const o of jrFoes(W, b)){ if (o === t || jrD(o, t) - o.r > P.quakeR) continue; hurtRaw(W, b, o, P.atk * P.quake, { tag: '땅울림', jrOwn: true }); if (o.alive){ const d = jrD(o, t) || 1; fling(W, b, o, P.kb, (o.x - t.x) / d, (o.y - t.y) / d, { how: '땅울림' }); stun(W, o, P.qStun, b.i); } }
  W.jrHits = (W.jrHits || []).concat([{ x: t.x, y: t.y, r: P.quakeR, t: W.t, quake: true }]).slice(-8);
}
// ── 천벌 (2D strikeThunder): 직격 90 (치명 5% ×3) · 큰 경직 1.6 · 감전 (적뢰) / 3×3 + 십자 4칸 방사 20 · 경직 0.5 · 잔류. 폭우면 방사가 맵 전체 (피아 불문 · 공중은 면함)
const jrTile = (cx, cy, o) => { const dx = Math.floor(o.x) - cx, dy = Math.floor(o.y) - cy; return (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) || (dy === 0 && Math.abs(dx) === 2) || (dx === 0 && Math.abs(dy) === 2); };
function jrThunder(W, b, c){
  const T = JR8.th, cx = Math.floor(c.x), cy = Math.floor(c.y), rain = W.rain >= 2; let direct = false, spread = 0;
  for (const o of W.units){ if (!o.alive || o === b) continue; const opp = o.side !== b.side;
    if (opp && Math.hypot(o.x - c.x, o.y - c.y) < T.r){ direct = true; const crit = Math.random() < T.crit, d = jrPure(W, b, o, T.atk * (crit ? T.critMul : 1), crit ? '천벌:적뢰 (치명)' : '천벌:적뢰');
      jrLog(W, `⚡ 천벌 ${crit ? '치명 ' : ''}직격 → ${o.name}: ${d} (큰 경직)`); if (o.alive){ stun(W, o, T.stun, b.i); jrShock(W, o, 'red', b); if (o.side === 0 && Math.random() < JR8.brandP) jrBrand(W, o); } }
    else if (rain ? !o.jrFly : (opp && jrTile(cx, cy, o))){ jrPure(W, b, o, T.res, rain ? '천벌 — 빗물을 타고' : '천벌의 방사'); if (o.alive){ stun(W, o, T.resStun, b.i); jrShock(W, o, 'res', b); } spread++; } }
  if (!direct){ const t = W.units[c.tg]; jrLog(W, `${t ? t.name : ''} — 천벌 직격을 피함`, 'good'); }
  if (rain) jrLog(W, `🌧⚡ 빗물을 타고 번개가 퍼진다 — 맵 전체 ${spread}명 방사 ${T.res} + 잔류`);
  W.jrHits = (W.jrHits || []).concat([{ x: c.x, y: c.y, r: T.r, t: W.t, big: true, cx, cy }]).slice(-8);
  jrFx(W, c.x, c.y - 0.6, '⚡ 천벌'); if (W.fxOn) W.shake = Math.max(W.shake || 0, 0.45);
}
// ── 감전 · 잔류 (SHOCKS): 1초마다 피해 × 중첩 (최대 5) · 센 쪽이 약한 쪽을 덮음
function jrShock(W, o, kind, src){
  const K = JR8.shock[kind]; if (!K || !o.alive) return; const s = o.jrSh;
  if (s && s.n > 0){ if (K[0] > JR8.shock[s.kind][0]) s.kind = kind; s.st = Math.min(JR8.shock.max, s.st + 1); s.n = Math.max(s.n, K[1]); }
  else o.jrSh = { kind, n: K[1], st: 1, next: W.t + 1, src: src.i };
}
function jrShockTick(W){
  for (const o of W.units){ const s = o.jrSh; if (!s) continue; if (!o.alive){ o.jrSh = null; continue; } if (W.t < s.next) continue;
    s.next = W.t + 1; s.n--; const K = JR8.shock[s.kind], src = W.units[s.src] || o; applyDmg(W, src, o, Math.max(1, K[0] * s.st), { tag: '감전', dot: true, jrOwn: true, ff: src.side === o.side });
    if (s.n <= 0) o.jrSh = null; }
}
// ── 번개비 (BOLT_RAIN): 1초 간격 3번 · 한 번에 2~4개 (70% 는 적 발밑) · 0.8초 예고 · 직격 50 + 경직 1 + 감전 (약) · 십자 5칸 방사 18 + 잔류 (약)
function jrStormTick(W){
  const ST = JR8.storm;
  for (const s of W.jrStorm){ const b = W.units[s.src]; if (!b || !b.alive){ s.over = true; continue; }
    if (s.waves < ST.waves && W.t >= s.next){ s.waves++; s.next += ST.gap; const foes = jrFoes(W, b), n = ST.min + Math.floor(Math.random() * (ST.max - ST.min + 1)), taken = new Set();
      for (let i = 0; i < n; i++){ let x, y; if (i < Math.ceil(n * ST.aimed) && foes.length){ const f = foes[Math.floor(Math.random() * foes.length)]; x = Math.floor(f.x); y = Math.floor(f.y); } else { x = Math.floor(Math.random() * W.map.W); y = Math.floor(Math.random() * W.map.H); }
        if (taken.has(x + ',' + y)){ x = Math.floor(Math.random() * W.map.W); y = Math.floor(Math.random() * W.map.H); } taken.add(x + ',' + y);
        const bo = { x, y, t: W.t + ST.warn + Math.random() * 0.25, t0: W.t }; s.bolts.push(bo);
        jrDodge(W, u => Math.floor(u.x) === x && Math.floor(u.y) === y, 0.45, u => jrAway(u, x + 0.5, y + 0.5, 1.6)); } }
    for (const bo of s.bolts){ if (bo.done || W.t < bo.t) continue; bo.done = true; jrBolt(W, b, bo); }
    if (s.waves >= ST.waves && s.bolts.every(bo => bo.done)) s.over = true; }
  W.jrStorm = W.jrStorm.filter(s => !s.over);
}
function jrBolt(W, b, bo){
  const ST = JR8.storm, cx = bo.x + 0.5, cy = bo.y + 0.5, cross = o => { const dx = Math.floor(o.x) - bo.x, dy = Math.floor(o.y) - bo.y; return (dx === 0 && Math.abs(dy) <= 1) || (dy === 0 && Math.abs(dx) <= 1); };
  for (const o of jrFoes(W, b)){
    if (Math.hypot(o.x - cx, o.y - cy) < ST.r + o.r * 0.5){ jrPure(W, b, o, ST.direct, '번개비 직격'); if (o.alive){ stun(W, o, ST.stun, b.i); jrShock(W, o, 'redHalf', b); } }
    else if (cross(o)){ jrPure(W, b, o, ST.radial, '번개비 방사'); if (o.alive){ stun(W, o, ST.rStun, b.i); if (!o.jrFly) jrShock(W, o, 'resHalf', b); } } }
  W.jrHits = (W.jrHits || []).concat([{ x: cx, y: cy, r: 0.6, t: W.t, cross: true, cx: bo.x, cy: bo.y }]).slice(-12);
}
// ── 날아차기 (2D bossUpdate · kickHit): 웅크림 0.8 (5칸 예고선) → 도약 0.35 → 날아감 0.3 (길 위 모두) → 착지 0.35
function jrKickWarn(W, b, c){
  const t = W.units[c.tg]; jrLog(W, `🦶 적뢰가 몸을 웅크린다 — 날아차기${t ? ' (' + t.name + ')' : ''}`);
  jrDodge(W, u => jrOnLine(u, c.sx, c.sy, c.dx, c.dy, c.len + 1, 1.2), 0.35, u => jrSide(u, c.sx, c.sy, c.dx, c.dy, 1.6), t, 0.3);   // 2D braceFor: 노린 상대는 반응 + 0.3
}
function jrKickTick(W, J, b, c, e, dt){
  const K = JR8.kick;
  if (c.ph === 'back'){ const k = Math.min(1, e / K.back); b.x = c.bx0 + (c.bx - c.bx0) * k; b.y = c.by0 + (c.by - c.by0) * k; b.jrLift = Math.sin(k * Math.PI) * 0.9;
    if (e >= K.back){ b.jrLift = 0; const t = W.units[c.tg] && W.units[c.tg].alive ? W.units[c.tg] : jrFoes(W, b)[0]; if (!t){ jrEnd(W, J, b); return; }
      const P = jrKickPlan(W, b, t); Object.assign(c, P, { t0: W.t, px: b.x, py: b.y }); jrKickWarn(W, b, c); }
    return; }
  if (c.ph === 'prep'){ if (e >= K.prep){ c.ph = 'leap'; c.t0 = W.t; } return; }
  if (c.ph === 'leap'){ b.jrLift = Math.sin(Math.min(1, e / K.leap) * Math.PI / 2) * 0.7; if (e >= K.leap){ c.ph = 'fly'; c.t0 = W.t; } return; }
  if (c.ph === 'fly'){ const k = Math.min(1, e / K.fly); b.x = c.sx + (c.ex - c.sx) * k; b.y = c.sy + (c.ey - c.sy) * k; b.jrLift = 0.7 * (1 - k);
    for (const o of jrFoes(W, b)){ if (c.hit.includes(o.i) || o.jrWF) continue; if (jrD(o, b) < K.r + o.r + 0.3){ c.hit.push(o.i); jrKickHit(W, b, o, c); } }
    if (e >= K.fly){ c.ph = 'land'; c.t0 = W.t; b.jrLift = 0; c.px = b.x; c.py = b.y; c.pin = true; } return; }
  if (e >= K.land){ b.jrLift = 0; jrEnd(W, J, b); }
}
function jrKickHit(W, b, o, c){
  const K = JR8.kick, toWall = jrRay(W, o.x, o.y, c.dx, c.dy, 40), left = Math.hypot(c.ex - b.x, c.ey - b.y), pinned = c.wall && toWall < left + 0.5;
  const blocked = !pinned && !!o.shield && typeof inGuard === 'function' && inGuard(W, o, b, true);   // 방패 + 막기: 60% 줄임 (그래도 날아감)
  if (!blocked && !pinned && Math.random() < K.kill){   // 즉사: 머리가 터진다 (카리우스도 예외 없음)
    applyDmg(W, b, o, Math.ceil(o.hp) + 999, { tag: '날아차기 — 머리가 터짐 (즉사)', jrOwn: true, death: 'crush' });
    jrLog(W, `💥 날아차기에 ${o.name}의 머리가 터졌다 (즉사)`); jrFx(W, o.x, o.y - 0.8, '즉사!'); if (W.fxOn) W.shake = Math.max(W.shake || 0, 0.6); return; }
  let d = hurtRaw(W, b, o, blocked ? K.atk * (1 - K.guardCut) : K.atk * K.critMul, { tag: blocked ? '날아차기 (막음)' : pinned ? '날아차기 — 벽 사이에 짓뭉개짐' : '날아차기 (치명타)', hcrit: !blocked, jrOwn: true, block: blocked || undefined });
  if (pinned && o.alive) d += jrPure(W, b, o, K.pin, '벽 사이에 짓뭉개짐');
  jrLog(W, blocked ? `🛡 ${o.name} — 날아차기를 막음 → ${d} (그래도 날아감)` : `🦶 날아차기 → ${o.name}: ${pinned ? '벽 사이에 짓뭉개짐, ' : ''}치명타 ${d}`);
  if (!o.alive) return; interrupt(W, o, '날아차기'); o.act = null; o.burst = null;
  if ((o.mass || 60) >= K.hold){ fling(W, b, o, 1.2, c.dx, c.dy, { how: '날아차기 — 버팀' }); jrFx(W, o.x, o.y - 0.6, '버팀!'); return; }   // 버티기 무게
  o.kb = null; stop(o); o.stunT = Math.max(o.stunT || -9, W.t + K.stun);   // 날아감: 무게와 상관없이 날아차기 방향으로 벽까지
  if (pinned){ o.x = Math.max(0.6, Math.min(W.map.W - 0.6, o.x + c.dx * Math.max(0, toWall - o.r))); o.y = Math.max(0.6, Math.min(W.map.H - 0.6, o.y + c.dy * Math.max(0, toWall - o.r))); jrWallHit(W, o, true); return; }
  o.jrWF = { dx: c.dx, dy: c.dy, sp: K.sp, t0: W.t, by: b.i, chain: { hit: [o.i, b.i], n: 0 } };
}
function jrWallHit(W, o, pinned){ o.jrWF = null; o.stunT = W.t + JR8.kick.wallStun; stop(o); jrFx(W, o.x, o.y - 0.6, pinned ? '쾅!!' : '쾅!'); if (!pinned) jrLog(W, `💫 ${o.name} — 벽에 부딪혀 경직`, 'dim'); W.jrHits = (W.jrHits || []).concat([{ x: o.x, y: o.y, r: 0.6, t: W.t, wall: true }]).slice(-12); }
function jrFlyTick(W, dt){
  const BO = JR8.bounce;
  for (const o of W.units){ const F = o.jrWF; if (!F) continue; if (!o.alive){ o.jrWF = null; continue; }
    const st = F.sp * dt, x0 = o.x, y0 = o.y; tryMove(W, o, o.x + F.dx * st, o.y + F.dy * st); o.kb = null;
    if (Math.hypot(o.x - x0, o.y - y0) < st * 0.45 || W.t - F.t0 > JR8.kick.tMax){ jrWallHit(W, o, false); continue; }
    const b = W.units[F.by];
    for (const e of W.units){ if (!e.alive || e.jrWF || F.chain.hit.includes(e.i) || jrD(e, o) > e.r + o.r) continue; if (F.chain.n >= BO.max) break;
      F.chain.n++; F.chain.hit.push(e.i); const crit = Math.random() < BO.crit, d = jrPure(W, b || o, e, (BO.flat + e.max * BO.pct) * (crit ? BO.critMul : 1) * Math.pow(BO.keep, F.chain.n - 1), crit ? '튕김 (치명)' : '튕김');
      jrLog(W, `💥 ${o.name}이(가) 날아와 ${e.name}와(과) 부딪힘 → ${d}${crit ? ' (치명타)' : ''}`);
      F.sp *= BO.keep; if (!e.alive || (e.mass || 60) >= JR8.kick.hold) continue;   // 관성: 부딪힌 쪽도 같은 방향으로 날아감
      const sp = (Math.random() - 0.5) * 0.5, nx = F.dx - F.dy * sp, ny = F.dy + F.dx * sp, l = Math.hypot(nx, ny) || 1;
      interrupt(W, e, '튕김'); e.act = null; e.kb = null; stop(e); e.stunT = Math.max(e.stunT || -9, W.t + JR8.kick.stun); e.jrWF = { dx: nx / l, dy: ny / l, sp: JR8.kick.sp * Math.pow(BO.keep, F.chain.n), t0: W.t, by: F.by, chain: F.chain }; } }
}
// ── 3D 의 원 (바닥 창 · 붉은 창 · 내려꽂힘): 원 안 상대 → 피해 · 밀림 · 경직
function jrCirc(W, b, e){
  for (const o of jrFoes(W, b)){ const d = Math.hypot(o.x - e.x, o.y - e.y); if (d > e.r + o.r * 0.5) continue; hurtRaw(W, b, o, e.dmg, { tag: e.tag, jrOwn: true });
    if (o.alive){ stun(W, o, e.stun, b.i); fling(W, b, o, e.kb, (o.x - e.x) / (d || 1) || 1, (o.y - e.y) / (d || 1), { how: e.tag }); } }
  W.jrHits = (W.jrHits || []).concat([{ x: e.x, y: e.y, r: e.r, t: W.t }]).slice(-12); jrFx(W, e.x, e.y - 0.6, '⚡');
}
const jrOnLine = (u, x0, y0, dx, dy, len, w) => { const px = u.x - x0, py = u.y - y0, s = px * dx + py * dy; return s > 0 && s < len && Math.abs(px * dy - py * dx) < w; };
const jrSide = (u, x0, y0, dx, dy, k) => { const sd = ((u.x - x0) * dy - (u.y - y0) * dx) >= 0 ? 1 : -1; return { x: dy * k * sd, y: -dx * k * sd }; };
const jrAway = (u, x, y, k) => { const dx = u.x - x, dy = u.y - y, d = Math.hypot(dx, dy) || 1; return { x: dx / d * k - dx, y: dy / d * k - dy }; };
// 아군의 피하기 (예고를 보고 — 확률 · [회피X] +20% · 노린 상대는 plus 만큼 더 — 2D braceFor)
function jrDodge(W, ok, p, away, who, plus){
  for (const u of W.units){ if (u.side !== 0 || !u.alive || u.down || u.jrWF || W.t < (u.stunT || -9) || !ok(u)) continue;
    const q = p + ((u.traits || []).some(t => /^회피/.test(t)) ? 0.2 : 0) + (who && u === who ? plus || 0 : 0); if (Math.random() >= q) continue;
    const v = away(u); let tx = u.x + v.x, ty = u.y + v.y; tx = Math.max(1, Math.min(W.map.W - 1, tx)); ty = Math.max(1, Math.min(W.map.H - 1, ty)); if (rock(W.map, tx, ty)) continue;
    u.order = { k: 'move', x: tx, y: ty, dodge: true }; if (typeof preempt === 'function') preempt(W, u); }
}
// 예고가 끝난 공격 (붉은 창의 원 · 성해포의 붉은 번개창)
function jrFire(W, e){
  const src = W.units[e.src]; if (!src) return;
  if (e.k === 'circ'){ if (src.alive) jrCirc(W, src, e); return; }
  if (e.k === 'spear'){ const ex = e.x0 + e.dx * e.len, ey = e.y0 + e.dy * e.len;
    for (const t of W.units){ if (!t.alive || t === src || (!e.any && t.side === src.side)) continue; if (!jrOnLine(t, e.x0, e.y0, e.dx, e.dy, e.len, e.w + t.r * 0.6)) continue;
      hurtRaw(W, src, t, e.dmg, { tag: '붉은 번개창' }); if (t.alive) stun(W, t, e.stun, src.i); }
    jrFx(W, ex, ey, '⚡');
    if (e.mini){ const tgt = W.units.filter(t => t.alive && t.side !== src.side).map(t => ({ t, s: (t.x - e.x0) * e.dx + (t.y - e.y0) * e.dy, o: Math.abs((t.x - e.x0) * e.dy - (t.y - e.y0) * e.dx) })).filter(q => q.s > 0 && q.s < e.len && q.o < 1.2).sort((a, c) => a.s - c.s)[0];
      const mx = tgt ? tgt.t.x : ex, my = tgt ? tgt.t.y : ey; (W.jrq = W.jrq || []).push({ k: 'bolt', t: W.t + 0.8, src: e.src, x: mx, y: my, r: e.mini.r, dmg: e.mini.dmg, warn0: W.t, mini: true, foeOnly: !e.any }); }
    W.jrLines = (W.jrLines || []).concat([{ x0: e.x0, y0: e.y0, x1: ex, y1: ey, t: W.t, flash: true }]).slice(-6);
    return; }
  if (e.k === 'bolt'){
    for (const t of W.units){ if (!t.alive || t === src || (e.foeOnly && t.side === src.side)) continue; if (Math.hypot(t.x - e.x, t.y - e.y) < e.r) hurtRaw(W, src, t, e.dmg, { tag: '작은 천벌' }); }
    W.jrHits = (W.jrHits || []).concat([{ x: e.x, y: e.y, r: e.r, t: W.t }]).slice(-12); jrFx(W, e.x, e.y - 0.6, '⚡'); }
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
  talkLines([{ narr: '적뢰가 무너진다. 대리석이 빗속에서 식어 간다.' }, { narr: '그을린 바위 위에 하얀 천 한 장이 남았다 — 성해포.' },
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
// ===== 그림: 예고 (붉은 원 · 선 · 칸) · 번개 · 하늘 · 감전 · 비 =====
function jr8Draw(Wd, ox, oy, ts){
  const J = Wd.jr8, now = Wd.t, pulse = 0.5 + 0.5 * Math.sin(performance.now() / 90);
  ctx.save();
  const P = (x, y) => [ox + x * ts, oy + y * ts];
  const circ = (x, y, r, a, fill) => { ctx.beginPath(); ctx.arc(ox + x * ts, oy + y * ts, r * ts, 0, 6.283); if (fill){ ctx.fillStyle = `rgba(255,40,40,${a})`; ctx.fill(); } ctx.strokeStyle = `rgba(255,70,70,${Math.min(1, a * 3)})`; ctx.lineWidth = Math.max(2, ts * 0.06); ctx.stroke(); };
  const tile = (cx, cy, a) => { ctx.fillStyle = `rgba(255,60,50,${a})`; ctx.fillRect(ox + cx * ts + 1, oy + cy * ts + 1, ts - 2, ts - 2); };
  const lane = (x0, y0, dx, dy, len, w, col, k) => { ctx.strokeStyle = col; ctx.lineWidth = Math.max(3, w * ts * (0.4 + 0.6 * k)); ctx.setLineDash([ts * 0.3, ts * 0.15]); ctx.beginPath(); ctx.moveTo(...P(x0, y0)); ctx.lineTo(...P(x0 + dx * len, y0 + dy * len)); ctx.stroke(); ctx.setLineDash([]); };
  if (J && J.mark){ const k = 1 - Math.max(0, (J.mark.t - now) / JR8.warnFall); circ(J.mark.x, J.mark.y, J.mark.r2, 0.08 + 0.1 * k, true); circ(J.mark.x, J.mark.y, J.mark.r, 0.2 + 0.3 * k * pulse, true); }
  const b = J && J.bi != null ? Wd.units[J.bi] : null, c = b && b.alive ? b.jrC : null;
  if (c){ const e = now - c.t0;
    if (c.k === 'th'){ const k = Math.min(1, e / JR8.th.cast), cx = Math.floor(c.x), cy = Math.floor(c.y);
      if (!(Wd.rain >= 2)) for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) if ((Math.abs(dx) <= 1 && Math.abs(dy) <= 1) || (dy === 0 && Math.abs(dx) === 2) || (dx === 0 && Math.abs(dy) === 2)) tile(cx + dx, cy + dy, 0.06 + 0.12 * k);
      circ(c.x, c.y, JR8.th.r, (c.locked ? 0.3 : 0.15) + 0.3 * k * pulse, true); }
    if (c.k === 'kick' && (c.ph === 'prep' || c.ph === 'leap')){ lane(c.sx, c.sy, c.dx, c.dy, c.len, 1.5, `rgba(255,170,60,${(0.35 + 0.4 * pulse).toFixed(2)})`, Math.min(1, e / JR8.kick.prep)); }
    if (c.k === 'laser' && !c.fired) lane(b.x, b.y, c.dx, c.dy, c.len, JR8.laser.w, `rgba(255,50,60,${(0.3 + 0.5 * Math.min(1, e / JR8.laser.warn)).toFixed(2)})`, Math.min(1, e / JR8.laser.warn));
    if (c.k === 'jump' && !c.fired) circ(c.x, c.y, JR8.jump.r, 0.12 + 0.3 * Math.min(1, e / JR8.jump.fire) * pulse, true);
    if (c.k === 'desc' && !c.landed) circ(c.x, c.y, JR8.p2.dR, 0.12 + 0.3 * Math.min(1, e / JR8.p2.dWarn) * pulse, true);
    if (c.k === 'punch'){ const t = Wd.units[c.tg]; if (t) circ(t.x, t.y, JR8.punch.quakeR, 0.1, false); }
    if (c.k === 'storm' || c.k === 'th' || c.k === 'asc'){ const [px, py] = P(b.x, b.y); ctx.fillStyle = `rgba(255,${c.k === 'asc' ? 220 : 90},90,${(0.25 + 0.3 * pulse).toFixed(2)})`; ctx.beginPath(); ctx.arc(px, py - b.r * ts * 1.8, ts * 0.35, 0, 6.283); ctx.fill(); } }   // 치켜든 손
  for (const s of Wd.jrStorm || []) for (const bo of s.bolts){ if (bo.done) continue; const k = Math.min(1, (now - bo.t0) / Math.max(0.1, bo.t - bo.t0)); tile(bo.x, bo.y, 0.12 + 0.3 * k * pulse); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) tile(bo.x + dx, bo.y + dy, 0.05 + 0.12 * k); }
  for (const e of Wd.jrq || []){ const k = Math.min(1, (now - e.warn0) / Math.max(0.1, e.t - e.warn0));
    if (e.k === 'circ' || e.k === 'bolt') circ(e.x, e.y, e.r, 0.15 + 0.3 * k * pulse, true);
    if (e.k === 'spear') lane(e.x0, e.y0, e.dx, e.dy, e.len, e.w * 1.2, `rgba(255,50,60,${(0.25 + 0.5 * k).toFixed(2)})`, k); }
  if (b && b.alive && (b.jrFly || b.jrLift > 0.05)){ const [px, py] = P(b.x, b.y); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(px, py + b.r * ts * 0.9, b.r * ts * 0.9, b.r * ts * 0.35, 0, 0, 6.283); ctx.fill();   // 하늘: 그림자 · 붉은 날개 빛
    if (b.jrFly){ ctx.strokeStyle = `rgba(255,80,80,${(0.4 + 0.4 * pulse).toFixed(2)})`; ctx.lineWidth = Math.max(2, ts * 0.08); ctx.beginPath(); ctx.arc(px, py, b.r * ts * 1.35, 0, 6.283); ctx.stroke(); ctx.fillStyle = '#ffb0b0'; ctx.font = `${Math.max(10, ts * 0.32)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText(b.jrInv > now ? '떠오름' : '하늘', px, py - b.r * ts * 1.5); } }
  for (const u of Wd.units){ if (!u.alive) continue; const [px, py] = P(u.x, u.y);
    if (u.jrSh){ ctx.fillStyle = /red/.test(u.jrSh.kind) ? '#ff4a4a' : '#ffb45a'; ctx.font = `${Math.max(9, ts * 0.28)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText(`⚡${u.jrSh.st > 1 ? '×' + u.jrSh.st : ''}`, px + u.r * ts, py - u.r * ts); }
    if (u.jrWF){ ctx.strokeStyle = 'rgba(255,200,120,.7)'; ctx.lineWidth = Math.max(2, ts * 0.08); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - u.jrWF.dx * ts * 1.2, py - u.jrWF.dy * ts * 1.2); ctx.stroke(); } }
  for (const l of Wd.jrLines || []){ const a = 1 - (now - l.t) / 0.4; if (a <= 0) continue; ctx.strokeStyle = `rgba(255,${120 + Math.round(100 * Math.random())},120,${a.toFixed(2)})`; ctx.lineWidth = Math.max(2, ts * (l.w ? l.w * 0.3 : 0.12)); ctx.beginPath(); ctx.moveTo(...P(l.x0, l.y0)); const n = 6; for (let i = 1; i <= n; i++){ const f = i / n; ctx.lineTo(ox + (l.x0 + (l.x1 - l.x0) * f) * ts + (i < n ? (Math.random() - 0.5) * ts * 0.4 : 0), oy + (l.y0 + (l.y1 - l.y0) * f) * ts + (i < n ? (Math.random() - 0.5) * ts * 0.4 : 0)); } ctx.stroke(); }
  for (const h of Wd.jrHits || []){ const a = 1 - (now - h.t) / 0.5; if (a <= 0) continue;
    if (h.big && !(Wd.rain >= 2)) for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) if ((Math.abs(dx) <= 1 && Math.abs(dy) <= 1) || (dy === 0 && Math.abs(dx) === 2) || (dx === 0 && Math.abs(dy) === 2)) tile(h.cx + dx, h.cy + dy, a * 0.35);
    if (h.cross) for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) tile(h.cx + dx, h.cy + dy, a * 0.35);
    ctx.fillStyle = `rgba(255,230,230,${(a * 0.6).toFixed(2)})`; ctx.beginPath(); ctx.arc(ox + h.x * ts, oy + h.y * ts, h.r * ts * (1 + (1 - a)), 0, 6.283); ctx.fill();
    if (!h.wall && !h.quake){ ctx.strokeStyle = `rgba(255,60,60,${a.toFixed(2)})`; ctx.lineWidth = Math.max(2, ts * 0.1); ctx.beginPath(); ctx.moveTo(ox + h.x * ts, oy + (h.y - 12) * ts); for (let i = 1; i <= 8; i++) ctx.lineTo(ox + (h.x + (Math.random() - 0.5) * 0.8) * ts, oy + (h.y - 12 + i * 1.5) * ts); ctx.stroke(); } }
  if (Wd.rain){ const cv = ctx.canvas, w = cv.clientWidth || cv.width, h = cv.clientHeight || cv.height, n = Wd.rain > 1 ? 260 : 150, t0 = performance.now() / 1000; ctx.strokeStyle = Wd.rain > 1 ? 'rgba(255,190,200,.32)' : 'rgba(190,210,255,.3)'; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let i = 0; i < n; i++){ const sx = ((i * 97.3 + t0 * 380 * (1 + (i % 3) * 0.2)) % (w + 80)) - 40, sy = ((i * 53.7 + t0 * 900 * (1 + (i % 5) * 0.1)) % (h + 60)) - 30; ctx.moveTo(sx, sy); ctx.lineTo(sx - 6, sy + 16); } ctx.stroke(); }
  ctx.restore();
}
