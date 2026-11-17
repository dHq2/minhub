/* martin/js/ai.js — 마틴에게 묻기 — 프롬프트(buildPrompt) · 한 턴(turn). 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
/* ── 마틴에게 묻기 ── */
/* 11-17 A: 한 번에 보낼 수 있는 그림 수 — 보스 사건 20261117-5723 에서 사진 4장(세로로 긴 캡처 둘이 3조각씩 = 8장)이 「at most 4 images per call」로 튕겼다 */
let IMG_MAX = 4;
/* 11-18 A: 그림엔 이름표가 안 붙는다 — 보내는 그림마다 어느 자료인지 순서표를 글로 같이 보낸다(보스 사건: 사진 세 장의 판독문이 서로 엇갈려 붙고, 카드 이름을 고쳐도 같은 이름으로만 고침).
   마틴에게 그림을 보내는 길(새 자료·띄운 사진·먼저 판독·다시 보기·없다 전 다시 보기)은 전부 이 하나로 묶어 보낸다. groups = [{label, imgs}] */
const evLabel = e => `${e.id}${e.card ? '(판 ' + e.card + ')' : ''}「${typeof evTitle === 'function' ? evTitle(e) : e.title || ''}」`;
function imgPack(groups, max){
  const lim = max || IMG_MAX, imgs = [], rows = [];
  for (const g of groups || []){ const all = g && g.imgs || [], list = all.slice(0, lim - imgs.length); if (!list.length) continue;
    const a = imgs.length + 1, b = imgs.length + list.length; imgs.push(...list);
    rows.push(`${a === b ? a : a + '~' + b}번째 = ${g.label}${list.length > 1 || all.length > list.length ? ` — 세로로 긴 사진, 위에서부터 ${list.length}조각${all.length > list.length ? `(모두 ${all.length}조각 중)` : ''}` : ''}`); }
  return { imgs, text:rows.length ? `[같이 보내는 그림 ${imgs.length}장 — 순서대로: ${rows.join(' · ')}. 그림 속을 말하거나 판독문(read)을 적을 땐 이 순서표의 자료 id 로]\n` : '' };
}
async function getSample(){
  if (sampleFn !== undefined) return sampleFn;
  try{ sampleFn = window.claude ? await window.claude.use('sample') : null; }catch(e){ sampleFn = null; }
  if (sampleFn){ try{ const lim = await sampleFn.limits(); canImg = !!lim.images; const mx = +(lim.maxImages || lim.max_images || lim.imagesPerCall || 0); if (mx > 0) IMG_MAX = Math.min(mx, 16); }catch(e){ canImg = false; } }
  return sampleFn;
}
function boardText(){
  const ns = S.nodes.map(n => `${n.id} [${n.kind}] ${n.title}${n.kind === 'person' ? (n.face ? ` (얼굴: ${n.faceEv ? n.faceEv + ' 프사' : '붙음'})` : ' (얼굴 없음)') : ''} — ${n.note || ''}`).join('\n');   /* 11-18 A: 인물 카드의 얼굴도 판의 상태 */
  const ls = S.links.map(L => `${L.a}↔${L.b} ${L.label || ''}${L.sure ? '' : ' (추측)'}${L.why ? ' — 왜: ' + L.why : ''}`).join('\n') || '(없음)';   /* 11-17 B: 실마다 왜 이었나 */
  const cuts = (S.cuts || []).slice(-8).map(c => `${c.a}↔${c.b}${c.label ? ' ' + c.label : ''} — ${c.why || '이유 없음'}`).join(' / ');   /* 11-17 B: 끊은 실도 판의 상태 */
  return `카드:\n${ns}\n실:\n${ls}${cuts ? '\n끊은 실: ' + cuts : ''}\n용의자 표시: ${S.suspect || '없음'}`;
}
/* 11-17 A: 대화 기억 — 마틴이 한 번에 여러 줄 말해 16줄 창에선 동료 말이 두세 번 만에 밀려났다.
   최근 대화는 24줄, 그보다 앞선 동료의 말은 이번 사건 것을 줄여서 따로(못 박은 조건·정정이 남게). 더 앞이 필요하면 마틴이 recall 로 찾는다 */
