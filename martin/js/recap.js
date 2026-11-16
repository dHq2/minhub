/* martin/js/recap.js — 사건 복기본 v1.0 (11-17 D). 고칠 땐 이 줄 아래에 「11-17 D: …」처럼 날짜·방 주석
   「기록 전체 복사」 = 이 사건에서 일어난 모든 것을 한 번씩 담은 글. 다른 방(다른 Claude)에 붙여 넣으면 그 글만으로 사건을 처음부터 끝까지 되짚는다.
   모으는 곳: 계정 저장소(logs/·turns/·evid/ — 폰·PC 어느 기기에서 했든 전부) + 이 기기 기록(drmartin.log) + 지금 판(S). 같은 기록은 한 번만.
   담는 것: 사건 파일 · 난제 지도(가설·확신 이력·버림·풀림·사라진 난제) · 지금 판(카드·실) · 판에서 사라진 카드·실(지난 판 기억에서) ·
            자료함(판독문 전문, 판독문이 바뀌었으면 옛 판 · 붙여 넣은 글 원문 전문) · 수사 수첩(풀린·지워진 줄까지) · 대화 전사 · 마틴의 턴(판을 어떻게 고쳤나) · 행동 기록
   사진 그림 자체는 글에 못 담는다 — 마틴의 판독문이 그 자리를 대신한다. data: 그림 글자는 전부 걷어 낸다.
   날것(JSON)이 필요하면 recapRaw() — 「날것」 단추. 11-17 D v1.1: 「텍스트 파일로 받기」(recapSave) — 같은 글을 .txt 로. */
