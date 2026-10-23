# v8.7.8 아이콘 두 칸 (44 딱 · 45 딱딱딱) — mkico.py v1.1 (v1.1: 딱딱딱 번개 셋을 같은 쪽으로 · 층층이 · v1.0: 도감 아이콘 결 — 색 빛살 바탕 + 검은 실루엣)
import math, random
from PIL import Image, ImageDraw, ImageFilter
S = 192
def burst(cx, cy, cols, seed):
    random.seed(seed); im = Image.new('RGB', (S, S), (6, 14, 30)); d = ImageDraw.Draw(im)
    n = 34
    for i in range(n):
        a0 = i / n * 2 * math.pi + random.uniform(-0.05, 0.05); w = random.uniform(0.04, 0.11)
        r = S * 1.6; c = cols[i % len(cols)]
        d.polygon([(cx, cy), (cx + r * math.cos(a0 - w), cy + r * math.sin(a0 - w)), (cx + r * math.cos(a0 + w), cy + r * math.sin(a0 + w))], fill=c)
    g = Image.new('L', (S, S), 0); gd = ImageDraw.Draw(g)
    for k in range(10, 0, -1):
        rr = S * 0.05 * k; gd.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=int(255 * (1 - k / 11)))
    g = g.filter(ImageFilter.GaussianBlur(10))
    im = Image.composite(Image.new('RGB', (S, S), (235, 250, 255)), im, g)
    return im
def bolt(d, pts, fill, edge=None, ew=0):
    if edge: d.line(pts + [pts[0]], fill=edge, width=ew, joint='curve')
    d.polygon(pts, fill=fill)
def boltPts(x, y, s, flip=False):
    P = [(0.55, 0.0), (0.2, 0.52), (0.46, 0.52), (0.28, 1.0), (0.82, 0.38), (0.55, 0.38), (0.78, 0.0)]
    return [((x + (1 - px if flip else px) * s * 0.7), (y + py * s)) for px, py in P]
cols = [(40, 170, 255), (10, 60, 140), (120, 220, 255), (20, 90, 190)]
# 44 딱: 큰 번개 하나 + 튀는 불꽃
a = burst(S * 0.62, S * 0.42, cols, 7); d = ImageDraw.Draw(a)
pts = boltPts(S * 0.18, S * 0.06, S * 0.9)
bolt(d, pts, (0, 0, 0), (200, 245, 255), 9)
for (x, y, r) in [(S * 0.78, S * 0.2, 7), (S * 0.85, S * 0.55, 5), (S * 0.2, S * 0.75, 6)]:
    d.ellipse([x - r, y - r, x + r, y + r], fill=(0, 0, 0))
a = a.resize((48, 48), Image.LANCZOS)
# 45 딱딱딱: 번개 셋
b = burst(S * 0.5, S * 0.45, cols, 11); d = ImageDraw.Draw(b)
for (x, y, s, f) in [(S * -0.02, S * 0.3, S * 0.58, False), (S * 0.3, S * 0.04, S * 0.66, False), (S * 0.6, S * 0.34, S * 0.58, False)]:
    bolt(d, boltPts(x, y, s, f), (0, 0, 0), (200, 245, 255), 7)
b = b.resize((48, 48), Image.LANCZOS)
im = Image.open('ico878/icons_v877.webp').convert('RGB')
im.paste(a, ((44 % 8) * 48, (44 // 8) * 48)); im.paste(b, ((45 % 8) * 48, (45 // 8) * 48))
im.save('ico878/icons_v878.webp', 'WEBP', quality=92, method=6)
z = Image.new('RGB', (48 * 4 * 2 + 8, 48 * 4), (40, 40, 40)); z.paste(a.resize((192, 192), Image.NEAREST), (0, 0)); z.paste(b.resize((192, 192), Image.NEAREST), (200, 0)); z.save('ico878/zoom.png')
print('mkico OK')
