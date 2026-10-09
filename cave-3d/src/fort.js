/* fort.js v1.2 — (v1.2, v0.82: 2파의 날랜 놈 검냥이 → 궁수 (검냥이 = 광냥, 강적으로 합침)) (v1.1, v0.59: 진지 계획 (L)은 훈련장에서만 · 엄폐 규칙은 1층에도) (v1.0, v0.57) 진지 · 엄폐 · 계획 (훈련장 규칙. "계획이 거의 절반인 게임")
   ■ 재료: 둘레의 나무 · 바위 · 잔해 (부서진 수레)에서 모음 — 동료가 알아서 캐 오고, 인주는 곁에서 E
   ■ 계획 (L): 시간이 0.25배로 느려짐 (멈추진 않음 — 빨리 생각해야 함). 땅을 찍어 설계도를 놓음 (누른 채 끌면 줄줄이)
     · 나무 바리케이드 (나무 2) · 잔해 더미 (잔해 2): 낮은 엄폐. 걸어서는 못 넘음 (점프로 넘음) · 시야는 안 막음
     · 돌담 (돌 3): 높은 벽. 시야 · 화살 · 총알을 다 막음 — 모퉁이 매복 자리
     · 말뚝 (나무 1): 밟은 적이 찔려 휘청 (세 번 쓰면 부러짐)
     · 1조 · 2조 진지: 그 자리를 지킴 (R로 바라볼 쪽을 돌림)
     · 설계도는 동료가 재료를 모아 와서 지음 (따라와 · 작업 지시인 동료, 싸움 중이면 손을 놓음). 카리우스는 두 배로 빨리 지음
   ■ 엄폐 (누구나 같음 — 적도): 낮은 엄폐 바로 뒤 (1.5칸)에 있는 자를 그 너머에서 쏘면
     · 숙인 채 가만히 → 다 막힘 (엄폐가 대신 맞음)
     · 쏘거나 예고 중 = 머리를 내밂 → 40%만 지나가고, 맞으면 머리 (투구 뚫림 · 치명 ×2.4)
     · 서 있음 → 70% 지나감. 카리우스 · 거구는 숙여도 소용없음 (늘 서 있는 셈)
     · 엄폐 바로 앞 (1.6칸)에서 넘겨 쏘는 건 자기 엄폐에 안 막힘. 투창 (포물선)은 넘어감
   ■ 대기 사격: 1초 넘게 가만히 기다리다 새로 보인 적을 1.5초 안에 쏘면 ×1.5 (벽 모퉁이에서 기다렸다 나오는 놈을 쏨). 적 궁수도 같음
   ■ 원거리 동료는 싸울 때 가까운 엄폐 (4.5칸 안) 뒤로 들어가 숙였다 쏠 때만 일어남. 적 궁수도 엄폐가 곁에 있으면 그 뒤에 자리 잡음
   ■ 막힌 적은 엄폐를 부숨 (근접으로 침) */
'use strict';
const FORT = { on: false, plan: false, tool: 'barricade', face: -Math.PI / 2, stock: { wood: 0, stone: 0, scrap: 0 }, pieces: [], nodes: [], wave: null,
  stat: { built: 0, blocked: 0, heads: 0, ambush: 0, broken: 0, harvested: 0 } };
const FT = {
  barricade: { n: '나무 바리케이드', mat: { wood: 2 }, work: 2.5, hp: 60, low: 1 },
  scrap:     { n: '잔해 더미', mat: { scrap: 2 }, work: 2, hp: 45, low: 1 },
  wall:      { n: '돌담', mat: { stone: 3 }, work: 4.5, hp: 160, high: 1 },
  stakes:    { n: '말뚝', mat: { wood: 1 }, work: 1.5, hp: 3, trap: 1 },
};
const MAT_N = { wood: '나무', stone: '돌', scrap: '잔해' };
const NODE_T = { tree: { mat: 'wood', amt: 8, n: '나무' }, rock: { mat: 'stone', amt: 9, n: '바위' }, wreck: { mat: 'scrap', amt: 8, n: '부서진 수레' } };
const FORT_TOOLS = [['barricade', '바리케이드'], ['scrap', '잔해 더미'], ['wall', '돌담'], ['stakes', '말뚝'], ['post1', '1조 진지'], ['post2', '2조 진지'], ['erase', '지우기']];
const fk = (i, j) => j * G.map.w + i;
const pieceAt = (i, j) => FORT.pieces.find(p => p.i === i && p.j === j);
const nodeAt = (i, j) => FORT.nodes.find(n => n.i === i && n.j === j && n.amt > 0);
const matTxt = m => Object.entries(m).map(([k, v]) => `${MAT_N[k]} ${v}`).join(' · ');
const canPay = m => Object.entries(m).every(([k, v]) => FORT.stock[k] >= v);

