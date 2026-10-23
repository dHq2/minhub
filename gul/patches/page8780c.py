# v8.7.8 페이지 (3) — page8780c.py v1.2 (v1.2: 판 위 동작 이름표도 초돌진 (방패 돌진이라 적히던 것) · v1.1: 설계 · 도감의 방패 이름 (버클러) · 몸 폭 (rMul) 이 판까지 넘어감 — 전엔 설계 칸 목록 · 도감 적용에서 빠져 뽑기 어퐁이 보통 방패 · 보통 몸 폭이던 것 · v1.0: 어퐁 (명세 C6 · 도감 C-103 — 뽑기 · 4성 · 설계 · 도감 정체성 · 초돌진 · 앞차기 · 버클러) · 카리우스 (명세 C7 — 3D 기술 다섯 + [근성] [불경자] · 정체성 · 옛 저장도) ·
#   기술 · 특성 글 · 기록 · 서술 (근성의 차례 · 불경자 · 벼락) · 그림 (기술 예고 — 부채꼴 · 줄 · 발 디딜 자리 · 철퇴 자리 · 광대의 팔 · 초돌진 길 · 근성 · 불경자 · 벼락 연기 · 후려친 자국) · 상세 줄 · 죽음 글 (근성이 다함) ·
#   아이콘 판 8 × 10 (50 ~ 60 새 그림 — ico878/mkico_c.py) · 기술 칸 그림 · 겨눌 곳 글 · 동작 이름)
import subprocess, shutil
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8780b.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep("싸움이 끝나면 경례하고 사라짐 · 쓰러지면 잊힘. 쥐의 무구는 전리품이 되지 않음. 아이콘 판 64칸.\n     v8.7.7: ",
    """싸움이 끝나면 경례하고 사라짐 · 쓰러지면 잊힘. 쥐의 무구는 전리품이 되지 않음. 아이콘 판 64칸.
         어퐁 (명세 C6 · 도감 C-103 — 뽑기에서만 · 4성 · 키 2.4M · 대형 (옆으로도 근육) · [지휘B] [갑피] [베테랑] [근력A] [사격A] [전투센스] · 어퐁의 철퇴 + 버클러 (막는 폭 ±40°)):
         초돌진 (5칸 넘게 떨어진 적에게만 · 돌진 걸음 × 1.8 · 길 둘레 몸 + 0.9칸의 적을 넓게 밀어냄 — 가벼우면 넘어짐 · 휩쓸린 적은 막지 못함 · 노린 적엔 돌진 충돌 그대로 · 10초) ·
         앞차기 (붙은 적을 차 밀어냄 · 휘청 · 막으면 자세가 깎임 · 5초) · 돌진.
         카리우스 (명세 C7 — 3D karius.js 그대로 · 2D 불경자 · 근성): 잡아뚫기 (광대의 팔 — 끌어와 레프트 꿰뚫기 · 치명 50% · 갑옷 무시 · 뛰어오른 적은 보스도 끌어내림 · 11초) ·
         노인의 팔 후려치기 (앞 부채꼴 2.7칸 · 밀침 · 휘청 · 4초) · 라이트 훅 세 번 (6초) · 딥 킥 (벽을 등진 적을 먼저 · 벽에 박으면 짓뭉개짐 · 7초) · 짓밟기 (누운 적 확인사살 — 보스 빼고 · 선 적은 넘어뜨림) ·
         [불경자] (체력 15% 아래 — 공격 × 2.5 · 받는 피해 × 0.33 · 걸음 × 1.4 · 공격 간격 × 0.8 · 막지 않음 · 노인의 팔 철퇴 · 돌진 몸박 / 체력 50% 넘으면 풀림) ·
         [근성] (체력 0 → 3초 무적 발버둥 → 포효 → 7초 쓰러지지 않음 — 공격 속도 × 1.5 · 모든 공격 치명 · 슈퍼아머 → 실이 끊긴 듯 쓰러짐 · 그 사이 싸움이 끝나면 체력 5% 로 살아남음) ·
         벼락을 맞으면 연기를 토하며 차갑게 미쳐 감 (◆개조된 신체 — 6초 공격 × 1.3). 기술 예고 (부채꼴 · 줄 · 발 디딜 자리) 를 보면 적 · 아군 모두 비킴. 아이콘 판 80칸.
     v8.7.7: """)
rep("의 버전 기록에 — v8.7.8 굿윌 · 포렌 (쥐 군단) · 감전 한 틀 / v8.7.7 유물 34 · 노먼 전직", "의 버전 기록에 — v8.7.8 굿윌 · 포렌 (쥐 군단) · 어퐁 · 카리우스 · 감전 한 틀 / v8.7.7 유물 34 · 노먼 전직")
rep('">v8.7.8 · 굿윌 · 포렌 · 감전 한 틀</span>', '">v8.7.8 · 굿윌 · 포렌 · 어퐁 · 카리우스 · 감전 한 틀</span>')

# ---------- 어퐁: 설계 · 도감 정체성 (뽑기에서만 — 명세 C6 · 도감 C-103) ----------
AP_TR = "['지휘B', '갑피', '베테랑', '근력A', '사격A', '전투센스']"
AP_ACT = "['초돌진', '앞차기', '돌진']"
AP_NOTE = ("판타지 쪽 출신 — 그 세계에서 대장군에 가까웠다 (생각보다 하이테크). 진형 붕괴와 돌격의 스페셜리스트 · 탱킹은 취향이 아니나 잘함 · 사실 특기는 총포류 (총을 주우면 잘 쏨). "
           "기술 칸 1 = 초돌진 (5칸 넘게 떨어진 적을 탭) · 2 = 앞차기 (붙은 적을 탭)")
