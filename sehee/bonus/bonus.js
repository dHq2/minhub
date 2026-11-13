/* 세희 보너스 업데이트 — B0.2
   이 폴더(sehee/bonus/)는 '제작기 2' 방 몫이다. 본체(index.html·sw.js)는 메인 방만 고친다.
   본체와는 window.SEHEE 창구로 잇는다. 쓰는 법은 인수인계 문서 4장.

   변경 기록
   B0.1 (2026-11-13) 자리만 만듦 — 불러와지는지 확인용.
   B0.2 (2026-11-13) 인간관계 판 두 가지.
        ① 사진 카드를 꾹 누르면(폰은 손가락, 컴퓨터는 마우스 0.5초) 카드가 들리고, 그대로 끌어서 원하는 자리에 놓는다.
           놓은 자리는 기기에 b_ppPos 로 저장(판 크기에 대한 비율이라 사람이 늘어 판이 커져도 같은 곳). 빨간 실·서로 잇는 실도 따라온다.
           설정 → 보너스 칸 「인간관계 판 사진 자리 되돌리기」로 처음 자리로.
        ② 판 아래에 화이트보드와 같은 게임식 대화창(이름표 '강세희', 세희가 오른쪽 아래에 올라앉음). 입력은 원래처럼 맨 아래 칸.
        창구에 없는 것(판이 다시 그려지는 때, 대화창 내용)은 인간관계 판 화면을 직접 읽어서 맞췄다 → handoff/to-main.md 창구 요청 B0.2 참고.
        화면이 바뀌어 못 찾으면 조용히 아무것도 안 한다(본체는 그대로). */
