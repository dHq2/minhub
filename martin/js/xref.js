/* martin/js/xref.js — 맞춰 보기 (v0.14, 11-17 C). 고칠 땐 이 줄 아래에 「11-17 C: …」처럼 날짜·방 주석
   왜: 마틴이 쥔 판독문끼리 맞춰 보지 못했다 — 방이 다른 자료의 시각을 한 줄로 세우지 않았고, 한 사람의 말을 모아 부딪쳐 보지 않았고,
       결론 때 판독문 전체를 다시 훑지 않았다(handoff/v0.14-계획.md 1장 2)).
   무엇: 자료함의 판독문(S.ev[].read)과 글 원문(기기에 있으면)에서 줄을 뽑아
     · 전체 시계 — 날짜·시각이 붙은 줄을 방을 가로질러 시간순 한 줄씩(출처 자료 id). 날짜 줄과 오전/오후를 따라 정규화, 오전/오후 없는 시각은 (?) 표시
     · 인물별 발언 — 「이름(시각): 말」 꼴 줄을 사람별로
     · 판독문 없는 자료 · 판 빚(여러 번 말한 사람인데 인물 카드 없음, 뒤에 풀렸는데 옛말 그대로인 카드 메모, 오전/오후 빠진 판독)
     · 동료가 결론·전체 검토를 청하거나 새 가설이 섰을 때 「모순 쓸기」 지시
   xrefText() 는 ai.js buildPrompt 의 [자료함] 아래 고리(A)가 부른다. 수첩의 「전체 시계」 칸은 xrClockLines() 를 쓴다(notebook.js).
   읽는 판독문 모양(보스 판에서 흔한 것): 「이름(오전/오후 시:분): 말」, 날짜 줄 「2026년 11월 12일 목요일」. 그 밖에 카톡 내보내기
   「[이름] [오후 7:40] 말」·「2026. 11. 12. 오후 7:40, 이름 : 말」, 「오후 7:40 이름: 말」, 「11/12 23:42」, 「밤 11시 42분」, 「7:40 PM」 도 견딘다.
   사건 고유의 이름·말은 코드에 없다 — 전부 판독문에서 읽는다. */
const XR_WD = '일월화수목금토';
const XR_AMPM = '오전|오후|새벽|아침|낮|저녁|밤';
const XR_LABEL = new Set(('날짜 일시 시각 시간 장소 위치 내용 제목 요약 메모 참고 비고 주의 발신 수신 발신자 수신자 보낸이 받는이 방 방이름 채팅방 단톡 대화 화면 사진 프사 '
  + '이름표 상단 하단 위 아래 왼쪽 오른쪽 금액 가게 상호 결제 승인 합계 주소 전화 상태 설명 캡처 원본 글 파일 배경 영수증 카드 시계 배터리 알림 '
  + '정리 결론 근거 판단 의문 추정 짐작 사실 확인 출처 이름 기간 장면 첨부 링크 메시지 말 답 질문 판독 판독문 특이사항 특이점 메뉴 품목 수량 단가 '
  + '번호 계좌 은행 날씨 기온 제목줄 본문 보낸시각 받은시각 요일 주제 목록 순서 항목 비교 결과 예 예시 참고로 즉 한편 단 전 후 그리고 또').split(' '));
