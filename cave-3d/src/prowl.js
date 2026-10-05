/* prowl.js v1.0 — (v0.58) 자객 · 경계 · 어둠 · 후방 기습 (훈련장 규칙. "어딜 놀아")
   ■ 자객 (적): 무리와 따로 움직이며 우리 편을 사냥함. 숙여 구부린 걸음으로 경계가 비는 쪽 — 맨 뒤 · 떨어진 놈 · 싸우느라 한눈 판 놈의 등 뒤로 돌아 들어옴
     · 우리 편 누구의 시야 (앞 ±65°, 어두우면 짧음)에도 안 걸리는 자리만 밟음. 다 막혀 있으면 어둠 속에서 기다림
     · 등 뒤에 닿으면: 목 따기 (즉사 — 동료는 전사, 인주는 위독) · 한 번에 쓰러뜨림 · 치명상. 거구 (카리우스 · 판금)는 목이 안 닿음
     · 아무도 못 보면 소리 없이 끝남 — 동료 줄 (왼쪽)만 바뀜. 누가 쓰러진 걸 발견하면 그때 외침
   ■ 경계 (우리 편): 동료마다 시야가 있음. 훈련 창에서 '경계'를 맡기면 그 동료는 따라오며 뒤를 봄. 서 있는 동료는 가끔 둘레를 둘러봄
     · 자객이 시야에 들면 의심 (?) → 다 차면 "뒤다!" — 자객이 드러나 보통 적이 됨. 바로 곁 (1.3칸)은 발소리로 앎
     · 싸우는 중 (곁에 적)이면 시야가 좁고 둔함 — 한눈 팔린 사이
     · 누구의 시야도 등을 덮지 못하는 동료: 발밑 뒤쪽에 붉은 사각 (훈련장 표시)
   ■ 어둠: 어두운 곳에서는 보이는 거리가 줄어듦 (원정 = 빛, 훈련장 = 골목). 적의 발견도 같음 (stealth.js)
   ■ 엄폐 뒤 숙인 자는 너머에서 안 보임 (바로 곁 제외) — 적 · 우리 같음
   ■ 은신 걸음: 숙여 움직이는 자 (자객 · 은밀히 동료)는 그림이 앞으로 구부러짐
   ■ 숨은 적 (lurk): 엄폐 뒤에 숙여 기다리다 다가오면 덮침 */
