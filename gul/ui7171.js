// v7.17.1 UI 시험 — ui7171.js v1.3 (v1.3: 관계 단추 (보호 · 풀기) 도 명령 단추로 뺌 (v9.9.6) · v1.2: 기술 막대의 명령 단추 (전열 · 전열 후퇴 — v7.24.3) 는 기술이 아니라 아이콘 검사에서 뺌 · v1.1: 테두리 색은 --gc 로만 읽음 · 특성 · 기술 아이콘: 그림 로드 · 상세 · 등급 테두리 · 특성 탭 · 기술 막대 · 동료 카드 띠 · 모바일 조작판 · 그림 스크린샷)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1200);
   ok(await p.evaluate(()=>icoOK),'icons.webp 읽힘');
   await p.evaluate(()=>{ start(); }); await p.click('#contBtn'); await p.waitForTimeout(400); await p.evaluate(()=>{ paused=true; hud(); });
   const pc = await p.evaluate(()=>[...document.querySelectorAll('#party .pm')].map(b=>[b.querySelector('.nm').innerText.trim().split(/\s+/)[1], b.querySelectorAll('.tis .tico').length]));
   console.log('    카드 띠', JSON.stringify(pc)); ok(pc.filter(x=>x[1]>0).length>=3,'동료 카드에 특성 아이콘 띠');
   const det = await p.evaluate(()=>{ const n=world.units.find(u=>u.ref==='C-007'); const d=document.createElement('div'); d.innerHTML=unitDetailHtml(world,n); return [...d.querySelectorAll('.tr')].filter(t=>t.querySelector('.tico')).map(t=>[t.querySelector('i')?t.querySelector('i').innerText:'', t.querySelector('.tico').style.getPropertyValue('--gc')]); });
   console.log('    노먼 상세', JSON.stringify(det)); ok(det.some(x=>x[0]==='[사격A]'&&x[1]==='#ff8a70')&&det.some(x=>x[0]==='[지휘C]'&&x[1]==='#9b7fd0'),'상세 특성 줄에 아이콘 · 등급 테두리 (A 핏빛 · C 보라)');
   const kar = await p.evaluate(()=>{ const k=world.units.find(u=>u.modBody); const d=document.createElement('div'); d.innerHTML=unitDetailHtml(world,k); return d.querySelectorAll('.tico').length; }); ok(kar>=3,'카리우스 상세 (◆개조된 신체 · 거구 · 갑피 …) 아이콘 '+kar);
   const g = await p.evaluate(()=>{ const i=world.units.findIndex(u=>u.ref==='C-004'); sel=new Set([i]); hud(); return [...document.querySelectorAll('#skbar .sk:not(.off)')].map(b=>[b.querySelector('.nm').innerText, !!b.querySelector('.ic .tico')]); });
   console.log('    청광묵 기술 막대', JSON.stringify(g)); ok(g.length>=2&&g.every(x=>x[1]||x[0]==='투척'||/^(전열|전우조|대장|보호|풀기)/.test(x[0])),'기술 막대 아이콘 (단검 투척은 글자 그림 · 전열 · 전우조 · 대장 명령 단추는 뺌 — v9.6.2)');
   const n2 = await p.evaluate(()=>{ const i=world.units.findIndex(u=>u.ref==='C-007'); sel=new Set([i]); hud(); return [...document.querySelectorAll('#skbar .sk:not(.off)')].map(b=>[b.querySelector('.nm').innerText, !!b.querySelector('.ic .tico')]); });
   ok(n2.some(x=>x[0]==='응급처치'&&x[1]),'노먼 응급처치 아이콘');
   await p.evaluate(()=>{ const i=world.units.findIndex(u=>u.ref==='C-004'); sel=new Set([i]); hud(); });
   await p.screenshot({path:'ui7171_desk.png', clip:{x:0,y:0,width:1280,height:860}});
   const tt = await p.evaluate(()=>{ renderTraitsTab(); return { g: document.querySelectorAll('#traitGradeTbl .tico').length, t: document.querySelectorAll('#traitTbl .tico').length, u: document.querySelectorAll('#traitUniTbl .tico').length, th: document.querySelector('#traitGradeTbl th:nth-child(2)').style.color }; });
   console.log('    특성 탭', JSON.stringify(tt)); ok(tt.g>=9&&tt.t>=10&&tt.u>=4&&tt.th,'특성 탭 표에 아이콘 · 등급 머리 색');
   const tip = await p.evaluate(()=>{ const n=world.units.find(u=>u.ref==='C-007'); const d=document.createElement('div'); d.innerHTML=unitDetailHtml(world,n); return d.querySelector('.tico').getAttribute('title'); }); ok(/^\[/.test(tip||''),'아이콘 풀이 (title) '+tip);
   ok(errs.length===0,'오류 없음 (데스크톱) '+JSON.stringify(errs)); }
 { const ctx=await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1200);
   await p.evaluate(()=>{ start(); }); await p.waitForTimeout(300); await p.evaluate(()=>{ if(document.getElementById('contBtn')) document.getElementById('contBtn').click(); }); await p.waitForTimeout(300);
   const d = await p.evaluate(()=>{ paused=true; const i=world.units.findIndex(u=>u.ref==='C-004'); sel=new Set([i]); hud(); return [...document.querySelectorAll('#dActs [data-dk^="sk"]')].map(b=>{ const q=b.getBoundingClientRect(), ic=b.querySelector('.tico'); const r=ic?ic.getBoundingClientRect():null; return [b.innerText.replace(/\s+/g,' ').trim(), !!ic, r?Math.round(r.width):0, r?(r.left>=q.left-1&&r.right<=q.right+1):true]; }); });
   console.log('    모바일 조작판', JSON.stringify(d)); ok(d.filter(x=>x[1]).length>=2&&d.every(x=>x[3])&&d.every(x=>!x[1]||x[2]>=16),'모바일 기술 단추 아이콘 (16px 넘게 · 단추 안)');
   const fan = await p.evaluate(()=>fanItems(world,[world.units.findIndex(u=>u.ref==='C-004')],null).filter(x=>x.ix).map(x=>x.k)); ok(fan.includes('palm')&&fan.includes('leap'),'꾹 누름 부채에도 '+fan.join(','));
   await p.screenshot({path:'ui7171_mob.png'});
   ok(errs.length===0,'오류 없음 (모바일) '+JSON.stringify(errs)); }
 console.log(fails?`${fails} FAIL`:'ALL UI7171 OK'); await b.close(); })();
