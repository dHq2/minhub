# v8.7.8 페이지 (2) — page8780b.py v1.1 (v1.1: 구르기 · 베테랑 글을 명세 C5 대로 (3.6칸 넓게 · 1.4초 · 2.4칸 · 방어 자세 · 투창 좋음) · v1.0: 포렌 (명세 C5 — 2D 쥐 군단 · 3D 기억하는 쥐 기사 · 위키 민수 메모의 베테랑 기사) — 설계 · 도감 정체성 ([지휘S] [군주] ◆쥐들의 왕 + 예전 [높은후각] [반사신경]) ·
#   기술 글 · 기록 · 서술 · 그림 (표식 고리 · 방진 둘레 · 쥐 방패 · 포박 게이지 · 쥐 망토 · 기사 이름표) · 상세 '쥐 군단' 줄 · 아이콘 판 8 × 8 (46 ◆쥐들의 왕 · 47 쥐 표식 · 48 쥐 포박 · 49 구르기 — ico878/mkico_b.py) ·
#   쥐는 포렌의 기술로만 (고르기 · 칩 · 명단 · 모두 고르기 · 숫자키 · 동시 선택 · 물건 줍기 · 카메라 · 두고 가기 · 관중 셈에서 빠짐 — 쥐를 탭하면 그 자리 바닥으로) · 엔진의 쥐 부르기 (engineSpawn — S.units 와 판을 맞춤) ·
#   지난 판의 소환은 처음으로 · 불러오기에서도 빠짐 (슬라임도) · 토끼마차 패배에 소환이 쓰러진 이로 적히던 것 · 동작 이름 (굿윌 순간이동 · 포렌 방진 · 사다리 · 지휘 · 구르기 — '공격 뒤 회복' 으로 적히던 것) ·
#   기술 실패 서술은 기술마다 (전엔 늘 '뛰려다 멈춘다') · 기술 칸 그림 (굿윌 니킥 · 내려찍기도 — 전엔 ★) · 사선 · 방패 대치 예제의 포렌은 포렌의 대검
import subprocess, shutil
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8780.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep("뽑기 희귀도: 도감 별이 높을수록 드묾.\n     v8.7.7: ", """뽑기 희귀도: 도감 별이 높을수록 드묾.
         포렌 (명세 C5 — 2D 쥐 군단 · 3D 기억하는 쥐 기사 · 뽑기에서만 · 5성 · [지휘S] [군주] ◆쥐들의 왕 + [높은후각] [반사신경]): 충성 (게이지가 차면 쥐가 뒤쪽에서 달려옴 — 작은 쥐 · 쥐 · 큰 쥐 · 쥐 기사 ·
         최대 24) · 쥐 표식 (물어라! — 모든 쥐가 몰려듦) · 방벽 (동료에게 강공이 오면 쥐가 대신 맞음) · 쥐 망토 (곁의 쥐마다 받는 피해 −3.5%) · 쥐 방진 (대검을 꽂고 버팀 — 쥐가 70% 를 나눠 받음 ·
         끝에 회전 반격) · 쥐 방패 (위험한 동료 앞을 쥐가 온몸으로) · 쥐 사다리 · 쥐 포박 · 도발 · 대검 베기. 쥐는 포렌의 기술로만 움직임 (명령 · 고르기에서 빠짐 — 쥐를 탭하면 그 자리 바닥으로).
         쥐 기사 (3D): 이름 A, B … · 살아 돌아오면 단계 +1 (최대 4) · 세 번 돌아오면 쥐 베테랑 (체력 300 · 대방패 · 구르기 — 진형을 무너뜨림 · 투창 뒤 검 · 포렌이 쓰러지면 쥐들을 이끎) ·
         싸움이 끝나면 경례하고 사라짐 · 쓰러지면 잊힘. 쥐의 무구는 전리품이 되지 않음. 아이콘 판 64칸.
     v8.7.7: """)
rep('의 버전 기록에 — v8.7.8 굿윌 · 감전 한 틀 / v8.7.7 유물 34 · 노먼 전직', '의 버전 기록에 — v8.7.8 굿윌 · 포렌 (쥐 군단) · 감전 한 틀 / v8.7.7 유물 34 · 노먼 전직')
rep('">v8.7.8 · 굿윌 · 감전 한 틀</span>', '">v8.7.8 · 굿윌 · 포렌 · 감전 한 틀</span>')

# ---------- 포렌: 설계 (뽑기에서만 — 명세 C5) ----------
PR_TR = "['지휘S', '군주', '높은후각', '반사신경']"
PR_ACT = "['쥐 표식', '쥐 방진', '쥐 방패', '쥐 사다리', '쥐 포박']"
PR_NOTE = ("쥐 군단 (◆쥐들의 왕): 게이지가 차면 쥐가 뒤쪽에서 달려옴 (최대 24) · 쥐는 포렌의 기술로만 움직임. 기술 칸 1 = 쥐 표식 (적을 탭) · 2 = 쥐 방진 (바로) — 쥐 방패 · 사다리 · 포박은 스스로. "
           "냄새로 맡은 적의 대략적인 방향 · 거리를 2초마다 동료에게 알림 · 반사신경으로 바라보는 좁은 방향을 믿을 만하게 막음 (대검이면 넓어짐)")
PR_DES = ("  { key: '포렌', side: 0, ref: 'C-006', name: '포렌', tier: 2, cls: '지휘', role: '전선', weapon: '포렌의 대검', shield: false, sm: 0.78, height: 1.4, weight: 140, nv: true, nvG: 'B', noChg: true, "
          f"ov: {{ hp: 532, atk: 46 }}, traits: {PR_TR}, gear: {{ 몸: {{ name: '포렌의 중갑', mat: '판금', tier: 3 }} }}, unique: ['쥐들의 왕'], active: {PR_ACT}, "
          f"tactic: '쥐 군단 · 일점 방어 · 브리핑', note: '{PR_NOTE}' }},   /* v8.7.8 포렌 (명세 C5 · 2D 그대로 — 체력 380 → 532 (탱커 × 1.4) · 공격 28 → 46 (굿윌 · 모닝스타를 옮길 때와 같은 비) · 투구 없는 중장 · 포렌의 대검 (위키 민수 메모)) */\n")
