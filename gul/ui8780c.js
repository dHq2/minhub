// v8.7.8 UI 시험 (3) — ui8780c.js v1.1 (v1.1: 아이콘 판은 인물이 늘면 아래로 자람 — 10 줄 이상 · 384 × (줄 × 48) 이면 됨 · 근성 시험의 상대는 보스 (체력 99999 — 누운 적 짓밟기 확인사살로 상대가 먼저 쓰러지면 싸움이 끝나 근성이 살아남던 것 · 12판에 2판) · 잡아뚫기 · 초돌진 시험의 상대는 발이 묶임 (예고를 보고 발놀림 · 옆걸음으로 비켜 손이 닿지 않거나 돌진이 빗나가던 것 · 40판에 8판 — 게임은 그대로가 맞음) · v1.0: 어퐁 (설계 · 도감 정체성 · 뽑기 4성 · 기술 칸 1 초돌진 → 적을 탭 · 2 앞차기 · 초돌진 길 그림 · 동작 이름) · 카리우스 (3D 기술 다섯 + [근성] [불경자] — 설계 · 정체성 · 옛 저장 ·
//   기술 칸 1 잡아뚫기 (광대의 팔 그림) · 2 노인의 팔 (부채꼴 예고) · 근성 (발버둥 → 포효 → 마지막 7초 → 쓰러짐 — 그림 · 상세 · 죽음 글) · 불경자 그림) · 기록 · 서술 (빈 값 없음) · 아이콘 판 8 × 10)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const dir = process.argv[2]||'build', url='file://'+process.cwd()+'/'+dir+'/wrapped.html';
 const TALKEND = "{ let g=0; while (TK && g++<200){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); } }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1200);
 const AP_TR=['지휘B','갑피','베테랑','근력A','사격A','전투센스'], AP_ACT=['초돌진','앞차기','돌진'], KA_ACT=['돌진','잡아뚫기','노인의 팔','라이트 훅','딥 킥','짓밟기'], NEW=['초돌진','앞차기','잡아뚫기','노인의 팔','라이트 훅','짓밟기','노인의 팔 철퇴','돌진 몸박'];
 // 0) 설계 · 정체성 · 글 · 그림 칸 · 희귀도
 const v0 = await p.evaluate(({AP_TR,AP_ACT,KA_ACT,NEW})=>{ const d=designByKey('어퐁'), P=PROFILE['C-103']||{}, I=identityOf('C-103')||{}, k=designByKey('카리우스'), KP=PROFILE['C-003']||{}, KI=identityOf('C-003')||{};
   const pool=DESIGN_DEFAULTS.filter(x=>x.side===0&&!CAMP_FIX.includes(x.key)&&!CAMP_NO.includes(x.key)).map(x=>x.key), has=(L,X)=>X.every(t=>(L||[]).includes(t));
   return { d: d && { ref: d.ref, w: d.weapon, sh: d.shield, sn: d.sName, hp: d.ov&&d.ov.hp, atk: d.ov&&d.ov.atk, sz: d.sizeCls, h: d.height, tr: has(d.traits,AP_TR), a: (d.active||[]).join(',') },
     prof: P.weapon==='어퐁의 철퇴'&&has(P.traits,AP_TR)&&(P.active||[]).join(',')===AP_ACT.join(',')&&P.sName==='버클러', id: has(I.traits,AP_TR)&&has(I.active,AP_ACT),
     kar: has(k.traits,['근성','불경자'])&&(k.active||[]).join(',')===KA_ACT.join(',')&&has(KP.traits,['근성','불경자'])&&(KP.active||[]).join(',')===KA_ACT.join(',')&&has(KI.traits,['근성','불경자'])&&has(KI.active,KA_ACT),
     noAct: NEW.filter(x=>!ACTIVE[x]), noTr: ['근성','불경자'].filter(x=>!TRAITS[x]), noIco: [...NEW,'근성','불경자','딥 킥'].filter(x=>ICO.map[x]==null), ico: NEW.map(x=>ICO.map[x]).join(','), rows: ICO.rows, img: [icoImg.naturalWidth, icoImg.naturalHeight].join('x'),
     ic: ['asup','akick','kgrab','ksw','khook','kstomp','kslam','krush'].every(x=>SPEC_IC[x]), tgt: ['asup','akick','kgrab','ksw','khook','kstomp','kick'].every(x=>SPEC_TGT[x]), dk: !!DK_TXT.grit&&!!DIE_N.grit, rage: (UNIQUE['개조된 신체'].effects||[]).some(s=>/벼락/.test(s)),
     kick: /카리우스/.test(ACTIVE['딥 킥']||''), rar: RAR_W(d), camp: pool.includes('어퐁') }; }, {AP_TR,AP_ACT,KA_ACT,NEW});
 console.log('    ', JSON.stringify(v0));
 ok(v0.d&&v0.d.ref==='C-103'&&v0.d.w==='어퐁의 철퇴'&&v0.d.sh===true&&v0.d.sn==='버클러'&&v0.d.hp===360&&v0.d.atk===50&&v0.d.sz==='대형'&&v0.d.h===2.4&&v0.d.tr&&v0.d.a===AP_ACT.join(','),'어퐁 설계: 철퇴 + 버클러 · 2.4M 대형 · 체력 360 · 공격 50 · 특성 여섯 · 초돌진 · 앞차기 · 돌진');
 ok(v0.prof&&v0.id,'어퐁 도감 프로필 · 정체성 (C-103) 이 설계와 같음');
 ok(v0.kar,'카리우스 설계 · 프로필 · 정체성: [근성] [불경자] · 기술 '+KA_ACT.join(' · '));
 ok(!v0.noAct.length&&!v0.noTr.length&&v0.kick&&v0.rage&&v0.dk,'기술 글 여덟 · [근성] [불경자] 글 · 딥 킥에 카리우스 · ◆개조된 신체에 벼락 · 죽음 글 (근성이 다함)');
 ok(!v0.noIco.length&&v0.rows>=10&&v0.img==='384x'+v0.rows*48&&v0.ico==='50,51,52,53,54,55,58,59'&&v0.ic&&v0.tgt,'아이콘 판 8 × 10 ('+v0.img+' · 새 그림 '+v0.ico+') · 기술 칸 그림 · 겨눌 곳 글');
 ok(v0.rar===0.6&&v0.camp,'뽑기 희귀도 4성 0.6 · 여정 뽑기 풀에 어퐁');
 await p.evaluate(TALKEND);
 await p.evaluate(()=>{ window.__mk = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...fromDesign(designByKey(k),s), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].order=null; W.units[i].stay=null; }); return W; };
   window.__lit = (W) => { W.amb = 1; computeLight(W); markExplored(W); for (const u of W.units) if (u.side===1) u.seenBy = 1; return W; };
   window.__draw = () => { const seen=[]; const P=CanvasRenderingContext2D.prototype, F=P.fillText; P.fillText=function(t,x,y,m){ seen.push(String(t)); return F.call(this,t,x,y,m); }; let err=''; try { draw(); } catch(er){ err=er.message; } finally { P.fillText=F; } return { seen, err }; };
   const t=document.getElementById('talk'); if (t) t.hidden=true; });
 // 1) 어퐁: 기술 칸 1 초돌진 → 적을 탭 → 초돌진 (길 그림 · 동작 이름)
 const a1 = await p.evaluate(()=>{ const W=__lit(__mk([['어퐁',0,6,10],['검기사',1,15,10]])); const a=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.hp=e.max=9999; e.spd=0.001; for (const x of a.spec) x.cdT=-9; cam.x=a.x+4; cam.y=a.y; cam.z=1.2; cam.follow=false;
   const s1=specAt(a,'spec1').k, s2=specAt(a,'spec2').k; sel=new Set([0]); useSlot(6); const arm=armed&&[armed.k,armed.s].join(':'); touchTap({x:e.x,y:e.y}); const o=a.order||(a.ordPend&&a.ordPend.o);
   const n0=W.log.length; let lab='', dr=null; for (let i=0;i<120;i++){ stepWorld(W,0.025); if (a.act&&a.act.sup&&!dr){ lab=actLabel(W,a,liveAct(W,a)); dr=__draw(); } if (W.log.slice(n0).some(l=>l.k==='impact')) break; }
   const C=W.log.slice(n0).find(l=>l.k==='charge'); return { s1, s2, arm, o: o&&[o.k,o.s,o.b], ch: C&&C.name, lab, path: !!(dr&&dr.seen.includes('🐂 초돌진')), err: dr&&dr.err, imp: W.log.slice(n0).some(l=>l.k==='impact'&&l.b===e.i), row: apRow(W,a) }; });
 console.log('    초돌진', JSON.stringify(a1));
 ok(a1.s1==='asup'&&a1.s2==='akick'&&a1.arm==='spec:asup'&&a1.o&&a1.o[0]==='spec'&&a1.o[1]==='asup'&&a1.o[2]===1,'기술 칸 1 = 초돌진 · 2 = 앞차기 — 칸 1 → 적을 탭 → 초돌진 명령');
 ok(a1.ch==='초돌진'&&/초돌진/.test(a1.lab)&&a1.path&&!a1.err&&a1.imp,'초돌진: 기록 이름 · 동작 이름 "'+a1.lab+'" · 길 그림 · 노린 적에 충돌');
 ok(/5칸 넘게/.test(a1.row)&&/버클러/.test(a1.row),'상세 "초돌진" 줄: '+a1.row);
 const a2 = await p.evaluate(()=>{ const W=__lit(__mk([['어퐁',0,10,10],['검기사',1,12,10]])); const a=W.units[0], e=W.units[1]; e.order={k:'hold'}; for (const x of a.spec) x.cdT=-9; sel=new Set([0]); useSlot(6); touchTap({x:e.x,y:e.y});
   const n0=W.log.length; for (let i=0;i<20;i++) stepWorld(W,0.025); const F=W.log.slice(n0).find(l=>l.k==='specFail'); return { f: F&&F.why, o: a.order&&a.order.k, nar: F ? (narrOf(W,F)||{}).s : '' }; });
 ok(a2.f&&/5칸/.test(a2.f)&&a2.o==='attack'&&a2.nar,'가까운 적에게 초돌진 명령 → "'+a2.nar+'" · 그 적을 침');
 // 2) 카리우스: 기술 칸 1 잡아뚫기 → 적을 탭 → 광대의 팔 (그림) → 꿰뚫기
 const k1 = await p.evaluate(()=>{ const W=__lit(__mk([['카리우스',0,10,10],['검기사',1,11.7,10]])); const k=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.hp=e.max=9999; e.spd=0.001; for (const x of k.spec) x.cdT=-9; cam.x=k.x; cam.y=k.y; cam.z=1.4; cam.follow=false;
   const s1=specAt(k,'spec1').k, s2=specAt(k,'spec2').k; sel=new Set([0]); useSlot(6); const arm=armed&&[armed.k,armed.s].join(':'); touchTap({x:e.x,y:e.y});
   const n0=W.log.length; let lab='', dr=null; for (let i=0;i<120;i++){ stepWorld(W,0.025); if (k.act&&k.act.s==='kgrab'&&k.act.phase==='pull'&&!dr){ lab=actLabel(W,k,liveAct(W,k)); dr=__draw(); } if (W.log.slice(n0).some(l=>l.k==='karPierce')) break; }
   return { s1, s2, arm, grab: W.log.slice(n0).some(l=>l.k==='karGrab'), pierce: W.log.slice(n0).some(l=>l.k==='karPierce'), lab, arm2: !!(dr&&dr.seen.includes('🤡 광대의 팔 — 끌려옴')), err: dr&&dr.err }; });
 console.log('    잡아뚫기', JSON.stringify(k1));
 ok(k1.s1==='kgrab'&&k1.s2==='ksw'&&k1.arm==='spec:kgrab','기술 칸 1 = 잡아뚫기 · 2 = 노인의 팔');
 ok(k1.grab&&k1.pierce&&/끌어오는 중/.test(k1.lab)&&k1.arm2&&!k1.err,'광대의 팔로 끌어와 꿰뚫음 — 동작 이름 "'+k1.lab+'" · 끌려오는 몸에 광대의 팔 그림');
 // 3) 노인의 팔 예고 (부채꼴) · 이름
 const k2 = await p.evaluate(()=>{ const W=world, k=W.units[0], e=W.units[1]; k.act=null; for (const x of k.spec) x.cdT=-9; e.x=11.6; e.y=10; startSpec(W,k,e,'ksw','시험'); const dr=__draw(); const lab=actLabel(W,k,liveAct(W,k)); return { err: dr.err, nm: dr.seen.some(s=>/노인의 팔/.test(s)), lab }; });
 ok(!k2.err&&k2.nm&&/노인의 팔/.test(k2.lab),'노인의 팔 예고 (부채꼴 · 이름) · 동작 이름 "'+k2.lab+'"');
 // 4) 근성 — 발버둥 · 포효 · 마지막 7초 (그림 · 상세) → 쓰러짐 (죽음 글)
 const g1 = await p.evaluate(()=>{ const W=world, k=W.units[0], e=W.units[1]; k.act=null; e.order={k:'hold'}; e.hp=e.max=99999; if (!e.traits.includes('보스')) e.traits.push('보스'); applyDmg(W,e,k,k.hp+200,{tag:'시험'}); const d0=__draw(), r0=karRow(W,k);
   for (let i=0;i<160&&!(k.ls&&k.ls.ph==='last');i++) stepWorld(W,0.025); const d1=__draw(), r1=karRow(W,k), her=!!k.heretic;
   const n0=W.log.length; for (let i=0;i<400&&k.alive;i++) stepWorld(W,0.025); const D=W.log.slice(n0).find(l=>l.k==='die'&&l.b===k.i), N=D?narrOf(W,D):null;
   return { ag: d0.seen.some(s=>/발버둥/.test(s)), r0, last: d1.seen.some(s=>/🔥 근성 \d+초/.test(s)), r1, her, dead: !k.alive, dk: k.deathKind, dline: D ? logLines(W, W.log.indexOf(D)).find(s=>/쓰러짐/.test(s)) : '', nar: N&&N.s, err: d0.err||d1.err }; });
 console.log('    근성', JSON.stringify(g1));
 ok(g1.ag&&/발버둥/.test(g1.r0)&&!g1.err,'숨이 끊길 피해 → 발버둥 (그림 · 상세 "'+g1.r0+'")');
 ok(g1.last&&/마지막/.test(g1.r1)&&g1.her,'마지막 7초 (그림 🔥 근성 n초 · 상세) · 불경자도 켜짐');
 ok(g1.dead&&g1.dk==='grit'&&/근성이 다함/.test(g1.dline||'')&&/고개를 떨군다/.test(g1.nar||''),'7초 뒤 쓰러짐 — 기록 "'+g1.dline+'" · 서술 "'+g1.nar+'"');
 // 5) 불경자 그림 · 상세
 const h1 = await p.evaluate(()=>{ const W=__lit(__mk([['카리우스',0,10,10],['검기사',1,16,10]])); const k=W.units[0]; W.units[1].order={k:'hold'}; k.hp=k.max*0.1; stepWorld(W,0.05); const d=__draw(); return { on: !!k.heretic, pic: d.seen.includes('불경자'), row: karRow(W,k), err: d.err }; });
 ok(h1.on&&h1.pic&&/불경자 \(공격/.test(h1.row)&&!h1.err,'불경자: 그림 (새까만 얼굴 · 빛나는 안경 · 이름) · 상세 "'+h1.row+'"');
 // 6) 기록 · 서술 글 (빈 값 없음)
 const t1 = await p.evaluate(()=>{ const W=world, k=W.units[0], e=W.units[1], t=W.t, a=k.i, b2=e.i, n0=W.log.length;
   const E=[{k:'apSup',a,b:b2,d:7.5,why:'멀리 떨어진 적에게 초돌진'},{k:'apSweep',a,b:b2,down:true},{k:'apSweep',a,b:b2,down:false},{k:'akick',a,b:b2,block:false},{k:'akick',a,b:b2,block:true},{k:'karGrab',a,b:b2,air:false},{k:'karGrab',a,b:b2,air:true},{k:'karPierce',a,b:b2,crit:true},
     {k:'karLet',a,b:b2},{k:'karSwat',a,n:2},{k:'karHook',a,n:3,hit:1},{k:'karSlam',a,n:1},{k:'karRush',a,b:b2},{k:'karHeretic',a,on:true},{k:'karHeretic',a,on:false},{k:'karGrit',a:b2,b:a,ph:'agony',sec:3},{k:'karGrit',a,b:a,ph:'roar'},{k:'karGrit',a,b:a,ph:'last',sec:7},
     {k:'karGrit',a,b:a,ph:'end'},{k:'karGrit',a,b:a,ph:'over',hp:35},{k:'karRage',a,sec:6},{k:'karRage',a,off:true},{k:'specFail',a,s:'asup',why:'5칸 안 — 초돌진은 멀리 떨어진 적에게만'}];
   for (const x of E) W.log.push({ t, vis: true, ...x });
   const lines=logLines(W, n0).filter(s=>/🐂|🦵|🤡|👴|🥊|🔨|🐗|🕶|🔥|⚡|불경자|차갑게/.test(s)); const nar=E.map(x=>{ try { return narrOf(W, { t, vis: true, ...x }); } catch(er){ return 'ERR '+er.message; } });
   return { lines, bad: lines.filter(s=>/undefined|NaN|\[object/.test(s)), nar: nar.filter(Boolean).map(x=>x.s||x), narBad: nar.filter(x=>x&&/undefined|NaN|ERR/.test(x.s||x)) }; });
 console.log('    로그', JSON.stringify(t1.lines.slice(0,24)));
 console.log('    서술', JSON.stringify(t1.nar));
 ok(t1.lines.length>=21&&!t1.bad.length,'로그 글 ('+t1.lines.length+'줄): 초돌진 · 휩쓸림 · 앞차기 · 광대의 팔 · 꿰뚫기 · 후려치기 · 훅 · 철퇴 · 몸박 · 불경자 · 근성 · 벼락 — 빈 값 없음');
 ok(t1.nar.length>=16&&!t1.narBad.length,'서술 글 ('+t1.nar.length+'줄) — 빈 값 없음');
 // 7) 옛 저장의 카리우스 · 뽑기로 들어온 어퐁 — 정체성이 채워짐
 const m1 = await p.evaluate(()=>{ const old={ ref:'C-003', name:'카리우스', side:0, tier:2, weapon:'맨손', traits:['거구','갑피','근력A','괴력A','머리 넷'], unique:['개조된 신체'], active:['돌진'], ov:{hp:700,atk:40} }; const ch=lockIdentity(old);
   const g=unitFromRef('C-103',0,{}); return { ch, tr: ['근성','불경자'].every(t=>old.traits.includes(t)), act: ['잡아뚫기','노인의 팔','라이트 훅','딥 킥','짓밟기'].every(a=>old.active.includes(a)), g: g && [g.weapon, g.sName, (g.active||[]).join(','), g.sizeCls].join(' | ') }; });
 console.log('    정체성', JSON.stringify(m1));
 ok(m1.ch&&m1.tr&&m1.act,'옛 저장의 카리우스 → [근성] [불경자] · 3D 기술 다섯이 채워짐');
 ok(/어퐁의 철퇴/.test(m1.g||'')&&/버클러/.test(m1.g||'')&&/초돌진/.test(m1.g||'')&&/대형/.test(m1.g||''),'뽑기로 들어온 어퐁 = 도감 프로필 그대로 ('+m1.g+')');
 ok(!errs.length,'페이지 오류 없음'+(errs.length?' — '+errs.slice(0,3).join(' / '):''));
 await b.close(); console.log(fails?`FAIL ${fails}`:'ALL ui8780c OK'); process.exit(fails?1:0); })();
