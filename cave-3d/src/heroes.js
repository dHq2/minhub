/* heroes.js v1.1 — 새 영웅 · 강적 (2D판 원화 · 기술을 3D로)
   v1.1 (v0.85, 4기): GOOD WILL 마운트 파운딩 — 넘어진 적에 올라타 주먹 넷 (마지막은 번개). 그림은 드라이브 '굿윌 파운딩' 시트 (상대 인형은 지움, foe4.js)
   · GOOD WILL (영웅, 2층 만남에서 영입): 밝은 무술가 · 푸른 번개. 거리를 두고 번개로 괴롭히다 사각으로 순간이동해 파고듦
     손바닥 (붙잡아 클린치) · 무릎 (빈틈이면 머리 무릎 = 확정 치명) · 내리꽂기 (날아올라 둘레 번개) · 손가락 튕기기 (번개 1 · 3) · 올려차기
   · 단달로 (강적, 3 · 4층): "경전" 큰 도끼 가면의 사내. 휘두르기 · 내려찍기 · 붙잡아 메치기
   · 벤킨 (강적, 2층): 사슬에 감긴 가시관의 여자. 넓게 휩쓸기 · 사슬 당기기 · 막기 자세 */
'use strict';
const GWA = 'assets/';
const gwP = (file, w, h, n, fps, ax, ay, once = true) => ({ src: GWA + file, w, h, n, fps, ax, ay, f: 1, once });
SPR.goodwill = { h0: 300, tall: 1.55, poses: {
  idle: { ...gwP('gw_idle.webp', 107, 310, 9, 7, 50, 302, false) },
  walk: { src: GWA + 'gw_run.webp', w: 257, h: 265, ax: 130, ay: 254, f: 1 },
  attack: { src: GWA + 'gw_attack.webp', w: 242, h: 270, ax: 136, ay: 268, f: 1 },
  windup: { src: GWA + 'gw_attack.webp', w: 242, h: 270, ax: 136, ay: 268, f: 1 },
  hurt: { src: GWA + 'gw_attack.webp', w: 242, h: 270, ax: 136, ay: 268, f: 1 },
  knee: gwP('gw_knee.webp', 673, 376, 14, 13, 427, 365), kneeHead: gwP('gw_kneeHead.webp', 761, 476, 15, 13, 471, 465),
  palm: gwP('gw_palm.webp', 643, 400, 10, 12, 297, 389), slam: gwP('gw_slam.webp', 571, 476, 20, 13, 278, 465),
  rise: gwP('gw_rise.webp', 379, 476, 14, 15, 148, 465), dash: gwP('gw_dash.webp', 606, 278, 7, 12, 471, 267),
  snap1: gwP('gw_snap1.webp', 270, 372, 13, 11, 125, 363), snap3: gwP('gw_snap3.webp', 210, 315, 17, 12, 120, 307) } };
DEFS.goodwill = { spr: 'goodwill', name: 'GOOD WILL', hp: 230, atk: 20, spd: 3.9, r: 0.32, weight: 75, think: gwThink, melee: { range: 1.5, arc: 1.6, windup: 0.25, cd: 0.8, mul: 1, kb: 0.6 } };
HERO_DEF.goodwill = { name: 'GOOD WILL', unit: 'goodwill', face: 'assets/goodwill_face.png', attr: { str: 7, dex: 9, vit: 6, wil: 5, per: 7 },
  note: '밝음 · 무술가 · 푸른 번개. 잡고 무릎, 날아올라 내리꽂음', line: ['좋아, 좋아! 같이 가자!', '빈틈이다!', '번개 맛 좀 봐!'] };

SPR.dandalo = { h0: 440, tall: 2.0, poses: {
  idle: { src: GWA + 'dandalo_idle.png', w: 424, h: 440, ax: 178, ay: 440, f: 1 }, windup: { src: GWA + 'dandalo_prep.png', w: 357, h: 441, ax: 176, ay: 441, f: 1 },
  attack: { src: GWA + 'dandalo_strike.png', w: 446, h: 391, ax: 165, ay: 391, f: 1 }, slam: { src: GWA + 'dandalo_slam.png', w: 439, h: 424, ax: 165, ay: 424, f: 1 } } };
DEFS.dandalo = { spr: 'dandalo', name: '단달로', hp: 560, atk: 30, spd: 2.3, r: 0.55, weight: 420, armor: 0.6,
  melee: { range: 2.3, arc: 2.1, windup: 0.75, cd: 2.0, mul: 1.15, kb: 1.6 }, grab: { reach: 1.9, cd: 6.5, wind: 0.6 } };