n0 = s.index("  { key: '굿윌', side: 0, ref: 'C-010'")
n1 = s.index('\n', n0) + 1
s = s[:n1] + PR_DES + s[n1:]
rep("  'C-006': { role: '전선', traits: ['높은후각', '반사신경'], tactic: '브리핑 · 일점 방어', note: '냄새로 맡은 적의 대략적인 방향 · 거리를 2초마다 동료에게 알림. 반사신경으로 바라보는 좁은 방향을 믿을 만하게 막음 (대검이면 넓어짐)' },",
    f"  'C-006': {{ cls: '지휘', role: '전선', weapon: '포렌의 대검', shield: false, sm: 0.78, height: 1.4, weight: 140, unique: ['쥐들의 왕'], active: {PR_ACT}, traits: {PR_TR}, ov: {{ hp: 532, atk: 46 }}, noChg: true, allyNv: 'B', "
    f"gear: {{ 몸: {{ name: '포렌의 중갑', mat: '판금', tier: 3 }} }}, tactic: '쥐 군단 · 일점 방어 · 브리핑', note: '{PR_NOTE}' }},   // v8.7.8 포렌 (도감 [지휘S] [군주] ◆쥐들의 왕 · 예전 [높은후각] [반사신경] 그대로)")
rep("  'C-006': { traits: ['높은후각', '반사신경'] }, ", f"  'C-006': {{ traits: {PR_TR}, unique: ['쥐들의 왕'], active: {PR_ACT} }}, ")
rep("put('C-006', 0, 'g3', { nv: false, weapon: '대검' })", "put('C-006', 0, 'g3', { nv: false, weapon: '포렌의 대검' })", 2)   # v8.7.8 포렌의 기본 무기
rep('포렌 g3 (대검)', '포렌 g3 (포렌의 대검 · 쥐 군단)', 3)
rep('포렌 g3 (대검, 반사신경 · 후각 A)', '포렌 g3 (포렌의 대검 · 쥐 군단 · 반사신경 · 후각 A)')
rep("  '군주': '무리의 왕 — 세르파: 작은 슬라임을 계속 뽑아 곁에 두고, 넷을 모아 굴란 · 몽 · 핀 · 튤린으로 합침 · 수정 우박',",
    "  '군주': '무리의 왕 — 세르파: 작은 슬라임을 계속 뽑아 곁에 두고, 넷을 모아 굴란 · 몽 · 핀 · 튤린으로 합침 · 수정 우박 / 포렌: 쥐 군단 (◆쥐들의 왕 — 충성 · 쥐 기술 다섯 · 기억하는 쥐 기사)',   /* v8.7.8 */")

