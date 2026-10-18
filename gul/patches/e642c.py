def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
rep(P,"    : e.m === 'pace' ?","    : e.m === 'rush' ? `합류 (본능): ${ga(n(e.a))} ${n(e.b)}${jong(n(e.b)) ? '이' : '가'} ${e.why === '맞붙음' ? '맞붙자' : '사격받자'} 서둘러 그쪽으로 — 흩어져 하나씩 소모되지 않게`\n    : e.m === 'pace' ?")
rep(P,"      if (e.m === 'pace') return","      if (e.m === 'rush') return { c: 'bad', s: `${ga(A)} ${n(e.b)} 쪽으로 서둘러 달려간다 — 적이 한데 모인다.` };\n      if (e.m === 'pace') return")
rep(P,"· 노출 병력 회수 ${c('recall')} · 보조 맞춤 ${c('pace')}","· 노출 병력 회수 ${c('recall')} · 보조 맞춤 ${c('pace')} · 합류 ${c('rush')}")
rep(P,"    else if (e.k === 'mvr' && !['jink', 'near', 'scatter', 'pace'].includes(e.m)","    else if (e.k === 'mvr' && !['jink', 'near', 'scatter', 'pace', 'rush'].includes(e.m)")
rep(P,"<!-- 굴의 전투판 v6.4.1 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v6.4.2 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v6.4.2: 병력을 나눠 소모하지 않음 — 합류 (동료가 맞붙거나 사격받으면 3 ~ 12칸 안의 본대가 서둘러 그쪽으로, 유인 · 매복 · 후퇴 · 포위 중엔 안 함), 노출 병력 회수 (혼자 · 둘이 떨어져 사격받는 근접은 셋 넘게 모인 본대로 물러남, 근접 상대가 곁이면 등을 보이지 않음), 보조 맞춤 (접근 중 혼자 앞선 근접은 뒤따르는 둘 넘게를 기다림, 앞에서 동료가 싸우거나 사격받으면 안 기다림, 4초까지). 적이 사격받은 때를 기억함. 로그 · 이야기 · 초전 복기에 표기.\n")
rep(P,'body.mob .top h1::after{content:" v6.4.1";','body.mob .top h1::after{content:" v6.4.2";')
rep(P,'<span class="ver">v6.4.1 · ','<span class="ver">v6.4.2 · 합류 · 노출 병력 회수 · 보조 맞춤 · v6.4.1 · ')
rep(P,'<footer>굴의 전투판 v6.4.1 —','<footer>굴의 전투판 v6.4.2 —')
rep(P,"return `굴의 전투판 v6.4.1 · ${title}","return `굴의 전투판 v6.4.2 · ${title}")
