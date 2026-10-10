# mob9_art.py v1.1 (2026-10-10) — v1.1: 서방 둘 이름을 기획 캡처대로 (선도사녀 → 선도자 · 선도사남 → 목자, 키 seondoja · mokja) · 카밀라 · 헌팅나이프는 칭호를 앞에
# v1.0 — 4기 잡몹 9인 (동방 5 · 서방 4) 동작 → art/mob9/<키>.webp + src/mob9_sheets.js (M10 꼴 — motion.js 의 잡몹 자세 고르기 · 모닥불 쉼을 그대로 씀)
#  · 원본: 드라이브 '1010 4기 업뎃/4기몹' 3×3 시트 23장 (장마다 한 동작 · 아홉 명이 같은 자리) → tools/g4_cut.py 로 자른 칸 (<c4>/4기몹/<시트>/r?c?.png)
#  · 자리 (동방 라인업 1차 · 서방 넷 원화로 확인): r0c0 쌍부 · r0c1 방도끼 · r0c2 동방소총수 · r1c0 동방저격수 · r1c1 풀페이스가면 검사
#                                              r1c2 심계 소령 헌팅나이프 · r2c0 이계 라스트 솔져 카밀라 · r2c1 목자 (남) · r2c2 선도자 (여) — 기획 캡처 이름 (파일 이름은 선도사남 · 선도사녀)
#  · 크기: 시트마다 그린 배율이 인물마다 달라 (같은 인물도 ±30%) — 몸통 키 (가는 총 · 창은 뺀 테두리, g4_lib.body_box) 를 시트 자세 비율 R 로 서 있는 키에 맞춤
#    누운 시트 (죽음) 는 몸 길이 (가로) 로. 인물마다 눈으로 본 손보정 SK[키][시트] (머리 크기 대조)
#  · 대기 키 = TARGET px (게임 h0). 띠가 2048 을 넘으면 줄여 그리고 scale 로 되돌림
# 실행: python3 -I tools/mob9_art.py <c4> <미리보기 폴더> [키 …]
import os, sys, json, re
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); sys.path.insert(0, HERE)
from g4_lib import alpha_bbox, body_box, resize, strip, pack, preview
OUT = os.path.join(ROOT, 'art', 'mob9'); TARGET = 340
CHARS = [   # 키 · 자리 · 이름 (드라이브 파일 이름 그대로 — 도감에서 고치면 그 이름이 우선)
  ('ssangbu', 'r0c0', '쌍부'), ('bangdokki', 'r0c1', '방도끼'), ('eastRifle', 'r0c2', '동방소총수'), ('eastSniper', 'r1c0', '동방저격수'), ('maskBlade', 'r1c1', '풀페이스가면 검사'),
  ('huntKnife', 'r1c2', '심계 소령 헌팅나이프'), ('camilla', 'r2c0', '라스트 솔져 카밀라'), ('mokja', 'r2c1', '목자'), ('seondoja', 'r2c2', '선도자')]
