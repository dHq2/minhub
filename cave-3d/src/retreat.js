/* retreat.js v1.0 — (v0.86) 세자르의 침묵 · 도망 · 버려진 동료 (민수)
   ■ 세자르는 업고 가는 자를 막지 않음: 누가 반시체가 된 인주를 들쳐업으면 (maim.js CARRY) 몇 번 더 휘두른 뒤 (2.5초)
     공격을 멈추고 제자리 (왕좌 앞) 로 물러나 말없이 지켜봄. 도망치는 쪽도 쫓지 않음 — 서 있는 아군이 모두 제자리에서 13칸 넘게 멀어지면 같은 식으로 물러남
     물러난 세자르는 때리거나 6칸 안으로 다가오면 다시 싸움 (보스 줄은 그대로)
   ■ 도망: 세자르와 싸우는 중, 쓰러진 동료를 두고 인주가 세자르에게서 11칸 넘게 멀어지면 '도망가겠습니까?'
     · 예: 싸움은 그대로. 쓰러진 동료마다 '아군이 버려졌습니다!' — 머리 위 표시는 멀리 가도 화면 가장자리에 남고 지도에도 찍힘
     · 다시 가서 일으키면 표시가 풀림. 버려진 채로 층을 떠나거나 굴로 돌아가면 그 동료는 다시 돌아오지 않음
     · 아니오: 그대로 (8칸 안으로 돌아왔다가 다시 멀어지면 또 물음) */
