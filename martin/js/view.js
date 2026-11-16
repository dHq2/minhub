/* martin/js/view.js — 판 움직이기(끌기·확대) · 사진 크게 보기. 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
/* ── 판 움직이기: 끌기·두 손가락·휠, 카드 누르기 ── */
const pts = new Map(); let moved = 0, pinch = null;
board.addEventListener('pointerdown', e => { if (e.target.closest('.fit')) return; board.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x:e.clientX, y:e.clientY }); moved = 0; if (pts.size === 2){ const [a, b] = [...pts.values()]; pinch = { d:Math.hypot(a.x - b.x, a.y - b.y), k:cam.k }; } });
board.addEventListener('pointermove', e => { const p = pts.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
  if (pts.size === 1){ moved += Math.abs(dx) + Math.abs(dy); cam.x -= dx / cam.k; cam.y -= dy / cam.k; applyCam(0); }
  else if (pts.size === 2 && pinch){ const [a, b] = [...pts.values()]; moved = 99; cam.k = Math.max(.3, Math.min(2, pinch.k * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d)); applyCam(0); } });
const up = e => { const was = pts.size; pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
  if (was === 1 && moved < 8){ const el = document.elementsFromPoint(e.clientX, e.clientY).find(x => x.classList && x.classList.contains('card')); if (el) cardSheet(el.dataset.id); } };
board.addEventListener('pointerup', up); board.addEventListener('pointercancel', e => { pts.delete(e.pointerId); pinch = null; });
board.addEventListener('wheel', e => { e.preventDefault(); cam.k = Math.max(.3, Math.min(2, cam.k * (e.deltaY < 0 ? 1.1 : .9))); applyCam(0); }, { passive:false });
function cardSheet(id){ const n = nodeOf(id); if (!n) return; if (n.kind === 'photo') return openPv(id); act('카드 열기', { id, title:n.title, kind:n.kind });
  const ls = S.links.filter(L => L.a === id || L.b === id).map(L => { const o = nodeOf(L.a === id ? L.b : L.a); return o ? `<div class="alt"><span>${esc(o.title)}</span><span>${esc(L.label || '')}${L.sure ? '' : ' ?'}</span></div>` : ''; }).join('');
  openSheet(`<h3>${esc(n.title)}</h3><p class="sub">${KINDS[n.kind]}${S.suspect === id ? ' · 용의자' : ''}</p>${n.face ? `<img src="${n.face}" alt="" style="width:120px;height:120px;object-fit:cover;border-radius:6px;filter:grayscale(1)">` : ''}<div class="doc">${esc(n.note || '(메모 없음)')}</div>${ls ? '<p class="sub">이어진 것</p>' + ls : ''}${n.face ? `<div class="btns"><button class="ghost" type="button" data-unface="${n.id}">이 사진 빼기</button>${n.faceFrom && nodeOf(n.faceFrom) ? `<button class="ghost" type="button" data-pvo="${n.faceFrom}">원본 사진 보기</button>` : ''}</div>` : ''}`); }
addEventListener('resize', () => applyCam(0));
/* ── 사진 크게 보기 (v0.3) — 두 손가락 확대·끌기·두 번 눌러 확대, × 로 닫기 ── */
const PV = { k:1, k0:1, x:0, y:0, iw:0, ih:0, pts:new Map(), pinch:null, last:0 };
function pvApply(){ $('#pvI').style.transform = `translate(${PV.x}px,${PV.y}px) scale(${PV.k})`; }
function pvFit(){ const st = $('#pvS'), W = st.clientWidth, H = st.clientHeight; if (!PV.iw) return; PV.k = Math.min(W / PV.iw, H / PV.ih); PV.x = (W - PV.iw * PV.k) / 2; PV.y = (H - PV.ih * PV.k) / 2; PV.k0 = PV.k; pvApply(); }
/* v0.4.2 사진을 띄운 채로 대화 — 기본은 위에 사진, 아래 대화창·입력줄 그대로(「대화 숨기기」로 전체 화면) */
let pvFull = false; try{ pvFull = localStorage.getItem('drmartin.pvfull') === '1'; }catch(e){}
function pvLayout(){ const pv = $('#pv'), st = document.querySelector('.stage'); pv.classList.toggle('full', pvFull); $('#pvC').textContent = pvFull ? '대화 보기' : '대화 숨기기';
  pv.style.setProperty('--pvb', pvFull ? '0px' : Math.max(0, $('#app').clientHeight - st.offsetTop) + 'px'); }
