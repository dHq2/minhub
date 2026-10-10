# g4_foes.py v1.2 (2026-10-10) — v1.2: foe4 표시 (S.foe4) · fidget · rest · play 를 foe4.js 로 넘김
# v1.1: 칸 안에 갇힌 흰 바탕 (사슬 고리 · 다리 사이 · 팔 사이) 지우기 (holes) — 시트 원래 바탕색에서 출발해 윤곽선 안쪽 흰 칸만
# v1.0 — 4기 적 · 1기 영웅 새 동작 → art/foe4/<키>.webp + src/foe4.js (FOE4: SPR[키] 에 자세를 덮거나 더함)
#  · 짝 표: tools/g4_foes_cfg.py (FOES). 칸은 tools/g4_cut.py 로 자른 칸 폴더 (c4), 배율 · 띠 · 묶음은 tools/g4_moves.py 의 build · pack 그대로
#  · 크기: 지금 게임 대기 그림 (old) 의 몸 키 = 새 시트의 서 있는 키 → 자세마다 scale = 1/D × mul (g4_moves 와 같은 셈, 게임은 P.h × 키/h0 × scale)
#  · 옛 자세 중 keep 은 그대로 (움직이는 옛 대기 · 공격 움짤), 나머지 이름은 새 그림이 덮음. 새 칸은 모두 오른쪽을 봄 (f 1)
#  · GOOD WILL 마운트 파운딩: 회색 상대 인형을 지움 (erase) — 지운 칸은 <시트>_noopp 폴더에
#  · 청광묵 팜 버스트 준비 (원화 한 장) 는 바탕을 지워 칸 하나로 (art)
#  · holes: 시트 별칭 목록 — 칸 안에 갇힌 흰 바탕을 지운 칸 폴더 (<시트>_nohole) 를 씀 (v1.1) · hole_opt: clear_holes 손보정 (흰 무늬가 많은 인물은 amin 을 키움)
# 실행: python3 -I tools/g4_foes.py <c4> <d4> <미리보기 폴더> [키 …]
import os, sys, json, re, shutil
import numpy as np
from PIL import Image
from scipy import ndimage
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); sys.path.insert(0, HERE)
import g4_moves as G
from g4_lib import alpha_bbox, crop, pack, preview
from g4_foes_cfg import FOES
from up1_seg import alpha_of
OUT = os.path.join(ROOT, 'art', 'foe4')

def old_idle(key):
    fn, box = FOES[key]['old']; im = Image.open(os.path.join(ROOT, fn)).convert('RGBA')
    if box: x, y, w, h = box; im = im.crop((x, y, x + w, y + h))
    return crop(im)

def erase_gray(im):
    """회색 상대 인형 (채도 낮은 중간 밝기 큰 덩어리) + 그 둘레 2px 의 어두운 윤곽을 지움 → 작은 부스러기도 지움"""
    a = np.asarray(im.convert('RGBA')).copy(); rgb = a[..., :3].astype(int); mx = rgb.max(2); sat = mx - rgb.min(2); on = a[..., 3] > 40
    m = on & (sat < 22) & (mx > 100) & (mx < 232)
    lab, n = ndimage.label(m, structure=np.ones((3, 3)))
    if not n: return im, 0
    H = on.shape[0]; area = ndimage.sum(m, lab, range(1, n + 1)); tot = on.sum(); cy = ndimage.center_of_mass(m, lab, range(1, n + 1))
    # 상대 인형: 아래쪽 (무게 중심이 높이 45% 아래) 의 큰 회색 덩어리 · 바닥 쪽 (아래 45%) 은 작은 회색 조각도 — 흰 머리 · 위쪽 외투 무늬는 그대로
    kill = np.isin(lab, [i + 1 for i in range(n) if (cy[i][0] > H * 0.45 and area[i] > tot * 0.012) or (cy[i][0] > H * 0.55 and area[i] > tot * 0.002)])
    low = np.zeros_like(on); low[int(on.shape[0] * 0.55):] = True   # 상대 인형은 바닥 (아래쪽) 에 누워 있음 — 흰 머리 · 외투 무늬는 건드리지 않게
    rim = ndimage.binary_dilation(kill, iterations=2) & ~kill & on & (sat < 30) & (mx < 150)
    rim |= ndimage.binary_dilation(kill, iterations=4) & ~kill & on & (sat < 28) & low   # 바닥 쪽 남은 윤곽 (밝은 테두리 · 어두운 선)
    a[kill | rim, 3] = 0
    on2 = a[..., 3] > 40; lab2, n2 = ndimage.label(on2, structure=np.ones((3, 3)))
    if n2 > 1:
        ar2 = ndimage.sum(on2, lab2, range(1, n2 + 1)); big = ar2.max()
        a[np.isin(lab2, [i + 1 for i in range(n2) if ar2[i] < big * 0.02])] = 0
    return Image.fromarray(a), int(kill.sum())

