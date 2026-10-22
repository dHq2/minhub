# v8.7.4 페이지 — page8740.py v1.8 (v1.8: 사수 자리 옮김 기록 (J24) · v1.7: 역할 진화 기록 · 서술 (방패와 검: 전열 쪽으로) · v1.6: 제3세력 (I6 — 각혈) — 2편은 보라 · 화면의 '적' 은 아군이 아니면 (숨김 · 명령 대상 · 목록 · 서술 색 · 맵 정리 · 남은 적) · 1편 (망자) 의 지휘 · 작전 · 설계 · 여정 고유 줄은 그대로 · 각혈 등장 알림 · 놓치면 맵 가운데를 떠돎 · v1.5: 노인의 왕관 [★권위E] 글 — 모든 신성 상대 ([개조된 신체] · [대리석 피부] · 성해포의 [재생]) · [대리석 피부] · 권위 설명 · v1.4: 돌진 길 비킴 기록 · 서술 (아군 회피기동 '돌진 길 밖으로 옆으로 빠짐' · 적 궁수 본능 '돌진 길 비킴') · v1.3: 고정층 보스는 그 층에 닿기 전 (그 층도) 정예로 먼저 나오지 않음 — 첫 만남은 보스판 (2 ~ 5층 수정동굴 정예 붉은암석은 동굴 정예로 · 6층부터는 강적으로) · v1.2: 갑피SS 는 6성 (S 보다 한 단계 위) · 바위던지기 × 1.3 설명 · v1.1: 5층 수정동굴의 층 보스를 붉은암석으로 (3D 명단 "동굴 관문 보스로 알맞음" · 민수 메모 J22 그대로 — 갑피SS · 잡아찢기 · 딥 킥 · 방어모드 · 바위던지기 · 점프 찍기 중대형까지) · 망각은 원래 자리 (데이터층 정예 — 망각 + 저장된 도전자 둘) 로 3D 기술표 그대로 · 체력 1900 · 공격 73 (3D 3200 · 40 을 같은 3D 명단의 하딤 비율로) · 층 보스가 같은 층 정예로 또 나오지 않게 · 갑피 등급 (SS 포함) 을 특성 검사 · 특성 탭 등급표 · 아이콘 · 설계 칸에 · 네 기술의 설명 · 기록 · 서술 · 연출 · 그림 (방어모드 테두리 · 붙잡힌 손 · 날아가는 바위 · 던질 줄 예고) · 죽음 모습 '잡아찢김' · 기술표 동작 이름 (h2) · 수치표 이전 8.7.4 · v1.0: page8730.py 를 먼저 돌린 뒤 — 세르파는 보스도 적도 아님 — 도감 그대로의 동료 (3성 · 키 1.62 · 소형 · 갑피C · 회피 · 체력 90 · [군주]) 로, 수정동굴의 만남 (5층은 반드시 한 번 · 다른 수정동굴 층은 만남 칸 · 맵 위) 에서 영입 · 뽑기로도 · 보스판 체력 240 · 600 과 보스 무리를 걷어냄 · 굴란 · 몽 갑피A (도감) · 기술표 예고 (부채꼴 · 줄 · 그림자 원) 그림 · 기록 · 서술 · 연출 · 특성 [비늘 깃털 갑옷] · 버전 8.7.4)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8730.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.7.3 (2026-10-22)', '<!-- 굴의 전투판 v8.7.4 (2026-10-22)')
rep('     v8.7.3: ', '''     v8.7.4: 전투 바로잡기 — 5층 수정동굴의 층 보스는 붉은암석 (민수 메모 J22 그대로: 마족 · 갑피SS · 무장기 · 키 3M · 손 — 잡아찢기 (붙잡음 · 동료가 쳐서 끊음 · 끝까지 쥐면 중형 찢김 / 중대형 팔다리 하나 부러지거나 찢김 / 대형 팔다리 하나 부러짐) ·
         딥 킥 (볼링 핀) · 방어모드 (피해 1 · 느림 · 치지 않음 — 상대는 기다리거나 다른 상대를 침) · 바위던지기 (대포 — 처음 닿는 몸) · 호레이쇼식 점프 찍기 (중대형까지 즉사 · 겹친 몸 넘어짐)) · 붙잡힌 동료를 구함 ·
         망각은 데이터층 정예로 — 3D 2기 훈련장 기술표 그대로 (할퀴기 부채꼴 · 돌진 할퀴기 · 망각의 아가리 · 어슬렁 포위 · 갈퀴 덮치기 · 2페이즈 망각의 그림자 — 예고를 보면 비킴, 양쪽 같음 · 밀침은 넘어뜨리지 않음) · [비늘 깃털 갑옷] (정면 원거리 ×0.7 · 옆 · 뒤 ×1.15) ·
         세르파는 보스도 적도 아님 — 도감 그대로의 동료 (3성 · 체력 90 · 갑피C · 소형 · 회피 · [군주]) · 수정동굴에서 만나 영입 (5층은 반드시) · 뽑기로도 · 갑피 등급 (도감: 굴란 · 몽 A · 붉은암석 SS) · 큰 몸은 몸 전체로 벽을 보고 몸이 지나가는 길로
     v8.7.3: ''')
for a, b in (('h1::after{content:" v8.7.3"', 'h1::after{content:" v8.7.4"'), ('<footer>굴의 전투판 v8.7.3', '<footer>굴의 전투판 v8.7.4'), ('return `굴의 전투판 v8.7.3 · ${title}', 'return `굴의 전투판 v8.7.4 · ${title}'),
             ("copyText('굴의 전투판 v8.7.3 자동 판 기록", "copyText('굴의 전투판 v8.7.4 자동 판 기록"), ("o.push(`굴의 전투판 v8.7.3 — ${C.run", "o.push(`굴의 전투판 v8.7.4 — ${C.run"),
             ('의 버전 기록에 — v8.7.3 바로잡기 2 (여정 기록)', '의 버전 기록에 — v8.7.4 전투 바로잡기 (붉은암석 · 망각 · 세르파) / v8.7.3 바로잡기 2 (여정 기록)'),
             ('">v8.7.3 · 바로잡기 2 (지휘 기준 · 명령 줄 · 출구)</span>', '">v8.7.4 · 전투 바로잡기 (5층 붉은암석 · 세르파 동료)</span>')):
    rep(a, b)
# 수치표 이전: 새 칸 (spec.tear · kick · stone · boulder) 을 저장된 수치표에 채움 — 바뀐 옛 기본값은 없음
rep("const OLD_DEFAULTS = /*OLDDEF*/, RULES_MIG = '8.7.3',", "const OLD_DEFAULTS = /*OLDDEF*/, RULES_MIG = '8.7.4',")

# ---------- 설계 → 놓을 인물: 기술표 (h2) · 점프 찍기 체급 (quakeKill) 도 옮김 ----------
rep("'chgBias', 'noChg'];", "'chgBias', 'noChg', 'h2', 'quakeKill'];   /* v8.7.4 3D 보스 기술표 · 점프 찍기 체급 */")

# ---------- 특성: [비늘 깃털 갑옷] · 갑피 등급 (SS · S · A · B · C · D) ----------
rep("  '무장기': ", "  '비늘 깃털 갑옷': '망각 (3D 패시브 그대로) — 정면에서 날아온 화살 · 총알 · 투창은 비늘이 흘림 ×0.7 · 정면 근접은 그대로 · 옆구리 · 등은 ×1.15 (이 판의 측면 ×1.25 · 뒤 ×1.5 와 겹침)',   /* v8.7.4 */\n  '무장기': ")
rep("const GRADE_RE = /^(속력|근력|괴력|지휘|사격|회피|급소|은신|후각|발화|의학|신성)([SABCDE])$/, GRADE_OK = { 은신: 'SABCDE', 발화: 'SABCDE', 신성: 'SABCDE' };",
    "const GRADE_RE = /^(속력|근력|괴력|지휘|사격|회피|급소|은신|후각|발화|의학|신성|갑피)(SS|[SABCDE])$/, GRADE_OK = { 은신: 'SABCDE', 발화: 'SABCDE', 신성: 'SABCDE', 갑피: 'SABCD' };   /* v8.7.4 갑피 등급 (SS 는 갑피만) */")
