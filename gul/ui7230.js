// v7.23.0 UI 시험 — ui7230.js v1.1 (v1.1: 5S 는 v7.23.1 부터 세자르의 알현실 · 4S 유적: 실내 맵 · 구역 빛 · 곤봉적 + 방 지킴이 넷 · 알현실 문 · 지금 보이는 곳 · 들어가 싸우면 지킴이가 터짐 · 다시 오면 지킴이는 풀린 채 · 그만두면 실내 꺼짐 · 5S 는 기사 셋)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ showTab('place'); renderFloors(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); });
 const a = await p.evaluate(()=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.s=4; campBuild(4,'down',party); while(TK){ if (TK.timer) talkDone(); talkAdv(); }
   const m=world.map, F=world.units.filter(u=>u.side===1), row0=[...Array(m.W).keys()].filter(x=>m.t[x]===0);
   return { S: S.W+'x'+S.H, indoor: !!m.indoor, zones: (m.zones||[]).map(z=>z.amb), sun: world.light[34*m.W+3].toFixed(2), dim: world.light[5*m.W+3].toFixed(2), foes: F.map(u=>u.name+(u.warden&&u.warden.on?'*':'')), hidden: F.filter(u=>u.warden).every(u=>!u.seenBy), row0, vis: !!world.visNow, al: world.units.filter(u=>u.side===0).every(u=>u.y>32) }; });
 console.log('    4S', JSON.stringify(a));
 ok(a.S==='30x36'&&a.indoor&&a.zones.join()==='0.45,0.04','4S — 30 × 36 실내 · 구역 빛 (사막 0.45 · 안 0.04)');
 ok(+a.sun>=0.45&&+a.dim<0.12,'사막 끝은 밝고 안은 어둑함 ('+a.sun+' · '+a.dim+')');
 ok(a.foes.length===5&&a.foes[0]==='곤봉적'&&a.foes.filter(f=>f.endsWith('*')).length===4,'입구의 곤봉적 + 방 지킴이 넷');
 ok(a.hidden,'지킴이는 처음에 안 보임');
 ok(a.row0.join()==='14,15','위 끝은 알현실 문 (2칸) 만 뚫림');
 ok(a.vis&&a.al,'지금 보이는 곳 · 아군은 아래 (사막 끝) 에서 시작');
 // 그림: 벽 너머 방은 그려지지 않음 (밝아도)
 const d = await p.evaluate(()=>{ const h=world.units.find(u=>u.hero&&u.alive); h.x=14.5; h.y=12.5; computeLight(world); markExplored(world); const r=S.camp.stages[4].ruin.rooms[0], i=Math.floor((r.y0+r.y1)/2)*S.W+Math.floor((r.x0+r.x1)/2); return { room: world.visNow[i], cor: world.visNow[12*S.W+14] }; });
 ok(d.room===0&&d.cor===1,'복도에서 — 복도는 보이고 벽 너머 방 가운데는 안 보임');
 // 들어가 싸움: 아군을 방 앞에 두고 판을 돌림 → 지킴이가 터짐
 const f = await p.evaluate(async()=>{ const w=world.units.find(u=>u.side===1&&u.warden), r=S.camp.stages[4].ruin.rooms.find(q=>q.id===w.warden.room); for (const u of world.units.filter(u=>u.side===0&&u.alive)){ u.x=w.x+(Math.random()-0.5)*1.5; u.y=w.y+(Math.random()<0.5?2.2:-2.2); }
   const L0=world.log.length; mode='run'; paused=false; for (let k=0;k<240&&!world.over;k++) stepWorld(world,1/30); paused=true; mode='plan'; const L=world.log.slice(L0).filter(l=>l.k==='wardenOut'); return { n: L.length, why: L.map(l=>l.why+':'+l.room), on: world.units.filter(u=>u.side===1&&u.warden&&u.warden.on).length }; });
 console.log('    싸움', JSON.stringify(f)); ok(f.n>=1&&f.on<=3,'방에 들어서면 지킴이가 터짐 ('+f.why.join(' ')+')');
 await p.waitForTimeout(300); ok(await p.evaluate(()=>{ try { draw(); return true; } catch(e){ return e.message; } })===true,'그리기 오류 없음');
 // 다시 오면: 지킴이는 풀린 채
 const r2 = await p.evaluate(()=>{ for (const u of world.units.filter(u=>u.side===0&&u.alive)) leaveMap(world,u,'down'); checkEnd(world); mode='plan'; onOver(); const nb=document.getElementById('campNext'); if (nb) nb.click(); while(TK){ if (TK.timer) talkDone(); talkAdv(); }
   const s3=S.camp.s, party=S.units.filter(u=>u.side===0); S.camp.s=4; campBuild(4,'down',party); return { s3, again: world.units.filter(u=>u.side===1&&u.alive).map(u=>u.name+(u.warden?'*':'')), indoor: !!world.map.indoor }; });
 console.log('    다시', JSON.stringify(r2)); ok(r2.s3===3&&r2.again.length>=1&&r2.again.every(n=>!n.endsWith('*'))&&r2.indoor,'3S 로 갔다 다시 오면 — 남은 적 그대로 · 지킴이는 풀린 채');
 // 5S · 그만두기
 const r5 = await p.evaluate(()=>{ const party=S.units.filter(u=>u.side===0); S.camp.s=5; campBuild(5,'down',party); const o={ foes: world.units.filter(u=>u.side===1).map(u=>u.name).sort().join(','), indoor: !!world.map.indoor }; campQuit(); o.after=!!S.indoor; o.zones=(S.zones||[]).length; return o; });
 console.log('    5S', JSON.stringify(r5)); ok(r5.foes===''&&r5.indoor,'5S — 세자르의 알현실 (관 속의 왕 · 처음엔 적 없음 · 곤봉적은 4S 로)');
 ok(!r5.after&&r5.zones===0,'그만두면 실내 · 구역 빛이 꺼짐');
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?`${fails} FAIL`:'ALL UI7230 OK'); await b.close(); })();
