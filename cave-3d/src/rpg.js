/* rpg.js v1.21 — RPG 핵심. v1.21: 카리우스 설명에 개조된 신체 · 무기 칸 둘. v1.2: 카리우스 — 보조 칸에 아무 무기 (둘 다 공격에 더함) · 몸 · 다리 갑옷 불가. v1.1: 보조 칸 (방패 · 한손 보조무기) · 영웅 고유 무기 · 영웅마다 쓸 수 있는 무기 · 동료도 무기 공격력이 먹힘
   영웅 기록 (레벨 · 경험 · 속성 다섯 · 장비 여섯 칸 · 체력 · 정신도) · 아이템 (등급 · 품질 · 덧붙은 효과) · 공용 가방 · 굴 보관함
   파생 수치 (스탯이 실제로 먹힘) · 피해 공식 (방어 · 회피 · 치명 · 흡혈 · 가시 · 상태 이상) · 경험 · 레벨업 · 저장 (localStorage)
   ITEMS (data_items.js)를 씀. 피해는 units.js의 hurt를 한 겹 감쌈 */
'use strict';
const RAR = [
  { n: '낡은', c: '#8f8a84' }, { n: '평범한', c: '#e9e3d6' }, { n: '좋은', c: '#62d46e' }, { n: '명품', c: '#4fa8ff' },
  { n: '영웅', c: '#b673ff' }, { n: '전설', c: '#ffc23a' }, { n: '보스', c: '#ff3b3b' }];
const ATTR_N = { str: '힘', dex: '민첩', vit: '체력', wil: '정신', per: '감각' };
const ATTR_D = { str: '근접 공격 · 휘청 버팀', dex: '공격 속도 · 회피 · 활 · 자물쇠', vit: '최대 체력 (+8)', wil: '정신도 (+3) · 스킬 대기', per: '시야 · 치명 · 총 · 함정 발견' };
const SLOT_N = { weapon: '무기', off: '보조', head: '머리', body: '몸', legs: '다리', acc1: '장신구', acc2: '장신구' };
const SLOTS = ['weapon', 'off', 'head', 'body', 'legs', 'acc1', 'acc2'];
const ONE_HAND = new Set(['sword', 'dagger', 'axe', 'hammer', 'pistol', 'spear']);   // 보조 칸에 들 수 있는 무기 (방패는 보조 칸 전용)
const RANGED = new Set(['bow', 'crossbow', 'pistol', 'shotgun', 'lever', 'assault']);
const WT_N = { spear: '창', sword: '검', greatsword: '대검', dagger: '단검', axe: '도끼', hammer: '망치', shield: '방패', staff: '지팡이', bow: '활', crossbow: '석궁', pistol: '권총', shotgun: '산탄총', lever: '레버액션', assault: '돌격소총' };
const CAT_N = { weapon: '무기', armor: '방어구', acc: '장신구', relic: '유물', use: '소모품', potion: '물약', food: '식량', ammo: '탄약', ammoRaw: '탄약', gold: '돈', mat: '재료', tool: '도구', key: '열쇠', book: '책 · 지도', light: '빛', junk: '잡동사니', furn: '가구 유물', pet: '펫' };
// 효과 이름 (툴팁): [이름, 단위]
const FX_N = {
  atk: ['공격', ''], atkP: ['공격', '%'], def: ['방어', ''], defP: ['방어', '%'], hp: ['체력', ''], hpP: ['체력', '%'], crit: ['치명', '%'], critDmg: ['치명 피해', '%'],
  eva: ['회피', '%'], spd: ['이동', '%'], atkSpd: ['공격 속도', '%'], vision: ['시야', '%'], sanity: ['정신도', ''], sanDrain: ['정신도 감소', '%'], mood: ['굴 무드', ''],
  regen: ['초당 회복', ''], lifesteal: ['흡혈', '%'], thorns: ['가시', ''], reflectP: ['되돌림', '%'], block: ['막기', '%'], shield: ['푸른 체력', ''], shieldRegen: ['푸른 체력 재생', '/초'],
  gunP: ['총 피해', '%'], magic: ['마력탄', '%'], holyP: ['신성 피해', '%'], seaAtk: ['물 · 비 층 공격', ''], seaAtkP: ['물 · 비 층 공격', '%'], holy: ['신성 고정 피해', ''],
  fist: ['주먹 피해', '%'], backstab: ['등 뒤 피해', '%'], armorPierce: ['방어 무시', '%'], skillCd: ['스킬 대기', '-%'], reload: ['재장전', '-%'], carry: ['가방 칸', ''],
  str: ['힘', ''], dex: ['민첩', ''], vit: ['체력 속성', ''], wil: ['정신', ''], per: ['감각', ''], luck: ['행운', '%'], goldPick: ['금화 보너스', ''], rally: ['동료 공격', '%'],
  rangedCrit: ['원거리 치명', '%'], stagger: ['휘청', '%'], reach: ['사거리', '%'], arc: ['휘두름 폭', '%'], dodgeCd: ['구르기 대기', '-%'], jump: ['점프', '%'], restHeal: ['쉬기 회복', '%'],
  critMark: ['치명 표식', '%'], mark: ['강적 표식', '%'], aurora: ['첫 싸움 공격', '%'], redThread: ['붉은 실', '%'], keySave: ['열쇠 아낌', '%'], pick: ['자물쇠 따기', '%'], potionP: ['물약 효과', '%'], trapDmg: ['함정 피해', '%'],
};
const FX_FLAG = {   // 값 없이 켜지는 효과
  poisonImmune: '중독 면역', fireImmune: '화상 면역', shockImmune: '감전 면역', drownImmune: '물 면역', knockImmune: '밀리지 않음', radar: '지도에 적', stairs: '계단 방향', ropeDir: '귀환 줄 방향',
  floorMap: '층 지도', trapSense: '함정이 보임', ambushSense: '매복을 알아챔', lootPlus: '시체에서 하나 더', crow: '다음 방 미리 봄', boomerang: '던지면 돌아옴', swordWave: '검기', laserSkill: '발용의 레이저',
  throwBoom: '투척 폭발', oneShot: '한 발 장전', laserGun: '광선 (꿰뚫음)', explode: '폭발탄', knock: '크게 밀침', dig: '파기', stones: '돌멩이 (탄 무한)', rainDef: '화살 막음',
  throwFast: '빠른 투척', hookPull: '끌어당김', hookCrit: '치명타가 끌어당김', enemyInfo: '적 정보', drill: '드릴', deepStairs: '두 층 아래로', egg: '알', sealed: '봉인', outfit: '한 벌 옷',
  potionFloor: '층마다 물약', revive: '되살아남', reviveBurn: '불꽃 부활', escape: '탈출', unlock: '강제 개방', serum: '혈청', perm: '영구 강화', summon: '소환', pet: '펫', set: '세트', sell: '비싸게 팔림',
  nightSan: '밤마다 정신도', curseDoll: '저주 인형', quick: '소모품 칸 +1', potions: '물약 셋', thornsBleed: '맞으면 출혈', magicTriple: '세 갈래 마력탄', raidLess: '습격 줄임', shopDisc: '상점 할인', lore: '이야기',
  wetVision: '물 · 비 층 시야', seaSpd: '물 · 비 층 이동', bleedBonus: '출혈 적 추가 피해', ambush: '매복', dodge: '구르기', seaDef: '물 방어', sanHeal: '정신도 회복', torch: '횃불',
};
// 무작위로 덧붙는 효과 (w 무기 · a 방어구 · j 장신구 · g 총만). v: 1등급 값 범위 (등급마다 커짐)
const AFX = {
  atkP: { v: [4, 9], s: 'wj' }, crit: { v: [2, 5], s: 'wj' }, critDmg: { v: [10, 25], s: 'w' }, atkSpd: { v: [4, 9], s: 'wj' },
  bleedHit: { v: [10, 22], s: 'w', st: true }, burnHit: { v: [8, 16], s: 'w', st: true }, slowHit: { v: [10, 20], s: 'w', st: true }, lifesteal: { v: [2, 4], s: 'wj' },
  armorPierce: { v: [10, 25], s: 'w' }, str: { v: [1, 3], s: 'waj' }, dex: { v: [1, 3], s: 'waj' }, vit: { v: [1, 3], s: 'aj' }, wil: { v: [1, 3], s: 'aj' }, per: { v: [1, 3], s: 'waj' },
  hp: { v: [8, 20], s: 'aj' }, def: { v: [2, 5], s: 'aj' }, eva: { v: [2, 4], s: 'aj' }, sanity: { v: [5, 10], s: 'aj' }, regen: { v: [0.2, 0.5], s: 'aj', f: 1 },
  vision: { v: [6, 14], s: 'aj' }, spd: { v: [3, 6], s: 'aj' }, thorns: { v: [3, 8], s: 'a' }, reload: { v: [10, 20], s: 'g' }, sanDrain: { v: [-8, -15], s: 'aj' },
};
const AFX_N = { 0: 0, 1: 0, 2: 1, 3: 1, 4: 2, 5: 3, 6: 2 };
const GUNS = new Set(['pistol', 'shotgun', 'lever', 'assault']);
const MELEE = new Set(['spear', 'sword', 'greatsword', 'dagger', 'axe', 'hammer', 'shield']);
const AMMO_OF = { bow: 'arrow', crossbow: 'arrow', pistol: 'bullet', lever: 'bullet', assault: 'bullet', shotgun: 'shell' };
const AMMO_N = { arrow: '화살', bullet: '총알', shell: '산탄', cell: '광선' };

