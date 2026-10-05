# foe_art.py v1.1 — (v1.1: 한 인물의 모든 자세를 같은 배율로 (대기 자세 높이 기준) — 자세마다 크기가 달라지던 것)
# v1.0 — 도감 (codex/img)의 적 · 보스 그림 → cave-3d/art/foe/<키>_<자세>.webp
#  · 움직이는 webp (여러 장)는 한 장의 격자 시트로 (가로 최대 8칸). 모든 장의 그림 테두리를 합쳐 같은 크기로 잘라 발 위치가 흔들리지 않게
#  · 한 장짜리 그림은 그대로 (테두리만 잘라 냄). 너무 크면 칸 높이를 MAXH로 줄임
#  · 결과표 (art/foe/sheets.json): 키 · 자세 → { file, w, h, cols, rows, n, ax, ay } — src/foes2.js가 이 숫자를 씀
#  · src/foe_sheets.js 도 같이 씀
# 실행: python3 tools/foe_art.py  (cave-3d 폴더에서)
import os, json
from PIL import Image
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); CODEX = os.path.join(os.path.dirname(HERE), 'codex', 'img')
OUT = os.path.join(HERE, 'art', 'foe'); MAXH = 360
# 키 · 자세 · 원본 (codex/img 기준, '@'로 시작하면 cave-3d 기준)
SRC = [
    ('borama', 'idle', 'char/borama_idle.webp'), ('borama', 'attack', 'char/borama_light_attack.webp'), ('borama', 'heavy', 'char/borama_heavy_attackandskill.webp'),
    ('catw', 'idle', 'char/catwarrior_idle.webp'), ('catw', 'attack', 'char/catwarrior_scratch.webp'), ('catw', 'pounce', 'char/catwarrior_pounce.webp'),
    ('cs', 'idle', 'cs/cs_idle.webp'), ('cs', 'attack', 'cs/cs_chop.webp'), ('cs', 'jump', 'cs/cs_jump_chop.webp'),
    ('jakyak', 'idle', 'char/jakyak_ready_idle.webp'), ('jakyak', 'attack', 'char/jakyak_art.webp'),
    ('bogwang', 'idle', 'bg_anim/bogwang_idle.webp'), ('bogwang', 'attack', 'bg_anim/bogwang_attack.webp'), ('bogwang', 'groove', 'bg_anim/bogwang_groove.webp'),
    ('bk', 'idle', 'bk/bk_idle.webp'), ('bk', 'walk', 'bk/bk_walk.webp'), ('bk', 'attack', 'bk/bk_double_slash.webp'), ('bk', 'heavy', 'bk/bk_heavy_slash.webp'), ('bk', 'thrust', 'bk/bk_thrust.webp'), ('bk', 'kick', 'bk/bk_roundhouse.webp'), ('bk', 'bash', 'bk/bk_shoulder_bash.webp'),
    ('slimeGirl', 'idle', 'char/slime_idle.webp'),
    ('ratKnight', 'idle', '@assets/ratknight_idle.png'),
    ('gwangnyang', 'idle', 'npc/N-011.webp'), ('gwangnyang', 'attack', 'npc/N-012.webp'),
    ('eyemon', 'idle', 'char/eyemon.webp'), ('bluefat', 'idle', 'char/bluefat.webp'),
    ('janggun', 'idle', 'npc/N-046.webp'), ('axeKnight', 'idle', 'char/axeknight.webp'), ('general', 'idle', 'char/general_art.webp'),
    ('bkShield', 'idle', 'npc/N-005.webp'), ('bkSpear', 'idle', 'npc/N-056.webp'),
    ('crabchef', 'idle', 'char/crabchef.webp'), ('smoker', 'idle', 'prop/H-341.webp'), ('tehera', 'idle', 'char/tehera_sit.webp'),
    ('cesar', 'idle', '@assets/cesar_idle.png'), ('cesar', 'windup', '@assets/cesar_prep.png'), ('cesar', 'attack', '@assets/cesar_strike.png'), ('cesar', 'special', '@assets/cesar_special.png'),
    ('cesar', 'guard', '@assets/cesar_guard.png'), ('cesar', 'back', '@assets/cesar_back.png'), ('cesar', 'raise', '@assets/cesar_raise.png'), ('cesar', 'hurt', '@assets/cesar_hurt.png'), ('cesar', 'thrust', '@assets/cesar_thrust.png'),
]
def frames(path):
    im = Image.open(path); out = []
    for i in range(getattr(im, 'n_frames', 1)):
        im.seek(i); out.append(im.convert('RGBA').copy())
    return out
os.makedirs(OUT, exist_ok=True); table = {}; KK = {}
def load(src):
    p = os.path.join(HERE, src[1:]) if src.startswith('@') else os.path.join(CODEX, src)
    fs = frames(p); box = None
    for f in fs:
        b = f.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox()
        if b: box = b if not box else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    return fs, box
for key, pose, src in SRC:   # 배율: 대기 자세 (첫 자세)의 높이로
    if key not in KK: fs, box = load(src); KK[key] = min(1, MAXH / (box[3] - box[1]))
for key, pose, src in SRC:
    fs, _ = load(src)
    box = None
    for f in fs:
        b = f.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox()
        if b: box = b if not box else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    fs = [f.crop(box) for f in fs]
    w, h = fs[0].size; k = KK[key]
    if k < 1: fs = [f.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS) for f in fs]; w, h = fs[0].size
    n = len(fs); cols = min(8, n); rows = (n + cols - 1) // cols
    sheet = Image.new('RGBA', (cols * w, rows * h), (0, 0, 0, 0))
    for i, f in enumerate(fs): sheet.paste(f, ((i % cols) * w, (i // cols) * h))
    name = f'{key}_{pose}.webp'; sheet.save(os.path.join(OUT, name), 'WEBP', quality=88, method=4)
    # 발 위치: 아래 8% 줄의 그림 가운데 (모든 장 합침)
    a = None
    for f in fs:
        al = f.getchannel('A'); band = al.crop((0, int(h * 0.92), w, h)).point(lambda v: 255 if v > 30 else 0).getbbox()
        if band: a = band if not a else (min(a[0], band[0]), 0, max(a[2], band[2]), 0)
    ax = round((a[0] + a[2]) / 2) if a else w // 2
    table.setdefault(key, {})[pose] = {'file': name, 'w': w, 'h': h, 'cols': cols, 'rows': rows, 'n': n, 'ax': ax, 'ay': h - 1}
    print(key, pose, n, (w, h), 'ax', ax)
json.dump(table, open(os.path.join(OUT, 'sheets.json'), 'w'), ensure_ascii=False, indent=1)
# 게임이 바로 읽게 JS로도 (src/foe_sheets.js — 손으로 고치지 않음)
open(os.path.join(HERE, 'src', 'foe_sheets.js'), 'w').write('/* foe_sheets.js — tools/foe_art.py가 만듦. 손으로 고치지 않음. 키 → 자세 → 시트 칸 크기 · 발 위치 */\nconst FOE_SHEETS = ' + json.dumps(table, ensure_ascii=False, separators=(',', ':')) + ';\n')
