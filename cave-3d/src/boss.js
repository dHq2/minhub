/* boss.js v0.3 — 적뢰 (튜토리얼 보스). 1페이즈는 2D판 적뢰를 그대로 옮김
   1페이즈
   - 대리석 주먹: 천천히 걸어오다 2.8칸 안이면 거의 예고 없이 (0.35초) 파고들어 내리찍음 (30) + 둘레 땅울림 (절반)
   - 천벌: 손을 들면 붉은 기운이 몸을 감싸고 머리 위로 번개가 튐. 2초 동안 가장 질긴 자를 따라가다 마지막 0.6초는 멈춤
           직격 45 + 감전 (5씩 5번) · 십자 4칸 · 둘레 2.5칸 10 + 잔류 (3씩 3번). 떨어진 뒤 6초는 숨을 고름
   - 번개비: 두 손을 치켜들고 0.8초 → 작은 낙뢰 2~4개씩 3번 (20, 예고 0.9초). 그동안 적뢰는 자유 행동 (대기 20초)
   - 날아차기: (근접전 중이면 뒤로 크게 3칸 뛰고) 0.8초 웅크림 → 일직선으로 날아참. 55 확정 치명, 막으면 60% 감소, 5% 머리가 터져 즉사
   - 대리석 피부 · 회피 스텝은 units.js hurt()
   2페이즈 (체력 55% 아래): 날아오름 (근접이 닿지 않음, 투창 · 총은 닿음). 하늘에서 붉은 창 (기둥 뒤에 숨으면 막힘) · 천벌
   10초마다 내려꽂히고 4초 숨을 고름 = 근접 딜 타임
   튕겨냄 (F 저스트): 하던 것이 끊기고 0.9초 휘청 */
