/* stage.js v1.0 — (v1.0, v0.94.1) 대사 실험장 (#stage) — 뮤직비디오 · 게임 설명 영상 · 스토리 모드 대사 실험 (민수)
   ■ 미연시식: 골반까지 나오는 스탠딩 인물 + 아래 대사창 (민수가 준 그림 art/stage/box.webp). 배경은 투명 — 영상에 얹기
   ■ 글 대본을 대본 창 (Tab) 에 붙여 넣고 Space 로 한 박자씩. 글자는 한 자씩 찍히며 '뚜두두' 전자음 (말하는 사람마다 높이가 다름)
   ■ 처음 나올 때 옆에서 스윽 · 말하지 않는 인물은 살짝 어둡게 · 주인공 (인주) 은 기본 오른쪽
   ■ 녹화: 투명 배경 webm (vp9 + 소리). '방금 진행 그대로 녹화' 는 Space 를 누른 박자 그대로 다시 돌려 찍음
   ■ 인물: 지금은 인주 · 모닝스타 · 옐로 (민수). 스탠딩 대화 그림이 오기 전엔 게임 그림을 골반까지 잘라 임시로 세움.
     그림 파일을 화면에 끌어다 놓으면 (이름_표정.png) 그 자리에 바로 들어감 (이 브라우저에 보관)
   ■ 글꼴: 갈무리 모노 11 (GalmuriMono11, OFL — art/stage/Galmuri-OFL.md). 속도 · 어둡기 · 그림자는 대본의 '설정' 줄로
   ■ 대본 쓰는 법: STAGE.md */
'use strict';
const STG = { on: false, W: 1920, H: 1080, cv: null, cx: null, box: null, imgs: {}, cast: {}, user: {}, prefs: {}, tune: {}, beats: [], warn: [], opt: null,
  tl: null, lastTake: null, mode: 'live', rec: null, lastFile: null, ac: null, master: null, recDest: null, blipBeat: -1, blipN: 0, lastBlip: 0, panel: true, bg: 'check', oc: {}, zc: 0, cw: {} };
const STG_SLOT = { 왼쪽: 400, 왼쪽2: 720, 가운데: 960, 오른쪽2: 1200, 오른쪽: 1520 };
// 대사창 그림 (1973 × 440) 을 1560 폭으로. 이름판 · 글 자리 · ▼ 는 그 그림 위 좌표
const STG_BOX = { src: 'art/stage/box.webp', w: 1560, h: 348, x: 180, y: 720, k: 1560 / 1973, nameX: 267, nameY: 66, nameW: 310, textX: 100, textY: 132, textW: 1290, triX: 1429, triY: 259 };
const STG_VH = 820;   // 인물이 보이는 높이 (머리 ~ 골반, 화면 1080 중)
const STG_OPT0 = () => ({ 속도: 30, 어둡기: 0.55, 글자크기: 48, 줄간격: 58, 글자색: '#2b2420', 이름색: '#f1e8d8', 글자그림자: null, 이름그림자: null, 창그림자: [0, 10, 26, 'rgba(0,0,0,0.45)'], 인물그림자: null,
  소리: true, 소리크기: 0.5, 주인공: '인주', 인물크기: 1, 등장: 0.45, 퇴장: 0.35, 녹화fps: 30 });
// 임시 그림 (스탠딩 대화 그림이 오면 바뀜). look = 그림 속 인물이 보는 쪽. crop = 위에서부터 보일 비율 (골반까지)
const STG_CAST0 = {
  인주: { look: 'R', pitch: 560, ex: { 기본: { src: 'assets/inju_idle.png', fw: 211, fh: 354, n: 20, cols: 20, fps: 4.2, crop: 0.47 } } },
  모닝스타: { look: 'R', pitch: 360, ex: { 기본: { src: 'art/h2/mstar/idle.webp', crop: 0.5 } } },
  옐로: { look: 'R', pitch: 780, ex: { 기본: { src: 'art/h2/yellow/idle.webp', crop: 0.48 } } },
};
const STG_DEMO = `// 대사 실험장 예시 대본 v1.0 — Space 로 한 박자씩 (쓰는 법: 아래 '대본 쓰는 법')
// 이름(표정): 대사   ·   [등장 이름 자리]   ·   [퇴장 이름]   ·   [멈춤]
// 자리: 왼쪽 · 왼쪽2 · 가운데 · 오른쪽2 · 오른쪽 (주인공 인주는 기본 오른쪽)
// | 는 줄 바꿈 · 콜론 없는 줄은 나레이션

설정 속도 30
설정 어둡기 0.55

[등장 인주]
[등장 모닝스타]
모닝스타: 어이, 굴의 대장. 오늘도 멀쩡하네?
인주: …또 무슨 일이야.
모닝스타: 심심해서. | 한 판 붙자고, 응?
[흔들 모닝스타]
인주: 싫어.
[등장 옐로]
옐로: 둘 다 그만~! 다치면 꿰매는 건 나라고!
[깡충 옐로]
모닝스타: 쳇. 재미없어.
[퇴장 모닝스타]
모닝스타는 철퇴를 질질 끌며 굴 안쪽으로 사라졌다.
인주: ……고마워, 옐로.
옐로: 고마우면 오늘 붕대 값은 네가 내!`;
const STG_HELP = `이름: 대사          말하는 사람만 밝게
이름(표정): 대사    표정 그림으로 바꾸고 말함
: 대사  · 콜론 없는 줄   나레이션 (모두 어둡게)
|                  대사 안에서 줄 바꿈
[등장 이름 자리 표정]  옆에서 스윽 (자리 · 표정은 빼도 됨)
[퇴장 이름] · [퇴장 모두]
[표정 이름 표정] · [이동 이름 자리]
[흔들 이름] · [깡충 이름]
[멈춤]             대사창 없이 한 박자 쉼
// 메모             무시됨

자리: 왼쪽 · 왼쪽2 · 가운데 · 오른쪽2 · 오른쪽
처음 말하는 인물은 저절로 등장 (주인공은 오른쪽)

설정 속도 30         글자 / 초
설정 어둡기 0.55     말 안 하는 인물 밝기 (0 ~ 1)
설정 글자크기 48 · 설정 줄간격 58
설정 글자색 #2b2420 · 설정 이름색 #f1e8d8
설정 글자그림자 0 2 4 rgba(0,0,0,.4)   (없음 = 끔)
설정 이름그림자 · 창그림자 · 인물그림자  (같은 꼴)
설정 소리 끄기 · 설정 소리크기 0.5
설정 주인공 인주 · 설정 인물크기 1
설정 등장 0.45 · 설정 퇴장 0.35   (초)
설정 녹화fps 30 (또는 60)

인물 모닝스타 크기 1.1 옆 -40 위 10 자르기 0.55 소리 360 뒤집기
  (크기 · 옆 · 위 = 그 인물만 · 자르기 = 위에서부터 보일 비율 · 소리 = 전자음 높이)`;

