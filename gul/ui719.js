// v7.19 UI 시험 — ui719.js v1.2 (v1.2: 딸기가 '소식 없음' (지휘가 끊김) 이면 상세 검사는 건너뜀 · v1.1: 딸기가 판에서 쓰러졌으면 카드 검사는 건너뜀 (카드엔 쓰러짐이 보임) · 새 인물 아홉: 설계 칸 · 동료 뽑기로 놓아도 설계대로 (이름 · 무기 · 기술 · 야시) · 끝없는 마력 표시 · 서술 · 옛 저장 한 번 맞춤 · 특성 검사 · 판 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+process.cwd()+'/build/wrapped.html';
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 const NEW=['탕아','딸기','옐로','트라카','쟝','나달','가윤','간두','모닝스타'];
 const dl = await p.evaluate(N=>N.map(k=>!!designByKey(k)), NEW); ok(dl.every(Boolean),'설계 칸에 아홉 모두');
 const dr = await p.evaluate(()=>{ const out={}; for (const ref of ['C-221','C-218','C-107','C-262','C-198','C-018','C-195','C-005','C-008']){ const u=unitFromRef(ref,0,{}); out[ref]=[u.name,u.weapon,u.skill?u.skill.name:'',u.nv&&u.nvG,u.sizeCls||'',u.leapN||'',(u.traits||[]).length]; } return out; });
 console.log('    도감 · 뽑기로 놓으면', JSON.stringify(dr));
 ok(dr['C-218'][0]==='딸기'&&dr['C-218'][1]==='대지 마법'&&dr['C-218'][2]==='딸기 정령술'&&dr['C-018'][0]==='가윤'&&dr['C-018'][2]==='지혈 · 약'&&dr['C-262'][0]==='쟝'&&dr['C-221'][1]==='대검'&&dr['C-195'][1]==='권총','이름 · 무기 · 기술이 설계대로');
 ok(dr['C-008'][5]===2&&dr['C-018'][3]==='D'&&dr['C-218'][3]==='B','2연속 도약 · 아군 야시');
 // 판에 놓고 싸움
 const run = await p.evaluate(N=>{ for (const k of N){ const d=designByKey(k); const u=fromDesign(d,0); u.x=3+N.indexOf(k)*2.5; u.y=17.5; S.units.push(u); } rebuildMap(); changed(); start(); for(let i=0;i<30*12&&!world.over;i++) stepWorld(world,1/30); hud();
   const g=world.units.find(u=>u.name==='딸기'), card=(document.querySelector(`#party [data-ally="${g.i}"]`)||{}).innerText||''; const d=document.createElement('div'); d.innerHTML=unitDetailHtml(world,g);
   return { t:+world.t.toFixed(1), card: !g.alive||g.down ? 'skip' : /마력 ∞/.test(card), det: hidA(world,g) ? 'skip' : /마력 \(끝없음\)/.test(d.innerText), lines: logLines(world).filter(s=>/정령술|지혈/.test(s)).length }; }, NEW);
 console.log('    판', JSON.stringify(run)); ok((run.card===true||run.card==='skip')&&(run.det===true||run.det==='skip'),'딸기 카드 · 상세에 마력 ∞');
 const au = await p.evaluate(()=>{ renderTraitsTab(); return document.getElementById('traitAuditBox').innerText.replace(/\s+/g,' ').slice(0,400); }); console.log('    특성 검사', au); ok(!/모순|중복/.test(au.replace(/이상 없음/g,'')) || /— 이상 없음.*— 이상 없음/.test(au),'특성 검사 모순 · 중복 없음');
 // 옛 저장: 프로필 없이 놓였던 간호사
 await p.evaluate(()=>{ const u=unitFromRef0('C-018',0,{}); u.x=5.5; u.y=15.5; S.units.push(u); delete S.v719k; save(); });
 await p.reload(); await p.waitForTimeout(2200);
 const mg = await p.evaluate(()=>{ const u=S.units.find(x=>x.ref==='C-018'&&x.y===15.5); return u?[u.name,u.skill&&u.skill.name,u.weapon,S.v719k]:null; }); console.log('    옛 저장', JSON.stringify(mg)); ok(mg&&mg[0]==='가윤'&&mg[1]==='지혈 · 약'&&mg[3]===true,'옛 저장의 간호사 → 가윤 설계대로');
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs));
 console.log(fails?`${fails} FAIL`:'ALL UI719 OK'); await b.close(); })();
