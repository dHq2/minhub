# v8.7.9 아이콘 (펄 · 각펄) — mkico_e.py v1.1 (v1.1: 날개는 굵은 실루엣 (깃 끝 다섯 · 찢긴 날개는 들쭉날쭉) · 철 깃털 굵게 · 움츠리기는 몸을 감싼 두 날개 · v1.0: 아이콘 판 8 × 10 → 8 × 12 (두 줄 · 80 ~ 95 · 16칸) — 도감 아이콘 결: 색 빛살 바탕 + 검은 실루엣
#   펄 (금빛 깃털): 80 ◆타천 날개 (찢긴 검은 날개 · 떨어지는 깃털) · 82 철 깃털 (부채꼴로 날아가는 강철 깃털 다섯) · 83 꼬깃꼬깃 착지 (구겨진 날개로 내려앉음 · 땅의 물결) ·
#     84 돌려차기 (돌며 뻗은 다리 · 휘도는 줄) · 85 움츠리기 (몸을 감싼 두 날개)
#   각펄 (핏빛 검정): 81 ◆끝까지 (땅에 박은 창을 붙잡고 버팀 · 금) · 86 정면 투창 (곧게 날아가는 창 · 속도선) · 87 각펄 (깨진 고리 · 붉은 눈) ·
#     88 솟는 거대 창 (땅에서 솟는 큰 창 · 갈라진 바닥) · 89 공중 투창 (창비 — 떨어지는 창 여럿) · 90 반경 10m 횡베기 (크게 도는 창 · 큰 원) · 91 정면 처형 (몸째 날아드는 창 · 뒤로 뺀 자취) ·
#     92 창 대포 (매우 긴 찌르기 · 바람 고리) · 93 날아 투창 (날개 · 아래로 던지는 창 · 깨진 방벽) · 94 초대형 치명타 (하늘에서 꽂히는 거대한 창 · 큰 원) · 95 처형 내리꽂기 (날아올라 아래로 꽂히는 꼬치))
import math, random
from PIL import Image, ImageDraw, ImageFilter
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
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
PEA = [(236, 200, 110), (60, 42, 50), (252, 232, 186), (176, 126, 92)]   # 펄 (금빛 깃털)
GAK = [(168, 28, 48), (24, 8, 14), (226, 86, 86), (92, 14, 30)]   # 각펄 (핏빛 검정)
K = (0, 0, 0); WH = (250, 240, 225); RED = (235, 40, 50)
def edge(d, pts, w, col=WH): d.line(pts, fill=col, width=w + 8, joint='curve'); d.line(pts, fill=K, width=w, joint='curve')
def blob(d, box, col=WH, e=5): d.ellipse([box[0] - e, box[1] - e, box[2] + e, box[3] + e], fill=col); d.ellipse(box, fill=K)
def P(x, y): return (S * x, S * y)
def spear(d, x0, y0, x1, y1, w=9, head=0.12, ol=WH):   # 창: 자루 + 끝의 날 (x1, y1 쪽) — 좌표는 0 ~ 1
    X0, Y0, X1, Y1 = S * x0, S * y0, S * x1, S * y1; a = math.atan2(Y1 - Y0, X1 - X0); Hl = S * head
    bx, by = X1 - math.cos(a) * Hl, Y1 - math.sin(a) * Hl
    d.line([(X0, Y0), (bx, by)], fill=ol, width=w + 8); d.line([(X0, Y0), (bx, by)], fill=K, width=w)
    nx, ny = -math.sin(a), math.cos(a); hw = Hl * 0.42
    tri = [(X1, Y1), (bx + nx * hw, by + ny * hw), (bx - math.cos(a) * S * 0.02, by - math.sin(a) * S * 0.02), (bx - nx * hw, by - ny * hw)]
    d.polygon(tri, fill=K, outline=ol)
