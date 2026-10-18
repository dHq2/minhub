# v7.14.0 페이지 — page714.py v1.1 (v1.1: 아군 칩 여섯 이상 · 좁은 폰 = 이름 글씨 조금 작게)
# 친칠라 (C-106 · 하얀 나무 · 2편대) · 은신 등급 (설계 · 옛 저장) · 야시 S · 도약 사격 기록 · 특성 탭 + 매 판 특성 검사
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.13.0 (2026-10-17)', '<!-- 굴의 전투판 v7.14.0 (2026-10-17)')
rep('     v7.13.0: ', '''     v7.14.0: 친칠라 (C-106) — 심해에서 혼자 떨어진 사냥꾼 · 정령 (물) · 후드. 고유 무기 하얀 나무 (장궁): 사거리 10칸 (활 6칸) · 화살은 궁수의 활보다 느리고 (200 · 활 240) 약함 (위력 55 · 활 70 · 관통 0.55).
         근력은 궁수보다 약함 (공격 24 · 궁수 30) · 속력은 노먼보다 조금 느림 (2.95 · 노먼 3.2) · 체력 100 · [사격A] · [은신S] · 야시 S · 도약. 2편대 (노먼) 로 기본 배치 · 옛 저장 판에는 노먼 곁에 한 번 놓음.
         [가호:바다] (익사 안 함 · 물속에서 빠름) · [축복:바다] (물 · 비 · 습할 때 전투력 ↑) 는 아직 글로만 — 물 지형 · 날씨가 생기면 효과.
         은신 등급 [은신S ~ E] (몸 · 직업 · 갑옷으로 어림하던 숨는 솜씨 대신): S 1 · A 0.85 · B 0.7 · C 0.55 · D 0.4 · E 0.3. 숨을 때 (은신 걸음 · 매복) 들킬 거리 × (1 − 솜씨 × (1 − 빛 · 어스름 · 어둠 값)) ·
         숨지 않아도 어둠 속 (횃불 끔 · 뛰지 않음 · 방금 치지 않음) 에선 보이는 거리 × (S 0.9 · A 0.94 · B 0.975) · 엎드린 몸이 관측 기회에 들킬 확률 × (S 0.5 ~ E 1.2). E 는 어둠 속에 가만히 있을 때만 숨음.
         정한 등급: 친칠라 · 궁수 S · 노먼 · 검방패기사 · 창병 · 검기사 A · 청광묵 B · 레베카 · 곤봉적 C · 카리우스 E (등급이 없는 인물은 예전처럼 몸 · 직업 · 갑옷으로 어림). 옛 저장 · 내 설계 · 층에도 한 번 붙임.
         도약 사격: 활을 든 몸 (궁수 · 친칠라) 은 도약하는 중에도 쏨 (뛴 길의 반쯤 · 조준 × 0.6 · 뛰게 만든 상대 → 없으면 가장 가까이 보이는 상대). 엎드려서는 활을 못 쏨 (예전 그대로).
         야시 S: 어둠 속에서도 보는 거리 전부 · 밝은 빛에도 눈부시지 않음 (화광 실명 없음) · 어둠 속 명중 그대로 (×1) · 어둠 속 손짓 전달 0.9.
         특성 탭: 판 · 설계 칸 인물의 등급 특성 (누가 무슨 등급) · 보통 특성 · ◆고유 · 액티브 · 종족 · 가호 · 축복을 한눈에. 판을 시작할 때마다 특성 검사 —
         중복 · 같은 등급 특성 둘 · 설명 없는 특성 · 제약에 걸린 무기 · [높은후각] + [후각X] · [일반인] + [망자] · 재생 없는 불사 · 잘 숨는 거구 · 빠진 정체성 · 2편대장 둘 · 편대장 없는 2편대 — 있으면 알림 · 기록 · 특성 탭.
     v7.13.0: ''')
