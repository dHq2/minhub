/* gacha.js v1.1 — (v1.1, v0.92: 카드에 뽑힌 인물 얼굴이 제대로 (얼굴 묶음을 기다림) · 한 명이면 체력 · 공격 · 패시브 · 기술을 보임) (v1.0) (v0.90) 낙하 기원 = 동료 뽑기 (민수: 동료가챠도 있음 좋겠는데)
   ■ 굴 천장 구멍의 푸른 빛 아래에서 금화를 빛 속에 던지고 빈다 → 누군가 떨어진다 → 굴 식구 (원정 준비 창에서 데려감)
   ■ 한 번 60 금화 · 다섯 번 280 금화. 처음 한 번은 금화 없이
   ■ 별 (세계 안에선 안 보임 — 게임의 편의, CORE_LORE): ★1 40% · ★2 33% · ★3 18% · ★4 7% · ★5 2%. 열 번째마다 ★3 이상 확정 (모자라면 쌓임)
   ■ 후보: 굴 식구가 아닌 2 · 3 · 4기 인물 (포획 후보와 같음) + 아직 만나지 않은 다른 세계선 동료 (청광묵 ★2 · 카리우스 ★5) */
'use strict';
const GACHA = { cost: 60, cost5: 280, rate: [[1, 40], [2, 33], [3, 18], [4, 7], [5, 2]], spot: null, busy: false };
const STAR = n => '★'.repeat(n) + '☆'.repeat(5 - n);
function gachaPool(){
  const crew = new Set(RPG.meta.crew || []);
  const L = capPool().filter(s => !crew.has(s)).map(s => ({ s, star: capStar(s) }));
  for (const id of (typeof wlLeft === 'function' ? wlLeft() : [])) L.push({ wl: id, star: id === 'karius' ? 5 : 2 });
  return L;
}
function gachaRoll(){
  const M = RPG.meta; M.gPity = (M.gPity || 0) + 1;
  let r = Math.random() * 100, star = 1; for (const [s, w] of GACHA.rate){ r -= w; if (r <= 0){ star = s; break; } }
  if (M.gPity >= 10 && star < 3){ star = 3 + (Math.random() < 0.25 ? 1 : 0); }
  if (star >= 3) M.gPity = 0;
  const pool = gachaPool(); if (!pool.length) return null;
  let cand = []; for (let d = 0; d <= 4 && !cand.length; d++) cand = pool.filter(o => Math.abs(o.star - star) === d && (d === 0 || o.star <= star + d));
  if (!cand.length) cand = pool;
  return cand[Math.floor(Math.random() * cand.length)];
}
const gachaName = o => o.wl ? HERO_DEF[o.wl].name : capName(o.s);
// v1.1 뽑힌 인물 한 줄: 체력 · 공격 · 패시브 · 기술 (카드가 이름만 있고 비어 보였음)
const gachaInfo = o => { if (o.wl) return HERO_DEF[o.wl].note || ''; const K = (typeof H2K !== 'undefined' && H2K[o.s]) || {}, st = K.st || {}; return [st.hp ? `체력 ${st.hp} · 공격 ${st.atk}` : '', K.pas ? `${K.pas[0]} — ${K.pas[1]}` : '', (K.sk || []).length ? '기술: ' + K.sk.map(k => k.n).join(' · ') : ''].filter(Boolean).join('\n'); };
// v1.1 얼굴 묶음 그림을 다 읽은 뒤 카드를 띄움 (전엔 첫 기원 때 묶음이 아직이라 기도하는 기본 그림이 떴음)
const gachaFaceWait = o => new Promise(res => { if (!o.s || CAP.faces[o.s]) return res(); capFace(o.s); let n = 0; const iv = setInterval(() => { if (CAP.faces[o.s] || ++n > 40){ clearInterval(iv); res(); } }, 50); });
const gachaFace = o => o.wl ? HERO_DEF[o.wl].face : (capFace(o.s), CAP.faces[o.s] || CA + 'U-007.webp');
// 들이기: 떨어져 내려와 굴 식구가 됨
function gachaJoin(o, i){
  const C = GACHA.spot, x = C.x + rnd(-1.6, 1.6), z = C.z + rnd(0.6, 2.2);
  if (o.wl){ wlJoin(o.wl, '기원', x, z); const C2 = PRO.cave, u = C2 && C2[WL.key[o.wl]]; if (u && typeof fallUnit === 'function') fallUnit(u, 14, 0.1, 0.9, () => { dust(u.x, u.z, 12); camShake(0.25, 0.3); }); return; }
  capJoinCrew(o.s, '기원');
  const u = spawn('h2_' + o.s, x, z, 'neutral'); u.lock = 'resident'; u.face = Math.random() < 0.5 ? 1 : -1; u.capSlug = o.s;
  if (typeof fallUnit === 'function') fallUnit(u, 14, 0.15 + i * 0.35, 0.9, () => { dust(u.x, u.z, 12); camShake(0.25, 0.3); SFX.boom && SFX.boom(0.6); });
  G.inspect.push({ unit: u, r: 1.6, talk: true, label: `${u.D.name}에게 말을 건다`, fn: async () => { u.face = Math.sign(G.player.x - u.x) || u.face; await textbox(u.D.name, [CAP_FIRST[o.s.length % CAP_FIRST.length][1]], { face: CAP.faces[o.s] }); } });
}
async function gachaPull(n){
  if (GACHA.busy) return; GACHA.busy = true;
  try {
    const free = !RPG.meta.gFree, cost = free ? 0 : n === 5 ? GACHA.cost5 : GACHA.cost;
    if (RPG.gold < cost){ caption('금화가 모자라다', `기원 ${n === 5 ? '다섯 번' : '한 번'}에 금화 ${cost} (가진 금화 ${RPG.gold})`); return; }
    RPG.gold -= cost; if (free) RPG.meta.gFree = 1;
    const got = []; for (let i = 0; i < n; i++){ const o = gachaRoll(); if (o){ got.push(o); if (o.s) (RPG.meta.crew = RPG.meta.crew || []).includes(o.s) || RPG.meta.crew.push(o.s); if (o.wl) (RPG.meta.wl = RPG.meta.wl || {})[o.wl] = PRO.day; } }   // 같은 이를 두 번 뽑지 않게 바로 표시
    if (!got.length){ caption('…아무도 오지 않았다', '빛 아래가 고요하다'); RPG.gold += cost; return; }
    // 연출: 빛기둥이 밝아지고 · 우르르 → 카드
    const C = GACHA.spot; SFX.roar && SFX.roar(0.4); camShake(0.2, 1.0); flashScreen('#d8e4ff', 0.35);
    GACHA.glow = 1;
    await Promise.all([wait(0.9), ...got.map(gachaFaceWait)]);
    const best = got.reduce((a, b) => (b.star > a.star ? b : a));
    const text = got.length === 1 ? `${STAR(best.star)}\n${gachaInfo(best)}` : got.map(o => `${STAR(o.star)}  ${gachaName(o)}`).join('\n');
    await rgCard({ img: gachaFace(best), kicker: `낙하 기원 · ${free ? '첫 기원' : '금화 ' + cost}`, title: got.length === 1 ? gachaName(best) : `${got.length}명이 떨어진다`, text,
      choices: [{ t: '굴에 들인다', sub: '굴 식구가 된다 — 원정 준비 창에서 데려갈 수 있다' }] });
    got.forEach((o, i) => gachaJoin(o, i));
    caption(got.length === 1 ? `${gachaName(best)} — 굴 식구` : `${got.map(gachaName).join(' · ')} — 굴 식구`, best.star >= 4 ? '빛 속에서 무언가 크게 떨어졌다' : '빛 아래로 누군가 떨어졌다');
    if (typeof saveRpg === 'function') saveRpg(); if (typeof proSave === 'function') proSave();
  } finally { GACHA.busy = false; }
}
async function gachaOpen(){
  const free = !RPG.meta.gFree, pity = 10 - (RPG.meta.gPity || 0);
  const i = await rgCard({ img: CA + 'U-007.webp', kicker: `낙하 기원 · 가진 금화 ${RPG.gold}`, title: '빛 아래에서 빈다',
    text: `천장 구멍에서 내려오는 푸른 빛 속으로 금화를 던진다.\n…누군가 떨어진다. 위에서, 혹은 어딘가에서.\n★3 이상까지 ${pity}번`,
    choices: [{ t: free ? '빈다 (첫 기원 · 금화 없이)' : `한 번 빈다 (금화 ${GACHA.cost})`, sub: '한 명', dis: !free && RPG.gold < GACHA.cost },
      { t: `다섯 번 빈다 (금화 ${GACHA.cost5})`, sub: '다섯 명 · 한 번에', dis: RPG.gold < GACHA.cost5 }, { t: '그만둔다' }] });
  if (i === 0) return gachaPull(1); if (i === 1) return gachaPull(5);
}
// 굴: 빛 아래 자리 (빈 칸) + 은은한 빛기둥 + 살펴보기
{ const _scG = startCave; startCave = async function(){
    const r = await _scG.apply(this, arguments);
    try {
      let p = null; for (const [x, z] of [[9, 14], [10, 14], [8, 14], [10, 13], [8, 13]]) if (!solidAt(G.map, x, z)){ p = { x, z }; break; }
      if (p){ GACHA.spot = p; const y = heightAt(G.map, p.x, p.z);
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.9, 9, 18, 1, true), new THREE.MeshBasicMaterial({ color: 0xbfd8ff, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
        beam.position.set(p.x, y + 4.5, p.z); G.scene.add(beam); G.props.push(beam); GACHA.beam = beam;
        G.inspect.push({ x: p.x, z: p.z, r: 1.3, mark: '기원', far: 6, keep: true, get label(){ return `빛 아래에서 빈다 — 동료 기원 (${!RPG.meta.gFree ? '첫 기원 무료' : '금화 ' + GACHA.cost}, 가진 금화 ${RPG.gold})`; }, fn: gachaOpen });
      }
    } catch (e) {}
    return r;
  }; }
TICKS.push(dt => { if (!GACHA.beam || G.mode !== 'cave') return; GACHA.glow = Math.max(0, (GACHA.glow || 0) - dt * 0.25); GACHA.beam.material.opacity = 0.1 + GACHA.glow * 0.3 + Math.sin(G.t * 2) * 0.015; });
