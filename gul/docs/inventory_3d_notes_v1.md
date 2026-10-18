v1 (출처: 굴의 프롤로그 3D)

# 굴의 프롤로그 3D — 인벤토리 · 장비 · 아이템 · 상점 · 대화 UI 정리

원본: https://claude.ai/artifact/M22Bm7EN4fcJpzHho2Twc9 (index.html v0.35 주석, 실제 스크립트는 v0.93 무렵까지 고쳐짐)
읽은 파일: src/rpg.js (v1.24) · src/ui_rpg.js (v1.22) · src/data_items.js · src/gear.js · src/expedition.js (v1.20) · src/encounters.js · src/rogue.js · src/qol.js · src/weapons.js · src/sol.js · src/drill.js · src/prologue.js · src/workers.js · src/wounds.js · src/save.js · src/touch.js · src/game.js · src/gacha.js · index.html CSS
모든 코드는 바닐라 JS + three.js r128, 저장은 localStorage.

---

## 0. 한눈에

- 저장소가 둘로 나뉨
  - RPG 쪽 (rpg.js): 아이템 "인스턴스" 목록. 인주 가방 `RPG.bag` · 동료마다 배낭 `h.bag` · 굴 보관함 `RPG.stash` · 영웅마다 장비 7칸 `h.eq`
  - 굴 생활 쪽 (prologue.js): 매일 떨어지는 물건을 손으로 날라 쌓는 창고 `PRO.store` (끼니 · 붕대 · 가구 · 옛 장비). 아이템 인스턴스가 아니라 `{ k, name, type, food, h }` 같은 단순 객체
- 용량 = 칸 수. 무게 필드 `w`는 데이터에 있지만 게임 규칙에는 안 쓰임 (무게 제한 없음)
- 내구도 · 수리 없음 (광석 설명에 "굴에서 장비를 고침"이라고만 적혀 있고 코드 없음)
- 탄약 · 금화는 가방 칸을 차지하지 않는 공용 카운터 (`RPG.ammo`, `RPG.gold`)
- 화폐는 금화 하나. 파는 기능 없음, 사기만 함 (상인 둘 · 동료 기원). 물물교환 없음
- 인벤토리 창은 I (또는 B). 클릭으로 고르고 아래 버튼으로 행동, 두 번 누르면 바로 끼우기 / 쓰기. 끌어 놓기 (drag & drop) 없음

---

## 1. 데이터 구조

### 1-1. 아이템 정의 `ITEMS[id]` (data_items.js, 도감에서 자동 생성 · 963개)

파일 머리 주석이 필드 사전 역할을 함:

```js
/* data_items.js — tools/build_items.py v1.0이 도감에서 만듦 (손으로 고치지 않음)
   ITEMS[id]: n 이름 · c 갈래 · s 칸 · wt 무기 종류 · vr 변형 · r 등급 (0 낡은 ~ 6 보스) · atk · def · fx 효과 · d 설명 · g 값 · w 무게 · i 아이콘 칸 · h 손 그림 [칸, 너비비, 높이비, 세움] · L 길이 (칸) */
```

예시 (그대로):

```js
"W-sword":{"n":"낡은 검","c":"weapon","s":"weapon","wt":"sword","r":0,"atk":12,"L":1.0,"w":2,"id":"W-sword","d":"기본 장비 · 상시 등장","g":10,"i":958}
"I-037":{"n":"빨간 물약","c":"potion","s":"potion","r":0,"fx":{"hpP":40},"d":"빨간 물약. 체력 40% 회복","g":25,"w":0,"stack":5,"id":"I-037","i":553}
"I-285":{"n":"화살통","c":"ammo","s":"ammo","r":0,"fx":{"ammo":{"arrow":15}},"d":"화살통. 화살 +15 (활 · 석궁)","g":10,"w":0,"stack":20,"id":"I-285","i":96}
```

필드 쓰임 (실측 집계):

| 필드 | 뜻 | 비고 |
|---|---|---|
| n | 이름 | 963개 모두 |
| c | 갈래 (category) | armor 393 · weapon 304 · acc 89 · relic 62 · use 19 · mat 15 · potion 14 · junk 13 · food 9 · tool 9 · book 9 · ammo 8 · furn 5 · ammoRaw 4 · light 3 · gold 3 · pet 2 · key 2 |
| s | 칸 (어디에 들어가나) | weapon · head · body · legs · acc · carry (지니면 효과, 유물) · use · potion … |
| wt | 무기 종류 | sword 48 · pistol 39 · spear 38 · hammer 29 · lever 24 · dagger 21 · bow 20 · axe 19 · shotgun 15 · greatsword 14 · shield 14 · staff 10 · crossbow 8 · assault 5 |
| vr | 무기 변형 | mace · halberd · katana · rapier · scythe · whip · flint · cannon · laser · sling … (수치 · 작은 효과만 바꿈) |
| r | 등급 0~6 | 0: 95 · 1: 106 · 2: 301 · 3: 241 · 4: 170 · 5: 36 · 6: 14 |
| atk / def | 기본 공격 / 방어 | 품질 q를 곱해 씀 |
| fx | 효과 묶음 | 키 사전은 FX_N (수치) · FX_FLAG (켜고 끄는 것) |
| d | 설명 글 | 320개만 있음 |
| g | 값 (금화) | 등급별 평균: r0 10 · r1 21 · r2 46 · r3 87 · r4 132 · r5 196 · r6 279 |
| w | 무게 | 0~7. 몸 갑옷 3 / 판금 6, 장신구 0. 규칙엔 안 쓰임 |
| i | 아이콘 칸 번호 | 72px 칸 16열 아틀라스 4장 (art/atlas/icon0~3.webp) |
| h · L | 손에 든 그림 · 길이 | 무기만 |
| relic | 유물 표시 | 137개 |
| stack | 한 칸에 쌓는 최대 | 3 · 5 · 10 · 20. 없으면 장비 1, 그 밖 10 |

등급 이름 · 색 (rpg.js):

```js
const RAR = [
  { n: '낡은', c: '#8f8a84' }, { n: '평범한', c: '#e9e3d6' }, { n: '좋은', c: '#62d46e' }, { n: '명품', c: '#4fa8ff' },
  { n: '영웅', c: '#b673ff' }, { n: '전설', c: '#ffc23a' }, { n: '보스', c: '#ff3b3b' }];
```

갈래 · 칸 · 무기 이름표:

```js
const SLOT_N = { weapon: '무기', off: '보조', head: '머리', body: '몸', legs: '다리', acc1: '장신구', acc2: '장신구' };
const CAT_N = { weapon: '무기', armor: '방어구', acc: '장신구', relic: '유물', use: '소모품', potion: '물약', food: '식량', ammo: '탄약', ammoRaw: '탄약', gold: '돈', mat: '재료', tool: '도구', key: '열쇠', book: '책 · 지도', light: '빛', junk: '잡동사니', furn: '가구 유물', pet: '펫' };
```

### 1-2. 아이템 인스턴스 (가방에 실제로 들어가는 것)

```js
function makeItem(id, o = {}){
  const d = ITEMS[id]; if (!d) return null;
  const it = { uid: ++RPG.uid, id, n: o.n || 1 };
  if (isGear(d)){
    it.q = o.q || Math.round((0.92 + Math.random() * 0.16) * 100) / 100;
    it.aff = o.aff || rollAfx(d, d.r);
  }
  return it;
}
```

- `uid` 고유 번호 · `id` 정의 키 · `n` 개수 (쌓임)
- 장비만: `q` 품질 0.92~1.08 (atk · def에 곱함, 툴팁에 "품질 97%") · `aff` 무작위 덧붙은 효과 `[[키, 값], …]`
- 총만: `mag` 탄창에 남은 탄 (아이템에 붙어 있음 — 총을 바꿔 들어도 그 총의 장전 상태가 남음)

```js
if (w.it && w.mag && w.it.mag == null) w.it.mag = w.mag;   // 새로 얻은 총은 장전된 채로
```

덧붙는 효과 개수는 등급으로 정해짐:

```js
const AFX_N = { 0: 0, 1: 0, 2: 1, 3: 1, 4: 2, 5: 3, 6: 2 };
```

덧붙는 효과 후보 (s 글자 = 붙을 수 있는 곳: w 무기 · a 방어구 · j 장신구 · g 총만), 값은 등급마다 ×(1 + 0.3 × (r − 1)):

```js
const AFX = {
  atkP: { v: [4, 9], s: 'wj' }, crit: { v: [2, 5], s: 'wj' }, critDmg: { v: [10, 25], s: 'w' }, atkSpd: { v: [4, 9], s: 'wj' },
  bleedHit: { v: [10, 22], s: 'w', st: true }, burnHit: { v: [8, 16], s: 'w', st: true }, slowHit: { v: [10, 20], s: 'w', st: true }, lifesteal: { v: [2, 4], s: 'wj' },
  armorPierce: { v: [10, 25], s: 'w' }, str: { v: [1, 3], s: 'waj' }, … hp: { v: [8, 20], s: 'aj' }, def: { v: [2, 5], s: 'aj' }, … reload: { v: [10, 20], s: 'g' }, sanDrain: { v: [-8, -15], s: 'aj' },
};
```

