// v8.8.7 2층 맵 UI 시험 — ui8870.js v1.0 (맵 5장 · 칸 크기 · 1층이 끝나면 2층 · 입구 → 계단 → 회랑/방 → 아래 계단 · 아무것도 없음 · 그림 오류 없음 · 스크린샷)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 // 1) 맵 등록
 const m = await p.evaluate(()=>{ const o={}; for (const k of ['ruin2a','ruin2b','ruin2c','ruin2c1','ruin2c2']){ const M=MAPS8[k]; if(!M){ o[k]=null; continue; } const fl=M.rows.join('').split('.').length-1; o[k]={ nx:M.NX, ny:M.NY, cs:Math.round(M.cs), z:M.z, fl, inn:M.in, out:M.out, amb:M.amb, rowsOk:M.rows.length===M.NY&&M.rows.every(r=>r.length===M.NX), outFloor:M.rows[M.out[1]][M.out[0]]==='.', inFl:(()=>{ let n=0; for(let y=M.in[1];y<=M.in[3];y++) for(let x=M.in[0];x<=M.in[2];x++) if(M.rows[y][x]==='.') n++; return n; })() }; } return o; });
 console.log('    ', JSON.stringify(m).slice(0,700));
 ok(Object.values(m).every(v=>v&&v.rowsOk&&v.outFloor&&v.inFl>=7&&v.z===1),'맵 5장: 칸 지도 · 들어서는 곳 7칸 이상 · 나가는 칸 바닥 · 확대 없음 (z=1)');
 ok(m.ruin2a.nx===15&&m.ruin2b.nx===18&&m.ruin2c.nx===18&&Math.abs(m.ruin2a.cs-102)<=1&&Math.abs(m.ruin2b.cs-85)<=1,'칸 크기: 사람 그림 크기에 맞춤 (입구 102px · 계단 · 회랑 85px)');
 ok(m.ruin2a.amb<m.ruin2b.amb,'입구는 약간 어두움 (amb '+m.ruin2a.amb+' < '+m.ruin2b.amb+')');
 // 2) 1층 끝나면 2층
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 const f2 = await p.evaluate(()=>{ const R=R8S(); const F=F8[R.f]||{}; const rows=R.fm.rows; return { f:R.f, name:F.name, n:rows.length, types:rows.map(r=>r.map(x=>x.t+(x.src8?':'+x.src8:'')).join('/')), fixed:F.fixed8 }; });
 console.log('    ', JSON.stringify(f2));
 ok(f2.f===2&&f2.name==='무너진 유적'&&f2.n===4,'1층이 끝나면 2층 · 무너진 유적 · 칸 4줄');
 ok(f2.types[0]==='fight:ruin2a'&&f2.types[1]==='fight:ruin2b'&&f2.types[2]==='fight'&&f2.types[3]==='stairs','입구 → 계단 → 회랑/방 → 아래 계단 ('+f2.types.join(' → ')+')');
 // 3) 칸마다 들어가 봄
 const seen = [];
 for (let i = 0; i < 3; i++){
   const r = await p.evaluate((i)=>{ const R=R8S(); const nd=R.fm.rows[i][0]; const o={ e:[] }; r8Enter(nd); const W=world; const M=MAPS8[S.art8]; o.art=S.art8; o.base=M&&M.base; o.nx=M&&M.NX; o.ny=M&&M.NY; o.props=M&&(M.props||[]).length; o.foes=W?W.units.filter(u=>u.side!==0&&u.alive).length:-1; o.allies=W?W.units.filter(u=>u.side===0).length:0; o.exitLock=W&&W.exitLock; o.pass=W&&W.r8&&W.r8.pass;
     o.onFloor=W?W.units.filter(u=>u.side===0).every(u=>{ const cx=Math.floor(u.x), cy=Math.floor(u.y); return M.rows[cy]&&'.r'.includes(M.rows[cy][cx]); }):false;
     try { paused=true; draw(); } catch (e) { o.e.push('draw '+e.message); } o.pxPerUnit = M.cs; window['__shot'+i]=1; return o; }, i);
   console.log('    ', i, JSON.stringify(r)); seen.push(r);
   await p.screenshot({ path: 'ui8870_'+i+'.png' }).catch(()=>{});
   ok(!r.e.length,'그림 오류 없음 (칸 '+(i+1)+')');
   ok(r.foes===0&&r.props===0,'아무것도 없음 — 적 0 · 소품 0 (칸 '+(i+1)+')');
   ok(r.allies>=1&&r.onFloor,'아군이 바닥에 서 있음 (칸 '+(i+1)+')');
   await p.evaluate(()=>{ world=null; r8NodeDone(); });
 }
 ok(seen[0].base==='ruin2a'&&seen[1].base==='ruin2b'&&['ruin2c','ruin2c1','ruin2c2'].includes(seen[2].base),'칸 맵: 입구 · 계단 · 회랑/방 중 하나 ('+seen.map(s=>s.base).join(', ')+')');
 // 4) 아래 계단 → 3층
 const st = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[3][0]; r8Enter(nd); return { f:R.f }; });
 ok(st.f===3,'아래 계단 → 3층 ('+st.f+')');
 // 5) 회랑/방 무작위: 여러 번 뽑으면 둘 이상 나옴 (층 다시 들어가 뽑기)
 const pool = await p.evaluate(()=>{ const R=R8S(); R.f=2; const S2=new Set(); for(let i=0;i<30;i++){ R.fm=r8Gen(2); const nd=R.fm.rows[2][0]; nd.seed=1+i*7919; R.lastSrc8=null; const id=r8MapFor(nd); S2.add(MAPS8[id]&&MAPS8[id].base); } return [...S2]; });
 console.log('    무작위', JSON.stringify(pool)); ok(pool.length>=2&&pool.every(k=>['ruin2c','ruin2c1','ruin2c2'].includes(k)),'3번째 칸은 방 · 회랑 · 둘 이은 것 중 무작위 ('+pool.join(',')+')');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8870 OK'); await b.close(); process.exit(fails ? 1 : 0); })();