'use strict';
const PRW = { show: true, reveal: false, stat: { execs: 0, slain: 0, downs: 0, wounds: 0, caught: 0 }, dark: [] };
function lightMul(x, z){
  let L = 1;
  if (G.mode === 'exp' && typeof lightAt === 'function') L = clamp(lightAt(x, z), 0.1, 1);
  else for (const r of PRW.dark) if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) L = Math.min(L, r.L);
  return 0.3 + 0.7 * L;
}
// 엄폐 뒤 숙인 자는 너머의 눈에 안 보임
function hiddenFrom(t, viewer){
  if (typeof coverFor !== 'function' || !FORT.on) return false;
  if (!(isCrouched(t) || t.coverDuck || t.lurk) || cantCrouch(t) || acting(t)) return false;
  return !!coverFor(t, viewer.x, viewer.z) && dist(t, viewer) > 1.6;
}
const isProwler = e => e.side === 'enemy' && e.prowl && !e.revealed && !e.dead;
const allyR = u => (u.kind === 'player' ? 8 : 7.5) * (u.sol && u.sol.role === 'scout' ? 1.15 : 1);
const busy = u => foes().some(e => e.alert && !e.dead && dist(e, u) < 2.6) || u.st === 'windup' || u.st === 'strike';
// 보는 자 o가 (x, z)에 있는 숙인 자객 e를 얼마나 빨리 알아채나 (0 = 못 봄)
function noticeRate(o, e, x = e.x, z = e.z, moving = e.moving){
  if (o.dead || o.downed) return 0;
  const d = Math.hypot(x - o.x, z - o.z), stl = e.stl ?? 3;
  if (d < 1.3) return 1.6;   // 바로 곁: 발소리
  const b = busy(o), w = o.sol && o.sol.watch && !b, cone = b ? 0.6 : w ? 1.5 : 1.15;
  let R = allyR(o) * lightMul(x, z) * 0.62 * Math.max(0.5, 1 - stl * 0.06) * (moving ? 1.15 : 0.85) * (b ? 0.6 : 1) * (w ? 1.35 : 1) * (o.moving ? 1 : 1.15);
  if (d > R) return 0;
  const ang = Math.abs(angDiff(Math.atan2(z - o.z, x - o.x), o.aim ?? 0));
  if (ang > cone || !losClear(G.map, o.x, o.z, x, z)) return 0;
  if (e.x === x && e.z === z && hiddenFrom(e, o)) return 0;
  return ((1 - d / R) * 2.4 + 0.45) * (b ? 0.4 : 1);
}
function glimpse(o, e){
  const d = dist(o, e), R = allyR(o) * lightMul(e.x, e.z) * (busy(o) ? 0.7 : 1);
  return d < R && Math.abs(angDiff(Math.atan2(e.z - o.z, e.x - o.x), o.aim ?? 0)) < 1.15 && losClear(G.map, o.x, o.z, e.x, e.z) && !hiddenFrom(e, o);
}
const safeAt = (e, x, z, skip) => G.units.every(o => o.side !== 'ally' || o === skip || noticeRate(o, e, x, z, true) === 0);
// 동료의 등을 누군가의 시야가 덮나
function backCovered(a){
  const bx = a.x + Math.cos((a.aim ?? 0) + Math.PI) * 1.4, bz = a.z + Math.sin((a.aim ?? 0) + Math.PI) * 1.4, fake = { stl: 3, x: bx, z: bz };
  return G.units.some(o => o.side === 'ally' && o !== a && !o.dead && !o.downed && noticeRate(o, fake, bx, bz, false) > 0);
}

