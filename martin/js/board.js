/* martin/js/board.js — 판 그리기 · 가설 띠 · 마틴의 말(speak) · 판 조작(doOp) · 판 정리 · play. 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
/* ── 판 그리기 ── */
const board = $('#board'), world = $('#world');
const cam = { x:1000, y:1000, k:.9 };
function applyCam(ms){
  const W = board.clientWidth, H = board.clientHeight;
  world.style.transition = ms ? `transform ${ms}ms cubic-bezier(.62,.04,.24,1)` : 'none';
  world.style.transform = `translate(${W / 2 - cam.x * cam.k}px,${H / 2 - cam.y * cam.k}px) scale(${cam.k})`;
}
async function fly(x, y, k, ms = 720){ cam.x = x; cam.y = y; if (k) cam.k = k; if (RM) ms = 0; applyCam(ms); await sleep(ms); }
function fitBox(){
  if (!S.nodes.length) return { x:1000, y:1000, k:.9 };
  let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
  for (const n of S.nodes){ l = Math.min(l, n.x - 100); r = Math.max(r, n.x + 100); t = Math.min(t, n.y - 110); b = Math.max(b, n.y + 110); }
  const W = board.clientWidth, H = board.clientHeight, k = Math.max(.32, Math.min(1, (W - 30) / (r - l), (H - 40) / (b - t)));
  return { x:(l + r) / 2, y:(t + b) / 2, k };
}
const fitAll = ms => { const f = fitBox(); return fly(f.x, f.y, f.k, ms); };

const face = n => { const h = hash(n.id), tone = 40 + h % 30, hair = h % 3;
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="g${n.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(30 4% ${tone + 18}%)"/><stop offset="1" stop-color="hsl(30 4% ${tone - 10}%)"/></linearGradient></defs>
  <path d="M10 104 C12 78 30 70 50 70 C70 70 88 78 90 104Z" fill="#141312"/><ellipse cx="50" cy="44" rx="17" ry="21" fill="url(#g${n.id})"/>
  ${hair === 0 ? '<path d="M32 40 C32 22 68 20 68 40 C64 30 38 30 32 40Z" fill="#111"/>' : hair === 1 ? '<path d="M31 46 C26 18 74 18 69 46 C68 34 60 28 50 28 C40 28 33 34 31 46Z" fill="#1b1a19"/>' : '<path d="M24 36 L76 36 L70 30 L64 18 L36 18 L30 30Z" fill="#0d0d0d"/><rect x="18" y="34" width="64" height="4" rx="2" fill="#0d0d0d"/>'}
  <rect x="44" y="62" width="12" height="9" fill="url(#g${n.id})"/></svg>`; };
const mapSvg = n => { const h = hash(n.id); return `<svg viewBox="0 0 120 62"><path d="M0 ${18 + h % 20}H120M${20 + h % 40} 0V62M0 ${50 - h % 9}L120 ${30 + h % 15}" stroke="#f3eee2" stroke-width="7" fill="none"/><path d="M${70 + h % 30} 0V62" stroke="#f3eee2" stroke-width="4"/><circle cx="${45 + h % 30}" cy="${22 + h % 20}" r="6" fill="#c3141f" stroke="#fff" stroke-width="2"/></svg>`; };
function cardHtml(n, cls = ''){
  const sus = S.suspect === n.id ? ' sus' : '', head = `<i class="pin"></i>`;
  let inner = '';
  if (n.kind === 'person') inner = `<div class="ph${n.face ? ' real' : ''}">${n.face ? `<img src="${n.face}" alt="">` : face(n)}</div><h4>${esc(n.title)}</h4><p>${esc(n.note)}</p>`;
  else if (n.kind === 'brief') inner = `<div class="kk">사건 파일</div><h4>${esc(n.title)}</h4><p>${esc(n.note)}</p>`;
  else if (n.kind === 'place') inner = `${mapSvg(n)}<h4>${esc(n.title)}</h4><p>${esc(n.note)}</p>`;
  else if (n.kind === 'photo') inner = `<img src="${esc(photoThumb(n))}" alt="" onerror="this.style.visibility='hidden'"><h4>${esc(n.title)}</h4>`;
  else inner = `<h4>${esc(n.title)}</h4><p>${esc(n.note)}</p>`;
  return `<div class="card k-${n.kind}${sus} ${cls}" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px;--r:${n.r}deg">${head}${inner}</div>`;
}
function renderNodes(){ $('#nodes').innerHTML = S.nodes.map(n => cardHtml(n)).join(''); measure(); }
function measure(){ for (const el of document.querySelectorAll('#nodes .card')){ const n = nodeOf(el.dataset.id); if (n) n.h = el.offsetHeight, n.w = el.offsetWidth; } }
const pinOf = n => ({ x:n.x, y:n.y - (n.h || 130) / 2 + 2 });
function curve(L){ const A = nodeOf(L.a), B = nodeOf(L.b); if (!A || !B) return null; const p = pinOf(A), q = pinOf(B), d = Math.hypot(q.x - p.x, q.y - p.y), sag = Math.min(70, d * .13), mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2 + sag;
  return { d:`M${p.x.toFixed(1)} ${p.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`, lx:mx, ly:(p.y + q.y) / 2 + sag / 2 }; }
