# v7.24.2 페이지 — page7242.py v1.0 (근력 · 괴력 나눔: [근력X] 새 등급 특성 (예전 [괴력X] 의 늘 쓰는 몫) · [괴력X] = 결정적인 순간의 힘 · 쟝 [괴력C] · 괴력을 가졌던 인물 (카리우스 · 옐로 · 모닝스타 · 호레이쇼 · 각혈) 은 같은 등급 [근력] 을 더해 숫자 그대로 ·
#   저장된 판 · 내 설계 · 층 · 캠페인도 한 번 (괴력X 만 있으면 근력X 를 더함 · 쟝에 괴력C) · 수치표 이전 7.24.2 (괴력 표) · 설명 · 근력 아이콘 (중압 견디기) · 로그 · 나레이션 · 상세 칸)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7241.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.24.1 (2026-10-18)', '<!-- 굴의 전투판 v7.24.2 (2026-10-18)')
rep('     v7.24.1: ', '''     v7.24.2: 근력 · 괴력 나눔. [근력X] = 타고난 힘 (공격 × · 막힐 때 상대 자세 · 관통 · 무기 밀침 · 무거운 무기 — 예전 [괴력X] 가 하던 늘 쓰는 몫 그대로).
         [괴력X] = 싸우며 깨우친 힘 — 결정적인 순간에만 × (S 2.0 · A 1.7 · B 1.4 · C 1.2): 크게 밀리거나 넘어지려 할 때 버팀 · 잡힌 무기를 뿌리침 · 무너지려던 막기를 튕겨냄 ·
         들이받히는 순간 버팀 · 되튕기려는 순간 밀어붙임 · 밀치기가 안 먹힐 때 밀어붙임 — 쓰면 잠깐 빈틈 (막기 어려움) · 등급마다 대기. 쟝 [괴력C].
         괴력을 가졌던 인물 (카리우스 · 옐로 · 모닝스타 · 호레이쇼 · 각혈) 은 같은 등급의 [근력] 을 더해 숫자는 그대로 (저장된 판 · 내 설계 · 층 · 캠페인도 한 번).
     v7.24.1: ''')
