/* ── 인간관계 판 (v1.2) — 나를 가운데 두고 사람 카드가 방사형으로 붙는 수사판 ──
   빨간 실이 나에서 각 사람으로, 서로 아는 사람끼리도 실로 잇는다. 무리(직장·가족·친구·학생·학부모·기타)마다 방향이 정해져 있다.
   세희가 대화에서 한 명씩 붙이고(add_person), 보스도 「+ 사람」으로 직접 붙인다. 카드를 누르면 메모·관련 판 항목이 나온다. */
const PPL = { list:null, changed:null };
const GROUPS = ['직장', '학생·학부모', '친구', '가족', '기타'];
const GROUP_COLOR = { '직장':'#3a6b64', '학생·학부모':'#8a6d3b', '친구':'#6b5b95', '가족':'#a13b2c', '기타':'#5c5340' };
async function pplLoad(){ if (!PPL.list){ const d = (await kvGet('people')) || {}; PPL.list = d.list || []; PPL.theme = d.theme || 'cork'; PPL.me = d.me || null; } if (!PPL.pics) PPL.pics = (await kvGet('pplpics')) || {}; return PPL.list; }
const pplSave = () => kvSet('people', { list:PPL.list, theme:PPL.theme || 'cork', ...(PPL.me ? { me:PPL.me } : {}) });
/* ── 프로필 사진 (v1.5.5 · C) ──
   사진은 kv 'pplpics' 에 { 사람id(나는 'me'): 정사각 JPEG dataURL } 로 따로 둔다 — 사람 기록(people)은 글만이라 가볍게 오가고, 사진은 바뀔 때만 오간다.
   사진이 없으면 성별(p.sex '여'|'남')에 맞는 기본 얼굴, 성별도 모르면 이름 첫 글자. 세희는 add/update_person 의 photo(보스가 보낸 사진 몇 번째)·sex 로 넣는다. */
const PIC_PX = 192;
const pplPicSave = () => kvSet('pplpics', PPL.pics || {});
const SIL = {
  '여':'<svg viewBox="0 0 64 64" class="sil"><rect width="64" height="64" fill="#e3d8c6"/><path d="M15 50c0-6 1-26 4-31 3-6 8-9 13-9s10 3 13 9c3 5 4 25 4 31z" fill="#5b4636"/><path d="M8 64c2-10 11-15 24-15s22 5 24 15z" fill="#a8746f"/><path d="M28 40h8v10h-8z" fill="#e8c9ac"/><ellipse cx="32" cy="30" rx="10" ry="12" fill="#f0d6bb"/><path d="M21.5 28c1-9 5.5-13.5 10.5-13.5S42 19 42.5 28c-4-5-9-7-11-12-2 5-6 9-10 12z" fill="#5b4636"/></svg>',
  '남':'<svg viewBox="0 0 64 64" class="sil"><rect width="64" height="64" fill="#d8dde0"/><path d="M6 64c2-11 12-16 26-16s24 5 26 16z" fill="#56677a"/><path d="M28 39h8v10h-8z" fill="#e3c3a6"/><ellipse cx="32" cy="29" rx="10.5" ry="12" fill="#ecd1b6"/><path d="M21 28c-1.5-10 4-16 11-16s12.5 6 11 16c-1-4-3-6.5-5-7.5-4 1.5-9 1.5-13 0-2 1-3.5 3.5-4 7.5z" fill="#3a3129"/></svg>' };
/* 그 사람 얼굴 칸 안에 들어갈 것 — 사진 > 성별 기본 얼굴 > 첫 글자 */
function pplFace(p, id){ const k = id || p.id, u = PPL.pics && PPL.pics[k];
  if (u) return `<img class="pic" src="${u}" alt="">`;
  if (SIL[p.sex]) return SIL[p.sex];
  return esc(String(p.name || '?').slice(0, 1)); }
/* 파일·사진 주소 → 정사각(얼굴이 보통 위쪽이라 조금 위를 잘라 씀) 192px JPEG */
async function picThumb(src){
  const url = typeof src === 'string' ? src : URL.createObjectURL(src);
  try{
    const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('사진을 못 열었어요')); i.src = url; });
    const w = img.naturalWidth, h = img.naturalHeight, side = Math.min(w, h), sx = (w - side) / 2, sy = h > w ? Math.min((h - side) * 0.25, h - side) : 0;
    const cv = document.createElement('canvas'); cv.width = cv.height = PIC_PX;
    const g = cv.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(img, sx, sy, side, side, 0, 0, PIC_PX, PIC_PX);
    return cv.toDataURL('image/jpeg', 0.82);
  } finally { if (typeof src !== 'string') URL.revokeObjectURL(url); }
}
async function pplSetPic(id, dataUrl){ await pplLoad(); if (dataUrl) PPL.pics[id] = dataUrl; else delete PPL.pics[id]; await pplPicSave();
  dlog('사람', `프로필 사진 ${dataUrl ? '넣음' : '뺌'} #${id}${dataUrl ? ' · ' + Math.round(dataUrl.length / 1024) + 'KB' : ''}`);
  if (DW.open === 'people') pplRender(); if (PD.id === id) pdRender(); }
/* 보스가 이번 대화에서 보낸 사진 중 n번째(맨 마지막에 사진을 보낸 말 기준) */
function bossPic(n){
  for (let i = O.log.length - 1; i >= 0; i--){ const m = O.log[i]; if (m.who !== 'u') continue; const th = O.thumbs && O.thumbs[m.at];
    if (th && th.length) return th[Math.min(Math.max((Number(n) || 1) - 1, 0), th.length - 1)]; }
  return null;
}
function picPick(){ return new Promise(ok => { const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*';
  f.onchange = () => ok(f.files && f.files[0] || null); f.click(); }); }
function picSheet(id){
  const isMe = id === 'me', p = pdGet(id); if (!p) return; const has = !!(PPL.pics && PPL.pics[id]);
  openSheet(`<h4>${esc(isMe ? '나' : p.name)} · 프로필 사진</h4>
    <div class="pp-picrow"><div class="pp-picbig">${pplFace(p, id)}</div>
      <div class="pp-picact"><button class="chip" data-pic="pick">${has ? '사진 바꾸기' : '사진 넣기'}</button>${has ? '<button class="chip danger" data-pic="del">사진 빼기</button>' : ''}</div></div>
    <label class="t">사진이 없을 때 기본 얼굴</label>
    <div class="row">${['여', '남', ''].map(x => `<button class="chip ${(p.sex || '') === x ? 'on' : ''}" data-pic="sex" data-v="${x}">${x ? (x === '여' ? '여성' : '남성') : '모름(첫 글자)'}</button>`).join('')}</div>
    <p class="note" style="margin-top:8px">채팅에 사진을 같이 보내며 "이 사진 ${esc(isMe ? '내' : p.name)} 프로필로 해줘"라고 해도 돼요.</p>`);
  $('sheet').dataset.pic = id;
}
$('sheet').addEventListener('click', async e => {
  const b = e.target.closest('[data-pic]'); if (!b) return;
  const id = $('sheet').dataset.pic, p = pdGet(id); if (!p) return closeSheet();
  const a = b.dataset.pic;
  if (a === 'pick'){ const f = await picPick(); if (!f) return; try{ await pplSetPic(id, await picThumb(f)); closeSheet(); toast('프로필 사진을 넣었어요'); }catch(err){ toast(err.message); } return; }
  if (a === 'del'){ if (!b.classList.contains('armed')){ b.classList.add('armed'); b.textContent = '한 번 더 누르면 빼요'; return; } await pplSetPic(id, null); closeSheet(); toast('사진을 뺐어요'); return; }
  if (a === 'sex'){ if (b.dataset.v) p.sex = b.dataset.v; else delete p.sex; await pplSave(); if (DW.open === 'people') pplRender(); if (PD.id === id) pdRender(); picSheet(id); }
});