rep("const traitKnown = t => { const m = GRADE_RE.exec(t); return m ? (GRADE_OK[m[1]] || 'SABC').includes(m[2]) : !!TRAITS[t] || t === '야시'; };",
    "const traitKnown = t => { const m = GRADE_RE.exec(t); return m ? (m[2] === 'SS' ? m[1] === '갑피' : (GRADE_OK[m[1]] || 'SABC').includes(m[2])) : !!TRAITS[t] || t === '야시'; };")
rep("function traitDesc(t){\n",
    "// v8.7.4 갑피 등급 → 판금 · 투구 등급 (엔진 gearOf 와 같음 — SS 6 · S 5 · A 4 · B 3 · C 2 · D 1 · 등급 없으면 수치표 galpi)\n"
    "const galpiTier = t => { const g = /^갑피(SS|[SABCD])?$/.exec(t || ''); return g ? (g[1] ? { SS: 6, S: 5, A: 4, B: 3, C: 2, D: 1 }[g[1]] : rules.galpi || 3) : 0; };\n"
    "function traitDesc(t){\n"
    "  { const g = /^갑피(SS|[SABCD])$/.exec(t); if (g) return `피부가 갑옷 + 투구 (갑피 ${g[1]}) — 장비 없이도 몸 칸 판금 · 머리 칸 투구 (${galpiTier(t)}성${g[1] === 'SS' ? ' — S 보다 한 단계 위 (장비는 5성까지)' : ''}) 를 입은 것과 같음 · 무게 없음 (더 좋은 장비를 입으면 그 칸은 장비)`; }   /* v8.7.4 */\n")
rep("(p.traits || []).includes('갑피') ? '<span class=\"brush\">[갑피]: 장비가 없어도 판금 · 투구 ' + (rules.galpi || 3) + '성</span>' : ''",
    "(() => { const g = (p.traits || []).find(x => galpiTier(x)); return g ? '<span class=\"brush\">[' + esc(g) + ']: 장비가 없어도 판금 · 투구 ' + galpiTier(g) + '성</span>' : ''; })()")   # v8.7.4 갑피 등급
# 특성 탭 등급표 · 아이콘: 갑피 줄 (SS 는 S 칸에 '(SS)')
rep("const GK = [...GRADE_KEYS, '후각', '발화', '야시'], GS = ['S', 'A', 'B', 'C', 'D', 'E'];", "const GK = [...GRADE_KEYS, '후각', '발화', '야시', '갑피'], GS = ['S', 'A', 'B', 'C', 'D', 'E'];   /* v8.7.4 갑피 등급 */")
rep("${GS.map(g => `<td class=\"l\">${who(P.filter(x => gradeOfP(x.p, k) === g))}</td>`).join('')}",
    "${GS.map(g => `<td class=\"l\">${who(P.filter(x => gradeOfP(x.p, k) === g))}${g === 'S' && P.some(x => gradeOfP(x.p, k) === 'SS') ? ' <span class=\"lb\">(SS)</span> ' + who(P.filter(x => gradeOfP(x.p, k) === 'SS')) : ''}</td>`).join('')}")
rep("return t ? t.slice(-1) : ''; }", "return t ? GRADE_RE.exec(t)[2] : ''; }")   # v8.7.4 갑피SS 는 'SS'
rep("ICO_GC = { S: '#f2dc96',", "ICO_GC = { SS: '#fff1b8', S: '#f2dc96',")   # v8.7.4 갑피SS 아이콘 테두리

# ---------- 붉은암석 (5층 층 보스 · J22) · 망각 (데이터층 정예) · 세르파 (동료) · 슬라임 조직 ----------
rep("  ['붉은암석', 'C-245', 4, { weapon: '맨손', height: 3.0, weight: 900, sizeCls: '대형', ov: { hp: 760, atk: 52 }, traits: ['갑피', '거구', '무장기'], active: ['도약 강타'] }, '매우 단단한 바위 거인 — 손으로 짓뭉갬 · 뛰어올라 찍음 (그림자를 보면 피할 것)'],   /* v8.7.3 키 3M · 손 · 장기 없음 · 점프 찍기 */",
    "  ['붉은암석', 'C-245', 4, { weapon: '맨손', height: 3.0, weight: 900, sizeCls: '대형', quakeKill: '중대형', ov: { hp: 760, atk: 52 }, traits: ['갑피SS', '거구', '무장기'], active: ['도약 강타', '잡아찢기', '딥 킥', '방어모드', '바위던지기'] }, '마족의 바위 거인 (갑피SS — 매우매우 단단) — 손으로 짓뭉갬 · 잡아찢기 (붙잡히면 동료가 쳐서 끊어 줄 것) · 딥 킥 (볼링 핀) · 방어모드 (피해 1 — 치지 말고 기다릴 것) · 바위던지기 (대포) · 뛰어올라 찍음 (그림자를 보면 피할 것 · 중대형까지 찌부러짐)'],   /* v8.7.3 키 3M · 손 · 장기 없음 · 점프 찍기 */   /* v8.7.4 민수 메모 J22 그대로 — 5층 수정동굴 층 보스 · 체력 · 공격은 그대로 (단단함은 갑피SS 와 방어모드로) */")
rep("  ['망각', 'C-211', 6, { weapon: '대검', height: 2.3, weight: 300, ov: { hp: 1100, atk: 66 }, traits: ['보스', '갑피', '베테랑'] }, '광석계 마인'],",
    "  ['망각', 'C-211', 6, { weapon: '이빨·발톱', height: 6.6, weight: 18000, sizeCls: '초대형', rMul: 2.81, h2: 'mangak', ov: { hp: 1900, atk: 73, spd: 1.9 }, traits: ['보스', '거구', '갑피', '비늘 깃털 갑옷'] }, '광석계의 마인 — 미치광이에 가까움 · 네 발 짐승 (키 6.6M · 길이 10M) · 할퀴기 (부채꼴 5.5칸) · 돌진 할퀴기 · 망각의 아가리 · 어슬렁 포위 · 갈퀴 덮치기 · 2페이즈 망각의 그림자 (바닥에 번지는 예고를 보면 비킬 것)'],   /* v8.7.4 데이터층 정예 · 3D 기술표 (h2 mangak) — 3D 체력 3200 · 공격 40 · 속력 2.2 를 같은 3D 명단의 하딤 비율 (3D 1600 · 34 → 이 판 950 · 62) 로: 체력 1900 · 공격 73 · 속력 1.9 · 몸 반지름 1.5 (3D 2.2 — 3칸 통로를 지나게) */")
rep("  ['세르파', 'C-277', 5, { role: '사수', weapon: '마법', height: 1.0, weight: 25, sizeCls: '소형', ov: { hp: 160, atk: 28 }, traits: ['회피A', '갑피', '군주', '보스'] }, '슬라임의 왕 — 바닥에서 수정을 뽑아 쏜다'],",
    "  ['세르파', 'C-277', 3, { ally: true, role: '사수', weapon: '마법', height: 1.62, sizeCls: '소형', nv: false, nvG: '', ov: { hp: 90, atk: 28 }, traits: ['회피A', '갑피C', '군주'] }, '슬라임의 왕 (한 구역) — 바닥에서 수정을 올려 쏘고 우박을 내림 · 작은 슬라임을 뽑아 모아 굴란 · 몽 · 핀 · 튤린으로 합침 · 수정동굴에서 만나면 영입 · 뽑기로도'],   /* v8.7.4 보스도 적도 아님 — 도감 그대로의 동료 (3성 · 키 1.62 · 소형 · 갑피C · 회피 · 체력 90) */")
rep("  ['굴란', null, 4, { weapon: '검', height: 1.8, weight: 90, ov: { hp: 220, atk: 36 }, traits: ['갑피', '속력B', '근력B', '레이더'] }, '슬라임 넷이 모인 검사'],",
    "  ['굴란', null, 4, { weapon: '검', height: 1.8, weight: 90, ov: { hp: 220, atk: 36 }, traits: ['갑피A', '속력B', '근력B', '레이더'] }, '슬라임 넷이 모인 검사'],   /* v8.7.4 갑피A (도감) */")
