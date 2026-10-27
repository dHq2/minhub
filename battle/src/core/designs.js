/* 설계(design): 우리 병종 · 체급 · 장비 · 의무 를 원본 엔진이 읽는 인물 설계(p)로 바꾸고, 무작위로 만든다.
 *
 * 병종(모양)은 엔진의 직업 · 역할에서 읽어 낸다 (kindOf) — 화면은 엔진 값만 보면 된다.
 *   ■ 방어(탱커) = 근접 · 전선    ● 보병 = 근접 · 공격수 (의무 특기를 가질 수 있음)
 *   ▲ 기동 = 기동 · 공격수         ⬟ 사수 = 원거리 · 사수
 * 체급은 엔진의 sizeCls (소형 · 중형 · 중대형 · 대형 · 초대형). 대형 이상은 [거구] (휘두르기 · 짓밟기 등 원본 거구 규칙).
 * 갑옷 · 투구는 몸 크기에 맞는 것만 입는다 (원본 wearWhy 규칙: 장비의 size). 기동 · 사수는 맨몸으로 시작 (루팅으로 보완).
 * 의무 = 보병 중 몇이 가진 [응급처치] 구급상자 + [의학] 특성 (원본 노먼의 KIT 와 같은 수치). */

GB.SIZES = {
  소형:   { h: 1.3, w: 38,  rMul: 1.0,  hp: 0.75, atk: 0.85, p: 0.22, short: '소' },
  중형:   { h: 1.7, w: 70,  rMul: 1.0,  hp: 1.0,  atk: 1.0,  p: 0.48, short: '중' },
  중대형: { h: 2.0, w: 105, rMul: 1.12, hp: 1.45, atk: 1.12, p: 0.20, short: '중대' },
  대형:   { h: 2.6, w: 220, rMul: 1.35, hp: 2.4,  atk: 1.3,  p: 0.08, short: '대' },
  초대형: { h: 3.4, w: 480, rMul: 1.7,  hp: 4.0,  atk: 1.6,  p: 0.02, short: '초대' }
};
GB.SIZE_ORDER = ['소형', '중형', '중대형', '대형', '초대형'];

GB.KINDS = {
  tank: { name: '방어', icon: '■', cls: '근접', role: '전선', hp: 150, atk: 20, weapons: { 검: 5, 둔기: 3, 창: 2 }, shield: 0.8, gear: true, bold: 0.45 },
  inf:  { name: '보병', icon: '●', cls: '근접', role: '공격수', hp: 105, atk: 22, weapons: { 창: 4, 검: 4, 도끼: 2, 둔기: 2 }, shield: 0.35, gear: true, bold: 0.5 },
  cav:  { name: '기동', icon: '▲', cls: '기동', role: '공격수', hp: 80, atk: 22, weapons: { 단검: 4, 손도끼: 3, 검: 3 }, shield: 0, gear: false, bold: 0.7 },
  arc:  { name: '사수', icon: '⬟', cls: '원거리', role: '사수', hp: 80, atk: 24, weapons: { 활: 5, 총: 3, 단궁: 1, 샷건: 1 }, shield: 0, gear: false, bold: 0.35 }
};
GB.kindOf = function (p) {
  if (p.role === '전선') return 'tank';
  if (p.cls === '기동') return 'cav';
  if (p.cls === '원거리' || p.role === '사수') return 'arc';
  return 'inf';
};

// 원본 노먼의 응급처치 구급상자 (scen_lib790.js KIT)
GB.KIT = { name: '응급처치', kit: true, pool: 7, pct: 0.2, min: 10, cap: 30, hot: 4, hotN: 5, hotGap: 0.4, cd: 2.2, wind: 0.5, rec: 0.3, rng: 0.8, auto: 0.5 };

GB.GEAR_KINDS = {
  몸: [{ mat: '가죽', name: '가죽 갑옷', w: 4 }, { mat: '사슬', name: '사슬 갑옷', w: 4 }, { mat: '판금', name: '판금 갑옷', w: 2 }],
  머리: [{ mat: '투구', name: '투구', w: 1 }]
};
GB.makeGear = function (rng, slot, size, power, tierHint) {
  const k = rng.weighted(Object.fromEntries(GB.GEAR_KINDS[slot].map((g, i) => [i, g.w])));
  const g = GB.GEAR_KINDS[slot][k];
  const tier = GB.clamp(tierHint || (1 + (rng() < 0.35 + power * 0.04 ? 1 : 0) + (rng() < 0.1 + power * 0.03 ? 1 : 0)), 1, 4);
  return { name: g.name, mat: g.mat, tier: tier, dur: 100, size: size };
};

