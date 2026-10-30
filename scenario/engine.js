/* engine.js v1.0 — (v1.0) 시나리오 편집기의 재생 엔진. 3D 게임 대사 실험장 (cave-3d/src/stage.js v1.0) 에서 떼어 냄
   ■ 1920 × 1080 투명 캔버스: 골반까지 나오는 스탠딩 + 대사창 (art/box.webp) · 한 자씩 찍히는 글 + 전자음 · 투명 배경 webm 녹화
   ■ 진행 = '박자 시작 시각' 목록 → 같은 박자로 다시 돌려 녹화할 수 있음
   ■ 인물 그림은 편집기가 ENG.cast 로 넣음: 이름 → { look, pitch, size, dx, dy, ex: { 표정: { img, fw, fh, n, cols, fps, crop, scale, dx, dy, look } } }
   ■ ENG.inspect = { nm, ex } 이면 그 인물 · 표정만 세워 보여 줌 (인물 칸에서 그림 맞출 때) */
'use strict';
const ENG = { W: 1920, H: 1080, cv: null, cx: null, box: null, cast: {}, beats: [], warn: [], opt: null, tl: null, lastTake: null, mode: 'live', rec: null, lastFile: null,
  ac: null, master: null, recDest: null, blipBeat: -1, blipN: 0, lastBlip: 0, oc: {}, zc: 0, cw: {}, inspect: null, onHint: null, onRec: null, onBeat: null, lastCur: -2 };
const ENG_SLOT = { 왼쪽: 400, 왼쪽2: 720, 가운데: 960, 오른쪽2: 1200, 오른쪽: 1520 };
const ENG_BOX = { src: 'art/box.webp', w: 1560, h: 348, x: 180, y: 720, nameX: 267, nameY: 66, nameW: 310, textX: 100, textY: 132, textW: 1290, triX: 1429, triY: 259 };
const ENG_VH = 820;   // 인물 크기 1 일 때 보이는 높이 (머리 ~ 자른 곳)
const ENG_OPT0 = () => ({ 속도: 30, 어둡기: 0.55, 글자크기: 48, 줄간격: 58, 글자색: '#2b2420', 이름색: '#f1e8d8', 글자그림자: null, 이름그림자: null, 창그림자: [0, 10, 26, 'rgba(0,0,0,0.45)'], 인물그림자: null,
  소리: true, 소리크기: 0.5, 주인공: '인주', 인물크기: 1, 등장: 0.45, 퇴장: 0.35, 녹화fps: 30 });
const engNow = () => performance.now() / 1000;
const engClamp = v => Math.max(0, Math.min(1, v));
const engOut = k => 1 - Math.pow(1 - k, 3);
const engIn = k => k * k * k;
const engName = w => { w = (w || '').trim(); return w === '주인공' ? ENG.opt.주인공 : w; };

