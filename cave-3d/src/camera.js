/* camera.js v0.10 — (v0.10, v0.59: greyside — 1층 대지를 옆에서 멀찍이, 하늘 · 언덕이 보이게) (v0.9: 층마다 카메라 모드 — iso (기본) · side (낮게 옆에서, 횡스크롤처럼) · top (높이서 내려다봄) · drift (천천히 돎). camMode(). side · top은 Z · C로 못 돌림)
   v0.8 — 참고 코드 (logic-prototype v9.3) 구조 그대로: 맵은 고정, 움직이는 건 카메라뿐.
   우선순위: 횡스크롤 전환 > 크리티컬 스냅 > 락온 · 넓게 보여주기 (부드럽게 밀고 들어감) > 평소 (느슨한 추적 + 줌 펄스 + 잔진동)
   v0.3: 카메라가 돎 (yaw, Z · C로 90°씩, 가려진 것을 볼 땐 스스로 돎) · 완벽 투창은 창을 따라감
   v0.4: 카메라 구역 — 지도에 적어 둔 구역 (곁방 등)에 들어가면 정해진 각도로 돌고 둘레 벽을 깎음, 나오면 들어가기 전 각도로 */
'use strict';
const CAM = {
  base: { y: 9.5, back: 8.2 },     // 평소: 따라가는 점 위 9.5, 뒤로 8.2
  look: { y: 0.4, fwd: 0.6 },
  follow: { x: 0, z: 0 },          // 실제로 따라가는 점 (느슨한 스프링으로 뒤따라감)
  yaw: 0, yawT: 0,                 // 0 = 남쪽에서 북쪽을 봄
  zoomTarget: 0, zoomBoost: 0, zoomDist: 2.4, zoomHeight: 1.6,
  shakeUntil: -1, shakeAmp: 0,
  critUntil: -1, critPos: null, critLook: null,
  focusUntil: -1, focusAt: null, focusH: 2.6, focusBack: 3.2, focusK: 0.06,
  sideUntil: -1, sideStart: 0, sideAt: null, sideAxis: null,
  wide: null,                      // 넓게 보여주기 (장면 시작): { x, z, h, back, until }
  track: null, trackUntil: -1,     // 완벽 투창: 날아가는 창
  mode: 'iso', drift: 0, lockYaw: false, wallT: 0,
};
const CAM_MODES = { iso: { base: { y: 9.5, back: 8.2 }, look: { y: 0.4, fwd: 0.6 } }, side: { base: { y: 3.6, back: 7.4 }, look: { y: 1.0, fwd: 0 } }, top: { base: { y: 14, back: 2.6 }, look: { y: 0.2, fwd: 0.2 } } };
// 층 카메라: 모드 + (drift) 1초에 도는 각도. side · top은 각도 고정
function camMode(mode = 'iso', drift = 0){
  const M = CAM_MODES[mode] || CAM_MODES.iso; CAM.mode = mode; Object.assign(CAM.base, M.base); Object.assign(CAM.look, M.look);
  CAM.drift = drift; CAM.lockYaw = mode === 'side' || mode === 'top' || mode === 'greyside';
  if (CAM.lockYaw) setYaw(0);
}
let camera;
const camOff = (yaw, d) => ({ x: Math.sin(yaw) * d, z: Math.cos(yaw) * d });
function initCamera(){
  camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  camera.position.set(0, CAM.base.y, CAM.base.back);
}
function camZoomPulse(k = 1){ CAM.zoomTarget = Math.max(CAM.zoomTarget, k); }
function camShake(amp, sec){ CAM.shakeAmp = Math.max(amp, G.t < CAM.shakeUntil ? CAM.shakeAmp : 0); CAM.shakeUntil = Math.max(CAM.shakeUntil, G.t + sec); }
function camCrit(x, z, y = 0.6, sec = 0.4){
  const side = Math.random() < 0.5 ? 1 : -1, o = camOff(CAM.yaw, 2.2), r = camOff(CAM.yaw + Math.PI / 2, 1.6 * side);
  CAM.critPos = { x: x + o.x + r.x, y: y + 0.9, z: z + o.z + r.z };
  CAM.critLook = { x, y: y + 0.5, z };
  CAM.critUntil = G.t + sec;
}
// 락온: 가려져 있으면 잘 보이는 쪽으로 돌아감 (돌고 나면 원래 각도로)
function camFocus(x, z, sec, h = 2.6, back = 3.2, k = 0.06, autoYaw = true){
  CAM.focusAt = { x, z }; CAM.focusUntil = G.t + sec; CAM.focusH = h; CAM.focusBack = back; CAM.focusK = k;
  if (autoYaw && !CAM.zone){ const y = bestYaw(x, z); if (y !== CAM.yawT){ CAM.yawBefore = CAM.yawT; setYaw(y); } }
}
function camFocusOff(){ CAM.focusUntil = -1; if (CAM.yawBefore != null){ setYaw(CAM.yawBefore); CAM.yawBefore = null; } }
function camSide(a, b, sec, scale = 1){
  CAM.sideScale = scale;
  const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;
  let dx = b.x - a.x, dz = b.z - a.z; if (!dx && !dz) dx = 1;
  const l = Math.hypot(dx, dz), sx = -dz / l, sz = dx / l, cam = camOff(CAM.yaw, 1), sign = sx * cam.x + sz * cam.z >= 0 ? 1 : -1;
  CAM.sideAt = { x: mx, z: mz }; CAM.sideAxis = { x: sx * sign, z: sz * sign }; CAM.sideStart = G.t; CAM.sideUntil = G.t + sec;
}
// 장면이 바뀔 때: 붙잡아 둔 연출 카메라 (락온 · 넓게 · 옆에서 · 크리티컬 · 창 따라가기 · 줌)를 모두 풂
// (v0.8: 99초짜리 락온 · 넓게 보여주기가 다음 장면까지 남아 카메라가 한 자리에 굳던 것)
function camReset(){
  CAM.focusUntil = -1; CAM.focusAt = null; CAM.wide = null; CAM.sideUntil = -1; CAM.critUntil = -1;
  CAM.track = null; CAM.trackUntil = -1; CAM.punch = null; CAM.zoomTarget = CAM.zoomBoost = 0; CAM.shakeUntil = -1;
  CAM.out = 0; CAM.fit = 0; CAM.air = 0; CAM.yawBefore = null;
}
function camWide(x, z, h, back, sec){ CAM.wide = { x, z, h, back, until: G.t + sec }; }
function camSnapTo(x, z){ CAM.follow.x = x; CAM.follow.z = z; const o = camOff(CAM.yaw, CAM.base.back); camera.position.set(x + o.x, CAM.base.y, z + o.z); }
function setYaw(y){ CAM.yawT = y; if (G.map && G.map.wallInfo) layoutWalls(G.map, y); }
function rotateCam(dir){ if (CAM.lockYaw){ popText && G.player && popText(G.player.x, G.player.y + 2.2, G.player.z, '이 층에선 카메라를 못 돌림', 'miss', 0.8); return; } setYaw(CAM.yawT + dir * Math.PI / 2); CAM.yawBefore = null; }
// 그 자리를 가장 덜 가리는 방향 (카메라 쪽 4칸 안의 벽 수가 가장 적은 쪽)
function bestYaw(x, z){
  let best = CAM.yawT, bv = 1e9;
  for (let k = 0; k < 4; k++){
    const y = Math.round(CAM.yawT / (Math.PI / 2)) * Math.PI / 2 + k * Math.PI / 2, o = camOff(y, 1); let v = k ? 0.5 : 0;
    for (let s = 1; s <= 5; s++) for (const side of [-0.6, 0, 0.6]){
      const px = x + o.x * s + o.z * side, pz = z + o.z * s - o.x * side;
      if (solidAt(G.map, px, pz)) v += 6 - s;
    }
    if (v < bv){ bv = v; best = y; }
  }
  return best;
}

