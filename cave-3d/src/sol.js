/* sol.js v1.3 — (v1.3, v0.86: 방패의 정면 사격 막기 (×0.15) 는 던진 창 · 도끼엔 안 씀 — 던진 무기는 weapons.js 가 막힘 · 튕김 · 부숨 · 박힘을 정함) (v1.2, v0.58: 저장 — 적성 · 보직 · 소지품을 남겨 키움, 레벨마다 훈련 점수 +1 · 소지품 칸 = 동료 배낭 크기) (v1.1, v0.56: 은신 적성 · 돌팔매 (무한) · 사격 규율 아낌/아끼지 않음) (v1.0, v0.55, 탄약 · 소지품 칸 포함) 적성 · 장비 칸 · 무기 바꿔 들기 · 총 / 활 / 마법 규칙 · 보직
   "누구나 보직을 받을 수 있다. 효율은 적성이 정한다"
   · 적성 0~5 (계열 다섯: 근접 · 창과 투척 · 활 · 총 · 마법). 0이면 억지로 쥠 — 조준이 떨리고 (명중 25%) 탄이 걸리기도 함. 5면 고유 기술
   · 성향 (훈련받은 군인 · 마법 계열 · 야수 · 기사 · 싸움꾼)이 훈련 비용을 정함: 잘 맞는 계열은 싸게, 안 맞는 계열은 비싸게
   · 장비 칸: 주무기 (권총 · 소총 · 산탄총 · 활 · 완드) + 근접 (자기 손버릇: 동료 고유 AI) + 방패. 무엇을 들었는지 늘 보임 (쓰는 무기는 손, 아닌 건 등)
   · 바꿔 들기: 적이 2.2칸 안으로 들어오면 원거리를 등에 메고 근접으로 돌입, 3.4칸 넘게 벌어지면 다시 꺼냄. 걸리는 시간은 적성 (만능형일수록 빠름)
   · 총: 피해가 낮음 (괴물에겐 거의 안 먹힘) · 소리가 큼 (둘레 적이 깨어남) · 대신 예고 중인 적을 맞히면 끊음 · 갑옷을 뚫음 · 머리 치명
     날랜 근접 특화 적은 조준을 보면 옆으로 피함 — 우리 편이 붙어 교전 중이면 못 피함 (묶고 쏘기)
     방패 든 적은 정면 사격을 거의 다 막음 (옆 · 뒤로 돌아야)
   · 활: 조용함 · 괴물에 조금 나음 · 갑옷에 약함 / 마법 (완드): 탄약 없음 · 마력을 씀 · 괴물에 잘 통함
   · 보직: 선봉 (먼저 근접으로 나가 자리를 막음) · 사수 (멀리서 · 예고 끊기 우선) · 척후 (옆 · 등으로 돌아 침) · 지원 (쓰러진 동료 먼저, 조장 등 뒤를 지킴) · 지휘 (조원 적성 +1)
   · 인주: 손에 쥔 무기 (가방 · 장비)를 그대로 쓰되, 총 · 마법은 인주의 적성으로 흔들림 */
'use strict';
const FAM = { melee: '근접', spear: '창 · 투척', bow: '활', gun: '총', magic: '마법', stealth: '은신 · 암살' };
const FAMS = Object.keys(FAM);
const APT = {
  spread: [0.46, 0.25, 0.13, 0.07, 0.04, 0.02],   // 조준 흔들림 (라디안)
  crit:   [0.01, 0.03, 0.06, 0.09, 0.13, 0.3],
  swap:   [1.1, 0.8, 0.6, 0.45, 0.3, 0.15],        // 바꿔 들기 (초)
  cdMul:  [1.6, 1.3, 1.12, 1, 0.92, 0.82],
  jam:    [0.15, 0.04, 0, 0, 0, 0],
};
const TAGS = {
  soldier: { n: '훈련받은 군인', cost: { gun: 0.6, bow: 0.8, melee: 1, spear: 0.9, magic: 2, stealth: 1 } },
  mage:    { n: '마법 계열', cost: { magic: 0.6, gun: 3, bow: 1.4, melee: 1.5, spear: 1.5, stealth: 1.4 } },
  beast:   { n: '야수', cost: { melee: 0.6, spear: 1, gun: 3, bow: 2, magic: 1.6, stealth: 0.8 } },
  knight:  { n: '기사', cost: { melee: 0.7, spear: 0.8, bow: 1, gun: 1.5, magic: 2, stealth: 2.2 } },
  brawler: { n: '싸움꾼', cost: { melee: 0.7, gun: 0.9, bow: 1.5, spear: 1.2, magic: 2.5, stealth: 1 } },
};
const ROLES = { vanguard: '선봉', marksman: '사수', scout: '척후', support: '지원', leader: '지휘' };
const ROLE_D = { vanguard: '먼저 근접으로 나가 적의 자리를 막음 · 일찍 칼로 바꿈', marksman: '멀리서 쏨 · 예고 중인 적부터 끊음 · 늦게까지 총을 쥠', scout: '적의 옆 · 등으로 돌아 들어감 · 빠름',
  support: '쓰러진 동료를 먼저 일으킴 (빠르게) · 조장 등 뒤를 지킴', leader: '조장 — 곁 6칸 조원의 적성 +1 · 바꿔 들기 빠름' };
