# polyfix.py v1.3 (v1.3: fall 낙사 맵 · v1.2: 칸 번호를 그림 안으로 · v1.1: cells 손 고침) · v1.0 — 그림 맵 칸 지도를 다각형으로 그림: d5/poly/<제목>.json (그림 픽셀 좌표) → d5/fix/<제목>.txt (maps8.py 가 읽는 고침 글) · d5/raw/<제목>.png (원본에서 crop 하면 잘라 둠)
#   spec: { id, name, tag, nx, amb, z, src (원본 그림 제목), crop [x0,y0,x1,y1] (선택), floor [[(x,y)..]..], block [..] (# 높은 막힘), cover [..] (r 낮은 엄폐), in [x0,y0,x1,y1] (픽셀 상자), out [x,y] (픽셀) }
#   칸 판정: 바닥 = floor 다각형에 칸의 절반 이상 · block = 칸의 0.3 이상 · cover = 바닥 칸 중 0.3 이상
#   쓰기: python3 -I tools/polyfix.py <제목> [<제목> ...]  (그 뒤 tools/mapchk.py "<제목>" 로 확인)
import os, sys, json
import numpy as np
from PIL import Image, ImageDraw
D = os.path.dirname(os.path.abspath(__file__)) + '/../'
for t in sys.argv[1:]:
    S = json.load(open(D + 'd5/poly/' + t + '.json', encoding='utf-8'))
    src = Image.open(D + 'd5/raw/' + S.get('src', t) + '.png').convert('RGB')
    cx0, cy0, cx1, cy1 = S.get('crop') or [0, 0, src.size[0], src.size[1]]
    im = src.crop((cx0, cy0, cx1, cy1)); W, H = im.size; im.save(D + 'd5/raw/' + t + '.png')
    NX = S['nx']; cs = W / NX; NY = int(round(H / cs))
    def mask(polys):
        m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
        for p in polys: d.polygon([(x - cx0, y - cy0) for x, y in p], fill=255)
        return np.asarray(m, dtype=np.float32) / 255.0
    def frac(m):
        out = np.zeros((NY, NX))
        for y in range(NY):
            for x in range(NX): out[y, x] = m[int(y * cs):int(min(H, (y + 1) * cs)), int(x * cs):int(min(W, (x + 1) * cs))].mean() if int(y * cs) < H else 0
        return out
    fl = frac(mask(S['floor'])); bl = frac(mask(S.get('block', []))) if S.get('block') else np.zeros((NY, NX)); cv = frac(mask(S.get('cover', []))) if S.get('cover') else np.zeros((NY, NX))
    g = [['#'] * NX for _ in range(NY)]
    for y in range(NY):
        for x in range(NX):
            if fl[y, x] >= S.get('fl', 0.5): g[y][x] = '.'
            if g[y][x] == '.' and bl[y, x] >= S.get('bl', 0.3): g[y][x] = '#'
            elif g[y][x] == '.' and cv[y, x] >= S.get('cv', 0.3): g[y][x] = 'r'
    for ch, L2 in (S.get('cells') or {}).items():   # 손으로 칸 고침: {'.': [[x,y]..]} (자른 그림이면 자른 쪽 칸 번호)
        for x, y in L2:
            if 0 <= x < NX and 0 <= y < NY: g[y][x] = ch
    cell = lambda px, py: (min(NX - 1, max(0, int((px - cx0) // cs))), min(NY - 1, max(0, int((py - cy0) // cs))))   # v1.2 가장자리 밖은 안으로
    L = [f'#! {S["name"]} — polyfix v1.0 (다각형으로 그린 칸 지도)', f'0-{NX - 1},0-{NY - 1}=#']
    for y in range(NY):
        x = 0
        while x < NX:
            c = g[y][x]
            if c == '#': x += 1; continue
            x1 = x
            while x1 + 1 < NX and g[y][x1 + 1] == c: x1 += 1
            L.append(f'{x}-{x1},{y}={c}'); x = x1 + 1
    ix0, iy0 = cell(S['in'][0], S['in'][1]); ix1, iy1 = cell(S['in'][2], S['in'][3]); ox, oy = cell(*S['out'])
    L += [f'id={S["id"]}', f'name={S["name"]}', f'tag={S.get("tag", "ruin")}', f'in={ix0}-{ix1},{iy0}-{iy1}', f'out={ox},{oy}', f'amb={S["amb"]}', f'nx={NX}'] + (['fall=1'] if S.get('fall') else [])
    open(D + 'd5/fix/' + t + '.txt', 'w', encoding='utf-8').write('\n'.join(L) + '\n')
    print(t, f'{NX}x{NY} cs={cs:.1f} 바닥', sum(r.count('.') for r in g), 'r', sum(r.count('r') for r in g))