AP_BASE = (f"cls: '지휘', role: '전선', weapon: '어퐁의 철퇴', shield: true, sName: '버클러', sm: 0.79, height: 2.4, weight: 210, sizeCls: '대형', rMul: 1.15, ov: {{ hp: 360, atk: 50, spd: 2.6 }}, "
           f"traits: {AP_TR}, active: {AP_ACT}, tactic: '진형 붕괴 · 돌격 · 지휘', note: '{AP_NOTE}'")
n0 = s.index("  { key: '포렌', side: 0, ref: 'C-006'"); n1 = s.index('\n', n0) + 1
s = s[:n1] + f"  {{ key: '어퐁', side: 0, ref: 'C-103', name: '어퐁', tier: 2, {AP_BASE}, nv: true, nvG: 'B' }},   /* v8.7.8 어퐁 (명세 C6 · 도감 C-103 — 곤봉적 (400 · 55) 보다 살짝 아래 · 기동 좋음 · 대형 2.4M (옆으로도 근육 — 몸 폭 × 1.15) · 갑피 · 장군 출신 베테랑 · 버클러 + 철퇴) */\n" + s[n1:]
n0 = s.index("  'C-006': { cls: '지휘', role: '전선', weapon: '포렌의 대검'"); n1 = s.index('\n', n0) + 1
s = s[:n1] + f"  'C-103': {{ {AP_BASE}, allyNv: 'B' }},   // v8.7.8 어퐁 (도감 '4성으로 수정' · 고유특성 없음 · 매우 강한 근력 · 전투의 달인 · 특기는 총포류)\n" + s[n1:]
rep("'C-003': { unique: ['개조된 신체'], active: ['돌진'] },",
    "'C-003': { unique: ['개조된 신체'], traits: ['근성', '불경자'], active: ['돌진', '잡아뚫기', '노인의 팔', '라이트 훅', '딥 킥', '짓밟기'] }, 'C-103': { traits: " + AP_TR + ", active: " + AP_ACT + " },   /* v8.7.8 카리우스 3D 기술 · 어퐁 */")

# ---------- 카리우스: 3D 기술 다섯 + [근성] [불경자] (명세 C7) ----------
KAR_ACT = "['돌진', '잡아뚫기', '노인의 팔', '라이트 훅', '딥 킥', '짓밟기']"
KAR_NOTE = ("높은 체력 · 높은 방어 · 느림. 돌진으로 전선에 충격을 주며 들어감. 몸이 방패 (동료를 가림) · 팔이 방패 (막기) · 넓게 휘두르기 · 찍기 · 넘어진 상대는 짓밟음 (확인사살). "
            "광대의 팔 (잡아뚫기) · 노인의 팔 (후려치기) · 라이트 훅 · 딥 킥 — 기술 칸 1 = 잡아뚫기 · 2 = 노인의 팔. 체력 15% 아래 불경자 · 체력 0 이면 근성 (7초)")
rep("weight: 300, height: 3, ov: { hp: 700, atk: 40, rng: 0.6 }, active: ['돌진'], cry: '크아아!', sm: 0.75, allyNv: 'B', tactic: '중전차 · 돌진', note: '높은 체력 · 높은 방어 · 느림. 돌진으로 전선에 충격을 주며 들어감. 몸이 방패 (동료를 가림) · 팔이 방패 (막기) · 넓게 휘두르기 · 찍기 · 넘어진 상대는 짓밟음' },",
    f"weight: 300, height: 3, ov: {{ hp: 700, atk: 40, rng: 0.6 }}, traits: ['근성', '불경자'], active: {KAR_ACT}, cry: '크아아!', sm: 0.75, allyNv: 'B', tactic: '중전차 · 돌진 · 광대의 팔 · 노인의 팔 · 근성', note: '{KAR_NOTE}' }},   /* v8.7.8 명세 C7 */")
rep("traits: ['거구', '갑피', '근력A', '괴력A', '머리 넷', '은신E'], unique: ['개조된 신체'], modBody: true, active: ['돌진'], cry: '크아아!', tactic: '중전차 · 돌진', note: '높은 체력 · 높은 방어 · 느림. 돌진으로 전선에 충격을 주며 들어감. 몸이 방패 (동료를 가림) · 팔이 방패 (막기) · 넓게 휘두르기 · 찍기 · 넘어진 상대는 짓밟음' },",
    f"traits: ['거구', '갑피', '근력A', '괴력A', '머리 넷', '은신E', '근성', '불경자'], unique: ['개조된 신체'], modBody: true, active: {KAR_ACT}, cry: '크아아!', tactic: '중전차 · 돌진 · 광대의 팔 · 노인의 팔 · 근성', note: '{KAR_NOTE}' }},   /* v8.7.8 명세 C7 */")

# ---------- 설계 · 도감이 방패 이름 (버클러) · 몸 폭 (옆으로도 근육) 을 판까지 넘김 (전엔 빠짐) ----------
rep("const DKEEP = ['rMul', 'name',", "const DKEEP = ['rMul', 'sName', 'name',")   # v8.7.8
rep("for (const k of ['sizeCls', 'regenK', 'leapN', 'race', 'origin', 'shells', 'alt', 'dcounter', 'noChg']) if (pf[k] != null && u[k] == null) u[k] = clone(pf[k]);",
    "for (const k of ['sizeCls', 'regenK', 'leapN', 'race', 'origin', 'shells', 'alt', 'dcounter', 'noChg', 'rMul', 'sName']) if (pf[k] != null && u[k] == null) u[k] = clone(pf[k]);   /* v8.7.8 어퐁 버클러 · 몸 폭 */")