/* ---------- 글 대본 읽기 (글로 보기 · 붙여 넣기) ---------- */
function engParse(txt){
  const beats = [], warn = [], opt = {}; let cmds = [];
  txt.split(/\r?\n/).forEach((raw, i) => {
    const s = raw.trim(), at = `${i + 1}줄`; if (!s || s.startsWith('//') || s.startsWith('#')) return;
    let m;
    if (/^\[.*\]$/.test(s)){ const c = engCmd(s.slice(1, -1).trim(), at, warn); if (c && c.k === 'rest'){ beats.push({ cmds, line: null }); cmds = []; } else if (c) cmds.push(c); return; }
    if ((m = /^설정\s+(\S+)\s*(.*)$/.exec(s))){ engSet(opt, m[1], m[2].trim(), at, warn); return; }
    if (/^인물\s+\S+/.test(s) && !/[:：]/.test(s)){ warn.push(`${at}: 인물 줄은 오른쪽 '인물' 칸에서 고쳐요 (건너뜀)`); return; }
    let who = null, ex = null, text = s;
    if ((m = /^([^:：\[\]()]{0,24}?)\s*(?:\(([^)]*)\))?\s*[:：]\s*(.*)$/.exec(s))){ who = m[1].trim() || null; ex = (m[2] || '').trim() || null; text = m[3]; }
    beats.push({ cmds, line: { who, ex, text: text.replace(/\s*\|\s*/g, '\n') } }); cmds = [];
  });
  if (cmds.length) beats.push({ cmds, line: null });
  return { beats, warn, opt };
}
function engCmd(s, at, warn){
  const w = s.split(/\s+/), k = w[0], rest = w.slice(1), slot = rest.find(x => ENG_SLOT[x]), oth = rest.slice(1).filter(x => !ENG_SLOT[x]);
  if (k === '멈춤' || k === '쉼') return { k: 'rest' };
  if (k === '모두퇴장') return { k: 'out', who: '모두' };
  if (!rest[0]){ warn.push(`${at}: [${s}] — 누구인지 이름이 없음`); return null; }
  if (k === '등장') return { k: 'in', who: rest[0], slot, ex: oth[0] };
  if (k === '퇴장') return { k: 'out', who: rest[0] };
  if (k === '표정') return { k: 'ex', who: rest[0], ex: oth[0] || '기본' };
  if (k === '이동'){ if (!slot){ warn.push(`${at}: [${s}] — 자리가 없음 (왼쪽 · 왼쪽2 · 가운데 · 오른쪽2 · 오른쪽)`); return null; } return { k: 'move', who: rest[0], slot }; }
  if (k === '흔들' || k === '흔들기') return { k: 'shake', who: rest[0] };
  if (k === '깡충' || k === '점프') return { k: 'hop', who: rest[0] };
  warn.push(`${at}: [${s}] — 모르는 연출 (등장 · 퇴장 · 표정 · 이동 · 흔들 · 깡충 · 멈춤)`); return null;
}
function engShadow(v){ if (!v || v === '없음' || v === '끄기') return null; const w = v.split(/\s+/); if (w.length < 4 || w.slice(0, 3).some(x => isNaN(+x))) return undefined; return [+w[0], +w[1], +w[2], w.slice(3).join(' ')]; }
function engSet(opt, key, val, at, warn){
  const num = ['속도', '어둡기', '글자크기', '줄간격', '소리크기', '인물크기', '등장', '퇴장', '녹화fps'];
  if (num.includes(key)){ const n = parseFloat(val); if (isNaN(n)) warn.push(`${at}: 설정 ${key} — 숫자가 아님`); else opt[key] = key === '녹화fps' ? (n >= 45 ? 60 : 30) : n; return; }
  if (key === '글자색' || key === '이름색'){ if (val) opt[key] = val; return; }
  if (/그림자$/.test(key) && key in ENG_OPT0()){ const s = engShadow(val); if (s === undefined) warn.push(`${at}: 설정 ${key} — '옆 아래 번짐 색' 꼴로 (예: 0 2 4 rgba(0,0,0,.4))`); else opt[key] = s; return; }
  if (key === '소리'){ opt.소리 = !/끄|없|off/.test(val); return; }
  if (key === '주인공'){ if (val) opt.주인공 = val; return; }
  warn.push(`${at}: 모르는 설정 '${key}'`);
}
// 글자가 찍히는 때 (박자 시작부터 초). 말줄임 · 마침표 · 쉼표 뒤엔 조금 쉼
function engPrep(L){
  const ch = Array.from(L.text), cps = Math.max(2, ENG.opt.속도), tt = []; let t = 0.06;
  for (let i = 0; i < ch.length; i++){
    tt.push(t); const c = ch[i], nx = ch[i + 1];
    t += c === ' ' ? 0.5 / cps : c === '\n' ? 0.1 : 1 / cps;
    if (c === '…' && nx !== '…') t += 0.28; else if ('.!?'.includes(c) && !'.!?'.includes(nx || '')) t += 0.18; else if (',~'.includes(c)) t += 0.08;
  }
  L.ch = ch; L.tt = tt; L.dur = t; L.rows = null;
}
const engCount = (L, dt, filled) => { if (filled) return L.ch.length; let n = 0; while (n < L.tt.length && L.tt[n] <= dt) n++; return n; };
// 장면 바꾸기: 박자 · 설정이 바뀌면 다시 준비 (진행은 그대로 두되 박자 수를 넘으면 맞춤)
function engSetScene(beats, opt){
  ENG.beats = beats; ENG.opt = Object.assign(ENG_OPT0(), opt || {});
  if (ENG.master) ENG.master.gain.value = ENG.opt.소리크기;
  for (const b of beats) if (b.line) engPrep(b.line);
  if (!ENG.tl) engReset(0, false);
  const cur = ENG.tl.base + ENG.tl.starts.length - 1; if (cur >= beats.length) engReset(0, false);
}

