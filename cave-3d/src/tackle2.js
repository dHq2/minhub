/* tackle2.js v1.0 — (v0.55) 태클 다시 짜기 (훈련장 규칙 · 확정되면 모든 판)
   · 방향: 투창과 같은 조준 (PC 마우스 · 손가락 화면은 조이스틱 / 태클 버튼 끌기 · 약한 조준 보정)
   · 달리면서 T = 어깨빵: 멈추지 않고 짧게 들이받고 지나감 (밀침 · 휘청, 벽 쪽이면 짓눌림). 대기 2.2초
   · 서서 T = 레슬링 자세: 낮게 웅크려 천천히 걸음 (막기 · 구르기는 못 함). 다시 T · Q = 풂, 맞으면 풀림
     자세에서 공격 (J · 좌클릭 · K) = 그래플링 태클: 다리를 노리고 뛰어듦 (2.8칸)
       성공 → 넘어뜨려 깔고 앉음 (그라운드: J 파운딩 · K 끝내기 · Q 일어섬 — 레슬링 그대로)
       성공률: 예고 중 · 등 뒤 · 넘어진 · 휘청인 적일수록 높음. 정면에서 멀쩡히 보고 있으면 스프롤 (위에서 눌려 내가 넘어짐). 아주 무거운 적 · 보스는 안 됨
       아무도 없으면 헛짚어 잠깐 휘청 */