def feather(d, cx, cy, ang, L, W, col=K, ol=WH):   # 깃털 하나 (가는 잎 모양 · 가운데 깃대)
    pts = []
    for i in range(20):
        t = i / 19 * 2 * math.pi; x, y = L / 2 * (1 + math.cos(t)), W / 2 * math.sin(t) * (0.6 + 0.4 * math.cos(t / 2))
        pts.append((cx + x * math.cos(ang) - y * math.sin(ang), cy + x * math.sin(ang) + y * math.cos(ang)))
    d.polygon(pts, fill=col, outline=ol)
    d.line([(cx, cy), (cx + L * math.cos(ang), cy + L * math.sin(ang))], fill=ol, width=2)
def wing(d, rx, ry, side, sc=1.0, col=K, ol=WH, torn=False):   # 큰 새 날개 (어깨 rx, ry 에서 side 쪽 · 굵은 실루엣 · 아래 가장자리는 깃 끝 다섯 — 찢긴 날개는 깃 끝이 들쭉날쭉)
    s0 = 0.42 * sc; X = lambda v: S * (rx + side * v); Y = lambda v: S * (ry + v)
    pts = [(X(0), Y(0.02)), (X(s0 * 0.35), Y(-s0 * 0.55)), (X(s0 * 0.8), Y(-s0 * 0.62)), (X(s0 * 1.02), Y(-s0 * 0.3))]
    for k in range(5):
        f = 1 - k * 0.2; dip = (0.22 if torn and k in (1, 3) else 0.0)
        pts.append((X(s0 * (0.98 - k * 0.2)), Y(s0 * (0.08 + k * 0.12 + dip))))   # 깃 끝
        pts.append((X(s0 * (0.88 - k * 0.2)), Y(s0 * (-0.02 + k * 0.1))))   # 깃 사이 홈
    pts.append((X(s0 * 0.08), Y(s0 * 0.22)))
    d.polygon(pts, fill=col, outline=ol); d.line(pts + [pts[0]], fill=ol, width=3)
out = {}
# 80 ◆타천 날개: 찢긴 검은 날개 한 쌍 · 아래로 떨어지는 깃털 둘
a = burst(S * 0.5, S * 0.42, PEA, 80, glow=(255, 246, 220), bg=(22, 14, 12)); d = ImageDraw.Draw(a)
wing(d, 0.47, 0.42, -1, 0.95, torn=True); wing(d, 0.53, 0.42, 1, 0.95, torn=True)
blob(d, [S * 0.44, S * 0.36, S * 0.56, S * 0.5])
feather(d, S * 0.3, S * 0.78, 1.2, S * 0.14, S * 0.05); feather(d, S * 0.66, S * 0.84, 1.9, S * 0.12, S * 0.045)
out[80] = a
# 81 ◆끝까지: 땅에 박은 창 · 무릎 꿇고 붙잡은 몸 · 금이 간 바닥
b = burst(S * 0.5, S * 0.5, GAK, 81, glow=(255, 225, 215), bg=(18, 6, 10)); d = ImageDraw.Draw(b)
spear(d, 0.62, 0.1, 0.62, 0.86, 9, 0.12)
blob(d, [S * 0.3, S * 0.3, S * 0.44, S * 0.44]); edge(d, [P(0.38, 0.44), P(0.42, 0.62), P(0.36, 0.8)], 16); edge(d, [P(0.4, 0.5), P(0.6, 0.5)], 9)
d.line([P(0.2, 0.86), P(0.84, 0.86)], fill=K, width=6); d.line([P(0.5, 0.86), P(0.46, 0.94), P(0.54, 0.98)], fill=K, width=4)
out[81] = b
# 82 철 깃털: 왼쪽 아래에서 오른쪽 위로 부채꼴로 날아가는 강철 깃털 다섯
c = burst(S * 0.25, S * 0.7, PEA, 82, glow=(255, 248, 230), bg=(22, 14, 12)); d = ImageDraw.Draw(c)
for k in range(5):
    ang = -1.0 + k * 0.24; L = S * 0.4
    feather(d, S * 0.14 + math.cos(ang) * S * 0.12, S * 0.82 + math.sin(ang) * S * 0.12, ang, L, S * 0.15, K, (228, 236, 248))
