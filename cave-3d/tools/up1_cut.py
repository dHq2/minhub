# up1_cut.py v1.6 (1차 업뎃 시트 자르기, 원래 이름 cut.py — 2 · 3기 칸은 tools/up1_cut_spec.json) — (v1.6: OVR — 겹쳐 그려진 남의 창 · 꼬리를 색 규칙으로 주인에게 돌려줌) v1.5 — (v1.5: 덩어리를 세기 전에 2px 깎아 가는 다리를 끊음 — 옆 인물 망토에 살짝 닿은 창끝 · 꼬리가 이음선대로 남에게 가던 것. 깎인 픽셀은 가까운 주인에게) v1.4 — (v1.4: 큰 덩어리는 칸 기준 (88% / 이음선), 작은 덩어리는 통째로 가장 가까운 주인에게 — v1.3 몸통 규칙이 서로 붙은 줄 (누운 그림) 에서 엉뚱하게 묶던 것) v1.3 — (v1.3: 몸통 (칸마다 가장 큰 덩어리) 을 먼저 정하고, 떨어진 칼날 · 창끝 · 화살 · 조각은 가장 가까운 몸통에게 — 옆 인물 칸으로 넘어간 칼끝이 남에게 붙던 것) v1.2 — (v1.2: 이어진 덩어리는 통째로 한 주인에게 — 옆 칸으로 넘어간 창 끝 · 칼끝이 잘리던 것. 크게 붙은 두 인물만 이음선으로 나눔 · 작은 조각은 가까운 덩어리 주인에게) v1.1 — (v1.1: 자를 자리를 고르게 나눈 칸 근처 골짜기에서 찾음 — 누운 그림처럼 이어진 줄에서 몸을 가르던 것) v1.0 — 시트를 줄 · 칸으로 자름 (이음선: 그림이 가장 적게 지나가는 굽은 선을 따라 자름 → 칼 · 망토가 옆 칸에 걸쳐도 덜 잘림)
#  사용: python3 -I tools/up1_cut.py RAW_DIR OUT_DIR tools/up1_cut_spec.json
#   SPEC: { "파일 이름": [줄마다 칸 수, ...], ... }   예) [5,5] · [4,4,2]
#  출력: OUT_DIR/<파일 stem>/r<줄>c<칸>.png (투명 바탕, 그림 테두리로 자름) + _info.json (상자 · 발 위치) + _prev.jpg (번호 붙인 미리보기)
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from up1_seg import alpha_of

def smooth(v, k=15):
    if k < 2: return v
    ker = np.ones(k) / k; return np.convolve(v, ker, mode='same')

def guesses(profile, n_cuts, lo, hi, minsep):
    """고르게 나눈 자리 (lo..hi 를 n_cuts+1 칸) 근처 ± 1/4 칸 안에서 가장 낮은 골짜기"""
    p = smooth(profile, 21); n = n_cuts + 1; cw = (hi - lo) / n; out = []
    for k in range(1, n):
        g = lo + cw * k; a = int(max(lo, g - cw * 0.28)); b = int(min(hi, g + cw * 0.28)) + 1
        out.append(a + int(np.argmin(p[a:b])))
    return out

def guesses_old(profile, n_cuts, lo, hi, minsep):
    """profile 의 골짜기 중 n_cuts 개 (서로 minsep 이상 떨어진, 가장 낮은 것부터) — lo..hi 안에서"""
    p = smooth(profile, 21); idx = []
    for x in range(lo + 1, hi - 1):
        if p[x] <= p[x - 1] and p[x] <= p[x + 1]: idx.append(x)
    idx.sort(key=lambda x: (p[x], abs(x - (lo + hi) / 2)))
    out = []
    for x in idx:
        if all(abs(x - y) >= minsep for y in out) and x - lo >= minsep * 0.5 and hi - x >= minsep * 0.5: out.append(x)
        if len(out) == n_cuts: break
    if len(out) < n_cuts:   # 모자라면 고르게
        step = (hi - lo) / (n_cuts + 1); out = [int(lo + step * (i + 1)) for i in range(n_cuts)]
    return sorted(out)

def seam(cost, guess, win, lam=0.004, step=2):
    """세로 이음선: cost (H, W) 에서 위→아래로, 각 줄 x 를 돌려줌. guess ± win 안에서만"""
    H, W = cost.shape; x0 = max(0, guess - win); x1 = min(W, guess + win + 1)
    c = cost[:, x0:x1] + lam * np.abs(np.arange(x0, x1) - guess)[None, :]
    acc = c[0].copy(); back = np.zeros((H, x1 - x0), np.int16)
    for y in range(1, H):
        best = acc.copy(); arg = np.zeros_like(acc, dtype=np.int16)
        for d in range(-step, step + 1):
            if d == 0: continue
            sh = np.full_like(acc, np.inf)
            if d > 0: sh[d:] = acc[:-d] + 0.15 * abs(d)
            else: sh[:d] = acc[-d:] + 0.15 * abs(d)
            better = sh < best; best[better] = sh[better]; arg[better] = d
        acc = best + c[y]; back[y] = arg
    xs = np.zeros(H, np.int32); x = int(np.argmin(acc)); xs[H - 1] = x
    for y in range(H - 1, 0, -1): x = x - back[y, x]; xs[y - 1] = x
    return xs + x0

