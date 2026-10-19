# cg8.py v1.0 — 드라이브 5기 그림 → 대화 장면 그림 (build/art/room/s_<이름>.webp · 긴 변 1500 이하) — run8_i.js 의 장면들이 씀
import os
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)) + '/../'
J = {'firewood': 'S 장작방, 말없이 장작에 뭘 넣는 수녀와 악마', 'lonely': 'S고독방', 'redgirl': 'S붉은 소녀 스테이지', 'chicken': 'S치킨룸 (2)', 'chickenp': '치킨룸의 치킨 초상 (잘라냄)',
     'beach': 'S해변', 'planet': 'SM행성 공용', 'space': 'S행성뒷배경-우주,공용우주', 'mouth': 'S지껄이는 입 타일 늘여서 좀 걷게 하기, 배경은 그냥 우주 쓰기',
     'spiral0': '지식의 나선 로딩', 'spiral1': '지식의 나선 아래로 향하는길', 'spiral2': 'S지식의나선 하층+사무실', 'spiral3': 'S 지식의 나선 마지막 구간(DVD룸~ 마지막 길)', 'spiral4': 'S지식의 나선 맨 아래', 'dvdking': '지식의 나선 DVD방 주인', 'clerk': '지식의 나선 직원',
     'dandal1': 'S단달로처택 입구', 'dandal2': 'S단달로 저택 복도', 'dandal3': 'S단달로저택 메인 룸', 'dandal4': 'S단달로 저택 휴게실,로지나방',
     'tent': 'S의료텐트-파비', 'clinic': '진료소 안', 'odileh': 'S이스터에그-신성오딜방', 'reeds': 'S갈대밭, 요괴NPC, 낮은확률로 모란등장 ', 'ruina': 'S유적A', 'lake': 'S 호수, 친칠라 등장',
     'ancient': 'S고대폐허,펄맵으로도씀', 'lakeruin': 'M호수유적 - 잡몹없이 보스등장 ', 'deep2': 'M심해신성계', 'sea': 'M망망대해', 'hargen0': '하르겐 가는길', 'hargen1': 'M하르겐1',
     'theron0': 'M테이론-첫 조우, 전투전 아름다운 뒷배경', 'theronw': '20FM 테이론 - 가로 연출맵', 'magcut': 'M마젠타도시 컷씬', 'magbat': 'image(20261018-171854) (1)', 'rozelbg': '19F 로젤 뒷배경', 'rozelld': '19F 로젤 로딩컷신',
     'dark': '어둠 속 중앙의 빛', 'calderap': 'M과거의 칼데라, 활률적으로 등장하며, 히든보스 등장', 'zero2': 'M0층 공략후', 'gamyu': '해양유적 보스 - 거대 해양괴수 가뮤, 하체가 거대한 수룡임. 상반신도 큼', 'sardil2': '사르딜 락 적대',
     'bluebk': '블루블랙 도시 전투단 5인', 'cyberas': '세 명의 사이버 암살자와 젤리 보스 (1)', 'yokai3': 'M요괴맵(일본)3', 'abyss5': 'S마계2'}
os.makedirs(D + 'build/art/room', exist_ok=True)
for k, t in J.items():
    src = D + 'd5/raw/' + t + '.png'
    if not os.path.exists(src): print('없음', k, t); continue
    im = Image.open(src).convert('RGB'); s = 1500 / max(im.size)
    if s < 1: im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    im.save(D + f'build/art/room/s_{k}.webp', 'WEBP', quality=80, method=6)
print('cg8', len(J))
