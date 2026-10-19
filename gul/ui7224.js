// v7.22.4 UI 시험 — ui7224.js v1.1 (v1.1: 판 위의 확인 창 — 자동 시험은 __askAuto 로 바로 '예' · 당신들을 따라온 누군가: 1S 에서 아군을 버림 → 기억 (체력 그대로) · 버린 이가 있을 때만 3S 만남에 나옴 · 다가가면 나레이션 → 다시 합류 (그때 체력) · 그냥 넘어가도 따라옴 · 버린 이 목록에서 빠짐)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 const START = `(()=>{ showTab('place'); renderFloors(); if (S.camp) campQuit(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); return true; })()`;
 // 1S 에서 하나를 버림 (나머지는 위로)
 const ABANDON = `(()=>{ const al=world.units.filter(u=>u.side===0&&u.alive), v=al.find(u=>!u.hero&&u.name!=='카리우스'); v.hp=Math.round(v.max*0.4); for (const u of al) if (u!==v) leaveMap(world,u,'up'); checkEnd(world);
   const btn=document.querySelector('[data-cabandon]'); campBarRender(true); const b2=document.querySelector('[data-cabandon]'); if (b2) b2.click(); else { v.gone='left'; v.alive=false; checkEnd(world); mode='plan'; onOver(); }
   const nb=document.getElementById('campNext'); if (nb) nb.click(); return { name: v.name, hp: Math.round(v.hp), lost: S.camp.lost.slice(), lostP: (S.camp.lostP||[]).map(q=>q.name+':'+q.hpNow), s: S.camp.s }; })()`;
 await p.evaluate(START); const a1 = await p.evaluate(ABANDON);
 console.log('    버림', JSON.stringify(a1)); ok(a1.s===2&&a1.lost.includes(a1.name)&&a1.lostP.length===1&&a1.lostP[0]===a1.name+':'+a1.hp,'버린 아군을 기억함 (그때 체력 '+a1.hp+')');
 const pk = await p.evaluate(()=>{ let n=0; for (let i=0;i<300;i++) if (encPick(S.camp,S.units.filter(u=>u.side===0)).k==='lost') n++; const C0={fallen:[],lost:[],lostP:[]}; let m=0; for (let i=0;i<300;i++) if (encPick(C0,[]).k==='lost') m++; return { n, m }; });
 ok(pk.n>0&&pk.m===0,'버린 이가 있을 때만 3S 만남에 나옴 ('+JSON.stringify(pk)+')');
 // 3S: 따라온 누군가
 const m3 = await p.evaluate(()=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.stages[3]={ seed: 11, tseed: 7, e3: 'lost' }; C.s=3; campBuild(3,'down',party); const E=encCur(); return { npc: E&&E.npc, name: E&&E.name, ref: E&&E.ref, bar: document.getElementById('campBar').innerText }; });
 console.log('    3S', JSON.stringify(m3)); ok(m3.npc==='lost'&&m3.name===a1.name&&/당신들을 따라온 누군가/.test(m3.bar),'3S — 당신들을 따라온 누군가 ('+m3.name+' 의 얼굴)');
 const j = await p.evaluate(()=>{ const E=encCur(), al=world.units.filter(u=>u.alive&&u.side===0), h=al.find(u=>u.hero); h.x=E.x; h.y=E.y+3; computeLight(world); encTick(world); const seen=TK&&TK.full; for (let i=0;i<10&&TK;i++){ if (TK.timer) talkDone(); talkAdv(); }
   encTick(world); const lines=[]; for (let i=0;i<10&&TK;i++){ if (TK.timer) talkDone(); lines.push(TK.full); talkAdv(); }
   const u=world.units.find(x=>x.name===E.name&&x.side===0&&x.alive); return { seen, lines, joined: !!u, hp: u&&Math.round(u.hp), st: E.st, lost: S.camp.lost.slice(), lostP: (S.camp.lostP||[]).length }; });
 console.log('    합류', JSON.stringify(j)); ok(/비틀거리며 다가온다/.test(j.seen||'')&&j.lines.some(l=>/당신들을 따라온 누군가가 있다/.test(l)),'다가가면 "당신들을 따라온 누군가가 있다."');
 ok(j.joined&&j.hp===a1.hp&&j.st==='joined'&&!j.lost.includes(a1.name)&&j.lostP===0,'다시 합류 (그때 체력 '+j.hp+') · 버린 이 목록에서 빠짐');
 // 그냥 넘어가도 따라옴
 await p.evaluate(START); const a2 = await p.evaluate(ABANDON);
 const f = await p.evaluate(()=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.stages[3]={ seed: 11, tseed: 7, e3: 'lost' }; C.s=3; campBuild(3,'down',party);
   for(const u of world.units.filter(u=>u.side===0&&u.alive)) leaveMap(world,u,'up'); checkEnd(world); mode='plan'; onOver(); const nb=document.getElementById('campNext'); if(nb) nb.click(); return { s: C.s, party: S.units.filter(u=>u.side===0).map(u=>u.name), lost: C.lost.slice() }; });
 await p.waitForTimeout(600); const ft = await p.evaluate(()=>TK&&TK.full);
 console.log('    지나침', JSON.stringify(f), ft); ok(f.s===4&&f.party.includes(a2.name)&&!f.lost.includes(a2.name)&&/따라온 누군가가 있다/.test(ft||''),'그냥 넘어가도 따라옴 (다음 맵 나레이션)');
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?`${fails} FAIL`:'ALL UI7224 OK'); await b.close(); })();
