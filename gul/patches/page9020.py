# v9.2.0 페이지 — page9020.py v1.2 (v1.2: 새 기술 여덟의 칸 아이콘 · 겨눌 곳 글 · v1.1: 반 · 테리 몸 반지름 rMul 3 → 2 (r 1.5 → 1.0 — 계단2 위쪽 방 (두 줄 높이) 에 들어가도록) · v1.0: 2층 대규모 업데이트 3단계 — 2층의 적: 암계 병사 4 · 망자 5 · 반 · 테리 · 흑익 · 하류 · 헌팅나이프 · 카밀라의 설계 (FOE8) · 기술 · 특성 설명 · 죽음 글)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9010.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.1.0 (2026-10-24)', '<!-- 굴의 전투판 v9.2.0 (2026-10-24)')
rep('     v9.1.0: 2층 대규모 업데이트 2단계', '''     v9.2.0: 2층 대규모 업데이트 3단계 — 2층의 적 (암계 · 망자 · 제3세력) — 설계 · 기술 · 특성:
         · 암계 병사 넷: 방패병 (대형 방패 · 암계 역장 — 곧은 선 5~7칸 3초: 상대 편은 못 넘고 · 근접도 못 닿고 · 곧은 탄도 막힘 · 곡사는 못 막음 · 같은 편은 지나감) · 창방패병 (밀치기 돌진) ·
           장송기사 (장송 치유 · 부활 — 쓰러진 동료를 10초 · 최대 둘 · 근성처럼 안 죽음 · 힘 ×1.5 · 장송기사가 쓰러지면 끝 · 방사 절단) · 장궁병 (어둠의 화살비 — 피아 구분 없음)
         · 반 · 테리 (8m 초대형 · 전우조): 광역 베기 · 찍기 · 잡아 던지기 · 밟기 (중대형까지 확률 즉사) · 돌진 (막을 수 없음) / 망치 찍기 · 내려찍기 (지축 울림 · 찌부러짐) · 후리기 — 지속 돌격에 넘어짐
         · 흑익 · 하류 (2층 보스 · 전우조): 도약 · 찌르기 돌격 · 에너지탄 5연발 · 비행 강하 · 사이드킥 · 딥킥 · 역장 / 어둠 속 이동 · 원형 베기 · 공중제비 · 잡아뚫기
         · 망자 다섯 (일반 · 사족 · 근육 · 뚱보 · 기형): 기형은 느리게 시작해 점점 빨라짐 · 근육은 주먹이 조금 밀어냄
         · 헌팅나이프 (암습 · 무기뺏기) · 카밀라 (레이더 · 생존자 · 방탄복) · 방패 크기 (소형 · 중형 · 대형) · 얼굴 그림 열셋 더함 (아틀라스)
     v9.1.0: 2층 대규모 업데이트 2단계''')
for a, b in (('h1::after{content:" v9.1.0"', 'h1::after{content:" v9.2.0"'), ('<footer>굴의 전투판 v9.1.0', '<footer>굴의 전투판 v9.2.0'), ('return `굴의 전투판 v9.1.0 · ${title}', 'return `굴의 전투판 v9.2.0 · ${title}'),
             ("copyText('굴의 전투판 v9.1.0 자동 판 기록", "copyText('굴의 전투판 v9.2.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.1.0 — ${C.run", "o.push(`굴의 전투판 v9.2.0 — ${C.run"),
             ('의 버전 기록에 — v9.1.0 전우조 · 대장-부하 /', '의 버전 기록에 — v9.2.0 2층의 적 / v9.1.0 전우조 · 대장-부하 /'),
             ('">v9.1.0 · 전우조 · 대장-부하 (편대 대신)</span>', '">v9.2.0 · 2층의 적 (암계 · 망자 · 거인)</span>'),
             ("ver: '9.1.0', kind:", "ver: '9.2.0', kind:"), ("RULES_MIG = '9.1.0',", "RULES_MIG = '9.2.0',")):
    rep(a, b)
