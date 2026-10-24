// v9.4.0 UI 시험 — ui9040.js v1.0 (❓ 쉬기 · 정해진 만남엔 없음 · 사람 만남 = 비전투 맵 (노숙악마 · 두건) · 모닥불 · 적선 → 오래된 약병 ×5 · 말 걸수록 바뀌는 대사 · 싸우면 도망 · 두건은 쉼만 · 그림 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join('|'))); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 const closeTK=()=>p.evaluate(()=>{ if (TK) talkClose(); });
 // 1. ❓ 쉬기
 const r1 = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[2][0]; const o={}; R.party.forEach(q=>{ q.hpNow=10; }); const mx=R.party.map(q=>r8MaxHp(q)); nd.enc=null; nd.restAsk=0; world=null; r8Enter(nd); o.enc=nd.enc; const L=TK&&TK.lines[TK.i]; const A=TK&&TK.lines.find(l=>l.ask); o.asks=A?A.ask.map(a=>a[0]):[]; o.first=TK&&TK.lines[0]&&TK.lines[0].narr;
   // 쉰다
   const rest=A.ask.find(a=>/잠시 쉰다/.test(a[0])); talkPick(rest[1]); let g=0; while (TK && g++<30){ if (TK.timer) talkDone(); const l=TK.lines[TK.i]; if (l&&l.ask) break; talkAdv(); } if (TK) talkClose();
   o.hp=R.party.map((q,i)=>+(q.hpNow/mx[i]).toFixed(2)); o.done=R.done.includes(nd.id); o.world=!!world; o.npcDone=(R.npcDone||[]).includes(nd.enc); return o; });
 console.log('    ', JSON.stringify(r1).slice(0,400));
 ok(r1.asks.length===2&&/다가간다/.test(r1.asks[0])&&/잠시 쉰다/.test(r1.asks[1]),'❓ : 다가간다 / 잠시 쉰다 두 선택 ('+r1.enc+')');
 ok(r1.hp.every(h=>h>=0.2&&h<0.4)&&!r1.world,'쉬면 모두 20% 회복 (체력 10 → '+r1.hp.join(' · ')+') · 싸움판 없음');
 ok(r1.done&&!r1.npcDone,'쉰 칸은 마친 칸 · 만남은 쓰이지 않음 (다음에 또 만날 수 있음)');
 // 2. 다가간다 → 만남이 열림 · 정해진 만남엔 쉬기 없음
 const r2 = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[5][0]; const o={}; nd.enc='t:curse'; nd.restAsk=0; world=null; r8Enter(nd); o.first=TK&&TK.lines[0]&&(TK.lines[0].narr||''); o.ask=TK&&(TK.lines.find(l=>l.ask)||{ask:[]}).ask.map(a=>a[0]); if (TK) talkClose(); return o; });
 ok(/글씨/.test(r2.first)&&!r2.ask.some(a=>/잠시 쉰다/.test(a)),'미리 정해진 만남 (지식의 저주) 에는 쉬기가 없음');
 const r2b = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[9][0]; const o={}; nd.enc=null; nd.restAsk=0; world=null; r8Enter(nd); const A=TK.lines.find(l=>l.ask); const go=A.ask.find(a=>/다가간다/.test(a[0])); talkPick(go[1]); o.enc=nd.enc; o.talk=!!TK; o.world=!!world; o.lines=TK?TK.lines.slice(0,2).map(l=>l.narr||l.t||''):[]; if (TK) talkClose(); return o; });
 ok(r2b.enc&&(r2b.talk||r2b.world),'다가간다 → 만남이 이어짐 ('+r2b.enc+')');
 // 3. 노숙악마 — 비전투 맵
 const h1 = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[2][0]; const o={ e:[] }; nd.t='enc'; nd.empty=false; nd.npc8=undefined; nd.enc='p:hobo'; nd.restAsk=1; nd.src8=undefined; world=null; try { r8Enter(nd); } catch(e){ o.e.push(e.message+' '+(e.stack||'').split('\n')[1]); } const W=world; o.t=nd.t; o.empty=nd.empty; o.base=(MAPS8[S.art8]||{}).base; o.foes=W?W.units.filter(u=>u.side===1&&u.alive).length:-1;
   const E=encCur(); o.E=E&&{npc:E.npc,st:E.st,x:E.x,y:E.y}; o.torch=W&&W.torches?W.torches.length:0; o.pass=W&&W.r8&&W.r8.pass; o.lock=W&&W.exitLock; try { paused=true; draw(); } catch(e){ o.e.push('draw '+e.message); } return o; });
 console.log('    ', JSON.stringify(h1).slice(0,500));
 ok(h1.t==='fight'&&h1.empty&&['gevent1','ruin2c'].includes(h1.base)&&h1.foes===0&&!h1.e.length,'노숙악마 = 비전투 맵 ('+h1.base+') · 적 0 · 오류 없음');
 ok(h1.E&&h1.E.npc==='m_hobo'&&h1.torch>=1&&h1.pass&&!h1.lock,'노숙악마가 놓임 · 모닥불 빛 · 출구 열림');
 await p.waitForTimeout(2600); await closeTK(); await p.waitForTimeout(300);
 await p.evaluate(()=>{ const E=encCur(); const W=world; const h=W.units.find(u=>u.hero)||W.units.find(u=>u.side===0&&u.alive); for (const u of W.units) if (u.side===0&&u.alive){ u.x=E.x-1.2+Math.random()*0.4; u.y=E.y+Math.random()*0.8-0.4; } paused=true; draw(); });
 await p.screenshot({path:'ui9040_hobo.png', clip:{x:10,y:60,width:820,height:700}});
 const h2 = await p.evaluate(()=>{ const E=encCur(), o={}; encTalk(E); o.talk=!!TK; o.line=TK&&TK.lines.find(l=>l.t)&&TK.lines.find(l=>l.t).t; o.ask=TK&&TK.lines.find(l=>l.ask).ask.map(a=>a[0]); talkClose(); return o; });
 ok(h2.talk&&/오\.\.\? 오옷\?/.test(h2.line)&&h2.ask.length===4,'가까이 가서 말을 걸면 첫 대사 · 선택 넷 (적선 · 말 · 싸움 · 지나감)');
 // 적선: 쓰레기는 안 받음
 const h3 = await p.evaluate(()=>{ const W=world, R=R8S(); const hero=W.units.find(u=>u.side===0&&u.alive&&u.hero)||W.units.find(u=>u.side===0&&u.alive); const junk={k:'weapon',name:'부러진 단검',dur:0,uid:(W.bagN=(W.bagN||10000)+1)}; hero.bag.push(junk); const n0=hero.bag.length, N0=R.flags.hoboN||0;
   X8.mnHoboGive(); const A=TK.lines.find(l=>l.ask); const o={ asks:A.ask.map(a=>a[0]) }; const ji=A.ask.findIndex(a=>/부러진 단검/.test(a[0])); o.ji=ji; X8['mnHoboItem'+ji](); o.bagAfter=hero.bag.length===n0; o.gave=R.flags.hoboGave||0; o.N=(R.flags.hoboN||0)-N0; o.angry=TK.lines.some(l=>/놀리는 거냐/.test(l.t||'')); talkClose(); hero.bag.splice(hero.bag.indexOf(junk),1); return o; });
 ok(h3.ji>=0&&h3.bagAfter&&!h3.gave&&h3.angry,'쓰레기 (부러진 단검) 는 화내고 안 받음 · 약병 없음');
 // 적선: 좋은 물건 → 약병 ×5
 const h4 = await p.evaluate(()=>{ const W=world, R=R8S(); const hero=W.units.find(u=>u.side===0&&u.alive&&u.hero)||W.units.find(u=>u.side===0&&u.alive); const gift={k:'potion',name:'회복약',label:'',uid:(W.bagN=(W.bagN||10000)+1)}; hero.bag.push(gift); const vial0=W.units.reduce((a,u)=>a+(u.side===0?(u.bag||[]).filter(i=>i.name==='오래된 약병').length:0),0);
   X8.mnHoboGive(); const A=TK.lines.find(l=>l.ask); const gi=A.ask.findIndex(a=>/회복약/.test(a[0])); X8['mnHoboItem'+gi](); const vial1=W.units.reduce((a,u)=>a+(u.side===0?(u.bag||[]).filter(i=>i.name==='오래된 약병').length:0),0); const o={ gi, got:vial1-vial0, gone:!hero.bag.includes(gift), gave:R.flags.hoboGave||0, lines:TK.lines.map(l=>l.t||l.narr||l.box||'').filter(Boolean) }; o.vial=W.units.find(u=>u.side===0&&(u.bag||[]).some(i=>i.name==='오래된 약병')); o.vialItem=o.vial?o.vial.bag.find(i=>i.name==='오래된 약병'):null; o.vial=!!o.vial; talkClose(); return o; });
 console.log('    ', JSON.stringify(h4).slice(0,500));
 ok(h4.gi>=0&&h4.gone&&h4.got===5&&h4.gave===1,'적선 (회복약) → 오래된 약병 ×5 를 받음 (+'+h4.got+')');
 ok(h4.lines.some(l=>/고맙다/.test(l))&&h4.lines.some(l=>/품을 뒤적/.test(l))&&h4.lines.some(l=>/구할수 없는/.test(l)),'첫 적선의 대사 셋 (고맙다 · 품을 뒤적 · 어디가서 구할수 없는거라구)');
 ok(h4.vialItem&&h4.vialItem.k==='potion'&&h4.vialItem.heal>0,'약병은 회복약 (potion) 으로 가방에 — 마실 수 있음');
 // 두 번째 적선 → 약병 없음 · 대사 랜덤
 const h5 = await p.evaluate(()=>{ const W=world, R=R8S(); const hero=W.units.find(u=>u.side===0&&u.alive&&u.hero)||W.units.find(u=>u.side===0&&u.alive); const cnt=()=>W.units.reduce((a,u)=>a+(u.side===0?(u.bag||[]).filter(i=>i.name==='오래된 약병').length:0),0); const v0=cnt(); const G=R.gold; R.gold=50; X8.mnHoboGive(); const A=TK.lines.find(l=>l.ask); const ci=A.ask.findIndex(a=>/동전 10/.test(a[0])); X8.mnHoboCoin(); const o={ ci, v:cnt()-v0, gold:G===undefined?null:50-R.gold, line:TK.lines.map(l=>l.t||'').filter(Boolean)[0], N:R.flags.hoboN }; talkClose(); return o; });
 ok(h5.ci>=0&&h5.v===0&&h5.gold===10&&['고맙다구.','더 나올건 없다구.','나도 한때는 부와 영예를 한몸에 가지고 있었지. 지금은 다 뺐겼지만.'].includes(h5.line),'두 번째 적선 (동전 10): 약병 없음 · 대사 ('+h5.line+')');
 // 말 걸수록: 6번째부터 쫓아냄 · 8번째에 잠듦
 const h6 = await p.evaluate(()=>{ const R=R8S(), o={ seq:[] }; for (let i=0;i<5;i++){ const N0=R.flags.hoboN; X8.mnHoboTalk(); const l=TK.lines.map(x=>x.t||x.narr||'').filter(Boolean)[0]; o.seq.push([R.flags.hoboN,l]); talkClose(); if (R.flags.hoboN>=9) break; } const E=encCur(); o.st=E&&E.st; return o; });
 console.log('    ', JSON.stringify(h6.seq));
 ok(h6.seq.some(([n,l])=>n>=6&&n<8&&['슬슬 가지 그래?','너 정말 심심한가 보구나'].includes(l)),'6 ~ 7번째 말: "슬슬 가지 그래?" / "너 정말 심심한가 보구나"');
 ok(h6.seq.some(([n,l])=>n>=8&&/잠에 든 것 같다/.test(l))&&h6.st==='sleep','8번째부터: "그는 잠에 든 것 같다. 자는 척하는 것인지." · 잠듦');
 // 싸움: 도망다니다 쓰러짐
 const h7 = await p.evaluate(()=>{ const R=R8S(), W=world; const E=encCur(); E.st='sit'; const n0=W.units.length; try { X8.mnHoboFight2(); } catch(e){ return { err:e.message+' '+(e.stack||'').split('\n')[1] }; } const u=W.units[W.units.length-1]; const o={ added:W.units.length-n0, side:u.side, name:u.name, bold:u.bold, hp:u.hp }; let dmin=99, d0=null; try { paused=false; for (let i=0;i<420&&u.alive&&!W.over;i++){ stepWorld(W,1/30); const al=W.units.filter(a=>a.side===0&&a.alive); const d=Math.min(...al.map(a=>Math.hypot(a.x-u.x,a.y-u.y))); dmin=Math.min(dmin,d); } } catch(e){ o.err2=e.message; } o.alive=u.alive; o.t=+W.t.toFixed(1); return o; });
 console.log('    ', JSON.stringify(h7));
 ok(!h7.err&&!h7.err2&&h7.added===1&&h7.side===1&&h7.name==='노숙악마'&&h7.bold<0.1,'싸우면 적 노숙악마가 생김 (겁 많음 bold '+h7.bold+') · 14초 돌려도 오류 없음');
 await p.screenshot({path:'ui9040_hobo_fight.png', clip:{x:10,y:60,width:820,height:700}});
 await p.evaluate(()=>{ world=null; try { r8NodeDone(); } catch(e){} });
 // 4. 두건
 await p.waitForTimeout(300);
 const k1 = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[5][0]; const o={ e:[] }; nd.t='enc'; nd.empty=false; nd.npc8=undefined; nd.enc='p:hood'; nd.restAsk=1; nd.src8=undefined; R.party.forEach(q=>{ q.hpNow=10; }); world=null; try { r8Enter(nd); } catch(e){ o.e.push(e.message); } const W=world; o.base=(MAPS8[S.art8]||{}).base; const E=encCur(); o.npc=E&&E.npc; o.foes=W?W.units.filter(u=>u.side===1&&u.alive).length:-1; o.E=E; return o; });
 await p.waitForTimeout(2600); await closeTK(); await p.waitForTimeout(300);
 const k1b = await p.evaluate(()=>{ const o={}; const W=world, E=encCur(); for (const u of W.units) if (u.side===0&&u.alive){ u.x=E.x-1.2; u.y=E.y; } encTalk(E); o.line=TK&&TK.lines.find(l=>l.t)&&TK.lines.find(l=>l.t).t; o.ask=TK&&TK.lines.find(l=>l.ask).ask.map(a=>a[0]); talkClose(); return o; });
 Object.assign(k1,k1b);
 ok(k1.npc==='m_hood'&&k1.foes===0&&['gevent1','ruin2c'].includes(k1.base)&&!k1.e.length,'두건 = 비전투 맵 ('+k1.base+')');
 ok(/많이도 짊어졌구나/.test(k1.line||'')&&k1.ask.length===3&&k1.ask.some(a=>/쉰다/.test(a))&&k1.ask.some(a=>/공격/.test(a)),'두건 첫 대사 "..........오오...많이도 짊어졌구나" · 쉬기 · 공격 · 지나감');
 const k2 = await p.evaluate(()=>{ const R=R8S(), W=world; const mx=R.party.map(q=>r8MaxHp(q)); const before=W.units.filter(u=>u.side===0&&u.alive).map(u=>u.hp/u.max); X8.mnHoodRest(); const o={ f:R.flags.hoodRest }; if (TK) talkClose(); const a1=W.units.filter(u=>u.side===0&&u.alive).map(u=>u.hp/u.max); o.up=a1.every((v,i)=>v>before[i]+0.2); X8.mnHoodRest(); o.again=TK.lines.some(l=>/이미 할 말을/.test(l.narr||'')); talkClose(); return o; });
 ok(k2.f===1&&k2.up&&k2.again,'쉼: 모두 25% 회복 · 한 번뿐 (두 번째는 말이 없음)');
 const k3 = await p.evaluate(()=>{ const R=R8S(), W=world; const E=encCur(); const n0=W.units.length; X8.mnHoodHit(); const o={ st:E.st, slain:R.flags.hoodSlain, n:W.units.length-n0, line:TK.lines.map(l=>l.narr||'').join('|') }; talkClose(); return o; });
 ok(k3.st==='dead'&&k3.slain===1&&k3.n===0&&/저항하지 않는다/.test(k3.line),'공격하면 저항하지 않고 쓰러짐 (싸움 없음)');
 await p.evaluate(()=>{ paused=true; draw(); });
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
