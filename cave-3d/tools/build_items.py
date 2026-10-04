# build_items.py v1.0 — 도감 (codex/catalog.js) → 게임 아이템 데이터 (src/data_items.js) + 그림 묶음 (art/atlas)
# 실행: python3 tools/build_items.py   (cave-3d 폴더에서)
# - 장비 687 · 유물 129 · 아이템 (생물 제외)을 칸 · 무기 종류 · 등급 · 수치로 바꿈
# - 아이콘 묶음: 80px 칸 16 x 16 (art/atlas/icon0..n.webp)
# - 손에 드는 무기 묶음: 256 x 96 칸 8줄 (art/atlas/held0..n.webp) — 주성분 축으로 돌려 손잡이는 왼쪽, 끝은 오른쪽 (활 · 방패는 세움)
# - 검수 그림: scratch (QA_DIR)에 held_qa.png
import json, math, os, re, sys, zlib
from PIL import Image, ImageDraw
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                       # cave-3d
CODEX = os.path.join(os.path.dirname(ROOT), 'codex')
OUT_JS = os.path.join(ROOT, 'src', 'data_items.js')
ATLAS = os.path.join(ROOT, 'art', 'atlas')
QA_DIR = os.environ.get('QA_DIR', '/tmp')
sys.path.insert(0, HERE)
from relic_table import R as RELIC

def H(s, salt=''):                                 # 결정적 난수 (0 ~ 1)
    return (zlib.crc32((salt + s).encode('utf8')) & 0xffffffff) / 0xffffffff

src = open(os.path.join(CODEX, 'catalog.js'), encoding='utf8').read()
CAT = json.loads(src[src.index('['):src.rindex(']') + 1])
BY = {e['id']: e for e in CAT}

# ---------- 무기 종류 · 변형 (이름의 끝 낱말) ----------
# (끝말, 칸, 종류, 변형)
WEAPON_WORDS = [
    ('돌격소총', 'assault', None), ('기관단총', 'assault', 'smg'), ('중화기', 'assault', 'heavy'),
    ('손대포', 'shotgun', 'cannon'), ('대포', 'shotgun', 'cannon'), ('소화기', 'shotgun', 'spray'),
    ('저격총', 'lever', 'sniper'), ('사냥총', 'lever', None), ('장총', 'lever', None), ('소총', 'lever', None),
    ('수발총', 'pistol', 'flint'), ('광선총', 'pistol', 'laser'), ('권총', 'pistol', None), ('리볼버', 'pistol', None), ('단총', 'pistol', None),
    ('산탄총', 'shotgun', None), ('나팔총', 'shotgun', 'blunder'),
    ('석궁', 'crossbow', None), ('장궁', 'bow', 'long'), ('투석끈', 'bow', 'sling'), ('활', 'bow', None),
    ('대검', 'greatsword', None), ('대도', 'greatsword', None), ('쌍낫', 'greatsword', 'scythe'), ('낫', 'greatsword', 'scythe'),
    ('단검', 'dagger', None), ('카타르', 'dagger', 'katar'), ('너클', 'dagger', 'fist'), ('쇠부채', 'dagger', 'fan'), ('부채', 'dagger', 'fan'),
    ('원륜', 'dagger', 'chakram'), ('열쇠', 'dagger', None), ('송곳', 'dagger', None),
    ('레이피어', 'sword', 'rapier'), ('일본도', 'sword', 'katana'), ('곡도', 'sword', 'scimitar'), ('쌍칼날', 'sword', 'dual'), ('쌍칼', 'sword', 'dual'),
    ('장검', 'sword', None), ('검', 'sword', None), ('칼', 'sword', None), ('칼날', 'sword', None),
    ('언월도', 'spear', 'glaive'), ('도끼창', 'spear', 'halberd'), ('미늘창', 'spear', 'halberd'), ('삼지창', 'spear', 'trident'), ('장창', 'spear', 'pike'),
    ('포크', 'spear', 'trident'), ('깃발', 'spear', 'banner'), ('채찍', 'spear', 'whip'), ('창', 'spear', None),
    ('도끼망치', 'hammer', None), ('손도끼', 'axe', 'hand'), ('식칼', 'axe', 'cleaver'), ('도끼', 'axe', None),
    ('망치', 'hammer', None), ('철퇴', 'hammer', 'mace'), ('도리깨', 'hammer', 'flail'), ('곡괭이', 'hammer', 'pick'), ('추', 'hammer', 'flail'),
    ('삽', 'hammer', 'shovel'), ('벽돌', 'hammer', 'brick'), ('핸들', 'hammer', None),
    ('군배', 'shield', None), ('방패', 'shield', None), ('버클러', 'shield', None), ('우산', 'shield', 'umbrella'),
    ('지팡이', 'staff', None), ('마도봉', 'staff', None), ('완드', 'staff', None), ('헤어드라이어', 'staff', 'dryer'),
]
ARMOR_WORDS = {
    'head': ['투구', '모자', '두건', '헬멧', '왕관', '머리관', '티아라', '머리띠', '베레모', '비니', '빵모자', '군모', '중절모', '챙모자', '터번', '삿갓',
             '가면', '마스크', '베일', '귀마개', '머리빗', '비행모', '야구모자', '통투구', '리본', '면갑', '관'],
    'body': ['갑옷', '흉갑', '로브', '코트', '재킷', '조끼', '망토', '드레스', '원피스', '셔츠', '블라우스', '튜닉', '상의', '점퍼', '스웨터', '니트', '후드',
             '바람막이', '예복', '도포', '기모노', '수도복', '작업복', '군복', '연미복', '전투복', '정장', '우주복', '판초', '앞치마', '조리복', '숄', '볼레로',
             '코르셋', '비행복', '기병복', '세일러복', '점프수트', '트랙수트', '옷', '도복', '견갑', '상자', '갑주'],
    'legs': ['바지', '치마', '스커트', '반바지', '장화', '구두', '샌들', '하이힐', '허리갑옷', '니커', '카고바지', '멜빵바지', '승마바지', '철장화'],
    'acc':  ['반지', '목걸이', '팔찌', '부적', '장갑', '초커', '목장식', '펜던트', '브로치', '허리띠', '벨트', '목도리', '스카프', '띠', '가방', '배낭', '팔토시',
             '팔보호대', '귀걸이', '등', '등불', '문고리', '자물쇠', '물통', '어깨장식', '빗', '커프', '건틀릿', '은빗', '곡옥'],
}
WORDS = sorted([(w, 'weapon', k, v) for w, k, v in WEAPON_WORDS] + [(w, s, None, None) for s, ws in ARMOR_WORDS.items() for w in ws], key=lambda t: -len(t[0]))

def classify_name(name, sub=''):
    words = name.replace('·', ' ').split()
    if words and words[-1] == '총':                     # '…총구 총' · '각진 총' · '탄창 … 총'
        if '나팔' in name: return ('weapon', 'shotgun', 'blunder')
        if '네 총구' in name or '쌍총' in name or '다총' in name: return ('weapon', 'shotgun', None)
        return ('weapon', 'pistol', None)
    for w in reversed(words):
        cands = [w]
        if len(w) > 2 and w[-1] in '와과': cands.append(w[:-1])
        for c in cands:
            for suf, slot, kind, vr in WORDS:
                if c.endswith(suf):
                    if slot == 'acc' and suf == '장갑' and sub.startswith('무기'): return ('weapon', 'dagger', 'fist')
                    if kind == 'sword' and suf == '칼날' and '팔목' in name: return ('weapon', 'dagger', 'wrist')
                    if kind == 'dagger' and suf == '송곳' and '쌍날' in name: return ('weapon', 'dagger', None)
                    if suf == '고리' and sub.startswith('무기'): return ('weapon', 'dagger', 'chakram')
                    return (slot, kind, vr)
    if '고리' in name and ('칼날' in name or '원형' in name): return ('weapon', 'dagger', 'chakram')
    if words and words[-1] == '총':                     # '…총구 총' · '각진 총'
        if '나팔' in name: return ('weapon', 'shotgun', 'blunder')
        if '네 총구' in name or '쌍총' in name or '다총' in name: return ('weapon', 'shotgun', None)
        return ('weapon', 'pistol', None)
    return None

