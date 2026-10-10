# g4_cut.py v1.5 (2026-10-10) — v1.5: 몸에서 40px 넘게 떨어진 무채색 번호 상자 (60px 안 · 넓이 1600 아래) 도 지움
# v1.4: 흰 바탕에 흰 옷 (간호사 시트 둘) 은 윤곽선으로 막고 바깥 바탕만 지움 (alpha_outline) — 옷에 구멍이 나던 것
# v1.3: 번호 상자 (흰 네모 안 숫자) · 몸 가까이 붙은 검은 번호 글자도 지움 (declutter, 자른 칸에 다시 돌릴 수 있음: --declutter <칸 폴더>)
# v1.2: 이미 투명한 시트 (벤킨1 · 친칠라 일상 등) 는 격자 지우기를 건너뛰고 원래 투명도를 씀 (RGB 로 바꾸며 투명이 사라지던 것) · 손으로 정한 줄 · 칸 (ROWS 29장) · 민수가 파란 X 친 칸은 빼고 (XCELL) · 칸마다 남은 번호 글자 · 번호 상자 지움 (declutter)
# v1.1: 바탕색은 가장자리 5px 안쪽 띠 (맨 가장자리 테두리 선 피함) · 격자선 잉크 문턱 25 (연회색 선) · 덩어리는 3px 만 붙임 (붙어 선 사람들이 한 덩어리 되던 것)
# v1.0 — 4기 시트 자르기 (드라이브 '1010 4기 업뎃')
#  · tools/g4_spec.json 의 sheet 종류만: 격자선 지우기 → 바탕 지우기 (up1_seg.alpha_of) → 번호 글자 지우기 → 줄 · 칸 수 자동 → up1_cut.cut_sheet (이음선 · 덩어리 주인)
#  · 격자선: 가로 · 세로 한 줄이 시트를 거의 다 가로지르고 (75% 넘게) 양옆은 비어 있는 가는 줄 (8px 안) → 바탕색으로 칠함
#  · 번호 글자: 작고 (넓이 900 아래 · 70x50 안) 색이 없는 (회색 · 검정) 덩어리가 큰 그림에서 18px 넘게 떨어져 있으면 지움
#  · 줄 · 칸: 그림 덩어리 (12px 붙임) 를 세로 가운데로 줄 묶음 · 너무 넓은 덩어리는 붙은 두 사람으로 셈. ROWS 에 손으로 정한 값이 있으면 그것
#  사용: python3 -I tools/g4_cut.py <내려받은 폴더> <칸 폴더> [시트 이름 일부 …]   → <칸 폴더>/<폴더>/<시트>/r<줄>c<칸>.png + _info.json + _prev.jpg
import sys, os, json
import numpy as np
from PIL import Image
from scipy import ndimage
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from up1_seg import alpha_of
from up1_cut import cut_sheet
ROWS = {   # '폴더/파일': [줄마다 칸 수] — 자동이 틀린 시트만 (검수 판에서 눈으로 셈)
  '4기몹/9인 워크 프레임 2 캐릭터 시트.png': [3, 3, 3], '4기몹/스테이지 11, 아홉 전사의 준비 자세.png': [3, 3, 3], '4기몹/스테이지 17_ 아홉 영웅의 편안한 휴식.png': [3, 3, 3],
  '4기몹/한복과 군복 캐릭터 9인 스프라이트 시트.png': [3, 3, 3], '4기몹/한복과 군인 9인의 3×3 스프라이트 시트.png': [3, 3, 3],
  '도살자콘/뼈 문신 단검 여성의 다섯 포즈.png': [3, 2], '도살자콘/뼈 문신 전사의 다섯 포즈.png': [3, 2],
  '레지나페흐토테이론/레지나의 10종 특수 검격.png': [5, 5], '레지나페흐토테이론/뿔 달린 기사 보스의 8가지 강공격.png': [4, 4], '레지나페흐토테이론/초승달 왕의 8가지 전투 자세.png': [4, 4],
  '리완/수정 방패 기사 10종 포즈 시트.png': [5, 5], '리완/수정 방패 기사, 다섯 포즈.png': [3, 2], '리완/수정 방패 기사의 여섯 가지 전투 동작.png': [3, 3],
  '망향추가/다섯 포즈 완성형 캐릭터 시트.png': [3, 2], '망향추가/분홍 머리 뿔 여전사 10포즈 스프라이트 시트.png': [5, 5],
  '벤킨추가/두건벤킨2.png': [5, 5], '벤킨추가/벤킨2.png': [5, 5], '벤킨추가/벤킨1.png': [5, 5],
  '유니/보석 오니 전투 포즈 스프라이트 시트.png': [5, 5],
  '장끌레도르추가/image(20261010-030916).png': [4], '장끌레도르추가/장 끌레도르 느와르 걷기.png': [4],
  '청광묵추가/청광묵1.png': [6, 4], '청승추가/청승 블루 오니의 액션 스프라이트 시트.png': [5, 5], '청승추가/청승의 10종 전투 스프라이트 시트.png': [5, 5],
  '추가스프라이트/눈 괴물 10종 포즈 스프라이트 시트.png': [5, 5], '추가스프라이트/열 가지 포즈의 악마 기사 스프라이트.png': [5, 5],
  '친칠라추가/치치닐라 궁수의 다섯 가지 일상 자세, 사과는 삭제.png': [3, 2], '친칠라추가/친칠라의 다섯 가지 일상 포즈.png': [3, 2],
  '작약추가/붉은 오니 전사의 다섯 포즈.png': [2, 3]}
