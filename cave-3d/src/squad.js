/* squad.js v1.0 — (v0.55) 조 · 진형 · 지휘 · 기절과 일으키기 · 상태 연계 · 슬라이딩 / 드롭킥 카운터
   ■ 조: 1조 (조장 = 인주) · 2조 (조장 = 보직이 '지휘'인 동료, 없으면 첫 조원) · 단독 (혼자 움직이는 전략병기)
   ■ 진형 (조장 기준 자리): 삼각 · 가로 · 종대 · 등맞대기 (서로 등을 막아 사각을 없앰) · 흩어짐 · 포위 (묶은 적 둘레)
   ■ 지휘 (O · 손가락 화면은 위 줄 깃발): 창이 열린 동안 시간이 느려짐 (0.2배). 조마다
     따라와 (진형 유지, 다가오는 적과 싸움) · 여기 지켜 (지금 자리) · 저놈 묶어 (노린 적에게 붙어 붙잡아 둠 — 그 적은 묶은 사람만 봄) ·
     돌아 들어가 (노린 적의 등 뒤로 돌아 침) · 빠져 (싸움을 끊고 조장에게) · 자유 (각자)
     바로 쓰기: 8 = 1조 따라와 · 9 = 2조 따라와 · 0 = 모두 빠져
   ■ 기절: 쓰러진 동료는 저절로 일어나지 않음. 누가 가서 일으켜야 함 (인주는 곁에서 E — 1.3초 동안 붙어 있기, 동료도 와서 일으킴. 지원 보직은 빠름)
     45초 넘게 두면 출혈로 위독 (원정에선 반시체). 레베카는 불사라 스스로 일어남
   ■ 상태 연계 (누구나): 쓰러진 놈 ×1.5 · 잡힌 놈 (다른 동료가 붙듦) 치명 · 사격으로 끊긴 놈을 바로 베면 ×1.4 · 벽에 짓뭉개진 놈 치명 · 광대 팔에 끌려오는 놈 ×1.8 · 날아가는 놈을 쏨 ×1.8
   ■ 슬라이딩 · 드롭킥: 빈틈 (예고 중 · 옆 · 뒤 · 넘어짐)이면 지금처럼 셈. 정면에서 멀쩡히 보고 있는 적에게 쓰면 읽힘 —
     슬라이딩: 막고 발로 밟음 (인주가 넘어짐) / 드롭킥: 다리를 잡혀 던져짐 (벽이면 짓뭉개짐). 방패 · 무거운 적일수록 잘 읽음 */
'use strict';
const FORMS = {
  wedge:  { n: '삼각', off: [[-1.4, -1.1], [1.4, -1.1], [0, -2.3], [-2.8, -2.3], [2.8, -2.3], [0, -3.4]] },
  line:   { n: '가로', off: [[-1.5, 0], [1.5, 0], [-3, 0], [3, 0], [-4.5, 0], [4.5, 0]] },
  column: { n: '종대', off: [[0, -1.3], [0, -2.6], [0, -3.9], [0, -5.2], [0, -6.5], [0, -7.8]] },
  ring:   { n: '등맞대기', off: [[0, -1.25], [-1.2, -0.25], [1.2, -0.25], [-0.9, -1.05], [0.9, -1.05], [0, 1.2]], out: true },
  loose:  { n: '흩어짐', off: [[-2.3, -1.6], [2.3, -1.6], [0, -3.2], [-3.6, 0], [3.6, 0], [0, -4.6]] },
  pincer: { n: '포위', off: [[-1.4, -1.1], [1.4, -1.1], [0, -2.3], [-2.8, -2.3], [2.8, -2.3], [0, -3.4]], pincer: true },
};
const ORDERS = { follow: '따라와', hold: '여기 지켜', pin: '저놈 묶어', flank: '돌아 들어가', retreat: '빠져', free: '자유' };
const SQ = { on: false, list: [{ id: 1, n: '1조', form: 'wedge', order: 'follow', at: null, tgt: null, head: -Math.PI / 2 }, { id: 2, n: '2조', form: 'wedge', order: 'follow', at: null, tgt: null, head: -Math.PI / 2 }], wheel: false };
const sqOf = u => u.sol && u.sol.sq ? SQ.list[u.sol.sq - 1] : null;
const sqMembers = sq => G.units.filter(u => u.sol && u.sol.sq === sq.id && !u.dead);
function sqLeader(sq){
  if (sq.id === 1 && G.player && !G.player.downed) return G.player;
  const M = sqMembers(sq).filter(u => !u.downed);
  return M.find(u => u.sol.role === 'leader' && u.kind !== 'player') || M.find(u => u.kind !== 'player') || null;
}
const fwdOf = h => ({ x: Math.cos(h), z: Math.sin(h) }), rightOf = h => ({ x: -Math.sin(h), z: Math.cos(h) });

