/* ── 보드 사진첩 v1 (11-15 B) — 업무에 다시 꺼내 볼 사진(서류·안내문·공지·영수증·명함·표)을 쌓아 두는 곳 ──
   인간관계 「사진 단서」(추억·단서, 보스가 시킬 때만)와 따로. 세희가 업무 자료라고 판단하면 알아서 넣고 한 줄만 보고(keep_photo). 정리는 나중에.
   저장: 목록 kv 'bdpics'(동기화) · 이 기기 원본 kv 'bdpic_<id>' = { full:Blob(보낸 사진 사본 1280px), th }(동기화 안 함)
         계정 서버 사본 kv 'bdp_<id>' = { mid(긴 변 1024px), th }(한 장씩 동기화, sync.js SYNC_PFX).
   용량: 서버 사본은 몫(BP.max, 150MB)을 넘으면 오래된 것부터 내린다 — 처음 넣은 기기의 원본은 남고, 다른 기기에선 「이 기기에 없음」.
   보스는 ✕ 로 지운다(되돌리기 5초). 누르면 크게 보기(picview). */
const BP = { list:null, max:150 * 1024 * 1024, urls:new Map() };
const BP_MID = 1024, BP_TH = 240;
async function bpLoad(){ if (!BP.list) BP.list = (await kvGet('bdpics')) || []; return BP.list; }
const bpSave = () => kvSet('bdpics', BP.list || []);
const bpBytes = s => Math.round((String(s || '').length - 23) * 0.75);
async function bpAdd(src, o){
  await bpLoad(); const id = 'bp' + uid();
  const blob = src instanceof Blob ? src : await (await fetch(src)).blob();
  const mid = await imgShrink(blob, BP_MID, 0.78), th = await imgShrink(blob, BP_TH, 0.72);
  const dim = await new Promise(ok => { const i = new Image(); i.onload = () => ok([i.naturalWidth, i.naturalHeight]); i.onerror = () => ok([0, 0]); i.src = th; });
  await kvSet('bdpic_' + id, { full:blob, th });
  await kvSet('bdp_' + id, { mid, th });
  const it = { id, at:Date.now(), d:S.today, title:String(o.title || '').trim().slice(0, 60) || '사진', by:o.by || 'sehee', from:o.from || null, size:blob.size, ss:bpBytes(mid) + bpBytes(th), srv:true, r:dim[1] && dim[0] ? +(dim[1] / dim[0]).toFixed(3) : 1.3 };
  BP.list.push(it); await bpTrim(); await bpSave();
  return it;
}
/* 서버 사본 몫 — 넘으면 오래된 서버 사본부터 내림(이 기기 원본은 그대로) */
async function bpTrim(){
  let tot = BP.list.filter(x => x.srv).reduce((a, x) => a + (x.ss || 0), 0);
  for (const x of [...BP.list].sort((a, b) => a.at - b.at)){ if (tot <= BP.max) break; if (!x.srv) continue; await kvDel('bdp_' + x.id); x.srv = false; tot -= x.ss || 0; dlog('사진첩', `서버 몫 넘어 서버 사본 내림 — ${x.title}`); }
}
async function bpUrl(id, big){
  const k = id + (big ? ':b' : ':t'); if (BP.urls.has(k)) return BP.urls.get(k);
  const loc = await kvGet('bdpic_' + id); let u = null;
  if (loc) u = big ? URL.createObjectURL(loc.full) : loc.th;
  else { const s = await kvGet('bdp_' + id); if (s) u = big ? s.mid : s.th; }
  if (u) BP.urls.set(k, u); return u;
}
async function bpDel(id){
  await bpLoad(); const i = BP.list.findIndex(x => x.id === id); if (i < 0) return;
  const it = BP.list[i], loc = await kvGet('bdpic_' + id), srv = await kvGet('bdp_' + id);
  BP.list.splice(i, 1); await bpSave(); await kvDel('bdpic_' + id); if (srv) await kvDel('bdp_' + id); BP.urls.delete(id + ':b'); BP.urls.delete(id + ':t');
  bpRender();
  toast('사진첩에서 뺐어요', async () => { BP.list.splice(Math.min(i, BP.list.length), 0, it); if (loc) await kvSet('bdpic_' + id, loc); if (srv) await kvSet('bdp_' + id, srv); await bpSave(); bpRender(); });
}
/* 세희 도구 — 보스가 이번에 보낸 사진 중 몇 번째(1부터) */
async function bpTool(a){
  const ns = (a.photos && a.photos.length ? a.photos : [a.photo || 1]).map(Number).filter(n => n >= 1).slice(0, 12), made = [];
  const lastU = [...O.log].reverse().find(m => m.who === 'u' && O.thumbs && O.thumbs[m.at] && O.thumbs[m.at].length);
  for (const n of ns){ const u = bossPic(n); if (!u){ if (!made.length) return { ok:false, error:'보스가 보낸 사진을 찾지 못함(이 기기에 사본이 없음) — 넣지 말고 넘어간다' }; break; }
    try{ made.push(await bpAdd(u, { title:a.title, from:lastU && lastU.at })); }catch(e){ return { ok:false, error:'사진을 못 열었음' }; } }
  const t = String(a.title || '사진').slice(0, 30);
  O.log.push({ who:'a', board:true, text:`보드 사진첩에 넣었어요 — ${t}${made.length > 1 ? ` · ${made.length}장` : ''}`, at:Date.now() }); renderLog(); saveLog();
  if (!(DW.open === 'board' && RL.mode === 'pics') && typeof seeMark === 'function') made.forEach(x => seeMark('board', x.id)); else bpRender();
  return { ok:true, added:made.length, title:t };
}
/* 보드 「사진첩」 칸 — 날짜별, 최근 것 위 */
async function bpRender(){
  if (RL.mode !== 'pics') return;
  await bpLoad(); const g = $('wbGrid'), list = [...BP.list].sort((a, b) => b.at - a.at);
  $('wbCount').textContent = list.length ? `사진 ${list.length}장` : '';
  g.classList.add('bp-on');
  if (!list.length){ g.innerHTML = `<div class="wb-empty">아직 사진이 없어요.<br>서류·안내문·공지 같은 사진을 보내면 세희가 여기 모아 둬요. 「+ 사진」으로 직접 넣어도 돼요.</div>`; return; }
  const days = []; for (const x of list){ const d = days.find(y => y.d === x.d); if (d) d.xs.push(x); else days.push({ d:x.d, xs:[x] }); }
  g.innerHTML = days.map(({ d, xs }) => { const t = parseYmd(d);
    return `<div class="bp-day"><h4>${t.getMonth() + 1}월 ${t.getDate()}일 (${WD[t.getDay()]})</h4><div class="bp-row">${xs.map(x =>
      `<figure class="bp-it" data-bp="${x.id}" style="--r:${x.r || 1.3}"><div class="bp-im"><i class="bp-none">이 기기에 없음</i></div><figcaption>${esc(x.title)}${x.by === 'sehee' ? '<small>세희</small>' : ''}</figcaption><button class="bp-x" data-bpx="${x.id}" aria-label="사진첩에서 빼기">✕</button></figure>`).join('')}</div></div>`; }).join('');
  for (const x of list){ const u = await bpUrl(x.id); const f = g.querySelector(`[data-bp="${x.id}"] .bp-im`); if (f && u) f.innerHTML = `<img src="${u}" alt="" draggable="false">`; }
  if (typeof seeFlush === 'function') seeFlush('board');
}
async function bpOpen(id){
  const list = [...BP.list].sort((a, b) => b.at - a.at), urls = [];
  for (const x of list) urls.push(await bpUrl(x.id, true));
  const ok = list.map((x, i) => [x, urls[i]]).filter(p => p[1]); if (!ok.length) return;
  O.thumbs['bp'] = ok.map(p => p[1]); pvOpen('bp', Math.max(0, ok.findIndex(p => p[0].id === id)));
}
async function bpPick(){
  const f = await picPick(); if (!f) return;
  const it = await bpAdd(f, { title:f.name.replace(/\.[^.]+$/, ''), by:'boss' }); await bpRender(); flashBp(it.id);
}
function flashBp(id){ const el = document.querySelector(`[data-bp="${id}"]`); if (!el) return; el.scrollIntoView({ block:'nearest', behavior:'smooth' }); el.classList.remove('new'); void el.offsetWidth; el.classList.add('new'); }
$('wbPic').onclick = bpPick;
$('wbGrid').addEventListener('click', e => {
  if (RL.mode !== 'pics') return;
  const x = e.target.closest('[data-bpx]'); if (x){ e.stopPropagation(); bpDel(x.dataset.bpx); return; }
  const f = e.target.closest('[data-bp]'); if (f) bpOpen(f.dataset.bp);
});
