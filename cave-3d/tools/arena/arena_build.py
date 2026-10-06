# build_page.py v1.1 — (v1.1: 결과 폴더를 인자로 · 92명 · 3기-2 표시) v1.0 — 투기장 결과 (arena.json + r1~r4.json) → 티어표 페이지 (page/arena.html)
import json, base64, os
import sys
H0 = os.path.dirname(os.path.abspath(__file__)); H = sys.argv[1] if len(sys.argv) > 1 else H0
a = json.load(open(f'{H}/arena.json'))
legs = []
for i in range(1, 5): legs += json.load(open(f'{H}/r{i}.json'))['res']
FIX = {'garam2': '가람 (망토 갑옷)', 'hirari2': '히라리 (변신)', 'ahae2': '아해 (각성)', 'slra2': '슬라 (전투)'}
nm = dict(a['names']); nm.update(FIX)
rows = a['rows']
for r in rows:
    r['name'] = nm.get(r['slug'], r['name'])
    for k in ('best', 'worst'):
        pass
# best/worst 는 이름만 들어 있음 → 같은 이름 둘 (가람 · 히라리) 은 matrix 로 다시 계산
M = a['matrix']; order = a['order']
def ps(x, y):
    k = f'{x}|{y}' if f'{x}|{y}' in M else None
    if k: return M[k]
    k2 = f'{y}|{x}'
    return -M[k2] if k2 in M else None
for r in rows:
    sc = [(o, ps(r['slug'], o)) for o in order if o != r['slug']]
    sc = [(o, v) for o, v in sc if v is not None]
    sc.sort(key=lambda t: -t[1])
    r['best'] = [[o, v] for o, v in sc[:3]]; r['worst'] = [[o, v] for o, v in sc[::-1][:3]]
def tier(v):
    for t, lo in (('S+', 1.2), ('S', 1.0), ('A', 0.5), ('B', 0.0), ('C', -0.6), ('D', -1.0)):
        if v >= lo: return t
    return 'F'
def bracket(r):
    if r['boss']: return '보스급'
    s = r['rankstr']
    if s[:1].isdigit(): return '성급 동료'
    return '강적 · 기타'
rk = {r['slug']: r['rank'] for r in rows}
for r in rows: r['tier'] = tier(r['avg']); r['br'] = bracket(r)
# 재미 기록
ko = [l for l in legs if l.get('ko') and l.get('w') in rk]
fast = sorted([l for l in ko if 'ratsmall' not in (l['A'], l['B'])], key=lambda l: l['t'])[:5]   # 일반 쥐 (체력 10) 는 빼고
ups = sorted([l for l in ko if rk[l['w']] - rk[l['B'] if l['w'] == l['A'] else l['A']] >= 30],
             key=lambda l: -(rk[l['w']] - rk[l['B'] if l['w'] == l['A'] else l['A']]))
upl = []
for l in ups[:6]:
    lo = l['B'] if l['w'] == l['A'] else l['A']
    upl.append({'w': l['w'], 'l': lo, 'gap': rk[l['w']] - rk[lo], 't': round(l['t'], 1)})
flaw = {}
for l in ko:
    hp = l['a'] if l['w'] == l['A'] else l['b']
    if hp >= 0.999: flaw[l['w']] = flaw.get(l['w'], 0) + 1
dmgleg = max(legs, key=lambda l: max(l['dmg']['a'], l['dmg']['b']))
dd = 'a' if dmgleg['dmg']['a'] >= dmgleg['dmg']['b'] else 'b'
draws = sorted(rows, key=lambda r: -(r['legs'] - r['ko'] - (r['lw'] if False else 0)))
to = {}
for l in legs:
    if not l.get('ko'):
        for s in (l['A'], l['B']): to[s] = to.get(s, 0) + 1
casts = max(rows, key=lambda r: r['casts'])
fun = {
  'fast': [{'w': l['w'], 'l': l['B'] if l['w'] == l['A'] else l['A'], 't': round(l['t'], 1)} for l in fast],
  'ups': upl,
  'flaw': sorted(flaw.items(), key=lambda t: -t[1])[:5],
  'dmg': {'who': dmgleg['A'] if dd == 'a' else dmgleg['B'], 'vs': dmgleg['B'] if dd == 'a' else dmgleg['A'], 'v': dmgleg['dmg'][dd]},
  'to': sorted(to.items(), key=lambda t: -t[1])[:5],
  'casts': [casts['slug'], casts['casts']],
  'side': {'ally': sum(1 for l in legs if l.get('w') == l['A']), 'enemy': sum(1 for l in legs if l.get('w') == l['B']), 'n': len(legs), 'ko': len(ko)},
}
F = json.load(open('/dev/stdin')) if False else None
faces = base64.b64encode(open('/home/user/minhub/cave-3d/art/h2/atlas/faces.webp', 'rb').read()).decode()
src = open('/home/user/minhub/cave-3d/src/h2_atlas.js', encoding='utf-8').read()
A = json.loads(src[src.index('const H2A = ') + 12:].strip().rstrip(';'))
fi = A['faces']
keep = ['slug','name','rank','gen','batch','boss','hp','atk','avg','pw','pd','pl','lw','legs','ko','kot','dmg','casts','allyw','enw','best','worst','rankstr','role','sk','pas','phase','tier','br']
data = {'rows': [{k: r[k] for k in keep} for r in rows], 'M': M, 'order': order, 'fun': fun, 'fi': fi['i'], 'cols': fi['cols'], 'frows': fi['rows']}
html = open(f'{H0}/tpl.html', encoding='utf-8').read().replace('/*DATA*/', 'const D=' + json.dumps(data, ensure_ascii=False) + ';').replace('FACES_B64', faces)
open(f'{H0}/page/arena.html', 'w', encoding='utf-8').write(html)
from collections import Counter
print(Counter(r['tier'] for r in rows), Counter(r['br'] for r in rows), len(html))
print(json.dumps(fun, ensure_ascii=False))
