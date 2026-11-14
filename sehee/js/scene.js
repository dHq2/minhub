/* ── 게임 대화 장면 v1 (v1.5.30, B) — 시나리오 편집기(v1.4) 작동 방식을 앱 안으로 ──
   화면이 어두워지고(세희·대화창만 밝게) 세희가 옆에서 들어와 서고, 아래 대화창에 글이 타자처럼 찍힌다(초당 30자, 글자마다 뚜두두 소리).
   대화창은 우리 앱 것(사무실·판 대화 상자와 같은 남색 이름표 + 흰 상자 — 편집기의 종이 상자·도트 글꼴은 안 씀, 보스 11-15). 모양은 css 맨 아래 .vn-box 에서만.
   누르면: 글이 다 안 나왔으면 다 채우고 → 다 나왔으면 다음 줄. 다 나오면 ▼ 가 깜빡. 선택지가 있는 줄은 골라야 넘어간다.
   표정은 0.16초 겹쳐 바뀌고, 모션(hop 폴짝 · shake 도리도리 · bow 꾸벅)은 한 번.
   대본은 그냥 자료(아래 SCENES) — 나중에 편집기로 만들어 넣을 수 있게. 앞으로 다른 장면(인사·이벤트)에도 그대로 쓴다.
     scenePlay([{ who, ex, text, motion, choices:[{ t, v }] }], { dim, keep, cont, auto }) → 고른 값(선택지 없으면 'done')
       keep: 끝나도 안 닫음(sceneClose 로 닫기) · cont: 열려 있는 장면에 이어서 · auto: 마지막 줄은 다 찍히면 저절로 넘어감
   세희 그림은 장면을 열 때만 받는다(껍데기 SHELL 엔 안 넣음 — 업데이트마다 다시 받지 않게). */