ERODE = 2
# v1.6 겹친 곳 손보기: 시트 좌표 상자 안에서 색 규칙에 맞는 픽셀을 다른 칸 주인에게 (겹쳐 그려진 남의 창 · 꼬리)
#  warm = 창 자루 · 창날 · 붉은 술 (파랑이 가장 약함) · orange = 꼬마악마 주황
RULES = {'warm': lambda c: (c[..., 2].astype(int) < c[..., 1].astype(int) + 10) & (c[..., 0].astype(int) > c[..., 2].astype(int) + 15),
         'spear': lambda c: RULES['warm'](c) | ((c.max(-1).astype(int) - c.min(-1).astype(int) < 34) & (c.max(-1) > 110)),
         'all': lambda c: np.ones(c.shape[:2], bool),
         'orange': lambda c: (c[..., 0] > 150) & (c[..., 2] < 90) & (c[..., 0].astype(int) - c[..., 2].astype(int) > 100)}
OVR = {'바닥에 누운 열 명의 무장 인원': [{'box': [1430, 350, 1610, 396], 'to': [0, 3], 'rule': 'spear'}, {'box': [1430, 372, 1612, 402], 'to': [0, 3], 'rule': 'all'}, {'box': [292, 625, 318, 660], 'to': [1, 0], 'rule': 'orange'}],
       '열 전사의 개성 넘치는 휴식 자세': [{'box': [300, 740, 380, 805], 'to': [1, 0], 'rule': 'orange'}]}
