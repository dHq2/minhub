# reclass.py v1.0 — 도감 재분류 (catalog v1.76)
# 묶음 (sub)을 "그림을 받은 팩 이름"에서 "게임에서 쓰는 곳 (쓰임새)"으로 바꿈. 원래 묶음은 pk에 남김 (찾기 · 크게 보기에서 보임)
#  · 장비: 무기 종류 · 보조 (방패) · 방어구 부위 · 장신구 (게임 데이터 cave-3d/src/data_items.js의 칸 · 종류 그대로)
#  · 일반 에셋: 회복 · 음식 · 탄약 · 재료 · 열쇠 · 빛 · 쓰는 물건 · 잡동사니 · 현대 물건 · 생물
#  · 가구 · 소품: 굴 가구 · 던전 (빛 · 상자 · 무덤 · 방어물 · 제단) · 상점 · 지형 · 건축물 · 도시 · 기계 · 인카운터 오브제 · 팩션 지형
#  · 장면: 컷씬 · 인카운터 · 조우 장면 카드 · 배경 · 빈 맵 틀 / 스킬 · 이야기: 이야기 그림 · 스킬 (기능별)
#  · on (게임에 들어감): 아이템 963 · 던전 소품 (art/dun) · 포로 (art/npc) · 이미 켜진 것
#  · game: 게임 속 칸 · 종류 · 등급 (크게 보기에 보임)
#  · 이름: tools/names_v176.tsv (id → 새 이름, 원래 이름은 was에 남김)
# 실행: python3 codex/tools/reclass.py [--dry]
import json, os, re, sys
from collections import Counter, OrderedDict
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); GAME = os.path.join(os.path.dirname(ROOT), 'cave-3d')
DRY = '--dry' in sys.argv
src = open(os.path.join(ROOT, 'catalog.js'), encoding='utf8').read()
HEAD_OLD = src[:src.index('[')]
CAT = json.loads(src[src.index('['):src.rindex(']') + 1])
g = open(os.path.join(GAME, 'src', 'data_items.js'), encoding='utf8').read(); i = g.index('const ITEMS'); j = g.index('{', i)
ITEMS = json.loads(g[j:g.index('};', j) + 1])
DUN = {f[:-5] for f in os.listdir(os.path.join(GAME, 'art', 'dun')) if f.endswith('.webp')}
NPC = {f[:-5] for f in os.listdir(os.path.join(GAME, 'art', 'npc')) if f.endswith('.webp')} if os.path.isdir(os.path.join(GAME, 'art', 'npc')) else set()
WT_N = {'spear': '창', 'sword': '검', 'greatsword': '대검', 'dagger': '단검', 'axe': '도끼', 'hammer': '망치', 'shield': '방패', 'staff': '지팡이', 'bow': '활', 'crossbow': '석궁', 'pistol': '권총', 'shotgun': '산탄총', 'lever': '레버액션 소총', 'assault': '돌격소총'}
WT_ORDER = ['sword', 'greatsword', 'dagger', 'axe', 'hammer', 'spear', 'staff', 'bow', 'crossbow', 'pistol', 'shotgun', 'lever', 'assault']
RAR = ['낡은', '평범한', '좋은', '명품', '영웅', '전설', '보스']
SLOT_N = {'head': '머리', 'body': '몸', 'legs': '다리'}
C_N = {'potion': '물약', 'use': '쓰는 물건', 'food': '음식', 'ammo': '탄약', 'ammoRaw': '탄약 (재료)', 'mat': '재료', 'tool': '도구', 'gold': '돈', 'book': '책 · 지도', 'key': '열쇠', 'light': '빛', 'junk': '잡동사니', 'furn': '굴 가구', 'pet': '펫', 'relic': '유물 (지님)', 'weapon': '무기', 'armor': '방어구', 'acc': '장신구'}

