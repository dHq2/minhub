# czclean.py v1.0 — 세자르 보스룸 그림: 체크무늬 (가짜 투명) 를 진짜 투명으로 · 홀 밖 조각 (워터마크 별) 지움 · 가장자리 2px 다듬음
import sys
from PIL import Image
import numpy as np
from collections import deque
src, mask, dst = sys.argv[1], sys.argv[2], sys.argv[3]
im = Image.open(src).convert('RGB'); a = np.asarray(im)
out = np.load(mask); H, W = out.shape
hall = np.zeros((H, W), bool); q = deque([(H // 2, W // 2)]); hall[H // 2, W // 2] = True
while q:
    y, x = q.popleft()
    for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
        if 0 <= ny < H and 0 <= nx < W and not hall[ny, nx] and not out[ny, nx]:
            hall[ny, nx] = True; q.append((ny, nx))
# 구멍 메움: 홀 안쪽에 갇힌 체크무늬 비슷한 칸은 그대로 둠 (out 은 가장자리에서 이어진 것만이라 안쪽은 이미 hall)
al = hall.astype(np.float32)
# 가장자리 2px: 바깥과 맞닿은 칸은 옅게 (체크무늬가 번진 자리)
edge = np.zeros_like(hall)
for d in (1, 2):
    sh = np.zeros_like(hall)
    sh[d:, :] |= ~hall[:-d, :]; sh[:-d, :] |= ~hall[d:, :]; sh[:, d:] |= ~hall[:, :-d]; sh[:, :-d] |= ~hall[:, d:]
    edge |= sh & hall
    al[sh & hall] = np.minimum(al[sh & hall], 0.35 if d == 1 else 0.75)
rgba = np.dstack([a, (al * 255).astype(np.uint8)])
Image.fromarray(rgba, 'RGBA').save(dst, 'WEBP', quality=86, method=6)
print('hall frac', hall.mean(), 'saved', dst)
