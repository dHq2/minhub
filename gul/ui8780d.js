// v8.7.8 UI 시험 (4) — ui8780d.js v1.3 (v1.3: ★ 은 그 판 그림을 그릴 때 실제로 그려 진 (보인) 몸일 때만 셈 — 보임은 틱마다 깜빡임 · v1.2: 별 표식 ★ 은 보이는 (안 숨은 · 산) 몸일 때만 셈 — 진형 버프가 꺼져 별이 뒤의 적에 박히는 일이 잦아짐 · v1.1: 정령 방벽 · 차원 문 명령이 닿지 않으면 다시 (게임 그대로 — 손짓은 놓칠 수 있음) · 편 지휘 (나달) 를 콜라이더 곁에 — 멀면 명령이 손짓으로 62% 만 닿아 시험이 흔들리던 것 · 차원 문은 콜라이더 곁의 빈 바닥을 탭 (다가간 콜라이더 자신을 탭하던 것) · 별 표식 상세는 박힌 때 · 박힌 몸으로 봄 (빗나가 뒤의 적에 박히기도) · 동료 자리를 비워 둔 채 합류 시험 (가득 차면 못 옴 — 게임 그대로) · v1.0: 물레 · 콜라이더 · 테헤라 — 설계 · 도감 프로필 · 정체성 · 글 · 아이콘 판 (61 ~ 79) · 뽑기에 없음 (여정 · 1층 · 저장된 도전자) ·
//   기술 칸 (정령 강림 바닥 · 정령 방벽 · 별빛 지목 · 차원 문 바닥 → 동료 = 문 앞으로 · 광역 손짓 · 은빛 비행 (바위는 안 됨) · 제자리 기술은 바로) · 땅의 정령은 고를 수 없음 · 동료 줄 🌿 ·
//   그림 (장판 · 문 · 방벽 · 장막 · 꿈 이름표 · 예고 · 걸린 것 — 오류 없음) · 상세 줄 · 역할 줄 (마력 치유) · 기록 · 서술 (빈 값 없음) · 대상 없는 빗나감 (기록이 멈추지 않음) ·
//   A13 — 네오의 문 보상 (대악마 하딤 → 콜라이더 · 사슴 → 물레) · 테헤라 세 번 청함 → 설계 그대로의 기술 · 인사 (bow) — 받아들이면 싸움 없이 · 거절하면 같은 무리와 싸움)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const dir = process.argv[2]||'build', url='file://'+process.cwd()+'/'+dir+'/wrapped.html';
 const TALKEND = "{ let g=0; while (TK && g++<200){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); } }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1200);
 const MU_ACT=['정령 강림','정령 방벽','땅의 정령','물 정령 탄'], CO_ACT=['별빛 지목','차원 문','마계 장막','유혹의 손짓'], TE_ACT=['광역 손짓','은빛 비행','날개 방패','나른한 꿈'];
 // 0) 설계 · 프로필 · 정체성 · 글 · 아이콘 · 뽑기
 const v0 = await p.evaluate(({MU_ACT,CO_ACT,TE_ACT})=>{ const same=(a,b)=>(a||[]).join(',')===b.join(','), has=(L,X)=>X.every(t=>(L||[]).includes(t));
   const chk=(key,ref,act,un,tr,w)=>{ const d=designByKey(key), P=PROFILE[ref]||{}, I=identityOf(ref)||{}, g=unitFromRef(ref,0,{}); return { d: !!d&&d.ref===ref&&d.weapon===w&&same(d.active,act)&&has(d.unique,[un])&&has(d.traits,tr)&&d.noDraw===true, p: P.weapon===w&&same(P.active,act)&&has(P.unique,[un]), i: has(I.active,act)&&has(I.unique,[un]), g: g.weapon===w&&same(g.active,act)&&has(g.unique,[un])&&has(g.traits,tr), sk: (d.skill||{}).name||'', gsk: (g.skill||{}).name||'', hp: d.ov.hp }; };
   const NEW=[...MU_ACT,...CO_ACT,...TE_ACT];
   return { mu: chk('물레','C-174',MU_ACT,'정령 계약',[],'정령 지시'), co: chk('콜라이더','C-175',CO_ACT,'마계 대사',['갑피C','괴력C','속력B'],'갈퀴 꼬리'), te: chk('테헤라','C-016',TE_ACT,'요정 날개',['축복:테헤라'],'손짓'),
     noAct: NEW.filter(x=>!ACTIVE[x]), noUn: ['정령 계약','마계 대사','요정 날개'].filter(x=>!UNIQUE[x]||!(UNIQUE[x].effects||[]).length), noTr: TRAITS['축복:테헤라'] ? '' : '축복:테헤라',
     noIco: [...NEW,'정령 계약','마계 대사','요정 날개','축복:테헤라','정령의 손길','요정의 축복','갈퀴 꼬리'].filter(x=>ICO.map[x]==null), ico: [...NEW,'정령 계약','마계 대사','요정 날개','축복:테헤라','정령의 손길','요정의 축복','갈퀴 꼬리'].map(x=>ICO.map[x]).sort((a,b)=>a-b).join(','),
     rows: ICO.rows, img: [icoImg.naturalWidth, icoImg.naturalHeight].join('x'), ic: SUP_K.every(k=>SPEC_IC[k]), tgt: SUP_K.every(k=>SPEC_TGT[k]),
     rar: [RAR_STAR(designByKey('물레')), RAR_STAR(designByKey('콜라이더')), RAR_STAR(designByKey('테헤라'))].join(' '), reward: [BOSS8.neodemon.reward, BOSS8.neospirit.reward].join(','),
     race: ['대악마 하딤','하류','흑익','붉은암석','포자','사슴','요정'].map(k=>(FOE8[k]||{}).race||'-').join(' | ') }; }, {MU_ACT,CO_ACT,TE_ACT});
 console.log('    ', JSON.stringify(v0));
 for (const [k,nm,sk] of [['mu','물레','정령의 손길'],['co','콜라이더',''],['te','테헤라','요정의 축복']]){ const x=v0[k]; ok(x.d&&x.p&&x.i&&x.g&&x.sk===sk&&x.gsk===sk,`${nm}: 설계 · 도감 프로필 · 정체성 · 도감에서 바로 뽑아도 같음 (무기 · 기술 넷 · 고유${sk?' · '+sk:''}) · 체력 ${x.hp} · 뽑기에 없음 표시`); }
 ok(!v0.noAct.length&&!v0.noUn.length&&!v0.noTr,'기술 글 열둘 · 고유 셋 (정령 계약 · 마계 대사 · 요정 날개) · [축복:테헤라] 글'+(v0.noAct.length?' — 없음 '+v0.noAct:''));
 ok(!v0.noIco.length&&v0.ico==='61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79'&&v0.rows>=10&&v0.img==='384x'+v0.rows*48&&v0.ic&&v0.tgt,'아이콘 판 ('+v0.img+' · 새 그림 61 ~ 79) · 기술 칸 그림 · 겨눌 곳 글');
 ok(v0.rar==='★★★★★ ★★★★★ ★★★★★★★'&&v0.reward==='C-175,C-174','희귀도 (물레 5 · 콜라이더 5 · 테헤라 7) · 네오의 문 보상 (하딤 → 콜라이더 · 사슴 → 물레)');
 ok(/마족/.test(v0.race.split(' | ')[0])&&/마족/.test(v0.race.split(' | ')[1])&&/정령/.test(v0.race.split(' | ')[4])&&/요정/.test(v0.race.split(' | ')[6]),'적의 종족: '+v0.race);
 // 0b) 뽑기 풀 (여정 · 1층 · 저장된 도전자) 에 없음 — rarPick 에 넘어가는 풀을 엿봄
 const v1 = await p.evaluate(()=>{ const seen=[]; const R0=rarPick; window.rarPick = pool => { seen.push(pool.map(d=>d && (d.key||d.name))); return R0(pool); };
   const P=DESIGN_DEFAULTS.filter(x=>x.side===0&&!x.noDraw&&x.key!=='인주').map(x=>x.key); let saved=0, bad=0; for (let i=0;i<60;i++){ const d=foe8('@saved',3); if (/물레|콜라이더|테헤라/.test(d.name)) bad++; saved++; }
   setMode('story'); campStart({ direct: true }); window.rarPick = R0;
   const flat=seen.flat(); return { camp: flat.length, inCamp: flat.filter(k=>/물레|콜라이더|테헤라/.test(k||'')), pool: P.filter(k=>/물레|콜라이더|테헤라/.test(k)).length, saved, bad }; });
 ok(v1.camp>0&&!v1.inCamp.length&&!v1.pool&&!v1.bad,'뽑기에 없음 — 1층 뽑기 풀 ('+v1.camp+') · 여정 뽑기 풀 · 저장된 도전자 '+v1.saved+'번 모두');
 await p.evaluate(TALKEND);
 await p.evaluate(()=>{ window.__mk = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...fromDesign(designByKey(k),s), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].order=null; W.units[i].stay=null; }); return W; };
   window.__lit = (W) => { W.amb = 1; computeLight(W); markExplored(W); for (const u of W.units) if (u.side===1) u.seenBy = 1; return W; };
   window.__draw = () => { const seen=[]; const SM0=window.supMarks, drawnI=[]; window.supMarks=function(Wd,u,...r){ drawnI.push(u.i); return SM0.call(this,Wd,u,...r); }; const P=CanvasRenderingContext2D.prototype, F=P.fillText; P.fillText=function(t,x,y,m){ seen.push(String(t)); return F.call(this,t,x,y,m); }; let err=''; try { draw(); } catch(er){ err=er.message+' @ '+(er.stack||'').split('\n')[1]; } finally { P.fillText=F; window.supMarks=SM0; window.__drawnI=drawnI; } return { seen, err }; };
   window.__hold = W => { for (const u of W.units){ for (const x of u.spec||[]) x.cdT=1e9; if (u.skill) u.skill.cdT=1e9; } };
   window.__free = (u,k) => { const x=(u.spec||[]).find(s=>s.k===k); if (x) x.cdT=-9; };
   const t=document.getElementById('talk'); if (t) t.hidden=true; });
 // 1) 물레: 칸 1 정령 강림 → 바닥 → 장판 (그림 · 상세) · 칸 2 정령 방벽 → 적 쪽 → 방벽
 const m1 = await p.evaluate(()=>{ const W=__lit(__mk([['물레',0,10,10],['나달',0,12,9],['검기사',1,22,10]])); const m=W.units[0], a=W.units[1], e=W.units[2]; e.order={k:'hold'}; e.spd=0.001; a.order={k:'hold'}; __hold(W); __free(m,'mdesc'); __free(m,'mwall'); cam.x=m.x+3; cam.y=m.y; cam.z=1; cam.follow=false;
   const s1=specAt(m,'spec1').k, s2=specAt(m,'spec2').k; sel=new Set([0]); useSlot(6); const arm=armed&&[armed.k,armed.s].join(':'), tip=slotLabel(W,[m],6); touchTap({x:13,y:10}); const o=m.order||(m.ordPend&&m.ordPend.o);
   let lab='', warn=null; for (let i=0;i<80;i++){ stepWorld(W,0.025); if (m.act&&m.act.k==='spec'&&m.act.s==='mdesc'&&m.act.phase==='wind'&&!warn){ lab=actLabel(W,m,liveAct(W,m)); warn=__draw(); } if (sfOf(W,'desc',m.i)) break; }
   const F=sfOf(W,'desc',m.i); a.hp=a.max*0.5; stepWorld(W,0.05); const d1=__draw(), row=supRow(W,a), mrow=supRow(W,m), det=unitDetailHtml(W,m);
   let arm2='', cm=0; for (let tr=0; tr<3 && !sfOf(W,'wall',m.i); tr++){ const k0=W.log.length; sel=new Set([0]); useSlot(7); arm2=armed&&[armed.k,armed.s].join(':'); touchTap({x:e.x,y:e.y}); for (let i=0;i<80&&!sfOf(W,'wall',m.i);i++) stepWorld(W,0.025); cm+=W.log.slice(k0).filter(l=>l.k==='cmdMiss'&&l.a===m.i).length; }   /* 명령이 닿지 않으면 (cmdMiss — 게임 그대로) 다시 */
   const Wl=sfOf(W,'wall',m.i), d2=__draw();
   return { s1, s2, arm, tip, o: o&&[o.k,o.s,o.x!=null], lab, warn: !!(warn&&warn.seen.some(s=>/정령 강림/.test(s))), F: F&&[F.r, Math.round(F.x), Math.round(F.y)], fld: d1.seen.some(s=>/💧 정령 강림 \d+초/.test(s)), row, mrow, det: /겸: 치유 \(정령의 손길 — 마력\)/.test(det)&&/서포터/.test(det), arm2, cm, wall: !!Wl, wd: d2.seen.some(s=>/🌊 정령 방벽 \d+초/.test(s)), err: (warn||{}).err||d1.err||d2.err }; });
 console.log('    물레', JSON.stringify(m1));
 ok(m1.s1==='mdesc'&&m1.s2==='mwall'&&m1.arm==='spec:mdesc'&&/바닥을 탭/.test(m1.tip||'')&&m1.o&&m1.o[0]==='spec'&&m1.o[1]==='mdesc'&&m1.o[2],'기술 칸 1 = 정령 강림 · 2 = 정령 방벽 — 칸 1 → 바닥을 탭 → 그 자리 명령 ("'+m1.tip+'")');
 ok(m1.F&&m1.F[0]===8&&/정령 강림/.test(m1.lab)&&m1.warn&&m1.fld&&!m1.err,'정령 강림: 예고 (원 · 이름) · 동작 이름 "'+m1.lab+'" · 장판 (반지름 8) 그림 "💧 정령 강림 n초"');
 ok(/정령 강림 안/.test(m1.row)&&/정령 계약/.test(m1.mrow)&&/정령의 손길/.test(m1.mrow)&&m1.det,'상세: 동료 "'+m1.row+'" · 물레 "'+m1.mrow.slice(0,60)+'…" · 역할 줄 "치유 (정령의 손길 — 마력)"');
 ok(m1.arm2==='spec:mwall'&&m1.wall&&m1.wd,'정령 방벽: 칸 2 → 적 쪽을 탭 → 물 장막 (그림 "🌊 정령 방벽 n초")');
 // 2) 땅의 정령 (제자리 기술 — 바로) · 고를 수 없음 · 동료 줄 🌿 · 그림 (남은 때 고리 · 따르는 선)
 const m2 = await p.evaluate(()=>{ const W=world, m=W.units[0], a=W.units[1]; m.act=null; m.order=null; __free(m,'mspirit'); const sp=m.spec.find(x=>x.k==='mspirit'); m.spec=[sp,...m.spec.filter(x=>x!==sp)];
   sel=new Set([0]); let t=''; const T0=toast; window.toast=s=>{ t=s; T0(s); }; useSlot(6); const o=m.order||(m.ordPend&&m.ordPend.o), arm=armed; for (let i=0;i<80&&!W.units.some(x=>x.spiritOf===m.i);i++) stepWorld(W,0.025);
   const s0=W.units.find(x=>x.spiritOf===m.i); let pk='', selA=0; if (s0){ t=''; pickAlly(s0.i,false); pk=t; selA=sel.has(s0.i)?1:0; } window.toast=T0; for (let i=0;i<20;i++) stepWorld(W,0.05);
   hud(); const party=($('party')||{}).innerHTML||'', d=__draw(), row=s0?supRow(W,s0):'';
   return { o: o&&[o.k,o.s], arm: !!arm, spirit: !!s0, sum: s0&&s0.summon, pk: /땅의 정령은/.test(pk), selA, no: s0?allyNo(W,s0):-1, sel: selUnits(W).some(x=>x===s0), party: /🌿\d+초/.test(party)&&!/>땅의 정령</.test(party), pic: d.seen.includes('🌿'), row, err: d.err, inS: S.units.some(p0=>p0.summon==='spirit') }; });
 console.log('    땅의 정령', JSON.stringify(m2));
 ok(m2.o&&m2.o[1]==='mspirit'&&!m2.arm&&m2.spirit&&m2.sum==='spirit','땅의 정령: 칸을 누르면 겨눌 것 없이 바로 — 작은 정령 (소환)');
 ok(m2.pk&&!m2.selA&&m2.no===0&&!m2.sel&&m2.party&&m2.pic&&!m2.err,'땅의 정령은 고를 수 없음 (알림) · 번호 없음 · 동료 줄엔 물레 곁 🌿 남은 초 · 그림 🌿');
 ok(/땅의 정령 — \d+초 남음/.test(m2.row)&&m2.inS,'상세 "'+m2.row.slice(0,50)+'…" · 판의 배치에도 소환으로 (저장 때 빠짐)');
 // 3) 콜라이더: 칸 1 별빛 지목 → 적 · 칸 2 차원 문 → 바닥 → 열린 동안 동료를 탭 = 문 앞으로
 const c1 = await p.evaluate(()=>{ const W=__lit(__mk([['콜라이더',0,10,10],['나달',0,8,11.8],['검기사',1,19,10],['검기사',1,21,11]]));   /* 나달 (편 지휘) 이 곁에 — 명령이 목소리로 닿음 (멀면 손짓 62% — 게임 그대로) */ const c=W.units[0], a=W.units[1], e=W.units[2], e2=W.units[3]; e.order={k:'hold'}; e2.order={k:'hold'}; e.spd=e2.spd=0.001; a.order={k:'hold'}; __hold(W); __free(c,'cstar'); __free(c,'cgate'); cam.x=c.x+4; cam.y=c.y; cam.z=1; cam.follow=false;
   const s1=specAt(c,'spec1').k, s2=specAt(c,'spec2').k; sel=new Set([0]); useSlot(6); touchTap({x:e.x,y:e.y}); const o=c.order||(c.ordPend&&c.ordPend.o); const n0=W.log.length; let lab='', warn=null;
   for (let i=0;i<160;i++){ stepWorld(W,0.025); if (c.act&&c.act.s==='cstar'&&c.act.phase==='wind'&&!warn){ lab=actLabel(W,c,liveAct(W,c)); warn=__draw(); } if (W.log.slice(n0).some(l=>l.k==='starMark'||(l.k==='miss'&&l.a===c.i&&l.fired))) break; }
   const L=W.log.slice(n0), star=L.some(l=>l.k==='cstar'), SM=L.find(l=>l.k==='starMark'), mark=!!SM, d0=__draw(), erow=SM?supRow(W,W.units[SM.b]):'';   /* 빗나간 별이 뒤의 적에 박힐 수도 — 박힌 몸으로 봄 */
   c.act=null; let arm2='', og=null; const ng=W.log.length; for (let tr=0; tr<3 && !sfOf(W,'gate',c.i); tr++){ sel=new Set([0]); useSlot(7); arm2=armed&&[armed.k,armed.s].join(':'); const gp={x:c.x+2.5,y:c.y-2.5}; touchTap(gp); og=c.order||(c.ordPend&&c.ordPend.o)||og; for (let i=0;i<80&&!sfOf(W,'gate',c.i);i++) stepWorld(W,0.025); }   /* 명령이 닿지 않으면 다시 (게임 그대로) */ const glog=sfOf(W,'gate',c.i)?[]:W.log.slice(ng).filter(l=>l.a===c.i||l.b===c.i).slice(0,8).map(l=>JSON.stringify(l).slice(0,150)).concat([JSON.stringify({at:[c.x,c.y],act:c.act&&[c.act.k,c.act.s,c.act.phase],mood:c.mood,order:c.order,cd:(c.spec.find(x=>x.k==='cgate')||{}).cdT,t:W.t})]); const G=sfOf(W,'gate',c.i), d1=__draw();
   for (let i=0;i<6;i++) stepWorld(W,0.025); sel=new Set([0]); useSlot(7); const arm3=armed&&[armed.k,armed.s].join(':'); touchTap({x:a.x,y:a.y}); const o3=c.order||(c.ordPend&&c.ordPend.o); const n1=W.log.length;
   for (let i=0;i<80&&!W.log.slice(n1).some(l=>l.k==='gateTp');i++) stepWorld(W,0.025); const TP=W.log.slice(n1).find(l=>l.k==='gateTp');
   return { s1, s2, o: o&&[o.k,o.s,o.b], lab, warn: !!(warn&&warn.seen.some(s=>/별빛 지목/.test(s))), star, mark, starPic: d0.seen.includes('★'), markSeen: !!(SM && (window.__drawnI||[]).includes(SM.b)), erow, og: og&&[og.k,og.s,og.x!=null], glog, arm2, gate: !!G, gpic: d1.seen.some(s=>/🕳 차원 문 \d+초/.test(s)), arm3, o3: o3&&[o3.k,o3.s,o3.b], tp: TP&&TP.b, d: G?Math.hypot(a.x-G.x,a.y-G.y):-1, crow: supRow(W,c), err: (warn||{}).err||d0.err||d1.err }; });
 console.log('    콜라이더', JSON.stringify(c1));
 ok(c1.s1==='cstar'&&c1.s2==='cgate'&&c1.o&&c1.o[1]==='cstar'&&c1.o[2]===2&&/별빛 지목/.test(c1.lab)&&c1.warn&&c1.star,'기술 칸 1 = 별빛 지목 → 적을 탭 → 예고 (점선 · 이름) · 동작 이름 "'+c1.lab+'" · 쏨');
 ok(!c1.mark||((c1.starPic||!c1.markSeen)&&/별 표식/.test(c1.erow)),'별 표식이 박히면 (보이는 몸이면) 그림 ★ · 상세 "'+c1.erow+'"'+(c1.mark?'':' (이번엔 빗나감)'));
 ok(c1.arm2==='spec:cgate'&&c1.gate&&c1.gpic&&!c1.err,'칸 2 차원 문 → 바닥을 탭 → 문이 열림 (그림 "🕳 차원 문 n초")');
 ok(c1.arm3==='spec:cgate'&&c1.o3&&c1.o3[2]===1&&c1.tp===1&&c1.d<2.5&&/마계 대사/.test(c1.crow),'열린 동안 칸 2 → 동료를 탭 → 문 앞으로 ('+(c1.d||0).toFixed(1)+'칸) · 상세 "'+c1.crow.slice(0,40)+'…"');
 // 4) 테헤라: 칸 1 광역 손짓 → 적 · 칸 2 은빛 비행 → 바닥 (바위는 안 됨) · 날개 방패 · 나른한 꿈 (제자리 — 바로)
 const t1 = await p.evaluate(()=>{ const W=__lit(__mk([['테헤라',0,10,10],['검기사',1,15,9.5],['검기사',1,15,10.8]])); const t=W.units[0], e=W.units[1], e2=W.units[2]; e.order={k:'hold'}; e2.order={k:'hold'}; e.spd=e2.spd=0.001; e.hp=e.max=e2.hp=e2.max=9999; __hold(W); __free(t,'tsweep'); __free(t,'tflight'); cam.x=t.x+3; cam.y=t.y; cam.z=1; cam.follow=false;
   const s1=specAt(t,'spec1').k, s2=specAt(t,'spec2').k; sel=new Set([0]); useSlot(6); touchTap({x:e.x,y:e.y}); const n0=W.log.length; let lab='', warn=null;
   for (let i=0;i<80;i++){ stepWorld(W,0.025); if (t.act&&t.act.s==='tsweep'&&t.act.phase==='wind'&&!warn){ lab=actLabel(W,t,liveAct(W,t)); warn=__draw(); } if (W.log.slice(n0).some(l=>l.k==='tsweep')) break; }
   const SW=W.log.slice(n0).find(l=>l.k==='tsweep'), dfx=__draw();
   t.act=null; let tt=''; const T0=toast; window.toast=s=>{ tt=s; T0(s); }; const rk=(()=>{ for (let y=1;y<W.map.H-1;y++) for (let x=1;x<W.map.W-1;x++) if (rock(W.map,x+0.5,y+0.5)) return {x:x+0.5,y:y+0.5}; return null; })();
   sel=new Set([0]); useSlot(7); let rockMsg=''; if (rk){ touchTap(rk); rockMsg=tt; } const armKeep=armed&&armed.s; touchTap({x:6,y:13}); window.toast=T0; const o2=t.order||(t.ordPend&&t.ordPend.o); const n1=W.log.length; let flab='', fd=null;
   for (let i=0;i<80;i++){ stepWorld(W,0.025); if (t.act&&t.act.k==='tfly'&&!fd){ flab=actLabel(W,t,liveAct(W,t)); fd=__draw(); } if (W.log.slice(n1).some(l=>l.k==='tland')) break; }
   const land=W.log.slice(n1).some(l=>l.k==='tland'), at=[+t.x.toFixed(1),+t.y.toFixed(1)];
   __free(t,'twing'); __free(t,'tdream'); const tw=t.spec.find(x=>x.k==='twing'); t.spec=[tw,...t.spec.filter(x=>x!==tw)]; t.act=null; sel=new Set([0]); useSlot(6); for (let i=0;i<20&&!(t.act&&t.act.k==='twing');i++) stepWorld(W,0.025); const wing=t.act&&t.act.k==='twing', wlab=wing?actLabel(W,t,liveAct(W,t)):'', dw=__draw(), wrow=supRow(W,t);
   return { s1, s2, lab, warn: !!(warn&&warn.seen.some(s=>/광역 손짓/.test(s))), sw: SW&&[SW.hit.length, SW.down], rock: !!rk, rockMsg, armKeep, o2: o2&&[o2.k,o2.s,o2.x!=null], land, at, flab, wing, wlab, wrow, err: (warn||{}).err||dfx.err||(fd||{}).err||dw.err }; });
 console.log('    테헤라', JSON.stringify(t1));
 ok(t1.s1==='tsweep'&&t1.s2==='tflight'&&/광역 손짓/.test(t1.lab)&&t1.warn&&t1.sw&&t1.sw[0]>=2,'기술 칸 1 = 광역 손짓 → 적을 탭 → 예고 (90° 부채꼴) · "'+t1.lab+'" · '+(t1.sw||[])[0]+'명 쓸림 · '+(t1.sw||[])[1]+'명 넘어짐');
 ok((!t1.rock||(/바위 위로는/.test(t1.rockMsg)&&t1.armKeep==='tflight'))&&t1.o2&&t1.o2[1]==='tflight'&&t1.o2[2]&&t1.land&&/은빛 비행/.test(t1.flab),'칸 2 은빛 비행 → '+(t1.rock?'바위는 "바위 위로는…" (겨눔 그대로) → ':'')+'바닥을 탭 → 날아감 "'+t1.flab+'" → 내려앉음 '+t1.at);
 ok(t1.wing&&/날개 방패/.test(t1.wlab)&&/날개 방패/.test(t1.wrow)&&/요정 날개/.test(t1.wrow)&&!t1.err,'날개 방패: 칸을 누르면 바로 — "'+t1.wlab+'" · 상세 · 그림 오류 없음');
 // 5) 그림 — 장판 다섯 · 걸린 것 모두 · 적의 것 (보일 때) · 오류 없음
 const g1 = await p.evaluate(()=>{ const W=__lit(__mk([['물레',0,8,10],['콜라이더',0,10,12],['테헤라',0,9,8],['검기사',1,16,10],['검기사',1,17,12]])); const [m,c,t,e,e2]=W.units; e.order={k:'hold'}; e2.order={k:'hold'}; __hold(W); cam.x=12; cam.y=10; cam.z=1; cam.follow=false;
   const now=W.t; W.sup8=true; W.sf8=[{k:'desc',by:0,side:0,x:8,y:10,r:8,t0:now,until:now+6,heal:0.03},{k:'dream',by:2,side:0,x:9,y:8,r:6,t0:now,until:now+5,heal:0.01},{k:'veil',by:1,side:0,x:10,y:12,r:6,t0:now,until:now+5,stun:0.5,in:{},hit:{}},{k:'gate',by:1,side:0,x:14,y:12,r:4,t0:now,until:now+8,tick:now+1,gap:1,pull:1.5,eat:0.9,tpd:false,blkT:-9,cd0:now+12},{k:'wall',by:0,side:0,x:11,y:10,ux:0,uy:1,nx:1,ny:0,h:2,push:2,t0:now,until:now+4,pushed:{},blkT:-9}];
   e.star8={side:0,by:1,until:now+6,k:1.2}; e.vineT=now+0.8; e.charm={by:1,until:now+2}; e.slow8={k:0.2,until:now+1}; e.descSlowT=now+0.25; e.dreamT=now+0.25; e.blindT8=now+1; m.descT=now+0.25; m.veilT=now+0.25; m.blessT=now+0.25; m.fairyGT=now+4; m.fairyGK=0.85; m.hotB8={k:0.02,until:now+4,by:0}; t.act={k:'tdream',t0:now,end:now+5};
   const d=__draw(), lab=actLabel(W,t,liveAct(W,t)), er=supRow(W,e), mr=supRow(W,m);
   e.side=1; W.sf8.push({k:'gate',by:3,side:1,x:18,y:9,r:4,t0:now,until:now+8,tick:now+1,gap:1,pull:1.5,eat:0.9,tpd:false,blkT:-9,cd0:now+12}); e.seenBy=1; const d2=__draw();
   return { names: ['💧 정령 강림','💤 나른한 꿈','🦇 마계 장막','🕳 차원 문','🌊 정령 방벽'].filter(n=>d.seen.some(s=>s.startsWith(n))).length, marks: ['★','♥','✷','z','+'].filter(x=>d.seen.includes(x)).length, lab, er, mr, foeGate: d2.seen.filter(s=>/🕳 차원 문/.test(s)).length, err: d.err||d2.err }; });
 console.log('    그림', JSON.stringify(g1));
 ok(g1.names===5&&g1.marks>=4&&/나른한 꿈/.test(g1.lab)&&!g1.err,'장판 · 문 · 방벽 · 장막 · 꿈 그림 (이름표 다섯) · 걸린 것 그림 ('+g1.marks+') · "'+g1.lab+'" — 오류 없음');
 ok(/별 표식/.test(g1.er)&&/매혹/.test(g1.er)&&/눈멂/.test(g1.er)&&/정령 강림 안/.test(g1.mr)&&/요정의 축복/.test(g1.mr)&&/정령의 손길/.test(g1.mr)&&g1.foeGate===2,'상세 "걸린 것": 적 "'+g1.er.slice(0,50)+'…" · 동료 "'+g1.mr.slice(0,50)+'…" · 보이는 적의 문도 그림');
 // 6) 기록 · 서술 (빈 값 없음) · 대상 없는 빗나감
 const l1 = await p.evaluate(()=>{ const W=world, t=W.t, n0=W.log.length; const [m,c,te,e]=W.units, a=m.i, b2=e.i;
   const E=[{k:'pact',side:0,n:4},{k:'mdesc',a,n:3,m:2},{k:'mwall',a},{k:'wallBlock',a,b:b2,jav:false},{k:'wallPush',a,b:b2},{k:'mspirit',a,b:b2},{k:'spiritHeal',a,b:c.i,amt:16},{k:'spiritGone',a,why:'시간이 다함'},{k:'mvolley',a,b:b2,n:3},
     {k:'cgate',a:c.i,n:2},{k:'gatePull',a:c.i,n:2,heavy:1},{k:'gateEat',a:c.i,b:b2,jav:false},{k:'gateTp',a:c.i,b:a,d:6.2},{k:'gateClose',a:c.i,tp:true},{k:'cstar',a:c.i,b:b2},{k:'starMark',a:c.i,b:b2,vine:true},{k:'cveil',a:c.i,n:3},{k:'veilStun',a:c.i,b:b2},{k:'clure',a:c.i,b:b2,dur:3,demon:true},{k:'charmEnd',a:b2},{k:'colTail',a:b2,b:c.i},{k:'cwhip',a:c.i,n:2,hit:[b2]},{k:'cwhip',a:c.i,n:1,hit:[]},
     {k:'wingDodge',a:te.i,b:b2},{k:'fairyBless',a:te.i,n:3},{k:'tsweep',a:te.i,hit:[b2,c.i],down:1,ff:1},{k:'tflight',a:te.i,d:7.6},{k:'tland',a:te.i,n:2},{k:'twing',a:te.i},{k:'twingEnd',a:te.i,n:2},{k:'tdream',a:te.i,m:3},
     {k:'specFail',a:te.i,s:'tflight',why:'내려앉을 자리가 없음'},{k:'miss',a:c.i,b:b2,why:'앞 8칸 60° 안에 적이 없음',spec:'clure'},{k:'miss',a,why:'가방에 없음',inv:'use'},{k:'miss',a,why:'뿌리를 내릴 자리가 없음',spec:'root'}];
   for (const x of E) W.log.push({ t, vis: true, ...x });
   let lines=[], thrown=''; try { lines=logLines(W, n0); } catch(er){ thrown=er.message; }
   const nar=E.map(x=>{ try { return narrOf(W, { t, vis: true, ...x }); } catch(er){ return 'ERR '+er.message; } });
   return { thrown, n: lines.length, lines: lines.slice(0, 40), bad: lines.filter(s=>/undefined|NaN|\[object/.test(s)), nar: nar.filter(Boolean).map(x=>x.s||x), narBad: nar.filter(x=>x&&/undefined|NaN|ERR/.test(x.s||x)), inv: nar[nar.length-2] }; });
 console.log('    로그', JSON.stringify(l1.lines));
 console.log('    서술', JSON.stringify(l1.nar));
 ok(!l1.thrown&&l1.n>=34&&!l1.bad.length,'로그 글 ('+l1.n+'줄) — 정령 계약 · 강림 · 방벽 · 정령 · 탄 · 문 · 별 · 장막 · 유혹 · 꼬리 · 날개 · 축복 · 손짓 · 비행 · 꿈 · 대상 없는 빗나감까지 (멈추지 않음 · 빈 값 없음)');
 ok(l1.nar.length>=20&&!l1.narBad.length&&l1.inv==null,'서술 글 ('+l1.nar.length+'줄) — 빈 값 없음 · 가방 일은 서술하지 않음 ("공격이 빗나간다" 아님)');
 // 7) A13 — 여정: 네오의 문 보상 (콜라이더 · 물레) · 테헤라 세 번 · 인사 (bow)
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); });
 await p.evaluate(TALKEND); await wait(p,250); await p.waitForSelector('#r8dAll', { state: 'attached', timeout: 15000 }); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 const a13 = await p.evaluate((TE)=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; const kit=p0=>p0?[(p0.active||[]).join(','), (p0.unique||[]).join(','), (p0.skill||{}).name||'', p0.weapon, p0.nvG].join(' | '):'';
   R.party=R.party.filter(p0=>!['C-174','C-175','C-016'].includes(p0.ref)).slice(0,5); world=null;
   r8Recruit(BOSS8.neodemon.reward, '콜라이더 시험', null, true); eval(TE); r8Recruit(BOSS8.neospirit.reward, '물레 시험', null, true); eval(TE);
   R.flags.teh=0; for (let i=0;i<3;i++){ r8Act('tehera1'); eval(TE); }
   const col=R.party.find(p0=>p0.ref==='C-175'), mul=R.party.find(p0=>p0.ref==='C-174'), teh=R.party.find(p0=>p0.ref==='C-016'); return { col: kit(col), mul: kit(mul), teh: kit(teh), tries: R.flags.teh, n: R.party.length }; }, TALKEND);
 console.log('    A13', JSON.stringify(a13));
 ok(a13.col==='별빛 지목,차원 문,마계 장막,유혹의 손짓 | 마계 대사 |  | 갈퀴 꼬리 | A','대악마 하딤을 넘으면 콜라이더 — 설계 그대로 ('+a13.col+')');
 ok(a13.mul==='정령 강림,정령 방벽,땅의 정령,물 정령 탄 | 정령 계약 | 정령의 손길 | 정령 지시 | B','사슴을 넘으면 물레 — 설계 그대로 ('+a13.mul+')');
 ok(a13.teh==='광역 손짓,은빛 비행,날개 방패,나른한 꿈 | 요정 날개 | 요정의 축복 | 손짓 | B'&&a13.tries===3,'테헤라 — 세 번 청하면 합류 · 설계 그대로 ('+a13.teh+')');
 const bw = await p.evaluate((TE)=>{ const R=R8S(); const n=R.fm.rows[0][0]; n.t='fight'; n.ms='fight'; delete n.npc8; delete n.preKeys; n.empty=false; R.at=null; R.done=R.done.filter(x=>x!==n.id); delete R.flags['bow'+R.f]; world=null;
   n.preKeys=['하류','흑익','떠돌이 마족']; r8Enter(n); const L=(TK&&TK.lines||[]).find(x=>x.ask), asks=L?L.ask.map(x=>x[1]).join(','):''; if (L) talkPick('!r8:bowYes'); eval(TE);
   const passed=R.done.includes(n.id), noWorld=!world || !world.r8 || world.r8.node!==n.id, flag=!!R.flags['bow'+R.f];
   const n2=R.fm.rows[0][1]||R.fm.rows[1][0]; n2.t='fight'; n2.ms='fight'; delete n2.npc8; n2.empty=false; R.done=R.done.filter(x=>x!==n2.id); delete R.flags['bow'+R.f]; world=null; n2.preKeys=['하류','흑익']; R.at=null; r8Enter(n2); const L2=(TK&&TK.lines||[]).find(x=>x.ask); if (L2) talkPick('!r8:bowNo'); eval(TE);
   const foes=world?world.units.filter(u=>u.side===1).map(u=>u.name).sort().join(','):'';
   const n3=R.fm.rows[1][0]; n3.t='fight'; n3.ms='fight'; delete n3.npc8; n3.empty=false; world=null; delete R.flags['bow'+R.f]; n3.preKeys=['하류','검기사']; R.at=null; const before=!!TK; r8Enter(n3); const L3=(TK&&TK.lines||[]).find(x=>x&&x.ask&&x.ask.some(a=>/bow/.test(a[1]))); eval(TE);
   return { asks, passed, noWorld, flag, foes, mixed: !!L3 }; }, TALKEND);
 console.log('    인사', JSON.stringify(bw));
 ok(/bowYes/.test(bw.asks)&&/bowNo/.test(bw.asks)&&bw.passed&&bw.noWorld&&bw.flag,'인사 (콜라이더 · 마족만의 무리): 받아들이면 싸움 없이 지나감 · 층마다 한 번 표시');
 ok(/하류/.test(bw.foes)&&/흑익/.test(bw.foes)&&!bw.mixed,'거절하면 그 무리와 그대로 싸움 ('+bw.foes+') · 마족이 아닌 이가 섞인 무리엔 인사 없음');
 ok(!errs.length,'페이지 오류 없음'+(errs.length?' — '+errs.slice(0,3).join(' / '):''));
 await b.close(); console.log(fails?`FAIL ${fails}`:'ALL ui8780d OK'); process.exit(fails?1:0); })();