# ---------- 기술 · 고유 글 ----------
rep("const ACTIVE = {\n", """const ACTIVE = {
  '쥐 표식': '포렌 (2D) — 포렌이 치려는 적에게 쥐 표식 ("물어라!"): 어디선가 쥐 셋이 더 튀어나오고 (첫째는 30% 로 쥐 기사) 5초 동안 모든 쥐가 우르르 몰려들어 둘러싸고 물어뜯음 (새로 온 쥐도 합류). 쥐가 하나는 있어야 · 대기 12초. 명령: 기술 칸 1 → 적을 탭 (9칸)',
  '쥐 방진': '포렌 — 체력 40% 아래 · 강공 (보스 · 공격 30 넘음) 이 날아오면 대검을 땅에 꽂고 2.5초 버팀 (움직이지 않음 · 휘청 · 밀림 없음). 곁의 쥐 (최대 8) 가 둘레에 붙어 받는 피해 70% 를 똑같이 나눠 받음. 끝에 대검을 뽑으며 두 바퀴 — 공격 + 쥐가 대신 맞은 피해 60% + 버틴 무게 (포렌 × 4 + 둘레 쥐) × 0.164 · 치명 25%. 곁에 적이 없으면 방진 쥐 셋을 타고 가장 위험한 적 (8칸) 에게 날아가 거기서 휘두름. 곁에 쥐가 둘은 있어야 · 대기 14초. 명령: 기술 칸 2 (바로 — 제자리)',
  '쥐 방패': '포렌 — 동료가 위험하면 (체력 45% 아래 · 3칸 안에 적) 또는 포렌이 위험하면 (50% · 2칸): 포렌이 뒤로 뛰어 빠져 6초 지휘 (0.5초 넘는 큰 휘청이면 끊김) · 쥐 (최대 12) 가 적과 지킬 이 사이에 한 줄 (일곱부터 두 줄) 로 서서 온몸으로 막음 — 치지 않고 막기도 아님 · 맞은 충격은 곁의 구성원이 똑같이 나눠 받음. 대기 16초 (스스로)',
  '쥐 사다리': '포렌 — 2.5 ~ 8칸 떨어진 적에게: 쥐 셋이 발밑에 모이고 (0.4초) 포렌이 그 위에 올라타 파도처럼 미끄러져 들어가 (7칸/초) 내려찍음 (1.3칸 · 공격 × 1.5 · 휘청 0.5초 — 아주 무거운 상대는 버팀). 대기 7초 (스스로)',
  '쥐 포박': '포렌 — 4.5칸 안에서 가장 위험한 (공격이 가장 센) 적에게 쥐 다섯이 달려들어 주렁주렁 매달림: 매달린 쥐 하나마다 포박 게이지 +22 (최대 100) · 게이지가 남은 동안 움직이지도 치지도 못함. 대상은 버둥거려 깎음 (무거울수록 빨리 · 보스는 2.5배) · 최대 3초 (3D). 쥐 셋 이상 · 대기 12초 (스스로)',
  '구르기': '쥐 베테랑 (명세 C5 · 도감: 진형을 붕괴시키는 구르기) — 앞구르기: 1.6 ~ 4.6칸의 적에게 3.6칸을 넓게 굴러 들어가 닿는 몸을 모두 넘어뜨림 (중대형까지 1.4초 · 대형 · 초대형은 밀기만 · 공격 × 0.5 들이받음). 뒷구르기: 나를 노린 근접 일격이 준비 중이면 60% 로 2.4칸 뒤로 빠짐. 구르는 동안 받는 피해 × 0.6 · 급소 보호. 대기 6초',
""")
rep("const UNIQUE = {\n", """const UNIQUE = {
  '쥐들의 왕': { who: 'C-006',   // v8.7.8 포렌 (도감 ★쥐들의 왕 · 2D 쥐 군단 · 3D 기억하는 쥐 기사)
    lore: ['굴에 적응할 수밖에 없었던 낙오자 중 한 명. 결국 대성했다. 포렌의 카리스마에 쥐 계열 종족이 저절로 이끌려 형성된 세력에 가깝고, 쥐 계열 종족의 절대적인 지지와 충성을 받는다.', '수인종 · 짐승을 포함한 쥐 계열은 모두 충성 — 포렌의 모든 쥐 관련 파생 스킬이 여기서 나온다.', '포렌의 쥐들은 하나의 별개 팩션으로, 굴 안에서 암암리에 국가처럼 세력을 이룬다. 5성의 기준 — 그녀 자체가 쥐의 신이라 불릴 정도.'],
    effects: ['충성: 게이지가 차면 쥐가 포렌 뒤쪽에서 달려옴 (다음 쥐는 미리 정해짐 — 작은 쥐 58% 0.8초 · 쥐 27% 3초 · 큰 쥐 13% 8초 · 쥐 기사 2% 8초) · 쥐가 넷보다 적으면 2.5배 빨리 · 싸움이 없으면 넷까지만 천천히 · 최대 24 · 싸움을 시작하면 곁에 넷 (3D — 반은 쥐 기사부터)',
      '쥐는 포렌의 기술로만 움직임 (다른 이의 명령 · 고르기는 받지 않음): 따르는 쥐 70% (포렌 곁 · 포렌이 노린 적) · 떠돌이 30% (둘레를 싸돌아다니며 마주친 적) · 갑자기 뒤로 쌩 도망갔다 돌아옴',
      '방벽: 동료에게 강공 (보스 · 공격 30 넘음) 이 오면 가까운 쥐 2 ~ 4마리가 그 앞에 3초 줄을 섬 — 사이에 선 쥐가 근접 일격을 대신 맞음 (대기 6초)',
      '쥐 망토: 곁 1.6칸의 쥐 하나마다 받는 피해 −3.5% (최대 −16%)',
      '쥐들의 대왕 (2D): 도발 — 3칸 안의 적은 포렌을 먼저 노림 (보스 빼고) · 대검 베기 — 앞의 다른 적 하나까지 60%',
      '기억하는 쥐 기사 (3D): 이름 A, B … · 살아 돌아올 때마다 단계 +1 (최대 4 · 체력 +15% · 공격 +10% 씩) · 세 번 돌아오면 쥐 베테랑 (4성 · 체력 300 · 대방패 · 방어 자세 좋음 · 구르기 · 투창 좋음 — 던진 뒤엔 검 · 포렌이 쓰러지면 쥐들을 이끎) · 싸움이 끝나면 경례하고 사라짐 · 쓰러지면 잊힘',
      '포렌이 맵을 나가면 쥐도 함께 · 편에 쥐만 남으면 흩어짐 · 쥐의 무구는 쓰러져도 전리품이 되지 않음'],
    derived: [], limits: [], flags: {} },
""")

# ---------- 아이콘 판 8 × 8 (46 ~ 49 새 그림) · 기술 칸 그림 ----------
rep('const ICO = {"cols": 8, "rows": 6, "map": {', 'const ICO = {"cols": 8, "rows": 8, "map": {')
rep('background-size:calc(var(--s) * 8) calc(var(--s) * 6)', 'background-size:calc(var(--s) * 8) calc(var(--s) * 8)')
rep('"근력": 43, "손바닥": 5', '"근력": 43, "쥐들의 왕": 46, "쥐 표식": 47, "쥐 포박": 48, "구르기": 49, "쥐 방진": 26, "쥐 방패": 8, "쥐 사다리": 3, "군주": 16, "손바닥": 5')   # v8.7.8 포렌
shutil.copy(D + 'ico878/icons_v878b.webp', D + 'build/icons.webp')   # v1.0 아이콘 판 8 × 8 (mkico_b.py)
rep("const SPEC_IC = { flip: '🤸', head: '🔨', pb: '💥', sweep: '🌀', hurl: '☄', ward: '🛡', root: '🌱' };",
    "const SPEC_IC = { flip: '🤸', head: '🔨', pb: '💥', sweep: '🌀', hurl: '☄', ward: '🛡', root: '🌱', knee: '🦵', gslam: '👊', gpalm: '✋', snap: '⚡', snap3: '⚡', rise: '🦶', pmark: '🐀', pfort: '🗡', pshield: '🛡', pladder: '🌊', pbind: '🪢' };   /* v8.7.8 굿윌 · 포렌 (전엔 ★) */")
rep("const SPEC_TGT = { ", "const SPEC_TGT = { pmark: '🐀 쥐 표식: 적을 탭 (9칸 — 모든 쥐가 몰려듦)', ")
rep("    if (sp.k === 'ward'){ D.forEach(u => { u.order = { k: 'spec', s: sp.k }; }); noteOrders(D); toast(`${D.map(u => u.name).join(' · ')}: ${sp.k === 'ward' ? '역장 — 둘레 1.6칸의 상대 탄 세 발을 막음 (6초)' : '철퇴 후리기 — 둘레를 한 바퀴 (동료도 맞을 수 있어요)'}`); hud(); return; }",
    "    if (sp.k === 'ward' || sp.k === 'pfort'){ D.forEach(u => { u.order = { k: 'spec', s: sp.k }; }); noteOrders(D); toast(`${D.map(u => u.name).join(' · ')}: ${sp.k === 'ward' ? '역장 — 둘레 1.6칸의 상대 탄 세 발을 막음 (6초)' : sp.k === 'pfort' ? '쥐 방진 — 대검을 꽂고 2.5초 버팀 · 둘레 쥐가 70% 를 나눠 받음 (곁에 쥐 둘 이상)' : '철퇴 후리기 — 둘레를 한 바퀴 (동료도 맞을 수 있어요)'}`); hud(); return; }   /* v8.7.8 쥐 방진 (제자리 — 바로) */")