/* ---------- 모양 ---------- */
const FMAT = {};
function fmat(k){
  if (FMAT[k]) return FMAT[k];
  const c = { wood: 0x8a6440, dark: 0x5a4430, stone: 0x8c8678, scrap: 0x5e574c, rust: 0x7a4a30, leaf: 0x4f6a3a, bark: 0x5a4632, ghost: 0x6ab0ff, bad: 0xff5a4a }[k];
  FMAT[k] = (k === 'ghost' || k === 'bad') ? new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.38, depthWrite: false }) : new THREE.MeshStandardMaterial({ color: c, roughness: 0.92 });
  return FMAT[k];
}
function box(g, w, h, d, x, y, z, m, ry = 0, rz = 0){ const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.rotation.y = ry; b.rotation.z = rz; b.castShadow = b.receiveShadow = true; g.add(b); return b; }
function fortMesh(type, rot, ghost){
  const g = new THREE.Group(), W = ghost ? fmat(ghost) : null, M = k => W || fmat(k);
  if (type === 'barricade'){
    for (const y of [0.22, 0.5, 0.78]) box(g, 1.02, 0.16, 0.12, 0, y, 0, M('wood'), 0, rnd(-0.04, 0.04));
    for (const s of [-1, 1]) box(g, 0.1, 1.05, 0.1, s * 0.38, 0.45, 0.1, M('dark'), 0, s * 0.35);
  } else if (type === 'scrap'){
    box(g, 0.9, 0.42, 0.6, 0, 0.21, 0, M('scrap'), 0.2); box(g, 0.7, 0.3, 0.5, 0.1, 0.55, -0.05, M('rust'), -0.3, 0.15); box(g, 0.95, 0.08, 0.2, -0.1, 0.78, 0.1, M('wood'), 0.5, 0.25);
    const wh = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.05, 6, 14), M('dark')); wh.position.set(0.3, 0.4, 0.3); wh.rotation.set(0.3, 0.6, 0); g.add(wh);
  } else if (type === 'wall'){
    box(g, 1.0, 1.9, 0.9, 0, 0.95, 0, M('stone'));
    for (let k = 0; k < 3; k++) box(g, 0.32, 0.22, 0.9, -0.33 + k * 0.33, 2.0, 0, M('stone'), 0, rnd(-0.05, 0.05));
  } else if (type === 'stakes'){
    for (let k = 0; k < 5; k++){ const c = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.7, 5), M('wood')); c.position.set(-0.4 + k * 0.2, 0.3, rnd(-0.15, 0.15)); c.rotation.x = -0.55; g.add(c); }
  } else if (type === 'post'){
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), fmat('dark')); pole.position.y = 0.8; g.add(pole);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.36), new THREE.MeshBasicMaterial({ color: ghost === 'bad' ? 0xff5a4a : 0xffd35a, side: THREE.DoubleSide, transparent: !!ghost, opacity: ghost ? 0.6 : 1 })); fl.position.set(0.3, 1.4, 0); g.add(fl);
    const ar = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 3), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.8 })); ar.rotation.z = -Math.PI / 2; ar.position.set(0.9, 0.05, 0); ar.scale.y = 1; g.add(ar);
  }
  g.rotation.y = rot;
  return g;
}
function nodeMesh(t){
  const g = new THREE.Group();
  if (t === 'tree'){ const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 1.6, 7), fmat('bark')); tr.position.y = 0.8; g.add(tr); for (const [y, r] of [[1.7, 0.85], [2.3, 0.65], [2.8, 0.42]]){ const c = new THREE.Mesh(new THREE.ConeGeometry(r, 0.9, 8), fmat('leaf')); c.position.y = y; g.add(c); } }
  if (t === 'rock'){ for (let k = 0; k < 3; k++){ const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42 - k * 0.1), fmat('stone')); r.position.set(rnd(-0.2, 0.2), 0.3 + k * 0.12, rnd(-0.2, 0.2)); r.rotation.set(rnd(0, 3), rnd(0, 3), 0); g.add(r); } }
  if (t === 'wreck'){ box(g, 1.0, 0.35, 0.6, 0, 0.35, 0, fmat('wood'), 0.3, 0.2); box(g, 0.8, 0.1, 0.6, 0.1, 0.62, 0, fmat('dark'), 0.3, -0.3); const wh = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.06, 6, 14), fmat('dark')); wh.position.set(-0.35, 0.3, 0.3); wh.rotation.y = 0.3; g.add(wh); }
  g.traverse(o => { if (o.isMesh){ o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

/* ---------- 재료 자리 ---------- */
function fortNode(t, i, j){
  if (!G.map || G.map.solid[fk(i, j)] || nodeAt(i, j) || pieceAt(i, j)) return null;
  const n = { t, i, j, x: i, z: j, amt: NODE_T[t].amt, g: nodeMesh(t) };
  n.g.position.set(i, heightAt(G.map, i, j), j); n.g.rotation.y = rnd(0, 6); G.map.group.add(n.g);
  const k = fk(i, j); G.map.solid[k] = 1; if (t !== 'tree') G.map.low[k] = 1; G.map.nav = {};
  FORT.nodes.push(n); return n;
}
function nodeTake(n, amt = 2){
  const got = Math.min(amt, n.amt); n.amt -= got; FORT.stock[NODE_T[n.t].mat] += got; FORT.stat.harvested += got;
  popText(n.x, 1.6, n.z, `+${got} ${MAT_N[NODE_T[n.t].mat]}`, 'aim', 0.7); dust(n.x, n.z, 4);
  if (n.amt <= 0){ G.map.group.remove(n.g); const k = fk(n.i, n.j); G.map.solid[k] = 0; G.map.low[k] = 0; G.map.nav = {}; }
  fortBarRender();
}

/* ---------- 설계도 · 짓기 · 부서짐 ---------- */
function fortPlace(type, i, j, o = {}){
  if (!G.map || i < 1 || j < 1 || i >= G.map.w - 1 || j >= G.map.h - 1) return null;
  const k = fk(i, j); if (G.map.solid[k] || G.map.hgt[k] || pieceAt(i, j) || nodeAt(i, j)) return null;
  const rot = o.rot ?? (Math.abs(Math.sin(FORT.face)) > 0.7 ? 0 : Math.PI / 2);
  const p = { type, i, j, x: i, z: j, rot, hp: FT[type].hp, max: FT[type].hp, prog: 0, paid: false, built: false, side: o.side || 'ally', g: fortMesh(type, rot, 'ghost') };
  p.g.position.set(i, 0, j); G.map.group.add(p.g); FORT.pieces.push(p);
  if (o.built){ p.paid = true; fortFinish(p, true); }
  return p;
}
function fortFinish(p, quiet){
  p.built = true; p.prog = 1; G.map.group.remove(p.g); p.g = fortMesh(p.type, p.rot); p.g.position.set(p.i, 0, p.j); G.map.group.add(p.g);
  p.g.traverse(o => { if (o.isMesh){ o.castShadow = true; o.receiveShadow = true; } });
  const k = fk(p.i, p.j), T = FT[p.type];
  if (T.low){ G.map.solid[k] = 1; G.map.low[k] = 1; }
  if (T.high){ G.map.solid[k] = 1; G.map.los[k] = 1; }
  G.map.nav = {};
  if (!quiet){ FORT.stat.built++; dust(p.x, p.z, 8); popText(p.x, 1.8, p.z, `${T.n} 완성`, 'aim', 0.8); SFX.thud && SFX.thud(); }
}
function fortRemove(p, refund){
  G.map.group.remove(p.g); FORT.pieces = FORT.pieces.filter(o => o !== p);
  if (p.built){ const k = fk(p.i, p.j); G.map.solid[k] = 0; G.map.low[k] = 0; G.map.los[k] = 0; G.map.nav = {}; }
  if (refund && p.paid) for (const [m, v] of Object.entries(FT[p.type].mat)) FORT.stock[m] += p.built ? Math.floor(v / 2) : v;
  fortBarRender();
}
function fortHit(p, dmg, by){
  if (!p.built) return;
  p.hp -= dmg; spark(p.x, 0.8, p.z, p.type === 'wall' ? 0xcfc8b8 : 0xc8a070, 6, 3);
  p.g.position.x = p.i + rnd(-0.04, 0.04);
  if (p.hp <= 0){ FORT.stat.broken++; popText(p.x, 1.6, p.z, `${FT[p.type].n} 부서짐`, 'hurt', 0.9); dust(p.x, p.z, 12); camShake(0.08, 0.12); fortRemove(p, false); }
}
function fortClearAll(){ for (const p of [...FORT.pieces]) fortRemove(p, false); for (const sq of SQ.list) if (sq.post){ G.map.group.remove(sq.post.g); sq.post = null; } }

/* ---------- 엄폐 판정 ---------- */
const lowCell = (i, j) => i >= 0 && j >= 0 && i < G.map.w && j < G.map.h && G.map.low[fk(i, j)] && G.map.solid[fk(i, j)];
function acting(u){ return G.t < (u.peekT || 0) || u.st === 'windup' || !!u.decal || u.st === 'strike' && u.side === 'enemy'; }
function exposure(u){
  if (cantCrouch(u)) return 'stand';
  if (acting(u)) return 'peek';
  return isCrouched(u) || u.coverDuck ? 'hidden' : 'stand';
}
// u가 (tx, tz) 쪽을 막아 주는 낮은 엄폐 바로 뒤에 있나
function coverFor(u, tx, tz){
  const a = Math.atan2(tz - u.z, tx - u.x), ci = Math.round(u.x), cj = Math.round(u.z);
  for (let j = cj - 1; j <= cj + 1; j++) for (let i = ci - 1; i <= ci + 1; i++){
    if (!lowCell(i, j)) continue;
    if (Math.hypot(i - u.x, j - u.z) > 1.5) continue;
    if (Math.abs(angDiff(Math.atan2(j - u.z, i - u.x), a)) < 0.9) return { i, j };
  }
  return null;
}
// 위협 (tx, tz)을 막는 엄폐 뒷자리 (anchor 둘레 R칸 안에서 가까운 곳)
function coverSpot(u, tx, tz, anchor, R = 4.5, maxD = 99){
  let best = null, bs = 1e9; const ai = Math.round(anchor.x), aj = Math.round(anchor.z), r = Math.ceil(R);
  for (let j = aj - r; j <= aj + r; j++) for (let i = ai - r; i <= ai + r; i++){
    if (!lowCell(i, j)) continue;
    const n = norm(tx - i, tz - j), sx = i - n.x * 0.95, sz = j - n.z * 0.95;
    if (Math.hypot(sx - anchor.x, sz - anchor.z) > R || solidAt(G.map, sx, sz) || Math.hypot(tx - sx, tz - sz) < 2.5 || Math.hypot(tx - sx, tz - sz) > maxD) continue;
    if (G.units.some(o => o !== u && o.side === u.side && !o.dead && o._spot && Math.hypot(o._spot.x - sx, o._spot.z - sz) < 0.8)) continue;
    const s = Math.hypot(sx - u.x, sz - u.z) + Math.hypot(sx - anchor.x, sz - anchor.z) * 0.5;
    if (s < bs){ bs = s; best = { x: sx, z: sz }; }
  }
  return best;
}
// 투사체가 낮은 엄폐 칸에 들어설 때 한 번 정함
const _stepProjF = stepProj;
stepProj = function(p, dt){
  if (!FORT.on || p.g) return _stepProjF(p, dt);
  if (p.sx == null){ p.sx = p.x; p.sz = p.z; }
  const nx = p.x + Math.cos(p.a) * p.speed * dt, nz = p.z + Math.sin(p.a) * p.speed * dt, i = Math.round(nx), j = Math.round(nz);
  if (lowCell(i, j) && !(p.cov && p.cov.has(fk(i, j)))){
    (p.cov = p.cov || new Set()).add(fk(i, j));
    if (Math.hypot(i - p.sx, j - p.sz) > 1.6){
      const dx = Math.cos(p.a), dz = Math.sin(p.a);
      let def = null, bd = 1.6;
      for (const u of G.units){ if (u.dead || u.downed || u.side === p.side || u.side === 'neutral') continue; const d = Math.hypot(u.x - i, u.z - j); if (d < bd && (u.x - i) * dx + (u.z - j) * dz > 0.1){ bd = d; def = u; } }
      if (def){
        const ex = exposure(def), pass = ex === 'hidden' ? 0 : ex === 'peek' ? 0.4 : 0.7;
        if (Math.random() >= pass){
          FORT.stat.blocked++; const pc = pieceAt(i, j); if (pc) fortHit(pc, 2); else spark(i, 0.7, j, 0xcfc8b8, 5, 3);
          if (Math.random() < 0.4) popText(i, 1.2, j, '엄폐', 'miss', 0.45);
          p.end && p.end(p, p.x, p.z, true); G.scene.remove(p.m); return false;
        }
        if (ex === 'peek'){ const oh = p.onHit; p.onHit = (pp, t) => { if (t === def){ t._headNow = true; try { oh && oh(pp, t); } finally { t._headNow = false; } } else oh && oh(pp, t); }; }
      }
    }
  }
  return _stepProjF(p, dt);
};
// 쏜 자는 잠깐 머리를 내밂
const _shootF = shoot;
shoot = function(o){
  if (FORT.on){ let b = null, bd = 0.9; for (const u of G.units){ if (u.side !== o.side || u.dead) continue; const d = Math.hypot(u.x - o.x, u.z - o.z); if (d < bd){ bd = d; b = u; } } if (b) b.peekT = G.t + 0.7; }
  return _shootF(o);
};
// 머리 · 대기 사격
const _hurtF = hurt;
hurt = function(att, tgt, dmg, o = {}){
  if (!FORT.on || !tgt) return _hurtF(att, tgt, dmg, o);
  if (tgt._headNow){ o = { ...o, crit: true, critMul: 2.4 }; FORT.stat.heads++; popText(tgt.x, tgt.y + bodyH(tgt) + 0.7, tgt.z, tgt.D.armor || tgt.D.heavy || tgt.kind === 'goldknightAlly' ? '투구 뚫림!' : '머리!', 'crit', 1); }
  if (att && G.t < (att.ambushT || 0) && dist(att, tgt) > 2.5){ dmg *= 1.5; FORT.stat.ambush++; if (!att._ambSaid){ att._ambSaid = true; popText(att.x, att.y + bodyH(att) + 0.6, att.z, '대기 사격!', 'aim', 0.8); } }
  return _hurtF(att, tgt, dmg, o);
};

/* ---------- 동료: 일 (모으기 · 짓기) · 엄폐 뒤에서 쏘기 ---------- */
const workRate = u => (u.kind === 'kariusAlly' ? 2 : u.kind === 'goldknightAlly' ? 1.2 : u.kind === 'angelAlly' ? 0.7 : 1) * (u.sol && u.sol.tag === 'soldier' ? 1.3 : 1);
function fortWork(u, dt){
  const bps = FORT.pieces.filter(p => !p.built);
  if (!bps.length){ u._job = null; return false; }
  let j = u._job;
  if (!j || j.p.built || !FORT.pieces.includes(j.p)){
    const p = bps.slice().sort((a, b) => dist(u, a) - dist(u, b)).find(p => G.units.filter(o => o._job && o._job.p === p).length < 2) || bps[0];
    j = u._job = { p, t: 0 };
  }
  const p = j.p;
  if (!p.paid){
    if (canPay(FT[p.type].mat)){ for (const [m, v] of Object.entries(FT[p.type].mat)) FORT.stock[m] -= v; p.paid = true; fortBarRender(); }
    else {
      const need = Object.keys(FT[p.type].mat).find(m => FORT.stock[m] < FT[p.type].mat[m]);
      const n = FORT.nodes.filter(n => n.amt > 0 && NODE_T[n.t].mat === need).sort((a, b) => dist(u, a) - dist(u, b))[0];
      if (!n){ if (!u._noMat){ u._noMat = true; say(u, `${MAT_N[need]}이 없다`, 'soft', 1.4); } return false; }
      u._noMat = false;
      if (dist(u, n) > 1.25){ u.moving = false; navTo(u, n.x, n.z, u.spd * 1.1, dt, 1.0); walkPose(u); return true; }
      u.moving = false; setAim(u, n.x, n.z); setPose(u, 'idle'); u.leanT = Math.sin(G.t * 14) * 0.12;
      j.t += dt * workRate(u); if (j.t >= 1.2){ j.t = 0; nodeTake(n, 2); }
      return true;
    }
  }
  if (dist(u, p) > 1.3){ u.moving = false; navTo(u, p.x, p.z, u.spd * 1.1, dt, 1.05); walkPose(u); return true; }
  u.moving = false; setAim(u, p.x, p.z); setPose(u, 'idle'); u.leanT = Math.sin(G.t * 16) * 0.14;
  p.prog += dt * workRate(u) / FT[p.type].work;
  p.g.scale.y = 0.3 + Math.min(1, p.prog) * 0.7;
  if ((u._hm = (u._hm || 0) - dt) <= 0){ u._hm = 0.45; spark(p.x, 0.6, p.z, 0xe0c090, 3, 2); }
  if (p.prog >= 1){ fortFinish(p); u._job = null; }
  return true;
}
const _solControlF = solControl;
solControl = function(u, dt){
  if (!FORT.on || !SQ.on || !u.sol || u.kind === 'player' || u.downed || u.lock) return _solControlF(u, dt);
  if (u.st === 'hurt' || u.st === 'windup' || u.st === 'strike' || u.st === 'skill' || u.kc || (u.reb && u.reb.act) || u.ls) return _solControlF(u, dt);
  const sq = sqOf(u), order = sq ? sq.order : 'free', S = u.sol;
  const alerted = foes().filter(e => e.alert && !e.dead && !e.D.dummy), near = nearest(u, alerted, 99), dN = near ? dist(u, near) : 99;
  // 일: 싸움이 없을 때 (12칸 안에 깬 적 없음)
  if ((order === 'follow' || order === 'work' || order === 'hold') && dN > 12 && !(u.reactT > 0)){ if (fortWork(u, dt)) return true; }
  else u._job = null;
  // 엄폐: 원거리를 든 동료는 엄폐 뒤로 (가까이 붙은 적이 없을 때)
  u._spot = null; u.coverDuck = false;
  const ranged = S.kit.main && S.mode === 'ranged' && RW[S.kit.main];
  const hold = sq && sq.order === 'hold' && sq.at;
  const thr = near && dN < 16 ? near : hold ? { x: sq.at.x + Math.cos(sq.head) * 8, z: sq.at.z + Math.sin(sq.head) * 8 } : null;
  if (thr && (ranged || hold && !near) && dN > 3.2 && order !== 'retreat' && order !== 'sneak' && order !== 'flank' && order !== 'pin'){
    const anchor = hold ? sqSlot(u, sq) || sq.at : u, sp = coverSpot(u, thr.x, thr.z, anchor, hold ? 3 : 4.5, ranged && near ? ranged.range * 0.95 : 99);
    if (sp){
      u._spot = sp;
      if (Math.hypot(sp.x - u.x, sp.z - u.z) > 0.35){ u.moving = false; navTo(u, sp.x, sp.z, u.spd * 1.2, dt, 0.2); walkPose(u); return true; }
      u.coverDuck = true;
      if (!near || !ranged){ u.moving = false; setAim(u, thr.x, thr.z); setPose(u, 'idle'); return true; }
      const ox = u.x, oz = u.z, r = _solControlF(u, dt);
      u.x = ox; u.z = oz; u.moving = false;   // 자리는 그대로 (쏘기만)
      return r === false ? true : r;
    }
  }
  return _solControlF(u, dt);
};
ORDERS.work = '작업';

/* ---------- 적: 엄폐 뒤 궁수 · 막히면 부숨 · 말뚝 ---------- */
const _enemyThinkF = enemyThink;
enemyThink = function(e, dt){
  if (!FORT.on || !e.alert || e.dead || e.D.boss || e.lock) return _enemyThinkF(e, dt);
  e._st2 = (e._st2 || 0) - dt;
  if (e._st2 <= 0){
    e._st2 = 0.6;
    const t = nearest(e, G.units.filter(a => a.side === 'ally' && !a.dead && !a.downed), 30);
    if (e.D.bow && t){
      if (e._fortPost && !coverFor({ x: e.post.x, z: e.post.z }, t.x, t.z)){ e.post = null; e._fortPost = false; }
      if (!e.post && dist(e, t) < e.D.bow.range + 2){ const sp = coverSpot(e, t.x, t.z, e, 3.5, e.D.bow.range); if (sp){ e.post = sp; e._fortPost = true; e._spot = sp; } }
    }
    // 막힘: 1.2초 동안 거의 못 움직였는데 상대가 멀면 곁의 엄폐를 부숨
    const moved = e._lp ? Math.hypot(e.x - e._lp.x, e.z - e._lp.z) : 1; e._lp = { x: e.x, z: e.z };
    e._stuck = !e.D.bow && t && dist(e, t) > 2.2 && moved < 0.25 ? (e._stuck || 0) + 0.6 : 0;
  }
  if (e._stuck >= 1.2){
    const t = nearest(e, G.units.filter(a => a.side === 'ally' && !a.dead && !a.downed), 30);
    const p = FORT.pieces.filter(p => p.built && p.type !== 'stakes' && dist(e, p) < 1.7).sort((a, b) => (t ? dist(a, t) - dist(b, t) : 0))[0];
    if (p){
      e.moving = false; setAim(e, p.x, p.z);
      if (e.cd <= 0){ e.cd = 1.1; e.leanT = 0.3; setPose(e, e.S.poses.atk ? 'atk' : 'idle'); fortHit(p, e.atk * (e.D.heavy ? 2.5 : 1)); SFX.whoosh && SFX.whoosh(); }
      else e.cd -= dt;
      return;
    }
  }
  return _enemyThinkF(e, dt);
};

/* ---------- 한 프레임: 숙임 · 대기 사격 · 말뚝 · 파도 ---------- */
TICKS.push(dt => {
  if (!FORT.on) return;
  FORT.tk = (FORT.tk || 0) - dt; const slow = FORT.tk <= 0; if (slow) FORT.tk = 0.2;
  for (const u of G.units){
    if (u.dead || u.side === 'neutral') continue;
    // 엄폐 뒤 숙임 (플레이어는 G로 직접)
    if (u.kind !== 'player' && !cantCrouch(u)){
      let duck = false;
      if (u.side === 'enemy' && u._fortPost && u.post && Math.hypot(u.x - u.post.x, u.z - u.post.z) < 0.7) duck = true;
      if (u.side === 'ally' && u.coverDuck) duck = true;
      if (duck){ u.posture = acting(u) ? 'stand' : 'crouch'; u._fDuck = true; }
      else if (u._fDuck){ u._fDuck = false; if (!u.sneak) u.posture = 'stand'; }
      if (u.side === 'enemy'){ const want = u.posture === 'crouch'; if (want && !(u.S.poses.squat)){ u.sit = true; } else if (u.sit && !want) u.sit = false; }
    }
    if (!slow) continue;
    // 대기 사격: 1초 넘게 가만히 → 새로 보인 적
    const shooter = u.kind === 'player' || (u.sol && u.sol.mode === 'ranged') || (u.side === 'enemy' && u.D.bow);
    if (!shooter) { u._vis = null; continue; }
    const mv = u.kind === 'player' ? !!inputDir() : u.moving;
    u.stillT = mv ? 0 : (u.stillT || 0) + 0.2;
    const opp = G.units.filter(o => !o.dead && !o.downed && o.side !== u.side && o.side !== 'neutral' && dist(o, u) < 12 && sees(u, o));
    const prev = u._vis || new Set(), now = new Set(opp);
    if (u.stillT >= 1 && opp.some(o => !prev.has(o))){
      u.ambushT = G.t + 1.5; u._ambSaid = false;
      if (u.sol && u.kind !== 'player') u.sol.cd = Math.min(u.sol.cd || 0, 0.05);
      if (u.side === 'enemy'){ if (!u.alert){ alertGroup(u, opp[0]); } u.cd = Math.min(u.cd, 0.1); }
    }
    u._vis = now;
  }
  // 말뚝
  for (const p of FORT.pieces){
    if (p.type !== 'stakes' || !p.built) continue;
    for (const e of foes()){
      if (e.dead || (e.jy || 0) > 0.3 || Math.round(e.x) !== p.i || Math.round(e.z) !== p.j || G.t < (e._stakeT || 0)) continue;
      e._stakeT = G.t + 1.2; hurt(G.player, e, 10, { stun: 0.5, from: { x: p.x, z: p.z } }); popText(e.x, e.y + bodyH(e) + 0.4, e.z, '말뚝!', 'crit', 0.7);
      p.hp--; if (p.hp <= 0){ fortRemove(p, false); break; }
    }
  }
  // 파도
  const W = FORT.wave;
  if (W && !G.lock){
    W.t -= dt;
    if (W.t <= 0 && W.i < W.list.length){ const w = W.list[W.i++]; w(); W.t = W.i < W.list.length ? W.gap : 1e9; }
    fortHudRender();
  }
});

/* ---------- 계획 모드 ---------- */
const FPLAN = { ghost: null, cell: null, down: false, cam: null, rc: null };
function fortPlan(on = !FORT.plan){
  if (!FORT.on) return;
  FORT.plan = on; document.body.classList.toggle('fortplan', on);
  G.slow = on ? 0.25 : 1;
  const pad = document.getElementById('fortPad'); if (pad) pad.hidden = !on;
  if (on){ FPLAN.cam = { y: CAM.base.y, back: CAM.base.back }; CAM.base.y *= 1.45; CAM.base.back *= 1.2; }
  else if (FPLAN.cam){ CAM.base.y = FPLAN.cam.y; CAM.base.back = FPLAN.cam.back; FPLAN.cam = null; }
  if (!on && FPLAN.ghost){ G.scene.remove(FPLAN.ghost); FPLAN.ghost = null; }
  fortBarRender();
}
function padPoint(ev){
  const el = G.renderer.domElement, r = el.getBoundingClientRect();
  FPLAN.rc = FPLAN.rc || new THREE.Raycaster();
  FPLAN.rc.setFromCamera(new THREE.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1), camera);
  const v = new THREE.Vector3(); if (!FPLAN.rc.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), v)) return null;
  return { i: Math.round(v.x), j: Math.round(v.z) };
}
function planValid(c){
  const t = FORT.tool; if (!c || !G.map) return false;
  if (G.player && Math.hypot(c.i - G.player.x, c.j - G.player.z) > 20) return false;
  if (t === 'erase') return !!pieceAt(c.i, c.j);
  if (t === 'post1' || t === 'post2') return !solidAt(G.map, c.i, c.j);
  const k = fk(c.i, c.j); return !G.map.solid[k] && !G.map.hgt[k] && !pieceAt(c.i, c.j) && !nodeAt(c.i, c.j) && c.i > 0 && c.j > 0 && c.i < G.map.w - 1 && c.j < G.map.h - 1;
}
function planGhost(c){
  const t = FORT.tool, ok = planValid(c), key = t + (ok ? 1 : 0) + '|' + FORT.face.toFixed(2);
  if (!c){ if (FPLAN.ghost) FPLAN.ghost.visible = false; return; }
  if (!FPLAN.ghost || FPLAN.ghost._key !== key){
    if (FPLAN.ghost) G.scene.remove(FPLAN.ghost);
    const type = t === 'erase' ? 'barricade' : t.startsWith('post') ? 'post' : t;
    const rot = t.startsWith('post') ? -FORT.face : (Math.abs(Math.sin(FORT.face)) > 0.7 ? 0 : Math.PI / 2);
    FPLAN.ghost = fortMesh(type, rot, ok && t !== 'erase' ? 'ghost' : 'bad'); FPLAN.ghost._key = key; G.scene.add(FPLAN.ghost);
  }
  FPLAN.ghost.visible = true; FPLAN.ghost.position.set(c.i, heightAt(G.map, c.i, c.j) + 0.01, c.j);
}
function planApply(c){
  if (!planValid(c)) return;
  const t = FORT.tool;
  if (t === 'erase'){ const p = pieceAt(c.i, c.j); if (p) fortRemove(p, true); return; }
  if (t === 'post1' || t === 'post2'){
    const sq = SQ.list[t === 'post1' ? 0 : 1]; if (!sq) return;
    sqOrder(sq, 'hold'); sq.at = { x: c.i, z: c.j }; sq.head = FORT.face;
    if (sq.post) G.map.group.remove(sq.post.g);
    const g = fortMesh('post', -FORT.face); g.position.set(c.i, heightAt(G.map, c.i, c.j), c.j); G.map.group.add(g); sq.post = { g, at: sq.at };
    ring(c.i, c.j, 0xffd35a, 1.4, 0.6); sqHudRender(); return;
  }
  if (fortPlace(t, c.i, c.j)) fortBarRender();
}
function fortBarRender(){
  const el = document.getElementById('fortBar'); if (!el) return;
  el.hidden = !(FORT.on && FORT.plan);
  if (el.hidden) return fortHudRender();
  const S = FORT.stock, bps = FORT.pieces.filter(p => !p.built).length;
  el.innerHTML = `<div class="fb-top"><b>진지 계획</b><span class="fb-st">나무 ${S.wood} · 돌 ${S.stone} · 잔해 ${S.scrap}</span><span class="fb-bp">설계도 ${bps}</span>${FORT.wave && FORT.wave.i < FORT.wave.list.length ? `<span class="fb-wave">적이 온다 ${Math.max(0, Math.ceil(FORT.wave.t))}초</span>` : ''}</div>
    <div class="fb-tools">${FORT_TOOLS.map(([k, n]) => `<button data-ft="${k}" class="${FORT.tool === k ? 'on' : ''}">${n}<small>${FT[k] ? matTxt(FT[k].mat) : k === 'erase' ? '되돌려 받음' : '지키는 자리'}</small></button>`).join('')}</div>
    <div class="fb-row"><button data-fa="rot">방향 돌리기 (R)</button><button data-fa="work">모두 작업</button><button data-fa="done">끝내기 (L)</button></div>
    <p class="fb-note">땅을 찍어 놓음 (끌면 줄줄이) · 시간 0.25배 — 그래도 흐름. 설계도는 동료가 재료를 모아 와서 지음.</p>`;
}
function fortHudRender(){
  const el = document.getElementById('fortHud'); if (!el) return;
  const W = FORT.wave, show = FORT.on && !FORT.plan && W && W.i < W.list.length;
  el.hidden = !show; if (show) el.textContent = `적이 온다 ${Math.max(0, Math.ceil(W.t))}초 — 진지 계획 L`;
  if (FORT.plan){ const w = document.querySelector('#fortBar .fb-wave'); if (w && W) w.textContent = `적이 온다 ${Math.max(0, Math.ceil(W.t))}초`; }
}
function fortUiInit(){
  if (document.getElementById('fortBar')) return;
  const pad = document.createElement('div'); pad.id = 'fortPad'; pad.hidden = true; document.body.appendChild(pad);
  const bar = document.createElement('div'); bar.id = 'fortBar'; bar.hidden = true; document.body.appendChild(bar);
  const hud = document.createElement('div'); hud.id = 'fortHud'; hud.hidden = true; document.body.appendChild(hud);
  pad.addEventListener('pointermove', ev => { const c = padPoint(ev); FPLAN.cell = c; planGhost(c); if (FPLAN.down && c && FORT.tool !== 'post1' && FORT.tool !== 'post2') planApply(c); });
  pad.addEventListener('pointerdown', ev => { ev.preventDefault(); const c = padPoint(ev); FPLAN.cell = c; FPLAN.down = true; planGhost(c); planApply(c); });
  window.addEventListener('pointerup', () => { FPLAN.down = false; });
  pad.addEventListener('contextmenu', ev => ev.preventDefault());
  bar.addEventListener('pointerdown', ev => ev.stopPropagation());
  bar.addEventListener('click', ev => {
    const b = ev.target.closest('button'); if (!b) return; ev.stopPropagation();
    if (b.dataset.ft){ FORT.tool = b.dataset.ft; planGhost(FPLAN.cell); }
    if (b.dataset.fa === 'rot') fortRotate();
    if (b.dataset.fa === 'work') for (const sq of SQ.list){ sqOrder(sq, 'follow'); if (sq.post){ G.map.group.remove(sq.post.g); sq.post = null; } }
    if (b.dataset.fa === 'done') return fortPlan(false);
    fortBarRender();
  });
}
function fortRotate(){ FORT.face += Math.PI / 2; if (FORT.face > Math.PI) FORT.face -= Math.PI * 2; planGhost(FPLAN.cell); }
const _uiKeysF = uiKeys;
uiKeys = function(){
  if (FORT.on && FORT.plan){
    if (hit('KeyL') || hit('Escape')){ pressed.delete('Escape'); fortPlan(false); return true; }
    if (hit('KeyR')){ fortRotate(); return true; }
    for (let k = 1; k <= 7; k++) if (hit('Digit' + k)){ FORT.tool = FORT_TOOLS[k - 1][0]; planGhost(FPLAN.cell); fortBarRender(); return true; }
  }
  if (FORT.on && G.mode === 'drill' && !G.lock && hit('KeyL') && !(typeof DP !== 'undefined' && DP.open)){ fortPlan(true); return true; }
  // E: 곁의 재료 캐기 · 설계도 돕기 (쓰러진 동료 일으키기가 먼저)
  if (FORT.on && G.player && down('KeyE') && hit('KeyE') && !G.lock && !G.units.some(u => u.side === 'ally' && u.downed && dist(u, G.player) < 1.8)){
    const pl = G.player, p = FORT.pieces.filter(p => !p.built && dist(pl, p) < 1.6)[0], n = FORT.nodes.filter(n => n.amt > 0 && dist(pl, n) < 1.6)[0];
    if (p){ if (!p.paid){ if (canPay(FT[p.type].mat)){ for (const [m, v] of Object.entries(FT[p.type].mat)) FORT.stock[m] -= v; p.paid = true; } else { popText(pl.x, pl.y + 2, pl.z, '재료가 모자람', 'miss', 0.7); return true; } }
      p.prog += 0.8 / FT[p.type].work; p.g.scale.y = 0.3 + Math.min(1, p.prog) * 0.7; spark(p.x, 0.6, p.z, 0xe0c090, 4, 2); pl.leanT = 0.2; if (p.prog >= 1) fortFinish(p); fortBarRender(); return true; }
    if (n){ nodeTake(n, 2); pl.leanT = 0.2; return true; }
  }
  return _uiKeysF();
};