out[82] = c
# 83 꼬깃꼬깃 착지: 구겨진 날개로 내려앉는 몸 · 바닥의 물결 원 둘
e = burst(S * 0.5, S * 0.55, PEA, 83, glow=(255, 248, 230), bg=(22, 14, 12)); d = ImageDraw.Draw(e)
for rr, w in ((S * 0.42, 7), (S * 0.3, 5)): d.ellipse([S * 0.5 - rr, S * 0.84 - rr * 0.28, S * 0.5 + rr, S * 0.84 + rr * 0.28], outline=K, width=w)
wing(d, 0.46, 0.36, -1, 0.7, torn=True); wing(d, 0.54, 0.36, 1, 0.7, torn=True)
blob(d, [S * 0.42, S * 0.18, S * 0.58, S * 0.34]); edge(d, [P(0.5, 0.34), P(0.5, 0.6)], 18); edge(d, [P(0.5, 0.6), P(0.4, 0.78)], 10); edge(d, [P(0.5, 0.6), P(0.6, 0.78)], 10)
for x in (0.24, 0.76): d.line([P(x, 0.1), P(x, 0.26)], fill=K, width=5)
out[83] = e
# 84 돌려차기: 몸을 돌려 옆으로 뻗은 다리 · 휘도는 줄 둘
f = burst(S * 0.55, S * 0.5, PEA, 84, glow=(255, 248, 230), bg=(22, 14, 12)); d = ImageDraw.Draw(f)
blob(d, [S * 0.2, S * 0.14, S * 0.34, S * 0.28]); edge(d, [P(0.28, 0.28), P(0.34, 0.52)], 18); edge(d, [P(0.34, 0.52), P(0.26, 0.86)], 11); edge(d, [P(0.34, 0.5), P(0.62, 0.42), P(0.86, 0.38)], 12)
for rr, w in ((0.5, 5), (0.38, 4)): d.arc([S * (0.36 - rr), S * (0.46 - rr), S * (0.36 + rr), S * (0.46 + rr)], 300, 30, fill=K, width=w)
out[84] = f
# 85 움츠리기: 몸을 감싼 두 날개 (안쪽으로 굽은 깃 · 가운데 머리만)
g = burst(S * 0.5, S * 0.5, PEA, 85, glow=(255, 248, 230), bg=(22, 14, 12)); d = ImageDraw.Draw(g)
blob(d, [S * 0.42, S * 0.12, S * 0.58, S * 0.28])
for side in (-1, 1):
    pts = [(S * (0.5 + side * 0.06), S * 0.3), (S * (0.5 + side * 0.34), S * 0.26), (S * (0.5 + side * 0.4), S * 0.5), (S * (0.5 + side * 0.32), S * 0.78)]
    for k in range(4): pts += [(S * (0.5 + side * (0.24 - k * 0.07)), S * (0.9 - k * 0.02)), (S * (0.5 + side * (0.21 - k * 0.07)), S * (0.82 - k * 0.01))]
    pts.append((S * (0.5 + side * 0.01), S * 0.88))
    d.polygon(pts, fill=K, outline=WH); d.line(pts + [pts[0]], fill=WH, width=3)
