// v9.6.1 UI 시험 — ui9100.js v1.1 (v1.1: 앞 만남 (로지나 → 단달로의 저택) 이 남긴 깃발을 매번 지움 · ❓ 연기 시험: 2층에서 나올 수 있는 만남을 하나씩 (rest 선택 포함) 들어가 대화 선택을 무작위로 누르고 · 판이 열리면 걸어 다니며 말을 걸고 · 나갈 때까지 — 오류 · 멈춤 없이)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join('|'))); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 const KEYS=['p:hobo','p:hood','f:dead','t:wam','t:rosina','t:smith','t:marie','t:nurse','t:curse','t:serpa','x:firewood','x:beach','c:card'];
 const out=[];
 for (const k of KEYS){ for (const mode of ['go','rest']){
   const r = await p.evaluate(([k,mode])=>{ const R=R8S(); const nd=R.fm.rows[2][0]; const o={ k, mode, e:[], steps:0 }; nd.t='enc'; nd.empty=false; nd.npc8=undefined; nd.comp=undefined; nd.src8=undefined; nd.peace=false; nd.enc=null; nd.restAsk=0; nd.card8=undefined; R.done=R.done.filter(x=>x!==nd.id); R.at=R.fm.rows[1][0].id; R.flags.hoboN=0; R.flags.dandal=0; R.flags.rosinaHelp=0; R.flags.hoboGave=0; R.flags.hoodRest=0; R.npcDone=[]; world=null;
     // 만남을 미리 정한 채로 쉬기 앞을 지나 가려면 enc 를 미리 두고 restAsk 만 켜 둠
     if (mode==='go'){ nd.enc=k; nd.restAsk=1; } else { nd.enc=null; }
     const w0=ENC8.map(e=>e[1]); try { if (mode==='rest'){ for (const e of ENC8) e[1]=e[0]===k?1000:0; for (const e of ENC8) { if (e[0]===k){ e[2]=1; e[3]=30; } } r8Enter(nd); } else r8Enter(nd); } catch(e){ o.e.push('enter '+e.message+' '+(e.stack||'').split('\\n')[1]); ENC8.forEach((e2,i)=>{ e2[1]=w0[i]; }); return o; } ENC8.forEach((e2,i)=>{ e2[1]=w0[i]; }); o.picked=nd.enc;
     let g=0; while (TK && g++<60){ o.steps++; if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (!L){ talkClose(); break; } if (L.go){ try { talkDo(L.go); } catch(e){ o.e.push('go '+e.message); break; } continue; } if (L.ask){ const pick=L.ask[mode==='rest'&&g<3?L.ask.length-1:Math.floor(Math.random()*L.ask.length)]; try { talkPick(pick[1]); } catch(e){ o.e.push('pick '+e.message+' '+(e.stack||'').split('\\n')[1]); break; } continue; } talkAdv(); }
     if (world&&!world.over){ const W=world; try { paused=true; draw(); for (let i=0;i<120;i++) stepWorld(W,1/30); const E=encCur(); if (E&&E.st!=='gone'&&E.st!=='dead'){ for (const u of W.units) if (u.side===0&&u.alive&&!u.summon){ u.x=E.x-1.2; u.y=E.y; } if (!TK) encTalk(E); let g2=0; while (TK && g2++<40){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (!L){ talkClose(); break; } if (L.go){ talkDo(L.go); continue; } if (L.ask){ const pick=L.ask[Math.floor(Math.random()*L.ask.length)]; if (/^!r8:mn.*(Fight|Hit)/.test(pick[1])) { talkClose(); break; } talkPick(pick[1]); continue; } talkAdv(); } } draw(); } catch(e){ o.e.push('map '+e.message+' '+(e.stack||'').split('\\n')[1]); } o.world=true; }
     if (TK) talkClose(); o.done=R.done.includes(nd.id); o.t=nd.t; world=null; try { r8MapShow(); } catch(e){ o.e.push('mapshow '+e.message); } return o; }, [k,mode]);
   out.push(r); if (r.e.length) console.log('    ERR', JSON.stringify(r)); } }
 ok(out.every(r=>!r.e.length),'만남 '+KEYS.length+'가지 × (다가감 · 쉬기) = '+out.length+'번 — 대화를 무작위로 누르며 지나가도 오류 없음');
 console.log('    ', out.map(r=>r.k+'/'+r.mode+(r.world?'·맵':'')+'('+r.steps+')').join(' '));
 for (const r of out) if (r.mode==='rest'&&r.picked!==r.k) console.log('    불일치', r.k, '→', r.picked, 'steps', r.steps);
 ok(out.filter(r=>r.mode==='rest'&&!/^f:/.test(r.k)&&r.k!=='t:serpa').every(r=>r.picked===r.k&&r.steps>0),'쉬기 선택이 먼저 뜸 (망자 싸움만 빼고) — 고른 만남이 그대로 나옴');
 ok(out.filter(r=>r.mode==='rest'&&/^f:/.test(r.k)).every(r=>r.picked===r.k),'망자 싸움 (f:) 은 쉬기 없이 바로');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
