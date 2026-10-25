// v7.16 UI 시험 — ui716.js v1.1 (v1.1: 명령 칸은 아군을 고른 뒤 봄 · 견제사격 J · 지역사격 P · 조작판 단추 · 명령의 arc · 친칠라 수치 · 모바일)  /* v9.7.0: 명령 칸 접기 — 시험 전에 펼침 */  /* v9.8.0: ⋯ 더 펼침 */
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); await p.addInitScript(()=>{ window.__dockMore=true; }); await p.addInitScript(()=>{ try{ localStorage.setItem('gulOrdGrp','{"tac":true,"adv":true}'); }catch(e){} });   /* v9.7.0 명령 칸 전술 · 고급 펼침 */ const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+process.cwd()+'/build/wrapped.html';
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const st = await p.evaluate(()=>{ start(); const c=world.units.find(u=>u.name==='친칠라'); sel=new Set([c.i]); hud(); return { atk: c.atk, P: world.rules.weapons['하얀 나무'].P, area: !!document.querySelector('#orders [data-ord="area"]') }; }); console.log('    친칠라', JSON.stringify(st));
 ok(st.atk===25&&st.P===70,'친칠라 공격 25 · 하얀 나무 관통력 70'); ok(st.area,'명령 칸에 지역사격 단추');
 // 지역사격 (P 키)
 const a1 = await p.evaluate(()=>{ const c=world.units.find(u=>u.name==='친칠라'); sel=new Set([c.i]); hud(); ordKey('area'); const ar=armed&&armed.k; armedTap({x:c.x+5,y:c.y}); const o=c.order||(c.ordPend&&c.ordPend.o); return { ar, k:o&&o.k, arc:o&&o.arc }; });
 console.log('    지역', JSON.stringify(a1)); ok(a1.ar==='area'&&a1.k==='supp'&&a1.arc===true,'지역사격 명령 = arc');
 const a2 = await p.evaluate(()=>{ const c=world.units.find(u=>u.name==='친칠라'); c.order=null; c.ordPend=null; sel=new Set([c.i]); ordKey('supp'); armedTap({x:c.x+5,y:c.y}); const o=c.order||(c.ordPend&&c.ordPend.o); return { k:o&&o.k, arc:o&&o.arc }; });
 ok(a2.k==='supp'&&a2.arc===false,'견제사격 명령 = 직사 (arc false)');
 await p.evaluate(()=>{ const c=world.units.find(u=>u.name==='친칠라'); sel=new Set([c.i]); armed=null; hud(); }); await p.keyboard.press('p'); await p.waitForTimeout(100);
 const k1 = await p.evaluate(()=>armed&&armed.k); ok(k1==='area','P 키 = 지역사격'); await p.keyboard.press('Escape');
 const lab = await p.evaluate(()=>orderLabel(world, ['area', 10, 8])); ok(/지역사격/.test(lab),'명령 이름 '+lab);
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs));
 // 모바일 조작판: 활이 있으면 지역 단추
 const m=await (await b.newContext({viewport:{width:412,height:883},isMobile:true,hasTouch:true,deviceScaleFactor:2.6})).newPage(); await m.addInitScript(()=>{ window.__dockMore=true; }); await m.addInitScript(()=>{ try{ localStorage.setItem('gulOrdGrp','{"tac":true,"adv":true}'); }catch(e){} });   /* v9.7.0 명령 칸 전술 · 고급 펼침 */ const e2=[]; m.on('pageerror',e=>e2.push(e.message));
 await m.goto(url); await m.waitForTimeout(400); await m.evaluate(()=>localStorage.clear()); await m.reload(); await m.waitForTimeout(900);
 const d = await m.evaluate(()=>{ start(); const c=world.units.find(u=>u.name==='친칠라'), n=world.units.find(u=>u.name==='노먼'); sel=new Set([c.i]); dockHtml[1]=''; hud(); const r1=!!document.querySelector('#dActs [data-dk="area"]'); sel=new Set([n.i]); dockHtml[1]=''; hud(); const r2=!!document.querySelector('#dActs [data-dk="area"]'), r3=!!document.querySelector('#dActs [data-dk="supp"]'); return { r1, r2, r3, sw: document.documentElement.scrollWidth, iw: innerWidth }; });
 console.log('    모바일', JSON.stringify(d)); ok(d.r1,'친칠라를 고르면 🏹 지역 단추'); ok(!d.r2&&d.r3,'노먼만 고르면 견제 단추만 (총은 같음)'); ok(d.sw<=d.iw+1,'가로 넘침 없음'); ok(e2.length===0,'모바일 오류 없음 '+JSON.stringify(e2));
 console.log(fails?`${fails} FAIL`:'ALL UI716 OK'); await b.close(); })();
