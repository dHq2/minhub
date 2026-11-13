/* ── 보너스(실험 스위치) 자리 (v1.3.2 → v1.5.0) ──
   v1.5.0 부터 세 방은 동등 — 누구든 찜하고 본체(js/*.js)를 직접 고친다. 보너스 파일(bonus/ · bonus-c/)은
   '켜고 끌 수 있는 실험 기능'을 둘 때만 쓴다. 본체는 부팅 끝에 보너스를 불러오고, 보너스는 아래 SEHEE 창구로 본체와 이어진다.
   보너스가 고장 나도 본체는 그대로 — 설정에서 끄면 바로 빠진다. 실험이 자리 잡으면 본체로 옮긴다. */
const BONUS = { tools:[], handlers:{}, prompts:[], menu:[], subs:{}, loaded:false, ver:'', vers:{}, pos:{}, ogCache:{}, ogOff:false };
/* v1.4.0 보너스 갈래 여럿 — B(제작기 2, sehee/bonus/), C(제작기 3, sehee/bonus-c/). 갈래마다 따로 켜고 끈다 */
const LANES = [{ k:'B', path:'bonus/bonus.js', name:'보너스 B' }, { k:'C', path:'bonus-c/c.js', name:'보너스 C' }];
const laneKey = k => k === 'B' ? 'sehee.bonus' : 'sehee.bonus.' + k;
const bonusOn = (k = 'B') => { try{ return localStorage.getItem(laneKey(k)) !== '0'; }catch(e){ return true; } };
function bonusEmit(ev, data){ for (const f of BONUS.subs[ev] || []) try{ f(data); }catch(e){ dlog('오류', `보너스(${ev}) ${e.message}`, e.stack); } }
window.SEHEE = {
  version:() => APP_VERSION,
  /* 읽기·쓰기 창구 — 바꾸면 안 되는 이름들. 속 구조가 바뀌어도 이 이름은 메인 방이 지켜 준다 */
  kvGet:k => kvGet(k), kvSet:(k, v) => kvSet(k, v),
  todayPan:() => todayPanRef(), savePan:p => putPan(p), render:() => render(),
  log:() => O.log, chatSave:() => saveLog(), say:(text, face) => { seheeSays({ t:String(text), f:face ?? 0 }); renderLog(); saveLog(); },
  board:() => BOARD, people:() => PPL, cal:() => CAL,
  goView:v => goView(v), openDrawer:k => dwOpen(k), closeDrawer:() => dwClose(),
  sheet:html => openSheet(html), closeSheet:() => closeSheet(), toast:m => toast(m), esc:s => esc(s), dlog:(c, m, d) => dlog(c, m, d),
  aiReady:() => aiReady(),
  /* 세희 머리에 보너스 도구·지침 더하기 */
  addTool(def, handler){ if (!def || !def.name || typeof handler !== 'function') return; BONUS.tools = BONUS.tools.filter(t => t.name !== def.name); BONUS.tools.push(def); BONUS.handlers[def.name] = handler; },
  addPrompt(fn){ if (typeof fn === 'function' || typeof fn === 'string') BONUS.prompts.push(fn); },
  /* 설정 → 보너스 칸에 단추 */
  addMenu(label, run){ BONUS.menu.push({ label:String(label), run }); },
  /* 대화창 내용(본체 talkHtml 그대로 — 실시간 글자·고르기·다시 시도 단추 포함). 단추는 본체가 문서 전체에서 받아 처리한다 */
  talk:(empty) => { const t = talkHtml(empty || ''); return { html:t.h, face:t.face, sprite:FACE(t.face) }; },
  /* 인간관계 판 자리 덮어쓰기 — {x,y}는 판 크기에 대한 비율(0~1). null 이면 원래 자리. 본체가 그 자리로 그리고 실도 거기로 */
  pplPos(id, xy){ if (xy && isFinite(xy.x) && isFinite(xy.y)) BONUS.pos[id] = { x:+xy.x, y:+xy.y }; else delete BONUS.pos[id]; },
  pplPosAll(map){ BONUS.pos = {}; for (const [id, xy] of Object.entries(map || {})) if (xy && isFinite(xy.x) && isFinite(xy.y)) BONUS.pos[id] = { x:+xy.x, y:+xy.y }; },
  pplRedraw:() => { if (DW.open === 'people') pplRender(); },
  /* 웹 페이지 대표 사진 — 계정 서버 /og 로(로그인 필요). {img,title,site} 또는 null. 같은 주소는 기억해 둔다 */
  async og(u){
    if (!SYNC.url || !SYNC.token || BONUS.ogOff || !/^https?:\/\//.test(String(u))) return null;
    if (BONUS.ogCache[u] !== undefined) return BONUS.ogCache[u];
    const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 9000);
    try{
      const r = await fetch(SYNC.url + '/og?u=' + encodeURIComponent(u), { headers:authH(), signal:ctl.signal });
      if (r.status === 404){ BONUS.ogOff = true; dlog('경고', '계정 서버에 /og 가 없어요(서버가 예전 버전)'); return null; }
      const j = await r.json(); const out = j && j.ok && j.img ? { img:j.img, title:j.title || '', site:j.site || '' } : null;
      BONUS.ogCache[u] = out; return out;
    }catch(e){ return null; } finally { clearTimeout(tm); }
  },
  /* 인간관계 판 배율 지키기 — 숫자면 다시 그려도 그 배율, null 이면 본체 '전체 보기' 배율 */
  pplZoom(k){ BONUS.zoom = k && isFinite(k) ? Math.max(0.2, Math.min(3, +k)) : null; },
  /* 일 생길 때 알려 받기: boot · view(v) · say(세희 말) · tool({name,args,result}) · turnEnd · talk({h,face}) · people(인간관계 판을 다시 그린 직후) · regen({oldAts,newAt,userAt}) */
  on(ev, fn){ (BONUS.subs[ev] = BONUS.subs[ev] || []).push(fn); },
  setVersion(v){ v = String(v); const k = v[0].toUpperCase(); BONUS.vers[LANES.some(l => l.k === k) ? k : 'B'] = v; BONUS.ver = Object.values(BONUS.vers).join(' · '); },
};
async function bonusPrompt(){
  if (!BONUS.prompts.length) return '';
  const out = []; for (const p of BONUS.prompts){ try{ out.push(typeof p === 'function' ? await p() : p); }catch(e){ dlog('오류', '보너스 지침 ' + e.message); } }
  return '\n\n보너스 기능:\n' + out.filter(Boolean).join('\n');
}
function loadBonus(){
  if (BONUS.loaded) return; BONUS.loaded = true;
  /* 켜 둔 갈래를 순서대로(B → C) 불러오고, 다 끝나면 boot 를 한 번만 알린다 */
  const one = l => new Promise(res => {
    if (!bonusOn(l.k)) return res();
    const s = document.createElement('script'); s.src = l.path + '?t=' + Date.now();   /* v1.4.2 늘 새 파일 — 1분 안에 다시 켜도 옛 보너스가 안 남게 */
    s.onload = () => { dlog('화면', `${l.name} 불러옴 ${BONUS.vers[l.k] || ''}`); res(); };
    s.onerror = () => { dlog('화면', `${l.name} 없음(${l.path})`); res(); };
    document.body.appendChild(s);
  });
  (async () => { for (const l of LANES) await one(l); bonusEmit('boot'); try{ updAfterBoot(); }catch(e){} })();
}

