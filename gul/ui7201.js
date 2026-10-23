// v7.20.1 UI 시험 — ui7201.js v1.3 (v1.3: v8.7.6 전리품 단추는 번호가 아니라 출처 열쇠 (lk — 목록을 다시 세도 어긋나지 않게) · v1.2: v8.5.0 전리품 창 다시에 맞춤 — 줄 .l8r · 받는 사람 lootTo · 챙긴 것 .l8took · v1.1: v7.25.2 전리품 카드 — 고르기 칸 대신 동료 얼굴 단추 · 전리품 창: 목록 · 누구 가방에 → 명단 가방 · 화살은 단궁 쓰는 트라카 가방에 저절로 · 이번 판 장비 반영 (내구도 · 탄) · 같은 배치로 다시 하면 가방째 · 모바일 넓이)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const setup = async p => { await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
   await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); const h=S.units.find(u=>u.hero); for (const [k,dx] of [['노먼',1],['트라카',-1]]){ const u=fromDesign(designByKey(k),0); u.x=h.x+dx; u.y=h.y+0.5; S.units.push(u); }
     if (!S.units.some(u=>u.side===1&&u.name==='궁수')){ const a=fromDesign(designByKey('궁수'),1); a.x=20.5; a.y=4.5; S.units.push(a); } rebuildMap(); changed(); start(); const c=document.getElementById('contBtn'); if(c) c.click(); paused=true;
     for (const e of world.units) if (e.side===1){ if (e.ammoMax!=null) e.ammo=13; e.hp=0; e.alive=false; dropOnDeath(world,e); }
     const n=world.units.find(u=>u.name==='노먼'); n.wDur=55; n.ammo=37; world.over=true; world.result='win'; mode='plan'; onOver(); }); await p.waitForTimeout(300); };
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await setup(p);
   const r1 = await p.evaluate(()=>{ const box=document.getElementById('lootBox'); if(!box) return { box:false }; const rows=[...box.querySelectorAll('.l8r')].map(x=>x.innerText.replace(/\s+/g,' ').trim()).concat([...box.querySelectorAll('.l8took')].map(x=>x.innerText.replace(/\s+/g,' ').trim())); const t=S.units.find(u=>u.name==='트라카');
     return { box:true, n: rows.length, rows: rows.slice(0,6), auto: rows.filter(x=>/저절로/.test(x)), tbag: (t.bag||[]).map(x=>x.k+':'+(x.at||x.name)+':'+(x.n||'')) }; });
   console.log('    전리품', JSON.stringify(r1)); ok(r1.box&&r1.n>=3,'결과 창에 전리품 목록'); ok(r1.auto.length>=1&&r1.tbag.some(x=>/^ammo:화살:13/.test(x)),'화살 13 은 트라카 가방에 저절로');
   const r2 = await p.evaluate(()=>{ const n=S.units.find(u=>u.name==='노먼'); const L=lootOf(world), i=L.findIndex(it=>!it.taken&&(it.k==='armor'||it.k==='helm'||it.k==='weapon')), it=L[i]; lootTo=n.id; renderLoot(); const bt=document.querySelector(`#lootBox .l8go[data-lgive="${it.lk!=null?it.lk:i}"][data-lp="${n.id}"]`); if (bt) bt.click();
     return { lab: itName(it), taken: it.taken, nbag: (n.bag||[]).map(x=>x.label||x.name), row: ((document.querySelector('#lootBox .l8took')||{}).textContent||'').includes(itName(it)) }; });
   console.log('    가져가기', JSON.stringify(r2)); ok(r2.taken==='노먼'&&r2.nbag.includes(r2.lab)&&r2.row,'고른 전리품 → 노먼 가방 (명단)');
   const r3 = await p.evaluate(()=>{ document.getElementById('settleBtn').click(); const n=S.units.find(u=>u.name==='노먼'); return { wDur: n.wDur, ammo: n.ammo, btn: document.getElementById('settleBtn').disabled }; });
   console.log('    반영', JSON.stringify(r3)); ok(r3.wDur===55&&r3.ammo===37&&r3.btn,'이번 판 장비 반영: 노먼 내구 55 · 탄 37');
   const r4 = await p.evaluate(()=>{ start(); const n=world.units.find(u=>u.name==='노먼'); return { bag: (n.bag||[]).length, wDur: n.wDur, ammo: n.ammo }; });
   console.log('    다시', JSON.stringify(r4)); ok(r4.bag>=1&&r4.wDur===55&&r4.ammo===37,'같은 배치로 다시: 가방 · 내구도 · 탄째');
   ok(errs.length===0,'오류 없음 (데스크톱) '+JSON.stringify(errs)); }
 { const ctx=await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await setup(p);
   const m = await p.evaluate(()=>{ const bn=document.getElementById('banner'), q=bn.getBoundingClientRect(), els=[...bn.querySelectorAll('select,button')]; const over=els.filter(x=>{ const r=x.getBoundingClientRect(); return r.width>0&&(r.right>innerWidth+1||r.left<-1); }).length, small=els.filter(x=>{ const r=x.getBoundingClientRect(); return r.width>0&&r.height<30; }).length;
     return { w: Math.round(q.width), l: Math.round(q.left), r: Math.round(q.right), n: els.length, over, small, sw: document.documentElement.scrollWidth, iw: innerWidth }; });
   console.log('    모바일 결과 창', JSON.stringify(m)); ok(m.n>=3&&m.over===0&&m.small===0&&m.sw<=m.iw+1,'모바일: 전리품 창이 화면 안 · 손가락 크기');
   ok(errs.length===0,'오류 없음 (모바일) '+JSON.stringify(errs)); }
 console.log(fails?`${fails} FAIL`:'ALL UI7201 OK'); await b.close(); })();
