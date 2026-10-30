/* wb.js v1.0 — (v1.0) 흰 바탕 지우기 (시나리오 편집기 · 그림 편집)
   ■ 도감의 대화 표정 그림은 흰 바탕이라 영상에 얹으면 하얀 네모가 됨 → 바탕만 투명하게
   ■ 가장자리 (기본: 위 · 왼쪽 · 오른쪽 — 아래는 몸이 잘린 곳이라 뺌) 에서 '거의 흰색' 을 따라 번져 나가며 바탕을 찾음.
     선 (검은 외곽선) 으로 막힌 안쪽 흰색 (옷 · 붕대) 은 그대로 남음. 막힌 빈틈 (팔과 몸 사이) 은 눌러서 따로 지움 (seeds)
   ■ 바탕에 닿은 2px 띠는 흰색과 섞인 픽셀 → 둘레의 가장 진한 색을 기준으로 투명도를 추정하고 흰 기운을 뺌 (흰 테두리가 안 남게)
   ■ wbRemove(그림, { tol: 12, edges: 'tlr', seeds: [[x, y], …] (더 지울 곳), keeps: [[x, y], …] (되살릴 빈틈), holes: true }) → canvas (투명) */
'use strict';
function wbRemove(src, o = {}){
  const W = src.width, H = src.height, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(src, 0, 0);
  const im = cx.getImageData(0, 0, W, H), d = im.data, N = W * H;
  const T = 255 - (o.tol == null ? 12 : o.tol);
  const bg = new Uint8Array(N), q = new Int32Array(N); let qh = 0, qt = 0;
  const light = i => d[i * 4] >= T && d[i * 4 + 1] >= T && d[i * 4 + 2] >= T && d[i * 4 + 3] > 0;
  const push = i => { if (!bg[i] && (light(i) || d[i * 4 + 3] === 0)){ bg[i] = 1; q[qt++] = i; } };
  const E = o.edges == null ? 'tlr' : o.edges;
  if (E.includes('t')) for (let x = 0; x < W; x++) push(x);
  if (E.includes('b')) for (let x = 0; x < W; x++) push((H - 1) * W + x);
  if (E.includes('l')) for (let y = 0; y < H; y++) push(y * W);
  if (E.includes('r')) for (let y = 0; y < H; y++) push(y * W + W - 1);
  for (const [sx, sy] of o.seeds || []){ const x = Math.round(sx), y = Math.round(sy); if (x >= 0 && y >= 0 && x < W && y < H) push(y * W + x); }
  while (qh < qt){ const i = q[qh++], x = i % W; if (x > 0) push(i - 1); if (x < W - 1) push(i + 1); if (i >= W) push(i - W); if (i < N - W) push(i + W); }
  if (o.holes !== false) wbHoles(d, W, H, bg, o.holeTol == null ? 6 : o.holeTol, (o.keeps || []).map(([x, y]) => Math.round(y) * W + Math.round(x)));
  // 띠: 바탕에서 2px 안의 바탕 아닌 픽셀
  const R = 2, band = new Uint8Array(N);
  for (let i = 0; i < N; i++){
    if (!bg[i]) continue; const x = i % W, y = (i / W) | 0;
    for (let dy = -R; dy <= R; dy++){ const yy = y + dy; if (yy < 0 || yy >= H) continue; for (let dx = -R; dx <= R; dx++){ const xx = x + dx; if (xx < 0 || xx >= W) continue; const j = yy * W + xx; if (!bg[j]) band[j] = 1; } }
  }
  const lum = i => 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
  const out = new Uint8ClampedArray(d);
  for (let i = 0; i < N; i++){
    if (bg[i]){ out[i * 4 + 3] = 0; continue; }
    if (!band[i]) continue;
    // 둘레 (5 × 5) 에서 바탕 · 띠가 아닌 가장 진한 픽셀 = 섞이기 전의 색 (보통 외곽선)
    const x = i % W, y = (i / W) | 0; let lf = 255, fi = -1;
    for (let dy = -2; dy <= 2; dy++){ const yy = y + dy; if (yy < 0 || yy >= H) continue; for (let dx = -2; dx <= 2; dx++){ const xx = x + dx; if (xx < 0 || xx >= W) continue; const j = yy * W + xx; if (bg[j]) continue; const l = lum(j); if (l < lf){ lf = l; fi = j; } } }
    const L = lum(i); let a = lf >= 250 ? 1 : (255 - L) / (255 - lf); a = Math.max(0, Math.min(1, a));
    if (a < 0.03){ out[i * 4 + 3] = 0; continue; }
    if (a < 0.995){ for (let c = 0; c < 3; c++) out[i * 4 + c] = Math.max(0, Math.min(255, (d[i * 4 + c] - (1 - a) * 255) / a)); }
    out[i * 4 + 3] = Math.round(a * 255 * (d[i * 4 + 3] / 255));
  }
  cx.putImageData(new ImageData(out, W, H), 0, 0);
  return cv;
}
// 막힌 빈틈: 가장자리에서 안 닿는 새하얀 덩어리 중, 둘레의 절반 이상이 진한 선 (외곽선) 인 것만 바탕으로.
// 옷 · 붕대의 밝은 부분은 둘레가 연한 그림자라 남음
// 가늘고 긴 흰 줄 (금속 · 유리 반사) 은 빈틈이 아님 · keeps (되살리기로 누른 곳) 가 든 덩어리도 남김
function wbHoles(d, W, H, bg, tol, keeps){
  const N = W * H, T = 255 - tol, seen = new Uint8Array(N), comp = new Int32Array(N), keep = new Set(keeps || []);
  const vw = i => d[i * 4] >= T && d[i * 4 + 1] >= T && d[i * 4 + 2] >= T;
  // 진한 선 근처 (2px 안에 진한 픽셀) 표 — 빈틈 바로 옆은 흰색과 섞인 회색이라 한두 칸 더 봐야 선이 나옴
  const dk = new Uint8Array(N), nd = new Uint8Array(N);
  for (let i = 0; i < N; i++) dk[i] = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) < 120 ? 1 : 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++){ let v = 0; for (let k = -2; k <= 2 && !v; k++){ const xx = x + k; if (xx >= 0 && xx < W) v = dk[y * W + xx]; } nd[y * W + x] = v; }
  const near = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++){ let v = 0; for (let k = -2; k <= 2 && !v; k++){ const yy = y + k; if (yy >= 0 && yy < H) v = nd[yy * W + x]; } near[y * W + x] = v; }
  for (let s = 0; s < N; s++){
    if (bg[s] || seen[s] || !vw(s)) continue;
    let n = 0, h = 0, sum = 0, edge = 0, dark = 0, x0 = W, x1 = 0, y0 = H, y1 = 0, kept = false; comp[n++] = s; seen[s] = 1;
    while (h < n){
      const i = comp[h++], x = i % W, y = (i / W) | 0; sum += Math.min(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; if (keep.has(i)) kept = true;
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i >= W ? i - W : -1, i < N - W ? i + W : -1]){
        if (j < 0 || seen[j]) continue;
        if (!bg[j] && vw(j)){ seen[j] = 1; comp[n++] = j; }
        else if (!bg[j]){ edge++; if (near[j]) dark++; }
      }
    }
    const bw = x1 - x0 + 1, bh = y1 - y0 + 1, thin = Math.min(bw, bh), long = Math.max(bw, bh), streak = thin <= 14 && long >= thin * 5;
    if (!kept && !streak && n >= 12 && sum / n >= 251 && edge && dark / edge >= 0.45) for (let k = 0; k < n; k++) bg[comp[k]] = 1;
  }
}