def cut_sheet(a, rows, name, outdir, keep_frac=0.05, near=30):
    H, W = a.shape[:2]; m = (a[..., 3] > 24).astype(np.float32)
    os.makedirs(outdir, exist_ok=True)
    # 1) 줄 나누기 (가로 이음선)
    ys = np.where(m.sum(1) > 0)[0]; top, bot = (ys.min(), ys.max() + 1) if len(ys) else (0, H)
    rcuts = guesses(m.sum(1), len(rows) - 1, top, bot, (bot - top) / len(rows) * 0.55) if len(rows) > 1 else []
    hseams = []
    for g in rcuts:
        win = int((bot - top) / len(rows) * 0.22)
        hseams.append(seam(m.T * 100 + 1, g, win))   # 가로 이음선 = 뒤집어서 세로 이음선
    bounds = [np.full(W, 0)] + hseams + [np.full(W, H)]
    info = []; prev = Image.new('RGB', (W, H), (150, 150, 150)); rgba = Image.fromarray(a); prev.paste(rgba, (0, 0), rgba); dr = ImageDraw.Draw(prev)
    for s in hseams: dr.line(list(zip(range(W), s)), fill=(0, 200, 255), width=3)
    yy = np.arange(H)[:, None]; xx = np.arange(W)[None, :]; hits = []
    cellmap = np.full((H, W), -1, np.int32); cells = []
    for r, n in enumerate(rows):
        band = (yy >= bounds[r][None, :]) & (yy < bounds[r + 1][None, :])
        bm = m * band
        xs_ = np.where(bm.sum(0) > 0)[0]
        if not len(xs_): continue
        lo, hi = xs_.min(), xs_.max() + 1
        cuts = guesses(bm.sum(0), n - 1, lo, hi, (hi - lo) / n * 0.45) if n > 1 else []
        vseams = [seam(bm * 100 + 1, g, int((hi - lo) / n * 0.3)) for g in cuts]
        for ci_, s_ in enumerate(vseams): hits.append({'r': r, 'between': [ci_, ci_ + 1], 'n': int(sum(bm[y, min(W - 1, int(s_[y]))] > 0 for y in range(H))), 'x': int(np.median(s_))})
        for s_ in vseams: dr.line([(int(s_[y]), y) for y in range(H) if band[y, min(W - 1, int(s_[y]))]], fill=(255, 60, 60), width=3)
        lefts = [np.zeros(H, np.int32)] + vseams; rights = vseams + [np.full(H, W)]
        for c in range(n):
            cm = band & (xx >= lefts[c][:, None]) & (xx < rights[c][:, None])
            cellmap[cm] = len(cells); cells.append((r, c))
    # 덩어리 단위로 주인 정하기 (v1.4): 큰 덩어리 (전체의 1.5% 넘음) 는 한 칸에 88% 넘게 있으면 통째로, 아니면 (붙은 인물들) 이음선대로 나눔.
    #  작은 덩어리 (떨어진 칼날 · 창끝 · 화살 · 조각) 는 가장 가까운 '이미 주인 있는' 그림의 주인에게 — 옆 칸으로 넘어가도 원래 주인에게 감
    mm0 = m > 0; mm = ndimage.binary_erosion(mm0, structure=np.ones((3, 3)), iterations=ERODE) if ERODE else mm0   # v1.5 가는 다리 (살짝 닿은 창끝 · 꼬리) 끊고 나서 덩어리를 셈
    lab, k = ndimage.label(mm, structure=np.ones((3, 3)))
    owner = np.full((H, W), -1, np.int32); NC = len(cells); splits = []
    objs = ndimage.find_objects(lab); big_lim = max(3000, mm.sum() * 0.015)
    for i in range(1, k + 1):
        sl = objs[i - 1]; comp = lab[sl] == i; n_ = comp.sum()
        if n_ < big_lim: continue
        cm = cellmap[sl][comp]; cnt = np.bincount(cm[cm >= 0], minlength=NC); o = owner[sl]
        if cnt.max() >= 0.88 * n_: o[comp] = int(np.argmax(cnt))
        else:
            o[comp] = cellmap[sl][comp]; top2 = np.argsort(cnt)[::-1][:3]
            splits.append({'box': [sl[1].start, sl[0].start, sl[1].stop, sl[0].stop], 'cells': [[*cells[c_], int(cnt[c_])] for c_ in top2 if cnt[c_] > 0]})
    big = owner >= 0
    if big.any() and (mm & ~big).any():
        _, (iy, ix) = ndimage.distance_transform_edt(~big, return_indices=True)
        for i in range(1, k + 1):   # 작은 덩어리는 통째로: 덩어리에서 가장 가까운 주인 있는 칸
            sl = objs[i - 1]; comp = (lab[sl] == i) & ~big[sl]
            if not comp.any(): continue
            ys, xs = np.where(comp); ys = ys + sl[0].start; xs = xs + sl[1].start
            d = (iy[ys, xs] - ys) ** 2 + (ix[ys, xs] - xs) ** 2; j = int(np.argmin(d))
            owner[ys, xs] = owner[iy[ys[j], xs[j]], ix[ys[j], xs[j]]]
    if ERODE:
        got = owner >= 0; lost = mm0 & ~got
        if got.any() and lost.any():
            _, (iy, ix) = ndimage.distance_transform_edt(~got, return_indices=True); owner[lost] = owner[iy[lost], ix[lost]]
    for o in OVR.get(os.path.splitext(name)[0], []):   # v1.6
        x0_, y0_, x1_, y1_ = o['box']; ci = cells.index(tuple(o['to'])) if tuple(o['to']) in cells else None
        if ci is None: continue
        sub = a[y0_:y1_, x0_:x1_]; hit = RULES[o['rule']](sub[..., :3]) & (sub[..., 3] > 24)
        owner[y0_:y1_, x0_:x1_][hit] = ci; print('  손봄', o, int(hit.sum()))
    soft_all = (a[..., 3] > 0)
    for ci, (r, c) in enumerate(cells):
        keep = owner == ci
        if keep.sum() < 300: continue
        soft = ndimage.binary_dilation(keep, iterations=2) & soft_all & ((owner == ci) | (owner < 0))
        yx = np.where(soft); y0, y1, x0, x1 = yx[0].min(), yx[0].max() + 1, yx[1].min(), yx[1].max() + 1
        out = np.zeros((y1 - y0, x1 - x0, 4), np.uint8); sub = a[y0:y1, x0:x1]; msk = soft[y0:y1, x0:x1]
        out[msk] = sub[msk]
        fn = f'r{r}c{c}.png'; Image.fromarray(out).save(os.path.join(outdir, fn))
        al = out[..., 3] > 60; hh = al.shape[0]; band6 = al[int(hh * 0.94):]
        cols = np.where(band6.any(0))[0]; fx = int((cols.min() + cols.max()) / 2) if len(cols) else (x1 - x0) // 2
        info.append({'f': fn, 'r': r, 'c': c, 'box': [int(x0), int(y0), int(x1), int(y1)], 'w': int(x1 - x0), 'h': int(y1 - y0), 'foot': [fx, hh - 1], 'area': int(keep.sum())})
        dr.rectangle([x0, y0, x1, y1], outline=(255, 230, 0), width=2); dr.text((x0 + 4, y0 + 2), f'r{r}c{c}', fill=(255, 255, 0))
    json.dump({'sheet': name, 'W': W, 'H': H, 'rows': rows, 'cells': info, 'seamhits': hits, 'splits': splits}, open(os.path.join(outdir, '_info.json'), 'w'), ensure_ascii=False, indent=0)
    k = min(1, 1200 / W); prev.resize((int(W * k), int(H * k))).save(os.path.join(outdir, '_prev.jpg'), quality=80)
    return info

if __name__ == '__main__':
    R, O, spec = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3]))
    only = sys.argv[4:]
    for f, rows in spec.items():
        if only and not any(o in f for o in only): continue
        im = Image.open(os.path.join(R, f)); a = alpha_of(im)
        stem = os.path.splitext(f)[0]
        info = cut_sheet(a, rows, f, os.path.join(O, stem))
        print(f, rows, '→', len(info), [ (c['w'], c['h']) for c in info ][:12])
