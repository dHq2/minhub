/* martin/js/view.js — 판 움직이기(끌기·확대) · 사진 크게 보기. 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
/* 11-16 C: 인물 서랍 프사의 흑백(grayscale) 걷음 — 자료 사진은 원래 색 그대로 */
/* ── 판 움직이기·카드 옮기기 (11-16 A, 세희 인간관계 판 방식) ──
   한 번 누르면 고름(금빛 테두리) · 고른 카드를 한 번 더 누르면 상세(사진이면 크게 보기) · 고른 카드를 끌면 옮김 · 안 고른 카드나 빈 곳을 끌면 판이 굴러감
   두 손가락·휠 = 손가락(마우스) 자리를 중심으로 확대·축소 · 빈 곳을 누르면 고름 풀림 · 들고 판 가장자리로 가면 판이 그쪽으로 굴러감 */
const pts = new Map(); let moved = 0, pinch = null, SELC = null, drag = null, dragRaf = 0;
const cardElOf = id => document.querySelector(`#nodes .card[data-id="${id}"]`);
const cardAt = (x, y) => document.elementsFromPoint(x, y).find(el => el.classList && el.classList.contains('card') && el.closest('#nodes'));
function selectCard(id){ unselectCard(); const el = cardElOf(id); if (!el) return; SELC = id; el.classList.add('sel'); act('카드 고름', { id }); }
function unselectCard(){ if (SELC){ const el = cardElOf(SELC); if (el) el.classList.remove('sel'); } SELC = null; }
const camZoom = (px, py, k) => { const r = board.getBoundingClientRect(), W = r.width, H = r.height, ox = px - r.left - W / 2, oy = py - r.top - H / 2;
  k = Math.max(.24, Math.min(2.2, k)); const wx = cam.x + ox / cam.k, wy = cam.y + oy / cam.k; cam.k = k; cam.x = wx - ox / k; cam.y = wy - oy / k; applyCam(0); };
function dragTick(){   /* 들고 가장자리(44px)에 닿으면 판이 굴러가며 카드가 따라간다 */
  if (!drag || !drag.on){ dragRaf = 0; return; }
  const r = board.getBoundingClientRect(), E = 44, sp = d => Math.max(0, E - d) / E * 12, vx = sp(r.right - drag.cx) - sp(drag.cx - r.left), vy = sp(r.bottom - drag.cy) - sp(drag.cy - r.top);
  if (vx || vy){ cam.x += vx / cam.k; cam.y += vy / cam.k; applyCam(0); dragMove(); }
  dragRaf = requestAnimationFrame(dragTick);
}
function dragMove(){ const r = board.getBoundingClientRect(), n = nodeOf(drag.id), el = cardElOf(drag.id); if (!n || !el) return;
  n.x = Math.round(cam.x + (drag.cx - r.left - r.width / 2) / cam.k + drag.gx); n.y = Math.round(cam.y + (drag.cy - r.top - r.height / 2) / cam.k + drag.gy);
  el.style.left = n.x + 'px'; el.style.top = n.y + 'px';
  if (!drag.raf) drag.raf = requestAnimationFrame(() => { if (drag) drag.raf = 0; renderStrings(); renderMarks(); }); }
board.addEventListener('dragstart', e => e.preventDefault());
board.addEventListener('pointerdown', e => { if (e.target.closest('.fit, .undo-bt, button')) return; try{ board.setPointerCapture(e.pointerId); }catch(x){} pts.set(e.pointerId, { x:e.clientX, y:e.clientY }); moved = 0;
  if (pts.size === 1){ const el = cardAt(e.clientX, e.clientY), id = el && el.dataset.id;
    if (id && id === SELC && !busy){ const r = board.getBoundingClientRect(), n = nodeOf(id), wx = cam.x + (e.clientX - r.left - r.width / 2) / cam.k, wy = cam.y + (e.clientY - r.top - r.height / 2) / cam.k;
      drag = { id, pid:e.pointerId, x0:e.clientX, y0:e.clientY, cx:e.clientX, cy:e.clientY, gx:n.x - wx, gy:n.y - wy, on:false, fx:n.x, fy:n.y }; } else drag = null; }
  if (pts.size === 2){ drag = null; const [a, b] = [...pts.values()]; pinch = { d:Math.hypot(a.x - b.x, a.y - b.y) || 1, k:cam.k }; } });
board.addEventListener('pointermove', e => { const p = pts.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
  if (drag && e.pointerId === drag.pid && pts.size === 1){ drag.cx = e.clientX; drag.cy = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
    if (!drag.on){ if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) <= 4) return; drag.on = true; const el = cardElOf(drag.id); if (el) el.classList.add('lift'); try{ navigator.vibrate && navigator.vibrate(12); }catch(x){} if (!dragRaf) dragRaf = requestAnimationFrame(dragTick); }
    dragMove(); return; }
  if (pts.size === 1){ moved += Math.abs(dx) + Math.abs(dy); cam.x -= dx / cam.k; cam.y -= dy / cam.k; applyCam(0); }
  else if (pts.size === 2 && pinch){ const [a, b] = [...pts.values()]; moved = 99; camZoom((a.x + b.x) / 2, (a.y + b.y) / 2, pinch.k * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d); } });
