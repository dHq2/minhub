# v8.7.9 페이지 — page8790.py v1.2 (v1.2: 특성 검사도 noId (적 각펄 — 동료 펄의 정체성을 받지 않음) 를 따름 — 정체성 특성이 빠졌다는 모순을 띄우던 것 · v1.1: 도감 C-215 맞춤 — 동료 펄 = 신나펄 (투창은 평범 · 신나는 공중 투창 · 신나는 포탄 · 신나는 횡베기 · 꼬깃꼬깃 착지 = 신나는 처형 · 철 깃털 · 돌려차기 · 움츠리기 — 기술 칸 1 신나는 공중 투창 · 2 신나는 포탄) · 각펄 보스사양 글 (시작 횡베기 · 둘러싸면 횡베기를 마구 · 연속 찌르기 · 창비 · 거대 특수창 2초 뒤) · 동료 각 몸의 받는 피해 × 0.33 · 피가 멎음 거둠 (각펄 성능 그대로 — 적 각펄과 같은 몸) · 떨어지는 창 그림 (각펄은 곧게 · 신나펄은 비스듬히 · 아군 창비는 푸르게) · v1.0: 펄 · 각펄 (명세 E · 도감 C-215 인공타천사 펄 · 3D 기술표 pearl · pearlgak) —
#   고대 폐허의 만남 (S 칸 x:pearl): 우왓 깜짝이얏! · 그냥 지나가면 끝 · 같이 가자고 하면 귀엽게 → 이야기를 이어 갈수록 죄를 하나씩 (이 여정의 기록 · 메타) → 눈치채 보면 각펄 (음영 · 무거운 분위기) ·
#   밍기적거리거나 더 말을 걸면 10 … 0 초읽기 · 떠나지 않으면 펄이 천천히 걸어오고 싸움 (물러날 길 없음 · 지면 무조건 전멸 — 모래시계도 듣지 않음) · 이기면 무릎을 꿇음 → 데려간다 (영입) · 숨을 끊는다 (펄의 창) ·
#   동료 펄 (설계 · 도감 정체성 · 뽑기에 없음 · 기술 칸 1 철 깃털 · 2 꼬깃꼬깃 착지) · 각펄 (적 설계 · 13 기술) · 고유 · 특성 · 기술 글 · 아이콘 판 8 × 12 (80 ~ 95 — ico879/mkico_e.py) ·
#   기록 · 서술 · 동작 이름 · 그림 (내려앉을 원 · 날아간 창 · 각펄의 기운 · 움츠린 날개) · 대화의 음영 줄 · 초읽기 · 머뭇거림 ·
#   함께 고친 것: 옥상에서 ◆요정 날개 (테헤라) 도 떨어지지 않음 · 만남 목록에 x: 만남 이름 (전엔 키 그대로) · 기록의 기술표 그림 (펄 · 각펄은 깃털))
import subprocess, shutil, os
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8780d.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.7.8 (2026-10-23)', '<!-- 굴의 전투판 v8.7.9 (2026-10-23)')
rep('     v8.7.8: ', '''     v8.7.9: 펄 · 각펄 (명세 E · 도감 C-215 인공타천사 펄 · 3D 기술표 pearl · pearlgak):
         고대 폐허의 만남 (4 ~ 16층 · S 칸): 혼자 리듬 타며 창으로 노는 펄 — "우왓 깜짝이얏!" · 그냥 지나가면 끝 · 같이 가자고 하면 처음엔 매우 귀엽게 ·
         이야기를 이어 갈수록 우리와 동료들의 죄를 하나씩 (이 여정의 기록 — 쓰러뜨린 수 · 두고 온 이름 · 떠나보낸 동료 · 베어 버린 항복자 · 주운 것 · 화면 밖의 손가락) ·
         눈치채 보면 각펄 (음영 · 무거운 분위기): "인간아, 오만하게 살아왔구나. 네 여행을 떠나렴." — 밍기적거리거나 더 말을 걸면 10 … 0 초읽기 ·
         떠나지 않으면 펄이 천천히 걸어오고 싸움 (출구도 들어온 자리도 닫힘 · 지면 무조건 전멸 — 모래시계도 듣지 않음).
         각펄 (3D pearlgak 13 기술 + 명세 E): 천천히 걸어 다니다 — 찍고 빼기 · 정면 투창 · 도약 찍기 · 스텝 찌르기 · 3연속 베기 · 솟는 거대 창 · 공중 투창 (창비) ·
         반경 10m 횡베기 (2번 · 2페이즈 3번) · 정면 처형 · 창 대포 (뽑을 때 돌림) · 2페이즈 날아 투창 · 초대형 치명타 · 처형 내리꽂기 — 기술을 끝까지 다 씀 · ◆끝까지 (쓰러질 일격을 한 번 버팀).
         도감 보스사양: 시작 패턴은 아주 넓은 횡베기 (그 전엔 다른 기술 없이 천천히 다가옴) · 둘러싸이면 횡베기를 마구 · 찌르기는 연속 찌르기 · 창비 · 거대 특수창은 2초쯤 뒤 떨어짐.
         이기면 펄이 무릎을 꿇음 — 데려간다 (영입) · 숨을 끊는다 (펄의 창 — 두 손 긴 창 · 정면 투창 (열화)).
         동료 펄 (2성 · 뽑기에 없음) = 신나펄 (명세: 열화판 일반 펄 · 특수창 없음 · 발랄 / 도감): 투창은 평범 · 신나는 공중 투창 (일반 창 셋이 비스듬히) · 신나는 포탄 (기술 칸 1 · 2) ·
         신나는 횡베기 · 꼬깃꼬깃 착지 (신나는 처형) · 철 깃털 · 돌려차기 · 움츠리기 (스스로도) ·
         빈사 (15%) 에선 카리우스 [불경자] 처럼 [각펄] — 각펄 성능 그대로 (각펄 기술표 · 공격 × 1.8 · 걸음 × 1.25 · ◆끝까지 한 번) · 50% 를 넘으면 돌아옴 · ◆타천 날개 (떨어져도 다치지 않음).
         함께 고친 것: 대화의 음영 줄 · 초읽기 · 머뭇거림 · 옥상에서 ◆요정 날개 (테헤라) 도 떨어지지 않음 · 만남 목록의 이름 (x: 만남 21) · 아이콘 판 8 × 12 (80 ~ 95).
     v8.7.8: ''')
for a, b in (('h1::after{content:" v8.7.8"', 'h1::after{content:" v8.7.9"'), ('<footer>굴의 전투판 v8.7.8', '<footer>굴의 전투판 v8.7.9'), ('return `굴의 전투판 v8.7.8 · ${title}', 'return `굴의 전투판 v8.7.9 · ${title}'),
             ("copyText('굴의 전투판 v8.7.8 자동 판 기록", "copyText('굴의 전투판 v8.7.9 자동 판 기록"), ("o.push(`굴의 전투판 v8.7.8 — ${C.run", "o.push(`굴의 전투판 v8.7.9 — ${C.run"),
             ('의 버전 기록에 — v8.7.8 굿윌 · 포렌 (쥐 군단) · 어퐁 · 카리우스 · 물레 · 콜라이더 · 테헤라 · 감전 한 틀 / v8.7.7', '의 버전 기록에 — v8.7.9 펄 · 각펄 (고대 폐허의 만남) / v8.7.8 굿윌 · 포렌 (쥐 군단) · 어퐁 · 카리우스 · 물레 · 콜라이더 · 테헤라 · 감전 한 틀 / v8.7.7'),
             ('">v8.7.8 · 굿윌 · 포렌 · 어퐁 · 카리우스 · 물레 · 콜라이더 · 테헤라 · 감전 한 틀</span>', '">v8.7.9 · 펄 · 각펄 (고대 폐허)</span>'),
             ("ver: '8.7.8', kind:", "ver: '8.7.9', kind:")):
    rep(a, b)
rep("RULES_MIG = '8.7.8',", "RULES_MIG = '8.7.9',")   # 수치표: pearl · spec.pthrow · 무기 펄의 창 새 칸