# ---------- 동작 이름 (공격 뒤 회복으로 적히던 것) ----------
rep("  if (a.k === 'dodge') return '몸을 빼 피함';",
    "  if (a.k === 'dodge') return '몸을 빼 피함';\n"
    "  if (a.k === 'gwHop') return '⚡ 순간이동';   /* v8.7.8 굿윌 */\n"
    "  if (a.k === 'pr') return a.s === 'fort' ? `🗡 쥐 방진 — 대검을 꽂고 버팀 (${f2(a.left)}초)` : a.s === 'ladder' ? '🌊 쥐 사다리 — 쥐를 타고 미끄러져 들어감' : '🛡 쥐 방패 — 뒤에서 지휘';   /* v8.7.8 포렌 */\n"
    "  if (a.k === 'roll') return a.dir === 'back' ? '뒷구르기' : '앞구르기 — 굴러 들어감';   /* v8.7.8 쥐 베테랑 */")

# ---------- 기록 (글) ----------
RAT_NM = "{ ratS: '작은 쥐', ratM: '쥐', ratL: '큰 쥐', ratKnight: '쥐 기사', ratVet: '쥐 베테랑' }"
rep("      case 'zap': out.push(", (
    "      case 'ratCome': out.push(`${T(e)}🐀 ${n(e.a)}의 충성 — ${e.n ? (e.vet ? '쥐 베테랑 ' + e.n + ' (기억함 ★)' : '쥐 기사 ' + e.n + ' (' + e.lv + '단계 · 돌아온 ' + e.ret + '번)') : (" + RAT_NM + ")[e.kind] || '쥐'} 달려옴`); break;   // v8.7.8 포렌\n"
    "      case 'prMark': out.push(`${T(e)}🐀 ${n(e.a)}: \"물어라!\" — ${n(e.b)}에게 쥐 표식 (쥐 ${e.n}마리 몰려듦${e.why ? ' · ' + e.why : ''})`); break;\n"
    "      case 'ratWall': out.push(`${T(e)}🐀 방벽 — 쥐 ${e.n}마리가 ${n(e.b)} 앞에 줄을 섬 (${n(e.c)}의 강공)`); break;\n"
    "      case 'prFort': out.push(`${T(e)}🗡 ${n(e.a)} 쥐 방진 — 대검을 꽂고 버팀 (쥐 ${e.n}마리가 나눠 받음${e.why ? ' · ' + e.why : ''})`); break;\n"
    "      case 'prSpin': out.push(`${T(e)}🗡 ${n(e.a)} 대검 회전 — ${e.n}명 (×${e.mul} · 대신 맞은 ${e.abs} · 버틴 무게 ${e.w}${e.crit ? ' · 치명' : ''}${e.dead ? ' · 쓰러진 쥐 ' + e.dead : ''})`); break;\n"
    "      case 'prLadder': out.push(`${T(e)}🌊 ${n(e.a)} 쥐 사다리 → ${n(e.b)}${e.counter ? ' (방진의 반격 — 쥐를 타고 날아감)' : ''}`); break;\n"
    "      case 'prSlam': out.push(`${T(e)}🌊 ${n(e.a)} 내려찍음 — ${e.n}명`); break;\n"
    "      case 'prShield': out.push(`${T(e)}🛡 ${n(e.a)} 쥐 방패 — 쥐 ${e.n}마리가 ${e.a === e.b ? '포렌' : n(e.b)} 앞을 막음 (포렌은 뒤에서 지휘)`); break;\n"
    "      case 'prShieldEnd': out.push(`${T(e)}🛡 ${n(e.a)} 쥐 방패 끝${e.why ? ' — ' + e.why : ''}`); break;\n"
    "      case 'prBind': out.push(`${T(e)}🪢 ${n(e.a)} 쥐 포박 → ${n(e.b)}`); break;\n"
    "      case 'prUnbind': out.push(`${T(e)}🪢 ${n(e.a)} 뿌리침 — 쥐 ${e.n}마리 (${e.el}초 묶임)`); break;\n"
    "      case 'ratLost': out.push(`${T(e)}🐀 ${n(e.a)} 쓰러짐 — 기억에서 빠짐`); break;\n"
    "      case 'ratVet': out.push(`${T(e)}★ 쥐 기사 ${e.n} — 세 번 살아 돌아옴 · 쥐 베테랑이 됨`); break;\n"
    "      case 'ratSalute': out.push(`${T(e)}🐀 싸움 끝 — 쥐 기사 경례 (${e.ns}) · 곧 사라짐`); break;\n"
    "      case 'ratScatter': out.push(`${T(e)}🐀 쥐 ${e.n || 1}마리 ${e.why || '흩어짐'}`); break;\n"
    "      case 'ratRoll': out.push(`${T(e)}🌀 ${n(e.a)} ${e.dir === 'back' ? '뒷구르기' : '앞구르기'}${e.b != null ? ' — ' + n(e.b) : ''}`); break;\n"
    "      case 'ratRollHit': out.push(`${T(e)}🌀 ${n(e.a)} 구르기 — ${e.n}명 들이받음`); break;\n"
    "      case 'ratVetCmd': out.push(`${T(e)}🐀 ${n(e.a)}: 포렌 대신 표식 → ${n(e.b)} (쥐 ${e.n}마리)`); break;\n"
    "      case 'zap': out.push("))

