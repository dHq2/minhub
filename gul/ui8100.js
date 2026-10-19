// v8.1.0 UI 시험 — ui8100.js v1.1 (v1.1: 들어설 때 대화는 로딩 뒤에 열림 — 기다렸다 셈 · v1.0: 챔피언 로드: 20층 MC 뒤에만 켜짐 · 들어설 때 MC 한마디 · 깜짝 규칙 (암전 · 상금 두 배 · 90초) · 관중 (응원 · 야유 · 축복 · 증오 · 되돌림) · 처치 · 쓰러짐 열기 · 이김 · 물러남 · 지도 MC 한마디 · 서술 · 로그 · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "window.__nm=[]; while (TK){ if (TK.timer) talkDone(); __nm.push(document.getElementById('tkName').textContent+'|'+document.getElementById('tkText').textContent); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); }";
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 console.log('== '+vw.nm);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(250); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 // 1. 20층 전에는 꺼짐
 const off = await p.evaluate((TE)=>{ const R=R8S(); R.f=12; const n={ id:'c0', r:1, i:0, t:'fight', x:.5, next:[] }; R.fm.rows[1].push(n); R.at=n.id; r8Battle(n); eval(TE); const W=world; return { on: crowdOn(), rule: W.r8.rule, mc: __nm.some(x=>/^MC 더 플링/.test(x)) }; }, TALKEND);
 ok(!off.on&&off.rule==null&&!off.mc,'12층 — 관중 · MC 없음');
 // 2. 21층 (MC 뒤): MC 한마디 · 깜짝 규칙
 await p.evaluate(()=>{ const R=R8S(); R.f=21; R.flags.mc=1; R.crowd=60; const n={ id:'cm', r:1, i:0, t:'fight', x:.5, next:[] }; R.fm.rows[1].push(n); R.at=n.id; r8Battle(n); }); await p.waitForTimeout(150);
 const mc1 = await p.evaluate((TE)=>{ eval(TE); return __nm.filter(x=>/^MC 더 플링/.test(x)).length; }, TALKEND);
 const on = await p.evaluate((TE)=>{ const R=R8S(); R.f=21; R.flags.mc=1; R.crowd=60; const out={ rules:{} };
   for (let k=0;k<30;k++){ const n={ id:'c'+k, r:1, i:0, t:'fight', x:.5, next:[] }; R.fm.rows[1].push(n); R.at=n.id; r8Battle(n); eval(TE); out.rules[world.r8.rule]=(out.rules[world.r8.rule]||0)+1; if (k===0){ out.mc=__nm.filter(x=>/^MC 더 플링/.test(x)).length; out.on=crowdOn(); } if (world.r8.rule==='dark') out.darkAmb=S.amb; }
   return out; }, TALKEND);
 console.log('    규칙', JSON.stringify(on)); ok(on.on&&mc1>=1,'21층 — 들어설 때 MC 더 플링 (이름 띠)'); ok(Object.keys(on.rules).length>=4&&on.rules.none>0,'깜짝 규칙이 여러 가지로 나옴 (없음 포함)'); ok(on.darkAmb!=null&&on.darkAmb<=0.12,'암전 경기 — 판이 어두워짐 (밝기 '+on.darkAmb+')');
 // 3. 관중: 응원 · 축복 (열기 높음) · 야유 · 증오 (열기 낮음) · 되돌림
 const cr = await p.evaluate(()=>{ const R=R8S(); const n={ id:'cr', r:1, i:0, t:'fight', x:.5, next:[] }; R.fm.rows[1].push(n); R.at=n.id; r8Battle(n); while (TK){ if (TK.timer) talkDone(); talkAdv(); } const W=world; const seen={}, al=W.units.filter(u=>u.side===0);
   const atk0=al.map(u=>u.atk), spd0=al.map(u=>u.spd); for (const u of al) u.hp=Math.round(u.max*0.5);
   for (const h of [90, 20]) for (let k=0;k<60;k++){ R.crowd=h; W.r8c && (W.r8c.next=0); r8CrowdTick(W); const L=W.log.filter(l=>l.k==='r8'); const s=(L[L.length-1]||{}).s||''; for (const [kk,re] of [['cheer',/응원|함성|연호|박수/],['bless',/축복|약병/],['boo',/야유|등을 돌려|지루/],['hate',/빈 병|돌을/]]) if (re.test(s)) seen[kk]=1; }
   const anyUp=al.some((u,i)=>u.atk!==atk0[i]); W.t+=30; R.crowd=50; W.r8c.next=1e9; r8CrowdTick(W); const back=al.every((u,i)=>u.atk===atk0[i]&&Math.abs(u.spd-spd0[i])<1e-6);
   const narr=narrOf(W, W.log.filter(l=>l.k==='r8').pop()); const log=logLines(W).join('\n');
   return { seen, anyUp, back, narr: narr&&narr.s, log: /🎤/.test(log), clog: (R.crowdLog||[]).length }; });
 console.log('    관중', JSON.stringify(cr)); ok(cr.seen.cheer&&cr.seen.bless&&cr.seen.boo&&cr.seen.hate,'응원 · 축복 (열기 높음) · 야유 · 증오 (열기 낮음) 모두 나옴'); ok(cr.back,'응원 · 야유 효과는 시간이 지나면 되돌아감'); ok(/🎤/.test(cr.narr||'')&&cr.log,'서술 · 로그에 MC 글');
 // 4. 처치 · 쓰러짐 → 열기
 const ht = await p.evaluate(()=>{ const R=R8S(), W=world; R.crowd=50; W.r8c=null; r8CrowdTick(W); const f=W.units.filter(u=>u.side===1&&u.alive); f[0].alive=false; f[1].alive=false; r8CrowdTick(W); const h1=R.crowd; const a=W.units.find(u=>u.side===0&&u.alive&&!u.hero); a.alive=false; r8CrowdTick(W); return { h1, h2: R.crowd }; });
 ok(ht.h1===56&&ht.h2===53,'적 둘 쓰러뜨림 +6 · 동료 쓰러짐 −3 ('+JSON.stringify(ht)+')');
 // 5. 이김 (상금 두 배 · 90초) · 물러남
 const ov = await p.evaluate(()=>{ const R=R8S(), W=world, out={};
   R.crowd=50; W.r8.rule='gold'; out.gold=r8CrowdOver(W,{ t:'fight' },true,false);
   R.crowd=50; W.r8.rule='clock'; W.t=60; out.clockFast=r8CrowdOver(W,{ t:'fight' },true,false); out.h1=R.crowd;
   R.crowd=50; W.t=120; out.clockSlow=r8CrowdOver(W,{ t:'fight' },true,false); out.h2=R.crowd;
   R.crowd=50; out.ret=r8CrowdOver(W,{ t:'fight' },false,true); out.h3=R.crowd; return out; });
 console.log('    끝', JSON.stringify(ov)); ok(Math.abs(ov.gold.mul-2*1.025)<1e-6,'상금 두 배 × 열기 (55 → × 1.025)'); ok(ov.clockFast.add===30&&ov.h1===67&&ov.h2===45,'90초 승부 — 안에 끝내면 +30 · 열기 +12 / 넘기면 −10'); ok(ov.h3===38,'물러나면 열기 −12');
 // 6. 실제 판 끝 → 정산 화면에 관중
 const real = await p.evaluate(()=>{ const R=R8S(), W=world; W.r8.rule='gold'; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } W.cleared=true; for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'up'); W.over=true; W.result='exit'; mode='plan'; onOver(); const t=document.getElementById('banner').textContent; const bs=[...document.querySelectorAll('#banner button')].find(x=>/지도로/.test(x.textContent)); if (bs) bs.click(); return { t: /상금 두 배/.test(t)&&/관중 열기/.test(t), mc: (document.querySelector('#run8 .r8mc')||{}).textContent||'' }; });
 ok(real.t,'정산 화면 — 상금 두 배 · 관중 열기'); ok(/MC 더 플링/.test(real.mc),'지도 — MC 한마디 ('+real.mc.slice(0,40)+')');
 if (vw.mob){ const sw = await p.evaluate(()=>({ sw: document.getElementById('run8').scrollWidth, w: innerWidth })); ok(sw.sw<=sw.w+1,'휴대폰: 지도 넘침 없음'); }
 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 await ctx.close(); }
 console.log(fails ? 'FAIL '+fails : 'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
