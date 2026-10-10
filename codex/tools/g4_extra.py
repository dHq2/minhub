# g4_extra.py v1.0 (2026-10-10) — 4기 (드라이브 '1010 4기 업뎃') 의 나머지 그림을 도감에 넣음 (h2_poses.py v1.7 · m10_poses.py 다음, renames.py 앞)
#  · 적 · 1기 영웅 새 동작 (cave-3d/src/foe4.js, tools/g4_foes.py): 그 인물 묶음 끝에 O-f4-<키>-<동작> (동작마다 한 장 — 게임 묶음의 그 칸, 칸 높이 220 까지 줄임)
#  · 잡몹 9인 (cave-3d/src/mob9_sheets.js, tools/mob9_art.py): 인물마다 새 묶음 (g4m_<키>, 새 인물 번호) — 초상화 F-m9 · 동작 O-m9 · 그 인물 원화 A-g4
#  · 원화 · 기획 캡처 · 움짤 · 아이콘 (cave-3d/tools/g4_spec.json 의 art · ref · anim · icon): 주인 묶음 끝에 A-g4 (원화) · R-g4 (기획 · 분위기 판) · M-g4 (움짤)
#    주인이 도감에 없으면 새 묶음 g4_<주인> (초월자들 · 경기장 사람들 · 귀족부인 · 쌍피스톨 기사 · 오리엔탈 피스톨 · 후광 가면 괴물 · 동방 5인 · 서방 4인)
#    세르파 소환물 (굴라 · 튤린 · 핀 · 몽 · 시종 · 유닛) 은 세르파 묶음. 기획 메모 (plan4) 는 장면 칸. 아이콘 판 4장 (icons4) 은 20칸씩 잘라 카드 칸 (I4-…)
#  · 그림: 목록용 img/g4 (높이 420 — pack.py 가 묶음) · 꽉 찬 화면 원본 src4/<주인>/<번호>.webp (긴 변 1800 · 품질 90, hipack.py 가 읽음 — 게시하지 않음)
#           움짤은 원래 파일 그대로 img/anim/g4_<주인>_<번호>.webp (화질 그대로 · 자산 보관함, blobs.py)
#  · 내려받은 폴더 (원본) 가 있으면 src4 · 움짤을 새로 만들고, 없으면 저장소의 src4 로 목록 그림만 다시 만듦. 이미 있는 칸은 체크 (on) 를 그대로 둠
# 실행: python3 codex/tools/g4_extra.py [내려받은 폴더]
import os, sys, json, re, shutil
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); C3 = os.path.join(os.path.dirname(ROOT), 'cave-3d')
sys.path.insert(0, HERE)
from g4_names import PN4, ENG4
D4 = sys.argv[1] if len(sys.argv) > 1 else None
DAY = '2026-10-10'; SRCN = "4기 업뎃 (드라이브 '1010 4기 업뎃', 2026-10-10)"
P = os.path.join(ROOT, 'catalog.js'); s = open(P, encoding='utf-8').read(); key = 'const CATALOG = '
head = s[:s.index(key) + len(key)]; cat = json.loads(s[len(head):].strip().rstrip(';'))
mine = lambda e: e['id'].startswith(('O-f4-', 'F-m9-', 'O-m9-', 'A-g4-', 'R-g4-', 'M-g4-', 'I4-'))
old = {e['id']: e for e in cat if mine(e)}; cat = [e for e in cat if not mine(e)]
used = {int(e['cid'][2:]) for e in cat if e.get('cid', '').startswith('C-')}
cidOf = {e['g']: e['cid'] for e in old.values() if e.get('g') and e.get('cid')}
nxt = max(used | {int(c[2:]) for c in cidOf.values()}) + 1
def newcid(g):
    global nxt
    if g not in cidOf: cidOf[g] = f'C-{nxt:03d}'; nxt += 1
    return cidOf[g]
def ent(id_, **kw):
    e = dict(old.get(id_, {})); keep = {k: e[k] for k in ('on',) if k in e}
    e.update({'id': id_, 'rank': '', **kw}); e.update(keep); return e
def jsobj(path, name):
    t = open(os.path.join(C3, path), encoding='utf-8').read(); i = t.index(name) + len(name); return json.loads(t[i:t.index('};', i) + 1])
SPEC = json.load(open(os.path.join(C3, 'tools', 'g4_spec.json'), encoding='utf-8')); OWN = SPEC['owners']; FILES = SPEC['files']
R = json.loads((lambda t: t[t.index('{'):t.rindex('}') + 1])(open(os.path.join(C3, 'src', 'h2_roster.js'), encoding='utf-8').read()))
def grp_of_cid(cid):
    e = next((x for x in cat if x.get('cid') == cid and x.get('g')), None); return e and (e['g'], e['sub'])
