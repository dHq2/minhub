/* h2.js v1.0 — (v0.60) 2기 멤버: 드라이브 '2기멤버 동료,적 모음' 1차 반영
   ■ 그림 · 키 · 적성 · 배낭은 h2_roster.js (tools/h2_roster.py가 art/h2/notes/*.json에서 만듦)
   ■ 기술은 아래 H2K (인물마다 손으로 정함 — 그림 (동작)과 짝지음)
   ■ 한 인물이 동료로도 적으로도 나올 수 있음: DEFS['h2_' + slug] (동료) · DEFS['h2e_' + slug] (적)
   ■ 공통 기술 종류 (H2SK): slash 부채꼴 · thrust 찌르기 줄 · slam 둘레 내려찍기 · dash 돌진 줄 · leap 뛰어 내려찍기 · shot 쏘기 (n발)
     · volley 연사 · zone 지정 장판 (늦게 터짐) · heal 치유 · buff 힘 · guard 막기 자세 (+도발) · summon 소환 · finisher 확인사살 · backstep 뒤로
   ■ 훈련장 '2기' 탭: 인물마다 그림 · 노트 요약 · 동료로 부르기 / 적으로 부르기 */
'use strict';
const H2 = { list: [], sk: {} };
// 엔진 동작 이름 ← 노트의 동작 이름 (먼저 있는 것)
const H2POSE = {
  idle: ['idle'], walk: ['walk', 'run', 'idle'], windup: ['windup', 'aim'], attack: ['attack', 'attack2', 'skill'],
  hurt: ['hurt', 'guard'], down: ['down', 'dead'], dead: ['dead', 'down'], squat: ['crouch', 'rest'], block: ['guard'], aim: ['aim', 'shoot', 'windup'],
};
const tallOf = o => Math.max(0.9, Math.min(9, (o.tall || 1.7) * 0.88));   // m → 게임 키 (인주 1.25 ≈ 1.42m)
function h2Build(){
  if (typeof H2R === 'undefined') return;
  for (const [slug, o] of Object.entries(H2R)){
    const P = o.poses || {}; if (!P.idle) { const k = Object.keys(P)[0]; if (!k) continue; P.idle = P[k]; }
    const pose = p => ({ src: p.src, w: p.w, h: p.h, ax: p.ax ?? Math.round(p.w / 2), ay: p.ay ?? p.h - 3, f: 1 });
    const poses = {};
    for (const [k, v] of Object.entries(P)) poses[k] = pose(v);
    for (const [eng, from] of Object.entries(H2POSE)) if (!poses[eng]){ const k = from.find(f => P[f]); if (k) poses[eng] = pose(P[k]); }
    SPR['h2_' + slug] = { h0: P.idle.h, tall: tallOf(o), poses };
    const K = H2K[slug] || {}, st = K.st || {}, w = o.weight || st.weight || 70, big = tallOf(o) > 2.4;
    const base = { spr: 'h2_' + slug, name: o.name || slug, hp: st.hp || 120, atk: st.atk || 14, spd: st.spd || 3.0, r: big ? 0.6 : 0.34, weight: w,
      melee: st.melee || { range: 1.6, arc: 1.6, windup: 0.4, cd: 1.2, mul: 1, kb: 0.6 }, h2: slug, heavy: w >= 200 || big };
    if (st.bow) base.bow = st.bow;
    if (st.armor) base.armor = st.armor;
    DEFS['h2_' + slug] = { ...base };
    DEFS['h2e_' + slug] = { ...base, hp: Math.round(base.hp * (K.boss ? 1 : 1.1)), boss: !!K.boss, think: h2EnemyThink };
    if (typeof FOE_XP !== 'undefined') FOE_XP['h2e_' + slug] = K.boss ? 300 : 30 + (parseInt(o.rank) || 1) * 15;
    if (typeof SOLP !== 'undefined' && o.apt) SOLP['h2_' + slug] = { apt: { melee: 2, spear: 1, bow: 1, gun: 1, magic: 0, stealth: 1, ...o.apt }, tag: o.tag || 'soldier', pas: K.pas || [o.name, ''] };
    H2.list.push(slug);
  }
}
// 기술 하나 쓰기 (동료 · 적 같음). 성공하면 true
function h2Cast(u, s, tgt){
  const d = tgt ? dist(u, tgt) : 0, a = tgt ? Math.atan2(tgt.z - u.z, tgt.x - u.x) : u.aim, P = p => u.S.poses[p] ? p : u.S.poses.attack ? 'attack' : 'idle';
  const hit = (mul, o = {}) => t => hurt(u, t, u.atk * mul, { from: u, kb: o.kb ?? 0.8, stun: o.stun, crit: o.crit, ranged: o.ranged });
  if (tgt) setAim(u, tgt.x, tgt.z);
  u.h2cd = u.h2cd || {}; u.h2cd[s.id] = s.cd;
  if (s.say) say(u, s.say, 'big', 1.2); else popText(u.x, u.y + bodyH(u) + 0.5, u.z, s.n, 'alert', 0.8);
  setPose(u, P(s.pose || 'windup'));
  const W = s.windup ?? 0.5;
  switch (s.type){
    case 'slash': windup(u, 'sector', { x: u.x, z: u.z, r: s.r || 2.2, a, arc: s.arc || 2.0, windup: W }, hit(s.mul || 1.4, s)); break;
    case 'thrust': windup(u, 'line', { x: u.x, z: u.z, len: s.len || 3.5, w: s.w || 0.9, a, windup: W }, hit(s.mul || 1.5, s)); break;
    case 'slam': windup(u, 'circle', { x: s.atTarget && tgt ? tgt.x : u.x, z: s.atTarget && tgt ? tgt.z : u.z, r: s.r || 2.2, windup: W }, hit(s.mul || 1.6, { kb: 2.2, stun: 0.6, ...s })); break;
    case 'dash': case 'leap': {
      const len = Math.min(s.len || 5, d + 0.6);
      windup(u, 'line', { x: u.x, z: u.z, len, w: s.w || 1.1, a, windup: W, after: () => { let k = 0; for (; k < len; k += 0.3) if (solidAt(G.map, u.x + Math.cos(a) * (k + 0.3), u.z + Math.sin(a) * (k + 0.3))) break; moveBy(u, Math.cos(a) * k, Math.sin(a) * k); dust(u.x, u.z, 8); if (s.type === 'leap'){ ring(u.x, u.z, 0xffd0a0, s.r || 2, 0.4); camShake(0.2, 0.2); for (const t of G.units) if (t.side !== u.side && !t.dead && !t.downed && t.side !== 'neutral' && dist(t, u) < (s.r || 2)) hurt(u, t, u.atk * (s.mul2 || 1.2), { from: u, kb: 2, stun: 0.5 }); } } }, hit(s.mul || 1.3, s));
      break; }
    case 'shot': case 'volley': {
      const n = s.n || 1, gap = s.type === 'volley' ? (s.gap || 0.12) : 0;
      u.st = 'windup';
      setTimeout(() => {
        if (u.dead || u.downed) return; u.st = 'strike'; u.stT = 0.3 + n * gap; setPose(u, P(s.pose2 || 'attack'));
        for (let i = 0; i < n; i++) setTimeout(() => {
          if (u.dead) return; const sp = (s.spread || 0.06) * (n > 1 && !gap ? (i - (n - 1) / 2) : (Math.random() - 0.5) * 2), aa = (tgt && !tgt.dead ? Math.atan2(tgt.z - u.z, tgt.x - u.x) : a) + sp, y0 = u.y + bodyH(u) * 0.6;
          shoot({ x: u.x + Math.cos(aa) * 0.5, y: y0, z: u.z + Math.sin(aa) * 0.5, a: aa, speed: s.speed || 26, range: s.range || 10, side: u.side, len: s.len || 0.4, thick: s.thick || 0.05, color: s.color || 0xffe08a, glow: s.glow, dy: tgt ? aimDy(u.x, y0, u.z, tgt, s.speed || 26) : 0, hitsAir: true, pierce: s.pierce,
            onHit: (p, t) => hurt(u, t, u.atk * (s.mul || 0.8), { from: { x: p.x - Math.cos(p.a), z: p.z - Math.sin(p.a) }, ranged: true, kb: s.kb || 0.3, fam: s.fam || 'gun' }) });
          spark(u.x + Math.cos(aa) * 0.6, y0, u.z + Math.sin(aa) * 0.6, s.color || 0xffd080, 4, 3);
        }, i * gap * 1000);
      }, W * 1000);
      break; }
    case 'zone': { const x = tgt ? tgt.x : u.x, z = tgt ? tgt.z : u.z; u.st = 'strike'; u.stT = 0.6;
      const dd = decal('circle', { x, z, r: s.r || 2.2, dur: s.delay || 1.2, color: s.color || BLUE, hostile: u.side === 'enemy' });
      dd.onDone = () => { ring(x, z, s.color || 0x9fd0ff, s.r || 2.2, 0.5); camShake(0.15, 0.2); for (const t of G.units) if (t.side !== u.side && t.side !== 'neutral' && !t.dead && !t.downed && Math.hypot(t.x - x, t.z - z) < (s.r || 2.2)) hurt(u, t, u.atk * (s.mul || 1.5), { from: { x, z }, kb: 1.2, stun: s.stun, fam: 'magic' }); };
      break; }
    case 'heal': { u.st = 'strike'; u.stT = 0.7;
      const team = G.units.filter(o => o.side === u.side && !o.dead && dist(o, u) < (s.r || 5));
      for (const o of team){ if (o.downed && s.revive){ revivePut && revivePut(o); continue; } const h = Math.round(o.max * (s.amt || 0.2)); o.hp = Math.min(o.max, o.hp + h); popText(o.x, o.y + bodyH(o) + 0.3, o.z, '+' + h, 'heal', 0.8); }
      ring(u.x, u.z, 0x8dffb0, s.r || 5, 0.6); break; }
    case 'buff': { u.st = 'strike'; u.stT = 0.6; ring(u.x, u.z, 0xffd35a, s.r || 6, 0.6);
      for (const o of G.units) if (o.side === u.side && !o.dead && dist(o, u) < (s.r || 6)){ const k = s.k || 1.25; o.atk = Math.round(o.atk * k); popText(o.x, o.y + bodyH(o) + 0.4, o.z, s.n, 'heal', 0.8); setTimeout(() => { o.atk = Math.round(o.atk / k); }, (s.t || 8) * 1000); }
      break; }
    case 'guard': { u.st = 'strike'; u.stT = s.t || 2.5; u.guardStance = true; setPose(u, P('block'));
      if (s.taunt) for (const e of G.units) if (e.side !== u.side && !e.dead && dist(e, u) < (s.r || 5)){ e.focusOn = u; }
      setTimeout(() => { u.guardStance = false; }, (s.t || 2.5) * 1000); break; }
    case 'summon': { u.st = 'strike'; u.stT = 0.8; setPose(u, P(s.pose || 'summon'));
      if ((u.minions || []).filter(m => !m.dead).length >= (s.max || 1)) break;
      const k = (u.side === 'enemy' ? 'h2e_' : 'h2_') + s.what; if (!DEFS[k]) break;
      const m = spawn(k, u.x + Math.cos(a) * 1.5, u.z + Math.sin(a) * 1.5, u.side); m.summoner = u; m.alert = true; m.seen = G.t; (u.minions = u.minions || []).push(m);
      if (u.side === 'enemy' && typeof spawnFoe === 'function' && EXP){ m.max = m.hp = Math.round(m.D.hp * 0.8); }
      smoke(m.x, m.z, 6, 1, 1); dust(m.x, m.z, 10); if (s.t) setTimeout(() => { if (!m.dead){ smoke(m.x, m.z, 4, 0.8, 0.8); removeUnit(m); } }, s.t * 1000);
      break; }
    case 'finisher': windup(u, 'sector', { x: u.x, z: u.z, r: s.r || 1.6, a, arc: 1.2, windup: W }, t => hurt(u, t, u.atk * ((t.lying || t.downed || t.st === 'hurt') ? (s.mul || 3) : 1), { from: u, crit: !!(t.lying || t.st === 'hurt'), kb: 0.3 })); break;
    case 'backstep': { const n = norm(u.x - (tgt ? tgt.x : u.x + 1), u.z - (tgt ? tgt.z : u.z)); moveBy(u, n.x * (s.len || 2.4), n.z * (s.len || 2.4)); dust(u.x, u.z, 5); u.st = 'strike'; u.stT = 0.35; break; }
  }
  return true;
}
// 쓸 만한 기술 고르기
function h2Pick(u, tgt){
  const K = H2K[u.D.h2]; if (!K || !K.sk || !tgt) return null;
  const d = dist(u, tgt), cd = u.h2cd || {};
  for (const s of K.sk){
    if ((cd[s.id] || 0) > 0) continue;
    if (s.type === 'heal'){ if (G.units.some(o => o.side === u.side && !o.dead && (o.downed && s.revive || o.hp < o.max * 0.55) && dist(o, u) < (s.r || 5))) return s; continue; }
    if (s.type === 'buff' || s.type === 'summon'){ if (d < (s.use || 10)) return s; continue; }
    if (s.type === 'guard'){ if (d < (s.use || 3) && Math.random() < 0.5) return s; continue; }
    if (s.type === 'finisher'){ if (d < 2 && (tgt.lying || tgt.downed || tgt.st === 'hurt')) return s; continue; }
    if (s.type === 'backstep'){ if (d < 1.4) return s; continue; }
    if (d <= (s.use || 3) && d >= (s.min || 0)) return s;
  }
  return null;
}
function h2Tick(u, dt){ if (u.h2cd) for (const k in u.h2cd) u.h2cd[k] -= dt; }
// 적: 기술이 있으면 쓰고, 아니면 보통 적 두뇌 (근접 · 활)
function h2EnemyThink(u, dt){
  h2Tick(u, dt);
  if (u.alert && u.st === 'idle' && !u.lock && !G.lock && !(u.prowl && !u.revealed)){
    const t = nearest(u, G.units.filter(a => a.side === 'ally' && !a.dead && !a.downed), 30), s = t && h2Pick(u, t);
    if (s && Math.random() < dt * 4) return void h2Cast(u, s, t);
  }
  return enemyThink(u, dt);
}
// 동료: 기술 (싸울 때)
{
  const _hc = typeof heroCombat === 'function' ? heroCombat : null;
  heroCombat = function(u, dt){
    if (u.D && u.D.h2){
      h2Tick(u, dt);
      if (u.st === 'idle' && !u.lock && !G.lock && !u.downed){
        const t = nearest(u, foes().filter(e => e.alert && !e.dead && !e.D.dummy), 14), s = t && h2Pick(u, t);
        if (s && Math.random() < dt * 3){ h2Cast(u, s, t); return true; }
      }
    }
    return _hc ? _hc(u, dt) : false;
  };
}

