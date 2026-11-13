/* ── 오래 걸리는 일 (v0.7.2) — 긴 글 정리·캡처 해독 ──
   폰이 앱을 뒤로 보내면 크롬이 화면을 얼리거나 아예 내려버릴 수 있다. 그래서
   ① 한 묶음 읽을 때마다 진행 상황을 저장해 두고(kv 'job'), 앱이 다시 열리면 남은 것부터 이어서 하고,
   ② 얼어 있다 깨어나서 끊긴 요청은 실패로 세지 않고 다시 보내고,
   ③ 폰 위 알림으로 진행 상황과 끝난 걸 알려준다. */
const PG = { hides:0 };
document.addEventListener('visibilitychange', () => {
  if (document.hidden){ PG.hides++; if (JOB.cur) jobNotify(false); }
  else if (JOB.cur) closeJobNote();
});
const waitVisible = () => document.hidden ? new Promise(r => { const f = () => { if (!document.hidden){ document.removeEventListener('visibilitychange', f); r(); } }; document.addEventListener('visibilitychange', f); }) : Promise.resolve();
async function cutTiles(files, signal, onP){
  const tiles = [];
  for (let fi = 0; fi < files.length; fi++){
    onP({ step:`사진 자르는 중 ${fi + 1}/${files.length}` });
    const pic = await loadPic(files[fi]);
    try{
      const plan = planTiles(pic.src, pic.w, pic.h);
      for (let ti = 0; ti < plan.cuts.length; ti++){
        const ct = plan.cuts[ti];
        tiles.push({ b64:await tileB64(pic.src, pic.w, ct.y, ct.h, plan.scale, plan.tw), pic:fi + 1, part:ti + 1, parts:plan.cuts.length, ovPrev:ti > 0 && plan.cuts[ti - 1].ov });
        onP({ total:tiles.length });
        if (signal && signal.aborted) throw new AIError(-2, '');
      }
    }finally{ pic.done(); }
  }
  return tiles;
}
/* job.out[묶음] 에 읽은 글이 쌓인다. 이미 읽은 묶음은 건너뛴다 */
async function readTiles(job, signal, onP){
  const tiles = job.tiles, batches = [];
  for (let i = 0; i < tiles.length; i += TILE.per) batches.push(tiles.slice(i, i + TILE.per));
  job.out = job.out || [];
  const lens = new Array(batches.length).fill(0);
  let done = batches.reduce((a, b, i) => a + (job.out[i] !== undefined && job.out[i] !== null ? b.length : 0), 0);
  const todo = batches.map((_, i) => i).filter(i => job.out[i] === undefined || job.out[i] === null);
  onP({ step:'읽는 중', done, total:tiles.length, chars:0 });
  let k = 0;
  await Promise.all([...Array(Math.min(TILE.lanes, todo.length))].map(async () => {
    while (k < todo.length){
      const bi = todo[k++];
      job.out[bi] = await readBatch(batches[bi], signal, n => { lens[bi] = n; onP({ chars:lens.reduce((a, b) => a + b, 0) }); });
      done += batches[bi].length; onP({ done });
      await kvSet('job', job);   /* 여기서 앱이 내려가도 다음에 이어서 */
    }
  }));
  const text = joinParts(job.out);
  return { text, tiles:tiles.length, lines:text ? text.split('\n').length : 0, failed:(text.match(/\[⚠ 사진/g) || []).length };
}

/* ── 폰 위 알림 ── */
const JOB = { cur:null, lastNote:0 };
const notifyOk = () => 'Notification' in window && Notification.permission === 'granted' && 'serviceWorker' in navigator;
function askNotify(){ try{ if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission().then(() => { if ($('ntInfo')) settingsSheet(); }); }catch(e){} }
function jobLine(){
  const L = O.live; if (!L) return '세희가 일하는 중';
  if (L.ocr){ const o = L.ocr; return o.step === '읽는 중' ? `캡처 읽는 중 · 조각 ${o.done || 0}/${o.total || 0}` : (o.step || '캡처 준비 중'); }
  return L.text ? '정리한 걸 판에 적는 중' : (L.big ? '긴 글 정리 중' : '생각 중');
}
async function jobNotify(final, body){
  if (!notifyOk()) return;
  try{
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(final ? '세희 · 끝났어요' : '세희 · 일하는 중', {
      body:body || jobLine() + ' — 앱을 닫지 말고 두면 계속해요', tag:'sehee-job', icon:'icon-192.png', badge:'icon-192.png',
      renotify:!!final, silent:!final, data:{ url:'./#office' } });
  }catch(e){}
}
async function closeJobNote(){ if (!notifyOk()) return; try{ const reg = await navigator.serviceWorker.ready; (await reg.getNotifications({ tag:'sehee-job' })).forEach(n => n.close()); }catch(e){} }
function jobProgress(){ if (!document.hidden || !JOB.cur) return; const now = Date.now(); if (now - JOB.lastNote < 4000) return; JOB.lastNote = now; jobNotify(false); }

/* 긴 일 하나를 처음부터(또는 저장된 데서부터) 끝까지 — 사진 읽기 → 세희 정리 */
async function runJob(job, um){
  JOB.cur = job; const long = true;
  O.busy = true; growSay(); setFace(2);
  O.abort = new AbortController(); O.live = { text:'', t0:Date.now(), faced:false, big:bigModel(), waitUntil:0 };
  renderLog();
  const showWait = () => { const w = $('waitTxt'); if (w) w.textContent = waitText(); jobProgress(); };
  const tick = setInterval(showWait, 1000);
  const acts0 = O.log.filter(m => m.who === 'a').length;
  const work = async () => {
    try{
      if (job.stage === 'read'){
        O.live.ocr = { step:'읽는 중', done:0, total:job.tiles.length, chars:0 }; renderLog();
        const tr = await readTiles(job, O.abort.signal, pr => { if (O.live && O.live.ocr){ Object.assign(O.live.ocr, pr); showWait(); } });
        um.ocr = tr.text; um.ocrMeta = { tiles:tr.tiles, lines:tr.lines, failed:tr.failed };
        O.live.ocr = null; O.live.t0 = Date.now(); renderLog(); await saveLog();
        if (!tr.text.trim()) throw Object.assign(new AIError(422, ''), { message:'캡처에서 글자를 못 찾았어요. 더 선명한 캡처로 다시 보내 주세요' });
        job.stage = 'organize'; job.tiles = null; job.out = null; await kvSet('job', job);
      }
      let r, again = 0;
      for (;;){
        const h0 = PG.hides;
        try{
          r = await aiTurn(toMessages(O.log), t => {
            O.live.text = t; O.live.search = '';
            if (!O.live.faced && t.trim()){ O.live.faced = true; setFace('talk'); }
            updateLive();
          }, O.abort.signal, { big:long, onRetry:n => { if (O.live){ O.live.retry = n; showWait(); } },
            onWait:ms => { if (!O.live) return; O.live.waitUntil = ms ? Date.now() + ms : 0; showWait(); },
            onSearch:q => { if (!O.live) return; O.live.search = q || '…'; if (!O.live.text) renderLog(); } });
          break;
        }catch(e){
          /* 뒤로 가 있는 동안 얼어서 끊긴 거면 — 화면이 다시 보일 때 처음부터 한 번 더(판은 이미 보고 있으니 중복은 피한다) */
          if ([0, -1].includes(e.code) && (PG.hides !== h0 || document.hidden) && again < 2 && !(e.partial && e.partial.trim())){
            again++; await waitVisible(); O.live.t0 = Date.now(); O.live.text = ''; renderLog(); continue;
          }
          throw e;
        }
      }
      const pf = parseFace(r.text);
      if (/max_tokens|MAX_TOKENS/.test(r.finish)) pf.t += ' …(말이 길어서 잘렸어요)';
      seheeSays(pf, r.sources);
      const acts = O.log.filter(m => m.who === 'a').length - acts0;
      if (document.hidden) jobNotify(true, (acts ? `판에 ${acts}개 적었어요. ` : '') + pf.t.slice(0, 80)); else closeJobNote();
    }catch(err){
      if (err.partial && err.partial.trim()){ const pf = parseFace(err.partial); pf.t += ' …'; seheeSays(pf); }
      if (err.code === -2) seheeSays({ t:'네, 그만둘게요.', f:6 });
      else if (err.code === 422) { O.log.push({ who:'s', text:err.message, face:5, at:Date.now(), err:true }); setFace(5); }
      else { O.log.push({ who:'s', text:'연결이 안 됐어요. ' + err.message + (err.code === 400 && err.raw ? ` — 서버 말: ${err.raw.slice(0, 160)}` : ''), face:5, at:Date.now(), err:true }); setFace(5); }
      if (document.hidden) jobNotify(true, err.code === -2 ? '그만뒀어요.' : '하다가 막혔어요 — 앱에서 이유를 볼 수 있어요.'); else closeJobNote();
    }finally{
      clearInterval(tick); O.live = null; O.abort = null; JOB.cur = null;
      await kvSet('job', null);
      O.busy = false; renderLog(); growSay(); bdGrow(); saveLog();
    }
  };
  /* 잠금을 쥐고 있으면 크롬이 화면을 덜 얼린다(안 되는 폰이면 그냥 한다) */
  if (navigator.locks && navigator.locks.request) await navigator.locks.request('sehee-job', work).catch(work);
  else await work();
}
/* 앱이 다시 열렸을 때 — 하다 만 일이 있으면 이어서 */
async function resumeJob(){
  if (O.busy || !aiReady()) return;
  const job = await kvGet('job'); if (!job) return;
  if (!O.loaded){ O.log = (await kvGet('chat')) || []; O.loaded = true; }
  const um = O.log.find(m => m.who === 'u' && m.at === job.msgAt);
  const answered = um && O.log.some(m => m.who === 's' && m.at > job.msgAt && !m.hint);
  if (!um || answered || Date.now() - job.at > 6 * 3600e3 || (job.stage === 'read' && !(job.tiles && job.tiles.length))){ await kvSet('job', null); return; }
  if (!document.body.classList.contains('office')) location.hash = 'office';
  O.log.push({ who:'s', text:`⏳ 아까 ${job.stage === 'read' ? '캡처 읽던 것' : '정리하던 것'}을 이어서 할게요.`, face:2, at:Date.now(), hint:true });
  renderLog();
  await runJob(job, um);
}
