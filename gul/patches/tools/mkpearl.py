# 펄 대화 그림 — mkpearl.py v1.0 (v1.0: 도감 4기 그림 (흰 바탕) 의 바탕을 가장자리에서 채워 지움 → 투명 대화 그림 (talk/pearl_t1 ~ t4) · 각펄은 같은 그림을 어둡게 (페이지 CSS 가 음영))
import sys
from PIL import Image, ImageFilter, ImageChops
from collections import deque
SRC = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/pearl_src/'
OUT = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/pearl_art/'
def cut(name, tol=34):
    im = Image.open(SRC + name).convert('RGBA'); W, H = im.size; px = im.load()
    bg = [0] * (W * H); q = deque()
    def white(c): return c[0] > 255 - tol and c[1] > 255 - tol and c[2] > 255 - tol
    for x in range(W):
        for y in (0, H - 1): q.append((x, y))
    for y in range(H):
        for x in (0, W - 1): q.append((x, y))
    while q:
        x, y = q.popleft(); i = y * W + x
        if bg[i] or not white(px[x, y]): continue
        bg[i] = 1
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            a, b = x + dx, y + dy
            if 0 <= a < W and 0 <= b < H and not bg[b * W + a]: q.append((a, b))
    m = Image.new('L', (W, H), 255); mp = m.load()
    for y in range(H):
        for x in range(W):
            if bg[y * W + x]: mp[x, y] = 0
    m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    im.putalpha(m); bb = im.getbbox(); return im.crop(bb)
def up(im, h):   # 대화 칸 높이에 맞춰 키움 (부드럽게)
    w = round(im.size[0] * h / im.size[1]); return im.resize((w, h), Image.LANCZOS)
for src, dst in (('g4_pearl_20.png', 'pearl_t1'), ('g4_pearl_01.png', 'pearl_t2'), ('g4_pearl_34.png', 'pearl_t3'), ('g4_pearl_36.png', 'pearl_t4')):
    im = up(cut(src), 1100); im.save(OUT + dst + '.webp', 'WEBP', quality=90, method=6); print(dst, im.size)
