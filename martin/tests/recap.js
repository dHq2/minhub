// 사건 복기본 점검 v1.0 (2026-11-17, D) — 「기록 전체 복사」가 계정+기기 기록을 모아 사건 전부를 한 번씩 담는지. 가짜 사건(김지민). 폰 화면.
// 쓰는 법: bash martin/tests/run.sh recap   (복기본 전문 /tmp/martin-복기본.txt — 꼭 열어 읽어 본다)
const { chromium } = require('playwright');
const fs = require('fs');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const CID = '20261117-rcap', T0 = 1794800000000;
const IMG = 'data:image/jpeg;base64,/9j/AAAA';
const ACC = {   // 계정 저장소 — 다른 기기(폰)에서 한 것
  logs: [{ cid:CID, sid:'phone1', k:0, items:[
    { ts:T0 + 1000, sid:'phone1', cid:CID, type:'action', act:'열기', w:384, h:800 },
    { ts:T0 + 2000, sid:'phone1', cid:CID, type:'action', act:'사진 크게', id:'n4', title:'금고 앞 사진' },
    { ts:T0 + 3000, sid:'phone1', cid:CID, type:'memory', n:1, board:{ nodes:[{ id:'n1', kind:'brief', title:'금고 사건', note:'' }, { id:'n7', kind:'clue', title:'버려진 열쇠고리', note:'경비실 쓰레기통', face:IMG }], links:[{ a:'n7', b:'n3', label:'떨굼?', sure:false }], notes:[{ id:'m9', k:'guess', t:'지민이 열쇠를 숨겼다', by:'you', turn:1 }] } },
    { ts:T0 + 4000, sid:'phone1', cid:CID, type:'action', act:'카드 뗌', id:'n7' },
    { ts:T0 + 5000, sid:'phone1', cid:CID, type:'action', act:'유일한폰행동표시' } ] }],
  turns: [
    { cid:CID, n:1, ts:T0 + 2500, sid:'phone1', type:'turn', ok:true, model:'claude-sonnet-5-5', effort:'medium', ms:7000, prompt:'(긴 프롬프트)', response:{ say:['봐라.'], ops:[{ op:'add', id:'n7', kind:'clue', title:'버려진 열쇠고리' }], read:[{ id:'e1', t:'옛판독: 금고 앞, 사람 없음' }], notes:[{ k:'guess', t:'지민이 열쇠를 숨겼다' }] } },
    { cid:CID, n:2, ts:T0 + 6000, sid:'pc1', type:'turn', ok:true, model:'claude-sonnet-5-5', effort:'medium', ms:6000, prompt:'(긴 프롬프트)', response:{ say:['이어졌군.'], ops:[{ op:'remove', id:'n7' }], read:[{ id:'e1', t:'새판독: 금고 앞, 박팀장 그림자' }], pz:[{ op:'hyp', p:'p1', id:'h1', t:'박팀장이 열었다', c:60, b:['n3'] }] } } ],
  evid: [{ cid:CID, id:'e2', name:'경비일지.txt', text:'경비일지 원문 첫줄\n23:20 출입 박팀장\n원문끝표시ZZZ' }]
};
const SEED = { v:3, id:CID, at:T0 + 7000, turn:2, nid:8, suspect:'n3',
  nodes:[{ id:'n1', kind:'brief', title:'금고 사건', note:'가짜상사 금고가 열렸다', x:1000, y:900, r:0 }, { id:'n3', kind:'person', title:'박팀장', note:'23:20 출입', x:900, y:1100, r:0 }, { id:'n4', kind:'photo', title:'금고 앞 사진', note:'', img:IMG, thumb:IMG, x:1150, y:1100, r:0 }],
  links:[{ id:'n3-n4', a:'n3', b:'n4', label:'그림자', sure:true }],
  ev:[{ id:'e1', kind:'photo', card:'n4', title:'금고 앞 사진', at:T0 + 2000, turn:1, read:'새판독: 금고 앞, 박팀장 그림자', readTurn:2, thumb:IMG }, { id:'e2', kind:'text', card:null, title:'경비일지', name:'경비일지.txt', at:T0 + 5500, turn:2, read:'경비일지 판독', len:40 }], emax:2,
  notes:[{ id:'m1', k:'q', t:'금고 비번은 누가 아나', by:'you', turn:1, done:1, a:'박팀장만 안다', doneTurn:2 }, { id:'m2', k:'me', t:'박팀장 차 확인', by:'me', turn:2 }], nmax:9,
  probs:[{ id:'p1', root:1, st:'open', t:'무슨 일이 있었나 — 이 사건의 진실', up:null, by:'you', hy:[{ id:'h1', t:'박팀장이 열었다', c:60, b:['n3'], why:'그림자', st:'live', hist:[[2, 60]] }], log:[{ t:'h1 세움 60%', turn:2, by:'you' }] }], pfocus:'p1', pgone:[{ id:'p2', t:'열쇠는 어디', into:null, why:'판으로 충분', who:'you', turn:2 }],
  log:[{ who:'p', text:'금고 사진 가져왔다', at:T0 + 2000, photos:['n4'] }, { who:'m', text:'봐라.', at:T0 + 2600 }, { who:'p', text:'경비일지도 있어', at:T0 + 5500, files:['경비일지.txt'], viewing:'n4' }, { who:'m', text:'이어졌군.', at:T0 + 6100 }],
  hyp:{ n:0, title:'', body:'', confidence:0, culprit:null, alts:[] }, memo:[] };
