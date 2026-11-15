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
  { t:'오늘 안에만 하면 되는 거죠?', f:2 },
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
  { re:/안녕|하이|ㅎㅇ|좋은 아침/, list:[ { t:'안녕하세요. 오늘도 오셨네요.', f:3 }, { t:'오셨어요. 판은 펴 놨어요.', f:1 } ] },
  { re:/바보|멍청|짜증|싫어|씨발|ㅅㅂ/, list:[ { t:'……들은 걸로 할게요.', f:6 }, { t:'저도 사람이…… 아니, 비서예요.', f:4 } ] },
  { re:/급|빨리|당장|지금 바로/, list:[ { t:"'오늘 안에' 꼬리표 달아둘게요. 아, 아직 못 달아요.", f:5 }, { t:'급한 건 판 맨 위에요. 제가 손이 생기면요.', f:4 } ] },
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
  el.innerHTML = O.log.map((m, i) => m.hide ? '' : m.who === 'a'
      ? (m.board ? `<div class="act read">🗂 ${esc(m.text)}</div>` : m.read ? `<div class="act read">🔎 ${esc(m.text)}</div>`
        : `<div class="act${m.undone ? ' undone' : ''}">📌 ${esc(m.text)}${m.undone ? ' · 되돌림' : ` <button data-undo="${i}">되돌리기</button>`}</div>`)
      : `<div class="msg ${m.who}${m.err ? ' err' : ''}${i === lastS && !O.busy ? ' last' : ''}">${msgInner(m, i)}<div class="mfoot">${msgTools(m, i, lastS)}<time>${hhmm(m.at)}</time></div></div>`).join('')
    + (O.busy ? (O.live && O.live.text && liveRest(parseFace(O.live.text).t) ? `<div class="msg s last live">${esc(liveRest(parseFace(O.live.text).t))}</div>`
      : `<div class="msg s last wait" aria-label="세희가 쓰는 중"><i><span></span><span></span><span></span></i><small id="waitTxt">${waitText()}</small>${O.abort ? '<button class="stop" data-stop>그만</button>' : ''}</div>`) : '');
  el.scrollTop = el.scrollHeight;
  renderBoardTalk();
}
function msgInner(m, i){
  let h = '';
  const th = O.thumbs[m.at];
  if (th && th.length) h += `<span class="pics">${th.map((u, k) => `<img src="${u}" alt="보스가 보낸 사진 ${k + 1}" data-pv-at="${m.at}" data-pv-i="${k}">`).join('')}</span>`;
  else if (m.pics && m.who === 'u' && typeof picLoad === 'function') picLoad(m.at);   /* 11-15 C: 다시 켠 뒤 이 기기 사본으로 되살림(js/picview.js) */
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
  const busy = O.live.big ? (O.live.deep ? `${shortModel(O.live.big)}로 깊게 생각 중` : `${O.live.hard ? '꼼꼼히 따져 보는 중' : '긴 글이라 ' + shortModel(O.live.big) + '로 정리 중'}`) : O.updTour ? '바뀐 점 정리하는 중' : '세희가 생각 중';
  const re = O.live.retry ? ` · 서버가 삐끗해서 다시 하는 중(${O.live.retry}번째)` : '';
  return (sec < 2 && !re ? '보내는 중' : busy) + ` · ${sec}초` + re + (sec >= 15 && !re ? ' · 오래 걸리네요' : '');
}
/* 11-15 B: 말 나누기를 쓰는 중에 — 글이 오다가 문단이 끝나면 그 문단을 바로 말풍선 하나로 내보내고 다음 말풍선에 이어 쓴다.
   큰 말풍선을 다 쓴 뒤에 쪼개는 게 보여 버벅이던 것(보스 11-15 — '너처럼 차례대로'). 한 조각 40자 이상, 한 대답에 먼저 내보내는 건 2개까지(마지막 포함 3개) */
