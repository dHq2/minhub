# kar_poses.py v1.2 — (v1.2: 사망 그림 dead — 드라이브 카리우스 폴더 '카리우스 사망', 가짜 체크무늬 바탕을 걷어냄 (2026-10-08)) (v1.1: 카리우스 옛 항목 (초상화 · 원화 · 도형)도 같은 묶음으로 — 초상화 모음에 카리우스가 둘 뜨던 것)
# v1.0 — 3D판 카리우스 새 그림 (cave-3d/art/kar, 민수 드라이브 '카리우스' 폴더)을 도감 카리우스 칸에 넣음
#  · 동작 그림: art/kar/<키>.webp → codex/img/karius/<키>.webp (높이 300) · 항목 id O-kar-<키>, sub '카리우스 · 동료 · 동작 그림'
#  · 스킬 그림 (액자): 개조된 신체 · 근성 · 잡아뚫기 · 불경자 → img/karius/icon_*.webp · 항목 SK-kar-<키> (cat card, sub '스킬 · 카리우스 고유')
#  · 불경자 컷씬 · 원화 2 (흰 바탕) → P-karius-cut · P-karius-art2
#  · 레베카 동작 그림 (P-rebecca-*): 이제 3D 동료로 씀 → on = true, game 메모
#  · 쥐 기사 (O-ratKnight-*): 적으로는 안 나옴 — 굴 순찰 메모
#  · 이미 있으면 이름 · 쓰는 곳만 고침 (체크 · 메모는 id에 붙어 있어 그대로)
# 실행: python3 codex/tools/kar_poses.py  (그다음 python3 codex/tools/pack.py)
import os, json
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); ART = os.path.join(os.path.dirname(ROOT), 'cave-3d', 'art', 'kar')
OUT = os.path.join(ROOT, 'img', 'karius'); H = 300
POSES = [
    ('idle', '기본', '서 있을 때'), ('walk', '걷기', '걸을 때 (기본과 번갈아)'), ('hIdle', '불경자 · 기본 (씩씩)', '체력 15% 아래 불경자'), ('hWalk', '불경자 · 걷기', '불경자로 걸을 때 (쿵쿵)'),
    ('hRoar', '불경자 · 우오오오', '불경자로 바뀌는 순간'), ('grit', '근성', '근성 포효 직전'), ('gritRoar', '근성 포효 · 우어어', '근성: 받는 피해 절반 · 회복 · 도발'),
    ('hurt', '피격 · 라이트 준비', '맞았을 때 · 기본 주먹 예고'), ('upper', '기본 라이트 어퍼', '기본 주먹 (두 대)'),
    ('hookPrep', '라이트 훅 준비 (다단히트)', '훅 · 후려치기 예고'), ('hook', '라이트 훅', '훅 세 번'), ('swat', '후려치기', '노인의 팔 쓸기'),
    ('sprout', '광대 팔 돋기', '잡아뚫기 1 — 광대의 팔이 돋음'), ('grab', '잡기', '잡아뚫기 2 — 끌어옴'), ('pierce', '레프트 꿰뚫기', '잡아뚫기 3 — 꿰뚫음 (방어 무시)'),
    ('raise', '손 들어올리기', '노인의 팔이 부풂 (철퇴 예고 · 굴 파기)'), ('mace', '철퇴', '내려찍기 · 굴 파기'),
    ('footUp', '발 들기', '짓밟기 · 딥킥 예고'), ('kick', '뻥 (딥킥)', '딥킥 — 멀리 걷어참, 벽이면 짓뭉개짐'),
    ('tackle', '돌진 몸박', '불경자 돌진 예고'), ('rush', '돌진 몸박 2 (좌우 반전)', '불경자 돌진 — 밀려 날아간 놈은 벽에 짓뭉개짐'),
    ('dead', '사망', '아직 게임에 안 씀 (쓰러질 때 후보) — 광대 · 노인 · 소녀 · 검은 머리 · 떨어진 안경'),
]
ICONS = [('body', '개조된 신체', '고유 특성 — 모든 피해 60% 감소 · 상태 이상 절반'), ('grit', '근성', '체력 45% 아래 포효 — 6초 받는 피해 절반 · 회복 · 도발 (30초)'),
         ('pierce', '잡아뚫기', '광대의 팔로 붙잡아 끌어와 레프트로 꿰뚫음 (11초)'), ('heretic', '불경자', '체력 15% 아래 — 공격력 1.6배 · 철퇴 · 돌진 몸박')]
os.makedirs(OUT, exist_ok=True)
def put(src, dst, h=H, sq=False):
    im = Image.open(src).convert('RGBA')
    if sq: im = im.resize((256, 256), Image.LANCZOS)
    else: im = im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=86, method=6)
