# hero2_cut.py v1.0 — 2기 멤버 (드라이브 '2기멤버 동료,적 모음') 스프라이트 자르기 도구
#  세 가지 명령:
#   grid  RAW OUT.jpg            — 좌표 격자 (100px마다 선 · 숫자)를 그린 축소 미리보기. 상자 좌표 고를 때
#   seg   RAW [--min 0.02]       — 바탕을 지운 뒤 큰 덩어리 (인물 · 무기)의 상자를 찾아 출력 (x0 y0 x1 y1 넓이비)
#   cut   RAW x0 y0 x1 y1 OUT.webp [--scale S] [--th 218] [--flip] [--keep] [--seeds fx,fy;fx,fy]
#         상자를 잘라 바탕을 지우고 (가장자리에서 이어진 밝은 · 고른 바탕), 남은 그림만 다듬어 저장
#         --scale: 같은 인물은 같은 배율 (서 있는 키 → 700px 기준으로 한 번 정해 모든 동작에 같이 씀)
#         --flip: 왼쪽을 보는 그림을 오른쪽 보기로 (게임 규칙: 모든 그림은 오른쪽을 봄 — f: 1)
#         --keep: 바탕 지우기 없이 (이미 투명한 그림)
#         출력: OUT.webp + OUT_prev.jpg (어두운 바탕 미리보기) + 한 줄 JSON {w,h,ax,ay} (ax · ay = 발 가운데)
#  바탕 판정: 네 모서리 색의 중앙값을 바탕색으로 보고, 그 색과 가까운 (거리 < th 기준) 칸을 가장자리에서부터 지움
import sys, json, os
from PIL import Image, ImageDraw, ImageFont
from collections import deque

def load(p):
    im = Image.open(p)
    return im.convert('RGBA')

