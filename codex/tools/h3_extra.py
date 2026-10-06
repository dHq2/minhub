# h3_extra.py v1.0 — 3기 1차의 덧붙임 그림을 도감에 넣음 (h2_poses.py 다음에 실행, 그다음 pack.py · hipack.py)
#  · 추가팩션 (cave-3d/art/h3f): 인물 시트 7장 → 8 인물 '팩션 NPC' 묶음 7개 (X-h3f-<팩션>-nn, 묶음 g = X-h3f-<팩션>, 새 인물 번호)
#                              장비 · 설비 시트 7장 → 11 가구 · 소품 '3기 전장 설비 · <이름>' (P3-<시트>-nn)
#  · 추가 스프라이트 (cave-3d/art/h3x): 이미 도감에 있는 인물 (codex_g · codex_cid)의 새 그림 → 그 인물 묶음 끝에 (O-h3x-<slug>-<동작>)
#    도감에 없는 인물은 새 묶음 (g = h3x_<slug>)
#  · 이미 있으면 이름 · 설명만 고침 (체크 · 메모는 id에 붙어 그대로)
import os, json, re
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); C3 = os.path.join(os.path.dirname(ROOT), 'cave-3d')
P = os.path.join(ROOT, 'catalog.js'); s = open(P, encoding='utf-8').read(); key = 'const CATALOG = '
head = s[:s.index(key) + len(key)]; cat = json.loads(s[len(head):].strip().rstrip(';'))
mine = lambda e: e['id'].startswith(('X-h3f-', 'P3-', 'O-h3x-', 'F-h3x-'))
old = {e['id']: e for e in cat if mine(e)}; cat = [e for e in cat if not mine(e)]
used = {int(e['cid'][2:]) for e in cat if e.get('cid', '').startswith('C-')}
cidOf = {e['g']: e['cid'] for e in old.values() if e.get('cid')}
nxt = max(used | {int(c[2:]) for c in cidOf.values()}) + 1
def newcid(g):
    global nxt
    if g not in cidOf: cidOf[g] = f'C-{nxt:03d}'; nxt += 1
    return cidOf[g]
def put(src, dst, h=300, maxside=None):
    im = Image.open(os.path.join(C3, src)).convert('RGBA')
    if maxside: k = min(1, maxside / max(im.size))
    else: k = min(1, h / im.height)
    if k < 1: im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True); im.save(dst, 'WEBP', quality=86, method=4)
def ent(id_, **kw):
    e = dict(old.get(id_, {})); keep = {k: e[k] for k in ('on',) if k in e}
    e.update({'id': id_, 'rank': '', **kw}); e.update(keep); return e
chars, props, extra = [], [], {}
# 추가팩션
F = os.path.join(C3, 'art', 'h3f', 'notes')
for p in sorted(os.listdir(F)) if os.path.isdir(F) else []:
    if not p.endswith('.json'): continue
    o = json.load(open(os.path.join(F, p), encoding='utf-8')); slug = o['slug']
    for it in o['items']:
        nn = f"{it['n']:02d}"
        if o['kind'] == 'faction':
            g = f'X-h3f-{slug}'; dst = f'img/npc/h3f_{slug}_{nn}.webp'; put(it['src'], os.path.join(ROOT, dst), h=360)
            chars.append(ent(f'X-h3f-{slug}-{nn}', cat='char', sub=f"{o['name']} · 팩션 NPC · 원화", cid=newcid(g), g=g, name=it['name'], src=dst,
                note=f"3기 추가팩션 · {o['title']} #{nn} (2026-10-06). {it.get('desc', '')} · 역할 {it.get('role', '-')}", on=False))
        else:
            dst = f'img/prop/h3f_{slug}_{nn}.webp'; put(it['src'], os.path.join(ROOT, dst), maxside=300)
            props.append(ent(f'P3-{slug}-{nn}', cat='prop', sub=f"3기 전장 설비 · {o['name']}", name=it['name'], src=dst,
                note=f"3기 추가팩션 · {o['title']} #{nn} (2026-10-06). {it.get('desc', '')} · 쓰임 {it.get('role', '-')}", on=False, pk=o['name']))
# 추가 스프라이트
X = os.path.join(C3, 'art', 'h3x', 'notes')
for p in sorted(os.listdir(X)) if os.path.isdir(X) else []:
    if not p.endswith('.json'): continue
    o = json.load(open(os.path.join(X, p), encoding='utf-8')); slug = o['slug']
    g = o.get('codex_g'); base = next((e for e in cat if g and e.get('g') == g), None)
    if base: sub, cid = base['sub'], base.get('cid')
    else: g = f'h3x_{slug}'; cid = newcid(g); sub = f"{o.get('name', slug)} · 역할 미정 · 동작 그림"
    for k, v in (o.get('poses') or {}).items():
        dst = f'img/h3x/{slug}__{k}.webp'
        if not os.path.exists(os.path.join(C3, v['src'])): continue
        put(v['src'], os.path.join(ROOT, dst))
        extra.setdefault(g, []).append(ent(f'O-h3x-{slug}-{k}', cat='char', sub=sub, cid=cid, g=g, name=f"{o.get('name', slug)} · {v.get('orig') or k}", src=dst,
            note=f"3기 추가 스프라이트 · {v.get('from', '')} (2026-10-06)" + (f" · 게임: {o['game_kind']}" if o.get('game_kind') else ''), on=False))
# 넣기: 팩션 · 새 인물 묶음은 인물 칸 끝, 덧붙임은 그 인물 묶음 끝, 설비는 소품 칸 끝
for g, es in extra.items():
    idx = [i for i, e in enumerate(cat) if e.get('g') == g]
    if idx: cat[idx[-1] + 1:idx[-1] + 1] = es
    else: chars.extend(es)
at = max(i for i, e in enumerate(cat) if e['cat'] == 'char') + 1; cat[at:at] = chars
at = max(i for i, e in enumerate(cat) if e['cat'] == 'prop') + 1; cat[at:at] = props
if 'v1.83:' not in head: head = head.replace('/* catalog.js v1.82 — ', '/* catalog.js v1.83 — v1.83: 3기 1차 — 3기 인물 (tools/h2_poses.py v1.1) · 추가팩션 인물 7묶음 · 전장 설비 7묶음 · 추가 스프라이트 (tools/h3_extra.py). v1.82: ', 1)
open(P, 'w', encoding='utf-8').write(head + json.dumps(cat, ensure_ascii=False, indent=0) + ';\n')
print('faction chars', len(chars), 'props', len(props), 'extra', sum(len(v) for v in extra.values()), 'total', len(cat))
