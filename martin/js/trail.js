/* martin/js/trail.js — 행동 기록 자세히 (v0.13.2, 11-17 A). 고칠 땐 이 줄 아래에 「11-17 B: …」처럼 날짜·방 주석
   보스: 행동 로그에 어느 사진을 눌렀는지가 없다 — 무엇을 누르고 무엇을 확대했는지 남아야 흐름이 보인다. 사진 정보도 같이 남겨 나중에 참조.
   1) act() 가 부를 때마다 id 들을 이름표로 풀어 붙인다(actRefs) — 카드 이름·종류, 사진이면 자료함 id·파일 이름·크기, 어디서 눌렀나(판·대화창·자료함…).
   2) 판·사진의 확대·축소·굴림을 손짓이 끝난 뒤 한 줄로 — 판은 몇 배에서 몇 배로, 그때 화면 가운데 보이던 카드들. 사진은 맞춤의 몇 배, 사진의 어느 부분(가로·세로 %, 위쪽·가운데…).
      view.js 의 손짓 코드는 안 건드리고 같은 자리에서 손짓이 끝나는 것만 듣는다.
   3) 기록 「행동」 탭에 자세한 줄(actDetail), 마틴 프롬프트에 「지난 네 말 뒤 동료가 한 일」(trailText). */
const TRAIL = { src:null, g:null, gt:0, pv:null, pg:false, pt:0 };
const trCut = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
function refOf(id){
  const n = typeof itemOf === 'function' ? itemOf(id) : nodeOf(id); if (!n) return { id };
  const isEv = /^e\d+$/.test(id), ev = isEv ? n : (typeof evByCard === 'function' ? evByCard(id) : null);
  const r = { id, title:trCut(isEv ? evTitle(n) : n.title, 40), kind:isEv ? (n.kind === 'photo' ? '자료 사진' : '자료 글') : (KINDS[n.kind] || n.kind) };
  if (!isEv && S.suspect === id) r.suspect = 1;
  if (isEv && n.card) r.card = n.card;
  if (ev){ r.ev = ev.id; if (ev.name) r.file = trCut(ev.name, 40); if (ev.len) r.chars = ev.len; if (ev.turn) r.got = ev.turn; r.read = ev.read ? 1 : 0; }
  return r;
}
/* act(what, more) 에서 — 더할 것만 돌려준다 */
function actRefs(more){
  const ids = []; const add = v => { for (const x of String(v || '').split(/[\s,]+/)) if (/^[a-z]\d+$/.test(x) && !ids.includes(x)) ids.push(x); };
  add(more.id); add(more.ev); if (Array.isArray(more.ids)) more.ids.forEach(add); if (typeof more.from === 'string') add(more.from); add(more.on);
  const o = {}; if (ids.length) o.refs = ids.slice(0, 8).map(refOf);
  if (TRAIL.src && Date.now() - TRAIL.src.t < 1200 && !more.where) o.where = TRAIL.src.where;
  return ids.length || o.where ? o : null;
}
/* 어디서 눌렀나 — 판·대화창·서랍… (누름이 시작될 때, 다른 손잡이보다 먼저) */
document.addEventListener('pointerdown', e => { const t = e.target, c = s => t.closest && t.closest(s);
  const w = c('#pvTalk') ? '사진 위 대화' : c('#pv') ? '사진 크게 보기' : c('#nodes') ? '판' : c('#board') ? '판 빈 곳' : c('#chat') ? '대화창' : c('#nb') ? '수첩' : c('#pzm') ? '난제 지도'
    : c('#sheet') ? '서랍 ' + trCut(($('#sheet h3') || {}).textContent || '', 16) : c('#form') ? '입력줄' : c('header, .top') ? '위 단추' : '';
  TRAIL.src = w ? { where:w.trim(), t:Date.now() } : null; }, true);