function openPv(id){ const n = nodeOf(id); if (!n) return; act('사진 크게', { id, title:n.title }); PV.id = id;
  $('#pvT').textContent = n.title || '사진'; $('#pvN').textContent = n.note || ''; $('#pv').classList.add('on'); $('#pv').classList.remove('touched'); closeSheet(); pvLayout();
  const im = $('#pvI'), src = photoSrc(n), fb = photoThumb(n); PV.iw = 0; im.style.transform = 'scale(0)';
  im.onload = () => { PV.iw = im.naturalWidth; PV.ih = im.naturalHeight; pvFit(); };
  im.onerror = () => { if (fb && im.getAttribute('src') !== fb) im.src = fb; }; im.src = src || fb;
  if (!n.asset && !n.big && !n.mid && n.pid && DB) DB.doc('photos/' + S.id + '-' + n.id).get().then(ph => { const v = ph && ph.exists ? ph.data() : null; if (v && v.img){ n.mid = v.img; if ($('#pv').classList.contains('on')) im.src = v.img; } }).catch(() => {}); }
$('#pvX').onclick = () => { $('#pv').classList.remove('on'); PV.id = null; };
$('#pvC').onclick = () => { pvFull = !pvFull; try{ localStorage.setItem('drmartin.pvfull', pvFull ? '1' : '0'); }catch(e){} act(pvFull ? '사진 전체 화면' : '사진 보며 대화'); pvLayout(); requestAnimationFrame(pvFit); };
addEventListener('resize', () => { if ($('#pv').classList.contains('on')){ pvLayout(); requestAnimationFrame(pvFit); } });
const pvOpenId = () => $('#pv').classList.contains('on') && PV.id && nodeOf(PV.id) ? PV.id : null;
const pvS = $('#pvS');
const zoomAt = (cx, cy, k) => { k = Math.max(PV.k0 || .1, Math.min(8, k)); PV.x = cx - (cx - PV.x) * k / PV.k; PV.y = cy - (cy - PV.y) * k / PV.k; PV.k = k; pvApply(); };
pvS.addEventListener('pointerdown', e => { $('#pv').classList.add('touched'); pvS.setPointerCapture(e.pointerId); PV.pts.set(e.pointerId, { x:e.clientX, y:e.clientY });
  if (PV.pts.size === 2){ const [a, b] = [...PV.pts.values()]; PV.pinch = { d:Math.hypot(a.x - b.x, a.y - b.y) || 1, k:PV.k }; }
  else { const now = Date.now(); if (now - PV.last < 300){ const r = pvS.getBoundingClientRect(); if (PV.k > PV.k0 * 1.2) pvFit(); else zoomAt(e.clientX - r.left, e.clientY - r.top, PV.k * 2.5); } PV.last = now; } });
pvS.addEventListener('pointermove', e => { const p = PV.pts.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
  if (PV.pts.size === 1){ PV.x += dx; PV.y += dy; pvApply(); }
  else if (PV.pinch){ const [a, b] = [...PV.pts.values()], r = pvS.getBoundingClientRect(); zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, PV.pinch.k * Math.hypot(a.x - b.x, a.y - b.y) / PV.pinch.d); } });
const pvUp = e => { PV.pts.delete(e.pointerId); if (PV.pts.size < 2) PV.pinch = null; };
pvS.addEventListener('pointerup', pvUp); pvS.addEventListener('pointercancel', pvUp);
pvS.addEventListener('wheel', e => { e.preventDefault(); const r = pvS.getBoundingClientRect(); zoomAt(e.clientX - r.left, e.clientY - r.top, PV.k * (e.deltaY < 0 ? 1.15 : .87)); }, { passive:false });


