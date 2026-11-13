/* ── 새 버전 (v1.3.9 → v1.4.2 보너스 C 담당) — 켤 때 물어본다 ──
   새 껍데기는 받아 두기만 하고(대기), 앱을 켜면 「새 버전이 있어요」를 띄운다. 보너스 B·C 도 올라온 파일과 버전을 비교해 같이 묻는다(v1.4.2).
   「업데이트」 = 누르는 즉시 '업데이트하는 중…'으로 바뀌고 한 번에 가장 최신으로. 「지금 버전으로 계속」 = 이번엔 그대로, 다음에 켤 때 다시.
   새로 고친 뒤엔 「업데이트 끝 — v1.4.0 → v1.4.1」을 띄워 됐는지 바로 보이게. 눌렀는데 그대로면 그것도 말해 준다.
   쓰는 도중에 새 버전이 오면 세희가 쉴 때 한 번만 묻는다. */
let waitingSW = null, wantReload = false, reloading = false, updAsked = false, updDeclined = false, updLanes = {}, updMode = 'ask';
function updIdle(){
  const say = document.getElementById('sayText'), sh = document.getElementById('sheet');
  return !O.busy && !(say && say.value.trim()) && !(sh && sh.classList.contains('on')) && !document.getElementById('pinVeil');
}
function updBand(text, go, no){
  const u = $('upd'); u.querySelector('span').textContent = text;
  $('updGo').textContent = go || ''; $('updGo').style.display = go ? '' : 'none'; $('updGo').disabled = false;
  $('updNo').textContent = no || ''; $('updNo').style.display = no ? '' : 'none';
  u.classList.add('on');
}
function updHide(){ $('upd').classList.remove('on', 'ask'); }
async function applyUpdate(){
  if (reloading) return; reloading = true;
  try{ await flush(true); }catch(e){}
  try{ if (typeof SYNC !== 'undefined' && SYNC.on) await syncFlush(); }catch(e){}
  location.reload();
}
async function newVersionName(){
  try{ const t = await (await fetch('sw.js?v=' + Date.now(), { cache:'no-store' })).text(); const m = t.match(/VERSION = '([^']+)'/); return m ? m[1] : ''; }catch(e){ return ''; }
}
/* 보너스 갈래가 올라온 파일의 버전 — 파일 첫머리 주석의 'B0.7'·'C0.1' 같은 글자 */
async function laneLive(l){
  try{ const t = (await (await fetch(l.path + '?v=' + Date.now(), { cache:'no-store' })).text()).slice(0, 800);
    const m = t.match(new RegExp('\\b' + l.k + '\\d+(?:\\.\\d+)+')); return m ? m[0] : ''; }catch(e){ return ''; }
}
async function checkLanes(){
  if (typeof LANES === 'undefined' || !BONUS.loaded) return;
  for (const l of LANES){
    const cur = BONUS.vers[l.k] || '';
    if (!bonusOn(l.k) || !cur) continue;
    const live = await laneLive(l);
    if (live && live !== cur){ if (updLanes[l.k] !== live) dlog('업데이트', `${l.name} 새 버전 ${cur} → ${live}`); updLanes[l.k] = live; }
    else delete updLanes[l.k];
  }
}
const updPending = () => !!(waitingSW && waitingSW.state !== 'redundant') || Object.keys(updLanes).length > 0;
async function askUpdate(){
  if (updAsked || updDeclined || !updPending()) return;
  if (!updIdle()){ setTimeout(askUpdate, 3000); return; }
  updAsked = true; updMode = 'ask'; dlog('업데이트', '새 버전 물어봄');
  const parts = [];
  if (waitingSW){ const v = await newVersionName(); parts.push(`본체 ${APP_VERSION} → ${v || '새 버전'}`); }
  for (const l of LANES) if (updLanes[l.k]) parts.push(`${l.name} ${BONUS.vers[l.k]} → ${updLanes[l.k]}`);
  updBand(`새 버전이 있어요 — ${parts.join(' · ')}. 지금 업데이트할까요?`, '업데이트', '지금 버전으로 계속');
  $('upd').classList.add('ask');
}
function updSeen(){ const v = { A:APP_VERSION }; for (const l of LANES) if (bonusOn(l.k) && BONUS.vers[l.k]) v[l.k] = BONUS.vers[l.k]; return v; }
function doUpdate(){
  if (updMode === 'done'){ updHide(); return; }
  if (reloading || wantReload) return;
  wantReload = true; dlog('업데이트', '업데이트 누름');
  $('updGo').disabled = true; $('updNo').style.display = 'none';
  $('upd').querySelector('span').textContent = '업데이트하는 중… 잠깐만요. 저절로 새로 고쳐져요';
  $('updGo').textContent = '⏳';
  try{ localStorage.setItem('sehee.updFrom', JSON.stringify(updSeen())); }catch(e){}
  const w = waitingSW && waitingSW.state !== 'redundant' ? waitingSW : (S.reg && S.reg.waiting);
  if (w) w.postMessage('skip');
  setTimeout(applyUpdate, w ? 2500 : 300);   /* 무슨 일이 있어도 한 번 누르면 끝. 보너스만이면 바로 새로 고침(불러올 때 늘 새 파일) */
}
/* 켠 뒤(보너스까지 다 불러온 뒤) — 지난번과 버전이 바뀌었으면 「업데이트 끝」, 눌렀는데 그대로면 그렇다고 */
function updAfterBoot(){
  let seen = null, from = null;
  try{ seen = JSON.parse(localStorage.getItem('sehee.seen') || 'null'); from = JSON.parse(localStorage.getItem('sehee.updFrom') || 'null'); localStorage.removeItem('sehee.updFrom'); }catch(e){}
  const now = updSeen();
  try{ localStorage.setItem('sehee.seen', JSON.stringify(now)); }catch(e){}
  const base = from || seen; if (!base) return;
  const names = { A:'본체', B:'보너스 B', C:'보너스 C' }, ch = [];
  for (const k of Object.keys(now)) if (base[k] && base[k] !== now[k]) ch.push(`${names[k] || k} ${base[k]} → ${now[k]}`);
  if (ch.length){ dlog('업데이트', '업데이트 끝 · ' + ch.join(' · ')); updMode = 'done'; updBand(`업데이트 끝 — ${ch.join(' · ')}`, '확인'); setTimeout(() => { if (updMode === 'done') updHide(); }, 15000); return; }
  if (from){ dlog('업데이트', '눌렀는데 버전 그대로'); updMode = 'done';
    updBand('아직 새 버전이 다 올라오지 않았어요(올린 직후 1~2분은 이래요). 조금 뒤에 다시 물어볼게요', '확인');
    setTimeout(() => checkUpdate(false), 90000); }
}
function showUpdate(sw){ waitingSW = sw; dlog('업데이트', '새 버전 받아 둠(대기)'); askUpdate(); }
function newShellReady(){ dlog('업데이트', '새 껍데기가 자리 잡음'); if (wantReload) applyUpdate(); }
$('updGo').onclick = doUpdate;
$('updNo').onclick = () => { updDeclined = true; updHide(); dlog('업데이트', '지금 버전으로 계속'); toast(`이번엔 지금 버전 그대로 쓸게요. 다음에 켤 때 다시 물어볼게요`); };
async function checkUpdate(manual){
  if (manual){ updAsked = false; updDeclined = false; }
  if (S.reg){ try{ await S.reg.update(); }catch(e){} }
  await checkLanes();
  setTimeout(async () => {
    if (S.reg && !waitingSW && S.reg.waiting) waitingSW = S.reg.waiting;
    if (updPending()){ updAsked = false; askUpdate(); return; }
    if (!manual) return;
    if (!S.reg){ toast('이 화면에서는 본체 업데이트를 확인할 수 없어요'); return; }
    if (S.reg.installing){ toast('새 버전을 받는 중이에요 — 받으면 물어볼게요'); return; }
    const live = await newVersionName();
    if (live && live !== APP_VERSION){ toast(`올라온 건 ${live}인데 아직 다 안 올라왔어요. 1~2분 뒤 다시 눌러 주세요`); return; }
    const lv = LANES.filter(l => bonusOn(l.k) && BONUS.vers[l.k]).map(l => BONUS.vers[l.k]);
    toast(`지금이 최신이에요 — 본체 ${APP_VERSION}${lv.length ? ' · ' + lv.join(' · ') : ''}`);
  }, 900);
}
if ('serviceWorker' in navigator){
  navigator.serviceWorker.addEventListener('controllerchange', newShellReady);
  navigator.serviceWorker.register('sw.js').then(reg => {
    S.reg = reg;
    if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw && nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdate(nw); });
    });
  }).catch(() => {});
}