# 시트: 별칭 → (폴더, 자세 키 비율 R (서 있는 몸통 키 대비), 잴 것 'h' 키 · 'w' 길이)
SHEETS = {
  'idle': ('한복과 군인 9인의 3×3 스프라이트 시트', 1.0, 'h'), 'walkA': ('스테이지 4 아홉 캐릭터 3x3 워크 스프라이트', 0.98, 'h'), 'walkB': ('9인 워크 프레임 2 캐릭터 시트', 0.99, 'h'),
  'walkC': ('스테이지 5_ 한복·군복 3×3 워킹 스프라이트', 0.98, 'h'), 'stride': ('한복과 군복 캐릭터 9인 스프라이트 시트', 0.94, 'h'),
  'ready': ('스테이지 11, 아홉 전사의 준비 자세', 0.88, 'h'), 'runA': ('스테이지 6_ 9인 우향 질주', 0.9, 'h'), 'runB': ('스테이지 7 아홉 인물의 공중 질주', 0.88, 'h'),
  'jump': ('스테이지 20_ 아홉 캐릭터 점프 스프라이트', 0.85, 'h'), 'windup': ('스테이지 8 9인 공격 준비 스프라이트 시트', 0.92, 'h'), 'strike': ('스테이지 9_ 아홉 전사의 강력한 일격', 0.88, 'h'),
  'follow': ('스테이지 10_ 9인 공격 후속 포즈', 0.88, 'h'), 'action': ('스테이지 12_ 한복·군복 아홉 인물의 3×3 액션 스프라이트', 0.88, 'h'),
  'stance': ('3x3 무기 든 전신 캐릭터 시트', 0.88, 'h'), 'spwind': ('완성된 아홉 전사의 3×3 스프라이트 시트', 0.88, 'h'), 'special': ('여백 있는 3×3 전투 스프라이트 시트', 0.88, 'h'),
  'hurt': ('스테이지 13_ 아홉 캐릭터의 피격 반동', 0.92, 'h'), 'stagger': ('스테이지 18_ 아홉 캐릭터의 휘청거림', 0.9, 'h'), 'guard': ('스테이지 19_ 아홉 수호자의 방어진', 0.92, 'h'),
  'crouch': ('스테이지 15_ 낮은 엄폐의 아홉 전사', 0.66, 'h'), 'rest': ('스테이지 17_ 아홉 영웅의 편안한 휴식', 0.66, 'h'), 'breathe': ('아홉 영웅의 숨 고르기', 0.64, 'h'),
  'dead': ('중앙에 누운 백발 가면 검객', 0.95, 'w')}
# 게임 자세 (motion.js 잡몹 이름) → 시트들 · 재생
POSES = {
  'idle': (['idle'], {}), 'ready': (['ready'], {}), 'walk': (['walkA', 'walkB', 'stride', 'walkB'], dict(fps=6.5)),   # 내딛기 · 지나기 · 내딛기 · 지나기 (walkC 는 walkA 와 거의 같아 뺌) 'run': (['runA', 'runB'], dict(fps=4.5)),
  'jump': (['jump'], {}), 'windup': (['windup'], {}), 'attack': (['strike', 'follow'], dict(fps=6, once=1)), 'attackB': (['action', 'follow'], dict(fps=6, once=1)),
  'spwind': (['spwind'], {}), 'special': (['special'], {}), 'stance': (['stance'], {}), 'hurt': (['hurt'], {}), 'hurt2': (['stagger'], {}), 'stun': (['stagger'], {}),
  'guard': (['guard'], {}), 'crouch': (['crouch'], {}), 'rest': (['rest'], {}), 'rest2': (['breathe'], {}), 'rest3': (['crouch'], {}), 'dead': (['dead'], dict(flat=1))}
SK = {   # 손보정: SK[키][시트] = 배율 곱 (미리보기 9명 × 23장을 한 줄씩 놓고 머리 크기 대조 — 도끼를 머리 위로 든 장은 몸통 키가 커 보여 작게 그려지던 것)
  'ssangbu': {'strike': 1.15, 'special': 1.12, 'windup': 1.05}, 'bangdokki': {'strike': 1.15, 'special': 1.12},
  'maskBlade': {'stride': 0.92, 'windup': 1.06}, 'camilla': {'spwind': 0.9, 'special': 0.9, 'runA': 0.95, 'runB': 0.95},
  'mokja': {'runA': 0.92}, 'seondoja': {'runB': 0.9}}

def cell(C4, al, c):
    p = os.path.join(C4, '4기몹', SHEETS[al][0], c + '.png')
    return Image.open(p).convert('RGBA') if os.path.exists(p) else None
def meas(im, mode):
    x0, y0, x1, y1 = body_box(im)
    return (y1 - y0) if mode == 'h' else (x1 - x0)

