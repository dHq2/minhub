# inju_art.py v1.6 — (v1.6: 일곱째 묶음 — 어퍼컷 · 드롭킥 1 · 2 · 3 · 붕권 (233은 네 칸이 붙은 캡처))
# v1.5 — (v1.5: 여섯째 묶음 — 다리 기술 중간 · 플라잉 니킥 · 발목 부수기 · 구르기 뒤 (드롭킥 뒤) · 짐 들기 · 손 들기. twobg = 바탕이 위 · 아래 두 색 (바닥 띠))
# v1.4 — (v1.4: 다섯째 묶음 — 무에타이 자세 · 니킥 · 킥 앞 프레임 · 무에타이 가드 · 하이킥 · 회전, ui = 칸 UI 지울 높이 (하이킥은 발끝이 위로 올라가 낮춤))
# v1.3 — (v1.3: 넷째 묶음 — 다리후리기 · 슬라이딩 · 구르기 · 복싱 스텝 · 발차기 · 점프 + 중간 묶음 (src_m*: 클린치 1 · 앉아 쉬기 · 강한 투창 · 쪼그려 앉기 · 클린치 싸움 두 칸, 파운딩은 겹쳐서 뺌))
# v1.2 — (v1.2: 셋째 묶음 — 주먹 · 어깨빵 · 죽음 · 잠 · 웅크림, 그림별 선택 (칸 UI 없음 · 워터마크 상자), 이름을 주면 그것만 다시 만듦)
# v1.1 — (v1.1: 둘째 묶음 — 숙여 회피 · 소총 · 권총 · 그라운드 가드 · 막기, 두 칸이 붙은 캡처는 나눔)
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
       'rifle': ('src_209.png', (0, 0, 186, 247)), 'pistol': ('src_209.png', (209, 0, 394, 247)), 'duck': ('src_210.png', None), 'groundGuard': ('src_211.png', None), 'block': ('src_212.png', None),
       'punch': ('src_213.png', None), 'shoulder': ('src_214.png', None), 'dead': ('src_215.png', None), 'sleep': ('src_216.png', None), 'curl': ('src_217.png', None),
       'sweep': ('src_218.png', None), 'slide': ('src_219.png', None), 'roll': ('src_220.png', None), 'box': ('src_221.png', (0, 0, 318, 411)), 'kick': ('src_222.png', (0, 0, 314, 418)), 'jump': ('src_222.png', (346, 0, 665, 418)),
       'clinch1': ('src_m1.png', None), 'sit': ('src_m2.png', None), 'throwHard': ('src_m3.png', None), 'squat': ('src_m4.png', None), 'clinchPush': ('src_m5.png', (203, 0, 394, 246)), 'jab': ('src_m5.png', (0, 284, 188, 536)),
       'mtPose': ('src_223.png', None), 'knee': ('src_224.png', None), 'kickPrep': ('src_225.png', (0, 0, 314, 410)), 'mtGuard': ('src_226.png', None), 'highKick': ('src_227.png', (0, 0, 311, 412)), 'spin': ('src_227.png', (348, 0, 654, 412)),
       'hop': ('src_228.png', None), 'flyKnee': ('src_229.png', None), 'stomp': ('src_230.png', None), 'rollUp': ('src_231.png', None), 'carry': ('src_232.png', (0, 0, 119, 413)), 'raise': ('src_232.png', (138, 0, 275, 413)),
       'uppercut': ('src_233.png', (6, 0, 314, 417)), 'dk3': ('src_233.png', (349, 0, 660, 417)), 'dk1': ('src_233.png', (698, 0, 1011, 417)), 'bungkwon': ('src_233.png', (1044, 0, 1351, 417)), 'dk2': ('src_234.png', None)}
