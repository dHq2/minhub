# kar_art.py v1.0 — 카리우스 새 그림 (민수 드라이브 '카리우스' 폴더 27장) → cave-3d/art/kar/*.webp + src/kar_sheets.js
#  · 원본: art/kar/src/<키>.webp (드라이브 원본을 긴 변 900으로 줄여 둔 것)
#  · 바탕: 투명 그림은 그대로, 흰 바탕 (근성 · 훅 · 꿰뚫기 · 원화2) · 검은 바탕 (돌진몸박2)은 가장자리부터 지움 (갇힌 바탕 덩어리도)
#  · 돌진몸박2는 좌우를 뒤집음 (민수: 좌우반전필요). 질주하는 다중 융합 괴물은 돌진몸박2와 같은 그림이라 안 씀
#  · 크기: 모든 자세를 '서 있는 키'가 같게 맞춤 (HK = 그림 테두리 높이 ÷ 서 있는 키, 눈으로 잼)
#  · 발 위치: 아래 6% 줄의 그림 가운데
#  · 움직임 (여러 장): 발 위치를 맞춰 한 장의 가로 시트로 (걷기 = 걷기 · 기본 번갈아)
#  · 스킬 그림 (액자): 액자 안쪽을 정사각형으로 잘라 256칸 → art/kar/icon_*.webp. 불경자 컷씬은 통째로 + 얼굴 부분을 스킬 그림으로
# 실행: python3 tools/kar_art.py  (cave-3d 폴더에서)
import os, json
from collections import deque
from PIL import Image
import numpy as np
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); D = os.path.join(HERE, 'art', 'kar'); SRC = os.path.join(D, 'src')
H0 = 560   # 서 있는 키 (픽셀)
# 키 → (바탕, 뒤집기, HK)
POSES = {
    'idle': (None, 0, 1.0), 'walk': (None, 0, 1.0), 'hIdle': (None, 0, 1.0), 'hWalk': (None, 0, 1.0), 'hRoar': (None, 0, 1.0),
    'grit': ('white', 0, 0.97), 'gritRoar': ('white', 0, 1.0), 'upper': (None, 0, 0.9), 'hurt': (None, 0, 0.88), 'hook': ('white', 0, 1.0),
    'hookPrep': ('white', 0, 1.0), 'pierce': ('white', 0, 1.18), 'grab': (None, 0, 0.82), 'sprout': (None, 0, 0.92), 'tackle': (None, 0, 0.86),
    'rush': ('black', 1, 0.8), 'footUp': (None, 0, 0.92), 'kick': (None, 0, 0.9), 'raise': (None, 0, 1.12), 'mace': (None, 0, 0.92), 'swat': (None, 0, 0.82),
}
ANIM = {'walk2': ['walk', 'idle'], 'hWalk2': ['hWalk', 'hIdle'], 'dig': ['raise', 'mace']}
ICONS = {'icon_body': 'icon_body', 'icon_grit': 'icon_grit', 'icon_pierce': 'icon_pierce'}

def flood_bg(a, kind):
    h, w = a.shape[:2]; rgb = a[:, :, :3].astype(int)
    near = rgb.min(2) >= 236 if kind == 'white' else rgb.max(2) <= 10
    strict = rgb.min(2) >= 246 if kind == 'white' else rgb.max(2) <= 3
    seen = np.zeros((h, w), bool); q = deque()
    for x in range(w): q.append((0, x)); q.append((h - 1, x))
    for y in range(h): q.append((y, 0)); q.append((y, w - 1))
    while q:
        y, x = q.popleft()
        if y < 0 or x < 0 or y >= h or x >= w or seen[y, x] or not near[y, x]: continue
        seen[y, x] = True; q.extend(((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)))
    # 갇힌 바탕 (다리 사이 · 팔 사이): 아주 바탕색인 덩어리가 크면 지움
    lab = np.zeros((h, w), np.int32); k = 0; holes = strict & ~seen
    for y0, x0 in zip(*np.nonzero(holes)):
        if lab[y0, x0]: continue
        k += 1; q2 = deque([(y0, x0)]); lab[y0, x0] = k; pts = []
        while q2:
            y, x = q2.popleft(); pts.append((y, x))
            for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= yy < h and 0 <= xx < w and holes[yy, xx] and not lab[yy, xx]: lab[yy, xx] = k; q2.append((yy, xx))
        if len(pts) > 350:
            for y, x in pts: seen[y, x] = True
    al = np.where(seen, 0, 255).astype(np.uint8)
    # 가장자리 테두리 (바탕과 섞인 픽셀): 바탕색에 가까운 만큼 투명하게
    bgm = Image.fromarray((seen * 255).astype(np.uint8)).filter(__import__('PIL.ImageFilter', fromlist=['x']).MaxFilter(5))
    edge = (np.array(bgm) > 0) & ~seen
    s = rgb.sum(2)
    t = np.clip((765 - s) / 150, 0, 1) if kind == 'white' else np.clip(s / 90, 0, 1)
    al = np.where(edge, (t * 255).astype(np.uint8), al)
    a = a.copy(); a[:, :, 3] = np.minimum(a[:, :, 3], al); return a