// 영웅 (v0.30: 지금 굴에 있는 사람). unit = DEFS 종류
const HERO_DEF = {
  // innate: 고유 무기 (칸이 비면 이걸로 싸움, 벗길 수 없음) · wts: 들 수 있는 무기 (shield = 보조 칸 방패)
  inju:   { name: '인주', unit: 'player', face: 'assets/inju_face.png', attr: { str: 5, dex: 6, vit: 5, wil: 5, per: 6 }, hp0: 80, weapon: 'O-player-weapon', note: '말이 없음. 든 무기로 싸움', innate: '맨손', wts: 'all' },
  cheong: { name: '청광묵', unit: 'cheongAlly', face: 'art/pro/goblin_face.webp', attr: { str: 7, dex: 6, vit: 6, wil: 3, per: 4 }, note: '단순 · 충직. 달팽이를 사랑함. 손톱 · 손바닥', innate: '청광묵의 손톱', wts: ['dagger', 'sword', 'axe', 'spear', 'bow', 'crossbow', 'pistol', 'shield'] },
  karius: { name: '카리우스', unit: 'kariusAlly', face: 'art/pro/karius_face.webp', attr: { str: 9, dex: 2, vit: 9, wil: 6, per: 2 }, note: '침묵. 땅만 팜. 개조된 신체 — 모든 피해 60% 감소 · 상태 이상 절반. 무기 칸 둘 · 갑옷은 못 입음 (투구는 됨)', innate: '카리우스의 손 (여덟 팔)', wts: ['hammer', 'axe', 'greatsword', 'shield'] },
};

