/* editor.js v1.4 — (v1.4) 녹화는 박자만 기록하고 ⬇ 내보내기 창에서 MP4 · PNG 묶음 (투명) · GIF (투명) 로 만듦 (민수: 에펙에서 씀) · 박자 기록이 없으면 자동 박자 · 모션 '가장자리로 · 제자리로' + 자리 '왼쪽끝 · 오른쪽끝' (민수: 화면 끝으로 비켜 가운데를 비움)
   (v1.3) 좌우반전 (민수): 인물 칸의 '기본 좌우반전' (cast.flip, 옐로는 켜 둠) · 카드 모션 줄의 '↔ 좌우반전' = 그 카드부터 반대로 (다시 넣으면 원래대로), 반전 중이면 이름 옆에 표시 · 보는 쪽 두 줄은 '방향 자세히' 안으로
   (v1.2) 모션 넣기 쉽게 (민수: 그 캐릭터에 어떤 모션 넣을지 정도면 됨): 카드마다 말하는 사람의 모션 단추 (깡충 · 두 번 깡충 · 흔들 · 덜덜 · 꾸벅 · 쿵 · 퇴장) — 누르면 켜고 끔 · 바로 미리보기. 나레이션 · 멈춤 카드는 모션 줄 인물을 고름 (b.mwho). 말하는 사람을 바꾸면 모션도 따라감. '+ 연출' 은 등장 자리 · 이동 · 다른 인물용으로, 인물 칸이 그 카드의 인물로 시작 (전엔 늘 목록 첫 사람이라 엉뚱한 인물에게 들어감)
   (v1.1) 움짤 표정 (anim · w · h · thumb) · 인물마다 화면에서 보는 쪽 (face: L · R · auto — 민수: 인주는 늘 왼쪽, 나머지는 늘 오른쪽) · 움짤을 넣으면 첫 장으로 작은 그림을 만들어 올림
   (v1.0) 시나리오 편집기 화면 · 저장 (민수: 일러스트까지 편집할 수 있는 시나리오 편집기)
   ■ 왼쪽 = 대사 카드 (한 장이 한 박자: 말하는 사람 · 표정 그림 · 대사 · 연출), 가운데 = 미리보기 (engine.js), 오른쪽 = 인물 · 설정 · 쓰는 법
   ■ 저장: 아티팩트 저장소 (db) — cast/<인물> · scen/<시나리오>. 넣은 그림은 자산 보관함 (assets) → '/_blob/' + id
     저장소가 없는 화면 (내려받아 연 파일 등) 에선 이 브라우저 (localStorage) 에만
   ■ 인물 = { name, order, look (그림 속 인물이 보는 쪽 R/L), face (화면에서 보는 쪽 L · R · auto), pitch (전자음 Hz), size, dx, dy, ex: [{ k (표정 이름), src | blob, orig (흰 바탕 원본), anim (움짤) · w · h · thumb | thumbBlob, crop, scale, dx, dy, look }] }
   ■ 시나리오 = { title, order, updated, opt (설정), beats: [{ id, kind: 'line' | 'rest', who, ex, text, fx: [{ k: in · out · ex · move · shake · hop, who, slot, ex }] }] } */
'use strict';
const ED = { db: null, assets: null, mode: 'local', cast: {}, scen: {}, cur: null, tab: 'cast', castSel: null, exSel: null, textMode: false, fxOpen: -1, imgs: {}, timers: {}, inflight: {}, recent: {}, got: { cast: false, scen: false },
  ready: false, bg: 'check', drag: -1, armed: null, customWho: -1, wb: null };
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const SLOTS = ['왼쪽끝', '왼쪽', '왼쪽2', '가운데', '오른쪽2', '오른쪽', '오른쪽끝'];
const FXK = { in: '등장', out: '퇴장', ex: '표정', move: '이동', hop: '깡충', hop2: '두 번 깡충', shake: '흔들', tremble: '덜덜', bow: '꾸벅', flinch: '쿵', flip: '좌우반전', edge: '가장자리로', home: '제자리로' };
const FXT = { ...FXK, hop2: '두번깡충' };   // 글 대본에 쓰는 이름 (띄어쓰기 없이)
const MOTS = [['hop', '깡충'], ['hop2', '두 번 깡충'], ['shake', '흔들'], ['tremble', '덜덜'], ['bow', '꾸벅'], ['flinch', '쿵'], ['flip', '↔ 좌우반전'], ['edge', '⇤ 가장자리로'], ['home', '제자리로'], ['out', '퇴장']];
// 그 카드에 들어올 때 이 인물이 (카드의 좌우반전으로) 반대로 서 있는지 — 퇴장하면 원래대로
function edFlipped(sc, i, nm){ let f = false; for (let j = 0; j < i; j++) for (const x of sc.beats[j].fx || []){ if (x.k === 'out' && (x.who === nm || x.who === '모두')) f = false; else if (x.k === 'flip' && x.who === nm) f = !f; } return f; }
const MOTK = new Set(MOTS.map(m => m[0]));
const edCastList = () => Object.values(ED.cast).sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name));
const edScenList = () => Object.values(ED.scen).sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.title || '').localeCompare(b.title || ''));
const edByName = nm => Object.values(ED.cast).find(c => c.name === nm);
const edSc = () => ED.scen[ED.cur];
const edUrl = e => e.blob ? '/_blob/' + e.blob : e.src;
// 카드의 모션 줄 인물: 말하는 사람. 나레이션 · 멈춤 카드는 고른 사람 (b.mwho), 없으면 바로 앞에 말한 사람
function edMotWho(sc, i){
  const b = sc.beats[i]; if (b.kind === 'line' && b.who && edByName(b.who)) return b.who;
  if (b.mwho && edByName(b.mwho)) return b.mwho;
  for (let j = i - 1; j >= 0; j--){ const w = sc.beats[j].who; if (w && edByName(w)) return w; }
  return (edCastList()[0] || {}).name || '';
}

/* ---------- 저장소 ---------- */
async function edStoreInit(){
  for (let i = 0; i < 15 && !(window.claude && window.claude.use); i++) await new Promise(r => setTimeout(r, 100));
  if (window.claude && window.claude.use){ try { ED.db = await window.claude.use('db'); } catch (e) {} try { ED.assets = await window.claude.use('assets'); } catch (e) {} }
  ED.mode = ED.db ? 'db' : 'local';
  if (ED.mode === 'db'){
    ED.db.collection('cast').onSnapshot(s => edOnSnap('cast', s), e => edStatus('인물을 못 읽었어요 — 새로 고쳐 주세요'));
    ED.db.collection('scen').onSnapshot(s => edOnSnap('scen', s), e => edStatus('시나리오를 못 읽었어요 — 새로 고쳐 주세요'));
    setTimeout(() => { if (!ED.ready){ ED.got = { cast: true, scen: true }; edBoot(); edStatus('서버에서 늦게 와요 — 잠시 뒤 새로 고쳐 주세요'); } }, 9000);
  } else {
    try { const o = JSON.parse(localStorage.getItem('scenario-editor-v1') || '{}'); ED.cast = o.cast || {}; ED.scen = o.scen || {}; } catch (e) {}
    ED.got = { cast: true, scen: true }; edBoot();
  }
}
function edOnSnap(col, snap){
  const M = col === 'cast' ? ED.cast : ED.scen, seen = new Set(); let changed = false;
  for (const d of snap.docs){
    seen.add(d.id); const key = col + '/' + d.id;
    if (ED.timers[key] || ED.inflight[key] || Date.now() - (ED.recent[key] || 0) < 2500) continue;   // 이 화면에서 고치는 중이면 덮지 않음
    const v = JSON.parse(JSON.stringify(d.data() || {})); v.id = d.id;
    if (JSON.stringify(M[d.id]) !== JSON.stringify(v)){ M[d.id] = v; changed = true; }
  }
  for (const id of Object.keys(M)) if (!seen.has(id) && !ED.timers[col + '/' + id] && !ED.inflight[col + '/' + id] && Date.now() - (ED.recent[col + '/' + id] || 0) > 2500){ delete M[id]; changed = true; }
  if (!ED.got[col]){ ED.got[col] = true; if (ED.got.cast && ED.got.scen) edBoot(); return; }
  if (changed && ED.ready) edRefresh();
}
function edSave(col, id){
  const key = col + '/' + id; clearTimeout(ED.timers[key]); edStatus('저장 중…');
  ED.timers[key] = setTimeout(() => edWrite(col, id), 600);
}
async function edWrite(col, id){
  const key = col + '/' + id; delete ED.timers[key];
  if (ED.mode === 'local'){ try { localStorage.setItem('scenario-editor-v1', JSON.stringify({ cast: ED.cast, scen: ED.scen })); edStatus(); } catch (e){ edStatus('이 브라우저에 저장 못 함 (공간)'); } return; }
  while (ED.inflight[key]) await ED.inflight[key];
  const obj = (col === 'cast' ? ED.cast : ED.scen)[id];
  const p = (async () => {
    try {
      const ref = ED.db.collection(col).doc(id);
      if (!obj) await ref.delete(); else { const o = JSON.parse(JSON.stringify(obj)); delete o.id; await ref.set(o); }
      ED.recent[key] = Date.now(); edStatus();
    } catch (e){ const c = e && e.code; edStatus(c === 'quota_exceeded' ? '저장 안 됨 — 저장 공간이 찼어요' : c === 'invalid_argument' ? '저장 안 됨 — 이 화면엔 고칠 권한이 없어요' : '저장 안 됨 — 잠시 뒤 다시 고쳐 주세요'); }
  })();
  ED.inflight[key] = p; await p; delete ED.inflight[key];
}
function edStatus(msg){
  const el = $('#status'); if (!el) return;
  const busy = Object.keys(ED.timers).length || Object.keys(ED.inflight).length;
  el.textContent = msg || (busy ? '저장 중…' : ED.mode === 'db' ? '저장됨 (서버)' : '저장됨 (이 브라우저만)');
  el.classList.toggle('bad', !!msg && /안 됨|못/.test(msg));
}