const up = e => { const was = pts.size; pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
  if (drag && e.pointerId === drag.pid){ const d = drag; drag = null; const el = cardElOf(d.id);
    if (d.on){ if (el){ el.classList.remove('lift'); el.classList.remove('dropped'); void el.offsetWidth; el.classList.add('dropped'); } renderStrings(); renderMarks(); save(); act('카드 옮김', { id:d.id, from:[d.fx, d.fy], to:[nodeOf(d.id).x, nodeOf(d.id).y] }); return; } }
  if (was === 1 && moved < 8){ const el = cardAt(e.clientX, e.clientY);
    if (!el){ unselectCard(); return; }
    const id = el.dataset.id; if (id === SELC){ eatClick = Date.now() + 450; cardSheet(id); } else selectCard(id); } };
let eatClick = 0;   /* 서랍을 연 그 누름의 뒤따르는 click 이 바로 덮개를 눌러 닫지 않게 */
document.addEventListener('click', e => { if (Date.now() < eatClick && !e.target.closest('#sheet')){ e.stopPropagation(); e.preventDefault(); } }, true);
board.addEventListener('pointerup', up); board.addEventListener('pointercancel', e => { pts.delete(e.pointerId); pinch = null; if (drag && e.pointerId === drag.pid){ const el = cardElOf(drag.id); if (el) el.classList.remove('lift'); if (drag.on){ renderStrings(); save(); } drag = null; } });
board.addEventListener('wheel', e => { e.preventDefault(); camZoom(e.clientX, e.clientY, cam.k * (e.deltaY < 0 ? 1.12 : .89)); }, { passive:false });
function cardSheet(id){ const n = nodeOf(id); if (!n) return; if (n.kind === 'photo') return openPv(id); act('카드 열기', { id, title:n.title, kind:n.kind });
  const ls = S.links.filter(L => L.a === id || L.b === id).map(L => { const o = nodeOf(L.a === id ? L.b : L.a); return o ? `<div class="alt"><span>${esc(o.title)}</span><span>${esc(L.label || '')}${L.sure ? '' : ' ?'}</span></div>` : ''; }).join('');
  openSheet(`<h3>${esc(n.title)}</h3><p class="sub">${KINDS[n.kind]}${S.suspect === id ? ' · 용의자' : ''}</p>${n.face ? `<img src="${n.face}" alt="" style="width:120px;height:120px;object-fit:cover;border-radius:6px">` : ''}<div class="doc">${esc(n.note || '(메모 없음)')}</div>${ls ? '<p class="sub">이어진 것</p>' + ls : ''}${n.face ? `<div class="btns"><button class="ghost" type="button" data-unface="${n.id}">이 사진 빼기</button>${n.faceFrom && nodeOf(n.faceFrom) ? `<button class="ghost" type="button" data-pvo="${n.faceFrom}">원본 사진 보기</button>` : ''}</div>` : ''}`); }
addEventListener('resize', () => applyCam(0));
/* ── 사진 크게 보기 (v0.3) — 두 손가락 확대·끌기·두 번 눌러 확대, × 로 닫기 ── */
const PV = { k:1, k0:1, x:0, y:0, iw:0, ih:0, pts:new Map(), pinch:null, last:0 };
function pvApply(){ $('#pvI').style.transform = `translate(${PV.x}px,${PV.y}px) scale(${PV.k})`; }
function pvFit(){ const st = $('#pvS'), W = st.clientWidth, H = st.clientHeight; if (!PV.iw) return; PV.k = Math.min(W / PV.iw, H / PV.ih); PV.x = (W - PV.iw * PV.k) / 2; PV.y = (H - PV.ih * PV.k) / 2; PV.k0 = PV.k; pvApply(); }
/* v0.4.2 사진을 띄운 채로 대화 — 기본은 위에 사진, 아래 대화창·입력줄 그대로(「대화 숨기기」로 전체 화면) */
let pvFull = false; try{ pvFull = localStorage.getItem('drmartin.pvfull') === '1'; }catch(e){}
function pvLayout(){ const pv = $('#pv'), st = document.querySelector('.stage'); pv.classList.toggle('full', pvFull); $('#pvC').textContent = pvFull ? '대화 보기' : '대화 숨기기';
  pv.style.setProperty('--pvb', pvFull ? '0px' : Math.max(0, $('#app').clientHeight - st.offsetTop) + 'px'); }
function pvRefresh(){ const id = PV.id, n = id && itemOf(id); if (!n) return; const isEv = /^e/.test(id), ev = isEv ? n : evByCard(id);
  $('#pvT').textContent = (isEv ? evTitle(n) : n.title) || '사진';
  $('#pvN').textContent = [isEv ? (n.card && nodeOf(n.card) || {}).note : n.note, ev && ev.read ? '판독 — ' + ev.read : ev ? '판독문이 아직 없다. 「다시 읽혀」를 누르면 마틴이 원본을 다시 읽는다.' : ''].filter(Boolean).join('\n\n'); }
