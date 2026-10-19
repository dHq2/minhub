# mapgrid.py v1.4 (v1.4: ring= · fall= 줄도 건너뜀 · v1.3: 고침.txt 의 in= · out= · amb= · name= · tag= · id= · nx= 줄은 건너뜀 (maps8.py 가 읽음) · v1.2: v1.2: 고침.txt 의 'seed=x,y;x,y' (+ 'dc=0.9' · 'de=1.6') — 찍은 바닥 칸들의 색 · 결을 기준으로 비슷한 칸만 바닥으로 어림해 이어 붙임 (동굴 · 들판처럼 구불구불한 맵) · v1.1: v1.1: 겹쳐 보기를 반투명 층으로 · 문턱 1.5 이상이면 어림 없이 모두 바닥 (손으로 짚을 때) · 칸 번호 모두) — 그림 맵 (위에서 본 전장) → 칸 지도 어림 + 겹쳐 보기
#   칸마다 결 (가장자리 세기) · 바닥 색과의 거리를 재서 바닥 / 막힘을 어림하고, 가운데에서 이어진 바닥만 남김.
#   작은 막힘 덩어리 (≤ small 칸) 는 낮은 엄폐 r, 나머지는 # (높음).
#   쓰기: python3 -I mapgrid.py 그림.png 칸수(가로) 결과.json 겹침.jpg [문턱 0.0~1.0 기본 0.5] [고침.txt]
#   고침.txt: "x,y=." 또는 "x0-x1,y0-y1=#" 줄들 (손으로 바로잡기)
import sys, json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
src, NX, dst, ov = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
thr = float(sys.argv[5]) if len(sys.argv) > 5 else 0.5
fix = sys.argv[6] if len(sys.argv) > 6 else None
im = Image.open(src).convert('RGB'); W0, H0 = im.size
cs = W0 / NX; NY = int(round(H0 / cs))
g = np.asarray(im.convert('L').filter(ImageFilter.GaussianBlur(1.5)), dtype=np.float32)
gx = np.abs(np.diff(g, axis=1, prepend=g[:, :1])); gy = np.abs(np.diff(g, axis=0, prepend=g[:1, :]))
edge = gx + gy
rgb = np.asarray(im, dtype=np.float32)
feat = np.zeros((NY, NX, 5))
for cy in range(NY):
    for cx in range(NX):
        x0, y0 = int(cx * cs), int(cy * cs); x1, y1 = int((cx + 1) * cs), int((cy + 1) * cs)
        e = edge[y0:y1, x0:x1]; c = rgb[y0:y1, x0:x1].reshape(-1, 3)
        feat[cy, cx, 0] = e.mean(); feat[cy, cx, 1:4] = np.median(c, axis=0); feat[cy, cx, 4] = c.std()
E = feat[:, :, 0]; Cl = feat[:, :, 1:4]
calm = E <= np.percentile(E, 40)
floorC = np.median(Cl[calm], axis=0)
dC = np.linalg.norm(Cl - floorC, axis=2)
sE = (E - np.percentile(E, 20)) / (np.percentile(E, 90) - np.percentile(E, 20) + 1e-6)
sC = dC / (np.percentile(dC, 90) + 1e-6)
score = 0.6 * sE + 0.4 * sC
seeds = []; dcK, deK = 0.9, 1.6
if fix:
    for ln in open(fix, encoding='utf-8'):
        ln = ln.split('#!')[0].strip()
        if ln.startswith('seed='): seeds += [tuple(int(v) for v in p.split(',')) for p in ln[5:].split(';') if p.strip()]
        elif ln.startswith('dc='): dcK = float(ln[3:])
        elif ln.startswith('de='): deK = float(ln[3:])
if seeds:
    sc = np.array([Cl[y, x] for x, y in seeds]); fC = np.median(sc, axis=0); e0 = np.median([E[y, x] for x, y in seeds])
    spread = max(12.0, float(np.median(np.linalg.norm(sc - fC, axis=1))) * 2)
    dd = np.linalg.norm(Cl - fC, axis=2)
    blk = (dd > spread * 2.2 * dcK) | (E > e0 * deK)
