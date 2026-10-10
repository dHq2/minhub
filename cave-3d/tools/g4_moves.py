# g4_moves.py v1.1 (2026-10-10) — 4기 (드라이브 '1010 4기 업뎃') 동작 → 인물마다 동작 묶음 그림 art/h2/mov4/<slug>.webp + src/h2_mov4.js (H2MOV4)
#  v1.1: 소환물 outline (가장자리 바탕만 지움 · 그림자 빼기) · 노트에 res (자원 유닛) · wide · sk (시트 배율 손보정 — 머리 크기 대조) · 펄 움짤 배율 = 대기 움짤의 몸 키 (머리 꼭대기 → 발, 창 빼고) 를 노트 대기 키에 맞춤 × 움짤마다 ak (머리 크기 눈 비교) — 머리 색 넓이 방식은 그림마다 달라서 버림
#  v1.0: 처음
#  · 짝 표: tools/g4_moves_cfg.py (CFG · SUMMONS). 칸: tools/g4_cut.py 로 자른 칸 폴더. 움짤: 내려받은 원본 폴더
#  · 크기: h2_moves.py 와 같은 방식 — 서 있는 키를 TARGET (420) 으로 묶고 게임 크기 scale = 노트 대기 그림 기준
#     새 인물은 노트 (art/h2/notes/<slug>.json) 를 만들고 대기 칸이 노트 대기 그림 (h2_roster → h2_atlas 4기 판)
#  · H2MOV4 는 h2_mov4.js 가 불러올 때 H2MOV 에 합쳐짐 (같은 동작 이름이면 4기 그림이 덮음). 동작마다 src 를 따로 적음
#  · 모든 칸은 오른쪽을 보게 맞춤 (f 1) — 반대를 보는 칸은 짝 표에서 '!칸' 으로 뒤집음
#  · 미리보기: <미리보기 폴더>/<slug>.jpg (동작마다 한 줄)
# 실행: python3 -I tools/g4_moves.py <자른 칸 폴더 c4> <원본 폴더 d4> <미리보기 폴더> [slug …]
import os, sys, json, re
import numpy as np
from PIL import Image, ImageOps
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); sys.path.insert(0, HERE)
from g4_lib import alpha_bbox, crop, foot, strip, resize, anim_frames, body_cx, pack, preview, RATIO, PLAY, ONCE
from g4_moves_cfg import CFG, SUMMONS, DATE, BATCH
from up1_seg import alpha_of
OUT = os.path.join(ROOT, 'art', 'h2', 'mov4'); NOTES = os.path.join(ROOT, 'art', 'h2', 'notes'); CODEX = os.path.join(os.path.dirname(ROOT), 'codex')
TARGET = 420; TARGET_ANIM = 320
FLAT = {'down', 'dead', 'down2', 'dead2'}

def load_cell(C4, sheet, c):
    flip = c.startswith('!'); c = c.lstrip('!')
    im = crop(Image.open(os.path.join(C4, sheet, c + '.png')).convert('RGBA'))
    return ImageOps.mirror(im) if flip else im
def fig_h(im): x0, y0, x1, y1 = alpha_bbox(im); return y1 - y0
def note_idle(slug):
    o = json.load(open(os.path.join(NOTES, slug + '.json'), encoding='utf-8')); p = o['poses']['idle']
    im = Image.open(os.path.join(ROOT, p['src'])).convert('RGBA'); return fig_h(im), p.get('gscale', 1.0), im
def hair_top(im):
    """금발 머리 덩어리 (가장 큰 것) 의 꼭대기 y — 창 · 날개를 빼고 몸 키를 재려고"""
    from scipy import ndimage
    a = np.asarray(im.convert('RGBA')).astype(float); r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    mx = np.maximum(np.maximum(r, g), b); mn = np.minimum(np.minimum(r, g), b); sat = (mx - mn) / np.maximum(1, mx)
    m = (al > 120) & (r > 150) & (g > 110) & (r >= g) & (g > b + 25) & (sat > 0.22) & (mx > 140)
    m2 = ndimage.binary_closing(m, iterations=4); lab, k = ndimage.label(m2)
    if k == 0: return alpha_bbox(im)[1]
    sz = ndimage.sum(m2, lab, range(1, k + 1)); ys = np.where(lab == int(np.argmax(sz)) + 1)[0]
    return int(ys.min())

