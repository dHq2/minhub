# v9.6.5 페이지 — page9140.py v1.0 (v1.0: 개인 본능 양쪽 (기동 로그 '아군 기동' · '적 기동') · 전우조 포위 · 함께 물러남 로그 · 버전 · 전우조 붙음 로그 글 (3칸 → 벌어졌다 다시 붙음) · 엔진 patch9110 — 전우조는 한 몸처럼 1 ~ 1.5칸 · 짝이 움직이면 연동)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9130.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.6.4 (2026-10-24)', '<!-- 굴의 전투판 v9.6.5 (2026-10-24)')
rep('     v9.6.4: 떨어진 물건을', '''     v9.6.5: 전우조는 한 몸처럼 — 짝이 움직이면 (명령 · 뜀 · 걸음) 바로 연동돼 어깨 옆 (1 ~ 1.5칸) 에 붙어 따라감 · 벌어지면 곧장 붙음 (멀거나 짝이 뛰면 질주) · 짝이 멈추면 같이 멈춤 · 대장-부하는 3칸 그대로 · 양쪽 편 같은 규칙
     v9.6.4: 떨어진 물건을''')
for a, b in (('h1::after{content:" v9.6.4"', 'h1::after{content:" v9.6.5"'), ('<footer>굴의 전투판 v9.6.4', '<footer>굴의 전투판 v9.6.5'), ('return `굴의 전투판 v9.6.4 · ${title}', 'return `굴의 전투판 v9.6.5 · ${title}'),
             ("copyText('굴의 전투판 v9.6.4 자동 판 기록", "copyText('굴의 전투판 v9.6.5 자동 판 기록"), ("o.push(`굴의 전투판 v9.6.4 — ${C.run", "o.push(`굴의 전투판 v9.6.5 — ${C.run"),
             ('의 버전 기록에 — v9.6.4 짝 붙어 다니기', '의 버전 기록에 — v9.6.5 전우조는 한 몸처럼 (1 ~ 1.5칸) / v9.6.4 짝 붙어 다니기'),
             ('">v9.6.4 · 짝 붙어 다니기 (돌격하면 옆구리로) · 두 번 눌러 서둘러 줍기</span>', '">v9.6.5 · 전우조는 한 몸처럼 (1 ~ 1.5칸 · 연동) · 돌격하면 옆구리로 · 두 번 눌러 서둘러 줍기</span>'),
             ("ver: '9.6.4', kind:", "ver: '9.6.5', kind:"), ("RULES_MIG = '9.6.4',", "RULES_MIG = '9.6.5',")):
    rep(a, b)
rep("곁으로${e.run ? ' (질주)' : ''} — 3칸 넘게 떨어짐`", "곁으로${e.run ? ' (질주)' : ''} — ${e.chief ? '3칸 넘게 떨어짐' : '벌어져서 다시 붙음'}`")
rep("서로 붙어 다니고 · 위급하면 구하고 · 옆구리를 쳐 줘요. 둘 이상을 고르면", "한 몸처럼 붙어 다니고 (한쪽이 움직이면 1 ~ 1.5칸 옆에 따라붙음) · 돌격하면 옆구리로 · 위급하면 구해요. 둘 이상을 고르면")
rep("      case 'mvr': out.push(`${T(e)}🏃 적 기동 — ${mvTxt(Wd, e)}`); break;", "      case 'mvr': out.push(`${T(e)}🏃 ${e.side === 0 ? '아군' : '적'} 기동 — ${mvTxt(Wd, e)}`); break;   /* v9.6.5 본능은 양쪽 */")
rep("${e.how === 'flank' ? '🤝⚡' : '🤝'} ${n(e.a)} — ${e.how === 'flank' ?", "${e.how === 'flank' || e.how === 'pincer' ? '🤝⚡' : '🤝'} ${n(e.a)} — ${e.how === 'pincer' ? `전우 ${n(e.b)}가 붙든 ${n(e.tg)}의 반대쪽으로 돌아 포위` : e.how === 'retreat' ? `전우 ${n(e.b)}와 함께 ${n(e.tg)}을 보며 방패를 들고 물러남` : e.how === 'flank' ?")
rep("'stayShot', 'pairGo'].includes(e.k) && !(e.k === 'pairGo' && e.how === 'keep')", "'stayShot', 'pairGo'].includes(e.k) && !(e.k === 'pairGo' && (e.how === 'keep' || e.how === 'link'))")
rep("pairGo: `🤝 ${n(e.a)} ${e.how === 'flank' ?", "pairGo: `🤝 ${n(e.a)} ${e.how === 'pincer' ? n(e.b) + '가 붙든 ' + n(e.tg) + ' 포위' : e.how === 'retreat' ? n(e.b) + '와 함께 물러남' : e.how === 'flank' ?")
rep("    case 'pairGo': return e.how === 'keep' ? null : { c: 'good', s: e.how === 'flank' ?", "    case 'pairGo': return e.how === 'keep' || e.how === 'link' ? null : { c: 'good', s: e.how === 'pincer' ? `${ga(n(e.a))} ${n(e.b)}${jong(n(e.b)) ? '이' : '가'} 붙든 ${n(e.tg)}의 등 뒤로 돌아든다.` : e.how === 'retreat' ? `${ga(n(e.a))} ${n(e.b)} 곁에서 방패를 든 채 함께 물러난다.` : e.how === 'flank' ?")
open(F, 'w', encoding='utf-8').write(s)
print('page9140 OK')
