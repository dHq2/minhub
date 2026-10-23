// v8.5.0 UI 시험 — ui8500.js v1.1 (v1.1: v8.7.6 — 시험이 넣는 전리품 목록은 lootOf 를 한 번 부른 뒤 (목록을 다시 셀 때를 가리는 서명이 생긴 뒤) · 맵 위 (싸우는 중) 에서 받으면 판의 몸 가방으로 (명단은 정산 때) · v1.0: 전리품 창 다시: 받는 사람 한 줄 · 종류별 줄 · 줄마다 단추 하나 · 받는 사람 바꾸기 · → 단추로 가방에 · 챙긴 것 한 줄 · ★ 추천 (방패 → 방패 없는 근접) · ✨ 알맞게 나누기 · 정산 화면 전리품 탭 · 휴대폰 가로 넘침 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); await ctx.addInitScript('window.__askAuto=true'); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.dismiss());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 console.log('== '+vw.nm);
 const a = await p.evaluate(()=>{ setMode('train'); resetToEdit(); start(); const W=world; paused=true; for (const q of S.units) if (q.side===0) q.bag=[];
   lootOf(W); W.loot=[ { k:'weapon', name:'장검', label:'망자의 장검', dur:80 }, { k:'shield', name:'방패', label:'망자의 방패', dur:100 }, { k:'armor', name:'사슬 갑옷', label:'망자의 갑옷', mat:'사슬', tier:2, dur:40, worn:true, size: sizeP(S.units.find(q=>q.side===0)) }, { k:'ammo', at:'화살', n:10, label:'화살 묶음' } ];
   const bn=$('banner'); bn.className='banner win'; bn.innerHTML='<b>시험</b><div class="cbody" id="lootBox"></div>'; bn.hidden=false; renderLoot(); const PL=lootParty();
   return { faces: bn.querySelectorAll('.l8to .l8p').length, PL: PL.length, rows: bn.querySelectorAll('.l8r').length, go: [...bn.querySelectorAll('.l8r')].every(r=>r.querySelectorAll('.l8go').length===1), groups: bn.querySelectorAll('.l8g').length, oldFaces: bn.querySelectorAll('.lto .lp').length }; });
 console.log('    창', JSON.stringify(a)); ok(a.faces===a.PL&&a.PL>0,'받는 사람은 위에 한 줄 ('+a.faces+'명)'); ok(a.rows===4&&a.go,'물건마다 한 줄 · 단추 하나 (줄마다 동료 얼굴 줄 없음)'); ok(a.groups===3&&a.oldFaces===0,'종류별 묶음 셋');
 const c = await p.evaluate(()=>{ const bn=$('banner'), P=lootParty(), q=P[1]||P[0]; bn.querySelector(`.l8p[data-lto="${q.id}"]`).click(); const on=bn.querySelector('.l8p.on small').textContent, txt=bn.querySelector('.l8r .l8go').textContent;
   const lu=world.units.find(u=>u.pid===q.id), b0=(q.bag||[]).length, l0=lu?(lu.bag||[]).length:0; bn.querySelector('.l8r .l8go').click(); return { on, nm: q.name, txt, got: (q.bag||[]).length-b0+(lu?(lu.bag||[]).length-l0:0), rows: bn.querySelectorAll('.l8r').length, took: (bn.querySelector('.l8took')||{}).textContent||'' }; });
 console.log('    주기', JSON.stringify(c)); ok(c.on===c.nm&&c.txt.includes(c.nm),'받는 사람을 바꾸면 단추도 → 그 이름'); ok(c.got===1&&c.rows===3&&/챙긴 것/.test(c.took)&&c.took.includes(c.nm),'→ 단추로 그 가방에 · 챙긴 것 한 줄로');
 const f = await p.evaluate(()=>{ const L=lootOf(world), i=L.findIndex(x=>x.k==='shield'), fit=lootFit(L[i], lootParty()); return { fit: fit&&fit.name, sh: fit&&!!fit.shield, far: fit&&lootFar(fit.weapon) }; });
 console.log('    추천', JSON.stringify(f)); ok(f.fit&&!f.sh&&!f.far,'방패 추천은 방패 없는 근접 ('+f.fit+')');
 const s = await p.evaluate(()=>{ const bn=$('banner'); bn.querySelector('[data-lauto]').click(); const L=lootOf(world); return { left: L.filter(x=>!x.taken).length, rows: bn.querySelectorAll('.l8r').length, none: /모두 챙겼어요/.test(bn.textContent), w: bn.scrollWidth, cw: bn.clientWidth }; });
 console.log('    나누기', JSON.stringify(s)); ok(s.left===0&&s.rows===0&&s.none,'✨ 알맞게 나누기 → 모두 챙김'); ok(s.w<=s.cw+2,'창 가로 넘침 없음');
 // 정산 화면의 전리품 탭에서도
 const t = await p.evaluate(()=>{ const W=world; lootOf(W); W.loot=[{ k:'weapon', name:'단검', label:'시험 단검', dur:90 }]; const party=lootParty(); crCtx={ rows: [], party, W }; crTab='loot'; const bn=$('banner'); bn.innerHTML='<div class="ctabs" id="crTabs"><button data-crt="loot">전리품</button></div><div class="cbody" id="crBody"></div>'; crRender();
   const n=bn.querySelectorAll('#crBody .l8r').length; bn.querySelector('#crBody .l8go').click(); return { n, left: lootOf(W).filter(x=>!x.taken).length }; });
 ok(t.n===1&&t.left===0,'정산 화면 전리품 탭도 새 창 · 단추로 챙김');
 if (vw.mob) await p.screenshot({ path: 'ui8500_mo.png' });
 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 await ctx.close(); }
 console.log(fails ? 'FAIL '+fails : 'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