const stgNow = () => performance.now() / 1000;
const stgClamp = v => Math.max(0, Math.min(1, v));
const stgOut = k => 1 - Math.pow(1 - k, 3);
const stgIn = k => k * k * k;
const stgName = w => { w = (w || '').trim(); return w === '주인공' ? STG.opt.주인공 : w; };

/* ---------- 대본 읽기 ---------- */
function stgParse(txt){
  const beats = [], warn = [], tune = {}, opt = STG_OPT0(); let cmds = [];
  txt.split(/\r?\n/).forEach((raw, i) => {
    const s = raw.trim(), at = `${i + 1}줄`; if (!s || s.startsWith('//') || s.startsWith('#')) return;
    let m;
    if (/^\[.*\]$/.test(s)){ const c = stgCmd(s.slice(1, -1).trim(), at, warn); if (c && c.k === 'rest'){ beats.push({ cmds, line: null }); cmds = []; } else if (c) cmds.push(c); return; }
    if ((m = /^설정\s+(\S+)\s*(.*)$/.exec(s))){ stgSet(opt, m[1], m[2].trim(), at, warn); return; }
    if ((m = /^인물\s+(\S+)\s*(.*)$/.exec(s)) && !/[:：]/.test(s)){ stgTune(tune, m[1], m[2].trim(), at, warn); return; }
    let who = null, ex = null, text = s;
    if ((m = /^([^:：\[\]()]{0,24}?)\s*(?:\(([^)]*)\))?\s*[:：]\s*(.*)$/.exec(s))){ who = m[1].trim() || null; ex = (m[2] || '').trim() || null; text = m[3]; }
    beats.push({ cmds, line: { who, ex, text: text.replace(/\s*\|\s*/g, '\n') } }); cmds = [];
  });
  if (cmds.length) beats.push({ cmds, line: null });
  return { beats, warn, tune, opt };
}
function stgCmd(s, at, warn){
  const w = s.split(/\s+/), k = w[0], rest = w.slice(1), slot = rest.find(x => STG_SLOT[x]), oth = rest.slice(1).filter(x => !STG_SLOT[x]);
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
function stgShadow(v){ if (!v || v === '없음' || v === '끄기') return null; const w = v.split(/\s+/); if (w.length < 4 || w.slice(0, 3).some(x => isNaN(+x))) return undefined; return [+w[0], +w[1], +w[2], w.slice(3).join(' ')]; }
function stgSet(opt, key, val, at, warn){
  const num = ['속도', '어둡기', '글자크기', '줄간격', '소리크기', '인물크기', '등장', '퇴장', '녹화fps'];
  if (num.includes(key)){ const n = parseFloat(val); if (isNaN(n)) warn.push(`${at}: 설정 ${key} — 숫자가 아님`); else opt[key] = key === '녹화fps' ? (n >= 45 ? 60 : 30) : n; return; }
  if (key === '글자색' || key === '이름색'){ opt[key] = val || opt[key]; return; }
  if (/그림자$/.test(key) && key in opt){ const s = stgShadow(val); if (s === undefined) warn.push(`${at}: 설정 ${key} — '옆 아래 번짐 색' 꼴로 (예: 0 2 4 rgba(0,0,0,.4))`); else opt[key] = s; return; }
  if (key === '소리'){ opt.소리 = !/끄|없|off/.test(val); return; }
  if (key === '주인공'){ opt.주인공 = val || opt.주인공; return; }
  warn.push(`${at}: 모르는 설정 '${key}'`);
}
function stgTune(tune, name, rest, at, warn){
  const o = tune[name] = tune[name] || {}, w = rest.split(/\s+/).filter(Boolean), key = { 크기: 'size', 옆: 'dx', 위: 'dy', 자르기: 'crop', 소리: 'pitch' };
  for (let i = 0; i < w.length; i++){
    if (w[i] === '뒤집기'){ o.flip = !o.flip; continue; }
    if (w[i] === '보는쪽'){ o.look = /왼/.test(w[++i] || '') ? 'L' : 'R'; continue; }
    const k = key[w[i]], n = parseFloat(w[i + 1]); if (k && !isNaN(n)){ o[k] = k === 'dy' ? -n : n; i++; } else warn.push(`${at}: 인물 ${name} — '${w[i]}' 을 모름`);
  }
}
// 대본을 다시 읽고 처음 (빈 화면) 으로
function stgApplyScript(){
  const ta = document.getElementById('stg-txt'), txt = ta ? ta.value : STG_DEMO, P = stgParse(txt);
  STG.beats = P.beats; STG.warn = P.warn; STG.tune = P.tune; STG.opt = P.opt;
  if (STG.master) STG.master.gain.value = STG.opt.소리크기;
  for (const b of STG.beats) if (b.line) stgPrep(b.line);
  stgWarnHtml(); stgReset(0, false);
}
// 글자가 찍히는 때 (박자 시작부터 초). 말줄임 · 마침표 · 쉼표 뒤엔 조금 쉼
function stgPrep(L){
  const ch = Array.from(L.text), cps = Math.max(2, STG.opt.속도), tt = []; let t = 0.06;
  for (let i = 0; i < ch.length; i++){
    tt.push(t); const c = ch[i], nx = ch[i + 1];
    t += c === ' ' ? 0.5 / cps : c === '\n' ? 0.1 : 1 / cps;
    if (c === '…' && nx !== '…') t += 0.28; else if ('.!?'.includes(c) && !'.!?'.includes(nx || '')) t += 0.18; else if (',~'.includes(c)) t += 0.08;
  }
  L.ch = ch; L.tt = tt; L.dur = t; L.rows = null;
}
const stgCount = (L, dt, filled) => { if (filled) return L.ch.length; let n = 0; while (n < L.tt.length && L.tt[n] <= dt) n++; return n; };

/* ---------- 박자 (Space) — 진행은 '박자 시작 시각' 목록이라 같은 박자로 다시 돌릴 수 있음 ---------- */
function stgReset(base, startNow){ STG.tl = { base, starts: startNow ? [stgNow()] : [], fills: {}, end: null }; if (startNow) STG.lastTake = STG.tl; STG.blipBeat = -1; }
function stgNext(){
  if (STG.mode === 'replay' || !STG.beats.length) return;
  const t = stgNow(), tl = STG.tl, n = tl.starts.length, cur = tl.base + n - 1;
  if (!n){ tl.starts.push(t); STG.lastTake = tl; return; }
  const L = STG.beats[cur] && STG.beats[cur].line;
  if (L && !(tl.fills[cur] <= t) && t - tl.starts[n - 1] < L.dur){ tl.fills[cur] = t; return; }   // 찍히는 중이면 한 번에
  if (cur + 1 < STG.beats.length){ tl.starts.push(t); return; }
  if (tl.end == null) tl.end = t;
  if (STG.rec && STG.rec.live) stgRecStop(0.4); else stgHint('끝 — R 처음부터 · ← 한 박자 뒤로');
}
function stgBack(){ if (STG.mode === 'replay') return; const tl = STG.tl, cur = tl.base + tl.starts.length - 1; stgReset(Math.max(0, cur - 1), true); }
function stgTakeEnd(tl){ if (tl.end != null) return tl.end; const i = tl.base + tl.starts.length - 1, L = STG.beats[i] && STG.beats[i].line; return tl.starts[tl.starts.length - 1] + (L ? L.dur : 0) + 1.2; }

/* ---------- 장면: 시각 t 의 인물 상태 (박자 0 부터 차례로 적용) ---------- */
function stgScene(t){
  const tl = STG.tl, B = STG.beats, cur = tl.base + tl.starts.length - 1, C = {}; STG.zc = 0;
  const T = i => (i < tl.base ? -1e9 : tl.starts[i - tl.base]);
  for (let i = 0; i <= cur && i < B.length; i++){
    const b = B[i], Ti = T(i);
    for (const c of b.cmds) stgApply(C, c, Ti);
    const L = b.line, nm = L && L.who && stgName(L.who);
    if (nm && STG.cast[nm]){ const o = C[nm]; if (!o || o.outT != null) stgApply(C, { k: 'in', who: nm }, Ti); if (L.ex) stgApply(C, { k: 'ex', who: nm, ex: L.ex }, Ti); }
  }
  return { C, cur, start: cur >= tl.base ? T(cur) : null };
}
const stgX = (o, t) => { if (o.mvFrom == null) return o.x; const k = stgClamp((t - o.mvT) / 0.45), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; return o.mvFrom + (o.x - o.mvFrom) * e; };
function stgApply(C, c, T){
  if (c.k === 'out' && c.who === '모두'){ for (const k in C) if (C[k].outT == null) C[k].outT = T; return; }
  const nm = stgName(c.who);
  if (c.k === 'in'){
    if (!STG.cast[nm]) return;
    const used = new Set(Object.values(C).filter(o => o.outT == null && o.nm !== nm).map(o => o.slot));
    const order = nm === stgName(STG.opt.주인공) ? ['오른쪽', '오른쪽2', '가운데'] : ['왼쪽', '왼쪽2', '오른쪽2', '가운데', '오른쪽'];
    const slot = c.slot || order.find(s => !used.has(s)) || order[0], prev = C[nm];
    C[nm] = { nm, slot, x: STG_SLOT[slot], inT: T, outT: null, ex: c.ex || (prev && prev.outT == null ? prev.ex : '기본'), exPrev: null, exT: -1e9, shakeT: -1e9, hopT: -1e9, mvFrom: null, mvT: -1e9, z: ++STG.zc };
    return;
  }
  const o = C[nm]; if (!o || o.outT != null) return;
  if (c.k === 'out') o.outT = T;
  else if (c.k === 'ex'){ if (c.ex !== o.ex){ o.exPrev = o.ex; o.ex = c.ex; o.exT = T; } }
  else if (c.k === 'move'){ o.mvFrom = stgX(o, T); o.x = STG_SLOT[c.slot]; o.slot = c.slot; o.mvT = T; }
  else if (c.k === 'shake') o.shakeT = T;
  else if (c.k === 'hop') o.hopT = T;
}

/* ---------- 그리기 ---------- */
const stgSetShadow = (cx, s) => { if (s){ cx.shadowOffsetX = s[0]; cx.shadowOffsetY = s[1]; cx.shadowBlur = s[2]; cx.shadowColor = s[3]; } else { cx.shadowColor = 'rgba(0,0,0,0)'; cx.shadowBlur = 0; cx.shadowOffsetX = cx.shadowOffsetY = 0; } };
function stgDraw(t){
  const cx = STG.cx, W = STG.W, H = STG.H, opt = STG.opt, B = STG.beats, tl = STG.tl;
  cx.clearRect(0, 0, W, H);
  const S = stgScene(t), cur = S.cur, b = B[cur], L = b && b.line;
  if (cur < tl.base) return null;
  // 밝기: 말하는 사람 1, 나머지 '어둡기'. 나레이션이면 모두 어둡게, [멈춤] 이면 모두 밝게. 박자가 바뀌면 0.22초에 걸쳐
  const lvl = (i, nm) => { const l = B[i] && B[i].line; if (!l) return 1; return l.who && stgName(l.who) === nm ? 1 : opt.어둡기; };
  const kD = S.start == null ? 1 : stgClamp((t - S.start) / 0.22), prevI = cur - 1 >= tl.base ? cur - 1 : cur;
  const spk = L && L.who ? stgName(L.who) : null;
  const list = Object.values(S.C).filter(o => o.outT == null || t - o.outT < opt.퇴장).sort((a, c) => (a.nm === spk) - (c.nm === spk) || a.z - c.z);
  for (const o of list) stgDrawChar(o, t, lvl(prevI, o.nm) + (lvl(cur, o.nm) - lvl(prevI, o.nm)) * kD);
  // 대사창 (말이 없는 박자엔 숨김)
  const on = L ? 1 : 0, pOn = B[prevI] && B[prevI].line ? 1 : 0, bA = S.start == null ? on : pOn + (on - pOn) * stgClamp((t - S.start) / 0.2);
  let count = 0;
  if (bA > 0.003 && STG.box){
    const X = STG_BOX.x, Y = STG_BOX.y;
    cx.save(); cx.globalAlpha = bA; stgSetShadow(cx, opt.창그림자); cx.drawImage(STG.box, X, Y, STG_BOX.w, STG_BOX.h); cx.restore();
    if (L){
      cx.save(); cx.globalAlpha = bA; cx.textBaseline = 'top';
      if (L.who){ let fs = opt.글자크기; cx.font = `${fs}px GalmuriMono11, monospace`; const nw = cx.measureText(L.who).width; if (nw > STG_BOX.nameW) fs = Math.max(24, Math.floor(fs * STG_BOX.nameW / nw / 12) * 12 || 24);
        cx.font = `${fs}px GalmuriMono11, monospace`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillStyle = opt.이름색; stgSetShadow(cx, opt.이름그림자); cx.fillText(L.who, X + STG_BOX.nameX, Y + STG_BOX.nameY); }
      cx.textAlign = 'left'; cx.textBaseline = 'top'; cx.font = `${opt.글자크기}px GalmuriMono11, monospace`; cx.fillStyle = opt.글자색; stgSetShadow(cx, opt.글자그림자);
      if (!L.rows) L.rows = stgWrap(cx, L.ch, STG_BOX.textW);
      count = stgCount(L, t - S.start, tl.fills[cur] <= t);
      L.rows.forEach((r, i) => { const e = Math.min(r[1], count); if (e > r[0]) cx.fillText(L.ch.slice(r[0], e).join(''), X + STG_BOX.textX, Y + STG_BOX.textY + i * opt.줄간격); });
      if (count >= L.ch.length){ const bob = Math.sin(t * 5) * 3, tx = X + STG_BOX.triX, ty = Y + STG_BOX.triY + bob; stgSetShadow(cx, null); cx.fillStyle = '#141010'; cx.beginPath(); cx.moveTo(tx - 17, ty); cx.lineTo(tx + 17, ty); cx.lineTo(tx, ty + 26); cx.closePath(); cx.fill(); }
      cx.restore();
    }
  }
  return { cur, L, count };
}
// 줄 나누기: 낱말 (띄어쓰기) 단위로, 한 낱말이 너무 길면 글자 단위로. [시작, 끝) 목록
function stgWrap(cx, ch, maxW){
  const wOf = c => STG.cw[cx.font + c] ?? (STG.cw[cx.font + c] = cx.measureText(c).width);
  const rows = []; let s = 0, w = 0, sp = -1;
  for (let i = 0; i < ch.length; i++){
    const c = ch[i];
    if (c === '\n'){ rows.push([s, i]); s = i + 1; w = 0; sp = -1; continue; }
    w += wOf(c); if (c === ' ') sp = i;
    if (w > maxW && i > s){ const cut = sp > s ? sp : i; rows.push([s, cut]); s = cut + (ch[cut] === ' ' ? 1 : 0); w = 0; sp = -1; for (let j = s; j <= i; j++){ w += wOf(ch[j]); if (ch[j] === ' ') sp = j; } }
  }
  rows.push([s, ch.length]); return rows;
}
function stgDrawChar(o, t, br){
  const cast = STG.cast[o.nm]; if (!cast) return;
  const opt = STG.opt, tu = STG.tune[o.nm] || {}, pf = STG.prefs[o.nm] || {};
  const eIn = stgOut(stgClamp((t - o.inT) / opt.등장)), eOut = o.outT == null ? 0 : stgIn(stgClamp((t - o.outT) / opt.퇴장));
  const x = stgX(o, t), side = x < 960 ? -1 : 1, alpha = eIn * (1 - eOut); if (alpha < 0.003) return;
  let ox = side * 140 * ((1 - eIn) + eOut), oy = 0;
  const ds = t - o.shakeT; if (ds >= 0 && ds < 0.4) ox += Math.sin(ds * 70) * 14 * (1 - ds / 0.4);
  const dh = t - o.hopT; if (dh >= 0 && dh < 0.34) oy -= Math.sin(Math.PI * dh / 0.34) * 34;
  const want = x <= 960 ? 'R' : 'L'; let flip = (tu.look || pf.look || cast.look || 'R') !== want; if (tu.flip) flip = !flip; if (pf.flip) flip = !flip;
  const kx = stgClamp((t - o.exT) / 0.16), layers = o.exPrev && kx < 1 ? [[o.exPrev, 1], [o.ex, kx]] : [[o.ex, 1]];
  layers.forEach(([ex, la], li) => {
    const E = cast.ex[ex] || cast.ex['기본'] || Object.values(cast.ex)[0]; if (!E || !E.img) return;
    const fw = E.fw || E.img.width, fh = E.fh || E.img.height, crop = tu.crop || E.crop || 1, srcH = fh * crop;
    const k = STG_VH * opt.인물크기 * (tu.size || 1) / srcH, dw = Math.round(fw * k), dhh = Math.round(srcH * k);
    let sx = 0, sy = 0; if (E.n > 1){ const fi = Math.floor(t * (E.fps || 8)) % E.n, cols = E.cols || E.n; sx = (fi % cols) * fw; sy = Math.floor(fi / cols) * fh; }
    const oc = STG.oc[o.nm + '|' + li] || (STG.oc[o.nm + '|' + li] = document.createElement('canvas'));
    if (oc.width !== dw || oc.height !== dhh){ oc.width = dw; oc.height = dhh; }
    const ox2 = oc.getContext('2d'); ox2.setTransform(1, 0, 0, 1, 0, 0); ox2.globalCompositeOperation = 'source-over'; ox2.clearRect(0, 0, dw, dhh); ox2.imageSmoothingQuality = 'high';
    if (flip) ox2.setTransform(-1, 0, 0, 1, dw, 0);
    ox2.drawImage(E.img, sx, sy, fw, srcH, 0, 0, dw, dhh); ox2.setTransform(1, 0, 0, 1, 0, 0);
    if (br < 0.999){ ox2.globalCompositeOperation = 'source-atop'; ox2.fillStyle = `rgba(0,0,0,${(1 - br).toFixed(3)})`; ox2.fillRect(0, 0, dw, dhh); ox2.globalCompositeOperation = 'source-over'; }
    const cx = STG.cx; cx.save(); cx.globalAlpha = alpha * la; stgSetShadow(cx, opt.인물그림자);
    cx.drawImage(oc, Math.round(x - dw / 2 + (tu.dx || 0) + ox), Math.round(STG.H - dhh + (tu.dy || 0) + oy)); cx.restore();
  });
}

/* ---------- 전자음 (뚜두두두) — 녹화에도 들어감 ---------- */
function stgAudio(){
  if (STG.ac){ if (STG.ac.state === 'suspended') STG.ac.resume(); return STG.ac; }
  try { const ac = STG.ac = new (window.AudioContext || window.webkitAudioContext)(); STG.master = ac.createGain(); STG.master.gain.value = STG.opt ? STG.opt.소리크기 : 0.5; STG.master.connect(ac.destination); STG.recDest = ac.createMediaStreamDestination(); STG.master.connect(STG.recDest); } catch (e) {}
  return STG.ac;
}
function stgBlip(pitch, c){
  const ac = STG.ac; if (!ac || !STG.opt.소리) return; const now = ac.currentTime; if (now - STG.lastBlip < 0.028) return; STG.lastBlip = now;
  const code = (c || 'a').codePointAt(0), f = pitch * (1 + ((code % 7) - 3) * 0.025), o = ac.createOscillator(), g = ac.createGain();
  o.type = 'square'; o.frequency.value = f;
  g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.13, now + 0.003); g.gain.setValueAtTime(0.13, now + 0.032); g.gain.linearRampToValueAtTime(0, now + 0.05);
  o.connect(g); g.connect(STG.master); o.start(now); o.stop(now + 0.06);
}
function stgSound(fr){
  if (!fr || !fr.L){ STG.blipBeat = fr ? fr.cur : -1; STG.blipN = 0; return; }
  if (STG.blipBeat !== fr.cur){ STG.blipBeat = fr.cur; STG.blipN = 0; }
  if (fr.count > STG.blipN){
    const nw = fr.L.ch.slice(STG.blipN, fr.count), cast = fr.L.who && STG.cast[stgName(fr.L.who)], tu = fr.L.who && STG.tune[stgName(fr.L.who)];
    if (fr.count - STG.blipN <= 3 && nw.some(c => c.trim() && !'.,!?…~'.includes(c))) stgBlip((tu && tu.pitch) || (cast && cast.pitch) || (fr.L.who ? 520 : 440), nw[nw.length - 1]);
    STG.blipN = fr.count;
  }
}

