# shrink_anim.py v1.0 — 도감 한 판 256MiB 한도 때문에: 묶이지 않은 큰 움직이는 그림 (img/**.webp, 1MB 넘는 것) 을 품질 80 으로 다시 압축
#  · 15% 넘게 줄어들 때만 바꿈 (원래 압축이 더 나은 그림은 그대로) · 프레임 · 시간 · 반복은 그대로
#  · 원본은 git 기록에 남음. 실행: python3 codex/tools/shrink_anim.py  (2026-10-09, 1차 업뎃 때 처음)
import os, json, re, sys
from multiprocessing import Pool
from PIL import Image, ImageSequence
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Q, MIN, GAIN = 80, 1 << 20, 0.85

def one(src):
    p = os.path.join(R, src); im = Image.open(p)
    if getattr(im, 'n_frames', 1) < 2: return src, 0, 0
    fr, du = [], []
    for x in ImageSequence.Iterator(im): fr.append(x.convert('RGBA')); du.append(x.info.get('duration', 80))
    tmp = p + '.tmp.webp'
    fr[0].save(tmp, 'WEBP', save_all=True, append_images=fr[1:], duration=du, loop=im.info.get('loop', 0), quality=Q, method=4)
    a, b = os.path.getsize(p), os.path.getsize(tmp)
    if b < a * GAIN: os.replace(tmp, p); return src, a, b
    os.remove(tmp); return src, a, a

if __name__ == '__main__':
    cat = json.loads(open(f'{R}/catalog.js', encoding='utf-8').read().split('const CATALOG = ', 1)[1].strip().rstrip(';'))
    packed = set(json.loads(re.search(r'const PACKED = (\{.*\});', open(f'{R}/packs.js').read()).group(1)))
    todo = sorted({e['src'] for e in cat if e['src'].startswith('img/') and e['src'].endswith('.webp') and e['src'] not in packed and os.path.getsize(os.path.join(R, e['src'])) > MIN})
    with Pool(max(1, os.cpu_count() - 1)) as P: res = P.map(one, todo)
    a = sum(r[1] for r in res); b = sum(r[2] for r in res)
    for s, x, y in res:
        if y and y < x: print(f'{s} {x // 1024} → {y // 1024} KB')
    print(f'{len(todo)}개 살핌 · {sum(1 for r in res if r[2] and r[2] < r[1])}개 줄임 · {(a - b) / 2 ** 20:.1f}MB 아낌')
