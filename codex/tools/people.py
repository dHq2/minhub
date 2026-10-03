# people.py v1.1 — 8 인물 · 9 2D판 인물 · 10 표정을 '인물' 하나로 합침. 맨 위 초상화 모음, 아래 인물마다 묶음. id는 그대로
import json, re
P = 'catalog.js'
src = open(P).read(); head, body = src.split('const CATALOG = ', 1); cat = json.loads(body.strip().rstrip(';'))
ROLES = ['동료', 'NPC', '적 · 보스', '역할 미정', '미등장 NPC']
# 인물: 키 → (이름, 역할). 순서 = 보이는 순서
CH = [
 ('player','인주','동료'),('rebecca','레베카','동료'),('karius','카리우스','동료'),('goblin','청광묵','동료'),('morningstar','모닝스타','동료'),
 ('poren','포렌','동료'),('norman','노먼','동료'),('yellow','옐로','동료'),('tomoe','용묘화','동료'),('goodwill','GOOD WILL','동료'),
 ('dolsoe','돌쇠','동료'),('piel','피엘','동료'),('odo','오도','동료'),('moro','모로','동료'),('gur','구르','동료'),('tehera','테헤라','동료'),('heron','낙오자 헤론','동료'),
 ('nurse','간호사 (1성 영웅)','동료'),('gothic','고딕 기사 (흑기사, 3성 영웅)','동료'),
 ('npcyellow','노랑','NPC'),('ycat','노랑고양','NPC'),('mari','마리','NPC'),('wakin','와킨','NPC'),('arian','퀸 아리안','NPC'),('general','대장군','NPC'),
 ('kal','칼 (현자)','NPC'),('odile','오딜','NPC'),('rosina','로시나','NPC'),('umbrella','우산 소녀','NPC'),('drawer','방랑 서랍 (적 또는 NPC)','NPC'),
 ('horsehead','말대가리','NPC'),('deadhero','죽은 영웅','NPC'),('slave','노예노예','NPC'),('silhouette','일반인 실루엣','NPC'),
 ('jeokroe','적뢰','적 · 보스'),('cesar','세자르','적 · 보스'),('agnes','로젤','적 · 보스'),('hargen','하르겐','적 · 보스'),('miller','방앗간지기 오르소','적 · 보스'),
 ('faded','색을 잃은 자','적 · 보스'),('fingerHole','손가락 구멍','적 · 보스'),('mask','가면 (특별한 적)','적 · 보스'),
 ('swordsman','검사','적 · 보스'),('spearman','창병','적 · 보스'),('shieldman','검방패병','적 · 보스'),('brute','곤봉 거한','적 · 보스'),('archer','붉은 망토 궁수','적 · 보스'),
 ('benkin','벤킨','적 · 보스'),('dandalo','단달로','적 · 보스'),('ratKnight','쥐 기사','적 · 보스'),('rats','쥐 (작은 · 보통 · 큰)','적 · 보스'),
 ('goblinArcher','고블린 궁수','적 · 보스'),('enemyGoblin','일반 고블린','적 · 보스'),('slime','슬라임녀','적 · 보스'),('cultist','광신도','적 · 보스'),
 ('blocker','막아서는 자','적 · 보스'),('mech','기체 A · B','적 · 보스'),
 ('cs','청승 (도깨비 자매)','역할 미정'),('jakyak','작약 (도깨비 자매)','역할 미정'),('bogwang','보광','역할 미정'),('borama','보라마','역할 미정'),('kwangnyang','광냥','역할 미정'),
 ('sealed','봉인된 그녀','역할 미정'),('knightcommander','기사단장','역할 미정'),('nursechief','간호사장','역할 미정'),('gaius','가이우스','역할 미정'),
 ('hiddenkkaebi','히든깨비','역할 미정'),('girlprisoner','소녀와 죄수','역할 미정'),('leonas','레오나스','역할 미정'),('hyal','고대천사 햘','역할 미정'),('coraldeer','고대사슴 산호','역할 미정'),
]
NAME = {k:(n,r) for k,n,r in CH}; ORDER = [k for k,_,_ in CH]
NID = {'008':'odile','010':'kwangnyang','011':'kwangnyang','012':'kwangnyang','028':'bogwang','029':'bogwang','030':'bogwang','031':'bogwang',
       '032':'borama','033':'borama','039':'cs','052':'cs','053':'cs'}
