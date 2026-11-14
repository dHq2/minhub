// v1.0 (2026-11-15, A) — 처음 인사 프롤로그: 새 사용자에게만, 호칭·하는 일·프로필 저장, 다시 안 뜸, 쓰던 사람엔 안 뜸
const { chromium } = require('playwright');
const APP = 'http://localhost:8765/sehee/';
(async () => {
  const b = await chromium.launch(); let bad = 0;
  const check = (n, c, x) => { console.log((c ? 'OK   ' : 'FAIL ') + n + (x !== undefined ? ' · ' + x : '')); if (!c) bad++; };
  const on = c => c.addInitScript(() => { try{ localStorage.removeItem('sehee.nointro'); }catch(e){} });   /* _guard 가 끈 것을 이 테스트만 다시 켬 */
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' }); await on(ctx);
  const p = await ctx.newPage(); await p.goto(APP + '#office');
  await p.waitForSelector('#vn', { timeout:15000 }); await p.waitForTimeout(500);
  await p.screenshot({ path:'/tmp/tintro-1.png' });
  const tapUntil = async sel => { for (let i = 0; i < 40; i++){ if (await p.locator(sel).first().isVisible().catch(() => false)) return true; if (!(await p.locator('#vn').count())) return false; await p.locator('.vn-box').click({ timeout:2000 }).catch(() => {}); await p.waitForTimeout(250); } return false; };
  check('호칭 고르기가 나옴', await tapUntil('.vn-c'), (await p.locator('.vn-choices').textContent()));
  await p.locator('.vn-c', { hasText:'이름으로' }).click();
  check('이름 칸', await tapUntil('.vn-ask input')); await p.locator('.vn-ask input').fill('김가상'); await p.screenshot({ path:'/tmp/tintro-2.png' }); await p.locator('.vn-ask [data-a="ok"]').click();
  check('하는 일 칸', await tapUntil('.vn-ask input')); await p.locator('.vn-ask input').fill('작은 가게 운영'); await p.locator('.vn-ask [data-a="ok"]').click();
  check('프로필 칸(여러 줄)', await tapUntil('.vn-ask textarea')); await p.locator('.vn-ask textarea').fill('아침엔 바쁨\n전화보다 문자'); await p.locator('.vn-ask [data-a="ok"]').click();
  await tapUntil('#nothing-ever'); await p.waitForTimeout(800);
  check('장면이 닫힘', !(await p.locator('#vn').count()));
  const st = await p.evaluate(async () => ({ call:AI.cfg.callMe, me:(await meLoad(), PPL.me.info.map(x => x.k + '=' + x.v).join(',')), note:PPL.me.note, intro:!!(await kvGet('intro')), sys:(await systemPrompt(AI.cfg.model || 'x')).slice(0, 120) }));
  check('호칭 저장', st.call === '김가상님', st.call);
  check('나 카드에 이름·하는 일', /이름=김가상/.test(st.me) && /하는 일=작은 가게 운영/.test(st.me), st.me);
  check('나 카드에 프로필', /전화보다 문자/.test(st.note || ''));
  check('세희 지침이 그 호칭으로', st.sys.includes("'김가상님'"), st.sys);
  await p.reload(); await p.waitForTimeout(4000);
  check('다시 열면 안 뜸', !(await p.locator('#vn').count()));
  // 쓰던 사람 — 판에 일이 있으면 안 뜸
  const c2 = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' }); await on(c2);
  const q = await c2.newPage(); await q.goto(APP); await q.waitForSelector('#vn', { timeout:15000 });
  await q.evaluate(async () => { await sceneClose(); await kvSet('intro', null); });
  await q.evaluate(async () => { await new Promise(r => setTimeout(r, 300)); });
  await q.locator('#tabPan').click(); await q.waitForTimeout(300); await q.locator('.add input').first().fill('원래 하던 일'); await q.locator('.add input').first().press('Enter'); await q.waitForTimeout(600);
  await q.evaluate(() => tx('kv', 'readwrite', s => s.delete('intro')));
  await q.reload(); await q.waitForTimeout(4500);
  check('쓰던 사람엔 안 뜸', !(await q.locator('#vn').count()) && (await q.evaluate(async () => (await kvGet('intro') || {}).skip)) === '쓰던 계정');
  // 설정에서 다시 보기
  await q.evaluate(() => settingsSheet()); await q.waitForTimeout(300); await q.locator('[data-sact="intro"]').click(); await q.waitForTimeout(1200);
  check('설정 「처음 인사 다시 보기」', await q.locator('#vn').count() === 1);
  console.log('INTRO bad', bad); await b.close(); if (bad) process.exit(1);
})();