/* ---------- 진형 자리 ---------- */
function sqSlot(u, sq){
  const L = sqLeader(sq); if (!L || L === u) return null;
  const M = sqMembers(sq).filter(o => o !== L && !o.downed), i = Math.max(0, M.indexOf(u)), F = FORMS[sq.form] || FORMS.wedge;
  if (F.pincer && sq.tgt && !sq.tgt.dead){   // 포위: 노린 적 둘레에 고르게
    const T = sq.tgt, a0 = Math.atan2(L.z - T.z, L.x - T.x), a = a0 + Math.PI * 2 * (i + 1) / (M.length + 1);
    return { x: T.x + Math.cos(a) * 1.7, z: T.z + Math.sin(a) * 1.7, face: Math.atan2(T.z - (T.z + Math.sin(a)), T.x - (T.x + Math.cos(a))) };
  }
  const base = sq.order === 'hold' && sq.at ? sq.at : L, o = F.off[i % F.off.length], f = fwdOf(sq.head), r = rightOf(sq.head);
  let x = base.x + f.x * o[1] + r.x * o[0], z = base.z + f.z * o[1] + r.z * o[0];
  if (solidAt(G.map, x, z)){ x = base.x - f.x * 1.1; z = base.z - f.z * 1.1; }
  return { x, z, face: F.out ? Math.atan2(z - base.z, x - base.x) : sq.head };
}
function sqHeadTick(sq, dt){
  const L = sqLeader(sq); if (!L) return;
  if (sq.order === 'hold' && sq.at) return;
  const lx = L.x, lz = L.z; if (sq.px != null){ const dx = lx - sq.px, dz = lz - sq.pz, sp = Math.hypot(dx, dz) / Math.max(dt, 1e-4); if (sp > 0.8) sq.head += angDiff(Math.atan2(dz, dx), sq.head) * Math.min(1, dt * 3); }
  sq.px = lx; sq.pz = lz;
}
function walkPose(u){ setPose(u, u.moving ? (u.S.poses.walk ? 'walk' : 'idle') : (u.D.think === kariusThink && u.p2 ? 'heretic' : 'idle')); if (u.moving && !u.S.poses.walk) u.leanT = Math.sin(G.t * 11) * 0.07; }
function sqFormMove(u, sq, dt){
  const L = sqLeader(sq);
  if (L === u){   // 2조 조장: 인주 오른쪽 뒤 5칸쯤을 따라감 (지켜면 그 자리)
    const pl = G.player; let gx, gz;
    if (sq.order === 'hold' && sq.at){ gx = sq.at.x; gz = sq.at.z; }
    else if (pl){ const S1 = SQ.list[0], f = fwdOf(S1.head), r = rightOf(S1.head); gx = pl.x - f.x * 3.5 + r.x * 3.5; gz = pl.z - f.z * 3.5 + r.z * 3.5; if (solidAt(G.map, gx, gz)){ gx = pl.x - f.x * 2; gz = pl.z - f.z * 2; } }
    else return false;
    const d = Math.hypot(gx - u.x, gz - u.z); u.moving = false;
    if (d > 0.6) navTo(u, gx, gz, d > 4 ? u.spd * 1.5 : u.spd, dt, 0.4); else u.aim = sq.head;
    walkPose(u); return true;
  }
  const s = sqSlot(u, sq); if (!s) return false;
  const d = Math.hypot(s.x - u.x, s.z - u.z); u.moving = false;
  if (d > 0.45) navTo(u, s.x, s.z, d > 3.5 ? u.spd * 1.55 : u.spd, dt, 0.25);
  else { u.aim = s.face; faceToward(u, Math.cos(s.face), Math.sin(s.face)); }
  walkPose(u); return true;
}

