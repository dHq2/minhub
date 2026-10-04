/* weapons.js v1.0 — 인주의 무기
   · 손에 보이는 무기: 도감 그림 (art/atlas/held*.webp)을 손 자리에 붙임. 평소엔 등에 메고, 공격할 때 손에 들고 실제로 휘두름 (궤적이 남음)
   · 무기 14종마다 기본 공격 (좌클릭 · J)과 무기 스킬 (우클릭 · K)이 다름. 변형 (레이피어 · 일본도 · 낫 · 도끼창 · 채찍 · 대포 · 광선총 …)은 수치와 작은 효과
   · 화살: 맞으면 몸에 박힌 채 보임 → 죽으면 둘레에 떨어짐 (일부 부러짐). 갑옷 · 방패 · 막기에 맞으면 튕겨 나가 바닥에. 빗나가면 바닥 · 벽에 꽂힘. 위를 지나가면 주움
   · 총알 · 산탄: 탄창 · 재장전 (R). 쏘면 사라짐 (못 주움) */
'use strict';
// 인주 포즈의 손 (그림 픽셀, 2D판 자료 그대로). 3D 포즈 이름 기준: attack = 내지름 (inju_charge) · windup = 당김 (inju_attack)
const HAND = { attack: [267, 58], throw: [190, 153], shoot: [13, 46], windup: [214, 134], aim: [9, 72], hurt: [140, 150] };
// 대기 · 걷기 · 뛰기 그림마다 등 (무기를 메는 자리): [머리x, 머리y, ?, 등x, 등y, ?, 키]
const INJU_ANC = {"idle":[[104,2,80,110,72,123,351],[104,1,80,110,71,123,352],[104,1,79,109,71,123,352],[104,0,80,110,70,123,353],[104,0,79,110,70,123,353],[104,0,79,110,70,123,353],[104,0,80,109,70,123,353],[104,0,80,109,70,123,353],[104,1,79,110,71,123,352],[104,1,80,110,71,123,352],[104,2,80,110,72,123,351],[104,1,80,110,71,123,352],[104,1,79,109,71,123,352],[104,0,80,110,70,123,353],[104,0,79,110,70,123,353],[104,0,79,110,70,123,353],[104,0,80,109,70,123,353],[104,0,80,109,70,123,353],[104,1,79,110,71,123,352],[104,1,80,110,71,123,352]],
  "walk":[[176,9,98,144,79,189,350],[151,6,99,123,76,181,352],[166,9,98,135,79,192,350],[153,0,97,135,71,165,359],[173,2,103,147,73,191,357],[150,6,99,122,76,181,352],[167,0,100,139,71,182,359],[151,0,97,133,71,165,359]],
  "run":[[241,21,113,189,84,232,317],[256,15,115,208,79,170,324],[240,12,115,191,77,211,327],[240,0,114,202,62,207,311],[240,19,115,193,82,231,319],[256,15,115,208,79,170,324],[240,12,115,191,77,211,327],[239,0,113,194,63,223,317]],
  "attack":[[152,0,74,118,53,155,266]],"windup":[[136,0,72,147,67,138,336]],"aim":[[136,0,72,147,67,138,336]],"throw":[[98,0,70,126,67,128,337]],"shoot":[[143,0,158,149,67,110,339]],"hurt":[[59,0,100,106,68,140,342]]};
SPR.player.poses.shoot = { src: A + 'inju_shoot.png', w: 254, h: 340, ax: 133, ay: 340, f: -1 };

