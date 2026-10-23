// v7.25.2 UI 시험 — ui7252.js v1.5 (v1.5: v8.7.6 전리품 단추는 번호가 아니라 출처 열쇠 (lk — 목록을 다시 세도 어긋나지 않게) · v1.4: v8.7.3 남은 전리품이 있으면 정산 창은 전리품 탭부터 — 카드 · 성장 칩은 정산 탭을 눌러 봄 · 전리품 탭이 먼저 열림도 확인 · v1.3: v8.7.2 처음 동료 일곱 (뽑기 셋) · v1.2: v8.5.0 전리품 창 다시에 맞춤 · v1.1: 판 위의 확인 창 — 자동 시험은 __askAuto 로 바로 '예' · 정산 화면: 탭 셋 (정산 · 전리품 · 장비 · 가방) · ✦ 성장 칩 · 전리품 = 무구 모두 (무기 · 방패) · 방어구는 드물고 망가짐 ·
//   동료 얼굴을 누르면 그 가방으로 · 장비 탭에서 끼우기 → 다음 맵 판에 그 무기 · 맵 중간 전리품 창도 카드 · 화면 안 (PC · 휴대폰))
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const vw of [{width:1280,height:860,nm:'PC'},{width:412,height:880,nm:'휴대폰',mob:true}]){
   const p=await (await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true');
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); }); await p.waitForTimeout(500);
   const r = await p.evaluate(()=>{ const W=world, al=W.units.filter(u=>u.side===0), k=al[0]; for (const f of W.units.filter(u=>u.side===1)) applyDmg(W,k,f,99999,{}); const rb=W.units.find(u=>u.name==='레베카'); rb.shots=30; rb.miss=2;
     for (const u of al) leaveMap(W,u,'up'); checkEnd(W); mode='plan'; onOver(); const bn=document.getElementById('banner'); const first=(bn.querySelector('[data-crt].on')||{}).dataset; const sb=bn.querySelector('[data-crt="sum"]'); if (sb) sb.click();
     return { vis:!bn.hidden, first: first && first.crt, tabs:[...bn.querySelectorAll('[data-crt]')].map(b=>b.textContent), chips:bn.querySelectorAll('.gchip').length, cards:bn.querySelectorAll('.cgrid .cc').length }; });
   console.log('    '+vw.nm+' 정산',JSON.stringify(r)); ok(r.vis&&r.tabs.length===3&&/정산/.test(r.tabs[0])&&/전리품/.test(r.tabs[1])&&/장비/.test(r.tabs[2])&&r.cards===7,vw.nm+': 맵을 넘어가면 정산 화면 — 탭 셋 · 동료 카드 여섯');
   ok(r.chips>=1,vw.nm+': ✦ 성장이 칩으로 크게 ('+r.chips+')'); ok(r.first==='loot',vw.nm+': 남은 전리품이 있으면 전리품 탭부터 ('+r.first+')');
   if (vw.mob) await p.screenshot({path:'_s7252_sum_mo.png'}); else await p.screenshot({path:'_s7252_sum.png'});
   const l = await p.evaluate(()=>{ document.querySelector('[data-crt="loot"]').click(); const L=lootOf(world), cards=document.querySelectorAll('#crBody .l8r').length+L.filter(x=>x.taken).length;
     const w=L.filter(x=>x.k==='weapon').length, sh=L.filter(x=>x.k==='shield').length, ar=L.filter(x=>x.k==='armor'||x.k==='helm');
     const i=L.findIndex(x=>x.k==='weapon'&&x.name==='장검'), rb=crCtx.party.find(x=>x.name==='레베카'), bag0=(rb.bag||[]).length; lootTo=rb.id; crRender(); const btn=document.querySelector(`#crBody .l8go[data-lgive="${L[i].lk!=null?L[i].lk:i}"][data-lp="${rb.id}"]`); if (btn) btn.click();
     return { cards, w, sh, ar: ar.map(x=>x.k+':'+x.dur+(x.worn?':worn':'')), i, got: (rb.bag||[]).length-bag0, taken: L[i]&&L[i].taken, em: document.querySelectorAll('#crBody .l8took').length }; });
   console.log('    '+vw.nm+' 전리품',JSON.stringify(l));
   ok(l.cards>=7&&l.w>=5&&l.sh>=2,vw.nm+': 전리품 — 무구는 모두 (무기 '+l.w+' · 방패 '+l.sh+')');
   ok(l.ar.every(x=>/worn/.test(x)&&+x.split(':')[1]<=60),vw.nm+': 방어구는 드물고 나와도 망가짐 ('+l.ar.length+')');
   ok(l.i>=0&&l.got===1&&l.taken==='레베카'&&l.em>=1,vw.nm+': 레베카 얼굴을 누르면 장검이 레베카 가방으로');
   if (vw.mob) await p.screenshot({path:'_s7252_loot_mo.png'}); else await p.screenshot({path:'_s7252_loot.png'});
   const e = await p.evaluate(()=>{ document.querySelector('[data-crt="eq"]').click(); const rb=crCtx.party.find(x=>x.name==='레베카'), bi=(rb.bag||[]).findIndex(x=>x.k==='weapon'&&x.name==='장검');
     const c=document.querySelector(`#crBody .ceq[data-pid="${rb.id}"]`); if (!c) return { no:true }; c.querySelector(`[data-ibag="${bi}"]`).click(); const c2=document.querySelector(`#crBody .ceq[data-pid="${rb.id}"]`), eqb=c2.querySelector('[data-iact="equip"]'); const dis=eqb&&eqb.disabled; if (eqb) eqb.click();
     return { n: document.querySelectorAll('#crBody .ceq').length, bi, dis, wName: rb.wName, inBag: (rb.bag||[]).filter(x=>x.k==='weapon').map(x=>x.label||x.name), add: !!document.querySelector('#crBody [data-iadd]') }; });
   console.log('    '+vw.nm+' 장비',JSON.stringify(e)); ok(e.n===7&&!e.dis&&/검방패기사의 장검/.test(e.wName||'')&&!e.add,vw.nm+': 장비 · 가방 탭 — 끼우기 (레베카가 검방패기사의 장검을 듦 · 원래 장검은 가방으로) · 만들기 없음');
   if (vw.mob) await p.screenshot({path:'_s7252_eq_mo.png'}); else await p.screenshot({path:'_s7252_eq.png'});
   const n = await p.evaluate(()=>{ const lay=[...document.querySelectorAll('#banner .l8p,#banner .l8go,#banner .ivc,#banner .btn')].filter(x=>{ const q=x.getBoundingClientRect(); return q.width&&(q.right>innerWidth+1||q.left<-1); }).length;
     document.getElementById('campNext').click(); const u=world.units.find(x=>x.name==='레베카'); return { lay, s:S.camp.s, wName:u&&u.wName, sw:document.documentElement.scrollWidth, iw:innerWidth }; });
   console.log('    '+vw.nm+' 다음 맵',JSON.stringify(n)); ok(n.lay===0&&n.sw<=n.iw+1,vw.nm+': 정산 화면이 화면 안'); ok(n.s===2&&/검방패기사의 장검/.test(n.wName||''),vw.nm+': 2S 판의 레베카가 끼운 장검을 듦');
   ok(!errs.length,vw.nm+' 오류 없음 '+errs.slice(0,2).join(' | ')); }
 await b.close(); console.log(fails?`${fails} FAIL`:'ALL UI7252 OK'); })();