const LIVE_MIN = 40, LIVE_MAX = 2;
function liveRest(t){ let s = String(t || ''); const L = O.live; if (L && L.flushed) for (const c of L.flushed){ const k = s.indexOf(c); if (k >= 0) s = s.slice(k + c.length); } return s.replace(/^\s+/, ''); }
function liveSplit(){
  const L = O.live; if (!L || !L.text) return;
  const pf = parseFace(L.text); let did = false;
  while ((L.flushed || []).length < LIVE_MAX){
    const rest = liveRest(pf.t), re = /\n\s*\n/g; let m, cut = -1, brk = '';
    while ((m = re.exec(rest))) if (m.index >= LIVE_MIN){ cut = m.index; brk = m[0]; break; }
    if (cut < 0 || !rest.slice(cut + brk.length).trim()) break;   /* 뒤에 글이 와야 나눈다 */
    const chunk = rest.slice(0, cut).trim(); (L.flushed = L.flushed || []).push(chunk);
    O.log.push({ who:'s', text:chunk, face:pf.f, at:Date.now(), part:true }); did = true;
    dlog('대화', `세희 ← (차례로) ${chunk.slice(0, 50)}`);
  }
  if (did){ L.faced = true; setFace(pf.f); renderLog(); saveLog(); }
}
function updateLive(){
  liveSplit();
  const el = $('log').querySelector('.msg.live');
  if (!el){ renderLog(); return; }
  el.textContent = liveRest(parseFace(O.live.text).t);
  if (logPinned) $('log').scrollTop = $('log').scrollHeight;
  renderBoardTalk();
}
async function saveLog(){ if (O.log.length > 300) O.log = O.log.slice(-300); try{ await kvSet('chat', O.log); }catch(e){} }
/* ── 말을 나눠서 (v1.5.22 · C) — 보스: 큰 일은 두세 번에 나눠 말하는 게 사람 같다 ──
   seheePart = 도구 쓰기 전에 한 말(그 자리에서 말풍선 하나). seheeSaysSplit = 끝 대답이 길고 문단이 나뉘면 2~3개로, 사이에 잠깐 '…'. */
