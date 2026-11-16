/* martin/js/update.js — 업데이트 묻기·적용 과정 v1.0 (11-16 D). 고칠 땐 이 줄 아래에 「11-16 D: …」처럼 날짜·방 주석
   세희 update.js · SCENES.update 의 흐름을 그대로, 모양은 마틴 대화창(말풍선 + 선택 단추)으로.
     세희: "사내 규정이 바뀌었습니다. 바로 적용하시겠어요?" [예 / 구버전으로 계속] → (1/3)(2/3)(3/3) 막대 + 이번에 바뀌는 것 → 다시 열린 뒤 세희 설명
     마틴: "새로운 업데이트가 있다. 적용하겠나?" [적용한다 / 지금 판으로 계속] → (1/3)(2/3)(3/3) 막대 + 이번에 바뀌는 것 → brief()(마틴 설명)
   다른 점 하나 — 아티팩트엔 서비스 워커가 없다(막혀 있음). 새 판을 올리면 열려 있던 화면은 아티팩트가 조용할 때 스스로 새 판으로 다시 열고,
   새로 여는 사람은 처음부터 새 판이다. 그래서 '받아 둔 새 껍데기'가 없고, 새 판으로 열린 직후에 묻는다.
     적용한다 = 판 사본을 남기고(drmartin.bak) 저장 → 새 도구로 판을 다시 그림 → 판을 다시 펼침 → 마틴이 바뀐 점 설명, 본 버전 표시
     지금 판으로 계속 = 적용 과정·설명·본 버전 표시를 미룸. 다음에 열면 다시 묻는다(코드 자체는 이미 새 것)
   묻는 때: 본 버전 기록(기기 drmartin.seen 또는 계정 meta/seen)이 있고, 그보다 새 버전이며, 보스 눈에 보이는 변화(CHANGES)가 있을 때만.
     기록이 아예 없으면(처음 쓰는 사람·옛 판) 묻지 않고 brief 가 예전대로 처리한다.
   brief.js · boot.js 는 C 몫이라 고치지 않는다 — 맨 아래 한 줄이 brief 를 감싸 앞에 끼운다. brief 이름이 바뀌면 그 줄만 옮기면 된다. */
