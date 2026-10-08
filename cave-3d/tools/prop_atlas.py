# prop_atlas.py v1.0 — 소품 낱장을 큰 그림 몇 장으로 묶음 (2026-10-08)
#  왜: 아티팩트 한 버전에 파일 511개까지. 소품 낱장 (art/pro · art/dun · art/enc) 171장이 칸을 다 먹고 있었음
#  원본 낱장은 그대로 두고 고칠 땐 원본을 고친 뒤 이 도구를 다시 돌림. 게시본에는 묶음 그림만 올림 (낱장은 안 올림)
#  출력: art/atlas/prop_<무리>.webp (무리마다 한 장, 넘치면 _2 · _3 …)
#        src/prop_atlas.js: const PROP_ART = { sheets: [경로…], at: { '원래 경로': [장 번호, x, y, w, h] } }
#  게임은 원래 경로 그대로 부르면 됨 — core.js 의 loadTex · artSrc 가 묶음에서 잘라 씀
#  같은 그림 (바이트가 똑같은 파일)은 한 번만 넣고 두 경로가 같은 칸을 가리킴
import os, json, hashlib
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
GROUPS = [('cave', ['art/pro']), ('dun', ['art/dun']), ('enc', ['art/enc'])]   # 무리 이름 · 폴더 (굴·프롤로그 / 미궁 / 만남)
SKIP = {'art/pro/karius2d.webp'}   # 원본 보관용 — 게임에서 안 씀
MAXS = 4096; PAD = 4; Q = 92       # 한 장 최대 크기 · 칸 사이 틈 (압축 번짐 막기) · 압축 품질

def maxrects(items, W, H):
    """MaxRects (짧은 변 맞춤). items: [(key, w, h)] → {key: (x, y)} 또는 못 넣으면 None"""
    free = [(0, 0, W, H)]; pos = {}
    for k, w, h in items:
        w2, h2 = w + PAD, h + PAD; best = None
        for fx, fy, fw, fh in free:
            if w2 <= fw and h2 <= fh:
                s = (min(fw - w2, fh - h2), max(fw - w2, fh - h2))
                if best is None or s < best[0]: best = (s, fx, fy)
        if best is None: return None
        _, x, y = best; pos[k] = (x, y); r = (x, y, w2, h2); nf = []
        for f in free:
            fx, fy, fw, fh = f
            if x >= fx + fw or x + w2 <= fx or y >= fy + fh or y + h2 <= fy: nf.append(f); continue
            if x > fx: nf.append((fx, fy, x - fx, fh))
            if x + w2 < fx + fw: nf.append((x + w2, fy, fx + fw - x - w2, fh))
            if y > fy: nf.append((fx, fy, fw, y - fy))
            if y + h2 < fy + fh: nf.append((fx, y + h2, fw, fy + fh - y - h2))
        free = [a for i, a in enumerate(nf) if not any(i != j and a[0] >= b[0] and a[1] >= b[1] and a[0] + a[2] <= b[0] + b[2] and a[1] + a[3] <= b[1] + b[3] and (a != b or j < i) for j, b in enumerate(nf))]
    return pos

def pack(items):
    """가장 작은 넓이로 한 장에 넣기. 다 못 넣으면 큰 것부터 한 장 채우고 나머지는 다음 장"""
    items = sorted(items, key=lambda t: (-max(t[1], t[2]), -t[1] * t[2]))
    best = None
    for W in range(256, MAXS + 1, 128):
        lo = max(max(h for _, _, h in items) + PAD, 256)
        for H in range(lo, MAXS + 1, 128):
            if best and W * H >= best[0]: break
            p = maxrects(items, W, H)
            if p: best = (W * H, W, H, p); break
    if best:
        _, W, H, p = best
        W = max(x + w for k, w, h in items for x, y in [p[k]]); H = max(y + h for k, w, h in items for x, y in [p[k]])
        return [(W, H, p, items)]
    # 한 장에 안 들어감 → 앞에서부터 들어가는 만큼
    n = len(items)
    while n > 1 and not maxrects(items[:n], MAXS, MAXS): n -= 1
    return pack(items[:n]) + pack(items[n:])

def main():
    sheets, at = [], {}
    for name, dirs in GROUPS:
        files = sorted(f'{d}/{f}' for d in dirs for f in os.listdir(os.path.join(ROOT, d)) if f.endswith('.webp') and f'{d}/{f}' not in SKIP)
        uniq, alias = {}, {}
        for p in files:
            h = hashlib.md5(open(os.path.join(ROOT, p), 'rb').read()).hexdigest()
            if h in uniq: alias[p] = uniq[h]
            else: uniq[h] = p
        ims = {p: Image.open(os.path.join(ROOT, p)).convert('RGBA') for p in uniq.values()}
        parts = pack([(p, im.width, im.height) for p, im in ims.items()])
        for i, (W, H, pos, items) in enumerate(parts):
            out = f'art/atlas/prop_{name}' + (f'_{i + 1}' if i else '') + '.webp'
            sheet = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            for k, w, h in items: sheet.paste(ims[k], pos[k]); at[k] = [len(sheets), pos[k][0], pos[k][1], w, h]
            sheet.save(os.path.join(ROOT, out), 'WEBP', quality=Q, method=6, alpha_quality=100)
            used = sum(w * h for _, w, h in items)
            print(f'{out}: {W}x{H} · {len(items)}장 · 채움 {used / (W * H) * 100:.0f}% · {os.path.getsize(os.path.join(ROOT, out)) / 1e6:.2f}MB')
            sheets.append(out)
        for a, b in alias.items(): at[a] = at[b]
        if alias: print(f'  같은 그림 {len(alias)}장: ' + ', '.join(f'{a} = {b}' for a, b in alias.items()))
    js = ('/* prop_atlas.js v1.0 — tools/prop_atlas.py 가 만듦 (손으로 고치지 말 것)\n'
          '   소품 낱장 (art/pro · art/dun · art/enc) → 묶음 그림. 원래 경로: [장 번호, x, y, w, h] (px, 위에서부터) */\n'
          'const PROP_ART = ' + json.dumps({'sheets': sheets, 'at': dict(sorted(at.items()))}, ensure_ascii=False, separators=(',', ':')) + ';\n')
    open(os.path.join(ROOT, 'src', 'prop_atlas.js'), 'w', encoding='utf-8').write(js)
    print(f'합계: 낱장 {len(at)}개 → 묶음 {len(sheets)}장')

if __name__ == '__main__': main()