const DEV = [   // 이 기기 기록 — 계정과 한 줄 겹침
  { ts:T0 + 5000, sid:'phone1', cid:CID, type:'action', act:'유일한폰행동표시' },
  { ts:T0 + 6500, sid:'pc1', cid:CID, type:'action', act:'컴에서만한행동표시' },
  { ts:T0 + 6600, sid:'pc1', cid:'다른사건', type:'action', act:'다른사건행동' } ];
(async () => {
  const b = await chromium.launch(), errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport:{ width:412, height:915 }, deviceScaleFactor:2 });
  p.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack || '').split('\n')[1]));
  await p.addInitScript(acc => { const docs = {}; for (const c of Object.keys(acc)) acc[c].forEach((d, i) => docs[c + '/' + i] = d);
    const snap = d => ({ exists:!!d, data:() => JSON.parse(JSON.stringify(d)) });
    const coll = name => { let f = null; const q = { where:(k, op, v) => { f = [k, v]; return q; }, orderBy:() => q, limit:() => q,
      get:async () => ({ docs:Object.entries(docs).filter(([k, d]) => k.startsWith(name + '/') && (!f || d[f[0]] === f[1])).map(([, d]) => snap(d)) }) }; return q; };
    window.claude = { use:async n => n === 'db' ? { doc:path => ({ get:async () => snap(docs[path]), set:async d => { docs[path] = d; } }), collection:coll } : null }; }, ACC);
  await p.addInitScript(([s, dev]) => { if (!sessionStorage.getItem('rc')){ localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); localStorage.setItem('drmartin.log', dev); sessionStorage.setItem('rc', 1); } }, [JSON.stringify(SEED), JSON.stringify(DEV)]);
  await p.goto(URL); await p.waitForTimeout(3500);
  await p.evaluate(() => logSheet()); await p.waitForTimeout(300);
  await p.click('[data-s="copylog"]'); await p.waitForFunction(() => window.__recap, null, { timeout:20000 });
  const t = await p.evaluate(() => window.__recap); fs.writeFileSync('/tmp/martin-복기본.txt', t);
  const has = (s, what) => want(t.includes(s), what + ' — ' + s);
  for (const h of ['1. 사건 파일', '2. 난제 지도', '3. 지금 판', '4. 지금 판 — 실', '5. 판에서 사라진', '6. 자료함', '7. 수사 수첩', '8. 대화 전사', '9. 마틴의 턴', '10. 행동 기록']) has('## ' + h, '칸');
  has('n7 [단서] 버려진 열쇠고리 — 경비실 쓰레기통', '판에서 떼어진 카드(다른 기기 기억에서)');
  has('카드 뗌', '떼어진 까닭');
  has('실 n7 ↔ n3 : 떨굼?', '사라진 실');
  has('새판독: 금고 앞, 박팀장 그림자', '지금 판독문');
  has('옛판독: 금고 앞, 사람 없음', '바뀌기 전 판독문');
  has('원문끝표시ZZZ', '붙여 넣은 글 원문 전문(계정 evid)');
  has('지민이 열쇠를 숨겼다', '지워진 수첩 줄');
  has('→ 풀림(턴 2): 박팀장만 안다', '풀린 수첩 줄');
  has('p2 「열쇠는 어디」', '사라진 난제');
  has('확신 이력 턴2:60%', '가설 확신 이력');
  has('(보면서: n4 「금고 앞 사진」)', '대화의 보면서 꼬리표');
  has('(파일 건넴: 경비일지.txt)', '대화의 건넨 파일');
  has('"op":"remove","id":"n7"', '마틴의 판 고침');
  has('컴에서만한행동표시', '이 기기에만 있는 행동');
  want(t.split('유일한폰행동표시').length - 1 === 1, '계정·기기에 겹친 기록은 한 번만');
  want(!t.includes('다른사건행동'), '다른 사건 기록은 안 섞임');
  want(!/data:image|base64/.test(t), '그림 글자(data:) 없음');
  want(!t.includes('(긴 프롬프트)'), '프롬프트 전문은 안 넣음(대화·턴·판독문으로 충분)');
  want(/접속 3번/.test(t), '접속 수(폰·컴·지금 화면) ' + (t.match(/접속 \d+번[^\n]*/) || [''])[0]);
  const raw = await p.evaluate(async () => recapRaw());
  want(raw.includes('원문끝표시ZZZ') && raw.includes('유일한폰행동표시') && !/data:image/.test(raw), '날것(JSON)에도 계정 기록·원문, 그림 글자 없음');
  want(!errs.length, '페이지 오류 ' + JSON.stringify(errs));
  console.log(`  복기본 ${Math.round(t.length / 1024)}KB · ${t.split('\n').length}줄 → /tmp/martin-복기본.txt`);
  await b.close(); console.log(bad ? `실패 ${bad}` : '전부 통과'); process.exit(bad ? 1 : 0);
})();
