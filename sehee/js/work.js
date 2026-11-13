/* ── 작업 중계 (v1.3.0) — 세희가 실제로 고치는 모습을 보여 준다 ──
   사무실에서 생각(… 점)하다가, 판을 고치기 시작하면 판이 밀려 들어오고, 고칠 줄에 형광펜이 그어지고, 새 줄은 한 글자씩 써진다.
   보고서는 문서가 열리고 문단이 위에서부터 차례로 나타나며, 고친 문단엔 형광펜. 설정 「작업 보여주기」로 끌 수 있다.
   질문(「작업 중 질문」): 필요할 때만(ask_boss 로 멈춰서 묻기) / 마지막에 한 번(기본) / 알아서(안 묻고 가정만 한 줄). */
const WORK = { active:false, batch:1, before:null, ask:null };
const workOn = () => AI.cfg.work !== false;
const askMode = () => AI.cfg.ask || 'end';
const PAN_TOOLS = ['add_item', 'update_item', 'complete_item', 'delete_item', 'file_inbox'];
const wpace = () => Math.max(260, Math.min(850, 2600 / Math.max(1, WORK.batch)));
const wsleep = ms => new Promise(r => setTimeout(r, ms));
function hl(el, cls = 'w-hl'){ if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), 4200); }
async function typeInto(el, text, ms){
  if (!el) return; const t = String(text), n = t.length, step = Math.max(14, Math.min(55, ms / Math.max(1, n)));
  el.classList.add('w-caret'); el.textContent = '';
  for (let i = 1; i <= n; i += (n > 40 ? 2 : 1)){ el.textContent = t.slice(0, i); await wsleep(step); }
  el.textContent = t; el.classList.remove('w-caret');
}
async function workToPan(){
  if (curView() !== 'pan'){ setFace('talk'); SWIPE.anim = 'slide-inL'; goView('pan'); await wsleep(420); }
  if (S.date !== S.today){ await goDate(S.today); await wsleep(200); }
}
const itemEl = id => document.querySelector(`#main .it[data-id="${String(id || '').replace(/^#/, '')}"]`);
const WORK_LABEL = { add_item:'판에 적는 중', update_item:'판 고치는 중', complete_item:'끝낸 걸로 표시하는 중', delete_item:'판에서 지우는 중', file_inbox:'받은 것 정리하는 중',
  make_card:'보드에 쓰는 중', update_card:'보고서 고치는 중', add_person:'인간관계 판에 붙이는 중', update_person:'인간관계 판 고치는 중' };
