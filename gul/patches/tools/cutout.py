# cutout.py v1.0 — 흰 배경 대화 그림 → 배경 투명 webp (가장자리에서 이어진 밝은 무채색만 지움 · 테두리 부드럽게 · 빈 둘레 잘라냄 · 높이 1400 이하)
#   쓰기: python3 -I tools/cutout.py 원본.png 결과.webp [문턱 기본 28]
import sys
import numpy as np
from collections import deque
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]; th = int(sys.argv[3]) if len(sys.argv) > 3 else 28
im = Image.open(src).convert('RGB')
if im.height > 1400: im = im.resize((round(im.width * 1400 / im.height), 1400), Image.LANCZOS)
a = np.asarray(im, dtype=np.int16); H, W, _ = a.shape
mx, mn = a.max(axis=2), a.min(axis=2)
bgish = (mn >= 255 - th) & (mx - mn <= 18)   # 거의 흰색 · 무채색
bg = np.zeros((H, W), bool); q = deque()
for x in range(W):
    for y in (0, H - 1):
        if bgish[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
for y in range(H):
    for x in (0, W - 1):
        if bgish[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < H and 0 <= nx < W and not bg[ny, nx] and bgish[ny, nx]: bg[ny, nx] = True; q.append((ny, nx))
alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
out = im.convert('RGBA'); out.putalpha(alpha)
bb = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
if bb: out = out.crop((max(0, bb[0] - 4), max(0, bb[1] - 4), min(W, bb[2] + 4), min(H, bb[3] + 4)))
out.save(dst, 'WEBP', quality=86, method=6)
print(dst, out.size, f'지운 배경 {bg.mean() * 100:.0f}%')