# ---------- 특성 · 기술 · 고유 글 ----------
rep("const TRAITS = {\n", """const TRAITS = {
  '근성': '마지막 항전 (카리우스 — 2D 원본 · 3D) — 체력이 0이 되면 3초 무적으로 꿈틀거리다 (발버둥 · 아무것도 못 함) 안광이 살아나 울부짖고, 7초 동안 무슨 일이 있어도 쓰러지지 않음 (체력 1 은 남음): 공격 속도 × 1.5 · 모든 공격 치명 · 슈퍼아머 (휘청 · 넘어짐 · 밀림 없음) · 기술 대기도 1.5배 빨리. 7초가 되면 실이 끊긴 듯 쓰러짐. 그 사이 싸움이 끝나면 이겨도 쓰러지지만 체력 5% 로 살아남음. 판에 한 번',   /* v8.7.8 */
  '불경자': '불경자 카리우스 (2D 원본 · 3D) — 체력 15% 아래: 얼굴이 새까매지고 안경만 빛남 (0.6초 울부짖음). 공격 × 2.5 (기술 포함) · 받는 피해 × 0.33 · 걸음 × 1.4 · 공격 간격 × 0.8 · 막지 않음 · 노인의 팔 철퇴 (앞 1.3칸 자리 둘레 1.3칸 · 휘청 · 5초) · 돌진 몸박 (3 ~ 7칸 적에게 일직선 · 날려 보냄 · 벽이면 짓뭉개짐 · 8초). 쉬어서 체력 50% 를 넘으면 풀림',   /* v8.7.8 */
""")
rep("const ACTIVE = {\n", """const ACTIVE = {
  '초돌진': '어퐁 (명세 C6) — 5칸 넘게 떨어진 적에게만: 돌진 (예고 0.35초) 을 돌진 걸음 × 1.8 로 — 길 둘레 (몸 + 0.9칸) 의 적을 넓게 밀어냄 (공격 × 0.5 · 옆으로 크게 밀림 · 어퐁 무게 × 1.3 아래면 넘어짐 · 휩쓸린 적은 막지 못함) · 노린 적엔 돌진 충돌 그대로 (빠른 만큼 셈). 대기 10초. 명령: 기술 칸 1 → 적을 탭 (5칸 안이면 그냥 침)',
  '앞차기': "어퐁 (그림 '높이 앞차기') — 붙은 적을 0.25초 만에 차 밀어냄 (공격 × 1.2 · 1.5칸 밀림 · 휘청 0.5초 · 막으면 자세가 깎이고 덜 밀림). 둘러싸였을 때 · 막고 선 적 · 나를 치려는 적에게 먼저. 대기 5초",
  '잡아뚫기': '카리우스 (3D) — 광대의 팔이 돋아 1.9칸 (뛰어오른 적은 3.4칸 — 보스도 끌어내림) 의 적을 붙잡아 0.6초 끌어옴 (그동안 아무것도 못 함 · 카리우스가 휘청이면 놓침) → 레프트 꿰뚫기 (공격 × 1.25 · 치명 50% · 갑옷 무시 · 막지 못함). 보스 · 초대형은 끌어오지 못함 (뛰어오른 때만). 대기 11초. 명령: 기술 칸 1 → 적을 탭',
  '노인의 팔': '카리우스 (3D) — 노인의 팔 후려치기: 앞 부채꼴 (2.7칸 · 137°) 의 적을 모두 후려침 (공격 × 1.25 · 밀침 · 휘청 0.5초 · 막으면 덜 · 뛰어오른 몸도). 예고를 본 적은 비킴. 대기 4초. 명령: 기술 칸 2 → 앞의 적을 탭',
  '라이트 훅': '카리우스 (3D) — 팔 여럿으로 라이트 훅 세 번: 앞 부채꼴 (1.9칸 · 97°) 을 0.15초 간격으로 세 번 (공격 × 0.45 씩 · 마지막은 밀침). 대기 6초',
  '짓밟기': '카리우스 (3D) — 발을 든 자리 (처음에 정함 — 비켜나면 빗나감) 를 짓밟음: 누운 적은 확인사살 (보스는 크게 다침 · 뼈가 부러질 수 있음) · 선 적은 공격 × 1.1 + 넘어뜨림 (대형부터는 버팀). 누운 적이면 대기 4초 · 선 적이면 8초',
  '노인의 팔 철퇴': '불경자 카리우스 — 노인의 팔이 부풀어 철퇴처럼: 앞 1.3칸 자리 둘레 1.3칸 (0.7초 예고) — 공격 × 1.67 (불경자 × 2.5 위에) · 휘청 0.6초 · 밀침. 대기 5초 (불경자일 때만)',
  '돌진 몸박': '불경자 카리우스 — 몸을 낮췄다가 (0.5초) 일직선으로 0.5초 밀고 나감 (초당 9칸): 닿는 적마다 공격 × 1.46 · 크게 날려 보냄 (벽이면 짓뭉개짐). 3 ~ 7칸 적에게. 대기 8초 (불경자일 때만)',
""")
rep("  '딥 킥': '붉은암석 (민수 메모 J22) — 손 닿는 상대를 0.35초 만에 걷어참 (둔기 × 0.9) · 크게 날려 보냄 (막으면 덜) — 날아간 몸이 볼링 핀처럼 뒤의 무리를 쓰러뜨림 (뒤에 줄지어 있으면 먼저 씀). 7초마다',",
    "  '딥 킥': '붉은암석 (민수 메모 J22) · 카리우스 (3D 딥킥) — 손 닿는 상대를 0.35초 만에 걷어참 (둔기 × 0.9) · 크게 날려 보냄 (막으면 덜) — 날아간 몸이 볼링 핀처럼 뒤의 무리를 쓰러뜨림 (뒤에 줄지어 있으면 먼저 씀) · 벽에 박으면 짓뭉개짐 (카리우스는 벽을 등진 적을 먼저). 보스는 걷어차지 않음 (카리우스). 7초마다',   /* v8.7.8 카리우스도 */")