def build(key, c, C4):
    ims = {al: cell(C4, al, c) for al in SHEETS}
    sc = {}
    for al, (fold, R, mode) in SHEETS.items():
        im = ims[al]
        if im is None: continue
        sc[al] = TARGET * R / meas(im, mode) * SK.get(key, {}).get(al, 1.0)   # 몸통 키 (누운 것은 길이) 를 서 있는 키 × R 로
    # 대기 키는 몸통 키 (body_box) 라 대기 그림 전체 (총 · 도끼 포함) 는 TARGET 보다 클 수 있음 → 게임 h0 = TARGET (몸통 키)
    strips = {}; rows = []
    for pose, (als, play) in POSES.items():
        frames = [resize(ims[al], sc[al]) for al in als if ims.get(al) is not None]
        if not frames: continue
        s_draw = 1.0
        while True:
            fr = [resize(f, s_draw) for f in frames] if s_draw < 1 else frames
            St, cw, ch, ax, ay, cols, rws = strip(fr)
            if St.width <= 2048 and St.height <= 2040: break
            s_draw *= 0.9
        n = len(fr); pl = dict(play) if n > 1 else ({'flat': 1} if play.get('flat') else {})
        strips[pose] = (St, cw, ch, ax, ay, cols, rws, n, pl, 1 / s_draw, fr)
        rows.append((pose, fr, ' + '.join(f'{al} ×{sc[al]:.3f}' for al in als)))
    return strips, rows, sc

def main():
    C4, PV = sys.argv[1], sys.argv[2]; only = set(sys.argv[3:])
    os.makedirs(OUT, exist_ok=True); os.makedirs(PV, exist_ok=True)
    jsp = os.path.join(ROOT, 'src', 'mob9_sheets.js'); M = {}
    if only and os.path.exists(jsp):
        s = open(jsp, encoding='utf-8').read(); i = s.index('const MOB9_SHEETS = ') + len('const MOB9_SHEETS = '); M = json.loads(s[i:s.index('};', i) + 1])   # 머리 글에도 { } 가 있어 자리로 찾음
    for key, c, name in CHARS:
        if only and key not in only: continue
        strips, rows, sc = build(key, c, C4)
        for f in os.listdir(OUT):
            if re.fullmatch(re.escape(key) + r'(_\d+)?\.webp', f): os.remove(os.path.join(OUT, f))
        pos, files = pack(strips, OUT, key)
        Q = {}
        for k, (St, cw, ch, ax, ay, cols, rws, n, play, mul, _) in strips.items():
            fn, x, y, PW, PH = pos[k]
            q = {'src': f'art/mob9/{fn}.webp', 'rect': [x, y, St.width, St.height, PW, PH], 'w': cw, 'h': ch, 'ax': ax, 'ay': ay}
            if abs(mul - 1) > 1e-3: q['scale'] = round(mul, 4)
            if n > 1: q.update({'n': n, 'cols': cols, 'rows': rws, **play})
            elif play: q.update(play)
            Q[k] = q
        M[key] = {'name': name, 'h0': TARGET, 'poses': Q}
        preview(rows, os.path.join(PV, key + '.jpg'), f'{key} {name} · 대기 몸통 키 {TARGET}px · ' + ' + '.join(f'{fn} {PW}x{PH}' for fn, PW, PH in files), std=TARGET)
        print(f'{key:10} {name:12} 동작 {len(Q):2} · ' + ' + '.join(f'{fn} {PW}x{PH} {os.path.getsize(os.path.join(OUT, fn + ".webp")) // 1024}KB' for fn, PW, PH in files), flush=True)
    js = ("/* mob9_sheets.js — tools/mob9_art.py 가 만듦 (손으로 고치지 말 것). 4기 잡몹 9인 (2026-10-10, 드라이브 '1010 4기 업뎃/4기몹'): 키 → { 이름 · h0 (대기 몸통 키) · 자세 (src · rect · 발 · 장 수 · scale) }\n"
          "   mob9.js 가 M10 (잡몹 시트) 에 더함 → motion.js 가 SPR 를 통째로 바꾸고 잡몹 자세 고르기 (걷기 · 달리기 · 예고 · 침 · 맞음 · 휘청 · 막기 · 웅크림 · 모닥불 쉼 · 죽음) 를 그대로 씀 */\n"
          "'use strict';\nconst MOB9_SHEETS = " + json.dumps(M, ensure_ascii=False, separators=(',', ':')) + ";\n")
    open(jsp, 'w', encoding='utf-8').write(js)
    print('src/mob9_sheets.js', len(M), '명')

if __name__ == '__main__': main()