/* ---------- 자객 ---------- */
function prowlReveal(e, by, why){
  if (e.revealed) return;
  e.revealed = true; e.alert = true; e.seen = G.t; e.posture = 'stand'; e.bend = false; e.sit = false;
  PRW.stat.caught++;
  popText(e.x, e.y + bodyH(e) + 0.6, e.z, '!', 'alert', 0.9);
  if (by && by.side === 'ally') say(by, why || pickR2(['뒤다!', '자객이다!', '뒤에 뭔가 있다!']), 'big', 1.5);
}
function prowlVictim(e){
  const A = G.units.filter(a => a.side === 'ally' && !a.dead && !a.downed);
  if (!A.length) return null;
  const pl = G.player && !G.player.downed ? G.player : A[0];
  let best = null, bs = 1e9;
  for (const a of A){
    let s = dist(e, a) * 0.6 - dist(a, pl) * 0.5;   // 가깝고 · 무리에서 떨어진 놈
    if (!backCovered(a)) s -= 5;
    if (busy(a)) s -= 3;
    if (cantCrouch(a)) s += 3;   // 거구는 목이 안 닿음
    if (s < bs){ bs = s; best = a; }
  }
  return best;
}
function prowlExec(e, a){
  e.prowlCd = 3.5; e.leanT = 0.35; setAim(e, a.x, a.z); SFX.whoosh && SFX.whoosh();
  PRW.stat.execs++;
  const big = cantCrouch(a), skill = e.stl ?? 3, r = Math.random();
  const seen = G.units.filter(o => o.side === 'ally' && o !== a && noticeRate(o, e) > 0);
  const pThroat = big ? 0 : 0.25 + skill * 0.06, pDown = big ? 0.25 : 0.55;
  let what;
  if (r < pThroat && a.kind !== 'rebeccaAlly'){
    what = 'throat'; PRW.stat.slain++;
    if (a.kind === 'player'){ a.hp = 0; kill(a, e); a.critical = true; a.throatCut = true; }
    else { a.hp = 0; a.downed = true; a.dead = true; a.slain = true; a.st = 'dead'; a.lying = true; setPose(a, a.S.poses.dead ? 'dead' : a.S.poses.down ? 'down' : 'hurt'); }
    spark(a.x, a.y + bodyH(a) * 0.8, a.z, 0x9a1010, 10, 2.5);
  } else if (r < pThroat + (1 - pThroat) * pDown){
    what = 'down'; PRW.stat.downs++; a.hp = 0; kill(a, e); spark(a.x, a.y + 1, a.z, 0xb02020, 8, 3);
  } else {
    what = 'wound'; PRW.stat.wounds++;
    hurt(e, a, a.max * 0.55, { crit: true, critMul: 1, from: e, noCam: true });
    prowlReveal(e, a, '크윽… 뒤에!');
  }
  a.silent = what !== 'wound' && !seen.length;
  a.found = !a.silent;
  if (what !== 'wound'){
    if (seen.length) prowlReveal(e, seen[0], a.D.name + '!! 뒤에 자객이다!');
    else popText(a.x, a.y + 0.6, a.z, '…', 'miss', 0.6);   // 소리 없이
  }
}
function prowlThink(e, dt){
  if (e.st === 'hurt'){ e.stT -= dt; if (e.stT <= 0){ e.st = 'idle'; setPose(e, 'idle'); } return; }
  e.posture = 'crouch'; e.bend = true;
  e.prowlCd = (e.prowlCd || 0) - dt;
  // 숨은 동안 우리 편의 의심
  let best = 0, who = null;
  for (const o of G.units){ if (o.side !== 'ally') continue; const r = noticeRate(o, e); if (r > best){ best = r; who = o; } }
  if (who){ e.psus = (e.psus || 0) + best * dt; if (e.psus > 0.3 && !e.psSaid){ e.psSaid = true; popText(e.x, e.y + bodyH(e) + 0.4, e.z, '?', 'alert', 0.8); } if (e.psus >= 1) return prowlReveal(e, who); }
  else { e.psus = Math.max(0, (e.psus || 0) - dt * 0.3); if (e.psus < 0.1) e.psSaid = false; }
  // 한 건 한 뒤: 잠깐 물러남
  if (e.prowlCd > 0){
    const pl = G.player || e, n = norm(e.x - pl.x, e.z - pl.z);
    e.moving = false; navTo(e, e.x + n.x * 3, e.z + n.z * 3, e.spd * 0.7, dt, 0.2); setPose(e, e.S.poses.walk && e.moving ? 'walk' : 'idle'); return;
  }
  e.vicT = (e.vicT || 0) - dt;
  if (e.vicT <= 0 || !e.victim || e.victim.dead || e.victim.downed){ e.vicT = 1.2; e.victim = prowlVictim(e); }
  const a = e.victim; if (!a){ e.moving = false; setPose(e, 'idle'); return; }
  const back = (a.aim ?? 0) + Math.PI, dA = dist(e, a), behind = Math.abs(angDiff(Math.atan2(e.z - a.z, e.x - a.x), back)) < 1.0;
  // 때를 기다림: 한눈 팔림 (싸우는 중) · 무리에서 떨어짐 (4칸) · 등이 빔 — 아니면 6칸 밖 어둠에서 따라오기만 (참을성이 다하면 들어옴)
  e.patT = (e.patT ?? rnd(14, 22)) - dt;
  const lone = !G.units.some(o => o.side === 'ally' && o !== a && !o.dead && !o.downed && dist(o, a) < 4);
  const chance = busy(a) || lone || (!backCovered(a) && e.patT <= 0);
  if (!chance && dA < 6.5){ const n = norm(e.x - a.x, e.z - a.z); e.moving = false; if (dA < 6) navTo(e, a.x + n.x * 6.5, a.z + n.z * 6.5, e.spd * 0.5, dt, 0.3); else setAim(e, a.x, a.z); setPose(e, e.moving && e.S.poses.walk ? 'walk' : 'idle'); return; }
  if (dA < 1.15 && behind){ prowlExec(e, a); return; }
  // 등 쪽 둘레에서 안전한 다음 자리
  let goal = null, gs = 1e9;
  for (const rr of [0.9, 2, 3.5, 5.5, 8]) for (const off of [0, 0.45, -0.45, 0.9, -0.9, 1.4, -1.4, 2.0, -2.0]){
    const ang = back + off, x = a.x + Math.cos(ang) * rr, z = a.z + Math.sin(ang) * rr;
    if (solidAt(G.map, x, z) || Math.hypot(x - e.x, z - e.z) > Math.max(4, dA * 0.8 + 1)) continue;
    if (!safeAt(e, x, z, rr < 1.2 ? a : null)) continue;
    const s = rr * 1.2 + Math.abs(off) * 1.5 + Math.hypot(x - e.x, z - e.z) * 0.25;
    if (s < gs){ gs = s; goal = { x, z }; }
  }
  e.moving = false;
  if (goal && Math.hypot(goal.x - e.x, goal.z - e.z) > 0.25){ navTo(e, goal.x, goal.z, e.spd * 0.5, dt, 0.15); }
  else if (!goal && !safeAt(e, e.x, e.z)){   // 들킬 자리: 어둠 쪽으로 물러남
    const n = norm(e.x - a.x, e.z - a.z); navTo(e, e.x + n.x * 2, e.z + n.z * 2, e.spd * 0.62, dt, 0.2);
  } else setAim(e, a.x, a.z);
  setPose(e, e.moving && e.S.poses.walk ? 'walk' : 'idle');
}
const _enemyThinkP = enemyThink;
enemyThink = function(e, dt){
  if (typeof SQ !== 'undefined' && SQ.on && isProwler(e) && !e.lock) return prowlThink(e, dt);
  if (SQ.on && e.lurk && !e.alert){ e.posture = 'crouch'; }
  return _enemyThinkP(e, dt);
};
// 무리가 깨어나도 자객은 숨은 채
const _alertGroupP = alertGroup;
alertGroup = function(u, by){
  const hid = G.units.filter(isProwler); for (const o of hid) o.alert = true;
  if (isProwler(u)){ for (const o of hid) o.alert = false; return; }
  _alertGroupP(u, by);
  for (const o of hid) o.alert = false;
};
// 맞으면 드러남
const _hurtP = hurt;
hurt = function(att, tgt, dmg, o = {}){
  if (tgt && isProwler(tgt)) prowlReveal(tgt, att && att.side === 'ally' ? att : null, '잡았다!');
  return _hurtP(att, tgt, dmg, o);
};