/* ---------- 훈련장에 붙이기: 재료 자리 · 시나리오 셋 ---------- */
const FORT_NODES = [['tree', 26, 32], ['tree', 27, 34], ['tree', 25, 36], ['tree', 28, 37], ['tree', 53, 35], ['tree', 54, 37], ['tree', 52, 39], ['tree', 30, 45],
  ['rock', 29, 41], ['rock', 31, 43], ['rock', 49, 42], ['rock', 51, 44], ['wreck', 34, 45], ['wreck', 45, 45], ['wreck', 27, 40]];
function fortSeed(){
  for (const n of [...FORT.nodes]) if (n.amt > 0){ G.map.group.remove(n.g); const k = fk(n.i, n.j); G.map.solid[k] = 0; G.map.low[k] = 0; }
  FORT.nodes = [];
  for (const [t, i, j] of FORT_NODES) fortNode(t, i, j);
  G.map.nav = {};
}
const _startDrillF = startDrill;
startDrill = function(){
  _startDrillF();
  FORT.on = true; FORT.pieces = []; FORT.nodes = []; FORT.wave = null; FORT.stock = { wood: 4, stone: 3, scrap: 2 };
  fortUiInit(); fortSeed(); fortBarRender();
};
const _drillClearF = drillClear;
drillClear = function(){ _drillClearF(); FORT.wave = null; fortHudRender(); };
// 파도로 온 적은 멀리서도 계속 옴 (놓쳐도 돌아가지 않음)
{ const _et = enemyThink; enemyThink = function(e, dt){ if (FORT.on && e.wave && e.alert) e.seen = G.t; return _et(e, dt); }; }
function fortWaveSpawn(list, at, title, sub){
  const before = new Set(foes()); drillSpawn(list, { at, title, sub, spread: 2 });
  for (const e of foes()) if (!before.has(e)){ e.wave = true; e.home = { x: e.x, z: e.z }; }
}
function lineOf(type, z, x0, x1, gaps, side){ for (let x = x0; x <= x1; x++) if (!gaps.includes(x)) fortPlace(type, x, z, { built: true, side, rot: 0 }); }
DRILL_SC.splice(DRILL_SC.length - 1, 0,
  { k: 'fort', n: '진지전 (방어)', d: '45초 뒤 북쪽에서 세 번 몰려옴. 그 전에 L (계획 · 시간 0.25배)로 바리케이드 · 돌담 · 말뚝 · 조 진지를 놓으면 동료가 재료를 모아 지음', go: () => {
    drillClear(); fortClearAll(); FORT.stock = { wood: 6, stone: 6, scrap: 4 }; fortSeed();
    for (const sq of SQ.list) sqOrder(sq, 'follow');
    const pl = G.player; pl.x = 39; pl.z = 36;
    FORT.wave = { t: 45, gap: 30, i: 0, list: [
      () => fortWaveSpawn(['swordsman', 'swordsman', 'spearman', 'archer', 'archer'], { x: 39, z: 10 }, '1파', '검사 · 창병 · 궁수'),
      () => fortWaveSpawn(['swordsman', 'shieldman', 'spearman', 'archer', 'archer', 'drillCaster'], { x: 33, z: 11 }, '2파', '방패 · 날랜 놈 · 주술사'),
      () => fortWaveSpawn(['bk', 'bkSpear', 'swordsman', 'swordsman', 'archer', 'archer', 'gwangnyang'], { x: 45, z: 11 }, '3파', '갑옷 기사 · 궁수 둘'),
    ] };
    caption('진지전', '45초 — L로 계획 (느려짐)'); fortPlan(true);
  } },
  { k: 'cover', n: '엄폐 사격전', d: '양쪽에 바리케이드 줄. 적 궁수 넷이 그 뒤에 숙여 있음 — 쏠 때만 머리를 내밂. 숙여 (G) 기다렸다 내민 머리를 쏘거나, 옆으로 돌아 엄폐를 무력화', go: () => {
    drillClear(); fortClearAll();
    lineOf('barricade', 20, 33, 45, [36, 42], 'enemy'); lineOf('barricade', 26, 34, 44, [39], 'ally');
    const pl = G.player; pl.x = 39; pl.z = 28;
    for (const x of [34, 38, 40, 44]){ drillSpawn(['archer'], { at: { x, z: 19 }, title: '엄폐 사격전', sub: '숙이고 기다렸다 — 머리를 내밀 때' }); const e = foes()[foes().length - 1]; e.post = { x, z: 19 }; e._fortPost = true; e.wave = true; }
    fortWaveSpawn(['swordsman', 'swordsman'], { x: 39, z: 14 }, '엄폐 사격전', '숙이고 기다렸다 — 머리를 내밀 때');
    for (const u of G.units) if (u.side === 'ally' && u !== pl){ u.x = 39 + rnd(-4, 4); u.z = 28 + rnd(0, 1.5); }
    for (const sq of SQ.list){ sqOrder(sq, 'follow'); if (sq.post){ G.map.group.remove(sq.post.g); sq.post = null; } }
  } },
  { k: 'corner', n: '모퉁이 매복', d: '골목 모퉁이에서 궁수 셋이 가만히 기다림 — 나오는 순간 대기 사격 (×1.5). 우리도 같음: 벽 곁에서 1초 넘게 가만히 있다가 새로 보이는 적을 쏘면 ×1.5', go: () => {
    drillClear();
    const P3 = [[70, 32], [63, 34], [57, 39]];
    for (const [x, z] of P3){ drillSpawn(['archer'], { at: { x, z }, alert: false, title: '모퉁이 매복', sub: '벽 곁에서 기다렸다 쏴라' }); const e = foes()[foes().length - 1]; e.ambush = true; e.lookT = 1e9; e.aim = e.aim0 = -Math.PI / 2; }   // 북쪽 (골목 입구 쪽 통로)을 보고 기다림
    const pl = G.player; pl.x = 67; pl.z = 22;
  } });