/* ---------- 엔진에 넘기기 ---------- */
function edImg(url){ let im = ED.imgs[url]; if (!im){ im = ED.imgs[url] = new Image(); im.decoding = 'async'; im.src = url; } return im; }
function edEngCast(){
  const m = {};
  for (const c of Object.values(ED.cast)){
    const ex = {};
    for (const e of c.ex || []){ const url = edUrl(e); if (!url) continue; ex[e.k] = { img: edImg(url), anim: e.anim ? url : null, fw: e.anim ? e.w : e.fw, fh: e.anim ? e.h : e.fh, n: e.n, cols: e.cols, fps: e.fps, crop: e.crop ?? 1, scale: e.scale ?? 1, dx: e.dx || 0, dy: e.dy || 0, look: e.look || null }; }
    m[c.name] = { look: c.look || 'R', face: edFace(c), flip: !!c.flip, pitch: c.pitch || 520, size: c.size || 1, dx: c.dx || 0, dy: c.dy || 0, ex };
  }
  ENG.cast = m;
}
const edEngBeat = b => ({ cmds: (b.fx || []).map(f => ({ ...f })), line: b.kind === 'rest' ? null : { who: b.who || null, ex: b.ex || null, text: (b.text || '').replace(/\s*\|\s*/g, '\n') } });
// 화면에서 보는 쪽: 정해 둔 게 없으면 주인공 (기본 인주) 은 왼쪽, 나머지는 오른쪽
const edFace = c => c.face || (c.name === ((edSc() && edSc().opt && edSc().opt.주인공) || '인주') ? 'L' : 'R');
const edThumbUrl = e => e.thumbBlob ? '/_blob/' + e.thumbBlob : e.thumb || '';
// 표정 그림 작은 칸: 움짤은 첫 장으로 만든 작은 그림 (움짤을 칸마다 돌리면 무거움) · 여러 장이 붙은 그림 (움직이는 임시 그림) 은 첫 장만
const edThumb = e => edThumbUrl(e) ? `<img src="${esc(edThumbUrl(e))}" alt="" loading="lazy">` : e.n > 1 ? `<i class="sheet" style="background-image:url('${esc(edUrl(e))}');background-size:${(e.cols || e.n) * 100}% auto;background-position:0 ${e.crop ? '0' : '0'}"></i>` : `<img src="${esc(edUrl(e))}" alt="" loading="lazy">`;
function edEngScene(keep){
  const sc = edSc(), cur = engCur();
  engSetScene(sc ? sc.beats.map(edEngBeat) : [], sc ? sc.opt : {});
  if (keep && cur >= 0 && sc && cur < sc.beats.length && !ENG.taking && !ENG.busy) engJump(cur, true);
}

/* ---------- 글 대본 ↔ 카드 ---------- */
function edToText(sc){
  const L = [];
  for (const b of sc.beats){
    for (const f of b.fx || []) L.push(f.k === 'out' && f.who === '모두' ? '[퇴장 모두]' : `[${FXT[f.k]} ${f.who}${f.slot ? ' ' + f.slot : ''}${f.ex && f.k !== 'ex' ? ' ' + f.ex : f.k === 'ex' ? ' ' + (f.ex || '기본') : ''}]`);
    if (b.kind === 'rest') L.push('[멈춤]');
    else L.push(`${b.who || ''}${b.who && b.ex ? `(${b.ex})` : ''}: ${(b.text || '').replace(/\n/g, ' | ')}`);
  }
  return L.join('\n');
}
function edFromText(txt){
  const P = engParse(txt);
  return { warn: P.warn, opt: P.opt, beats: P.beats.map(b => ({ id: uid('b'), kind: b.line ? 'line' : 'rest', who: b.line ? b.line.who || '' : '', ex: b.line ? b.line.ex || '' : '', text: b.line ? b.line.text : '', fx: b.cmds })) };
}

/* ---------- 그리기: 위 띠 ---------- */
function edRenderTop(){
  const pick = $('#s-pick'), L = edScenList();
  pick.innerHTML = L.length ? L.map(s => `<option value="${esc(s.id)}"${s.id === ED.cur ? ' selected' : ''}>${esc(s.title || '이름 없음')}</option>`).join('') : '<option value="">시나리오 없음</option>';
  const sc = edSc(); $('#s-title').value = sc ? sc.title || '' : ''; $('#s-title').disabled = !sc;
  for (const a of ['sdup', 'sdel', 'play', 'rec', 'exp']) $(`[data-act="${a}"]`).disabled = !sc || (a !== 'sdup' && a !== 'sdel' && (ENG.taking || ENG.busy));
  $('[data-act="sdel"]').textContent = ED.armed === 'sdel' ? '정말 지울까요?' : '지우기';
  $('#recbadge').hidden = !ENG.taking; $('#recbadge').textContent = '● 녹화 중 — Space 박자 기록';
}

