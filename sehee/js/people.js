/* ── 인간관계 판 (v1.2) — 나를 가운데 두고 사람 카드가 방사형으로 붙는 수사판 ──
   빨간 실이 나에서 각 사람으로, 서로 아는 사람끼리도 실로 잇는다. 무리마다 부채꼴 방향이 정해져 있다.
   v1.5.12 보편 설계 — 무리는 사용자 것(이름·색·순서를 바꾸고 더하고 뺀다). 앱에는 특정 직업용 무리·예시를 박지 않는다.
   세희가 대화에서 한 명씩 붙이고(add_person), 보스도 「+ 사람」으로 직접 붙인다. 카드를 누르면 메모·관련 판 항목이 나온다. */
const PPL = { list:null, changed:null };
/* 무리 (v1.5.12) — 사용자마다 다르다. 처음 쓰는 사람은 아래 기본, 이미 쓰던 사람은 쓰던 무리를 그대로 이어 받는다.
   GROUPS·GROUP_COLOR 는 그 자리에서 고쳐 쓰는 살아 있는 목록(다른 코드는 예전처럼 읽기만 하면 됨). '기타'는 늘 맨 끝에 있고 못 지운다(갈 곳 없는 사람이 가는 자리). */
const GROUP_DEFAULT = [['직장', '#3a6b64'], ['친구', '#6b5b95'], ['가족', '#a13b2c'], ['손님·거래처', '#8a6d3b'], ['지인', '#3d5a80'], ['기타', '#5c5340']];
const GROUP_PALETTE = ['#3a6b64', '#6b5b95', '#a13b2c', '#8a6d3b', '#3d5a80', '#2f6e4f', '#9a4f7a', '#b0662e', '#4f6d7a', '#7a6a2f', '#5c5340'];
const GROUPS = [], GROUP_COLOR = {};
function pplGroupsSet(arr){
  GROUPS.length = 0; for (const k of Object.keys(GROUP_COLOR)) delete GROUP_COLOR[k];
  for (const g of arr){ const n = String(g.name || '').trim().slice(0, 12); if (!n || n === '나' || GROUPS.includes(n) || n === '기타') continue; GROUPS.push(n); GROUP_COLOR[n] = g.color || pplFreeColor(); }
  const etc = arr.find(g => g.name === '기타'); GROUPS.push('기타'); GROUP_COLOR['기타'] = (etc && etc.color) || '#5c5340';
}
function pplFreeColor(){ const used = new Set(Object.values(GROUP_COLOR)); return GROUP_PALETTE.find(c => !used.has(c)) || GROUP_PALETTE[Object.keys(GROUP_COLOR).length % GROUP_PALETTE.length]; }
const pplGroupsOut = () => GROUPS.map(n => ({ name:n, color:GROUP_COLOR[n] }));
pplGroupsSet(GROUP_DEFAULT.map(([name, color]) => ({ name, color })));
async function pplLoad(){ if (!PPL.list){ const d = (await kvGet('people')) || {}; PPL.list = d.list || []; PPL.theme = d.theme || 'cork'; PPL.me = d.me || null; PPL.ties = d.ties || [];
    if (Array.isArray(d.groups) && d.groups.length) pplGroupsSet(d.groups);
    else {   /* 처음 — 이미 쓰던 사람이면 그 무리를 기본 앞에 그대로 살린다(예전 '학생·학부모' 같은 것) */
      const old = { '학생·학부모':'#8a6d3b' }, base = GROUP_DEFAULT.map(([name, color]) => ({ name, color })), used = [...new Set(PPL.list.map(p => p.group).filter(Boolean))];
      for (const g of used) if (!base.some(b => b.name === g)) base.splice(base.length - 1, 0, { name:g, color:null, keep:old[g] });
      pplGroupsSet(base); for (const b of base) if (b.keep && !Object.values(GROUP_COLOR).includes(b.keep)) GROUP_COLOR[b.name] = b.keep;
      if (PPL.list.length) setTimeout(() => pplSave(), 0);
    }
    for (const p of PPL.list) if (!GROUPS.includes(p.group)) p.group = '기타';
  } if (!PPL.pics) PPL.pics = (await kvGet('pplpics')) || {}; await clueLoad(); return PPL.list; }