# ---------- 설계 · 도감 정체성 (명세 E · 3D 기술표) — 동료 펄은 뽑기에 없음 (noDraw — 고대 폐허의 각펄을 이기면 합류) ----------
PE_ACT = "['신나는 공중 투창', '신나는 포탄', '철 깃털', '꼬깃꼬깃 착지', '신나는 횡베기', '돌려차기', '움츠리기']"   # v1.1 신나펄 (도감) — 칸 1 · 2 = 신나는 공중 투창 · 신나는 포탄
PE_NOTE = ("인공타천사 펄 (2성 · 도감 C-215) — 아군으로 얻으면 세상 귀엽고 평범한 창병 = 신나펄 (명세 E: 평소엔 열화판 일반 펄 · 특수창 없음 · 발랄). "
           "투창은 평범 (보통 창 투창) · 신나는 공중 투창 · 신나는 포탄 · 신나는 횡베기 · 꼬깃꼬깃 착지 (신나는 처형) 에 3D 기술표의 철 깃털 · 돌려차기 · 움츠리기 를 스스로 섞어 씀. "
           "빈사 (15%) 에선 카리우스 [불경자] 처럼 각펄로 변함 (각펄 성능 그대로) — 50% 를 넘으면 돌아옴. "
           "기술 칸 1 = 신나는 공중 투창 · 2 = 신나는 포탄 (적을 탭). 고대 폐허의 각펄을 이기면 합류 (뽑기에 없음)")
PE_BASE = (f"cls: '기동', role: '공격수', weapon: '창', height: 1.58, weight: 48, ov: {{ hp: 140, atk: 30 }}, traits: ['각펄', '은신D'], unique: ['타천 날개'], race: '인공타천사', origin: '천계 (인공)', "
           f"active: {PE_ACT}, pk: 'pearl', gak: 'pearlgak', tactic: '창병 · 신나펄 (투창 · 창비 · 포탄) · 빈사에 각펄', note: '{PE_NOTE}'")
n0 = s.index("  { key: '테헤라', side: 0, ref: 'C-016'"); n1 = s.index('\n', n0) + 1
s = s[:n1] + f"  {{ key: '펄', side: 0, ref: 'C-215', name: '펄', tier: 2, {PE_BASE}, nv: true, nvG: 'B', noDraw: true }},   /* v8.7.9 펄 (명세 E · 도감 C-215 · 3D 기술표 pearl — 고대 폐허의 각펄을 이기면 합류 · 뽑기에 없음) */\n" + s[n1:]
n0 = s.index("  'C-016': { cls: '치유', role: '지원', weapon: '손짓'"); n1 = s.index('\n', n0) + 1
s = s[:n1] + f"  'C-215': {{ {PE_BASE}, allyNv: 'B' }},   // v8.7.9 펄 (도감에서 바로 놓아도 설계와 같게)\n" + s[n1:]
n0 = s.index("  'C-174': { unique: ['정령 계약'], active:"); n1 = s.index('\n', n0) + 1
s = s[:n1] + f"  'C-215': {{ traits: ['각펄'], unique: ['타천 날개'], active: {PE_ACT} }},   /* v8.7.9 펄 */\n" + s[n1:]
rep("'h2', 'quakeKill'];", "'h2', 'quakeKill', 'pk', 'gak', 'noId'];")   # v8.7.9 동료 펄 기술표 · 빈사의 각펄 · 적 각펄은 동료 정체성을 받지 않음
rep("'dcounter', 'noChg', 'rMul', 'sName']) if (pf[k] != null && u[k] == null) u[k] = clone(pf[k]);", "'dcounter', 'noChg', 'rMul', 'sName', 'pk', 'gak']) if (pf[k] != null && u[k] == null) u[k] = clone(pf[k]);")
rep("function lockIdentity(p){ const I = p && identityOf(p.ref); if (!I) return false;", "function lockIdentity(p){ const I = p && identityOf(p.ref); if (!I || p.noId) return false;   /* v8.7.9 적 각펄은 동료 펄의 정체성 (특성 · 기술) 을 받지 않음 */")

