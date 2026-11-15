/* tgdrive v1.0 (2026-11-15, A) — 구글 드라이브 연결: 가짜 구글(로그인 창·고르기 창·드라이브·시트 API)로 도구 다섯 개와 다시 연결 단추 */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); let bad = 0;
  const check = (n, c, x) => { console.log((c ? 'OK   ' : 'FAIL ') + n + (x !== undefined ? ' · ' + x : '')); if (!c) bad++; };
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const calls = [];
  const J = (route, o, st) => route.fulfill({ status:st || 200, headers:{ 'content-type':'application/json', 'access-control-allow-origin':'*' }, body:JSON.stringify(o) });
  await ctx.route('https://www.googleapis.com/**', async route => { const r = route.request(), u = r.url(); calls.push(r.method() + ' ' + u.replace('https://www.googleapis.com', ''));
    if (r.headers().authorization !== 'Bearer TOK1') return J(route, { error:'bad' }, 401);
    if (u.includes('/oauth2/v3/userinfo')) return J(route, { email:'gajja@example.com' });
    if (u.includes('/upload/drive/v3/files')) return J(route, { id:'doc9', name:'가상 보고서', mimeType:'application/vnd.google-apps.document', webViewLink:'https://docs.google.com/x' });
    if (u.includes('/drive/v3/files?fields=id,name')) return J(route, { id:'sh9', name:'가상 정리표', mimeType:'application/vnd.google-apps.spreadsheet', webViewLink:'https://docs.google.com/y' });
    if (u.includes('/drive/v3/files?fields=id')) return J(route, { id:'folder1' });
    if (u.includes('/export?mimeType=text/plain')) return route.fulfill({ status:200, headers:{ 'content-type':'text/plain', 'access-control-allow-origin':'*' }, body:'가상 문서 첫 줄\n둘째 줄 안전교육 목요일' });
    return J(route, {}); });
  await ctx.route('https://sheets.googleapis.com/**', async route => { const r = route.request(), u = r.url(); calls.push(r.method() + ' ' + decodeURIComponent(u.replace('https://sheets.googleapis.com', '')));
    if (r.headers().authorization !== 'Bearer TOK1') return J(route, { error:'bad' }, 401);
    if (u.includes('values:batchGet')) return J(route, { valueRanges:[{ values:[['이름', '반', '출석'], ['김가상', 'A', 'O'], ['이가상', 'B', 'X']] }, { values:[['메모']] }] });
    if (u.includes('?fields=properties.title')) return J(route, { properties:{ title:'가상 출석부' }, sheets:[{ properties:{ title:'11월' } }, { properties:{ title:'메모' } }] });
    if (u.includes(':append')) return J(route, { updates:{ updatedCells:3, updatedRange:"'11월'!A4:C4" } });
    return J(route, { updatedCells:1, updatedRange:'11월!C3' }); });
  const p = await ctx.newPage(); await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2000);
  await p.evaluate(() => {
    GD_CFG.clientId = 'test-client.apps.googleusercontent.com'; GD_CFG.appId = '123';
    GD.loading = Promise.resolve();
    window._pickWith = [{ id:'s1', name:'가상 출석부', mimeType:'application/vnd.google-apps.spreadsheet', url:'u1' }, { id:'d1', name:'가상 안내문', mimeType:'application/vnd.google-apps.document', url:'u2' }];
    window.google = { accounts:{ oauth2:{ initTokenClient:o => ({ requestAccessToken:() => setTimeout(() => o.callback({ access_token:'TOK1', expires_in:3600 }), 10) }), revoke:() => {} } },
      picker:{ ViewId:{ DOCS:'d', RECENTLY_PICKED:'r' }, Feature:{ MULTISELECT_ENABLED:'m' }, Action:{ PICKED:'picked', CANCEL:'cancel' },
        DocsView:class { setIncludeFolders(){ return this; } setOwnedByMe(){ return this; } setQuery(q){ window._q = q; return this; } },
        PickerBuilder:class { setOAuthToken(){ return this; } addView(){ return this; } enableFeature(){ return this; } setLocale(){ return this; } setTitle(t){ window._title = t; return this; } setAppId(){ return this; } setDeveloperKey(){ return this; } setCallback(f){ this.f = f; return this; } build(){ const f = this.f; return { setVisible:() => setTimeout(() => f({ action:'picked', docs:window._pickWith }), 10) }; } } } };
  });
  const run = (name, args) => p.evaluate(([n, a]) => runTool({ name:n, args:a }), [name, args]);
  check('도구 다섯 개', (await p.evaluate(() => TOOL_DEFS().filter(t => /^drive_/.test(t.name)).length)) === 5);
  const r0 = await run('drive_find', { query:'출석' }); check('연결 전엔 연결 안내', r0.not_connected === true);
  check('연결 전 지침 한 줄', (await p.evaluate(() => systemPrompt('x'))).includes('구글 드라이브: 연결 안 됨'));
  const on = await p.evaluate(() => gdConnect()); const st = await p.evaluate(() => gdState());
  check('연결됨 · 이메일 저장', on && st.on && st.email === 'gajja@example.com');
  const r1 = await run('drive_find', { query:'출석' });
  check('고르기 창에 검색어 · 고른 것 연결', (await p.evaluate(() => window._q)) === '출석' && r1.picked.length === 2 && r1.picked[0].kind === '시트', JSON.stringify(r1.picked));
  const r2 = await run('drive_files', {}); check('연결 목록', r2.total === 2 && r2.files.some(f => f.name === '가상 안내문'));
  check('연결 후 지침에 파일 이름', (await p.evaluate(() => systemPrompt('x'))).includes('가상 출석부(시트)'));
  const r3 = await run('drive_read', { id:'s1' }); check('시트 읽기 — 탭·줄 번호', /## 탭: 11월/.test(r3.text) && /2: 김가상 \| A \| O/.test(r3.text), r3.text.slice(0, 80));
  const r4 = await run('drive_read', { id:'d1', find:'안전교육' }); check('문서에서 찾기', /2: 둘째 줄 안전교육 목요일/.test(r4.found), r4.found);
  const r5 = await run('drive_write_sheet', { id:'s1', range:'11월!A:C', values:[['박가상', 'C', 'O']], append:true }); check('시트에 줄 추가', r5.ok && r5.updated === 3 && calls.some(c => c.startsWith('POST') && c.includes(':append')));
  const r6 = await run('drive_save', { name:'가상 보고서', as:'doc', text:'오늘 한 일' }); check('「세희」 폴더에 문서 저장', r6.ok && r6.id === 'doc9' && calls.some(c => c.startsWith('POST /drive/v3/files?fields=id')));
  const r7 = await run('drive_save', { name:'가상 정리표', as:'sheet', rows:[['a', 'b']] }); check('폴더는 한 번만 만듦 · 시트 저장', r7.kind === '시트' && calls.filter(c => c.startsWith('POST /drive/v3/files?fields=id ') || c === 'POST /drive/v3/files?fields=id').length === 1);
  check('만든 파일도 연결 목록에', (await run('drive_files', {})).total === 4);
  await p.evaluate(() => { GD.token = 'OLD'; });
  const r8 = await run('drive_read', { id:'s1' }); await p.waitForTimeout(200);
  check('열쇠가 끝나면 다시 연결 안내 + 단추', r8.need_connect === true && await p.locator('#gdChip').isVisible(), JSON.stringify(r8).slice(0, 160) + ' chip=' + await p.locator('#gdChip').count());
  await p.screenshot({ path:'/tmp/tgdrive-chip.png' });
  await p.locator('#gdChip').click(); await p.waitForTimeout(300);
  check('단추로 다시 연결 → 단추 사라짐', (await p.evaluate(() => gdHasToken())) && !(await p.locator('#gdChip').count()));
  await p.evaluate(() => settingsSheet()); await p.waitForTimeout(300);
  check('설정 칸', /연결된 파일 4개/.test(await p.locator('#gdNote').textContent()) && await p.locator('[data-sact="gdpick"]').count() === 1, await p.locator('#gdNote').textContent());
  await p.screenshot({ path:'/tmp/tgdrive-set.png' });
  console.log('GDRIVE bad', bad); await b.close(); if (bad) process.exit(1);
})();