/* ---------- 박자 (Space) ---------- */
function engReset(base, startNow){ ENG.tl = { base, starts: startNow ? [engNow()] : [], fills: {}, end: null }; if (startNow) ENG.lastTake = ENG.tl; ENG.blipBeat = -1; }
// i 번째 박자를 바로 보여 줌 (편집 중 카드를 누를 때). fill = 글을 한 번에
function engJump(i, fill){ if (ENG.mode === 'replay') return; i = Math.max(0, Math.min(ENG.beats.length - 1, i)); engReset(i, true); if (fill) ENG.tl.fills[i] = engNow(); ENG.blipBeat = i; ENG.blipN = 1e9; }
function engNext(){
  if (ENG.mode === 'replay' || !ENG.beats.length) return;
  const t = engNow(), tl = ENG.tl, n = tl.starts.length, cur = tl.base + n - 1;
  if (!n){ tl.starts.push(t); ENG.lastTake = tl; return; }
  const L = ENG.beats[cur] && ENG.beats[cur].line;
  if (L && !(tl.fills[cur] <= t) && t - tl.starts[n - 1] < L.dur){ tl.fills[cur] = t; return; }
  if (cur + 1 < ENG.beats.length){ tl.starts.push(t); return; }
  if (tl.end == null) tl.end = t;
  if (ENG.rec && ENG.rec.live) engRecStop(0.4); else engHint('끝 — R 처음부터 · ← 한 박자 뒤로');
}
function engBack(){ if (ENG.mode === 'replay') return; const tl = ENG.tl, cur = tl.base + tl.starts.length - 1; engReset(Math.max(0, cur - 1), true); }
function engTakeEnd(tl){ if (tl.end != null) return tl.end; const i = tl.base + tl.starts.length - 1, L = ENG.beats[i] && ENG.beats[i].line; return tl.starts[tl.starts.length - 1] + (L ? L.dur : 0) + 1.2; }
const engCur = () => ENG.tl ? ENG.tl.base + ENG.tl.starts.length - 1 : -1;

/* ---------- 장면: 시각 t 의 인물 상태 ---------- */
function engScene(t){
  const tl = ENG.tl, B = ENG.beats, cur = tl.base + tl.starts.length - 1, C = {}; ENG.zc = 0;
  const T = i => (i < tl.base ? -1e9 : tl.starts[i - tl.base]);
  for (let i = 0; i <= cur && i < B.length; i++){
    const b = B[i], Ti = T(i);
    for (const c of b.cmds) engApply(C, c, Ti);
    const L = b.line, nm = L && L.who && engName(L.who);
    if (nm && ENG.cast[nm]){ const o = C[nm]; if (!o || o.outT != null) engApply(C, { k: 'in', who: nm }, Ti); if (L.ex) engApply(C, { k: 'ex', who: nm, ex: L.ex }, Ti); }
  }
  return { C, cur, start: cur >= tl.base ? T(cur) : null };
}
const engX = (o, t) => { if (o.mvFrom == null) return o.x; const k = engClamp((t - o.mvT) / 0.45), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; return o.mvFrom + (o.x - o.mvFrom) * e; };
const engSlotOf = (nm, used) => { const order = nm === engName(ENG.opt.주인공) ? ['오른쪽', '오른쪽2', '가운데'] : ['왼쪽', '왼쪽2', '오른쪽2', '가운데', '오른쪽']; return order.find(s => !used.has(s)) || order[0]; };
function engApply(C, c, T){
  if (c.k === 'out' && c.who === '모두'){ for (const k in C) if (C[k].outT == null) C[k].outT = T; return; }
  const nm = engName(c.who);
  if (c.k === 'in'){
    if (!ENG.cast[nm]) return;
    const used = new Set(Object.values(C).filter(o => o.outT == null && o.nm !== nm).map(o => o.slot)), slot = c.slot || engSlotOf(nm, used), prev = C[nm];
    C[nm] = { nm, slot, x: ENG_SLOT[slot], inT: T, outT: null, ex: c.ex || (prev && prev.outT == null ? prev.ex : '기본'), exPrev: null, exT: -1e9, shakeT: -1e9, hopT: -1e9, mvFrom: null, mvT: -1e9, z: ++ENG.zc };
    return;
  }
  const o = C[nm]; if (!o || o.outT != null) return;
  if (c.k === 'out') o.outT = T;
  else if (c.k === 'ex'){ if (c.ex !== o.ex){ o.exPrev = o.ex; o.ex = c.ex; o.exT = T; } }
  else if (c.k === 'move'){ o.mvFrom = engX(o, T); o.x = ENG_SLOT[c.slot]; o.slot = c.slot; o.mvT = T; }
  else if (c.k === 'shake') o.shakeT = T;
  else if (c.k === 'hop') o.hopT = T;
}

