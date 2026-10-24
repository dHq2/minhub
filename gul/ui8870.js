// v8.9.0 2층 UI 시험 — ui8870.js v1.3 (v1.3: 2층 열한 칸에 적이 있음 (9.3.0) — 비어 있던 시험을 '적 > 0 · 지나가기는 앞 다섯 + 전투룸3 만' 으로 · v1.2: 열한 칸 — 세 칸이 ❓ 랜덤 인카운터 (enc) · 만남이 열림 · v1.1: 2층 = 민수가 짠 여덟 칸 + 아래 계단 — 순서 · 이름표 · 칸마다 열어 봄 · 비어 있음 · 아래 계단 → 3층 · 보스룸 나가는 곳은 한가운데 · v1.0: 맵 5장 · 1층이 끝나면 2층)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 const SEQ=['ruin2a','ruin2b','?','gfight1','fmap2','?','gstair1','gstair2','fmap3','?','gboss1'];
 const NM={ruin2a:'유적 입구',ruin2b:'유적 계단',ruin2c:'유적 이벤트룸1 · 회랑과 방',gfight1:'지상 전투룸1',fmap2:'지상 전투룸2 · 낙사',fmap3:'지상 전투룸3 · 좁은 복도',gstair1:'지상 계단1',gstair2:'지상 계단2',gevent1:'지상 이벤트룸1',gboss1:'지상 보스룸1 · 원형'};
 const m = await p.evaluate((NM)=>{ const o={}; for (const k in NM){ const M=MAPS8[k]; o[k]=M?{ name:M.name, z:M.z, rowsOk:M.rows.length===M.NY&&M.rows.every(r=>r.length===M.NX), outF:M.rows[M.out[1]][M.out[0]]==='.', out:M.out, NX:M.NX, NY:M.NY }:null; } o.c1=!!MAPS8.ruin2c1; o.c2=!!MAPS8.ruin2c2; return o; }, NM);
 ok(Object.keys(NM).every(k=>m[k]&&m[k].name===NM[k]&&m[k].z===1&&m[k].rowsOk&&m[k].outF),'맵 10장: 새 이름 · 칸 지도 · 나가는 칸 바닥 · 확대 없음');
 ok(!m.c1&&!m.c2,'방 · 회랑 잘라낸 맵은 뺌 (분리 안 함)');
 ok(Math.abs(m.gboss1.out[0]-m.gboss1.NX/2)<=1.5&&Math.abs(m.gboss1.out[1]-m.gboss1.NY/2)<=1.5,'보스룸 나가는 곳 = 한가운데 ('+m.gboss1.out+')');
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 const f2 = await p.evaluate(()=>{ const R=R8S(); const F=F8[R.f]||{}; const rows=R.fm.rows; const html=(()=>{ r8MapShow(); return document.getElementById('run8').innerHTML; })(); return { f:R.f, name:F.name, n:rows.length, src:rows.map(r=>r[0].src8||r[0].t), mid:rows.map(r=>!!r[0].mid), lbl:SEQ_LBL(html) }; function SEQ_LBL(h){ return [...h.matchAll(/<small>([^<]*)<\/small>/g)].map(x=>x[1]); } });
 console.log('    ', JSON.stringify(f2).slice(0,500));
 ok(f2.f===2&&f2.name==='무너진 유적'&&f2.n===12,'1층이 끝나면 2층 · 무너진 유적 · 칸 12줄 (열한 칸 + 아래 계단)');
 ok(f2.src.slice(0,11).map((x,i)=>x==='enc'?'?':x).join()===SEQ.join()&&f2.src[11]==='stairs','순서: '+f2.src.join(' → '));
 ok(f2.mid[3]&&!f2.mid[0],'지상 전투룸1 은 중간보스 가능 표시');
 ok(SEQ.filter(k=>k!=='?').every(k=>f2.lbl.includes(NM[k])),'층 지도 칸 이름표에 맵 이름이 나옴 (❓ 칸은 만남)');
 for (let i = 0; i < SEQ.length; i++){
   if (SEQ[i]==='?'){
     const q = await p.evaluate((i)=>{ const R=R8S(); const nd=R.fm.rows[i][0]; const o={ e:[] }; world=null; try { r8Enter(nd); } catch(e){ o.e.push(e.message); } o.t=nd.t; o.enc=nd.enc||null; o.talk=!!TK||!!world; try { let g=0; while (TK && g++<300){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length-1][1]); continue; } talkAdv(); } } catch(e){ o.e.push('end '+e.message); } o.world=!!world; return o; }, i);
     ok(q.t==='enc'&&q.enc&&q.talk&&!q.e.length,(i+1)+'. ❓ 랜덤 인카운터: 만남이 열림 ('+q.enc+')'+(q.world?' · 싸움판':'')+(q.e.length?' '+JSON.stringify(q.e):''));
     await p.evaluate(()=>{ world=null; TK=null; try { r8NodeDone(); } catch(e){} });
     continue;
   }
   const r = await p.evaluate((i)=>{ const R=R8S(); const nd=R.fm.rows[i][0]; const o={ e:[] }; world=null; r8Enter(nd); const W=world, M=MAPS8[S.art8]; o.base=M&&M.base; o.fall=!!(M&&M.fall); o.foes=W?W.units.filter(u=>u.side!==0&&u.alive).length:-1; o.props=M?(M.props||[]).length:-1; o.onFloor=W?W.units.filter(u=>u.side===0).every(u=>M.rows[Math.floor(u.y)]&&'.r'.includes(M.rows[Math.floor(u.y)][Math.floor(u.x)])):false; o.pass=W&&W.r8&&W.r8.pass; try{ paused=true; draw(); }catch(e){ o.e.push(e.message); } return o; }, i);
   const PASS=['ruin2a','ruin2b','gfight1','fmap2','fmap3'].includes(SEQ[i]);
   if (r.e.length||!r.onFloor||r.props!==0||r.foes<1||!!r.pass!==PASS) console.log('    ??', JSON.stringify(r));
   ok(r.base===SEQ[i]&&r.foes>0&&r.props===0&&r.onFloor&&!!r.pass===PASS&&!r.e.length&&r.fall===(SEQ[i]==='fmap2'),(i+1)+'. '+NM[SEQ[i]]+': 열림 · 암계 적 '+r.foes+' (v9.3.0 — 예전엔 비어 있었음) · 소품 0 · 바닥 위 · 지나가기 '+(PASS?'열림':'아님 (계단 · 보스)')+' · 그림 오류 없음 · 낙사 '+(r.fall?'있음':'없음'));
   await p.evaluate(()=>{ world=null; r8NodeDone(); });
 }
 const st = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[11][0]; r8Enter(nd); return { f:R.f }; });
 ok(st.f===3,'아래 계단 → 3층 ('+st.f+')');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8870 OK'); await b.close(); process.exit(fails ? 1 : 0); })();
