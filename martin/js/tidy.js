/* martin/js/tidy.js — 판 다시 짓기(11-16 A, v0.9.0). 「판 정리」 = 마틴이 지금 판을 보고 사람 중심 묶음을 새로 짜고(누구의 이야기인가),
   실을 솎고·잇고·꼬리표를 고친 뒤, 앱이 묶음마다 '사람 기둥'으로 다시 놓는다. 묶음끼리는 멀리, 묶음 안은 촘촘히.
   S.groups = [{ a:'중심 카드 id'|null, name, cards:[...], c:색 번호 }]  — 순서 = 중요한 순.
   그리기: #zones(카드 밑) = 묶음 바탕·이름표·기둥 실(중심 → 각 카드, 묶음 색) · #xl(카드 위) = 묶음 사이 실(빨강) */
const GCOL = ['#f2c14e', '#6cc4f0', '#8be08f', '#f59ad6', '#f4efe2', '#ff9b52', '#b9a3ff', '#5fe0c8'];
const gColor = g => GCOL[(g.c ?? 0) % GCOL.length];
const groupsOf = () => (S.groups || []).filter(g => (g.a && nodeOf(g.a)) || (g.cards || []).some(nodeOf));
const groupOf = id => (S.groups || []).find(g => g.a === id || (g.cards || []).includes(id));
function joinGroup(id, of){ const g = groupOf(of); if (!g || groupOf(id)) return false; g.cards.push(id); return true; }