/* ---------- 녹화 (투명 webm) ---------- */
function stgRecStart(replay){
  if (STG.rec) return;
  if (typeof MediaRecorder === 'undefined' || !STG.cv.captureStream) return stgHint('이 브라우저는 녹화를 못 해요 (크롬 · 엣지에서)');
  if (replay && !(STG.lastTake && STG.lastTake.starts.length)) return stgHint('먼저 Space 로 한 번 진행해 주세요');
  stgAudio();
  const tracks = STG.cv.captureStream(STG.opt.녹화fps).getVideoTracks(); if (STG.opt.소리 && STG.recDest) tracks.push(...STG.recDest.stream.getAudioTracks());
  const mt = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
  let mr; try { mr = new MediaRecorder(new MediaStream(tracks), { mimeType: mt, videoBitsPerSecond: 16e6, audioBitsPerSecond: 160000 }); } catch (e){ return stgHint('녹화를 시작하지 못했어요'); }
  const r = STG.rec = { mr, chunks: [], t0: stgNow(), live: !replay };
  mr.ondataavailable = e => { if (e.data && e.data.size) r.chunks.push(e.data); };
  mr.onstop = () => stgRecSave(r);
  if (replay){ const tk = STG.lastTake, sh = stgNow() + 0.6 - tk.starts[0], end = stgTakeEnd(tk);
    STG.tl = { base: tk.base, starts: tk.starts.map(v => v + sh), fills: Object.fromEntries(Object.entries(tk.fills).map(([k, v]) => [k, v + sh])), end: end + sh };
    STG.mode = 'replay'; r.until = end + sh + 0.6; STG.blipBeat = -1; }
  else stgReset(0, false);
  mr.start(1000); stgUi(); stgPanel(false);
  stgHint(replay ? '방금 진행 그대로 녹화 중 — 끝나면 저절로 저장' : '녹화 중 — Space 로 시작 · 마지막 대사 뒤 Space (또는 Esc) 로 끝');
}
function stgRecStop(delay){ const r = STG.rec; if (!r || r.stopping) return; r.stopping = true; setTimeout(() => { try { r.mr.stop(); } catch (e) {} }, (delay || 0) * 1000); }
async function stgRecSave(r){
  STG.rec = null; if (STG.mode === 'replay'){ STG.mode = 'live'; stgReset(0, false); }   // 방금 진행 (lastTake) 은 남겨 둠 — 다시 녹화 가능
  let blob = new Blob(r.chunks, { type: 'video/webm' }); const ms = (stgNow() - r.t0) * 1000;
  try { if (window.ysFixWebmDuration) blob = await window.ysFixWebmDuration(blob, ms, { logger: false }); } catch (e) {}   // 길이 정보 (편집기에서 길이가 안 잡히던 것)
  const d = new Date(), p = n => String(n).padStart(2, '0');
  STG.lastFile = { blob, name: `stage_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.webm` };
  stgUi(); stgPanel(true); await stgDownload(STG.lastFile.blob, STG.lastFile.name);
}
async function stgDownload(blob, name){
  try {
    const dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null;
    if (dl){ await dl.save({ filename: name, data: blob }); stgHint(`저장했어요 — ${name}`); return; }
  } catch (e){ const c = e && e.code; if (c === 'declined') return stgHint('저장을 그만뒀어요 — 대본 창의 ⬇ 로 다시'); if (c === 'rate_limited') return stgHint('잠시 뒤 대본 창의 ⬇ 로 다시'); if (c === 'too_large') return stgHint('파일이 너무 커요 — 나눠서 녹화해 주세요'); }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000); stgHint(`저장 — ${name}`);
}

