# mapchk.py v1.0 — 그림 맵 하나 칸 지도 확인: d5/fix/<제목>.txt 로 mapgrid 를 돌려 d5/grid/<제목>.json · _ov.jpg (들어서는 곳 초록 · 나가는 칸 파랑 표시) 를 만들고
#   in 바닥 7칸 이상 · out 이 바닥 · in → out 이 이어졌는지 · 바닥 비율을 알려 줌.  쓰기: python3 -I tools/mapchk.py "<제목>" [문턱]
import os, sys, json, subprocess
from collections import deque
from PIL import Image, ImageDraw
D = os.path.dirname(os.path.abspath(__file__)) + '/../'
t = sys.argv[1]; thr = sys.argv[2] if len(sys.argv) > 2 else '0.5'
src = D + 'd5/raw/' + t + '.png'; fx = D + 'd5/fix/' + t + '.txt'
meta = {}
if os.path.exists(fx):
    for ln in open(fx, encoding='utf-8'):
        ln = ln.split('#!')[0].strip()
        if '=' in ln and ln.split('=')[0].strip() in ('id', 'name', 'tag', 'in', 'out', 'amb', 'nx'): k, v = ln.split('=', 1); meta[k.strip()] = v.strip()
W, H = Image.open(src).size; NX = int(meta.get('nx') or round(W / 45))
args = ['python3', '-I', D + 'tools/mapgrid.py', src, str(NX), D + 'd5/grid/' + t + '.json', D + 'd5/grid/' + t + '_ov.jpg', thr] + ([fx] if os.path.exists(fx) else [])
subprocess.run(args, check=True, capture_output=True)
g = json.load(open(D + 'd5/grid/' + t + '.json')); rows = g['rows']; NY = g['NY']
rg = lambda s: [int(v) for v in s.split('-')] if '-' in s else [int(s), int(s)]
bad = []
inn = None
if meta.get('in'):
    xs, ys = meta['in'].split(','); x0, x1 = rg(xs); y0, y1 = rg(ys); inn = (x0, y0, x1, y1)
    cells = [(x, y) for y in range(y0, y1 + 1) for x in range(x0, x1 + 1) if 0 <= y < NY and 0 <= x < NX and rows[y][x] == '.']
    if len(cells) < 7: bad.append(f'in 바닥 {len(cells)}칸 (7 이상)')
else: bad.append('in 없음'); cells = []
out = [int(v) for v in meta['out'].split(',')] if meta.get('out') else None
if not out: bad.append('out 없음')
elif not (0 <= out[0] < NX and 0 <= out[1] < NY) or rows[out[1]][out[0]] != '.': bad.append('out 이 바닥이 아님')
if cells and out:
    seen = set(cells); q = deque(cells)
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            p = (x + dx, y + dy)
            if 0 <= p[0] < NX and 0 <= p[1] < NY and p not in seen and rows[p[1]][p[0]] in '.r':
                if rows[p[1]][p[0]] == '.': seen.add(p); q.append(p)
    if tuple(out) not in seen: bad.append('in 에서 out 으로 길이 없음')
    reach = len(seen)
else: reach = 0
fl = sum(r.count('.') for r in rows)
for k in ('id', 'name', 'tag', 'amb'):
    if k not in meta: bad.append(k + ' 없음')
# 겹쳐 보기에 in · out 표시
ov = Image.open(D + 'd5/grid/' + t + '_ov.jpg').convert('RGB'); s = ov.size[0] / NX; d = ImageDraw.Draw(ov)
if inn: d.rectangle([inn[0] * s, inn[1] * s, (inn[2] + 1) * s, (inn[3] + 1) * s], outline=(0, 255, 0), width=3)
if out: d.rectangle([out[0] * s, out[1] * s, (out[0] + 1) * s, (out[1] + 1) * s], fill=(0, 120, 255))
ov.save(D + 'd5/grid/' + t + '_ov.jpg', quality=82)
print(f'{t}  {NX}x{NY}  바닥 {fl} ({fl * 100 // (NX * NY)}%)  in 에서 닿는 바닥 {reach}  ' + ('OK' if not bad else '!! ' + ' · '.join(bad)))
