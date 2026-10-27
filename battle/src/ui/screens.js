/* 화면: 막사(홈) · 동료 카드 · 장비 창 · 관계 창 · 결과 · 조작법 · 전투 기록. 모두 DOM 문자열 + 이벤트 한 곳. */
GB.Screens = function (app) { this.app = app; };
GB.Screens.esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const esc = GB.Screens.esc;

GB.Screens.prototype = {
  modal(html, bind) {
    const m = GB.UI.$('modal'), box = GB.UI.$('modalBox');
    box.innerHTML = html; m.classList.remove('hidden');
    if (bind) bind(box);
  },
  closeModal() { GB.UI.$('modal').classList.add('hidden'); },

  // ---------- 동료 카드 ----------
  statLine(p) {
    const s = E.statsOf(p, GB.makeRules());
    return '체력 ' + s.hp + ' · 공격 ' + s.atk + ' · 걸음 ' + s.spd + (s.rng > 1 ? ' · 사거리 ' + s.rng : '');
  },
  gradeChips(p) {
    return (p.traits || []).filter(t => /[SABCDE]$/.test(t) && t.length === 3).map(t => '<span class="tg">' + esc(t) + '</span>').join('');
  },
  card(p, extra) {
    const K = GB.KINDS[GB.kindOf(p)], g = p.gear || {};
    return '<div class="card' + (extra ? ' new' : '') + '" data-uid="' + esc(p.uid) + '">' +
      '<div class="nm">' + K.icon + ' ' + esc(p.name) + (p.skill && p.skill.kit ? ' <span class="red">✚</span>' : '') + (extra ? ' <span class="badge">신규</span>' : '') + '</div>' +
      '<div>' + K.name + ' · ' + p.sizeCls + ' · ' + esc(p.weapon) + (p.shield ? ' + 방패' : '') + '</div>' +
      '<div class="st">몸 ' + (g.몸 ? esc(g.몸.mat) + g.몸.tier + '성' : '맨몸') + ' · 머리 ' + (g.머리 ? '투구' : '없음') + '</div>' +
      '<div class="st">' + this.statLine(p) + '</div>' +
      '<div>' + this.gradeChips(p) + '</div>' +
      '<div class="st">승리 ' + (p.wins || 0) + ' · 처치 ' + (p.kills || 0) + (p.cg ? ' · 전우조' : '') + (p.chiefNm ? ' · 대장 ' + esc(p.chiefNm) : '') + '</div>' +
      (extra ? '' : '<div class="row"><button class="btn sm" data-eq="' + esc(p.uid) + '">장비</button><button class="btn sm" data-rel="' + esc(p.uid) + '">관계</button></div>') + '</div>';
  },

  renderHome() {
    const app = this.app, run = app.run, $ = GB.UI.$;
    $('homeSub').innerHTML = '단계 <b>' + run.stage + '</b> · 보유 <b>' + run.roster.length + '</b>명 · 창고 ' + run.stash.length + '개 · 누적 승리 ' + run.totalWins + ' · 최고 ' + run.best + '단계' +
      '<br>승리하면 랜덤 동료가 합류하고, 쓰러진 동료는 영구 손실입니다. 판에서 한 일대로 특성 등급이 오르고, 쓰러진 몸의 장비는 전리품으로 모입니다.';
    $('rosterCards').innerHTML = run.roster.map(p => this.card(p)).join('') || '<div class="sub">보유 동료가 없습니다. 새 런을 시작하세요.</div>';
    $('btnStart').disabled = run.over || !run.roster.length;
    $('btnStart').textContent = run.over ? '런 종료됨' : '전투 시작 (단계 ' + run.stage + ')';
    this.renderStash(); this.renderLogs();
  },
  renderStash() {
    const run = this.app.run, el = GB.UI.$('stashList');
    el.innerHTML = run.stash.length ? run.stash.map(it => {
      const who = GB.Loot.bestFor(run.roster, it);
      return '<div class="logrow"><span>' + esc(GB.Loot.label(it)) + '<br><span class="dim">' + ({ weapon: '무기', shield: '방패', armor: '갑옷', helm: '투구' }[it.k] || it.k) + (it.size ? ' · ' + it.size : '') + (who ? ' · ★ ' + esc(who.name) + '에게 알맞음' : ' · 맞는 동료 없음') + '</span></span>' +
        '<span class="row">' + (who ? '<button class="btn sm" data-eqto="' + esc(it.id) + '|' + esc(who.uid) + '">입히기</button>' : '') + '<button class="btn sm danger" data-del="' + esc(it.id) + '">버리기</button></span></div>';
    }).join('') : '<div class="sub">창고가 비었어요. 쓰러진 몸의 장비는 판이 끝나면 여기로 모여요.</div>';
  },
  renderLogs() {
    const list = GB.Store.listLogs().slice().reverse(), el = GB.UI.$('logsList');
    this._logs = list;
    el.innerHTML = list.length ? list.map((lg, i) => '<div class="logrow"><span>단계 ' + lg.stage + ' · ' + ({ win: '승리', lose: '패배', time: '시간 초과' }[lg.result] || lg.result) + ' · ' + lg.t + 's · 사건 ' + lg.events.length +
      '<br><span class="dim">' + (lg.at || '').slice(0, 16).replace('T', ' ') + '</span></span><span class="row"><button class="btn sm" data-lj="' + i + '">JSON</button><button class="btn sm" data-lt="' + i + '">TXT</button></span></div>').join('') :
      '<div class="sub">아직 저장된 전투 기록이 없어요.</div>';
  },

  // ---------- 장비 창 ----------
  equipModal(uid) {
    const app = this.app, run = app.run, p = run.roster.find(r => r.uid === uid); if (!p) return;
    const slots = [['weapon', '무기'], ['shield', '방패'], ['몸', '몸 갑옷'], ['머리', '투구']];
    const cur = k => k === 'weapon' ? (p.weapon && ['맨손', '이빨·발톱'].indexOf(p.weapon) < 0 ? p.weapon : '') : k === 'shield' ? (p.shield ? '방패' : '') : ((p.gear || {})[k] ? (p.gear[k].mat + ' ' + p.gear[k].tier + '성 ' + Math.round(p.gear[k].dur) + '%') : '');
    let h = '<h2>' + esc(p.name) + ' 장비</h2><div class="sub">' + GB.KINDS[GB.kindOf(p)].name + ' · ' + p.sizeCls + ' — 몸에 맞는 크기의 장비만 입을 수 있어요 (한 단계 큰 것까지).</div>';
    h += slots.map(([k, nm]) => '<div class="logrow"><span><b>' + nm + '</b> ' + (cur(k) ? esc(cur(k)) : '<span class="dim">비어 있음</span>') + '</span>' + (cur(k) ? '<button class="btn sm" data-off="' + esc(k) + '">벗기</button>' : '') + '</span></div>').join('');
    h += '<div class="sec">창고 (' + run.stash.length + ')</div>';
    h += run.stash.length ? run.stash.map(it => {
      const why = GB.Loot.wearWhy(p, it), sc = GB.Loot.fit(p, it);
      return '<div class="logrow"><span>' + esc(GB.Loot.label(it)) + (it.size ? ' <span class="dim">' + it.size + '</span>' : '') + '</span>' + (why ? '<span class="dim sm">' + esc(why) + '</span>' : '<button class="btn sm' + (sc > 2 ? ' go' : '') + '" data-on="' + esc(it.id) + '">' + (sc > 2 ? '★ ' : '') + '입히기</button>') + '</div>';
    }).join('') : '<div class="sub">창고가 비었어요.</div>';
    h += '<div class="row" style="margin-top:10px"><button class="btn go" id="eqClose">닫기</button></div>';
    this.modal(h, box => {
      box.querySelectorAll('[data-off]').forEach(b => b.onclick = () => { const it = GB.Loot.takeOff(p, b.dataset.off); if (it) run.stash.push(it); GB.Store.saveRun(run); this.equipModal(uid); this.renderHome(); });
      box.querySelectorAll('[data-on]').forEach(b => b.onclick = () => {
        const i = run.stash.findIndex(x => x.id === b.dataset.on); if (i < 0) return;
        const it = run.stash.splice(i, 1)[0], old = GB.Loot.putOn(p, it); if (old) run.stash.push(old);
        GB.Store.saveRun(run); this.equipModal(uid); this.renderHome();
      });
      GB.UI.$('eqClose').onclick = () => this.closeModal();
    });
  },
  relModal(uid) {
    const run = this.app.run, p = run.roster.find(r => r.uid === uid); if (!p) return;
    const others = run.roster.filter(r => r.uid !== uid);
    const mates = others.filter(r => r.cg && r.cg === p.cg && p.cg);
    let h = '<h2>' + esc(p.name) + ' 관계</h2>' +
      '<div class="sub">전우조는 서로 붙어 다니고, 위급하면 구하고, 짝이 붙든 적의 옆구리를 칩니다. 대장은 부하가 따르고, 보호받을이는 대장 등 뒤에서 지원합니다.</div>';
    h += '<div class="sec">전우조 (현재: ' + (mates.length ? esc(mates.map(m => m.name).join(', ')) : '없음') + ')</div><div class="row">';
    h += others.map(o => '<button class="btn sm' + (o.cg && o.cg === p.cg ? ' on' : '') + '" data-mate="' + esc(o.uid) + '">' + esc(o.name) + '</button>').join('') + '<button class="btn sm danger" data-mate="">풀기</button></div>';
    h += '<div class="sec">대장 (현재: ' + (p.chiefNm ? esc(p.chiefNm) + (p.chiefMode === 'cover' ? ' · 보호' : ' · 따름') : '없음') + ')</div><div class="row">';
    h += others.map(o => '<button class="btn sm' + (p.chiefNm === o.name ? ' on' : '') + '" data-chief="' + esc(o.uid) + '">' + esc(o.name) + '</button>').join('') + '<button class="btn sm danger" data-chief="">풀기</button></div>';
    h += '<div class="row" style="margin-top:8px"><label><input type="radio" name="cm" value="follow" ' + (p.chiefMode !== 'cover' ? 'checked' : '') + '> 따를이 (적극 가담)</label><label><input type="radio" name="cm" value="cover" ' + (p.chiefMode === 'cover' ? 'checked' : '') + '> 보호받을이</label></div>';
    h += '<div class="row" style="margin-top:10px"><button class="btn go" id="relClose">닫기</button></div>';
    this.modal(h, box => {
      box.querySelectorAll('[data-mate]').forEach(b => b.onclick = () => {
        const o = run.roster.find(r => r.uid === b.dataset.mate);
        if (!o) { run.roster.forEach(r => { if (r.cg && r.cg === p.cg) r.cg = ''; }); p.cg = ''; }
        else { const key = p.cg || o.cg || 'c' + Date.now().toString(36); p.cg = key; o.cg = key; }
        GB.Store.saveRun(run); this.relModal(uid); this.renderHome();
      });
      box.querySelectorAll('[data-chief]').forEach(b => b.onclick = () => {
        const o = run.roster.find(r => r.uid === b.dataset.chief), cm = box.querySelector('input[name=cm]:checked');
        p.chiefNm = o ? o.name : ''; p.chiefMode = o ? (cm ? cm.value : 'follow') : '';
        GB.Store.saveRun(run); this.relModal(uid); this.renderHome();
      });
      GB.UI.$('relClose').onclick = () => this.closeModal();
    });
  },

  // ---------- 결과 · 도움말 ----------
  resultModal(B, out, rec) {
    const title = out.outcome === 'win' ? '<span class="win">승리</span>' : out.outcome === 'lose' ? '<span class="lose">패배</span>' : '<span class="draw">시간 초과</span>';
    let h = '<h2>' + title + ' · 단계 ' + B.stage + '</h2><p>전투 시간 ' + Math.round(B.W.t) + '초 · 아군 처치 ' + out.kills + '</p>';
    h += out.lost.length ? '<p class="lose">영구 손실: ' + esc(out.lost.map(l => l.name).join(', ')) + '</p>' : '<p>손실 없음</p>';
    if (out.grown.length) h += '<p class="win">성장</p>' + out.grown.map(g => '<div class="st">' + esc(g.name) + ': ' + esc(g.what.join(' · ')) + '</div>').join('');
    if (out.loot) h += '<p>전리품 ' + out.loot + '개를 창고에 담았어요.</p>';
    if (out.reward) h += '<p>합류한 동료</p>' + this.card(out.reward, true);
    if (out.outcome === 'win' && !out.reward) h += '<p class="dim">편성이 가득 차 새 동료는 합류하지 않았어요.</p>';
    if (out.over) h += '<p class="lose">모든 동료를 잃어 런이 끝났어요 (최고 ' + this.app.run.best + '단계).</p>';
    if (out.outcome === 'draw') h += '<p>시간 초과로 단계는 그대로예요.</p>';
    h += '<div class="row" style="margin-top:10px"><button class="btn" id="rJson">기록 JSON</button><button class="btn" id="rTxt">기록 TXT</button><button class="btn go" id="rNext">막사로</button></div>';
    this.modal(h, () => {
      GB.UI.$('rJson').onclick = () => this.app.download('battle_log_' + GB.VERSION + '_stage' + B.stage + '.json', JSON.stringify(rec), 'application/json');
      GB.UI.$('rTxt').onclick = () => this.app.download('battle_log_' + GB.VERSION + '_stage' + B.stage + '.txt', GB.BattleLog.text(rec), 'text/plain');
      GB.UI.$('rNext').onclick = () => { this.closeModal(); this.app.showHome(); };
    });
  },
  helpModal() {
    this.modal('<h2>조작법 ' + GB.VERSION + '</h2><div class="help">' +
      '<b>고르기</b> 유닛 탭 · 위쪽 칩 탭 · 빈 땅을 끌어 네모 고르기 · "다중 선택"을 켜면 탭할 때마다 더하기/빼기<br>' +
      '<b>명령</b> 땅 탭=이동 · 적 탭=공격 · 바닥 물건 탭=줍기 · 같은 곳 두 번 탭=서둘러(사수는 바로 쏨) · "공격이동" · "돌격" · "투창" · "정지" · "자동"(스스로 판단) · "취소" · "우회"(아는 적이 적은 쪽으로 크게 돌아감)<br>' +
      '<b>태세</b> 막기 풀기 · 전열 · 교전 규칙(자유/판단/금지/사격금지) · 치료 방침(위급/알아서/명령만) · 스스로 돌격 안 함<br>' +
      '<b>관계</b> 전우조(2명 이상 고르고 누름) · ♛ 대장(부하를 고르고 → 대장을 탭) · ⛨ 보호(보호받을이를 고르고 → 지켜 줄 대장을 탭) · ✕ 풀기. 관계는 막사에서도 정할 수 있어요.<br>' +
      '<b>지휘망</b> ★ = 지휘관. 명령은 지휘관을 거쳐 거리 · 소음 · 확률대로 닿아요 ("…" 전달 중 / "✗" 못 들음). 대장-부하 · 싸움 전(0초) 명령은 바로 닿아요.<br>' +
      '<b>시간</b> ⏸로 멈추고 계획 → ▶. "한 턴씩"을 켜면 1초(한 턴)마다 멈춰요. 1x/2x/4x. 준비 단계에서는 아군을 끌어 배치할 수 있어요.<br>' +
      '<b>화면</b> 핀치/휠 확대 · 두 손가락/오른쪽 버튼으로 이동 · "맞춤". 흰색=아군, 검정=적 · ■방어 ●보병 ▲기동 ⬟사수 · 크기=체급 · 붉은 십자=의무 · 굵은 테 둘레=갑옷 · 머리 위 투구 · 바닥의 물건=전리품<br>' +
      '<b>규칙</b> 모든 싸움 규칙은 원본 굴 엔진 그대로예요 (부위 · 출혈 · 기어다님 · 방향 피해 · 돌격 · 투창 · 짓밟기 · 전우조 · 대장-부하 · 응급처치). 판 끝에 한 일대로 특성이 올라요.' +
      '</div><div class="row" style="margin-top:10px"><button class="btn go" id="hClose">닫기</button></div>', () => { GB.UI.$('hClose').onclick = () => this.closeModal(); });
  }
};
