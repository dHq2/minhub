# memo_fix.py v1.1 — 민수가 도감에 적어 둔 그림 할 일 처리 (2026-10-09)
#  v1.1 (2026-10-10): 다시 돌리면 나눈 칸 (N-026a · b · N-027a · b) 이 사라지던 것 고침 · 친칠라 (좀더 얼굴 확대) · 페흐토 (배경 제거, 투구쪽만 확대) 메모를 다시 받아 더 좁게 자름 — 얼굴 · 투구가 칸을 꽉 채움, 키운 만큼 살짝 선명하게
#  · 초상화 다시 자르기: 레오나스 (가면 말고 수염 난 얼굴) · 친칠라 (얼굴 더 크게) · 페흐토 (배경 없는 기본 그림에서 투구만)
#    · 소녀와 죄수 (거인 말고 소녀 얼굴) · 고대사슴 산호 (뿔 있는 머리)
#  · 고대사슴 산호 NPC 그림: 보라 바탕을 지운 스프라이트 N-coral-deer-cut 를 따로 둠 (원본은 그대로)
#    배경 지우기 모델 셋 (isnet-anime · birefnet · isnet-general) 다 이 만화 칸은 못 지워서 색 씨앗 + GrabCut 으로 땀
#  · 카리우스 '불경자' 스킬 그림: 컷씬에서 얼굴 전체 (안경 · 이빨 · 턱) 가 보이게 다시 자름 → 게임 art/kar/icon_heretic.webp + 도감
#  · 한 장에 두 명: 배달부 · 요리사 / 벌키우는남자 · 테레비신도 → 사람마다 그림 · 초상화 · 인물 번호 (요리사 C-275 · 테레비신도 C-276)
#  실행: python3 tools/memo_fix.py   (원본 그림은 안 건드려서 여러 번 돌려도 같음)
import os, json
import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); C3 = os.path.join(os.path.dirname(ROOT), 'cave-3d')
P = os.path.join(ROOT, 'catalog.js'); s = open(P, encoding='utf-8').read(); key = 'const CATALOG = '
head = s[:s.index(key) + len(key)]; cat = json.loads(s[len(head):].strip().rstrip(';'))
R = lambda p: os.path.join(ROOT, p)
DAY = '2026-10-09'

def square(src, box, dst, size=256, mode=None):
    im = Image.open(src).convert('RGBA').crop(box).resize((size, size), Image.LANCZOS)
    if size / (box[2] - box[0]) > 1.6:   # v1.1 많이 키운 칸은 살짝 선명하게 (투명도는 그대로)
        from PIL import ImageFilter
        a = im.getchannel('A'); im = im.convert('RGB').filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=2)).convert('RGBA'); im.putalpha(a)
    if mode == 'RGB': bg = Image.new('RGBA', im.size, (0, 0, 0, 255)); bg.alpha_composite(im); im = bg.convert('RGB')
    im.save(dst, 'WEBP', quality=88, method=4)

# 1) 초상화 · 스킬 그림 (원본 → 정사각형)
square(R('img/char/leonas_art.webp'), (220, 135, 390, 305), R('img/face/leonas_portrait.webp'))          # 웃는 얼굴 + 분홍 수염
square(R('img/char/chinchilla_art.webp'), (213, 112, 333, 232), R('img/face/auto_chinchilla.webp'))      # v1.1 얼굴만 (눈 · 코 · 입이 칸을 채움, 곰 가죽은 위 가장자리만)
square(R('img/char/pehto_base.webp'), (282, 42, 408, 168), R('img/face/auto_pehto.webp'))                 # v1.1 배경 없는 기본 그림에서 투구만 (뿔 · 어깨는 가장자리 밖)
square(R('img/char/girlprisoner_art.webp'), (280, 315, 440, 475), R('img/face/girlprisoner_portrait.webp'))   # 땋은 머리 소녀 얼굴
for dst, mode in ((os.path.join(C3, 'art', 'kar', 'icon_heretic.webp'), None), (R('img/karius/icon_heretic.webp'), 'RGB')):
    square(os.path.join(C3, 'art', 'kar', 'cut_heretic.webp'), (160, 20, 600, 460), dst, mode=mode)       # 얼굴 전체