# 그림별 선택: noui = 칸 UI 없는 캡처, star = 제미나이 별 워터마크 상자 (자른 뒤 좌표, x0, y0, x1, y1), noholes = 안쪽 구멍 지우기 끔, killLight = (y0, x0) 오른쪽 아래의 밝은 흙먼지 지움
# box는 카드 아래 흰 이름표 칸 (y 411~)을 잘라 냄 (바탕색 짐작이 틀어짐)
OPT = {'uppercut': {'noholes': 1}, 'dk3': {'noholes': 1}, 'dk1': {'noholes': 1}, 'bungkwon': {'noholes': 1}, 'dk2': {'noholes': 1}, 'hop': {'noui': 1, 'twobg': 1, 'noholes': 1}, 'flyKnee': {'noholes': 1}, 'stomp': {'noholes': 1}, 'rollUp': {'noholes': 1}, 'carry': {'ui': 18, 'noholes': 1}, 'raise': {'ui': 18, 'noholes': 1}, 'highKick': {'ui': 34, 'noholes': 1}, 'mtPose': {'noholes': 1}, 'knee': {'noholes': 1}, 'kickPrep': {'noholes': 1}, 'mtGuard': {'noholes': 1}, 'spin': {'noholes': 1}, 'sweep': {'killLight': (285, 80), 'noholes': 1}, 'box': {'noholes': 1}, 'throwHard': {'noholes': 1}, 'sleep': {'noui': 1, 'noholes': 1}, 'shoulder': {'noholes': 1}, 'curl': {'noholes': 1}, 'dead': {'star': (125, 272, 205, 345)}}
import sys
NAMES = sys.argv[1:] or list(SRC)
UP = 2
TH = 15   # 바탕과 이만큼 가까운 색만 바탕 (피부 · 흰 셔츠가 바탕색과 비슷해서 낮게)

def clear_bg(a, holes=True, twobg=False):
    h, w = a.shape[:2]
    bg = np.median(np.concatenate([a[2:6, 40:w - 60, :3].reshape(-1, 3), a[h - 6:h - 2, :, :3].reshape(-1, 3)]), axis=0)
    diff = np.abs(a[:, :, :3].astype(int) - bg).sum(2)
    if twobg:   # 위 바탕 · 아래 바닥 띠가 색이 다름: 둘 중 가까운 쪽
        bt = np.median(a[2:6, :, :3].reshape(-1, 3), axis=0); bb = np.median(a[h - 6:h - 2, :, :3].reshape(-1, 3), axis=0)
        diff = np.minimum(np.abs(a[:, :, :3].astype(int) - bt).sum(2), np.abs(a[:, :, :3].astype(int) - bb).sum(2))
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
    hole = (diff < 22) & ~seen & holes
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
    o = OPT.get(nm, {})
    if not o.get('noui'): u = o.get('ui') or max(30, h // 9); a[:u, :u + 6, 3] = 0; a[:u, w - int(u * 2.3):, 3] = 0        # 칸 UI (왼쪽 위 체크 상자 · 오른쪽 위 휴지통 · 동그라미)
    kill = None
    if nm == 'pistol':   # 제미나이 별 워터마크 (다리 사이): 바지 위에 걸친 부분은 바지색으로, 나머지 밝은 곳은 지움
        Y0, Y1, X0, X1 = 163, 207, 78, 121
        reg = a[Y0:Y1, X0:X1, :3].astype(int); lum = reg.mean(2); sat = reg.max(2) - reg.min(2)
        star = (lum > 120) & (sat < 30); onpants = star & (lum < 200)
        reg[onpants] = [88, 84, 100]; a[Y0:Y1, X0:X1, :3] = reg.astype(np.uint8)
        kill = np.zeros(a.shape[:2], bool); kill[Y0:Y1, X0:X1] = star & ~onpants
    a = clear_bg(a, not o.get('noholes'), bool(o.get('twobg')))   # noholes: 흰 셔츠가 바탕색과 같아서 안쪽 구멍 지우기를 끔
    if kill is not None: a[kill, 3] = 0
    if o.get('killLight'):
        y0, x0 = o['killLight']; r = a[y0:, x0:, :3].astype(int)
        a[y0:, x0:, 3][(r.mean(2) > 135) & (r.max(2) - r.min(2) < 60)] = 0
    if o.get('star'): x0, y0, x1, y1 = o['star']; a[y0:y1, x0:x1, 3] = 0
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
