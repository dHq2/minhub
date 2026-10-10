# h2_atlas.py v1.1 — 2기 · 3기 · 4기 … 그림 묶음 + 얼굴 모음 한 장
#  v1.1 (2026-10-10, v0.84): 인물 묶음 여러 개를 큰 판 (4096 안) 에 같이 담음 — 인물마다 한 파일이던 것 (92개) → 기수마다 몇 장.
#        아티팩트 한 판 511개 한도에 4기 (드라이브 335개) 자리를 냄. 그림 (인물 안 배치 · 줄인 배율 · 압축 품질) 은 v1.0 과 똑같이 만들고 판에 옮겨 놓기만 함.
#        게임은 칸만 잘라 올리므로 (units.js v0.33 rectTex) 판이 커져도 GPU 메모리는 그대로
#  v1.0: 인물마다 한 장 (art/h2/atlas/<slug>.webp)
#  왜: 아티팩트 한 버전에 파일 511개까지 → 동작마다 한 파일이면 넘침. 원본 (art/h2/<slug>/*.webp)은 그대로 두고 고칠 땐 원본을 고침
#  출력: art/h2/atlas/g<기수>_<n>.webp (기수마다 판을 따로 — 4기가 들어와도 2 · 3기 판은 바이트까지 그대로라 다시 올릴 필요 없음)
#        art/h2/atlas/faces.webp (칸 128px, 8줄)
#        src/h2_atlas.js: const H2A = { <slug>: { src, W, H, k (줄인 배율), poses: { 동작: [x, y, w, h] } }, faces: { src, cell, cols, i: { slug: 번호 } } }
#        (src · W · H 는 그 인물이 든 판, poses 칸은 판 안 자리 — h2.js 는 v1.0 과 같은 모양으로 읽음)
#  순서: tools/h2_roster.py → tools/h2_atlas.py
import os, sys, json
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from prop_atlas import maxrects   # 판에 묶음 담기 (MaxRects, 칸 사이 틈 4px)
OUT = os.path.join(ROOT, 'art', 'h2', 'atlas'); MAXW = MAXH = 2048; PAD = 4; SHEET = 4096 + 2 * PAD; Q = 86   # 판 4104 — 가로 2048 묶음 둘이 틈까지 들어가게
def shelf(items, W):
    x = y = rowh = 0; pos = {}
    for k, w, h in items:
        if x + w > W: x = 0; y += rowh + PAD; rowh = 0
        pos[k] = (x, y); x += w + PAD; rowh = max(rowh, h)
    return pos, y + rowh
def char_block(o):
    """v1.0 과 같은 인물 묶음: 줄인 배율 k · 줄 쌓기 자리 → (그림, 칸 {동작: [x, y, w, h]}, k)"""
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
    return sheet, P, k
def pack_sheets(blocks):
    """인물 묶음들을 4096 판에 — 큰 것부터, 한 판에 들어가는 만큼. → [(W, H, {slug: (x, y)})]"""
    left = sorted(blocks, key=lambda b: (-b[2], -b[1], b[0])); out = []
    while left:
        n = len(left)
        while n > 1 and not maxrects(left[:n], SHEET, SHEET): n -= 1
        part = left[:n]; pos = maxrects(part, SHEET, SHEET)
        W = max(pos[s][0] + w for s, w, h in part); H = max(pos[s][1] + h for s, w, h in part)
        out.append((W, H, pos)); left = left[n:]
    return out
def main():
    s = open(os.path.join(ROOT, 'src', 'h2_roster.js'), encoding='utf-8').read(); R = json.loads(s[s.index('{'):s.rindex('}') + 1])
    os.makedirs(OUT, exist_ok=True); A = {}; made = set()
    groups = {}
    for slug, o in R.items(): groups.setdefault(o.get('gen') or 2, []).append(slug)
    for g in sorted(groups):
        built = {slug: char_block(R[slug]) for slug in groups[g]}
        parts = pack_sheets([(slug, im.width, im.height) for slug, (im, P, k) in built.items()])
        for i, (W, H, pos) in enumerate(parts):
            name = f'g{g}_{i}.webp'; sheet = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            for slug, (x, y) in sorted(pos.items()):
                im, P, k = built[slug]; sheet.paste(im, (x, y))
                A[slug] = {'src': 'art/h2/atlas/' + name, 'W': W, 'H': H, 'k': round(k, 3), 'poses': {n: [r[0] + x, r[1] + y, r[2], r[3]] for n, r in P.items()}}
            sheet.save(os.path.join(OUT, name), 'WEBP', quality=Q, method=6); made.add(name)
            print(f'{name:12} {W}x{H} 인물 {len(pos):2} · {os.path.getsize(os.path.join(OUT, name)) // 1024}KB · ' + ' '.join(sorted(pos)))
    cell, cols = 128, 8; L = [s for s in R if R[s].get('face')]; rows = (len(L) + cols - 1) // cols
    F = Image.new('RGBA', (cell * cols, cell * rows), (30, 30, 34, 255)); idx = {}
    for i, slug in enumerate(L):
        im = Image.open(os.path.join(ROOT, R[slug]['face'])).convert('RGBA'); m = min(im.size)
        im = im.crop(((im.width - m) // 2, 0, (im.width - m) // 2 + m, m)).resize((cell, cell), Image.LANCZOS)
        F.paste(im, ((i % cols) * cell, (i // cols) * cell)); idx[slug] = i
    F.save(os.path.join(OUT, 'faces.webp'), 'WEBP', quality=86, method=6); made.add('faces.webp')
    A['faces'] = {'src': 'art/h2/atlas/faces.webp', 'cell': cell, 'cols': cols, 'rows': rows, 'i': idx}
    open(os.path.join(ROOT, 'src', 'h2_atlas.js'), 'w', encoding='utf-8').write('/* h2_atlas.js — 자동 생성 (tools/h2_atlas.py v1.1). 손으로 고치지 말 것 */\n\'use strict\';\nconst H2A = ' + json.dumps(A, ensure_ascii=False) + ';\n')
    old = sorted(f for f in os.listdir(OUT) if f.endswith('.webp') and f not in made)
    for f in old: os.remove(os.path.join(OUT, f))   # v1.0 의 인물마다 한 장 · 빠진 판 (게시본에선 files 에 null)
    print(f'faces {len(L)} · 판 {len(made) - 1}장 · 지운 옛 파일 {len(old)}' + (': ' + ' '.join(old[:6]) + (' …' if len(old) > 6 else '') if old else ''))
    open(os.path.join(HERE, 'h2_atlas_removed.json'), 'w', encoding='utf-8').write(json.dumps(['art/h2/atlas/' + f for f in old], ensure_ascii=False))
if __name__ == '__main__': main()
