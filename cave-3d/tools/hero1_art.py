# hero1_art.py v1.0 — 1성 영웅 셋 (소천사녀 · 금기사 · 갱스터) 임시 그림
# 민수가 보낸 폰 화면 캡처 (art/h1/src/*_shot.jpg)에서 한 사람씩 잘라 흰 바탕을 지움 → art/h1/<키>.webp (서 있는 그림 하나)
#  · 흰 바탕: 가장자리에서 이어진 밝은 칸만 지움 (흰 옷은 윤곽선이 막아 남음)
#  · 옆 사람이 걸친 부분은 cut (비율 사각형)으로, 다리 사이처럼 막힌 바탕은 SEEDS 자리에서 지움
#  · 진짜 그림이 드라이브에 오면 이걸 바꿔 끼우면 됨
import os
from PIL import Image, ImageDraw
from collections import deque
HERE = os.path.dirname(os.path.abspath(__file__)); ART = os.path.join(os.path.dirname(HERE), 'art', 'h1')
# 다리 사이처럼 바깥과 막힌 흰 바탕: 씨앗 자리 (완성 그림에 대한 비율)에서 지움
SEEDS = {
    'angel': [(0.55, 0.88), (0.6, 0.8), (0.93, 0.85), (0.9, 0.7)],
    'goldknight': [(0.57, 0.8), (0.6, 0.9), (0.85, 0.88), (0.8, 0.95), (0.8, 0.7), (0.78, 0.62)],
    'gangster': [(0.6, 0.8), (0.58, 0.9), (0.06, 0.85), (0.47, 0.8), (0.45, 0.9), (0.5, 0.7)],
}
def seedfill(im, seeds, th=215):
    W, H = im.size; px = im.load()
    for fx, fy in seeds:
        q = deque([(int(fx * W), int(fy * H))]); seen = set()
        while q:
            x, y = q.popleft()
            if x < 0 or y < 0 or x >= W or y >= H or (x, y) in seen: continue
            seen.add((x, y)); r, g, b, a = px[x, y]
            if a and min(r, g, b) < th: continue
            px[x, y] = (255, 255, 255, 0); q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    return im
JOBS = {
    'angel':      ('angel_shot.jpg',      (12, 620, 640, 1890), [(0.915, 0, 1, 0.5)]),            # 오른쪽: 옆 천사의 분홍 머리
    'goldknight': ('goldknight_shot.jpg', (345, 380, 1066, 1935), [(0, 0, 0.05, 1)]),             # 왼쪽: 갱스터 팔 · 발
    'gangster':   ('gangster_shot.jpg',   (232, 450, 895, 1875), [(0, 0.74, 0.1, 1), (0.91, 0.45, 1, 0.97)]),   # 왼아래: 천사 부츠 · 오른쪽: 금기사 갑옷
}
def debg(im, th=218):
    im = im.convert('RGBA'); W, H = im.size; px = im.load(); seen = bytearray(W * H); q = deque()
    for x in range(W): q.append((x, 0)); q.append((x, H - 1))
    for y in range(H): q.append((0, y)); q.append((W - 1, y))
    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= W or y >= H or seen[y * W + x]: continue
        seen[y * W + x] = 1; r, g, b, a = px[x, y]
        if min(r, g, b) < th: continue
        px[x, y] = (255, 255, 255, 0)
        q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    # 가장자리 반투명 (흰 테두리 줄이기)
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            if a and min(r, g, b) > 225 and any(0 <= x + dx < W and 0 <= y + dy < H and px[x + dx, y + dy][3] == 0 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): px[x, y] = (r, g, b, 90)
    return im
if __name__ == '__main__':
    for k, (f, box, cuts) in JOBS.items():
        im = Image.open(os.path.join(ART, 'src', f)).crop(box)
        im = debg(im)
        if cuts:   # 잘라 낸 크기에 대한 비율 (x0, y0, x1, y1)
            m = Image.new('L', im.size, 255); d = ImageDraw.Draw(m); W, H = im.size
            for x0, y0, x1, y1 in cuts: d.rectangle((x0 * W, y0 * H, x1 * W, y1 * H), fill=0)
            a = im.getchannel('A'); a = Image.composite(a, Image.new('L', im.size, 0), m); im.putalpha(a)
        bb = im.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox(); im = im.crop(bb)
        h = 700; im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
        im = seedfill(im, SEEDS.get(k, []))
        im.save(os.path.join(ART, k + '.webp'), 'WEBP', quality=88, method=6)
        prev = Image.new('RGBA', im.size, (60, 70, 90, 255)); prev.alpha_composite(im); prev.convert('RGB').save(os.path.join(ART, 'src', k + '_prev.jpg'))
        print(k, im.size)
