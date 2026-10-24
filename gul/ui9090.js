// v9.6.0 UI 시험 — ui9090.js v1.0 (되돌아가기: 야전의사 (천막) 칸 바로 뒤 칸을 마친 뒤 층 지도에 ↩ 단추 · 한 번뿐 · 낙사/계단 맵 뒤에서는 안 뜸 · 다녀오면 뒤 칸의 다음 칸으로 이어짐 · 오딜의 방도)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join('|'))); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 // 1. 야전의사 칸 (row 2) → 지난 뒤 gfight1 (row 3) 을 마침 → 되돌아가기
 const a = await p.evaluate(()=>{ const R=R8S(); const X=R.fm.rows[2][0], Y=R.fm.rows[3][0], Z=R.fm.rows[4][0]; R.done=[R.fm.rows[0][0].id,R.fm.rows[1][0].id]; R.at=R.fm.rows[1][0].id; const o={ X:X.id, Y:Y.id, Z:Z.id };
   X.t='enc'; X.enc='t:nurse'; X.restAsk=1; X.src8=undefined; world=null; r8Enter(X); o.rv8=!!X.rv8; o.peace=!!X.peace; if (TK) talkClose(); world=null; r8NodeDone();   // 천막을 지나침
   o.avX=r8Avail(); r8Enter(Y); if (TK) talkClose(); world=null; r8NodeDone(); o.bk=R.bk&&[R.bk.x,R.bk.y,!!R.bk.used]; o.avY=r8Avail(); o.node=!!r8BackNode(); r8MapShow(); o.btn=!!document.querySelector('#run8 [data-r8="back"]'); o.btnTxt=(document.querySelector('#run8 [data-r8="back"]')||{}).textContent; return o; });
 console.log('    ', JSON.stringify(a));
 ok(a.rv8&&a.peace,'야전의사 (천막) 만남 칸은 되돌아갈 수 있는 칸 (비전투 맵)');
 ok(a.bk&&a.bk[0]===a.X&&a.bk[1]===a.Y&&!a.bk[2]&&a.node&&a.btn&&/야전병원/.test(a.btnTxt||''),'바로 뒤 칸을 마친 뒤 층 지도에 단추: '+(a.btnTxt||'').trim());
 const b1 = await p.evaluate(()=>{ const R=R8S(); const X=R8S().fm.rows[2][0]; document.querySelector('#run8 [data-r8="back"]').click(); const o={ at:R.at===X.id, rv:R.rv&&[R.rv.x,R.rv.y], used:R.bk&&R.bk.used, world:!!world, base:(MAPS8[S.art8]||{}).base, npc:encCur()&&encCur().npc };
   if (TK) talkClose(); const W=world; for (const u of W.units) if (u.side===0&&u.alive&&!u.summon) leaveMap(W,u,'up'); checkEnd(W); if (W.over){ mode='plan'; try { onOver(); } catch(e){ o.err=e.message; } } return o; });
 await p.waitForTimeout(300);
 console.log('    ', JSON.stringify(b1));
 ok(b1.at&&b1.rv&&b1.used&&b1.world&&b1.npc==='m_tent'&&!b1.err,'단추 → 야전병원 맵으로 다시 (한 번 썼음 · 천막이 놓임)');
 const c = await p.evaluate(()=>{ const R=R8S(); const o={}; try { campResultDone&&0; } catch(e){} if (typeof $('banner')!=='undefined'){} world=null; if (TK) talkClose(); r8NodeDone(); o.at=R.at; const X=R.fm.rows[2][0], Y=R.fm.rows[3][0]; o.av=r8Avail(); o.expect=Y.next; o.rv=R.rv; o.noY=!r8Avail().includes(Y.id); r8MapShow(); o.btn=!!document.querySelector('#run8 [data-r8="back"]'); return o; });
 console.log('    ', JSON.stringify(c));
 ok(c.av.join()===c.expect.join()&&c.noY,'다녀온 뒤: 갈 수 있는 칸 = 뒤 칸의 다음 칸 ('+c.av+') · 뒤 칸을 다시 싸우지 않음');
 ok(!c.btn,'단추는 한 번뿐 (다녀온 뒤엔 없음)');
 const d = await p.evaluate(()=>{ const R=R8S(); const Z=R.fm.rows[4][0]; world=null; r8Enter(Z); const o={ rv:R.rv, bk:R.bk }; if (TK) talkClose(); world=null; return o; });
 ok(!d.rv&&!d.bk,'다음 칸으로 가면 되돌아가기 기록이 비워짐');
 // 2. 낙사 맵 (fmap2) 뒤에서는 안 뜸
 const e2 = await p.evaluate(()=>{ const R=R8S(); const rows=R.fm.rows; const X=rows[5][0], Y=rows[6][0]; R.at=rows[4][0].id; R.done=[R.at]; X.t='enc'; X.enc='t:nurse'; X.restAsk=1; X.src8=undefined; X.peace=false; X.rv8=false; world=null; r8Enter(X); if (TK) talkClose(); world=null; r8NodeDone(); r8Enter(Y); if (TK) talkClose(); world=null; r8NodeDone(); const o={ oneWay:r8OneWay(Y), src:Y.src8, node:!!r8BackNode(), bk:R.bk&&[R.bk.x,R.bk.y] }; return o; });
 console.log('    ', JSON.stringify(e2));
 ok(e2.oneWay&&!e2.node,'계단 맵 (gstair1) 뒤에서는 되돌아갈 수 없음 (못 가는 맵) — 단추 없음');
 // 3. 오딜의 방
 const f = await p.evaluate(()=>{ const R=R8S(); const rows=R.fm.rows; const X=rows[9][0], Y=rows[10][0]; R.at=rows[8][0].id; R.done=[R.at]; X.t='enc'; X.enc='odile'; X.restAsk=1; world=null; r8Enter(X); const o={ rv8:!!X.rv8, world:!!world }; if (TK) talkClose(); world=null; R.done.push(X.id); r8NodeDone(); return o; });
 ok(f.rv8,'오딜의 방 칸도 되돌아갈 수 있는 칸 (rv8)');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
