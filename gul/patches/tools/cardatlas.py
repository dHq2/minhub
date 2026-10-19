# cardatlas.py v1.0 — 도감 조우 카드 212장 (build/art/card/<id>.webp) 을 몇 장의 묶음 그림으로 (artifact 파일 수 한도 511) → build/art/card/atlas<n>.webp + d5/cardatlas.json (id → [묶음, x, y, w, h, 묶음 너비, 묶음 높이])
import os, json
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)) + '/../'; C = D + 'build/art/card/'
ids = sorted(f[:-5] for f in os.listdir(C) if f.endswith('.webp') and not f.startswith('atlas'))
PW, PH, out, pages = 3600, 3600, {}, []
cur, x, y, rowh = None, 0, 0, 0
def newpage():
    global cur, x, y, rowh
    cur = Image.new('RGB', (PW, PH), (0, 0, 0)); pages.append(cur); x = y = rowh = 0
newpage()
for i in ids:
    im = Image.open(C + i + '.webp').convert('RGB'); w, h = im.size
    if x + w > PW: x = 0; y += rowh; rowh = 0
    if y + h > PH: newpage()
    cur.paste(im, (x, y)); out[i] = [len(pages) - 1, x, y, w, h]; x += w; rowh = max(rowh, h)
for n, p in enumerate(pages):
    used = max([v[2] + v[4] for v in out.values() if v[0] == n]); p = p.crop((0, 0, PW, used)); pages[n] = p
    p.save(C + f'atlas{n}.webp', 'WEBP', quality=80)
for v in out.values(): v += [PW, pages[v[0]].size[1]]
json.dump(out, open(D + 'd5/cardatlas.json', 'w'))
print('cardatlas', len(ids), 'cards →', len(pages), 'pages', sum(os.path.getsize(C + f'atlas{n}.webp') for n in range(len(pages))) // 1024 // 1024, 'MB')
