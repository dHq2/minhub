# v8.7.8 아이콘 (3) — mkico_c.py v1.0 (v1.0: 아이콘 판 8 × 8 → 8 × 10 (80칸 — 물레 · 콜라이더 · 테헤라 자리) · 어퐁 둘: 50 초돌진 (숙인 거구 · 넓은 충격 반원 · 속도선) · 51 앞차기 (높이 든 다리) ·
#   카리우스 아홉: 52 잡아뚫기 (길게 뻗은 광대의 팔 · 꿰뚫는 손끝) · 53 노인의 팔 (굵은 팔 · 부채꼴 자국) · 54 라이트 훅 (주먹 셋) · 55 짓밟기 (발바닥 · 갈라진 땅) · 56 근성 (안경 · 살아난 안광) ·
#   57 불경자 (새까만 얼굴 · 빛나는 안경) · 58 노인의 팔 철퇴 (부푼 팔이 내려찍음) · 59 돌진 몸박 (숙인 어깨 · 화살) · 60 딥 킥 (걷어차인 몸이 날아감) — 도감 아이콘 결: 색 빛살 바탕 + 검은 실루엣)
import math, random
from PIL import Image, ImageDraw, ImageFilter
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/ico878/'
S = 192
def burst(cx, cy, cols, seed, glow=(255, 248, 230), bg=(20, 14, 6)):
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
AMB = [(250, 190, 60), (140, 80, 10), (255, 230, 150), (190, 120, 20)]   # 어퐁 (장군 — 금빛)
PUR = [(150, 90, 230), (60, 20, 110), (210, 170, 255), (100, 50, 170)]   # 카리우스 (보라 — 기술 칸 색)
RED = [(235, 70, 50), (110, 20, 20), (255, 150, 110), (170, 35, 30)]
DRK = [(60, 50, 70), (20, 16, 26), (120, 100, 140), (40, 30, 50)]
K = (0, 0, 0)
def edge(d, pts, w, col=(250, 240, 225)): d.line(pts, fill=col, width=w + 8, joint='curve'); d.line(pts, fill=K, width=w, joint='curve')
def blob(d, box, col=(250, 240, 225), e=5): d.ellipse([box[0] - e, box[1] - e, box[2] + e, box[3] + e], fill=col); d.ellipse(box, fill=K)
def speed(d, x0, y0, n=3, L=0.18, gap=0.09):
    for k in range(n): d.line([(S * x0, S * (y0 + gap * k)), (S * (x0 + L), S * (y0 + gap * k))], fill=K, width=7)