rep('h1::after{content:" v7.13.0"', 'h1::after{content:" v7.14.0"')
rep('<footer>굴의 전투판 v7.13.0', '<footer>굴의 전투판 v7.14.0')
rep('return `굴의 전투판 v7.13.0 · ${title}', 'return `굴의 전투판 v7.14.0 · ${title}')
rep("copyText('굴의 전투판 v7.13.0 자동 판 기록", "copyText('굴의 전투판 v7.14.0 자동 판 기록")
rep('의 버전 기록에 — v7.13.0 지휘망 그물', '의 버전 기록에 — v7.14.0 친칠라 · 은신 등급 · 도약 사격 · 특성 탭 / v7.13.0 지휘망 그물')
rep('">v7.13.0 · 지휘망 그물 · 노먼 자율 지시 · 편대</span>', '">v7.14.0 · 친칠라 · 은신 등급 · 특성 탭</span>')
rep("RULES_MIG = '7.13.0'", "RULES_MIG = '7.14.0'")

# ---------- 특성 설명 ----------
rep("  '야시': 'A: 어둠 속에서도 보는 거리 전부 (9칸). B: 어둠 속에서는 5칸까지. 야시가 없으면 빛 없는 칸의 상대는 몸이 닿아야 겨우 알고, 거의 못 맞힘',",
    "  '야시': 'S: 어둠 속에서도 보는 거리 전부 (9칸) · 밝은 빛에도 눈부시지 않음 · 어둠 속 명중 그대로. A: 어둠 속에서도 9칸. B: 어둠 속에서는 5칸까지. C: 3.75칸. D: 2.5칸. 야시가 없으면 빛 없는 칸의 상대는 몸이 닿아야 겨우 알고, 거의 못 맞힘',   // v7.14 S")
rep("  '방어 자세': '방패 · 대검: 앞에서 오는 공격을 막음 (피해 ×0.2, 자세가 깎임 · 0 이면 잠깐 무너짐). 사선에 서면 뒤의 아군을 가려 줌',\n};",
    """  '방어 자세': '방패 · 대검: 앞에서 오는 공격을 막음 (피해 ×0.2, 자세가 깎임 · 0 이면 잠깐 무너짐). 사선에 서면 뒤의 아군을 가려 줌',
  '가호:바다': '바다의 가호 (바다 종족) — 익사하지 않음 · 물속에서 더 빨리 움직임. 아직 글로만 (물 지형이 생기면 효과)',   // v7.14 친칠라
  '축복:바다': '바다의 축복 (물의 가호) — 물이 있는 곳 · 비가 오거나 습할 때 전투력이 오름. 아직 글로만 (물 지형 · 날씨가 생기면 효과)',
};""")
rep("const GRADE_KEYS = ['속력', '괴력', '지휘', '사격', '회피', '급소'];", "const GRADE_KEYS = ['속력', '괴력', '지휘', '사격', '회피', '급소', '은신'];   // v7.14 은신 (S ~ E)")
rep("function traitDesc(t){\n", """function traitDesc(t){
  { const g = /^은신([SABCDE])$/.exec(t); if (g){ const G = (rules.grades || {})['은신'] || {}, k = G[g[1]] != null ? G[g[1]] : 0.6, St = rules.stealth || {}, P = St.passive || {}, ps = Math.min(1, 1 - (k - (P.mid != null ? P.mid : 0.6)) * (P.k || 0.25)), lm = Math.max(0.5, Math.min(1.3, 1.5 - k));   // v7.14
    return `숨는 솜씨 ${k} — 숨을 때 (은신 걸음 · 매복) 들킬 거리 × (어둠 ${+(1 - k * (1 - (St.dark || 0.45))).toFixed(2)} · 어스름 ${+(1 - k * (1 - (St.dim || 0.6))).toFixed(2)} · 빛 ${+(1 - k * (1 - (St.lit || 0.75))).toFixed(2)})${ps < 1 ? ' · 숨지 않아도 어둠 속에선 보이는 거리 ×' + +ps.toFixed(3) : ''} · 엎드린 몸이 들킬 확률 ×${+lm.toFixed(2)}${g[1] === 'E' ? ' · 어둠 속에 가만히 있을 때만 숨음 (빛 · 어스름 · 움직이면 그대로 보임)' : ''}`; } }
  { const f = /^후각([SABC])$/.exec(t); if (f){ const v = (rules.smellG || {})[f[1]] || [3, 8]; return `후각 ${f[1]} — 빛 · 바위와 상관없이 냄새로 ${v[0]}칸 안은 정확히${f[1] === 'S' ? ' · 맵 전체를 대략' : ' · ' + v[1] + '칸까지 대략 (방향 · 거리)'}`; } }   // v7.14 특성 탭 · 검사
""")