function renderStrings(newId){
  let svg = '', tags = '';
  for (const L of S.links){ const c = curve(L); if (!c) continue;
    svg += `<path class="str${L.sure ? '' : ' maybe'}" data-id="${L.id}" d="${c.d}"/>`;
    if (L.label) tags += `<div class="tag${L.sure ? '' : ' maybe'}${L.id === newId ? ' new' : ''}" style="left:${c.lx}px;top:${c.ly}px;--r:${(hash(L.id) % 7) - 3}deg">${esc(L.label)}${L.sure ? '' : ' ?'}</div>`; }
  $('#strings').innerHTML = svg; $('#tags').innerHTML = tags;
  if (newId){ const p = document.querySelector(`#strings [data-id="${newId}"]`); if (p && !RM){ const len = p.getTotalLength(), dash = p.classList.contains('maybe');
    p.style.strokeDasharray = `${len}`; p.style.strokeDashoffset = `${len}`; p.getBoundingClientRect(); p.style.transition = 'stroke-dashoffset .8s cubic-bezier(.5,0,.3,1)'; p.style.strokeDashoffset = '0';
    setTimeout(() => { p.style.transition = ''; p.style.strokeDasharray = dash ? '' : ''; p.style.strokeDashoffset = ''; }, 900); } }
}
function renderMarks(anim){
  const n = S.suspect && nodeOf(S.suspect); if (!n){ $('#marks').innerHTML = ''; return; }
  const rx = (n.w || 112) / 2 + 24, ry = (n.h || 150) / 2 + 22;
  $('#marks').innerHTML = `<ellipse class="mark" id="mk" cx="${n.x}" cy="${n.y + 4}" rx="${rx}" ry="${ry}" transform="rotate(-7 ${n.x} ${n.y})"/><text class="markt" x="${n.x + rx - 20}" y="${n.y - ry + 4}" transform="rotate(-8 ${n.x} ${n.y})">용의자</text>`;
  if (anim && !RM){ const e = $('#mk'), len = e.getTotalLength(); e.style.strokeDasharray = len; e.style.strokeDashoffset = len; e.getBoundingClientRect(); e.style.transition = 'stroke-dashoffset .9s ease-in-out'; e.style.strokeDashoffset = '0'; }
}
function renderAll(){ ensureNotes(); renderNb(); renderPz(); $('#brain').textContent = brainTxt(); renderNodes(); renderStrings(); renderMarks(); renderHyp(false); $('#caseName').textContent = (nodeOf('n1') || {}).title || '새 사건'; }
function sfx(x, y, t){ const el = document.createElement('div'); el.className = 'sfx'; el.textContent = t; el.style.left = x + 'px'; el.style.top = y + 'px'; world.appendChild(el); setTimeout(() => el.remove(), 800); }
function boom(t){ const el = document.createElement('div'); el.className = 'boom'; el.textContent = t; board.appendChild(el); setTimeout(() => el.remove(), 1200); }

/* 자리 찾기 — 이어진 카드 둘레를 돌며 빈 곳 */
function placeNear(nearId){
  const c = nodeOf(nearId) || nodeOf('n1') || { x:1000, y:1000 }, start = (hash(String(S.nid)) % 12) / 12 * Math.PI * 2;
  for (const R of [230, 330, 440, 560, 690]) for (let i = 0; i < 14; i++){ const a = start + i / 14 * Math.PI * 2, x = c.x + Math.cos(a) * R * 1.05, y = c.y + Math.sin(a) * R * .9;
    if (x < 120 || x > 1880 || y < 140 || y > 1860) continue;
    if (S.nodes.every(n => Math.hypot((n.x - x) / 175, (n.y - y) / 200) > 1)) return { x:Math.round(x), y:Math.round(y) }; }
  return { x:1000 + (Math.random() - .5) * 1200, y:1000 + (Math.random() - .5) * 1200 };
}