# ---------- 서술 ----------
rep("    case 'specFail': return { c: 'bad', s: `${ga(n(e.a))} 뛰려다 멈춘다 — 내려앉을 자리가 막혔다.` };",
    "    case 'specFail': return e.s === 'pfort' ? { c: 'dim', s: `${ga(n(e.a))} 대검을 꽂으려다 멈춘다 — 곁에 쥐가 모자라다.` } : e.s === 'flip' || !e.s ? { c: 'bad', s: `${ga(n(e.a))} 뛰려다 멈춘다 — 내려앉을 자리가 막혔다.` } : { c: 'dim', s: `${ga(n(e.a))} ${reul(SPEC_NM(e.s))} 못 한다 — ${e.why || '막혔다'}.` };   /* v8.7.8 기술마다 */")
rep("    case 'gslamHit': if (!e.n) return null;",
    "    case 'prMark': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${n(e.a)}: \"물어라!\" — 쥐들이 우르르 ${n(e.b)}에게 몰려든다!` };   // v8.7.8 포렌\n"
    "    case 'prFort': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 대검을 땅에 꽂는다 — 쥐 ${e.n}마리가 둘레에 붙어 함께 버틴다.` };\n"
    "    case 'prSpin': if (!(e.vis || U(e.a).side === 0) || !e.n) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 대검을 뽑으며 두 바퀴 — 쥐들이 버틴 무게까지 실려 ${e.n}명을 휩쓴다!${e.crit ? ' (치명)' : ''}` };\n"
    "    case 'prShield': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 뒤로 뛰어 빠진다 — 쥐 ${e.n}마리가 ${e.a === e.b ? '포렌' : n(e.b)} 앞에 줄지어 온몸으로 막는다.` };\n"
    "    case 'prBind': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `쥐 다섯이 ${n(e.b)}에게 달려들어 주렁주렁 매달린다 — 꼼짝 못 한다!` };\n"
    "    case 'ratVet': return { c: 'good', s: `★ 쥐 기사 ${e.n} — 세 번째로 살아 돌아왔다. 이제 쥐 베테랑이다.` };\n"
    "    case 'ratSalute': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'dim' : 'good', s: `🐀 싸움이 끝났다 — 쥐 기사들이 ${n(e.a)}에게 경례하고 사라진다. (${e.ns})` };\n"
    "    case 'ratLost': return U(e.a).side === 0 ? { c: 'bad', s: `${ga(n(e.a))} 쓰러졌다 — 포렌은 이 기사를 기억하지만, 다시 오지는 않는다.` } : null;\n"
    "    case 'ratVetCmd': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 창끝으로 ${reul(n(e.b))} 가리킨다 — 쥐들이 베테랑을 따라 몰려든다!` };\n"
    "    case 'ratRoll': if (e.dir !== 'fwd' || !(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 몸을 말아 굴러 들어간다 — 진형이 무너진다!` };\n"
    "    case 'gslamHit': if (!e.n) return null;")
# 이름 없는 쥐 (작은 쥐 · 쥐 · 큰 쥐) 의 일은 서술하지 않음 — 쥐 군단 사건 · 쥐가 큰 적을 쓰러뜨린 일만
rep("function narrOf(Wd, e){\n  if (narrQuiet(Wd, e)) return null;",
    "const RAT_PLAIN = ['ratS', 'ratM', 'ratL'];   /* v8.7.8 이름 없는 쥐 */\n"
    "const ratPlain = (Wd, i) => { const u = i != null ? Wd.units[i] : null; return !!(u && u.ratOf != null && RAT_PLAIN.includes(u.ratKind)); };\n"
    "function narrOf(Wd, e){\n  if (narrQuiet(Wd, e)) return null;\n"
    "  if (!/^(rat|pr)/.test(e.k) && (ratPlain(Wd, e.b) || (ratPlain(Wd, e.a) && !(e.k === 'die' && e.b != null && !ratPlain(Wd, e.b))))) return null;   /* v8.7.8 쥐 떼의 자잘한 일 */")

# ---------- 엔진의 쥐 부르기: S.units 와 판을 맞춤 (판의 유닛 i = S.units[i]) ----------
rep("function save(){ try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {} }",
    "function save(){ try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {} }\n"
    "// v8.7.8 엔진이 판 도중에 부르는 소환 (포렌의 쥐): 이 화면의 판이면 S.units 에도 넣어 순서를 맞춤 (판의 유닛 i = S.units[i]) · 다른 판 (자동 한 판 · 미리보기) 은 판에만\n"
    "function engineSpawn(W, p){ if (W === world){ p.id = p.id || uid(); S.units.push(p); } return addUnit(W, p); }")