const pplFind = key => { const k = String(key || '').replace(/^#/, '').trim(); return (PPL.list || []).find(p => p.id === k) || (PPL.list || []).find(p => p.name === k); };
/* v1.5.4 — 인간관계 판은 보스의 사적인 사람 수첩. 맥락: 모두는 짧게, 요 몇 마디에 나온 사람(+ 나)은 전부 자세히. 나머지는 read_person 으로 */
const STORY_MAX = 2000;
function pplLine(p, isMe){
  const info = (p.info || []).map(x => `${x.k} ${x.v}`).join(', '), st = p.story || [];
  return `- ${isMe ? '나(보스 본인)' : '#' + p.id + ' ' + p.name + ' · ' + (p.rel || '관계 미정') + ' · ' + p.group}${p.sex ? ' · ' + p.sex : ''}${info ? ' · ' + info : ''}${p.note ? ' — ' + p.note.replace(/\n/g, ' ').slice(0, 80) : ''}${(p.extra || []).length ? ` · 기타 ${p.extra.length}줄` : ''}${st.length ? ` · 이야기 ${st.length}건(최근 ${storyWhen(st[st.length - 1])})` : ''}`;
}
const storyWhen = x => x.when || ymdDot(x.at);
function pplFull(p, isMe){
  const info = (p.info || []).map(x => `${x.k} ${x.v}`).join(', ');
  const out = [`- ${isMe ? '나(보스 본인)' : '#' + p.id + ' ' + p.name + ' · ' + (p.rel || '관계 미정') + ' · ' + p.group}${p.sex ? ' · ' + p.sex : ''}${info ? ' · ' + info : ''}${PPL.pics && PPL.pics[isMe ? 'me' : p.id] ? ' · 프로필 사진 있음' : ''}`];
  if (p.note) out.push('  기억할 점: ' + p.note.replace(/\n/g, ' / '));
  for (const x of p.extra || []) out.push(`  기타: ${x.lock ? '[비공개] ' : ''}${x.text}`);
  const st = (p.story || []).slice(-12);
  if (st.length) out.push(`  이야기 기록(오래된 것부터, 모두 ${(p.story || []).length}건):`, ...st.map(x => `    · ${storyWhen(x)} ${x.lock ? '[비공개] ' : ''}${x.text.replace(/\n/g, ' / ').slice(0, 700)}`));
  const ns = (p.notes || []).slice(-5); if (ns.length) out.push('  세희 메모: ' + ns.map(x => x.text).join(' / '));
  const links = (p.links || []).map(x => pplFind(x)).filter(Boolean).map(x => x.name); if (links.length) out.push('  아는 사이: ' + links.join(', '));
  return out.join('\n');
}
function pplKeys(p){
  const n = String(p.name || '').trim(), first = n.split(/\s+/)[0], ks = [n, first];
  if (/^[가-힣]{3}$/.test(first)) ks.push(first.slice(1));   // 이예진 → 예진
  return [...new Set(ks.filter(k => k && k.length >= 2))];
}
function pplMentioned(){
  const recent = (O.log || []).filter(m => (m.who === 'u' || m.who === 's') && m.text).slice(-8).map(m => m.text).join('\n');
  return (PPL.list || []).filter(p => pplKeys(p).some(k => recent.includes(k))).slice(0, 6);
}
async function pplContext(){
  await pplLoad();
  if (!PPL.me && !PPL.list.length) return '인간관계 판: 아직 아무도 없음';
  const hot = pplMentioned(), hotIds = new Set(hot.map(p => p.id));
  const brief = PPL.list.filter(p => !hotIds.has(p.id)).slice(0, 60).map(p => pplLine(p));
  const anyLock = [PPL.me, ...PPL.list].some(p => p && [...(p.extra || []), ...(p.story || [])].some(x => x.lock));
  return ['인간관계 판 기록부 — 보스 혼자 보는 사적인 사람 수첩(나 포함).',
    PPL.me ? '나:\n' + pplFull(PPL.me, true) : '',
    hot.length ? '요 몇 마디에 나온 사람(전부 자세히):\n' + hot.map(p => pplFull(p)).join('\n') : '',
    brief.length ? '나머지(짧게 — 자세한 건 read_person):\n' + brief.join('\n') : '',
    anyLock ? '[비공개] 줄은 보스와 단둘이 하는 이야기에서는 마음껏 쓴다. 보고서·보드 카드·판 항목·남에게 보낼 글처럼 남이 볼 수 있는 곳에는 쓰지 않는다.' : ''].filter(Boolean).join('\n');
}
const PEOPLE_TOOLS = () => [
  { name:'add_person', description:'인간관계 판에 사람 한 명을 붙인다. 보스가 추가하라고 할 때만. 한 번에 한 명.', schema:{ type:'object', properties:{
    name:{ type:'string', description:'이름 또는 부르는 말. 예: 이예진 조교, 정은쌤' },
    relation:{ type:'string', description:'보스와의 관계 한 줄. 예: 같이 일하는 조교, 중2 김민준 어머니' },
    group:{ type:'string', enum:GROUPS, description:'무리' },
    note:{ type:'string', description:'기억할 점 한 줄(선택)' },
    info:{ type:'array', description:'기본 항목(선택). 예: 생일·나이·키', items:{ type:'object', properties:{ key:{ type:'string' }, value:{ type:'string' } } } },
    add_extra:{ type:'array', description:'기타 줄(선택) — update_person 과 같음', items:{ type:'object', properties:{ text:{ type:'string' }, lock:{ type:'boolean' } } } },
    add_story:{ type:'array', description:'이야기 기록(선택) — update_person 과 같음', items:{ type:'object', properties:{ text:{ type:'string' }, when:{ type:'string' }, lock:{ type:'boolean' } } } },
    sex:{ type:'string', enum:['여', '남'], description:'성별(선택) — 사진이 없을 때 기본 얼굴. 관계·호칭으로 분명할 때만(어머니·아버지·언니·형 등). 이름만으로 짐작하지 않는다' },
    photo:{ type:'integer', description:'프로필 사진(선택) — 보스가 이번에 보낸 사진 중 몇 번째(1부터)를 이 사람 프로필 사진으로. 보스가 사진을 보내며 이 사람 사진·프사로 하라고 할 때만' },
    link_to:{ type:'string', description:'이미 판에 있는 사람 중 이 사람과 연결된 이름(선택)' } }, required:['name', 'group'] } },
  { name:'update_person', description:"인간관계 판의 사람 기록부를 고친다. 보스 본인은 person:'나'. 바꿀 것만 넣는다.", schema:{ type:'object', properties:{
    person:{ type:'string', description:"사람 id(# 없이) 또는 이름. 보스 본인이면 '나'" }, relation:{ type:'string' }, group:{ type:'string', enum:GROUPS },
    info:{ type:'array', description:'기본 항목 넣기·고치기(같은 이름이면 바꿈). 생일·나이·키 등', items:{ type:'object', properties:{ key:{ type:'string' }, value:{ type:'string' } } } },
    note:{ type:'string', description:'기억할 점 — 이 사람을 대할 때 늘 떠올릴 핵심(통째로 바꿈, 원래 것을 살려서 고쳐 쓴다)' },
    add_extra:{ type:'array', description:'기타 줄 더하기 — 짧은 사실 한 줄씩(근무·처우·사정·취향·가족 관계 등). 남이 알면 안 되는 건 lock:true', items:{ type:'object', properties:{ text:{ type:'string' }, lock:{ type:'boolean' } } } },
    add_story:{ type:'array', description:'이야기 기록 더하기 — 보스가 들려준 그 사람의 일·사정·털어놓은 이야기·있었던 일을 한 건씩 자세히. 요약해 뭉개지 말고 언제·무슨 일·왜·그 사람이 한 말과 마음·보스와의 사이를 살려 쓴다(길어도 됨). 본인이 털어놓은 속 이야기나 남이 알면 곤란한 건 lock:true',
      items:{ type:'object', properties:{ text:{ type:'string' }, when:{ type:'string', description:'언제 일인지(YYYY-MM-DD 또는 \'작년 겨울\'처럼). 모르면 비움 — 적은 날로 남는다' }, lock:{ type:'boolean' } }, required:['text'] } },
    sex:{ type:'string', enum:['여', '남'], description:'성별(선택) — 사진이 없을 때 기본 얼굴. 관계·호칭으로 분명할 때만(어머니·아버지·언니·형 등). 이름만으로 짐작하지 않는다' },
    photo:{ type:'integer', description:'프로필 사진(선택) — 보스가 이번에 보낸 사진 중 몇 번째(1부터)를 이 사람 프로필 사진으로. 보스가 사진을 보내며 이 사람 사진·프사로 하라고 할 때만' },
    add_note:{ type:'string', description:'세희 메모 한 줄' }, link_to:{ type:'string', description:'잇고 싶은 다른 사람 이름' } }, required:['person'] } },
  { name:'read_person', description:'한 사람의 기록부 전체(기타·이야기 기록 전부 포함)를 읽는다. 맥락에 짧게만 나온 사람을 자세히 알아야 할 때.', schema:{ type:'object', properties:{ person:{ type:'string', description:"사람 id(# 없이) 또는 이름. 보스 본인이면 '나'" } }, required:['person'] } },
  { name:'remove_person', description:'인간관계 판에서 사람을 뗀다. 보스가 분명히 떼라고 할 때만.', schema:{ type:'object', properties:{ person:{ type:'string' } }, required:['person'] } },
];
function pplNote(text){ O.log.push({ who:'a', board:true, text, at:Date.now() }); renderLog(); saveLog(); }
function pplPatch(p, a){
  p.info = p.info || []; p.extra = p.extra || [];
  if (Array.isArray(a.info)) for (const x of a.info){ const k = String(x.key || '').trim().slice(0, 20), v = String(x.value || '').trim().slice(0, 80); if (!k || !v) continue; const o = p.info.find(y => y.k === k); if (o) o.v = v; else p.info.push({ k, v }); }
  if (typeof a.note === 'string' && a.note.trim()) p.note = a.note.trim().slice(0, 1500);
  if (Array.isArray(a.add_extra)) for (const x of a.add_extra){ const t = String(x.text || '').trim().slice(0, 400); if (t && !p.extra.some(y => y.text === t)) p.extra.push({ text:t, lock:!!x.lock }); }
  if (typeof a.add_story === 'string') a.add_story = [{ text:a.add_story }];
  if (Array.isArray(a.add_story)){ p.story = p.story || []; for (const x of a.add_story){ const t = String((x && x.text) || x || '').trim().slice(0, STORY_MAX); if (!t || p.story.some(y => y.text === t)) continue;
    p.story.push({ at:Date.now(), when:String((x && x.when) || '').trim().slice(0, 30) || null, text:t, lock:!!(x && x.lock), by:'sehee' }); } }
}
/* 세희가 무엇을 고쳤는지 대화창에 한 줄로 */
function pplWhat(a){ const w = [];
  if (a.info && a.info.length) w.push('항목 ' + a.info.length); if (a.note) w.push('기억할 점'); if (a.add_extra && a.add_extra.length) w.push('기타 ' + a.add_extra.length + '줄');
  if (a.add_story && a.add_story.length) w.push('이야기 ' + a.add_story.length + '건'); if (a.photo) w.push('프로필 사진'); if (a.sex === '여' || a.sex === '남') w.push(a.sex === '여' ? '여성' : '남성'); if (a.add_note) w.push('세희 메모'); if (a.link_to) w.push('관계 잇기');
  return w.length ? ' — ' + w.join(' · ') : ''; }
function pplLink(a, b){ if (!a || !b || a === b) return; a.links = [...new Set([...(a.links || []), b.id])]; b.links = [...new Set([...(b.links || []), a.id])]; }
/* v1.5.5 성별·프로필 사진 — add/update 공통. 사진을 못 찾으면 그 까닭을 돌려준다 */
async function pplApplyLook(p, id, a){
  if (a.sex === '여' || a.sex === '남') p.sex = a.sex;
  if (a.photo === undefined || a.photo === null || a.photo === '') return null;
  const u = bossPic(a.photo); if (!u) return '보스가 보낸 사진을 찾지 못함(앱을 다시 켜면 앞서 보낸 사진은 사라짐) — 보스에게 사진을 다시 같이 보내 달라고 하거나, 인물 기록부의 사진칸을 눌러 넣는 법을 알려 준다';
  try{ PPL.pics[id] = await picThumb(u); await pplPicSave(); return 'ok'; }catch(e){ return '사진을 못 열었음'; }
}
async function runPeopleTool(c){
  await pplLoad(); const a = c.args || {};
  if (c.name === 'add_person'){
    const name = String(a.name || '').trim().slice(0, 30); if (!name) return { ok:false, error:'name이 비었음' };
    if (pplFind(name)) return { ok:false, error:'이미 판에 있음 — update_person 을 쓴다', id:pplFind(name).id };
    const p = { id:uid(), name, rel:String(a.relation || '').slice(0, 60), group:GROUPS.includes(a.group) ? a.group : '기타', note:String(a.note || '').slice(0, 200), info:[], extra:[], notes:[], links:[], at:Date.now(), by:'sehee' };
    pplPatch(p, a); const look = await pplApplyLook(p, p.id, a);
    PPL.list.push(p); if (a.link_to) pplLink(p, pplFind(a.link_to));
    await pplSave(); PPL.changed = p.id; pplNote(`인간관계 판에 붙였어요 — ${p.name}${p.rel ? ' (' + p.rel + ')' : ''}${pplWhat({ ...a, info:null, note:null, link_to:null, photo:look === 'ok' ? 1 : null })}`);
    return { ok:true, id:p.id, ...(look && look !== 'ok' ? { photo_error:look } : {}) };
  }
  const isMe = /^(나|me|보스|본인)$/.test(String(a.person || '').trim());
  const p = isMe ? await meLoad() : pplFind(a.person); if (!p) return { ok:false, error:'그 사람이 판에 없음' };
  if (c.name === 'update_person'){
    pplPatch(p, a); const look = await pplApplyLook(p, isMe ? 'me' : p.id, a), aw = { ...a, photo:look === 'ok' ? 1 : null };
    if (a.relation && !isMe) p.rel = String(a.relation).slice(0, 60);
    if (GROUPS.includes(a.group) && !isMe) p.group = a.group;
    if (a.add_note) p.notes = [...(p.notes || []), { at:Date.now(), text:String(a.add_note).slice(0, 200) }].slice(-30);
    if (a.link_to) pplLink(p, pplFind(a.link_to));
    await pplSave(); if (!isMe) PPL.changed = p.id; pplNote(`인간관계 판을 고쳤어요 — ${p.name}${pplWhat(aw)}`); if (PD.id === (isMe ? 'me' : p.id)) pdRender();
    if (isMe && workOn() && WORK.active){ if (curView() !== 'office') goView('office'); if (DW.open !== 'people') await dwOpen('people'); await wsleep(300); await pdOpen('me'); await wsleep(300); document.querySelectorAll('#pdBody .pd-sec').forEach((el, i) => setTimeout(() => hl(el), i * 160)); }
    return { ok:true, id:p.id, ...(look && look !== 'ok' ? { photo_error:look } : {}) };
  }
  if (c.name === 'read_person') return { ok:true, person:pplFull(pdNorm(p), isMe) };
  if (c.name === 'remove_person'){
    PPL.list = PPL.list.filter(x => x !== p); for (const x of PPL.list) x.links = (x.links || []).filter(id => id !== p.id);
    if (PPL.pics && PPL.pics[p.id]){ delete PPL.pics[p.id]; await pplPicSave(); }
    await pplSave(); pplNote(`인간관계 판에서 뗐어요 — ${p.name}`); if (DW.open === 'people') pplRender();
    return { ok:true };
  }
  return { ok:false, error:'모르는 도구' };
}
/* 자리 잡기 — 무리마다 부채꼴 방향, 안쪽 고리부터 채우고 넘치면 바깥 고리 */
function pplLayout(list, S){
  const C = S / 2, pos = {}, by = {};
  for (const g of GROUPS) by[g] = list.filter(p => p.group === g);
  const used = GROUPS.filter(g => by[g].length), wt = g => Math.min(by[g].length, 4) + 1.2, tot = used.reduce((a, g) => a + wt(g), 0) || 1;
  const starts = {}, spans = {}; let acc = -Math.PI / 2;
  for (const g of used){ starts[g] = acc; spans[g] = Math.PI * 2 * wt(g) / tot; acc += spans[g]; }
  used.forEach(g => {
    const ps = by[g], start = starts[g], span = spans[g];
    ps.forEach((p, i) => {
      const ring = i < 4 ? 0 : i < 10 ? 1 : 2, inRing = ring === 0 ? Math.min(ps.length, 4) : ring === 1 ? Math.min(ps.length - 4, 6) : ps.length - 10;
      const k = ring === 0 ? i : ring === 1 ? i - 4 : i - 10, ang = start + span * ((k + 0.5) / Math.max(inRing, 1));
      const r = S * (ring === 0 ? 0.29 : ring === 1 ? 0.39 : 0.47) * (ring === 0 && k % 2 ? 0.9 : 1);
      pos[p.id] = { x:C + Math.cos(ang) * r, y:C + Math.sin(ang) * r, g, ang };
    });
  });
  return { pos, used, starts, spans };
}
async function pplOpen(){ await pplLoad(); pplRender(true); }
/* v1.2.1 꾸밈 세 가지 — cork 수사판 / white 화이트보드(마커 선·자석) / map 옛 지도(구역·등고선·나침반·핀) */
const PP_THEMES = [['cork', '코르크'], ['white', '화이트보드'], ['map', '지도']];
function pplTheme(){ const t = PPL.theme || 'cork'; const el = $('people'); PP_THEMES.forEach(([k]) => el.classList.toggle('th-' + k, k === t));
  if (t === 'white' && !document.getElementById('ppFont')){ const l = document.createElement('link'); l.id = 'ppFont'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Gaegu:wght@700&display=swap'; document.head.appendChild(l); }
  $('ppTheme').textContent = '꾸밈 · ' + PP_THEMES.find(x => x[0] === t)[1]; return t; }
function pplRender(center){
  const list = PPL.list || [], S = Math.max(440, 380 + list.length * 24), C = S / 2, th = pplTheme();
  const { pos, used, starts, spans } = pplLayout(list, S);
  for (const [id, xy] of Object.entries(BONUS.pos || {})) if (pos[id]) pos[id] = { x:xy.x * S, y:xy.y * S };   /* 보너스가 옮겨 둔 자리 */
  const hs = s => { let h = 7; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  const f = n => n.toFixed(1);
  const path = (x1, y1, x2, y2, cls, seed) => {
    if (th === 'cork') return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" class="${cls}"/>`;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, b = ((seed % 21) - 10) / 10 * L * (th === 'map' ? 0.16 : 0.07);
    return `<path d="M${f(x1)} ${f(y1)} Q${f(mx - dy / L * b)} ${f(my + dx / L * b)} ${f(x2)} ${f(y2)}" class="${cls}"/>`;
  };
  let under = '', svg = '';
  if (th === 'map'){
    // 구역(무리별 부채꼴), 등고선, 격자 좌표, 나침반
    const R = S * 0.5;
    used.forEach(g => { const a0 = starts[g], a1 = a0 + spans[g], big = spans[g] > Math.PI ? 1 : 0;
      under += `<path d="M${C} ${C} L${f(C + Math.cos(a0) * R)} ${f(C + Math.sin(a0) * R)} A${R} ${R} 0 ${big} 1 ${f(C + Math.cos(a1) * R)} ${f(C + Math.sin(a1) * R)} Z" fill="${GROUP_COLOR[g]}" class="pp-zone"/>`;
      under += `<line x1="${C}" y1="${C}" x2="${f(C + Math.cos(a0) * R)}" y2="${f(C + Math.sin(a0) * R)}" class="pp-border"/>`; });
    for (let i = 0; i < 7; i++){ const h = hs('c' + i), cx = (h % 1000) / 1000 * S, cy = ((h >> 10) % 1000) / 1000 * S;
      for (let j = 1; j <= 3; j++) under += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(j * (18 + h % 23))}" ry="${f(j * (12 + (h >> 5) % 17))}" transform="rotate(${h % 180} ${f(cx)} ${f(cy)})" class="pp-contour"/>`; }
    for (let x = S / 8; x < S; x += S / 8) under += `<line x1="${f(x)}" y1="0" x2="${f(x)}" y2="${S}" class="pp-grid"/><line x1="0" y1="${f(x)}" x2="${S}" y2="${f(x)}" class="pp-grid"/>`;
    const cx = S - 46, cy = 46;
    under += `<g class="pp-compass" transform="translate(${cx} ${cy})"><circle r="26"/><path d="M0 -24 L5 0 L0 24 L-5 0 Z"/><path d="M-24 0 L0 -5 L24 0 L0 5 Z" class="lt"/><text y="-30">N</text></g>`;
  } else under += `<circle cx="${C}" cy="${C}" r="${S * 0.29}" class="pp-ring"/><circle cx="${C}" cy="${C}" r="${S * 0.39}" class="pp-ring"/>`;
  used.forEach(g => { const a = starts[g] + spans[g] / 2; svg += `<text x="${(C + Math.cos(a) * S * 0.47).toFixed(0)}" y="${(C + Math.sin(a) * S * 0.47).toFixed(0)}" class="pp-gl" fill="${GROUP_COLOR[g]}">${th === 'map' ? g + ' 구역' : g}</text>`; });
  const off = th === 'white' ? 54 : th === 'map' ? 30 : 0;
  for (const p of list){ const q = pos[p.id]; if (!q) continue; const d = Math.hypot(q.x - C, q.y - C) || 1; svg += path(C + (q.x - C) / d * off, C + (q.y - C) / d * off * (th === 'white' ? 0.8 : 1), q.x, q.y, 'pp-str', hs(p.id)); }
  const seen = new Set();
  for (const p of list) for (const id of (p.links || [])){ const k = [p.id, id].sort().join('-'); if (seen.has(k) || !pos[id]) continue; seen.add(k); svg += path(pos[p.id].x, pos[p.id].y, pos[id].x, pos[id].y, 'pp-lk', hs(k)); }
  if (th === 'white') svg += `<ellipse cx="${C}" cy="${C}" rx="62" ry="48" transform="rotate(-8 ${C} ${C})" class="pp-mecircle"/>`;
  $('ppMap').style.width = $('ppMap').style.height = S + 'px';
  $('ppMap').innerHTML = `<svg class="pp-svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${under}${svg}</svg>
    <div class="pp-me${PPL.pics && PPL.pics.me ? ' has-pic' : ''}" style="left:${C}px;top:${C}px"><i class="pp-pin"></i>${PPL.pics && PPL.pics.me ? `<div class="ph pic"><img class="pic" src="${PPL.pics.me}" alt=""></div>` : ''}<b>나</b><span>${th === 'map' ? '현위치' : '보스'}</span></div>
    ${list.map(p => { const q = pos[p.id]; return q ? `<div class="pp-node" data-pp="${p.id}" style="left:${q.x.toFixed(0)}px;top:${q.y.toFixed(0)}px;--c:${GROUP_COLOR[p.group]};--r:${((hs(p.id) % 7) - 3) * 1.4}deg"><i class="pp-pin"></i><div class="ph${PPL.pics && PPL.pics[p.id] ? ' pic' : SIL[p.sex] ? ' sx' : ''}">${pplFace(p)}</div><b>${esc(p.name)}</b><span>${esc(p.rel || p.group)}</span></div>` : ''; }).join('')}
    ${list.length ? '' : `<div class="pp-empty" style="left:${C}px;top:${C + 70}px">아직 아무도 없어요.<br>「+ 사람」을 누르거나 세희에게 "○○을 인간관계 판에 추가해줘"라고 해 보세요.</div>`}`;
  $('ppCount').textContent = list.length ? `${list.length}명` : '';
  const sc = $('ppScroll'), fitK = sc.clientWidth > 80 ? Math.min(1, (sc.clientWidth - 8) / S, (sc.clientHeight - 8) / S) : 1;
  const k = PPL.big ? 1 : (BONUS.zoom || fitK); $('ppMap').style.zoom = k; $('ppCenter').textContent = PPL.big ? '전체 보기' : '크게 보기';
  if (center || !PPL.big) requestAnimationFrame(() => { sc.scrollLeft = (S * k - sc.clientWidth) / 2; sc.scrollTop = (S * k - sc.clientHeight) / 2; });
  setTimeout(() => bonusEmit('people'), 0);
}
$('ppTheme').onclick = async () => { const i = PP_THEMES.findIndex(x => x[0] === (PPL.theme || 'cork')); PPL.theme = PP_THEMES[(i + 1) % PP_THEMES.length][0]; await pplSave(); pplRender(true); };

function pplFlash(id){ const el = document.querySelector(`[data-pp="${id}"]`); if (!el) return; if (PPL.big) el.scrollIntoView({ block:'center', inline:'center', behavior:'smooth' }); el.classList.remove('new'); void el.offsetWidth; el.classList.add('new'); }
async function pplItems(name){
  const hits = [], seen = new Set(), key = name.replace(/\s*(조교|쌤|선생님|님|씨)$/, '');
  for (const pn of (await allPans()).sort((a, b) => a.date < b.date ? 1 : -1)) for (const it of pn.items) if (!seen.has(it.id) && (it.text + ' ' + (it.tag || '')).includes(key)){ seen.add(it.id); hits.push({ it, date:pn.date }); }
  return hits.slice(0, 12);
}
async function pplSheet(id){
  const p = pplFind(id); if (!p) return;
  const items = await pplItems(p.name), links = (p.links || []).map(x => pplFind(x)).filter(Boolean);
  openSheet(`<h4>${esc(p.name)}</h4>
    <div class="row" style="flex-wrap:wrap;gap:6px"><input class="free" id="ppRel" value="${esc(p.rel || '')}" placeholder="관계"><select class="free" id="ppGrp">${GROUPS.map(g => `<option ${g === p.group ? 'selected' : ''}>${g}</option>`).join('')}</select></div>
    <textarea class="big" id="ppNote" placeholder="기억할 점">${esc(p.note || '')}</textarea>
    ${(p.notes || []).length ? `<label class="t">세희가 덧붙인 것</label><ul class="cl">${p.notes.slice().reverse().map(n => `<li>${esc(n.text)} <small class="note">${ymdDot(n.at)}</small></li>`).join('')}</ul>` : ''}
    ${links.length ? `<label class="t">이어진 사람</label><p class="note">${links.map(x => esc(x.name)).join(' · ')}</p>` : ''}
    <label class="t">판에 나온 일</label>${items.length ? `<ul class="cl">${items.map(h => `<li${h.it.done ? ' style="text-decoration:line-through;opacity:.6"' : ''}>${esc(h.it.text)} <small class="note">${mdDay(h.date)}</small></li>`).join('')}</ul>` : '<p class="note">아직 없어요.</p>'}
    <div class="row" style="margin-top:8px;gap:6px"><button class="chip" data-pact="save" data-id="${p.id}">저장</button><button class="chip danger" data-pact="del" data-id="${p.id}">떼기</button></div>`);
}
function pplAddSheet(){
  openSheet(`<h4>사람 붙이기</h4><input class="free" id="ppNewName" placeholder="이름 (예: 이예진 조교)"><div class="row" style="margin-top:6px;gap:6px"><input class="free" id="ppNewRel" placeholder="관계 (예: 같이 일하는 조교)"><select class="free" id="ppNewGrp">${GROUPS.map(g => `<option>${g}</option>`).join('')}</select><select class="free" id="ppNewSex"><option value="">성별 모름</option><option value="여">여성</option><option value="남">남성</option></select></div>
    <input class="free" id="ppNewNote" placeholder="기억할 점 (선택)" style="margin-top:6px"><div class="row" style="margin-top:8px"><button class="chip" data-pact="add">붙이기</button></div><p class="note" id="ppMsg"></p>`);
}
$('sheet').addEventListener('click', async e => {
  const b = e.target.closest('[data-pact]'); if (!b) return;
  await pplLoad(); const a = b.dataset.pact;
  if (a === 'add'){
    const name = $('ppNewName').value.trim(); if (!name){ $('ppMsg').textContent = '이름을 넣어 주세요.'; return; }
    if (pplFind(name)){ $('ppMsg').textContent = '이미 판에 있어요.'; return; }
    const p = { id:uid(), name:name.slice(0, 30), rel:$('ppNewRel').value.trim().slice(0, 60), group:$('ppNewGrp').value, note:$('ppNewNote').value.trim().slice(0, 200), notes:[], links:[], at:Date.now(), by:'boss' };
    if ($('ppNewSex').value) p.sex = $('ppNewSex').value;
    PPL.list.push(p); await pplSave(); closeSheet(); pplRender(); setTimeout(() => pplFlash(p.id), 80);
  } else {
    const p = pplFind(b.dataset.id); if (!p) return;
    if (a === 'save'){ p.rel = $('ppRel').value.trim().slice(0, 60); p.group = $('ppGrp').value; p.note = $('ppNote').value.trim().slice(0, 200); await pplSave(); closeSheet(); pplRender(); }
    else if (a === 'del'){
      if (!b.textContent.includes('한 번 더')){ b.textContent = '한 번 더 누르면 떼요'; return; }
      PPL.list = PPL.list.filter(x => x !== p); for (const x of PPL.list) x.links = (x.links || []).filter(id => id !== p.id);
      await pplSave(); closeSheet(); pplRender();
    }
  }
});
$('ppMap').addEventListener('click', e => { if (e.target.closest('.pp-me')) return pdOpen('me'); const n = e.target.closest('[data-pp]'); if (n) pdOpen(n.dataset.pp); });
$('ppAdd').onclick = pplAddSheet;
$('ppCenter').onclick = () => { PPL.big = !PPL.big; pplRender(true); };

/* ── 인물 기록부 (v1.3.4) — 수사판에서 '나'든 다른 사람이든 누르면 똑같은 한 장짜리 서류 ──
   모두 같은 칸: 기본(이름·관계·무리 + 생일·나이·키 같은 항목, 항목은 더하고 뺄 수 있음) · 관계도 · 기억할 점 · 기타(🔒 비공개 줄) · 세희 메모 · 판에 나온 일.
   「고치기」를 누르면 같은 서류가 칸별 입력란으로. 세희는 update_person(person:'나' 포함)으로 채운다. 🔒 줄은 보고서·남에게 보이는 글에 절대 안 씀. */
const PD = { id:null, edit:false };
const INFO_HINT = ['생일', '나이', '키'];
async function meLoad(){ await pplLoad(); if (!PPL.me) PPL.me = { id:'me', name:'나', rel:'본인', group:'나', info:[], note:'', extra:[], notes:[], links:[], at:Date.now(), by:'boss' }; return PPL.me; }
const pdGet = id => id === 'me' ? PPL.me : pplFind(id);
function pdNorm(p){ p.info = p.info || []; p.extra = p.extra || []; p.story = p.story || []; p.notes = p.notes || []; p.links = p.links || []; return p; }
function sec(n, title, body){ return `<section class="pd-sec"><h3><i>${n}</i>${title}</h3>${body}</section>`; }
async function pdDoc(p, isMe){
  pdNorm(p);
  const E = PD.edit, col = isMe ? '#2b2417' : (GROUP_COLOR[p.group] || '#5c5340');
  const links = isMe ? (PPL.list || []) : p.links.map(x => pplFind(x)).filter(Boolean);
  const items = isMe ? [] : await pplItems(p.name);
  if (E){
    const hints = INFO_HINT.filter(h => !p.info.some(x => x.k === h));
    return `${sec(1, '기본', `<div class="pd-form">
        <label>이름<input id="pdName" value="${esc(p.name)}"></label>
        ${isMe ? '<label>관계<input value="본인" disabled></label>' : `<label>관계<input id="pdRel" value="${esc(p.rel || '')}" placeholder="예: 같이 일하는 조교"></label><label>무리<select id="pdGrp">${GROUPS.map(g => `<option ${g === p.group ? 'selected' : ''}>${g}</option>`).join('')}</select></label>`}
        <label>성별<select id="pdSex">${[['', '모름'], ['여', '여성'], ['남', '남성']].map(([v, t]) => `<option value="${v}" ${(p.sex || '') === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label></div>
        <div class="pd-rows" style="margin-top:8px">${p.info.map((x, i) => `<div class="pd-irow"><input data-ik="${i}" value="${esc(x.k)}" placeholder="항목"><input data-iv="${i}" value="${esc(x.v)}" placeholder="내용"><button class="pd-x" data-del="info" data-i="${i}">빼기</button></div>`).join('')}</div>
        <div class="pd-addrow">${hints.map(h => `<button class="pd-add" data-addk="${h}">+ ${h}</button>`).join('')}<button class="pd-add" data-addk="">+ 다른 항목</button></div>`)}
      ${sec(2, '기억할 점', `<textarea class="pd-ta" id="pdNote" placeholder="이 사람에 대해 기억할 것">${esc(p.note || '')}</textarea>`)}
      ${sec(3, '기타', `<div class="pd-rows">${p.extra.map((x, i) => `<div class="pd-lrow"><input data-l="${i}" value="${esc(x.text)}"><button class="pd-lock ${x.lock ? 'on' : ''}" data-lock="${i}">${x.lock ? '🔒 비공개' : '🔓 공개'}</button><button class="pd-x" data-del="extra" data-i="${i}">빼기</button></div>`).join('')}</div>
        <button class="pd-add" data-add="extra">+ 줄 더하기</button>`)}
      ${sec(4, '이야기 기록', `<div class="pd-rows">${p.story.map((x, i) => `<div class="pd-srow"><div class="pd-shead"><input data-sw="${i}" value="${esc(x.when || '')}" placeholder="언제 (${ymdDot(x.at)})"><button class="pd-lock ${x.lock ? 'on' : ''}" data-slock="${i}">${x.lock ? '🔒 비공개' : '🔓 공개'}</button><button class="pd-x" data-del="story" data-i="${i}">빼기</button></div><textarea class="pd-ta" data-s="${i}" placeholder="있었던 일·들은 이야기를 자세히">${esc(x.text)}</textarea></div>`).join('')}</div>
        <button class="pd-add" data-add="story">+ 이야기 더하기</button>`)}
      ${isMe ? '' : `<button class="pd-del" data-pdel="${p.id}">이 사람 떼기</button>`}`;
  }
  const kv = [['이름', esc(p.name)], ['관계', esc(isMe ? '본인' : (p.rel || '미정'))], ...(isMe ? [] : [['무리', `<span class="pd-chip" style="--c:${col}">${esc(p.group)}</span>`]]), ...(p.sex ? [['성별', p.sex === '여' ? '여성' : '남성']] : []), ...p.info.map(x => [esc(x.k), esc(x.v)])];
  const graph = isMe
    ? (links.length ? `<div class="pd-graph"><div class="pg-n me">나</div><div class="pg-e" style="--c:#a13b2c"><span>${links.length}명</span></div><div class="pg-ns">${links.map(x => `<button class="pg-n sm" data-pp="${x.id}" style="--c:${GROUP_COLOR[x.group] || '#5c5340'}">${esc(x.name)}</button>`).join('')}</div></div>` : '<p class="pd-empty">아직 아무도 없음</p>')
    : `<div class="pd-graph"><button class="pg-n me" data-pp="me">나</button><div class="pg-e" style="--c:${col}"><span>${esc(p.rel || p.group)}</span></div><div class="pg-n" style="--c:${col}">${esc(p.name)}</div>
      ${links.length ? `<div class="pg-e" style="--c:#c9a227"><span>아는 사이</span></div><div class="pg-ns">${links.map(x => `<button class="pg-n sm" data-pp="${x.id}" style="--c:${GROUP_COLOR[x.group] || '#5c5340'}">${esc(x.name)}</button>`).join('')}</div>` : ''}</div>`;
  let n = 0;
  return `${sec(++n, '기본', `<table class="pd-kv">${kv.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>${p.info.length ? '' : '<p class="pd-empty" style="margin-top:4px">생일·나이·키 같은 건 「고치기」에서</p>'}`)}
    ${sec(++n, '관계도', graph)}
    ${sec(++n, '기억할 점', p.note ? `<p class="pd-p">${esc(p.note)}</p>` : '<p class="pd-empty">아직 없음</p>')}
    ${sec(++n, '기타', p.extra.length ? `<ul class="pd-ul">${p.extra.map(x => `<li class="${x.lock ? 'lk' : ''}">${x.lock ? '<span class="pd-stamp">비공개</span>' : ''}${esc(x.text)}</li>`).join('')}</ul>` : '<p class="pd-empty">아직 없음</p>')}
    ${sec(++n, '이야기 기록', p.story.length ? `<ol class="pd-story">${p.story.slice().reverse().map(x => `<li class="${x.lock ? 'lk' : ''}"><div class="pd-sw">${esc(storyWhen(x))}${x.lock ? '<span class="pd-stamp">비공개</span>' : ''}${x.by === 'sehee' ? '<em>세희가 적음</em>' : ''}</div><p>${esc(x.text)}</p></li>`).join('')}</ol>` : '<p class="pd-empty">아직 없음 — 세희에게 이 사람 이야기를 들려주면 날짜별로 적어요</p>')}
    ${p.notes.length ? sec(++n, '세희 메모', `<ul class="pd-ul">${p.notes.slice().reverse().map(x => `<li>${esc(x.text)} <small>${ymdDot(x.at)}</small></li>`).join('')}</ul>`) : ''}
    ${isMe ? '' : sec(++n, '판에 나온 일', items.length ? `<ul class="pd-ul">${items.map(h => `<li class="${h.it.done ? 'done' : ''}">${esc(h.it.text)} <small>${mdDay(h.date)}</small></li>`).join('')}</ul>` : '<p class="pd-empty">아직 없음</p>')}`;
}
async function pdRender(){
  const isMe = PD.id === 'me'; if (isMe) await meLoad();
  const p = pdGet(PD.id); if (!p){ pdClose(); return; } pdNorm(p);
  const col = isMe ? '#2b2417' : (GROUP_COLOR[p.group] || '#5c5340');
  $('pdT').textContent = '인물 기록부 · ' + p.name;
  $('pdEdit').textContent = PD.edit ? '다 됐어요' : '고치기';
  $('pdBody').innerHTML = `<div class="pd-paper${PD.edit ? ' editing' : ''}">
    <div class="pd-top"><span class="pd-kind">인물 기록</span><span class="pd-no">${isMe ? 'PER-000' : 'PER-' + String(p.id).slice(-4).toUpperCase()}</span></div>
    <div class="pd-id"><button class="pd-photo${PPL.pics && PPL.pics[isMe ? 'me' : p.id] ? ' pic' : SIL[p.sex] ? ' sx' : ''}" data-pdpic="${isMe ? 'me' : p.id}" style="--c:${col}" aria-label="프로필 사진">${pplFace(p, isMe ? 'me' : p.id)}<i class="pd-cam">📷</i></button>
      <div><h1>${esc(p.name)}</h1><p>${esc(isMe ? '본인' : (p.rel || '관계 미정') + ' · ' + p.group)}</p></div>
      ${[...p.extra, ...p.story].some(x => x.lock) ? '<span class="pd-stamp big">대외비</span>' : ''}</div>
    ${await pdDoc(p, isMe)}
    <div class="pd-foot">세희 · 인간관계 판 · ${ymdDot(Date.now())}${[...p.extra, ...p.story].some(x => x.lock) ? ' · 🔒 줄은 보고서·남에게 보이는 글에 쓰지 않음' : ''}</div></div>`;
}
async function pdOpen(id){ await pplLoad(); if (id === 'me') await meLoad(); PD.id = id; PD.edit = false; await pdRender(); $('pd').classList.add('on'); $('pdBody').scrollTop = 0; }
function pdClose(){ $('pd').classList.remove('on'); PD.id = null; PD.edit = false; }
function pdCollect(p){
  const v = id => { const el = document.getElementById(id); return el ? el.value.trim() : null; };
  if (v('pdName')) p.name = v('pdName').slice(0, 30);
  if (p.id !== 'me'){ if (v('pdRel') !== null) p.rel = v('pdRel').slice(0, 60); if (v('pdGrp')) p.group = v('pdGrp'); }
  if (v('pdNote') !== null) p.note = v('pdNote').slice(0, 1500);
  if (v('pdSex') !== null){ if (v('pdSex')) p.sex = v('pdSex'); else delete p.sex; }
  for (const el of document.querySelectorAll('#pdBody [data-ik]')){ const x = p.info[Number(el.dataset.ik)]; if (x) x.k = el.value.trim().slice(0, 20); }
  for (const el of document.querySelectorAll('#pdBody [data-iv]')){ const x = p.info[Number(el.dataset.iv)]; if (x) x.v = el.value.trim().slice(0, 80); }
  for (const el of document.querySelectorAll('#pdBody [data-l]')){ const x = p.extra[Number(el.dataset.l)]; if (x) x.text = el.value.trim().slice(0, 400); }
  for (const el of document.querySelectorAll('#pdBody [data-s]')){ const x = p.story[Number(el.dataset.s)]; if (x) x.text = el.value.trim().slice(0, STORY_MAX); }
  for (const el of document.querySelectorAll('#pdBody [data-sw]')){ const x = p.story[Number(el.dataset.sw)]; if (x) x.when = el.value.trim().slice(0, 30) || null; }
}
$('pd').addEventListener('click', async e => {
  const t = e.target;
  const pic = t.closest('[data-pdpic]'); if (pic){ if (PD.edit){ const q = pdGet(PD.id); if (q){ pdNorm(q); pdCollect(q); } } return picSheet(pic.dataset.pdpic); }
  if (t.closest('[data-pd="close"]')) return pdClose();
  /* 서류 바깥 빈 곳을 누르면 닫힘(고치던 중이면 저장하고) — v1.3.6 */
  if (t.closest('#pdBody') && !t.closest('.pd-paper')){
    const q = pdGet(PD.id);
    if (PD.edit && q){ pdNorm(q); pdCollect(q); q.info = q.info.filter(x => x.k && x.v); q.extra = q.extra.filter(x => x.text); q.story = q.story.filter(x => x.text); await pplSave(); if (DW.open === 'people') pplRender(); toast('서류를 고쳤어요'); }
    return pdClose();
  }
  const pp = t.closest('.pd-graph [data-pp]'); if (pp && !PD.edit){ if (pp.dataset.pp === 'me') await meLoad(); PD.id = pp.dataset.pp; return pdRender(); }
  const p = pdGet(PD.id); if (!p) return; pdNorm(p);
  if (t.closest('#pdEdit')){
    if (PD.edit){ pdCollect(p); p.info = p.info.filter(x => x.k && x.v); p.extra = p.extra.filter(x => x.text); p.story = p.story.filter(x => x.text); await pplSave(); if (DW.open === 'people') pplRender(); toast('서류를 고쳤어요'); }
    PD.edit = !PD.edit; return pdRender();
  }
  if (!PD.edit) return;
  pdCollect(p);
  const addk = t.closest('[data-addk]'), add = t.closest('[data-add]'), del = t.closest('[data-del]'), lk = t.closest('[data-lock]');
  if (addk){ p.info.push({ k:addk.dataset.addk, v:'' }); await pdRender(); const ins = document.querySelectorAll('#pdBody [data-iv]'); const last = ins[ins.length - 1]; if (last) (addk.dataset.addk ? last : document.querySelectorAll('#pdBody [data-ik]')[ins.length - 1]).focus(); return; }
  if (add){ if (add.dataset.add === 'story'){ p.story.push({ at:Date.now(), when:null, text:'', lock:false, by:'boss' }); await pdRender(); const t2 = document.querySelectorAll('#pdBody [data-s]'); if (t2.length) t2[t2.length - 1].focus(); return; } p.extra.push({ text:'', lock:false }); return pdRender(); }
  const sl = t.closest('[data-slock]'); if (sl){ const x = p.story[Number(sl.dataset.slock)]; if (x) x.lock = !x.lock; return pdRender(); }
  if (del){ p[del.dataset.del].splice(Number(del.dataset.i), 1); return pdRender(); }
  if (lk){ const x = p.extra[Number(lk.dataset.lock)]; if (x) x.lock = !x.lock; return pdRender(); }
  const pdel = t.closest('[data-pdel]');
  if (pdel){ if (!pdel.classList.contains('armed')){ pdel.classList.add('armed'); pdel.textContent = '한 번 더 누르면 떼요'; return; }
    PPL.list = PPL.list.filter(x => x !== p); for (const x of PPL.list) x.links = (x.links || []).filter(id => id !== p.id);
    if (PPL.pics && PPL.pics[p.id]){ delete PPL.pics[p.id]; await pplPicSave(); }
    await pplSave(); pdClose(); if (DW.open === 'people') pplRender(); }
});

/* 판 견출지 — 사무실 왼쪽 끝. 누르거나 오른쪽으로 끌면(손가락을 따라) 판으로. 글 쓰는 중에도 보인다 */
(function panTab(){
  const t = $('panTab'); let g = null;
  t.addEventListener('pointerdown', e => { g = { x:e.clientX, t:performance.now(), moved:false }; try{ t.setPointerCapture(e.pointerId); }catch(x){} e.preventDefault(); });
  t.addEventListener('pointermove', e => {
    if (!g) return; const dx = Math.max(0, e.clientX - g.x); if (!g.moved && dx < 6) return; g.moved = true;
    const el = $('office'); el.style.transition = 'none'; el.style.transform = `translateX(${Math.round(dx)}px)`; el.style.opacity = String(Math.max(0.4, 1 - dx / 600));
  });
  const up = e => {
    if (!g) return; const dx = e.clientX - g.x, v = dx / Math.max(1, performance.now() - g.t), moved = g.moved; g = null;
    const el = $('office');
    const go = () => { el.style.transition = ''; el.style.transform = ''; el.style.opacity = ''; if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); SWIPE.anim = 'slide-inL'; goView('pan'); };
    if (!moved || dx > 90 || v > 0.45) go();
    else { el.style.transition = 'transform .18s ease, opacity .18s ease'; el.style.transform = ''; el.style.opacity = ''; setTimeout(() => { el.style.transition = ''; }, 200); }
  };
  t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up);
})();