# ---------- 고유 · 특성 · 기술 글 ----------
rep("const UNIQUE = {\n", """const UNIQUE = {
  '타천 날개': { who: 'C-215',   // v8.7.9 펄 (3D 기술표 패시브)
    lore: ['인공타천사 펄 — 인카운터로도 등장하는데, 아군으로 얻으면 세상 귀엽고 평범한 창병이지만, 보스 인카운터로 나오면 초고난도.', '성급은 거의 아무 의미 없다 — 단순히 희귀하냐 아니냐일 뿐. 펄은 강하다기보단… 호러에 가깝다.', '검은 날개 · 검은 창 · 금빛 머리.'],
    effects: ['떨어져도 다치지 않음 — 옥상 끝에서 밀려나도 떨어지지 않고 내려앉음 (3D: 떨어질 때 피해 없음 · 점프 높이 +50%)', '날아오른 동안 (꼬깃꼬깃 착지 · 각펄의 도약) 바닥 공격이 닿지 않음'],
    derived: [], limits: [], flags: {} },
  '끝까지': { who: 'C-215',   // v8.7.9 각펄 (3D pearlgak 패시브)
    lore: ['각펄 — 보스 인카운터로 나온 펄. 도약하며 뛰어다니는 투창 극딜러. 호러에 가까운 연출.', '"인간아, 오만하게 살아왔구나. 네 여행을 떠나렴." 그녀는 나직이 말했다.'],
    effects: ['쓰러질 일격을 한 번 체력 1 로 버팀 (판에 한 번 · 출혈 · 화상 같은 지속 피해는 빼고 — 3D 그대로)', '기술을 끝까지 다 씀: 쓸 수 있는 기술 가운데 가장 오래 안 쓴 것부터 (13 기술을 돌려 씀)', '시작 패턴은 아주 넓은 횡베기 (도감 — 그 전엔 다른 기술 없이 다가옴) · 둘레 6칸에 둘 이상이면 횡베기를 마구 (도감 — 연속으로 마구 씀)', '찌르기는 연속 찌르기 (도감 — 세 번 찌름 · 마지막만 밀침)', '천천히 걸어 다님 (걸음 × 0.55) — 빠른 것은 도약 · 돌진 · 투창', '50% 아래 2페이즈: 공격 × 1.15 · 걸음 × 1.15 · 날아 투창 · 초대형 치명타 · 처형 내리꽂기 · 횡베기 셋째'],
    derived: [], limits: [], flags: {} },
""")
rep("const TRAITS = {\n", """const TRAITS = {
  '각펄': '빈사의 펄 (명세 E — 카리우스 [불경자] 처럼): 체력 15% 아래 · 또는 숨이 끊길 일격 (싸움마다 한 번 체력 1 로 남음) 에 각펄로 변함 — 각펄 성능 그대로 (각펄 기술표 13 기술 · 연속 찌르기 · 시작은 횡베기 · 공격 × 1.8 · 걸음 × 1.25 · ◆끝까지 한 번 — 적 각펄과 같은 몸) · 50% 를 넘으면 돌아옴 (헤헤… 어라? 나 뭐 했어?)',   /* v8.7.9 */
""")
rep("const ACTIVE = {\n", """const ACTIVE = {
  '신나는 공중 투창': '신나펄 (도감 — 공중 투창은 일반 창이 비스듬히 꽂힘) — 3 ~ 12칸의 상대 쪽으로 일반 창 셋을 던져 올림: 1.2초 뒤 표적 자리 하나 + 둘레 2.2칸에 비스듬히 꽂힘 (반지름 1.1 · 공격 × 0.6 씩 · 원 밖으로 피하면 됨). 특수창 없음. 대기 10초. 명령: 기술 칸 1 → 적을 탭',   /* v8.7.9 펄 (신나펄) · 각펄 */
  '신나는 포탄': '신나펄 (도감 — 포탄 기술도 신나게 날아감) — 2.5 ~ 8칸의 상대 쪽으로 몸째 날아가 줄 위를 꿰뚫음 (예고 0.35초 · 폭 1칸 · × 1.2 · 줄 끝까지 날아감). 각펄의 처형처럼 뒤로 빠지지도 · 넘어뜨리지도 · 치명을 노리지도 않음. 대기 9초. 명령: 기술 칸 2 → 적을 탭',
  '신나는 횡베기': '신나펄 (도감 — 횡베기는 있지만 느와르 같은 분위기는 없음) — 둘레 3칸을 한 바퀴 신나게 벰 (예고 0.45초 · × 1.0). 각펄의 반경 10m 횡베기의 열화. 대기 8초',
  '철 깃털': '펄 (3D 기술표 — 철 특수기) — 강철 깃털 다섯을 부채꼴로 쏨 (2 ~ 8칸 · 공격 × 0.6 씩 · 출혈). 대기 6초 · 스스로 씀',
  '꼬깃꼬깃 착지': '펄 (3D 기술표 · 도감 — 처형도 그냥 신나는 모션: 신나펄의 처형) — 날아올랐다 2 ~ 5칸 안의 상대 위로 내려찍음: 둘레 2칸 (한 번 × 0.6 + 내려찍음 × 1.3 · 밀침 · 0.5초 휘청). 날아오른 동안 바닥 공격이 닿지 않음 · 내려앉을 원을 본 상대는 비킴. 대기 8초 · 스스로 씀',
  '돌려차기': '펄 (3D) — 몸을 돌려 앞 1.9칸 부채꼴을 걷어참 (× 1.0 · 크게 밀어냄). 대기 6초',
  '움츠리기': '펄 (3D 기술표) — 날개로 몸을 감싸 2초 받는 피해 60% 감소 (그동안 움직이지 못함). 나를 노린 큰 일격이 곧 올 때 · 위급할 때 둘 넘게 붙으면. 대기 10초',
  '정면 투창 (열화)': '펄의 창 (무기 기술 — 각혈의 장검처럼 열화) — 3 ~ 12칸의 보이는 상대에게 창을 정면으로 던짐 (예고 0.45초 · 줄 12칸 · 관통 · 공격 × 3.0 × 0.6 · 밀침 · 방패에 박히면 멈춤 · 창은 손에 남음). 대기 8초',
  '찍고 빼기': '각펄 (3D) — 앞 2.6칸 줄을 찍고 뺌 (예고 0.25초 · × 1.3). 대기 3초',
  '정면 투창': '각펄 (3D · 명세 직사 투척) — 2 ~ 15칸 줄로 창을 던짐 (예고 0.45초 · 던지는 순간 조금 고쳐 겨눔 · 관통 · × 3.0 · 크게 밀어냄 · 방패에 박히면 멈춤). 펄의 창을 든 이는 열화판. 대기 4초',
  '도약 찍기': '각펄 (3D) — 3 ~ 8칸의 상대 위로 뛰어올라 (예고 0.5초 · 날아오른 동안 바닥 공격이 닿지 않음) 내려찍음 — 둘레 1.8칸 × 1.0 + × 2.2 · 밀침 · 휘청. 내려앉을 원을 본 상대는 비킴. 대기 4초',
  '스텝 찌르기': '각펄 (3D) — 4.5칸을 순식간에 찌르며 지나감 (예고 0.25초 · × 1.4). 대기 6초',
  '3연속 베기': '각펄 (3D · 명세 휘두르고 찌르기) — 2.6 ~ 2.8칸 부채꼴 셋 (× 0.8 · 0.8 · 1.1). 대기 9초',
  '솟는 거대 창': '각펄 (3D · 명세 거대한 특수창) — 상대 발밑에서 1.1초 뒤 거대한 창이 솟음 (반지름 1.8 · × 1.6 · 1.2초 기절 · 꿰뚫림 — 원 밖으로 피하면 됨). 대기 10초',
  '공중 투창 (창비)': '각펄 (3D · 명세 곡사 투척 · 특수창 운석 · 도감 — 2초쯤 뒤 하늘에서 창이 쏟아짐) — 창 열이 0.08초 간격으로 쏟아짐 (표적 자리 하나 + 둘레 4칸 · 반지름 1.3 · × 0.6 씩 · 2초 뒤 · 원 밖으로 피하면 됨). 대기 11초',
  '반경 10m 횡베기': '각펄 (3D · 명세 매우 넓은 원형 2번 · 3번 · 도감 — 이게 시작 패턴 · 연속으로 마구) — 반지름 6칸을 크게 돌려 벰 (예고 0.9초 · × 1.2) → 두 번째 (× 0.8) · 2페이즈엔 세 번째 (× 0.8). 싸움의 첫 수 · 둘레 6칸에 둘 이상이면 먼저. 대기 8초',
  '정면 처형': '각펄 (명세 — 휘두르다 멈추고 빠르게 뒤로 가서 온몸으로 처형) — 뒤로 2.5칸 → 온몸으로 투창처럼 11.5칸을 날아듦 (예고 0.3초 · × 1.8 · 치명 +35% · 넘어뜨림). 대기 10초',
  '창 대포': '각펄 (명세 — 매우 긴 사거리로 강하게 찌름 · 뽑을 때도 돌림) — 12칸 줄 찌르기 (예고 0.9초 · × 2.2 · 밀침) → 뽑으며 둘레 2.2칸을 돌림 (× 0.6 · 밀어냄). 대기 12초',
  '날아 투창': '각펄 2페이즈 (명세 — 공중에서 방벽을 무시하고 투척) — 날아올라 2 ~ 9칸의 상대 위로 (둘레 2.2칸 · × 0.6 + × 1.6) — 막을 수 없음 (방패 무시). 대기 12초',
  '초대형 치명타': '각펄 2페이즈 (명세 — 높이 날아올라 거대한 특수창을 지면에) — 높이 날아올라 (그동안 공중) 표적 자리에 2초 뒤 반지름 3.6 의 거대한 창 (× 2.6 — 도감: 2초쯤 뒤 하늘에서 거대한 광역 특수 창). 원 밖으로 피하면 됨. 대기 18초',
  '처형 내리꽂기': '각펄 2페이즈 (명세 — 날아올라 떨어지는 꼬치형 처형) — 뒤로 2.5칸 → 날아올라 9.5칸 안의 상대에게 내리꽂음 (둘레 2.4칸 · × 0.6 + × 2.0 · 치명 +35%). 대기 14초',
""")

# ---------- 아이콘 판 8 × 12 (80 ~ 95 — 펄 · 각펄) · 기술 칸 그림 · 겨눌 곳 글 · 제자리 기술 ----------
rep('"요정의 축복": 79,', '"요정의 축복": 79, "신나는 공중 투창": 89, "신나는 횡베기": 90, "신나는 포탄": 91, "타천 날개": 80, "끝까지": 81, "철 깃털": 82, "꼬깃꼬깃 착지": 83, "돌려차기": 84, "움츠리기": 85, "정면 투창": 86, "정면 투창 (열화)": 86, "각펄": 87, "솟는 거대 창": 88, "공중 투창 (창비)": 89, "반경 10m 횡베기": 90, "정면 처형": 91, "창 대포": 92, "날아 투창": 93, "초대형 치명타": 94, "처형 내리꽂기": 95, "찍고 빼기": 52, "도약 찍기": 35, "스텝 찌르기": 33, "3연속 베기": 39,')
rep('{"cols": 8, "rows": 10,', '{"cols": 8, "rows": 12,')
rep('background-size:calc(var(--s) * 8) calc(var(--s) * 10)', 'background-size:calc(var(--s) * 8) calc(var(--s) * 12)')
shutil.copy(D + 'ico879/icons_v879.webp', D + 'build/icons.webp')   # v1.0 아이콘 판 8 × 12 (mkico_e.py — 80 ~ 95)
rep("tdream: '💤' };", "tdream: '💤', pfeath: '🪶', pland: '🦅', pkick: '🦵', pwrap: '🛡', pthrow: '🗡', psky: '🌠', pball: '💫', pwide: '🌀' };")   # v8.7.9 펄 · 펄의 창
rep("const SPEC_TGT = { ", "const SPEC_TGT = { psky: '🌠 신나는 공중 투창: 적을 탭 (3 ~ 12칸 — 1.2초 뒤 일반 창 셋이 비스듬히)', pball: '💫 신나는 포탄: 적을 탭 (2.5 ~ 8칸 — 몸째 날아가 꿰뚫음)', pwide: '🌀 신나는 횡베기: 붙은 적을 탭 (둘레 3칸)', pfeath: '🪶 철 깃털: 적을 탭 (2 ~ 8칸 — 깃털 다섯 · 출혈)', pland: '🦅 꼬깃꼬깃 착지: 적을 탭 (2 ~ 5칸 — 날아올라 내려찍음)', pkick: '🦵 돌려차기: 붙은 적을 탭 (1.9칸 — 크게 밀어냄)', pthrow: '🗡 정면 투창 (열화): 적을 탭 (3 ~ 12칸 — 곧게 · 관통)', ")
rep("const SUP_SELF_TX = { mspirit:", "const SUP_SELF_TX = { pwrap: '움츠리기 (2초 — 받는 피해 −60% · 그동안 못 움직임)', mspirit:")

