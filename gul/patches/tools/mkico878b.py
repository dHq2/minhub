# v8.7.8 아이콘 (2) — mkico_b.py v1.0 (v1.0: 아이콘 판 8 × 6 → 8 × 8 (64칸 — 다음 인물 자리) · 포렌 넷: 46 ◆쥐들의 왕 (왕관 쓴 쥐) · 47 쥐 표식 (물어라! — 붉은 과녁 앞 쥐) · 48 쥐 포박 (매달린 쥐들 · 밧줄) · 49 구르기 (말린 몸 · 도는 화살) — 도감 아이콘 결: 색 빛살 바탕 + 검은 실루엣)
import math, random
from PIL import Image, ImageDraw, ImageFilter
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/ico878/'
S = 192
def burst(cx, cy, cols, seed, glow=(235, 255, 240), bg=(6, 22, 14)):
    random.seed(seed); im = Image.new('RGB', (S, S), bg); d = ImageDraw.Draw(im)
    n = 34
    for i in range(n):
        a0 = i / n * 2 * math.pi + random.uniform(-0.05, 0.05); w = random.uniform(0.04, 0.11)
        r = S * 1.6; c = cols[i % len(cols)]
        d.polygon([(cx, cy), (cx + r * math.cos(a0 - w), cy + r * math.sin(a0 - w)), (cx + r * math.cos(a0 + w), cy + r * math.sin(a0 + w))], fill=c)
    g = Image.new('L', (S, S), 0); gd = ImageDraw.Draw(g)
    for k in range(10, 0, -1):
        rr = S * 0.05 * k; gd.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=int(255 * (1 - k / 11)))
    g = g.filter(ImageFilter.GaussianBlur(10))
    return Image.composite(Image.new('RGB', (S, S), glow), im, g)
def rat(d, x, y, s, face=1, fill=(0, 0, 0), edge=None):
    """옆모습 쥐 (x, y = 몸 가운데 · s = 몸 길이 · face 1 = 오른쪽)"""
    f = face
    body = [x - s * 0.42, y - s * 0.24, x + s * 0.3, y + s * 0.22]
    head = [(x + f * s * 0.18, y - s * 0.2), (x + f * s * 0.62, y + s * 0.02), (x + f * s * 0.18, y + s * 0.16)]
    ear = [x + f * s * 0.16 - s * 0.1, y - s * 0.34, x + f * s * 0.16 + s * 0.1, y - s * 0.14]
    tail = [(x - f * s * 0.4, y + s * 0.05), (x - f * s * 0.62, y - s * 0.02), (x - f * s * 0.78, y + s * 0.14), (x - f * s * 0.9, y + s * 0.06)]
    if edge:
        e = s * 0.05
        d.ellipse([body[0] - e, body[1] - e, body[2] + e, body[3] + e], fill=edge); d.polygon([(px + (f * e if i == 1 else 0), py) for i, (px, py) in enumerate(head)], fill=edge)
        d.ellipse([ear[0] - e, ear[1] - e, ear[2] + e, ear[3] + e], fill=edge); d.line(tail, fill=edge, width=int(s * 0.1), joint='curve')
    if f < 0: body = [x - s * 0.3, y - s * 0.24, x + s * 0.42, y + s * 0.22]
    d.ellipse(body, fill=fill); d.polygon(head, fill=fill); d.ellipse(ear, fill=fill); d.line(tail, fill=fill, width=int(s * 0.05), joint='curve')
    for k in (-1, 1): d.line([(x + f * s * 0.05 + k * s * 0.12, y + s * 0.18), (x + f * s * 0.05 + k * s * 0.14, y + s * 0.3)], fill=fill, width=int(s * 0.06))
    return (x + f * s * 0.34, y - s * 0.07)   # 눈 자리
