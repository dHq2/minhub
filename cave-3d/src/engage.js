/* engage.js v1.0 — (v0.55) 교전 자리 규칙 (공격 자리)
   격투와 조직전이 함께 살게 하는 뼈대. 한 사람을 앞에서 동시에 칠 수 있는 적은 둘 (ENG.slots)
   · 자리를 얻은 적만 예고 장판을 깔고 공격함. 자리가 없으면 둘레 (2.6~3칸)를 돌며 기다림 — 기다리는 놈은 슬금슬금 등 뒤로 돎
   · 자리는 한 번에 2.4초까지. 다 쓰면 내놓고 1초 동안 다시 못 잡음 → 기다리던 놈과 번갈아 들어옴 (일대일 기술 교환이 끊기지 않음)
   · 등 뒤 (사각): 대상의 등을 동료가 막고 있지 않으면 자리 없이도 들어와 침 → 진형 (등맞대기 · 삼각)이 등을 지켜야 하는 이유
   · 보스 · 원거리 (활) · 더미는 이 규칙 밖. 넘어진 · 잡힌 대상에겐 자리 하나 더 (몰매)
   · 훈련장에서 켜고 끄기 · 자리 표시 (빨강 = 자리 잡음, 회색 = 기다림, 주황 = 등 뒤로 들어옴) */
'use strict';
const ENG = { on: false,   // 훈련장이 켬 (확정되면 모든 판)
   slots: 2, ring: 2.8, slice: 2.4, rest: 1.0, show: false, tok: new Map(), stat: { waits: 0, flanks: 0 } };