# ---------- 동작 이름 ----------
rep("  if (a.k === 'leap' && a.quake) return '도약 강타 — 날아가는 중';   // v7.22.2",
    "  if (a.k === 'leap' && a.hn) return `🦅 ${a.hn} — 날아오름 (공중 · 바닥 공격이 닿지 않음)`;   /* v8.7.9 각펄 · 펄 */\n"
    "  if (a.k === 'gakOn') return '🖤 각펄 — 눈빛이 바뀜';\n"
    "  if (a.k === 'wrap') return `🪶 움츠리기 — 날개로 감쌈 (${f2(a.left)}초 · 받는 피해 −60%)`;\n"
    "  if (a.k === 'leap' && a.quake) return '도약 강타 — 날아가는 중';   // v7.22.2")
rep("s: u.act.s || '', sup: !!u.act.sup } : null;", "s: u.act.s || '', sup: !!u.act.sup, hn: (u.act.h2L || u.act.h2up || {}).n || '' } : null;")   # v8.7.9 날아오른 기술 이름

# ---------- 기록 (글) ----------
rep("const SPIRIT_TOAST = ", "const h2Ic = (Wd, i) => ((Wd.units[i] || {}).ref === 'C-215' ? '🪶' : '🐾');   /* v8.7.9 기록의 기술표 그림 (펄 · 각펄은 깃털 — 전엔 짐승 발자국) */\nconst SPIRIT_TOAST = ")
rep("      case 'h2': out.push(`${T(e)}🐾 ${n(e.a)} — ${e.n}", "      case 'h2': out.push(`${T(e)}${h2Ic(Wd, e.a)} ${n(e.a)} — ${e.n}")
rep("      case 'h2Hit': out.push(`${T(e)}🐾 ${e.n} — ", "      case 'h2Hit': out.push(`${T(e)}${h2Ic(Wd, e.a)} ${e.n}${e.land ? ' (내려앉음)' : ''} — ")
rep("      case 'h2Rain': out.push(`${T(e)}🌑 ${e.n} — ${(e.hit || []).length ? e.hit.map(i => n(i)).join(' · ') : '빈 바닥'}`); break;",
    "      case 'h2Rain': out.push(`${T(e)}🌑 ${e.n} — ${(e.hit || []).length ? e.hit.map(i => n(i)).join(' · ') : '빈 바닥'}`); break;\n"
    "      case 'h2Jump': out.push(`${T(e)}🦅 ${n(e.a)} ${e.n} — 날아오름 (${coord(e.x, e.y)} 에 내려앉음)`); break;   // v8.7.9 각펄 · 펄\n"
    "      case 'h2Up': out.push(`${T(e)}🦅 ${n(e.a)} 높이 날아오름 — ${e.n} (그동안 공중)`); break;\n"
    "      case 'h2Twirl': out.push(`${T(e)}🌀 ${n(e.a)} ${e.n} — 뽑으며 돌림${(e.hit || []).length ? ' → ' + e.hit.map(i => n(i)).join(' · ') : ''}`); break;\n"
    "      case 'h2Last': out.push(`${T(e)}🖤 ${n(e.b)} ◆끝까지 — 쓰러질 일격을 버팀 (체력 1)`); break;\n"
    "      case 'pearlGak': { const G9 = (Wd.rules.pearl || {}).gak || {}; out.push(`${T(e)}${e.on ? '🖤 ' + n(e.a) + ' — 각펄 (공격 × ' + (G9.atk || 1.8) + ' · 걸음 × ' + (G9.spd || 1.25) + (G9.def != null && G9.def !== 1 ? ' · 받는 피해 × ' + G9.def : '') + ')' : '🪶 ' + n(e.a) + ' — 돌아옴 (체력 ' + Math.round((G9.off || 0.5) * 100) + '% 넘음)'}`); break; }\n"
    "      case 'pearlWrap': { const P9 = (Wd.rules.pearl || {}).wrap || {}; out.push(`${T(e)}🪶 ${n(e.a)} 움츠리기 (${P9.t || 2}초 · 받는 피해 −${Math.round((1 - (P9.k || 0.4)) * 100)}%)${e.why ? ' — ' + e.why : ''}`); break; }\n"
    "      case 'spare8': out.push(`${T(e)}🪶 ${n(e.b)} — 숨이 끊길 일격 (${n(e.a)}) · 쓰러지되 숨은 붙어 있음`); break;")

# ---------- 서술 ----------
rep("    case 'h2Rain': return (e.hit || []).length ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(e.n)} ${reul(e.hit.map(i => n(i)).join(' · '))} 덮친다.` } : null;",
    "    case 'h2Rain': return (e.hit || []).length ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(e.n)} ${reul(e.hit.map(i => n(i)).join(' · '))} 덮친다.` } : null;\n"
    "    case 'h2Up': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 높이 날아오른다 — ${e.n}!` };   // v8.7.9 각펄 · 펄\n"
    "    case 'h2Twirl': return (e.hit || []).length ? { c: U(e.a).side ? 'bad' : 'good', s: `창을 뽑으며 크게 돌린다 — ${reul(e.hit.map(i => n(i)).join(' · '))} 밀어낸다.` } : null;\n"
    "    case 'h2Last': return { c: U(e.b).side ? 'bad' : 'good', s: `${ga(n(e.b))} 쓰러지지 않는다 — 끝까지.` };\n"
    "    case 'pearlGak': return e.on ? { c: U(e.a).side ? 'bad' : 'good', s: `${n(e.a)}의 목소리가 낮게 가라앉는다 — 각펄.` } : { c: 'dim', s: `${ga(n(e.a))} 고개를 갸웃한다. \"헤헤… 어라? 나 뭐 했어?\"` };\n"
    "    case 'pearlWrap': if (!(e.vis || U(e.a).side === 0)) return null; return { c: 'dim', s: `${ga(n(e.a))} 날개로 몸을 감싼다.` };\n"
    "    case 'spare8': return { c: 'good', s: `검은 날개가 꺾인다 — ${ga(n(e.b))} 무릎을 꿇는다.` };")

# ---------- 그림: 내려앉을 원 · 날아간 창 (투창 · 깃털) · 각펄의 기운 · 움츠린 날개 ----------
rep("  if (!ed && (Wd.units.some(u => u.h2) || (Wd.h2z && Wd.h2z.length))) drawH2Warn(Wd, ox, oy, ts);",
    "  if (!ed && (Wd.units.some(u => u.h2 || u.pk || u.pw) || (Wd.h2z && Wd.h2z.length))) drawH2Warn(Wd, ox, oy, ts);   /* v8.7.9 동료 펄 · 펄의 창도 예고를 그림 */")
