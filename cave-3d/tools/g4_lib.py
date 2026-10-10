# g4_lib.py v1.0 (2026-10-10) — 4기 동작 도구 (g4_moves.py) 의 공용 함수: 칸 읽기 · 키 맞춤 · 움짤 프레임 · 발 맞춘 띠 · 묶음 · 미리보기
#  · 키 맞춤: 그 인물의 '서 있는 키' (대기 그림 테두리 높이) 를 기준으로, 시트마다 기준 칸 (걷기 · 서 있음 · 맞음 …) 의 키 비율 RATIO 로 배율을 정함 (h2_moves.py 와 같은 방식)
#  · 움짤 (webp 여러 장): fix = 그린 자리 그대로 (발은 기준 장 하나로) · track = 몸 가운데를 따라 창을 옮겨 자름 (가로로 날아가는 돌진 · 투창 — 게임에서 몸이 실제로 움직임)
import os, json
import numpy as np
from PIL import Image, ImageSequence, ImageDraw, ImageFont
from scipy import ndimage
PAD = 6; MAXW = 2048; MAXH = 2048
RATIO = {'idle': 1.0, 'ready': 0.95, 'walk': 0.98, 'walkB': 0.98, 'walk2': 0.98, 'run2': 0.9, 'stance': 0.97, 'run': 0.9, 'hurt': 0.92, 'hurt2': 0.9, 'stun': 0.88, 'guard': 0.94, 'taunt': 0.98, 'shoot': 0.95, 'cast': 0.97, 'heal': 0.97, 'stand': 1.0, 'idle2': 1.0}
PLAY = {'walk': dict(fps=7), 'walkB': dict(fps=5), 'walk2': dict(fps=6), 'run': dict(fps=10), 'idle': dict(fps=6), 'ready': dict(fps=6), 'fly': dict(fps=6),
        'dead': dict(fps=4, once=1, flat=1), 'down': dict(flat=1), 'heal': dict(fps=4), 'sit': dict(fps=3)}
ONCE = dict(fps=9, once=1)

def alpha_bbox(im, thr=40):
    a = np.asarray(im)[..., 3] > thr; ys = np.where(a.any(1))[0]; xs = np.where(a.any(0))[0]
    return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1) if len(xs) else (0, 0, im.width, im.height)
def crop(im, thr=24):
    return im.crop(alpha_bbox(im, thr))
def foot(im):
    """발 가로 자리: 아래 8% 띠의 불투명 칸 가운데"""
    a = np.asarray(im)[..., 3] > 60; h = a.shape[0]; band = a[int(h * 0.92):]
    cols = np.where(band.any(0))[0]
    return int((cols.min() + cols.max()) / 2) if len(cols) else im.width // 2
def cell(C4, sheet, c):
    fold, stem = sheet.split('/', 1)
    return Image.open(os.path.join(C4, fold, stem, c + '.png')).convert('RGBA')
def body_h(im):
    x0, y0, x1, y1 = alpha_bbox(im); return y1 - y0
def resize(im, s):
    if abs(s - 1) < 1e-3: return im
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)

