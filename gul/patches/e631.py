def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'; P='page10.tpl.html'
rep(T,"""  if (!u.canCharge || u.crawl || u.act || u.kb || W.t < u.proneT || W.t < u.chargeCd""","""  if (!forced && u.line) return false;   // v6.3.1 전열을 지키는 동안은 스스로 돌진하지 않음 — 전열을 벗어나면 다시 (돌진 명령은 따로라 언제나 됨)
  if (!u.canCharge || u.crawl || u.act || u.kb || W.t < u.proneT || W.t < u.chargeCd""")
rep(P,"' (가운데 — 양옆 마디가 가려 측면이 없음)'} · 덜 밀리고 덜 넘어짐 · 손 닿는 곳에서 빠지는 적에게 일격` : '전열 밖 — 옆 · 뒤가 열려 있음'}","' (가운데 — 양옆 마디가 가려 측면이 없음)'} · 덜 밀리고 덜 넘어짐 · 손 닿는 곳에서 빠지는 적에게 일격${u.canCharge ? ' · 스스로는 돌진 안 함 (돌진 명령은 됨)' : ''}` : '전열 밖 — 옆 · 뒤가 열려 있음'}")
rep(P,"<!-- 굴의 전투판 v6.3.0 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v6.3.1 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v6.3.1: 전열을 지키는 동안은 스스로 돌진하지 않음 (양쪽 다) — 전열을 벗어나면 다시 스스로 돌진. 유저의 돌진 명령 (F · 돌격) 은 전열 안에서도 그대로 됨. 상세정보 전열 줄에 표기.\n")
rep(P,'body.mob .top h1::after{content:" v6.3.0";','body.mob .top h1::after{content:" v6.3.1";')
rep(P,'<span class="ver">v6.3.0 · ','<span class="ver">v6.3.1 · 전열 안 자동 돌진 없음 · v6.3.0 · ')
rep(P,'<footer>굴의 전투판 v6.3.0 —','<footer>굴의 전투판 v6.3.1 —')
rep(P,"return `굴의 전투판 v6.3.0 · ${title}","return `굴의 전투판 v6.3.1 · ${title}")
