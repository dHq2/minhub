/* martin/js/clock.js — 사건 시계 v1.0 (11-17 D, v0.14). 고칠 땐 이 줄 아래에 「11-17 D: …」처럼 날짜·방 주석
   사건마다 시계 하나: S.clock = { ms, start:'10:50', sess:{ <접속 SID>: { ms, from, to } } }
   - 보스가 방에 있을 때만 흐른다: 앱 화면이 보이고(visibilityState 'visible') 창에 초점이 있을 때(document.hasFocus()). 다른 앱·탭·창으로 가면 멈춘다.
   - 위 띠(#clk)에 사건 시각 — 10:50:00 부터 흐르는 시:분:초(하루를 넘기면 「+1일」). 누르면 실제로 든 시간을 0.01초 단위로(다시 누르면 사건 시각).
   - 기록: log(type, data) 를 바깥에서 감싸 모든 줄(행동·대화·기억·턴)에 clk(그때 시계, 10ms 단위)를 붙인다 — core.js 는 안 고침(맨 아래 한 줄).
   - 저장: 기기는 15초마다·멈출 때, 계정은 3분마다·멈출 때(dbSave). 사건을 바꾸면(지난 사건·새 사건) 그 사건의 시계로 넘어간다.
   - clockText(): 프롬프트 [자료함] 아래 한 줄(A 가 ai.js 에 고리를 심어 둠). recap.js 가 세션별·턴별·총 추리 시간을 쓴다. */