/* ---------- 기술표 (인물마다): st = 능력치, sk = 기술, pas = 패시브 [이름, 설명], boss = 보스 ---------- */
const H2K = {};

/* ---------- 대충 움직이기 (그림이 한 장씩이라 몸을 눌렀다 폈다 · 기울여 살아 있게) ----------
   · 서 있음: 숨쉬기 (세로 1.5% · 3초)
   · 걸음: 위아래 출렁 + 앞으로 기울임 (걸음 그림이 없으면)
   · 예고 (windup): 뒤로 젖히며 움츠림 → 침 (strike): 앞으로 쭉 + 살짝 늘어남
   · 맞음: 좌우로 떨림 · 기술: 둘레가 빛남 (잔광) · 돌진: 잔상 */
const _updateSpriteH2 = updateSprite;
updateSprite = function(u, dt){
  _updateSpriteH2(u, dt);
  if (!u.D || !u.D.h2 || u.dead) return;
  const t = G.t + (u.uid || 0) * 0.37, m = u.mesh, f = -u.face;
  let sy = 1, sx = 1, rz = 0, dy = 0;
  if (u.downed || u.lying) return;
  if (u.st === 'windup'){ const k = Math.min(1, u.poseT / 0.35); sy = 1 - 0.06 * k; sx = 1 + 0.04 * k; rz = -0.1 * k * f; }
  else if (u.st === 'strike'){ const k = Math.max(0, 1 - u.poseT / 0.25); sy = 1 + 0.05 * k; sx = 1 - 0.03 * k; rz = 0.16 * k * f; }
  else if (u.st === 'hurt'){ rz = Math.sin(t * 60) * 0.05; }
  else if (u.moving && !u.S.poses.walk_real){ dy = Math.abs(Math.sin(t * 9)) * 0.06; rz = 0.06 * f + Math.sin(t * 9) * 0.02; }
  else { sy = 1 + Math.sin(t * 2.1) * 0.015; }
  m.scale.y *= sy; m.scale.x *= sx; m.position.y *= sy; u.pivot.rotation.z += rz; u.pivot.position.y += dy;
  // 잔상: 빨리 움직이는 동안
  const sp = u._lp2 ? Math.hypot(u.x - u._lp2.x, u.z - u._lp2.z) / Math.max(dt, 1e-3) : 0; u._lp2 = { x: u.x, z: u.z };
  if (sp > 7 && (u._gh = (u._gh || 0) - dt) <= 0){ u._gh = 0.05; h2Ghost(u); }
};
function h2Ghost(u){
  const g = new THREE.Mesh(u.mesh.geometry, new THREE.MeshBasicMaterial({ map: u.mat.map, transparent: true, opacity: 0.45, depthWrite: false, color: u.side === 'enemy' ? 0xff9a9a : 0x9fd0ff }));
  g.scale.copy(u.mesh.scale); u.mesh.getWorldPosition(g.position); u.mesh.getWorldQuaternion(g.quaternion); G.scene.add(g);
  const t0 = G.t; const step = () => { const k = (G.t - t0) / 0.3; if (k >= 1 || !G.scene){ G.scene.remove(g); g.material.dispose(); return; } g.material.opacity = 0.45 * (1 - k); requestAnimationFrame(step); }; requestAnimationFrame(step);
}
