/* ── 로딩 화면 (v0.7) — 점 세 개가 깜빡이고, 아래에 지금 하는 일 ── */
const SP = { t0:performance.now(), hold:0 };
function spStep(t){ const el = $('spStatus'); if (el) el.textContent = t; }
async function spDone(){
  const el = $('splash'); if (!el) return;
  const wait = 900 + SP.hold - (performance.now() - SP.t0); if (wait > 0) await tickMs(wait);
  el.classList.add('out'); setTimeout(() => el.remove(), 450);
}
function preloadArt(onEach){
  const list = [...new Set(['art/bg-office.webp', 'art/desk.webp', 'art/papers.webp', 'art/monitor.webp', ...Object.values(SPRITES).map(n => `art/${n}.webp`)])];
  let n = 0;
  return Promise.all(list.map(src => new Promise(res => { const i = new Image(); i.onload = i.onerror = () => { onEach(++n, list.length); res(); }; i.src = src; })));
}
async function pingBrain(){
  if (!aiReady()) return '머리 없음 · 깡통으로 열어요';
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 2500);
  try{
    const r = AI.cfg.provider === 'anthropic'
      ? await fetch('https://api.anthropic.com/v1/models?limit=1', { headers:anthHeaders(aiKey()), signal:ctl.signal })
      : await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1', { headers:{ 'x-goog-api-key':aiKey() }, signal:ctl.signal });
    if (r.ok) return `머리 연결됨 · ${shortModel(aiModel())}`;
    SP.hold = 900;
    return r.status === 401 ? '머리: 키를 안 받아줘요 — 설정에서 확인' : `머리: 응답 ${r.status} — 열고 나서 다시 볼게요`;
  }catch(e){ SP.hold = 600; return '머리: 확인 못 함 (인터넷?)'; }
  finally{ clearTimeout(t); }
}
/* 안드로이드 공유하기(사진·txt) — 일꾼(sw.js)이 받아 둔 걸 꺼낸다 */
async function takeShared(){
  if (!('caches' in window)) return false;
  const c = await caches.open('share-inbox'), base = new URL('./__share/', location.href).href;
  const mr = await c.match(base + 'meta'); if (!mr) return false;
  let meta = {}; try{ meta = await mr.json(); }catch(e){}
  const files = [];
  for (const f of (meta.files || [])){ const r = await c.match(f.key); if (r){ const b = await r.blob(); files.push(new File([b], f.name || 'shared', { type:f.type || b.type })); } }
  for (const k of await c.keys()) await c.delete(k);
  const title = (meta.title || '').trim(), text = (meta.text || '').trim(), url = (meta.url || '').trim();
  let got = text;
  if (title && !text.includes(title)) got = title + (got ? '\n' + got : '');
  if (url && !got.includes(url)) got = got ? got + '\n' + url : url;
  if (files.length){
    await addFiles(files);
    if (got) $('sayText').value = got;
    if (location.hash !== '#office') history.replaceState(null, '', location.pathname + '#office');
    toast(`${files.length}개 받았어요 — 사무실에서 보내면 읽어요`);
    return 'office';
  }
  if (got){ await receive([got]); return 'pan'; }
  return false;
}

/* ── 세희의 사무실 (v0.2) — 아직 아무것도 연결하지 않았다. 자동응답만 랜덤으로 ──
   얼굴: f1 의심 · f2 곁눈(생각 중) · f3 미소 · f4 >_< · f5 놀람 · f6 삐침  (그림은 나중에 교체) */
/* 표정 태그 → 세희 그림: 0 기본(기대어 섬) · 1 의심(허리에 손) · 2 생각(턱 괴기) · 3 미소 · 4 당황(말하는 손짓) · 5 놀람 · 6 삐침(정면 무표정)
   talk = 글자가 들어오는 동안 */