// 인물별 타고난 것 (DEFS 키 기준). 패시브는 실제로 작동함
const SOLP = {
  player:         { apt: { melee: 3, spear: 4, bow: 2, gun: 2, magic: 0, stealth: 3 }, tag: 'soldier', pas: ['작은 몸', '구르기 무적이 조금 김 · 창은 적성 4부터'] },
  cheongAlly:     { apt: { melee: 4, spear: 1, bow: 1, gun: 0, magic: 2, stealth: 4 }, tag: 'beast', pas: ['날쌤', '근접에서 바꿔 들기가 매우 빠름 · 총은 이해 못 함 (0)'] },
  kariusAlly:     { apt: { melee: 5, spear: 2, bow: 0, gun: 2, magic: 0, stealth: 0 }, tag: 'beast', pas: ['괴력', '총 반동을 무시 — 총 적성 페널티 절반'] },
  rebeccaAlly:    { apt: { melee: 4, spear: 3, bow: 2, gun: 1, magic: 0, stealth: 1 }, tag: 'knight', pas: ['불사', '쓰러져도 일어남 · 방패로 잘 막음'] },
  angelAlly:      { apt: { melee: 1, spear: 1, bow: 1, gun: 0, magic: 4, stealth: 1 }, tag: 'mage', art: 'wand', pas: ['천사의 고리', '마력을 절반만 씀 · 마력탄이 한 놈을 꿰뚫음'] },
  goldknightAlly: { apt: { melee: 4, spear: 3, bow: 2, gun: 1, magic: 0, stealth: 0 }, tag: 'knight', pas: ['철벽', '방패를 들면 정면 피해 70% 감소 · 곁의 적이 금기사를 먼저 노림'] },
  gangsterAlly:   { apt: { melee: 3, spear: 1, bow: 1, gun: 3, magic: 0, stealth: 2 }, tag: 'brawler', pas: ['막싸움 권총', '3칸 안에서 총 명중 크게 오름 · 바꿔 들기 즉시'] },
};
// 원거리 무기 (동료가 듦). 피해는 낮게 · 대신 쓸모가 분명하게
const RW = {
  pistol:  { n: '권총', fam: 'gun', ammo: 'bullet', item: 'W-pistol', range: 9, cd: 0.62, dmg: 9, speed: 40, loud: 12 },
  rifle:   { n: '소총', fam: 'gun', ammo: 'bullet', item: 'W-lever', range: 15, cd: 1.35, dmg: 20, speed: 58, loud: 16, pierceArmor: 1 },
  shotgun: { n: '산탄총', fam: 'gun', ammo: 'shell', item: 'W-shotgun', range: 6, cd: 1.25, dmg: 6, pellets: 6, cone: 0.32, speed: 34, loud: 14, kb: 0.9 },
  bow:     { n: '활', fam: 'bow', ammo: 'arrow', item: 'W-bow', range: 12, cd: 1.1, dmg: 13, speed: 26, loud: 2, tip: 1 },
  sling:   { n: '돌팔매 (무한)', fam: 'spear', range: 8, cd: 0.95, dmg: 6, speed: 22, loud: 3, inf: 1 },   // 돌은 어디에나 — 약하지만 끝없이
  wand:    { n: '완드', fam: 'magic', item: 'EW13', range: 10, cd: 0.9, dmg: 15, speed: 17, loud: 4, mp: 4 },
};
const SHIELD_ITEM = 'W-shield';
/* 탄약 · 소지품 칸: 각자 들 수 있는 양이 정해져 있음 (한 칸 = 총알 20 · 화살 30 · 산탄 8). 칸 수는 덩치 (무게)로 — 소천사녀 5칸 · 카리우스 10칸, 군인은 +1
   화살은 굴에서 일꾼이 깎음 (조잡함) · 총알 · 산탄은 굴에서 못 만듦: 상점에서 쟁여 두거나 원정에서 주움. 다 쓰면 근접으로만 */
