import sys
p='page10.tpl.html'; s=open(p,encoding='utf-8').read()
def rep(o,n,c=1):
    global s
    k=s.count(o)
    if k!=c: print('MISMATCH',k,o[:90]); sys.exit(1)
    s=s.replace(o,n)
# 버전
rep("<!-- 굴의 전투판 v4.9 (2026-10-10)","<!-- 굴의 전투판 v5.0 (2026-10-11)")
rep("     v4.9: 영리한 사수","""     v5.0: 역할 (포지션) — 전선 · 미드필더 · 공격수 (+ 사수 · 지원). 따로 정하지 않으면 장비 · 직업으로: 방패 = 전선, 포위 사냥 · 기동 = 미드필더, 원거리 무기 = 사수,
           치유 · 지휘 = 지원, 근접 = 공격수 (포렌은 전선). 인물마다 바꿀 수 있음 (배치 → 인물 → 역할).
           전선: 체력 ×1.15 · 공격 ×0.9 · 방어 재능 1. 무리 앞 전선 ('뒤로!') · 노출된 동료 막아서기 · 우위면 치고 나감. 전선이 아닌 인물은 방패 · 대검을 들어도 덜 막음.
           미드필더: 속력 ×1.05 · 방어 재능 0.6. 상대 전선 (이쪽을 막고 선 방패 · 대검) 정면을 피해 막는 폭 밖으로 돌아 들어감 ('돌파'), 전선 뒤 사수 · 치유를 노림,
           친 뒤 둘레에 상대가 둘 이상이거나 다치면 빠졌다가 다시 ('빠져나감'). 방패 뒤에 서지 않음. 둘 이상이 기다리는 쪽으로는 파고들지 않음.
           공격수: 체력 ×0.85 · 공격 ×1.2 · 방어 재능 0.5. 잡을 수 있는 상대 (다친 · 동료와 맞붙은 · 고립된) 를 고르고, 체력 35% 아래면 '마무리' (막고 선 방패 정면엔 안 들어감).
           방어 재능 g: 막는 폭 ×(0.6 + 0.4g) · 막을 때 받는 피해 1 − 0.8g (전선 0.2, 공격수 0.6) · 자세 깎임 ×(2 − g). [반사신경] 은 최소 0.9.
           치고 나가기 (아군도 병사): 둘레 힘의 비 (우리 ÷ 아는 상대, 힘 = √(체력 × 초당 공격), 방어 자세 · 투창 · 탄약 반영) 가 기준 이상이면 들어감.
           기준 = 1.5 − 대담함 × 0.7 (대담할수록 작은 우위에도), 전선 +0.2 · 공격수 −0.1. 한 번 나가면 1.5초는 그대로. 적 방패병도 같은 규칙으로 밀고 나옴.
     v4.9: 영리한 사수""")
