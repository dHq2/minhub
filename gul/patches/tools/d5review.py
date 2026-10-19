# d5review.py v1.0 — 드라이브 5기 그림 249장 검토 표: d5/items.json (이름 · 묶음) + d5/notes.tsv (무엇) + d5/plan.tsv (판에 들어간 정도 · 넣을 곳) → asset_review_v1.md (docs) + d5/asset_review_v1.html (썸네일 붙은 페이지)
import os, json, io, base64, html
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)) + '/../'
VER = 'v1.0'
items = json.load(open(D + 'd5/items.json'))
def tsv(p):
    o = {}
    for ln in open(D + p, encoding='utf-8'):
        if ln.startswith('#') or not ln.strip(): continue
        r = ln.rstrip('\n').split('\t'); o[r[0]] = r[1:]
    return o
notes, plan = tsv('d5/notes.tsv'), tsv('d5/plan.tsv')
def key(no): return 'B01-B18' if no.startswith('B') else no
CAT = [('F', '층 맵 (F맵 층 폴더)'), ('S', '스테이지 · 인카운터'), ('B', '대화 — 벨'), ('M', '맵 (M)'), ('T', '스테이지 맵 (S)'), ('O', '기타 — 인물 · 유물 · 맵 (루트)')]
ST = {'in': '들어감', 'part': '글만 있음', 'no': '없음', 'miss': '못 받음'}
rows = sorted(items, key=lambda x: ('FSBMTO'.index(x['cat']), x['no']))
cnt = {k: 0 for k in ST}
for x in rows: cnt[plan[key(x['no'])][0]] += 1
assert sum(cnt.values()) == 249, cnt
for x in rows: assert key(x['no']) in notes and key(x['no']) in plan, x['no']
def title(x): return (x['name'] or '').rsplit('.', 1)[0] or x['no']
# ── md
L = [f'# 드라이브 5기 그림 검토 표 {VER}', '', f'(2026-10-19 · {VER}: 249장 전수 — 무엇인지 · 메모 · 판에 들어갔는지 (그림을 판 그림과 픽셀로 맞대 봄 · d5/use.tsv) · 넣을 곳 제안)', '',
     f'합계: 들어감 {cnt["in"]} · 글만 있음 {cnt["part"]} (사건 · 인물 · 유물은 판에 있으나 이 그림은 안 붙음) · 없음 {cnt["no"]} · 못 받음 {cnt["miss"]}', '']
for c, nm in CAT:
    L += [f'## {nm}', '', '| 번호 | 파일 이름 | 무엇 | 쓰임 · 메모 | 판 | 지금 | 넣을 곳 |', '|---|---|---|---|---|---|---|']
    seenB = False
    for x in rows:
        if x['cat'] != c: continue
        k = key(x['no'])
        if k == 'B01-B18':
            if seenB: continue
            seenB = True; fn = '벨 18장'
        else: fn = title(x)
        n, p = notes[k], plan[k]
        L.append('| ' + ' | '.join(s.replace('|', '/') for s in [k, fn, n[0], n[1] if len(n) > 1 else '', ST[p[0]], p[1], p[2]]) + ' |')
    L.append('')
open(D + 'asset_review_v1.md', 'w', encoding='utf-8').write('\n'.join(L))
# ── html
def thumb(x):
    if not x['file']: return ''
    pv = D + 'd5/pv/' + x['file'].rsplit('.', 1)[0] + '.jpg'
    if not os.path.exists(pv): return ''
    im = Image.open(pv).convert('RGB'); im.thumbnail((260, 200)); b = io.BytesIO(); im.save(b, 'JPEG', quality=62)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
E = html.escape
cards = {c: [] for c, _ in CAT}
bell = []
for x in rows:
    k = key(x['no'])
    if k == 'B01-B18': bell.append((x, thumb(x))); continue
    n, p = notes[k], plan[k]
    cards[x['cat']].append(f'<article class="card" data-st="{p[0]}"><div class="ph">' + (f'<img src="{thumb(x)}" alt="{E(title(x))}" loading="lazy">' if x['file'] else '<span class="nopic">그림 없음</span>') +
        f'</div><div class="bd"><div class="hd"><span class="no">{k}</span><span class="pill {p[0]}">{ST[p[0]]}</span></div><h3>{E(title(x))}</h3><p class="what">{E(n[0])}</p>' +
        (f'<p class="memo">{E(n[1])}</p>' if len(n) > 1 and n[1] else '') + f'<dl><dt>지금</dt><dd>{E(p[1])}</dd><dt>넣을 곳</dt><dd>{E(p[2])}</dd></dl></div></article>')
if bell:
    n, p = notes['B01-B18'], plan['B01-B18']
    cards['B'].append(f'<article class="card wide" data-st="{p[0]}"><div class="strip">' + ''.join(f'<img src="{t}" alt="벨 {x["no"]}" loading="lazy">' for x, t in bell) +
        f'</div><div class="bd"><div class="hd"><span class="no">B01–B18</span><span class="pill {p[0]}">{ST[p[0]]}</span></div><h3>벨 대화 표정 18장</h3><p class="what">{E(n[0])}</p><p class="memo">{E(n[1])}</p><dl><dt>지금</dt><dd>{E(p[1])}</dd><dt>넣을 곳</dt><dd>{E(p[2])}</dd></dl></div></article>')
cn = {c: sum(1 for x in rows if x['cat'] == c) for c, _ in CAT}
tpl = open(D + 'tools/d5review.tpl.html', encoding='utf-8').read()
sec = ''.join(f'<section id="s{c}"><h2>{E(nm)} <span class="ct">{cn[c]}장</span></h2><div class="grid">{"".join(cards[c])}</div></section>' for c, nm in CAT)
nav = ''.join(f'<a href="#s{c}">{E(nm.split(" (")[0].split(" — ")[0])} <b>{cn[c]}</b></a>' for c, nm in CAT)
out = tpl.replace('%VER%', VER).replace('%NAV%', nav).replace('%SECTIONS%', sec)
for k in ST: out = out.replace(f'%N_{k}%', str(cnt[k]))
open(D + 'd5/asset_review_v1.html', 'w', encoding='utf-8').write(out)
print('review', cnt, 'html KB', len(out) // 1024)
