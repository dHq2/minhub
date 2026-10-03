# apply_marks.py v1.0 — 판을 새로 낼 때: 도감 저장소 marks (ArtifactData list → out_dir)를 읽어 catalog에 반영
#  · 등장 확정 (status in): 누른 순서 (inAt, 없으면 at)대로 pin = 1, 2, … → 분류마다 맨 위 '★ 등장 확정'. on = true
#  · 미등장으로 돌린 것 (status out): pin을 뺌
# 사용: python3 codex/tools/apply_marks.py <marks json 폴더>
import json, os, sys, re
P = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'catalog.js')
d = sys.argv[1]
marks = {f[:-5]: json.load(open(os.path.join(d, f))) for f in os.listdir(d) if f.endswith('.json')}
src = open(P).read(); head, body = src.split('const CATALOG = ', 1); cat = json.loads(body.strip().rstrip(';'))
ins = sorted([(m.get('inAt') or m.get('at') or '', i) for i, m in marks.items() if m.get('status') == 'in'])
order = {i: n + 1 for n, (_, i) in enumerate(ins)}
ch = 0
for e in cat:
    m = marks.get(e['id'], {})
    if e['id'] in order:
        if e.get('pin') != order[e['id']] or not e['on']: ch += 1
        e['pin'] = order[e['id']]; e['on'] = True
    elif e.get('pin') and m.get('status') == 'out':
        e.pop('pin'); e['on'] = False; ch += 1
open(P, 'w').write(head + 'const CATALOG = [\n' + ",\n".join(json.dumps(o, ensure_ascii=False, indent=0) for o in cat) + "\n];\n")
print('등장 확정', len(order), '· 바뀐 항목', ch)
