# gwangnyang_idle.py v1.0 (2026-10-09) — 광냥 = 검냥이 (민수 메모로 합침): 검냥이 '차분한 대기' 20장 (도감 움직이는 webp) → 게임 시트
#  입력: codex/img/char/catwarrior_calm_idle.webp (460×1276 · 20장)  출력: art/foe/gwangnyang_calm.webp (10×2 칸, 칸마다 키 360)
#  발 (ax, ay) 은 구두 밑창 · 그림자 가운데. 게임 쪽 자세 정의는 src/motion.js 의 M10_IDLE (크기 scale 은 잡몹 시트 대기와 키를 맞춤)
import os, json
from PIL import Image, ImageSequence
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); CODEX = os.path.join(os.path.dirname(ROOT), 'codex')
SRC = os.path.join(CODEX, 'img/char/catwarrior_calm_idle.webp'); OUT = os.path.join(ROOT, 'art/foe/gwangnyang_calm.webp')
fr = [x.convert('RGBA') for x in ImageSequence.Iterator(Image.open(SRC))]
U = None
for x in fr:
    b = x.split()[3].point(lambda v: 255 if v > 40 else 0).getbbox()
    U = b if U is None else (min(U[0], b[0]), min(U[1], b[1]), max(U[2], b[2]), max(U[3], b[3]))
FOOT = (258, 1262)                         # 원본 장에서 발 (그림자 가운데)
H = 360; s = H / (U[3] - U[1]); W = round((U[2] - U[0]) * s)
C = 10; R = (len(fr) + C - 1) // C
sheet = Image.new('RGBA', (W * C, H * R), (0, 0, 0, 0))
for i, x in enumerate(fr):
    sheet.paste(x.crop(U).resize((W, H), Image.LANCZOS), ((i % C) * W, (i // C) * H))
sheet.save(OUT, 'WEBP', quality=88, method=6)
print(json.dumps({'src': 'art/foe/gwangnyang_calm.webp', 'w': W, 'h': H, 'cols': C, 'rows': R, 'n': len(fr), 'ax': round((FOOT[0] - U[0]) * s), 'ay': round((FOOT[1] - U[1]) * s), 'figure': round((FOOT[1] - U[1]) * s)}), os.path.getsize(OUT))
