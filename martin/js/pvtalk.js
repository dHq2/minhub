/* martin/js/pvtalk.js — 사진 위에 뜨는 대화 (11-17 C). 고칠 땐 이 줄 아래에 「11-17 C: …」처럼 날짜·방 주석
   보스: 폰에서 사진을 크게 띄우면 대화창이 안 보여 사진을 보며 실시간으로 묻기 힘들다.
   「대화 보기」(사진 크게 보기의 기본) = 사진은 입력줄 바로 위까지 화면 가득, 최근 대화 몇 줄이 사진 아래쪽에 반투명으로 떠 있고,
   입력줄·첨부 칩(진짜 것)은 사진 위로 올라와 그대로 쓴다. 떠 있는 대화는 손가락을 통과시켜서 그 자리에서도 사진을 끌고 키울 수 있다.
   「대화 숨기기」 = 예전처럼 사진만 화면 가득. 판독문(pvdoc.js, B)을 펼치면 떠 있는 대화는 잠시 숨는다.
   떠 있는 대화는 #chat 의 마지막 말풍선들을 그대로 베낀 것(마틴이 말하는 중 … 과 한 글자씩 쌓이는 것까지). 대화 자체는 #chat 이 정본. */
const PVT = { el:null, raf:0, n:6 };
PVT.el = document.createElement('div'); PVT.el.className = 'pv-talk'; PVT.el.id = 'pvTalk'; PVT.el.setAttribute('aria-hidden', 'true'); $('#pvS').appendChild(PVT.el);
const pvTalkOn = () => { const pv = $('#pv'); return pv.classList.contains('on') && !pv.classList.contains('full'); };
/* 사진이 끝나는 자리 — 화면 아래에서 입력줄(첨부 칩이 있으면 칩)까지의 높이(view.js pvLayout 이 --pvb 로 씀) */
function pvTalkBottom(){
  const app = $('#app').getBoundingClientRect(), f = $('#form').getBoundingClientRect(), c = $('#chips');
  const top = Math.min(f.top, c.offsetHeight ? c.getBoundingClientRect().top : Infinity);
  return Math.max(0, Math.round(app.bottom - top));
}
/* 사진을 처음 맞출 때 아래에 비워 둘 높이 — 떠 있는 대화에 사진이 덜 가리게(view.js pvFit) */
function pvTalkRoom(){ return pvFull ? 0 : Math.round($('#pvS').clientHeight * .3); }
function pvTalkRender(){
  PVT.raf = 0; if (!pvTalkOn()) return;
  const all = [...document.querySelectorAll('#chat > .msg')].slice(-PVT.n);
  PVT.el.innerHTML = all.map(m => { const c = m.cloneNode(true); c.removeAttribute('id'); c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id')); return c.outerHTML; }).join('');
}
function pvTalkSync(){ const on = pvTalkOn(); $('#app').classList.toggle('pvtalk', on); if (on) pvTalkRender(); else PVT.el.innerHTML = ''; }
new MutationObserver(() => { if (!PVT.raf && pvTalkOn()) PVT.raf = requestAnimationFrame(pvTalkRender); }).observe($('#chat'), { childList:true, subtree:true, characterData:true });
new MutationObserver(pvTalkSync).observe($('#pv'), { attributes:true, attributeFilter:['class'] });   /* 열기·닫기·대화 숨기기·판독문 */
new MutationObserver(() => { if ($('#pv').classList.contains('on')){ pvLayout(); requestAnimationFrame(() => { if (PV.iw && !$('#pv').classList.contains('touched')) pvFit(); }); } }).observe($('#chips'), { childList:true });   /* 첨부 칩이 생기고 빠지면 사진 끝자리도 */
