# czgrid.py v1.0 — 74px 칸 격자 (x0=13, y0=0) 를 그림에 겹쳐 봄 · 칸 번호
import sys
from PIL import Image, ImageDraw, ImageFont
src, dst = sys.argv[1], sys.argv[2]
S, X0, Y0 = 74, 13, 0
im = Image.open(src).convert('RGB')
d = ImageDraw.Draw(im)
try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
except Exception: f = ImageFont.load_default()
for k in range(29):
    x = X0 + k * S; d.line([(x, 0), (x, im.height)], fill=(255, 40, 40), width=2)
    y = Y0 + k * S; d.line([(0, y), (im.width, y)], fill=(255, 40, 40), width=2)
for cy in range(28):
    for cx in range(28):
        if (cx + cy) % 2 == 0: d.text((X0 + cx * S + 4, Y0 + cy * S + 2), f'{cx},{cy}', fill=(0, 255, 255), font=f)
im.save(dst)
