/* boss.js v0.9 — 적뢰. v0.9: 동작이 끊기면 스스로 풀림 · 깔고 서지 않음 · 위협치로 표적 고름 (인주만 노리지 않음) · 강림 직후 2초 숨 · 날아차기는 체력 절반 넘는 자를 한 방에 못 죽임
   (v0.8까지) (튜토리얼 보스). 1페이즈는 2D판 적뢰를 그대로 옮김
   1페이즈
   - 대리석 주먹: 천천히 걸어오다 2.8칸 안이면 거의 예고 없이 (0.35초) 파고들어 내리찍음 (30) + 둘레 땅울림 (절반)
   - 천벌: 손을 들면 붉은 기운이 몸을 감싸고 머리 위로 번개가 튐. 2초 동안 가장 질긴 자를 따라가다 마지막 0.6초는 멈춤
           직격 45 + 감전 (5씩 5번) · 십자 4칸 · 둘레 2.5칸 10 + 잔류 (3씩 3번). 떨어진 뒤 6초는 숨을 고름
   - 번개비: 두 손을 치켜들고 0.8초 → 작은 낙뢰 2~4개씩 3번 (20, 예고 0.9초). 그동안 적뢰는 자유 행동 (대기 20초)
   - 날아차기: 거리 상관없이 (근접전 중이면 뒤로 크게 3칸 뛰고) 0.8초 웅크림 → 벽까지 일직선으로 날아참. 길 위의 모두를 쓸어버림 (80 확정 치명 · 날아감 · 쓰러짐), 막으면 60% 감소, 5% 머리가 터져 즉사
   - 대리석 피부 · 회피 스텝은 units.js hurt()
   2페이즈 (체력 55% 아래): 날아오름 (근접이 닿지 않음, 투창 · 총은 닿음). 하늘에서 붉은 창 (기둥 뒤에 숨으면 막힘) · 천벌
   10초마다 내려꽂히고 4초 숨을 고름 = 근접 딜 타임
   v0.8 (적뢰 팩): 그림을 새 동작으로 · 돌려차기 (카운터 · 치명이면 한 방에 넉다운, 평소엔 크게 밀려남) ·
   창은 두 가지: 바닥으로 쏘는 창 (1페이즈는 뛰어올라서, 2페이즈는 날면서) · 정면으로 던지는 창 (선 채로 일직선). 2페이즈는 나는 그림
   튕겨냄 (F 저스트): 하던 것이 끊기고 0.9초 휘청 */