async function workBefore(c){
  if (!workOn()) return;
  const a = c.args || {};
  if (O.live){ O.live.work = (WORK_LABEL[c.name] || '작업 중') + (a.text || a.title || a.name ? ' — ' + String(a.text || a.title || a.name).slice(0, 24) : ''); renderBoardTalk(); }
  if (PAN_TOOLS.includes(c.name)){
    await workToPan();
    if (c.name === 'add_item'){
      const sec = document.querySelector(`#main [data-sec="${a.section}"]`) || document.querySelector(`#main .sec`);
      if (sec){ sec.scrollIntoView({ block:'center', behavior:'smooth' }); await wsleep(180); hl(sec.querySelector('.sh') || sec, 'w-hl'); await wsleep(wpace() * 0.5); }
    } else {
      const el = itemEl(a.id);
      if (el){ el.scrollIntoView({ block:'center', behavior:'smooth' }); await wsleep(200); hl(el); await wsleep(wpace()); }
    }
  } else if (c.name === 'update_card'){
    const card = (BOARD.cards || []).find(x => x.id === String(a.id || '').replace(/^#/, ''));
    WORK.before = card && card.kind === 'report' ? { id:card.id, blocks:reportBlocks(card) } : null;
    if (WORK.before){ if (RV.id !== card.id) await rvOpen(card.id); await wsleep(300); }
  }
}
async function workAfter(c, r){
  if (!workOn() || !r || r.ok === false || r.error) return;
  const a = c.args || {};
  if (PAN_TOOLS.includes(c.name)){
    render();
    const id = (r.item && r.item.id) || r.id || a.id, el = itemEl(id);
    if (!el) return;
    el.scrollIntoView({ block:'center', behavior:'smooth' });
    if (c.name === 'add_item' || (c.name === 'update_item' && a.text)){
      const tx = el.querySelector('.tx') || el.querySelector('.t') || null;
      hl(el); if (tx) await typeInto(tx, tx.textContent, wpace() * 1.2); else await wsleep(wpace());
    } else { hl(el); await wsleep(wpace() * 0.8); }
  } else if ((c.name === 'make_card' && a.kind === 'report') || (c.name === 'update_card' && WORK.before)){
    const id = c.name === 'make_card' ? (r.id || (r.card && r.card.id)) : WORK.before.id; if (!id) return;
    const old = c.name === 'update_card' ? new Set(WORK.before.blocks) : null; WORK.before = null;
    const card = (BOARD.cards || []).find(x => x.id === id); if (!card) return;
    if (RV.id !== id) await rvOpen(id); await wsleep(60); rvRender();
    const nb = reportBlocks(card), els = [...document.querySelectorAll('#rvPages .pg-body > *')];
    const changed = els.map((el, i) => !old || !old.has(nb[i]));
    if (!old){
      els.forEach(el => el.classList.add('w-hide'));
      const step = Math.max(90, Math.min(320, 5200 / Math.max(1, els.length)));
      for (const el of els){ el.classList.remove('w-hide'); el.classList.add('w-in'); el.scrollIntoView({ block:'nearest', behavior:'smooth' }); await wsleep(step); }
      $('rvScroll').scrollTo({ top:0, behavior:'smooth' });
    } else {
      let first = null;
      els.forEach((el, i) => { if (changed[i]){ hl(el, 'w-hl'); first = first || el; } });
      if (first){ first.scrollIntoView({ block:'center', behavior:'smooth' }); await wsleep(wpace() * 1.4); }
    }
  }
}
/* 멈춰서 묻기 — 판·사무실 대화 상자에 질문과 고를 것. 고르거나, 입력창에 쓰거나, 「알아서 해」 */
function askBoss(c){
  const a = c.args || {}, opts = (a.options || []).slice(0, 4).map(String);
  if (WORK.noAsk) return Promise.resolve({ answer:'보스가 이번 작업은 알아서 하라고 했다. 묻지 말고 가장 그럴듯하게 정해 진행.' });
  return new Promise(resolve => {
    const m = { who:'s', text:String(a.question || '확인할 게 있어요.'), face:'think', at:Date.now(), ask:{ options:opts, open:true } };
    O.log.push(m); setFace('think');
    const done = ans => { if (!WORK.ask) return; m.ask.open = false; m.ask.chosen = ans; WORK.ask = null; renderLog(); saveLog();
      dlog('대화', '질문 답 ← ' + ans); resolve({ answer:ans }); };
    WORK.ask = { m, done };
    if (O.abort) O.abort.signal.addEventListener('abort', () => done('(보스가 멈춤) 알아서 진행'), { once:true });
    renderLog(); saveLog();
    if (document.hidden) jobNotify(true, '물어볼 게 있어요: ' + m.text);
  });
}
function askButtons(m, i){
  if (!m.ask) return '';
  if (!m.ask.open) return m.ask.chosen ? `<span class="ask-a">→ ${esc(m.ask.chosen)}</span>` : '';
  return `<span class="ask-b">${m.ask.options.map(o => `<button data-ask="${esc(o)}">${esc(o)}</button>`).join('')}<button data-ask="알아서 해" class="ask-auto">알아서 해</button></span>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-ask]'); if (!b || !WORK.ask) return;
  const v = b.dataset.ask; if (v === '알아서 해') WORK.noAsk = true;
  O.log.push({ who:'u', text:v, at:Date.now() }); WORK.ask.done(v === '알아서 해' ? '알아서 해 — 이번 작업은 더 묻지 말고 가장 그럴듯하게 정해서 끝까지' : v);
});