/* ---------- 경계 (우리 편 시야 방향) ---------- */
const _solControlP = solControl;
solControl = function(u, dt){
  const r = _solControlP(u, dt);
  if (!SQ.on || !u.sol || u.kind === 'player' || u.downed || u.dead) return r;
  const sq = sqOf(u), near = foes().some(e => e.alert && !e.dead && dist(e, u) < 6);
  if (near || u.st === 'windup' || u.st === 'strike') return r;
  const head = sq ? sq.head : u.aim;
  if (u.sol.watch){ const a = head + Math.PI + Math.sin(G.t * 0.7 + u.uid) * 0.7; u.aim = a; faceToward(u, Math.cos(a), Math.sin(a)); }   // 뒤를 봄
  else if (!u.moving){
    u.glT = (u.glT || rnd(2, 5)) - dt;
    if (u.glT <= 0){ u.glT = rnd(3, 6); u.glA = head + rnd(-1.6, 1.6); }
    if (u.glA != null && u.glT > 1.5){ u.aim = u.glA; faceToward(u, Math.cos(u.glA), Math.sin(u.glA)); }
  }
  return r;
};
// 전사한 동료는 못 일으킴 · 쓰러진 걸 발견
const _reviveDutyP = reviveDuty;
reviveDuty = function(u, dt){ if (u.sol && u.sol.rev && u.sol.rev.who.slain){ u.sol.rev = null; } return _reviveDutyP(u, dt); };

