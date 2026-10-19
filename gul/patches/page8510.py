# v8.5.1 페이지 — page8510.py v1.1 (v1.1: [신성X] · [생존자] 설명 · v1.0: 여정 목록: page8500.py 를 먼저 돌린 뒤 run8_g.js 를 붙이고 · 인카운터 탭에 30층 여정 · 설계 칸 · 특성 탭에 여정 인물 (적 · 보스 · 적뢰) · 판 번호 8.5.1)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8500.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v8.5.0 (2026-10-19)', '<!-- 굴의 전투판 v8.5.1 (2026-10-19)')
rep('     v8.5.0: ', '''     v8.5.1: 여정 목록 — 인카운터 탭에 30층 여정 (층 표 · 보스 · 정예 · 만남 · 히든 적뢰 · 챔피언 로드 · 결승). 설계 칸 · 특성 탭에 여정 인물 모두 (적 · 보스 · 적뢰 — 누르면 붓).
     v8.5.0: ''')
for a, b in (('h1::after{content:" v8.5.0"', 'h1::after{content:" v8.5.1"'), ('<footer>굴의 전투판 v8.5.0', '<footer>굴의 전투판 v8.5.1'), ('return `굴의 전투판 v8.5.0 · ${title}', 'return `굴의 전투판 v8.5.1 · ${title}'),
             ("copyText('굴의 전투판 v8.5.0 자동 판 기록", "copyText('굴의 전투판 v8.5.1 자동 판 기록"), ("ver: '8.5.0', kind: '1F 여정 기록'", "ver: '8.5.1', kind: '1F 여정 기록'"),
             ("o.push('굴의 전투판 v8.5.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.5.1 — 1F 프롤로그 여정 기록'"),
             ('의 버전 기록에 — v8.5.0 전리품 창 다시', '의 버전 기록에 — v8.5.1 여정 목록 (인카운터 · 인물) / v8.5.0 전리품 창 다시'),
             ('">v8.5.0 · 전리품 창 다시</span>', '">v8.5.1 · 여정 목록</span>'),
             ("RULES_MIG = '8.5.0'", "RULES_MIG = '8.5.1'")):
    rep(a, b)

rep("return [...DESIGN_DEFAULTS.filter(d => !keys.has(d.key)).map(d => ({ ...d, base: true })), ...mine.map(",
    "return [...DESIGN_DEFAULTS.filter(d => !keys.has(d.key)).map(d => ({ ...d, base: true })), ...(typeof R8DES === 'function' ? R8DES().filter(d => !keys.has(d.key)) : []), ...mine.map(")   # v8.5.1 여정 인물
rep("function renderDesigns(){\n  const L = designList();", "function renderDesigns(){\n  const L = designList().filter(d => !d.run8);   /* v8.5.1 여정 인물은 아래 따로 */")
rep('    <div class="row"><button class="btn" type="button" id="dsgPlaceFoes">', '    ${typeof r8DesignsHtml === \'function\' ? r8DesignsHtml() : \'\'}<div class="row"><button class="btn" type="button" id="dsgPlaceFoes">')
rep("  el.innerHTML = h;\n}\n// v7.26.2 인카운터 시험", "  if (typeof r8DocBoxes === 'function') h += r8DocBoxes(B);   /* v8.5.1 30층 여정 */\n  el.innerHTML = h;\n}\n// v7.26.2 인카운터 시험")
rep("/* v7.25.3 인카운터 목록 */\n", "/* v7.25.3 인카운터 목록 */\n.r8dsg{margin-top:10px} .r8dsg summary{cursor:pointer}\n")
rep("function traitDesc(t){\n", "function traitDesc(t){\n  { const h = /^신성([SABCDE])$/.exec(t); if (h) return `신성 ${h[1]} — 신의 힘이 깃든 몸: [낙인:적뢰] 같은 천벌의 낙인에 걸리지 않음 (카리우스 · 적뢰 · 성해포를 낀 이)`; }   /* v8.5.1 */\n")
rep("const GRADE_RE = /^(속력|근력|괴력|지휘|사격|회피|급소|은신|후각|발화|의학)([SABCDE])$/, GRADE_OK = { 은신: 'SABCDE', 발화: 'SABCDE' };", "const GRADE_RE = /^(속력|근력|괴력|지휘|사격|회피|급소|은신|후각|발화|의학|신성)([SABCDE])$/, GRADE_OK = { 은신: 'SABCDE', 발화: 'SABCDE', 신성: 'SABCDE' };   /* v8.5.1 신성 */")
rep("\n  '보스': '", "\n  '생존자': '끝까지 살아남은 이 (카밀라 · 청광묵) — 설정 표시 · 싸움 효과는 아직 없음',   /* v8.5.1 */\n  '보스': '")
E = open(D + 'run8_g.js', encoding='utf-8').read()
rep("\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일", '\n' + E + "\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일")
open(F, 'w', encoding='utf-8').write(s)
print('page8510 OK')
