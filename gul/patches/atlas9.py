# 얼굴 아틀라스 덧붙임 — atlas9.py v1.0 (v1.0: v9.2.0 2층 적 — 암계 병사 4 · 반 · 테리 · 헌팅나이프 · 카밀라 · 망자 5 의 얼굴을 아틀라스 · 명단 (roster4.json) 에 덧붙임. 이미 있으면 건너뜀 · 몇 번을 돌려도 같음)
import json, math, os
from PIL import Image
D = 'artifact-files/19b948dc-6a33-4150-9b19-956f18dac694/'
roster = json.load(open('roster4.json', encoding='utf-8')); have = {r[0] for r in roster}
fi = json.load(open('build/faces_idx.json')); S, COLS = fi['S'], fi['COLS']
atlas = Image.open('build/faces.webp').convert('RGBA')
NEW = [  # (ref, 이름, 등급, 직군, 설명, 그림)
 ('C-290', '헌팅나이프', 4, '기동', '심계 소령 — 낙오자 (제3세력). 단검 · 암습 · 무기뺏기', ('f', 'build/art/abyss/C-290_face.webp')),
 ('C-291', '카밀라', 4, '원거리', '라스트 솔져 — 레이더 · 생존자 · 펌프식 샷건', ('f', 'build/art/abyss/C-291_face.webp')),
 ('C-318', '암계 방패병', 3, '근접', '대방패 · 암계 역장 (대형 방패 + 장검)', ('f', 'build/art/abyss/C-318_face.webp')),
 ('C-319', '암계 창방패병', 3, '근접', '장창 · 중형 방패 · 밀치기 돌진', ('f', 'build/art/abyss/C-319_face.webp')),
 ('C-320', '암계 장궁병', 3, '원거리', '장궁 · 어둠의 화살비', ('f', 'build/art/abyss/C-320_face.webp')),
 ('C-321', '암계 장송기사', 3, '근접', '장검 · 장송 치유 · 부활 · 방사 절단', ('f', 'build/art/abyss/C-321_face.webp')),
 ('C-322', '반', 5, '근접', '암계 중간보스 — 대검 거인 (8m)', ('f', 'build/art/abyss/C-322_face.webp')),
 ('C-323', '테리', 5, '근접', '암계 중간보스 — 망치 거인 (8m)', ('f', 'build/art/abyss/C-323_face.webp')),
 ('X-w01', '일반 망자', 1, '근접', '누더기를 걸친 망자 (도감 떠돌이 01)', ('p', 1830, 724, 203, 360)),
 ('X-w06', '사족 망자', 2, '기동', '네 발로 기는 긴 머리 망자 (도감 떠돌이 06)', ('p', 966, 1086, 327, 360)),
 ('X-w10', '근육 망자', 2, '근접', '이빨 드러낸 대머리 거한 (도감 떠돌이 10)', ('p', None, None, None, None)),
 ('X-w03', '뚱보 망자', 2, '근접', '배가 불룩한 거구 망자 (도감 떠돌이 03)', ('p', 244, 1086, 281, 360)),
 ('X-w08', '기형 망자', 3, '기동', '입을 크게 벌린 웅크린 망자 (도감 떠돌이 08)', ('p', 1546, 1086, 360, 291)),
]
# 떠돌이 10 의 자리는 packs.js 에서 읽음
s = open(D + 'packs.js', encoding='utf-8').read(); i = s.find('X-wanderer-10.webp'); import re
m = re.search(r'\[32,(\d+),(\d+),(\d+),(\d+)\]', s[i:i + 80]); w10 = tuple(map(int, m.groups()))
sheet = Image.open(D + 'pack/npc6.webp').convert('RGBA')
def cell(im, face):
    bb = im.getchannel('A').point(lambda a: 255 if a > 16 else 0).getbbox() or (0, 0, im.width, im.height); bx0, by0, bx1, by1 = bb; bw, bh = bx1 - bx0, by1 - by0
    if face: side = max(bw, bh); cx = (bx0 + bx1) / 2; cy = (by0 + by1) / 2; box = (cx - side / 2, cy - side / 2, cx + side / 2, cy + side / 2)
    else: side = min(bw, bh * 0.42) if bh > bw * 1.15 else min(bw, bh); cx = (bx0 + bx1) / 2; box = (cx - side / 2, by0, cx + side / 2, by0 + side)
    box = tuple(int(round(v)) for v in box); sq = Image.new('RGBA', (box[2] - box[0], box[3] - box[1]), (0, 0, 0, 0))
    sq.paste(im.crop((max(0, box[0]), max(0, box[1]), min(im.width, box[2]), min(im.height, box[3]))), (max(0, -box[0]), max(0, -box[1])))
    return sq.resize((S, S), Image.LANCZOS)
n = len(roster); add = [x for x in NEW if x[0] not in have]
rows = math.ceil((n + len(add)) / COLS); big = Image.new('RGBA', (COLS * S, rows * S), (0, 0, 0, 0)); big.paste(atlas, (0, 0)); atlas = big
for k, (ref, nm, tier, cls, note, src) in enumerate(add):
    idx = n + k
    if src[0] == 'f': im = Image.open(src[1]).convert('RGBA'); c = cell(im, True)
    else:
        x, y, w, h = src[1:] if src[1] is not None else w10; c = cell(sheet.crop((x, y, x + w, y + h)), False)
    atlas.paste(c, ((idx % COLS) * S, (idx // COLS) * S)); fi['idx'][ref] = idx
    roster.append([ref, nm, '적' if ref.startswith('X-') or ref in ('C-318', 'C-319', 'C-320', 'C-321', 'C-322', 'C-323') else '미분류', tier, cls, 0, 0, note, idx, 1.0, 0, '검'])
atlas.save('build/faces.webp', 'WEBP', quality=86, method=6)
json.dump(fi, open('build/faces_idx.json', 'w'))
json.dump(roster, open('roster4.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('덧붙임', len(add), '→ 명단', len(roster), '아틀라스', atlas.size)
