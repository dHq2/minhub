/* martin/js/sheets.js — 서랍들 — 사건 서류함 · 수사 기록 · 인물 카드. 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
/* ── 서랍들 ── */
const openSheet = h => { $('#sheet').innerHTML = h; $('#app').classList.add('open'); $('#sheet').scrollTop = 0; };
const closeSheet = () => $('#app').classList.remove('open');
$('#scrim').onclick = closeSheet;
function menuSheet(){
  act('서류함 열기');
  openSheet(`<h3>사건 서류함</h3><p class="sub">Dr. 마틴의 추리판 ${VER} · 사건 번호 ${esc(S.id)}</p>
  <p class="sub" style="margin:8px 0 0">마틴의 머리 — 지금 ${brainTxt()}</p>
  <div class="seg">${MODELS.map(m => `<button type="button" data-model="${m[0]}" class="${AI.model === m[0] ? 'on' : ''}">${m[1]}<br><small style="font-weight:400;opacity:.75">${m[2]}</small></button>`).join('')}</div>
  <div class="seg">${EFFORTS.map(e => `<button type="button" data-effort="${e[0]}" class="${AI.effort === e[0] ? 'on' : ''}">생각 ${e[1]}</button>`).join('')}</div>
  <button class="row" data-s="cases" type="button"><span class="folder">▤</span><span><b>지난 사건</b><small>계정에 남은 사건을 골라 다시 연다</small></span></button>
  <button class="row" data-s="log" type="button"><span class="folder">≡</span><span><b>수사 기록</b><small>대화 · 내 행동 · 마틴의 기억 전부</small></span></button>
  <button class="row" data-s="reset" type="button"><span class="folder">+</span><span><b>새 사건</b><small id="rs">지금 판을 비우고 새로 시작한다. 기록은 남는다.</small></span></button>
  <p class="foot">${esc(VER)} · 최근 바뀐 것: ${esc((CHANGES[CHANGES.length - 1] || { t:[] }).t.join(' · '))}</p>`);
}
let logTab = 'chat';
function logSheet(){
  let all = []; try{ all = JSON.parse(localStorage.getItem('drmartin.log') || '[]'); }catch(e){}
  const mine = all.filter(e => e.cid === S.id), tm = e => new Date(e.ts).toTimeString().slice(0, 8);
  let body = '';
  if (logTab === 'chat') body = S.log.map(l => `<p class="${l.who}"><small>${hhmm(l.at)} · ${l.who === 'p' ? '나(기자)' : '마틴'}</small>${esc(l.text)}</p>`).join('');
  else if (logTab === 'act') body = mine.filter(e => e.type !== 'memory' && e.type !== 'turn').slice().reverse().map(e => `<p class="p"><small>${tm(e)} · ${e.type === 'chat' ? (e.who === 'p' ? '내 말' : '마틴 말') : e.type === 'action' ? '행동' : e.type}</small>${esc(e.act || e.text || '')}${typeof actDetail === 'function' ? actDetail(e) : ''}${e.files && e.files.length ? ' · 파일 ' + e.files.map(f => esc(f.name)).join(', ') : ''}</p>`).join('') || '<p class="p">아직 없다.</p>';
  else body = `<p class="memo"><small>수사 수첩 ${S.notes.length}줄 — 왼쪽 수첩에서 칸별로 본다</small></p>` + mine.filter(e => e.type === 'turn').slice().reverse().map(e => `<p><small>${tm(e)} · 턴 ${e.n || '-'} · ${esc(e.model)} ${esc(e.effort)} · ${(e.ms / 1000).toFixed(1)}초${e.ok ? '' : ' · 실패 ' + esc(e.error && e.error.code)}</small><pre>${esc(JSON.stringify(e.ok ? e.response : e.error, null, 1))}</pre></p>`).join('');
  openSheet(`<h3>수사 기록</h3><p class="sub">사건 ${esc(S.id)} · 이 기기에 ${all.length}줄${DB ? ' · 계정 저장소에도 쌓는 중' : ' · 계정 저장소 연결 안 됨(기기에만)'}</p>
  <div class="tabs">${[['chat', '대화'], ['act', '행동'], ['mem', '기억']].map(([k, n]) => `<button type="button" data-tab="${k}" class="${logTab === k ? 'on' : ''}">${n}</button>`).join('')}</div>
  <div class="log">${body}</div>
  <div class="btns" style="margin-top:12px"><button class="ghost" data-s="copylog" type="button">기록 전체 복사</button></div><p class="foot" id="cpMsg"></p>`);
}
$('#sheet').addEventListener('click', async e => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.case !== undefined){ const c = (window.__cs || [])[+t.dataset.case]; closeSheet(); if (!c || busy) return; if (c.id === S.id) return; flushLog(); dbSave(); adopt(clone(c), '지난 사건 엶'); save(); await speak('이 사건이군. 판은 그대로다.', false); return; }
  if (t.dataset.unface){ const n = nodeOf(t.dataset.unface); if (n){ delete n.face; delete n.faceFrom; act('프사 뺌', { id:n.id }); save(); renderNodes(); renderStrings(); renderMarks(); } return closeSheet(); }
  if (t.dataset.pvo) return openPv(t.dataset.pvo);
  if (t.dataset.tab){ logTab = t.dataset.tab; act('기록 탭 ' + logTab); return logSheet(); }
  if (t.dataset.model || t.dataset.effort){ if (t.dataset.model) AI.model = t.dataset.model; if (t.dataset.effort) AI.effort = t.dataset.effort; act('머리 바꿈', { model:AI.model, effort:AI.effort }); try{ localStorage.setItem('drmartin.ai', JSON.stringify(AI)); }catch(e){} $('#brain').textContent = brainTxt(); return menuSheet(); }
  const s = t.dataset.s;
  if (s === 'log') return logSheet();
  if (s === 'cases'){ act('지난 사건 열기'); if (!DB){ openSheet('<h3>지난 사건</h3><p class="sub">계정 저장소에 닿지 않는다. 잠시 뒤 다시.</p>'); return; }
    openSheet('<h3>지난 사건</h3><p class="sub">불러오는 중…</p>'); const cs = await listCases(); window.__cs = cs;
    openSheet(`<h3>지난 사건</h3><p class="sub">누르면 그 사건으로 간다. 지금 판은 그대로 계정에 남는다.</p>${cs.map((c, i) => { const b = (c.nodes || []).find(n => n.id === 'n1') || {}, d = new Date(c.at); return `<button class="row" data-case="${i}" type="button"><span class="folder">${c.id === S.id ? '●' : esc(String(c.turn || 0))}</span><span><b>${esc(b.title || '사건')}</b><small>${d.getMonth() + 1}/${d.getDate()} ${d.toTimeString().slice(0, 5)} · ${c.turn || 0}턴 · 카드 ${(c.nodes || []).length}장${c.id === S.id ? ' · 지금 판' : ''}</small></span></button>`; }).join('') || '<p class="sub">아직 남은 사건이 없다.</p>'}`); return; }
  if (s === 'copylog'){ let all = '[]'; try{ all = localStorage.getItem('drmartin.log') || '[]'; }catch(x){}
    const txt = JSON.stringify({ case:snap(), chat:S.log, log:JSON.parse(all) }, null, 1);
    try{ await navigator.clipboard.writeText(txt); $('#cpMsg').textContent = '복사했다. ' + Math.round(txt.length / 1024) + 'KB'; act('기록 복사'); }catch(x){ $('#cpMsg').textContent = '이 화면에선 복사가 막혔다.'; } return; }
  if (s === 'reset'){ if (t.dataset.arm !== '1'){ t.dataset.arm = '1'; const r = $('#rs'); if (r) r.textContent = '한 번 더 누르면 비운다.'; return; }
    closeSheet(); if (busy) return; log('memory', { n:S.turn, closed:true, board:snap() }); act('새 사건', { from:S.id }); flushLog(); S = fresh(); save(); renderAll(); renderChat(true); act('사건 시작'); await fitAll(0); for (const l of OPEN) await speak(l); save(); }
});
$('#btnMenu').onclick = menuSheet; $('#btnLog').onclick = () => { act('기록 열기'); logSheet(); };
$('#btnFit').onclick = () => { act('전체 보기'); fitAll(600); };
$('#btnTidy').onclick = () => { if (busy) return; act('판 정리 단추'); rebuildBoard(); };   /* 11-16 A: 마틴이 묶음을 새로 짜서 다시 놓는다 */