/* ---------- 그리기 ---------- */
const engShadowSet = (cx, s) => { if (s){ cx.shadowOffsetX = s[0]; cx.shadowOffsetY = s[1]; cx.shadowBlur = s[2]; cx.shadowColor = s[3]; } else { cx.shadowColor = 'rgba(0,0,0,0)'; cx.shadowBlur = 0; cx.shadowOffsetX = cx.shadowOffsetY = 0; } };
function engDraw(t){
  const cx = ENG.cx, opt = ENG.opt; cx.clearRect(0, 0, ENG.W, ENG.H);
  if (ENG.inspect) return engDrawInspect(t);
  const B = ENG.beats, tl = ENG.tl, S = engScene(t), cur = S.cur, b = B[cur], L = b && b.line;
  if (cur < tl.base) return null;
  const lvl = (i, nm) => { const l = B[i] && B[i].line; if (!l) return 1; return l.who && engName(l.who) === nm ? 1 : opt.어둡기; };
  const kD = S.start == null ? 1 : engClamp((t - S.start) / 0.22), prevI = cur - 1 >= tl.base ? cur - 1 : cur;
  const spk = L && L.who ? engName(L.who) : null;
  const list = Object.values(S.C).filter(o => o.outT == null || t - o.outT < opt.퇴장).sort((a, c) => (a.nm === spk) - (c.nm === spk) || a.z - c.z);
  for (const o of list) engDrawChar(o, t, lvl(prevI, o.nm) + (lvl(cur, o.nm) - lvl(prevI, o.nm)) * kD);
  const on = L ? 1 : 0, pOn = B[prevI] && B[prevI].line ? 1 : 0, bA = S.start == null ? on : pOn + (on - pOn) * engClamp((t - S.start) / 0.2);
  const count = L ? engCount(L, t - S.start, tl.fills[cur] <= t) : 0;
  if (bA > 0.003) engDrawBox(t, L, bA, count);
  return { cur, L, count };
}
function engDrawBox(t, L, bA, count){
  if (!ENG.box) return; const cx = ENG.cx, opt = ENG.opt, X = ENG_BOX.x, Y = ENG_BOX.y;
  cx.save(); cx.globalAlpha = bA; engShadowSet(cx, opt.창그림자); cx.drawImage(ENG.box, X, Y, ENG_BOX.w, ENG_BOX.h); cx.restore();
  if (!L) return;
  cx.save(); cx.globalAlpha = bA;
  if (L.who){ let fs = opt.글자크기; cx.font = `${fs}px GalmuriMono11, monospace`; const nw = cx.measureText(L.who).width; if (nw > ENG_BOX.nameW) fs = Math.max(24, Math.floor(fs * ENG_BOX.nameW / nw / 12) * 12 || 24);
    cx.font = `${fs}px GalmuriMono11, monospace`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillStyle = opt.이름색; engShadowSet(cx, opt.이름그림자); cx.fillText(L.who, X + ENG_BOX.nameX, Y + ENG_BOX.nameY); }
  cx.textAlign = 'left'; cx.textBaseline = 'top'; cx.font = `${opt.글자크기}px GalmuriMono11, monospace`; cx.fillStyle = opt.글자색; engShadowSet(cx, opt.글자그림자);
  if (!L.rows) L.rows = engWrap(cx, L.ch, ENG_BOX.textW);
  L.rows.forEach((r, i) => { const e = Math.min(r[1], count); if (e > r[0]) cx.fillText(L.ch.slice(r[0], e).join(''), X + ENG_BOX.textX, Y + ENG_BOX.textY + i * opt.줄간격); });
  if (count >= L.ch.length){ const ty = Y + ENG_BOX.triY + Math.sin(t * 5) * 3, tx = X + ENG_BOX.triX; engShadowSet(cx, null); cx.fillStyle = '#141010'; cx.beginPath(); cx.moveTo(tx - 17, ty); cx.lineTo(tx + 17, ty); cx.lineTo(tx, ty + 26); cx.closePath(); cx.fill(); }
  cx.restore();
}
// 인물 칸: 고른 인물 · 표정만 세워 보여 줌 (말하는 모습 · 대사창 함께)
function engDrawInspect(t){
  const I = ENG.inspect, nm = I.nm; if (!ENG.cast[nm]) return null;
  const slot = engSlotOf(nm, new Set()), o = { nm, slot, x: ENG_SLOT[slot], inT: -1e9, outT: null, ex: I.ex || '기본', exPrev: null, exT: -1e9, shakeT: -1e9, hopT: -1e9, mvFrom: null, mvT: -1e9, z: 0 };
  engDrawChar(o, t, 1);
  const L = { who: nm, text: I.text || `(${o.ex})` }; engPrep(L); engDrawBox(t, L, 1, L.ch.length);
  return null;
}
// 줄 나누기: 낱말 단위로, 한 낱말이 너무 길면 글자 단위로. [시작, 끝) 목록
function engWrap(cx, ch, maxW){
  const wOf = c => ENG.cw[cx.font + c] ?? (ENG.cw[cx.font + c] = cx.measureText(c).width);
  const rows = []; let s = 0, w = 0, sp = -1;
  for (let i = 0; i < ch.length; i++){
    const c = ch[i];
    if (c === '\n'){ rows.push([s, i]); s = i + 1; w = 0; sp = -1; continue; }
    w += wOf(c); if (c === ' ') sp = i;
    if (w > maxW && i > s){ const cut = sp > s ? sp : i; rows.push([s, cut]); s = cut + (ch[cut] === ' ' ? 1 : 0); w = 0; sp = -1; for (let j = s; j <= i; j++){ w += wOf(ch[j]); if (ch[j] === ' ') sp = j; } }
  }
  rows.push([s, ch.length]); return rows;
}
// 한 표정 그림이 화면에 놓이는 자리 (인물 칸에서 끌어 옮길 때도 씀)
function engPlace(nm, E, x){
  const c = ENG.cast[nm], fw = E.fw || E.img.width, fh = E.fh || E.img.height, crop = E.crop || 1, srcH = fh * crop;
  const k = ENG_VH * ENG.opt.인물크기 * (c.size || 1) * (E.scale || 1) / srcH, dw = Math.round(fw * k), dh = Math.round(srcH * k);
  return { fw, fh, srcH, dw, dh, x: Math.round(x - dw / 2 + (c.dx || 0) + (E.dx || 0)), y: Math.round(ENG.H - dh + (c.dy || 0) + (E.dy || 0)) };
}
function engDrawChar(o, t, br){
  const cast = ENG.cast[o.nm]; if (!cast) return;
  const opt = ENG.opt, eIn = engOut(engClamp((t - o.inT) / opt.등장)), eOut = o.outT == null ? 0 : engIn(engClamp((t - o.outT) / opt.퇴장));
  const x = engX(o, t), side = x < 960 ? -1 : 1, alpha = eIn * (1 - eOut); if (alpha < 0.003) return;
  let ox = side * 140 * ((1 - eIn) + eOut), oy = 0;
  const ds = t - o.shakeT; if (ds >= 0 && ds < 0.4) ox += Math.sin(ds * 70) * 14 * (1 - ds / 0.4);
  const dh = t - o.hopT; if (dh >= 0 && dh < 0.34) oy -= Math.sin(Math.PI * dh / 0.34) * 34;
  const want = x <= 960 ? 'R' : 'L', kx = engClamp((t - o.exT) / 0.16), layers = o.exPrev && kx < 1 ? [[o.exPrev, 1], [o.ex, kx]] : [[o.ex, 1]];
  layers.forEach(([ex, la], li) => {
    const E = cast.ex[ex] || cast.ex['기본'] || Object.values(cast.ex)[0]; if (!E || !E.img || !(E.img.width > 0)) return;
    const P = engPlace(o.nm, E, x), flip = (E.look || cast.look || 'R') !== want;
    let sx = 0, sy = 0; if (E.n > 1){ const fi = Math.floor(t * (E.fps || 8)) % E.n, cols = E.cols || E.n; sx = (fi % cols) * P.fw; sy = Math.floor(fi / cols) * P.fh; }
    const oc = ENG.oc[o.nm + '|' + li] || (ENG.oc[o.nm + '|' + li] = document.createElement('canvas'));
    if (oc.width !== P.dw || oc.height !== P.dh){ oc.width = P.dw; oc.height = P.dh; }
    const g = oc.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, P.dw, P.dh); g.imageSmoothingQuality = 'high';
    if (flip) g.setTransform(-1, 0, 0, 1, P.dw, 0);
    g.drawImage(E.img, sx, sy, P.fw, P.srcH, 0, 0, P.dw, P.dh); g.setTransform(1, 0, 0, 1, 0, 0);
    if (br < 0.999){ g.globalCompositeOperation = 'source-atop'; g.fillStyle = `rgba(0,0,0,${(1 - br).toFixed(3)})`; g.fillRect(0, 0, P.dw, P.dh); g.globalCompositeOperation = 'source-over'; }
    const cx = ENG.cx; cx.save(); cx.globalAlpha = alpha * la; engShadowSet(cx, opt.인물그림자);
    cx.drawImage(oc, P.x + Math.round(ox), P.y + Math.round(oy)); cx.restore();
  });
}

