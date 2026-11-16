/* martin/js/evidence.js — 자료함(증거 갤러리). 동료가 건넨 원본을 판과 따로 전부 보관하고, 마틴의 판독문을 같이 둔다.
   11-16 A: v0.6 — 판의 사진 카드는 합쳐지거나 떼어질 수 있지만, 자료함의 원본은 사라지지 않는다.
   S.ev = [{ id:'e3', kind:'photo'|'text', card:'n12'|null, title, name, asset, thumb, at, turn, read:'마틴의 판독문', readTurn, len, head }]
   사진 원본 = assets(올린 파일 그대로, 12MB 넘거나 낯선 형식이면 1600px), 글 원문 = 기기 localStorage 'drmartin.ev.<사건>.<e>' + 계정 evid/<사건>-<e>
   마틴에게는 판독문(read)이 매 턴 [자료함]으로 간다 — 사진을 다시 못 봐도 잊지 않게. 더 봐야 하면 look 으로 원본을 다시 청한다 */
function ensureEv(){
  if (!S || S.ev) return; S.ev = []; S.emax = 0;
  for (const n of S.nodes) if (n.kind === 'photo') S.ev.push({ id:'e' + (++S.emax), kind:'photo', card:n.id, title:n.title || '사진', asset:n.asset, thumb:n.thumb || n.img, pid:n.pid, at:S.at || Date.now(), turn:null, read:'' });
}
const evOf = id => (S.ev || []).find(e => e.id === id);
const evByCard = id => (S.ev || []).filter(e => e.card === id).pop();
const itemOf = id => /^e\d+$/.test(id || '') ? evOf(id) : nodeOf(id);
const evTitle = e => !e.own && (e.card && nodeOf(e.card) || {}).title || e.title || (e.kind === 'photo' ? '사진' : e.name || '글');
const evThumb = e => e.thumb || (e.card && nodeOf(e.card) ? photoThumb(nodeOf(e.card)) : '') || (e.asset ? '/_blob/' + e.asset : '');
const evSrc = e => e.asset ? '/_blob/' + e.asset : e.big || (e.card && nodeOf(e.card) ? photoSrc(nodeOf(e.card)) : '') || e.thumb || '';
function addEv(o){ ensureEv(); const e = { id:'e' + (++S.emax), at:Date.now(), turn:S.turn + 1, read:'', ...o }; S.ev.push(e); evPing(); return e; }
function evDetach(cardId, into){   /* 판에서 카드가 합쳐지거나 떼어져도 원본은 자료함에 남는다 */
  for (const e of S.ev || []) if (e.card === cardId){ e.title = evTitle(e); e.own = 1; e.card = into || null; }
}
/* 글 원문 — 기기와 계정에 따로 둔다(판 문서가 무거워지지 않게) */
function keepText(e, text){
  try{ localStorage.setItem(`drmartin.ev.${S.id}.${e.id}`, text); }catch(x){}
  const d = { cid:S.id, id:e.id, name:e.name || '', text:String(text).slice(0, 200000) };
  if (DB) put(`evid/${S.id}-${e.id}`, d); else pending.push([`evid/${S.id}-${e.id}`, d]);
}
async function evTextOf(e){
  try{ const t = localStorage.getItem(`drmartin.ev.${S.id}.${e.id}`); if (t) return t; }catch(x){}
  if (DB){ try{ const d = await DB.doc(`evid/${S.id}-${e.id}`).get(); if (d && d.exists) return d.data().text || ''; }catch(x){} }
  return '';
}
/* 마틴에게 보낼 읽기용 사본 — 보통은 긴 변 1600px 한 장, 세로로 긴 캡처(카톡 스크롤 등)는 폭 1100px 로 위에서부터 겹쳐 자른 조각(많아야 6장) */
async function readCopies(src){
  const own = typeof src !== 'string', url = own ? URL.createObjectURL(src) : src;
  try{
    const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
    const W = img.naturalWidth, H = img.naturalHeight, out = [];
    const jpg = c => new Promise(r => c.toBlob(r, 'image/jpeg', .88));
    const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); return [c, x]; };
    if (H / W <= 2.2){ const k = Math.min(1, 1600 / Math.max(W, H)), [c, x] = cv(Math.round(W * k), Math.round(H * k)); x.drawImage(img, 0, 0, c.width, c.height); out.push(await jpg(c)); }
    else {
      const k = Math.min(1, 1100 / W), tw = Math.round(W * k), th = Math.round(tw * 1.8), ov = Math.round(tw * .12), sh = Math.round(H * k);
      for (let y = 0; y < sh && out.length < 6; y += th - ov){ const h = Math.min(th, sh - y), [c, x] = cv(tw, h); x.drawImage(img, 0, y / k, W, h / k, 0, 0, tw, h); out.push(await jpg(c)); if (y + h >= sh) break; }
    }
    return out.filter(Boolean);
  } catch(e){ return []; } finally { if (own) URL.revokeObjectURL(url); }
}
/* 원본에서 읽기용 사본 — 보관함이 안 열리면 이 기기의 사본·미리보기로라도 */
async function evCopies(e){
  const c = e.card && nodeOf(e.card);
  for (const src of [e.asset ? '/_blob/' + e.asset : '', e.big, c && c.big, c && c.mid, e.thumb]){ if (!src) continue; const r = await readCopies(src); if (r.length) return r; }
  return [];
}
/* 프롬프트의 [자료함] — 새것부터 판독문을 다 싣고, 넘치면 오래된 것은 앞부분만 */
function evText(){
  ensureEv(); if (!S.ev.length) return '(아직 없음)';
  let budget = 14000; const out = [];
  for (const e of S.ev.slice().reverse()){
    const head = `${e.id} ${e.kind === 'photo' ? '사진' : '글'}「${evTitle(e)}」${e.card ? ' · 판 ' + e.card : e.kind === 'photo' ? ' · 판에서 뗌' : ''}${e.turn ? ' · ' + e.turn + '턴에 받음' : ''}`;
    const body = e.read || (e.kind === 'photo' ? '(판독문 없음 — 사진 속을 다시 봐야 하면 look 으로 원본을 청해라)' : e.head ? '앞부분: ' + e.head : '(내용 없음)');
    const take = Math.min(body.length, Math.max(0, budget)); budget -= take;
    out.unshift(head + '\n  ' + (take ? body.slice(0, take) + (take < body.length ? '…' : '') : body.slice(0, 100) + '…'));
  }
  return out.join('\n');
}
function applyReads(raw){
  const rs = Array.isArray(raw && raw.read) ? raw.read : []; let n = 0;
  for (const r of rs.slice(0, 8)){ const e = r && evOf(String(r.id || '')); const t = r && String(r.t || r.text || '').trim(); if (!e || !t) continue; e.read = t.slice(0, 1800); e.readTurn = S.turn; n++; }
  if (n){ act('판독문', { ids:rs.map(r => r && r.id).filter(Boolean) }); evPing(n); save(); if (PV.id) pvRefresh(); }
  return n;
}
/* 11-17 A: 판독문 채우기 — 판독문 없는 사진(자료함 이전에 건넨 것, 판독문이 날아간 것)은 마틴이 다시 볼 때까지 비어 있었다.
   사건을 열 때·턴이 끝날 때, 한가하면 하나씩 원본을 다시 읽혀 채운다. 동료가 말을 건네면(busy) 다음으로 미룬다 */