/* ---------- 동료 한 프레임 (heroCombat 자리에 끼움: true = 여기서 다 함, false = 그 동료 고유 AI가 근접전) ---------- */
function solTarget(u, sq, list){
  const S = u.sol, L = sq ? sqLeader(sq) : null;
  if (sq && (sq.order === 'pin' || sq.order === 'flank') && sq.tgt && !sq.tgt.dead) return sq.tgt;
  const anchor = sq && sq.order === 'hold' && sq.at ? sq.at : (L || u), R = sq && sq.order === 'hold' ? 5.5 : 10;
  const C = list.filter(e => Math.hypot(e.x - anchor.x, e.z - anchor.z) < R || dist(e, u) < 4.5);
  if (!C.length) return null;
  const score = e => {
    let s = dist(u, e);
    if (S.role === 'marksman'){ if (e.st === 'windup') s -= 6; if (e.D.bow || e.kind === 'drillCaster') s -= 4; }
    if (S.role === 'support' && L && e.focusOn === L) s -= 3;
    if (S.role === 'scout' && e.engWait) s -= 2;   // 기다리며 도는 놈 (등이 열림)
    if (S.role === 'vanguard' && L && dist(e, L) < 4) s -= 2.5;   // 조장에게 오는 놈을 막아섬
    return s;
  };
  return C.sort((a, b) => score(a) - score(b))[0];
}
function solControl(u, dt){
  if (!SQ.on || !u.sol || u.kind === 'player' || u.downed || u.lock) return false;
  if (u.st === 'hurt' || u.st === 'windup' || u.st === 'strike' || u.st === 'skill' || u.kc || (u.reb && u.reb.act) || u.ls) return false;   // 고유 기술 중
  const S = u.sol, sq = sqOf(u);
  if (reviveDuty(u, dt)) return true;
  const L = sq ? sqLeader(sq) : null;
  S.lead = !!(L && L !== u && ((L.sol && L.sol.role === 'leader') || (L === G.player && G.player.sol && G.player.sol.role === 'leader')) && dist(L, u) < 6);
  const list = foes().filter(e => e.alert && !e.dead && !e.D.dummy);
  const near = nearest(u, list, 99), dNear = near ? dist(u, near) : 99;
  const order = sq ? sq.order : 'free';
  if (order === 'retreat'){
    const g = L && L !== u ? L : (G.player || u); S.mode = S.kit.main ? 'ranged' : 'melee';
    u.moving = false; if (dist(u, g) > 1.8) navTo(u, g.x, g.z, u.spd * 1.45, dt, 1.4); walkPose(u); return true;
  }
  const tgt = order === 'free' ? null : solTarget(u, sq, list);
  solSwitch(u, dt, dNear);
  if (!tgt){
    if (order === 'free' && near) return S.mode === 'ranged' && S.kit.main && S.swapT <= 0 ? solRanged(u, dt, near) : false;
    return sq ? sqFormMove(u, sq, dt) : false;
  }
  if (order === 'pin'){ tgt.focusOn = u; tgt._engFo = false; }   // 묶음: 그 적은 묶은 사람만 봄
  if (S.swapT > 0){ u.moving = false; setAim(u, tgt.x, tgt.z); setPose(u, 'idle'); return true; }
  if (order === 'flank' || S.role === 'scout' && S.mode === 'melee'){   // 등 뒤로 돌아 들어감
    const back = (tgt.aim ?? 0) + Math.PI + (u.uid % 2 ? 0.5 : -0.5), bx = tgt.x + Math.cos(back) * 1.4, bz = tgt.z + Math.sin(back) * 1.4;
    const behind = Math.abs(angDiff(Math.atan2(u.z - tgt.z, u.x - tgt.x), back)) < 0.9;
    if (!behind && !solidAt(G.map, bx, bz) && dist(u, tgt) < 9){ u.moving = false; navTo(u, bx, bz, u.spd * 1.25, dt, 0.3); walkPose(u); if (dist(u, tgt) > 2.4 || !behind) return true; }
  }
  if (S.mode === 'ranged' && S.kit.main) return solRanged(u, dt, tgt);
  if (dist(u, tgt) > 1.9){ u.moving = false; navTo(u, tgt.x, tgt.z, u.spd * 1.15, dt, 1.4); walkPose(u); return true; }
  return false;   // 붙었음: 고유 근접 AI
}
if (typeof heroCombat === 'function'){
  const _heroCombatSq = heroCombat;
  heroCombat = function(u, dt){ if (solControl(u, dt)) return true; return _heroCombatSq(u, dt); };
}

