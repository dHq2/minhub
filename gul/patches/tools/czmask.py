# czmask.py v1.0 — 세자르 보스룸 그림의 가짜 투명(체크무늬)을 찾아 마스크로 (가장자리에서 이어진 무채색 칸)
import sys
from PIL import Image
import numpy as np
from collections import deque
src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(int)
H, W, _ = im.shape
mx = im.max(2); mn = im.min(2)
chk = (mx >= 150) & (mx <= 240) & ((mx - mn) <= 10)
# 줄 단위 BFS (scanline) 대신 간단히: 4배 축소해서 BFS 한 뒤 원본에서 다듬음
out = np.zeros((H, W), bool)
q = deque()
def push(y, x):
    if chk[y, x] and not out[y, x]:
        out[y, x] = True; q.append((y, x))
for x in range(W): push(0, x); push(H - 1, x)
for y in range(H): push(y, 0); push(y, W - 1)
while q:
    y, x = q.popleft()
    if y > 0: push(y - 1, x)
    if y < H - 1: push(y + 1, x)
    if x > 0: push(y, x - 1)
    if x < W - 1: push(y, x + 1)
print('out frac', out.mean())
np.save(dst, out)
Image.fromarray((out * 255).astype(np.uint8)).resize((517, 512)).save(dst.replace('.npy', '.png'))