def face_of(im):
    """대기 그림에서 얼굴 네모 (머리 둘레) → 256px"""
    a = np.asarray(im)[..., 3] > 60; h = im.height; ys = np.where(a.any(1))[0]; top = int(ys[0]) if len(ys) else 0
    band = a[top:top + max(4, int(h * 0.16))]; xs = np.where(band.any(0))[0]; cx = int(np.median(xs)) if len(xs) else im.width // 2
    side = max(32, int(h * 0.22)); x0 = max(0, cx - side // 2); y0 = max(0, top - int(h * 0.01))
    box = im.crop((x0, y0, x0 + side, y0 + side)); F = Image.new('RGB', (side, side), (238, 236, 232)); F.paste(box, (0, 0), box)
    return F.resize((256, 256), Image.LANCZOS)

def build(slug, C, C4, D4):
    """→ (strips {동작: (S, cw, ch, ax, ay, cols, rows, n, play, mul, frames)}, F, D, g0, note 자료 또는 None, 미리보기 줄)"""
    S = C.get('S', {}); new = C.get('new'); rows = []
    if new and new.get('idle_from'):
        F, g0, idle_im = note_idle(new['idle_from'])
    elif new:
        sh, c = C['idle']; idle_im = load_cell(C4, S[sh], c)
        if idle_im.height > 640: idle_im = resize(idle_im, 640 / idle_im.height)
        F, g0 = fig_h(idle_im), 1.0
    else:
        F, g0, idle_im = note_idle(slug)
    D = min(1.0, TARGET / F)
    # 시트마다 배율: 기준 칸 (refs) 의 키 = 서 있는 키 × 비율
    scale = {}
    for al, sheet in S.items():
        est = []
        for c, r in (C.get('refs', {}).get(al) or []):
            est.append(F * D * r / fig_h(load_cell(C4, sheet, c)))
        if not est:
            for pose, L in C.get('P', {}).items():
                for al2, cells in L:
                    if al2 != al or pose not in RATIO: continue
                    for c in cells: est.append(F * D * RATIO[pose] / fig_h(load_cell(C4, sheet, c)))
        if not est and new and C.get('idle') and C['idle'][0] == al and not new.get('idle_from'):
            est = [F * D / fig_h(load_cell(C4, sheet, C['idle'][1]))]
        scale[al] = float(np.median(est)) * C.get('sk', {}).get(al, 1.0) if est else None   # sk: 머리 크기 대조로 고친 시트 배율 (서 있는 칸이 없는 시트)
    strips = {}
    for pose, L in C.get('P', {}).items():
        frames = []
        for al, cells in L:
            s = scale.get(al)
            if s is None: raise SystemExit(f'{slug}: 시트 {al} 배율 기준 없음 ({pose})')
            for c in cells: frames.append(resize(load_cell(C4, S[al], c), s))
        St, cw, ch, ax, ay, cols, rws = strip(frames)
        n = len(frames); play = (PLAY.get(pose) or ONCE) if n > 1 else ({'flat': 1} if pose in FLAT else {})
        strips[pose] = (St, cw, ch, ax, ay, cols, rws, n, play, 1.0, frames)
        rows.append((pose, frames, f"{' + '.join(al + ':' + ','.join(cs) for al, cs in L)} ×{scale[L[0][0]]:.3f}"))
    # 움짤
    A = C.get('A') or {}
    s_idle = None
    if A and C.get('scale_by') == 'idle':
        # 대기 움짤의 몸 키 (머리 꼭대기 → 발 · 머리 위로 솟은 창은 뺌) = 노트 대기 키
        f0, s0, e0, n0, m0, p0 = A['idle']; fr0, _ = anim_frames(os.path.join(D4, f0), [s0])
        body = alpha_bbox(fr0[0])[3] - hair_top(fr0[0]); s_idle = F * D / body
    for pose, (fn, a, b, n, mode, play) in A.items():
        idx = sorted(set(round(a + (b - a) * i / max(1, n - 1)) for i in range(n)))
        frs, tot = anim_frames(os.path.join(D4, fn), idx)
        if s_idle:
            s = s_idle * C.get('ak', {}).get(pose, 1.0)   # 움짤마다 그린 배율이 조금씩 다름 → ak (대기 움짤 대비, 머리 크기로 맞춤)
            std = TARGET_ANIM / (F * D)   # 움짤은 서 있는 키 TARGET_ANIM 으로 (창이 길어서) — 게임 크기에서 되돌림
        else:
            ri, rr = C.get('aref', (0, 1.0)); fr_ref, _ = anim_frames(os.path.join(D4, fn), [ri]); s = F * D * rr / fig_h(crop(fr_ref[0])); std = TARGET_ANIM / (F * D)
        s_draw = min(1.0, s * min(1.0, std)); mul = s / s_draw
        # 자리: fix = 모든 장 테두리 합 (그린 자리 그대로) · track = 몸 가운데를 따라 창 (가로로 날아가는 동작)
        boxes = [alpha_bbox(f, 40) for f in frs]
        r0 = boxes[0]; ground = r0[3]
        if mode == 'fix':
            ux0 = min(b[0] for b in boxes); uy0 = min(b[1] for b in boxes); ux1 = max(b[2] for b in boxes); uy1 = max(max(b[3] for b in boxes), ground)
            fx = r0[0] + foot(frs[0].crop(r0))
            crops = [f.crop((ux0, uy0, ux1, uy1)) for f in frs]; axp, ayp = fx - ux0, ground - uy0
        else:
            cxs = [body_cx(f.crop(b)) + b[0] for f, b in zip(frs, boxes)]; hstd = fig_h(crop(frs[0]))
            cap = 2.4 * hstd; Lw = min(cap, max(cx - b[0] for cx, b in zip(cxs, boxes))); Rw = min(cap, max(b[2] - cx for cx, b in zip(cxs, boxes)))
            uy0 = min(b[1] for b in boxes); uy1 = max(max(b[3] for b in boxes), ground)
            crops = []
            for f, cx in zip(frs, cxs):
                X0 = int(round(cx - Lw)); X1 = int(round(cx + Rw)); cnv = Image.new('RGBA', (X1 - X0, uy1 - uy0), (0, 0, 0, 0)); cnv.paste(f.crop((max(0, X0), uy0, min(f.width, X1), uy1)), (max(0, X0) - X0, 0)); crops.append(cnv)
            axp, ayp = Lw, ground - uy0
        raw = crops
        while True:   # 띠가 한 판 (2048) 에 들게: 넘치면 조금씩 줄임 (게임 크기 mul 로 되돌림)
            crops = [resize(c, s_draw) for c in raw]
            St, cw, ch, ax, ay, cols, rws = strip(crops, fix=(round(axp * s_draw), round(ayp * s_draw) - 1))
            if St.height <= 2040 and St.width <= 2048: break
            s_draw *= 0.88
        mul = s / s_draw
        strips[pose] = (St, cw, ch, ax, ay, cols, rws, len(crops), play, mul, crops)
        rows.append((pose, crops, f'움짤 {os.path.basename(fn)[:-5]} {idx[0]}~{idx[-1]} ({len(crops)}/{tot}장) ×{s:.3f}', mul))
    return strips, F, D, g0, idle_im, rows

def write_note(slug, C, idle_im, D4, C4):
    new = C['new']; d = os.path.join(ROOT, 'art', 'h2', slug); os.makedirs(d, exist_ok=True)
    if new.get('idle_from'):
        src = json.load(open(os.path.join(NOTES, new['idle_from'] + '.json'), encoding='utf-8'))
        idle = dict(src['poses']['idle']); face = src.get('face')
    else:
        im = crop(idle_im); x0, y0, x1, y1 = alpha_bbox(im)
        pad = Image.new('RGBA', (im.width, im.height + 3), (0, 0, 0, 0)); pad.paste(im, (0, 0)); pad.save(os.path.join(d, 'idle.webp'), 'WEBP', quality=90, method=4)
        idle = {'src': f'art/h2/{slug}/idle.webp', 'w': pad.width, 'h': pad.height, 'ax': x0 + foot(im.crop((x0, y0, x1, y1))), 'ay': y1, 'orig': '4기 대기 칸 ' + ' '.join(C['idle'])}
        face_of(im).save(os.path.join(d, 'face.webp'), 'WEBP', quality=88, method=4); face = f'art/h2/{slug}/face.webp'
    o = {'slug': slug, 'name': new['name'], 'rank': new['rank'], 'role': new['role'], 'tall': new['tall'], 'weight': new['weight'], 'tag': new['tag'], 'role_job': new['role_job'],
         'bag': new['bag'], 'apt': new['apt'], 'gen': 4, 'date': DATE, 'batch': BATCH, 'desc': new['desc'], 'face': face, 'poses': {'idle': idle}}
    if new.get('codex'): o['codex_g'] = new['codex']; o['codex_face'] = 0   # 도감에 이미 있는 인물: 그 묶음으로 · 얼굴은 도감 것
    json.dump(o, open(os.path.join(NOTES, slug + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    md = (f"# {new['name']} ({slug}) v1.0 — {BATCH} ({DATE})\n\n- 등급 {new['rank']} · {new['role']} · 보직 {new['role_job']} · 키 {new['tall']}m · 무게 {new['weight']}kg\n- {new['desc']}\n"
          f"- 그림: 대기 = {':'.join(C['idle']) if C.get('idle') else new.get('idle_from', '') + ' 노트 대기'} · 동작 묶음 art/h2/mov4/{slug}.webp (tools/g4_moves.py, 짝 표 tools/g4_moves_cfg.py)\n")
    open(os.path.join(NOTES, slug + '.md'), 'w', encoding='utf-8').write(md)

def summon_note(slug, D4):
    fn, side, meta = SUMMONS[slug]
    im = Image.open(os.path.join(D4, fn)); a = np.asarray(im.convert('RGBA')).copy()
    if (a[..., 3] < 20).mean() < 0.05:   # 흰 바탕 원화 → 바탕 지움
        if meta.get('outline'):   # 투명한 몸 (거품) 속 흰 빛이 같이 지워지지 않게: 가장자리에서 이어진 바탕만 + 바닥 그림자 (옅은 회색)
            from g4_cut import alpha_outline
            from scipy import ndimage as ndi
            a = alpha_outline(im.convert('RGB')); rgb = a[..., :3].astype(int); mn = rgb.min(2); sat = rgb.max(2) - mn
            wall = ndi.binary_dilation(mn < 170, iterations=2); bg = a[..., 3] == 0
            lab, n = ndi.label(((mn > 170) & (sat < 16) & ~wall) | bg)   # 다리 사이에 갇힌 흰 바탕 · 그림자: 진한 선 안 넘고 바탕과 이어진 무채색 칸
            keep_bg = np.unique(lab[bg]); kill = np.isin(lab, keep_bg[keep_bg > 0])
            a[kill, 3] = 0
        else: a = alpha_of(im.convert('RGB'))
    from scipy import ndimage
    m = a[..., 3] > 40; lab, n = ndimage.label(ndimage.binary_dilation(m, iterations=6))
    sizes = ndimage.sum(m, lab, range(1, n + 1)); order = np.argsort(sizes)[::-1]
    picks = [i + 1 for i in order[:2]] if side is not None else [order[0] + 1]
    if side is not None:
        picks.sort(key=lambda k: np.where(lab == k)[1].mean()); keep = lab == picks[side]
    else:
        big = sizes.max(); keep = np.isin(lab, [i + 1 for i in range(n) if sizes[i] > big * 0.08])
    b = a.copy(); b[~keep] = 0; im2 = crop(Image.fromarray(b))
    k = min(1.0, 600 / im2.height); im2 = resize(im2, k)
    d = os.path.join(ROOT, 'art', 'h2', slug); os.makedirs(d, exist_ok=True)
    pad = Image.new('RGBA', (im2.width, im2.height + 3), (0, 0, 0, 0)); pad.paste(im2, (0, 0)); pad.save(os.path.join(d, 'idle.webp'), 'WEBP', quality=90, method=4)
    face_of(im2).save(os.path.join(d, 'face.webp'), 'WEBP', quality=88, method=4)
    x0, y0, x1, y1 = alpha_bbox(im2)
    o = {'slug': slug, 'name': meta['name'], 'rank': '소환', 'role': '소환물', 'tall': meta['tall'], 'weight': meta['weight'], 'tag': 'construct', 'role_job': meta['role_job'], 'bag': 0,
         'apt': {'melee': 3, 'spear': 0, 'bow': 0, 'gun': 0, 'magic': 2, 'stealth': 0}, 'gen': 4, 'date': DATE, 'batch': BATCH, 'desc': meta['desc'], 'summon': 'serpa',
         'face': f'art/h2/{slug}/face.webp', 'poses': {'idle': {'src': f'art/h2/{slug}/idle.webp', 'w': pad.width, 'h': pad.height, 'ax': x0 + foot(im2.crop((x0, y0, x1, y1))), 'ay': y1, 'orig': '원화 ' + os.path.basename(fn)}}}
    if meta.get('res'): o['res'] = 1        # 자원 유닛 (세르파가 모아서 유닛을 뽑음)
    if meta.get('wide'): o['wide'] = 1
    json.dump(o, open(os.path.join(NOTES, slug + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    return im2

def main():
    C4, D4, PV = sys.argv[1], sys.argv[2], sys.argv[3]; only = set(sys.argv[4:])
    os.makedirs(OUT, exist_ok=True); os.makedirs(PV, exist_ok=True)
    jsp = os.path.join(ROOT, 'src', 'h2_mov4.js'); MOV = {}
    if only and os.path.exists(jsp):
        s = open(jsp, encoding='utf-8').read(); MOV = json.loads(s[s.index('{'):s.index('};') + 1])
    for slug, C in CFG.items():
        if only and slug not in only: continue
        strips, F, D, g0, idle_im, rows = build(slug, C, C4, D4)
        if C.get('new'): write_note(slug, C, idle_im, D4, C4)
        for f in os.listdir(OUT):
            if re.fullmatch(re.escape(slug) + r'(_\d+)?\.webp', f): os.remove(os.path.join(OUT, f))
        for k, v in strips.items():
            if v[0].height > 1400 or v[0].width > 2048: print(f'   큰 띠 {slug}.{k}: {v[0].width}x{v[0].height} (칸 {v[1]}x{v[2]} · {v[7]}장)')
        pos, files = pack({k: v for k, v in strips.items()}, OUT, slug)
        Q = {}
        for k, (St, cw, ch, ax, ay, cols, rws, n, play, mul, _) in strips.items():
            fn, x, y, PW, PH = pos[k]
            q = {'src': f'art/h2/mov4/{fn}.webp', 'rect': [x, y, St.width, St.height, PW, PH], 'w': cw, 'h': ch, 'ax': ax, 'ay': ay, 'scale': round(g0 / D * mul, 4)}
            if n > 1: q.update({'n': n, 'cols': cols, 'rows': rws, **play})
            elif play: q.update(play)
            Q[k] = q
        MOV[slug] = {'src': f'art/h2/mov4/{files[0][0]}.webp', 'poses': Q, 'v4': 1}
        preview(rows, os.path.join(PV, slug + '.jpg'), f'{slug} · 서 있는 키 {F}px · 묶음 배율 {D:.3f} · ' + ' + '.join(f'{fn} {PW}x{PH}' for fn, PW, PH in files), std=F * D)
        print(f'{slug:12} F {F:4} D {D:.3f} 동작 {len(Q):2} · ' + ' + '.join(f'{fn} {PW}x{PH} {os.path.getsize(os.path.join(OUT, fn + ".webp")) // 1024}KB' for fn, PW, PH in files))
    for slug in SUMMONS:
        if only and slug not in only: continue
        im = summon_note(slug, D4); print(f'{slug:12} 소환물 노트 · 대기 {im.width}x{im.height}')
    js = ('/* h2_mov4.js — tools/g4_moves.py 가 만듦 (손으로 고치지 말 것). 4기 (2026-10-10, 드라이브 \'1010 4기 업뎃\') 동작 묶음: 인물 → 동작 칸 (src · rect · 발 · 장 수 · 게임 크기 scale)\n'
          '   불러올 때 H2MOV 에 합침 — 같은 동작 이름이면 4기 그림이 덮음 (h2.js h2Build 가 노트 동작 위에 덮어씀). 모든 칸은 오른쪽을 봄 (f 1) */\n'
          "'use strict';\nconst H2MOV4 = " + json.dumps(MOV, ensure_ascii=False, separators=(',', ':')) + ';\n'
          '(function(){ for (const [s, M] of Object.entries(H2MOV4)){ const O = H2MOV[s]; if (!O) H2MOV[s] = M; else O.poses = Object.assign({}, O.poses, M.poses); } })();\n')
    open(jsp, 'w', encoding='utf-8').write(js)
    print('src/h2_mov4.js', len(MOV), '명')

if __name__ == '__main__': main()