// ---------- 무기 종류 ----------
// 근접 combo: r 사거리 · arc 폭 · mul 배율 · kb 밀침 · wind 예고 · cd 대기 · style (thrust 찌름 · slash 벰 · smash 내려찍음 · bash 밀침 · punch)
const WK = {
  fist: { name: '맨손', cls: 'melee', combo: [{ r: 1.25, arc: 1.4, mul: 0.55, kb: 0.8, wind: 0.12, cd: 0.32, style: 'punch' }], skill: null },
  spear: { cls: 'melee', combo: [{ r: 1.9, arc: 1.6, mul: 1, kb: 0.5, wind: 0.11, cd: 0.32, style: 'thrust' }, { r: 1.9, arc: 1.6, mul: 1, kb: 0.5, wind: 0.11, cd: 0.32, style: 'thrust' },
    { r: 2.2, arc: 1.2, mul: 1.6, kb: 1.4, wind: 0.2, cd: 0.55, stun: 0.35, style: 'thrust', strong: 1 }], skill: 'throw', skillName: '투창', throwMul: [1.2, 1.6] },
  sword: { cls: 'melee', combo: [{ r: 1.6, arc: 2.0, mul: 1, kb: 0.4, wind: 0.08, cd: 0.26, style: 'slash' }, { r: 1.6, arc: 2.0, mul: 1.05, kb: 0.4, wind: 0.08, cd: 0.26, style: 'slash2' },
    { r: 1.8, arc: 2.4, mul: 1.5, kb: 1, wind: 0.14, cd: 0.45, stun: 0.25, style: 'slash', strong: 1 }], skill: 'counter', skillCd: 5, skillName: '반격 자세' },
  greatsword: { cls: 'melee', combo: [{ r: 2.1, arc: 2.6, mul: 1.15, kb: 1, wind: 0.22, cd: 0.6, style: 'slash' }, { r: 2.1, arc: 2.6, mul: 1.15, kb: 1, wind: 0.22, cd: 0.6, style: 'slash2' },
    { shape: 'circle', off: 1.2, r: 1.4, mul: 1.9, kb: 1.6, wind: 0.35, cd: 0.8, stun: 0.5, style: 'smash', pierce: 1, strong: 1 }], skill: 'spin', skillCd: 6, skillName: '회전 베기' },
  dagger: { cls: 'melee', combo: [{ r: 1.3, arc: 1.3, mul: 0.8, kb: 0.2, wind: 0.05, cd: 0.18, style: 'thrust', back: 1.6 }, { r: 1.3, arc: 1.3, mul: 0.8, kb: 0.2, wind: 0.05, cd: 0.18, style: 'thrust', back: 1.6 },
    { r: 1.3, arc: 1.3, mul: 0.85, kb: 0.2, wind: 0.05, cd: 0.18, style: 'thrust', back: 1.6 }, { r: 1.45, arc: 1.5, mul: 1.3, kb: 0.6, wind: 0.08, cd: 0.32, style: 'slash', back: 1.6, strong: 1 }], skill: 'shadow', skillCd: 5, skillName: '그림자 걸음' },
  axe: { cls: 'melee', combo: [{ r: 1.5, arc: 1.9, mul: 1.1, kb: 0.6, wind: 0.16, cd: 0.45, style: 'slash', bleed: 0.35 }, { r: 1.6, arc: 2.1, mul: 1.35, kb: 1, wind: 0.2, cd: 0.55, style: 'smash', bleed: 0.6, pierce: 1, strong: 1 }],
    skill: 'throw', skillName: '도끼 던지기', throwMul: [1.4, 1.4], spin: 1 },
  hammer: { cls: 'melee', combo: [{ shape: 'circle', off: 1.1, r: 1.2, mul: 1.5, kb: 1.6, wind: 0.32, cd: 0.75, stun: 0.5, style: 'smash', pierce: 1 }, { shape: 'circle', off: 1.1, r: 1.2, mul: 1.5, kb: 1.6, wind: 0.32, cd: 0.75, stun: 0.5, style: 'smash', pierce: 1 },
    { shape: 'circle', off: 1.25, r: 1.6, mul: 2.0, kb: 2.2, wind: 0.4, cd: 0.9, stun: 0.8, style: 'smash', pierce: 1, strong: 1 }], skill: 'quake', skillCd: 7, skillName: '땅울림' },
  shield: { cls: 'melee', combo: [{ r: 1.3, arc: 1.6, mul: 0.8, kb: 2, wind: 0.08, cd: 0.4, stun: 0.4, style: 'bash' }], skill: 'wall', skillCd: 9, skillName: '방패 올리기', guard: 0.08 },
  staff: { cls: 'magic', cd: 0.5, speed: 15, range: 12, skill: 'nova', skillCd: 6, skillName: '마력 폭발' },
  bow: { cls: 'bow', ammo: 'arrow', cd: 0.55, speed: 27, range: 15, skill: 'draw', skillName: '힘껏 쏘기' },
  crossbow: { cls: 'gun', ammo: 'arrow', mag: 1, reload: 1.1, cd: 0.25, speed: 34, range: 17, bolt: 1, pierceDef: 0.5, skill: 'volley', skillCd: 8, skillName: '연발' },
  pistol: { cls: 'gun', ammo: 'bullet', mag: 6, reload: 1.6, cd: 0.22, spread: 0.05, speed: 42, range: 13, skill: 'fan', skillCd: 6, skillName: '연사' },
  shotgun: { cls: 'gun', ammo: 'shell', mag: 2, reload: 2.3, cd: 0.8, pellets: 6, spread: 0.42, speed: 36, range: 7, kb: 0.6, skill: 'blast', skillCd: 6, skillName: '밀쳐 내기' },
  lever: { cls: 'gun', ammo: 'bullet', mag: 8, reload: 2.6, cd: 0.7, spread: 0.012, speed: 55, range: 19, pierce: 2, skill: 'aimShot', skillName: '조준 사격' },
  assault: { cls: 'gun', ammo: 'bullet', mag: 30, reload: 5, cd: 0.085, spread: 0.03, speed: 46, range: 14, auto: 1, skill: 'focus', skillName: '집중 사격' },
};
for (const [k, W] of Object.entries(WK)){ W.id = k; W.name = W.name || WT_N[k]; }
const WK_D = {
  spear: '긴 찌르기 3연 (3타째 강공) · 우클릭 투창: 누르고 있다 다 차기 직전에 놓으면 "완벽" (확정 치명 · 꿰뚫음). 던지면 주워야 함',
  sword: '빠른 베기 3연 · 우클릭 반격 자세: 0.9초 안에 들어온 근접을 흘리고 확정 치명으로 되벰. 갑옷 · 방패에 약함',
  greatsword: '넓게 두 번 벤 뒤 내려찍기 (막기 무시) · 우클릭 회전 베기: 둘레를 두 번 벰',
  dagger: '아주 빠른 찌르기 4연, 등 뒤를 찌르면 +60% · 우클릭 그림자 걸음: 적 등 뒤로 순식간에 돌아가 다음 공격은 치명',
  axe: '무거운 베기 (출혈) · 두 번째는 방패를 깸 · 우클릭 도끼 던지기: 빙글 날아가 잘 박힘. 주워야 함',
  hammer: '내려찍기 (휘청 · 방패 무시, 3타째 크게) · 우클릭 땅울림: 둘레 모두 쓰러뜨림. 아주 느림',
  shield: '밀치기 (휘청) · F 막기가 90% · 우클릭 방패 올리기: 4초 동안 앞에서 오는 것 모두 막고 화살을 되받아침',
  staff: '마력탄 (탄약 없음, 정신으로 셈) · 우클릭 누르고 있다 놓기: 마력 폭발 (모은 만큼 크게)',
  bow: '화살 한 발 (화살을 씀 · 맞은 화살은 주움) · 우클릭 힘껏 쏘기: 누르고 있다 놓기. 다 차면 꿰뚫음, 완벽이면 치명',
  crossbow: '무거운 볼트 (방어 반 무시, 쏠 때마다 장전) · 우클릭 연발: 볼트 셋을 잇달아',
  pistol: '빠른 사격 (6발) · R 재장전 · 우클릭 연사: 남은 탄을 모두 쏟아 냄',
  shotgun: '부채꼴 산탄 (2발, 가까울수록 셈) · 우클릭 밀쳐 내기: 코앞에 한 발 (크게 밀침)',
  lever: '정밀 사격 (8발, 꿰뚫음) · 우클릭 조준 사격: 멈춰서 겨누고 놓으면 확정 치명',
  assault: '누르고 있으면 연사 (30발, 재장전 5초) · 우클릭 집중 사격: 흩어짐이 줄고 피해 +15% (느리게 걸음)',
  fist: '주먹 (약함)',
};
// 변형: 수치를 바꿈
const VR = {
  rapier: { styleAll: 'thrust', rMul: 1.1, arcMul: 0.6 }, katana: { rMul: 1.08 }, scimitar: { arcMul: 1.15 }, dual: { cdMul: 0.85, mulMul: 0.9 },
  halberd: { rMul: 1.1, arcMul: 1.25, styleAll: 'slash' }, glaive: { arcMul: 1.35, styleAll: 'slash' }, pike: { rMul: 1.25, arcMul: 0.7 }, banner: {}, trident: { arcMul: 1.1 },
  whip: { shape: 'line', rMul: 1.6, wLine: 0.55, mulMul: 0.8, styleAll: 'slash' }, scythe: { arcMul: 1.25, rMul: 1.05 }, fist: { rMul: 0.85, cdMul: 0.8 },
  fan: { kbMul: 2 }, chakram: {}, katar: { cdMul: 0.9 }, wrist: {}, hand: { cdMul: 0.85 }, cleaver: {}, mace: { cdMul: 0.85, rMul: 0.9 }, flail: { rMul: 1.15 }, pick: {}, shovel: {}, brick: { cdMul: 0.9 },
  umbrella: {}, dryer: { cone: 1 }, flint: { mag: 1, reload: 2.0, shotMul: 2.3 }, laser: { ammo: 'cell', mag: 12, pierce: 3, beam: 1 }, cannon: { pellets: 1, boom: 1.9, mag: 1, reload: 2.8, shotMul: 3.2, spread: 0 },
  blunder: { pellets: 9, spread: 0.62 }, spray: { pellets: 10, spread: 0.7, range: 4.5, shotMul: 0.35, slow: 1 }, sniper: { range: 24, shotMul: 1.25 }, smg: { cd: 0.07, spread: 0.065, mag: 32, reload: 3.4, shotMul: 0.8 },
  heavy: { cd: 0.11, shotMul: 1.3, spread: 0.05, mag: 40, reload: 6 }, long: { range: 19, speed: 31 }, sling: { ammo: null, shotMul: 0.75 },
};
const W = { def: WK.fist, it: null, d: null };   // 지금 든 무기
function curWeapon(u){
  const h = u && u.hero, it = h && h.eq.weapon;
  if (!it) return { ...WK.fist, it: null, d: null, kind: 'fist' };
  const d = itemDef(it), base = WK[d.wt] || WK.fist, v = VR[d.vr] || {};
  const w = { ...base, ...v, it, d, kind: d.wt, vr: d.vr };
  if (base.combo){
    w.combo = base.combo.map(c => {
      const o = { ...c, r: c.r * (v.rMul || 1) * (1 + ((u.fx && u.fx.reach) || 0) / 100), arc: (c.arc || 0) * (v.arcMul || 1) * (1 + ((u.fx && u.fx.arc) || 0) / 100), mul: c.mul * (v.mulMul || 1), cd: c.cd * (v.cdMul || 1), kb: (c.kb || 0) * (v.kbMul || 1) };
      if (v.styleAll && c.style !== 'smash') o.style = v.styleAll;
      if (v.shape === 'line'){ o.shape = 'line'; o.len = o.r * 1.15; o.w = v.wLine; }
      return o;
    });
  }
  if (u.fx && u.fx.oneShot){ w.mag = 1; w.reload = 2.0; w.shotMul = 2.3; }
  return w;
}