GREEN = [(40, 200, 120), (10, 90, 50), (130, 240, 170), (20, 130, 80)]
RED = [(230, 60, 50), (110, 20, 20), (255, 140, 110), (160, 30, 30)]
GOLD = (255, 214, 90)
# 46 ◆쥐들의 왕: 왕관 쓴 쥐 (에메랄드 빛 — 포렌)
a = burst(S * 0.5, S * 0.42, GREEN, 3); d = ImageDraw.Draw(a)
ex, ey = rat(d, S * 0.46, S * 0.62, S * 0.8, 1, edge=(225, 255, 235))
cx, cy = S * 0.6, S * 0.38
crown = [(cx - 34, cy + 16), (cx - 34, cy - 10), (cx - 18, cy + 4), (cx, cy - 22), (cx + 18, cy + 4), (cx + 34, cy - 10), (cx + 34, cy + 16)]
d.polygon(crown, fill=GOLD, outline=(0, 0, 0)); d.line(crown + [crown[0]], fill=(0, 0, 0), width=5)
for px in (cx - 34, cx, cx + 34): d.ellipse([px - 6, (cy - 10 if px != cx else cy - 22) - 6, px + 6, (cy - 10 if px != cx else cy - 22) + 6], fill=(255, 250, 220), outline=(0, 0, 0), width=3)
d.ellipse([ex - 5, ey - 5, ex + 5, ey + 5], fill=(120, 255, 170))
a = a.resize((48, 48), Image.LANCZOS)
# 47 쥐 표식: 붉은 과녁 앞으로 달려드는 쥐 ("물어라!")
b = burst(S * 0.62, S * 0.4, RED, 5, glow=(255, 236, 228), bg=(30, 6, 6)); d = ImageDraw.Draw(b)
for r, w in ((S * 0.34, 10), (S * 0.2, 9)): d.ellipse([S * 0.62 - r, S * 0.4 - r, S * 0.62 + r, S * 0.4 + r], outline=(20, 0, 0), width=w)
d.ellipse([S * 0.62 - 9, S * 0.4 - 9, S * 0.62 + 9, S * 0.4 + 9], fill=(20, 0, 0))
ex, ey = rat(d, S * 0.36, S * 0.7, S * 0.66, 1, edge=(255, 225, 215))
for k in range(3): d.line([(S * 0.04, S * (0.58 + 0.08 * k)), (S * 0.16, S * (0.58 + 0.08 * k))], fill=(20, 0, 0), width=6)
b = b.resize((48, 48), Image.LANCZOS)
# 48 쥐 포박: 사람 몸에 주렁주렁 매달린 쥐들 · 밧줄
c = burst(S * 0.5, S * 0.4, GREEN, 9); d = ImageDraw.Draw(c)
d.ellipse([S * 0.4, S * 0.08, S * 0.6, S * 0.28], fill=(0, 0, 0), outline=(225, 255, 235), width=5)
d.rounded_rectangle([S * 0.34, S * 0.28, S * 0.66, S * 0.86], radius=26, fill=(0, 0, 0), outline=(225, 255, 235), width=5)
for (y0, y1) in ((0.4, 0.5), (0.6, 0.7)): d.line([(S * 0.3, S * y0), (S * 0.7, S * y1)], fill=(240, 200, 120), width=7)
for (x, y, s, f) in ((S * 0.2, S * 0.42, S * 0.34, 1), (S * 0.82, S * 0.56, S * 0.34, -1), (S * 0.24, S * 0.78, S * 0.32, 1), (S * 0.8, S * 0.86, S * 0.3, -1)):
    rat(d, x, y, s, f, edge=(225, 255, 235))
c = c.resize((48, 48), Image.LANCZOS)
# 49 구르기: 둥글게 말린 몸 · 둘레를 도는 화살
e = burst(S * 0.5, S * 0.5, GREEN, 13); d = ImageDraw.Draw(e)
d.ellipse([S * 0.28, S * 0.28, S * 0.72, S * 0.72], fill=(0, 0, 0), outline=(225, 255, 235), width=6)
d.arc([S * 0.36, S * 0.36, S * 0.64, S * 0.64], 200, 340, fill=(225, 255, 235), width=5)
for a0, a1 in ((150, 300), (330, 480)):
    d.arc([S * 0.12, S * 0.12, S * 0.88, S * 0.88], a0, a1, fill=(0, 0, 0), width=13)
    t = math.radians(a1); hx, hy = S * 0.5 + S * 0.38 * math.cos(t), S * 0.5 + S * 0.38 * math.sin(t); n = t + math.pi / 2
    d.polygon([(hx + 22 * math.cos(n), hy + 22 * math.sin(n)), (hx + 16 * math.cos(t), hy + 16 * math.sin(t)), (hx - 16 * math.cos(t), hy - 16 * math.sin(t))], fill=(0, 0, 0))
for k in range(3): d.line([(S * 0.02, S * (0.8 + 0.06 * k)), (S * 0.2, S * (0.8 + 0.06 * k))], fill=(0, 0, 0), width=6)
e = e.resize((48, 48), Image.LANCZOS)
old = Image.open(D + 'icons_v878.webp').convert('RGB'); im = Image.new('RGB', (384, 384), (20, 18, 15)); im.paste(old, (0, 0))
for i, t in ((46, a), (47, b), (48, c), (49, e)): im.paste(t, ((i % 8) * 48, (i // 8) * 48))
im.save(D + 'icons_v878b.webp', 'WEBP', quality=92, method=6)
z = Image.new('RGB', (200 * 4, 192), (40, 40, 40))
for k, t in enumerate((a, b, c, e)): z.paste(t.resize((192, 192), Image.NEAREST), (200 * k, 0))
z.save(D + 'zoom_b.png'); print('mkico_b OK', im.size)