rep('h1::after{content:" v7.24.1"', 'h1::after{content:" v7.24.2"')
rep('<footer>굴의 전투판 v7.24.1', '<footer>굴의 전투판 v7.24.2')
rep('return `굴의 전투판 v7.24.1 · ${title}', 'return `굴의 전투판 v7.24.2 · ${title}')
rep("copyText('굴의 전투판 v7.24.1 자동 판 기록", "copyText('굴의 전투판 v7.24.2 자동 판 기록")
rep('의 버전 기록에 — v7.24.1 모닝스타 철퇴', '의 버전 기록에 — v7.24.2 근력 · 괴력 / v7.24.1 모닝스타 철퇴')
rep('">v7.24.1 · 모닝스타 철퇴</span>', '">v7.24.2 · 근력 · 괴력</span>')
rep("ver: '7.24.1', at:", "ver: '7.24.2', at:")
rep("RULES_MIG = '7.24.1',", "RULES_MIG = '7.24.2',")
# 인물
rep("traits: ['거구', '갑피', '괴력A', '머리 넷', '은신E'], unique: ['개조된 신체']", "traits: ['거구', '갑피', '근력A', '괴력A', '머리 넷', '은신E'], unique: ['개조된 신체']")
rep("    derived: ['거구', '갑피', '괴력A', '머리 넷'], limits: [], flags: { modBody: true } },", "    derived: ['거구', '갑피', '근력A', '괴력A', '머리 넷'], limits: [], flags: { modBody: true } },")
rep("    derived: ['사족보행', '속력A', '괴력B'], limits: ['제약:총포류', '제약:활'], flags: { bladeHands: true } },", "    derived: ['사족보행', '속력A', '근력B', '괴력B'], limits: ['제약:총포류', '제약:활'], flags: { bladeHands: true } },")
rep("traits: ['의학B', '은신B', '사족보행', '속력A', '괴력B', '제약:총포류', '제약:활']", "traits: ['의학B', '은신B', '사족보행', '속력A', '근력B', '괴력B', '제약:총포류', '제약:활']")
rep("traits: ['괴력A', '회피C', '은신D'], gear: { 몸: { name: '경갑', mat: '경갑', tier: 1 } }, active: ['철퇴 후리기', '휘둘러 치기']", "traits: ['근력A', '괴력A', '회피C', '은신D'], gear: { 몸: { name: '경갑', mat: '경갑', tier: 1 } }, active: ['철퇴 후리기', '휘둘러 치기']")
rep("traits: ['거구', '괴력S', '베테랑', '망자', '보스']", "traits: ['거구', '근력S', '괴력S', '베테랑', '망자', '보스']")
rep("'발화A', '괴력B', '망자', '은신B']", "'발화A', '근력B', '괴력B', '망자', '은신B']")
rep("traits: ['회피A', '급소A', '후각B', '은신B', '일반인'], active: ['머리 찍기']", "traits: ['회피A', '급소A', '후각B', '은신B', '괴력C', '일반인'], active: ['머리 찍기']")
rep("근력은 세지 않음. 미친 듯 달려들다 살아남은 이레귤러'", "근력은 세지 않음 (타고난 힘) — 대신 살아남으며 깨우친 낮은 괴력: 밀리거나 붙잡힐 때 순간 뿌리침. 미친 듯 달려들다 살아남은 이레귤러'")
# 등급 특성
rep("const GRADE_KEYS = ['속력', '괴력',", "const GRADE_KEYS = ['속력', '근력', '괴력',")
rep("  const m = /^(속력|괴력|지휘|사격|회피|급소|의학)([SABC])$/.exec(t);", """  const m = /^(속력|근력|괴력|지휘|사격|회피|급소|의학)([SABC])$/.exec(t);
  if (m && m[1] === '근력'){ const k = rules.grades && rules.grades['근력'] ? rules.grades['근력'][m[2]] : 1.3; return `타고난 힘 (근육 · 체격) — 공격 ×${k} · 막히면 상대 자세를 ×${k} 더 깎음 · 무기로 미는 힘 · 관통 · 무거운 무기 (궁수의 활 같은) 를 다룸. 늘 씀`; }   /* v7.24.2 */
  if (m && m[1] === '괴력'){ const k = rules.grades && rules.grades['괴력'] ? rules.grades['괴력'][m[2]] : 1.4, M = rules.might || {}, cd = (M.cd || {})[m[2]] || 6; return `싸우며 깨우친 힘 — 결정적인 순간에만 힘 ×${k}: 크게 밀리거나 넘어지려 할 때 버팀 · 잡힌 무기를 뿌리침 (몸무게 · 근력 차이는 그대로) · 무너지려던 막기를 튕겨냄 · 들이받히는 순간 버팀 · 되튕기려는 순간 밀어붙임 · 밀치기가 안 먹힐 때 밀어붙임. 쓰면 ${M.open || 0.4}초 빈틈 (막기 어려움) · ${cd}초 대기. 공격 배율은 아님`; }   /* v7.24.2 */""")
rep("const reqLack = (p, w) => { const W = rules.weapons[w] || {}; return !!W.req && !sizeOK({ sizeCls: pSize(p) }, W.req, (p.traits || []).some(x => /^괴력/.test(x))); };",
    "const reqLack = (p, w) => { const W = rules.weapons[w] || {}; return !!W.req && !sizeOK({ sizeCls: pSize(p) }, W.req, (p.traits || []).some(x => /^근력/.test(x))); };   /* v7.24.2 무거운 무기 = 근력 */")