/* ── 가설 띠 ── */
/* 11-16 B: 큰 가설 띠는 기록·이력이 안 남아 없앰 → 한 줄 「붙잡은 난제」 띠(puzzles.js renderPzBar). 가설은 난제 지도에 */
function renderHyp(bump){ renderPzBar(bump); }

/* ── 마틴의 말 ── */
let skip = false;
const hhmm = t => t ? new Date(t).toTimeString().slice(0, 5) : '';
function msgHtml(l){
  if (l.who === 'p'){ const ph = (l.photos || []).map(id => nodeOf(id)).filter(n => n && photoThumb(n));
    return `<div class="msg p">${ph.length ? `<span class="ph">${ph.map(n => `<img src="${esc(photoThumb(n))}" data-pv="${n.id}" alt="">`).join('')}</span>` : ''}${(l.files || []).length ? `<span class="ft">파일 · ${esc(l.files.join(', '))}</span>` : ''}${l.viewing && nodeOf(l.viewing) ? `<span class="ft" data-pv="${l.viewing}">보면서 · ${esc(nodeOf(l.viewing).title)}</span>` : ''}${l.text ? `<span class="txt">${esc(l.text)}</span>` : ''}<time>${hhmm(l.at)}</time></div>`; }
  const on = (l.on || []).filter(nodeOf);   /* 11-16 A: 카드를 짚은 말 — 누르면 그 카드로 다시 간다 */
  return `<div class="msg m${on.length ? ' on' : ''}${l.beat === 'reveal' ? ' rv' : ''}"${on.length ? ` data-on="${on.join(' ')}"` : ''}>${esc(l.text)}<time>${hhmm(l.at)}</time></div>`;
}
const chatEl = () => $('#chat');
let stick = true;   /* v0.3 위로 올려 읽는 중이면 끌어내리지 않는다 */
$('#chat').addEventListener('scroll', () => { const c = chatEl(); stick = c.scrollHeight - c.scrollTop - c.clientHeight < 60; }, { passive:true });
const toEnd = force => { const c = chatEl(); if (force || stick){ c.scrollTop = c.scrollHeight; stick = true; } };
function renderChat(force){ chatEl().innerHTML = S.log.map(msgHtml).join('') + (S.pending && !busy ? `<div class="retry">마틴이 아직 답하지 못했다<button type="button" data-retry>다시 묻기</button></div>` : ''); toEnd(force); }
async function speak(t, keep = true, meta){
  t = String(t || '').trim(); if (!t) return; const at = Date.now();
  if (keep){ curLines.push(t); S.log.push({ who:'m', text:t, at, ...(meta || {}) }); save(); }
  chatEl().insertAdjacentHTML('beforeend', `<div class="msg m live${meta && meta.on ? ' on' : ''}"${meta && meta.on ? ` data-on="${esc(meta.on.join(' '))}"` : ''}><span class="tx"></span><time>${hhmm(at)}</time></div>`);
  const el = chatEl().lastElementChild.querySelector('.tx'); skip = false; toEnd();
  for (let i = 1; i <= t.length; i++){ if (skip || RM){ el.textContent = t; break; } el.textContent = t.slice(0, i); if (i % 6 === 0) toEnd(); await sleep(t[i - 1] === '.' || t[i - 1] === '?' ? 150 : 28); }
  chatEl().lastElementChild.classList.remove('live'); toEnd();
  await sleep(skip ? 120 : 480);
}
$('#chat').addEventListener('click', e => { const im = e.target.closest('[data-pv]'); if (im) return openPv(im.dataset.pv);
  if (e.target.closest('[data-retry]')){ act('다시 묻기'); return turn({ retry:true }); }
  const p = e.target.closest('.msg.p'); if (p) return p.classList.toggle('full');
  const o = e.target.closest('.msg.m[data-on]'); if (o && !o.classList.contains('live') && !busy){ act('말에서 카드로', { on:o.dataset.on }); return lookBack(o.dataset.on.split(' ')); }
  skip = true; });
