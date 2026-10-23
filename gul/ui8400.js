// (v8.8.7: 2층이 고정층 (무너진 유적) 이 되어, 옛 2층 흐름을 쓰는 이 시험은 FIX8[2] 를 지우고 시작)
// v8.4.0 UI 시험 — ui8400.js v1.4 (v1.4: 다친 동료 · 흩어짐 시험도 세르파가 보는 빈 바닥에 적을 세움 (슬라임을 다 뽑은 뒤 합치기 바로 앞에 다시 세움) (v8.7.3 끝난 맵에서 동료가 기준을 따라 움직여 자리가 달라짐 — 오른쪽 몇 칸이 바위일 수 있음) · v1.3: 우박 시험은 세르파가 보이는 빈 바닥에 적을 세움 · v1.2: 다친 동료 시험도 적이 없으면 새로 세움 · v1.1: 흩어짐 시험은 세르파가 멀쩡하고 적이 보이는 자리에서 · v1.0: 세르파 슬라임 조직: 동료 세르파 (체력 90) 가 슬라임을 뽑음 · 상한 · 넷 → 합침 (상황에 맞는 것 · 레이더) · 합치는 중 셋 아래로 줄면 흩어짐 · 레이더 (벽 너머 앎) · 수정 우박 · 세르파가 쓰러지면 작은 슬라임만 녹음 · 동료가 모두 쓰러지면 아군 소환도 녹음 → 전멸 (넘어감 아님) · 보스 세르파 (적 쪽 같은 규칙 · 맵이 끝나지 않음) · 다음 판에 소환이 남지 않음 · 정산 셈 · 휴대폰 칩)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); }";
 const LIB = `window.__mk = (k, side) => side === 1 ? foe8(k, 2) : { ...fromDesign({ ...clone(FOE8[k]), side: 0, traits: (FOE8[k].traits || []).filter(t => t !== '보스'), ...(FOE8[k].allyOv ? { ov: { ...FOE8[k].ov, ...FOE8[k].allyOv } } : {}) }, 0), id: uid() };
  window.__put = (W, k, side, x, y) => { const p = { ...__mk(k, side), x, y }; S.units.push(p); return addUnit(W, p); };
  window.__mid = W => { const m = W.map, cx = m.W / 2, cy = m.H / 2; let best = null, bd = 1e9; for (let y = 1; y < m.H - 1; y++) for (let x = 1; x < m.W - 1; x++){ if (m.t[y * m.W + x] !== 0) continue; let open = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++){ const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < m.W && yy < m.H && m.t[yy * m.W + xx] === 0) open++; } if (open < 25) continue; const d = Math.hypot(x - cx, y - cy); if (d < bd){ bd = d; best = { x: x + 0.5, y: y + 0.5 }; } } return best || { x: cx, y: cy }; };
  window.__see = (W, s, d0, d1, e) => { const m = W.map; let any = null; for (let y = 1; y < m.H - 1; y++) for (let x = 1; x < m.W - 1; x++){ const cx = x + 0.5, cy = y + 0.5, d = Math.hypot(cx - s.x, cy - s.y); if (m.t[y * m.W + x] !== 0 || d < d0 || d > d1 || !losClear(m, s.x, s.y, cx, cy) || boxRock(W, cx, cy, 0.45)) continue; if (!e) return { x: cx, y: cy }; const ox = e.x, oy = e.y; e.x = cx; e.y = cy; const ok = canSee(W, s, e); e.x = ox; e.y = oy; if (ok) return { x: cx, y: cy }; any = any || { x: cx, y: cy }; } return any || { x: s.x + d0, y: s.y }; };
  window.__run = (W, sec) => { const t1 = W.t + sec; while (W.t < t1 && !W.over){ stepWorld(W, 0.05); sp8Tick(W); } };`;
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); await ctx.addInitScript('window.__askAuto=true'); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.dismiss());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000); await p.evaluate(()=>{ delete FIX8[2]; });   /* v8.8.7 옛 2층 (무작위 지대) 흐름으로 시험 */
 console.log('== '+vw.nm); await p.evaluate(LIB);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); }); await p.waitForTimeout(300);
 await p.evaluate((TE)=>{ eval(TE); if (typeof ldEnd==='function') ldEnd(true); }, TALKEND);
 // 1. 동료 세르파 → 슬라임 뽑기 · 상한
 const a = await p.evaluate(()=>{ const W=world; paused=true; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } const c=__mid(W); const s=__put(W,'세르파',0,c.x,c.y); __run(W,2.5);
   const n1=W.units.filter(u=>u.summon==='slime'&&u.alive&&u.side===0).length; __run(W,25); const n2=W.units.filter(u=>u.summon==='slime'&&u.alive&&u.side===0).length, ups=W.units.filter(u=>u.summon==='up'&&u.alive).length;
   return { max: s.max, boss: s.traits.includes('보스'), n1, n2, ups, chips: [...document.querySelectorAll('#dChips [data-dc]')].length }; });
 console.log('    뽑기', JSON.stringify(a)); ok(a.max===90&&!a.boss,'동료 세르파: 체력 90 · [보스] 없음'); ok(a.n1>=1,'몇 초 뒤 작은 슬라임을 뽑음 ('+a.n1+')'); ok(a.n2===SP(5)&&a.ups===0,'적이 없으면 상한 5마리까지 곁에 두고 합치지 않음 ('+a.n2+' · 합친 것 '+a.ups+')');
 function SP(n){ return n; }
 // 2. 적이 보이면 넷 → 합침 (가까우면 몽 · 다친 동료가 있으면 튤린) · 레이더
 const m = await p.evaluate(()=>{ const W=world, s=W.units.find(u=>u.name==='세르파'&&u.side===0); const e=__put(W,'하수구 망자',1,s.x+2.2,s.y); e.ccRes=1; e.stunT=W.t+60; const sl0=W.units.filter(u=>u.summon==='slime'&&u.alive).length; W.sp8.o[s.i].mgT=W.t; __run(W,0.2);
   const mg=W.sp8.o[s.i].mg && { ...W.sp8.o[s.i].mg }; __run(W,1.6); const up=W.units.find(u=>u.summon==='up'&&u.alive); const sl1=W.units.filter(u=>u.summon==='slime'&&u.alive).length, melted=W.units.filter(u=>u.gone==='merge').length;
   return { mg: mg&&mg.kind, n: mg&&mg.ids.length, up: up&&up.name, radar: up&&up.radar, sl0, sl1, melted, side: up&&up.side, tr: up&&up.traits.includes('레이더') }; });
 console.log('    합침', JSON.stringify(m)); ok(m.n===4,'싸움 중에 넷을 모아 엉김'); ok(m.up==='몽'&&m.side===0,'적이 가까우면 몽 (탱커) — 우리 편 ('+m.up+')'); ok(m.radar&&m.tr,'합친 것은 [레이더]'); ok(m.melted>=4&&m.sl1<=m.sl0-3,'엉긴 넷은 녹아 하나가 됨 (작은 슬라임 '+m.sl0+' → '+m.sl1+')');
 const h = await p.evaluate(()=>{ const W=world, s=W.units.find(u=>u.name==='세르파'&&u.side===0), o=W.sp8.o[s.i]; const ally=W.units.find(u=>u.side===0&&!u.summon&&u.alive&&u!==s); ally.hp=ally.max*0.3; const e=W.units.find(u=>u.side===1&&u.alive)||__put(W,'하수구 망자',1,s.x+5,s.y); e.hp=e.max; e.stunT=W.t+60; { const c=__see(W,s,4.5,6.5,e); e.x=c.x; e.y=c.y; }
   while (W.units.filter(u=>u.summon==='slime'&&u.alive).length<4) { o.next=W.t; sp8Tick(W); stepWorld(W,0.05); } { const c=__see(W,s,4.5,6.5,e); e.x=c.x; e.y=c.y; } o.mgT=W.t; o.hailT=W.t+99; sp8Tick(W); const k=o.mg&&o.mg.kind; __run(W,1.6); const ups=W.units.filter(u=>u.summon==='up'&&u.alive).map(u=>u.name);
   ally.hp=ally.max*0.3; while (W.units.filter(u=>u.summon==='slime'&&u.alive).length<4) { o.next=W.t; sp8Tick(W); stepWorld(W,0.05); } o.mgT=W.t; sp8Tick(W); const k3=o.mg&&o.mg.kind; if (o.mg) __run(W,1.6);
   return { k, ups, k3, n: W.units.filter(u=>u.summon==='up'&&u.alive).length }; });
 console.log('    다친 동료', JSON.stringify(h)); ok(h.k==='튤린','다친 동료가 있으면 튤린 (치유)'); ok(!h.k3&&h.n===2,'합친 것은 둘까지 (셋째는 안 만듦)');
 // 3. 합치는 중 셋 아래로 줄면 흩어짐
 const sc = await p.evaluate(()=>{ const W=world, s=W.units.find(u=>u.name==='세르파'&&u.side===0), o=W.sp8.o[s.i]; for (const u of W.units) if (u.summon==='up'&&u.alive){ u.alive=false; u.hp=0; } const e=W.units.find(u=>u.side===1&&u.alive)||__put(W,'하수구 망자',1,s.x+3,s.y); e.hp=e.max; { const c=__see(W,s,2.5,3.6,e); e.x=c.x; e.y=c.y; } e.stunT=W.t+60; s.stunT=0; s.proneT=0; s.hp=s.max;
   while (W.units.filter(u=>u.summon==='slime'&&u.alive).length<4) { o.next=W.t; sp8Tick(W); stepWorld(W,0.05); } { const c=__see(W,s,2.5,3.6,e); e.x=c.x; e.y=c.y; } o.mgT=W.t; o.hailT=W.t+99; sp8Tick(W); const ids=o.mg?o.mg.ids:[]; ids.slice(0,2).forEach(i=>{ W.units[i].alive=false; W.units[i].hp=0; }); __run(W,1.6);
   return { started: ids.length, up: W.units.filter(u=>u.summon==='up'&&u.alive).length, log: W.log.some(l=>l.k==='r8'&&/흩어졌다/.test(l.s)) }; });
 console.log('    흩어짐', JSON.stringify(sc)); ok(sc.started===4&&sc.up===0&&sc.log,'엉기는 동안 둘을 잃으면 흩어짐 (합친 것 없음)');
 // 4. 레이더: 벽 너머 · 어둠 속 적도 앎 (양쪽 같은 규칙)
 const r = await p.evaluate(()=>{ const W=world, s=W.units.find(u=>u.name==='세르파'&&u.side===0), o=W.sp8.o[s.i]; o.next=W.t+99; o.mgT=W.t+99; o.hailT=W.t+99;
   const up=__put(W,'핀',0,s.x,s.y+0.6); up.summon='up'; up.owner=s.i; const m=W.map; let fp=null; for (let y=1;y<m.H-1&&!fp;y++) for (let x=1;x<m.W-1;x++){ const d=Math.hypot(x+0.5-up.x,y+0.5-up.y); if (m.t[y*m.W+x]===0&&d>9&&d<12.5){ fp={x:x+0.5,y:y+0.5}; break; } } const far=__put(W,'하수구 망자',1,fp.x,fp.y); far.stunT=W.t+60; far.stealthE=0.01; const before=canSee(W,s,far);
   W.rpNext=W.t; __run(W,0.1); const seen=canSee(W,up,far), seenS=canSee(W,s,far), rp=far.rpT&&far.rpT[0]>W.t; __run(W,1.5); const after=canSee(W,up,far)&&!(far.rpT[0]>W.t);
   return { radar: up.radar, seen, rp, seenS, before, gone: !after || canSee(W,up,far) }; });
 console.log('    레이더', JSON.stringify(r)); ok(r.radar&&r.rp&&r.seen,'레이더 맥박 → 9 ~ 12칸 밖 적도 앎 (벽 · 어둠과 상관없이)');
 // 5. 수정 우박
 const hl = await p.evaluate(()=>{ const W=world, s=W.units.find(u=>u.name==='세르파'&&u.side===0), o=W.sp8.o[s.i]; for (const u of W.units) if (u.side===1&&u.alive){ u.alive=false; u.hp=0; }
   s.stunT=0; s.proneT=0; s.hp=s.max; const m=W.map; let c=null; for (let y=1;y<m.H-1&&!c;y++) for (let x=1;x<m.W-2;x++){ const d=Math.hypot(x+0.5-s.x,y+0.5-s.y); if (m.t[y*m.W+x]===0&&m.t[y*m.W+x+1]===0&&d>2.5&&d<4&&losClear(m,s.x,s.y,x+0.5,y+0.5)){ c={x:x+0.5,y:y+0.5}; break; } } const e1=__put(W,'하수구 망자',1,c.x,c.y), e2=__put(W,'하수구 망자',1,c.x+0.6,c.y); e1.seenBy=e2.seenBy=true; [e1,e2].forEach(e=>{ e.stunT=W.t+60; }); const hp1=e1.hp, hp2=e2.hp; o.hailT=W.t; o.mgT=W.t+99; sp8Tick(W); const n=W.sp8.hail.length; const hx=W.sp8.hail[0]; e1.x=hx.x; e1.y=hx.y; e2.x=hx.x+0.6; e2.y=hx.y; W.t=hx.t+0.01; sp8Tick(W);
   return { n, d1: Math.round(hp1-e1.hp), d2: Math.round(hp2-e2.hp), left: W.sp8.hail.length, log: W.log.some(l=>l.k==='r8'&&/우박/.test(l.s)) }; });
 console.log('    우박', JSON.stringify(hl)); ok(hl.n===1&&hl.log,'보이는 적 무리에 수정 우박 예고'); ok(hl.d1>0&&hl.d2>0&&hl.left===0,'예고 원 안의 적 둘 모두 맞음 ('+hl.d1+' · '+hl.d2+')');
 // 6. 세르파가 쓰러지면 작은 슬라임만 녹음
 const dd = await p.evaluate(()=>{ const W=world, s=W.units.find(u=>u.name==='세르파'&&u.side===0), o=W.sp8.o[s.i]; for (let i=0;i<3;i++){ o.next=W.t; sp8Tick(W); }
   const sl=W.units.filter(u=>u.summon==='slime'&&u.alive&&u.side===0).length, up=W.units.filter(u=>u.summon==='up'&&u.alive&&u.side===0).length; hurtRaw(W,s,s,9999,{tag:'시험'}); sp8Tick(W);
   return { sl, up, sl2: W.units.filter(u=>u.summon==='slime'&&u.alive&&u.side===0).length, up2: W.units.filter(u=>u.summon==='up'&&u.alive&&u.side===0).length, dead: !s.alive }; });
 console.log('    왕을 잃음', JSON.stringify(dd)); ok(dd.dead&&dd.sl>0&&dd.sl2===0,'세르파가 쓰러지면 작은 슬라임은 녹음'); ok(dd.up>0&&dd.up2===dd.up,'합친 것은 남음');
 // 7. 정산 셈 · 휴대폰 칩
 const st = await p.evaluate(()=>{ const W=world; renderDock(W); const rows=stageStats(W); return { rows: rows.length, sum: rows.some(r=>/슬라임|몽|핀|튤린|굴란/.test(r.name)), real: W.units.filter(u=>u.side===0&&!u.summon).length, chips: [...document.querySelectorAll('#dChips [data-dc]')].map(b=>W.units[+b.dataset.dc]).filter(u=>u&&u.summon==='slime').length }; });
 ok(st.rows===st.real&&!st.sum,'정산 셈에 소환은 없음 ('+st.rows+')'); if (vw.mob) ok(st.chips===0,'휴대폰 조작판에 작은 슬라임 칩 없음');
 // 8. 동료가 모두 쓰러지면 아군 소환도 녹음 → 전멸
 const w8 = await p.evaluate(()=>{ const W=world; for (const u of W.units) if (u.side===1&&u.alive){ u.alive=false; u.hp=0; } const e=__put(W,'하수구 망자',1,1.5,1.5); e.stunT=W.t+60;
   for (const u of W.units) if (u.side===0&&!u.summon&&u.alive){ u.alive=false; u.hp=0; } const before=W.units.filter(u=>u.side===0&&u.summon&&u.alive).length; __run(W,0.3); return { before, after: W.units.filter(u=>u.side===0&&u.alive).length, over: W.over, res: W.result }; });
 console.log('    전멸', JSON.stringify(w8)); ok(w8.before>0&&w8.after===0&&w8.over&&w8.res==='lose','동료가 모두 쓰러지면 아군 소환도 녹고 전멸 (넘어감 아님)');
 // 9. 다음 판에 소환이 남지 않음 · 보스 세르파 (적 쪽 같은 규칙)
 const bs = await p.evaluate(async ()=>{ resetToEdit(); setMode('train'); await new Promise(r=>setTimeout(r,80)); S.units.push({ ...__mk('슬라임',0), x: 3, y: 3, summon: 'slime' }); start(); await new Promise(r=>setTimeout(r,80));
   const W=world; paused=true; const n1=W.units.filter(u=>u.summon).length + S.units.filter(q=>q.summon).length;
   const c=__mid(W); const s=__put(W,'세르파',1,c.x,c.y); for (const u of W.units) if (u.side===1&&u!==s){ u.alive=false; u.hp=0; } for (const u of W.units) if (u.side===0){ u.stunT=W.t+60; u.x=Math.min(W.map.W-1.5,u.x); }
   const ov0=W.over; __run(W,4); const sl=W.units.filter(u=>u.summon==='slime'&&u.side===1);
   s.alive=false; s.hp=0; __run(W,0.3);
   return { n1, ov0, sAlive: s.alive, sl: sl.length, own: sl.every(u=>u.owner===s.i), melt: W.units.filter(u=>u.summon==='slime'&&u.side===1&&u.alive).length, over: W.over, res: W.result, mode: S.mode }; });
 console.log('    보스 · 다음 판', JSON.stringify(bs)); ok(bs.n1===0,'새 판에는 지난 판의 소환이 남지 않음'); ok(bs.sl>=1&&bs.own,'적 세르파도 같은 규칙으로 슬라임을 뽑음'); ok(bs.melt===0&&bs.over&&bs.res==='win','적 세르파가 쓰러지면 작은 슬라임도 녹고 판이 끝남');
 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 await ctx.close(); }
 console.log(fails ? 'FAIL '+fails : 'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
