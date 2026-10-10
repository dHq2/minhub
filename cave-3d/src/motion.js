/* motion.js v1.5 — (v1.5, v0.85: 4기 적 · 1기 영웅 새 동작 (foe4.js, S.foe4 — 청승 · 작약 · 장군님 · 눈깔괴물 · 벤킨 · 곤봉 거한 · GOOD WILL · 청광묵 · 비나): 넘어졌다 일어나면 무릎 · 막으면 방어 그림 · 방어 자세 (거한) = 방어 · 들이받기 = 달리기 · 도약 = 점프 · 기본 공격 그림 번갈아 (attackB · attack2 · attack3) · 인물마다 딴짓 (S.fidget) · 오래 가만히 있으면 앉거나 쉼 (S.rest — 동료 10초 · 안 들킨 적 12초, 깨면 잠깐 무릎)) (v1.4, v0.82: 광냥 = 검냥이 (민수 메모로 합침) — 광냥 대기는 검냥이의 움직이는 대기 그림 (평소 차분한 대기 20장 · 싸움 중 대기 12장) · 여러 장 움직이는 대기는 숨쉬기 흔들림을 안 더함) (v1.3, v0.80 동작 점검 (녹화 32판 · 넘김판으로 직접 봄): ① 모든 인물 (영웅 · 적 · 2 · 3기) 걷기 · 달리기 그림이 따로 있으면 움직일 때 그 그림 — 전엔 서 있는 그림으로 미끄러짐 ② 출발 · 멈춤 · 달리기 · 뒷모습에 여유 (0.08 ~ 0.2초) — 걷기 ↔ 서 있음이 한두 장씩 깜빡이던 것 ③ 상대를 보며 물러서면 걷기 장을 거꾸로 (뒷걸음) ④ 맞으면 움찔 — 맞음 그림이 있으면 잠깐 그 그림 (2가지면 번갈아), 없으면 몸을 뒤로 젖힘 ⑤ 걷기 그림인데 0.3초 넘게 제자리면 서 있음 (싸움이 끝나면 제자리 걷기하던 것) ⑥ 걷기 그림 없는 영웅 · 적도 걸을 때 출렁 ⑦ 장판을 피할 때 적을 본 채 깡충 물러섬 ⑧ 싸움 없이 오래 서 있으면 가끔 다른 대기 그림 (idle2 · 담배 · 도발 …) ⑨ 예고 · 공격 그림이 없는 영웅 · 적도 움츠렸다 쭉 뻗음 (2 · 3기와 같게) ⑩ 넘어지거나 휘청이면 하던 기술 그림 대신 누운 · 맞음 그림 ⑪ 공격 그림이 여럿이면 (공격B · 공격2 · 공격3) 기본 공격 때 번갈아)
   v1.2 — (v1.2, v0.78: 앉은 그림이 여러 장인 동료 (테헤라 — 바위에 앉아 쉼) 는 둘레에 적 없이 8초 가만히 있으면 앉음 · 따라가기 중 think 의 기본 자세 (서 있음 · 걷기) 가 이 파일이 고른 자세 (달리기 · 뒷걸음 · 쉼) 를 매 장 덮어 첫 장에 멈추던 것 고침) (v1.1, v0.77: 2 · 3기 새 동작 프레임 (h2_mov.js) 이 있는 인물 (S.mov) 도 — 서 있음 · 걷기 · 달리기 · 앞뒤 걷기 · 맞음 · 기절 · 넘어짐만 고름, 기술 그림은 h2.js 그대로)
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
// v1.4 (v0.82) 광냥 = 검냥이 (민수 메모로 합침): 대기는 검냥이의 움직이는 대기 — 평소 '차분한 대기' 20장 (tools/gwangnyang_idle.py) · 싸움 중 '대기' 12장. 키는 잡몹 시트 대기 (298px) 에 맞춤
const M10_IDLE = { gwangnyang: {
  idle: { src: 'art/foe/gwangnyang_calm.webp', w: 112, h: 360, cols: 10, rows: 2, n: 20, from: 0, count: 20, fps: 8, ax: 64, ay: 356, f: 1, scale: 298 / 356 },
  ready: { from: 'catw', pose: 'idle', fps: 10, scale: 298 / 352 } } };
for (const [k, o] of Object.entries(M10_IDLE)){
  const S = SPR[k]; if (!S || !S.m10) continue;
  for (const [p, d] of Object.entries(o)){ const O = d.pose && SPR[d.from] && SPR[d.from].poses[d.pose]; S.poses[p] = O ? { ...O, fps: d.fps || O.fps, scale: d.scale } : { ...d }; }
}

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
  if (p === 'attack') return atkAlt(u);   // v1.3 공격 그림이 여럿이면 번갈아 (attackB · attack2 · attack3)
  return p;
}
// v1.3 기본 공격 그림 돌려 쓰기: 공격 · 공격B · 공격2 · 공격3 중 따로 있는 것 (같은 순간 여러 번 불려도 0.25초는 그대로)
const ATK_ALT = ['attack', 'attackB', 'attack2', 'attack3'];
function atkAlt(u){
  const Q = u.S.poses, L = ATK_ALT.filter((k, i) => Q[k] && (i === 0 || !sameImg(Q[k], Q.attack)));
  if (L.length < 2) return 'attack';
  if (L.includes(u.pose) && u.poseT < 0.25) return u.pose;
  u._ak = (u._ak || 0) + 1; return L[u._ak % L.length];
}
const _setPoseM10 = setPose;
setPose = function(u, p){
  if (u && u.S && !u.lock && u.st === 'idle' && u._mw && u.pose === u._mw && (p === 'idle' || p === 'walk' || p === 'run')) return;   // v1.2 이 파일이 고른 자세를 기본 자세 (생각이 매 장 부르는 서 있음 · 걷기 · 달리기) 가 덮지 않게 (같은 장에 다시 고름)
  return _setPoseM10(u, u && u.S ? (u.S.m10 ? m10Map(u, p) : u.S.mov ? movMap(u, p) : p === 'attack' && u.D && (u.D.h2 || u.S.foe4) ? atkAlt(u) : p) : p);   // v1.5 새 동작 인물 (foe4) 도 공격 그림 번갈아
};

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
  if (tgt && tgt.S && (tgt.S.m10 || tgt.S.foe4 && tgt.S.poses.guard) && tgt.D.block && !o.pierce && !tgt.dead && !tgt.downed){   // v1.5 벤킨 (막기) 도
    const s = o.from || att; if (s) blk = Math.abs(angDiff(Math.atan2(s.z - tgt.z, s.x - tgt.x), tgt.aim)) <= 1.9;
  }
  const r = _hurtM10(att, tgt, base, o);
  if (blk && r > 0 && !tgt.dead && tgt.st === 'idle') tgt._guardT = G.t + 0.45;
  // v1.3 움찔: 서 있거나 걷다 맞으면 (치는 중 · 휘청 중은 아님) 몸을 뒤로 젖히고, 맞음 그림이 있으면 잠깐 그 그림
  if (r > 0 && tgt && !tgt.dead && !tgt.downed && !tgt.lying && !tgt.lock && tgt.kind !== 'player' && !tgt.D.boss && !o.dot && tgt.st === 'idle' && !(tgt._guardT > G.t)){
    tgt._flS = G.t;
    const Q = tgt.S.poses;
    if (Q.hurt && !sameImg(Q.hurt, Q.idle) && !Q.hurt.flat && (!tgt._mvOn || (o.kb || 0) >= 1.2 || o.crit)) tgt._flT = G.t + (o.crit || r >= 30 ? 0.34 : 0.24);
  }
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
  if (st === 'idle' && G.t < (u._flT || 0)) return M10_HURT.has(u.pose) ? null : flinchPose(u);   // v1.3 움찔
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
  if (u._dodgeT > G.t) return u.alert || u.side === 'ally' ? 'ready' : 'idle';   // v1.3 깡충 물러섬
  if (u._mvOn){
    const bp = backpedal(u), fast = runOn(u, dt, !bp && (u.alert || u.side === 'ally'));
    u._rate = (bp ? -1 : 1) * Math.max(0.6, Math.min(1.3, u._msp / Math.max(0.5, u.spd)));   // 빠르기에 맞춰 재생 속도 · 뒷걸음은 거꾸로
    return fast && Q.run ? 'run' : 'walk';
  }
  if (u.side === 'enemy') return u.alert ? 'ready' : 'idle';
  if ((u._rdT = (u._rdT || 0) - dt) <= 0){ u._rdT = 0.5; u._rdy = G.units.some(e => e.side === 'enemy' && !e.dead && !e.downed && dist(e, u) < 9); }
  return u._rdy ? 'ready' : 'idle';
}
// 2 · 3기: 이 파일이 다루는 자세일 때만 (사격 · 막기 · 기술 그림은 건드리지 않음)
const KEEP_LY = new Set(['curl', 'groundGuard', 'clinch', 'sleep']);   // v1.3 넘어짐 · 휘청 중에도 그대로 두는 그림 (레슬링 · 웅크림 · 잠)
const MOV_OWN = new Set(['idle', 'ready', 'walk', 'walkB', 'run', 'hurt', 'hurt2', 'stun', 'kneel', 'down', 'sit', 'idle2', 'idle3', 'smoke', 'taunt', 'stance', 'talk', 'salute']);
const _camF = new THREE.Vector3(), _camR = new THREE.Vector3();
// v1.3 같은 그림인지 (2 · 3기는 없는 동작을 서 있는 그림으로 채워 둠)
const sameImg = (a, b) => a === b || !!(a && b && a.src === b.src && String(a.rect) === String(b.rect) && (a.n || 0) === (b.n || 0) && (a.from || 0) === (b.from || 0));
const ownImg = (Q, k) => Q[k] && !sameImg(Q[k], Q.idle);
// v1.3 움직임 판정 — 출발은 0.08초, 멈춤은 0.16초 이어져야 바뀜 (걷기 ↔ 서 있음 한두 장 깜빡임 막기)
function mvOn(u, dt){
  const on = !!u._mvOn, want = !!u.moving && (u._msp || 0) > (on ? 0.18 : 0.45);
  if (want === on) u._mvT = 0;
  else if ((u._mvT = (u._mvT || 0) + dt) >= (want ? 0.08 : 0.16)){ u._mvOn = want; u._mvT = 0; }
  return !!u._mvOn;
}
// 달리기: 제 속도의 88% 넘으면 · 70% 아래로 떨어지면 (0.15초 이어져야)
function runOn(u, dt, can){
  const on = !!u._runOn, want = !!can && (u._msp || 0) > u.spd * (on ? 0.7 : 0.88);
  if (want === on) u._rnT = 0;
  else if ((u._rnT = (u._rnT || 0) + dt) >= 0.15){ u._runOn = want; u._rnT = 0; }
  return !!u._runOn;
}
// 뒷모습 걷기 (카메라에서 멀어짐): 들어갈 땐 0.45 · 나올 땐 0.2 (0.2초 이어져야)
function backOn(u, dt){
  let want = false;
  if (u._mv){ camera.getWorldDirection(_camF); const l = Math.hypot(_camF.x, _camF.z) || 1; want = (u._mv.x * _camF.x + u._mv.z * _camF.z) / l > (u._bkOn ? 0.2 : 0.45); }
  if (want === !!u._bkOn) u._bkT = 0;
  else if ((u._bkT = (u._bkT || 0) + dt) >= 0.2){ u._bkOn = want; u._bkT = 0; }
  return !!u._bkOn;
}
// 뒷걸음: 화면에서 보는 쪽과 반대로 움직임 (상대를 보며 물러섬) → 걷기 장을 거꾸로
function backpedal(u){
  if (!u._mv) return false;
  _camR.set(1, 0, 0).applyQuaternion(camera.quaternion);
  const sx = u._mv.x * _camR.x + u._mv.z * _camR.z;
  return u._bp = Math.abs(sx) > 0.35 && Math.sign(sx) !== (u.fS ?? u.face);
}
// 싸움 중인지 (적은 들킴 · 동료는 9칸 안에 적)
function warOf(u, dt){
  if (u.side === 'enemy') return !!u.alert;
  if ((u._rdT = (u._rdT || 0) - dt) <= 0){ u._rdT = 0.5; u._rdy = G.units.some(e => e.side === 'enemy' && !e.dead && !e.downed && dist(e, u) < 9); }
  return !!u._rdy;
}
// v1.3 싸움 없이 오래 서 있으면 가끔 다른 대기 그림 (6 ~ 12초마다, 1.6 ~ 2.8초 · 여러 장이면 두 번 돎)
const FIDGET = ['idle2', 'idle3', 'smoke', 'taunt', 'talk', 'stance', 'salute'];
function fidget(u){
  const Q = u.S.poses;
  if (u._fid){ if (G.t < u._fid.until && Q[u._fid.p]) return u._fid.p; u._fid = null; u._fidAt = G.t + rnd(6, 12); return 'idle'; }
  if (u._fidAt == null) u._fidAt = G.t + rnd(3, 9);
  if (G.t < u._fidAt) return null;
  const L = [...new Set([...FIDGET, ...(u.S.fidget || [])])].filter(k => ownImg(Q, k));   // v1.5 인물마다 딴짓 (S.fidget — 청광묵 냠냠 · 붕대 감기 …)
  if (!L.length){ u._fidAt = G.t + 60; return null; }
  const k = L[Math.floor(Math.random() * L.length)], P = Q[k], len = P.n ? (P.count || P.n) / (P.fps || 8) * (P.once ? 1 : 2) : rnd(1.6, 2.8);
  u._fid = { p: k, until: G.t + Math.max(1.2, len) }; return k;
}
// 움찔 그림: 맞음 2가지면 번갈아
const flinchPose = u => (u._hk = !u._hk) && ownImg(u.S.poses, 'hurt2') ? 'hurt2' : 'hurt';
function movWant(u, dt){
  const Q = u.S.poses, st = u.st;
  u._rate = 1;
  if (u.lying && Q.down && Q.down.flat){ u._wasLying = true; return KEEP_LY.has(u.pose) || u.pose === 'down' ? null : 'down'; }   // v1.3 치던 그림 그대로 눕지 않게
  if (st === 'hurt' || st === 'stun' || st === 'held'){
    if (st === 'held' ? !MOV_OWN.has(u.pose) : KEEP_LY.has(u.pose)) return null;   // v1.3 맞아 끊기면 하던 기술 그림 대신 맞음 (잡기가 정한 그림은 그대로)
    if (u._wasLying && Q.kneel) return 'kneel';
    if (st === 'stun' && Q.stun) return 'stun';
    return M10_HURT.has(u.pose) ? null : movMap(u, 'hurt');
  }
  u._wasLying = false;
  if (st !== 'idle' || !MOV_OWN.has(u.pose)){ u._stillT = 0; u._fid = null; return null; }
  if (G.t < (u._flT || 0)) return M10_HURT.has(u.pose) ? null : flinchPose(u);   // v1.3 움찔
  const war = warOf(u, dt);
  if (u._dodgeT > G.t) return war && Q.ready ? 'ready' : 'idle';   // v1.3 깡충 물러섬 (적을 본 채)
  if (u._mvOn){
    u._stillT = 0; u._fid = null;
    const bp = backpedal(u), fast = runOn(u, dt, !bp && (u.alert || u.side === 'ally'));
    u._rate = (bp ? -1 : 1) * Math.max(0.6, Math.min(1.3, u._msp / Math.max(0.5, u.spd)));
    if (Q.walkB && !bp && backOn(u, dt)) return 'walkB';   // 카메라에서 멀어짐 = 뒷모습
    return fast && Q.run ? 'run' : 'walk';
  }
  if (war){ u._stillT = 0; u._fid = null; return Q.ready ? 'ready' : 'idle'; }
  if (u.side === 'ally' && Q.sit && Q.sit.n > 1 && (u._stillT = (u._stillT || 0) + dt) > 8) return 'sit';   // v1.2 오래 가만히 → 앉아 쉼
  return fidget(u) || 'idle';
}
// v1.3 그 밖 인물 (영웅 · 적 · 새 동작 프레임 없는 2 · 3기): 걷기 · 달리기 그림이 따로 있으면 움직일 때 그 그림 · 싸움 중엔 공격 대기 그림 (있으면) · 앉은 그림이 여러 장인 동료 (테헤라) 는 오래 가만히 있으면 앉음
const LOCO_OWN = new Set(['idle', 'ready', 'walk', 'run', 'hurt', 'hurt2', 'stun', 'down', 'sit', 'idle2', 'idle3', 'smoke', 'taunt', 'stance', 'talk', 'salute']);
const locoOK = u => (u.side === 'ally' || u.side === 'enemy') && u.kind !== 'player' && !(u.D.boss && !u.D.h2) && !u.D.dummy && !(typeof kariusThink === 'function' && u.D.think === kariusThink);
// v1.5 새 동작 인물 (foe4) 이 이 파일에서 고른 자세 (무릎 · 방어 · 점프 · 쉼 · 딴짓) 도 '이 파일 것' 으로 봄 (다음 장에 서 있음 · 걷기로 돌아오게)
const f4Own = u => u.S.foe4 && (u.pose === 'kneel' || u.pose === 'guard' || u.pose === 'jump' || (u.S.rest || []).includes(u.pose) || (u.S.fidget || []).includes(u.pose));
function locoWant(u, dt){
  const Q = u.S.poses, F4 = !!u.S.foe4;
  u._rate = 1;
  // 넘어짐 · 휘청: 하던 기술 그림 대신 누운 그림 (없으면 맞음 그림을 눕힘) · 맞음
  if (u.lying && (u.tripT || u.st === 'hurt')){ u._stillT = 0; u._restP = null; if (KEEP_LY.has(u.pose)) return null;   // 쉬려고 누운 것 (레베카 굴) 은 그대로
    if (F4 && Q.down && Q.down.flat) u._wasLying = true;
    const p = Q.down && Q.down.flat ? 'down' : Q.hurt ? 'hurt' : 'idle'; return u.pose === p ? null : p; }
  if (u.st === 'hurt' || u.st === 'stun'){ u._stillT = 0; u._restP = null;
    if (F4 && u._wasLying && ownImg(Q, 'kneel')) return u.pose === 'kneel' ? null : 'kneel';   // v1.5 넘어졌다 일어나는 중 = 무릎
    return KEEP_LY.has(u.pose) || M10_HURT.has(u.pose) ? null : u.st === 'stun' && Q.stun ? 'stun' : Q.hurt ? 'hurt' : 'idle'; }
  if (F4){
    u._wasLying = false;
    const st = u.st, want = st === 'guardStance' ? 'guard' : st === 'charge' ? 'run' : st === 'leap' ? 'jump' : null;   // v1.5 거한 방어 자세 · 들이받기 · 궁수식 도약
    if (want && ownImg(Q, want)){ u._restP = null; return u.pose === want ? null : want; }
  }
  if (u.st !== 'idle' || !(LOCO_OWN.has(u.pose) || F4 && f4Own(u))){ u._stillT = 0; u._fid = null; u._restP = null; return null; }
  if (F4 && G.t < (u._guardT || 0) && ownImg(Q, 'guard')) return 'guard';   // v1.5 앞에서 막음 (벤킨)
  if (G.t < (u._flT || 0) && Q.hurt) return u.pose === 'hurt' || u.pose === 'hurt2' ? null : flinchPose(u);   // 움찔
  const war = warOf(u, dt), rdy = war && ownImg(Q, 'ready') ? 'ready' : 'idle';
  if (F4 && u.S.rest){   // v1.5 오래 가만히 (동료 10초 · 안 들킨 적 12초) → S.rest 중 하나로 앉거나 쉼 (움직이거나 싸움이 붙을 때까지). 깨면 잠깐 무릎
    if (war || u._mvOn || u._dodgeT > G.t){ if (u._restP){ u._restP = null; u._stillT = 0; if (ownImg(Q, 'kneel')) u._wakeT = G.t + 0.35; } }
    else if (u._restP && ownImg(Q, u._restP)) return u._restP;
    else if ((u._stillT = (u._stillT || 0) + dt) > (u.side === 'ally' ? 10 : 12)){ const L = u.S.rest.filter(k => ownImg(Q, k)); u._stillT = 0; if (L.length){ u._fid = null; return u._restP = L[Math.floor(Math.random() * L.length)]; } }
  }
  if (F4 && G.t < (u._wakeT || 0)) return 'kneel';
  if (u._dodgeT > G.t) return rdy;
  if (u._mvOn){
    u._stillT = 0; u._fid = null;
    const bp = backpedal(u), fast = runOn(u, dt, !bp && (u.alert || u.side === 'ally'));
    u._rate = (bp ? -1 : 1) * Math.max(0.6, Math.min(1.3, u._msp / Math.max(0.5, u.spd)));
    if (fast && ownImg(Q, 'run')) return 'run';
    if (ownImg(Q, 'walk')) return 'walk';
    return rdy;   // 걷기 그림이 없으면 서 있는 그림 + 출렁임 (h2.js · 아래 그리기)
  }
  if (war){ u._stillT = 0; u._fid = null; return rdy; }
  if (!(F4 && u.S.rest) && u.side === 'ally' && Q.sit && Q.sit.n > 1 && (u._stillT = (u._stillT || 0) + dt) > 8) return 'sit';   // v1.2 테헤라: 바위에 앉아 쉼
  return fidget(u) || 'idle';
}
TICKS.push(dt => {
  for (const u of G.units){
    if (!u.S || u.dead || u.downed || u.lock){ if (u) u._mw = null; continue; }
    const dx = u._mp ? u.x - u._mp.x : 0, dz = u._mp ? u.z - u._mp.z : 0, sp = Math.hypot(dx, dz) / Math.max(dt, 1e-3); u._mp = { x: u.x, z: u.z };
    if (sp > 0.2) u._mv = { x: dx / (sp * Math.max(dt, 1e-3)), z: dz / (sp * Math.max(dt, 1e-3)) };   // 움직이는 쪽 (단위)
    u._msp = (u._msp || 0) + (Math.min(sp, 12) - (u._msp || 0)) * Math.min(1, dt * 10);
    mvOn(u, dt);
    const k = u.S.m10 ? 1 : u.S.mov ? 2 : locoOK(u) ? 3 : 0;
    if (!k){ u._mw = null; continue; }
    const p = k === 1 ? m10Want(u, dt) : k === 2 ? movWant(u, dt) : locoWant(u, dt);
    u._mw = p && u.S.poses[p] ? p : null;
    if (u._mw) _setPoseM10(u, p);
    if (u.pose === 'walk' || u.pose === 'walkB' || u.pose === 'run') u.poseT += dt * ((u._rate ?? 1) - 1);   // 빠르기에 맞춰 · 뒷걸음은 거꾸로 (units.js 가 음수 장도 돌림)
  }
});
/* ---------- 숨쉬기 (서 있는 그림이 한 장이라 아주 살짝) ---------- */
const M10_BREATH = new Set(['idle', 'ready', 'guard', 'crouch', 'rest', 'rest2', 'rest3']);
const LOCO_P = new Set(['walk', 'walkB', 'run']);
const _updateSpriteM10 = updateSprite;
updateSprite = function(u, dt){
  _updateSpriteM10(u, dt);
  if (!u.S || u.dead) return;
  // v1.3 걷기 그림인데 0.3초 넘게 제자리 (싸움이 끝나 생각이 멈춤 · 막힘) → 서 있음
  if (u.kind !== 'player' && !u.lock && LOCO_P.has(u.pose)){
    const q = u._sq || (u._sq = { x: u.x, z: u.z, t: 0 });
    if (Math.hypot(u.x - q.x, u.z - q.z) > 0.08){ q.x = u.x; q.z = u.z; q.t = 0; }
    else if ((q.t += dt) > 0.3){ q.t = 0; u.moving = false; u._mvOn = false; _setPoseM10(u, u.S.poses.ready && (u.alert || u._rdy) ? 'ready' : 'idle'); }
  }
  if (u.downed || u.lying) return;
  const f = -(u.fS ?? u.face), H = Math.min(1.6, u.S.tall);
  // 숨쉬기 (잡몹 10명: 서 있는 그림이 한 장이라 아주 살짝 · 여러 장 움직이는 대기 (광냥) 는 빼고)
  if (u.S.m10 && M10_BREATH.has(u.pose) && !((u.S.poses[u.pose] || {}).n > 1)){ const sy = 1 + Math.sin((G.t + (u.uid || 0) * 0.37) * 2.2) * 0.012; u.mesh.scale.y *= sy; u.mesh.position.y *= sy; }
  // v1.3 걷기 그림이 없는 (또는 한 장인) 영웅 · 적: 걸을 때 출렁 + 앞으로 기울임 (2 · 3기는 h2.js 가 함)
  else if (!u.D.h2 && !u.S.m10 && u.kind !== 'player' && u.st === 'idle' && u._mvOn && (u.lift || 0) < 0.05 && !((u.jy || 0) > 0.05) && !(u._dodgeT > G.t) && (u.pose === 'idle' || u.pose === 'ready' || (LOCO_P.has(u.pose) && !(u.S.poses[u.pose] || {}).n))){
    const t = (G.t + (u.uid || 0) * 0.31) * (u._runOn ? 11 : 8.5);
    u.pivot.position.y += Math.abs(Math.sin(t)) * 0.05 * H; u.pivot.rotation.z += (u._bp ? -0.035 : 0.05) * f + Math.sin(t) * 0.02;
  }
  // v1.3 예고 · 침 · 휘청 그림이 없는 영웅 · 적 (서 있는 그림으로 칠 때): 예고 = 움츠리며 뒤로 젖힘 → 침 = 앞으로 쭉 · 휘청 = 떨림 (2 · 3기는 h2.js 가 함)
  if (u.st !== u._pst){ u._pst = u.st; u._stAt = G.t; }
  if (!u.D.h2 && !u.S.m10 && u.kind !== 'player' && (u.pose === 'idle' || u.pose === 'ready')){
    const e = G.t - (u._stAt ?? G.t), A = !!u.S.poses.attack;
    let sy = 1, sx = 1, rz = 0;
    if (u.st === 'windup'){ const k = Math.min(1, e / 0.3); sy = 1 - 0.07 * k; sx = 1 + 0.045 * k; rz = (A ? -0.1 : -0.03) * k * f; }   // 공격 그림도 없으면 기울임은 windup() 의 lean 이 더함
    else if (u.st === 'strike'){ const k = Math.max(0, 1 - e / 0.25); sy = 1 + 0.06 * k; sx = 1 - 0.035 * k; rz = (A ? 0.16 : 0.06) * k * f; }
    else if (u.st === 'hurt' && !u.S.poses.hurt) rz = Math.sin(G.t * 60) * 0.05;
    if (sy !== 1){ u.mesh.scale.y *= sy; u.mesh.position.y *= sy; u.mesh.scale.x *= sx; u.mesh.position.x *= sx; }
    u.pivot.rotation.z += rz;
  }
  // v1.3 깡충 물러섬 (장판 피하기 · 뒤로 빠지기): 적을 본 채 작게 뛰며 뒤로 젖힘
  if (u._dodgeT > G.t - 0.05 && u._dodgeS != null){
    const k = G.t - u._dodgeS;
    u.pivot.position.y += Math.abs(Math.sin(k * Math.PI / 0.3)) * 0.13 * H; u.pivot.rotation.z += -0.09 * f;
  }
  // v1.3 움찔: 뒤로 젖혔다 돌아옴 (0.2초)
  const fk = u._flS != null ? 1 - (G.t - u._flS) / 0.2 : 0;
  if (fk > 0 && fk <= 1){ u.pivot.rotation.z += -0.11 * f * fk; u.mesh.scale.x *= 1 + 0.04 * fk; u.mesh.position.x *= 1 + 0.04 * fk; u.mesh.scale.y *= 1 - 0.04 * fk; u.mesh.position.y *= 1 - 0.04 * fk; }
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