/* ---------- 기절 · 일으키기 ---------- */
const REV = { bleed: 45, me: 1.3, ally: 1.6, support: 0.9, reach: 1.6 };
const _reviveCheckSq = reviveCheck;
reviveCheck = function(dt){
  if (!SQ.on) return _reviveCheckSq(dt);
  for (const u of G.units) if (u.side === 'ally' && u.downed && !u.dead){
    if (u.D.undying) continue;   // 레베카: 스스로 재생
    u.bleedT = (u.bleedT ?? REV.bleed) - dt;
    u.bleedSay = (u.bleedSay ?? 0) - dt;
    if (u.bleedSay <= 0 && u.bleedT > 0){ u.bleedSay = 5; popText(u.x, u.y + 1.3, u.z, `기절 — 출혈 ${Math.ceil(u.bleedT)}초`, 'hurt', 1.2); }
    if (u.bleedT <= 0 && !u.critical){ u.critical = true; popText(u.x, u.y + 1.5, u.z, '위독', 'hurt big', 2); if (G.mode === 'exp' && typeof makeHalfDead === 'function' && u.hero) makeHalfDead(u, '출혈'); }
  }
};
function revivePut(u, by){
  u.downed = false; u.critical = false; u.bleedT = null; u.lying = false; u.st = 'idle'; u.hp = Math.max(1, Math.round(u.max * 0.3)); setPose(u, 'idle');
  popText(u.x, u.y + 1.8, u.z, by ? `${by.D.name}이(가) 일으킴` : '일어남', 'heal', 1.3); ring(u.x, u.z, 0x7dffa0, 1.3, 0.45); SOLS.revives++;
}
// 동료가 와서 일으킴: 가까운 쓰러진 사람 (지원은 멀어도 감). 둘레 2.5칸에 적이 붙어 있으면 미룸 (지원은 무릅씀)
function reviveDuty(u, dt){
  const S = u.sol, R = S.rev;
  if (R){
    const t = R.who;
    if (!t.downed || t.dead || u.st === 'hurt'){ S.rev = null; return false; }
    if (dist(u, t) > REV.reach){ u.moving = false; navTo(u, t.x, t.z, u.spd * 1.4, dt, REV.reach * 0.8); walkPose(u); return true; }
    R.t += dt; u.moving = false; setAim(u, t.x, t.z); setPose(u, u.S.poses.squat ? 'squat' : 'idle'); u.leanT = 0.25;
    if (!R.said){ R.said = true; popText(u.x, u.y + bodyH(u) + 0.3, u.z, '일으킨다!', 'heal', 0.9); }
    if (R.t >= (S.role === 'support' ? REV.support : REV.ally)){ revivePut(t, u); S.rev = null; }
    return true;
  }
  const busyNear = foes().some(e => e.alert && dist(e, u) < 2.5);
  if (busyNear && S.role !== 'support') return false;
  const cand = G.units.filter(o => o.side === 'ally' && o.downed && !o.dead && o !== u && !o.D.undying && !G.units.some(w => w.sol && w.sol.rev && w.sol.rev.who === o));
  const t = nearest(u, cand, S.role === 'support' ? 30 : 10); if (!t) return false;
  S.rev = { who: t, t: 0 }; return true;
}
// 인주가 일으킴: 쓰러진 동료 곁 E → 1.3초 곁에 붙어 있기 (움직이거나 맞으면 끊김)
const MEREV = { u: null, t: 0 };
TICKS.push(dt => {
  if (!SQ.on) return;
  const pl = G.player; if (!pl) return;
  for (const u of G.units) if (u.side === 'ally' && u.downed && !u.dead && !u.revInsp && u !== pl && !u.D.undying){
    u.revInsp = { unit: u, r: 1.6, keep: true, get used(){ return !u.downed || u.dead; }, set used(v){}, label: `${u.D.name}을(를) 일으킨다`, fn: () => { MEREV.u = u; MEREV.t = 0; MEREV.x = pl.x; MEREV.z = pl.z; popText(pl.x, pl.y + 2.2, pl.z, '일으키는 중…', 'heal', 1); } };
    G.inspect.push(u.revInsp);
  }
  for (const u of G.units) if (u.revInsp && !u.downed){ const i = G.inspect.indexOf(u.revInsp); if (i >= 0) G.inspect.splice(i, 1); u.revInsp = null; }
  if (MEREV.u){
    const t = MEREV.u;
    if (!t.downed || pl.downed || pl.st === 'hurt' || Math.hypot(pl.x - MEREV.x, pl.z - MEREV.z) > 0.6 || dist(pl, t) > 2){ if (t.downed) popText(pl.x, pl.y + 2.2, pl.z, '끊김', 'miss', 0.7); MEREV.u = null; }
    else { MEREV.t += dt; pl.leanT = 0.25; if (MEREV.t >= REV.me){ revivePut(t, pl); MEREV.u = null; } }
  }
});