rep("  ['몽', null, 4, { weapon: '장검', shield: true, height: 2.0, weight: 160, ov: { hp: 320, atk: 30 }, traits: ['갑피', '레이더'] }, '슬라임 탱커 — 에너지 참격'],",
    "  ['몽', null, 4, { weapon: '장검', shield: true, height: 2.0, weight: 160, ov: { hp: 320, atk: 30 }, traits: ['갑피A', '레이더'] }, '슬라임 탱커 — 에너지 참격'],   /* v8.7.4 갑피A (도감) */")
rep("  serpa: { name: '슬라임의 왕 세르파', foes: [['세르파', 1], ['굴란', 1], ['몽', 1], ['핀', 1], ['튤린', 1], ['슬라임', 3]], join: 'C-277', joinTxt: '세르파가 작은 손을 든다 — \"...졌어. 데려가.\"' },",
    "  redrock: { name: '붉은암석', foes: [['붉은암석', 1]] },   /* v8.7.4 5층 층 보스 (3D 명단: 동굴 관문 보스로 알맞음 · 3D 처럼 혼자) */\n  serpa: { name: '붉은암석', foes: [['붉은암석', 1]] },   /* v8.7.4 세르파는 보스가 아님 — 옛 저장의 5층 보스 칸 (b: 'serpa') 은 붉은암석 */")
rep("  5: { name: '수정동굴', band: 'crystal', maps: ['crystal1', 'crystal2'], boss: 'serpa', ", "  5: { name: '수정동굴', band: 'crystal', maps: ['crystal1', 'crystal2'], boss: 'redrock', ")
rep("  5: { theme: 'crystal', name: '수정동굴 — 세르파의 왕국', top: { t: 'boss', b: 'serpa' } },",
    "  5: { theme: 'crystal', name: '수정동굴 — 세르파의 왕국', top: { t: 'boss', b: 'redrock' }, enc: 't:serpa' },   /* v8.7.4 층 보스는 붉은암석 · 세르파는 반드시 만나는 만남 (동료) */")
rep("if (FOE8['세르파']){ FOE8['세르파'].ov = { ...FOE8['세르파'].ov, hp: 600 };   /* v8.7.3 240 → 600 (머리 두 방에 끝나던 보스) */ FOE8['세르파'].allyOv = { hp: SP8.allyHp }; }   // 도감: 체력 90 · 보스판은 240 (조직이 자랄 틈 — 판 재기 160 은 15초 만에 쓰러짐)\n",
    "/* v8.7.4 세르파는 보스도 적도 아님 — 설계가 곧 도감 그대로의 동료 (체력 90). 보스판 체력 240 · 600 · 보스 무리는 걷어냄 */\n")
rep("if (BOSS8.serpa) BOSS8.serpa.foes = [['세르파', 1], ['몽', 1], ['슬라임', 4]];   // 조직은 싸우면서 커짐\n", "")
rep("hailRng: 11, allyHp: 90 };", "hailRng: 11 };")
rep("  if (b === 'serpa') return [{ narr: '수정 기둥 사이로 작은 왕관이 반짝인다.' }, { t: '여긴 내 왕국이야. 나가.', name: '세르파', who: 'C-277' }, { narr: '바닥의 젤리가 꿈틀댄다 — 모이고 엉기면 기사 · 방패 · 저격수 · 치유사가 된다.' }];\n",
    "  if (b === 'redrock' || b === 'serpa') return [{ narr: '무너진 수정 기둥 사이에 붉은 바위가 웅크리고 있다. 다가가자 — 바위가 일어선다.' }, { narr: '붉은암석. 마족의 바위 거인 — 매우매우 단단하다.' }, { box: '붉은암석 — 방어모드 (피해 1) 일 땐 치지 말고 기다릴 것 · 붙잡히면 동료가 쳐서 끊어 줄 것 · 날아오는 바위 · 내려앉을 그림자를 보면 비킬 것' }];   /* v8.7.4 */\n")

# 층 흐름: 고정층의 반드시 만나는 만남 (enc) — 하나뿐인 S 칸 (가운데) 에 · 층 보스가 같은 층 정예로 또 나오지 않게
rep("final: !!(X && X.final), strong: !!(T && T.strong) };", "final: !!(X && X.final), strong: !!(T && T.strong), encFix: (X && X.enc) || null };")
rep("  for (const row of rows) for (const nd of row) if (nd.t === 'elite' && !ELITE8[nd.e]) nd.e = 'hall';",
    "  for (const row of rows) for (const nd of row) if (nd.t === 'elite' && !ELITE8[nd.e]) nd.e = 'hall';\n"
    "  if (D.encFix && !D.seq && !D.rows){ const one = rows.filter(row => row.length === 1 && row[0].s).map(row => row[0]); if (one.length){ const nd = one[Math.min(1, one.length - 1)]; nd.t = 'enc'; nd.enc = D.encFix; delete nd.e; } }   /* v8.7.4 고정층의 반드시 만나는 만남 (5층 세르파) */\n"
    "  { const bk = new Set(Object.entries(FIX8).filter(([g]) => +g >= f).map(([, X]) => X.top && X.top.t === 'boss' ? X.top.b : X.seq && X.seq[0] && X.seq[0].t === 'boss' ? X.seq[0].b : null).concat(D.boss ? [D.boss] : []).flatMap(b => ((BOSS8[b] || {}).foes || []).map(x => x[0])));   /* v8.7.4 고정층 보스는 그 층에 닿기 전 (그 층도) 정예로 먼저 나오지 않음 — 첫 만남은 보스판 (5층 붉은암석: 2 ~ 5층 수정동굴 정예는 동굴 정예로 · 6층부터는 강적으로) */\n"
    "    if (bk.size) for (const row of rows) for (const nd of row) if (nd.t === 'elite' && (ELITE8[nd.e].foes || []).some(x => bk.has(x[0]))){ const alt = ((THEME8.cave || {}).el || []).filter(e => ELITE8[e] && !(ELITE8[e].foes || []).some(x => bk.has(x[0]))); nd.e = alt.length ? r8Pick(alt) : 'hall'; } }")

# ---------- 세르파 만남 (수정동굴) ----------
rep("const ENC8 = [   // [키, 무게, 층 범위]\n", "const ENC8 = [   // [키, 무게, 층 범위]\n  ['t:serpa', 1.2, 2, 9],   /* v8.7.4 수정동굴에서만 (세르파의 왕국) */\n")
rep("&& !(k === 'x:pehtoR' && ((R.flags || {}).pehtoDead || have.has('페흐토') || R.dead.includes('페흐토'))));",
    "&& !(k === 'x:pehtoR' && ((R.flags || {}).pehtoDead || have.has('페흐토') || R.dead.includes('페흐토'))) && !(k === 't:serpa' && ((F8[R.f] || {}).theme !== 'crystal' || have.has('세르파') || R.dead.includes('세르파'))));")
rep("  if (!n.enc && (R.flags || {}).dandal) n.enc = 'x:dandal';",
    "  if (n.enc === 't:serpa' && (have.has('세르파') || R.dead.includes('세르파'))) n.enc = null;   /* v8.7.4 이미 동료 (뽑기) 면 다른 만남 */\n  if (!n.enc && (R.flags || {}).dandal) n.enc = 'x:dandal';")