# 특성
rep("const TRAITS = {\n", """const TRAITS = {
  '장군': '어떤 조직의 장교 · 장군 출신 (헌팅나이프 · 흑익 · 하류) — 높은 지휘 경험을 뜻하는 표식. 실제 지휘 솜씨는 [지휘S] 같은 등급 특성으로 따로 정함',   // v9.2.0
  '생존자': '죽을 고비를 넘긴 생존자 (카밀라) — 회피기동 버프: 사수의 회피기동 (물러서며 쏨) 이 더 일찍 (코앞 3.1칸) · 더 멀리 (한 걸음 3칸 — 보통 2.2)',
  '레이더': '레이더 (카밀라) — 맵 전체의 적을 점으로 앎 (0.5초마다 기척 · 보이지 않아도 어디쯤인지). 점은 정확한 자리가 아님',
""")
rep("const ACTIVE = {\n", """const ACTIVE = {
  '암계 역장': '암계 방패병 (명세 D5) — 앞쪽으로 곧은 선 (5 ~ 7칸) 을 3초 펼침: 상대 편은 선을 못 넘고 (몸이 걸림) · 선 너머 근접 일격은 막히고 · 곧은 탄 (화살 · 총알) 도 막힘. 곡사는 못 막음 · 같은 편은 지나감. 다가오는 근접 적 둘 이상 · 사격 준비하는 적 사수를 보면 스스로 씀. 대기 12초',
  '밀치기 돌진': '암계 창방패병 — 1.3 ~ 5칸의 근접 적에게 방패를 앞세워 빠르게 돌진: 부딪힌 상대를 크게 밀어냄 (파동 · 넉백 3.2 · 피해는 × 0.6 — 밀치기가 먹혔을 때만 셈). 초대형은 못 밀고 되려 휘청. 대기 7초',
  '장송 치유': '암계 장송기사 — 다친 (65% 아래) 동료 하나를 치유 (최대 체력의 25%). 곁에 적이 붙지 않았을 때. 대기 6초',
  '장송 부활': '암계 장송기사 — 8칸 안에 쓰러진 동료 (최근 25초) 를 10초 동안 되살림 (체력 40% · 근성처럼 안 죽음 · 힘 × 1.5). 최대 둘 · 시간이 다하거나 장송기사가 쓰러지면 다시 쓰러짐. 대기 14초',
  '방사 절단': '암계 장송기사 — 몸 둘레 2.6칸을 한 바퀴 베어 밀어냄 (× 1.1). 둘러싼 적 둘 이상일 때. 대기 7초',
  '어둠의 화살비': '암계 장궁병 — 하늘로 쏘면 작은 원 일곱이 적 둘레에 차례로 생기고 1.1초 뒤 어둠의 화살이 쏟아짐: 피아 구분 없이 (동료도 맞음 — 동료가 낀 곳은 피함). 6칸 밖 · 적이 몰린 곳. 대기 14초',
  '암습': '헌팅나이프 — 2.2 ~ 9칸의 적 (중대형까지) 의 등 뒤로 빠르게 돌아 후방 치명타 (× 2.1 · 치명 50% — 확정 즉사는 아님). 도약은 아님. 등을 보이거나 동료와 맞붙은 적 · 사수 먼저. 대기 9초',
  '무기뺏기': '헌팅나이프 — 손 닿는 무기를 든 적 (중대형까지) 의 무기를 떨어뜨림 (65% · 몸을 비틀어 피할 수 있음). 대기 12초',
""")
# 죽음 글 · 으깸
rep("const DK_TXT = { decap: '목이 잘림', crush: '머리가 으깨짐',", "const DK_TXT = { squash: '온몸이 으깨짐', decap: '목이 잘림', crush: '머리가 으깨짐',")
rep("const DK_POOL = { decap: 1.7,", "const DK_POOL = { squash: 1.2, decap: 1.7,")
rep("const DIE_N = {\n", "const DIE_N = {\n  squash: (A, B) => [`${A ? A + '에게 ' : ''}${B}이(가) 짓눌려 온몸이 으깨진다!`, `쿵 — ${B}의 몸이 ${A ? A + '의 발 · 망치 ' : ''}아래 납작해진다.`],   // v9.2.0 짓밟힘 · 찌부러짐\n")
# 로그 · 서술 (새 사건)
rep("      case 'sqJoin': out.push(", """      case 'bfield': out.push(`${T(e)}🛡 ${n(e.a)} — 암계 역장 (${e.len}칸 · 3초)`); break;   // v9.2.0
      case 'bfieldBlock': out.push(`${T(e)}🛡 역장이 ${n(e.b)}${e.c != null ? '의 일격 (→ ' + n(e.c) + ')' : ''}을(를) 막음`); break;
      case 'bshove': out.push(`${T(e)}🛡 ${n(e.a)} 밀치기 돌진 → ${n(e.b)}${e.big ? ' (너무 커서 안 밀림)' : ''}`); break;
      case 'bmend': out.push(`${T(e)}✚ ${n(e.a)} 장송 치유 → ${n(e.b)} +${e.n}`); break;
      case 'braise': out.push(`${T(e)}☠ ${n(e.a)} 장송 부활 → ${n(e.b)} (${e.t}초)`); break;
      case 'braiseEnd': out.push(`${T(e)}☠ ${n(e.a)} — ${e.why}`); break;
      case 'bcut': out.push(`${T(e)}⚔ ${n(e.a)} 방사 절단 (${e.n}명)`); break;
      case 'brain': out.push(`${T(e)}🏹 ${n(e.a)} 어둠의 화살비 (원 ${e.cnt})`); break;
      case 'hamb': out.push(`${T(e)}🗡 ${n(e.a)} 암습 → ${n(e.b)}${e.back ? ' (등 뒤)' : ''}`); break;
      case 'hdisarm': out.push(`${T(e)}🗡 ${n(e.a)} 무기뺏기 → ${n(e.b)} ${e.ok ? '성공 (' + e.w + ')' : '실패'}`); break;
      case 'h2Grab': out.push(`${T(e)}✊ ${n(e.a)} 잡아 던지기 → ${n(e.b)}`); break;
      case 'quake': out.push(`${T(e)}💥 지축 울림 — 둘레 ${e.n}명이 휘청`); break;
      case 'giantFall': out.push(`${T(e)}🗿 ${n(e.b)} — 지속 돌격에 넘어짐 (${e.sec}초 · 일어나는 중)`); break;
      case 'sqJoin': out.push(""")