# 이름 없는 그림 (무기 01 · 방어구 01 · 장신구 01 · 유물 39): 그림을 보고 정함 (게임 속 이름)
MANUAL = {
    'R39': ('뼈 왕관', 'head', None, None, 3),
    'EW01': ('은빛 십자 장검', 'weapon', 'sword', None, 1), 'EW02': ('핏빛 톱날 검', 'weapon', 'sword', None, 2), 'EW03': ('푸른 촉 창', 'weapon', 'spear', None, 1),
    'EW04': ('붕대 감은 양날 도끼', 'weapon', 'axe', None, 1), 'EW05': ('꽃덩굴 활', 'weapon', 'bow', None, 2), 'EW06': ('녹슨 장검', 'weapon', 'sword', None, 0),
    'EW07': ('초승달 자루 도끼', 'weapon', 'axe', None, 1), 'EW08': ('흰 깃 창', 'weapon', 'spear', None, 1), 'EW09': ('핏빛 사슬 낫', 'weapon', 'spear', 'whip', 2),
    'EW10': ('쇠머리 망치', 'weapon', 'hammer', None, 1), 'EW11': ('뼈 활', 'weapon', 'bow', None, 1), 'EW12': ('뼈 단검', 'weapon', 'dagger', None, 1),
    'EW13': ('등불 지팡이', 'weapon', 'staff', None, 2), 'EW14': ('가시 원형 방패', 'weapon', 'shield', None, 1), 'EW15': ('피 묻은 큰 식칼', 'weapon', 'axe', 'cleaver', 1),
    'EW16': ('가시 채찍', 'weapon', 'spear', 'whip', 2), 'EW17': ('황동 리볼버', 'weapon', 'pistol', None, 1),
    'EA01': ('별 문장 연 방패', 'weapon', 'shield', None, 2), 'EA02': ('뿔 해골 투구', 'head', None, None, 2), 'EA03': ('흰 두건 망토', 'body', None, None, 1),
    'EA04': ('검은 깃털 망토', 'body', None, None, 2), 'EA05': ('발톱 건틀릿', 'acc', None, None, 2), 'EA06': ('술 달린 허리띠', 'acc', None, None, 1),
    'EA07': ('털 장화', 'legs', None, None, 1), 'EA08': ('쇠 기사 투구', 'head', None, None, 1), 'EA09': ('판금 갑옷', 'body', None, None, 2),
    'EA10': ('짐승 해골 털망토', 'body', None, None, 2), 'EA11': ('낡은 붉은 두건', 'head', None, None, 0), 'EA12': ('황금 태양 가면', 'head', None, None, 3),
    'EA13': ('태양 문장 방패', 'weapon', 'shield', None, 2), 'EA14': ('쇠 팔보호대', 'acc', None, None, 1), 'EA15': ('가죽 장화', 'legs', None, None, 0),
    'EA16': ('여행자의 배낭', 'acc', None, None, 1), 'EA17': ('푸른 띠 사제복', 'body', None, None, 2), 'EA18': ('붉은 판초', 'body', None, None, 1),
    'EA19': ('초승달 허리치마', 'legs', None, None, 2), 'EA20': ('금실 흰 로브', 'body', None, None, 3), 'EA21': ('붉은 두건 망토', 'body', None, None, 1),
    'EA22': ('초록 사냥꾼 코트', 'body', None, None, 1), 'EA23': ('검은 베일', 'head', None, None, 2), 'EA24': ('태양 문장 붉은 망토', 'body', None, None, 3),
    'EJ01': ('푸른 보석 왕관', 'head', None, None, 3), 'EJ02': ('흰 도깨비 가면', 'head', None, None, 2), 'EJ03': ('별 구슬 반지', 'acc', None, None, 3),
    'EJ04': ('푸른 수정 펜던트', 'acc', None, None, 2), 'EJ05': ('가시 장미', 'acc', None, None, 2), 'EJ06': ('눈알 펜던트', 'acc', None, None, 3),
    'EJ07': ('유령 등불', 'acc', None, None, 3), 'EJ08': ('태양 목걸이', 'acc', None, None, 2), 'EJ09': ('가시 루비 반지', 'acc', None, None, 3),
    'EJ10': ('흰 꽃 브로치', 'acc', None, None, 1), 'EJ11': ('송곳니 부적', 'acc', None, None, 2), 'EJ12': ('촛불 관', 'head', None, None, 2),
    'EJ13': ('꽃 단 배낭', 'acc', None, None, 1), 'EJ14': ('푸른 등불', 'acc', None, None, 2),
    # 유물에서 옮긴 장비
    'R-S001': (None, 'weapon', 'spear', None, 3), 'R-S002': (None, 'body', None, None, 3), 'R-S020': (None, 'acc', None, None, 3),
    'R-S022': (None, 'weapon', 'lever', None, 3), 'R-S023': (None, 'weapon', 'axe', None, 3), 'R-S025': (None, 'weapon', 'staff', None, 3),
    'R-S026': (None, 'weapon', 'hammer', 'flail', 3), 'R-S048': (None, 'weapon', 'bow', None, 3), 'R-S071': (None, 'weapon', 'staff', None, 3),
    'R-S072': (None, 'body', None, None, 3), 'R-S085': (None, 'head', None, None, 3), 'R-S130': (None, 'weapon', 'staff', None, 3),
    'R-S135': (None, 'acc', None, None, 3), 'R-S139': (None, 'acc', None, None, 3),
    # 보스 장비
    'B-1': (None, 'head', None, None, 6), 'B-2': (None, 'weapon', 'sword', None, 6), 'B-3': (None, 'body', None, None, 6),
    'EQ-601': (None, 'weapon', 'greatsword', None, 6), 'EQ-602': (None, 'weapon', 'sword', None, 6), 'EQ-603': (None, 'weapon', 'spear', None, 6), 'EQ-604': (None, 'weapon', 'sword', None, 6),
    # 기본 무기 (2D판)
    'W-axe': (None, 'weapon', 'axe', None, 0), 'W-bow': (None, 'weapon', 'bow', None, 0), 'W-hammer': (None, 'weapon', 'hammer', None, 0),
    'W-lever': (None, 'weapon', 'lever', None, 0), 'W-pistol': (None, 'weapon', 'pistol', None, 0), 'W-rifle': (None, 'weapon', 'assault', None, 0),
    'W-shield': (None, 'weapon', 'shield', None, 0), 'W-shotgun': (None, 'weapon', 'shotgun', None, 0), 'W-spear': (None, 'weapon', 'spear', None, 0),
    'W-sword': (None, 'weapon', 'sword', None, 0),
}
HELD_SRC = {'W-axe': 'a/weapons/h_axe.png', 'W-bow': 'a/weapons/h_bow.png', 'W-hammer': 'a/weapons/h_hammer.png', 'W-lever': 'a/weapons/h_lever.png',
            'W-pistol': 'a/weapons/h_pistol.png', 'W-rifle': 'a/weapons/h_rifle.png', 'W-shield': 'a/weapons/h_shield.png', 'W-shotgun': 'a/weapons/h_shotgun.png',
            'W-spear': 'a/weapons/h_spear.png', 'W-sword': 'a/weapons/h_sword.png', 'B-2': 'a/weapons/h_oldSword.png',
            'R-E01': 'img/equip/EQ-037.webp', 'R-E02': 'img/equip/EQ-057.webp'}   # 카드 그림인 유물 검은 손에는 비슷한 검 그림

