# d5use.py v1.0 — 드라이브 그림 (d5/raw) 이 판 그림 (build/art) 에 실제로 들어갔는지 픽셀로 맞대 봄 (24×24 회색 · 가로세로 비 · 평균 차) → d5/use.tsv
import os, sys, json
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)) + '/../'
def sig(p):
    im = Image.open(p).convert('L'); w, h = im.size
    return w / h, list(im.resize((24, 24)).get_flattened_data())
art = {}
for r, _, fs in os.walk(D + 'build/art'):
    for f in fs:
        if f.endswith('.webp'):
            p = os.path.join(r, f)
            try: art[os.path.relpath(p, D + 'build/art')] = sig(p)
            except Exception as e: print('bad', p, e)
items = json.load(open(D + 'd5/items.json'))
out = []
for x in items:
    p = D + 'd5/raw/' + x['file'] if x['file'] and os.path.exists(D + 'd5/raw/' + x['file']) else None
    if not p: out.append((x['no'], '', 999)); continue
    ar, v = sig(p); best = ('', 999)
    for k, (ar2, v2) in art.items():
        if abs(ar - ar2) > 0.06 * ar: continue
        d = sum(abs(a - b) for a, b in zip(v, v2)) / len(v)
        if d < best[1]: best = (k, d)
    out.append((x['no'], best[0], round(best[1], 1)))
with open(D + 'd5/use.tsv', 'w', encoding='utf-8') as f:
    for no, k, d in sorted(out): f.write(f'{no}\t{k}\t{d}\n')
print('use', sum(1 for o in out if o[2] < 12), '/', len(out))
