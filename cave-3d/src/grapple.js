/* grapple.js v1.0 — 레슬링: 잡기 → 클린치 → 그라운드 · 빠져나오기
   · 잡기: 인주는 V (앞 1.4칸 안의 적, 보스 · 아주 무거운 것은 못 잡음). 레슬러 적 (곤봉 거한 · 단달로)과 GOOD WILL도 잡음
   · 클린치 (서로 붙듦): 잡은 쪽 — J 무릎 · K 메치기 (넘어뜨려 그라운드로) · Q 밀쳐내기 (휘청)
   · 그라운드 (깔고 앉음): J 파운딩 · K 끝내기 (체력 30% 아래면 목을 꺾음, 강적은 크게 다침) · Q 일어섬
   · 잡힌 쪽: 버둥 막대가 다 차면 빠져나옴 (인주는 Space · A · D 연타). 힘 · 무게가 셀수록 잘 붙잡고 잘 빠져나옴
   · 동료가 잡은 놈을 치면 +30% 피해, 버둥 +20. 잡고 있는 동안엔 다른 적에게 등을 보임 (+25% 피해) */
'use strict';
const GR = { range: 1.45, clinchMax: 5, groundMax: 4.5 };
G.locks = [];
const grStr = u => (u.rpg ? u.rpg.A.str : 5 + (u.D.weight || 60) / 40) + (u.D.weight || 60) / 60;
function canGrab(a, d){
  return d && a && !d.dead && !d.downed && !d.lock && !a.lock && d.side !== a.side && d.side !== 'neutral' && !d.D.boss && !d.airborne && !d.D.dummy && (d.D.weight || 60) < 800 && (d.lift || 0) < 0.4;
}
function grab(a, d, o = {}){
  if (!canGrab(a, d)) return null;
  interrupt(a); interrupt(d); P.aiming = a === G.player ? false : P.aiming;
  const L = { a, d, phase: 'clinch', t: 0, esc: 0, act: null, cd: 0.4, hits: 0, heavy: (d.D.weight || 60) >= 300 };
  a.lock = L; d.lock = L; G.locks.push(L);
  a.st = 'grapple'; d.st = 'held'; d.guard = false;
  setAim(a, d.x, d.z); setAim(d, a.x, a.z);
  popText(d.x, d.y + bodyH(d) + 0.45, d.z, d === G.player ? '잡혔다! (Space 연타)' : '붙잡음!', d.side === 'ally' ? 'hurt big' : 'aim', 1.1);
  SFX.thump(140, 0.35, 0.18); camShake(0.14, 0.15); dust(d.x, d.z, 6);
  if (a.side === 'enemy' && d.side === 'ally' && d.hero) d.hero.san = Math.max(0, (d.hero.san ?? 50) - 4);
  return L;
}
function grRelease(L, why){
  const { a, d } = L;
  if (a.lock === L) a.lock = null; if (d.lock === L) d.lock = null;
  G.locks = G.locks.filter(x => x !== L);
  if (!a.dead && !a.downed){ a.st = 'idle'; setPose(a, 'idle'); }
  if (!d.dead && !d.downed){
    if (L.phase === 'ground'){ d.lying = true; setTimeout(() => { if (!d.dead) d.lying = false; }, 650); d.st = 'hurt'; d.stT = 0.75; }
    else { d.st = 'idle'; }
  }
  if (why === 'escape' && !a.dead){
    a.st = 'hurt'; a.stT = 0.8; setPose(a, 'hurt'); const n = norm(a.x - d.x, a.z - d.z); a.kx += n.x * 5; a.kz += n.z * 5;
    popText(d.x, d.y + bodyH(d) + 0.4, d.z, '빠져나옴!', d.side === 'ally' ? 'heal' : 'miss', 1);
    spark(d.x, d.y + 1, d.z, 0xffffff, 10, 4);
  }
  a.grabCd = 3.5 + Math.random() * 2;
}
// 한 동작 (잡은 쪽)
const GACT = {
  knee:   { wind: 0.3, mul: 0.75, esc: -10, name: '무릎' },
  throw:  { wind: 0.55, mul: 1.3, esc: 0, name: '메치기' },
  push:   { wind: 0.2, mul: 0.35, esc: 0, name: '밀쳐내기' },
  pound:  { wind: 0.26, mul: 0.6, esc: -7, name: '파운딩' },
  finish: { wind: 0.85, mul: 0, esc: 0, name: '끝내기' },
  up:     { wind: 0.15, mul: 0, esc: 0, name: '일어섬' },
};
function grDo(L, k){
  if (L.act || L.cd > 0) return false;
  if (k === 'throw' && (L.phase !== 'clinch' || L.heavy)){ if (L.heavy && L.a === G.player) popText(L.a.x, L.a.y + 2.2, L.a.z, '너무 무겁다', 'miss', 0.8); return false; }
  if ((k === 'pound' || k === 'finish' || k === 'up') && L.phase !== 'ground') return false;
  if ((k === 'knee' || k === 'push') && L.phase !== 'clinch') return false;
  L.act = { k, t: 0 }; setPose(L.a, 'windup');
  if (k === 'finish') popText(L.a.x, L.a.y + 2.4, L.a.z, '끝내기…', 'crit', 0.9);
  return true;
}
function grHit(L, k){
  const { a, d } = L, A = GACT[k];
  if (d.dead) return;
  const mul = A.mul * (1 + ((a.fx && a.fx.fist) || 0) / 200);
  if (k === 'knee'){ hurt(a, d, a.atk * mul, { from: a, noCam: true, grapple: true }); L.esc = Math.max(0, L.esc + A.esc); spark(d.x, d.y + bodyH(d) * 0.55, d.z, 0xfff0d0, 6, 3); SFX.thump(180, 0.3, 0.1); L.hits++; }
  if (k === 'throw'){
    L.phase = 'ground'; L.t = 0; d.lying = true;
    hurt(a, d, a.atk * mul, { from: a, crit: Math.random() < 0.25 || undefined, grapple: true });
    camShake(0.35, 0.25); dust(d.x, d.z, 16); ring(d.x, d.z, 0xffcf80, 1.8, 0.35); SFX.boom(0.5); G.hitstop = Math.max(G.hitstop, 0.1);
    popText(d.x, d.y + 1.4, d.z, '메쳤다!', 'big', 0.9);
  }
  if (k === 'push'){ hurt(a, d, a.atk * mul, { from: a, grapple: true }); grRelease(L, 'push'); if (!d.dead){ const n = norm(d.x - a.x, d.z - a.z); d.kx += n.x * 9; d.kz += n.z * 9; d.st = 'hurt'; d.stT = 0.7; setPose(d, 'hurt'); } return; }
  if (k === 'pound'){ hurt(a, d, a.atk * mul, { from: a, noCam: true, grapple: true }); L.esc = Math.max(0, L.esc + A.esc); dust(d.x, d.z, 3); SFX.thump(120, 0.35, 0.12); L.hits++; }
  if (k === 'finish'){
    const low = d.hp <= d.max * 0.3;
    if (low && !d.elite && !d.D.boss){ hurt(a, d, d.hp + 999, { from: a, crit: true, unblockable: true, grapple: true }); popText(d.x, d.y + 1.6, d.z, '우드득', 'crit', 1.3); G.hitstop = 0.18; camShake(0.4, 0.3); }
    else { hurt(a, d, a.atk * (low ? 3 : 1.6), { from: a, crit: true, grapple: true }); camShake(0.3, 0.2); }
    grRelease(L, 'finish'); return;
  }
  if (k === 'up'){ grRelease(L, 'up'); return; }
}
// 잡은 쪽이 AI면 알아서 고름
function grAI(L){
  const { a, d } = L;
  if (L.phase === 'clinch'){
    if (L.hits >= 2 + (a.uid % 2) && !L.heavy) return grDo(L, 'throw');
    if (L.esc > 70 && Math.random() < 0.5) return grDo(L, L.heavy ? 'push' : 'throw');
    return grDo(L, 'knee');
  }
  if (d.hp <= d.max * 0.3 && !d.elite && d !== G.player) return grDo(L, 'finish');
  if (L.hits >= 6) return grDo(L, d === G.player || d.side === 'ally' ? 'up' : 'finish');
  return grDo(L, 'pound');
}
// 한 프레임
function grappleTick(dt){
  for (const L of G.locks.slice()){
    const { a, d } = L;
    if (a.dead || a.downed || d.dead || d.downed || a.st === 'hurt' && L.act == null && a.stT > 0.5){ grRelease(L, 'broken'); continue; }
    L.t += dt; L.cd -= dt;
    // 자리: 잡힌 쪽은 잡은 쪽 앞에 붙음 (그라운드면 발밑)
    const ang = Math.atan2(d.z - a.z, d.x - a.x), gap = L.phase === 'ground' ? 0.55 : a.r + d.r * 0.7;
    const tx = a.x + Math.cos(ang) * gap, tz = a.z + Math.sin(ang) * gap;
    if (!solidAt(G.map, tx, tz)){ d.x += (tx - d.x) * Math.min(1, dt * 14); d.z += (tz - d.z) * Math.min(1, dt * 14); }
    a.kx = a.kz = d.kx = d.kz = 0; a.moving = d.moving = false;
    if (L.phase === 'clinch'){ setPose(d, 'hurt'); d.lying = false; } else { d.lying = true; }
    // 버둥
    const rate = 16 + (grStr(d) - grStr(a)) * 3 + (L.phase === 'ground' ? -4 : 0);
    if (d !== G.player) L.esc += Math.max(4, rate) * dt;
    else {
      L.esc += Math.max(2, rate * 0.3) * dt;
      if (hit('Space') || hit('KeyA') || hit('KeyD') || hit('KeyW') || hit('KeyS')){ L.esc += 9 + Math.max(0, (grStr(d) - grStr(a)) * 1.5); d.flash = 0.4; spark(d.x, d.y + 1, d.z, 0xcfe8ff, 2, 2, 0.1, 0.15); }
      if (hit('KeyQ') && L.esc > 55 && P.dodgeCd <= 0){ L.esc = 100; P.dodgeCd = 0.75; }   // 거의 다 됐으면 구르기로 빠져나옴
    }
    if (L.esc >= 100){ grRelease(L, 'escape'); continue; }
    if (L.t > (L.phase === 'clinch' ? GR.clinchMax : GR.groundMax) && !L.act){ grRelease(L, 'time'); continue; }
    // 잡은 쪽 행동
    if (L.act){
      L.act.t += dt;
      const A = GACT[L.act.k];
      if (L.act.t >= A.wind){ const k = L.act.k; L.act = null; L.cd = 0.18; setPose(a, a.S.poses.attack ? 'attack' : 'idle'); a.leanT = 0.25; grHit(L, k); if (!a.lock) continue; }
      else { a.leanT = -0.18; }
    } else if (a === G.player){
      if (hit('Mouse0') || hit('KeyJ')) grDo(L, L.phase === 'clinch' ? 'knee' : 'pound');
      else if (hit('Mouse2') || hit('KeyK')) grDo(L, L.phase === 'clinch' ? 'throw' : 'finish');
      else if (hit('KeyQ') || hit('KeyV')) grDo(L, L.phase === 'clinch' ? 'push' : 'up');
      P.atkBuf = 0;
    } else if (L.cd <= 0) grAI(L);
  }
  uiGrapple();
}
// 화면: 잡힌 쪽 머리 위 버둥 막대 + 인주에게 조작 안내
function uiGrapple(){
  const el = document.getElementById('grap'); if (!el) return;
  const L = G.locks.find(l => l.a === G.player || l.d === G.player) || G.locks[0];
  if (!L || G.lock){ el.hidden = true; return; }
  const p = toScreen(L.d.x, L.d.y + bodyH(L.d) + 0.9, L.d.z, UI.W, UI.H);
  el.hidden = p.behind; el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-100%)`;
  const mine = L.a === G.player, held = L.d === G.player;
  const keys = mine ? (L.phase === 'clinch' ? `<kbd>J</kbd>무릎 <kbd>K</kbd>${L.heavy ? '<s>메치기</s>' : '메치기'} <kbd>Q</kbd>밀쳐내기` : `<kbd>J</kbd>파운딩 <kbd>K</kbd>끝내기${L.d.hp <= L.d.max * 0.3 ? ' ●' : ''} <kbd>Q</kbd>일어섬`) : held ? '<kbd>Space</kbd> 연타 — 빠져나오기' : '';
  const html = `<b>${L.phase === 'clinch' ? '클린치' : '그라운드'}</b><i><s style="width:${Math.min(100, L.esc)}%"></s></i>${keys ? `<small>${keys}</small>` : ''}`;
  if (el.dataset.h !== html){ el.dataset.h = html; el.innerHTML = html; }
  el.className = held ? 'held' : mine ? 'mine' : '';
}
// 잡고 있는 놈은 등을 보임 · 동료가 치면 풀려남
const _hurtGr = hurt;
hurt = function(att, tgt, base, o = {}){
  const L = tgt && tgt.lock;
  if (L && !o.grapple && !o.dot){
    if (L.a === tgt) base *= 1.25;                                   // 잡고 있느라 무방비
    if (L.a === tgt && att && att.side === L.d.side){ base *= 1.04; L.esc += 20; }   // 동료가 잡은 놈을 침 → 풀려남
    if (L.d === tgt && att && att.side === L.a.side) base *= 1.3;     // 붙잡힌 놈은 맞기 좋음
  }
  return _hurtGr(att, tgt, base, o);
};
// 잡혀 있거나 잡고 있으면 생각 대신 레슬링
function grBusy(u){ return !!u.lock; }
// 인주: V 잡기
function playerGrabInput(u){
  if (!hit('KeyV') || u.lock || u.st === 'windup' || G.lock) return false;
  const t = mouse.over && dist(mouse.over, u) < GR.range + 0.6 ? mouse.over : nearest(u, foes().filter(e => Math.abs(angDiff(Math.atan2(e.z - u.z, e.x - u.x), u.aim)) < 1.3), GR.range + 0.3);
  if (!t){ popText(u.x, u.y + 2.2, u.z, '잡을 게 없다', 'miss', 0.6); return true; }
  if (!canGrab(u, t)){ popText(u.x, u.y + 2.2, u.z, t.D.boss ? '잡을 수 없다' : '너무 크다', 'miss', 0.7); return true; }
  setPose(u, 'windup'); grab(u, t); return true;
}
// 적 레슬러: 가까우면 손을 뻗음 (붉은 원 예고 → 안에 있으면 붙잡힘)
function enemyGrabTry(u, tgt, dt){
  u.grabCd = (u.grabCd ?? 2) - dt;
  if (!u.D.grab || u.grabCd > 0 || !tgt || u.lock || u.st !== 'idle') return false;
  if (dist(u, tgt) > u.D.grab.reach || !canGrab(u, tgt)) return false;
  u.grabCd = u.D.grab.cd;
  setAim(u, tgt.x, tgt.z);
  const x = u.x + Math.cos(u.aim) * u.D.grab.reach * 0.6, z = u.z + Math.sin(u.aim) * u.D.grab.reach * 0.6;
  popText(u.x, u.y + bodyH(u) + 0.3, u.z, '✋', 'alert', 0.6);
  windup(u, 'circle', { x, z, r: 0.95, windup: u.D.grab.wind }, t => { if (!u.lock && canGrab(u, t)) grab(u, t); }, 0xff7ad0);
  return true;
}