def game_of(e):
    d = ITEMS.get(e['id'])
    if not d: return ''
    if d['s'] == 'weapon': k = '보조 · 방패' if d.get('wt') == 'shield' else '무기 · ' + WT_N.get(d.get('wt'), '?')
    elif d['s'] in SLOT_N: k = '방어구 · ' + SLOT_N[d['s']]
    elif d['s'] == 'acc': k = '장신구'
    elif d['s'] == 'carry': k = '지니는 유물'
    else: k = C_N.get(d['c'], d['c'])
    st = []
    if d.get('atk'): st.append(f"공격 {d['atk']}")
    if d.get('def'): st.append(f"방어 {d['def']}")
    return f"게임: {k} · {RAR[min(6, d.get('r', 0))]}" + (' · ' + ' · '.join(st) if st else '')

# ---------- 장비 ----------
def sub_equip(e):
    if e['sub'].startswith('보스 장비'): return e['sub']
    d = ITEMS.get(e['id'])
    if not d: return '장비 · 게임에 아직 없음'
    if d['s'] == 'weapon': return '보조 · 방패' if d.get('wt') == 'shield' else '무기 · ' + WT_N.get(d.get('wt'), '기타')
    if d['s'] in SLOT_N: return '방어구 · ' + SLOT_N[d['s']]
    if d['s'] == 'acc': return '장신구'
    return '장비 · ' + C_N.get(d['c'], '기타')

# ---------- 일반 에셋 ----------
def sub_item(e):
    s, n = e['sub'], e['name']
    if s.startswith('생물'): return s
    d = ITEMS.get(e['id'])
    if d:
        c = d['c']
        if c in ('potion',) or (c == 'use' and re.search(r'붕대|구급|약|치료', n)): return '회복 (물약 · 붕대)'
        if c == 'food': return '음식'
        if c in ('ammo', 'ammoRaw'): return '탄약'
        if c in ('mat', 'gold'): return '재료와 돈'
        if c == 'tool': return '도구'
        if c in ('book', 'key'): return '열쇠와 책'
        if c == 'light': return '빛'
        if c == 'use': return '쓰는 물건'
        if c == 'junk': return '잡동사니'
        if c in ('furn', 'pet'): return '가구 유물과 펫'
        if c == 'relic': return '지니는 물건'
        if c in ('weapon', 'armor', 'acc'): return '장비 아이콘'
    if s == '현대 물건': return '현대 물건'
    if re.search(r'상자|통', n): return '상자와 통'
    if re.search(r'표지판|팻말|이정표', n): return '표지판'
    if re.search(r'횃불|랜턴|등불|초', n): return '빛'
    if s == '무기 · 방어구': return '장비 아이콘'
    if s in ('물약 · 음식',): return '음식' if re.search(r'고기|빵|햄|생선|사과|치즈', n) else '회복 (물약 · 붕대)'
    if s == '재료 · 도구 · 돈': return '도구' if re.search(r'곡괭이|삽|돋보기|렌치|망치|배낭', n) else '재료와 돈'
    if s == '열쇠와 책': return '열쇠와 책'
    return '기타 물건'
ITEM_ORDER = ['회복 (물약 · 붕대)', '음식', '탄약', '빛', '열쇠와 책', '쓰는 물건', '도구', '재료와 돈', '지니는 물건', '장비 아이콘', '상자와 통', '표지판', '가구 유물과 펫', '잡동사니', '현대 물건', '기타 물건']

