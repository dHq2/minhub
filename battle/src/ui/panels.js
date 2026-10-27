/* 전투 화면의 DOM 패널: 상단 줄 · 동료 칩 · 정보 패널(부위 상태) · 명령 단추 · 힌트 · 로그 서랍 · 안내 문구.
 * 상태는 app(B, ui) 에서 읽기만 하고, 단추는 GB.Orders 를 부른다. */
GB.Panels = function (app) {
  this.app = app;
  this.chipSig = ''; this.toastT = 0; this.hintMsg = '';
};
const $ = id => document.getElementById(id);
GB.UI.$ = $;
const ORD_NM = { move: '이동', amove: '공격 이동', attack: '공격', charge: '돌격', hold: '정지 사수', throw: '투창', pick: '줍기', line: '전열', lret: '전열 후퇴', watch: '사주경계', swap: '무기 바꿈', scout: '정찰', assn: '암살', clump: '뭉침', exit: '출구' };
const ROE = { free: '자유 교전', smart: '판단 교전', hold: '교전 금지', nofire: '사격 금지' }, ROE_ORDER = ['smart', 'free', 'hold', 'nofire'];
const HEAL = { dying: '위급할 때만', free: '알아서', order: '명령만' }, HEAL_ORDER = ['dying', 'free', 'order'];
GB.Panels.ROE = ROE; GB.Panels.HEAL = HEAL;

