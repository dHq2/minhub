// v8.2.0 UI 시험 — ui8200.js v1.2 (v1.2: 휴대폰 결승 칸 — 새 캠페인의 뽑기 창 (gAll) 이 뜰 때까지 기다림: 앞 판 (지는 판) 의 정리가 늦으면 '진행 중인 캠페인을 버릴까요' 확인이 비동기로 먼저 와서 창이 늦게 뜸 (넷을 나란히 돌릴 때) · v1.1: 판 위의 확인 창 — 자동 시험은 __askAuto 로 바로 '예' · 30층 결승: 결승 칸 → 연출 대화 (MC · DJ 춘향 · 관리자) → 한 명 고르기 → 링 (그림 · 칸 · 봉인 · 거울 상대 · 체력 × 3) · 조작 (키보드 이동 · 공격 · 막기 · 대시 · 대기) · 챔피언 대시 반사 · 띠에 나가기 없음 · 끝 (이김 → 진엔딩 / 짐 → 다음 시즌 / 판정) · 휴대폰 막대 · 단추)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "window.__nm=[]; while (TK){ if (TK.timer) talkDone(); __nm.push(document.getElementById('tkName').textContent); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); }";
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 console.log('== '+vw.nm);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(250); await p.evaluate(()=>{ const R=R8S(); r8FloorEnter(30); }); await p.waitForTimeout(200);
 await p.evaluate(()=>{ const D=document.getElementById('r8dAll'); if (D){ D.click(); document.getElementById('r8dGo').click(); } });
 // 1. 결승 칸 → 연출 → 고르기
 const st = await p.evaluate((TE)=>{ const R=R8S(), rows=R.fm.rows, top=rows[rows.length-1][0]; const q=()=>document.querySelector(`[data-r8n="${top.id}"]`); const av=r8Avail().includes(top.id); q().click(); q().click(); const bg=document.getElementById('talk').style.backgroundImage; eval(TE); const pick=document.querySelectorAll('[data-d8p]').length; return { t: top.t, av, bg: /r8_stadium/.test(bg), names: [...new Set(__nm)].filter(Boolean), pick, n: R.party.length }; }, TALKEND);
 console.log('    연출', JSON.stringify(st)); ok(st.t==='final'&&st.av,'30층 — 결승 칸 하나'); ok(st.bg&&st.names.includes('MC 더 플링')&&st.names.includes('DJ 춘향')&&st.names.includes('관리자'),'연출: 스타디움 그림 · MC 더 플링 · DJ 춘향 · 관리자'); ok(st.pick===st.n,'링에 오를 한 명 고르기 ('+st.pick+'명)');
 // 2. 링
 const ring = await p.evaluate(()=>{ const b=[...document.querySelectorAll('[data-d8p]')].find(x=>/카리우스|레베카|인주/.test(x.textContent))||document.querySelector('[data-d8p]'); b.click(); const W=world, d=W.duel, me=W.units[d.me], foe=W.units[d.foe];
   const bar=document.getElementById('campBar').innerHTML;
   return { art: S.art8, W: S.W, H: S.H, n: W.units.length, me: me.name, foe: foe.name, trM: me.traits.length, trF: foe.traits.length, trs: me.traits.concat(foe.traits), act: (me.active||[]).length+(foe.active||[]).length, skill: !!(me.skill||foe.skill), hp: [me.max, foe.max], atk: [me.atk, foe.atk], spd: [me.spd, foe.spd], wp: [me.weapon, foe.weapon], ui: !!document.getElementById('duel8ui'), exits: /data-cexit/.test(bar), mode, cont, noPause: S.noPause, inRing: [me,foe].every(u=>u.x>2&&u.x<14&&u.y>3&&u.y<10) }; });
 console.log('    링', JSON.stringify(ring));
 ok(ring.art==='ring'&&ring.W===16&&ring.H===12&&ring.n===2&&ring.inRing,'링 (그림 · 16 × 12 · 둘만 · 링 안)');
 ok(ring.foe==='글리치 챔피언'&&ring.trs.every(t=>t==='일반인')&&ring.act===0&&!ring.skill,'특수능력 봉인 (특성 · 기술 · 치료 없음) — 양쪽');
 ok(ring.hp[0]===ring.hp[1]&&ring.atk[0]===ring.atk[1]&&ring.spd[0]===ring.spd[1]&&ring.wp[0]===ring.wp[1],'글리치 챔피언 = 거울 (체력 · 공격 · 빠르기 · 무기 같음)');
 ok(ring.ui&&!ring.exits&&ring.noPause&&ring.cont,'조작 화면 · 나가기 단추 없음 · 멈춤 없이 이어감');
 // 3. 조작 (키보드)
 const ctl = await p.evaluate(async ()=>{ const W=world, d=W.duel, me=W.units[d.me], foe=W.units[d.foe]; paused=true; const out={};
   foe.x=12.5; foe.y=6.5; me.x=4.5; me.y=6.5; const step=s=>{ for (let i=0;i<s*20;i++){ stepWorld(W,0.05); r8Tick(W); } };
   const kd=k=>document.body.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true})), ku=k=>document.body.dispatchEvent(new KeyboardEvent('keyup',{key:k,bubbles:true}));
   paused=false; const x0=me.x; kd('d'); step(0.6); out.moved=+(me.x-x0).toFixed(2); out.order=me.order&&me.order.k; ku('d'); step(0.2); out.idle=me.order&&me.order.k;
   const y0=me.y; kd(' '); step(0.25); out.dash=+(Math.abs(me.y-y0)+Math.abs(me.x-x0-out.moved)).toFixed(2); const cd=d.cd[me.i]; out.cd=+(cd-W.t).toFixed(2); const xs=me.x; kd(' '); step(0.1); out.dash2=+Math.abs(me.x-xs).toFixed(2);
   kd('k'); step(0.05); out.guard=me.guardMode; kd('k'); step(0.05); out.guard2=me.guardMode;
   kd('j'); step(0.05); out.atk=me.order&&me.order.k==='attack'&&me.order.b===foe.i;
   paused=true; return out; });
 console.log('    조작', JSON.stringify(ctl)); ok(ctl.moved>0.5&&ctl.order==='move','D — 오른쪽으로 감 (+'+ctl.moved+')'); ok(ctl.idle==='hold','손을 떼면 제자리 (지키는 자세)'); ok(ctl.dash>1.2&&ctl.cd>0.9&&ctl.dash2<0.6,'Space — 대시 ('+ctl.dash+'칸) · 대기 중엔 다시 안 됨');
 ok(ctl.guard==='hold'&&ctl.guard2==='auto','K — 막기 켜고 끔'); ok(ctl.atk,'J — 공격 (다가가 침)');
 // 4. 챔피언 대시 반사 (일격 준비를 보면 45%)
 const ai = await p.evaluate(()=>{ const W=world, d=W.duel, me=W.units[d.me], foe=W.units[d.foe]; let n=0, dash=0; const r0=Math.random;
   for (let k=0;k<40;k++){ d.cd[foe.i]=0; foe.x=8; foe.y=6.5; me.x=8-me.r-foe.r-0.3; me.y=6.5; me.act={ k:'atk', b: foe.i, phase:'wind', t0: W.t }; const c0=d.dash.length; duel8Tick(W); n++; if (d.dash.length>c0) dash++; d.dash.length=0; me.act=null; }
   return { n, dash }; });
 ok(ai.dash>=8&&ai.dash<=30,'챔피언: 일격 준비를 보면 가끔 대시로 피함 ('+ai.dash+'/'+ai.n+')');
 // 5. 이김 → 진엔딩
 const win = await p.evaluate((TE)=>{ const W=world, d=W.duel, foe=W.units[d.foe]; foe.alive=false; foe.hp=0; duel8Tick(W); const res=d.res; mode='plan'; onOver(); eval(TE); const t=(document.getElementById('run8')||{}).textContent||''; const log=(S.storyLog||[])[0]; return { res, ui: !!document.getElementById('duel8ui'), t: /진엔딩/.test(t), log: log&&log.kind, names: [...new Set(__nm)].filter(Boolean) }; }, TALKEND);
 console.log('    이김', JSON.stringify(win)); ok(win.res==='win'&&!win.ui&&win.t&&win.log==='run:true','이기면 — 조작 화면 걷힘 · 진엔딩 · 이야기 기록'); ok(win.names.includes('글리치 챔피언')&&win.names.includes('DJ 춘향'),'끝 대화: 글리치 챔피언 · DJ 춘향');
 // 6. 짐 · 판정 (새 여정 없이 같은 함수로)
 const lose = await p.evaluate((TE)=>{ document.getElementById('r8fin')&&document.getElementById('r8fin').click(); setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); r8Start(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } return 1; }, TALKEND);
 await p.waitForTimeout(250);
 const ls = await p.evaluate((TE)=>{ const R=R8S(); R.f=30; R.at='final'; duel8Begin(R.party[0]); const W=world, d=W.duel; W.t=151; duel8Tick(W); const judge=d.judge, res=d.res; mode='plan'; onOver(); eval(TE); const t=(document.getElementById('run8')||{}).textContent||''; return { judge, res, t: /다음 시즌/.test(t), log: (S.storyLog||[])[0].kind }; }, TALKEND);
 console.log('    판정', JSON.stringify(ls)); ok(ls.judge&&ls.res==='lose'&&ls.t&&ls.log==='run:lose30','150초 판정 — 체력 같으면 챔피언 방어 · "다음 시즌, 또 만나요!"');
 // 7. 휴대폰: 막대 · 단추
 if (vw.mob){ const mo = await p.evaluate(async ()=>{ document.getElementById('r8fin')&&document.getElementById('r8fin').click(); setMode('story'); campStart(); for (let i=0;i<200&&!document.getElementById('gAll');i++) await new Promise(r=>setTimeout(r,50)); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); r8Start(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } await new Promise(r=>setTimeout(r,250)); const R=R8S(); R.f=30; R.at='final'; duel8Begin(R.party[0]);
     const J=document.getElementById('d8joy'), bt=[...document.querySelectorAll('#duel8ui [data-d8]')].map(x=>x.dataset.d8), r=J.getBoundingClientRect(); return { joy: !!J, bt, r: [r.left, r.bottom, innerWidth, innerHeight] }; });
   console.log('    휴대폰', JSON.stringify(mo)); ok(mo.joy&&mo.bt.includes('atk')&&mo.bt.includes('guard')&&mo.bt.includes('dash'),'휴대폰: 왼쪽 막대 · 공격 · 막기 · 회피 단추');
   const jr = await p.evaluate(()=>{ const J=document.getElementById('d8joy'), r=J.getBoundingClientRect(); return [r.left+r.width/2, r.top+r.height/2, r.width]; });
   await p.mouse.move(jr[0], jr[1]); await p.mouse.down(); await p.mouse.move(jr[0]+jr[2]*0.45, jr[1], { steps: 4 });
   const jv = await p.evaluate(()=>({ x: DIN8.jx, v: duel8Vec() })); await p.mouse.up(); const j0 = await p.evaluate(()=>({ x: DIN8.jx }));
   ok(jv.x>0.6&&jv.v&&jv.v.x>0.9&&j0.x===0,'막대를 오른쪽으로 → 오른쪽 이동 · 떼면 멈춤 ('+jv.x.toFixed(2)+')');
   const bb = await p.evaluate(()=>{ const b=document.querySelector('#duel8ui [data-d8="atk"]'); b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); return DIN8.atk; }); ok(bb===true,'공격 단추 → 공격 입력'); }
 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 await ctx.close(); }
 console.log(fails ? 'FAIL '+fails : 'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
