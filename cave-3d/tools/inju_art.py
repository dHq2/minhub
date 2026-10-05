# inju_art.py v1.1 — (v1.1: 둘째 묶음 — 숙여 회피 · 소총 · 권총 · 그라운드 가드 · 막기, 두 칸이 붙은 캡처는 나눔)
# v1.0 — 인주 레슬링 동작 그림 (민수가 준 도감 캡처) → art/inju/*.webp
# 바탕 (베이지)을 가장자리부터 지우고, 칸 UI (체크 상자 · 휴지통 · 동그라미)를 지우고, 2배로 키워 다듬음
# crouch: 위에 겹친 움찔 그림은 잘라 내고 아래 웅크린 그림만 씀
# 실행: python3 tools/inju_art.py  (cave-3d 폴더에서)
import os
from collections import deque
from PIL import Image, ImageFilter
import numpy as np
D = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'art', 'inju')
# 이름 → (원본, 자를 칸 (x0, y0, x1, y1) 또는 None)
SRC = {'crouch': ('src_crouch.png', None), 'dash': ('src_dash.png', None), 'throw': ('src_throw.png', None), 'guard': ('src_guard.png', None), 'pound': ('src_pound.png', None),
       'rifle': ('src_209.png', (0, 0, 186, 247)), 'pistol': ('src_209.png', (209, 0, 394, 247)), 'duck': ('src_210.png', None), 'groundGuard': ('src_211.png', None), 'block': ('src_212.png', None)}
NAMES = list(SRC)
UP = 2
TH = 15   # 바탕과 이만큼 가까운 색만 바탕 (피부 · 흰 셔츠가 바탕색과 비슷해서 낮게)

def clear_bg(a):
    h, w = a.shape[:2]
    bg = np.median(np.concatenate([a[2:6, 40:w - 60, :3].reshape(-1, 3), a[h - 6:h - 2, :, :3].reshape(-1, 3)]), axis=0)
    diff = np.abs(a[:, :, :3].astype(int) - bg).sum(2)
    near = diff < TH
    seen = np.zeros((h, w), bool); q = deque()
    for x in range(w):
        for y in (0, h - 1): q.append((y, x))
    for y in range(h):
        for x in (0, w - 1): q.append((y, x))
    while q:
        y, x = q.popleft()
        if y < 0 or x < 0 or y >= h or x >= w or seen[y, x] or not near[y, x]: continue
        seen[y, x] = True
        q.extend(((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)))
    # 안쪽에 갇힌 바탕 (다리 사이 · 겨드랑이 · 별 워터마크): 바탕색 덩어리가 크면 지움
    hole = (diff < 22) & ~seen
    lab = np.zeros((h, w), int); k = 0
    for y0 in range(h):
        for x0 in range(w):
            if hole[y0, x0] and not lab[y0, x0]:
                k += 1; q2 = deque([(y0, x0)]); lab[y0, x0] = k; pts = []
                while q2:
                    y, x = q2.popleft(); pts.append((y, x))
                    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                        if 0 <= ny < h and 0 <= nx < w and hole[ny, nx] and not lab[ny, nx]: lab[ny, nx] = k; q2.append((ny, nx))
                if len(pts) > 90:
                    for y, x in pts: seen[y, x] = True
    out = a.copy(); out[seen, 3] = 0
    # 바탕과 비슷한 가장자리 (반투명 테두리)는 살짝 투명하게
    edge = (~seen) & (diff < 26)
    # 바탕에 닿은 가장자리만 반투명
    nb = np.zeros_like(seen); nb[1:] |= seen[:-1]; nb[:-1] |= seen[1:]; nb[:, 1:] |= seen[:, :-1]; nb[:, :-1] |= seen[:, 1:]
    e2 = edge & nb
    out[e2, 3] = (out[e2, 3] * np.clip(diff[e2] / 26, 0.3, 1)).astype(np.uint8)
    return out

def keep_main(alpha):
    """가장 큰 덩어리만 남김 (흩어진 점 · UI 조각 지움)"""
    h, w = alpha.shape; lab = np.zeros((h, w), int); n = 0; sizes = {}
    for y in range(h):
        for x in range(w):
            if alpha[y, x] > 20 and not lab[y, x]:
                n += 1; q = deque([(y, x)]); lab[y, x] = n; c = 0
                while q:
                    cy, cx = q.popleft(); c += 1
                    for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1), (cy + 1, cx + 1), (cy - 1, cx - 1), (cy + 1, cx - 1), (cy - 1, cx + 1)):
                        if 0 <= ny < h and 0 <= nx < w and alpha[ny, nx] > 20 and not lab[ny, nx]: lab[ny, nx] = n; q.append((ny, nx))
                sizes[n] = c
    big = max(sizes, key=sizes.get)
    keep = set(k for k, c in sizes.items() if c > sizes[big] * 0.02)   # 큰 조각 (떨어진 주먹 · 돌멩이)은 남김
    return np.isin(lab, list(keep))

for nm in NAMES:
    f, box = SRC[nm]; im = Image.open(os.path.join(D, f)).convert('RGBA')
    if box: im = im.crop(box)
    a = np.array(im)
    a = a[5:-5, 5:-5].copy()   # 칸 테두리
    a[:, -4:, 3] = 0; a[-4:, :, 3] = 0   # 남은 테두리 선
    h, w = a.shape[:2]
    u = max(30, h // 9); a[:u, :u + 6, 3] = 0; a[:u, w - int(u * 2.3):, 3] = 0        # 칸 UI (왼쪽 위 체크 상자 · 오른쪽 위 휴지통 · 동그라미)
    kill = None
    if nm == 'pistol':   # 제미나이 별 워터마크 (다리 사이): 바지 위에 걸친 부분은 바지색으로, 나머지 밝은 곳은 지움
        Y0, Y1, X0, X1 = 163, 207, 78, 121
        reg = a[Y0:Y1, X0:X1, :3].astype(int); lum = reg.mean(2); sat = reg.max(2) - reg.min(2)
        star = (lum > 120) & (sat < 30); onpants = star & (lum < 200)
        reg[onpants] = [88, 84, 100]; a[Y0:Y1, X0:X1, :3] = reg.astype(np.uint8)
        kill = np.zeros(a.shape[:2], bool); kill[Y0:Y1, X0:X1] = star & ~onpants
    a = clear_bg(a)
    if kill is not None: a[kill, 3] = 0
    if nm == 'crouch':   # 위의 움찔 그림 (머리 · 몸통) 잘라 냄: 아래 그림 머리보다 위, 왼쪽 몸통
        yy, xx = np.mgrid[:h, :w]
        a[(yy < 64), 3] = 0
        a[(yy < 92) & (xx < 106), 3] = 0
        a[(yy < 80) & (xx < 109), 3] = 0
    m = keep_main(a[:, :, 3]); a[~m, 3] = 0
    ys, xs = np.where(a[:, :, 3] > 10); a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    al = Image.fromarray(a[:, :, 3]).filter(ImageFilter.MinFilter(3)); a[:, :, 3] = np.minimum(a[:, :, 3].astype(int), np.array(al).astype(int) + 90).astype(np.uint8)   # 밝은 테두리 (바탕 번짐) 한 겹 깎음
    out = Image.fromarray(a).resize((a.shape[1] * UP, a.shape[0] * UP), Image.LANCZOS)
    out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    pad = Image.new('RGBA', (out.width + 8, out.height + 4), (0, 0, 0, 0)); pad.paste(out, (4, 2))
    pad.save(os.path.join(D, f'{nm}.webp'), 'WEBP', quality=92)
    print(nm, pad.size)
