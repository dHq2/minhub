def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
rep(P,"<!-- 굴의 전투판 v6.2.0 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v6.3.0 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v6.3.0: 양쪽 다 전지하지 않음 — 상대의 체력 · 누가 위험한지 · 누가 전장의 중심인지는 본 것 · 겪은 것으로만 판단 (겉모습으로 체력을 짐작하고, 입힌 피해 · 받은 피해 · 쓰러뜨림 · 약 · 외침 · 총성 · 일어남을 쌓음). 적의 표적 · 쐐기 · 사수 · 마무리도 이 짐작을 씀. 로그에 '알게 됨' · '판단' 줄과 끝에 '초전 복기' (처음 상황 · 누가 먼저 봤나 · 경보 · 첫 작전 · 첫 표적 · 첫 피 · 갈림길 · 양쪽이 알게 된 것 · 짐작과 진짜 체력). 상세정보에 '우리가 아는 것'. 횃불 감지는 그대로.\n")
rep(P,'body.mob .top h1::after{content:" v6.2.0";','body.mob .top h1::after{content:" v6.3.0";')
rep(P,'<span class="ver">v6.2.0 · ','<span class="ver">v6.3.0 · 양쪽 다 본 것만 앎 · 초전 복기 · v6.2.0 · ')
rep(P,'<footer>굴의 전투판 v6.2.0 —','<footer>굴의 전투판 v6.3.0 —')
rep(P,"return `굴의 전투판 v6.2.0 · ${title}","return `굴의 전투판 v6.3.0 · ${title}")