# ---------- 쥐는 포렌의 기술로만: 고르기 · 칩 · 명단 · 모두 고르기 · 숫자키 · 동시 선택 · 줍기 · 카메라 · 두고 가기 · 관중 셈에서 빠짐 ----------
RAT_HELP = """const RAT_TOAST = '🐀 포렌의 쥐는 포렌의 기술로만 움직여요 (고를 수 없음 — 아군을 고른 채 쥐를 탭하면 그 자리로 이동)';   /* v8.7.8 */
const RAT_KN = { ratS: '작은 쥐', ratM: '쥐', ratL: '큰 쥐', ratKnight: '쥐 기사', ratVet: '쥐 베테랑' }, RAT_RS = { idle: '쉼 · 따름', assault: '표식의 적을 물어뜯음', wall: '방벽 — 동료 앞', fort: '쥐 방진 — 대검 둘레', ladder: '쥐 사다리', bind: '매달림 (포박)', bindRun: '포박하러', shieldWall: '쥐 방패 — 온몸으로 막음' };
// 상세 '쥐 군단' 줄: 포렌 (쥐 수 · 망토 · 다음 쥐 게이지 · 기억하는 기사) · 쥐 (갈래 · 단계 · 지금 하는 일)
function ratRow(Wd, u){
  if (u.porenKit){ const R = Wd.units.filter(r => r.alive && !r.gone && r.ratOf === u.i), P = Wd.rules.poren || {}, C = P.cloak || {}, Q = u.prn;
    return `쥐 ${R.length}마리 (최대 ${P.cap || 24}${Q && Q.full ? ' · 가득' : ''})${u.cloakN ? ' · 쥐 망토 −' + Math.round(Math.min(C.max || 0.16, (C.per || 0.035) * u.cloakN) * 100) + '%' : ''}${Q && Q.loyal ? ' · 다음: ' + (RAT_KN[Q.loyal.next] || '쥐') + ' ' + f2(Q.loyal.t) + '/' + f2(Q.loyal.dur) + '초' : ''}${u.ratMem && u.ratMem.length ? ' · 기억하는 기사 ' + u.ratMem.map(x => x.n + (x.vet ? '★' : ' ' + x.lv + '단계')).join(', ') : ''}`; }
  const K = Wd.units[u.ratOf], x = u.ratRec;
  return `${RAT_KN[u.ratKind] || '쥐'} — ${K ? K.name : '포렌'}의 쥐 (포렌의 기술로만 움직임)${x ? ' · ' + (x.vet ? '베테랑' : x.lv + '단계') + ' · 돌아온 ' + (x.ret || 0) + '번' : ''}${u.ratWild ? ' · 떠돌이' : ''} · 지금: ${u.leaveT != null ? '경례' : RAT_RS[(u.rs || {}).k] || '쉼'}`;
}
// 명단 · 적 목록의 포렌 옆: 쥐 수 · 쥐 망토 (적이면 보이는 쥐만)
function ratBadge(Wd, u, foe){ if (!u.porenKit || mode === 'edit' || !u.alive) return ''; const see = $('seeAll').checked, C = (Wd.rules.poren || {}).cloak || {}, n = Wd.units.filter(r => r.alive && !r.gone && r.ratOf === u.i && (!foe || see || r.seenBy)).length;
  return n || u.cloakN ? ` <i class="stb" title="포렌의 쥐 (보이는) · 곁의 쥐 ${u.cloakN || 0} — 쥐 망토">🐀${n}${u.cloakN ? ' · −' + Math.round(Math.min(C.max || 0.16, (C.per || 0.035) * u.cloakN) * 100) + '%' : ''}</i>` : ''; }
"""
rep("const RAT_PLAIN = ['ratS', 'ratM', 'ratL'];   /* v8.7.8 이름 없는 쥐 */\n", RAT_HELP + "const RAT_PLAIN = ['ratS', 'ratM', 'ratL'];   /* v8.7.8 이름 없는 쥐 */\n")
rep("const selUnits = Wd => Wd ? [...sel].map(i => Wd.units[i]).filter(u => u && u.alive && u.side === 0) : [];",
    "const selUnits = Wd => Wd ? [...sel].map(i => Wd.units[i]).filter(u => u && u.alive && u.side === 0 && u.ratOf == null) : [];   /* v8.7.8 쥐는 빠짐 */")
rep("const allyNo = (Wd, u) => Wd.units.filter(a => a.side === 0).indexOf(u) + 1;",
    "const allyNo = (Wd, u) => Wd.units.filter(a => a.side === 0 && a.ratOf == null).indexOf(u) + 1;   /* v8.7.8 쥐는 번호 없음 */")
rep("function pickAlly(i, add){ if (add){",
    "function pickAlly(i, add){ { const U0 = world && world.units[i]; if (U0 && U0.ratOf != null){ toast(RAT_TOAST); return; } }   /* v8.7.8 */ if (add){")
rep("  if (u && u.side === 0){ if (sel.size === 1 && sel.has(u.i)){ clearSel(); return; } pickAlly(u.i, false); hud(); return; }",
    "  if (u && u.side === 0 && u.ratOf != null && !selUnits(world).length){ toast(RAT_TOAST); return; }   /* v8.7.8 쥐는 고를 수 없음 — 고른 이가 있으면 그 자리 바닥으로 */\n"
    "  if (u && u.side === 0 && u.ratOf == null){ if (sel.size === 1 && sel.has(u.i)){ clearSel(); return; } pickAlly(u.i, false); hud(); return; }")
rep("  if (u && u.side === 0){ pickAlly(u.i, add); hud(); return; }",
    "  if (u && u.side === 0 && u.ratOf != null && !selUnits(world).length){ toast(RAT_TOAST); return; }   /* v8.7.8 */\n"
    "  if (u && u.side === 0 && u.ratOf == null){ pickAlly(u.i, add); hud(); return; }")
rep("  if (k === 'all'){ sel = new Set(world.units.filter(u => u.side === 0 && u.alive).map(u => u.i)); hud(); return; }",
    "  if (k === 'all'){ sel = new Set(world.units.filter(u => u.side === 0 && u.alive && u.ratOf == null).map(u => u.i)); hud(); return; }")
rep("  if (k === 'all'){ if (!world) return; const A = world.units.filter(u => u.side === 0 && u.alive);",
    "  if (k === 'all'){ if (!world) return; const A = world.units.filter(u => u.side === 0 && u.alive && u.ratOf == null);")
rep("sel = new Set(world.units.filter(u => u.side === 0 && u.alive).map(u => u.i)); hud(); }",
    "sel = new Set(world.units.filter(u => u.side === 0 && u.alive && u.ratOf == null).map(u => u.i)); hud(); }")
rep("const al = world.units.filter(u => u.side === 0); const u = al[", "const al = world.units.filter(u => u.side === 0 && u.ratOf == null); const u = al[")
rep("    const inBox = world.units.filter(u => u.alive && u.side === 0 && u.x >= a.x - u.r",
    "    const inBox = world.units.filter(u => u.alive && u.side === 0 && u.ratOf == null && u.x >= a.x - u.r")
rep("  $('party').innerHTML = Wd.units.filter(u => u.side === 0).map(u => {",
    "  $('party').innerHTML = Wd.units.filter(u => u.side === 0 && u.ratOf == null).map(u => {   /* v8.7.8 쥐는 포렌 줄에 🐀 수로 */")