function thinking(on){ $('#martin').classList.toggle('think', on); const w = $('#chat .wait'); if (w) w.remove();
  if (on){ chatEl().insertAdjacentHTML('beforeend', '<div class="msg m wait"><span class="dots"><i></i><i></i><i></i></span></div>'); toEnd(); } }

/* ── 보드 조작 하나씩 (마틴이 따라가며) ── */
/* ── 판 정리 (v0.4) — 사람은 가운데(실 많은 사람이 한가운데), 그 사람의 단서는 바깥쪽 부채꼴, 사진은 왼쪽 줄, 의문은 오른쪽 줄, 시각은 위쪽 줄, 사건 파일은 그 아래 ── */
function tidyPlan(){   /* v0.4.1 세로 화면용 — 위에서 아래로: 시각 줄 → 사건 파일 → 사람(실 많은 사람이 가운데)과 각자의 단서 → 의문 줄 → 사진 줄 → 나머지 */
  const N = S.nodes, deg = {}, nb = {}; for (const L of S.links){ deg[L.a] = (deg[L.a] || 0) + 1; deg[L.b] = (deg[L.b] || 0) + 1; (nb[L.a] = nb[L.a] || []).push(L.b); (nb[L.b] = nb[L.b] || []).push(L.a); }
  const pos = {}, C = { x:1000, y:1000 }, by = k => N.filter(n => n.kind === k), DX = 178, DY = 215, PER = 4;
  const row = (list, y, dir = 1) => { list.forEach((n, i) => { const r = Math.floor(i / PER), inRow = Math.min(PER, list.length - r * PER), c = i % PER; pos[n.id] = { x:C.x + (c - (inRow - 1) / 2) * DX, y:y + dir * r * DY }; }); return list.length ? y + dir * (Math.ceil(list.length / PER) - 1) * DY : y - dir * DY; };
  const people = by('person').sort((a, b) => (deg[b.id] || 0) - (deg[a.id] || 0) || (a.id < b.id ? -1 : 1));
  people.forEach((p, i) => { if (i === 0){ pos[p.id] = { ...C }; return; } const ring = i <= 6 ? 1 : 2, idx = ring === 1 ? i - 1 : i - 7, cnt = ring === 1 ? Math.min(6, people.length - 1) : people.length - 7, a = Math.PI + idx / cnt * Math.PI * 2 + (ring === 2 ? Math.PI / cnt : 0), R = ring === 1 ? 300 : 520;   /* 옆(왼쪽)부터 — 세로로 길쭉해지지 않게 */ pos[p.id] = { x:C.x + Math.cos(a) * R, y:C.y + Math.sin(a) * R * .9 }; });
  const placed = new Set(['n1', ...by('time').map(n => n.id), ...by('photo').map(n => n.id), ...by('question').map(n => n.id), ...people.map(n => n.id)]);
  const home = {}, loose = [];
  for (const n of N){ if (placed.has(n.id)) continue; const pp = (nb[n.id] || []).map(nodeOf).filter(x => x && x.kind === 'person').sort((a, b) => (deg[b.id] || 0) - (deg[a.id] || 0))[0]; if (pp) (home[pp.id] = home[pp.id] || []).push(n); else loose.push(n); }
  for (const [pid, list] of Object.entries(home)){ const P = pos[pid], out = pid === people[0].id ? (people.length > 1 ? Math.PI / 2 : 0) : Math.atan2(P.y - C.y, P.x - C.x);
    list.forEach((n, k) => { const a = out + (k - (list.length - 1) / 2) * .7, R = 210 + Math.floor(k / 4) * 130; pos[n.id] = { x:P.x + Math.cos(a) * R, y:P.y + Math.sin(a) * R }; }); }
  if (!people.length) row(loose.splice(0), C.y);
  let top = C.y, bot = C.y; for (const q of Object.values(pos)){ top = Math.min(top, q.y); bot = Math.max(bot, q.y); }
  const brief = nodeOf('n1'); if (brief){ pos.n1 = { x:C.x, y:top - DY - 10 }; top = pos.n1.y; }
  row(by('time'), top - DY, -1);
  let y = bot + DY + 10; y = row(by('question'), y) + DY; y = row(by('photo'), y) + DY; row(loose, y);
  const ids = Object.keys(pos);   /* 겹침 풀기 */
  for (let it = 0; it < 40; it++) for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++){
    const A = pos[ids[i]], B = pos[ids[j]], dx = B.x - A.x, dy = B.y - A.y, ox = 160 - Math.abs(dx), oy = 190 - Math.abs(dy);
    if (ox > 0 && oy > 0){ if (ox < oy){ const s = (dx >= 0 ? 1 : -1) * ox / 2; A.x -= s; B.x += s; } else { const s = (dy >= 0 ? 1 : -1) * oy / 2; A.y -= s; B.y += s; } } }
  let mnY = 1e9, mxY = -1e9; for (const id of ids){ mnY = Math.min(mnY, pos[id].y); mxY = Math.max(mxY, pos[id].y); }
  const shift = 1000 - (mnY + mxY) / 2;   /* 판 한가운데로 */
  for (const id of ids){ pos[id].x = Math.round(Math.max(110, Math.min(1890, pos[id].x))); pos[id].y = Math.round(Math.max(130, Math.min(1880, pos[id].y + shift))); }
  return pos;
}
async function tidy(){
  const pos = tidyPlan(); await fitAll(500);
  $('#world').classList.add('hidestr'); await sleep(300);
  for (const n of S.nodes){ const q = pos[n.id]; if (!q) continue; n.x = q.x; n.y = q.y; n.r = (hash(n.id) % 7) - 3;
    const el = document.querySelector(`#nodes [data-id="${n.id}"]`); if (el){ el.classList.add('mv'); el.style.left = n.x + 'px'; el.style.top = n.y + 'px'; el.style.setProperty('--r', n.r + 'deg'); } }
  await sleep(950); renderNodes(); renderStrings(); renderMarks(); $('#world').classList.remove('hidestr'); await fitAll(700); act('판 정리됨', { n:S.nodes.length });
}
/* 프사 자르기 — 사진 카드의 가장 좋은 원본에서 box(0~1 비율) 둘레를 정사각형으로 160px */
async function cropFace(F, b){
  if (!b.every(v => isFinite(v)) || b[2] <= 0 || b[3] <= 0) return null;
  for (const src of [photoSrc(F), F.thumb].filter(Boolean)){
    try{ const im = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
      const Wd = im.naturalWidth, Hd = im.naturalHeight, cx = (b[0] + b[2] / 2) * Wd, cy = (b[1] + b[3] / 2) * Hd, side = Math.max(24, Math.max(b[2] * Wd, b[3] * Hd) * 1.15);
      const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d'); g.fillStyle = '#777'; g.fillRect(0, 0, 160, 160);
      g.drawImage(im, cx - side / 2, cy - side / 2, side, side, 0, 0, 160, 160); return c.toDataURL('image/jpeg', .82); }catch(e){}
  }
  return null;
}
async function doOp(op){
  const W = board.clientWidth, H = board.clientHeight;
  if (op.op === 'add'){
    const id = op.id; if (nodeOf(id)) return doOp({ ...op, op:'edit' });
    const kind = KINDS[op.kind] && op.kind !== 'brief' ? op.kind : 'clue', p = placeNear(op.near);
    const n = { id, kind, title:String(op.title || '?').slice(0, 16), note:String(op.note || '').slice(0, 60), x:p.x, y:p.y, r:(hash(id) % 9) - 4 };
    await fly(n.x, n.y, Math.max(cam.k, .85), 650);
    S.nodes.push(n); $('#nodes').insertAdjacentHTML('beforeend', cardHtml(n, 'drop')); measure(); renderStrings();
    await sleep(360); sfx(n.x + 50, n.y - (n.h || 130) / 2, '탁'); await sleep(320);
  } else if (op.op === 'link'){
    const A = nodeOf(op.a), B = nodeOf(op.b); if (!A || !B || A === B) return;
    const old = S.links.find(L => (L.a === A.id && L.b === B.id) || (L.a === B.id && L.b === A.id));
    const L = old || { id:A.id + '-' + B.id, a:A.id, b:B.id }; L.label = String(op.label || '').slice(0, 8); L.sure = op.sure !== false; if (!old) S.links.push(L);
    const k = Math.max(.38, Math.min(1, (W - 60) / (Math.abs(A.x - B.x) + 240), (H - 60) / (Math.abs(A.y - B.y) + 300)));
    await fly((A.x + B.x) / 2, (A.y + B.y) / 2, k, 650); renderStrings(L.id); await sleep(950);
  } else if (op.op === 'edit'){
    const n = nodeOf(op.id); if (!n) return;
    if (op.title) n.title = String(op.title).slice(0, 16); if (op.note !== undefined) n.note = String(op.note).slice(0, 60);
    if (PV.id === n.id){ $('#pvT').textContent = n.title; $('#pvN').textContent = n.note || ''; } if (op.kind && KINDS[op.kind] && n.kind !== 'brief' && n.kind !== 'photo') n.kind = op.kind;
    await fly(n.x, n.y, Math.max(cam.k, .85), 600);
    const el = document.querySelector(`#nodes [data-id="${n.id}"]`); if (el){ el.outerHTML = cardHtml(n, 'flash'); measure(); renderStrings(); renderMarks(); } await sleep(700);
  } else if (op.op === 'suspect'){
    const n = nodeOf(op.id); if (!n || n.kind !== 'person') return;
    await fly(n.x, n.y, Math.max(cam.k, .8), 600); S.suspect = n.id; renderNodes(); renderMarks(true); await sleep(950);
  } else if (op.op === 'merge'){
    const F = nodeOf(op.from), I = nodeOf(op.into); if (!F || !I || F === I || F.kind === 'brief') return;
    await fly((F.x + I.x) / 2, (F.y + I.y) / 2, Math.max(.45, Math.min(1, (W - 60) / (Math.abs(F.x - I.x) + 260), (H - 60) / (Math.abs(F.y - I.y) + 300))), 600);
    if (F.kind === 'photo' && I.kind === 'photo' && !I.asset && !I.big && (F.asset || F.big)){ for (const k of ['asset', 'big', 'mid', 'thumb']) if (F[k]) I[k] = F[k]; }
    if (F.face && !I.face){ I.face = F.face; I.faceFrom = F.faceFrom; }
    for (const L of S.links){ if (L.a === F.id) L.a = I.id; if (L.b === F.id) L.b = I.id; L.id = L.a + '-' + L.b; }
    const seen = new Set(); S.links = S.links.filter(L => { if (L.a === L.b) return false; const k = [L.a, L.b].sort().join('|'); if (seen.has(k)) return false; seen.add(k); return true; });
    for (const m of S.log) if (m.photos) m.photos = m.photos.map(x => x === F.id ? I.id : x);
    if (S.pending && S.pending.photos) S.pending.photos = S.pending.photos.map(x => x === F.id ? I.id : x);
    if (S.suspect === F.id) S.suspect = I.id; if (S.hyp.culprit === F.id) S.hyp.culprit = I.id; pzRename(F.id, I.id);   /* 11-16 B: 난제 근거 id 도 */
    const el = document.querySelector(`#nodes [data-id="${F.id}"]`); if (el){ el.style.transition = 'left .5s,top .5s,opacity .5s'; el.style.left = I.x + 'px'; el.style.top = I.y + 'px'; el.style.opacity = '0'; }
    await sleep(560); S.nodes = S.nodes.filter(x => x !== F); renderAll(); renderChat(); sfx(I.x + 50, I.y - (I.h || 120) / 2, '합침'); await sleep(450);
  } else if (op.op === 'face'){
    const P = nodeOf(op.id), F = nodeOf(op.from), b = op.box; if (!P || P.kind !== 'person' || !F || F.kind !== 'photo' || !Array.isArray(b) || b.length !== 4) return;
    const url = await cropFace(F, b.map(Number)); if (!url){ act('프사 자르기 실패', { id:P.id, from:F.id }); return; }
    P.face = url; P.faceFrom = F.id; act('프사 붙임', { id:P.id, from:F.id });
    await fly(P.x, P.y, Math.max(cam.k, .85), 600); const el = document.querySelector(`#nodes [data-id="${P.id}"]`); if (el){ el.outerHTML = cardHtml(P, 'flash'); measure(); renderStrings(); renderMarks(); } sfx(P.x + 50, P.y - (P.h || 150) / 2, '찰칵'); await sleep(750);
  } else if (op.op === 'tidy'){
    await tidy();
  } else if (op.op === 'remove'){
    const n = nodeOf(op.id); if (!n || n.kind === 'brief') return;
    if (n.kind === 'question'){ const sn = cardSolved(n, op.why || op.line); if (sn){ nbFlash.add(sn.id); setTimeout(renderNb, 600); } }
    await fly(n.x, n.y, Math.max(cam.k, .8), 550); const el = document.querySelector(`#nodes [data-id="${n.id}"]`); if (el) el.classList.add('gone'); await sleep(520);
    S.nodes = S.nodes.filter(x => x !== n); S.links = S.links.filter(L => L.a !== n.id && L.b !== n.id); if (S.suspect === n.id) S.suspect = null; renderAll();
  }
}
function clean(r){
  if (!r || typeof r !== 'object') return { say:[String(r || '…')], ops:[] };
  const ops = Array.isArray(r.ops) ? r.ops.filter(o => o && typeof o === 'object').slice(0, 16) : [];
  for (const o of ops) if (o.op === 'add'){ o.id = /^n\d+$/.test(o.id) ? o.id : 'n' + S.nid; const k = +o.id.slice(1); if (k >= S.nid) S.nid = k + 1; }
  const BEATS = ['look', 'link', 'ask', 'yes', 'reveal'];
  const say = (Array.isArray(r.say) ? r.say : [r.say]).filter(Boolean).slice(0, 10).map(x => {   /* 11-16 A: 줄마다 짚는 카드(on)·박자(beat) */
    if (typeof x !== 'object') return { t:String(x) };
    const on = (Array.isArray(x.on) ? x.on : x.on ? [x.on] : []).map(String).filter(id => /^n\d+$/.test(id)).slice(0, 3);
    return { t:String(x.t || x.text || ''), on, beat:BEATS.includes(x.beat) ? x.beat : on.length > 1 ? 'link' : on.length ? 'look' : '' };
  }).filter(x => x.t.trim());
  if (say.filter(x => x.beat === 'reveal').length > 1) say.forEach((x, i, a) => { if (x.beat === 'reveal' && a.slice(i + 1).some(y => y.beat === 'reveal')) x.beat = 'yes'; });
  return { say, ops, hyp:r.hypothesis, ask:r.ask, raw:r };
}
async function play(r){
  let opsDone = false;
  const runOps = async () => { if (opsDone) return; opsDone = true; if (focusOn) unfocus(true);
    for (const op of r.ops){ await Promise.all([doOp(op).catch(e => { act("판 조작 오류", { op:op.op, msg:String(e && e.message || e).slice(0, 160) }); }), op.line ? speak(op.line) : null]); save(); } };
  for (const l of r.say){
    if (!opsDone && l.on && l.on.some(id => !nodeOf(id) && r.ops.some(o => o.op === 'add' && o.id === id))) await runOps();   /* 새 카드를 짚는 말이면 판부터 꽂고 */
    await sayLine(l);
  }
  if (focusOn) await unfocus();
  await runOps();
  const nr = await applyNotes(r.raw);   /* v0.5 수첩 — 판의 의문 카드가 풀리면 여기서 떼고 풀린 칸으로 */
  const pr = await applyPz(r.raw);   /* 11-16 B: 가설은 난제 지도로(pz). 옛 hypothesis 가 오면 뿌리 난제 가설로 받는다 */
  if (r.ops.length || nr.solved.length) await fitAll(800);
  if (pr.n) await sleep(400);
  if (r.ask) await speak(r.ask);
}


