# up1_seg.py v1.0 (1차 업뎃 자르기 도구 짝, 원래 이름 seg.py) — 시트 한 장을 바탕 지우고 덩어리 (인물) 로 나눔. 모듈로 씀: from seg import alpha_of, blobs
import numpy as np
from PIL import Image
from scipy import ndimage

def alpha_of(im, tol=34, flat_std=3.0):
    """RGBA 배열 (H,W,4) 돌려줌. 이미 투명하면 그대로, 아니면 가장자리 바탕색을 가장자리에서부터 지우고 · 갇힌 바탕 (단색 덩어리) 도 지움"""
    a = np.asarray(im.convert('RGBA')).copy()
    H, W = a.shape[:2]
    edge = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    if (edge[:, 3] < 20).mean() > 0.5:   # 이미 투명한 시트
        a[a[..., 3] < 24] = 0
        return a
    bg = np.median(edge[:, :3], axis=0)
    d = np.abs(a[..., :3].astype(np.int16) - bg.astype(np.int16)).sum(2)
    near = d < tol * 3
    lab, n = ndimage.label(near)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    kill = np.isin(lab, list(border))
    # 갇힌 바탕: 바탕색에 아주 가깝고 (d < 12) 고른 (표준편차 작음) 큰 덩어리
    tight = d < 12
    lab2, n2 = ndimage.label(tight & ~kill)
    if n2:
        sizes = ndimage.sum(np.ones_like(d), lab2, range(1, n2 + 1))
        for i, s in enumerate(sizes, 1):
            if s < 400: continue
            m = lab2 == i
            if a[..., :3][m].std(0).max() < flat_std: kill |= m
    a[kill, 3] = 0
    # 가장자리 번짐 줄이기: 지운 곳 바로 옆, 바탕색에 가까운 칸은 반투명
    er = ndimage.binary_dilation(kill) & ~kill & (d < tol * 4.5)
    a[er, 3] = np.minimum(a[er, 3], 110)
    return a

def blobs(a, grow=6, min_area=1500, thr=24):
    """불투명 덩어리 상자들 [(x0,y0,x1,y1,area)] — grow px 만큼 붙여서 (칼 · 창이 몸과 살짝 떨어져도 한 덩어리)"""
    m = a[..., 3] > thr
    g = ndimage.binary_dilation(m, iterations=grow) if grow else m
    lab, n = ndimage.label(g)
    out = []
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        if sl is None: continue
        area = int((m[sl] & (lab[sl] == i)).sum())
        if area < min_area: continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        out.append([x0, y0, x1, y1, area, i])
    return out, lab
