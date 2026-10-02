/* camera.js v0.1 — 참고 코드 (logic-prototype v9.3) 구조 그대로: 맵은 고정, 움직이는 건 카메라뿐.
   우선순위: 횡스크롤 전환 > 크리티컬 스냅 > 락온 (부드럽게 밀고 들어감) > 평소 (느슨한 추적 + 줌 펄스 + 잔진동) */
'use strict';
const CAM = {
  base: { y: 9.5, back: 8.2 },     // 평소: 따라가는 점 위 9.5, 뒤로 8.2
  look: { y: 0.4, fwd: 0.6 },
  follow: { x: 0, z: 0 },          // 실제로 따라가는 점 (느슨한 스프링으로 뒤따라감)
  zoomTarget: 0, zoomBoost: 0, zoomDist: 2.4, zoomHeight: 1.6,
  shakeUntil: -1, shakeAmp: 0,
  critUntil: -1, critPos: null, critLook: null,
  focusUntil: -1, focusAt: null, focusH: 2.6, focusBack: 3.2, focusK: 0.06,
  sideUntil: -1, sideStart: 0, sideAt: null, sideAxis: null,
  wide: null,                      // 넓게 보여주기 (장면 시작): { x, z, h, back, until }
};
let camera;
function initCamera(){
  camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  camera.position.set(0, CAM.base.y, CAM.base.back);
}
function camZoomPulse(k = 1){ CAM.zoomTarget = Math.max(CAM.zoomTarget, k); }
function camShake(amp, sec){ CAM.shakeAmp = Math.max(amp, G.t < CAM.shakeUntil ? CAM.shakeAmp : 0); CAM.shakeUntil = Math.max(CAM.shakeUntil, G.t + sec); }
function camCrit(x, z, y = 0.6, sec = 0.4){
  const side = Math.random() < 0.5 ? 1 : -1;
  CAM.critPos = { x: x + side * 1.6, y: y + 0.9, z: z + 2.2 };
  CAM.critLook = { x: x - side * 0.15, y: y + 0.5, z };
  CAM.critUntil = G.t + sec;
}
function camFocus(x, z, sec, h = 2.6, back = 3.2, k = 0.06){ CAM.focusAt = { x, z }; CAM.focusUntil = G.t + sec; CAM.focusH = h; CAM.focusBack = back; CAM.focusK = k; }
function camFocusOff(){ CAM.focusUntil = -1; }
function camSide(a, b, sec, scale = 1){
  CAM.sideScale = scale;
  const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;
  let dx = b.x - a.x, dz = b.z - a.z; if (!dx && !dz) dx = 1;
  const l = Math.hypot(dx, dz), sx = -dz / l, sz = dx / l, sign = sz >= 0 ? 1 : -1;
  CAM.sideAt = { x: mx, z: mz }; CAM.sideAxis = { x: sx * sign, z: sz * sign }; CAM.sideStart = G.t; CAM.sideUntil = G.t + sec;
}
function camWide(x, z, h, back, sec){ CAM.wide = { x, z, h, back, until: G.t + sec }; }
function camSnapTo(x, z){ CAM.follow.x = x; CAM.follow.z = z; camera.position.set(x, CAM.base.y, z + CAM.base.back); }

