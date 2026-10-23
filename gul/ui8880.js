// (v8.9.0: 맵 이름을 [구역 종류 번호] 로 정리 — 이름 확인을 새 이름으로)
// v8.8.8 지상 맵 5장 UI 시험 — ui8880.js v1.0 (등록 · 칸 지도 · 칸 크기 · 아무것도 없이 열림 · 그림 오류 없음 · 스크린샷)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 const IDS=['gboss1','gevent1','gstair1','gstair2','gfight1'], NM=['지상 보스룸1 · 원형','지상 이벤트룸1','지상 계단1','지상 계단2','지상 전투룸1'];
 const m = await p.evaluate((IDS)=>IDS.map(k=>{ const M=MAPS8[k]; if(!M) return null; let inF=0; for(let y=M.in[1];y<=M.in[3];y++) for(let x=M.in[0];x<=M.in[2];x++) if(M.rows[y][x]==='.') inF++; return { k, name:M.name, nx:M.NX, ny:M.NY, cs:Math.round(M.cs), z:M.z, fl:M.rows.join('').split('.').length-1, inF, outF:M.rows[M.out[1]][M.out[0]]==='.', amb:M.amb, ok:M.rows.length===M.NY&&M.rows.every(r=>r.length===M.NX) }; }), IDS);
 console.log('    ', JSON.stringify(m).slice(0,600));
 ok(m.every(v=>v&&v.ok&&v.z===1&&v.inF>=7&&v.outF&&v.cs===85),'5장: 칸 지도 · 들어서는 곳 7칸 이상 · 나가는 칸 바닥 · 칸 85px · 확대 없음');
 ok(m.every((v,i)=>v.name===NM[i]),'이름: '+NM.join(' · '));
 ok(m[2].ny===18&&m[3].ny===18&&m[0].nx===18,'원형 · 직사각형 · 전투룸 18 × 12 · 계단 둘 12 × 18');
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 for (let i=0;i<IDS.length;i++){
   const r = await p.evaluate((k)=>{ const R=R8S(); const nd={ id:'t_'+k, r:0, i:0, x:0.5, next:[], seed:12345, t:'fight', ms:'pass', src8:k, empty:true, bare:true }; R.fm.rows[0][0]=nd; world=null; r8Enter(nd); const W=world, M=MAPS8[S.art8]; const o={ e:[] }; o.base=M&&M.base; o.foes=W?W.units.filter(u=>u.side!==0&&u.alive).length:-1; o.props=M?(M.props||[]).length:-1; o.onFloor=W?W.units.filter(u=>u.side===0).every(u=>M.rows[Math.floor(u.y)]&&'.r'.includes(M.rows[Math.floor(u.y)][Math.floor(u.x)])):false; try{ paused=true; draw(); }catch(e){ o.e.push(e.message); } return o; }, IDS[i]);
   await p.screenshot({ path: 'ui8880_'+IDS[i]+'.png' }).catch(()=>{});
   ok(r.base===IDS[i]&&r.foes===0&&r.props===0&&r.onFloor&&!r.e.length,NM[i]+': 열림 · 적 0 · 소품 0 · 바닥 위 · 그림 오류 없음 '+JSON.stringify(r));
   await p.evaluate(()=>{ world=null; });
 }
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8880 OK'); await b.close(); process.exit(fails ? 1 : 0); })();
