/* 세희 보너스 업데이트 — B0.5
   이 폴더(sehee/bonus/)는 '제작기 2' 방 몫이다. 본체(index.html·sw.js)는 메인 방만 고친다.
   본체와는 window.SEHEE 창구로 잇는다. 쓰는 법은 인수인계 문서 4장.

   변경 기록
   B0.1 (2026-11-13) 자리만 만듦 — 불러와지는지 확인용.
   B0.2 (2026-11-13) 인간관계 판 두 가지.
        ① 사진 카드를 꾹 누르면(폰은 손가락, 컴퓨터는 마우스 0.5초) 카드가 들리고, 그대로 끌어서 원하는 자리에 놓는다.
           놓은 자리는 b_ppPos 에 저장(판 크기에 대한 비율이라 사람이 늘어 판이 커져도 같은 곳). 빨간 실·서로 잇는 실도 따라온다.
           설정 → 보너스 칸 「인간관계 판 사진 자리 되돌리기」로 처음 자리로.
        ② 판 아래에 화이트보드와 같은 게임식 대화창(이름표 '강세희', 세희가 오른쪽 아래에 올라앉음). 입력은 원래처럼 맨 아래 칸.
   B0.3 (2026-11-13) 본체 v1.3.5 가 열어 준 창구로 옮김.
        · 사진 자리: SEHEE.pplPosAll/pplPos/pplRedraw — 본체가 옮긴 자리에 카드와 실을 그린다. b_ppPos 는 이제 계정 동기화(폰↔컴퓨터).
          끄는 동안만 보너스가 카드와 실을 미리 움직여 보여 주고, 놓으면 본체가 최종으로 그린다.
        · 대화창: SEHEE.talk()·on('talk') — 화이트보드 대화창과 똑같이(실시간 글자, 고르기 단추, 다시 시도 단추).
        · 판 화면 오른쪽 견출지(본체 v1.3.4 #panDw): 마우스를 올리면(0.12초 머물면) 바로 그 서랍으로. 손가락 톡·끌기는 본체가 이미 함.
        · 예전 본체(창구 없음)가 남은 기기에서는 B0.2 방식으로 알아서 돌아간다.
   B0.4 (2026-11-13) 인간관계 판 확대·이동. 폰은 두 손가락 벌리기·오므리기(같이 끌면 이동), 컴퓨터는 휠로 확대·축소, 휠 버튼 누른 채 끌면 손바닥 이동.
        판이 다시 그려져도 보던 배율·자리 유지. 서랍을 새로 열거나 「크게/전체 보기」를 누르면 본체 배율로.
   B0.5 (2026-11-13) 세희 자료 카드. 세희가 필요할 때만(생김새·물건·장소를 묻거나 숫자 비교가 핵심일 때) 답 말풍선 안에 사진·그래프 카드를 붙인다.
        정확히 같은 걸 못 찾으면 '비슷한 것' 표시를 달고 가장 가까운 것을 보여 준다. 카드를 누르면 크게 보기 + 출처 열기.
        사진 출처: 위키미디어 공용(자유 이용 사진) · 위키백과 대표 사진. 웹 페이지 대표 사진은 본체 창구 SEHEE.og 가 생기면 자동으로 씀.
        그래프: 막대·꺾은선(세희가 실제 숫자를 줄 때만). 카드 기록은 b_vis(계정 동기화, 최근 60개 답까지).
        본체 v1.3.8 정리: 컴퓨터 틀 굴림 되돌리기는 예전 본체에서만, 인간관계 판 배율은 SEHEE.pplZoom 으로도 넘긴다. */