const AMMO_SLOT = { bullet: 20, arrow: 30, shell: 8 };
const AMMO_KN = { bullet: '총알', arrow: '화살', shell: '산탄' };
const SOLAMMO = { inf: false };
// v1.2 소지품 칸 = 그 인물의 배낭 크기 (rpg.js BAG_CAP · 인주는 가방)
const PACK_HERO = { player: 'inju', cheongAlly: 'cheong', kariusAlly: 'karius', rebeccaAlly: 'rebecca', angelAlly: 'angel', goldknightAlly: 'goldknight', gangsterAlly: 'gangster', goodwillAlly: 'goodwill' };
const packSlots = u => { const k = PACK_HERO[u.kind]; if (k === 'inju') return bagCap(); if (k && BAG_CAP[k]) return BAG_CAP[k]; return Math.min(10, Math.max(4, Math.round(4 + (u.D.weight || 60) / 40))) + (u.sol && u.sol.tag === 'soldier' ? 1 : 0); };
const packUsed = u => Object.entries(u.sol.ammo).reduce((s, [k, n]) => s + Math.ceil(n / AMMO_SLOT[k]), 0);
function packAdd(u, k, slots){   // 한 칸씩 넣고 빼기
  const S = u.sol, cap = packSlots(u);
  if (slots > 0){ if (packUsed(u) >= cap) return false; S.ammo[k] = (Math.ceil(S.ammo[k] / AMMO_SLOT[k]) + 1) * AMMO_SLOT[k]; return true; }
  if (S.ammo[k] <= 0) return false; S.ammo[k] = Math.max(0, (Math.ceil(S.ammo[k] / AMMO_SLOT[k]) - 1) * AMMO_SLOT[k]); return true;
}
function packFill(u){ const R = RW[u.sol.kit.main]; if (!R || !R.ammo) return; while (packAdd(u, R.ammo, 1)); }
const ammoOk = u => { const R = RW[u.sol.kit.main]; return !R || !R.ammo || SOLAMMO.inf || u.sol.ammo[R.ammo] > 0; };
// 적의 결 (약점): 총은 갑옷을 뚫지만 괴물엔 안 먹힘, 마법 · 칼은 괴물에 잘 통함. 날랜 놈은 피함, 방패는 정면을 막음
const TRAIT = { catw: 'dodger', gwangnyang: 'dodger', bogwang: 'dodger', archer: 'dodger',
  bk: 'armored', bkShield: 'armored', bkSpear: 'armored', cs: 'armored', axeKnight: 'armored', shieldman: 'armored', swordsman: 'armored', spearman: 'armored',
  bluefat: 'monster', slimeGirl: 'monster', eyemon: 'monster', janggun: 'monster', jakyak: 'monster', brute: 'monster', drillCaster: 'monster' };
const TRAIT_N = { dodger: '날램 (조준을 보면 피함)', armored: '갑옷 (총이 잘 뚫음 · 활은 튕김)', monster: '괴물 (총이 거의 안 먹힘 · 마법 · 칼이 잘 통함)' };
const TRAIT_MUL = { armored: { gun: 1.25, bow: 0.65, magic: 1, melee: 0.9, spear: 1 }, monster: { gun: 0.4, bow: 0.7, magic: 1.5, melee: 1.2, spear: 1.1 }, dodger: { gun: 1, bow: 1, magic: 1, melee: 1, spear: 1 } };
const SOLS = { shots: 0, hits: 0, cuts: 0, dodged: 0, blocked: 0, weak: 0, jams: 0, swaps: 0, combos: 0, revives: 0 };

