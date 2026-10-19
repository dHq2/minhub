# cards8.py v1.0 — 도감의 인카운터 카드 · 그림 · 조우 장면 카드 (꾸러미) → build/art/card/<id>.webp + d5/cards.json (id · 묶음 · 이름 · 글)
import os, re, json
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)) + '/../'; G = D + 'dogam_new/'
c = open(G + 'catalog.js', encoding='utf-8').read(); p = open(G + 'packs.js', encoding='utf-8').read()
PACKS = json.loads(re.search(r'const PACKS = (\[.*?\]);', p, re.S).group(1)); PACKED = json.loads(re.search(r'const PACKED = (\{.*?\});', p, re.S).group(1))
os.makedirs(D + 'build/art/card', exist_ok=True); out = []
for m in re.finditer(r'\{"id":"[^{}]*\}', c):
    try: o = json.loads(m.group(0))
    except Exception: continue
    if o.get('cat') != 'scene' or not str(o.get('sub', '')).startswith('인카운터') or o.get('src') not in PACKED: continue
    n, X, Y, W, H = PACKED[o['src']]
    if not os.path.exists(G + PACKS[n]): continue
    im = Image.open(G + PACKS[n]).crop((X, Y, X + W, Y + H)).convert('RGB'); s = 900 / max(im.size)
    if s < 1: im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    im.save(D + f"build/art/card/{o['id']}.webp", 'WEBP', quality=80)
    note = o.get('note') or ''; txt = note.split('글:', 1)[1].strip() if '글:' in note else ''
    out.append({'id': o['id'], 'sub': o['sub'], 'name': o['name'], 'txt': txt[:400], 'w': W, 'h': H})
json.dump(out, open(D + 'd5/cards.json', 'w'), ensure_ascii=False)
import collections; print('cards8', len(out), collections.Counter(x['sub'] for x in out), 'with text', sum(1 for x in out if x['txt']))