# 2) 고대사슴 산호: 보라 바탕 지우기 (색 씨앗 → GrabCut → 가장 큰 덩어리, 다리 사이 바탕은 다시 뺌)
rgb = np.array(Image.open(R('img/npc/N-coral-deer.webp')).convert('RGB')); H, W, _ = rgb.shape
hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV_FULL).astype(int); h, sat, val = hsv[..., 0] * 360 / 256, hsv[..., 1] / 255, hsv[..., 2] / 255
mag = (h > 285) & (h < 315) & (sat > 0.58) & (val > 0.5)                                              # 진한 자홍 바탕
crowd = (h > 285) & (h < 310) & (sat > 0.4) & (sat <= 0.62) & (val > 0.38) & (val < 0.56)              # 아래 군중 그림자
core = ((sat < 0.3) & (val < 0.62)) | (val < 0.2) | ((h > 150) & (h < 200) & (sat > 0.25))             # 어두운 회색 몸 · 청록 줄
edge = np.zeros_like(core); edge[:4] = edge[-4:] = True; edge[:, :4] = edge[:, -4:] = True
mask = np.full((H, W), cv2.GC_PR_BGD, np.uint8); mask[mag | crowd] = cv2.GC_BGD; mask[core & ~edge] = cv2.GC_PR_FGD
lab, n = ndi.label(core & ~edge); big = 1 + int(np.argmax(ndi.sum(np.ones_like(lab), lab, range(1, n + 1))))
mask[ndi.binary_erosion(lab == big, iterations=3)] = cv2.GC_FGD
mask[:2] = cv2.GC_BGD; mask[:, :2] = cv2.GC_BGD; mask[:, -2:] = cv2.GC_BGD                            # 맨 위 흰 테두리 · 양옆 손잡이
cv2.setRNGSeed(7); bgd, fgd = np.zeros((1, 65)), np.zeros((1, 65))
cv2.grabCut(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), mask, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
fg = (mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)
big1 = lambda m: (lambda L, k: L == 1 + int(np.argmax(ndi.sum(np.ones_like(L), L, range(1, k + 1)))))(*ndi.label(m))
fg = big1(fg); fg = ndi.binary_fill_holes(fg) & ~(mag | crowd); fg = big1(ndi.binary_opening(fg, iterations=1))
rim = fg & ~ndi.binary_erosion(fg, iterations=2) & (h > 270) & (h < 325) & (sat > 0.35)               # 가장자리 보라 번짐 → 회색 쪽으로
rgb = rgb.copy(); g = rgb[rim].mean(axis=1, keepdims=True); rgb[rim] = (0.55 * g + 0.45 * rgb[rim]).astype(np.uint8)
a = cv2.GaussianBlur(fg.astype(np.float32), (3, 3), 0.8)
deer = Image.fromarray(np.dstack([rgb, (a * 255).astype(np.uint8)]), 'RGBA'); deer = deer.crop(deer.getbbox())
deer.save(R('img/npc/N-coral-deer-cut.webp'), 'WEBP', quality=88, method=4)
face = Image.new('RGBA', (190, 190), (0, 0, 0, 0)); face.alpha_composite(deer.crop((10, 0, 200, 190)))
face.resize((256, 256), Image.LANCZOS).save(R('img/face/auto_coraldeer.webp'), 'WEBP', quality=88, method=4)   # 뿔 있는 머리

# 3) 한 장 두 명 → 사람마다 (투명 덩어리로 나눔, 작은 부스러기는 가까운 사람에게)
def split(src):
    im = Image.open(src).convert('RGBA'); A = np.array(im); al = A[..., 3] > 40
    L, k = ndi.label(al); sz = ndi.sum(al, L, range(1, k + 1)); two = [1 + int(i) for i in np.argsort(sz)[::-1][:2]]
    cx = {t: ndi.center_of_mass(L == t)[1] for t in two}; two.sort(key=lambda t: cx[t])                 # 왼쪽 사람 먼저
    keep = {t: L == t for t in two}
    for t in range(1, k + 1):
        if t in two: continue
        x = ndi.center_of_mass(L == t)[1]; near = min(two, key=lambda q: abs(cx[q] - x)); keep[near] |= L == t
    out = []
    for t in two:
        m = ndi.binary_dilation(keep[t], iterations=2) & (A[..., 3] > 0); B = A.copy(); B[..., 3] = np.where(m, A[..., 3], 0)
        p = Image.fromarray(B, 'RGBA'); out.append(p.crop(p.getbbox()))
    return out
