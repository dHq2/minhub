# v8.7.8 아이콘 (4) — mkico_d.py v1.0 (v1.0: 아이콘 판 8 × 10 의 남은 칸 61 ~ 79 (19칸) — 물레 · 콜라이더 · 테헤라:
#   물레 (물빛): 61 정령 강림 (내려앉는 물방울 · 넓은 물결 원) · 62 정령 방벽 (물결치는 장막) · 63 땅의 정령 (작은 정령 · 빛 점) · 64 물 정령 탄 (물방울 탄 셋) · 65 ◆정령 계약 (맞잡은 두 손 · 물방울) · 66 정령의 손길 (뻗은 손끝의 물방울 · 십자)
#   콜라이더 (심연 보라): 67 차원 문 (검은 소용돌이) · 68 별빛 지목 (가시 덩굴 끝의 별) · 69 마계 장막 (날개 돔) · 70 유혹의 손짓 (손짓 · 하트) · 71 ◆마계 대사 (굽은 두 뿔의 머리 · 갈고리 꼬리) · 72 갈퀴 꼬리 (휘감는 꼬리 · 갈고리)
#   테헤라 (분홍 금빛): 73 광역 손짓 (뻗은 손 · 퍼지는 물결) · 74 은빛 비행 (잠자리 날개 · 속도선) · 75 날개 방패 (몸을 감싼 날개) · 76 나른한 꿈 (앉은 몸 · 초승달 · Z) · 77 ◆요정 날개 (잠자리 날개 넷) ·
#   78 축복:테헤라 (작은 왕관 · 빛가루 고리) · 79 요정의 축복 (허리 굽혀 뻗은 손 · 빛가루) — 도감 아이콘 결: 색 빛살 바탕 + 검은 실루엣)
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
WAT = [(90, 170, 240), (20, 60, 120), (170, 220, 255), (50, 110, 190)]   # 물레 (물빛)
ABY = [(130, 70, 200), (30, 14, 60), (190, 150, 240), (80, 40, 140)]   # 콜라이더 (심연 보라)
FAI = [(245, 170, 205), (150, 90, 60), (255, 225, 160), (220, 130, 170)]   # 테헤라 (분홍 · 금빛)
K = (0, 0, 0); WH = (250, 240, 225)
def edge(d, pts, w, col=WH): d.line(pts, fill=col, width=w + 8, joint='curve'); d.line(pts, fill=K, width=w, joint='curve')
def blob(d, box, col=WH, e=5): d.ellipse([box[0] - e, box[1] - e, box[2] + e, box[3] + e], fill=col); d.ellipse(box, fill=K)
def drop(d, cx, cy, r, col=K, ol=WH):   # 물방울 (아래가 둥글고 위가 뾰족)
    pts = [(cx, cy - r * 1.7)] + [(cx + r * math.cos(a), cy + r * math.sin(a)) for a in [i / 16 * math.pi * 1.6 - math.pi * 0.3 for i in range(17)]]
    d.polygon(pts, fill=col, outline=ol)
def star(d, cx, cy, r, col=K, n=5):
    pts = []
    for i in range(n * 2): a = -math.pi / 2 + i * math.pi / n; rr = r if i % 2 == 0 else r * 0.45; pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=col)
def wing(d, cx, cy, ang, L, W, col=K):   # 잠자리 날개 하나 (긴 타원)
    pts = []
    for i in range(24):
        t = i / 23 * 2 * math.pi; x, y = L / 2 * (1 + math.cos(t)), W / 2 * math.sin(t)
        pts.append((cx + x * math.cos(ang) - y * math.sin(ang), cy + x * math.sin(ang) + y * math.cos(ang)))
    d.polygon(pts, fill=col, outline=WH)
