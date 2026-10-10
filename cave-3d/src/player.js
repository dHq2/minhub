/* player.js v0.88 — (v0.88: 몸이 망가지면 못 하는 동작 (maim.js INJ — 점프 · 달리기 · 구르기 · 슬라이딩 · 태클 · 잡기 · 막기, 키를 누르면 머리 위에 이유) · 쉬운 키 (민수) — 달리면서 Q = 슬라이딩 (Shift+G 도 그대로) · F 를 톡 치면 방어를 올린 채 둠 (다시 F · 공격 · 구르기 · 스킬 · 점프면 내림, 누르고 있기도 그대로) · 휠 클릭 누르고 있기 = 방어. 앉아쏴: 총 · 활 · 마법을 든 채 G 로 숙이고 쏘거나 조준 — 낮은 몸 · 덜 흔들림 · 치명 · 헤드샷 ↑) (v0.87: 드롭킥이 날아감 (적뢰 날아차기처럼 예고선 → 4.4칸 직선 비행), 발끝에 걸리면 빠아악! (확정 치명 · 크게 날림), 몸통 쪽은 보통. 던진 뒤 그림) (v0.86: 드롭킥 세 프레임 (뛰어오름 → 중간 → 마지막) · 치명이면 화면 · 기기 진동, 숙여 피한 뒤 J는 어퍼컷 (숙인 채라도), 격투 기술이 대련 더미에도) (v0.85: 굴 (로비)에서도 숙이기 · 슬라이딩 · 태클 · 잡기 · 다리후리기 (짐을 들었으면 G는 내려놓기). 뛰어오름 · 플라잉 니킥 · 드롭킥 (달리며 점프 중 J → 착지하며 뒹굶) · 발목 부수기 (넘어진 놈에게 J) · 구르기 뒤 프레임 · 짐 들기 · 손 들기) (v0.84: 무에타이 — 맨손 막기는 무릎 들고 머리 감쌈, 서 있을 땐 무에타이 자세, 점프 중 J는 날아 무릎) (v0.83: 구르기 · 점프 · 복싱 스텝 · 앉아 쉬기 그림, 다리후리기 (G+공격) · 슬라이딩 (달리며 G)) (v0.82: 쓰러지면 웅크림 자세 · poseHold (잠 · 죽음 연출 자세)) (v0.81: 레슬링 — 잡혀 있으면 grapple.js가 맡음 · V 잡기) 인주 직접 조작 (v0.8: 공격 · 스킬은 weapons.js가 무기마다 맡음. 여기는 이동 · 구르기 · 점프 · 방어)
   WASD 이동 (카메라 기준) · Shift 달리기 · Space 점프 (바닥 공격을 넘음 · 바위를 넘음 · 높은 곳에 오름)
   좌클릭/J 찌르기 (3연격, 3타째는 강공) · Q 구르기 (무적 0.3초) · F 누르고 있기 = 방어 (앞에서 오는 것 70% 줄임, 맞기 직전 0.2초 안에 올리면 튕겨냄)
   우클릭/K 누르고 있기 → 놓으면 투창. 적 위에서 누르면 그 적을 정조준 (핀포인트), 아니면 마우스 쪽 · 마우스를 안 쓰면 앞의 가까운 적
   완벽: 게이지가 다 차기 직전 0.065초 (약 5%) 안에 놓기. 다 차면 그냥 던져짐 (완벽 아님)
   앉기: 자세 (u.posture = 'stand' | 'crouch')만 마련해 둠. 몸 키 (bodyH)가 자세를 따름 → 나중에 Ctrl로 붙이면 됨 */
'use strict';
const THROW = { full: 1.25, perfect: 0.065, speed: 26, range: 13 };
const P = { spear: true, spearObj: null, combo: 0, comboT: 0, atkCd: 0, dodgeCd: 0, charge: 0, aiming: false, ghostT: 0 };
const JUMP = { v: 5.8, g: 16 };

