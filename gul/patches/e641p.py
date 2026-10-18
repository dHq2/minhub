def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
rep(P,"    : e.m === 'jink' ? `총구 피하기 (본능)","""    : e.m === 'scatter' ? `흩어짐 (본능): ${ga(n(e.a))} ${n(e.b)}의 휘두름에 ${n(e.c)}${jong(n(e.c)) ? '과' : '와'} 함께 걸리지 않게 다른 쪽으로 빠짐`
    : e.m === 'interpose' ? `사이를 막음 (지휘): ${ga(n(e.a))} ${n(e.b)}${jong(n(e.b)) ? '과' : '와'} ${n(e.c)} 사이로 들어가 붙듦`
    : e.m === 'escort' ? `호위 (지휘): ${ga(n(e.a))} 앞장서고 ${ga(n(e.c))} 그 뒤를 따라 ${n(e.b)}에게 감 (${e.why})`
    : e.m === 'near' ? `가까운 위협 먼저 (${e.why ? '지휘' : '본능'}): ${ga(n(e.a))} ${n(e.c)} 대신 ${reul(n(e.b))} 먼저 상대${e.why ? ' — ' + e.why : ' — 나를 노려 붙은 놈에게 등을 보이지 않음'}`
    : e.m === 'jink' ? `총구 피하기 (본능)""")
rep(P,"      case 'mvr': out.push(`${T(e)}🏃 적 기동 — ${mvTxt(Wd, e)}`); break;   // v6.4","      case 'mvr': out.push(`${T(e)}🏃 적 기동 — ${mvTxt(Wd, e)}`); break;   // v6.4\n      case 'javHold': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 투창을 아낌 — ${e.why}`); break;   // v6.4.1")
rep(P,"      if (e.m === 'drag') return { c: 'dim', s: `${ga(A)} 등을 보이며 물러난다 — 동료들 쪽으로 끌고 간다.` };","""      if (e.m === 'drag') return { c: 'dim', s: `${ga(A)} 등을 보이며 물러난다 — 동료들 쪽으로 끌고 간다.` };
      if (e.m === 'scatter') return { c: 'dim', s: `${ga(A)} ${n(e.b)}를 보고 옆으로 흩어진다.` };
      if (e.m === 'interpose') return { c: 'bad', s: `${ga(A)} ${n(e.b)} 앞을 막아선다 — 궁수를 지키려 한다!` };
      if (e.m === 'escort') return { c: 'bad', s: `${ga(A)} 앞장서고 ${ga(n(e.c))} 그 뒤에 붙어 ${n(e.b)} 쪽으로 다가온다!` };""")
rep(P,"    if (M.length) o.push(`적의 기동: 지휘 — 포위 사냥 ${c('surround')} · 교대 ${c('swap')} · 양동 ${c('feint')} (막으러 나옴 ${r('pulled')} · 그대로 붙음 ${r('strike')}) / 본능 — 끌고 오기 ${c('drag')} · 총구 피하기 ${c('jink')}`); }","    if (M.length) o.push(`적의 기동: 지휘 — 포위 사냥 ${c('surround')} · 교대 ${c('swap')} · 양동 ${c('feint')} (막으러 나옴 ${r('pulled')} · 그대로 붙음 ${r('strike')}) · 사이를 막음 ${c('interpose')} · 호위 ${c('escort')} / 본능 — 끌고 오기 ${c('drag')} · 총구 피하기 ${c('jink')} · 흩어짐 ${c('scatter')} · 가까운 위협 먼저 ${c('near')}${G.some(e => e.k === 'javHold') ? ' / 아낀 투창 ' + G.filter(e => e.k === 'javHold').length : ''}`); }")
rep(P,"    else if (e.k === 'mvr' && e.m !== 'jink' && !(e.m === 'feintRes' && e.r === 'time')) s =","    else if (e.k === 'mvr' && !['jink', 'near', 'scatter'].includes(e.m) && !(e.m === 'feintRes' && e.r === 'time')) s =")