/* ---------- 그림: 임시 그림 + 끌어다 놓은 그림 (이 브라우저의 IndexedDB 에 보관) ---------- */
const stgImg = src => STG.imgs[src] || (STG.imgs[src] = new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; }));
function stgDB(){ return new Promise((res, rej) => { const r = indexedDB.open('stage-imgs', 1); r.onupgradeneeded = () => r.result.createObjectStore('imgs'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
async function stgDbAll(){ try { const db = await stgDB(); return await new Promise(res => { const out = [], q = db.transaction('imgs').objectStore('imgs').openCursor(); q.onsuccess = () => { const c = q.result; if (c){ out.push(c.value); c.continue(); } else res(out); }; q.onerror = () => res(out); }); } catch (e){ return []; } }
async function stgDbPut(k, v){ try { const db = await stgDB(); db.transaction('imgs', 'readwrite').objectStore('imgs').put(v, k); } catch (e) {} }
async function stgDbDel(name){ try { const db = await stgDB(), st = db.transaction('imgs', 'readwrite').objectStore('imgs'), q = st.openCursor(); q.onsuccess = () => { const c = q.result; if (!c) return; if (String(c.key).startsWith(name + '|')) c.delete(); c.continue(); }; } catch (e) {} }
async function stgLoadCast(){
  for (const [nm, c] of Object.entries(STG_CAST0)) for (const E of Object.values(c.ex)) E.img = await stgImg(E.src);
  for (const v of await stgDbAll()){ try { const img = await createImageBitmap(v.blob); (STG.user[v.name] = STG.user[v.name] || {})[v.ex] = { img, crop: 1 }; } catch (e) {} }
  stgCastBuild();
}
function stgCastBuild(){
  STG.cast = {};
  for (const [nm, c] of Object.entries(STG_CAST0)) STG.cast[nm] = { ...c, ex: { ...c.ex }, tmp: Object.keys(c.ex) };
  for (const [nm, ex] of Object.entries(STG.user)){
    const c = STG.cast[nm] || (STG.cast[nm] = { look: 'R', pitch: 520, ex: {}, tmp: [] });
    for (const [e, E] of Object.entries(ex)){ c.ex[e] = E; c.tmp = c.tmp.filter(x => x !== e); }
  }
  stgCastHtml(); stgWarnHtml();
}
async function stgAddFiles(files){
  let n = 0;
  for (const f of files){
    if (!/^image\//.test(f.type)) continue;
    const base = f.name.replace(/\.[^.]+$/, '').trim(), i = base.search(/[_]/), nm = (i > 0 ? base.slice(0, i) : base).trim(), ex = (i > 0 ? base.slice(i + 1) : '기본').trim() || '기본';
    try { const img = await createImageBitmap(f); (STG.user[nm] = STG.user[nm] || {})[ex] = { img, crop: 1 }; await stgDbPut(nm + '|' + ex, { name: nm, ex, blob: f }); n++; } catch (e) {}
  }
  stgCastBuild(); stgHint(n ? `그림 ${n}장 넣었어요` : '그림 파일이 아니에요 (png · webp · jpg)');
}
function stgPrefsSave(){ try { localStorage.setItem('stage-prefs-v1', JSON.stringify(STG.prefs)); } catch (e) {} }

/* ---------- 화면 (대본 창 · 안내) ---------- */
const STG_CSS = `
#stg{position:fixed;inset:0;z-index:10000;display:flex;background:#0c0b0e;color:#e8e2d6;font:14px "Nanum Gothic",sans-serif;}
#stg-view{position:relative;flex:1;min-width:0;display:flex;align-items:center;justify-content:center;overflow:hidden;}
#stg-cv{display:block;width:min(100%,177.78vh);aspect-ratio:16/9;height:auto;cursor:pointer;}
#stg-cv.bg-check{background:repeating-conic-gradient(#3b3a41 0 25%,#2b2a30 0 50%) 0 0/40px 40px;}
#stg-cv.bg-green{background:#00b140;} #stg-cv.bg-blue{background:#0047bb;} #stg-cv.bg-black{background:#000;} #stg-cv.bg-white{background:#fff;}
#stg-hint{position:absolute;left:14px;top:12px;padding:6px 10px;border-radius:6px;background:rgba(0,0,0,.6);font-size:13px;pointer-events:none;transition:opacity .6s;opacity:0;}
#stg-hint.show{opacity:1;}
#stg-rec{position:absolute;right:14px;top:12px;padding:5px 10px;border-radius:6px;background:rgba(160,0,0,.8);font-weight:700;font-size:13px;pointer-events:none;}
#stg-panel{width:400px;flex:none;box-sizing:border-box;height:100%;overflow:auto;padding:14px 14px 30px;background:#16141a;border-left:1px solid #34303a;}
#stg.nopanel #stg-panel{display:none;}
#stg-panel h3{margin:0 0 10px;font:400 22px "Do Hyeon",sans-serif;color:#e8c872;} #stg-panel h3 small{font-size:13px;color:#8d8678;}
#stg-panel h4{margin:16px 0 6px;font:400 15px "Do Hyeon",sans-serif;color:#cfc6b4;}
#stg-panel .row{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0;}
#stg-panel button{font:13px "Nanum Gothic",sans-serif;color:#eee6d6;background:#2a2630;border:1px solid #4a4452;border-radius:6px;padding:6px 9px;cursor:pointer;}
#stg-panel button:hover{background:#383240;} #stg-panel button.on{border-color:#e8c872;color:#e8c872;} #stg-panel button.warn{border-color:#8a4a3a;} #stg-panel button:disabled{opacity:.4;cursor:default;}
#stg-txt{width:100%;box-sizing:border-box;height:300px;resize:vertical;background:#0e0d11;color:#f0e9dc;border:1px solid #3a3540;border-radius:6px;padding:8px;font:14px/1.5 GalmuriMono11,monospace;}
#stg-warn{font-size:12px;color:#f0a070;white-space:pre-wrap;margin:4px 0;}
#stg-cast .c{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid #2a2630;font-size:13px;}
#stg-cast .c b{font:400 16px "Do Hyeon",sans-serif;min-width:64px;} #stg-cast .c em{font-style:normal;color:#a99f8e;flex:1;}
#stg-panel .tip{font-size:12px;color:#9d9585;line-height:1.55;margin:4px 0;}
#stg-panel pre{font:12px/1.5 GalmuriMono11,monospace;white-space:pre-wrap;color:#cfc6b4;background:#0e0d11;padding:8px;border-radius:6px;}
`;
function stgBuild(){
  const st = document.createElement('style'); st.textContent = STG_CSS; document.head.appendChild(st);
  const el = document.createElement('div'); el.id = 'stg';
  el.innerHTML = `<div id="stg-view"><canvas id="stg-cv" class="bg-check" width="${STG.W}" height="${STG.H}"></canvas><div id="stg-hint"></div><div id="stg-rec" hidden>● 녹화 중</div></div>
  <aside id="stg-panel">
    <h3>대사 실험장 <small>v1.0 · ${typeof VERSION !== 'undefined' ? VERSION : ''}</small></h3>
    <div class="row"><button data-a="play">▶ 대본 적용 · 처음부터 (R)</button><button data-a="demo">예시 대본</button></div>
    <textarea id="stg-txt" spellcheck="false"></textarea>
    <div id="stg-warn"></div>
    <h4>미리보기 바탕 <small>(녹화는 늘 투명)</small></h4>
    <div class="row" id="stg-bgs"><button data-bg="check">투명 (체크)</button><button data-bg="green">초록</button><button data-bg="blue">파랑</button><button data-bg="black">검정</button><button data-bg="white">흰색</button></div>
    <h4>녹화 — 투명 배경 webm (전자음 포함)</h4>
    <div class="row"><button data-a="rec">● 녹화 (빈 화면 → Space)</button><button data-a="rerec">↻ 방금 진행 그대로 녹화</button></div>
    <div class="row"><button data-a="save" disabled>⬇ 마지막 녹화 다시 저장</button></div>
    <p class="tip">녹화 중엔 이 창이 닫혀요. 마지막 대사 뒤 Space (또는 Esc) 로 끝 → 저장 창</p>
    <h4>인물</h4>
    <div id="stg-cast"></div>
    <div class="row"><button data-a="pick">그림 넣기…</button><input type="file" id="stg-file" accept="image/*" multiple hidden></div>
    <p class="tip">파일 이름 = 이름_표정 (예: 모닝스타_웃음.png · 인주.png = 기본). 화면에 끌어다 놓아도 돼요. 이 브라우저에 보관</p>
    <h4>키</h4>
    <p class="tip">Space · → · Enter · 화면 클릭 = 다음 (글이 찍히는 중이면 한 번에)<br>← · Backspace = 한 박자 뒤로 · R = 처음부터<br>Tab = 이 창 열고 닫기 · Esc = 녹화 멈춤 / 창</p>
    <details><summary>대본 쓰는 법</summary><pre>${STG_HELP.replace(/</g, '&lt;')}</pre></details>
    <div class="row" style="margin-top:14px"><button data-a="exit" class="warn">굴로 나가기</button></div>
  </aside>`;
  document.body.appendChild(el);
  STG.el = el; STG.cv = el.querySelector('#stg-cv'); STG.cx = STG.cv.getContext('2d');
  const ta = el.querySelector('#stg-txt'); let saved = null; try { saved = localStorage.getItem('stage-script-v1'); } catch (e) {}
  ta.value = saved || STG_DEMO;
  let tm = 0; ta.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { try { localStorage.setItem('stage-script-v1', ta.value); } catch (e) {} }, 400); });
  try { STG.prefs = JSON.parse(localStorage.getItem('stage-prefs-v1') || '{}') || {}; STG.bg = localStorage.getItem('stage-bg-v1') || 'check'; } catch (e) {}
  el.querySelector('#stg-panel').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; stgAudio();
    const a = b.dataset.a;
    if (b.dataset.bg){ STG.bg = b.dataset.bg; try { localStorage.setItem('stage-bg-v1', STG.bg); } catch (er) {} stgUi(); }
    else if (a === 'play') stgApplyScript();
    else if (a === 'demo'){ ta.value = STG_DEMO; try { localStorage.setItem('stage-script-v1', ta.value); } catch (er) {} stgApplyScript(); }
    else if (a === 'rec') stgRecStart(false);
    else if (a === 'rerec') stgRecStart(true);
    else if (a === 'save' && STG.lastFile) stgDownload(STG.lastFile.blob, STG.lastFile.name);
    else if (a === 'pick') el.querySelector('#stg-file').click();
    else if (a === 'exit'){ STG.on = false; location.hash = ''; location.reload(); }
    else if (b.dataset.flip){ const p = STG.prefs[b.dataset.flip] = STG.prefs[b.dataset.flip] || {}; p.flip = !p.flip; stgPrefsSave(); stgCastHtml(); }
    else if (b.dataset.del){ const nm = b.dataset.del; delete STG.user[nm]; stgDbDel(nm); stgCastBuild(); }
    b.blur();
  });
  el.querySelector('#stg-file').addEventListener('change', e => { stgAddFiles([...e.target.files]); e.target.value = ''; });
  el.addEventListener('dragover', e => { e.preventDefault(); });
  el.addEventListener('drop', e => { e.preventDefault(); if (e.dataTransfer && e.dataTransfer.files.length) stgAddFiles([...e.dataTransfer.files]); });
  STG.cv.addEventListener('click', () => { stgAudio(); stgNext(); });
  stgUi();
}
function stgUi(){
  if (!STG.el) return;
  STG.cv.className = 'bg-' + STG.bg;
  STG.el.querySelectorAll('#stg-bgs button').forEach(b => b.classList.toggle('on', b.dataset.bg === STG.bg));
  const rec = STG.el.querySelector('#stg-rec'); rec.hidden = !STG.rec; rec.textContent = STG.mode === 'replay' ? '● 녹화 중 (같은 박자로)' : '● 녹화 중';
  STG.el.querySelector('[data-a="save"]').disabled = !STG.lastFile;
  STG.el.querySelector('[data-a="rec"]').disabled = STG.el.querySelector('[data-a="rerec"]').disabled = !!STG.rec;
}
function stgPanel(on){ STG.panel = on; if (STG.el) STG.el.classList.toggle('nopanel', !on); }
function stgCastHtml(){
  const box = STG.el && STG.el.querySelector('#stg-cast'); if (!box) return;
  box.innerHTML = Object.entries(STG.cast).map(([nm, c]) => {
    const ex = Object.keys(c.ex).map(e => (c.tmp || []).includes(e) ? `${e} (임시 그림)` : e).join(' · '), pf = STG.prefs[nm] || {};
    return `<div class="c"><b>${nm}</b><em>${ex}</em><button data-flip="${nm}" class="${pf.flip ? 'on' : ''}">↔ 뒤집기</button>${STG.user[nm] ? `<button data-del="${nm}" class="warn">넣은 그림 지우기</button>` : ''}</div>`;
  }).join('');
}
function stgWarnHtml(){
  const el = STG.el && STG.el.querySelector('#stg-warn'); if (!el) return;
  const w = [...STG.warn], miss = new Set();
  for (const b of STG.beats){
    const chk = (who, ex) => { const nm = stgName(who), c = STG.cast[nm]; if (c && ex && !c.ex[ex]) miss.add(`${nm} '${ex}' 그림 없음 → 기본으로`); };
    for (const c of b.cmds){ if (c.k === 'in' && c.who !== '모두' && !STG.cast[stgName(c.who)]) miss.add(`${c.who}: 그림이 없어 등장 못 함 (그림 넣기)`); if (c.k === 'in' || c.k === 'ex') chk(c.who, c.ex); }
    if (b.line && b.line.who) chk(b.line.who, b.line.ex);
  }
  el.textContent = [...w, ...miss].join('\n') + (STG.beats.length ? `${w.length || miss.size ? '\n' : ''}박자 ${STG.beats.length}개` : '대본이 비었어요');
}
function stgHint(msg){
  const el = STG.el && STG.el.querySelector('#stg-hint'); if (!el) return;
  el.textContent = msg; el.classList.add('show'); clearTimeout(STG.hintTm); STG.hintTm = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ---------- 키 · 돌기 · 들어가기 ---------- */
addEventListener('keydown', e => {
  if (!STG.on) return;
  e.stopImmediatePropagation();   // 게임 키 처리 (core.js) 로 안 감 — 대본 창에서 띄어쓰기가 막히던 것도
  const tg = e.target; if (tg && (tg.tagName === 'TEXTAREA' || tg.tagName === 'INPUT')){ if (e.code === 'Escape') tg.blur(); return; }
  if (e.repeat){ e.preventDefault(); return; }
  stgAudio();
  const k = e.code;
  if (k === 'Space' || k === 'Enter' || k === 'NumpadEnter' || k === 'ArrowRight'){ e.preventDefault(); stgNext(); }
  else if (k === 'ArrowLeft' || k === 'Backspace'){ e.preventDefault(); stgBack(); }
  else if (k === 'KeyR' && !STG.rec) stgApplyScript();
  else if (k === 'Tab'){ e.preventDefault(); stgPanel(!STG.panel); }
  else if (k === 'Escape'){ e.preventDefault(); if (STG.rec) stgRecStop(0); else stgPanel(!STG.panel); }
}, true);
function stgLoop(){
  if (!STG.on) return; requestAnimationFrame(stgLoop);
  const t = stgNow(); if (STG.rec && STG.mode === 'replay' && t >= STG.rec.until) stgRecStop(0);
  let fr = null; try { fr = stgDraw(t); } catch (e){ if (!STG.drawErr){ STG.drawErr = 1; console.error(e); } }
  stgSound(fr);
}
async function startStage(){
  STG.on = true; G.mode = 'stage'; G.paused = true; G.lock = true;
  try { G.renderer.domElement.style.visibility = 'hidden'; } catch (e) {}
  STG.opt = STG_OPT0(); stgBuild(); stgHint('글꼴 · 그림 읽는 중…');
  const font = (async () => { try { const f = new FontFace('GalmuriMono11', 'url(art/stage/GalmuriMono11.woff2)'); await f.load(); document.fonts.add(f); } catch (e) {} })();
  const box = stgImg(STG_BOX.src).then(im => { STG.box = im; });
  await Promise.all([font, box, stgLoadCast()]);
  stgApplyScript(); stgHint('Space 로 시작 · Tab 대본 창 열고 닫기');
  requestAnimationFrame(stgLoop);
}
// 굴의 일시정지 창에 '대사 실험장'
if (typeof pauseOpen === 'function'){
  const _pauseS = pauseOpen;
  pauseOpen = function(){
    _pauseS();
    const box = document.querySelector('#confirm .cf-box div'); if (!box || box.querySelector('[data-p="stage"]')) return;
    const b = document.createElement('button'); b.dataset.p = 'stage'; b.textContent = '대사 실험장 (영상 · 대사)';
    b.addEventListener('click', ev => { ev.stopPropagation(); if (typeof proSave === 'function') proSave(); location.hash = '#stage'; location.reload(); });
    box.appendChild(b);
  };
}