const engUses = e => !e.D.boss && !e.D.dummy && !e.D.bow && !!(e.D.melee || e.D.line || e.D.slam) && e.side === 'enemy';
function engSlotsOf(t){ return ENG.slots + (t.lying || t.downed || t.lock ? 1 : 0) + (t.engPull || 0); }
function engList(t){ let m = ENG.tok.get(t.uid); if (!m){ m = new Map(); ENG.tok.set(t.uid, m); } return m; }
function engHolds(e, t){ const m = ENG.tok.get(t.uid); return !!(m && m.has(e.uid)); }
// 등 뒤: 대상이 바라보는 쪽의 반대 (110° 넘게) 이고, 그쪽을 막아 선 동료가 없음
function engFlank(e, t){
  const toE = Math.atan2(e.z - t.z, e.x - t.x);
  if (Math.abs(angDiff(toE, t.aim ?? 0)) < 1.9) return false;
  return !G.units.some(a => a !== t && a.side === t.side && !a.dead && !a.downed && dist(a, t) < 2.0 && Math.abs(angDiff(Math.atan2(a.z - t.z, a.x - t.x), toE)) < 1.1);
}
function engTake(e, t){
  if (G.t < (e.engCd || 0)) return false;
  const m = engList(t); if (m.size >= engSlotsOf(t)) return false;
  m.set(e.uid, { e, until: G.t + ENG.slice }); return true;
}
function engDrop(e, rest){
  for (const m of ENG.tok.values()) if (m.delete(e.uid) && rest) e.engCd = G.t + ENG.rest;
}
// 적이 노리는 상대 (enemyThink와 같은 기준: 보이는 쪽 · 가까운 쪽 · 비슷하면 인주)
function engPick(e){
  const fo = e.focusOn && !e._engFo ? e.focusOn : null;
  if (fo && !fo.dead && !fo.downed && fo.side !== e.side) return fo;
  const team = G.units.filter(a => a.side === 'ally' && !a.dead && !a.downed);
  const vis = team.filter(a => sees(e, a));
  let t = nearest(e, vis.length ? vis : team, 30);
  const pl = G.player && !G.player.downed ? G.player : null;
  if (pl && t && dist(e, pl) < dist(e, t) + 1.5 && (sees(e, pl) || !vis.length)) t = pl;
  return t;
}
// 자리를 못 얻은 놈: 둘레를 돎 (등 뒤 쪽으로 천천히), 상대를 봄. 가끔 움찔 (속임수)
function engCircle(e, t, dt){
  e.engSide = e.engSide || (Math.random() < 0.5 ? 1 : -1);
  const b = Math.atan2(e.z - t.z, e.x - t.x), back = (t.aim ?? 0) + Math.PI, toBack = angDiff(back, b);
  const drift = Math.sign(toBack || e.engSide) * 0.55 + e.engSide * 0.15;   // 등 쪽으로
  const R = ENG.ring + e.r, na = b + drift * dt * 2.2;
  let gx = t.x + Math.cos(na) * R, gz = t.z + Math.sin(na) * R;
  if (solidAt(G.map, gx, gz)){ e.engSide = -e.engSide; gx = t.x + Math.cos(b) * R; gz = t.z + Math.sin(b) * R; }
  steerTo(e, gx, gz, e.spd * 0.55, dt); setAim(e, t.x, t.z);
  e.feintT = (e.feintT ?? rnd(1.5, 3.5)) - dt;
  if (e.feintT <= 0){ e.feintT = rnd(2, 4); e.leanT = -0.18; if (ENG.show) popText(e.x, e.y + bodyH(e) + 0.2, e.z, '움찔', 'miss', 0.4); }
}
const _enemyThinkEng = enemyThink;
enemyThink = function(e, dt){
  if (!ENG.on || !e.alert || !engUses(e) || e.lock) return _enemyThinkEng(e, dt);
  const busy = e.st === 'windup' || e.st === 'strike' || e.st === 'hurt' || e.st === 'leap' || e.st === 'charge' || e.st === 'guardStance';
  const t = engPick(e);
  if (!t){ engDrop(e); return _enemyThinkEng(e, dt); }
  const d = dist(e, t), m = engList(t), mine = m.get(e.uid);
  if (busy){ if (mine) mine.until = Math.max(mine.until, G.t + 0.4); return _enemyThinkEng(e, dt); }
  if (mine && G.t > mine.until){ m.delete(e.uid); e.engCd = G.t + ENG.rest; }
  if (d > 4.4){ e.engWait = false; return _enemyThinkEng(e, dt); }   // 멀면 그냥 다가옴
  const flank = engFlank(e, t);
  if (m.has(e.uid) || engTake(e, t) || flank){
    if (flank && !m.has(e.uid) && !e.flankSaid){ e.flankSaid = true; ENG.stat.flanks++; popText(e.x, e.y + bodyH(e) + 0.3, e.z, '등 뒤!', 'alert', 0.7); setTimeout(() => e.flankSaid = false, 3000); }
    e.engWait = false; e.engFlank = flank;
    if (!e.focusOn || e._engFo){ e.focusOn = t; e._engFo = true; }
    return _enemyThinkEng(e, dt);
  }
  if (!e.engWait) ENG.stat.waits++;
  e.engWait = true; e.engFlank = false;
  engCircle(e, t, dt);
};
// 정리: 죽음 · 놓침 · 멀어짐 · 넘어짐
TICKS.push(dt => {
  for (const [uid, m] of ENG.tok){
    for (const [eu, s] of m){ const e = s.e; if (e.dead || !e.alert || e.lock || e.lying || G.units.indexOf(e) < 0) m.delete(eu); }
    if (!m.size) ENG.tok.delete(uid);
  }
  engMarks();
});
// 자리 표시: 발밑 고리 (빨강 = 자리, 회색 = 기다림, 주황 = 등 뒤로)
function engMarks(){
  for (const e of G.units){
    if (e.side !== 'enemy') continue;
    const want = ENG.show && ENG.on && e.alert && !e.dead && engUses(e);
    if (!want){ if (e.engRing) e.engRing.visible = false; continue; }
    if (!e.engRing){ e.engRing = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.56, 24), new THREE.MeshBasicMaterial({ color: 0xff4040, transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide })); e.engRing.rotation.x = -Math.PI / 2; e.engRing.position.y = 0.05; e.group.add(e.engRing); }
    const holds = [...ENG.tok.values()].some(m => m.has(e.uid));
    e.engRing.visible = true; e.engRing.scale.setScalar(Math.max(0.8, e.r * 2));
    e.engRing.material.color.setHex(e.engFlank ? 0xffa030 : holds ? 0xff4040 : 0x9a9aa8);
  }
}