# 민수가 파란 X 친 칸 (쓰지 말 것) — 잘라도 파일을 남기지 않고 _info.json 의 x 에 적음
XCELL = {'도살자콘/뼈 문신 전사의 다섯 포즈.png': ['r0c1', 'r0c2'], '도살자콘/해골 문신 전사의 다섯 특수 자세.png': ['r1c0'],
         '장끌레도르추가/금발 남성의 두 가지 해머 공격.png': ['r0c0']}
OUTLINE = {'4기/간호사1.png', '4기/간호사특수2.png'}   # v1.4 흰 바탕 + 흰 옷 (간호사): 윤곽선으로 막고 바깥 흰 바탕만 지움
def alpha_outline(im, ink_t=236, grow=2):
    """흰 바탕 시트에서 흰 옷이 바탕과 같이 지워지던 것 (v1.4): 선 (어두운 칸) 을 grow px 굵혀 틈을 막고 가장자리에서 이어진 흰 바탕만 지움 → 굵힌 만큼 남은 흰 테두리는 다시 지움"""
    a = np.asarray(im.convert('RGBA')).copy(); rgb = a[..., :3].astype(int); mn = rgb.min(2)
    ink = mn < ink_t; wall = ndimage.binary_dilation(ink, iterations=grow)
    lab, n = ndimage.label(~wall); border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    halo = ndimage.binary_dilation(bg, iterations=grow + 1) & ~bg & (mn > 245)
    kill = bg | halo; a[kill, 3] = 0
    soft = ndimage.binary_dilation(kill) & ~kill & (mn > 225); a[soft, 3] = np.minimum(a[soft, 3], 140)
    return a
def own_alpha(im):
    """원래 투명한 시트 (모서리 · 가장자리 절반 넘게 투명) 면 RGBA 배열, 아니면 None"""
    if im.mode not in ('RGBA', 'LA', 'P'): return None
    a = np.asarray(im.convert('RGBA')).copy(); al = a[..., 3]
    edge = np.concatenate([al[0], al[-1], al[:, 0], al[:, -1]])
    if (edge < 20).mean() < 0.5 and (al < 10).mean() < 0.3: return None
    a[al < 24] = 0; return a