# ---------- 은신 등급: 설계 ----------
rep("traits: ['지휘C', '사격A', '베테랑'], gear: { 몸: { name: '방탄복', mat: '방탄', tier: 2 } }, skill: KIT,", "traits: ['지휘C', '사격A', '베테랑', '은신A'], gear: { 몸: { name: '방탄복', mat: '방탄', tier: 2 } }, skill: KIT,")
rep("nvG: 'A', traits: ['불사', '재생', '베테랑'], gear: { 몸: { name: '낡은 판금 갑옷', mat: '판금', tier: 3 }, 머리: { name: '기사 투구', mat: '투구', tier: 3 } }, tactic: '선봉 · 불사',",
    "nvG: 'A', traits: ['불사', '재생', '베테랑', '은신C'], gear: { 몸: { name: '낡은 판금 갑옷', mat: '판금', tier: 3 }, 머리: { name: '기사 투구', mat: '투구', tier: 3 } }, tactic: '선봉 · 불사',")
rep("traits: ['거구', '갑피', '괴력A', '머리 넷'], unique: ['개조된 신체'], modBody: true,", "traits: ['거구', '갑피', '괴력A', '머리 넷', '은신E'], unique: ['개조된 신체'], modBody: true,")
rep("traits: ['회피A', '급소A', '발화E', '실명:좌안', '후각B'], active: ['도약', '팜 버스트'], race: '고블린',", "traits: ['회피A', '급소A', '발화E', '실명:좌안', '후각B', '은신B'], active: ['도약', '팜 버스트'], race: '고블린',")
rep("ov: { hp: 200, atk: 28 }, traits: ['베테랑', '망자'], gear:", "ov: { hp: 200, atk: 28 }, traits: ['베테랑', '망자', '은신A'], gear:")
rep("ov: { hp: 150, atk: 34 }, traits: ['공통스킬:투창', '베테랑', '망자'], gear:", "ov: { hp: 150, atk: 34 }, traits: ['공통스킬:투창', '베테랑', '망자', '은신A'], gear:")
rep("ov: { hp: 150, atk: 30 }, traits: ['베테랑', '사격S', '망자'], active: ['도약'],", "ov: { hp: 150, atk: 30 }, traits: ['베테랑', '사격S', '망자', '은신S'], active: ['도약'],")
rep("ov: { hp: 170, atk: 32 }, traits: ['베테랑', '망자'], tac: '',", "ov: { hp: 170, atk: 32 }, traits: ['베테랑', '망자', '은신A'], tac: '',")
rep("ov: { rng: 0.75, hp: 400, atk: 55 }, traits: ['거구', '지휘B', '베테랑', '망자'],", "ov: { rng: 0.75, hp: 400, atk: 55 }, traits: ['거구', '지휘B', '베테랑', '망자', '은신C'],")
# 친칠라
rep("왼눈을 잃음 (왼쪽 사각)' },   // v6.7 설계 칸만 (판에는 놓지 않음)",
    """왼눈을 잃음 (왼쪽 사각)' },   // v6.7 설계 칸만 (판에는 놓지 않음)
  { key: '친칠라', side: 0, ref: 'C-106', name: '친칠라', tier: 2, sq: 'B', cls: '원거리', role: '사수', weapon: '하얀 나무', ammo: 30, sm: 1.34, height: 1.65, nv: true, nvG: 'S', ov: { hp: 100, atk: 24 }, traits: ['사격A', '은신S', '가호:바다', '축복:바다'], active: ['도약'], race: '정령 (물) · 심해 종족', tactic: '사냥꾼 · 장궁 (하얀 나무) · 도약 사격', note: '심해에서 혼자 떨어진 사냥꾼 (주운 장비 · 후드). 조용히 떠다니다 먹이를 덮치는 심해 생물이라 숨는 솜씨가 뛰어남 (은신 S) · 야시 S (빛에도 눈부시지 않음). 고유 무기 하얀 나무 (장궁): 사거리 10칸 — 다만 화살이 궁수의 활보다 느리고 약하고 근력도 약해, 역전의 명사수인 궁수와 1대1 로 맞쏘면 질 수 있음 (거리 · 어둠 · 은신으로 싸움). 도약하며 쏨 · 엎드려서는 못 쏨' },   // v7.14 2편대 (노먼)""")