/* ---------- 한 프레임: 발견 · 표시 · 구부림 · 숨은 적 ---------- */
TICKS.push(dt => {
  if (!(typeof SQ !== 'undefined' && SQ.on)) return;
  // 쓰러진 동료를 누가 발견
  for (const a of G.units){
    if (a.side !== 'ally' || !a.silent || a.found) continue;
    if (!(a.downed || a.slain)){ a.silent = false; continue; }
    const f = G.units.find(o => o.side === 'ally' && o !== a && !o.dead && !o.downed && (dist(o, a) < 2.5 || dist(o, a) < 7 && Math.abs(angDiff(Math.atan2(a.z - o.z, a.x - o.x), o.aim ?? 0)) < 1.15 && losClear(G.map, o.x, o.z, a.x, a.z)));
    if (f){ a.found = true; say(f, a.slain ? `${a.D.name}… 목이 따였다!` : `${a.D.name}이 쓰러져 있다!`, 'big', 1.8); }
  }
  // 자객은 우리 편 누군가의 눈 (시야 안 · 발견 거리의 2배)에 들어야 보임
  for (const e of G.units){
    if (!isProwler(e)){ if (e._pHid){ e._pHid = false; e.group.visible = true; e.dark = false; } continue; }
    const vis = PRW.reveal || G.units.some(o => o.side === 'ally' && !o.dead && !o.downed && (dist(o, e) < 1.6 || glimpse(o, e)));
    e.group.visible = vis; e.dark = !vis; e._pHid = !vis;
  }
  // 은신 걸음 · 숨은 적
  for (const u of G.units){
    if (u.dead) continue;
    u.bend = (isProwler(u) && u.moving) || (u.side === 'ally' && u.sneak && u.moving);
    if (u.bend) u.sit = false;
    if (u.side === 'enemy' && u.lurk){ if (u.alert){ u.lurk = false; u.posture = 'stand'; u.sit = false; } else if (!u.S.poses.squat) u.sit = true; }
  }
  // 표시: 등이 빈 동료 (붉은 사각) · 들키지 않은 적의 등 (숙였을 때, 푸른 암살 구역)
  PRW.tk = (PRW.tk || 0) - dt; const re = PRW.tk <= 0; if (re) PRW.tk = 0.25;
  const pl = G.player, sneaking = pl && (pl.posture === 'crouch' || SQ.list.some(s => s.order === 'sneak'));
  for (const u of G.units){
    if (u.side === 'neutral') continue;
    let want = false, col = 0;
    if (PRW.show && !u.dead && !u.downed){
      if (u.side === 'ally'){ if (re) u._bk = !backCovered(u); want = u._bk; col = 0xff3020; }
      else if (!u.alert && !isProwler(u) && sneaking && dist(u, pl) < 12){ want = true; col = 0x40d0ff; }
    }
    if (!want){ if (u.blind) u.blind.visible = false; continue; }
    if (!u.blind){ u.blind = new THREE.Mesh(new THREE.CircleGeometry(1, 16, -0.9, 1.8), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide })); u.blind.rotation.x = -Math.PI / 2; u.blind.position.y = 0.035; u.group.add(u.blind); }
    u.blind.visible = true; u.blind.material.color.setHex(col); u.blind.scale.setScalar(u.side === 'ally' ? 2.0 : 1.5);
    u.blind.rotation.z = -((u.aim ?? 0) + Math.PI); u.blind.material.opacity = 0.13 + Math.abs(Math.sin(G.t * 2.5)) * 0.1;
  }
});
// 그림: 구부림 · 어둠
const _updateSpriteP = updateSprite;
updateSprite = function(u, dt){
  _updateSpriteP(u, dt);
  if (u.bend){ u.mesh.scale.y *= 0.84; u.mesh.position.y *= 0.84; u.pivot.rotation.z += 0.2 * -u.face; }
  if (PRW.dark.length && G.mode === 'drill'){ const L = lightMul(u.x, u.z); if (L < 1) u.mat.color.multiplyScalar(Math.max(0.25, (L - 0.3) / 0.7 * 0.75 + 0.25)); }
};