function openPv(id){ const n = itemOf(id); if (!n) return; const isEv = /^e/.test(id), ev = isEv ? n : evByCard(id), title = isEv ? evTitle(n) : n.title;   /* 11-16 A: 자료함의 원본도 여기서 — 아래엔 마틴의 판독문 */
  act('사진 크게', { id, title }); PV.id = id; pvRefresh(); $('#pv').classList.add('on'); $('#pv').classList.remove('touched'); closeSheet(); pvLayout();
  const im = $('#pvI'), src = photoSrc(n), fb = photoThumb(n); PV.iw = 0; im.style.transform = 'scale(0)';
  im.onload = () => { PV.iw = im.naturalWidth; PV.ih = im.naturalHeight; pvFit(); };
  im.onerror = () => { if (fb && im.getAttribute('src') !== fb) im.src = fb; }; im.src = src || fb;
  if (!n.asset && !n.big && !n.mid && n.pid && DB) DB.doc('photos/' + S.id + '-' + n.id).get().then(ph => { const v = ph && ph.exists ? ph.data() : null; if (v && v.img){ n.mid = v.img; if ($('#pv').classList.contains('on')) im.src = v.img; } }).catch(() => {}); }
$('#pvX').onclick = () => { $('#pv').classList.remove('on'); PV.id = null; };
$('#pvC').onclick = () => { pvFull = !pvFull; try{ localStorage.setItem('drmartin.pvfull', pvFull ? '1' : '0'); }catch(e){} act(pvFull ? '사진 전체 화면' : '사진 보며 대화'); pvLayout(); requestAnimationFrame(pvFit); };
addEventListener('resize', () => { if ($('#pv').classList.contains('on')){ pvLayout(); requestAnimationFrame(pvFit); } });
const pvOpenId = () => $('#pv').classList.contains('on') && PV.id && itemOf(PV.id) ? PV.id : null;
$('#pvR').onclick = () => { if (busy || !PV.id) return; act('다시 읽혀', { id:PV.id }); turn({ text:'이 자료 원본을 처음부터 꼼꼼히 다시 읽어 줘. 판독문도 고쳐 두고.' }); };   /* 11-16 A */
const pvS = $('#pvS');
const zoomAt = (cx, cy, k) => { k = Math.max(PV.k0 || .1, Math.min(8, k)); PV.x = cx - (cx - PV.x) * k / PV.k; PV.y = cy - (cy - PV.y) * k / PV.k; PV.k = k; pvApply(); };
/* 11-16 D: 사진 바깥(어두운 곳)을 톡 누르면 닫기 — 끌기·두 손가락·길게 누름은 닫지 않음. 사진 위 톡은 예전대로(두 번 = 확대) */
const pvOutside = (x, y) => { const r = $('#pvI').getBoundingClientRect(); return !(PV.iw && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom); };
pvS.addEventListener('pointerdown', e => { PV.tap = PV.pts.size ? null : { x:e.clientX, y:e.clientY, t:Date.now(), out:pvOutside(e.clientX, e.clientY) }; });
pvS.addEventListener('pointerup', e => { const t = PV.tap; PV.tap = null;
  if (t && t.out && PV.pts.size <= 1 && Date.now() - t.t < 450 && Math.hypot(e.clientX - t.x, e.clientY - t.y) < 10){ act('사진 바깥 눌러 닫기', { id:PV.id }); $('#pvX').onclick(); } });
pvS.addEventListener('pointerdown', e => { $('#pv').classList.add('touched'); pvS.setPointerCapture(e.pointerId); PV.pts.set(e.pointerId, { x:e.clientX, y:e.clientY });
  if (PV.pts.size === 2){ const [a, b] = [...PV.pts.values()]; PV.pinch = { d:Math.hypot(a.x - b.x, a.y - b.y) || 1, k:PV.k }; }
  else { const now = Date.now(); if (now - PV.last < 300){ const r = pvS.getBoundingClientRect(); if (PV.k > PV.k0 * 1.2) pvFit(); else zoomAt(e.clientX - r.left, e.clientY - r.top, PV.k * 2.5); } PV.last = now; } });
pvS.addEventListener('pointermove', e => { const p = PV.pts.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
  if (PV.pts.size === 1){ PV.x += dx; PV.y += dy; pvApply(); }
  else if (PV.pinch){ const [a, b] = [...PV.pts.values()], r = pvS.getBoundingClientRect(); zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, PV.pinch.k * Math.hypot(a.x - b.x, a.y - b.y) / PV.pinch.d); } });
const pvUp = e => { PV.pts.delete(e.pointerId); if (PV.pts.size < 2) PV.pinch = null; if (PV.pts.size) PV.tap = null; };
pvS.addEventListener('pointerup', pvUp); pvS.addEventListener('pointercancel', pvUp);
pvS.addEventListener('wheel', e => { e.preventDefault(); const r = pvS.getBoundingClientRect(); zoomAt(e.clientX - r.left, e.clientY - r.top, PV.k * (e.deltaY < 0 ? 1.15 : .87)); }, { passive:false });


