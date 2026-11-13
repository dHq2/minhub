/* ── 설정 ── */
function settingsSheet(){
  const st = S.settings;
  setTimeout(fillAiLog, 0);
  openSheet(`<h4>설정</h4>
    <label class="t">계정 — 암호로 열면 판·대화·보드·설정이 다른 기기에서도 그대로 열려요</label>
    <p class="note" id="syncInfo">${esc(syncLine())}</p>
    <div class="row"><input class="free" id="syncUrl" placeholder="계정 서버 주소 (https://…workers.dev)" value="${esc(SYNC.url)}" autocapitalize="off" autocorrect="off" spellcheck="false"><button class="chip" data-sact="syncurl">저장</button></div>
    <div class="row" style="margin-top:6px">${SYNC.url && SYNC.on ? '<button class="chip" data-sact="syncnow">지금 올리기</button><button class="chip danger" data-sact="logout">로그아웃</button>' : SYNC.url ? '<button class="chip" data-sact="login">암호로 열기</button>' : ''}</div>
    <hr class="s">
    <label class="t">칸 — 이름을 고치고, 점을 눌러 색을 바꿔요</label>
    <div id="secList">${secs().map((s,i) => `<div class="srow" data-sid="${s.id}">
      <button class="cdot" style="--c:${s.color}" data-sact="color" aria-label="색"></button>
      <input value="${esc(s.label)}" data-sact="name">
      <button class="mini" data-sact="up" ${i === 0 ? 'disabled' : ''}>↑</button>
      <button class="mini" data-sact="down" ${i === secs().length - 1 ? 'disabled' : ''}>↓</button>
      <button class="mini danger" data-sact="del">✕</button></div>`).join('')}</div>
    <button class="chip" data-sact="addsec" style="margin-top:4px">+ 칸 더하기</button>
    <label class="t">보너스 업데이트</label>
    ${LANES.map(l => `<div class="row" style="margin-top:4px"><span class="note" style="min-width:58px">${l.name}</span><button class="chip ${bonusOn(l.k) ? 'on' : ''}" data-sact="bonus" data-k="${l.k}" data-v="1">켬</button><button class="chip ${bonusOn(l.k) ? '' : 'on'}" data-sact="bonus" data-k="${l.k}" data-v="0">끔</button>${BONUS.vers[l.k] ? `<span class="note" style="margin-left:6px">${esc(BONUS.vers[l.k])}</span>` : ''}</div>`).join('')}
    ${BONUS.menu.length ? `<div class="row" style="flex-wrap:wrap;gap:6px;margin-top:6px">${BONUS.menu.map((m, i) => `<button class="chip" data-sact="bonusrun" data-i="${i}">${esc(m.label)}</button>`).join('')}</div>` : ''}
    <p class="note" style="margin:4px 0 10px">따로 만드는 보너스 기능이에요. 이상하면 끔으로 바로 빼요(다시 켜면 새로 고칠 때 돌아와요).</p>
    <label class="t">개발자 로그</label>
    <div class="row"><button class="chip ${localStorage.getItem('sehee.dev') === '1' ? 'on' : ''}" data-sact="dev" data-v="1">켬</button><button class="chip ${localStorage.getItem('sehee.dev') === '1' ? '' : 'on'}" data-sact="dev" data-v="0">끔</button></div>
    <p class="note" style="margin:4px 0 10px">켜면 아래에 「🛠 로그」 탭이 생겨요. AI 요청·도구·동기화·화면 이동·오류가 실시간으로 찍혀요. 켠 동안은 10초마다 계정 서버에도 올라가서 개발자가 같이 볼 수 있어요.</p>
    <label class="t">글꼴</label>
    <div class="row" style="flex-wrap:wrap;gap:6px">${FONTS.map(f => `<button class="chip ${(st.font || 'sys') === f.v ? 'on' : ''}" data-sact="font" data-v="${f.v}" style="font-family:${f.body.replace(/"/g, "'")}">${f.t}</button>`).join('')}</div>
    <p class="note" style="margin:4px 0 10px">${esc((FONTS.find(x => x.v === (st.font || 'sys')) || FONTS[0]).d)}. 기본 말고는 처음 고를 때 인터넷에서 글꼴을 한 번 받아 와요.</p>
    <label class="t">글자 크기</label>
    <div class="row">${FS_STEPS.map(f => `<button class="chip ${st.fs === f.v ? 'on' : ''}" data-sact="fs" data-v="${f.v}">${f.t}</button>`).join('')}</div>
    ${[['chatD', '대화 글씨'], ['panD', '판 글씨']].map(([k, t]) => `<div class="row fsd-row" style="margin-top:6px"><span class="note" style="min-width:58px">${t}</span><button class="chip" data-sact="fsd" data-k="${k}" data-d="-1">−1</button><b class="fsd-n" id="fsdN-${k}">${fsBase() + (st[k] || 0)}</b><button class="chip" data-sact="fsd" data-k="${k}" data-d="1">+1</button>${st[k] ? `<button class="chip" data-sact="fsd" data-k="${k}" data-d="0">기본으로</button>` : ''}</div>`).join('')}
    <p class="note" style="margin:4px 0 10px">대화 글씨는 사무실 말풍선과 판·보드 아래 대화 상자만, 판 글씨는 판의 할 일 칸만 바뀌어요. 판 글씨는 판 위쪽 가−·가+로도 바꿀 수 있어요.</p>
    <hr class="s">
    <label class="t">백업 — 데이터는 이 폰 안에만 있어요. 가끔 내려받아 두세요.</label>
    <div class="row"><button class="chip" data-sact="export">모든 판 내려받기</button>
      <button class="chip" data-sact="import" id="impBtn">백업 파일 불러오기</button>
      <input type="file" id="impFile" accept=".json,application/json" hidden></div>
    <p class="note" id="impNote"></p>
    <p class="note" id="stInfo">판 ${S.dates.length}개 · 계산 중…</p>
    <div class="row"><button class="chip" data-sact="clearchat" id="clrBtn">사무실 대화 비우기</button></div>
    <hr class="s">
    <label class="t">세희 머리 — AI 연결. 키는 이 폰에만 저장되고 백업 파일에는 안 들어가요.</label>
    <div class="row">${['anthropic','gemini'].map(v => `<button class="chip ${AI.cfg.provider === v ? 'on' : ''}" data-sact="prov" data-v="${v}">${v === 'anthropic' ? 'Claude' : 'Gemini'}</button>`).join('')}</div>
    <div class="row" style="margin-top:6px"><input class="free keyin" id="aiKey" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${AI.cfg.provider === 'anthropic' ? 'sk-ant- 로 시작하는 키' : 'Gemini API 키'} 붙여넣기"></div>
    <div class="row" style="margin-top:6px"><button class="chip" data-sact="pastekey">📋 붙여넣기</button><button class="chip" data-sact="savekey">저장</button><span class="note" id="keyLen"></span></div>
    <p class="note" id="aiKeyNote">${keyNote()}</p>
    <div class="row"><select class="free" id="aiModel">${modelOptions()}</select><button class="chip" data-sact="models">모델 불러오기</button></div>
    <div class="row" style="margin-top:6px"><span class="note">긴 글·사진</span><select class="free" id="aiBig">${bigOptions()}</select></div>
    <p class="note" style="margin:4px 0 0">카톡 로그처럼 긴 글(300자 또는 6줄 이상)과 캡처 사진 해독은 이 모델이 해요. 평소 대화는 위 모델이에요.</p>
    <div class="row" style="margin-top:6px"><span class="note">세희가 판 보기</span><button class="chip ${sendPanOn() ? 'on' : ''}" data-sact="sendpan" data-v="1">켬</button><button class="chip ${sendPanOn() ? '' : 'on'}" data-sact="sendpan" data-v="0">끔</button></div>
    <p class="note" style="margin:4px 0 0">켜면 세희가 오늘 판을 늘 보고, 필요하면 지난 판도 직접 찾아봐요. 끄면 자기가 적은 것만 알아요.</p>
    <div class="row" style="margin-top:6px"><span class="note">작업 보여주기</span><button class="chip ${workOn() ? 'on' : ''}" data-sact="work" data-v="1">켬</button><button class="chip ${workOn() ? '' : 'on'}" data-sact="work" data-v="0">끔</button></div>
    <p class="note" style="margin:4px 0 0">켜면 세희가 고치는 모습이 보여요. 판이 열리고 고칠 줄에 형광펜, 새 줄은 한 글자씩, 보고서는 문단이 차례로 써져요.</p>
    <div class="row" style="margin-top:6px"><span class="note">작업 중 질문</span>${[['need', '필요할 때만'], ['end', '마지막에 한 번'], ['auto', '알아서']].map(([v, t]) => `<button class="chip ${askMode() === v ? 'on' : ''}" data-sact="ask" data-v="${v}">${t}</button>`).join('')}</div>
    <p class="note" style="margin:4px 0 0">필요할 때만: 정말 막히면 멈추고 고를 것을 띄워요. 마지막에 한 번: 끝까지 해 놓고 확인할 것만 한 번에. 알아서: 안 묻고 가정만 한 줄.</p>
    <div class="row" style="margin-top:6px"><span class="note">사적인 일·관계</span><button class="chip ${privOn() ? 'on' : ''}" data-sact="priv" data-v="1">넣기</button><button class="chip ${privOn() ? '' : 'on'}" data-sact="priv" data-v="0">빼기</button></div>
    <p class="note" style="margin:4px 0 0">넣기: 연애·친구·가족·개인 약속도 업무처럼 정리하고, 판과 인간관계 판에 똑같이 올려요. 빼기: 업무 일만 다루고 개인 대화는 뺐다고만 말해요.</p>
    <div class="row" style="margin-top:6px"><span class="note">웹 검색</span><button class="chip ${webOn() ? 'on' : ''}" data-sact="web" data-v="1">켬</button><button class="chip ${webOn() ? '' : 'on'}" data-sact="web" data-v="0">끔</button></div>
    <p class="note" style="margin:4px 0 0">날씨·영업시간·뉴스·가격처럼 바깥 정보를 물을 때만 세희가 찾아봐요. 출처는 말풍선 아래에 달려요. ${AI.cfg.provider === 'anthropic' ? 'Claude는 검색 1번에 $0.01(약 14원)이 따로 붙어요.' : 'Gemini는 구글 검색으로 찾아요.'}${AI.noWeb ? ' ⚠ 방금 검색이 거절됐어요(콘솔에서 웹 검색이 꺼져 있거나 이 모델이 못 써요).' : ''}</p>
    <div class="row" style="margin-top:6px" id="ntInfo"><span class="note">작업 알림</span>${!('Notification' in window) ? '<span class="note">이 폰에선 못 써요</span>' : Notification.permission === 'granted' ? '<span class="note">켜짐 ✓</span>' : Notification.permission === 'denied' ? '<span class="note">막혀 있어요 — 폰 설정 → 앱 → 세희 → 알림에서 허용</span>' : '<button class="chip" data-sact="notify">알림 켜기</button>'}</div>
    <p class="note" style="margin:4px 0 0">긴 글·캡처 정리 중에 앱을 나가면 폰 위에 진행 상황이, 끝나면 결과가 떠요. 앱을 완전히 닫거나 폰이 앱을 내리면 멈추지만, 다시 열면 읽던 데부터 이어서 해요.</p>
    <div class="row" style="margin-top:6px"><button class="chip" data-sact="aitest">연결 시험</button>${aiKey() ? '<button class="chip danger" data-sact="delkey">키 지우기</button>' : ''}</div>
    <p class="note" id="aiNote">${usageLine()}</p>
    <label class="t">연결 기록 — 최근 대화가 어떻게 오갔는지(내용·키는 안 남겨요)</label>
    <div class="ailog" id="aiLog">불러오는 중…</div>
    <div class="row"><button class="chip" data-sact="copylog">기록 복사</button><button class="chip" data-sact="clearlog">기록 비우기</button></div>
    <p class="note">${AI.cfg.provider === 'gemini' ? '결제를 연결하지 않은 무료 키면, 보낸 판 내용을 구글이 제품 개선에 쓰고 사람이 읽을 수도 있어요(약관상 개인정보는 넣지 말라고 해요). 판에 다른 사람 이름·사정이 있으면 AI Studio에서 그 키의 프로젝트에 결제를 연결하세요. 연결하면 유료 등급이 돼서 내용이 학습에 안 쓰여요. ' : ''}API 요금은 Claude 구독과 따로예요. 월 사용 한도를 걸어두세요.</p>
    <hr class="s">
    <div class="row"><span class="note">세희 깡통 ${APP_VERSION}</span><button class="chip" data-sact="check" style="margin-left:auto">새 버전 확인</button></div>`);
  storageInfo();
}
async function storageInfo(){
  let txt = `판 ${S.dates.length}개`;
  if (S.dates.length) txt += ` · 첫 판 ${dayLabel(S.dates[0])}`;
  try{
    if (navigator.storage && navigator.storage.persisted){
      const p = await navigator.storage.persisted();
      txt += p ? ' · 폰이 공간 정리할 때도 안 지워지게 해둠' : ' · 오래 안 쓰면 폰이 지울 수도 있어요(홈 화면에 추가하면 안전해져요)';
    }
  }catch(e){}
  const el = $('stInfo'); if (el) el.textContent = txt;
}

let impPending = null;
$('sheet').addEventListener('click', async e => {
  const b = e.target.closest('[data-sact]'); if (!b || b.tagName === 'INPUT') return;
  const a = b.dataset.sact, row = b.closest('[data-sid]'), list = secs();
  const i = row ? list.findIndex(s => s.id === row.dataset.sid) : -1;
  if (a === 'color'){ const s = list[i]; s.color = PALETTE[(PALETTE.indexOf(s.color) + 1) % PALETTE.length]; }
  else if (a === 'up' && i > 0){ [list[i-1], list[i]] = [list[i], list[i-1]]; }
  else if (a === 'down' && i < list.length - 1){ [list[i+1], list[i]] = [list[i], list[i+1]]; }
  else if (a === 'del'){
    if (list.length === 1){ toast('칸은 하나는 있어야 해요'); return; }
    const gone = list.splice(i, 1)[0], to = list[0];
    let moved = 0;
    if (S.pan) S.pan.items.forEach(it => { if (it.sec === gone.id){ it.sec = to.id; moved++; } });
    if (moved){ touch(true); toast(`남은 ${moved}개는 '${to.label}'(으)로 옮겼어요`); }
  }
  else if (a === 'addsec'){ list.push({ id:'s' + uid(), label:'새 칸', color:PALETTE[list.length % PALETTE.length] }); }
  else if (a === 'fs'){ S.settings.fs = Number(b.dataset.v); applyFs(); }
  else if (a === 'fsd'){ await stepFsd(b.dataset.k, Number(b.dataset.d)); }
  else if (a === 'font'){ S.settings.font = b.dataset.v; applyFont(); }
  else if (a === 'bonus'){ try{ localStorage.setItem(laneKey(b.dataset.k || 'B'), b.dataset.v); }catch(e){} toast(b.dataset.v === '1' ? '새로 고치면 보너스가 들어와요' : '새로 고치면 보너스가 빠져요'); settingsSheet(); return; }
  else if (a === 'bonusrun'){ const m = BONUS.menu[Number(b.dataset.i)]; closeSheet(); if (m) try{ await m.run(); }catch(e){ dlog('오류', '보너스 메뉴 ' + e.message, e.stack); toast('보너스 기능에서 문제가 났어요'); } return; }
  else if (a === 'dev'){ try{ localStorage.setItem('sehee.dev', b.dataset.v); }catch(e){} devApply(); settingsSheet(); return; }
  else if (a === 'export'){ await exportAll(); return; }
  else if (a === 'import'){
    if (impPending){ await doImport(impPending); impPending = null; return; }
    $('impFile').click(); return;
  }
  else if (a === 'check'){ checkUpdate(true); return; }
  else if (a === 'copylog'){
    const txt = (await aiLogLines(30)).join('\n') || '기록 없음';
    try{ await navigator.clipboard.writeText(`세희 ${APP_VERSION} 연결 기록\n` + txt); toast('기록을 복사했어요. 그대로 붙여넣어 보내주세요'); }
    catch(e){ toast('복사가 안 돼요. 화면을 캡처해 주세요'); }
    return;
  }
  else if (a === 'clearlog'){ await kvSet('ailog', []); fillAiLog(); return; }
  else if (a === 'notify'){ askNotify(); return; }
  else if (a === 'syncurl'){ const u = $('syncUrl').value.trim().replace(/\/+$/, ''); if (u && !/^https?:\/\//.test(u)){ $('syncInfo').textContent = 'https:// 로 시작하는 주소를 넣어 주세요.'; return; }
    try{ if (u){ const r = await fetch(u + '/'); const j = await r.json(); if (!j || j.name !== 'sehee-sync') throw 0; } }catch(e){ $('syncInfo').textContent = '그 주소에서 세희 서버가 대답하지 않아요. 주소를 확인해 주세요.'; return; }
    SYNC.url = u; SYNC.token = ''; syncKeep(); $('syncInfo').textContent = u ? '저장했어요. 「암호로 열기」를 누르면 암호를 물어요.' : '서버 주소를 지웠어요.'; settingsSheet(); return; }
  else if (a === 'login'){ SYNC.token = ''; syncKeep(); location.reload(); return; }
  else if (a === 'logout'){ if (!b.textContent.includes('한 번 더')){ b.textContent = '한 번 더 누르면 로그아웃'; return; } syncLogout(); return; }
  else if (a === 'syncnow'){ await syncFlush(); $('syncInfo').textContent = syncLine(); return; }
  else if (a === 'priv'){ AI.cfg.priv = b.dataset.v === '1'; await saveAi(); settingsSheet(); return; }
  else if (a === 'work'){ AI.cfg.work = b.dataset.v === '1'; await saveAi(); settingsSheet(); return; }
  else if (a === 'ask'){ AI.cfg.ask = b.dataset.v; await saveAi(); settingsSheet(); return; }
  else if (a === 'web'){ AI.cfg.web = AI.cfg.web || {}; AI.cfg.web[AI.cfg.provider] = b.dataset.v === '1'; AI.noWeb = false; await saveAi(); refreshBrain(); settingsSheet(); return; }
  else if (a === 'sendpan'){ AI.cfg.sendPan[AI.cfg.provider] = b.dataset.v === '1'; await saveAi(); refreshBrain(); settingsSheet(); return; }
  else if (a === 'prov'){ AI.cfg.provider = b.dataset.v; await saveAi(); refreshBrain(); settingsSheet(); return; }
  else if (a === 'pastekey'){
    try{ $('aiKey').value = cleanKey(await navigator.clipboard.readText()); $('keyLen').textContent = keyCheck($('aiKey').value); }
    catch(e){ $('keyLen').textContent = '붙여넣기 권한이 없어요. 칸을 길게 눌러 붙여넣어 주세요'; }
    return;
  }
  else if (a === 'savekey'){
    if (!cleanKey($('aiKey').value)){ $('aiKeyNote').textContent = '키를 붙여넣어 주세요.'; return; }
    await saveKeyFromInput(); return;
  }
  else if (a === 'models'){
    if (!aiKey()){ $('aiNote').textContent = '키부터 저장해 주세요.'; return; }
    $('aiNote').textContent = '불러오는 중…';
    try{ await loadModels(); settingsSheet(); }catch(err){ $('aiNote').textContent = '못 불러왔어요: ' + err.message; }
    return;
  }
  else if (a === 'aitest'){
    if (cleanKey($('aiKey').value)){ if (!(await saveKeyFromInput())) return; }
    if (!aiKey()){ $('aiNote').textContent = '키부터 저장해 주세요.'; return; }
    $('aiNote').textContent = '세희에게 물어보는 중…';
    try{
      const r = await aiStream([{ role:'user', content:'연결 시험이에요. 한 문장으로 인사해 주세요.' }]);
      $('aiNote').textContent = `연결됐어요 (첫 글자 ${secs1(r.rec.firstMs)} · 전체 ${secs1(r.rec.ms)}${r.rec.auth ? ' · ' + (r.rec.auth === 'bearer' ? 'Bearer' : 'x-api-key') : ''}) — ` + parseFace(r.text).t;
    }catch(err){ $('aiNote').textContent = '연결 안 됨: ' + err.message; }
    fillAiLog();
    return;
  }
  else if (a === 'delkey'){
    if (!b.textContent.includes('한 번 더')){ b.textContent = '한 번 더 누르면 지워요'; return; }
    delete AI.cfg.keys[AI.cfg.provider]; await saveAi(); refreshBrain(); settingsSheet(); return;
  }
  else if (a === 'clearchat'){
    if (!b.classList.contains('danger')){ b.classList.add('danger'); b.textContent = '한 번 더 누르면 지워요'; return; }
    O.log = []; O.loaded = true; await kvSet('chat', []); b.classList.remove('danger'); b.textContent = '비웠어요'; return;
  }
  else return;
  await saveSettings(); render(); settingsSheet();
});
$('sheet').addEventListener('input', e => { if (e.target.id === 'aiKey') $('keyLen').textContent = keyCheck(cleanKey(e.target.value)); });
$('sheet').addEventListener('change', async e => {
  const t = e.target;
  if (t.dataset.sact === 'name'){
    const s = secById(t.closest('[data-sid]').dataset.sid);
    s.label = t.value.trim() || s.label; await saveSettings(); render();
  }
  if (t.id === 'aiModel'){ AI.cfg.models[AI.cfg.provider] = t.value; await saveAi(); refreshBrain(); }
  if (t.id === 'aiBig'){ AI.cfg.big[AI.cfg.provider] = t.value; await saveAi(); refreshBrain(); }
  if (t.id === 'impFile' && t.files[0]){
    try{
      const data = JSON.parse(await t.files[0].text());
      if (data.app !== 'sehee' || !Array.isArray(data.pans)) throw new Error('세희 백업 파일이 아니에요');
      impPending = data;
      $('impNote').textContent = `판 ${data.pans.length}개가 든 백업이에요. 지금 이 폰의 판을 전부 이걸로 바꿔요. 맞으면 「덮어쓰기」를 한 번 더 누르세요.`;
      $('impBtn').textContent = '덮어쓰기'; $('impBtn').classList.add('danger');
    }catch(err){ $('impNote').textContent = '불러오지 못했어요: ' + err.message; }
  }
});

async function exportAll(){
  await flush(true);
  const data = { app:'sehee', version:APP_VERSION, exportedAt:new Date().toISOString(), settings:S.settings, pans:await allPans() };
  const blob = new Blob([JSON.stringify(data)], { type:'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `sehee-backup-${S.today}.json`;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  toast('백업 파일을 내려받았어요');
}
async function doImport(data){
  await tx('pans','readwrite', s => s.clear());
  for (const p of data.pans) await putPan(p);
  if (data.settings && Array.isArray(data.settings.sections)){ S.settings = { ...S.settings, ...data.settings }; await saveSettings(); applyFs(); }
  S.dates = (await allDates()).sort();
  closeSheet(); await goDate(S.today);
  toast(`판 ${data.pans.length}개를 불러왔어요`);
}
/* v1.5.10 (C) 글씨 크기 따로 — 판 글씨(panD)·대화 글씨(chatD)를 1px씩. 전체 '글자 크기'(fs) 위에 더하고 빼는 값, -6 ~ +6 */
const FSD_MIN = -6, FSD_MAX = 6;
const fsBase = () => Math.round(15 * (S.settings.fs || 1));
function applyFs(){ const r = document.documentElement.style, base = 15 * (S.settings.fs || 1);
  r.setProperty('--fs', S.settings.fs || 1);
  r.setProperty('--pan-z', ((base + (S.settings.panD || 0)) / base).toFixed(4));
  r.setProperty('--chat-d', S.settings.chatD || 0);
  applyFont(); }
async function stepFsd(k, d){
  const cur = S.settings[k] || 0, v = d === 0 ? 0 : Math.max(FSD_MIN, Math.min(FSD_MAX, cur + d)), name = k === 'panD' ? '판' : '대화';
  if (v === cur && d){ toast(`${name} 글씨는 더 ${d < 0 ? '작게' : '크게'} 못 해요`); return false; }
  S.settings[k] = v; await saveSettings(); applyFs(); dlog('화면', `${name} 글씨 ${fsBase() + v}`);
  toast(`${name} 글씨 ${fsBase() + v}${v ? ` (기본보다 ${v > 0 ? '+' : ''}${v})` : ' (기본)'}`); return true;
}
$('panFsDn').onclick = () => stepFsd('panD', -1);
$('panFsUp').onclick = () => stepFsd('panD', 1);
/* 글꼴 (v1.2.8) — 본문·제목 짝. 기본은 폰 글꼴(인터넷 없이도). 나머지는 처음 고를 때 인터넷에서 한 번 받아 온다 */
const GF = f => 'https://fonts.googleapis.com/css2?' + f.map(x => 'family=' + x).join('&') + '&display=swap';
const FONTS = [
  { v:'sys', t:'기본', d:'폰 글꼴 + 명조 제목', body:'-apple-system,"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif', head:'"Noto Serif KR","Batang",serif' },
  { v:'pre', t:'프리텐다드', d:'깔끔한 업무용 고딕 + 고운바탕 제목', body:'Pretendard,"Pretendard Variable",-apple-system,sans-serif', head:'"Gowun Batang",serif',
    css:['https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css', GF(['Gowun+Batang:wght@400;700'])] },
  { v:'gowun', t:'고운', d:'부드러운 고운돋움 + 고운바탕', body:'"Gowun Dodum",sans-serif', head:'"Gowun Batang",serif', css:[GF(['Gowun+Dodum', 'Gowun+Batang:wght@400;700'])] },
  { v:'plex', t:'플렉스', d:'단정한 IBM Plex + 함렛 제목', body:'"IBM Plex Sans KR",sans-serif', head:'Hahmlet,serif', css:[GF(['IBM+Plex+Sans+KR:wght@400;500;700', 'Hahmlet:wght@500;700'])] },
  { v:'nanum', t:'나눔', d:'익숙한 나눔고딕 + 나눔명조', body:'"Nanum Gothic",sans-serif', head:'"Nanum Myeongjo",serif', css:[GF(['Nanum+Gothic:wght@400;700', 'Nanum+Myeongjo:wght@400;700'])] },
  { v:'hand', t:'손글씨', d:'세희 말은 개구 손글씨, 나머지는 고운돋움', body:'"Gowun Dodum",sans-serif', head:'"Gowun Batang",serif', talk:'Gaegu,cursive', css:[GF(['Gowun+Dodum', 'Gowun+Batang:wght@400;700', 'Gaegu:wght@400;700'])] },
];
function applyFont(){
  const f = FONTS.find(x => x.v === (S.settings.font || 'sys')) || FONTS[0], r = document.documentElement.style;
  for (const u of f.css || []) if (!document.querySelector(`link[data-font="${u}"]`)){ const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = u; l.dataset.font = u; document.head.appendChild(l); }
  r.setProperty('--f-body', f.body); r.setProperty('--f-head', f.head); r.setProperty('--f-talk', f.talk || 'inherit');
}

/* ── 화면 손짓 ── */
/* 항목 아래 메모칸 (v1.5.1) — 쓰는 대로 저장(다시 그리지 않아서 쓰는 중에 안 끊김). 글이 길면 칸이 늘어난다 */
function memoGrow(ta){ ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 2 + 'px'; }
$('main').addEventListener('input', e => {
  const ta = e.target.closest('textarea[data-memo]'); if (!ta) return;
  const it = findItem(ta.dataset.memo); if (!it) return;
  it.note = ta.value.replace(/\s+$/, '') || undefined; if (!it.note) delete it.note;
  ta.classList.toggle('has', !!it.note); memoGrow(ta); touch();
});
$('main').addEventListener('focusout', e => { const ta = e.target.closest('textarea[data-memo]'); if (ta){ touch(true); dlog('판', '메모 저장 #' + ta.dataset.memo); } });
$('main').addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (a === 'fold'){ const id = b.closest('.sec').dataset.sec; S.folded[id] = !S.folded[id]; render(); return; }
  if (a === 'add'){ const inp = b.parentNode.querySelector('input'); addItem(inp.dataset.sec, inp.value); render(); const again = $('main').querySelector(`.add input[data-sec="${inp.dataset.sec}"]`); again && again.focus(); return; }
  const row = b.closest('.it');
  if (row){
    const it = findItem(row.dataset.id); if (!it) return;
    if (a === 'toggle'){ it.done = !it.done; it.doneAt = it.done ? Date.now() : null; S.justDone = it.done ? it.id : null; touch(true); render(); return; }
    if (a === 'edit'){ startEdit(row); return; }
    if (a === 'menu'){ itemMenu(it.id); return; }
  }
  const ib = b.closest('.ibx');
  if (ib){
    const x = S.pan.inbox.find(v => v.id === ib.dataset.id); if (!x) return;
    if (a === 'ibexp'){ ib.querySelector('.ibtx').classList.toggle('open'); b.textContent = b.textContent === '펼치기' ? '접기' : '펼치기'; return; }
    const snap = snapshot();
    S.pan.inbox = S.pan.inbox.filter(v => v !== x);
    if (a === 'ibmove'){ S.pan.items.push({ id:uid(), sec:b.dataset.sec, text:x.text, tag:null, done:false, since:S.pan.date }); toast(`'${secById(b.dataset.sec).label}'에 담았어요`, () => restore(snap)); }
    else toast('버렸어요', () => restore(snap));
    touch(true); render();
  }
});
$('main').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.isComposing && e.target.matches('.add input')){
    e.preventDefault(); const sec = e.target.dataset.sec; addItem(sec, e.target.value); render();
    const again = $('main').querySelector(`.add input[data-sec="${sec}"]`); again && again.focus();
  }
});
$('main').addEventListener('input', e => {
  if (e.target.id === 'line'){ S.pan.line = e.target.value; grow(e.target); touch(); }
});
$('main').addEventListener('click', e => {
  if (e.target.id === 'stamp'){ const f = S.pan.face || '-_-'; S.pan.face = FACES[(FACES.indexOf(f) + 1) % FACES.length]; e.target.textContent = S.pan.face; touch(true); }
});

$('prev').onclick = () => { const d = S.dates.filter(x => x < S.date).pop(); if (d) goDate(d); };
$('next').onclick = () => { const d = S.dates.find(x => x > S.date && x <= S.today) || S.today; goDate(d); };
$('today').onclick = () => goDate(S.today);
$('oldGo').onclick = () => goDate(S.today);
$('open').onclick = async () => { S.settings.openOnly = !S.settings.openOnly; await saveSettings(); render(); };
$('day').onclick = () => { const p = $('pick'); p.max = S.today; p.value = S.date; try{ p.showPicker(); }catch(e){ p.click(); } };
$('pick').onchange = e => { const v = e.target.value; if (v && v <= S.today) goDate(v); };
$('gear').onclick = settingsSheet;
$('fab').onclick = passSheet;

/* 밤을 넘겨 다시 열면 — 오늘 판으로 넘어간다 */
document.addEventListener('visibilitychange', async () => {
  if (document.hidden){ flush(); return; }
  const t = todayStr();
  if (t !== S.today){ const wasToday = S.date === S.today; S.today = t; if (wasToday) await goDate(t); else render(); }
  if (S.reg) S.reg.update().catch(() => {});
  checkLanes().then(() => askUpdate()).catch(() => {});   /* v1.4.2 보너스 새 버전도 */
});
window.addEventListener('pagehide', () => { flush(); });
