/* motion.js v1.1 — (v1.1, v0.77: 2 · 3기 새 동작 프레임 (h2_mov.js) 이 있는 인물 (S.mov) 도 — 서 있음 · 걷기 · 달리기 · 앞뒤 걷기 · 맞음 · 기절 · 넘어짐만 고름, 기술 그림은 h2.js 그대로)
   v1.0 — 1차 업뎃 (2026-10-09): 잡몹 10명 동작 그림 (드라이브 '10.08 1차업뎃 / 1차적 10인')
   검사 · 검방패병 · 붉은 망토 궁수 · 창병 · 광신도 · 꼬마악마 · 흑기사 방패병 · 흑기사 창병 · 광냥 · 푸른 뚱보
   ■ 그림: src/mob10_sheets.js (M10, tools/mob10_art.py 가 만듦) → SPR[키] 를 통째로 바꿈 (키 · 크기 (tall) 는 그대로)
   ■ 자세 고르기 (TICK — 생각 → TICKS → 그리기 순서라, 생각이 정한 자세 위에 덮어씀)
     · 서 있음 = 대기 · 싸움 중 서 있음 = 공격 대기 · 걷기 4장 · 달리기 (경계 중 제 속도로 쫓을 때) — 빠르기에 맞춰 재생 속도도 바뀜
     · 예고 = 공격 준비 · 침 = 기본 공격 / 다른 모양 공격 번갈아 (고유 기술이 없는 놈은 가끔 특수 공격 그림)
     · 고유 기술 (SIG) = 특수 준비 → 특수 공격 · 궁수 화살비 = 필살 포즈
     · 맞음 2가지 번갈아 · 오래 휘청 (0.6초 넘게) = 기절 그림 · 넘어짐 = 누운 그림 → 웅크렸다 일어남
     · 막는 놈 (검방패병 · 흑기사 방패병) 이 앞에서 막으면 잠깐 방어 그림 · 방어 자세 (뚱보) = 방어 · 들이받기 = 달리기
     · 궁수 뒤로 도약 · 뛰어오름 = 점프 그림 · 숙임 (매복 · 엄폐) = 웅크림 · 죽음 = 누운 그림 2가지 중 하나
   ■ 2 · 3기 (S.mov): 자세가 이 파일이 다루는 것 (서 있음 · 걷기 · 맞음 …) 일 때만 바꿈 — 사격 · 막기 · 기술 그림은 그 코드가 정한 그대로
     · 앞뒤 걷기 그림 (walkB) 이 있으면 카메라에서 멀어질 때 뒷모습 걷기 · 공격 그림이 둘이면 (attackB) 번갈아
   ■ 원정 싸움 방 열에 다섯 (계단 방 넷 · 보물 방 셋): 무리 가운데 모닥불 → 둘레에 앉아 쉼 (쉬기 그림 3가지). 쉬는 동안은 가까이 (3칸) 와야 알아챔. 깨면 웅크렸다 일어남 */
'use strict';
const M10_SIGLESS = new Set(['foeDevil', 'bkSpear', 'bluefat']);   // 고유 기술이 없는 놈: 가끔 특수 공격 그림으로 침
(function m10Build(){
  if (typeof M10 === 'undefined') return;
  const AL = { aim: 'windup', squat: 'crouch', block: 'guard', down: 'dead', shoot: 'attack', throw: 'attack' };   // 엔진 · 다른 코드가 부르는 이름
  for (const [k, A] of Object.entries(M10)){
    const old = SPR[k]; if (!old) continue;
    const poses = {};
    for (const [n, p] of Object.entries(A.poses)) poses[n] = { src: A.src, f: 1, ...p, ...(p.flat ? { flat: true } : {}), ...(p.once ? { once: true } : {}), ...(p.pingpong ? { pingpong: true } : {}) };
    for (const [a, b] of Object.entries(AL)) if (!poses[a] && poses[b]) poses[a] = poses[b];
    SPR[k] = { h0: A.h0, tall: old.tall, poses, m10: true };
  }
})();