SERPA_TALK = "[{ narr: '수정 기둥 위에 작은 왕관이 반짝인다. 왕관을 쓴 아이가 다리를 흔들며 앉아 있고, 발밑에서 젤리 같은 슬라임들이 모였다 흩어진다.' }, { t: '여긴 내 왕국이야.', name: '세르파', who: 'C-277' }, { t: '…너희, 아래로 내려가는 거지? 재밌겠다. 나도 데려가.', name: '세르파', who: 'C-277' }, { ask: [['함께 가자 (영입)', '!r8:serpa'], ['지나간다', '%s']] }]"
rep("    admin: [{ narr: '공간이 잠깐 멈춘다.", "    serpa: " + (SERPA_TALK % '!r8:done') + ",   /* v8.7.4 */\n    admin: [{ narr: '공간이 잠깐 멈춘다.")
rep("  if (a === 'adminNo'){", "  if (a === 'serpa'){ r8Recruit('C-277', '세르파가 왕관을 고쳐 쓰고 기둥에서 뛰어내린다. 발밑의 슬라임들이 줄지어 따라온다.', done); return; }   /* v8.7.4 */\n  if (a === 'adminNo'){")
rep("seen: '처마 위에서 담배를 문 도깨비가 내려다본다 — 아해.' } };",
    "seen: '처마 위에서 담배를 문 도깨비가 내려다본다 — 아해.' },\n  serpa: { who: '왕관을 쓴 아이', ref: 'C-277', d: [2, 9], themes: ['crystal'], w: 1.2, seen: '수정 기둥 위에 작은 왕관이 반짝인다 — 슬라임의 왕 세르파.' } };   /* v8.7.4 수정동굴 맵 위 */")
rep("r8T('ahae', ", "r8T('serpa', " + (SERPA_TALK % '') + ");   /* v8.7.4 */\nr8T('ahae', ")
rep("!(k === 'ahae' && have.has('아해'))", "!(k === 'ahae' && have.has('아해')) && !(k === 'serpa' && have.has('세르파'))")
rep("ahae: '도깨비 아해', admin: '관리자' };", "ahae: '도깨비 아해', admin: '관리자', serpa: '슬라임의 왕 세르파 (수정동굴)' };")
# 뽑기로도 (도감) — 여정 설계의 동료 (ally)
rep("  const pool = DESIGN_DEFAULTS.filter(d => d.side === 0 && !have.has(d.key) && !have.has(d.name) && d.key !== '인주');",
    "  const pool = DESIGN_DEFAULTS.filter(d => d.side === 0 && !have.has(d.key) && !have.has(d.name) && d.key !== '인주').concat(Object.values(FOE8).filter(d => d.ally && !have.has(d.key) && !have.has(d.name)));   /* v8.7.4 세르파 (도감: 뽑기로도) */")
rep("const g = [['보스 · 히든', d => (d.traits || []).includes('보스')], ['정예 · 중간보스', d => !(d.traits || []).includes('보스') && (d.tier || 0) >= 4], ['무리', d => !(d.traits || []).includes('보스') && (d.tier || 0) < 4]];",
    "const g = [['동료 (여정에서 만남)', d => !!d.ally], ['보스 · 히든', d => !d.ally && (d.traits || []).includes('보스')], ['정예 · 중간보스', d => !d.ally && !(d.traits || []).includes('보스') && (d.tier || 0) >= 4], ['무리', d => !d.ally && !(d.traits || []).includes('보스') && (d.tier || 0) < 4]];   /* v8.7.4 동료 (세르파) */")

# ---------- 기술 설명 (특성 탭 · 상세) — 붉은암석 (J22) ----------
rep("  '도약 강타': '대장군 호레이쇼 — 이동기가 곧 공격기. 3 ~ 9칸을 1.1초에 뛰어 (몸 위로 넘어감) 내려앉음. 그림 (몸 동그라미) 과 절반 넘게 겹친 중형까지는 찌부러짐 (즉사). 몸에 걸친 이는 몸 밖으로 밀려나며 약한 피해 · 2.4칸 충격 범위는",
    "  '도약 강타': '대장군 호레이쇼 · 붉은암석 — 이동기가 곧 공격기. 3 ~ 9칸을 1.1초에 뛰어 (몸 위로 넘어감) 내려앉음. 그림 (몸 동그라미) 과 절반 넘게 겹친 몸은 찌부러짐 (즉사 — 호레이쇼는 중형까지 · 붉은암석은 중대형까지 · 대형 이상은 아님). 몸에 걸친 이는 몸 밖으로 밀려나며 약한 피해 · 넘어짐 (v8.7.4). 2.4칸 충격 범위는")
rep("  '피의 검기': ",
    "  '잡아찢기': '붉은암석 (민수 메모 J22) — 손 닿는 상대 (0.6칸) 를 0.6초 준비 뒤 붙잡음 (몸을 비틀어 피할 수 있음 · 초대형 · 공중은 못 쥠). 2.2초를 끝까지 쥐면 찢음: 중형까지는 찢겨 죽음 · 중대형은 팔다리 하나 (부러지거나 찢김) · 대형은 팔다리 하나 부러짐 (몸 전체가 재생하는 몸은 크게 다치기만). 끊을 수 있음 — 붙잡은 동안 최대 체력의 6% 넘게 맞거나 휘청 · 넘어짐 · 날아가면 놓침 (곁의 동료는 붙잡은 쪽을 침 — 양쪽 같음). 12초마다',   /* v8.7.4 */\n"
    "  '딥 킥': '붉은암석 (민수 메모 J22) — 손 닿는 상대를 0.35초 만에 걷어참 (둔기 × 0.9) · 크게 날려 보냄 (막으면 덜) — 날아간 몸이 볼링 핀처럼 뒤의 무리를 쓰러뜨림 (뒤에 줄지어 있으면 먼저 씀). 7초마다',   /* v8.7.4 */\n"
    "  '방어모드': '붉은암석 (민수 메모 J22 · 3D 바위 갑피) — 0.25초 만에 몸을 웅크려 5초 동안 무엇에 맞든 피해 1 · 걸음 × 0.4 · 치지 않음 (기술도). 4칸 안에 상대가 있을 때 가끔 씀. 상대는 손 밖에서 기다리거나 다른 상대를 침 (양쪽 같음). 14초마다',   /* v8.7.4 */\n"
    "  '바위던지기': '붉은암석 (민수 메모 J22 — 대포) — 0.8초 동안 둘레 바위를 뜯어 던짐: 1초에 14칸 · 10칸까지 곧게 날아가 처음 닿는 몸 (동료도) 을 침 (둔기 × 1.3) · 크게 날려 보냄 · 바위 벽에 닿으면 부서짐. 3 ~ 9칸 떨어진 상대에게 · 길목에 동료가 있으면 안 던짐. 날아올 줄을 본 쪽은 비킴. 10초마다',   /* v8.7.4 */\n"
    "  '피의 검기': ")

# ---------- 동작 이름 (카드 · 상세 · 턴 끝 상태표) ----------
rep("const liveAct = (Wd, u) => u.act ? { quake: !!u.act.quake,", "const liveAct = (Wd, u) => u.act ? { n: u.act.n || '', quake: !!u.act.quake,")   # v8.7.4 기술표 동작 이름
rep("  if (a.k === 'charge') return `돌진 → ${b ? b.name : ''}`;\n",
    "  if (a.k === 'charge') return `돌진 → ${b ? b.name : ''}`;\n"
    "  if (a.k === 'h2') return a.ph === 'wind' ? `${a.n || '기술'}${b ? ' → ' + b.name : ''} (${f2(a.left)}초)` : `${a.n || '기술'} 뒤 (${f2(a.left)}초 남음)`;   /* v8.7.4 3D 보스 기술표 ('공격 준비' 이던 것) */\n"
    "  if (a.k === 'spec' && a.s === 'tear' && a.ph === 'run') return `잡아찢기 — ${b ? reul(b.name) + ' ' : ''}붙잡고 있음 (${f2(a.left)}초 뒤 찢음 · 맞으면 놓침)`;   /* v8.7.4 */\n")
rep("    if (Wd.t < (u.stunT || -9)) p.push('휘청 중'); if (u.down) p.push('쓰러져 있음');",
    "    if (Wd.t < (u.stunT || -9)) p.push('휘청 중'); if (u.down) p.push('쓰러져 있음'); if (u.heldBy != null) p.push('붙잡힘 (잡아찢기)'); if (u.stoneT != null && Wd.t < u.stoneT) p.push('방어모드');   /* v8.7.4 */")

