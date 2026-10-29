// v9.5.0 UI 시험 — ui9060.js v1.1 (v1.1: v9.14.0 둘은 제3세력 (2편) · v1.0: 제3세력 심계: 유적 입구에서 헌팅나이프 · 카밀라가 먼저 싸우는 중 · 싸움 뒤 말 걸기 · 영입 · 한발 늦음 · 공격 / ❓ 망자 맵)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join('|'))); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 // 1. 입구
 const a1 = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[0][0]; const o={ e:[] }; o.third=nd.third; world=null; try { r8Enter(nd); } catch(e){ o.e.push(e.message+' '+(e.stack||'').split('\n')[1]); } const W=world; const G=W.units.filter(u=>u.r8guest==='sim'); o.g=G.map(u=>[u.name,u.side,!!u.summon,u.cg,+(u.hp/u.max).toFixed(2)]);
   const F=W.units.filter(u=>u.side===1&&u.alive); o.foes=F.length; o.near=G.map(g=>F.filter(f=>Math.hypot(f.x-g.x,f.y-g.y)<3.5).length); o.hunt=F.filter(f=>f.state==='hunt'&&f.target&&G.includes(f.target)).length;
   o.log=W.log.some(l=>/이미 싸움이 벌어지고/.test(l.s||'')); o.r8third=!!(W.r8&&W.r8.third); try { paused=true; draw(); for (let i=0;i<150;i++) stepWorld(W,1/30); draw(); } catch(e){ o.e.push('sim '+e.message); } o.alive=G.map(u=>u.alive); o.dmg=G.map(u=>Math.round(u.hp)); return o; });
 console.log('    ', JSON.stringify(a1).slice(0,500));
 ok(a1.third==='sim'&&a1.g.length===2&&a1.g.every(x=>x[1]===2&&x[2]&&x[3]==='sim')&&a1.g.map(x=>x[0]).sort().join()==='카밀라,헌팅나이프','유적 입구에 헌팅나이프 · 카밀라 (제3세력 2편 · 전우조 sim)');
 ok(a1.g.every(x=>x[4]<=0.85&&x[4]>0.5)&&a1.near.every(n=>n>=2)&&a1.hunt>=2&&a1.log&&a1.r8third&&!a1.e.length,'다쳐 있고 (70 · 80%) 암계 병사들에게 둘러싸임 ('+a1.near+') · 병사 '+a1.hunt+'이 노림 · 안내 줄');
 await p.waitForTimeout(2600); await p.evaluate(()=>{ if (TK) talkClose(); }); await p.waitForTimeout(200);
 await p.screenshot({path:'ui9060_a.png', clip:{x:10,y:60,width:820,height:700}});
 // 2. 둘 다 살아서 이긴 뒤 — 말 걸기 · 영입
 const a2 = await p.evaluate(()=>{ const W=world, R=R8S(); for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } for (const g of W.units.filter(u=>u.r8guest==='sim')){ g.alive=true; g.hp=Math.max(g.hp,60); }
   const node=r8Node(R.at); let thenCalled=0; const ret=r8AfterThird(W, node, ()=>{ thenCalled++; }); const o={ ret, lines:TK.lines.map(l=>l.t||l.narr||'').filter(Boolean), ask:(TK.lines.find(l=>l.ask)||{ask:[]}).ask.map(a=>a[0]) }; return o; });
 ok(a2.ret&&a2.lines.some(l=>/덕분에 살았구만/.test(l))&&a2.lines.some(l=>/대단하네 너희/.test(l))&&a2.ask.length===3,'싸움 뒤: "하핫! 덕분에 살았구만." · "대단하네 너희." · 선택 셋 ('+a2.ask.map(x=>x.slice(0,6)).join(' / ')+')');
 const a3 = await p.evaluate(()=>{ const R=R8S(), n0=R.party.length; let g=0; world.over=true; X8.simJoin(); while (TK && g++<40){ if (TK.timer) talkDone(); const l=TK.lines[TK.i]; if (l&&l.ask) break; if (l&&l.go){ talkDo(l.go); continue; } talkAdv(); } if (TK) talkClose(); const P=R.party.filter(q=>q.name==='헌팅나이프'||q.name==='카밀라'); return { n:R.party.length-n0, names:P.map(q=>q.name), cg:P.map(q=>q.cg), hp:P.map(q=>q.hpNow), gone:R.flags.simGone, ww:world&&world.units.filter(u=>u.side===0&&!u.summon&&(u.name==='헌팅나이프'||u.name==='카밀라')).length }; });
 console.log('    ', JSON.stringify(a3));
 ok(a3.n===2&&a3.names.length===2&&a3.cg.every(c=>c==='sim')&&a3.hp.every(h=>h>=1)&&a3.gone===1,'영입: 둘 다 파티에 (+'+a3.n+') · 전우조 sim · 체력 '+a3.hp);
 await p.evaluate(()=>{ world.over=false; });
 // 3. 한발 늦음 · 공격
 const a4 = await p.evaluate(()=>{ const R=R8S(); R.flags.simGone=0; const W=world; W.r8.third={keys:[]}; for (const g of W.units.filter(u=>u.r8guest==='sim')){ g.alive=false; } const node=r8Node(R.at); const ret=r8AfterThird(W,node,()=>{}); const o={ ret, line:TK.lines.map(l=>l.narr||'').join('|'), gone:R.flags.simGone }; talkClose(); return o; });
 ok(a4.ret&&/한발 늦었다/.test(a4.line)&&a4.gone===1,'둘 다 쓰러졌으면 "한발 늦었다" · 다시 안 나옴');
 const a5 = await p.evaluate(()=>{ const R=R8S(); R.flags.simGone=0; R.flags.simNow=[{name:'헌팅나이프',hp:100},{name:'카밀라',hp:100}]; const n=r8Node(R.at); const o={ e:[] }; world=null; try { X8.simFight(); let g=0; while (TK && g++<10){ const l=TK.lines[TK.i]; if (l&&l.go){ talkDo(l.go); break; } talkAdv(); } } catch(e){ o.e.push(e.message+' '+(e.stack||'').split('\n')[1]); } const W=world; o.names=W?W.units.filter(u=>u.side===1&&u.alive).map(u=>u.name).sort():null; o.cg=W?W.units.filter(u=>u.side===1&&u.alive).map(u=>u.cg||''):null; try { if (TK) talkClose(); for (let i=0;i<60;i++) stepWorld(W,1/30); } catch(e){ o.e.push('sim '+e.message); } return o; });
 console.log('    ', JSON.stringify(a5));
 ok(a5.names&&a5.names.join()==='카밀라,헌팅나이프'&&a5.cg[0]&&a5.cg[0]===a5.cg[1]&&!a5.e.length,'공격한다 → 둘이 적이 되어 싸움 (전우조 ' + (a5.cg||[]) + ')');
 // 4. 망자 맵
 await p.evaluate(()=>{ world=null; try { r8NodeDone(); } catch(e){} });
 const d1 = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[2][0]; const o={ e:[] }; nd.t='enc'; nd.enc='f:dead'; nd.restAsk=0; nd.src8=undefined; nd.comp=undefined; nd.empty=false; nd.npc8=undefined; world=null; try { r8Enter(nd); } catch(e){ o.e.push(e.message+' '+(e.stack||'').split('\n')[1]); } const W=world; o.t=nd.t; o.base=(MAPS8[S.art8]||{}).base; o.fall=!!(MAPS8[S.art8]||{}).fall; o.stairs=!!W.map.stairs; o.names=W?W.units.filter(u=>u.side===1&&u.alive).map(u=>u.name):[]; o.talk=nd.narr8||''; o.rest=!!(TK&&TK.lines.some(l=>l.ask&&l.ask.some(a=>/잠시 쉰다/.test(a[0])))); try { paused=true; draw(); for (let i=0;i<150;i++) stepWorld(W,1/30); draw(); } catch(e){ o.e.push('sim '+e.message); } return o; });
 console.log('    ', JSON.stringify(d1).slice(0,420));
 const DEAD=['일반 망자','사족 망자','근육 망자','뚱보 망자','기형 망자'];
 ok(d1.t==='fight'&&d1.names.length>=5&&d1.names.every(n=>DEAD.includes(n))&&!d1.e.length,'망자 맵: 망자만 '+d1.names.length+' ('+[...new Set(d1.names)].join(' · ')+') · 오류 없음');
 ok(!d1.fall&&!d1.stairs&&d1.base!=='gboss1'&&!d1.rest&&/썩은 냄새/.test(d1.talk||''),'낙사 · 계단 · 보스룸 맵이 아님 ('+d1.base+') · 쉬기 없음 · 안내 글');
 const d2 = await p.evaluate(()=>{ const R=R8S(); const c={}; for (let i=0;i<200;i++){ const o=COMP8.dead({}, { party:[1,2,3,4,5] }); for (const k of o) c[k]=(c[k]||0)+1; } return c; });
 console.log('    ', JSON.stringify(d2)); ok(d2['일반 망자']>d2['사족 망자']&&d2['사족 망자']>=d2['뚱보 망자']&&(d2['기형 망자']||0)<d2['뚱보 망자'],'비율: 일반 > 사족 · 근육 > 뚱보 > 기형 (아주 드묾)');
 await p.screenshot({path:'ui9060_dead.png', clip:{x:10,y:60,width:820,height:700}});
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