GB.Panels.prototype = {
  bind() {
    const app = this.app, ui = app.ui, O = GB.Orders;
    const sel = () => [...ui.sel];
    const say = r => { if (r) app.toast(r.msg); app.refresh(); };
    const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
    // 모드 단추
    [['mNormal', 'normal'], ['mAmove', 'amove'], ['mCharge', 'charge'], ['mThrow', 'throw']].forEach(([id, m]) => on(id, () => { ui.mode = (ui.mode === m && m !== 'normal') ? 'normal' : m; app.refresh(); }));
    on('bHold', () => say(O.hold(app.B, sel()))); on('bAuto', () => say(O.auto(app.B, sel()))); on('bCancel', () => say(O.cancel(app.B, sel())));
    on('bDetour', () => { ui.detour = !ui.detour; app.toast(ui.detour ? '↪ 우회 켬 — 다음 이동 · 공격은 아는 적이 적은 쪽으로 크게 돌아감' : '우회를 껐어요'); app.refresh(); });
    on('bGuard', () => say(O.guardToggle(app.B, sel()))); on('bLine', () => say(O.line(app.B, sel()))); on('bNoChg', () => say(O.chargePolicy(app.B, sel())));
    on('bSpear', () => say(O.pickSpear(app.B, sel())));
    on('bRoe', () => { const us = ui.selUnits(); if (!us.length) return app.toast('먼저 아군을 고르세요'); const cur = E.roeOf ? E.roeOf(app.B.W, us[0]) : 'smart'; const nx = ROE_ORDER[(ROE_ORDER.indexOf(cur) + 1) % ROE_ORDER.length]; say(O.posture(app.B, sel(), 'roe', nx)); app.toast('교전 규칙 → ' + ROE[nx]); });
    on('bHeal', () => { const us = ui.selUnits(); if (!us.length) return app.toast('먼저 아군을 고르세요'); const cur = E.healPolOf(app.B.W, us[0]); const nx = HEAL_ORDER[(HEAL_ORDER.indexOf(cur) + 1) % HEAL_ORDER.length]; say(O.posture(app.B, sel(), 'heal', nx)); app.toast('치료 방침 → ' + HEAL[nx]); });
    on('bMulti', () => { ui.multi = !ui.multi; app.refresh(); }); on('bAll', () => { ui.selectAll(); app.refresh(); });
    on('bMate', () => say(O.mate(app.B, sel())));
    on('bChief', () => { if (ui.sel.size < 1) return app.toast('먼저 부하가 될 아군을 고르세요'); ui.mode = ui.mode === 'chief' ? 'normal' : 'chief'; app.toast(ui.mode === 'chief' ? '♛ 대장이 될 아군을 탭하세요 (고른 아군이 따를이)' : ''); app.refresh(); });
    on('bCover', () => { if (ui.sel.size < 1) return app.toast('먼저 보호받을 아군을 고르세요'); ui.mode = ui.mode === 'cover' ? 'normal' : 'cover'; app.toast(ui.mode === 'cover' ? '⛨ 지켜 줄 대장을 탭하세요 (고른 아군이 보호받을이)' : ''); app.refresh(); });
    on('bCut', () => say(O.relCut(app.B, sel())));
    on('zIn', () => { app.view.auto = false; app.view.setZoom(app.view.cam.zoom * 1.4); }); on('zOut', () => { app.view.auto = false; app.view.setZoom(app.view.cam.zoom / 1.4); });
    on('zFit', () => app.view.fit()); on('zAll', () => app.view.fit(true));
    document.querySelectorAll('#tabs .tab').forEach(t => { t.onclick = () => { document.querySelectorAll('#tabs .tab').forEach(x => x.classList.toggle('on', x === t)); ['t1', 't2', 't3'].forEach(id => $(id).classList.toggle('hidden', id !== t.dataset.tab)); }; });
    $('chips').addEventListener('pointerdown', e => {
      const c = e.target.closest('.chip'); if (!c || !app.B) return;
      const i = +c.dataset.i; if (ui.mode === 'chief' || ui.mode === 'cover') { const r = O.chief(app.B, [...ui.sel].filter(x => x !== i), i, ui.mode === 'cover' ? 'cover' : 'follow'); app.toast(r.msg); ui.mode = 'normal'; app.refresh(); return; }
      if (ui.multi || e.shiftKey) ui.toggle(i); else ui.selectOnly(i); app.refresh();
    });
  },
  toast(msg) { this.hintMsg = msg; this.toastT = performance.now(); },

  refresh(force) {
    const app = this.app, B = app.B, ui = app.ui; if (!B) return;
    const W = B.W, us0 = W.units.filter(u => u.side === 0), foes = W.units.filter(u => u.side === 1);
    const na = us0.filter(u => u.alive).length, nf = foes.filter(u => u.alive).length;
    const boss = E.cmdBoss(W, 0);
    $('lblTop').innerHTML = '<b>단계 ' + (B.stage || '-') + '</b> · ' + this.fmtT(W.t) + ' · ' + (!B.started ? '준비' : W.over ? '종료' : B.paused ? (B.pauseWhy ? '정지 · ' + B.pauseWhy : '정지') : B.stepMode ? '한 턴씩' : '진행') +
      '<br>아군 ' + na + '/' + us0.length + ' vs 적 ' + nf + '/' + foes.length + (boss ? ' · 지휘 ★ ' + boss.name : '');
    // 칩
    const sig = us0.map(u => u.i + (u.alive ? 1 : 0) + (ui.sel.has(u.i) ? 's' : '') + Math.round(u.hp / u.max * 20) + (u.bleed ? 'b' : '') + (u.cg || '') + (u.ordPend ? 'p' : '')).join('|') + (boss ? boss.i : '') + ui.mode + ui.multi;
    if (force || sig !== this.chipSig) {
      this.chipSig = sig;
      $('chips').innerHTML = us0.map(u => {
        const k = GB.KINDS[GB.kindOf(u)];
        return '<div class="chip' + (ui.sel.has(u.i) ? ' sel' : '') + (u.alive ? '' : ' dead') + '" data-i="' + u.i + '">' +
          (boss === u ? '<span class="st">★</span>' : '') + k.icon + ' ' + u.name + (u.skill && u.skill.kit ? ' <span class="red">✚</span>' : '') + (u.cg ? ' <span class="tg2">전우</span>' : '') + (u.bleed ? ' <span class="red">●</span>' : '') +
          '<div class="bar"><i style="width:' + Math.round(Math.max(0, u.hp) / u.max * 100) + '%"></i></div></div>';
      }).join('');
    }
    this.refreshInfo();
    this.refreshButtons();
    this.refreshHint();
    $('minilog').innerHTML = app.recent.slice(-4).map(s => '<div>' + s + '</div>').join(''); $('minilog').style.display = app.recent.length ? '' : 'none';
    const b = $('btnPlay');
    if (!B.started) { b.textContent = '▶ 전투 개시'; b.disabled = false; }
    else if (W.over) { b.textContent = '종료'; b.disabled = true; }
    else { b.textContent = B.paused ? '▶ 재개' : '⏸ 정지'; b.disabled = false; }
    $('btnSpeed').textContent = B.speed + 'x';
    $('btnTurnMode').classList.toggle('on', B.stepMode); $('btnAP').classList.toggle('on', B.autoPause.on);
  },
  fmtT(t) { const m = Math.floor(t / 60), s = Math.floor(t % 60); return m + ':' + (s < 10 ? '0' : '') + s; },
  refreshButtons() {
    const ui = this.app.ui, us = ui.selUnits();
    const set = (id, on) => { const el = $(id); if (el) el.classList.toggle('on', !!on); };
    set('mNormal', ui.mode === 'normal'); set('mAmove', ui.mode === 'amove'); set('mCharge', ui.mode === 'charge'); set('mThrow', ui.mode === 'throw');
    set('bDetour', ui.detour); set('bMulti', ui.multi); set('bChief', ui.mode === 'chief'); set('bCover', ui.mode === 'cover');
    const g = us.filter(u => u.canGuard); set('bGuard', g.length && g.every(u => u.guardOff));
    const nc = us.filter(u => u.canCharge); set('bNoChg', nc.length && nc.every(u => u.noChg));
    if (us.length) { $('bRoe').textContent = '교전: ' + ROE[E.roeOf(this.app.B.W, us[0])]; $('bHeal').textContent = '치료: ' + HEAL[E.healPolOf(this.app.B.W, us[0])]; }
    else { $('bRoe').textContent = '교전 규칙'; $('bHeal').textContent = '치료 방침'; }
  },
  refreshHint() {
    const app = this.app, ui = app.ui, B = app.B; let h = '';
    if (performance.now() - this.toastT < 3800 && this.hintMsg) h = this.hintMsg;
    else if (ui.mode === 'charge') h = '돌격: 적 또는 땅을 탭';
    else if (ui.mode === 'throw') h = '투창: 던질 적을 탭';
    else if (ui.mode === 'amove') h = '공격 이동: 갈 곳을 탭 (가는 길의 적과 싸움)';
    else if (ui.mode === 'chief' || ui.mode === 'cover') h = '대장(지켜 줄 이)이 될 아군을 탭';
    else if (!B.started) h = '준비: 아군을 끌어 배치 · 명령을 미리 주고 "전투 개시"';
    else if (!ui.sel.size) h = '아군을 탭해 고르세요 (여럿은 "다중 선택" 또는 끌어서)';
    else h = '땅=이동 · 적=공격 · 바닥 물건=줍기 · 같은 곳 두 번=서둘러';
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
    el.innerHTML = h; el.style.display = h ? '' : 'none';
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
      '<br><span class="dim">몸 ' + this.gearTxt((u.gear || {})['몸']) + ' · 투구 ' + this.gearTxt((u.gear || {})['머리']) + '</span>' + parts +
      (u.skill && u.skill.kit ? '<span class="red">✚</span> 응급처치 ' + u.skill.left + '/' + u.skill.pool + '<br>' : '') +
      (ally ? '명령: ' + this.orderText(u) + '<br>' : '') +
      (mate ? '전우 ' + mate + '<br>' : '') + (chief ? '대장 ' + chief + (u.chiefMode === 'cover' ? ' (보호받는 중)' : '') + '<br>' : '') + (flw ? '♛ 부하 ' + flw + '<br>' : '') +
      ((u.wounds || []).length ? '<span class="dim">부상: ' + u.wounds.slice(0, 4).join(' · ') + '</span>' : '');
  }
};