const RPG = {
  heroes: {}, bag: [], stash: [], gold: 0, ammo: { arrow: 0, bullet: 0, shell: 0, cell: 0 }, quick: [null, null, null, null], uid: 0,
  party: ['inju'], depth: 0, trips: 0, lost: null, meta: { shortcut: 0, seen: {} }, ver: 1,
};
const itemDef = it => ITEMS[it.id] || ITEMS['W-spear'];
const rarOf = it => (it.r != null ? it.r : itemDef(it).r) || 0;
const rarCol = it => RAR[Math.min(6, rarOf(it))].c;
const isGear = d => d.s === 'weapon' || d.s === 'head' || d.s === 'body' || d.s === 'legs' || d.s === 'acc';
const stackOf = d => d.stack || (isGear(d) || d.s === 'carry' || d.s === 'furn' || d.s === 'pet' ? 1 : 10);
function eunNeun(w){ const c = w.charCodeAt(w.length - 1); return (c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28) ? '을' : '를'; }

/* ---------- 아이템 만들기 ---------- */
function rollAfx(d, r){
  const n = AFX_N[r] || 0, out = [], gun = GUNS.has(d.wt);
  const kind = d.s === 'weapon' ? 'w' : d.s === 'acc' ? 'j' : 'a';
  const pool = Object.keys(AFX).filter(k => AFX[k].s.includes(kind) || (gun && AFX[k].s.includes('g')));
  for (let i = 0; i < n && pool.length; i++){
    const k = pool.splice(Math.floor(Math.random() * pool.length), 1)[0], A = AFX[k];
    let v = A.v[0] + Math.random() * (A.v[1] - A.v[0]); v *= 1 + 0.3 * Math.max(0, r - 1);
    v = A.f ? Math.round(v * 10) / 10 : Math.round(v);
    if (v) out.push([k, v]);
  }
  return out;
}
function makeItem(id, o = {}){
  const d = ITEMS[id]; if (!d) return null;
  const it = { uid: ++RPG.uid, id, n: o.n || 1 };
  if (isGear(d)){
    it.q = o.q || Math.round((0.92 + Math.random() * 0.16) * 100) / 100;
    it.aff = o.aff || rollAfx(d, d.r);
  }
  return it;
}
// 아이템 하나의 수치 (품질 · 덧붙은 효과 합침)
function itemStats(it){
  const d = itemDef(it), fx = {}, q = it.q || 1;
  for (const [k, v] of Object.entries(d.fx || {})) fx[k] = v;
  for (const [k, v] of it.aff || []){
    if (AFX[k] && AFX[k].st){ const cur = fx[k]; const add = k === 'burnHit' ? { ch: v / 100, pct: 2, dur: 4 } : k === 'slowHit' ? { ch: v / 100, dur: 1.5 } : { ch: v / 100, dps: 5, dur: 4 }; fx[k] = cur && typeof cur === 'object' ? { ...cur, ch: Math.min(1, (cur.ch || 0) + add.ch) } : add; }
    else fx[k] = (typeof fx[k] === 'number' ? fx[k] : 0) + v;
  }
  return { atk: d.atk ? Math.round(d.atk * q) : 0, def: d.def ? Math.round(d.def * q) : 0, fx };
}
function itemName(it){ return itemDef(it).n; }

