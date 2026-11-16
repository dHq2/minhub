/* martin/js/tidy.js — 판 다시 짓기(11-16 A, v0.9.0). 「판 정리」 = 마틴이 지금 판을 보고 사람 중심 묶음을 새로 짜고(누구의 이야기인가),
   실을 솎고·잇고·꼬리표를 고친 뒤, 앱이 묶음마다 불규칙하게 겹친 더미로 다시 놓는다(가로로 퍼짐). 묶음끼리는 떨어지고, 묶음 안은 겹쳐 쌓인다.
   S.groups = [{ a:'중심 카드 id'|null, name, cards:[...], c:색 번호 }]  — 순서 = 중요한 순.
   그리기: 실은 전부 #xl(카드 위) — 핀에서 핀으로 팽팽하게, 같은 묶음 안은 묶음 색 실, 묶음 사이는 빨간 실. 꼬리표는 맨 위 */
const GCOL = ['#e3b23c', '#3f8fd2', '#55a85f', '#d873ae', '#ece5d3', '#e3803a', '#8f74d6', '#2fab9c'];   /* 실 색(털실 느낌) — 빨강은 묶음 사이 몫 */
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
/* 수사판 더미 배치(11-16 A 고침) — 묶음마다 중심 카드 둘레로 자료가 불규칙하게 겹쳐 쌓인 더미. 더미들은 가로로 퍼진다(세로 스크롤 없게).
   겹쳐도 제목 띠는 보이게(가로 62%·세로 50% 넘게는 안 덮음), 기울기 ±7°. 같은 판이면 같은 모양(카드 id 로 정한 난수) */
