def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
rep(P,"function logHeader(Wd, title){","""// v6.4 적의 기동 (지휘: 포위 · 교대 · 양동 / 본능: 끌고 오기 · 총구 피하기)
const MV_ORG_K = ['surround', 'swap', 'feint'];
function mvTxt(Wd, e){ const n = i => Wd.units[i] ? Wd.units[i].name : '?', iga = L => L.map(n).join(' · ') + (L.length && jong(n(L[L.length - 1])) ? '이' : '가');
  return e.m === 'surround' ? `포위 사냥 (지휘): ${ga(n(e.a))} ${reul(n(e.b))} 앞에서 붙들고 ${iga(e.ids)} 옆 · 뒤로 돌아감`
    : e.m === 'swap' ? `교대 (지휘): ${ga(n(e.a))} 빠지고 (체력 ${e.hp}%) ${ga(n(e.b))} 그 자리로 뛰어들어 ${reul(n(e.c))} 받음`
    : e.m === 'feint' ? `양동 (지휘): ${ga(n(e.a))} 큰 싸움을 두고 크게 돌아 ${n(e.b)}에게 달림 (${e.why || '뒷줄'})`
    : e.m === 'feintRes' ? (e.r === 'pulled' ? `양동 결과: ${ga(n(e.c))} 막으러 나옴 → ${ga(n(e.a))} ${reul(n(e.c))} 동료 쪽으로 끌고 감` : e.r === 'strike' ? `양동 결과: 아무도 막지 않음 → ${ga(n(e.a))} ${n(e.b)}에게 붙음` : `양동 결과: 시간이 지나 그만둠 (${n(e.a)})`)
    : e.m === 'drag' ? `끌고 오기 (본능): ${ga(n(e.a))} ${reul(n(e.b))} 동료 ${n(e.c)} 쪽으로 끌고 감 (${e.why})`
    : e.m === 'jink' ? `총구 피하기 (본능): ${ga(n(e.a))} ${n(e.b)}의 겨눔을 보고 옆으로 뜀${e.cover ? ' (방패 · 큰 몸 동료 뒤로)' : ''}` : e.m; }
function logHeader(Wd, title){""")
rep(P,"      case 'cmdHold': out.push(","      case 'mvr': out.push(`${T(e)}🏃 적 기동 — ${mvTxt(Wd, e)}`); break;   // v6.4\n      case 'cmdHold': out.push(")
rep(P,"    case 'cmdHold': return null;   // v6.3.3 참은 까닭은 로그만","""    case 'cmdHold': return null;   // v6.3.3 참은 까닭은 로그만
    case 'mvr': { if (!e.obs) return null; const A = n(e.a);   // v6.4 우리 눈에 보인 기동만 (총구 피하기는 로그만)
      if (e.m === 'surround') return { c: 'bad', s: `적들이 ${reul(n(e.b))} 둘러싼다 — ${e.ids.map(n).join(' · ')}${jong(n(e.ids[e.ids.length - 1])) ? '이' : '가'} 옆과 뒤로 돈다!` };
      if (e.m === 'swap') return { c: 'bad', s: `${ga(A)} 물러나자 ${ga(n(e.b))} 그 자리로 뛰어든다 — 교대다!` };
      if (e.m === 'feint') return { c: 'bad', s: `${ga(A)} 싸움판을 크게 돌아 ${n(e.b)} 쪽으로 달려간다!` };
      if (e.m === 'feintRes') return e.r === 'pulled' ? { c: 'bad', s: `${ga(n(e.c))} ${reul(A)} 쫓아 빠져나왔다 — 놈이 동료들 쪽으로 끌고 간다!` } : e.r === 'strike' ? { c: 'bad', s: `${ga(A)} ${n(e.b)}에게 붙었다!` } : null;
      if (e.m === 'drag') return { c: 'dim', s: `${ga(A)} 등을 보이며 물러난다 — 동료들 쪽으로 끌고 간다.` };
      return null; }""")
rep(P,"    else if (e.k === 'cmdCharge') s = `◆ 지휘 돌진 명령","    else if (e.k === 'mvr' && e.m !== 'jink' && !(e.m === 'feintRes' && e.r === 'time')) s = `🏃 ${mvTxt(Wd, e)}`;\n    else if (e.k === 'cmdCharge') s = `◆ 지휘 돌진 명령")
rep(P,"""  { const cc = G.filter(e => e.k === 'cmdCharge'), ch = G.filter(e => e.k === 'cmdHold');   // v6.3.3 적 지휘관의 돌격 판단""","""  { const M = G.filter(e => e.k === 'mvr'), c = m => M.filter(e => e.m === m).length, r = x => M.filter(e => e.m === 'feintRes' && e.r === x).length;   // v6.4 적의 기동
    if (M.length) o.push(`적의 기동: 지휘 — 포위 사냥 ${c('surround')} · 교대 ${c('swap')} · 양동 ${c('feint')} (막으러 나옴 ${r('pulled')} · 그대로 붙음 ${r('strike')}) / 본능 — 끌고 오기 ${c('drag')} · 총구 피하기 ${c('jink')}`); }
  { const cc = G.filter(e => e.k === 'cmdCharge'), ch = G.filter(e => e.k === 'cmdHold');   // v6.3.3 적 지휘관의 돌격 판단""")
rep(P,"<!-- 굴의 전투판 v6.3.4 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v6.4.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v6.4.0: 적의 기동 — 지휘관이 플레이어처럼 유닛을 움직임 (한 번에 1 + 지휘력 가지): 포위 사냥 (한 상대에 둘 넘게 붙으면 하나가 앞에서 붙들고 나머지는 옆 · 뒤로 돌아감), 교대 (체력 35% 아래로 맞붙은 마디는 성한 동료 뒤로 빠지고 그 동료가 뛰어듦), 양동 (큰 싸움이 붙으면 빠른 놈이 크게 돌아 사수 · 구급 · 궁수를 노림 — 막으러 나오면 동료 쪽으로 끌고 오고, 안 막으면 그대로 붙음). 지휘관이 없어도 본능으로: 총구 피하기 (겨누면 옆으로 뜀, 방패 · 큰 몸 동료 뒤 쪽 먼저), 끌고 오기 (혼자 거구 · 위험한 놈 · 둘에게 몰리면 동료 쪽으로 물러남). 기동은 서둘러 뜀 (×1.3). 로그 '🏃 적 기동', 이야기엔 보인 것만, 초전 복기에 기동 요약 · 갈림길.\n")
rep(P,'body.mob .top h1::after{content:" v6.3.4";','body.mob .top h1::after{content:" v6.4.0";')
rep(P,'<span class="ver">v6.3.4 · ','<span class="ver">v6.4.0 · 적의 기동 (포위 사냥 · 교대 · 양동 · 총구 피하기 · 끌고 오기) · v6.3.4 · ')
rep(P,'<footer>굴의 전투판 v6.3.4 —','<footer>굴의 전투판 v6.4.0 —')
rep(P,"return `굴의 전투판 v6.3.4 · ${title}","return `굴의 전투판 v6.4.0 · ${title}")