### 1-3. 쌓기 규칙

```js
const isGear = d => d.s === 'weapon' || d.s === 'head' || d.s === 'body' || d.s === 'legs' || d.s === 'acc';
const stackOf = d => d.stack || (isGear(d) || d.s === 'carry' || d.s === 'furn' || d.s === 'pet' ? 1 : 10);
```

### 1-4. 전체 상태 객체 `RPG` (localStorage 'cave3d.rpg.v1' 통째 저장)

```js
const RPG = {
  heroes: {}, bag: [], stash: [], gold: 0, ammo: { arrow: 0, bullet: 0, shell: 0, cell: 0 }, quick: [null, null, null, null], uid: 0,
  party: ['inju'], depth: 0, trips: 0, lost: null, meta: { shortcut: 0, seen: {} }, ver: 1,
};
```

영웅 기록:

```js
const h = { id: key, name: H.name, lv: 1, xp: 0, pts: 0, attr: { ...H.attr }, eq: { weapon: null, off: null, head: null, body: null, legs: null, acc1: null, acc2: null }, hp: null, san: null, st: 'ok', kills: 0, trips: 0, bond: 0 };
```

동료 배낭은 영웅 기록에 붙음 (`h.bag`), 인주 것만 `RPG.bag`.

---

## 2. 인물별 소지품 (가방 · 배낭) — 칸 · 용량

```js
const bagCap = () => derive(hero('inju')).carry;
// v0.58 동료 배낭: 저마다 따로 (= 원정에서 주워 올 수 있는 총량). 크기는 덩치 · 힘 따라
const BAG_CAP = { cheong: 8, karius: 16, rebecca: 10, goodwill: 12, angel: 6, goldknight: 10, gangster: 9 };
function bagOf(h){ if (!h || h.id === 'inju') return RPG.bag; return (h.bag = h.bag || []); }
function capOf(h){ if (!h || h.id === 'inju') return bagCap(); return (BAG_CAP[h.id] || 8) + Math.max(0, derive(h).carry - 12); }
```

- 인주 가방: 기본 12칸 (`S.carry = 12 + n('carry')`), `carry` 효과 장비 (예: 가방류 장신구)로 늘어남
- 동료 배낭: 청광묵 8 · 카리우스 16 · 레베카 10 · GOOD WILL 12 · 그 밖 (굴 식구) 8. 장비의 `carry` 보너스도 더해짐
- 굴 보관함 `RPG.stash`: 칸 제한 없음 (`listCap`이 9999 돌려줌), 굴에서만 열림
- 무게 제한 없음. 한 칸 = 아이템 한 묶음 (쌓이는 것은 stack까지)

```js
function listCap(list){ if (list === RPG.bag) return bagCap(); for (const h of Object.values(RPG.heroes)) if (h.bag === list) return capOf(h); return 9999; }
```

넣기 · 빼기 — 금화 · 탄약은 칸을 안 쓰고 바로 숫자로 바뀜:

```js
function addItem(it, list = RPG.bag, cap = listCap(list)){
  if (typeof it === 'string') it = makeItem(it); if (!it) return false;
  const d = itemDef(it);
  if (d.c === 'gold'){ … RPG.gold += g * it.n; return { gold: g * it.n }; }
  if (d.c === 'ammo' && d.fx && d.fx.ammo){ for (const [k, v] of Object.entries(d.fx.ammo)) RPG.ammo[k] = (RPG.ammo[k] || 0) + v * it.n; return { ammo: d.fx.ammo }; }
  if (d.c === 'ammoRaw'){ RPG.ammo[it.id] = (RPG.ammo[it.id] || 0) + it.n; return { ammo: { [it.id]: it.n } }; }
  const st = stackOf(d);
  if (st > 1) for (const o of list){ if (o.id === it.id && o.n < st){ … if (!it.n) return { stacked: o }; } }
  if (list.length >= cap) return false;
  list.push(it); return { put: it };
}
```

원정에서 인주 가방이 차면 곁에 살아 있는 동료 배낭으로 자동으로 넘어감:

```js
function addToParty(it){
  for (const k of RPG.party){
    if (k === 'inju') continue; const h = RPG.heroes[k]; if (!h) continue;
    const u = G.units.find(o => o.hero === h && !o.dead && !o.downed && !o.guest); if (!u) continue;
    const r = addItem(it, bagOf(h)); if (r){ popText(u.x, u.y + bodyH(u) + 0.5, u.z, `${h.name} 배낭에`, 'heal', 0.9); return r; }
  }
  return false;
}
```

HUD · 원정 준비 창에는 "가방 (모두)"로 원정대 전체 칸을 합쳐 보임 (`partyBagTxt()` → `n/c`).

소지품 효과: 인주 가방 안의 `s: 'carry'` 유물은 지니기만 해도 효과가 붙음 (동료 배낭의 유물은 효과 없음):

```js
if (h.id === 'inju') for (const it of RPG.bag){ const d = itemDef(it); if (d.s === 'carry') for (const [k, v] of Object.entries(d.fx || {})) add(k, v); }
```

### 2-1. 훈련장 (drill) 쪽 소지품 칸 — 탄약을 칸 단위로

sol.js는 훈련장 분대 규칙용으로 따로 "소지품 칸"을 둠. 칸 수는 위 배낭 크기를 그대로 쓰고, 한 칸에 탄약 묶음 하나:

```js
/* 탄약 · 소지품 칸: 각자 들 수 있는 양이 정해져 있음 (한 칸 = 총알 20 · 화살 30 · 산탄 8). 칸 수는 덩치 (무게)로 — 소천사녀 5칸 · 카리우스 10칸, 군인은 +1 */
const AMMO_SLOT = { bullet: 20, arrow: 30, shell: 8 };
const packSlots = u => { const k = PACK_HERO[u.kind]; if (k === 'inju') return bagCap(); if (k && BAG_CAP[k]) return BAG_CAP[k]; return Math.min(10, Math.max(4, Math.round(4 + (u.D.weight || 60) / 40))) + (u.sol && u.sol.tag === 'soldier' ? 1 : 0); };
const packUsed = u => Object.entries(u.sol.ammo).reduce((s, [k, n]) => s + Math.ceil(n / AMMO_SLOT[k]), 0);
```

훈련 창 UI: `소지품 3/8칸 · 총알 40 [−][+] · 화살 0 [−][+] …` 처럼 칸 단위 +/− 버튼. 가득이면 "소지품 칸이 가득".

---

## 3. 장비 칸 · 끼우기 · 벗기기 · 바꿔 쥐기

### 3-1. 칸 7개

```js
const SLOTS = ['weapon', 'off', 'head', 'body', 'legs', 'acc1', 'acc2'];
const ONE_HAND = new Set(['sword', 'dagger', 'axe', 'hammer', 'pistol', 'spear']);   // 보조 칸에 들 수 있는 무기 (방패는 보조 칸 전용)
```

- weapon 무기 · off 보조 (방패 또는 한손 무기) · head 머리 · body 몸 · legs 다리 · acc1 · acc2 장신구 둘
- 방패는 데이터상 `c: 'weapon', wt: 'shield'`이고 보조 칸으로만 감. 보조 칸 방패 = 막기 +15%
- 보조 칸의 한손 무기는 공격력에 안 더해짐 (카리우스만 예외)

```js
for (const s of SLOTS){ const it = h.eq[s]; if (!it) continue; const S = itemStats(it); if (s !== 'weapon' && !(s === 'off' && itemDef(it).wt !== 'shield' && h.id !== 'karius')) atk += S.atk; def += S.def; … }
```

### 3-2. 인물마다 다른 규칙 (고유 무기 · 들 수 있는 무기)

```js
const HERO_DEF = {
  // innate: 고유 무기 (칸이 비면 이걸로 싸움, 벗길 수 없음) · wts: 들 수 있는 무기 (shield = 보조 칸 방패)
  inju:   { name: '인주', …, weapon: 'O-player-weapon', note: '말이 없음. 든 무기로 싸움', innate: '맨손', wts: 'all' },
  cheong: { name: '청광묵', …, innate: '청광묵의 손톱', wts: ['dagger', 'sword', 'axe', 'spear', 'bow', 'crossbow', 'pistol', 'shield'] },
  karius: { name: '카리우스', …, innate: '카리우스의 손 (여덟 팔)', wts: ['hammer', 'axe', 'greatsword', 'shield'] },
};
HERO_DEF.goodwill.innate = '번개 주먹'; HERO_DEF.goodwill.wts = [];          // gear.js: GOOD WILL은 주먹뿐
HERO_DEF.rebecca = { name: '레베카', …, innate: '낡은 장검', wts: ['sword', 'greatsword', 'spear', 'shield'] };
```