function seheePart(t){
  const pf = parseFace(t); pf.t = liveRest(pf.t); if (O.live) O.live.flushed = [];   /* 11-15 B: 쓰는 중에 이미 내보낸 문단은 빼고 */
  if (!pf.t.trim() || /^[….·\s]+$/.test(pf.t)){ if (O.live){ O.live.text = ''; O.live.faced = false; } renderLog(); return; }   /* 11-15 B: 표정만 오고 말이 없으면 '…' 말풍선을 안 띄움 */
  O.log.push({ who:'s', text:pf.t, face:pf.f, at:Date.now(), part:true }); setFace(pf.f); dlog('대화', `세희 ← (먼저) ${pf.t.slice(0, 60)}`);
  if (O.live){ O.live.text = ''; O.live.faced = false; }
  renderLog(); saveLog();
}
function splitSay(t){
  const paras = String(t).split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  if (String(t).length < 90 || paras.length < 2) return [String(t)];
  const n = Math.min(3, paras.length), goal = paras.join('').length / n, out = [];
  let cur = [];
  for (let i = 0; i < paras.length; i++){ cur.push(paras[i]); const left = paras.length - i - 1, need = n - out.length - 1;
    if (out.length < n - 1 && (cur.join('').length >= goal * 0.8 || left === need) && left >= need && left > 0){ out.push(cur.join('\n\n')); cur = []; } }
  if (cur.length) out.push(cur.join('\n\n'));
  return out;
}
async function seheeSaysSplit(pf, src){
  /* 11-15 B: 쓰는 중에 이미 차례로 내보냈으면 남은 것만 끝 말로 — 다 쓴 뒤 쪼개기는 하지 않는다(버벅임) */
  if (O.live){ const had = (O.live.flushed || []).length; pf = { ...pf, t:liveRest(pf.t) }; O.live.flushed = [];
    if (had || O.live.text){ if (!String(pf.t || '').trim()){ const last = O.log[O.log.length - 1]; if (last && last.part){ O.log.pop(); return seheeSays({ t:last.text, f:last.face }, src); } } return seheeSays(pf, src); } }
  /* 끝 말이 비었는데 앞서 먼저 한 말이 있으면 — 그 말을 끝 말로(판 반짝임 등 뒤처리는 seheeSays 가 한다) */
  if (!String(pf.t || '').trim()){ const last = O.log[O.log.length - 1]; if (last && last.part){ O.log.pop(); return seheeSays({ t:last.text, f:last.face }, src); } }
  const parts = splitSay(pf.t);
  for (let i = 0; i < parts.length - 1; i++){
    O.log.push({ who:'s', text:parts[i], face:pf.f, at:Date.now(), part:true }); setFace(pf.f);
    if (O.live){ O.live.text = ''; } renderLog();
    try{ await sleepFor(650, O.abort && O.abort.signal); }catch(e){}
  }
  return seheeSays({ ...pf, t:parts[parts.length - 1] }, src);
}
function seheeSays(r, src){
  bonusEmit('say', { text:r.t, face:r.f });
  dlog('대화', `세희 ← [${r.f}] ${String(r.t).replace(/\s*\n+\s*/g, ' ⏎ ').slice(0, 80)}`, String(r.t));   /* 11-15 A: 요약 줄에 줄바꿈이 섞여 '이름 한 줄이 끼인' 것처럼 보이던 것(생성기 1일차 14번 — 앱 화면 문제 아님) */   /* v1.5.21 원문은 d 에(개발 블랙박스) */
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
    const lastU = [...O.log].reverse().find(m => m.who === 'u'), asked = lastU && /인간관계|사람\s?판|인물\s?(판|기록)|기록부|사진\s?단서/.test(lastU.text || '');
    if (!asked && !(curView() === 'office' && DW.open === 'people') && typeof seeMark === 'function'){ seeMark('people', id); return; }   /* 11-15 B: 보스가 인간관계 판을 콕 집었거나 보고 있을 때만 열어 보여 줌, 아니면 「볼 거」 */
    if (curView() !== 'office') goView('office');
    setTimeout(async () => { if (DW.open !== 'people') await dwOpen('people'); else pplRender(); setTimeout(() => pplFlash(id), 380); }, curView() === 'office' ? 60 : 260);
  } else if (CAL.changed){
    const d = CAL.changed; CAL.changed = null;
    if (curView() === 'office') setTimeout(() => calShowDate(d), 60);   /* 11-15 B: 보스가 '달력에 적어'라고 한 일만 여기 옴 — 그 날을 확대해 보여 줌 */
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
const HARD_Q = /정리|요약|무슨\s?일|뭔\s?일|있었(어|나|던|는지)|겹치|겹쳐|충돌|누가\s?누가|누구(누구)?\s?(있|나와|나오)|사람들?\s?(은|이|좀|목록)|비교|뭐가\s?(달|다르|틀)|차이|어떻게\s?해야|뭐라고\s?(말|답|보내|하)|답장|초안|도와\s?(줘|주세요|줄래)|모르겠/;
/* 보통 대답 한 번(v1.2.2 — 다시 시도 버튼도 이걸 쓴다) */
async function replyNow(){
    /* v1.5.8 (C) 보스가 "소넷으로"·"큰 머리로"·"깊게 생각해" 하면 그 차례만 큰 머리 */
    const lastU = [...O.log].reverse().find(m => m.who === 'u'), wantBig = !!(lastU && bigModel() && /소넷|sonnet|큰\s?머리|깊게\s?생각/i.test((lastU.text || '') + ' ' + (lastU.regenHow || '')));
    if (wantBig) dlog('AI', '보스가 큰 머리를 부름 — 이번 차례만 ' + bigModel());
    /* 11-15 A: 짧아도 하루 전체를 다시 따져야 하는 질문(정리·요약·누가·겹침·비교·차이·답장 초안·도와줘)은 큰 머리로 — 생성기 1일차 4번 */
    const hardQ = !wantBig && !!(lastU && bigModel() && !lastU.pics && HARD_Q.test(lastU.text || ''));
    if (hardQ) dlog('AI', '따져야 하는 질문 — 이번 차례 큰 머리 ' + bigModel());
    O.abort = new AbortController(); O.live = { text:'', t0:Date.now(), faced:false, big:(wantBig || hardQ) ? bigModel() : null, deep:wantBig, hard:hardQ, waitUntil:0 };
    renderLog();
    const tick = setInterval(() => { const w = $('waitTxt'); if (w) w.textContent = waitText(); }, 1000);
    try{
      const r = await aiTurn(toMessages(O.log), t => {
        O.live.text = t; O.live.search = '';
        if (!O.live.faced && t.trim()){ O.live.faced = true; setFace('talk'); }
        updateLive();
      }, O.abort.signal, { big:wantBig || hardQ, onPart:seheePart, onRetry:n => { if (O.live){ O.live.retry = n; const w = $('waitTxt'); if (w) w.textContent = waitText(); } },
        onWait:ms => { if (!O.live) return; O.live.waitUntil = ms ? Date.now() + ms : 0; const w = $('waitTxt'); if (w) w.textContent = waitText(); },
        onSearch:q => { if (!O.live) return; O.live.search = q || '…'; if (!O.live.text) renderLog(); } });
      const pf = parseFace(r.text);
      if (/max_tokens|MAX_TOKENS/.test(r.finish)) pf.t += ' …(말이 길어서 잘렸어요)';
      await seheeSaysSplit(pf, r.sources);
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
  picForget(gone.filter(x => x.pics).map(x => x.at));   /* 11-15 C: 사진 사본도 */
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
  if (SYNC.observer){ toast('관전석에서는 보기만 해요 — 말은 폰에서 걸어 주세요'); return; }
  await loadChat();
  if (WORK.ask){ const ta0 = src instanceof HTMLTextAreaElement ? src : $('sayText'), v0 = ta0.value.trim(); if (!v0) return;
    O.log.push({ who:'u', text:v0, at:Date.now() }); ta0.value = ''; growSay(); WORK.ask.done(v0); return; }
  const ta = src instanceof HTMLTextAreaElement ? src : $('sayText'), v = ta.value.trim(); if ((!v && !ATT.length) || O.busy || ATT.some(a => a.reading)) return;
  const atts = ATT.splice(0), imgs = atts.filter(a => a.kind === 'img'), txts = atts.filter(a => a.kind === 'txt');
  renderTray();
  const um = { who:'u', text:v, at:Date.now() };
  if (imgs.length){ um.pics = imgs.length; O.thumbs[um.at] = imgs.map(a => a.url); picSave(um.at, imgs.map(a => a.file)); if (imgs.every(a => a.scan)) um.scanOf = [...new Set(imgs.map(a => a.name.replace(/ \d+쪽$/, '')))].join(', '); }
  for (const t of txts) await boardAdd(cardFrom({ kind:'file', title:t.name, name:t.name, text:t.text, pages:t.pages }, 'boss'), false);
  if (txts.length){ um.docs = txts.map(t => t.name); um.doc = txts.map(t => (txts.length > 1 ? `── ${t.name} ──\n` : '') + clipDoc(t.text, t.head)).join('\n\n'); }
  const heavy = !!(imgs.length || txts.length) || v.length >= 300 || v.split('\n').length >= 6;
  if (heavy && aiReady()) askNotify();   /* 누른 순간에 물어야 폰이 허락 창을 띄워준다 */
  O.log.push(um); ta.value = ''; dlog('대화', `보스 → ${v.replace(/\s*\n+\s*/g, ' ⏎ ').slice(0, 60)}${v.length > 60 ? '…(' + v.length + '자)' : ''}${um.pics ? ' · 사진 ' + um.pics : ''}${um.docs ? ' · 문서 ' + um.docs.length : ''}${heavy ? ' · 긴 작업' : ''}`, v);
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
/* ── 업데이트 뒤 세희 설명 (v1.5.30, B) — 보스가 장면에서 '예'를 누르고 새로 켜진 뒤 한 번.
   바뀐 기록(CHANGELOG.md 의 그 사이 항목)을 숨은 말(m.hide — 화면엔 안 보이고 세희만 읽음)로 건네면, 세희가
   ① 보스 쪽에서 보이는 것 위주로 쉽게 짧게 알리고 ② 기존 자료를 손볼 게 있으면 도구로 고치고, 보스 판단이 필요한 건 ask_boss 선택지로 묻는다 ── */
const verNum = v => String(v || '').replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
const verGt = (a, b) => { const x = verNum(a), y = verNum(b); for (let i = 0; i < 3; i++){ if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
async function updNotes(from, to){
  try{ const t = await (await fetch('CHANGELOG.md?v=' + Date.now(), { cache:'no-store' })).text();
    const secs = t.split(/\n(?=## v\d)/).filter(s => /^## v\d/.test(s)).filter(s => { const v = s.match(/^## (v[\d.]+)/)[1]; return verGt(v, from) && !verGt(v, to); });
    let out = secs.join('\n').trim();
    if (out.length > 7000) out = secs.map(s => s.split('\n').slice(0, 3).join('\n')).join('\n').slice(0, 7000);
    return out;
  }catch(e){ return ''; }
}
async function updBrief(from, to){
  if (typeof SYNC !== 'undefined' && SYNC.observer) return;
  for (let k = 0; k < 240 && (O.busy || WORK.ask || (typeof VN !== 'undefined' && VN.el) || !!document.getElementById('pinVeil')); k++) await new Promise(r => setTimeout(r, 500));   /* 다른 대답·장면(처음 인사)·잠금 화면이 끝날 때까지 */
  await loadChat(); if (curView() !== 'office') goView('office');
  const notes = updUserNotes(await updNotes(from, to));
  /* 11-15 A: 사용자에게 보이는 변화가 없으면(내부 일만) 세희를 부르지 않고 한 줄만 — 개발 얘기가 새어 나가던 것(생성기 1일차) · 3만 토큰 아낌 */
  if (!notes.trim()){ dlog('업데이트', `세희 설명 생략 ${from} → ${to} — 사용자 쪽 변화 없음(내부 일만)`); seheeSays({ t:'새 규정 적용을 마쳤어요. 쓰시는 화면은 그대로예요.', f:0 }); briefMark(O.log.length - 1); renderLog(); saveLog(); return; }
  if (!aiReady()){   /* 머리가 없으면 바뀐 기록 제목만 추려서 한마디(11-15 B) */
    const titles = (notes.match(/^## v[\d.]+ · [A-Z] · (.+)$/gm) || []).map(l => l.replace(/^## v[\d.]+ · [A-Z] · /, '').split(/ — |: /)[0].trim()).filter(Boolean).slice(0, 5);
    seheeSays({ t:`새 규정 적용을 마쳤습니다.${titles.length ? ' 바뀐 것은 이래요.\n' + titles.map(x => '· ' + x).join('\n') : ''}`, f:0 }); renderLog(); saveLog(); return; }
  dlog('업데이트', `세희 설명 시작 ${from} → ${to} · 기록 ${notes.length}자`);
  O.log.push({ who:'u', hide:true, upd:{ from, to }, at:Date.now(), text:`(앱 안내 — 보스가 쓴 말이 아니다. 보스 화면엔 안 보인다)
보스가 방금 업데이트 장면에서 '예'를 눌러 사내 규정(세희 앱)을 ${from} → ${to} 로 바꿨다. 사무실로 돌아온 보스에게 이렇게 한다.
1) 업데이트가 끝났다는 걸 자연스럽게 알리고(정해진 첫 문장을 쓰지 않는다 — 지난번 업데이트 때와 다르게), 바뀐 점을 보스 쪽에서 보이고 쓰는 것 위주로 쉬운 말로 짧게(3~6줄) 알린다. 버전 번호·파일 이름·방 이름(A·B·C)·코드 말은 빼고, 비슷한 건 묶는다.
2) 이번 변화로 보스의 기존 자료(인간관계 판·보드·일정·일간보고서 등)를 손보면 더 좋아지는 게 있으면, 도구로 먼저 들여다보고 확실한 정리는 바로 한다(한 일은 한 줄씩 말한다). 보스 뜻이 갈리는 건 ask_boss 로 고를 것 2~4개를 주고 묻는다(한 번에 하나씩). 손볼 게 없으면 그 얘기는 꺼내지 않는다.
3) 길게 늘어놓지 않는다. 이 안내 글이 있다는 말은 하지 않는다.
── 바뀐 기록(개발자 말투) ──
${notes || '(기록을 못 가져왔다 — 무엇이 바뀌었는지 모른다고 솔직히 말하고, 써 보시다 이상한 게 있으면 알려 달라고만 한다)'}` });
  O.turnActs = O.log.filter(m => m.who === 'a' && !m.read).length;
  O.busy = true; O.updTour = true; growSay(); setFace(2); renderLog(); await saveLog();
  const mark = O.log.length - 1;
  try{ await replyNow(); }finally{ briefMark(mark); O.updTour = false; O.busy = false; renderLog(); growSay(); saveLog(); }
}
/* 11-15 A: 업데이트 설명(숨은 안내 + 세희 대답)은 다음 대답의 맥락에서 뺀다 — "왜 이렇게 어렵게 설명해요!" 에 업데이트 얘기로 답하던 것(생성기 1일차 9번) */
function briefMark(from){ for (let i = Math.max(0, from); i < O.log.length; i++) if (O.log[i].who !== 'u' || O.log[i].upd) O.log[i].brief = true; }
/* 변경 기록에서 사용자에게 안 보이는 일(제목이나 줄에 '(내부)')을 걷어낸다 */
function updUserNotes(notes){
  const out = [], blocks = String(notes || '').split(/\n(?=## v)/);
  for (const b of blocks){ const lines = b.split('\n'); if (/^## v.*\(내부\)/.test(lines[0])) continue; const keep = lines.filter(l => !/\(내부\)/.test(l)); if (keep.length > 1 || (keep[0] && !/^## v/.test(keep[0]))) out.push(keep.join('\n')); }
  return out.join('\n');
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