RULES = [(r'^O-player-','player'),(r'rebecca','rebecca'),(r'karius','karius'),(r'^O-goblin-shape','goblin'),(r'morningstar|^F-ms-','morningstar'),
 (r'poren','poren'),(r'norman','norman'),(r'tomoe','tomoe'),(r'^O-yellow','yellow'),(r'goodwill','goodwill'),
 (r'dolsoe','dolsoe'),(r'piel','piel'),(r'-odo-','odo'),(r'moro','moro'),(r'-gur-','gur'),(r'tehera','tehera'),(r'heron','heron'),
 (r'nursechief','nursechief'),(r'nurse','nurse'),(r'gothic|^P-bk-','gothic'),(r'^P-yellow','npcyellow'),(r'ycat','ycat'),(r'mari-','mari'),(r'wakin','wakin'),
 (r'arian','arian'),(r'general','general'),(r'kal','kal'),(r'odile','odile'),(r'rosina','rosina'),(r'umbrella','umbrella'),(r'drawer','drawer'),
 (r'horsehead','horsehead'),(r'deadhero','deadhero'),(r'slave','slave'),(r'silhouette','silhouette'),(r'jeokroe','jeokroe'),(r'cesar','cesar'),
 (r'agnes','agnes'),(r'hargen','hargen'),(r'miller','miller'),(r'faded','faded'),(r'fingerHole','fingerHole'),(r'^P-mask','mask'),
 (r'swordsman','swordsman'),(r'spearman','spearman'),(r'shieldman','shieldman'),(r'brute','brute'),(r'archer','archer'),(r'benkin','benkin'),(r'dandalo','dandalo'),
 (r'ratKnight','ratKnight'),(r'-rat[SML]-','rats'),(r'goblinArcher','goblinArcher'),(r'enemyGoblin','enemyGoblin'),(r'slime','slime'),(r'cultist','cultist'),
 (r'blocker','blocker'),(r'mech','mech'),(r'^P-cs-|cheongseung','cs'),(r'jakyak','jakyak'),(r'bogwang','bogwang'),(r'borama','borama'),
 (r'sealed','sealed'),(r'knightcommander','knightcommander'),(r'gaius','gaius'),(r'hiddenkkaebi','hiddenkkaebi'),(r'girlprisoner','girlprisoner'),
 (r'leonas','leonas'),(r'hyal','hyal'),(r'coral','coraldeer')]
def who(e):
    m = re.match(r'^(?:F-)?N-(\d+)', e['id'])
    if m: return NID.get(m.group(1))
    for pat,k in RULES:
        if re.search(pat, e['id']): return k
    return None
people = [e for e in cat if e['cat'] in ('char','old2d','face')]
rest = [e for e in cat if e['cat'] not in ('char','old2d','face')]
missing = []
for e in people:
    e['_who'] = who(e)
    e['_portrait'] = e['cat'] == 'face' or e['id'].startswith('F-') or e['id'].endswith('-face')
    if e['_who'] is None and not re.match(r'^(F-)?N-', e['id']): missing.append(e['id'])
assert not missing, missing
def method(k):
    if k == 'karius': return '2D 몸 · 로직 그대로'
    es = [e for e in people if e['_who'] == k and not e['_portrait']]
    if any(re.search(r'\d+장', e['name']) for e in es): return '동작 그림' + (' (도형 그림은 새 그림으로 대체)' if k == 'rebecca' else '')
    return '원화 + 연출'
out = []
for r in ROLES[:4]:
    for k in ORDER:
        if NAME[k][1] != r: continue
        for e in people:
            if e['_who'] == k and e['_portrait']: e['sub'] = '초상화 · ' + r; out.append(e)
for e in people:
    if e['_who'] is None and e['_portrait']: e['sub'] = '초상화 · 미등장 NPC'; out.append(e)
for r in ROLES[:4]:
    for k in ORDER:
        if NAME[k][1] != r: continue
        for e in people:
            if e['_who'] == k and not e['_portrait']: e['sub'] = f'{NAME[k][0]} · {r} · {method(k)}'; out.append(e)
for kind in ('적','일반'):
    for e in people:
        if e['_who'] is None and not e['_portrait'] and re.search(r'미등장 NPC · '+kind+r'( ·|$)', e['sub']): e['sub'] = f'미등장 NPC · {kind} · 원화 + 연출'; out.append(e)
miss=[e["id"] for e in people if e not in out]; assert not miss, miss[:10]
for e in out:
    if e['id'] == 'O-rebecca-shape': e['note'] = (e['note'] + ' · ' if e['note'] else '') + '새 그림 (대기 · 걷기 · 뛰기)으로 대체'
    if e['id'] == 'O-karius-shape': e['note'] = (e['note'] + ' · ' if e['note'] else '') + '몸 · 로직은 2D판 그대로 씀'
    e['cat'] = 'char'; e.pop('_who'); e.pop('_portrait')
cat = rest + out
head = re.sub(r'catalog\.js v[\d.]+', 'catalog.js v1.30', head, 1)
open(P,'w').write(head + 'const CATALOG = [\n' + ",\n".join(json.dumps(o, ensure_ascii=False, indent=0) for o in cat) + "\n];\n")
subs = []
for e in out:
    if e['sub'] not in subs: subs.append(e['sub'])
print(len(cat), len(out), len(subs)); print('\n'.join(subs[:12])); print('...'); print('\n'.join(subs[-8:]))