# ---------- 그림: 방어모드 테두리 · 붙잡힌 손 · 바위던지기 예고 줄 · 날아가는 바위 ----------
rep("ctx.fillStyle = '#ffd77a'; ctx.fillText(t, px, py + 0.5); }   // v5.5.3 휘청 (스턴)\n",
    "ctx.fillStyle = '#ffd77a'; ctx.fillText(t, px, py + 0.5); }   // v5.5.3 휘청 (스턴)\n"
    "    if (!ed && vis && u.alive && u.stoneT != null && now < u.stoneT){ const q = (u.stoneT - now) / Math.max(0.1, SPR(Wd, 'stone').t || 5); ctx.save(); ctx.strokeStyle = `rgba(196,168,140,${(0.6 + 0.3 * Math.sin(now * 5)).toFixed(2)})`; ctx.lineWidth = Math.max(3, r * 0.28); ctx.setLineDash([Math.max(4, r * 0.45), Math.max(2, r * 0.2)]); shapePath(ctx, shp, px, py, r * 1.14, sa); ctx.stroke(); ctx.setLineDash([]);\n"
    "      ctx.strokeStyle = 'rgba(240,220,190,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, r * 1.32, -Math.PI / 2, -Math.PI / 2 + 6.283 * Math.max(0, Math.min(1, q))); ctx.stroke();\n"
    "      const t = '🪨 방어모드 · 피해 1'; ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width, ly = py - r * 1.32 - 9; ctx.fillStyle = 'rgba(40,30,22,.9)'; ctx.fillRect(px - tw / 2 - 3, ly - 6, tw + 6, 13); ctx.fillStyle = '#f0dcc0'; ctx.fillText(t, px, ly + 0.5); ctx.restore(); }   /* v8.7.4 방어모드 (붉은암석): 바위 테두리 · 남은 시간 고리 */\n"
    "    if (!ed && vis && u.alive && u.heldBy != null){ const g = Wd.units[u.heldBy], A = g && g.act; if (g && g.alive && A && A.k === 'spec' && A.s === 'tear' && A.phase === 'run'){ const gx = ox + g.x * ts, gy = oy + g.y * ts, q = 1 - Math.max(0, A.end - now) / Math.max(0.1, SPR(Wd, 'tear').hold || 2.2); ctx.save();\n"
    "      ctx.strokeStyle = 'rgba(200,90,60,.85)'; ctx.lineWidth = Math.max(3, r * 0.3); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(px, py); ctx.stroke(); ctx.strokeStyle = 'rgba(255,90,70,.95)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px, py, r * 1.22, -Math.PI / 2, -Math.PI / 2 + 6.283 * Math.max(0, Math.min(1, q))); ctx.stroke();\n"
    "      const t = u.side ? '✊ 붙잡힘' : '✊ 붙잡힘 — 쳐서 끊을 것'; ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width, ly = py + r * 1.22 + 9; ctx.fillStyle = 'rgba(60,14,8,.9)'; ctx.fillRect(px - tw / 2 - 3, ly - 6, tw + 6, 13); ctx.fillStyle = '#ffb4a0'; ctx.fillText(t, px, ly + 0.5); ctx.restore(); } }   /* v8.7.4 잡아찢기: 손 · 찢기까지 남은 고리 */\n")
rep("      ctx.fillStyle = `rgba(255,150,60,${0.12 + 0.22 * k})`; ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, R2, a0 - ar, a0 + ar); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,170,80,.85)'; ctx.lineWidth = 1.5; ctx.stroke(); }\n",
    "      ctx.fillStyle = `rgba(255,150,60,${0.12 + 0.22 * k})`; ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, R2, a0 - ar, a0 + ar); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,170,80,.85)'; ctx.lineWidth = 1.5; ctx.stroke(); }\n"
    "    if (!ed && u.act && u.act.k === 'spec' && u.act.phase === 'wind' && u.act.s === 'boulder'){ const B = SPR(Wd, 'boulder'), b = Wd.units[u.act.b], a0 = b ? Math.atan2(b.y - u.y, b.x - u.x) : u.face || 0, L0 = (B.rng || 10) * ts, w0 = Math.max(4, (B.w || 0.6) * 2 * ts), k = Math.min(1, (now - u.act.t0) / Math.max(0.05, u.act.end - u.act.t0)), col = u.side ? '255,110,70' : '120,190,255';   /* v8.7.4 바위던지기 예고: 날아갈 줄 (처음 닿는 몸) */\n"
    "      ctx.save(); ctx.translate(px, py); ctx.rotate(a0); ctx.fillStyle = `rgba(${col},${(0.08 + 0.16 * k).toFixed(2)})`; ctx.fillRect(r, -w0 / 2, L0 - r, w0); ctx.fillStyle = `rgba(${col},${(0.2 + 0.25 * k).toFixed(2)})`; ctx.fillRect(r, -w0 / 2, (L0 - r) * k, w0); ctx.setLineDash([6, 4]); ctx.strokeStyle = `rgba(${col},.8)`; ctx.lineWidth = 1.5; ctx.strokeRect(r, -w0 / 2, L0 - r, w0); ctx.setLineDash([]); ctx.restore(); }\n")
rep("const sx = ox + S2.x * ts, sy = oy + S2.y * ts;\n    if (S2.wave){",
    "const sx = ox + S2.x * ts, sy = oy + S2.y * ts;\n"
    "    if (S2.boulder){ const R0 = ts * Math.max(0.32, (S2.w || 0.6) * 0.62); ctx.save(); ctx.strokeStyle = 'rgba(180,120,90,.35)'; ctx.lineWidth = Math.max(2, R0 * 0.5); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - S2.dx * ts * 1.3, sy - S2.dy * ts * 1.3); ctx.stroke();\n"
    "      ctx.translate(sx, sy); ctx.rotate((Wd.t - S2.t0) * 7); ctx.fillStyle = '#7a3b2e'; ctx.strokeStyle = '#2b1410'; ctx.lineWidth = 2; ctx.beginPath(); for (let j = 0; j < 7; j++){ const a = j / 7 * 6.283, rr = R0 * (0.8 + 0.2 * (((j * 37) % 5) / 4)); if (j) ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke();\n"
    "      ctx.strokeStyle = 'rgba(255,190,150,.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-R0 * 0.4, -R0 * 0.1); ctx.lineTo(R0 * 0.1, R0 * 0.3); ctx.stroke(); ctx.restore(); continue; }   /* v8.7.4 바위던지기 — 날아가는 붉은 바위 */\n"
    "    if (S2.wave){")