out = {}
# 50 초돌진: 숙인 거구가 오른쪽으로 · 앞에 넓은 충격 반원 · 뒤에 속도선
a = burst(S * 0.62, S * 0.5, AMB, 21); d = ImageDraw.Draw(a)
for rr, w in ((S * 0.36, 9), (S * 0.27, 7)): d.arc([S * 0.62 - rr, S * 0.5 - rr, S * 0.62 + rr, S * 0.5 + rr], -70, 70, fill=K, width=w)
blob(d, [S * 0.3, S * 0.36, S * 0.62, S * 0.66]); blob(d, [S * 0.56, S * 0.3, S * 0.72, S * 0.46])   # 몸통 · 숙인 머리
d.rounded_rectangle([S * 0.6, S * 0.46, S * 0.74, S * 0.6], radius=10, fill=K, outline=(250, 240, 225), width=4)   # 버클러
edge(d, [(S * 0.36, S * 0.64), (S * 0.3, S * 0.84)], 16); edge(d, [(S * 0.52, S * 0.64), (S * 0.62, S * 0.82)], 16)
speed(d, 0.03, 0.4, 3, 0.2); out[50] = a
# 51 앞차기: 서 있는 몸 · 높이 앞으로 뻗은 다리
b = burst(S * 0.6, S * 0.42, AMB, 23); d = ImageDraw.Draw(b)
blob(d, [S * 0.24, S * 0.12, S * 0.4, S * 0.28]); edge(d, [(S * 0.32, S * 0.28), (S * 0.34, S * 0.58)], 30)
edge(d, [(S * 0.34, S * 0.58), (S * 0.3, S * 0.9)], 20); edge(d, [(S * 0.34, S * 0.56), (S * 0.62, S * 0.42), (S * 0.86, S * 0.3)], 20)
d.rounded_rectangle([S * 0.82, S * 0.22, S * 0.95, S * 0.36], radius=8, fill=K)
for k in range(3): d.line([(S * 0.9, S * (0.12 + 0.05 * k)), (S * 0.98, S * (0.08 + 0.05 * k))], fill=K, width=5)
out[51] = b
# 52 잡아뚫기: 오른쪽에서 길게 뻗은 광대의 팔 · 왼쪽 몸을 움켜쥠 · 꿰뚫는 손끝
c = burst(S * 0.4, S * 0.5, PUR, 25, glow=(245, 235, 255), bg=(16, 8, 26)); d = ImageDraw.Draw(c)
blob(d, [S * 0.1, S * 0.32, S * 0.3, S * 0.72])
edge(d, [(S * 0.96, S * 0.62), (S * 0.7, S * 0.52), (S * 0.46, S * 0.56), (S * 0.3, S * 0.5)], 14)
for k in (-1, 0, 1): edge(d, [(S * 0.32, S * 0.5), (S * 0.22, S * (0.5 + 0.08 * k))], 7)
d.polygon([(S * 0.34, S * 0.14), (S * 0.42, S * 0.3), (S * 0.26, S * 0.3)], fill=K); edge(d, [(S * 0.34, S * 0.3), (S * 0.3, S * 0.44)], 9)
out[52] = c
# 53 노인의 팔: 굵은 팔 하나 · 앞으로 넓은 부채꼴 자국
e = burst(S * 0.5, S * 0.55, PUR, 27, glow=(245, 235, 255), bg=(16, 8, 26)); d = ImageDraw.Draw(e)
for rr, w in ((S * 0.42, 10), (S * 0.32, 6)): d.arc([S * 0.5 - rr, S * 0.62 - rr, S * 0.5 + rr, S * 0.62 + rr], 200, 340, fill=K, width=w)
edge(d, [(S * 0.12, S * 0.82), (S * 0.34, S * 0.56), (S * 0.62, S * 0.42)], 30); blob(d, [S * 0.58, S * 0.3, S * 0.8, S * 0.52])
out[53] = e
# 54 라이트 훅: 주먹 셋 (팔 여럿)
f = burst(S * 0.55, S * 0.5, PUR, 29, glow=(245, 235, 255), bg=(16, 8, 26)); d = ImageDraw.Draw(f)
for k, (x, y) in enumerate(((0.62, 0.24), (0.72, 0.5), (0.6, 0.76))):
    edge(d, [(S * 0.12, S * (0.3 + 0.2 * k)), (S * (x - 0.1), S * y)], 13); blob(d, [S * (x - 0.1), S * (y - 0.09), S * (x + 0.08), S * (y + 0.09)])
out[54] = f
# 55 짓밟기: 큰 발바닥이 내려옴 · 갈라진 땅
g = burst(S * 0.5, S * 0.7, PUR, 31, glow=(245, 235, 255), bg=(16, 8, 26)); d = ImageDraw.Draw(g)
d.line([(S * 0.05, S * 0.84), (S * 0.95, S * 0.84)], fill=K, width=8)
for (x0, x1, y1) in ((0.3, 0.2, 0.98), (0.5, 0.52, 1.0), (0.7, 0.82, 0.97)): d.line([(S * x0, S * 0.84), (S * x1, S * y1)], fill=K, width=6)
edge(d, [(S * 0.5, S * 0.02), (S * 0.5, S * 0.4)], 30); blob(d, [S * 0.28, S * 0.36, S * 0.72, S * 0.66])
for k in range(4): d.ellipse([S * (0.3 + 0.1 * k), S * 0.28, S * (0.37 + 0.1 * k), S * 0.36], fill=K)
out[55] = g
# 56 근성: 안경 · 살아난 안광 (붉은 빛)
h = burst(S * 0.5, S * 0.5, RED, 33, glow=(255, 236, 226), bg=(30, 6, 6)); d = ImageDraw.Draw(h)
blob(d, [S * 0.2, S * 0.18, S * 0.8, S * 0.86])
for x in (0.36, 0.64):
    d.ellipse([S * (x - 0.11), S * 0.4, S * (x + 0.11), S * 0.58], outline=(250, 240, 225), width=6); d.ellipse([S * (x - 0.05), S * 0.45, S * (x + 0.05), S * 0.53], fill=(255, 70, 40))