/* ---------- 엔진이 부르는 자세 이름 → 이 그림의 자세 ---------- */
const M10_HURT = new Set(['hurt', 'hurt2', 'stun']), M10_ATK = new Set(['attack', 'attackB', 'special']);
function m10Map(u, p){
  const Q = u.S.poses;
  if (p === 'hurt'){
    if (u.st === 'held') return 'hurt2';
    if (M10_HURT.has(u.pose) && u.poseT < 0.15) return u.pose;   // 같은 순간 여러 번 불려도 깜빡이지 않게
    if ((u.stT || 0) >= 0.6 && Q.stun) return 'stun';
    u._hk = !u._hk; return u._hk && Q.hurt2 ? 'hurt2' : 'hurt';
  }
  if (p === 'attack'){
    if (M10_ATK.has(u.pose) && u.poseT < 0.25) return u.pose;
    if (u._sig && Q.special) return 'special';
    u._ak = (u._ak || 0) + 1;
    if (M10_SIGLESS.has(u.kind) && u._ak % 4 === 0 && Q.special) return 'special';
    return u._ak % 2 === 0 && Q.attackB ? 'attackB' : 'attack';
  }
  if (p === 'windup' || p === 'aim') return u._sig && Q.spwind ? 'spwind' : 'windup';
  if (p === 'jump') return Q.jump ? 'jump' : 'run';
  return p;
}
// 2 · 3기 (S.mov): 맞음 → 오래 휘청이면 기절 · 맞음 2가지 번갈아, 기본 공격 그림이 둘이면 번갈아
function movMap(u, p){
  const Q = u.S.poses;
  if (p === 'hurt'){
    if (M10_HURT.has(u.pose) && u.poseT < 0.15) return u.pose;
    if ((u.stT || 0) >= 0.6 && Q.stun) return 'stun';
    u._hk = !u._hk; return u._hk && Q.hurt2 ? 'hurt2' : 'hurt';
  }
  if (p === 'attack' && Q.attackB){ if (M10_ATK.has(u.pose) && u.poseT < 0.25) return u.pose; u._ak = (u._ak || 0) + 1; return u._ak % 2 ? 'attack' : 'attackB'; }
  return p;
}
const _setPoseM10 = setPose;
setPose = function(u, p){ return _setPoseM10(u, u && u.S ? (u.S.m10 ? m10Map(u, p) : u.S.mov ? movMap(u, p) : p) : p); };

/* ---------- 고유 기술: 특수 준비 → 특수 공격 ---------- */
for (const k of Object.keys(typeof M10 !== 'undefined' ? M10 : {})){
  const S = SIG[k]; if (!S || S._m10) continue;
  const f = S.fn; S._m10 = true;
  S.fn = function(u, tgt){
    const r = f(u, tgt);
    if (r && u.S.m10){ u._sig = true; _setPoseM10(u, u.st === 'windup' ? 'spwind' : 'special'); }
    return r;
  };
}

/* ---------- 막음: 앞에서 막으면 잠깐 방어 그림 ---------- */
const _hurtM10 = hurt;
hurt = function(att, tgt, base, o = {}){
  let blk = false;
  if (tgt && tgt.S && tgt.S.m10 && tgt.D.block && !o.pierce && !tgt.dead && !tgt.downed){
    const s = o.from || att; if (s) blk = Math.abs(angDiff(Math.atan2(s.z - tgt.z, s.x - tgt.x), tgt.aim)) <= 1.9;
  }
  const r = _hurtM10(att, tgt, base, o);
  if (blk && r > 0 && !tgt.dead && tgt.st === 'idle') tgt._guardT = G.t + 0.45;
  return r;
};
/* ---------- 죽음: 누운 그림 둘 중 하나 ---------- */
const _killM10 = kill;
kill = function(u, by){
  const r = _killM10(u, by);
  if (u && u.S && u.S.m10 && (u.dead || u.downed)){ const Q = u.S.poses; _setPoseM10(u, u.dead && Q.dead2 && Math.random() < 0.5 ? 'dead2' : 'dead'); u._dp = true; u.camp = null; }
  return r;
};