# ---------- 기술표 예고 그림 (3D 처럼 바닥에 붉게 차오름) ----------
rep("function drawCzWarn(Wd, ox, oy, ts){", r"""// v8.7.4 3D 보스 기술표 예고: 부채꼴 · 줄 (준비 동안 안쪽이 차오름) · 그림자 원 (떨어질 때까지 차오름) — 3D 의 바닥 예고처럼 (적 붉게 · 아군 푸르게)
function drawH2Warn(Wd, ox, oy, ts){
  const see = $('seeAll').checked, now = Wd.t;
  for (const u of Wd.units){ const A = u.act; if (!u.alive || !A || A.k !== 'h2' || A.phase !== 'wind' || !A.Z || !(u.side === 0 || u.seenBy || see)) continue;
    const Z = A.Z, q = Math.min(1, (now - A.t0) / Math.max(0.05, A.end - A.t0)), col = u.side ? '255,70,60' : '110,190,255', p = { x: ox + Z.x * ts, y: oy + Z.y * ts }; ctx.save();
    if (Z.sh === 'fan'){ const a0 = Z.ang - Z.arc / 2, a1 = Z.ang + Z.arc / 2, fan = r => { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.arc(p.x, p.y, r, a0, a1); ctx.closePath(); };
      ctx.fillStyle = `rgba(${col},${(0.1 + 0.18 * q).toFixed(2)})`; fan(Z.r * ts); ctx.fill(); ctx.fillStyle = `rgba(${col},${(0.22 + 0.3 * q).toFixed(2)})`; fan(Z.r * ts * q); ctx.fill(); ctx.strokeStyle = `rgba(${col},.85)`; ctx.lineWidth = 2; fan(Z.r * ts); ctx.stroke(); }
    else { const w = Z.w * ts, L0 = Z.len * ts; ctx.translate(p.x, p.y); ctx.rotate(Z.ang); ctx.fillStyle = `rgba(${col},${(0.1 + 0.18 * q).toFixed(2)})`; ctx.fillRect(0, -w / 2, L0, w); ctx.fillStyle = `rgba(${col},${(0.22 + 0.3 * q).toFixed(2)})`; ctx.fillRect(0, -w / 2, L0 * q, w); ctx.strokeStyle = `rgba(${col},.85)`; ctx.lineWidth = 2; ctx.strokeRect(0, -w / 2, L0, w); }
    ctx.restore();
    if (A.s !== 'ml'){ ctx.save(); ctx.font = '700 12px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = u.side ? '#ffb4a8' : '#bfe0ff'; ctx.fillText(A.n, ox + u.x * ts, oy + (u.y - u.r) * ts - 8); ctx.restore(); } }   // 기술 이름 (기본 일격 빼고)
  for (const Q of Wd.h2z || []){ if (now < Q.t0) continue; const by = Wd.units[Q.by]; if (!(see || litAt(Wd, Q.x, Q.y) || (by && (by.side === 0 || by.seenBy)) || Wd.units.some(e => e.alive && e.side === 0 && Math.hypot(e.x - Q.x, e.y - Q.y) < 4))) continue;
    const q = Math.min(1, (now - Q.t0) / Math.max(0.05, Q.at - Q.t0)), p = { x: ox + Q.x * ts, y: oy + Q.y * ts }; ctx.save();
    ctx.fillStyle = `rgba(128,32,32,${(0.14 + 0.22 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(p.x, p.y, Q.r * ts, 0, 6.283); ctx.fill();
    ctx.fillStyle = `rgba(160,30,40,${(0.28 + 0.3 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(p.x, p.y, Q.r * ts * q, 0, 6.283); ctx.fill();
    ctx.strokeStyle = 'rgba(225,85,85,.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, Q.r * ts, 0, 6.283); ctx.stroke(); ctx.restore(); }
}
function drawCzWarn(Wd, ox, oy, ts){""")
rep("  if (!ed) drawCzWarn(Wd, ox, oy, ts);", "  if (!ed) drawCzWarn(Wd, ox, oy, ts);\n  if (!ed && (Wd.units.some(u => u.h2) || (Wd.h2z && Wd.h2z.length))) drawH2Warn(Wd, ox, oy, ts);   /* v8.7.4 3D 보스 기술표 예고 */")
rep("    } else if (f.k === 'ghost' && age < 0.3){", r"""    } else if (f.k === 'h2Fx' && age < 0.35){   // v8.7.4 기술표 일격 — 예고 모양이 번쩍
      const q = age / 0.35, p = { x: ox + f.x * ts, y: oy + f.y * ts }; ctx.save(); ctx.fillStyle = `rgba(${f.side ? '255,130,110' : '160,205,255'},${(0.5 * (1 - q)).toFixed(2)})`;
      if (f.sh === 'fan'){ ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.arc(p.x, p.y, f.r * ts, f.ang - f.arc / 2, f.ang + f.arc / 2); ctx.closePath(); ctx.fill(); }
      else { ctx.translate(p.x, p.y); ctx.rotate(f.ang); ctx.fillRect(0, -f.w * ts / 2, f.len * ts, f.w * ts); }
      ctx.restore();
    } else if (f.k === 'h2Boom' && age < 0.45){   // 망각의 그림자가 떨어짐
      const q = age / 0.45, p = { x: ox + f.x * ts, y: oy + f.y * ts }; ctx.strokeStyle = `rgba(235,95,95,${(1 - q).toFixed(2)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y, f.r * ts * (0.7 + 0.5 * q), 0, 6.283); ctx.stroke();
    } else if (f.k === 'ghost' && age < 0.3){""")

# ---------- 죽음 모습: 잡아찢김 ----------
rep("assn: '소리 없이 숨이 끊김 (암살)' };", "assn: '소리 없이 숨이 끊김 (암살)', tear: '잡아찢김' };   /* v8.7.4 붉은암석 잡아찢기 */")
rep("incap: 0.7, burn: 0.35, shock: 0.8 };", "incap: 0.7, burn: 0.35, shock: 0.8, tear: 2.0 };")
rep("  if (k === 'spine'){ ctx.setLineDash([2, 2]); line(chest, belly, Math.max(1.5, r * 0.08), 'rgba(230,220,200,.7)'); ctx.setLineDash([]); }\n",
    "  if (k === 'spine'){ ctx.setLineDash([2, 2]); line(chest, belly, Math.max(1.5, r * 0.08), 'rgba(230,220,200,.7)'); ctx.setLineDash([]); }\n"
    "  if (k === 'tear'){ cut(chest, r * 0.62, Math.max(3, r * 0.2)); cut(belly, r * 0.62, Math.max(3, r * 0.2)); for (let j = 0; j < 7; j++){ const a = rr(j + 30) * 6.283, d = r * (1 + rr(j + 40) * 1.2); dot({ x: torso.x + Math.cos(a) * d, y: torso.y + Math.sin(a) * d }, Math.max(1.5, r * (0.08 + rr(j + 50) * 0.12)), 'rgba(170,14,26,.9)'); } }   /* v8.7.4 잡아찢김 — 몸이 갈라지고 사방에 튄 피 */\n")
rep("  burn: (A, B) => `${ga(B)} 그을린 채 쓰러진다.`,\n};",
    "  burn: (A, B) => `${ga(B)} 그을린 채 쓰러진다.`,\n"
    "  tear: (A, B) => [`${A ? A + '의 손아귀에서 ' : ''}${B}의 몸이 찢겨 나간다!`, `${A ? ga(A) + ' ' : ''}움켜쥔 ${reul(B)} 그대로 찢어 버린다.`],   /* v8.7.4 붉은암석 잡아찢기 */\n};")

# ---------- 연출 ----------
rep("    else if (e.k === 'czStart'){ if (a && vis(a) && ['upcut', 'ult', 'auth'].includes(e.s)) camShot(Wd, { unit: a.i, z: 1.14, dur: 1300, pri: 2 }); }   // 세자르의 큰 기술: 손을 드는 순간",
    "    else if (e.k === 'czStart'){ if (a && vis(a) && ['upcut', 'ult', 'auth'].includes(e.s)) camShot(Wd, { unit: a.i, z: 1.14, dur: 1300, pri: 2 }); }   // 세자르의 큰 기술: 손을 드는 순간\n"
    "    else if (e.k === 'h2'){ if (a && vis(a) && e.s !== 'prowl') camShot(Wd, { unit: a.i, z: e.s === 'maw' || e.s === 'shadow' ? 1.12 : 1.06, dur: 1100, pri: 2 }); }   /* v8.7.4 3D 보스 기술 */\n"
    "    else if (e.k === 'h2Hit'){ if (a && (e.hit || []).length && (vis(a) || e.vis)) fxShake(e.s === 'ml' ? 2.5 : 4.5, 260, a.x, a.y); }\n"
    "    else if (e.k === 'h2Phase'){ if (a){ camShot(Wd, { unit: a.i, z: 1.16, dur: 1800, pri: 3 }); fxShake(4, 420, a.x, a.y); } }\n"
    "    else if (e.k === 'tearGrab'){ if (b && (e.vis || vis(a))) camShot(Wd, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: 1.16, dur: 1600, pri: 2 }); }   /* v8.7.4 붉은암석 (J22): 붙잡는 순간 */\n"
    "    else if (e.k === 'tear'){ if (b && e.vis) fxShake(e.res === 'kill' ? 6 : 4.5, 380, b.x, b.y); }\n"
    "    else if (e.k === 'kick'){ if (b && e.vis) fxShake(3.5, 260, b.x, b.y); }\n"
    "    else if (e.k === 'stoneOn'){ if (a && vis(a)) camShot(Wd, { unit: a.i, z: 1.1, dur: 900, pri: 1 }); }\n"
    "    else if (e.k === 'boulder'){ if (a && vis(a)) camShot(Wd, { unit: a.i, z: 1.08, dur: 1000, pri: 1 }); }\n"
    "    else if (e.k === 'boulderEnd'){ fxShake(e.b != null ? 4.5 : 3, 300, e.x, e.y); }")