def declutter(path):
    """칸 그림에 남은 번호 글자 · 번호 상자: 작고 (넓이 900 아래 · 45x45 안) 색이 없고 (검정 · 흰색) 몸에서 떨어진 덩어리 → 지움
       v1.3: 흰 네모 번호 상자 (가로세로 비슷 · 30px 안) 는 밝기와 상관없이 · 검은 글자 (밝기 80 아래 · 600px 안) 는 2px 만 떨어져도"""
    a = np.asarray(Image.open(path).convert('RGBA')).copy(); m = a[..., 3] > 24
    lab, n = ndimage.label(m, structure=np.ones((3, 3)))
    if n < 2: return 0
    area = ndimage.sum(m, lab, range(1, n + 1)); main = int(np.argmax(area)) + 1
    dist = ndimage.distance_transform_edt(lab != main); objs = ndimage.find_objects(lab); k = 0
    for i in range(1, n + 1):
        if i == main or area[i - 1] >= 900: continue
        sl = objs[i - 1]; h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        comp = lab[sl] == i; px = a[sl][comp][:, :3].astype(int); sat = (px.max(1) - px.min(1)).mean(); val = px.mean(); d = dist[sl][comp].min()
        if sat <= 12 and area[i - 1] < 1600 and w <= 60 and h <= 60 and d >= 40: a[sl][comp] = 0; k += 1; continue   # v1.5 몸에서 멀리 떨어진 무채색 번호 상자 (34x31 등)
        if w > 45 or h > 45: continue
        if sat > 40: continue
        box = w <= 30 and h <= 30 and 0.7 <= w / max(1, h) <= 1.4 and area[i - 1] > 0.45 * w * h
        dark = val < 80 and area[i - 1] < 600
        if box and d >= 2: pass
        elif dark and d >= 2: pass
        elif (val <= 110 or val >= 200) and d >= 6: pass
        else: continue
        a[sl][comp] = 0; k += 1
    if k: Image.fromarray(a).save(path)
    return k
def degrid(im):
    a = np.asarray(im.convert('RGB')).astype(np.int16); H, W = a.shape[:2]
    k = 5   # 바탕색: 가장자리 5px 안쪽 띠 (맨 가장자리는 테두리 선일 수 있음)
    ring = np.concatenate([a[k, k:W - k], a[H - 1 - k, k:W - k], a[k:H - k, k], a[k:H - k, W - 1 - k]]); bg = np.median(ring, axis=0)
    ink = np.abs(a - bg).sum(2) > 25
    lines = 0
    for axis in (0, 1):
        frac = ink.mean(axis=axis)   # axis 0 → 세로선 (x 마다), axis 1 → 가로선 (y 마다)
        n = len(frac); hit = np.zeros(n, bool)
        for i in range(n):
            if frac[i] < 0.75 or hit[i]: continue
            lo, hi = i, i
            while lo > 0 and frac[lo - 1] >= 0.5: lo -= 1
            while hi < n - 1 and frac[hi + 1] >= 0.5: hi += 1
            if hi - lo + 1 > 8: continue
            l2 = frac[max(0, lo - 9):max(0, lo - 2)]; r2 = frac[hi + 3:hi + 10]
            if (len(l2) == 0 or l2.mean() < 0.45) and (len(r2) == 0 or r2.mean() < 0.45): hit[max(0, lo - 2):hi + 3] = True
        if hit.any():
            lines += int((np.diff(hit.astype(int)) == 1).sum() + hit[0])
            if axis == 0: a[:, hit] = bg
            else: a[hit, :] = bg
    return Image.fromarray(a.astype(np.uint8)), lines