/* ---------- 전자음 (뚜두두두) — 녹화에도 들어감 ---------- */
function engAudio(){
  if (ENG.ac){ if (ENG.ac.state === 'suspended') ENG.ac.resume(); return ENG.ac; }
  try { const ac = ENG.ac = new (window.AudioContext || window.webkitAudioContext)(); ENG.master = ac.createGain(); ENG.master.gain.value = ENG.opt ? ENG.opt.소리크기 : 0.5; ENG.master.connect(ac.destination); ENG.recDest = ac.createMediaStreamDestination(); ENG.master.connect(ENG.recDest); } catch (e) {}
  return ENG.ac;
}
function engBlip(pitch, c){
  const ac = ENG.ac; if (!ac || !ENG.opt.소리) return; const now = ac.currentTime; if (now - ENG.lastBlip < 0.028) return; ENG.lastBlip = now;
  const code = (c || 'a').codePointAt(0), f = pitch * (1 + ((code % 7) - 3) * 0.025), o = ac.createOscillator(), g = ac.createGain();
  o.type = 'square'; o.frequency.value = f;
  g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.13, now + 0.003); g.gain.setValueAtTime(0.13, now + 0.032); g.gain.linearRampToValueAtTime(0, now + 0.05);
  o.connect(g); g.connect(ENG.master); o.start(now); o.stop(now + 0.06);
}
function engSound(fr){
  if (!fr || !fr.L){ ENG.blipBeat = fr ? fr.cur : -1; ENG.blipN = 0; return; }
  if (ENG.blipBeat !== fr.cur){ ENG.blipBeat = fr.cur; ENG.blipN = 0; }
  if (fr.count > ENG.blipN){
    const nw = fr.L.ch.slice(ENG.blipN, fr.count), cast = fr.L.who && ENG.cast[engName(fr.L.who)];
    if (fr.count - ENG.blipN <= 3 && nw.some(c => c.trim() && !'.,!?…~'.includes(c))) engBlip((cast && cast.pitch) || (fr.L.who ? 520 : 440), nw[nw.length - 1]);
    ENG.blipN = fr.count;
  } else if (fr.count < ENG.blipN && ENG.blipN < 1e9) ENG.blipN = fr.count;
}
const engPreview = pitch => { engAudio(); const ac = ENG.ac; if (!ac) return; const s = '뚜두두두'; [...s].forEach((c, i) => setTimeout(() => { ENG.lastBlip = 0; const o = ENG.opt.소리; ENG.opt.소리 = true; engBlip(pitch, c); ENG.opt.소리 = o; }, i * 70)); };