for o,n in [('<span class="ver">v4.9 ·','<span class="ver">v5.0 ·'),("<footer>굴의 전투판 v4.9 —","<footer>굴의 전투판 v5.0 —"),("return `굴의 전투판 v4.9 ·","return `굴의 전투판 v5.0 ·"),("copyText('굴의 전투판 v4.9 자동 판 기록","copyText('굴의 전투판 v5.0 자동 판 기록")]: rep(o,n)
# 프로필: 포렌 전선, 방패병 설명
rep("""  'C-006': { traits: ['높은후각', '반사신경'],""","""  'C-006': { role: '전선', traits: ['높은후각', '반사신경'],""")
rep("""노출된 동료 앞을 막아섬. 밀고 나가지 않고 버팀' },""","""노출된 동료 앞을 막아섬. 버티다가 분명히 유리하면 밀고 나옴' },""")
rep("""if (pf.tac) u.tac = pf.tac;""","""if (pf.tac) u.tac = pf.tac; if (pf.role && !u.role) u.role = pf.role;""")
# 이주
rep("""// v4.4: 옐로 = 기동""","""// v5.0: 역할 (프로필에 정해진 인물만, 나머지는 장비 · 직업으로 자동)
if (!S.v50){ for (const u of S.units){ const pf = PROFILE[u.ref]; if (pf && pf.role && !u.role) u.role = pf.role; } S.v50 = true; }
// v4.4: 옐로 = 기동""")
# 역할 설명
rep("""// tac (엔진이 읽는 전술)""","""// v5.0 역할 설명
const ROLE_DESC = {
  '전선': '무리 앞에서 전선을 지킴 (뒤로!) · 노출된 동료를 막아섬 · 우위면 치고 나감. 방패 · 대검을 제대로 씀 (방어 재능 1)',
  '미드필더': '빠른 발로 상대 전선 (막고 선 방패) 정면을 피해 옆으로 돌아 들어감 · 전선 뒤 사수 · 치유를 노림 · 치고 빠짐',
  '공격수': '체력 · 방어 재능은 적지만 공격이 셈 · 잡을 수 있는 상대 (다친 · 동료와 맞붙은 · 고립된) 를 고르고 마무리',
  '사수': '뒤에서 쏨 · 오사 확률을 보며 다른 표적 · 기다림 · 각 잡기',
  '지원': '치유 · 지휘로 동료를 도움',
};
// tac (엔진이 읽는 전술)""")
# 편집: 역할 고르기
rep("""      <select id="selCls" aria-label="직업">${CLASS_NAMES.map(c => `<option ${c === p.cls ? 'selected' : ''}>${c}</option>`).join('')}</select>""",
"""      <select id="selCls" aria-label="직업">${CLASS_NAMES.map(c => `<option ${c === p.cls ? 'selected' : ''}>${c}</option>`).join('')}</select>
      <select id="selRole" aria-label="역할" title="${esc(ROLE_DESC[roleOf(p, rules)] || '')}"><option value="">역할: 자동 (${esc(roleOf({ ...p, role: '' }, rules))})</option>${ROLE_NAMES.map(r => `<option value="${r}" ${p.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select>""")
rep("""  if (e.target.id === 'selCls'){ p.cls = e.target.value; changed(); return; }""",
"""  if (e.target.id === 'selCls'){ p.cls = e.target.value; changed(); return; }
  if (e.target.id === 'selRole'){ if (e.target.value) p.role = e.target.value; else delete p.role; changed(); return; }""")
# 말풍선 (설명 상자)
rep("""    <span class="tr"><span class="lb">대담함</span> ${u.bold} · ${boldTxt(u.bold)}</span>""",
"""    <span class="tr"><span class="lb">대담함</span> ${u.bold} · ${boldTxt(u.bold)}</span>
    <span class="tr"><span class="lb">역할</span> ${esc(u.role || roleOf(p, rules))} — ${esc(ROLE_DESC[u.role || roleOf(p, rules)] || '')}${u.canGuard && u.gTal != null && u.gTal < 1 ? ` · 방어 재능 ${u.gTal} (막을 때 받는 피해 ×${(1 - (1 - rules.blockMul) * u.gTal).toFixed(2)})` : ''}</span>""")
# 카드
rep("""    const what = !u.alive ? '쓰러짐' : ed ? `${u.tier}등급 ${u.cls} · 속력""","""    const what = !u.alive ? '쓰러짐' : ed ? `${u.tier}등급 ${u.cls} · ${u.role || ''} · 속력""")
rep("""<span class="at">${ed ? `${u.tier}등급 ${u.cls} · 속력 ${u.spd}""","""<span class="at">${ed ? `${u.tier}등급 ${u.cls} · ${u.role || ''} · 속력 ${u.spd}""")
# 기분 표시 · 글
rep("'각 잡기': '각 잡기', '사선 기다림': '사선 기다림', '버팀': '버팀' };","'각 잡기': '각 잡기', '사선 기다림': '사선 기다림', '버팀': '버팀', '치고 나감': '치고 나감', '돌파': '돌파', '빠져나감': '빠져나감', '마무리': '마무리' };")
rep("'버팀': { c: 'dim', s: `${ga(a)} 쫓지 않고 숨을 고르며 버틴다.` } }[e.m] || null;",
    "'버팀': { c: 'dim', s: `${ga(a)} 쫓지 않고 숨을 고르며 버틴다.` }, '치고 나감': { c: 'good', s: `${ga(a)} 우위를 보고 ${reul(b)} 향해 치고 나간다!` }, '돌파': { c: 'good', s: `${ga(a)} ${b}의 방어 정면을 피해 옆으로 돌아 들어간다.` }, '빠져나감': { c: 'dim', s: `${ga(a)} 치고 빠진다.` }, '마무리': { c: 'good', s: `${ga(a)} 쓰러져 가는 ${reul(b)} 마무리하러 간다.` } }[e.m] || null;")