// ---------- 손에 든 무기 그림 ----------
// 묶음 그림 한 장을 모두가 같이 씀 (그림판 uv만 칸에 맞춤 → GPU에 한 번만 올라감)
const heldSheets = [];
function heldSheet(si){ return heldSheets[si] || (heldSheets[si] = loadTex(ITEM_ART.held.sheets[si])); }
function heldGeo(geo, base, k, wf, hf){
  const A2 = ITEM_ART.held, set = () => {
    const Wd = base.image.width, Ht = base.image.height, cw = Math.round(wf * A2.w), ch = Math.round(hf * A2.h);
    const col = k % A2.cols, row = Math.floor(k / A2.cols), px = col * A2.w + Math.floor((A2.w - cw) / 2), py = row * A2.h + Math.floor((A2.h - ch) / 2);
    const u0 = px / Wd, u1 = (px + cw) / Wd, v1 = 1 - py / Ht, v0 = 1 - (py + ch) / Ht, uv = geo.attributes.uv;
    // PlaneGeometry 꼭짓점: 왼위 · 오위 · 왼아래 · 오아래
    uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0); uv.needsUpdate = true;
  };
  if (base.image && base.image.width) set(); else { const tryLater = () => { if (base.image && base.image.width) set(); else setTimeout(tryLater, 150); }; tryLater(); }
}
// 무기 하나 = 그림판 (손잡이가 원점). 세우는 무기 (활 · 방패)는 가운데가 원점
function makeHeldMesh(d){
  if (!d || !d.h) return null;
  const [n, wf, hf, up] = d.h, A2 = ITEM_ART.held, per = A2.cols * A2.rows, base = heldSheet(Math.floor(n / per));
  const grip = up ? 0.5 : (ITEM_ART.grip[d.wt] ?? 0.3);
  const geo = new THREE.PlaneGeometry(1, 1); geo.translate(0.5 - grip, 0, 0);
  heldGeo(geo, base, n % per, wf, hf);
  const mat = new THREE.MeshBasicMaterial({ map: base, transparent: false, alphaTest: 0.32, side: THREE.DoubleSide, fog: true });
  const m = new THREE.Mesh(geo, mat);
  const aspect = (hf * A2.h) / Math.max(1, wf * A2.w);
  const L = (d.L || 1) * SPRITE_SCALE;
  if (up){ m.scale.set(L / aspect, L, 1); } else m.scale.set(L, L * aspect, 1);
  m.userData = { grip, L, up: !!up, aspect };
  return m;
}
const HW_ = { g: null, mesh: null, trail: null, flash: null, key: '', u: null };
function weaponRefresh(u){
  if (!u.hero) applyHero(u, hero('inju'));
  const swap = HW_.u === u;   // 같은 사람이 무기를 바꿈 (새 판에서 처음 그리는 것과 구분)
  const w = curWeapon(u);
  W.def = w; W.it = w.it; W.d = w.d;
  if (HW_.g){ HW_.g.parent && HW_.g.parent.remove(HW_.g); HW_.g = null; }
  if (swap && P.spearObj){ G.scene.remove(P.spearObj.m); P.spearObj = null; }   // 무기를 바꾸면 던져 둔 것은 손으로 돌아옴
  HW_.u = u;
  const m = makeHeldMesh(w.d);
  HW_.mesh = m; HW_.key = w.it ? w.it.uid : '';
  if (m){
    const g = new THREE.Group(); g.add(m); u.pivot.add(g); HW_.g = g;
    HW_.trail = makeTrail(); g.add(HW_.trail.mesh);
    const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color: 0xffd890, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); fl.visible = false; fl.scale.set(0.55, 0.55, 1); g.add(fl); HW_.flash = fl;
  }
  if (swap){ P.spear = true; P.combo = 0; P.aiming = false; P.reloadT = 0; P.burst = null; }
  if (w.it && w.mag && w.it.mag == null) w.it.mag = w.mag;   // 새로 얻은 총은 장전된 채로
}
// 휘두른 궤적: 칼끝 ~ 칼 가운데를 이은 띠 (최근 0.12초)
function makeTrail(){
  const N = 12, pos = new Float32Array(N * 2 * 3), col = new Float32Array(N * 2 * 3), idx = [];
  for (let i = 0; i < N - 1; i++){ const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.setIndex(idx);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  mesh.frustumCulled = false; mesh.visible = false; mesh.renderOrder = 30;
  return { mesh, geo, pos, col, pts: [], N };
}
function pushTrail(tip, mid, color){
  const T = HW_.trail; if (!T) return;
  T.pts.unshift({ tip: tip.clone(), mid: mid.clone(), t: G.t, c: color }); if (T.pts.length > T.N) T.pts.pop();
}
function drawTrail(){
  const T = HW_.trail; if (!T) return;
  T.pts = T.pts.filter(p => G.t - p.t < 0.14);
  T.mesh.visible = T.pts.length > 1;
  if (!T.mesh.visible) return;
  for (let i = 0; i < T.N; i++){
    const p = T.pts[Math.min(i, T.pts.length - 1)], k = Math.max(0, 1 - (G.t - p.t) / 0.14) * (1 - i / T.N) * 0.55, c = new THREE.Color(p.c);
    T.pos.set([p.tip.x, p.tip.y, p.tip.z + 0.01, p.mid.x, p.mid.y, p.mid.z + 0.01], i * 6);
    T.col.set([c.r * k, c.g * k, c.b * k, c.r * k * 0.25, c.g * k * 0.25, c.b * k * 0.25], i * 6);
  }
  T.geo.attributes.position.needsUpdate = true; T.geo.attributes.color.needsUpdate = true;
}
// 포즈의 한 픽셀 → 오른쪽을 보는 기준의 자리 (발이 원점)
function poseLocal(u, pose, px, py){
  const PS = u.S.poses[pose] || u.S.poses.idle, k = u.S.tall * SPRITE_SCALE / u.S.h0 * (PS.scale || 1);
  return new THREE.Vector3((px - PS.ax) * k * (PS.f || 1), (PS.ay - py) * k, 0);
}
const _wv = new THREE.Vector3();
function heldUpdate(dt){
  const u = G.player; if (!u) return;
  // 날아가는 것: 따라가는 마력탄 · 빙글 도는 도끼
  for (const p of G.projs){
    if (p.home && !p.home.dead){ const want = Math.atan2(p.home.z - p.z, p.home.x - p.x), d = angDiff(want, p.a); p.a += clamp(d, -p.homeK * dt, p.homeK * dt); p.m.rotation.y = -p.a; }
    if (p.holder && p.spin) p.holder.rotation.z += dt * 20;
  }
  if (HW_.u !== u || HW_.key !== (u.hero && u.hero.eq.weapon ? u.hero.eq.weapon.uid : '')) weaponRefresh(u);
  tickPickups(dt);
  if (!HW_.g) return;
  const m = HW_.mesh, g = HW_.g, ud = m.userData, w = W.def;
  g.visible = P.spear && !u.dead && !u.downed && PLAY_MODES.has(G.mode);
  m.material.color.copy(u.mat.color);
  g.scale.x = u.face;
  const pose = u.pose, Wa = P.wa;
  let anchor, th = 0, z = 0.03, jab = 0, centered = false;
  const long = ['spear', 'staff', 'greatsword', 'lever', 'assault', 'shotgun', 'crossbow'].includes(w.kind);
  if (['attack', 'throw', 'windup', 'shoot', 'aim'].includes(pose) && !(pose === 'throw' && !P.spear)){
    if (pose === 'shoot'){ anchor = poseLocal(u, 'shoot', ...HAND.shoot); th = 0; jab = -(P.recoil || 0) * 0.15; th += (P.recoil || 0) * 0.35; }
    else if (pose === 'aim'){
      const guard = u.guard || (u.counterT > G.t) || P.wall > G.t;
      if (guard){ anchor = poseLocal(u, 'aim', ...HAND.aim); th = ud.up ? 0 : 1.35; z = 0.05; }
      else if (P.aimMode === 'throw'){ anchor = poseLocal(u, 'windup', ...HAND.windup); th = 0.16 + 0.2 * Math.min(1, P.charge / THROW.full); jab = -0.18 * Math.min(1, P.charge / THROW.full); }
      else { anchor = poseLocal(u, 'aim', ...HAND.aim); th = 0; }
    }
    else if (pose === 'windup'){
      anchor = poseLocal(u, 'windup', ...HAND.windup);
      const st = Wa && Wa.style || 'thrust', k = Wa ? Math.min(1, (G.t - Wa.t0) / Math.max(0.05, Wa.wind)) : 1;
      if (st === 'thrust'){ th = 0.05; jab = -0.3 * k; }
      else if (st === 'smash'){ th = 1.2 + 1.3 * k; }
      else if (st === 'bash' || st === 'punch'){ th = ud.up ? 0 : 0.8; jab = -0.2 * k; }
      else { th = 1.0 + 1.25 * k; }        // 벰: 뒤로 치켜듦
    }
    else if (pose === 'attack'){ anchor = poseLocal(u, 'attack', ...HAND.attack); const k = Wa ? Math.min(1, (G.t - Wa.t1) / 0.08) : 1; th = -0.06; jab = 0.28 * Math.sin(Math.PI * Math.min(1, k)) + 0.08; }
    else if (pose === 'throw'){
      anchor = poseLocal(u, 'throw', ...HAND.throw);
      const st = Wa && Wa.style || 'slash', k = Wa ? Math.min(1, (G.t - Wa.t1) / (st === 'smash' ? 0.11 : 0.085)) : 1, e = 1 - Math.pow(1 - k, 3);
      if (st === 'smash'){ th = 2.4 - 3.3 * e; }
      else if (st === 'slash2'){ th = -0.9 + 2.9 * e; }    // 올려 베기
      else if (st === 'spin'){ th = (G.t * 18) % (Math.PI * 2); }
      else { th = 2.2 - 3.1 * e; }                       // 내려 베기
      if (ud.up){ th = 0; jab = 0.15 * e; }
    }
  } else {
    // 메기: 등 (대기 · 걷기 · 뛰기 그림마다 자리가 다름)
    const key = INJU_ANC[pose] ? pose : 'idle', arr = INJU_ANC[key], fr = arr[Math.min(arr.length - 1, Math.max(0, u.fi || 0))];
    anchor = poseLocal(u, key, fr[3], fr[4]); z = -0.03; centered = true;
    if (ud.up){ th = -0.3; anchor.y -= 0.05; }
    else if (w.kind === 'pistol' || w.kind === 'dagger'){ anchor = poseLocal(u, key, fr[3] - 6, fr[4] + 120); th = -1.75; z = 0.03; centered = false; }
    else th = long ? 2.05 : 1.95;
  }
  m.rotation.z = th; HW_.dbg = { pose, th: +th.toFixed(2), st: Wa && Wa.style, k: Wa ? +((G.t - Wa.t0) / Math.max(0.05, Wa.wind || 0.1)).toFixed(2) : null };
  const along = centered ? -(0.5 - ud.grip) * ud.L : jab * ud.L;
  m.position.set(anchor.x + Math.cos(th) * along, anchor.y + Math.sin(th) * along, 0);
  g.position.z = z;
  // 궤적: 휘두르는 동안 칼끝 · 가운데를 기록
  const swinging = (pose === 'throw' || pose === 'attack') && Wa && G.t - Wa.t1 < 0.16 && !ud.up;
  if (swinging){
    const tip = new THREE.Vector3((1 - ud.grip) * ud.L, 0, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), th).add(m.position);
    const mid = new THREE.Vector3((0.62 - ud.grip) * ud.L, 0, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), th).add(m.position);
    pushTrail(tip, mid, Wa.color || 0xfff0c8);
  }
  drawTrail();
  // 총구 불꽃
  if (HW_.flash){ HW_.flash.visible = G.t - (P.flashAt || -9) < 0.05; if (HW_.flash.visible){ const tip = new THREE.Vector3((1 - ud.grip) * ud.L + 0.08, 0, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), th).add(m.position); HW_.flash.position.copy(tip); HW_.flash.position.z += 0.02; } }
  P.recoil = Math.max(0, (P.recoil || 0) - dt * 6);
}
// 무기 끝 (총구 · 활)의 세계 자리: 탄이 거기서 나감
function muzzleWorld(u){
  if (!HW_.mesh || !HW_.g || !HW_.g.visible) return { x: u.x, y: u.y + (u.jy || 0) + 1.1, z: u.z };
  const ud = HW_.mesh.userData;
  _wv.set(ud.up ? 0.5 : 1 - ud.grip, 0, 0); HW_.mesh.updateMatrixWorld(true); HW_.mesh.localToWorld(_wv);
  return { x: _wv.x, y: _wv.y, z: _wv.z };
}