def bg_color(im):
    W, H = im.size; px = im.load(); s = []
    for x, y in [(2, 2), (W - 3, 2), (2, H - 3), (W - 3, H - 3), (W // 2, 2), (W // 2, H - 3), (2, H // 2), (W - 3, H // 2)]:
        s.append(px[x, y])
    if sum(1 for c in s if c[3] < 20) >= 4: return None   # 이미 투명
    s.sort(key=lambda c: sum(c[:3])); return s[len(s) // 2]

def debg(im, tol=38):
    im = im.copy(); W, H = im.size; px = im.load(); bg = bg_color(im)
    if bg is None: return im
    br, bgc, bb = bg[:3]
    def near(c): return c[3] > 0 and abs(c[0] - br) + abs(c[1] - bgc) + abs(c[2] - bb) < tol * 3
    seen = bytearray(W * H); q = deque()
    for x in range(W): q.append((x, 0)); q.append((x, H - 1))
    for y in range(H): q.append((0, y)); q.append((W - 1, y))
    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= W or y >= H or seen[y * W + x]: continue
        seen[y * W + x] = 1; c = px[x, y]
        if c[3] > 20 and not near(c): continue
        px[x, y] = (c[0], c[1], c[2], 0)
        q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    # 테두리 반투명 (바탕색 번짐 줄이기)
    for y in range(1, H - 1):
        for x in range(1, W - 1):
            c = px[x, y]
            if c[3] and abs(c[0] - br) + abs(c[1] - bgc) + abs(c[2] - bb) < tol * 4.5 and any(px[x + dx, y + dy][3] == 0 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                px[x, y] = (c[0], c[1], c[2], 110)
    return im

def seedfill(im, seeds, tol=38):
    W, H = im.size; px = im.load(); bg = bg_color(Image.open(sys.argv[2]).convert('RGBA')) if False else None
    for fx, fy in seeds:
        sx, sy = int(fx * W), int(fy * H); ref = px[sx, sy]
        q = deque([(sx, sy)]); seen = set()
        while q:
            x, y = q.popleft()
            if x < 0 or y < 0 or x >= W or y >= H or (x, y) in seen: continue
            seen.add((x, y)); c = px[x, y]
            if c[3] and abs(c[0] - ref[0]) + abs(c[1] - ref[1]) + abs(c[2] - ref[2]) > tol * 3: continue
            px[x, y] = (c[0], c[1], c[2], 0); q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    return im

def cmd_grid(raw, out):
    im = load(raw).convert('RGB'); W, H = im.size; k = min(1.0, 1400 / max(W, H)); d = ImageDraw.Draw(im)
    for x in range(0, W, 100): d.line([(x, 0), (x, H)], fill=(255, 0, 0) if x % 500 == 0 else (255, 150, 150), width=2 if x % 500 == 0 else 1); d.text((x + 3, 3), str(x), fill=(200, 0, 0))
    for y in range(0, H, 100): d.line([(0, y), (W, y)], fill=(0, 0, 255) if y % 500 == 0 else (150, 150, 255), width=2 if y % 500 == 0 else 1); d.text((3, y + 3), str(y), fill=(0, 0, 200))
    im = im.resize((int(W * k), int(H * k)), Image.LANCZOS); im.save(out, quality=85)
    print(json.dumps({'w': W, 'h': H, 'preview_scale': round(k, 4)}))

def cmd_seg(raw, minr=0.02):
    im = debg(load(raw)); W, H = im.size
    k = 4; sw, sh = W // k, H // k; small = im.resize((sw, sh), Image.NEAREST); a = small.getchannel('A').load()
    seen = bytearray(sw * sh); out = []
    for y0 in range(sh):
        for x0 in range(sw):
            if seen[y0 * sw + x0] or a[x0, y0] < 40: continue
            q = deque([(x0, y0)]); n = 0; bx0, by0, bx1, by1 = x0, y0, x0, y0
            while q:
                x, y = q.popleft()
                if x < 0 or y < 0 or x >= sw or y >= sh or seen[y * sw + x] or a[x, y] < 40: continue
                seen[y * sw + x] = 1; n += 1; bx0, by0, bx1, by1 = min(bx0, x), min(by0, y), max(bx1, x), max(by1, y)
                q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1), (x + 1, y + 1), (x - 1, y - 1), (x + 1, y - 1), (x - 1, y + 1)))
            if n / (sw * sh) >= minr * 0.15: out.append((bx0 * k, by0 * k, (bx1 + 1) * k, (by1 + 1) * k, round(n / (sw * sh), 4)))
    out.sort(key=lambda b: -b[4])
    print(json.dumps({'w': W, 'h': H, 'bg': bg_color(load(raw)), 'blobs': out[:12]}))

def cmd_cut(raw, box, out, scale=None, tol=38, flip=False, keep=False, seeds=None):
    im = load(raw).crop(tuple(box))
    if not keep: im = debg(im, tol)
    bbx = im.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox()
    if not bbx: print(json.dumps({'error': 'empty'})); return
    im = im.crop(bbx)
    if scale: im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    if seeds: im = seedfill(im, seeds, tol)
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    im.save(out, 'WEBP', quality=88, method=6)
    prev = Image.new('RGBA', im.size, (60, 70, 90, 255)); prev.alpha_composite(im); prev.convert('RGB').save(out.replace('.webp', '_prev.jpg'), quality=82)
    # 발 가운데: 맨 아래 8% 줄에서 불투명 칸의 가운데
    A = im.getchannel('A'); W, H = im.size; px = A.load(); ys = range(int(H * 0.92), H); xs = [x for y in ys for x in range(W) if px[x, y] > 60]
    ax = round(sum(xs) / len(xs)) if xs else W // 2
    print(json.dumps({'out': out, 'w': W, 'h': H, 'ax': ax, 'ay': H - 3}))

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__ or open(__file__).read()[:1200]); sys.exit()
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    if a[0] == 'grid': cmd_grid(a[1], a[2])
    elif a[0] == 'seg': cmd_seg(a[1], float(opt('--min', 0.02)))
    elif a[0] == 'cut':
        seeds = [tuple(map(float, s.split(','))) for s in opt('--seeds', '').split(';') if s] or None
        cmd_cut(a[1], list(map(int, a[2:6])), a[6], float(opt('--scale')) if opt('--scale') else None, int(opt('--th', 38)), '--flip' in a, '--keep' in a, seeds)
