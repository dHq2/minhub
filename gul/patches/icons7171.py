# v7.17.1 특성 · 기술 아이콘 묶음 — icons7171.py v1.4 (v1.4: 근력 (중압 견디기 — v7.24.2) · v1.3: 딸기 역장 · 뿌리 벽 · 열매 맺기 · v1.2: 고유 기술 다섯 (공중제비 · 머리 찍기 · 영거리 사격 · 철퇴 후리기 · 휘둘러 치기) — 뒤에 붙여 앞 칸은 그대로 · v1.1: 속력 = 바람 타는 도약 · 머리 넷 = 근성 · 도감 아이콘 → build/icons.webp 한 장 · 칸 48px · 8열)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
import json
from PIL import Image
# 전투판 이름 → 도감 아이콘 이름 (index.json battle 대응 + 새로 고른 것)
MAP = [
  ('돌격', '낮은 자세 돌진'), ('돌진', '어깨 들이받기'), ('방패 돌진', '방패 밀치기'), ('도약', '힘찬 도약'), ('투창', '창 내리꽂기'),
  ('팜 버스트', '충격파 밀쳐내기'), ('응급처치', '붕대 감기'), ('약', '물약 건네주기'), ('막기', '방어'),
  ('은신', '연막 속 탈출'), ('야시', '꿰뚫어 보기'), ('후각', '발자국 추적'), ('사격', '사격'), ('회피', '회피'), ('급소', '과녁 꿰뚫기'),
  ('괴력', '벽 부수기 주먹'), ('지휘', '단결의 주먹'), ('의학', '치료'), ('속력', '바람 타는 도약'), ('발화', '손끝 점화'),
  ('재생', '치유의 손길'), ('불사', '해골 손 소환'), ('베테랑', '칼날 갈기'), ('영웅', '빛의 검 소환'), ('갑피', '십자 팔 막기'), ('거구', '보랏빛 거인 주먹'),
  ('방패', '방어'), ('방어 자세', '푸른 방패 막기'), ('무구로 막기', '칼날 막아서기'), ('팔 방패', '방패 밀치기'), ('반사신경', '손바닥 쳐내기'),
  ('실명', '시야 가리기'), ('망자', '불침번 교대'), ('개조된 신체', '개조된 신체'), ('머리 넷', '근성'), ('스텝', '잔상 회피'), ('기습', '측면 기습'),
  ('공중제비', '앞구르기'), ('머리 찍기', '망치 내려찍기'), ('영거리 사격', '산탄총 펌프 장전'), ('철퇴 후리기', '사슬 끌어당기기'), ('휘둘러 치기', '대지 폭발 내려찍기'),
  ('역장', '수호 보호막'), ('뿌리 벽', '뿌리 속박'), ('열매 맺기', '식량 나누기'), ('근력', '중압 견디기'),
]
idx = json.load(open(D + 'dogam_assets/icons/index.json', encoding='utf-8'))['icons']
names = []
for _, nm in MAP:
    assert nm in idx, nm
    if nm not in names: names.append(nm)
C, P = 8, 48
R = (len(names) + C - 1) // C
sheet = Image.new('RGB', (C * P, R * P), (20, 18, 16))
for i, nm in enumerate(names):
    im = Image.open(D + 'dogam_assets/icons/' + idx[nm]['file']).convert('RGB')
    w, h = im.size; k = P / max(w, h); im = im.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)
    cell = Image.new('RGB', (P, P), (20, 18, 16)); cell.paste(im, ((P - im.size[0]) // 2, (P - im.size[1]) // 2))
    sheet.paste(cell, ((i % C) * P, (i // C) * P))
sheet.save(D + 'build/icons.webp', 'WEBP', quality=82, method=6)
out = {'cols': C, 'rows': R, 'names': names, 'map': {a: names.index(b) for a, b in MAP}}
json.dump(out, open(D + 'icons_idx.json', 'w', encoding='utf-8'), ensure_ascii=False)
import os; print(len(names), 'icons', R, 'rows', os.path.getsize(D + 'build/icons.webp'), 'bytes')
