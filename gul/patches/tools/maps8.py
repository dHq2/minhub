# maps8.py v1.2 (v1.2: ring= (x0-x1,y0-y1 → [x0,y0,x1,y1]) · fall=1 (떨어지는 옥상) 읽음 · v1.1: 들어서는 곳은 바닥이 6칸 넘으면 됨) · v1.0 — 그림 맵 등록: d5/fix/<제목>.txt (칸 고침 + id= · name= · tag= · in= · out= · amb= · nx=) → 칸 지도 다시 만들고 (mapgrid) · 그림을 build/art/maps/<id>.webp 로 · 목록 d5/maps8.json
#   in = 들어서는 곳 (x0-x1,y0-y1) · out = 나가는 계단 (x,y) · amb = 밝기 (0 ~ 1) · tag = 생태 · nx = 가로 칸 수 (없으면 그림 가로 / 45)
import os, json, subprocess, sys
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)) + '/../'
R = D + 'd5/raw/'; F = D + 'd5/fix/'; G = D + 'd5/grid/'; A = D + 'build/art/maps/'
os.makedirs(A, exist_ok=True)
out = {}
for fn in sorted(os.listdir(F)):
    if not fn.endswith('.txt'): continue
    key = fn[:-4]; meta = {}
    for ln in open(F + fn, encoding='utf-8'):
        ln = ln.split('#!')[0].strip()
        if '=' in ln and ln.split('=')[0].strip() in ('id', 'name', 'tag', 'in', 'out', 'amb', 'nx', 'ring', 'fall'): k, v = ln.split('=', 1); meta[k.strip()] = v.strip()
    if 'id' not in meta: continue
    src = R + key + '.png'
    if not os.path.exists(src): print('no image', key); continue
    W, H = Image.open(src).size; NX = int(meta.get('nx') or round(W / 45))
    subprocess.run(['python3', '-I', D + 'tools/mapgrid.py', src, str(NX), G + key + '.json', G + key + '_ov.jpg', '2', F + fn], check=True, capture_output=True)
    g = json.load(open(G + key + '.json'))
    rg = lambda s: [int(v) for v in s.split('-')] if '-' in s else [int(s), int(s)]
    i0 = meta.get('in', ''); o0 = meta.get('out', '')
    inn = None
    if i0: xs, ys = i0.split(','); x0, x1 = rg(xs); y0, y1 = rg(ys); inn = [x0, y0, x1, y1]
    oo = [int(v) for v in o0.split(',')] if o0 else None
    rr = None
    if meta.get('ring'): xs, ys = meta['ring'].split(','); x0, x1 = rg(xs); y0, y1 = rg(ys); rr = [x0, y0, x1, y1]
    dst = A + meta['id'] + '.webp'
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src): Image.open(src).convert('RGB').save(dst, 'WEBP', quality=80, method=6)
    out[meta['id']] = {'name': meta.get('name', key), 'tag': meta.get('tag', ''), 'src': 'art/maps/' + meta['id'] + '.webp', 'pw': W, 'ph': H, 'NX': g['NX'], 'NY': g['NY'], 'cs': round(g['cs'], 4), 'rows': g['rows'], 'in': inn, 'out': oo, 'amb': float(meta.get('amb', 0.7))}
    if rr: out[meta['id']]['ring'] = rr
    if meta.get('fall') in ('1', 'true'): out[meta['id']]['fall'] = True
    bad = []
    if inn and sum(1 for y in range(inn[1], inn[3] + 1) for x in range(inn[0], inn[2] + 1) if 0 <= y < g['NY'] and 0 <= x < g['NX'] and g['rows'][y][x] == '.') < 7: bad.append('in 의 바닥이 모자람')
    if oo and g['rows'][oo[1]][oo[0]] != '.': bad.append('out 이 막힌 칸')
    print(meta['id'], key, g['NX'], g['NY'], 'floor', sum(r.count('.') for r in g['rows']), '!!' + ' · '.join(bad) if bad else '')
json.dump(out, open(D + 'd5/maps8.json', 'w'), ensure_ascii=False)
print('maps8', len(out), 'webp KB', sum(os.path.getsize(A + f) for f in os.listdir(A)) // 1024)
