/* martin/js/board.js — 판 그리기 · 가설 띠 · 마틴의 말(speak) · 판 조작(doOp) · 판 정리 · play. 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
/* ── 판 그리기 ── */
const board = $('#board'), world = $('#world');
const cam = { x:1000, y:1000, k:.9 };
function applyCam(ms){
  const W = board.clientWidth, H = board.clientHeight;
  world.style.transition = ms ? `transform ${ms}ms cubic-bezier(.62,.04,.24,1)` : 'none';
  world.style.transform = `translate(${W / 2 - cam.x * cam.k}px,${H / 2 - cam.y * cam.k}px) scale(${cam.k})`;
  world.style.setProperty('--ik', Math.max(1, Math.min(3, .62 / cam.k)).toFixed(2));   /* 11-16 A: 멀리서 봐도 묶음 이름은 읽히게 */
}
async function fly(x, y, k, ms = 720){ cam.x = x; cam.y = y; if (k) cam.k = k; if (RM) ms = 0; applyCam(ms); await sleep(ms); }
function fitBox(){
  if (!S.nodes.length) return { x:1000, y:1000, k:.9 };
  let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
  for (const n of S.nodes){ l = Math.min(l, n.x - 100); r = Math.max(r, n.x + 100); t = Math.min(t, n.y - 110); b = Math.max(b, n.y + 110); }
  if ((S.groups || []).length){ t -= 40; b += 70; }   /* 11-16 A: 묶음 이름표 자리 · 아래 단추에 안 가리게 */
  const W = board.clientWidth, H = board.clientHeight, k = Math.max(.24, Math.min(1, (W - 30) / (r - l), (H - 40) / (b - t)));
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
  return `<div class="card k-${n.kind}${sus}${typeof SELC !== 'undefined' && SELC === n.id ? ' sel' : ''} ${cls}" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px;--r:${n.r}deg${typeof sizeStyle === 'function' ? sizeStyle(n) : ''}">${head}${inner}</div>`;   /* 11-16 C: 동료가 정한 크기(size.js) */
}
function renderNodes(){ $('#nodes').innerHTML = S.nodes.map(n => cardHtml(n)).join(''); measure(); }
function measure(){ for (const el of document.querySelectorAll('#nodes .card')){ const n = nodeOf(el.dataset.id), s = n && +n.sc || 1; if (n) n.h = Math.round(el.offsetHeight * s), n.w = Math.round(el.offsetWidth * s); } }   /* 11-16 C: 확대·축소(sc)까지 친 보이는 크기 — 실·판 정리가 이걸 쓴다 */
const pinOf = n => ({ x:n.x, y:n.y - (n.h || 130) / 2 + 2 });
function curve(L){ const A = nodeOf(L.a), B = nodeOf(L.b); if (!A || !B) return null; const p = pinOf(A), q = pinOf(B), d = Math.hypot(q.x - p.x, q.y - p.y), sag = Math.min(24, d * .05), mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2 + sag;
  return { d:`M${p.x.toFixed(1)} ${p.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`, lx:mx, ly:(p.y + q.y) / 2 + sag / 2 }; }