# ---------- 등급 (무리마다 기본, 해시로 조금 오르내림) ----------
def base_rarity(sub):
    if sub.startswith('기본 무기'): return 0
    if sub.startswith('받은 장비'): return 1
    if sub.startswith('보스 장비'): return 6
    if sub == '유물에서 옮김': return 3
    if any(k in sub for k in ['몽환적 전설', '전설의 마법', '전설의 영웅', '보석빛', '일본 판타지 하의', '전설의 머리장식']): return 4
    if '보스' in sub: return 3
    if any(k in sub for k in ['기묘한', '혼돈']): return 2
    if any(k in sub for k in ['일본풍 수채화', '수채화풍 일본식', '로맨스', '느와르', '노아르']): return 2
    if any(k in sub for k in ['다채로운', '게임 의상', '장르혼합']): return 2
    return 1

def rarity(e, base):
    if base in (0, 6): return base
    h = H(e['id'], 'rar')
    if h > 0.84: return min(5, base + 1)
    if h < 0.10 and base > 1: return base - 1
    return base

RMUL = [1.0, 1.12, 1.25, 1.42, 1.62, 1.85, 2.1]
DMUL = [1.0, 1.25, 1.5, 1.8, 2.15, 2.55, 3.0]
W_ATK = dict(spear=12, sword=11, greatsword=18, dagger=8, axe=14, hammer=20, shield=7, staff=9, bow=12, crossbow=22, pistol=15, shotgun=7, lever=28, assault=7)
W_LEN = dict(spear=1.6, sword=1.0, greatsword=1.45, dagger=0.5, axe=0.85, hammer=0.95, shield=0.72, staff=1.3, bow=1.15, crossbow=0.85, pistol=0.45, shotgun=1.0, lever=1.15, assault=1.0)
V_LEN = dict(pike=1.9, halberd=1.75, glaive=1.7, banner=1.75, whip=1.5, rapier=1.05, katana=1.1, scimitar=0.95, dual=0.9, scythe=1.55, fist=0.34, fan=0.5,
             chakram=0.48, katar=0.55, wrist=0.5, hand=0.6, cleaver=0.62, mace=0.85, flail=0.95, pick=0.95, shovel=1.15, brick=0.36, umbrella=1.05, dryer=0.5,
             flint=0.62, laser=0.5, cannon=1.05, blunder=0.95, spray=0.75, sniper=1.3, smg=0.75, heavy=1.25, long=1.35, sling=0.6)
GRIP = dict(spear=0.36, sword=0.1, greatsword=0.12, dagger=0.18, axe=0.14, hammer=0.14, staff=0.32, crossbow=0.3, pistol=0.22, shotgun=0.28, lever=0.3, assault=0.32)
WGT = dict(spear=3, sword=2, greatsword=5, dagger=1, axe=3, hammer=6, shield=4, staff=2, bow=1, crossbow=3, pistol=1, shotgun=4, lever=4, assault=5)
# 변형마다 효과 (이름이 정함)
V_FX = dict(rapier=dict(crit=8), katana=dict(critDmg=25), scimitar=dict(bleedHit=dict(ch=0.12, dps=5, dur=3)), dual=dict(atkSpd=12),
            halberd=dict(bleedHit=dict(ch=0.15, dps=6, dur=3)), glaive=dict(arc=20), pike=dict(reach=20), trident=dict(seaAtk=15), banner=dict(rally=6),
            whip=dict(reach=35, slowHit=dict(ch=0.25, dur=1.5)), scythe=dict(lifesteal=3), fist=dict(fist=25), fan=dict(knock=1), chakram=dict(boomerang=1),
            katar=dict(armorPierce=20), wrist=dict(backstab=25), hand=dict(throwFast=1), cleaver=dict(bleedHit=dict(ch=0.3, dps=6, dur=4)),
            mace=dict(stagger=15), flail=dict(armorPierce=15), pick=dict(dig=1, armorPierce=25), shovel=dict(dig=1), brick=dict(stagger=25),
            umbrella=dict(rainDef=1), dryer=dict(burnHit=dict(ch=0.35, pct=2, dur=3)), flint=dict(oneShot=1), laser=dict(laserGun=1), cannon=dict(explode=1),
            blunder=dict(knock=1), spray=dict(slowHit=dict(ch=1, dur=2)), sniper=dict(rangedCrit=15), smg=dict(), heavy=dict(spd=-8), long=dict(reach=25),
            sling=dict(stones=1))

# 기묘한 물건의 엉뚱한 효과 (해시로 고름)
CURIO = [
    (dict(luck=8), '이상하게 운이 좋다 (좋은 것이 나올 확률 +8%)'),
    (dict(sanity=12), '들고 있으면 웃음이 난다 (정신도 +12)'),
    (dict(goldPick=3), '반짝이는 걸 좋아한다 (금화 +3씩)'),
    (dict(mood=5), '굴에 가져가면 다들 신기해함 (무드 +5)'),
    (dict(eva=4, spd=4), '가볍다 (회피 +4%, 이동 +4%)'),
    (dict(crit=6), '어딘가 날카롭다 (치명 +6%)'),
    (dict(hp=25), '튼튼하다 (체력 +25)'),
    (dict(vision=15), '빛을 모은다 (시야 +15%)'),
    (dict(regen=0.5), '따뜻하다 (초당 체력 +0.5)'),
    (dict(thorns=6), '만지면 아프다 (때린 적에게 6 되돌림)'),
    (dict(sanDrain=-12), '이상하게 마음이 놓인다 (정신도 감소 -12%)'),
    (dict(trapSense=1), '함정 앞에서 덜덜 떤다 (함정이 보임)'),
    (dict(lootPlus=1), '뒤지면 하나 더 나온다'),
    (dict(knock=1), '맞으면 멀리 날아간다 (밀치기 +)'),
    (dict(slowHit=dict(ch=0.2, dur=1.5)), '맞은 적이 멍해진다 (20% 느리게)'),
    (dict(burnHit=dict(ch=0.15, pct=2, dur=3)), '뜨겁다 (15% 화상)'),
]

# 장신구 기본 효과 (해시로 고름, 등급만큼 커짐)
ACC_BASE = [('crit', 3, '치명'), ('eva', 3, '회피'), ('hp', 15, '체력'), ('sanity', 8, '정신도'), ('vision', 10, '시야'), ('str', 2, '힘'), ('dex', 2, '민첩'),
            ('vit', 2, '체력 속성'), ('wil', 2, '정신'), ('per', 2, '감각'), ('regen', 0.4, '초당 회복'), ('lifesteal', 2, '흡혈')]

def weapon_item(e, name, kind, vr, rar):
    k = H(e['id'], 'atk')
    atk = round(W_ATK[kind] * RMUL[rar] * (0.94 + 0.12 * k))
    fx = dict(V_FX.get(vr, {})) if vr else {}
    L = V_LEN.get(vr, W_LEN[kind]) if vr else W_LEN[kind]
    if kind == 'axe' and ('긴 자루' in name): L = 1.35
    it = dict(n=name, c='weapon', s='weapon', wt=kind, r=rar, atk=atk, L=round(L, 2), w=WGT[kind] + (1 if rar >= 5 else 0), fx=fx)
    if vr: it['vr'] = vr
    return it