/* ── 판: 손짓이 끝나면 확대·축소·굴림 한 줄 ── */
function trView(){ const W = board.clientWidth, H = board.clientHeight; return { x0:cam.x - W / 2 / cam.k, x1:cam.x + W / 2 / cam.k, y0:cam.y - H / 2 / cam.k, y1:cam.y + H / 2 / cam.k }; }
function trSeen(){   /* 지금 화면에 걸쳐 보이는 카드 — 가운데 가까운 것부터 넷 */
  const v = trView(), hw = n => (n.w || 112) / 2, hh = n => (n.h || 130) / 2;
  return S.nodes.filter(n => n.x + hw(n) > v.x0 && n.x - hw(n) < v.x1 && n.y + hh(n) > v.y0 && n.y - hh(n) < v.y1).sort((a, b) => Math.hypot(a.x - cam.x, a.y - cam.y) - Math.hypot(b.x - cam.x, b.y - cam.y)).slice(0, 4).map(n => n.id);
}
const trCam = () => ({ x:cam.x, y:cam.y, k:cam.k });
function trBoardStart(){ if (!TRAIL.g) TRAIL.g = { ...trCam(), card:false }; if (typeof drag !== 'undefined' && drag) TRAIL.g.card = true; }
function trBoardEnd(){ clearTimeout(TRAIL.gt); TRAIL.gt = setTimeout(() => {
  const g = TRAIL.g; if (!g || (typeof pts !== 'undefined' && pts.size)) return; TRAIL.g = null; if (g.card) return;   /* 카드 옮김은 view.js 가 따로 남김 */
  const k = cam.k, dk = k / g.k, dist = Math.hypot(cam.x - g.x, cam.y - g.y) * k, seen = trSeen();
  if (Math.abs(Math.log(dk)) > .05) act(dk > 1 ? '판 확대' : '판 축소', { k:[+g.k.toFixed(2), +k.toFixed(2)], ids:seen });
  else if (dist > 40) act('판 굴림', { px:Math.round(dist), ids:seen });
}, 380); }
board.addEventListener('pointerdown', trBoardStart);
board.addEventListener('pointerup', trBoardEnd); board.addEventListener('pointercancel', trBoardEnd);
board.addEventListener('wheel', () => { trBoardStart(); trBoardEnd(); }, { passive:true });

/* ── 사진 크게 보기: 확대 배율(맞춤 기준)과 보이는 부분 ── */
function trPvArea(){
  const st = $('#pvS'), W = st.clientWidth, H = st.clientHeight; if (!PV.iw || !PV.k) return null;
  const cl = (v, m) => Math.max(0, Math.min(m, v));
  const x0 = cl(-PV.x / PV.k, PV.iw), x1 = cl((W - PV.x) / PV.k, PV.iw), y0 = cl(-PV.y / PV.k, PV.ih), y1 = cl((H - PV.y) / PV.k, PV.ih);
  const p = v => Math.round(v * 100);
  return { x:[p(x0 / PV.iw), p(x1 / PV.iw)], y:[p(y0 / PV.ih), p(y1 / PV.ih)] };
}
function trPvWhere(a){ if (!a) return ''; const cx = (a.x[0] + a.x[1]) / 2, cy = (a.y[0] + a.y[1]) / 2;
  const v = cy < 34 ? '위쪽' : cy > 66 ? '아래쪽' : '가운데', h = cx < 34 ? '왼쪽' : cx > 66 ? '오른쪽' : '가운데';
  return v === h ? '가운데' : v + ' ' + h; }
function trPvState(){ return { id:PV.id, z:PV.k0 ? PV.k / PV.k0 : 1, a:trPvArea() }; }
const pvS_ = $('#pvS');
pvS_.addEventListener('pointerup', () => trPvEnd()); pvS_.addEventListener('pointercancel', () => trPvEnd());
pvS_.addEventListener('wheel', () => trPvEnd(), { passive:true });
function trPvEnd(){ clearTimeout(TRAIL.pt); TRAIL.pt = setTimeout(() => {
  if (PV.pts.size || !$('#pv').classList.contains('on') || !PV.id) return;
  const s = trPvState(), p = TRAIL.pv && TRAIL.pv.id === s.id ? TRAIL.pv : { id:s.id, z:1, a:{ x:[0, 100], y:[0, 100] } };
  if (!s.a) return; TRAIL.pv = s;
  const z = +s.z.toFixed(1), more = { id:s.id, zoom:z, area:s.a, part:trPvWhere(s.a) };
  if (Math.abs(Math.log(s.z / p.z)) > .05) act(s.z <= 1.05 ? '사진 원래 크기로' : s.z > p.z ? '사진 확대' : '사진 축소', more);
  else if (s.z > 1.05){ const m = (a, i) => (a[i][0] + a[i][1]) / 2; if (Math.hypot(m(s.a, 'x') - m(p.a, 'x'), m(s.a, 'y') - m(p.a, 'y')) > 6) act('사진 옮겨 봄', more); }
}, 380); }
/* 사진을 새로 띄우면 기준을 맞춤 상태로 */
new MutationObserver(() => { if (!$('#pv').classList.contains('on')) TRAIL.pv = null; }).observe($('#pv'), { attributes:true, attributeFilter:['class'] });