const NAME_POOL = ['한결', '도윤', '서준', '하준', '민재', '시우', '지호', '준서', '건우', '우진', '현우', '선우', '도현', '이안', '태민', '재윤',
  '승현', '지훈', '유찬', '가온', '단비', '나래', '보람', '새봄', '아라', '예준', '하람', '주원', '라온', '이든', '로하', '시온', '해든', '다온', '유진', '채원',
  '무진', '서연', '하윤', '지안', '다인', '소율', '세아', '지우', '연우', '이솔', '나은', '은솔'];
GB.NAME_POOL = NAME_POOL;

// 등급 특성 한 칸 뽑기: power(단계가 오를수록 큰 값)가 높을수록 좋은 등급
GB.gradeRoll = function (rng, power, minG) {
  const r = rng() - power * 0.04;
  let g = r < 0.04 ? 'S' : r < 0.14 ? 'A' : r < 0.36 ? 'B' : 'C';
  if (!minG) return rng() < 0.55 - power * 0.03 ? '' : g;
  const ord = 'CBAS';
  return ord.indexOf(g) < ord.indexOf(minG) ? minG : g;
};

GB.rollSize = function (rng) {
  const w = {};
  GB.SIZE_ORDER.forEach(s => { w[s] = GB.SIZES[s].p; });
  return rng.weighted(w);
};

/* 무작위 설계. opt: {kind, size, weapon, shield, name, medic, gear(true/false), power}
 * 영속 필드(uid · wins · kills · grown · cg · chiefNm ...)도 함께 갖는다 — 캠페인이 그대로 저장한다. */
GB.genDesign = function (rng, opt) {
  opt = opt || {};
  const power = opt.power || 0;
  const kind = opt.kind || rng.weighted({ tank: 0.2, inf: 0.38, cav: 0.18, arc: 0.24 });
  const K = GB.KINDS[kind], size = opt.size || GB.rollSize(rng), Z = GB.SIZES[size];
  const weapon = opt.weapon || rng.weighted(K.weapons);
  const wspec = E.DEFAULT_RULES.weapons[weapon] || {};
  const ranged = wspec.kind === '활' || wspec.kind === '총포류';
  const shield = opt.shield != null ? !!opt.shield : (!ranged && !(wspec.two) && rng.chance(K.shield));
  const g = 1 + power * 0.07;
  const p = {
    uid: opt.uid || ('u' + Math.floor(rng() * 1e9).toString(36)), name: opt.name || rng.pick(NAME_POOL),
    ref: 'G-' + (opt.uid || Math.floor(rng() * 1e9).toString(36)), tier: 2, cls: K.cls, role: K.role, weapon: weapon, shield: shield,
    sizeCls: size, height: Z.h, weight: Z.w, rMul: Z.rMul,
    ov: { hp: Math.round(K.hp * Z.hp * g * rng.range(0.94, 1.08)), atk: Math.round(K.atk * Z.atk * (1 + power * 0.05) * rng.range(0.94, 1.08)) },
    traits: [], active: [], bold: K.bold, gear: {}, nv: true,
    wins: 0, kills: 0, battles: 0, grown: [], cg: '', chiefNm: '', chiefMode: ''
  };
  if (size === '대형' || size === '초대형') p.traits.push('거구');
  if (kind === 'cav') p.active.push('도약');
  // 특성: 병종마다 중심 특성 하나 + 우연한 하나
  const prim = { tank: '방어', inf: '근력', cav: '회피', arc: '사격' }[kind];
  const pg = GB.gradeRoll(rng, power, kind === 'arc' ? 'C' : '');
  if (pg) p.traits.push(prim + pg);
  const sec = rng.pick(['속력', '회피', '근력', '방어']);
  if (sec !== prim && !(kind === 'arc' && sec === '방어')) { const sg = GB.gradeRoll(rng, power - 2, ''); if (sg) p.traits.push(sec + sg); }
  if (rng.chance(0.14 + power * 0.01)) p.traits.push('지휘' + GB.gradeRoll(rng, power, 'C'));
  // 장비: 방어 · 보병만 갑옷과 투구
  const wantGear = opt.gear != null ? opt.gear : K.gear;
  if (wantGear) { p.gear = { 몸: GB.makeGear(rng, '몸', size, power), 머리: GB.makeGear(rng, '머리', size, power) }; }
  // 투창: 창을 든 쪽은 던질 수 있다(엔진 jav). 의무: 보병 중 우연히
  const medic = opt.medic != null ? opt.medic : (kind === 'inf' && rng.chance(opt.medicChance != null ? opt.medicChance : 0.12));
  if (medic) { p.skill = GB.clone(GB.KIT); p.traits.push('의학' + GB.gradeRoll(rng, power, 'C')); }
  return p;
};