function updateCamera(dt, target){
  const k = 1 - Math.pow(1 - 0.08, dt * 60);   // 프레임과 무관한 느슨한 스프링 (60fps에서 0.08)
  if (CAM.drift && !G.lock){ CAM.yawT += CAM.drift * dt; CAM.wallT -= dt; if (CAM.wallT <= 0){ CAM.wallT = 0.5; if (G.map && G.map.wallInfo) layoutWalls(G.map, CAM.yawT); } }   // v0.9 천천히 도는 층
  CAM.yaw += angDiff(CAM.yawT, CAM.yaw) * Math.min(1, dt * 5);
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
    const fy = heightAt(G.map, F.x, F.z), o = camOff(CAM.yaw, B);
    camera.position.x += (F.x + o.x - camera.position.x) * kk;
    camera.position.y += (fy + H - camera.position.y) * kk;
    camera.position.z += (F.z + o.z - camera.position.z) * kk;
    camera.lookAt(F.x, fy + 0.7, F.z);
    CAM.follow.x = F.x; CAM.follow.z = F.z;
    if (G.t < CAM.shakeUntil) camera.position.add(new THREE.Vector3(rnd(-0.5, 0.5), rnd(-0.3, 0.3), rnd(-0.5, 0.5)).multiplyScalar(CAM.shakeAmp));
    return;
  }
  // 3.5 완벽 투창이 적에게 닿는 순간: 그 자리를 살짝 당겨 봄 (각도는 그대로, 짧게)
  if (CAM.punch && G.t < CAM.punch.until){
    const P2 = CAM.punch, fy = heightAt(G.map, P2.x, P2.z), o = camOff(CAM.yaw, CAM.base.back * 0.5), kp = 1 - Math.pow(1 - 0.22, dt * 60);
    camera.position.x += (P2.x + o.x - camera.position.x) * kp; camera.position.y += (fy + CAM.base.y * 0.5 - camera.position.y) * kp; camera.position.z += (P2.z + o.z - camera.position.z) * kp;
    CAM.follow.x += (P2.x - CAM.follow.x) * kp; CAM.follow.z += (P2.z - CAM.follow.z) * kp;
    camera.lookAt(CAM.follow.x, fy + 0.9, CAM.follow.z);
    return;
  }
  // 4. 평소: 따라가는 점을 느슨하게 + 스스로 풀리는 줌 펄스 + 잔진동
  //    완벽 투창이 날아가는 동안엔 인주와 창 사이를 보며 뒤로 물러남 (줌아웃) → 적에게 닿기 직전 3.5로
  let tg = target, kf = k, out = 0;
  if (CAM.track && G.t < CAM.trackUntil){
    const s = CAM.track; tg = { x: (target.x + s.x) / 2, z: (target.z + s.z) / 2 }; out = 0.45;
    if (!CAM.punch){ const f = foes().find(e => !e.dead && Math.hypot(e.x - s.x, e.z - s.z) < 1.8); if (f){ CAM.punch = { x: f.x, z: f.z, until: G.t + 0.4 }; CAM.track = null; } }
  } else CAM.track = null;
  CAM.out = (CAM.out || 0) + (out - (CAM.out || 0)) * (1 - Math.pow(1 - (out ? 0.2 : 0.05), dt * 60));
  // 보스전: 인주와 보스가 멀어지면 둘 다 화면에 들어오게 물러남
  // 보스전: 늘 조금 물러나 보스 전신이 보이게 + 멀어질수록 더
  // v0.7: G.bossFit로 물러나는 정도를 장면마다 (프롤로그 청광묵은 작아서 덜 물러남)
  const bs = G.boss && !G.boss.dead && G.player ? (0.32 + Math.max(0, Math.min(0.8, (Math.hypot(G.boss.x - G.player.x, G.boss.z - G.player.z) - 4) * 0.09))) * (G.bossFit ?? 1) : 0;
  CAM.fit = (CAM.fit || 0) + (bs - (CAM.fit || 0)) * k;
  CAM.follow.x += (tg.x - CAM.follow.x) * kf;
  CAM.follow.z += (tg.z - CAM.follow.z) * kf;
  CAM.zoomTarget = Math.max(0, CAM.zoomTarget - 2.1 * dt);
  CAM.zoomBoost += (CAM.zoomTarget - CAM.zoomBoost) * (1 - Math.pow(1 - 0.18, dt * 60));
  const air = G.boss && !G.boss.dead && G.boss.lift > 0.5 ? Math.min(1, G.boss.lift / 3) : 0;
  CAM.air = (CAM.air || 0) + (air - (CAM.air || 0)) * k;
  const fy = heightAt(G.map, CAM.follow.x, CAM.follow.z) * 0.6, far = 1 + CAM.air * 0.35 + CAM.out + CAM.fit;
  const o = camOff(CAM.yaw, CAM.base.back * far - CAM.zoomBoost * CAM.zoomDist);
  const tx = CAM.follow.x + o.x, tz = CAM.follow.z + o.z, ty = fy + CAM.base.y * far - CAM.zoomBoost * CAM.zoomHeight;
  camera.position.x += (tx - camera.position.x) * Math.max(k, kf * 0.8);
  camera.position.y += (ty - camera.position.y) * k;
  camera.position.z += (tz - camera.position.z) * Math.max(k, kf * 0.8);
  if (G.t < CAM.shakeUntil){ const a = CAM.shakeAmp; camera.position.x += rnd(-0.5, 0.5) * a; camera.position.y += rnd(-0.5, 0.5) * a * 0.6; camera.position.z += rnd(-0.5, 0.5) * a; }
  const lf = camOff(CAM.yaw, -(CAM.look.fwd - CAM.air * 1.2));
  camera.lookAt(CAM.follow.x - lf.x * -1 * 0 + camOff(CAM.yaw, CAM.look.fwd - CAM.air * 1.2).x, fy + CAM.look.y + CAM.air * 1.6 + (CAM.fit || 0) * 1.2, CAM.follow.z + camOff(CAM.yaw, CAM.look.fwd - CAM.air * 1.2).z);
}
// 카메라 구역: map.zones = [{ x0, x1, z0, z1, yaw (없으면 가장 덜 가리는 쪽), cut (둘레 벽 깎기) }]
// 나갈 때는 0.4칸 여유 (문턱에서 왔다 갔다 하지 않게). 층마다 기믹을 붙일 자리
function updateCamZone(p){
  const Z = G.map && G.map.zones; if (!Z || !p) return;
  const inside = (z, m) => p.x >= z.x0 - m && p.x <= z.x1 + m && p.z >= z.z0 - m && p.z <= z.z1 + m;
  if (CAM.zone){
    if (inside(CAM.zone, 0.4)) return;
    CAM.zone = null; G.map.cut = null; setYaw(CAM.zoneBefore); CAM.yawBefore = null; return;
  }
  for (const z of Z) if (inside(z, 0)){
    CAM.zone = z; CAM.zoneBefore = CAM.yawBefore != null ? CAM.yawBefore : CAM.yawT; CAM.yawBefore = null;
    G.map.cut = z.cut ? z : null;
    setYaw(z.yaw != null ? Math.round(CAM.yawT / (Math.PI * 2)) * Math.PI * 2 + z.yaw : bestYaw((z.x0 + z.x1) / 2, (z.z0 + z.z1) / 2));
    return;
  }
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
