/* 전투 화면의 DOM 패널: 상단 줄 · 동료 칩 · 정보 패널(부위 상태) · 명령 단추 · 힌트 · 로그 서랍 · 안내 문구.
 * 상태는 app(B, ui) 에서 읽기만 하고, 단추는 GB.Orders 를 부른다. */
GB.Panels = function (app) {
  this.app = app;
  this.chipSig = ''; this.toastT = 0; this.hintMsg = '';
};
const $ = id => document.getElementById(id);
GB.UI.$ = $;
const ORD_NM = { move: '이동', amove: '공격 이동', attack: '공격', charge: '돌격', hold: '정지 사수', throw: '투창', pick: '줍기', line: '전열', lret: '전열 후퇴', watch: '사주경계', swap: '무기 바꿈', scout: '정찰', assn: '암살', clump: '뭉침', exit: '출구', skill: '응급처치', leap: '도약', flank: '측면 기동' };
const ROE = { free: '자유 교전', smart: '판단 교전', hold: '교전 금지', nofire: '사격 금지' }, ROE_ORDER = ['smart', 'free', 'hold', 'nofire'];
const HEAL = { dying: '위급할 때만', free: '알아서', order: '명령만' }, HEAL_ORDER = ['dying', 'free', 'order'];
GB.Panels.ROE = ROE; GB.Panels.HEAL = HEAL;