rep("  for (const Q of Wd.h2z || []){ if (now < Q.t0) continue;",
    "  for (const u of Wd.units){ const A = u.act; if (!u.alive || !A || A.k !== 'leap' || !(A.h2L || A.h2up) || !(u.side === 0 || u.seenBy || see || litAt(Wd, A.tx, A.ty))) continue;   /* v8.7.9 내려앉을 원 (각펄 · 펄의 도약) · 높이 날아오름 */\n"
    "    const q = Math.min(1, (now - A.t0) / Math.max(0.05, A.end - A.t0)), col = u.side ? '255,70,60' : '110,190,255'; ctx.save();\n"
    "    if (A.h2L){ const R = (A.h2L.s && A.h2L.s.r) || 2, p = { x: ox + A.tx * ts, y: oy + A.ty * ts }; ctx.fillStyle = `rgba(${col},${(0.12 + 0.2 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(p.x, p.y, R * ts, 0, 6.283); ctx.fill(); ctx.fillStyle = `rgba(${col},${(0.25 + 0.3 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(p.x, p.y, R * ts * q, 0, 6.283); ctx.fill(); ctx.strokeStyle = `rgba(${col},.9)`; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.arc(p.x, p.y, R * ts, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); }\n"
    "    ctx.font = '700 12px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = u.side ? '#ffb4a8' : '#bfe0ff'; ctx.fillText(`🦅 ${(A.h2L || A.h2up).n}`, ox + u.x * ts, oy + (u.y - u.r) * ts - 10); ctx.restore(); }\n"
    "  for (const Q of Wd.h2z || []){ if (now < Q.t0) continue;")
rep("    } else if (f.k === 'h2Boom' && age < 0.45){   // 망각의 그림자가 떨어짐",
    "    } else if (f.k === 'h2Shot' && age < 0.3){   // v8.7.9 투창 · 철 깃털 — 날아간 줄 (창은 검은 자루 · 붉은 날 / 깃털은 은빛)\n"
    "      const q = age / 0.3, p = { x: ox + f.x * ts, y: oy + f.y * ts }, L0 = f.len * ts * Math.min(1, q * 2.2); ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(f.ang); ctx.globalAlpha = Math.max(0, 1 - q);\n"
    "      if (f.jav){ ctx.strokeStyle = `rgba(255,255,255,${(0.35 * (1 - q)).toFixed(2)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L0, 0); ctx.stroke(); ctx.strokeStyle = f.side ? '#2a1418' : '#e8e2d8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(Math.max(0, L0 - ts * 1.6), 0); ctx.lineTo(L0, 0); ctx.stroke(); ctx.fillStyle = f.side ? '#c83040' : '#cfe4ff'; ctx.beginPath(); ctx.moveTo(L0 + ts * 0.3, 0); ctx.lineTo(L0, -ts * 0.1); ctx.lineTo(L0, ts * 0.1); ctx.closePath(); ctx.fill(); }\n"
    "      else { ctx.strokeStyle = '#d8dee8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(Math.max(0, L0 - ts * 0.6), 0); ctx.lineTo(L0, 0); ctx.stroke(); }\n"
    "      ctx.restore();\n"
    "    } else if (f.k === 'h2Boom' && age < 0.45){   // 망각의 그림자가 떨어짐 · v8.7.9 각펄 · 펄이 내려앉음")
rep("  // 총성 '!': 쏜 자리에 noiseTime 동안 남음",
    "  // v8.7.9 각펄 (빈사의 펄 · 만남의 각펄): 검붉은 기운 · 움츠리기: 몸을 감싼 날개 (검은 고리)\n"
    "  if (!ed) for (const u of Wd.units){ if (!u.alive || hid0(u) || !(u.side === 0 || see || u.seenBy)) continue; const gk = u.gak || (u.h2 && u.h2.k === 'pearlgak'), wr = u.wrapT != null && Wd.t < u.wrapT; if (!gk && !wr) continue;\n"
    "    const p = { x: ox + u.x * ts, y: oy + u.y * ts }, t9 = performance.now() / 300; ctx.save();\n"
    "    if (gk){ const g0 = ctx.createRadialGradient(p.x, p.y, u.r * ts * 0.6, p.x, p.y, u.r * ts * 1.9); g0.addColorStop(0, 'rgba(120,10,30,0)'); g0.addColorStop(0.6, `rgba(110,10,30,${(0.28 + 0.1 * Math.sin(t9)).toFixed(2)})`); g0.addColorStop(1, 'rgba(20,0,8,0)'); ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(p.x, p.y, u.r * ts * 1.9, 0, 6.283); ctx.fill(); }\n"
    "    if (wr){ ctx.strokeStyle = 'rgba(30,24,28,.9)'; ctx.lineWidth = Math.max(3, ts * 0.12); ctx.beginPath(); ctx.arc(p.x, p.y, u.r * ts * 1.15, 0, 6.283); ctx.stroke(); ctx.strokeStyle = 'rgba(240,215,140,.8)'; ctx.lineWidth = 1.5; ctx.stroke(); }\n"
    "    ctx.restore(); }\n"
    "  // 총성 '!': 쏜 자리에 noiseTime 동안 남음")

# ---------- 대화: 음영 줄 (dark) · 초읽기 (count) · 머뭇거림 (wait) ----------
rep("function talkShow(){\n  const L = TK.lines[TK.i]; if (!L){ talkClose(); return; }\n",
    "function talkShow(){\n  const L = TK.lines[TK.i]; if (!L){ talkClose(); return; }\n  clearInterval(TK.cnt); TK.cnt = null; $('talk').classList.toggle('tk-dark', !!L.dark);   /* v8.7.9 음영 줄 (각펄) · 초읽기는 고르는 줄에서만 */\n")
rep(".join(''); return; }\n  const N = NPC[L.npc || TK.npc] || null", ".join(''); talkTimer(L); return; }\n  const N = NPC[L.npc || TK.npc] || null")
rep("function talkDone(){", r"""// v8.7.9 초읽기 (count — 보이는 10 … 0) · 머뭇거림 (wait — 고르지 않고 그만큼 지나면): 다 되면 then. 고르면 (talkClose · 다음 줄) 멈춤
function talkTimer(L){ if (L.count == null && L.wait == null) return; const ms = +window.__tkMs || 1000, el = $('tkText'), base = TK.full || '', seq = []; let n = L.count != null ? L.count : L.wait;
  const tick = () => { if (!TK || TK.lines[TK.i] !== L){ clearInterval(iv); return; }
    if (n < 0){ clearInterval(iv); TK.cnt = null; jrTalk({ who: '알림', s: L.count != null ? '초읽기 — 0' : '머뭇거림 (고르지 않음)' }); talkDo(L.then); return; }
    if (L.count != null){ seq.push(n); el.textContent = base + '\n\n' + seq.join(' … ') + (n > 0 ? ' …' : '.'); } n--; };
  const iv = setInterval(tick, ms); TK.cnt = iv; tick(); }
function talkDone(){""")
rep("function talkClose(){ if (!TK) return; clearInterval(TK.timer);", "function talkClose(){ if (!TK) return; clearInterval(TK.timer); clearInterval(TK.cnt); $('talk').classList.remove('tk-dark');")
rep(".talk.tk-boxed .tk-box p{font:700 20px/1.5 var(--display);color:#f2e6cf;letter-spacing:.04em}",
    ".talk.tk-boxed .tk-box p{font:700 20px/1.5 var(--display);color:#f2e6cf;letter-spacing:.04em}\n"
    "/* v8.7.9 음영 줄 (각펄 — 무거운 분위기) */\n"
    ".talk.tk-dark{background:linear-gradient(to top,rgba(4,1,3,.98) 0%,rgba(10,2,6,.9) 40%,rgba(16,2,8,.82) 100%)}\n"
    ".talk.tk-dark::after{content:\"\";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 38%,rgba(0,0,0,0) 28%,rgba(46,0,12,.58) 100%)}\n"
    ".talk.tk-dark .tk-pic img{filter:brightness(.5) saturate(.45) contrast(1.3) drop-shadow(0 0 22px rgba(160,0,30,.6))}\n"
    ".talk.tk-dark .tk-box{background:linear-gradient(to bottom,rgba(10,2,6,.6),rgba(10,2,6,.92) 26%,rgba(6,0,4,.97));border-top-color:rgba(150,20,40,.6)}\n"
    ".talk.tk-dark .tk-box b{color:#ffd6d6;background:linear-gradient(90deg,#3a0a12,#1a0408);border-color:#8a1a2a}\n"
    ".talk.tk-dark .tk-box p{color:#e8d2d2}")

