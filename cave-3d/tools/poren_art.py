# poren_art.py v1.2 — 2D 판 '야광 포렌' 움직임 13종 (codex/img/foren/*_v2.webp, 동작마다 10~14장) → 3D 판 묶음 그림
#  · 동작마다 모든 장의 겹친 상자로 자르고 같은 배율 (서 있는 키 380px) 로 줄임 → 그 동작의 칸들을 격자로 한 덩어리
#  · 덩어리들을 큰 묶음 그림 (art/poren/poren<N>.webp, 4096 폭) 에 차곡차곡 → src/poren_sheets.js (동작 → rect · 칸 수 · 격자 · 발 위치)
#  · 얼굴: foren_idle_color.webp 머리 → art/poren/face.webp (128)
#  게시 파일 수 한도 (511) 때문에 묶음은 2장 이하로
#  v1.2: 발 위치를 몸 무게중심 x · 넓은 줄 맨 아래로 (동작 검토: 칼끝 밑에 서던 문제)
#  v1.1: 4장 → 2장. 배율을 300px 부터 줄여 가며 2장 안에 들 때까지 다시 쌓음
import os, json, math
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); SRC = os.path.join(os.path.dirname(ROOT), 'codex', 'img', 'foren')
OUT = os.path.join(ROOT, 'art', 'poren'); os.makedirs(OUT, exist_ok=True)
POSES = ['idle', 'block', 'slash_diag', 'spin_slash', 'bigslash', 'dash_thrust', 'dash_spin', 'slam', 'ground', 'burst', 'command', 'command2', 'order']
SHEET_W, SHEET_H = 4096, 4096
RAW = {}
for p in POSES:
    im = Image.open(os.path.join(SRC, f'foren_{p}_v2.webp')); fr = []
    for i in range(im.n_frames): im.seek(i); fr.append(im.convert('RGBA'))
    RAW[p] = fr
def build(K):
    blocks = []
    for p in POSES:
        frames = RAW[p]; n = len(frames)
        bb = None
        for f in frames:
            b = f.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
            if b: bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
        fw, fh = math.ceil((bb[2] - bb[0]) * K), math.ceil((bb[3] - bb[1]) * K)
        # 발 위치 (v1.2): x = 첫 장 불투명 몸 전체의 x 중앙값 (칼끝 · 베기 궤적에 끌려가지 않게), y = 폭이 넓은 (가장 넓은 줄의 15% 넘는) 줄 중 맨 아래 (꽂은 칼끝은 건너뜀)
        f0 = frames[0].crop(bb).resize((fw, fh), Image.LANCZOS); A = np.array(f0.getchannel('A')) > 120
        ys, xs = np.nonzero(A); ax = int(np.median(xs)) if len(xs) else fw // 2
        rw = A.sum(1); wide = np.nonzero(rw > rw.max() * 0.15)[0]; ay = int(wide.max()) if len(wide) else fh - 3
        cols = max(1, min(n, SHEET_W // fw)); rows = math.ceil(n / cols)
        blk = Image.new('RGBA', (cols * fw, rows * fh), (0, 0, 0, 0))
        for i, f in enumerate(frames): blk.paste(f.crop(bb).resize((fw, fh), Image.LANCZOS), ((i % cols) * fw, (i // cols) * fh))
        blocks.append({'p': p, 'img': blk, 'n': n, 'cols': cols, 'rows': rows, 'fw': fw, 'fh': fh, 'ax': ax, 'ay': ay})
    # 선반 쌓기 (높은 것부터)
    sheets, meta = [], {}
    for b in sorted(blocks, key=lambda b: -b['img'].height):
        placed = False
        for S in sheets:
            for sh in S['shelves']:
                if sh['h'] >= b['img'].height and sh['x'] + b['img'].width <= SHEET_W:
                    b['at'] = (S['i'], sh['x'], sh['y']); sh['x'] += b['img'].width; placed = True; break
            if not placed and S['y'] + b['img'].height <= SHEET_H:
                S['shelves'].append({'y': S['y'], 'h': b['img'].height, 'x': b['img'].width}); b['at'] = (S['i'], 0, S['y']); S['y'] += b['img'].height; placed = True
            if placed: break
        if not placed:
            S = {'i': len(sheets), 'y': b['img'].height, 'shelves': [{'y': 0, 'h': b['img'].height, 'x': b['img'].width}]}; sheets.append(S); b['at'] = (S['i'], 0, 0)
    return blocks, sheets
for TALL in range(300, 180, -10):
    K = TALL / 800; blocks, sheets = build(K)
    if len(sheets) <= 2: break
print('K', TALL, '/800')
meta = {}
for S in sheets:
    H = max(sh['y'] + sh['h'] for sh in S['shelves']); H = 1 << (H - 1).bit_length()
    canvas = Image.new('RGBA', (SHEET_W, H), (0, 0, 0, 0)); S['H'] = H
    for b in blocks:
        if b['at'][0] == S['i']: canvas.paste(b['img'], (b['at'][1], b['at'][2]))
    canvas.save(os.path.join(OUT, f"poren{S['i']}.webp"), 'WEBP', quality=86, method=4)
for b in blocks:
    i, x, y = b['at']; H = sheets[i]['H']
    meta[b['p']] = {'src': f'art/poren/poren{i}.webp', 'rect': [x, y, b['img'].width, b['img'].height, SHEET_W, H], 'n': b['n'], 'cols': b['cols'], 'rows': b['rows'], 'w': b['fw'], 'h': b['fh'], 'ax': b['ax'], 'ay': b['ay']}
# 얼굴
c = Image.open(os.path.join(SRC, 'foren_idle_color.webp')).convert('RGBA'); W, H = c.size
c.crop((int(W * 0.30), int(H * 0.02), int(W * 0.30) + int(W * 0.36), int(H * 0.02) + int(W * 0.36))).resize((128, 128), Image.LANCZOS).save(os.path.join(OUT, 'face.webp'), 'WEBP', quality=88)
js = '/* poren_sheets.js — tools/poren_art.py가 만듦. 손으로 고치지 않음. 포렌 동작 → 묶음 그림 칸 (rect) · 장 수 · 격자 · 발 위치 */\n\'use strict\';\nconst POREN_SHEETS = ' + json.dumps(meta, ensure_ascii=False) + ';\n'
open(os.path.join(ROOT, 'src', 'poren_sheets.js'), 'w', encoding='utf-8').write(js)
print(len(sheets), 'sheets', [(S['i'], S['H']) for S in sheets]); [print(p, m['n'], m['w'], m['h'], m['cols'], m['rows'], m['rect'][:4]) for p, m in meta.items()]