GB.Panels.prototype = {
  bind() {
    const app = this.app, ui = app.ui, O = GB.Orders;
    const sel = () => [...ui.sel];
    const say = r => { if (r) { const n = O.takeNote(app.B); app.toast(r.msg + (n ? ' · ' + n : '')); } app.refresh(); };
    const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
    // 모드 단추 (이동·공격 · 공격이동) 와 기술 단추 3개 (돌격 · 투창 · 응급처치)
    [['mNormal', 'normal'], ['mAmove', 'amove']].forEach(([id, m]) => on(id, () => { ui.mode = (ui.mode === m && m !== 'normal') ? 'normal' : m; app.refresh(); }));
    const skillBtn = (id, mode, fn, nm) => on(id, () => {
      const us = ui.selUnits(), s = GB.Skills.summary(app.B.W, us, fn);
      if (!s.has) return;
      if (mode !== 'skill' && !s.ready) { app.toast(nm + ' ' + s.why); return; }
      ui.mode = ui.mode === mode ? 'normal' : mode; app.refresh();
    });
    skillBtn('sCharge', 'charge', GB.Skills.charge, '돌격'); skillBtn('sThrow', 'throw', GB.Skills.jav, '투창'); skillBtn('sHeal', 'skill', GB.Skills.heal, '응급처치');
    on('bResend', () => say(O.resend(app.B, sel())));
    on('zRange', () => { ui.detail = !ui.detail; app.refresh(); });
    on('bHold', () => say(O.hold(app.B, sel()))); on('bAuto', () => say(O.auto(app.B, sel()))); on('bCancel', () => say(O.cancel(app.B, sel())));
    on('bDetour', () => { ui.detour = !ui.detour; app.toast(ui.detour ? '↪ 우회 켬 — 다음 이동 · 공격은 아는 적이 적은 쪽으로 크게 돌아감' : '우회를 껐어요'); app.refresh(); });
    on('bGuard', () => say(O.guardToggle(app.B, sel()))); on('bLine', () => say(O.line(app.B, sel()))); on('bNoChg', () => say(O.chargePolicy(app.B, sel())));
    on('bSpear', () => say(O.pickSpear(app.B, sel())));
    on('bRoe', () => { const us = ui.selUnits(); if (!us.length) return app.toast('먼저 아군을 고르세요'); const cur = E.roeOf ? E.roeOf(app.B.W, us[0]) : 'smart'; const nx = ROE_ORDER[(ROE_ORDER.indexOf(cur) + 1) % ROE_ORDER.length]; say(O.posture(app.B, sel(), 'roe', nx)); app.toast('교전 규칙 → ' + ROE[nx]); });
    on('bHeal', () => { const us = ui.selUnits(); if (!us.length) return app.toast('먼저 아군을 고르세요'); const cur = E.healPolOf(app.B.W, us[0]); const nx = HEAL_ORDER[(HEAL_ORDER.indexOf(cur) + 1) % HEAL_ORDER.length]; say(O.posture(app.B, sel(), 'heal', nx)); app.toast('치료 방침 → ' + HEAL[nx]); });
    on('bMulti', () => { ui.multi = !ui.multi; app.refresh(); }); on('bAll', () => { ui.selectAll(); app.refresh(); });
    on('bCut', () => say(O.relCut(app.B, sel())));
    on('zIn', () => { app.view.auto = false; app.view.setZoom(app.view.cam.zoom * 1.4); }); on('zOut', () => { app.view.auto = false; app.view.setZoom(app.view.cam.zoom / 1.4); });
    on('zFit', () => app.view.fit()); on('zAll', () => app.view.fit(true));
    document.querySelectorAll('#tabs .tab').forEach(t => { t.onclick = () => { document.querySelectorAll('#tabs .tab').forEach(x => x.classList.toggle('on', x === t)); ['t1', 't2', 't3'].forEach(id => $(id).classList.toggle('hidden', id !== t.dataset.tab)); }; });
    $('chips').addEventListener('pointerdown', e => {
      const c = e.target.closest('.chip'); if (!c || !app.B) return;
      const i = +c.dataset.i; if (ui.rel) { this.relPick(i); return; }
      if (ui.multi || e.shiftKey) ui.toggle(i); else ui.selectOnly(i); app.refresh();
    });
    // 관계 칸 (정보 패널) · 관계 확정 줄: 다시 그려져도 눌림이 안 사라지게 pointerdown 으로
    $('info').addEventListener('pointerdown', e => { const b = e.target.closest('[data-rel]'); if (!b) return; e.preventDefault(); this.relStart(b.dataset.rel); });
    $('relBar').addEventListener('pointerdown', e => { const b = e.target.closest('[data-relact]'); if (!b) return; e.preventDefault(); b.dataset.relact === 'ok' ? this.relConfirm() : this.relCancel('관계 설정을 파기했어요'); });
  },
  // ---- 관계 설정: 아군을 누르면 관계 칸 → 대장 지정(부하 1명 이상 필수) · 보호 · 전우. 부하를 못 정하면 파기 ----
  relStart(kind) {
    const app = this.app, ui = app.ui, W = app.B.W, us = ui.selUnits(); if (us.length !== 1) return app.toast('먼저 아군 한 명을 고르세요');
    const u = us[0];
    if (kind === 'cut') { const r = GB.Orders.relCut(app.B, [u.i]); app.toast(r.msg); app.refresh(); return; }
    const mode = kind === 'cover' ? 'cover' : kind === 'mate' ? 'mate' : 'follow';
    const picks = new Set(mode === 'follow' || mode === 'cover' ? W.units.filter(m => m.alive && m.side === 0 && m.chiefLk && m.sqLead === u.i && (m.chiefMode === 'cover') === (mode === 'cover')).map(m => m.i) : []);
    ui.rel = { boss: u.i, mode: mode, picks: picks }; app.toast(mode === 'mate' ? '전우가 될 아군 한 명을 탭하세요' : mode === 'cover' ? '지켜 줄 아군(보호받을이)을 탭하세요 — 1명 이상' : '부하로 삼을 아군을 탭하세요 — 1명 이상'); app.refresh();
  },
  relPick(i) {
    const R = this.app.ui.rel; if (!R || i === R.boss) return;
    if (R.mode === 'mate') { R.picks.clear(); R.picks.add(i); } else if (R.picks.has(i)) R.picks.delete(i); else R.picks.add(i);
    this.app.refresh();
  },
  relCancel(msg) { const ui = this.app.ui; ui.rel = null; if (msg) this.app.toast(msg); this.app.refresh(); },
  relConfirm() {
    const app = this.app, ui = app.ui, R = ui.rel, B = app.B, O = GB.Orders; if (!R) return;
    if (!R.picks.size) return this.relCancel('부하가 1명 이상 있어야 해요 — 관계 설정을 파기했어요');
    let r;
    if (R.mode === 'mate') r = O.mate(B, [R.boss, [...R.picks][0]]);
    else {
      // 편집: 빠진 기존 부하는 풀어 주고, 고른 이들은 대장에게 붙임
      const old = B.W.units.filter(m => m.alive && m.side === 0 && m.chiefLk && m.sqLead === R.boss && (m.chiefMode === 'cover') === (R.mode === 'cover') && !R.picks.has(m.i));
      if (old.length) O.relCut(B, old.map(m => m.i));
      r = O.chief(B, [...R.picks], R.boss, R.mode);
    }
    ui.rel = null; app.toast(r.msg); app.refresh();
  },
  refreshRel() {
    const app = this.app, ui = app.ui, W = app.B.W, el = $('relBar'), R = ui.rel;
    if (!R) { if (!el.classList.contains('hidden')) { el.classList.add('hidden'); el.innerHTML = ''; } return; }
    const b = W.units[R.boss], n = R.picks.size, nm = [...R.picks].map(i => W.units[i].name).join(', ');
    const h = '<span><b>' + (R.mode === 'mate' ? '전우' : R.mode === 'cover' ? '⛨ 보호' : '♛ 대장') + ' ' + b.name + '</b> — ' + (R.mode === 'mate' ? '짝을 탭' : R.mode === 'cover' ? '보호받을이를 탭' : '부하를 탭') + ' (' + (nm || '아직 없음') + ')</span>' +
      '<button class="btn sm go" data-relact="ok"' + (n ? '' : ' disabled') + '>확정</button><button class="btn sm" data-relact="no">파기</button>';
    if (el.innerHTML !== h) el.innerHTML = h; el.classList.remove('hidden');
  },
  toast(msg) { this.hintMsg = msg; this.toastT = performance.now(); },

  refresh(force) {
    const app = this.app, B = app.B, ui = app.ui; if (!B) return;
    const W = B.W, us0 = W.units.filter(u => u.side === 0), foes = W.units.filter(u => u.side === 1);
    const na = us0.filter(u => u.alive).length, nf = foes.filter(u => u.alive).length;
    const boss = E.cmdBoss(W, 0);
    $('lblTop').innerHTML = '<b>단계 ' + (B.stage || '-') + '</b> · ' + this.fmtT(W.t) + ' · ' + (!B.started ? '준비' : W.over ? '종료' : B.paused ? '정지' : B.stepMode ? '한 턴씩' : '진행') +
      '<br>아군 ' + na + '/' + us0.length + ' vs 적 ' + nf + '/' + foes.length + (boss ? ' · 지휘 ★ ' + boss.name : '');
    // 칩
    const rch = {}; if (B.started && boss) us0.forEach(u => { if (u.alive && u !== boss) { const r = GB.Orders.reach(B, u); rch[u.i] = u.ordPend ? ['…' + Math.max(0, u.ordPend.at - W.t).toFixed(1) + 's', ''] : (u.missT != null && W.t - u.missT < 20) ? ['✗', 'r'] : r.none ? ['', ''] : [Math.round(r.p * 100) + '%', r.p < 0.45 ? 'r' : '']; } });
    const sig = us0.map(u => u.i + (u.alive ? 1 : 0) + (ui.sel.has(u.i) ? 's' : '') + Math.round(u.hp / u.max * 20) + (u.bleed ? 'b' : '') + (u.cg || '') + (rch[u.i] ? rch[u.i][0] : '') + (ui.rel && (ui.rel.boss === u.i ? 'B' : ui.rel.picks.has(u.i) ? 'P' : '')) ).join('|') + (boss ? boss.i : '') + ui.mode + ui.multi;
    if (force || sig !== this.chipSig) {
      this.chipSig = sig;
      $('chips').innerHTML = us0.map(u => {
        const k = GB.KINDS[GB.kindOf(u)];
        return '<div class="chip' + (ui.sel.has(u.i) ? ' sel' : '') + (ui.rel && ui.rel.picks.has(u.i) ? ' sel' : '') + (u.alive ? '' : ' dead') + '" data-i="' + u.i + '">' +
          (boss === u ? '<span class="st">★</span>' : '') + k.icon + ' ' + u.name + (u.skill && u.skill.kit ? ' <span class="red">✚</span>' : '') + (u.cg ? ' <span class="tg2">전우</span>' : '') + (u.bleed ? ' <span class="red">●</span>' : '') + (rch[u.i] && rch[u.i][0] ? ' <span class="lk ' + rch[u.i][1] + '" title="지휘관의 명령이 닿을 확률">' + rch[u.i][0] + '</span>' : '') +
          '<div class="bar"><i style="width:' + Math.round(Math.max(0, u.hp) / u.max * 100) + '%"></i></div></div>';
      }).join('');
    }
    this.refreshInfo();
    this.refreshRel();
    this.refreshButtons();
    this.refreshHint();
    $('minilog').innerHTML = app.recent.slice(-4).map(s => '<div>' + s + '</div>').join(''); $('minilog').style.display = app.recent.length ? '' : 'none';
    const b = $('btnPlay');
    if (!B.started) { b.textContent = '▶ 전투 개시'; b.disabled = false; }
    else if (W.over) { b.textContent = '종료'; b.disabled = true; }
    else { b.textContent = B.paused ? '▶ 재개' : '⏸ 정지'; b.disabled = false; }
    $('btnSpeed').textContent = B.speed + 'x';
    $('btnTurnMode').classList.toggle('on', B.stepMode);
  },
  fmtT(t) { const m = Math.floor(t / 60), s = Math.floor(t % 60); return m + ':' + (s < 10 ? '0' : '') + s; },
  refreshButtons() {
    const app = this.app, ui = app.ui, us = ui.selUnits(), W = app.B.W;
    const set = (id, on) => { const el = $(id); if (el) el.classList.toggle('on', !!on); };
    set('mNormal', ui.mode === 'normal'); set('mAmove', ui.mode === 'amove');
    set('bDetour', ui.detour); set('bMulti', ui.multi); set('zRange', ui.detail);
    const g = us.filter(u => u.canGuard); set('bGuard', g.length && g.every(u => u.guardOff));
    const nc = us.filter(u => u.canCharge); set('bNoChg', nc.length && nc.every(u => u.noChg));
    // 기술 3개: 고른 아군이 가진 것만 보임. 투창은 창을 손에 들었을 때만. 돌격 · 응급처치는 쿨타임이 바닥에서 차오름
    const S = GB.Skills, defs = [['sCharge', S.charge, 'charge', '돌격'], ['sThrow', S.jav, 'throw', '투창'], ['sHeal', S.heal, 'skill', '응급처치']];
    let any = false;
    for (const [id, fn, mode, nm] of defs) {
      const b = $(id), sm = S.summary(W, us, fn), show = sm.has && (id !== 'sThrow' || us.some(u => S.jav(W, u).has && u.spearHeld));
      b.classList.toggle('hidden', !show); if (!show) continue; any = true;
      const lab = b.querySelector('span'), cd = b.querySelector('.cd');
      lab.textContent = nm + (id === 'sCharge' && !sm.ready ? ' ' + sm.cd.toFixed(1) + 's' : id === 'sHeal' ? ' ' + sm.left + (!sm.ready && sm.cd > 0 ? ' · ' + sm.cd.toFixed(1) + 's' : '') : '');
      cd.style.width = (id === 'sThrow' ? (sm.ready ? 0 : 100) : sm.ready ? 0 : Math.round(100 * (1 - (sm.cd / (sm.total || 1))))) + '%';
      b.classList.toggle('wait', !sm.ready); b.classList.toggle('on', ui.mode === mode);
    }
    $('skills').classList.toggle('hidden', !any);
    // 투창을 던져 창이 없고 바닥에 던진 창이 있으면 '창 줍기'만 의미가 있음 — 태세 탭의 bSpear 가 그 역할
    const rs = $('bResend'), miss = us.concat(us.length ? [] : []).filter(u => u.missO && u.missT != null && W.t - u.missT < 60 && !u.ordPend);
    rs.classList.toggle('hidden', !miss.length); rs.textContent = '재전달 ' + miss.length;
    if (us.length) { $('bRoe').textContent = '교전: ' + ROE[E.roeOf(W, us[0])]; $('bHeal').textContent = '치료: ' + HEAL[E.healPolOf(W, us[0])]; }
    else { $('bRoe').textContent = '교전 규칙'; $('bHeal').textContent = '치료 방침'; }
  },
  refreshHint() {
    const app = this.app, ui = app.ui, B = app.B; let h = '';
    if (performance.now() - this.toastT < 3800 && this.hintMsg) h = this.hintMsg;
    else if (ui.rel) h = ui.rel.mode === 'mate' ? '전우가 될 아군을 탭 → 확정' : '부하(보호받을이)를 탭해 넣고 빼세요 → 확정 (1명 이상 필수)';
    else if (ui.mode === 'skill') h = '응급처치: 치료할 아군을 탭';
    else if (ui.mode === 'charge') h = '돌격: 적 또는 땅을 탭';
    else if (ui.mode === 'throw') h = '투창: 던질 적을 탭';
    else if (ui.mode === 'amove') h = '공격 이동: 갈 곳을 탭 (가는 길의 적과 싸움)';
    else if (!B.started) h = '준비: 아군을 끌어 배치 · 명령을 미리 주고 "전투 개시"';
    else if (!ui.sel.size) h = '아군을 탭해 고르세요 (여럿은 "다중 선택" 또는 끌어서)';
    else h = 'PC: 왼쪽=고르기·공격 · 오른쪽=이동·공격·줍기 · 같은 곳 두 번=서둘러 / 터치: 땅=이동 · 적=공격';
    $('hint').textContent = h;
  },
  orderText(u) {
    const o = u.order || (u.ordPend && u.ordPend.o); if (!o) return u.stay ? '자리 지키기' : '자동 (스스로 판단)';
    let s = ORD_NM[o.k] || o.k;
    if (o.b != null && this.app.B.W.units[o.b]) s += ' → ' + this.app.B.W.units[o.b].name;
    if (!u.order && u.ordPend) s += ' (전달 중)';
    return s;
  },
  refreshInfo() {
    const app = this.app, ui = app.ui, W = app.B.W, us = ui.selUnits();
    const one = us.length === 1 ? us[0] : (ui.inspect != null ? W.units[ui.inspect] : null);
    const el = $('info');
    let h = '';
    if (one && one.alive) h = this.unitCard(one);
    else if (us.length > 1) h = '<div class="h">' + us.length + '명 선택</div>' + us.map(u => u.name).join(', ');
    if (el.dataset.h !== h) { el.dataset.h = h; el.innerHTML = h; } el.style.display = h ? '' : 'none';
  },
  gearTxt(g) { return g ? (g.mat + ' ' + g.tier + '성' + (g.dur != null && g.dur < 100 ? ' ' + Math.round(g.dur) + '%' : '') + (g.dur <= 0 ? ' (망가짐)' : '')) : '없음'; },
  unitCard(u) {
    const W = this.app.B.W, K = GB.KINDS[GB.kindOf(u)], ally = u.side === 0, boss = E.cmdBoss(W, 0) === u;
    const part = (nm, bad, why) => '<span class="pt' + (bad ? ' bad' : '') + '" title="' + (why || '') + '">' + nm + '</span>';
    const armL = u.arms && u.arms.L, armR = u.arms && u.arms.R;
    const parts = '<div class="parts">' + part('머리', u.eyeLost || (u.wounds || []).some(w => /두개골|머리|뇌진탕|눈/.test(w)), u.eyeLost ? '눈 ' + u.eyeLost + ' 잃음' : '') +
      part('몸통', (u.wounds || []).some(w => /가슴|갈비|폐|내장|출혈|심장/.test(w)) || u.bleed) + part('왼팔', armL, armL || '') + part('오른팔', armR, armR || '') +
      part('다리', u.crawl || (u.wounds || []).some(w => /다리|허벅|건/.test(w)), u.crawl ? '기어다님' : '') + '</div>';
    const mate = u.cg ? W.units.filter(m => m !== u && m.cg === u.cg && m.side === u.side).map(m => m.name).join(', ') : '';
    const chief = u.chiefLk && u.sqLead != null ? W.units[u.sqLead].name : '';
    const flw = W.units.filter(m => m.chiefLk && m.sqLead === u.i && m.side === u.side).map(m => m.name).join(', ');
    return '<div class="h">' + (boss ? '★ ' : '') + (ally ? '' : '적 ') + u.name + ' <span class="dim">' + K.icon + K.name + ' · ' + (u.sizeCls || '중형') + '</span></div>' +
      '체력 ' + Math.round(u.hp) + '/' + u.max + ' · 자세 ' + Math.round(u.post) + (u.bleed ? ' · <span class="red">출혈</span>' : '') +
      '<br>' + u.weapon + (u.shield ? ' + 방패' : '') + (u.jav && u.spearHeld ? ' · 투창' : '') + (u.ammo != null ? ' · 탄 ' + u.ammo : '') +
      '<br><span class="dim gear">몸 ' + this.gearTxt((u.gear || {})['몸']) + ' · 투구 ' + this.gearTxt((u.gear || {})['머리']) + '</span>' + parts +
      (u.skill && u.skill.kit ? '<span class="red">✚</span> 응급처치 ' + u.skill.left + '/' + u.skill.pool + '<br>' : '') +
      (ally ? '명령: ' + this.orderText(u) + '<br>' : '') +
      (mate ? '전우 ' + mate + '<br>' : '') + (chief ? '대장 ' + chief + (u.chiefMode === 'cover' ? ' (보호받는 중)' : '') + '<br>' : '') + (flw ? '♛ 부하 ' + flw + '<br>' : '') +
      ((u.wounds || []).length ? '<span class="dim">부상: ' + u.wounds.slice(0, 4).join(' · ') + '</span>' : '') + (ally ? this.relBlock(u) : '');
  },
  // 관계 칸: 지금 관계 + 지휘 닿음 + 설정 단추. 대장 지정은 부하를 1명 이상 골라 확정해야 만들어진다 (못 정하면 파기)
  relBlock(u) {
    const app = this.app, W = app.B.W, ui = app.ui, boss = E.cmdBoss(W, 0);
    const mates = u.cg ? W.units.filter(m => m !== u && m.alive && m.cg === u.cg && m.side === 0).map(m => m.name) : [];
    const chief = u.chiefLk && u.sqLead != null && W.units[u.sqLead] ? W.units[u.sqLead] : null;
    const flw = W.units.filter(m => m.alive && m.side === 0 && m.chiefLk && m.sqLead === u.i);
    const bits = [];
    if (chief) bits.push((u.chiefMode === 'cover' ? '⛨ ' : '♛ 대장 ') + chief.name + (u.chiefMode === 'cover' ? ' 가 지켜 줌' : ''));
    if (flw.length) bits.push('♛ 부하 ' + flw.map(m => m.name).join(', '));
    if (mates.length) bits.push('전우 ' + mates.join(', '));
    if (!bits.length) bits.push('<span class="dim">관계 없음</span>');
    if (app.B.started && boss) {
      const r = GB.Orders.reach(app.B, u);
      bits.push(u === boss ? '<span class="lk">지휘관: 지휘 ' + r.range + '칸 · 외침 ' + r.hear.toFixed(1) + '칸</span>' : u.ordPend ? '<span class="lk">명령 전달 중 ' + Math.max(0, u.ordPend.at - W.t).toFixed(1) + '초</span>' : '<span class="lk ' + (r.p < 0.45 ? 'r' : '') + '">명령 닿음 ' + Math.round(r.p * 100) + '% (' + ({ voice: '외침', sign: '손짓', relay: '전달', none: '닿지 않음' }[r.via] || r.via) + (r.why ? ' · ' + r.why.split(' · ')[0] : '') + ')</span>');
    }
    let h = '<div class="relcur">' + bits.join(' · ');
    h += '</div>';
    if (u.alive && !ui.rel) h += '<div class="rel"><button class="btn sm" data-rel="boss">♛ 대장 지정</button><button class="btn sm" data-rel="cover">⛨ 보호</button><button class="btn sm" data-rel="mate">전우 맺기</button>' + (chief || flw.length || mates.length ? '<button class="btn sm danger" data-rel="cut">관계 풀기</button>' : '') + '</div>';
    return h;
  }
};