# ---------- 가구 · 소품 (이름 낱말 → 쓰임새, 앞에 있는 것이 먼저) ----------
PROP_RULES = [
    ('인카운터 오브제 · 인물', None, ['인카운터 오브제 · NPC']),
    ('굴 가구 · 수납', r'장식장|성물함', None),
    ('도시와 기계', r'배관|밸브|기계 관|유리관|콘크리트 관|호스|전화기|세안대|케이블|단말|경광등|보일러|필터|유리 원통', None),
    ('던전 · 무덤 · 시체', r'무덤|묘비|담쟁이 관|검은 관|석관|해골|시체|뼈|납골|고깃덩어리|들것|형틀|전사한|꽂힌 검', None),
    ('던전 · 제단 · 성물 · 우물', r'제단|원진|석상|천사상|성모|감실|비석|도리이|수반|우물|분수|종루|석문|성물|수정|오벨리스크|의식|새장|가면 더미|가시관', None),
    ('굴 가구 · 침대 · 의자 · 탁자', r'침대|의자|스툴(?!함)|벤치|소파|왕좌|탁자|책상|협탁(?!장)|테이블|오토만|침낭|피아노', None),
    ('굴 가구 · 수납', r'옷장|장식장|사물함|찬장|선반|책장|서랍|캐비닛|진열장|약장|냉장고|협탁장|성물함|스툴함|금고', None),
    ('상점과 작업대', r'행상|노점|가판|작업대', None),
    ('던전 · 상자 · 통 · 보급', r'상자|궤짝|궤$|(?<![원몸])통$|(?<![원몸])통 |드럼통|자루|항아리|보급|물자|공구함|기름통|술통|밧줄', None),
    ('던전 · 빛 · 불', r'촛대|촛불|화로|등잔|등불|횃불|모닥불|벽난로|샹들리에|가로등|램프|랜턴|갓 스탠드|천장등|매달린 등|(?<!옷걸이 )스탠드 \d|(?<!옷걸이 )스탠드$|조명|난로', None),
    ('던전 · 방어물 · 야영', r'방책|목책|바리케이드|방벽|천막|망루|말뚝|울타리|담장|철문|깃발|대포|거치대|무기 · 방패 더미|갑옷 더미|화살 더미|투구 더미|창 다발|모래주머니|철조망|펜스|라바콘|수레', None),
    ('상점과 작업대', r'작업대|노점|가판|행상|대장간|모루|접수대|카트|금전 등록기', None),
    ('굴 가구 · 방 꾸밈', r'거울|칸막이|욕조|세면대|변기|라디에이터|옷걸이|시계|액자|화장대|선풍기|커튼|카펫|걸이대|틀$|오르골', None),
    ('굴 가구 · 생활 소품', r'책|편지|화병|화분|술병|잔$|머그|주전자|종이|가방|선물|깡통|그릇|쿠션|고양이|펌프|여물통|백합|신문|컵|장갑|냄비|담요|사발|아령|킥보드|녹음기|운동화|구두|장바구니|새싹|마네킹', None),
    ('도시와 기계', r'전봇대|자판기|정류장|공중전화|신호등|통신탑|에스컬레이터|소화전|쓰레기통|배관|밸브|캡슐|콘솔|단말|서버|발전|로봇|보안문|기계|수액|경광등|화장실|모니터|배전반|개찰구|윈치|영사기|광차|도르래|레버|전동기|환풍기|전선|배수구|컨베이어|용접|경사판|실외기|프레스|분쇄기|확성기|자물쇠|수조', None),
    ('건축물', r'아치|예배당|성벽|계단|탑|건물|집|다리|문$|대문|지붕|오두막', None),
    ('지형 · 바위 · 폐허 · 자연', r'바위|돌|그루터기|고목|나무|버섯|무너진|잔해|폐허|덩굴|결정|흙|발판|바퀴|기둥|벽', None),
]
def sub_prop(e):
    s, n = e['sub'], e['name']
    if s.startswith('범용 팩션 지형'): return s.replace('범용 팩션 지형', '팩션 지형')
    if s.startswith('오딜 방'): return '굴 가구 · 오딜의 방'
    if s.startswith('건축물') or s == '건축물': return '건축물'
    for name, rx, subs in PROP_RULES:
        if subs and s in subs: return name
        if rx and re.search(rx, n): return name
    if s.startswith('환경') or s.startswith('폐허'): return '지형 · 바위 · 폐허 · 자연'
    return '기타 소품'
PROP_ORDER = ['굴 가구 · 침대 · 의자 · 탁자', '굴 가구 · 수납', '굴 가구 · 방 꾸밈', '굴 가구 · 생활 소품', '굴 가구 · 오딜의 방', '던전 · 빛 · 불', '던전 · 상자 · 통 · 보급', '던전 · 무덤 · 시체', '던전 · 방어물 · 야영', '던전 · 제단 · 성물 · 우물', '상점과 작업대', '도시와 기계', '건축물', '지형 · 바위 · 폐허 · 자연', '인카운터 오브제 · 인물', '기타 소품']

