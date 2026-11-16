/* martin/js/split.js — 판·대화 나누기(v0.11.2, 11-16 B). 고칠 땐 이 줄 아래에 「11-16 B: …」처럼 날짜·방 주석 */
/* 보스: 대화가 두 개 반밖에 안 보여 흐름이 안 읽힌다 → 판과 대화창을 거의 정사각형 두 칸으로. 비율 조절도 되게.
   splitR = 대화창(.stage)이 (판 + 대화창) 높이에서 차지하는 몫. 기본 0.5(반반 — 폰에선 둘 다 거의 정사각형).
   둘 사이 손잡이(#split)를 위아래로 끌면 비율이 바뀌고 기기에 기억(localStorage 'drmartin.split'). 손잡이를 두 번 누르면 반반.
   높이를 바꾼 뒤엔 resize 신호를 한 번 보낸다 — 판 카메라(applyCam)·사진 크게 보기(pvLayout)가 그 신호로 다시 맞춘다 */
const SPLIT = { r:.5, min:.25, max:.75, drag:null, last:0 };
try{ const v = parseFloat(localStorage.getItem('drmartin.split')); if (v >= SPLIT.min && v <= SPLIT.max) SPLIT.r = v; }catch(e){}
const splitStage = () => document.querySelector('.stage');
function splitAvail(){ const st = splitStage(); return board.offsetHeight + st.offsetHeight; }
function splitSet(r, quiet){
  SPLIT.r = Math.max(SPLIT.min, Math.min(SPLIT.max, r));
  const av = splitAvail(), h = Math.round(Math.max(140, Math.min(av - 140, av * SPLIT.r)));
  splitStage().style.height = h + 'px';
  if (typeof stick !== 'undefined' && stick){ const c = $('#chat'); c.scrollTop = c.scrollHeight; }   /* 맨 아래를 보던 중이면 계속 맨 아래 */
  if (!quiet) dispatchEvent(new Event('resize'));   /* 판 카메라·사진 보기 다시 맞춤(가짜 신호 — 아래 resize 듣기는 이걸 무시) */
}
function splitSave(){ try{ localStorage.setItem('drmartin.split', SPLIT.r.toFixed(3)); }catch(e){} }
splitSet(SPLIT.r);
addEventListener('resize', e => { if (e.isTrusted) splitSet(SPLIT.r); });   /* 진짜 창 크기 변화(돌리기·자판)일 때만 — 비율은 그대로, 높이만 다시 */
{
  const h = $('#split');
  h.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); h.setPointerCapture(e.pointerId); h.classList.add('on');
    const st = splitStage(); SPLIT.drag = { id:e.pointerId, y0:e.clientY, h0:st.offsetHeight, av:splitAvail(), moved:false }; });
  h.addEventListener('pointermove', e => { const d = SPLIT.drag; if (!d || e.pointerId !== d.id) return;
    const dy = e.clientY - d.y0; if (Math.abs(dy) > 3) d.moved = true; if (!d.moved) return;
    splitSet((d.h0 - dy) / d.av); });
  const end = e => { const d = SPLIT.drag; if (!d || e.pointerId !== d.id) return; SPLIT.drag = null; h.classList.remove('on');
    if (d.moved){ splitSave(); act('판·대화 비율', { r:+SPLIT.r.toFixed(2) }); return; }
    const now = Date.now(); if (now - SPLIT.last < 400){ splitSet(.5); splitSave(); act('판·대화 반반'); SPLIT.last = 0; } else SPLIT.last = now; };
  h.addEventListener('pointerup', end); h.addEventListener('pointercancel', end);
}