const xrYear = () => { const m = /^(\d{4})/.exec(S && S.id || ''); return m ? +m[1] : new Date().getFullYear(); };
const xrDayKey = d => `${d.y}-${String(d.mo).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
const xrDayTxt = k => { if (!k) return '날짜 모름'; const [y, m, d] = k.split('-').map(Number), w = new Date(y, m - 1, d).getDay(); return `${m}/${d}(${XR_WD[w]})`; };
/* 날짜 — 첫 것 하나 */
function xrDate(s, y0){
  let m = /(\d{4})\s*(?:년|[.\-/])\s*(\d{1,2})\s*(?:월|[.\-/])\s*(\d{1,2})\s*(?:일|\.)?/.exec(s);
  if (m && +m[2] >= 1 && +m[2] <= 12 && +m[3] >= 1 && +m[3] <= 31) return { y:+m[1], mo:+m[2], d:+m[3], i:m.index, n:m[0].length };
  m = /(\d{1,2})\s*월\s*(\d{1,2})\s*일/.exec(s);
  if (m && +m[1] >= 1 && +m[1] <= 12 && +m[2] >= 1 && +m[2] <= 31) return { y:y0, mo:+m[1], d:+m[2], i:m.index, n:m[0].length };
  m = /(?<![\d:./])(\d{1,2})\/(\d{1,2})(?![\d/])/.exec(s);
  if (m && +m[1] >= 1 && +m[1] <= 12 && +m[2] >= 1 && +m[2] <= 31) return { y:y0, mo:+m[1], d:+m[2], i:m.index, n:m[0].length };
  return null;
}
/* 시각 — 첫 것 하나. t 는 하루 안의 분, amb 는 오전/오후를 모름(1~12시) */
function xrTime(s){
  const c = [];
  let m = new RegExp(`(?:(${XR_AMPM})\\s*)?(?<![\\d:.,])(\\d{1,2}):(\\d{2})(?![\\d:])(?:\\s*(AM|PM|am|pm|a\\.m\\.|p\\.m\\.))?`).exec(s); if (m) c.push({ i:m.index, ap:m[1] || m[4] || '', h:+m[2], mi:+m[3], n:m[0].length, z:/^0\d/.test(m[2]) });
  m = new RegExp(`(${XR_AMPM})\\s*(\\d{1,2})\\s*시(?:\\s*(\\d{1,2})\\s*분|\\s*반)?`).exec(s); if (m) c.push({ i:m.index, ap:m[1], h:+m[2], mi:m[3] ? +m[3] : /반$/.test(m[0]) ? 30 : 0, n:m[0].length });
  m = /(?<!\d)(\d{1,2})\s*시\s*(\d{1,2})\s*분/.exec(s); if (m) c.push({ i:m.index, ap:'', h:+m[1], mi:+m[2], n:m[0].length });
  const x = c.sort((a, b) => a.i - b.i)[0]; if (!x || x.h > 24 || x.mi > 59) return null;
  let h = x.h, amb = false; const ap = x.ap.toLowerCase().replace(/\./g, '');
  if (/오후|저녁|밤|pm/.test(ap)){ if (h < 12) h += 12; if (ap === '밤' && x.h === 12) h = 0; }
  else if (/낮/.test(ap)){ if (h < 7) h += 12; }
  else if (/오전|아침|새벽|am/.test(ap)){ if (h === 12) h = 0; }
  else if (h >= 1 && h <= 12 && !x.z) amb = true;   /* 「01:05」처럼 앞에 0 이 붙으면 24시간 표기로 본다 */
  if (h === 24) h = 0;
  return { t:h * 60 + x.mi, amb, i:x.i, n:x.n };
}
const xrTimeTxt = (t, amb) => { const h = Math.floor(t / 60), mi = String(t % 60).padStart(2, '0'); if (amb) return `${h}:${mi}(오전·오후?)`; return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${mi}`; };
const xrKey = w => String(w || '').replace(/[\s"'“”‘’「」『』]/g, '').replace(/님$/, '');
function xrName(w){
  w = String(w || '').replace(/^[\s\-•*·>]+|[\s"'“”‘’「」『』]+$/g, '').replace(/^["'“‘「『]/, '').trim();
  if (!w || w.length > 14 || /[:：()（）\[\]{}…]/.test(w) || /^\d+$/.test(w) || /\s\d+$/.test(w) || /^[enmph]\d+$/.test(w) || w.split(/\s+/).length > 3) return '';
  if (XR_LABEL.has(w.replace(/\s+/g, '')) || /^(?:\d+|[0-9.\-/ ]+)$/.test(w) || /(?:시|분|원|개|장|줄|번|건|일|월|년)$/.test(w) && /\d/.test(w)) return '';
  return w;
}
const xrQuote = s => String(s || '').trim().replace(/^["'“‘「『]+|["'”’」』]+$/g, '').trim();
/* 줄 하나 → { who, say, time, day } */
function xrLine(L, y0){
  let line = L.replace(/^[\s\-•*·>]+/, '').trim(); if (!line) return null;
  const d = xrDate(line, y0);
  const rest = d ? (line.slice(0, d.i) + line.slice(d.i + d.n)).replace(/[\s\-=─—_,.()（）]|[일월화수목금토]요일|^\s*$/g, '') : line;
  if (d && rest.length <= 2) return { head:d };   /* 날짜 줄 */
  let who = '', say = '', tm = null, m;
  if ((m = /^\[([^\]]{1,20})\]\s*\[([^\]]{2,14})\]\s*(.*)$/.exec(line))){ who = xrName(m[1]); tm = xrTime(m[2]); say = m[3]; }   /* 카톡 PC 내보내기 */
  else if ((m = new RegExp(`^(?:\\d{4}\\s*[.\\-/년]\\s*\\d{1,2}\\s*[.\\-/월]\\s*\\d{1,2}\\s*[.일]?\\s*)?((?:${XR_AMPM})\\s*\\d{1,2}:\\d{2})\\s*,\\s*([^:：]{1,20}?)\\s*[:：]\\s*(.*)$`).exec(line))){ who = xrName(m[2]); tm = xrTime(m[1]); say = m[3]; }   /* 카톡 폰 내보내기 */
  else {
    let s2 = line; if (d && d.i <= 1) s2 = s2.slice(d.i + d.n).trim();
    const t0 = xrTime(s2); if (t0 && t0.i <= 1){ tm = t0; s2 = s2.slice(t0.i + t0.n).replace(/^[\s,·\-—]+/, ''); }
    if ((m = /^["「『]?([^():：「」"\[\]]{1,20}?)["」』]?\s*(?:[(（][^)）]{0,40}[)）]\s*)*?[(（]([^)）]{0,40})[)）]\s*[:：]\s*(.*)$/.exec(s2))){ who = xrName(m[1]); const t1 = xrTime(m[2]); if (t1) tm = t1; const d1 = xrDate(m[2], y0); if (d1) return { who, say:m[3], tm, day:d1 }; say = m[3]; }   /* 이름(시각): 말 — 「노란 말풍선(이 방 주인 쪽으로 보임)(오후 7:40): 말」처럼 설명 괄호가 앞에 붙어도(ai.js READ_RULE) */
    else if ((m = /^([^:：()（）]{1,16}?)\s*[:：](?!\d{2}(?!\d))\s*(.+)$/.exec(s2))){   /* 「7:55」의 : 는 이름 뒤 : 가 아니다 */ who = xrName(m[1]); say = m[2]; }
    else if (tm){ say = s2; }
    if (!who && !tm){ const t2 = xrTime(line); if (t2) tm = t2; say = line; }
  }
  if (!who && !tm) return d ? { day:d, say:line } : null;
  return { who, say:xrQuote(say || line), tm, day:d };
}
/* 자료 하나의 줄들 */
function xrParse(text, ev){
  const out = [], y0 = xrYear(); let ctx = null, ctxY = y0;
  const lines = String(text || '').split(/\r?\n| \/ | · /).slice(0, 600);
  for (const L of lines){
    const r = xrLine(L, ctxY); if (!r) continue;
    if (r.head){ ctx = r.head; ctxY = r.head.y; continue; }
    if (r.day){ ctx = r.day; ctxY = r.day.y; }
    if (!r.tm && !r.who) continue;
    out.push({ ev, day:(r.day || ctx) ? xrDayKey(r.day || ctx) : '', t:r.tm ? r.tm.t : null, amb:!!(r.tm && r.tm.amb), who:r.who || '', say:String(r.say || '').slice(0, 220) });
  }
  return out;
}
/* 판독문 + 글 원문 → 줄 전부(겹치는 줄은 출처만 합침) */
function xrItems(){
  if (!S) return [];
  if (typeof ensureEv === 'function') ensureEv();
  const all = [], seen = new Map();
  for (const e of S.ev || []){
    let src = e.read || '';
    if (e.kind !== 'photo'){ let raw = ''; try{ raw = localStorage.getItem(`drmartin.ev.${S.id}.${e.id}`) || ''; }catch(x){} src = [e.read || '', raw || (!e.read ? e.head || '' : '')].filter(Boolean).join('\n'); }
    for (const it of xrParse(src, e.id)){
      const k = [it.day, it.t, xrKey(it.who), it.say.replace(/\s/g, '').slice(0, 18)].join('|');
      const o = seen.get(k); if (o){ if (!o.evs.includes(e.id)) o.evs.push(e.id); continue; }
      it.evs = [e.id]; seen.set(k, it); all.push(it);
    }
  }
  return all;
}
const xrSort = (a, b) => (a.day || '9') < (b.day || '9') ? -1 : (a.day || '9') > (b.day || '9') ? 1 : a.t - b.t;
function xrClock(items){ return (items || xrItems()).filter(x => x.t != null).sort(xrSort); }
/* 수첩 「전체 시계」 칸·프롬프트가 같이 쓰는 한 줄 */
const xrRow = (x, cut) => `${xrDayTxt(x.day)} ${xrTimeTxt(x.t, x.amb)} ${x.who ? x.who + ': ' : ''}${cut ? x.say.slice(0, cut) + (x.say.length > cut ? '…' : '') : x.say} [${x.evs.join(' ')}]`;
function xrClockLines(){ return xrClock().map(x => ({ day:xrDayTxt(x.day), time:xrTimeTxt(x.t, x.amb), who:x.who, say:x.say, evs:x.evs, amb:x.amb })); }
/* 길면 줄이기 — 날마다 앞뒤를 남기고 가운데를 접는다 */
function xrFit(rows, budget){
  let cut = 70; const mk = () => rows.map(x => xrRow(x, cut));
  let lines = mk(); while (lines.join('\n').length > budget && cut > 26){ cut -= 12; lines = mk(); }
  if (lines.join('\n').length <= budget) return lines;
  const per = Math.max(4, Math.floor(budget / 60 / Math.max(1, new Set(rows.map(r => r.day)).size)));
  const out = []; let day = null, buf = [];
  const flush = () => { if (buf.length > per){ const h = Math.ceil(per / 2); out.push(...buf.slice(0, h), `  …(${xrDayTxt(day)} ${buf.length - per}줄 접음)`, ...buf.slice(buf.length - (per - h))); } else out.push(...buf); buf = []; };
  rows.forEach((r, i) => { if (r.day !== day){ flush(); day = r.day; } buf.push(lines[i]); }); flush();
  return out;
}
/* 판 빚 */
const XR_STOP = new Set('그리고 그런데 하지만 그래서 있다 없다 했다 한다 된다 이다 아니다 것이다 같다 보인다 그녀 그는 이것 저것 그것 자료 판독 사진 카드 메모 확인 미확정 미상 불명 모름'.split(' '));
const xrToks = s => new Set((String(s || '').match(/[가-힣A-Za-z0-9]{2,}/g) || []).map(w => w.replace(/(?:은|는|이|가|을|를|의|에|에서|으로|로|과|와|도|만|께|에게|한테|이다|였다|이었다)$/, '')).filter(w => w.length >= 2 && !XR_STOP.has(w)));
function xrDebts(items){
  const out = [];
  const persons = S.nodes.filter(n => n.kind === 'person'), pk = persons.map(n => xrKey(n.title));
  const has = w => { const k = xrKey(w); return pk.some(p => p && (p.includes(k) || k.includes(p.slice(0, Math.max(2, Math.min(3, p.length)))))); };
  const by = new Map(); for (const x of items) if (x.who){ const k = xrKey(x.who); const o = by.get(k) || { who:x.who, n:0, evs:new Set() }; o.n++; x.evs.forEach(e => o.evs.add(e)); by.set(k, o); }
  const miss = [...by.values()].filter(o => (o.n >= 2 || o.evs.size >= 2) && !has(o.who) && !/말풍선|^나$|^상대|^발신|익명|모름|미상|^\?/.test(o.who)).sort((a, b) => b.n - a.n).slice(0, 6);
  for (const o of miss) out.push(`「${o.who}」 — ${o.n}번 말함(${[...o.evs].join(' ')})인데 인물 카드가 없다. 누군지 짐작이 서면 person 카드로 꽂아라`);
  const known = (S.notes || []).filter(n => n.done && n.a || n.k === 'fact' && !n.done);
  for (const c of S.nodes){
    if (!c.note || !/미확정|미상|불명|모른다|모름|확인 안|확인되지|안 됨|알 수 없|없다/.test(c.note)) continue;
    const ct = xrToks(c.title + ' ' + c.note);
    const hit = known.find(n => { const nt = xrToks(n.t + ' ' + (n.a || '')); let k = 0; for (const w of nt) if (ct.has(w)) k++; return k >= 2 && !/미확정|미상|불명|모른다|모름/.test(n.a || n.t); });
    if (hit) out.push(`${c.id}「${c.title}」 메모가 「${c.note.slice(0, 40)}」 그대로인데 수첩 ${hit.id} 에 「${(hit.a || hit.t).slice(0, 40)}」 — 맞으면 카드 메모를 edit 로 고쳐라`);
    if (out.length > 9) break;
  }
  const amb = new Map(); for (const x of items) if (x.amb) for (const e of x.evs) amb.set(e, (amb.get(e) || 0) + 1);
  for (const [e, n] of amb) out.push(`${e} 판독문에 오전·오후 없는 시각 ${n}개 — 원본에서 오전·오후를 가려 read 로 고쳐 적어라`);
  return out.slice(0, 12);
}
const XR_SWEEP_ASK = /결론|정리해|정리 좀|종합|총정리|전체적|전부 다시|다시 (?:훑|검토|봐|살펴)|처음부터|무슨 일이 있었|진실|범인|진범|누가 (?:한|했|그랬|죽|가져)|최종|검토|맞춰 ?보|모순|어긋|앞뒤가|말이 안 맞|사건의 전말|전말|재구성/;
function xrSweepWhy(){
  const lastP = [...(S.log || [])].reverse().find(l => l.who === 'p');
  if (lastP && XR_SWEEP_ASK.test(lastP.text || '')) return '동료가 결론·전체 검토를 청했다';
  for (const p of S.probs || []) for (const h of p.hy || []) if (h.st === 'live' && S.turn > 0 && h.turn === S.turn) return `새 가설 ${h.id}「${h.t.slice(0, 30)}」이 섰다`;
  return '';
}
function xrefText(){
  if (!S) return '';
  const items = xrItems(), clock = xrClock(items), out = [];
  out.push(`\n[맞춰 보기 — 앱이 판독문·글 원문에서 뽑은 것. 「~가 없다·화면에 없다」고 말하기 전에 여기와 자료함을 먼저 본다. 시각은 판독문 그대로 옮겨 정렬했고, 오전·오후가 빠진 건 (오전·오후?)]`);
  out.push(`전체 시계(방을 가로질러 시간순, [ ]는 출처 자료):`);
  out.push(clock.length ? xrFit(clock, 3400).map(l => '  ' + l).join('\n') : '  (아직 시각이 붙은 판독 줄이 없다)');
  const by = new Map(); for (const x of items) if (x.who){ const k = xrKey(x.who); (by.get(k) || by.set(k, []).get(k)).push(x); }
  const people = [...by.values()].filter(l => l.length >= 1).sort((a, b) => b.length - a.length).slice(0, 10);
  if (people.length){
    out.push(`인물별 발언(한 사람의 말끼리 부딪쳐 볼 것):`);
    let budget = 2600;
    for (const l of people){
      const s = l.slice().sort(xrSort), evs = [...new Set(s.flatMap(x => x.evs))];
      const said = s.map(x => `${x.t != null ? xrDayTxt(x.day).replace(/\(.\)/, '') + ' ' + xrTimeTxt(x.t, x.amb) + ' ' : ''}「${x.say.slice(0, 50)}${x.say.length > 50 ? '…' : ''}」`);
      let line = `  · ${s[0].who} (${s.length}줄 · ${evs.join(' ')}): ${said.join(' / ')}`;
      if (line.length > Math.max(160, budget / 3)) line = line.slice(0, Math.max(160, Math.floor(budget / 3))) + '…';
      budget -= line.length; out.push(line); if (budget < 200) break;
    }
  }
  const noRead = (S.ev || []).filter(e => !e.read);
  if (noRead.length) out.push(`판독문 없는 자료(속을 아직 글로 안 옮김 — 필요하면 look 으로 원본을 청해 read 로 적어라): ${noRead.map(e => `${e.id} ${e.kind === 'photo' ? '사진' : '글'}「${(typeof evTitle === 'function' ? evTitle(e) : e.title || '').slice(0, 24)}」${e.kind !== 'photo' ? '(원문은 위 시계에 들어감)' : ''}`).join(', ')}`);
  const debts = xrDebts(items);
  if (debts.length) out.push(`판 빚(갚을 것):\n${debts.map(d => '  - ' + d).join('\n')}`);
  out.push(`수첩 적는 법: 같은 말은 다시 적지 않는다(앱이 비슷한 줄을 합친다). 새 짐작·사실이 옛 짐작을 덮으면 그 notes 줄에 "over":"m12" 처럼 덮는 수첩 id 를 붙인다. 「~일 수 있다·~인 듯」은 사실(fact)이 아니라 짐작(guess)으로, 말한 그대로 적는다.`);
  const why = xrSweepWhy();
  if (why) out.push(`[모순 쓸기 — 이번 답에서 꼭 · ${why}] 결론을 말하기 전에 위 전체 시계·인물별 발언과 자료함 판독문 전체를 처음부터 다시 훑는다. ① 한 사람의 말끼리(앞뒤가 맞나) ② 다른 사람의 말과(같은 일을 다르게 말하나) ③ 시각끼리(그 시각에 그 일이 될 수 있나, 순서가 뒤집혔나) 부딪쳐 본다. 다른 걸 말하는 문장 속에 섞여 지나간 단서도 본다. 어긋나는 것은 수첩 의문(q)으로 적고, 결론은 그 어긋남까지 설명할 수 있을 때만 낸다.`);
  return out.join('\n') + '\n';
}