def grp_of_g(g):
    e = next((x for x in cat if x.get('g') == g), None); return e and (g, e['sub'])
out = {}   # 묶음 g → [칸] (그 묶음 끝에 붙임) · 'NEW' → 새 묶음 칸 (인물 칸 끝)
def add(g, e): out.setdefault(g, []).append(e)
def strip_img(sheets, q, dst, hmax=220):
    sp = q['src']
    if sp not in sheets: sheets[sp] = Image.open(os.path.join(C3, sp)).convert('RGBA')
    x, y, w, h, W, H = q['rect']; im = sheets[sp].crop((x, y, x + w, y + h)); k = min(1.0, hmax / q['h'])
    if k < 1: im = im.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True); im.save(dst, 'WEBP', quality=80, method=4)
def fresh(d):
    p = os.path.join(ROOT, d); os.makedirs(p, exist_ok=True)
    for f in os.listdir(p): os.remove(os.path.join(p, f))

# 1) 적 · 1기 영웅 새 동작 (foe4)
F4 = jsobj('src/foe4.js', 'const FOE4 = '); fresh('img/f4'); sheets = {}
F4CID = {'cs': 'C-088', 'jakyak': 'C-089', 'janggun': 'C-158', 'eyemon': 'C-080', 'benkin': 'C-057', 'brute': 'C-055', 'goodwill': 'C-010', 'cheong': 'C-004', 'bk': 'C-019'}
F4SRC = {'cs': '청승추가', 'jakyak': '작약추가', 'janggun': '추가스프라이트 (대장군 호레이쇼)', 'eyemon': '추가스프라이트 (눈 괴물)', 'benkin': '벤킨추가', 'brute': '추가스프라이트 (곤봉 거인)',
         'goodwill': '4기 (굿윌 파운딩 · 굿윌1, 파운딩 상대 인형은 지움)', 'cheong': '청광묵추가 (팜 버스트 · 일상)', 'bk': '4기 (흑기사 비나 특수5)'}
for k, A in F4.items():
    gs = grp_of_cid(F4CID[k])
    if not gs: print('묶음 없음', k); continue
    g, sub = gs; nm = sub.split(' · ')[0]; nm = re.sub(r'\s*\(.*\)$', '', nm)
    for p, q in A['poses'].items():
        strip_img(sheets, q, os.path.join(ROOT, 'img', 'f4', f'{k}__{p}.webp')); n = q.get('n', 1)
        eng = ENG4.get(p); game = ('게임: ' + eng if eng else '게임: 아직 안 씀 (예비 동작)') + (f" ({n}장 · 초당 {q.get('fps', 9)}장{' · 한 번' if q.get('once') else ''})" if n > 1 else '')
        add(g, ent(f'O-f4-{k}-{p}', cat='char', sub=sub, cid=F4CID[k], g=g, name=f"{nm} · {PN4.get(p, p)}{f' ({n}장)' if n > 1 else ''} · 4기", src=f'img/f4/{k}__{p}.webp',
                   note=f"{SRCN} · 원본 {F4SRC.get(k, '')} · 게임 묶음 cave-3d/art/foe4 (tools/g4_foes.py)", game=game, on=True))

# 2) 잡몹 9인 (mob9): 인물마다 새 묶음
M9 = jsobj('src/mob9_sheets.js', 'const MOB9_SHEETS = '); fresh('img/m9')
EAST = {'ssangbu', 'bangdokki', 'eastRifle', 'eastSniper', 'maskBlade'}
M9ART = {'4기몹/쌍부.png': 'ssangbu', '4기몹/쌍부 원화.png': 'ssangbu', '4기몹/방도끼 원화.png': 'bangdokki', '4기몹/image(20261010-044325).png': 'bangdokki',
         '4기몹/동방소총수A.png': 'eastRifle', '4기몹/동방저격수A.png': 'eastSniper', '4기몹/풀페이스가면 검사.png': 'maskBlade'}
