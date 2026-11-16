/* martin/js/pvdoc.js — 사진 크게 보기의 판독문 펼치기(v0.12.2, 11-17 B). 고칠 땐 이 줄 아래에 「11-17 B: …」처럼 날짜·방 주석 */
/* 보스: 사진 아래 전사본은 보이지도 않고, 사진 설명도 없어도 된다 — 위엔 이름 한 줄만. 단, 단추로 내부 전사본은 볼 수 있게.
   #pvN(마틴의 판독 + 카드 메모, 글은 view.js pvRefresh 가 채움)은 평소 숨김. 「판독문」을 누르면 사진 위에 판처럼 펼쳐지고 다시 누르면 접힘.
   마틴은 예전처럼 판독문을 매 턴 [자료함]으로 받는다 — 화면에서만 감춘 것 */
let pvDoc = false;
function pvDocSet(on){
  pvDoc = !!on; $('#pv').classList.toggle('doc', pvDoc); $('#pvD').textContent = pvDoc ? '판독문 닫기' : '판독문';
  if (pvDoc){ const n = $('#pvN'); n.style.top = ($('#pv .pv-top').offsetHeight + 8) + 'px'; n.scrollTop = 0; }
}
$('#pvD').onclick = () => { pvDocSet(!pvDoc); act(pvDoc ? '판독문 펼침' : '판독문 접음', { id:PV.id }); };
$('#pvX').addEventListener('click', () => pvDocSet(false));
addEventListener('resize', () => { if (pvDoc) pvDocSet(true); });