'use strict';
const JR = { roundCd: 5, laserCd: 7, jumpCd: 9, punchCd: 2.2, thunderRest: 5, thunderCd: 3, rainCd: 18, kickCd: 5, spearCd: 3.4, descendCd: 10, kickSpeed: 30, kickDmg: 80 };
function bossInit(u, center){
  u.B = { phase: 1, act: null, cd: { punch: 1.2, thunder: 4, rain: 11, kick: 6, back: 1, spears: 2, descend: JR.descendCd, round: 3, laser: 8, jump: 12 }, center, orbit: 0 };
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
  unpin(u);
  // 하던 동작이 끊김 (예고 장판이 취소됨 등): 너무 오래 걸리면 풀고 다시 고름
  if (B.act && B.act.t > (B.act.type === 'descend' ? 7.5 : B.act.type === 'ascend' ? 3.5 : 4.5)){ if (B.phase === 1){ u.lift = 0; u.airborne = false; } u.inv = 0; u.decal = null; B.act = null; setPose(u, B.phase === 2 ? 'fly' : 'idle'); }
  if (B.act) return bossAct(u, B.act, dt);
  const team = allies(); if (!team.length) return;
  let tgt = bossTarget(u, team, dt);
  const d = dist(u, tgt);
  if (B.phase === 1){
    if (u.hp < u.max * 0.55){ return start(u, 'ascend'); }
    if (B.cd.thunder <= 0) return start(u, 'thunder');
    if (B.cd.rain <= 0) return start(u, 'rain');
    if (B.cd.kick <= 0 && d > 3.5 && losClear(G.map, u.x, u.z, tgt.x, tgt.z)) return start(u, 'kick', tgt);   // 거리 상관없이: 맵 끝까지 날아옴
    // 근접전 중엔 가끔 (매초 25%) 뒤로 크게 뛰어 물러난 뒤 날아차기
    if (B.cd.kick <= 0 && d < 3 && B.cd.back <= 0){ B.cd.back = 1; if (Math.random() < 0.25) return start(u, 'kick', tgt, true); }
    const see = losClear(G.map, u.x, u.z, tgt.x, tgt.z);
    if (B.cd.laser <= 0 && d > 4 && d < 15 && see) return start(u, 'laser', tgt);        // 정면으로 던지는 창
    if (B.cd.jump <= 0 && d > 3 && d < 12) return start(u, 'jump', tgt);                 // 뛰어올라 바닥으로 쏘는 창
    if (d < 2.6 && B.cd.round <= 0 && Math.random() < 0.5){ B.cd.round = 1; return start(u, 'round', tgt); }   // 돌려차기
    if (d < 2.8 && B.cd.punch <= 0) return start(u, 'punch', tgt);
    if (d > 2.2) navTo(u, tgt.x, tgt.z, u.spd, dt, 2.0); else u.moving = false;
    setAim(u, tgt.x, tgt.z); setPose(u, 'idle');
  } else {
    // 하늘: 우물 가운데를 천천히 돎
    B.orbit += dt * 0.25;
    const ox = clamp(B.center.x + Math.cos(B.orbit) * 4.5, 2, G.map.w - 3), oz = clamp(B.center.z + Math.sin(B.orbit) * 3.2, 2, 9);
    u.x += (ox - u.x) * Math.min(1, dt * 1.2); u.z += (oz - u.z) * Math.min(1, dt * 1.2);
    u.lift += (3 - u.lift) * Math.min(1, dt * 2);
    setAim(u, tgt.x, tgt.z); setPose(u, 'fly');
    if (B.cd.descend <= 0) return start(u, 'descend');
    if (B.cd.thunder <= 0) return start(u, 'thunder');
    if (B.cd.spears <= 0) return start(u, 'spears');
  }
}
// 위협치: 적뢰를 때린 만큼 쌓이고 (4초에 반씩 줆), 가까울수록 조금 더. 인주에게 약간 더 (주인공). 한 표적을 3초는 붙듦
function bossTarget(u, team, dt){
  const B = u.B; B.thr = B.thr || {}; B.tgtT = (B.tgtT || 0) - dt;
  for (const k in B.thr) B.thr[k] *= Math.pow(0.5, dt / 4);
  if (B.tgt && !B.tgt.dead && !B.tgt.downed && team.includes(B.tgt) && B.tgtT > 0) return B.tgt;
  let best = null, bs = -1;
  for (const t of team){ const sc = (B.thr[t.uid] || 0) + 30 / (1 + dist(u, t)) + (t === G.player ? 6 : 0) + Math.random() * 8; if (sc > bs){ bs = sc; best = t; } }
  if (best !== B.tgt && best) popText(best.x, best.y + bodyH(best) + 0.6, best.z, '노려본다', 'alert', 0.7);
  B.tgt = best; B.tgtT = 3; return best;
}
// 깔고 서지 않음: 몸 안으로 들어온 동료는 밖으로 밀어냄 (벽과 적뢰 사이에 끼어 못 움직이던 것)
function unpin(u){
  if (u.airborne) return;
  for (const t of allies()){
    const dx = t.x - u.x, dz = t.z - u.z, d = Math.hypot(dx, dz), need = u.r + t.r - 0.05;
    if (d >= need) continue;
    const n = d > 0.01 ? { x: dx / d, z: dz / d } : { x: Math.cos(u.aim + 1.6), z: Math.sin(u.aim + 1.6) };
    let px = u.x + n.x * (need + 0.05), pz = u.z + n.z * (need + 0.05);
    if (solidAt(G.map, px, pz)){ for (let a = 0.5; a < 6.3; a += 0.5){ const qx = u.x + Math.cos(Math.atan2(n.z, n.x) + a) * (need + 0.1), qz = u.z + Math.sin(Math.atan2(n.z, n.x) + a) * (need + 0.1); if (!solidAt(G.map, qx, qz)){ px = qx; pz = qz; break; } } }
    t.x += (px - t.x) * 0.5; t.z += (pz - t.z) * 0.5;
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
      A.phase = 1; setAim(u, A.tgt.x, A.tgt.z); setPose(u, 'punchUp');
      const px = A.tgt.x, pz = A.tgt.z;
      u.decal = bossDecal('circle', { x: px, z: pz, r: 1.3, dur: 0.35, onDone: d => {
        u.decal = null;
        const n = norm(px - u.x, pz - u.z), L = Math.max(0, Math.hypot(px - u.x, pz - u.z) - 1.0);
        moveBy(u, n.x * L, n.z * L); u.flash = 0.6; setPose(u, 'punchHit');
        const quake = { shape: 'circle', x: px, z: pz, r: 2.5 };
        for (const t of allies()){
          if (inShape(d, t)) hurt(u, t, u.atk, { kb: 2.2, from: u, stun: 0.5 });
          else if (inShape(quake, t) && !(t.jy > 0.45)) hurt(u, t, u.atk * 0.5, { kb: 1.0, from: { x: px, z: pz } });
        }
        camShake(0.4, 0.25); ring(px, pz, 0xff6a5a, 1.3, 0.3); ring(px, pz, 0xc8b8a0, 2.5, 0.5); dust(px, pz, 14); smoke(px, pz, 5, 0.9, 1.0); SFX.boom(0.6);
        A.phase = 2; A.t = 0;
      } });
    }
    if (A.phase === 2 && A.t > 0.55){ B.cd.punch = JR.punchCd; endAct(u); }
    return;
  }
  if (A.type === 'thunder'){
    if (A.phase === 0){
      A.phase = 1; setPose(u, B.phase === 2 ? 'fly' : 'raise'); u.moving = false;
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
    if (A.t > 2.0 && B.phase === 1) setPose(u, 'raiseEnd');
    if (A.t > 2.3){ B.cd.thunder = JR.thunderRest + (B.phase === 1 ? JR.thunderCd : 1); u.redTint = false; endAct(u); }
    return;
  }
  if (A.type === 'rain'){
    if (A.phase === 0){ A.phase = 1; setPose(u, 'raise'); u.moving = false; popText(u.x, u.y + 4.6, u.z, '두 손을 치켜든다', 'alert', 1.2); camShake(0.1, 0.8); }
    castAura(u, dt);
    if (A.t > 0.8){ u.redTint = false; G.storms.push({ waves: 0, next: 0 }); B.cd.rain = JR.rainCd; endAct(u); }
    return;
  }
  if (A.type === 'kick'){
    // 0: (뒤로 뛰기) → 1: 웅크림 0.8초 + 벽까지 이어진 일직선 → 2: 도약 0.25 → 3: 비행 (벽까지, 길 위의 모두를 쓸어버림) → 4: 착지 (연기 · 쿵)
    if (A.phase === 0){
      setAim(u, A.tgt.x, A.tgt.z);
      if (A.back){ A.phase = 'back'; A.t = 0; setPose(u, 'leap'); A.ba = u.aim + Math.PI; popText(u.x, u.y + 4, u.z, '…!', 'alert', 0.8); }
      else A.phase = 'prep';
    }
    if (A.phase === 'back'){
      const k = Math.min(1, A.t / 0.5); u.lift = Math.sin(Math.PI * k) * 1.4; u.inv = 1;
      moveBy(u, Math.cos(A.ba) * 3 / 0.5 * dt, Math.sin(A.ba) * 3 / 0.5 * dt);
      if (k >= 1){ u.lift = 0; u.inv = 0; dust(u.x, u.z, 10); smoke(u.x, u.z, 4, 0.9, 0.8); SFX.boom(0.5); A.phase = 'prep'; }
    }
    if (A.phase === 'prep'){
      A.phase = 1; A.t = 0; setPose(u, 'prep'); setAim(u, A.tgt.x, A.tgt.z);
      A.a = u.aim; A.len = kickReach(u, A.a); A.swept = new Set();
      camShake(0.06, 0.8); SFX.burst({ type: 'lowpass', f: 140, gain: 0.35, att: 0.6, dec: 0.3 });
      u.decal = bossDecal('line', { x: u.x, z: u.z, len: A.len + 0.8, w: 1.6, a: A.a, dur: 0.8, onDone: () => { u.decal = null; A.phase = 2; A.t = 0; setPose(u, 'leap'); SFX.whoosh(); } });
    }
    if (A.phase === 1){ if (Math.random() < dt * 20) dust(u.x + rnd(-0.6, 0.6), u.z + rnd(-0.6, 0.6), 1); }
    if (A.phase === 2){
      u.inv = 1; u.lift = Math.min(1.0, A.t / 0.25);
      if (A.t > 0.25){ A.phase = 3; A.t = 0; A.went = 0; setPose(u, 'kick'); camShake(0.2, 0.35); }
    }
    if (A.phase === 3){
      const step = Math.min(A.len - A.went, JR.kickSpeed * dt), ox = u.x, oz = u.z;
      moveBy(u, Math.cos(A.a) * step, Math.sin(A.a) * step); A.went += step;
      const moved = Math.hypot(u.x - ox, u.z - oz);
      if (Math.random() < 0.7) dust(u.x, u.z, 2);
      // 길 위의 모두를 쓸어버림 (점프로 넘거나 구르기 무적이면 피함)
      for (const t of allies()) if (!A.swept.has(t) && Math.hypot(t.x - u.x, t.z - u.z) < u.r + t.r + 0.35 && !(t.jy > 0.9) && !(t.inv > 0)){ A.swept.add(t); kickHit(u, t, A.a); }
      if (A.went >= A.len - 0.01 || moved < step * 0.3){
        A.phase = 4; A.t = 0; u.lift = 0; u.inv = 0;
        dust(u.x, u.z, 22); smoke(u.x + Math.cos(A.a) * 0.6, u.z + Math.sin(A.a) * 0.6, 12, 1.4, 1.6); ring(u.x, u.z, 0xc8b8a0, 3.2, 0.5);
        camShake(0.5, 0.45); SFX.boom(1.2);
      }
    }
    if (A.phase === 4 && A.t > 0.7){ B.cd.kick = rnd(4.5, 6.5); endAct(u); }
    return;
  }
  if (A.type === 'ascend'){
    if (A.phase === 0){
      A.phase = 1; u.inv = 99; setPose(u, 'jumpUp'); camFocus(u.x, u.z, 2.4, 6.5, 7.5, 0.05); camShake(0.2, 2.2);
      popText(u.x, u.y + 4.5, u.z, '…', 'alert', 1.5); G.rain && (G.rain.on = true);
      flashScreen('#fff', 0.5);
    }
    castAura(u, dt);
    if (A.t > 0.8){ setPose(u, 'fly'); u.lift = Math.min(3, (A.t - 0.8) * 2.2); if (u.lift > 1) u.airborne = true; }
    if (A.t > 2.4){ B.phase = 2; u.inv = 0; u.redTint = false; B.cd.spears = 1; B.cd.thunder = 4; B.cd.descend = JR.descendCd; setPose(u, 'fly'); endAct(u); G.onBossPhase && G.onBossPhase(2); }
    return;
  }
  if (A.type === 'spears'){
    // 2페이즈 바닥으로 쏘는 창: 날면서 최대 3명의 발밑으로 (원이 다 차면 하늘에서 붉은 창이 꽂힘)
    if (A.phase === 0){
      A.phase = 1; setPose(u, 'flyUp'); popText(u.x, u.y + u.lift + 4.2, u.z, '붉은 창', 'alert', 1.0);
      allies().sort(() => Math.random() - 0.5).slice(0, 3).forEach((t, i) => bossDecal('circle', { x: t.x, z: t.z, r: 1.5, dur: 1.0 + i * 0.18, color: 0xff2030, onDone: d => { setPose(u, 'flyShot'); floorSpear(u, d, 32); } }));
    }
    if (A.t > 1.9){ B.cd.spears = JR.spearCd; setPose(u, 'fly'); endAct(u); }
    return;
  }
  if (A.type === 'jump'){
    // 1페이즈 바닥으로 쏘는 창: 웅크렸다 뛰어올라 (그림이 하늘에 있음 · 근접이 닿지 않음) 상대 발밑으로. 원은 0.6초 따라가다 멈춤
    if (A.phase === 0){
      A.phase = 1; setPose(u, 'jumpUp'); setAim(u, A.tgt.x, A.tgt.z); u.moving = false;
      u.decal = bossDecal('circle', { x: A.tgt.x, z: A.tgt.z, r: 1.8, dur: 1.2, follow: A.tgt, color: 0xff2030, onDone: d => { u.decal = null; setPose(u, 'jumpShot'); floorSpear(u, d, 45); A.phase = 2; A.t = 0; } });
    }
    if (A.phase === 1){ if (A.t > 0.6 && u.decal) u.decal.follow = null; if (A.t > 0.35) u.airborne = true; }
    if (A.phase === 2 && A.t > 0.9){ u.airborne = false; B.cd.jump = JR.jumpCd; endAct(u); }
    return;
  }
  if (A.type === 'laser'){
    // 정면으로 던지는 창: 선 채로 손을 들어 창을 만들고 (0.9초, 기둥 · 벽까지 이어진 일직선) → 붉은 창이 일직선으로 꿰뚫음
    if (A.phase === 0){
      A.phase = 1; setPose(u, 'laserUp'); setAim(u, A.tgt.x, A.tgt.z); u.moving = false;
      A.a = u.aim; A.len = losReach(u, A.a, 16);
      u.decal = bossDecal('line', { x: u.x, z: u.z, len: A.len, w: 1.1, a: A.a, dur: 0.9, color: 0xff2030, onDone: d => {
        u.decal = null; setPose(u, 'laserShot'); A.phase = 2; A.t = 0;
        const y0 = u.y + 2.4, ex = u.x + Math.cos(A.a) * A.len, ez = u.z + Math.sin(A.a) * A.len;
        beam(u.x + Math.cos(A.a) * 0.6, y0, u.z + Math.sin(A.a) * 0.6, ex, heightAt(G.map, ex, ez) + 1.0, ez, 0.16, 0.5);
        for (let s = 1; s < A.len; s += 0.8) spark(u.x + Math.cos(A.a) * s, 1.2, u.z + Math.sin(A.a) * s, 0xff4040, 2, 2, 0.2, 0.3);
        ring(ex, ez, 0xff3040, 1.4, 0.4); smoke(ex, ez, 5, 1.0, 0.8); camShake(0.35, 0.3); SFX.burst({ type: 'highpass', f: 900, f2: 3000, gain: 0.5, dec: 0.3 }); SFX.boom(0.7);
        for (const t of allies()) if (inShape(d, t)) hurt(u, t, 40, { from: u, kb: 1.8, stun: 0.35 });
      } });
    }
    if (A.phase === 2 && A.t > 0.8){ B.cd.laser = JR.laserCd; endAct(u); }
    return;
  }
  if (A.type === 'round'){
    // 돌려차기: 다리에 붉은 번개가 차오름 (0.5초, 앞쪽 부채꼴) → 크게 밀려남. 상대가 치는 중이면 (카운터) 또는 치명이면 한 방에 넉다운
    if (A.phase === 0){
      A.phase = 1; setPose(u, 'roundUp'); setAim(u, A.tgt.x, A.tgt.z); u.moving = false;
      u.decal = bossDecal('sector', { x: u.x, z: u.z, r: 2.8, a: u.aim, arc: 2.4, dur: 0.5, onDone: d => {
        u.decal = null; setPose(u, 'roundHit'); A.phase = 2; A.t = 0; SFX.whoosh(); camShake(0.3, 0.25);
        spark(u.x + Math.cos(u.aim) * 1.6, u.y + 1.6, u.z + Math.sin(u.aim) * 1.6, 0xff4040, 16, 6); ring(u.x, u.z, 0xff4040, 2.8, 0.35);
        for (const t of allies()) if (inShape(d, t)) roundHit(u, t);
      } });
    }
    if (A.phase === 2 && A.t > 0.7){ B.cd.round = JR.roundCd; endAct(u); }
    return;
  }
  if (A.type === 'descend'){
    if (A.phase === 0){ A.phase = 1; setPose(u, 'fly'); A.d = bossDecal('circle', { x: u.x, z: u.z, r: 2.6, dur: 1.0 }); }
    if (A.phase === 1 && A.t > 1.0){
      A.phase = 2; A.t = 0; u.lift = 0; u.airborne = false; setPose(u, 'punchHit');
      for (const t of allies()) if (inShape(A.d, t) && !(t.jy > 0.45)) hurt(u, t, 35, { kb: 2.6, from: u, stun: 0.5 });
      camShake(0.6, 0.45); ring(u.x, u.z, 0xff6a5a, 3, 0.5); dust(u.x, u.z, 18); smoke(u.x, u.z, 14, 1.4, 2.0); SFX.boom(1.3);
      popText(u.x, u.y + 3.8, u.z, '숨을 고른다', 'heal', 1.4);
    }
    if (A.phase === 1) u.lift = Math.max(0, 3 * (1 - A.t / 1.0));
    if (A.phase === 2 && A.t > 0.4) setPose(u, 'hurt');
    if (A.phase === 2 && A.t > 4){ A.phase = 3; A.t = 0; setPose(u, 'fly'); }
    if (A.phase === 3){ u.lift = Math.min(3, A.t * 2.5); if (u.lift > 1) u.airborne = true; if (A.t > 1.2){ B.cd.descend = JR.descendCd; endAct(u); } }
    return;
  }
  endAct(u);
}
// 돌려차기 맞음
function roundHit(u, t){
  const guarded = t.guard && Math.abs(angDiff(Math.atan2(u.z - t.z, u.x - t.x), t.aim)) < 1.25;
  const counter = t.st === 'windup' || t.st === 'strike' || (t.kind === 'player' && P.atkCd > 0.05);
  const crit = Math.random() < 0.12;
  SFX.hit();
  if (!guarded && (counter || crit)){
    popText(t.x, t.y + 2.8, t.z, counter ? '카운터! 넉다운' : '치명! 넉다운', 'crit', 1.4); smoke(t.x, t.z, 6, 1.0, 0.6); SFX.boom(0.9);
    hurt(u, t, t.hp * 1.25 + 10, { from: u, unblockable: true, kb: 5, noCam: true }); G.hitstop = Math.max(G.hitstop, 0.12); camShake(0.6, 0.4);
  } else hurt(u, t, 50, { from: u, kb: 4.5, stun: 0.4 });
}
// 바닥으로 쏘는 창이 꽂힘: 하늘 (적뢰의 손)에서 원 한가운데로 붉은 창
function floorSpear(u, d, dmg){
  const gy = heightAt(G.map, d.x, d.z), hy = u.y + (u.lift || 0) + 3.2;
  beam(u.x, hy, u.z, d.x, gy, d.z, 0.14, 0.45);
  ring(d.x, d.z, 0xff3040, d.r + 0.4, 0.4); spark(d.x, gy + 0.4, d.z, 0xff6050, 18, 6); smoke(d.x, d.z, 6, 1.1, 1.0); camShake(0.4, 0.3);
  SFX.burst({ type: 'highpass', f: 1400, gain: 0.45, dec: 0.15 }); SFX.boom(0.8);
  const scorch = new THREE.Mesh(new THREE.CircleGeometry(d.r * 0.7, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x1a0606, transparent: true, opacity: 0.75, depthWrite: false }));
  scorch.position.set(d.x, gy + 0.02, d.z); G.scene.add(scorch); G.fx.push({ s: scorch, vx: 0, vy: 0, vz: 0, t: 0, life: 4, size: 1, grav: 0 });
  for (const t of allies()) if (inShape(d, t) && !(t.jy > 0.45)) hurt(u, t, dmg, { from: { x: d.x, z: d.z }, kb: 2, stun: 0.4 });
}
// 붉은 빛줄기 (두 점 사이): 겉은 붉게 퍼지고 속은 하얗게
function beam(x1, y1, z1, x2, y2, z2, w, life){
  const a = new THREE.Vector3(x1, y1, z1), b = new THREE.Vector3(x2, y2, z2), L = a.distanceTo(b), dir = b.clone().sub(a).normalize();
  for (const [ww, col, op, lf] of [[w * 2.6, 0xff2a2a, 0.55, life], [w, 0xffd0d0, 0.95, life * 0.7]]){
    const m = new THREE.Mesh(new THREE.CylinderGeometry(ww, ww, L, 10, 1, true), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); G.scene.add(m);
    G.fx.push({ s: m, vx: 0, vy: 0, vz: 0, t: 0, life: lf, size: 1, grav: 0 });
  }
}
// 정면 창이 닿는 길 끝: 벽 · 기둥 (바위는 넘음)까지
function losReach(u, a, max){
  const m = G.map; let d = 0.5;
  for (; d < max; d += 0.2){ const i = Math.round(u.x + Math.cos(a) * d), j = Math.round(u.z + Math.sin(a) * d); if (i < 0 || j < 0 || i >= m.w || j >= m.h || m.los[j * m.w + i]) break; }
  return Math.max(1.5, d);
}
// 날아차기가 닿는 길 끝: 벽 (바위는 넘음)까지, 최대 18칸
function kickReach(u, a){
  const m = G.map; let d = 0;
  for (; d < 18; d += 0.2){ const x = u.x + Math.cos(a) * (d + u.r), z = u.z + Math.sin(a) * (d + u.r), i = Math.round(x), j = Math.round(z), k = j * m.w + i;
    if (i < 0 || j < 0 || i >= m.w || j >= m.h || (m.solid[k] && !m.low[k])) break; }
  return Math.max(1, d - 0.2);
}
// 날아차기 맞음: 막으면 60% 감소 (튕겨냄 없음), 아니면 확정 치명 80 + 날아감 + 쓰러짐. 5% 머리가 터져 즉사
function kickHit(u, t, a){
  const from = { x: t.x - Math.cos(a) * 2, z: t.z - Math.sin(a) * 2 };   // 날아차기 방향으로 날려버림
  const blocked = t.guard && Math.abs(angDiff(a + Math.PI, t.aim)) < 1.25;
  smoke(t.x, t.z, 6, 1.0, 0.6); SFX.hit(); SFX.boom(0.8);
  const full = t.hp > t.max * 0.5;   // v0.9: 멀쩡한 자는 한 방에 안 죽음 (1 남기고 쓰러짐)
  if (!blocked && !full && Math.random() < 0.05){
    popText(t.x, t.y + 2.4, t.z, '머리가 터졌다', 'crit', 1.6); spark(t.x, t.y + bodyH(t), t.z, 0xff2020, 30, 7);
    hurt(u, t, 9999, { from, unblockable: true, kb: 6 });
  } else if (blocked){
    hurt(u, t, JR.kickDmg * 0.4, { from, unblockable: true, kb: 3.5, stun: 0.5 }); popText(t.x, t.y + 2.4, t.z, '막음', 'miss');
  } else { hurt(u, t, JR.kickDmg / 2, { from, unblockable: true, crit: true, critMul: 2, kb: 6, stun: 1.3, noCam: true, keep1: full }); if (full) popText(t.x, t.y + 3.3, t.z, '버텼다!', 'heal', 1.0); popText(t.x, t.y + 2.8, t.z, '쓰러짐', 'hurt', 1.0); }
  camShake(0.6, 0.4); G.hitstop = Math.max(G.hitstop, 0.1);
}
function strikeThunder(u, d){
  const x = d.x, z = d.z, y = heightAt(G.map, x, z);
  // 쩍 → 쾅 (번쩍 세 번) → 우르르릉 (길게 흔들림) · 연기 · 그을음
  boltFx(x, y, z, 1.8, 0.6); SFX.thunder();
  flashScreen('#ffffff', 0.95); camShake(0.85, 0.45);
  wait(0.1).then(() => { boltFx(x + rnd(-0.3, 0.3), y, z + rnd(-0.3, 0.3), 1.0, 0.35); flashScreen('#ffd8d8', 0.7); });
  wait(0.28).then(() => { flashScreen('#ffe8e8', 0.4); camShake(0.3, 1.4); });
  ring(x, z, 0xff4040, 2.5, 0.5); ring(x, z, 0xffb0a0, 5, 0.8); spark(x, y + 0.5, z, 0xff8080, 34, 9);
  smoke(x, z, 16, 1.6, 2.2, 0x5a5460, 2.6);
  const scorch = new THREE.Mesh(new THREE.CircleGeometry(1.3, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x120a0a, transparent: true, opacity: 0.8, depthWrite: false }));
  scorch.position.set(x, y + 0.02, z); G.scene.add(scorch); G.fx.push({ s: scorch, vx: 0, vy: 0, vz: 0, t: 0, life: 5, size: 1, grav: 0 });
  // 십자로 뻗는 전격
  for (const a of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) for (let s = 1; s <= 4; s++) spark(x + Math.cos(a) * s, y + 0.2, z + Math.sin(a) * s, 0xff6050, 4, 2.5, 0.22, 0.35);
  for (const t of allies()){
    const dx = t.x - x, dz = t.z - z, dd = Math.hypot(dx, dz), cross = (Math.abs(dx) < 0.4 + t.r && Math.abs(dz) < 4.2) || (Math.abs(dz) < 0.4 + t.r && Math.abs(dx) < 4.2);
    if (dd <= d.r + t.r * 0.6){ hurt(u, t, 60, { from: { x, z }, stun: 0.9, unblockable: true, kb: 1.5 }); shock(u, t, 6, 5); }
    else if (cross || dd < 2.5){ hurt(u, t, 15, { from: { x, z }, unblockable: true, kb: 0.8 }); shock(u, t, 3, 3); }
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
        boltFx(d.x, heightAt(G.map, d.x, d.z), d.z, 0.7, 0.35); ring(d.x, d.z, 0xff4040, 1.4, 0.35); spark(d.x, 0.4, d.z, 0xff8080, 12, 5); camShake(0.22, 0.15); smoke(d.x, d.z, 3, 0.9, 0.5);
        SFX.burst({ type: 'highpass', f: 1500, gain: 0.35, dec: 0.12 }); SFX.thump(70, 0.4, 0.35);
        for (const tt of allies()) if (inShape(d, tt) && !(tt.jy > 0.45)) hurt(u, tt, 24, { from: { x: d.x, z: d.z }, unblockable: true, stun: 0.3, kb: 0.8 });
      } });
    }
    return st.waves < 3;
  });
}