def armor_item(e, name, slot, rar):
    k = H(e['id'], 'def')
    heavy = any(w in name for w in ['판금', '강철', '쇠', '철', '갑옷', '흉갑', '투구', '갑주', '견갑'])
    cloth = any(w in name for w in ['로브', '드레스', '원피스', '블라우스', '숄', '베일', '두건', '모자', '리본', '셔츠', '니트', '스웨터', '치마', '스커트'])
    if slot == 'acc':
        a, b = ACC_BASE[int(H(e['id'], 'acc') * len(ACC_BASE))], None
        v = a[1] * (1 + 0.45 * rar); v = round(v, 1) if a[0] == 'regen' else round(v)
        fx = {a[0]: v}
        if rar >= 3:
            b = ACC_BASE[int(H(e['id'], 'acc2') * len(ACC_BASE))]
            if b[0] != a[0]:
                v2 = b[1] * (0.6 + 0.3 * rar); fx[b[0]] = round(v2, 1) if b[0] == 'regen' else round(v2)
        return dict(n=name, c='acc', s='acc', r=rar, fx=fx, w=0)
    base = dict(head=3, body=7, legs=2)[slot]
    d = base * DMUL[rar] * (0.9 + 0.2 * k) * (1.3 if heavy else 0.75 if cloth else 1.0)
    fx = {}
    if heavy: fx['spd'] = -2 if slot != 'body' else -4
    if cloth: fx['sanity'] = round(3 + 2 * rar);
    if cloth and slot == 'head': fx['wil'] = 1 + rar // 2
    it = dict(n=name, c='armor', s=slot, r=rar, def_=max(1, round(d)), fx=fx, w=(4 if heavy else 1) + (2 if slot == 'body' else 0))
    return it

ITEMS = {}
def add(iid, it, e, icon_src, held_src=None):
    it['id'] = iid
    it['_icon'] = icon_src
    if held_src: it['_held'] = held_src
    sp = e.get('spec') or ''
    if sp and 'd' not in it and not it.get('fixedD'): it['d'] = sp
    ITEMS[iid] = it

# ---------- 장비 ----------
unk = []
for e in CAT:
    if e['cat'] != 'equip': continue
    iid, sub = e['id'], e['sub']
    if iid in RELIC: continue                       # 유물표가 정한 것은 아래에서
    man = MANUAL.get(iid)
    if man:
        name = man[0] or e['name']; slot, kind, vr, rar = man[1], man[2], man[3], man[4]
    else:
        c = classify_name(e['name'], sub)
        name = e['name']
        if sub.startswith('의상 세트'): c = ('body', None, None)
        if not c:
            c = ('acc', None, None); unk.append((iid, name))
        slot, kind, vr = c
        rar = rarity(e, base_rarity(sub))
    if slot == 'weapon':
        it = weapon_item(e, name, kind, vr, rar)
    else:
        it = armor_item(e, name, slot, rar)
        if sub.startswith('의상 세트'):
            it['def_'] = round(it['def_'] * 1.3); it['fx']['outfit'] = 1
    if any(k in sub for k in ['기묘한', '혼돈']):
        fx, d = CURIO[int(H(iid, 'curio') * len(CURIO))]
        for a, b in fx.items(): it['fx'][a] = b
        it['d'] = d
    add(iid, it, e, e['src'], HELD_SRC.get(iid, e['src']) if slot == 'weapon' else None)

# 보스 장비 고유 효과
BOSS_FX = {
    'B-1': (dict(def_=12, fx=dict(holyP=25, wil=4, sanity=15)), '세자르의 왕관. 신성 피해 +25%, 정신 +4, 정신도 +15'),
    'B-2': (dict(atk=30, fx=dict(slowHit=dict(ch=0.12, dur=2), crit=8)), '세자르의 검. 잘 만든 검, 냉기 (12%로 느리게), 치명 +8%'),
    'B-3': (dict(def_=30, fx=dict(regen=1, fireImmune=1, hp=40)), '적뢰의 성해포. 방어 +30, 체력 +40, 초당 +1, 화상 면역'),
    'EQ-601': (dict(fx=dict(laserSkill=1)), '스킬: 발용의 레이저 — 무기 스킬이 일직선으로 꿰뚫는 붉은 빛줄기'),
    'EQ-602': (dict(fx=dict(swordWave=2)), '스킬: 발용의 참격 — 모든 베기에 검기'),
    'EQ-603': (dict(fx=dict(throwBoom=1)), '투척하면 적 주위에 거대한 폭발'),
    'EQ-604': (dict(fx=dict(atkSpd=15, crit=10, lifesteal=4)), '레지나의 검. 빠르고 (+15%) 날카로움 (치명 +10%), 흡혈 4%'),
}
for iid, (o, d) in BOSS_FX.items():
    it = ITEMS[iid]
    for k, v in o.items():
        if k == 'fx': it['fx'].update(v)
        else: it[k] = v
    it['d'] = d

# ---------- 유물 (유물표) ----------
SLOT_C = dict(weapon='weapon', head='armor', body='armor', legs='armor', acc='acc', carry='relic', use='use', furn='furn', pet='pet')
for iid, R in RELIC.items():
    e = BY.get(iid)
    if not e: print('유물표에 있지만 도감에 없음:', iid); continue
    name = R.get('n') or e['name']
    slot = R['slot']; rar = R['rar']
    fx = {('def' if k == 'def_' else 'set' if k == 'set_' else k): v for k, v in R.get('fx', {}).items()}
    if slot == 'weapon':
        kind = R['wt']; vr = R.get('vr')
        it = weapon_item(e, name, kind, vr, rar)
        it['atk'] = it['atk'] + R.get('atk', 0)
        it['fx'].update(fx)
    else:
        it = dict(n=name, c=SLOT_C[slot], s=slot, r=rar, fx=fx, w=0 if slot in ('acc', 'carry', 'use') else 2)
        if slot in ('head', 'body', 'legs'): it['def_'] = R.get('def_', 0) or round(dict(head=3, body=7, legs=2)[slot] * DMUL[rar])
    if 'def' in fx and slot not in ('weapon',):            # 유물표의 def_는 효과로 (방어 +)
        pass
    it['d'] = R['d']; it['relic'] = 1
    if slot == 'use': it['stack'] = 3
    add(iid, it, e, e['src'], HELD_SRC.get(iid, e['src']) if slot == 'weapon' else None)

# 유물 중 표에 없는 것 (이름 있는 그림만 남아 있으면 가방 유물로)
for e in CAT:
    if e['cat'] == 'relic' and e['id'] not in ITEMS:
        rar = 2
        a = ACC_BASE[int(H(e['id'], 'acc') * len(ACC_BASE))]
        add(e['id'], dict(n=e['name'], c='relic', s='carry', r=rar, fx={a[0]: a[1] * 2}, d=f'소지하면 {a[2]} +{a[1] * 2}', relic=1, w=0), e, e['src'])
        print('표 없는 유물 → 가방 유물:', e['id'], e['name'])