(function(){
  const S = window.SEHEE; if (!S) return;
  S.setVersion('B0.5');
  const $ = id => document.getElementById(id);
  const HOLD = 500;          // 꾹 누르는 시간(ms)
  const SLOP = 8;            // 들리기 전에 이만큼 움직이면 그냥 화면 굴리기
  const POS_KEY = 'b_ppPos'; // { 사람id: [가로 비율, 세로 비율] }
  const API = typeof S.pplPosAll === 'function' && typeof S.pplRedraw === 'function';   // 본체 v1.3.5+
  const TALK_API = typeof S.talk === 'function';
  const EMPTY = '사진을 꾹 누르면 들어서 옮길 수 있어요. 누구 얘기든 여기서 바로 하세요.';
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
  body.typing #people .b-ppt{--sh:clamp(130px,17dvh,190px);height:clamp(120px,26%,220px)}
  body:not(.alt) .pan-dw button.b-peek{filter:brightness(1.25) saturate(1.2);transform:translateX(-5px);box-shadow:-3px 0 10px rgba(255,240,200,.55)}`;
  document.head.appendChild(css);

  /* ── ① 사진 카드 옮기기 ── */
  const hs = s => { let h = 7; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  const f1 = n => n.toFixed(1);
  const theme = () => { const el = $('people'); return el && el.classList.contains('th-white') ? 'white' : el && el.classList.contains('th-map') ? 'map' : 'cork'; };
  const mapSize = map => parseFloat(map.style.width) || map.offsetWidth || 0;
  const list = () => { const p = S.people && S.people(); return (p && p.list) || []; };
  const asXY = () => { const o = {}; for (const [id, v] of Object.entries(POS)) if (Array.isArray(v)) o[id] = { x:v[0], y:v[1] }; return o; };

  /* 끄는 동안 미리 보기 — 본체 그리는 법과 똑같이(코르크는 곧은 실, 화이트보드·지도는 살짝 휜 선) */
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
  /* 예전 본체용 — 본체가 판을 그린 뒤 옮겨 둔 카드를 옮긴 자리로 (창구가 있으면 안 씀) */
  function applyPosOld(){
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
  function pushPos(){ if (API){ S.pplPosAll(asXY()); S.pplRedraw(); } else applyPosOld(); }
  async function savePos(){
    const ids = new Set(list().map(p => p.id));
    if (ids.size) for (const k of Object.keys(POS)) if (!ids.has(k)) delete POS[k];
    try{ await S.kvSet(POS_KEY, POS); }catch(e){ S.dlog('오류', '보너스 사진 자리 저장 실패 ' + e.message); }
  }
  async function resetPos(){
    POS = {}; await savePos();
    if (API){ S.pplPosAll({}); S.pplRedraw(); }
    else { const map = $('ppMap'); if (map){ map.querySelectorAll('.pp-node[data-bx]').forEach(n => { n.style.left = n.dataset.bx + 'px'; n.style.top = n.dataset.by + 'px'; }); redrawStrings(map); } }
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
    if (!save) return;
    const Sz = mapSize($('ppMap')) || 1;
    POS[id] = [+(parseFloat(n.style.left) / Sz).toFixed(4), +(parseFloat(n.style.top) / Sz).toFixed(4)];
    savePos(); S.dlog('화면', '보너스: 사진 옮김 ' + id);
    if (API){
      S.pplPos(id, { x:POS[id][0], y:POS[id][1] }); S.pplRedraw();
      const nn = document.querySelector(`#ppMap [data-pp="${id}"]`) || n;
      nn.classList.add('b-drop'); nn.addEventListener('animationend', () => nn.classList.remove('b-drop'), { once:true });
    } else { n.classList.remove('b-drop'); void n.offsetWidth; n.classList.add('b-drop'); n.addEventListener('animationend', () => n.classList.remove('b-drop'), { once:true }); }
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
    /* 옮기고 손을 뗀 건 '눌러서 열기(인물 기록부)'로 치지 않는다 */
    map.addEventListener('click', e => { if (Date.now() - noClick < 400 && e.target.closest('.pp-node')){ e.stopPropagation(); e.preventDefault(); } }, true);
    if (!API) new MutationObserver(applyPosOld).observe(map, { childList:true });
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
    if (API){ S.pplRedraw(); return; }
    const map = $('ppMap'), sc = $('ppScroll'), btn = $('ppCenter'); if (!map || !sc || !isOpen()) return;
    if (btn && btn.textContent.includes('전체')) return;
    const Sz = mapSize(map); if (!Sz || sc.clientWidth < 80) return;
    const k = Math.min(1, (sc.clientWidth - 8) / Sz, (sc.clientHeight - 8) / Sz); map.style.zoom = k;
    sc.scrollLeft = (Sz * k - sc.clientWidth) / 2; sc.scrollTop = (Sz * k - sc.clientHeight) / 2;
  }
  /* 예전 본체용 흉내 — 대화 기록만 보고 */
  function talkOld(){
    const log = S.log() || []; let iU = -1, iS = -1;
    for (let i = log.length - 1; i >= 0 && (iU < 0 || iS < 0); i--){ if (iU < 0 && log[i].who === 'u') iU = i; if (iS < 0 && log[i].who === 's') iS = i; }
    const lastU = log[iU], lastS = log[iS];
    const waiting = lastU && iU > iS && Date.now() - (lastU.at || 0) < 180000;
    const sec = waiting ? Math.floor((Date.now() - lastU.at) / 1000) : 0;
    let h = '';
    if (lastU) h += `<div class="bt-u">보스 · ${S.esc((lastU.text || (lastU.pics ? '📷 사진 ' + lastU.pics + '장' : lastU.docs ? '📄 ' + lastU.docs.join(', ') : '')).slice(0, 90))}</div>`;
    if (waiting) h += `<div class="bt-s wait"><i><span></span><span></span><span></span></i><small>${sec < 2 ? '보내는 중' : '세희가 생각 중'} · ${sec}초</small></div>`;
    else if (lastS){
      h += `<div class="bt-s${lastS.err ? ' err' : ''}${lastS.ask && lastS.ask.open ? ' ask' : ''}">${S.esc(lastS.text)}`;
      if (lastS.ask && lastS.ask.open) h += `<span class="b-ask">고를 게 있으면 「대화 보기」에서 누르거나 아래 칸에 써 주세요.</span>`;
      if (lastS.src && lastS.src.length) h += `<span class="src">출처 ${lastS.src.map(x => `<a href="${S.esc(x.u)}" target="_blank" rel="noopener">${S.esc(x.t || x.u)}</a>`).join(' · ')}</span>`;
      h += '</div>';
    } else h += `<div class="bt-s">${EMPTY}</div>`;
    return { html:h, sprite:spr(waiting ? 2 : lastS ? lastS.face : 0) };
  }
  let sig = '';
  function talk(force){
    const bub = $('bPpBub'); if (!bub || !isOpen()) return;
    const t = TALK_API ? S.talk(EMPTY) : talkOld();
    const key = t.html + '|' + t.sprite;
    if (!force && key === sig) return; sig = key;
    bub.innerHTML = t.html; bub.scrollTop = bub.scrollHeight;
    const img = $('bPpSpr'); if (img && t.sprite && img.getAttribute('src') !== t.sprite) img.setAttribute('src', t.sprite);
  }

  /* ── ③ 판 화면 오른쪽 견출지 — 마우스를 올리면 바로 그 서랍으로 (B0.3) ──
     본체 v1.3.4 #panDw 가 손가락 톡·끌기는 이미 한다. 여기선 마우스 올리기만. */
  const TABS = { cal:'달력', board:'보드', people:'사람' };
  let hov = null, hovT = 0, gone = 0;
  function jump(k){
    if (!TABS[k] || Date.now() - gone < 600) return;
    gone = Date.now();
    S.dlog('화면', `보너스: 판 견출지(마우스) → ${TABS[k]}`);
    /* 컴퓨터 틀에선 주소에 #office 가 붙는 순간 브라우저가 화면을 굴려 서랍 머리가 잘린다 — 넘어간 뒤 제자리로 */
    if (typeof S.pplZoom === 'function'){ S.goView(k); return; }   // v1.3.8+ 는 본체가 굴림을 막는다
    const sx = scrollX, sy = scrollY, keep = () => { if (scrollX !== sx || scrollY !== sy) scrollTo(sx, sy); };
    S.goView(k);
    keep(); setTimeout(keep, 0); setTimeout(keep, 60); setTimeout(keep, 250);
  }
  function bindPanTabs(){
    const box = $('panDw'); if (!box || box.dataset.bHover) return; box.dataset.bHover = '1';
    box.addEventListener('pointerover', e => {
      if (e.pointerType !== 'mouse' || e.buttons) return;
      const b = e.target.closest('button[data-pdw]'); if (!b || b === hov) return;
      if (hov) hov.classList.remove('b-peek');
      hov = b; b.classList.add('b-peek'); clearTimeout(hovT);
      hovT = setTimeout(() => { if (hov === b && b.matches(':hover')){ b.classList.remove('b-peek'); hov = null; jump(b.dataset.pdw); } }, 120);
    });
    box.addEventListener('pointerout', e => {
      if (e.pointerType !== 'mouse' || !hov) return;
      if (e.relatedTarget && hov.contains(e.relatedTarget)) return;
      hov.classList.remove('b-peek'); hov = null; clearTimeout(hovT);
    });
  }

  /* ── ④ 인간관계 판 확대·이동 (B0.4) ──
     폰: 두 손가락으로 벌리고 오므려 확대·축소, 두 손가락을 같이 끌면 이동(한 손가락은 원래처럼 판 굴리기).
     컴퓨터: 휠로 확대·축소(마우스가 있는 곳을 중심으로), 휠 버튼을 누른 채 끌면 손바닥처럼 판 이동.
     본체가 판을 다시 그려도(사람 추가·꾸밈·사진 놓기) 보던 배율과 자리를 지킨다. 서랍을 새로 열거나 「크게/전체 보기」를 누르면 본체 배율로. */
  const Z = { k:null, fx:.5, fy:.5 };   // k: 보스가 정한 배율(null 이면 본체 배율), fx·fy: 화면 가운데가 판의 어디인지(비율)
  const curK = map => parseFloat(map.style.zoom) || 1;
  const setZ = k => { Z.k = k; if (typeof S.pplZoom === 'function') S.pplZoom(k); };   // 본체 v1.3.8+ 도 같은 배율로 그리게
  const bodyScale = sc => (sc.getBoundingClientRect().width / sc.offsetWidth) || 1;
  function zRange(map, sc){
    const Sz = mapSize(map), fit = Math.min(1, (sc.clientWidth - 8) / Sz, (sc.clientHeight - 8) / Sz);
    return [Math.max(0.2, fit * 0.6), 3];
  }
  function rememberView(){
    const map = $('ppMap'), sc = $('ppScroll'); if (!map || !sc || Z.k === null) return;
    if (Math.abs(curK(map) - Z.k) > 0.001) return;   // 본체가 다시 그리며 잠깐 제 배율로 돌린 순간은 기억하지 않는다
    const w = mapSize(map) * curK(map);
    Z.fx = (sc.scrollLeft + sc.clientWidth / 2) / w; Z.fy = (sc.scrollTop + sc.clientHeight / 2) / w;
  }
  /* 배율을 k 로 — (cx,cy) 화면 점 아래에 있던 판 자리가 그대로 그 점 아래 남게 */
  function zoomTo(k, cx, cy, ux, uy){
    const map = $('ppMap'), sc = $('ppScroll'); if (!map || !sc) return;
    const Sz = mapSize(map); if (!Sz) return;
    const [lo, hi] = zRange(map, sc); k = Math.max(lo, Math.min(hi, k));
    if (ux === undefined){ const r = map.getBoundingClientRect(); ux = (cx - r.left) / (r.width / Sz); uy = (cy - r.top) / (r.height / Sz); }
    setZ(k); map.style.zoom = k;
    const r2 = map.getBoundingClientRect(), bs = bodyScale(sc);
    sc.scrollLeft += (r2.left + ux * (r2.width / Sz) - cx) / bs;
    sc.scrollTop += (r2.top + uy * (r2.height / Sz) - cy) / bs;
    rememberView();
  }
  function afterRender(){
    if (Z.k === null) return;
    const go = () => { const map = $('ppMap'), sc = $('ppScroll'); if (!map || !sc) return;
      const w = mapSize(map) * Z.k; map.style.zoom = Z.k;
      sc.scrollLeft = Z.fx * w - sc.clientWidth / 2; sc.scrollTop = Z.fy * w - sc.clientHeight / 2; };
    /* 본체는 그린 뒤 다음 화면에서 가운데로 굴린다 — 그 뒤에 덮어쓴다 */
    requestAnimationFrame(() => requestAnimationFrame(go));
  }
  function bindZoom(){
    const sc = $('ppScroll'), map = $('ppMap'); if (!sc || !map || sc.dataset.bZoom) return; sc.dataset.bZoom = '1';
    sc.addEventListener('scroll', rememberView, { passive:true });
    /* 컴퓨터: 휠 확대·축소 (노트북 터치패드 두 손가락 벌리기도 같은 길로 들어온다) */
    sc.addEventListener('wheel', e => {
      if (g && g.on) return;
      e.preventDefault();
      const d = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
      zoomTo(curK(map) * Math.exp(-d * (e.ctrlKey ? 0.01 : 0.0018)), e.clientX, e.clientY);
    }, { passive:false });
    /* 컴퓨터: 휠 버튼 누른 채 끌기 = 손바닥 */
    let hand = null;
    sc.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 1) return;
      e.preventDefault(); cancelHold();
      hand = { x:e.clientX, y:e.clientY, l:sc.scrollLeft, t:sc.scrollTop, bs:bodyScale(sc), pid:e.pointerId };
      try{ sc.setPointerCapture(e.pointerId); }catch(x){}
      document.documentElement.classList.add('b-hand');
    });
    sc.addEventListener('pointermove', e => { if (!hand || e.pointerId !== hand.pid) return; e.preventDefault();
      sc.scrollLeft = hand.l - (e.clientX - hand.x) / hand.bs; sc.scrollTop = hand.t - (e.clientY - hand.y) / hand.bs; });
    const handEnd = e => { if (!hand || (e && e.pointerId !== hand.pid)) return; hand = null; document.documentElement.classList.remove('b-hand'); if (Z.k === null) setZ(curK(map)); rememberView(); };
    sc.addEventListener('pointerup', handEnd); sc.addEventListener('pointercancel', handEnd);
    sc.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); });   // 휠 클릭 자동 스크롤 동그라미 막기
    sc.addEventListener('auxclick', e => { if (e.button === 1) e.preventDefault(); });
    /* 폰: 두 손가락 벌리기·오므리기 + 같이 끌기 */
    let pin = null;
    const two = ts => { const a = ts[0], b = ts[1]; return { d:Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1, x:(a.clientX + b.clientX) / 2, y:(a.clientY + b.clientY) / 2 }; };
    sc.addEventListener('touchstart', e => {
      if (e.touches.length !== 2) return;
      if (g && !g.on) cancelHold();
      if (g && g.on) return;   // 사진을 들고 있는 중이면 확대 안 함
      const t = two(e.touches), r = map.getBoundingClientRect(), Sz = mapSize(map);
      pin = { d0:t.d, k0:curK(map), ux:(t.x - r.left) / (r.width / Sz), uy:(t.y - r.top) / (r.height / Sz) };
    }, { passive:true });
    sc.addEventListener('touchmove', e => {
      if (!pin || e.touches.length !== 2) return;
      e.preventDefault();
      const t = two(e.touches); zoomTo(pin.k0 * t.d / pin.d0, t.x, t.y, pin.ux, pin.uy);
    }, { passive:false });
    const pinEnd = e => { if (pin && e.touches.length < 2){ pin = null; rememberView(); } };
    sc.addEventListener('touchend', pinEnd); sc.addEventListener('touchcancel', pinEnd);
    /* 「크게 보기 / 전체 보기」는 본체 배율로 */
    const cb = $('ppCenter'); if (cb) cb.addEventListener('click', () => setZ(null), true);
    /* 서랍을 닫으면 다음에 열 때 본체 배율(전체 보기)부터 */
    const dw = $('dw-people'); let was = isOpen();
    if (dw) new MutationObserver(() => { const now = isOpen(); if (now !== was) setZ(null); was = now; }).observe(dw, { attributes:true, attributeFilter:['class'] });
    const css4 = document.createElement('style');
    css4.textContent = `#ppScroll{touch-action:pan-x pan-y;overscroll-behavior:contain}html.b-hand,html.b-hand *{cursor:grabbing!important}`;
    document.head.appendChild(css4);
  }

  /* ── ⑤ 세희 자료 카드 (B0.5) ──
     세희가 b_visual 도구를 부르면 사진·그래프 카드를 모아 두었다가, 그 차례의 세희 답 말풍선 안(시간 위)에 붙인다.
     본체에 '말풍선에 붙이기' 창구(SEHEE.addMsgPart)가 생기면 그걸 쓰고, 없으면 대화 화면을 직접 읽어 붙인다. */
  const VIS_KEY = 'b_vis', VIS_MAX = 60;
  let VIS = {}, PEND = [];
  const host = u => { try{ return new URL(u).hostname.replace(/^www\./, ''); }catch(e){ return ''; } };
  const strip = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  async function getJSON(u, ms = 8000){
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), ms);
    try{ const r = await fetch(u, { signal:ac.signal }); if (!r.ok) throw new Error('HTTP ' + r.status); return await r.json(); } finally { clearTimeout(t); }
  }
  /* 위키미디어 공용 — 자유 이용 사진. 영어 낱말이 더 잘 나온다 */
  async function findPhotos(q, n){
    const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=' + (n + 4)
      + '&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap') + '&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=480';
    const d = await getJSON(u); const pages = Object.values((d.query && d.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
    return pages.filter(p => p.imageinfo && p.imageinfo[0] && p.imageinfo[0].thumburl).slice(0, n).map(p => {
      const ii = p.imageinfo[0], md = ii.extmetadata || {};
      return { img:ii.thumburl, big:ii.url, url:ii.descriptionurl, title:strip((md.ObjectName && md.ObjectName.value) || p.title.replace(/^File:|\.\w+$/g, '')).slice(0, 60),
        site:'위키미디어 공용', lic:strip(md.LicenseShortName && md.LicenseShortName.value) };
    });
  }
  /* 위키백과 — 개념·동물·장소·인물의 대표 사진 */
  async function findWiki(q, n){
    const out = [];
    for (const lang of ['ko', 'en']){
      const u = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrlimit=${n + 2}&gsrsearch=${encodeURIComponent(q)}&prop=pageimages|info|extracts&exintro=1&explaintext=1&exchars=120&piprop=thumbnail&pithumbsize=480&inprop=url`;
      const d = await getJSON(u); const pages = Object.values((d.query && d.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
      for (const p of pages) if (p.thumbnail && out.length < n) out.push({ img:p.thumbnail.source, big:p.thumbnail.source, url:p.fullurl, title:p.title, note:strip(p.extract).slice(0, 80), site:lang === 'ko' ? '위키백과' : 'Wikipedia' });
      if (out.length >= n) break;
    }
    return out;
  }
  /* 웹 페이지 대표 사진 — 본체 창구 SEHEE.og(url) → {img,title,site} 가 생기면 */
  async function findWeb(urls, n){
    if (typeof S.og !== 'function') return null;
    const out = [];
    for (const u of urls.slice(0, n + 1)){ try{ const o = await S.og(u); if (o && o.img) out.push({ img:o.img, big:o.img, url:u, title:strip(o.title).slice(0, 60) || host(u), site:o.site || host(u) }); }catch(e){} if (out.length >= n) break; }
    return out;
  }
  async function visualTool(a){
    a = a || {};
    const kind = a.kind, n = Math.max(1, Math.min(4, +a.count || 3));
    const g = { kind, title:strip(a.title).slice(0, 40), similar:!!a.similar, items:[], at:Date.now() };
    try{
      if (kind === 'chart'){
        const c = a.chart || {}, labels = (c.labels || []).map(x => strip(x).slice(0, 14)).slice(0, 12);
        const series = (c.series || []).slice(0, 3).map(s => ({ name:strip(s.name).slice(0, 14), values:(s.values || []).slice(0, labels.length).map(Number) }));
        if (!labels.length || !series.length || series.some(s => s.values.some(v => !isFinite(v)))) return { ok:false, error:'그래프에는 labels 와 숫자 values 가 필요해요' };
        g.chart = { type:c.type === 'line' ? 'line' : 'bar', labels, series, unit:strip(c.unit).slice(0, 8) };
      } else if (kind === 'web'){
        const urls = (a.urls || []).filter(u => /^https?:\/\//.test(u));
        const r = await findWeb(urls, n);
        if (r === null) return { ok:false, error:'웹 페이지 사진은 아직 못 가져와요. photo(영어 낱말) 나 wiki 로 비슷한 것을 보여 주세요.' };
        g.items = r;
      } else if (kind === 'wiki'){ g.items = await findWiki(strip(a.query), n); }
      else { g.kind = 'photo'; g.items = await findPhotos(strip(a.query), n); }
    }catch(e){ S.dlog('오류', '보너스 자료 카드 ' + e.message); return { ok:false, error:'사진을 못 불러왔어요(' + e.message + '). 다른 낱말로 한 번만 더 해 보세요.' }; }
    if (g.kind !== 'chart' && !g.items.length) return { ok:false, error:'찾은 사진이 없어요. 더 넓은 낱말(영어면 더 잘 나옴)로 한 번만 더 해 보세요.' };
    PEND.push(g);
    S.dlog('도구', `보너스 자료 카드 ${g.kind} ${g.items.length || 'chart'}개`);
    return { ok:true, shown:g.kind === 'chart' ? '그래프 1개' : g.items.map(x => x.title), note:'답 말풍선 아래에 카드로 붙습니다. 카드 내용을 말로 다시 늘어놓지 말고 한 줄만 짚으세요.' + (g.similar ? ' 비슷한 것이라고 말하세요.' : '') };
  }
  S.addTool({ name:'b_visual', description:'답에 사진·그래프 카드를 붙여 보스에게 보여 준다. 매번 쓰지 않는다 — 보스가 생김새·물건·상품·장소·동물을 묻거나 찾을 때, 또는 숫자 비교·추이가 답의 핵심일 때만. 정확히 같은 것을 못 찾았으면 가장 비슷한 것을 similar:true 로. 한 답에 1~2번까지.',
    schema:{ type:'object', properties:{
      kind:{ type:'string', enum:['photo', 'wiki', 'web', 'chart'], description:'photo: 비슷한 사진(위키미디어 공용, 영어 낱말이 잘 나옴) · wiki: 개념·동물·장소의 대표 사진 · web: 웹 검색으로 찾은 페이지들의 대표 사진 · chart: 숫자 그래프' },
      query:{ type:'string', description:'photo·wiki 에서 찾을 말. 예: "panda pen", "판다"' },
      urls:{ type:'array', items:{ type:'string' }, description:'web 일 때 웹 검색으로 찾은 페이지 주소 2~3개' },
      count:{ type:'number', description:'카드 수 1~4, 기본 3' },
      similar:{ type:'boolean', description:'정확히 같은 게 아니라 비슷한 것이면 true' },
      title:{ type:'string', description:'카드 묶음 제목(짧게). 예: "비슷한 판다 펜"' },
      chart:{ type:'object', description:'chart 일 때', properties:{ type:{ type:'string', enum:['bar', 'line'] }, labels:{ type:'array', items:{ type:'string' } },
        series:{ type:'array', items:{ type:'object', properties:{ name:{ type:'string' }, values:{ type:'array', items:{ type:'number' } } } } }, unit:{ type:'string' } } } },
      required:['kind'] } }, visualTool);
  S.addPrompt('자료 카드(b_visual): 생김새·물건·상품·장소를 묻거나 찾을 때, 숫자 비교·추이가 답의 핵심일 때만 쓴다. 인사·일정·판 정리 같은 평범한 답에는 쓰지 않는다. 웹 검색으로 상품·물건을 찾았으면 먼저 web(그 페이지 주소)을, 안 되면 photo 를 영어 낱말로. 정확히 같은 걸 못 찾아도 비슷한 것은 보여 주고 similar:true. 카드가 붙으면 말로는 한 줄만.');

  /* 그래프 그리기 — 말풍선 폭에 맞는 SVG */
  const PAL = ['#2b6a9e', '#c0533b', '#5d8a4a'];
  function chartSvg(c){
    const W = 300, H = 170, L = 34, B = 26, T = 14, R = 8, n = c.labels.length, all = c.series.flatMap(s => s.values);
    const max = Math.max(0, ...all), min = Math.min(0, ...all), span = (max - min) || 1, y = v => T + (H - T - B) * (1 - (v - min) / span), cw = (W - L - R) / n;
    const fmt = v => Math.abs(v) >= 10000 ? (v / 10000).toFixed(v % 10000 ? 1 : 0) + '만' : Math.abs(v) >= 1000 ? Math.round(v).toLocaleString() : +v.toFixed(2);
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${S.esc(c.labels.join(', '))}">`;
    for (let i = 0; i <= 3; i++){ const v = min + span * i / 3, yy = y(v); s += `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="#d9d3c4" stroke-width="1"/><text x="${L - 4}" y="${yy + 3}" text-anchor="end" font-size="9" fill="#7a7466">${fmt(v)}</text>`; }
    if (c.type === 'line') c.series.forEach((se, k) => {
      const pts = se.values.map((v, i) => `${(L + cw * (i + .5)).toFixed(1)},${y(v).toFixed(1)}`);
      s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${PAL[k]}" stroke-width="2.2" stroke-linejoin="round"/>` + pts.map(p => `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="3" fill="${PAL[k]}"/>`).join('');
    });
    else { const bw = Math.min(26, cw * .7 / c.series.length); c.series.forEach((se, k) => se.values.forEach((v, i) => {
      const x = L + cw * (i + .5) - bw * c.series.length / 2 + bw * k, y0 = y(Math.max(0, min)), yy = y(v);
      s += `<rect x="${x.toFixed(1)}" y="${Math.min(y0, yy).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${Math.abs(y0 - yy).toFixed(1)}" rx="2" fill="${PAL[k]}"/>`;
      if (c.series.length === 1) s += `<text x="${(x + bw / 2 - 1).toFixed(1)}" y="${(Math.min(y0, yy) - 3).toFixed(1)}" text-anchor="middle" font-size="9" fill="#33405a">${fmt(v)}</text>`;
    })); }
    c.labels.forEach((lb, i) => { s += `<text x="${(L + cw * (i + .5)).toFixed(1)}" y="${H - 9}" text-anchor="middle" font-size="${n > 7 ? 8 : 9.5}" fill="#4a4f5c">${S.esc(lb)}</text>`; });
    return s + '</svg>';
  }
  function visHtml(groups){
    return groups.map((g, gi) => {
      const head = `<div class="b-vh">${g.similar ? '<em>비슷한 것</em>' : ''}${S.esc(g.title || (g.kind === 'chart' ? '그래프' : '자료'))}</div>`;
      if (g.kind === 'chart') return `<div class="b-vg">${head}<div class="b-chart">${chartSvg(g.chart)}${g.chart.series.length > 1 || g.chart.unit ? `<div class="b-leg">${g.chart.series.map((s, k) => `<span><i style="background:${PAL[k]}"></i>${S.esc(s.name)}</span>`).join('')}${g.chart.unit ? `<span>단위 ${S.esc(g.chart.unit)}</span>` : ''}</div>` : ''}</div></div>`;
      return `<div class="b-vg">${head}<div class="b-row">${g.items.map((it, i) => `<button type="button" class="b-card" data-bvis="${gi}:${i}"><img src="${S.esc(it.img)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('.b-card').remove()"><span>${S.esc(it.title)}</span><small>${S.esc(it.site || host(it.url))}</small></button>`).join('')}</div></div>`;
    }).join('');
  }
  async function saveVis(){
    const ks = Object.keys(VIS).sort((a, b) => a - b); while (ks.length > VIS_MAX) delete VIS[ks.shift()];
    try{ await S.kvSet(VIS_KEY, VIS); }catch(e){ S.dlog('오류', '보너스 자료 카드 저장 ' + e.message); }
  }
  /* 모아 둔 카드를 이번 차례 세희 말에 붙인다 */
  function attach(){
    if (!PEND.length) return;
    const log = S.log() || []; let m = null;
    for (let i = log.length - 1; i >= 0; i--){ if (log[i].who === 's'){ m = log[i]; break; } if (log[i].who === 'u') break; }
    if (!m) return;
    VIS[m.at] = (VIS[m.at] || []).concat(PEND); PEND = [];
    saveVis(); decorate();
  }
  /* 대화 화면 — 본체 대화 기록 i 번째 = #log 의 i 번째 자식 */
  function decorate(){
    const el = $('log'); if (!el) return;
    const log = S.log() || [];
    const pinned = el.scrollHeight - el.scrollTop - el.clientHeight < 140;   // 맨 아래를 보고 있었으면 카드를 넣은 뒤에도 맨 아래로
    let added = false;
    log.forEach((m, i) => {
      if (m.who !== 's' || !VIS[m.at]) return;
      const box = el.children[i]; if (!box || !box.classList.contains('msg') || box.querySelector('.b-vis')) return;
      const d = document.createElement('div'); d.className = 'b-vis'; d.dataset.at = m.at; d.innerHTML = visHtml(VIS[m.at]);
      const t = box.querySelector(':scope > time'); box.insertBefore(d, t || null); added = true;
    });
    if (added && pinned) el.scrollTop = el.scrollHeight;
  }
  function openCard(at, key){
    const [gi, i] = key.split(':').map(Number), g = (VIS[at] || [])[gi], it = g && g.items[i]; if (!it) return;
    S.sheet(`<div class="b-big"><h4>${S.esc(it.title)}</h4><img src="${S.esc(it.big || it.img)}" alt="" referrerpolicy="no-referrer">${it.note ? `<p>${S.esc(it.note)}</p>` : ''}<p class="b-src">${S.esc(it.site || '')}${it.lic ? ' · ' + S.esc(it.lic) : ''}${g.similar ? ' · 비슷한 것' : ''}</p><a href="${S.esc(it.url)}" target="_blank" rel="noopener">출처 열기 ↗</a></div>`);
  }
  document.addEventListener('click', e => {
    const c = e.target.closest('.b-vis .b-card'); if (!c) return;
    e.preventDefault(); openCard(c.closest('.b-vis').dataset.at, c.dataset.bvis);
  });
  const css5 = document.createElement('style');
  css5.textContent = `
  .b-vis{white-space:normal;margin:8px 0 2px;display:flex;flex-direction:column;gap:8px}
  .b-vh{font-size:.74rem;color:#6a6252;margin-bottom:4px;display:flex;gap:6px;align-items:center}
  .b-vh em{font-style:normal;background:#f3e3b5;color:#7a5a12;border-radius:6px;padding:0 6px;font-size:.68rem}
  .b-row{display:flex;gap:7px;overflow-x:auto;padding-bottom:3px;scrollbar-width:thin}
  .b-card{flex:0 0 112px;border:1px solid #d6cfbf;background:#fff;border-radius:10px;padding:0 0 5px;text-align:left;cursor:pointer;overflow:hidden;font:inherit;color:#23304a}
  .b-card img{display:block;width:112px;height:96px;object-fit:cover;background:#eee8da}
  .b-card span{display:block;font-size:.72rem;line-height:1.3;padding:4px 6px 0;max-height:2.6em;overflow:hidden}
  .b-card small{display:block;font-size:.62rem;color:#8a8373;padding:1px 6px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .b-chart{background:#fff;border:1px solid #d6cfbf;border-radius:10px;padding:6px 6px 4px}
  .b-chart svg{display:block;width:100%;height:auto}
  .b-leg{display:flex;flex-wrap:wrap;gap:8px;font-size:.66rem;color:#5a5f6c;padding:2px 4px 0}
  .b-leg i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:3px;vertical-align:-1px}
  .b-big h4{margin:0 0 8px}.b-big img{display:block;width:100%;max-height:62vh;object-fit:contain;border-radius:10px;background:#eee8da}
  .b-big p{font-size:.85rem;margin:8px 0 0}.b-big .b-src{color:#7a7466;font-size:.75rem}.b-big a{display:inline-block;margin-top:10px}`;
  document.head.appendChild(css5);

  /* ── 붙이기 ── */
  async function boot(){
    try{ POS = (await S.kvGet(POS_KEY)) || {}; }catch(e){ POS = {}; }
    try{ VIS = (await S.kvGet(VIS_KEY)) || {}; }catch(e){ VIS = {}; }
    const lg = $('log'); if (lg){ new MutationObserver(() => decorate()).observe(lg, { childList:true }); decorate(); }
    bindPanTabs();
    const map = $('ppMap'); if (!map){ S.dlog('화면', '보너스: 인간관계 판을 못 찾음 — 사진 옮기기·대화창 쉼'); return; }
    bindMap(map); bindZoom(); addTalkBox(); pushPos();
    if (!API) new MutationObserver(afterRender).observe(map, { childList:true });
    const dw = $('dw-people');
    if (dw) new MutationObserver(() => { if (isOpen()) talk(true); }).observe(dw, { attributes:true, attributeFilter:['class'] });
    talk(true);
  }
  S.on('people', afterRender);
  S.on('talk', () => talk(false));
  S.on('say', () => setTimeout(() => talk(false), 30));
  S.on('turnEnd', () => { talk(false); attach(); });
  S.on('say', () => setTimeout(attach, 0));
  S.on('view', async v => { if (v !== 'office') return; try{ const p = (await S.kvGet(VIS_KEY)) || {}; if (JSON.stringify(p) !== JSON.stringify(VIS)){ VIS = p; decorate(); } }catch(e){} });
  S.on('tool', () => talk(false));
  setInterval(() => talk(false), 1000);   // 기다리는 초 세기(사람 서랍에선 본체가 안 불러 줌)
  /* 다른 기기에서 옮긴 자리가 동기화로 들어오면 — 판을 열 때마다 저장된 자리를 다시 읽어 본체에 넘긴다 */
  S.on('view', async () => { try{ const p = (await S.kvGet(POS_KEY)) || {}; if (JSON.stringify(p) !== JSON.stringify(POS)){ POS = p; pushPos(); } }catch(e){} });
  if (API) new MutationObserver(async () => { if (!isOpen()) return; try{ const p = (await S.kvGet(POS_KEY)) || {}; if (JSON.stringify(p) !== JSON.stringify(POS)){ POS = p; pushPos(); } }catch(e){} })
    .observe($('dw-people') || document.body, { attributes:true, attributeFilter:['class'] });
  S.addMenu('인간관계 판 사진 자리 되돌리기', resetPos);
  S.addPrompt('인간관계 판의 사진 카드는 보스가 꾹 눌러(컴퓨터는 마우스를 0.5초 누르고) 직접 끌어 옮길 수 있다. 옮긴 자리는 계정에 저장돼 다른 기기에서도 같다.');
  boot();
})();