SPR.benkin = { h0: 460, tall: 1.95, poses: {
  idle: { src: GWA + 'benkin_idle.png', w: 275, h: 460, ax: 145, ay: 460, f: 1 }, attack: { src: GWA + 'benkin_attack.png', w: 304, h: 460, ax: 90, ay: 460, f: 1 },
  hurt: { src: GWA + 'benkin_guard.png', w: 414, h: 436, ax: 200, ay: 392, f: 1 }, guard: { src: GWA + 'benkin_guard.png', w: 414, h: 436, ax: 200, ay: 392, f: 1 } } };
DEFS.benkin = { spr: 'benkin', name: '벤킨', hp: 420, atk: 24, spd: 3.0, r: 0.4, weight: 130, block: 0.35,
  melee: { range: 2.1, arc: 2.7, windup: 0.5, cd: 1.6, mul: 1, kb: 0.9 }, chain: { len: 5, cd: 6 } };
DEFS.brute.grab = { reach: 1.8, cd: 7.5, wind: 0.65 };
Object.assign(FOE_XP, { dandalo: 110, benkin: 80 }); Object.assign(FOE_DEF, { dandalo: 14, benkin: 6 });

/* ---------- 번개 (그림) ---------- */
function bolt(x, z, big){
  const h = big ? 9 : 6, m = new THREE.Mesh(new THREE.PlaneGeometry(big ? 0.55 : 0.3, h), new THREE.MeshBasicMaterial({ map: sparkTex, color: 0x9fe0ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  m.position.set(x, heightAt(G.map, x, z) + h / 2, z); m.rotation.y = CAM.yaw; G.scene.add(m);
  G.fx.push({ s: m, t: 0, life: big ? 0.35 : 0.2, vx: 0, vy: 0, vz: 0 });
  spark(x, 0.6, z, 0xcfefff, big ? 16 : 6, big ? 6 : 3); if (big){ ring(x, z, 0x9fe0ff, 2.4, 0.4); camShake(0.25, 0.2); SFX.thunder && SFX.burst({ type: 'highpass', f: 2000, gain: 0.4, dec: 0.15 }); }
  else SFX.burst({ type: 'highpass', f: 3000, gain: 0.18, dec: 0.08 });
}
function blinkTo(u, x, z){ if (solidAt(G.map, x, z)) return false; ghost(u); u.x = x; u.z = z; spark(x, 1, z, 0x9fe0ff, 6, 3); return true; }

/* ---------- GOOD WILL 두뇌 ---------- */
const GWS = { pound: { cd: 7, reach: 3.6, mul: 0.5 }, palm: { cd: 7, reach: 3.4 }, knee: { cd: 3.2, reach: 4.2, mul: 1.5, head: 2.6 }, slam: { cd: 8, reach: 5.5, r: 2.4, mul: 1.5 }, snap1: { cd: 5, reach: 7, min: 2, mul: 1.1 }, snap3: { cd: 6, reach: 7, min: 2, mul: 0.7 }, rise: { cd: 4.5, reach: 1.7, mul: 1.4 } };
function gwThink(u, dt){
  if (u.side === 'enemy') return enemyThink(u, dt);
  if (u.downed) return;
  const g = u.gw || (u.gw = { cd: { palm: 3, knee: 1.5, slam: 4, snap1: 2, snap3: 3, rise: 2 }, act: null, kiteT: 0 });
  for (const k in g.cd) g.cd[k] -= dt;
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; } g.act = null; u.lift = 0; return; }
  if (g.act) return gwAct(u, g, dt);
  const pl = G.player, anc = u.guest ? u : pl, list = foes().filter(e => e.alert && !e.dead && dist(e, anc) < 16), tgt = G.cmd === 'focus' && G.focusTarget && !G.focusTarget.dead && !u.guest ? G.focusTarget : nearest(u, list, 20);
  if (u.guest && !tgt){ u.moving = false; setPose(u, 'idle'); return; }   // 만남 전: 제자리
  if (!tgt || G.cmd === 'follow' && !pl.downed && !u.guest) return allyThink(u, dt);
  const d = dist(u, tgt); setAim(u, tgt.x, tgt.z);
  // 기술 고르기
  const can = k => (g.cd[k] ?? 0) <= 0 && d <= GWS[k].reach && d >= (GWS[k].min || 0) && sees(u, tgt);
  const opts = [];
  if (can('knee')) opts.push('knee', ...(tgt.st === 'windup' || tgt.st === 'hurt' || tgt.lock ? ['knee', 'knee', 'knee'] : []));
  if (can('palm') && canGrab(u, tgt)) opts.push('palm');
  if (can('slam')) opts.push('slam', ...(foes().filter(e => dist(e, tgt) < GWS.slam.r).length >= 2 ? ['slam'] : []));
  if (can('snap1')) opts.push('snap1'); if (can('snap3')) opts.push('snap3');
  if (can('rise')) opts.push('rise');
  if (can('pound') && tgt.lying && !tgt.D.boss && !tgt.D.heavy && SPR.goodwill.poses.pound) opts.push('pound', 'pound', 'pound');   // v1.1 넘어진 적 = 올라타 파운딩
  if (opts.length && Math.random() < dt * 4){
    const type = opts[Math.floor(Math.random() * opts.length)];
    g.act = { type, t: 0, tgt, sx: u.x, sz: u.z, mx: tgt.x, mz: tgt.z, done: 0 };
    if (type === 'knee'){ const open = tgt.st === 'windup' || tgt.st === 'hurt' || !!tgt.lock; g.act.crit = Math.random() < (open ? 0.6 : 0.22); g.act.pose = g.act.crit ? 'kneeHead' : 'knee'; if (open) popText(u.x, u.y + 2.4, u.z, '빈틈!', 'aim', 0.6); }
    else g.act.pose = type;
    setPose(u, g.act.pose); u.poseT = 0; u.st = 'skill';
    return;
  }
  // 치고 빠지기: 3 ~ 4.5칸 거리, 1.8초마다 옆 · 뒤로 순간 이동
  g.kiteT -= dt;
  if (g.kiteT <= 0 && d < 6){ g.kiteT = rnd(1.4, 2.4); const a = tgt.aim + Math.PI + rnd(-1.6, 1.6), L = rnd(2.6, 3.8); blinkTo(u, tgt.x + Math.cos(a) * L, tgt.z + Math.sin(a) * L); return; }
  if (d > 4.6) navTo(u, tgt.x, tgt.z, u.spd, dt, 3.5);
  else if (d < 2.4) steerTo(u, u.x - (tgt.x - u.x), u.z - (tgt.z - u.z), u.spd, dt);
  else setPose(u, 'idle');
}
const gwHitT = (pose, f) => f / SPR.goodwill.poses[pose].fps, gwLen = pose => SPR.goodwill.poses[pose].n / SPR.goodwill.poses[pose].fps;
function gwAct(u, g, dt){
  const A = g.act, o = A.tgt; A.t += dt; u.moving = false;
  const end = () => { g.cd[A.type] = GWS[A.type].cd; g.act = null; u.lift = 0; u.st = 'idle'; setPose(u, 'idle'); };
  if (o.dead && !A.done) return end();
  if (A.type === 'palm'){
    if (!A.go){ A.go = true; const n = norm(o.x - u.x, o.z - u.z); blinkTo(u, o.x - n.x * 0.8, o.z - n.z * 0.8); setAim(u, o.x, o.z); }
    if (!A.done && A.t >= gwHitT('palm', 4)){ A.done = 1; if (dist(u, o) < 1.6 && canGrab(u, o)){ hurt(u, o, u.atk * 0.6, { from: u, grapple: true }); addStatus(o, 'shock', { t: 0.4 }); bolt(o.x, o.z, false); const L = grab(u, o); if (L) L.hits = 0; end(); return; } popText(u.x, u.y + 2.2, u.z, '헛짚음 — 빈틈', 'miss', 0.8); }
    if (A.t >= gwLen('palm')) end(); return;
  }
  if (A.type === 'knee'){
    const P2 = A.pose;
    if (!A.dashed && A.t >= gwHitT(P2, 3)){ A.dashed = true; const a = o.aim + Math.PI * (0.6 + Math.random() * 0.5) * (Math.random() < 0.5 ? 1 : -1); blinkTo(u, o.x + Math.cos(a) * 0.9, o.z + Math.sin(a) * 0.9) || blinkTo(u, o.x - Math.cos(u.aim) * 0.9, o.z - Math.sin(u.aim) * 0.9); setAim(u, o.x, o.z); }
    if (!A.done && A.t >= gwHitT(P2, P2 === 'kneeHead' ? 5 : 6)){
      A.done = 1;
      if (dist(u, o) < 1.8){ hurt(u, o, u.atk * (A.crit ? GWS.knee.head : GWS.knee.mul), { from: u, crit: A.crit || undefined, pierce: A.crit, stun: o.D.heavy ? 0.2 : 0.5, kb: 1 }); popText(o.x, o.y + bodyH(o) * (A.crit ? 1 : 0.7), o.z, '빠아악!', A.crit ? 'crit' : 'big', 0.6); if (A.crit){ G.hitstop = Math.max(G.hitstop, 0.14); camShake(0.4, 0.2); } }
    }
    if (A.t >= gwLen(P2)) end(); return;
  }
  if (A.type === 'slam'){
    const t0 = gwHitT('slam', 2), t1 = gwHitT('slam', 13);
    if (!A.done){ A.mx = o.x; A.mz = o.z; }
    if (A.t > t0 && !A.done){ const k = Math.min(1, (A.t - t0) / (t1 - t0)); u.x = lerp(A.sx, A.mx - (A.mx - A.sx) * 0.12, k); u.z = lerp(A.sz, A.mz - (A.mz - A.sz) * 0.12, k); u.lift = Math.sin(Math.PI * k) * 2.2; u.inv = 0.1; }
    if (!A.done && A.t >= t1){
      A.done = 1; u.lift = 0; bolt(u.x, u.z, true); dust(u.x, u.z, 16); G.hitstop = Math.max(G.hitstop, 0.1);
      for (const e of foes()) if (dist(e, u) < GWS.slam.r){ hurt(u, e, u.atk * GWS.slam.mul, { from: u, kb: 1.5, stun: e.D.heavy ? 0.3 : 0.9 }); addStatus(e, 'shock', { t: 0.5 }); }
    }
    if (A.t >= gwLen('slam')) end(); return;
  }
  if (A.type === 'snap1' || A.type === 'snap3'){
    const hits = A.type === 'snap1' ? [6] : [6, 10, 14];
    while (A.done < hits.length && A.t >= gwHitT(A.type, hits[A.done])){ A.done++; if (o.dead) continue; const big = A.type === 'snap1'; bolt(o.x, o.z, big); hurt(u, o, u.atk * GWS[A.type].mul, { from: u, ranged: true, hitsAir: true, stun: big ? 0.35 : 0.15 }); if (big) addStatus(o, 'shock', { t: 0.6 }); }
    if (A.t >= gwLen(A.type)) end(); return;
  }
  if (A.type === 'pound'){   // v1.1 마운트 파운딩: 넘어진 적에 올라타 주먹 넷 (마지막은 번개) — 맞는 동안은 못 일어남, 먼저 일어나면 그만
    if (!A.go){ A.go = true; setAim(u, o.x, o.z); blinkTo(u, o.x - Math.cos(u.aim) * 0.35, o.z - Math.sin(u.aim) * 0.35); }
    if (!o.dead && o.lying){ o.st = 'hurt'; o.stT = Math.max(o.stT || 0, 0.45); }
    const hits = [0.3, 0.62, 0.94, 1.3];
    while (A.done < hits.length && A.t >= hits[A.done]){
      A.done++; if (o.dead) continue; const last = A.done === hits.length;
      hurt(u, o, u.atk * GWS.pound.mul * (last ? 1.8 : 1), { from: u, grapple: true, stun: 0.3 }); dust(o.x, o.z, 4); camShake(last ? 0.18 : 0.08, 0.12); G.hitstop = Math.max(G.hitstop, last ? 0.08 : 0.04);
      popText(o.x, o.y + 0.7, o.z, last ? '콰직!' : '퍽!', last ? 'crit' : 'hurt', 0.6);
      if (last){ bolt(o.x, o.z, false); addStatus(o, 'shock', { t: 0.5 }); }
    }
    if (A.t >= 1.6 || o.dead || !o.lying) end(); return;
  }
  if (A.type === 'rise'){
    if (!A.done && A.t >= gwHitT('rise', 10)){ A.done = 1; if (dist(u, o) < GWS.rise.reach + 0.5){ hurt(u, o, u.atk * GWS.rise.mul, { from: u, kb: 1.2 }); if (!o.D.heavy && Math.random() < 0.35){ o.st = 'hurt'; o.stT = 1; o.lying = true; setTimeout(() => o.lying = false, 900); popText(o.x, o.y + 1, o.z, '넘어짐', 'big', 0.7); } } }
    if (A.t >= gwLen('rise')) end(); return;
  }
  end();
}