const VN_FACE = { 안내:'vn-present', 검토:'vn-memo', 지적:'vn-scold', 생각:'vn-think', 설명:'vn-explain', 고민:'vn-ponder', 권유:'vn-offer', 미소:'vn-smile' };
const VN_WHO = { 강세희:{ face:VN_FACE, pitch:560 } };
const VN = { cps:30, sound:true, vol:0.32, ac:null, master:null, lastBlip:0, el:null, ready:null };
const vnSrc = ex => `art/${VN_FACE[ex] || VN_FACE.안내}.webp`;
/* 미리 받기 — 세희 그림 8장(3초 안에 못 받으면 그냥 연다) */
function vnPreload(){
  if (VN.ready) return VN.ready;
  const img = u => new Promise(r => { const i = new Image(); i.onload = i.onerror = () => r(); i.src = u; });
  const all = Object.keys(VN_FACE).map(vnSrc).map(img);
  VN.ready = Promise.race([Promise.all(all), new Promise(r => setTimeout(r, 3000))]);
  return VN.ready;
}
/* 전자음 — 편집기와 같은 네모파 짧은 소리. 손가락이 한 번 닿기 전엔 폰이 막을 수 있음(그럼 조용히) */
function vnAudio(){
  if (VN.ac){ if (VN.ac.state === 'suspended') VN.ac.resume().catch(() => {}); return VN.ac; }
  try{ VN.ac = new (window.AudioContext || window.webkitAudioContext)(); VN.master = VN.ac.createGain(); VN.master.gain.value = VN.vol; VN.master.connect(VN.ac.destination); }catch(e){ VN.ac = null; }
  return VN.ac;
}
function vnBlip(pitch, c){
  const ac = VN.ac; if (!ac || !VN.sound || ac.state !== 'running') return; const now = ac.currentTime; if (now - VN.lastBlip < 0.028) return; VN.lastBlip = now;
  const code = (c || 'a').codePointAt(0), f = pitch * (1 + ((code % 7) - 3) * 0.025), o = ac.createOscillator(), g = ac.createGain();
  o.type = 'square'; o.frequency.value = f;
  g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.13, now + 0.003); g.gain.setValueAtTime(0.13, now + 0.032); g.gain.linearRampToValueAtTime(0, now + 0.05);
  o.connect(g); g.connect(VN.master); o.start(now); o.stop(now + 0.06);
}
/* 글자마다 찍히는 때 — 띄어쓰기는 반, 줄바꿈은 0.1초 */
function vnTimes(text){ const ch = Array.from(text), tt = []; let t = 0.06; for (const c of ch){ tt.push(t); t += c === ' ' ? 0.5 / VN.cps : c === '\n' ? 0.1 : 1 / VN.cps; } return { ch, tt, dur:t }; }
function vnBuild(){
  const el = document.createElement('div'); el.id = 'vn'; el.className = 'vn'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', '세희와 대화');
  el.innerHTML = `<div class="vn-dim"></div>
    <div class="vn-who"><img class="vn-spr a" alt=""><img class="vn-spr b" alt=""></div>
    <div class="vn-choices" hidden></div>
    <div class="vn-box"><b class="vn-name"></b><p class="vn-text" aria-live="polite"></p><i class="vn-tri" aria-hidden="true"></i></div>`;
  document.body.appendChild(el); return el;
}
async function scenePlay(lines, o){
  o = o || {}; if (!lines || !lines.length) return 'done';
  const reuse = !!(VN.el && o.cont);   /* cont: 열린 장면에 이어서(고른 뒤 한마디) */
  if (VN.el && !reuse) return 'busy';   /* 한 번에 한 장면 */
  if (!reuse) await vnPreload();
  const el = VN.el = reuse ? VN.el : vnBuild(), box = el.querySelector('.vn-box'), txt = el.querySelector('.vn-text'), nm = el.querySelector('.vn-name'), tri = el.querySelector('.vn-tri'),
    who = el.querySelector('.vn-who'), sprA = el.querySelector('.vn-spr.a'), sprB = el.querySelector('.vn-spr.b'), chs = el.querySelector('.vn-choices');
  if (o.dim === false) el.classList.add('nodim');
  let front = el.querySelector('.vn-spr.on') || sprA, cur = null;
  const face = ex => { const src = vnSrc(ex); if (front.getAttribute('src') === src) return;
    if (!front.getAttribute('src')){ front.src = src; return; }
    const back = front === sprA ? sprB : sprA; back.src = src; back.classList.add('on'); front.classList.remove('on'); front = back; };
  const motion = m => { if (!m) return; who.classList.remove('m-hop', 'm-shake', 'm-bow'); void who.offsetWidth; who.classList.add('m-' + m); };
  if (!reuse){ sprA.classList.add('on'); requestAnimationFrame(() => el.classList.add('in')); }
  dlog('화면', '장면 열림 — ' + lines.length + '줄');
  let result = 'done';
  for (let i = 0; i < lines.length; i++){
    const L = lines[i], spk = L.who || '강세희', W = VN_WHO[spk] || VN_WHO.강세희;
    if (L.ex) face(L.ex); else if (i === 0) face('안내');
    motion(L.motion);
    nm.textContent = spk; txt.textContent = ''; tri.classList.remove('on'); chs.hidden = true; chs.innerHTML = '';
    const T = vnTimes(String(L.text || '')), t0 = performance.now(); let shown = 0, filled = false;
    cur = await new Promise(resolve => {
      let raf = 0, chosen = false;
      const draw = () => { const dt = (performance.now() - t0) / 1000; let n = filled ? T.ch.length : 0; if (!filled) while (n < T.tt.length && T.tt[n] <= dt) n++;
        if (n > shown){ const nw = T.ch.slice(shown, n); if (!filled && n - shown <= 3 && nw.some(c => c.trim() && !'.,!?…~'.includes(c))) vnBlip(W.pitch, nw[nw.length - 1]); txt.textContent = T.ch.slice(0, n).join(''); shown = n; }
        if (shown >= T.ch.length){ done(); return; } raf = requestAnimationFrame(draw); };
      const done = () => { cancelAnimationFrame(raf); txt.textContent = T.ch.join(''); shown = T.ch.length;
        if (L.choices && L.choices.length){ if (!chs.hidden) return; chs.innerHTML = L.choices.map((c, k) => `<button class="vn-c" data-k="${k}">${esc(c.t)}</button>`).join(''); chs.hidden = false;
          const b0 = chs.querySelector('button'); if (b0) b0.focus({ preventScroll:true }); }
        else if (o.auto && i === lines.length - 1){ setTimeout(() => finish(null), o.auto === true ? 700 : o.auto); }   /* auto: 마지막 줄은 다 나오면 저절로 */
        else tri.classList.add('on'); };
      const tap = e => { if (e && e.target.closest && e.target.closest('.vn-choices')) return; vnAudio();
        if (shown < T.ch.length){ filled = true; done(); return; }
        if (L.choices && L.choices.length) return;   /* 골라야 넘어감 */
        finish(null); };
      const pick = e => { const b = e.target.closest('.vn-c'); if (!b || chosen) return; chosen = true; vnAudio(); const c = L.choices[Number(b.dataset.k)]; b.classList.add('on'); setTimeout(() => finish(c), 120); };
      const key = e => { if (e.key === ' ' || e.key === 'Enter'){ if (document.activeElement && document.activeElement.closest && document.activeElement.closest('.vn-choices')) return; e.preventDefault(); tap(e); } };
      const finish = c => { el.removeEventListener('pointerup', tap); chs.removeEventListener('click', pick); document.removeEventListener('keydown', key, true); cancelAnimationFrame(raf); resolve(c); };
      el.addEventListener('pointerup', tap); chs.addEventListener('click', pick); document.addEventListener('keydown', key, true);
      raf = requestAnimationFrame(draw);
    });
    if (cur){ result = cur.v !== undefined ? cur.v : cur.t; dlog('화면', '장면 고름 — ' + cur.t); if (L.end !== false) break; }
  }
  if (!o.keep) await sceneClose();
  return result;
}
/* 닫기 — 어둠·세희·대화창이 같이 빠짐. keep 으로 연 장면은 할 일을 마친 뒤 직접 닫는다 */
async function sceneClose(){ const el = VN.el; if (!el) return; el.classList.remove('in'); el.classList.add('out'); await new Promise(r => setTimeout(r, 320)); el.remove(); VN.el = null; }
/* 대화창에 한 줄만 바꿔 쓰기(장면을 연 채로 — 업데이트하는 중… 같은 것) */
function sceneSay(text, ex){ const el = VN.el; if (!el) return; if (ex){ const f = el.querySelector('.vn-spr.on'); if (f) f.src = vnSrc(ex); } el.querySelector('.vn-text').textContent = text; el.querySelector('.vn-tri').classList.remove('on'); el.querySelector('.vn-choices').hidden = true; }

/* ── 대본 ── 세희 말투: 비서답게 공손하지만 딱딱하지 않게 */
const SCENES = {
  update:[
    { ex:'안내', text:'어서 오세요, 보스. 자리를 비우신 사이에 사내 규정이 일부 바뀌었습니다.' },
    { ex:'설명', text:'바로 적용하시겠어요?', choices:[{ t:'예', v:'yes' }, { t:'구버전으로 계속', v:'no' }] },
  ],
  updateYes:[{ ex:'검토', text:'네, 바로 적용하겠습니다. 잠깐이면 돼요.' }],
  updateNo:[{ ex:'고민', motion:'bow', text:'알겠습니다. 오늘은 지금 규정대로 가요. 다음에 오시면 다시 여쭐게요.' }],
};
