/* martin/js/timeline.js — 연혁(세로 타임라인)(v0.15.2, 11-17 A). 고칠 땐 이 줄 아래에 「11-17 A: …」처럼 날짜·방 주석 */
/* 보스: "세로형 타임라인 탭을 따로 만들고(시간순을 기록하는 용도 — 일어났던 사건, 연혁), 모순도 잡아내고, 자주 참조해야 해.
   글씨는 작고 빽빽하게, 위에서 아래로. 계속 수정하고 업데이트되는."
   · S.tl = [{ id:'t1', d:'2024-12-20'(모르면 ''), t:'21:00'(24시간, 모르면 ''), amb(오전·오후 모름), when(시각 대신 말 — '송년회 밤'),
              what, who, src:['e3'], sure(자료에 적힘 true · 마틴의 추정 false), after:'t2'(반드시 그 뒤), by:'m'|'me', turn, up(고친 턴), gone:{why,turn,by} }]
     S.tmax · S.tclash = [{ a, b, why, turn, ok }](마틴이 짚은 어긋남 — ok 면 풀림)
   · 마틴이 매 답의 "tl" 로 세우고 고친다(applyTl — ai.js turn 이 판독문 바로 뒤에). 프롬프트엔 매 턴 [연혁](tlText — 맞춰 보기 아래).
   · 앱이 스스로 대조(tlCheck): after 인데 시각이 앞섬 · 출처 판독문에 그 시각이 안 보임 · 같은 사람이 같은 때 두 곳 · 마틴이 짚은 어긋남.
   · 화면: 위 단추 「연혁」(줄 수, 어긋남 있으면 빨간 점) → 오른쪽 서랍 #tlm. 날짜 머리 아래로 「시각 · 일 · 누가 · 출처」 한 줄씩, 작은 고정폭 글씨.
     줄을 누르면 출처 카드로 날아가 반짝, × 는 동료가 지움(되돌리기 됨). 이번 턴에 새로 생기거나 고친 줄은 금빛 */
