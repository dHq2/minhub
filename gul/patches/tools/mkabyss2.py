# abyss/make2.py v1.0 — 6기 대화용 스프라이트 · 프로필 5장 (노숙악마 C-145 · 반 · 테리 · 헌팅나이프 C-290 · 카밀라 C-291): 원화 (흰 바탕 그대로 webp) · 투명 바탕 (흰 바탕 지움) · 얼굴 256 정사각
# 쓰는 법: cd abyss && python3 -I make2.py  (new5/*.png 는 대화로 올린 원본 — 대화 기록에서 꺼낸 것)
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image, ImageFilter
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'make.py')).read().split("CH = {")[0].replace("os.makedirs('out', exist_ok=True)", ''))   # cut · keep_main 만 가져옴
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FACE = {'nosuk': (360, 260, 600, 500), 'ban': (410, 0, 650, 240), 'teri': (410, 110, 690, 390), 'huntknife': (400, 20, 780, 400), 'kamilla': (340, 20, 800, 480)}
os.makedirs(D + '/abyss/out2', exist_ok=True)
for k, b in FACE.items():
    im = Image.open(D + '/new5/%s.png' % k).convert('RGB')
    im.save(D + '/abyss/out2/%s_art.webp' % k, 'WEBP', quality=92, method=6)
    t = cut(im); t.save(D + '/abyss/out2/%s_cut.webp' % k, 'WEBP', quality=92, method=6, exact=True)
    t.crop(b).resize((256, 256), Image.LANCZOS).save(D + '/abyss/out2/%s_face.webp' % k, 'WEBP', quality=92, method=6, exact=True)
    print(k, im.size)
sheet = Image.new('RGB', (256 * 5, 256), (60, 60, 70))
for i, k in enumerate(FACE):
    f = Image.open(D + '/abyss/out2/%s_face.webp' % k).convert('RGBA'); sheet.paste(f, (i * 256, 0), f)
sheet.save(D + '/pm/faces2_check.png')