/* ---------- 그리기: 대사 카드 ---------- */
function edWhoOptions(b, i){
  const names = edCastList().map(c => c.name), w = b.who || '';
  let h = names.map(n => `<option value="${esc(n)}"${n === w ? ' selected' : ''}>${esc(n)}</option>`).join('');
  h += `<option value=""${!w ? ' selected' : ''}>나레이션</option>`;
  if (w && !names.includes(w)) h += `<option value="${esc(w)}" selected>${esc(w)} (그림 없음)</option>`;
  return h + '<option value="__custom">직접 쓰기…</option>';
}
function edCardHtml(b, i, cur){
  const c = b.kind === 'line' && b.who ? edByName(b.who) : null;
  let h = `<div class="card${i === cur ? ' play' : ''}${b.kind === 'rest' ? ' rest' : ''}" data-i="${i}">
    <div class="c-head"><span class="grip" draggable="true" title="끌어서 순서 바꾸기">⋮⋮</span><b class="num">${i + 1}</b>`;
  if (b.kind === 'rest') h += `<span class="rest-t">멈춤</span>`;
  else if (ED.customWho === i) h += `<input class="whoin" value="${esc(b.who)}" placeholder="이름 (그림 없이 목소리만)">`;
  else h += `<select class="who" aria-label="말하는 사람">${edWhoOptions(b, i)}</select>`;
  h += `<span class="tools"><button data-act="up" title="위로">↑</button><button data-act="down" title="아래로">↓</button><button data-act="dup" title="복제">복제</button><button data-act="del" title="지우기" class="${ED.armed === 'del' + i ? 'armed' : ''}">${ED.armed === 'del' + i ? '지울까요?' : '✕'}</button></span></div>`;
  if (c && (c.ex || []).length) h += `<div class="exs"><button class="exb keep${!b.ex ? ' on' : ''}" data-ex="">그대로</button>${c.ex.map(e => `<button class="exb${b.ex === e.k ? ' on' : ''}" data-ex="${esc(e.k)}" title="${esc(e.k)}">${edThumb(e)}<span>${esc(e.k)}</span></button>`).join('')}</div>`;
  if (b.kind === 'line') h += `<textarea class="txt" rows="2" placeholder="${b.who ? '대사 (Enter = 줄 바꿈)' : '나레이션'}">${esc(b.text)}</textarea>`;
  else h += `<p class="rest-note">대사창 없이 한 박자 쉼 — 등장 · 퇴장만 보여 줄 때</p>`;
  // v1.2 모션 줄: 그 카드 인물의 모션을 눌러 켜고 끔
  const sc = edSc(), mw = sc && edCastList().length ? edMotWho(sc, i) : '', spk = b.kind === 'line' && b.who === mw;
  if (mw) h += `<div class="mots">${spk ? `<span class="mlab">${esc(mw)}${edFlipped(sc, i, mw) ? ' <i class="flipd">↔ 반전 중</i>' : ''}</span>` : `<select class="mwho" aria-label="모션 줄 인물">${edCastList().map(c2 => `<option${c2.name === mw ? ' selected' : ''}>${esc(c2.name)}</option>`).join('')}</select>${edFlipped(sc, i, mw) ? '<i class="flipd">↔ 반전 중</i>' : ''}`}${MOTS.map(([k, l]) => `<button class="mot${(b.fx || []).some(f => f.k === k && f.who === mw) ? ' on' : ''}" data-mot="${k}" aria-pressed="${(b.fx || []).some(f => f.k === k && f.who === mw)}">${l}</button>`).join('')}</div>`;
  const other = (b.fx || []).map((f, j) => [f, j]).filter(([f]) => !(MOTK.has(f.k) && f.who === mw));
  h += `<div class="fxs">${other.map(([f, j]) => `<span class="fx">${esc(f.k === 'out' && f.who === '모두' ? '모두 퇴장' : `${FXK[f.k]} ${f.who}${f.slot ? ' · ' + f.slot : ''}${f.ex ? ' · ' + f.ex : ''}`)}<button data-fxdel="${j}" title="빼기">✕</button></span>`).join('')}<button class="addfx" data-act="fx">+ 등장 자리 · 이동 · 다른 인물</button></div>`;
  if (ED.fxOpen === i){
    const names = edCastList().map(c2 => c2.name), first = mw || names[0] || '';
    h += `<div class="fxform"><select class="fk">${Object.entries(FXK).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}<option value="outall">모두 퇴장</option></select>
      <select class="fw">${names.map(n => `<option${n === first ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select>
      <select class="fs"><option value="">자리 (저절로)</option>${SLOTS.map(s => `<option>${s}</option>`).join('')}</select>
      <select class="fe"><option value="">표정 (그대로)</option>${((edByName(first) || {}).ex || []).map(e => `<option>${esc(e.k)}</option>`).join('')}</select>
      <button data-act="fxadd" class="primary">넣기</button><button data-act="fxclose">닫기</button></div>`;
  }
  return h + '</div>';
}
function edRenderBeats(){
  const box = $('#beats'), sc = edSc();
  if (!sc){ box.innerHTML = `<div class="empty"><b>시나리오가 없어요</b><p>위의 ＋ 새 시나리오로 시작해요. 대사 카드 한 장이 Space 한 번이에요.</p></div>`; return; }
  if (ED.textMode){
    box.innerHTML = `<div class="textmode"><p class="tip">글로 고친 뒤 '카드로 적용' 을 누르면 카드가 이 글로 바뀌어요. 쓰는 법은 오른쪽 '쓰는 법'</p><textarea id="t-all" spellcheck="false">${esc(edToText(sc))}</textarea><div id="t-warn" class="warn-t"></div>
      <div class="row"><button data-act="tapply" class="primary">카드로 적용</button><button data-act="tclose">카드로 돌아가기</button></div></div>`;
    return;
  }
  const cur = engCur();
  box.innerHTML = (sc.beats.length ? sc.beats.map((b, i) => edCardHtml(b, i, cur)).join('') : `<div class="empty"><b>아직 대사가 없어요</b><p>아래 + 대사로 첫 줄을 써요. 처음 말하는 인물은 저절로 등장해요.</p></div>`)
    + `<div class="addrow"><button data-act="addline" class="primary">+ 대사</button><button data-act="addrest">+ 멈춤</button><button data-act="text">글로 보기</button></div>`;
}
function edMarkPlay(cur){
  document.querySelectorAll('#beats .card').forEach(el => el.classList.toggle('play', +el.dataset.i === cur));
  const el = document.querySelector(`#beats .card[data-i="${cur}"]`); if (el && !ED.textMode && document.activeElement && !el.contains(document.activeElement)) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ---------- 그리기: 오른쪽 (인물 · 설정 · 쓰는 법) ---------- */
function edRenderSide(){
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === ED.tab));
  const box = $('#sidebody');
  if (ED.tab === 'cast') box.innerHTML = edCastHtml();
  else if (ED.tab === 'opt') box.innerHTML = edOptHtml();
  else box.innerHTML = edHelpHtml();
}
const rng = (id, label, v, min, max, step, unit = '') => `<label class="rng"><span>${label}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"><output for="${id}">${v}${unit}</output></label>`;
function edCastHtml(){
  const L = edCastList(), c = ED.cast[ED.castSel];
  let h = `<div class="castbar">${L.map(x => `<button class="chip${x.id === ED.castSel ? ' on' : ''}" data-cast="${esc(x.id)}">${x.ex && x.ex[0] && (edThumbUrl(x.ex[0]) || !(x.ex[0].n > 1)) ? `<img src="${esc(edThumbUrl(x.ex[0]) || edUrl(x.ex[0]))}" alt="">` : ''}${esc(x.name)}</button>`).join('')}<button class="chip add" data-act="castadd">+ 인물</button></div>`;
  if (!L.length) return h + `<div class="empty"><b>인물이 없어요</b><p>+ 인물로 만들고 표정 그림을 넣어요.</p></div>`;
  if (!c) return h + `<p class="tip">인물을 고르면 이름 · 보는 쪽 · 전자음 · 크기와 표정 그림을 고칠 수 있어요.</p>`;
  const e = (c.ex || []).find(x => x.k === ED.exSel);
  h += `<div class="cform">
    <label class="txtf"><span>이름</span><input id="c-name" value="${esc(c.name)}"></label>
    <div class="row seg"><span>기본 좌우반전</span><button data-cflip="0" class="${!c.flip ? 'on' : ''}">그대로</button><button data-cflip="1" class="${c.flip ? 'on' : ''}">↔ 반전</button></div>
    <p class="tip">모든 장면에서 이 인물을 좌우로 뒤집어 세워요. 한 장면만 돌려 세우려면 카드의 ‘↔ 좌우반전’.</p>
    <details class="more"><summary>방향 자세히</summary>
    <div class="row seg"><span>화면에서 보는 쪽</span><button data-face="L" class="${edFace(c) === 'L' ? 'on' : ''}">← 왼쪽</button><button data-face="R" class="${edFace(c) === 'R' ? 'on' : ''}">오른쪽 →</button><button data-face="auto" class="${edFace(c) === 'auto' ? 'on' : ''}">가운데 쪽</button></div>
    <div class="row seg"><span>그림 속 인물이 보는 쪽</span><button data-look="R" class="${(c.look || 'R') === 'R' ? 'on' : ''}">오른쪽 →</button><button data-look="L" class="${c.look === 'L' ? 'on' : ''}">← 왼쪽</button></div>
    <p class="tip">그림이 보는 쪽과 화면에서 보는 쪽이 다르면 뒤집고, 기본 좌우반전이 켜져 있으면 한 번 더 뒤집어요. ‘가운데 쪽’ 은 자리에 따라 저절로.</p></details>
    <div class="row">${rng('c-pitch', '전자음 높이', c.pitch || 520, 150, 1200, 10, 'Hz')}<button data-act="pitchplay" title="들어 보기">▶</button></div>
    ${rng('c-size', '크기', c.size || 1, 0.4, 2.5, 0.01)}${rng('c-dx', '옆', c.dx || 0, -600, 600, 1)}${rng('c-dy', '위아래', c.dy || 0, -600, 600, 1)}
    <h4>표정 그림 <small>(앞의 것이 기본)</small></h4>
    <div class="exgrid">${(c.ex || []).map(x => `<button class="ext${x.k === ED.exSel ? ' on' : ''}" data-exsel="${esc(x.k)}">${edThumb(x)}<span>${esc(x.k)}${x.tmp ? ' (임시)' : ''}${x.anim ? ' ▶' : ''}</span></button>`).join('')}
      <button class="ext add" data-act="expick"><b>+</b><span>그림 넣기</span></button></div>
    <p class="tip">파일을 이 칸에 끌어다 놓아도 돼요. 파일 이름이 표정 이름 (예: 놀람.png · 모닝스타_놀람.png)</p>`;
  if (e) h += `<div class="exform"><h4>‘${esc(e.k)}’ 그림</h4>
    <label class="txtf"><span>표정 이름</span><input id="e-name" value="${esc(e.k)}"></label>
    ${rng('e-scale', '이 그림 크기', e.scale ?? 1, 0.3, 2.5, 0.01)}${rng('e-dx', '옆', e.dx || 0, -600, 600, 1)}${rng('e-dy', '위아래', e.dy || 0, -600, 600, 1)}${rng('e-crop', '아래 자르기 (보일 비율)', e.crop ?? 1, 0.3, 1, 0.01)}
    <div class="row seg"><span>보는 쪽</span><button data-elook="" class="${!e.look ? 'on' : ''}">인물 따라</button><button data-elook="R" class="${e.look === 'R' ? 'on' : ''}">오른쪽</button><button data-elook="L" class="${e.look === 'L' ? 'on' : ''}">왼쪽</button></div>
    <div class="row"><button data-act="exfirst">기본으로 (맨 앞)</button>${e.anim ? `<span class="tip">움짤 ${e.w} × ${e.h}${e.frames ? ` · ${e.frames}장` : ''}</span>` : '<button data-act="exwb">흰 바탕 지우기…</button>'}<button data-act="exdel" class="warn${ED.armed === 'exdel' ? ' armed' : ''}">${ED.armed === 'exdel' ? '정말 뺄까요?' : '이 그림 빼기'}</button></div>
    <p class="tip">미리보기에서 그림을 끌면 옮겨지고, 휠로 크기가 바뀌어요.</p></div>`;
  h += `<div class="row end"><button data-act="castdel" class="warn${ED.armed === 'castdel' ? ' armed' : ''}">${ED.armed === 'castdel' ? '정말 지울까요? (대사는 남음)' : '인물 지우기'}</button></div></div>`;
  return h;
}
const SHADOWS = [['글자그림자', '글자'], ['이름그림자', '이름'], ['창그림자', '대사창'], ['인물그림자', '인물']];
function edShadowRow(key, label, v){
  const on = !!v, s = v || [0, 4, 8, 'rgba(0,0,0,0.5)'], m = /rgba?\(([^)]+)\)/.exec(s[3]) || [], p = (m[1] || '0,0,0,0.5').split(',').map(x => x.trim());
  const hex = '#' + p.slice(0, 3).map(x => Math.max(0, Math.min(255, +x || 0)).toString(16).padStart(2, '0')).join(''), a = p[3] != null ? +p[3] : 1;
  return `<div class="shrow" data-sh="${key}"><label class="chk"><input type="checkbox" class="sh-on"${on ? ' checked' : ''}> ${label}</label>
    <label>옆<input type="number" class="sh-x" value="${s[0]}"></label><label>아래<input type="number" class="sh-y" value="${s[1]}"></label><label>번짐<input type="number" class="sh-b" value="${s[2]}" min="0"></label>
    <label>색<input type="color" class="sh-c" value="${hex}"></label><label>진하기<input type="range" class="sh-a" min="0" max="1" step="0.05" value="${a}"></label></div>`;
}
function edOptHtml(){
  const sc = edSc(); if (!sc) return `<div class="empty"><b>시나리오를 먼저 골라요</b></div>`;
  const o = Object.assign(ENG_OPT0(), sc.opt || {}), names = edCastList().map(c => c.name);
  return `<div class="oform"><p class="tip">이 시나리오에만 적용돼요.</p>
    ${rng('o-속도', '글자 속도 (글자/초)', o.속도, 5, 80, 1)}${rng('o-어둡기', '말 안 하는 인물 밝기', o.어둡기, 0.1, 1, 0.01)}
    <label class="txtf"><span>글자 크기</span><select id="o-글자크기">${[36, 48, 60].map(n => `<option${o.글자크기 === n ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
    ${rng('o-줄간격', '줄 간격', o.줄간격, 36, 90, 1)}
    <div class="row"><label class="txtf"><span>글자 색</span><input type="color" id="o-글자색" value="${esc(o.글자색)}"></label><label class="txtf"><span>이름 색</span><input type="color" id="o-이름색" value="${esc(o.이름색)}"></label></div>
    <h4>그림자</h4>${SHADOWS.map(([k, l]) => edShadowRow(k, l, o[k])).join('')}
    <h4>소리 · 등장</h4>
    <label class="chk"><input type="checkbox" id="o-소리"${o.소리 ? ' checked' : ''}> 글자 전자음</label>${rng('o-소리크기', '소리 크기', o.소리크기, 0, 1, 0.05)}
    <label class="txtf"><span>주인공 (기본 오른쪽)</span><select id="o-주인공">${names.map(n => `<option${o.주인공 === n ? ' selected' : ''}>${esc(n)}</option>`).join('')}${names.includes(o.주인공) ? '' : `<option selected>${esc(o.주인공)}</option>`}</select></label>
    ${rng('o-인물크기', '인물 크기 (모두)', o.인물크기, 0.5, 2, 0.01)}${rng('o-등장', '등장 시간 (초)', o.등장, 0.1, 1.5, 0.05)}${rng('o-퇴장', '퇴장 시간 (초)', o.퇴장, 0.1, 1.5, 0.05)}
    <label class="txtf"><span>녹화 프레임</span><select id="o-녹화fps"><option${o.녹화fps === 30 ? ' selected' : ''}>30</option><option${o.녹화fps === 60 ? ' selected' : ''}>60</option></select></label></div>`;
}
function edHelpHtml(){
  return `<div class="help"><h4>키</h4><p>Space · → · Enter · 미리보기 누르기 = 다음 (글이 찍히는 중이면 한 번에)<br>← · Backspace = 한 박자 뒤로 · R = 처음부터 · Esc = 녹화 멈춤</p>
    <h4>카드</h4><p>카드를 누르면 미리보기가 그 장면으로 가요. ⋮⋮ 를 끌어 순서를 바꿔요. 표정은 그 인물에게 있는 그림만 보여요 ('그대로' = 앞 장면 표정 유지).</p>
    <h4>모션</h4><p>카드 아래 단추를 누르면 그 카드 인물에게 켜지고, 다시 누르면 꺼져요. 누르면 바로 미리보기로 보여 줘요. ⇤ 가장자리로는 그 인물이 서 있는 쪽 화면 끝으로 걸어가 가운데를 비우고, 제자리로는 처음 선 자리로 돌아와요. 깡충 · 두 번 깡충 · 흔들 · 꾸벅 · 쿵은 박자가 시작될 때 한 번, 덜덜은 그 박자 내내, 퇴장은 대사가 다 나온 뒤 나가요. ↔ 좌우반전은 그 카드부터 반대로 돌아서고 (둘이 마주 볼 때), 뒤 카드에서 한 번 더 넣으면 원래대로 — 반전 중이면 이름 옆에 ‘↔ 반전 중’.</p><p>인물을 늘 뒤집어 세우려면 인물 칸의 ‘기본 좌우반전’. 나레이션 · 멈춤 카드는 단추 앞에서 인물을 골라요. 무대에 없는 인물에게 모션을 주면 저절로 등장해요. 등장 자리 · 이동 · 다른 인물 모션은 '+ 등장 자리 · 이동 · 다른 인물'.</p>
    <h4>녹화 · 내보내기</h4><p>● 녹화는 빈 화면에서 시작해 Space 로 진행하며 박자 (누른 때) 만 적어 둬요. 마지막 대사 뒤 Space (또는 Esc) 로 끝나면 내보내기 창이 떠요. 파일은 그 박자대로 한 장씩 다시 그려 만들어서 끊기지 않아요. 녹화 없이 ⬇ 내보내기를 누르면 자동 박자 (글이 다 나온 뒤 몇 초 쉬고 다음).</p>
    <p>MP4 — 에펙에 바로, 전자음 포함. 투명이 안 돼서 바탕 색을 깔아요 (초록이면 Keylight 로 빼요).<br>PNG 묶음 (.zip) — 투명 그대로, 에펙에서 가장 깔끔. 파일 > 가져오기 > 첫 장 고르고 'PNG 시퀀스' 체크. 전자음은 sound.wav.<br>GIF — 투명 (가장자리가 조금 계단져요), 소리 없음.</p>
    <h4>글로 보기</h4><pre>이름: 대사          이름(표정): 대사
: 나레이션           | = 줄 바꿈
[등장 이름 자리 표정]  [퇴장 이름] · [퇴장 모두]
[표정 이름 표정]     [이동 이름 자리]
[깡충 이름] · [두번깡충 이름] · [흔들 이름]
[덜덜 이름] · [꾸벅 이름] · [쿵 이름] · [좌우반전 이름] · [멈춤]
설정 속도 30 …       (설정 칸과 같음)
[가장자리로 이름] · [제자리로 이름]
자리: 왼쪽끝 · 왼쪽 · 왼쪽2 · 가운데 · 오른쪽2 · 오른쪽 · 오른쪽끝</pre>
    <h4>저장</h4><p>${ED.mode === 'db' ? '고칠 때마다 서버에 저장돼요. 다른 기기에서 열어도 같고, Claude 도 읽고 고칠 수 있어요.' : '이 화면은 서버 저장소가 없어 이 브라우저에만 저장돼요.'}</p></div>`;
}
function edRefresh(){ edEngCast(); edEngScene(true); edRenderTop(); edRenderBeats(); edRenderSide(); edInspect(); }
// 인물 칸에서 인물 · 표정을 고르면 미리보기에 그 인물만
function edInspect(on){
  const c = ED.cast[ED.castSel];
  if (on === false || ED.tab !== 'cast' || !c || ENG.taking || ENG.busy){ ENG.inspect = null; return; }
  if (on === true || ENG.inspect) ENG.inspect = { nm: c.name, ex: ED.exSel || (c.ex && c.ex[0] && c.ex[0].k) || '기본' };
}

/* ---------- 고치기: 시나리오 ---------- */
function edNewScen(){
  const id = uid('s'), order = Math.max(-1, ...edScenList().map(s => s.order ?? 0)) + 1;
  ED.scen[id] = { id, title: `새 시나리오 ${order + 1}`, order, updated: Date.now(), opt: {}, beats: [] };
  ED.cur = id; edSave('scen', id); edAfterScen();
}
function edAfterScen(){ try { localStorage.setItem('scenario-cur-v1', ED.cur || ''); } catch (e) {} ED.fxOpen = -1; ED.customWho = -1; edEngScene(); engReset(0, false); edRenderTop(); edRenderBeats(); edRenderSide(); }
function edTouch(){ const sc = edSc(); if (!sc) return; sc.updated = Date.now(); edSave('scen', sc.id); }
function edBeatChanged(i, rerender){ edTouch(); edEngScene(); if (i != null && i >= 0) { ED.armed = null; engJump(i, true); } if (rerender) edRenderBeats(); }
function edAddBeat(kind){
  const sc = edSc(); if (!sc) return; const cur = engCur(), at = cur >= 0 && cur < sc.beats.length ? cur + 1 : sc.beats.length;
  const prev = sc.beats[at - 1], prev2 = sc.beats[at - 2], who = kind === 'line' ? (prev2 && prev2.kind === 'line' && prev2.who !== (prev && prev.who) ? prev2.who : prev && prev.kind === 'line' ? prev.who : (edCastList()[0] || {}).name || '') : '';
  sc.beats.splice(at, 0, { id: uid('b'), kind, who, ex: '', text: '', fx: [] });
  edBeatChanged(at, true); const ta = document.querySelector(`#beats .card[data-i="${at}"] .txt`); if (ta) ta.focus();
}

/* ---------- 고치기: 인물 ---------- */
function edRenameCast(c, nm){
  nm = nm.trim(); if (!nm || nm === c.name) return false;
  if (edByName(nm)){ edStatus(`'${nm}' 은 이미 있어요`); return false; }
  const old = c.name; c.name = nm; edSave('cast', c.id);
  for (const sc of Object.values(ED.scen)){
    let ch = false;
    for (const b of sc.beats || []){ if (b.who === old){ b.who = nm; ch = true; } for (const f of b.fx || []) if (f.who === old){ f.who = nm; ch = true; } }
    if (sc.opt && sc.opt.주인공 === old){ sc.opt.주인공 = nm; ch = true; }
    if (ch){ sc.updated = Date.now(); edSave('scen', sc.id); }
  }
  return true;
}
// 움짤인지 (장 수 2 이상) · 크기 · 첫 장으로 만든 작은 그림. ImageDecoder 가 없으면 보통 그림으로
async function edAnimInfo(f){
  if (typeof ImageDecoder === 'undefined' || !/^image\/(webp|gif|png)$/.test(f.type)) return null;
  try {
    const d = new ImageDecoder({ data: await f.arrayBuffer(), type: f.type }); await d.tracks.ready;
    const n = d.tracks.selectedTrack.frameCount; if (n < 2){ d.close(); return null; }
    const { image } = await d.decode({ frameIndex: 0 }), w = image.displayWidth, h = image.displayHeight, th = 300, cv = document.createElement('canvas');
    cv.height = th; cv.width = Math.max(1, Math.round(w * th / h)); cv.getContext('2d').drawImage(image, 0, 0, cv.width, th); image.close(); d.close();
    const thumb = await new Promise(r => cv.toBlob(r, 'image/webp', 0.85));
    return { n, w, h, thumb };
  } catch (e){ return null; }
}
async function edAddImages(files){
  const c = ED.cast[ED.castSel]; if (!c){ edStatus('먼저 오른쪽에서 인물을 골라요'); return; }
  const imgs = [...files].filter(f => /^image\//.test(f.type)); if (!imgs.length) return;
  if (ED.mode === 'db' && !ED.assets){ edStatus('그림 넣기는 이 아티팩트를 고칠 수 있는 사람만 돼요'); return; }
  let n = 0;
  for (const f of imgs){
    let k = f.name.replace(/\.[^.]+$/, '').trim(); const i = k.indexOf('_'); if (i > 0 && (k.slice(0, i) === c.name || edByName(k.slice(0, i)))) k = k.slice(i + 1).trim();
    if (!k) k = '기본'; let k2 = k, m = 2; while ((c.ex || []).some(x => x.k === k2)) k2 = `${k} ${m++}`;
    const e = { k: k2, crop: 1, scale: 1, dx: 0, dy: 0 };
    edStatus(`그림 올리는 중… (${n + 1}/${imgs.length})`);
    const an = await edAnimInfo(f); if (an){ e.anim = true; e.w = an.w; e.h = an.h; e.frames = an.n; }
    if (ED.assets){ try { const r = await ED.assets.upload(f, /^image\/(png|jpeg|gif|webp)$/.test(f.type) ? undefined : { type: 'image/png' }); e.blob = r.id; if (an && an.thumb){ try { e.thumbBlob = (await ED.assets.upload(an.thumb)).id; } catch (er) {} } } catch (er){ edStatus(er && er.code === 'too_large' ? '그림이 20MB 를 넘어요' : er && er.code === 'quota_or_state' ? '보관함이 찼어요' : '그림을 못 올렸어요 — 다시 해 주세요'); continue; } }
    else { e.src = URL.createObjectURL(f); e.local = true; if (an && an.thumb) e.thumb = URL.createObjectURL(an.thumb); }
    (c.ex = c.ex || []).push(e); n++; ED.exSel = e.k;
  }
  if (n){ edSave('cast', c.id); edEngCast(); edRenderSide(); edRenderBeats(); edInspect(true); if (!ED.assets) edStatus('이 화면에선 그림이 저장되지 않아요 (새로 고치면 사라짐)'); }
}

/* ---------- 흰 바탕 지우기 창 ---------- */
function edWbOpen(){
  const c = ED.cast[ED.castSel], e = c && (c.ex || []).find(x => x.k === ED.exSel); if (!e) return;
  const url = e.orig ? edUrl(e.orig) : edUrl(e), im = new Image();
  ED.wb = { c, e, im, seeds: [], keeps: [], hist: [], tool: 'erase', out: null };
  $('#wbdlg').hidden = false; $('#wb-title').textContent = `흰 바탕 지우기 — ${c.name} · ${e.k}${e.orig ? ' (원본에서 다시)' : ''}`; edWbUi();
  im.onload = () => edWbRun(); im.onerror = () => { $('#wb-note').textContent = '그림을 못 읽었어요'; }; im.src = url;
}
function edWbUi(){ const W = ED.wb; if (!W) return; document.querySelectorAll('[data-wb="erase"],[data-wb="keep"]').forEach(b => b.classList.toggle('on', b.dataset.wb === W.tool)); $('#wb-n').textContent = `누른 곳: 지우기 ${W.seeds.length} · 되살리기 ${W.keeps.length}`; }
function edWbRun(){
  const W = ED.wb; if (!W || !W.im.naturalWidth) return; clearTimeout(W.tm);
  W.tm = setTimeout(() => {
    const t0 = performance.now();
    try { W.out = wbRemove(W.im, { tol: +$('#wb-tol').value, holes: $('#wb-holes').checked, edges: $('#wb-bottom').checked ? 'tlrb' : 'tlr', seeds: W.seeds, keeps: W.keeps }); } catch (er){ $('#wb-note').textContent = '이 그림은 여기서 고칠 수 없어요 (읽기 막힘)'; return; }
    const cv = $('#wbcv'); cv.width = W.out.width; cv.height = W.out.height; cv.getContext('2d').drawImage(W.out, 0, 0);
    $('#wb-note').textContent = `${W.out.width} × ${W.out.height} · ${Math.round(performance.now() - t0)}ms`;
  }, 60);
}
async function edWbApply(){
  const W = ED.wb; if (!W || !W.out) return; const b = $('[data-wb="apply"]'); b.disabled = true; b.textContent = '올리는 중…';
  try {
    const blob = await new Promise(r => W.out.toBlob(r, 'image/webp', 0.95));
    if (!W.e.orig) W.e.orig = W.e.blob ? { blob: W.e.blob } : { src: W.e.src };
    if (ED.assets){ const r = await ED.assets.upload(blob); W.e.blob = r.id; delete W.e.src; }
    else { W.e.src = URL.createObjectURL(blob); delete W.e.blob; W.e.local = true; }
    delete W.e.tmp; edSave('cast', W.c.id); edEngCast(); edWbClose(); edRenderSide(); edRenderBeats(); edInspect(true); edStatus('흰 바탕을 지웠어요');
  } catch (er){ $('#wb-note').textContent = '못 올렸어요 — ' + (er && er.code === 'quota_or_state' ? '보관함이 찼어요' : '다시 해 주세요'); }
  b.disabled = false; b.textContent = '적용';
}
function edWbClose(){ ED.wb = null; $('#wbdlg').hidden = true; }

/* ---------- 이벤트 ---------- */
function edBind(){
  // 위 띠
  $('#top').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; engAudio(); const a = b.dataset.act;
    if (a === 'snew') edNewScen();
    else if (a === 'sdup'){ const sc = edSc(); if (!sc) return; const id = uid('s'), o = JSON.parse(JSON.stringify(sc)); o.id = id; o.title = (sc.title || '') + ' 복사'; o.order = Math.max(...edScenList().map(s => s.order ?? 0)) + 1; o.updated = Date.now(); ED.scen[id] = o; ED.cur = id; edSave('scen', id); edAfterScen(); }
    else if (a === 'sdel'){ if (ED.armed !== 'sdel'){ ED.armed = 'sdel'; edRenderTop(); setTimeout(() => { if (ED.armed === 'sdel'){ ED.armed = null; edRenderTop(); } }, 3500); return; } ED.armed = null; const id = ED.cur; delete ED.scen[id]; edSave('scen', id); ED.cur = (edScenList()[0] || {}).id || null; edAfterScen(); }
    else if (a === 'play'){ edInspect(false); engReset(0, false); engHint('Space 로 시작'); }
    else if (a === 'rec'){ edInspect(false); edEngScene(); engTakeStart(); edRenderTop(); }
    else if (a === 'exp') edExpOpen();
  });
  $('#s-pick').addEventListener('change', e => { ED.cur = e.target.value || null; edAfterScen(); });
  $('#s-title').addEventListener('input', e => { const sc = edSc(); if (!sc) return; sc.title = e.target.value; edTouch(); clearTimeout(ED.titleTm); ED.titleTm = setTimeout(() => { const o = $('#s-pick').selectedOptions[0]; if (o) o.textContent = sc.title || '이름 없음'; }, 200); });
  $('#bg-pick').addEventListener('change', e => { ED.bg = e.target.value; $('#cv').className = 'bg-' + ED.bg; try { localStorage.setItem('scenario-bg-v1', ED.bg); } catch (er) {} });
  // 카드
  const beats = $('#beats');
  beats.addEventListener('click', e => {
    const sc = edSc(); if (!sc) return; engAudio();
    const card = e.target.closest('.card'), b = e.target.closest('button'), i = card ? +card.dataset.i : -1, bt = sc.beats[i];
    if (b){
      const a = b.dataset.act;
      if (a === 'addline') return edAddBeat('line');
      if (a === 'addrest') return edAddBeat('rest');
      if (a === 'text'){ ED.textMode = true; edRenderBeats(); return; }
      if (a === 'tclose'){ ED.textMode = false; edRenderBeats(); return; }
      if (a === 'tapply'){ const r = edFromText($('#t-all').value); if (r.warn.length){ $('#t-warn').textContent = r.warn.join('\n') + '\n(나머지는 적용함)'; } sc.beats = r.beats; sc.opt = Object.assign(sc.opt || {}, r.opt); edTouch(); edEngScene(); engReset(0, false); if (!r.warn.length){ ED.textMode = false; } edRenderBeats(); edRenderSide(); return; }
      if (!bt) return;
      if (a === 'up' && i > 0){ sc.beats.splice(i - 1, 0, sc.beats.splice(i, 1)[0]); return edBeatChanged(i - 1, true); }
      if (a === 'down' && i < sc.beats.length - 1){ sc.beats.splice(i + 1, 0, sc.beats.splice(i, 1)[0]); return edBeatChanged(i + 1, true); }
      if (a === 'dup'){ const o = JSON.parse(JSON.stringify(bt)); o.id = uid('b'); sc.beats.splice(i + 1, 0, o); return edBeatChanged(i + 1, true); }
      if (a === 'del'){ if (ED.armed !== 'del' + i){ ED.armed = 'del' + i; edRenderBeats(); setTimeout(() => { if (ED.armed === 'del' + i){ ED.armed = null; edRenderBeats(); } }, 3000); return; } ED.armed = null; sc.beats.splice(i, 1); return edBeatChanged(Math.min(i, sc.beats.length - 1), true); }
      if (a === 'fx'){ ED.fxOpen = ED.fxOpen === i ? -1 : i; edRenderBeats(); return; }
      if (a === 'fxclose'){ ED.fxOpen = -1; edRenderBeats(); return; }
      if (a === 'fxadd'){
        const f = card.querySelector('.fxform'), k = f.querySelector('.fk').value, who = f.querySelector('.fw').value, slot = f.querySelector('.fs').value, ex = f.querySelector('.fe').value;
        const fx = k === 'outall' ? { k: 'out', who: '모두' } : { k, who }; if ((k === 'in' || k === 'move') && slot) fx.slot = slot; if (k === 'move' && !slot) fx.slot = '가운데'; if ((k === 'in' || k === 'ex') && ex) fx.ex = ex; if (k === 'ex' && !ex) fx.ex = '기본';
        (bt.fx = bt.fx || []).push(fx); ED.fxOpen = -1; return edBeatChanged(i, true);
      }
      if (b.dataset.fxdel != null){ bt.fx.splice(+b.dataset.fxdel, 1); return edBeatChanged(i, true); }
      if (b.dataset.mot){ const k = b.dataset.mot, mw = edMotWho(sc, i), j = (bt.fx = bt.fx || []).findIndex(f => f.k === k && f.who === mw); if (j >= 0) bt.fx.splice(j, 1); else bt.fx.push({ k, who: mw }); return edBeatChanged(i, true); }
      if (b.dataset.ex != null){ bt.ex = b.dataset.ex; return edBeatChanged(i, true); }
      return;
    }
    if (card && !e.target.closest('textarea,select,input')){ edInspect(false); engJump(i, true); edMarkPlay(i); }
  });
  beats.addEventListener('input', e => {
    const sc = edSc(), card = e.target.closest('.card'); if (!sc || !card) return; const i = +card.dataset.i, bt = sc.beats[i];
    if (e.target.classList.contains('txt')){ bt.text = e.target.value; edInspect(false); edTouch(); edEngScene(); engJump(i, true); edMarkPlay(i); }
    else if (e.target.classList.contains('whoin')){ bt.who = e.target.value; edTouch(); edEngScene(); engJump(i, true); }
  });
  beats.addEventListener('change', e => {
    const sc = edSc(), card = e.target.closest('.card'); if (!sc || !card) return; const i = +card.dataset.i, bt = sc.beats[i];
    if (e.target.classList.contains('who')){ if (e.target.value === '__custom'){ ED.customWho = i; edRenderBeats(); const inp = card.parentNode.querySelector(`.card[data-i="${i}"] .whoin`); if (inp){ inp.focus(); inp.select(); } return; } const old = bt.who, nw = e.target.value; if (old && nw && edByName(nw)) for (const f of bt.fx || []) if (MOTK.has(f.k) && f.who === old) f.who = nw; bt.who = nw; bt.ex = ''; edBeatChanged(i, true); }   // v1.2 말하는 사람을 바꾸면 모션도 따라감
    else if (e.target.classList.contains('mwho')){ bt.mwho = e.target.value; edBeatChanged(i, true); }
    else if (e.target.classList.contains('fw')){ const c = edByName(e.target.value), fe = card.querySelector('.fe'); fe.innerHTML = '<option value="">표정 (그대로)</option>' + ((c && c.ex) || []).map(x => `<option>${esc(x.k)}</option>`).join(''); }
  });
  beats.addEventListener('focusout', e => { if (e.target.classList.contains('whoin')){ ED.customWho = -1; setTimeout(edRenderBeats, 0); } });
  beats.addEventListener('keydown', e => { if (e.target.classList.contains('whoin') && e.key === 'Enter'){ e.preventDefault(); e.target.blur(); } });
  // 끌어서 순서 바꾸기
  beats.addEventListener('dragstart', e => { const card = e.target.closest('.card'); if (!card || !e.target.classList.contains('grip')){ e.preventDefault(); return; } ED.drag = +card.dataset.i; card.classList.add('dragging'); try { e.dataTransfer.setData('text/plain', String(ED.drag)); e.dataTransfer.effectAllowed = 'move'; } catch (er) {} });
  beats.addEventListener('dragover', e => { if (ED.drag < 0) return; const card = e.target.closest('.card'); if (!card) return; e.preventDefault(); document.querySelectorAll('#beats .card').forEach(c => c.classList.toggle('dropto', c === card)); });
  beats.addEventListener('drop', e => { if (ED.drag < 0) return; e.preventDefault(); const card = e.target.closest('.card'), sc = edSc(); if (card && sc){ const to = +card.dataset.i, from = ED.drag; if (to !== from){ sc.beats.splice(to, 0, sc.beats.splice(from, 1)[0]); ED.drag = -1; return edBeatChanged(to, true); } } ED.drag = -1; edRenderBeats(); });
  beats.addEventListener('dragend', () => { ED.drag = -1; document.querySelectorAll('#beats .card').forEach(c => c.classList.remove('dropto', 'dragging')); });
  // 오른쪽
  $('#tabs').addEventListener('click', e => { const b = e.target.closest('button[data-tab]'); if (!b) return; ED.tab = b.dataset.tab; edRenderSide(); edInspect(ED.tab === 'cast' && !!ED.castSel); });
  const side = $('#sidebody');
  side.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; engAudio();
    const c = ED.cast[ED.castSel], a = b.dataset.act;
    if (b.dataset.cast){ ED.castSel = b.dataset.cast; const c2 = ED.cast[ED.castSel]; ED.exSel = c2 && c2.ex && c2.ex[0] ? c2.ex[0].k : null; ED.armed = null; edRenderSide(); edInspect(true); return; }
    if (a === 'castadd'){ const id = uid('c'), n = edCastList().length; let nm = '새 인물', k = 2; while (edByName(nm)) nm = `새 인물 ${k++}`; ED.cast[id] = { id, name: nm, order: n, look: 'R', face: 'R', pitch: 520, size: 1.2, dx: 0, dy: 0, ex: [] }; ED.castSel = id; ED.exSel = null; edSave('cast', id); edEngCast(); edRenderSide(); const inp = $('#c-name'); if (inp){ inp.focus(); inp.select(); } return; }
    if (!c) return;
    if (b.dataset.look){ c.look = b.dataset.look; edSave('cast', c.id); edEngCast(); edRenderSide(); edInspect(true); return; }
    if (b.dataset.cflip != null){ c.flip = b.dataset.cflip === '1'; edSave('cast', c.id); edEngCast(); edRenderSide(); edInspect(true); return; }
    if (b.dataset.face){ c.face = b.dataset.face; edSave('cast', c.id); edEngCast(); edRenderSide(); edInspect(true); return; }
    if (a === 'pitchplay') return engPreview(c.pitch || 520);
    if (b.dataset.exsel != null){ ED.exSel = b.dataset.exsel; ED.armed = null; edRenderSide(); edInspect(true); return; }
    if (a === 'expick') return $('#f-img').click();
    const ex = (c.ex || []).find(x => x.k === ED.exSel);
    if (b.dataset.elook != null && ex){ if (b.dataset.elook) ex.look = b.dataset.elook; else delete ex.look; edSave('cast', c.id); edEngCast(); edRenderSide(); edInspect(true); return; }
    if (a === 'exfirst' && ex){ c.ex.splice(c.ex.indexOf(ex), 1); c.ex.unshift(ex); edSave('cast', c.id); edEngCast(); edRenderSide(); edRenderBeats(); return; }
    if (a === 'exwb' && ex) return edWbOpen();
    if (a === 'exdel' && ex){ if (ED.armed !== 'exdel'){ ED.armed = 'exdel'; edRenderSide(); setTimeout(() => { if (ED.armed === 'exdel'){ ED.armed = null; edRenderSide(); } }, 3000); return; } ED.armed = null; c.ex.splice(c.ex.indexOf(ex), 1); ED.exSel = c.ex[0] ? c.ex[0].k : null; edSave('cast', c.id); edEngCast(); edRenderSide(); edRenderBeats(); edInspect(true); return; }
    if (a === 'castdel'){ if (ED.armed !== 'castdel'){ ED.armed = 'castdel'; edRenderSide(); setTimeout(() => { if (ED.armed === 'castdel'){ ED.armed = null; edRenderSide(); } }, 3500); return; } ED.armed = null; delete ED.cast[c.id]; edSave('cast', c.id); ED.castSel = null; ED.exSel = null; edEngCast(); edRenderSide(); edRenderBeats(); edInspect(false); return; }
  });
  side.addEventListener('input', e => {
    const t = e.target, id = t.id, c = ED.cast[ED.castSel], out = t.parentNode.querySelector('output');
    if (out) out.textContent = t.value + (id === 'c-pitch' ? 'Hz' : '');
    if (id && id.startsWith('c-') && c && id !== 'c-name'){ c[id.slice(2)] = +t.value; edSave('cast', c.id); edEngCast(); edInspect(true); return; }
    const ex = c && (c.ex || []).find(x => x.k === ED.exSel);
    if (id && id.startsWith('e-') && ex && id !== 'e-name'){ ex[id.slice(2)] = +t.value; edSave('cast', c.id); edEngCast(); edInspect(true); return; }
    const sc = edSc(); if (!sc) return; sc.opt = sc.opt || {};
    if (id && id.startsWith('o-')){ const k = id.slice(2); sc.opt[k] = t.type === 'checkbox' ? t.checked : t.type === 'color' ? t.value : (k === '주인공' ? t.value : +t.value); edOptChanged(); return; }
    const row = t.closest('.shrow'); if (row){ const k = row.dataset.sh, q = s => row.querySelector(s), on = q('.sh-on').checked, hx = q('.sh-c').value, a = +q('.sh-a').value;
      const rgb = [1, 3, 5].map(j => parseInt(hx.slice(j, j + 2), 16)).join(','); sc.opt[k] = on ? [+q('.sh-x').value || 0, +q('.sh-y').value || 0, Math.max(0, +q('.sh-b').value || 0), `rgba(${rgb},${a})`] : null; edOptChanged(); }
  });
  side.addEventListener('change', e => {
    const t = e.target, c = ED.cast[ED.castSel];
    if (t.id === 'c-name' && c){ if (edRenameCast(c, t.value)){ edEngCast(); edEngScene(true); edRenderSide(); edRenderBeats(); edInspect(true); } else t.value = c.name; return; }
    if (t.id === 'e-name' && c){ const ex = (c.ex || []).find(x => x.k === ED.exSel), nm = t.value.trim(); if (!ex || !nm || nm === ex.k) return; if (c.ex.some(x => x.k === nm)){ edStatus(`'${nm}' 표정이 이미 있어요`); t.value = ex.k; return; }
      const old = ex.k; ex.k = nm; ED.exSel = nm; edSave('cast', c.id);
      for (const sc of Object.values(ED.scen)){ let ch = false; for (const b of sc.beats || []){ if (b.who === c.name && b.ex === old){ b.ex = nm; ch = true; } for (const f of b.fx || []) if (f.who === c.name && f.ex === old){ f.ex = nm; ch = true; } } if (ch){ sc.updated = Date.now(); edSave('scen', sc.id); } }
      edEngCast(); edEngScene(true); edRenderSide(); edRenderBeats(); edInspect(true); return; }
    if (t.id === 'o-글자크기' || t.id === 'o-녹화fps' || t.id === 'o-주인공' || t.id === 'o-소리'){ const sc = edSc(); if (!sc) return; const k = t.id.slice(2); sc.opt[k] = t.type === 'checkbox' ? t.checked : k === '주인공' ? t.value : +t.value; edOptChanged(); }
  });
  // 그림 넣기 (파일 · 끌어다 놓기)
  $('#f-img').addEventListener('change', e => { edAddImages(e.target.files); e.target.value = ''; });
  const sideAll = $('#side');
  sideAll.addEventListener('dragover', e => { if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')){ e.preventDefault(); sideAll.classList.add('drop'); } });
  sideAll.addEventListener('dragleave', e => { if (!sideAll.contains(e.relatedTarget)) sideAll.classList.remove('drop'); });
  sideAll.addEventListener('drop', e => { sideAll.classList.remove('drop'); if (e.dataTransfer && e.dataTransfer.files.length){ e.preventDefault(); if (ED.tab !== 'cast'){ ED.tab = 'cast'; edRenderSide(); } edAddImages(e.dataTransfer.files); } });
  // 미리보기: 누르면 다음 · 인물 칸에선 끌어서 옮기기 · 휠로 크기
  const cv = $('#cv'); let dragP = null;
  cv.addEventListener('pointerdown', e => {
    engAudio();
    if (ENG.inspect){ const c = ED.cast[ED.castSel], ex = c && (c.ex || []).find(x => x.k === ED.exSel); if (!ex) return; dragP = { x: e.clientX, y: e.clientY, dx: ex.dx || 0, dy: ex.dy || 0, k: ENG.W / cv.getBoundingClientRect().width, ex, c }; cv.setPointerCapture(e.pointerId); return; }
    engNext();
  });
  cv.addEventListener('pointermove', e => { if (!dragP) return; dragP.ex.dx = Math.round(dragP.dx + (e.clientX - dragP.x) * dragP.k); dragP.ex.dy = Math.round(dragP.dy + (e.clientY - dragP.y) * dragP.k); edEngCast(); });
  cv.addEventListener('pointerup', () => { if (!dragP) return; edSave('cast', dragP.c.id); dragP = null; edRenderSide(); });
  cv.addEventListener('wheel', e => { if (!ENG.inspect) return; const c = ED.cast[ED.castSel], ex = c && (c.ex || []).find(x => x.k === ED.exSel); if (!ex) return; e.preventDefault(); ex.scale = Math.max(0.3, Math.min(2.5, +((ex.scale ?? 1) * Math.pow(1.04, -Math.sign(e.deltaY))).toFixed(3))); edEngCast(); clearTimeout(ED.wheelTm); ED.wheelTm = setTimeout(() => { edSave('cast', c.id); edRenderSide(); }, 400); }, { passive: false });
  // 키
  addEventListener('keydown', e => {
    if (!$('#wbdlg').hidden){ if (e.key === 'Escape') edWbClose(); return; }
    if (!$('#expdlg').hidden){ if (e.key === 'Escape' && !EXP.busy) $('#expdlg').hidden = true; return; }
    const tg = e.target; if (tg && tg.closest && tg.closest('input,textarea,select,[contenteditable]')){ if (e.key === 'Escape') tg.blur(); return; }
    if (e.repeat) return;
    const k = e.code;
    if (k === 'Space' || k === 'Enter' || k === 'NumpadEnter' || k === 'ArrowRight'){ e.preventDefault(); engAudio(); edInspect(false); engNext(); }
    else if (k === 'ArrowLeft' || k === 'Backspace'){ e.preventDefault(); edInspect(false); engBack(); }
    else if (k === 'KeyR' && !ENG.taking){ edInspect(false); engReset(0, false); engHint('Space 로 시작'); }
    else if (k === 'Escape' && ENG.taking){ e.preventDefault(); engTakeStop(); }
  });
  // 흰 바탕 지우기 창
  $('#wbdlg').addEventListener('click', e => {
    const b = e.target.closest('button'); const W = ED.wb; if (!b || !W) return; const a = b.dataset.wb;
    if (a === 'erase' || a === 'keep'){ W.tool = a; edWbUi(); }
    else if (a === 'undo'){ const h = W.hist.pop(); if (h){ (h === 'erase' ? W.seeds : W.keeps).pop(); edWbUi(); edWbRun(); } }
    else if (a === 'reset'){ W.seeds = []; W.keeps = []; W.hist = []; $('#wb-tol').value = 12; $('#wb-holes').checked = true; $('#wb-bottom').checked = false; edWbUi(); edWbRun(); }
    else if (a === 'apply') edWbApply();
    else if (a === 'close') edWbClose();
    else if (b.dataset.wbbg){ $('#wbcv').className = 'bg-' + b.dataset.wbbg; document.querySelectorAll('[data-wbbg]').forEach(x => x.classList.toggle('on', x === b)); }
  });
  $('#wbdlg').addEventListener('input', e => { if (e.target.id === 'wb-tol'){ $('#wb-tolv').textContent = e.target.value; } if (/^wb-/.test(e.target.id)) edWbRun(); });
  $('#wbcv').addEventListener('click', e => { const W = ED.wb; if (!W || !W.out) return; const r = e.target.getBoundingClientRect(), x = (e.clientX - r.left) * W.out.width / r.width, y = (e.clientY - r.top) * W.out.height / r.height; (W.tool === 'erase' ? W.seeds : W.keeps).push([x, y]); W.hist.push(W.tool); edWbUi(); edWbRun(); });
}
function edOptChanged(){ edTouch(); const cur = engCur(); edEngCast(); edEngScene(); if (cur >= 0) engJump(cur, true); }

/* ---------- v1.4 내보내기 창 (export.js) ---------- */
const EXO = (() => { try { return Object.assign({ take: 'rec', hold: 1.5, fmt: 'mp4', bg: '#00b140', fps: 30, scale: 0.5 }, JSON.parse(localStorage.getItem('scenario-exp-v1') || '{}')); } catch (e){ return { take: 'rec', hold: 1.5, fmt: 'mp4', bg: '#00b140', fps: 30, scale: 0.5 }; } })();
const EX_TIP = { mp4: 'MP4 — 에펙에 바로 들어가요. 전자음 포함. MP4 는 투명이 안 돼서 바탕 색을 깔아요 (초록이면 에펙 Keylight 로 빼요).',
  png: 'PNG 묶음 (.zip) — 투명 그대로, 에펙에서 가장 깔끔해요. 파일 > 가져오기 > 첫 장 고르고 ‘PNG 시퀀스’ 체크. 전자음은 sound.wav 로 같이 들어 있어요. 파일이 아주 커요 (30fps 로 1초에 40MB 쯤 — 24fps 면 조금 작아요).',
  gif: 'GIF — 투명 (가장자리가 조금 계단져요) · 소리 없음 · 25fps. 크기 50% 면 가볍고 100% 면 무거워요.' };
function edExpSave(){ try { localStorage.setItem('scenario-exp-v1', JSON.stringify(EXO)); } catch (e) {} }
function edExpUi(){
  const has = !!(ENG.recTake && ENG.recTake.starts && ENG.recTake.starts.length);
  if (!has && EXO.take === 'rec') EXO.take = 'auto';
  $('#ex-take-rec').disabled = !has; $('#ex-take-rec').checked = EXO.take === 'rec'; $('#ex-take-auto').checked = EXO.take === 'auto';
  $('#ex-rec-l').textContent = has ? `방금 녹화한 박자 (카드 ${ENG.recTake.starts.length}장 · ${Math.round((engTakeEnd(ENG.recTake) - ENG.recTake.starts[0]) * 10) / 10}초)` : '방금 녹화한 박자 (아직 없음 — 위의 ● 녹화)';
  $('#ex-hold').value = EXO.hold;
  document.querySelectorAll('#expdlg [data-fmt]').forEach(b => b.classList.toggle('on', b.dataset.fmt === EXO.fmt));
  document.querySelectorAll('#expdlg [data-bg]').forEach(b => b.classList.toggle('on', b.dataset.bg === EXO.bg)); $('#ex-bgc').value = EXO.bg;
  document.querySelectorAll('#expdlg [data-scale]').forEach(b => b.classList.toggle('on', +b.dataset.scale === EXO.scale));
  document.querySelectorAll('#expdlg [data-fps]').forEach(b => b.classList.toggle('on', +b.dataset.fps === EXO.fps));
  $('#ex-mp4').hidden = EXO.fmt !== 'mp4'; $('#ex-gif').hidden = EXO.fmt !== 'gif'; $('#ex-fpsrow').hidden = EXO.fmt === 'gif';
  $('#ex-tip').textContent = EX_TIP[EXO.fmt];
  const busy = EXP.busy; $('[data-x="snd"]').hidden = busy || !(EXP.lastFile && EXP.lastFile.snd); $('[data-x="go"]').hidden = busy; $('[data-x="stop"]').hidden = !busy; $('[data-x="save"]').hidden = busy || !EXP.lastFile;
  $('[data-x="save"]').textContent = EXP.lastFile ? `⬇ 다시 저장 (${EXP.lastFile.name.split('.').pop().toUpperCase()})` : '⬇ 다시 저장';
}
function edExpOpen(take){ if (take) EXO.take = take; edInspect(false); $('#expdlg').hidden = false; $('#ex-msg').textContent = ''; $('#ex-bar').style.width = '0%'; edExpUi(); }
async function edExpGo(){
  edExpSave(); const sc = edSc(); if (!sc){ $('#ex-msg').textContent = '시나리오를 먼저 골라요'; return; }
  edEngScene(); $('#ex-msg').textContent = '준비 중…'; const t0 = performance.now();
  const p = expRun({ fmt: EXO.fmt, take: EXO.take, hold: EXO.hold, fps: EXO.fps, bg: EXO.bg, scale: EXO.scale }, (k, msg) => { $('#ex-bar').style.width = Math.round(k * 100) + '%'; $('#ex-msg').textContent = `만드는 중 ${Math.round(k * 100)}% · ${msg}`; });
  edExpUi(); edRenderTop();
  try {
    const f = await p; edExpUi(); edRenderTop();
    if (!f) return;
    const mb = f.blob.size / 1048576;
    $('#ex-msg').textContent = `다 됐어요 — ${f.name} · ${f.sec.toFixed(1)}초 · ${f.frames}장 · ${mb >= 10 ? Math.round(mb) : mb.toFixed(1)}MB${f.sound ? ' · 전자음 포함' : f.snd ? ' · 이 브라우저는 MP4 에 소리를 못 넣어서 전자음은 따로 (⬇ 전자음)' : EXO.fmt === 'gif' ? '' : ' · 소리 없음'} (${Math.round((performance.now() - t0) / 1000)}초 걸림)`;
    await engDownload(f.blob, f.name);
  } catch (e){ edExpUi(); edRenderTop(); $('#ex-msg').textContent = '못 만들었어요 — ' + (e && e.message || e); }
}
function edExpBind(){
  const dlg = $('#expdlg');
  dlg.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.fmt){ EXO.fmt = b.dataset.fmt; edExpSave(); edExpUi(); }
    else if (b.dataset.bg){ EXO.bg = b.dataset.bg; edExpSave(); edExpUi(); }
    else if (b.dataset.scale){ EXO.scale = +b.dataset.scale; edExpSave(); edExpUi(); }
    else if (b.dataset.fps){ EXO.fps = +b.dataset.fps; edExpSave(); edExpUi(); }
    else if (b.dataset.x === 'go') edExpGo();
    else if (b.dataset.x === 'stop') EXP.stop = true;
    else if (b.dataset.x === 'save' && EXP.lastFile) engDownload(EXP.lastFile.blob, EXP.lastFile.name);
    else if (b.dataset.x === 'snd' && EXP.lastFile && EXP.lastFile.snd) engDownload(EXP.lastFile.snd.blob, EXP.lastFile.snd.name);
    else if (b.dataset.x === 'close' && !EXP.busy) dlg.hidden = true;
  });
  dlg.addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'ex-take'){ EXO.take = t.value; edExpSave(); }
    else if (t.id === 'ex-hold'){ EXO.hold = Math.max(0.2, Math.min(10, +t.value || 1.5)); edExpSave(); }
    else if (t.id === 'ex-bgc'){ EXO.bg = t.value; edExpSave(); edExpUi(); }
  });
}

