const { chromium } = require('playwright'); const path = require('path');
// v1.0 (2026-11-13, C) 인간관계 프로필 사진 — 기록부 사진칸으로 넣기·빼기, 성별 기본 얼굴, 채팅 사진으로 세희가 넣기(photo), 다시 켜도 남음, 떼면 사진도 지움
const FACE = path.join(__dirname, 'img', 'face.jpg');
(async () => { const b = await chromium.launch();
  for (const [name, opt] of [['폰', { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true }], ['컴', { viewport:{ width:1366, height:860 } }]]){
    const ctx = await b.newContext({ ...opt, serviceWorkers:'block' }); const p = await ctx.newPage();
    const tap = sel => name === '폰' ? p.locator(sel).first().tap() : p.locator(sel).first().click();
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
    await p.evaluate(async () => { await pplLoad(); PPL.list.push(
      { id:'pa', name:'김지영 조교', rel:'같이 일하는 조교', group:'직장', sex:'여', note:'', notes:[], links:[], at:Date.now() },
      { id:'pb', name:'박준호', rel:'중2 학생 아버지', group:'학생·학부모', sex:'남', note:'', notes:[], links:[], at:Date.now() },
      { id:'pc', name:'한서연', rel:'친구', group:'친구', note:'', notes:[], links:[], at:Date.now() }); await pplSave(); await dwOpen('people'); });
    await p.waitForTimeout(900);
    const faces = () => p.evaluate(() => [...document.querySelectorAll('#ppMap .pp-node')].map(n => n.dataset.pp + ':' + (n.querySelector('.ph img.pic') ? '사진' : n.querySelector('.ph svg.sil') ? '기본얼굴' : '글자 ' + n.querySelector('.ph').textContent)).join(' '));
    console.log(name, '처음 카드', await faces());
    await p.screenshot({ path:`/tmp/pplpic-${name}-0.png` });
    // 기록부 사진칸 → 사진 넣기
    await p.evaluate(() => pdOpen('pc')); await p.waitForTimeout(500);
    await tap('#pdBody [data-pdpic]'); await p.waitForTimeout(350);
    const sheetUp = await p.evaluate(() => { const r = $('sheet').getBoundingClientRect(), el = document.elementFromPoint(r.left + r.width / 2, r.top + 30); return $('sheet').classList.contains('on') && !!(el && el.closest('#sheet')); });
    console.log(name, '사진 판이 기록부 위에 보임', sheetUp);
    await p.screenshot({ path:`/tmp/pplpic-${name}-1.png` });
    const [fc] = await Promise.all([p.waitForEvent('filechooser'), tap('[data-pic="pick"]')]); await fc.setFiles(FACE); await p.waitForTimeout(900);
    const one = await p.evaluate(() => { const u = PPL.pics.pc || ''; return { kb:Math.round(u.length / 1024), jpeg:u.startsWith('data:image/jpeg'), recImg:!!document.querySelector('#pdBody .pd-photo img.pic'), mapImg:!!document.querySelector('#ppMap [data-pp="pc"] .ph img.pic') }; });
    console.log(name, '사진 넣음', JSON.stringify(one));
    await p.screenshot({ path:`/tmp/pplpic-${name}-2.png` });
    // 성별 바꾸기(사진 판에서) — 한서연에게 여성, 사진이 있으니 사진이 우선
    await tap('#pdBody [data-pdpic]'); await p.waitForTimeout(300); await tap('[data-pic="sex"][data-v="여"]'); await p.waitForTimeout(300);
    console.log(name, '성별', await p.evaluate(() => pplFind('pc').sex), '| 기록부 성별 줄', await p.evaluate(() => [...document.querySelectorAll('#pdBody .pd-kv th')].some(t => t.textContent === '성별')));
    // 사진 빼기(두 번 눌러야)
    await tap('[data-pic="del"]'); await p.waitForTimeout(150); const armed = await p.evaluate(() => !!PPL.pics.pc);
    await tap('[data-pic="del"]'); await p.waitForTimeout(400);
    console.log(name, '빼기 한 번엔 그대로', armed, '| 두 번 뒤 사진', await p.evaluate(() => !!PPL.pics.pc), '| 이제 카드', await p.evaluate(() => document.querySelector('#ppMap [data-pp="pc"] .ph svg.sil') ? '기본얼굴(여)' : '?'));
    await p.evaluate(() => pdClose());
    // 채팅 사진으로 세희가 넣기 — 보스 말에 사진 2장, 2번째를 박준호 프로필로
    const r = await p.evaluate(async () => { const blob = await (await fetch('/tests/img/face.jpg')).blob(), blob2 = await (await fetch('/tests/img/short.png')).blob();
      const at = Date.now(); O.log.push({ who:'u', text:'이 사진 박준호 아버님 프사로 해줘', at, pics:2 }); O.thumbs[at] = [URL.createObjectURL(blob2), URL.createObjectURL(blob)];
      const r1 = await runPeopleTool({ name:'update_person', args:{ person:'박준호', photo:2 } });
      const r2 = await runPeopleTool({ name:'add_person', args:{ name:'이수민', group:'친구', sex:'여', photo:1 } });
      const r3 = await runPeopleTool({ name:'update_person', args:{ person:'나', photo:2 } });
      return { r1, r2, r3, pb:Math.round((PPL.pics.pb || '').length / 1024), add:!!PPL.pics[r2.id], me:!!PPL.pics.me, sex2:pplFind('이수민').sex, notes:O.log.filter(m => m.board).slice(-3).map(m => m.text) }; });
    console.log(name, '채팅 사진', JSON.stringify(r));
    const r4 = await p.evaluate(async () => { O.log = O.log.filter(m => !O.thumbs[m.at]); return runPeopleTool({ name:'update_person', args:{ person:'김지영 조교', photo:1 } }); });
    console.log(name, '사진 없이 photo', JSON.stringify(r4).slice(0, 90));
    console.log(name, '세희가 읽는 맥락', await p.evaluate(async () => { const c = await pplContext(); return c.includes('김지영 조교 · 같이 일하는 조교 · 직장 · 여') && c.includes('박준호 · 중2 학생 아버지 · 학생·학부모 · 남'); }),
      '| 도구에 photo·sex', await p.evaluate(() => { const t = PEOPLE_TOOLS(); return !!(t[0].schema.properties.photo && t[1].schema.properties.sex); }));
    await p.evaluate(() => pplRender(true)); await p.waitForTimeout(400);
    console.log(name, '나중 카드', await faces(), '| 나 사진', await p.evaluate(() => !!document.querySelector('#ppMap .pp-me .ph img')));
    await p.screenshot({ path:`/tmp/pplpic-${name}-3.png` });
    // 다시 켜도 남음 + 동기화 목록
    await p.reload(); await p.waitForTimeout(1800);
    console.log(name, '다시 켬', await p.evaluate(async () => { PPL.list = null; PPL.pics = null; await pplLoad(); return Object.keys(PPL.pics).sort().length + '장 · 동기화 ' + SYNC_KV.includes('pplpics'); }));
    // 떼면 사진도
    console.log(name, '떼기', await p.evaluate(async () => { await runPeopleTool({ name:'remove_person', args:{ person:'박준호' } }); return 'pb 사진 ' + !!PPL.pics.pb; }));
    // 사람 붙이기 판에서 성별
    await p.evaluate(() => pplAddSheet()); await p.waitForTimeout(300);
    await p.fill('#ppNewName', '최가은'); await p.selectOption('#ppNewSex', '여'); await tap('[data-pact="add"]'); await p.waitForTimeout(400);
    console.log(name, '붙이기 판 성별', await p.evaluate(() => pplFind('최가은') && pplFind('최가은').sex));
    // 고치기 화면에서 성별
    await p.evaluate(() => pdOpen(pplFind('최가은').id)); await p.waitForTimeout(400); await tap('#pdEdit'); await p.waitForTimeout(300);
    await p.selectOption('#pdSex', '남'); await tap('#pdEdit'); await p.waitForTimeout(300);
    console.log(name, '고치기 성별', await p.evaluate(() => pplFind('최가은').sex));
    await p.screenshot({ path:`/tmp/pplpic-${name}-4.png` });
    await ctx.close();
  }
  await b.close(); })();