- 인주: 무엇이든. 시작 무기 '어부의 창' (O-player-weapon, 3등급 유물)
- 청광묵: 단검 · 검 · 도끼 · 창 · 활 · 석궁 · 권총 · 방패
- 카리우스: 망치 · 도끼 · 대검 · 방패. 보조 칸에 아무 무기 (팔이 여덟, 둘 다 공격에 더함). 몸 · 다리 갑옷 불가 (투구는 됨)
- 레베카: 검 · 대검 · 창 · 방패
- GOOD WILL: 무기 없음 (방어구 · 장신구만)
- 굴 식구 (포획 · 동행 · 기원으로 온 인물, `HERO_DEF['x_' + slug]`): wts가 없어 무기 못 듦, 방어구 · 장신구만
- 무기 칸이 비면 장비 인형 칸에 "고유 / 청광묵의 손톱" 같은 글이 금색으로 보임

```js
function canEquip(h, it, slot){
  const d = itemDef(it);
  if (d.s === 'weapon'){
    if (!canWield(h, d.wt)) return false;
    if (slot === 'off') return h.id === 'karius' || d.wt === 'shield' || ONE_HAND.has(d.wt);
    return true;
  }
  if (h.id === 'karius' && (d.s === 'body' || d.s === 'legs')) return false;
  return ['head', 'body', 'legs', 'acc'].includes(d.s);
}
function whyNot(h, it){ … `${h.name}는 ${WT_N[d.wt] || '이것'}을 못 다룸` … '카리우스 몸에 맞는 갑옷은 없다 (투구만)' : '끼울 수 없음'; }
```

못 끼우면 버튼 자리에 이유가 적힌 꺼진 버튼이 나옴 (예: "카리우스는 활을 못 다룸").

### 3-3. 칸 자동 고르기 · 끼우기 · 벗기기

```js
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
  if (old) from.push(old);      // 원래 것은 꺼낸 목록으로 (맞바꿈이라 칸 수 그대로)
  refreshHero(h);
  return true;
}
function unequip(h, slot, to = RPG.bag){
  const it = h.eq[slot]; if (!it) return false;
  if (to.length >= listCap(to)) return false;
  h.eq[slot] = null; to.push(it); refreshHero(h); return true;
}
```

- 벗길 때: 굴에서 배낭이 차 있으면 보관함으로 감, 원정에서 차 있으면 "가방이 가득"
- 장비를 바꾸면 `refreshHero` → 전투 인물 수치 다시 계산 (체력 비율 유지) + 저장

### 3-4. 동료끼리 주고받기

가방 칸을 고르면 아래 버튼에 "청광묵에게 · 카리우스에게 …" (RPG.party에 있는 다른 영웅마다). 원정 중엔 살아 있는 동료에게만:

```js
if (sel.from === 'bag') for (const k of RPG.party) if (k !== h.id && RPG.heroes[k] && !(G.mode === 'exp' && !G.units.some(o => o.hero === RPG.heroes[k] && !o.dead))) btn.push(['give:' + k, `${RPG.heroes[k].name}에게`]);
else btn.push(['drop', '버리기']);
…
else if (a.startsWith('give:')){ const to = hero(a.slice(5)); if (moveItem(it, bagOf(h), bagOf(to))) UIR.sel = null; }
```

- 넘겨주기 = 배낭 → 배낭 이동. 받는 쪽이 차 있으면 "가방이 가득"
- 장비를 다른 동료에게 끼우려면: 왼쪽 원정대 목록에서 그 동료를 고름 → 그 동료 배낭에 있는 장비를 "끼우기". 즉 "넘겨주기 → 받은 사람 화면에서 끼우기" 두 단계
- 주의 (코드 버릇): 위 `else`가 안쪽 `if`에 붙어서, '버리기' 버튼은 "넘겨줄 수 없는 원정대원" 수만큼 생김 (보통 자기 자신 하나). 보관함에서 고른 것엔 '버리기'가 안 나옴
- 버리기: 원정 중이면 발밑에 떨어뜨림 (다시 주울 수 있음), 굴에서는 그냥 사라짐

### 3-5. 무기 ↔ 보조 무기 바꿔 쥐기 (인주, X 키)

```js
function gearSwapInput(u){
  if (!hit('KeyX') || G.lock || u.lock || u.downed) return false;
  const h = u.hero, off = h.eq.off, main = h.eq.weapon;
  if (!off || itemDef(off).wt === 'shield'){ popText(…, '보조 무기가 없다', 'miss', 0.7); return true; }
  if (main && !ONE_HAND.has(itemDef(main).wt)){ popText(…, '양손 무기는 보조 칸에 못 넣음', 'miss', 0.9); return true; }
  h.eq.weapon = off; h.eq.off = main || null; refreshHero(h);
  popText(…, `바꿔 쥠: ${itemDef(off).n}`, 'aim', 0.9); SFX.clink && SFX.clink(0.4);
  return true;
}
```

훈련장 동료는 거리로 자동 바꿔 들기 (sol.js): 적이 2.2칸 안이면 원거리를 등에 메고 근접, 3.4칸 넘게 벌어지면 다시 꺼냄. 걸리는 시간은 적성 (`APT.swap = [1.1, 0.8, 0.6, 0.45, 0.3, 0.15]`초).

### 3-6. 세트 효과

```js
const sets = {}; for (const s of SLOTS){ const it = h.eq[s]; const st = it && itemDef(it).fx && itemDef(it).fx.set; if (st) sets[st] = (sets[st] || 0) + 1; }
if (sets.pehto >= 3) add('atkP', 20); if (sets.sage >= 3){ add('magic', 30); add('skillCd', 15); } if (sets.wolf >= 2) add('rally', 8);
```

페흐토 (망토 · 장검 · 투구) · 현자 (로브 · 모자 · 완드) · 늑대 기사단 (방패 · 흉갑).

---

## 4. 수치 계산 (장비가 실제로 먹는 방식)

`derive(h)`가 속성 5개 (힘 str · 민첩 dex · 체력 vit · 정신 wil · 감각 per) + 장비 + 유물을 합쳐 파생 수치를 만듦. 요점만:

```js
S.maxHp = Math.round(H.hp0 + A.vit * 8 + (h.lv - 1) * 6 + n('hp'));            // 인주
const bonus = !wt || MELEE.has(wt) ? A.str * 1.0 : wt === 'staff' ? A.wil * 1.2 : wt === 'bow' || wt === 'crossbow' ? A.dex * 0.8 + A.per * 0.2 : A.per * 0.6 + A.dex * 0.2;
S.atk = Math.round((wAtk + bonus + G2.atk) * (1 + n('atkP') / 100) * …);
S.def = Math.round(G2.def * (1 + n('defP') / 100));
S.crit = Math.min(0.75, 0.05 + A.per * 0.004 + n('crit') / 100);
S.eva = Math.min(h.id === 'inju' ? 0.25 : 0.5, A.dex * 0.003 + n('eva') / 100);
S.carry = 12 + n('carry');
S.quick = 4 + (fx.quick ? 1 : 0);
```

- 동료는 무기 공격의 80%만 더함: `(w ? itemStats(w).atk * 0.8 : 0)`
- 방어는 비율 감소: `base *= 1 - def / (def + 40)` (방어 40 = 피해 절반). 상태 탭 · 장비 창에 "(−33%)"처럼 같이 보임
- 카리우스 피로 (rotation.js): 원정마다 +1 (최대 4), 하나당 최대 체력 −8%

---

## 5. 소모품 (물약 · 약 · 음식 · 도구) · 빠른 칸

### 5-1. 쓰기

`useItem(it, u)`가 `fx` 키를 차례로 보고 해당하는 것을 모두 적용, 하나라도 됐으면 1개 줄이고 저장. 못 쓰면 "지금은 쓸 수 없다".

```js
if (fx.hp){ heal(fx.hp * pm); used = true; }
if (fx.hpP){ heal(u.max * fx.hpP / 100 * pm); used = true; }
if (fx.san){ … '정신도 +' … }
if (fx.cure){ if (u.sts) for (const k of ['bleed', 'burn', 'poison', 'slow']) if (u.sts[k]) u.sts[k].t = 0; used = true; }
if (fx.regen){ u.regenFx = { v: fx.regen.v * pm, t: fx.regen.dur }; used = true; }
if (fx.revive){ … 쓰러진 동료를 일으킴 (없으면 내 체력 30%) … }
if (fx.partyHeal){ … 원정대 모두 … }
…
removeItem(it, RPG.bag, 1);
```