let evBF = false;
async function evBackfill(){
  if (evBF || !S) return; const todo = () => (S.ev || []).filter(e => e.kind === 'photo' && !e.read && !e.bfFail);
  if (!todo().length) return; evBF = true;
  try{ const sample = await getSample(); if (!sample || !canImg) return;
    for (const e of todo().slice(0, 6)){
      if (busy) break; let imgs = []; try{ imgs = await evCopies(e); }catch(x){} if (!imgs.length){ e.bfFail = 1; continue; }
      const p = `${MARTIN_SHORT}\n지금은 말하지 않고 자료 사진 한 장을 받아 적는다. 동료가 건넨 원본이다(세로로 긴 건 위에서부터 조각).\n화면 속 글자를 빠짐없이: 대화는 '이름(시각): 말' 꼴로 한 줄씩, 날짜 구분선·읽음 표시·삭제된 메시지·방 이름·참여 인원, 프사·배경·사진 속 물건처럼 눈에 띄는 것. ${READ_RULE}\nJSON 하나만: {"t":"판독문"}`;
      try{ const r = await sample.json(p, { model:AI.model, effort:'low', images:imgs }); const t = r && String(r.t || r.read || r.text || '').trim();
        if (t && !e.read){ e.read = t.slice(0, 1800); e.readTurn = S.turn; act('판독문 채움', { ev:e.id, imgs:imgs.length }); evPing(1); save(); if (PV.id) pvRefresh(); } }
      catch(x){ e.bfFail = 1; act('판독문 채우기 실패', { ev:e.id, code:x && x.code || '' }); }
    }
  } finally { evBF = false; }
}
/* ── 자료함 화면 ── */
function evPing(n){ const b = $('#evN'); if (!b || !S) return; b.textContent = (S.ev || []).length || ''; if (n){ const t = $('#btnEv'); t.classList.remove('ping'); void t.offsetWidth; t.classList.add('ping'); } }
function evSheet(){
  ensureEv(); act('자료함 열기', { n:S.ev.length });
  const ph = S.ev.filter(e => e.kind === 'photo').slice().reverse(), tx = S.ev.filter(e => e.kind !== 'photo').slice().reverse();
  const meta = e => `${e.id}${e.turn ? ' · ' + e.turn + '턴' : ''}${e.kind === 'photo' && !e.card ? ' · 판에서 뗌' : ''}`;
  openSheet(`<h3>자료함</h3><p class="sub">동료가 건넨 원본 — 사진 ${ph.length}장 · 글 ${tx.length}건. 누르면 원본과 마틴의 판독문이 나온다. 판에서 떼어진 것도 여기엔 남는다.</p>
  <div class="evg">${ph.map(e => `<button type="button" class="evc${e.read ? ' rd' : ''}" data-ev="${e.id}"><img src="${esc(evThumb(e))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'"><i>${e.read ? '판독' : '미판독'}</i><b>${esc(evTitle(e))}</b><small>${meta(e)}</small></button>`).join('') || '<p class="sub">아직 사진이 없다.</p>'}</div>
  ${tx.length ? `<p class="sub" style="margin:14px 0 6px">글 · 대화 · 파일</p>${tx.map(e => `<button type="button" class="row evt" data-ev="${e.id}"><span class="folder">≣</span><span><b>${esc(evTitle(e))}</b><small>${meta(e)} · ${(e.len || 0).toLocaleString()}자${e.read ? ' · 판독' : ''}</small></span></button>`).join('')}` : ''}`);
}
async function evTextSheet(e){
  act('자료 열기', { id:e.id });
  openSheet(`<h3>${esc(evTitle(e))}</h3><p class="sub">${e.id} · ${e.turn ? e.turn + '턴에 받음 · ' : ''}${(e.len || 0).toLocaleString()}자</p>
  ${e.read ? `<p class="sub" style="margin:10px 0 4px">마틴의 판독</p><div class="doc">${esc(e.read)}</div>` : ''}
  <p class="sub" style="margin:10px 0 4px">원문</p><pre class="evraw" id="evRaw">불러오는 중…</pre>
  <div class="btns" style="margin-top:10px"><button class="ghost" type="button" data-evback>자료함으로</button></div>`);
  const t = await evTextOf(e); const el = $('#evRaw'); if (el) el.textContent = t || '(이 기기와 계정에 원문이 없다 — 판독문만 남아 있다)';
}
$('#btnEv').onclick = () => evSheet();
$('#sheet').addEventListener('click', e => {
  if (e.target.closest('[data-evback]')) return evSheet();
  const b = e.target.closest('[data-ev]'); if (!b) return; const v = evOf(b.dataset.ev); if (!v) return;
  if (v.kind === 'photo') openPv(v.id); else evTextSheet(v);
});
