/* 굴 전투판 v1 · data: 병종·무기·계급, 스탯 계산, 유닛 무작위 생성 */
(function (root) {
  'use strict';
  const BG = root.BG;
  const U = BG.U;

  // 병종(모양). 모두 같은 규칙을 공유하고, 기본 스탯만 다르다.
  BG.SHAPES = {
    square:   { name: '방어', icon: '■', hp: 150, spd: 2.7, mass: 1.7, r: 0.62, def: 5, blk: 60, stam: 110, shoot: 5,  shootMin: 0,  cmd: 40 },
    circle:   { name: '보병', icon: '●', hp: 100, spd: 3.6, mass: 1.0, r: 0.50, def: 2, blk: 40, stam: 100, shoot: 15, shootMin: 0,  cmd: 40 },
    triangle: { name: '기동', icon: '▲', hp: 78,  spd: 5.0, mass: 0.8, r: 0.46, def: 1, blk: 25, stam: 100, shoot: 20, shootMin: 0,  cmd: 40 },
    pentagon: { name: '사수', icon: '⬟', hp: 80,  spd: 3.4, mass: 0.9, r: 0.48, def: 1, blk: 25, stam: 90,  shoot: 60, shootMin: 55, cmd: 40 }
  };

  // 무기. reach=사거리(m), wind=선딜, rec=후딜, st=스태미나, poise=균형 피해, stun=경직, kb=밀림
  BG.WEAPONS = {
    fist:   { name: '맨손', reach: 0.9,  dmg: 6,  wind: 0.22, rec: 0.28, st: 5,  poise: 5,  stun: 0.2,  kb: 1.0, blk: 0.05, arc: 50, pierce: 0 },
    mace:   { name: '둔기', reach: 1.25, dmg: 17, wind: 0.75, rec: 0.80, st: 16, poise: 24, stun: 0.55, kb: 3.0, blk: 0.12, arc: 60, pierce: 0.35 },
    sword:  { name: '검',   reach: 1.45, dmg: 11, wind: 0.40, rec: 0.40, st: 9,  poise: 8,  stun: 0.3,  kb: 1.5, blk: 0.25, arc: 80, pierce: 0 },
    spear:  { name: '창',   reach: 2.5,  dmg: 10, wind: 0.50, rec: 0.55, st: 10, poise: 9,  stun: 0.3,  kb: 1.8, blk: 0.18, arc: 50, pierce: 0.1, minRange: 0.9, chargeMul: 1.8 },
    cannon: { name: '포',   reach: 24,   dmg: 20, wind: 1.10, rec: 1.00, st: 14, poise: 12, stun: 0.3,  kb: 2.0, blk: 0.05, arc: 50, pierce: 0.1, ranged: true, proj: 22, aoe: 0.8 }
  };
  BG.SHIELD = { name: '방패', blk: 0.30, arc: 150, absorb: 0.8, stCost: 0.7 };
  BG.BLOCK_ABSORB = 0.5; // 무기로 막을 때 피해 흡수율
  BG.WEAPON_ICON = { fist: '✊', mace: '🔨', sword: '🗡', spear: '🔱', cannon: '💣' };

  BG.RANKS = [
    { name: '이병', wins: 0 },
    { name: '일병', wins: 2 },
    { name: '상병', wins: 4 },
    { name: '병장', wins: 7 },
    { name: '하사', wins: 11 },
    { name: '중사', wins: 16 },
    { name: '상사', wins: 22 }
  ];
  BG.rankIdx = wins => {
    let r = 0;
    for (let i = 0; i < BG.RANKS.length; i++) if (wins >= BG.RANKS[i].wins) r = i;
    return r;
  };

  const NAMES = ['한결', '도윤', '서준', '하준', '민재', '시우', '지호', '준서', '건우', '우진', '현우', '선우',
    '도현', '이안', '태민', '재윤', '승현', '지훈', '유찬', '가온', '단비', '나래', '보람', '새봄', '아라', '예준', '하람', '주원'];

  const DEV0 = () => ({ hp: 0, atk: 0, def: 0, spd: 0, blk: 0, stam: 0, shoot: 0, cmd: 0 });

  // 유닛 정의(영속 데이터) -> 전투용 스탯. 병종 기본 + 개체 편차 + 계급 보정.
  BG.calcStats = function (d) {
    const b = BG.SHAPES[d.shape], v = d.dev, ri = BG.rankIdx(d.wins || 0);
    const s = {
      hp: b.hp + v.hp, atk: 100 + v.atk, def: b.def + v.def, spd: b.spd + v.spd,
      blk: b.blk + v.blk, stam: b.stam + v.stam, shoot: b.shoot + v.shoot,
      cmd: b.cmd + v.cmd + ri * 3, mass: b.mass, r: b.r
    };
    s.shoot = Math.max(s.shoot, b.shootMin); // 사수는 최소 사격치를 보장받는다
    s.spd = Math.max(1.5, s.spd);
    s.cmd = U.clamp(s.cmd, 5, 99);
    s.shoot = U.clamp(s.shoot, 0, 99);
    return s;
  };

  BG._uid = 1;
  BG.newUid = () => 'u' + (BG._uid++);
  BG.setUidCounter = n => { BG._uid = n; };

  // 무작위 유닛. power: 단계에 따른 성장 수치(0이면 기본)
  BG.genUnit = function (rng, power, opt) {
    opt = opt || {};
    const shape = opt.shape || rng.weighted({ circle: 0.35, square: 0.2, triangle: 0.2, pentagon: 0.25 });
    let weapon = opt.weapon;
    if (!weapon) {
      weapon = shape === 'pentagon'
        ? rng.weighted({ cannon: 0.7, sword: 0.1, spear: 0.1, mace: 0.05, fist: 0.05 })
        : rng.weighted({ sword: 0.28, spear: 0.24, mace: 0.2, cannon: 0.18, fist: 0.1 });
    }
    const shield = opt.shield != null ? opt.shield : (weapon !== 'cannon' && rng.chance(shape === 'square' ? 0.7 : 0.4));
    const g = () => rng.gauss();
    const dev = DEV0();
    dev.hp = Math.round(g() * 10 + power * 4);
    dev.atk = Math.round(g() * 6 + power * 2.4);
    dev.def = Math.round((g() * 0.8 + power * 0.25) * 10) / 10;
    dev.spd = Math.round((g() * 0.2) * 100) / 100;
    dev.blk = Math.round(g() * 7 + power * 1.2);
    dev.stam = Math.round(g() * 7 + power * 2);
    dev.shoot = Math.round(g() * 8 + power * 2);
    dev.cmd = Math.round(rng.range(-22, 30));
    return {
      uid: BG.newUid(), name: opt.name || rng.pick(NAMES), shape: shape, weapon: weapon, shield: !!shield,
      dev: dev, wins: 0, kills: 0, battles: 0
    };
  };

  // 시작 4인: 보병1, 보병2, 탱커1, 사수1
  BG.startRoster = function (rng) {
    const mk = (name, shape, weapon, shield, cmd) => {
      const u = BG.genUnit(rng, 0, { name: name, shape: shape, weapon: weapon, shield: shield });
      u.dev.cmd = cmd;
      return u;
    };
    return [
      mk('탱커1', 'square', 'sword', true, 10),
      mk('보병1', 'circle', 'spear', false, 0),
      mk('보병2', 'circle', 'mace', true, -6),
      mk('사수1', 'pentagon', 'cannon', false, 6)
    ];
  };

  // 적 편성: 같은 생성 규칙을 쓴다. 기본 구성(탱커·보병·사수)을 보장하고 나머지는 무작위.
  BG.genEnemies = function (rng, count, stage) {
    const power = Math.max(0, stage - 1) * 0.9;
    const list = [];
    const base = [
      { shape: 'square' }, { shape: 'circle' }, { shape: 'pentagon', weapon: 'cannon', shield: false }, { shape: 'circle' }
    ];
    for (let i = 0; i < count; i++) {
      const o = i < base.length ? Object.assign({}, base[i]) : {};
      const u = BG.genUnit(rng, power, o);
      // 초반 완화: 단계 1~8 동안 적 체력·공격을 서서히 정상치로 올린다 (영구 손실 구조라 초반 손실을 줄인다)
      const h = U.clamp(0.72 + 0.04 * (stage - 1), 0.72, 1.0);
      u.dev.hp -= Math.round((1 - h) * BG.SHAPES[u.shape].hp);
      u.dev.atk -= Math.round((1 - h) * 100);
      u.name = '적' + (i + 1);
      list.push(u);
    }
    return list;
  };
})(typeof window !== 'undefined' ? window : globalThis);
