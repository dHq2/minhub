// v7.25.1 UI 시험 — ui7251.js v1.1 (v1.1: M 키는 body 에서 · 상세에 영거리 사격이 없어야 · 간두: 기동 사수 ([반사신경] · [전투센스] · 기동) · 기술 대신 두 번째 총 샷건 — 기술 막대 '🔁 샷건으로 (M)' · 누르면 바꿔 듦 · 다시 누르면 권총 · M 키 ·
//   상세 [두 번째 총] · 휴대폰 조작판 단추 · 저장된 간두 옮김 (남은 특수탄 그대로) · 로그 글)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const vw of [{width:1280,height:860,nm:'PC'},{width:412,height:880,nm:'휴대폰',mob:true}]){
   const p=await (await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   const d = await p.evaluate(()=>{ const x=designByKey('간두'); return { cls:x.cls, tr:x.traits, act:x.active||[], alt:x.alt }; });
   if (!vw.mob){ console.log('    설계',JSON.stringify(d)); ok(d.cls==='기동'&&d.tr.includes('반사신경')&&d.tr.includes('전투센스')&&!d.act.includes('영거리 사격')&&d.alt&&d.alt.name==='샷건'&&d.alt.ammo===100,'간두 설계: 기동 · [반사신경] · [전투센스] · 기술 없이 두 번째 총 샷건 (특수탄 100)'); }
   await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); const g=fromDesign(designByKey('간두'),0); g.x=10.5; g.y=15.5; S.units.push(g); S.draft.done=true; rebuildMap(); changed(); start(); paused=true; });
   const r = await p.evaluate(mob=>{ const g=world.units.find(u=>u.name==='간두'); sel=new Set([g.i]); hud();
     const btn = mob ? document.querySelector('#dActs [data-dk="alt"]') : document.querySelector('#skbar [data-cmd="alt"]'); const t0 = btn ? btn.textContent : '';
     if (btn){ if (mob) btn.dispatchEvent(new MouseEvent('click',{bubbles:true,detail:0})); else btn.click(); }
     const o = g.order||(g.ordPend&&g.ordPend.o); mode='run'; paused=false; for (let i=0;i<30;i++) stepWorld(world,1/30); paused=true; mode='plan'; hud();
     const btn2 = mob ? document.querySelector('#dActs [data-dk="alt"]') : document.querySelector('#skbar [data-cmd="alt"]');
     const dd=document.createElement('div'); dd.innerHTML=unitDetailHtml(world,g);
     return { t0, o: o&&o.k, w: g.weapon, alt: g.alt&&g.alt.name, t1: btn2 ? btn2.textContent : '', det: (dd.innerText.match(/\[두 번째 총\][^\n]*/)||[''])[0], log: logLines(world).filter(s=>/바꿔 듦/.test(s)).slice(0,2) }; }, !!vw.mob);
   console.log('    '+vw.nm,JSON.stringify(r)); ok(/샷건으로/.test(r.t0)&&r.o==='alt'&&r.w==='샷건'&&r.alt==='권총'&&/권총으로/.test(r.t1),vw.nm+': 단추 🔁 샷건으로 → 바꿔 듦 → 단추가 권총으로');
   ok(/권총/.test(r.det)&&!/영거리 사격/.test(r.det)&&r.log.length>=1,vw.nm+': 상세 [두 번째 총] · 로그 "바꿔 듦"');
   if (!vw.mob){ await p.screenshot({path:'_s7251_bar.png'}); const k = await p.evaluate(()=>{ const g=world.units.find(u=>u.name==='간두'); sel=new Set([g.i]); document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'m',bubbles:true})); const o=g.order||(g.ordPend&&g.ordPend.o); return o&&o.k; }); ok(k==='alt','M 키 = 무기 바꾸기'); }
   ok(!errs.length,vw.nm+' 오류 없음 '+errs.slice(0,2).join(' | ')); }
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   const m = await p.evaluate(()=>{ const g={ ref:'C-195', side:0, name:'간두', cls:'원거리', sm:1.38, weapon:'권총', active:['영거리 사격'], shells:37, traits:['사격A','회피B','은신C'] }; const r=fix7251(g); return { r, g }; });
   console.log('    옮김',JSON.stringify(m)); ok(m.r&&m.g.alt&&m.g.alt.name==='샷건'&&m.g.alt.ammo===37&&!m.g.active.includes('영거리 사격')&&m.g.shells==null&&m.g.cls==='기동'&&m.g.sm===0.95&&m.g.traits.includes('전투센스'),'저장된 간두: 영거리 사격 → 두 번째 총 샷건 (남은 특수탄 37 그대로) · 기동 사수');
   const t = await p.evaluate(()=>traitDesc('전투센스')); ok(/못 본 쪽/.test(t)&&/엎드리지 않고/.test(t),'[전투센스] 설명'); }
 await b.close(); console.log(fails?`${fails} FAIL`:'ALL UI7251 OK'); })();