- `pm` = 물약 효과 보너스 (`potionP` 효과)
- 쓰는 대상: 장비 창에서 고른 영웅의 전투 인물 (없으면 인주)
- 소모품 종류 (실제 데이터):
  - 물약 (potion, 한 칸 5개): 빨간 물약 체력 40% · 큰 것 80% · 파란 물약 정신도 +30 · 초록 물약 상태 이상 씻기 + 10초 회복 · 보라 물약 도박 · 캔음료 POW 25초 이동 · 공격 속도 버프
  - 소모품 (use): 붕대 (출혈 멎음, 체력 +15, 10개) · 은실 바늘 (꿰매기, 심장 · 목 치명상 3일 단축) · 흰 구급상자 (부활) · 빨간 구급상자 (원정대 30%) · 수류탄 · 얼음 상자 · 검은 종 (적 멍해짐) · 호루라기 (동료 모음) · 촛불 · 열쇠 꾸러미 · 해골거울 (즉시 귀환) · 혈청 · 뇌수액 (영구 강화) …
  - 식량 (food, 10개): 고기 체력 +30 · 굴에서는 끼니 2 / 빵 · 생선 · 사과 · 치즈 · 컵라면 … (`fx.food` = 굴 끼니 수)
  - 빛 (light): 횃불 +240초 · 기름 등잔
  - 책 · 지도 (book): 양피지 · 태블릿 (층 지도) · 보물 지도 · 수정구 (적까지) · 책 (경험) · 마법서 (정신 +1 영구)
  - 도구 (tool, 쓰기 버튼 없음 — 가방에 있기만 하면 작동): 곡괭이 · 삽 (무덤 빨리 팜) · 망치 (잠긴 상자 부숨) · 렌치 (자물쇠 +20%) · 밧줄 · 돋보기
  - 열쇠 (key): 금 열쇠 (보물 상자) · 은 열쇠 (문)
- 상처 쪽 덧씌움 (wounds.js): 붕대 · 초록 물약 같은 `cure`는 피만 멈추고, 은실 바늘 (I-246)만 치명상 날짜를 줄임

### 5-2. 빠른 칸 4개 (키 4 ~ 7)

```js
RPG.quick: [null, null, null, null]   // 아이템 id를 기억 (uid 아님) — 같은 종류 아무거나 씀
function autoQuick(it){
  const d = itemDef(it); if (!['potion', 'use', 'food'].includes(d.c)) return;
  if (RPG.quick.includes(it.id)) return;
  const i = RPG.quick.indexOf(null); if (i >= 0) RPG.quick[i] = it.id;
}
```

- 물약 · 소모품 · 식량을 주우면 빈 칸에 자동 등록
- 장비 창에서 고른 뒤 "칸 4 · 칸 5 · 칸 6 · 칸 7" 버튼으로 직접 지정 (지정된 칸엔 ✓)
- 빠른 칸은 인주 가방 `RPG.bag`에서만 찾음 (동료 배낭 것은 안 됨)
- N 키 = 바로 먹기 (원정: 가방의 첫 음식, 굴: 창고 끼니)
- `S.quick = 4 + 1` (소모품 칸 +1 효과)이 계산은 되지만 배열 길이는 4로 고정 — 실제로는 안 늘어남

---

## 6. 탄약 · 화살

### 6-1. 공용 카운터

```js
const AMMO_OF = { bow: 'arrow', crossbow: 'arrow', pistol: 'bullet', lever: 'bullet', assault: 'bullet', shotgun: 'shell' };
const AMMO_N = { arrow: '화살', bullet: '총알', shell: '산탄', cell: '광선' };
```

- 원정 · 굴: `RPG.ammo`는 원정대 공용. 가방 칸을 안 차지함. 탄약 상자를 주우면 바로 숫자로 들어감 ("+15 화살")
- 동료의 활 · 총도 같은 공용 탄을 씀. 떨어지면 고유 무기로 붙어 싸움

```js
if (!(RPG.ammo[am] > 0)){ if (!u.noAmmoSaid){ u.noAmmoSaid = true; popText(…, `${AMMO_N[am]} 없음 — ${HERO_DEF[u.hero.id].innate || '손'}으로`, 'miss', 1.4); } return false; }
```

### 6-2. 탄창 · 재장전 (총 · 석궁)

- 무기 종류마다 탄창: 권총 6 · 레버액션 8 · 산탄총 2 · 돌격소총 30 · 석궁 1 (쏠 때마다 장전)
- R = 재장전. 공용 탄에서 모자란 만큼 빼서 아이템의 `mag`에 채움

```js
const am = ammoKind(w), need = w.mag - w.it.mag, got = am ? Math.min(need, RPG.ammo[am] || 0) : need;
if (am) RPG.ammo[am] -= got; w.it.mag += got;
```

- 활은 탄창 없이 한 발마다 `RPG.ammo.arrow--`
- 지팡이 (staff) · 돌팔매 (sling 변형)는 탄 없음

### 6-3. 화살은 다시 주움, 총알은 사라짐

```js
/* · 화살: 맞으면 몸에 박힌 채 보임 → 죽으면 둘레에 떨어짐 (일부 부러짐). 갑옷 · 방패 · 막기에 맞으면 튕겨 나가 바닥에. 빗나가면 바닥 · 벽에 꽂힘. 위를 지나가면 주움
   · 총알 · 산탄: 탄창 · 재장전 (R). 쏘면 사라짐 (못 주움) */
for (const m of u.stuck){ … if (Math.random() < 0.7){ … groundArrow(…) } }     // 30%는 부러짐
if (p.kind === 'arrow'){ RPG.ammo.arrow = (RPG.ammo.arrow || 0) + p.n; popText(p.x, 1.2, p.z, '+화살', 'heal', 0.6); }
```

- 궁수 적을 죽이면 50%로 화살 2~4개가 떨어짐
- 던진 창 · 도끼는 주워야 다시 씀 (`P.spear` 표시). 적에 박힌 것은 다가가면 바로 뽑음 (gore.js). `boomerang` 효과면 저절로 돌아옴

### 6-4. 탄약 구하기

- 원정 바닥 · 상자 · 상점 (탄약 묶음 총알 +12 · 탄 무더기 +30 · 샷건탄 +8 · 화살통 +15 · 탄약상자 총알 40 + 산탄 10 · 배터리)
- 굴 일꾼 '화살 깎기': 밤마다 땔감 6 → 조잡한 화살 10. 총알 · 산탄은 굴에서 못 만듦 (상점 · 원정에서만)

```js
fletch: { n: '화살 깎기', d: '밤마다 조잡한 화살 10 (땔감 6을 씀)', out: () => { if ((PRO.wood || 0) < 6) return '땔감이 없어 화살을 못 깎음'; PRO.wood -= 6; RPG.ammo.arrow = (RPG.ammo.arrow || 0) + 10; return '조잡한 화살 +10'; } },
```

UI: 장비 창 머리에 `화살 12 · 총알 30 · 산탄 0 · 광선 0 · 금화 154`, 스킬 줄에 `[R] 4/6 총알 30` + 재장전 막대, 툴팁에 `탄약: 총알 (지금 30) · 탄창 6`.

---

## 7. 전리품 줍기 흐름 (원정)

### 7-1. 어디서 나오나 (확률 그대로)

- 적을 쓰러뜨림 (`expOnKill`)
  - 70%: 금화 (층 · 강적이면 ×3)
  - 20% (강적 100%): 아이템 하나 — 강적은 절반이 장비 (+1 등급), 나머지 소모품
  - 잡몹 2%: 장비
  - 강적 방을 다 비우면 보상 상자 (+1 등급)
- 상자: 1~2개 (+보너스면 하나 더) + 70% 금화. 잠긴 상자는 금 열쇠 → 망치 (시끄러워 적이 깸) → 자물쇠 따기 (민첩) 순서
- 무덤 파기: 55% 아이템 · 27% 송장이 일어남 · 나머지 빈 무덤 (정신도 −)
- 시체 뒤지기: 65% 아이템 (대개 소모품) · 아니면 금화. 정신도 −3
- 제단 · 인카운터 카드 선택 (rogue.js): 유물 · 장비 · 소모품 · 금화

```js
if (Math.random() < 0.7) dropLootAt(u.x, u.z, { gold: Math.round((2 + Math.random() * 4) * (1 + F * 0.6) * (u.elite ? 3 : 1)) });
if (Math.random() < (u.elite ? 1 : 0.2)){ const gear = u.elite && Math.random() < 0.5; dropLootAt(u.x, u.z, rollItem(F, { type: gear ? 'gear' : 'cons', bonus: u.elite ? 0.25 : 0, plus: gear ? 1 : 0 })); }   // v1.17 강적은 절반만 장비
if (!u.elite && Math.random() < 0.02) dropLootAt(u.x, u.z, rollItem(F, { type: 'gear' }));   // v1.17 6% → 2%
```

### 7-2. 무엇이 나오나 (`rollItem`)

- 갈래: 장비 46% · 소모품 ~43% · 유물 ~11%
- 소모품은 표 `LOOT.cons = [id, 무게, 최소 층]` (예: `['I-037', 10, 1]` 빨간 물약)
- 장비 · 유물 등급은 층 F가 깊을수록 높아짐. 행운 (`luck`) 효과로 위 등급 가중
- 보스 장비 (B- · EQ-60x)는 보스만. 6등급 유물은 7층부터, 같은 것은 한 번만

```js
const w = [Math.max(0, 30 - 6 * F), Math.max(4, 40 - 2.5 * F), 22 + 2 * F, 6 + 2.6 * F, 1 + 1.5 * F, Math.max(0, (F - 3) * 0.9), 0];
```

### 7-3. 바닥에서 줍기

