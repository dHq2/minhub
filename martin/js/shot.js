/* martin/js/shot.js — 판 사진(11-16 A, v0.11.0). 판 전체(모든 카드·실·꼬리표·코르크)를 지금 화면 배율과 상관없이 고화질 PNG 로 찍어 저장·복사.
   찍는 법: 화면 밖에 코르크 틀을 하나 만들고 판(#world)을 통째로 복사해 넣어, 카드가 있는 범위만큼만 잘라 html-to-image(js/lib, MIT)로 그린다.
   배율은 3배까지(긴 변 8192px·넓이 1,600만 px 안 — 폰 브라우저 한계). 글꼴을 못 받아 오면 글꼴 없이 다시. */
function shotBounds(){
  measure(); let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
  for (const n of S.nodes){ const w = (n.w || 130) * 1.08, h = (n.h || 150) * 1.08; l = Math.min(l, n.x - w / 2); r = Math.max(r, n.x + w / 2); t = Math.min(t, n.y - h / 2); b = Math.max(b, n.y + h / 2); }
  for (const el of document.querySelectorAll('#tags .tag')){ const x = parseFloat(el.style.left), y = parseFloat(el.style.top); if (isFinite(x)){ l = Math.min(l, x - 60); r = Math.max(r, x + 60); t = Math.min(t, y - 20); b = Math.max(b, y + 20); } }
  const P = 70; return { l:Math.floor(l - P), t:Math.floor(t - P), w:Math.ceil(r - l + P * 2), h:Math.ceil(b - t + P * 2) };
}
async function boardShot(){
  if (!window.htmlToImage) throw new Error('찍는 도구가 안 열렸다');
  const B = shotBounds(), ratio = Math.max(1, Math.min(3, 8192 / B.w, 8192 / B.h, Math.sqrt(16e6 / (B.w * B.h))));
  const wrap = document.createElement('div'); wrap.className = 'board shotwrap';
  wrap.style.cssText = `position:fixed;left:0;top:0;width:${B.w}px;height:${B.h}px;overflow:hidden;pointer-events:none;z-index:-1;opacity:0`;   /* 화면 밖에 두면 안 찍힌다 — 제자리에 투명하게 */
  const w = world.cloneNode(true); w.classList.remove('focus', 'hidestr'); w.style.transition = 'none'; w.style.transform = `translate(${-B.l}px,${-B.t}px)`;
  w.querySelectorAll('.card').forEach(c => c.classList.remove('sel', 'lift', 'dropped', 'spot', 'drop', 'mv', 'flash'));
  /* 실(svg)은 지금 보이는 모양을 글자 그대로 박아 둔다 — 찍는 그림에선 CSS·그라디언트(url(#…))가 안 따라와 검게 나온다 */
  const SEL = '#xl path, #xl circle, #marks ellipse, #marks text', os = world.querySelectorAll(SEL), cs2 = w.querySelectorAll(SEL);   /* 카드 안 그림(얼굴·지도)은 그대로 둔다 */
  os.forEach((o, i) => { const c = cs2[i]; if (!c) return; const st = getComputedStyle(o), fill = /url\(/.test(st.fill) ? '#c4161c' : st.fill;
    c.setAttribute('style', `fill:${fill};stroke:${st.stroke};stroke-width:${st.strokeWidth};stroke-dasharray:${st.strokeDasharray};stroke-linecap:${st.strokeLinecap};opacity:${st.opacity};filter:${st.filter === 'none' ? 'none' : st.filter};font:${st.font}`); });
  w.querySelectorAll('.sfx, .stamp, .ghost').forEach(x => x.remove());
  wrap.appendChild(w); const sh = document.createElement('div'); sh.className = 'shade'; wrap.appendChild(sh); document.body.appendChild(wrap);
  const opts = { width:B.w, height:B.h, pixelRatio:ratio, backgroundColor:getComputedStyle(board).backgroundColor, cacheBust:false, style:{ opacity:'1', zIndex:'auto' } };   /* 찍는 그림에선 투명을 푼다 */
  try{
    let blob = null;
    try{ blob = await Promise.race([htmlToImage.toBlob(wrap, opts), sleep(20000).then(() => null)]); }catch(e){ blob = null; }
    if (!blob){ act('판 사진 글꼴 없이 다시'); blob = await htmlToImage.toBlob(wrap, { ...opts, skipFonts:true }); }
    if (!blob) throw new Error('그림이 안 나왔다');
    return { blob, w:Math.round(B.w * ratio), h:Math.round(B.h * ratio) };
  } finally { wrap.remove(); }
}
let shotURL = '';
async function shotSheet(){
  if (busy) return; busy = true; act('판 사진 찍기', { cards:S.nodes.length });
  const fl = document.createElement('div'); fl.className = 'shotflash'; board.appendChild(fl); setTimeout(() => fl.remove(), 700);
  openSheet(`<h3>판 사진</h3><p class="sub">판 전체를 고화질로 찍는 중…</p>`);
  let r = null, err = '';
  try{ r = await boardShot(); }catch(e){ err = String(e && e.message || e).slice(0, 120); }
  busy = false;
  if (!r){ act('판 사진 실패', { err }); openSheet(`<h3>판 사진</h3><p class="sub">…필름이 걸렸다. 다시 눌러 봐라. (${esc(err)})</p>`); return; }
  if (shotURL) URL.revokeObjectURL(shotURL); shotURL = URL.createObjectURL(r.blob);
  const d = new Date(), name = `마틴-판-${(nodeOf('n1') || {}).title || S.id}-${d.getMonth() + 1}${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}.png`.replace(/[\\/:*?"<>|\s]+/g, '_');
  act('판 사진 찍음', { px:r.w + '×' + r.h, kb:Math.round(r.blob.size / 1024) });
  openSheet(`<h3>판 사진</h3><p class="sub">${r.w.toLocaleString()} × ${r.h.toLocaleString()} px · ${(r.blob.size / 1048576).toFixed(1)}MB — 카드 ${S.nodes.length}장 전부</p>
  <a class="shotimg" href="${shotURL}" target="_blank" rel="noopener"><img src="${shotURL}" alt="판 사진"></a>
  <div class="btns" style="margin-top:10px"><a class="ghost shotbtn" id="shotSave" href="${shotURL}" download="${esc(name)}">저장</a><button class="ghost" type="button" id="shotCopy">복사</button></div>
  <p class="foot" id="shotMsg">단추가 안 먹히는 화면이면 그림을 꾹 눌러 저장·복사한다.</p>`);
  $('#shotSave').onclick = () => act('판 사진 저장');
  $('#shotCopy').onclick = async () => {
    try{ await navigator.clipboard.write([new ClipboardItem({ 'image/png':r.blob })]); $('#shotMsg').textContent = '복사했다. 붙여 넣으면 된다.'; act('판 사진 복사'); }
    catch(e){ $('#shotMsg').textContent = '이 화면에선 복사가 막혀 있다 — 그림을 꾹 눌러 복사해라.'; act('판 사진 복사 막힘', { msg:String(e && e.message || e).slice(0, 80) }); }
  };
}
$('#btnShot').onclick = () => shotSheet();