def face_of(p):   # 스탠딩 위쪽 정사각형 (머리 쪽 가운데)
    w, hh = p.size; side = min(w, int(hh * 0.5)); top = np.array(p)[: max(1, int(hh * 0.25)), :, 3] > 40
    xs = np.nonzero(top.any(axis=0))[0]; cxh = int((xs.min() + xs.max()) / 2) if len(xs) else w // 2
    x0 = max(0, min(w - side, cxh - side // 2)); f = Image.new('RGBA', (side, side), (0, 0, 0, 0)); f.alpha_composite(p.crop((x0, 0, x0 + side, side)))
    return f.resize((256, 256), Image.LANCZOS)
SPLIT = [('N-026', 'C-176', 'C-275', '배달부', '요리사', '배달부, 요리사.png'), ('N-027', 'C-177', 'C-276', '벌키우는남자', '테레비신도', '벌키우는남자, 테레비신도.png')]
for nid, ca, cb, na, nb, orig in SPLIT:
    for (suf, cid, nm), p in zip((('a', ca, na), ('b', cb, nb)), split(R(f'img/npc/{nid}.webp'))):
        p.save(R(f'img/npc/{nid}{suf}.webp'), 'WEBP', quality=88, method=4); face_of(p).save(R(f'img/face/{nid}{suf}_portrait.webp'), 'WEBP', quality=88, method=4)

# 4) 도감 칸
by = {e['id']: e for e in cat}
def note(i, t):
    if i in by: by[i]['note'] = t
note('F-leonas', f'{DAY} 다시 자름: 가면 말고 웃는 얼굴 + 분홍 수염으로 줌인 (민수 메모) · 스탠딩에서 정사각형')
note('F-auto-chinchilla', '2026-10-10 한 번 더 자름: 얼굴만 꽉 차게 (민수 메모 \'좀더 얼굴 확대된 초상화로\') · 기본 원화에서 정사각형 (2026-10-09 첫 자름은 곰 가죽까지)')
note('F-auto-pehto', '2026-10-10 한 번 더 자름: 배경 없는 기본 그림 (페흐토기본.png) 에서 투구만 꽉 차게 · 바탕 투명 (민수 메모 \'배경 제거, 투구쪽만 확대\')')
note('F-girlprisoner', f'{DAY} 다시 자름: 거인 말고 땋은 머리 소녀 얼굴로 (민수 메모)')
note('F-auto-coraldeer', f'{DAY} 다시 자름: 뿔 있는 머리 부분 (민수 메모) · 배경 지운 스프라이트 N-coral-deer-cut 에서')
note('N-coral-deer', '드라이브 NPC 폴더 · 고대사슴 산호.png (원본 그대로). 배경 지운 스프라이트는 바로 다음 칸')
note('SK-kar-heretic', f'드라이브 카리우스 폴더 스킬 그림 · {DAY} 컷씬에서 얼굴 전체 (안경 · 이빨 · 턱) 가 보이게 다시 자름 (민수 메모)')
note('P-karius-cut', f'드라이브 · 불경자 카리우스 컷씬&잘라서스킬이미지.PNG · {DAY} 스킬 그림 (불경자) 을 얼굴이 다 보이게 다시 자름')
deer_sub = by['N-coral-deer']['sub']
new_deer = {'id': 'N-coral-deer-cut', 'cat': 'char', 'sub': deer_sub, 'cid': 'C-101', 'name': '고대사슴 산호 · 배경 지운 스프라이트', 'src': 'img/npc/N-coral-deer-cut.webp',
            'note': f'{DAY} 드라이브 고대사슴 산호.png 의 보라 바탕 · 아래 군중 · 왼쪽 고치 괴물을 지우고 사슴만 땀 (민수 메모). 원본이 아래 · 오른쪽에서 잘려 있어 몸통 위쪽까지', 'rank': '', 'on': False, 'g': 'coraldeer'}
out = []
for e in cat:
    if e['id'] == 'N-coral-deer-cut': continue
    if e['id'] in ('N-026', 'N-027', 'F-N-026', 'F-N-027'):
        nid = e['id'][-5:]; row = next(r for r in SPLIT if r[0] == nid)
        if e['id'].startswith('F-'): continue                     # 초상화는 사람 칸 앞에 같이 넣음
        for suf, cid, nm in (('a', row[1], row[3]), ('b', row[2], row[4])):
            sub = f'{nm} · 미등장 NPC (일반) · 원화 + 연출'; g = nid if suf == 'a' else nid + 'b'
            out.append({'id': f'F-{nid}{suf}', 'cat': 'char', 'sub': sub, 'cid': cid, 'name': f'{nm} 기본 초상화', 'src': f'img/face/{nid}{suf}_portrait.webp', 'note': '스탠딩에서 정사각형으로 자름', 'rank': '', 'on': False, 'g': g})
            out.append({'id': f'{nid}{suf}', 'cat': 'char', 'sub': sub, 'cid': cid, 'name': nm, 'src': f'img/npc/{nid}{suf}.webp',
                        'note': f'{DAY} 한 장에 같이 있던 그림 (드라이브 NPC 폴더 · {row[5]}) 에서 나눔 (민수 메모 \'분리해서 별개 스프라이트로\')', 'rank': '', 'on': False, 'g': g})
        continue
    if e['id'].startswith(('F-N-026', 'N-026', 'F-N-027', 'N-027')) and e['id'][-1] in 'ab' and any(x['id'] in ('N-026', 'N-027') for x in cat): continue   # 다시 돌릴 때 위에서 새로 넣음 (v1.1: 나눈 원래 칸이 이미 없으면 나눈 칸을 그대로 둠 — 전엔 지워졌음)
    out.append(e)
    if e['id'] == 'N-coral-deer': out.append(new_deer)
cat = out
if 'v1.92:' not in head: head = head.replace('/* catalog.js v1.91 — ', '/* catalog.js v1.92 — v1.92: 도감 메모 처리 (tools/memo_fix.py — 초상화 5 · 산호 사슴 배경 지운 스프라이트 · 불경자 스킬 그림 · 두 명 그림 2장 → 4명). ', 1)
open(P, 'w', encoding='utf-8').write(head + json.dumps(cat, ensure_ascii=False, indent=0) + ';\n')
print('도감', len(cat), '칸 ·', ', '.join(e['id'] for e in cat if e['id'].startswith(('N-026', 'N-027', 'F-N-026', 'F-N-027', 'N-coral'))))