rep("  'C-004': { cls: '기동', race: '고블린', allyNv: 'B' },   // v6.7 청광묵 (나머지는 설계 칸에서)",
    "  'C-004': { cls: '기동', race: '고블린', allyNv: 'B' },   // v6.7 청광묵 (나머지는 설계 칸에서)\n  'C-106': { cls: '원거리', race: '정령 (물) · 심해 종족', allyNv: 'S' },   // v7.14 친칠라 (나머지는 설계 칸에서)")
rep("'C-004': { traits: ['발화E', '실명:좌안', '후각B'], active: ['팜 버스트'] },", "'C-004': { traits: ['발화E', '실명:좌안', '후각B'], active: ['팜 버스트'] }, 'C-106': { traits: ['가호:바다', '축복:바다'] },")
# 기본 배치
rep("put('카리우스', 'r4'); put('청광묵', 'o3');   // v7.13 2편대 (노먼 · 청광묵)", "put('카리우스', 'r4'); put('청광묵', 'o3'); put('친칠라', 'o4');   // v7.13 2편대 (노먼 · 청광묵)   // v7.14 친칠라")
rep("  put: [['인주', 'q4'], ['노먼', 'r4'], ['청광묵', 's4'], ['카리우스', 'q5'], ['레베카', 'r5'],", "  put: [['인주', 'q4'], ['노먼', 'r4'], ['청광묵', 's4'], ['친칠라', 's5'], ['카리우스', 'q5'], ['레베카', 'r5'],")

# ---------- 옛 저장: 은신 등급 · 친칠라 ----------
rep("if (fixGob75(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {} S.v750g = true; }",
    """if (fixGob75(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {} S.v750g = true; }
// v7.14 은신 등급 (민수가 정한 것) — 저장된 판 · 내 설계 · 층에도 한 번만 (그 뒤 바꾸는 건 자유) · 옛 판에는 친칠라를 노먼 곁 (2편대) 에 한 번
const STL_REF = { 'C-106': 'S', 'C-056': 'S', 'C-007': 'A', 'C-054': 'A', 'C-053': 'A', 'C-052': 'A', 'C-004': 'B', 'C-002': 'C', 'C-055': 'C', 'C-003': 'E' };
const fixStl714 = p => { const g = p && STL_REF[p.ref]; if (!g || (p.traits || []).some(x => /^은신[SABCDE]$/.test(x))) return false; p.traits = [...(p.traits || []), '은신' + g]; return true; };
if (!S.v714s){ for (const u of S.units) fixStl714(u); try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fixStl714(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}
  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fixStl714(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {}
  const nm = S.units.find(u => u.side === 0 && u.ref === 'C-007'), dz = designByKey('친칠라');
  if (nm && dz && !S.units.some(u => u.ref === 'C-106')){ let m = null; try { m = buildMap(S); } catch (e) {} let spot = null;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1], [-2, 0], [2, 0], [0, -2], [0, 2]]){ const x = nm.x + dx, y = nm.y + dy; if (x < 0 || y < 0 || x >= S.W || y >= S.H || (m && rock(m, x, y)) || S.units.some(u => Math.hypot(u.x - x, u.y - y) < 0.8)) continue; spot = { x, y }; break; }
    if (spot){ S.units.push({ ...fromDesign(dz, 0), ...spot }); setTimeout(() => { save(); toast('친칠라를 노먼 곁 (2편대) 에 놓았어요 — 배치에서 옮기거나 뺄 수 있어요'); }, 1500); } }
  S.v714s = true; }""")

