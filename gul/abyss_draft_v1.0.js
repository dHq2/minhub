// 암계 초안 — abyss_draft_v1.0.js (v1.0, 2026-10-23, v8.9.1 준비)
// 민수가 대화로 올린 암계 적 4 · 장비 6 (도감 6기 · catalog v2.00 · C-318 ~ C-321). 게임에는 아직 안 걸었음 (어느 층 · 어느 무리에도 안 들어감).
// 수치 · 등급 · 이름은 전부 임시 초안 (AI 가 비슷한 병종 — 심계 병사 · 심계 궁병 · 붉은갑주 — 에 맞춰 잡음). 민수가 정하면 바꿈. 정전(正典) 아님.
// 모양은 run8_a.js 의 FOE8 줄과 같음: [key, ref(도감 cid), tier, 옵션, 한 줄 설명]. 쓰려면 FOE8 forEach 에 그대로 붙이면 됨.
// 그림: build/art/abyss/<cid>_art(원화 흰 바탕) · _cut(투명 바탕 1024×1536) · _face(256 정사각 초상화) · eq_*.webp(장비 6)
const ABYSS_DRAFT = [
  ['암계 대방패 기사', 'C-318', 2, { weapon: '검', shield: true, height: 1.95, weight: 130, ov: { hp: 230, atk: 32 }, traits: ['갑피', '야시A'], gear: { 몸: { name: '암계 흉갑', mat: '판금', tier: 2 }, 머리: { name: '암계 투구', mat: '판금', tier: 2 } } }, '뿔 달린 투구에 큰 방패 — 앞줄을 맡는 암계 병사'],
  ['암계 창기사', 'C-319', 2, { weapon: '창', shield: true, height: 1.9, weight: 100, ov: { hp: 190, atk: 36 }, traits: ['갑피', '야시A'], gear: { 몸: { name: '암계 흉갑', mat: '판금', tier: 2 } } }, '창과 방패 — 방패 뒤에서 찌른다'],
  ['암계 궁수', 'C-320', 2, { role: '사수', weapon: '활', ammo: 30, height: 1.85, weight: 75, ov: { hp: 150, atk: 32 }, traits: ['사격B', '야시A'] }, '암계의 활 — 방패 뒤에서 쏜다'],
  ['암계 장검 기사', 'C-321', 3, { weapon: '대검', height: 2.1, weight: 150, ov: { hp: 330, atk: 46 }, traits: ['갑피', '근력B', '야시A'], gear: { 몸: { name: '암계 흉갑', mat: '판금', tier: 3 }, 머리: { name: '암계 투구', mat: '판금', tier: 3 } } }, '두 손 장검을 든 암계의 정예']
];
// 장비 초안 — 칸 · 종류는 게임 데이터 (cave-3d) 의 이름대로. 능력치는 비워 둠 (민수가 정함)
const ABYSS_EQUIP_DRAFT = [
  { id: 'eq_bow',   name: '암계의 활',       slot: '무기',   kind: '활',      src: 'abyss/eq_bow.webp',   user: '암계 궁수' },
  { id: 'eq_sword', name: '암계의 장검',     slot: '무기',   kind: '대검',    src: 'abyss/eq_sword.webp', user: '암계 장검 기사' },
  { id: 'eq_tower', name: '암계의 대방패',   slot: '보조',   kind: '방패',    src: 'abyss/eq_tower.webp', user: '암계 대방패 기사', note: '길쭉한 탑 방패' },
  { id: 'eq_kite',  name: '암계의 연형 방패', slot: '보조',   kind: '방패',    src: 'abyss/eq_kite.webp',  user: '암계 창기사', note: '작은 카이트 방패' },
  { id: 'eq_helm',  name: '암계 투구',       slot: '방어구', kind: '머리',    src: 'abyss/eq_helm.webp',  user: '암계 병사 전반', mat: '판금' },
  { id: 'eq_chest', name: '암계 흉갑',       slot: '방어구', kind: '몸',      src: 'abyss/eq_chest.webp', user: '암계 병사 전반', mat: '판금' }
];
if (typeof module !== 'undefined') module.exports = { ABYSS_DRAFT, ABYSS_EQUIP_DRAFT };