/* ---------- 영웅 ---------- */
function newHero(key){
  const H = HERO_DEF[key];
  const h = { id: key, name: H.name, lv: 1, xp: 0, pts: 0, attr: { ...H.attr }, eq: { weapon: null, off: null, head: null, body: null, legs: null, acc1: null, acc2: null }, hp: null, san: null, st: 'ok', kills: 0, trips: 0, bond: 0 };
  if (H.weapon) h.eq.weapon = makeItem(H.weapon, { q: 1, aff: [] });
  return h;
}
function hero(key){ if (!RPG.heroes[key]) RPG.heroes[key] = newHero(key); return RPG.heroes[key]; }
const xpNeed = lv => Math.round(50 * Math.pow(lv, 1.55));
// 장비 + 가방 유물 효과를 모두 더함
function gearFx(h){
  const fx = {}, add = (k, v) => {
    if (typeof v === 'number') fx[k] = (typeof fx[k] === 'number' ? fx[k] : 0) + v;
    else if (v && typeof v === 'object') fx[k] = fx[k] && typeof fx[k] === 'object' ? { ...fx[k], ch: Math.min(1, (fx[k].ch || 0) + (v.ch || 0)), dps: Math.max(fx[k].dps || 0, v.dps || 0) } : { ...v };
    else fx[k] = v;
  };
  let atk = 0, def = 0;
  for (const s of SLOTS){ const it = h.eq[s]; if (!it) continue; const S = itemStats(it); if (s !== 'weapon' && !(s === 'off' && itemDef(it).wt !== 'shield' && h.id !== 'karius')) atk += S.atk; def += S.def; for (const [k, v] of Object.entries(S.fx)) add(k, v); }
  if (h.id === 'inju') for (const it of RPG.bag){ const d = itemDef(it); if (d.s === 'carry') for (const [k, v] of Object.entries(d.fx || {})) add(k, v); }
  // 세트 (같은 set 셋)
  const sets = {}; for (const s of SLOTS){ const it = h.eq[s]; const st = it && itemDef(it).fx && itemDef(it).fx.set; if (st) sets[st] = (sets[st] || 0) + 1; }
  if (sets.pehto >= 3) add('atkP', 20); if (sets.sage >= 3){ add('magic', 30); add('skillCd', 15); } if (sets.wolf >= 2) add('rally', 8);
  if (typeof fx.atk === 'number') atk += fx.atk;
  if (typeof fx.def === 'number') def += fx.def;
  return { fx, atk, def, sets };
}
// 파생 수치: 모든 수치가 실제 계산에 들어감
function derive(h){
  const H = HERO_DEF[h.id], D = DEFS[H.unit], G2 = gearFx(h), fx = G2.fx, n = k => (typeof fx[k] === 'number' ? fx[k] : 0);
  const A = {}; for (const k of Object.keys(ATTR_N)) A[k] = h.attr[k] + n(k);
  const w = h.eq.weapon, wd = w ? itemDef(w) : null, wt = wd ? wd.wt : null;
  const S = { A, fx, sets: G2.sets, wt, weapon: w };
  if (h.id === 'inju'){
    S.maxHp = Math.round(H.hp0 + A.vit * 8 + (h.lv - 1) * 6 + n('hp'));
    const wAtk = w ? itemStats(w).atk : 6;
    const bonus = !wt || MELEE.has(wt) ? A.str * 1.0 : wt === 'staff' ? A.wil * 1.2 : wt === 'bow' || wt === 'crossbow' ? A.dex * 0.8 + A.per * 0.2 : A.per * 0.6 + A.dex * 0.2;
    S.atk = Math.round((wAtk + bonus + G2.atk) * (1 + n('atkP') / 100) * (wt && GUNS.has(wt) ? 1 + n('gunP') / 100 : 1) * (wt === 'staff' ? 1 + n('magic') / 100 : 1));
    S.spd0 = D.spd;
  } else {
    S.maxHp = Math.round(D.hp * (1 + 0.08 * (h.lv - 1)) + (A.vit - HERO_DEF[h.id].attr.vit) * 8 + n('hp'));
    S.atk = Math.round((D.atk * (1 + 0.06 * (h.lv - 1)) * (1 + (A.str - HERO_DEF[h.id].attr.str) * 0.04) + G2.atk + (w ? itemStats(w).atk * 0.8 : 0)) * (1 + n('atkP') / 100));
    S.spd0 = D.spd;
  }
  S.maxHp = Math.round(S.maxHp * (1 + n('hpP') / 100));
  S.def = Math.round(G2.def * (1 + n('defP') / 100));
  S.crit = Math.min(0.75, 0.05 + A.per * 0.004 + n('crit') / 100);
  S.critMul = 2 + n('critDmg') / 100;
  S.eva = Math.min(0.5, A.dex * 0.003 + n('eva') / 100);
  S.vision = (4 + A.per * 0.12) * (1 + n('vision') / 100);
  S.maxSan = Math.round(50 + A.wil * 3 + n('sanity'));
  S.spd = S.spd0 * (1 + A.dex * 0.003 + n('spd') / 100);
  S.atkSpd = 1 + A.dex * 0.004 + n('atkSpd') / 100;
  S.cdMul = Math.max(0.5, 1 - A.wil * 0.008 - n('skillCd') / 100);
  S.reload = Math.max(0.4, 1 - n('reload') / 100);
  const off = h.eq.off, offD = off ? itemDef(off) : null;
  S.offShield = !!(offD && offD.wt === 'shield'); S.offWt = offD ? offD.wt : null;
  S.block = n('block') / 100 + (S.offShield ? 0.15 : 0);
  S.lifesteal = n('lifesteal') / 100;
  S.regen = n('regen');
  S.thorns = n('thorns');
  S.shield = n('shield');
  S.sanDrain = Math.max(0.2, 1 + n('sanDrain') / 100);
  S.carry = 12 + n('carry');
  S.quick = 4 + (fx.quick ? 1 : 0);
  return S;
}
// 영웅 → 전투 인물에 적용 (체력 비율 유지)
function applyHero(u, h){
  const S = derive(h);
  const ratio = h.hp != null ? Math.max(0, Math.min(1, h.hp / Math.max(1, h.hpMax || S.maxHp))) : (u.max ? u.hp / u.max : 1);
  Object.assign(u, { hero: h, rpg: S, max: S.maxHp, atk: S.atk, def: S.def, critP: S.crit, critMul: S.critMul, eva: S.eva, spd: S.spd, baseSpd: S.spd, lifesteal: S.lifesteal, regen: S.regen, thorns: S.thorns, fx: S.fx });
  u.hp = Math.max(1, Math.round(S.maxHp * ratio));
  if (S.shield && u.shield == null) u.shield = S.shield;
  u.shieldMax = S.shield;
  h.hpMax = S.maxHp;
  return S;
}
function syncHeroHp(u){ if (u && u.hero){ u.hero.hp = u.downed ? 0 : u.hp; u.hero.hpMax = u.max; } }
// 경험: 살아 있는 원정대 모두에게
function gainXp(n, why){
  for (const k of RPG.party){
    const h = RPG.heroes[k]; if (!h || h.st !== 'ok') continue;
    h.xp += n;
    while (h.xp >= xpNeed(h.lv)){
      h.xp -= xpNeed(h.lv); h.lv++; h.pts += 3;
      const u = G.units.find(o => o.hero === h);
      if (u){ applyHero(u, h); u.hp = Math.min(u.max, u.hp + Math.round(u.max * 0.25)); popText(u.x, u.y + bodyH(u) + 0.8, u.z, `레벨 ${h.lv}!`, 'crit', 1.6); ring(u.x, u.z, 0xffd35a, 2.2, 0.7); spark(u.x, u.y + 1, u.z, 0xffe9a0, 18, 4); SFX.tone && SFX.tone(660, 0.2); }
      if (k === 'inju' && typeof uiToast === 'function') uiToast(`<b style="color:#ffd35a">레벨 ${h.lv}</b> — 속성 점수 3 (I 키)`, 'lv');
      if (k !== 'inju' && h.pts >= 3) autoSpend(h);
    }
  }
}
// 동료는 성격대로 알아서 나눔
function autoSpend(h){
  const pref = { cheong: ['str', 'dex', 'vit'], karius: ['vit', 'str', 'vit'] }[h.id] || ['vit', 'str', 'dex'];
  let i = 0; while (h.pts > 0){ h.attr[pref[i % pref.length]]++; h.pts--; i++; }
}

