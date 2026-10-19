// v7.24.3 UI 시험 — ui7243.js v1.1 (v1.1: 시작 자리 무작위 (v8.4.1) 는 끔 — 붙여 둔 자리에서 전열 UI 를 봄 · v1.0: PC 전열: 사수 하나만 골라도 오른쪽 명령 칸 · 아래 기술 막대에 '전열' · 누르면 근접은 나란히 · 사수 · 치유는 전열 지원 (따라다님 · 점선 · 명령 이름) · 전열 후퇴 (K) 단추 · 휴대폰 조작판에도)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const setup = async p => { await p.addInitScript('window.__noJit=true'); await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); const h=S.units.find(u=>u.hero); for (const [k,dx,dy] of [['레베카',1,0],['카리우스',2,0],['노먼',0,1.5],['가윤',1,1.5]]){ const u=fromDesign(designByKey(k),0); u.x=h.x+dx; u.y=h.y+dy; S.units.push(u); } rebuildMap(); changed(); start(); paused=true; }); };
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await setup(p);
   const a = await p.evaluate(()=>{ const n=world.units.find(u=>u.name==='노먼'); sel=new Set([n.i]); hud(); renderSkillBar(world); return { ord: !!document.querySelector('#orders [data-ord="line"]'), sk: !!document.querySelector('#skbar [data-cmd="line"]'), sb: (document.querySelector('#skbar [data-cmd="line"] .sb')||{}).textContent }; });
   console.log('    노먼만', JSON.stringify(a)); ok(a.ord&&a.sk,'사수 하나만 골라도 — 오른쪽 명령 칸 · 아래 기술 막대에 전열'); ok(/지원/.test(a.sb||''),'기술 막대 전열 — "지원 (뒤에서)"');
   const c = await p.evaluate(()=>{ const L=world.units.filter(u=>u.side===0&&u.alive); sel=new Set(L.map(u=>u.i)); renderSkillBar(world); document.querySelector('#skbar [data-cmd="line"]').click();
     const e=world.units.filter(u=>u.side===1&&u.alive); const h=world.units.find(u=>u.hero); e.forEach((u,j)=>{ u.x=h.x+5+j*0.7; u.y=h.y-3; u.seenBy=true; u.stunT=world.t+99; });
     mode='run'; paused=false; let err=null; for (let i=0;i<150;i++){ stepWorld(world,1/30); if (i%10===0){ try { draw(); } catch(x){ err=x.message; break; } } } paused=true; mode='plan'; hud(); renderSkillBar(world);
     const n=world.units.find(u=>u.name==='노먼'), g=world.units.find(u=>u.name==='가윤'); return { err, no: n.order, go: g.order, lines: (world.lines||[]).filter(l=>l.side===0).map(l=>l.ids.length), lab: orderLabel(world, ordOf(n)), lret: !!document.querySelector('#skbar [data-cmd="lret"]'), sup: !!n.supAt }; });
   console.log('    전열', JSON.stringify(c)); ok(!c.err,'그리기 오류 없음'); ok(c.lines.length&&c.lines[0]>=2,'근접이 전열'); ok(c.no&&c.no.sup&&c.go&&c.go.sup&&c.sup,'노먼 · 가윤 — 전열 지원 (따라다님)'); ok(c.lab==='전열 지원','명령 이름 "전열 지원"'); ok(c.lret,'전열이 서면 기술 막대에 전열 후퇴 (K)');
   await p.evaluate(()=>{ const n=world.units.find(u=>u.name==='노먼'); cam.x=n.x; cam.y=n.y-1; cam.z=1.8; draw(); }); await p.screenshot({path:'_s7243_pc.png'});
   ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3))); }
 { const ctx=await b.newContext({viewport:{width:412,height:915},isMobile:true,hasTouch:true,deviceScaleFactor:2.625}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await setup(p);
   const m = await p.evaluate(()=>{ const n=world.units.find(u=>u.name==='노먼'); sel=new Set([n.i]); hud(); const bt=document.querySelector('#dActs [data-dk="line"]'); const r=bt&&bt.getBoundingClientRect(); return { has: !!bt, txt: bt&&bt.innerText.replace(/\s+/g,' '), inV: r ? r.right<=innerWidth+1&&r.left>=-1 : false }; });
   console.log('    휴대폰', JSON.stringify(m)); ok(m.has&&m.inV,'휴대폰 조작판 — 사수 하나만 골라도 전열 (화면 안)'); ok(errs.length===0,'오류 없음 (휴대폰) '+JSON.stringify(errs.slice(0,3))); await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7243 OK'); await b.close(); })();