const UPD = { asking:false };
async function updSeenVer(){
  let seen = null; try{ seen = localStorage.getItem('drmartin.seen'); }catch(e){}
  if (DB){ try{ const d = await DB.doc('meta/seen').get(); const v = d && d.exists ? d.data().v : null; if (v && (!seen || verGt(v, seen))) seen = v; }catch(e){} }
  return seen;
}
/* 이번에 바뀌는 것 — CHANGES 의 보스 말 한 줄씩, ' — ' 앞까지만, 최근 버전부터 */
function updTitles(from){
  const items = CHANGES.filter(c => verGt(c.v, from) && !verGt(c.v, VER)).reverse().flatMap(c => c.t).map(t => String(t).split(' — ')[0].trim()).filter(Boolean);
  return items;
}
/* 선택 단추 — 대화창 맨 아래. 판이 다시 그려지며 대화창이 지워져도 다시 붙인다 */
function updChoice(){
  return new Promise(ok => {
    const html = `<div class="upd-ask" id="updAsk"><button type="button" class="go" data-u="yes">적용한다</button><button type="button" data-u="no">지금 판으로 계속</button></div>`;
    const put = () => { if (!$('#updAsk')){ chatEl().insertAdjacentHTML('beforeend', html); toEnd(true); } };
    put();
    const mo = new MutationObserver(() => { if (UPD.asking) put(); }); mo.observe(chatEl(), { childList:true });
    chatEl().addEventListener('click', function on(e){ const b = e.target.closest('#updAsk [data-u]'); if (!b) return;
      UPD.asking = false; mo.disconnect(); chatEl().removeEventListener('click', on); $('#updAsk').remove(); ok(b.dataset.u); });
  });
}
/* 적용 과정 — 세희 updSceneRun 처럼 단계·막대·바뀌는 것. 여기선 단계마다 실제 일을 한다 */
async function updApply(from, titles){
  chatEl().insertAdjacentHTML('beforeend', `<div class="upd-prog" id="updProg"><div class="upd-st"></div><div class="upd-bar"><i></i></div>${titles.length ? `<div class="upd-list"><b>이번에 바뀌는 것 ${titles.length}가지</b>${titles.slice(0, 6).map(x => `<span>· ${esc(x)}</span>`).join('')}${titles.length > 6 ? `<span>· 외 ${titles.length - 6}가지</span>` : ''}</div>` : ''}</div>`);
  toEnd(true);
  const box = $('#updProg');
  const step = async (n, t, pct, work) => { if (box.isConnected){ box.querySelector('.upd-st').textContent = `(${n}/3) ${t}`; box.querySelector('i').style.width = pct + '%'; toEnd(); } try{ await work(); }catch(e){} await sleep(RM ? 80 : 750); };
  await step(1, '지금 판을 안전하게 적어 두는 중…', 30, async () => {
    try{ localStorage.setItem('drmartin.bak', JSON.stringify({ from, to:VER, at:Date.now(), s:S }, slim)); }catch(e){}   /* 적용 직전 판 사본 — 탈이 나면 이걸로 되살린다 */
    save(); dbSave();
  });
  await step(2, '새 수사 도구를 판에 끼우는 중…', 70, async () => { renderAll(); });
  await step(3, '판을 다시 펼치는 중…', 100, async () => { measure(); renderStrings(); renderMarks(); const f = fitBox(); cam.x = f.x; cam.y = f.y; cam.k = f.k; applyCam(0); });
  if (box.isConnected){ box.classList.add('done'); box.querySelector('.upd-st').textContent = `적용 끝 — ${VER}`; }
  act('업데이트 적용', { from, to:VER });
}
/* brief 앞 문지기 — true 면 brief 가 이어서 설명·본 표시, false 면 이번엔 넘어감 */
async function updGate(hello){   /* 11-16 C: hello — 판을 다시 연 첫 인사 자리에서 부를 때(boot). 첫 줄이 인사가 된다 */
  const seen = await updSeenVer();
  if (!seen || !verGt(VER, seen)) return true;
  const titles = updTitles(seen); if (!titles.length) return true;
  act('업데이트 물어봄', { from:seen, to:VER }); UPD.asked = true;
  thinking(false);
  await speak(hello ? '돌아왔군, 동료.' : '잠깐, 동료.', false);
  await speak('자리를 비운 사이에 수사 도구 몇 개가 바뀌었다.', false);
  await speak('새로운 업데이트가 있다. 적용하겠나?', false);
  UPD.asking = true;
  const v = await updChoice();
  if (v === 'no'){ act('업데이트 미룸', { from:seen, to:VER }); await speak('알겠다. 오늘은 지금 판으로 간다. 다음에 열면 다시 묻겠다.', false); return false; }
  await speak('좋다. 잠깐이면 된다.', false);
  await updApply(seen, titles);
  return true;
}
/* brief 감싸기 — brief.js 를 고치지 않고 앞에 끼운다(C 가 brief 를 합치거나 이름을 바꾸면 이 줄을 같이 옮긴다) */
/* 11-16 C: 첫 인사와 합침 — brief(hello) 의 hello 를 문지기에 넘기고, 문지기가 이미 물었으면(인사를 했으면) 브리핑은 다시 인사하지 않는다.
   돌려주는 값: 무언가 말했으면 true — boot 가 「돌아왔군. 판은 그대로다.」를 건너뛴다(미룸도 말한 것) */
if (typeof brief === 'function'){ const briefCore = brief; brief = async function(hello){ UPD.asked = false; if (!(await updGate(hello))) return true; const r = await briefCore.call(this, UPD.asked ? false : hello); return r || UPD.asked; }; }