out = {}
# 61 정령 강림: 위에서 내려앉는 큰 물방울 · 바닥의 넓은 물결 원 둘
a = burst(S * 0.5, S * 0.45, WAT, 61, glow=(235, 248, 255), bg=(6, 16, 30)); d = ImageDraw.Draw(a)
for rr, w in ((S * 0.42, 8), (S * 0.3, 6)): d.ellipse([S * 0.5 - rr, S * 0.78 - rr * 0.32, S * 0.5 + rr, S * 0.78 + rr * 0.32], outline=K, width=w)
drop(d, S * 0.5, S * 0.5, S * 0.14)
for x in (0.22, 0.78): d.line([(S * x, S * 0.12), (S * x, S * 0.3)], fill=K, width=6)
out[61] = a
# 62 정령 방벽: 세로로 물결치는 장막 셋
b = burst(S * 0.5, S * 0.5, WAT, 62, glow=(235, 248, 255), bg=(6, 16, 30)); d = ImageDraw.Draw(b)
for k, x0 in enumerate((0.34, 0.5, 0.66)):
    pts = [(S * (x0 + 0.05 * math.sin(i / 10 * math.pi * 2 + k)), S * (0.1 + 0.08 * i)) for i in range(11)]; edge(d, pts, 10)
out[62] = b
# 63 땅의 정령: 작은 둥근 정령 · 두 눈 · 둘레 빛 점
c = burst(S * 0.5, S * 0.55, WAT, 63, glow=(235, 248, 255), bg=(6, 16, 30)); d = ImageDraw.Draw(c)
blob(d, [S * 0.3, S * 0.36, S * 0.7, S * 0.76]); d.polygon([(S * 0.42, S * 0.4), (S * 0.5, S * 0.2), (S * 0.58, S * 0.4)], fill=K)
for x in (0.42, 0.58): d.ellipse([S * (x - 0.04), S * 0.5, S * (x + 0.04), S * 0.58], fill=(200, 235, 255))
for (x, y) in ((0.16, 0.3), (0.84, 0.34), (0.2, 0.78), (0.82, 0.8)): d.ellipse([S * (x - 0.03), S * (y - 0.03), S * (x + 0.03), S * (y + 0.03)], fill=K)
out[63] = c
# 64 물 정령 탄: 오른쪽으로 날아가는 물방울 탄 셋 · 꼬리
e = burst(S * 0.3, S * 0.5, WAT, 64, glow=(235, 248, 255), bg=(6, 16, 30)); d = ImageDraw.Draw(e)
for (x, y) in ((0.62, 0.26), (0.78, 0.5), (0.62, 0.74)):
    d.line([(S * (x - 0.3), S * y), (S * x, S * y)], fill=K, width=6); d.ellipse([S * (x - 0.08), S * (y - 0.08), S * (x + 0.08), S * (y + 0.08)], fill=K, outline=WH, width=3)
out[64] = e
# 65 ◆정령 계약: 맞잡은 두 손 (두 팔) · 위의 물방울
f = burst(S * 0.5, S * 0.4, WAT, 65, glow=(235, 248, 255), bg=(6, 16, 30)); d = ImageDraw.Draw(f)
edge(d, [(S * 0.06, S * 0.86), (S * 0.3, S * 0.66), (S * 0.46, S * 0.6)], 22); edge(d, [(S * 0.94, S * 0.86), (S * 0.7, S * 0.66), (S * 0.54, S * 0.6)], 22)
blob(d, [S * 0.4, S * 0.52, S * 0.6, S * 0.68]); drop(d, S * 0.5, S * 0.32, S * 0.09)
out[65] = f
# 66 정령의 손길: 위로 뻗은 손끝 · 물방울 · 회복 십자
g = burst(S * 0.6, S * 0.4, WAT, 66, glow=(235, 248, 255), bg=(6, 16, 30)); d = ImageDraw.Draw(g)
edge(d, [(S * 0.14, S * 0.92), (S * 0.32, S * 0.66), (S * 0.46, S * 0.5)], 20)
for k in (-1, 0, 1): edge(d, [(S * 0.46, S * 0.5), (S * (0.52 + 0.04 * k), S * (0.4 - 0.02 * abs(k)))], 6)
drop(d, S * 0.66, S * 0.3, S * 0.08); d.rectangle([S * 0.74, S * 0.56, S * 0.78, S * 0.76], fill=K); d.rectangle([S * 0.66, S * 0.64, S * 0.86, S * 0.68], fill=K)
out[66] = g
# 67 차원 문: 검은 소용돌이 (나선 셋)
h = burst(S * 0.5, S * 0.5, ABY, 67, glow=(240, 230, 255), bg=(10, 4, 20)); d = ImageDraw.Draw(h)
for k in range(3):
    pts = []
    for i in range(40): t = i / 39; ang = k * 2.09 + t * 4.2; rr = S * (0.05 + 0.38 * t); pts.append((S * 0.5 + rr * math.cos(ang), S * 0.5 + rr * math.sin(ang)))
    d.line(pts, fill=K, width=int(10 - 4 * k / 2), joint='curve')
