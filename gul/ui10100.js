// v9.14.3 UI 시험 — ui10100.js v1.0 (v1.0: 부상이 다음 판 · 다음 층으로 이어짐 — 여정에서 다친 채 맵을 나가면 다음 싸움에도 팔 · 눈 · 다리 골절 · 힘줄 · 배수 · 부상 글 그대로 · 뇌진탕 · 출혈은 넘기지 않음 · 층을 올라가도 그대로 · 훈련장은 안 남김)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join('|'))); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 // 1. 입구
 const a = await p.evaluate(async ()=>{ const R=R8S(); const o={ e:[] }; const nd=R.fm.rows[0][0];
  const skip=()=>{ let g=0; while (TK && g++<60){ if (TK.timer) talkDone(); const l=TK.lines[TK.i]; if (l&&l.ask){ talkPick(l.ask[l.ask.length-1][1]); continue; } if (l&&l.go){ talkDo(l.go); continue; } talkAdv(); } if (TK) talkClose(); };
  nd.third=undefined; world=null; r8Enter(nd); skip(); let W=world; const A=W.units.filter(u=>u.side===0&&u.alive&&!u.summon&&!wholeBody(u)); const a1=A[0], a2=A[1], en=W.units.find(u=>u.side===1);
  maimArm(W,a1,en.i,'날붙이','R'); woundAdd(W,en,a1,'tendon','팔 힘줄이 끊김',[]); a1.atkMul*=0.7; maimEye(W,a2,en.i); woundAdd(W,en,a2,'legBreak','다리 골절',[]); a2.spdMul*=0.5; woundAdd(W,en,a2,'daze','뇌진탕',[],{until:W.t+12}); startBleed(W,a2,en.i,2);
  o.before=[a1,a2].map(u=>({n:u.name, arms:JSON.stringify(u.arms), eye:u.eyeLost, atk:+u.atkMul.toFixed(2), spd:+u.spdMul.toFixed(2), w:u.wounds.length}));
  for (const u of W.units){ if (u.side===0&&u.alive){ u.gone='up'; u.alive=false; } else if (u.side!==0) { u.alive=false; } } W.cleared=true; W.over=true; W.result='exit';
  try { r8Over(); } catch(e){ o.e.push('over '+e.message); } skip(); await new Promise(r=>setTimeout(r,60)); skip();
  const P=R.party; o.snap=[a1.name,a2.name].map(n=>{ const p=P.find(x=>x.name===n); return p&&p.injC?{arms:p.injC.arms, eyes:p.injC.eyes, atk:p.injC.atk, spd:p.injC.spd, inj:p.injC.inj.map(w=>w.k)}:null; });
  const fight=(n)=>{ R.at=null; const nx=R.fm.rows.flat().find(x=>x.t==='fight'&&!R.done.includes(x.id)&&x!==nd) || R.fm.rows[1][0]; nx.t='fight'; nx.third=undefined; world=null; r8Enter(nx); skip(); return world; };
  const chk=(W)=>[a1.name,a2.name].map(n=>{ const u=W.units.find(x=>x.side===0&&x.name===n); return u?{arms:JSON.stringify(u.arms), eye:u.eyeLost, atk:+u.atkMul.toFixed(2), spd:+u.spdMul.toFixed(2), inj:(u.inj||[]).map(w=>w.k), bleed:!!u.bleed, log:W.log.some(l=>l.k==='r8'&&/지난 부상/.test(l.s||'')&&l.s.includes(n))}:null; });
  try { o.next=chk(fight()); } catch(e){ o.e.push('next '+e.message); }
  try { r8FloorEnter(R.f+1); await new Promise(r=>setTimeout(r,60)); if (R.drawCards) r8DrawTake(R.drawCards); o.floor=chk(fight()); } catch(e){ o.e.push('floor '+e.message); }
  return o; });
 console.log('    ', JSON.stringify(a).slice(0,900));
 const [n1,n2]=a.next||[];
 ok(a.snap&&a.snap[0]&&a.snap[1],'맵을 나갈 때 두 사람의 부상을 명단에 남김');
 ok(n1&&/절단/.test(n1.arms)&&n1.atk===a.before[0].atk&&n1.inj.includes('tendon'),'다음 싸움: 잘린 오른팔 · 힘줄 · 공격 ×'+(n1&&n1.atk)+' 그대로');
 ok(n2&&n2.eye===1&&n2.spd===a.before[1].spd&&n2.inj.includes('legBreak'),'다음 싸움: 눈 하나 · 다리 골절 · 속력 ×'+(n2&&n2.spd)+' 그대로');
 ok(n2&&!n2.inj.includes('daze')&&!n2.bleed,'뇌진탕 · 출혈은 넘기지 않음'); ok(n1&&n1.log&&n2.log,'로그: 지난 부상 그대로');
 const [f1,f2]=a.floor||[]; ok(f1&&/절단/.test(f1.arms)&&f2&&f2.eye===1&&f2.inj.includes('legBreak'),'층을 올라가도 부상 그대로');
 ok(!a.e.length&&!errs.length,'페이지 오류 없음 '+JSON.stringify([a.e,errs].flat().slice(0,3)));
 await b.close(); console.log(fails?'FAIL '+fails:'ALL OK'); })();
