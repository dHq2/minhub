/* ── 보고서 (v1.1) — 세희가 만든 보고서는 A4 한 장짜리 내부 문서로 나온다 ──
   넘치면 2쪽, 3쪽… 아래로 이어 붙여 스크롤로 읽는다. 글자를 키우면 쪽이 다시 나뉜다.
   보드 안 '보고서함'에서 갤러리(쪽 미리보기)나 목록으로 모아 보고, 누르면 크게 연다. */
const RV = { id:null, fz:+(localStorage.getItem('sehee-rvfz') || 1.3) };
const docNo = c => { const d = new Date(c.at); return `RPT-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${c.id.slice(-3).toUpperCase()}`; };
const ymdDot = t => { const d = new Date(t); return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`; };
function reportBlocks(c){
  const B = [];
  B.push(`<div class="rb-title"><div class="rb-top"><span class="rb-kind">업무 보고</span><span class="rb-no">${docNo(c)}</span></div>
    <div class="rb-row"><div><h1>${esc(c.title)}</h1><div class="rb-sub">작성 강세희 · ${ymdDot(c.edited || c.at)}${c.basis ? ` · 근거 ${esc(c.basis)}` : ''}</div></div>
    <table class="rb-sign"><tr><th>작성</th><th>확인</th></tr><tr><td>세희</td><td></td></tr></table></div></div>`);
  if (c.summary) B.push(`<div class="rb-sum"><b>요약</b><p>${esc(c.summary)}</p></div>`);
  if (c.highlights && c.highlights.length) B.push(`<div class="rb-hl">${c.highlights.map(h => `<div><span>${esc(h.label)}</span><b>${esc(h.value)}</b></div>`).join('')}</div>`);
  (c.sections || []).forEach((x, i) => {
    B.push(`<h2 class="rb-h"><i>${i + 1}</i>${esc(x.heading)}</h2>`);
    if (x.text) for (const t of x.text.split(/\n+/).filter(Boolean)) B.push(`<p class="rb-p">${esc(t)}</p>`);
    if (x.points && x.points.length) B.push(`<ul class="rb-ul">${x.points.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`);
    if (x.rows && x.rows.length) B.push(`<div class="rb-tw">${tableHtml({ columns:x.cols, rows:x.rows }, 0)}</div>`);
  });
  B.push('<div class="rb-end">— 끝 —</div>');
  return B;
}
function pageFrame(c, n, N, W, fz){
  return `<div class="pg" style="width:${W}px;height:${Math.round(W * 1.4142)}px;--u:${(W / 600).toFixed(4)};--fz:${fz}">
    <div class="pg-head"><span>세희 · 내부 문서</span><span>${esc(c.title)}</span></div><div class="pg-body"></div>
    <div class="pg-foot"><span>${docNo(c)}</span><span>${n} / ${N}</span></div></div>`;
}
/* 블록을 한 쪽씩 채워 넣다가 넘치면 다음 쪽으로. 제목만 쪽 끝에 홀로 남지 않게 같이 넘긴다 */
function paginate(c, W, fz){
  const host = document.createElement('div'); host.style.cssText = 'position:absolute;left:-99999px;top:0;visibility:hidden';
  document.body.appendChild(host);
  host.innerHTML = pageFrame(c, 1, 1, W, fz);
  const body = host.querySelector('.pg-body'), pages = []; let cur = [];
  for (const b of reportBlocks(c)){
    body.insertAdjacentHTML('beforeend', b);
    if (body.scrollHeight > body.clientHeight + 1 && cur.length){
      body.lastElementChild.remove();
      const carry = [];
      if (/^<h2/.test(cur[cur.length - 1]) && cur.length > 1) carry.push(cur.pop());
      pages.push(cur); cur = [...carry, b]; body.innerHTML = cur.join('');
    } else cur.push(b);
  }
  pages.push(cur); host.remove();
  return pages;
}
function rvRender(){
  const c = (BOARD.cards || []).find(x => x.id === RV.id); if (!c) return;
  const box = $('rvPages'), W = Math.min(box.clientWidth - 20, 760), fz = RV.fz;
  const pages = paginate(c, W, fz);
  box.innerHTML = pages.map((p, i) => pageFrame(c, i + 1, pages.length, W, fz)).join('');
  box.querySelectorAll('.pg-body').forEach((el, i) => { el.innerHTML = pages[i].join(''); });
  $('rvT').textContent = c.title; $('rvN').textContent = `${pages.length}쪽`;
}
async function rvOpen(id){
  await boardLoad(); RV.id = id;
  $('rv').classList.add('on'); $('rvScroll').scrollTop = 0;
  requestAnimationFrame(rvRender);
}
function rvClose(){ $('rv').classList.remove('on'); RV.id = null; }
$('rv').addEventListener('click', async e => {
  const b = e.target.closest('[data-rv]'); if (!b) return;
  const a = b.dataset.rv, c = (BOARD.cards || []).find(x => x.id === RV.id);
  if (a === 'close') rvClose();
  else if (a === 'big' || a === 'small'){ RV.fz = Math.max(0.8, Math.min(1.8, +(RV.fz + (a === 'big' ? 0.15 : -0.15)).toFixed(2))); localStorage.setItem('sehee-rvfz', RV.fz); rvRender(); }
  else if (a === 'copy' && c) navigator.clipboard.writeText(reportText(c)).then(() => toast('보고서 글을 복사했어요'), () => toast('복사가 막혔어요'));
  else if (a === 'print') window.print();
  else if (a === 'del' && c){
    if (!b.classList.contains('armed')){ b.classList.add('armed'); b.textContent = '한 번 더'; setTimeout(() => { b.classList.remove('armed'); b.textContent = '떼기'; }, 2500); return; }
    BOARD.cards = BOARD.cards.filter(x => x !== c); await boardSave(); rvClose(); boardRender();
  }
});
window.addEventListener('resize', () => { if (RV.id) rvRender(); });
/* 보드 / 보고서함, 갤러리 / 목록 */
const RL = { mode:'board', view:localStorage.getItem('sehee-rlview') || 'gallery' };
function thumbHtml(c){
  const W = 420, blocks = reportBlocks(c);
  return `<div class="th-wrap"><div class="th-scale">${pageFrame(c, 1, '…', W, 1).replace('<div class="pg-body"></div>', `<div class="pg-body">${blocks.slice(0, 8).join('')}</div>`)}</div></div>`;
}
function reportsHtml(){
  const rs = (BOARD.cards || []).filter(c => c.kind === 'report');
  if (!rs.length) return '<div class="wb-empty">아직 보고서가 없어요.<br>자료를 넘기고 "보고서로 정리해줘"라고 하면 여기 쌓여요.</div>';
  if (RL.view === 'list') return `<div class="rl-list">${rs.map(c => `<div class="rl-row" data-rep="${c.id}"><div class="rl-ico">📄</div><div class="rl-x"><b>${esc(c.title)}</b><span>${ymdDot(c.edited || c.at)} · ${(c.sections || []).length}개 항목${c.basis ? ' · ' + esc(c.basis) : ''}</span><p>${esc((c.summary || '').slice(0, 90))}</p></div></div>`).join('')}</div>`;
  return `<div class="rl-gal">${rs.map(c => `<div class="rl-card" data-rep="${c.id}">${thumbHtml(c)}<b>${esc(c.title)}</b><span>${ymdDot(c.edited || c.at)}</span></div>`).join('')}</div>`;
}