'use strict';
const JR = { punchCd: 2.4, thunderRest: 6, thunderCd: 3, rainCd: 20, kickCd: 6, spearCd: 3.4, descendCd: 10 };
function bossInit(u, center){
  u.B = { phase: 1, act: null, cd: { punch: 1.2, thunder: 4, rain: 11, kick: 6, back: 1, spears: 2, descend: JR.descendCd }, center, orbit: 0 };
  u.r = 0.8; G.storms = []; G.shocks = [];
}
function bossThink(u, dt){
  const B = u.B; if (!B || u.dead) return;
  for (const k in B.cd) B.cd[k] -= dt;
  updateStorms(u, dt); updateShocks(dt);
  if (u.parried > 0){
    if (!B.wasParried){ B.wasParried = true; u.redTint = false; B.cd.punch = Math.max(B.cd.punch, 1.6); if (!u.airborne) u.lift = 0; }
    u.parried -= dt; u.moving = false; setPose(u, 'hurt'); return;
  }
  B.wasParried = false;
  if (B.act) return bossAct(u, B.act, dt);
  const team = allies(); if (!team.length) return;
  let tgt = G.player && !G.player.downed ? G.player : nearest(u, team);
  const d = dist(u, tgt);
  if (B.phase === 1){
    if (u.hp < u.max * 0.55){ return start(u, 'ascend'); }
    if (B.cd.thunder <= 0) return start(u, 'thunder');
    if (B.cd.rain <= 0) return start(u, 'rain');
    if (B.cd.kick <= 0 && d > 4 && d < 9) return start(u, 'kick', tgt);
    // 근접전 중엔 가끔 (매초 25%) 뒤로 크게 뛰어 물러난 뒤 날아차기
    if (B.cd.kick <= 0 && d < 3 && B.cd.back <= 0){ B.cd.back = 1; if (Math.random() < 0.25) return start(u, 'kick', tgt, true); }
    if (d < 2.8 && B.cd.punch <= 0) return start(u, 'punch', tgt);
    if (d > 2.2) navTo(u, tgt.x, tgt.z, u.spd, dt, 2.0); else u.moving = false;
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
function start(u, type, tgt, back){ u.B.act = { type, t: 0, tgt, phase: 0, back }; }
function endAct(u){ u.B.act = null; }
const bossDecal = (shape, o) => decal(shape, { hostile: true, ...o });
// 손을 든 동안: 붉은 기운이 몸을 감싸고 머리 위로 번개가 튐
function castAura(u, dt){
  u.auraT = (u.auraT || 0) - dt; if (u.auraT > 0) return; u.auraT = 0.05;
  const h = bodyH(u), y = u.y + u.lift;
  const a = Math.random() * 6.28; spark(u.x + Math.cos(a) * 0.7, y + rnd(0.2, h), u.z + Math.sin(a) * 0.7, 0xff3030, 2, 1.5, 0.3, 0.4);
  spark(u.x + rnd(-0.4, 0.4), y + h + rnd(0.1, 0.6), u.z + rnd(-0.4, 0.4), Math.random() < 0.5 ? 0xffffff : 0xff6060, 3, 5, 0.14, 0.2);
}
function bossAct(u, A, dt){
  const B = u.B; A.t += dt;
  if (A.type === 'punch'){
    if (A.phase === 0){
      A.phase = 1; setAim(u, A.tgt.x, A.tgt.z); u.leanT = 0.35;
      const px = A.tgt.x, pz = A.tgt.z;
      u.decal = bossDecal('circle', { x: px, z: pz, r: 1.3, dur: 0.35, onDone: d => {
        u.decal = null;
        const n = norm(px - u.x, pz - u.z), L = Math.max(0, Math.hypot(px - u.x, pz - u.z) - 1.0);
        moveBy(u, n.x * L, n.z * L); u.flash = 0.6;
        const quake = { shape: 'circle', x: px, z: pz, r: 2.5 };
        for (const t of allies()){
          if (inShape(d, t)) hurt(u, t, u.atk, { kb: 2.2, from: u, stun: 0.5 });
          else if (inShape(quake, t) && !(t.jy > 0.45)) hurt(u, t, u.atk * 0.5, { kb: 1.0, from: { x: px, z: pz } });
        }
        camShake(0.35, 0.22); ring(px, pz, 0xff6a5a, 1.3, 0.3); ring(px, pz, 0xc8b8a0, 2.5, 0.5); dust(px, pz, 14);
        A.phase = 2; A.t = 0;
      } });
    }
    if (A.phase === 2 && A.t > 0.45){ B.cd.punch = JR.punchCd; endAct(u); }
    return;
  }
  if (A.type === 'thunder'){
    if (A.phase === 0){
      A.phase = 1; setPose(u, 'idle'); u.redTint = true; u.moving = false;
      const team = allies().filter(t => !t.downed); const tgt = team.sort((a, b) => b.hp - a.hp)[0] || G.player;
      A.tgt = tgt; popText(u.x, u.y + u.lift + 4.6, u.z, '손을 번쩍 든다', 'alert', 1.2);
      u.decal = bossDecal('circle', { x: tgt.x, z: tgt.z, r: 1.0, dur: 2.0, follow: tgt, onDone: d => { u.decal = null; A.cross && A.cross.forEach(c => c.done = true); strikeThunder(u, d); } });
    }
    castAura(u, dt);
    // 마지막 0.6초는 그 자리에 멈춤 → 빠져나가면 피함. 멈추는 순간 십자 · 둘레가 보임
    if (A.phase === 1 && A.t > 1.4 && u.decal && u.decal.follow){
      const d = u.decal; d.follow = null; A.phase = 2;
      A.cross = [0, Math.PI / 2, Math.PI, -Math.PI / 2].map(a => bossDecal('line', { x: d.x, z: d.z, len: 4, w: 0.8, a, dur: 0.6, color: 0xff6040 }));
      A.cross.push(bossDecal('circle', { x: d.x, z: d.z, r: 2.5, dur: 0.6, color: 0xff6040 }));
    }
    if (A.t > 2.3){ B.cd.thunder = JR.thunderRest + (B.phase === 1 ? JR.thunderCd : 1); u.redTint = false; endAct(u); }
    return;
  }
  if (A.type === 'rain'){
    if (A.phase === 0){ A.phase = 1; u.redTint = true; u.moving = false; popText(u.x, u.y + 4.6, u.z, '두 손을 치켜든다', 'alert', 1.2); camShake(0.1, 0.8); }
    castAura(u, dt);
    if (A.t > 0.8){ u.redTint = false; G.storms.push({ waves: 0, next: 0 }); B.cd.rain = JR.rainCd; endAct(u); }
    return;
  }
  if (A.type === 'kick'){
    // 0: (뒤로 뛰기) → 1: 웅크림 0.8초 + 일직선 → 2: 도약 0.35 → 3: 비행 0.3 (맞힘) → 4: 착지
    if (A.phase === 0){
      setAim(u, A.tgt.x, A.tgt.z);
      if (A.back){ A.phase = 'back'; A.t = 0; setPose(u, 'leap'); A.ba = u.aim + Math.PI; popText(u.x, u.y + 4, u.z, '…!', 'alert', 0.8); }
      else A.phase = 'prep';
    }
    if (A.phase === 'back'){
      const k = Math.min(1, A.t / 0.5); u.lift = Math.sin(Math.PI * k) * 1.4; u.inv = 1;
      moveBy(u, Math.cos(A.ba) * 3 / 0.5 * dt, Math.sin(A.ba) * 3 / 0.5 * dt);
      if (k >= 1){ u.lift = 0; u.inv = 0; dust(u.x, u.z, 10); A.phase = 'prep'; }
    }
    if (A.phase === 'prep'){
      A.phase = 1; A.t = 0; setPose(u, 'prep'); setAim(u, A.tgt.x, A.tgt.z);
      A.a = u.aim; A.len = 6;
      u.decal = bossDecal('line', { x: u.x, z: u.z, len: A.len, w: 1.4, a: A.a, dur: 0.8, onDone: d => { u.decal = null; A.hitD = d; A.phase = 2; A.t = 0; setPose(u, 'leap'); } });
    }
    if (A.phase === 2){
      u.inv = 1; u.lift = Math.min(1.2, A.t / 0.35 * 1.2);
      if (A.t > 0.35){ A.phase = 3; A.t = 0; setPose(u, 'kick'); camZoomPulse(0.8); }
    }
    if (A.phase === 3){
      const k = Math.min(1, A.t / 0.3), step = A.len / 0.3 * dt; moveBy(u, Math.cos(A.a) * step, Math.sin(A.a) * step); u.lift = 1.2 * (1 - k);
      if (!A.hit){ A.hit = true; for (const t of allies()) if (inShape(A.hitD, t) && !(t.inv > 0) && !(t.jy > 0.45)) kickHit(u, t, A.a); }
      if (k >= 1){ A.phase = 4; A.t = 0; u.lift = 0; u.inv = 0; dust(u.x, u.z, 16); camShake(0.3, 0.25); }
    }
    if (A.phase === 4 && A.t > 0.6){ B.cd.kick = rnd(5, 7); endAct(u); }
    return;
  }
  if (A.type === 'ascend'){
    if (A.phase === 0){
      A.phase = 1; u.inv = 99; setPose(u, 'idle'); u.redTint = true; camFocus(u.x, u.z, 2.4, 6.5, 7.5, 0.05); camShake(0.2, 2.2);
      popText(u.x, u.y + 4.5, u.z, '…', 'alert', 1.5); G.rain && (G.rain.on = true);
      flashScreen('#fff', 0.5);
    }
    castAura(u, dt);
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
        return bossDecal('line', { x: u.x, z: u.z, len, w: 0.55, a, dur: 0.85 + i * 0.12, color: 0xff2030, onDone: d => {
          const y0 = u.y + u.lift + 2, time = len / 30;
          shoot({ x: u.x, y: y0, z: u.z, a, speed: 30, range: len + 1, side: 'enemy', len: 1.8, thick: 0.05, tip: true, color: 0xff3040, glow: 0xff2020, dy: (1.0 - y0) / time,
            onHit: (p, tt) => hurt(u, tt, 26, { from: { x: p.x - Math.cos(a), z: p.z - Math.sin(a) }, kb: 1.2 }),
            end: (p, x, z) => { ring(x, z, 0xff3040, 1.1, 0.3); dust(x, z, 5, 0x803030); } });
        } });
      });
    }
    if (A.t > 1.3){ B.cd.spears = JR.spearCd; endAct(u); }
    return;
  }
  if (A.type === 'descend'){
    if (A.phase === 0){ A.phase = 1; setPose(u, 'idle'); A.d = bossDecal('circle', { x: u.x, z: u.z, r: 2.6, dur: 1.0 }); }
    if (A.phase === 1 && A.t > 1.0){
      A.phase = 2; A.t = 0; u.lift = 0; u.airborne = false; setPose(u, 'kick');
      for (const t of allies()) if (inShape(A.d, t) && !(t.jy > 0.45)) hurt(u, t, 35, { kb: 2.6, from: u, stun: 0.5 });
      camShake(0.45, 0.35); ring(u.x, u.z, 0xff6a5a, 3, 0.5); dust(u.x, u.z, 18);
      popText(u.x, u.y + 3.8, u.z, '숨을 고른다', 'heal', 1.4);
    }
    if (A.phase === 1) u.lift = Math.max(0, 3 * (1 - A.t / 1.0));
    if (A.phase === 2 && A.t > 0.4) setPose(u, 'hurt');
    if (A.phase === 2 && A.t > 4){ A.phase = 3; A.t = 0; setPose(u, 'idle'); }
    if (A.phase === 3){ u.lift = Math.min(3, A.t * 2.5); if (u.lift > 1) u.airborne = true; if (A.t > 1.2){ B.cd.descend = JR.descendCd; endAct(u); } }
    return;
  }
  endAct(u);
}
// 날아차기 맞음: 막으면 60% 감소 (튕겨냄 없음), 아니면 확정 치명 + 5% 머리가 터짐
function kickHit(u, t, a){
  const from = { x: t.x - Math.cos(a), z: t.z - Math.sin(a) };
  const blocked = t.guard && Math.abs(angDiff(a + Math.PI, t.aim)) < 1.25;
  if (!blocked && Math.random() < 0.05){
    popText(t.x, t.y + 2.4, t.z, '머리가 터졌다', 'crit', 1.6); spark(t.x, t.y + bodyH(t), t.z, 0xff2020, 30, 7);
    hurt(u, t, 9999, { from, unblockable: true, kb: 3.5 });
  } else if (blocked){
    hurt(u, t, 55 * 0.4, { from, unblockable: true, kb: 2.2 }); popText(t.x, t.y + 2.4, t.z, '막음', 'miss');
  } else hurt(u, t, 55 / 2, { from, unblockable: true, crit: true, critMul: 2, kb: 3.5, stun: 0.8 });
  camCrit(t.x, t.z, t.y + 0.3, 0.4); camShake(0.5, 0.35);
}
function strikeThunder(u, d){
  const x = d.x, z = d.z, y = heightAt(G.map, x, z);
  boltFx(x, y, z, 1.1, 0.5);
  flashScreen('#ffd8d8', 0.6); camShake(0.5, 0.35); ring(x, z, 0xff4040, 2.5, 0.5); spark(x, y + 0.5, z, 0xff8080, 24, 7);
  // 십자로 뻗는 전격
  for (const a of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) for (let s = 1; s <= 4; s++) spark(x + Math.cos(a) * s, y + 0.2, z + Math.sin(a) * s, 0xff6050, 3, 2, 0.2, 0.3);
  for (const t of allies()){
    const dx = t.x - x, dz = t.z - z, dd = Math.hypot(dx, dz), cross = (Math.abs(dx) < 0.4 + t.r && Math.abs(dz) < 4.2) || (Math.abs(dz) < 0.4 + t.r && Math.abs(dx) < 4.2);
    if (dd <= d.r + t.r * 0.6){ hurt(u, t, 45, { from: { x, z }, stun: 0.6, unblockable: true }); shock(u, t, 5, 5); }
    else if (cross || dd < 2.5){ hurt(u, t, 10, { from: { x, z }, unblockable: true }); shock(u, t, 3, 3); }
  }
}
function boltFx(x, y, z, w, life){
  const ang = Math.atan2(camera.position.x - x, camera.position.z - z);
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(w, 24), new THREE.MeshBasicMaterial({ map: sparkTex, color: 0xff4040, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  beam.position.set(x, y + 12, z); beam.rotation.y = ang; G.scene.add(beam);
  const core = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.27, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false })); core.position.copy(beam.position); core.rotation.y = ang; G.scene.add(core);
  G.fx.push({ s: beam, t: 0, life, vx: 0, vy: 0, vz: 0, size: 1, grav: 0 }, { s: core, t: 0, life: life * 0.6, vx: 0, vy: 0, vz: 0, size: 1, grav: 0 });
}
// 감전 · 잔류: 1초마다 n씩 k번 (겹치면 쌓임)
function shock(u, t, n, k){ G.shocks.push({ u, t, n, k, next: 1 }); }
function updateShocks(dt){
  G.shocks = G.shocks.filter(s => {
    if (s.t.dead || s.t.downed) return false;
    s.next -= dt; if (s.next > 0) return true;
    s.next = 1; s.k--; s.t.hp -= s.n; s.t.flash = 0.6;
    popText(s.t.x, s.t.y + 1.8, s.t.z, '감전 ' + s.n, s.t.side === 'ally' ? 'hurt' : '', 0.7); spark(s.t.x, s.t.y + 1, s.t.z, 0xff6050, 5, 3);
    if (s.t.hp <= 0) kill(s.t, s.u);
    return s.k > 0;
  });
}
// 번개비: 2~4개씩 3번 (0.6초 간격), 예고 0.9초, 20. 대부분 동료 근처, 나머지는 우물 아무 데나
function updateStorms(u, dt){
  G.storms = G.storms.filter(st => {
    st.next -= dt; if (st.next > 0) return true;
    st.waves++; st.next = 0.6;
    const team = allies().filter(t => !t.downed), n = 2 + Math.floor(Math.random() * 3), C = u.B.center;
    for (let i = 0; i < n; i++){
      const t = team.length && Math.random() < 0.7 ? team[Math.floor(Math.random() * team.length)] : null;
      let x = t ? t.x + rnd(-1.2, 1.2) : C.x + rnd(-7, 7), z = t ? t.z + rnd(-1.2, 1.2) : C.z + rnd(-4.5, 4.5);
      if (solidAt(G.map, x, z)){ x = C.x + rnd(-4, 4); z = C.z + rnd(-3, 3); }
      bossDecal('circle', { x, z, r: 1.2, dur: 0.9 + rnd(0, 0.25), color: 0xff4030, onDone: d => {
        boltFx(d.x, heightAt(G.map, d.x, d.z), d.z, 0.6, 0.35); ring(d.x, d.z, 0xff4040, 1.4, 0.35); spark(d.x, 0.4, d.z, 0xff8080, 10, 5); camShake(0.15, 0.12);
        for (const tt of allies()) if (inShape(d, tt) && !(tt.jy > 0.45)) hurt(u, tt, 20, { from: { x: d.x, z: d.z }, unblockable: true, stun: 0.25 });
      } });
    }
    return st.waves < 3;
  });
}
