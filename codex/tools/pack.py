# pack.py v1.3 (karius 칸 추가) · v1.2 (inju 칸 추가) · v1.1 (item 칸 추가) — 작은 그림을 묶음 그림 (pack/*.webp)으로 합치고 packs.js에 자리를 적음.
# 게시 파일 수 한도 (511) 때문. 움직이는 그림은 묶지 않음. 실행: python3 codex/tools/pack.py
import os, json
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIRS = ['relic', 'equip', 'card', 'skill', 'tile', 'prop', 'face', 'npc', 'item', 'inju', 'karius']   # v1.2: inju (3D 인주 동작) · v1.3: karius (3D 카리우스 새 그림)
W, HMAX, PAD = 2048, 4096, 2
os.makedirs(f'{ROOT}/pack', exist_ok=True)
for f in os.listdir(f'{ROOT}/pack'): os.remove(f'{ROOT}/pack/{f}')
packs, where = [], {}
for d in DIRS:
    files = sorted(f for f in os.listdir(f'{ROOT}/img/{d}') if f.endswith('.webp'))
    ims = [(f, Image.open(f'{ROOT}/img/{d}/{f}').convert('RGBA')) for f in files]
    sheet, n = [], 0
    def flush():
        global n
        if not sheet: return
        h = max(y + im.height for _, im, x, y in sheet)
        S = Image.new('RGBA', (W, h), (0, 0, 0, 0))
        name = f'pack/{d}{n}.webp'
        for f, im, x, y in sheet:
            S.paste(im, (x, y)); where[f'img/{d}/{f}'] = [len(packs), x, y, im.width, im.height]
        S.save(f'{ROOT}/{name}', 'WEBP', quality=90, method=6); packs.append(name); sheet.clear(); n += 1
    x = y = rowh = 0
    for f, im in ims:
        if x + im.width > W: x, y, rowh = 0, y + rowh + PAD, 0
        if y + im.height > HMAX: flush(); x = y = rowh = 0
        sheet.append((f, im, x, y)); x += im.width + PAD; rowh = max(rowh, im.height)
    flush()
with open(f'{ROOT}/packs.js', 'w') as o:
    o.write('/* packs.js — pack.py가 만듦. 손으로 고치지 않음. 그림 경로 → [묶음 번호, x, y, 너비, 높이] */\n')
    o.write('const PACKS = ' + json.dumps(packs) + ';\nconst PACKED = ' + json.dumps(where, separators=(',', ':')) + ';\n')
print(len(packs), 'packs,', len(where), 'images')
