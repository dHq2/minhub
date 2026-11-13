const { chromium } = require('playwright');
// v1.0 (2026-11-14, C) 판 보편 설계 — 새로 쓰는 사람 판엔 '확정된 지시' 칸이 없고, 예전 기본 칸은 한 번 정리(항목은 첫 칸에), 이름 바꾼 칸은 그대로, 꼬리표 '오늘 안에', 처리 단추 '안 함'·이름 바꾸기, 세희 지침에 직장·학원 말 없음
(async () => { const b = await chromium.launch(); const errs = [];
  const open = async (name, seed) => { const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' }); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(name + ': ' + e.message));
    if (seed){ await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1500); await p.evaluate(seed); await p.reload(); } else await p.goto('http://localhost:8765/sehee/#office');
    await p.waitForTimeout(2200); return { ctx, p }; };
  // 1) 처음 쓰는 사람
  { const { ctx, p } = await open('새 사람');
    console.log('새 사람 칸', await p.evaluate(() => secs().map(s => s.label).join(' · ')), '| 꼬리표', await p.evaluate(() => TAGS.map(t => t.k).join(' · ')), '| 알림 없음', await p.evaluate(() => !S.uniNote));
    await ctx.close(); }
  // 2) 예전 기본 칸 그대로 쓰던 사람 — 확정된 지시 칸에 항목 하나
  { const { ctx, p } = await open('예전 사람', async () => { const st = (await kvGet('settings')) || {}; st.sections = [{ id:'today', label:'오늘 할 일', color:'#a13b2c' }, { id:'sched', label:'다가오는 일정', color:'#3a6b64' }, { id:'memo', label:'기억해둘 것', color:'#a3823f' }, { id:'order', label:'확정된 지시', color:'#5f7a55' }, { id:'me', label:'개인', color:'#6b5b95' }]; delete st.uni1; await kvSet('settings', st);
      const pr = await todayPanRef(); pr.items.push({ id:'o1', sec:'order', text:'금요일까지 자료 정리', since:pr.date, tag:'퇴근 전' }); await putPan(pr); });
    await p.waitForTimeout(5000);
    const r = await p.evaluate(() => ({ 칸:secs().map(s => s.label).join(' · '), 첫칸에항목:!!document.querySelector('.sec[data-sec="today"] .it[data-id="o1"]'), 알림:$('toastMsg').textContent.slice(0, 30), 한번만:S.settings.uni1, 옛꼬리표색:(document.querySelector('.it[data-id="o1"] .tag') || {}).style ? getComputedStyle(document.querySelector('.it[data-id="o1"] .tag')).backgroundColor : '?' }));
    console.log('예전 사람', JSON.stringify(r));
    await p.reload(); await p.waitForTimeout(2500); console.log('다시 켜도 한 번만(알림 없음)', await p.evaluate(() => !S.uniNote));
    // 처리 단추 이름 — 기본 '안 함', 설정에서 바꾸기
    await p.evaluate(() => goView('pan')); await p.waitForTimeout(500);
    console.log('단추', await p.evaluate(() => [...document.querySelectorAll('.it[data-id="o1"] .wy')].map(b => b.textContent).join(' · ')));
    await p.evaluate(() => settingsSheet()); await p.waitForTimeout(300);
    await p.locator('[data-wayn="알바노"]').fill('패스'); await p.locator('[data-wayn="알바노"]').dispatchEvent('change'); await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('.wayn').scrollIntoView({ block:'center' })); await p.waitForTimeout(150); await p.screenshot({ path:'/tmp/uni-settings.png' });
    await p.evaluate(() => closeSheet()); await p.waitForTimeout(200);
    await p.locator('.it[data-id="o1"] .wy[data-w="알바노"]').tap(); await p.waitForTimeout(300);
    console.log('바꾼 단추', await p.evaluate(() => [...document.querySelectorAll('.it[data-id="o1"] .wy')].map(b => b.textContent).join(' · ') + ' | ' + document.querySelector('.it[data-id="o1"] .wyok').textContent + ' | ' + $('toastMsg').textContent), '| 세희 판 글', await p.evaluate(async () => (await panContext()).includes('(패스 — 보스가 안 하기로 닫음')));
    await p.screenshot({ path:'/tmp/uni-pan.png' });
    await p.evaluate(() => settingsSheet()); await p.waitForTimeout(300); await p.locator('[data-wayn="알바노"]').fill(''); await p.locator('[data-wayn="알바노"]').dispatchEvent('change'); await p.waitForTimeout(200);
    console.log('비우면 기본', await p.evaluate(() => wayName('알바노')));
    await ctx.close(); }
  // 3) 이름을 바꿔 쓰던 '지시' 칸은 그대로
  { const { ctx, p } = await open('이름 바꾼 사람', async () => { const st = (await kvGet('settings')) || {}; st.sections = [{ id:'today', label:'오늘 할 일', color:'#a13b2c' }, { id:'order', label:'과제', color:'#5f7a55' }]; delete st.uni1; await kvSet('settings', st); });
    console.log('이름 바꾼 칸은 그대로', await p.evaluate(() => secs().map(s => s.label).join(' · ')));
    // 세희 지침에 직장·학원 말
    const sys = await p.evaluate(async () => systemPrompt('claude-haiku-5-5'));
    console.log('세희 지침 직장·학원 말', ['퇴근', '출근', '지시', '학원', '학생', '원장', '조교'].filter(w => sys.includes(w)).join(',') || '없음');
    await ctx.close(); }
  console.log('errors', errs); await b.close(); })();