/* ---------- 가방 · 보관함 ---------- */
const bagCap = () => derive(hero('inju')).carry;
function bagCount(){ return RPG.bag.length; }
// 넣기: 쌓을 수 있으면 쌓고, 칸이 없으면 false. 탄약 · 돈은 바로 계산
function addItem(it, list = RPG.bag, cap = list === RPG.bag ? bagCap() : 9999){
  if (typeof it === 'string') it = makeItem(it); if (!it) return false;
  const d = itemDef(it);
  if (d.c === 'gold'){ const g = Array.isArray(d.fx.gold) ? Math.round(d.fx.gold[0] + Math.random() * (d.fx.gold[1] - d.fx.gold[0])) : 10; RPG.gold += g * it.n; return { gold: g * it.n }; }
  if (d.c === 'ammo' && d.fx && d.fx.ammo){ for (const [k, v] of Object.entries(d.fx.ammo)) RPG.ammo[k] = (RPG.ammo[k] || 0) + v * it.n; return { ammo: d.fx.ammo }; }
  if (d.c === 'ammoRaw'){ RPG.ammo[it.id] = (RPG.ammo[it.id] || 0) + it.n; return { ammo: { [it.id]: it.n } }; }
  const st = stackOf(d);
  if (st > 1) for (const o of list){ if (o.id === it.id && o.n < st){ const k = Math.min(st - o.n, it.n); o.n += k; it.n -= k; if (!it.n) return { stacked: o }; } }
  if (list.length >= cap) return false;
  list.push(it); return { put: it };
}
function removeItem(it, list = RPG.bag, n = it.n){
  const i = list.indexOf(it); if (i < 0) return false;
  if (n >= it.n) list.splice(i, 1); else it.n -= n;
  RPG.quick = RPG.quick.map(q => q && !RPG.bag.some(o => o.id === q) ? null : q);
  return true;
}
// 장착: 영웅의 칸에 끼움 (원래 것은 가방으로). 동료는 무기 칸이 없음
const heroWts = h => (HERO_DEF[h.id] || {}).wts || [];
function canWield(h, wt){ const W2 = heroWts(h); return W2 === 'all' || W2.includes(wt); }
function canEquip(h, it, slot){
  const d = itemDef(it);
  if (d.s === 'weapon'){
    if (!canWield(h, d.wt)) return false;
    if (slot === 'off') return h.id === 'karius' || d.wt === 'shield' || ONE_HAND.has(d.wt);   // 카리우스: 팔이 여덟 — 보조 칸에도 아무 무기
    return true;
  }
  if (h.id === 'karius' && (d.s === 'body' || d.s === 'legs')) return false;   // 카리우스: 몸에 맞는 갑옷이 없음 (투구는 됨)
  return ['head', 'body', 'legs', 'acc'].includes(d.s);
}
function whyNot(h, it){ const d = itemDef(it); return d.s === 'weapon' && !canWield(h, d.wt) ? `${h.name}는 ${WT_N[d.wt] || '이것'}을 못 다룸` : h.id === 'karius' && (d.s === 'body' || d.s === 'legs') ? '카리우스 몸에 맞는 갑옷은 없다 (투구만)' : '끼울 수 없음'; }
function slotFor(h, it){
  const d = itemDef(it), s = d.s;
  if (s === 'acc') return !h.eq.acc1 ? 'acc1' : !h.eq.acc2 ? 'acc2' : 'acc1';
  if (s === 'weapon' && d.wt === 'shield') return 'off';   // 방패는 보조 칸
  if (s === 'weapon' && h.id === 'karius' && h.eq.weapon && !h.eq.off) return 'off';   // 카리우스: 둘째 무기
  return s;
}
function equip(h, it, from = RPG.bag, slot){
  slot = slot || slotFor(h, it);
  if (!canEquip(h, it, slot)) return false;
  const old = h.eq[slot];
  removeItem(it, from);
  h.eq[slot] = it;
  if (old) from.push(old);
  refreshHero(h);
  return true;
}
function unequip(h, slot, to = RPG.bag){
  const it = h.eq[slot]; if (!it) return false;
  if (to === RPG.bag && RPG.bag.length >= bagCap()) return false;
  h.eq[slot] = null; to.push(it); refreshHero(h); return true;
}
function refreshHero(h){
  const u = G.units.find(o => o.hero === h);
  if (u){ applyHero(u, h); if (u === G.player && typeof weaponRefresh === 'function') weaponRefresh(u); }
  saveRpg();
}

/* ---------- 피해 공식 (units.js hurt를 감쌈) ----------
   · 회피: 방어하는 쪽 회피율 (구르기 무적과 별개)
   · 치명: 때리는 쪽 치명률 (치명 배율 = 2 + 치명 피해)
   · 방어: 피해 x (1 - 방어 / (방어 + 40)), 방어 무시 %
   · 흡혈 · 가시 · 되돌림 · 출혈 · 화상 · 중독 · 둔화 · 감전 · 표식 · 푸른 체력 (먼저 깎임) */