/* ---------- 인물에 붙이기 ---------- */
function solKey(u){ return u.kind === 'player' ? 'player' : u.kind; }
function solInit(u, o = {}){
  const P0 = SOLP[solKey(u)] || { apt: { melee: 2, spear: 1, bow: 1, gun: 1, magic: 0, stealth: 1 }, tag: 'soldier', pas: ['—', ''] };
  u.sol = { base: { ...P0.apt }, train: { melee: 0, spear: 0, bow: 0, gun: 0, magic: 0, stealth: 0 }, tag: P0.tag, pas: P0.pas, kit: { main: o.main || null, shield: !!o.shield }, role: o.role || 'vanguard', sq: o.sq ?? 1,
    mode: 'melee', swapT: 0, cd: rnd(0.2, 0.8), mp: 30, mpMax: 30, stat: { shots: 0, hits: 0, cuts: 0 }, pts: 8, ammo: { bullet: 0, arrow: 0, shell: 0 } };
  const R0 = RW[u.sol.kit.main]; if (R0 && R0.ammo){ packAdd(u, R0.ammo, 1); packAdd(u, R0.ammo, 1); }   // 처음엔 두 칸
  solGear(u); return u.sol;
}
const aptOf = (u, f) => Math.min(5, (u.sol ? u.sol.base[f] + u.sol.train[f] : (SOLP[solKey(u)] || { apt: {} }).apt[f] ?? 2));
// 실제로 쓰는 적성: 지휘 보정 (+1) · 카리우스 괴력 (총 페널티 절반)
function aptEff(u, f){
  let a = aptOf(u, f) + (u.sol && u.sol.lead ? 1 : 0);
  if (f === 'gun' && u.kind === 'kariusAlly') a = a + (5 - a) / 2;
  return Math.max(0, Math.min(5, a));
}
// 훈련 비용: 한 단계 올리는 데 (새 단계 × 성향 배율), 반올림
function trainCost(u, f){ const T = TAGS[u.sol.tag] || TAGS.soldier, next = aptOf(u, f) + 1; return Math.max(1, Math.round(next * (T.cost[f] ?? 1))); }
function solTrain(u, f, dir){
  const S = u.sol; if (!S) return false;
  if (dir > 0){ if (aptOf(u, f) >= 5) return false; const c = trainCost(u, f); if (S.pts < c) return false; S.pts -= c; S.train[f]++; return true; }
  if (S.train[f] <= 0) return false; S.train[f]--; S.pts += trainCost(u, f); return true;
}
const ix = (t, a) => t[Math.max(0, Math.min(5, Math.round(a)))];

/* ---------- 보이는 무기 (손 · 등) ---------- */
const solItemDef = id => ITEMS[id] || null;
function solGear(u){
  if (u.solG){ u.pivot.remove(u.solG.g); u.solG = null; }
  if (!u.sol || u.kind === 'player') return;
  const g = new THREE.Group(), K = u.sol.kit; let main = null, sh = null;
  const own = (SOLP[solKey(u)] || {}).art === K.main;   // 그림에 이미 들고 있음 (소천사녀의 지팡이)
  if (K.main && RW[K.main] && !own){ const d = solItemDef(RW[K.main].item); main = d && typeof makeHeldMesh === 'function' ? makeHeldMesh(d) : null; if (main){ const w = new THREE.Group(); w.add(main); g.add(w); main = w; } }
  if (K.shield){ const d = solItemDef(SHIELD_ITEM); sh = d && typeof makeHeldMesh === 'function' ? makeHeldMesh(d) : null; if (sh){ const w = new THREE.Group(); w.add(sh); g.add(w); sh = w; } }
  u.pivot.add(g); u.solG = { g, main, sh };
}
function solGearTick(u){
  const V = u.solG; if (!V) return;
  const hide = u.dead || u.downed || u.lying || u.lock; V.g.visible = !hide; if (hide) return;
  const H = bodyH(u), f = u.face || 1, s = Math.sqrt(u.S.tall / 1.7), ranged = u.sol.mode === 'ranged' && u.sol.swapT <= 0;
  if (V.main){
    const m = V.main; m.scale.set(f * s, s, s);
    const up = RW[u.sol.kit.main] && RW[u.sol.kit.main].fam === 'magic';
    if (ranged){ m.position.set(f * 0.14 * H, (up ? 0.4 : 0.52) * H, 0.06); m.rotation.z = f * ((up ? 1.25 : 0.04) + (u.solKick > G.t ? 0.25 : 0)); if (up) m.scale.multiplyScalar(0.75); }   // 손에 (쏠 때 반동, 지팡이는 세움)
    else { m.position.set(-f * 0.06 * H, 0.66 * H, -0.05); m.rotation.z = f * -1.05; }   // 등에 멤
  }
  if (V.sh){ const m = V.sh; m.scale.set(f * s * 0.9, s * 0.9, s); m.position.set(f * (ranged ? -0.12 : 0.1) * H, 0.45 * H, ranged ? -0.05 : 0.07); m.rotation.z = 0; }
}