/* ---------- 상태 연계 ---------- */
function comboPop(t, txt){ SOLS.combos++; popText(t.x, t.y + bodyH(t) + 0.9, t.z, '연계: ' + txt, 'crit', 1.1); ring(t.x, t.z, 0xffd35a, 1.2, 0.3); }
const _hurtCombo = hurt;
hurt = function(att, tgt, base, o = {}){
  if (SQ.on && att && tgt && att.side === 'ally' && tgt.side === 'enemy' && !tgt.dead && !o.dot && !o.combo){
    let k = 1, why = '';
    if ((tgt.lying || (tgt.tripT && tgt.tripT > G.t)) && !tgt.lock){ k = 1.5; why = '쓰러진 놈'; }
    if (tgt.lock && tgt.lock.a && tgt.lock.a !== att && tgt.lock.a.side === 'ally'){ o = { ...o, crit: true }; why = '잡힌 놈'; }
    if (!o.ranged && tgt.gunStag > G.t){ k = Math.max(k, 1.4); why = '사격 → 근접'; tgt.gunStag = 0; }
    if (tgt.crushT > G.t){ o = { ...o, crit: true }; why = '벽꽝'; }
    if (typeof SHV !== 'undefined' && o.ranged && SHV.list.some(s => s.u === tgt)){ k = Math.max(k, 1.8); why = '날아가는 놈'; }
    if (G.units.some(k2 => k2.kc && k2.kc.type === 'grab' && k2.kc.tg === tgt && k2 !== att)){ k = Math.max(k, 1.8); why = '광대 팔'; }
    if (why){ base *= k; comboPop(tgt, why); }
  }
  const dmg = _hurtCombo(att, tgt, base, o);
  if (o.crush && tgt && !tgt.dead) tgt.crushT = G.t + 1.6;
  return dmg;
};

