// v7.27.0 UI 시험 — ui7270c.js v1.2 (v1.2: 이전 판 번호는 지금 판의 RULES_MIG (v7.29.0 에서 올라감) · v1.1: 수치표 이전은 예전 저장처럼 — 알던 칸 목록에도 잔해가 없음 · v1.0: 세자르의 알현실 (5S) 도감 그림: 맵 28 × 28 · 벽 · 옥좌 · 서 있는 기둥 = 바위 (시야도 막음) · 쓰러진 기둥 · 돌무더기 = 잔해 (더미 4 — 못 지나감 · 너머로 보임 · 1.0M) /
//   관은 옥좌 앞 (13 ~ 14, 12) · 들어서면 아래쪽 바닥에 섬 · 옥좌 뒤까지 걸어서 감 · 걷는 동안 막힌 칸에 들어가지 않음 / 관을 열고 → 세자르가 일어남 → 15초 싸움에 막힌 칸에 들어가지 않음 → 쓰러지면 계단 · 잔해는 남음 /
//   그림이 열림 · 그리기 오류 없음 · 엄폐 곁 글 · 수치표 이전 (잔해 높이) · 인카운터 탭 글 · PC · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const SKIP = "(()=>{ for (let k=0;k<40&&TK;k++){ if (TK.timer) talkDone(); talkAdv(); } })()";
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ showTab('place'); renderFloors(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); });
 await p.evaluate(SKIP);
 // 5S 에 들어섬
 const a = await p.evaluate(()=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.s=5; campBuild(5,'down',party); while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   const m=world.map, T=(x,y)=>m.t[y*m.W+x], K=(x,y)=>m.pk?m.pk[y*m.W+x]:0, al=world.units.filter(u=>u.side===0&&u.alive);
   let open=0, rub=0, rk=0; for (let y=0;y<m.H;y++) for (let x=0;x<m.W;x++){ const t=T(x,y); if (t===0) open++; else if (t===2&&K(x,y)===4) rub++; else if (t===1) rk++; }
   return { hall: S.hall, W: m.W, H: m.H, open, rub, rk, throne: T(14,8), wall: T(1,13), floor: T(14,20), rubble: [T(3,10),K(3,10)], coffin: [T(13,12),K(13,12),T(14,12),K(14,12)],
     place: al.map(u=>[+u.x.toFixed(1),+u.y.toFixed(1),T(u.x|0,u.y|0),CZ_MAP[u.y|0][u.x|0]]), map0: CZ_MAP.join('').length };
 });
 console.log('    5S ('+vw.nm+')', JSON.stringify({ ...a, place: a.place.slice(0,4) }));
 ok(a.hall&&a.W===28&&a.H===28&&a.map0===28*28,'5S = 알현실 28 × 28 (칸 지도 28줄)');
 ok(a.throne===1&&a.wall===1&&a.floor===0,'옥좌 · 벽 = 막힘 · 가운데 바닥 = 열림');
 ok(a.rubble[0]===2&&a.rubble[1]===4&&a.rub>=20,'쓰러진 기둥 = 잔해 (더미 4) — '+a.rub+'칸');
 ok(a.coffin.join()==='2,3,2,3','관은 옥좌 앞 (13 ~ 14, 12)');
 ok(a.place.length>=3&&a.place.every(q=>q[2]===0&&q[3]==='.'&&q[1]>=21),'들어서면 모두 아래쪽 바닥에 섬 ('+a.place.length+'명)');
 // 시야 · 엄폐: 잔해는 너머로 보임 (낮음) · 옥좌는 막음
 const v = await p.evaluate(()=>{ const m=world.map; return { rubSolid: solid(m,3.5,10.5), rubRock: rock(m,3.5,10.5), thrSolid: solid(m,14.5,8.5), h: pileH(world,4), nm: PILE_NM[4], rule: DEFAULT_RULES.terrain.pileH['잔해'] }; });
 ok(!v.rubSolid&&v.rubRock&&v.thrSolid&&v.h===1&&v.nm==='잔해'&&v.rule===1,'잔해: 못 지나감 · 시야 · 탄은 높이로 (1.0M) — 옥좌는 시야를 막음 '+JSON.stringify(v));
 const cv = await p.evaluate(()=>{ const u=world.units.find(q=>q.side===0&&q.alive); const ox=u.x, oy=u.y; u.x=6.5; u.y=10.5; const L=terrFx(world,u); u.x=ox; u.y=oy; return L; });
 ok(cv.some(x=>/쓰러진 기둥 1\.0M/.test(x)),'잔해 곁에 서면 "엄폐 곁 (쓰러진 기둥 1.0M)" '+JSON.stringify(cv));
 // 옥좌 뒤까지 걸어감 — 걷는 동안 막힌 칸에 들어가지 않음
 const w = await p.evaluate(()=>{ const m=world.map, h=world.units.find(u=>u.hero)||world.units.find(u=>u.side===0&&u.alive); h.order={k:'move',x:12.5,y:6.5}; h.ordLive=h.order; mode='run'; paused=false; let bad=0, k=0, arr=false;
   for (;k<30*40;k++){ stepWorld(world,1/30); for (const u of world.units) if (u.alive && m.t[(u.y|0)*m.W+(u.x|0)]!==0) bad++; if (Math.hypot(h.x-12.5,h.y-6.5)<1.3){ arr=true; break; } } paused=true; mode='plan'; return { arr, t: +(k/30).toFixed(1), bad, at: [+h.x.toFixed(1),+h.y.toFixed(1)] }; });
 console.log('    옥좌 뒤', JSON.stringify(w)); ok(w.arr&&w.bad===0,'옥좌 뒤까지 걸어감 ('+w.t+'초) · 막힌 칸에 들어간 적 없음');
 // 그림 · 그리기
 await p.waitForFunction(()=>{ const i=czImg(); return i.complete&&i.naturalWidth>0; }, null, {timeout:8000}).catch(()=>{});
 const d = await p.evaluate(()=>{ const i=czImg(); let err=null; try { draw(); } catch(e){ err=e.message; } return { w: i.naturalWidth, h: i.naturalHeight, err }; });
 ok(d.w===2066&&d.h===2048&&!d.err,'그림이 열림 ('+d.w+' × '+d.h+') · 그리기 오류 없음');
 await p.evaluate(()=>{ const al=world.units.filter(u=>u.side===0&&u.alive); al.forEach((u,i)=>{ u.x=11.5+(i%5); u.y=15.5+Math.floor(i/5); }); cam.x=14; cam.y=14; cam.z=vwZ(); draw(); }).catch(async()=>{ await p.evaluate(()=>{ cam.x=14; cam.y=14; draw(); }); });
 await p.waitForTimeout(200); await p.screenshot({path:`_s7270c_${vw.nm}.png`});
 // 관을 열고 → 세자르 → 15초 싸움 → 쓰러짐
 const f = await p.evaluate(()=>{ const C=S.camp, E=C.stages[5].cz, m=world.map, al=world.units.filter(u=>u.side===0&&u.alive);
   al.forEach((u,i)=>{ u.x=12.5+(i%4); u.y=14.5+Math.floor(i/4); }); czOpenCoffin(); const st0=E.st; while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   czRise(world,E); while (TK){ if (TK.timer) talkDone(); talkAdv(); } const k=world.units.find(u=>u.brain==='cesar'); const k0=[+k.x.toFixed(1),+k.y.toFixed(1),m.t[(k.y|0)*m.W+(k.x|0)]];
   for (const u of world.units.filter(u=>u.side===0&&u.alive)) u.max=u.hp=4000;
   mode='run'; paused=false; let bad=0, err=null; for (let i=0;i<450&&!world.over&&k.alive;i++){ stepWorld(world,1/30); czEvTick(world); czCutTick(world); while (TK){ if (TK.timer) talkDone(); talkAdv(); } for (const u of world.units) if (u.alive && !u.air && m.t[(u.y|0)*m.W+(u.x|0)]!==0) bad++; if (i%15===0){ try { draw(); } catch(e){ err=e.message; break; } } }
   const h=world.units.find(u=>u.side===0&&u.alive); applyDmg(world,h,k,99999,{}); for (let i=0;i<3;i++){ stepWorld(world,1/30); czEvTick(world); } paused=true; mode='plan'; while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   return { st0, k0, step: k.cz ? k.cz.nStep : null, bad, err, st: E.st, stairs: world.stairs, rub: [m.t[10*m.W+3], m.pk[10*m.W+3]], cof: [m.t[12*m.W+13], m.t[12*m.W+14]], piles: S.piles.filter(x=>/,4$/.test(x)).length, piles3: S.piles.filter(x=>/,3$/.test(x)).length }; });
 console.log('    세자르', JSON.stringify(f));
 ok(f.st0==='open','관을 엶 (옥좌 앞)'); ok(f.k0[2]===0,'세자르가 바닥 칸에서 일어남 '+JSON.stringify(f.k0));
 ok(f.bad===0&&!f.err,'15초 싸움 — 누구도 막힌 칸에 들어가지 않음 · 그리기 오류 없음 (스텝 '+f.step+'번)');
 ok(f.st==='stairs'&&f.stairs&&Math.abs(f.stairs.x-14)<0.01&&Math.abs(f.stairs.y-12.5)<0.01&&f.cof.join()==='0,0','쓰러지면 관 자리에 계단 (관 칸은 열림)');
 ok(f.rub.join()==='2,4'&&f.piles>=20&&f.piles3===0,'잔해는 그대로 남음 ('+f.piles+'칸) · 관은 사라짐');
 await p.evaluate(()=>{ cam.x=14; cam.y=13; draw(); }); await p.waitForTimeout(150); await p.screenshot({path:`_s7270c_${vw.nm}_end.png`});
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3))); await ctx.close(); }
 // 인카운터 탭 글 · 수치표 이전 (예전 저장에 잔해 칸이 없으면 채움)
 { const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   const t = await p.evaluate(()=>{ setMode('train'); document.querySelector('.tab[data-tab="enc"]').click(); const tx=document.getElementById('pane-enc').innerText; return { what: /거미줄 앉은 빈 옥좌 앞에 관 하나/.test(tx), map: /잔해/.test(tx)&&/서 있는 부러진 기둥은 막힘/.test(tx) }; });
   ok(t.what&&t.map,'인카운터 탭: 알현실 글 (빈 옥좌 앞의 관 · 잔해)');
   await p.evaluate(()=>{ const s=JSON.parse(localStorage.getItem(LS)); delete s.rules.terrain.pileH['잔해']; s.rulesKeys=(s.rulesKeys||[]).filter(k=>!/잔해/.test(k)); s.rulesMig='7.26.1'; localStorage.setItem(LS, JSON.stringify(s)); }); await p.reload(); await p.waitForTimeout(1800);
   const r = await p.evaluate(()=>({ h: S.rules.terrain.pileH['잔해'], mig: S.rulesMig, cur: RULES_MIG }));
   ok(r.h===1&&r.mig===r.cur,'수치표 이전 (지금 판 '+r.cur+') — 예전 저장에 잔해 높이 칸을 채움 '+JSON.stringify(r));
   ok(errs.length===0,'오류 없음 (탭 · 이전) '+JSON.stringify(errs.slice(0,3))); await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7270C OK'); await b.close(); })();
