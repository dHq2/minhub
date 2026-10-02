/* boss.js v0.1 — 적뢰 (튜토리얼 보스)
   1페이즈: 천천히 걸어와 대리석 주먹 (발밑 원) · 손을 들어 천벌 (2초, 가장 질긴 자를 따라가다 멈춤) · 웅크렸다 날아차기 (일직선)
   2페이즈 (체력 55% 아래): 날아오름 (근접 공격이 닿지 않음, 투창 · 총은 닿음). 하늘에서 붉은 창을 던짐 (기둥 뒤에 숨으면 막힘) · 천벌
   가끔 내려꽂히고 4초 숨을 고름 = 근접 딜 타임 */
'use strict';
const JR = { punchCd: 2.6, thunderCd: 9, kickCd: 11, spearCd: 3.4, descendCd: 10 };
function bossInit(u, center){
  u.B = { phase: 1, act: null, cd: { punch: 1.5, thunder: 5, kick: 7, spears: 2, descend: JR.descendCd }, center, orbit: 0 };
  u.r = 0.8;
}
function bossThink(u, dt){
  const B = u.B; if (!B || u.dead) return;
  for (const k in B.cd) B.cd[k] -= dt;
  if (B.act) return bossAct(u, B.act, dt);
  const team = allies(); if (!team.length) return;
  let tgt = G.player && !G.player.downed ? G.player : nearest(u, team);
  const d = dist(u, tgt);
  if (B.phase === 1){
    if (u.hp < u.max * 0.55){ return start(u, 'ascend'); }
    if (B.cd.thunder <= 0) return start(u, 'thunder');
    if (B.cd.kick <= 0 && d > 4.5 && d < 11) return start(u, 'kick', tgt);
    if (d < 3.4 && B.cd.punch <= 0) return start(u, 'punch', tgt);
    if (d > 2.6) steerTo(u, tgt.x, tgt.z, u.spd, dt, 2.4); else u.moving = false;
    setAim(u, tgt.x, tgt.z); setPose(u, 'idle');
  } else {
    // 하늘: 우물 가운데를 천천히 돎
    B.orbit += dt * 0.25;
    const ox = B.center.x + Math.cos(B.orbit) * 4.5, oz = B.center.z + Math.sin(B.orbit) * 3.2;
    u.x += (ox - u.x) * Math.min(1, dt * 1.2); u.z += (oz - u.z) * Math.min(1, dt * 1.2);
    u.lift += (3 - u.lift) * Math.min(1, dt * 2);
    setAim(u, tgt.x, tgt.z); setPose(u, 'idle');
    if (B.cd.descend <= 0) return start(u, 'descend');
    if (B.cd.thunder <= 0) return start(u, 'thunder');
    if (B.cd.spears <= 0) return start(u, 'spears');
  }
}
function start(u, type, tgt){ u.B.act = { type, t: 0, tgt, phase: 0 }; }
function endAct(u){ u.B.act = null; }
function bossAct(u, A, dt){
  const B = u.B; A.t += dt;
  if (A.type === 'punch'){
    if (A.phase === 0){
      A.phase = 1; setPose(u, 'idle'); setAim(u, A.tgt.x, A.tgt.z);
      const px = A.tgt.x, pz = A.tgt.z; A.px = px; A.pz = pz;
      u.decal = decal('circle', { x: px, z: pz, r: 1.5, dur: 0.55, onDone: d => {
        u.decal = null;
        const n = norm(px - u.x, pz - u.z), L = Math.max(0, Math.hypot(px - u.x, pz - u.z) - 1.1);
        moveBy(u, n.x * L, n.z * L); setPose(u, 'idle'); u.flash = 0.6;
        for (const t of allies()) if (inShape(d, t)) hurt(u, t, u.atk, { kb: 1.8, from: u, stun: 0.45 });
        camShake(0.3, 0.2); ring(px, pz, 0xff6a5a, 2, 0.35); dust(px, pz, 10);
        A.phase = 2; A.t = 0;
      } });
    }
    if (A.phase === 2 && A.t > 0.55){ B.cd.punch = JR.punchCd; setPose(u, 'idle'); endAct(u); }
    return;
  }
  if (A.type === 'thunder'){
    if (A.phase === 0){
      A.phase = 1; setPose(u, 'idle'); u.redTint = true;
      const team = allies(); const tgt = team.sort((a, b) => b.max - a.max)[Math.random() < 0.5 ? 0 : Math.min(1, team.length - 1)] || G.player;
      A.tgt = tgt; popText(u.x, u.y + u.lift + 4.6, u.z, '손을 번쩍 든다', 'alert', 1.2);
      u.decal = decal('circle', { x: tgt.x, z: tgt.z, r: 2.0, dur: 2.0, follow: tgt, onDone: d => { u.decal = null; strikeThunder(u, d); } });
      A.lockAt = 1.3;
    }
    if (A.phase === 1 && A.t > A.lockAt && u.decal && u.decal.follow){ u.decal.follow = null; }   // 마지막 0.7초는 그 자리에 멈춤 → 빠져나가면 피함
    if (A.t > 2.4){ B.cd.thunder = B.phase === 1 ? JR.thunderCd : 7; u.redTint = false; setPose(u, 'idle'); endAct(u); }
    return;
  }
  if (A.type === 'kick'){
    if (A.phase === 0){
      A.phase = 1; setPose(u, 'prep'); setAim(u, A.tgt.x, A.tgt.z);
      const a = Math.atan2(A.tgt.z - u.z, A.tgt.x - u.x), len = Math.min(12, dist(u, A.tgt) + 1.5);
      A.a = a; A.len = len;
      u.decal = decal('line', { x: u.x, z: u.z, len, w: 1.3, a, dur: 0.75, onDone: d => { u.decal = null; A.hitD = d; A.phase = 2; A.t = 0; setPose(u, 'leap'); } });
    }
    if (A.phase === 2){
      const T = 0.32, k = Math.min(1, A.t / T);
      u.lift = Math.sin(Math.PI * k) * 0.9;
      const step = A.len / T * dt; moveBy(u, Math.cos(A.a) * step, Math.sin(A.a) * step);
      if (!A.hit){ A.hit = true; for (const t of allies()) if (inShape(A.hitD, t)) hurt(u, t, 40, { kb: 2.8, from: u, stun: 0.6, unblockable: true }); camZoomPulse(0.7); }
      if (k >= 1){ A.phase = 3; A.t = 0; u.lift = 0; setPose(u, 'kick'); dust(u.x, u.z, 12); camShake(0.25, 0.2); }
    }
    if (A.phase === 3 && A.t > 0.6){ B.cd.kick = JR.kickCd; setPose(u, 'idle'); endAct(u); }
    return;
  }
  if (A.type === 'ascend'){
    if (A.phase === 0){
      A.phase = 1; u.inv = 99; setPose(u, 'idle'); u.redTint = true; camFocus(u.x, u.z, 2.4, 6.5, 7.5, 0.05); camShake(0.2, 2.2);
      popText(u.x, u.y + 4.5, u.z, '…', 'alert', 1.5); G.rain && (G.rain.on = true);
      flashScreen('#fff', 0.5);
    }
    if (A.t > 0.8){ u.lift = Math.min(3, (A.t - 0.8) * 2.2); if (u.lift > 1) u.airborne = true; }
    if (A.t > 2.4){ B.phase = 2; u.inv = 0; u.redTint = false; B.cd.spears = 1; B.cd.thunder = 4; B.cd.descend = JR.descendCd; setPose(u, 'idle'); endAct(u); G.onBossPhase && G.onBossPhase(2); }
    return;
  }
  if (A.type === 'spears'){
    if (A.phase === 0){
      A.phase = 1; setPose(u, 'idle');
      const team = allies().sort(() => Math.random() - 0.5).slice(0, 3);
      A.lines = team.map((t, i) => {
        const a = Math.atan2(t.z - u.z, t.x - u.x), len = Math.min(16, dist(u, t) + 3);
        return decal('line', { x: u.x, z: u.z, len, w: 0.55, a, dur: 0.85 + i * 0.12, color: 0xff2030, onDone: d => {
          const y0 = u.y + u.lift + 2, time = len / 30;
          shoot({ x: u.x, y: y0, z: u.z, a, speed: 30, range: len + 1, side: 'enemy', len: 1.8, thick: 0.05, tip: true, color: 0xff3040, glow: 0xff2020, dy: (1.0 - y0) / time,
            onHit: (p, tt) => hurt(u, tt, 26, { from: { x: p.x - Math.cos(a), z: p.z - Math.sin(a) }, kb: 1.2 }),
            end: (p, x, z) => { ring(x, z, 0xff3040, 1.1, 0.3); dust(x, z, 5, 0x803030); } });
        } });
      });
    }
    if (A.t > 1.3){ B.cd.spears = JR.spearCd; setPose(u, 'idle'); endAct(u); }
    return;
  }
  if (A.type === 'descend'){
    if (A.phase === 0){ A.phase = 1; setPose(u, 'idle'); A.d = decal('circle', { x: u.x, z: u.z, r: 2.6, dur: 1.0, follow: null }); }
    if (A.phase === 1 && A.t > 1.0){
      A.phase = 2; A.t = 0; u.lift = 0; u.airborne = false; setPose(u, 'kick');
      for (const t of allies()) if (inShape(A.d, t)) hurt(u, t, 35, { kb: 2.6, from: u, stun: 0.5 });
      camShake(0.45, 0.35); ring(u.x, u.z, 0xff6a5a, 3, 0.5); dust(u.x, u.z, 18);
      popText(u.x, u.y + 3.8, u.z, '숨을 고른다', 'heal', 1.4);
    }
    if (A.phase === 1) u.lift = Math.max(0, 3 * (1 - A.t / 1.0));
    if (A.phase === 2 && A.t > 0.4) setPose(u, 'hurt');
    if (A.phase === 2 && A.t > 4){ A.phase = 3; A.t = 0; setPose(u, 'idle'); }
    if (A.phase === 3){ u.lift = Math.min(3, A.t * 2.5); if (u.lift > 1) u.airborne = true; if (A.t > 1.2){ B.cd.descend = JR.descendCd; setPose(u, 'idle'); endAct(u); } }
    return;
  }
  endAct(u);
}
function strikeThunder(u, d){
  const x = d.x, z = d.z, y = heightAt(G.map, x, z);
  // 하늘 끝에서 내리꽂는 붉은 빛기둥
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 24), new THREE.MeshBasicMaterial({ map: sparkTex, color: 0xff4040, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  beam.position.set(x, y + 12, z); beam.rotation.y = Math.atan2(camera.position.x - x, camera.position.z - z); G.scene.add(beam);
  const core = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false })); core.position.copy(beam.position); core.rotation.copy(beam.rotation); G.scene.add(core);
  G.fx.push({ s: beam, t: 0, life: 0.5, vx: 0, vy: 0, vz: 0, size: 1, grav: 0 }, { s: core, t: 0, life: 0.3, vx: 0, vy: 0, vz: 0, size: 1, grav: 0 });
  flashScreen('#ffd8d8', 0.6); camShake(0.5, 0.35); ring(x, z, 0xff4040, 4.5, 0.5); spark(x, y + 0.5, z, 0xff8080, 20, 7);
  for (const t of allies()){
    const dd = Math.hypot(t.x - x, t.z - z);
    if (dd <= d.r + t.r * 0.6) hurt(u, t, 45, { from: { x, z }, stun: 0.5, unblockable: true });
    else if (dd < 4.5) hurt(u, t, 10, { from: { x, z }, unblockable: true });
  }
}