# ---------- 야시 S (설계 칸 · 정보) ----------
rep("""<select id="selNvG" aria-label="야시 등급"><option value="A" ${p.nvG === 'A' ? 'selected' : ''}>야시 A (9칸)</option><option value="B" ${p.nvG !== 'A' && p.nvG !== 'C' && p.nvG !== 'D' ? 'selected' : ''}>""",
    """<select id="selNvG" aria-label="야시 등급"><option value="S" ${p.nvG === 'S' ? 'selected' : ''}>야시 S (9칸 · 빛에 눈부시지 않음)</option><option value="A" ${p.nvG === 'A' ? 'selected' : ''}>야시 A (9칸)</option><option value="B" ${p.nvG !== 'S' && p.nvG !== 'A' && p.nvG !== 'C' && p.nvG !== 'D' ? 'selected' : ''}>""")
rep("' — 어둠 속 ' + (u.nvG === 'A' ? S3.sight :", "' — 어둠 속 ' + (u.nvG === 'A' || u.nvG === 'S' ? S3.sight :")

# ---------- 등급 고르기 · 수치표 (은신 D · E) ----------
rep("""<select id="gr-${k}" data-grade="${k}"><option value="">없음</option>${['C', 'B', 'A', 'S'].map(""", """<select id="gr-${k}" data-grade="${k}"><option value="">없음</option>${(k === '은신' ? ['E', 'D', 'C', 'B', 'A', 'S'] : ['C', 'B', 'A', 'S']).map(""")
rep("""$('gradeTbl').innerHTML = '<thead><tr><th class="l">특성</th><th>S</th><th>A</th><th>B</th><th>C</th></tr></thead><tbody>' + GRADE_KEYS.map(k => `<tr><td class="l">${k}</td>${['S', 'A', 'B', 'C'].map(g => `<td>${n(`grades.${k}.${g}`, rules.grades[k][g], 0.05)}</td>`).join('')}</tr>`).join('') + '</tbody>';""",
    """$('gradeTbl').innerHTML = '<thead><tr><th class="l">특성</th><th>S</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead><tbody>' + GRADE_KEYS.map(k => `<tr><td class="l">${k}</td>${['S', 'A', 'B', 'C', 'D', 'E'].map(g => rules.grades[k] && rules.grades[k][g] != null ? `<td>${n(`grades.${k}.${g}`, rules.grades[k][g], 0.05)}</td>` : '<td>―</td>').join('')}</tr>`).join('') + '</tbody>';   // v7.14 은신 D · E""")
rep("<p class=\"lab\">등급 특성 ([속력X] 이동 속력 × · [괴력X] 공격 × , 막힐 때 상대 자세도 ×)</p>", "<p class=\"lab\">등급 특성 ([속력X] 이동 속력 × · [괴력X] 공격 × , 막힐 때 상대 자세도 × · [은신X] 숨는 솜씨 — E 는 어둠 속에 가만히 있을 때만)</p>")

# ---------- 기록 · 서술 ----------
rep("      case 'sqWeak': out.push(", """      case 'leapShot': out.push(`${T(e)}🏹 ${n(e.a)} — 도약하며 쏨 → ${n(e.b)}`); break;   // v7.14
      case 'traitAudit': out.push(`${T(e)}🔎 특성 검사 — ${e.n ? e.n + '건: ' + e.list.join(' / ') : '이상 없음 (중복 · 모순 · 빠진 정체성 없음)'}`); break;   // v7.14 매 판
      case 'sqWeak': out.push(""")
rep("    case 'sqWeak': return null;", """    case 'leapShot': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 뛰어오르며 ${n(e.b)}에게 활을 쏜다!` };   // v7.14
    case 'traitAudit': return null;
    case 'sqWeak': return null;""")

# ---------- 특성 탭 ----------
rep("""        <button class="tab" type="button" data-tab="rules" role="tab">수치</button>""", """        <button class="tab" type="button" data-tab="rules" role="tab">수치</button>
        <button class="tab" type="button" data-tab="traits" role="tab">특성</button>""")