'use strict';
const TK2 = { bashCd: 2.2, bashLen: 2.4, bashT: 0.22, shotLen: 2.8, shotT: 0.3, shotCd: 1.4, slow: 0.5 };
const TKW = { stance: false, act: null, cd: 0, shotCd: 0, spd0: null };
const tk2Dir = u => { const ap = aimPoint(u); return ap && Math.hypot(ap.x - u.x, ap.z - u.z) > 0.3 ? Math.atan2(ap.z - u.z, ap.x - u.x) : u.aim; };
function tk2Exit(u, why){ TKW.stance = false; TKW.act = null; if (u.st === 'tackle') u.st = 'idle'; if (why) popText(u.x, u.y + 2.2, u.z, why, 'miss', 0.6); }
const _tackleOld = tackleInput;
tackleInput = function(u, dt){
  if (!(typeof SQ !== 'undefined' && SQ.on)) return _tackleOld(u, dt);
  TKW.cd -= dt; TKW.shotCd -= dt;
  const A = TKW.act;
  if (A) return tk2Act(u, dt, A);
  if (TKW.stance){
    if (u.downed || u.lock){ tk2Exit(u); return false; }
    if (hit('KeyT') || hit('KeyQ')){ tk2Exit(u, '자세를 풂'); return true; }
    const mv = G.lock ? null : inputDir(), a = tk2Dir(u);
    if (mv) moveBy(u, mv.x * u.spd * TK2.slow * dt, mv.z * u.spd * TK2.slow * dt);
    u.aim = a; faceToward(u, Math.cos(a), Math.sin(a)); u.st = 'idle'; u.guard = false; u.posture = 'crouch';
    setPose(u, u.S.poses.grabReady ? 'grabReady' : 'idle');
    if ((hit('KeyJ') || hit('Mouse0') || hit('KeyK') || hit('Mouse2')) && TKW.shotCd <= 0){ TKW.shotCd = TK2.shotCd; TKW.act = { k: 'shot', t: 0, a, went: 0 }; SFX.whoosh && SFX.whoosh(); popText(u.x, u.y + 2.2, u.z, '태클!', 'aim', 0.5); P.atkBuf = 0; }
    return true;
  }
  if (!hit('KeyT') || G.lock || u.lock || u.downed || (u.st !== 'idle' && u.st !== 'run' && u.st !== 'strike')) return false;
  const run = (down('ShiftLeft') || down('ShiftRight')) && inputDir();
  if (run){
    if (TKW.cd > 0){ popText(u.x, u.y + 2.2, u.z, `어깨빵 ${Math.ceil(TKW.cd)}초`, 'miss', 0.5); return true; }
    TKW.cd = TK2.bashCd; TKW.act = { k: 'bash', t: 0, a: tk2Dir(u), went: 0, hit: null }; u.st = 'tackle'; return true;
  }
  TKW.stance = true; P.aiming = false; popText(u.x, u.y + 2.3, u.z, '레슬링 자세 — 공격으로 태클 · T 풂', 'aim', 1.1); return true;
};
function tk2Act(u, dt, A){
  A.t += dt; const ca = Math.cos(A.a), sa = Math.sin(A.a);
  if (A.k === 'bash'){
    const step = TK2.bashLen / TK2.bashT * dt; moveBy(u, ca * step, sa * step); u.aim = A.a; faceToward(u, ca, sa);
    setPose(u, u.S.poses.shoulder ? 'shoulder' : 'idle'); u.leanT = 0.3; if (Math.random() < 0.6) dust(u.x, u.z, 1);
    if (!A.hit) for (const e of fightTargets()){
      if (e.dead || e.downed || e.airborne || Math.hypot(e.x - u.x, e.z - u.z) > u.r + e.r + 0.3) continue;
      A.hit = e;
      if (tooBig(u, e)){ hurt(u, e, u.atk * 0.25, { from: u, noCrit: true }); popText(e.x, e.y + bodyH(e), e.z, '꿈쩍 않음', 'miss', 0.8); const n = norm(u.x - e.x, u.z - e.z); u.kx += n.x * 6; u.kz += n.z * 6; A.t = TK2.bashT; break; }
      hurt(u, e, u.atk * 0.7, { from: u, kb: 2.4, stun: 0.5, noCam: true }); popText(e.x, e.y + bodyH(e) + 0.2, e.z, '어깨빵!', 'big', 0.7);
      SFX.thump && SFX.thump(140, 0.4, 0.15); camShake(0.15, 0.12); break;
    }
    if (A.t >= TK2.bashT){ TKW.act = null; u.st = 'idle'; }
    return true;
  }
  // 그래플링 태클: 다리를 노리고 뛰어듦
  const step = Math.min(TK2.shotLen - A.went, TK2.shotLen / TK2.shotT * dt);
  moveBy(u, ca * step, sa * step); A.went += step; setPose(u, u.S.poses.dash ? 'dash' : 'grabReady'); u.leanT = 0.4; if (Math.random() < 0.5) dust(u.x, u.z, 1);
  const e = fightTargets().find(o => !o.dead && !o.downed && !o.airborne && Math.hypot(o.x - u.x, o.z - u.z) < u.r + o.r + 0.25);
  if (e){
    TKW.act = null;
    const behind = Math.abs(angDiff(Math.atan2(u.z - e.z, u.x - e.x), e.aim ?? 0)) > 1.9, lying = e.lying || (e.tripT && e.tripT > G.t);
    let p = 0.45 + (e.st === 'windup' ? 0.35 : 0) + (behind ? 0.3 : 0) + (lying ? 0.3 : 0) + (e.st === 'hurt' ? 0.2 : 0) - (typeof readsYou === 'function' && readsYou(e, u) > 0 ? 0.25 : 0) - (e.D.heavy ? 0.3 : 0) + (grStr(u) - grStr(e)) * 0.03;
    p = Math.max(0.08, Math.min(0.95, p));
    if (canGrab(u, e) && !tooBig(u, e) && Math.random() < p){
      const L = grab(u, e); TKW.stance = false;
      if (L){ L.phase = 'ground'; L.t = 0; e.lying = true; hurt(u, e, u.atk * 0.45, { from: u, grapple: true, noCam: true }); popText(e.x, e.y + 1.4, e.z, `태클 성공 (${Math.round(p * 100)}%) — 깔고 앉음!`, 'crit', 1.2); camShake(0.2, 0.2); SFX.thump && SFX.thump(110, 0.45, 0.2); }
      return true;
    }
    // 스프롤: 위에서 눌려 내가 넘어짐
    TKW.stance = false; setAim(e, u.x, u.z);
    u.st = 'hurt'; u.stT = 1.0; u.lying = true; u.tripT = G.t + 1.0; u.posture = 'stand'; setPose(u, 'hurt');
    if (!e.D.dummy) hurt(e, u, e.atk * 0.6, { from: e, noCrit: true });
    popText(e.x, e.y + bodyH(e) + 0.4, e.z, `스프롤! (${Math.round(p * 100)}%)`, 'alert', 1.1); camShake(0.2, 0.2);
    return true;
  }
  if (A.went >= TK2.shotLen - 0.01){ TKW.act = null; u.st = 'hurt'; u.stT = 0.35; setPose(u, 'hurt'); popText(u.x, u.y + 2.1, u.z, '헛짚음', 'miss', 0.6); }
  return true;
}
// 자세 중 맞으면 풀림
TICKS.push(() => { const pl = G.player; if (TKW.stance && pl && (pl.st === 'hurt' || pl.downed || pl.lock)) tk2Exit(pl); if (!TKW.stance && pl && pl.posture === 'crouch' && pl.pose === 'grabReady' && !TKW.act) pl.posture = 'stand'; });
