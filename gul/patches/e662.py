def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
rep(P,"name: '궁수', tier: 2, sm: 1.55, role: '사수', ammo: 40, height: 2.0, ov: { hp: 150, atk: 30 }, traits: ['베테랑'],","name: '궁수', tier: 2, sm: 1.55, role: '사수', ammo: 40, height: 2.0, ov: { hp: 150, atk: 30 }, traits: ['베테랑', '사격S'],")
rep(P,"const fixArcher661 = p => { if (!p || p.ref !== 'C-056' || p.name !== '궁수' || +p.sm !== 1.25) return false; p.sm = 1.55; return true; };","const fixArcher661 = p => { if (!p || p.ref !== 'C-056' || p.name !== '궁수' || +p.sm !== 1.25) return false; p.sm = 1.55; return true; };\n// v6.6.2 궁수 (활로 드래곤을 잡고 영웅들과 싸우던 베테랑) 의 사격 솜씨는 노먼 [사격A] 보다 높은 [사격S]\nconst fixArcher662 = p => { if (!p || p.ref !== 'C-056' || p.name !== '궁수' || (p.traits || []).some(x => /^사격[SABC]$/.test(x))) return false; p.traits = [...(p.traits || []), '사격S']; return true; };")
rep(P,"if (!S.v661a){","if (!S.v662a){ for (const u of S.units) fixArcher662(u); try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fixArcher662(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}\n  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fixArcher662(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {} S.v662a = true; }\nif (!S.v661a){")
rep('t52.js',"'궁수':{ref:'C-056',name:'궁수',tier:2,ammo:40,sm:1.55,role:'사수',height:2.0,ov:{hp:150,atk:30},traits:['베테랑'],","'궁수':{ref:'C-056',name:'궁수',tier:2,ammo:40,sm:1.55,role:'사수',height:2.0,ov:{hp:150,atk:30},traits:['베테랑','사격S'],")
rep(P,"<!-- 굴의 전투판 v6.6.1 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v6.6.2 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v6.6.2: 궁수의 사격 솜씨 [사격S] (0.7) — 활로 드래곤을 잡고 영웅들과 싸우던 베테랑이라 노먼 [사격A] (0.55) 보다 높음. 저장된 판 · 내 설계 · 층의 궁수에도 붙임.\n")
rep(P,'body.mob .top h1::after{content:" v6.6.1";','body.mob .top h1::after{content:" v6.6.2";')
rep(P,'<span class="ver">v6.6.1 · ','<span class="ver">v6.6.2 · 궁수 [사격S] · v6.6.1 · ')
rep(P,'<footer>굴의 전투판 v6.6.1 —','<footer>굴의 전투판 v6.6.2 —')
rep(P,"return `굴의 전투판 v6.6.1 · ${title}","return `굴의 전투판 v6.6.2 · ${title}")
