# abyss/make.py v1.0 — 암계 적 4 · 장비 6 그림 다듬기: 원화 (흰 바탕 그대로 webp) · 투명 바탕 (흰 바탕 지움) · 얼굴 자름 · 장비 낱장 (시트에서 자름 · 이웃 조각 지움)
import numpy as np, collections, os
from PIL import Image, ImageFilter
os.makedirs('out', exist_ok=True)
def cut(im, thr=238, glob=False, erode=True):
    a = np.asarray(im.convert('RGB')).astype(int); H, W, _ = a.shape; white = a.min(axis=2) >= thr
    if glob: seen = white.copy()
    else:
        seen = np.zeros((H, W), bool); q = collections.deque()
        for x in range(W):
            for y in (0, H - 1):
                if white[y, x] and not seen[y, x]: seen[y, x] = 1; q.append((y, x))
        for y in range(H):
            for x in (0, W - 1):
                if white[y, x] and not seen[y, x]: seen[y, x] = 1; q.append((y, x))
        while q:
            y, x = q.popleft()
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                yy, xx = y + dy, x + dx
                if 0 <= yy < H and 0 <= xx < W and white[yy, xx] and not seen[yy, xx]: seen[yy, xx] = 1; q.append((yy, xx))
    alpha = Image.fromarray(np.where(seen, 0, 255).astype(np.uint8)); alpha = (alpha.filter(ImageFilter.MinFilter(3)) if erode else alpha).filter(ImageFilter.GaussianBlur(0.8))
    o = im.convert('RGBA'); o.putalpha(alpha); return o
def keep_main(o, frac=0.25):
    a = np.asarray(o.split()[3]) > 40; H, W = a.shape; lab = np.zeros((H, W), np.int32); n = 0; sizes = {}
    for y in range(0, H):
        for x in range(0, W):
            if a[y, x] and not lab[y, x]:
                n += 1; q = collections.deque([(y, x)]); lab[y, x] = n; c = 0
                while q:
                    p, r = q.popleft(); c += 1
                    for dp, dr in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
                        pp, rr = p + dp, r + dr
                        if 0 <= pp < H and 0 <= rr < W and a[pp, rr] and not lab[pp, rr]: lab[pp, rr] = n; q.append((pp, rr))
                sizes[n] = c
    big = max(sizes.values()); keep = {k for k, v in sizes.items() if v >= big * frac}
    m = np.isin(lab, list(keep)); al = np.asarray(o.split()[3]).copy(); al[~m] = 0; o.putalpha(Image.fromarray(al))
    bb = o.getbbox(); return o.crop(bb) if bb else o
CH = {'shield': (330, 10, 630, 310), 'spear': (330, 150, 630, 450), 'archer': (230, 90, 530, 390), 'sword': (330, 60, 630, 360)}
for k, b in CH.items():
    im = Image.open('raw/%s.png' % k); im.save('out/%s_art.webp' % k, 'WEBP', quality=92, method=6)
    t = cut(im); t.save('out/%s_cut.webp' % k, 'WEBP', quality=92, method=6, exact=True)
    t.crop(b).resize((256, 256), Image.LANCZOS).save('out/%s_face.webp' % k, 'WEBP', quality=92, method=6, exact=True)
EQ = {'bow': ((150, 0, 436, 600), True), 'tower': ((600, 0, 932, 608), False), 'kite': ((1118, 10, 1356, 542), False), 'sword': ((56, 520, 466, 1014), False), 'helm': ((616, 536, 918, 1002), False), 'chest': ((1034, 564, 1442, 1008), False)}
sh = Image.open('raw/equip_sheet.png'); sh.save('out/equip_sheet.webp', 'WEBP', quality=92, method=6)
for k, (b, g) in EQ.items():
    bb = (max(0, b[0] - 8), max(0, b[1] - 8), min(1536, b[2] + 8), min(1024, b[3] + 8)); o = keep_main(cut(sh.crop(bb), 244 if g else 238, glob=g, erode=not g), 0.12 if g else 0.25)
    o.save('out/eq_%s.webp' % k, 'WEBP', lossless=True, method=6); print(k, o.size)
print('ok')