rep("'움찔 · 넘어짐 시간 절반', ", "'움찔 · 넘어짐 시간 절반', '벼락을 맞으면 연기를 토하며 차갑게 미쳐 감 — 6초 공격 × 1.3 (3D)', ")

# ---------- 아이콘 판 8 × 10 (50 ~ 60 새 그림) · 기술 칸 그림 · 겨눌 곳 글 ----------
rep('const ICO = {"cols": 8, "rows": 8, "map": {', 'const ICO = {"cols": 8, "rows": 10, "map": {')
rep('background-size:calc(var(--s) * 8) calc(var(--s) * 8)', 'background-size:calc(var(--s) * 8) calc(var(--s) * 10)')
rep('"구르기": 49,', '"구르기": 49, "초돌진": 50, "앞차기": 51, "잡아뚫기": 52, "노인의 팔": 53, "라이트 훅": 54, "짓밟기": 55, "근성": 56, "불경자": 57, "노인의 팔 철퇴": 58, "돌진 몸박": 59, "딥 킥": 60,')   # v8.7.8 어퐁 · 카리우스
shutil.copy(D + 'ico878/icons_v878c.webp', D + 'build/icons.webp')   # v1.0 아이콘 판 8 × 10 (mkico_c.py)
rep("pbind: '🪢' };   /* v8.7.8 굿윌 · 포렌 (전엔 ★) */",
    "pbind: '🪢', asup: '🐂', akick: '🦵', kgrab: '🤡', ksw: '👴', khook: '🥊', kstomp: '🦶', kick: '🦶', kslam: '🔨', krush: '🐗' };   /* v8.7.8 굿윌 · 포렌 · 어퐁 · 카리우스 (전엔 ★) */")
rep("const SPEC_TGT = { pmark:",
    "const SPEC_TGT = { asup: '🐂 초돌진: 5칸 넘게 떨어진 적을 탭 (12칸까지 — 가까우면 그냥 침)', akick: '🦵 앞차기: 붙은 적을 탭', kgrab: '🤡 잡아뚫기: 적을 탭 (1.9칸 · 뛰어오른 적은 3.4칸 — 멀면 다가감)', ksw: '👴 노인의 팔: 앞의 적을 탭 (부채꼴 2.7칸 · 둘레 적 모두)', khook: '🥊 라이트 훅: 적을 탭 (세 번)', kstomp: '🦶 짓밟기: 누운 적 (또는 선 적) 을 탭', kick: '🦶 딥 킥: 적을 탭 (벽 쪽으로 차면 짓뭉개짐)', pmark:")

rep("k === 'charge' ? (u.shield ? '🛡 ' : '💨 ') + (u.chargeName || '돌진')", "k === 'charge' ? (A.sup ? '🐂 초돌진' : (u.shield ? '🛡 ' : '💨 ') + (u.chargeName || '돌진'))")   # v8.7.8 초돌진은 그 이름으로 (방패 돌진이라 적히던 것)

# ---------- 동작 이름 ----------
rep("  if (a.k === 'roll') return a.dir === 'back' ? '뒷구르기' : '앞구르기 — 굴러 들어감';   /* v8.7.8 쥐 베테랑 */",
    "  if (a.k === 'roll') return a.dir === 'back' ? '뒷구르기' : '앞구르기 — 굴러 들어감';   /* v8.7.8 쥐 베테랑 */\n"
    "  if (a.k === 'karRoar') return '불경자 — 울부짖음';   /* v8.7.8 카리우스 */\n"
    "  if (a.k === 'spec' && a.s === 'kgrab' && a.ph === 'pull') return `🤡 잡아뚫기 — ${b ? reul(b.name) + ' ' : ''}끌어오는 중 (${f2(a.left)}초 뒤 꿰뚫음)`;\n"
    "  if (a.k === 'spec' && a.s === 'khook' && a.ph === 'hook') return '🥊 라이트 훅 — 연타';\n"
    "  if (a.k === 'spec' && a.s === 'krush' && a.ph === 'go') return '🐗 돌진 몸박 — 밀고 나감';")
rep("  if (a.k === 'charge') return `돌진 → ${b ? b.name : ''}`;", "  if (a.k === 'charge') return `${a.sup ? '🐂 초돌진' : '돌진'} → ${b ? b.name : ''}`;   /* v8.7.8 어퐁 */")
rep("dir: u.act.dir || '', s: u.act.s || '' }", "dir: u.act.dir || '', s: u.act.s || '', sup: !!u.act.sup }")

