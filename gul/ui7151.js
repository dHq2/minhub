// v7.15.1 UI 시험 — ui7151.js v1.1 (v1.1: v8.4.1 — 겹친 자리 첫 클릭은 고르기만, 고른 아군을 다시 누르면 창 · v1: 카리우스 체력 700 · 옛 저장 이전 · 인물과 물건이 겹친 자리의 고르는 창 · 모바일)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+process.cwd()+'/build/wrapped.html';
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const k0 = await p.evaluate(()=>{ start(); const k=world.units.find(u=>u.name==='카리우스'); return [k.max, unitFromRef('C-003',0).ov.hp]; }); console.log('    카리우스', JSON.stringify(k0)); ok(k0[0]===700&&k0[1]===700,'카리우스 체력 700 (설계 · 도감)');
 // 옛 저장 450 → 700
 await p.evaluate(()=>{ mode='edit'; const o=JSON.parse(localStorage.getItem('gul-battle-v3')||JSON.stringify(S)); for(const u of o.units) if(u.ref==='C-003') u.ov.hp=450; delete o.v7151k; localStorage.setItem('gul-battle-v3',JSON.stringify(o)); }); await p.reload(); await p.waitForTimeout(900);
 const k1 = await p.evaluate(()=>S.units.find(u=>u.ref==='C-003').ov.hp); ok(k1===700,'옛 저장의 450 → 700');
 // 겹친 자리
 await p.evaluate(()=>{ start(); }); await p.waitForTimeout(300);
 const r = await p.evaluate(()=>{ const W=world, n=W.units.find(u=>u.name==='노먼'); W.items=W.items||[]; W.items.push({ id: 991, k: 'weapon', name: '장검', x: n.x+0.1, y: n.y+0.05, owner: n.i, t: 0, how: 'test' }); sel=new Set(); playClick({x:n.x,y:n.y}, false, n); playClick({x:n.x,y:n.y}, false, n); const box=document.getElementById('ask'); return { open: !box.hidden, txt: box.innerText.replace(/\s+/g,' ') }; });
 console.log('    창', JSON.stringify(r)); ok(r.open && /장검 줍기/.test(r.txt) && /노먼 고르기/.test(r.txt),'아군과 물건이 겹치면 고르는 창 (고르기 · 줍기)');
 await p.click('#ask [data-ovk="i"]'); await p.waitForTimeout(200);
 const pk = await p.evaluate(()=>{ const n=world.units.find(u=>u.name==='노먼'); const o=n.order||(n.ordPend&&n.ordPend.o); return { o: o && o.k, id: o && o.id, hid: document.getElementById('ask').hidden }; }); console.log('    줍기', JSON.stringify(pk)); ok(pk.o==='pick'&&pk.id===991&&pk.hid,'줍기를 고르면 그 자리의 노먼이 주우러 감');
 const r2 = await p.evaluate(()=>{ const W=world, n=W.units.find(u=>u.name==='노먼'); sel=new Set(); playClick({x:n.x,y:n.y}, false, n); const one=!document.getElementById('ask').hidden; playClick({x:n.x,y:n.y}, false, n); return !one && !document.getElementById('ask').hidden; }); ok(r2,'다시: 첫 클릭은 고르기만 · 두 번째에 창');
 await p.click('#ask [data-ovk="u"]'); await p.waitForTimeout(150); const s1 = await p.evaluate(()=>[...sel].map(i=>world.units[i].name)); ok(s1.includes('노먼'),'인물을 고르면 그 아군이 골라짐');
 // 적 몸 위 물건은 아이콘을 정확히 누를 때만
 const r3 = await p.evaluate(()=>{ const W=world, e=W.units.find(u=>u.side===1); e.seenBy=1; W.items.push({ id: 992, k: 'weapon', name: '창', x: e.x+0.3, y: e.y, owner: e.i, t: 0, how: 'test' }); document.getElementById('ask').hidden=true; askOv=null; sel=new Set([W.units.find(u=>u.name==='인주').i]); playClick({x:e.x-0.05,y:e.y}, false, e); const a=!document.getElementById('ask').hidden; document.getElementById('ask').hidden=true; askOv=null; return { a, atk: (W.units.find(u=>u.name==='인주').ordPend||{}).o }; });
 console.log('    적 몸 클릭', JSON.stringify(r3)); ok(!r3.a,'적의 몸을 누르면 창 없이 공격 (물건 아이콘이 아니면)');
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs));
 await p.screenshot({path:'ui7151.png'});
 // 모바일: 창이 화면 안
 const m=await (await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true,deviceScaleFactor:2.6})).newPage(); const e2=[]; m.on('pageerror',e=>e2.push(e.message));
 await m.goto(url); await m.waitForTimeout(400); await m.evaluate(()=>localStorage.clear()); await m.reload(); await m.waitForTimeout(900);
 const mb = await m.evaluate(()=>{ start(); const W=world, n=W.units.find(u=>u.name==='노먼'); W.items.push({ id: 993, k: 'weapon', name: '장검', x: n.x, y: n.y, owner: n.i, t: 0, how: 'test' }); sel=new Set(); playClick({x:n.x,y:n.y}, false, n); playClick({x:n.x,y:n.y}, false, n); const r=document.getElementById('ask').getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, iw: innerWidth, ih: innerHeight }; });
 console.log('    모바일 창', JSON.stringify(mb)); ok(mb.l>=0&&mb.r<=mb.iw&&mb.t>=0&&mb.b<=mb.ih,'모바일: 창이 화면 안'); ok(e2.length===0,'모바일 오류 없음 '+JSON.stringify(e2));
 console.log(fails?`${fails} FAIL`:'ALL UI7151 OK'); await b.close(); })();
