// v7.25.3 UI 시험 — ui7253.js v1.6 (v1.6: 새 프롤로그는 확인 창이 닫힌 뒤 (잠깐 기다림) 뽑기를 누름 · 전리품은 새 창 (v8.5.0 — 받는 사람을 고르고 → 단추) · v1.5: 판 위의 확인 창 — 자동 시험은 __askAuto 로 바로 '예' · v1.4: 파일 버전은 x.y.z 모양 (8.0.0 부터) · v1.3: 3S 에 오딜의 방 (몫 1) → 공통 전투 37.5% · 예정 줄 없앰 / v1.2: 파일 버전은 7.25.x 모양만 · v1.1: 여정은 맵 다섯 이상 · 휴대폰 넓이는 innerWidth 가 그대로인지로 · 공통 전투: 무리 · 상황을 뽑음 (2S 는 앞과 다른 무리) · 상황마다 적의 시작 (매복 = 숨음) · 3S 의 싸움도 공통 전투 /
//   맵을 넘어갈 때 나레이션 · 로딩 (누르면 · Space 로 건너뜀 · 대화는 걷힌 뒤) · 4S 모래 · 5S 빛 / 여정 기록: 1S ~ 끝까지 파일 하나 (요약 · 글 · 맵마다 원본 · 대화 · 전리품 ·
//   성장) · 저장이 막혀도 메모리 사본 · 지금 맵도 · 끝낸 뒤에도 남음 (이야기 탭) · 새 프롤로그 때 지움 / 인카운터 목록 탭 (훈련장) · 해 보기 · 휴대폰 넓이)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const MOCK = `window.__saved=[]; window.claude={ use: async n => n==='downloads' ? Object.freeze({ save: async r => { const t = typeof r.data==='string' ? r.data : await r.data.text(); window.__saved.push({ filename:r.filename, text:t }); return { status:'saved' }; } }) : null };`;
 const fresh = async (vw, mock) => { const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); if (mock) await ctx.addInitScript(MOCK); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true');
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900); return { p, errs, ctx }; };
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); }";
 // 1) 공통 전투
 { const { p, errs, ctx } = await fresh({ width:1280, height:860 });
   const a = await p.evaluate(async()=>{ setMode('story'); campStart(); await new Promise(r=>setTimeout(r,120)); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const st=S.camp.stages[1];
     return { bt: st.bt, foes: world.units.filter(u=>u.side===1).length, start: world.start&&world.start.k, kind: CAMP_S[1].kind }; });
   console.log('    1S 기본', JSON.stringify(a)); ok(a.bt&&a.bt.c==='c0'&&a.bt.s==='roam'&&a.foes===5&&a.start==='roam'&&a.kind==='공통 전투','1S = 공통 전투 (자동 시험 기본: 떠도는 기사들 · 떠도는 망자 — 예전 그대로)');
   const sits = await p.evaluate(()=>{ const out={}; const party=S.units.filter(u=>u.side===0); for (const k of ['front','pincer','ambush','rear','column','roam']){ const C=S.camp; C.stages[2]={ seed: 5, tseed: 5 }; C.btForce={ c: 'c4', s: k }; C.s=2; campBuild(2,'down',party);
       out[k] = { start: world.start&&world.start.k, foes: world.units.filter(u=>u.side===1).map(u=>u.name.replace(/\s*\d+$/,'')).sort().join(','), lurk: world.units.filter(u=>u.side===1&&u.lurk).length, startK: S.startK }; } return out; });
   console.log('    상황', JSON.stringify(sits));
   ok(Object.entries(sits).every(([k,v])=>v.start===k&&v.startK===k&&v.foes==='검기사,검방패기사,궁수,창병'),'상황마다 적의 시작이 그대로 (정면 대치 · 협공 · 매복 · 후방 · 행군 · 떠돎) — 무리는 기사들');
   ok(sits.ambush.lurk>=2&&sits.front.lurk===0,'매복 = 양옆 어둠에 숨어 기다림 ('+sits.ambush.lurk+')');
   const pk = await p.evaluate(()=>{ Object.defineProperty(Navigator.prototype,'webdriver',{ get:()=>false, configurable:true }); const C={ stages:{ 1:{ bt:{ c:'c0', s:'roam' } } } }; const cs={}, ss={};
     for (let i=0;i<600;i++){ const r=btlPick(C,2); cs[r.c]=(cs[r.c]||0)+1; ss[r.s]=(ss[r.s]||0)+1; } delete Navigator.prototype.webdriver; return { cs, ss }; });
   console.log('    뽑기', JSON.stringify(pk)); ok(!pk.cs.c0&&Object.keys(pk.cs).length===4&&Object.keys(pk.ss).length===6,'2S 는 1S 와 다른 무리 · 무리 넷 · 상황 여섯이 다 나옴');
   const f3 = await p.evaluate(()=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.stages[3]={ seed: 11, tseed: 7, e3: 'fight' }; C.btForce={ c:'c2', s:'pincer' }; C.s=3; campBuild(3,'down',party);
     const L=[]; for(let i=0;i<300;i++){ const e=encPick({ fallen:[], lost:[] },[]); L.push(e.k); } return { bt: S.camp.stages[3].bt, foes: world.units.filter(u=>u.side===1).length, start: world.start&&world.start.k, picks: [...new Set(L)].sort(), old: L.filter(k=>/^f\d/.test(k)).length, bar: document.getElementById('campBar').textContent }; });
   console.log('    3S', JSON.stringify(f3)); ok(f3.bt.c==='c2'&&f3.foes===6&&f3.start==='pincer'&&f3.picks.includes('fight')&&f3.old===0,'3S 의 싸움도 공통 전투 (예전 f0 ~ f2 는 뽑히지 않음)');
   const old = await p.evaluate(()=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.stages[3]={ seed: 11, tseed: 7, e3: 'f0' }; C.s=3; campBuild(3,'down',party); return { bt: S.camp.stages[3].bt, foes: world.units.filter(u=>u.side===1).length }; });
   ok(old.bt.c==='c2'&&old.foes===6,'예전 저장 (f0 똥개 무리) 도 그대로');
   ok(!errs.length,'오류 없음 '+errs.slice(0,2).join(' | ')); await ctx.close(); }
 // 2) 로딩 연출
 for (const vw of [{width:1280,height:860,nm:'PC'},{width:412,height:880,nm:'휴대폰',mob:true}]){ const { p, errs, ctx } = await fresh(vw);
   await p.evaluate(()=>{ setMode('story'); LOAD_FX.on=true; campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); });
   await p.waitForTimeout(600);
   const l1 = await p.evaluate(()=>{ const el=document.getElementById('ldFx'), q=el.getBoundingClientRect(); return { on: !el.hidden&&el.classList.contains('on'), txt: el.innerText.replace(/\s+/g,' '), ld: !!LD, w: Math.round(q.width), h: Math.round(q.height), iw: innerWidth, ih: innerHeight, world: !!world&&world.camp, s: S.camp.s }; });
   console.log('    '+vw.nm+' 1S 로딩', JSON.stringify(l1)); ok(l1.on&&l1.ld&&/1S/.test(l1.txt)&&/공통 전투/.test(l1.txt)&&/누르면 건너뜀/.test(l1.txt)&&l1.world&&l1.w>=l1.iw-1&&l1.h>=l1.ih-1,vw.nm+': 1S 로 — 나레이션 · 로딩 (판은 밑에서 이미 만들어짐)');
   if (vw.mob) await p.screenshot({path:'_s7253_load_mo.png'}); else await p.screenshot({path:'_s7253_load.png'});
   await p.waitForTimeout(3600); const l2 = await p.evaluate(()=>({ hid: document.getElementById('ldFx').hidden, ld: !!LD })); ok(l2.hid&&!l2.ld,vw.nm+': 저절로 걷힘 ('+'2.6 ~ 3.3초)');
   // 2S 로: 정산 → 로딩 · Space 로 건너뜀 · 대화는 걷힌 뒤
   const l3 = await p.evaluate(()=>{ for (const u of world.units.filter(u=>u.side===0)) leaveMap(world,u,'up'); checkEnd(world); mode='plan'; onOver(); document.getElementById('campNext').click(); return { ld: !!LD, s: S.camp.s, txt: document.getElementById('ldFx').innerText.replace(/\s+/g,' '), tk: !!TK }; });
   console.log('    '+vw.nm+' 2S 로딩', JSON.stringify(l3)); ok(l3.ld&&l3.s===2&&/2S/.test(l3.txt)&&!l3.tk,vw.nm+': 정산 뒤 2S 로 — 로딩');
   await p.waitForTimeout(500); await p.keyboard.press('Space'); await p.waitForTimeout(600); const l4 = await p.evaluate(()=>({ ld: !!LD, hid: document.getElementById('ldFx').hidden, paused })); ok(!l4.ld&&l4.hid,vw.nm+': Space 로 건너뜀');
   // 5S: 빛 · 4S: 모래 · 대화 (홀 나레이션) 는 걷힌 뒤
   const l5 = await p.evaluate(()=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.s=5; campGo(5,'down',party); const el=document.getElementById('ldFx'); return { cls: el.className, txt: el.innerText.replace(/\s+/g,' '), tk: !!TK }; });
   await p.waitForTimeout(700); if (vw.mob) await p.screenshot({path:'_s7253_load5_mo.png'}); else await p.screenshot({path:'_s7253_load5.png'});
   await p.evaluate(()=>document.getElementById('ldFx').click()); await p.waitForTimeout(800); const l6 = await p.evaluate(()=>({ tk: !!TK, ld: !!LD }));
   console.log('    '+vw.nm+' 5S', JSON.stringify(l5), JSON.stringify(l6)); ok(/lite/.test(l5.cls)&&/빛이 쏟아져/.test(l5.txt)&&!l5.tk&&l6.tk&&!l6.ld,vw.nm+': 5S 알현실 — 빛 (lite) · 누르면 걷히고 홀 나레이션');
   await p.evaluate(()=>{ while (TK){ if (TK.timer) talkDone(); talkAdv(); } const party=S.units.filter(u=>u.side===0); S.camp.s=4; campGo(4,'down',party); }); const l7 = await p.evaluate(()=>document.getElementById('ldFx').className); ok(/sand/.test(l7),vw.nm+': 4S — 하얀 모래 (sand)');
   await p.evaluate(()=>ldEnd(true));
   ok(!errs.length,vw.nm+' 오류 없음 '+errs.slice(0,2).join(' | ')); await ctx.close(); }
 // 3) 여정 기록
 { const { p, errs, ctx } = await fresh({ width:1280, height:860 }, true);
   const j1 = await p.evaluate(async()=>{ setMode('story'); campStart(); await new Promise(r=>setTimeout(r,120)); document.getElementById('gAll').click(); document.getElementById('gGo').click(); await dlReady;
     const W=world, k=W.units.find(u=>u.hero); for (const f of W.units.filter(u=>u.side===1)) applyDmg(W,k,f,99999,{}); const rb=W.units.find(u=>u.name==='레베카'); rb.shots=30; rb.miss=2;
     for (let i=0;i<30;i++) stepWorld(W,1/30); const live = await campLogAll();
     for (const u of W.units.filter(u=>u.side===0)) leaveMap(W,u,'up'); checkEnd(W); mode='plan'; onOver();
     document.querySelector('[data-crt="loot"]').click(); const L=lootOf(W), i=L.findIndex(x=>x.k==='weapon'), pr=crCtx.party.find(x=>x.name==='레베카'); lootTo=pr.id; crRender(); document.querySelector(`#crBody .l8go[data-lgive="${i}"][data-lp="${pr.id}"]`).click(); document.getElementById('campNext').click();
     return { live: live.stages.map(x=>({ s:x.s, live:!!x.live, ev: (x.log||[]).length })), liveTxt: live.text.some(l=>/지금 이 맵/.test(l)) }; });
   console.log('    지금 맵', JSON.stringify(j1)); ok(j1.live.length===1&&j1.live[0].live&&j1.live[0].ev>0&&j1.liveTxt,'아직 넘어가지 않은 지금 맵도 여정 기록에');
   // 3S: 잠든 사냥꾼과 대화 (고른 것까지)
   const j2 = await p.evaluate(`(async()=>{ const W=world; for (const u of W.units.filter(u=>u.side===0)) leaveMap(W,u,'up'); checkEnd(W); mode='plan'; onOver(); document.getElementById('campNext').click();
     const C=S.camp, party=S.units.filter(u=>u.side===0&&u.name!=='친칠라'); C.stages[3]={ seed: 11, tseed: 7, e3: 'chin' }; C.s=3; campBuild(3,'down',party); const E=encCur(); const h=world.units.find(u=>u.hero); h.x=E.x; h.y=E.y+1.5; computeLight(world);
     encTick(world); ${TALKEND} encTalk(E); if (TK&&TK.timer) talkDone(); const b=document.querySelector('#tkCh button'); if (b) b.click(); ${TALKEND}
     const v=jrCur(); return { talk: v.talk.slice(0,6), picks: v.talk.filter(t=>t.pick).length, enc: v.enc, npc: v.npc }; })()`);
   console.log('    대화', JSON.stringify(j2)); ok(j2.talk.length>=2&&j2.picks>=1&&j2.enc==='잠든 사냥꾼','3S 대화가 여정에 (누가 · 무슨 말 · 고른 단추)');
   // 끝까지 (4S · 5S → 계단)
   const j3 = await p.evaluate(async()=>{ for (let k=3;k<=5;k++){ const W=world; for (const u of W.units.filter(u=>u.side===0)) leaveMap(W,u,'up'); checkEnd(W); mode='plan'; onOver(); const nb=document.getElementById('campNext'); if (nb) nb.click(); if (S.camp.end) break; while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(''); continue; } talkAdv(); } }
     await clogBusy; const lb=document.getElementById('campLogBtn'); if (lb&&!lb.hidden) lb.click(); await new Promise(r=>setTimeout(r,900)); const sv=(window.__saved||[])[0]; let J=null; try { J=JSON.parse(sv.text); } catch(e){}
     return { end: S.camp.end, n: clogGet().length, fn: sv&&sv.filename, lines: sv ? sv.text.split('\n').length : 0, J: J && { game:J.game, ver:J.ver, kind:J.kind, route:J.summary.route, res:J.summary.result, st:J.stages.length, logs:J.stages.every(s=>Array.isArray(s.log)&&s.log.length>0), names:J.stages.map(s=>s.name),
       h: J.text.filter(l=>/^════════ \d+\./.test(l)).length, story: J.text.filter(l=>l==='── 이야기 ──').length, det: J.text.filter(l=>l==='── 자세한 기록 ──').length, talk: J.text.some(l=>/▸ /.test(l)), loot: J.text.some(l=>/^전리품: .*→ 레베카/.test(l)), grow: J.text.some(l=>/^성장: /.test(l)), btl: J.text.some(l=>/공통 전투 — 떠도는 기사들 · 떠도는 망자/.test(l)), endTxt: J.text.slice(0,6) } }; });
   console.log('    끝', JSON.stringify(j3).slice(0,900));
   ok(j3.end==='clear'&&/^gul_1F_journey_\d{12}\.json$/.test(j3.fn||'')&&j3.J&&j3.J.game==='굴의 전투판'&&/^\d+\.\d+\.\d+$/.test(j3.J.ver),'끝 화면 여정 기록 받기 → 파일 하나 (JSON)');
   ok(j3.J&&j3.J.st===j3.n&&j3.J.st>=5&&j3.J.logs&&j3.J.route.join(',')===j3.J.names.join(',')&&j3.J.route[0]==='1S'&&j3.J.route[j3.J.route.length-1]==='5S'&&/계단/.test(j3.J.res),'1S 부터 5S 까지 모든 맵 (길 '+(j3.J?j3.J.route.join('→'):'')+') · 맵마다 원본 사건');
   ok(j3.J&&j3.J.h===j3.J.st&&j3.J.story===j3.J.st&&j3.J.det===j3.J.st&&j3.J.talk&&j3.J.loot&&j3.J.btl,'사람이 읽는 글: 맵마다 머리 · 이야기 · 자세한 기록 · 대화 (▸ 고른 것) · 전리품 → 레베카 · 공통 전투 무리 · 상황');
   ok(j3.lines>j3.J.st*20,'파일은 한 줄에 하나씩 (읽기 쉽게) — '+j3.lines+'줄');
   const j4 = await p.evaluate(async()=>{ document.getElementById('campDone').click(); const n=clogGet().length; renderStory(); const box=[...document.querySelectorAll('#pane-story .box')].find(x=>/지난 여정 기록/.test(x.textContent)); const A=await campLogAll();
     campStart(); const n2=clogGet().length, last=!!S.jrLast; const g=document.getElementById('gacha'); g.hidden=true; g.innerHTML=''; return { n, box: !!box, btns: box ? [...box.querySelectorAll('button')].map(x=>x.textContent) : [], st: A.stages.length, n2, last }; });
   console.log('    끝낸 뒤', JSON.stringify(j4)); ok(j4.n===j3.n&&j4.box&&j4.btns.length>=1&&j4.st===j3.n,'끝내도 지난 여정 기록이 남음 (이야기 탭에서 받기 · 복사)'); ok(j4.n2===0&&!j4.last,'새 프롤로그를 시작하면 지난 여정은 지움');
   ok(!errs.length,'오류 없음 '+errs.slice(0,2).join(' | ')); await ctx.close(); }
 // 4) 저장이 막혀도 (메모리 사본)
 { const { p, errs, ctx } = await fresh({ width:1280, height:860 });
   const m = await p.evaluate(async()=>{ const sv=Storage.prototype.setItem; Storage.prototype.setItem=function(k,v){ if (k==='gul-camp-logs') throw new Error('quota'); return sv.call(this,k,v); };
     setMode('story'); campStart(); await new Promise(r=>setTimeout(r,120)); document.getElementById('gAll').click(); document.getElementById('gGo').click();
     for (let k=1;k<=2;k++){ const W=world; for (const u of W.units.filter(u=>u.side===0)) leaveMap(W,u,'up'); checkEnd(W); mode='plan'; onOver(); document.getElementById('campNext').click(); }
     const A=await campLogAll(); Storage.prototype.setItem=sv; return { st: A.stages.filter(x=>!x.live).length, ls: localStorage.getItem('gul-camp-logs') }; });
   console.log('    저장 막힘', JSON.stringify(m)); ok(m.st===2&&!m.ls,'저장이 막혀도 메모리 사본으로 여정이 그대로 (맵 2)');
   ok(!errs.length,'오류 없음 '+errs.slice(0,2).join(' | ')); await ctx.close(); }
 // 5) 인카운터 목록 탭 · 해 보기
 for (const vw of [{width:1280,height:860,nm:'PC'},{width:412,height:880,nm:'휴대폰',mob:true}]){ const { p, errs, ctx } = await fresh(vw);
   const t = await p.evaluate(()=>{ setMode('train'); const tb=document.querySelector('.tab[data-tab="enc"]'); tb.click(); const pn=document.getElementById('pane-enc'), q=tb.getBoundingClientRect(), tabs=tb.parentElement;
     return { vis: !pn.hidden, w: Math.round(q.width), rows: pn.querySelectorAll('.encT tbody tr').length, boxes: pn.querySelectorAll('.box').length, tries: pn.querySelectorAll('[data-etry]').length, labs: [...pn.querySelectorAll('.box > .lab')].map(x=>x.textContent.trim().slice(0,12)),
       sw: document.documentElement.scrollWidth, iw: innerWidth, tabsOver: tabs.scrollWidth > tabs.clientWidth+1, txt: pn.innerText.includes('37.5%') && pn.innerText.includes('오딜의 방') && pn.innerText.includes('대장군이 전쟁을 시작합니다') && pn.innerText.includes('토끼마차 1호점') }; });
   console.log('    '+vw.nm+' 인카운터 탭', JSON.stringify(t)); ok(t.vis&&t.w>0&&t.boxes>=9&&t.rows>=30&&t.tries>=9&&t.txt,vw.nm+': 인카운터 탭 — 한눈에 표 · 공통 전투 (무리 · 상황) · 3S 여섯 (오딜의 방) · 4S · 5S · 사건 · 대화 마디 · 확률');
   ok(t.sw<=t.iw+1&&t.iw===vw.width&&!t.tabsOver,vw.nm+': 탭 줄 · 화면 안');
   const story = await p.evaluate(()=>{ setMode('story'); return !!document.querySelector('.tab[data-tab="enc"]').offsetParent; }); ok(!story,vw.nm+': 스토리에선 인카운터 탭이 숨음');
   await p.evaluate(()=>{ setMode('train'); document.querySelector('.tab[data-tab="enc"]').click(); }); await p.waitForTimeout(200);
   if (vw.mob) await p.screenshot({path:'_s7253_enc_mo.png', fullPage:false}); else await p.screenshot({path:'_s7253_enc.png'});
   if (!vw.mob){
     const h = await p.evaluate(()=>{ document.querySelector('[data-etry="hora"]').click(); const E=encCur(); return { mode: S.mode, s: S.camp&&S.camp.s, npc: E&&E.npc, world: !!world&&world.camp, hasHora: S.units.some(u=>u.name==='호레이쇼') }; });
     console.log('    해 보기 hora', JSON.stringify(h)); ok(h.mode==='story'&&h.s===3&&h.npc==='hora'&&h.world,'▶ 해 보기 (대장군의 무대) → 스토리 · 3S 에 호레이쇼');
     const f = await p.evaluate(()=>{ setMode('train'); document.querySelector('.tab[data-tab="enc"]').click(); document.getElementById('encBtC').value='c3'; document.getElementById('encBtS').value='column'; document.querySelector('[data-etry="fight"]').click();
       return { s: S.camp.s, bt: S.camp.stages[1].bt, start: world.start&&world.start.k, foes: world.units.filter(u=>u.side===1).length }; });
     console.log('    해 보기 fight', JSON.stringify(f)); ok(f.s===1&&f.bt.c==='c3'&&f.bt.s==='column'&&f.start==='column'&&f.foes===5,'▶ 1S 에서 해 보기 — 고른 무리 (똥개와 기사) · 상황 (행군 중 조우)');
     const l = await p.evaluate(()=>{ setMode('train'); document.querySelector('.tab[data-tab="enc"]').click(); document.querySelector('[data-etry="lost"]').click(); const E=encCur(); return { npc: E&&E.npc, name: E&&E.name, lost: S.camp.lost.slice() }; });
     ok(l.npc==='lost'&&l.name&&l.lost.includes(l.name),'▶ 해 보기 (따라온 누군가) — 버린 이를 하나 만들어 그 사람이 나타남 ('+l.name+')');
     const h5 = await p.evaluate(()=>{ setMode('train'); document.querySelector('.tab[data-tab="enc"]').click(); document.querySelector('[data-etry="5"]').click(); return { s: S.camp.s, hall: S.hall }; }); ok(h5.s===5&&h5.hall,'▶ 5S 에서 해 보기 — 알현실');
     const kh = await p.evaluate(()=>{ setMode('train'); document.querySelector('.tab[data-tab="enc"]').click(); document.querySelector('[data-etry="kh"]').click(); return { kh: S.camp.kh, khT: S.camp.stages[1].khT }; }); ok(kh.kh===1&&kh.khT>0,'▶ 각혈 해 보기 — 1S 에 나옴');
   }
   ok(!errs.length,vw.nm+' 오류 없음 '+errs.slice(0,2).join(' | ')); await ctx.close(); }
 await b.close(); console.log(fails?`${fails} FAIL`:'ALL UI7253 OK'); })();
