def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
rep(P,"    : e.m === 'jink' ? `총구 피하기 (본능)","""    : e.m === 'recall' ? `노출 병력 회수 (본능): ${ga(n(e.a))} ${e.b != null ? n(e.b) + '의 ' : ''}사격을 혼자 받다 (${e.why}) 본대 (${n(e.c)} 쪽) 로 물러남`
    : e.m === 'pace' ? `보조 맞춤 (본능): ${ga(n(e.a))} 혼자 앞서 나가지 않고 뒤따르는 ${e.n}명을 기다림`
    : e.m === 'jink' ? `총구 피하기 (본능)""")
rep(P,"      if (e.m === 'scatter') return","""      if (e.m === 'recall') return { c: 'dim', s: `${ga(A)} 혼자 맞다가 동료들 쪽으로 물러난다.` };
      if (e.m === 'pace') return { c: 'dim', s: `${ga(A)} 멈춰 서서 뒤따르는 동료들을 기다린다.` };
      if (e.m === 'scatter') return""")
rep(P,"· 흩어짐 ${c('scatter')} · 가까운 위협 먼저 ${c('near')}","· 흩어짐 ${c('scatter')} · 가까운 위협 먼저 ${c('near')} · 노출 병력 회수 ${c('recall')} · 보조 맞춤 ${c('pace')}")
rep(P,"    else if (e.k === 'mvr' && !['jink', 'near', 'scatter'].includes(e.m)","    else if (e.k === 'mvr' && !['jink', 'near', 'scatter', 'pace'].includes(e.m)")