d.ellipse([S * 0.42, S * 0.42, S * 0.58, S * 0.58], fill=K)
out[67] = h
# 68 별빛 지목: 가시 덩굴이 뻗어 끝에 별
i = burst(S * 0.7, S * 0.3, ABY, 68, glow=(240, 230, 255), bg=(10, 4, 20)); d = ImageDraw.Draw(i)
edge(d, [(S * 0.06, S * 0.94), (S * 0.3, S * 0.7), (S * 0.42, S * 0.56), (S * 0.62, S * 0.38)], 8)
for (x, y, dx, dy) in ((0.22, 0.79, -0.05, -0.05), (0.36, 0.63, 0.05, 0.03), (0.5, 0.48, -0.05, -0.04)): d.line([(S * x, S * y), (S * (x + dx), S * (y + dy))], fill=K, width=5)
star(d, S * 0.7, S * 0.3, S * 0.16)
out[69 - 1] = i
# 69 마계 장막: 펼친 날개 (박쥐 · 반투명) 가 둥근 돔을 이룸
j = burst(S * 0.5, S * 0.6, ABY, 69, glow=(240, 230, 255), bg=(10, 4, 20)); d = ImageDraw.Draw(j)
d.arc([S * 0.08, S * 0.18, S * 0.92, S * 1.02], 180, 360, fill=K, width=10)
for k in range(5): a0 = math.pi + (k + 0.5) / 5 * math.pi; d.line([(S * 0.5, S * 0.6), (S * 0.5 + S * 0.42 * math.cos(a0), S * 0.6 + S * 0.42 * math.sin(a0))], fill=K, width=5)
blob(d, [S * 0.42, S * 0.52, S * 0.58, S * 0.7])
out[69] = j
# 70 유혹의 손짓: 손바닥을 위로 둔 손짓 · 하트
k2 = burst(S * 0.5, S * 0.4, ABY, 70, glow=(255, 225, 240), bg=(10, 4, 20)); d = ImageDraw.Draw(k2)
edge(d, [(S * 0.1, S * 0.9), (S * 0.3, S * 0.72), (S * 0.46, S * 0.66)], 18)
for k in range(4): edge(d, [(S * 0.46, S * 0.66), (S * (0.52 + 0.05 * k), S * (0.56 - 0.02 * k))], 6)
hx, hy, hr = S * 0.62, S * 0.28, S * 0.09
d.ellipse([hx - hr * 2, hy - hr, hx, hy + hr], fill=K); d.ellipse([hx, hy - hr, hx + hr * 2, hy + hr], fill=K); d.polygon([(hx - hr * 1.95, hy + hr * 0.2), (hx + hr * 1.95, hy + hr * 0.2), (hx, hy + hr * 2.3)], fill=K)
out[70] = k2
# 71 ◆마계 대사: 굽은 두 뿔의 머리 · 아래로 갈고리 꼬리
l = burst(S * 0.5, S * 0.45, ABY, 71, glow=(240, 230, 255), bg=(10, 4, 20)); d = ImageDraw.Draw(l)
blob(d, [S * 0.32, S * 0.3, S * 0.68, S * 0.66])
edge(d, [(S * 0.36, S * 0.36), (S * 0.22, S * 0.24), (S * 0.24, S * 0.1)], 10); edge(d, [(S * 0.64, S * 0.36), (S * 0.78, S * 0.24), (S * 0.76, S * 0.1)], 10)
for x in (0.43, 0.57): d.ellipse([S * (x - 0.03), S * 0.44, S * (x + 0.03), S * 0.5], fill=(250, 250, 255))
edge(d, [(S * 0.5, S * 0.66), (S * 0.58, S * 0.84), (S * 0.76, S * 0.88)], 8); d.polygon([(S * 0.74, S * 0.8), (S * 0.9, S * 0.88), (S * 0.74, S * 0.96)], fill=K)
out[71] = l
# 72 갈퀴 꼬리: 크게 휘두르는 꼬리 · 끝의 갈고리 · 부채꼴 자국
m = burst(S * 0.4, S * 0.6, ABY, 72, glow=(240, 230, 255), bg=(10, 4, 20)); d = ImageDraw.Draw(m)
d.arc([S * 0.1, S * 0.1, S * 0.9, S * 0.9], 200, 320, fill=K, width=6)
edge(d, [(S * 0.12, S * 0.9), (S * 0.3, S * 0.62), (S * 0.5, S * 0.42), (S * 0.72, S * 0.3)], 12)
d.polygon([(S * 0.68, S * 0.22), (S * 0.92, S * 0.18), (S * 0.8, S * 0.4)], fill=K, outline=WH)
out[72] = m
# 73 광역 손짓: 앞으로 뻗은 손 · 퍼지는 부채꼴 물결 셋
n = burst(S * 0.3, S * 0.55, FAI, 73, glow=(255, 245, 235), bg=(26, 12, 16)); d = ImageDraw.Draw(n)
edge(d, [(S * 0.02, S * 0.8), (S * 0.18, S * 0.62), (S * 0.32, S * 0.54)], 16)
for k in range(4): edge(d, [(S * 0.32, S * 0.54), (S * 0.4, S * (0.44 + 0.05 * k))], 5)
for rr, w in ((S * 0.3, 9), (S * 0.45, 7), (S * 0.6, 5)): d.arc([S * 0.36 - rr, S * 0.52 - rr, S * 0.36 + rr, S * 0.52 + rr], -45, 45, fill=K, width=w)
out[73] = n
# 74 은빛 비행: 몸을 눕힌 실루엣 · 잠자리 날개 둘 · 속도선
o = burst(S * 0.6, S * 0.45, FAI, 74, glow=(255, 245, 235), bg=(26, 12, 16)); d = ImageDraw.Draw(o)
edge(d, [(S * 0.3, S * 0.6), (S * 0.62, S * 0.5)], 16); blob(d, [S * 0.62, S * 0.42, S * 0.76, S * 0.56])
wing(d, S * 0.42, S * 0.52, -2.2, S * 0.4, S * 0.12); wing(d, S * 0.46, S * 0.54, -2.7, S * 0.36, S * 0.1)
for k in range(3): d.line([(S * 0.02, S * (0.6 + 0.08 * k)), (S * 0.22, S * (0.6 + 0.08 * k))], fill=K, width=6)
out[74] = o
# 75 날개 방패: 몸을 감싼 날개 둘 (방패꼴)
p = burst(S * 0.5, S * 0.5, FAI, 75, glow=(255, 245, 235), bg=(26, 12, 16)); d = ImageDraw.Draw(p)
blob(d, [S * 0.42, S * 0.2, S * 0.58, S * 0.36])
wing(d, S * 0.5, S * 0.36, 1.85, S * 0.5, S * 0.22); wing(d, S * 0.5, S * 0.36, 1.29, S * 0.5, S * 0.22)
out[75] = p
# 76 나른한 꿈: 앉은 몸 · 초승달 · Z
q = burst(S * 0.5, S * 0.4, FAI, 76, glow=(255, 245, 235), bg=(26, 12, 16)); d = ImageDraw.Draw(q)
blob(d, [S * 0.3, S * 0.44, S * 0.46, S * 0.6]); edge(d, [(S * 0.38, S * 0.6), (S * 0.42, S * 0.78), (S * 0.66, S * 0.8)], 18)
d.ellipse([S * 0.62, S * 0.1, S * 0.86, S * 0.34], fill=K); d.ellipse([S * 0.68, S * 0.06, S * 0.92, S * 0.3], fill=(255, 238, 200))
for (x, y, s) in ((0.6, 0.48, 0.08), (0.72, 0.4, 0.06)): d.line([(S * x, S * y), (S * (x + s), S * y), (S * x, S * (y + s)), (S * (x + s), S * (y + s))], fill=K, width=5)
out[76] = q
# 77 ◆요정 날개: 잠자리 날개 넷 (가운데 가는 몸)
r2 = burst(S * 0.5, S * 0.5, FAI, 77, glow=(255, 245, 235), bg=(26, 12, 16)); d = ImageDraw.Draw(r2)
for ang in (-2.6, -0.55, 2.75, 0.4): wing(d, S * 0.5, S * 0.48, ang, S * 0.44, S * 0.13)
d.line([(S * 0.5, S * 0.3), (S * 0.5, S * 0.86)], fill=K, width=8); d.ellipse([S * 0.45, S * 0.24, S * 0.55, S * 0.34], fill=K)
out[77] = r2
# 78 축복:테헤라: 작은 왕관 · 둘레 빛가루 고리
s2 = burst(S * 0.5, S * 0.5, FAI, 78, glow=(255, 250, 225), bg=(26, 12, 16)); d = ImageDraw.Draw(s2)
d.polygon([(S * 0.3, S * 0.62), (S * 0.3, S * 0.4), (S * 0.4, S * 0.5), (S * 0.5, S * 0.34), (S * 0.6, S * 0.5), (S * 0.7, S * 0.4), (S * 0.7, S * 0.62)], fill=K, outline=WH)
for k in range(10): a0 = k / 10 * 2 * math.pi; d.ellipse([S * 0.5 + S * 0.36 * math.cos(a0) - 5, S * 0.52 + S * 0.36 * math.sin(a0) - 5, S * 0.5 + S * 0.36 * math.cos(a0) + 5, S * 0.52 + S * 0.36 * math.sin(a0) + 5], fill=K)
out[78] = s2
# 79 요정의 축복: 허리 굽혀 아래로 뻗은 손 · 손끝의 빛가루 · 회복 십자
t2 = burst(S * 0.55, S * 0.6, FAI, 79, glow=(255, 250, 225), bg=(26, 12, 16)); d = ImageDraw.Draw(t2)
blob(d, [S * 0.14, S * 0.1, S * 0.3, S * 0.26]); edge(d, [(S * 0.24, S * 0.26), (S * 0.4, S * 0.4), (S * 0.56, S * 0.56)], 14)
for k in range(5): d.ellipse([S * (0.58 + 0.06 * (k % 3)) - 4, S * (0.62 + 0.06 * (k // 3)) - 4, S * (0.58 + 0.06 * (k % 3)) + 4, S * (0.62 + 0.06 * (k // 3)) + 4], fill=K)
d.rectangle([S * 0.78, S * 0.72, S * 0.82, S * 0.92], fill=K); d.rectangle([S * 0.7, S * 0.8, S * 0.9, S * 0.84], fill=K)
out[79] = t2
assert sorted(out) == list(range(61, 80)), sorted(out)
old = Image.open(D + 'icons_v878c.webp').convert('RGB'); im = old.copy()
for idx, t in out.items(): im.paste(t.resize((48, 48), Image.LANCZOS), ((idx % 8) * 48, (idx // 8) * 48))
im.save(D + 'icons_v878d.webp', 'WEBP', quality=92, method=6)
z = Image.new('RGB', (200 * 10, 192 * 2), (40, 40, 40))
for k, (idx, t) in enumerate(sorted(out.items())): z.paste(t, (200 * (k % 10), 192 * (k // 10)))
z.save(D + 'zoom_d.png'); print('mkico_d OK', im.size, len(out))