/* ---------- 자세 고르기 ---------- */
function m10Want(u, dt){
  const Q = u.S.poses, st = u.st;
  u._rate = 1;
  if (u.lying){ u._wasLying = true; return Q.dead2 ? 'dead2' : 'dead'; }   // 넘어짐: 누운 그림 (flat 이라 눕히지 않음)
  if (st === 'hurt' || st === 'stun' || st === 'held'){
    if (u._wasLying || u._wake) return 'crouch';                            // 일어나는 중 · 쉬다 깸
    if (st === 'stun') return 'stun';
    return M10_HURT.has(u.pose) ? null : m10Map(u, 'hurt');
  }
  u._wasLying = false; u._wake = false;
  if (st === 'leap' || u.airborne || (u.jy || 0) > 0.25) return Q.jump ? 'jump' : 'run';
  if (st === 'guardStance') return 'guard';
  if (st === 'charge') return 'run';
  if (st === 'windup') return u.pose === 'windup' || u.pose === 'spwind' ? null : u._sig && Q.spwind ? 'spwind' : 'windup';
  if (st === 'strike') return M10_ATK.has(u.pose) ? null : m10Map(u, 'attack');
  if (st !== 'idle') return null;   // 그 밖 (기술 · 태클 · 잡기 …) 은 그 코드가 정한 그대로
  u._sig = false;
  if (u.camp && !u.alert) return u.camp.pose;
  if (u.posture === 'crouch' && u.side === 'enemy' && !u.moving || u.lurk && !u.alert) return 'crouch';
  if (G.t < (u._guardT || 0)) return 'guard';
  if (u.moving && (u._msp || 0) > 0.25){
    const fast = (u.alert || u.side === 'ally') && u._msp > u.spd * 0.85;
    u._rate = Math.max(0.6, Math.min(1.3, u._msp / Math.max(0.5, u.spd)));   // 빠르기에 맞춰 재생 속도
    return fast && Q.run ? 'run' : 'walk';
  }
  if (u.side === 'enemy') return u.alert ? 'ready' : 'idle';
  if ((u._rdT = (u._rdT || 0) - dt) <= 0){ u._rdT = 0.5; u._rdy = G.units.some(e => e.side === 'enemy' && !e.dead && !e.downed && dist(e, u) < 9); }
  return u._rdy ? 'ready' : 'idle';
}
// 2 · 3기: 이 파일이 다루는 자세일 때만 (사격 · 막기 · 기술 그림은 건드리지 않음)
const MOV_OWN = new Set(['idle', 'ready', 'walk', 'walkB', 'run', 'hurt', 'hurt2', 'stun', 'kneel', 'down']);
const _camF = new THREE.Vector3();
function movWant(u, dt){
  const Q = u.S.poses, st = u.st;
  u._rate = 1;
  if (u.lying && Q.down && Q.down.flat){ u._wasLying = true; return MOV_OWN.has(u.pose) || M10_HURT.has(u.pose) ? 'down' : null; }
  if (st === 'hurt' || st === 'stun' || st === 'held'){
    if (!MOV_OWN.has(u.pose)) return null;
    if (u._wasLying && Q.kneel) return 'kneel';
    if (st === 'stun' && Q.stun) return 'stun';
    return M10_HURT.has(u.pose) ? null : movMap(u, 'hurt');
  }
  u._wasLying = false;
  if (st !== 'idle' || !MOV_OWN.has(u.pose)) return null;
  if (u.moving && (u._msp || 0) > 0.25){
    const fast = (u.alert || u.side === 'ally') && u._msp > u.spd * 0.85;
    u._rate = Math.max(0.6, Math.min(1.3, u._msp / Math.max(0.5, u.spd)));
    if (Q.walkB && u._mv){ camera.getWorldDirection(_camF); const l = Math.hypot(_camF.x, _camF.z) || 1; if ((u._mv.x * _camF.x + u._mv.z * _camF.z) / l > 0.45) return 'walkB'; }   // 카메라에서 멀어짐 = 뒷모습
    return fast && Q.run ? 'run' : 'walk';
  }
  const war = u.side === 'enemy' ? u.alert : ((u._rdT = (u._rdT || 0) - dt) <= 0 ? (u._rdT = 0.5, u._rdy = G.units.some(e => e.side === 'enemy' && !e.dead && !e.downed && dist(e, u) < 9)) : u._rdy);
  return war && Q.ready ? 'ready' : 'idle';
}
TICKS.push(dt => {
  for (const u of G.units){
    if (!u.S || !(u.S.m10 || u.S.mov) || u.dead || u.downed || u.lock) continue;
    const dx = u._mp ? u.x - u._mp.x : 0, dz = u._mp ? u.z - u._mp.z : 0, sp = Math.hypot(dx, dz) / Math.max(dt, 1e-3); u._mp = { x: u.x, z: u.z };
    if (sp > 0.2) u._mv = { x: dx / (sp * Math.max(dt, 1e-3)), z: dz / (sp * Math.max(dt, 1e-3)) };   // 움직이는 쪽 (단위)
    u._msp = (u._msp || 0) + (Math.min(sp, 12) - (u._msp || 0)) * Math.min(1, dt * 10);
    const p = u.S.m10 ? m10Want(u, dt) : movWant(u, dt);
    if (p && u.S.poses[p]) _setPoseM10(u, p);
    if ((u.pose === 'walk' || u.pose === 'walkB' || u.pose === 'run') && u.poseT > 0.05) u.poseT = Math.max(0, u.poseT + dt * (u._rate - 1));
  }
});
/* ---------- 숨쉬기 (서 있는 그림이 한 장이라 아주 살짝) ---------- */
const M10_BREATH = new Set(['idle', 'ready', 'guard', 'crouch', 'rest', 'rest2', 'rest3']);
const _updateSpriteM10 = updateSprite;
updateSprite = function(u, dt){
  _updateSpriteM10(u, dt);
  if (!u.S || !u.S.m10 || u.dead || u.downed || u.lying || !M10_BREATH.has(u.pose)) return;
  const sy = 1 + Math.sin((G.t + (u.uid || 0) * 0.37) * 2.2) * 0.012;
  u.mesh.scale.y *= sy; u.mesh.position.y *= sy;
};

