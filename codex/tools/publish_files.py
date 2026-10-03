# publish_files.py v1.0 — 게시할 때 빠뜨리지 않게: 묶음 (pack/*)과 묶이지 않은 그림을 모두 적은 files 목록 (JSON)을 찍음
import json, os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cat = json.loads(open(f'{R}/catalog.js').read().split('const CATALOG = ', 1)[1].strip().rstrip(';'))
packed = set(json.loads(re.search(r'const PACKED = (\{.*\});', open(f'{R}/packs.js').read()).group(1)))
files = {'catalog.js': 'catalog.js', 'packs.js': 'packs.js'}
for f in sorted(os.listdir(f'{R}/pack')): files['pack/' + f] = 'pack/' + f
for e in cat:
    s = e['src']
    if s in packed: continue
    files[s] = s.replace('a/', '../cave-game/assets/', 1) if s.startswith('a/') else s
print(json.dumps(files, ensure_ascii=False))
