/* mapfx.js v1.1 — 원정 층의 땅 기믹 (dungeon.js v1.1이 자리를 정함)
   v1.1: 먼 배경 — 가로로 긴 층 (한 줄 복도 · 옆 카메라)은 판마다 40%로 '바닷바람 절벽 길': 북쪽 멀리 바다 · 수평선 · 달을 납작한 판 하나로 (MFX.sea, 물결이 천천히 흐름)
   · 가시 함정 (2층 · 8층): 복도 바닥의 쇠판. 2.4초마다 덜컥 (0.5초 전에 살짝 솟으며 덜그럭) → 가시가 솟음 (0.6초). 그 위에 있으면 최대 체력 12% (점프 중이면 안 맞음)
     적도 똑같이 찔림 — 태클 · 밀쳐내기로 밀어 넣으면 좋음
   · 물웅덩이 (3층): 느려짐 ×0.72 · 물결. 진흙 (6층): 느려짐 ×0.55
   · 느려짐은 units.js moveStep이 G.map.slow를 봄 (점프 중엔 안 느려짐) */
'use strict';
const MFX = { traps: [], pools: [], sea: null };
const SPIKE = { cycle: 2.4, warn: 0.5, up: 0.6, dmg: 0.12 };
const plateTex = canvasTex(64, 64, (c, w, h) => {
  c.fillStyle = '#3a3634'; c.fillRect(2, 2, w - 4, h - 4); c.strokeStyle = '#1c1a19'; c.lineWidth = 3; c.strokeRect(3, 3, w - 6, h - 6);
  c.fillStyle = '#121010'; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++){ c.beginPath(); c.arc(14 + i * 18, 14 + j * 18, 4, 0, 6.3); c.fill(); }
});
function mapFxBuild(gen){
  MFX.traps = []; MFX.pools = []; MFX.sea = null;
  if (gen.D && gen.D.layout === 'linear' && typeof EXP !== 'undefined' && EXP && ((EXP.seed >>> 3) + EXP.F * 7) % 10 < 4) seaBackdrop(G.map);
  const m = G.map; m.slow = new Float32Array(m.w * m.h);
  const coneG = new THREE.ConeGeometry(0.07, 0.42, 6), coneM = new THREE.MeshStandardMaterial({ color: 0x9a9690, metalness: 0.6, roughness: 0.4 });
  for (const t of gen.traps || []){
    const k = t.z * m.w + t.x; if (m.solid[k] || m.hgt[k]) continue;
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.92), new THREE.MeshStandardMaterial({ map: plateTex, roughness: 0.8 }));
    plate.rotation.x = -Math.PI / 2; plate.position.set(t.x, 0.012, t.z); G.scene.add(plate); G.props.push(plate);
    const sp = new THREE.Group(); for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++){ const c = new THREE.Mesh(coneG, coneM); c.position.set((i - 1) * 0.28, 0.21, (j - 1) * 0.28); sp.add(c); }
    sp.position.set(t.x, -0.45, t.z); G.scene.add(sp); G.props.push(sp);
    MFX.traps.push({ x: t.x, z: t.z, sp, ph: Math.random() * SPIKE.cycle, hit: false });
  }
  for (const p of gen.pools || []){
    const water = p.kind === 'water', cells = [];
    for (let j = p.z0; j <= p.z1; j++) for (let i = p.x0; i <= p.x1; i++){ const k = j * m.w + i; if (i < 0 || j < 0 || i >= m.w || j >= m.h || m.solid[k] || m.hgt[k]) continue; cells.push([i, j]); m.slow[k] = water ? 0.72 : 0.55; }
    if (!cells.length) continue;
    const mat = new THREE.MeshStandardMaterial({ color: water ? 0x3d6f8f : 0x4a3a26, emissive: water ? 0x0e2a3c : 0x1a1208, roughness: water ? 0.15 : 0.95, metalness: water ? 0.3 : 0, transparent: true, opacity: water ? 0.62 : 0.85 });   // 어둠 속에서도 희미하게 보이게
    for (const [i, j] of cells){ const q = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), mat); q.rotation.x = -Math.PI / 2; q.position.set(i, 0.015, j); G.scene.add(q); G.props.push(q); }
    MFX.pools.push({ mat, water, ph: Math.random() * 6 });
  }
}
function mapFxTick(dt){
  if (MFX.sea){ MFX.sea.wave.offset.x = (MFX.sea.wave.offset.x + dt * 0.006) % 1; MFX.sea.foam.material.opacity = 0.32 + Math.sin(G.t * 0.7) * 0.08; }
  for (const p of MFX.pools) if (p.water){ p.ph += dt; p.mat.opacity = 0.55 + Math.sin(p.ph * 1.7) * 0.07; }
  for (const t of MFX.traps){
    const prev = t.ph; t.ph = (t.ph + dt) % SPIKE.cycle;
    const upAt = SPIKE.cycle - SPIKE.up, warnAt = upAt - SPIKE.warn;
    let y = -0.45;
    if (t.ph >= upAt){ y = 0; if (prev < upAt || prev > t.ph) t.hit = false; }
    else if (t.ph >= warnAt){ y = -0.36 + Math.sin(G.t * 60) * 0.02; }
    t.sp.position.y += (y - t.sp.position.y) * Math.min(1, dt * 30);
    if (t.ph >= upAt && !t.hit){
      t.hit = true; SFX.thump && SFX.thump(300, 0.15, 0.05);
      for (const u of G.units){
        if (u.dead || u.downed || (u.jy || 0) > 0.3 || u.D.boss || u.airborne) continue;
        if (Math.abs(u.x - t.x) > 0.55 || Math.abs(u.z - t.z) > 0.55) continue;
        hurt(null, u, Math.max(4, u.max * SPIKE.dmg), { noCrit: true, unblockable: true, pierce: true });
        spark(u.x, u.y + 0.3, u.z, 0xd0c8c0, 8, 3); popText(u.x, u.y + 1.6, u.z, '가시!', 'hurt', 0.7);
        if (typeof clashLog === 'function' && u === G.player) clashLog('바닥에서 가시가 솟았다.');
      }
    }
  }
}