# ---------- 장면 ----------
def sub_scene(e):
    s = e['sub']
    if s == '컷씬': return '컷씬'
    if s in ('인카운터',): return '인카운터 · 그림'
    if s == '인카운터 카드': return '인카운터 · 카드'
    if s.startswith('조우 장면'): return '인카운터 · 조우 장면 카드'
    if s == '배경': return '배경'
    if s.startswith('빈 맵 틀'): return '빈 맵 틀'
    return s
SCENE_ORDER = ['컷씬', '인카운터 · 그림', '인카운터 · 카드', '인카운터 · 조우 장면 카드', '배경', '빈 맵 틀']

# ---------- 스킬 · 이야기 (기능별) ----------
SKILL_RULES = [
    ('스킬 · 맨손 · 레슬링', r'정권|무릎|팔꿈치|박치기|돌려차기|손바닥|어깨 들이|다리 후리기|바닥 제압|손목 꺾|맨손|주먹|동료 던져|짓밟기'),
    ('스킬 · 방어 · 회피', r'방어|회피|막기|막아서기|맞받아치기|잔상|앞구르기|보호막|버텨|중압|결계|우산|유리판|방패 밀치기|십자 팔|도약|낮은 자세|자리 바꾸기|항복|분신 걸음'),
    ('스킬 · 무기 공격', r'끌어당기|베기|찌르기|일격|내려찍기|도끼|내리꽂기|강타|발도|사격|화살|활시위|석궁|산탄|탄창|도탄|과녁|던지기|돌격|칼날 갈기|사슬$|십자$|어부'),
    ('스킬 · 회복 · 지원', r'치료|붕대|응급|일으키기|치유|호흡|함성|충성|단결|건네|물약'),
    ('스킬 · 마법 · 이능', r'점화|소환|서리|회오리|번개|띄우기|차원문|분신술|충격파|마도서|까마귀|해골 손|빛의 검|거인 주먹|불꽃|가시덩굴|깊은 잠|돌이 되는|시간 되감기|천벌|땅울림|뿌리 속박|정신 혼미|시야 가리기|침묵|마음의 문'),
    ('스킬 · 탐색 · 도구', r'정찰|추적|자물쇠|엿듣기|땅 파기|철조망|사슬 끊기|덫|올가미|꿰뚫어 보기|숨은|징검돌|암벽|연막|탈출|독약|투구 깨뜨리기|벽 세우기|타르|촛불 꺼뜨리기|의자 걷어차기'),
]
def sub_card(e):
    s, n = e['sub'], e['name']
    if s.startswith('흑백 이야기'): return '이야기 그림 (흑백)'
    for name, rx in SKILL_RULES:
        if re.search(rx, n): return name
    return '스킬 · 기묘한 술수'
CARD_ORDER = [r[0] for r in SKILL_RULES] + ['스킬 · 기묘한 술수', '이야기 그림 (흑백)']

EQUIP_ORDER = ['무기 · ' + WT_N[k] for k in WT_ORDER] + ['보조 · 방패', '방어구 · 머리', '방어구 · 몸', '방어구 · 다리', '장신구']
FN = {'equip': sub_equip, 'item': sub_item, 'prop': sub_prop, 'scene': sub_scene, 'card': sub_card}
ORDER = {'equip': EQUIP_ORDER, 'item': ITEM_ORDER, 'prop': PROP_ORDER, 'scene': SCENE_ORDER, 'card': CARD_ORDER}

# ---------- 이름 ----------
REN = {}; PARENT = {}
p = os.path.join(HERE, 'names_v176.tsv')
if os.path.exists(p):
    for line in open(p, encoding='utf8'):
        if not line.strip() or line.startswith('#'): continue
        parts = line.rstrip('\n').split('\t'); REN[parts[0]] = parts[1].strip()
        if len(parts) > 2 and parts[2].strip(): PARENT[parts[0]] = parts[2].strip()
GENERIC = re.compile(r'^(유물|무기|방어구 · 옷|장신구|스킬 그림|이야기) \d+$')

n_ren = n_on = 0
for e in CAT:   # 이름 먼저 (쓰임새는 고친 이름으로 가름)
    new = REN.get(e['id'])
    if not new and GENERIC.match(e['name']) and e['id'] in ITEMS and not GENERIC.match(ITEMS[e['id']]['n']): new = ITEMS[e['id']]['n']
    if new and new != e['name']:
        e.setdefault('was', e['name']); e['name'] = new; n_ren += 1
    if e['id'] in PARENT: e['parent'] = PARENT[e['id']]