/* 개발자 로그 화면 */
(function devInit(){
  const CATS = ['all', 'AI', '도구', '대화', '동기화', '화면', '업데이트', '오류'];
  const on = () => { try{ return localStorage.getItem('sehee.dev') === '1'; }catch(e){ return false; } };
  window.devApply = () => { $('tabDev').hidden = !on(); if (!on()) $('dev').classList.remove('on'); };
  const hh = t => { const d = new Date(t); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, '0')}`; };
  const pass = l => DBG.filter === 'all' || l.c === DBG.filter || (DBG.filter === '오류' && l.c === '경고');
  const row = l => `<div class="dl c-${l.c}" data-n="${l.n}"><time>${hh(l.t)}</time><b>${esc(l.c)}</b>${esc(l.m)}${l.d ? ' <span style="color:#56606c">⋯</span>' : ''}</div>`;
  const list = $('devList');
  const draw = () => { $('devF').innerHTML = CATS.map(c => `<button data-cat="${c}" class="${DBG.filter === c ? 'on' : ''}">${c === 'all' ? '전체' : c}</button>`).join('');
    list.innerHTML = DBG.lines.filter(pass).map(row).join(''); $('devN').textContent = DBG.lines.length + '줄'; list.scrollTop = list.scrollHeight; };
  DBG.subs.add(l => {
    if (!$('dev').classList.contains('on')) return; $('devN').textContent = DBG.lines.length + '줄';
    if (DBG.paused || !pass(l)) return;
    const atEnd = list.scrollTop + list.clientHeight >= list.scrollHeight - 30;
    list.insertAdjacentHTML('beforeend', row(l)); while (list.children.length > DBG.max) list.firstElementChild.remove();
    if (atEnd) list.scrollTop = list.scrollHeight;
  });
  $('tabDev').onclick = () => { const d = $('dev'), y = getComputedStyle(document.body).transform !== 'none' ? (document.body.scrollTop || scrollY) : 0;
    d.style.top = y + 'px'; d.style.bottom = -y + 'px'; d.classList.add('on'); draw(); };
  $('devF').onclick = e => { const b = e.target.closest('[data-cat]'); if (!b) return; DBG.filter = b.dataset.cat; draw(); };
  list.onclick = e => { const r = e.target.closest('.dl'); if (!r) return; const pre = r.querySelector('pre'); if (pre) return pre.remove();
    const l = DBG.lines.find(x => x.n === Number(r.dataset.n)); if (!l || !l.d) return;
    let d = l.d; try{ d = JSON.stringify(JSON.parse(d), null, 1); }catch(x){} r.insertAdjacentHTML('beforeend', `<pre>${esc(d)}</pre>`); };
  $('dev').querySelector('.dev-bar').onclick = async e => {
    const b = e.target.closest('[data-dv]'); if (!b) return; const a = b.dataset.dv;
    if (a === 'close') $('dev').classList.remove('on');
    else if (a === 'pause'){ DBG.paused = !DBG.paused; b.classList.toggle('on', DBG.paused); b.textContent = DBG.paused ? '이어서' : '멈춤'; if (!DBG.paused) draw(); }
    else if (a === 'clear'){ DBG.lines = []; DBG.dirty = true; draw(); }
    else if (a === 'copy'){ const t = `세희 ${APP_VERSION} · ${navigator.userAgent}\n` + DBG.lines.filter(pass).map(l => `${hh(l.t)} [${l.c}] ${l.m}${l.d ? '\n    ' + l.d : ''}`).join('\n');
      try{ await navigator.clipboard.writeText(t); toast('로그를 복사했어요'); }catch(x){ toast('복사가 막혔어요'); } }
  };
  devApply();
  dlog('화면', `세희 ${APP_VERSION} 시작 · ${innerWidth}×${innerHeight} · ${navigator.onLine ? '온라인' : '오프라인'}`);
})();
