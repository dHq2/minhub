/* martin/js/puzzles.js — 난제 지도(v0.6.0, 11-16 B). 고칠 땐 이 줄 아래에 「11-16 B: …」처럼 날짜·방 주석 */
/* ── 난제 지도 — 조립식 수사
   뿌리 난제 p1(이 사건의 진실) 아래로 작은 난제가 갈라진다. 난제마다 가설(확신 %, 근거 id, 추리 한 줄, 확신 이력).
   작은 난제가 풀리면 그 결론이 윗 난제 가설의 근거가 된다 — 아래에서 위로 조립해 진실에 닿는다.
   동료가 난제를 지정하고 「붙잡는다」(지금 팔 난제). 마틴은 답의 pz 로 난제·가설을 세우고 고치고 버리고 푼다.
   폰: 위 「난제」 단추로 오른쪽 서랍. 아주 넓은 화면(1180px~): 판 오른쪽에 늘 펼침.
   모든 게 난제는 아니다 — 난제는 합쳐지기도(merge), 없어지기도(drop) 한다. 사라진 난제는 「사라진 난제」에 이유와 함께 남는다(S.pgone).
   옛 큰 가설 띠는 한 줄 「붙잡은 난제」 띠가 됐다(renderPzBar). 옛 S.hyp 는 처음 열 때 뿌리 난제의 가설로 옮긴다 */
/* 11-17 B: v0.14 판단 규칙 — ① 확신은 새 근거(b 에 새 id)가 올 때만 움직인다(근거 없이 2~5%씩 흔들리던 것). ② 근거 없이 오래 멈춘 가설엔 프롬프트에 「n턴째 그대로」 — 버리거나(kill) 받쳐라.
   ③ 의뢰의 본래 질문(누굴 찾나·무엇을 밝히나)은 「의뢰」 난제(p.req)로 — 없으면 프롬프트가 세우라고 짚는다 */
