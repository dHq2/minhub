# czcells.py v1.1 — 세자르 보스룸: 칸마다 홀 안쪽 비율 (마스크) + 손으로 짚은 벽 · 장애물 → 막힌 칸 목록 · 겹쳐 보기 (v1.2: 홀 밖 x · v1.1: 바위 # 와 잔해 r 를 나눔 — 쓰러진 기둥 · 돌무더기는 낮은 엄폐)
import sys, json
from PIL import Image, ImageDraw
import numpy as np
S, X0, Y0, N = 74, 13, 0, 28
out = np.load(sys.argv[1]); img = sys.argv[2]; dst = sys.argv[3]
H, W = out.shape
inside = np.zeros((N, N))
for cy in range(N):
    for cx in range(N):
        x0, y0 = X0 + cx * S, Y0 + cy * S
        x1, y1 = min(W, x0 + S), min(H, y0 + S)
        if x0 >= W or y0 >= H or x1 <= max(0, x0): continue
        blk = out[y0:y1, max(0, x0):x1]
        inside[cy, cx] = 1 - blk.mean() if blk.size else 0
# 벽: 열마다 바닥이 시작하는 줄 (그림의 벽 밑동)
base = {2: 13, 3: 10, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 8, 10: 8, 11: 6, 12: 6, 13: 6, 14: 6, 15: 6, 16: 6, 17: 8, 18: 8, 19: 8, 20: 8, 21: 8, 22: 9, 23: 9, 24: 10, 25: 12, 26: 16}
rockC = [  # 옥좌 · 무너진 단 · 서 있는 부러진 기둥 (높음 — 시야 · 탄을 막음)
    (13, 7), (14, 7), (13, 8), (14, 8), (12, 9), (13, 9), (14, 9), (15, 9), (12, 10), (13, 10), (14, 10), (15, 10),
    (16, 9), (16, 10), (17, 9), (17, 10), (17, 11),
    (25, 14), (25, 15),
]
rubC = [  # 쓰러진 기둥 · 돌무더기 (낮음 — 못 지나가지만 너머로 보임 · 엄폐)
    (3, 10), (4, 10), (5, 10), (3, 11), (4, 11), (5, 11), (2, 13),
    (2, 16), (2, 17), (3, 17), (2, 18), (3, 18), (3, 19),
    (4, 20), (5, 20), (5, 21), (6, 21),
    (10, 10), (11, 10), (11, 11), (12, 11), (16, 11),
    (23, 9), (23, 10), (24, 10), (24, 11),
]
obst = rockC + rubC
blocked = set()
for cy in range(N):
    for cx in range(N):
        if inside[cy, cx] < 0.55: blocked.add((cx, cy)); continue
        b = base.get(cx, 99 if cx <= 1 or cx >= 27 else 0)
        if cy < b: blocked.add((cx, cy))
for o in obst: blocked.add(o)
open_ = [(x, y) for y in range(N) for x in range(N) if (x, y) not in blocked]
print('open', len(open_), 'blocked', len(blocked))
rows = []
rub = set(rubC)
for cy in range(N):
    rows.append(''.join('.' if (cx, cy) not in blocked else ('r' if (cx, cy) in rub else ('x' if inside[cy, cx] < 0.55 else '#')) for cx in range(N)))
print('\n'.join(f'{i:2d} {r}' for i, r in enumerate(rows)))
json.dump(rows, open(dst.replace('.png', '.json'), 'w'))
im = Image.open(img).convert('RGBA'); ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
for (cx, cy) in blocked:
    d.rectangle([X0 + cx * S, Y0 + cy * S, X0 + cx * S + S - 1, Y0 + cy * S + S - 1], fill=(0, 140, 255, 110) if (cx, cy) in rub else (255, 0, 0, 90))
for k in range(N + 1):
    d.line([(X0 + k * S, 0), (X0 + k * S, H)], fill=(255, 255, 0, 90)); d.line([(0, k * S), (W, k * S)], fill=(255, 255, 0, 90))
Image.alpha_composite(im, ov).convert('RGB').resize((1033, 1024)).save(dst)