/* ---------- 슬라이딩 · 드롭킥 카운터 ---------- */
function readsYou(e, u){
  if (!e || e.dead || e.D.boss || e.side !== 'enemy' || !e.alert || e.lying || e.lock || e.st === 'windup' || e.st === 'strike' || e.st === 'hurt' || e.st === 'leap') return 0;
  const toU = Math.atan2(u.z - e.z, u.x - e.x); if (Math.abs(angDiff(toU, e.aim ?? 0)) > 1.0) return 0;   // 옆 · 뒤면 못 읽음
  return Math.min(0.85, 0.3 + (e.D.block ? 0.35 : 0) + (e.D.heavy ? 0.3 : 0) + ((e.D.weight || 60) >= 120 ? 0.12 : 0) + (TRAIT[e.kind] === 'dodger' ? 0.15 : 0));
}
if (typeof trip === 'function'){
  const _tripSq = trip;
  trip = function(u, e, how){
    if (SQ.on && how === 'slide' && u === G.player && Math.random() < readsYou(e, u)){
      setAim(e, u.x, u.z); interrupt(u); u.st = 'hurt'; u.stT = 1.1; u.lying = true; u.tripT = G.t + 1.1; u.posture = 'stand'; setPose(u, 'hurt');
      hurt(e, u, e.atk * 1.1, { from: e, noCrit: true }); camShake(0.25, 0.2); SFX.thump && SFX.thump(90, 0.5, 0.2);
      popText(e.x, e.y + bodyH(e) + 0.4, e.z, '막고 밟음!', 'alert', 1.1); popText(u.x, u.y + 1.6, u.z, '읽혔다', 'hurt', 0.9);
      return false;
    }
    return _tripSq(u, e, how);
  };
}
if (typeof dropHit === 'function'){
  const _dropHitSq = dropHit;
  dropHit = function(u, e, tip){
    if (SQ.on && u === G.player && Math.random() < readsYou(e, u) * 0.9){
      u.dropT = G.t; u.dk = null; u.jy = 0; u.jv = 0; u.st = 'hurt'; u.stT = 0.9;
      const a = Math.atan2(u.z - e.z, u.x - e.x) + (Math.random() < 0.5 ? 0.9 : -0.9);
      popText(e.x, e.y + bodyH(e) + 0.4, e.z, '다리를 잡아 던짐!', 'alert', 1.2); camShake(0.3, 0.25);
      if (typeof shove === 'function') shove(e, u, 4.8, a, { crush: e.atk * 1.4 }); else hurt(e, u, e.atk, { from: e, kb: 2.5 });
      return;
    }
    return _dropHitSq(u, e, tip);
  };
}