rep("    case 'sqJoin': return { c: 'dim'", """    case 'bfield': return { c: 'bad', s: `${ga(n(e.a))} 방패를 땅에 박는다 — 보이지 않는 벽이 곧게 펼쳐진다!` };   // v9.2.0
    case 'bfieldBlock': return { c: 'dim', s: `역장에 막혀 ${n(e.b)}${jong(n(e.b)) ? '이' : '가'} 더 나아가지 못한다.` };
    case 'bshove': return e.big ? { c: 'good', s: `${ga(n(e.a))} 방패째 부딪히지만 ${n(e.b)}은(는) 꿈쩍도 않는다.` } : { c: 'bad', s: `${ga(n(e.a))} 방패를 앞세워 들이받는다 — ${n(e.b)}이(가) 밀려난다!` };
    case 'bmend': return { c: 'bad', s: `${ga(n(e.a))} 낮게 읊조린다 — ${n(e.b)}의 상처가 아문다.` };
    case 'braise': return { c: 'bad', s: `${ga(n(e.a))} 장송가를 읊는다 — 쓰러진 ${n(e.b)}이(가) 다시 일어선다!` };
    case 'braiseEnd': return { c: 'good', s: `${n(e.a)}에게서 장송의 힘이 빠져나간다 — ${e.why}.` };
    case 'bcut': return { c: 'bad', s: `${ga(n(e.a))} 몸을 한 바퀴 돌려 둘레를 쓸어 벤다!` };
    case 'brain': return { c: 'bad', s: `${ga(n(e.a))} 하늘로 시위를 당긴다 — 검은 원이 땅에 번진다!` };
    case 'hamb': return { c: 'bad', s: `${ga(n(e.a))} 그림자처럼 ${n(e.b)}의 등 뒤로 파고든다!` };
    case 'hdisarm': return e.ok ? { c: 'bad', s: `${ga(n(e.a))} ${n(e.b)}의 손목을 꺾어 무기를 뺏는다!` } : { c: 'dim', s: `${ga(n(e.a))} ${n(e.b)}의 무기를 노렸지만 뺏지 못한다.` };
    case 'h2Grab': return { c: 'bad', s: `${ga(n(e.a))} ${n(e.b)}을(를) 움켜쥐고 집어던진다!` };
    case 'quake': return { c: 'bad', s: `쿵 — 땅이 울린다! 둘레의 몸들이 휘청인다.` };
    case 'giantFall': return { c: 'good', s: `거듭된 돌격에 ${ga(n(e.b))} 무너진다 — 일어나는 데 한참 걸릴 것이다.` };
    case 'sqJoin': return { c: 'dim'""")