const TL_WD = '일월화수목금토';
let tlFlash = new Set();
function ensureTl(){ if (!S) return; if (!Array.isArray(S.tl)) S.tl = []; if (!Number.isFinite(S.tmax)) S.tmax = S.tl.reduce((m, x) => Math.max(m, +String(x.id || '').slice(1) || 0), 0); if (!Array.isArray(S.tclash)) S.tclash = []; }
/* 날짜·시각 다듬기 — 마틴이 「2024.12.20」「12/20」「오후 9:40」으로 써도 받는다 */
function tlDate(v){
  v = String(v || '').trim(); if (!v) return ''; let m;
  if ((m = /(\d{4})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/.exec(v))) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  if ((m = /(\d{4})\s*[.\-/년]\s*(\d{1,2})/.exec(v))) return `${m[1]}-${m[2].padStart(2, '0')}`;
  if ((m = /^(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/.exec(v))) return `--${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;   /* 해 모름 */
  if ((m = /^(\d{4})$/.exec(v))) return m[1];
  return '';
}
function tlTime(v){
  v = String(v || '').trim(); if (!v) return { t:'', amb:false }; let m = /(오전|오후|새벽|아침|낮|저녁|밤)?\s*(\d{1,2})\s*[:시]\s*(\d{1,2})?/.exec(v); if (!m) return { t:'', amb:false };
  let h = +m[2], mi = +(m[3] || 0); const ap = m[1] || ''; let amb = false;
  if (/오후|저녁|밤/.test(ap) && h < 12) h += 12; else if (/오전|새벽|아침/.test(ap) && h === 12) h = 0; else if (ap === '낮' && h < 7) h += 12;   /* 오전·오후 모름은 마틴이 amb 로 */
  if (h > 24 || mi > 59) return { t:'', amb:false };
  return { t:`${String(h % 24).padStart(2, '0')}:${String(mi).padStart(2, '0')}`, amb };
}
const tlKey = x => { const d = x.d || '', dk = /^\d{4}/.test(d) ? d.padEnd(10, '-') : /^--/.test(d) ? '9998' + d : '9999-99-99'; return dk + ' ' + (x.t || '99:99') + ' ' + String(+String(x.id).slice(1)).padStart(5, '0'); };
const tlLive = () => ((S && S.tl) || []).filter(x => !x.gone);
const tlNext = () => 't' + (((S && Number.isFinite(S.tmax)) ? S.tmax : ((S && S.tl) || []).reduce((m, x) => Math.max(m, +String(x.id || '').slice(1) || 0), 0)) + 1);   /* 읽기만 — 상태를 안 건드린다(되돌리기 칸이 안 쌓이게) */
const tlSorted = () => tlLive().slice().sort((a, b) => tlKey(a) < tlKey(b) ? -1 : 1);
const tlDayTxt = d => { if (!d) return '날짜 모름'; if (/^--/.test(d)){ const [, , mo, da] = d.split('-'); return `${+mo}/${+da}(해 모름)`; } const p = d.split('-').map(Number); if (p.length < 3) return d.replace('-', '년 ') + (p.length === 2 ? '월' : '년'); const w = new Date(p[0], p[1] - 1, p[2]).getDay(); return `${d}(${TL_WD[w]})`; };
const tlTimeTxt = x => x.t ? (x.amb ? `${+x.t.slice(0, 2) % 12 || 12}:${x.t.slice(3)}?` : x.t) : (x.when ? '' : '--:--');
/* 출처 판독문에서 그 시각을 찾아본다 — 「21:40」「9:40」「9시 40분」「오후 9:40」 */
function tlTimeIn(x, read){
  if (!x.t || !read) return true; const h = +x.t.slice(0, 2), mi = +x.t.slice(3), h12 = h % 12 || 12, mm = String(mi).padStart(2, '0');
  const pats = [`${h}:${mm}`, `${String(h).padStart(2, '0')}:${mm}`, `${h12}:${mm}`, `${h12}시 ${mi}분`, `${h12}시${mi}분`, `${h}시 ${mi}분`];
  if (!mi) pats.push(`${h12}시`, `${h}시`); if (mi === 30) pats.push(`${h12}시 반`, `${h12}시반`);
  return pats.some(p => read.includes(p));
}
/* 앱의 대조 — 줄마다 어긋남 [{ ids, why, kind }] */
function tlCheck(){
  const out = [], live = tlLive(), by = new Map(live.map(x => [x.id, x]));
  for (const x of live){
    if (x.after && by.has(x.after)){ const y = by.get(x.after); if (x.d && y.d && (x.t || x.d !== y.d) && tlKey(x) < tlKey(y)) out.push({ ids:[x.id, y.id], kind:'order', why:`${x.id}는 ${y.id} 뒤라 했는데 더 이르다(${x.d === y.d ? '' : tlDayTxt(x.d) + ' '}${x.t || ''} < ${x.d === y.d ? '' : tlDayTxt(y.d) + ' '}${y.t || ''})` }); }
    if (x.t && (x.src || []).length){ const rs = x.src.map(id => evOf(id)).filter(e => e && e.read); if (rs.length && !rs.some(e => tlTimeIn(x, e.read))) out.push({ ids:[x.id], kind:'src', why:`${x.id}의 시각 ${x.t} 이 출처 ${x.src.join(',')} 판독문에 안 보인다 — 시각을 다시 확인` }); }
  }
  const grp = new Map(); for (const x of live) if (x.who && x.d && x.t && x.where) { const k = x.who + '|' + x.d + '|' + x.t; (grp.get(k) || grp.set(k, []).get(k)).push(x); }
  for (const g of grp.values()){ const ws = [...new Set(g.map(x => x.where))]; if (ws.length > 1) out.push({ ids:g.map(x => x.id), kind:'place', why:`${g[0].who}가 ${g[0].t}에 두 곳(${ws.join(' · ')})` }); }
  for (const c of (S && S.tclash) || []) if (!c.ok && by.has(c.a)) out.push({ ids:[c.a, c.b].filter(Boolean), kind:'clash', why:c.why || '어긋남' });
  return out;
}
/* 마틴의 "tl" 적용 */
function applyTl(res){
  const ops = Array.isArray(res && res.tl) ? res.tl : []; if (!ops.length) return 0; ensureTl();
  let n = 0; tlFlash = new Set(); const turnNo = S.turn;
  const fill = (x, o) => {
    if ('d' in o || 'date' in o) x.d = tlDate(o.d ?? o.date);
    if ('t' in o || 'time' in o){ const tt = tlTime(o.t ?? o.time); x.t = tt.t; x.amb = !!(o.amb || tt.amb); } else if ('amb' in o) x.amb = !!o.amb;
    for (const k of ['what', 'who', 'when', 'where']) if (k in o) x[k] = String(o[k] || '').slice(0, k === 'what' ? 90 : 30);
    if ('src' in o) x.src = [].concat(o.src || []).map(String).filter(id => /^e\d+$/.test(id)).slice(0, 4);
    if ('sure' in o) x.sure = o.sure !== false;
    if ('after' in o) x.after = /^t\d+$/.test(String(o.after || '')) ? String(o.after) : '';
  };
  for (const o of ops.slice(0, 24)){
    if (!o || typeof o !== 'object') continue; const op = o.op || (o.id && S.tl.some(x => x.id === o.id) ? 'edit' : 'add');
    if (op === 'add'){ if (!o.what) continue; let id = /^t\d+$/.test(o.id || '') && !S.tl.some(x => x.id === o.id) ? o.id : 't' + (S.tmax + 1);
      S.tmax = Math.max(S.tmax, +id.slice(1)); const x = { id, d:'', t:'', amb:false, what:'', who:'', src:[], sure:true, by:'m', turn:turnNo + 1 }; fill(x, o); S.tl.push(x); tlFlash.add(id); n++; }
    else if (op === 'edit'){ const x = S.tl.find(y => y.id === o.id); if (!x) continue; fill(x, o); x.up = turnNo + 1; if (x.gone && o.what) delete x.gone; tlFlash.add(x.id); n++; }
    else if (op === 'drop'){ const x = S.tl.find(y => y.id === o.id); if (!x || x.gone) continue; x.gone = { why:String(o.why || '').slice(0, 80), turn:turnNo + 1, by:'m' }; n++; }
    else if (op === 'clash'){ const a = String(o.a || ''), b = String(o.b || ''); if (!/^t\d+$/.test(a)) continue; const c = S.tclash.find(y => (y.a === a && y.b === b) || (y.a === b && y.b === a));
      if (o.ok){ if (c){ c.ok = true; c.okWhy = String(o.why || '').slice(0, 80); n++; } } else if (!c){ S.tclash.push({ a, b, why:String(o.why || '').slice(0, 90), turn:turnNo + 1 }); tlFlash.add(a); n++; } }
  }
  if (S.tclash.length > 40) S.tclash = S.tclash.slice(-40);
  if (n){ act('연혁 고침', { n, ids:[...tlFlash] }); tlBadge(true); if (document.body.classList.contains('tlopen')) renderTl(); }
  return n;
}
/* 프롬프트 [연혁] — 매 턴. 길면 줄을 짧게(아래 둘 다 남김) */
function tlText(){
  if (!S) return ''; const rows = tlSorted(), bad = tlCheck(), hasRead = (S.ev || []).some(e => e.read);
  if (!rows.length) return hasRead ? `\n[연혁 — 아직 비었다] 동료는 「연혁」 탭에서 이 사건에 일어난 일을 시간순으로 본다. 이번 답에서 자료함 판독문으로 연혁을 세워라 — 일어난 일마다 tl add 한 줄(많아야 20).\n` : '';
  let day = null; const out = [`\n[연혁 — 이 사건에서 일어난 일, 시간순(네가 세우고 고친다 · 동료가 「연혁」 탭으로 늘 본다). 결론·재구성·「언제」를 말할 땐 여기부터 본다. 새 자료로 바뀌면 이번 답에서 tl 로 고친다]`];
  const cut = rows.length > 60 ? 48 : 90;
  for (const x of rows){ if (x.d !== day){ day = x.d; out.push(tlDayTxt(x.d)); }
    const w = `${x.what}`.slice(0, cut);
    out.push(`  ${x.id} ${x.t ? tlTimeTxt(x) : (x.when ? '(' + x.when + ')' : '--:--')} ${w}${x.who ? ' — ' + x.who : ''}${x.src && x.src.length ? ' [' + x.src.join(' ') + ']' : ''}${x.sure === false ? ' (추정)' : ''}${x.after ? ' (' + x.after + ' 뒤)' : ''}`); }
  if (bad.length) out.push(`어긋남(앱 대조·네가 짚은 것 — 이번 답에서 고치거나(tl edit·drop) 이유를 대고 풀어라(clash ok)):\n${bad.slice(0, 10).map(b => '  ! ' + b.why).join('\n')}`);
  return out.join('\n') + '\n';
}
/* ── 화면 ── */
function tlBadge(ping){
  const n = $('#tlN'), b = $('#btnTl'); if (!n || !b || !S) return; const c = tlLive().length, bad = tlCheck().length;
  n.textContent = c || ''; b.classList.toggle('warn', !!bad);
  if (ping){ b.classList.remove('ping'); void b.offsetWidth; b.classList.add('ping'); }
}
function renderTl(){
  if (!S) return; const rows = tlSorted(), bad = tlCheck(), flag = new Map();
  const red = new Set(); for (const b of bad){ b.ids.forEach(id => red.add(id)); (flag.get(b.ids[0]) || flag.set(b.ids[0], []).get(b.ids[0])).push(b.why); }   /* 빨강은 둘 다, ⚠ 이유는 앞 줄에만 */
  $('#tlmCase').textContent = ` · ${rows.length}줄${bad.length ? ` · 어긋남 ${bad.length}` : ''}`;
  let day = null, html = '';
  if (!rows.length) html = `<p class="tl-empty">아직 비었다. 자료를 건네면 마틴이 일어난 일을 시간순으로 세운다.</p>`;
  for (const x of rows){
    if (x.d !== day){ day = x.d; html += `<div class="tld">${esc(tlDayTxt(x.d))}</div>`; }
    const f = flag.get(x.id), r0 = red.has(x.id), card = (x.src || []).map(id => evOf(id)).find(e => e && e.card && nodeOf(e.card));
    html += `<div class="tlr${x.sure === false ? ' guess' : ''}${r0 ? ' bad' : ''}${tlFlash.has(x.id) ? ' new' : ''}" data-tl="${x.id}"${card ? ` data-card="${card.card}"` : ''}>`
      + `<i>${esc(x.t ? tlTimeTxt(x) : '--:--')}</i><b>${x.when && !x.t ? `<em>(${esc(x.when)})</em> ` : ''}${esc(x.what)}${x.sure === false ? ' <em>추정</em>' : ''}</b>`
      + `<small>${x.who ? esc(x.who) + ' · ' : ''}${x.id}${x.src && x.src.length ? ' · ' + x.src.join(' ') : ''}${x.after ? ' · ' + x.after + ' 뒤' : ''}</small>`
      + `<button type="button" data-tldel="${x.id}" aria-label="지우기">×</button></div>`
      + (f ? f.map(w => `<div class="tlw">⚠ ${esc(w)}</div>`).join('') : '');
  }
  const gone = (S.tl || []).filter(x => x.gone);
  if (gone.length) html += `<details class="tlg"><summary>지운 줄 ${gone.length}</summary>${gone.map(x => `<div class="tlr gone"><i>${esc(x.t || '--:--')}</i><b>${esc(x.what)}</b><small>${x.id} · ${x.gone.by === 'me' ? '동료가 지움' : '마틴: ' + esc(x.gone.why || '')}</small></div>`).join('')}</details>`;
  $('#tlmBody').innerHTML = html;
}
const tlOpen = on => {
  document.body.classList.toggle('tlopen', on);
  if (on){ if (innerWidth < 1180){ if (typeof pzOpen === 'function' && document.body.classList.contains('pzmopen')) pzOpen(false); if (typeof nbOpen === 'function' && document.body.classList.contains('nbopen')) nbOpen(false); }
    act('연혁 열기', { n:tlLive().length }); renderTl(); }
  else tlFlash = new Set();
};
(function tlBoot(){
  const pz = $('#btnPz'); if (pz && !$('#btnTl')) pz.insertAdjacentHTML('afterend', '<button class="tb" id="btnTl" type="button">연혁<span class="n" id="tlN"></span></button>');
  document.body.insertAdjacentHTML('beforeend', `<aside id="tlm" aria-label="연혁"><div class="tl-top"><b>연혁<small id="tlmCase"></small></b><button type="button" id="tlmX" aria-label="닫기">×</button></div><div id="tlmBody"></div><div class="tl-foot">위에서 아래로 시간순 · 회색 기울임 = 추정 · 빨강 = 어긋남 · 줄을 누르면 출처 카드로</div></aside><div id="tlmScrim"></div>`);
  $('#btnTl').onclick = () => tlOpen(!document.body.classList.contains('tlopen'));
  $('#tlmX').onclick = () => tlOpen(false); $('#tlmScrim').onclick = () => tlOpen(false);
  $('#tlm').addEventListener('click', async e => {
    const del = e.target.closest('[data-tldel]'); if (del){ e.stopPropagation(); const x = (S.tl || []).find(y => y.id === del.dataset.tldel); if (x && !x.gone){ x.gone = { why:'', turn:S.turn, by:'me' }; act('연혁 지움', { id:x.id, what:x.what }); save(); renderTl(); tlBadge(); } return; }
    const r = e.target.closest('[data-card]'); if (r){ const n = nodeOf(r.dataset.card); if (!n) return; if (innerWidth < 980) tlOpen(false); act('연혁에서 카드로', { id:n.id, tl:r.dataset.tl }); await fly(n.x, n.y, 1, 600); const el = document.querySelector(`#nodes [data-id="${n.id}"]`); if (el){ el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } }
  });
  setInterval(() => { try{ tlBadge(); }catch(e){} }, 1500);   /* 사건을 바꾸거나 되돌리면 단추 수도 따라감 */
})();
