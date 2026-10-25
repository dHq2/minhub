// v7.11 포복 UI 시험 — ui711.js v1.1 (v1.1: v7.16.1 포복 · 일어남도 명령 — 클릭 뒤 일어나는 중이거나 전하는 중 · PC: C 키 · 명령 칸 단추 실제 클릭 · 그림 · 로그 / 모바일: 아래 칸 단추)  /* v9.7.0: 명령 칸 접기 — 시험 전에 펼침 */  /* v9.8.0: 희생 돌격 · 동시 선택 단추는 지움 (명령은 그대로 시험) · ⋯ 더 펼침 */
const { chromium } = require('playwright');
const waitT=async(p,sec)=>{ const t0=await p.evaluate(()=>world.t); for(let k=0;k<80;k++){ await p.waitForTimeout(100); if((await p.evaluate(()=>world.t))-t0>=sec) return; } };
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 { const p=await (await b.newContext({viewport:{width:1280,height:800}})).newPage(); await p.addInitScript(()=>{ window.__dockMore=true; }); await p.addInitScript(()=>{ try{ localStorage.setItem('gulOrdGrp','{"tac":true,"adv":true}'); }catch(e){} });   /* v9.7.0 명령 칸 전술 · 고급 펼침 */ const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.evaluate(()=>{ try{ dockMore=true; }catch(e){} });   /* v9.8.0 휴대폰 '⋯ 더' 펼침 */ await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
  await p.evaluate(()=>{ start(); }); await p.click('#contBtn'); await p.waitForTimeout(400);
  const ni = await p.evaluate(()=>world.units.findIndex(u=>u.name==='노먼')); await p.evaluate(i=>{ sel=new Set([i]); hud(); }, ni); await p.waitForTimeout(300);
  await p.keyboard.press('c'); await waitT(p,0.8); await p.waitForTimeout(150);
  const st = await p.evaluate(i=>{ const u=world.units[i]; return { lie: !!u.lie, sw: u.lieSw, rules: !!world.rules.lie }; }, ni);
  console.log('PC C 키', JSON.stringify(st)); ok(st.lie && !st.sw, 'C 키 → 노먼 엎드림 (끝남)');
  const btn = await p.$('#orders [data-ord="lie"]'); ok(!!btn, '명령 칸에 🦎 포복 단추');
  const cls = btn ? await btn.getAttribute('class') : ''; ok(/\bon\b/.test(cls||''), '단추가 켜짐 표시 (on)');
  const card = await p.evaluate(i=>{ const el=document.querySelector(`#party [data-ally="${i}"]`); return el ? el.innerText.replace(/\s+/g,' ') : ''; }, ni); console.log('    카드:', card.slice(0,120)); ok(/엎드림/.test(card), '아군 카드에 🦎 엎드림');
  await p.evaluate(i=>{ openDet && openDet(true); }, ni).catch(()=>{}); await p.waitForTimeout(300);
  await p.screenshot({path:'ui711_pc.png'});
  // 실제 마우스 클릭으로 일어남 (재생 중)
  await (await p.$('#orders [data-ord="lie"]')).scrollIntoViewIfNeeded(); await p.waitForTimeout(150); const bb = await (await p.$('#orders [data-ord="lie"]')).boundingBox(); await p.mouse.move(bb.x+bb.width/2, bb.y+bb.height/2); await p.mouse.down(); await p.waitForTimeout(120); await p.mouse.up(); await p.waitForTimeout(300);
  const st2 = await p.evaluate(i=>{ const u=world.units[i]; return { lie: !!u.lie, sw: u.lieSw, pend: (u.posPend||[]).filter(q=>q.key==='lie').map(q=>q.val+' '+(q.at-world.t).toFixed(2)) }; }, ni); console.log('    클릭 뒤', JSON.stringify(st2)); ok((st2.sw && st2.sw.to===false) || !st2.lie || (st2.pend.length && /^up/.test(st2.pend[0])), '단추 클릭 → 일어나는 중 (또는 전하는 중)');
  await waitT(p,1.0); ok(!(await p.evaluate(i=>world.units[i].lie, ni)), '다 일어남');
  const log = await p.evaluate(()=>logLines(world).filter(l=>/🦎/.test(l)).join('\n')); console.log(log.split('\n').map(x=>'    '+x).join('\n')); ok(/엎드려 \(포복\) — 명령/.test(log) && /일어남/.test(log), '로그에 포복 명령 · 엎드림 · 일어남');
  const kb = await p.evaluate(()=>JSON.stringify(KB_GROUPS).includes('포복')); ok(kb, '단축키 표에 C 포복');
  const tbl = await p.evaluate(()=>{ const el=document.getElementById('bodyTbl'); return el ? (el.innerText.match(/포복/g)||[]).length : 0; }); ok(tbl>10, `수치표에 포복 줄 (${tbl})`);
  ok(errs.length===0, '페이지 오류 없음 '+JSON.stringify(errs)); await p.close(); }
 { const ctx=await b.newContext({viewport:{width:412,height:915},isMobile:true,hasTouch:true,deviceScaleFactor:2.6}); const p=await ctx.newPage(); await p.addInitScript(()=>{ window.__dockMore=true; }); await p.addInitScript(()=>{ try{ localStorage.setItem('gulOrdGrp','{"tac":true,"adv":true}'); }catch(e){} });   /* v9.7.0 명령 칸 전술 · 고급 펼침 */ const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.evaluate(()=>{ try{ dockMore=true; }catch(e){} });   /* v9.8.0 휴대폰 '⋯ 더' 펼침 */ await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
  await p.evaluate(()=>{ start(); }); await p.waitForTimeout(300); await p.evaluate(()=>togglePlay()); await p.waitForTimeout(400); console.log('    모바일 재생', await p.evaluate(()=>mode));
  const ii = await p.evaluate(()=>world.units.findIndex(u=>u.name==='인주')); await p.evaluate(i=>{ sel=new Set([i]); hud(); }, ii); await p.waitForTimeout(400);
  const db = await p.$('[data-dk="lie"]'); ok(!!db, '모바일 아래 칸에 🦎 포복');
  if (db){ await p.locator('[data-dk="lie"]').tap(); await waitT(p,0.8); await p.waitForTimeout(250); }
  const st = await p.evaluate(i=>({ lie: !!world.units[i].lie, chip: !!document.querySelector(`[data-dc="${i}"] .stb.lie`), txt: (document.querySelector('[data-dk="lie"]')||{}).innerText||'' }), ii);
  console.log('    모바일', JSON.stringify(st)); ok(st.lie, '탭 → 인주 엎드림'); ok(st.chip, '아군 칩에 🦎'); ok(/엎드림/.test(st.txt), '단추 글씨 엎드림');
  await p.screenshot({path:'ui711_mob.png'}); ok(errs.length===0, '모바일 페이지 오류 없음 '+JSON.stringify(errs)); await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI711 OK'); await b.close(); })();