# ---------- 기록 · 서술 ----------
rep("      case 'czBreak': out.push(`${T(e)}👑 ${CZ_NM[e.s] || e.s} 끊김`); break;",
    "      case 'czBreak': out.push(`${T(e)}👑 ${CZ_NM[e.s] || e.s} 끊김`); break;\n"
    "      case 'h2': out.push(`${T(e)}🐾 ${n(e.a)} — ${e.n}${e.b != null ? ' → ' + n(e.b) : ''}${e.say ? ' ' + e.say : ''}`); break;   /* v8.7.4 3D 보스 기술표 */\n"
    "      case 'h2Hit': out.push(`${T(e)}🐾 ${e.n} — ${(e.hit || []).length ? e.hit.map(i => n(i)).join(' · ') : '아무도 맞지 않음'}`); break;\n"
    "      case 'h2Step': out.push(`${T(e)}↩ ${n(e.a)} ${e.n} — ${e.d}칸 물러남`); break;\n"
    "      case 'h2Phase': out.push(`${T(e)}🔴 ${n(e.a)} 2페이즈 ${e.say || ''} (공격 · 속력이 오르고 기술 대기가 풀림)`); break;\n"
    "      case 'h2Break': out.push(`${T(e)}✂ ${n(e.a)}의 ${e.n} 끊김${e.why ? ' (' + e.why + ')' : ''}`); break;\n"
    "      case 'h2Rain': out.push(`${T(e)}🌑 ${e.n} — ${(e.hit || []).length ? e.hit.map(i => n(i)).join(' · ') : '빈 바닥'}`); break;\n"
    "      case 'tearGrab': out.push(`${T(e)}✊ ${n(e.a)} 잡아찢기 — ${reul(n(e.b))} 붙잡음 (${e.sec}초 · 맞히면 놓침)`); break;   /* v8.7.4 붉은암석 (J22) */\n"
    "      case 'tear': out.push(`${T(e)}✊ ${n(e.a)} → ${n(e.b)} ${e.res === 'kill' ? '찢어 죽임' : e.res === 'tear' ? '팔다리 하나를 찢음' : e.res === 'break' ? '팔다리 하나를 부러뜨림' : '짓이김 (몸 전체가 재생)'} (${e.size})`); break;\n"
    "      case 'tearLet': out.push(`${T(e)}✂ ${n(e.a)} — ${reul(n(e.b))} 놓침${e.by != null ? ' (' + n(e.by) + '의 일격)' : ''}${e.why ? ' · ' + e.why : ''}`); break;\n"
    "      case 'kick': out.push(`${T(e)}🦶 ${n(e.a)} 딥 킥 → ${n(e.b)}`); break;\n"
    "      case 'stoneOn': out.push(`${T(e)}🪨 ${n(e.a)} 방어모드 (${e.sec}초 — 피해 1 · 느림 · 치지 않음)`); break;\n"
    "      case 'stoneOff': out.push(`${T(e)}🪨 ${n(e.a)} 방어모드 풀림`); break;\n"
    "      case 'boulder': out.push(`${T(e)}🪨 ${n(e.a)} 바위던지기${e.b != null ? ' → ' + n(e.b) + ' 쪽' : ''}`); break;\n"
    "      case 'boulderEnd': out.push(`${T(e)}🪨 ${n(e.a)}의 바위 — ${e.b != null ? n(e.b) + '에게 맞음' : '부서짐'} (${coord(e.x, e.y)})`); break;")
rep("    case 'czBreak': return { c: 'good', s: `세자르의 ${CZ_NM[e.s] || e.s} — 끊겼다!` };",
    "    case 'czBreak': return { c: 'good', s: `세자르의 ${CZ_NM[e.s] || e.s} — 끊겼다!` };\n"
    "    case 'h2': return e.s === 'prowl' ? null : { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${e.n}${e.say ? ' — ' + e.say : '!'}` };   /* v8.7.4 3D 보스 기술표 */\n"
    "    case 'h2Hit': { const H = e.hit || []; if (e.s === 'ml' && H.length < 2) return null; return H.length ? { c: U(e.a).side ? 'bad' : 'good', s: `${e.n}에 ${ga(H.map(i => n(i)).join(' · '))} ${H.length > 1 ? '한꺼번에 ' : ''}휩쓸렸다.` } : { c: U(e.a).side ? 'good' : 'dim', s: `${e.n} — 허공을 가른다.` }; }\n"
    "    case 'h2Step': return { c: 'dim', s: `${ga(n(e.a))} 어슬렁 물러나 거리를 벌린다.` };\n"
    "    case 'h2Phase': return { c: 'bad', s: `🔴 ${e.say || ''} — ${n(e.a)}의 2페이즈.` };\n"
    "    case 'h2Break': return { c: U(e.a).side ? 'good' : 'bad', s: `${n(e.a)}의 ${e.n} — 끊겼다!` };\n"
    "    case 'h2Rain': return (e.hit || []).length ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(e.n)} ${reul(e.hit.map(i => n(i)).join(' · '))} 덮친다.` } : null;\n"
    "    case 'tearGrab': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 커다란 손으로 ${reul(n(e.b))} 움켜쥔다!${U(e.a).side ? ' — 쳐서 끊어야 한다.' : ''}` };   /* v8.7.4 붉은암석 (J22) */\n"
    "    case 'tear': return e.res === 'hurt' ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${reul(n(e.b))} 짓이긴다 — 그래도 몸이 다시 엉겨 붙는다.` } : null;   // 찢겨 죽음 · 팔다리는 쓰러짐 · 다침 글이 말함\n"
    "    case 'tearLet': return { c: U(e.a).side ? 'good' : 'bad', s: `${ga(n(e.a))} ${reul(n(e.b))} 놓쳤다${e.by != null ? ' — ' + n(e.by) + '의 일격' : ''}!` };\n"
    "    case 'kick': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${reul(n(e.b))} 걷어찬다 — 몸이 볼링 핀처럼 날아간다!` };\n"
    "    case 'stoneOn': return { c: 'dim', s: `${ga(n(e.a))} 바위처럼 웅크린다 — 방어모드. 무엇으로 쳐도 흠집뿐이다.` };\n"
    "    case 'stoneOff': return null;\n"
    "    case 'boulder': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 바닥의 바위를 뜯어 던진다!` };\n"
    "    case 'boulderEnd': return e.b != null ? { c: U(e.b).side ? 'good' : 'bad', s: `날아온 바위가 ${reul(n(e.b))} 덮친다!` } : null;")
rep("if (e.dir === 'back') tags.push('뒤 ×' + R.flankBack); }", "if (e.dir === 'back') tags.push('뒤 ×' + R.flankBack); }\n        if (e.scale && e.scale !== 1) tags.push('비늘 깃털 갑옷 ×' + e.scale);   /* v8.7.4 */")

# ---------- 돌진 길 비킴 (엔진 v1.5 — 아군 회피기동 · 적 궁수 본능 같은 규칙) ----------
rep("out.push(`${T(e)}${e.m === 'slip' || e.m === 'out' ? '🌀' : '↩'} ${n(e.a)} — ${({ kite: '거리 벌림 (쏘고 물러남)',",
    "out.push(`${T(e)}${e.m === 'slip' || e.m === 'out' ? '🌀' : '↩'} ${n(e.a)} — ${({ kite: e.lane ? '돌진 길 밖으로 옆으로 빠짐' : '거리 벌림 (쏘고 물러남)',")
rep("    : e.m === 'kite' ? `거리 벌림 (본능): ${ga(n(e.a))} 쏘고 나서 다가오는 ${reul(n(e.b))} 피해 한 걸음 물러남`",
    "    : e.m === 'kite' ? (e.lane ? `돌진 길 비킴 (본능): ${ga(n(e.a))} 달려드는 ${n(e.b)}의 돌진 길 밖으로 옆으로 빠짐` : `거리 벌림 (본능): ${ga(n(e.a))} 쏘고 나서 다가오는 ${reul(n(e.b))} 피해 한 걸음 물러남`)   /* v8.7.4 */")
rep(": e.m === 'leap' || e.m === 'kite' ? { c: 'dim', s: `${ga(n(e.a))} 거리를 벌린다.` } : null; }",
    ": e.m === 'kite' && e.lane ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 달려드는 ${n(e.b)}의 돌진 길에서 옆으로 비켜난다!` } : e.m === 'leap' || e.m === 'kite' ? { c: 'dim', s: `${ga(n(e.a))} 거리를 벌린다.` } : null; }   /* v8.7.4 */")
