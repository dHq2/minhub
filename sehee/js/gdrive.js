/* ── 구글 드라이브 연결 v1 (11-15 A) — 모든 사용자 공통, 구글 심사 없는 길(drive.file)
   - 연결: 구글 계정으로 허락(팝업) → 1시간짜리 열쇠(토큰)는 이 탭 메모리에만. 연결 여부·이메일·연결된 파일 목록은 kv 'gdrive'(동기화).
   - 파일은 사용자가 구글 「파일 고르기」 창에서 골라 준 것(내 드라이브·공유 문서함·검색)과 세희가 만든 것만 다룬다.
   - 세희 도구: drive_files(연결된 목록) · drive_find(검색어 넣은 고르기 창 — 사용자가 고름) · drive_read(내용 읽기) · drive_write_sheet(시트 칸 쓰기) · drive_save(「세희」 폴더에 새 문서·시트).
   - 열쇠가 없거나 끝났으면 도구는 need_connect 를 돌려주고, 화면 아래 「구글 드라이브 다시 연결」 단추가 뜬다(팝업은 사용자가 눌러야 열려서).
   설정 값(공개돼도 되는 것만): 클라이언트 ID·프로젝트 번호. 비밀 열쇠는 없다. */
const GD_CFG = { clientId:'409029954703-mmkpqpf0t2nvt02gocafjovv9tv6megq.apps.googleusercontent.com', appId:'409029954703', apiKey:'' };
const GD_SCOPE = 'https://www.googleapis.com/auth/drive.file openid email';
const GD = { token:null, exp:0, tc:null, loading:null, st:null };
const gdReady = () => !!GD_CFG.clientId;
async function gdState(){ if (!GD.st) GD.st = (await kvGet('gdrive')) || { email:'', files:[], folder:'' }; GD.st.files = GD.st.files || []; return GD.st; }
async function gdSaveState(){ await kvSet('gdrive', GD.st); }
function gdScript(src){ return new Promise((ok, no) => { if (document.querySelector(`script[src="${src}"]`)) return ok(); const s = document.createElement('script'); s.src = src; s.async = true; s.onload = ok; s.onerror = () => no(new Error('구글 스크립트를 못 불러옴')); document.head.appendChild(s); }); }
function gdLoad(){
  if (!GD.loading) GD.loading = (async () => {
    await gdScript('https://accounts.google.com/gsi/client');
    await gdScript('https://apis.google.com/js/api.js');
    await new Promise(ok => window.gapi.load('picker', ok));
  })().catch(e => { GD.loading = null; throw e; });
  return GD.loading;
}
const gdHasToken = () => !!(GD.token && Date.now() < GD.exp - 60e3);
/* 연결 — 반드시 사용자가 누른 그 자리에서 부른다(팝업) */
async function gdConnect(){
  if (!gdReady()){ toast('구글 연결 준비가 아직이에요(개발자 설정 중)'); return false; }
  await gdLoad(); const st = await gdState();
  return new Promise(resolve => {
    GD.tc = google.accounts.oauth2.initTokenClient({ client_id:GD_CFG.clientId, scope:GD_SCOPE, callback:async r => {
      if (r.error){ dlog('구글', '연결 실패 · ' + r.error); toast('구글 연결을 못 했어요'); resolve(false); return; }
      GD.token = r.access_token; GD.exp = Date.now() + (r.expires_in || 3600) * 1000;
      try{ const u = await gdFetch('https://www.googleapis.com/oauth2/v3/userinfo'); st.email = u.email || st.email; }catch(e){}
      st.on = true; await gdSaveState(); dlog('구글', '드라이브 연결됨 · ' + (st.email ? st.email.replace(/^(.).*(@.*)$/, '$1…$2') : ''));
      gdChip(); resolve(true);
    }, error_callback:e => { dlog('구글', '연결 창 닫힘 · ' + (e && e.type)); resolve(false); } });
    GD.tc.requestAccessToken({ prompt:st.on ? '' : 'consent', ...(st.email ? { login_hint:st.email } : {}) });
  });
}
async function gdDisconnect(){
  const st = await gdState();
  try{ if (GD.token && window.google && google.accounts) google.accounts.oauth2.revoke(GD.token, () => {}); }catch(e){}
  GD.token = null; GD.exp = 0; st.on = false; await gdSaveState(); gdChip(); dlog('구글', '드라이브 연결 끊음');
}
async function gdFetch(url, init){
  if (!gdHasToken()) throw Object.assign(new Error('need_connect'), { need:true });
  const r = await fetch(url, { ...(init || {}), headers:{ authorization:'Bearer ' + GD.token, ...((init && init.headers) || {}) } });
  if (r.status === 401){ GD.token = null; gdChip(); throw Object.assign(new Error('need_connect'), { need:true }); }
  if (!r.ok) throw new Error(`구글 ${r.status} ${(await r.text()).slice(0, 200)}`);
  const ct = r.headers.get('content-type') || ''; return ct.includes('json') ? r.json() : r;
}
/* 아래 「다시 연결」 단추 — 연결해 둔 사람인데 이 탭에 열쇠가 없을 때만 */
async function gdChip(){
  const st = await gdState(); let el = $('gdChip');
  const want = gdReady() && st.on && !gdHasToken() && GD.wantChip;
  if (!want){ if (el) el.remove(); return; }
  if (!el){ el = document.createElement('button'); el.id = 'gdChip'; el.className = 'chip'; el.textContent = '구글 드라이브 다시 연결'; el.onclick = async () => { if (await gdConnect()){ GD.wantChip = false; gdChip(); toast('다시 연결했어요 — 방금 부탁을 한 번 더 말해 주세요'); } }; document.body.appendChild(el); }
}
/* 파일 고르기 창 — 검색어·공유 문서함 포함, 여러 개 */
async function gdPick(query){
  await gdLoad(); if (!gdHasToken()) throw Object.assign(new Error('need_connect'), { need:true });
  const P = google.picker;
  return new Promise(resolve => {
    const mine = new P.DocsView(P.ViewId.DOCS).setIncludeFolders(true).setOwnedByMe(true), shared = new P.DocsView(P.ViewId.DOCS).setIncludeFolders(true).setOwnedByMe(false), recent = new P.DocsView(P.ViewId.RECENTLY_PICKED);
    if (query){ mine.setQuery(query); shared.setQuery(query); }
    const b = new P.PickerBuilder().setOAuthToken(GD.token).addView(mine).addView(shared).addView(recent).enableFeature(P.Feature.MULTISELECT_ENABLED)
      .setLocale('ko').setTitle(query ? `「${query}」 찾기 — 세희에게 줄 파일을 골라 주세요` : '세희에게 줄 파일을 골라 주세요')
      .setCallback(d => { if (d.action === P.Action.PICKED) resolve(d.docs || []); else if (d.action === P.Action.CANCEL) resolve([]); });
    if (GD_CFG.appId) b.setAppId(GD_CFG.appId);
    if (GD_CFG.apiKey) b.setDeveloperKey(GD_CFG.apiKey);
    b.build().setVisible(true);
  });
}
async function gdAddFiles(docs){
  const st = await gdState(), now = Date.now();
  for (const d of docs){ const f = { id:d.id, name:d.name, mime:d.mimeType, url:d.url, at:now }; const i = st.files.findIndex(x => x.id === f.id); if (i >= 0) st.files[i] = { ...st.files[i], ...f }; else st.files.unshift(f); }
  st.files = st.files.slice(0, 200); await gdSaveState(); return st.files;
}
const GD_KIND = m => /spreadsheet/.test(m) ? '시트' : /document/.test(m) ? '문서' : /presentation/.test(m) ? '슬라이드' : /pdf/.test(m) ? 'PDF' : /folder/.test(m) ? '폴더' : /image/.test(m) ? '사진' : '파일';
/* 파일 내용 → 글 */
async function gdRead(f){
  const id = encodeURIComponent(f.id);
  if (/spreadsheet/.test(f.mime)){
    const meta = await gdFetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}?fields=properties.title,sheets.properties(title,gridProperties)`);
    const tabs = (meta.sheets || []).map(s => s.properties.title).slice(0, 12);
    const q = tabs.map(t => 'ranges=' + encodeURIComponent(`'${t.replace(/'/g, "''")}'`)).join('&');
    const v = await gdFetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values:batchGet?${q}&valueRenderOption=FORMATTED_VALUE`);
    return (v.valueRanges || []).map((r, i) => `## 탭: ${tabs[i]}\n` + (r.values || []).slice(0, 500).map((row, k) => `${k + 1}: ` + row.join(' | ')).join('\n')).join('\n\n');
  }
  if (/google-apps\.(document|presentation)/.test(f.mime)){ const r = await gdFetch(`https://www.googleapis.com/drive/v3/files/${id}/export?mimeType=text/plain`); return await r.text(); }
  const r = await gdFetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`);
  const blob = await r.blob(), file = new File([blob], f.name || 'file', { type:f.mime || blob.type });
  /* 11-15 A: 사진·스캔 PDF 는 캡처 해독(ocr.js·job.js)과 같은 길로 글자를 읽는다 */
  let pics;
  if (/^image\//.test(file.type) || /\.(png|jpe?g|webp|gif|bmp|heic)$/i.test(f.name || '')) pics = [file];
  else { const d = await readDocFile(file); if (d.kind === 'txt') return d.text; pics = (d.files || []).slice(0, 12); }
  if (!pics.length || typeof cutTiles !== 'function') return '(그림이라 글자를 바로 못 읽음 — 보스에게 사진으로 보내 달라고)';
  const job = { tiles:await cutTiles(pics, null, () => {}) };
  const o = await readTiles(job, null, () => {});
  return o.text ? `(사진 속 글자를 읽은 것${o.failed ? ' · 일부 못 읽음' : ''})\n` + o.text : '(사진에 읽을 글자가 없음)';
}
async function gdFolder(){
  const st = await gdState(); if (st.folder) return st.folder;
  const r = await gdFetch('https://www.googleapis.com/drive/v3/files?fields=id', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ name:'세희', mimeType:'application/vnd.google-apps.folder' }) });
  st.folder = r.id; await gdSaveState(); return r.id;
}
async function gdSaveDoc(name, text){
  const folder = await gdFolder(), bd = 'sehee' + Math.random().toString(36).slice(2);
  const body = `--${bd}\r\ncontent-type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name, mimeType:'application/vnd.google-apps.document', parents:[folder] })}\r\n--${bd}\r\ncontent-type: text/plain; charset=UTF-8\r\n\r\n${text}\r\n--${bd}--`;
  return gdFetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink', { method:'POST', headers:{ 'content-type':'multipart/related; boundary=' + bd }, body });
}
async function gdSaveSheet(name, rows){
  const folder = await gdFolder();
  const f = await gdFetch('https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,webViewLink', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ name, mimeType:'application/vnd.google-apps.spreadsheet', parents:[folder] }) });
  if (rows && rows.length) await gdFetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(f.id)}/values/A1?valueInputOption=USER_ENTERED`, { method:'PUT', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ values:rows }) });
  return f;
}
/* ── 세희 도구 ── */
function DRIVE_TOOLS(){
  if (!gdReady()) return [];
  return [
    { name:'drive_files', description:'보스가 세희에게 연결해 준 구글 드라이브 파일 목록(이름·종류·id). 시트·문서·자료 얘기가 나오면 먼저 본다', schema:{ type:'object', properties:{ find:{ type:'string', description:'이름에 들어간 낱말로 걸러 보기' } } } },
    { name:'drive_find', description:'아직 연결 안 된 파일이 필요할 때 — 검색어를 넣은 구글 「파일 고르기」 창을 보스 화면에 띄운다(내 드라이브·공유 문서함). 보스가 골라 주면 연결된다. 보스가 안 고르면 빈 목록', schema:{ type:'object', properties:{ query:{ type:'string', description:'찾을 낱말(파일 이름에 있을 법한 것). 비우면 전체' } } } },
    { name:'drive_read', description:'연결된 파일 내용을 읽는다(시트는 탭마다 줄 번호와 칸, 문서·PDF·엑셀은 글, 사진·스캔은 사진 속 글자를 읽어 옴 — 조금 걸림). find 를 주면 그 낱말이 든 줄만', schema:{ type:'object', properties:{ id:{ type:'string' }, find:{ type:'string' } }, required:['id'] } },
    { name:'drive_write_sheet', description:'연결된 구글 시트의 칸에 쓴다. 보스가 시트를 고치라고 했을 때만. range 예: 시트1!B3 또는 시트1!A:D(append 와 함께)', schema:{ type:'object', properties:{ id:{ type:'string' }, range:{ type:'string' }, values:{ type:'array', items:{ type:'array', items:{ type:'string' } }, description:'줄들[[칸, 칸], …]' }, append:{ type:'boolean', description:'true 면 맨 아래에 줄 추가' } }, required:['id', 'range', 'values'] } },
    { name:'drive_save', description:'보스 드라이브의 「세희」 폴더에 새 구글 문서나 시트를 만든다(보고서·정리표 남기기). 만든 파일은 연결 목록에 들어간다', schema:{ type:'object', properties:{ name:{ type:'string' }, as:{ type:'string', enum:['doc', 'sheet'] }, text:{ type:'string', description:'문서 내용(as=doc)' }, rows:{ type:'array', items:{ type:'array', items:{ type:'string' } }, description:'시트 줄들(as=sheet)' } }, required:['name', 'as'] } },
  ];
}
const GD_NEED = { ok:false, need_connect:true, note:'이 기기에서 구글 드라이브 연결이 끊겼음 — 보스에게 화면 아래 「구글 드라이브 다시 연결」을 눌러 달라고 한 줄로 말하고, 누른 뒤 다시 하겠다고 한다' };
async function runDriveTool(c){
  const a = c.args || {}, st = await gdState();
  if (!st.on && c.name !== 'drive_files') return { ok:false, not_connected:true, note:'구글 드라이브가 아직 연결 안 됨 — 설정 → 「구글 드라이브 연결」을 안내한다' };
  try{
    if (c.name === 'drive_files'){
      const w = String(a.find || '').trim().toLowerCase();
      const list = st.files.filter(f => !w || (f.name || '').toLowerCase().includes(w)).slice(0, 40).map(f => ({ id:f.id, name:f.name, kind:GD_KIND(f.mime) }));
      return { ok:true, connected:!!st.on, files:list, total:st.files.length, ...(list.length ? {} : { note:w ? '연결된 파일 중에 없음 — drive_find 로 고르기 창을 띄운다' : '연결된 파일이 아직 없음' }) };
    }
    if (c.name === 'drive_find'){
      if (!gdHasToken()){ GD.wantChip = true; gdChip(); return GD_NEED; }
      dlog('구글', '파일 고르기 창 — ' + (a.query || '(전체)'));
      const docs = await gdPick(String(a.query || '').trim());
      if (!docs.length) return { ok:true, picked:[], note:'보스가 고르지 않음(창 닫음)' };
      await gdAddFiles(docs);
      return { ok:true, picked:docs.map(d => ({ id:d.id, name:d.name, kind:GD_KIND(d.mimeType) })) };
    }
    const f = st.files.find(x => x.id === String(a.id || '').trim());
    if (!f && c.name !== 'drive_save') return { ok:false, error:'연결된 파일 목록에 없는 id — drive_files 로 확인' };
    if (!gdHasToken()){ GD.wantChip = true; gdChip(); return GD_NEED; }
    if (c.name === 'drive_read'){
      const text = await gdRead(f), q = String(a.find || '').trim().toLowerCase();
      if (q){ const lines = text.split('\n'), hit = lines.map((l, i) => [l, i]).filter(([l]) => l.toLowerCase().includes(q)).slice(0, 40);
        return { ok:true, name:f.name, kind:GD_KIND(f.mime), lines:lines.length, found:hit.map(([l, i]) => `${i + 1}: ${l}`).join('\n') || '(없음)' }; }
      return { ok:true, name:f.name, kind:GD_KIND(f.mime), chars:text.length, text:text.slice(0, 14000), ...(text.length > 14000 ? { cut:true, note:'길어서 앞부분만 — find 로 필요한 줄을 찾는다' } : {}) };
    }
    if (c.name === 'drive_write_sheet'){
      if (!/spreadsheet/.test(f.mime)) return { ok:false, error:'시트가 아님' };
      const id = encodeURIComponent(f.id), range = encodeURIComponent(String(a.range)), body = JSON.stringify({ values:a.values || [] });
      const r = a.append ? await gdFetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, { method:'POST', headers:{ 'content-type':'application/json' }, body })
        : await gdFetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?valueInputOption=USER_ENTERED`, { method:'PUT', headers:{ 'content-type':'application/json' }, body });
      dlog('구글', `시트에 씀 · ${f.name} ${a.range}`);
      return { ok:true, updated:(r.updates || r).updatedCells || 0, range:(r.updates || r).updatedRange || a.range };
    }
    if (c.name === 'drive_save'){
      const name = String(a.name || '세희 정리').slice(0, 80);
      const r = a.as === 'sheet' ? await gdSaveSheet(name, a.rows || []) : await gdSaveDoc(name, String(a.text || ''));
      await gdAddFiles([{ id:r.id, name:r.name, mimeType:r.mimeType, url:r.webViewLink }]);
      dlog('구글', `「세희」 폴더에 저장 · ${r.name}`);
      return { ok:true, id:r.id, name:r.name, kind:GD_KIND(r.mimeType), link:r.webViewLink };
    }
    return { ok:false, error:'모르는 도구' };
  }catch(e){
    if (e.need){ GD.wantChip = true; gdChip(); return GD_NEED; }
    dlog('오류', '구글 드라이브 · ' + e.message); return { ok:false, error:e.message.slice(0, 200) };
  }
}
/* 세희 지침 뒷부분(매번 바뀌는 곳)에 한 줄 */
async function gdContext(){
  if (!gdReady()) return '';
  const st = await gdState();
  if (!st.on) return '- 구글 드라이브: 연결 안 됨(보스가 시트·드라이브 파일을 말하면 설정 → 「구글 드라이브 연결」을 안내)';
  const names = st.files.slice(0, 12).map(f => `${f.name}(${GD_KIND(f.mime)})`).join(', ');
  return `- 구글 드라이브: 연결됨 · 연결된 파일 ${st.files.length}개${names ? ' — ' + names : ''}. 보스가 파일·시트·문서·자료를 말하면 drive_files 로 찾고, 없으면 drive_find(검색어)로 고르기 창을 띄운다(공유받은 파일도 그 창에 있음). 시트 칸을 고치는 건 보스가 시켰을 때만`;
}
