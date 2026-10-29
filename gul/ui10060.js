// v9.14.0 UI 시험 — ui10060.js v1.0 (v1.0: 2층 1S 헌팅나이프 · 카밀라 = 제3세력: 2편 · 전우조 · 매번 나옴 · 우리 편과 서로 먼저 안 노림 · 다시 하기에도 그대로 · 지정해 공격하면 둘 다 적대 · 정리 셈에서 빠짐 · 적대 뒤엔 영입 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join('|'))); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 // 1. 입구
 const a = await p.evaluate(()=>{ const R=R8S(); const nd=R.fm.rows[0][0]; const o={ spawn:0, runs:12, ourT:0, simT:0, simVs1:0, prov:0, e:[] };
  for (let r=0;r<o.runs;r++){ world=null; r8Enter(nd); while (TK){ if (TK.timer) talkDone(); talkAdv(); } const W=world, G=W.units.filter(u=>u.r8guest==='sim'); if (G.length===2&&G.every(u=>u.side===2&&u.peace0&&u.cg==='sim')) o.spawn++;
   for (let i=0;i<600;i++){ stepWorld(W,1/30); for (const u of W.units){ if (u.side===0&&u.target&&u.target.r8guest==='sim') o.ourT++; if (u.r8guest==='sim'&&u.target&&u.target.side===0) o.simT++; if (u.r8guest==='sim'&&u.target&&u.target.side===1) o.simVs1++; } }
   if (G.some(u=>u.prov0)) o.prov++; }
  o.re=[]; for (let k=0;k<3;k++){ resetToEdit(); start(); const G=world.units.filter(u=>u.r8guest==='sim'); o.re.push([G.length, G.every(u=>u.side===2&&u.peace0), !!(world.r8&&world.r8.third), !!world.stairs]); }
  const W2=world; for (const u of W2.units) if (u.side===1) u.alive=false; W2.cleared=false; checkEnd(W2); o.clearPeace=!!W2.cleared;
  W2.cleared=false; const G2=W2.units.filter(u=>u.r8guest==='sim'), t=G2[0]; t.seenBy=1; const h=W2.units.find(u=>u.side===0&&u.alive&&!u.summon); sel=new Set([h.i]); selId=h.i; giveAttack(t);
  o.provBoth=G2.every(u=>u.prov0); o.log=W2.log.filter(l=>l.k==='provoke').length; o.logTxt=(document.getElementById('log')||{}).textContent||''; checkEnd(W2); o.clearProv=!!W2.cleared;
  for (let i=0;i<90;i++) stepWorld(W2,1/30); o.hunt=G2.filter(u=>u.target&&u.target.side===0).length;
  R.flags.simGone=0; W2.r8.thirdDone=0; const ret=r8AfterThird(W2, r8Node(R.at), ()=>{}); o.after={ ret, gone:R.flags.simGone, ask: TK? TK.lines.some(l=>l.ask):null, txt: TK? TK.lines.map(l=>l.narr||'').join('|'):'' }; if (TK) talkClose(); return o; });
 console.log('    ', JSON.stringify(a).slice(0,600));
 ok(a.spawn===a.runs,'12판 모두 둘이 나옴 (제3세력 2편 · 비선공 · 전우조 sim) — '+a.spawn+'/'+a.runs);
 ok(a.ourT===0&&a.simT===0,'우리 편과 서로 먼저 노리지 않음 (20초 × 12판 — 우리→둘 '+a.ourT+' · 둘→우리 '+a.simT+')');
 ok(a.simVs1>0,'둘은 암계 병사와는 싸움 ('+a.simVs1+')'); ok(a.prov===0,'곁불 (휩쓸기 · 빗나간 탄) 로는 적대하지 않음');
 ok(a.re.every(x=>x[0]===2&&x[1]&&x[2]&&x[3]),'다시 하기 3번 — 둘 · 제3세력 · 판 설정 (출구) 그대로 '+JSON.stringify(a.re));
 ok(a.clearPeace,'적대 안 한 둘만 남으면 맵 정리'); ok(a.provBoth&&a.log>=1&&!a.clearProv,'지정해 공격 → 둘 다 적대 (로그) · 정리 셈에 다시 들어감');
 ok(a.hunt===2,'적대한 둘이 우리 편을 노림 (반격)'); ok(a.after.ret&&a.after.gone===1&&!a.after.ask,'적대한 뒤엔 영입 묻지 않음 — '+a.after.txt.slice(0,40));
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,2)));
 await b.close(); console.log(fails?'FAIL '+fails:'ALL OK'); })();