# ---------- 기록 (글) ----------
rep("      case 'ratCome': out.push(", (
    "      case 'apSup': out.push(`${T(e)}🐂 ${n(e.a)} 초돌진 → ${n(e.b)} (${e.d}칸${e.why && e.why !== '명령' ? ' · ' + e.why : ''})`); break;   // v8.7.8 어퐁\n"
    "      case 'apSweep': out.push(`${T(e)}🐂 ${n(e.a)}의 초돌진에 ${n(e.b)} 휩쓸림${e.down ? ' — 넘어짐' : ' (무거워 밀리기만)'}`); break;\n"
    "      case 'akick': out.push(`${T(e)}🦵 ${n(e.a)} 앞차기 → ${n(e.b)}${e.block ? ' (막음 — 자세가 깎임)' : ''}`); break;\n"
    "      case 'karGrab': out.push(`${T(e)}🤡 ${n(e.a)} 광대의 팔 → ${n(e.b)} ${e.air ? '끌어내림 (뛰어오른 몸)' : '붙잡아 끌어옴'}`); break;   // v8.7.8 카리우스\n"
    "      case 'karPierce': out.push(`${T(e)}🤡 ${n(e.a)} 레프트 꿰뚫기 → ${n(e.b)}${e.crit ? ' · 치명' : ''} (갑옷 무시)`); break;\n"
    "      case 'karLet': out.push(`${T(e)}🤡 ${n(e.a)} 광대의 팔이 놓침 — ${n(e.b)} 풀려남`); break;\n"
    "      case 'karSwat': out.push(`${T(e)}👴 ${n(e.a)} 노인의 팔 후려치기 — ${e.n}명`); break;\n"
    "      case 'karHook': out.push(`${T(e)}🥊 ${n(e.a)} 라이트 훅 ${e.n}타 — ${e.hit}명`); break;\n"
    "      case 'karSlam': out.push(`${T(e)}🔨 ${n(e.a)} 노인의 팔 철퇴 — ${e.n}명`); break;\n"
    "      case 'karRush': out.push(`${T(e)}🐗 ${n(e.a)} 돌진 몸박${e.b != null ? ' → ' + n(e.b) : ''}`); break;\n"
    "      case 'karHeretic': out.push(e.on ? `${T(e)}🕶 ${n(e.a)} 불경자 — 공격 × 2.5 · 받는 피해 × 0.33 · 걸음 × 1.4 · 막지 않음` : `${T(e)}${n(e.a)} 불경자가 풀림 (체력 50% 넘음)`); break;\n"
    "      case 'karGrit': out.push(`${T(e)}🔥 ${n(e.b)} 근성 — ${({ agony: '숨이 끊길 피해 → 3초 무적 발버둥', roar: '안광이 살아나 울부짖음', last: '마지막 7초 (공격 속도 × 1.5 · 모든 공격 치명 · 슈퍼아머)', end: '실이 끊긴 듯 쓰러짐', over: '싸움이 끝나 쓰러짐 — 체력 ' + e.hp + ' 로 살아남음' })[e.ph] || e.ph}${e.ph === 'agony' && e.a !== e.b ? ' (' + n(e.a) + '의 일격)' : ''}`); break;\n"
    "      case 'karRage': out.push(e.off ? `${T(e)}${n(e.a)} 차갑게 미친 기운이 가라앉음` : `${T(e)}⚡ ${n(e.a)} 벼락을 맞음 — 연기를 토하며 차갑게 미쳐 감 (${e.sec}초 공격 × 1.3)`); break;\n"
    "      case 'ratCome': out.push("))

# ---------- 서술 ----------
rep("    case 'prMark': if (!(e.vis || U(e.a).side === 0)) return null;", (
    "    case 'apSweep': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: e.down ? `${ga(n(e.b))} 어퐁의 초돌진에 휩쓸려 나뒹군다!` : `${ga(n(e.b))} 초돌진에 밀려나지만 버틴다.` };   // v8.7.8 어퐁\n"
    "    case 'akick': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: e.block ? `${ga(n(e.a))} 높이 앞차기 — ${ga(n(e.b))} 막았지만 자세가 무너진다.` : `${ga(n(e.a))} ${reul(n(e.b))} 높이 차 날린다!` };\n"
    "    case 'karGrab': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: e.air ? `광대의 팔이 돋아 뛰어오른 ${reul(n(e.b))} 붙잡아 끌어내린다!` : `카리우스의 몸에서 광대의 팔이 돋는다 — ${reul(n(e.b))} 붙잡아 끌어온다! (낄낄)` };   // v8.7.8 카리우스\n"
    "    case 'karPierce': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `레프트가 ${reul(n(e.b))} 꿰뚫는다${e.crit ? ' — 치명!' : '!'}` };\n"
    "    case 'karSwat': if (!(e.vis || U(e.a).side === 0) || !e.n) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `노인의 팔이 부풀어 앞을 후려친다 — ${e.n}명이 밀려난다!` };\n"
    "    case 'karHook': if (e.n !== 3 || !(e.vis || U(e.a).side === 0) || !e.hit) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `팔 여럿이 라이트 훅을 세 번 꽂는다!` };\n"
    "    case 'karSlam': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `노인의 팔이 철퇴처럼 부풀어 내려찍는다 — 쾅!${e.n ? ' (' + e.n + '명)' : ''}` };\n"
    "    case 'karRush': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 몸을 낮췄다가 일직선으로 밀고 나간다 — \"우오오오!\"` };\n"
    "    case 'karHeretic': if (!e.on) return null; return { c: U(e.a).side ? 'bad' : 'warn', s: `${n(e.a)}의 얼굴이 새까매지고 안경만 빛난다 — 불경자 카리우스.` };\n"
    "    case 'karGrit': return e.ph === 'agony' ? { c: 'warn', s: `${ga(n(e.b))} 무너졌다… 꿈틀꿈틀 괴로워한다. (안경 빛이 꺼진다)` } : e.ph === 'roar' ? { c: U(e.b).side ? 'bad' : 'good', s: `${n(e.b)}의 안광이 살아난다 — 울부짖으며 최후의 7초 (근성).` } : e.ph === 'end' ? { c: U(e.b).side ? 'good' : 'bad', s: `실이 끊긴 것처럼, ${ga(n(e.b))} 선 채로 고개를 떨군다.` } : e.ph === 'over' ? { c: 'warn', s: `싸움이 끝났다 — ${ga(n(e.b))} 그대로 쓰러진다. 아직 숨은 붙어 있다.` } : null;\n"
    "    case 'karRage': if (e.off) return null; return { c: 'warn', s: `${ga(n(e.a))} 연기를 토한다 — 차갑게 미쳐 간다.` };\n"
    "    case 'prMark': if (!(e.vis || U(e.a).side === 0)) return null;"))

