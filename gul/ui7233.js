// v7.23.3 UI 시험 — ui7233.js v1.3 (v1.3: v7.25.2 전리품 카드 — 동료 얼굴 단추로 · v1.2: 싸움 중에 컷인 · 권위 창을 화면처럼 처리 · v1.1: 끝 화면 위에 대화 창이 뜨지 않음 · 프롤로그 끝 화면의 '프롤로그 기록': 맵마다 시간 · 처치 · 3S 만남 (잠든 사냥꾼 → 따라와 동료가 됨) · 각혈 (2S · 쓰러뜨림) · 세자르 (싸운 시간) · 전리품 (노인의 왕관 ← 세자르) · 2F 는 다음에 · 휴대폰 너비에서 넘치지 않음 · 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ showTab('place'); renderFloors(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); });
 // 앞의 맵 넷은 기록만 (1S 30.4초 · 2S 41.2초 + 다시 9초 · 3S 잠든 사냥꾼 · 4S 22초) — 2S 에 각혈이 나타나 쓰러짐
 await p.evaluate(()=>{ const C=S.camp; while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   C.log=[{s:1,t:30.4,res:'exit',kills:5,party:[]},{s:2,t:41.2,res:'exit',kills:7,party:[]},{s:2,t:9,res:'exit',kills:1,party:[]},{s:3,t:18.6,res:'exit',kills:0,party:[]},{s:4,t:22,res:'exit',kills:4,party:[]}];
   C.kh=2; C.khRes='down'; C.stages=C.stages||{}; for (const k of [1,2,3,4]) C.stages[k]={...(C.stages[k]||{}),seed:k,tseed:k,seen:true,cleared:true,foes:[]}; C.stages[2].khDone=true; C.stages[3].e3='chin'; C.stages[3].cleared=false; C.stages[3].enc={npc:'chin',st:'followed',x:16.5,y:5.2,seen:true,n:0};
   const party=S.units.filter(u=>u.side===0); C.s=5; campBuild(5,'down',party); });
 await p.waitForTimeout(500);
 // 세자르: 일어남 → 3초 싸움 → 쓰러짐 (엔진의 피해로 — 떨어뜨림 · 전리품)
 const f = await p.evaluate(()=>{ while (TK){ if (TK.timer) talkDone(); talkAdv(); } const E=S.camp.stages[5].cz; czRise(world,E); while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   for (const u of world.units.filter(u=>u.side===0&&u.alive)) u.max=u.hp=4000;
   mode='run'; paused=false; for (let i=0;i<90&&!world.over;i++){ stepWorld(world,1/30); czEvTick(world); czCutTick(world); while (TK){ if (TK.timer) talkDone(); talkAdv(); } } const k=world.units.find(u=>u.brain==='cesar'), h=world.units.find(u=>u.side===0&&u.alive);
   applyDmg(world,h,k,99999,{}); for (let i=0;i<3;i++){ stepWorld(world,1/30); czEvTick(world); } paused=true; mode='plan'; while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   return { st: E.st, fs: E.fs, alive: k.alive, cleared: world.cleared, loot: lootOf(world).map(x=>x.label||x.name) }; });
 console.log('    세자르', JSON.stringify(f)); ok(f.st==='stairs'&&f.fs>2.5&&f.fs<4&&!f.alive,'세자르가 무너짐 — 싸운 시간 '+f.fs+'초'); ok(f.loot.some(x=>/노인의 왕관/.test(x)),'전리품에 노인의 왕관');
 // 전리품 창에서 왕관을 첫 동료 가방으로
 const g = await p.evaluate(()=>{ campBarRender(true); const lb=document.querySelector('[data-cloot]'); if (!lb) return { btn:false }; lb.click(); const L=lootOf(world), i=L.findIndex(x=>/노인의 왕관/.test(x.label||x.name)); const op=[...document.querySelectorAll(`[data-lgive="${i}"]`)].find(o=>!o.disabled); const pp=S.units.find(x=>String(x.id)===op.dataset.lp); op.click(); const cl=document.getElementById('lootClose')||[...document.querySelectorAll('#banner button')].find(x=>/닫|돌아/.test(x.innerText)); if (cl) cl.click(); return { btn:true, who: pp.name, bag: (pp.bag||[]).map(x=>x.label||x.name) }; });
 console.log('    전리품', JSON.stringify(g)); ok(g.btn&&g.bag.some(x=>/노인의 왕관/.test(x)),'왕관을 '+g.who+' 가방에');
 // 계단으로 → 끝 화면
 const e = await p.evaluate(()=>{ document.getElementById('banner').hidden=true; campBarRender(true); document.querySelector('[data-cexit="up"]').click(); mode='run'; paused=false; for (let i=0;i<30*40&&!world.over;i++) stepWorld(world,1/30); paused=true; onOver(); const nb=document.getElementById('campNext'); if (nb) nb.click(); const bn=document.getElementById('banner'), pr=bn.querySelector('.prec'); return { end: S.camp&&S.camp.end, txt: pr?pr.innerText:'', w: pr?pr.getBoundingClientRect().width:0, bw: bn.getBoundingClientRect().width, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }; });
 console.log('    끝 ('+vw.nm+')\n      '+e.txt.replace(/\n/g,'\n      ')); console.log('      너비',e.w,e.bw,e.sw,e.cw);
 ok(e.end==='clear'&&/프롤로그 기록/.test(e.txt),'끝 화면에 "프롤로그 기록"');
 ok(/1S 30초/.test(e.txt)&&/2S 50초 \(2번\)/.test(e.txt)&&/5S \d+초/.test(e.txt)&&/처치 \d+/.test(e.txt),'맵마다 시간 (두 번 들른 2S 는 더해서) · 처치');
 ok(/잠든 사냥꾼 — 따라와 동료가 됨/.test(e.txt),'만남 — 잠든 사냥꾼 → 따라와 동료가 됨');
 ok(/2S 에서 피할 수 없는 죽음이 찾아옴 — 쓰러뜨림/.test(e.txt),'각혈 — 2S · 쓰러뜨림');
 ok(/관 속의 왕이 일어섰다가 무너짐 — 싸운 시간 3초/.test(e.txt),'세자르 — 싸운 시간');
 ok(new RegExp('노인의 왕관 ← 세자르 · '+g.who).test(e.txt),'전리품 — 노인의 왕관 ← 세자르 · '+g.who);
 ok(/2F 는 다음에/.test(e.txt),'"2F 는 다음에"');
 ok(e.sw<=e.cw+1&&e.w<=e.cw,'넘치지 않음 ('+vw.nm+')');
 await p.waitForTimeout(600); const tk = await p.evaluate(()=>TK?TK.full:''); if (tk) console.log('      대화 창:', tk); ok(await p.evaluate(()=>!TK&&!document.querySelector('.czcut')),'끝 화면 위에 대화 창 · 컷인이 뜨지 않음 ('+vw.nm+')');
 await p.screenshot({path:`_s7233_${vw.nm}.png`});
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3))); await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7233 OK'); await b.close(); })();