'use strict';
const RETREAT = { asked: false, askAt: -99, near: true, layer: null, marks: new Map() };
const czHomeOf = u => u.czHome || (u.czHome = { x: u.x, z: u.z });
// 물러나 지켜봄 (말없이)
function czHold(u, dt){
  const h = czHomeOf(u), d = Math.hypot(h.x - u.x, h.z - u.z);
  if (d > 0.6){ navTo(u, h.x, h.z, u.spd * 0.55, dt, 0.4); u.moving = true; czPose(u, 'walk'); return; }
  u.moving = false; const t = nearest(u, czFoes3(u), 40);
  if (t){ u.aim = Math.atan2(t.z - u.z, t.x - u.x); faceToward(u, t.x - u.x, t.z - u.z); }
  czPose(u, 'idle');
}
function czShouldRest(u){
  const pl = G.player;
  if (CARRY.lifted && G.t > CARRY.lifted + 2.5 && pl && pl.carriedBy) return true;   // 업고 가는 자는 막지 않음 (몇 번 더 휘두른 뒤)
  const A = czFoes3(u), h = czHomeOf(u);
  return A.length > 0 && A.every(a => Math.hypot(a.x - h.x, a.z - h.z) > 13);       // 도망치는 쪽은 쫓지 않음
}
const _cz3ThinkR = cz3Think;
cz3Think = function(u, dt){
  if (u.dead) return;
  czHomeOf(u);
  if (u.czRest){
    if (u.hp < (u.czRestHp ?? u.hp) - 1 || czFoes3(u).some(a => dist(a, u) < 6 && !(G.player && G.player.carriedBy === a))){ u.czRest = false; u.alert = true; u.seen = G.t; }   // 때리거나 다가오면 다시
    else { czHold(u, dt); return; }
  }
  if (!u.czWait && !u.lock && !G.lock && czShouldRest(u)){
    u.czRest = true; u.czRestHp = u.hp; u.alert = false; if (u.cz) u.cz.act = null; interrupt(u); if (u.st !== 'hurt') u.st = 'idle';
    czHold(u, dt); return;
  }
  return _cz3ThinkR(u, dt);
};
// 도망가겠습니까?
const czFighting = () => G.units.find(e => e.kind === 'cesar' && !e.dead && e.alert && !e.czWait && !e.czRest);
TICKS.push(() => {
  if (G.mode !== 'exp' || !EXP || EXP.ending || G.paused || G.lock) return;
  const pl = G.player, cz = czFighting(); if (!pl || pl.downed || !cz) return;
  const left = G.units.filter(a => a.side === 'ally' && a.hero && a !== pl && a.downed && !a.dead && !a.abandoned && !a.D.undying);
  const d = dist(pl, cz);
  if (d < 8) RETREAT.near = true;
  if (!left.length || d < 11 || !RETREAT.near || G.t - RETREAT.askAt < 4) return;
  RETREAT.near = false; RETREAT.askAt = G.t;
  if (typeof uiConfirm !== 'function') return;
  uiConfirm('도망가겠습니까?', `쓰러진 ${left.map(a => a.D.name).join(' · ')}를 두고 간다. 싸움은 그대로 이어진다.`, '도망간다', () => {
    for (const a of left) abandon(a);
    caption('아군이 버려졌습니다!', left.map(a => a.D.name).join(' · ') + ' — 다시 가서 일으키지 않으면 돌아오지 않는다');
  });
});
function abandon(a){
  a.abandoned = true; popText(a.x, a.y + 1.6, a.z, '아군이 버려졌습니다!', 'crit', 2.2);
  if (typeof DUN !== 'undefined' && DUN.marks){ a.abMark = { x: a.x, z: a.z, icon: '✝', col: '#ff5a4a', known: true }; DUN.marks.push(a.abMark); }
  if (typeof clashLog === 'function') clashLog(`${a.D.name}를 두고 뛰었다. 등 뒤가 조용하다.`);
}
// 버려진 동료 표시: 머리 위 → 화면 밖이면 가장자리에 붙음
function abLayer(){
  if (RETREAT.layer && document.body.contains(RETREAT.layer)) return RETREAT.layer;
  const el = document.createElement('div'); el.id = 'abLayer'; el.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:30';
  document.body.appendChild(el); return (RETREAT.layer = el);
}
TICKS.push(() => {
  const M = RETREAT.marks;
  for (const [u, el] of M) if (!u.abandoned || u.dead || !G.units.includes(u) || G.mode !== 'exp'){ el.remove(); M.delete(u); }
  if (G.mode !== 'exp') return;
  for (const u of G.units){
    if (!u.abandoned) continue;
    if (!u.downed && !u.dead){   // 다시 일으켰음
      u.abandoned = false; if (u.abMark && DUN.marks) DUN.marks = DUN.marks.filter(m => m !== u.abMark); u.abMark = null;
      popText(u.x, u.y + 2, u.z, '다시 데려왔다', 'heal', 1.4); continue;
    }
    if (u.dead) continue;
    let el = M.get(u);
    if (!el){ el = document.createElement('div'); el.style.cssText = 'position:absolute;transform:translate(-50%,-100%);font:15px "Do Hyeon",sans-serif;color:#fff;background:rgba(150,20,30,.88);border:1px solid #ff8a8a;border-radius:8px;padding:3px 8px;white-space:nowrap;text-shadow:0 1px 2px #000'; el.textContent = `⚠ 버려짐 · ${u.D.name}`; abLayer().appendChild(el); M.set(u, el); }
    const W = innerWidth, H = innerHeight, p = toScreen(u.x, u.y + 1.4, u.z, W, H), pad = 70;
    let x = p.x, y = p.y; const off = p.behind || x < pad || x > W - pad || y < pad || y > H - pad;
    if (p.behind){ x = W - x; y = H - pad; }
    x = Math.max(pad, Math.min(W - pad, x)); y = Math.max(pad, Math.min(H - pad * 0.6, y));
    el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.opacity = off ? '0.92' : '1'; el.textContent = (off ? '◀▶ ' : '⚠ ') + `버려짐 · ${u.D.name} (${Math.round(dist(u, G.player))}칸)`;
  }
});
// 버려진 채로 떠나면: 그 동료는 다시 돌아오지 않음
function abandonLost(){
  const lost = G.units.filter(u => u.abandoned && u.downed && !u.dead && u.hero);
  for (const u of lost){
    const h = u.hero; h.st = 'dead'; h.lost = true; h.halfDead = false; RPG.party = RPG.party.filter(k => k !== h.id);
    u.abandoned = false; if (u.abMark && DUN.marks) DUN.marks = DUN.marks.filter(m => m !== u.abMark);
    for (const b of G.units) if (b !== u && b.side === 'ally' && b.hero && !b.dead) b.hero.san = Math.max(0, (b.hero.san ?? 50) - 20);
  }
  if (lost.length){ caption(`${lost.map(u => u.D.name).join(' · ')}를 두고 왔다`, '다시는 돌아오지 않는다'); typeof saveRpg === 'function' && saveRpg(); }
}
{ const _elfR = expLoadFloor; expLoadFloor = async function(F, how){ abandonLost(); return _elfR.apply(this, arguments); };
  const _erR = expReturn; expReturn = async function(){ if (!EXP.ending) abandonLost(); return _erR.apply(this, arguments); }; }