rep("const GRADE_RE = /^(속력|괴력|지휘|사격|회피|급소|은신|후각|발화|의학)([SABCDE])$/,", "const GRADE_RE = /^(속력|근력|괴력|지휘|사격|회피|급소|은신|후각|발화|의학)([SABCDE])$/,")
rep('등급 특성 ([속력X] 이동 속력 × · [괴력X] 공격 × , 막힐 때 상대 자세도 × ·', '등급 특성 ([속력X] 이동 속력 × · [근력X] 타고난 힘 — 공격 × , 막힐 때 상대 자세도 × · [괴력X] 깨우친 힘 — 결정적인 순간에만 × ·')
rep("['pierce.str', '투구째 꿰뚫음: 괴력 배율 이 이상']", "['pierce.str', '투구째 꿰뚫음: 근력 배율 이 이상']")
# 아이콘: 근력 = 중압 견디기 (칸 43)
rep('"열매 맺기": 42}}', '"열매 맺기": 42, "근력": 43}}')
# 로그 · 나레이션
rep("      case 'grab': out.push(", """      case 'might': out.push(`${T(e)}💪 ${n(e.a)} 괴력 ×${e.m} — ${{ resist: '크게 밀려나지 않고 버팀', stand: '넘어지지 않고 버팀', grip: '잡힌 무기를 뿌리침', parry: '무너지려던 막기를 튕겨냄', brace: '들이받히는 순간 버팀', ram: '되튕기지 않고 밀어붙임', push: '밀치기로 밀어붙임' }[e.how] || e.how}${e.b != null ? ' (' + n(e.b) + ')' : ''} — 잠깐 빈틈`); break;   // v7.24.2
      case 'grab': out.push(""")
rep("    case 'grab': return {", """    case 'might': return U(e.a).side === 0 || e.how === 'parry' || e.how === 'grip' ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${{ resist: '이를 악물고 버틴다', stand: '쓰러지지 않고 버틴다', grip: '붙잡힌 무기를 뿌리친다', parry: '무너지려던 막기로 상대를 튕겨낸다', brace: '들이받히는 순간 버텨 선다', ram: '되튕기지 않고 밀어붙인다', push: '단숨에 밀어붙인다' }[e.how] || '힘을 쓴다'} — 괴력!` } : null;   // v7.24.2
    case 'grab': return {""")
# 상세 칸: 괴력 준비 · 대기
rep("    ${u.gear && Object.keys(u.gear).length && known ? `<span class=\"tr\"><span class=\"lb\">방어구</span>",
    "    ${(u.might || 1) > 1 && known ? `<span class=\"tr\"><span class=\"lb\">괴력</span> 순간 ×${u.might} — ${Wd.t >= (u.mightCd || -9) ? '준비됨' : '대기 ' + ((u.mightCd || 0) - Wd.t).toFixed(1) + '초'}${u.mightN ? ' · 쓴 ' + u.mightN + '번' : ''}</span>` : ''}\n    ${u.gear && Object.keys(u.gear).length && known ? `<span class=\"tr\"><span class=\"lb\">방어구</span>")
# 저장된 것 한 번: 괴력X 만 있으면 같은 등급 근력X 를 더함 (숫자 그대로) · 쟝에 괴력C
rep("// v7.16 친칠라 공격 24 → 25", """// v7.24.2 근력 · 괴력 나눔 — 저장된 판 · 내 설계 · 층 · 캠페인 (맵의 남은 적 · 원래 배치) 에도 한 번: [괴력X] 만 있으면 같은 등급 [근력X] 를 앞에 더함 (공격 배율 그대로) · 쟝 (C-262) 에 [괴력C]
const fix7242 = p => { if (!p) return false; const tr = p.traits || (p.traits = []); let c = false; const g = tr.map(x => /^괴력([SABC])$/.exec(x)).find(Boolean);
  if (g && !tr.some(x => /^근력/.test(x))){ tr.splice(tr.indexOf(g[0]), 0, '근력' + g[1]); c = true; }
  if (p.ref === 'C-262' && !tr.some(x => /^괴력/.test(x))){ const j = tr.indexOf('일반인'); if (j >= 0) tr.splice(j, 0, '괴력C'); else tr.push('괴력C'); c = true; } return c; };
if (!S.v7242m){ for (const u of S.units) fix7242(u); try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fix7242(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}
  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fix7242(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {}
  try { if (S.campBak && S.campBak.units) for (const u of S.campBak.units) fix7242(u); if (S.camp && S.camp.stages) for (const k in S.camp.stages){ const st = S.camp.stages[k]; for (const f of (st && st.foes) || []) fix7242(f); } for (const p of (S.camp && S.camp.lostP) || []) fix7242(p); } catch (e) {} S.v7242m = true; }
// v7.16 친칠라 공격 24 → 25""")
open(F, 'w', encoding='utf-8').write(s)
print('ok')