def sheet_bg(D4, sheet):
    """원본 시트 가장자리 바탕색 (이미 투명한 시트면 None)"""
    for ext in ('.png', '.webp', '.jpg', '.jpeg'):
        p = os.path.join(D4, sheet + ext)
        if os.path.exists(p):
            a = np.asarray(Image.open(p).convert('RGBA')); e = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
            return None if (e[:, 3] < 20).mean() > 0.5 else np.median(e[:, :3], 0)
    return None

def clear_holes(im, bg, loose=40, flat_d=20, sd=6, amin=40, fringe=150):
    """갇힌 바탕 지우기 (v1.1): 바탕색에 가까운 칸 (d < loose) 덩어리 중
       ① 고르고 (색 표준편차 sd 아래) 아주 바탕색 같은 (평균 d ≤ flat_d) amin px 넘는 것, ② 칸 안쪽 투명 구멍 (바깥과 안 이어진) 에 붙은 것 → 지움
       어두운 윤곽선이 벽이라 옷 · 머리로 번지지 않음 → 지운 곳 둘레 1px 밝은 번짐은 반투명"""
    a = np.asarray(im.convert('RGBA')).copy(); on = a[..., 3] > 40; rgb = a[..., :3].astype(int); d = np.abs(rgb - bg.astype(int)).sum(2)
    lab, n = ndimage.label(~on); border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    hole = ndimage.binary_dilation(~on & ~np.isin(lab, list(border)))
    near = on & (d < loose); lab2, n2 = ndimage.label(near); kill = np.zeros_like(on)
    if n2:
        idx = range(1, n2 + 1); ar = ndimage.sum(np.ones_like(d), lab2, idx); md = ndimage.mean(d, lab2, idx)
        touch = set(np.unique(lab2[hole & near])) - {0}
        for i in range(n2):
            j = i + 1
            if j in touch: kill |= lab2 == j; continue
            if ar[i] >= amin and md[i] <= flat_d:
                m = lab2 == j
                if rgb[m].std(0).max() <= sd: kill |= m
    a[kill, 3] = 0
    er = ndimage.binary_dilation(kill) & ~kill & on & (d < fringe); a[er, 3] = np.minimum(a[er, 3], 110)
    return Image.fromarray(a), int(kill.sum())

def prep(key, C4, D4):
    """칸 폴더 준비: art (원화 한 장 → 칸) · erase (지운 칸 폴더) → 짝 표 S 를 고쳐 돌려줌"""
    C = dict(FOES[key]); S = dict(C['S'])
    for al, fn in (C.get('art') or {}).items():
        d = os.path.join(C4, S[al]); p = os.path.join(d, 'r0c0.png')
        if not os.path.exists(p):
            os.makedirs(d, exist_ok=True); a = alpha_of(Image.open(os.path.join(D4, fn)).convert('RGB'))
            m = a[..., 3] > 40; lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=4)); sz = ndimage.sum(m, lab, range(1, n + 1))
            keep = lab == (int(np.argmax(sz)) + 1); a[~keep] = 0; crop(Image.fromarray(a)).save(p)
    for al, cells in (C.get('erase') or {}).items():
        src = os.path.join(C4, S[al]); dst = src + '_noopp'; os.makedirs(dst, exist_ok=True)
        for f in os.listdir(src):
            if not f.endswith('.png'): continue
            im = Image.open(os.path.join(src, f))
            if f[:-4] in cells: im, k = erase_gray(im); print(f'   {key} {al}:{f[:-4]} 상대 지움 {k}px')
            im.save(os.path.join(dst, f))
        S[al] = S[al] + '_noopp'
    for al in (C.get('holes') or []):   # v1.1 갇힌 흰 바탕
        bg = sheet_bg(D4, C['S'][al])
        if bg is None: continue
        src = os.path.join(C4, S[al]); dst = src + '_nohole'; os.makedirs(dst, exist_ok=True); tot = 0
        for f in os.listdir(src):
            if not f.endswith('.png'): continue
            im, k = clear_holes(Image.open(os.path.join(src, f)), bg, **C.get('hole_opt', {})); im.save(os.path.join(dst, f)); tot += k
        print(f'   {key} {al}: 갇힌 바탕 {tot}px 지움'); S[al] = S[al] + '_nohole'
    C['S'] = S
    return C