M9G = {}
for k, A in M9.items():
    g = f'g4m_{k}'; cid = newcid(g); side = '동방' if k in EAST else '서방'
    sub = f"{A['name']} · 적 · 4기 잡몹 ({side}) · 동작 그림"; M9G[k] = (g, cid, sub, A['name'])
    q = A['poses']['idle']; sp = q['src']
    if sp not in sheets: sheets[sp] = Image.open(os.path.join(C3, sp)).convert('RGBA')
    x, y, w, h, W, H = q['rect']; fr = sheets[sp].crop((x, y, x + q['w'], y + h))   # 대기 첫 장 → 머리 쪽 정사각형 초상화
    bb = fr.getbbox() or (0, 0, fr.width, fr.height); side_px = int(min(bb[2] - bb[0], (bb[3] - bb[1]) * 0.36))
    al = fr.getchannel('A').crop((bb[0], bb[1], bb[2], bb[1] + max(4, side_px // 2))); cols = [i for i in range(al.width) if any(al.getpixel((i, j)) > 60 for j in range(0, al.height, 2))]
    cx = bb[0] + ((cols[0] + cols[-1]) // 2 if cols else (bb[2] - bb[0]) // 2); x0 = max(0, cx - side_px // 2); y0 = max(0, bb[1] - side_px // 12)
    face = fr.crop((x0, y0, x0 + side_px, y0 + side_px)).resize((160, 160), Image.LANCZOS); face.save(os.path.join(ROOT, 'img', 'face', f'g4m_{k}.webp'), 'WEBP', quality=86, method=4)
    add('NEW', ent(f'F-m9-{k}', cat='char', sub=sub, cid=cid, g=g, name=f"{A['name']} 기본 초상화", src=f'img/face/g4m_{k}.webp', note=f'{SRCN} · 대기 그림 머리에서 자름', on=True))
    for p, q in A['poses'].items():
        strip_img(sheets, q, os.path.join(ROOT, 'img', 'm9', f'{k}__{p}.webp')); n = q.get('n', 1)
        eng = ENG4.get(p); game = ('게임: ' + eng if eng else '게임: 아직 안 씀 (예비 동작)') + (f" ({n}장 · 초당 {q.get('fps', 9)}장{' · 한 번' if q.get('once') else ''})" if n > 1 else '')
        add('NEW', ent(f'O-m9-{k}-{p}', cat='char', sub=sub, cid=cid, g=g, name=f"{A['name']} · {PN4.get(p, p)}{f' ({n}장)' if n > 1 else ''}", src=f'img/m9/{k}__{p}.webp',
                       note=f"{SRCN} · 원본 4기몹 3×3 시트 23장 (장마다 한 동작) · 게임 묶음 cave-3d/art/mob9 (tools/mob9_art.py)", game=game, on=True))

# 3) 원화 · 기획 · 움짤 · 아이콘
NEWG = {'trans': '초월자들 · NPC (6~7성 초월자 · 중립지대) · 원화 + 연출', 'stadium': '경기장 사람들 · NPC (30층 경기장) · 원화 + 연출', 'noblelady': '귀족부인 · 보스급 · 원화 + 연출',
        'twinpistol': '쌍피스톨 기사 · 역할 미정 · 원화 + 연출', 'orientpistol': '오리엔탈 피스톨 · 역할 미정 · 원화 + 연출', 'halo': '후광 가면 괴물 · 역할 미정 · 원화 + 연출',
        'east': '동방 5인 · 서방 4인 · 4기 잡몹 라인업 · 원화 + 기획'}
SUMMON = {'gula', 'tulin', 'pin', 'mong', 'maidA', 'maidB', 'unitFight', 'unitTank', 'unitMid', 'unitFar'}
H2G = {'magusgirl': 'h2_madosa', 'pearl': 'h2_pearl'}
def owner_grp(o):
    if o in M9G: g, cid, sub, _ = M9G[o]; return g, cid, sub
    info = OWN.get(o, {})
    if o in SUMMON: o = 'serpa'; info = OWN['serpa']
    if info.get('cid'):
        gs = grp_of_cid(info['cid'])
        if gs: return gs[0], info['cid'], gs[1]
    for g in ([H2G[o]] if o in H2G else []) + [(R.get(o) or {}).get('codex_g'), f'h2_{o}']:
        gs = g and grp_of_g(g)
        if gs: cid = next((x['cid'] for x in cat if x.get('g') == g and x.get('cid')), None); return gs[0], cid, gs[1]
    if o in NEWG: g = f'g4_{o}'; return g, newcid(g), NEWG[o]
    return None
fresh('img/g4'); os.makedirs(os.path.join(ROOT, 'img', 'anim'), exist_ok=True); n_by = {}; miss = []
def src4(o, nn, rel, kind):
    """원본 → src4 (긴 변 1800 · 품질 90). 원본이 없으면 저장소 것 그대로"""
    dst = os.path.join(ROOT, 'src4', o, f'{nn}.webp'); os.makedirs(os.path.dirname(dst), exist_ok=True)
    if D4 and os.path.exists(os.path.join(D4, rel)):
        im = Image.open(os.path.join(D4, rel)).convert('RGBA'); k = min(1, 1800 / max(im.size))
        if k < 1: im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        im.save(dst, 'WEBP', quality=90, method=4)
    return dst if os.path.exists(dst) else None
ICONS = {'4기/전술 기동 아이콘 20종-1.png': ('move', '전술 기동', ['집결', '교대', '고지 사선', '흔적 추적', '고지 선점', '다리 건너기', '다리 끊기', '분산 기동', '척후', '수송 호위',
                                                       '안전로 표시', '지뢰 탐지', '방책 세우기', '참호 파기', '보급 은닉', '방벽 진형', '교차로 장악', '성문 봉쇄', '검문', '절벽 등반']),
         '4기/전술 전략 아이콘 20종.png': ('strat', '전술 전략', ['방벽 방어', '쐐기 돌격', '포위 수축', '산개', '우회 기동', '양익 포위', '유인 후 역습', '거점 이동', '전선 돌파', '원형 방진',
                                                   '집중 공격', '전면 공세', '매복', '감시', '은밀 이동', '보급 차단', '성벽 침투', '협곡 유인', '측면 기습', '성문 돌파']),
         '4기/신호와 지휘 중심의 전략 아이콘-2.png': ('signal', '신호와 지휘', ['정지 신호', '소리 죽이기', '등불 가리기', '신호탄', '허수 야영', '혈흔 추적', '밀서 (도청 금지)', '명령서 전달', '수신호', '깃발 내리기',
                                                          '지휘봉 인계', '표적 지목', '발자국 감식', '지휘관 등장', '대열 정렬', '야영 휴식', '야간 경계', '경보 방울', '포로 결박', '결투 신호']),
         '4기/전장 자원관리 전략 아이콘 20종-3.png': ('supply', '전장 자원관리', ['식량 나누기', '화살 보급', '보급 투하', '장비 수리', '부상자 후송', '부상자 분류', '전장 수거', '짐 분배', '장비 버리기', '강행군',
                                                            '불침번 교대', '장비 보호', '식수 관리', '상한 식량', '흔적 지우기', '엄호 이동', '무기 수리', '장비 손질', '무게 배분', '진지 구축'])}
icons, scenes = [], []
for rel, v in FILES.items():
    o, kind = v['owner'], v['kind']
    if kind not in ('art', 'ref', 'anim', 'icon'): continue
    o2 = M9ART.get(rel, o)
    folder, fn = rel.split('/', 1); stem = os.path.splitext(fn)[0]; what = v.get('note') or stem
    if kind == 'icon':   # 아이콘 판: 5 × 4 칸 → 칸마다 밝은 테두리 안쪽만 (정사각형 256)
        bk, bname, names = ICONS[rel]; dd = os.path.join(ROOT, 'img', 'icon4'); os.makedirs(dd, exist_ok=True)
        for i, nm in enumerate(names):
            dst = f'img/icon4/{bk}_{i + 1:02d}.webp'
            if D4 and os.path.exists(os.path.join(D4, rel)):
                im = Image.open(os.path.join(D4, rel)).convert('RGB'); W, H = im.size; r, c = divmod(i, 5)
                cell = im.crop((c * W // 5, r * H // 4, (c + 1) * W // 5, (r + 1) * H // 4)); g1 = cell.convert('L').point(lambda t: 255 if t < 205 else 0); bb = g1.getbbox() or (0, 0, cell.width, cell.height)
                cell.crop(bb).resize((256, 256), Image.LANCZOS).save(os.path.join(ROOT, dst), 'WEBP', quality=88, method=4)
            if os.path.exists(os.path.join(ROOT, dst)):
                icons.append(ent(f'I4-{bk}-{i + 1:02d}', cat='card', sub=f'전략 · 전술 아이콘 · {bname}', name=nm, src=dst, note=f"{SRCN} · {fn} #{i + 1} (5 × 4 칸, 이름은 그림을 보고 붙임)", on=False, pk='전략 · 전술 아이콘 (4기)'))
        continue
    if o2 == 'plan4':   # 기획 메모 캡처 → 장면 칸
        nn = n_by[o2] = n_by.get(o2, 0) + 1; p4 = src4(o2, f'{nn:02d}', rel, kind)
        if not p4: miss.append(rel); continue
        im = Image.open(p4); k = min(1, 420 / im.height); im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS).save(os.path.join(ROOT, 'img', 'g4', f'{o2}_{nn:02d}.webp'), 'WEBP', quality=86, method=4)
        scenes.append(ent(f'R-g4-{o2}-{nn:02d}', cat='scene', sub='기획 메모 · 4기', name=what, src=f'img/g4/{o2}_{nn:02d}.webp', note=f'{SRCN} · {rel}', on=False, pk='4기 기획 메모'))
        continue
    gg = owner_grp(o2)
    if not gg: miss.append(rel); continue
    g, cid, sub = gg; nn = n_by[o2] = n_by.get(o2, 0) + 1; base = f'{o2}_{nn:02d}'
    nm = (f'{OWN[o]["name"]} · ' if o in SUMMON else '') + what
    if kind == 'anim':
        dst = f'img/anim/g4_{base}.webp'
        if D4 and os.path.exists(os.path.join(D4, rel)): shutil.copyfile(os.path.join(D4, rel), os.path.join(ROOT, dst))   # 움짤은 원래 파일 그대로 (화질 그대로)
        if not os.path.exists(os.path.join(ROOT, dst)): miss.append(rel); continue
        add(g, ent(f'M-g4-{o2}-{nn:02d}', cat='char', sub=sub, cid=cid, g=g, name=f'{nm} (움짤)', src=dst, note=f'{SRCN} · {rel} (원래 파일 그대로)', on=False))
        continue
    p4 = src4(o2, f'{nn:02d}', rel, kind)
    if not p4: miss.append(rel); continue
    im = Image.open(p4); k = min(1, 420 / im.height)
    im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS).save(os.path.join(ROOT, 'img', 'g4', f'{base}.webp'), 'WEBP', quality=86, method=4)
    pre = 'A' if kind == 'art' else 'R'
    add(g if not g.startswith(('g4_', 'g4m_')) else 'NEW:' + g, ent(f'{pre}-g4-{o2}-{nn:02d}', cat='char', sub=sub, cid=cid, g=g, name=nm + (' (기획 캡처)' if kind == 'ref' and '캡처' not in nm and '분위기' not in nm else ''),
                                                                  src=f'img/g4/{base}.webp', note=f'{SRCN} · {rel}', on=False))

# 넣기: 있던 묶음은 그 끝 · 새 묶음 (잡몹 9인 · 새 인물) 은 인물 칸 끝 · 아이콘은 카드 칸 끝 · 기획 메모는 장면 칸 끝
newg = {}
for g, es in out.items():
    if g == 'NEW' or g.startswith('NEW:'):
        for e in es: newg.setdefault(e['g'], []).append(e)
        continue
    idx = [i for i, e in enumerate(cat) if e.get('g') == g]
    if idx: cat[idx[-1] + 1:idx[-1] + 1] = es
    else: newg.setdefault(g, []).extend(es)
rk = lambda e: (0 if e['id'].startswith('F-') else 1 if e['id'].startswith(('A-', 'R-')) else 3 if e['id'].startswith('M-') else 2)
at = max(i for i, e in enumerate(cat) if e['cat'] == 'char') + 1
cat[at:at] = [e for g in newg for e in sorted(newg[g], key=rk)]
at = max(i for i, e in enumerate(cat) if e['cat'] == 'card') + 1; cat[at:at] = icons
at = max(i for i, e in enumerate(cat) if e['cat'] == 'scene') + 1; cat[at:at] = scenes
if 'v1.94:' not in head: head = head.replace('/* catalog.js v1.93 — ', "/* catalog.js v1.94 — v1.94: 4기 (드라이브 '1010 4기 업뎃', 2026-10-10) — 4기 인물 · 새 동작 (tools/h2_poses.py v1.7 O-h2m4) · 적 · 1기 영웅 새 동작 (O-f4) · 잡몹 9인 새 묶음 (O-m9) · 원화 · 기획 · 움짤 · 전략 아이콘 80 (tools/g4_extra.py) · 친칠라 · 페흐토 초상화 다시 (memo_fix.py v1.1). v1.93: ", 1)
open(P, 'w', encoding='utf-8').write(head + json.dumps(cat, ensure_ascii=False, indent=0) + ';\n')
tot = sum(len(v) for v in out.values()) + len(icons) + len(scenes)
print(f'4기 칸 {tot} (적 · 1기 영웅 동작 {sum(1 for v in out.values() for e in v if e["id"].startswith("O-f4"))} · 잡몹 {sum(1 for v in out.values() for e in v if e["id"].startswith(("O-m9", "F-m9")))} · 원화 · 기획 · 움짤 {sum(1 for v in out.values() for e in v if e["id"].startswith(("A-g4", "R-g4", "M-g4")))} · 아이콘 {len(icons)} · 기획 메모 {len(scenes)}) · 새 묶음 {len(newg)} · 전체 {len(cat)} · 인물 번호 ~ C-{nxt - 1:03d}')
if miss: print('못 넣음', len(miss), miss[:8])