const pplSave = () => { tiesSync(); return kvSet('people', { list:PPL.list, theme:PPL.theme || 'cork', groups:pplGroupsOut(), ties:PPL.ties || [], ...(PPL.me ? { me:PPL.me } : {}) }); };
/* 무리 고치기 — 이름 바꾸면 그 무리 사람도 따라가고, 지운 무리 사람은 '기타'로 */
function pplGroupsApply(next, renames){
  for (const p of PPL.list){ if (renames[p.group]) p.group = renames[p.group]; }
  pplGroupsSet(next); for (const p of PPL.list) if (!GROUPS.includes(p.group)) p.group = '기타';
}
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
  return `- ${isMe ? '나(보스 본인)' : '#' + p.id + ' ' + p.name + ' · ' + pplRelTxt(p) + ' · ' + p.group}${p.sex ? ' · ' + p.sex : ''}${info ? ' · ' + info : ''}${isMe ? '' : pplStatTxt(p)}${p.note ? ' — ' + p.note.replace(/\n/g, ' ').slice(0, 80) : ''}${(p.extra || []).length ? ` · 기타 ${p.extra.length}줄` : ''}${st.length ? ` · 이야기 ${st.length}건(최근 ${storyWhen(st[st.length - 1])})` : ''}`;
}
const storyWhen = x => x.when || ymdDot(x.at);
const pplRelTxt = p => { const r = relSure(p); return r === 'none' ? '나와의 관계 안 밝혀짐(실 없음)' : `나에게: ${p.rel || '?'}${r === 'guess' ? '(추측)' : ''}${isKin(p) ? '·가족' : ''}`; };
const pplStatTxt = p => { const st = p.stat || {}; const w = ['close', 'temp', 'moral'].filter(k => st[k]).map(k => `${statName(k)} ${statTxt(k, st[k])}(${byTxt(st[k].by)})`); return w.length ? ' · ' + w.join(' · ') : ''; };
function pplFull(p, isMe){
  const info = (p.info || []).map(x => `${x.k} ${x.v}`).join(', ');
  const out = [`- ${isMe ? '나(보스 본인)' : '#' + p.id + ' ' + p.name + ' · ' + pplRelTxt(p) + ' · ' + p.group}${p.sex ? ' · ' + p.sex : ''}${info ? ' · ' + info : ''}${isMe ? '' : pplStatTxt(p)}${PPL.pics && PPL.pics[isMe ? 'me' : p.id] ? ' · 프로필 사진 있음' : ''}`];
  if (p.note) out.push('  기억할 점: ' + p.note.replace(/\n/g, ' / '));
  for (const x of p.extra || []) out.push(`  기타: ${x.lock ? '[비공개] ' : ''}${x.text}`);
  const st = (p.story || []).slice(-12);
  if (st.length) out.push(`  이야기 기록(오래된 것부터, 모두 ${(p.story || []).length}건):`, ...st.map(x => `    · ${storyWhen(x)} ${x.lock ? '[비공개] ' : ''}${x.text.replace(/\n/g, ' / ').slice(0, 700)}`));
  const ns = (p.notes || []).slice(-5); if (ns.length) out.push('  세희 메모: ' + ns.map(x => x.text).join(' / '));
  const ties = isMe ? [] : (PPL.ties || []).filter(t => t.a === p.id || t.b === p.id).map(t => { const v = tieOf(t, p.id), o = pplFind(v.other); return o ? `${o.name}(${[v.mine && '이 사람은 ' + v.mine, v.theirs && '그쪽은 ' + v.theirs, t.kin && '가족', t.sure === 'guess' && '추측', t.close && '친밀도 ' + t.close.v + '·' + byTxt(t.close.by)].filter(Boolean).join(', ') || '아는 사이'})` : ''; }).filter(Boolean);
  if (ties.length) out.push('  사람끼리 실: ' + ties.join(' / '));
  const lg = (p.statLog || []).slice(-3); if (lg.length) out.push('  능력치 바뀐 기록: ' + lg.map(x => `${ymdDot(x.at)} ${statName(x.k)} ${x.from ?? '?'}→${x.v ?? '지움'}(${byTxt(x.by)}${x.why ? ', ' + x.why : ''})`).join(' / '));
  const cl = cluesOf(isMe ? 'me' : p.id); if (cl.length) out.push(`  사진 단서(모두 ${cl.length}장 — 사진 속은 세희가 못 봄, 보스가 적은 설명만):`, ...cl.slice(-10).map(x => `    · ${x.when || ymdDot(x.at)} ${x.lock ? '[비공개] ' : ''}${x.text || '(설명 없음)'}${x.people.length > 1 ? ' — 같이: ' + x.people.filter(i => i !== (isMe ? 'me' : p.id)).map(i => i === 'me' ? '나' : (pplFind(i) || {}).name).filter(Boolean).join(', ') : ''}`));
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
  return ['인간관계 판 기록부 — 보스 혼자 보는 사적인 사람 수첩(나 포함). 무리: ' + GROUPS.join('·'),
    PPL.me ? '나:\n' + pplFull(PPL.me, true) : '',
    hot.length ? '요 몇 마디에 나온 사람(전부 자세히):\n' + hot.map(p => pplFull(p)).join('\n') : '',
    brief.length ? '나머지(짧게 — 자세한 건 read_person):\n' + brief.join('\n') : '',
    anyLock ? '[비공개] 줄은 보스와 단둘이 하는 이야기에서는 마음껏 쓴다. 보고서·보드 카드·판 항목·남에게 보낼 글처럼 남이 볼 수 있는 곳에는 쓰지 않는다.' : ''].filter(Boolean).join('\n');
}
const PEOPLE_TOOLS = () => [
  { name:'add_person', description:'인간관계 판에 사람 한 명을 붙인다. 보스가 추가하라고 할 때만. 한 번에 한 명.', schema:{ type:'object', properties:{
    name:{ type:'string', description:'이름 또는 보스가 부르는 말 그대로. 예: 김지민 팀장, 수진이' },
    relation:{ type:'string', description:'보스와의 관계 한 줄. 예: 같은 팀 선배, 대학 동기, 단골 손님' },
    group:{ type:'string', enum:GROUPS, description:"무리(보스가 쓰는 무리 중에서). 맞는 게 없으면 '기타' — 새 무리가 필요하면 보스에게 물어 edit_groups" },
    note:{ type:'string', description:'기억할 점 한 줄(선택)' },
    info:{ type:'array', description:'기본 항목(선택). 예: 생일·나이·키', items:{ type:'object', properties:{ key:{ type:'string' }, value:{ type:'string' } } } },
    add_extra:{ type:'array', description:'기타 줄(선택) — update_person 과 같음', items:{ type:'object', properties:{ text:{ type:'string' }, lock:{ type:'boolean' } } } },
    add_story:{ type:'array', description:'이야기 기록(선택) — update_person 과 같음', items:{ type:'object', properties:{ text:{ type:'string' }, when:{ type:'string' }, lock:{ type:'boolean' } } } },
    sex:{ type:'string', enum:['여', '남'], description:'성별(선택) — 사진이 없을 때 기본 얼굴. 관계·호칭으로 분명할 때만(어머니·아버지·언니·형 등). 이름만으로 짐작하지 않는다' },
    photo:{ type:'integer', description:'프로필 사진(선택) — 보스가 이번에 보낸 사진 중 몇 번째(1부터)를 이 사람 프로필 사진으로. 보스가 사진을 보내며 이 사람 사진·프사로 하라고 할 때만' },
    relation_sure:{ type:'string', enum:['확실', '추측', '모름'], description:'보스와의 관계가 밝혀졌나. 추측이면 판에 ? 실, 모름이면 실을 긋지 않는다' },
    family:{ type:'boolean', description:'보스의 가족(혈연·혼인)이면 true — 가족 모양 실' },
    closeness:{ type:'string', enum:GRADE_ALL, description:'보스와의 친밀도 S~F(+/- 한 칸). 보스가 말했거나 단서가 분명할 때만' },
    emotion:{ type:'integer', minimum:1, maximum:5, description:'감정 온도 1 무감정·계산적 ~ 5 아주 감정적' },
    morality:{ type:'integer', minimum:-2, maximum:2, description:'선악 -2 아주 나쁨 ~ +2 아주 착함(0 보통)' },
    stat_why:{ type:'string', description:'능력치를 매긴 근거 한 줄(단서). 능력치를 넣을 땐 꼭' },
    boss_said:{ type:'boolean', description:'보스가 이번에 그 값을 직접 말했으면 true — 보스가 확정한 값도 바꾼다. 세희 판단이면 비움' },
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
    relation_sure:{ type:'string', enum:['확실', '추측', '모름'], description:'보스와의 관계가 밝혀졌나. 추측이면 판에 ? 실, 모름이면 실을 긋지 않는다' },
    family:{ type:'boolean', description:'보스의 가족(혈연·혼인)이면 true — 가족 모양 실' },
    closeness:{ type:'string', enum:GRADE_ALL, description:'보스와의 친밀도 S~F(+/- 한 칸). 보스가 말했거나 단서가 분명할 때만' },
    emotion:{ type:'integer', minimum:1, maximum:5, description:'감정 온도 1 무감정·계산적 ~ 5 아주 감정적' },
    morality:{ type:'integer', minimum:-2, maximum:2, description:'선악 -2 아주 나쁨 ~ +2 아주 착함(0 보통)' },
    stat_why:{ type:'string', description:'능력치를 매긴 근거 한 줄(단서). 능력치를 넣을 땐 꼭' },
    boss_said:{ type:'boolean', description:'보스가 이번에 그 값을 직접 말했으면 true — 보스가 확정한 값도 바꾼다. 세희 판단이면 비움' },
    add_note:{ type:'string', description:'세희 메모 한 줄' }, link_to:{ type:'string', description:'잇고 싶은 다른 사람 이름' } }, required:['person'] } },
  { name:'tie_person', description:'판에 있는 두 사람 사이에 실을 잇거나 고친다(보스 본인과의 관계는 update_person). 실 위에 양쪽 관계 이름이 붙는다 — 예: 엄마와 딸이면 person_is:"엄마", other_is:"딸". 친구면 둘 다 "친구". 그들끼리의 친밀도는 보스가 본 그들 사이.',
    schema:{ type:'object', properties:{ person:{ type:'string', description:'사람 이름 또는 id' }, other:{ type:'string', description:'다른 사람 이름 또는 id' },
      person_is:{ type:'string', description:'person 이 other 에게 무엇인지(예: 엄마, 삼촌, 친구, 팀장)' }, other_is:{ type:'string', description:'other 가 person 에게 무엇인지(예: 딸, 조카, 친구, 팀원)' },
      family:{ type:'boolean', description:'둘이 가족이면 true' }, guess:{ type:'boolean', description:'추측이면 true(판에 ?)' },
      closeness:{ type:'string', enum:GRADE_ALL, description:'둘 사이 친밀도(선택)' }, why:{ type:'string', description:'근거 한 줄' }, boss_said:{ type:'boolean' } }, required:['person', 'other'] } },
  { name:'untie_person', description:'두 사람 사이 실을 끊는다. 보스가 둘이 관계없다고 하거나 지우라고 할 때만.', schema:{ type:'object', properties:{ person:{ type:'string' }, other:{ type:'string' } }, required:['person', 'other'] } },
  { name:'edit_groups', description:'인간관계 판의 무리(묶음)를 고친다. 보스가 무리를 만들거나 이름을 바꾸거나 없애라고 할 때만. 이름을 바꾸면 그 무리 사람도 따라가고, 없앤 무리 사람은 기타로 간다. 기타는 못 없앤다.',
    schema:{ type:'object', properties:{ add:{ type:'array', items:{ type:'string' }, description:'새 무리 이름들' },
      rename:{ type:'array', items:{ type:'object', properties:{ from:{ type:'string' }, to:{ type:'string' } }, required:['from', 'to'] } },
      remove:{ type:'array', items:{ type:'string' } } } } },
  { name:'read_person', description:'한 사람의 기록부 전체(기타·이야기 기록 전부 포함)를 읽는다. 맥락에 짧게만 나온 사람을 자세히 알아야 할 때.', schema:{ type:'object', properties:{ person:{ type:'string', description:"사람 id(# 없이) 또는 이름. 보스 본인이면 '나'" } }, required:['person'] } },
  { name:'clue_to_person', description:'인물 기록부의 「사진 단서」에 사진을 붙인다 — "이 사람과 이런 일이 있었지" 갤러리. 보스가 사진을 보내며 그 사람(들) 단서·갤러리·기록에 붙이라고 할 때만. 사진 속은 네가 설명하지 말고 보스가 한 말로 text 를 적는다.', schema:{ type:'object', properties:{
      people:{ type:'array', items:{ type:'string' }, description:"사진에 얽힌 사람들 — id(# 없이) 또는 이름. 보스 본인은 '나'" },
      photo:{ type:'integer', description:'보스가 이번에 보낸 사진 중 몇 번째(1부터). 여러 장이면 photos' },
      photos:{ type:'array', items:{ type:'integer' }, description:'여러 장을 한 번에(같은 설명)' },
      text:{ type:'string', description:'한 줄 설명 — 무슨 일이었는지(보스 말 그대로에 가깝게)' },
      when:{ type:'string', description:'언제(선택) — YYYY-MM-DD 또는 "2026-11 초"처럼' },
      lock:{ type:'boolean', description:'비공개(선택)' } }, required:['people'] } },
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
/* 능력치·나와의 관계 — add/update 공통. 보스가 확정한 값을 못 바꿨으면 그 이름을 돌려준다 */
function pplApplyStat(p, a){
  const held = [], force = !!a.boss_said, by = force ? 'boss' : 'sehee';
  if (a.relation_sure) p.relSure = a.relation_sure === '추측' ? 'guess' : a.relation_sure === '모름' ? 'none' : 'yes';
  if (typeof a.family === 'boolean') p.kin = a.family;
  for (const [k, v] of [['close', a.closeness], ['temp', a.emotion], ['moral', a.morality]]){
    if (v === undefined || v === null || v === '') continue;
    if (statSet(p, k, k === 'close' ? String(v) : Number(v), by, a.stat_why, force) === 'boss') held.push(statName(k));
  }
  return held;
}
/* 세희가 무엇을 고쳤는지 대화창에 한 줄로 */
function pplWhat(a){ const w = [];
  if (a.info && a.info.length) w.push('항목 ' + a.info.length); if (a.note) w.push('기억할 점'); if (a.add_extra && a.add_extra.length) w.push('기타 ' + a.add_extra.length + '줄');
  if (a.add_story && a.add_story.length) w.push('이야기 ' + a.add_story.length + '건'); if (a.closeness) w.push('친밀도 ' + a.closeness); if (a.emotion) w.push('감정 온도 ' + a.emotion); if (a.morality !== undefined && a.morality !== null && a.morality !== '') w.push('선악 ' + (a.morality > 0 ? '+' : '') + a.morality); if (a.relation_sure) w.push('관계 ' + a.relation_sure); if (a.photo) w.push('프로필 사진'); if (a.sex === '여' || a.sex === '남') w.push(a.sex === '여' ? '여성' : '남성'); if (a.add_note) w.push('세희 메모'); if (a.link_to) w.push('관계 잇기');
  return w.length ? ' — ' + w.join(' · ') : ''; }
function pplLink(a, b){ if (!a || !b || a === b) return; if (!tieFind(a.id, b.id)) tieSet(a, b, {}); }
/* ── 공식 능력치·관계 실 (v1.5.16, A) — 판에 그리기는 2단계(B 의 '판 자유롭게' 뒤) ──
   나와의 관계: p.rel(나에게 무엇인지) · p.relSure 'yes'(확실) | 'guess'(추측 → ?) | 'none'(안 밝혀짐 → 실 없음) · p.kin(가족 → 가족 모양 실).
   공식 능력치 p.stat = { close:{v:'A+',by,at,why}, temp:{v:1~5}, moral:{v:-2~2} } — 친밀도(실 색·굵기) · 감정 온도(카드 바탕 회색→연두) · 선악(善/惡 도장).
   누가 매겼나(by:'boss'|'sehee')와 근거는 p.statLog 에 쌓인다. 보스가 매긴 값은 세희가 바로 못 바꾼다(제안만).
   사람끼리 실: PPL.ties = [{ id, a, b, aIs:'엄마'(a 가 b 에게), bIs:'딸', kin, sure:'yes'|'guess', close:{v,by,at,why} }]. p.links 는 ties 에서 다시 만든다(옛 코드·실험 파일 호환). */
const GRADE_ALL = ['S+', 'S', 'S-', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F+', 'F', 'F-'];
const TEMP_NAME = ['', '무감정·계산적', '차분한 편', '보통', '감정적인 편', '아주 감정적'];
const MORAL_NAME = { '-2':'아주 나쁨', '-1':'나쁜 편', '0':'보통', '1':'착한 편', '2':'아주 착함' };
const relSure = p => p.relSure || (p.rel ? 'yes' : 'none');
const isKin = p => p.kin !== undefined ? !!p.kin : p.group === '가족';
function statOk(k, v){ if (k === 'close') return GRADE_ALL.includes(v); if (k === 'temp') return Number.isInteger(v) && v >= 1 && v <= 5; if (k === 'moral') return Number.isInteger(v) && v >= -2 && v <= 2; return false; }
function statSet(p, k, v, by, why, force){
  if (!statOk(k, v)) return 'bad';
  p.stat = p.stat || {}; const old = p.stat[k];
  if (old && old.by === 'boss' && by === 'sehee' && !force) return 'boss';
  if (old && old.v === v && old.by === by) return 'same';
  p.stat[k] = { v, by, at:Date.now(), why:String(why || '').trim().slice(0, 120) };
  p.statLog = [...(p.statLog || []), { k, v, from:old ? old.v : null, by, at:Date.now(), why:String(why || '').trim().slice(0, 120) }].slice(-40);
  return 'ok';
}
function statClear(p, k, by){ if (!p.stat || !p.stat[k]) return; const old = p.stat[k]; delete p.stat[k]; p.statLog = [...(p.statLog || []), { k, v:null, from:old.v, by, at:Date.now(), why:'지움' }].slice(-40); }
const statTxt = (k, x) => !x ? '모름' : k === 'close' ? x.v : k === 'temp' ? `${x.v}/5 ${TEMP_NAME[x.v]}` : `${x.v > 0 ? '+' : ''}${x.v} ${MORAL_NAME[x.v]}`;
const byTxt = by => by === 'boss' ? '보스' : '세희 판단';
const statName = k => k === 'close' ? '친밀도' : k === 'temp' ? '감정 온도' : '선악';
function tieFind(x, y){ return (PPL.ties || []).find(t => (t.a === x && t.b === y) || (t.a === y && t.b === x)); }
function tieSet(pa, pb, o){
  PPL.ties = PPL.ties || []; let t = tieFind(pa.id, pb.id);
  if (!t){ t = { id:uid(), a:pa.id, b:pb.id, aIs:'', bIs:'', kin:false, sure:'yes', close:null, at:Date.now() }; PPL.ties.push(t); }
  const flip = t.a !== pa.id;   /* o 는 pa 쪽에서 본 말 — 저장 방향에 맞춰 넣는다 */
  if (o.paIs !== undefined) t[flip ? 'bIs' : 'aIs'] = String(o.paIs || '').trim().slice(0, 12);
  if (o.pbIs !== undefined) t[flip ? 'aIs' : 'bIs'] = String(o.pbIs || '').trim().slice(0, 12);
  if (o.kin !== undefined) t.kin = !!o.kin;
  if (o.sure) t.sure = o.sure === 'guess' ? 'guess' : 'yes';
  if (o.close !== undefined){ if (o.close === null || o.close === '') t.close = null; else if (GRADE_ALL.includes(o.close) && !(t.close && t.close.by === 'boss' && o.by === 'sehee' && !o.force)) t.close = { v:o.close, by:o.by || 'boss', at:Date.now(), why:String(o.why || '').slice(0, 120) }; }
  return t;
}
function tieDel(x, y){ PPL.ties = (PPL.ties || []).filter(t => !((t.a === x && t.b === y) || (t.a === y && t.b === x)));
  for (const p of PPL.list || []) if (p.id === x || p.id === y) p.links = (p.links || []).filter(id => id !== x && id !== y); }
const tieOf = (t, pid) => { const me = t.a === pid; return { other:me ? t.b : t.a, mine:me ? t.aIs : t.bIs, theirs:me ? t.bIs : t.aIs }; };
/* 저장 전 — 옛 links 를 실로 옮기고(실험 파일이 직접 넣었어도), 없는 사람 실은 버리고, links 를 실에서 다시 만든다 */
function tiesSync(){
  if (!PPL.list) return; PPL.ties = PPL.ties || []; const ids = new Set(PPL.list.map(p => p.id));
  for (const p of PPL.list) for (const id of p.links || []) if (ids.has(id) && id !== p.id && !tieFind(p.id, id)) PPL.ties.push({ id:uid(), a:p.id, b:id, aIs:'', bIs:'', kin:false, sure:'yes', close:null, at:Date.now() });
  PPL.ties = PPL.ties.filter(t => ids.has(t.a) && ids.has(t.b) && t.a !== t.b);
  for (const p of PPL.list) p.links = [];
  for (const t of PPL.ties){ pplFind(t.a).links.push(t.b); pplFind(t.b).links.push(t.a); }
}
/* 판 그리기(2단계)에서 쓸 모양 — 친밀도 → 실 색·굵기, 가족 → 이중선, 추측 → 연필 점선 + ?, 안 밝혀짐 → 없음 */
const CLOSE_LOOK = { S:['#b0182a', 6], A:['#d23a2e', 4.6], B:['#e0703f', 3.4], C:['#c99a6b', 2.4], D:['#9c968a', 1.6], F:['#3f4a5a', 1.6] };
function lineLook(close, kin, sure){
  if (sure === 'none') return null;
  if (sure === 'guess') return { color:'#9c968a', width:1.4, dash:'4 4', double:false, mark:'?' };
  const g = close && close.v, base = g ? CLOSE_LOOK[g[0]] : ['#c0392b', 2], w = base[1] + (g && g[1] === '+' ? 0.6 : g && g[1] === '-' ? -0.6 : 0);
  return { color:base[0], width:Math.max(1, w), dash:g && g[0] === 'F' ? '2 5' : '', double:!!kin, mark:'' };
}
const TEMP_COLOR = ['', '#d3d1c7', '#e2dfd2', '#ece6d3', '#dfecc2', '#cfe8a5'];
const cardTint = p => p.stat && p.stat.temp ? TEMP_COLOR[p.stat.temp.v] : null;
const moralStamp = p => { const m = p.stat && p.stat.moral ? p.stat.moral.v : 0; return m > 0 ? { ch:'善', strong:m === 2 } : m < 0 ? { ch:'惡', strong:m === -2 } : null; };
/* v1.5.5 성별·프로필 사진 — add/update 공통. 사진을 못 찾으면 그 까닭을 돌려준다 */
async function pplApplyLook(p, id, a){
  if (a.sex === '여' || a.sex === '남') p.sex = a.sex;
  if (a.photo === undefined || a.photo === null || a.photo === '') return null;
  const u = bossPic(a.photo); if (!u) return '보스가 보낸 사진을 찾지 못함(앱을 다시 켜면 앞서 보낸 사진은 사라짐) — 보스에게 사진을 다시 같이 보내 달라고 하거나, 인물 기록부의 사진칸을 눌러 넣는 법을 알려 준다';
  try{ PPL.pics[id] = await picThumb(u); await pplPicSave(); return 'ok'; }catch(e){ return '사진을 못 열었음'; }
}
async function runPeopleTool(c){
  await pplLoad(); await clueLoad(); const a = c.args || {};
  if (c.name === 'clue_to_person') return clueTool(a);   /* 이름이 _person 으로 끝나야 ai.js 가 여기로 보낸다 */
  if (c.name === 'edit_groups'){
    const next = pplGroupsOut(), renames = {}, did = [];
    for (const r of a.rename || []){ const from = String(r.from || '').trim(), to = String(r.to || '').trim().slice(0, 12); const g = next.find(x => x.name === from);
      if (g && to && from !== '기타' && !next.some(x => x.name === to)){ g.name = to; renames[from] = to; did.push(from + ' → ' + to); } }
    for (const n of a.remove || []){ const i = next.findIndex(x => x.name === n && n !== '기타'); if (i >= 0){ next.splice(i, 1); did.push(n + ' 없앰'); } }
    for (const n0 of a.add || []){ const n = String(n0 || '').trim().slice(0, 12); if (n && n !== '나' && !next.some(x => x.name === n)){ next.splice(next.length - 1, 0, { name:n, color:null }); did.push(n + ' 만듦'); } }
    if (!did.length) return { ok:false, error:'바꿀 게 없음', groups:GROUPS.slice() };
    pplGroupsApply(next, renames); await pplSave(); pplNote('인간관계 판 무리를 고쳤어요 — ' + did.join(', ')); return { ok:true, groups:GROUPS.slice() };
  }
  if (c.name === 'add_person'){
    const name = String(a.name || '').trim().slice(0, 30); if (!name) return { ok:false, error:'name이 비었음' };
    if (pplFind(name)) return { ok:false, error:'이미 판에 있음 — update_person 을 쓴다', id:pplFind(name).id };
    const p = { id:uid(), name, rel:String(a.relation || '').slice(0, 60), group:GROUPS.includes(a.group) ? a.group : '기타', note:String(a.note || '').slice(0, 200), info:[], extra:[], notes:[], links:[], at:Date.now(), by:'sehee' };
    pplPatch(p, a); const look = await pplApplyLook(p, p.id, a); pplApplyStat(p, a);
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
    const held = isMe ? [] : pplApplyStat(p, a);
    if (a.link_to) pplLink(p, pplFind(a.link_to));
    await pplSave(); if (!isMe) PPL.changed = p.id; pplNote(`인간관계 판을 고쳤어요 — ${p.name}${pplWhat(aw)}`); if (PD.id === (isMe ? 'me' : p.id)) pdRender();
    if (isMe && workOn() && WORK.active){ if (curView() !== 'office') goView('office'); if (DW.open !== 'people') await dwOpen('people'); await wsleep(300); await pdOpen('me'); await wsleep(300); document.querySelectorAll('#pdBody .pd-sec').forEach((el, i) => setTimeout(() => hl(el), i * 160)); }
    return { ok:true, id:p.id, ...(look && look !== 'ok' ? { photo_error:look } : {}), ...(held.length ? { kept_boss_values:held, note:'보스가 확정한 값이라 바꾸지 않았다 — 근거와 함께 보스에게 바꿀지 물어본다' } : {}) };
  }
  if (c.name === 'tie_person' || c.name === 'untie_person'){
    const o = /^(나|me|보스|본인)$/.test(String(a.other || '').trim()) ? null : pplFind(a.other);
    if (isMe || !o) return { ok:false, error:"두 사람 다 판에 있어야 함(보스 본인과의 관계는 update_person 의 relation·relation_sure·family)" };
    if (o === p) return { ok:false, error:'같은 사람' };
    if (c.name === 'untie_person'){ tieDel(p.id, o.id); await pplSave(); pplNote(`인간관계 판 — ${p.name}·${o.name} 실을 끊었어요`); if (DW.open === 'people') pplRender(); if (PD.id) pdRender(); return { ok:true }; }
    const before = tieFind(p.id, o.id), bossClose = before && before.close && before.close.by === 'boss';
    const t = tieSet(p, o, { paIs:a.person_is, pbIs:a.other_is, kin:a.family, sure:a.guess ? 'guess' : (a.guess === false ? 'yes' : undefined), close:a.closeness, why:a.why, by:a.boss_said ? 'boss' : 'sehee', force:!!a.boss_said });
    await pplSave(); PPL.changed = p.id; if (DW.open === 'people') pplRender(); if (PD.id) pdRender();
    const v = tieOf(t, p.id); pplNote(`인간관계 판 — ${p.name}${v.mine ? '(' + v.mine + ')' : ''} · ${o.name}${v.theirs ? '(' + v.theirs + ')' : ''} 실을 이었어요${t.kin ? ' · 가족' : ''}${t.sure === 'guess' ? ' · 추측' : ''}${t.close ? ' · 친밀도 ' + t.close.v : ''}`);
    return { ok:true, ...(bossClose && a.closeness && !a.boss_said && t.close.v !== a.closeness ? { kept_boss_values:['둘 사이 친밀도'], note:'보스가 확정한 값이라 안 바꿈 — 보스에게 물어본다' } : {}) };
  }
  if (c.name === 'read_person') return { ok:true, person:pplFull(pdNorm(p), isMe) };
  if (c.name === 'remove_person'){
    PPL.list = PPL.list.filter(x => x !== p); for (const x of PPL.list) x.links = (x.links || []).filter(id => id !== p.id);
    if (PPL.pics && PPL.pics[p.id]){ delete PPL.pics[p.id]; await pplPicSave(); }
    await clueForget(p.id);
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
  const hits = [], seen = new Set(), key = name.replace(/\s*(팀장|과장|차장|부장|대리|주임|사원|실장|원장|사장|대표|선배|후배|언니|오빠|누나|형|동생|이모|삼촌|선생님|쌤|조교|님|씨)$/, '');
  for (const pn of (await allPans()).sort((a, b) => a.date < b.date ? 1 : -1)) for (const it of pn.items) if (!seen.has(it.id) && (it.text + ' ' + (it.tag || '')).includes(key)){ seen.add(it.id); hits.push({ it, date:pn.date }); }
  return hits.slice(0, 12);
}
async function pplSheet(id){
  const p = pplFind(id); if (!p) return;
  const items = await pplItems(p.name), links = (p.links || []).map(x => pplFind(x)).filter(Boolean);
  openSheet(`<h4>${esc(p.name)}</h4>
    <div class="row" style="flex-wrap:wrap;gap:6px"><input class="free" id="ppRel" value="${esc(p.rel || '')}" placeholder="관계"><select class="free" id="ppGrp">${GROUPS.map(g => `<option ${g === p.group ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select></div>
    <textarea class="big" id="ppNote" placeholder="기억할 점">${esc(p.note || '')}</textarea>
    ${(p.notes || []).length ? `<label class="t">세희가 덧붙인 것</label><ul class="cl">${p.notes.slice().reverse().map(n => `<li>${esc(n.text)} <small class="note">${ymdDot(n.at)}</small></li>`).join('')}</ul>` : ''}
    ${links.length ? `<label class="t">이어진 사람</label><p class="note">${links.map(x => esc(x.name)).join(' · ')}</p>` : ''}
    <label class="t">판에 나온 일</label>${items.length ? `<ul class="cl">${items.map(h => `<li${h.it.done ? ' style="text-decoration:line-through;opacity:.6"' : ''}>${esc(h.it.text)} <small class="note">${mdDay(h.date)}</small></li>`).join('')}</ul>` : '<p class="note">아직 없어요.</p>'}
    <div class="row" style="margin-top:8px;gap:6px"><button class="chip" data-pact="save" data-id="${p.id}">저장</button><button class="chip danger" data-pact="del" data-id="${p.id}">떼기</button></div>`);
}
function pplAddSheet(){
  openSheet(`<h4>사람 붙이기</h4><input class="free" id="ppNewName" placeholder="이름 (예: 김지민 팀장, 수진이)"><div class="row" style="margin-top:6px;gap:6px"><input class="free" id="ppNewRel" placeholder="관계 (예: 같은 팀 선배)"><select class="free" id="ppNewGrp">${GROUPS.map(g => `<option>${esc(g)}</option>`).join('')}</select><select class="free" id="ppNewSex"><option value="">성별 모름</option><option value="여">여성</option><option value="남">남성</option></select></div>
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
/* ── 무리 고치기 화면 (v1.5.12) — 이름·색·순서·더하기·빼기. 기타는 맨 끝 고정 ── */
function pplGroupSheet(){ PPL.gEdit = pplGroupsOut().map(g => ({ ...g, from:g.name })); PPL.gDel = null; pplGroupDraw(); }
function pplGroupRead(){ for (const el of document.querySelectorAll('#sheet [data-gname]')){ const g = PPL.gEdit[Number(el.dataset.gname)]; if (g && g.from !== '기타') g.name = el.value.trim().slice(0, 12); } }
function pplGroupDraw(msg){
  const G = PPL.gEdit, cnt = n => n ? PPL.list.filter(p => p.group === n).length : 0, last = G.length - 1;
  openSheet(`<h4>무리 고치기</h4><p class="note">사람을 묶는 칸이에요. 이름을 바꾸면 그 무리 사람도 같이 옮겨 가고, 뺀 무리 사람은 '기타'로 가요. 동그라미를 누르면 색이 바뀌어요.</p>
    <div class="gq-list">${G.map((g, i) => { const isEtc = g.from === '기타', n = cnt(g.from), arm = PPL.gDel === i;
      return `<div class="gq-row"><button class="gq-dot" data-gact="color" data-i="${i}" style="background:${g.color || '#5c5340'}" aria-label="색 바꾸기"></button>
        <input class="free" data-gname="${i}" value="${esc(g.name)}" maxlength="12" placeholder="무리 이름" ${isEtc ? 'disabled' : ''}><small class="gq-n">${n}명</small>
        <button class="ib" data-gact="up" data-i="${i}" ${i === 0 || isEtc ? 'disabled' : ''} aria-label="위로">↑</button><button class="ib" data-gact="down" data-i="${i}" ${i >= last - 1 || isEtc ? 'disabled' : ''} aria-label="아래로">↓</button>
        <button class="chip danger${arm ? ' on' : ''}" data-gact="del" data-i="${i}" ${isEtc ? 'disabled' : ''}>${arm ? n + '명 기타로 · 한 번 더' : '빼기'}</button></div>`; }).join('')}</div>
    <div class="row" style="gap:6px;margin-top:8px"><button class="chip" data-gact="add">+ 무리 더하기</button><button class="chip" data-gact="save">저장</button></div><p class="note" id="gqMsg">${esc(msg || '')}</p>`);
}
$('sheet').addEventListener('click', async e => {
  const b = e.target.closest('[data-gact]'); if (!b || b.disabled) return;
  pplGroupRead(); const G = PPL.gEdit, i = Number(b.dataset.i), a = b.dataset.gact;
  if (a !== 'del') PPL.gDel = null;
  if (a === 'color'){ const k = GROUP_PALETTE.indexOf(G[i].color); G[i].color = GROUP_PALETTE[(k + 1) % GROUP_PALETTE.length]; return pplGroupDraw(); }
  if (a === 'up' || a === 'down'){ const j = a === 'up' ? i - 1 : i + 1; if (j < 0 || j >= G.length - 1) return; [G[i], G[j]] = [G[j], G[i]]; return pplGroupDraw(); }
  if (a === 'del'){ const n = PPL.list.filter(p => p.group === G[i].from).length;
    if (n && PPL.gDel !== i){ PPL.gDel = i; return pplGroupDraw(); }
    PPL.gDel = null; G.splice(i, 1); return pplGroupDraw(); }
  if (a === 'add'){ const used = new Set(G.map(g => g.color)); G.splice(G.length - 1, 0, { name:'', color:GROUP_PALETTE.find(c => !used.has(c)) || GROUP_PALETTE[0], from:null }); pplGroupDraw();
    const ins = document.querySelectorAll('#sheet [data-gname]'); if (ins.length > 1) ins[ins.length - 2].focus(); return; }
  if (a === 'save'){
    const names = G.map(g => g.name);
    if (names.some(n => !n)) return pplGroupDraw('이름이 빈 무리가 있어요.');
    if (names.some(n => n === '나')) return pplGroupDraw("'나'는 무리 이름으로 못 써요.");
    if (new Set(names).size !== names.length) return pplGroupDraw('같은 이름의 무리가 둘 있어요.');
    const renames = {}; for (const g of G) if (g.from && g.from !== g.name) renames[g.from] = g.name;
    await pplLoad(); pplGroupsApply(G.map(g => ({ name:g.name, color:g.color })), renames); await pplSave();
    dlog('사람', '무리 고침 · ' + GROUPS.join('·')); closeSheet(); pplRender(true); toast('무리를 고쳤어요');
  }
});
$('ppGroups').onclick = async () => { await pplLoad(); pplGroupSheet(); };
$('ppCenter').onclick = () => { PPL.big = !PPL.big; pplRender(true); };

/* ── 인물 기록부 (v1.3.4) — 수사판에서 '나'든 다른 사람이든 누르면 똑같은 한 장짜리 서류 ──
   모두 같은 칸: 기본(이름·관계·무리 + 생일·나이·키 같은 항목, 항목은 더하고 뺄 수 있음) · 관계도 · 기억할 점 · 기타(🔒 비공개 줄) · 세희 메모 · 판에 나온 일.
   「고치기」를 누르면 같은 서류가 칸별 입력란으로. 세희는 update_person(person:'나' 포함)으로 채운다. 🔒 줄은 보고서·남에게 보이는 글에 절대 안 씀. */
/* ── 사진 단서 (v1.5.14 · C) — 인물 기록부의 갤러리: "이 사람과 이런 일이 있었지" ──
   글(설명·날짜·사람·🔒)은 kv 'pplclues' 한 줄 목록, 사진은 한 장마다 kv 'clue_<id>' = { full(긴 변 1080px), th(240px) } — 동기화도 한 장씩 따로(sync.js clue_ 접두).
   한 장에 여러 사람을 걸 수 있다(같이 있었던 일). 세희는 사진 속을 못 보고 보스가 적은 설명만 읽는다. */
const CLU = { list:null, th:new Map(), view:null };
const CLUE_PX = 1080, CLUE_TH = 240;
async function clueLoad(){ if (!CLU.list) CLU.list = (await kvGet('pplclues')) || []; return CLU.list; }
const clueSave = () => kvSet('pplclues', CLU.list || []);
const cluesOf = id => (CLU.list || []).filter(c => (c.people || []).includes(id)).sort((x, y) => String(x.when || ymd(new Date(x.at))) < String(y.when || ymd(new Date(y.at))) ? -1 : 1);
const kvDel = k => tx('kv', 'readwrite', s => s.delete(k)).then(r => { if (syncKey(k)) syncMark('kv:' + k); return r; });
async function imgShrink(src, max, q){
  const url = typeof src === 'string' ? src : URL.createObjectURL(src);
  try{ const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('사진을 못 열었어요')); i.src = url; });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k);
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d'); g.imageSmoothingQuality = 'high'; g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(img, 0, 0, w, h);
    return cv.toDataURL('image/jpeg', q);
  } finally { if (typeof src !== 'string') URL.revokeObjectURL(url); }
}
async function clueAdd(src, people, o){
  await clueLoad(); const id = 'cl' + uid();
  const full = await imgShrink(src, CLUE_PX, 0.8), th = await imgShrink(src, CLUE_TH, 0.74), shape = await clueShapeOf(th);
  await kvSet('clue_' + id, { full, th }); CLU.th.set(id, th);
  const c = { id, shape, at:Date.now(), when:(o && o.when) || '', text:String((o && o.text) || '').slice(0, 300), people:[...new Set(people)], ...(o && o.lock ? { lock:true } : {}), by:(o && o.by) || 'boss' };
  CLU.list.push(c); await clueSave(); dlog('사람', `사진 단서 넣음 ${id} · ${Math.round(full.length / 1024)}KB · ${c.people.join(',')}`); return c;
}
async function clueDel(id){ CLU.list = (CLU.list || []).filter(c => c.id !== id); CLU.th.delete(id); await kvDel('clue_' + id); await clueSave(); dlog('사람', '사진 단서 지움 ' + id); }
/* 사람을 떼면 그 사람만 걸린 단서는 지우고, 여럿이 걸린 단서에선 그 사람만 뺀다 */
async function clueForget(pid){ await clueLoad(); for (const c of CLU.list.filter(c => c.people.includes(pid))){ c.people = c.people.filter(x => x !== pid); if (!c.people.length) await clueDel(c.id); } await clueSave(); }
/* v1.5.18 사진 비율 셋 — 가로(w, 4:3·두 칸) · 세로(t, 3:4) · 정사각(s) */
const clueShape = (w, h) => { const r = w / Math.max(1, h); return r >= 1.15 ? 'w' : r <= 0.87 ? 't' : 's'; };
function clueShapeOf(url){ return new Promise(ok => { const i = new Image(); i.onload = () => ok(clueShape(i.naturalWidth, i.naturalHeight)); i.onerror = () => ok('s'); i.src = url; }); }
const clueTilt = id => { let h = 0; for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) | 0; return ((Math.abs(h) % 9) - 4) * 0.45; };   /* -1.8° ~ +1.8°, 사진마다 늘 같은 기울기 */
async function clueThumb(id){ if (CLU.th.has(id)) return CLU.th.get(id); const v = await kvGet('clue_' + id); const t = v && v.th || ''; CLU.th.set(id, t); return t; }
function clueGrid(pid){
  const cl = cluesOf(pid);
  return `<div class="cl-grid" data-clpid="${pid}">${cl.map(c => `<button class="cl-th sh-${c.shape || 's'}${c.lock ? ' lk' : ''}" data-clue="${c.id}" style="--tilt:${clueTilt(c.id)}deg" aria-label="사진 단서 크게 보기"><span class="cl-ph"><i class="cl-tape"></i><span class="cl-img" data-clth="${c.id}"></span></span><small>${esc(c.when || ymdDot(c.at))}${c.lock ? ' 🔒' : ''}</small><em>${esc(c.text || '설명 없음')}</em></button>`).join('')}
    <button class="cl-add" data-cladd="${pid}"><b>＋</b><span>사진 넣기</span></button></div>
    <p class="pd-empty cl-hint">${cl.length ? '' : '이 사람과 있었던 일을 사진으로 — 여러 장 한 번에, 컴퓨터에선 복사한 사진을 Ctrl+V 로 붙여도 돼요. 채팅에 사진을 보내며 "○○ 단서에 붙여줘"라고 해도 돼요.'}</p>`;
}
async function clueThumbs(){ let fixed = false;
  for (const el of document.querySelectorAll('#pdBody [data-clth]')){ const t = await clueThumb(el.dataset.clth); if (!t || !el.isConnected) continue; el.style.backgroundImage = `url("${t}")`;
    const c = (CLU.list || []).find(x => x.id === el.dataset.clth);   /* 예전에 넣은 사진은 처음 볼 때 비율을 재서 적어 둔다 */
    if (c && !c.shape){ c.shape = await clueShapeOf(t); fixed = true; const b = el.closest('.cl-th'); if (b){ b.classList.remove('sh-s'); b.classList.add('sh-' + c.shape); } } }
  if (fixed) await clueSave(); }
async function clueAddFiles(pid, files){
  const imgs = [...files].filter(f => /^image\//.test(f.type)).slice(0, 20); if (!imgs.length) return;
  toast(`사진 ${imgs.length}장 넣는 중…`);
  const made = []; for (const f of imgs){ try{ made.push(await clueAdd(f, [pid])); }catch(e){ toast(e.message); } }
  if (PD.id === pid) await pdRender();
  if (made.length === 1) clueOpen(made[0].id, pid, true); else toast(`사진 단서 ${made.length}장을 넣었어요 — 눌러서 설명을 적어 주세요`);
}
/* 크게 보기 — 사진 · 날짜 · 설명 · 같이 나온 사람 · 🔒 · ‹ › · 지우기 */
function clueOpen(id, pid, fresh){
  const c = (CLU.list || []).find(x => x.id === id); if (!c) return;
  CLU.view = { id, pid };
  let v = $('clv'); if (!v){ v = document.createElement('div'); v.id = 'clv'; v.className = 'clv'; $('pd').appendChild(v);   /* 기록부 안에 — 컴퓨터의 폰 비율 틀에도 꼭 맞게 */ v.addEventListener('click', clueViewClick); v.addEventListener('change', clueViewChange); }
  const list = cluesOf(pid), i = list.findIndex(x => x.id === id), names = c.people.map(x => ({ id:x, name:x === 'me' ? '나' : (pplFind(x) || {}).name })).filter(x => x.name);
  const others = [{ id:'me', name:'나' }, ...(PPL.list || []).map(x => ({ id:x.id, name:x.name }))].filter(x => !c.people.includes(x.id));
  v.innerHTML = `<div class="clv-top"><button class="ib" data-clv="prev" ${i <= 0 ? 'disabled' : ''} aria-label="앞 사진">‹</button><span>${i + 1} / ${list.length}</span><button class="ib" data-clv="next" ${i >= list.length - 1 ? 'disabled' : ''} aria-label="다음 사진">›</button><button class="ib clv-x" data-clv="close" aria-label="닫기">✕</button></div>
    <div class="clv-pic"><img id="clvImg" alt=""></div>
    <div class="clv-form">
      <div class="clv-row"><input id="clvWhen" value="${esc(c.when || '')}" placeholder="언제 — ${esc(ymdDot(c.at))}" maxlength="20"><button class="chip ${c.lock ? 'on' : ''}" data-clv="lock">🔒 비공개</button></div>
      <textarea id="clvText" rows="2" maxlength="300" placeholder="무슨 일이었는지 한 줄 — 예: 첫 회의 끝나고 같이 찍은 사진">${esc(c.text || '')}</textarea>
      <div class="clv-ppl">${names.map(x => `<span class="pd-chip">${esc(x.name)}${names.length > 1 ? `<button data-clv="unp" data-p="${x.id}" aria-label="${esc(x.name)} 빼기">✕</button>` : ''}</span>`).join('')}
        ${others.length ? `<select id="clvAddP"><option value="">+ 같이 있던 사람</option>${others.map(x => `<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select>` : ''}</div>
      <div class="clv-row"><button class="chip danger" data-clv="del">이 사진 지우기</button>${c.by === 'sehee' ? '<em class="clv-by">세희가 붙임</em>' : ''}</div></div>`;
  v.classList.add('on');
  kvGet('clue_' + id).then(x => { const im = $('clvImg'); if (im && x && CLU.view && CLU.view.id === id) im.src = x.full || x.th; });
  if (fresh) setTimeout(() => { const t = $('clvText'); if (t) t.focus(); }, 200);
}
async function clueClose(){ const v = $('clv'); if (v) v.classList.remove('on'); const pid = CLU.view && CLU.view.pid; CLU.view = null; if (pid && PD.id === pid) await pdRender(); }
async function clueViewChange(e){
  const c = CLU.view && (CLU.list || []).find(x => x.id === CLU.view.id); if (!c) return;
  if (e.target.id === 'clvText'){ c.text = e.target.value.trim().slice(0, 300); await clueSave(); }
  if (e.target.id === 'clvWhen'){ c.when = e.target.value.trim().slice(0, 20); await clueSave(); }
  if (e.target.id === 'clvAddP' && e.target.value){ c.people.push(e.target.value); await clueSave(); clueOpen(c.id, CLU.view.pid); }
}
async function clueViewClick(e){
  const b = e.target.closest('[data-clv]'); if (!b){ if (e.target.id === 'clv') clueClose(); return; }
  const c = CLU.view && (CLU.list || []).find(x => x.id === CLU.view.id), pid = CLU.view && CLU.view.pid; if (!c) return clueClose();
  const t = $('clvText'), w = $('clvWhen'); if (t) c.text = t.value.trim().slice(0, 300); if (w) c.when = w.value.trim().slice(0, 20);
  const k = b.dataset.clv, list = cluesOf(pid), i = list.findIndex(x => x.id === c.id);
  if (k === 'close'){ await clueSave(); return clueClose(); }
  if (k === 'prev' || k === 'next'){ await clueSave(); const n = list[i + (k === 'prev' ? -1 : 1)]; if (n) clueOpen(n.id, pid); return; }
  if (k === 'lock'){ c.lock = !c.lock; if (!c.lock) delete c.lock; await clueSave(); return clueOpen(c.id, pid); }
  if (k === 'unp'){ c.people = c.people.filter(x => x !== b.dataset.p); await clueSave(); if (!c.people.includes(pid)){ toast('이 사람 단서에서는 빠졌어요'); return clueClose(); } return clueOpen(c.id, pid); }
  if (k === 'del'){ if (!b.classList.contains('armed')){ b.classList.add('armed'); b.textContent = '한 번 더 누르면 지워요'; return; }
    const n = list[i + 1] || list[i - 1]; await clueDel(c.id); toast('사진 단서를 지웠어요'); if (n) clueOpen(n.id, pid); else clueClose(); }
}
$('pdBody').addEventListener('click', async e => {
  const th = e.target.closest('[data-clue]'); if (th){ e.stopPropagation(); return clueOpen(th.dataset.clue, th.closest('[data-clpid]').dataset.clpid); }
  const ad = e.target.closest('[data-cladd]'); if (ad){ e.stopPropagation(); const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*'; f.multiple = true;
    f.onchange = () => clueAddFiles(ad.dataset.cladd, f.files || []); f.click(); }
});
/* 컴퓨터 — 인물 기록부가 열려 있을 때 복사한 사진을 Ctrl+V 하면 그 사람 단서로 */
document.addEventListener('paste', e => {
  if (!PD.id || !$('pd').classList.contains('on') || ($('clv') && $('clv').classList.contains('on'))) return;
  if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
  const files = [...(e.clipboardData && e.clipboardData.files || [])].filter(f => /^image\//.test(f.type)); if (!files.length) return;
  e.preventDefault(); clueAddFiles(PD.id, files);
});
document.addEventListener('keydown', e => { const v = $('clv'); if (!v || !v.classList.contains('on')) return;
  if (e.key === 'Escape') clueClose(); if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  if (e.key === 'ArrowLeft'){ const b = v.querySelector('[data-clv="prev"]'); if (b && !b.disabled) b.click(); } if (e.key === 'ArrowRight'){ const b = v.querySelector('[data-clv="next"]'); if (b && !b.disabled) b.click(); } });
/* 세희 — 채팅 사진으로 단서 붙이기 */
async function clueTool(a){
  const ids = []; for (const k of [].concat(a.people || a.person || [])){ const key = String(k).trim(); if (/^(나|me|보스)$/.test(key)){ ids.push('me'); continue; } const p = pplFind(key); if (p) ids.push(p.id); }
  if (!ids.length) return { ok:false, error:'그 사람을 판에서 못 찾음 — add_person 으로 먼저 붙이거나 보스에게 누구인지 묻는다' };
  const ns = (a.photos && a.photos.length ? a.photos : [a.photo || 1]).map(Number).filter(n => n >= 1).slice(0, 12), made = [];
  for (const n of ns){ const u = bossPic(n); if (!u){ if (!made.length) return { ok:false, error:'보스가 보낸 사진을 찾지 못함(앱을 다시 켜면 앞서 보낸 사진은 사라짐) — 사진을 다시 같이 보내 달라고 하거나, 인물 기록부의 「사진 단서」 ＋ 로 넣는 법을 알려 준다' }; break; }
    try{ made.push(await clueAdd(u, ids, { text:a.text, when:a.when ? String(a.when).slice(0, 20) : '', lock:!!a.lock, by:'sehee' })); }catch(e){ return { ok:false, error:'사진을 못 열었음' }; } }
  const names = ids.map(i => i === 'me' ? '나' : pplFind(i).name);
  pplNote(`사진 단서를 붙였어요 — ${names.join('·')} · ${made.length}장${a.text ? ' · ' + String(a.text).slice(0, 30) : ''}`);
  if (PD.id && ids.includes(PD.id)) await pdRender();
  return { ok:true, added:made.length, people:names };
}

const PD = { id:null, edit:false };
const INFO_HINT = ['생일', '나이', '키'];
async function meLoad(){ await pplLoad(); if (!PPL.me) PPL.me = { id:'me', name:'나', rel:'본인', group:'나', info:[], note:'', extra:[], notes:[], links:[], at:Date.now(), by:'boss' }; return PPL.me; }
const pdGet = id => id === 'me' ? PPL.me : pplFind(id);
function pdNorm(p){ p.info = p.info || []; p.extra = p.extra || []; p.story = p.story || []; p.notes = p.notes || []; p.links = p.links || []; return p; }
function sec(n, title, body){ return `<section class="pd-sec"><h3><i>${n}</i>${title}</h3>${body}</section>`; }
/* ── 기록부: 공식 능력치 · 사람끼리 실 (v1.5.16, A) — 누르면 바로 매겨짐(보스 확정), 같은 걸 다시 누르면 지움 ── */
function statBlock(p){
  const st = p.stat || {}, rs = relSure(p), cl = st.close, g = cl ? cl.v[0] : null, md = cl ? (cl.v[1] || '') : '';
  const mark = x => x ? `<em class="sb-by ${x.by}">${byTxt(x.by)}</em>` : '';
  return `<div class="sb">
    <div class="sb-row"><b>나와의 관계</b><span class="sb-opts">${[['yes', '확실'], ['guess', '추측 ?'], ['none', '모름']].map(([k, t]) => `<button class="sb-o${rs === k ? ' on' : ''}" data-rs="${k}">${t}</button>`).join('')}<button class="sb-o kin${isKin(p) ? ' on' : ''}" data-kin="1">가족</button></span></div>
    <div class="sb-row"><b>친밀도</b><span class="sb-opts">${'SABCDF'.split('').map(x => `<button class="sb-g g${x}${g === x ? ' on' : ''}" data-st="close" data-v="${x}">${x}${g === x ? md : ''}</button>`).join('')}<button class="sb-o${md === '+' ? ' on' : ''}" data-gm="+">+</button><button class="sb-o${md === '-' ? ' on' : ''}" data-gm="-">−</button></span>${mark(cl)}</div>
    <div class="sb-row"><b>감정 온도</b><span class="sb-opts">${[1, 2, 3, 4, 5].map(v => `<button class="sb-t${st.temp && st.temp.v === v ? ' on' : ''}" data-st="temp" data-v="${v}" style="background:${TEMP_COLOR[v]}" aria-label="${TEMP_NAME[v]}">${v}</button>`).join('')}</span><small>${st.temp ? TEMP_NAME[st.temp.v] : '회색 무감정 → 연두 감정적'}</small>${mark(st.temp)}</div>
    <div class="sb-row"><b>선악</b><span class="sb-opts">${[-2, -1, 0, 1, 2].map(v => `<button class="sb-m m${v}${st.moral && st.moral.v === v ? ' on' : ''}" data-st="moral" data-v="${v}" aria-label="${MORAL_NAME[v]}">${v === -2 ? '惡惡' : v === -1 ? '惡' : v === 0 ? '·' : v === 1 ? '善' : '善善'}</button>`).join('')}</span><small>${st.moral ? MORAL_NAME[st.moral.v] : ''}</small>${mark(st.moral)}</div>
    ${(p.statLog || []).length ? `<ul class="sb-log">${p.statLog.slice(-4).reverse().map(x => `<li>${ymdDot(x.at)} · ${statName(x.k)} ${esc(String(x.from ?? '—'))} → ${esc(String(x.v ?? '지움'))} · ${byTxt(x.by)}${x.why ? ' · ' + esc(x.why) : ''}</li>`).join('')}</ul>` : '<p class="pd-empty">누르면 바로 매겨져요(보스 확정). 같은 걸 다시 누르면 지워요. 세희가 매긴 건 「세희 판단」으로 남아요.</p>'}
  </div>`;
}
function tieRows(p, edit){
  const ts = (PPL.ties || []).filter(t => t.a === p.id || t.b === p.id).map(t => ({ t, v:tieOf(t, p.id) })).filter(x => pplFind(x.v.other));
  if (!edit) return ts.length ? `<ul class="tie-ul">${ts.map(({ t, v }) => { const o = pplFind(v.other); return `<li><button class="tie-n" data-tgo="${o.id}">${esc(o.name)}</button><span>${v.mine ? '이 사람은 <b>' + esc(v.mine) + '</b>' : ''}${v.mine && v.theirs ? ' · ' : ''}${v.theirs ? '그쪽은 <b>' + esc(v.theirs) + '</b>' : ''}${!v.mine && !v.theirs ? '아는 사이' : ''}</span>${t.kin ? '<i class="tie-k">가족</i>' : ''}${t.sure === 'guess' ? '<i class="tie-q">?</i>' : ''}${t.close ? `<i class="tie-c${t.close.by === 'sehee' ? ' guess' : ''}">${esc(t.close.v)}</i>` : ''}</li>`; }).join('')}</ul>` : '';
  const others = (PPL.list || []).filter(o => o.id !== p.id && !tieFind(p.id, o.id));
  return `<div class="pd-rows">${ts.map(({ t, v }) => { const o = pplFind(v.other); return `<div class="tie-row"><b>${esc(o.name)}</b>
      <input data-tme="${t.id}" value="${esc(v.mine)}" placeholder="이 사람은 (예: 엄마)"><input data-tthem="${t.id}" value="${esc(v.theirs)}" placeholder="그쪽은 (예: 딸)">
      <span class="tie-btns"><button class="pd-lock${t.kin ? ' on' : ''}" data-tkin="${t.id}">가족</button><button class="pd-lock${t.sure === 'guess' ? ' on' : ''}" data-tq="${t.id}">추측 ?</button>
      <select data-tcl="${t.id}"><option value="">친밀도 —</option>${GRADE_ALL.map(g => `<option ${t.close && t.close.v === g ? 'selected' : ''}>${g}</option>`).join('')}</select><button class="pd-x" data-tdel="${t.id}">끊기</button></span></div>`; }).join('')}</div>
    ${others.length ? `<select class="tie-add" id="pdTieAdd"><option value="">+ 다른 사람과 실 잇기…</option>${others.map(o => `<option value="${o.id}">${esc(o.name)}</option>`).join('')}</select>` : ''}`;
}
const tieById = id => (PPL.ties || []).find(t => t.id === id);
async function pdStatSaved(p){ await pplSave(); if (DW.open === 'people') pplRender(); await pdRender(); }
$('pdBody').addEventListener('click', async e => {
  const t = e.target, b = t.closest('[data-rs],[data-kin],[data-st],[data-gm],[data-tgo],[data-tkin],[data-tq],[data-tdel]'); if (!b) return;
  e.stopPropagation(); const p = pdGet(PD.id); if (!p || PD.id === 'me') return; pdNorm(p); if (PD.edit) pdCollect(p);
  if (b.dataset.tgo){ PD.id = b.dataset.tgo; return pdRender(); }
  if (b.dataset.rs){ p.relSure = b.dataset.rs; return pdStatSaved(p); }
  if (b.dataset.kin){ p.kin = !isKin(p); return pdStatSaved(p); }
  if (b.dataset.st){ const k = b.dataset.st, cur = p.stat && p.stat[k];
    let v = k === 'close' ? b.dataset.v + (cur && cur.v[0] === b.dataset.v ? '' : '') : Number(b.dataset.v);
    if (cur && (k === 'close' ? cur.v[0] === b.dataset.v : cur.v === v)) statClear(p, k, 'boss');
    else statSet(p, k, v, 'boss', '', true);
    return pdStatSaved(p); }
  if (b.dataset.gm){ const cur = p.stat && p.stat.close; if (!cur) return; const L = cur.v[0], m = cur.v[1] === b.dataset.gm ? '' : b.dataset.gm; statSet(p, 'close', L + m, 'boss', '', true); return pdStatSaved(p); }
  const tie = tieById(b.dataset.tkin || b.dataset.tq || b.dataset.tdel); if (!tie) return;
  if (b.dataset.tkin) tie.kin = !tie.kin;
  if (b.dataset.tq) tie.sure = tie.sure === 'guess' ? 'yes' : 'guess';
  if (b.dataset.tdel) tieDel(tie.a, tie.b);
  return pdStatSaved(p);
});
$('pdBody').addEventListener('change', async e => {
  const p = pdGet(PD.id); if (!p || PD.id === 'me') return;
  if (e.target.id === 'pdTieAdd' && e.target.value){ pdNorm(p); pdCollect(p); tieSet(p, pplFind(e.target.value), {}); return pdStatSaved(p); }
  const tc = e.target.dataset && e.target.dataset.tcl; if (tc){ const tie = tieById(tc); if (!tie) return; pdNorm(p); pdCollect(p);
    tie.close = e.target.value ? { v:e.target.value, by:'boss', at:Date.now(), why:'' } : null; return pdStatSaved(p); }
});
async function pdDoc(p, isMe){
  pdNorm(p);
  const E = PD.edit, col = isMe ? '#2b2417' : (GROUP_COLOR[p.group] || '#5c5340');
  const links = isMe ? (PPL.list || []) : p.links.map(x => pplFind(x)).filter(Boolean);
  const items = isMe ? [] : await pplItems(p.name);
  if (E){
    const hints = INFO_HINT.filter(h => !p.info.some(x => x.k === h));
    return `${sec(1, '기본', `<div class="pd-form">
        <label>이름<input id="pdName" value="${esc(p.name)}"></label>
        ${isMe ? '<label>관계<input value="본인" disabled></label>' : `<label>관계<input id="pdRel" value="${esc(p.rel || '')}" placeholder="예: 대학 동기, 단골 손님"></label><label>무리<select id="pdGrp">${GROUPS.map(g => `<option ${g === p.group ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select></label>`}
        <label>성별<select id="pdSex">${[['', '모름'], ['여', '여성'], ['남', '남성']].map(([v, t]) => `<option value="${v}" ${(p.sex || '') === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label></div>
        <div class="pd-rows" style="margin-top:8px">${p.info.map((x, i) => `<div class="pd-irow"><input data-ik="${i}" value="${esc(x.k)}" placeholder="항목"><input data-iv="${i}" value="${esc(x.v)}" placeholder="내용"><button class="pd-x" data-del="info" data-i="${i}">빼기</button></div>`).join('')}</div>
        <div class="pd-addrow">${hints.map(h => `<button class="pd-add" data-addk="${h}">+ ${h}</button>`).join('')}<button class="pd-add" data-addk="">+ 다른 항목</button></div>`)}
      ${sec(2, '기억할 점', `<textarea class="pd-ta" id="pdNote" placeholder="이 사람에 대해 기억할 것">${esc(p.note || '')}</textarea>`)}
      ${sec(3, '기타', `<div class="pd-rows">${p.extra.map((x, i) => `<div class="pd-lrow"><input data-l="${i}" value="${esc(x.text)}"><button class="pd-lock ${x.lock ? 'on' : ''}" data-lock="${i}">${x.lock ? '🔒 비공개' : '🔓 공개'}</button><button class="pd-x" data-del="extra" data-i="${i}">빼기</button></div>`).join('')}</div>
        <button class="pd-add" data-add="extra">+ 줄 더하기</button>`)}
      ${sec(4, '이야기 기록', `<div class="pd-rows">${p.story.map((x, i) => `<div class="pd-srow"><div class="pd-shead"><input data-sw="${i}" value="${esc(x.when || '')}" placeholder="언제 (${ymdDot(x.at)})"><button class="pd-lock ${x.lock ? 'on' : ''}" data-slock="${i}">${x.lock ? '🔒 비공개' : '🔓 공개'}</button><button class="pd-x" data-del="story" data-i="${i}">빼기</button></div><textarea class="pd-ta" data-s="${i}" placeholder="있었던 일·들은 이야기를 자세히">${esc(x.text)}</textarea></div>`).join('')}</div>
        <button class="pd-add" data-add="story">+ 이야기 더하기</button>`)}
      ${isMe ? '' : sec(5, '사람끼리 실', tieRows(p, true))}
      ${isMe ? '' : `<button class="pd-del" data-pdel="${p.id}">이 사람 떼기</button>`}`;
  }
  const kv = [['이름', esc(p.name)], ['관계', esc(isMe ? '본인' : (p.rel || '미정'))], ...(isMe ? [] : [['무리', `<span class="pd-chip" style="--c:${col}">${esc(p.group)}</span>`]]), ...(p.sex ? [['성별', p.sex === '여' ? '여성' : '남성']] : []), ...p.info.map(x => [esc(x.k), esc(x.v)])];
  const graph = isMe
    ? (links.length ? `<div class="pd-graph"><div class="pg-n me">나</div><div class="pg-e" style="--c:#a13b2c"><span>${links.length}명</span></div><div class="pg-ns">${links.map(x => `<button class="pg-n sm" data-pp="${x.id}" style="--c:${GROUP_COLOR[x.group] || '#5c5340'}">${esc(x.name)}</button>`).join('')}</div></div>` : '<p class="pd-empty">아직 아무도 없음</p>')
    : `<div class="pd-graph"><button class="pg-n me" data-pp="me">나</button><div class="pg-e" style="--c:${col}"><span>${esc(p.rel || p.group)}</span></div><div class="pg-n" style="--c:${col}">${esc(p.name)}</div>
      ${links.length ? `<div class="pg-e" style="--c:#c9a227"><span>아는 사이</span></div><div class="pg-ns">${links.map(x => `<button class="pg-n sm" data-pp="${x.id}" style="--c:${GROUP_COLOR[x.group] || '#5c5340'}">${esc(x.name)}</button>`).join('')}</div>` : ''}</div>`;
  let n = 0;
  return `${sec(++n, '기본', `<table class="pd-kv">${kv.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>${p.info.length ? '' : '<p class="pd-empty" style="margin-top:4px">생일·나이·키 같은 건 「고치기」에서</p>'}`)}
    ${isMe ? '' : sec(++n, '공식 능력치', statBlock(p))}
    ${sec(++n, '관계도', graph + (isMe ? '' : tieRows(p, false)))}
    ${sec(++n, '기억할 점', p.note ? `<p class="pd-p">${esc(p.note)}</p>` : '<p class="pd-empty">아직 없음</p>')}
    ${sec(++n, '기타', p.extra.length ? `<ul class="pd-ul">${p.extra.map(x => `<li class="${x.lock ? 'lk' : ''}">${x.lock ? '<span class="pd-stamp">비공개</span>' : ''}${esc(x.text)}</li>`).join('')}</ul>` : '<p class="pd-empty">아직 없음</p>')}
    ${sec(++n, '이야기 기록', p.story.length ? `<ol class="pd-story">${p.story.slice().reverse().map(x => `<li class="${x.lock ? 'lk' : ''}"><div class="pd-sw">${esc(storyWhen(x))}${x.lock ? '<span class="pd-stamp">비공개</span>' : ''}${x.by === 'sehee' ? '<em>세희가 적음</em>' : ''}</div><p>${esc(x.text)}</p></li>`).join('')}</ol>` : '<p class="pd-empty">아직 없음 — 세희에게 이 사람 이야기를 들려주면 날짜별로 적어요</p>')}
    ${sec(++n, `사진 단서${cluesOf(isMe ? 'me' : p.id).length ? ' <small class="cl-n">' + cluesOf(isMe ? 'me' : p.id).length + '장</small>' : ''}`, clueGrid(isMe ? 'me' : p.id))}
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
  clueThumbs();
}
async function pdOpen(id){ await pplLoad(); await clueLoad(); if (id === 'me') await meLoad(); PD.id = id; PD.edit = false; await pdRender(); $('pd').classList.add('on'); $('pdBody').scrollTop = 0; }
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
  for (const el of document.querySelectorAll('#pdBody [data-tme]')){ const t = tieById(el.dataset.tme); if (t){ const o = pplFind(tieOf(t, p.id).other); if (o) tieSet(p, o, { paIs:el.value }); } }
  for (const el of document.querySelectorAll('#pdBody [data-tthem]')){ const t = tieById(el.dataset.tthem); if (t){ const o = pplFind(tieOf(t, p.id).other); if (o) tieSet(p, o, { pbIs:el.value }); } }
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
    await clueForget(p.id);
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
