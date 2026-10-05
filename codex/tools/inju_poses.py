# inju_poses.py v1.2 — (v1.2: 던진 뒤 그림, 돌 던지기 (던지기 전) 그림은 이제 안 씀)
# v1.1 — (v1.1: 어퍼컷 · 드롭킥 1 · 2 · 3 · 붕권, 슬라이딩 쓰는 곳 고침)
# v1.0 — 3D판 인주 동작 그림 (cave-3d/art/inju, 임시 그림)을 도감 인물 칸 '인주 · 동료 · 동작 그림'에 넣음
#  · 그림: cave-3d/art/inju/<키>.webp → codex/img/inju/<키>.webp (높이 300으로 줄임, pack.py가 묶음)
#  · 항목: id O-inju-<키>, 이름 '인주 · <동작>', game = 게임에서 쓰는 곳 (키 · 상황), on = 3D에 들어감
#  · 이미 있으면 이름 · 쓰는 곳만 고침 (체크 · 메모는 id에 붙어 있어 그대로). O-player-hurt 바로 뒤에 순서대로 둠
# 실행: python3 codex/tools/inju_poses.py  (그다음 python3 codex/tools/pack.py)
import os, json
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); ART = os.path.join(os.path.dirname(ROOT), 'cave-3d', 'art', 'inju')
OUT = os.path.join(ROOT, 'img', 'inju'); H = 300
# 키 (파일 이름) · 동작 이름 · 게임에서 쓰는 곳 — 무리별 순서 (움직임 → 막기 · 피하기 → 맨손 → 레슬링 → 무기 · 던지기 → 쓰러짐)
POSES = [
    ('hop', '뛰어오름', 'Space 점프의 뛰어오르는 순간'), ('jump', '점프', 'Space 점프 (공중)'),
    ('roll', '구르기', 'Q 구르기 앞 반 (몸을 맒)'), ('rollUp', '구르기 뒤 · 드롭킥 착지', 'Q 구르기 뒤 반 · 드롭킥 뒤 등으로 떨어짐'),
    ('carry', '짐 들기', '굴에서 짐 (가구 · 낙하물 · 돼지)을 들고 다닐 때'), ('raise', '손 들기', '동료 지시 (1 2 3) · 소모품 · 마력 폭발'),
    ('squat', '쪼그려 앉기', 'E 줍기 · 뒤지기 · 파기 · 상자'), ('sit', '앉아 쉬기', '모닥불에서 쉬기 · 굴에서 6초 넘게 가만히'), ('sleep', '잠', '밤에 잠자리에 들 때'),
    ('duck', '숙여 회피', 'G 숙이기 (높은 공격이 머리 위로 지나감)'), ('block', '팔 엇걸기 막기', '무기를 든 채 F 막기'), ('mtGuard', '무에타이 가드', '맨손 F 막기 (무릎 들고 머리 감쌈)'),
    ('mtPose', '무에타이 자세', '맨손으로 싸우며 서 있을 때'), ('box', '복싱 스텝', '맨손으로 싸우며 움직일 때 · 잽 · 주먹 예고'),
    ('jab', '잽', '맨손 J 1타 · 클린치 J'), ('punch', '주먹', '맨손 J 2타 · 클린치 J'), ('kickPrep', '앞차기 앞 프레임', '맨손 J 3타 예고 (무릎 듦)'), ('kick', '앞차기', '맨손 J 3타'),
    ('spin', '회전', '맨손 J 4타 예고 (몸을 돌림)'), ('highKick', '하이킥', '맨손 J 4타 (회전 하이킥)'),
    ('knee', '니킥 (무릎 당김)', '클린치 J · 날아 무릎 시작'), ('flyKnee', '플라잉 니킥', '점프 중 J'),
    ('sweep', '다리후리기', 'G 숙인 채 J (넘어뜨림)'), ('slide', '슬라이딩', 'Shift+G'), ('stomp', '발목 부수기', '넘어진 적에게 J'),
    ('uppercut', '어퍼컷', '숙여 피한 뒤 1.2초 안에 맨손 J (반격, 확정 치명)'), ('dk1', '드롭킥 1 (뛰어오름)', '달리며 점프 중 J — 처음'), ('dk2', '드롭킥 2 (중간)', '드롭킥 — 가운데'), ('dk3', '드롭킥 3 (마지막)', '드롭킥 — 착지 전까지'),
    ('bungkwon', '붕권', '아직 안 씀 (나중에 스킬로)'),
    ('crouch', '잡기 준비', 'V 잡기 · T 태클 예고 · 클린치 동작 예고'), ('dash', '레슬링 돌격', 'T 태클 돌진'), ('shoulder', '어깨빵', '태클이 부딪히는 순간'),
    ('clinch1', '클린치', '붙잡고 있을 때'), ('guard', '레슬링 가드', '클린치에 잡혔을 때 버팀'), ('clinchPush', '두 손 밀기', '클린치 Q 밀쳐내기'),
    ('pound', '파운딩', '그라운드 J 파운딩 · K 끝내기'), ('groundGuard', '그라운드 가드', '그라운드에 깔렸을 때'), ('curl', '웅크림', '쓰러졌을 때 · 깔려 맞는 순간'),
    ('throw', '던지기 전 (돌을 쥠)', '지금은 안 씀 — 던지는 순간은 던진 뒤 그림으로 바뀜'), ('throwRel', '던진 뒤', '투창 · 돌 · 수류탄을 놓는 순간 (손끝으로 목표를 가리킴)'), ('throwHard', '강한 투창', '투창을 끝까지 당길 때'), ('rifle', '소총 사격', '레버액션 · 돌격소총 · 산탄총 · 석궁'), ('pistol', '권총 사격', '권총'),
    ('dead', '쓰러져 죽음', '원정 전멸 · 석문 앞 싸움에서 짐'),
]
os.makedirs(OUT, exist_ok=True)
for k, _, _ in POSES:
    im = Image.open(os.path.join(ART, k + '.webp')).convert('RGBA')
    im = im.resize((max(1, round(im.width * H / im.height)), H), Image.LANCZOS)
    im.save(os.path.join(OUT, k + '.webp'), 'WEBP', quality=88, method=6)
P = os.path.join(ROOT, 'catalog.js'); s = open(P).read(); key = 'const CATALOG = '
head = s[:s.index(key) + len(key)]; cat = json.loads(s[len(head):].strip().rstrip(';'))
old = {e['id']: e for e in cat if e['id'].startswith('O-inju-')}
cat = [e for e in cat if not e['id'].startswith('O-inju-')]
new = []
for k, name, use in POSES:
    e = old.get('O-inju-' + k, {})
    e.update({'id': 'O-inju-' + k, 'cat': 'char', 'sub': '인주 · 동료 · 동작 그림', 'cid': 'C-001', 'name': f'인주 · {name}', 'src': f'img/inju/{k}.webp',
              'note': '3D판 동작 그림 (임시 · 제미나이로 만든 것, cave-3d/art/inju)', 'rank': '', 'on': True, 'g': 'player', 'game': f'게임: {use}'})
    new.append(e)
at = max(i for i, e in enumerate(cat) if e['id'].startswith('O-player-') and e['cat'] == 'char') + 1
cat[at:at] = new
head = head.replace('/* catalog.js v1.76 —', '/* catalog.js v1.77 — v1.77: 3D판 인주 동작 그림 (O-inju-*, tools/inju_poses.py).', 1)
open(P, 'w').write(head + json.dumps(cat, ensure_ascii=False, indent=0) + ';\n')
print(len(new), 'poses,', len(cat), 'entries')