/* ---------- 시작 ---------- */
function edBoot(){
  if (ED.ready) return edRefresh();
  ED.ready = true;
  let cur = null; try { cur = localStorage.getItem('scenario-cur-v1'); } catch (e) {}
  ED.cur = ED.scen[cur] ? cur : (edScenList()[0] || {}).id || null;
  const L = edCastList(); ED.castSel = L[0] ? L[0].id : null; ED.exSel = L[0] && L[0].ex && L[0].ex[0] ? L[0].ex[0].k : null;
  edEngCast(); edEngScene(); engReset(0, false);
  edRenderTop(); edRenderBeats(); edRenderSide(); edStatus();
  engHint(ED.cur ? 'Space 로 시작 · 카드를 누르면 그 장면' : '＋ 새 시나리오로 시작해요');
  $('#loading').hidden = true;
}
(async () => {
  try { ED.bg = localStorage.getItem('scenario-bg-v1') || 'check'; } catch (e) {}
  $('#cv').className = 'bg-' + ED.bg; $('#bg-pick').value = ED.bg;
  ENG.onHint = msg => { const el = $('#hint'); el.textContent = msg; el.classList.add('show'); clearTimeout(ED.hintTm); ED.hintTm = setTimeout(() => el.classList.remove('show'), 3200); };
  ENG.onRec = () => { edRenderTop(); };
  ENG.onTake = tk => { edRenderTop(); if (tk) edExpOpen('rec'); };
  ENG.onBeat = cur => { if (ED.ready && !ED.textMode) edMarkPlay(cur); };
  edBind(); edExpBind();
  await engInit($('#cv'));
  await edStoreInit();
})();