/* 묶음이 없거나 빈 카드가 있을 때 — 실을 따라 가장 가까운 중심(사람)에게. 3걸음 안에 없으면 '기타' */
function fillGroups(groups){
  const nb = {}; for (const L of S.links){ (nb[L.a] = nb[L.a] || []).push(L.b); (nb[L.b] = nb[L.b] || []).push(L.a); }
  const taken = new Set(); groups.forEach(g => { if (g.a) taken.add(g.a); g.cards.forEach(id => taken.add(id)); });
  for (const p of S.nodes) if (p.kind === 'person' && !taken.has(p.id)){ groups.push({ a:p.id, name:p.title.slice(0, 10), cards:[] }); taken.add(p.id); }
  const anchorOf = new Map(); groups.forEach(g => { if (g.a) anchorOf.set(g.a, g); g.cards.forEach(id => anchorOf.set(id, g)); });
  let rest = S.nodes.filter(n => n.id !== 'n1' && !taken.has(n.id)).map(n => n.id);
  for (let pass = 0; pass < 3 && rest.length; pass++){   /* 이미 묶인 카드와 직접 이어진 것부터 한 겹씩 */
    const next = [];
    for (const id of rest){ const hit = (nb[id] || []).map(x => anchorOf.get(x)).filter(Boolean); if (hit.length){ const g = hit.sort((p, q) => (q.a && nodeOf(q.a) && nodeOf(q.a).kind === 'person') - (p.a && nodeOf(p.a) && nodeOf(p.a).kind === 'person'))[0]; g.cards.push(id); anchorOf.set(id, g); } else next.push(id); }
    rest = next;
  }
  if (rest.length) groups.push({ a:null, name:'기타', cards:rest });
  groups.forEach((g, i) => { if (g.c == null) g.c = i; });
  return groups.filter(g => (g.a && nodeOf(g.a)) || g.cards.length);
}
/* 사람 기둥 배치 — 묶음마다 중심 카드 위, 나머지는 2~3열 격자. 묶음은 두 줄 기둥(짧은 쪽에 쌓기)으로, 사이를 넓게 */
function layoutPlan(groups){
  measure();
  const sz = id => { const n = nodeOf(id); return { w:n && n.w || 130, h:n && n.h || 150 }; };
  const GX = 22, GY = 30, PAD = 26, HEAD = 34, gapX = 120, gapY = 110;
  const boxes = groups.map(g => {
    const cs = g.cards.filter(id => nodeOf(id) && id !== g.a), C = cs.length > 6 ? 3 : cs.length > 1 ? 2 : 1;
    const cw = Math.max(110, ...cs.map(id => sz(id).w)), rows = []; for (let i = 0; i < cs.length; i += C) rows.push(cs.slice(i, i + C));
    const rowH = rows.map(r => Math.max(...r.map(id => sz(id).h))), A = g.a && nodeOf(g.a) ? sz(g.a) : { w:0, h:0 };
    const w = Math.max(A.w, C * cw + (C - 1) * GX) + PAD * 2, h = HEAD + A.h + (cs.length ? (A.h ? 52 : 6) : 0) + rowH.reduce((s, v) => s + v, 0) + Math.max(0, rows.length - 1) * GY + PAD;
    return { g, cs, C, cw, rows, rowH, A, w, h };
  });
  const nCol = boxes.length > 1 ? 2 : 1, cols = Array.from({ length:nCol }, () => ({ h:0, w:0, list:[] }));
  for (const b of boxes){ const c = cols.reduce((m, x) => x.h < m.h ? x : m, cols[0]); c.list.push(b); c.h += b.h + gapY; c.w = Math.max(c.w, b.w); }
  const totalW = cols.reduce((s, c) => s + c.w, 0) + gapX * (nCol - 1), totalH = Math.max(...cols.map(c => c.h)) - gapY;
  const pos = {}, brief = nodeOf('n1'), top0 = 1000 - totalH / 2 + (brief ? 90 : 0);
  if (brief) pos.n1 = { x:1000, y:Math.round(top0 - 40 - (brief.h || 120) / 2), r:-1 };
  let x0 = 1000 - totalW / 2;
  for (const c of cols){ const cx = x0 + c.w / 2; let y = top0;
    for (const b of c.list){
      if (b.g.a && nodeOf(b.g.a)) pos[b.g.a] = { x:cx, y:y + HEAD + b.A.h / 2 };
      let ry = y + HEAD + b.A.h + (b.A.h ? 52 : 6);
      b.rows.forEach((r, ri) => { r.forEach((id, k) => { pos[id] = { x:cx + (k - (r.length - 1) / 2) * (b.cw + GX), y:ry + b.rowH[ri] / 2 }; }); ry += b.rowH[ri] + GY; });
      y += b.h + gapY; }
    x0 += c.w + gapX; }
  for (const id in pos){ const p = pos[id]; p.x = Math.round(p.x); p.y = Math.round(p.y); if (p.r == null) p.r = (hash(id) % 5) - 2; }
  return pos;
}
async function relayout(quick){   /* 묶음은 그대로, 자리만 다시 */
  if (!(S.groups || []).length) S.groups = fillGroups([]);
  else S.groups = fillGroups(S.groups.map(g => ({ ...g, cards:g.cards.filter(nodeOf) })));
  const pos = layoutPlan(S.groups);
  if (!quick){ await fitAll(400); world.classList.add('hidestr'); await sleep(250); }
  for (const n of S.nodes){ const q = pos[n.id]; if (!q) continue; n.x = q.x; n.y = q.y; n.r = q.r;
    const el = document.querySelector(`#nodes [data-id="${n.id}"]`); if (el){ el.classList.add('mv'); el.style.left = n.x + 'px'; el.style.top = n.y + 'px'; el.style.setProperty('--r', n.r + 'deg'); } }
  await sleep(quick ? 0 : 950); renderNodes(); renderStrings(); renderMarks(); world.classList.remove('hidestr'); await fitAll(quick ? 0 : 700);
}