else:
    blk = score > thr if thr < 1.5 else np.zeros_like(score, dtype=bool)
# 가운데에서 이어진 바닥만
from collections import deque
seen = np.zeros_like(blk); q = deque()
cx0, cy0 = NX // 2, NY // 2
best = None
for r in range(0, max(NX, NY)):
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            x, y = cx0 + dx, cy0 + dy
            if 0 <= x < NX and 0 <= y < NY and not blk[y, x]: best = (x, y); break
        if best: break
    if best: break
starts = [(x, y) for x, y in seeds if not blk[y, x]] or [best]
for st0 in starts: q.append(st0); seen[st0[1], st0[0]] = True
while q:
    x, y = q.popleft()
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < NX and 0 <= ny < NY and not seen[ny, nx] and not blk[ny, nx]: seen[ny, nx] = True; q.append((nx, ny))
grid = [['.' if seen[y, x] else '#' for x in range(NX)] for y in range(NY)]
# 작은 막힘 덩어리 → r (안쪽에 둘러싸인 것만)
lab = np.zeros((NY, NX), int); n = 0
for y in range(NY):
    for x in range(NX):
        if grid[y][x] == '#' and not lab[y, x]:
            n += 1; st = [(x, y)]; lab[y, x] = n; cells = []; edgeT = False
            while st:
                a, b = st.pop(); cells.append((a, b))
                if a in (0, NX - 1) or b in (0, NY - 1): edgeT = True
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    p, q2 = a + dx, b + dy
                    if 0 <= p < NX and 0 <= q2 < NY and grid[q2][p] == '#' and not lab[q2, p]: lab[q2, p] = n; st.append((p, q2))
            if not edgeT and len(cells) <= 4:
                for a, b in cells: grid[b][a] = 'r'
if fix:
    for ln in open(fix, encoding='utf-8'):
        ln = ln.split('#!')[0].strip()
        if not ln or '=' not in ln or ln.split('=')[0].strip() in ('seed', 'dc', 'de', 'in', 'out', 'amb', 'name', 'tag', 'id', 'nx', 'ring', 'fall'): continue
        a, v = ln.split('='); xs, ys = a.split(',')
        def rg(s):
            s = s.strip(); return range(int(s.split('-')[0]), int(s.split('-')[1]) + 1) if '-' in s else range(int(s), int(s) + 1)
        for y in rg(ys):
            for x in rg(xs):
                if 0 <= x < NX and 0 <= y < NY: grid[y][x] = v.strip()[0]
rows = [''.join(r) for r in grid]
json.dump({'src': src.split('/')[-1], 'NX': NX, 'NY': NY, 'cs': cs, 'rows': rows}, open(dst, 'w'), ensure_ascii=False)
# 겹쳐 보기
o = im.copy().convert('RGBA'); L = Image.new('RGBA', o.size, (0, 0, 0, 0)); d = ImageDraw.Draw(L)
for y in range(NY):
    for x in range(NX):
        c = grid[y][x]; x0, y0 = x * cs, y * cs
        if c == '#': d.rectangle([x0, y0, x0 + cs, y0 + cs], fill=(255, 0, 0, 90))
        elif c == 'r': d.rectangle([x0, y0, x0 + cs, y0 + cs], fill=(255, 200, 0, 110))
        d.rectangle([x0, y0, x0 + cs, y0 + cs], outline=(255, 255, 255, 40))
for x in range(NX): d.text((x * cs + 2, 2), str(x), fill=(0, 255, 255, 255) if x % 5 == 0 else (255, 255, 255, 160))
for y in range(NY): d.text((2, y * cs + 2), str(y), fill=(0, 255, 255, 255) if y % 5 == 0 else (255, 255, 255, 160))
o = Image.alpha_composite(o, L).convert('RGB'); w = 1000; o.resize((w, int(o.size[1] * w / o.size[0]))).save(ov, quality=82)
print('grid', NX, NY, 'floor', sum(r.count('.') for r in rows), 'r', sum(r.count('r') for r in rows))
for r in rows: print(r)
