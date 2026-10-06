# h2_atlas.py v1.0 — 2기 그림을 인물마다 한 장 (아틀라스)으로 묶음 + 얼굴 모음 한 장
#  왜: 아티팩트 한 버전에 파일 511개까지 → 동작마다 한 파일이면 넘침. 원본 (art/h2/<slug>/*.webp)은 그대로 두고 고칠 땐 원본을 고침
#  출력: art/h2/atlas/<slug>.webp (가로 최대 2048 · 세로 최대 2048 — 넘치면 통째로 줄임) · art/h2/atlas/faces.webp (칸 128px, 8줄)
#        src/h2_atlas.js: const H2A = { <slug>: { src, W, H, k (줄인 배율), poses: { 동작: [x, y, w, h] } }, faces: { src, cell, cols, i: { slug: 번호 } } }
#  순서: tools/h2_roster.py → tools/h2_atlas.py
import os, json
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, 'art', 'h2', 'atlas'); MAXW = MAXH = 2048; PAD = 4
def shelf(items, W):
    x = y = rowh = 0; pos = {}
    for k, w, h in items:
        if x + w > W: x = 0; y += rowh + PAD; rowh = 0
        pos[k] = (x, y); x += w + PAD; rowh = max(rowh, h)
    return pos, y + rowh
def main():
    s = open(os.path.join(ROOT, 'src', 'h2_roster.js'), encoding='utf-8').read(); R = json.loads(s[s.index('{'):s.rindex('}') + 1])
    os.makedirs(OUT, exist_ok=True); A = {}
    for slug, o in R.items():
        ims = {k: Image.open(os.path.join(ROOT, p['src'])).convert('RGBA') for k, p in o['poses'].items()}
        k = 1.0
        while True:
            items = sorted(((n, max(1, round(im.width * k)), max(1, round(im.height * k))) for n, im in ims.items()), key=lambda t: -t[2])
            W = min(MAXW, max(sum(w for _, w, _ in items) + PAD * len(items), max(w for _, w, _ in items)))
            pos, H = shelf(items, W)
            if H <= MAXH and max(w for _, w, _ in items) <= MAXW: break
            k *= 0.9
        sheet = Image.new('RGBA', (W, H), (0, 0, 0, 0)); P = {}
        for n, w, h in items:
            im = ims[n] if k == 1 else ims[n].resize((w, h), Image.LANCZOS); x, y = pos[n]; sheet.paste(im, (x, y)); P[n] = [x, y, w, h]
        sheet.save(os.path.join(OUT, slug + '.webp'), 'WEBP', quality=86, method=6)
        A[slug] = {'src': 'art/h2/atlas/' + slug + '.webp', 'W': W, 'H': H, 'k': round(k, 3), 'poses': P}
        print(f'{slug:14} {W}x{H} k={k:.2f} poses={len(P)} {os.path.getsize(os.path.join(OUT, slug + ".webp")) // 1024}KB')
    cell, cols = 128, 8; L = [s for s in R if R[s].get('face')]; rows = (len(L) + cols - 1) // cols
    F = Image.new('RGBA', (cell * cols, cell * rows), (30, 30, 34, 255)); idx = {}
    for i, slug in enumerate(L):
        im = Image.open(os.path.join(ROOT, R[slug]['face'])).convert('RGBA'); m = min(im.size)
        im = im.crop(((im.width - m) // 2, 0, (im.width - m) // 2 + m, m)).resize((cell, cell), Image.LANCZOS)
        F.paste(im, ((i % cols) * cell, (i // cols) * cell)); idx[slug] = i
    F.save(os.path.join(OUT, 'faces.webp'), 'WEBP', quality=86, method=6)
    A['faces'] = {'src': 'art/h2/atlas/faces.webp', 'cell': cell, 'cols': cols, 'rows': rows, 'i': idx}
    open(os.path.join(ROOT, 'src', 'h2_atlas.js'), 'w', encoding='utf-8').write('/* h2_atlas.js — 자동 생성 (tools/h2_atlas.py). 손으로 고치지 말 것 */\n\'use strict\';\nconst H2A = ' + json.dumps(A, ensure_ascii=False) + ';\n')
    print('faces', len(L))
if __name__ == '__main__': main()