# ---------- 대화 그림 · 이름 ----------
rep("'C-170': ['talk/fabi_t1'] });", "'C-170': ['talk/fabi_t1'], 'C-215': ['talk/pearl_t1', 'talk/pearl_t2', 'talk/pearl_t3', 'talk/pearl_t4'] });   /* v8.7.9 펄 (배경 딴 그림 넷 — pearl_art/mkpearl.py) */")
rep("mokel: 'talk/mokel_t1' };", "mokel: 'talk/mokel_t1', pearl1: 'talk/pearl_t1', pearl2: 'talk/pearl_t2', pearl3: 'talk/pearl_t3', pearl4: 'talk/pearl_t4' };")
rep("const TALK_WHO = { '세르파': 'C-277',", "const TALK_WHO = { '펄': 'C-215', '각펄': 'C-215', '세르파': 'C-277',")
os.makedirs(D + 'build/art/talk', exist_ok=True)
for i in range(1, 5): shutil.copy(D + 'pearl_art/pearl_t%d.webp' % i, D + 'build/art/talk/pearl_t%d.webp' % i)
# 만남 목록의 이름 (x: 만남 · 카드 — 전엔 키 그대로 보임)
rep("serpa: '슬라임의 왕 세르파 (수정동굴)' };", "serpa: '슬라임의 왕 세르파 (수정동굴)', 'x:firewood': '장작방 (수녀와 악마)', 'x:lonely': '고독방', 'x:redgirl': '붉은 소녀', 'x:chicken': '치킨룸', 'x:beach': '굴 속의 해변', 'x:planet': '행성 (비키)', 'x:mouth': '지껄이는 입', 'x:odileh': '신성 오딜의 방', 'x:reeds': '은빛 갈대밭', 'x:pehtoR': '유적의 페흐토', 'x:lakeruin': '호수 유적 (사르딜 락)', 'x:gamyu': '해양 유적 (가뮤)', 'x:spiral': '지식의 나선', 'x:dandal': '단달로 저택', 'x:bell': '인공천사 벨', 'x:duck': '러버덕', 'x:macaroni': '광대 마카로니', 'x:yellowd': '노란악마의 영역', 'x:tehera2': '우주의 테헤라', 'x:aitem': '수수께끼 (아템)', 'x:pearl': '고대 폐허의 펄 (각펄)', 'c:card': '도감 조우 장면 카드' };   /* v8.7.9 */")

# ---------- 각펄 (적 설계 · 정예) · 만남 ----------
rep("// 인카운터 정예 · 히든 보스\nObject.assign(ELITE8, {", """/* v8.7.9 각펄 (명세 E · 3D h2.js pearlgak 1300 · 30 · 4.4 → 보스 비 (하딤 1600 · 34 → 950 · 62): 체력 × 0.594 · 공격 × 1.82 · 걸음 × 0.864) — 펄의 창 (두 손 긴 창) · ◆끝까지 · ◆타천 날개 · 천천히 걸어 다님 (기술표 stalk 0.55) */
FOE8['각펄'] = { key: '각펄', name: '각펄', side: 1, ref: 'C-215', tier: 2, cls: '기동', role: '공격수', weapon: '펄의 창', height: 1.58, weight: 48, nv: true, nvG: 'A', h2: 'pearlgak', noId: true, ov: { hp: 780, atk: 55, spd: 3.8 }, traits: ['보스'], unique: ['끝까지', '타천 날개'],
  active: ['찍고 빼기', '정면 투창', '도약 찍기', '스텝 찌르기', '3연속 베기', '솟는 거대 창', '공중 투창 (창비)', '반경 10m 횡베기', '정면 처형', '창 대포', '날아 투창', '초대형 치명타', '처형 내리꽂기'], race: '인공타천사', origin: '천계 (인공)',
  tactic: '천천히 걸어와 아주 넓은 횡베기로 시작 — 둘러싸면 횡베기를 마구 · 도약 · 투창 · 처형 (기술을 끝까지 다 씀)', note: '보스 인카운터로 나온 펄 (각펄 · 3D pearlgak) — 성급은 의미 없음 · 호러에 가까움. 이기면 무릎을 꿇음 (데려간다 · 숨을 끊는다)' };
// 인카운터 정예 · 히든 보스
Object.assign(ELITE8, {""")
rep("  x_nora: { name: '노라', foes: [['노라', 1]] } });", "  x_nora: { name: '노라', foes: [['노라', 1]] },\n  x_pearl: { name: '각펄', foes: [['각펄', 1]] } });   /* v8.7.9 고대 폐허의 각펄 (명세 E) */")
rep("['aitem', 0.4, 6, 26]];", "['aitem', 0.4, 6, 26], ['pearl', 0.45, 4, 16]];   /* v8.7.9 고대 폐허의 펄 (명세 E) */")
rep("    aitem: [{ narr: '금빛 아치가 끝없이 이어진 회랑.',",
    "    pearl: [{ narr: '무너진 고대 폐허. 부서진 기둥 사이로 빛이 비스듬히 떨어진다.', ...cg8('ancient') }, { narr: '검은 날개의 소녀가 혼자 — 조용히 리듬을 타며 창을 빙글빙글 돌린다. 창끝이 바닥을 톡, 톡 긁는다.', ...cg8('ancient') }, { t: '우왓 깜짝이얏!', name: '펄', img: IMG8.pearl2 }, { narr: '(그녀는 우리를 흥미롭게 바라보고 있었다.)', img: IMG8.pearl1 }, { ask: [['같이 가자고 한다', go('pearlAsk')], ['그냥 지나간다', '!r8:done']] }],   /* v8.7.9 명세 E */\n"
    "    aitem: [{ narr: '금빛 아치가 끝없이 이어진 회랑.',")
