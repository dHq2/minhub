// v8.7.6 인벤토리 v2 UI 시험 — ui8760.js v1.2 (v1.2: 나가기 전 전리품 창이 뜬 채 출구 단추를 한 번 더 누르면 창을 닫고 서둘러 나감 · 끼우기 단추 손가락 크기 · v1.1: 상세 칸을 누르고 있는 동안은 다시 그리지 않음 · 고정한 물건은 아군을 새로 고르면 풀림 · v1.0: 버전 · 상세 칸 정보 / 장비 · 가방 탭 (칸 넷 · 가방 칸 · 빈 칸 · 설명 · 지금 것과 비교 · 입기 · 두 번 누르면 바로 · 벗기 · 건네기 · 마시기 · 내려놓기 · 곁의 땅 줍기 · 방패 벗기 · I 키 · 적은 보기만) · 카리우스 무기 칸 (J10) · 판 위 이름표 (무구 — 누르면 누가 주울지 · 인물이 서 있으면 인물 먼저 · 안개 속은 없음) ·
//   여정 맵: 장면 인물 이름표 누르면 말 걸기 · 전리품 비교 · 끼우기 · 맵 위에선 판의 몸에 바로 (땅의 것은 사라짐) · 나가기 전 전리품 (J11) · 정산에 갑옷 · 방패 · 페흐토 (D1) · 기록 · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const dir = process.argv[2]||'build', url='file://'+process.cwd()+'/'+dir+'/wrapped.html';
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); }";
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ window.__mkF = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y,ex])=>({ ...(FOE8[k] && s===1 ? fromDesign(clone(FOE8[k]),1) : fromDesign(designByKey(k),s)), ...(ex||{}), x, y, id: uid() })); start(); paused = true; const W=world;
     list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].order=null; W.units[i].stay=null; }); W.amb = 1; computeLight(W); markExplored(W); for (const u of W.units){ if (u.side===1) u.order={k:'hold'}; else u.roe='hold'; } return W; };
   window.__run = (W, sec, f) => { const n = Math.round(sec / 0.05); for (let i=0;i<n && !W.over;i++){ stepWorld(W, 0.05); if (f && f()) break; } };
   window.__sel = (i) => { sel = new Set([i]); hoverPid = null; hoverItem = null; detItem = null; renderDetail(); };
   window.__ord = u => u.order || (u.ordPend && u.ordPend.o) || null; });
 // 1) 버전 · 수치표 · 단축키
 const d = await p.evaluate(()=>({ ver: document.querySelector('span.ver').textContent, mig: RULES_MIG, gt: rules.inv && rules.inv.gearT, give: rules.inv && rules.inv.giveR, kb: KB_GROUPS.flat(2).join(' ') }));
 ok(/v8\.7\.6/.test(d.ver)&&d.mig==='8.7.6','버전 8.7.6 · 수치표 이전 8.7.6');
 ok(d.gt&&d.gt.armor===4&&d.gt.helm===1.5&&d.give>0,'수치표 inv: 갑옷 4초 · 투구 1.5초 · 건네기 거리');
 ok(/장비 · 가방 탭/.test(d.kb),'단축키 표에 I (장비 · 가방 탭)');
 // 2) 상세 칸 탭 · 장비 탭 모양
 const s0 = await p.evaluate(()=>{ const W=__mkF([['인주',0,10,10,{bag:[{k:'armor',name:'기사의 판금 갑옷',mat:'판금',tier:3,dur:100},{k:'helm',name:'낡은 투구',mat:'투구',tier:2,dur:80},{k:'weapon',name:'장검',dur:90},{k:'potion',name:'회복약',heal:0.3},{k:'weapon',name:'검',dur:70}]}],['청광묵',0,12,10],['레베카',0,11,12],['검기사',1,50,10]]);
   const u=W.units[0]; detTab='info'; __sel(0); const T=$('det').querySelector('.dtabs'); return { tabs: !!T, tabTxt: T && T.textContent, bag: u.bag.map(x=>[x.uid,x.k,x.name]), gear: JSON.stringify(u.gear), cap: u.bagCap || bagCapOf(W,u), nodet: document.body.classList.contains('nodet') }; });
 console.log('    ', JSON.stringify(s0).slice(0, 400));
 ok(s0.tabs&&/정보/.test(s0.tabTxt)&&/장비 · 가방/.test(s0.tabTxt)&&new RegExp('5/'+s0.cap).test(s0.tabTxt),'상세 칸 탭: 정보 · 🎒 장비 · 가방 (5/'+s0.cap+')');
 await p.keyboard.press('i'); await p.waitForTimeout(80);
 const sI = await p.evaluate(()=>({ nodet: document.body.classList.contains('nodet'), t: detTab, eq: !!$('det').querySelector('.eqt'), vis: $('detail').getBoundingClientRect().width > 0 }));
 ok(s0.nodet&&!sI.nodet&&sI.t==='eq'&&sI.eq&&sI.vis,'좁은 PC (1280) 는 상세 패널이 접혀 있음 → I 를 누르면 펼치고 장비 · 가방 탭');
 await p.click('#det [data-dtab="info"]'); await p.waitForTimeout(60); await p.click('#det [data-dtab="eq"]'); await p.waitForTimeout(80);
 const s1 = await p.evaluate(()=>{ const q=s=>[...document.querySelectorAll('#det '+s)]; return { slots: q('[data-eqs]').map(e=>e.dataset.eqs+':'+e.textContent.trim()), cells: q('[data-eqb]').length, empty: q('.eqc.empty').length, sum: (q('.eqsum')[0]||{}).textContent||'', on: (q('.dtabs .on')[0]||{}).textContent||'', hint: (q('.eqinfo')[0]||{}).textContent||'' }; });
 console.log('    ', JSON.stringify(s1).slice(0, 500));
 ok(s1.slots.length===4&&/^weapon:무기/.test(s1.slots[0])&&/^shield:방패/.test(s1.slots[1])&&/^몸:몸/.test(s1.slots[2])&&/^머리:머리/.test(s1.slots[3]),'장비 칸 넷: 무기 · 방패 · 몸 · 머리');
 ok(s1.cells===5&&s1.empty===s0.cap-5,'가방 칸: 물건 5 · 빈 칸 '+s1.empty+' (가방 '+s0.cap+'칸 — 빈 칸도 보임)');
 ok(/가방 5\//.test(s1.sum)&&/걸음/.test(s1.sum)&&/장비 · 가방/.test(s1.on)&&/두 번 누르면/.test(s1.hint),'요약 줄 · 켜진 탭 · 안내 ('+s1.sum+')');
 const U = k => s0.bag.find(x=>x[1]===k||x[2]===k)[0], aU=U('armor'), hU=U('helm'), wU=U('장검'), pU=U('potion'), w2U=U('검');
 // 3) 갑옷: 고르면 설명 · 비교 → 입기 (명령 · 4초 · 걸음)
 await p.click(`#det [data-eqb="${aU}"]`); await p.waitForTimeout(80);
 const s2 = await p.evaluate(()=>{ const e=$('det').querySelector('.eqinfo'), b=$('det').querySelector('[data-eqa="wear"]'); return { info: e&&e.textContent, cmp: ($('det').querySelector('.eqcmp')||{}).textContent||'', wear: !!b&&!b.disabled, wt: b&&b.textContent, give: [...$('det').querySelectorAll('[data-eqgive]')].map(x=>x.textContent), on: !!$('det').querySelector('.eqc.on') }; });
 console.log('    ', JSON.stringify(s2).slice(0, 400));
 ok(s2.on&&/기사의 판금 갑옷/.test(s2.info)&&/판금 3성/.test(s2.info),'가방 칸을 누르면 고름 · 설명 (판금 3성 · 무게 · 베기)');
 ok(/▲ 등급/.test(s2.cmp)&&/▼ 걸음/.test(s2.cmp),'지금 것과 비교: '+s2.cmp);
 ok(s2.wear&&/4초/.test(s2.wt)&&s2.give.length>=2,'입기 단추 (4초 · 그동안 못 싸움) · 곁의 동료에게 건네기 '+s2.give.length);
 await p.click('#det [data-eqa="wear"]'); await p.waitForTimeout(60);
 const s3 = await p.evaluate(()=>{ const W=world, u=W.units[0], o=__ord(u), sp0=u.spd; paused=false; __run(W, 0.2); const act=u.act&&u.act.k; __run(W, 4.4); paused=true; hud(); renderDetail(); const s=$('det').querySelector('[data-eqs="몸"]');
   return { o: o&&[o.k,o.op,o.uid], act, g: u.gear['몸']&&[u.gear['몸'].name,u.gear['몸'].tier], sp0, sp1: u.spd, slot: s&&s.textContent, log: logLines(W,0).filter(l=>/입음/.test(l)) }; });
 console.log('    ', JSON.stringify(s3).slice(0, 400));
 ok(s3.o&&s3.o[0]==='inv'&&s3.o[1]==='wear'&&s3.o[2]===aU,'입기 → 명령 inv wear');
 ok(s3.act==='invAct'&&s3.g&&s3.g[0]==='기사의 판금 갑옷'&&s3.g[1]===3,'입는 동안 invAct → 몸에 판금 3성');
 ok(s3.sp1<s3.sp0&&/기사의 판금 갑옷/.test(s3.slot||''),'걸음 느려짐 ('+s3.sp0+' → '+s3.sp1+') · 몸 칸에 보임');
 ok(s3.log.length===1&&/🎒/.test(s3.log[0]),'기록: '+(s3.log[0]||''));
 // 4) 두 번 누르면 바로 (투구)
 await p.dblclick(`#det [data-eqb="${hU}"]`); await p.waitForTimeout(60);
 const s4 = await p.evaluate(()=>{ const W=world,u=W.units[0],o=__ord(u); paused=false; __run(W,2); paused=true; return { o: o&&[o.k,o.op], g: u.gear['머리']&&u.gear['머리'].name }; });
 ok(s4.o&&s4.o[0]==='inv'&&s4.o[1]==='wear'&&s4.g==='낡은 투구','두 번 누르면 바로 입기 → 머리에 낡은 투구');
 // 5) 몸 칸 → 벗기 (가방으로)
 await p.evaluate(()=>renderDetail()); await p.click('#det [data-eqs="몸"]'); await p.waitForTimeout(60);
 const s5a = await p.evaluate(()=>{ const b=$('det').querySelector('[data-eqa="off"]'); return { off: !!b&&!b.disabled, txt: b&&b.textContent, on: !!$('det').querySelector('.eqs.on') }; });
 ok(s5a.off&&s5a.on&&/벗기 \(4초/.test(s5a.txt),'몸 칸을 누르면 벗기 단추 ('+s5a.txt+')');
 await p.click('#det [data-eqa="off"]'); await p.waitForTimeout(60);
 const s5 = await p.evaluate(()=>{ const W=world,u=W.units[0]; paused=false; __run(W,4.5); paused=true; return { g: u.gear['몸']?u.gear['몸'].name:null, bag: u.bag.filter(x=>x.k==='armor').map(x=>x.label||x.name), log: logLines(W,0).filter(l=>/벗음/.test(l)) }; });
 ok(s5.bag.includes('기사의 판금 갑옷')&&s5.g!=='기사의 판금 갑옷'&&s5.log.length===1,'벗기 → 가방으로 · 기록 ('+(s5.log[0]||'')+')');
 // 6) 건네기 → 청광묵
 await p.evaluate(()=>renderDetail()); await p.click(`#det [data-eqb="${wU}"]`); await p.waitForTimeout(60);
 const gi = await p.evaluate(()=>{ const b=[...$('det').querySelectorAll('[data-eqgive]')].find(x=>/청광묵/.test(x.textContent)); return b ? { i: b.dataset.eqgive, dis: b.disabled } : null; });
 ok(gi&&!gi.dis,'건네기 단추: → 청광묵');
 await p.click(`#det [data-eqgive="${gi.i}"]`); await p.waitForTimeout(60);
 const s6 = await p.evaluate((ci)=>{ const W=world,u=W.units[0],c=W.units[+ci],o=__ord(u); c.order={k:'hold'}; paused=false; __run(W,6,()=>W.log.some(l=>l.k==='give')); paused=true;
   return { o: o&&[o.k,o.op,o.to], got: (c.bag||[]).some(x=>x.name==='장검'), left: u.bag.some(x=>x.name==='장검'), log: logLines(W,0).filter(l=>/🤝 .*건넴/.test(l)) }; }, gi.i);
 ok(s6.o&&s6.o[1]==='give'&&s6.got&&!s6.left,'건네기 → 청광묵 가방에 장검');
 ok(s6.log.length===1&&/🤝/.test(s6.log[0]),'기록: '+(s6.log[0]||''));
 // 7) 회복약: 마시기
 await p.evaluate(()=>{ const u=world.units[0]; u.hp=Math.round(u.max*0.5); renderDetail(); }); await p.click(`#det [data-eqb="${pU}"]`); await p.waitForTimeout(60);
 const s7a = await p.evaluate(()=>{ const b=$('det').querySelector('[data-eqa="swap"]'); return b ? { t: b.textContent, dis: b.disabled } : null; });
 ok(s7a&&/마시기/.test(s7a.t)&&!s7a.dis,'회복약: 마시기 단추');
 await p.click('#det [data-eqa="swap"]'); await p.waitForTimeout(60);
 const s7 = await p.evaluate(()=>{ const W=world,u=W.units[0],h0=u.hp; paused=false; __run(W,2); paused=true; return { h0, h1: u.hp, left: u.bag.some(x=>x.k==='potion') }; });
 ok(s7.h1>s7.h0&&!s7.left,'마심 → 피 '+s7.h0+' → '+s7.h1);
 // 8) 내려놓기 (무기 · 방패만) → 곁의 땅에 보임 → 줍기 단추
 await p.evaluate(()=>renderDetail()); await p.click(`#det [data-eqb="${w2U}"]`); await p.waitForTimeout(60);
 const s8a = await p.evaluate(()=>({ drop: !!$('det').querySelector('[data-eqa="drop"]'), hold: !!$('det').querySelector('[data-eqa="swap"]') }));
 ok(s8a.drop&&s8a.hold,'무기: 들기 · 내려놓기 단추');
 await p.click('#det [data-eqa="drop"]'); await p.waitForTimeout(60);
 const s8 = await p.evaluate(()=>{ const W=world,u=W.units[0]; paused=false; __run(W,0.6); paused=true; renderDetail(); const nb=$('det').querySelector('[data-eqpick]');
   return { ground: (W.items||[]).filter(x=>x.k==='weapon'&&x.name==='검').length, bag: u.bag.some(x=>x.name==='검'), log: logLines(W,0).filter(l=>/내려놓음/.test(l)), near: nb&&nb.textContent }; });
 ok(s8.ground===1&&!s8.bag&&s8.log.length>=1,'내려놓기 → 발밑에 검 ('+(s8.log[0]||'')+')');
 ok(s8.near&&/검/.test(s8.near),'곁의 땅: '+s8.near);
 await p.click('#det [data-eqpick]'); await p.waitForTimeout(60);
 const s9 = await p.evaluate(()=>{ const o=__ord(world.units[0]); return o&&[o.k,o.id]; });
 ok(s9&&s9[0]==='pick','곁의 땅 무구 → 줍기 명령');
 // 9) 레베카 방패 벗기 (지휘망으로 간 명령)
 await p.evaluate(()=>{ world.units[0].order=null; __sel(2); });
 const s10a = await p.evaluate(()=>({ sh: world.units[2].shield, txt: ($('det').querySelector('[data-eqs="shield"]')||{}).textContent }));
 ok(s10a.sh&&/방패/.test(s10a.txt||''),'레베카 방패 칸 ('+s10a.txt+')');
 await p.click('#det [data-eqs="shield"]'); await p.waitForTimeout(60); await p.click('#det [data-eqa="off"]'); await p.waitForTimeout(60);
 const s10 = await p.evaluate(()=>{ const W=world,r=W.units[2]; paused=false; __run(W,5,()=>!r.shield); __run(W,0.3); paused=true; return { sh: r.shield, bag: r.bag.some(x=>x.k==='shield'), off: !!r.sOff, log: logLines(W,0).filter(l=>/방패 .*벗음/.test(l)) }; });
 ok(!s10.sh&&s10.bag&&s10.off&&s10.log.length===1,'방패 벗기 → 가방으로 · 기록 ('+(s10.log[0]||'')+')');
 // 10) I 키 · 적은 보기만
 await p.evaluate(()=>{ detTab='info'; renderDetail(); });
 await p.keyboard.press('i'); await p.waitForTimeout(60); const k1 = await p.evaluate(()=>({ t: detTab, eq: !!$('det').querySelector('.eqt') }));
 await p.keyboard.press('i'); await p.waitForTimeout(60); const k2 = await p.evaluate(()=>({ t: detTab, eq: !!$('det').querySelector('.eqt') }));
 ok(k1.t==='eq'&&k1.eq&&k2.t==='info'&&!k2.eq,'I 키: 장비 · 가방 탭 켜고 끔');
 const en = await p.evaluate(()=>{ $('seeAll').checked=true; detTab='eq'; sel=new Set(); detItem=null; hoverPid=world.units[3].pid; renderDetail(); const h=$('det').innerHTML, c=$('det').querySelector('[data-eqs="weapon"]'); if (c) c.click(); const btn=$('det').querySelectorAll('.eqbtns .btn').length, info=($('det').querySelector('.eqinfo')||{}).textContent||''; $('seeAll').checked=false; detTab='info'; hoverPid=null; renderDetail(); return { eq: /eqt/.test(h), hint: /명령은 아군에게만/.test(h), btn, info: info.slice(0,60) }; });
 console.log('    ', JSON.stringify(en));
 ok(en.eq&&en.hint&&en.btn===0,'적의 장비 · 가방은 보기만 (단추 없음)');
 // 11) J10 카리우스 무기 칸 (두 손 2칸)
 const k10 = await p.evaluate(()=>{ const W=__mkF([['인주',0,10,10],['카리우스',0,12,10,{bag:[{k:'weapon',name:'대검',dur:100},{k:'weapon',name:'대검',dur:100}]}],['검기사',1,50,10]]); detTab='eq'; __sel(1); const sum=($('det').querySelector('.eqsum')||{}).textContent||'';
   const p0=S.units.find(x=>x.name==='카리우스'), r1=bagRoom(p0,{k:'weapon',name:'장검'}), inv=invHtml(p0,{story:true,mates:[]}); detTab='info'; return { sum, r1, inv: (inv.match(/무기 칸 [^<]*/)||[''])[0], wmax: (W.units[1].eqRule||{}).wmax }; });
 console.log('    ', JSON.stringify(k10));
 ok(k10.wmax===4&&/무기 칸 4\/4/.test(k10.sum),'카리우스 장비 탭: 무기 칸 4/4 (대검 둘)');
 ok(/무기 칸이 참/.test(k10.r1)&&/4\/4/.test(k10.inv),'정산 가방: 무기 칸 4/4 · 한 손 무기도 못 넣음 ('+k10.r1+')');
 // 12) 판 위 이름표: 무구 — 누르면 상세 칸 (누가 주울지) · 인물이 서 있으면 인물 먼저 · 안개 속은 없음
 const l1 = await p.evaluate(()=>{ const W=__mkF([['인주',0,10,10],['청광묵',0,12,10],['검기사',1,50,10]]); detTab='info'; dropItem(W, W.units[2], 'weapon', '장검', { dur: 80, label: '기사의 장검' }, 'put'); const it=W.items[W.items.length-1]; it.x=15.5; it.y=12.5;
   cam.follow=false; cam.x=15.5; cam.y=12; sel=new Set(); S.pcDet=false; applyPc(); renderDetail(); draw(); const b=LBL.find(x=>x.k==='item'&&x.id===it.id), r=cv.getBoundingClientRect();
   return b ? { id: it.id, x: r.left+(b.x0+b.x1)/2, y: r.top+(b.y0+b.y1)/2, n: LBL.length } : { id: it.id, none: true, n: LBL.length }; });
 ok(!l1.none,'판 위 이름표: 떨어진 무구 위에 이름 ('+l1.n+'개)');
 await p.mouse.move(l1.x, l1.y); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(150);
 const l2 = await p.evaluate(()=>({ di: detItem, h: $('det').textContent, pick: [...$('det').querySelectorAll('[data-ipick]')].map(b=>b.textContent), nodet: document.body.classList.contains('nodet') }));
 ok(l2.di===l1.id&&/기사의 장검/.test(l2.h)&&!l2.nodet,'이름표를 누르면 상세 칸에 그 물건 (고정 · 접힌 패널은 펼침)');
 ok(l2.pick.length>=2&&/인주|청광묵/.test(l2.pick[0]),'누가 주울지: '+l2.pick.join(' · '));
 const lh = await p.evaluate(async ()=>{ const det=$('det'), h0=det.innerHTML, W=world; det.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); W.units[1].x += 2; renderDetail(); const same=det.innerHTML===h0; window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); await new Promise(r=>setTimeout(r,30)); const changed=det.innerHTML!==h0; W.units[1].x -= 2; renderDetail(); return { same, changed }; });
 ok(lh.same&&lh.changed,'상세 칸을 누르고 있는 동안은 다시 그리지 않음 (손을 떼면 바로 새로) '+JSON.stringify(lh));
 await p.click('#det [data-ipick]'); await p.waitForTimeout(60);
 const l3 = await p.evaluate((id)=>{ const W=world; const L=W.units.filter(u=>u.side===0).map(u=>{ const o=__ord(u); return o&&o.k==='pick'&&o.id===id ? u.name : null; }).filter(Boolean); return { L, di: detItem }; }, l1.id);
 ok(l3.L.length===1&&l3.di===null,'✋ 단추 → '+l3.L[0]+' 주우러 (pick)');
 const ls = await p.evaluate((id)=>{ detItem=id; detItemSel=[...sel].join(','); renderDetail(); const a=/기사의 장검/.test($('det').textContent); sel=new Set([0]); renderDetail(); return { a, di: detItem, name: ($('det').querySelector('.hd b')||{}).textContent||'' }; }, l1.id);
 ok(ls.a&&ls.di===null&&ls.name==='인주','고정한 물건은 아군을 새로 고르면 풀림 (숫자키 · 카드) '+JSON.stringify(ls));
 const l4 = await p.evaluate((id)=>{ const W=world, it=W.items.find(x=>x.id===id), u=W.units[1]; for (const q of W.units) q.order=null; u.x=it.x; u.y=it.y-0.75; draw(); const b=LBL.find(x=>x.k==='item'&&x.id===id), r=cv.getBoundingClientRect(); sel=new Set(); detItem=null; return b ? { x: r.left+(b.x0+b.x1)/2, y: r.top+(b.y0+b.y1)/2, ui: u.i } : null; }, l1.id);
 if (l4){ await p.mouse.move(l4.x, l4.y); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(150); }
 const l5 = await p.evaluate(()=>({ sel: [...sel].map(i=>world.units[i].name), di: detItem }));
 ok(l4&&l5.di===null&&l5.sel.includes('청광묵'),'이름표 자리에 인물이 서 있으면 인물을 고름 ('+JSON.stringify(l5)+')');
 const l6 = await p.evaluate((id)=>{ const W=world, it=W.items.find(x=>x.id===id); W.explored.fill(0); draw(); const a=LBL.some(x=>x.k==='item'&&x.id===id); $('seeAll').checked=true; draw(); const c=LBL.some(x=>x.k==='item'&&x.id===id); $('seeAll').checked=false; markExplored(W); return { a, c }; }, l1.id);
 ok(!l6.a&&l6.c,'안개 속 (가 보지 않은 곳) 의 물건은 이름표 없음 (모두 보기면 보임)');
 // 13) 정산: 싸우는 중 입은 갑옷 · 벗은 방패 · 갑피 위 투구 → 명단에
 const st = await p.evaluate(()=>{ const W=__mkF([['인주',0,10,10,{bag:[{k:'armor',name:'기사의 판금 갑옷',mat:'판금',tier:3,dur:100}]}],['레베카',0,11,12],['카리우스',0,13,10,{bag:[{k:'helm',name:'용사의 투구',mat:'투구',tier:5,dur:100}]}],['검기사',1,50,10]]);
   const u=W.units[0], r=W.units[1], k=W.units[2]; u.order={k:'inv',op:'wear',uid:u.bag[0].uid}; r.order={k:'inv',op:'off',slot:'shield'}; k.order={k:'inv',op:'wear',uid:k.bag[0].uid}; paused=false; __run(W,5); paused=true;
   const n=settleWorld(W), pI=S.units.find(x=>x.id===u.pid), pR=S.units.find(x=>x.id===r.pid), pK=S.units.find(x=>x.id===k.pid);
   const out = { n, iG: pI.gear&&pI.gear['몸']&&pI.gear['몸'].name, iBag: (pI.bag||[]).map(x=>x.name), rSh: pR.shield, rBag: (pR.bag||[]).filter(x=>x.k==='shield').length, kG: pK.gear&&pK.gear['머리']&&[pK.gear['머리'].name,pK.gear['머리'].tier], kBag: (pK.bag||[]).map(x=>x.name) };
   resetToEdit(); start(); paused=true; const W2=world, k2=W2.units.find(x=>x.pid===pK.id), r2=W2.units.find(x=>x.pid===pR.id); out.k2 = k2.gear['머리'] && { t: k2.gear['머리'].tier, over: !!k2.gear['머리'].over }; out.r2 = { sh: r2.shield, bag: r2.bag.filter(x=>x.k==='shield').length }; return out; });
 console.log('    ', JSON.stringify(st));
 ok(st.iG==='기사의 판금 갑옷'&&!st.iBag.includes('기사의 판금 갑옷'),'정산: 싸우는 중 입은 갑옷이 명단의 몸에 (가방엔 없음)');
 ok(st.rSh===false&&st.rBag===1&&st.r2.sh===false&&st.r2.bag===1,'정산: 벗은 방패는 가방에 하나 (두 개가 되지 않음) · 다음 판도 그대로');
 ok(st.kG&&st.kG[1]===5&&st.k2&&st.k2.t===5&&st.k2.over,'정산: 카리우스 갑피 위 투구 5성 → 다음 판도 갑피 위 (벗으면 갑피로)');
 // 14) 전리품 (맵 위): 비교 · 끼우기 · 바로 지님 · 땅의 것은 사라짐 · 쓰러진 동료
 const lt = await p.evaluate(()=>{ const W=__mkF([['인주',0,10,10],['청광묵',0,11,10],['레베카',0,12,11],['검기사',1,14,10,{gear:{몸:{name:'검기사의 판금 갑옷',mat:'판금',tier:3,dur:90}}}],['검기사',1,50,10]]);
   const e=W.units[3]; e.hp=0; e.alive=false; dropOnDeath(W,e); const L=lootOf(W); const PL=lootParty(); lootTo=PL.find(p=>p.name==='인주').id; const box=document.createElement('div'); box.id='lootBox'; box.innerHTML=lootCards(W, PL); document.body.appendChild(box);
   const rows=[...box.querySelectorAll('.l8r')].map(r=>r.textContent.replace(/\s+/g,' ').slice(0,90)); const cmp=[...box.querySelectorAll('.lcmp')].map(x=>x.textContent); const wear=[...box.querySelectorAll('[data-lwear]')].map(b=>b.dataset.lwear+(b.disabled?'×':''));
   box.remove(); return { L: L.map(x=>[x.lk,x.k,x.label||x.name,!!x.ground]), rows, cmp, wear }; });
 console.log('    ', JSON.stringify(lt).slice(0, 700));
 ok(lt.L.length>=2&&lt.L.every(x=>x[0]),'전리품: 검기사의 무구 · 이름 붙은 갑옷 (출처 열쇠)');
 ok(lt.cmp.length>=2&&lt.cmp.some(x=>/인주/.test(x)&&/▲|▼|=/.test(x)),'받는 이 (인주) 의 지금 장비와 비교: '+lt.cmp.slice(0,2).join(' | '));
 ok(lt.wear.length>=2,'끼우기 단추 '+lt.wear.join(' · '));
 const lw = await p.evaluate(()=>{ const W=world, L=lootOf(W), ar=L.find(x=>x.k==='armor'), wp=L.find(x=>x.k==='weapon'&&x.ground!=null), pI=S.units.find(p=>p.name==='인주'), u=W.units.find(x=>x.pid===pI.id), c=W.units.find(x=>x.name==='청광묵'), pC=S.units.find(p=>p.id===c.pid);
   const g0=wp.ground, n0=u.bag.length; lootWear(W, ar.lk, pI.id); const o=__ord(u); const inBag=u.bag.some(x=>x.k==='armor'&&/검기사의 판금 갑옷/.test(x.label||x.name));
   lootGive(W, wp.lk, pC.id); const cBag=c.bag.some(x=>x.k==='weapon'), gone=!W.items.some(x=>x.id===g0), L2=lootOf(W);
   paused=false; __run(W,4.5); paused=true; return { o: o&&[o.k,o.op], inBag, taken: ar.taken, cBag, gone, still: L2.some(x=>x.lk===wp.lk&&!x.taken), rec: (L2.find(x=>x.lk===wp.lk)||{}).taken||null, worn: u.gear['몸']&&u.gear['몸'].name, roster: (pC.bag||[]).some(x=>x.k==='weapon') }; });
 console.log('    ', JSON.stringify(lw));
 ok(lw.o&&lw.o[0]==='inv'&&lw.o[1]==='wear'&&lw.inBag&&lw.taken==='인주','끼우기 (맵 위) → 판의 몸 가방에 넣고 입기 명령');
 ok(lw.worn&&/검기사의 판금 갑옷/.test(lw.worn),'4초 뒤 인주가 입음 ('+lw.worn+')');
 ok(lw.cBag&&lw.gone&&!lw.still&&lw.rec==='청광묵'&&!lw.roster,'→ 청광묵 (맵 위): 판의 몸 가방에 바로 · 땅의 것은 사라짐 · 다시 줍지 않음 (챙긴 것 → 청광묵 으로 남음) · 명단은 정산 때');
 // 15) 여정 맵: 장면 인물 이름표 → 말 걸기 · 나가기 전 전리품 (J11)
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); });
 await p.evaluate(TALKEND); await p.waitForTimeout(250);
 await p.waitForSelector('#r8dAll', { timeout: 8000 }); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 await p.evaluate(()=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; const h=(R.hid||{})[R.f]; R.hid={}; if (h&&h!=='none'){ F8[R.f]=null; R.fm=r8Gen(R.f); r8MapShow(); } });
 const nv = await p.evaluate((TE)=>{ const R=R8S(); world=null; R.f=8; F8[R.f]=null; R.fm=r8Gen(R.f); const n=R.fm.rows[0][0]; n.ms='fight'; n.npc8='smith'; R.at=null; R.done=[]; R.gold=500; r8Enter(n); eval(TE);
   const W=world, E=S.camp.stages[1].enc; if (!E) return { none: true }; for (const u of W.units) if (u.side===1){ u.hp=0; u.alive=false; } stepWorld(W,0.05); W.cleared=true; r8Tick(W);
   const h=W.units.find(u=>u.side===0&&u.alive); h.x=E.x+1.2; h.y=E.y; E.seen=true; for (const u of W.units) if (u.side===0&&u!==h&&Math.hypot(u.x-E.x,u.y-E.y)<2.5){ u.x=E.x-3; u.y=E.y+2; }
   paused=true; cam.follow=false; cam.x=E.x; cam.y=E.y; draw(); const b=LBL.find(x=>x.k==='npc'), r=cv.getBoundingClientRect(); return b ? { x: r.left+(b.x0+b.x1)/2, y: r.top+(b.y0+b.y1)/2, st: E.st } : { nolbl: true, st: E.st }; }, TALKEND);
 console.log('    ', JSON.stringify(nv));
 ok(nv&&!nv.none&&!nv.nolbl,'장면 인물 (대장장이) 아래 이름표');
 await p.waitForTimeout(400); await p.evaluate(TALKEND); await p.waitForTimeout(550);   // 맵에 들어선 뒤 늦게 뜨는 말 (서술) 을 닫고 · 막 닫은 대화 바로 뒤 누름은 다시 열지 않음 (v8.7.3) — 사람처럼 잠깐 뒤에
 const nv2 = await p.evaluate(()=>{ const E=S.camp.stages[1].enc; cam.x=E.x; cam.y=E.y; draw(); const b=LBL.find(x=>x.k==='npc'), r=cv.getBoundingClientRect(); return b ? { x: r.left+(b.x0+b.x1)/2, y: r.top+(b.y0+b.y1)/2, top: (document.elementFromPoint(r.left+(b.x0+b.x1)/2, r.top+(b.y0+b.y1)/2)||{}).id } : null; });
 console.log('    ', JSON.stringify(nv2));
 if (nv2 && nv2.x){ await p.mouse.move(nv2.x, nv2.y); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(200); }
 const nt = await p.evaluate(()=>({ tk: !!TK, npc: TK && TK.npc }));
 ok(nt.tk&&/smith/.test(nt.npc||''),'이름표를 누르면 말 걸기 ('+nt.npc+')');
 await p.evaluate(TALKEND); await p.waitForTimeout(150);
 const ex = await p.evaluate(()=>{ const W=world; for (const u of W.units) if (u.side===0) u.order=null; const e=W.units.find(u=>u.side===1); if (e){ e.gear={몸:{name:'떠돌이의 사슬 갑옷',mat:'사슬',tier:2,dur:80}}; } dropItem(W, W.units.find(u=>u.side===0), 'weapon', '장검', { dur: 70, label: '버려진 장검', own: '#남' }, 'put');
   W.lootSig=null; W.lootSeen=false; campBarRender(true); const L=lootLeft(W).length; const btn=document.querySelector('#campBar [data-cexit]'); if (!btn) return { nobtn: true, L }; btn.click(); const bn=$('banner');
   return { L, shown: !bn.hidden&&/나가기 전에/.test(bn.textContent), go: !!$('lootGo'), exitOrd: W.units.filter(u=>u.side===0&&u.order&&u.order.k==='exit').length, dir: btn.dataset.cexit }; });
 console.log('    ', JSON.stringify(ex));
 ok(ex.L>=1&&ex.shown&&ex.go&&ex.exitOrd===0,'끝난 맵에서 나가려 하면 남은 전리품을 한 번 보여 줌 (아직 안 나감)');
 const ex2 = await p.evaluate(()=>{ const W=world, bn=$('banner'), g=bn.querySelector('[data-lgive]:not([disabled])'); let took=null; if (g){ const k=g.dataset.lgive; g.click(); took=(lootOf(W).find(x=>x.lk===k)||{}).taken||null; }
   $('lootGo').click(); const n=W.units.filter(u=>u.side===0&&u.order&&u.order.k==='exit').length; const again=(()=>{ for (const u of W.units) if (u.side===0) u.order=null; const b=document.querySelector('#campBar [data-cexit]'); b.click(); return { hid: bn.hidden, n: W.units.filter(u=>u.side===0&&u.order&&u.order.k==='exit').length }; })();
   return { took, n, again }; });
 console.log('    ', JSON.stringify(ex2));
 ok(ex2.took,'전리품 창에서 챙김 → '+ex2.took);
 ok(ex2.n>0&&ex2.again.n>0,'▶ 이대로 나가기 → 출구로 · 두 번째부터는 바로 나감');
 const ex3 = await p.evaluate(()=>{ const W=world; for (const u of W.units) if (u.side===0) u.order=null; W.lootSeen=false; exitTap=null; const b=document.querySelector('#campBar [data-cexit]'); b.click(); const shown=!$('banner').hidden&&!!$('lootGo'), wb=[...document.querySelectorAll('#banner .l8wear')].map(x=>Math.round(x.getBoundingClientRect().height)); b.click(); const al=W.units.filter(u=>u.side===0&&u.alive&&!u.down); return { shown, wb, hid: $('banner').hidden, hur: al.filter(u=>u.order&&u.order.k==='exit'&&u.order.hurry).length, n: al.length }; });
 console.log('    ', JSON.stringify(ex3));
 ok(ex3.shown&&ex3.hid&&ex3.n>0&&ex3.hur===ex3.n,'창이 뜬 채 출구 단추를 한 번 더 → 창을 닫고 모두 서둘러 나감 (두 번 = 서둘러 그대로)');
 ok(ex3.wb.length>0&&ex3.wb.every(h=>h>=34),'끼우기 단추도 손가락 크기 '+JSON.stringify(ex3.wb));
 // 16) 페흐토 (D1): 싸우는 중엔 투구 · 갑주가 땅에 떨어지지 않고 전리품으로
 const ph = await p.evaluate(()=>{ const W=world; const R=R8S(); R.flags.pehtoDead=0; const pe={ ...fromDesign(clone(FOE8['페흐토']||{key:'페흐토',name:'페흐토',side:1,tier:5,cls:'기동',weapon:'장검',traits:['보스']}),1), x: 5, y: 5, id: uid() }; const n0=W.units.length;
   try { addUnit(W, pe); } catch (e) { return { err: e.message }; } const u=W.units[W.units.length-1]; if (!u || u.name!=='페흐토') return { err: 'no pehto', n0, n1: W.units.length };
   u.hp=0; u.alive=false; dropOnDeath(W,u); r8GuestTick(W); const items=(W.items||[]).filter(x=>/페흐토/.test(x.label||x.name||'')).map(x=>x.k); const L=lootOf(W).filter(x=>/페흐토/.test(x.label||x.name||'')).map(x=>x.k+':'+(x.label||x.name));
   return { items, L, log: logLines(W,0).filter(l=>/페흐토가 쓰러졌다/.test(l)).length }; });
 console.log('    ', JSON.stringify(ph));
 ok(ph.items&&!ph.items.includes('helm')&&!ph.items.includes('armor')&&ph.L&&ph.L.some(x=>/^helm:페흐토의 투구/.test(x))&&ph.L.some(x=>/^armor:페흐토의 망토 갑주/.test(x)),'페흐토: 투구 · 갑주는 땅이 아니라 전리품으로 (한 번씩)');
 // 17) 휴대폰: 장비 탭 (I 없이 탭) · 가로 넘침 없음
 const mctx = await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true}); const m=await mctx.newPage(); m.on('pageerror',e=>errs.push('mob: '+e.message)); await m.addInitScript('window.__askAuto=true; window.__noJit=true');
 await m.goto(url); await m.waitForTimeout(400); await m.evaluate(()=>localStorage.clear()); await m.reload(); await m.waitForTimeout(1000);
 const mb = await m.evaluate(()=>{ setMode('train'); resetToEdit(); S.units=[['인주',0,10,10],['청광묵',0,12,10],['검기사',1,50,10]].map(([k,s,x,y])=>({ ...fromDesign(designByKey(k),s), x, y, id: uid(), ...(k==='인주'?{bag:[{k:'armor',name:'사슬 갑옷',mat:'사슬',tier:2,dur:100},{k:'potion',name:'회복약',heal:0.3}]}:{}) })); start(); paused=true; sel=new Set([0]); detTab='eq'; openDet(true); renderDetail();
   const D=$('detail'), r=D.getBoundingClientRect(), q=s=>[...document.querySelectorAll('#det '+s)]; const cells=q('.eqc:not(.empty)').map(e=>{ const b=e.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)]; });
   return { open: D.classList.contains('open'), w: Math.round(r.width), sw: document.documentElement.scrollWidth, vw: innerWidth, slots: q('[data-eqs]').length, cells, tabs: q('.dtabs button').length }; });
 console.log('    휴대폰', JSON.stringify(mb));
 ok(mb.open&&mb.slots===4&&mb.cells.length===2&&mb.tabs===2,'휴대폰: 상세 칸 · 장비 탭 (칸 넷 · 가방)');
 ok(mb.sw<=mb.vw+1&&mb.cells.every(([w,h])=>w>=44&&h>=44),'휴대폰: 가로 넘침 없음 · 누르기 쉬운 칸 (44px 이상) '+JSON.stringify(mb.cells));
 const mbr = await m.evaluate(()=>{ const c=document.querySelector('#det .eqc:not(.empty)'); const b=c.getBoundingClientRect(); return { x: b.left+b.width/2, y: b.top+b.height/2 }; });
 await m.touchscreen.tap(mbr.x, mbr.y); await m.waitForTimeout(120);
 const mb2 = await m.evaluate(()=>({ info: ($('det').querySelector('.eqinfo')||{}).textContent||'', wear: !!$('det').querySelector('[data-eqa="wear"]') }));
 ok(/사슬 갑옷/.test(mb2.info)&&mb2.wear,'휴대폰: 칸을 누르면 설명 · 입기');
 await m.screenshot({ path: 'shots/v876_mob_eq.png' }).catch(()=>{});
 await p.evaluate(()=>{ setMode('train'); }).catch(()=>{});
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,5)));
 console.log(fails?'FAILS '+fails:'ALL UI8760 OK'); await b.close(); process.exit(fails?1:0); })();