# 설계 (FOE8) — 큰 목록 뒤 · foe8 앞
GEAR3 = "gear: { 몸: { name: '암계 흉갑', mat: '판금', tier: 3 }, 머리: { name: '암계 투구', mat: '투구', tier: 3 } }"
rep("const foe8 = (k, f) => {", """/* v9.2.0 2층의 적 — 암계 병사 (C-318 ~ C-321 · 모두 [베테랑] · 암계 갑옷 · 투구 · 키 1.8 ~ 2.5m · 체력 300 ~ 500) · 반 · 테리 (C-322 · C-323) · 흑익 · 하류 (보스) · 헌팅나이프 · 카밀라 (제3세력) · 망자 다섯 */
const FOE9 = [
  ['암계 방패병', 'C-318', 3, { weapon: '장검', shield: true, shSize: '대형', height: 2.1, weight: 170, sizeCls: '중대형', race: '심연', origin: '암계', ov: { hp: 420, atk: 38 }, traits: ['갑피', '베테랑', '야시A'], active: ['암계 역장'], %GEAR% }, '중장 탱커 — 대형 방패 · 암계 역장'],
  ['암계 창방패병', 'C-319', 3, { weapon: '창', shield: true, shSize: '중형', height: 2.0, weight: 140, sizeCls: '중대형', race: '심연', origin: '암계', ov: { hp: 340, atk: 42, spd: 3.3 }, traits: ['갑피', '베테랑', '야시A'], active: ['밀치기 돌진'], %GEAR% }, '중갑 장창 · 중형 방패 — 근거리 돌진 (밀치기)'],
  ['암계 장송기사', 'C-321', 3, { weapon: '장검', height: 2.2, weight: 150, sizeCls: '중대형', race: '심연', origin: '암계', ov: { hp: 400, atk: 44 }, traits: ['갑피', '베테랑', '야시A'], active: ['장송 치유', '장송 부활', '방사 절단'], %GEAR% }, '중갑 장검 — 다친 동료를 치유 · 쓰러진 동료를 잠시 살림 · 방사형 절단'],
  ['암계 장궁병', 'C-320', 3, { role: '사수', weapon: '활', ammo: 30, height: 1.95, weight: 90, race: '심연', origin: '암계', ov: { hp: 300, atk: 36, spd: 2.7 }, traits: ['사격B', '베테랑', '야시A'], active: ['어둠의 화살비'], gear: { 몸: { name: '암계 흉갑', mat: '경갑', tier: 2 } } }, '조금 느린 장궁 — 공중에 쏘면 어둠의 화살이 쏟아짐 (피아 구분 없음)'],
  ['반', 'C-322', 5, { weapon: '대검', height: 8, weight: 20000, sizeCls: '초대형', rMul: 2, h2: 'ban', race: '심연', origin: '암계', ov: { hp: 1200, atk: 60, spd: 2.2 }, traits: ['보스', '거구', '갑피', '베테랑'] }, '암계 중간보스 (8m) — 대검 · 광역 베기 · 찍기 · 잡아 던지기 · 밟기 · 막을 수 없는 돌진 (테리와 전우조)'],
  ['테리', 'C-323', 5, { weapon: '둔기', height: 8, weight: 24000, sizeCls: '초대형', rMul: 2, h2: 'teri', race: '심연', origin: '암계', ov: { hp: 1500, atk: 55, spd: 2.0 }, traits: ['보스', '거구', '갑피', '베테랑'] }, '암계 중간보스 (8m) — 망치 · 찍기 (찌부러짐) · 내려찍기 (지축 울림) · 후리기 (반과 전우조)'],
  ['흑익', 'C-235', 4, { weapon: '장검', role: '공격수', height: 1.8, weight: 95, race: '암계 (마족과 비슷)', origin: '암계', h2: 'heugik', active: ['암계 역장'], ov: { hp: 600, atk: 40, spd: 3.2 }, traits: ['보스', '베테랑', '장군', '갑피', '야시A'], gear: { 몸: { name: '암계 흉갑', mat: '판금', tier: 4 }, 머리: { name: '암계 투구', mat: '투구', tier: 4 } } }, '암계 보스 — 도약 · 찌르기 돌격 · 에너지탄 5연발 · 비행 강하 · 킥 · 직선 역장 (하류와 전우조)'],
  ['하류', 'C-234', 4, { weapon: '대검', role: '공격수', height: 1.8, weight: 105, race: '암계 (마족과 비슷)', origin: '암계', h2: 'hareu', ov: { hp: 400, atk: 48, spd: 3.5 }, traits: ['보스', '베테랑', '장군', '갑피', '야시A'], gear: { 몸: { name: '암계 흉갑', mat: '판금', tier: 4 }, 머리: { name: '암계 투구', mat: '투구', tier: 4 } } }, '암계 보스 — 대검 · 어둠 속 이동 · 원형 베기 · 공중제비 · 잡아뚫기 (흑익과 전우조)'],
  ['헌팅나이프', 'C-290', 4, { cls: '기동', weapon: '단검', height: 2.0, weight: 85, race: '이계 + 심계 + 현대', origin: '심계 (낙오자)', ov: { hp: 200, atk: 44, spd: 3.6 }, traits: ['회피B', '은신B', '근력A', '괴력A', '사격A', '베테랑', '장군', '야시A'], active: ['암습', '무기뺏기'] }, '심계 소령 — 뭘 주워도 잘 싸움 · 암습 · 무기뺏기 (카밀라와 전우조 · 서로 모르는 사이)'],
  ['카밀라', 'C-291', 4, { weapon: '샷건', role: '사수', ammo: 24, height: 1.7, weight: 62, race: '인간 (현대)', origin: '심계 (낙오자)', ov: { hp: 200, atk: 40 }, traits: ['베테랑', '생존자', '레이더', '사격S', '은신B', '회피A', '야시A'], gear: { 몸: { name: '방탄복', mat: '방탄복', tier: 3 } } }, '라스트 솔져 — 레이더 · 생존자 · 펌프식 샷건'],
  ['일반 망자', 'X-w01', 1, { weapon: '맨손', height: 1.7, weight: 60, ov: { hp: 90, atk: 18 }, traits: ['망자'] }, '무기를 안 쓰는 망자 — 많이 나옴'],
  ['사족 망자', 'X-w06', 2, { cls: '기동', weapon: '맨손', bladeHands: true, height: 1.2, weight: 55, ov: { hp: 120, atk: 30, spd: 4.2 }, traits: ['망자', '사족보행'], active: ['도약', '돌진', '달라붙기 난도질'] }, '이성 없는 기동병 — 달려들어 잡아 할퀴기 (손이 날붙이)'],
  ['근육 망자', 'X-w10', 2, { weapon: '맨손', height: 2.0, weight: 130, hitKb: 1.6, ov: { hp: 220, atk: 34 }, traits: ['망자', '괴력B', '근력B'] }, '맞싸우는 거한 — 주먹이 조금 밀어냄'],
  ['뚱보 망자', 'X-w03', 2, { weapon: '맨손', height: 2.0, weight: 500, ov: { hp: 800, atk: 26, spd: 1.7 }, traits: ['망자'] }, '탱커 — 느리고 질김 (갑피 없음)'],
  ['기형 망자', 'X-w08', 3, { cls: '기동', weapon: '맨손', bladeHands: true, height: 1.3, weight: 90, ramp: { from: 2.2, to: 4, t: 25 }, ov: { hp: 500, atk: 34, spd: 2.2 }, traits: ['망자', '사족보행'], active: ['돌진'] }, '느리게 시작해 점점 빨라짐 (2.2 → 4) · 물어뜯기 · 할퀴기 · 강한 돌진 — 아주 드묾']
];
FOE9.forEach(([key, ref, tier, o, note]) => { const d = { key, name: key, side: 1, ref, tier, cls: o.cls || (o.role === '사수' || o.role === '지원' ? '원거리' : '근접'), role: o.role || '공격수', nv: true, nvG: 'A', tactic: note, note, ...o }; if (typeof idTraits === 'function' && ref) for (const t of idTraits(ref)) if (!d.traits.includes(t)) d.traits.push(t); FOE8[key] = d; });
const foe8 = (k, f) => {""".replace('%GEAR%', GEAR3))
# 뒤쪽 층의 흑익 · 하류는 보스 급이라 뜸하게
rep("  abyss: [['하류', 1.5], ['흑익', 1.5],", "  abyss: [['하류', 0.4], ['흑익', 0.4],")
rep("  neo: [['하류', 1], ['흑익', 1],", "  neo: [['하류', 0.4], ['흑익', 0.4],")
rep("  void: [['흑익', 1], ['하류', 1],", "  void: [['흑익', 0.4], ['하류', 0.4],")
# 기술 칸 아이콘 · 겨눌 곳 글 (SUP_K 모두에 있어야 함 — ui8780d 가 지킴)
rep("const SPEC_IC = { ", "const SPEC_IC = { bfield: '🛡', bshove: '💢', bmend: '✚', braise: '⚰', bcut: '🌀', brain: '🏹', hamb: '🗡', hdisarm: '✋', ")
rep("const SPEC_TGT = { ", """const SPEC_TGT = { bfield: '🛡 암계 역장: 펼칠 쪽을 탭 (그 방향으로 곧은 선 5 ~ 7칸 · 3초 — 상대 편은 못 넘고 · 곧은 탄도와 근접 일격이 막힘 · 곡사는 못 막음 · 아군은 투과)', bshove: '💢 밀치기 돌진: 근접한 적을 탭 (1.3 ~ 5칸 — 방패를 앞세워 돌진 · 부딪힌 상대를 크게 밀어냄)', bmend: '✚ 장송 치유: 다친 동료를 탭 (최대 체력의 25% 치유)', braise: '⚰ 장송 부활: 쓰러진 동료를 탭 (8칸 안 · 최근 25초 — 10초 동안 되살림 · 근성처럼 안 죽음 · 힘 × 1.5)', bcut: '🌀 방사 절단: 적이 둘러싼 자리에서 탭 (몸 둘레 2.6칸을 한 바퀴 베어 밀어냄)', brain: '🏹 어둠의 화살비: 적이 있는 쪽을 탭 (작은 원 일곱이 차례로 생기고 곧 화살이 쏟아짐 — 동료도 맞음)', hamb: '🗡 암습: 적을 탭 (2.2 ~ 9칸 — 등 뒤로 돌아 후방 치명타)', hdisarm: '✋ 무기뺏기: 적을 탭 (붙어서 무기를 빼앗음)', """)
open(F, 'w', encoding='utf-8').write(s)
print('page9020 OK')