const _hurtRpg = hurt;
hurt = function(att, tgt, base, o = {}){
  if (!tgt || tgt.dead || tgt.downed) return 0;
  o = { ...o };
  const A = att && att.fx ? att.fx : null, T = tgt.fx || null;
  // 반격 자세 (검 스킬): 앞에서 오는 근접을 흘리고 되벰
  if (tgt.counterT > G.t && att && !o.ranged && !o.unblockable && att.side !== tgt.side){
    tgt.counterT = 0; popText(tgt.x, tgt.y + 2.2, tgt.z, '반격!', 'crit', 1.1); spark(tgt.x, tgt.y + 1.1, tgt.z, 0xffe9a0, 16, 6); G.hitstop = Math.max(G.hitstop, 0.14); camShake(0.25, 0.15);
    if (!att.dead) setTimeout(() => { if (!att.dead && !tgt.dead) hurt(tgt, att, tgt.atk * 1.6, { crit: true, from: tgt, kb: 1.2, stun: 0.5, counter: true }); }, 60);
    return 0;
  }
  // 회피
  if (tgt.eva && !o.unblockable && !o.dot && Math.random() < tgt.eva){ popText(tgt.x, tgt.y + 1.7 + (tgt.lift || 0), tgt.z, '회피', 'miss'); return 0; }
  // 치명
  if (att && att.critP && !o.crit && !o.dot && !o.noCrit){ const rc = o.ranged && A && A.rangedCrit ? A.rangedCrit / 100 : 0; if (Math.random() < att.critP + rc) o.crit = true; }
  if (o.crit && att && att.critMul && !o.critMul) o.critMul = att.critMul;
  // 표식 · 출혈 추가 피해 · 등 뒤 (단검 · 그림자 건틀릿)
  if (tgt.sts && tgt.sts.mark && tgt.sts.mark.t > 0) base *= 1 + tgt.sts.mark.k;
  if (A && A.bleedBonus && tgt.sts && tgt.sts.bleed && tgt.sts.bleed.t > 0) base *= 1 + A.bleedBonus / 100;
  if (A && A.holyP && tgt.D.holy) base *= 1 + A.holyP / 100;
  if (o.backMul && att){ const toA = Math.atan2(att.z - tgt.z, att.x - tgt.x); if (Math.abs(angDiff(toA, tgt.aim)) > 1.9) base *= o.backMul; }
  // 방어
  const def = (tgt.def || 0) * (1 - Math.min(0.9, ((A && A.armorPierce) || 0) / 100 + (o.pierceDef || 0)));
  if (def > 0 && !o.dot) base *= 1 - def / (def + 40);
  // 푸른 체력 (보호막) 먼저
  if (tgt.shield > 0 && !o.dot){ const s = Math.min(tgt.shield, base); tgt.shield -= s; base -= s; if (s >= 1) popText(tgt.x, tgt.y + 1.5, tgt.z, '-' + Math.round(s), 'shield', 0.7); if (base <= 0.5) return 0; }
  const dmg = _hurtRpg(att, tgt, base, o);
  if (!dmg) return 0;
  // 흡혈
  if (att && !att.dead && att.lifesteal && !o.dot){ const h = dmg * att.lifesteal; if (h >= 0.5){ att.hp = Math.min(att.max, att.hp + h); if (h >= 2) popText(att.x, att.y + 1.9, att.z, '+' + Math.round(h), 'heal', 0.6); } }
  // 가시 · 맞으면 출혈 (근접만)
  if (att && !att.dead && !o.ranged && !o.dot && att.side !== tgt.side){
    if (tgt.thorns) setTimeout(() => !att.dead && _hurtRpg(tgt, att, tgt.thorns, { noCrit: true, dot: true }), 0);
    if (T && T.thornsBleed) addStatus(att, 'bleed', { dps: T.thornsBleed.dps, t: T.thornsBleed.dur });
  }
  // 상태 이상 (때리는 쪽 효과)
  if (A && !o.dot && !tgt.dead){
    const roll = (k, fn) => { const v = A[k]; if (v && typeof v === 'object' && Math.random() < (v.ch ?? 1)) fn(v); };
    roll('bleedHit', v => addStatus(tgt, 'bleed', { dps: v.dps || 5, t: v.dur || 4 }));
    roll('burnHit', v => !(T && T.fireImmune) && addStatus(tgt, 'burn', { dps: Math.max(2, tgt.max * (v.pct || 2) / 100), t: v.dur || 4 }));
    roll('poisonHit', v => !(T && T.poisonImmune) && addStatus(tgt, 'poison', { dps: v.dps || 5, t: v.dur || 4 }));
    roll('slowHit', v => addStatus(tgt, 'slow', { k: 0.45, t: v.dur || 1.5 }));
    roll('shockHit', v => !(T && T.shockImmune) && addStatus(tgt, 'shock', { t: v.dur || 1 }));
    if (A.critMark && o.crit) addStatus(tgt, 'mark', { k: A.critMark / 100, t: 3 });
    if (A.hookCrit && o.crit && !tgt.D.heavy && att){ const n2 = norm(att.x - tgt.x, att.z - tgt.z); tgt.kx += n2.x * 9; tgt.kz += n2.z * 9; }
  }
  if (att && att.side === 'ally' && tgt.side === 'enemy' && att.hero) att.hero.dealt = (att.hero.dealt || 0) + dmg;
  return dmg;
};

