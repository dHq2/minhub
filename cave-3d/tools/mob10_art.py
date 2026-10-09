# mob10_art.py v1.1 — (v1.1: 꼬마악마 걷기에서 신발 신은 '워킹44' 칸을 빼고 다른 칸으로 · h0 = 대기 그림 실제 키 · 2장 달리기는 초당 4.5장 · rect 에 묶음 전체 W · H 까지) v1.0 — 잡몹 10명 (드라이브 '1차적 10인') 동작 그림 → 인물마다 묶음 그림 한 장 + src/mob10_sheets.js
#  원본: codex/img/m10/<키>__<동작>.webp (codex/tools/m10_poses.py 가 넣음)
#  · 시트마다 그린 크기가 달라서 (가로가 긴 자세는 작게 그려짐) 시트별 배율 F 로 맞춤 — 기본 자세 키를 기준 (대기 = 1.0)
#  · 여러 장 동작 (걷기 4 · 달리기 3 · 공격 2) 은 발 위치를 맞춘 같은 크기 칸으로 한 줄 띠를 만듦 (게임이 칸 격자로 재생)
#  · 출력: art/m10/<키>.webp (가로 2048 안) · src/mob10_sheets.js: const M10 = { 키: { src, W, H, h0, poses: { 동작: { rect [x, y, w, h, W, H], w, h, ax, ay, n, cols, fps, once, pingpong, flat } } } }
# 실행: python3 tools/mob10_art.py  (cave-3d 폴더에서)
import os, json
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); SRC = os.path.join(os.path.dirname(HERE), 'codex', 'img', 'm10'); OUT = os.path.join(HERE, 'art', 'm10')
IDLE_H = 300; MAXW = 2048; PAD = 6
# 시트별 배율 (그 시트 그림 키 ÷ 대기 키 의 10명 가운데 값으로 정한 것 — 2026-10-08 측정, 목표 키 비율 ÷ 측정 비율)
F = {'idle': 1.0, 'ready': 1.111, 'walk1': 0.98, 'walk2': 1.01, 'walk4': 1.096, 'walk5': 1.149, 'run1': 1.20, 'run2': 1.18, 'run3': 1.176, 'jump': 1.072,
     'windup': 1.137, 'attack1': 1.198, 'attack2': 1.221, 'attack3': 1.094, 'recover': 1.143, 'spwind': 1.19, 'special2': 0.86, 'pose3': 1.156, 'fin1': 1.235, 'fin2': 1.183,
     'ult': 0.832, 'ultfx': 0.876, 'hurt1': 1.112, 'hurt2': 1.118, 'stun': 1.11, 'guard': 1.066, 'guard2': 1.113, 'crouch': 1.048,
     'rest1': 0.985, 'rest2': 1.009, 'rest3': 1.026, 'dead': 1.136, 'dead2': 1.095}
MOBS = ['swordsman', 'shieldman', 'archer', 'spearman', 'foeCultist', 'foeDevil', 'bkShield', 'bkSpear', 'gwangnyang', 'bluefat']
SPECIAL = {'swordsman': 'ult', 'shieldman': 'ultfx', 'archer': 'fin1', 'spearman': 'ultfx', 'foeCultist': 'ultfx', 'foeDevil': 'special2', 'bkShield': 'special2', 'bkSpear': 'special2', 'gwangnyang': 'special2', 'bluefat': 'special2'}
WALK = {'foeDevil': ['walk5', 'walk1', 'walk2', 'walk1']}   # 꼬마악마: '워킹44' 칸만 신발을 신고 커서 뺌 (내딛기 · 지나기 · 내딛기 · 지나기)
def USE(k, have):
    """게임 동작 → (그림들, fps, once, pingpong, flat)"""
    run = ['run1', 'jump', 'run2'] if 'jump' in have else ['run1', 'run2']
    U = {'idle': (['idle'], 0, 0, 0, 0), 'ready': (['ready'], 0, 0, 0, 0),
         'walk': (WALK.get(k, ['walk4', 'walk1', 'walk5', 'walk2']), 6.5, 0, 0, 0), 'run': (run, 9 if 'jump' in have else 4.5, 0, 'jump' in have, 0),
         'windup': (['windup'], 0, 0, 0, 0), 'attack': (['attack2', 'recover'], 6, 1, 0, 0), 'attackB': (['attack3' if 'attack3' in have else 'attack1', 'recover'], 6, 1, 0, 0),
         'spwind': (['spwind'], 0, 0, 0, 0), 'special': ([SPECIAL[k]], 0, 0, 0, 0), 'hurt': (['hurt1'], 0, 0, 0, 0), 'hurt2': (['hurt2'], 0, 0, 0, 0), 'stun': (['stun'], 0, 0, 0, 0),
         'guard': (['guard'], 0, 0, 0, 0), 'crouch': (['crouch'], 0, 0, 0, 0), 'rest': (['rest1'], 0, 0, 0, 0), 'rest2': (['rest2'], 0, 0, 0, 0), 'rest3': (['rest3'], 0, 0, 0, 0),
         'dead': (['dead'], 0, 0, 0, 1), 'dead2': (['dead2'], 0, 0, 0, 1)}
    if 'jump' in have: U['jump'] = (['jump'], 0, 0, 0, 0)
    return {n: u for n, u in U.items() if all(f in have for f in u[0])}

