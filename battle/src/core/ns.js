/* 굴 전투판 단순판 — 이름공간 · 공용 도구.
 * E = 원본 굴 엔진 (vendor/gul, 빌드가 앞에 붙여 줌). 이 폴더의 코드는 E 의 공개 함수만 부르고 엔진 파일은 고치지 않는다. */
'use strict';
const GB = { VERSION: '/*VERSION*/', E: E };
GB.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
GB.dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
GB.clone = o => JSON.parse(JSON.stringify(o));
GB.r1 = v => Math.round(v * 10) / 10;
// 씨앗 있는 난수 (mulberry32) — 캠페인(런) 쪽 무작위용. 판 안의 난수는 엔진 W.rand 를 쓴다
GB.rng = function (seed) {
  let a = (seed >>> 0) || 1;
  const f = () => { a = (a + 0x6D2B79F5) | 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  f.range = (lo, hi) => lo + (hi - lo) * f();
  f.int = (lo, hi) => Math.floor(f.range(lo, hi + 1));
  f.chance = p => f() < p;
  f.pick = arr => arr[Math.floor(f() * arr.length)];
  f.weighted = obj => { let s = 0, k; for (k in obj) s += obj[k]; let r = f() * s; for (k in obj) { r -= obj[k]; if (r <= 0) return k; } return k; };
  f.shuffle = arr => { const a2 = arr.slice(); for (let i = a2.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [a2[i], a2[j]] = [a2[j], a2[i]]; } return a2; };
  return f;
};