def unlabel(a):
    m = a[..., 3] > 24; lab, n = ndimage.label(m, structure=np.ones((3, 3)))
    if not n: return 0
    objs = ndimage.find_objects(lab); area = ndimage.sum(m, lab, range(1, n + 1))
    big = np.zeros_like(m)
    for i, s in enumerate(area, 1):
        if s >= 2500: big |= lab == i
    if not big.any(): return 0
    dist = ndimage.distance_transform_edt(~big); killed = 0
    for i, s in enumerate(area, 1):
        if s >= 900: continue
        sl = objs[i - 1]; h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        if w > 70 or h > 50: continue
        comp = lab[sl] == i; px = a[sl][comp][:, :3].astype(int)
        sat = (px.max(1) - px.min(1)).mean(); val = px.mean()
        if sat > 40 or val > 170: continue
        if dist[sl][comp].min() < 18: continue
        a[sl][comp] = 0; killed += 1
    return killed
def autorows(a):
    m = a[..., 3] > 24; g = ndimage.binary_dilation(m, iterations=3); lab, n = ndimage.label(g)
    ars = ndimage.sum(m, lab, range(1, n + 1)) if n else []
    if not n: return [1]
    amax = max(ars); bl = []
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        if ars[i - 1] < max(2500, amax * 0.15): continue
        bl.append((sl[1].start, sl[0].start, sl[1].stop, sl[0].stop, ars[i - 1]))
    hs = np.median([b[3] - b[1] for b in bl]); ws = np.median([b[2] - b[0] for b in bl])
    bl.sort(key=lambda b: (b[1] + b[3]) / 2); rows = []
    for b in bl:
        cy = (b[1] + b[3]) / 2
        if rows and abs(cy - np.mean([(x[1] + x[3]) / 2 for x in rows[-1]])) < hs * 0.5: rows[-1].append(b)
        else: rows.append([b])
    out = []
    for r in rows:
        c = 0
        for b in r: c += max(1, int(round((b[2] - b[0]) / ws))) if (b[2] - b[0]) > ws * 1.7 else 1
        out.append(c)
    return out
def main(D, OUT, only):
    spec = json.load(open(os.path.join(HERE, 'g4_spec.json'), encoding='utf-8'))
    todo = [rel for rel, v in spec['files'].items() if v['kind'] == 'sheet' and (not only or any(o in rel for o in only))]
    log = []
    for rel in todo:
        fold, f = rel.split('/', 1); stem = os.path.splitext(f)[0]; od = os.path.join(OUT, fold, stem)
        im = Image.open(os.path.join(D, rel)); a = own_alpha(im); nl = 0
        if a is None and rel in OUTLINE: a = alpha_outline(im)
        if a is None: im2, nl = degrid(im); a = alpha_of(im2)
        nk = unlabel(a)
        rows = ROWS.get(rel) or autorows(a)
        cut_sheet(a, rows, stem, od)
        info = json.load(open(os.path.join(od, '_info.json'), encoding='utf-8')); info.update({'rel': rel, 'owner': spec['files'][rel]['owner'], 'grid': nl, 'labels': nk})
        xs = XCELL.get(rel, []); info['x'] = xs; info['cells'] = [c for c in info['cells'] if c['f'][:-4] not in xs]
        for c in xs:
            if os.path.exists(os.path.join(od, c + '.png')): os.remove(os.path.join(od, c + '.png'))
        info['declutter'] = sum(declutter(os.path.join(od, c['f'])) for c in info['cells'])
        json.dump(info, open(os.path.join(od, '_info.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
        log.append(f'{rel}\t{rows}\t격자 {nl}\t번호 {nk}+{info["declutter"]}\t칸 {len(info["cells"])}' + (f'\tX {xs}' if xs else '')); print(log[-1], flush=True)
    open(os.path.join(OUT, '_log.tsv'), 'a', encoding='utf-8').write('\n'.join(log) + '\n')
if __name__ == '__main__':
    if sys.argv[1] == '--declutter':   # v1.3 이미 자른 칸에 번호 지우기만 다시
        n = 0
        for dp, dn, fn in os.walk(sys.argv[2]):
            for f in fn:
                if f.endswith('.png') and f.startswith('r'): n += declutter(os.path.join(dp, f))
        print('지운 덩어리', n)
    else: main(sys.argv[1], sys.argv[2], sys.argv[3:])