for k, _, _ in POSES: put(os.path.join(ART, k + '.webp'), os.path.join(OUT, k + '.webp'))
for k, _, _ in ICONS: put(os.path.join(ART, 'icon_' + k + '.webp'), os.path.join(OUT, 'icon_' + k + '.webp'), sq=True)
put(os.path.join(ART, 'cut_heretic.webp'), os.path.join(OUT, 'cut_heretic.webp'), h=360)
put(os.path.join(ART, 'src', 'art2.webp'), os.path.join(OUT, 'art2.webp'), h=600)
P = os.path.join(ROOT, 'catalog.js'); s = open(P).read(); key = 'const CATALOG = '
head = s[:s.index(key) + len(key)]; cat = json.loads(s[len(head):].strip().rstrip(';'))
mine = lambda e: e['id'].startswith('O-kar-') or e['id'].startswith('SK-kar-') or e['id'] in ('P-karius-cut', 'P-karius-art2')
old = {e['id']: e for e in cat if mine(e)}
cat = [e for e in cat if not mine(e)]
new = []
SUB = '카리우스 · 동료 · 동작 그림'
def ent(id_, **kw):
    e = old.get(id_, {}); e.update({'id': id_, 'rank': '', 'on': True, **kw}); new.append(e)
ent('P-karius-art2', cat='char', sub=SUB, cid='C-003', g='karius', name='카리우스 · 원화 2', src='img/karius/art2.webp', note='드라이브 카리우스 폴더 · 카리우스원화2.png (2026-10-05)', on=False)
ent('P-karius-cut', cat='char', sub=SUB, cid='C-003', g='karius', name='불경자 카리우스 · 컷씬', src='img/karius/cut_heretic.webp', note='드라이브 · 불경자 카리우스 컷씬&잘라서스킬이미지.PNG', game='게임: 불경자로 바뀔 때 화면을 가로지르는 컷씬 띠')
for k, name, use in POSES:
    ent('O-kar-' + k, cat='char', sub=SUB, cid='C-003', g='karius', name=f'카리우스 · {name}', src=f'img/karius/{k}.webp', note='3D판 동작 그림 (드라이브 카리우스 폴더 → cave-3d/tools/kar_art.py)', game=f'게임: {use}')
    if k == 'dead': new[-1].update(on=False, note='드라이브 1기/카리우스 · 카리우스 사망 (2026-10-08, 가짜 체크무늬 바탕을 걷어냄) → cave-3d/art/kar/dead.webp')
for k, name, d in ICONS:
    ent('SK-kar-' + k, cat='card', sub='스킬 · 카리우스 고유', name=name, src=f'img/karius/icon_{k}.webp', note='드라이브 카리우스 폴더 스킬 그림 (액자 안쪽을 자름)', game='게임: ' + d + ' · 상태 창 (C) · 기술 알림')
at = max(i for i, e in enumerate(cat) if e.get('g') == 'karius') + 1
cat[at:at] = [e for e in new if e['cat'] == 'char']
cat.extend(e for e in new if e['cat'] == 'card')
REB = {'P-rebecca-idle': '서 있을 때', 'P-rebecca-walk': '걷기 · 굴에서 따라다님', 'P-rebecca-run': '멀면 뜀', 'P-rebecca-shield_charge': '방패 돌진 (3~6칸)', 'P-rebecca-thrust': '찌르기 (방어 무시)',
       'P-rebecca-spin_slash': '회전베기 (둘 이상 붙으면)', 'P-rebecca-shield_block': '방패 막기 · 맞을 때', 'P-rebecca-shoulder_bash': '어깨 박기 (벽 앞이면 짓눌림)', 'P-rebecca-slash_up': '올려베기', 'P-rebecca-slash_down': '내려베기'}
for e in cat:
    if e.get('g') == 'karius' and e['cat'] == 'char': e['sub'] = SUB
    if e['id'] in REB: e['on'] = True; e['game'] = '게임: 원정 동료 · ' + REB[e['id']]
    if e['id'].startswith('O-ratKnight-'): e['game'] = '게임: 적으로 안 나옴 (포렌의 소환수). 가끔 쥐들을 데리고 굴을 순찰'
head = head.replace('/* catalog.js v1.79 —', '/* catalog.js v1.81 — v1.81: 카리우스 항목을 한 묶음으로. v1.80: 카리우스 새 그림 21자세 · 스킬 그림 4 · 컷씬 · 원화 2 (tools/kar_poses.py), 레베카 동작은 3D 동료로 씀. v1.79:', 1)
open(P, 'w').write(head + json.dumps(cat, ensure_ascii=False, indent=0) + ';\n')
print(len(new), 'entries,', len(cat), 'total')