function aimPoint(u){
  if (mouse.inside && G.t - mouse.moved < 4){ const g = screenToGround(mouse.x, mouse.y, UI.W, UI.H, u.y); if (g) return g; }
  return null;
}
// 마우스가 적의 그림 (발 ~ 머리, 날고 있으면 하늘에 있는 그 그림) 위에 있나: 화면에서 그림 상자로 판단
function mouseOverEnemy(){
  if (!mouse.inside) return null;
  let best = null, bd = 1e9;
  for (const e of G.units){
    if (e.side !== 'enemy' || e.dead) continue;
    const base = e.y + (e.lift || 0) + (e.jy || 0), f = toScreen(e.x, base, e.z, UI.W, UI.H), h = toScreen(e.x, base + bodyH(e), e.z, UI.W, UI.H);
    if (f.behind) continue;
    const hh = Math.max(30, f.y - h.y), hw = Math.max(22, hh * 0.32);
    if (mouse.x < f.x - hw || mouse.x > f.x + hw || mouse.y < h.y - 10 || mouse.y > f.y + 12) continue;
    let d = Math.abs(mouse.x - f.x) + Math.abs(mouse.y - (f.y + h.y) / 2) * 0.5;
    if (e.airborne || (e.lift || 0) > 0.5) d *= 0.6;   // 겹쳐 보이면 나는 적 쪽 (위를 가리키면 자연스럽게 공중)
    if (d < bd){ bd = d; best = e; }
  }
  return best;
}
// 점프 · 낙하 (모든 인물 공통: jy = 땅에서 뜬 높이)
function updateJump(u, dt){
  if (!u.jv && !u.jy) return;
  u.jv -= JUMP.g * dt; u.jy = Math.max(0, (u.jy || 0) + u.jv * dt);
  if (u.jy <= 0 && u.jv < 0){ u.jy = 0; u.jv = 0; u.airAtk = false; dust(u.x, u.z, 4); if (u.dropLand){ u.dropLand = false; u.dropT = 0; if (u.S.poses.rollUp){ u.st = 'dropFall'; u.stT = 0.6; } } }   // 드롭킥 뒤 등으로 떨어짐
}
// 화면 기준 입력 → 세계 방향 (카메라가 돌아도 W는 늘 화면 위)
function inputDir(){
  let ix = 0, iy = 0;
  if (down('KeyW') || down('ArrowUp')) iy += 1; if (down('KeyS') || down('ArrowDown')) iy -= 1;
  if (down('KeyA') || down('ArrowLeft')) ix -= 1; if (down('KeyD') || down('ArrowRight')) ix += 1;
  if (!ix && !iy) return null;
  // 지금 화면 각도 그대로 (카메라가 도는 동안에도 매 순간 맞춰 바뀜) → W는 언제나 화면 위
  const y = CAM.yaw || 0, fx = -Math.sin(y), fz = -Math.cos(y), rx = Math.cos(y), rz = -Math.sin(y);
  return norm(rx * ix + fx * iy, rz * ix + fz * iy);
}
// v0.83 공중: 점프 그림 · 맨손으로 싸울 때 (원정 · 경계한 적이 9칸 안): 복싱 스텝 (통통 뜀은 units.js)
const airPose = u => u.dropLand && u.S.poses.dk1 ? (G.t - u.dropAt < 0.1 ? 'dk1' : G.t - u.dropAt < 0.25 ? 'dk2' : 'dk3') : G.t < (u.dropT || 0) && u.S.poses.slide ? 'slide' : G.t < (u.kneeT || 0) && u.S.poses.knee ? (u.S.poses.flyKnee && G.t > u.kneeT - 0.3 ? 'flyKnee' : 'knee') : u.S.poses.hop && u.jv > 2.6 ? 'hop' : u.S.poses.jump && u.jy > 0.08 ? 'jump' : 'run';
// 맨손: 맨손이거나, 창을 던져 손이 비었을 때
const fistNow = () => typeof W !== 'undefined' && W.def && (W.def.kind === 'fist' || (!P.spear && W.def.skill === 'throw'));
// v0.85 격투가 되는 곳: 원정 · 굴 (로비) · 옛 층. 굴에서 짐을 들고 있으면 G는 내려놓기라 막음
const fightMode = () => PLAY_MODES.has(G.mode) && !(typeof PRO !== 'undefined' && PRO.carry && G.mode !== 'exp');
// v0.87 드롭킥: 달리면서 (Shift) 점프한 채 J → 예고선과 함께 앞으로 날아감 (0.4초 · 4.4칸, 적뢰 날아차기처럼). 벽에 막히면 멈춤
//   발끝 (몸 앞 0.8칸 넘어)에 걸리면 빠아악! — 확정 치명 · 크게 날림 · 진동. 몸통 쪽에 붙어 맞으면 보통 (×1.2). 첫 놈에 꽂히면 거기서 멈춤
//   착지하면 등으로 떨어져 0.6초 못 움직임. 큰 놈 (보스 · 곤봉 거한 · 단달로)은 조금만 밀림
const DK = { t: 0.4, spd: 11, reach: 1.35, tip: 0.8 };
function dropKick(u){
  u.airAtk = true; u.dropT = G.t + DK.t; u.dropAt = G.t; u.dropLand = true; P.atkBuf = 0; P.atkCd = 0.5; setPose(u, u.S.poses.dk1 ? 'dk1' : 'slide');
  u.dk = { a: u.aim, hit: false }; u.jv = Math.max(u.jv || 0, 3.2);
  decal('line', { x: u.x, z: u.z, len: DK.spd * DK.t + DK.reach, w: 0.9, a: u.aim, dur: 0.16, color: 0xffcf80 });
  SFX.whoosh && SFX.whoosh(); dust(u.x, u.z, 6);
}
function dropTick(u, dt){
  const D = u.dk, ca = Math.cos(D.a), sa = Math.sin(D.a);
  if (!D.hit){
    const step = DK.spd * dt;
    if (solidAt(G.map, u.x + ca * (u.r + step), u.z + sa * (u.r + step))){ u.dropT = G.t; dust(u.x, u.z, 8); return; }   // 벽: 멈춤
    moveBy(u, ca * step, sa * step);
    if (Math.random() < 0.7) spark(u.x, u.y + 0.6 + (u.jy || 0), u.z, 0xffe2b0, 1, 1, 0.12, 0.1);
    for (const e of fightTargets()){
      if (e.dead || e.downed) continue;
      const dx = e.x - u.x, dz = e.z - u.z, along = dx * ca + dz * sa, perp = Math.abs(-dx * sa + dz * ca);
      if (along < -0.2 || along > DK.reach + e.r || perp > e.r + 0.5) continue;
      D.hit = true; dropHit(u, e, along >= DK.tip); break;
    }
  }
}
function dropHit(u, e, tip){
  const big = typeof tooBig === 'function' && tooBig(u, e), had = !!u.critNext || !!P.critNext;
  const o = { from: u, kb: big ? 0.6 : tip ? 7 : 4, stun: big ? 0 : tip ? 1.0 : 0.6, hitsAir: true, crit: tip || P.critNext ? true : undefined, critMul: tip ? 1.8 : 2 };
  hurt(u, e, u.atk * (tip ? 1.4 : 1.2), o); P.critNext = false;
  u.dropT = G.t; u.kx -= Math.cos(u.dk.a) * 3; u.kz -= Math.sin(u.dk.a) * 3;   // 꽂힌 반동으로 살짝 튕김
  if (tip){
    popText(e.x, e.y + bodyH(e) + 0.5, e.z, '빠아악!', 'crit', 1.3); ring(e.x, e.z, 0xffcf80, 2.4, 0.35); dust(e.x, e.z, 18);
    camShake(0.75, 0.42); G.hitstop = Math.max(G.hitstop, 0.16); buzz([70, 40, 120]);
    if (typeof clashLog === 'function') clashLog(`날아든 발끝이 ${e.D.name}에게 정통으로 꽂혔다 — 빠아악!`);
  } else {
    camShake(0.3, 0.2); G.hitstop = Math.max(G.hitstop, 0.08); if (o.crit || had){ camShake(0.6, 0.35); buzz(60); }
    if (typeof clashLog === 'function') clashLog(`너무 붙어서 몸으로 들이받았다.`);
  }
}
// 기기 진동 (휴대폰 · 되는 기기만)
function buzz(p){ try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
// v0.85 발목 부수기: 넘어진 놈 (다리후리기 · 슬라이딩)이 앞에 있으면 J가 짓밟기로 (×1.6 · 5초 느려짐)
function stompAnkle(u, e){
  P.atkBuf = 0; P.atkCd = 0.45; u.st = 'strike'; u.stT = 0.4; setAim(u, e.x, e.z); setPose(u, 'stomp');
  hurt(u, e, u.atk * 1.6, { from: u, kb: 0 });
  if (!e.dead){ addStatus(e, 'slow', { k: 0.5, t: 5 }); popText(e.x, e.y + 1.5, e.z, '발목이 부서졌다', 'crit', 1); }
  dust(e.x, e.z, 8); camShake(0.2, 0.15); SFX.thump(90, 0.4, 0.15); if (typeof clashLog === 'function') clashLog(`넘어진 ${e.D.name}의 발목을 짓밟았다.`);
}
// v0.84 날아 무릎: 맨손으로 점프 중 J → 앞으로 튀어 나가며 무릎 (점프 한 번에 한 번, 공중의 적도 맞음)
function flyingKnee(u){
  u.airAtk = true; u.kneeT = G.t + 0.4; P.atkBuf = 0; P.atkCd = 0.35; setPose(u, 'knee');
  u.kx += Math.cos(u.aim) * 4; u.kz += Math.sin(u.aim) * 4; u.jv = Math.max(u.jv || 0, 1.5);
  let n = 0;
  for (const e of fightTargets()) if (!e.dead && dist(e, u) < 1.6 + e.r && Math.abs(angDiff(Math.atan2(e.z - u.z, e.x - u.x), u.aim)) < 0.9){ hurt(u, e, u.atk * 1.3, { from: u, kb: 2, stun: e.D.heavy ? 0 : 0.5, hitsAir: true }); n++; }
  SFX.whoosh && SFX.whoosh(); if (n){ camShake(0.15, 0.12); if (typeof clashLog === 'function') clashLog('뛰어올라 무릎을 꽂았다.'); }
}
function boxing(u){ return fightMode() && u.S.poses.box && fistNow() && fightTargets().some(e => e.alert && !e.dead && dist(e, u) < 9); }
// v0.85 굴에서 짐 (가구 · 낙하물 · 돼지)을 들고 있으면 두 손으로 받쳐 듦
const carrying = u => u.S.poses.carry && typeof PRO !== 'undefined' && !!PRO.carry && G.mode !== 'exp';
// v0.83 E로 줍기 · 뒤지기 · 파기는 잠깐 쪼그려 앉음, 쉬기는 앉음
function crouchAct(u, it){
  if (!u || u.downed || !it || it.talk) return;
  const lb = String(it.label || ''), k = /쉰다/.test(lb) ? 'sit' : /줍|뒤진|판다|파서|살핀|상자|가방|글씨|묻는|묻기|캔다/.test(lb) ? 'squat' : null;
  if (!k || !u.S.poses[k]) return;
  u.st = 'strike'; u.stT = k === 'sit' ? 1.4 : 0.5; setPose(u, k);
}
function playerUpdate(u, dt){
  P.atkCd -= dt; P.dodgeCd -= dt; P.comboT -= dt; P.sweepCd = (P.sweepCd || 0) - dt; P.slideCd = (P.slideCd || 0) - dt;
  u.inv = Math.max(0, u.inv - dt);
  u.stillT = inputDir() || keys.size || G.lock ? 0 : (u.stillT || 0) + dt;   // 가만히 있은 시간 (굴에서 오래 서 있으면 앉음)
  if (!G.lock && (hit('Mouse0') || hit('KeyJ'))) P.atkBuf = G.t + 0.28;   // 공격 입력 기억 (weapons.js)
  u.kneelShot = false;
  const inj = typeof injOf === 'function' ? injOf(u) : null;   // v0.88 몸이 망가져 못 하는 것 (maim.js INJ)
  // v0.88 방어 올린 채 두기: F 를 톡 (0.22초 안에 뗌) 치면 올라간 채 남음 · 다시 F 나 다른 행동이면 내림
  const fNow = down('KeyF');
  if (!G.lock && hit('KeyF')){ if (P.guardLatch){ P.guardLatch = false; P.fSkip = true; } else P.fAt = G.t; }
  if (P.fWas && !fNow){ if (!P.fSkip && G.t - (P.fAt || -9) < 0.22 && fightMode()){ P.guardLatch = true; popText(u.x, u.y + 2.2, u.z, '방어 유지', 'aim', 0.6); } P.fSkip = false; }
  P.fWas = fNow;
  if (P.guardLatch && (G.lock || hit('Mouse0') || hit('KeyJ') || hit('Mouse2') || hit('KeyK') || hit('KeyQ') || hit('Space') || hit('KeyT') || hit('KeyV') || hit('KeyG') || u.downed)) P.guardLatch = false;
  u.posture = u.posture || 'stand';
  mouse.over = mouseOverEnemy();
  document.body.style.cursor = mouse.over ? 'crosshair' : 'default';
  updateJump(u, dt);
  if (u.poseHold && u.S.poses[u.poseHold]){ u.guard = false; setPose(u, u.poseHold); return; }   // 연출이 정한 자세 (잠 · 죽음)
  if (u.downed){ u.guard = false; u.posture = 'stand'; if (TKS && TKS.st) tkEnd(u, true); if (u.S.poses.curl || u.S.poses.groundGuard) setPose(u, u.S.poses.curl ? 'curl' : 'groundGuard'); return; }   // 쓰러짐: 웅크려 머리를 감쌈
  const tkBlock = !!(inj && inj.noTackle && !(typeof TKS !== 'undefined' && TKS.st)); if (tkBlock && !G.lock && hit('KeyT')) injSay(u, 'noTackle');   // v0.88 갈비뼈 · 팔 · 다리 절단: 태클 못 함
  if (fightMode() && typeof tackleInput === 'function' && !u.lock && u.st !== 'hurt' && !tkBlock && tackleInput(u, dt)) return;   // v0.33 바디 태클 (T)
  if (u.lock){ u.guard = false; return; }   // 잡거나 잡힘: grapple.js
  if (u.st === 'hurt'){ u.stT -= dt; u.guard = false; if (u.stT <= 0){ u.st = 'idle'; } setPose(u, 'hurt'); return; }
  const mv = G.lock ? null : inputDir();
  // 구르기
  if (u.st === 'dodge'){
    u.stT -= dt; moveBy(u, u.dvx * dt, u.dvz * dt);
    P.ghostT -= dt; if (P.ghostT <= 0){ P.ghostT = 0.04; ghost(u); }
    if (u.stT <= 0){ u.st = 'idle'; }
    setPose(u, u.S.poses.roll ? (u.stT > 0.11 || !u.S.poses.rollUp ? 'roll' : 'rollUp') : 'run'); return;   // 구르기: 앞 반은 몸을 말고, 뒤 반은 등으로 굴러 일어남
  }
  if (u.dk && u.dropLand && G.t < (u.dropT || 0)){ dropTick(u, dt); setPose(u, airPose(u)); return; }   // v0.87 드롭킥 비행
  if (u.st === 'dropFall'){ u.stT -= dt; setPose(u, 'rollUp'); if (u.stT <= 0) u.st = 'idle'; return; }   // v0.85 드롭킥 뒤 뒹굶
  if (u.st === 'slide'){ slideTick(u, dt); return; }   // v0.83 슬라이딩 (tackle.js)
  if (!G.lock && hit('KeyQ') && P.dodgeCd <= 0 && u.st !== 'strike' && inj && inj.noDodge && !((down('ShiftLeft') || down('ShiftRight')) && mv && !inj.noSlide)) injSay(u, 'noDodge');
  else if (!G.lock && hit('KeyQ') && P.dodgeCd <= 0 && u.st !== 'strike'){
    if (fightMode() && mv && !(inj && (inj.noSlide || inj.noRun)) && (down('ShiftLeft') || down('ShiftRight')) && (P.slideCd || 0) <= 0 && u.S.poses.slide && u.st !== 'windup' && typeof slideStart === 'function'){ P.aiming = false; P.charge = 0; slideStart(u, mv); return; }   // v0.88 달리면서 Q = 슬라이딩
    const dir = mv || { x: -Math.cos(u.aim), z: -Math.sin(u.aim) };
    u.st = 'dodge'; u.stT = 0.24; u.inv = 0.32; u.dvx = dir.x * 11; u.dvz = dir.z * 11; P.dodgeCd = 0.75; u.guard = false;
    P.aiming = false; P.charge = 0; interrupt(u); dust(u.x, u.z, 6);
    return;
  }
  // 점프
  if (!G.lock && hit('Space') && !u.jy && u.st !== 'windup'){ if (inj && inj.noJump) injSay(u, 'noJump'); else { u.jv = JUMP.v; u.jy = 0.01; dust(u.x, u.z, 4); } }
  // 방어 (누르고 있는 동안)
  if (inj && inj.noGuard && (hit('KeyF') || P.guardLatch)){ P.guardLatch = false; injSay(u, 'noGuard'); }
  const guarding = !G.lock && !(inj && inj.noGuard) && ((fNow && !P.fSkip) || mouse.mid || P.guardLatch) && u.st !== 'windup' && u.st !== 'strike' && !P.aiming;   // v0.88 F · 휠 클릭 · 올린 채 둔 방어
  if (guarding && !u.guard) u.guardAt = G.t;
  u.guard = guarding;
  u.guardMul = typeof W !== 'undefined' && W.def.guard != null ? W.def.guard : Math.max(0.05, 0.3 - ((u.rpg && u.rpg.block) || 0));
  if (u.guard){
    const ap = aimPoint(u), t = mouse.over || nearest(u, foes().filter(e => e.alert), 6);
    if (t) setAim(u, t.x, t.z); else if (ap) setAim(u, ap.x, ap.z);
    if (mv) moveBy(u, mv.x * u.spd * 0.4 * dt, mv.z * u.spd * 0.4 * dt);
    setPose(u, fistNow() && u.S.poses.mtGuard ? 'mtGuard' : u.S.poses.block && !(typeof W !== 'undefined' && W.def && W.def.kind === 'shield') ? 'block' : 'aim');   // 맨손이면 무에타이 가드   // 맨몸 막기: 팔 엇걸기 (방패면 방패 자세)
    return;
  }
  // 찌르기
  if (u.st === 'windup'){ return; }
  if (u.st === 'strike'){ u.stT -= dt; if (mv) moveBy(u, mv.x * 0.8 * dt, mv.z * 0.8 * dt); if (u.stT <= 0) u.st = 'idle'; return; }
  // 공격 · 무기 스킬: 무기마다 (weapons.js)
  // v0.35 숙이기 (G 누르고 있기, 원정): 몸이 낮아져 높은 공격 (휩쓸기 · 가로베기 · 돌려차기 · 정면 창)이 머리 위로 지나감. 피하면 다음 공격 확정 치명. 느리게 움직임
  // v0.83 슬라이딩: 달리면서 G
  if (fightMode() && !G.lock && hit('KeyG') && mv && (down('ShiftLeft') || down('ShiftRight')) && inj && (inj.noSlide || inj.noRun)) injSay(u, 'noSlide');
  else if (fightMode() && !G.lock && hit('KeyG') && mv && (down('ShiftLeft') || down('ShiftRight')) && (P.slideCd || 0) <= 0 && u.S.poses.slide && u.st !== 'windup' && u.st !== 'strike'){ slideStart(u, mv); return; }
  const ducking = fightMode() && !G.lock && down('KeyG') && u.st !== 'windup' && u.st !== 'strike' && u.S.poses.duck;
  u.posture = ducking ? 'crouch' : 'stand';
  // v0.88 앉아쏴: 총 · 활 · 마법을 든 채 숙이고 쏘거나 조준 (그림은 쏘는 자세를 낮춰 보임 · units.js) — 덜 흔들림 · 조준이 빨리 모임 · 치명 · 헤드샷 ↑ (weapons.js · rpg.js · gore.js)
  const rw = typeof W !== 'undefined' && W.def && (W.def.cls === 'gun' || W.def.cls === 'bow' || W.def.cls === 'magic');
  if (ducking && rw && (P.aiming || P.burst || P.atkBuf > G.t || hit('Mouse2') || hit('KeyK') || (W.def.auto && (mouse.left || down('KeyJ'))) || G.t < (P.shootT || 0))){
    u.kneelShot = true; u.guard = false;
    if (!weaponInput(u, dt, mv)){ if (mv) moveBy(u, mv.x * u.spd * 0.3 * dt, mv.z * u.spd * 0.3 * dt); setPose(u, shootPose()); }
    if (!P.aiming && G.t >= (P.shootT || 0) && !P.burst) setPose(u, shootPose());
    return;
  }
  if (ducking && G.t < (u.upT || 0) && fistNow() && (hit('Mouse0') || hit('KeyJ'))){ u.posture = 'stand'; P.atkBuf = G.t + 0.28; weaponInput(u, dt, mv); return; }   // v0.86 숙여 피한 직후: 일어나며 어퍼컷
  if (ducking && (hit('Mouse0') || hit('KeyJ')) && (P.sweepCd || 0) <= 0 && u.S.poses.sweep){ legSweep(u); return; }   // v0.83 숙인 채 공격: 다리후리기
  if (ducking){ u.guard = false; if (mv) moveBy(u, mv.x * u.spd * 0.45 * dt, mv.z * u.spd * 0.45 * dt); setPose(u, 'duck'); return; }
  if (!G.lock && typeof gearSwapInput === 'function' && gearSwapInput(u)) return;   // v0.33 X: 무기 ↔ 보조 무기
  if (inj && inj.noGrab && !G.lock && fightMode() && hit('KeyV')) injSay(u, 'noGrab');   // v0.88 팔 · 갈비뼈: 잡기 못 함
  else if (!G.lock && typeof playerGrabInput === 'function' && fightMode() && playerGrabInput(u)) return;
  const atkHit = !G.lock && (hit('Mouse0') || hit('KeyJ'));
  if (atkHit && u.jy > 0.25 && !u.airAtk && (fistNow() || W.def.cls === 'melee')){   // v0.84 날아 무릎 · v0.85 달리며 뛰었으면 드롭킥 (근접 무기를 들어도 됨)
    if ((down('ShiftLeft') || down('ShiftRight')) && u.S.poses.slide && u.S.poses.rollUp){ dropKick(u); return; }
    if (u.S.poses.knee){ flyingKnee(u); return; }
  }
  if (atkHit && !u.jy && u.S.poses.stomp && fightMode()){ const e = fightTargets().find(f => f.lying && !f.dead && !f.downed && dist(f, u) < 1.7 + f.r); if (e){ stompAnkle(u, e); return; } }   // v0.85 발목 부수기
  if (weaponInput(u, dt, mv)) return;
  // 걷기 · 달리기 (벽에 막혀도 미끄러지며 계속 감)
  if (mv){
    const run = (down('ShiftLeft') || down('ShiftRight')) && !(inj && inj.noRun), sp = u.spd * (run ? 1.55 * ((inj && inj.run) || 1) : 1);   // v0.88 다리 · 갈비뼈: 달리기 느림 · 못 함
    moveBy(u, mv.x * sp * dt, mv.z * sp * dt);
    const shooting = G.t < (P.shootT || 0);
    if (!shooting){ u.aim = Math.atan2(mv.z, mv.x); faceToward(u, mv.x, mv.z); }
    setPose(u, shooting ? shootPose() : u.jy ? airPose(u) : G.t < (u.raiseT || 0) ? 'raise' : carrying(u) ? 'carry' : run ? 'run' : boxing(u) ? 'box' : 'walk');
  } else setPose(u, G.t < (P.shootT || 0) ? shootPose() : u.jy ? airPose(u) : G.t < (u.raiseT || 0) ? 'raise' : carrying(u) ? 'carry' : boxing(u) ? (u.S.poses.mtPose ? 'mtPose' : 'box') : G.mode !== 'exp' && u.stillT > 6 && u.S.poses.sit ? 'sit' : 'idle');
  // 창 줍기
  if (!P.spear && P.spearObj && Math.hypot(P.spearObj.x - u.x, P.spearObj.z - u.z) < 0.9){
    G.scene.remove(P.spearObj.m); P.spearObj = null; P.spear = true; popText(u.x, u.y + 2, u.z, `${W.def.d ? W.def.d.n : '창'}을 주움`, 'heal', 0.7);
  }
}
// 투창 궤적: 보정 없음. 마우스가 가리키는 곳 그대로
//  - 바닥을 가리키면 그 자리 (2 ~ 13칸)에 꽂히는, 빠르고 거의 곧은 포물선 (살짝 떨어짐)
//  - 적의 그림 (날고 있으면 하늘에 있는 그 그림)을 가리키면 그 그림의 가리킨 높이로 곧장 → 빗나가면 지나가서 떨어짐
//  - 날아가는 중엔 꺾이지 않음 (움직이는 적은 빗나갈 수 있음). 마우스를 안 쓰면 바라보는 쪽 끝까지
//  모을수록 빠름. 놓는 순간의 궤적 그대로 날아감
const ARC = { g: 6, v0: 22, v1: 10 };
function aimPath(u){
  let tx, tz, ty, tp = null;
  const e = mouse.over && !mouse.over.dead ? mouse.over : null;
  if (e){
    const base = e.y + (e.lift || 0) + (e.jy || 0), f = toScreen(e.x, base, e.z, UI.W, UI.H), h = toScreen(e.x, base + bodyH(e), e.z, UI.W, UI.H);
    const fr = clamp((f.y - mouse.y) / Math.max(1, f.y - h.y), 0.15, 0.95);
    tp = e; tx = e.x; tz = e.z; ty = base + bodyH(e) * fr;
  } else {
    const gp = aimPoint(u) || { x: u.x + Math.cos(u.aim) * THROW.range, z: u.z + Math.sin(u.aim) * THROW.range };
    const a = Math.atan2(gp.z - u.z, gp.x - u.x), L = clamp(Math.hypot(gp.x - u.x, gp.z - u.z), 2, THROW.range);
    tx = u.x + Math.cos(a) * L; tz = u.z + Math.sin(a) * L; ty = heightAt(G.map, tx, tz);
  }
  const a = Math.atan2(tz - u.z, tx - u.x), L = Math.max(0.5, Math.hypot(tx - u.x, tz - u.z));
  setAim(u, u.x + Math.cos(a), u.z + Math.sin(a));
  const k = Math.min(1, (P.charge || 0) / THROW.full), vh = ARC.v0 + ARC.v1 * k, T = L / vh, y0 = u.y + (u.jy || 0) + 1.25;
  const vy = (ty - y0) / T + ARC.g * T / 2;
  // 미리 날려 보기: 벽 · 땅 (높은 바닥 포함)에 닿는 곳까지
  const pts = [], m = G.map, n = 28, Tmax = T * 1.6;
  let land = null, hit = null;
  const bodies = G.units.filter(e => !e.dead && !e.downed && (e.side === 'enemy' || e.D.dummy));
  for (let i = 0; i <= n; i++){
    const t = Tmax * i / n, x = u.x + Math.cos(a) * vh * t, z = u.z + Math.sin(a) * vh * t, y = y0 + vy * t - ARC.g * t * t / 2;
    // 날아가는 길에 닿는 적의 그림 (몸통 기둥): 거기서 끊고 "맞음"으로 보여줌
    if (i > 0){ const b = bodies.find(e => { const base = e.y + (e.lift || 0) + (e.jy || 0); return Math.hypot(e.x - x, e.z - z) < e.r + 0.3 && y > base - 0.35 && y < base + bodyH(e) + 0.35; });   // 실제 판정과 같게
      if (b){ hit = b; land = { x, y, z }; pts.push(land); break; } }
    const ti = Math.round(x), tj = Math.round(z), tk = tj * m.w + ti;
    if (ti < 0 || tj < 0 || ti >= m.w || tj >= m.h || (m.solid[tk] && !m.low[tk] && y < 2.4)){ land = pts[pts.length - 1] || { x: u.x, y: y0, z: u.z }; break; }
    if (i > 0 && y <= heightAt(m, x, z) + 0.05){ land = { x, y: heightAt(m, x, z), z }; pts.push(land); break; }
    pts.push({ x, y, z });
  }
  if (!land) land = pts[pts.length - 1];
  P.aim = { a, vh, vy, y0, T, tp, pts, land, hit };
}
function throwSpear(u, k, perfect){
  aimPath(u);
  const A = P.aim, tp = A.tp, a = A.a; P.aim = null;
  setPose(u, u.S.poses.throwRel ? 'throwRel' : 'throw'); u.st = 'strike'; u.stT = 0.35;
  P.spear = false;
  const dmg = u.atk * (1.2 + 1.6 * k);
  if (perfect){ popText(u.x, u.y + 2.2, u.z, '완벽!', 'crit', 1); ring(u.x, u.z, 0x5ab4ff, 2.2, 0.4); G.hitstop = 0.08; }
  else if (k >= 1) popText(u.x, u.y + 2.1, u.z, '힘껏', 'big', 0.7);
  spark(u.x + Math.cos(a) * 0.6, u.y + 1.3, u.z + Math.sin(a) * 0.6, perfect ? 0x7fc8ff : 0xfff0d0, perfect ? 16 : 6, 4);
  const p = shoot({ x: u.x, y: A.y0, z: u.z, a, speed: A.vh, vy: A.vy, g: ARC.g, hitR: 0.3, range: THROW.range * 2, side: 'ally', len: 1.5, thick: 0.035, tip: true, color: perfect ? 0xd8eeff : 0xc8b8a0,
    glow: perfect ? 0x5ab4ff : null, pierce: perfect, hitsAir: true, trail: perfect ? 0x5ab4ff : null,
    onHit: (p, t) => {
      hurt(u, t, dmg, { hitsAir: true, ranged: true, from: { x: p.x - Math.cos(p.a), z: p.z - Math.sin(p.a) }, crit: perfect, critMul: 2.5, pierce: perfect, noCam: perfect, kb: 1.2 * k, stun: perfect ? 0.6 : 0 });
      if (G.cmd === 'focus') G.focusTarget = t;
    },
    end: (p, x, z, wall, t) => { if (CAM.track === p) CAM.trackUntil = G.t + 0.25; dropSpear(t ? t.x + rnd(-0.6, 0.6) : x - Math.cos(p.a) * (wall ? 0.4 : 0), t ? t.z + rnd(0.3, 0.9) : z - Math.sin(p.a) * (wall ? 0.4 : 0), p.a); } });
  // 보통은 카메라가 그대로. 완벽이면 화면이 물러나 (줌아웃) 푸른 점 궤적이 보이고, 적에게 닿는 순간만 그 자리를 살짝 당겨 봄 (각도는 그대로)
  if (perfect && !G.camAnchor){ CAM.track = p; CAM.trackUntil = G.t + 1.6; CAM.punch = null; }   // 로비 (고정 카메라)에선 앵글 그대로
}
function dropSpear(x, z, a){
  if (solidAt(G.map, x, z)){ x = G.player.x; z = G.player.z; }
  const y = heightAt(G.map, x, z), g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6), new THREE.MeshBasicMaterial({ color: 0xc8b8a0 }));
  m.position.set(x, y + 0.5, z); m.rotation.z = (Math.cos(a) > 0 ? -1 : 1) * 0.6; m.rotation.y = rnd(-0.3, 0.3);
  const glow = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.32, 24), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
  glow.rotation.x = -Math.PI / 2; glow.position.set(x, y + 0.03, z);
  // 멀리서도 보이는 금빛 기둥 (벽 · 기둥에 가려도 보임)
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.18, 6, 10, 1, true), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, side: THREE.DoubleSide }));
  pillar.position.set(x, y + 3, z); pillar.renderOrder = 40; g.add(pillar);
  g.add(m); g.add(glow); G.scene.add(g);
  P.spearObj = { x, z, m: g, pillar };
}
// 잔상 (구르기 · 적뢰 스텝)
function ghost(u){
  const m = u.mesh.clone(); m.material = u.mat.clone(); m.material.transparent = true; m.material.opacity = 0.5; m.material.color.setRGB(0.6, 0.8, 1.2);
  const g = new THREE.Group(); g.position.copy(u.group.position); const pv = u.pivot.clone(false); pv.add(m); pv.rotation.copy(u.pivot.rotation); pv.position.copy(u.pivot.position); g.add(pv); G.scene.add(g);
  G.fx.push({ s: { position: { x: 0, y: 0, z: 0 }, material: m.material, scale: { setScalar(){} } }, g, t: 0, life: 0.25, ghost: true, vx: 0, vy: 0, vz: 0 });
}
// 머리 위 게이지 (투창: 금색 → 완벽 구간에서 하얗게) · 방어 중엔 앞에 푸른 반원
let guardArc = null, aimLine = null;
// 궤적 표시: 점선 포물선 (모은 만큼 밝아짐, 완벽 구간에선 하얗게) + 떨어질 자리 고리 · 노린 적은 발밑 고리. 무엇에 가려도 보임
function updateAimLine(u){
  if (!aimLine){
    const mat = (c, o) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthTest: false, depthWrite: false, side: THREE.DoubleSide });
    aimLine = { dots: [], g: new THREE.Group() };
    for (let i = 0; i < 29; i++){ const d = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 4), mat(0xffd35a, 0.9)); d.renderOrder = 50; aimLine.dots.push(d); aimLine.g.add(d); }
    aimLine.land = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.36, 24).rotateX(-Math.PI / 2), mat(0xffd35a, 0.9)); aimLine.land.renderOrder = 50; aimLine.g.add(aimLine.land);
    aimLine.foe = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.74, 32).rotateX(-Math.PI / 2), mat(0xffd35a, 0.85)); aimLine.foe.renderOrder = 50; aimLine.g.add(aimLine.foe);
    G.scene.add(aimLine.g);
  }
  aimLine.g.visible = !!P.aiming && !!P.aim;
  if (!aimLine.g.visible){ const el = document.getElementById('aimtag'); if (el) el.hidden = true; return; }
  const A = P.aim, k = Math.min(1, P.charge / THROW.full), win = P.charge >= THROW.full - THROW.perfect, c = win ? 0xffffff : 0xffd35a;
  aimLine.dots.forEach((d, i) => {
    const p = A.pts[i]; d.visible = !!p && i > 0; if (!d.visible) return;
    d.position.set(p.x, p.y, p.z); d.material.color.setHex(c); d.material.opacity = i / A.pts.length <= k ? 0.95 : 0.3;
    d.scale.setScalar(win ? 1.4 : 1);
  });
  // 맞는 적이 있으면 그 발밑에 고리 + 머리 위 "맞음", 없으면 떨어질 자리에 작은 고리 (노린 적이 있는데 안 맞으면 붉게)
  aimLine.land.visible = !A.hit; aimLine.land.position.set(A.land.x, heightAt(G.map, A.land.x, A.land.z) + 0.05, A.land.z); aimLine.land.material.color.setHex(A.tp ? 0xff6a5a : win ? 0x8fd8ff : c);
  aimLine.foe.visible = !!A.hit; if (A.hit){ aimLine.foe.position.set(A.hit.x, A.hit.y + 0.05, A.hit.z); aimLine.foe.scale.setScalar(A.hit.r / 0.6 + 0.4); aimLine.foe.material.color.setHex(win ? 0x8fd8ff : c); }
  const el = document.getElementById('aimtag'); if (el){ el.hidden = !A.hit && !A.tp;
    if (!el.hidden){ const e = A.hit || A.tp, sp = toScreen(e.x, e.y + (e.lift || 0) + bodyH(e) + 0.3, e.z, UI.W, UI.H); el.style.transform = `translate(${sp.x}px,${sp.y}px) translate(-50%,-100%)`; el.textContent = A.hit ? '맞음' : '안 닿음'; el.className = A.hit ? 'ok' : 'no'; } }
}
function updateChargeRing(u){
  updateAimLine(u);
  const el = document.getElementById('gauge');
  if (P.aiming && P.aimMode !== 'focus'){
    const k = P.charge / THROW.full, inWin = P.charge >= THROW.full - THROW.perfect;
    const p = toScreen(u.x, u.y + (u.jy || 0) + bodyH(u) + 0.55, u.z, UI.W, UI.H);
    el.hidden = false; el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-100%)`;
    el.firstChild.style.width = (k * 100) + '%'; el.classList.toggle('win', inWin);
  } else el.hidden = true;
  if (!guardArc){
    guardArc = new THREE.Mesh(new THREE.RingGeometry(0.6, 0.75, 24, 1, -0.9, 1.8), new THREE.MeshBasicMaterial({ color: 0x8fd8ff, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false }));
    guardArc.rotation.x = -Math.PI / 2; G.scene.add(guardArc);
  }
  guardArc.visible = !!u.guard;
  if (u.guard){ guardArc.position.set(u.x, u.y + 0.05, u.z); guardArc.rotation.z = -u.aim; guardArc.material.opacity = G.t - u.guardAt < 0.2 ? 1 : 0.55; }
}
