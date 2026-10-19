# d5sheet.py v1.0 — 드라이브 그림 검토용 모아 보기 (묶음별 · 한 장에 12 · 번호와 이름)
import os, re, json
from PIL import Image, ImageDraw, ImageFont
S = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = ImageFont.truetype('/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc', 15)
rows = [l.rstrip('\n').split('\t') for l in open(S + 'drive5_list_v1.tsv') if not l.startswith('#')][1:]
idx = {}
for l in open(S + 'd5/idx.tsv'): i, t = l.rstrip('\n').split('\t'); idx[i] = t
have = set(os.listdir(S + 'd5/raw'))
items = []
for r in rows:
    if not r[2].startswith('image'): continue
    t = idx.get(r[0]) or re.sub(r'[\\/:*?"<>|]', '_', r[1]).strip()
    if t not in have: t = None
    fold = r[5]; nm = r[1]
    cat = {'/F맵 층': 'F', '/스테이지,인카운터': 'S', '/대화벨': 'B'}.get(fold) or ('M' if nm.startswith('M') else 'T' if nm.startswith('S') else 'O')
    items.append({'id': r[0], 'name': nm, 'file': t, 'cat': cat, 'folder': fold})
cats = {'F': 'F맵층', 'S': '스테이지인카운터', 'B': '대화벨', 'M': '루트M맵', 'T': '루트S스테이지', 'O': '루트기타'}
out = []
for c in cats:
    L = [x for x in items if x['cat'] == c]; L.sort(key=lambda x: x['name'])
    for k, x in enumerate(L): x['no'] = f'{c}{k+1:02d}'
    for p in range(0, len(L), 12):
        page = L[p:p+12]; W, H = 4 * 330, 3 * 300
        im = Image.new('RGB', (W, H), (30, 30, 34)); d = ImageDraw.Draw(im)
        for j, x in enumerate(page):
            ox, oy = (j % 4) * 330, (j // 4) * 300
            if x['file']:
                pv = S + 'd5/pv/' + x['file'].rsplit('.', 1)[0] + '.jpg'
                try:
                    t = Image.open(pv); t.thumbnail((320, 250)); im.paste(t, (ox + 5 + (320 - t.width) // 2, oy + 5))
                except Exception as e: d.text((ox + 10, oy + 100), 'ERR', fill=(255, 0, 0), font=F)
            d.text((ox + 6, oy + 258), x['no'] + ' ' + x['name'][:24], fill=(255, 230, 120), font=F)
            d.text((ox + 6, oy + 277), x['name'][24:50], fill=(200, 200, 200), font=F)
        fn = f'd5/sheets/{c}_{p//12+1:02d}.jpg'; im.save(S + fn, quality=72); out.append(fn)
json.dump(items, open(S + 'd5/items.json', 'w'), ensure_ascii=False, indent=0)
print(len(items), {c: sum(1 for x in items if x['cat'] == c) for c in cats}); print(' '.join(out))