/* ---------- 쏘기 ---------- */
// 소리: 둘레의 적이 깨어남 (벽 너머도). 총은 큼, 활은 거의 없음
function solNoise(x, z, r, by){
  if (r < 3) return;
  for (const e of G.units) if (e.side === 'enemy' && !e.dead && !e.alert && Math.hypot(e.x - x, e.z - z) < r){ alertGroup(e, by || G.player); if (G.mode === 'drill') popText(e.x, e.y + bodyH(e) + 0.4, e.z, '총소리!', 'alert', 0.8); }
}
// 교전 중 = 우리 편이 붙어 있음 (그러면 날랜 놈도 못 피함)
const engagedBy = e => G.units.some(a => a.side === 'ally' && !a.dead && !a.downed && dist(a, e) < 1.9 + e.r);
function solDodge(e, shooter, apt){
  if (!e || e.dead || e.D.boss || TRAIT[e.kind] !== 'dodger' || e.lying || e.lock || e.st === 'windup' || e.st === 'strike' || e.st === 'hurt' || engagedBy(e)) return false;
  if (G.t < (e.dodgeCd || 0) || Math.random() > 0.62 - apt * 0.05) return false;
  e.dodgeCd = G.t + 1.1;
  const a0 = Math.atan2(e.z - shooter.z, e.x - shooter.x); let a = a0 + (Math.random() < 0.5 ? 1.57 : -1.57);
  if (solidAt(G.map, e.x + Math.cos(a) * 1.4, e.z + Math.sin(a) * 1.4)) a = a0 * 2 - a;
  typeof ghost === 'function' && ghost(e); moveBy(e, Math.cos(a) * 1.4, Math.sin(a) * 1.4); dust(e.x, e.z, 5);
  popText(e.x, e.y + bodyH(e) + 0.3, e.z, '휙 — 피함', 'miss', 0.8); SOLS.dodged++;
  return true;
}
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
function solShoot(u, tgt){
  const S = u.sol, R = RW[S.kit.main], f = R.fam, apt = aptEff(u, f), d = dist(u, tgt);
  if (R.ammo && !SOLAMMO.inf){ if (S.ammo[R.ammo] <= 0){ S.mode = 'melee'; S.cd = 1; if (!S.noAmmoSaid){ S.noAmmoSaid = true; popText(u.x, u.y + bodyH(u) + 0.4, u.z, `${AMMO_KN[R.ammo]} 다 씀 — 근접으로`, 'miss', 1.3); } return; } S.ammo[R.ammo]--; S.noAmmoSaid = false; }
  if (f === 'gun' && Math.random() < ix(APT.jam, apt)){ S.cd = 1.4; popText(u.x, u.y + bodyH(u) + 0.4, u.z, '탄 걸림!', 'miss', 0.9); SOLS.jams++; return; }
  if (f === 'magic'){ const cost = R.mp * (u.kind === 'angelAlly' ? 0.5 : 1); if (S.mp < cost){ S.cd = 0.8; if (!S.mpSaid){ S.mpSaid = true; popText(u.x, u.y + bodyH(u) + 0.4, u.z, '마력이 바닥남', 'miss', 1); } return; } S.mp -= cost; S.mpSaid = false; }
  if (apt <= 0 && !S.awk){ S.awk = true; popText(u.x, u.y + bodyH(u) + 0.5, u.z, '…? (이건 어떻게 쓰는 거지)', 'miss', 1.4); }
  solDodge(tgt, u, apt);
  let spread = ix(APT.spread, apt) * (d > R.range * 0.6 ? 1.4 : 1);
  if (u.kind === 'gangsterAlly' && f === 'gun' && d < 3.2) spread *= 0.35;   // 막싸움 권총
  const a0 = Math.atan2(tgt.z - u.z, tgt.x - u.x), y0 = u.y + bodyH(u) * 0.6, n = R.pellets || 1;
  const pierce = u.kind === 'angelAlly' && f === 'magic' ? 1 : f === 'bow' && apt >= 5 ? 2 : 0, shot = { hit: false };
  for (let i = 0; i < n; i++){
    const a = a0 + gauss() * spread + (n > 1 ? (i - (n - 1) / 2) * R.cone / (n - 1) : 0);
    let left = pierce;
    shoot({ x: u.x + Math.cos(a) * 0.4, y: y0, z: u.z + Math.sin(a) * 0.4, a, speed: R.speed, range: R.range + 1, side: u.side, len: f === 'magic' ? 0.32 : R.tip ? 0.7 : 0.35, tip: R.tip, thick: f === 'magic' ? 0.09 : 0.04,
      color: f === 'magic' ? 0xc8a0ff : R.tip ? 0xd8c8a8 : f === 'spear' ? 0x9a948a : 0xffe08a, glow: f === 'magic' ? 0xa070ff : f === 'gun' ? 0xffc860 : undefined, hitsAir: true, dy: aimDy(u.x, y0, u.z, tgt, R.speed), pierce: pierce || undefined,
      onHit: (p, t) => { if (!shot.hit){ shot.hit = true; S.stat.hits++; SOLS.hits++; } const crit = Math.random() < ix(APT.crit, apt); hurt(u, t, R.dmg + u.atk * 0.3, { from: { x: p.x - Math.cos(p.a), z: p.z - Math.sin(p.a) }, ranged: true, fam: f, crit: crit || undefined, critMul: crit && apt >= 5 && f === 'gun' ? 2.6 : undefined, kb: R.kb, pierceArmor: R.pierceArmor }); if (crit) popText(t.x, t.y + bodyH(t) + 0.5, t.z, f === 'gun' ? '헤드샷' : '급소', 'crit', 0.8); } });
  }
  S.stat.shots++; SOLS.shots++;
  S.cd = R.cd * ix(APT.cdMul, apt) * (S.role === 'marksman' ? 0.9 : 1);
  u.solKick = G.t + 0.12; u.leanT = -0.12;
  spark(u.x + Math.cos(a0) * 0.5, y0, u.z + Math.sin(a0) * 0.5, f === 'magic' ? 0xc8a0ff : 0xffd080, f === 'gun' ? 7 : 3, 3);
  if (f === 'gun'){ SFX.burst({ type: 'highpass', f: 1300, gain: 0.2, dec: 0.08 }); smoke(u.x + Math.cos(a0) * 0.6, u.z + Math.sin(a0) * 0.6, 2, 0.5, 0.4); }
  else SFX.whoosh && SFX.whoosh();
  solNoise(u.x, u.z, R.loud, u);
}
// 원거리로 싸움 (true = 이번 프레임은 여기서 다 함). 자리 잡기는 보직이 정함
function solRanged(u, dt, tgt){
  const S = u.sol, R = RW[S.kit.main]; if (!R || !tgt) return false;
  const d = dist(u, tgt), see = sees(u, tgt);
  const want = S.role === 'marksman' ? R.range * 0.72 : S.role === 'scout' ? R.range * 0.45 : R.range * 0.55;
  u.moving = false;
  if (!see || d > R.range * 0.95) navTo(u, tgt.x, tgt.z, u.spd, dt, Math.max(2.5, want));
  else if (d < want * 0.55 && d > 2.2){ const n = norm(u.x - tgt.x, u.z - tgt.z); steerTo(u, u.x + n.x * 2, u.z + n.z * 2, u.spd * 0.8, dt); }
  setAim(u, tgt.x, tgt.z);
  S.cd -= dt;
  const hold = S.fire === 'save' && R.ammo && !SOLAMMO.inf && !shotWorth(tgt);   // 아낌: 쏠 만한 놈에게만
  if (S.cd <= 0 && see && d <= R.range && !hold) solShoot(u, tgt);
  setPose(u, u.S.poses.shoot ? 'shoot' : u.S.poses.aim ? 'aim' : u.moving ? (u.S.poses.walk ? 'walk' : 'idle') : 'idle');
  return true;
}
// 사격 규율 '아낌': 예고 중 · 궁수 · 주술사 · 거의 죽은 놈 · 누운 놈 · 묶인 날랜 놈에게만 쏨 (탄약이 귀하니까). 마나 · 돌팔매처럼 끝없는 무기는 상관없음
const shotWorth = t => t.st === 'windup' || !!t.D.bow || t.kind === 'drillCaster' || t.hp < t.max * 0.3 || !!t.lying || (TRAIT[t.kind] === 'dodger' && engagedBy(t));
// 바꿔 들기: 원거리 ↔ 근접. 가까우면 근접 돌입, 멀어지면 다시 꺼냄
function solSwitch(u, dt, near){
  const S = u.sol; if (!S.kit.main || !ammoOk(u)){ S.mode = 'melee'; return; }
  if (S.swapT > 0){ S.swapT -= dt; return; }
  const inAt = (S.role === 'vanguard' ? 3.6 : S.role === 'marksman' ? 1.6 : 2.2) + (S.fire === 'save' && !SOLAMMO.inf && RW[S.kit.main].ammo ? 1 : 0), outAt = S.role === 'vanguard' ? 5.5 : 3.4;
  const want = S.mode === 'ranged' ? (near < inAt ? 'melee' : 'ranged') : (near > outAt ? 'ranged' : 'melee');
  if (want === S.mode) return;
  const a = Math.max(aptEff(u, RW[S.kit.main].fam), aptEff(u, 'melee'));
  S.swapT = u.kind === 'gangsterAlly' || (u.kind === 'cheongAlly' && want === 'melee') ? 0.05 : ix(APT.swap, a) * (S.lead ? 0.7 : 1);
  S.mode = want; SOLS.swaps++;
  popText(u.x, u.y + bodyH(u) + 0.3, u.z, want === 'melee' ? (S.kit.shield ? '칼 · 방패!' : '근접!') : `${RW[S.kit.main].n}!`, 'aim', 0.6);
  SFX.clink && SFX.clink(0.35);
}