/* 묶음 그리기 — renderStrings 가 부른다 */
function renderZones(){
  const z = $('#zones'); if (!z) return; const gs = groupsOf(); let svg = '', tags = '';
  if (!gs.length){ z.innerHTML = ''; document.querySelectorAll('#tags .zt').forEach(e => e.remove()); return; }
  const linkOf = (a, b) => S.links.find(L => (L.a === a && L.b === b) || (L.a === b && L.b === a));
  for (const g of gs){
    const col = gColor(g), ids = [g.a, ...g.cards].filter(id => id && nodeOf(id)), ns = ids.map(nodeOf);
    const l = Math.min(...ns.map(n => n.x - (n.w || 120) / 2)) - 20, r = Math.max(...ns.map(n => n.x + (n.w || 120) / 2)) + 20;
    const t = Math.min(...ns.map(n => n.y - (n.h || 140) / 2)) - 40, b = Math.max(...ns.map(n => n.y + (n.h || 140) / 2)) + 20;
    svg += `<rect class="zone" x="${l}" y="${t}" width="${r - l}" height="${b - t}" rx="18" style="--gc:${col}"/>`;
    tags += `<div class="zt" data-g="${esc(g.a || g.name)}" style="left:${l + 14}px;top:${t + 2}px;--gc:${col}">${esc(g.name || (nodeOf(g.a) || {}).title || '묶음')}<small>${ids.length}</small></div>`;
    const A = g.a && nodeOf(g.a); if (!A) continue;
    const ax = A.x, ay = A.y + (A.h || 140) / 2 - 4;
    for (const id of g.cards){ const M = nodeOf(id); if (!M || M === A) continue;
      const L = linkOf(A.id, M.id), my = M.y - (M.h || 140) / 2, sy = my - 16, side = Math.abs(M.x - ax) < 8;
      const d = side ? `M${ax} ${ay}V${my + 4}` : `M${ax} ${ay}V${sy}H${M.x}V${my + 4}`;
      svg += `<path class="spine${L ? (L.sure ? ' sure' : ' maybe') : ''}" data-id="${L ? L.id : ''}" d="${d}" style="--gc:${col}"/>`;
      if (L && L.label) tags += `<div class="tag gt${L.sure ? '' : ' maybe'}" style="left:${side ? ax : (M.x + ax) / 2 + (M.x > ax ? 10 : -10)}px;top:${side ? (ay + my) / 2 : sy}px;--r:0deg;--gc:${col}">${esc(L.label)}${L.sure ? '' : ' ?'}</div>`;
    }
  }
  z.innerHTML = svg;
  document.querySelectorAll('#tags .zt, #tags .gt').forEach(e => e.remove()); $('#tags').insertAdjacentHTML('beforeend', tags);
}
/* 실 나누기 — 묶음 중심↔구성원 실은 기둥으로(위 renderZones), 같은 묶음 안 실은 묶음 색, 묶음 사이 실은 카드 위 빨강 */
function linkKind(L){
  if (!groupsOf().length) return 'old';
  const ga = groupOf(L.a), gb = groupOf(L.b); if (!ga || !gb) return 'x';
  if (ga !== gb) return 'x';
  if (ga.a === L.a || ga.a === L.b) return 'spine';
  return 'in';
}