# ---------- 아이템 (손으로 정함) ----------
# c: food (식량) · potion · use (소모품) · ammo · gold · mat (재료) · tool · key · book · light · junk
# fx: hp (회복, %는 hpP) · san · regen(dur) · cure · buff · food (굴 식량 값) · wood (굴 땔감) · ammo{kind:n} · gold[a,b]
I = {
    'I-043': dict(c='food', fx=dict(hp=30, food=2), d='구운 고기. 체력 +30. 굴에서는 식량 2끼', g=12),
    'I-050': dict(c='food', fx=dict(hp=15, food=1), d='빵. 체력 +15. 굴에서는 식량 1끼', g=6),
    'I-051': dict(c='food', fx=dict(hp=25, food=2), d='햄. 체력 +25. 굴에서는 식량 2끼', g=10),
    'I-052': dict(c='food', fx=dict(hp=15, food=1), d='생선. 체력 +15. 굴에서는 식량 1끼', g=6),
    'I-053': dict(c='food', fx=dict(hp=10, san=4, food=1), d='사과. 체력 +10, 정신도 +4', g=5),
    'I-054': dict(c='food', fx=dict(hp=18, food=1), d='치즈. 체력 +18', g=8),
    'I-015': dict(c='food', fx=dict(hp=20, san=10, food=1), d='컵라면. 어떻게 여기까지 왔을까. 체력 +20, 정신도 +10', g=15),
    'I-016': dict(c='potion', fx=dict(buff=dict(spd=20, atkSpd=15, dur=25)), d='캔음료 POW. 25초 동안 이동 +20%, 공격 속도 +15%', g=20),
    'I-017': dict(c='potion', fx=dict(san=12, hp=8), d='콜라. 정신도 +12', g=10),
    'I-037': dict(c='potion', fx=dict(hpP=40), d='빨간 물약. 체력 40% 회복', g=25, stack=5),
    'I-064': dict(c='potion', fx=dict(hpP=80), d='큰 빨간 물약. 체력 80% 회복', g=55, stack=5, r=2),
    'I-038': dict(c='potion', fx=dict(san=30), d='파란 물약. 정신도 +30', g=25, stack=5),
    'I-065': dict(c='potion', fx=dict(san=60, hpP=20), d='큰 파란 물약. 정신도 +60, 체력 20%', g=55, stack=5, r=2),
    'I-046': dict(c='potion', fx=dict(cure=1, regen=dict(v=3, dur=10)), d='초록 물약. 중독 · 출혈 · 화상을 씻고 10초 동안 초당 +3', g=20, stack=5),
    'I-049': dict(c='potion', fx=dict(cure=1, regen=dict(v=5, dur=12)), d='초록 물약 병. 상태 이상을 씻고 12초 동안 초당 +5', g=35, stack=5, r=2),
    'I-048': dict(c='potion', fx=dict(gamble=1), d='보라 물약. 마셔 보기 전엔 모름 (강해지거나, 저주받거나)', g=30, stack=5, r=2),
    'I-059': dict(c='use', fx=dict(revive=1, hpP=30), d='흰 구급상자. 쓰러진 동료를 일으킴 (없으면 내 체력 30%)', g=45, stack=3, r=2),
    'I-060': dict(c='use', fx=dict(partyHeal=30), d='빨간 구급상자. 원정대 모두 체력 30%', g=60, stack=3, r=2),
    'I-061': dict(c='use', fx=dict(cure=1, hp=15), d='붕대. 출혈을 멎게 하고 체력 +15', g=8, stack=10),
    'I-021': dict(c='use', fx=dict(grenade=70), d='수류탄. 던지면 2초 뒤 터짐 (주변 70 피해, 밀침)', g=35, stack=5, r=2),
    'I-104': dict(c='light', fx=dict(torch=240), d='횃불. 빛 +240초 (불이 꺼지면 시야 2칸)', g=8, stack=10),
    'I-106': dict(c='light', fx=dict(torch=240), d='횃불. 빛 +240초', g=8, stack=10),
    'I-107': dict(c='relic', s='carry', fx=dict(vision=25), d='랜턴. 들고 있으면 시야 +25% (꺼지지 않음)', g=60, r=3),
    'I-270': dict(c='light', fx=dict(torch=150, san=5), d='기름 등잔. 빛 +150초, 정신도 +5', g=12, stack=5),
    'I-280': dict(c='use', fx=dict(candle=90), d='촛불. 바닥에 놓으면 90초 동안 둘레가 밝고 정신도가 천천히 참', g=6, stack=5),
    'I-073': dict(c='key', fx=dict(key='gold'), d='금 열쇠. 잠긴 보물 상자를 엶', g=30, stack=5),
    'I-074': dict(c='key', fx=dict(key='silver'), d='은 열쇠. 잠긴 문을 엶', g=20, stack=5),
    'I-029': dict(c='use', fx=dict(keys=3), d='열쇠 꾸러미. 은 열쇠 셋', g=50, r=2),
    'I-282': dict(c='ammo', fx=dict(ammo=dict(bullet=12)), d='탄약 묶음. 총알 +12 (권총 · 레버액션 · 돌격소총)', g=12),
    'I-284': dict(c='ammo', fx=dict(ammo=dict(bullet=30)), d='탄 무더기. 총알 +30', g=28, r=1),
    'I-283': dict(c='ammo', fx=dict(ammo=dict(shell=8)), d='샷건탄 묶음. 산탄 +8', g=16),
    'I-281': dict(c='ammo', fx=dict(ammo=dict(bullet=40, shell=10)), d='탄약상자. 총알 +40, 산탄 +10', g=55, r=2),
    'I-285': dict(c='ammo', fx=dict(ammo=dict(arrow=15)), d='화살통. 화살 +15 (활 · 석궁)', g=10),
    'I-009': dict(c='ammo', fx=dict(ammo=dict(cell=12)), d='배터리 (가득). 광선총 +12', g=18),
    'I-010': dict(c='ammo', fx=dict(ammo=dict(cell=8)), d='배터리. 광선총 +8', g=12),
    'I-011': dict(c='ammo', fx=dict(ammo=dict(cell=4)), d='낡은 배터리. 광선총 +4', g=5),
    'I-030': dict(c='gold', fx=dict(gold=[25, 60]), d='금화 더미', g=0),
    'I-031': dict(c='gold', fx=dict(gold=[8, 20]), d='은화 더미', g=0),
    'I-276': dict(c='gold', fx=dict(gold=[10, 30]), d='청록 가죽 주머니. 동전이 짤랑인다', g=0),
    'I-032': dict(c='mat', d='광석. 상인에게 팔거나, 굴에서 장비를 고침', g=8),
    'I-044': dict(c='mat', d='색 광석. 값이 꽤 나감', g=20, r=1),
    'I-045': dict(c='mat', d='철광석. 굴에서 장비를 고침', g=10),
    'I-271': dict(c='mat', d='보랏빛 자수정 원석. 비싸게 팔림', g=60, r=2),
    'I-033': dict(c='mat', d='가죽', g=6), 'I-055': dict(c='mat', d='가죽', g=6), 'I-095': dict(c='mat', d='가죽 조각', g=3),
    'I-034': dict(c='mat', fx=dict(wood=12), d='나무 판자. 굴에 가져가면 땔감 12', g=4),
    'I-057': dict(c='mat', fx=dict(wood=30), d='판자 더미. 굴에 가져가면 땔감 30', g=10),
    'I-035': dict(c='mat', d='두루마리 천. 붕대 · 가구 재료', g=5), 'I-058': dict(c='mat', d='파란 천', g=5),
    'I-062': dict(c='tool', fx=dict(rope=1), d='밧줄. 구덩이를 내려가거나 빠르게 돌아옴 (귀환 줄을 하나 더 맴)', g=15),
    'I-063': dict(c='tool', fx=dict(rope=1), d='밧줄', g=15), 'I-266': dict(c='tool', fx=dict(rope=1), d='청록 밧줄', g=15),
    'I-047': dict(c='tool', fx=dict(dig=1), d='곡괭이. 무덤 · 무너진 벽을 빨리 팜', g=20),
    'I-066': dict(c='tool', fx=dict(dig=1), d='삽. 무덤을 빨리 팜', g=15), 'I-273': dict(c='tool', fx=dict(dig=1), d='녹슨 모종삽', g=5),
    'I-069': dict(c='tool', fx=dict(smash=1), d='망치. 잠긴 상자를 부숨 (시끄러움)', g=15),
    'I-068': dict(c='tool', fx=dict(pick=20), d='렌치. 자물쇠 따기 +20%', g=12),
    'I-067': dict(c='tool', fx=dict(identify=1), d='돋보기. 저주를 알아봄', g=15),
    'I-041': dict(c='book', fx=dict(revealTreasure=1), d='보물 지도. 이 층의 보물 방을 지도에 표시', g=30, r=2),
    'I-042': dict(c='book', fx=dict(revealTreasure=1), d='보물 지도. 이 층의 보물 방을 지도에 표시', g=30, r=2),
    'I-071': dict(c='book', fx=dict(revealMap=1), d='양피지 지도. 이 층의 방들을 지도에 그림', g=25, r=1),
    'I-004': dict(c='book', fx=dict(revealMap=1), d='태블릿 (지도). 이 층 전체가 보임', g=40, r=2),
    'I-077': dict(c='book', fx=dict(revealMap=1, revealFoes=1), d='수정구. 이 층의 방과 적이 보임', g=60, r=3),
    'I-056': dict(c='book', fx=dict(lore=1, xp=40), d='책. 읽으면 경험 +40', g=15),
    'I-076': dict(c='book', fx=dict(lore=1, wilUp=1), d='마법서. 읽으면 정신 +1 (영구)', g=80, r=3),
    'I-075': dict(c='book', fx=dict(lore=1, xp=25), d='열쇠 그림 책. 경험 +25', g=12),
    'I-070': dict(c='book', fx=dict(sealedScroll=1), d='잠긴 두루마리. 굴에서 펴 보면 무언가 일어남', g=25, r=2),
    'I-072': dict(c='relic', s='carry', fx=dict(skillCd=8), d='회중시계. 스킬 대기 -8%', g=40, r=2),
    'I-244': dict(c='use', fx=dict(bell=2.5), d='가장자리가 깨진 검은 종. 울리면 주변 적이 2.5초 멍해짐', g=35, stack=3, r=2),
    'I-246': dict(c='use', fx=dict(cure=1, hp=25), d='은실 실패와 송곳니 바늘. 상처를 꿰맴 (출혈 멎음, 체력 +25)', g=18, stack=5),
    'I-247': dict(c='acc', s='acc', fx=dict(pick=40), d='손바닥에 문이 달린 가죽 장갑. 자물쇠 따기 +40%', g=40, r=3),
    'I-248': dict(c='use', fx=dict(box=1), d='삼지창 문양 푸른 함. 열면 무언가가 나옴', g=30, r=2),
    'I-250': dict(c='use', fx=dict(dice=1), d='붉은 보자기에 싼 검은 주사위. 굴리면… 운에 맡김', g=20, r=2),
    'I-254': dict(c='potion', fx=dict(regen=dict(v=2, dur=30)), d='나뭇잎 꽂힌 구리 통. 30초 동안 초당 +2', g=15, stack=5),
    'I-255': dict(c='acc', s='acc', fx=dict(sanDrain=-20, sanity=5), d='사슬에 꿴 쇠 부적 묶음. 정신도 감소 -20%', g=45, r=3),
    'I-256': dict(c='relic', s='carry', fx=dict(vision=15), d='노란 유리 쇠 등불. 시야 +15%', g=35, r=2),
    'I-257': dict(c='use', fx=dict(whistle=1), d='붉은 술 달린 쇠 호루라기. 불면 동료가 모두 내 곁으로 달려오고 10초 공격 +15%', g=25, stack=3, r=2),
    'I-258': dict(c='use', fx=dict(freeze=3), d='얼음 상자에 갇힌 쇠못. 던지면 둘레 적이 3초 얼어붙음', g=40, stack=3, r=3),
    'I-243': dict(c='food', fx=dict(hp=20, san=-5, food=2), d='편자 사이에 감긴 은빛 장어. 먹을 수는 있다 (정신도 -5)', g=10),
    'I-261': dict(c='potion', fx=dict(hp=10, san=6), d='코르크 마개 초록 물병. 정신도 +6', g=6, stack=5),
    'I-262': dict(c='mat', fx=dict(snail=2), d='마른 꼬투리. 굴의 달팽이 먹이 2', g=2),
    'I-274': dict(c='mat', fx=dict(snail=3), d='흰 싹 돋은 씨앗. 달팽이 우리에 심으면 먹이 3', g=4),
    'I-263': dict(c='mat', fx=dict(wood=8), d='마른 대롱 다발. 땔감 8', g=2),
    'I-264': dict(c='junk', d='흰 줄무늬 검은 돌. 매끄럽다', g=2),
    'I-265': dict(c='potion', fx=dict(san=15), d='꽃잎 뜬 분홍 사발. 정신도 +15', g=12, stack=3),
    'I-267': dict(c='junk', d='녹슨 추 달린 낚시찌', g=3),
    'I-268': dict(c='mat', fx=dict(snail=2), d='검은 흙 담긴 유리병. 달팽이 우리 흙', g=3),
    'I-269': dict(c='relic', s='carry', fx=dict(carry=2), d='뚜껑 달린 고리버들 바구니. 가방 칸 +2', g=15, r=1),
    'I-272': dict(c='use', fx=dict(cure=1, hp=10), d='가죽 끈 묶은 접은 천. 붕대처럼 씀', g=4, stack=5),
    'I-275': dict(c='food', fx=dict(hp=25, food=2), d='녹슨 양철 도시락통. 누가 싸 줬을까. 체력 +25', g=10),
    'I-277': dict(c='junk', d='금 간 흰 돌판. 글자가 반쯤 지워졌다', g=6),
    'I-278': dict(c='potion', fx=dict(gamble=1), d='코르크 마개 검은 단지. 약일까 독일까', g=10, stack=3),
    'I-279': dict(c='potion', fx=dict(hp=25, cure=1), d='마른 약초 다발. 체력 +25, 중독을 씻음', g=10, stack=5),
    'I-018': dict(c='weapon'), 'I-019': dict(c='weapon'),
    'I-001': dict(c='junk', d='다이얼 전화기. 신호가 없다', g=15), 'I-002': dict(c='junk', d='공중전화. 누가 이걸 들고 왔지', g=20),
    'I-003': dict(c='junk', d='스마트폰. 배터리가 없다', g=30), 'I-005': dict(c='junk', d='노트북', g=35), 'I-012': dict(c='junk', d='휴대폰', g=20),
    'I-013': dict(c='junk', fx=dict(mood=4), d='게임패드. 굴에 두면 무드 +4', g=12), 'I-014': dict(c='junk', fx=dict(mood=3), d='헤드폰', g=12),
    'I-026': dict(c='junk', d='토스터', g=10), 'I-027': dict(c='junk', d='카메라', g=25), 'I-028': dict(c='junk', d='리모컨', g=5),
}
# 무기 · 방어구 아이템 그림 (I-006 …): 장비로
I_GEAR = {'I-006': ('weapon', 'sword', None, 1), 'I-007': ('weapon', 'axe', None, 1), 'I-008': ('weapon', 'bow', None, 1), 'I-020': ('weapon', 'dagger', None, 1),
          'I-039': ('weapon', 'sword', None, 1), 'I-040': ('weapon', 'staff', None, 2), 'I-018': ('weapon', 'pistol', 'laser', 3), 'I-019': ('weapon', 'lever', 'laser', 3),
          'I-241': ('weapon', 'axe', 'cleaver', 2), 'I-245': ('weapon', 'pistol', None, 2), 'I-249': ('weapon', 'dagger', None, 2), 'I-253': ('weapon', 'sword', 'dual', 2),
          'I-036': ('head', None, None, 1), 'I-083': ('head', None, None, 0), 'I-084': ('head', None, None, 1), 'I-085': ('head', None, None, 2),
          'I-078': ('legs', None, None, 0), 'I-079': ('legs', None, None, 1), 'I-080': ('legs', None, None, 1), 'I-252': ('legs', None, None, 2),
          'I-081': ('acc', None, None, 1), 'I-082': ('acc', None, None, 0), 'I-088': ('acc', None, None, 0), 'I-260': ('acc', None, None, 2),
          'I-087': ('body', None, None, 1), 'I-089': ('body', None, None, 1), 'I-090': ('body', None, None, 2), 'I-091': ('body', None, None, 3), 'I-242': ('body', None, None, 2),
          'I-251': ('head', None, None, 2), 'I-259': ('head', None, None, 2)}