def main():
    C4, D4, PV = sys.argv[1], sys.argv[2], sys.argv[3]; only = set(sys.argv[4:])
    os.makedirs(OUT, exist_ok=True); os.makedirs(PV, exist_ok=True)
    jsp = os.path.join(ROOT, 'src', 'foe4.js'); M = {}
    if only and os.path.exists(jsp):
        s = open(jsp, encoding='utf-8').read(); i = s.index('const FOE4 = ') + len('const FOE4 = '); M = json.loads(s[i:s.index('};', i) + 1])
    for key in FOES:
        if only and key not in only: continue
        C = prep(key, C4, D4); old = old_idle(key)
        G.note_idle = lambda slug, _o=old: (G.fig_h(_o), 1.0, _o)   # 대기 키 = 지금 게임 대기 그림의 몸 키
        strips, F, D, g0, idle_im, rows = G.build(key, C, C4, D4)
        for f in os.listdir(OUT):
            if re.fullmatch(re.escape(key) + r'(_\d+)?\.webp', f): os.remove(os.path.join(OUT, f))
        pos, files = pack(strips, OUT, key)
        Q = {}
        for k, (St, cw, ch, ax, ay, cols, rws, n, play, mul, _) in strips.items():
            fn, x, y, PW, PH = pos[k]
            q = {'src': f'art/foe4/{fn}.webp', 'rect': [x, y, St.width, St.height, PW, PH], 'w': cw, 'h': ch, 'ax': ax, 'ay': ay, 'scale': round(g0 / D * mul, 4)}
            if n > 1: q.update({'n': n, 'cols': cols, 'rows': rws, **play})
            elif play: q.update(play)
            Q[k] = q
        for p, pl in (C.get('play') or {}).items():   # v1.2 움짤 빠르기 · 한 번만 손보정
            if p in Q:
                Q[p].update({a: b for a, b in pl.items() if a != 'once'})
                if 'once' in pl:
                    if pl['once']: Q[p]['once'] = 1
                    else: Q[p].pop('once', None)
        M[key] = {'poses': Q, 'keep': C.get('keep', []), **{a: C[a] for a in ('fidget', 'rest') if C.get(a)}}
        preview(rows, os.path.join(PV, key + '.jpg'), f'{key} · 서 있는 키 {F}px (지금 대기 그림) · 묶음 배율 {D:.3f} · ' + ' + '.join(f'{fn} {PW}x{PH}' for fn, PW, PH in files), std=F * D)
        print(f'{key:9} F {F:4} D {D:.3f} 동작 {len(Q):2} · ' + ' + '.join(f'{fn} {PW}x{PH} {os.path.getsize(os.path.join(OUT, fn + ".webp")) // 1024}KB' for fn, PW, PH in files))
    js = ("/* foe4.js — tools/g4_foes.py 가 만듦 (손으로 고치지 말 것). 4기 (2026-10-10, 드라이브 '1010 4기 업뎃') 적 · 1기 영웅 새 동작: 키 → 자세 (src · rect · 발 · 장 수 · 크기 scale)\n"
          "   SPR[키] 에 덮거나 더함 — keep 은 옛 자세 그대로 (움직이는 옛 대기 · 공격 움짤). 새 칸은 모두 오른쪽을 봄 (f 1)\n   S.foe4 = 새 동작이 있는 인물 (motion.js 가 걷기 · 맞음 · 넘어졌다 일어남 · 방어 · 공격 번갈아 · fidget · rest 를 고름) */\n"
          "'use strict';\nconst FOE4 = " + json.dumps(M, ensure_ascii=False, separators=(',', ':')) + ";\n"
          "(function(){ for (const [k, A] of Object.entries(FOE4)){ const S = SPR[k]; if (!S) continue; const keep = new Set(A.keep || []);\n"
          "  for (const [p, q] of Object.entries(A.poses)) if (!keep.has(p)) S.poses[p] = { f: 1, ...q, ...(q.flat ? { flat: true } : {}), ...(q.once ? { once: true } : {}) };\n"
          "  S.foe4 = true; if (A.fidget) S.fidget = A.fidget; if (A.rest) S.rest = A.rest; } })();\n")
    open(jsp, 'w', encoding='utf-8').write(js)
    print('src/foe4.js', len(M), '명')

if __name__ == '__main__': main()