function renderStrings(newId){   /* 11-16 A: 실은 전부 카드 위(#xl) — 핀에서 핀으로 팽팽하게, 끝마다 핀 머리. 같은 묶음 안 = 묶음 색 실, 그 밖 = 빨간 실. 꼬리표는 맨 위 */
  let xl = '', tags = ''; const pins = new Set(), placed = [];   /* 11-17 B: placed — 이미 놓은 꼬리표(tagSpot) */
  for (const L of S.links){ const c = curve(L); if (!c) continue; const g = null;   /* 11-16 A: 묶음 색은 지금 단계에선 안 씀(보스) */
    xl += `<path class="str${L.sure ? '' : ' maybe'}${g ? ' gin' : ''}" data-id="${L.id}" d="${c.d}"${g ? ` style="--gc:${gColor(g)}"` : ''}/>`; pins.add(L.a); pins.add(L.b);
    const tp = L.label && typeof tagSpot === 'function' ? tagSpot(L, c, placed) : { x:c.lx, y:c.ly };   /* 11-17 B: 꼬리표가 카드 글씨 위에 앉지 않게 실 위 빈 곳으로 */
    if (L.label) tags += `<div class="tag${L.sure ? '' : ' maybe'}${L.id === newId ? ' new' : ''}" style="left:${tp.x}px;top:${tp.y}px;--r:${(hash(L.id) % 7) - 3}deg${g ? ';--gc:' + gColor(g) : ''}">${esc(L.label)}${L.sure ? '' : ' ?'}</div>`; }
  for (const id of pins){ const n = nodeOf(id); if (!n) continue; const p = pinOf(n); xl += `<circle class="pinh" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="6.5"/>`; }
  $('#strings').innerHTML = ''; $('#xl').innerHTML = '<defs><radialGradient id="pinG" cx=".35" cy=".32" r=".75"><stop offset="0" stop-color="#ff9a8f"/><stop offset=".45" stop-color="#cf1620"/><stop offset="1" stop-color="#4f0507"/></radialGradient></defs>' + xl; $('#tags').innerHTML = tags; renderZones();
  if (newId){ const p = document.querySelector(`#xl [data-id="${newId}"]`); if (p && !RM){ const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`; p.style.strokeDashoffset = `${len}`; p.getBoundingClientRect(); p.style.transition = 'stroke-dashoffset .8s cubic-bezier(.5,0,.3,1)'; p.style.strokeDashoffset = '0';
    setTimeout(() => { p.style.transition = ''; p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }, 900); } }
}
function renderMarks(anim){
  const n = S.suspect && nodeOf(S.suspect); if (!n){ $('#marks').innerHTML = ''; return; }
  const rx = (n.w || 112) / 2 + 24, ry = (n.h || 150) / 2 + 22;
  $('#marks').innerHTML = `<ellipse class="mark" id="mk" cx="${n.x}" cy="${n.y + 4}" rx="${rx}" ry="${ry}" transform="rotate(-7 ${n.x} ${n.y})"/><text class="markt" x="${n.x + rx - 20}" y="${n.y - ry + 4}" transform="rotate(-8 ${n.x} ${n.y})">용의자</text>`;
  if (anim && !RM){ const e = $('#mk'), len = e.getTotalLength(); e.style.strokeDasharray = len; e.style.strokeDashoffset = len; e.getBoundingClientRect(); e.style.transition = 'stroke-dashoffset .9s ease-in-out'; e.style.strokeDashoffset = '0'; }
}
function renderAll(){ ensureNotes(); ensureEv(); evPing(0); renderNb(); renderPz(); $('#brain').textContent = brainTxt(); renderNodes(); renderStrings(); renderMarks(); renderHyp(false); $('#caseName').textContent = (nodeOf('n1') || {}).title || '새 사건'; }
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
/* 판 정리 — 11-16 A: js/tidy.js 의 묶음 배치(relayout·rebuildBoard)로 옮김 */
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
    const kind = KINDS[op.kind] && op.kind !== 'brief' ? op.kind : 'clue', of = op.of && groupOf(op.of) ? op.of : null, p = placeNear(of || op.near);   /* 11-16 A: of = 누구 묶음인지 */
    const n = { id, kind, title:String(op.title || '?').slice(0, 16), note:String(op.note || '').slice(0, 600), x:p.x, y:p.y, r:(hash(id) % 9) - 4 };
    await fly(n.x, n.y, Math.max(cam.k, .85), 650);
    S.nodes.push(n); if (of && joinGroup(id, of)) play.regroup = true; $('#nodes').insertAdjacentHTML('beforeend', cardHtml(n, 'drop')); measure(); renderStrings();
    await sleep(360); sfx(n.x + 50, n.y - (n.h || 130) / 2, '탁'); await sleep(320);
  } else if (op.op === 'link'){
    const A = nodeOf(op.a), B = nodeOf(op.b); if (!A || !B || A === B) return;
    const old = S.links.find(L => (L.a === A.id && L.b === B.id) || (L.a === B.id && L.b === A.id));
    const L = old || { id:A.id + '-' + B.id, a:A.id, b:B.id }; L.label = String(op.label || '').slice(0, 8); L.sure = op.sure !== false; if (!old) S.links.push(L);
    const k = Math.max(.38, Math.min(1, (W - 60) / (Math.abs(A.x - B.x) + 240), (H - 60) / (Math.abs(A.y - B.y) + 300)));
    await fly((A.x + B.x) / 2, (A.y + B.y) / 2, k, 650); renderStrings(L.id); await sleep(950);
  } else if (op.op === 'edit'){
    const n = nodeOf(op.id); if (!n) return;
    if (op.title) n.title = String(op.title).slice(0, 16); if (op.note !== undefined) n.note = String(op.note).slice(0, 600);   /* 11-17 A: 60자에서 잘려 중요한 글자가 사라지던 것 — 저장·프롬프트는 전문, 카드엔 넉 줄만(a.css) */
    if (PV.id === n.id || (PV.id && /^e/.test(PV.id) && (evOf(PV.id) || {}).card === n.id)) pvRefresh(); if (op.kind && KINDS[op.kind] && n.kind !== 'brief' && n.kind !== 'photo') n.kind = op.kind;
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
    evDetach(F.id, I.id);   /* 11-16 A: 원본은 자료함에 그대로 — 카드만 합쳐진 쪽을 가리킨다 */
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
    play.regroup = false; await relayout();
  } else if (op.op === 'remove'){
    const n = nodeOf(op.id); if (!n || n.kind === 'brief') return;
    if (n.kind === 'question'){ const sn = cardSolved(n, op.why || op.line); if (sn){ nbFlash.add(sn.id); setTimeout(renderNb, 600); } }
    await fly(n.x, n.y, Math.max(cam.k, .8), 550); const el = document.querySelector(`#nodes [data-id="${n.id}"]`); if (el) el.classList.add('gone'); await sleep(520);
    evDetach(n.id); S.nodes = S.nodes.filter(x => x !== n); S.links = S.links.filter(L => L.a !== n.id && L.b !== n.id); if (S.suspect === n.id) S.suspect = null; renderAll();
  }
}
const sayable = t => { t = String(t || '').trim(); return !!t && !/^[\[{][\s\S]*[:"][\s\S]*[\]}]$/.test(t) && !/^(undefined|null|\[object Object\]|…)$/.test(t); };
function clean(r){
  if (!r || typeof r !== 'object') return { say:[String(r || '…')], ops:[] };
  const ops = Array.isArray(r.ops) ? r.ops.filter(o => o && typeof o === 'object').slice(0, 16) : [];
  for (const o of ops) if (o.op === 'add'){ o.id = /^n\d+$/.test(o.id) ? o.id : 'n' + S.nid; const k = +o.id.slice(1); if (k >= S.nid) S.nid = k + 1; }
  const BEATS = ['look', 'link', 'ask', 'yes', 'reveal'];
  const say = (Array.isArray(r.say) ? r.say : [r.say]).filter(Boolean).slice(0, 10).map(x => {   /* 11-16 A: 줄마다 짚는 카드(on)·박자(beat) */
    if (typeof x !== 'object') return { t:String(x) };
    const on = (Array.isArray(x.on) ? x.on : x.on ? [x.on] : []).map(String).filter(id => /^n\d+$/.test(id)).slice(0, 3);
    return { t:String(x.t || x.text || ''), on, beat:BEATS.includes(x.beat) ? x.beat : on.length > 1 ? 'link' : on.length ? 'look' : '' };
  }).filter(x => sayable(x.t));   /* 11-17 A: {"placeholder":""} 같은 찌꺼기는 말로 내보내지 않는다 */
  if (say.filter(x => x.beat === 'reveal').length > 1) say.forEach((x, i, a) => { if (x.beat === 'reveal' && a.slice(i + 1).some(y => y.beat === 'reveal')) x.beat = 'yes'; });
  return { say, ops, hyp:r.hypothesis, ask:r.ask, raw:r };
}
/* 11-17 A: 끊겨도 이어지는 연출 — 마틴의 답(r)과 어디까지 했는지를 기기에 적어 두고(drmartin.unplayed), 화면이 다시 열리면 마저 한다(resumePlay).
   판독문은 연출 전에 이미 적용(ai.js turn). 수첩·난제·판 고침도 단계마다 표시해 두 번 하지 않는다 */
const UPK = 'drmartin.unplayed';
const upGet = () => { try{ const u = JSON.parse(localStorage.getItem(UPK) || 'null'); return u && S && u.cid === S.id ? u : null; }catch(e){ return null; } };
const upSet = u => { try{ if (u) localStorage.setItem(UPK, JSON.stringify(u)); else localStorage.removeItem(UPK); }catch(e){} };
function opCap(op){   /* 판 고침 한 줄은 대화창 말이 아니라 카드 곁 자막으로만 */
  const n = nodeOf(op.id || op.a || op.into || ''); if (!n || !op.line) return;
  const el = document.createElement('div'); el.className = 'opcap'; el.textContent = String(op.line).slice(0, 40);
  el.style.left = n.x + 'px'; el.style.top = (n.y - (n.h || 130) / 2 - 14) + 'px'; world.appendChild(el); setTimeout(() => el.remove(), 2600);
}
async function play(r, u){
  u = u || { cid:S.id, turn:S.turn, r:{ say:r.say, ops:r.ops, ask:r.ask, raw:r.raw }, i:0, opi:0, notes:0, pz:0 }; upSet(u);
  const runOps = async () => { if (u.opi >= r.ops.length) return; if (focusOn) unfocus(true);
    while (u.opi < r.ops.length){ const op = r.ops[u.opi]; await doOp(op).catch(e => { act("판 조작 오류", { op:op.op, msg:String(e && e.message || e).slice(0, 160) }); }); opCap(op); u.opi++; upSet(u); save(); } };
  while (u.i < r.say.length){ const l = r.say[u.i];
    if (u.opi < r.ops.length && l.on && l.on.some(id => !nodeOf(id) && r.ops.some(o => o.op === 'add' && o.id === id))) await runOps();   /* 새 카드를 짚는 말이면 판부터 꽂고 */
    await sayLine(l); u.i++; upSet(u);
  }
  if (focusOn) await unfocus();
  play.regroup = false; await runOps();   /* 11-16 A: 자리는 동료가 정한다 — 새 카드는 관련 카드 옆에만 놓고 판 전체를 다시 놓지 않는다 */
  let nr = { solved:[] }, pr = { n:0 };
  if (!u.notes){ nr = await applyNotes(r.raw); u.notes = 1; upSet(u); save(); }   /* v0.5 수첩 — 판의 의문 카드가 풀리면 여기서 떼고 풀린 칸으로 */
  if (!u.pz){ pr = await applyPz(r.raw); u.pz = 1; upSet(u); save(); }   /* 11-16 B: 가설은 난제 지도로(pz) */
  if (r.ops.length || nr.solved.length) await fitAll(800);
  if (pr.n) await sleep(400);
  if (r.ask && !u.asked){ u.asked = 1; upSet(u); await speak(r.ask); }
  upSet(null);
}
async function resumePlay(){   /* 화면이 다시 열렸을 때 — 끊긴 말을 마저 */
  const u = upGet(); if (!u || !u.r || !Array.isArray(u.r.say)) { upSet(null); return false; }
  act('끊긴 답 잇기', { turn:u.turn, from:u.i, of:u.r.say.length });
  if (u.i < u.r.say.length || u.opi < (u.r.ops || []).length) await speak('아까 하던 말을 마저 한다.', false);
  await play({ say:u.r.say, ops:u.r.ops || [], ask:u.r.ask, raw:u.r.raw || {} }, u); save(); renderAll(); return true;
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
  for (const p of document.querySelectorAll('#strings .str, #xl .str, #zones .spine')){ const L = S.links.find(x => x.id === p.dataset.id); p.classList.toggle('hot', !!L && ids.includes(L.a) && ids.includes(L.b)); }
}
function ghostLink(a, b){   /* 판에 아직 없는 연결 — 분필처럼 점선을 그었다가 지운다 */
  if (S.links.some(L => (L.a === a && L.b === b) || (L.a === b && L.b === a))) return;
  const c = curve({ a, b }); if (!c) return; const g = $('#xl');
  g.insertAdjacentHTML('beforeend', `<path class="ghost" data-g="${++ghostN}" d="${c.d}"/>`);
  const p = g.querySelector(`[data-g="${ghostN}"]`); if (!p || RM) return; const len = p.getTotalLength();
  p.style.strokeDasharray = `${len}`; p.style.strokeDashoffset = `${len}`; p.getBoundingClientRect(); p.style.transition = 'stroke-dashoffset .9s cubic-bezier(.5,0,.3,1)'; p.style.strokeDashoffset = '0';
  setTimeout(() => { p.style.transition = ''; p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }, 950);
}
async function unfocus(quick){
  focusOn = false; world.classList.remove('focus');
  for (const el of document.querySelectorAll('#nodes .card.spot')) el.classList.remove('spot');
  for (const p of document.querySelectorAll('#strings .hot, #xl .hot, #zones .hot')) p.classList.remove('hot');
  for (const p of document.querySelectorAll('#xl .ghost, #strings .ghost')) p.remove();
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
