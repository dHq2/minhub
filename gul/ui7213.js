// v7.21.4 UI 시험 — ui7213.js v1.3 (v1.3: v7.25.3 여정 기록 — 파일 이름 gul_1F_journey_ · 끝내도 지난 여정은 남고 새 프롤로그 때 지움 · v1.2: v1.2: 받은 파일의 판 번호는 형식만 봄 · v1.1: 로그 받기는 downloads 기능 (가짜 claude.use 로 시험) · 거절 처리 · 기능이 없으면 받기 단추 숨김 + 띠는 '로그 복사' / v1.0: 맵을 넘어가면 gzip 로그가 쌓임 · 풀면 그 맵 로그 그대로 · 그만두기 · 새 캠페인 때 지움)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 /* 가짜 보는 곳: claude.use('downloads') → save 를 기록 (mode: ok | declined) */
 const MOCK = mode => `window.__dlMode=${JSON.stringify(mode)}; window.__saved=[]; window.claude={ use: async n => n==='downloads' ? Object.freeze({ save: async r => { if (window.__dlMode==='declined') throw { code:'declined', message:'no' }; const t = typeof r.data==='string' ? r.data : await r.data.text(); window.__saved.push({ filename:r.filename, text:t }); return { status:'saved' }; } }) : null };`;
 const NX="{ const nb=document.getElementById('campNext'); if(nb) nb.click(); }";
 async function run(nm, mock){
  const ctx=await b.newContext({viewport:{width:1280,height:860}}); if (mock) await ctx.addInitScript(MOCK(mock)); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
  await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
  const r1 = await p.evaluate(`(async()=>{ showTab('place'); renderFloors(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); await dlReady;
    const bar = document.getElementById('campBar'), clog = bar.querySelector('[data-clog]'); const barLog = clog ? { v: clog.dataset.clog, t: clog.textContent } : null;
    for(let i=0;i<60;i++) stepWorld(world,1/30); const n1=world.log.length; for(const u of world.units.filter(u=>u.side===0)) leaveMap(world,u,'up'); checkEnd(world); mode='plan'; onOver(); ${NX}
    await clogBusy; const L=clogGet(); const back = L[0]&&L[0].z ? JSON.parse(await gunB64(L[0].z)) : null;
    return { barLog, n: L.length, s: L[0]&&L[0].s, z: !!(L[0]&&L[0].z), zlen: L[0]&&L[0].z.length, raw: L[0]&&L[0].raw, nlog: L[0]&&L[0].n, back: back&&back.length, n1, s2: S.camp.s }; })()`);
  console.log('    '+nm+' 1S 로그', JSON.stringify(r1));
  const r2 = await p.evaluate(`(async()=>{ for (let k=2;k<=5;k++){ S.camp.s=k; for(const u of world.units.filter(u=>u.side===0)) leaveMap(world,u,'up'); checkEnd(world); mode='plan'; onOver(); ${NX} if (S.camp.end) break; }
    await clogBusy; const lb=document.getElementById('campLogBtn'); return { n: clogGet().length, end: S.camp.end, btn: !!lb, btnShown: !!lb && !lb.hidden && lb.getBoundingClientRect().width>0, cp: !!document.getElementById('campLogCp') }; })()`);
  console.log('    '+nm+' 끝까지', JSON.stringify(r2));
  const r3 = await p.evaluate(async()=>{ const lb=document.getElementById('campLogBtn'); if (!lb.hidden) lb.click(); await new Promise(r=>setTimeout(r,800)); const t=document.querySelector('.toast, #toast'); return { saved: (window.__saved||[]).map(x=>({ fn:x.filename, J: (()=>{ try { const J=JSON.parse(x.text); return { game:J.game, ver:J.ver, st:J.stages.length, logs:J.stages.every(s=>Array.isArray(s.log)), end:J.camp.end }; } catch(e){ return null; } })() })), toast: t ? t.textContent : '' }; });
  console.log('    '+nm+' 받기', JSON.stringify(r3));
  const r4 = await p.evaluate(()=>{ document.getElementById('campDone').click(); const kept=clogGet().length; campStart(); const g=document.getElementById('gacha'); g.hidden=true; g.innerHTML=''; return { kept, last: kept, after: clogGet().length }; });
  await ctx.close(); return { r1, r2, r3, r4, errs };
 }
 const A = await run('받기 됨', 'ok');
 ok(A.r1.n===1&&A.r1.s===1&&A.r1.z&&A.r1.back===A.r1.nlog&&A.r1.back>=A.r1.n1&&A.r1.zlen<A.r1.raw,'맵을 넘어가면 그 맵 로그가 gzip 으로 쌓임 (풀면 그대로 · 줄어듦)');
 ok(A.r1.barLog&&A.r1.barLog.v==='1','받기 기능이 있으면 캠페인 띠에 \'로그\' (파일)');
 ok(A.r2.end==='clear'&&A.r2.n>=4&&A.r2.btnShown&&A.r2.cp,'끝까지 가면 맵마다 로그 · 끝 화면 로그 받기 · 로그 복사 단추');
 const s0=A.r3.saved[0]; ok(A.r3.saved.length===1&&/^gul_1F_journey_.*\.json$/.test(s0.fn)&&s0.J&&s0.J.game==='굴의 전투판'&&/^7\.\d+\.\d+$/.test(s0.J.ver)&&s0.J.st===A.r2.n&&s0.J.logs&&s0.J.end==='clear','로그 받기 → downloads.save 로 JSON 파일 하나 (모든 맵 · 캠페인 요약)');
 ok(A.r4.kept===A.r2.n&&A.r4.after===0,'캠페인을 끝내도 지난 여정은 남고 · 새 캠페인을 시작하면 지움'); ok(A.errs.length===0,'오류 없음 '+JSON.stringify(A.errs));
 const B = await run('거절', 'declined');
 ok(B.r2.btnShown&&B.r3.saved.length===0&&B.errs.length===0,'받기를 거절해도 오류 없음 · 로그는 그대로 ('+B.r3.toast+')');
 const C = await run('기능 없음', null);
 ok(C.r1.barLog&&C.r1.barLog.v==='cp'&&/복사/.test(C.r1.barLog.t),'받기 기능이 없으면 띠는 \'로그 복사\'');
 ok(C.r2.btn&&!C.r2.btnShown&&C.r2.cp,'받기 기능이 없으면 끝 화면 로그 받기는 숨기고 로그 복사만');
 ok(C.r1.n===1&&C.r4.after===0&&C.errs.length===0,'기능이 없어도 로그는 쌓이고 오류 없음 '+JSON.stringify(C.errs));
 console.log(fails?`${fails} FAIL`:'ALL UI7213 OK'); await b.close(); })();