d.line([(S * 0.47, S * 0.49), (S * 0.53, S * 0.49)], fill=(250, 240, 225), width=5)
for k in range(5): a0 = -2.4 + k * 0.38; d.line([(S * 0.5 + math.cos(a0) * S * 0.36, S * 0.5 + math.sin(a0) * S * 0.36), (S * 0.5 + math.cos(a0) * S * 0.47, S * 0.5 + math.sin(a0) * S * 0.47)], fill=K, width=7)
out[56] = h
# 57 불경자: 새까만 얼굴 · 빛나는 안경만
i = burst(S * 0.5, S * 0.5, DRK, 35, glow=(200, 190, 210), bg=(8, 6, 10)); d = ImageDraw.Draw(i)
blob(d, [S * 0.2, S * 0.16, S * 0.8, S * 0.88], col=(90, 80, 100))
for x in (0.36, 0.64):
    d.ellipse([S * (x - 0.12), S * 0.38, S * (x + 0.12), S * 0.58], fill=(255, 246, 192), outline=(255, 255, 240), width=4)
d.line([(S * 0.48, S * 0.47), (S * 0.52, S * 0.47)], fill=(255, 246, 192), width=5)
out[57] = i
# 58 노인의 팔 철퇴: 부푼 팔이 철퇴처럼 내려찍음 · 둘레 충격 고리
j = burst(S * 0.5, S * 0.72, RED, 37, glow=(255, 236, 226), bg=(30, 6, 6)); d = ImageDraw.Draw(j)
d.ellipse([S * 0.18, S * 0.72, S * 0.82, S * 0.94], outline=K, width=8)
edge(d, [(S * 0.15, S * 0.1), (S * 0.32, S * 0.3), (S * 0.46, S * 0.52)], 34); blob(d, [S * 0.34, S * 0.46, S * 0.66, S * 0.8])
out[58] = j
# 59 돌진 몸박: 숙인 어깨 · 앞으로 굵은 화살
k2 = burst(S * 0.6, S * 0.5, RED, 39, glow=(255, 236, 226), bg=(30, 6, 6)); d = ImageDraw.Draw(k2)
blob(d, [S * 0.18, S * 0.3, S * 0.56, S * 0.74]); blob(d, [S * 0.46, S * 0.26, S * 0.64, S * 0.46])
d.polygon([(S * 0.64, S * 0.44), (S * 0.86, S * 0.44), (S * 0.86, S * 0.34), (S * 0.99, S * 0.52), (S * 0.86, S * 0.7), (S * 0.86, S * 0.6), (S * 0.64, S * 0.6)], fill=K)
speed(d, 0.0, 0.36, 3, 0.15, 0.12); out[59] = k2
# 60 딥 킥: 왼쪽 다리가 걷어차고 · 오른쪽 몸이 날아감
l = burst(S * 0.5, S * 0.5, PUR, 41, glow=(245, 235, 255), bg=(16, 8, 26)); d = ImageDraw.Draw(l)
edge(d, [(S * 0.04, S * 0.7), (S * 0.3, S * 0.6), (S * 0.46, S * 0.56)], 26); d.rounded_rectangle([S * 0.42, S * 0.46, S * 0.56, S * 0.66], radius=8, fill=K)
blob(d, [S * 0.66, S * 0.16, S * 0.86, S * 0.36]); edge(d, [(S * 0.76, S * 0.36), (S * 0.9, S * 0.56)], 18)
for k in range(3): d.line([(S * 0.58, S * (0.3 + 0.08 * k)), (S * 0.66, S * (0.26 + 0.08 * k))], fill=K, width=5)
out[60] = l
old = Image.open(D + 'icons_v878b.webp').convert('RGB'); im = Image.new('RGB', (384, 480), (20, 18, 15)); im.paste(old, (0, 0))
for idx, t in out.items(): im.paste(t.resize((48, 48), Image.LANCZOS), ((idx % 8) * 48, (idx // 8) * 48))
im.save(D + 'icons_v878c.webp', 'WEBP', quality=92, method=6)
z = Image.new('RGB', (200 * len(out), 192), (40, 40, 40))
for k, (idx, t) in enumerate(sorted(out.items())): z.paste(t, (200 * k, 0))
z.save(D + 'zoom_c.png'); print('mkico_c OK', im.size, len(out))