/* ---------- 피해 규칙 (모든 판) ---------- */
const _hurtSol = hurt;
hurt = function(att, tgt, base, o = {}){
  if (!tgt || tgt.dead || !(typeof SQ !== 'undefined' && SQ.on)) return _hurtSol(att, tgt, base, o);   // 새 규칙은 훈련장에서만 (확정되면 모든 판으로)
  let fam = o.fam;
  if (!fam && att && att === G.player && o.ranged && typeof W !== 'undefined' && W.def) fam = W.def.cls === 'magic' ? 'magic' : W.def.cls === 'bow' ? 'bow' : 'gun';
  if (!fam && att && att.side === 'ally' && !o.ranged && !o.dot) fam = 'melee';
  const tr = TRAIT[tgt.kind];
  if (fam && tr && TRAIT_MUL[tr] && att && att.side !== tgt.side){
    let k = TRAIT_MUL[tr][fam] ?? 1; if (o.pierceArmor && tr === 'armored') k *= 1.15;
    base *= k;
    if (k >= 1.2 && (tgt.weakSaid || 0) < G.t){ tgt.weakSaid = G.t + 1.5; popText(tgt.x, tgt.y + bodyH(tgt) + 0.6, tgt.z, '약점!', 'crit', 0.7); SOLS.weak++; }
    else if (k <= 0.5 && (tgt.weakSaid || 0) < G.t){ tgt.weakSaid = G.t + 1.5; popText(tgt.x, tgt.y + bodyH(tgt) + 0.6, tgt.z, fam === 'gun' ? '총이 안 먹힘' : '안 먹힘', 'miss', 0.8); }
  }
  // 방패: 정면 사격을 거의 다 막음
  const shieldy = tgt.D.block || (tgt.sol && tgt.sol.kit.shield && tgt.sol.mode === 'melee');
  if (o.ranged && shieldy && att && !o.thrown){ const s = o.from || att, front = Math.abs(angDiff(Math.atan2(s.z - tgt.z, s.x - tgt.x), tgt.aim ?? 0)) < 1.1; if (front){ base *= 0.15; spark(tgt.x, tgt.y + 1.1, tgt.z, 0xd8e8ff, 8, 4); if ((tgt.blkSaid || 0) < G.t){ tgt.blkSaid = G.t + 1; popText(tgt.x, tgt.y + bodyH(tgt) + 0.4, tgt.z, '방패에 막힘', 'miss', 0.7); } SOLS.blocked++; } }
  // 금기사 철벽: 방패를 든 채 정면이면 70% 감소
  if (tgt.kind === 'goldknightAlly' && tgt.sol && tgt.sol.kit.shield && !o.pierce){ const s = o.from || att; if (s && Math.abs(angDiff(Math.atan2(s.z - tgt.z, s.x - tgt.x), tgt.aim ?? 0)) < 1.2){ base *= 0.3; spark(tgt.x + Math.cos(tgt.aim) * 0.4, tgt.y + 1, tgt.z + Math.sin(tgt.aim) * 0.4, 0xffe8a0, 6, 3); } }
  const wasWind = tgt.st === 'windup' && tgt.side === 'enemy';
  const dmg = _hurtSol(att, tgt, base, o);
  // 예고 끊기: 원거리로 예고 중인 놈을 맞히면 끊김 (보스 · 아주 무거운 놈은 안 됨)
  if (dmg > 0 && o.ranged && wasWind && att && att.side === 'ally' && !tgt.dead && !tgt.D.boss && !tgt.D.heavy){
    interrupt(tgt); tgt.st = 'hurt'; tgt.stT = 0.4; setPose(tgt, 'hurt'); tgt.gunStag = G.t + 1.3;
    popText(tgt.x, tgt.y + bodyH(tgt) + 0.7, tgt.z, '끊김!', 'crit', 0.9); SOLS.cuts++; if (att.sol) att.sol.stat.cuts++;
  }
  return dmg;
};
// 인주: 총 · 마법도 인주 적성으로 흔들림 · 총소리
if (typeof fireGun === 'function'){
  const _fireGunS = fireGun;
  fireGun = function(u, w, tgt, o = {}){
    if (u === G.player && typeof SQ !== 'undefined' && SQ.on){
      const apt = aptEff(u, w.cls === 'magic' ? 'magic' : 'gun');
      o = { ...o, spread: (o.spread ?? (w.spread || 0)) + ix(APT.spread, apt) * 0.55 };
      if (tgt) solDodge(tgt, u, apt);
      solNoise(u.x, u.z, w.pellets ? 14 : 13, u);
    }
    return _fireGunS(u, w, tgt, o);
  };
}
TICKS.push(dt => {
  for (const u of G.units){
    if (!u.sol) continue;
    solGearTick(u);
    u.sol.mp = Math.min(u.sol.mpMax, u.sol.mp + dt * 1.6);
  }
});

