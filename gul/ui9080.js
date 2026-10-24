// v9.5.2 UI 시험 — ui9080.js v1.0 (사람 ❓ 다섯 (왐 · 로지나 · 대장장이 · 마리 · 야전의사) 이 비전투 맵 위 NPC 로 · 말을 걸면 선택이 뜸 · 두건은 노인의 왕관을 찬 이가 있으면 대사가 바뀜)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join('|'))); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 const MAP={'t:wam':'m_wam','t:rosina':'m_rosina','t:smith':'m_smith','t:marie':'m_marie','t:nurse':'m_tent'};
 for (const [k,npc] of Object.entries(MAP)){
   const o = await p.evaluate(([k,npc])=>{ const R=R8S(); const nd=R.fm.rows[2][0]; const o={ e:[] }; nd.t='enc'; nd.empty=false; nd.npc8=undefined; nd.enc=k; nd.restAsk=1; nd.src8=undefined; nd.comp=undefined; world=null; try { r8Enter(nd); } catch(e){ o.e.push(e.message+' '+(e.stack||'').split('\n')[1]); } const W=world; const E=encCur(); o.t=nd.t; o.base=(MAPS8[S.art8]||{}).base; o.foes=W?W.units.filter(u=>u.side===1&&u.alive).length:-1; o.npc=E&&E.npc; o.st=E&&E.st;
     if (E){ for (const u of W.units) if (u.side===0&&u.alive){ u.x=E.x-1.2; u.y=E.y; } } if (TK) talkClose(); try { paused=true; draw(); for (let i=0;i<40;i++) stepWorld(W,1/30); } catch(e){ o.e.push('sim '+e.message); }
     if (E&&E.st==='hidden') E.st='sit'; if (TK) talkClose(); encTalk(E); o.ask=TK&&(TK.lines.find(l=>l.ask)||{ask:[]}).ask.map(a=>a[0].slice(0,14)); talkClose(); world=null; try { r8NodeDone(); } catch(e){} return o; }, [k,npc]);
   console.log('    '+k+' '+JSON.stringify(o).slice(0,300));
   ok(o.t==='fight'&&o.npc===npc&&o.foes===0&&['gevent1','ruin2c'].includes(o.base)&&!o.e.length&&o.ask&&o.ask.length>=2,k+' → 비전투 맵 ('+o.base+') · '+npc+' 이(가) 놓임 · 말을 걸면 선택 '+(o.ask||[]).length+'개');
 }
 // 두건 · 왕관
 await p.waitForTimeout(500);
 const h = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[5][0]; nd.t='enc'; nd.empty=false; nd.npc8=undefined; nd.enc='p:hood'; nd.restAsk=1; nd.src8=undefined; world=null; r8Enter(nd); const W=world, E=encCur(); if (TK) talkClose(); for (const u of W.units) if (u.side===0&&u.alive){ u.x=E.x-1.2; u.y=E.y; }
   const o={}; encTalk(E); o.l0=TK&&TK.lines.find(l=>l.t).t; talkClose(); const me=W.units.find(u=>u.side===0&&u.alive&&!u.summon); me.gear=me.gear||{}; me.gear['머리']={ name:'노인의 왕관', mat:'투구', tier:5, dur:100 }; o.crown=crownOn(me); encTalk(E); o.l1=TK&&TK.lines.find(l=>l.t).t; o.ask=TK&&TK.lines.find(l=>l.ask).ask.length; talkClose(); return o; });
 console.log('    ', JSON.stringify(h));
 ok(/많이도 짊어졌구나/.test(h.l0||''),'평소: "..........오오...많이도 짊어졌구나"'); ok(h.crown&&/위대한 자의 것이구나/.test(h.l1||'')&&h.ask===3,'노인의 왕관을 찬 이가 있으면: ".......오오..위대한 자의 것이구나" · 선택 셋 그대로');
 // 비전투 맵을 걸어 나가면 싸움 보상 (동전 · 유물) 이 없음
 const pg = await p.evaluate(()=>{ world=null; if (TK) talkClose(); const R=R8S(); const nd=R.fm.rows[7][0]; nd.t='enc'; nd.empty=false; nd.npc8=undefined; nd.enc='p:hobo'; nd.restAsk=1; nd.src8=undefined; nd.comp=undefined; R.gold=100; const rel0=R.relics.length; r8Enter(nd); if (TK) talkClose(); const W=world; for (const u of W.units) if (u.side===0&&u.alive&&!u.summon) leaveMap(W,u,'up'); checkEnd(W); const o={ over:W.over, peace:!!nd.peace }; if (W.over){ mode='plan'; try { onOver(); } catch(e){ o.err=e.message; } } o.gold=R.gold; o.rel=R.relics.length-rel0; return o; });
 ok(pg.over&&pg.peace&&pg.gold===100&&pg.rel===0&&!pg.err,'비전투 맵을 걸어 나가도 동전 · 유물이 없음 (동전 100 → '+pg.gold+')');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