- `dropLootAt`: 아이템 아이콘이 0.45초 동안 포물선을 그리며 튀어나와 바닥에 떠 있음. 발밑에 등급 색 고리, 3등급 이상은 빛기둥, 5등급 이상은 소리
- 금화는 작은 금색 원판
- 걸어서 0.85칸 안에 들어가면 자동으로 주움 (E 필요 없음). 인주 가방 → 동료 배낭 순서. 모두 차면 바닥에 남고 3초마다 한 번 "모두의 가방이 가득 (I로 정리)"
- 주운 것: 오른쪽 위 알림 (등급 색 이름 · 갈래), 소모품은 빠른 칸 자동 등록, `EXP.got`에 기록 (결과 화면용)

```js
if (Math.hypot(pl.x - o.x, pl.z - o.z) > 0.85) return true;
if (o.gold){ RPG.gold += o.gold; popText(o.x, 1.2, o.z, `+${o.gold} 금화`, 'gold', 0.8); … return false; }
const d = itemDef(o.it), res = addItem(o.it) || addToParty(o.it);
if (!res){ if (G.t - (EXP.fullT || -9) > 3){ EXP.fullT = G.t; popText(pl.x, pl.y + 2.4, pl.z, '모두의 가방이 가득 (I로 정리)', 'miss', 1.4); } return true; }
EXP.got.push(o.it.id);
if (res.put || res.stacked){ if (typeof uiToast === 'function') uiToast(itemLine(o.it), 'loot r' + (d.r || 0)); autoQuick(o.it); }
```

알림 한 줄:

```js
function itemLine(it){ const d = itemDef(it); return `<span class="r${d.r || 0}">${d.n}</span>${it.n > 1 ? ` ×${it.n}` : ''} <small>${CAT_N[d.c] || ''}${d.wt ? ' · ' + WT_N[d.wt] : ''}</small>`; }
```