/* ---------- v1.2 저장: 적성 훈련 · 보직 · 조 · 사격 규율 · 경계 · 무기 · 소지품을 남겨 키워 감 (RPG.sol, 인물 종류마다)
   훈련 점수 = 8 + (영웅 레벨 − 1). 쓴 만큼 (spent) 저장 ---------- */
const SOL_HERO = { player: 'inju', cheongAlly: 'cheong', kariusAlly: 'karius', rebeccaAlly: 'rebecca' };
const solLvBonus = u => { const k = SOL_HERO[u.kind]; return k && RPG.heroes[k] ? Math.max(0, (RPG.heroes[k].lv || 1) - 1) : 0; };
function solSave(u){ if (!u.sol) return; const S = u.sol; RPG.sol = RPG.sol || {}; RPG.sol[solKey(u)] = { train: { ...S.train }, role: S.role, sq: S.sq, fire: S.fire || 'free', watch: !!S.watch, kit: { ...S.kit }, spent: S.spent || 0, ammo: { ...S.ammo } }; }
function solSaveAll(){ for (const u of G.units) if (u.sol) solSave(u); if (typeof saveRpg === 'function') saveRpg(); }
{
  const _solInitS = solInit;
  solInit = function(u, o = {}){
    const s = RPG.sol && RPG.sol[solKey(u)];
    const S = _solInitS(u, s ? { ...o, main: s.kit.main, shield: s.kit.shield, role: s.role, sq: s.sq } : o);
    if (s){ S.train = { ...S.train, ...s.train }; S.fire = s.fire; S.watch = s.watch; S.spent = s.spent || 0; S.ammo = { ...S.ammo, ...s.ammo }; }
    S.pts = 8 + solLvBonus(u) - (S.spent || 0);
    return S;
  };
  const _solTrainS = solTrain;
  solTrain = function(u, f, dir){ const r = _solTrainS(u, f, dir); if (r && u.sol){ u.sol.spent = 8 + solLvBonus(u) - u.sol.pts; solSaveAll(); } return r; };
}
