// v9.3.0 UI 시험 — ui9030.js v1.0 (2층 배치: 열한 칸 모두 적 · 계단1 창방패병 10 + 장궁병 4 (위 주력 · U자 둘) · 계단2 반 · 테리 · 보스룸 흑익 · 하류 (잠김 · 전우조) · 계단 비탈 (고지대 판정) · 그림 · 오류 없음 · 스크린샷)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 const SEQ=['ruin2a','ruin2b','?','gfight1','fmap2','?','gstair1','gstair2','fmap3','?','gboss1'];
 const AB=new Set(['암계 방패병','암계 창방패병','암계 장송기사','암계 장궁병']);
 // 1. 평범한 싸움 다섯: 적이 있고 모두 암계
 for (const i of [0,1,3,4,8]) {
   const r = await p.evaluate((i)=>{ const R=R8S(); const nd=R.fm.rows[i][0]; const o={ e:[] }; world=null; try { r8Enter(nd); } catch(e){ o.e.push(e.message); } const W=world; o.names=W?W.units.filter(u=>u.side===1&&u.alive).map(u=>u.name):[]; o.onFloor=W?W.units.every(u=>W.map.t[Math.floor(u.y)*W.map.W+Math.floor(u.x)]===0):false; o.stairs=!!(W&&W.map.stairs); o.base=(MAPS8[S.art8]||{}).base; o.lock=W?W.exitLock:null; o.hills=W&&W.map.hills?W.map.hills.length:0; try { for(let k=0;k<90;k++) stepWorld(W,1/30); draw(); } catch(e){ o.e.push(e.message); } world=null; r8NodeDone(); return o; }, i);
   ok(r.base===SEQ[i]&&r.names.length>=3&&r.names.every(n=>AB.has(n))&&r.onFloor&&!r.stairs&&!r.hills&&!r.e.length,(i+1)+'. '+SEQ[i]+': 암계 병사 '+r.names.length+' ('+[...new Set(r.names)].join(' · ')+') · 바닥 위 · 비탈 없음'+(r.e.length?' '+JSON.stringify(r.e):''));
 }
 // 2. 계단 1
 const s1 = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[6][0]; const o={ e:[] }; world=null; try { r8Enter(nd); } catch(e){ o.e.push(e.message); } const W=world, m=W.map; const F=W.units.filter(u=>u.side===1&&u.alive);
   const sp=F.filter(u=>u.name==='암계 창방패병'), ar=F.filter(u=>u.name==='암계 장궁병'); o.n=[sp.length,ar.length,F.length]; o.stairs=!!m.stairs; o.lock=W.exitLock;
   o.spTop=sp.filter(u=>u.y<4.5).length; o.spPocket=sp.filter(u=>u.y>11&&u.y<14&&(u.x<3||u.x>9)).length; o.arTop=ar.filter(u=>u.y<3).length;
   o.hTop=gH(m,5.5,3), o.hMid=gH(m,5.5,7), o.hFoot=gH(m,5.5,14), o.hSide=gH(m,2,7); const me=W.units.filter(u=>u.side===0&&u.alive); o.meY=me.map(u=>u.y).reduce((a,b)=>a+b,0)/me.length; o.exit=W.stairs&&[W.stairs.x,W.stairs.y];
   // 비탈: 오르막 걸음 · 사격 보정
   const u=me[0]; u.x=5.5; u.y=7.5; const up=slopeK(W,u,0,-1), dn=slopeK(W,u,0,1); const a=W.units.find(x=>x.side===1&&x.name==='암계 장궁병');
   o.up=+up.toFixed(2); o.dn=+dn.toFixed(2); o.upFlat=(()=>{ const m0={...m}; return 1/(1+0.8*0.25); })();
   const T=(x)=>x; const ar0=me.find(x=>x!==u)||u; const lo={x:5.5,y:11,r:0.3}, hi={x:5.5,y:4,r:0.3}; const c1=terrAim(W,lo,hi,false), c2=terrAim(W,hi,lo,false); o.aimUp=+c1.toFixed(2); o.aimDn=+c2.toFixed(2);
   o.sp=!!W.units.find(x=>x.cg); try { for(let k=0;k<150;k++) stepWorld(W,1/30); draw(); } catch(e){ o.e.push(e.message); } o.alive=W.units.filter(x=>x.side===1&&x.alive).length; return o; });
 console.log('    ', JSON.stringify(s1));
 ok(s1.n[0]===10&&s1.n[1]===4&&s1.n[2]===14,'계단1: 창방패병 10 + 장궁병 4 (정확히 '+s1.n+')');
 ok(s1.spTop>=8&&s1.arTop===4,'위쪽이 주력: 창방패병 '+s1.spTop+' (≥8) · 장궁병 맨 위 줄 '+s1.arTop+' (4)');
 ok(s1.spPocket===2,'아래층 U자 공간에 창방패병 둘 ('+s1.spPocket+')');
 ok(s1.stairs&&s1.hTop>2.2&&s1.hMid>1.2&&s1.hMid<2&&s1.hFoot<0.2&&Math.abs(s1.hSide-s1.hMid)<0.4,'비탈: 꼭대기 '+s1.hTop.toFixed(2)+'M · 중간 '+s1.hMid.toFixed(2)+' · 발치 '+s1.hFoot.toFixed(2)+' · 가로 고름');
 ok(s1.up<0.78&&s1.dn>1&&s1.up<s1.upFlat,'오르막이 느림 (계단 '+s1.up+' < 보통 언덕 '+s1.upFlat.toFixed(2)+') · 내리막은 빠름 '+s1.dn);
 ok(s1.aimUp<s1.aimDn*0.75,'아래에서 위로 쏘면 잘 안 맞음 ('+s1.aimUp+') ↔ 위에서 아래로 ('+s1.aimDn+')');
 ok(s1.meY>12&&!s1.lock&&!s1.e.length,'우리는 맨 아래에서 시작 (y '+s1.meY.toFixed(1)+') · 출구 안 잠김 · 5초 돌려도 오류 없음'+(s1.e.length?' '+JSON.stringify(s1.e):''));
 await p.evaluate(()=>{ if (TK) talkClose(); draw(); });
 await p.waitForTimeout(300);
 await p.screenshot({path:'ui9030_stair1.png'});
 await p.evaluate(()=>{ world=null; r8NodeDone(); });
 // 3. 계단 2
 const s2 = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[7][0]; const o={ e:[] }; world=null; try { r8Enter(nd); } catch(e){ o.e.push(e.message); } const W=world, m=W.map; const F=W.units.filter(u=>u.side===1&&u.alive);
   o.names=F.map(u=>u.name).sort(); o.pos=F.map(u=>[u.name,+u.x.toFixed(1),+u.y.toFixed(1)]); o.cg=F.map(u=>u.cg||''); o.stairs=!!m.stairs; o.hTop=gH(m,5.5,5), o.hFoot=gH(m,5.5,14), o.hMid=gH(m,5.5,9); o.sz=F.map(u=>u.sizeCls||'');
   try { for(let k=0;k<150;k++) stepWorld(W,1/30); draw(); } catch(e){ o.e.push(e.message); } return o; });
 console.log('    ', JSON.stringify(s2));
 ok(s2.names.join()==='반,테리','계단2: 반 · 테리만 ('+s2.names+')');
 ok(s2.cg[0]&&s2.cg[0]===s2.cg[1],'반 · 테리는 전우조 (cg '+s2.cg+')');
 ok(s2.pos.every(x=>x[2]<7),'둘 다 위쪽 (y<7) 에 선다 '+JSON.stringify(s2.pos));
 ok(s2.stairs&&s2.hTop>1.2&&s2.hMid>0.4&&s2.hMid<s2.hTop&&s2.hFoot<0.1&&!s2.e.length,'계단2 비탈: 위 '+s2.hTop.toFixed(2)+'M · 발치 '+s2.hFoot.toFixed(2)+' · 오류 없음');
 await p.evaluate(()=>{ if (TK) talkClose(); draw(); });
 await p.waitForTimeout(300);
 await p.screenshot({path:'ui9030_stair2.png'});
 await p.evaluate(()=>{ world=null; r8NodeDone(); });
 // 4. 보스룸
 const bs = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[10][0]; const o={ e:[] }; world=null; try { r8Enter(nd); } catch(e){ o.e.push(e.message); } const W=world; const F=W.units.filter(u=>u.side===1&&u.alive);
   o.names=F.map(u=>u.name).sort(); o.cg=F.map(u=>u.cg||''); o.lock=W.exitLock; o.stairs=!!W.map.stairs; o.hills=W.map.hills?W.map.hills.length:0; o.pos=F.map(u=>[u.name,+u.x.toFixed(1),+u.y.toFixed(1)]);
   try { for(let k=0;k<150;k++) stepWorld(W,1/30); draw(); } catch(e){ o.e.push(e.message); } return o; });
 console.log('    ', JSON.stringify(bs));
 ok(bs.names.join()==='하류,흑익'&&bs.cg[0]&&bs.cg[0]===bs.cg[1],'보스룸: 흑익 · 하류 전우조 ('+bs.names+' / '+bs.cg+')');
 ok(bs.lock===true&&!bs.stairs&&!bs.hills&&!bs.e.length,'보스룸 출구 잠김 · 비탈 없음 · 오류 없음');
 await p.evaluate(()=>{ if (TK) talkClose(); draw(); });
 await p.waitForTimeout(300);
 await p.screenshot({path:'ui9030_boss.png'});
 await p.evaluate(()=>{ world=null; r8NodeDone(); });
 // 5. 저장 → 새로 고침 뒤에도 계단 판 (S.stairs · S.hills 저장)
 const sv = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[6][0]; world=null; r8Enter(nd); save(); return { st:S.stairs, h:(S.hills||[]).length }; });
 ok(sv.st===true&&sv.h>10,'판을 저장해도 계단이 남음 (S.stairs · 언덕 '+sv.h+')');
 await p.reload(); await p.waitForTimeout(1200);
 const re = await p.evaluate(()=>{ try { draw(); } catch(e){ return { err:e.message }; } return { st:S.stairs, h:(S.hills||[]).length, art:S.art8 }; });
 ok(!re.err&&re.st===true&&re.h>10,'새로 고침 뒤에도 같은 판 · 그림 오류 없음 '+JSON.stringify(re));
 await p.screenshot({path:'ui9030_reload.png'});
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