알림 상자 (#toasts): 오른쪽 위에서 위로 쌓임, 최대 6개, 3.6초 뒤 오른쪽으로 사라짐. 3 · 4등급은 보라 테두리, 5 · 6등급은 금색 테두리 + 빛.

### 7-4. 돌아오기 · 전멸

- 생환: 가방 · 배낭 그대로. 식량 · 땔감 · 달팽이 먹이 효과가 있는 것은 가방에서 빠져 굴 창고로 (자동 정산)
- 전멸: 인주 가방 + 동료 배낭 전부가 그 층 바닥에 (`RPG.lost`). 장비 칸에 낀 것은 안 잃음. 3일 안에 같은 층에 가면 '잃어버린 가방' (지도에 ✚)을 주워 되찾음

```js
RPG.lost = { F: EXP.F, items: RPG.bag.slice().concat(comp), day: PRO.day }; RPG.bag = [];
if (RPG.lost && RPG.lost.F === F && PRO.day - RPG.lost.day <= 3) placeLostBag(gen);
```

### 7-5. 굴 쪽 줍기 (손으로 나르기)

- 매일 '오늘의 낙하'로 물건 4~6개가 떨어짐 (`DROP_TABLE` 가중 표: 가구 · 식량 · 가축 · 보급 · 장비 · 잡동사니)
- 바닥 물건은 E로 "든다" — 한 번에 하나만 (`PRO.carry`). 창고 자리 · 구덩이 (쓰레기) · 모닥불 (땔감) · 우리 (돼지)로 가져가 놓음
- 동료도 가만히 있을 때 알아서 들어 나름. 밤사이 남은 식량 · 보급은 창고로, 잡동사니는 구덩이로 자동 정리
- 창고 '장비' 줄의 "장착"을 누르면 RPG 아이템으로 바뀌어 인주 가방에 들어간 뒤 바로 끼워짐

```js
it.insp = { …, get label(){ return PRO.carry ? '한 번에 하나만 들 수 있음' : `${eul(d.name)} 든다`; }, … fn: () => { if (PRO.carry || it.carrier) return; pickUp(it, G.player); } };
```

---

## 8. 이름 짓기 규칙

- 대부분 도감 그림을 보고 붙인 "꾸밈말 + 꾸밈말 + 물건" 꼴, 평균 3.7 어절
  - "은빛 장식 흑철 장검" · "붉은 나무 손잡이 네 총신 권총" · "어금니 장식 민트 누빔 가방" · "지퍼 달린 주황 헬멧" · "자수정 조각 라벤더 치마"
  - 끝말 순위: 흉갑 · 투구 · 망토 · 바지 · 권총 · 치마 · 창 · 활 · 도끼 · 재킷 · 조끼 · 드레스 …
- 기본 장비는 "낡은 + 종류": 낡은 검 · 낡은 창 · 낡은 방패 · 낡은 레버액션 소총 (W- id)
- 이름 있는 물건은 "누구의 + 물건": 페흐토의 장검 · 현자의 로브 · 노인의 왕관 (세자르) · 발용의 대검 · 어떤 왕의 단도 · 오딜의 장미장식 · 대족장의 화살촉
- 펫은 "펫: 이름" (펫: 꼬마마녀요정)
- 같은 그림 다른 칸은 뒤에 숫자 ("횃불 2" · "가죽 2" · "밧줄 2" · "보물 지도 2")
- 설명 `d`는 "이름. 효과" 꼴 (상점은 앞의 "이름. "을 잘라 효과만 보임) + 가끔 짧은 이야기 한 줄
  - "누구의 목을 그었는지는 아무도 말하지 않는다" · "거울 속 얼굴이 가끔 늦게 웃는다" · "어떻게 여기까지 왔을까"
- 효과 태그는 꺾쇠: `<축복: 바다>` · `<특공: 신성>` · `<축복: 오딜>`
- 등급 이름 (낡은 · 평범한 · 좋은 · 명품 · 영웅 · 전설 · 보스)은 이름에 붙이지 않고 툴팁 둘째 줄에만 ("명품 장검 · 유물")
- id 접두: EQ- 도감 장비 604 · R / R-S / R-E 유물 151 · I- 소모품 · 잡화 135 · E (EW · EA) 장비 55 · W- 기본 무기 10 · B- 보스 3 · O-player-weapon 시작 창
- 조사 처리 함수가 따로 있음 (받침에 따라 을/를): `eunNeun(w)` · `eul(w)` · `eulOf(s)`

---

## 9. 값 · 화폐 · 상점

### 9-1. 금화

- 하나뿐인 화폐 `RPG.gold`. 아이템 정의 `g` = 값
- 들어오는 길: 적 · 상자 · 무덤 · 시체 · 금화 더미 아이템 (주우면 바로 숫자: 금화 더미 25~60 · 은화 더미 8~20) · 인카운터 (입을 닫으면 60 × 층 · 펄 80 × 층) · 카리우스가 굴을 파다 캠 (4~12)
- 나가는 길: 상점 · 동료 기원 (낙하 기원: 첫 번 무료 → 60, 빌 때마다 +40, 사흘에 한 번)
- 꼬마악마 (foeDevil)가 때리면 금화를 훔쳐 감 (8 + 층 × 최대 12)
- 결과 화면에 이번 원정 금화 증감 표시

### 9-2. 상점 (사기만, 값 = g × 1.5, 최소 5)

```js
// 상점 (게 요리사): 금화로 산다. 값 = 아이템 값 × 1.5
function encShop(who, ids){
  …
  ids.map(id => { const d = ITEMS[id], g = Math.max(5, Math.round((d.g || 10) * 1.5)); return `<a class="shop-it" data-buy="${id}" … ${RPG.gold < g ? 'opacity:.4' : ''}">${d.n} — <b …>${g} 금화</b> <small …>${d.d ? d.d.replace(d.n + '. ', '') : ''}</small></a>`; })
  …
  { … if (RPG.gold < g) return; if (!addItem(makeItem(id))){ popText(…, '가방이 가득', 'miss', 1); return; } RPG.gold -= g; … draw(); }
}
```

- 게 요리사 (원정 2~8층 인카운터, '상인의 길'을 고르면 반드시): 고기 · 햄 · 컵라면 · 빨간 물약 · 붕대 · 횃불 · 파란 물약. 처음 만나면 초상화 대화 "어서 오십시오. 따끈한 게 있습니다." / "재료요? …묻지 않는 편이 맛있습니다."
- 아이텐의 토끼마차 (굴 손님, 사흘마다 아침, 적뢰전 뒤부터, 그날 하루만): 그날 고른 장비 셋 (+15% 행운) + 탄약 묶음 · 샷건탄 · 화살통 · 빨간 물약 · 붕대 · 횃불

```js
function wagonStock(){
  if (!RPG.meta.wagon || RPG.meta.wagon.day !== PRO.day){
    lootPools(); const F = Math.max(1, Math.min(10, (RPG.depth || 1) + 1)), gear = [];
    for (let i = 0; i < 3; i++) gear.push(rollItem(F, { type: 'gear', bonus: 0.15 }));
    RPG.meta.wagon = { day: PRO.day, gear };
  }
  return RPG.meta.wagon.gear.concat(['I-282', 'I-283', 'I-285', 'I-037', 'I-061', 'I-104']);
}
```

- 상점에서 산 장비는 새로 굴림 (`makeItem`) — 품질 · 덧붙은 효과가 살 때 정해짐
- 파는 기능 · 물물교환은 없음. 데이터에 판매 흔적만: 재료 설명 "상인에게 팔거나…" · "비싸게 팔림", 효과 플래그 `sell: '비싸게 팔림'` · `shopDisc: '상점 할인'` (쓰는 코드 없음)
- 인카운터 '나그네'에게 "보급을 나눠 준다" (정신도 +10 · 층 지도)는 교환 비슷한 선택지지만 아이템이 실제로 빠지지는 않음

### 9-3. 상점 화면

확인 창 (#confirm 안의 .cf-box, 가로 min(520px, 92vw)) 재사용:
- 머리: 상인 이름 (도현체 24px 금색) · "금화 154 · 가방 7/12"
- 몸: 물건 한 줄씩 (테두리 칸, 금화가 모자라면 흐리게): "빨간 물약 — 38 금화 체력 40% 회복"
- 아래: "그만 (Esc)"
- 누를 때마다 바로 사고 다시 그림 (수량 선택 · 확인 단계 없음)

---

## 10. 인벤토리 화면 (I 창) 생김새

### 10-1. 열기 · 닫기

- I 또는 B로 열고 닫음. Esc로도 닫힘. 열려 있는 동안 게임 멈춤 (`G.paused = true`)
- 원정 준비 창의 "장비 (I)" 버튼, 스킬 줄 오른쪽 끝 "[I] 가방 7/12" 칸, 손가락 화면의 위 줄 가방 버튼으로도 열림
- 프롤로그 중엔 안 열림

### 10-2. 틀 (가로 3단 + 아래 띠)

```
┌ rw-head ───────────────────────────────────────────────────────────────┐
│ [가방 · 장비] [상태 ●]           화살 12 · 총알 30 · 산탄 0 · 광선 0 · 금화 154  [처음부터] [닫기 (I)] │
├ rw-main (grid: 190px | 1fr | 360px) ───────────────────────────────────┤
│ 원정대 목록      │      장비 인형 (320×300)          │ 가방 7/12            │
│ [얼굴 44px]      │   [머리]                          │ ▢▢▢▢▢▢  (6열, 54px)  │
│  인주 Lv 3 +3    │ [몸]      (얼굴 110px 원)  [무기] │ ▢▢▢▢▢▢               │
│  체력 막대       │           인주            [보조]  │                      │
│  경험 막대       │           설명 한 줄       [장신구]│ 보관함 23 (굴에서만) │
│ [청광묵]         │ [다리]                            │ ▢▢▢▢▢▢ (최대 180px,  │
│ [카리우스] …     │        [장신구]                   │         스크롤)      │
│                  │ 체력 · 공격 · 방어 · 치명 · 회피 ·  │                      │
│                  │ 시야 · 정신도 · 이동 (2열 표)     │                      │
├ rw-foot (grid: 1fr | auto) ───────────────────────────────────────────┤
│ 툴팁 (고른 것 설명)                                  │ [인주에게 끼우기]  │
│                                                      │ [보조 칸으로]      │
│                                                      │ [쓰기] [칸 4 ~ 7]  │
│                                                      │ [보관함으로] …     │
└────────────────────────────────────────────────────────────────────────┘
```

CSS 원문 (자리 잡기):

```css
.rw-box{width:min(1080px,96vw);max-height:94vh;display:flex;flex-direction:column;background:linear-gradient(180deg,rgba(22,17,28,.98),rgba(10,8,14,.99));border:1px solid var(--gold);border-radius:12px;…}
.rw-main{display:grid;grid-template-columns:190px 1fr 360px;gap:12px;padding:12px 14px;min-height:0;overflow:auto;}
.rw-doll{position:relative;width:320px;height:300px;}
.rw-slot{position:absolute;width:60px;height:60px;border:1px dashed rgba(232,194,122,.35);border-radius:8px;…}
.s-head{left:130px;top:0;} .s-body{left:20px;top:80px;} .s-legs{left:20px;top:170px;} .s-weapon{right:20px;top:20px;} .s-off{right:20px;top:100px;} .s-acc1{right:20px;top:180px;} .s-acc2{left:130px;top:236px;}
.rw-grid{display:grid;grid-template-columns:repeat(6,54px);gap:5px;} .rw-grid.st{max-height:180px;overflow:auto;}
.rw-foot{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start;padding:10px 14px 14px;border-top:1px solid var(--line);min-height:120px;}
```

- 가방 칸은 용량만큼 빈 칸을 미리 그려 둠 (빈 칸도 보임 → 남은 칸이 눈에 보임)
- 왼쪽 원정대 목록을 누르면 가운데 인형 · 오른쪽 배낭이 그 동료 것으로 바뀜 ("청광묵의 배낭 3/8")
- 굴에서만 보관함 구역이 배낭 밑에 붙음 (비었으면 "비었음 — 원정에서 가져온 장비를 넣어 두는 곳")
- 색 테마: 짙은 보라 검정 바탕 · 금색 (--gold #e8c27a) 테두리 · 제목 도현체 · 본문 나눔고딕

### 10-3. 아이콘 칸

```js
function iconHtml(it, size = 48, extra = ''){
  const d = itemDef(it), r = d.r || 0;
  return `<div class="ic r${r}${extra}" style="width:${size}px;height:${size}px"><i style="${iconCss(d, size - 6)}…"></i>${it.n > 1 ? `<em>${it.n}</em>` : ''}${it.mag != null && W.def.it === it ? `<u>${it.mag}</u>` : ''}</div>`;
}
```

- 등급 색 테두리 2px (4등급 이상은 안쪽 빛, 5 · 6등급은 바깥 빛까지)
- 오른쪽 아래 개수 (2개 이상), 왼쪽 위 노란 글씨 = 지금 든 총의 탄창
- 아이콘은 스프라이트 시트에서 background-position으로 잘라 씀

### 10-4. 고르기 · 행동 (끌어 놓기 없음)

- 칸을 한 번 누름 → 선택 (흰 테두리) + 아래 툴팁 · 버튼
- 같은 칸을 두 번 누름 (`e.detail >= 2`) → 바로 행동: 장비면 끼우기, 소모품이면 쓰기, 보관함 칸이면 가방으로
- 장비 칸을 누르면 그 장비 설명 + "벗기기"
- 아무것도 안 골랐을 때 안내: "칸을 누르면 설명 · 두 번 누르면 바로 끼우기 / 쓰기"

버튼 목록 (고른 것에 따라):

| 조건 | 버튼 |
|---|---|
| 장비 칸에서 고름 | 벗기 |
| 끼울 수 있는 장비 | (이름)에게 끼우기 · (한손 무기면) 보조 칸으로 |
| 못 끼우는 장비 | 이유가 적힌 꺼진 버튼 |
| 물약 · 소모품 · 식량 · 책 · 빛 | 쓰기 |
| 물약 · 소모품 · 식량 | 칸 4 · 칸 5 · 칸 6 · 칸 7 |
| 굴에서 | 보관함으로 / 가방으로 (배낭으로) |
| 가방에서 고름 | (동료 이름)에게 … · 버리기 |

### 10-5. 툴팁

```js
let h = `<div class="tp-n r${r}">${d.n}</div><div class="tp-t">${RAR[r].n} ${d.wt ? WT_N[d.wt] : CAT_N[d.c] || ''}${…' · ' + SLOT_N[d.s]…}${d.relic ? ' · 유물' : ''}</div>`;
if (d.atk){ … main.push(`<b>공격 ${S.atk}</b>${q !== 1 ? ` <small>(품질 ${Math.round(q * 100)}%)</small>` : ''}${c != null ? diff(S.atk - c) : ''}`); }
…
h += `<div class="tp-g">값 ${d.g || 0} 금화</div>`;
function diff(v){ if (!v) return ' <small class="eq">=</small>'; return v > 0 ? ` <small class="up">▲${v}</small>` : ` <small class="dn">▼${-v}</small>`; }
```

순서: 이름 (등급 색, 20px) → "명품 장검 · 유물" → 공격 / 방어 (품질 %, 지금 낀 것과 비교 ▲초록 ▼빨강 =회색) → 효과 줄 (기본 효과 흰 하늘색, 덧붙은 효과 파랑, 세트 초록) → 무기 기술 설명 (금색 왼쪽 선 상자) → 설명 (기울임) → 탄약 줄 → "값 87 금화"

### 10-6. 상태 탭

- 속성 다섯 줄: 이름 (금색) · 값 (장비 포함 값은 괄호) · 설명 · 남은 점수가 있으면 [+] 버튼 (레벨마다 3점, 동료는 성격대로 자동 분배)
- 파생 수치 3열 표 (최대 체력 · 공격 · 방어 (피해 감소%) · 치명 · 배율 · 회피 · 공격 속도 · 스킬 대기 · 재장전 · 시야 · 정신도 · 정신도 감소 · 이동 · 흡혈 · 초당 회복 · 가시 · 푸른 체력 · 가방 N칸)
- 무기 기술 상자 (인주: 든 무기의 기본 공격 · 우클릭 기술 설명 / 동료: 고유 무기 · 들 수 있는 무기 목록 · "탄약이 있으면 거리를 두고 쏨")
- 고유 기술 그림 · 칭호 (titles.js)

### 10-7. 모바일 · 좁은 화면

```css
@media (max-width:820px){ .rw-main{grid-template-columns:1fr;} .rw-party{flex-direction:row;overflow:auto;} .rw-h{min-width:150px;} .rw-mid.wide{grid-column:auto;} .rw-grid{grid-template-columns:repeat(6,46px);} .rw-cell{width:46px;height:46px;} … }
```

- 820px 이하: 3단이 세로 1단으로, 원정대 목록은 가로 스크롤 줄, 칸 54 → 46px
- 손가락 화면 (touch.js, `pointer: coarse` 또는 주소 ?touch): 스킬 줄을 숨기고 오른쪽 아래 공격 버튼 위에 빠른 칸 버튼 4개 (아이템 이름 앞 4글자 + "×개수"), 위 오른쪽 작은 줄에 가방 · 기술표 · 지도 · 먹기 (N) 버튼
- 창 (.rw-box · .cf-box · #storeMenu · .pp-box · .rs-box) 안을 누르면 그대로 클릭, 창 밖 아무 데나 톡 = 글상자 다음
- 상점 칸은 일부러 `<button>`이 아니라 `<a>` (확인 창의 버튼 처리 = 닫기에 안 걸리게)
- 굴 창고 창 (#storeMenu)은 640px 이하에서 버튼 줄이 아래로 내려감

```css
@media (max-width:640px){ #storeMenu .sm-row{flex-wrap:wrap;} #storeMenu .sm-btns{width:100%;justify-content:flex-end;} }
```

### 10-8. 굴 창고 창 (#storeMenu, E로 창고 앞에서)

- 가운데 뜨는 세로 목록 (min(620px, 100vw − 24px), 최대 높이 70vh)
- 머리: "창고" + "인주 80/80 · 청광묵 100% · 카리우스 100% [닫기 ✕]"
- 맨 위 장비 한 줄: "장비 어부의 창 — I 키 — 가방 · 장비 창"
- 같은 이름끼리 묶어 한 줄: 그림 32px · "빵 ×3" · 갈래 태그 (식량 초록 · 보급 파랑 · 장비 금색 · 가구 갈색 · 땔감 주황) · 메모 ("끼니 3") · 버튼
  - 식량: 먹기 / 오늘 먹음 (꺼짐) · 청광묵에게 주기 · 카리우스에게 주기 … (청광묵은 받을 때마다 유대 +1, 셋마다 힘 · 체력 +1)
  - 빨간 물약 · 붕대: 받을 사람 버튼 (인주 · 청광묵 · 카리우스 · 레베카) — 굴에서는 체력 비율 회복 (`HEAL = { 'd_I-037': 0.5, 'd_I-061': 0.25 }`)
  - 옛 장비: 장착 / 가구: 꺼내 놓기
- Esc · E · Tab으로 닫힘

---

## 11. HUD 쪽 인벤토리 흔적

- 스킬 줄 (#skillbar, 화면 아래 가운데, 원정 중): `[좌클릭] 무기 이름 · 종류` · `[우클릭] 무기 기술 + 쿨 원` · 태클 · 잡기 · 숙이기 · 슬라이딩 · 구르기 · 막기 · `[R] 탄창/최대 + 탄 이름 남은 수` · 칸막이 · 빠른 칸 4개 (아이콘 34px, 비면 흐림, 누르면 사용) · `[I] 가방 7/12`
- 좁은 화면이면 스킬 줄만 축소 (scale), 겹치면 영웅 칸 · 지시 버튼을 위로 올림 (qol.js uiDodgeBar)
- 원정 HUD (왼쪽 위): `3층 이름` · 횃불 막대 + 남은 시간 · 정신도 막대 · `금화 154 · 가방 15/40 · 축복…`
- 영웅 칸 (왼쪽 아래): 얼굴 52px + 레벨 원 · 이름 · 역할 · 상태 ("쓰러짐" · "잡힘!" · "반시체") · 체력 막대 (푸른 체력 겹침) · 정신도 막대 · 상태 이상 칩 (색 칩 + 남은 초) · 치명상 칩 ("다리 5일")

---

## 12. 대화 · 인카운터 UI

### 12-1. 글상자 (textbox) — 초상화 대화

```js
function textbox(who, lines, o = {}){   // o: { face, vn, tags, hold }
  …
  box.innerHTML = `${o.face ? `<img class="face" src="${artSrc(o.face)}" alt="">` : ''}${who ? `<b>${who}${o.tags ? ' ' + o.tags : ''}</b>` : ''}<p>${lines[i]}</p><span class="more"…>${i < lines.length - 1 ? '▼' : '■'}</span>`;
  …
}
function vnTalk(who, lines, o = {}){ return textbox(who, lines, { ...o, face: o.face || VN_FACE[who], vn: true }); }
```

- 화면 아래 가운데 상자 (min(720px, 88vw), 손가락 화면 70vw). 이름 (도현체 19px 금색) + 본문 17px, 줄마다 살짝 떠오르는 등장, 오른쪽 아래 깜빡이는 ▼ (마지막 줄은 ■)
- 모양 셋:
  - 얼굴 없음: 이름 + 글 (해설은 이름 없이)
  - `hasface`: 왼쪽에 118px 네모 얼굴 (금색 테두리, 위쪽 맞춤)
  - `vn` (미연시 식): 상자가 넓어짐 (min(860px, 92vw)), 얼굴 160px이 상자 아래 끝에 붙어 위로 솟음, 이름 22px
- `hold`: 줄마다 최소 대기 초 (연출용 — 이 동안 넘기기 막힘, ▼ 숨김)
- `tags`: 이름 옆 특성 태그 (S ~ F 등급 색 사각 태그 + 저주 보라). 예: 청광묵 "발화 A" · "저주: 실명 · 좌안"
- 얼굴은 인물마다 그림 하나 (`VN_FACE` 표). 표정 차분 (기쁨 · 슬픔 …) 그림은 없음
- 넘기기: E · Enter · 클릭 · 손가락 화면은 아무 데나 톡
- 선택지는 글상자에 없음 → 선택은 아래 그림 카드 · 확인 창으로

```js
const VN_FACE = { 인주: 'assets/inju_face.png', 청광묵: 'art/pro/goblin_face.webp', 카리우스: 'art/pro/karius_face.webp', 'GOOD WILL': 'assets/goodwill_face.png', 노먼: …, 세자르: 'assets/cesar_face.png', 적뢰: …, 벤킨: …, 단달로: …, 테헤라: 'art/enc/tehera_sit.webp', '게 요리사': 'art/enc/crabchef.webp', 아이텐: 'art/enc/aiten.webp', '돼지들의 신': …, '담배 피는 노인': … };
```

### 12-2. 말풍선 (say)

머리 위에 따라다니는 짧은 말. 종류:

```js
// 말풍선: 인물 (또는 {x, y, z}) 머리 위. cls: big (외침, 떨림) · soft (혼잣말) · zzz (떠오름)
.bubble{…font-size:18px;color:#1a1418;background:#f4ede2;padding:6px 12px;border-radius:12px;…}
.bubble.big{font-size:30px;color:#fff;background:#8e1515;…animation:quiver .06s infinite;}
.bubble.soft{font-size:15px;color:#d8f0ff;background:rgba(20,16,34,.75);border:1px solid rgba(160,220,255,.35);}
.bubble.alert{font-size:30px;font-weight:bold;color:#fff;background:#d23a2a;…}
.bubble.emo{font-size:26px;…}   /* 감정 기호 하나 */
```

굴에서 청광묵 · 카리우스의 혼잣말은 아래 굴 창 위에도 한 줄로 따라 적힘 ("청광묵 대장! 고기 구웠다!").

### 12-3. 그림 카드 (rgCard) — 인카운터 · 선택지

```js
// 그림 카드: o = { img, kicker, title, text, choices: [{ t, sub, dis }] } → 고른 번호 (Promise)
el.innerHTML = `<div class="rg-box"><div class="rg-art" style="${rgArt(o.img || CA + 'c17.webp')}"></div><div class="rg-body">
  ${o.kicker ? `<div class="rg-kicker">${o.kicker}</div>` : ''}<div class="rg-title">${o.title}</div><p class="rg-text">${o.text || ''}</p>
  <div class="rg-ch">${o.choices.map((c, i) => `<button data-i="${i}" ${c.dis ? 'disabled' : ''}><kbd>${i + 1}</kbd><span><span class="rg-t">${c.t}</span>${c.sub ? `<small>${c.sub}</small>` : ''}</span></button>`).join('')}</div></div></div>`;
```

- 화면 가운데 상자 (min(780px, 100%)), 왼쪽 세로 그림 230×276 · 오른쪽 작은 머리말 (kicker) · 제목 · 글 · 선택지 버튼 (번호 키 1~4 또는 누름)
- 선택지마다 결과 미리보기 한 줄 (`sub`): "쓸 만한 장비 하나 · 모두 정신도 −8" / "반반: 이 층 지도가 보임 · 아니면 모두 혼란"
- 조건이 안 맞는 선택지는 꺼짐 (`dis`, 예: 금화 부족)
- 열려 있는 동안 게임 멈춤, 튀어 오르는 등장 애니메이션
- 실제 예: 죽은 영웅 ("소지품을 뒤진다" / "눈을 감겨 준다" / "지나간다") · 버려진 배낭 ("뒤진다 — 소모품 둘 · 가끔 독침" / "그대로 둔다") · 미믹 · 거울 · 샘 · 나그네 (동료 영입) · 낙하 기원 결과 카드 (별 ★★★☆☆ + 체력 · 공격 · 패시브 · 기술)
- 문 앞 기척 카드 → 연다 / 그냥 둔다. 갈림길 카드 (길 셋 중 하나: 보물 · 사냥 · 문 · 조용한 · 상인 · 붉은 일식)

### 12-4. 확인 창 (uiConfirm) · 일시정지 창

- `.cf-box` (min(520px, 92vw)): 제목 · 글 · [확인 (E)] [취소 (Esc)]. 계단 내려가기 · 처음부터 등
- Esc 일시정지 창도 같은 틀: "3층 · 횃불 2 · 금화 154" + 이어하기 / 기술표 / 카메라 되돌리기 / 처음부터

### 12-5. 그 밖의 글 장치

- 자막 (#caption): 화면 위 22%에 큰 제목 46px + 작은 글, 3.2초 동안 떠올랐다 사라짐 ("강적을 쓰러뜨렸다 / 보상 상자가 나타났다")
- 안내 (#guide): 아래쪽 한 줄 24px, `<em>` 금색 강조 ("<em>토끼마차</em>가 왔다 — …")
- 살펴보기 줄 (#prompt): `[E] 상자를 연다` + 여럿이면 `[Tab] 다른 것`
- 로딩 화면: 그림 배경 + 줄이 하나씩 떠오름 → "계속"
- 충돌 로그 (#clash): 큰 장면만 화면 아래 한 줄 서술, 4초, 셋까지 ("○○이(가) 등 뒤에서 ○○의 숨을 끊었다. 소리가 나지 않았다.")
- 레터박스: 컷신 때 위아래 검은 띠 9vh + HUD 숨김

---

## 13. 결과 · 정산 화면

### 13-1. 원정 결과 (uiResult) — 생환 / 전멸

```js
el.innerHTML = `<div class="rs-box ${wipe ? 'wipe' : ''}"><b>${wipe ? '전멸' : '생환'}</b><small>${wipe ? '어둠이 모두를 삼켰다. …누군가 끌고 올라왔다.' : '살아서 돌아왔다.'}</small>
  <div class="rs-row"><span>가장 깊은 곳</span><b>${sum.deepest}층</b></div><div class="rs-row"><span>쓰러뜨린 적</span><b>${sum.kills}</b></div><div class="rs-row"><span>금화</span><b>${sum.gold >= 0 ? '+' : ''}${sum.gold}</b></div>
  ${wipe ? `<div class="rs-row bad"><span>잃은 가방</span><b>${sum.lost}개 — ${sum.F}층 바닥에 (3일 안에 가면 되찾음)</b></div>` : `<div class="rs-row"><span>굴 창고로</span><b>식량 ${tc.food} · 땔감 ${tc.wood} · 달팽이 먹이 ${tc.snail}</b></div>`}
  …
  <div class="rs-sub">주운 것 <small>(쓴 것도 포함)</small></div><div class="rs-got">${gotHtml}</div>
  <div class="rs-sub">원정대</div><div class="rs-party">${…`<div><b>${p.name}</b> Lv ${p.lv} · 체력 ${…}/${…} · 정신도 ${p.san}${ch ? `<span class="hc-st">${ch}</span>` : ''}</div>`…}</div>
  <button>굴로 (E)</button></div>`;
```

- 가운데 상자 (min(620px, 94vw)), 금색 테두리 (전멸이면 빨강 테두리 · 빨간 제목)
- 줄 표: 가장 깊은 곳 · 쓰러뜨린 적 · 금화 증감 · (생환) 굴 창고로 간 식량 · 땔감 · 달팽이 먹이 / (전멸) 잃은 가방 수 · 레베카 죽음 횟수 · 전투 이탈 시간
- 주운 것: 아이콘 40px + 등급 색 이름 칩들 (같은 것은 개수로 묶음, 최대 높이 180px 스크롤)
- 원정대: 사람마다 Lv · 체력 · 정신도 · 상처 칩 (빨간 칩 "다리 5일" · "반시체")
- 버튼 하나 "굴로 (E)" → 굴로 돌아와 자막

### 13-2. 오늘의 낙하 (굴, #fallres)

- 화면 위 9% 가운데 큰 목록 (min(560px, 92vw)): 제목 "3일째 · 오늘의 낙하"
- 물건이 떨어질 때마다 한 줄씩 왼쪽에서 밀려 들어옴: 그림 칸 46px · 이름 · 갈래 태그 · 갈 곳 메모 ("창고로" · "우리로" · "모닥불로 (장작 25)" · "구덩이로" · "식량 2")
- 날씨 줄은 파란 칸, 적이 떨어지면 빨간 칸
- 아래 깜빡이는 "▶ E · 클릭으로 닫기"

### 13-3. 원정 준비 창 (#prep) — 출발 전 정산

- 누가 가나 (얼굴 카드: 간다 / 남는다 / 못 감 / 고정, 피로 · 상처 칩) · 식량 (필요 끼니 / 창고 끼니, 모자라면 "배고픔 (최대 체력 −15%)") · 횃불 −/+ (땔감 10씩) · 출발 층 (지름길) · 난이도 · 가방 (모두) + 탄약 · 잃은 동료 기록 · [떠난다] [장비 (I)] [아직]

---

## 14. 저장 (참고)

- RPG 전체: `localStorage['cave3d.rpg.v1']` = `JSON.stringify(RPG)` 통째 (가방 · 배낭 · 보관함 · 장비 · 금화 · 탄약 · 빠른 칸 포함). 장비 · 사용 · 이동 · 창 닫기마다 저장
- 굴 하루: `'cave3d.pro.v1'` (창고 PRO.store 등 키 목록만)
- 원정 체크포인트: `'cave3d.exp.v1'` — 층마다 + 싸움 방을 비우고 2초 조용하면 "저장됨" (바닥 물건 · 열린 상자도 저장)
- 불러올 때 정의가 사라진 아이템은 걸러냄:

```js
for (const h of Object.values(RPG.heroes)) for (const s of SLOTS) if (h.eq[s] && !ITEMS[h.eq[s].id]) h.eq[s] = null;
RPG.bag = RPG.bag.filter(it => ITEMS[it.id]); RPG.stash = RPG.stash.filter(it => ITEMS[it.id]);
```

---

## 15. 전술 전투 시뮬레이터에 가져갈 점 (메모)

- 정의 (ITEMS 표) / 인스턴스 (`{ uid, id, n, q, aff, mag }`) 분리는 그대로 쓰기 좋음. 인스턴스에 품질 · 덧붙은 효과 · 탄창처럼 "그 물건만의 상태"를 둠
- 인물마다 배낭 크기 (BAG_CAP) + 인물마다 들 수 있는 무기 (wts) + 고유 무기 (innate) 조합이 동료 개성을 잘 살림. 굴 식구처럼 wts가 비면 무기 칸이 죽어 버리므로 기본값을 정해 둘 것
- 탄약 · 금화를 칸 밖 공용 숫자로 둔 것 (원정) vs 칸 단위 소지품 (훈련장 sol.js) — 두 방식이 이미 공존. 전술 시뮬레이터엔 훈련장 쪽 (인물별 칸, 한 칸 = 총알 20 · 화살 30 · 산탄 8)이 더 맞음
- 무게 `w` 데이터가 이미 있으니 무게 제한 · 이동 페널티를 붙이기 쉬움 (지금은 몸 갑옷 `spd: -4` 같은 효과로만 대신함)
- 내구도 · 판매 · 물물교환은 없음 → 새로 설계해야 함 (값 `g`는 등급과 잘 맞게 정리돼 있어 판매가 기준으로 쓸 만함: 살 때 ×1.5)
- 바닥 전리품: 걸어가면 자동 줍기 + 가득이면 동료 배낭으로 흘림 + 가득 알림 3초 제한 — 턴제라면 "줍기" 행동으로 바꾸면 됨
- 장비 창: 왼쪽 인물 목록 · 가운데 인형 7칸 · 오른쪽 배낭 + 아래 설명 · 버튼, 비교 ▲▼, 두 번 눌러 바로 끼우기. 끌어 놓기가 없어서 넘겨주기 → 받은 사람 화면에서 끼우기 두 단계가 필요함 (개선 여지)
- 그림 카드 + 선택지 + 결과 미리보기 (`sub`)는 인카운터 · 정비 이벤트 화면에 바로 재사용 가능