const PZ_ROOT_T = '무슨 일이 있었나 — 이 사건의 진실';
const PZ_IDLE = 8;   /* 이만큼 턴 동안 확신·근거가 그대로면 「멈춘 가설」 */
let pzSel = null, pzFlash = new Set();
const pzPct = v => Math.max(0, Math.min(100, Math.round(+v || 0)));
const probOf = id => (S.probs || []).find(p => p.id === id);
const hypOf = id => { for (const p of S.probs || []) for (const h of p.hy) if (h.id === id) return [h, p]; return [null, null]; };
const pzRoot = () => (S.probs || []).find(p => p.root) || (S.probs || [])[0];
const pzKids = id => S.probs.filter(p => p.up === id);
const liveHy = p => p.hy.filter(h => h.st === 'live').sort((a, b) => b.c - a.c);
function pzEv(p, t, by){ (p.log || (p.log = [])).push({ turn:S.turn, at:Date.now(), by:by === 'me' ? 'me' : 'you', t:String(t).slice(0, 120) }); if (p.log.length > 40) p.log.splice(0, p.log.length - 40); }
function ensurePz(){
  if (!S || S.probs) return;
  S.probs = []; S.pmax = 0; S.hmax = 0;
  const root = { id:'p' + (++S.pmax), t:PZ_ROOT_T, up:null, by:'you', st:'open', hy:[], root:1, at:S.at || Date.now(), turn:null, log:[] };
  S.probs.push(root); S.pfocus = root.id;
  const h = S.hyp;   /* 옛 가설 띠 → 뿌리 난제의 가설 */
  if (h && h.n > 0 && h.title){
    addHyp(root, { t:h.title, c:h.confidence, why:h.body, b:h.culprit ? [h.culprit] : [] }, 'you', '옛 가설 띠에서 옮김');
    for (const a of h.alts || []) if (a.title) addHyp(root, { t:a.title, c:a.confidence, b:[] }, 'you', '옛 가설 띠에서 옮김');
  }
}
/* 근거 — 판 카드 n… · 수첩 m… · 난제 p… · 가설 h… 만 받는다(지금 있는 것만) */
const basisOk = id => /^n\d+$/.test(id) ? !!nodeOf(id) : /^m\d+$/.test(id) ? (S.notes || []).some(x => x.id === id) : /^p\d+$/.test(id) ? !!probOf(id) : /^h\d+$/.test(id) ? !!hypOf(id)[0] : false;
const basisOf = b => [...new Set((Array.isArray(b) ? b : typeof b === 'string' ? b.split(/[\s,]+/) : []).map(x => String(x).trim()).filter(basisOk))].slice(0, 8);
function addHyp(p, o, by, why0){
  let id = /^h\d+$/.test(o.id || '') && !hypOf(o.id)[0] ? o.id : 'h' + (S.hmax + 1);
  const k = +id.slice(1); if (k > S.hmax) S.hmax = k;
  const h = { id, t:String(o.t || '').trim().slice(0, 80), c:pzPct(o.c), b:basisOf(o.b), why:String(o.why || '').slice(0, 200), by:by === 'me' ? 'me' : 'you', st:'live', turn:S.turn, at:Date.now(), hist:[[S.turn, pzPct(o.c)]] };
  if (!h.t) return null; p.hy.push(h); pzEv(p, `${h.id} 세움 ${h.c}%${why0 ? ' · ' + why0 : ''}`, by); return h;
}
function addProb(o, by){
  const t = String(o.t || '').trim().slice(0, 80); if (!t) return null;
  const same = S.probs.find(p => p.t === t); if (same) return same;
  let id = /^p\d+$/.test(o.id || '') && !probOf(o.id) ? o.id : 'p' + (S.pmax + 1);
  const k = +id.slice(1); if (k > S.pmax) S.pmax = k;
  const up = probOf(o.up) ? o.up : pzRoot().id;
  const p = { id, t, up, by:by === 'me' ? 'me' : 'you', st:'open', hy:[], at:Date.now(), turn:S.turn, log:[] };
  if (o.req && !S.probs.some(x => x.req)) p.req = 1;   /* 11-17 B: 의뢰의 본래 질문 — 사건에 하나 */
  S.probs.push(p); pzEv(p, `난제 지정 — ${up} 아래${p.req ? ' · 의뢰' : ''}`, by); return p;
}
/* 마틴의 답 → 난제 지도. 옛 모양(hypothesis)이 오면 뿌리 난제 가설로 받는다 */
async function applyPz(raw){
  ensurePz(); const r = raw || {}, made = []; let ops = Array.isArray(r.pz) ? r.pz.filter(o => o && typeof o === 'object') : [];
  if (!ops.length && r.hypothesis && r.hypothesis.title){ const H = r.hypothesis, root = pzRoot(), same = liveHy(root).find(h => h.t === String(H.title).slice(0, 80));
    ops = [{ op:'hyp', p:root.id, id:same ? same.id : undefined, t:H.title, c:H.confidence, why:H.body, b:H.culprit ? [H.culprit] : [] }]; }
  for (const o of ops.slice(0, 12)){
    try{
      if (o.op === 'new'){ const p = addProb(o, o.by); if (p){ made.push(p.id); act('난제 생김', { id:p.id, t:p.t, by:p.by }); } }
      else if (o.op === 'hyp'){
        const [old, op] = o.id ? hypOf(o.id) : [null, null];
        if (old){ let c = o.c != null ? pzPct(o.c) : old.c; const b = o.b != null ? basisOf(o.b) : old.b, nb = b.filter(x => !old.b.includes(x));
          if (c !== old.c && !nb.length){ act('확신 그대로 — 새 근거 없음', { id:old.id, want:c, keep:old.c }); c = old.c; }   /* 11-17 B: 확신은 새 근거가 올 때만 */
          const msg = []; if (c !== old.c){ msg.push(`${old.c}→${c}%`); old.hist.push([S.turn, c]); old.c = c; }
          if (nb.length) old.bturn = S.turn;
          if (o.t && String(o.t).trim() && String(o.t).trim().slice(0, 80) !== old.t){ old.t = String(o.t).trim().slice(0, 80); msg.push('고쳐 씀'); }
          if (b.join() !== old.b.join()){ old.b = b; msg.push('근거 ' + (b.join(',') || '없음')); }
          if (o.why){ old.why = String(o.why).slice(0, 200); }
          if (old.st === 'dead'){ old.st = 'live'; delete old.kill; msg.push('되살림'); }
          if (msg.length){ pzEv(op, `${old.id} ${msg.join(' · ')}`, 'you'); made.push(old.id); } }
        else { const p = probOf(o.p) || probOf(S.pfocus) || pzRoot(); const h = addHyp(p, o, o.by); if (h) made.push(h.id); }
      }
      else if (o.op === 'kill'){ const [h, p] = hypOf(o.h || o.id); if (h && h.st !== 'dead'){ h.st = 'dead'; h.kill = String(o.why || '').slice(0, 120); h.killTurn = S.turn; pzEv(p, `${h.id} 버림${h.kill ? ' — ' + h.kill : ''}`, 'you'); made.push(h.id); } }
      else if (o.op === 'solve'){ const p = probOf(o.p); if (p && p.st !== 'solved'){ const [w] = o.h ? hypOf(o.h) : [null];
          p.st = 'solved'; p.a = String(o.a || (w && w.t) || '').slice(0, 160); p.ab = basisOf(o.b && o.b.length ? o.b : w ? w.b : []); p.doneTurn = S.turn; p.doneAt = Date.now();
          if (w && p.hy.includes(w)){ w.st = 'win'; p.win = w.id; }
          pzEv(p, `풀림 → ${p.a}`, 'you'); made.push(p.id); act('난제 풀림', { id:p.id, a:p.a });
          if (p.root) boom('봐라.'); else if (p.up) pzEv(probOf(p.up), `${p.id} 풀림 — 이제 근거로 쓸 수 있다`, 'you'); } }
      else if (o.op === 'reopen'){ const p = probOf(o.p); if (p && p.st === 'solved'){ reopenProb(p, String(o.why || '').slice(0, 120), 'you'); made.push(p.id); } }
      else if (o.op === 'edit' && o.req){ const p = probOf(o.p); if (p && !p.root && !S.probs.some(x => x.req && x !== p)){ p.req = 1; pzEv(p, '의뢰의 본래 질문으로', 'you'); made.push(p.id); } }   /* 11-17 B */
      else if (o.op === 'edit'){ const p = probOf(o.p); if (p && !p.root && p.by !== 'me' && o.t){ p.t = String(o.t).trim().slice(0, 80); pzEv(p, '제목 고침', 'you'); made.push(p.id); } }
      else if (o.op === 'merge'){ const f = probOf(o.from || o.p), t = probOf(o.into); if (f && t && !f.root && f !== t && t.up !== f.id && mergeProb(f, t, o.why, 'you')){ made.push(t.id); act('난제 합침', { from:f.id, into:t.id, why:o.why || '' }); } }
      else if (o.op === 'drop'){ const p = probOf(o.p || o.id); if (p && !p.root && goneProb(p, {}, o.why, 'you')){ pzEv(probOf(p.up) || pzRoot(), `${p.id} 「${p.t}」 없어짐${o.why ? ' — ' + o.why : ''}`, 'you'); made.push(p.up); act('난제 없어짐', { id:p.id, why:o.why || '' }); } }
      else if (o.op === 'focus'){ const p = probOf(o.p); if (p && S.pfocus !== p.id){ S.pfocus = p.id; pzEv(p, '붙잡음', 'me'); made.push(p.id); } }
      if (o.line) await speak(String(o.line).slice(0, 60));
    }catch(e){ act('난제 조작 오류', { op:o.op, msg:String(e && e.message || e).slice(0, 160) }); }
  }
  if (made.length){ pzFlash = new Set(made); renderPz(); renderPzBar(true); pzPing(); save(); }
  return { n:made.length, made };
}
function goneProb(p, how, why, by){   /* 지우기·없어짐·합쳐짐 공통 — 아래 난제는 윗 난제로 올리고, 흔적은 S.pgone 에 */
  if (!p || p.root) return false;
  for (const k of pzKids(p.id)) k.up = how.into || p.up;
  S.probs = S.probs.filter(x => x !== p);
  if (S.pfocus === p.id) S.pfocus = how.into || p.up; if (pzSel === p.id) pzSel = how.into || p.up;
  (S.pgone || (S.pgone = [])).push({ id:p.id, t:p.t, by:p.by, into:how.into || null, why:String(why || '').slice(0, 120), who:by === 'me' ? 'me' : 'you', turn:S.turn, at:Date.now(), hy:p.hy.length });
  if (S.pgone.length > 40) S.pgone.splice(0, S.pgone.length - 40);
  return true;
}
function mergeProb(from, into, why, by){   /* from 을 into 로 — 가설(번호 그대로)·아래 난제·근거 id 가 따라간다 */
  if (!from || !into || from === into || from.root) return false;
  for (const h of from.hy){ if (into.hy.some(x => x.t === h.t)) continue; into.hy.push(h); }
  for (const p of S.probs){ const fix = b => [...new Set((b || []).map(x => x === from.id ? into.id : x))]; p.ab = p.ab && fix(p.ab); for (const h of p.hy) h.b = fix(h.b); }
  pzEv(into, `${from.id} 「${from.t}」 합쳐 들어옴${why ? ' — ' + why : ''}`, by);
  return goneProb(from, { into:into.id }, why, by);
}
function reopenProb(p, why, by){ p.st = 'open'; (p.was || (p.was = [])).push({ a:p.a, turn:p.doneTurn }); const w = p.hy.find(h => h.id === p.win); if (w) w.st = 'live'; delete p.a; delete p.ab; delete p.win; delete p.doneTurn; pzEv(p, '다시 열림' + (why ? ' — ' + why : ''), by); }
function pzRename(from, into){   /* 판의 카드가 합쳐지면 근거 id 도 따라간다 */
  for (const p of S.probs || []){ const fix = b => [...new Set((b || []).map(x => x === from ? into : x))]; p.ab = p.ab && fix(p.ab); for (const h of p.hy) h.b = fix(h.b); }
}
/* 마틴에게 보내는 난제 지도 */
function pzIdle(h){ if (h.st !== 'live' || S.turn == null) return 0; const last = Math.max(h.turn ?? 0, h.bturn ?? 0, (h.hist[h.hist.length - 1] || [0])[0] ?? 0); return S.turn - last; }   /* 11-17 B: 확신·근거가 그대로인 턴 수 */
function pzText(){
  ensurePz();
  const out = [], lineH = h => `${'  '}가설 ${h.id}${h.by === 'me' ? '(동료)' : ''} ${h.c}% ${h.t} | 근거 ${h.b.join(',') || '없음'}${h.why ? ' | 왜: ' + h.why : ''}${h.hist.length > 1 ? ' | 이력 ' + h.hist.map(x => x[1]).join('→') : ''}${pzIdle(h) >= PZ_IDLE ? ` | 근거 없이 ${pzIdle(h)}턴째 그대로` : ''}`;
  const walk = (p, d) => {
    const pad = '  '.repeat(d), tags = [p.st === 'solved' ? '풀림' : '열림', p.root ? '뿌리' : '', S.pfocus === p.id ? '붙잡음' : '', p.by === 'me' ? '동료 지정' : '', p.req ? '의뢰' : ''].filter(Boolean).join('·');
    out.push(`${pad}${p.id} [${tags}] ${p.t}${p.root ? '' : ` (→ ${p.up} 의 근거)`}`);
    if (p.st === 'solved') out.push(`${pad}  결론: ${p.a} | 근거 ${(p.ab || []).join(',') || '없음'}`);
    else { const lv = liveHy(p); for (const h of lv) out.push(pad + lineH(h)); if (!lv.length) out.push(`${pad}  (가설 없음)`);
      for (const h of p.hy.filter(h => h.st === 'dead').slice(-2)) out.push(`${pad}  버린 가설 ${h.id} ${h.t}${h.kill ? ' — ' + h.kill : ''}`); }
    for (const k of pzKids(p.id)) walk(k, d + 1);
  };
  walk(pzRoot(), 0);
  const gone = (S.pgone || []).slice(-5).map(g => `${g.id} 「${g.t}」 ${g.into ? g.into + ' 로 합쳐짐' : '없어짐'}${g.why ? ' — ' + g.why : ''}`);
  return `붙잡은 난제: ${S.pfocus || pzRoot().id}\n${out.join('\n')}${gone.length ? '\n사라진 난제(최근): ' + gone.join(' / ') : ''}`;   /* 11-17 B: 의뢰 난제 짚음은 「이번 턴에 걸린 것」(rules.js)으로 */
}
/* ── 그리기 ── */
const pzUnderOf = () => [probOf(pzSel), probOf(S.pfocus)].find(p => p && p.st !== 'solved') || pzRoot();   /* 새 난제는 펼친 난제 → 붙잡은 난제 → 뿌리 아래(풀린 난제 밑엔 안 단다) */
const pzOpenCount = () => (S.probs || []).filter(p => p.st !== 'solved').length;
function pzPing(){ const b = $('#pzN'); if (b) b.textContent = pzOpenCount() || ''; const t = $('#btnPz'); if (t){ t.classList.remove('ping'); void t.offsetWidth; t.classList.add('ping'); } }
function basisChip(id){
  if (/^n\d+$/.test(id)){ const n = nodeOf(id); return n ? `<button type="button" class="bc bn" data-go="${id}"><i>${id}</i>${esc(n.title)}</button>` : `<span class="bc gone"><i>${id}</i>뗀 카드</span>`; }
  if (/^m\d+$/.test(id)){ const n = (S.notes || []).find(x => x.id === id); return n ? `<button type="button" class="bc bm" data-go="${id}"><i>${id}</i>${esc(n.t.slice(0, 18))}${n.t.length > 18 ? '…' : ''}</button>` : `<span class="bc gone"><i>${id}</i>지운 줄</span>`; }
  if (/^p\d+$/.test(id)){ const p = probOf(id); return p ? `<button type="button" class="bc bp${p.st === 'solved' ? ' ok' : ''}" data-go="${id}"><i>${id}</i>${p.st === 'solved' ? esc((p.a || '풀림').slice(0, 20)) : '아직 열림'}</button>` : `<span class="bc gone"><i>${id}</i>없음</span>`; }
  if (/^h\d+$/.test(id)){ const [h] = hypOf(id); return h ? `<span class="bc bh"><i>${id}</i>${esc(h.t.slice(0, 16))}</span>` : ''; }
  return '';
}
const basisRow = b => `<div class="bs">${b && b.length ? b.map(basisChip).join('') : '<span class="bc none">근거 없음</span>'}</div>`;
function hyHtml(h){
  return `<div class="hy st-${h.st}${pzFlash.has(h.id) ? ' new' : ''}">
    <div class="hy-h"><i>${h.id}</i><b>${h.st === 'dead' ? `<s>${esc(h.t)}</s>` : esc(h.t)}</b><span>${h.st === 'win' ? '정답' : h.st === 'dead' ? '버림' : h.c + '%'}</span></div>
    ${h.st === 'live' ? `<div class="hm"><i style="width:${h.c}%"></i></div>` : ''}
    ${h.why ? `<p class="why">${esc(h.why)}</p>` : ''}${h.st === 'dead' && h.kill ? `<p class="why kill">버린 이유 · ${esc(h.kill)}</p>` : ''}
    ${basisRow(h.b)}
    <div class="hh">${h.by === 'me' ? '나' : '마틴'} · 턴 ${h.turn ?? '-'}${h.hist.length > 1 ? ' · 확신 ' + h.hist.map(x => x[1]).join(' → ') : ''}</div></div>`;
}
function probHtml(p, d){
  const lv = liveHy(p), lead = lv[0], sel = pzSel === p.id, kids = pzKids(p.id), dead = p.hy.filter(h => h.st === 'dead');
  const tag = p.st === 'solved' ? '풀림' : S.pfocus === p.id ? '붙잡음' : '열림';
  return `<div class="pzn st-${p.st}${S.pfocus === p.id ? ' focus' : ''}${sel ? ' sel' : ''}${p.root ? ' root' : ''}${pzFlash.has(p.id) ? ' new' : ''}" data-p="${p.id}">
  <button type="button" class="pz-h" data-ptog="${p.id}"><i class="pid">${p.id}</i><span class="ptag${p.req ? ' preq' : ''}">${p.req ? '의뢰 · ' : ''}${tag}</span><b class="pt">${esc(p.t)}</b><span class="pc">${p.st === 'solved' ? '✓' : lead ? lead.c + '%' : '—'}</span></button>
  ${p.st === 'solved' ? `<div class="pz-a">→ ${esc(p.a || '')}${!p.root ? `<small>${p.up} 의 근거</small>` : ''}</div>` : lead ? `<div class="pz-s"><i>${lead.id}</i>${esc(lead.t)}${lv.length > 1 ? `<small>외 ${lv.length - 1}</small>` : ''}</div>` : `<div class="pz-s none">가설 없음 — 자료가 더 필요하다</div>`}
  ${sel ? `<div class="pz-more">
    ${p.st === 'solved' ? `<div class="hy st-win"><div class="hy-h"><i>결론</i><b>${esc(p.a || '')}</b><span>턴 ${p.doneTurn ?? '-'}</span></div>${basisRow(p.ab)}</div>` : ''}
    ${p.hy.filter(h => h.st !== 'dead').sort((a, b) => (b.st === 'win') - (a.st === 'win') || b.c - a.c).map(hyHtml).join('') || '<p class="pz-empty">아직 이 난제에 세운 가설이 없다.</p>'}
    ${dead.length ? `<details class="dead"><summary>버린 가설 ${dead.length}</summary>${dead.map(hyHtml).join('')}</details>` : ''}
    <details class="plog"><summary>이력 ${(p.log || []).length}</summary><ol>${(p.log || []).slice().reverse().map(e => `<li><i>턴 ${e.turn ?? '-'}</i>${e.by === 'me' ? '나 · ' : ''}${esc(e.t)}</li>`).join('')}</ol></details>
    <div class="pz-act">${p.st !== 'solved' && S.pfocus !== p.id ? `<button type="button" data-pfocus="${p.id}">붙잡기</button>` : ''}${p.st === 'solved' ? `<button type="button" data-preopen="${p.id}">다시 열기</button>` : `<button type="button" data-psolve="${p.id}">풀림 표시</button>`}${!p.root ? `<button type="button" class="del" data-pdel="${p.id}">지우기</button>` : ''}</div>
  </div>` : ''}
  ${kids.length ? `<div class="pz-kids">${kids.map(k => probHtml(k, d + 1)).join('')}</div>` : ''}
</div>`;
}
function renderPz(){
  if (!S || !$('#pzmBody')) return; ensurePz();
  const all = S.probs, solved = all.filter(p => p.st === 'solved').length, under = pzUnderOf();
  $('#pzmBody').innerHTML = `<div class="pz-sum0"><span>풀림 <b>${solved}</b> / ${all.length}</span><span>붙잡은 난제 <b>${esc(S.pfocus || '-')}</b></span></div>${probHtml(pzRoot(), 0)}${(S.pgone || []).length ? `<details class="pgone"><summary>사라진 난제 ${S.pgone.length}</summary><ol>${S.pgone.slice().reverse().map(g => `<li><i>${g.id}</i><s>${esc(g.t)}</s><em>${g.into ? `→ ${g.into} 로 합쳐짐` : '없어짐'}${g.why ? ' · ' + esc(g.why) : ''} · ${g.who === 'me' ? '나' : '마틴'} · 턴 ${g.turn ?? '-'}</em></li>`).join('')}</ol></details>` : ''}`;
  $('#pzmUnder').textContent = '↳ ' + under.id + ' 아래';
  $('#pzmCase').textContent = (nodeOf('n1') || {}).title || '새 사건';
  const b = $('#pzN'); if (b) b.textContent = pzOpenCount() || '';
  setTimeout(() => { pzFlash = new Set(); }, 50);
}
/* 옛 가설 띠 자리 — 한 줄 「붙잡은 난제」 */
function renderPzBar(bump){
  if (!S || !$('#hypN')) return; ensurePz();
  const p = probOf(S.pfocus) || pzRoot(), lead = liveHy(p)[0], solved = S.probs.filter(x => x.st === 'solved').length;
  $('#hypN').textContent = p.id + (p.st === 'solved' ? ' 풀림' : ' 붙잡음');
  $('#hypT').textContent = p.st === 'solved' ? `${p.t} → ${p.a || ''}` : lead ? `${p.t} · ${lead.id} ${lead.t}` : `${p.t} · 가설 없음`;
  const v = p.st === 'solved' ? 100 : lead ? lead.c : 0;
  $('#hypP').textContent = v; $('#hypM').style.width = v + '%';
  $('#pzCnt').textContent = `${solved}/${S.probs.length}`;
  if (bump){ const e = $('#hyp'); e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); }
}
/* ── 손으로 ── */
const pzWide = () => innerWidth >= 1180;
const pzOpen = on => { document.body.classList.toggle('pzmopen', on); if (on){ if (!pzWide() && document.body.classList.contains('nbopen')) nbOpen(false); act('난제 지도 열기'); renderPz(); } };
$('#btnPz').onclick = () => pzOpen(!document.body.classList.contains('pzmopen'));
$('#hyp').onclick = () => { pzSel = S.pfocus; pzOpen(true); setTimeout(() => { const el = document.querySelector(`#pzm [data-p="${pzSel}"]`); if (el) el.scrollIntoView({ block:'nearest' }); }, 320); };
$('#pzmX').onclick = () => pzOpen(false); $('#pzmScrim').onclick = () => pzOpen(false);
$('#pzm').addEventListener('click', async e => {
  const g = e.target.closest('[data-go]');
  if (g){ const id = g.dataset.go;
    if (/^n/.test(id)){ const n = nodeOf(id); if (!n) return; if (!pzWide()) pzOpen(false); act('난제에서 카드로', { id }); await fly(n.x, n.y, 1, 600); const el = document.querySelector(`#nodes [data-id="${id}"]`); if (el){ el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } }
    else if (/^m/.test(id)){ if (!pzWide()) pzOpen(false); nbFlash = new Set([id]); nbOpen(true); act('난제에서 수첩으로', { id }); setTimeout(() => { const el = document.querySelector(`#nb [data-n="${id}"]`); if (el) el.scrollIntoView({ block:'center' }); }, 330); }
    else if (/^p/.test(id)){ pzSel = id; pzFlash = new Set([id]); renderPz(); const el = document.querySelector(`#pzm [data-p="${id}"]`); if (el) el.scrollIntoView({ block:'center', behavior:'smooth' }); }
    return; }
  const t = e.target.closest('[data-ptog]'); if (t){ pzSel = pzSel === t.dataset.ptog ? null : t.dataset.ptog; if (pzSel) act('난제 펼침', { id:pzSel }); renderPz(); return; }
  const f = e.target.closest('[data-pfocus]'); if (f){ const p = probOf(f.dataset.pfocus); S.pfocus = p.id; pzEv(p, '붙잡음', 'me'); act('난제 붙잡음', { id:p.id }); save(); renderPz(); renderPzBar(true); return; }
  const s = e.target.closest('[data-psolve]'); if (s){ const p = probOf(s.dataset.psolve), lead = liveHy(p)[0];
    p.st = 'solved'; p.a = lead ? lead.t : '동료가 풀림 표시'; p.ab = lead ? lead.b.slice() : []; p.doneTurn = S.turn; p.doneAt = Date.now(); if (lead){ lead.st = 'win'; p.win = lead.id; }
    pzEv(p, `풀림 표시 → ${p.a}`, 'me'); act('난제 풀림 표시', { id:p.id, a:p.a }); if (S.pfocus === p.id && p.up) S.pfocus = p.up; save(); renderPz(); renderPzBar(true); return; }
  const r = e.target.closest('[data-preopen]'); if (r){ const p = probOf(r.dataset.preopen); reopenProb(p, '', 'me'); act('난제 다시 열기', { id:p.id }); save(); renderPz(); renderPzBar(true); return; }
  const d = e.target.closest('[data-pdel]'); if (d){ const p = probOf(d.dataset.pdel); if (!p || p.root) return; const up = probOf(p.up);
    goneProb(p, {}, '동료가 지움', 'me'); act('난제 지움', { id:p.id, t:p.t }); if (up) pzEv(up, `${p.id} 「${p.t}」 지움`, 'me'); save(); renderPz(); renderPzBar(); return; }
});
$('#pzmAdd').addEventListener('submit', e => { e.preventDefault(); const i = $('#pzmIn'), t = i.value.trim(); if (!t) return;
  const under = pzUnderOf(), p = addProb({ t, up:under.id }, 'me'); i.value = '';
  if (p){ act('난제 지정', { id:p.id, t, up:under.id }); pzSel = under.id; pzFlash = new Set([p.id]); save(); renderPz(); renderPzBar();
    const el = document.querySelector(`#pzm [data-p="${p.id}"]`); if (el) el.scrollIntoView({ block:'nearest' }); } });