for e in CAT:
    if 'pk' not in e and e['cat'] in FN: e['pk'] = e['sub']
    if e['cat'] in FN: e['sub'] = FN[e['cat']](dict(e, sub=e['pk']))
    gm = game_of(e)
    if gm: e['game'] = gm
    # 게임에 들어간 것
    on = e.get('on') or e['id'] in ITEMS or (e['cat'] == 'prop' and e['id'] in DUN) or (e['src'].split('/')[-1][:-5] in NPC)
    if on and not e.get('on'): n_on += 1
    e['on'] = bool(on)
# 색 변형 (부모 이름 + ' · 색 변형 (…)')은 부모 이름을 따라감
BYID = {e['id']: e for e in CAT}
for e in CAT:
    pa = BYID.get(e.get('parent', ''))
    if pa and pa.get('was') and e['name'].startswith(pa['was'] + ' · '):
        e.setdefault('was', e['name']); e['name'] = pa['name'] + e['name'][len(pa['was']):]
for e in CAT:   # 소파 묶음 (부모가 c1)
    if e['name'].startswith('범용 소파 · '): e.setdefault('was', e['name']); e['name'] = '천 소파 · ' + e['name'][len('범용 소파 · '):]

# 분류마다 쓰임새 순서로 (같은 묶음 안은 원래 순서)
pos = {id(e): k for k, e in enumerate(CAT)}
CAT_ORDER = []
for e in CAT:
    if e['cat'] not in CAT_ORDER: CAT_ORDER.append(e['cat'])
def key(e):
    o = ORDER.get(e['cat'])
    sk = (o.index(e['sub']) if e['sub'] in o else len(o) + (1 if e['sub'].startswith('보스') else 0)) if o else 0
    return (CAT_ORDER.index(e['cat']), sk, pos[id(e)])
CAT.sort(key=key)

cnt = Counter((e['cat'], e['sub']) for e in CAT if e['cat'] in FN)
for (c, s), n in cnt.items(): print(f'{n:4d}  {c} / {s}')
print('renamed', n_ren, '· newly on', n_on)
odd = [e for e in CAT if e['sub'] in ('기타 소품', '기타 물건', '스킬 · 기묘한 술수', '장비 · 게임에 아직 없음')]
print('기타:', ' | '.join(f"{e['id']}:{e['name']}" for e in odd[:80]))
if not DRY:
    head = '/* catalog.js v1.76 — 도감 항목. id는 바뀌지 않음. on = 지금 3D에 들어가 있음. spec = 확정한 설정 · 효과 (본문색), note = 출처 · 할 일 (흐린색). cid = 인물 번호. v1.76: 쓰임새로 다시 나눔 (sub = 쓰임새, pk = 원래 받은 묶음, game = 게임 속 칸 · 등급, was = 고치기 전 이름) — tools/reclass.py */\nconst CATALOG = '
    with open(os.path.join(ROOT, 'catalog.js'), 'w', encoding='utf8') as o:
        o.write(head + json.dumps(CAT, ensure_ascii=False, indent=0) + ';\n')
    print('wrote catalog.js')
if '--dump' in sys.argv:
    ck = sys.argv[sys.argv.index('--dump') + 1]
    by = OrderedDict()
    for e in CAT:
        if e['cat'] == ck: by.setdefault(e['sub'], []).append(e['name'])
    for k, v in by.items(): print('##', k, len(v), '::', ' | '.join(v)[:1200]); print()
if '--need' in sys.argv:   # 이름을 손봐야 할 것 (번호뿐 · 끝에 숫자)
    need = [e for e in CAT if e['cat'] != 'char' and not e.get('parent') and (GENERIC.match(e['name']) or re.search(r' \d+$', e['name']) or re.search(r' \d+ \(', e['name']))]
    json.dump([[e['id'], e['name'], e['src'], e['sub']] for e in need], open(sys.argv[sys.argv.index('--need') + 1], 'w'), ensure_ascii=False)
    print('need', len(need), Counter(e['cat'] for e in need))