rep("'사선 기다림': { c: 'dim', s: `${ga(a)} 겨눈 채 동료가 비키길 기다린다.` } }[e.m] || null; }",
    "'사선 기다림': { c: 'dim', s: `${ga(a)} 겨눈 채 동료가 비키길 기다린다.` }, '치고 나감': { c: 'bad', s: `${ga(a)} 기세를 몰아 ${reul(b)} 향해 밀고 들어온다!` }, '돌파': { c: 'bad', s: `${ga(a)} ${b}의 방어 옆으로 돌아 들어온다!` }, '빠져나감': { c: 'dim', s: `${ga(a)} 치고 빠진다.` }, '마무리': { c: 'bad', s: `${ga(a)} 다친 ${reul(b)} 노리고 달려든다!` } }[e.m] || null; }")
rep("'다른 표적': `${ga(a.name)} 다른 쪽으로 총구를 돌려 ${reul(b.name)} 겨눈다.`, '엄호': `${ga(a.name)} 동료를 엄호하려 ${reul(b.name)} 겨눈다.` }[e.why];",
    "'다른 표적': `${ga(a.name)} 다른 쪽으로 총구를 돌려 ${reul(b.name)} 겨눈다.`, '엄호': `${ga(a.name)} 동료를 엄호하려 ${reul(b.name)} 겨눈다.`, '마무리': `${ga(a.name)} 다친 ${reul(b.name)} 끝내려 든다!` }[e.why];")
rep("'엄호': `${ga(a.name)} 동료를 엄호하려 ${reul(b.name)} 쏜다 — 오사 위험을 조금 감수한다.` }[e.why];",
    "'엄호': `${ga(a.name)} 동료를 엄호하려 ${reul(b.name)} 쏜다 — 오사 위험을 조금 감수한다.`, '마무리': `${ga(a.name)} ${reul(b.name)} 마무리한다!` }[e.why];")
# 규칙 탭: 역할 표 + 치고 나가기
rep("""        <div class="box"><p class="lab">등급 특성 ([속력X] 이동 속력 × · [괴력X] 공격 × , 막힐 때 상대 자세도 ×)</p><div class="tw"><table class="tbl" id="gradeTbl"></table></div></div>""",
"""        <div class="box"><p class="lab">등급 특성 ([속력X] 이동 속력 × · [괴력X] 공격 × , 막힐 때 상대 자세도 ×)</p><div class="tw"><table class="tbl" id="gradeTbl"></table></div></div>
        <div class="box"><p class="lab">역할 (v5.0) — 방어 재능: 방패 · 대검을 얼마나 제대로 쓰나 (1 = 전선만큼)</p><div class="tw"><table class="tbl" id="roleTbl"></table></div></div>""")
rep("""  $('gradeTbl').innerHTML =""","""  $('roleTbl').innerHTML = '<thead><tr><th class="l">역할</th><th>체력 ×</th><th>공격 ×</th><th>속력 ×</th><th>방어 재능</th><th class="l">하는 일</th></tr></thead><tbody>' + ROLE_NAMES.map(k => { const r = rules.roles[k] || {}; return `<tr><td class="l">${k}</td>${['hp', 'atk', 'spd', 'guard'].map(f => `<td>${n(`roles.${k}.${f}`, r[f] != null ? r[f] : 1, 0.05)}</td>`).join('')}<td class="l" style="white-space:normal;min-width:220px">${esc(ROLE_DESC[k])}</td></tr>`; }).join('') + '</tbody>'
    + '<tbody>' + [['pushEdge', '치고 나가기: 둘레 힘의 비 기준 (− 대담함 × 아래 값)', 0.05], ['pushBold', '치고 나가기: 대담함 × 이 값만큼 기준이 낮아짐', 0.05]].map(([k, lab, st]) => `<tr><td class="l" colspan="5">${lab}</td><td>${n(k, rules[k], st)}</td></tr>`).join('') + '</tbody>';
  $('gradeTbl').innerHTML =""")
open(p,'w',encoding='utf-8').write(s)
print('ok')