rep("      if (e.m === 'kite') return { c: 'dim', s: `${ga(A)} 쏘고 나서 한 걸음 물러난다.` };",
    "      if (e.m === 'kite') return e.lane ? { c: 'bad', s: `${ga(A)} 달려드는 ${n(e.b)}의 돌진 길에서 옆으로 비켜난다.` } : { c: 'dim', s: `${ga(A)} 쏘고 나서 한 걸음 물러난다.` };   /* v8.7.4 */")

# ---------- 노인의 왕관 [★권위E] (C1) · 권위 (신성 봉인) — 엔진 v1.6 ----------
rep("노인의 왕관 — 맵의 모든 신성 상대 ([개조된 신체]) 효과 ${",
    "노인의 왕관 — 맵의 모든 신성 상대 ([개조된 신체] · [대리석 피부] · 성해포의 [재생]) 효과 ${")
rep("이 오면 4초마다 옆으로 2.2칸 스텝해 흘림 — 큰 한 방은 쿨이 돌 때를 노릴 것',   /* v8.6.0 */",
    "이 오면 4초마다 옆으로 2.2칸 스텝해 흘림 — 큰 한 방은 쿨이 돌 때를 노릴 것 · 상대가 노인의 왕관 [★권위E] 을 썼으면 받아 내는 몫 · 스텝 간격이 15% 약해짐 · 권위 (신성 봉인) 중엔 꺼짐',   /* v8.6.0 · v8.7.4 */")
rep("'눈이 내리고 신성이 봉인됨 — 전장 모두: 카리우스 ◆개조된 신체 (덜 다침 · 덜 휘청 · 덜 넘어짐 · 덜 잘림) 가 꺼짐'",
    "'눈이 내리고 신성이 봉인됨 — 전장 모두: 카리우스 ◆개조된 신체 (덜 다침 · 덜 휘청 · 덜 넘어짐 · 덜 잘림) · 적뢰 [대리석 피부] · 성해포의 [재생] 이 꺼짐'")

# ---------- 제3세력 (I6 — 각혈 · 엔진 v1.8): 2편 = 누구의 편도 아님 (보라) ----------
rep("const SIDEC = ['#5aa3dc', '#e0574b'];", "const SIDEC = ['#5aa3dc', '#e0574b', '#b06ae8'];   /* v8.7.4 2편 (제3세력 — 각혈) 은 보라 */")
# 짐작 칸: 2편도 '우리가 아는 것'
rep("${!ed && Wd.intel && (u.side === 1 || see) ? (() => { const S = 1 - u.side,", "${!ed && Wd.intel && (u.side !== 0 || see) ? (() => { const S = u.side === 0 ? 1 : 0,")
# '적' 이란 뜻 (아군이 아니면 적) — 숨김 (아군이 본 것만) · 명령 대상 · 목록 · 서술 색 · 맵 정리 · 남은 적 — 1편 (망자) 의 지휘 · 작전 · 설계 · 여정 고유 줄은 그대로
KEEP = ["function applyProfile(", "function unitFromRef0(", "if (d.side === 1 && d.nvG && pf.nv === undefined)", "const mine = myFloors()", "for (const u of S.units.filter(u => u.side === 1)){ if (!by[u.grp])",
        "} else for (const u of S.units.filter(u => u.side === 1)) taken.add(", "const v = VET6[p.ref]; if (v && p.side === 1)", "if (p.side === 1 && p.ref === 'C-056')", "if (p.side === 1 && ['C-052', 'C-053', 'C-054', 'C-055'].includes(p.ref)",
        "if (p.side === 1 && ['C-052', 'C-054'].includes(p.ref)", "if (u.side === 1 && pf && pf.nv !== undefined)", "for (const side of [0, 1]){ const C = cmdBoss(Wd, side)", "밤. 망자 ${ga(String(Wd.units.filter(u => u.side === 1).length))}",
        "case 'cmdLost':", "case 'opFail':", "case 'phase': { if (!Wd.units.some(u => u.side === 1 && u.seenBy)) return null;", "pl = ff(e => e.k === 'plan' && e.side === 1)", "if (e.k === 'plan' && e.side === 1 && e !== pl)",
        "foeTraits || [] : [])", "$('seeAll').checked && u.task ?", 'data-pside="1"', "if (p.side === 1) p.hero = false;", "p.mute != null ? p.mute : p.side === 1", "x.ref === 'C-027' && x.side === 1", "x.ref === 'C-085' && x.side === 1",
        "W.duel = { me:", "const base = own.side === 1 ? foe8(", "if (own.side === 1){ b.state", "if (n.ms === 'pass') for (const u of W.units) if (u.side === 1", "u.name === '페흐토'", "if (u.r8surr && u.alive", "if (n.surr) for (const u of W.units) if (u.side === 1"]
_L = s.split('\n'); _n = 0; _k = 0
for _i, _ln in enumerate(_L):
    if 'side === 1' not in _ln: continue
    if any(k in _ln for k in KEEP): _k += 1; continue
    _n += _ln.count('side === 1'); _L[_i] = _ln.replace('side === 1', 'side !== 0')
s = '\n'.join(_L)
assert _n >= 50 and _k >= 30, (_n, _k)
print('page8740: 적 = 아군이 아니면', _n, '· 1편 고유 줄', _k)
# 각혈 등장: 2편 (누구의 편도 아님) · 맵 가운데를 떠돎 (쫓다 놓치면) · 알림
rep("  p.midSpawn = 'kh'; lockIdentity(p); S.units.push(p); const u = addUnit(Wd, p);   /* v8.7.2 */",
    "  p.midSpawn = 'kh'; p.side = 2; lockIdentity(p); S.units.push(p); const u = addUnit(Wd, p); u.home = { x: Wd.map.W / 2, y: Wd.map.H / 2 };   /* v8.7.2 · v8.7.4 제3세력 (2편 — 망자와도 싸움 · 놓치면 맵 가운데를 떠돎) */")
rep("talkLines([{ box: '피할 수 없는 죽음이 찾아왔습니다.' }]);",
    "talkLines([{ box: '피할 수 없는 죽음이 찾아왔습니다.' }, { box: '각혈 — 누구의 편도 아님 (보라): 보이는 누구든 벤다 · 망자와도 서로 싸운다 · 쓰러뜨려야 맵이 정리된다' }]);   /* v8.7.4 */")

# ---------- 역할 진화 (I25 · 엔진 v2.2) 기록 · 서술 ----------
rep("      case 'leapShot': out.push(`${T(e)}🏹 ${n(e.a)} — 도약하며 쏨 → ${n(e.b)}`); break;   // v7.14",
    "      case 'leapShot': out.push(`${T(e)}🏹 ${n(e.a)} — 도약하며 쏨 → ${n(e.b)}`); break;   // v7.14\n"
    "      case 'reloc': out.push(`${T(e)}↪ ${n(e.a)} — 같은 까닭으로 두 번 빗나감 (${e.why}): 자리를 옮김 ← ${n(e.b)}`); break;   /* v8.7.4 J24 */\n"
    "      case 'roleEvo': out.push(`${T(e)}🛡 ${n(e.a)} — ${e.to === '전선' ? '방패와 ' + (e.w || '검') + ': 전열 쪽으로 (역할 진화 · ' + e.from + ' → 전선)' : '방패를 잃음: 본디 역할로 (' + e.from + ' → ' + e.to + ')'}`); break;   /* v8.7.4 I25 */")
rep("    case 'kick': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${reul(n(e.b))} 걷어찬다 — 몸이 볼링 핀처럼 날아간다!` };\n",
    "    case 'kick': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${reul(n(e.b))} 걷어찬다 — 몸이 볼링 핀처럼 날아간다!` };\n"
    "    case 'roleEvo': return e.to === '전선' ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 방패와 ${e.w || '검'}을 들고 전열에 선다.` } : null;   /* v8.7.4 I25 */\n")

open(F, 'w', encoding='utf-8').write(s)
print('page8740 OK')
