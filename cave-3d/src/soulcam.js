/* soulcam.js v1.1 — (v1.1, v0.55: 실제로 날 때만 · 더 멀고 높게 (전신 · 뒤가 보이게) · 화각 50° · 크게 벗어날 때만 천천히 돎 — 빙글빙글 없음) (v1.0, v0.54) 적뢰 공중전 카메라 (다크소울식 락온)
   · 적뢰가 실제로 날면: 인주 등 뒤 · 조금 위에서 인주 전신과 적뢰를 한 화면에 — 카메라가 스스로 적뢰를 노림
   · 화각 50°. 인주 뒤가 벽이면 가까이 당김. 땅에 내려와도 1.2초는 그대로 (깜빡이지 않게)
   · 조작은 화면 기준 그대로: 위 (W · 스틱 위) = 적뢰 쪽, 옆 = 적뢰 둘레를 돎
   · 끝나면 원래 화각 · 각도로 부드럽게 돌아감 */
'use strict';
const SOUL = { on: false, hold: 0, fov0: 40, yaw0: 0, wallT: 0, look: null, D: 8.6, H: 3.6, fov: 50, dead: 0.6 };
const soulWant = () => {
  const b = G.boss, pl = G.player;
  return !!(b && !b.dead && b.kind === 'jeokroe' && pl && !pl.downed && ((b.lift || 0) > 1.2 || b.airborne));   // v1.1 실제로 날 때만 (지상전은 원래 카메라)
};
const _updCamSoul = updateCamera;
updateCamera = function(dt, target){
  SOUL.hold = soulWant() ? 1.2 : SOUL.hold - dt;
  const b = G.boss, pl = G.player, on = SOUL.hold > 0 && b && !b.dead && pl && !G.lock;
  if (!on){
    if (SOUL.on){ SOUL.on = false; SOUL.look = null; camera.fov = SOUL.fov0; camera.updateProjectionMatrix(); setYaw(SOUL.yaw0); }
    return _updCamSoul(dt, target);
  }
  if (!SOUL.on){ SOUL.on = true; SOUL.fov0 = camera.fov; SOUL.yaw0 = CAM.yawT; }
  // 각도: 적뢰 → 인주 방향의 뒤
  const dx = pl.x - b.x, dz = pl.z - b.z, L = Math.hypot(dx, dz) || 1, yt = Math.atan2(dx / L, dz / L);
  const dy = angDiff(yt, CAM.yaw); if (Math.abs(dy) > SOUL.dead) CAM.yaw += (dy - Math.sign(dy) * SOUL.dead) * Math.min(1, dt * 1.2); CAM.yawT = CAM.yaw;   // v1.1 적뢰가 크게 벗어날 때만 천천히 돎
  SOUL.wallT -= dt; if (SOUL.wallT <= 0){ SOUL.wallT = 0.35; if (G.map && G.map.wallInfo) layoutWalls(G.map, CAM.yaw); }
  const sy = Math.sin(CAM.yaw), cy = Math.cos(CAM.yaw);
  let d = SOUL.D; while (d > 1.6 && solidAt(G.map, pl.x + sy * d, pl.z + cy * d)) d -= 0.3;   // 뒤가 벽이면 당김
  const py = heightAt(G.map, pl.x, pl.z), by = b.y + (b.lift || 0) + bodyH(b) * 0.5;
  const tx = pl.x + sy * d, tz = pl.z + cy * d, ty = py + SOUL.H + Math.min(1.2, (b.lift || 0) * 0.25);
  const kp = 1 - Math.pow(1 - 0.12, dt * 60);
  camera.position.x += (tx - camera.position.x) * kp; camera.position.y += (ty - camera.position.y) * kp; camera.position.z += (tz - camera.position.z) * kp;
  const lx = lerp(pl.x, b.x, 0.55), ly = lerp(py + 1.2, by, 0.55), lz = lerp(pl.z, b.z, 0.55);
  if (!SOUL.look) SOUL.look = { x: lx, y: ly, z: lz };
  const kl = 1 - Math.pow(1 - 0.18, dt * 60); SOUL.look.x += (lx - SOUL.look.x) * kl; SOUL.look.y += (ly - SOUL.look.y) * kl; SOUL.look.z += (lz - SOUL.look.z) * kl;
  if (G.t < CAM.shakeUntil){ const a = CAM.shakeAmp; camera.position.x += rnd(-0.5, 0.5) * a; camera.position.y += rnd(-0.5, 0.5) * a * 0.6; camera.position.z += rnd(-0.5, 0.5) * a; }
  camera.up.set(0, 1, 0); camera.lookAt(SOUL.look.x, SOUL.look.y, SOUL.look.z);
  if (Math.abs(camera.fov - SOUL.fov) > 0.2){ camera.fov += (SOUL.fov - camera.fov) * Math.min(1, dt * 3); camera.updateProjectionMatrix(); }
  CAM.follow.x = pl.x; CAM.follow.z = pl.z;
};