/* ---------- 녹화 (투명 webm) ---------- */
function engRecStart(replay){
  if (ENG.rec) return false;
  if (typeof MediaRecorder === 'undefined' || !ENG.cv.captureStream){ engHint('이 브라우저는 녹화를 못 해요 (크롬 · 엣지에서)'); return false; }
  if (replay && !(ENG.lastTake && ENG.lastTake.starts.length)){ engHint('먼저 Space 로 한 번 진행해 주세요'); return false; }
  engAudio(); ENG.inspect = null;
  const tracks = ENG.cv.captureStream(ENG.opt.녹화fps).getVideoTracks(); if (ENG.opt.소리 && ENG.recDest) tracks.push(...ENG.recDest.stream.getAudioTracks());
  const mt = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
  let mr; try { mr = new MediaRecorder(new MediaStream(tracks), { mimeType: mt, videoBitsPerSecond: 16e6, audioBitsPerSecond: 160000 }); } catch (e){ engHint('녹화를 시작하지 못했어요'); return false; }
  const r = ENG.rec = { mr, chunks: [], t0: engNow(), live: !replay };
  mr.ondataavailable = e => { if (e.data && e.data.size) r.chunks.push(e.data); };
  mr.onstop = () => engRecSave(r);
  if (replay){ const tk = ENG.lastTake, sh = engNow() + 0.6 - tk.starts[0], end = engTakeEnd(tk);
    ENG.tl = { base: tk.base, starts: tk.starts.map(v => v + sh), fills: Object.fromEntries(Object.entries(tk.fills).map(([k, v]) => [k, v + sh])), end: end + sh };
    ENG.mode = 'replay'; r.until = end + sh + 0.6; ENG.blipBeat = -1; }
  else engReset(0, false);
  mr.start(1000); ENG.onRec && ENG.onRec(true);
  engHint(replay ? '방금 진행 그대로 녹화 중 — 끝나면 저절로 저장' : '녹화 중 — Space 로 시작 · 마지막 대사 뒤 Space (또는 Esc) 로 끝');
  return true;
}
function engRecStop(delay){ const r = ENG.rec; if (!r || r.stopping) return; r.stopping = true; setTimeout(() => { try { r.mr.stop(); } catch (e) {} }, (delay || 0) * 1000); }
async function engRecSave(r){
  ENG.rec = null; if (ENG.mode === 'replay'){ ENG.mode = 'live'; engReset(0, false); }
  let blob = new Blob(r.chunks, { type: 'video/webm' }); const ms = (engNow() - r.t0) * 1000;
  try { if (window.ysFixWebmDuration) blob = await window.ysFixWebmDuration(blob, ms, { logger: false }); } catch (e) {}
  const d = new Date(), p = n => String(n).padStart(2, '0');
  ENG.lastFile = { blob, name: `scenario_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.webm` };
  ENG.onRec && ENG.onRec(false); await engDownload(ENG.lastFile.blob, ENG.lastFile.name);
}
async function engDownload(blob, name){
  try {
    const dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null;
    if (dl){ await dl.save({ filename: name, data: blob }); engHint(`저장했어요 — ${name}`); return; }
  } catch (e){ const c = e && e.code; if (c === 'declined') return engHint('저장을 그만뒀어요 — ⬇ 로 다시'); if (c === 'rate_limited') return engHint('잠시 뒤 ⬇ 로 다시'); if (c === 'too_large') return engHint('파일이 너무 커요 — 나눠서 녹화해 주세요'); return engHint('이 화면에선 저장할 수 없어요'); }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000); engHint(`저장 — ${name}`);
}
const engHint = msg => { ENG.onHint && ENG.onHint(msg); };

/* ---------- 시작 · 돌기 ---------- */
async function engInit(cv){
  ENG.cv = cv; ENG.cx = cv.getContext('2d'); ENG.opt = ENG_OPT0(); engReset(0, false);
  const font = (async () => { try { const f = new FontFace('GalmuriMono11', 'url(art/GalmuriMono11.woff2)'); await f.load(); document.fonts.add(f); } catch (e) {} })();
  const box = new Promise(res => { const im = new Image(); im.onload = () => { ENG.box = im; res(); }; im.onerror = res; im.src = ENG_BOX.src; });
  await Promise.all([font, box]);
  const loop = () => {
    requestAnimationFrame(loop);
    const t = engNow(); if (ENG.rec && ENG.mode === 'replay' && t >= ENG.rec.until) engRecStop(0);
    let fr = null; try { fr = engDraw(t); } catch (e){ if (!ENG.drawErr){ ENG.drawErr = 1; console.error(e); } }
    if (!ENG.inspect) engSound(fr);
    const cur = engCur(); if (cur !== ENG.lastCur){ ENG.lastCur = cur; ENG.onBeat && ENG.onBeat(cur); }
  };
  requestAnimationFrame(loop);
}