/* ---------- v1.1 먼 바다 (납작한 판): 하늘 · 수평선 · 달 · 바다 + 앞에 흐르는 물결 판 ---------- */
const seaTex = canvasTex(1024, 512, (c, w, h) => {
  const hz = h * 0.46, sky = c.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, '#0a0d18'); sky.addColorStop(1, '#2a3446'); c.fillStyle = sky; c.fillRect(0, 0, w, hz);
  c.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 70; i++){ c.globalAlpha = Math.random() * 0.6; c.fillRect(Math.random() * w, Math.random() * hz * 0.8, 1.5, 1.5); } c.globalAlpha = 1;
  const mx = w * 0.72, my = hz * 0.42, g = c.createRadialGradient(mx, my, 4, mx, my, 70); g.addColorStop(0, 'rgba(255,248,220,.95)'); g.addColorStop(0.25, 'rgba(255,240,200,.35)'); g.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = g; c.fillRect(mx - 80, my - 80, 160, 160);
  const sea = c.createLinearGradient(0, hz, 0, h); sea.addColorStop(0, '#24384a'); sea.addColorStop(1, '#0c1820'); c.fillStyle = sea; c.fillRect(0, hz, w, h - hz);
  c.fillStyle = 'rgba(255,240,200,.18)'; for (let y = hz + 4; y < h; y += 6) c.fillRect(mx - 30 - (y - hz) * 0.18, y, 60 + (y - hz) * 0.36, 1.5);   // 달빛 길
  c.strokeStyle = 'rgba(160,190,210,.18)'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, hz); c.lineTo(w, hz); c.stroke();
});
const waveTex = canvasTex(512, 128, (c, w, h) => { c.strokeStyle = 'rgba(200,225,240,.55)'; c.lineWidth = 1.4; for (let i = 0; i < 26; i++){ const y = 8 + Math.random() * (h - 16), x = Math.random() * w, L = 20 + Math.random() * 50; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + L / 2, y - 3, x + L, y); c.stroke(); } });
function seaBackdrop(m){
  const W = m.w + 90, z = -16, cx = m.w / 2;
  waveTex.wrapS = THREE.RepeatWrapping; waveTex.repeat.set(4, 1);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(W, 34), new THREE.MeshBasicMaterial({ map: seaTex, fog: false, depthWrite: false }));
  back.position.set(cx, 2.5, z); G.scene.add(back); G.props.push(back);   // 수평선이 벽 위로 보이게 (판 가운데 y 2.5 → 수평선 y ≈ 4)
  const foam = new THREE.Mesh(new THREE.PlaneGeometry(W, 9), new THREE.MeshBasicMaterial({ map: waveTex, transparent: true, opacity: 0.32, fog: false, depthWrite: false }));
  foam.position.set(cx, -3.5, z + 0.5); G.scene.add(foam); G.props.push(foam);
  MFX.sea = { back, foam, wave: waveTex };
  if (typeof EXP !== 'undefined' && EXP) EXP.seaView = true;
}
