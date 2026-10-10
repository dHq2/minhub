/* patrol.js v1.1 — (v1.1: 싸움 방만이 아니라 보물 · 무덤 · 제단 방 무리도 — 작은 층엔 '싸움 방' 이 거의 안 남아 2 ~ 9층에 순찰이 없었음 · 절반으로) (v1.0, v0.86) 순찰: 들키기 전 적 무리가 길을 따라 걷다 멈춰 두리번 (민수: 일부 적은 순찰 · 우리를 보기도 전에 진형부터 짜고 있는 건 어색함)
   ■ u.patrol = { pts: [{x, z}…], i, off: {x, z}, wait } — 들키기 전엔 '제자리 (home)' 를 다음 지점으로 옮김.
     은신 규칙 (stealth.js) 의 '두리번 · 제자리로 천천히 걷기' 를 그대로 쓰므로 순찰 중에도 시야 · 의심 · 발견이 똑같이 돎
   ■ 원정 싸움 · 보물 · 무덤 · 제단 방 (모닥불에 앉지 않은 무리) 의 절반: 가까운 다른 방까지 오가며 순찰 (무리가 줄지어)
   ■ 알아채면 순찰은 끝 — 그 자리에서 싸움 (방패병 · 궁수는 제 자리 post 가 있으면 그리로)
   ■ 1층 회색 대지의 검사 · 창병 무리도 순찰 (greyland.js) */
'use strict';
const PATROL = { share: 0.5, wait: [1.6, 3.2], types: new Set(['fight', 'treasure', 'graves', 'altar']) };
// 막힌 칸이면 둘레에서 가장 가까운 빈 칸
function openNear(x, z){
  if (!solidAt(G.map, x, z)) return { x, z };
  for (let r = 1; r <= 3; r++) for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++){
    if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
    if (!solidAt(G.map, x + dx, z + dz)) return { x: x + dx, z: z + dz };
  }
  return null;
}
TICKS.push(dt => {
  if (G.mode !== 'exp') return;
  for (const e of G.units){
    const P = e.patrol; if (!P || e.side !== 'enemy' || e.dead) continue;
    if (e.alert){ e.patrol = null; continue; }
    const p = P.pts[P.i], q = openNear(p.x + P.off.x, p.z + P.off.z) || p;
    if (!e.home || Math.hypot(e.home.x - q.x, e.home.z - q.z) > 0.01) e.home = { x: q.x, z: q.z };
    if (Math.hypot(e.x - q.x, e.z - q.z) < 0.6){
      P.wait = (P.wait ?? rnd(PATROL.wait[0], PATROL.wait[1])) - dt;
      if (P.wait <= 0){ P.wait = null; P.i = (P.i + 1) % P.pts.length; const n = P.pts[P.i]; e.aim0 = Math.atan2(n.z - e.z, n.x - e.x); }
    }
  }
});
// 원정 방 채우기 뒤: 모닥불에 앉지 않은 싸움 방 무리의 셋에 하나는 이웃 방까지 오가며 순찰 (시드 순서를 건드리지 않게 방 번호로 고름)
const _fillRoomPt = fillRoom;
fillRoom = function(r, gen){
  const before = new Set(G.units);
  _fillRoomPt(r, gen);
  if (!PATROL.types.has(r.type) || (r.id * 13 + gen.F * 5) % 100 >= PATROL.share * 100) return;
  const band = 'r' + r.id, mob = G.units.filter(u => !before.has(u) && u.band === band && u.side === 'enemy' && !u.camp && !u.post && !u.elite && !(u.D && u.D.boss));
  if (mob.length < 2) return;
  const near = (gen.rooms || []).filter(o => o !== r && o.type !== 'start').map(o => ({ o, d: Math.hypot(o.cx - r.cx, o.cz - r.cz) })).filter(x => x.d > 6 && x.d < 22).sort((a, b) => a.d - b.d)[0];
  if (!near) return;
  const A = openNear(Math.round(r.cx), Math.round(r.cz)), B = openNear(Math.round(near.o.cx), Math.round(near.o.cz));
  if (!A || !B) return;
  mob.forEach((e, i) => { e.patrol = { pts: [A, B], i: 0, off: { x: (i % 2 ? 1 : -1) * 0.9 * Math.ceil(i / 2), z: ((i % 3) - 1) * 0.8 }, wait: rnd(0.5, 2.5) }; });
};