for iid, (slot, kind, vr, rar) in I_GEAR.items():
    e = BY[iid]
    if slot == 'weapon': it = weapon_item(e, e['name'].replace(' (권총)', '').replace(' (소총)', ''), kind, vr, rar)
    else: it = armor_item(e, e['name'], slot, rar)
    if iid in ('I-018', 'I-019'): it['d'] = '현대에서 떨어진 광선총. 배터리로 쏨 (꿰뚫는 빛)'
    add(iid, it, e, e['src'], e['src'] if slot == 'weapon' else None)
for iid, o in I.items():
    if iid in ITEMS: continue
    e = BY[iid]
    it = dict(n=e['name'], c=o['c'], s=o.get('s', o['c']), r=o.get('r', 0), fx=o.get('fx', {}), d=o.get('d', ''), g=o.get('g', 5), w=0)
    if it['c'] in ('food', 'potion', 'use', 'ammo', 'gold', 'mat', 'light', 'key', 'junk', 'tool', 'book'): it['stack'] = o.get('stack', 20 if it['c'] in ('ammo', 'mat', 'junk') else 10)
    add(iid, it, e, e['src'])
# 굴 전용 (그림은 굴 쪽 것): 횃불 꾸러미 · 화살 · 총알 낱개 (아이콘은 탄약 그림 재사용)
VIRTUAL = {
    'arrow':  dict(n='화살', c='ammoRaw', s='ammoRaw', r=0, fx={}, d='화살. 활 · 석궁에 씀. 박히면 주울 수 있음', _icon='img/item/I-285.webp'),
    'bullet': dict(n='총알', c='ammoRaw', s='ammoRaw', r=0, fx={}, d='총알. 권총 · 레버액션 · 돌격소총', _icon='img/item/I-282.webp'),
    'shell':  dict(n='산탄', c='ammoRaw', s='ammoRaw', r=0, fx={}, d='산탄. 산탄총', _icon='img/item/I-283.webp'),
    'cell':   dict(n='광선', c='ammoRaw', s='ammoRaw', r=0, fx={}, d='광선총 충전', _icon='img/item/I-009.webp'),
}
for k, v in VIRTUAL.items(): v['id'] = k; ITEMS[k] = v

