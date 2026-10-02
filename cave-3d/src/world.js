/* world.js v0.1 — 맵: 글자 지도 → 3D 판. 맵은 절대 움직이지 않음 (움직이는 건 카메라뿐)
   # 벽 · . 바닥 · ^ 높은 바닥 (0.8) · / 경사 (0.4) · o 기둥 (시야 막음) · r 바위 (발은 막고 시야는 안 막음)
   f 모닥불 · G 석문 · 그 밖의 글자는 바닥 위의 표시 (P 시작, s 검사, p 창병, d 검방패병, b 곤봉 거한, A 높은 곳 궁수, J 적뢰, x 시체, m 메모, R 레베카, M 모닝스타, N 노먼, D 허수아비) */
'use strict';
const HIGH = 0.8, RAMP = 0.4;

function buildWorld(rows, opt = {}){
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const map = { w, h, rows: rows.map(r => r.padEnd(w, '#')), hgt: new Float32Array(w * h), solid: new Uint8Array(w * h), los: new Uint8Array(w * h),
    group: new THREE.Group(), spawns: [], pillars: [], lights: [], fires: [], gate: null };
  const at = (x, z) => (x < 0 || z < 0 || x >= w || z >= h) ? '#' : map.rows[z][x];
  for (let z = 0; z < h; z++) for (let x = 0; x < w; x++){
    const c = at(x, z), i = z * w + x;
    if (c === '#' || c === 'G'){ map.solid[i] = 1; map.los[i] = 1; }
    else if (c === 'o'){ map.solid[i] = 1; map.los[i] = 1; }
    else if (c === 'r' || c === 'f'){ map.solid[i] = 1; }
    if (c === '^' || c === 'A') map.hgt[i] = HIGH;
    else if (c === '/') map.hgt[i] = RAMP;
    if ('PspdbAJmxRMND'.includes(c)) map.spawns.push({ c, x, z });
  }
  // 바닥 · 높은 바닥 (한 칸씩 살짝 다른 돌 색, 사이에 어두운 틈 → 체스판 아님)
  const box = new THREE.BoxGeometry(1, 1, 1);
  const floorTiles = [], wallTiles = [];
  for (let z = 0; z < h; z++) for (let x = 0; x < w; x++){
    const c = at(x, z);
    if (c === '#' || c === 'G') wallTiles.push([x, z]); else floorTiles.push([x, z]);
  }
  const fc = new THREE.Color(), base = new THREE.Color(opt.floor || 0x3a3640), m4 = new THREE.Matrix4();
  const floorMesh = new THREE.InstancedMesh(box, new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 }), floorTiles.length);
  floorTiles.forEach(([x, z], k) => {
    const hh = map.hgt[z * w + x], th = 0.2 + hh;
    m4.makeScale(0.995, th, 0.995); m4.setPosition(x, hh - th / 2, z); floorMesh.setMatrixAt(k, m4);
    const v = 0.78 + Math.random() * 0.22 + (hh > 0 ? 0.14 : 0) + ((x * 7 + z * 13) % 5 === 0 ? -0.08 : 0);
    fc.copy(base).multiplyScalar(v); floorMesh.setColorAt(k, fc);
  });
  floorMesh.receiveShadow = true; map.group.add(floorMesh);
  // 바닥 아래 틈 메움 (틈이 공허로 보이지 않게)
  const under = new THREE.Mesh(new THREE.PlaneGeometry(w + 6, h + 6), new THREE.MeshStandardMaterial({ color: 0x0b0a0d, roughness: 1 }));
  under.rotation.x = -Math.PI / 2; under.position.set(w / 2 - 0.5, -0.19, h / 2 - 0.5); map.group.add(under);
  // 벽: 북쪽에 바닥이 있는 벽 (= 카메라 쪽 벽)은 낮게, 나머지는 높게. 바깥 덩어리 바위는 윗면만 어둡게
  const wallMesh = new THREE.InstancedMesh(box, new THREE.MeshStandardMaterial({ roughness: 0.95 }), wallTiles.length);
  const wc = new THREE.Color(opt.wall || 0x26232c);
  wallTiles.forEach(([x, z], k) => {
    const open = c => c !== '#' && c !== 'G';
    const nearFloor = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]].some(([dx, dz]) => open(at(x + dx, z + dz)));
    const southWall = open(at(x, z - 1)) && !open(at(x, z + 1));
    const hh = !nearFloor ? 2.6 : southWall ? 0.5 : 2.4;
    m4.makeScale(1, hh, 1); m4.setPosition(x, hh / 2 - 0.2, z); wallMesh.setMatrixAt(k, m4);
    fc.copy(wc).multiplyScalar(nearFloor ? 0.9 + Math.random() * 0.25 : 0.45); wallMesh.setColorAt(k, fc);
  });
  wallMesh.castShadow = true; wallMesh.receiveShadow = true; map.group.add(wallMesh);
  // 기둥 (각자 재질: 뒤에 누가 서면 반투명)
  const pg = new THREE.CylinderGeometry(0.36, 0.42, 2.6, 10);
  for (let z = 0; z < h; z++) for (let x = 0; x < w; x++){
    const c = at(x, z);
    if (c === 'o'){
      const m = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ color: opt.pillar || 0x4a4552, roughness: 0.85, transparent: true }));
      m.position.set(x, 1.3, z); m.castShadow = true; m.receiveShadow = true; map.group.add(m); map.pillars.push(m);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 1), m.material); cap.position.y = 1.35; m.add(cap);
    }
    if (c === 'r'){
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45, 0), new THREE.MeshStandardMaterial({ color: 0x55505a, roughness: 1, flatShading: true }));
      m.position.set(x, 0.25, z); m.scale.set(1, 0.7, 1); m.rotation.y = Math.random() * 3; m.castShadow = true; map.group.add(m);
    }
    if (c === 'f') map.fires.push(makeFire(map, x, z));
    if (c === 'G'){
      const g = new THREE.Mesh(new THREE.BoxGeometry(1, 2.8, 0.5), new THREE.MeshStandardMaterial({ color: 0x55606e, roughness: 0.8, emissive: 0x16222e }));
      g.position.set(x, 1.2, z + 0.2); map.group.add(g);
      if (!map.gate) map.gate = { x: x + 0.5, z: z + 0.8 }; else map.gate.x = (map.gate.x + x) / 2 + 0.25;
    }
  }
  // 경사 표시 (밝은 줄무늬)
  for (let z = 0; z < h; z++) for (let x = 0; x < w; x++) if (at(x, z) === '/'){
    const s = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ color: 0x8d8573, transparent: true, opacity: 0.18 }));
    s.rotation.x = -Math.PI / 2; s.position.set(x, RAMP + 0.01, z); map.group.add(s);
  }
  return map;
}
function makeFire(map, x, z){
  const g = new THREE.Group(); g.position.set(x, 0, z);
  const logM = new THREE.MeshStandardMaterial({ color: 0x3b2817, roughness: 1 });
  for (let i = 0; i < 4; i++){ const l = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.8, 6), logM); l.rotation.z = Math.PI / 2; l.rotation.y = i * Math.PI / 4; l.position.y = 0.08; g.add(l); }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 6, 12), new THREE.MeshStandardMaterial({ color: 0x5a5560, roughness: 1 }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.05; g.add(ring);
  const flameTex = canvasTex(64, 128, (c, w, h) => {
    const gr = c.createRadialGradient(w / 2, h * 0.75, 2, w / 2, h * 0.6, h * 0.55);
    gr.addColorStop(0, 'rgba(255,240,180,1)'); gr.addColorStop(0.35, 'rgba(255,150,40,0.9)'); gr.addColorStop(1, 'rgba(255,60,0,0)');
    c.fillStyle = gr; c.beginPath(); c.moveTo(w / 2, 4); c.quadraticCurveTo(w, h * 0.7, w / 2, h); c.quadraticCurveTo(0, h * 0.7, w / 2, 4); c.fill();
  });
  const flame = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.2), new THREE.MeshBasicMaterial({ map: flameTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  flame.position.y = 0.6; g.add(flame);
  const light = new THREE.PointLight(0xff9a4a, 2.2, 9, 1.6); light.position.set(0, 1.0, 0); g.add(light);
  map.group.add(g);
  return { x, z, g, flame, light };
}
function tileAt(map, x, z){ const i = Math.round(x), j = Math.round(z); return (i < 0 || j < 0 || i >= map.w || j >= map.h) ? '#' : map.rows[j][i]; }
function heightAt(map, x, z){ const i = Math.round(x), j = Math.round(z); if (i < 0 || j < 0 || i >= map.w || j >= map.h) return 0; return map.hgt[j * map.w + i]; }
function solidAt(map, x, z){ const i = Math.round(x), j = Math.round(z); if (i < 0 || j < 0 || i >= map.w || j >= map.h) return true; return !!map.solid[j * map.w + i]; }
// 발 디딜 수 있나: 막힌 칸이 아니고, 높이 차가 0.45 이하 (경사를 거쳐야 높은 곳으로)
function standable(map, x, z, fromH, r = 0.28){
  for (const [dx, dz] of [[r, r], [-r, r], [r, -r], [-r, -r]]){
    if (solidAt(map, x + dx, z + dz)) return false;
    if (Math.abs(heightAt(map, x + dx, z + dz) - fromH) > 0.45) return false;
  }
  return true;
}
// 시야 (화살 · 투창 · 붉은 창): 벽 · 기둥 · 석문이 막음. 바위는 안 막음
function losClear(map, ax, az, bx, bz){
  const d = Math.hypot(bx - ax, bz - az), n = Math.ceil(d / 0.2);
  for (let k = 1; k < n; k++){
    const x = ax + (bx - ax) * k / n, z = az + (bz - az) * k / n, i = Math.round(x), j = Math.round(z);
    if (i < 0 || j < 0 || i >= map.w || j >= map.h || map.los[j * map.w + i]) return false;
  }
  return true;
}
// 비: 카메라 주변 상자 안에서 떨어지는 선
function makeRain(){
  const N = 1400, pos = new Float32Array(N * 6);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.LineBasicMaterial({ color: 0x9fb4d0, transparent: true, opacity: 0.45 });
  const lines = new THREE.LineSegments(geo, mat); lines.frustumCulled = false;
  const drops = Array.from({ length: N }, () => ({ x: rnd(-14, 14), y: rnd(0, 12), z: rnd(-12, 10), v: rnd(16, 22) }));
  return { lines, drops, on: false, freeze: 0,
    update(dt, cx, cz){
      lines.visible = this.on;
      if (!this.on) return;
      const a = geo.attributes.position.array, sp = this.freeze > 0 ? 0.04 : 1;
      drops.forEach((d, k) => {
        d.y -= d.v * dt * sp; if (d.y < 0){ d.y = rnd(9, 13); d.x = rnd(-14, 14); d.z = rnd(-12, 10); }
        const x = cx + d.x, z = cz + d.z;
        a[k * 6] = x; a[k * 6 + 1] = d.y; a[k * 6 + 2] = z; a[k * 6 + 3] = x - 0.05; a[k * 6 + 4] = d.y - 0.5; a[k * 6 + 5] = z + 0.08;
      });
      geo.attributes.position.needsUpdate = true;
    } };
}