// 시작 4인: 보병1 · 보병2 · 탱커1 · 사수1 (모두 중형). 보병1 은 의무(첫 1명 보장). 보병 둘은 전우조.
GB.startRoster = function (seed) {
  const rng = GB.rng(seed);
  const mk = (name, kind, weapon, shield, extra) => GB.genDesign(rng, Object.assign({ name: name, kind: kind, size: '중형', weapon: weapon, shield: shield, medic: false, uid: name }, extra || {}));
  const L = [mk('탱커1', 'tank', '검', true), mk('보병1', 'inf', '창', false, { medic: true }), mk('보병2', 'inf', '둔기', true), mk('사수1', 'arc', '활', false)];
  L[1].cg = L[2].cg = 'c0';
  L.forEach(p => { p.traits = p.traits.filter(t => !/^지휘/.test(t)); });
  L[1].traits = L[1].traits.filter(t => !/^의학/.test(t)).concat(['의학C']);   // 시작 의무는 의학 C
  L[0].traits.push('지휘C');       // 처음 총지휘 후보: 탱커1 (원본: 지휘 점수가 가장 높은 이)
  return L;
};

// 인원에 맞는 판 크기 (칸 = 1 m)
GB.mapFor = function (n) {
  return n <= 6 ? { W: 36, H: 22 } : n <= 10 ? { W: 46, H: 28 } : n <= 14 ? { W: 56, H: 32 } : { W: 68, H: 38 };
};
GB.zone = function (map, side) {
  const zw = Math.round(map.W * 0.27);
  return side === 0 ? { x0: 2, x1: 2 + zw, y0: 2, y1: map.H - 2 } : { x0: map.W - 2 - zw, x1: map.W - 2, y0: 2, y1: map.H - 2 };
};
// 시작 배치: 앞줄(방어 · 보병) → 기동 → 사수, 인원이 많으면 열을 늘림
GB.deploy = function (list, side, map) {
  const z = GB.zone(map, side), dir = side === 0 ? 1 : -1, cy = map.H / 2;
  const front = list.filter(p => ['tank', 'inf'].includes(GB.kindOf(p)));
  const wing = list.filter(p => GB.kindOf(p) === 'cav');
  const rear = list.filter(p => GB.kindOf(p) === 'arc');
  const bx = side === 0 ? z.x1 - 2 : z.x0 + 2;
  const place = (arr, x, sp) => {
    const per = Math.max(1, Math.floor((map.H - 6) / sp));
    arr.forEach((p, i) => {
      const col = Math.floor(i / per), k = i % per, idx = (k % 2 === 0 ? 1 : -1) * Math.ceil(k / 2);
      p.x = x - dir * col * 2.0; p.y = cy + idx * sp; p.home = { x: p.x, y: p.y };
    });
  };
  place(front.sort((a, b) => (b.ov.hp - a.ov.hp)), bx, 1.9);
  place(wing, bx - dir * 4.2, 2.6);
  place(rear, bx - dir * 6.5, 2.2);
};

// 엔진에 넘길 한 칸: 설계 + 진영 · 자리. (설계 자체는 건드리지 않는다)
GB.toEngine = function (p, side, i) {
  const q = GB.clone(p);
  q.id = p.uid; q.side = side; q.hero = false; q.nv = true; q.grp = 'g' + side;
  q.x = p.x != null ? p.x : 5; q.y = p.y != null ? p.y : 5;
  if (side === 1) q.mute = true;
  return q;
};

GB.describe = function (p) {
  const k = GB.KINDS[GB.kindOf(p)], g = (p.gear || {});
  return k.icon + ' ' + k.name + ' · ' + GB.SIZES[p.sizeCls].short + ' · ' + p.weapon + (p.shield ? '+방패' : '') +
    (g.몸 ? ' · 몸' + g.몸.mat : '') + (g.머리 ? ' · 투구' : '') + (p.skill && p.skill.kit ? ' · 의무' : '');
};
GB.gradeOf = function (p, key) {
  const t = (p.traits || []).find(x => x.length === key.length + 1 && x.indexOf(key) === 0 && 'SABCDE'.indexOf(x.slice(-1)) >= 0);
  return t ? t.slice(-1) : '';
};