# ---------- 죽음 글 ----------
rep("tear: '잡아찢김' };", "tear: '잡아찢김', grit: '근성이 다함 (실이 끊긴 듯)' };")
rep("tear: 2.0 };", "tear: 2.0, grit: 0.3 };")
rep("  tear: (A, B) => [", "  grit: (A, B) => `실이 끊긴 것처럼, ${ga(B)} 선 채로 고개를 떨군다.`,   /* v8.7.8 카리우스 근성 */\n  tear: (A, B) => [")

# ---------- 그림: 기술 예고 · 광대의 팔 · 초돌진 길 · 근성 · 불경자 · 벼락 · 후려친 자국 ----------
rep("  if (!ed && (Wd.units.some(u => u.h2) || (Wd.h2z && Wd.h2z.length))) drawH2Warn(Wd, ox, oy, ts);",
    "  if (!ed && (Wd.units.some(u => u.h2) || (Wd.h2z && Wd.h2z.length))) drawH2Warn(Wd, ox, oy, ts);\n"
    "  if (!ed && Wd.units.some(u => u.alive && u.act && ((u.act.k === 'spec' && KAR_TG.includes(u.act.s)) || u.act.sup))) drawKarWarn(Wd, ox, oy, ts);   /* v8.7.8 카리우스 · 어퐁 */")