const CLK_START = '10:50';
if (typeof UNDO_SKIP !== 'undefined') UNDO_SKIP.add('clock');   /* 시계는 판 상태가 아니다 — 되돌리기(undo.js)가 흐르는 시계를 바뀐 것으로 잡지 않게 */
const CLK = { last:0, run:false, real:false, raf:0, lastSave:0, lastDb:0 };
function ensureClock(){
  if (!S) return null;
  if (!S.clock || typeof S.clock.ms !== 'number') S.clock = { ms:0, start:CLK_START, sess:{} };
  if (!S.clock.sess) S.clock.sess = {};
  if (!S.clock.start) S.clock.start = CLK_START;
  return S.clock;
}
const clockHere = () => document.visibilityState === 'visible' && document.hasFocus();
/* 흐른 만큼 더한다 — 멈춰 있었으면 더하지 않는다. 기기가 잠들어 타이머가 멎었던 틈(5초 넘게)은 버린다 */
function clockTick(){
  const c = ensureClock(), now = performance.now(); if (!c){ CLK.last = now; return; }
  if (CLK.run && CLK.last){ const d = now - CLK.last; if (d > 0 && d < 5000){ c.ms += d; const s = c.sess[SID] || (c.sess[SID] = { ms:0, from:Date.now(), to:Date.now() }); s.ms += d; s.to = Date.now(); } }
  CLK.last = now;
}
function clockState(why){   /* 방에 들어왔나·나갔나 */
  clockTick(); const on = clockHere();
  if (on === CLK.run) return; CLK.run = on;
  if (!on){ clockSave(true); } clockRender();
}
function clockSave(db){ try{ if (!S || isBlank(S)) return; save(); CLK.lastSave = Date.now(); if (db){ dbSave(); CLK.lastDb = Date.now(); } }catch(e){} }
const clockMs = () => { const c = S && S.clock; return c ? Math.round(c.ms / 10) * 10 : 0; };
/* 보이는 꼴 */
function clockSim(ms, start){
  const [h, m] = String(start || CLK_START).split(':').map(n => parseInt(n, 10) || 0), t = h * 3600 + m * 60 + Math.floor((ms || 0) / 1000), day = Math.floor(t / 86400), r = t % 86400;
  const p = n => String(n).padStart(2, '0');
  return `${day ? '+' + day + '일 ' : ''}${p(Math.floor(r / 3600))}:${p(Math.floor(r % 3600 / 60))}:${p(r % 60)}`;
}
function clockReal(ms){   /* 4:57:12.34 · 2:31.07 */
  const cs = Math.floor((ms || 0) / 10), h = Math.floor(cs / 360000), m = Math.floor(cs % 360000 / 6000), s = Math.floor(cs % 6000 / 100), c = cs % 100, p = n => String(n).padStart(2, '0');
  return h ? `${h}:${p(m)}:${p(s)}.${p(c)}` : `${m}:${p(s)}.${p(c)}`;
}
function clockHuman(ms){   /* 4시간 57분 12.34초 */
  const cs = Math.floor((ms || 0) / 10), h = Math.floor(cs / 360000), m = Math.floor(cs % 360000 / 6000), s = (cs % 6000) / 100;
  return [h ? h + '시간' : '', h || m ? m + '분' : '', s.toFixed(2) + '초'].filter(Boolean).join(' ');
}
function clockRender(){
  const b = $('#clk'); if (!b || !S) return; const c = ensureClock();
  b.classList.toggle('real', CLK.real); b.classList.toggle('off', !CLK.run);
  b.querySelector('b').textContent = CLK.real ? clockReal(c.ms) : clockSim(c.ms, c.start);
  b.querySelector('small').textContent = CLK.real ? '들인 시간' : CLK.run ? '사건 시각' : '멈춤';
  b.title = `사건 시각 ${clockSim(c.ms, c.start)} · 들인 시간 ${clockReal(c.ms)}${CLK.run ? '' : ' · 지금 멈춤(이 화면을 보고 있을 때만 흐른다)'}`;
}
/* 0.01초 보기는 화면 그릴 때마다 */
function clockLoop(){ cancelAnimationFrame(CLK.raf); if (!CLK.real) return; const f = () => { clockTick(); clockRender(); if (CLK.real) CLK.raf = requestAnimationFrame(f); }; CLK.raf = requestAnimationFrame(f); }
function clockToggle(){ CLK.real = !CLK.real; act(CLK.real ? '사건 시계 — 들인 시간 봄' : '사건 시계 — 사건 시각 봄', { ms:clockMs() }); clockRender(); clockLoop(); }
/* 프롬프트 한 줄 — [자료함] 아래(ai.js 고리) */
function clockText(){
  const c = ensureClock(); if (!c) return '';
  clockTick();
  const d = new Date(), W = '일월화수목금토', p = n => String(n).padStart(2, '0'), real = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}(${W[d.getDay()]}) ${p(d.getHours())}:${p(d.getMinutes())}`;   /* 11-17 A: 보스 — 마틴도 현실 시간을 안다(인물 설정 v2.3) */
  return `[사건 시계] 지금 ${clockSim(c.ms, c.start)} · 이 사건에 들인 시간 ${clockHuman(c.ms)} — 동료가 이 방에 있을 때만 흐르고, 나가면 멈춘다 · 동료 쪽 현실 시각 ${real}\n`;
}
/* 시작 — 위 띠 단추, 방 들고 나기, 저장 박자 */
(function clockBoot(){
  const b = $('#clk'); if (b) b.addEventListener('click', clockToggle);
  for (const [t, ev] of [[document, 'visibilitychange'], [window, 'focus'], [window, 'blur'], [window, 'pageshow'], [window, 'pagehide']]) t.addEventListener(ev, () => clockState(ev));
  setInterval(() => {
    clockTick(); if (CLK.run !== clockHere()) clockState('poll');
    if (!CLK.real) clockRender();
    const now = Date.now(); if (CLK.run && now - CLK.lastSave > 15000) clockSave(now - CLK.lastDb > 180000);
  }, 250);
  CLK.last = performance.now(); CLK.run = clockHere(); clockRender();
})();
/* 기록마다 그때 시계 — core.js 의 log 를 감싼다(A 가 log 이름을 바꾸면 이 줄만 옮긴다) */
if (typeof log === 'function'){ const logCore = log; log = function(type, data){ let clk = null; try{ clockTick(); clk = clockMs(); }catch(e){} return logCore(type, clk == null ? data : { ...(data || {}), clk }); }; }