/* 11-17 A: 판독 규칙 — 마틴의 read 와 판독문 채우기(evidence.js evBackfill)가 같이 쓴다 */
const READ_RULE = "화면 속 글자를 빠짐없이: 대화는 '이름(시각): 말' 꼴로 한 줄씩, 날짜 구분선·읽음 표시·삭제된 메시지·방 이름·참여 인원, 프사·배경·사진 속 물건처럼 눈에 띄는 것. 시각은 화면 그대로 날짜·오전/오후·시:분까지 적는다(오전·오후를 빼지 않는다 — 날짜 구분선도 줄로). 이름표 없는 말풍선은 색·위치로 적고, 누구일 공산이 큰지 괄호로 덧붙인다(예: '노란 말풍선(이 방 주인 쪽으로 보임)'). 프사·사진 속 풍경·물건·장소는 보이는 대로 쓰되 흔히 달리 부르는 이름이 있으면 같이 적는다(예: '단풍(낙엽) 길'). 메신저 캡처면 프사가 보이는 발신자마다 맨 끝에 「[프사] 이름 — 보이는 것」 한 줄씩(예: '[프사] 김지민 — 고양이 그림 동그라미', 기본 프사면 '기본 프사'). 추측은 쓰지 않는다(안 보이면 '안 보임'). 많아야 1500자.";
function convoText(){
  const L = S.log.filter(l => !l.upd && l.text), recent = L.slice(-24), older = L.slice(0, -24).filter(l => l.who === 'p');
  const keep = []; let budget = 4200;
  for (let i = older.length - 1; i >= 0 && budget > 0; i--){ const t = older[i].text.replace(/\s+/g, ' ').slice(0, 220); keep.unshift(`· ${hhmm(older[i].at)} ${t}`); budget -= t.length + 9; }
  const fmt = l => (l.who === 'p' ? '동료(기자): ' : '마틴: ') + l.text;
  return (keep.length ? `[동료가 이 사건에서 앞서 한 말 — 오래된 것부터, 길면 줄임. 동료가 못 박은 조건·정정·사정은 지금도 그대로 유효하다]\n${keep.join('\n')}\n\n` : '') + `[최근 대화]\n${recent.map(fmt).join('\n') || '(없음)'}`;
}
/* 11-17 A: 대화 다시 보기 — 마틴이 recall 에 찾을 말을 쓰면 옛 대화에서 그 말과 앞뒤 한 줄씩 */
function recallText(keys){
  const L = S.log.filter(l => !l.upd && l.text), hit = new Set();
  for (const k of keys.map(x => String(x).trim()).filter(x => x.length >= 1).slice(0, 3)) L.forEach((l, i) => { if (l.text.includes(k)) for (const j of [i - 1, i, i + 1]) if (j >= 0 && j < L.length) hit.add(j); });
  const idx = [...hit].sort((a, b) => a - b).slice(-40);
  return idx.map(i => `${hhmm(L[i].at)} ${L[i].who === 'p' ? '동료' : '마틴'}: ${L[i].text.replace(/\s+/g, ' ').slice(0, 300)}`).join('\n') || '(찾는 말이 대화에 없다)';
}
/* 11-17 B: 프롬프트 = 조립만 — 인물 → 상태 칸(앱이 보여 주는 것, 명령문 없음) → 이번 턴에 걸린 것 → 동료가 가져온 것 → 원칙 → 출력 형식.
   규칙 문장은 js/rules.js 한 곳(RULES·dueText·outText). 상태 칸에 「~해라」를 붙이지 않는다 — 할 일은 dueText 가 원칙 이름으로 가리킨다 */
