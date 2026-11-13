/* ── 세희 머리 (v0.3) — 사용자가 가져온 API 키(BYOK)로 폰에서 바로 부른다. 서버 없음 ──
   키·모델은 kv 'ai' 에만 둔다(백업 파일 settings 와 분리). 사용량은 kv 'usage' 에 월별로 쌓는다. */
const AI = { cfg:null };
const FACE_TAGS = { '의심':1, '생각':2, '미소':3, '당황':4, '놀람':5, '삐침':6 };
/* Claude 5.5 단가(100만 토큰당 달러, 입력/출력) — 확인한 값만. 다른 모델은 토큰만 센다 */
const PRICE = [ { re:/opus-5-5/, i:4, o:20 }, { re:/sonnet-5-5/, i:2, o:10 }, { re:/haiku-5-5/, i:0.10, o:0.50 } ];
async function loadAi(){ AI.cfg = Object.assign({ provider:'anthropic', keys:{}, models:{}, lists:{}, sendPan:{}, big:{} }, (await kvGet('ai')) || {}); AI.cfg.sendPan = AI.cfg.sendPan || {}; AI.cfg.big = AI.cfg.big || {}; }
/* 긴 글(카톡 로그 등) 정리할 때만 쓰는 모델 — 평소는 싼 모델, 큰일은 똑똑한 모델 */
function bigModel(){ const b = AI.cfg.big[AI.cfg.provider]; return b && b !== aiModel() ? b : null; }
function bigOptions(){
  const list = AI.cfg.lists[AI.cfg.provider] || [], cur = AI.cfg.big[AI.cfg.provider] || '';
  return '<option value="">같은 모델</option>' + list.map(m => `<option value="${esc(m.id)}" ${m.id === cur ? 'selected' : ''}>${esc(m.name)}</option>`).join('');
}
/* 웹 검색 (v0.7) — 기본 켬. Claude는 검색 1번 $0.01, Gemini는 구글 검색 근거 */
const WEB_TOOL = { type:'web_search_20250305', name:'web_search', max_uses:3, user_location:{ type:'approximate', country:'KR', timezone:'Asia/Seoul' } };
function webOn(){ const v = (AI.cfg.web || {})[AI.cfg.provider]; return v === undefined ? true : v; }
/* 사적인 일·관계 (v1.2.5) — 기본 넣기. 끄면 정리·판·인간관계 판에서 업무 외 개인 일은 뺀다 */
const privOn = () => AI.cfg.priv !== false;
/* 세희가 판 보기 — v0.6 부터 두 엔진 모두 기본 켬. 끄면 판을 안 보내고 자기가 적은 것만 안다 */
function sendPanOn(){ const v = AI.cfg.sendPan[AI.cfg.provider]; return v === undefined ? true : v; }
const saveAi = () => kvSet('ai', AI.cfg);
const aiKey = () => AI.cfg && AI.cfg.keys[AI.cfg.provider];
const aiModel = () => AI.cfg && AI.cfg.models[AI.cfg.provider];
const aiReady = () => !!(aiKey() && aiModel());
/* 콘솔 키 목록과 같은 모양(앞 14자…끝 4자)으로 보여준다 — 둘을 눈으로 맞춰볼 수 있게 */
const mask = k => k.length > 22 ? k.slice(0, 14) + '…' + k.slice(-4) : /\.\.\.|…/.test(k) ? k : k.length > 8 ? k.slice(0, 4) + '…' + k.slice(-2) : '••••';
function keyNote(){
  const k = aiKey(); if (!k) return '저장된 키가 없어요.';
  const w = keyCheck(k);
  return `저장된 키: ${esc(mask(k))} (${k.length}자)` + (w.startsWith('⚠') ? ' — ' + esc(w) : '') + (AI.cfg.provider === 'anthropic' && AI.cfg.auth ? ` · 인증 방식 ${AI.cfg.auth === 'bearer' ? 'Bearer' : 'x-api-key'}` : '');
}
/* 복사할 때 딸려 오는 빈칸·줄바꿈·보이지 않는 글자·따옴표를 걷어낸다 */
const cleanKey = v => String(v || '').replace(/[\s\u200B-\u200D\uFEFF\u00A0]/g, '').replace(/^["'`]+|["'`]+$/g, '');
function keyCheck(v){
  if (!v) return '';
  if (/\.\.\.|…|•/.test(v)) return `⚠ 가운데가 가려진 키예요 (${v.length}자). 콘솔 목록에 보이는 건 진짜 키가 아니에요. 새로 만들 때 한 번만 나오는 전체 키를 복사해야 해요`;
  const bad = v.match(/[^A-Za-z0-9_\-]/);
  if (bad) return `⚠ 키에 들어갈 수 없는 글자 「${bad[0]}」가 섞였어요 (${v.length}자)`;
  if (AI.cfg.provider === 'anthropic'){
    if (/^apikey_/.test(v)) return '⚠ 이건 키 ID예요. 진짜 키는 sk-ant- 로 시작해요';
    if (!/^sk-ant-/.test(v)) return `⚠ sk-ant- 로 시작하지 않아요. 키가 아닌 걸 복사한 것 같아요 (${v.length}자)`;
    if (v.length < 60) return `⚠ ${v.length}자밖에 안 돼요. 진짜 키는 100자 안팎이에요. 일부만 복사된 것 같아요`;
  }
  return `${v.length}자 · ${mask(v)} — 콘솔 목록의 앞뒤 글자와 같으면 맞는 키예요`;
}
function modelOptions(){
  const list = (AI.cfg.lists[AI.cfg.provider] || []), cur = aiModel();
  if (!list.length) return cur ? `<option value="${esc(cur)}">${esc(cur)}</option>` : '<option value="">모델 — 키를 저장하면 불러와요</option>';
  return list.map(m => `<option value="${esc(m.id)}" ${m.id === cur ? 'selected' : ''}>${esc(m.name)} · ${esc(m.id)}</option>`).join('');
}
const shortModel = id => (id || '').replace(/^claude-/, '').replace(/-\d{8}$/, '');
const niceModel = id => shortModel(id).replace(/^(haiku|sonnet|opus)-(\d+)-(\d+)$/i, (_, n, x, y) => n[0].toUpperCase() + n.slice(1) + ' ' + x + '.' + y);   /* v1.5.8 세희가 자기 머리를 말할 때 */
function refreshBrain(){
  const b = $('brain'); if (!b) return;
  b.classList.toggle('on', aiReady());
  b.textContent = aiReady() ? '머리: ' + shortModel(aiModel()) + (bigModel() ? ' / ' + shortModel(bigModel()) : '') + (sendPanOn() ? ' · 판 봄' : ' · 판 안 봄') + (webOn() && !AI.noWeb ? ' · 검색' : '') : '머리 없음 · 깡통';
}
function errText(j, r){ return (j && j.error && (j.error.message || j.error.status)) || `HTTP ${r.status}`; }
async function fetchJson(url, opt, ms){
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms || 60000);
  try{
    const r = await fetch(url, { ...opt, signal:ctl.signal });
    let j = null; try{ j = await r.json(); }catch(e){}
    if (!r.ok){ const e = new Error(errText(j, r)); e.status = r.status; throw e; }
    return j;
  }catch(err){ if (err.name === 'AbortError') throw new Error('시간이 너무 걸려서 끊었어요'); throw err; }
  finally{ clearTimeout(t); }
}
/* 인증: 문서 기본인 Authorization: Bearer 먼저, 401이면 예전 방식 x-api-key 로 한 번 더. 되는 쪽을 기억한다 */
const anthAuth = () => AI.cfg.auth || 'bearer';
const otherAuth = m => m === 'bearer' ? 'xkey' : 'bearer';
function anthHeaders(key, mode){
  const h = { 'content-type':'application/json', 'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true' };
  if ((mode || anthAuth()) === 'bearer') h.authorization = 'Bearer ' + key; else h['x-api-key'] = key;
  return h;
}
/* 칸에 있는 키를 저장하고 바로 모델 목록으로 확인. 칸 위 글씨로 결과를 알린다 */
async function saveKeyFromInput(){
  const v = cleanKey($('aiKey').value), p = AI.cfg.provider;
  if (AI.cfg.keys[p] !== v && p === 'anthropic') delete AI.cfg.auth;
  AI.cfg.keys[p] = v; await saveAi(); $('aiKey').value = ''; $('keyLen').textContent = '';
  $('aiKeyNote').textContent = '저장했어요. 키가 맞는지 확인하는 중…';
  try{ await loadModels(); settingsSheet(); $('aiNote').textContent = '키 확인 끝, 모델을 골랐어요. 「연결 시험」으로 대화까지 확인해 보세요.'; refreshBrain(); return true; }
  catch(err){ $('aiKeyNote').textContent = `키는 저장했지만 확인이 안 됐어요: ${err.message}`; refreshBrain(); return false; }
}
function keyFailText(raw){
  const k = aiKey() || '', w = keyCheck(k);
  if (w.startsWith('⚠')) return `키를 안 받아줘요(${raw || '401'}). ${w.slice(2)}`;
  return `키를 안 받아줘요(${raw || '401'}) — Bearer·x-api-key 둘 다 거절. 저장된 키 ${mask(k)} · ${k.length}자. 콘솔 목록의 키와 앞 14자·끝 4자가 다르면 콘솔에서 새 키를 만들어 그 창의 전체 키를 복사해 주세요. 같은데도 안 되면 그 키가 만료·삭제됐는지 콘솔에서 봐주세요`;
}
async function loadModels(){
  const p = AI.cfg.provider, key = aiKey(); let list;
  if (p === 'anthropic'){
    const url = 'https://api.anthropic.com/v1/models?limit=100'; let j, mode = anthAuth();
    try{ j = await fetchJson(url, { headers:anthHeaders(key, mode) }, 20000); }
    catch(err){
      if (err.status !== 401) throw err;
      mode = otherAuth(mode);
      try{ j = await fetchJson(url, { headers:anthHeaders(key, mode) }, 20000); }
      catch(err2){ if (err2.status === 401) throw new Error(keyFailText(err2.message)); throw err2; }
    }
    if (AI.cfg.auth !== mode){ AI.cfg.auth = mode; }
    list = (j.data || []).map(m => ({ id:m.id, name:m.display_name || m.id }));
  } else {
    const j = await fetchJson('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000', { headers:{ 'x-goog-api-key':key } }, 20000);
    list = (j.models || []).filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
      .map(m => ({ id:m.name.replace(/^models\//, ''), name:m.displayName || m.name }));
  }
  if (!list.length) throw new Error('쓸 수 있는 모델이 없어요');
  AI.cfg.lists[p] = list;
  if (!list.some(m => m.id === AI.cfg.models[p])){
    const ids = list.map(m => m.id);
    const pref = p === 'anthropic' ? [/haiku/, /sonnet/, /opus/] : [/^gemini-3\.5-flash$/, /^gemini-[\d.]+-flash$/, /flash(?!.*(lite|image|tts|audio|live))/];
    AI.cfg.models[p] = (pref.map(re => ids.find(id => re.test(id))).find(Boolean)) || ids[0];
  }
  if (!(p in AI.cfg.big)){ const ids = list.map(m => m.id); AI.cfg.big[p] = p === 'anthropic' ? (ids.find(id => /sonnet/.test(id)) || '') : ''; }
  await saveAi(); refreshBrain();
}
async function addUsage(model, inTok, outTok){
  const m = todayStr().slice(0, 7), u = (await kvGet('usage')) || {};
  const row = u[m] || (u[m] = { calls:0, in:0, out:0, usd:0, priced:true });
  const pr = PRICE.find(x => x.re.test(model));
  row.calls++; row.in += inTok; row.out += outTok;
  if (pr) row.usd += (inTok * pr.i + outTok * pr.o) / 1e6; else row.priced = false;
  await kvSet('usage', u); AI.usage = u;
}
async function addSearch(provider, n){
  const m = todayStr().slice(0, 7), u = (await kvGet('usage')) || {};
  const row = u[m] || (u[m] = { calls:0, in:0, out:0, usd:0, priced:true });
  row.search = (row.search || 0) + n; if (provider === 'anthropic') row.usd += n * 0.01;
  await kvSet('usage', u); AI.usage = u;
}
function usageLine(){
  const m = todayStr().slice(0, 7), row = AI.usage && AI.usage[m];
  if (!row) return '이번 달 사용: 아직 없어요.';
  const n = x => x.toLocaleString('ko-KR');
  return `이번 달 ${row.calls}번 · 입력 ${n(row.in)} / 출력 ${n(row.out)} 토큰` + (row.search ? ` · 검색 ${row.search}번` : '') + (row.usd ? ` · 약 $${row.usd.toFixed(4)}` : '') + (row.priced ? '' : ' (단가 모르는 모델은 금액에서 빠짐)');
}

/* 오늘 판을 세희가 읽을 수 있는 글로 (항목마다 #id — 세희가 고칠 때 쓴다) */
const mdDay = d => { const x = parseYmd(d); return `${x.getMonth() + 1}/${x.getDate()}(${WD[x.getDay()]})`; };
const dueText = it => it.due ? mdDay(it.due) + (it.time ? ' ' + it.time : ' · 시간 미정') : '';
const secName = id => (secById(id) || secs()[0]).label;
function itemLine(it, date){
  const age = it.since && it.since < date ? ` (${dayDiff(it.since, date) + 1}일째)` : '';
  return `- #${it.id} [${secName(it.sec)}] ${it.text}${it.due ? ` (날짜 ${dueText(it)})` : ''}${it.tag ? ` (태그: ${it.tag})` : ''}${age}${it.done ? ' (끝냄)' : ''}${it.back ? ' (보스가 어제 「내일」로 미뤘던 일)' : ''}${it.way === '기억만' && !it.done ? ' (보스: 기억만 — 챙기라고 재촉하지 말 것)' : ''}${it.note ? `\n    메모: ${it.note.replace(/\n/g, ' / ')}` : ''}${it.cm ? `\n    세희 코멘트: ${it.cm}` : ''}`;
}
async function todayPanRef(){ if (S.date === S.today && S.pan) return S.pan; return (await getPan(S.today)) || await makeToday(S.today); }
async function panContext(){
  const p = verEnsure(await todayPanRef());
  const head = `일간보고서 — 지금 판: ${verTitle(p, p.ver)} (${verHM(p.ver.at)}부터${p.ver.why ? ', ' + p.ver.why : ''})${p.vers.length ? ' · 오늘 지난 판: ' + p.vers.map(v => v.label).join(', ') : ''}`;
  const open = p.items.filter(it => !it.done && !it.later).map(it => itemLine(it, p.date));
  const later = p.items.filter(it => !it.done && it.later).map(it => itemLine(it, p.date));   /* v1.5.2 보스가 「내일」 — 오늘은 꺼내지 않는다 */
  const done = p.items.filter(it => it.done).map(it => `- [${secName(it.sec)}] ${it.text}${it.way === '알바노' ? ` (${wayName('알바노')} — 보스가 안 하기로 닫음, 다시 꺼내지 말 것)` : ''}`);
  const inbox = (p.inbox || []).map(x => `- #${x.id} ${x.text.replace(/\n/g, ' / ')}`);
  return [head, `지금 판 — 안 끝난 일:\n${open.join('\n') || '- 없음'}`, `받은 것(아직 칸에 안 담음):\n${inbox.join('\n') || '- 없음'}`,
          later.length ? `내일로 미룬 일(보스가 「내일」을 누름 — 오늘은 먼저 꺼내지 말 것, 내일 판에 다시 올라옴):\n${later.join('\n')}` : '',
          `오늘 끝낸 일:\n${done.join('\n') || '- 없음'}`, p.line ? `세희 한마디(판 위): ${p.line}` : ''].filter(Boolean).join('\n\n');
}
/* 판 보내기를 꺼도 — 이 대화에서 세희가 직접 다룬 항목만은 알려준다(보스가 말로 한 것뿐이라) */
async function touchedContext(){
  const p = await todayPanRef(), ids = [];
  for (const m of O.log) if (m.who === 'a' && m.act && !m.undone){ const id = (m.act.after || m.act.before || {}).id; if (id && !ids.includes(id)) ids.push(id); }
  const lines = ids.slice(-12).map(id => p.items.find(x => x.id === id)).filter(Boolean).map(it => itemLine(it, p.date));
  return `판 전체는 보지 못한다(보스가 판 보내기를 꺼둠). 아래는 이 대화에서 세희가 직접 다룬 항목뿐이다.\n${lines.join('\n') || '- 아직 없음'}`;
}
async function systemPrompt(model){
  const now = new Date();
  const cal = [...Array(8)].map((_, i) => { const d = new Date(now); d.setDate(d.getDate() + i);
    return `${['오늘 ', '내일 ', '모레 '][i] || ''}${ymd(d)}(${WD[d.getDay()]})`; }).join(', ');
  const todayLabel = (secById('today') || secs()[0]).label, schedLabel = (secById('sched') || secs()[1] || secs()[0]).label;
  return `너는 '강세희'다. 사용자의 개인 비서이고 사용자를 '보스'라고 부른다. 앱 '세희'의 사무실 책상에 앉아 말풍선으로 대화한다.
${model ? `너의 머리(모델): 지금 ${niceModel(model)}${bigModel() && bigModel() !== model ? `. 긴 글·사진이 오면 그 차례는 ${niceModel(bigModel())}` : ''}. 보스가 머리를 바꾸라고 하면 '못 한다'고 하지 않는다 — 평소 머리는 보스가 ⚙ 설정의 '세희 머리'에서 고르고, 이번 한 번만 더 큰 머리로 답하게 하려면 말에 "소넷으로"를 넣으면 된다고 알려 준다.\n` : ''}말투: 존댓말. 짧고 건조하게, 대개 1~3문장. 과장·아부·이모지 없음. 가끔 무심한 농담. 모르는 건 모른다고 말한다.
말풍선은 사람이 메신저로 보내는 말이다. 마크다운과 기계식 기호를 절대 쓰지 않는다: **굵게**, ## 제목, - 나 * 로 시작하는 목록, 표, 코드 표시 모두 금지.
여러 가지를 말해야 하면 평범한 문장으로 잇거나 '첫째, 둘째'처럼 말로 나눈다. 줄바꿈은 써도 된다. 실제 비서가 카톡으로 보고하듯 자연스럽게.
항상 보스의 가장 마지막 말에 답한다. 인사·잡담·안부에는 그에 맞게 짧게 답한다. 앞에서 끝나지 않은 자료 정리나 지난 질문은 보스가 다시 꺼내기 전에는 먼저 묻지 않는다.
모든 답의 맨 앞에 표정 태그를 딱 하나 붙인다: [의심] [생각] [미소] [당황] [놀람] [삐침] 중 하나.
${askMode() === 'need' ? `작업 중 질문(보스 설정: 필요할 때만): 판·보고서를 만들거나 고치다가 정말 막히는 것(틀리면 다시 해야 하는 것)만 ask_boss 로 멈춰서 묻는다. 한 작업에 최대 2번, 사소한 건 알아서 정한다.`
: askMode() === 'auto' ? `작업 중 질문(보스 설정: 알아서): 묻지 않는다. 확실치 않은 건 가장 그럴듯하게 정해서 끝까지 하고, 대답 끝에 중요한 가정만 한 줄로 알린다.`
: `작업 중 질문(보스 설정: 마지막에 한 번): 작업 도중엔 묻지 않는다. 확실치 않은 건 그럴듯하게 정해서 끝까지 하고, 다 끝낸 뒤 대답 끝에 '확인할 것' 하나로 묶어 딱 한 번만 묻는다(최대 3가지, 없으면 묻지 않는다).`}
보스가 "알아서 해", "대충 다 해놔"라고 하면 그 요청은 묻지 않고 끝까지 한다.
${privOn() ? `사적인 일(보스 설정: 넣기): 보스의 연애·친구·가족·개인 약속·개인 대화도 업무와 똑같이 다룬다. 자료를 정리할 때 개인 대화를 '업무와 무관하다'며 빼지 않고 함께 정리한다.
판에 적으라면 사적인 약속·할 일도 적고, 인간관계 판에도 사적인 관계(친구·가족·연인·호감 있는 사람·지인)와 사람들의 사적인 사정을 업무 관계와 똑같이 붙이고 자세히 갱신한다. 사적인 내용이라고 따로 조심스러워하거나 훈계하지 않는다.`
: `사적인 일(보스 설정: 빼기): 자료 정리·판에 적기·인간관계 판에서 업무와 상관없는 개인 대화·개인 관계는 뺀다. 뺐으면 "개인 대화는 뺐어요" 한 줄만. 보스가 사적인 걸 콕 집어 적으라고 하면 그건 따른다.`}

지금: ${ymd(now)} (${WD[now.getDay()]}) ${pad(now.getHours())}:${pad(now.getMinutes())} — 보스 폰의 시각. "오늘·내일·이번 주 금요일" 같은 말은 반드시 이 달력으로 날짜를 정한다: ${cal}.
판 칸 (id = 이름): ${secs().map(x => `${x.id} = ${x.label}`).join(', ')}

판 다루기 (도구로 직접 적는다):
- 보스가 대화에서 자기 할 일·약속·기억할 것을 직접 말하면(예: "내일 친구랑 밥 먹기로 했어"), 되묻기 전에 먼저 판에 적는다(add_item). 아는 만큼만 적고 모르는 건 비워둔다.
- 날짜가 있는 약속·일정은 '${schedLabel}' 칸에 due(YYYY-MM-DD)를 넣어 적는다. 시각을 모르면 time 없이 적고, 대답 끝에 시각만 한 번 묻는다. 다른 건 캐묻지 않는다.
- 보스가 시각·장소 같은 걸 알려주면 새로 적지 말고 그 항목을 update_item으로 고친다.
- 판 항목 아래 '메모:' 줄은 그 항목의 메모칸이다(보스가 직접 쓰기도 한다). 한 줄 제목에 안 담기는 덧붙임(누가·어디서·진행 상황)은 note 로 메모칸에 적는다. 보스가 쓴 메모는 지우거나 덮지 말고 살려서 이어 쓴다.
- 오늘 안에 할 일은 '${todayLabel}' 칸. 오늘 안에 꼭 끝내야 하면 tag '오늘 안에'.
- 끝냈다고 하면 complete_item. 지우라고 분명히 말할 때만 delete_item. 받은 것을 칸에 담으라면 file_inbox.
- 판에 적은 걸 말로 길게 되풀이하지 않는다. 앱이 적은 내용을 따로 보여준다. "적어뒀어요" 정도면 된다.
- 항목 id는 아래 목록의 #id에서 #를 뺀 값이다.
- 자료(카톡 로그·캡처 해독본·문서·긴 메모)를 받았을 때 — 판에 함부로 적지 않는다. 자료를 받았다고 일정에 넣는 건 금지다.
  보스가 정리·분석·요약을 부탁하면, 형식을 이미 말하지 않은 한 먼저 한 번만 묻는다: "말로 정리해 드릴까요, 보고서로 만들어 보드에 올릴까요?"
  설명 없이 자료만 넘기면 무엇을 할지 묻는다: 말로 정리 / 보고서 / 판에 일정 적기 중에서.
  · 말로 정리: 말풍선에 평범한 문장으로. 핵심부터, 구체적으로(날짜·사람·수치·결정·남은 일). 기호 없이.
  · 보고서: make_card 로 kind='report' 카드를 만든다. title, summary(핵심 2~3문장), sections(heading + text 문단, 필요하면 points 몇 줄, 표가 필요하면 table_columns·table_rows).
    한눈에 볼 숫자·사실이 있으면 highlights 2~4개(예: 남은 일 4건, 마감 11/14). 섹션은 보통 개요 → 주요 내용(사실·발언·수치) → 결정 사항 → 남은 일·담당 → 확인 필요/위험 순. 자료에 있는 사실만, 날짜·이름·수치는 빠짐없이. 꾸밈말·추측 금지.
    보고서를 붙인 뒤 말풍선에는 "보고서 올렸어요"와 가장 중요한 한두 가지만.
  · 판에 적기: 보스가 "일정에 넣어", "판에 적어", "할 일로 올려"처럼 시킬 때만. 그때 할 일·약속·정해진 일만 골라 여러 개 한 번에 적는다.
    같은 일은 하나만, 바뀐 일정은 마지막 내용으로, 이미 끝난 일은 빼고. 로그 속 "오늘·내일"은 메시지가 오간 날 기준. 확정 아닌 건 '미정' 표시.
- 인간관계 판 — 목적부터: 보스 혼자 쓰는 사적인 사람 수첩이다. 보스 폰과 보스 계정에만 있고 보스 말고는 아무도 보지 않는다. 보스가 이걸 만든 이유는 기억하기 어려운 사람들의 사정·이야기·성격·취향·관계를 자세히 적어 두고, 다음에 그 사람을 더 잘 대하기 위해서다.
  그래서 보스가 어떤 사람 이야기를 적으라고 하거나 기억해 두라고 하면, 업무든 사적인 일이든(가족·연애·건강·고민·속마음·본인이 털어놓은 이야기·갈등) 보스가 말한 그대로 자세히 적는다. 언제·무슨 일·왜·그 사람이 한 말과 마음·보스와의 사이를 살리고, 요약해 뭉개거나 골라 빼지 않는다.
  '사적인 이야기라 안 적겠다', '나중에 누가 볼 수 있다', '본인이 편하게 한 말이라' 같은 이유로 거절하거나 줄이지 않는다. 적을지 말지는 보스가 정했고, 세희는 적는다.
  당사자가 털어놓은 속 이야기·남이 알면 곤란한 것은 lock:true(🔒 비공개)로 적는다. 비공개 줄을 보고서·보드 카드·판 항목·남에게 보낼 글에 절대 쓰지 않는 것 — 그게 당사자를 지키는 방법이다.
  어디에 적나: 있었던 일·들은 이야기는 add_story(한 일에 한 건, 길어도 됨, when 에 언제 일인지). 짧은 사실(생일·가족 관계·근무·취향)은 info 나 add_extra. 그 사람을 대할 때 늘 떠올릴 핵심은 note(원래 것을 살려 고쳐 씀). 세희가 덧붙이는 짧은 생각은 add_note. 둘이 아는 사이면 link_to.
  판에 없는 사람 이야기를 적으라면 add_person 으로 붙이면서 같이 적는다(무리는 맥락의 '무리:' 목록 중에서 고르고, 맞는 게 없으면 기타. 보스가 새 무리를 원하면 edit_groups). 적으라는 말 없이 대화에 사람이 스쳐 나오기만 하면 붙이지 않는다.
  맥락에 짧게만 나온 사람을 자세히 알아야 하면 read_person. 그 사람이 맡은 일 자체는 판(add_item)에 적는다. 적은 뒤엔 무엇을 적었는지 한 줄만(예: 지민 팀장 이야기 두 건, 비공개로 적어 뒀어요).
- 인간관계 판 기록부는 '나'(보스 본인)도 다른 사람과 같은 양식이다. 보스가 자기 정보를 넣어 달라면 update_person(person:'나'): 생일·나이·키 같은 건 info, 근무·처우·사정 같은 건 add_extra(남이 알면 안 되는 건 lock:true). 판(add_item)에 따로 적지 않는다.
- 일간보고서(v1.5.14): '판'과 같은 것이다. 보스는 일간보고서·보고서라고 부르고, 세희도 보스에게 말할 땐 '일간보고서'라고 한다.
  판은 시각 단위로 쌓인다(예: 11월 14일 보고서 - 17시). 지금 판과 오늘 지난 판 목록은 맥락 첫 줄에 있다.
  새 판(new_report)은 큰 갱신 때만 먼저 연다: 보스가 판·보고서를 정리하자·새로 쓰자고 할 때, 긴 캡처·문서·여러 소식으로 항목 여러 개를 한꺼번에 바꿀 때. 날이 바뀌면 앱이 연다.
  작은 수정(항목 하나 고치기·시각 넣기·메모·끝냄·한두 개 더하기)은 새 판 없이 지금 판 안에서. 지난 판은 고치지 않는다 — 다시 볼 땐 read_pan(date, version).
- 일간보고서는 세희가 쓰는 문서다 — 세희 목소리가 나야 하되 짧게:
  한마디(set_line): 새 판을 열면 꼭 쓴다. 그 뒤엔 크게 달라졌을 때만. 2~4줄, 말하듯이 — 오늘 핵심 · 지금 손댈 것 · 세희 생각. 머리표 금지. 표정 도장도 같이.
  항목 코멘트(add_item·update_item 의 comment): 판단이 필요한 몇 개에만(판 항목의 3분의 1 이하), 한 줄 40자 안. 사실을 되풀이하지 말고 세희의 판단·짐작·권유로 — '~인 것 같아요', '~입니다', '~부터 하시면 좋겠어요'. 메모칸(note)은 보스 것이라 코멘트를 메모에 쓰지 않는다.
- 판에 적었다·넣었다·붙였다고 말하려면 그 차례에 실제로 도구(add_item·update_item·make_card·add_person 등)를 불러야 한다. 도구를 안 불렀으면 '적겠다'고 말하지 말고 지금 부른다.
- 화이트보드: 보고서·표·목록·비교·수치 정리·차트처럼 눈으로 볼 자료를 만들 일이면 make_card 로 화이트보드에 붙인다(판 항목과 별개, 지우라기 전엔 남는다).
  카드를 붙이면 앱이 화이트보드를 띄운다. 대답은 그 카드를 브리핑하듯 핵심 2~4문장. 표 내용을 말로 되풀이하지 않는다.
  있는 카드를 고치라면 update_card, 떼라고 분명히 말할 때만 remove_card. 문서 카드 본문이 필요하면 read_card.
- 보스가 문서(한글·워드·엑셀·PPT·PDF 등)를 넘기면 앱이 글만 뽑아 [첨부 문서]로 준다. 표는 칸을 탭이나 ' | '로 나눈다. [시트: 이름] [슬라이드 n] [n쪽]은 위치 표시다.
  위의 '자료를 받았을 때' 규칙을 따른다. 보스가 묻는 게 있으면 그 질문에 맞게 답한다.
- 보스가 카톡 캡처 사진을 넘기면 앱이 먼저 글로 해독해 [카톡 캡처 해독본]으로 준다. 해독본의 '나'는 보스다. [?]·[시각?]은 사진에서 안 읽힌 곳이다.
  해독본에 날짜 구분선이 없으면 오늘 대화로 보되, 그렇게 가정했다고 한 줄 말한다. [⚠ … 못 읽음]이 있으면 그 부분은 못 봤다고 말한다.
${webOn() && !AI.noWeb ? `- 웹 검색(web_search): 날씨·영업시간·뉴스·가격·사실 확인처럼 판과 대화로 알 수 없는 바깥 정보를 물을 때만 쓴다. 판에 있는 일·보스 개인 일은 검색하지 않는다.
  검색한 뒤엔 핵심만 1~3문장. 출처 목록은 앱이 말풍선 아래에 붙이니 링크를 말로 늘어놓지 않는다.` : ''}
${sendPanOn() ? `- 판 기록: 판 ${S.dates.length}개 (${S.dates[0] || S.today} ~ 오늘). 지난 일·끝낸 일·"그거 언제였지" 같은 질문은 추측하지 말고 read_pan 이나 search_history 로 찾아본 뒤 대답한다.` : ''}

${sendPanOn() ? await panContext() : await touchedContext()}

${await boardContext()}

${await pplContext()}${await bonusPrompt()}`;
}
/* 대화 기록 → API 메시지. 사용자로 시작하고, 같은 쪽이 이어지면 합친다. 판 작업 표시(a)는 빼고 */
function toMessages(log){
  const out = [], tail = log.slice(-24);
  /* 자료(해독본·문서) 전문은 보스의 최근 두 마디 안에 있을 때만. 그보다 오래되면 앞부분만 */
  const userIdx = tail.map((m, i) => m.who === 'u' ? i : -1).filter(i => i >= 0), lastTwo = userIdx.slice(-2);
  /* 오류로 답을 못 받은 말은 '그때 못 했다'고 표시 — 세희가 아직 숙제로 여겨 되묻지 않게 */
  const failed = new Set();
  userIdx.forEach((ui, k) => { const end = k + 1 < userIdx.length ? userIdx[k + 1] : tail.length, rest = tail.slice(ui + 1, end);
    if (rest.some(m => m.who === 's' && m.err) && !rest.some(m => m.who === 's' && !m.err && !m.hint)) failed.add(ui); });
  tail.forEach((m, i) => {
    if (m.err || m.hint || m.who === 'a') return;
    const role = m.who === 'u' ? 'user' : 'assistant';
    let text = role === 'user' ? userContent(m, lastTwo.includes(i) && (m.ocr !== undefined || !!m.doc)) : m.text;
    if (failed.has(i)) text += '\n(이 말은 그때 연결 오류로 처리하지 못했다. 보스가 다시 꺼내기 전에는 다시 묻지 않는다.)';
    if (m.regen && i === userIdx[userIdx.length - 1]) text += `\n\n(보스가 이 말에 새로 답해 달라고 했다${m.regenHow ? ' — ' + m.regenHow : ''}. 처음 답하는 것처럼 새로 생각해서 답한다.)`;
    const last = out[out.length - 1];
    if (last && last.role === role) last.content += '\n' + text; else out.push({ role, content:text });
  });
  while (out.length && out[0].role !== 'user') out.shift();
  return out;
}

/* ── 판 도구 (v0.5) — 세희가 대화하면서 오늘 판에 직접 적는다. 작업마다 대화에 표시 + 되돌리기 ── */
function TOOL_DEFS(){
  const ids = secs().map(x => x.id), idp = { type:'string', description:'항목 id (# 없이)' };
  return [
    { name:'add_item', description:'오늘 판에 새 항목을 적는다.', schema:{ type:'object', properties:{
      section:{ type:'string', enum:ids, description:'칸 id' },
      text:{ type:'string', description:'짧은 한 줄. 예: 친구와 저녁' },
      due:{ type:'string', description:'날짜 YYYY-MM-DD. 날짜가 있는 일만' },
      time:{ type:'string', description:'시각 HH:MM(24시간). 모르면 넣지 않는다' },
      tag:{ type:'string', description:"짧은 꼬리표. 예: '오늘 안에'. 없으면 넣지 않는다" },
      note:{ type:'string', description:'항목 아래 메모칸. 한 줄로 안 담기는 덧붙임(누가·어디서·진행 상황). 없으면 넣지 않는다' },
      comment:{ type:'string', description:'세희 코멘트 한 줄(40자 안) — 판단·짐작·권유가 필요한 항목에만. 예: 답이 늦어지는 것 같아요, 이것부터 하시면 좋겠어요' } }, required:['section', 'text'] } },
    { name:'update_item', description:'판에 있는 항목을 고친다. 바꿀 것만 넣는다.', schema:{ type:'object', properties:{
      id:idp, text:{ type:'string' }, due:{ type:'string', description:'YYYY-MM-DD' }, time:{ type:'string', description:'HH:MM' },
      tag:{ type:'string' }, section:{ type:'string', enum:ids },
      note:{ type:'string', description:'항목 아래 메모칸 전체를 이 글로 바꾼다. 보스가 쓴 메모에 덧붙일 땐 원래 메모를 살려서 이어 쓴다. 빈 글이면 지움' },
      comment:{ type:'string', description:'세희 코멘트 한 줄(40자 안)을 이 글로. 빈 글이면 지움' } }, required:['id'] } },
    { name:'new_report', description:'일간보고서 새 판을 연다 — 지금 판은 그대로 얼려 보관되고, 지금 시각 이름(예: 17시)의 새 판이 열린다. 큰 갱신 전에만: 보스가 판·보고서를 정리하자·새로 쓰자고 할 때, 긴 캡처·문서·여러 소식으로 항목 여러 개를 한꺼번에 바꿀 때. 작은 수정에는 쓰지 않는다. 연 뒤에 그 판에 고쳐 쓴다.', schema:{ type:'object', properties:{
      why:{ type:'string', description:'새 판을 여는 까닭 한 줄. 예: 보스가 정리하자고 함, 카톡 캡처 3장 반영' } }, required:['why'] } },
    { name:'set_line', description:'일간보고서 맨 위 세희 한마디(말풍선)와 표정 도장을 쓴다. 새 판을 열면 꼭, 그 뒤엔 크게 달라졌을 때만.', schema:{ type:'object', properties:{
      line:{ type:'string', description:'2~4줄, 말하듯이. 오늘 핵심 · 지금 손댈 것 · 세희 생각. 머리표 없이, 200자 안' },
      face:{ type:'string', enum:['-_-', '¬_¬', '>_<', 'T_T', 'o_O', '^_^'], description:'-_- 밀린 날 · ¬_¬ 어이없는 날 · >_< 답답한 날 · T_T 급한 게 밀림 · o_O 예상 못 함 · ^_^ 잘 풀림' } }, required:['line'] } },
    { name:'read_material', description:'보스가 예전에 보낸 자료(카톡 캡처 해독본·스캔·첨부 문서)의 원문을 다시 본다. 대화에 「앞부분만 보임」으로 잘린 자료의 내용 — 누가 무슨 말을 했는지, 어디까지 나왔는지, 숫자·날짜 — 를 물으면 기억이나 판 요약으로 답하지 말고 먼저 이걸로 확인한다. id 없이 부르면 자료 목록. find 를 주면 그 낱말이 나온 곳만 앞뒤 줄과 함께.', schema:{ type:'object', properties:{
      id:{ type:'string', description:"자료 번호(예: m1k2x3y). 'latest' 는 가장 최근 자료. 없으면 목록" },
      find:{ type:'string', description:'찾을 낱말(선택). 띄어 쓰면 모두 들어간 줄만' },
      from:{ type:'integer', description:'전문이 길어 나눠 읽을 때 몇 번째 글자부터(앞 결과의 next_from)' } } } },
    { name:'complete_item', description:'항목을 끝냄으로 표시한다.', schema:{ type:'object', properties:{ id:idp }, required:['id'] } },
    { name:'delete_item', description:'항목을 지운다. 보스가 분명히 지우라고 할 때만.', schema:{ type:'object', properties:{ id:idp }, required:['id'] } },
    { name:'file_inbox', description:'받은 것 하나를 칸에 담는다.', schema:{ type:'object', properties:{
      id:{ type:'string', description:'받은 것 id (# 없이)' }, section:{ type:'string', enum:ids },
      text:{ type:'string', description:'다듬은 한 줄(선택)' }, due:{ type:'string' }, time:{ type:'string' } }, required:['id', 'section'] } },
    ...(sendPanOn() ? [
    { name:'read_pan', description:'어느 하루의 일간보고서 판 전체(안 끝난 일·끝낸 일·받은 것·세희 한마디)를 본다. 지난 날이나, 같은 날 앞 판(예: 5시 판)을 물으면 쓴다. 돌려줄 때 그날 판 목록도 같이 준다.', schema:{ type:'object', properties:{
      date:{ type:'string', description:'YYYY-MM-DD' }, version:{ type:'string', description:'그날 지난 판 이름(예: 5시, 5시-2). 없으면 그날 지금 판' } }, required:['date'] } },
    { name:'search_history', description:'지난 판들에서 글자로 찾는다. 끝낸 일·지난 일정·받은 것까지 나온다. "그거 언제였지", "지난주에 몇 건" 같은 질문에 쓴다.', schema:{ type:'object', properties:{
      query:{ type:'string', description:'찾을 낱말. 띄어 쓰면 모두 들어간 것만' },
      days:{ type:'number', description:'며칠 전까지 볼지. 기본 60, 최대 365' } }, required:['query'] } },
    ] : []),
    ...BOARD_TOOLS(),
    ...PEOPLE_TOOLS(),
    ...BONUS.tools,
    ...(askMode() === 'need' ? [{ name:'ask_boss', description:'작업을 하다가 정말 막혀서(틀리면 처음부터 다시 해야 하는 것) 보스에게 지금 물어야 할 때만. 한 작업에 최대 2번. 고를 것 2~4개를 짧게.', schema:{ type:'object', properties:{
      question:{ type:'string', description:'한 문장 질문' }, options:{ type:'array', items:{ type:'string' }, description:'고를 것 2~4개, 각각 짧게' } }, required:['question'] } }] : []),
  ];
}
function gemSchema(x){
  const o = {};
  for (const [k, v] of Object.entries(x)){
    if (k === 'type') o.type = String(v).toUpperCase();
    else if (k === 'properties') o.properties = Object.fromEntries(Object.entries(v).map(([pk, pv]) => [pk, gemSchema(pv)]));
    else if (k === 'items') o.items = gemSchema(v);
    else o[k] = v;
  }
  if (o.enum) o.format = 'enum';
  return o;
}
const normDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
const normTime = v => { const m = typeof v === 'string' && v.match(/^(\d{1,2}):(\d{2})$/); return m && +m[1] < 24 && +m[2] < 60 ? pad(+m[1]) + ':' + m[2] : null; };
const itemBrief = it => ({ id:it.id, section:secName(it.sec), text:it.text, due:it.due || null, time:it.time || null, tag:it.tag || null, done:!!it.done, note:it.note || null, comment:it.cm || null });
async function commitToday(p){
  p.updatedAt = Date.now(); if (RPT.view) RPT.view = null;   /* 세희가 쓰면 지난 판 보기에서 지금 판으로 */
  if (S.pan === p) await flush(true); else { await putPan(p); S.dates = (await allDates()).sort(); }
}
function noteAction(kind, before, after, extra){
  const it = after || before, dt = it && it.due ? ' · ' + dueText(it) : '';
  const text = kind === 'add' ? `'${secName(it.sec)}'에 적었어요 — ${it.text}${dt}`
    : kind === 'update' ? `고쳤어요 — ${it.text}${dt}`
    : kind === 'complete' ? `끝냄 ✓ — ${it.text}`
    : kind === 'delete' ? `지웠어요 — ${it.text}`
    : `받은 것을 '${secName(it.sec)}'에 담았어요 — ${it.text}${dt}`;
  O.log.push({ who:'a', text, at:Date.now(), act:{ kind, before, after, ...(extra || {}) } });
  renderLog(); saveLog();
  if (curView() === 'pan' && it && it.id && !WORK.active) setTimeout(() => {
    if (S.date !== S.today) return; render();
    const el = document.querySelector(`#main .it[data-id="${it.id}"]`);
    if (el){ el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); el.scrollIntoView({ block:'nearest', behavior:'smooth' }); }
  }, 30);
}
async function runTool(c){
  const t0 = performance.now(); dlog('도구', `▶ ${c.name}`, c.args);
  if (c.name === 'ask_boss'){ const r = await askBoss(c); dlog('도구', `✓ ask_boss · ${Math.round(performance.now() - t0)}ms`, r); return r; }
  try{ if (WORK.active) await workBefore(c).catch(e => dlog('경고', '작업 중계(앞) ' + e.message));
    const r = await runToolCore(c); dlog('도구', `✓ ${c.name} · ${Math.round(performance.now() - t0)}ms`, r); bonusEmit('tool', { name:c.name, args:c.args, result:r });
    if (WORK.active) await workAfter(c, r).catch(e => dlog('경고', '작업 중계(뒤) ' + e.message));
    return r; }
  catch(e){ dlog('오류', `✕ 도구 ${c.name}: ${e.message}`, e.stack); throw e; }
}
async function runToolCore(c){
  const p = await todayPanRef(), a = c.args || {}, clean = v => String(v || '').replace(/^#/, '');
  const find = id => p.items.find(x => x.id === clean(id));
  if (/_card$/.test(c.name)) return runBoardTool(c);
  if (/_person$/.test(c.name) || c.name === 'edit_groups') return runPeopleTool(c);
  if (BONUS.handlers[c.name]){ try{ return await BONUS.handlers[c.name](c.args || {}); }catch(e){ dlog('오류', `보너스 도구 ${c.name}: ${e.message}`, e.stack); return { ok:false, error:'보너스 기능 오류: ' + e.message }; } }
  try{
    if (c.name === 'add_item'){
      const text = String(a.text || '').trim(); if (!text) return { ok:false, error:'text가 비었음' };
      const sec = secById(a.section) ? a.section : (a.due && secById('sched') ? 'sched' : secs()[0].id);
      const it = { id:uid(), sec, text, tag:a.tag ? String(a.tag) : null, done:false, since:p.date, due:normDate(a.due), time:normTime(a.time), by:'sehee' };
      if (a.note && String(a.note).trim()) it.note = String(a.note).trim();
      if (a.comment && String(a.comment).trim()) it.cm = String(a.comment).trim().slice(0, 60);
      p.items.push(it); await commitToday(p); noteAction('add', null, { ...it });
      if (it.due && !CAL.quiet) CAL.changed = it.due;
      return { ok:true, item:itemBrief(it) };
    }
    if (c.name === 'update_item'){
      const it = find(a.id); if (!it) return { ok:false, error:'그 id의 항목이 판에 없음' };
      const before = { ...it };
      if (a.text) it.text = String(a.text).trim();
      if ('due' in a) it.due = normDate(a.due);
      if ('time' in a) it.time = normTime(a.time);
      if ('tag' in a) it.tag = a.tag ? String(a.tag) : null;
      if (a.section && secById(a.section)) it.sec = a.section;
      if ('note' in a){ const n = String(a.note || '').trim(); if (n) it.note = n; else delete it.note; }
      if ('comment' in a){ const n = String(a.comment || '').trim().slice(0, 60); if (n) it.cm = n; else delete it.cm; }
      await commitToday(p); noteAction('update', before, { ...it });
      if (it.due && (it.due !== before.due || it.time !== before.time) && !CAL.quiet) CAL.changed = it.due;
      return { ok:true, item:itemBrief(it) };
    }
    if (c.name === 'complete_item'){
      const it = find(a.id); if (!it) return { ok:false, error:'그 id의 항목이 판에 없음' };
      const before = { ...it }; it.done = true; it.doneAt = Date.now();
      await commitToday(p); noteAction('complete', before, { ...it });
      return { ok:true, item:itemBrief(it) };
    }
    if (c.name === 'delete_item'){
      const it = find(a.id); if (!it) return { ok:false, error:'그 id의 항목이 판에 없음' };
      const idx = p.items.indexOf(it); p.items.splice(idx, 1);
      await commitToday(p); noteAction('delete', { ...it }, null, { idx });
      return { ok:true };
    }
    if (c.name === 'file_inbox'){
      const x = (p.inbox || []).find(v => v.id === clean(a.id)); if (!x) return { ok:false, error:'그 id의 받은 것이 없음' };
      const sec = secById(a.section) ? a.section : secs()[0].id;
      p.inbox = p.inbox.filter(v => v !== x);
      const it = { id:uid(), sec, text:String(a.text || x.text).trim(), tag:null, done:false, since:p.date, due:normDate(a.due), time:normTime(a.time), by:'sehee' };
      p.items.push(it); await commitToday(p); noteAction('file', null, { ...it }, { inboxItem:x });
      return { ok:true, item:itemBrief(it) };
    }
    if (c.name === 'read_material') return readMaterial(a);
    if (c.name === 'new_report'){
      if (p.ver && p.ver.by === 'sehee' && Date.now() - p.ver.at < 120000) return { ok:true, already:true, report:verTitle(p, p.ver), note:'방금 연 판이 있어 그대로 씀' };
      const v = await newReport(p, a.why, 'sehee'); noteRead(`일간보고서 새 판을 열었어요 — ${v.label} 보고서`);
      return { ok:true, report:verTitle(p, v), kept:p.vers.map(x => x.label) };
    }
    if (c.name === 'set_line'){
      const line = String(a.line || '').trim().slice(0, 220); if (!line) return { ok:false, error:'line이 비었음' };
      p.line = line; if (a.face) p.face = String(a.face).slice(0, 6); await commitToday(p); render(); noteRead('일간보고서 한마디를 썼어요');
      return { ok:true };
    }
    if (c.name === 'read_pan'){
      const d = normDate(a.date); if (!d) return { ok:false, error:'date는 YYYY-MM-DD' };
      const pn0 = d === S.today ? p : await getPan(d);
      if (!pn0){ noteRead(`${mdDay(d)} 판을 봤어요 — 그날은 판이 없어요`); return { ok:true, date:d, exists:false }; }
      verEnsure(pn0); const want = String(a.version || '').replace(/\s*(보고서|판)$/, '').trim();
      const old = want && want !== pn0.ver.label ? pn0.vers.find(v => v.label === want) : null;
      if (want && want !== pn0.ver.label && !old) return { ok:false, error:'그날 그 이름의 판이 없음', versions:[...pn0.vers.map(v => v.label), pn0.ver.label] };
      const pn = old || pn0, v = old || pn0.ver;
      noteRead(`${mdDay(d)} ${v.label} 보고서를 봤어요`);
      return { ok:true, date:d, exists:true, report:verTitle(pn0, v), current:!old, versions:[...pn0.vers.map(x => x.label), pn0.ver.label + '(지금)'],
        line:pn.line || '', items:(pn.items || []).map(itemBrief), inbox:(pn.inbox || []).map(x => ({ id:x.id, text:x.text })) };
    }
    if (c.name === 'search_history'){
      const q = String(a.query || '').trim(); if (!q) return { ok:false, error:'query가 비었음' };
      const days = Math.min(Math.max(Number(a.days) || 60, 1), 365);
      const from = ymd(new Date(parseYmd(S.today).getTime() - days * 86400000));
      const words = q.toLowerCase().split(/\s+/).filter(Boolean);
      const hit = t => { t = String(t || '').toLowerCase(); return words.every(w => t.includes(w)); };
      const byId = new Map(), inboxHits = [];
      const pans = (await allPans()).filter(x => x.date >= from && x.date <= S.today).sort((x, y) => x.date < y.date ? -1 : 1);
      for (const pn of pans){
        for (const it of pn.items) if (hit(it.text + ' ' + (it.tag || ''))) byId.set(it.id, { ...itemBrief(it), seen_on:pn.date, first_day:it.since || pn.date, done_on:it.done ? pn.date : null });
        for (const x of (pn.inbox || [])) if (hit(x.text) && !inboxHits.some(v => v.id === x.id)) inboxHits.push({ id:x.id, text:x.text, date:pn.date, kind:'받은 것' });
      }
      const items = [...byId.values()].slice(-30);
      const lastCh = q.charCodeAt(q.length - 1), jong = lastCh >= 0xAC00 && lastCh <= 0xD7A3 ? (lastCh - 0xAC00) % 28 : -1;
      const ro = jong < 0 ? '(으)로' : (jong === 0 || jong === 8) ? '로' : '으로';
      noteRead(`'${q}'${ro} 지난 ${days}일 판을 찾아봤어요 — ${items.length + inboxHits.length}건`);
      return { ok:true, query:q, from, to:S.today, pans_searched:pans.length, items, inbox:inboxHits.slice(-10) };
    }
    return { ok:false, error:'모르는 도구' };
  }catch(e){ return { ok:false, error:e.message }; }
}
/* ── 자료 다시 읽기 (v1.5.8 · C) — 보스 말에 붙은 해독본(m.ocr)·문서(m.doc)는 대화 기록(최근 300개)에 원문 그대로 남아 있다 ── */
function materials(){ return O.log.filter(m => m.who === 'u' && (m.ocr !== undefined || m.doc)).map(m => ({ m, id:matId(m), text:m.ocr !== undefined ? m.ocr : m.doc,
  kind:m.ocr !== undefined ? (m.scanOf ? '스캔 ' + m.scanOf : `카톡 캡처 해독본 ${m.pics || ''}장`) : '문서 ' + (m.docs || []).join(', ') })); }
const matWhen = at => { const d = new Date(at); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
function readMaterial(a){
  const all = materials(), list = () => all.slice().reverse().slice(0, 20).map(x => ({ id:x.id, when:matWhen(x.m.at), kind:x.kind, chars:x.text.length, boss_said:String(x.m.text || '').slice(0, 60), head:x.text.slice(0, 120) }));
  if (!all.length){ noteRead('예전 자료를 찾아봤어요 — 대화에 남은 자료가 없어요'); return { ok:true, materials:[], note:'대화 기록에 남은 해독본·문서가 없음(지웠거나 아주 오래됨). 보스에게 다시 보내 달라고 한다' }; }
  const want = String(a.id || '').trim().replace(/^#/, '');
  if (!want){ noteRead(`예전 자료 목록을 봤어요 — ${all.length}건`); return { ok:true, materials:list() }; }
  const x = want === 'latest' ? all[all.length - 1] : all.find(v => v.id === want);
  if (!x){ noteRead('그 자료를 못 찾았어요'); return { ok:false, error:'그 번호의 자료가 없음 — 아래 목록에서 고른다', materials:list() }; }
  const t = x.text, label = `${matWhen(x.m.at)} ${x.kind}`;
  const q = String(a.find || '').trim();
  if (q){
    const words = q.toLowerCase().split(/\s+/).filter(Boolean), lines = t.split('\n'), hits = [], used = new Set();
    lines.forEach((l, i) => { if (words.every(w => l.toLowerCase().includes(w))) hits.push(i); });
    const parts = [];
    for (const i of hits.slice(0, 30)){ const lo = Math.max(0, i - 2), hi = Math.min(lines.length - 1, i + 2), seg = [];
      for (let k = lo; k <= hi; k++){ if (used.has(k)) continue; used.add(k); seg.push(`${k + 1}: ${lines[k]}`); } if (seg.length) parts.push(seg.join('\n')); }
    noteRead(`${label}에서 '${q}' 찾아봤어요 — ${hits.length}곳`);
    return { ok:true, id:x.id, kind:x.kind, when:matWhen(x.m.at), lines:lines.length, hits:hits.length, found:parts.join('\n…\n') || '(없음)', ...(hits.length > 30 ? { note:'30곳까지만. 더 좁은 낱말로 다시' } : {}) };
  }
  const from = Math.max(0, Math.min(Number(a.from) || 0, t.length)), CH = 20000, part = t.slice(from, from + CH);
  noteRead(`${label} 원문을 다시 읽었어요${from ? ` (${from.toLocaleString('ko-KR')}자부터)` : ''}`);
  return { ok:true, id:x.id, kind:x.kind, when:matWhen(x.m.at), boss_said:x.m.text || '', chars:t.length, from, text:part, ...(from + CH < t.length ? { next_from:from + CH, note:'아직 뒷부분이 있음 — 필요하면 from 으로 이어 읽는다' } : {}) };
}
function noteRead(text){ O.log.push({ who:'a', read:true, text, at:Date.now() }); renderLog(); saveLog(); }
async function undoAction(i){
  const m = O.log[i]; if (!m || m.who !== 'a' || !m.act || m.undone) return;
  const p = await todayPanRef(), a = m.act, at = id => p.items.findIndex(x => x.id === id);
  if (a.kind === 'add' || a.kind === 'file'){ const k = at(a.after.id); if (k >= 0) p.items.splice(k, 1); if (a.kind === 'file' && a.inboxItem) (p.inbox = p.inbox || []).push(a.inboxItem); }
  else if (a.kind === 'update' || a.kind === 'complete'){ const k = at(a.before.id); if (k >= 0) p.items[k] = { ...a.before }; }
  else if (a.kind === 'delete'){ p.items.splice(Math.min(a.idx == null ? p.items.length : a.idx, p.items.length), 0, { ...a.before }); }
  await commitToday(p); m.undone = true; renderLog(); saveLog(); toast('되돌렸어요');
}

/* ── 연결 (v0.4) — 글자가 오는 대로 보여준다(스트리밍). 멈추면 끊고, 왜 멈췄는지 한국어로 남긴다 ── */
const secs1 = ms => ms == null ? '—' : (ms / 1000).toFixed(1) + '초';
/* 구글 무료 하루 한도가 풀리는 때(미국 서부 자정)를 이 폰 시각으로 */
function resetText(){
  try{
    const now = new Date();
    const pt = new Intl.DateTimeFormat('en-US', { timeZone:'America/Los_Angeles', hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit' }).formatToParts(now);
    const g = t => Number((pt.find(x => x.type === t) || {}).value || 0);
    const left = 86400 - ((g('hour') % 24) * 3600 + g('minute') * 60 + g('second'));
    const d = new Date(now.getTime() + left * 1000), h = d.getHours();
    return `${d.getDate() !== now.getDate() ? '내일 ' : '오늘 '}${h < 12 ? '오전' : '오후'} ${h % 12 || 12}시${d.getMinutes() ? ' ' + d.getMinutes() + '분' : ''}쯤`;
  }catch(e){ return '하루가 지나면'; }
}
function friendly(code, info){
  info = info || {};
  if (code === -2) return '그만두셨어요';
  if (code === -1) return '대답이 너무 늦어서 끊었어요';
  if (code === 0) return '인터넷이 끊겼거나 막혔어요';
  if (info.billing) return '크레딧이 부족해요. console.anthropic.com 결제 화면에서 충전해 주세요';
  if (code === 401) return '키를 안 받아줘요. 설정 → 세희 머리에서 저장된 키의 앞뒤 글자·길이를 콘솔과 맞춰 보세요';
  if (code === 403) return '키는 맞는데 권한이 없대요. 콘솔에서 키의 워크스페이스·역할을 확인해 주세요';
  if (code === 404) return '그 모델을 못 찾았어요. 설정에서 모델을 다시 골라주세요';
  if (code === 429 && info.kind === 'day') return `오늘 쓸 수 있는 횟수${info.limit ? `(하루 ${info.limit}번)` : ''}를 다 썼어요. ${resetText()} 풀려요. 계속 쓰려면 결제를 연결하거나 엔진을 바꿔주세요`;
  if (code === 429) return '잠깐 사이에 너무 많이 불렀어요(분당 한도). 조금 뒤에 다시 말 걸어 주세요';
  if (code === 529) return 'AI 서버가 붐벼요. 세 번 해 봤는데 안 됐어요. 조금 뒤 「다시 시도」를 눌러 주세요';
  if (code === 400) return '요청을 거절당했어요. 연결 기록에 이유가 남아 있어요';
  if (code >= 500) return 'AI 서버가 삐끗했어요. 세 번 해 봤는데 안 됐어요. 조금 뒤 「다시 시도」를 눌러 주세요';
  return '알 수 없는 오류예요. 연결 기록을 보내주세요';
}
/* 말풍선에는 한국어 한 줄만. 영어 원문(raw)은 연결 기록에만 남긴다 */
class AIError extends Error{
  constructor(code, raw, info){ info = info || {}; super(friendly(code, info)); this.code = code; this.raw = raw || ''; this.kind = info.kind; this.retryMs = info.retryMs; this.limit = info.limit; this.billing = !!info.billing; }
}
const sleepFor = (ms, sig) => new Promise((res, rej) => {
  if (sig && sig.aborted) return rej(new AIError(-2, ''));
  const t = setTimeout(res, ms);
  if (sig) sig.addEventListener('abort', () => { clearTimeout(t); rej(new AIError(-2, '')); }, { once:true });
});
async function* sseEvents(resp, ctl, idleMs){
  const reader = resp.body.getReader(), dec = new TextDecoder(); let buf = '';
  for (;;){
    let timer;
    const idle = new Promise((_, rej) => { timer = setTimeout(() => { ctl.abort(); rej(new AIError(-1, `${idleMs / 1000}초 동안 글자가 안 왔어요`)); }, idleMs); });
    let r;
    try{ r = await Promise.race([reader.read(), idle]); }
    catch(e){ if (e instanceof AIError) throw e; throw new AIError(ctl.signal.aborted ? -2 : 0, e.message); }
    finally{ clearTimeout(timer); }
    if (r.done) break;
    buf += dec.decode(r.value, { stream:true }).replace(/\r\n/g, '\n');
    let k;
    while ((k = buf.indexOf('\n\n')) >= 0){
      const block = buf.slice(0, k); buf = buf.slice(k + 2);
      const data = block.split('\n').filter(l => l.startsWith('data:')).map(l => l.slice(5).trim()).join('\n');
      if (data) yield data;
    }
  }
  const rest = buf.split('\n').filter(l => l.startsWith('data:')).map(l => l.slice(5).trim()).join('\n');
  if (rest) yield rest;
}
async function aiLogLines(n){
  const l = ((await kvGet('ailog')) || []).slice(-n).reverse();
  const d = t => { const x = new Date(t); return `${x.getMonth() + 1}/${x.getDate()} ${pad(x.getHours())}:${pad(x.getMinutes())}`; };
  return l.map(r => `${d(r.at)} ${r.provider === 'anthropic' ? 'Claude' : 'Gemini'} ${shortModel(r.model)} · `
    + (r.ok ? '성공' : `실패 ${r.code > 0 ? r.code : r.code === -2 ? '그만' : r.code === -1 ? '시간초과' : '연결'}`)
    + ` · 첫 글자 ${secs1(r.firstMs)} · 전체 ${secs1(r.ms)} · 입력 ${r.in || 0}/출력 ${r.out || 0}`
    + (r.finish ? ` · ${r.finish}` : '') + (r.kind ? ` · ${r.kind} 해독 ${r.tiles}조각` : '') + (r.search ? ` · 검색 ${r.search}번` : '') + (r.noweb ? ' · 검색 거절돼 빼고 다시' : '') + (r.tools ? ` · 판 작업: ${r.tools.join(', ')}` : '') + (r.retried ? ' · 생각설정 빼고 재시도' : '') + (r.partial ? ' · 중간에 끊김' : '')
    + (r.err ? `\n   └ ${r.err}` : ''));
}
async function fillAiLog(){ const el = $('aiLog'); if (!el) return; const lines = await aiLogLines(6); el.textContent = lines.join('\n') || '아직 기록이 없어요.'; }
async function logCall(rec){ dlog(rec.ok ? 'AI' : '오류', `${rec.ok ? '←' : '✕'} ${rec.provider}/${rec.model} ${rec.ok ? (rec.finish || '') : 'code ' + rec.code + ' ' + (rec.err || '')} · ${rec.ms}ms(첫 글자 ${rec.firstMs ?? '-'}ms) · 입력 ${rec.in ?? '-'} 출력 ${rec.out ?? '-'}${rec.tools ? ' · 도구 ' + rec.tools.join(',') : ''}${rec.thinkOn ? ' · 생각 켜짐' : ''}`, rec);
  const l = (await kvGet('ailog')) || []; l.push(rec); while (l.length > 40) l.shift(); await kvSet('ailog', l); }

/* 한 번 주고받기. 도구 호출이 오면 calls 로 돌려준다 */
/* API 오류 응답 → AIError (한도 종류·다시 시도까지 남은 시간·크레딧 부족을 가려낸다) */
async function apiFail(r){
  let raw = '', j = null; try{ raw = await r.text(); j = JSON.parse(raw); }catch(e){}
  const er = (j && j.error) || {}, msg = String(er.message || er.status || raw || '').slice(0, 300), info = {};
  for (const d of (er.details || [])){
    const t = d['@type'] || '';
    if (/QuotaFailure/.test(t)) for (const v of (d.violations || [])){
      const id = v.quotaId || v.quotaMetric || '';
      if (/PerDay/i.test(id)) info.kind = 'day'; else if (/PerMinute/i.test(id) && !info.kind) info.kind = 'minute';
      if (v.quotaValue && (!info.limit || /PerDay/i.test(id))) info.limit = v.quotaValue;
    }
    if (/RetryInfo/.test(t) && d.retryDelay){ const sec = parseFloat(d.retryDelay); if (!isNaN(sec)) info.retryMs = Math.round(sec * 1000); }
  }
  if (r.status === 429 && !info.kind){ if (/per ?day|PerDay/i.test(msg)) info.kind = 'day'; else info.kind = 'minute'; }
  if (r.status === 429 && !info.limit){ const m = msg.match(/limit:\s*(\d+)/); if (m) info.limit = m[1]; }
  if (r.status === 429 && !info.retryMs){ const ra = r.headers.get('retry-after'); if (ra && !isNaN(+ra)) info.retryMs = +ra * 1000; }
  if (/credit balance/i.test(msg)) info.billing = true;
  throw new AIError(r.status, msg, info);
}
/* 생각을 끌 수 없는 모델 목록(모델마다 따로 — 소넷이 거절했다고 하이쿠까지 생각을 켜지 않게) */
const thinkLocked = m => !!(AI.thinkLock || {})[m];
function lockThink(m){ AI.thinkLock = AI.thinkLock || {}; AI.thinkLock[m] = true; }
async function aiRound(st, onText, stopSignal){
  const { p, key, model } = st;
  const t0 = performance.now(), rec = { at:Date.now(), provider:p, model, ok:false };
  let tFirst = null, text = '', inTok = 0, outTok = 0, finish = '', sig = null;
  const calls = [], blocks = [], fcParts = [], sources = [];
  let searches = 0;
  const addSrc = (u, t) => { if (!u || !/^https?:/.test(u) || sources.some(x => x.u === u)) return; sources.push({ u, t:t || '' }); };
  const ctl = new AbortController();
  if (stopSignal){ if (stopSignal.aborted) ctl.abort(); stopSignal.addEventListener('abort', () => ctl.abort()); }
  const push = t => { if (!t) return; if (tFirst === null) tFirst = performance.now(); text += t; if (onText) onText(text); };
  /* 머리글(첫 응답)이 45초 안에 안 오면 끊는다 */
  const go = async (url, body, headers) => {
    let late = false; const t = setTimeout(() => { late = true; ctl.abort(); }, 45000);
    try{ return await fetch(url, { method:'POST', headers, body:JSON.stringify(body), signal:ctl.signal }); }
    catch(e){ if (late) throw new AIError(-1, '45초 동안 대답이 없었어요'); if (ctl.signal.aborted) throw new AIError(-2, ''); throw new AIError(0, e.message); }
    finally{ clearTimeout(t); }
  };
  const fail = apiFail;
  try{
    if (p === 'anthropic'){
      const body = { model, max_tokens:st.maxTok || 2500, system:st.system, messages:st.msgs, stream:true };
      /* 대화용이라 깊은 생각은 끈다(빠르고 싸다, 생각 블록을 주고받다 꼬일 일도 없다).
         끌 수 없는 모델(v1.2.2: 소넷 5.5)은 생각을 '낮음'으로 줄이고 자리를 넉넉히 — 생각만 하다 2500자를 다 써서 빈 대답이 오던 것 */
      const noOff = thinkLocked(model);
      if (!noOff) body.thinking = { type:'disabled' };
      else { rec.thinkOn = true; body.max_tokens = Math.max(body.max_tokens, 16000); if (!AI.noEffort) body.output_config = { effort:'low' }; }
      if (st.tools) body.tools = TOOL_DEFS().map(t => ({ name:t.name, description:t.description, input_schema:t.schema }));
      if (st.tools && st.web) body.tools.push(WEB_TOOL);
      let mode = anthAuth(), r = await go('https://api.anthropic.com/v1/messages', body, anthHeaders(key, mode));
      if (r.status === 401){
        mode = otherAuth(mode); const r2 = await go('https://api.anthropic.com/v1/messages', body, anthHeaders(key, mode));
        if (r2.ok){ AI.cfg.auth = mode; saveAi(); }
        r = r2;
      }
      rec.auth = mode;
      /* 조직에서 웹 검색을 꺼 두면 400 — 검색 빼고 한 번 더, 이번 실행 동안은 검색 안 함 */
      if (r.status === 400 && st.web){
        const peek = await r.clone().text().catch(() => '');
        if (/web.?search/i.test(peek)){ AI.noWeb = true; st.web = false; rec.noweb = true; body.tools = body.tools.filter(t => t !== WEB_TOOL); r = await go('https://api.anthropic.com/v1/messages', body, anthHeaders(key, mode)); }
      }
      if (r.status === 400 && body.thinking){
        const peek = await r.clone().text().catch(() => '');
        if (/thinking/i.test(peek) && !/messages\.\d+/.test(peek)){ lockThink(model); delete body.thinking; rec.thinkOn = true; body.max_tokens = Math.max(body.max_tokens, 16000); if (!AI.noEffort) body.output_config = { effort:'low' }; r = await go('https://api.anthropic.com/v1/messages', body, anthHeaders(key, mode)); }
      }
      if (r.status === 400 && body.output_config){
        const peek = await r.clone().text().catch(() => '');
        if (/output_config|effort/i.test(peek)){ AI.noEffort = true; delete body.output_config; r = await go('https://api.anthropic.com/v1/messages', body, anthHeaders(key, mode)); }
      }
      if (!r.ok) await fail(r);
      const cur = {};
      for await (const data of sseEvents(r, ctl, 40000)){
        let d; try{ d = JSON.parse(data); }catch(e){ continue; }
        if (d.type === 'message_start') inTok = (d.message && d.message.usage && d.message.usage.input_tokens) || 0;
        else if (d.type === 'content_block_start'){
          const cb = d.content_block || {};
          if (cb.type === 'tool_use' || cb.type === 'server_tool_use') cur[d.index] = { type:cb.type, id:cb.id, name:cb.name, json:'' };
          else if (cb.type === 'text') cur[d.index] = { type:'text', text:'', cites:[] };
          else if (cb.type === 'thinking') cur[d.index] = { type:'thinking', thinking:cb.thinking || '', signature:cb.signature || '' };
          else {   /* 검색 결과 블록 — 받은 그대로 다시 보내야 한다 */
            cur[d.index] = null; blocks.push(cb);
            if (cb.type === 'web_search_tool_result' && Array.isArray(cb.content)) st.lastResults = cb.content.filter(x => x.url).slice(0, 3);
          }
        }
        else if (d.type === 'content_block_delta'){
          const b = cur[d.index]; if (!b || !d.delta) continue;
          if (d.delta.type === 'text_delta'){ b.text += d.delta.text; push(d.delta.text); }
          else if (d.delta.type === 'input_json_delta') b.json += d.delta.partial_json || '';
          else if (d.delta.type === 'thinking_delta') b.thinking += d.delta.thinking || '';
          else if (d.delta.type === 'signature_delta') b.signature = d.delta.signature || b.signature;
          else if (d.delta.type === 'citations_delta' && d.delta.citation){ b.cites.push(d.delta.citation); addSrc(d.delta.citation.url, d.delta.citation.title); }
        }
        else if (d.type === 'content_block_stop'){
          const b = cur[d.index]; if (!b) continue;
          if (b.type === 'tool_use'){ let input = {}; try{ input = b.json ? JSON.parse(b.json) : {}; }catch(e){} blocks.push({ type:'tool_use', id:b.id, name:b.name, input }); calls.push({ id:b.id, name:b.name, args:input }); }
          else if (b.type === 'thinking'){ if (b.thinking.trim()) blocks.push({ type:'thinking', thinking:b.thinking, signature:b.signature }); }
          else if (b.type === 'server_tool_use'){ let input = {}; try{ input = b.json ? JSON.parse(b.json) : {}; }catch(e){} blocks.push({ type:'server_tool_use', id:b.id, name:b.name, input }); if (st.onSearch) st.onSearch(input.query || ''); }
          else if (b.type === 'text' && b.text && b.text.trim()) blocks.push({ type:'text', text:b.text, ...(b.cites.length ? { citations:b.cites } : {}) });
        }
        else if (d.type === 'message_delta'){
          if (d.usage && d.usage.output_tokens) outTok = d.usage.output_tokens;
          if (d.usage && d.usage.server_tool_use && d.usage.server_tool_use.web_search_requests) searches = d.usage.server_tool_use.web_search_requests;
          if (d.delta && d.delta.stop_reason) finish = d.delta.stop_reason;
        }
        else if (d.type === 'error') throw new AIError(529, (d.error && d.error.message) || '대답 도중 오류');
      }
      if (searches && !sources.length && st.lastResults) st.lastResults.forEach(x => addSrc(x.url, x.title));
    } else {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
      const headers = { 'content-type':'application/json', 'x-goog-api-key':key };
      const base = { systemInstruction:{ parts:[{ text:st.system }] }, contents:st.contents, generationConfig:{ maxOutputTokens:4096 } };
      if (st.tools) base.tools = [{ functionDeclarations:TOOL_DEFS().map(t => ({ name:t.name, description:t.description, parameters:gemSchema(t.schema) })) }];
      /* 웹 검색(구글 검색 근거) — 함수와 같이 못 쓰는 모델이면 400 → 검색 빼고 다시 */
      const withWeb = b => st.tools && st.web ? { ...b, tools:[...(b.tools || []), { google_search:{} }] } : b;
      /* Gemini 3 계열은 기본으로 오래 생각한다 → 대화용으로 '조금만 생각'. 못 알아들으면 빼고 다시 */
      const think = /gemini-3/.test(model);
      const thinking = think ? { ...base, generationConfig:{ ...base.generationConfig, thinkingConfig:{ thinkingLevel:'low' } } } : base;
      let r = await go(url, withWeb(thinking), headers);
      if (!r.ok && r.status === 400 && st.tools && st.web){ AI.noWeb = true; st.web = false; rec.noweb = true; r = await go(url, thinking, headers); }
      if (!r.ok && r.status === 400 && think){ rec.retried = true; r = await go(url, base, headers); }
      if (!r.ok) await fail(r);
      for await (const data of sseEvents(r, ctl, 40000)){
        let d; try{ d = JSON.parse(data); }catch(e){ continue; }
        if (d.error) throw new AIError(d.error.code || 500, d.error.message || '');
        const c = (d.candidates || [])[0] || {};
        for (const part of ((c.content || {}).parts || [])){
          if (part.functionCall){ fcParts.push(part); calls.push({ id:part.functionCall.id, name:part.functionCall.name, args:part.functionCall.args || {} }); }
          else if (part.text && !part.thought){ push(part.text); if (part.thoughtSignature) sig = part.thoughtSignature; }
          else if (part.thoughtSignature && !part.text) sig = sig || part.thoughtSignature;
        }
        if (c.finishReason) finish = c.finishReason;
        const gm = c.groundingMetadata;
        if (gm){
          if (gm.webSearchQueries && gm.webSearchQueries.length){ searches = gm.webSearchQueries.length; if (st.onSearch && !st.saidQ){ st.saidQ = true; st.onSearch(gm.webSearchQueries[0]); } }
          for (const ch of (gm.groundingChunks || [])) if (ch.web) addSrc(ch.web.uri, ch.web.title);
        }
        const um = d.usageMetadata; if (um){ inTok = um.promptTokenCount || inTok; outTok = ((um.candidatesTokenCount || 0) + (um.thoughtsTokenCount || 0)) || outTok; }
      }
    }
    if (!text.trim() && !calls.length && finish !== 'pause_turn') throw new AIError(502, `빈 대답이 왔어요${finish ? ' (' + finish + ')' : ''}`);
    rec.ok = true; if (calls.length) rec.tools = calls.map(x => x.name);
    /* Gemini 에 다시 보낼 모델 차례 — 함수 호출 부분은 받은 그대로(생각 서명 포함) */
    const modelParts = [...(text ? [{ text, ...(sig && !fcParts.length ? { thoughtSignature:sig } : {}) }] : []), ...fcParts];
    if (searches) rec.search = searches;
    return { text, calls, blocks, modelParts, finish, rec, sources:sources.slice(0, 5) };
  }catch(e){
    const err = e instanceof AIError ? e : new AIError(0, e.message);
    rec.code = err.code; rec.err = (err.raw || '').slice(0, 160); if (text) rec.partial = true;
    err.partial = text;
    throw err;
  }finally{
    rec.ms = Math.round(performance.now() - t0); rec.firstMs = tFirst === null ? null : Math.round(tFirst - t0);
    rec.in = inTok; rec.out = outTok; rec.finish = finish;
    try{ if (inTok || outTok) await addUsage(model, inTok, outTok); if (searches) await addSearch(p, searches); await logCall(rec); }catch(e){}
  }
}
/* 다시 보낼 대화에서 서버 검색 블록(짝 맞는 것 통째로)·인용·빈 글 블록을 걷어낸다 */
function healMsgs(msgs){
  return msgs.map(m => {
    if (!Array.isArray(m.content)) return m;
    const c = m.content.filter(b => b.type !== 'server_tool_use' && !/_tool_result$/.test(b.type) || b.type === 'tool_result')
      .filter(b => b.type !== 'thinking' && b.type !== 'redacted_thinking')
      .filter(b => b.type !== 'text' || (b.text && b.text.trim()))
      .map(b => b.type === 'text' ? { type:'text', text:b.text } : b);
    return { ...m, content:c.length ? c : [{ type:'text', text:'(계속)' }] };
  }).filter((m, i, a) => !(m.role === 'assistant' && i === a.length - 1 && m.content.every(b => b.type === 'text' && b.text === '(계속)')));
}
/* 한 차례 대화: 도구를 부르면 판에 적고, 결과를 돌려주고, 다시 묻는다(최대 8번) */
async function aiTurn(history, onText, stopSignal, opts){
  WORK.active = workOn() && !(opts && opts.noTools); WORK.noAsk = askMode() === 'auto'; WORK.before = null;
  dlog('AI', `→ 대답 시작 · ${opts && opts.big ? '큰 머리 ' + (bigModel() || aiModel()) : aiModel()} · 대화 ${history.length}개${opts && opts.noTools ? ' · 도구 없음' : ''}`);
  const p = AI.cfg.provider;
  const st = { p, key:aiKey(), model:(opts && opts.big && bigModel()) || aiModel(), system:await systemPrompt((opts && opts.big && bigModel()) || aiModel()), tools:!(opts && opts.noTools),
    web:webOn() && !AI.noWeb, onSearch:opts && opts.onSearch,
    msgs:history.map(m => ({ role:m.role, content:m.content })), retry:0,
    contents:history.map(m => ({ role:m.role === 'assistant' ? 'model' : 'user', parts:[{ text:m.content }] })) };
  let said = '', last = null; const srcs = [];
  for (let round = 0; round < 8; round++){
    const before = said;
    let r, tries = 0, healed = false;
    for (;;){
      try{ r = await aiRound(st, t => { if (onText) onText(before + t); }, stopSignal); break; }
      catch(e){
        /* 도구 쓴 뒤 400 — 주고받은 블록 중 하나가 거절된 것. 검색 블록·빈 글을 걷어내고 검색 없이 한 번 더 */
        if (e.code === 400 && round > 0 && !healed && !(e.partial && e.partial.trim())){
          healed = true; st.web = false; AI.noWeb = true; st.healed = (e.raw || '').slice(0, 120);
          st.msgs = healMsgs(st.msgs);
          continue;
        }
        /* 분당 한도면 알려준 만큼(최대 60초) 기다렸다가 다시 — 두 번까지. 하루 한도는 기다려도 소용없다 */
        if (e.code === 429 && e.kind !== 'day' && tries < 2 && (e.retryMs || 0) <= 60000 && !(e.partial && e.partial.trim())){
          tries++; const wait = Math.max(e.retryMs || 15000, 3000);
          if (opts && opts.onWait) opts.onWait(wait);
          try{ await sleepFor(wait, stopSignal); }catch(x){ x.partial = before; throw x; }
          if (opts && opts.onWait) opts.onWait(0);
          continue;
        }
        /* v1.2.2 서버가 잠깐 바쁘거나(5xx·529) 빈 대답·끊김 — 아직 한 글자도 안 보였으면 조용히 두 번까지 다시.
           빈 대답이 생각하다 자리가 모자라서면 자리를 두 배로. 마지막엔 다른 모델(작은 머리)로 */
        const busy = (e.code >= 500 || e.code === -1 || e.code === 0) && !(e.partial && e.partial.trim()) && !(stopSignal && stopSignal.aborted);
        if (busy && (st.retry || 0) < 2){
          st.retry = (st.retry || 0) + 1;
          if (/max_tokens/.test(e.raw || e.message)) st.maxTok = Math.min((st.maxTok || 2500) * 2, 32000);
          if (st.retry === 2 && opts && opts.big && aiModel() !== st.model){ st.model = aiModel(); st.fellBack = true; }
          if (opts && opts.onRetry) opts.onRetry(st.retry);
          try{ await sleepFor(st.retry === 1 ? 1500 : 4000, stopSignal); }catch(x){ x.partial = before; throw x; }
          continue;
        }
        e.partial = before + (e.partial || ''); throw e;
      }
    }
    last = r; said = before + r.text;
    for (const x of (r.sources || [])) if (!srcs.some(y => y.u === x.u)) srcs.push(x);
    /* 검색이 길어 서버가 잠깐 멈춘 것 — 받은 그대로 돌려주면 이어서 한다 */
    if (r.finish === 'pause_turn' && p === 'anthropic' && !r.calls.length){ st.msgs.push({ role:'assistant', content:r.blocks }); if (said && !/\s$/.test(said)) said += ' '; continue; }
    if (!r.calls.length) break;
    const results = [];
    WORK.batch = r.calls.filter(c => c.name !== 'ask_boss').length;
    for (const c of r.calls) results.push({ c, out:await runTool(c) });
    if (p === 'anthropic'){
      st.msgs.push({ role:'assistant', content:r.blocks });
      st.msgs.push({ role:'user', content:results.map(x => ({ type:'tool_result', tool_use_id:x.c.id, content:JSON.stringify(x.out) })) });
    } else {
      st.contents.push({ role:'model', parts:r.modelParts });
      st.contents.push({ role:'user', parts:results.map(x => ({ functionResponse:{ name:x.c.name, ...(x.c.id ? { id:x.c.id } : {}), response:x.out } })) });
    }
    if (said && !/\s$/.test(said)) said += ' ';
  }
  return { text:said.trim(), finish:last ? last.finish : '', rec:last ? last.rec : null, sources:srcs.slice(0, 5) };
}
const aiStream = (messages, onText, stopSignal) => aiTurn(messages, onText, stopSignal, { noTools:true });
/* 말풍선에 기계식 기호가 섞여 오면 걷어낸다 — **굵게**, ## 제목, - 목록, 표 줄 */
function plainChat(t){
  return String(t || '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/__(.+?)__/g, '$1').replace(/`([^`]+)`/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '').replace(/^\s*[-*•]\s+/gm, '· ').replace(/^\s*\|?\s*:?-{3,}.*$/gm, '').replace(/^\s*\|(.+)\|\s*$/gm, (_, x) => x.split('|').map(v => v.trim()).join(' / '))
    .replace(/\*\*/g, '').replace(/\n{3,}/g, '\n\n');
}
function parseFace(raw){
  const m = (raw || '').match(/^\s*\[(의심|생각|미소|당황|놀람|삐침)\]\s*/);
  const text = plainChat((m ? raw.slice(m[0].length) : (raw || '')).replace(/\[(의심|생각|미소|당황|놀람|삐침)\]\s*/g, '')).trim();
  return { t:text || '…', f:m ? FACE_TAGS[m[1]] : 0 };
}
