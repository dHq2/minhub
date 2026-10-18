// v7.25.0 UI 시험 — ui7250.js v1.2 (v1.2: 겨눔 시험은 쟝의 머리 찍기 (간두는 v7.25.1부터 기술 대신 두 번째 총) · v1.1: PC 는 오른쪽 클릭 = 이동 · 왼쪽 클릭 = 고르기 풀기 (겨눔도 풀림) · 알현실: 아주 밝음 · 한눈에 다 보임 · 그림 오류 없음 / 관을 조사하면 10초 뒤 세자르 (9초엔 아직) / 영거리 사격 겨눔 중 바닥을 누르면 겨눔을 풀고 이동 (PC · 휴대폰) /
//   성장: 괴력 대신 근력 · 예전에 싸워서 얻은 괴력은 근력으로 옮김 (원래 괴력은 그대로) / 로그 글)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const fresh = async p => { await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900); };
 const camp5 = p => p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp, party=S.units.filter(u=>u.side===0); C.s=5; campBuild(5,'down',party); });
 const talkEnd = p => p.evaluate(()=>{ for (let k=0;k<30&&TK;k++){ if (TK.timer) talkDone(); talkAdv(); } });
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await fresh(p);
   await camp5(p); await p.waitForTimeout(700); await talkEnd(p);
   const h = await p.evaluate(()=>{ let err=null; try { draw(); } catch(e){ err=e.message; } return { hall:S.hall, amb:world.amb, exp:[...world.explored].every(v=>v===2), err, light:Math.min(...world.light) }; });
   console.log('    홀',JSON.stringify(h)); ok(h.hall&&h.amb===1&&h.exp&&!h.err&&h.light>=0.99,'알현실: 아주 밝음 (빛 1) · 한눈에 다 보임 · 빛줄기 그리기 오류 없음');
   await p.screenshot({path:'_s7250_hall.png'});
   // 관을 조사 → 10초
   const c = await p.evaluate(()=>{ const al=world.units.filter(u=>u.side===0&&u.alive); for (const u of al){ u.x=HALL.king.x+(u.i%3-1)*0.9; u.y=HALL.king.y+2.2+Math.floor(u.i/3)*0.8; } czOpenCoffin(); for (let k=0;k<30&&TK;k++){ if (TK.timer) talkDone(); talkAdv(); }
     mode='run'; paused=false; for (let i=0;i<30*9;i++){ stepWorld(world,1/30); czEvTick(world); for (const u of world.units) if (u.side===0){ u.x=HALL.king.x+(u.i%3-1)*0.9; u.y=HALL.king.y+2.2+Math.floor(u.i/3)*0.8; } }
     const at9 = world.units.some(u=>u.brain==='cesar'); for (let i=0;i<30*1.3;i++){ stepWorld(world,1/30); czEvTick(world); } for (let k=0;k<30&&TK;k++){ if (TK.timer) talkDone(); talkAdv(); } paused=true; mode='plan';
     return { at9, rise: world.log.some(l=>l.k==='czRise'), st: S.camp.stages[5].cz.st, hint: !!S.camp.stages[5].cz.hint }; });
   console.log('    관',JSON.stringify(c)); ok(!c.at9&&c.rise&&c.st==='fight'&&c.hint,'관을 조사하면 9초엔 아직 · 10초 뒤 세자르가 일어남 (6초에 긁는 소리)');
   ok(!errs.length,'오류 없음 '+errs.slice(0,2).join(' | ')); }
 // 영거리 사격 겨눔 → 바닥 (PC 클릭 · 휴대폰 탭)
 for (const vw of [{width:1280,height:860,nm:'PC'},{width:412,height:880,nm:'휴대폰',mob:true}]){
   const p=await (await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await fresh(p);
   await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); const g=fromDesign(designByKey('쟝'),0); g.x=10.5; g.y=15.5; S.units.push(g); S.draft.done=true; rebuildMap(); changed(); start(); paused=true; });
   const r = await p.evaluate(mob=>{ const g=world.units.find(u=>u.name==='쟝'); sel=new Set([g.i]); hud(); const L=slotOrder(world,[g]); const s=L.find(o=>o.s&&o.s.nm==='머리 찍기'); if (!s) return { no: L.map(o=>o.s&&o.s.nm) }; useSlot(s.n);
     const arm=!!(armed&&armed.k==='spec'&&armed.s==='head'); const w={x:g.x+0.5,y:g.y-2.5}; let left=null; if (mob) touchTap(w); else { playClick(w,false); left={ armed: !!armed, sel: sel.size }; sel=new Set([g.i]); useSlot(s.n); rightClick(w,false); } const o=g.order||(g.ordPend&&g.ordPend.o);
     return { arm, left, after: armed, o: o&&o.k, toast: document.getElementById('toast').textContent }; }, !!vw.mob);
   console.log('    '+vw.nm,JSON.stringify(r)); ok(r.arm&&!r.after&&r.o==='move'&&/겨눔을 풀었어요/.test(r.toast)&&(!r.left||(!r.left.armed&&r.left.sel===0)),vw.nm+': 머리 찍기를 겨눈 채 바닥을 누르면 겨눔을 풀고 누른 대로 (PC 왼쪽 = 고르기 풀기 · 오른쪽 · 탭 = 이동) — 입력이 막히지 않음');
   ok(!errs.length,vw.nm+' 오류 없음 '+errs.slice(0,2).join(' | ')); }
 // 성장 · 옮김 · 로그
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await fresh(p);
   const g = await p.evaluate(()=>{ const q={ ...fromDesign(designByKey('레베카'),0) }; q.traits=(q.traits||[]).filter(t=>!/^(근력|괴력)/.test(t)); const out=growFor(q,{ hits:0, dodges:0, moved:0, meleeDealt:900, taken:0 }); return { out, tr:q.traits.filter(t=>/^(근력|괴력)/.test(t)) }; });
   console.log('    성장',JSON.stringify(g)); ok(g.out.some(x=>/^근력/.test(x))&&g.tr.includes('근력C')&&!g.tr.some(t=>/^괴력/.test(t)),'근접으로 많이 싸우면 근력이 자람 (괴력은 자라지 않음)');
   const m = await p.evaluate(()=>{ const a={ ...fromDesign(designByKey('레베카'),0), traits:['불사','괴력C'], grown:['괴력 없음 → C'] }, j={ ...fromDesign(designByKey('쟝'),0) }; j.grown=['괴력 없음 → C']; const j0=j.traits.slice(); const ra=fix7250(a), rj=fix7250(j); return { ra, at:a.traits, ag:a.grown, rj, jt:j.traits, j0 }; });
   console.log('    옮김',JSON.stringify(m)); ok(m.ra&&m.at.includes('근력C')&&!m.at.includes('괴력C')&&/^근력/.test(m.ag[0])&&!m.rj&&JSON.stringify(m.jt)===JSON.stringify(m.j0),'예전에 싸워서 얻은 괴력 → 근력 (쟝처럼 원래 괴력은 그대로)');
   const t = await p.evaluate(()=>traitDesc('괴력C')); ok(/아무나 얻지 못함/.test(t),'괴력 설명: 아무나 얻지 못함 · 싸워서 자라지 않음');
   const lg = await p.evaluate(()=>{ const W={ units:[{name:'모닝스타',side:0},{name:'세자르',side:1}], log:[{k:'flailDrop',a:0,s:'sweep',why:'넘어짐',t:1},{k:'flailReel',a:0,t:2},{k:'bossFatal',a:0,b:1,how:'brain',dmg:60,t:3},{k:'pb',a:0,b:1,left:9,miss:true,t:4}], t:5 }; try { return logLines(W).join(' / '); } catch(e){ return 'ERR '+e.message; } });
   console.log('    로그',lg.slice(0,300)); ok(/철퇴를 놓침/.test(lg)&&/감아 들임/.test(lg)&&/버팀/.test(lg)&&/비켜 섬/.test(lg),'로그: 철퇴 놓침 · 감아 들임 · 치명상을 버팀 · 영거리를 비켜 섬');
   ok(!errs.length,'오류 없음 '+errs.slice(0,2).join(' | ')); }
 await b.close(); console.log(fails?`${fails} FAIL`:'ALL UI7250 OK'); })();