// ---------- 조준 ----------
function pickAim(u, mv, range = 3){
  const ap = aimPoint(u);
  const tgt = mouse.over || (!ap && nearest(u, foes().filter(e => Math.abs(angDiff(Math.atan2(e.z - u.z, e.x - u.x), u.aim)) < 1.2 && sees(u, e)), range));
  if (tgt) setAim(u, tgt.x, tgt.z); else if (ap) setAim(u, ap.x, ap.z); else if (mv) setAim(u, u.x + mv.x, u.z + mv.z);
  if (tgt && G.cmd === 'focus') G.focusTarget = tgt;
  return tgt;
}
const atkSpd = u => ((u.rpg && u.rpg.atkSpd) || 1) * (u.atkSpdBuff || 1);
const cdMul = u => (u.rpg && u.rpg.cdMul) || 1;

// ---------- 입력 (player.js가 부름). true면 이번 프레임은 무기가 씀 ----------
function weaponInput(u, dt, mv){
  const w = W.def;
  P.skCd = Math.max(0, (P.skCd || 0) - dt);
  if (P.reloadT > 0){ P.reloadT -= dt; if (P.reloadT <= 0) finishReload(u); }
  if (G.lock) return false;
  // 재장전
  if (hit('KeyR') && w.mag && w.it) startReload(u);
  // 연사 · 연발 진행 중
  if (P.burst){ tickWeaponBurst(u, dt); }
  // 스킬 (우클릭 · K)
  const holdR = mouse.right || down('KeyK'), hitR = hit('Mouse2') || hit('KeyK');
  if (P.aiming){ return aimHold(u, dt, mv, holdR); }
  if (hitR && w.skill) { if (startSkill(u, mv)) return true; }
  // 기본 공격 (좌클릭 · J): 연사 무기는 누르고 있는 동안
  // 미리 누른 공격은 0.28초 기억 (휘두르는 중에 눌러도 다음 타가 이어짐): player.js가 P.atkBuf에 적어 둠
  const wantAtk = w.auto ? (mouse.left || down('KeyJ')) && !P.uiBlock : P.atkBuf > G.t;
  if (wantAtk && P.atkCd <= 0){ P.atkBuf = 0;
    if (w.cls === 'melee') return meleeAttack(u, w, mv);
    return rangedAttack(u, w, mv);
  }
  return false;
}
// ---------- 근접 ----------
function meleeAttack(u, w, mv){
  if (!P.spear && w.skill === 'throw'){ /* 던진 뒤엔 맨손 */ w = { ...WK.fist, kind: 'fist' }; }
  const tgt = pickAim(u, mv, 3);
  const n = w.combo.length;
  P.combo = P.comboT > 0 ? (P.combo + 1) % n : 0; P.comboT = 0.75;
  const C = w.combo[P.combo], strong = !!C.strong;
  P.atkCd = C.cd / atkSpd(u);
  setPose(u, 'windup');
  const wind = C.wind / Math.min(1.5, atkSpd(u));
  P.wa = { style: C.style, t0: G.t, wind, t1: G.t + wind, color: strong ? 0xffd890 : 0xc8d8ff };
  const shape = C.shape || 'sector', off = C.off || 0;
  const o = { x: u.x + Math.cos(u.aim) * off, z: u.z + Math.sin(u.aim) * off, r: C.r, a: u.aim, arc: C.arc, len: C.len, w: C.w, windup: wind, follow: off ? null : u };
  const fx = u.fx || {};
  windup(u, shape, o, (t) => {
    let mul = C.mul;
    if (w.kind === 'fist' || w.vr === 'fist') mul *= 1 + (fx.fist || 0) / 100;
    const crit = P.critNext ? true : undefined;
    hurt(u, t, u.atk * mul, { kb: C.kb, from: u, stun: C.stun && !t.D.heavy ? C.stun : 0, strong, pierce: !!C.pierce, crit, backMul: C.back ? C.back + (fx.backstab || 0) / 100 : (fx.backstab ? 1 + fx.backstab / 100 : 0), hitsAir: u.jy > 0.6 });
    if (C.bleed && Math.random() < C.bleed) addStatus(t, 'bleed', { dps: Math.max(3, u.atk * 0.25), t: 4 });
    if (w.vr === 'whip' && fx.hookPull && !t.D.heavy){ const nn = norm(u.x - t.x, u.z - t.z); t.kx += nn.x * 8; t.kz += nn.z * 8; }
    if (fx.knock && !t.D.heavy){ const nn = norm(t.x - u.x, t.z - u.z); t.kx += nn.x * 6; t.kz += nn.z * 6; }
    if (t.side === 'enemy' && G.cmd === 'focus') G.focusTarget = t;
  }, GOLD);
  const dd = u.decal;
  dd.onDone = ((orig) => (d) => {
    if (!off){ d.a = u.aim; d.x = u.x; d.z = u.z; }
    orig(d);
    P.critNext = false;
    u.stT = C.style === 'smash' ? 0.3 : strong ? 0.26 : 0.16;
    const ps = C.style === 'thrust' || (C.style === 'punch') ? 'attack' : 'throw';
    setPose(u, ps); P.wa.t1 = G.t;
    const tx = u.x + Math.cos(u.aim) * C.r * 0.7, tz = u.z + Math.sin(u.aim) * C.r * 0.7;
    spark(tx, u.y + 0.9, tz, strong ? 0xffe2a0 : 0xfff0d0, strong ? 6 : 3, 2, 0.14, 0.12);
    SFX.whoosh && C.style !== 'punch' && SFX.burst({ type: 'bandpass', f: strong ? 500 : 900, f2: 2600, q: 1.2, gain: 0.18, att: 0.03, dec: 0.12 });
    if (C.style === 'smash'){ camShake(strong ? 0.3 : 0.18, 0.18); dust(d.x, d.z, strong ? 12 : 6); ring(d.x, d.z, 0xffcf80, (C.r || 1.2) * 1.15, 0.35); }
    // 검기 (현자의 검 · 오닐의 검 · 발용의 장검)
    if ((fx.swordWave === 2 || (fx.swordWave && strong)) && (C.style === 'slash' || C.style === 'slash2')) swordWave(u);
  })(dd.onDone);
  return true;
}
function swordWave(u){
  const a = u.aim, y0 = u.y + 0.9;
  const p = shoot({ x: u.x + Math.cos(a) * 0.6, y: y0, z: u.z + Math.sin(a) * 0.6, a, speed: 16, range: 7, side: 'ally', len: 1.2, thick: 0.06, color: 0xcfe8ff, glow: 0x8fd0ff, pierce: true, hitsAir: false,
    onHit: (pp, t) => hurt(u, t, u.atk * 0.8, { from: u, ranged: true, kb: 0.5 }) });
  p.m.scale.set(1, 1, 4);
}
// ---------- 원거리 ----------
function ammoKind(w){ return w.ammo === undefined ? AMMO_OF[w.kind] : w.ammo; }
function rangedAttack(u, w, mv){
  const am = ammoKind(w);
  if (w.mag){
    if (P.reloadT > 0) return true;
    if (!w.it.mag){ if (!startReload(u)) noAmmo(u, am); return true; }
  } else if (am && !(RPG.ammo[am] > 0)){ noAmmo(u, am); P.atkCd = 0.4; return true; }
  const tgt = pickAim(u, mv, w.range || 12);
  let cd = w.cd / atkSpd(u);
  if (w.cls === 'magic'){ magicBolt(u, w, tgt); P.atkCd = cd; return true; }
  if (w.cls === 'bow'){ RPG.ammo[am]--; fireArrow(u, w, tgt, 1, false); P.atkCd = cd; return true; }
  // 총 · 석궁
  if (w.auto){ P.heat = Math.min(1, (P.heat || 0) + 0.06); }
  fireGun(u, w, tgt, {});
  w.it.mag--;
  P.atkCd = cd;
  if (!w.it.mag && w.mag === 1) startReload(u);   // 석궁 · 수발총: 쏠 때마다 장전
  return true;
}
function noAmmo(u, am){
  if (G.t - (P.noAmmoAt || -9) < 0.8) return; P.noAmmoAt = G.t;
  popText(u.x, u.y + 2.3, u.z, am ? `${AMMO_N[am]}이 없다` : '쏠 수 없음', 'miss', 0.9);
  SFX.burst({ type: 'highpass', f: 2400, gain: 0.12, dec: 0.04 });
}
function startReload(u){
  const w = W.def; if (!w.mag || !w.it || P.reloadT > 0) return false;
  const am = ammoKind(w);
  if (w.it.mag >= w.mag) return false;
  if (am && !(RPG.ammo[am] > 0)){ noAmmo(u, am); return false; }
  P.reloadT = w.reload * ((u.rpg && u.rpg.reload) || 1); P.reloadMax = P.reloadT;
  popText(u.x, u.y + 2.2, u.z, '장전…', 'miss', 0.7);
  SFX.burst({ type: 'bandpass', f: 1600, q: 3, gain: 0.12, dec: 0.06 });
  return true;
}
function finishReload(u){
  const w = W.def; P.reloadT = 0; if (!w.it || !w.mag) return;
  const am = ammoKind(w), need = w.mag - w.it.mag, got = am ? Math.min(need, RPG.ammo[am] || 0) : need;
  if (am) RPG.ammo[am] -= got; w.it.mag += got;
  SFX.burst({ type: 'bandpass', f: 2200, q: 4, gain: 0.16, dec: 0.05 }); SFX.burst({ type: 'bandpass', f: 1300, q: 4, gain: 0.14, dec: 0.05, delay: 0.08 });
}
// 총알 · 볼트 한 번 (산탄은 여러 알)
function fireGun(u, w, tgt, o){
  const mz = muzzleWorld(u), y0 = Math.max(u.y + 0.7, Math.min(u.y + 1.5, mz.y));
  const nP = w.pellets || 1, sp = o.spread ?? (w.spread || 0) * (w.auto ? 1 + 3 * (P.heat || 0) : 1) * (P.focus ? 0.3 : 1);
  const mul = (w.shotMul || 1) * (o.mul || 1) * (P.focus ? 1.15 : 1);
  const am = ammoKind(w);
  setPose(u, 'shoot'); P.shootT = G.t + 0.45; P.flashAt = G.t; P.recoil = Math.min(1.4, (P.recoil || 0) + (w.kind === 'shotgun' ? 1 : w.kind === 'lever' ? 0.8 : 0.45));
  P.lastFire = G.t;
  for (let i = 0; i < nP; i++){
    const a = u.aim + (nP > 1 ? (i / (nP - 1) - 0.5) * sp * 2 + rnd(-0.03, 0.03) : rnd(-sp, sp));
    if (w.beam){ laserBeam(u, a, w, mul); continue; }
    const bolt = w.kind === 'crossbow', sp2 = w.speed || 40;
    shoot({ x: mz.x, y: y0, z: mz.z, a, speed: sp2, range: w.range || 12, side: 'ally', len: bolt ? 0.6 : w.kind === 'shotgun' ? 0.22 : 0.38, thick: bolt ? 0.03 : 0.025, tip: bolt, color: bolt ? 0x8a6a4a : 0xffe08a, glow: bolt ? null : 0xffc860, hitsAir: true,
      dy: tgt ? aimDy(mz.x, y0, mz.z, tgt, sp2) : 0, pierce: !!w.pierce || bolt && u.fx && u.fx.pierce, maxPierce: w.pierce || 1,
      onHit: (p, t) => {
        let m2 = mul;
        if (w.kind === 'shotgun'){ const d = Math.hypot(p.x - mz.x, p.z - mz.z); m2 *= d < 3 ? 1 : Math.max(0.45, 1 - (d - 3) / 8); }
        if (w.pierce){ p.pc = (p.pc || 0) + 1; if (p.pc >= (w.pierce || 1) + 1) p.pierce = false; }
        hurt(u, t, u.atk * m2, { from: { x: p.x - Math.cos(p.a), z: p.z - Math.sin(p.a) }, ranged: true, hitsAir: true, kb: w.kb || (bolt ? 0.8 : 0.25), pierceDef: w.pierceDef || 0, crit: o.crit || undefined });
        if (w.slow) addStatus(t, 'slow', { k: 0.5, t: 2 });
        if (w.boom) boom(u, p.x, p.z, w.boom, u.atk * mul * 0.6);
        if (bolt) stickArrow(t, p);
        if (G.cmd === 'focus') G.focusTarget = t;
      },
      end: (p, x, z, wall, t) => { if (w.boom && !t) boom(u, x, z, w.boom, u.atk * mul * 0.6); if (bolt && !t) groundArrow(x - Math.cos(p.a) * (wall ? 0.3 : 0), z - Math.sin(p.a) * (wall ? 0.3 : 0), p.a, wall); } });
  }
  // 소리 · 탄피
  const big = w.kind === 'shotgun' || w.kind === 'lever' || w.boom;
  SFX.burst({ type: 'lowpass', f: big ? 900 : 1600, f2: 200, gain: big ? 0.5 : 0.32, att: 0.002, dec: big ? 0.25 : 0.12 }); SFX.thump(big ? 70 : 110, big ? 0.4 : 0.22, 0.1);
  if (am === 'bullet' || am === 'shell') spark(mz.x, y0, mz.z, 0xd8b060, 1, 1.5, 0.08, 0.4);
  smoke(mz.x, mz.z, big ? 3 : 1, 0.35, 0.3, 0x9a948a, 0.7);
  if (big) camShake(0.12, 0.1);
}
// 광선: 곧은 빛줄기 (꿰뚫음)
function laserBeam(u, a, w, mul){
  const y0 = u.y + 1.05, L = w.range || 14;
  let len = L; for (let s = 0.3; s < L; s += 0.3){ if (solidAt(G.map, u.x + Math.cos(a) * s, u.z + Math.sin(a) * s)){ len = s; break; } }
  const hitList = foes().filter(e => { const dx = e.x - u.x, dz = e.z - u.z, along = dx * Math.cos(a) + dz * Math.sin(a), perp = Math.abs(-dx * Math.sin(a) + dz * Math.cos(a)); return along > 0 && along < len && perp < e.r + 0.25; }).slice(0, (w.pierce || 1) + 1);
  for (const t of hitList) hurt(u, t, u.atk * mul, { from: u, ranged: true, hitsAir: true });
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.12), new THREE.MeshBasicMaterial({ color: 0x7fffe8, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  beam.geometry.translate(len / 2, 0, 0); beam.position.set(u.x, y0, u.z); beam.rotation.set(-Math.PI / 2, 0, -a); G.scene.add(beam);
  G.fx.push({ s: beam, t: 0, life: 0.18, vx: 0, vy: 0, vz: 0 });
  SFX.burst({ type: 'bandpass', f: 3000, f2: 800, q: 4, gain: 0.25, dec: 0.15 });
}
// 폭발 (대포 · 투척 폭발 · 수류탄)
function boom(u, x, z, r, dmg){
  ring(x, z, 0xffa040, r * 1.2, 0.45); spark(x, 0.6, z, 0xffb060, 18, 6); smoke(x, z, 8, 1.2, r * 0.6); dust(x, z, 10); camShake(0.3, 0.25); SFX.boom(0.8);
  for (const e of G.units) if (e.side === 'enemy' && !e.dead && Math.hypot(e.x - x, e.z - z) < r + e.r) hurt(u, e, dmg, { from: { x, z }, kb: 2, ranged: true, hitsAir: true });
}
// 마력탄: 살짝 따라감
function magicBolt(u, w, tgt, o = {}){
  const fx = u.fx || {}, n = fx.magicTriple ? 3 : 1, mz = muzzleWorld(u), y0 = Math.max(u.y + 0.8, mz.y);
  setPose(u, 'shoot'); P.shootT = G.t + 0.45; P.flashAt = G.t; P.recoil = 0.3;
  for (let i = 0; i < n; i++){
    const a = u.aim + (i - (n - 1) / 2) * 0.22, holy = fx.holyP;
    const p = shoot({ x: mz.x, y: y0, z: mz.z, a, speed: w.speed || 15, range: w.range || 12, side: 'ally', len: 0.3, thick: 0.07, color: holy ? 0xfff2c0 : 0xc8a8ff, glow: holy ? 0xffe9a0 : 0xa070ff, hitsAir: true, trail: holy ? 0xffe9a0 : 0xa070ff,
      dy: tgt ? aimDy(mz.x, y0, mz.z, tgt, w.speed || 15) : 0,
      onHit: (pp, t) => { hurt(u, t, u.atk * (o.mul || 1), { from: u, ranged: true, hitsAir: true, kb: 0.3 }); spark(pp.x, pp.y, pp.z, 0xd0b0ff, 8, 3); } });
    p.home = tgt || nearest(u, foes().filter(e => e.alert || dist(e, u) < 8), 12); p.homeK = 2.2;
  }
  SFX.burst({ type: 'bandpass', f: 700, f2: 1900, q: 6, gain: 0.18, dec: 0.18 });
}
// ---------- 화살: 박힘 · 튕김 · 회수 ----------
G.picks = [];
const arrowGeo = (() => { const g = new THREE.CylinderGeometry(0.018, 0.018, 0.7, 5); g.rotateZ(Math.PI / 2); return g; })();
const arrowMat = new THREE.MeshBasicMaterial({ color: 0x9a7a52 });
const fletchMat = new THREE.MeshBasicMaterial({ color: 0xd8d0c0, side: THREE.DoubleSide });
function arrowMesh(){
  const m = new THREE.Mesh(arrowGeo, arrowMat);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.07), fletchMat); f.position.x = -0.3; m.add(f);
  const f2 = f.clone(); f2.rotation.x = Math.PI / 2; m.add(f2);
  return m;
}
function fireArrow(u, w, tgt, k, perfect, opt = {}){
  const mz = muzzleWorld(u), y0 = Math.max(u.y + 0.8, Math.min(u.y + 1.5, mz.y)), sp = (w.speed || 27) * (0.8 + 0.4 * k);
  setPose(u, 'shoot'); P.shootT = G.t + 0.45; P.recoil = 0.25;
  const mul = (w.shotMul || 1) * (0.9 + 0.1 * k) * (opt.mul || 1), stone = w.ammo === null;
  shoot({ x: mz.x, y: y0, z: mz.z, a: u.aim + rnd(-0.02, 0.02) * (1 - k), speed: sp, range: (w.range || 15) * (0.8 + 0.3 * k), side: 'ally', len: stone ? 0.12 : 0.7, thick: stone ? 0.06 : 0.02, tip: !stone, color: stone ? 0x8a8478 : 0x9a7a52, hitsAir: true,
    dy: tgt ? aimDy(mz.x, y0, mz.z, tgt, sp) : 0, pierce: !!opt.pierce, trail: perfect ? 0x5ab4ff : null,
    onHit: (p, t) => {
      const toS = Math.atan2(u.z - t.z, u.x - t.x), front = Math.abs(angDiff(toS, t.aim)) < 1.25;
      const armored = (t.D.block || t.D.armor || t.guardStance || t.guard) && front && !perfect && !opt.pierce;
      hurt(u, t, u.atk * mul, { from: { x: p.x - Math.cos(p.a), z: p.z - Math.sin(p.a) }, ranged: true, hitsAir: true, kb: 0.35 * k, crit: perfect || undefined, critMul: perfect ? 2.6 : undefined, pierce: !!opt.pierce });
      if (stone) return;
      if (armored && Math.random() < 0.7){   // 튕김: 바닥으로
        spark(p.x, p.y, p.z, 0xe0e0e0, 6, 4); SFX.burst({ type: 'highpass', f: 3000, gain: 0.14, dec: 0.05 });
        const ba = p.a + Math.PI + rnd(-0.9, 0.9); groundArrow(t.x + Math.cos(ba) * rnd(0.6, 1.3), t.z + Math.sin(ba) * rnd(0.6, 1.3), ba, false, true);
        popText(t.x, t.y + bodyH(t) * 0.7, t.z, '튕김', 'miss', 0.7);
      } else stickArrow(t, p);
      if (G.cmd === 'focus') G.focusTarget = t;
    },
    end: (p, x, z, wall, t) => { if (!t && !stone) groundArrow(x - Math.cos(p.a) * (wall ? 0.25 : 0), z - Math.sin(p.a) * (wall ? 0.25 : 0), p.a, wall); } });
  SFX.burst({ type: 'bandpass', f: 400, f2: 1400, q: 2, gain: 0.22, att: 0.01, dec: 0.12 });
}
// 몸에 박힘: 그 사람과 함께 움직임 (세계 방향 그대로)
function stickArrow(t, p){
  if (t.dead && !t.stuck) return;
  const m = arrowMesh(), a = p.a;
  m.position.set(p.x - t.x - Math.cos(a) * 0.28, Math.max(0.3, p.y - t.y), p.z - t.z - Math.sin(a) * 0.28);
  m.rotation.y = -a; m.rotation.z = rnd(-0.25, 0.25);
  t.group.add(m); t.stuck = t.stuck || []; t.stuck.push(m);
}
// 바닥 · 벽에 꽂힘 → 주울 수 있음
function groundArrow(x, z, a, wall, flat){
  if (solidAt(G.map, x, z)){ x -= Math.cos(a) * 0.4; z -= Math.sin(a) * 0.4; }
  const y = heightAt(G.map, x, z), m = arrowMesh();
  m.position.set(x, y + (flat ? 0.04 : 0.22), z); m.rotation.y = -a; m.rotation.z = flat ? 0 : -0.55;
  G.scene.add(m);
  G.picks.push({ kind: 'arrow', x, z, m, n: 1, t: G.t });
}
// 죽으면 박힌 화살이 둘레에 떨어짐 (30%는 부러짐)
function dropStuck(u){
  if (!u.stuck || !u.stuck.length) return;
  for (const m of u.stuck){ u.group.remove(m); if (Math.random() < 0.7){ const a = rnd(0, 6.28); groundArrow(u.x + Math.cos(a) * rnd(0.3, 0.9), u.z + Math.sin(a) * rnd(0.3, 0.9), a, false, true); } }
  u.stuck = [];
}
const _killWeap = kill;
kill = function(u, by){ dropStuck(u); return _killWeap(u, by); };
function tickPickups(dt){
  const u = G.player; if (!u || u.downed) return;
  G.picks = G.picks.filter(p => {
    if (Math.hypot(p.x - u.x, p.z - u.z) > 0.75) return true;
    if (p.kind === 'arrow'){ RPG.ammo.arrow = (RPG.ammo.arrow || 0) + p.n; popText(p.x, 1.2, p.z, '+화살', 'heal', 0.6); }
    G.scene.remove(p.m); return false;
  });
}
function clearPicks(){ for (const p of G.picks) G.scene.remove(p.m); G.picks = []; }

