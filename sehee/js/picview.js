/* ── 보스가 보낸 사진 (11-15 C, v1.0) — 크게 보기 · 손가락 확대 · 기기에 저장 · 다시 켜도 남기 ──
   보낼 때 긴 변 1280px JPEG 사본을 이 기기 IndexedDB(kv 'chatpic_<말 시각>')에 둔다. 계정 동기화엔 안 싣는다(용량 — 대화 동기화가 막히지 않게).
   그래서 다른 기기에선 「📷 캡처 n장」 표시만 보인다.
   말풍선의 작은 사진을 누르면 전체 화면: 두 손가락 벌려 확대·끌어서 옮기기·두 번 눌러 크게/원래대로·마우스 휠, 여러 장이면 ‹ › 나 옆으로 밀기.
   「저장」= 기기에 내려받기(폰은 다운로드 폴더 → 갤러리에서도 보임), 「공유」= 폰 공유 창(사진첩에 저장·카톡 보내기 등, 되는 기기만).
   말을 지우면 사진 사본도 같이 지운다(office.js deleteMsg). */
const PICV = { list:[], i:0, at:0, loading:new Set(), none:new Set(), s:1, x:0, y:0 };
const PIC_KEY = at => 'chatpic_' + at;
const PIC_MAX = 12;
async function picShrink(file, max = 1280){
  const url = URL.createObjectURL(file);
  try{
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k));
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(img, 0, 0, w, h);
    return await new Promise(r => c.toBlob(r, 'image/jpeg', 0.88));
  } finally { URL.revokeObjectURL(url); }
}
async function picSave(at, files){
  const out = [];
  for (const f of (files || []).slice(0, PIC_MAX)){ try{ const b = await picShrink(f); if (b) out.push(b); }catch(e){} }
  if (!out.length) return;
  try{ await kvSet(PIC_KEY(at), out); dlog('대화', `사진 사본 ${out.length}장 저장(이 기기)`); }catch(e){ dlog('오류', '사진 사본 저장 실패: ' + e.message); }
}
/* 다시 켠 뒤 — 말풍선이 그려질 때 사본을 불러와 작은 사진을 되살린다 */
async function picLoad(at){
  if (!at || O.thumbs[at] || PICV.loading.has(at) || PICV.none.has(at)) return;
  PICV.loading.add(at);
  try{ const b = await kvGet(PIC_KEY(at)); if (b && b.length){ O.thumbs[at] = b.map(x => URL.createObjectURL(x)); renderLog(); } else PICV.none.add(at); }
  catch(e){ PICV.none.add(at); }
  PICV.loading.delete(at);
}
function picForget(ats){ for (const at of ats || []){ PICV.none.add(at); kvDel(PIC_KEY(at)).catch(() => {}); } }
/* 전체 화면 보기 */
function pvEl(){
  let v = $('pv'); if (v) return v;
  v = document.createElement('div'); v.id = 'pv'; v.className = 'pv'; v.hidden = true;
  v.innerHTML = `<div class="pv-top"><button class="pv-b" data-pv="x" aria-label="닫기">✕</button><span id="pvN"></span>
      <button class="pv-b" data-pv="share" id="pvShare">공유</button><button class="pv-b pv-save" data-pv="save">⬇ 저장</button></div>
    <div class="pv-stage" id="pvStage"><img id="pvImg" alt="보스가 보낸 사진" draggable="false"></div>
    <button class="pv-nav l" data-pv="prev" aria-label="앞 사진">‹</button><button class="pv-nav r" data-pv="next" aria-label="다음 사진">›</button>
    <div class="pv-hint" id="pvHint">두 손가락으로 벌려 확대 · 두 번 누르면 크게</div>`;
  document.body.appendChild(v); pvBind(v); return v;
}
function pvOpen(at, i){
  const list = O.thumbs[at]; if (!list || !list.length) return;
  const v = pvEl(); PICV.list = list; PICV.at = at; PICV.i = Math.max(0, Math.min(list.length - 1, i || 0));
  $('pvShare').hidden = !(navigator.canShare && window.File);
  v.hidden = false; v.classList.remove('in'); void v.offsetWidth; v.classList.add('in');
  document.body.classList.add('pv-on'); dlog('화면', `사진 크게 보기 ${PICV.i + 1}/${list.length}`);
  pvShow();
}
function pvShow(){
  const n = PICV.list.length; PICV.s = 1; PICV.x = 0; PICV.y = 0; pvApply(false);
  $('pvImg').src = PICV.list[PICV.i]; $('pvN').textContent = n > 1 ? `${PICV.i + 1} / ${n}` : '';
  $('pv').classList.toggle('one', n < 2);
  $('pv').querySelector('[data-pv="prev"]').disabled = PICV.i <= 0; $('pv').querySelector('[data-pv="next"]').disabled = PICV.i >= n - 1;
}
function pvClose(){ const v = $('pv'); if (!v || v.hidden) return; v.hidden = true; v.classList.remove('in'); document.body.classList.remove('pv-on'); $('pvImg').removeAttribute('src'); }
const pvOn = () => { const v = $('pv'); return !!(v && !v.hidden); };
function pvApply(anim){ const im = $('pvImg'); im.style.transition = anim ? 'transform .2s ease' : 'none'; im.style.transform = `translate(${PICV.x}px,${PICV.y}px) scale(${PICV.s})`; $('pv').classList.toggle('zoomed', PICV.s > 1.02); }
/* 손가락 아래 점을 붙든 채로 배율 바꾸기 */
function pvZoomAt(s2, px, py, anim){
  const st = $('pvStage').getBoundingClientRect(), cx = st.left + st.width / 2, cy = st.top + st.height / 2;
  s2 = Math.max(1, Math.min(6, s2));
  PICV.x = px - cx - (px - cx - PICV.x) * s2 / PICV.s; PICV.y = py - cy - (py - cy - PICV.y) * s2 / PICV.s; PICV.s = s2;
  if (s2 <= 1.01){ PICV.s = 1; PICV.x = 0; PICV.y = 0; }
  pvClamp(); pvApply(anim);
}
function pvClamp(){
  const im = $('pvImg'), st = $('pvStage'), w = im.offsetWidth * PICV.s, h = im.offsetHeight * PICV.s;
  const mx = Math.max(0, (w - st.clientWidth) / 2), my = Math.max(0, (h - st.clientHeight) / 2);
  PICV.x = Math.max(-mx, Math.min(mx, PICV.x)); PICV.y = Math.max(-my, Math.min(my, PICV.y));
}
async function pvFile(){
  const u = PICV.list[PICV.i], b = await (await fetch(u)).blob(), ext = /png/.test(b.type) ? 'png' : 'jpg';
  const d = new Date(PICV.at), nm = `sehee-photo-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}-${PICV.i + 1}.${ext}`;
  return new File([b], nm, { type:b.type || 'image/jpeg' });
}
async function pvSave(){
  try{
    const f = await pvFile(), u = URL.createObjectURL(f), a = document.createElement('a');
    a.href = u; a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 5000);
    dlog('화면', '사진 저장 ' + f.name); toast('기기에 저장했어요 — 다운로드 폴더(갤러리)에 있어요');
  }catch(e){ toast('저장을 못 했어요 — 사진을 길게 눌러 저장해 보세요'); }
}
async function pvShare(){
  try{ const f = await pvFile(); if (navigator.canShare && navigator.canShare({ files:[f] })) await navigator.share({ files:[f], title:f.name }); else pvSave(); }
  catch(e){ if (e && e.name !== 'AbortError') pvSave(); }
}
function pvGo(d){ const n = PICV.i + d; if (n < 0 || n >= PICV.list.length) return; PICV.i = n; pvShow(); }
function pvBind(v){
  v.addEventListener('click', e => { const b = e.target.closest('[data-pv]'); if (!b) return; const a = b.dataset.pv;
    if (a === 'x') pvClose(); else if (a === 'prev') pvGo(-1); else if (a === 'next') pvGo(1); else if (a === 'save') pvSave(); else if (a === 'share') pvShare(); });
  const stage = v.querySelector('#pvStage'), P = new Map(); let g = null, lastTap = 0;
  const pts = () => [...P.values()];
  stage.addEventListener('pointerdown', e => {
    P.set(e.pointerId, { x:e.clientX, y:e.clientY }); try{ stage.setPointerCapture(e.pointerId); }catch(x){}
    const p = pts();
    if (p.length === 2){ const [a, b] = p; g = { pinch:true, d:Math.hypot(a.x - b.x, a.y - b.y) || 1, s:PICV.s, mx:(a.x + b.x) / 2, my:(a.y + b.y) / 2, x:PICV.x, y:PICV.y }; }
    else if (p.length === 1) g = { pinch:false, x0:e.clientX, y0:e.clientY, x:PICV.x, y:PICV.y, t:performance.now(), moved:false };
    $('pvHint').classList.add('gone');
  });
  stage.addEventListener('pointermove', e => {
    if (!P.has(e.pointerId) || !g) return; P.set(e.pointerId, { x:e.clientX, y:e.clientY }); const p = pts();
    if (g.pinch && p.length >= 2){
      const [a, b] = p, d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      PICV.s = g.s; PICV.x = g.x + (mx - g.mx); PICV.y = g.y + (my - g.my); pvZoomAt(g.s * d / g.d, mx, my, false);
    } else if (!g.pinch){
      const dx = e.clientX - g.x0, dy = e.clientY - g.y0; if (Math.abs(dx) + Math.abs(dy) > 6) g.moved = true;
      if (PICV.s > 1){ PICV.x = g.x + dx; PICV.y = g.y + dy; pvClamp(); pvApply(false); }
      else { $('pvImg').style.transition = 'none'; $('pvImg').style.transform = `translate(${dx * 0.6}px,${Math.max(0, dy) * 0.4}px)`; }
    }
  });
  const up = e => {
    if (!P.has(e.pointerId)) return; P.delete(e.pointerId);
    if (!g) return;
    if (g.pinch){ if (P.size === 0) g = null; else { const [a] = pts(); g = { pinch:false, x0:a.x, y0:a.y, x:PICV.x, y:PICV.y, t:performance.now(), moved:true }; } return; }
    const dx = e.clientX - g.x0, dy = e.clientY - g.y0, moved = g.moved; g = null;
    if (PICV.s <= 1 && moved){
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) pvGo(dx < 0 ? 1 : -1);
      else if (dy > 110 && dy > Math.abs(dx) * 1.5) pvClose();
      else pvApply(true);
      return;
    }
    if (!moved){ const now = performance.now();
      if (now - lastTap < 300){ lastTap = 0; pvZoomAt(PICV.s > 1.02 ? 1 : 2.6, e.clientX, e.clientY, true); }
      else lastTap = now; }
  };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  stage.addEventListener('wheel', e => { e.preventDefault(); pvZoomAt(PICV.s * (e.deltaY < 0 ? 1.18 : 1 / 1.18), e.clientX, e.clientY, false); }, { passive:false });
  document.addEventListener('keydown', e => { if (!pvOn()) return; if (e.key === 'Escape') pvClose(); else if (e.key === 'ArrowLeft') pvGo(-1); else if (e.key === 'ArrowRight') pvGo(1); });
}
/* 말풍선(사무실·판·보드 어디든)의 작은 사진을 누르면 크게 */
document.addEventListener('click', e => {
  const im = e.target.closest('.pics img[data-pv-at]'); if (!im) return;
  e.preventDefault(); e.stopPropagation(); pvOpen(+im.dataset.pvAt, +im.dataset.pvI || 0);
}, true);