rep('<b class="no">${allyNo(Wd, u)}</b> ${esc(u.name)}<span class="tis">', '<b class="no">${allyNo(Wd, u)}</b> ${esc(u.name)}${ratBadge(Wd, u)}<span class="tis">')
rep("  const foes = Wd.units.filter(u => u.side !== 0), vis = foes.filter(u => u.alive && (ed || see || u.seenBy)), hid = foes.filter(u => u.alive && !(ed || see || u.seenBy)).length;",
    "  const foes = Wd.units.filter(u => u.side !== 0 && u.ratOf == null), vis = foes.filter(u => u.alive && (ed || see || u.seenBy)), hid = foes.filter(u => u.alive && !(ed || see || u.seenBy)).length;   /* v8.7.8 적 포렌의 쥐는 포렌 줄에 */")
rep("<span class=\"nm\">${!ed && !see && u.sil ? '실루엣 (누구인지 모름)' : esc(u.name)} <i>",
    "<span class=\"nm\">${!ed && !see && u.sil ? '실루엣 (누구인지 모름)' : esc(u.name)}${!ed && !(!see && u.sil) ? ratBadge(Wd, u, true) : ''} <i>")
rep("  const allies = Wd && !(S.mode === 'story' && !S.camp) ? Wd.units.filter(u => u.side === 0 && !(u.summon && (u.gone || u.summon === 'slime'))) : [];",
    "  const allies = Wd && !(S.mode === 'story' && !S.camp) ? Wd.units.filter(u => u.side === 0 && u.ratOf == null && !(u.summon && (u.gone || u.summon === 'slime'))) : [];   /* v8.7.8 쥐는 칩 없음 */")
rep("  const C = Wd.units.filter(u => u.side === 0 && u.alive && !u.gone && canTake(Wd, u,",
    "  const C = Wd.units.filter(u => u.side === 0 && u.alive && !u.gone && u.ratOf == null && canTake(Wd, u,")
rep("  S.openers = Wd.units.filter(u => u.side === 0 && u.pid != null).map(u => {", "  S.openers = Wd.units.filter(u => u.side === 0 && u.pid != null && !u.summon).map(u => {")
rep("  const L = selUnits(Wd), G = L.length ? L : Wd.units.filter(u => u.side === 0 && u.alive); if (!G.length) return;",
    "  const L = selUnits(Wd), G = L.length ? L : Wd.units.filter(u => u.side === 0 && u.alive && !u.summon); if (!G.length) return;   /* v8.7.8 쥐 떼를 따라가지 않음 */")
rep("const C = W.r8c || (W.r8c = { next: W.t + 6, a: W.units.filter(u => u.side === 0 && u.alive).length,",
    "const C = W.r8c || (W.r8c = { next: W.t + 6, a: W.units.filter(u => u.side === 0 && u.alive && !u.summon).length,")
rep("  const a = W.units.filter(u => u.side === 0 && u.alive).length, f = W.units.filter(u => u.side !== 0 && u.alive).length;",
    "  const a = W.units.filter(u => u.side === 0 && u.alive && !u.summon).length, f = W.units.filter(u => u.side !== 0 && u.alive && !u.summon).length;   /* v8.7.8 소환 (쥐 · 슬라임) 은 관중 셈에서 빠짐 */")
rep("if (p) C.fallen.push(p.name); }", "if (p && !u.summon) C.fallen.push(p.name); }   /* v8.7.8 소환은 쓰러진 이로 적지 않음 */")
rep("  if (b.dataset.cabandon){ const L = world.units.filter(u => u.side === 0 && u.alive); if (!L.length) return; askYes(`${reul(L.map(u => u.name).join(' · '))} 두고 갈까요?",
    "  if (b.dataset.cabandon){ const L = world.units.filter(u => u.side === 0 && u.alive), Ln = L.filter(u => !u.summon); if (!Ln.length) return; askYes(`${reul(Ln.map(u => u.name).join(' · '))} 두고 갈까요?")
rep("  const alive = world.units.filter(u => u.side === 0 && u.alive).length;", "  const alive = world.units.filter(u => u.side === 0 && u.alive && !u.summon).length;")
# 지난 판의 소환 (쥐 · 슬라임) 은 처음으로 · 불러오기에서도 빠짐
rep("function resetToEdit(){\n", "function resetToEdit(){\n  S.units = S.units.filter(p => !p.summon);   /* v8.7.8 지난 판의 소환 (쥐 · 슬라임) 은 배치에 남지 않음 */\n")
rep("let S = load() || example();", "let S = load() || example(); if (Array.isArray(S.units)) S.units = S.units.filter(p => !p.summon);   /* v8.7.8 싸우다 저장된 소환은 불러오지 않음 */")

# ---------- 그림: 쥐 (번호 대신 기사 이름) · 표식 고리 · 쥐 망토 · 방진 둘레 · 쥐 방패 · 포박 게이지 ----------
rep("    if (!ed && u.side === 0) badge(px - r - 3, py - r * 0.15, allyNo(Wd, u), 1);",
    "    if (!ed && u.side === 0 && u.ratOf == null) badge(px - r - 3, py - r * 0.15, allyNo(Wd, u), 1);\n"
    "    else if (!ed && u.ratRec && (u.side === 0 || see || u.seenBy)) badge(px - r - 3, py - r * 0.15, u.ratRec.n + (u.ratRec.vet ? '★' : ''), 1);   /* v8.7.8 기억하는 쥐 기사의 이름 */")
