/* ── 인간관계 판 (v1.2) — 나를 가운데 두고 사람 카드가 방사형으로 붙는 수사판 ──
   빨간 실이 나에서 각 사람으로, 서로 아는 사람끼리도 실로 잇는다. 무리(직장·가족·친구·학생·학부모·기타)마다 방향이 정해져 있다.
   세희가 대화에서 한 명씩 붙이고(add_person), 보스도 「+ 사람」으로 직접 붙인다. 카드를 누르면 메모·관련 판 항목이 나온다. */
const PPL = { list:null, changed:null };
const GROUPS = ['직장', '학생·학부모', '친구', '가족', '기타'];
const GROUP_COLOR = { '직장':'#3a6b64', '학생·학부모':'#8a6d3b', '친구':'#6b5b95', '가족':'#a13b2c', '기타':'#5c5340' };
async function pplLoad(){ if (!PPL.list){ const d = (await kvGet('people')) || {}; PPL.list = d.list || []; PPL.theme = d.theme || 'cork'; PPL.me = d.me || null; } return PPL.list; }
const pplSave = () => kvSet('people', { list:PPL.list, theme:PPL.theme || 'cork', ...(PPL.me ? { me:PPL.me } : {}) });
const pplFind = key => { const k = String(key || '').replace(/^#/, '').trim(); return (PPL.list || []).find(p => p.id === k) || (PPL.list || []).find(p => p.name === k); };
function pplLine(p, isMe){
  const info = (p.info || []).map(x => `${x.k} ${x.v}`).join(', '), ex = (p.extra || []).map(x => (x.lock ? '[비공개] ' : '') + x.text).join(' / ');
  return `- ${isMe ? '나(보스 본인)' : '#' + p.id + ' ' + p.name + ' · ' + (p.rel || '관계 미정') + ' · ' + p.group}${info ? ' · ' + info : ''}${p.note ? ' — ' + p.note.slice(0, 60) : ''}${ex ? ' · 기타: ' + ex.slice(0, 200) : ''}`;
}
async function pplContext(){
  await pplLoad();
  const lines = [...(PPL.me ? [pplLine(PPL.me, true)] : []), ...PPL.list.slice(0, 50).map(p => pplLine(p))];
  if (!lines.length) return '인간관계 판: 아직 아무도 없음';
  return '인간관계 판 기록부 (나 포함, 이름 · 관계 · 무리 · 항목 · 기타):\n' + lines.join('\n') + ((PPL.me && (PPL.me.extra || []).some(x => x.lock)) || PPL.list.some(p => (p.extra || []).some(x => x.lock)) ? '\n[비공개] 줄은 보스와 단둘이 하는 이야기에서만 참고한다. 보고서·보드 카드·판 항목·남에게 보낼 글 등 누구에게 보이는 글에는 절대 쓰지도 넌지시 비치지도 않는다.' : '');
}
const PEOPLE_TOOLS = () => [
  { name:'add_person', description:'인간관계 판에 사람 한 명을 붙인다. 보스가 추가하라고 할 때만. 한 번에 한 명.', schema:{ type:'object', properties:{
    name:{ type:'string', description:'이름 또는 부르는 말. 예: 이예진 조교, 정은쌤' },
    relation:{ type:'string', description:'보스와의 관계 한 줄. 예: 같이 일하는 조교, 중2 김민준 어머니' },
    group:{ type:'string', enum:GROUPS, description:'무리' },
    note:{ type:'string', description:'기억할 점 한 줄(선택)' },
    info:{ type:'array', description:'기본 항목(선택). 예: 생일·나이·키', items:{ type:'object', properties:{ key:{ type:'string' }, value:{ type:'string' } } } },
    link_to:{ type:'string', description:'이미 판에 있는 사람 중 이 사람과 연결된 이름(선택)' } }, required:['name', 'group'] } },
  { name:'update_person', description:"인간관계 판의 사람 기록부를 고친다. 보스 본인은 person:'나'. 바꿀 것만 넣는다.", schema:{ type:'object', properties:{
    person:{ type:'string', description:"사람 id(# 없이) 또는 이름. 보스 본인이면 '나'" }, relation:{ type:'string' }, group:{ type:'string', enum:GROUPS },
    info:{ type:'array', description:'기본 항목 넣기·고치기(같은 이름이면 바꿈). 생일·나이·키 등', items:{ type:'object', properties:{ key:{ type:'string' }, value:{ type:'string' } } } },
    note:{ type:'string', description:'기억할 점(통째로 바꿈)' },
    add_extra:{ type:'array', description:'기타 줄 더하기(근무·처우·사정 등). 남이 알면 안 되는 건 lock:true', items:{ type:'object', properties:{ text:{ type:'string' }, lock:{ type:'boolean' } } } },
    add_note:{ type:'string', description:'세희 메모 한 줄' }, link_to:{ type:'string', description:'잇고 싶은 다른 사람 이름' } }, required:['person'] } },
  { name:'remove_person', description:'인간관계 판에서 사람을 뗀다. 보스가 분명히 떼라고 할 때만.', schema:{ type:'object', properties:{ person:{ type:'string' } }, required:['person'] } },
];
function pplNote(text){ O.log.push({ who:'a', board:true, text, at:Date.now() }); renderLog(); saveLog(); }
function pplPatch(p, a){
  p.info = p.info || []; p.extra = p.extra || [];
  if (Array.isArray(a.info)) for (const x of a.info){ const k = String(x.key || '').trim().slice(0, 20), v = String(x.value || '').trim().slice(0, 80); if (!k || !v) continue; const o = p.info.find(y => y.k === k); if (o) o.v = v; else p.info.push({ k, v }); }
  if (typeof a.note === 'string' && a.note.trim()) p.note = a.note.trim().slice(0, 600);
  if (Array.isArray(a.add_extra)) for (const x of a.add_extra){ const t = String(x.text || '').trim().slice(0, 200); if (t && !p.extra.some(y => y.text === t)) p.extra.push({ text:t, lock:!!x.lock }); }
}
function pplLink(a, b){ if (!a || !b || a === b) return; a.links = [...new Set([...(a.links || []), b.id])]; b.links = [...new Set([...(b.links || []), a.id])]; }
async function runPeopleTool(c){
  await pplLoad(); const a = c.args || {};
  if (c.name === 'add_person'){
    const name = String(a.name || '').trim().slice(0, 30); if (!name) return { ok:false, error:'name이 비었음' };
    if (pplFind(name)) return { ok:false, error:'이미 판에 있음 — update_person 을 쓴다', id:pplFind(name).id };
    const p = { id:uid(), name, rel:String(a.relation || '').slice(0, 60), group:GROUPS.includes(a.group) ? a.group : '기타', note:String(a.note || '').slice(0, 200), info:[], extra:[], notes:[], links:[], at:Date.now(), by:'sehee' };
    pplPatch(p, a);
    PPL.list.push(p); if (a.link_to) pplLink(p, pplFind(a.link_to));
    await pplSave(); PPL.changed = p.id; pplNote(`인간관계 판에 붙였어요 — ${p.name}${p.rel ? ' (' + p.rel + ')' : ''}`);
    return { ok:true, id:p.id };
  }
  const isMe = /^(나|me|보스|본인)$/.test(String(a.person || '').trim());
  const p = isMe ? await meLoad() : pplFind(a.person); if (!p) return { ok:false, error:'그 사람이 판에 없음' };
  if (c.name === 'update_person'){
    pplPatch(p, a);
    if (a.relation && !isMe) p.rel = String(a.relation).slice(0, 60);
    if (GROUPS.includes(a.group) && !isMe) p.group = a.group;
    if (a.add_note) p.notes = [...(p.notes || []), { at:Date.now(), text:String(a.add_note).slice(0, 200) }].slice(-30);
    if (a.link_to) pplLink(p, pplFind(a.link_to));
    await pplSave(); if (!isMe) PPL.changed = p.id; pplNote(`인간관계 판을 고쳤어요 — ${p.name}`);
    if (isMe && workOn() && WORK.active){ if (curView() !== 'office') goView('office'); if (DW.open !== 'people') await dwOpen('people'); await wsleep(300); await pdOpen('me'); await wsleep(300); document.querySelectorAll('#pdBody .pd-sec').forEach((el, i) => setTimeout(() => hl(el), i * 160)); }
    return { ok:true, id:p.id };
  }
  if (c.name === 'remove_person'){
    PPL.list = PPL.list.filter(x => x !== p); for (const x of PPL.list) x.links = (x.links || []).filter(id => id !== p.id);
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
    <div class="pp-me" style="left:${C}px;top:${C}px"><i class="pp-pin"></i><b>나</b><span>${th === 'map' ? '현위치' : '보스'}</span></div>
    ${list.map(p => { const q = pos[p.id]; return q ? `<div class="pp-node" data-pp="${p.id}" style="left:${q.x.toFixed(0)}px;top:${q.y.toFixed(0)}px;--c:${GROUP_COLOR[p.group]};--r:${((hs(p.id) % 7) - 3) * 1.4}deg"><i class="pp-pin"></i><div class="ph">${esc(p.name.slice(0, 1))}</div><b>${esc(p.name)}</b><span>${esc(p.rel || p.group)}</span></div>` : ''; }).join('')}
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
  openSheet(`<h4>사람 붙이기</h4><input class="free" id="ppNewName" placeholder="이름 (예: 이예진 조교)"><div class="row" style="margin-top:6px;gap:6px"><input class="free" id="ppNewRel" placeholder="관계 (예: 같이 일하는 조교)"><select class="free" id="ppNewGrp">${GROUPS.map(g => `<option>${g}</option>`).join('')}</select></div>
    <input class="free" id="ppNewNote" placeholder="기억할 점 (선택)" style="margin-top:6px"><div class="row" style="margin-top:8px"><button class="chip" data-pact="add">붙이기</button></div><p class="note" id="ppMsg"></p>`);
}
$('sheet').addEventListener('click', async e => {
  const b = e.target.closest('[data-pact]'); if (!b) return;
  await pplLoad(); const a = b.dataset.pact;
  if (a === 'add'){
    const name = $('ppNewName').value.trim(); if (!name){ $('ppMsg').textContent = '이름을 넣어 주세요.'; return; }
    if (pplFind(name)){ $('ppMsg').textContent = '이미 판에 있어요.'; return; }
    const p = { id:uid(), name:name.slice(0, 30), rel:$('ppNewRel').value.trim().slice(0, 60), group:$('ppNewGrp').value, note:$('ppNewNote').value.trim().slice(0, 200), notes:[], links:[], at:Date.now(), by:'boss' };
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
function pdNorm(p){ p.info = p.info || []; p.extra = p.extra || []; p.notes = p.notes || []; p.links = p.links || []; return p; }
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
        ${isMe ? '<label>관계<input value="본인" disabled></label>' : `<label>관계<input id="pdRel" value="${esc(p.rel || '')}" placeholder="예: 같이 일하는 조교"></label><label>무리<select id="pdGrp">${GROUPS.map(g => `<option ${g === p.group ? 'selected' : ''}>${g}</option>`).join('')}</select></label>`}</div>
        <div class="pd-rows" style="margin-top:8px">${p.info.map((x, i) => `<div class="pd-irow"><input data-ik="${i}" value="${esc(x.k)}" placeholder="항목"><input data-iv="${i}" value="${esc(x.v)}" placeholder="내용"><button class="pd-x" data-del="info" data-i="${i}">빼기</button></div>`).join('')}</div>
        <div class="pd-addrow">${hints.map(h => `<button class="pd-add" data-addk="${h}">+ ${h}</button>`).join('')}<button class="pd-add" data-addk="">+ 다른 항목</button></div>`)}
      ${sec(2, '기억할 점', `<textarea class="pd-ta" id="pdNote" placeholder="이 사람에 대해 기억할 것">${esc(p.note || '')}</textarea>`)}
      ${sec(3, '기타', `<div class="pd-rows">${p.extra.map((x, i) => `<div class="pd-lrow"><input data-l="${i}" value="${esc(x.text)}"><button class="pd-lock ${x.lock ? 'on' : ''}" data-lock="${i}">${x.lock ? '🔒 비공개' : '🔓 공개'}</button><button class="pd-x" data-del="extra" data-i="${i}">빼기</button></div>`).join('')}</div>
        <button class="pd-add" data-add="extra">+ 줄 더하기</button>`)}
      ${isMe ? '' : `<button class="pd-del" data-pdel="${p.id}">이 사람 떼기</button>`}`;
  }
  const kv = [['이름', esc(p.name)], ['관계', esc(isMe ? '본인' : (p.rel || '미정'))], ...(isMe ? [] : [['무리', `<span class="pd-chip" style="--c:${col}">${esc(p.group)}</span>`]]), ...p.info.map(x => [esc(x.k), esc(x.v)])];
  const graph = isMe
    ? (links.length ? `<div class="pd-graph"><div class="pg-n me">나</div><div class="pg-e" style="--c:#a13b2c"><span>${links.length}명</span></div><div class="pg-ns">${links.map(x => `<button class="pg-n sm" data-pp="${x.id}" style="--c:${GROUP_COLOR[x.group] || '#5c5340'}">${esc(x.name)}</button>`).join('')}</div></div>` : '<p class="pd-empty">아직 아무도 없음</p>')
    : `<div class="pd-graph"><button class="pg-n me" data-pp="me">나</button><div class="pg-e" style="--c:${col}"><span>${esc(p.rel || p.group)}</span></div><div class="pg-n" style="--c:${col}">${esc(p.name)}</div>
      ${links.length ? `<div class="pg-e" style="--c:#c9a227"><span>아는 사이</span></div><div class="pg-ns">${links.map(x => `<button class="pg-n sm" data-pp="${x.id}" style="--c:${GROUP_COLOR[x.group] || '#5c5340'}">${esc(x.name)}</button>`).join('')}</div>` : ''}</div>`;
  let n = 0;
  return `${sec(++n, '기본', `<table class="pd-kv">${kv.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>${p.info.length ? '' : '<p class="pd-empty" style="margin-top:4px">생일·나이·키 같은 건 「고치기」에서</p>'}`)}
    ${sec(++n, '관계도', graph)}
    ${sec(++n, '기억할 점', p.note ? `<p class="pd-p">${esc(p.note)}</p>` : '<p class="pd-empty">아직 없음</p>')}
    ${sec(++n, '기타', p.extra.length ? `<ul class="pd-ul">${p.extra.map(x => `<li class="${x.lock ? 'lk' : ''}">${x.lock ? '<span class="pd-stamp">비공개</span>' : ''}${esc(x.text)}</li>`).join('')}</ul>` : '<p class="pd-empty">아직 없음</p>')}
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
    <div class="pd-id"><div class="pd-photo" style="--c:${col}">${esc(p.name.slice(0, 1))}</div>
      <div><h1>${esc(p.name)}</h1><p>${esc(isMe ? '본인' : (p.rel || '관계 미정') + ' · ' + p.group)}</p></div>
      ${p.extra.some(x => x.lock) ? '<span class="pd-stamp big">대외비</span>' : ''}</div>
    ${await pdDoc(p, isMe)}
    <div class="pd-foot">세희 · 인간관계 판 · ${ymdDot(Date.now())}${p.extra.some(x => x.lock) ? ' · 🔒 줄은 보고서·남에게 보이는 글에 쓰지 않음' : ''}</div></div>`;
}
async function pdOpen(id){ await pplLoad(); if (id === 'me') await meLoad(); PD.id = id; PD.edit = false; await pdRender(); $('pd').classList.add('on'); $('pdBody').scrollTop = 0; }
function pdClose(){ $('pd').classList.remove('on'); PD.id = null; PD.edit = false; }
function pdCollect(p){
  const v = id => { const el = document.getElementById(id); return el ? el.value.trim() : null; };
  if (v('pdName')) p.name = v('pdName').slice(0, 30);
  if (p.id !== 'me'){ if (v('pdRel') !== null) p.rel = v('pdRel').slice(0, 60); if (v('pdGrp')) p.group = v('pdGrp'); }
  if (v('pdNote') !== null) p.note = v('pdNote').slice(0, 600);
  for (const el of document.querySelectorAll('#pdBody [data-ik]')){ const x = p.info[Number(el.dataset.ik)]; if (x) x.k = el.value.trim().slice(0, 20); }
  for (const el of document.querySelectorAll('#pdBody [data-iv]')){ const x = p.info[Number(el.dataset.iv)]; if (x) x.v = el.value.trim().slice(0, 80); }
  for (const el of document.querySelectorAll('#pdBody [data-l]')){ const x = p.extra[Number(el.dataset.l)]; if (x) x.text = el.value.trim().slice(0, 200); }
}
$('pd').addEventListener('click', async e => {
  const t = e.target;
  if (t.closest('[data-pd="close"]')) return pdClose();
  /* 서류 바깥 빈 곳을 누르면 닫힘(고치던 중이면 저장하고) — v1.3.6 */
  if (t.closest('#pdBody') && !t.closest('.pd-paper')){
    const q = pdGet(PD.id);
    if (PD.edit && q){ pdNorm(q); pdCollect(q); q.info = q.info.filter(x => x.k && x.v); q.extra = q.extra.filter(x => x.text); await pplSave(); if (DW.open === 'people') pplRender(); toast('서류를 고쳤어요'); }
    return pdClose();
  }
  const pp = t.closest('.pd-graph [data-pp]'); if (pp && !PD.edit){ if (pp.dataset.pp === 'me') await meLoad(); PD.id = pp.dataset.pp; return pdRender(); }
  const p = pdGet(PD.id); if (!p) return; pdNorm(p);
  if (t.closest('#pdEdit')){
    if (PD.edit){ pdCollect(p); p.info = p.info.filter(x => x.k && x.v); p.extra = p.extra.filter(x => x.text); await pplSave(); if (DW.open === 'people') pplRender(); toast('서류를 고쳤어요'); }
    PD.edit = !PD.edit; return pdRender();
  }
  if (!PD.edit) return;
  pdCollect(p);
  const addk = t.closest('[data-addk]'), add = t.closest('[data-add]'), del = t.closest('[data-del]'), lk = t.closest('[data-lock]');
  if (addk){ p.info.push({ k:addk.dataset.addk, v:'' }); await pdRender(); const ins = document.querySelectorAll('#pdBody [data-iv]'); const last = ins[ins.length - 1]; if (last) (addk.dataset.addk ? last : document.querySelectorAll('#pdBody [data-ik]')[ins.length - 1]).focus(); return; }
  if (add){ p.extra.push({ text:'', lock:false }); return pdRender(); }
  if (del){ p[del.dataset.del].splice(Number(del.dataset.i), 1); return pdRender(); }
  if (lk){ const x = p.extra[Number(lk.dataset.lock)]; if (x) x.lock = !x.lock; return pdRender(); }
  const pdel = t.closest('[data-pdel]');
  if (pdel){ if (!pdel.classList.contains('armed')){ pdel.classList.add('armed'); pdel.textContent = '한 번 더 누르면 떼요'; return; }
    PPL.list = PPL.list.filter(x => x !== p); for (const x of PPL.list) x.links = (x.links || []).filter(id => id !== p.id);
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
