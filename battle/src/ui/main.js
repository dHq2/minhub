/* 앱: 화면 전환 · 판 시작/끝 · 루프. 캠페인(GB.Campaign) 과 전투(GB.Battle) 와 화면(View · Panels · Screens)을 잇는다. */
GB.App = function () {
  const $ = GB.UI.$;
  this.run = GB.Store.loadRun() || GB.Campaign.create();
  if (!GB.Store.loadRun()) GB.Store.saveRun(this.run);
  this.B = null; this.recent = []; this.ended = false; this.hudT = 0; this.last = performance.now(); this.slowN = 0;
  this.ui = new GB.UI.State(); this.ui.app = this;
  this.view = new GB.View($('cv'), this.ui);
  this.panels = new GB.Panels(this);
  this.screens = new GB.Screens(this);
  this.input = new GB.UI.Input(this.view, this.ui, this);
  this.bind();
  this.showHome();
  requestAnimationFrame(t => this.frame(t));
  if (!GB.Store.flag('seenHelp')) { GB.Store.setFlag('seenHelp', 1); this.screens.helpModal(); }
};
GB.App.prototype = {
  inBattle() { return !GB.UI.$('scrBattle').classList.contains('hidden'); },
  toast(msg) { if (msg) this.panels.toast(msg); },
  refresh() { this.panels.refresh(true); },
  download(name, text, mime) {
    // Artifact 뷰어: 직접 다운로드가 막혀 있어 downloads 기능으로 저장한다. 없으면 일반 브라우저 방식.
    if (window.claude && window.claude.use) {
      window.claude.use('downloads').then(d => {
        if (!d) return this.downloadLink(name, text, mime);
        return d.save({ filename: name, data: text }).then(() => this.toast('저장함: ' + name), e => { if (e && e.code !== 'declined') this.toast('저장 실패: ' + (e.code || e)); });
      }, () => this.downloadLink(name, text, mime));
      return;
    }
    this.downloadLink(name, text, mime);
  },
  downloadLink(name, text, mime) {
    const blob = new Blob([text], { type: mime || 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  },
  bind() {
    const S = this.screens, run = () => this.run, on = (id, fn) => { const el = GB.UI.$(id); if (el) el.onclick = fn; };
    this.panels.bind();
    on('btnStart', () => this.startBattle());
    on('btnHelp', () => S.helpModal());
    on('btnLogs', () => { GB.UI.$('logsBox').classList.toggle('hidden'); S.renderLogs(); });
    on('btnNewRun', () => S.modal('<h2>새 런</h2><p>지금까지의 진행(동료 · 창고)이 사라져요. 저장된 전투 기록은 남아요. 새 런을 시작할까요?</p><div class="row"><button class="btn danger" id="nrYes">새 런 시작</button><button class="btn" id="nrNo">취소</button></div>', () => {
      GB.UI.$('nrNo').onclick = () => S.closeModal();
      GB.UI.$('nrYes').onclick = () => { this.run = GB.Campaign.create(); GB.Store.saveRun(this.run); S.closeModal(); S.renderHome(); };
    }));
    GB.UI.$('rosterCards').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.eq) S.equipModal(b.dataset.eq); if (b.dataset.rel) S.relModal(b.dataset.rel); });
    GB.UI.$('stashList').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return; const r = this.run;
      if (b.dataset.eqto) { const [iid, uid] = b.dataset.eqto.split('|'), i = r.stash.findIndex(x => x.id === iid), p = r.roster.find(x => x.uid === uid); if (i >= 0 && p) { const it = r.stash.splice(i, 1)[0], old = GB.Loot.putOn(p, it); if (old) r.stash.push(old); GB.Store.saveRun(r); S.renderHome(); } }
      if (b.dataset.del) { r.stash = r.stash.filter(x => x.id !== b.dataset.del); GB.Store.saveRun(r); S.renderStash(); }
    });
    GB.UI.$('logsList').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return; const l = S._logs || [];
      if (b.dataset.lj != null) this.download('battle_log_' + GB.VERSION + '_' + l[+b.dataset.lj].id + '.json', JSON.stringify(l[+b.dataset.lj]));
      if (b.dataset.lt != null) this.download('battle_log_' + GB.VERSION + '_' + l[+b.dataset.lt].id + '.txt', GB.BattleLog.text(l[+b.dataset.lt]), 'text/plain');
    });
    GB.UI.$('btnExportAll').onclick = () => this.download('battle_logs_' + GB.VERSION + '_all.json', JSON.stringify(GB.Store.listLogs()));
    GB.UI.$('btnExportRun').onclick = () => this.download('battle_run_' + GB.VERSION + '_' + this.run.id + '.json', JSON.stringify(this.run));
    on('btnBack', () => this.back());
    on('btnPlay', () => this.togglePlay());
    on('btnSpeed', () => { const B = this.B; if (!B) return; B.speed = B.speed < 1 ? 1 : B.speed === 1 ? 2 : B.speed === 2 ? 4 : 0.5; this.refresh(); });
    on('btnAP', () => { const B = this.B; if (!B) return; B.autoPause.on = !B.autoPause.on; this.toast(B.autoPause.on ? '자동정지 켬: 접촉 · 아군 쓰러짐에서 멈춰요' : '자동정지 끔'); this.refresh(); });
    on('btnTurnMode', () => { const B = this.B; if (!B) return; B.stepMode = !B.stepMode; this.toast(B.stepMode ? '한 턴씩: 1초(한 턴)마다 멈춰요 — 명령을 주고 ▶' : '이어서 재생'); this.refresh(); });
    on('btnTurn', () => { const B = this.B; if (!B || B.over) return; B.stepTurn(); this.refresh(); });
    on('btnLog', () => { const B = this.B; if (!B) return; const rec = GB.BattleLog.make(B, this.run); GB.UI.$('logText').textContent = GB.BattleLog.text(rec); GB.UI.$('logDrawer').classList.remove('hidden'); const t = GB.UI.$('logText'); t.scrollTop = t.scrollHeight; });
    on('lgClose', () => GB.UI.$('logDrawer').classList.add('hidden'));
    on('lgJson', () => { if (this.B) this.download('battle_log_' + GB.VERSION + '_live.json', JSON.stringify(GB.BattleLog.make(this.B, this.run))); });
    on('lgTxt', () => { if (this.B) this.download('battle_log_' + GB.VERSION + '_live.txt', GB.BattleLog.text(GB.BattleLog.make(this.B, this.run)), 'text/plain'); });
  },
  showHome() {
    this.B = null;
    GB.UI.$('scrBattle').classList.add('hidden'); GB.UI.$('scrHome').classList.remove('hidden');
    this.screens.renderHome();
  },
  startBattle() {
    const run = this.run; if (run.over || !run.roster.length) return;
    this.B = GB.Campaign.makeBattle(run); this.B.speed = GB.TUNE.uiSpeed;
    this.view.setBattle(this.B); this.ui.sel.clear(); this.ui.inspect = null; this.ui.mode = 'normal'; this.ui.multi = false; this.ui.detour = false;
    this.recent = []; this.ended = false; this.slowN = 0; this.logIdx = this.B.W.log.length;
    GB.UI.$('scrHome').classList.add('hidden'); GB.UI.$('scrBattle').classList.remove('hidden'); GB.UI.$('logDrawer').classList.add('hidden');
    this.view.fit();   // 화면이 보인 뒤에 크기를 알 수 있다
    this.last = performance.now(); this.refresh();
  },
  togglePlay() {
    const B = this.B; if (!B || B.over) return;
    if (!B.started) B.start(); else B.paused = !B.paused;
    this.refresh();
  },
  back() {
    const B = this.B; if (!B) return;
    if (!B.started) { this.showHome(); return; }
    if (B.over) return;
    B.paused = true; this.refresh();
    const canRun = !B.retreating;
    this.screens.modal('<h2>전투를 그만둘까요?</h2>' +
      (canRun ? '<p><b>철수</b>: 모두 자기 진영 쪽 가장자리로 달려요. 가장자리에 닿은 동료는 살아 나가고, 쓰러졌거나 못 닿은 동료는 잃어요. 이번 단계는 그대로(보상 없음).</p>' : '<p>이미 철수 중이에요.</p>') +
      '<p><b>항복</b>: 이 전투는 패배로 처리되고 런이 끝나요.</p>' +
      '<div class="row">' + (canRun ? '<button class="btn go" id="sgRun">철수</button>' : '') + '<button class="btn danger" id="sgYes">항복</button><button class="btn" id="sgNo">계속 싸운다</button></div>', () => {
      GB.UI.$('sgNo').onclick = () => this.screens.closeModal();
      if (canRun) GB.UI.$('sgRun').onclick = () => { this.screens.closeModal(); const r = GB.Orders.retreat(B); this.toast(r.msg); B.paused = false; B.pauseWhy = ''; this.refresh(); };
      GB.UI.$('sgYes').onclick = () => { this.screens.closeModal(); B.W.over = true; B.W.result = 'lose'; };
    });
  },
  onEnd() {
    this.ended = true;
    const B = this.B, run = this.run;
    const out = GB.Campaign.finish(run, B);
    const rec = GB.BattleLog.make(B, run, { outcome: out.outcome, lost: out.lost.map(l => l.name), reward: out.rewards.map(p => p.name).join(', ') || null, grown: out.grown, loot: out.loot });
    GB.Store.saveLog(rec); GB.Store.saveRun(run);
    this.refresh();
    this.screens.resultModal(B, out, rec);
  },
  pushRecent() {
    const B = this.B, W = B.W, nm = i => { const u = W.units[i]; return u ? (u.side ? '적 ' : '') + u.name : '?'; };
    for (; this.logIdx < W.log.length; this.logIdx++) {
      const e = W.log[this.logIdx]; if (!GB.BattleLog.KEEP[e.k] || e.k === 'cmdRecv' || e.k === 'plan') continue;
      const l = GB.BattleLog.line({ t: e.t, k: e.k, a: e.a, b: e.b, v: e.v, ids: e.ids, dmg: e.dmg, hp: e.hp, part: e.part, block: e.block, hcrit: e.hcrit, ff: e.ff, how: e.how, txt: e.txt, amt: e.amt, name: e.name }, nm);
      if (l) { this.recent.push(l); if (this.recent.length > 40) this.recent.shift(); }
    }
  },
  frame(now) {
    requestAnimationFrame(t => this.frame(t));
    const dt = Math.min(0.1, (now - this.last) / 1000); this.last = now;
    const B = this.B;
    if (!B || !this.inBattle()) return;
    if (B.started && !B.paused && !B.over) {
      const t0 = performance.now(); B.advance(dt); const cost = performance.now() - t0;
      // 기기가 느리면 속도를 낮춘다 (한 프레임 계산이 24ms 를 자주 넘을 때)
      if (cost > 24 && B.speed > 1) { if (++this.slowN > 6) { B.speed = B.speed / 2; this.slowN = 0; this.toast('기기 성능에 맞춰 속도를 낮췄어요 (' + B.speed + 'x)'); } } else if (this.slowN > 0) this.slowN -= 0.2;
    }
    this.pushRecent();
    this.view.draw(now);
    if (now - this.hudT > 140) { this.hudT = now; this.panels.refresh(false); }
    if (B.over && !this.ended) this.onEnd();
  }
};
window.addEventListener('DOMContentLoaded', () => { GB.app = new GB.App(); });
