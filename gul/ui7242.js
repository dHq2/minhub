// v7.24.2 UI 시험 — ui7242.js v1.1 (v1.1: 이전 시험은 옛 저장처럼 근력 칸을 모르는 상태로 · 근력 · 괴력: 설계 (쟝 괴력C · 카리우스 근력A 괴력A …) · 특성 설명 · 등급 표 · 근력 아이콘 · 저장된 것 한 번 옮김 (괴력만 → 근력 더함 · 쟝에 괴력C · 공격 그대로) · 수치표 이전 (괴력 표) · 로그 · 상세 칸 · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   const d = await p.evaluate(()=>{ const D=k=>designList().find(x=>x.key===k); return { jean: D('쟝').traits, kar: D('카리우스').traits, ms: D('모닝스타').traits, hora: D('호레이쇼').traits, yel: D('옐로').traits, dStr: traitDesc('근력A'), dMight: traitDesc('괴력C'), grade: GRADE_KEYS.includes('근력'), ico: ICO.map['근력'], gr: rules.grades['근력'], gm: rules.grades['괴력'] }; });
   console.log('    설계', JSON.stringify({jean:d.jean, kar:d.kar})); ok(d.jean.includes('괴력C')&&!d.jean.some(t=>/^근력/.test(t)),'쟝 — [괴력C] (근력 없음)'); ok(d.kar.includes('근력A')&&d.kar.includes('괴력A')&&d.ms.includes('근력A')&&d.hora.includes('근력S')&&d.yel.includes('근력B'),'괴력을 가졌던 인물은 같은 등급 [근력] 을 더함 (카리우스 · 모닝스타 · 호레이쇼 · 옐로)');
   console.log('    설명', d.dStr.slice(0,60), '/', d.dMight.slice(0,80)); ok(/타고난 힘/.test(d.dStr)&&/1\.45/.test(d.dStr)&&/깨우친 힘/.test(d.dMight)&&/1\.2/.test(d.dMight)&&/공격 배율은 아님/.test(d.dMight),'특성 설명 — 근력 = 타고난 힘 (공격 ×) · 괴력 = 결정적인 순간 (공격 배율 아님)');
   ok(d.grade&&d.ico===43&&d.gr.A===1.45&&d.gm.C===1.2&&d.gm.S===2,'등급 표 · 근력 아이콘 (중압 견디기) · 수치 (근력 A 1.45 · 괴력 C 1.2 · S 2.0)');
   // 판: 쟝 · 카리우스 · 로그 · 상세 칸
   const w = await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); for (const [k,x,y] of [['쟝',10.5,15.5],['카리우스',12.5,15.5]]){ const u=fromDesign(designByKey(k),0); u.x=x; u.y=y; S.units.push(u); } rebuildMap(); changed(); start(); paused=true;
     const j=world.units.find(u=>u.name==='쟝'), k=world.units.find(u=>u.name==='카리우스'); world.log.push({k:'might',a:j.i,b:k.i,how:'grip',m:1.2,t:world.t}); const L=logLines(world).slice(-1)[0]; const N=narrOf(world,world.log[world.log.length-1]);
     const dv=document.createElement('div'); dv.innerHTML=unitDetailHtml(world,j); return { jm: j.might, js: j.strMul, ka: k.atk, km: k.might, ks: k.strMul, L, N: N&&N.s, det: (dv.innerText.match(/괴력[^\n]{0,40}/)||[''])[0] }; });
   console.log('    판', JSON.stringify(w)); ok(w.jm===1.2&&w.js===1&&w.km===1.7&&w.ks===1.45,'판의 쟝 (괴력 ×1.2 · 근력 배율 1) · 카리우스 (괴력 ×1.7 · 근력 1.45)');
   ok(/괴력 ×1\.2 — 잡힌 무기를 뿌리침/.test(w.L)&&/뿌리친다/.test(w.N||''),'로그 · 나레이션 — "괴력 ×1.2 — 잡힌 무기를 뿌리침"'); ok(/순간 ×1\.2/.test(w.det)&&/준비됨/.test(w.det),'상세 칸 — 괴력 순간 ×1.2 · 준비됨');
   ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3))); }
 // 저장된 것 한 번 옮김 · 수치표 이전
 { const p=await (await b.newContext()).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
   const a0 = await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); const k=fromDesign(designByKey('카리우스'),0); k.x=12.5; k.y=15.5; k.traits=k.traits.filter(t=>t!=='근력A'); S.units.push(k);
     const j=fromDesign(designByKey('쟝'),0); j.x=10.5; j.y=15.5; j.traits=j.traits.filter(t=>t!=='괴력C'); S.units.push(j); const c={...fromDesign(designByKey('모닝스타'),0),x:14.5,y:15.5}; c.traits=['괴력A','회피C']; S.units.push(c);
     delete S.v7242m; S.rulesMig='7.21.0'; S.rulesKeys=(S.rulesKeys||[]).filter(k=>!/근력/.test(k)); S.rules.grades['괴력']={S:1.6,A:1.45,B:1.3,C:1.15}; delete S.rules.grades['근력']; save(); return true; });
   await p.reload(); await p.waitForTimeout(1200);
   const m = await p.evaluate(()=>{ const f=k=>S.units.find(u=>u.name===k); start(); paused=true; const K=world.units.find(u=>u.name==='카리우스'); return { kar: f('카리우스').traits, jean: f('쟝').traits, ms: f('모닝스타').traits, gm: rules.grades['괴력'], gr: rules.grades['근력'], katk: K.atk, flag: S.v7242m }; });
   console.log('    옮김', JSON.stringify(m)); ok(m.kar.includes('근력A')&&m.ms.join(',').startsWith('근력A,괴력A'),'괴력만 있던 저장된 인물 → 같은 등급 근력을 앞에 더함');
   ok(m.jean.includes('괴력C'),'저장된 쟝 → [괴력C]'); ok(m.gm.S===2&&m.gm.C===1.2&&m.gr&&m.gr.A===1.45,'수치표 이전: 옛 괴력 표 → 새 괴력 표 · 근력 표 채움'); ok(m.flag===true,'한 번만 (표시)');
   ok(errs.length===0,'오류 없음 (옮김) '+JSON.stringify(errs.slice(0,3))); }
 // 휴대폰: 특성 탭 (등급 표에 근력)
 { const ctx=await b.newContext({viewport:{width:412,height:880},isMobile:true,hasTouch:true,deviceScaleFactor:2}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   const t = await p.evaluate(()=>{ showTab('traits'); const tb=document.getElementById('gradeTbl'); return { row: !!tb && /근력/.test(tb.innerText), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }; });
   ok(t.row&&t.sw<=t.cw+1,'휴대폰 특성 탭 — 등급 표에 근력 · 넘치지 않음'); ok(errs.length===0,'오류 없음 (휴대폰) '+JSON.stringify(errs.slice(0,3))); await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7242 OK'); await b.close(); })();