# ---------- 값 (금화) ----------
for it in ITEMS.values():
    if 'g' not in it:
        it['g'] = int((10 + 12 * it['r'] ** 1.6) * (1.5 if it.get('relic') else 1) * (0.9 + 0.2 * H(it['id'], 'g')))

# ---------- 그림 묶음 ----------
os.makedirs(ATLAS, exist_ok=True)
def load(p):
    full = os.path.join(CODEX, p)
    im = Image.open(full).convert('RGBA')
    return im

def trim(im, thr=24):
    a = np.array(im)[:, :, 3]
    ys, xs = np.where(a > thr)
    if not len(xs): return im
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

ICON = 72; ICOLS = 16; IPER = ICOLS * ICOLS
icon_ids = sorted(ITEMS.keys(), key=lambda k: (ITEMS[k]['c'], k))
src_index = {}
sheets = []
cnt = 0
for iid in icon_ids:
    s = ITEMS[iid]['_icon']
    if s in src_index: ITEMS[iid]['i'] = src_index[s]; continue
    n = cnt; cnt += 1
    if n % IPER == 0: sheets.append(Image.new('RGBA', (ICOLS * ICON, ICOLS * ICON), (0, 0, 0, 0)))
    try: im = trim(load(s))
    except Exception as ex: print('그림 없음', iid, s, ex); im = Image.new('RGBA', (8, 8))
    im.thumbnail((ICON - 6, ICON - 6), Image.LANCZOS)
    sh = sheets[-1]; k = n % IPER
    sh.alpha_composite(im, ((k % ICOLS) * ICON + (ICON - im.width) // 2, (k // ICOLS) * ICON + (ICON - im.height) // 2))
    src_index[s] = n; ITEMS[iid]['i'] = n
# 마지막 시트는 쓴 줄까지만
icon_files = []
for si, sh in enumerate(sheets):
    used = min(IPER, cnt - si * IPER); rows = (used + ICOLS - 1) // ICOLS
    sh = sh.crop((0, 0, ICOLS * ICON, rows * ICON))
    fn = f'icon{si}.webp'; sh.save(os.path.join(ATLAS, fn), 'WEBP', quality=82, method=6); icon_files.append('art/atlas/' + fn)

# 손에 드는 무기: 주성분 축 정렬
HW, HH = 200, 76; HCOLS = 10
TIP_UP = {'spear', 'sword', 'greatsword', 'dagger', 'staff'}
TIP_HEAVY = {'axe', 'hammer', 'crossbow'}
TIP_LIGHT = {'pistol', 'shotgun', 'lever', 'assault'}
FLIP = {}          # 검수 뒤 손으로 고침: id → 'h' (좌우) · 'v' (위아래) · 'hv'
FLIP_FILE = os.path.join(HERE, 'held_fix.json')
if os.path.exists(FLIP_FILE): FLIP = json.load(open(FLIP_FILE, encoding='utf8'))

# 석궁은 십자 모양이라 축이 헷갈림: 그림을 보고 정한 각 (좌우 뒤집기 먼저, 그다음 반시계 각)
XBOW = {'EQ-008': (1, 29), 'EQ-028': (0, -27), 'EQ-048': (0, 37), 'EQ-058': (0, 50), 'EQ-128': (1, 0), 'EQ-150': (1, 19), 'EQ-170': (0, -24), 'R-S088': (1, 15)}
def held_norm(im, kind, iid):
    im = trim(im)
    if iid in XBOW:
        fl, deg = XBOW[iid]
        if fl: im = im.transpose(Image.FLIP_LEFT_RIGHT)
        return trim(im.rotate(deg, resample=Image.BICUBIC, expand=True))
    if kind in ('shield',) or iid.startswith('W-') or iid == 'B-2':
        out = im                                                   # 방패 · 2D 가로 그림은 그대로
        if kind == 'bow' and iid.startswith('W-'): out = im        # 2D 활 (세운 그림)
    else:
        a = np.array(im)[:, :, 3].astype(np.float32) / 255.0
        ys, xs = np.nonzero(a > 0.15)
        w = a[ys, xs]
        cx, cy = np.average(xs, weights=w), np.average(ys, weights=w)
        X = np.stack([xs - cx, ys - cy], 1)
        C = (X * w[:, None]).T @ X / w.sum()
        ev, evec = np.linalg.eigh(C)
        ux, uy = evec[:, 1]                                       # 가장 긴 축
        t = X @ np.array([ux, uy])
        tmin, tmax = t.min(), t.max()
        def endmass(lo, hi):
            m = (t >= lo) & (t <= hi); return float(w[m].sum())
        L = tmax - tmin
        mass_max = endmass(tmax - 0.22 * L, tmax); mass_min = endmass(tmin, tmin + 0.22 * L)
        # 축을 따라 칸마다 넓이 (코등이 · 손잡이 찾기)
        nb = 48; bins = np.clip(((t - tmin) / max(1e-6, L) * nb).astype(int), 0, nb - 1)
        prof = np.bincount(bins, weights=w, minlength=nb)
        prof = np.convolve(prof, np.ones(3) / 3, mode='same')
        g = int(np.argmax(prof)) / nb                              # 가장 넓은 자리 (0 = tmin 끝, 1 = tmax 끝)
        if kind in ('sword', 'greatsword', 'dagger'):
            tip_max = g < 0.5                                      # 코등이 (넓은 자리)에서 먼 쪽이 날 끝
        elif kind in ('spear', 'staff'):
            tip_max = (uy < 0) if abs(uy) > 0.25 else g > 0.5     # 위쪽 끝 · 넓은 머리 쪽
        elif kind in TIP_HEAVY: tip_max = mass_max > mass_min
        elif kind in TIP_LIGHT:
            tip_max = (uy < 0) if abs(uy) > 0.3 else mass_max < mass_min   # 비스듬하면 위쪽이 총구, 가로면 가는 쪽
        else: tip_max = uy < 0
        ang = math.degrees(math.atan2(uy, ux))
        if kind == 'bow':
            out = im.rotate(ang + 90, resample=Image.BICUBIC, expand=True)
        else:
            out = im.rotate(ang, resample=Image.BICUBIC, expand=True)
            if not tip_max: out = out.transpose(Image.FLIP_LEFT_RIGHT)
            out = trim(out)
            if kind in TIP_LIGHT:                                 # 총: 손잡이가 아래로
                a2 = np.array(out)[:, :, 3].astype(np.float32)
                hh = a2.shape[0]; up = a2[:hh // 2].sum(); dn = a2[hh - hh // 2:].sum()
                if up > dn * 1.12: out = out.transpose(Image.FLIP_TOP_BOTTOM)
        out = trim(out)
    f = FLIP.get(iid, '')
    if 'h' in f: out = out.transpose(Image.FLIP_LEFT_RIGHT)
    if 'v' in f: out = out.transpose(Image.FLIP_TOP_BOTTOM)
    if 'r' in f: out = out.rotate(90, expand=True)
    return trim(out)

held_ids = [k for k in sorted(ITEMS) if ITEMS[k].get('s') == 'weapon' and ITEMS[k].get('_held')]
hsheets = []; qa = []
for n, iid in enumerate(held_ids):
    it = ITEMS[iid]
    if n % (HCOLS * 26) == 0: hsheets.append(Image.new('RGBA', (HCOLS * HW, 26 * HH), (0, 0, 0, 0)))
    try: im = held_norm(load(it['_held']), it['wt'], iid)
    except Exception as ex: print('무기 그림 오류', iid, ex); continue
    upright = it['wt'] in ('bow', 'shield')
    sc = min((HW - 4) / im.width, (HH - 4) / im.height)
    im2 = im.resize((max(1, int(im.width * sc)), max(1, int(im.height * sc))), Image.LANCZOS)
    k = n % (HCOLS * 26); ox = (k % HCOLS) * HW; oy = (k // HCOLS) * HH
    px = ox + (HW - im2.width) // 2; py = oy + (HH - im2.height) // 2
    hsheets[-1].alpha_composite(im2, (px, py))
    it['h'] = [n, round(im2.width / HW, 4), round(im2.height / HH, 4)] + ([1] if upright else [])
    qa.append((iid, im2))
held_files = []
for si, sh in enumerate(hsheets):
    used = min(HCOLS * 26, len(held_ids) - si * HCOLS * 26); rows = (used + HCOLS - 1) // HCOLS
    sh = sh.crop((0, 0, HCOLS * HW, rows * HH))
    fn = f'held{si}.webp'; sh.save(os.path.join(ATLAS, fn), 'WEBP', quality=85, method=6); held_files.append('art/atlas/' + fn)
# 검수 그림 (회색 바탕, 왼쪽에 손잡이 점)
cols = 10; qw, qh = 200, 90
q = Image.new('RGB', (cols * qw, ((len(qa) + cols - 1) // cols) * (qh + 14)), (60, 60, 60)); dq = ImageDraw.Draw(q)
for i, (iid, im2) in enumerate(qa):
    t = im2.copy(); t.thumbnail((qw - 8, qh - 8))
    x = (i % cols) * qw; y = (i // cols) * (qh + 14)
    q.paste(t, (x + 4, y + 4), t)
    g = GRIP.get(ITEMS[iid]['wt'], 0.5); dq.ellipse((x + 4 + g * t.width - 3, y + 4 + t.height / 2 - 3, x + 4 + g * t.width + 3, y + 4 + t.height / 2 + 3), fill=(255, 60, 60))
    dq.text((x + 4, y + qh), f"{iid} {ITEMS[iid]['wt']}", fill=(255, 255, 0))
q.save(os.path.join(QA_DIR, 'held_qa.png'))
for grp, kinds in [('gun', ('pistol', 'shotgun', 'lever', 'assault', 'crossbow')), ('blade', ('sword', 'greatsword', 'dagger')), ('pole', ('spear', 'staff', 'axe', 'hammer'))]:
    sel = [(iid, im2) for iid, im2 in qa if ITEMS[iid]['wt'] in kinds]
    cols = 6; qw, qh = 330, 120
    q = Image.new('RGB', (cols * qw, ((len(sel) + cols - 1) // cols) * (qh + 16)), (70, 70, 70)); dq = ImageDraw.Draw(q)
    for i, (iid, im2) in enumerate(sel):
        t = im2.copy(); t.thumbnail((qw - 10, qh - 6))
        x = (i % cols) * qw; y = (i // cols) * (qh + 16)
        q.paste(t, (x + 5, y + 3), t)
        dq.line((x + qw - 30, y + qh / 2, x + qw - 8, y + qh / 2), fill=(80, 255, 80), width=3)
        dq.text((x + 5, y + qh), f"{iid} {ITEMS[iid]['wt']} {ITEMS[iid].get('vr') or ''} {ITEMS[iid]['n'][:14]}", fill=(255, 255, 0))
    q.save(os.path.join(QA_DIR, f'held_qa_{grp}.png'))

# ---------- 내보내기 ----------
def clean(it):
    o = {}
    for k, v in it.items():
        if k.startswith('_') or k in ('fixedD',): continue
        if k == 'def_': k = 'def'
        if k == 'fx' and not v: continue
        if v is None: continue
        o[k] = v
    return o
out = {k: clean(v) for k, v in ITEMS.items()}
isz = [[ICOLS * ICON, ((min(IPER, cnt - si * IPER) + ICOLS - 1) // ICOLS) * ICON] for si in range(len(icon_files))]
meta = dict(icon=dict(cell=ICON, cols=ICOLS, sheets=icon_files, size=isz), held=dict(w=HW, h=HH, cols=HCOLS, rows=26, sheets=held_files), grip=GRIP)
js = ('/* data_items.js — tools/build_items.py v1.0이 도감에서 만듦 (손으로 고치지 않음)\n'
      '   ITEMS[id]: n 이름 · c 갈래 · s 칸 · wt 무기 종류 · vr 변형 · r 등급 (0 낡은 ~ 6 보스) · atk · def · fx 효과 · d 설명 · g 값 · w 무게 · i 아이콘 칸 · h 손 그림 [칸, 너비비, 높이비, 세움] · L 길이 (칸) */\n'
      "'use strict';\n"
      f'const ITEM_ART = {json.dumps(meta, ensure_ascii=False)};\n'
      f'const ITEMS = {json.dumps(out, ensure_ascii=False, separators=(",", ":"))};\n')
open(OUT_JS, 'w', encoding='utf8').write(js)
from collections import Counter
print('아이템', len(out), '아이콘', cnt, '무기 그림', len(held_ids), 'JS', len(js) // 1024, 'KB')
print('칸', Counter(v['s'] for v in out.values()))
print('무기', Counter(v.get('wt') for v in out.values() if v.get('wt')))
print('등급', Counter(v['r'] for v in out.values()))
print('분류 못 함 → 장신구:', unk)