const SPRITES = { 0:'s-lean', 1:'s-hip', 2:'s-think', 3:'s-smug', 4:'s-talk', 5:'s-surprised', 6:'s-front', talk:'s-talk' };
const FACE = n => `art/${SPRITES[n] || SPRITES[0]}.webp`;
Object.values(SPRITES).forEach(n => { const i = new Image(); i.src = `art/${n}.webp`; });
const GREET = [
  { t:'안녕하세요. 비서 강세희입니다.', f:0 },
  { t:'지금은 깡통이라 대답만 해요. 머리는 나중에 들어온대요.', f:6 },
];
const REPLIES = [
  { t:'네. 적어둘게요. 아직 손이 없어서 마음속에만요.', f:1 },
  { t:'퇴근 전까지면 되는 거죠?', f:2 },
  { t:'…네.', f:1 },
  { t:'그건 보스가 정하실 일이에요.', f:2 },
  { t:'판에 올릴까요? 아, 아직 연결이 안 됐죠.', f:5 },
  { t:'기억해 둘게요. 기억하는 척이요.', f:6 },
  { t:'오늘도 카톡이 많네요.', f:1 },
  { t:'커피 식었어요.', f:6 },
  { t:'확정이에요, 미정이에요?', f:2 },
  { t:'좋아요. 그렇게 하죠.', f:3 },
  { t:'잠깐만요. 그거 어제도 하신 말씀이에요.', f:5 },
  { t:'제가 지금 할 수 있는 건 고개 끄덕이기뿐이에요.', f:3 },
  { t:'일이 너무 많아요……', f:4 },
];
const RULES = [
  { re:/고마|감사|땡큐|ㄱㅅ/, list:[ { t:'별말씀을요. 월급에 포함돼 있어요.', f:3 } ] },
  { re:/안녕|하이|ㅎㅇ|좋은 아침/, list:[ { t:'안녕하세요. 오늘도 출근하셨네요.', f:3 }, { t:'오셨어요. 판은 펴 놨어요.', f:1 } ] },
  { re:/바보|멍청|짜증|싫어|씨발|ㅅㅂ/, list:[ { t:'……들은 걸로 할게요.', f:6 }, { t:'저도 사람이…… 아니, 비서예요.', f:4 } ] },
  { re:/급|빨리|당장|지금 바로/, list:[ { t:'퇴근 전 태그 달아둘게요. 아, 아직 못 달아요.', f:5 }, { t:'급한 건 판 맨 위에요. 제가 손이 생기면요.', f:4 } ] },
  { re:/[?？]|뭐야|어때|알아/, list:[ { t:'그건 연결되면 제대로 대답할게요.', f:2 }, { t:'음…… 확정이에요, 미정이에요?', f:2 }, { t:'제가 아는 건 아직 판에 적힌 것뿐이에요.', f:1 } ] },
];
const O = { loaded:false, log:[], busy:false, lastPick:null, thumbs:{} };
function pickFrom(list){
  let r, n = 0;
  do { r = list[Math.floor(Math.random() * list.length)]; } while (list.length > 1 && r === O.lastPick && ++n < 8);
  O.lastPick = r; return r;
}
const replyFor = text => { for (const r of RULES) if (r.re.test(text)) return pickFrom(r.list); return pickFrom(REPLIES); };
function setFace(n){ const im = $('seheeSpr'); if (!im) return; const src = FACE(n); if (im.getAttribute('src') !== src) im.setAttribute('src', src); }
const hhmm = t => { const d = new Date(t); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
function renderLog(){
  const el = $('log');
  let lastS = -1; O.log.forEach((m, i) => { if (m.who === 's') lastS = i; });
  el.innerHTML = O.log.map((m, i) => m.who === 'a'
      ? (m.board ? `<div class="act read">🗂 ${esc(m.text)}</div>` : m.read ? `<div class="act read">🔎 ${esc(m.text)}</div>`
        : `<div class="act${m.undone ? ' undone' : ''}">📌 ${esc(m.text)}${m.undone ? ' · 되돌림' : ` <button data-undo="${i}">되돌리기</button>`}</div>`)
      : `<div class="msg ${m.who}${m.err ? ' err' : ''}${i === lastS && !O.busy ? ' last' : ''}">${msgInner(m, i)}<div class="mfoot">${msgTools(m, i, lastS)}<time>${hhmm(m.at)}</time></div></div>`).join('')
    + (O.busy ? (O.live && O.live.text ? `<div class="msg s last live">${esc(parseFace(O.live.text).t)}</div>`
      : `<div class="msg s last wait" aria-label="세희가 쓰는 중"><i><span></span><span></span><span></span></i><small id="waitTxt">${waitText()}</small>${O.abort ? '<button class="stop" data-stop>그만</button>' : ''}</div>`) : '');
  el.scrollTop = el.scrollHeight;
  renderBoardTalk();
}
function msgInner(m, i){
  let h = '';
  const th = O.thumbs[m.at];
  if (th && th.length) h += `<span class="pics">${th.map(u => `<img src="${u}" alt="">`).join('')}</span>`;
  if (m.pics) h += m.scanOf ? `<span class="tag">📄 ${esc(m.scanOf)} · 스캔 ${m.pics}쪽</span>` : `<span class="tag">📷 캡처 ${m.pics}장</span>`;
  if (m.docs) h += `<span class="tag">📄 ${esc(m.docs.join(', '))}</span>`;
  h += esc(m.text || '');
  h += askButtons(m, i);
  if (m.ocr !== undefined) h += `<details class="ocr"><summary>해독본 ${m.ocrMeta ? m.ocrMeta.lines + '줄' : ''}${m.ocrMeta && m.ocrMeta.failed ? ` · ⚠ ${m.ocrMeta.failed}곳 못 읽음` : ''} 보기</summary><pre>${esc(m.ocr || '(글자를 못 찾았어요)')}</pre><button data-copyocr="${i}">복사</button></details>`;
  if (m.src && m.src.length) h += `<span class="src">출처 ${m.src.map(x => `<a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(x.t || hostOf(x.u))}</a>`).join(' · ')}</span>`;
  return h;
}
function waitText(){
  if (!O.live) return '';
  if (O.live.work) return O.live.work;
  if (O.live.ocr){
    const o = O.live.ocr, sec = Math.floor((Date.now() - O.live.t0) / 1000);
    return o.step === '읽는 중' ? `캡처 읽는 중 · 조각 ${o.done || 0}/${o.total || 0}${o.chars ? ` · ${o.chars.toLocaleString('ko-KR')}자` : ''} · ${sec}초` : `${o.step || '준비 중'}${o.total ? ` · 조각 ${o.total}개` : ''}`;
  }
  if (O.live.search) return `🔎 검색 중: ${O.live.search}`;
  if (O.live.waitUntil > Date.now()) return `분당 한도에 걸렸어요 — ${Math.ceil((O.live.waitUntil - Date.now()) / 1000)}초 뒤 다시 해볼게요`;
  const sec = Math.floor((Date.now() - O.live.t0) / 1000);
  const busy = O.live.big ? (O.live.deep ? `${shortModel(O.live.big)}로 깊게 생각 중` : `긴 글이라 ${shortModel(O.live.big)}로 정리 중`) : '세희가 생각 중';
  const re = O.live.retry ? ` · 서버가 삐끗해서 다시 하는 중(${O.live.retry}번째)` : '';
  return (sec < 2 && !re ? '보내는 중' : busy) + ` · ${sec}초` + re + (sec >= 15 && !re ? ' · 오래 걸리네요' : '');
}
function updateLive(){
  const el = $('log').querySelector('.msg.live');
  if (!el){ renderLog(); return; }
  el.textContent = parseFace(O.live.text).t;
  if (logPinned) $('log').scrollTop = $('log').scrollHeight;
  renderBoardTalk();
}
async function saveLog(){ if (O.log.length > 300) O.log = O.log.slice(-300); try{ await kvSet('chat', O.log); }catch(e){} }
function seheeSays(r, src){
  bonusEmit('say', { text:r.t, face:r.f });
  dlog('대화', `세희 ← [${r.f}] ${String(r.t).slice(0, 80)}`);
  O.log.push({ who:'s', text:r.t, face:r.f, at:Date.now(), ...(src && src.length ? { src } : {}) }); setFace(r.f);
  /* 적었다고 말했는데 이번 차례에 실제로 적힌 게 없으면 — 보스가 믿고 넘어가지 않게 알려 준다 */
  if (O.turnActs !== undefined){
    const acted = O.log.filter(m => m.who === 'a' && !m.read).length > O.turnActs;
    if (!acted && /(적어|넣어|올려|붙여)\s?(뒀|두었|놨|놓았|드렸)|적었|넣었|붙였|추가했/.test(r.t)) O.log.push({ who:'s', text:'⚠ 방금 말과 달리 이번엔 판·보드에 실제로 적힌 게 없어요. "적어줘"라고 한 번 더 말해 주세요.', face:5, at:Date.now(), hint:true });
    O.turnActs = undefined;
  }
  /* 이번 대화에서 화이트보드 카드를 만들거나 고쳤으면 — 보드를 띄우고 그 카드를 반짝 */
  if (BOARD.changed){
    const id = BOARD.changed; BOARD.changed = null; CAL.changed = null;
    const isRep = ((BOARD.cards || []).find(x => x.id === id) || {}).kind === 'report';
    if (curView() === 'office') setTimeout(async () => { if (DW.open !== 'board') await dwOpen('board'); else boardRender(); setTimeout(() => { flashCard(id); if (isRep && RV.id !== id) rvOpen(id); }, 380); }, 60);
    else if (isRep && RV.id !== id) rvOpen(id);
    else if (!isRep){ goView('office'); setTimeout(async () => { await dwOpen('board'); setTimeout(() => flashCard(id), 380); }, 260); }   /* 판도 서랍 — 보드 서랍으로 갈아 연다(v1.3.7) */
  } else if (PPL.changed){
    const id = PPL.changed; PPL.changed = null; CAL.changed = null;
    if (curView() !== 'office') goView('office');
    setTimeout(async () => { if (DW.open !== 'people') await dwOpen('people'); else pplRender(); setTimeout(() => pplFlash(id), 380); }, curView() === 'office' ? 60 : 260);
  } else if (CAL.changed){
    const d = CAL.changed; CAL.changed = null;
    if (curView() === 'office') setTimeout(async () => { await dwOpen('cal'); const x = parseYmd(d); CAL.year = x.getFullYear(); calYear(); calMonth(x.getMonth(), true);
      setTimeout(() => { const c = document.querySelector(`#calSheet [data-d="${d}"]`); if (c){ c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash'); } }, 380); }, 60);
  }
}
async function openOffice(){
  if (!O.loaded){ O.log = (await kvGet('chat')) || []; O.loaded = true; }
  if (!O.log.length){ GREET.forEach(seheeSays); saveLog(); }
  const lastS = [...O.log].reverse().find(m => m.who === 's'); setFace(lastS ? lastS.face : 0);
  renderLog();
}
function growSay(){ const ta = $('sayText'); ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  const has = !!ta.value.trim() || ATT.length > 0, reading = ATT.some(a => a.reading); $('saybub').classList.toggle('has', has); $('sayGo').disabled = !has || O.busy || reading; }
/* 보통 대답 한 번(v1.2.2 — 다시 시도 버튼도 이걸 쓴다) */
async function replyNow(){
    /* v1.5.8 (C) 보스가 "소넷으로"·"큰 머리로"·"깊게 생각해" 하면 그 차례만 큰 머리 */
    const lastU = [...O.log].reverse().find(m => m.who === 'u'), wantBig = !!(lastU && bigModel() && /소넷|sonnet|큰\s?머리|깊게\s?생각/i.test((lastU.text || '') + ' ' + (lastU.regenHow || '')));
    if (wantBig) dlog('AI', '보스가 큰 머리를 부름 — 이번 차례만 ' + bigModel());
    O.abort = new AbortController(); O.live = { text:'', t0:Date.now(), faced:false, big:wantBig ? bigModel() : null, deep:wantBig, waitUntil:0 };
    renderLog();
    const tick = setInterval(() => { const w = $('waitTxt'); if (w) w.textContent = waitText(); }, 1000);
    try{
      const r = await aiTurn(toMessages(O.log), t => {
        O.live.text = t; O.live.search = '';
        if (!O.live.faced && t.trim()){ O.live.faced = true; setFace('talk'); }
        updateLive();
      }, O.abort.signal, { big:wantBig, onRetry:n => { if (O.live){ O.live.retry = n; const w = $('waitTxt'); if (w) w.textContent = waitText(); } },
        onWait:ms => { if (!O.live) return; O.live.waitUntil = ms ? Date.now() + ms : 0; const w = $('waitTxt'); if (w) w.textContent = waitText(); },
        onSearch:q => { if (!O.live) return; O.live.search = q || '…'; if (!O.live.text) renderLog(); } });
      const pf = parseFace(r.text);
      if (/max_tokens|MAX_TOKENS/.test(r.finish)) pf.t += ' …(말이 길어서 잘렸어요)';
      seheeSays(pf, r.sources);
    }catch(err){
      if (err.partial && err.partial.trim()){ const pf = parseFace(err.partial); pf.t += ' …'; seheeSays(pf); }
      if (err.code === -2) seheeSays({ t:'네, 그만둘게요.', f:6 });
      else { O.log.push({ who:'s', text:'연결이 안 됐어요. ' + err.message + (err.code === 400 && err.raw ? ` — 서버 말: ${err.raw.slice(0, 160)}` : ''), face:5, at:Date.now(), err:true }); setFace(5); }
    }finally{ clearInterval(tick); O.live = null; O.abort = null; }
}
/* 다시 시도 — 막힌 말풍선을 걷어내고, 그 앞의 보스 말에 다시 대답한다. 사진은 이미 읽어 둔 글로, 긴 글은 큰 머리로 */
async function retryLast(i){
  if (O.busy || !aiReady()) return;
  const m = O.log[i]; if (!m || !m.err) return;
  let ui = -1; for (let j = i - 1; j >= 0; j--) if (O.log[j].who === 'u'){ ui = j; break; }
  if (ui < 0) return;
  const um = O.log[ui];
  O.log.splice(i, 1);
  if (um.pics && !um.ocr){ O.log.push({ who:'s', text:'그 캡처는 읽기 전에 막혀서, 사진을 한 번 더 붙여 주셔야 해요.', face:5, at:Date.now(), err:false }); renderLog(); saveLog(); return; }
  O.turnActs = O.log.filter(x => x.who === 'a' && !x.read).length;
  O.busy = true; growSay(); setFace(2); renderLog(); await saveLog();
  const heavy = !!(um.pics || um.docs) || (um.text || '').length >= 300 || (um.text || '').split('\n').length >= 6;
  if (heavy){ const job = { at:Date.now(), msgAt:um.at, stage:'organize' }; await kvSet('job', job); await runJob(job, um); return; }
  await replyNow();
  O.busy = false; renderLog(); growSay(); bdGrow(); saveLog();
}
/* 다시 답하기 (v1.4.3) — 마지막 대답이 마음에 안 들면. 보스 요구: 새 답은 앞 답을 참조하지 않는다.
   그 대답이 판에 한 일은 되돌리고, 앞 답은 대화 기록에서 완전히 빼서(세희가 못 보게) 처음처럼 다시 답하게 한다. */
async function regenLast(how){
  if (O.busy || !aiReady()) return;
  let ui = -1; for (let j = O.log.length - 1; j >= 0; j--) if (O.log[j].who === 'u'){ ui = j; break; }
  if (ui < 0) return;
  const um = O.log[ui], after = O.log.slice(ui + 1);
  if (!after.some(x => x.who === 's')) return;
  for (let j = O.log.length - 1; j > ui; j--){ const x = O.log[j]; if (x.who === 'a' && x.act && !x.undone) await undoAction(j).catch(() => {}); }
  const oldAts = after.map(x => x.at);
  um.regen = (um.regen || 0) + 1; um.regenHow = how || '';
  O.log.splice(ui + 1); dlog('대화', '다시 답하기 ' + um.regen + '번째' + (how ? ' · ' + how : ''));
  if (um.pics && !um.ocr){ O.log.push({ who:'s', text:'그 캡처는 읽은 게 남아 있지 않아서, 사진을 한 번 더 붙여 주셔야 해요.', face:5, at:Date.now() }); renderLog(); saveLog(); return; }
  O.turnActs = O.log.filter(x => x.who === 'a' && !x.read).length;
  O.busy = true; growSay(); setFace(2); renderLog(); await saveLog();
  const heavy = !!(um.pics || um.docs) || (um.text || '').length >= 300 || (um.text || '').split('\n').length >= 6;
  if (heavy){ const job = { at:Date.now(), msgAt:um.at, stage:'organize' }; await kvSet('job', job); await runJob(job, um); }
  else { await replyNow(); O.busy = false; renderLog(); growSay(); bdGrow(); saveLog(); }
  const newAt = (O.log.filter(x => x.who === 's').pop() || {}).at;
  bonusEmit('regen', { oldAts, newAt, userAt:um.at });
}
const REGEN_HOW = ['더 짧게', '더 자세히', '더 쉽게', '다시 찾아보고'];
/* ── 말풍선 아래 아이콘 (v1.5.5) — ↻ 다시(마지막 세희 답: 다시 답하기 / 막힌 답: 다시 시도) · 🗑 지우기(모든 말) ── */
const MT_ICON = {
  re:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>',
  bin:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M6.5 7l1 12.2a1.8 1.8 0 0 0 1.8 1.6h5.4a1.8 1.8 0 0 0 1.8-1.6L17.5 7"/><path d="M10 11v6M14 11v6"/></svg>' };
const canRegen = i => { const m = O.log[i]; return m && m.who === 's' && !m.err && !m.ask && !O.log.slice(i + 1).some(x => x.who === 'u' || x.who === 's') && O.log.slice(0, i).some(x => x.who === 'u'); };
function msgTools(m, i, lastS){
  if (O.busy || m.ask || m.hint) return '<span class="mtools"></span>';
  let h = '';
  if (i === lastS && aiReady()){
    if (m.err) h += `<button class="mt re" data-retry="${i}" aria-label="다시 시도">${MT_ICON.re}</button>`;
    else if (canRegen(i)) h += `<button class="mt re${O.regenOpen === m.at ? ' on' : ''}" data-regenmenu="${m.at}" aria-label="다시 답하기">${MT_ICON.re}</button>`;
  }
  const key = i + ':' + m.at, armed = O.delArm === key;   /* 같은 때(at)에 생긴 말이 둘일 수 있어서 자리+때로 가린다 */
  h += `<button class="mt bin${armed ? ' armed' : ''}" data-delmsg="${key}" aria-label="지우기">${MT_ICON.bin}${armed ? `<span>${m.who === 'u' ? '세희 답까지 지워요 · 한 번 더' : '한 번 더 누르면 지워요'}</span>` : ''}</button>`;
  let menu = '';
  if (O.regenOpen === m.at && canRegen(i)) menu = `<span class="regen-menu"><button class="regen" data-regen="">그냥 다시</button>${REGEN_HOW.map(x => `<button class="regen sm" data-regen="${x}">${x}</button>`).join('')}</span>`;
  return `<span class="mtools">${h}</span>${menu}`;
}
/* 아이콘 누르기 — 대화창·판 대화 상자·보드 대화 상자가 같이 쓴다 */
function msgToolClick(e){
  const t = e.target;
  const rt = t.closest('[data-retry]'); if (rt){ O.regenOpen = null; retryLast(Number(rt.dataset.retry)); return true; }
  const rg = t.closest('[data-regen]'); if (rg){ O.regenOpen = null; regenLast(rg.dataset.regen); return true; }
  const rm = t.closest('[data-regenmenu]'); if (rm){ const at = Number(rm.dataset.regenmenu); O.regenOpen = O.regenOpen === at ? null : at; O.delArm = null; renderLog(); renderPanTalk(); return true; }
  const dm = t.closest('[data-delmsg]');
  if (dm){ const key = dm.dataset.delmsg;
    if (O.delArm === key){ O.delArm = null; const [i, at] = key.split(':').map(Number); deleteMsg(at, i); return true; }
    O.delArm = key; O.regenOpen = null; renderLog(); renderPanTalk(); clearTimeout(O.delT); O.delT = setTimeout(() => { if (O.delArm === key){ O.delArm = null; renderLog(); renderPanTalk(); } }, 4000); return true; }
  return false;
}
/* ── 말 지우기 (v1.5.5) — 보스 요구: 지운 말은 세희가 다시 읽지 못하게 완전히.
   보스 말을 지우면 그 차례 통째(다음 보스 말 전까지: 세희 답·작업 표시), 세희 답은 그 말 하나.
   대화 기록(chat)에서 빼고 → 저장(계정 서버도 같은 값으로 덮어씀), 개발자 로그·이 기기 presync 사본에서 그 글을 지우고, 이어 하던 긴 일도 버린다.
   판·보드·사람에 이미 적은 것은 그대로 둔다(그건 결과물 — 따로 지운다). */
async function deleteMsg(at, idx){
  if (O.busy) return;
  const i = O.log[idx] && O.log[idx].at === at ? idx : O.log.findIndex(m => m.at === at); if (i < 0) return;
  let j = i + 1; if (O.log[i].who === 'u') while (j < O.log.length && O.log[j].who !== 'u') j++;
  const gone = O.log.splice(i, j - i), ats = gone.map(x => x.at);
  for (const x of gone) delete O.thumbs[x.at];
  await saveLog(); await scrubTraces(gone);
  renderLog(); renderPanTalk(); growSay && growSay();
  bonusEmit('turnRemoved', { ats });
  dlog('대화', `말 지움 · ${gone.length}개`); toast(gone.length > 1 ? `${gone.length}개 지웠어요 — 세희는 다시 못 봐요` : '지웠어요 — 세희는 다시 못 봐요');
}
async function scrubTraces(gone){
  const ats = new Set(gone.map(x => x.at)), texts = gone.map(x => String(x.text || '').trim()).filter(Boolean);
  const hit = line => texts.some(t => { const k = t.slice(0, 40); return k.length >= 4 ? line.includes(k) : line.endsWith('→ ' + t) || line.endsWith('] ' + t); });
  const before = DBG.lines.length; DBG.lines = DBG.lines.filter(l => !hit(l.m));
  if (DBG.lines.length !== before){ try{ localStorage.setItem('sehee.dbg', JSON.stringify(DBG.lines.slice(-300))); }catch(e){} if (localStorage.getItem('sehee.dev') === '1') kvSet('dbg', { at:Date.now(), v:APP_VERSION, lines:DBG.lines.slice(-300) }).catch(() => {}); }
  try{ const job = await kvGet('job'); if (job && ats.has(job.msgAt)) await kvSet('job', null); }catch(e){}
  try{ const ps = await kvGet('presync'); if (ps && ps.kv && Array.isArray(ps.kv.chat)){ ps.kv.chat = ps.kv.chat.filter(x => !ats.has(x.at)); await kvSet('presync', ps); } }catch(e){}
}
async function sendSay(src){
  await loadChat();
  if (WORK.ask){ const ta0 = src instanceof HTMLTextAreaElement ? src : $('sayText'), v0 = ta0.value.trim(); if (!v0) return;
    O.log.push({ who:'u', text:v0, at:Date.now() }); ta0.value = ''; growSay(); WORK.ask.done(v0); return; }
  const ta = src instanceof HTMLTextAreaElement ? src : $('sayText'), v = ta.value.trim(); if ((!v && !ATT.length) || O.busy || ATT.some(a => a.reading)) return;
  const atts = ATT.splice(0), imgs = atts.filter(a => a.kind === 'img'), txts = atts.filter(a => a.kind === 'txt');
  renderTray();
  const um = { who:'u', text:v, at:Date.now() };
  if (imgs.length){ um.pics = imgs.length; O.thumbs[um.at] = imgs.map(a => a.url); if (imgs.every(a => a.scan)) um.scanOf = [...new Set(imgs.map(a => a.name.replace(/ \d+쪽$/, '')))].join(', '); }
  for (const t of txts) await boardAdd(cardFrom({ kind:'file', title:t.name, name:t.name, text:t.text, pages:t.pages }, 'boss'), false);
  if (txts.length){ um.docs = txts.map(t => t.name); um.doc = txts.map(t => (txts.length > 1 ? `── ${t.name} ──\n` : '') + clipDoc(t.text, t.head)).join('\n\n'); }
  const heavy = !!(imgs.length || txts.length) || v.length >= 300 || v.split('\n').length >= 6;
  if (heavy && aiReady()) askNotify();   /* 누른 순간에 물어야 폰이 허락 창을 띄워준다 */
  O.log.push(um); ta.value = ''; dlog('대화', `보스 → ${v.slice(0, 60)}${v.length > 60 ? '…(' + v.length + '자)' : ''}${um.pics ? ' · 사진 ' + um.pics : ''}${um.docs ? ' · 문서 ' + um.docs.length : ''}${heavy ? ' · 긴 작업' : ''}`);
  O.turnActs = O.log.filter(m => m.who === 'a' && !m.read).length;
  O.busy = true; growSay(); setFace(2); renderLog(); await saveLog();
  if (aiReady() && heavy){
    const job = { at:Date.now(), msgAt:um.at, stage:imgs.length ? 'read' : 'organize' };
    if (imgs.length){
      O.abort = new AbortController(); O.live = { text:'', t0:Date.now(), ocr:{ step:'사진 여는 중', done:0, total:0, chars:0 } }; renderLog();
      try{
        job.tiles = await cutTiles(imgs.map(a => a.file), O.abort.signal, pr => { if (O.live && O.live.ocr){ Object.assign(O.live.ocr, pr); const w = $('waitTxt'); if (w) w.textContent = waitText(); } });
      }catch(err){
        O.log.push({ who:'s', text:err.code === -2 ? '네, 그만둘게요.' : '사진을 못 열었어요. ' + err.message, face:5, at:Date.now(), err:err.code !== -2 }); setFace(5);
        O.live = null; O.abort = null; O.busy = false; renderLog(); growSay(); saveLog(); return;
      }
      O.live = null; O.abort = null;
    }
    await kvSet('job', job);
    await runJob(job, um);
    return;
  }
  if (aiReady()) await replyNow();
  else {
    await new Promise(r => setTimeout(r, 700 + Math.random() * 900));
    if (imgs.length || txts.length) seheeSays({ t:'사진이랑 파일은 머리가 있어야 읽어요. 설정에서 키부터요.', f:6 });
    else seheeSays(replyFor(v));
    if (!O.hinted){ O.hinted = true; O.log.push({ who:'s', text:'⚙ 설정 → 세희 머리에서 API 키를 넣으면 진짜로 대답할 수 있어요.', face:1, at:Date.now(), hint:true }); }
  }
  O.busy = false; renderLog(); growSay(); bdGrow(); saveLog();
}
$('sayText').addEventListener('input', growSay);
$('sayText').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing){ e.preventDefault(); sendSay(); } });
$('sayText').addEventListener('focus', () => { document.body.classList.add('typing'); setTimeout(() => { $('log').scrollTop = $('log').scrollHeight; }, 250); });
$('sayText').addEventListener('blur', () => document.body.classList.remove('typing'));
/* 키보드가 내려가거나 장면 크기가 바뀌어도, 맨 아래를 보고 있었다면 맨 아래에 붙어 있는다 */
let logPinned = true;
$('log').addEventListener('scroll', () => { const l = $('log'); logPinned = l.scrollHeight - l.scrollTop - l.clientHeight < 40; });
if (window.ResizeObserver) new ResizeObserver(() => { if (logPinned) $('log').scrollTop = $('log').scrollHeight; }).observe($('log'));
$('sayGo').addEventListener('pointerdown', e => e.preventDefault());   /* 보내도 키보드가 닫히지 않게 */
$('sayGo').onclick = sendSay;
$('log').addEventListener('click', e => {
  if (e.target.closest('[data-stop]') && O.abort) O.abort.abort();
  const u = e.target.closest('[data-undo]'); if (u) undoAction(Number(u.dataset.undo));
  if (msgToolClick(e)) return;
  const c = e.target.closest('[data-copyocr]');
  if (c){ const m = O.log[Number(c.dataset.copyocr)]; if (m && m.ocr) navigator.clipboard.writeText(m.ocr).then(() => { c.textContent = '복사됨'; }, () => { c.textContent = '복사 안 됨'; }); }
});
$('sayClip').addEventListener('pointerdown', e => e.preventDefault());
$('sayClip').onclick = () => $('sayFile').click();
$('sayFile').onchange = e => { const f = [...e.target.files]; e.target.value = ''; addFiles(f); };
/* 컴퓨터: 캡처 파일을 사무실로 끌어다 놓기 (v0.7.4) */
$('office').addEventListener('dragover', e => { if ([...(e.dataTransfer.types || [])].includes('Files')){ e.preventDefault(); $('office').classList.add('drop'); } });
$('office').addEventListener('dragleave', e => { if (e.target === $('office')) $('office').classList.remove('drop'); });
$('office').addEventListener('drop', e => { e.preventDefault(); $('office').classList.remove('drop'); const f = [...(e.dataTransfer.files || [])]; if (f.length) addFiles(f); });
$('sayText').addEventListener('paste', e => {
  const files = [...((e.clipboardData && e.clipboardData.files) || [])].filter(f => /^image\//.test(f.type));
  if (!files.length) return;
  e.preventDefault(); addFiles(files);
});
$('tray').addEventListener('click', e => { const b = e.target.closest('[data-att]'); if (!b) return; const a = ATT.splice(Number(b.dataset.att), 1)[0]; if (a && a.url) URL.revokeObjectURL(a.url); renderTray(); });
$('brain').onclick = settingsSheet;