/* ---------- 훈련장: 어두운 골목 · 경계 기본값 · 시나리오 ---------- */
const _startDrillP = startDrill;
startDrill = function(){
  _startDrillP();
  PRW.dark = [{ x0: 55.5, z0: 24.5, x1: 74.5, z1: 45.5, L: 0.25 }];
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(20, 22), new THREE.MeshBasicMaterial({ color: 0x05040a, transparent: true, opacity: 0.62, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.set(65, 0.025, 35); G.map.group.add(sh);
  const g = G.units.find(u => u.kind === 'gangsterAlly'); if (g && g.sol && !(RPG.sol && RPG.sol.gangsterAlly)) g.sol.watch = true;   // 2조 갱스터가 뒤를 봄 (1조는 비어 있음 — 맡겨 보기)
};
const _drillHealP = drillHeal;
drillHeal = function(){
  for (const u of G.units) if (u.side === 'ally' && u.slain){ u.slain = false; u.dead = false; u.downed = true; u.silent = false; }
  _drillHealP();
  for (const u of G.units) if (u.side === 'ally'){ u.downed = false; u.critical = false; u.throatCut = false; u.st = 'idle'; u.lying = false; u.tilt = 0; }
};
function prowlSpawn(k, at, o = {}){
  drillSpawn([k], { at, alert: false, title: o.title, sub: o.sub });
  const e = foes()[foes().length - 1]; e.prowl = true; e.stl = o.stl ?? 4; e.alert = false; e.band = 'prowl' + e.uid; return e;
}
DRILL_SC.splice(DRILL_SC.length - 1, 0,
  { k: 'rear', n: '후방 기습', d: '앞 바리케이드 뒤에 숨은 무리 (다가가면 덮침) + 뒤에서 자객 둘이 사냥. 경계를 안 세우면 맨 뒤부터 소리 없이 사라짐 — 훈련 창에서 동료에게 \'경계\'를 맡겨 볼 것', go: () => {
    drillClear(); fortClearAll(); drillHeal();
    for (const sq of SQ.list){ sqOrder(sq, 'follow'); }
    const pl = G.player; pl.x = 39; pl.z = 33;
    for (const u of G.units) if (u.side === 'ally' && u !== pl && !u.dead){ u.x = 39 + rnd(-3, 3); u.z = 34 + rnd(0, 2); }
    lineOf('barricade', 21, 35, 43, [39], 'enemy');
    for (const [k, x] of [['swordsman', 36], ['swordsman', 42], ['spearman', 38], ['archer', 40]]){ drillSpawn([k], { at: { x, z: 20 }, alert: false, title: '후방 기습', sub: '앞에 숨은 무리 — 그리고 뒤' }); const e = foes()[foes().length - 1]; e.lurk = true; e.band = 'front'; }
    prowlSpawn('catw', { x: 30, z: 45 }, { stl: 4 }); prowlSpawn('gwangnyang', { x: 49, z: 45 }, { stl: 4 });
  } },
  { k: 'dark', n: '어두운 골목', d: '골목은 어두움 (서로 잘 안 보임). 복도 끝마다 보초가 지키고, 어둠 속엔 자객 하나. 숙여서 · 벽 곁으로', go: () => {
    drillClear(); drillHeal();
    for (const [x, z, a] of [[70, 32, -Math.PI / 2], [63, 34, -Math.PI / 2], [57, 39, -Math.PI / 2], [71, 43, Math.PI]]){ drillSpawn([z === 43 ? 'archer' : 'spearman'], { at: { x, z }, alert: false, title: '어두운 골목', sub: '보초 · 그리고 어둠 속의 자객' }); const e = foes()[foes().length - 1]; e.lookT = 1e9; e.aim = e.aim0 = a; }
    prowlSpawn('catw', { x: 59, z: 43 }, { stl: 5 });
    const pl = G.player; pl.x = 67; pl.z = 22;
    for (const u of G.units) if (u.side === 'ally' && u !== pl){ u.x = 67 + rnd(-2, 2); u.z = 20 + rnd(0, 1); }
  } });