rep("""      <div class="pane" id="pane-log" hidden>""", """      <div class="pane" id="pane-traits" hidden>
        <div class="box"><p class="lab">특성 검사 — 판을 시작할 때마다 (중복 · 모순 · 빠진 정체성 · 설명 없는 특성 · 제약에 걸린 무기)</p><div class="row"><button class="btn" id="traitRecheck" type="button">다시 검사</button></div><div id="traitAuditBox"></div></div>
        <div class="box"><p class="lab">등급 특성 — 누가 무슨 등급 (흐린 이름 = 설계 칸에만 있음)</p><div class="tw"><table class="tbl" id="traitGradeTbl"></table></div><p class="note" id="traitGradeNote"></p></div>
        <div class="box"><p class="lab">보통 특성</p><div class="tw"><table class="tbl" id="traitTbl"></table></div></div>
        <div class="box"><p class="lab">◆고유특성 · 액티브 스킬</p><div class="tw"><table class="tbl" id="traitUniTbl"></table></div></div>
        <div class="box"><p class="lab">종족 · 가호 · 축복</p><div class="tw"><table class="tbl" id="traitRaceTbl"></table></div></div>
      </div>

      <div class="pane" id="pane-log" hidden>""")
rep("for (const p of ['fight', 'place', 'rules', 'log']) $('pane-' + p).hidden = p !== k; }", "for (const p of ['fight', 'place', 'rules', 'traits', 'log']) $('pane-' + p).hidden = p !== k; if (k === 'traits') renderTraitsTab(); }   // v7.14 특성 탭")
rep("document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));",
    """document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));
$('traitRecheck').addEventListener('click', () => { renderTraitsTab(); toast('특성을 다시 검사했어요'); });   // v7.14
// v7.14 특성 검사: 중복 · 같은 등급 특성 둘 · 설명 없는 특성 · 제약에 걸린 무기 · 서로 어긋나는 특성 · 빠진 정체성 · 편대장 — 판 (S.units) · 설계 칸 모두에 씀
const GRADE_RE = /^(속력|괴력|지휘|사격|회피|급소|은신|후각|발화)([SABCDE])$/, GRADE_OK = { 은신: 'SABCDE', 발화: 'SABCDE' };
const traitKnown = t => { const m = GRADE_RE.exec(t); return m ? (GRADE_OK[m[1]] || 'SABC').includes(m[2]) : !!TRAITS[t] || t === '야시'; };
function traitAudit(list){
  const out = [], add = (lv, who, msg) => out.push({ lv, who, msg });
  for (const p of list){ const tr = p.traits || [], nm = p.name || p.key || '?', gk = {}, seen = new Set();
    for (const t of tr){ if (seen.has(t)) add('dup', nm, `[${t}] 가 두 번`); seen.add(t); const m = GRADE_RE.exec(t); if (m) (gk[m[1]] = gk[m[1]] || []).push(m[2]); }
    for (const k in gk){ const g = [...new Set(gk[k])]; if (g.length > 1) add('bad', nm, `${k} 등급이 둘 (${g.map(x => '[' + k + x + ']').join(' · ')}) — 하나만`); }
    for (const t of new Set(tr)) if (!traitKnown(t)) add('warn', nm, `[${t}] — 설명 · 효과가 정해지지 않은 특성`);
    if (p.weapon && !(rules.weapons || {})[p.weapon]) add('warn', nm, `${p.weapon} — 무기표에 없는 무기`); else if (p.weapon && !weaponOk(p, p.weapon)) add('bad', nm, `${p.weapon} — 제약 특성 때문에 못 다루는 무기를 듦`);
    if (tr.includes('높은후각') && gk['후각']) add('bad', nm, '[높은후각] 과 [후각X] 를 함께 가짐 — 하나만');
    if (tr.includes('일반인') && tr.includes('망자')) add('bad', nm, '[일반인] 과 [망자] 는 함께일 수 없음');
    if (tr.includes('불사') && !tr.includes('재생')) add('warn', nm, '[불사] 인데 [재생] 이 없음 (불사는 재생으로 일어남)');
    if ((tr.includes('거구') || p.modBody) && gk['은신'] && 'SAB'.includes(gk['은신'][0])) add('warn', nm, `거구인데 [은신${gk['은신'][0]}] — 큰 몸은 잘 못 숨음`);
    for (const x of p.unique || []) if (!UNIQUE[x]) add('warn', nm, `◆${x} — 설명이 없는 고유특성`);
    for (const a of p.active || []) if (!ACTIVE[a]) add('warn', nm, `액티브 '${a}' — 설명이 없음`);
    const idm = p.ref ? idTraits(p.ref).filter(t => !tr.includes(t)) : []; if (idm.length) add('bad', nm, '정체성 특성이 빠짐: ' + idm.map(t => '[' + t + ']').join(' · '));
    if (p.nv && p.nvG && !'SABCD'.includes(p.nvG)) add('warn', nm, `야시 등급 '${p.nvG}' 을 모름 (B 로 봄)`);
    if (p.side === 0 && p.rank === '부대장' && p.sq !== 'B') add('warn', nm, '2편대장인데 편대가 본대'); }
  const S0 = list.filter(p => p.side === 0 && !p.base && !p.mine), ld = S0.filter(p => p.rank === '부대장');
  if (ld.length > 1) add('bad', ld.map(p => p.name).join(' · '), '2편대장이 둘 넘음 — 하나만');
  if (!ld.length && S0.some(p => p.sq === 'B')) add('warn', S0.filter(p => p.sq === 'B').map(p => p.name).join(' · '), '2편대에 편대장이 없음 (본대 지휘로만 움직임)');
  return out;
}
function auditGroup(items){ const m = new Map(); for (const x of items){ const k = x.lv + '|' + x.msg; if (!m.has(k)) m.set(k, { lv: x.lv, msg: x.msg, who: [] }); const g = m.get(k); if (!g.who.includes(x.who)) g.who.push(x.who); } return [...m.values()].sort((a, b) => ['bad', 'dup', 'warn'].indexOf(a.lv) - ['bad', 'dup', 'warn'].indexOf(b.lv)); }
const AUDIT_LV = { bad: '✕ 모순', dup: '⧉ 중복', warn: '⚠ 확인' };
// v7.14 특성 탭: 판 · 설계 칸 인물의 특성을 한눈에
function traitPeople(){ const m = new Map(); for (const u of S.units) if (!m.has(u.name)) m.set(u.name, { p: u, on: true }); for (const d of designList()) if (!m.has(d.key)) m.set(d.key, { p: { ...d, name: d.key }, on: false }); return [...m.values()]; }
function gradeOfP(p, k){ if (k === '야시') return p.nv ? (p.nvG || 'B') : ''; if (k === '후각') return smellGrade(p); const t = (p.traits || []).find(x => { const m = GRADE_RE.exec(x); return m && m[1] === k; }); return t ? t.slice(-1) : ''; }
function renderTraitsTab(){
  if (!$('traitAuditBox')) return;
  const P = traitPeople(), who = L => L.length ? L.map(x => `<span class="${x.on ? '' : 'lb'}">${esc(x.p.name)}</span>`).join(' · ') : '<span class="lb">―</span>';
  const aB = auditGroup(traitAudit(S.units)), aD = auditGroup(traitAudit(designList().map(d => ({ ...d, name: d.key }))));
  const aH = (L, ttl) => `<p class="sublab">${ttl} — ${L.length ? L.length + '건' : '이상 없음'}</p>` + L.map(x => `<div class="tr">${AUDIT_LV[x.lv]} · ${esc(x.who.join(' · '))}: ${esc(x.msg)}</div>`).join('');
  $('traitAuditBox').innerHTML = aH(aB, '지금 판') + aH(aD, '설계 칸');
  const GK = [...GRADE_KEYS, '후각', '발화', '야시'], GS = ['S', 'A', 'B', 'C', 'D', 'E'];
  $('traitGradeTbl').innerHTML = '<thead><tr><th class="l">특성</th>' + GS.map(g => `<th class="l">${g}</th>`).join('') + '</tr></thead><tbody>' + GK.map(k => `<tr><td class="l">${k}</td>${GS.map(g => `<td class="l">${who(P.filter(x => gradeOfP(x.p, k) === g))}</td>`).join('')}</tr>`).join('') + '</tbody>';
  const noS = P.filter(x => x.on && x.p.side === 0 && !gradeOfP(x.p, '은신'));
  $('traitGradeNote').textContent = noS.length ? `은신 등급이 없는 아군 (몸 · 직업 · 갑옷으로 어림): ${noS.map(x => x.p.name).join(' · ')}` : '';
  const isG = t => GRADE_RE.test(t) || t === '야시';
  $('traitTbl').innerHTML = '<thead><tr><th class="l">특성</th><th class="l">가진 인물</th><th class="l">설명</th></tr></thead><tbody>' + Object.keys(TRAITS).filter(t => !isG(t)).map(t => `<tr><td class="l">[${esc(t)}]</td><td class="l">${who(P.filter(x => (x.p.traits || []).includes(t)))}</td><td class="l">${esc(traitDesc(t))}</td></tr>`).join('') + '</tbody>';
  $('traitUniTbl').innerHTML = '<thead><tr><th class="l">이름</th><th class="l">가진 인물</th><th class="l">파생 · 제약 · 설명</th></tr></thead><tbody>' +
    Object.keys(UNIQUE).map(k => { const U0 = UNIQUE[k]; return `<tr><td class="l">◆${esc(k)}</td><td class="l">${esc(RBY[U0.who] ? RBY[U0.who][1] : U0.who)}</td><td class="l">${esc([...U0.derived, ...U0.limits].map(t => '[' + t + ']').join(' '))}</td></tr>`; }).join('') +
    Object.keys(ACTIVE).map(a => `<tr><td class="l">액티브 · ${esc(a)}</td><td class="l">${who(P.filter(x => (x.p.active || []).includes(a)))}</td><td class="l">${esc(ACTIVE[a])}</td></tr>`).join('') + '</tbody>';
  const races = [...new Set(P.map(x => x.p.race).filter(Boolean))], bl = Object.keys(TRAITS).filter(t => /^(가호|축복):/.test(t));
  $('traitRaceTbl').innerHTML = '<thead><tr><th class="l">종족 · 가호 · 축복</th><th class="l">가진 인물</th><th class="l">효과</th></tr></thead><tbody>' +
    races.map(r => `<tr><td class="l">${esc(r)}</td><td class="l">${who(P.filter(x => x.p.race === r))}</td><td class="l lb">종족 (설정)</td></tr>`).join('') +
    bl.map(t => `<tr><td class="l">[${esc(t)}]</td><td class="l">${who(P.filter(x => (x.p.traits || []).includes(t)))}</td><td class="l">${esc(TRAITS[t])}</td></tr>`).join('') + '</tbody>';
}""")
# 매 판 검사
rep("  const h = world.units.find(u => u.hero); sel = new Set();   // v5.4.2",
    """  { const A = auditGroup(traitAudit(S.units)); logEv(world, { k: 'traitAudit', n: A.length, list: A.slice(0, 8).map(x => `${AUDIT_LV[x.lv]} ${x.who.join(' · ')}: ${x.msg}`) });   // v7.14 매 판 특성 검사
    if (A.length){ const c = l => A.filter(x => x.lv === l).length; setTimeout(() => toast(`🔎 특성 검사: ${[c('bad') ? '모순 ' + c('bad') : '', c('dup') ? '중복 ' + c('dup') : '', c('warn') ? '확인 ' + c('warn') : ''].filter(Boolean).join(' · ')} — 특성 탭에서 봐요`), nOp ? 2300 : 0); } }
  const h = world.units.find(u => u.hero); sel = new Set();   // v5.4.2""")

# ---------- 모바일: 아군 칩 여섯 이상 ----------
rep(".dchip .cnm{grid-column:1 / 3;font:700 11.5px/1.15 var(--body);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.2px}",
    ".dchip .cnm{grid-column:1 / 3;font:700 11.5px/1.15 var(--body);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.2px}\n@media (max-width:400px){.dchips.many .dchip{padding-left:3px;padding-right:3px}.dchips.many .dchip .cnm{font-size:10.5px;letter-spacing:-.6px}}   /* v7.14 아군 여섯 이상이면 좁은 폰에서 이름 글씨를 조금 줄임 (카리우스가 잘리지 않게) */")
rep("  $('dActs').classList.toggle('two',", "  $('dChips').classList.toggle('many', (chips.match(/class=\"dchip/g) || []).length >= 6);   // v7.14\n  $('dActs').classList.toggle('two',")

open(F, 'w', encoding='utf-8').write(s)
print('page714 OK')
