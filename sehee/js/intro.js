/* ── 처음 인사 프롤로그 v1 (v1.5.32, A) — 설계 handoff/설계-프롤로그.md
   새 사용자(판·대화·인간관계가 다 비어 있고 kv 'intro' 없음)가 앱을 처음 열면, B 의 장면 틀(scene.js scenePlay)로 세희가 인사한다.
   ① 인사 ② 뭐라고 부를지 ③ 하는 일 한 줄 ④ 알아 두면 좋은 것 ⑤ 화면 안내 ⑥ 마무리.
   저장: 호칭 → AI.cfg.callMe(세희 지침 첫 줄), 이름·하는 일·프로필 → 인간관계 판 「나」 카드(info·note), kv 'intro'(동기화돼서 다른 기기에선 다시 안 뜸).
   이미 쓰던 계정은 안 뜬다(그때 kv 'intro' 에 '쓰던 계정'으로 적어 둠). 설정 「처음 인사 다시 보기」로 언제든. */
const SE = (text, ex, more) => ({ who:'강세희', ex:ex || '안내', text, ...(more || {}) });
async function introNeeded(){
  if (await kvGet('intro')) return false;
  await pplLoad(); await loadChat();
  const dates = await allDates();
  let items = 0; for (const d of dates){ const p = await getPan(d); items += p && p.items ? p.items.length : 0; }
  const used = items || (O.log || []).some(m => m.who === 'u') || (PPL.list || []).length || (PPL.me && ((PPL.me.info || []).length || PPL.me.note));
  if (used){ await kvSet('intro', { at:Date.now(), v:1, skip:'쓰던 계정' }); return false; }
  return true;
}
/* 장면을 연 채로 입력 받기 — 대화창 위에 한 줄(또는 여러 줄) 칸과 [확인] [나중에] */
function introAsk(ph, multi){
  return new Promise(resolve => {
    const el = VN.el; if (!el){ resolve(''); return; }
    const box = document.createElement('div'); box.className = 'vn-ask';
    box.innerHTML = `${multi ? `<textarea rows="3" maxlength="400" placeholder="${esc(ph)}"></textarea>` : `<input maxlength="40" placeholder="${esc(ph)}">`}<div class="row"><button class="chip" data-a="later">나중에</button><button class="chip on" data-a="ok">확인</button></div>`;
    el.appendChild(box);
    const f = box.querySelector('input, textarea'); setTimeout(() => f.focus(), 50);
    const end = v => { box.remove(); resolve(v); };
    ['pointerup', 'pointerdown', 'click'].forEach(t => box.addEventListener(t, e => e.stopPropagation()));
    box.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter' && !multi){ e.preventDefault(); end(f.value.trim()); } });
    box.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (b) end(b.dataset.a === 'ok' ? f.value.trim() : ''); });
  });
}
async function introPlay(force){
  if (VN.el) return;   /* 다른 장면(업데이트 설명 등)이 떠 있으면 다음에 */
  dlog('화면', '프롤로그 시작' + (force ? ' (다시 보기)' : ''));
  const r = { call:'', name:'', job:'', about:'' };
  let v = await scenePlay([
    SE('처음 뵙겠습니다. 오늘부터 곁에서 일을 도와드릴 비서, 강세희예요.', '미소', { motion:'bow' }),
    SE('시작하기 전에 몇 가지만 여쭤볼게요. 금방 끝나요.', '안내'),
    SE('제가 뭐라고 불러 드리면 될까요?', '권유', { choices:[{ t:'보스', v:'보스' }, { t:'사장님', v:'사장님' }, { t:'이름으로 불러 줘', v:'name' }, { t:'직접 쓸게', v:'own' }] }),
  ], { keep:true });
  if (v === 'busy') return;
  if (v === 'name'){ await scenePlay([SE('성함이 어떻게 되세요?', '검토')], { cont:true, keep:true, auto:300 }); r.name = await introAsk('이름'); r.call = r.name ? r.name + '님' : '보스'; }
  else if (v === 'own'){ await scenePlay([SE('뭐라고 불러 드릴까요?', '검토')], { cont:true, keep:true, auto:300 }); r.call = (await introAsk('예: 팀장님, 선배, 형')) || '보스'; }
  else r.call = v;
  dlog('화면', '프롤로그 호칭 · ' + r.call);
  await scenePlay([SE(`네, ${r.call}. 잘 부탁드려요.`, '미소', { motion:'hop' }), SE('요즘 주로 어떤 일을 하세요? 한 줄이면 충분해요.', '생각')], { cont:true, keep:true, auto:300 });
  r.job = await introAsk('예: 가게 운영, 회사 일, 공부, 육아…');
  await scenePlay([SE(r.job ? '적어 둘게요.' : '괜찮아요, 나중에 알려 주세요.', '검토'), SE('그리고 제가 알아 두면 좋은 게 있을까요? 일하는 시간, 자주 연락하는 사람, 싫어하는 것 같은 거요.', '고민')], { cont:true, keep:true, auto:300 });
  r.about = await introAsk('여러 줄 써도 돼요. 비워 두면 일하면서 천천히 알아 갈게요.', true);
  await introSave(r);
  await scenePlay([
    SE('고마워요. 화면은 이렇게 써요.', '설명'),
    SE('왼쪽 일간보고서에는 오늘 할 일과 일정을 제가 정리해 둬요.', '설명'),
    SE('오른쪽 견출지를 누르면 달력, 보드, 인간관계 판이 열려요. 사람 얘기를 하시면 인간관계 판에 붙여 둘게요.', '안내'),
    SE(`아래 칸에 아무거나 말로 던져 주세요. 카톡 캡처나 파일도 돼요. 그럼 ${r.call}, 오늘 할 일부터 같이 정리해 볼까요?`, '권유', { motion:'hop' }),
  ], { cont:true });
  dlog('화면', '프롤로그 끝');
}
async function introSave(r){
  try{
    if (r.call){ AI.cfg.callMe = r.call.slice(0, 20); await saveAi(); }
    await meLoad();
    const me = PPL.me; me.info = me.info || [];
    const put = (k, val) => { if (!val) return; const o = me.info.find(x => x.k === k); if (o) o.v = val.slice(0, 80); else me.info.push({ k, v:val.slice(0, 80) }); };
    put('이름', r.name); put('부르는 말', r.call); put('하는 일', r.job);
    if (r.about) me.note = (me.note ? me.note + '\n' : '') + r.about.slice(0, 400);
    me.by = 'boss'; me.at = Date.now();
    await pplSave();
    await kvSet('intro', { at:Date.now(), v:1, call:r.call });
    dlog('화면', '프롤로그 저장', { call:r.call, name:!!r.name, job:!!r.job, about:!!r.about });
  }catch(e){ dlog('오류', '프롤로그 저장 실패 · ' + e.message); }
}
/* 앱을 다 연 뒤 — 업데이트 장면과 겹치지 않게 조금 기다렸다가 */
async function introMaybe(){ try{ if (SYNC.observer) return; try{ if (localStorage.getItem('sehee.nointro') === '1') return; }catch(e){}   /* 자동 테스트는 끔(tests/_guard.js) */ if (await introNeeded()) setTimeout(() => { if (!VN.el) introPlay(false); }, 900); }catch(e){ dlog('오류', '프롤로그 확인 실패 · ' + e.message); } }
