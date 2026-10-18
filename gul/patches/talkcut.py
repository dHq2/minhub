# 대화 스프라이트 흰 배경 지우기 — talkcut.py v1.4 (v1.4: 배경색은 네 귀퉁이에서 (흰색이 아니어도 — 레베카 회색) · v1.3: isl=False 로 갇힌 섬 지우기를 끌 수 있음 (오딜 5 — 장갑이 가면을 둘러쌈) · v1.2: 어두운 머리 · 옷에 갇힌 흰 섬도 지움 (둘레가 어두우면 배경 · 밝으면 (가면 등) 남김) · v1.1: 마스크를 복사해 채우기 · 테두리에서 이어진 흰 배경만 · 안쪽 흰색 (가면 · 하이라이트) 은 그대로 · 가장자리 부드럽게 · 흰 테 빼기)
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
def cut(src, dst, near=26, soft=(8, 46), maxh=1400, isl=True):
    im = Image.open(src).convert('RGB')
    if im.height > maxh: im = im.resize((round(im.width * maxh / im.height), maxh), Image.LANCZOS)
    a = np.asarray(im).astype(np.int16); H0, W0 = a.shape[:2]; bgc = np.median(np.array([a[0, 0], a[0, W0 - 1], a[H0 - 1, 0], a[0, W0 // 2], a[H0 // 2, 0]]), axis=0); d = np.abs(a - bgc).max(axis=2)   # 귀퉁이 색과의 거리
    m = Image.fromarray(np.where(d < near, 255, 0).astype(np.uint8), 'L').copy(); w, h = m.size; px = m.load()   # copy: fromarray 는 읽기 전용이라 채우기가 안 먹음
    for x in range(w):
        for y in (0, h - 1):
            if px[x, y] == 255: ImageDraw.floodfill(m, (x, y), 128, thresh=0)
    for y in range(h):
        for x in (0, w - 1):
            if px[x, y] == 255: ImageDraw.floodfill(m, (x, y), 128, thresh=0)
    bg = (np.asarray(m) == 128)
    # 갇힌 흰 섬: 둘레 (3px) 의 밝기 중앙값이 어두우면 배경 (검은 머리 · 옷 사이) — 밝으면 (금발 · 가면) 남김
    lum = (0.3 * a[..., 0] + 0.59 * a[..., 1] + 0.11 * a[..., 2])
    for y in range(0, h if isl else 0, 2):
        for x in range(0, w, 2):
            if px[x, y] != 255: continue
            ImageDraw.floodfill(m, (x, y), 100, thresh=0); n = np.asarray(m) == 100; c = int(n.sum())
            ring = (np.asarray(Image.fromarray((n * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))) > 0) & ~n
            dark = c > 300 and np.median(lum[ring]) < 110
            mm = np.asarray(m).copy(); mm[n] = 129 if dark else 60; m = Image.fromarray(mm).copy(); px = m.load()
    bg = bg | (np.asarray(m) == 129)
    band = np.asarray(Image.fromarray((bg * 255).astype(np.uint8), 'L').filter(ImageFilter.MaxFilter(5))) > 0
    al = np.full(d.shape, 255.0)
    edge = band & ~bg
    al[edge] = np.clip((d[edge] - soft[0]) / (soft[1] - soft[0]), 0, 1) * 255
    al[bg] = 0
    f = al / 255.0; rgb = a.astype(np.float64)
    with np.errstate(divide='ignore', invalid='ignore'):
        un = np.where(f[..., None] > 0.02, (rgb - (1 - f[..., None]) * bgc) / f[..., None], rgb)
    rgb = np.where(edge[..., None], np.clip(un, 0, 255), rgb)
    out = Image.fromarray(np.dstack([rgb, al]).astype(np.uint8), 'RGBA')
    bb = out.getchannel('A').getbbox(); out = out.crop((max(0, bb[0] - 4), max(0, bb[1] - 4), min(w, bb[2] + 4), h)) if bb else out   # 아래는 자르지 않음 (띠 뒤로 들어감)
    out.save(dst, 'WEBP', quality=86, method=6)
    return out.size, os.path.getsize(dst) // 1024, float(bg.mean())
if __name__ == '__main__':
    for s, t in zip(sys.argv[1::2], sys.argv[2::2]): print(t, cut(s, t))