/* ── 기록 「행동」 탭의 자세한 줄 ── */
function trRefTxt(r, short){ if (short) return `「${r.title || r.id}」(${[r.id, r.ev && r.ev !== r.id ? r.ev : ''].filter(Boolean).join('·')})`; return `「${r.title || r.id}」(${[r.kind, r.suspect ? '용의자' : '', r.id, r.ev && r.ev !== r.id ? '자료 ' + r.ev : '', r.card ? '카드 ' + r.card : '', r.file && r.file !== r.title ? r.file : '', r.chars ? r.chars + '자' : '', r.got ? r.got + '번째 말에 받음' : '', r.ev ? (r.read ? '판독문 있음' : '판독문 없음') : ''].filter(Boolean).join(' · ')})`; }
function trLine(e, short){
  const bits = [];
  if (e.zoom != null) bits.push(`맞춤의 ×${e.zoom}`);
  if (e.area) bits.push(`${e.part ? e.part + ' — ' : ''}가로 ${e.area.x[0]}~${e.area.x[1]}% · 세로 ${e.area.y[0]}~${e.area.y[1]}%`);
  if (e.k) bits.push(`×${e.k[0]} → ×${e.k[1]}`);
  if (e.px) bits.push(`${e.px}px`);
  if (e.to && e.from && Array.isArray(e.from)) bits.push(`(${e.from.join(',')}) → (${e.to.join(',')})`);
  const refs = (e.refs || []).map(r => trRefTxt(r, short)), pre = /^판 (확대|축소|굴림)$/.test(e.act) ? '보이던 것 ' : '';
  return { refs:refs.length ? pre + refs.join(', ') : '', bits:bits.join(' · '), where:e.where || '' };
}
function actDetail(e){ if (e.type !== 'action') return ''; const l = trLine(e);
  return (l.refs ? `<span class="ad">${esc(l.refs)}</span>` : '') + (l.bits ? `<span class="ad">${esc(l.bits)}</span>` : '') + (l.where ? `<span class="ad w">${esc(l.where)}에서</span>` : ''); }

/* ── 마틴에게: 지난 네 말 뒤 동료가 판에서 한 일 ── */
const TR_KEEP = /^(카드 고름|카드 열기|카드 옮김|사진 크게|사진 확대|사진 축소|사진 옮겨 봄|사진 원래 크기로|판 확대|판 축소|자료 열기|판독문 펼침|말에서 카드로|다시 읽혀|자료함 열기|카드 크기)$/;
function trailText(){
  let all = []; try{ all = JSON.parse(localStorage.getItem('drmartin.log') || '[]'); }catch(x){}
  const ms = S.log.filter(l => l.who === 'm'), since = ms.length ? ms[ms.length - 1].at || 0 : 0;
  const a = all.filter(e => e.cid === S.id && e.type === 'action' && e.ts > since && TR_KEEP.test(e.act));
  if (!a.length) return '';
  const tm = e => new Date(e.ts).toTimeString().slice(0, 5);
  const lines = a.slice(-10).map(e => { const l = trLine(e, true); return `- ${tm(e)} ${e.act}${l.refs ? ' ' + l.refs : ''}${l.bits ? ' — ' + l.bits : ''}`; });
  return `\n[지난 네 말 뒤 동료가 판에서 한 일 — 무엇을 눌러 보고 어디를 확대해 봤는지. 동료가 말한 게 아니다]\n${lines.join('\n')}`;
}