def foot(im):
    a = np.asarray(im)[..., 3] > 60; h = a.shape[0]; band = a[int(h * 0.94):]
    cols = np.where(band.any(0))[0]
    return (int((cols.min() + cols.max()) / 2) if len(cols) else im.width // 2)

def strip(frames):
    """같은 크기 칸에 발 (아래 가운데) 을 맞춰 한 줄로"""
    fx = [foot(f) for f in frames]; ax = max(fx); cw = max(ax - x + f.width for f, x in zip(frames, fx)) + 2 * PAD; ch = max(f.height for f in frames) + 2 * PAD
    ax += PAD; S = Image.new('RGBA', (cw * len(frames), ch), (0, 0, 0, 0))
    for i, (f, x) in enumerate(zip(frames, fx)): S.paste(f, (i * cw + ax - x, ch - PAD - f.height), f)
    return S, cw, ch, ax, ch - PAD - 1

def shelf(items, W):
    x = y = rowh = 0; pos = {}
    for k, w, h in items:
        if x + w > W: x = 0; y += rowh + PAD; rowh = 0
        pos[k] = (x, y); x += w + PAD; rowh = max(rowh, h)
    return pos, y + rowh

def main():
    os.makedirs(OUT, exist_ok=True); A = {}
    for k in MOBS:
        have = {f[len(k) + 2:-5] for f in os.listdir(SRC) if f.startswith(k + '__')}
        ims = {p: Image.open(os.path.join(SRC, f'{k}__{p}.webp')).convert('RGBA') for p in have}
        s0 = IDLE_H / ims['idle'].height
        sc = {p: im.resize((max(1, round(im.width * s0 * F[p])), max(1, round(im.height * s0 * F[p]))), Image.LANCZOS) for p, im in ims.items()}
        strips = {}
        for n, (fs, fps, once, pp, flat) in USE(k, have).items():
            S, cw, ch, ax, ay = strip([sc[f] for f in fs]); strips[n] = (S, cw, ch, ax, ay, len(fs), fps, once, pp, flat)
        items = sorted(((n, v[0].width, v[0].height) for n, v in strips.items()), key=lambda t: -t[2])
        W = min(MAXW, max(sum(w for _, w, _ in items) // 3, max(w for _, w, _ in items)))
        pos, H = shelf(items, W)
        sheet = Image.new('RGBA', (W, H), (0, 0, 0, 0)); P = {}
        for n, (S, cw, ch, ax, ay, cnt, fps, once, pp, flat) in strips.items():
            x, y = pos[n]; sheet.paste(S, (x, y))
            q = {'rect': [x, y, S.width, S.height, W, H], 'w': cw, 'h': ch, 'ax': ax, 'ay': ay}
            if cnt > 1: q.update({'n': cnt, 'cols': cnt, 'rows': 1, 'fps': fps})
            if once: q['once'] = 1
            if pp: q['pingpong'] = 1
            if flat: q['flat'] = 1
            P[n] = q
        sheet.save(os.path.join(OUT, k + '.webp'), 'WEBP', quality=86, method=4)
        ia = np.asarray(sc['idle'])[..., 3] > 40; ys = np.where(ia.any(1))[0]
        A[k] = {'src': f'art/m10/{k}.webp', 'W': W, 'H': H, 'h0': int(ys.max() - ys.min() + 1), 'poses': P}   # h0 = 대기 그림 실제 키 (px)
        print(f'{k:11} {W}x{H} 동작 {len(P)} {os.path.getsize(os.path.join(OUT, k + ".webp")) // 1024}KB')
    js = ('/* mob10_sheets.js — tools/mob10_art.py 가 만듦 (손으로 고치지 말 것). 잡몹 10명 묶음 그림: 키 → 동작 → 칸 (rect) · 발 (ax, ay) · 여러 장이면 n · fps */\n'
          "'use strict';\nconst M10 = " + json.dumps(A, ensure_ascii=False, separators=(',', ':')) + ';\n')
    open(os.path.join(HERE, 'src', 'mob10_sheets.js'), 'w', encoding='utf-8').write(js)

if __name__ == '__main__': main()