const RC_VER = 'v1.1';
const rcClip = (s, n) => { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n) + '…' : s; };
const rcNoImg = v => JSON.parse(JSON.stringify(v, (k, x) => typeof x === 'string' && /^data:|^blob:/.test(x) ? '(그림)' : x));
const rcT = t => { if (!t) return '-'; const d = new Date(t); return `${d.getMonth() + 1}/${d.getDate()} ${d.toTimeString().slice(0, 8)}`; };
async function rcQuery(col, cid){   /* 계정에서 이 사건 것만 — 10초 넘으면 있는 것만으로 */
  if (!DB) return [];
  try{ const q = await Promise.race([DB.collection(col).where('cid', '==', cid).get(), sleep(15000).then(() => null)]); return q ? q.docs.map(d => clone(d.data())) : []; }catch(e){ return []; }
}
/* 기록 모으기 — 계정 logs(묶음) + 기기 log, 같은 줄(시각·접속·종류·내용)은 하나로 */
async function recapGather(){
  const cid = S.id; let dev = []; try{ dev = JSON.parse(localStorage.getItem('drmartin.log') || '[]').filter(e => e.cid === cid); }catch(e){}
  const [lg, tn, ev] = await Promise.all([rcQuery('logs', cid), rcQuery('turns', cid), rcQuery('evid', cid)]);
  const seen = new Set(), items = [], key = e => [e.ts, e.sid, e.type, e.act || '', e.n || '', (e.text || '').slice(0, 40)].join('|');
  const take = e => { if (!e || e.cid !== cid) return; const k = key(e); if (seen.has(k)) return; seen.add(k); items.push(e); };
  for (const d of lg) for (const e of d.items || []) take(e);
  for (const e of dev) take(e);
  for (const e of tn) take(e);
  items.sort((a, b) => (a.ts || 0) - (b.ts || 0));
  const texts = {}; for (const d of ev) if (d && d.id) texts[d.id] = d.text || '';
  for (const e of S.ev || []) if (!texts[e.id] && e.kind !== 'photo'){ try{ const t = localStorage.getItem(`drmartin.ev.${cid}.${e.id}`); if (t) texts[e.id] = t; }catch(x){} }
  return { items, texts, fromDb:lg.length + tn.length + ev.length, fromDev:dev.length };
}
/* 글로 짓기 */
function recapText(g){
  const L = [], H = t => { L.push('', '## ' + t); }, P = s => L.push(s);
  const items = g.items, turns = items.filter(e => e.type === 'turn'), mem = items.filter(e => e.type === 'memory' && e.board), acts = items.filter(e => e.type === 'action');
  const sids = [...new Set(items.map(e => e.sid).filter(Boolean))], opens = acts.filter(e => e.act === '열기');
  const n1 = nodeOf('n1') || {}, first = items[0] ? items[0].ts : S.at, last = items.length ? items[items.length - 1].ts : S.at;
  P(`# Dr. 마틴 사건 복기본 ${RC_VER} — 「${n1.title || '사건'}」`);
  P(`- 사건 번호 ${S.id} · 앱 ${VER} · 만든 때 ${rcT(Date.now())}`);
  P(`- 기간 ${rcT(first)} ~ ${rcT(last)} · 마틴 턴 ${S.turn} · 카드 ${S.nodes.length}장 · 실 ${S.links.length}줄 · 자료 ${(S.ev || []).length}건 · 대화 ${S.log.length}줄`);
  P(`- 기록 출처: 계정 ${g.fromDb}건 + 이 기기 ${g.fromDev}줄 → 합쳐 ${items.length}줄(겹친 것은 한 번만) · 접속 ${sids.length}번${opens.length ? ' (' + [...new Set(opens.map(o => (o.w || 0) <= 500 ? '폰' : '컴'))].join('·') + ')' : ''}`);
  P('- 읽는 법: 이 글 하나로 사건 전체를 되짚을 수 있게 모았다. 사진 그림은 담지 못해 마틴의 판독문으로 대신한다. id: n…=판 카드, e…=자료함, m…=수사 수첩, p…=난제, h…=가설. 동료=플레이어(기자·수집가), 마틴=탐정.');

  H('1. 사건 파일');
  P(`- 제목: ${n1.title || '-'}`); P(`- 요약: ${n1.note || '-'}`);
  P(`- 용의자 표시: ${S.suspect ? S.suspect + ' ' + ((nodeOf(S.suspect) || {}).title || '') : '없음'}`);
  if (S.hyp && S.hyp.title) P(`- 옛 가설 띠: ${S.hyp.title} (${S.hyp.confidence || 0}%) — ${S.hyp.body || ''}`);

  H('2. 난제 지도');
  const probs = S.probs || [];
  if (!probs.length) P('(난제 없음)');
  const kid = up => probs.filter(p => (p.up || null) === up);
  const walk = (p, d) => { const pad = '  '.repeat(d);
    P(`${pad}- ${p.id} [${p.st === 'solved' ? '풀림' : '열림'}${p.root ? '·뿌리' : ''}${S.pfocus === p.id ? '·붙잡음' : ''}${p.by === 'me' ? '·동료 지정' : ''}] ${p.t}${p.turn ? ' (턴 ' + p.turn + ')' : ''}`);
    if (p.st === 'solved') P(`${pad}  · 결론(턴 ${p.doneTurn || '-'}): ${p.a || '-'} | 근거 ${(p.ab || []).join(',') || '-'}`);
    for (const h of p.hy || []) P(`${pad}  · 가설 ${h.id} ${h.st === 'dead' ? '[버림' + (h.killTurn ? ' 턴 ' + h.killTurn : '') + ': ' + (h.kill || '') + '] ' : ''}${h.c}% ${h.t} | 근거 ${(h.b || []).join(',') || '없음'} | 왜: ${h.why || '-'} | 확신 이력 ${(h.hist || []).map(x => '턴' + x[0] + ':' + x[1] + '%').join(' → ')}${h.by === 'me' ? ' | 동료가 세움' : ''}`);
    for (const l of p.log || []) P(`${pad}  · 기록 턴 ${l.turn == null ? '-' : l.turn} ${l.by === 'me' ? '동료' : '마틴'}: ${l.t}`);
    for (const c of kid(p.id)) walk(c, d + 1); };
  for (const r of probs.filter(p => !p.up || !probOf(p.up))) walk(r, 0);
  if ((S.pgone || []).length){ P('- 사라진 난제:'); for (const x of S.pgone) P(`  · ${x.id} 「${x.t}」 턴 ${x.turn} ${x.into ? '→ ' + x.into + ' 에 합쳐짐' : '없어짐'}${x.why ? ' — ' + x.why : ''} (${x.who === 'me' ? '동료' : '마틴'})`); }

  H('3. 지금 판 — 카드');
  for (const n of S.nodes){ const ev = (S.ev || []).filter(e => e.card === n.id).map(e => e.id);
    P(`- ${n.id} [${KINDS[n.kind] || n.kind}] ${n.title}${n.note ? ' — ' + n.note : ''}${S.suspect === n.id ? ' · 용의자' : ''}${n.faceFrom ? ' · 프사 ← ' + n.faceFrom : ''}${ev.length ? ' · 자료 ' + ev.join(',') : ''}`); }
  H('4. 지금 판 — 실(관계)');
  for (const l of S.links){ const a = nodeOf(l.a), b = nodeOf(l.b); P(`- ${l.a} ${a ? a.title : '?'} ↔ ${l.b} ${b ? b.title : '?'} : ${l.label || '(꼬리표 없음)'}${l.sure ? '' : ' (추측)'}`); }
  if ((S.groups || []).length){ P('- 묶음:'); for (const gr of groupsOf()) P(`  · ${gr.a || '-'} 「${gr.name}」: ${(gr.cards || []).join(', ')}`); }

  H('5. 판에서 사라진 카드·실 — 지난 판 기억에 한 번이라도 있었던 것');
  const now = new Set(S.nodes.map(n => n.id)), nowL = new Set(S.links.map(l => [l.a, l.b].sort().join('~') + '|' + (l.label || ''))), goneN = new Map(), goneL = new Map();
  for (const m of mem){ const b = m.board; for (const n of b.nodes || []) if (!now.has(n.id)) goneN.set(n.id, { n, turn:m.n || b.turn });
    for (const l of b.links || []){ const k = [l.a, l.b].sort().join('~') + '|' + (l.label || ''); if (!nowL.has(k)) goneL.set(k, { l, turn:m.n || b.turn }); } }
  const goneActs = acts.filter(e => /카드 (뗌|합침|지움)|merge|remove/.test(e.act || ''));
  if (!goneN.size && !goneL.size) P('(없음)');
  for (const [id, x] of goneN){ const why = goneActs.filter(e => e.id === id || e.from === id).map(e => e.act + (e.into ? '→' + e.into : '')).pop();
    P(`- ${id} [${KINDS[x.n.kind] || x.n.kind}] ${x.n.title}${x.n.note ? ' — ' + x.n.note : ''} · 마지막으로 보인 턴 ${x.turn || '-'}${why ? ' · ' + why : ''}`); }
  for (const [, x] of goneL) P(`- 실 ${x.l.a} ↔ ${x.l.b} : ${x.l.label || ''}${x.l.sure ? '' : ' (추측)'} · 마지막 턴 ${x.turn || '-'}`);

  H('6. 자료함 — 동료가 건넨 원본 전부');
  const readsOf = id => { const out = []; for (const t of turns){ const r = t.ok && t.response && t.response.read; if (Array.isArray(r)) for (const x of r) if (x && x.id === id && x.t && !out.some(o => o.t === x.t)) out.push({ t:x.t, n:t.n }); } return out; };
  for (const e of S.ev || []){ const card = e.card && nodeOf(e.card);
    P(''); P(`### ${e.id} · ${e.kind === 'photo' ? '사진' : '글'} 「${evTitle(e)}」`);
    P(`- 건넨 때 ${rcT(e.at)} · 턴 ${e.turn == null ? '-' : e.turn} · 판 ${card ? e.card + ' 「' + card.title + '」' : '(판에서 떼어짐)'}${e.name ? ' · 파일 ' + e.name : ''}${e.len ? ' · ' + e.len + '자' : ''}`);
    const olds = readsOf(e.id).filter(x => x.t !== e.read);
    P(`- 마틴의 판독문${e.readTurn ? ' (턴 ' + e.readTurn + ')' : ''}:`); P(e.read ? e.read : '(아직 없음)');
    for (const o of olds){ P(`- 옛 판독문 (턴 ${o.n}):`); P(o.t); }
    if (e.kind !== 'photo'){ P('- 원문 전문:'); P(g.texts[e.id] || e.head || '(원문을 찾지 못함 — 이 기기와 계정 어디에도 없다)'); } }
  if (!(S.ev || []).length) P('(없음)');

  H('7. 수사 수첩');
  const NK = { q:'의문', guess:'짐작', todo:'확인할 것', fact:'사사로운 사실', me:'동료 메모' };
  const nowNotes = new Set((S.notes || []).map(n => n.id));
  for (const k of Object.keys(NK)){ const ls = (S.notes || []).filter(n => n.k === k); if (!ls.length) continue; P(`- ${NK[k]}:`);
    for (const n of ls) P(`  · ${n.id}${n.by === 'me' ? '(동료)' : ''} 턴 ${n.turn == null ? '-' : n.turn}: ${n.t}${n.done ? ' → 풀림' + (n.doneTurn ? '(턴 ' + n.doneTurn + ')' : '') + (n.a ? ': ' + n.a : '') : ''}`); }
  const goneNotes = new Map(); for (const m of mem) for (const n of (m.board.notes || [])) if (n && n.id && !nowNotes.has(n.id)) goneNotes.set(n.id, { n, turn:m.n });
  if (goneNotes.size){ P('- 지워진 줄:'); for (const [, x] of goneNotes) P(`  · ${x.n.id} [${NK[x.n.k] || x.n.k}] ${x.n.t} · 마지막 턴 ${x.turn || '-'}`); }
  if (!(S.notes || []).length && !goneNotes.size) P('(없음)');

  H('8. 대화 전사');
  for (const l of S.log){ const v = l.viewing && itemOf(l.viewing);
    P(`[${rcT(l.at)}] ${l.who === 'p' ? '동료' : '마틴'}${l.upd ? '(업데이트 안내)' : ''}${v ? ' (보면서: ' + l.viewing + ' 「' + (/^e/.test(l.viewing) ? evTitle(v) : v.title) + '」)' : ''}${l.photos && l.photos.length ? ' (사진 건넴: ' + l.photos.join(',') + ')' : ''}${l.files && l.files.length ? ' (파일 건넴: ' + l.files.join(',') + ')' : ''}: ${l.text}`); }

  H('9. 마틴의 턴 — 판·난제·수첩을 어떻게 고쳤나');
  if (!turns.length) P('(계정·기기 어디에도 턴 기록이 없다)');
  for (const t of turns){ const r = t.response || {};
    P(`- 턴 ${t.n || '-'}${t.part ? '(' + t.part + ')' : ''} · ${rcT(t.ts)} · ${t.model || ''} ${t.effort || ''} · ${((t.ms || 0) / 1000).toFixed(1)}초${t.ok ? '' : ' · 실패 ' + rcClip(JSON.stringify(t.error || ''), 160)}`);
    if (!t.ok) continue;
    const j = (k, v) => { if (v && (!Array.isArray(v) || v.length) && (typeof v !== 'object' || Object.keys(v).length)) P(`  · ${k}: ${rcClip(JSON.stringify(rcNoImg(v)), 4000)}`); };
    j('판 고침', r.ops); j('난제', r.pz); j('수첩', r.notes); j('풀림', r.solve); j('지움', r.drop); j('다시 봄', r.look); j('캐 올 것', r.ask);
    if (r.read && r.read.length) P(`  · 판독문 씀: ${r.read.map(x => x.id).join(', ')} (전문은 6. 자료함)`);
    j('묶음', r.groups); j('실 자름', r.cut); j('실 이음', r.link); j('꼬리표', r.relabel); j('합침', r.merge); }

  H('10. 행동 기록 — 동료가 누르고 연 것');
  const skip = new Set(['ts', 'at', 'sid', 'cid', 'type', 'act', 'ua']);
  for (const e of items){ if (e.type === 'action'){ const more = Object.entries(e).filter(([k]) => !skip.has(k)).map(([k, v]) => k + '=' + rcClip(typeof v === 'string' ? v : JSON.stringify(rcNoImg(v)), 120)).join(' ');
      P(`[${rcT(e.ts)}] ${e.act}${more ? ' · ' + more : ''}`); }
    else if (e.type === 'chat' && e.who === 'p' && ((e.files || []).length || (e.photos || []).length)) P(`[${rcT(e.ts)}] 건넴 · 사진 ${(e.photos || []).join(',') || '-'} · 파일 ${(e.files || []).map(f => f.name || f).join(',') || '-'}`); }
  P(''); P(`— 복기본 끝 (${RC_VER}) —`);
  return L.join('\n');
}
/* 11-17 D: 텍스트 파일로 받기 — 아티팩트에선 downloads 기능(저장 확인 창이 한 번 뜬다), 그 밖(GitHub Pages 등)에선 보통 내려받기 */
const rcName = () => { const t = ((nodeOf('n1') || {}).title || '사건').replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 40); const d = new Date(); return `마틴-복기본-${t}-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${d.toTimeString().slice(0, 5).replace(':', '')}.txt`; };
async function recapSave(){
  const m = $('#cpMsg'); if (m) m.textContent = '계정과 이 기기의 기록을 모으는 중…';
  let txt = ''; try{ txt = recapText(await recapGather()); }catch(e){ if (m) m.textContent = '모으다 막혔다: ' + rcClip(e && e.message, 80); return; }
  window.__recap = txt; const name = rcName(), kb = Math.round(new Blob([txt]).size / 1024);
  let DL = null; try{ DL = window.claude ? await window.claude.use('downloads') : null; }catch(e){}
  if (DL){ if (m) m.textContent = '저장 창이 뜨면 「저장」을 누른다.';
    try{ await DL.save({ filename:name, data:new Blob([txt], { type:'text/plain' }) }); if (m) m.textContent = `받았다. ${name} · ${kb}KB`; act('복기본 파일로 받음', { name, kb }); }
    catch(e){ const c = e && e.code; if (m) m.textContent = c === 'declined' ? '저장을 그만뒀다.' : c === 'rate_limited' ? '저장 창이 이미 떠 있다. 잠시 뒤 다시.' : '이 화면에선 파일 저장이 막혔다. 「기록 전체 복사」로 옮겨라.'; act('복기본 파일 막힘', { code:c || String(e && e.message || e).slice(0, 60) }); }
    return; }
  try{ const u = URL.createObjectURL(new Blob([txt], { type:'text/plain;charset=utf-8' })), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000);
    if (m) m.textContent = `받았다. ${name} · ${kb}KB`; act('복기본 파일로 받음', { name, kb, way:'a' }); }
  catch(e){ if (m) m.textContent = '이 화면에선 파일 저장이 막혔다. 「기록 전체 복사」로 옮겨라.'; }
}
/* 날것 — 예전 「기록 전체 복사」와 같은 모양에 계정 기록을 더한 것(그림 글자는 뺌) */
async function recapRaw(){ const g = await recapGather(); return JSON.stringify(rcNoImg({ case:{ ...snap(), ev:(S.ev || []).map(lean), probs:S.probs, pgone:S.pgone, groups:S.groups }, chat:S.log, log:g.items, texts:g.texts }), null, 1); }
async function recapCopy(raw){
  const m = $('#cpMsg'); if (m) m.textContent = '계정과 이 기기의 기록을 모으는 중…';
  let txt = ''; try{ txt = raw ? await recapRaw() : recapText(await recapGather()); }catch(e){ if (m) m.textContent = '모으다 막혔다: ' + rcClip(e && e.message, 80); act('복기본 막힘', { msg:rcClip(e && e.message, 80) }); return; }
  window.__recap = txt;
  const kb = Math.round(txt.length / 1024);
  try{ await navigator.clipboard.writeText(txt); if (m) m.textContent = `복사했다. ${kb}KB — 다른 방에 그대로 붙여 넣으면 된다.`; act(raw ? '기록 날것 복사' : '복기본 복사', { kb }); }
  catch(x){ if (m) m.innerHTML = `이 화면에선 복사가 막혔다. 아래 칸을 길게 눌러 전체 선택 → 복사.<textarea class="rcbox" readonly>${esc(txt)}</textarea>`; act('복기본 복사 막힘', { kb }); }
}