/* ---------- 지휘 창 (O) ---------- */
function sqAimTarget(){
  const pl = G.player; if (!pl) return null;
  if (mouse.over && !mouse.over.dead) return mouse.over;
  const ap = aimPoint(pl), a = ap ? Math.atan2(ap.z - pl.z, ap.x - pl.x) : pl.aim;
  return foes().filter(e => !e.dead && !e.D.dummy && dist(e, pl) < 16).sort((p, q) => Math.abs(angDiff(Math.atan2(p.z - pl.z, p.x - pl.x), a)) * 4 + dist(p, pl) * 0.1 - (Math.abs(angDiff(Math.atan2(q.z - pl.z, q.x - pl.x), a)) * 4 + dist(q, pl) * 0.1))[0] || null;
}
function sqOrder(sq, k, tgt){
  sq.order = k; const pl = G.player, L = sqLeader(sq);
  if (k === 'hold') sq.at = { x: (L || pl).x, z: (L || pl).z };
  if (k === 'pin' || k === 'flank' || (FORMS[sq.form] && FORMS[sq.form].pincer)) sq.tgt = tgt || sqAimTarget();
  if ((k === 'pin' || k === 'flank') && !sq.tgt){ sq.order = 'follow'; popText(pl.x, pl.y + 2.4, pl.z, '노릴 적이 없다', 'miss', 0.8); return; }
  if (k === 'retreat') for (const u of sqMembers(sq)) for (const e of foes()) if (e.focusOn === u) e.focusOn = null;
  const M = sqMembers(sq).filter(u => u.kind !== 'player' && !u.downed), sp = M[0];
  if (sp) say(sp, pickR2({ follow: ['따라간다!', '붙는다'], hold: ['여기서 버틴다', '자리 지킴'], pin: ['저놈은 내가 붙든다!', '묶는다'], flank: ['돌아 들어간다', '등 뒤로'], retreat: ['빠진다!', '물러나!'], free: ['알아서 한다', '흩어져!'] }[k]), 'soft', 1.4);
  if (sq.tgt && (k === 'pin' || k === 'flank')) { ring(sq.tgt.x, sq.tgt.z, 0xffd35a, 1.4, 0.5); popText(sq.tgt.x, sq.tgt.y + bodyH(sq.tgt) + 0.6, sq.tgt.z, `${sq.n}: ${ORDERS[k]}`, 'aim', 1); }
  sqHudRender();
}
const pickR2 = a => a[Math.floor(Math.random() * a.length)];
function sqForm(sq, f){ sq.form = f; if (FORMS[f].pincer && !sq.tgt) sq.tgt = sqAimTarget(); sqHudRender(); }
function sqWheel(on = !SQ.wheel){
  if (!SQ.on) return;
  SQ.wheel = on; G.slow = on ? 0.2 : 1;
  let el = document.getElementById('sqWheel');
  if (!el){ el = document.createElement('div'); el.id = 'sqWheel'; document.body.appendChild(el);
    el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; e.stopPropagation(); const sq = SQ.list[(+b.dataset.s || 1) - 1];
      if (b.dataset.o) sqOrder(sq, b.dataset.o, SQ.wtgt); if (b.dataset.f) sqForm(sq, b.dataset.f); if (b.dataset.x) sqWheel(false); else sqWheelRender(); });
    el.addEventListener('touchstart', e => e.stopPropagation(), { passive: true }); }
  if (on){ SQ.wtgt = sqAimTarget(); sqWheelRender(); }
  el.hidden = !on;
}
function sqWheelRender(){
  const el = document.getElementById('sqWheel'); if (!el) return;
  const t = SQ.wtgt;
  el.innerHTML = `<div class="sw-box"><div class="sw-head"><b>지휘</b><small>시간이 느려짐 · 노린 적: ${t ? t.D.name : '없음 (조준한 쪽의 적)'}</small><button data-x="1">닫기 (O)</button></div>`
    + SQ.list.map(sq => { const Lq = sqLeader(sq), M = sqMembers(sq).filter(u => u.kind !== 'player' && u !== Lq); return `<div class="sw-sq"><h4>${sq.n} <small>${sq.id === 1 ? '조장 인주' : '조장 ' + ((sqLeader(sq) || {}).D || { name: '없음' }).name} · ${M.map(u => u.D.name).join(' · ') || '조원 없음'}</small></h4>
      <div class="sw-row">${Object.entries(ORDERS).map(([k, n]) => `<button data-s="${sq.id}" data-o="${k}" class="${sq.order === k ? 'on' : ''}">${n}</button>`).join('')}</div>
      <div class="sw-row f">${Object.entries(FORMS).map(([k, F]) => `<button data-s="${sq.id}" data-f="${k}" class="${sq.form === k ? 'on' : ''}">${F.n}</button>`).join('')}</div></div>`; }).join('') + '</div>';
}
// 오른쪽 위: 조마다 지금 지시 · 진형 (누르면 지휘 창)
function sqHudRender(){
  let el = document.getElementById('sqHud');
  if (!SQ.on){ if (el) el.hidden = true; return; }
  if (!el){ el = document.createElement('div'); el.id = 'sqHud'; document.body.appendChild(el); el.addEventListener('click', e => { e.stopPropagation(); sqWheel(true); }); el.addEventListener('touchstart', e => { e.stopPropagation(); e.preventDefault(); sqWheel(true); }, { passive: false }); }
  el.hidden = false;
  el.innerHTML = SQ.list.map(sq => `<div><b>${sq.n}</b> ${ORDERS[sq.order]} · ${FORMS[sq.form].n}${sq.tgt && !sq.tgt.dead && (sq.order === 'pin' || sq.order === 'flank') ? ` → ${sq.tgt.D.name}` : ''}</div>`).join('') + '<small>O 지휘 · 8 · 9 · 0</small>';
}
const _uiKeysSq = uiKeys;
uiKeys = function(){
  if (SQ.on && SQ.wheel){
    if (hit('KeyO') || hit('Escape')){ sqWheel(false); return true; }
    for (let i = 1; i <= 6; i++) if (hit('Digit' + i)){ sqOrder(SQ.list[0], Object.keys(ORDERS)[i - 1], SQ.wtgt); sqWheelRender(); return true; }
    return _uiKeysSq();
  }
  if (SQ.on && !G.lock && !G.waitInput){
    if (hit('KeyO')){ sqWheel(true); return false; }
    if (hit('Digit8')) sqOrder(SQ.list[0], 'follow'); if (hit('Digit9')) sqOrder(SQ.list[1], 'follow');
    if (hit('Digit0')){ sqOrder(SQ.list[0], 'retreat'); sqOrder(SQ.list[1], 'retreat'); }
  }
  return _uiKeysSq();
};
TICKS.push(dt => { if (!SQ.on) return; for (const sq of SQ.list){ sqHeadTick(sq, dt); if (sq.tgt && sq.tgt.dead){ sq.tgt = null; if (sq.order === 'pin' || sq.order === 'flank'){ sq.order = 'follow'; sqHudRender(); } } } });