rep("// v8.7.4 3D 보스 기술표 예고:", """// v8.7.8 카리우스 · 어퐁의 기술 예고 (엔진 karTg 와 같은 모양): 부채꼴 (노인의 팔 · 라이트 훅) · 철퇴 자리 · 발 디딜 자리 · 몸박 줄 · 잡을 몸 고리 · 초돌진 길 (휩쓸 폭) — 적 붉게 · 아군 푸르게
function drawKarWarn(Wd, ox, oy, ts){
  const see = $('seeAll').checked, now = Wd.t;
  for (const u of Wd.units){ const A = u.act; if (!u.alive || !A || !(u.side === 0 || u.seenBy || see)) continue;
    const col = u.side ? '255,70,60' : '110,190,255', px = ox + u.x * ts, py = oy + u.y * ts;
    if (A.k === 'charge' && A.sup){ const S = SPR(Wd, 'asup'), t = A.b != null ? Wd.units[A.b] : null, ang = A.phase === 'run' ? Math.atan2(A.dy, A.dx) : t ? Math.atan2(t.y - u.y, t.x - u.x) : u.face || 0, L0 = t ? Math.hypot(t.x - u.x, t.y - u.y) * ts : 4 * ts, w = (u.r + (S.w || 0.9)) * 2 * ts;
      ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.fillStyle = `rgba(${col},0.13)`; ctx.fillRect(0, -w / 2, L0, w); ctx.strokeStyle = `rgba(${col},.7)`; ctx.lineWidth = 2; ctx.setLineDash([7, 5]); ctx.strokeRect(0, -w / 2, L0, w); ctx.setLineDash([]); ctx.restore();
      ctx.save(); ctx.font = '700 12px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = u.side ? '#ffb4a8' : '#ffe2a0'; ctx.fillText('🐂 초돌진', px, py - u.r * ts - 8); ctx.restore(); continue; }
    if (A.k !== 'spec' || A.phase !== 'wind' || !KAR_TG.includes(A.s)) continue;
    const t = A.b != null ? Wd.units[A.b] : null; if (!t) continue; const Z = karTg(Wd, u, A, t), S = SPR(Wd, A.s), q = Math.min(1, (now - A.t0) / Math.max(0.05, A.end - A.t0)); ctx.save();
    if (A.s === 'kslam' || A.s === 'kstomp'){ const R = (S.r || (A.s === 'kslam' ? 1.3 : 0.95)) * ts, cx = ox + (A.px != null ? A.px : t.x) * ts, cy = oy + (A.py != null ? A.py : t.y) * ts;
      ctx.fillStyle = `rgba(${col},${(0.12 + 0.18 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill(); ctx.fillStyle = `rgba(${col},${(0.22 + 0.3 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(cx, cy, R * q, 0, 6.283); ctx.fill(); ctx.strokeStyle = `rgba(${col},.85)`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke(); }
    else if (Z.k === 'fan'){ const a0 = Z.ang - Z.arc, a1 = Z.ang + Z.arc, fan = r => { ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, r, a0, a1); ctx.closePath(); };
      ctx.fillStyle = `rgba(${col},${(0.1 + 0.18 * q).toFixed(2)})`; fan(Z.R * ts); ctx.fill(); ctx.fillStyle = `rgba(${col},${(0.22 + 0.3 * q).toFixed(2)})`; fan(Z.R * ts * q); ctx.fill(); ctx.strokeStyle = `rgba(${col},.85)`; ctx.lineWidth = 2; fan(Z.R * ts); ctx.stroke(); }
    else if (Z.k === 'line'){ const w = Z.w * 2 * ts, L0 = Z.len * ts; ctx.translate(px, py); ctx.rotate(Z.ang); ctx.fillStyle = `rgba(${col},${(0.1 + 0.18 * q).toFixed(2)})`; ctx.fillRect(0, -w / 2, L0, w); ctx.fillStyle = `rgba(${col},${(0.22 + 0.3 * q).toFixed(2)})`; ctx.fillRect(0, -w / 2, L0 * q, w); ctx.strokeStyle = `rgba(${col},.85)`; ctx.lineWidth = 2; ctx.strokeRect(0, -w / 2, L0, w); }
    else { const tx = ox + t.x * ts, ty = oy + t.y * ts; ctx.strokeStyle = `rgba(${col},.9)`; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tx, ty); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.arc(tx, ty, t.r * ts + 4 + 4 * q, 0, 6.283); ctx.stroke(); }
    ctx.restore(); ctx.save(); ctx.font = '700 12px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = u.side ? '#ffb4a8' : '#d9c8ff'; ctx.fillText((SPEC_IC[A.s] || '') + ' ' + SPEC_NM(A.s), px, py - u.r * ts - 8); ctx.restore(); }
}
// v8.7.4 3D 보스 기술표 예고:""")
rep("ctx.restore(); } }   /* v8.7.4 잡아찢기: 손 · 찢기까지 남은 고리 */",
    "ctx.restore(); }   /* v8.7.4 잡아찢기: 손 · 찢기까지 남은 고리 */\n"
    "      if (g && g.alive && A && A.k === 'spec' && A.s === 'kgrab' && A.held === u.i){ const gx = ox + g.x * ts, gy = oy + g.y * ts; ctx.save(); ctx.strokeStyle = 'rgba(230,200,255,.9)'; ctx.lineWidth = Math.max(3, r * 0.26); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.quadraticCurveTo((gx + px) / 2 + (py - gy) * 0.15, (gy + py) / 2 - (px - gx) * 0.15, px, py); ctx.stroke();\n"
    "        const t = '🤡 광대의 팔 — 끌려옴'; ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width, ly = py + r * 1.22 + 9; ctx.fillStyle = 'rgba(40,14,60,.9)'; ctx.fillRect(px - tw / 2 - 3, ly - 6, tw + 6, 13); ctx.fillStyle = '#e6d2ff'; ctx.fillText(t, px, ly + 0.5); ctx.restore(); }   /* v8.7.8 카리우스 잡아뚫기 */ }")
rep("ctx.fillText('경례', px, py - r - 3); ctx.restore(); } }",
    "ctx.fillText('경례', px, py - r - 3); ctx.restore(); }\n"
    "    if (u.ls){ const G = (Wd.rules.karius || {}).grit || {}, L0 = u.ls, last = L0.ph === 'last', left = last ? Math.max(0, L0.t2 + (G.last || 7) - Wd.t) : L0.ph === 'agony' ? Math.max(0, L0.t0 + (G.agony || 3) - Wd.t) : 0; ctx.save();   /* v8.7.8 근성: 발버둥 (흐릿) · 포효 · 마지막 7초 (붉은 기운 · 남은 초) */\n"
    "      ctx.strokeStyle = last ? `rgba(255,90,50,${(0.55 + 0.35 * Math.sin(Wd.t * 9)).toFixed(2)})` : 'rgba(200,200,210,.55)'; ctx.lineWidth = last ? 4 : 2; ctx.setLineDash(last ? [] : [3, 4]); ctx.beginPath(); ctx.arc(px, py, r + 6, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);\n"
    "      const t = last ? `🔥 근성 ${Math.ceil(left)}초 · 슈퍼아머` : L0.ph === 'roar' ? '🔥 우어어어어!' : `근성 — 발버둥 (무적 ${Math.ceil(left)}초)`; ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width, ly = py - r - 14; ctx.fillStyle = 'rgba(60,10,6,.9)'; ctx.fillRect(px - tw / 2 - 3, ly - 6, tw + 6, 13); ctx.fillStyle = last ? '#ffb090' : '#e0d8d0'; ctx.fillText(t, px, ly + 0.5); ctx.restore(); }\n"
    "    else if (u.heretic){ ctx.save(); ctx.fillStyle = 'rgba(10,8,14,.35)'; ctx.beginPath(); ctx.arc(px, py, r * 0.92, 0, 6.283); ctx.fill(); ctx.fillStyle = 'rgba(255,246,190,.95)'; for (const s0 of [-1, 1]){ ctx.beginPath(); ctx.arc(px + s0 * r * 0.28, py - r * 0.18, Math.max(2, r * 0.13), 0, 6.283); ctx.fill(); }\n"
    "      ctx.font = '700 9.5px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = '#fff1b0'; ctx.fillText('불경자', px, py - r - 4); ctx.restore(); }   /* v8.7.8 불경자: 새까만 얼굴 · 빛나는 안경 */\n"
    "    if (u.rageOn && Wd.t < u.rageT){ ctx.save(); ctx.fillStyle = 'rgba(80,80,90,.35)'; for (let k = 0; k < 3; k++){ const a = Wd.t * 1.3 + k * 2.1; ctx.beginPath(); ctx.arc(px + Math.cos(a) * r * 0.8, py - r * 0.9 - ((Wd.t * 0.8 + k * 0.33) % 1) * r, r * 0.35, 0, 6.283); ctx.fill(); } ctx.restore(); } }   /* v8.7.8 벼락 — 연기를 토함 */")