/* ---------- 원정: 모닥불 곁에서 쉬는 무리 ---------- */
const M10_CAMP = { fight: 5, stairs: 4, treasure: 3 };   // 방 종류마다 열에 몇 방
const _fillRoomM10 = fillRoom;
fillRoom = function(r, gen){
  const before = new Set(G.units);
  _fillRoomM10(r, gen);
  const P = M10_CAMP[r.type]; if (!P || r.build === 'tower' || r.top || (r.id * 7 + gen.F * 3) % 10 >= P) return;   // 시드 순서를 건드리지 않게 방 번호로 고름
  const band = 'r' + r.id, m = G.map, mob = G.units.filter(u => !before.has(u) && u.band === band && u.S.m10 && !u.post);
  if (mob.length < 2) return;
  let x, z, spots = null;
  for (const [dx, dz] of [[0, 0], [2, 0], [-2, 0], [0, 2], [0, -2], [2, 2], [-2, -2]]){   // 가운데부터 (계단 · 상자가 있으면 옆으로)
    x = Math.round(r.cx) + dx; z = Math.round(r.cz) + dz; const h0 = heightAt(m, x, z);
    if (solidAt(m, x, z) || G.units.some(u => !mob.includes(u) && Math.hypot(u.x - x, u.z - z) < 1.2) || (G.inspect || []).some(o => Math.hypot(o.x - x, o.z - z) < 1.4)) continue;
    const sp = mob.map((u, i) => { const a = i / mob.length * Math.PI * 2 + 0.5, R = 1.3 + (i % 2) * 0.35, px = x + Math.cos(a) * R, pz = z + Math.sin(a) * R;
      return solidAt(m, px, pz) || Math.abs(heightAt(m, px, pz) - h0) > 0.3 || (G.inspect || []).some(o => Math.hypot(o.x - px, o.z - pz) < 0.9) ? null : { u, px, pz, pose: ['rest', 'rest2', 'rest3'][i % 3] }; }).filter(Boolean);
    if (sp.length >= 2 && mob.every(u => sp.some(o => o.u === u) || Math.hypot(u.x - x, u.z - z) > 1.0)){ spots = sp; break; }   // 못 앉는 놈이 불 자리에 서 있지 않게
  }
  if (!spots) return;   // 둘레에 앉을 자리가 모자라면 모닥불 없이
  const f = makeFire(m, x, z); f.light.visible = false; m.fires.push(f); m.solid[z * m.w + x] = 1;   // 빛은 원정 빛 (addSource) 으로만 — 실제 빛을 늘리면 느려짐
  if (typeof addSource === 'function') addSource(x, z, 4.5, 0xffa050, 0.9, 1);
  for (const { u, px, pz, pose } of spots){
    u.x = px; u.z = pz; u.y = heightAt(m, px, pz); u.home = { x: px, z: pz };
    u.aim = Math.atan2(z - pz, x - px); faceToward(u, x - px, z - pz);
    u.camp = { x, z, pose };
  }
};
// 쉬는 동안: 가까이 와야 알아챔 (평소 5.5칸 · 활 9칸 → 3칸 · 4.5칸). 깨면 웅크렸다 일어남
const _enemyThinkM10 = enemyThink;
enemyThink = function(u, dt){
  if (u.camp && !u.lock){
    if (u.alert){ u.camp = null; if (u.st === 'idle'){ u.st = 'hurt'; u.stT = 0.45; u._wake = true; _setPoseM10(u, 'crouch'); } }
    else if (!(typeof SQ !== 'undefined' && SQ.on)){
      u.moving = false; u.scanT = (u.scanT || 0) - dt;
      if (u.scanT <= 0){ u.scanT = 0.3; const t = allies().find(a => !a.dead && !a.downed && dist(a, u) < (u.D.bow ? 4.5 : 3) && sees(u, a)); if (t) alertGroup(u, t); }
      return;
    }
  }
  return _enemyThinkM10(u, dt);
};