/* ── 11-16 A: 시선 따라가기 — 마틴이 말하며 판의 카드를 짚는다(조금 다가가 비추기·두 카드 잇기·되묻기·확정 연출) ──
   say 줄 {t, on:[카드], beat:look|link|ask|yes|reveal}. 너무 당기지 않는다(배율 0.62~1.0, 여백 넉넉히) */
let focusOn = false, ghostN = 0;
function boxOf(ids){
  const ns = ids.map(nodeOf).filter(Boolean); if (!ns.length) return null;
  const x0 = Math.min(...ns.map(n => n.x - (n.w || 112) / 2)), x1 = Math.max(...ns.map(n => n.x + (n.w || 112) / 2));
  const y0 = Math.min(...ns.map(n => n.y - (n.h || 130) / 2)), y1 = Math.max(...ns.map(n => n.y + (n.h || 130) / 2));
  const W = board.clientWidth, H = board.clientHeight, pad = 150;
  const k = Math.max(.62, Math.min(1, W / (x1 - x0 + pad * 2), H / (y1 - y0 + pad * 2)));
  return { x:(x0 + x1) / 2, y:(y0 + y1) / 2, k, ns };
}
function spot(ids){
  world.classList.add('focus'); focusOn = true;
  for (const el of document.querySelectorAll('#nodes .card')) el.classList.toggle('spot', ids.includes(el.dataset.id));
  for (const p of document.querySelectorAll('#strings .str')){ const L = S.links.find(x => x.id === p.dataset.id); p.classList.toggle('hot', !!L && ids.includes(L.a) && ids.includes(L.b)); }
}
function ghostLink(a, b){   /* 판에 아직 없는 연결 — 분필처럼 점선을 그었다가 지운다 */
  if (S.links.some(L => (L.a === a && L.b === b) || (L.a === b && L.b === a))) return;
  const c = curve({ a, b }); if (!c) return; const g = $('#strings');
  g.insertAdjacentHTML('beforeend', `<path class="ghost" data-g="${++ghostN}" d="${c.d}"/>`);
  const p = g.querySelector(`[data-g="${ghostN}"]`); if (!p || RM) return; const len = p.getTotalLength();
  p.style.strokeDasharray = `${len}`; p.style.strokeDashoffset = `${len}`; p.getBoundingClientRect(); p.style.transition = 'stroke-dashoffset .9s cubic-bezier(.5,0,.3,1)'; p.style.strokeDashoffset = '0';
  setTimeout(() => { p.style.transition = ''; p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }, 950);
}
async function unfocus(quick){
  focusOn = false; world.classList.remove('focus');
  for (const el of document.querySelectorAll('#nodes .card.spot')) el.classList.remove('spot');
  for (const p of document.querySelectorAll('#strings .hot')) p.classList.remove('hot');
  for (const p of document.querySelectorAll('#strings .ghost')) p.remove();
  if (!quick) await fitAll(700);
}
function stampOn(n, t){ const el = document.createElement('div'); el.className = 'stamp'; el.textContent = t; el.style.left = (n.x + (n.w || 112) * .18) + 'px'; el.style.top = (n.y - (n.h || 130) * .25) + 'px'; world.appendChild(el); setTimeout(() => el.remove(), 2600); }
function caption(t){ const el = document.createElement('div'); el.className = 'cap'; el.innerHTML = `<span>${esc(t)}</span>`; board.appendChild(el); setTimeout(() => el.classList.add('out'), 2300); setTimeout(() => el.remove(), 2800); }
async function sayLine(l){
  const ids = (l.on || []).filter(nodeOf);
  if (!ids.length){ if (l.beat === 'reveal'){ board.classList.add('shake'); boom('하!'); setTimeout(() => board.classList.remove('shake'), 500); caption(l.t); } return speak(l.t, true, l.beat ? { beat:l.beat } : undefined); }
  const B = boxOf(ids), meta = { on:ids, beat:l.beat };
  const go = fly(B.x, B.y, B.k, focusOn ? 620 : 760).then(() => {
    spot(ids);
    if (l.beat === 'link' && ids.length > 1) for (let i = 1; i < ids.length; i++) ghostLink(ids[i - 1], ids[i]);
    if (l.beat === 'ask'){ const n = B.ns[B.ns.length - 1]; sfx(n.x + (n.w || 112) / 2 - 6, n.y - (n.h || 130) / 2 - 18, '?'); }
    if (l.beat === 'reveal'){ for (let i = 1; i < ids.length; i++) ghostLink(ids[i - 1], ids[i]); board.classList.add('shake'); setTimeout(() => board.classList.remove('shake'), 500); boom('하!'); stampOn(B.ns[B.ns.length - 1], '그래'); }
  });
  await Promise.all([go, speak(l.t, true, meta)]);
  if (l.beat === 'reveal'){ caption(l.t); await sleep(skip ? 300 : 1700); }
  else if (l.beat === 'ask') await sleep(skip ? 100 : 550);
}
async function lookBack(ids){   /* 대화창의 말을 누르면 그때 짚던 카드로 */
  ids = ids.filter(nodeOf); if (!ids.length) return; const B = boxOf(ids);
  await fly(B.x, B.y, B.k, 620); spot(ids); if (ids.length > 1) for (let i = 1; i < ids.length; i++) ghostLink(ids[i - 1], ids[i]);
  clearTimeout(lookBack.t); lookBack.t = setTimeout(() => { if (!busy) unfocus(true); }, 2600);
}
board.addEventListener('pointerdown', () => { if (busy) skip = true; else if (focusOn) unfocus(true); });