def strip(frames, fix=None):
    """같은 크기 칸에 발 (아래 가운데) 을 맞춰 줄 세움 (가로 2048 넘으면 여러 줄 격자). fix = (발 x, 발 y) 면 모든 장을 그 자리로 (움짤)"""
    if fix: fx = [fix[0]] * len(frames)
    else: fx = [foot(f) for f in frames]
    ax = max(fx); cw = max(ax - x + f.width for f, x in zip(frames, fx)) + 2 * PAD
    if fix: ch = max(f.height for f in frames) + 2 * PAD
    else: ch = max(f.height for f in frames) + 2 * PAD
    ax += PAD; n = len(frames); cols = max(1, min(n, int(MAXW * 0.98 // cw))); rows = -(-n // cols)
    S = Image.new('RGBA', (cw * cols, ch * rows), (0, 0, 0, 0))
    for i, (f, x) in enumerate(zip(frames, fx)):
        r, c = divmod(i, cols)
        y = r * ch + (PAD if fix else ch - PAD - f.height)
        S.paste(f, (c * cw + ax - x, y), f)
    ay = (PAD + fix[1]) if fix else ch - PAD - 1
    return S, cw, ch, ax, ay, cols, rows

def anim_frames(path, idx=None, step=1):
    im = Image.open(path); fr = []
    for i, f in enumerate(ImageSequence.Iterator(im)):
        fr.append(f.convert('RGBA').copy())
    if idx is None: idx = list(range(0, len(fr), step))
    out = []
    for i in idx:
        f = fr[min(i, len(fr) - 1)]; a = np.asarray(f).copy(); a[a[..., 3] < 40] = 0; out.append(Image.fromarray(a))
    return out, len(fr)

def body_box(im, thr_col=0.22, thr_row=0.12):
    """몸통 테두리: 불투명 칸이 많은 열 · 줄만 (가는 창 · 효과선은 빠짐)"""
    a = np.asarray(im)[..., 3] > 60
    if not a.any(): return (0, 0, im.width, im.height)
    cs = a.sum(0); rs = a.sum(1)
    cols = np.where(cs > cs.max() * thr_col)[0]; rows = np.where(rs > rs.max() * thr_row)[0]
    return (int(cols.min()), int(rows.min()), int(cols.max()) + 1, int(rows.max()) + 1)
def body_cx(im):
    a = np.asarray(im)[..., 3] > 60; cs = a.sum(0).astype(float)
    if cs.max() <= 0: return im.width / 2
    w = np.where(cs > cs.max() * 0.3, cs, 0); return float((w * np.arange(len(cs))).sum() / max(1, w.sum()))

def shelf(items, W):
    x = y = rowh = 0; pos = {}
    for k, w, h in items:
        if x + w > W: x = 0; y += rowh + PAD; rowh = 0
        pos[k] = (x, y); x += w + PAD; rowh = max(rowh, h)
    return pos, y + rowh
def pack(strips, outdir, name, quality=86):
    """strips: {동작: (그림, …)} → 묶음 한 장 (넘치면 _2 …). 돌려줌: {동작: (src, x, y, PW, PH)}, [(파일, PW, PH)]"""
    items = sorted(((n, v[0].width, v[0].height) for n, v in strips.items()), key=lambda t: -t[2])
    W = min(MAXW, max(int((sum(w * h for _, w, h in items) * 1.15) ** 0.5), max(w for _, w, _ in items)))
    pos, H = shelf(items, W)
    if H > MAXH:
        W = MAXW; pos = {}; x = y = rowh = 0; pg = 0
        for n, w, h in items:
            if x + w > W: x = 0; y += rowh + PAD; rowh = 0
            if y + h > MAXH and (x > 0 or y > 0): pg += 1; x = y = rowh = 0
            pos[n] = (x, y, pg); x += w + PAD; rowh = max(rowh, h)
    else: pos = {n: (x, y, 0) for n, (x, y) in pos.items()}
    out = {}; files = []
    os.makedirs(outdir, exist_ok=True)
    for pg in sorted({v[2] for v in pos.values()}):
        mine = [(n, w, h) for n, w, h in items if pos[n][2] == pg]
        PW = max(pos[n][0] + w for n, w, h in mine); PH = max(pos[n][1] + h for n, w, h in mine)
        sheet = Image.new('RGBA', (PW, PH), (0, 0, 0, 0)); fn = name + ('' if pg == 0 else f'_{pg + 1}')
        for n, w, h in mine: sheet.paste(strips[n][0], pos[n][:2])
        sheet.save(os.path.join(outdir, fn + '.webp'), 'WEBP', quality=quality, method=4); files.append((fn, PW, PH))
        for n, w, h in mine: out[n] = (fn, pos[n][0], pos[n][1], PW, PH)
    return out, files

FONT = None
def font():
    global FONT
    if FONT is None:
        p = '/usr/share/fonts/opentype/unifont/unifont.otf'
        FONT = ImageFont.truetype(p, 16) if os.path.exists(p) else ImageFont.load_default()
    return FONT
def preview(rows, out, title='', std=None):
    """rows: [(이름, [장 …], 덧말)] → 동작마다 한 줄. std (서 있는 키 px) 를 주면 모든 줄을 같은 배율로 (서 있는 키 = 150px) — 크기 비교용"""
    H = 170; lines = []
    g = (150.0 / std) if std else None
    for row in rows:
        nm, frs, note = row[:3]; mm = row[3] if len(row) > 3 else 1.0
        ims = []
        for f in frs[:14]:
            k = g * mm if g else min(1.0, (H - 10) / max(1, f.height))
            if f.height * k > 330: k = 330 / f.height
            gimg = resize(f, k); hh = max(H, gimg.height + 8); bg = Image.new('RGBA', (gimg.width + 4, hh), (118, 118, 124, 255)); bg.alpha_composite(gimg, (2, hh - 4 - gimg.height)); ims.append(bg)
        RH = max([i.height for i in ims] + [H])
        W = 230 + sum(i.width + 3 for i in ims); R = Image.new('RGB', (max(W, 400), RH + 4), (30, 30, 34)); d = ImageDraw.Draw(R)
        d.text((4, 4), nm, fill=(255, 255, 120), font=font()); d.text((4, 24), note[:26], fill=(170, 220, 255), font=font()); d.text((4, 44), note[26:52], fill=(170, 220, 255), font=font())
        x = 230
        for i in ims: R.paste(i.convert('RGB'), (x, 2 + RH - i.height)); x += i.width + 3
        if g: d.line([(230, 2 + RH - 4), (R.width, 2 + RH - 4)], fill=(255, 80, 80), width=1); d.line([(230, 2 + RH - 4 - 150), (R.width, 2 + RH - 4 - 150)], fill=(80, 200, 255), width=1)
        lines.append(R)
    if not lines: return
    # 여러 단: 줄들을 세로로 쌓다가 높이가 넘치면 옆 단으로 (거의 정사각 판)
    tot = sum(l.height for l in lines); colw = max(l.width for l in lines); ncol = max(1, min(4, int(round((tot / max(1, colw)) ** 0.5))))
    lim = tot / ncol + 200; cols = [[]]; hh = 0
    for l in lines:
        if hh + l.height > lim and cols[-1]: cols.append([]); hh = 0
        cols[-1].append(l); hh += l.height
    Wc = [max(l.width for l in c) for c in cols]; Ht = max(sum(l.height for l in c) for c in cols) + 30
    C = Image.new('RGB', (min(4000, sum(Wc) + 10 * len(cols)), Ht), (20, 20, 22)); d = ImageDraw.Draw(C); d.text((6, 6), title, fill=(255, 255, 255), font=font()); x = 0
    for c, w in zip(cols, Wc):
        y = 28
        for l in c: C.paste(l, (x, y)); y += l.height
        x += w + 10
    C.save(out, quality=80)
