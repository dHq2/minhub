/* martin/js/input.js — 입력줄 · 첨부 · 붙여넣기. 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
/* ── 입력·첨부 ── */
function renderChips(){ $('#chips').innerHTML = (attN ? `<span class="chip">사진 준비 중…</span>` : '') + att.map((a, i) => `<span class="chip">${a.type === 'img' ? `<img src="${a.thumb}" alt="">` : ''}${esc(a.name)}<button type="button" data-x="${i}" aria-label="빼기">✕</button></span>`).join(''); }
$('#chips').onclick = e => { const b = e.target.closest('[data-x]'); if (b){ act('첨부 뺌', { name:att[+b.dataset.x].name }); att.splice(+b.dataset.x, 1); renderChips(); } };
async function shrink(file, max, q){ const url = URL.createObjectURL(file); try{ const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
  const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
  return { data:c.toDataURL('image/jpeg', q), blob:await new Promise(r => c.toBlob(r, 'image/jpeg', q)) }; } finally { URL.revokeObjectURL(url); } }
/* v0.4 사진 준비(줄이기)가 끝나기 전에 건네기를 눌러도 기다렸다가 같이 보낸다 */
let attWork = Promise.resolve(), attN = 0;
function addFiles(files){ attN += files.length; renderChips(); const w = attWork.then(() => addFiles0(files)).catch(() => {}).finally(() => { attN -= files.length; renderChips(); }); attWork = w; return w; }
async function addFiles0(files){
  for (const f of files){ act('파일 붙임', { name:f.name, type:f.type, kb:Math.round(f.size / 1024) });
    if (/^image\//.test(f.type) || /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(f.name)){ try{ const t = await shrink(f, 320, .72), b = await shrink(f, 1600, .86); let m = await shrink(f, 1000, .72); if (m.data.length > 240000) m = await shrink(f, 800, .6);
        att.push({ type:'img', name:f.name || '사진', thumb:t.data, blob:b.blob, mid:m.data, orig:f }); }catch(e){ act('사진 읽기 실패', { name:f.name, type:f.type }); speak(`${f.name || '그 사진'}… 열리지 않는다. 캡처나 JPG로 다시 줘라.`, false); } }
    else if (/^text\/|json/.test(f.type) || /\.(txt|md|csv|json|log|html|srt)$/i.test(f.name)){ att.push({ type:'txt', name:f.name, text:await f.text() }); }
    else speak(`${f.name}… 이 서류는 아직 못 읽는다. 글이나 사진으로 가져와라.`, false);
  }
  renderChips();
}
/* v0.3 첨부 — 사진(image/* 만)과 글 파일을 따로 고른다. 앱 화면에서 섞인 고르기가 막히는 일 방지. 빈손으로 돌아오면 기록 */
let picking = null;
const attOpen = on => { $('#attm').classList.toggle('on', on); $('#btnAtt').setAttribute('aria-expanded', on); };
$('#attPaste').onclick = () => { act('붙여넣기 칸 열기'); attOpen(false); noPickerSheet(); };
$('#btnAtt').onclick = () => { const on = !$('#attm').classList.contains('on'); attOpen(on); if (on) act('첨부 메뉴'); };
for (const [id, kind] of [['#fileImg', '사진'], ['#fileAny', '파일']]){
  $(id).addEventListener('click', () => { picking = { kind, t:Date.now(), got:false }; act(kind + ' 고르기 열기'); watchPicker(kind); });
  $(id).onchange = e => { if (picking) picking.got = true; const fs = [...e.target.files]; e.target.value = ''; attOpen(false); act(kind + ' 고름', { n:fs.length }); if (fs.length) addFiles(fs); };
}
addEventListener('focus', () => { const p = picking; if (!p) return; setTimeout(() => { if (picking === p && !p.got) act(p.kind + ' 고르기 빈손', { ms:Date.now() - p.t }); if (picking === p) picking = null; }, 1500); });
document.addEventListener('pointerdown', e => { if (!e.target.closest('#attm,#btnAtt')) attOpen(false); });
/* v0.3.1 — Claude 앱 안(안드로이드 wv)은 파일 고르기 창을 열어 주지 않는다(로그 11-16 08:56~57 확인).
   고르기 창이 1.5초 안에 안 열리면(화면이 안 가려지면) 길을 띄운다: 크롬에서 이어 하기 / 붙여넣기 칸 */
const IN_APP = /; wv\)/.test(navigator.userAgent);
const ART_URL = 'https://claude.ai/artifact/LP7Co9A9TjdB9KVde1b1TS';
let pickerShown = false;
addEventListener('blur', () => { pickerShown = true; });
document.addEventListener('visibilitychange', () => { if (document.hidden) pickerShown = true; });
function watchPicker(kind){ pickerShown = false; const t = picking ? picking.t : 0;
  setTimeout(() => { if (!pickerShown && picking && picking.t === t && !picking.got){ act(kind + ' 고르기 창 안 열림', { inApp:IN_APP }); attOpen(false); noPickerSheet(); } }, 1500); }
