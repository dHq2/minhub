def rep(path, a, b, n=1):
    s = open(path, encoding='utf8').read(); c = s.count(a)
    assert c == n, (path, a[:80], c); s = s.replace(a, b); open(path, 'w', encoding='utf8').write(s)
P='page10.tpl.html'
# 판 위 적 전술 표시는 '적 다 보기' 일 때만
rep(P, "  if (!ed) drawFoeTactics(Wd, ox, oy, ts, see);   // v6.1 적 전술 (표적 · 쐐기 · 포위)", "  if (!ed && see) drawFoeTactics(Wd, ox, oy, ts, see);   // v6.1 적 전술 (표적 · 쐐기 · 포위) — v6.2 우리는 모름: '적 다 보기' 일 때만")
# 로그 줄
rep(P, "      case 'start': out.push(`${T(e)}📋 적의 시작: ${e.desc}`); break;   // v6.1",
       """      case 'start': out.push(`${T(e)}📋 적의 처음 상황 (우리는 모름): ${e.desc}`); break;   // v6.1 · v6.2 조우 전
      case 'sentry': out.push(`${T(e)}📋 적의 ${e.sentry ? '초병' : e.patrol ? '순찰조' : '본대'} ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} ${e.light ? n(e.b) + '의 횃불을 봄 (' + e.d + '칸)' : reul(n(e.b)) + ' 봄'} — ${e.surprise ? '우리는 아직 적을 못 봄 (기습 당할 수 있음)' : '서로 봄'} → 경보`); break;
      case 'alarm': out.push(`${T(e)}📋 적 경보가 퍼짐 — ${(e.n || []).map(n).join(' · ') || '모두 이미 움직이는 중'} → 본 그때의 자리로`); break;
      case 'contact': out.push(`${T(e)}◇ ${e.a != null ? n(e.a) + (jong(n(e.a)) ? '이' : '가') : '우리가'} 처음 적을 봄 — ${n(e.b)} (${e.dir}쪽 ${e.d}칸)`); break;""")
# 이야기: 우리 눈에 보인 것만
rep(P, "    case 'start': return { c: 'bad', s: e.s === 'ambush' ? '사방이 고요하다. 너무 고요하다…' : e.s === 'pincer' ? '적이 두 무리로 나뉘어 양옆 앞에 서 있다.' : e.s === 'rear' ? '앞에 적의 본대 — 그리고 뒤에서도 발소리가 난다!' : e.s === 'column' ? '길게 늘어선 적의 행렬과 마주쳤다.' : '적이 한 덩어리로 마주 서 있다.' };   // v6.1\n    case 'focus': return { c: 'bad', s: `적의 눈이 모두 ${n(e.b)}에게 쏠린다 — ${e.why}.` };",
       "    case 'start': case 'focus': case 'sentry': case 'alarm': return null;   // v6.2 적의 처음 상황 · 표적 · 경보는 우리가 모름 (로그만)\n    case 'contact': return { c: 'bad', s: `${e.a != null ? ga(n(e.a)) : '누군가'} 어둠 속에서 적을 발견했다 — ${e.dir}쪽 ${e.d}칸, ${n(e.b)}!` };")
rep(P, "    case 'wedge': return e.s === 'form' ? {", "    case 'wedge': return !e.obs ? null : e.s === 'form' ? {")
rep(P, "    case 'env': return e.s === 'form' ? {", "    case 'env': return !e.obs ? null : e.s === 'form' ? {")
rep(P, "    case 'ambush': return { c: 'bad', s: e.why === 'hit' ?", "    case 'ambush': return !e.obs && e.why !== 'near' ? null : { c: 'bad', s: e.why === 'hit' ?")
s=open(P,encoding='utf8').read()
i=s.index("    case 'plan': return { c:")
j=s.index('\n', i)
s=s[:i]+"    case 'plan': return null;   // v6.2 적의 작전은 우리가 모름 (로그만) — 보이는 움직임은 쐐기 · 포위 · 매복 이야기로"+s[j:]
open(P,'w',encoding='utf8').write(s)
rep(P, " 적 시작 무작위 (판마다 다름 — 정면 대치 · 양쪽 협공 · 매복 · 후방 기습 · 행군 중 조우)</label>", " 적 시작 무작위 (조우 전 — 적의 진 · 순찰조 · 초병 자리가 판마다 다름. 서로 모르는 채 시작)</label>")
rep(P, "toast(S.randStart ? '적 시작 무작위 — 판마다 적의 시작 자리가 달라요 (아군 자리는 그대로)' : '적은 놓은 자리에서 시작해요');", "toast(S.randStart ? '조우 전 시작 — 적은 진 · 순찰조 · 초병으로 흩어져 판마다 다른 자리에서 서로 모르는 채 시작해요 (아군 자리는 그대로)' : '적은 놓은 자리에서 시작해요');")
# 버전
s=open(P,encoding='utf8').read()
a='<!-- 굴의 전투판 v6.1.0 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n'
assert s.count(a)==1
s=s.replace(a,'''<!-- 굴의 전투판 v6.2.0 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v6.2.0: 조우 전에서 시작 — 서로 모름. 적은 진 (본대) · 순찰조 (둘씩, 진 둘레 길을 돎) · 초병 (진 앞에서 둘러봄) 으로 흩어져 있고 자리는 판마다 다름 (횃불이 보이는 거리 밖).
             처음 본 쪽 (초병 · 순찰 · 본대 — 상대를 보거나, 바라보는 쪽의 횃불을 봄) 이 경보 → 1초 뒤 진 전체가 그 자리로, 그때 작전을 정함. 상대가 아직 못 봤으면 매복 (숨어 기다렸다 덮침) 도 고름.
             우리는 모름: 적의 처음 상황 · 표적 · 작전 · 경보는 로그에만 (판 위 적 전술 표시는 '적 다 보기' 일 때만, 이야기는 우리 눈에 보인 쐐기 · 포위 · 매복과 우리 쪽이 처음 적을 본 때만).
             판: 더 넓은 개활지 32×20 (적의 진이 횃불 밖에 들어설 자리). 주인공 횃불은 그쪽을 보는 적에게 14칸 밖에서도 보임 — 내려놓으면 어둠 속으로 다가갈 수 있음.
''')
s=s.replace('h1::after{content:" v6.1.0"','h1::after{content:" v6.2.0"')
s=s.replace('<span class="ver">v6.1.0 · ','<span class="ver">v6.2.0 · 조우 전 시작 (순찰 · 초병 · 경보) · 우리는 모르는 적 상황 · 32×20 · v6.1.0 · ')
s=s.replace('<footer>굴의 전투판 v6.1.0 ','<footer>굴의 전투판 v6.2.0 ')
s=s.replace('return `굴의 전투판 v6.1.0 · ','return `굴의 전투판 v6.2.0 · ')
open(P,'w',encoding='utf8').write(s)
print('ok')