const rngOf = seed => { let h = hash(String(seed)) || 7; return () => ((h = (Math.imul(h, 1664525) + 1013904223) >>> 0) / 4294967296); };
function layoutPlan(groups){
  measure();
  const sz = id => { const n = nodeOf(id); return { w:n && n.w || 130, h:n && n.h || 150 }; };
  const piles = groups.map((g, gi) => {
    const rnd = rngOf((g.a || g.name) + ':' + gi), ids = g.cards.filter(id => nodeOf(id) && id !== g.a), loc = {}, A = g.a && nodeOf(g.a) ? g.a : null;
    if (A) loc[A] = { x:0, y:0 };
    const a0 = rnd() * Math.PI * 2;
    ids.forEach((id, i) => { const a = a0 + i * 2.39996 + (rnd() - .5) * .6, rad = (A ? 96 : 24) + 36 * Math.sqrt(i) + rnd() * 26; loc[id] = { x:Math.cos(a) * rad * 1.3, y:Math.sin(a) * rad * .85 }; });
    const keys = Object.keys(loc);
    for (let it = 0; it < 80; it++) for (let p = 0; p < keys.length; p++) for (let q = p + 1; q < keys.length; q++){
      const P = loc[keys[p]], Q = loc[keys[q]], sp = sz(keys[p]), sq = sz(keys[q]), nx = (sp.w + sq.w) / 2 * .62, ny = (sp.h + sq.h) / 2 * .5;
      const dx = Q.x - P.x || .1, dy = Q.y - P.y || .1, ox = nx - Math.abs(dx), oy = ny - Math.abs(dy); if (ox <= 0 || oy <= 0) continue;
      const fp = keys[p] === A ? 0 : keys[q] === A ? 1 : .5, fq = 1 - fp;
      if (ox / nx < oy / ny){ const m = Math.sign(dx) * ox; P.x -= m * fp; Q.x += m * fq; } else { const m = Math.sign(dy) * oy; P.y -= m * fp; Q.y += m * fq; }
    }
    let l = 1e9, r = -1e9, t = 1e9, b = -1e9; for (const id of keys){ const o = loc[id], s = sz(id); l = Math.min(l, o.x - s.w / 2); r = Math.max(r, o.x + s.w / 2); t = Math.min(t, o.y - s.h / 2); b = Math.max(b, o.y + s.h / 2); }
    return { g, A, loc, keys, w:r - l, h:b - t, ox:(l + r) / 2, oy:(t + b) / 2, rnd, x:0, y:0 };
  });
  const brief = nodeOf('n1'); if (brief){ const s = sz('n1'); piles.unshift({ g:null, A:'n1', loc:{ n1:{ x:0, y:0 } }, keys:['n1'], w:s.w, h:s.h, ox:0, oy:0, rnd:rngOf('n1'), x:0, y:0, brief:1 }); }
  /* 더미 자리 — 가장 중요한 묶음이 가운데, 나머지는 좌우로 번갈아(가로 타원), 위아래로 조금씩 엇갈리게 */
  const main = piles.find(p => !p.brief), rest = piles.filter(p => p !== main && !p.brief), R = rngOf('board' + groups.length);
  if (main){ main.x = 0; main.y = 0; }
  const ANG = [0, Math.PI, -.55, Math.PI + .55, .55, Math.PI - .55, -1.05, Math.PI + 1.05, 1.05, Math.PI - 1.05];
  rest.forEach((p, i) => { const a = ANG[i % ANG.length] + (R() - .5) * .3, ring = 1 + Math.floor(i / ANG.length) * .8;
    p.x = Math.cos(a) * ((main ? main.w : 0) / 2 + p.w / 2 + 70 + R() * 50) * ring; p.y = Math.sin(a) * ((main ? main.h : 0) / 2 + p.h / 2 + 50 + R() * 40) * ring; });
  const bp = piles.find(p => p.brief); if (bp && main){ bp.x = -main.w * .22 + (R() - .5) * 60; bp.y = -main.h / 2 - bp.h / 2 - 50; }
  for (let it = 0; it < 120; it++) for (let p = 0; p < piles.length; p++) for (let q = p + 1; q < piles.length; q++){   /* 더미끼리는 떨어지게 */
    const P = piles[p], Q = piles[q], gap = P.brief || Q.brief ? 24 : 46, dx = Q.x - P.x || .1, dy = Q.y - P.y || .1;
    const ox = (P.w + Q.w) / 2 + gap - Math.abs(dx), oy = (P.h + Q.h) / 2 + gap - Math.abs(dy); if (ox <= 0 || oy <= 0) continue;
    const fp = P === main ? 0 : Q === main ? 1 : .5, fq = 1 - fp;
    if (ox * .7 < oy){ const m = Math.sign(dx) * ox; P.x -= m * fp; Q.x += m * fq; } else { const m = Math.sign(dy) * oy; P.y -= m * fp; Q.y += m * fq; }   /* 가로로 밀어내는 쪽을 먼저 */
  }
  const pos = {};
  for (const p of piles) for (const id of p.keys){ const o = p.loc[id]; pos[id] = { x:Math.round(1000 + p.x + o.x - p.ox), y:Math.round(1000 + p.y + o.y - p.oy), r:id === p.A ? Math.round((p.rnd() - .5) * 5) : Math.round((p.rnd() - .5) * 14) }; }
  /* 겹치는 순서 — 사건 파일 맨 아래, 더미마다 먼 자료 → 가까운 자료 → 중심 카드가 맨 위 */
  const order = []; for (const p of piles){ const ks = p.keys.filter(id => id !== p.A).sort((a, b) => Math.hypot(p.loc[b].x, p.loc[b].y) - Math.hypot(p.loc[a].x, p.loc[a].y)); order.push(...ks); if (p.A) order.push(p.A); }
  pos.__order = order;
  return pos;
}
async function relayout(quick){   /* 묶음은 그대로, 자리만 다시 */
  if (!(S.groups || []).length) S.groups = fillGroups([]);
  else S.groups = fillGroups(S.groups.map(g => ({ ...g, cards:g.cards.filter(nodeOf) })));
  const pos = layoutPlan(S.groups);
  const ord = pos.__order || []; delete pos.__order; const rk = new Map(ord.map((id, i) => [id, i])); S.nodes.sort((a, b) => (rk.has(a.id) ? rk.get(a.id) : -1) - (rk.has(b.id) ? rk.get(b.id) : -1));
  if (!quick){ await fitAll(400); world.classList.add('hidestr'); await sleep(250); }
  for (const n of S.nodes){ const q = pos[n.id]; if (!q) continue; n.x = q.x; n.y = q.y; n.r = q.r;
    const el = document.querySelector(`#nodes [data-id="${n.id}"]`); if (el){ el.classList.add('mv'); el.style.left = n.x + 'px'; el.style.top = n.y + 'px'; el.style.setProperty('--r', n.r + 'deg'); } }
  await sleep(quick ? 0 : 950); renderNodes(); renderStrings(); renderMarks(); world.classList.remove('hidestr'); await fitAll(quick ? 0 : 700);
}

/* 묶음 상자·이름표·꺾은 실은 걷어 냄(11-16 A — 보스: 도식 말고 진짜 수사판). 남은 흔적만 지운다 */
function renderZones(){ const z = $('#zones'); if (z) z.innerHTML = ''; document.querySelectorAll('#tags .zt').forEach(e => e.remove()); }
/* 실 나누기 — 묶음 중심↔구성원 실은 기둥으로(위 renderZones), 같은 묶음 안 실은 묶음 색, 묶음 사이 실은 카드 위 빨강 */
function linkKind(L){
  if (!groupsOf().length) return 'old';
  const ga = groupOf(L.a), gb = groupOf(L.b); if (!ga || !gb) return 'x';
  if (ga !== gb) return 'x';
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