function noPickerSheet(){
  openSheet(`<h3>여기선 고르기 창이 안 열린다</h3><p class="sub">Claude 앱 안에서 연 화면은 휴대폰이 사진·파일 고르기 창을 열어 주지 않는다. 둘 중 하나로 가져와라.</p>
  <a class="go golink" href="${ART_URL}" target="_blank" rel="noopener">크롬에서 열어 이어 하기</a>
  <p class="foot" style="margin-top:6px">판·대화·수첩은 계정에 저장돼 있어 크롬에서 그대로 이어진다. 크롬에서 열리지 않으면 이 주소를 크롬에 붙여 넣어라: ${ART_URL}</p>
  <h3 style="font-size:17px;margin-top:18px">붙여넣기 칸</h3><p class="sub">사진을 복사해 두고(갤러리 → 공유 → 복사, 또는 키보드 클립보드) 아래 칸을 길게 눌러 붙여넣기.</p>
  <div class="pz" id="pz" contenteditable="true" aria-label="붙여넣기 칸"></div><p class="foot" id="pzMsg"></p>`);
  const pz = $('#pz'); pz.focus();
}
async function takePasted(dt){
  const fs = []; if (dt){ for (const f of dt.files || []) fs.push(f); if (!fs.length) for (const it of dt.items || []) if (it.kind === 'file'){ const f = it.getAsFile(); if (f) fs.push(f); } }
  return fs;
}
document.addEventListener('paste', async e => { const z = e.target.closest && e.target.closest('#pz'); if (!z) return;
  const fs = await takePasted(e.clipboardData); const tx = e.clipboardData && e.clipboardData.getData('text/plain');
  e.preventDefault(); act('붙여넣기 칸', { files:fs.length, chars:(tx || '').length });
  if (fs.length){ await addFiles(fs); $('#pzMsg').textContent = `사진 ${fs.length}장을 받았다. 닫고 건네기를 눌러라.`; }
  else if (tx){ const m = $('#msg'); m.value = (m.value ? m.value + '\n' : '') + tx; $('#pzMsg').textContent = '글은 입력칸으로 옮겼다. 사진은 안 들어왔다.'; }
  else $('#pzMsg').textContent = '아무것도 안 들어왔다. 이 화면에선 사진 붙여넣기도 막혀 있을 수 있다 — 크롬에서 열어라.'; });
document.addEventListener('input', async e => { const z = e.target.closest && e.target.closest('#pz'); if (!z) return;   /* 키보드가 사진을 그림으로 꽂아 넣는 경우 */
  const ims = [...z.querySelectorAll('img')]; const fs = [];
  for (const im of ims){ try{ const b = await (await fetch(im.src)).blob(); if (b.size) fs.push(new File([b], '붙여넣은 사진.jpg', { type:b.type || 'image/jpeg' })); }catch(x){} }
  z.innerHTML = ''; if (fs.length){ act('붙여넣기 칸 그림', { n:fs.length }); await addFiles(fs); $('#pzMsg').textContent = `사진 ${fs.length}장을 받았다. 닫고 건네기를 눌러라.`; }
  else if (ims.length){ act('붙여넣기 칸 그림 못 읽음', { n:ims.length }); $('#pzMsg').textContent = '그림은 왔는데 읽을 수가 없다. 크롬에서 열어라.'; } });


$('#msg').addEventListener('paste', e => { const fs = [...(e.clipboardData && e.clipboardData.files || [])].filter(f => /^image\//.test(f.type)); if (fs.length){ e.preventDefault(); addFiles(fs); } });
/* v0.4.4 엔터 = 건네기, Shift+엔터 = 줄 바꿈(한글 조합 중 엔터는 건드리지 않음)
   v0.13.1 A: 폰(손가락 화면·마우스 없음)에선 엔터 = 줄 바꿈, 건네기는 단추로만. 자판의 엔터 키도 '줄 바꿈' 모양으로 */
const PHONE_IN = () => matchMedia('(hover: none) and (pointer: coarse)').matches;
if (PHONE_IN()) $('#msg').setAttribute('enterkeyhint', 'enter');
$('#msg').addEventListener('keydown', e => { if (e.key !== 'Enter' || e.shiftKey || e.isComposing || e.keyCode === 229 || PHONE_IN()) return; e.preventDefault(); act('엔터로 건네기'); $('#form').requestSubmit ? $('#form').requestSubmit() : $('#send').click(); });
/* v0.13.1 A: 입력칸 높이가 바뀌면 사진 위 대화(pvtalk.js, C)의 사진 끝자리도 다시 — 여러 줄 입력칸이 사진·떠 있는 대화를 덮지 않게 */
const msgGrew = () => { if ($('#pv').classList.contains('on') && typeof pvLayout === 'function') pvLayout(); };
$('#msg').addEventListener('input', e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(120, e.target.scrollHeight) + 'px'; msgGrew(); });
$('#form').onsubmit = async e => { e.preventDefault(); if (busy) return; if (attN){ $('#send').disabled = true; $('#send').textContent = '사진 준비'; await attWork; setBusy(false); } const t = $('#msg').value.trim(); if (busy || (!t && !att.length)) return; const a = att.splice(0); $('#msg').value = ''; $('#msg').style.height = ''; msgGrew(); renderChips(); turn({ text:t, atts:a }); };