rep("function r8JoinNow(key, txt, then){   // 판 안이면", r"""/* v8.7.9 펄이 말하는 죄 (명세 E — 이 여정의 기록에서 · 약간의 메타 · 불편한 진실 · 지껄이는 입처럼): 여정 거리 셋까지 (섞어서) + 마지막은 화면 밖의 손가락 */
function pearlSins8(){
  const R = R8S(), C = S.camp || {}, F = R.flags || {}, kills = (R.log || []).reduce((a, l) => a + (l.kills || 0), 0), L = [];
  if (kills) L.push(`음— ${kills}명. 여기까지 오면서 너희가 쓰러뜨린 사람 수야. 이름은… 하나도 안 물어봤지?`);
  if ((R.dead || []).length) L.push(`${R.dead.slice(-3).join(', ')}. 너희를 믿고 따라왔던 애들. 마지막 얼굴, 기억나?`);
  if ((C.lost || []).length) L.push(`${C.lost.slice(-2).join(', ')} — 떠나보냈지. 자리가 모자라서였나? 헤헤.`);
  if (F.pehtoDead) L.push('무릎 꿇은 기사도 베었더라. 항복한 사람이었는데.');
  if (F.noraDead) L.push('그림자 속 상인 언니 — 도망칠 데가 없었대. 너희가 막았잖아.');
  if (F.chickCurse) L.push('닭을 잡으려고 했지? 그 닭이 뭘 하고 있었는지는 궁금하지도 않았고.');
  if (F.adminNo) L.push('"이건 우리 거야." 남의 불씨를 쥐고서 그렇게 말했잖아.');
  if ((R.log || []).some(l => l.k === 'glass')) L.push('모래시계를 깨서 없던 일로 만들었지. 그때 쓰러졌던 애들은 그걸 알까?');
  if ((R.relics || []).length >= 3) L.push(`주운 것만 ${R.relics.length}개. 원래 주인들은 어디 갔을까?`);
  const cu = R.party.find(p => (p.curses || []).length); if (cu) L.push(`${cu.name}의 그림자에 붙은 거 — ${cu.curses[cu.curses.length - 1]}. 그건 스스로 부른 거야.`);
  const gr = R.party.filter(p => (p.grown || []).length).sort((a, b) => b.grown.length - a.grown.length)[0]; if (gr) L.push(`${gr.name}, 남을 밟을 때마다 조금씩 강해졌지. 벌써 ${gr.grown.length}번이나.`);
  for (let i = L.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [L[i], L[j]] = [L[j], L[i]]; }
  const out = L.slice(0, 3);
  for (const g of ['여기까지 오면서 밟고 온 것들 — 벌레도, 꽃도, 사람도. 하나도 안 세어 봤지?', '횃불을 들고 남의 집에 들어왔잖아. 아무도 초대하지 않았는데.']) if (out.length < 2) out.push(g);
  out.push(`그리고 너. 화면 밖에서, 손가락 하나로 다 정했잖아 — 누가 앞에 설지, 누가 남을지. ${r8Elapsed()} 동안 한 번도 미안하다고 안 했어.`);
  return out;
}
/* v8.7.9 각펄 싸움 (명세 E): 숨이 끊길 일격에도 쓰러지기만 함 (판이 끝나면 고름) · 처음부터 우리를 앎 (천천히 걸어옴) · 출구도 들어온 자리도 닫힘 (지면 무조건 전멸) */
function r8PearlHook(W){
  const g = W.units.find(u => u.side === 1 && u.name === '각펄'); W.r8.pearl = true; W.exitLock = true; W.noRetreat = true; if (!g) return;
  g.spare8 = true; g.state = 'hunt'; for (const e of W.units) if (e.side === 0 && e.alive){ g.sense[e.i] = { x: e.x, y: e.y, t: W.t, exact: true }; if (!g.target) g.target = e; }
  logEv(W, { k: 'r8', s: '🖤 등 뒤의 길이 닫혔다. 각펄이 천천히 걸어온다 — 지면 누구도 돌아가지 못한다.', c: 'bad', vis: true });
}
function r8JoinNow(key, txt, then){   // 판 안이면""")
rep("  if (n.surr) for (const u of W.units) if (u.side === 1 && u.name === n.surr){ u.r8surr = { key: n.surr }; }",
    "  if (n.surr) for (const u of W.units) if (u.side === 1 && u.name === n.surr){ u.r8surr = { key: n.surr }; }\n  if (n.pearl8) r8PearlHook(W);   /* v8.7.9 각펄 */")
rep("    if (u.r8surr && u.alive && !u.gone && u.hp / u.max < 0.22){",
    "    if (u.spare8 && u.fell8 != null && u.alive && !u.gone){ u.alive = false; u.gone = 'surr'; u.order = null; u.act = null; W.r8.surr = { ref: 'C-215', key: '각펄', name: '펄' }; logEv(W, { k: 'r8', s: '🪶 검은 날개가 꺾인다 — 펄이 무릎을 꿇는다. (싸움이 끝나면 고름: 데려간다 · 숨을 끊는다)', c: 'good', vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '쓰러짐', c: 'h', t0: W.t }); try { checkEnd(W); } catch (e) {} continue; }   /* v8.7.9 각펄 — 쓰러지되 숨은 붙어 있음 */\n"
    "    if (u.r8surr && u.alive && !u.gone && u.hp / u.max < 0.22){")
rep("  const S8 = W && W.r8 && W.r8.surr; if (!S8) return false;\n",
    "  const S8 = W && W.r8 && W.r8.surr; if (!S8) return false;\n"
    "  if (S8.key === '각펄'){ R8T = then; R8S().flags.surr = S8; talkLines([{ narr: '검은 깃털이 흩날린다. 펄이 창을 짚은 채 무릎을 꿇고 있다.', img: IMG8.pearl3, dark: true }, { narr: '펼쳐졌던 날개가 천천히 접힌다. 눈빛이 — 돌아온다.', img: IMG8.pearl1 }, { t: '…으, 응? 나 졌어? 헤헤… 아프다.', name: '펄', img: IMG8.pearl1 }, { ask: [['데려간다 (영입)', '!r8:pearlJoin'], ['숨을 끊는다 (펄의 창)', '!r8:pearlKill']] }]); return true; }   /* v8.7.9 명세 E — 이기면 영입 · 죽이면 펄의 창 */\n")
rep("  x_riddleC(){ const R = R8S(); const k = r8GiveRelic(); r8Say([{ t: '하하! 그런 대답은 처음이야. 가져가.', name: '아템' }, { box: k ? `${RELIC8[k].ic} ${RELIC8[k].name}` : '동전 40' }]); if (!k) R.gold += 40; } });",
    "  x_riddleC(){ const R = R8S(); const k = r8GiveRelic(); r8Say([{ t: '하하! 그런 대답은 처음이야. 가져가.', name: '아템' }, { box: k ? `${RELIC8[k].ic} ${RELIC8[k].name}` : '동전 40' }]); if (!k) R.gold += 40; },\n"
    r"""  // v8.7.9 고대 폐허의 펄 (명세 E): 귀엽게 → 죄 하나씩 → 각펄 (음영) → 떠난다 / 말을 건다 · 머뭇거림 → 10 … 0 → 천천히 걸어옴 → 싸움
  x_pearlAsk(){ const R = R8S(); R.flags.pearlI = 0; R.flags.pearlSins = pearlSins8(); save(); R8T = null;
    talkLines([{ t: '나랑? 같이? 진짜아?', name: '펄', img: IMG8.pearl2 }, { narr: '펄이 창을 품에 안고 제자리에서 콩콩 뛴다. 검은 날개가 파닥인다.', img: IMG8.pearl1 }, { t: '헤헤, 좋아좋아! 근데 잠깐만— 너희 얘기 좀 해 줘. 아, 아니다. 내가 해 줄게!', name: '펄', img: IMG8.pearl4 }, { ask: [['이야기를 듣는다', '!r8:x_pearlMore'], ['그만 가 본다', '!r8:x_pearlBye']] }]); },
  x_pearlMore(){ const R = R8S(), L0 = R.flags.pearlSins || (R.flags.pearlSins = pearlSins8()), i = R.flags.pearlI || 0; R.flags.pearlI = i + 1; save(); R8T = null;
    if (i < L0.length){ const last = i === L0.length - 1; talkLines([{ t: L0[i], name: '펄', img: i % 2 ? IMG8.pearl4 : IMG8.pearl1 }, ...(i === 0 ? [{ narr: '(웃는 얼굴 그대로다.)', img: IMG8.pearl1 }] : last ? [{ narr: '(…웃고 있었던가?)', img: IMG8.pearl1 }] : []), { ask: [['이야기를 계속한다', '!r8:x_pearlMore'], ['그만 가 본다', '!r8:x_pearlBye']] }]); return; }
    R.flags.pearlDark = 1; save();
    talkLines([{ narr: '…펄의 웃음이 멎어 있다. 언제부터였을까.', dark: true, img: IMG8.pearl3 }, { narr: '검은 날개가 그림자처럼 넓게 펼쳐져 있다. 폐허의 빛이 거기서 끊긴다.', dark: true, img: IMG8.pearl3 }, { t: '인간아, 오만하게 살아왔구나. 네 여행을 떠나렴.', name: '펄', img: IMG8.pearl3, dark: true }, { narr: '그녀는 나직이 말했다.', dark: true, img: IMG8.pearl3 }, { ask: [['떠난다', '!r8:x_pearlLeave'], ['말을 건다', '!r8:x_pearlCount']], wait: 7, then: '!r8:x_pearlCount', dark: true }]); },
  x_pearlBye(){ r8Say([{ t: '에— 벌써 가? 히잉. …또 와!', name: '펄', img: IMG8.pearl2 }, { narr: '등 뒤에서 창끝이 바닥을 톡, 톡 긁는 소리가 다시 시작된다.' }]); },
  x_pearlCount(){ R8T = null; talkLines([{ narr: '펄은 대답하지 않는다. 입술이 천천히 숫자를 센다.', dark: true, img: IMG8.pearl3 }, { ask: [['떠난다', '!r8:x_pearlLeave']], count: 10, then: '!r8:x_pearlWalk', dark: true }]); },
  x_pearlLeave(){ R8S().flags.pearlLeft = 1; save(); r8Say([{ narr: '아무도 뒤돌아보지 않았다. 창끝이 바닥을 긁는 소리가 — 등 뒤에서 멀어진다.', dark: true }, { t: '…잘 가.', name: '펄', img: IMG8.pearl1 }]); },
  x_pearlWalk(){ R8T = null; talkLines([{ narr: '펄이 천천히 걸어온다.', dark: true, img: IMG8.pearl4 }, { go: '!r8:x_pearlFight' }]); },
  x_pearlFight(){ r8XFight('x_pearl', 'ancient', { pearl8: true, intro8: [{ narr: '각펄 — 천천히, 아주 천천히 걸어온다. 등 뒤의 길이 닫혀 있다.', dark: true }, { box: '각펄 — 첫 수는 아주 넓은 횡베기 (둘러싸면 횡베기를 마구) · 투창 줄 · 내려앉을 원 · 땅에서 솟는 창 · 2초 뒤 쏟아지는 창 — 보면 비킬 것 · ◆끝까지 (한 번은 쓰러지지 않음) · 물러날 수 없음 — 지면 무조건 전멸' }] }); },
  pearlJoin(){ const R = R8S(); R.flags.surr = null; R.flags.pearlWon = 'join'; const cont = R8T; R8T = null; r8Recruit('C-215', '"정말? 나 데려가는 거야? 헤헤— 열심히 할게!" 펄이 창을 어깨에 걸치고 날개를 파닥인다.', cont); },
  pearlKill(){ const R = R8S(); R.flags.surr = null; R.flags.pearlWon = 'kill'; const cont = R8T; R8T = null; const it = { k: 'weapon', name: '펄의 창', label: '', dur: 100 }, who = [R.party.find(p => p.hero), ...R.party].filter(Boolean).find(p => !bagPut(p, it)); save();
    talkLines([{ narr: '창끝이 내려간다. 검은 깃털이 바람에 흩어지고 — 더는 날리지 않는다.', dark: true }, { box: who ? `🗡 펄의 창 — ${who.name}의 가방에 (두 손 · 긴 창 · 정면 투창 (열화))` : '🗡 펄의 창 — 가방에 자리가 없어 폐허에 두고 왔다' }, { go: '!r8:then' }]); R8T = cont; } });""")

