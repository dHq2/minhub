// v8.7.8 UI 시험 — ui8780.js v1.1 (v1.1: 내려찍기 기록 글은 엔진이 남기는 칸 (n · r) 으로 · 조사 (굿윌이 · 검기사를) · 천둥은 급소 즉사가 없음 · v1.0: 굿윌 (C5 — 2D 그대로) 설계 · 정체성 · 글 · 그림 칸 · 뽑기 희귀도 (1 ~ 3성 1 · 4성 0.6 · 5성 0.3) · 1층 뽑기 · 여정 뽑기 풀 · 기술 칸 (니킥 · 내려찍기) 명령 · 단추로 고르기 · 딱 → 감전 (푸른 번개) ⚡ 그림 · 로그 · 서술 글 · 적뢰 감전도 같은 틀)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const dir = process.argv[2]||'build', url='file://'+process.cwd()+'/'+dir+'/wrapped.html';
 const TALKEND = "{ let g=0; while (TK && g++<200){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); } }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1000);
 const SK = ['니킥','내려찍기','손바닥','딱','딱딱딱','올려차기'];
 // 0) 버전 · 설계 · 정체성 · 글 · 그림 칸
 const v0 = await p.evaluate((SK)=>{ const d=designByKey('굿윌'), id=identityOf('C-010')||{}, P=PROFILE['C-010']||{}, U=UNIQUE['푸른 번개']||{};
   return { ver: document.querySelector('span.ver').textContent, mig: RULES_MIG, d: d && { ref: d.ref, side: d.side, w: d.weapon, sh: d.shield, u: (d.unique||[]).join(','), a: (d.active||[]).join(','), hp: d.ov&&d.ov.hp, atk: d.ov&&d.ov.atk, tr: (d.traits||[]).join(',') },
     prof: { u: (P.unique||[]).join(','), a: (P.active||[]).join(','), w: P.weapon }, id: { u: (id.unique||[]).join(','), a: (id.active||[]).join(',') },
     noAct: SK.filter(k=>!ACTIVE[k]), noIco: SK.filter(k=>ICO.map[k]==null), uq: { who: U.who, lore: !!U.lore, eff: !!(U.effects&&U.effects.length||U.effects) }, tgt: ['knee','gslam','gpalm','snap','snap3','rise'].filter(k=>!SPEC_TGT[k]),
     rar: RAR_OF(d), wG: RAR_W(d), w1: RAR_W(designByKey('가윤')), w2: RAR_W(designByKey('모닝스타')), w5k: RAR_W(designByKey('카리우스')) }; }, SK);
 console.log('    ', JSON.stringify(v0));
 ok(/v8\.7\.([8-9]|\d\d)|v8\.([8-9]|\d\d)\./.test(v0.ver)&&/^8\.(7\.([8-9]|\d\d)|([8-9]|\d\d)\.\d+)$/.test(v0.mig),'버전 8.7.8 이상 · 수치표 이전 '+v0.mig);
 ok(v0.d&&v0.d.ref==='C-010'&&v0.d.side===0&&v0.d.w==='맨손'&&v0.d.sh===false&&v0.d.u==='푸른 번개'&&v0.d.a===SK.join(',')&&v0.d.hp===360&&v0.d.atk===46,'굿윌 설계: 맨손 · ◆푸른 번개 · 기술 여섯 · 체력 360 · 공격 46');
 ok(v0.prof.u==='푸른 번개'&&v0.prof.a===SK.join(',')&&v0.prof.w==='맨손'&&v0.id.u==='푸른 번개'&&v0.id.a===SK.join(','),'도감 프로필 · 정체성 (C-010) 이 설계와 같음');
 ok(!v0.noAct.length&&!v0.noIco.length&&!v0.tgt.length&&v0.uq.who==='C-010'&&v0.uq.lore&&v0.uq.eff,'기술 글 · 그림 칸 · 대상 고르기 글 · ◆푸른 번개 글 모두 있음');
 ok(v0.rar===5&&v0.wG===0.3&&v0.w1===1&&v0.w2===1&&v0.w5k===0.3,'뽑기 희귀도: 굿윌 5성 0.3 · 1 ~ 3성 1 (가윤 · 모닝스타) · 카리우스 5성 0.3');
 // 1) 뽑기 — 같은 무게로 고름 (1성 하나 + 5성 하나 → 5성은 0.3 / 1.3 ≈ 23%) · 1층 뽑기 풀 · 여정 뽑기 풀
 const g1 = await p.evaluate(()=>{ const pool=[designByKey('가윤'), designByKey('굿윌')]; let n=0; const N=20000; for (let i=0;i<N;i++) if (rarPick(pool)===1) n++;
   const all=DESIGN_DEFAULTS.filter(d=>d.side===0&&!CAMP_FIX.includes(d.key)&&!CAMP_NO.includes(d.key)).map(d=>d.key);
   return { r: +(n/N).toFixed(3), camp: all.includes('굿윌'), n: all.length }; });
 console.log('    뽑기', JSON.stringify(g1));
 ok(g1.r>0.2&&g1.r<0.26,'희귀도 무게대로 뽑힘 (1성 + 5성 → 5성 '+g1.r+' · 기대 0.23)');
 ok(g1.camp,'1층 뽑기 풀에 굿윌 ('+g1.n+'명 중)');
 // 1층 뽑기를 여러 번 — 굿윌은 드묾 (뽑기 셋 · 5성이라 0.3)
 const g2 = await p.evaluate(()=>{ let gw=0, n=0; const R0=Math.random; for (let s=0;s<60;s++){ setMode('story'); if (S.camp){ delete S.camp; } resetToEdit(); campStart(); const sh=[...document.querySelectorAll('#gacha [data-k], #gacha .gc')].map(e=>e.dataset.k||e.textContent); const C=S.camp; const pk=(C&&C.pick)||(C&&C.gacha)||[]; n++; if ((Array.isArray(pk)?pk:[]).some(k=>k==='굿윌'||(k&&k.key==='굿윌'))||sh.some(t=>/굿윌/.test(t||''))) gw++; const g=document.getElementById('gacha'); if (g) g.hidden=true; delete S.camp; } return { gw, n }; });
 console.log('    1층 뽑기', JSON.stringify(g2));
 ok(g2.n===60&&g2.gw>0&&g2.gw<30,'1층 뽑기 60번 — 굿윌이 나오지만 드묾 ('+g2.gw+'번)');
 await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await wait(p,1000);
 // 2) 싸움 — 훈련장
 await p.evaluate(()=>{ window.__mk = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...fromDesign(designByKey(k),s), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].order=null; W.units[i].stay=null; }); return W; };
   window.__lit = (W) => { W.amb = 1; computeLight(W); markExplored(W); for (const u of W.units) if (u.side===1) u.seenBy = 1; return W; }; });
 const f0 = await p.evaluate(()=>{ const W=__lit(__mk([['굿윌',0,10,10],['검기사',1,14,10]])); const g=W.units[0];
   return { gw: !!g.gwKit, fl: !!g.flanker, sp: (g.spec||[]).map(x=>x.k).join(','), cd: (g.spec||[]).filter(x=>x.cdT>W.t).map(x=>x.k).join(','), s1: (specAt(g,'spec1')||{}).k, s2: (specAt(g,'spec2')||{}).k, hp: g.max, w: g.weapon || '맨손', dc: g.dcounter }; });
 console.log('    판', JSON.stringify(f0));
 ok(f0.gw&&f0.fl&&f0.sp==='knee,gslam,gpalm,snap,snap3,rise'&&f0.hp===360,'판의 굿윌: 푸른 번개 몸 · 사각 노림 · 기술 여섯 (니킥 · 내려찍기 · 손바닥 · 딱 · 딱딱딱 · 올려차기) · 체력 360');
 ok(f0.cd.split(',').length===6&&f0.s1==='knee'&&f0.s2==='gslam','처음엔 기술마다 대기 (2D 그대로) · 기술 칸 1 = 니킥 · 2 = 내려찍기');
 // 니킥 명령 (적을 고름) — 니킥이 꽂힘
 const k1 = await p.evaluate(()=>{ let hit=0, head=0, ord=0; for (let s=0;s<6;s++){ const W=__lit(__mk([['굿윌',0,10,10],['검기사',1,13.5,10]])); const g=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.hp=e.max=9999; e.canGuard=false; for (const x of g.spec) x.cdT=-9;
     const n0=W.log.length; g.order={k:'spec', s:'knee', b:e.i}; for (let i=0;i<160 && !W.log.slice(n0).some(l=>l.k==='gwKnee');i++) stepWorld(W,0.025); const L=W.log.slice(n0).filter(l=>l.k==='gwKnee'&&l.a===g.i); if (L.length){ ord++; if (9999-e.hp>0) hit++; if (L.some(l=>l.head)) head++; } }
   return { ord, hit, head }; });
 console.log('    니킥', JSON.stringify(k1));
 ok(k1.ord===6&&k1.hit>=5,'기술 칸 니킥 명령 — 여섯 판 모두 니킥 (꽂힘 '+k1.hit+' · 헤드샷 '+k1.head+')');
 // 내려찍기 명령 — 뛰어올라 둘레를 내려찍음 (떠 있는 동안 무적)
 const s1 = await p.evaluate(()=>{ const W=__lit(__mk([['굿윌',0,10,10],['검기사',1,13,10],['검기사',1,13,11.2]])); const g=W.units[0], e=W.units[1], e2=W.units[2]; for (const o of [e,e2]){ o.order={k:'hold'}; o.hp=o.max=9999; o.canGuard=false; } for (const x of g.spec) x.cdT=-9;
   const n0=W.log.length; g.order={k:'spec', s:'gslam', b:e.i}; let inv=false; for (let i=0;i<200 && !W.log.slice(n0).some(l=>l.k==='gslamHit'||l.k==='gslam'&&l.done);i++){ stepWorld(W,0.025); if ((g.jrInv||0)>W.t) inv=true; }
   for (let i=0;i<40;i++) stepWorld(W,0.025); const L=W.log.slice(n0); return { slam: L.some(l=>l.k==='gslam'&&l.a===g.i), hits: L.filter(l=>l.k==='gslamHit'&&l.a===g.i).length, inv, d1: Math.round(9999-e.hp), d2: Math.round(9999-e2.hp) }; });
 console.log('    내려찍기', JSON.stringify(s1));
 ok(s1.slam&&s1.inv&&(s1.d1>0||s1.d2>0),'기술 칸 내려찍기 명령 — 뛰어오름 (떠 있는 동안 무적) · 둘레를 내려찍음 (피해 '+s1.d1+' · '+s1.d2+')');
 // 단추로 고르기 — 기술 칸 단추를 누르고 적을 누르면 그 명령
 const W2S = async (x,y) => p.evaluate(([x,y])=>{ const r=cv.getBoundingClientRect(), ts=TS*cam.z; return { x: r.left + r.width/2 + (x-cam.x)*ts, y: r.top + r.height/2 + (y-cam.y)*ts }; }, [x,y]);
 await p.evaluate(TALKEND); await p.evaluate(()=>{ const t=document.getElementById('talk'); if (t) t.hidden=true; const W=__lit(__mk([['굿윌',0,12,12],['검기사',1,15,12]])); cam.x=13; cam.y=12; cam.z=1.6; cam.follow=false; for (const u of W.units) if (u.side===1) u.seenBy=1; sel=new Set([0]); hud(); });
 await wait(p,200);
 const btn = await p.evaluate(()=>{ const L=[...document.querySelectorAll('[data-sk]')].filter(e=>e.offsetParent!==null).map(e=>({ k: e.dataset.sk, t: e.textContent.trim() })); return L; });
 const kb = btn.find(x=>/니킥/.test(x.t)), sb = btn.find(x=>/내려찍기/.test(x.t));
 let ko = null;
 if (kb){ await p.click(`[data-sk="${kb.k}"]`); await wait(p,200); const tip = await p.evaluate(()=>{ const e=document.getElementById('hint')||document.querySelector('.hint'); return e ? e.textContent : ''; }); const s=await W2S(15,12); await p.mouse.click(s.x, s.y); await wait(p,250);
   ko = await p.evaluate(()=>{ const u=world.units[0]; const o = u.order || (u.ordPend && u.ordPend.o); return { o: o && [o.k, o.s, o.b] }; }); ko.tip = tip; }
 console.log('    단추', JSON.stringify({ btn: btn.map(x=>x.t).join(' | '), ko }));
 ok(kb&&sb,'기술 칸 단추: 니킥 · 내려찍기');
 ok(ko&&ko.o&&ko.o[0]==='spec'&&ko.o[1]==='knee'&&ko.o[2]===1,'니킥 단추 → 적을 누름 → 니킥 명령');
 // 딱 → 감전 (푸른 번개) · ⚡ 그림 (푸른 색) · 적뢰 감전은 붉은 ⚡
 const z1 = await p.evaluate(()=>{ const W=__lit(__mk([['굿윌',0,10,10],['검기사',1,15,10]])); const g=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.hp=e.max=9999; e.canGuard=false; for (const x of g.spec) x.cdT=-9;
   const R0=Math.random; Math.random=()=>0.995; let st=null; try { const n0=W.log.length; g.order={k:'spec', s:'snap', b:e.i}; for (let i=0;i<120 && !e.zap;i++) stepWorld(W,0.025); st = e.zap ? { kind: e.zap.kind, st: e.zap.st, n: e.zap.n } : null; var L=W.log.slice(n0); } finally { Math.random=R0; }
   const seen=[]; const P=CanvasRenderingContext2D.prototype, F=P.fillText; P.fillText=function(t,x,y,m){ if (/⚡/.test(String(t))) seen.push({ t: String(t), c: this.fillStyle }); return F.call(this,t,x,y,m); }; try { cam.x=e.x; cam.y=e.y; draw(); } finally { P.fillText=F; }
   const zl=L.filter(l=>l.k==='zap'); const red=(()=>{ e.zap=null; zapOn(W,e,'red',g); const s2=[]; P.fillText=function(t,x,y,m){ if (/⚡/.test(String(t))) s2.push(String(this.fillStyle)); return F.call(this,t,x,y,m); }; try { draw(); } finally { P.fillText=F; } return s2; })();
   return { zapLog: L.some(l=>l.k==='gwZap'&&l.a===g.i), st, zl: zl.length, seen, red }; });
 console.log('    딱', JSON.stringify(z1));
 ok(z1.zapLog&&z1.st&&z1.st.kind==='blue'&&z1.zl>=1,'딱 명령 → 번개 · 감전 (푸른 번개 · '+(z1.st?z1.st.n+'초':'없음')+')');
 ok(z1.seen.some(s=>/7fd4ff/i.test(s.c)),'감전 ⚡ 그림: 푸른 번개는 푸른 색');
 ok(z1.red.some(c=>/ff4a4a/i.test(c)),'같은 틀 — 적뢰 감전은 붉은 ⚡');
 const v1 = await p.evaluate(()=>{ let n=0, head=0, kill=0, big=0; for (let s=0;s<40;s++){ const W=__lit(__mk([['굿윌',0,10,10],['검기사',1,15,10]])); const g=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.hp=e.max=9999; e.canGuard=false; for (const x of g.spec) x.cdT=-9;
     const n0=W.log.length; g.order={k:'spec', s:'snap', b:e.i}; for (let i=0;i<120 && !W.log.slice(n0).some(l=>l.k==='gwZap');i++) stepWorld(W,0.025); for (let i=0;i<4;i++) stepWorld(W,0.025);
     for (const l of W.log.slice(n0)) if (l.k==='hit'&&l.a===g.i&&/천둥/.test(l.tag||'')){ n++; if (l.part==='머리') head++; if (/즉사|급소/.test(l.tag||'')) kill++; if (l.dmg>1000) big++; } }
   return { n, head, kill, big }; });
 console.log('    천둥 급소', JSON.stringify(v1));
 ok(v1.n>=20&&v1.kill===0&&v1.big===0,'딱 천둥은 급소 · 즉사가 없음 (맞음 '+v1.n+' · 머리 '+v1.head+' — 피해 + 감전 + 경직만, 2D 그대로)');
 // 3) 로그 · 서술 글 (빈 칸 · undefined 없음)
 const t1 = await p.evaluate(()=>{ const W=__lit(__mk([['굿윌',0,10,10],['검기사',1,13,10]])); const n0=W.log.length; const a=0, b2=1, t=W.t;
   const E=[{k:'gwHop',a,b:b2,d:2.4,why:'사각으로'},{k:'gwOpen',a,b:b2},{k:'gwPalm',a,b:b2,mark:true},{k:'gwMiss',a,b:b2},{k:'gwKnee',a,b:b2,head:true},{k:'gwKnee',a,b:b2},{k:'gwRise',a,b:b2},{k:'gwZap',a,b:b2,big:true},{k:'gslam',a},{k:'gslamHit',a,n:2,r:2.5},{k:'zap',a,b:b2,kind:'blue',st:2,n:4,dps:12},{k:'zap',a,b:b2,kind:'red',st:1,n:5,dps:10},{k:'evade',a:b2,b:a,how:'zap',why:'천둥을 피함',p:0.3}];
   for (const e of E) W.log.push({ t, vis: true, ...e });
   const lines=logLines(W, n0); const nar=E.map(e=>{ try { return narrOf(W, { t, vis: true, ...e }); } catch(x){ return 'ERR '+x.message; } });
   return { lines, bad: lines.filter(s=>/undefined|NaN|\[object/.test(s)), nar: nar.filter(Boolean).map(x=>x.s||x), narBad: nar.filter(x=>x&&/undefined|NaN|ERR|굿윌가 |검기사을 |검기사이 /.test(x.s||x)) }; });
 console.log('    로그', JSON.stringify(t1.lines.slice(-14)));
 console.log('    서술', JSON.stringify(t1.nar));
 ok(t1.lines.length>=13&&!t1.bad.length,'로그 글: 팟 · 틈 · 손바닥 · 빗나감 · 니킥 (헤드샷) · 올려차기 · 번개 · 내려찍기 · 감전 (푸른 · 적뢰) · 천둥을 피함 — 빈 값 없음');
 ok(t1.nar.length>=3&&!t1.narBad.length,'서술 글: 니킥 헤드샷 · 손바닥 · 빗나감 · 내려찍기 ('+t1.nar.length+'줄)');
 // 4) 여정: 굿윌을 뽑으면 설계 그대로 (도감의 일반 동료가 아님)
 const r1 = await p.evaluate(()=>{ const d=designByKey('굿윌'); const u=fromDesign(d,0); return { u: (u.unique||[]).join(','), a: (u.active||[]).join(','), w: u.weapon, hp: u.hp||u.max||(u.ov&&u.ov.hp) }; });
 ok(r1.u==='푸른 번개'&&r1.a===SK.join(',')&&r1.w==='맨손','여정 · 훈련장에서 만든 굿윌 = 설계 그대로');
 ok(!errs.length,'페이지 오류 없음'+(errs.length?' — '+errs.slice(0,3).join(' / '):''));
 await b.close(); console.log(fails?`FAIL ${fails}`:'ALL ui8780 OK'); process.exit(fails?1:0); })();