def load(k):
    im = Image.open(os.path.join(SRC, k + '.webp')).convert('RGBA'); bg, flip, hk = POSES[k]
    a = np.array(im)
    if bg: a = flood_bg(a, bg)
    im = Image.fromarray(a)
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    box = im.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox(); im = im.crop(box)
    k2 = H0 * hk / im.height; im = im.resize((max(1, round(im.width * k2)), max(1, round(im.height * k2))), Image.LANCZOS)
    w, h = im.size; band = im.getchannel('A').crop((0, int(h * 0.94), w, h)).point(lambda v: 255 if v > 40 else 0).getbbox()
    ax = round((band[0] + band[2]) / 2) if band else w // 2
    return im, ax

os.makedirs(D, exist_ok=True); table = {}; got = {}
for k in POSES:
    im, ax = load(k); got[k] = (im, ax)
    im.save(os.path.join(D, k + '.webp'), 'WEBP', quality=86, method=6)
    table[k] = {'src': f'art/kar/{k}.webp', 'w': im.width, 'h': im.height, 'ax': ax, 'ay': im.height - 2}
    print(k, im.size, 'ax', ax)
for name, fr in ANIM.items():
    L = max(got[k][1] for k in fr); R = max(got[k][0].width - got[k][1] for k in fr); H = max(got[k][0].height for k in fr); W = L + R
    sheet = Image.new('RGBA', (W * len(fr), H), (0, 0, 0, 0))
    for i, k in enumerate(fr): im, ax = got[k]; sheet.paste(im, (i * W + L - ax, H - im.height), im)
    sheet.save(os.path.join(D, name + '.webp'), 'WEBP', quality=86, method=6)
    table[name] = {'src': f'art/kar/{name}.webp', 'w': W, 'h': H, 'ax': L, 'ay': H - 2, 'n': len(fr)}
    print(name, (W, H), len(fr))
# 스킬 그림: 액자 안쪽 (가장자리 6%를 버림) 정사각형
for out, k in ICONS.items():
    im = Image.open(os.path.join(SRC, k + '.webp')).convert('RGB'); w, h = im.size; m = round(min(w, h) * 0.06); s = min(w, h) - 2 * m
    im.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s)).resize((256, 256), Image.LANCZOS).save(os.path.join(D, out + '.webp'), 'WEBP', quality=88)
cut = Image.open(os.path.join(SRC, 'cut_heretic.webp')).convert('RGB'); w, h = cut.size; m = round(h * 0.03)
cut = cut.crop((m, m, w - m, h - m)); cut.save(os.path.join(D, 'cut_heretic.webp'), 'WEBP', quality=88)
w, h = cut.size; s = round(h * 0.78); cx, cy = round(w * 0.5), round(h * 0.42)
cut.crop((cx - s // 2, max(0, cy - s // 2), cx + s // 2, max(0, cy - s // 2) + s)).resize((256, 256), Image.LANCZOS).save(os.path.join(D, 'icon_heretic.webp'), 'WEBP', quality=88)
open(os.path.join(HERE, 'src', 'kar_sheets.js'), 'w').write('/* kar_sheets.js — tools/kar_art.py가 만듦. 손으로 고치지 않음. 카리우스 자세 → 그림 크기 · 발 위치 */\nconst KAR_SHEETS = ' + json.dumps(table, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('ok')