rep("    } else if (f.k === 'prRing' && age < 0.6){",
    "    } else if (f.k === 'kfan' && age < 0.45){   // v8.7.8 카리우스 노인의 팔 · 라이트 훅 — 후려친 부채꼴 자국 (보이는 카리우스만)\n"
    "      const a = Wd.units[f.a]; if (!a || a.side === 0 || $('seeAll').checked || a.seenBy){ const q = age / 0.45, p = { x: ox + f.x * ts, y: oy + f.y * ts }; ctx.strokeStyle = `rgba(${f.c === 'old' ? '230,200,255' : '255,230,200'},${(0.9 * (1 - q)).toFixed(2)})`; ctx.lineWidth = f.c === 'old' ? 6 : 3; ctx.beginPath(); ctx.arc(p.x, p.y, f.R * ts * (0.75 + 0.25 * q), f.ang - f.arc / 2, f.ang + f.arc / 2); ctx.stroke(); }\n"
    "    } else if (f.k === 'prRing' && age < 0.6){")

# ---------- 상세: 근성 · 불경자 · 어퐁 줄 ----------
rep("    ${!ed && known && u.alive && (u.porenKit || u.ratOf != null) ? `<span class=\"tr\"><span class=\"lb\">쥐 군단</span> ${esc(ratRow(Wd, u))}</span>` : ''}",
    "    ${!ed && known && u.alive && (u.porenKit || u.ratOf != null) ? `<span class=\"tr\"><span class=\"lb\">쥐 군단</span> ${esc(ratRow(Wd, u))}</span>` : ''}\n"
    "    ${!ed && known && u.alive && (u.grit || u.heretic0 || u.rageOn) ? `<span class=\"tr\" style=\"color:#ffb79a\"><span class=\"lb\">근성 · 불경자</span> ${esc(karRow(Wd, u))}</span>` : ''}\n"
    "    ${!ed && known && u.alive && specOf(u, 'asup') ? `<span class=\"tr\"><span class=\"lb\">초돌진</span> ${esc(apRow(Wd, u))}</span>` : ''}")
rep("const RAT_PLAIN = ['ratS', 'ratM', 'ratL'];   /* v8.7.8 이름 없는 쥐 */\n",
    "const RAT_PLAIN = ['ratS', 'ratM', 'ratL'];   /* v8.7.8 이름 없는 쥐 */\n"
    "// v8.7.8 카리우스 상세 줄: 근성 (남음 · 차례 · 다함) · 불경자 (켜짐 — 몇 % 에서 풀림 / 꺼짐 — 몇 % 에서) · 벼락 (남은 초)\n"
    "function karRow(Wd, u){ const K = Wd.rules.karius || {}, G = K.grit || {}, H = K.heretic || {}, L0 = u.ls, o = [];\n"
    "  if (u.grit) o.push(L0 ? (L0.ph === 'last' ? `근성 마지막 ${Math.ceil(Math.max(0, L0.t2 + (G.last || 7) - Wd.t))}초 (공격 속도 × ${G.spd || 1.5} · 모든 공격 치명 · 슈퍼아머)` : L0.ph === 'roar' ? '근성 — 포효' : '근성 — 발버둥 (무적)') : u.lsEnd ? '근성 다함 (이 판)' : '근성 남음 (체력 0 이면 7초 버팀)');\n"
    "  if (u.heretic0) o.push(u.heretic ? `불경자 (공격 × ${H.atk || 2.5} · 받는 피해 × ${H.def || 0.33} · 막지 않음 — 체력 ${Math.round((H.off || 0.5) * 100)}% 넘으면 풀림)` : `불경자 아님 (체력 ${Math.round((H.at || 0.15) * 100)}% 아래에서)`);\n"
    "  if (u.rageOn && Wd.t < u.rageT) o.push(`벼락 — 차갑게 미쳐 감 ${Math.ceil(u.rageT - Wd.t)}초 (공격 × ${(K.rage || {}).atk || 1.3})`);\n"
    "  return o.join(' · '); }\n"
    "function apRow(Wd, u){ const S = SPR(Wd, 'asup'), x = specOf(u, 'asup'); return `${S.min || 5}칸 넘게 떨어진 적에게만 · 돌진 걸음 × ${S.spd || 1.8} · 길 둘레 ${(u.r + (S.w || 0.9)).toFixed(1)}칸을 휩쓺 · ${x && x.cdT > Wd.t ? '대기 ' + (x.cdT - Wd.t).toFixed(1) + '초' : '쓸 수 있음'}${u.buckler ? ' · 버클러 (막는 폭 ±' + u.gArc + '°)' : ''}`; }\n")

open(F, 'w', encoding='utf-8').write(s)
print('page8780c OK')