(function(){
  const S = window.SEHEE; if (!S) return;
  S.setVersion('B0.2');
  const $ = id => document.getElementById(id);
  const HOLD = 500;          // 꾹 누르는 시간(ms)
  const SLOP = 8;            // 들리기 전에 이만큼 움직이면 그냥 화면 굴리기
  const POS_KEY = 'b_ppPos'; // { 사람id: [가로 비율, 세로 비율] }
  let POS = {};

  /* ── 모양 ── */
  const css = document.createElement('style');
  css.textContent = `
  #ppMap .pp-node{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
  #ppMap .pp-node.b-hold{transition:transform .5s ease;transform:translate(-50%,-50%) rotate(0deg) scale(1.05)}
  #ppMap .pp-node.b-lift,#ppMap .pp-node.b-lift:hover{z-index:8;cursor:grabbing;transition:none;transform:translate(-50%,-50%) rotate(0deg) scale(1.14);box-shadow:0 14px 22px rgba(0,0,0,.45)}
  #ppMap .pp-node.b-lift .pp-pin{transform:translateY(-5px) scale(1.15)}
  #ppMap .pp-node.b-drop{animation:bDrop .35s ease}
  @keyframes bDrop{0%{transform:translate(-50%,-50%) rotate(0deg) scale(1.14)}70%{transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.96)}100%{transform:translate(-50%,-50%) rotate(var(--r,0deg))}}
  #people .b-ppt{--sh:clamp(170px,24dvh,260px);height:clamp(160px,32%,300px)}
  #people .b-ppt .bt-u{color:#5c5340}
  #people .b-ppt .b-ask{display:block;margin-top:6px;font-size:.74rem;color:var(--ink-soft)}
  body.typing #people .b-ppt{--sh:clamp(130px,17dvh,190px);height:clamp(120px,26%,220px)}`;
  document.head.appendChild(css);

  /* ── ① 사진 카드 옮기기 ── */
  const hs = s => { let h = 7; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  const f1 = n => n.toFixed(1);
  const theme = () => { const el = $('people'); return el && el.classList.contains('th-white') ? 'white' : el && el.classList.contains('th-map') ? 'map' : 'cork'; };
  const mapSize = map => parseFloat(map.style.width) || map.offsetWidth || 0;
  const list = () => { const p = S.people && S.people(); return (p && p.list) || []; };

  /* 실 그리기 — 본체 v1.2.1 의 그리는 법과 똑같이(코르크는 곧은 실, 화이트보드·지도는 살짝 휜 선) */
  function strPath(x1, y1, x2, y2, cls, seed, th){
    if (th === 'cork') return `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${cls}"/>`;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, b = ((seed % 21) - 10) / 10 * L * (th === 'map' ? 0.16 : 0.07);
    return `<path d="M${f1(x1)} ${f1(y1)} Q${f1(mx - dy / L * b)} ${f1(my + dx / L * b)} ${f1(x2)} ${f1(y2)}" class="${cls}"/>`;
  }
  function redrawStrings(map){
    const svg = map.querySelector('svg.pp-svg'); if (!svg) return;
    const old = [...svg.querySelectorAll('.pp-str,.pp-lk')]; if (!old.length) return;
    const Sz = mapSize(map), C = Sz / 2, th = theme(), off = th === 'white' ? 54 : th === 'map' ? 30 : 0, pos = {};
    map.querySelectorAll('.pp-node[data-pp]').forEach(n => { pos[n.dataset.pp] = { x:parseFloat(n.style.left), y:parseFloat(n.style.top) }; });
    let out = '';
    const ppl = list();
    for (const p of ppl){ const q = pos[p.id]; if (!q) continue; const d = Math.hypot(q.x - C, q.y - C) || 1;
      out += strPath(C + (q.x - C) / d * off, C + (q.y - C) / d * off * (th === 'white' ? 0.8 : 1), q.x, q.y, 'pp-str', hs(p.id), th); }
    const seen = new Set();
    for (const p of ppl) for (const id of (p.links || [])){ const k = [p.id, id].sort().join('-'); if (seen.has(k) || !pos[id] || !pos[p.id]) continue; seen.add(k); out += strPath(pos[p.id].x, pos[p.id].y, pos[id].x, pos[id].y, 'pp-lk', hs(k), th); }
    const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); tmp.innerHTML = out;
    const at = old[0]; for (const el of [...tmp.childNodes]) svg.insertBefore(el, at);
    old.forEach(el => el.remove());
  }
  /* 본체가 판을 새로 그릴 때마다 — 원래 자리를 기억해 두고, 옮겨 둔 카드는 옮긴 자리로 */
  function applyPos(){
    const map = $('ppMap'); if (!map) return;
    const Sz = mapSize(map); if (!Sz) return;
    let moved = false;
    map.querySelectorAll('.pp-node[data-pp]').forEach(n => {
      if (!n.dataset.bx){ n.dataset.bx = parseFloat(n.style.left); n.dataset.by = parseFloat(n.style.top); }
      const p = POS[n.dataset.pp]; if (!p) return;
      n.style.left = (p[0] * Sz).toFixed(0) + 'px'; n.style.top = (p[1] * Sz).toFixed(0) + 'px'; moved = true;
    });
    if (moved) redrawStrings(map);
  }
  async function savePos(){
    const ids = new Set(list().map(p => p.id));
    for (const k of Object.keys(POS)) if (!ids.has(k)) delete POS[k];
    try{ await S.kvSet(POS_KEY, POS); }catch(e){ S.dlog('오류', '보너스 사진 자리 저장 실패 ' + e.message); }
  }
  async function resetPos(){
    POS = {}; await savePos();
    const map = $('ppMap');
    if (map){ map.querySelectorAll('.pp-node[data-bx]').forEach(n => { n.style.left = n.dataset.bx + 'px'; n.style.top = n.dataset.by + 'px'; }); redrawStrings(map); }
    S.toast('인간관계 판 사진을 처음 자리로 돌렸어요');
  }

  let g = null, noClick = 0;
  function cancelHold(){ if (!g) return; clearTimeout(g.timer); g.n.classList.remove('b-hold'); g = null; }
  function lift(){
    if (!g) return;
    const map = $('ppMap'), Sz = mapSize(map), r = map.getBoundingClientRect();
    g.on = true; g.k = (r.width / Sz) || 1; g.Sz = Sz;
    g.l0 = parseFloat(g.n.style.left); g.t0 = parseFloat(g.n.style.top);
    g.n.classList.remove('b-hold'); g.n.classList.add('b-lift');
    try{ g.n.setPointerCapture(g.pid); }catch(e){}
    try{ navigator.vibrate && navigator.vibrate(15); }catch(e){}
    S.dlog('화면', '보너스: 사진 들어올림 ' + g.id);
  }
  function drop(save){
    if (!g) return;
    const { n, id, on } = g; clearTimeout(g.timer); n.classList.remove('b-hold', 'b-lift'); g = null;
    if (!on) return;
    noClick = Date.now();
    n.classList.remove('b-drop'); void n.offsetWidth; n.classList.add('b-drop');
    n.addEventListener('animationend', () => n.classList.remove('b-drop'), { once:true });
    if (!save) return;
    const Sz = mapSize($('ppMap')) || 1;
    POS[id] = [+(parseFloat(n.style.left) / Sz).toFixed(4), +(parseFloat(n.style.top) / Sz).toFixed(4)];
    savePos(); S.dlog('화면', '보너스: 사진 옮김 ' + id);
  }
  let raf = 0;
  function bindMap(map){
    if (map.dataset.bDrag) return; map.dataset.bDrag = '1';
    map.addEventListener('pointerdown', e => {
      const n = e.target.closest('.pp-node[data-pp]'); if (!n || (e.pointerType === 'mouse' && e.button !== 0)) return;
      cancelHold();
      g = { n, id:n.dataset.pp, pid:e.pointerId, x0:e.clientX, y0:e.clientY, on:false };
      n.classList.add('b-hold'); g.timer = setTimeout(lift, HOLD);
    });
    map.addEventListener('pointermove', e => {
      if (!g || e.pointerId !== g.pid) return;
      const dx = e.clientX - g.x0, dy = e.clientY - g.y0;
      if (!g.on){ if (Math.hypot(dx, dy) > SLOP) cancelHold(); return; }
      e.preventDefault();
      /* 카드가 판 밖으로 삐져나가지 않게 — 카드 반 크기 + 핀 자리만큼 안쪽까지 */
      const mx = g.n.offsetWidth / 2 + 6, my = g.n.offsetHeight / 2 + 10;
      g.n.style.left = Math.max(mx, Math.min(g.Sz - mx, g.l0 + dx / g.k)).toFixed(0) + 'px';
      g.n.style.top = Math.max(my, Math.min(g.Sz - my, g.t0 + dy / g.k)).toFixed(0) + 'px';
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; redrawStrings(map); });
    });
    map.addEventListener('pointerup', e => { if (g && e.pointerId === g.pid) drop(true); });
    map.addEventListener('pointercancel', e => { if (g && e.pointerId === g.pid) drop(true); });
    /* 들린 동안엔 손가락이 판을 굴리지 않게 */
    map.addEventListener('touchmove', e => { if (g && g.on) e.preventDefault(); }, { passive:false });
    map.addEventListener('contextmenu', e => { if (e.target.closest('.pp-node')) e.preventDefault(); });
    /* 옮기고 손을 뗀 건 '눌러서 열기'로 치지 않는다 */
    map.addEventListener('click', e => { if (Date.now() - noClick < 400 && e.target.closest('.pp-node')){ e.stopPropagation(); e.preventDefault(); } }, true);
    new MutationObserver(applyPos).observe(map, { childList:true });
  }

  /* ── ② 판 아래 게임식 대화창 ── */
  const SPR = { 0:'s-lean', 1:'s-hip', 2:'s-think', 3:'s-smug', 4:'s-talk', 5:'s-surprised', 6:'s-front', talk:'s-talk', think:'s-think' };
  const spr = f => `art/${SPR[f] || SPR[0]}.webp`;
  const isOpen = () => { const d = $('dw-people'); return !!(d && d.classList.contains('open')); };
  function addTalkBox(){
    const body = $('people'); if (!body || $('bPpTalk')) return;
    const d = document.createElement('div'); d.className = 'bt b-ppt'; d.id = 'bPpTalk';
    d.innerHTML = `<div class="bt-side"><img id="bPpSpr" src="art/s-lean.webp" alt="강세희"></div><div class="bt-name"><b>강세희</b><button type="button" id="bPpAll">대화 보기 ›</button></div><div class="bt-bub" id="bPpBub"></div>`;
    body.appendChild(d);
    $('bPpAll').onclick = () => S.closeDrawer();
    refit();
  }
  /* 대화창이 들어와 판 높이가 줄었으니 '전체 보기' 배율을 다시 맞춘다(본체 '크게 보기' 상태면 그대로) */
  function refit(){
    const map = $('ppMap'), sc = $('ppScroll'), btn = $('ppCenter'); if (!map || !sc || !isOpen()) return;
    if (btn && btn.textContent.includes('전체')) return;
    const Sz = mapSize(map); if (!Sz || sc.clientWidth < 80) return;
    const k = Math.min(1, (sc.clientWidth - 8) / Sz, (sc.clientHeight - 8) / Sz); map.style.zoom = k;
    sc.scrollLeft = (Sz * k - sc.clientWidth) / 2; sc.scrollTop = (Sz * k - sc.clientHeight) / 2;
  }
  let sig = '';
  function talk(force){
    const bub = $('bPpBub'); if (!bub || !isOpen()) return;
    const log = S.log() || []; let iU = -1, iS = -1;
    for (let i = log.length - 1; i >= 0 && (iU < 0 || iS < 0); i--){ if (iU < 0 && log[i].who === 'u') iU = i; if (iS < 0 && log[i].who === 's') iS = i; }
    const lastU = log[iU], lastS = log[iS];
    const waiting = lastU && iU > iS && Date.now() - (lastU.at || 0) < 180000;
    const sec = waiting ? Math.floor((Date.now() - lastU.at) / 1000) : 0;
    const key = [log.length, lastU && lastU.at, lastS && lastS.at, waiting, sec].join('|');
    if (!force && key === sig) return; sig = key;
    let h = '';
    if (lastU) h += `<div class="bt-u">보스 · ${S.esc((lastU.text || (lastU.pics ? '📷 사진 ' + lastU.pics + '장' : lastU.docs ? '📄 ' + lastU.docs.join(', ') : '')).slice(0, 90))}</div>`;
    if (waiting) h += `<div class="bt-s wait"><i><span></span><span></span><span></span></i><small>${sec < 2 ? '보내는 중' : '세희가 생각 중'} · ${sec}초</small></div>`;
    else if (lastS){
      h += `<div class="bt-s${lastS.err ? ' err' : ''}${lastS.ask && lastS.ask.open ? ' ask' : ''}">${S.esc(lastS.text)}`;
      if (lastS.ask && lastS.ask.open) h += `<span class="b-ask">고를 게 있으면 「대화 보기」에서 누르거나 아래 칸에 써 주세요.</span>`;
      if (lastS.src && lastS.src.length) h += `<span class="src">출처 ${lastS.src.map(x => `<a href="${S.esc(x.u)}" target="_blank" rel="noopener">${S.esc(x.t || x.u)}</a>`).join(' · ')}</span>`;
      h += '</div>';
    } else h += `<div class="bt-s">사진을 꾹 누르면 들어서 옮길 수 있어요. 누구 얘기든 여기서 바로 하세요.</div>`;
    bub.innerHTML = h; bub.scrollTop = bub.scrollHeight;
    const img = $('bPpSpr'), src = spr(waiting ? 2 : lastS ? lastS.face : 0);
    if (img && img.getAttribute('src') !== src) img.setAttribute('src', src);
  }

  /* ── 붙이기 ── */
  async function boot(){
    try{ POS = (await S.kvGet(POS_KEY)) || {}; }catch(e){ POS = {}; }
    const map = $('ppMap'); if (!map){ S.dlog('화면', '보너스: 인간관계 판을 못 찾음 — B0.2 기능 쉼'); return; }
    bindMap(map); addTalkBox(); applyPos();
    const dw = $('dw-people');
    if (dw) new MutationObserver(() => { if (isOpen()){ talk(true); } }).observe(dw, { attributes:true, attributeFilter:['class'] });
    talk(true);
  }
  S.on('say', () => setTimeout(() => talk(true), 30));
  S.on('turnEnd', () => talk(true));
  S.on('tool', () => talk(true));
  setInterval(() => talk(false), 700);
  S.addMenu('인간관계 판 사진 자리 되돌리기', resetPos);
  S.addPrompt('인간관계 판의 사진 카드는 보스가 꾹 눌러(컴퓨터는 마우스를 0.5초 누르고) 직접 끌어 옮길 수 있다. 옮긴 자리는 그 기기에 남는다.');
  boot();
})();