rep("    if (u.nv && (ed || u.side === 0)){", "    if (u.nv && (ed || u.side === 0) && u.ratOf == null){")
rep("  // 총성 '!': 쏜 자리에 noiseTime 동안 남음", """  // v8.7.8 포렌 · 쥐: 표식 고리 · 쥐 망토 · 방진 둘레 · 쥐 방패 · 방벽 · 포박 게이지 (보이는 몸만)
  if (!ed) for (const u of Wd.units){ if (!u.alive || hid0(u) || !(u.side === 0 || see || u.seenBy)) continue; const px = ox + u.x * ts, py = oy + u.y * ts, r = u.r * ts;
    if (u.ratMark && Wd.t < u.ratMark.until){ const t = Wd.units[u.ratMark.b]; if (t && t.alive && (t.side === 0 || see || t.seenBy)){ const tx = ox + t.x * ts, ty = oy + t.y * ts, q = (Wd.t * 2.5) % 1; ctx.save(); ctx.strokeStyle = u.side ? 'rgba(255,110,80,.9)' : 'rgba(120,240,160,.9)'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.arc(tx, ty, t.r * ts + 5 + q * 5, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); ctx.font = `${Math.max(10, ts * 0.32)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText('🐀', tx + t.r * ts + 8, ty - t.r * ts - 2); ctx.restore(); } }
    if (u.porenKit && u.cloakN > 0){ ctx.save(); ctx.strokeStyle = `rgba(90,230,140,${(0.2 + 0.1 * u.cloakN).toFixed(2)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, r + 5, 0, 6.283); ctx.stroke(); ctx.fillStyle = 'rgba(160,255,190,.9)'; for (let k = 0; k < u.cloakN; k++){ const a = Wd.t * 1.5 + k * 6.283 / u.cloakN; ctx.beginPath(); ctx.arc(px + Math.cos(a) * (r + 5), py + Math.sin(a) * (r + 5), 2.4, 0, 6.283); ctx.fill(); } ctx.restore(); }
    if (u.act && u.act.k === 'pr' && u.act.s === 'fort'){ const F = (Wd.rules.poren || {}).fort || {}; ctx.save(); ctx.strokeStyle = 'rgba(120,240,160,.75)'; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, (F.near || 1.6) * ts, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); ctx.font = `${Math.max(11, ts * 0.36)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🗡', px, py - r - 8); ctx.restore(); }
    if (u.rs && (u.rs.k === 'shieldWall' || u.rs.k === 'wall') && u.leaveT == null){ ctx.save(); ctx.globalAlpha = u.rs.k === 'shieldWall' ? 0.95 : 0.75; ctx.font = `${Math.max(8, ts * 0.24)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText('🛡', px, py - r - 2); ctx.restore(); }
    if (u.bound && u.bind){ const w = Math.max(18, r * 2 + 8), g = Math.max(0, Math.min(1, u.bind.gauge / 100)); ctx.save(); ctx.fillStyle = 'rgba(10,10,10,.75)'; ctx.fillRect(px - w / 2, py - r - 12, w, 5); ctx.fillStyle = '#7fe0a0'; ctx.fillRect(px - w / 2, py - r - 12, w * g, 5); ctx.font = `${Math.max(9, ts * 0.28)}px sans-serif`; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText('🪢', px - w / 2 - 2, py - r - 10); ctx.restore(); }
    if (u.leaveT != null){ ctx.save(); ctx.font = `${Math.max(9, ts * 0.26)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = '#ffd27a'; ctx.fillText('경례', px, py - r - 3); ctx.restore(); } }
  // 총성 '!': 쏜 자리에 noiseTime 동안 남음""")
rep("    } else if (f.k === 'quake' && age < 0.5){   // v8.7.8 내려찍기 — 둘레 고리\n",
    "    } else if (f.k === 'prRing' && age < 0.6){   // v8.7.8 포렌 쥐 방진 · 대검 회전 (보이는 포렌만)\n"
    "      const a = Wd.units[f.a]; if (!a || a.side === 0 || $('seeAll').checked || a.seenBy){ const q = age / 0.6, p = { x: ox + f.x * ts, y: oy + f.y * ts }; ctx.strokeStyle = `rgba(${f.c === 'm' ? '200,200,200' : '120,240,160'},${(0.85 * (1 - q)).toFixed(2)})`; ctx.lineWidth = f.spin ? 4 : 2.5; ctx.beginPath(); if (f.spin) ctx.arc(p.x, p.y, (f.r || 1.8) * ts, q * 12.6, q * 12.6 + 4.4); else ctx.arc(p.x, p.y, (f.r || 1.6) * ts * (0.4 + 0.6 * q), 0, 6.283); ctx.stroke(); }\n"
    "    } else if (f.k === 'ratmark' && age < 0.6){   // v8.7.8 쥐 표식을 새길 때 번쩍\n"
    "      const t = Wd.units[f.b]; if (t && (t.side === 0 || $('seeAll').checked || t.seenBy)){ const q = age / 0.6; ctx.strokeStyle = `rgba(255,140,100,${(0.9 * (1 - q)).toFixed(2)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ox + t.x * ts, oy + t.y * ts, t.r * ts + 4 + q * 18, 0, 6.283); ctx.stroke(); }\n"
    "    } else if (f.k === 'quake' && age < 0.5){   // v8.7.8 내려찍기 — 둘레 고리\n")
# 상세: 쥐 군단 줄
rep("    ${!ed && u.alive && (u.side === 0 || see) && u.lastDec && Wd.t - u.lastDec.t < 20 ? `<span class=\"tr\" style=\"color:#d8c8ff\"><span class=\"lb\">최근 판단</span> ${esc(u.lastDec.s)} · ${Math.round(Wd.t - u.lastDec.t)}초 전</span>` : ''}",
    "    ${!ed && u.alive && (u.side === 0 || see) && u.lastDec && Wd.t - u.lastDec.t < 20 ? `<span class=\"tr\" style=\"color:#d8c8ff\"><span class=\"lb\">최근 판단</span> ${esc(u.lastDec.s)} · ${Math.round(Wd.t - u.lastDec.t)}초 전</span>` : ''}\n"
    "    ${!ed && known && u.alive && (u.porenKit || u.ratOf != null) ? `<span class=\"tr\"><span class=\"lb\">쥐 군단</span> ${esc(ratRow(Wd, u))}</span>` : ''}")

open(F, 'w', encoding='utf-8').write(s)
print('page8780b OK')
