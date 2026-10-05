/* gear.js v1.0 — 장비 규칙 · 동료 사격 (v0.33)
   · 보조 칸: 방패 (막기 +15% · 인주는 F 막기가 85%까지) 또는 한손 무기 (검 · 단검 · 도끼 · 망치 · 권총 · 창)
   · 인주 X: 무기 ↔ 보조 무기 바꿔 쥠 (둘 다 한손일 때)
   · 영웅마다 고유 무기 (칸이 비면 그걸로 싸움) · 들 수 있는 무기가 정해져 있음 (카리우스는 민첩 2라 활 · 총을 못 듦, GOOD WILL은 주먹뿐)
   · 활 · 총을 든 동료: 탄약 (공용)이 있으면 거리를 두고 쏨. 탄약이 떨어지면 고유 무기 · 보조 무기로 붙어 싸움 */
'use strict';
HERO_DEF.goodwill.innate = '번개 주먹'; HERO_DEF.goodwill.wts = [];
const ALLY_GUN = {
  bow:      { cd: 1.2, speed: 24, mul: 1.0, range: 10, color: 0xd8c8a8, len: 0.8, tip: true },
  crossbow: { cd: 1.7, speed: 30, mul: 1.45, range: 11, color: 0xc8b898, len: 0.6, tip: true },
  pistol:   { cd: 0.75, speed: 34, mul: 0.8, range: 9, color: 0xffe0a0, len: 0.3, thick: 0.025 },
  shotgun:  { cd: 1.5, speed: 28, mul: 0.42, range: 6, color: 0xffd080, len: 0.25, pellets: 5, spread: 0.32, thick: 0.02 },
  lever:    { cd: 1.1, speed: 38, mul: 1.3, range: 12, color: 0xffe0a0, len: 0.35, thick: 0.025 },
  assault:  { cd: 0.42, speed: 36, mul: 0.6, range: 10, color: 0xffe0a0, len: 0.3, thick: 0.02 },
};
function heroCombat(u, dt){
  if (!u.hero || u.kind === 'player' || u.downed || u.lock || G.mode !== 'exp') return false;
  const S = u.rpg; if (!S || !S.wt || !ALLY_GUN[S.wt]) return false;
  const am = AMMO_OF[S.wt];
  if (!(RPG.ammo[am] > 0)){ if (!u.noAmmoSaid){ u.noAmmoSaid = true; popText(u.x, u.y + bodyH(u) + 0.4, u.z, `${AMMO_N[am]} 없음 — ${HERO_DEF[u.hero.id].innate || '손'}으로`, 'miss', 1.4); } return false; }
  u.noAmmoSaid = false;
  if (u.st === 'hurt' || u.st === 'windup' || u.st === 'skill' || u.kc || (u.gw && u.gw.act)) return false;
  const pl = G.player;
  if (G.cmd === 'follow' && pl && !pl.downed) return false;
  const B = ALLY_GUN[S.wt];
  const tgt = G.cmd === 'focus' && G.focusTarget && !G.focusTarget.dead ? G.focusTarget : nearest(u, foes().filter(e => e.alert && sees(u, e)), B.range + 2);
  if (!tgt) return false;
  u.shootCd = (u.shootCd ?? rnd(0.2, 0.8)) - dt;
  const d = dist(u, tgt);
  u.moving = false;
  if (d < 2.6) steerTo(u, u.x - (tgt.x - u.x), u.z - (tgt.z - u.z), u.spd, dt);
  else if (d > B.range * 0.85) navTo(u, tgt.x, tgt.z, u.spd, dt, B.range * 0.7);
  setAim(u, tgt.x, tgt.z);
  if (u.shootCd <= 0 && d <= B.range){
    u.shootCd = B.cd / (S.atkSpd || 1); RPG.ammo[am]--;
    const y0 = u.y + bodyH(u) * 0.6, a0 = Math.atan2(tgt.z - u.z, tgt.x - u.x);
    for (let i = 0; i < (B.pellets || 1); i++){
      const a = a0 + (B.pellets ? (i - (B.pellets - 1) / 2) * B.spread / (B.pellets - 1) : rnd(-0.03, 0.03));
      shoot({ x: u.x + Math.cos(a) * 0.4, y: y0, z: u.z + Math.sin(a) * 0.4, a, speed: B.speed, range: B.range + 1, side: u.side, len: B.len, tip: B.tip, thick: B.thick, color: B.color, hitsAir: true,
        onHit: (p, t) => { const head = Math.random() < (u.rpg ? u.rpg.crit : 0.05); hurt(u, t, u.atk * B.mul, { from: { x: p.x - Math.cos(p.a), z: p.z - Math.sin(p.a) }, ranged: true, crit: head || undefined }); } });
    }
    spark(u.x + Math.cos(a0) * 0.5, y0, u.z + Math.sin(a0) * 0.5, B.tip ? 0xe8dcc0 : 0xffd080, B.tip ? 3 : 8, 3);
    if (!B.tip){ SFX.burst({ type: 'highpass', f: 1400, gain: 0.22, dec: 0.08 }); smoke(u.x + Math.cos(a0) * 0.6, u.z + Math.sin(a0) * 0.6, 2, 0.5, 0.4); }
    else SFX.whoosh && SFX.whoosh();
    u.leanT = -0.15;
  }
  return true;
}
// 인주 X: 무기 ↔ 보조 무기
function gearSwapInput(u){
  if (!hit('KeyX') || G.lock || u.lock || u.downed) return false;
  const h = u.hero, off = h.eq.off, main = h.eq.weapon;
  if (!off || itemDef(off).wt === 'shield'){ popText(u.x, u.y + 2.2, u.z, '보조 무기가 없다', 'miss', 0.7); return true; }
  if (main && !ONE_HAND.has(itemDef(main).wt)){ popText(u.x, u.y + 2.2, u.z, '양손 무기는 보조 칸에 못 넣음', 'miss', 0.9); return true; }
  h.eq.weapon = off; h.eq.off = main || null; refreshHero(h);
  popText(u.x, u.y + 2.2, u.z, `바꿔 쥠: ${itemDef(off).n}`, 'aim', 0.9); SFX.clink && SFX.clink(0.4);
  return true;
}
