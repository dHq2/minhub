// v8.7.8 UI 시험 (2) — ui8780b.js v1.1 (v1.1: 아이콘 판은 인물이 늘면 아래로 자람 — 8 줄 이상 · 384 × (줄 × 48) 이면 됨 (어퐁 · 카리우스에서 8 × 10 이 됨) · v1.0: 포렌 — 설계 · 도감 정체성 · 글 · 아이콘 판 64칸 · 판의 쥐 (S.units 와 순서가 맞음) · 쥐는 고르기 · 명단 · 모두 고르기에서 빠짐 · 쥐를 탭 (고른 이 없음 → 알림 / 있음 → 그 자리로) ·
//   기술 칸 1 쥐 표식 (적을 탭) · 2 쥐 방진 (바로) · 기록 · 서술 (쥐 떼의 자잘한 일은 조용히) · 그림 (표식 고리 · 망토 · 방진 · 쥐 방패 · 포박 · 기사 이름) · 상세 줄 · 동작 이름 · 처음으로 · 불러오기 · 기억하는 기사 (다음 판) · 적 포렌 · 자동 한 판)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const dir = process.argv[2]||'build', url='file://'+process.cwd()+'/'+dir+'/wrapped.html';
 const TALKEND = "{ let g=0; while (TK && g++<200){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); } }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1200);
 const SK = ['쥐 표식','쥐 방진','쥐 방패','쥐 사다리','쥐 포박'];
 // 0) 설계 · 정체성 · 글 · 그림 칸 · 희귀도
 const v0 = await p.evaluate((SK)=>{ const d=designByKey('포렌'), id=identityOf('C-006')||{}, P=PROFILE['C-006']||{}, U=UNIQUE['쥐들의 왕']||{}, tr=['지휘S','군주','높은후각','반사신경'];
   const pool=DESIGN_DEFAULTS.filter(x=>x.side===0&&!CAMP_FIX.includes(x.key)&&!CAMP_NO.includes(x.key)).map(x=>x.key);
   return { d: d && { ref: d.ref, w: d.weapon, sh: d.shield, u: (d.unique||[]).join(','), a: (d.active||[]).join(','), hp: d.ov&&d.ov.hp, atk: d.ov&&d.ov.atk, tr: tr.every(t=>(d.traits||[]).includes(t)), g: d.gear&&d.gear['몸']&&d.gear['몸'].name, h: d.height },
     prof: { u: (P.unique||[]).join(','), a: (P.active||[]).join(','), w: P.weapon, tr: tr.every(t=>(P.traits||[]).includes(t)) }, id: { u: (id.unique||[]).join(','), a: (id.active||[]).join(','), tr: tr.every(t=>(id.traits||[]).includes(t)) },
     noAct: [...SK,'구르기'].filter(k=>!ACTIVE[k]), noIco: [...SK,'쥐들의 왕','구르기','군주'].filter(k=>ICO.map[k]==null), ico: [ICO.map['쥐들의 왕'],ICO.map['쥐 표식'],ICO.map['쥐 포박'],ICO.map['구르기']].join(','), rows: ICO.rows, img: [icoImg.naturalWidth, icoImg.naturalHeight].join('x'),
     uq: { who: U.who, lore: (U.lore||[]).length, eff: (U.effects||[]).length }, tgt: !!SPEC_TGT.pmark, ic: [SPEC_IC.pmark, SPEC_IC.pfort, SPEC_IC.knee, SPEC_IC.gslam].join(''), gunju: /포렌/.test(TRAITS['군주']||''),
     rar: RAR_W(d), camp: pool.includes('포렌') }; }, SK);
 console.log('    ', JSON.stringify(v0));
 ok(v0.d&&v0.d.ref==='C-006'&&v0.d.w==='포렌의 대검'&&v0.d.sh===false&&v0.d.u==='쥐들의 왕'&&v0.d.a===SK.join(',')&&v0.d.hp===532&&v0.d.atk===46&&v0.d.tr&&v0.d.g==='포렌의 중갑'&&v0.d.h===1.4,'포렌 설계: 포렌의 대검 · 투구 없는 중갑 · 140cm · ◆쥐들의 왕 · 기술 다섯 · 체력 532 · 공격 46 · [지휘S] [군주] [높은후각] [반사신경]');
 ok(v0.prof.u==='쥐들의 왕'&&v0.prof.a===SK.join(',')&&v0.prof.w==='포렌의 대검'&&v0.prof.tr&&v0.id.u==='쥐들의 왕'&&v0.id.a===SK.join(',')&&v0.id.tr,'도감 프로필 · 정체성 (C-006) 이 설계와 같음');
 ok(!v0.noAct.length&&!v0.noIco.length&&v0.tgt&&v0.uq.who==='C-006'&&v0.uq.lore>=2&&v0.uq.eff>=6&&v0.gunju,'기술 글 (구르기까지) · 그림 칸 · 대상 고르기 글 · ◆쥐들의 왕 글 · [군주] 글에 포렌');
 ok(v0.rows>=8&&v0.ico==='46,47,48,49'&&v0.img==='384x'+v0.rows*48&&v0.ic==='🐀🗡🦵👊','아이콘 판 8 × '+v0.rows+' (새 그림 46 ~ 49 · '+v0.img+') · 기술 칸 그림 (쥐 표식 · 쥐 방진 · 니킥 · 내려찍기)');
 ok(v0.rar===0.3&&v0.camp,'뽑기 희귀도 5성 0.3 · 1층 · 여정 뽑기 풀에 포렌');
 await p.evaluate(TALKEND);
 await p.evaluate(()=>{ window.__mk = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...fromDesign(designByKey(k),s), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].order=null; W.units[i].stay=null; }); return W; };
   window.__lit = (W) => { W.amb = 1; computeLight(W); markExplored(W); for (const u of W.units) if (u.side===1) u.seenBy = 1; return W; };
   const t=document.getElementById('talk'); if (t) t.hidden=true; });
 // 1) 판의 쥐 — 엔진이 부르면 S.units 에도 (순서가 맞음)
 const f1 = await p.evaluate(()=>{ const W=__lit(__mk([['포렌',0,10,10],['인주',0,9,12],['검기사',1,18,10]])); const p0=W.units[0], e=W.units[2]; e.order={k:'hold'}; e.hp=e.max=9999; stepWorld(W,0.05);
   const R=W.units.filter(u=>u.ratOf===p0.i); return { n: R.length, kinds: R.map(r=>r.ratKind).join(','), align: W.units.length===S.units.length && W.units.every((u,i)=>S.units[i]&&S.units[i].id===u.pid), sum: R.every(r=>S.units[r.i].summon==='rat'), kit: !!p0.porenKit, sp: (p0.spec||[]).map(x=>x.k).join(','), s1: (specAt(p0,'spec1')||{}).k, s2: (specAt(p0,'spec2')||{}).k }; });
 console.log('    판', JSON.stringify(f1));
 ok(f1.kit&&f1.n===4&&f1.align&&f1.sum,'싸움을 시작하면 쥐 넷 (3D) — 엔진이 부른 쥐가 S.units 에도 같은 순서로 ('+f1.kinds+')');
 ok(f1.sp==='pmark,pfort,pshield,pladder,pbind'&&f1.s1==='pmark'&&f1.s2==='pfort','기술 다섯 · 기술 칸 1 = 쥐 표식 · 2 = 쥐 방진');
 // 2) 쥐는 고르기 · 명단 · 모두 고르기 · 번호에서 빠짐 · 포렌 줄에 🐀
 const f2 = await p.evaluate(()=>{ const W=world, R=W.units.filter(u=>u.ratOf!=null); hud(); const rows=[...document.querySelectorAll('#party [data-ally]')].map(e=>+e.dataset.ally);
   sel=new Set(); hud(); const ob=document.querySelector('#orders [data-ord="all"]'); if (ob) ob.click(); const all=[...sel]; sel=new Set(); document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'a',code:'KeyA',ctrlKey:true,bubbles:true})); const all2=[...sel]; const pr=document.querySelector('#party [data-ally="0"]'); return { rows, ratRow: rows.some(i=>W.units[i].ratOf!=null), all, all2, ob: !!ob, ratSel: [...all, ...all2].some(i=>W.units[i].ratOf!=null), no: R.map(r=>allyNo(W,r)).join(','), badge: pr ? /🐀\d/.test(pr.textContent) : false, selU: selUnits(W).length }; });
 console.log('    고르기', JSON.stringify(f2));
 ok(!f2.ratRow&&f2.rows.length===2&&f2.badge,'명단에 쥐가 없음 (포렌 · 인주) — 포렌 줄에 🐀 수');
 ok(f2.ob&&!f2.ratSel&&f2.all.length===2&&f2.all2.length===2&&f2.no.split(',').every(x=>x==='0'),'모두 고르기 (단추 · Ctrl+A) · 번호에서 쥐는 빠짐');
 // 3) 쥐를 탭 — 고른 이가 없으면 알림 · 있으면 그 자리 바닥으로 이동
 const f3 = await p.evaluate(()=>{ const W=world, r=W.units.find(u=>u.ratOf!=null), p0=W.units[0]; r.x=12.5; r.y=13.5; sel=new Set(); touchTap({x:r.x,y:r.y}); const t1=$('toast').textContent, s1=sel.size;
   pickAlly(r.i,false); const s2=sel.size; sel=new Set([0]); touchTap({x:r.x,y:r.y}); const o=p0.order||(p0.ordPend&&p0.ordPend.o); return { t1, s1, s2, o: o&&[o.k, +(o.x||0).toFixed(1), +(o.y||0).toFixed(1)], sel: [...sel].join(',') }; });
 console.log('    쥐 탭', JSON.stringify(f3));
 ok(/포렌의 쥐/.test(f3.t1)&&f3.s1===0&&f3.s2===0,'고른 이 없이 쥐를 탭 → "포렌의 쥐는 포렌의 기술로만" (고르지 않음)');
 ok(f3.o&&f3.o[0]==='move'&&Math.abs(f3.o[1]-12.5)<0.6&&Math.abs(f3.o[2]-13.5)<0.6&&f3.sel==='0','포렌을 고른 채 쥐를 탭 → 그 자리로 이동 명령');
 // 4) 기술 칸 1 쥐 표식: 단추 → 적을 탭 → 명령 → 표식
 const f4 = await p.evaluate(()=>{ const W=world, p0=W.units[0], e=W.units[2]; p0.order=null; p0.ordPend=null; for (const x of p0.spec) x.cdT=-9; e.x=14; e.y=10; e.seenBy=1; sel=new Set([0]); useSlot(6); const arm=armed&&[armed.k,armed.s].join(':');
   touchTap({x:e.x,y:e.y}); const o=p0.order||(p0.ordPend&&p0.ordPend.o); const oo=o&&[o.k,o.s,o.b]; const n0=W.log.length; for (let i=0;i<120&&!W.log.slice(n0).some(l=>l.k==='prMark');i++) stepWorld(W,0.025);
   const M=W.log.slice(n0).filter(l=>l.k==='prMark'); return { arm, o: oo, mark: M.length, b: M[0]&&M[0].b, ring: !!(p0.ratMark&&p0.ratMark.b===e.i) }; });
 console.log('    쥐 표식', JSON.stringify(f4));
 ok(f4.arm==='spec:pmark'&&f4.o&&f4.o[0]==='spec'&&f4.o[1]==='pmark'&&f4.o[2]===2,'기술 칸 1 → 적을 탭 → 쥐 표식 명령');
 ok(f4.mark===1&&f4.b===2&&f4.ring,'쥐 표식 ("물어라!") — 모든 쥐가 그 적에게');
 // 5) 기술 칸 2 쥐 방진: 바로 (제자리) · 동작 이름
 const f5 = await p.evaluate(()=>{ const W=world, p0=W.units[0]; for (const r of W.units.filter(u=>u.ratOf===p0.i)){ r.x=p0.x+0.9; r.y=p0.y+0.3; r.rs={k:'idle'}; } p0.order=null; p0.act=null; sel=new Set([0]); armed=null; useSlot(7); const o=p0.order||(p0.ordPend&&p0.ordPend.o);
   const n0=W.log.length; for (let i=0;i<40&&!W.log.slice(n0).some(l=>l.k==='prFort'||l.k==='specFail');i++) stepWorld(W,0.025); const F=W.log.slice(n0).filter(l=>l.k==='prFort'); return { o: o&&[o.k,o.s], fort: F.length, lab: p0.act ? actLabel(W,p0,liveAct(W,p0)) : '', fail: W.log.slice(n0).filter(l=>l.k==='specFail').map(l=>l.why).join('|') }; });
 console.log('    쥐 방진', JSON.stringify(f5));
 ok(f5.o&&f5.o[0]==='spec'&&f5.o[1]==='pfort'&&f5.fort===1&&/쥐 방진/.test(f5.lab),'기술 칸 2 → 바로 쥐 방진 (대검을 꽂음) · 동작 이름 "'+f5.lab+'"');
 // 6) 기록 · 서술 글 (빈 값 없음) · 쥐 떼의 자잘한 일은 서술하지 않음
 const t1 = await p.evaluate(()=>{ const W=world, p0=W.units[0], e=W.units[2], r=W.units.find(u=>u.ratOf===p0.i&&u.ratKind!=='ratKnight'), t=W.t, a=p0.i, b2=e.i, n0=W.log.length;
   const k=prnRat(W,p0,'ratKnight',{near:true});
   const E=[{k:'ratCome',a,b:k.i,kind:'ratKnight',n:'A',lv:2,ret:1,vet:false},{k:'ratCome',a,b:k.i,kind:'ratKnight',n:'B',lv:1,ret:3,vet:true},{k:'ratCome',a,b:r.i,kind:'ratL'},{k:'prMark',a,b:b2,n:7,why:'명령'},{k:'ratWall',a,b:1,c:b2,n:3},{k:'prFort',a,n:6,why:'위기'},
     {k:'prSpin',a,n:2,abs:120,w:640,dead:1,crit:true,mul:4.2},{k:'prLadder',a,b:b2,counter:true},{k:'prSlam',a,b:b2,n:1},{k:'prShield',a,b:1,n:9},{k:'prShield',a,b:a,n:4},{k:'prShieldEnd',a,why:'지휘 끊김!'},{k:'prBind',a,b:b2},{k:'prUnbind',a:b2,n:4,el:2.1},
     {k:'ratLost',a:k.i,n:'A'},{k:'ratVet',a:k.i,n:'A'},{k:'ratSalute',a,ns:'A, B★'},{k:'ratScatter',a,n:5,why:'포렌을 따라 나감'},{k:'ratRoll',a:k.i,b:b2,dir:'fwd'},{k:'ratRoll',a:k.i,b:b2,dir:'back'},{k:'ratRollHit',a:k.i,n:2},{k:'ratVetCmd',a:k.i,b:b2,n:6},{k:'specFail',a,s:'pfort',why:'곁에 쥐가 둘은 있어야'}];
   for (const x of E) W.log.push({ t, vis: true, ...x });
   const lines=logLines(W, n0).filter(s=>/🐀|🗡|🌊|🛡|🪢|★|🌀|✗/.test(s)); const nar=E.map(x=>{ try { return narrOf(W, { t, vis: true, ...x }); } catch(er){ return 'ERR '+er.message; } });
   const quiet=narrOf(W,{t,vis:true,k:'hit',a:r.i,b:b2,dmg:3,part:'몸통'}), quiet2=narrOf(W,{t,vis:true,k:'hit',a:b2,b:r.i,dmg:30,part:'몸통'}), kill=narrOf(W,{t,vis:true,k:'die',a:r.i,b:b2,how:'melee'});
   return { lines, bad: lines.filter(s=>/undefined|NaN|\[object/.test(s)), nar: nar.filter(Boolean).map(x=>x.s||x), narBad: nar.filter(x=>x&&/undefined|NaN|ERR/.test(x.s||x)), quiet: quiet===null&&quiet2===null, kill: !!kill }; });
 console.log('    로그', JSON.stringify(t1.lines.slice(0,24)));
 console.log('    서술', JSON.stringify(t1.nar));
 ok(t1.lines.length>=22&&!t1.bad.length,'로그 글 ('+t1.lines.length+'줄): 충성 · 표식 · 방벽 · 방진 · 회전 · 사다리 · 쥐 방패 · 포박 · 기억 · 베테랑 · 경례 · 흩어짐 · 구르기 · 베테랑 지휘 — 빈 값 없음');
 ok(t1.nar.length>=10&&!t1.narBad.length,'서술 글 ('+t1.nar.length+'줄) — 빈 값 없음');
 ok(t1.quiet&&t1.kill,'쥐 떼의 자잘한 일 (작은 쥐가 물고 · 맞음) 은 서술하지 않음 · 쥐가 적을 쓰러뜨리면 서술');
 // 7) 그림: 표식 고리 · 쥐 망토 · 방진 · 쥐 방패 · 포박 게이지 · 기사 이름표 · 경례
 const g1 = await p.evaluate(()=>{ const W=world, p0=W.units[0], e=W.units[2], R=W.units.filter(u=>u.ratOf===p0.i&&u.alive), k=R.find(u=>u.ratRec)||prnRat(W,p0,'ratKnight',{near:true});
   p0.ratMark={b:e.i,until:W.t+3}; e.seenBy=1; e.alive=true; p0.cloakN=3; e.bound=true; e.bind={gauge:60,rats:[],t0:W.t,by:p0.i}; R[0].rs={k:'shieldWall',until:W.t+5,slot:{x:R[0].x,y:R[0].y}}; k.leaveT=null;
   p0.act={k:'pr',s:'fort',phase:'fort',t0:W.t,end:W.t+2,rats:[],absorbed:0,dead:0}; const sv=R[1]; sv.leaveT=W.t+1; cam.x=p0.x+2; cam.y=p0.y; cam.z=1.4; cam.follow=false;
   const seen=[]; const P=CanvasRenderingContext2D.prototype, F=P.fillText; P.fillText=function(t,x,y,m){ seen.push(String(t)); return F.call(this,t,x,y,m); }; let err=''; try { draw(); } catch(er){ err=er.message; } finally { P.fillText=F; }
   const lab=actLabel(W,p0,liveAct(W,p0)); p0.act=null; sv.leaveT=null; e.bound=false; e.bind=null; R[0].rs={k:'idle'};
   return { err, mark: seen.includes('🐀'), fort: seen.includes('🗡'), shield: seen.includes('🛡'), bind: seen.includes('🪢'), name: seen.includes(k.ratRec ? k.ratRec.n : '?'), salute: seen.includes('경례'), lab }; });
 console.log('    그림', JSON.stringify(g1));
 ok(!g1.err&&g1.mark&&g1.fort&&g1.shield&&g1.bind&&g1.name&&g1.salute,'그림: 표식 🐀 · 방진 🗡 · 쥐 방패 🛡 · 포박 🪢 게이지 · 기사 이름표 · 경례');
 // 8) 상세 줄 · 동작 이름 (굿윌 순간이동 · 구르기 — 공격 뒤 회복으로 적히던 것)
 const d1 = await p.evaluate(()=>{ const W=world, p0=W.units[0], r=W.units.find(u=>u.ratOf===p0.i&&u.alive), k=W.units.find(u=>u.ratRec&&u.alive);
   const a=ratRow(W,p0), b2=ratRow(W,r), c=k?ratRow(W,k):'';
   const L1=actLabel(W,p0,{k:'gwHop',ph:'run',left:0.1}), L2=actLabel(W,p0,{k:'roll',ph:'run',dir:'fwd',left:0.2}), L3=actLabel(W,p0,{k:'roll',ph:'run',dir:'back',left:0.2}), L4=actLabel(W,p0,{k:'pr',s:'cmd',ph:'hold'}), L5=actLabel(W,p0,{k:'pr',s:'ladder',ph:'ride'});
   return { a, b: b2, c, L: [L1,L2,L3,L4,L5] }; });
 console.log('    상세', JSON.stringify(d1));
 ok(/쥐 \d+마리/.test(d1.a)&&/다음:/.test(d1.a)&&/포렌의 쥐/.test(d1.b)&&/단계|베테랑/.test(d1.c),'상세 "쥐 군단" 줄: 포렌 (쥐 수 · 다음 쥐) · 쥐 (포렌의 쥐 · 지금 하는 일) · 기사 (단계 · 돌아온 횟수)');
 ok(d1.L.every(s=>s&&!/공격 뒤 회복/.test(s)),'동작 이름: '+d1.L.join(' / '));
 // 9) 자동 한 판 (복사한 판) 의 쥐는 S.units 에 들지 않음
 const a1 = await p.evaluate(()=>{ const n0=S.units.length; const Wd=createWorld(clone(S), clone(rules), 5, { headless: true }); for (let i=0;i<8;i++) runTurn(Wd); return { n0, n1: S.units.length, w: Wd.units.length }; });
 ok(a1.n1===a1.n0&&a1.w>a1.n0,'자동 한 판의 쥐는 그 판에만 (S.units 그대로 '+a1.n0+' · 판 '+a1.w+')');
 // 10) 처음으로 — 지난 판의 소환 (쥐) 은 배치에 남지 않음
 const r1 = await p.evaluate(()=>{ const n=S.units.filter(x=>x.summon).length; resetToEdit(); return { before: n, after: S.units.filter(x=>x.summon).length, prev: preview ? preview.units.length : -1, n: S.units.length }; });
 ok(r1.before>0&&r1.after===0&&r1.prev===r1.n,'처음으로 → 쥐 '+r1.before+'마리가 배치에서 빠짐 (미리보기 '+r1.prev+')');
 // 11) 기억하는 쥐 기사 — 싸움이 끝나면 돌아온 횟수 · 단계가 포렌에게 남고, 다음 판엔 그 기사가 먼저
 const m1 = await p.evaluate(()=>{ const W=__lit(__mk([['포렌',0,10,10],['검기사',1,26,10]])); const p0=W.units[0], e=W.units[1], pS=S.units[0]; e.order={k:'hold'}; stepWorld(W,0.05);
   const k=prnRat(W,p0,'ratKnight',{near:true}); const nm=k.name; e.hp=0; e.alive=false; for (let i=0;i<20;i++) stepWorld(W,0.05); const mem=JSON.parse(JSON.stringify(pS.ratMem||[]));
   S.units=[pS, { ...fromDesign(designByKey('검기사'),1), x:26, y:10, id: uid() }]; start(); paused=true; const W2=world; stepWorld(W2,0.05); const kn=W2.units.find(u=>u.ratRec);
   return { nm, mem, same: W2.units[0].ratMem===pS.ratMem, k2: kn ? [kn.name, kn.ratLv] : null }; });
 console.log('    기억', JSON.stringify(m1));
 ok(m1.mem.some(x=>x.ret===1&&x.lv===2),'싸움 끝 — 쥐 기사가 돌아온 횟수 1 · 2단계로 포렌에게 남음 ('+m1.nm+')');
 ok(m1.same&&m1.k2&&/쥐 기사 [A-Z]/.test(m1.k2[0])&&m1.k2[1]===2,'다음 판: 기억하는 그 기사가 먼저 곁에 ('+(m1.k2||[]).join(' · ')+'단계)');
 // 12) 적 포렌: 쥐는 적 목록에 하나하나 나오지 않음 · 포렌 줄에 보이는 쥐 수
 const e1 = await p.evaluate(()=>{ const W=__lit(__mk([['인주',0,10,10],['포렌',1,18,10]])); W.units[0].order={k:'hold'}; stepWorld(W,0.05); for (const u of W.units) if (u.side===1) u.seenBy=1; hud();
   const rows=[...document.querySelectorAll('#foes [data-foe]')].map(x=>+x.dataset.foe); const pr=document.querySelector('#foes [data-foe="1"]'); return { rows, rat: rows.some(i=>W.units[i].ratOf!=null), n: W.units.filter(u=>u.ratOf===1).length, badge: pr ? (pr.textContent.match(/🐀\d+/)||[''])[0] : '' }; });
 console.log('    적 포렌', JSON.stringify(e1));
 ok(!e1.rat&&e1.rows.length===1&&e1.n===4&&e1.badge==='🐀4','적 포렌: 쥐는 목록에 따로 없고 포렌 줄에 🐀4');
 // 13) 싸우다 저장 → 다시 불러오면 소환은 빠짐
 await p.evaluate(()=>{ const W=__lit(__mk([['포렌',0,10,10],['검기사',1,18,10]])); stepWorld(W,0.05); save(); });
 const s0 = await p.evaluate(()=>S.units.filter(x=>x.summon).length);
 await p.reload(); await wait(p,1200);
 const s1 = await p.evaluate(()=>({ n: S.units.filter(x=>x.summon).length, all: S.units.length }));
 ok(s0>0&&s1.n===0,'싸우다 저장 (쥐 '+s0+') → 불러오면 소환은 빠짐 ('+s1.all+'명)');
 ok(!errs.length,'페이지 오류 없음'+(errs.length?' — '+errs.slice(0,3).join(' / '):''));
 await b.close(); console.log(fails?`FAIL ${fails}`:'ALL ui8780b OK'); process.exit(fails?1:0); })();