d.line([P(0.5, 0.3), P(0.5, 0.88)], fill=WH, width=3)
out[85] = g
# 86 정면 투창: 오른쪽으로 곧게 날아가는 창 · 뒤의 속도선
h = burst(S * 0.2, S * 0.5, GAK, 86, glow=(255, 225, 215), bg=(18, 6, 10)); d = ImageDraw.Draw(h)
spear(d, 0.1, 0.5, 0.92, 0.5, 9, 0.16)
for (y, x0, x1) in ((0.36, 0.06, 0.4), (0.64, 0.1, 0.44), (0.28, 0.2, 0.36), (0.72, 0.22, 0.34)): d.line([P(x0, y), P(x1, y)], fill=K, width=5)
out[86] = h
# 87 각펄: 깨진 검은 고리 (머리 위) · 그늘진 얼굴 · 붉은 두 눈
i2 = burst(S * 0.5, S * 0.55, GAK, 87, glow=(255, 215, 205), bg=(18, 6, 10)); d = ImageDraw.Draw(i2)
d.arc([S * 0.26, S * 0.06, S * 0.74, S * 0.26], 200, 330, fill=K, width=9); d.arc([S * 0.26, S * 0.06, S * 0.74, S * 0.26], 350, 520, fill=K, width=9)
blob(d, [S * 0.28, S * 0.24, S * 0.72, S * 0.7]); d.polygon([P(0.28, 0.5), P(0.18, 0.92), P(0.82, 0.92), P(0.72, 0.5)], fill=K)
for x in (0.4, 0.6): d.polygon([P(x - 0.06, 0.46), P(x + 0.06, 0.44), P(x + 0.04, 0.5), P(x - 0.05, 0.5)], fill=RED)
out[87] = i2
# 88 솟는 거대 창: 갈라진 바닥에서 위로 솟는 큰 창 · 튀는 돌
j = burst(S * 0.5, S * 0.75, GAK, 88, glow=(255, 225, 215), bg=(18, 6, 10)); d = ImageDraw.Draw(j)
spear(d, 0.5, 0.86, 0.5, 0.06, 16, 0.22)
d.line([P(0.1, 0.86), P(0.9, 0.86)], fill=K, width=7)
for (x0, x1, y1) in ((0.36, 0.26, 0.97), (0.64, 0.76, 0.96)): d.line([P(x0, 0.86), P(x1, y1)], fill=K, width=5)
for (x, y) in ((0.24, 0.66), (0.78, 0.6), (0.3, 0.5)): d.rectangle([S * x - 6, S * y - 6, S * x + 6, S * y + 6], fill=K)
out[88] = j
# 89 공중 투창 (창비): 위에서 비스듬히 떨어지는 창 넷 · 바닥의 원 둘
k2 = burst(S * 0.5, S * 0.3, GAK, 89, glow=(255, 225, 215), bg=(18, 6, 10)); d = ImageDraw.Draw(k2)
for (x0, y0, x1, y1) in ((0.18, 0.04, 0.3, 0.62), (0.42, 0.0, 0.52, 0.5), (0.66, 0.06, 0.74, 0.66), (0.86, 0.16, 0.9, 0.52)): spear(d, x0, y0, x1, y1, 6, 0.1)
for (x, y) in ((0.3, 0.8), (0.7, 0.86)): d.ellipse([S * (x - 0.13), S * (y - 0.04), S * (x + 0.13), S * (y + 0.04)], outline=K, width=5)
out[89] = k2
# 90 반경 10m 횡베기: 몸 둘레를 크게 도는 창 · 큰 원 · 회전 화살
l2 = burst(S * 0.5, S * 0.5, GAK, 90, glow=(255, 225, 215), bg=(18, 6, 10)); d = ImageDraw.Draw(l2)
d.ellipse([S * 0.06, S * 0.06, S * 0.94, S * 0.94], outline=K, width=6)
d.arc([S * 0.16, S * 0.16, S * 0.84, S * 0.84], 200, 520, fill=K, width=8)
spear(d, 0.5, 0.5, 0.9, 0.24, 8, 0.12); blob(d, [S * 0.42, S * 0.42, S * 0.58, S * 0.58])
d.polygon([P(0.22, 0.22), P(0.32, 0.14), P(0.32, 0.3)], fill=K)
out[90] = l2
# 91 정면 처형: 몸째 창처럼 날아드는 실루엣 (앞으로 내민 창) · 뒤로 뺀 자취
m2 = burst(S * 0.3, S * 0.5, GAK, 91, glow=(255, 225, 215), bg=(18, 6, 10)); d = ImageDraw.Draw(m2)
edge(d, [P(0.2, 0.52), P(0.52, 0.5)], 22); blob(d, [S * 0.5, S * 0.42, S * 0.64, S * 0.56]); spear(d, 0.4, 0.5, 0.96, 0.5, 8, 0.14)
for (y, x0, x1) in ((0.34, 0.04, 0.26), (0.66, 0.04, 0.3), (0.5, 0.02, 0.14)): d.line([P(x0, y), P(x1, y)], fill=K, width=5)
d.line([P(0.08, 0.8), P(0.3, 0.8)], fill=K, width=4); d.polygon([P(0.04, 0.8), P(0.1, 0.75), P(0.1, 0.85)], fill=K)
out[91] = m2
# 92 창 대포: 매우 긴 찌르기 · 끝에 바람 고리 셋
n2 = burst(S * 0.15, S * 0.5, GAK, 92, glow=(255, 225, 215), bg=(18, 6, 10)); d = ImageDraw.Draw(n2)
blob(d, [S * 0.04, S * 0.4, S * 0.18, S * 0.6]); spear(d, 0.14, 0.5, 0.97, 0.5, 11, 0.16)
for k, x in enumerate((0.5, 0.64, 0.78)): rr = 0.1 + k * 0.03; d.ellipse([S * (x - 0.025), S * (0.5 - rr), S * (x + 0.025), S * (0.5 + rr)], outline=K, width=4)
out[92] = n2
# 93 날아 투창: 위의 날개 · 아래로 던지는 창 · 깨진 방벽 (막을 수 없음)
o2 = burst(S * 0.5, S * 0.3, GAK, 93, glow=(255, 225, 215), bg=(18, 6, 10)); d = ImageDraw.Draw(o2)
wing(d, 0.4, 0.2, -1, 0.55, col=K); wing(d, 0.48, 0.2, 1, 0.55, col=K); blob(d, [S * 0.38, S * 0.12, S * 0.5, S * 0.26])
spear(d, 0.46, 0.26, 0.7, 0.9, 8, 0.12)
d.line([P(0.5, 0.66), P(0.92, 0.66)], fill=K, width=9); d.line([P(0.62, 0.6), P(0.66, 0.72), P(0.6, 0.78)], fill=WH, width=4)
out[93] = o2
# 94 초대형 치명타: 하늘에서 꽂히는 거대한 창 · 바닥의 큰 원
p2 = burst(S * 0.5, S * 0.8, GAK, 94, glow=(255, 225, 215), bg=(18, 6, 10)); d = ImageDraw.Draw(p2)
d.ellipse([S * 0.08, S * 0.72, S * 0.92, S * 0.96], outline=K, width=7)
spear(d, 0.5, 0.0, 0.5, 0.84, 22, 0.3)
for x in (0.22, 0.78): d.line([P(x, 0.1), P(x, 0.34)], fill=K, width=5)
out[94] = p2
# 95 처형 내리꽂기: 위로 날아오른 몸 · 아래로 곧게 꽂히는 창 (꼬치) · 바닥 원
q2 = burst(S * 0.5, S * 0.5, GAK, 95, glow=(255, 225, 215), bg=(18, 6, 10)); d = ImageDraw.Draw(q2)
wing(d, 0.46, 0.16, -1, 0.5, col=K); wing(d, 0.54, 0.16, 1, 0.5, col=K); blob(d, [S * 0.43, S * 0.06, S * 0.57, S * 0.2])
spear(d, 0.5, 0.2, 0.5, 0.86, 10, 0.16)
d.ellipse([S * 0.24, S * 0.82, S * 0.76, S * 0.96], outline=K, width=6)
for (x0, y0, x1, y1) in ((0.3, 0.5, 0.3, 0.7), (0.7, 0.46, 0.7, 0.66)): d.line([P(x0, y0), P(x1, y1)], fill=K, width=5)
out[95] = q2
assert sorted(out) == list(range(80, 96)), sorted(out)
old = Image.open(D + 'ico878/icons_v878d.webp').convert('RGB')
assert old.size == (384, 480), old.size
im = Image.new('RGB', (384, 576), (20, 18, 15)); im.paste(old, (0, 0))
for idx, t in out.items(): im.paste(t.resize((48, 48), Image.LANCZOS), ((idx % 8) * 48, (idx // 8) * 48))
im.save(D + 'ico879/icons_v879.webp', 'WEBP', quality=92, method=6)
z = Image.new('RGB', (200 * 8, 192 * 2), (40, 40, 40))
for k, (idx, t) in enumerate(sorted(out.items())): z.paste(t, (200 * (k % 8), 192 * (k // 8)))
z.save(D + 'ico879/zoom_e.png'); print('mkico_e OK', im.size, len(out))