/* ---------- 상태 이상 ---------- */
const STS_N = { bleed: ['출혈', '#ff4a4a'], burn: ['화상', '#ff9a3a'], poison: ['중독', '#7dff6a'], slow: ['둔화', '#8fc8ff'], shock: ['감전', '#ffe85a'], mark: ['표식', '#ffd35a'], freeze: ['얼음', '#bfe8ff'], buff: ['힘', '#ffd35a'] };
function addStatus(u, k, v){
  if (!u || u.dead) return;
  u.sts = u.sts || {};
  const cur = u.sts[k];
  if (cur && cur.t > 0){ cur.t = Math.max(cur.t, v.t); if (v.dps) cur.dps = Math.max(cur.dps || 0, v.dps); if (v.k) cur.k = Math.max(cur.k || 0, v.k); }
  else { u.sts[k] = { ...v, tick: 0.5 }; popText(u.x, u.y + bodyH(u) + 0.35, u.z, STS_N[k][0], 'sts ' + k, 0.8); }
  if ((k === 'shock' || k === 'freeze') && !u.D.boss){ interrupt(u); u.st = 'hurt'; u.stT = Math.max(u.stT || 0, v.t); setPose(u, 'hurt'); }
}
function tickStatus(u, dt){
  const S = u.sts; if (!S) return;
  let slow = 0;
  for (const k in S){
    const s = S[k]; if (s.t <= 0) continue;
    s.t -= dt;
    if (s.dps){ s.tick -= dt; if (s.tick <= 0){ s.tick += 0.5; if (!u.dead && !u.downed){ const v = s.dps * 0.5; u.hp -= v; u.flash = Math.max(u.flash, 0.3); popText(u.x + rnd(-0.2, 0.2), u.y + bodyH(u) * 0.7, u.z, Math.max(1, Math.round(v)) + '', 'dot ' + k, 0.6); if (k === 'bleed' && typeof bloodHit === 'function' && Math.random() < 0.3) bloodHit(u); if (u.hp <= 0) kill(u, null); } } }
    if (k === 'slow' || k === 'freeze') slow = Math.max(slow, k === 'freeze' ? 0.9 : s.k || 0.45);
  }
  if (u.baseSpd == null) u.baseSpd = u.spd;
  u.spd = u.baseSpd * (1 - slow) * (u.buffSpd || 1);
}
// 한 프레임: 회복 · 푸른 체력 · 상태 이상 · 버프
function rpgTick(dt){
  for (const u of G.units){
    if (u.dead) continue;
    if (u.sts) tickStatus(u, dt);
    if (u.downed) continue;
    if (u.regen && u.hp < u.max) u.hp = Math.min(u.max, u.hp + u.regen * dt);
    if (u.regen < 0) { u.hp += u.regen * dt; if (u.hp <= 0) u.hp = 1; }
    if (u.shieldMax){ u.shieldT = (u.shieldT || 0) + dt; if (u.shieldT > 3 && u.fx && u.fx.shieldRegen) u.shield = Math.min(u.shieldMax, (u.shield || 0) + u.fx.shieldRegen * dt); }
    if (u.buffs){ u.buffs = u.buffs.filter(b => { b.t -= dt; if (b.t <= 0){ b.off && b.off(u); return false; } return true; }); }
    if (u.regenFx){ u.regenFx.t -= dt; u.hp = Math.min(u.max, u.hp + u.regenFx.v * dt); if (u.regenFx.t <= 0) u.regenFx = null; }
  }
}
function addBuff(u, name, t, on, off){ u.buffs = u.buffs || []; const old = u.buffs.find(b => b.name === name); if (old){ old.t = t; return; } on && on(u); u.buffs.push({ name, t, off }); }