/* ── 「판 정리」 — 마틴에게 묶음을 새로 짜게 하고 다시 놓는다 ── */
function tidyPrompt(){
  const ls = S.links.map(L => `${L.id}: ${L.a}↔${L.b} ${L.label || ''}${L.sure ? '' : ' (추측)'}`).join('\n') || '(없음)';
  const ns = S.nodes.map(n => `${n.id} [${n.kind}] ${n.title} — ${n.note || ''}`).join('\n');
  const ev = (S.ev || []).filter(e => e.card && e.read).map(e => `${e.card} 판독: ${e.read.replace(/\s+/g, ' ').slice(0, 220)}`).join('\n');
  const old = groupsOf().map(g => `${g.a || '-'} 「${g.name}」: ${g.cards.join(', ')}`).join('\n');
  return `너는 느와르 추리 만화의 탐정 "Dr. 마틴"이다. 동료가 「판 정리」를 눌렀다. 지금 코르크 판을 지금까지 아는 것으로 가장 잘 보이게 처음부터 다시 짠다 — 흩어진 카드를 사람 중심으로 묶고, 실을 솎는다. 판을 본 사람이 '어떤 자료가 어떤 사람과 이어지는지' 한눈에 알아야 한다. 관계없는 건 멀리 떨어진다.

[카드]
${ns}

[실 — id: 양끝 꼬리표]
${ls}
${ev ? `\n[사진·캡처 판독 — 누구의 대화인지 가릴 때 참고]\n${ev}\n` : ''}${old ? `\n[지난번 묶음]\n${old}\n` : ''}
짜는 법
- groups: 묶음 목록, 사건에서 중요한 순서로. {"a":"묶음 중심 카드 id","name":"묶음 이름 8자 이내","cards":["그 묶음에 들 카드 id", …]}
  · 중심(a)은 사람 카드가 기본이다. 사람 없이 굴러가는 갈래(돈·물건·장소·회사)는 그걸 대표하는 카드를 중심으로 한다.
  · n1(사건 파일)을 뺀 모든 카드가 정확히 한 묶음에 들어간다(중심 카드는 cards 에 다시 넣지 않는다).
  · 사진·대화 캡처는 그 대화의 주인공이나 가장 깊이 얽힌 사람에게. 진술·문서는 말한 사람이나 다루는 사람에게. 의문 카드는 그 의문이 걸린 사람에게.
  · 묶음은 2~7개, 한 묶음은 많아야 9장. 넘치면 갈래를 나눈다. 사람이 둘뿐이라도 억지로 둘에 몰지 말고 갈래가 다르면 나눈다.
- cut: 지울 실 id — 겹치거나(같은 두 카드를 잇는 실 둘), 뜻이 흐리거나, 묶음을 짜고 나니 군더더기인 실. 많아야 12.
- link: 새로 이을 실 [{"a":"n…","b":"n…","label":"1~6자","sure":true}] — 특히 자료와 사람(누가 보냈나·누가 나오나), 그리고 묶음 사이의 중요한 관계(누가 누구를 쫓나, 누가 누구에게 거짓말했나). 많아야 8. 확실하지 않으면 sure:false.
- relabel: [{"id":"실 id","label":"1~6자"}] — 뜻이 흐린 꼬리표만.
- merge: 같은 자료의 다른 판본이나 같은 사람의 다른 카드 [{"from":"n…","into":"n…"}] — 있을 때만.
- say: 1~3줄 — 어떻게 다시 짰는지 마틴 말투(짧고 단정한 하드보일드 반말). 줄을 {"t":"…","on":["묶음 중심 id"]} 로 써도 된다. 대사에 카드 번호는 쓰지 않는다.
- 판에 없는 사실을 지어내지 않는다.

JSON 하나만:
{"say":["판을 다시 짠다.",{"t":"…","on":["n3"]}],"groups":[{"a":"n3","name":"…","cards":["n5","n14"]},{"a":"n7","name":"…","cards":["n9"]}],"cut":["n4-n3"],"link":[{"a":"n9","b":"n3","label":"보낸 이","sure":true}],"relabel":[{"id":"n6-n3","label":"…"}],"merge":[]}`;
}
function cleanGroups(raw){
  const seen = new Set(['n1']), out = [];
  for (const g of (Array.isArray(raw) ? raw : []).slice(0, 9)){
    if (!g || typeof g !== 'object') continue; const a = nodeOf(String(g.a || '')) && !seen.has(g.a) ? String(g.a) : null; if (a) seen.add(a);
    const cards = (Array.isArray(g.cards) ? g.cards : []).map(String).filter(id => nodeOf(id) && !seen.has(id)); cards.forEach(id => seen.add(id));
    if (a || cards.length) out.push({ a, name:String(g.name || (a && nodeOf(a).title) || '묶음').slice(0, 10), cards, c:out.length });
  }
  return out;
}
async function rebuildBoard(){
  if (busy) return; setBusy(true); act('판 다시 짓기'); const t0 = Date.now();
  const sample = await getSample(); let r = null, prompt = tidyPrompt();
  if (sample && S.nodes.length > 2){ thinking(true);
    try{ r = await sample.json(prompt, { model:AI.model, effort:AI.effort, modelTier:AI.model.includes('opus') ? 'complex' : AI.model.includes('haiku') ? 'quick' : 'default' }); }
    catch(e){ act('판 다시 짓기 실패', { code:e && e.code || '', msg:String(e && e.message || e).slice(0, 120) }); }
    thinking(false); }
  log('turn', { ok:!!r, n:S.turn + '-tidy' + Date.now(), part:'tidy', model:AI.model, effort:AI.effort, ms:Date.now() - t0, prompt, response:r });
  const say = r ? clean({ say:r.say }).say : [];
  if (say.length) await sayLine(say.shift()); else await speak(r ? '판을 다시 짠다.' : '…머리가 안 닿는다. 실을 따라 내 손으로 다시 놓겠다.');
  if (r){
    for (const m of (Array.isArray(r.merge) ? r.merge : []).slice(0, 4)) if (m && nodeOf(m.from) && nodeOf(m.into) && m.from !== m.into) await doOp({ op:'merge', from:m.from, into:m.into }).catch(() => {});
    const cut = new Set((Array.isArray(r.cut) ? r.cut : []).slice(0, 12).map(String));
    const before = S.links.length; S.links = S.links.filter(L => !cut.has(L.id) && !cut.has(L.b + '-' + L.a));
    for (const x of (Array.isArray(r.relabel) ? r.relabel : []).slice(0, 12)){ const L = x && S.links.find(L => L.id === x.id || L.b + '-' + L.a === x.id); if (L && x.label) L.label = String(x.label).slice(0, 8); }
    let added = 0; for (const x of (Array.isArray(r.link) ? r.link : []).slice(0, 8)){ if (!x || !nodeOf(x.a) || !nodeOf(x.b) || x.a === x.b) continue; if (S.links.some(L => (L.a === x.a && L.b === x.b) || (L.a === x.b && L.b === x.a))) continue; S.links.push({ id:x.a + '-' + x.b, a:x.a, b:x.b, label:String(x.label || '').slice(0, 8), sure:x.sure !== false }); added++; }
    const gs = cleanGroups(r.groups); S.groups = fillGroups(gs);
    act('판 다시 지음', { groups:S.groups.map(g => g.name + ':' + (g.cards.length + (g.a ? 1 : 0))), cut:before - S.links.length + added, added });
  } else S.groups = fillGroups([]);
  await relayout();
  for (const l of say) await sayLine(l);
  if (focusOn) await unfocus();
  save(); renderAll(); setBusy(false);
}

/* 묶음 이름표를 누르면 그 묶음으로 다가가 비춘다 */
board.addEventListener('pointerup', e => { if (typeof moved !== 'undefined' && moved > 8) return;
  const el = document.elementsFromPoint(e.clientX, e.clientY).find(x => x.classList && x.classList.contains('zt')); if (!el || busy) return;
  const g = (S.groups || []).find(x => (x.a || x.name) === el.dataset.g); if (!g) return; act('묶음 보기', { g:g.name });
  const ids = [g.a, ...g.cards].filter(id => id && nodeOf(id)), B = boxOf(ids), W = board.clientWidth, H = board.clientHeight;
  const ns = ids.map(nodeOf), w = Math.max(...ns.map(n => n.x)) - Math.min(...ns.map(n => n.x)) + 300, h = Math.max(...ns.map(n => n.y)) - Math.min(...ns.map(n => n.y)) + 340;
  fly(B.x, B.y, Math.max(.3, Math.min(1, W / w, H / h)), 600).then(() => { spot(ids); clearTimeout(lookBack.t); lookBack.t = setTimeout(() => { if (!busy) unfocus(true); }, 2600); });
});