function updateCamera(dt, target){
  const k = 1 - Math.pow(1 - 0.08, dt * 60);   // 프레임과 무관한 느슨한 스프링 (60fps에서 0.08)
  camera.up.set(0, 1, 0);
  // 1. 횡스크롤 전환: 두 사람을 잇는 선의 옆에서 낮게, 거리를 벌리며 빠짐
  if (G.t < CAM.sideUntil && CAM.sideAt){
    const t = Math.min(1, (G.t - CAM.sideStart) / Math.max(0.01, CAM.sideUntil - CAM.sideStart)), e = Math.pow(t, 0.65);
    const sc = CAM.sideScale || 1, d = lerp(2.8, 7.2, e) * sc, amp = 0.22 * Math.max(0, 1 - t * 2.2), fx = CAM.sideAt.x, fz = CAM.sideAt.z, fy = heightAt(G.map, fx, fz);
    camera.position.set(fx + CAM.sideAxis.x * d + rnd(-0.5, 0.5) * amp, fy + lerp(1.1, 2.6, e) * sc + rnd(-0.5, 0.5) * amp * 0.6, fz + CAM.sideAxis.z * d + rnd(-0.5, 0.5) * amp);
    camera.lookAt(fx, fy + lerp(0.6, 0.9, e), fz);
    return;
  }
  // 2. 크리티컬 스냅: 보간 없이 그 자리 + 거친 흔들림 + 더치 앵글
  if (G.t < CAM.critUntil && CAM.critPos){
    const a = 0.16;
    camera.position.set(CAM.critPos.x + rnd(-0.5, 0.5) * a, CAM.critPos.y + rnd(-0.5, 0.5) * a * 0.7, CAM.critPos.z + rnd(-0.5, 0.5) * a);
    camera.up.set(rnd(-0.5, 0.5) * 0.25, 1, 0);
    camera.lookAt(CAM.critLook.x, CAM.critLook.y, CAM.critLook.z);
    camera.up.set(0, 1, 0);
    return;
  }
  // 3. 넓게 보여주기 · 락온: 부드럽게 밀고 들어감 (계수 낮을수록 천천히)
  const W = CAM.wide && G.t < CAM.wide.until ? CAM.wide : null;
  if (W || (G.t < CAM.focusUntil && CAM.focusAt)){
    const F = W ? { x: W.x, z: W.z } : CAM.focusAt, H = W ? W.h : CAM.focusH, B = W ? W.back : CAM.focusBack, kk = 1 - Math.pow(1 - (W ? 0.035 : CAM.focusK), dt * 60);
    const fy = heightAt(G.map, F.x, F.z);
    camera.position.x += (F.x - camera.position.x) * kk;
    camera.position.y += (fy + H - camera.position.y) * kk;
    camera.position.z += (F.z + B - camera.position.z) * kk;
    camera.lookAt(F.x, fy + 0.7, F.z);
    CAM.follow.x = F.x; CAM.follow.z = F.z;
    if (G.t < CAM.shakeUntil) camera.position.add(new THREE.Vector3(rnd(-0.5, 0.5), rnd(-0.3, 0.3), rnd(-0.5, 0.5)).multiplyScalar(CAM.shakeAmp));
    return;
  }
  // 4. 평소: 따라가는 점을 느슨하게 + 스스로 풀리는 줌 펄스 + 잔진동
  CAM.follow.x += (target.x - CAM.follow.x) * k;
  CAM.follow.z += (target.z - CAM.follow.z) * k;
  CAM.zoomTarget = Math.max(0, CAM.zoomTarget - 2.1 * dt);
  CAM.zoomBoost += (CAM.zoomTarget - CAM.zoomBoost) * (1 - Math.pow(1 - 0.18, dt * 60));
  const air = G.boss && !G.boss.dead && G.boss.lift > 0.5 ? Math.min(1, G.boss.lift / 3) : 0;
  CAM.air = (CAM.air || 0) + (air - (CAM.air || 0)) * k;
  const fy = heightAt(G.map, CAM.follow.x, CAM.follow.z) * 0.6, far = 1 + CAM.air * 0.35;
  const tx = CAM.follow.x, tz = CAM.follow.z + CAM.base.back * far - CAM.zoomBoost * CAM.zoomDist, ty = fy + CAM.base.y * far - CAM.zoomBoost * CAM.zoomHeight;
  camera.position.x += (tx - camera.position.x) * k;
  camera.position.y += (ty - camera.position.y) * k;
  camera.position.z += (tz - camera.position.z) * k;
  if (G.t < CAM.shakeUntil){ const a = CAM.shakeAmp; camera.position.x += rnd(-0.5, 0.5) * a; camera.position.y += rnd(-0.5, 0.5) * a * 0.6; camera.position.z += rnd(-0.5, 0.5) * a; }
  camera.lookAt(CAM.follow.x, fy + CAM.look.y + CAM.air * 1.6, CAM.follow.z + CAM.look.fwd - CAM.air * 1.2);
}
// 화면 좌표 ↔ 세계
const _v = new THREE.Vector3();
function toScreen(x, y, z, W, H){ _v.set(x, y, z).project(camera); return { x: (_v.x + 1) / 2 * W, y: (1 - _v.y) / 2 * H, behind: _v.z > 1 }; }
const _ray = new THREE.Raycaster(), _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), _hit = new THREE.Vector3();
function screenToGround(sx, sy, W, H, y = 0){
  _ray.setFromCamera({ x: sx / W * 2 - 1, y: -(sy / H * 2 - 1) }, camera);
  _plane.constant = -y;
  return _ray.ray.intersectPlane(_plane, _hit) ? { x: _hit.x, z: _hit.z } : null;
}
