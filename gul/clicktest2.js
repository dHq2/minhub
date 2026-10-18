// 카드 클릭 시험 — clicktest2.js v1.2 (v1.2: 다시 잡기를 2초까지 늘림 · v1.1: 재생 중 카드가 다시 그려지는 사이면 다시 잡음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p=await (await b.newContext({viewport:{width:1280,height:800}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
 await p.evaluate(()=>{ start(); }); await p.click('#contBtn'); await p.waitForTimeout(500);
 // 카드 클릭 (재생 중)
 const out=[];
 for (const i of [3,1,2]){ let bb=null; for(let k=0;k<70&&!bb;k++){ const el = await p.$(`#party [data-ally="${i}"]`); bb = el ? await el.boundingBox() : null; if(!bb) await p.waitForTimeout(30); }   /* v1.1 재생 중 카드가 다시 그려지는 사이면 다시 잡음 */ await p.mouse.move(bb.x+20,bb.y+12); await p.mouse.down(); await p.waitForTimeout(150); await p.mouse.up(); await p.waitForTimeout(250); out.push(i+':'+await p.evaluate(()=>[...sel].join(','))); }
 console.log('카드', out.join(' | '));
 // 카리우스 선택 → 휘두르기 줄
 await p.evaluate(()=>{ const i=world.units.findIndex(u=>u.modBody); sel=new Set([i]); hud(); }); await p.waitForTimeout(300);
 console.log('swbar', await p.evaluate(()=>!document.getElementById('swbar').hidden), await p.evaluate(()=>document.getElementById('swbar').innerText.replace(/\s+/g,' ')));
 await p.click('#swbar [data-swm="휘두르기"]'); await p.waitForTimeout(250);
 console.log('모드', await p.evaluate(()=>world.units.find(u=>u.modBody).swing), await p.evaluate(()=>document.querySelector('#swbar .on').textContent), await p.evaluate(()=>document.getElementById('swbar').innerText.replace(/\s+/g,' ')));
 await p.screenshot({path:'sw7106.png'});
 await p.click('#swbar [data-swm=""]'); await p.waitForTimeout(200); console.log('자동', await p.evaluate(()=>world.units.find(u=>u.modBody).swing));
 console.log(JSON.stringify(errs)); await b.close(); })();