/* ---------- 소모품 쓰기 ---------- */
function useItem(it, u = G.player){
  const d = itemDef(it), fx = d.fx || {}, h = u && u.hero;
  const pm = 1 + (((u && u.fx && u.fx.potionP) || 0) / 100);
  let used = false, say = '';
  const heal = (v, who = u) => { if (!who || who.dead) return; who.hp = Math.min(who.max, who.hp + v); popText(who.x, who.y + 1.9, who.z, '+' + Math.round(v), 'heal', 1); ring(who.x, who.z, 0x7dffa0, 1.3, 0.45); };
  if (fx.hp){ heal(fx.hp * pm); used = true; }
  if (fx.hpP){ heal(u.max * fx.hpP / 100 * pm); used = true; }
  if (fx.san){ if (h){ h.san = Math.min(derive(h).maxSan, (h.san ?? 50) + fx.san * pm); popText(u.x, u.y + 2.2, u.z, '정신도 +' + Math.round(fx.san * pm), 'san', 1); } used = true; }
  if (fx.sanHeal && h){ h.san = Math.min(derive(h).maxSan, (h.san ?? 50) + fx.sanHeal); used = true; }
  if (fx.cure){ if (u.sts) for (const k of ['bleed', 'burn', 'poison', 'slow']) if (u.sts[k]) u.sts[k].t = 0; used = true; }
  if (fx.regen){ u.regenFx = { v: fx.regen.v * pm, t: fx.regen.dur }; used = true; }
  if (fx.buff){ const b = fx.buff; addBuff(u, 'pow', b.dur, x => { x.buffSpd = 1 + (b.spd || 0) / 100; x.atkSpdBuff = 1 + (b.atkSpd || 0) / 100; }, x => { x.buffSpd = 1; x.atkSpdBuff = 1; }); popText(u.x, u.y + 2.2, u.z, '힘이 솟는다!', 'crit', 1); used = true; }
  if (fx.partyHeal){ for (const a of G.units) if (a.side === 'ally' && !a.dead){ if (a.downed){ a.downed = false; a.st = 'idle'; a.hp = 1; } heal(a.max * fx.partyHeal / 100, a); } used = true; }
  if (fx.revive){ const dn = G.units.find(a => a.side === 'ally' && a.downed && !a.dead && dist(a, u) < 3) || G.units.find(a => a.side === 'ally' && a.downed && !a.dead); if (dn){ dn.downed = false; dn.st = 'idle'; dn.hp = Math.round(dn.max * 0.4); popText(dn.x, dn.y + 1.8, dn.z, '일으킴', 'heal', 1.2); ring(dn.x, dn.z, 0x7dffa0, 1.6, 0.5); } else heal(u.max * (fx.hpP || 30) / 100); used = true; }
  if (fx.gamble){ const r = Math.random(); if (r < 0.45){ addBuff(u, 'gamble', 40, x => { x.atk = Math.round(x.atk * 1.3); }, x => { if (x.hero) applyHero(x, x.hero); }); say = '몸이 뜨거워진다 (40초 공격 +30%)'; } else if (r < 0.75){ heal(u.max * 0.6); say = '달콤하다'; } else { addStatus(u, 'poison', { dps: 4, t: 8 }); if (h) h.san = Math.max(0, (h.san ?? 50) - 10); say = '…쓰다. 속이 뒤집힌다'; } used = true; }
  if (fx.grenade && typeof throwGrenade === 'function'){ throwGrenade(u, fx.grenade); used = true; }
  if (fx.freeze && typeof throwFreeze === 'function'){ throwFreeze(u, fx.freeze); used = true; }
  if (fx.bell){ for (const e of G.units) if (e.side === 'enemy' && !e.dead && dist(e, u) < 6) addStatus(e, 'shock', { t: fx.bell }); ring(u.x, u.z, 0xd8d0ff, 6, 0.8); SFX.burst({ type: 'bandpass', f: 900, q: 12, gain: 0.4, dec: 1.4 }); used = true; }
  if (fx.whistle){ for (const a of G.units) if (a.side === 'ally' && !a.dead && a !== u){ a.x = u.x + rnd(-1, 1); a.z = u.z + rnd(-1, 1); addBuff(a, 'whistle', 10, x => { x.atk = Math.round(x.atk * 1.15); }, x => { if (x.hero) applyHero(x, x.hero); }); } popText(u.x, u.y + 2.3, u.z, '삐익!', 'big', 1); used = true; }
  if (fx.keys){ for (let i = 0; i < fx.keys; i++) addItem('I-074'); used = true; }
  if (fx.potions){ for (let i = 0; i < fx.potions; i++) addItem(['I-037', 'I-038', 'I-046'][i % 3]); used = true; }
  if (fx.torch && typeof expAddTorch === 'function'){ expAddTorch(fx.torch); used = true; }
  if (fx.candle && typeof placeCandle === 'function'){ placeCandle(u, fx.candle); used = true; }
  if (fx.revealMap && typeof expReveal === 'function'){ expReveal(fx.revealFoes); used = true; }
  if (fx.revealTreasure && typeof expRevealTreasure === 'function'){ expRevealTreasure(); used = true; }
  if (fx.xp){ gainXp(fx.xp, 'book'); used = true; }
  if (fx.wilUp && h){ h.attr.wil++; refreshHero(h); say = '정신 +1 (영구)'; used = true; }
  if (fx.serum){ const s = fx.serum; addBuff(u, 'serum', s.dur, x => { x.atk = Math.round(x.atk * (1 + s.atkP / 100)); x.max = Math.round(x.max * (1 + s.hpP / 100)); x.hp = Math.min(x.max, x.hp + x.max * s.hpP / 100); x.buffSpd = 1 + s.spd / 100; }, x => { x.buffSpd = 1; if (x.hero) applyHero(x, x.hero); }); say = '푸른 아우라가 피어오른다'; used = true; }
  if (fx.perm && h){ h.perm = h.perm || {}; for (const [k, v] of Object.entries(fx.perm)) h.perm[k] = (h.perm[k] || 0) + v; say = '몸이 바뀌었다 (영구 강화)'; used = true; }
  if (fx.escape && typeof expEscape === 'function'){ expEscape(); used = true; }
  if (fx.unlock && typeof expUnlockNear === 'function'){ used = expUnlockNear(); }
  if (fx.dice){ const r = Math.floor(Math.random() * 6) + 1; say = `주사위: ${r}`; if (r === 6){ RPG.gold += 100; say += ' — 금화 100!'; } else if (r === 1){ if (h) h.san = Math.max(0, (h.san ?? 50) - 15); say += ' — 불길하다'; } else heal(u.max * r * 0.05); used = true; }
  if (fx.box){ const pool = Object.keys(ITEMS).filter(k => ITEMS[k].r >= 2 && isGear(ITEMS[k])); addItem(pool[Math.floor(Math.random() * pool.length)]); say = '함 속에서 무언가 나왔다'; used = true; }
  if (fx.lore && typeof loreText === 'function') loreText(it);
  if (!used) return false;
  if (say) popText(u.x, u.y + 2.5, u.z, say, 'miss', 1.6);
  SFX.thump && SFX.thump(220, 0.15, 0.1);
  removeItem(it, RPG.bag, 1);
  if (h && u.hero && h.id === 'inju' && fx.revealMap == null) {}
  saveRpg();
  return true;
}

/* ---------- 저장 ---------- */
const SAVE_KEY = 'cave3d.rpg.v1';
function saveRpg(){ try { localStorage.setItem(SAVE_KEY, JSON.stringify({ ...RPG, heroes: RPG.heroes })); } catch (e) {} }
function loadRpg(){
  try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (s && s.ver === 1){ Object.assign(RPG, s); return true; } } catch (e) {}
  return false;
}
function resetRpg(){
  Object.assign(RPG, { heroes: {}, bag: [], stash: [], gold: 0, ammo: { arrow: 0, bullet: 0, shell: 0, cell: 0 }, quick: [null, null, null, null], uid: 0, party: ['inju'], depth: 0, trips: 0, lost: null, meta: { shortcut: 0, seen: {} }, ver: 1 });
  hero('inju');
}
// 처음: 인주 + 굴 사람들
function rpgInit(){
  if (!loadRpg()) resetRpg();
  hero('inju'); hero('cheong'); hero('karius');
  for (const h of Object.values(RPG.heroes)) for (const s of SLOTS) if (h.eq[s] && !ITEMS[h.eq[s].id]) h.eq[s] = null;
  RPG.bag = RPG.bag.filter(it => ITEMS[it.id]); RPG.stash = RPG.stash.filter(it => ITEMS[it.id]);
}
rpgInit();