# ---------- 싸움 앞 · 뒤: 소개 · 모래시계 없음 · 전멸 글 · 물러나기 없음 · 옥상 ----------
rep("n.t === 'elite' ? [{ narr: `${(ELITE8[n.e] || {}).name} — 길을 막고 선다.` }]", "n.t === 'elite' ? (n.intro8 || [{ narr: `${(ELITE8[n.e] || {}).name} — 길을 막고 선다.` }])")   # v8.7.9 만남마다 소개 (각펄)
rep("  if ((W.result === 'lose' || !W.units.some(u => u.side === 0 && !u.summon && (u.gone === 'up' || u.gone === 'down'))) && r8Has('glass') && R.glassSnap){",
    "  if ((W.result === 'lose' || !W.units.some(u => u.side === 0 && !u.summon && (u.gone === 'up' || u.gone === 'down'))) && r8Has('glass') && R.glassSnap && !(W.r8 && W.r8.pearl)){   /* v8.7.9 각펄: 지면 무조건 전멸 (모래시계도 듣지 않음) */")
rep("  if (W.result === 'lose' || !party.length){ r8End('wipe'); return; }", "  if (W.result === 'lose' || !party.length){ r8End('wipe', W.r8 && W.r8.pearl ? ['…네 여행은 여기까지야.', `${R.f}층 고대 폐허 — 검은 깃털 위에서 횃불이 꺼졌다.`] : null); return; }")
rep("function r8End(kind){", "function r8End(kind, txt){")
rep("  const T = { wipe: [", "  const T = txt || { wipe: [")
rep("if (!W.over && !/data-cexit=\"down\"/.test(h)) h = h.replace('<span class=\"cb\">', '<span class=\"cb\"><button class=\"btn sm\" type=\"button\" data-cexit=\"down\" title=\"들어온 자리로 물러남",
    "if (!W.over && !W.noRetreat && !/data-cexit=\"down\"/.test(h)) h = h.replace('<span class=\"cb\">', '<span class=\"cb\"><button class=\"btn sm\" type=\"button\" data-cexit=\"down\" title=\"들어온 자리로 물러남")   # v8.7.9 각펄 — 물러날 길 없음
rep("  if (W.fall8) for (const u of W.units){ if (!u.alive || u.r8fell) continue;", "  if (W.fall8) for (const u of W.units){ if (!u.alive || u.r8fell || u.fallW || u.fairyW) continue;   /* v8.7.9 ◆타천 날개 · ◆요정 날개 — 떨어지지 않음 */")

# v1.1 떨어지는 창 (도감 — 각펄: 2초쯤 뒤 하늘에서 쏟아짐 · 신나펄: 일반 창이 비스듬히 꽂힘) · 아군의 창비는 푸르게 (예전엔 망각의 그림자처럼 모두 붉음)
rep("""    ctx.fillStyle = `rgba(128,32,32,${(0.14 + 0.22 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(p.x, p.y, Q.r * ts, 0, 6.283); ctx.fill();
    ctx.fillStyle = `rgba(160,30,40,${(0.28 + 0.3 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(p.x, p.y, Q.r * ts * q, 0, 6.283); ctx.fill();
    ctx.strokeStyle = 'rgba(225,85,85,.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, Q.r * ts, 0, 6.283); ctx.stroke(); ctx.restore(); }""",
"""    const c0 = Q.side ? ['128,32,32', '160,30,40', '225,85,85'] : ['40,80,140', '60,120,200', '120,180,255'];   /* v8.7.9 아군 (신나펄) 의 창비는 푸르게 */
    ctx.fillStyle = `rgba(${c0[0]},${(0.14 + 0.22 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(p.x, p.y, Q.r * ts, 0, 6.283); ctx.fill();
    ctx.fillStyle = `rgba(${c0[1]},${(0.28 + 0.3 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(p.x, p.y, Q.r * ts * q, 0, 6.283); ctx.fill();
    ctx.strokeStyle = `rgba(${c0[2]},.85)`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, Q.r * ts, 0, 6.283); ctx.stroke();
    if (Q.wk === '날붙이' && !Q.up && q > 0.5){ const k = (q - 0.5) / 0.5, h = (1 - k) * 2.2 + 0.15, sx = Q.diag ? -0.7 : 0, L9 = Q.r > 3 ? 2.4 : 0.9; ctx.strokeStyle = Q.side ? 'rgba(30,26,34,.95)' : 'rgba(250,220,120,.95)'; ctx.lineWidth = Math.max(2.5, Q.r * 1.6); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p.x + sx * h * ts, p.y - h * ts); ctx.lineTo(p.x + sx * (h + L9) * ts, p.y - (h + L9) * ts); ctx.stroke(); }   /* v8.7.9 떨어지는 창 (각펄 — 곧게 · 거대 특수창은 굵고 길게 · 신나펄 — 비스듬히) */
    ctx.restore(); }""")

# v1.2 특성 검사: 동료 정체성을 받지 않는 적 (noId — 각펄) 은 정체성 특성 검사를 건너뜀 (lockIdentity 와 같은 규칙)
rep("const idm = p.ref ? idTraits(p.ref).filter(t => !tr.includes(t)) : [];", "const idm = p.ref && !p.noId ? idTraits(p.ref).filter(t => !tr.includes(t)) : [];   /* v8.7.9 noId (각펄) */")

open(F, 'w', encoding='utf-8').write(s)
print('page8790 OK')