function buildPrompt(given){
  ensureNotes(); const memo = noteText(); ensurePz(); const pzt = pzText();
  const opt = f => typeof f === 'function' ? f() : '';
  return `${MARTIN_WHO}

[동료와 너] 플레이어는 너의 조수가 아니라 동료다 — 사건의 조각을 발로 뛰어 모아 오는 기자이자 수집가. 너는 그 조각을 꿰는 탐정이다. 둘은 대등한 파트너이고, 너는 동료를 부하처럼 부리거나 가르치려 들지 않는다. 둘은 이야기를 나누며 수사한다. 동료가 가져온 자료(대화 캡처, 글, 파일, 사진)에서 밝혀진 것을 코르크 보드에 카드로 꽂고 빨간 실로 잇고, 난제 지도에서 난제를 하나씩 풀어 진실을 조립한다. 이것은 망상 게임이다 — 과감하게 이어 붙이되 단서의 글자는 정확히 짚는다.

[사건] 동료는 취재한 사진과 대화 텍스트를 하나씩 가져온다. 처음엔 무슨 사건인지조차 모른다. 너는 조각들로 사건 자체를 재구성한다 — 누가, 무엇을, 언제, 왜. 정답은 존재하고 동료가 쥔 자료 쪽에 있다. 정답을 아는 척하지 않는다.

[수사 수첩 — 판에 꽂기엔 작은 것들. 동료도 옆에 펼쳐 놓고 본다]
${memo}

[난제 지도 — 동료도 오른쪽에 펼쳐 놓고 본다]
${pzt}

[자료함 — 동료가 건넨 원본 전부와 네 판독문. 판에서 떼어진 것도 남아 있다]
${evText()}
${opt(typeof xrefText === 'function' && xrefText)}${opt(typeof tlText === 'function' && tlText)}${opt(typeof clockText === 'function' && clockText)}
[보드 지금]
${boardText()}

${convoText()}
${opt(typeof undoText === 'function' && undoText)}${opt(typeof trailText === 'function' && trailText)}
${opt(typeof modeText === 'function' && modeText)}
${opt(typeof dueText === 'function' && dueText)}
[이번에 동료가 가져온 것]
${given}

${typeof RULES === 'string' ? RULES : ''}
${opt(typeof outText === 'function' && outText)}`;
}
/* 11-17 A: 「자료에 없다」류 말 — 그 말이 짚은 카드의 자료, 아니면 그 말의 낱말이 판독문에 나오는 자료, 아니면 최근 사진 */
const NOPE_RE = /(자료|판독문|사진|캡처|카톡|화면|원본|프사|프로필)[^.!?]{0,18}(없다|없어|없는|없음|안 보|보이지 않|나오지 않|안 나와|안 나온|빠져 있)/;
function nopePick(lines){
  const photos = (S.ev || []).filter(e => e.kind === 'photo'); if (!photos.length) return [];
  const on = [].concat(...lines.map(l => l && typeof l === 'object' ? [].concat(l.on || []) : [])).map(id => evOf(id) || (nodeOf(id) && evByCard(id))).filter(e => e && e.kind === 'photo');
  if (on.length) return [...new Set(on)].slice(0, 2);
  const stop = /^(자료|판독문|사진|캡처|카톡|화면|원본|지금|가진|없다|안|보인다|새로|받아|와야|붙는다|얘기)$/;
  const toks = [...new Set(lines.map(l => typeof l === 'string' ? l : l.t || '').join(' ').match(/[가-힣A-Za-z]{2,}/g) || [])].map(w => w.replace(/(은|는|이|가|을|를|에|에서|의|도|만)$/, '')).filter(w => w.length >= 2 && !stop.test(w));
  const sc = photos.map(e => ({ e, s:toks.reduce((a, w) => a + ((e.read || '') + (e.title || '')).split(w).length - 1, 0) })).sort((a, b) => b.s - a.s);
  return (sc[0] && sc[0].s ? sc.filter(x => x.s).map(x => x.e) : photos.slice().reverse()).slice(0, 2);
}
function setBusy(on){ busy = on; $('#send').disabled = on; $('#send').textContent = on ? '추리 중' : '건네기'; }
async function turn({ text = '', atts = [], retry = false }){
  if (busy) return; setBusy(true); curLines = [];
  const sample = await getSample();
  if (!sample){ await speak('…연결이 끊겼다. 여기선 내 머리가 돌아가지 않는다.', false); setBusy(false); return; }
  let imgs = [], grp = [], photos = [], given = ''; const evs = [], shots = [];
  if (retry && S.pending){ given = S.pending.given; photos = S.pending.photos || [];
    for (const id of photos){ const n = nodeOf(id); if (!n) continue; try{ const b = await (await fetch(photoSrc(n))).blob(); const e = evByCard(id); if (b.size) grp.push({ label:e ? evLabel(e) : `판 ${id}「${n.title}」`, imgs:[b] }); }catch(e){} }
    renderChat(); }
  else {
    for (const a of atts) if (a.type === 'img'){
      const id = 'n' + S.nid++, p = placeNear('n1'), n = { id, kind:'photo', title:'사진', note:'', thumb:a.thumb, big:URL.createObjectURL(a.blob), mid:a.mid, x:p.x, y:p.y, r:(hash(id) % 9) - 4 };
      await fly(n.x, n.y, .85, 600); S.nodes.push(n); $('#nodes').insertAdjacentHTML('beforeend', cardHtml(n, 'drop')); measure(); sfx(n.x + 50, n.y - 80, '탁');
      const ev = addEv({ kind:'photo', card:id, title:a.name || '사진', name:a.name, thumb:a.thumb, big:n.big }); evs.push(ev.id); save(); keepPhoto(n, a, ev); await sleep(500);
      const rc = canImg ? await readCopies(a.orig || a.blob) : [];   /* 11-16 A: 세로로 긴 캡처는 조각으로 — 글자가 읽히게 */
      grp.push({ label:evLabel(ev), imgs:rc.length ? rc : [a.blob] }); photos.push(id); shots.push({ e:ev, rc, src:a.orig || a.blob }); }
    const longPaste = text.length >= 300 || /\[.+\] \[(오전|오후)/.test(text);   /* 11-16 A: 붙여 넣은 대화·긴 글은 자료함에 원문째 */
    if (text){ let tag = ''; if (longPaste){ const e = addEv({ kind:'text', name:'붙여 넣은 글', len:text.length, head:text.slice(0, 160) }); keepText(e, text); evs.push(e.id); tag = ` — 자료함 ${e.id}`; } given += `[동료의 말/붙여넣기${tag}]\n${text.slice(0, 12000)}\n`; }
    for (const a of atts) if (a.type === 'txt'){ const e = addEv({ kind:'text', name:a.name, len:a.text.length, head:a.text.slice(0, 160) }); keepText(e, a.text); evs.push(e.id); given += `[파일 ${a.name} — 자료함 ${e.id}]\n${a.text.slice(0, 12000)}\n`; }
    const view = pvOpenId();
    if (view){ const vn = itemOf(view), ve = /^e/.test(view) ? vn : evByCard(view), vt = /^e/.test(view) ? evTitle(vn) : vn.title; let rc = [];
      if (canImg){ try{ rc = ve ? await evCopies(ve) : await readCopies(photoSrc(vn)); }catch(e){ rc = []; } grp.push({ label:(ve ? evLabel(ve) : `판 ${view}「${vt}」`) + ' — 동료가 화면에 띄워 둔 것', imgs:rc }); }
      /* 11-16 D: 띄워 둔 사진이 있다고 무조건 사진에 잇지 않게 — 카드를 고르면 사진이 저절로 뜨기도 한다(보스 판 11-16 21:44). 사진 속을 가리키는 말일 때만 사진에서 답하고, 나머지는 앞 대화를 잇는다 */
      const vSaid = Math.max(0, S.log.filter(l => l.who === 'p').length - (PV.n0 || 0));
      given += `[화면 — 동료 옆에 ${ve ? '자료함 ' + ve.id + (ve.card ? '(판 ' + ve.card + ')' : '') : '판의 ' + view}「${vt}」 원본이 크게 펼쳐져 있다. 판에서 카드를 고르다 저절로 뜬 것일 수도 있다.${vSaid ? ` 띄운 뒤로 동료가 ${vSaid}번 더 말했다.` : ''}${rc.length ? ' 원본을 같이 보낸다.' : ''}
]\n`; }
    if (!view && !photos.length && !atts.length && text.length < 300 && !/\[.+\] \[(오전|오후)/.test(text)) given = `[새 자료 없음 — 동료가 말만 건넸다]\n` + given;
    if (photos.length) given += canImg ? `[사진 ${photos.length}장 — 이미 보드에 ${photos.join(', ')} 카드로 꽂았고, 원본은 자료함 ${evs.filter(x => evOf(x).kind === 'photo').join(', ')} 에 보관했다. 카드 제목·메모는 아직 비었고 판독문도 없다.]\n` : `[사진 ${photos.length}장을 ${photos.join(', ')} 카드로 꽂았지만 너는 사진 속을 볼 수 없다 — 무엇이 찍혔는지는 동료만 안다.]\n`;
    const m = { who:'p', text:text.slice(0, 1500), at:Date.now(), photos, files:atts.filter(a => a.type === 'txt').map(a => a.name), ...(view ? { viewing:view } : {}) }; S.log.push(m); chatEl().insertAdjacentHTML('beforeend', msgHtml(m)); toEnd(true);
    S.pending = { given:given.slice(0, 26000), photos:view ? [...photos, view] : photos, at:Date.now() }; save();   /* 보내는 순간 저장 — 끊겨도 다시 묻기 */
    log('chat', { who:'p', text, files:atts.map(a => ({ name:a.name, type:a.type, chars:a.text ? a.text.length : undefined })), photos, ...(view ? { viewing:view } : {}) });
  }
  renderAll(); thinking(true);
  /* 11-17 A: 그림은 한 번에 IMG_MAX 장까지 — 넘으면 사진마다 원본(조각)을 먼저 따로 읽혀 판독문을 적어 두고, 이번 답엔 사진을 한 장씩 줄여 보낸다 */
  if (canImg && grp.reduce((k, g) => k + g.imgs.length, 0) > IMG_MAX && shots.length){
    let n = 0; for (const x of shots){ const e = evOf(x.e.id) || x.e; if (e.read) continue; const t = await evReadOne(e, (x.rc.length ? x.rc : []).slice(0, IMG_MAX), AI.effort); if (t){ e.read = t; e.readTurn = S.turn + 1; n++; } }
    const whole = []; for (const x of shots.slice(0, IMG_MAX)){ try{ const w = await readCopies(x.src, { whole:true }); if (w[0]) whole.push({ label:evLabel(evOf(x.e.id) || x.e), imgs:[w[0]] }); }catch(e){} }
    act('사진 먼저 판독', { n, imgs:grp.reduce((k, g) => k + g.imgs.length, 0), max:IMG_MAX }); evPing(n);
    grp = whole;
    given += `[그림은 한 번에 ${IMG_MAX}장까지라, 앱이 사진마다 원본을 먼저 따로 읽혀 판독문을 [자료함]에 적어 두었다. 이번엔 사진 ${grp.length}장을 한 장씩 줄여 같이 보낸다.]\n`;
    if (S.pending) S.pending.given = given.slice(0, 26000); save(); }
  const pk = imgPack(grp); imgs = pk.imgs;
  let res; const prompt = buildPrompt(given + pk.text), t0 = Date.now();
  const tier = () => AI.model.includes('opus') ? 'complex' : AI.model.includes('haiku') ? 'quick' : 'default';
  /* 11-17 A: JSON 이 안 오면 조용히 한 번 더 — 보스가 다시 묻기를 열 번 누르던 것 */
  const ask = async (p, images) => { const o = { model:AI.model, effort:AI.effort, modelTier:tier() }; if (images && images.length && canImg) o.images = images;
    try{ return await sample.json(p, o); }
    catch(e){ const c = e && e.code || ''; if (c !== 'invalid_json' && !/json/i.test(String(e && e.message || ''))) throw e;
      log('turn', { ok:false, n:S.turn + 1, part:'json', model:AI.model, effort:AI.effort, ms:Date.now() - t0, prompt:p, error:{ code:c, message:String(e && e.message || e) } }); act('JSON 다시 묻기');
      return await sample.json(p + '\n\n[앞서 낸 답이 JSON 이 아니었다. 위 형식의 JSON 객체 하나만 낸다. 말은 전부 say 안에.]', o); } };
  try{ res = await ask(prompt, imgs); }
  catch(e){ thinking(false); const c = e && e.code; log('turn', { ok:false, n:S.turn + 1, model:AI.model, effort:AI.effort, ms:Date.now() - t0, prompt, error:{ code:c || '', message:String(e && e.message || e) } });
    await speak(c === 'rate_limited' ? '…머리가 과열됐다. 잠시 뒤에 다시 묻자.' : c === 'not_granted' ? '…생각할 허락이 없다. 연결을 허락해 줘야 움직인다.' : '…실이 끊겼다. 다시 묻기를 눌러라.', false);
    save(); setBusy(false); renderChat(); return; }
  /* 11-16 A: 다시 보기(look — 원본) · 11-17 A: 대화 다시 보기(recall — 옛 대화). 둘 다 청하면 한 번에 붙여 한 번 더 묻는다 */
  const want = (Array.isArray(res && res.look) ? res.look : []).map(String).map(id => evOf(id) || (nodeOf(id) && evByCard(id))).filter(e => e && e.kind === 'photo').slice(0, 3);
  const keys = (Array.isArray(res && res.recall) ? res.recall : res && typeof res.recall === 'string' ? [res.recall] : []).map(String).filter(Boolean).slice(0, 3);
  const lookOk = want.length && canImg;
  if (lookOk || keys.length){
    log('turn', { ok:true, n:S.turn + 1, part:lookOk ? (keys.length ? 'look+recall' : 'look') : 'recall', model:AI.model, effort:AI.effort, ms:Date.now() - t0, prompt, response:res });
    const line = lookOk ? res.lookLine || '잠깐. 원본을 다시 본다.' : res.recallLine || '잠깐. 앞에서 한 말을 다시 본다.';
    thinking(false); if (sayable(line)) await speak(line, true, { on:lookOk ? want.map(e => e.card).filter(id => id && nodeOf(id)) : [] }); thinking(true);
    const wg = []; if (lookOk) for (const e of want){ try{ wg.push({ label:evLabel(e) + ' — 네가 청한 원본', imgs:await evCopies(e) }); }catch(x){} }
    const more = wg.flatMap(g => g.imgs), pk2 = imgPack([...wg, ...grp]);
    let add = '';
    if (more.length) add += `\n[다시 보기 — 네가 청한 원본 ${want.map(e => e.id).join(', ')} 를 같이 보낸다. 판독문과 원본이 다르면 원본이 맞다 — read 로 고친다.]\n`;
    if (keys.length) add += `\n[대화 다시 보기 — 네가 찾은 말(${keys.join(', ')})이 나온 옛 대화와 앞뒤 한 줄씩, 오래된 것부터]\n${recallText(keys)}\n`;
    if (add){ add += '[이걸 보고 이번 답을 처음부터 다시 써라. look 과 recall 은 비워라.]\n';
      try{ const r2 = await ask(buildPrompt(given + add + pk2.text), pk2.imgs); if (r2 && typeof r2 === 'object') res = r2;
        if (more.length) act('다시 보기', { ids:want.map(e => e.id), imgs:more.length }); if (keys.length) act('대화 다시 보기', { keys }); }
      catch(e){ act('다시 보기 실패', { code:e && e.code || '' }); } }
  }
  /* 11-17 A: 「자료에 없다·안 보인다」고 하면 원본을 다시 본다 — 판독문에 없으면 원본에도 없다고 단정하던 것(보스 사건 20261117-5723 3턴: 「프로필 사진은 자료에선 안 보인다」) */
  if (!lookOk && canImg && !imgs.length){
    const tx = l => typeof l === 'string' ? l : (l && l.t) || '';
    const bad = (Array.isArray(res && res.say) ? res.say : []).filter(l => NOPE_RE.test(tx(l)));
    const pick = bad.length ? nopePick(bad) : [];
    if (pick.length){
      log('turn', { ok:true, n:S.turn + 1, part:'nolook', model:AI.model, effort:AI.effort, ms:Date.now() - t0, prompt, response:res });
      thinking(false); await speak('잠깐. 원본을 다시 본다.', true, { on:pick.map(e => e.card).filter(id => id && nodeOf(id)) }); thinking(true);
      const pg = []; for (const e of pick){ try{ pg.push({ label:evLabel(e), imgs:await evCopies(e) }); }catch(x){} }
      const pk3 = imgPack(pg), more = pk3.imgs;
      if (more.length){
        const add = `\n[다시 보기 — 너는 「${bad.map(tx).join(' / ').slice(0, 160)}」라고 하려 했다. 그 말을 하기 전에 원본 ${pick.map(e => e.id).join(', ')} 을 같이 보낸다. look 과 recall 은 비워라.]\n` + pk3.text;
        try{ const r2 = await ask(buildPrompt(given + add), more); if (r2 && typeof r2 === 'object') res = r2; act('없다 전 다시 보기', { ids:pick.map(e => e.id), imgs:more.length }); }
        catch(e){ act('다시 보기 실패', { code:e && e.code || '' }); } } } }
  if (typeof resFilter === 'function'){ try{ res = resFilter(res) || res; }catch(e){} }   /* 11-17 A: v0.14 연결 고리 → 11-17 B: 답 받기 단계 목록(rules.js RES_STEPS) */
  thinking(false); S.turn++; delete S.pending;
  log('turn', { ok:true, n:S.turn, model:AI.model, effort:AI.effort, ms:Date.now() - t0, prompt, response:res });
  /* 11-17 A: 저장 먼저, 연출은 뒤 — 판독문은 바로 적고, 나머지(판 고침·수첩·난제)는 play 가 단계마다 기기에 적어 두며 한다. 중간에 화면이 다시 열려도 resumePlay 가 마저 한다 */
  applyReads(res); if (typeof applyTl === 'function'){ try{ applyTl(res); }catch(e){} } const cr = clean(res); save();   /* 11-17 A: 연혁도 연출 전에 바로 */
  await play(cr);
  const mm = (S.notes || []).filter(n => n.turn === S.turn).map(n => n.k + ':' + n.t);
  if (curLines.length) log('chat', { who:'m', text:curLines.join(' / ') });
  log('memory', { n:S.turn, newMemo:mm, board:snap(), pz:S.probs, pfocus:S.pfocus });   /* 11-16 B: 난제 지도도 */
  save(); renderAll(); setBusy(false);
  if (typeof evBackfill === 'function') setTimeout(evBackfill, 1500);   /* 11-17 A: 판독문 없는 자료가 있으면 한가할 때 채운다 */
  if (typeof faceAuto === 'function') setTimeout(faceAuto, 2500);   /* 11-17 A: 얼굴 없는 인물 카드엔 캡처 속 프사를 */
}

