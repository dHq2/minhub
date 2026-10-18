def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
rep(P,"  { key: '궁수', side: 1, ref: 'C-056', name: '궁수', tier: 2, sm: 1.25,","  { key: '궁수', side: 1, ref: 'C-056', name: '궁수', tier: 2, sm: 1.55,")
rep(P,"if (!S.v620k){","""// v6.6.1 궁수 (경장 · 국가의 살인병기급 베테랑) 는 노먼만큼 빠름: 속력 배율 1.25 → 1.55 (사슬 갑옷 · 쇠 투구를 입고도 3.3칸/초 · 노먼 3.2) — 저장된 판 · 내 설계 · 층에도
const fixArcher661 = p => { if (!p || p.ref !== 'C-056' || p.name !== '궁수' || +p.sm !== 1.25) return false; p.sm = 1.55; return true; };
if (!S.v661a){ for (const u of S.units) fixArcher661(u); try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fixArcher661(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}
  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fixArcher661(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {} S.v661a = true; }
if (!S.v620k){""")
rep('t52.js',"'궁수':{ref:'C-056',name:'궁수',tier:2,ammo:40,sm:1.25,","'궁수':{ref:'C-056',name:'궁수',tier:2,ammo:40,sm:1.55,")
rep(P,"<!-- 굴의 전투판 v6.6.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v6.6.1 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v6.6.1: 궁수 (경장 베테랑) 의 속력을 노먼급으로 — 속력 배율 1.25 → 1.55 (사슬 갑옷 · 쇠 투구를 입고도 3.3칸/초, 노먼 3.2). 저장된 판 · 내 설계 · 층의 궁수도 옮겨 적음.\n")
rep(P,'body.mob .top h1::after{content:" v6.6.0";','body.mob .top h1::after{content:" v6.6.1";')
rep(P,'<span class="ver">v6.6.0 · ','<span class="ver">v6.6.1 · 궁수 속력 노먼급 · v6.6.0 · ')
rep(P,'<footer>굴의 전투판 v6.6.0 —','<footer>굴의 전투판 v6.6.1 —')
rep(P,"return `굴의 전투판 v6.6.0 · ${title}","return `굴의 전투판 v6.6.1 · ${title}")