// ---------- 스킬 ----------
function startSkill(u, mv){
  const w = W.def, cd = (w.skillCd || 0) * cdMul(u);
  if (P.skCd > 0 && w.skillCd){ popText(u.x, u.y + 2.3, u.z, `${w.skillName} ${Math.ceil(P.skCd)}초`, 'miss', 0.6); return true; }
  switch (w.skill){
    case 'throw':
      if (!P.spear){ popText(u.x, u.y + 2, u.z, `${w.d ? w.d.n : '무기'}이 없음 — 주워야 함`, 'miss', 0.9); return true; }
      P.aiming = true; P.aimMode = 'throw'; P.charge = 0; return true;
    case 'draw': P.aiming = true; P.aimMode = 'draw'; P.charge = 0; return true;
    case 'aimShot': if (!w.it.mag && !startReload(u)){ noAmmo(u, ammoKind(w)); return true; } P.aiming = true; P.aimMode = 'aimShot'; P.charge = 0; return true;
    case 'focus': P.aiming = true; P.aimMode = 'focus'; P.charge = 0; P.focus = true; return true;
    case 'nova': P.aiming = true; P.aimMode = 'nova'; P.charge = 0; return true;
    case 'counter':
      P.skCd = cd; u.counterT = G.t + 0.9; setPose(u, 'aim'); u.st = 'strike'; u.stT = 0.9;
      popText(u.x, u.y + 2.3, u.z, '반격 자세', 'aim', 0.8); ring(u.x, u.z, 0xffe9a0, 1.4, 0.4); return true;
    case 'spin': {
      P.skCd = cd; pickAim(u, mv, 3);
      const hitOnce = (k) => { windup(u, 'circle', { x: u.x, z: u.z, r: 2.4 * ((u.fx && u.fx.reach) ? 1 + u.fx.reach / 100 : 1), windup: k ? 0.2 : 0.3, follow: u }, t => hurt(u, t, u.atk * 1.0, { from: u, kb: 1.3, stun: 0.25 }), GOLD);
        u.decal.onDone = ((orig) => (d) => { orig(d); setPose(u, 'throw'); P.wa = { style: 'spin', t0: G.t, t1: G.t, color: 0xffe9a0 }; u.stT = 0.25; ring(u.x, u.z, 0xffe9a0, 2.6, 0.3); SFX.burst({ type: 'bandpass', f: 600, f2: 2400, q: 1, gain: 0.25, dec: 0.2 }); if (!k) setTimeout(() => !u.downed && hitOnce(1), 120); })(u.decal.onDone); };
      setPose(u, 'windup'); P.wa = { style: 'slash', t0: G.t, wind: 0.3, t1: G.t + 0.3 }; hitOnce(0); return true;
    }
    case 'shadow': {
      const tgt = mouse.over || nearest(u, foes().filter(e => sees(u, e)), 6);
      if (!tgt){ popText(u.x, u.y + 2, u.z, '노릴 적이 없음', 'miss', 0.8); return true; }
      P.skCd = cd; ghost(u);
      const bx = tgt.x - Math.cos(tgt.aim) * (tgt.r + 0.7), bz = tgt.z - Math.sin(tgt.aim) * (tgt.r + 0.7);
      if (!solidAt(G.map, bx, bz)){ u.x = bx; u.z = bz; } else { u.x = tgt.x - (tgt.x - u.x) * 0.2; u.z = tgt.z - (tgt.z - u.z) * 0.2; }
      setAim(u, tgt.x, tgt.z); u.inv = 0.35; P.critNext = true; smoke(u.x, u.z, 4, 0.8, 0.5, 0x302838); popText(u.x, u.y + 2.2, u.z, '그림자 걸음', 'aim', 0.8);
      SFX.burst({ type: 'bandpass', f: 300, f2: 1200, q: 2, gain: 0.2, dec: 0.15 }); return true;
    }
    case 'quake': {
      P.skCd = cd; setPose(u, 'windup'); P.wa = { style: 'smash', t0: G.t, wind: 0.45, t1: G.t + 0.45 };
      windup(u, 'circle', { x: u.x, z: u.z, r: 2.7, windup: 0.45, follow: u }, t => hurt(u, t, u.atk * 1.25, { from: u, kb: 2.4, stun: t.D.heavy ? 0.4 : 1.1, pierce: true }), GOLD);
      u.decal.onDone = ((orig) => (d) => { orig(d); setPose(u, 'throw'); P.wa.t1 = G.t; u.stT = 0.35; camShake(0.45, 0.3); ring(u.x, u.z, 0xffcf80, 3.2, 0.5); dust(u.x, u.z, 22); SFX.boom(0.7); })(u.decal.onDone);
      return true;
    }
    case 'wall':
      P.skCd = cd; P.wall = G.t + 4; u.reflectT = G.t + 4; u.counterT = 0; popText(u.x, u.y + 2.3, u.z, '방패 올리기', 'aim', 0.9);
      for (const e of foes()) if (e.alert && dist(e, u) < 9) e.tauntT = G.t + 4;
      return true;
    case 'volley': {
      const am = 'arrow'; if (!(RPG.ammo[am] > 0) && !w.it.mag){ noAmmo(u, am); return true; }
      P.skCd = cd; P.burst = { left: 3, t: 0, iv: 0.16, fn: () => { if (w.it.mag > 0) w.it.mag--; else if (RPG.ammo.arrow > 0) RPG.ammo.arrow--; else { P.burst = null; return; } fireGun(u, w, pickAim(u, null, 15), {}); } };
      return true;
    }
    case 'fan': {
      if (!w.it.mag){ if (!startReload(u)) noAmmo(u, ammoKind(w)); return true; }
      P.skCd = cd; P.burst = { left: w.it.mag, t: 0, iv: 0.065, fn: () => { if (w.it.mag <= 0){ P.burst = null; return; } w.it.mag--; fireGun(u, w, pickAim(u, null, 13), { spread: 0.16 }); } };
      popText(u.x, u.y + 2.3, u.z, '탕탕탕!', 'big', 0.6); return true;
    }
    case 'blast': {
      if (!w.it.mag){ if (!startReload(u)) noAmmo(u, ammoKind(w)); return true; }
      P.skCd = cd; w.it.mag--; pickAim(u, mv, 3);
      setPose(u, 'shoot'); P.shootT = G.t + 0.5; P.flashAt = G.t; P.recoil = 1.6;
      const d = { shape: 'sector', x: u.x, z: u.z, r: 2.7, a: u.aim, arc: 1.3 };
      for (const t of foes()) if (inShape(d, t)) hurt(u, t, u.atk * 2.6, { from: u, kb: 3.2, stun: t.D.heavy ? 0 : 0.6, ranged: true });
      for (let k = -3; k <= 3; k++){ const a = u.aim + k * 0.2; spark(u.x + Math.cos(a) * 1.6, u.y + 1, u.z + Math.sin(a) * 1.6, 0xffc060, 3, 4, 0.16, 0.2); }
      camShake(0.35, 0.22); SFX.boom(0.6); smoke(u.x + Math.cos(u.aim), u.z + Math.sin(u.aim), 5, 0.8, 0.8, 0x9a948a);
      return true;
    }
  }
  return false;
}
function tickWeaponBurst(u, dt){
  const b = P.burst; b.t -= dt;
  while (P.burst && b.t <= 0 && b.left > 0){ b.fn(); b.left--; b.t += b.iv; }
  if (P.burst && b.left <= 0) P.burst = null;
}
// 누르고 있기 (투창 · 활 당기기 · 조준 사격 · 집중 사격 · 마력 폭발)
function aimHold(u, dt, mv, holding){
  const w = W.def, mode = P.aimMode;
  if (mode === 'focus'){
    if (!holding){ P.aiming = false; P.focus = false; return false; }
    const tgt = pickAim(u, null, 14);
    if (mv) moveBy(u, mv.x * u.spd * 0.45 * dt, mv.z * u.spd * 0.45 * dt);
    if ((mouse.left || down('KeyJ')) && P.atkCd <= 0) rangedAttack(u, w, null);
    setPose(u, 'shoot');
    return true;
  }
  P.charge = Math.min(THROW.full, P.charge + dt);
  const full = P.charge >= THROW.full;
  if (mode === 'throw'){ aimPath(u); setPose(u, 'aim'); }
  else { pickAim(u, null, 16); setPose(u, mode === 'nova' ? 'shoot' : mode === 'draw' ? 'shoot' : 'shoot'); }
  const slow = mode === 'aimShot' ? 0.1 : 0.45;
  if (mv) moveBy(u, mv.x * u.spd * slow * dt, mv.z * u.spd * slow * dt);
  if (mode === 'aimShot' && mv) P.charge = Math.max(0, P.charge - dt * 2.5);   // 움직이면 조준이 풀림
  if (!holding || (full && mode === 'throw')){
    const k = P.charge / THROW.full, perfect = !full && P.charge >= THROW.full - THROW.perfect;
    P.aiming = false;
    if (P.charge < 0.22 && !full){ P.charge = 0; return false; }
    if (mode === 'throw') throwWeapon(u, k, perfect);
    else if (mode === 'draw'){
      const am = ammoKind(w);
      if (am && !(RPG.ammo[am] > 0)){ noAmmo(u, am); }
      else { if (am) RPG.ammo[am]--; if (perfect){ popText(u.x, u.y + 2.2, u.z, '완벽!', 'crit', 1); ring(u.x, u.z, 0x5ab4ff, 2.2, 0.4); G.hitstop = 0.06; }
        fireArrow(u, w, pickAim(u, null, 16), Math.min(1, k), perfect, { mul: 1.4 + 1.6 * k, pierce: k >= 0.98 || perfect }); }
      P.atkCd = 0.4;
    }
    else if (mode === 'aimShot'){
      if (w.it.mag > 0){ w.it.mag--; const ok = k >= 0.72; fireGun(u, w, pickAim(u, null, 20), { crit: ok, mul: ok ? 1.6 : 1, spread: 0 }); if (ok) popText(u.x, u.y + 2.2, u.z, '조준!', 'crit', 0.8); }
      P.atkCd = 0.5;
    }
    else if (mode === 'nova'){
      const tgt = pickAim(u, null, 12), ap = aimPoint(u), tx = tgt ? tgt.x : ap ? ap.x : u.x + Math.cos(u.aim) * 5, tz = tgt ? tgt.z : ap ? ap.z : u.z + Math.sin(u.aim) * 5;
      const r = 1.5 + 1.2 * k, L = Math.min(9, Math.hypot(tx - u.x, tz - u.z)), cx = u.x + Math.cos(u.aim) * L, cz = u.z + Math.sin(u.aim) * L;
      P.skCd = (w.skillCd || 6) * cdMul(u);
      setPose(u, 'shoot'); P.shootT = G.t + 0.5; P.flashAt = G.t;
      windup(u, 'circle', { x: cx, z: cz, r, windup: 0.35 }, t => hurt(u, t, u.atk * (1.5 + 1.6 * k), { from: { x: cx, z: cz }, kb: 1.6, ranged: true, hitsAir: true }), 0xa070ff);
      u.decal.onDone = ((orig) => (d) => { orig(d); u.st = 'idle'; ring(cx, cz, 0xc8a8ff, r * 1.2, 0.5); spark(cx, 0.8, cz, 0xd0b0ff, 24, 6); SFX.boom(0.5); })(u.decal.onDone);
      u.st = 'idle';
    }
    P.charge = 0;
    return true;
  }
  return true;
}
// 던지기 (창 · 도끼): 투창 규칙 그대로, 무기 그림이 날아감
function throwWeapon(u, k, perfect){
  const w = W.def, fx = u.fx || {};
  aimPath(u);
  const Aa = P.aim, a = Aa.a; P.aim = null;
  setPose(u, 'throw'); u.st = 'strike'; u.stT = 0.3;
  P.spear = false;
  const tm = w.throwMul || [1.2, 1.6], dmg = u.atk * (tm[0] + tm[1] * k);
  if (perfect){ popText(u.x, u.y + 2.2, u.z, '완벽!', 'crit', 1); ring(u.x, u.z, 0x5ab4ff, 2.2, 0.4); G.hitstop = 0.08; }
  else if (k >= 1) popText(u.x, u.y + 2.1, u.z, '힘껏', 'big', 0.7);
  spark(u.x + Math.cos(a) * 0.6, u.y + 1.3, u.z + Math.sin(a) * 0.6, perfect ? 0x7fc8ff : 0xfff0d0, perfect ? 16 : 6, 4);
  const p = shoot({ x: u.x, y: Aa.y0, z: u.z, a, speed: Aa.vh, vy: Aa.vy, g: ARC.g, hitR: 0.3, range: THROW.range * 2, side: 'ally', len: 0.1, thick: 0.01, color: 0xc8b8a0,
    glow: perfect ? 0x5ab4ff : null, pierce: perfect, hitsAir: true, trail: perfect ? 0x5ab4ff : null,
    onHit: (pp, t) => {
      hurt(u, t, dmg, { hitsAir: true, ranged: true, from: { x: pp.x - Math.cos(pp.a), z: pp.z - Math.sin(pp.a) }, crit: perfect || undefined, critMul: 2.5, pierce: perfect, noCam: perfect, kb: 1.2 * k, stun: perfect ? 0.6 : 0 });
      if (w.kind === 'axe') addStatus(t, 'bleed', { dps: Math.max(4, u.atk * 0.3), t: 4 });
      if (fx.throwBoom) boom(u, t.x, t.z, 2.6, dmg * 0.7);
      if (G.cmd === 'focus') G.focusTarget = t;
    },
    end: (pp, x, z, wall, t) => {
      if (CAM.track === pp) CAM.trackUntil = G.t + 0.25;
      if (fx.throwBoom && !t) boom(u, x, z, 2.6, dmg * 0.7);
      if (fx.boomerang){ setTimeout(() => { P.spear = true; popText(u.x, u.y + 2, u.z, '돌아옴', 'heal', 0.7); }, 450); return; }
      dropWeapon(t ? t.x + rnd(-0.6, 0.6) : x - Math.cos(pp.a) * (wall ? 0.4 : 0), t ? t.z + rnd(0.3, 0.9) : z - Math.sin(pp.a) * (wall ? 0.4 : 0), pp.a);
    } });
  // 날아가는 그림: 무기 그림 그대로 (도끼는 빙글빙글)
  const fm = makeHeldMesh(w.d);
  if (fm){ const holder = new THREE.Group(); holder.add(fm); fm.position.x = -(0.5 - fm.userData.grip) * fm.userData.L; p.m.add(holder); p.spin = w.spin; p.holder = holder; holder.rotation.x = Math.PI / 2; }
  if (perfect && !G.camAnchor){ CAM.track = p; CAM.trackUntil = G.t + 1.6; CAM.punch = null; }
  SFX.whoosh();
}
// 던진 무기: 바닥에 박힘 (그림 그대로 + 금빛 기둥)
function dropWeapon(x, z, a){
  if (solidAt(G.map, x, z)){ x = G.player.x; z = G.player.z; }
  const y = heightAt(G.map, x, z), g = new THREE.Group();
  const fm = makeHeldMesh(W.def.d);
  if (fm){ const holder = new THREE.Group(); holder.add(fm); holder.position.set(x, y + 0.35, z); holder.rotation.z = -1.1; holder.rotation.y = rnd(0, 6.28); g.add(holder); }
  const glow = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.32, 24), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
  glow.rotation.x = -Math.PI / 2; glow.position.set(x, y + 0.03, z);
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.18, 6, 10, 1, true), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, side: THREE.DoubleSide }));
  pillar.position.set(x, y + 3, z); pillar.renderOrder = 40; g.add(pillar);
  g.add(glow); G.scene.add(g);
  P.spearObj = { x, z, m: g, pillar };
}
// 투척 소모품: 수류탄 · 얼음못 (포물선 → 땅에서 터짐)
function lobAt(u, onLand, color = 0x5a5a50){
  const ap = aimPoint(u) || { x: u.x + Math.cos(u.aim) * 6, z: u.z + Math.sin(u.aim) * 6 };
  const a = Math.atan2(ap.z - u.z, ap.x - u.x), L = clamp(Math.hypot(ap.x - u.x, ap.z - u.z), 2, 10), vh = 9, T = L / vh, y0 = u.y + 1.3, vy = (heightAt(G.map, ap.x, ap.z) - y0) / T + 9 * T / 2;
  setAim(u, ap.x, ap.z); setPose(u, 'throw'); u.st = 'strike'; u.stT = 0.3;
  const p = shoot({ x: u.x, y: y0, z: u.z, a, speed: vh, vy, g: 9, hitR: 0.1, range: 14, side: 'ally', len: 0.16, thick: 0.08, color, end: (pp, x, z) => onLand(x, z) });
  return p;
}
function throwGrenade(u, dmg){
  lobAt(u, (x, z) => { const d = decal('circle', { x, z, r: 2.4, dur: 1.2, color: 0xff7a2a }); setTimeout(() => { d.done = true; boom(u, x, z, 2.4, dmg); }, 1200 / Math.max(0.3, G.slow)); });
}
function throwFreeze(u, t){
  lobAt(u, (x, z) => { ring(x, z, 0xbfe8ff, 2.8, 0.6); spark(x, 0.6, z, 0xd8f0ff, 20, 5); for (const e of G.units) if (e.side === 'enemy' && !e.dead && Math.hypot(e.x - x, e.z - z) < 2.6) addStatus(e, 'freeze', { t }); }, 0xbfe8ff);
}
