# hipack.py v1.3 — (v1.3, 2026-10-10: 품질 74 → 90 되돌림 — hi 묶음은 이제 도감 자산 보관함 (1GiB) 에 올라가 한 판 256MiB 에 안 셈, tools/blobs.py) (v1.2: 품질 90 → 74 — 도감 한 판 256MiB 한도 안으로) (v1.1: 3기 추가 스프라이트 h3x · 추가팩션 h3f 원본) v1.0 — 꽉 찬 화면 (스샷) 보기용 고화질 묶음
#  도감 그림 (img/*)은 목록용으로 줄여 둔 것. 원본이 저장소에 있는 그림만 원본 해상도로 다시 묶어 hi/hi<N>.webp + hipacks.js
#   · img/h2/<slug>__<동작> → cave-3d/art/h2/<slug>/<동작>.webp (원화 · 은신 · 쌍권총 · 연금술사는 원래 자리)
#   · img/face/h2_<slug> → 2기 얼굴 원본 · img/inju/<k> → cave-3d/art/inju/<k> · img/karius/<k> → cave-3d/art/kar/<k> (원화 2는 src/art2)
#  원본이 지금 그림보다 1.25배 넘게 클 때만 넣음. 긴 변은 1800px까지. 묶음은 4096 × 4096 안
#  크게 보기의 꽉 찬 화면은 HI에 있으면 이 묶음에서, 없으면 지금 그림 (img · pack · a/)을 씀
# 실행: python3 codex/tools/hipack.py  (catalog를 바꾼 뒤 · pack.py와 따로)
import os, json
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); C3 = os.path.join(os.path.dirname(ROOT), 'cave-3d')
cat = json.loads(open(f'{ROOT}/catalog.js', encoding='utf-8').read().split('const CATALOG = ', 1)[1].strip().rstrip(';'))
s = open(f'{C3}/src/h2_roster.js', encoding='utf-8').read(); R = json.loads(s[s.index('{'):s.rindex('}') + 1])
MISC = 'art/h2/_misc'
def hiOf(src):
    b = os.path.basename(src)[:-5]
    if src.startswith('img/h2/'):
        slug, k = b.split('__', 1)
        if slug == 'alchemist': return f'{MISC}/alchemist_{k}.webp'
        if k == 'portrait': return R[slug].get('portrait')
        if k == 'stealth': return f'{MISC}/stealth_{slug}.webp'
        if k == 'dualshoot': return f'{MISC}/bel_dualshoot.webp'
        p = R.get(slug, {}).get('poses', {}).get(k); return p and p['src']
    if src.startswith('img/face/h2_'):
        slug = b[3:]; return f'{MISC}/alchemist_face.webp' if slug == 'alchemist' else R.get(slug, {}).get('face')
    if src.startswith('img/h3x/'):
        slug, k = b.split('__', 1); return f'art/h3x/{slug}/{k}.webp'
    if src.startswith(('img/npc/h3f_', 'img/prop/h3f_')):
        rest = b[4:]; slug, nn = rest.rsplit('_', 1); return f'art/h3f/{slug}/{nn}.webp'
    if src.startswith('img/inju/'): return f'art/inju/{b}.webp'
    if src.startswith('img/karius/'): return 'art/kar/src/art2.webp' if b == 'art2' else f'art/kar/{b}.webp'
    return None
items = []
for e in cat:
    src = e['src']; h = hiOf(src)
    if not h or not os.path.exists(f'{C3}/{h}') or not os.path.exists(f'{ROOT}/{src}'): continue
    im = Image.open(f'{C3}/{h}').convert('RGBA'); cur = max(Image.open(f'{ROOT}/{src}').size)
    if max(im.size) < cur * 1.25: continue
    k = min(1, 1800 / max(im.size))
    if k < 1: im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    items.append((src, im))
items.sort(key=lambda t: -t[1].height)
os.makedirs(f'{ROOT}/hi', exist_ok=True)
for f in os.listdir(f'{ROOT}/hi'): os.remove(f'{ROOT}/hi/{f}')
W, H, PAD = 4096, 4096, 4
sheets, where, cur = [], {}, []
def flush():
    if not cur: return
    h = max(y + im.height for _, im, x, y in cur); S = Image.new('RGBA', (W, h), (0, 0, 0, 0)); n = len(sheets)
    for src, im, x, y in cur: S.paste(im, (x, y)); where[src] = [n, x, y, im.width, im.height]
    S.save(f'{ROOT}/hi/hi{n}.webp', 'WEBP', quality=90, method=4); sheets.append(f'hi/hi{n}.webp'); cur.clear()
x = y = rowh = 0
for src, im in items:
    if x + im.width > W: x, y, rowh = 0, y + rowh + PAD, 0
    if y + im.height > H: flush(); x = y = rowh = 0
    cur.append((src, im, x, y)); x += im.width + PAD; rowh = max(rowh, im.height)
flush()
with open(f'{ROOT}/hipacks.js', 'w', encoding='utf-8') as o:
    o.write('/* hipacks.js — tools/hipack.py가 만듦. 손으로 고치지 않음. 꽉 찬 화면용 원본 해상도: 그림 경로 → [묶음 번호, x, y, 너비, 높이] */\n')
    o.write('const HIPACKS = ' + json.dumps(sheets) + ';\nconst HI = ' + json.dumps(where, separators=(',', ':')) + ';\n')
print(len(items), 'images,', len(sheets), 'sheets', sum(os.path.getsize(f'{ROOT}/{s}') for s in sheets) // 1024 // 1024, 'MB')
