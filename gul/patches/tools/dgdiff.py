# dgdiff.py v1.0 — 도감 marks 두 덤프 비교: 인물 (cspec 있는 칸) 의 새 칸 · 바뀐 칸 · 글 길이 + 인물 이름 (catalog cid)
import json, glob, os, re, sys
old, new = sys.argv[1], sys.argv[2]
def load(d):
    o = {}
    for f in glob.glob(d + '/marks/*.json'):
        j = json.load(open(f)); o[os.path.basename(f)[:-5]] = j.get('data', j)
    return o
A, B = load(old), load(new)
cat = open('dogam_dl2/catalog.js', encoding='utf-8').read()
names = {}
for m in re.finditer(r'"cid":\s*"(C-\d+)"[^{}]*?"name":\s*"([^"]+)"|"name":\s*"([^"]+)"[^{}]*?"cid":\s*"(C-\d+)"', cat):
    cid = m.group(1) or m.group(4); nm = m.group(2) or m.group(3)
    if cid and cid not in names: names[cid] = nm.split(' · ')[0]
rows = []
for k, v in sorted(B.items()):
    if not v.get('cspec') and not k.startswith('C-'): continue
    a = A.get(k, {}); cs, ca = v.get('cspec', '') or '', a.get('cspec', '') or ''
    st = 'NEW' if k not in A else ('CHG' if cs != ca else '')
    fld = [f for f in ('name', 'role', 'tier', 'recruit', 'group', 'status') if v.get(f) != a.get(f)]
    rows.append((k, v.get('name') or names.get(k, ''), v.get('role', ''), v.get('tier', ''), v.get('recruit', ''), v.get('status', ''), len(cs), len(cs) - len(ca), st, ','.join(fld)))
for r in rows: print('\t'.join(map(str, r)))
