# props.py v1.1 (v1.1: 칸 순서가 다른 줄도 읽음 (3기 전장 설비) · 메모 120자) · v1.0 — 도감 (굴의 도감 artifact) 의 소품 · 유물 · 장비 · 타일 목록을 뽑아 d5/props.json 으로 (id · 묶음 · 이름 · 꾸러미 위치) + 꾸러미에서 낱장을 잘라 build/art/prop/<id>.webp 로 (쓰는 것만: python3 -I tools/props.py cut id1 id2 …)
#   목록만: python3 -I tools/props.py  · 한눈에 보기: python3 -I tools/props.py sheet <묶음 글자> <결과.jpg>
import os, re, json, sys
from PIL import Image, ImageDraw
D = os.path.dirname(os.path.abspath(__file__)) + '/../'; G = D + 'dogam_new/'
c = open(G + 'catalog.js', encoding='utf-8').read(); p = open(G + 'packs.js', encoding='utf-8').read()
PACKS = json.loads(re.search(r'const PACKS = (\[.*?\]);', p, re.S).group(1))
PACKED = json.loads(re.search(r'const PACKED = (\{.*?\});', p, re.S).group(1))
items = []
for m in re.finditer(r'\{"id":"[^{}]*\}', c):
    try: o = json.loads(m.group(0))
    except Exception: continue
    if o.get('cat') in ('prop', 'relic', 'equip', 'item', 'tile') and o.get('src') in PACKED:
        items.append({'id': o['id'], 'cat': o['cat'], 'sub': o.get('sub', ''), 'name': o.get('name', ''), 'src': o['src'], 'on': o.get('on', True), 'note': o.get('note', '')[:120], 'pk': PACKED[o['src']]})
json.dump(items, open(D + 'd5/props.json', 'w'), ensure_ascii=False)
def cut(i):
    x = next(t for t in items if t['id'] == i); n, X, Y, W, H = x['pk']
    im = Image.open(G + PACKS[n]).crop((X, Y, X + W, Y + H)); os.makedirs(D + 'build/art/prop', exist_ok=True)
    im.save(D + f'build/art/prop/{i}.webp', 'WEBP', quality=86); return im
if len(sys.argv) > 2 and sys.argv[1] == 'cut':
    for i in sys.argv[2:]: cut(i)
    print('cut', len(sys.argv) - 2)
elif len(sys.argv) > 3 and sys.argv[1] == 'sheet':
    L = [t for t in items if sys.argv[2] in t['sub'] or sys.argv[2] == t['cat']]
    cols = 8; w = 170; S = Image.new('RGB', (cols * w, ((len(L) + cols - 1) // cols) * (w + 26)), (40, 44, 50)); d = ImageDraw.Draw(S)
    for k, t in enumerate(L):
        n, X, Y, W, H = t['pk']; im = Image.open(G + PACKS[n]).crop((X, Y, X + W, Y + H)).convert('RGBA'); im.thumbnail((w - 6, w - 6))
        x0, y0 = (k % cols) * w, (k // cols) * (w + 26); S.paste(im, (x0 + 3, y0 + 3), im); d.text((x0 + 3, y0 + w - 2), t['id'] + ' ' + t['name'][:12], fill=(255, 240, 160))
    S.save(sys.argv[3], quality=78); print(len(L))
else:
    import collections
    print(len(items), collections.Counter(t['cat'] for t in items))
