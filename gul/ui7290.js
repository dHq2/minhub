// v7.29.0 UI 시험 — ui7290.js v1.4 (v1.4: v8.7.3 철퇴도 사격과 같게 — 연타 (바로) 명령만 오사를 감수, 그냥 공격 명령은 길이 트일 때까지 기다림 · v1.3: v8.7.2 모닝스타는 이제 타고나길 돌격 안 함 — 성향 · 단추 시험은 그 성향을 끈 채로 · v1.2: 비껴 선 동료는 공이 휘는 반대쪽 · 상세 칸은 교전한 세자르로 · v1.1: 적 자리 = 철퇴가 닿는 거리 (간격 2.0) · v1.0: 철퇴 오사 (던질 때 · 거둘 때 · 비껴 선 동료는 안 맞음) · 길에 동료가 있으면 기다림 (명령이면 던짐) · 거두는 공이 적을 침 · 넘어뜨림 / 돌격 성향 (탕아 · 모닝스타 · 돌격 안 함 단추 · 다음 판) / 세자르 버팀 · 원형 베기 → 돌진 원형 베기 / 왕관 [★권위E] · 로그 · 상세 칸 · PC · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); for (const [k,x,y] of [['모닝스타',12.5,15.5],['탕아',13.5,16.5]]){ const m=fromDesign(designByKey(k),0); m.x=x; m.y=y; S.units.push(m); } const c=fromDesign(designByKey('세자르'),1); c.x=20.5; c.y=6.5; S.units.push(c); rebuildMap(); changed(); start(); });
 await p.waitForTimeout(300);
 // 1. 철퇴 오사
 const f = await p.evaluate(()=>{ paused=true; const W=world, m=W.units.find(u=>u.name==='모닝스타'), e=W.units.find(u=>u.side===1&&u.alive&&!u.cz), a=W.units.find(u=>u.hero), ev0=evadeP; evadeP=()=>0; const r0=W.rand; W.rand=()=>0.5;
   const put=()=>{ for (const u of W.units) if (u!==m&&u!==e&&u!==a){ u.x=2+u.i*0.01; u.y=2; } m.x=10; m.y=10; e.x=10+m.r+e.r+2.0; e.y=10; m.act=null; W.flails=[]; e.hp=e.max; a.hp=a.max; e.seenBy=true; };
   const run=n=>{ for (let i=0;i<n&&(W.flails||[]).length;i++){ W.t+=1/60; stepFlails(W,1/60); } };
   put(); a.x=11.6; a.y=10.04; let k0=W.log.length; throwFlail(W,m,e); run(120); const L1=W.log.slice(k0), ffOut=L1.some(l=>l.k==='flailFF'&&l.b===a.i&&!l.back), aHit=L1.some(l=>l.k==='hit'&&l.b===a.i&&/오사/.test(l.tag||'')), eHit1=L1.some(l=>l.k==='hit'&&l.b===e.i);
   put(); a.x=11.6; a.y=10-a.r*0.75-0.25; k0=W.log.length; throwFlail(W,m,e); run(120); const L2=W.log.slice(k0), ffSide=L2.some(l=>l.k==='flailFF'), eHit2=L2.some(l=>l.k==='hit'&&l.b===e.i&&l.tag==='철퇴 던지기');
   // 거둘 때: 공이 적 너머에서 손으로 돌아옴 — 적을 침 (× 0.6) · 넘어뜨림 (W.rand 0.1)
   put(); a.x=3; a.y=3; W.rand=()=>0.1; k0=W.log.length; W.flails=[{ by:m.i, side:0, b:e.i, x:14.6, y:10, vx:-12, vy:0, L:3.2, br:0.2, ph:'back', hit:null, ev:[], bk:[], t0:W.t }]; run(120); const L3=W.log.slice(k0), back=L3.find(l=>l.k==='hit'&&l.b===e.i&&l.tag==='돌아오는 철퇴'), down=L3.some(l=>l.k==='prone'&&l.b===e.i);
   // 거둘 때 동료 (깊이 겹침)
   put(); e.x=16; a.x=12.2; a.y=10.02; W.rand=()=>0.5; k0=W.log.length; W.flails=[{ by:m.i, side:0, b:e.i, x:13.6, y:10, vx:-12, vy:0, L:3.2, br:0.2, ph:'back', hit:null, ev:[], bk:[], t0:W.t }]; run(120); const L4=W.log.slice(k0), ffBack=L4.some(l=>l.k==='flailFF'&&l.b===a.i&&l.back);
   // 길에 동료 → 기다림 · 명령이면 던짐
   put(); a.x=11.6; a.y=10.04; m.order=null; startAct(W,m,e,'시험'); const wait=!m.act&&/철퇴 길/.test(m.mood||''); m.act=null; m.order={ k:'attack', b:e.i }; startAct(W,m,e,'명령'); const ordWait=!m.act; m.act=null; m.order={ k:'attack', b:e.i, now:true }; startAct(W,m,e,'명령'); const ordThrow=!!(m.act&&m.act.fl); m.act=null; m.order=null;
   const txt=logLines(W).join('\n'); W.rand=r0; evadeP=ev0; put();
   return { ffOut, aHit, eHit1, ffSide, eHit2, back: back?back.dmg:null, down, ffBack, wait, ordWait, ordThrow, txt: /오사 — 모닝스타의 철퇴가/.test(txt)&&/오사 — 모닝스타의 돌아오는 철퇴가/.test(txt), ff: W.rules.weapons['모닝스타'].flail.ff };
 });
 console.log('    철퇴 ('+vw.nm+')', JSON.stringify(f));
 ok(f.ffOut&&f.aHit&&!f.eHit1,'던진 공이 깊이 겹친 동료를 맞힘 (오사 · 그 뒤 적은 안 맞음)'); ok(!f.ffSide&&f.eHit2,'비껴 선 동료는 지나침 — 적이 맞음'); ok(f.back>0&&f.down,'거두는 공이 길의 적을 침 ('+f.back+') · 넘어뜨림'); ok(f.ffBack,'거두는 공도 깊이 겹친 동료를 맞힘');
 ok(f.wait&&f.ordWait&&f.ordThrow,'공 길에 동료 — 스스로 · 그냥 공격 명령은 기다림 · 연타 (바로) 명령이면 던짐'); ok(f.txt,'로그 글 (오사 — 던질 때 · 거둘 때)'); ok(f.ff===0.55,'수치표 flail.ff 0.55');
 // 2. 돌격 성향 · 돌격 안 함
 const c = await p.evaluate(()=>{ const W=world, m=W.units.find(u=>u.name==='모닝스타'), t=W.units.find(u=>u.name==='탕아'), e=W.units.find(u=>u.side===1&&u.alive&&!u.cz);
   m.noChg=m.noChg0=false; m.chgBias=2; m.x=10; m.y=10; e.x=13.5; e.y=10; e.seenBy=true; t.x=10; t.y=12; const v=chargeValue(W,m,e), C=W.rules.charge, w0=C.worth; C.worth=v+m.bold*0.8-((planOf(W,0)||{}).chg||0)-0.5;
   const okB=chargeOk(W,m,e), b0=m.chgBias; m.chgBias=0; const ok0=chargeOk(W,m,e); m.chgBias=b0; C.worth=w0;
   const tc=tryCharge(W,t,e,false); return { mb: m.chgBias, tn: t.noChg, okB, ok0, tc, flip: (t.spec||[]).some(x=>x.k==='flip') }; });
 console.log('    돌격 성향', JSON.stringify(c)); ok(c.mb===2&&!c.okB&&c.ok0,'모닝스타 돌격 성향 +2 — 같은 값에서 돌격 안 함 (성향 0 이면 함)'); ok(c.tn&&c.tc===false&&c.flip,'탕아 — 스스로 돌격 안 함 · 공중제비 있음');
 const t2 = await p.evaluate(async ()=>{ const W=world, m=W.units.find(u=>u.name==='모닝스타'); m.noChg=m.noChg0=false; sel=new Set([m.i]); hud(); await new Promise(r=>setTimeout(r,60));
   let pcBtn=null; if (!MOB){ const bt=document.querySelector('#orders [data-ord="nochg"]'); pcBtn=!!bt; if (bt) bt.click(); } else ordKey('nochg');
   await new Promise(r=>setTimeout(r,60)); const on=m.noChg, e=W.units.find(u=>u.side===1&&u.alive&&!u.cz); m.x=10; m.y=10; e.x=13.5; e.y=10; const tc=tryCharge(W,m,e,true);
   const drawer=typeof drawerActs==='function'?null:null; const lg=logLines(W).join('\n');
   saveOpeners(W); const op=(S.openers||[]).find(o=>o.pid===m.pid); return { pcBtn, on, tc, lg: /🚫 모닝스타 돌격 안 함/.test(lg), nc: op&&op.nc }; });
 console.log('    돌격 안 함', JSON.stringify(t2)); ok((vw.mob||t2.pcBtn)&&t2.on&&t2.tc===false,'돌격 안 함 ('+(vw.mob?'휴대폰 단추 길':'PC 태세 줄 단추')+') — 지휘관 돌격 (forced) 도 안 함'); ok(t2.lg,'로그 — 유저 지휘 · 돌격 안 함'); ok(t2.nc===1,'다음 판 시작 설정에 남음');
 if (vw.mob){ const dk = await p.evaluate(()=>/data-dk="nochg"/.test(document.body.innerHTML)); ok(dk,'휴대폰 단추 (data-dk nochg) 가 보임'); }
 // 3. 세자르: 버팀 · 원형 베기 → 돌진 원형 베기
 const z = await p.evaluate(()=>{ const W=world, k=W.units.find(u=>u.cz), a=W.units.find(u=>u.hero); let pr=0, st=0, N=300; const r0=W.rand;
   for (let i=0;i<N;i++){ k.proneT=-9; k.stunT=-9; k.saT=-9; k.act=null; const p0=k.proneT; knockDown(W,k,1,a.i,'시험'); if (k.proneT>p0) pr++; if (stun(W,k,0.5,a.i)>0) st++; } k.proneT=-9; k.stunT=-9;
   const res=W.log.filter(l=>l.k==='ccRes').length, lt=logLines(W).join('\n');
   for (const u of W.units) if (u!==k&&u!==a){ u.x=2+u.i*0.01; u.y=2; } a.max=a.hp=4000; k.x=12; k.y=10; a.x=13.1; a.y=10; a.seenBy=true; k.seenBy=true;
   const Z=k.cz; Z.on=true; Z.fury=false; Z.phaseT=9; Z.spin=0; Z.back=9; Z.punish=9; Z.stepT=W.t+9; Z.atkNow=false; Z.combo=null; k.act=null; W.rand=()=>0.1;
   czBrain(W,k,1/30); const s1=k.act&&k.act.s, rs=Z.rspinT; k.act=null; Z.spin=9; a.x=17.5; Z.rspinT=0; czBrain(W,k,1/30); const s2=k.act&&k.act.s, sa=!!(k.act&&k.act.spinAfter);
   let s3=null, T=0; for (let i=0;i<90&&k.act;i++){ W.t+=1/30; T+=1/30; czRun(W,k,1/30); if (k.act&&k.act.s==='spin'){ s3={ s:'spin', rushed:!!k.act.rushed, t:+T.toFixed(2), d:+(dist(k,a)-a.r).toFixed(2) }; break; } }
   W.rand=r0; k.act=null; return { pr, st, N, res, lt: /🗿 세자르 버팀 — 넘어지지 않음/.test(lt)&&/휘청이지 않음/.test(lt), s1, rs, s2, sa, s3, cc: k.ccRes, spinP: W.rules.cz.spinP }; });
 console.log('    세자르', JSON.stringify(z)); ok(z.cc===0.85&&z.pr<z.N*0.3&&z.st<z.N*0.3&&z.pr>0,'세자르 버팀 85% — 넘어짐 '+z.pr+'/'+z.N+' · 휘청 '+z.st+'/'+z.N); ok(z.res>z.N&&z.lt,'버팀 로그 글');
 ok(z.s1==='spin'&&z.rs>=3&&z.rs<=4.5,'붙으면 원형 베기 → '+(z.rs||0).toFixed(2)+'초 뒤 예약'); ok(z.s2==='rush'&&z.sa,'예약 시간 → 돌진 (원형 베기)'); ok(z.s3&&z.s3.rushed&&z.s3.d<2.2,'돌진 끝에 원형 베기 (대기 무시) '+JSON.stringify(z.s3));
 // 4. 왕관 [★권위E]
 const w = await p.evaluate(()=>{ const W=world, k=W.units.find(u=>u.cz), a=W.units.find(u=>u.name==='탕아'); a.modBody=true; const f1=mbF(W,a,'dmg'), p1=mbF(W,a,'pin'), ck=crownOn(k); const g=k.gear['머리']; delete k.gear['머리']; const f0=mbF(W,a,'dmg'); k.gear['머리']=g; a.modBody=false;
   k.seenBy=true; k.engaged=true; const H=unitDetailHtml(W,k); return { f1:+f1.toFixed(3), p1:+p1.toFixed(3), f0, ck, det: /\[★권위E\]/.test(H)&&/신성 상대/.test(H)&&/\[버팀\]/.test(H) }; });
 console.log('    권위E', JSON.stringify(w)); ok(w.ck&&w.f1===0.745&&w.p1===0.575&&w.f0===0.7,'왕관을 쓴 세자르가 있으면 신성 효과 15% 약화 (피해 ×0.7 → ×0.745 · 움찔 ×0.5 → ×0.575) · 벗으면 그대로'); ok(w.det,'상세 칸 — [★권위E] · [버팀]');
 // 5. 실제 재생: 세자르와 몇 초 — 오류 없음
 const run = await p.evaluate(()=>{ const W=world; let err=null; mode='run'; paused=false; try { for (let i=0;i<300&&!W.over;i++){ stepWorld(W,1/30); if (i%10===0) draw(); } } catch(e){ err=e.message; } paused=true; mode='plan'; return { err }; });
 ok(!run.err,'실제 재생 10초 — 오류 없음 '+(run.err||''));
 const ds = await p.evaluate(()=>{ const t=designByKey('탕아'), m=designByKey('모닝스타'); return /공중제비로/.test(t.note)&&/깊이 겹친 동료도/.test(m.note)&&/중거리/.test(m.note); }); ok(ds,'설명 글 — 탕아 · 모닝스타');
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3))); await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7290 OK'); await b.close(); })();
