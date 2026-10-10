# publish_files.py v1.2 — 게시할 때 빠뜨리지 않게: 묶음 (pack/*)과 묶이지 않은 그림을 모두 적은 files 목록 (JSON)을 찍음
#  · v1.2 (2026-10-10): 정리 후보 cands.js (tools/cands.py) 도 넣음
#  · v1.1 (2026-10-10): 자산 보관함에 있는 그림 (blobs.json — 움짤 · hi 원본) 은 판에 넣지 않음 (tools/blobs.py)
import json, os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cat = json.loads(open(f'{R}/catalog.js').read().split('const CATALOG = ', 1)[1].strip().rstrip(';'))
packed = set(json.loads(re.search(r'const PACKED = (\{.*\});', open(f'{R}/packs.js').read()).group(1)))
blobs = set(json.load(open(f'{R}/blobs.json', encoding='utf-8'))) if os.path.exists(f'{R}/blobs.json') else set()
files = {'catalog.js': 'catalog.js', 'packs.js': 'packs.js', 'hipacks.js': 'hipacks.js', 'blobs.js': 'blobs.js', 'cands.js': 'cands.js'}
for f in sorted(os.listdir(f'{R}/pack')): files['pack/' + f] = 'pack/' + f
for e in cat:
    s = e['src']
    if s in packed or s in blobs: continue
    files[s] = s.replace('a/', '../cave-game/assets/', 1) if s.startswith('a/') else s
print(json.dumps(files, ensure_ascii=False))
