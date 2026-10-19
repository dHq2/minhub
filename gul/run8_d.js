/* ---------- v8.2.0 30층 결승 — run8_d.js v1.3 (v1.3: 막대 · 체력 띠 바탕 진하게 · 이름 한 줄 · 휴대폰 — 결승 동안 아래 조작판 숨김 · 링 전체가 보이게 · 체력 띠는 막대 위 · v1.2: 150초 판정 (남은 체력 비율 · 같으면 챔피언 방어) · 시계 · v1.1: 결승은 체력 × 3 (양쪽 같게 — 몇 초 만에 끝나지 않게) · v1.0: 마야 피라미드 꼭대기의 링 · 춤추는 거인 · DJ 춘향 · MC 더 플링 · 글리치 챔피언과 단 한 번의 1대1 — 직접 조작) ----------
   규칙 (양쪽 같게): 특수능력 모두 뺌 — 특성 · 고유 기술 · 치료 · 유물 · 여신의 눈물 · 돌격 없음. 무기 · 방패 · 몸 (체력 · 힘 · 빠르기) 만.
   글리치 챔피언 = 링에 오른 이를 그대로 비추는 300년 전의 도전자 (같은 몸 · 같은 무기). 이기는 길은 조작뿐.
   조작: PC — WASD · 방향키 이동 / J 공격 / K 막기 (켜고 끔) / Space 회피 (대시) · 판을 눌러도 됨 (적 = 공격 · 바닥 = 이동)
         휴대폰 — 왼쪽 막대 이동 · 오른쪽 단추 (공격 · 막기 · 회피). 회피 (대시) 는 둘 다 같은 거리 · 같은 대기. */
const DU8 = { tLimit: 150, hpK: 3, dash: 1.7, dashT: 0.18, dashCd: 1.3, aiDashP: 0.45, aiPunishP: 0.3, dropGap: [14, 20] };
MAPS8.ring = { name: '스타디움 링', tag: 'stadium', src: 'art/maps/ring.webp', pw: 1068, ph: 798, NX: 16, NY: 12, cs: 66.75, rows: Array.from({ length: 12 }, (_, y) => Array.from({ length: 16 }, (_, x) => x >= 2 && x <= 13 && y >= 3 && y <= 9 ? '.' : '#').join('')), in: [2, 5, 4, 7], out: null, amb: 1 };
const DIN8 = { x: 0, y: 0, keys: {}, atk: false, guard: false, dash: false, jx: 0, jy: 0 };
const d8On = () => !!(world && world.duel && !world.over);
// ===== 들어서기: 연출 → 고르기 =====
function duel8Start(n){
  const R = R8S(); r8Hide(); R.at = n.id; save();
  talkLines([
    { narr: '피라미드 꼭대기. 디스코볼이 돈다.', cg: 'r8_stadium', cgw: false },
    { narr: '양쪽 관중석 너머로 거인들이 몸을 흔든다. 한 걸음마다 피라미드가 울린다 — 쿵, 쿵, 쿵.', cg: 'r8_stadium' },
    { t: '레이디스 앤 젠틀맨!! 300년을 기다린 결승입니다!!!', name: 'MC 더 플링' },
    { t: '비트 올려 줄게. 떨어지지 마.', name: 'DJ 춘향' },
    { narr: '링 위에 누군가 서 있다. 얼굴이 자꾸 깨진다 — 노이즈, 노이즈, 그리고 낯익은 윤곽.' },
    { t: '도전자 확인. 챔피언 동기화 시작.', name: '관리자', img: 'run8/admin' },
    { t: '규칙은 하나! 특수능력은 전부 봉인! 몸 하나, 무기 하나, 그리고 — 손가락!', name: 'MC 더 플링' },
    { box: '결승 — 동료 한 명을 골라 링에 올립니다. 글리치 챔피언은 그 사람을 그대로 비춥니다 (같은 몸 · 같은 무기). 특성 · 기술 · 유물은 모두 꺼짐. 단 한 번.' },
    { go: '!r8:duelPick' }]);
}
function duel8Pick(){
  const R = R8S(), L = R.party.filter(p => !R.dead.includes(p.name));
  const st = p => { try { const s = statsOf(duel8Strip(p), rules); return `체력 ${Math.round(s.hp)} · 공격 ${Math.round(s.atk)} · ${p.weapon || '맨손'}`; } catch (e) { return p.weapon || ''; } };
  const el = r8Panel(`<h2>🏟 링에 오를 한 명</h2><div class="r8sub">특수능력은 모두 봉인 — 몸과 무기, 그리고 조작만.</div><div class="r8pan">${L.map((p, i) => `<button class="btn" type="button" data-d8p="${i}" style="display:flex;gap:8px;align-items:center;width:100%;margin:4px 0;text-align:left"><i style="${r8Face(p.ref, 40)};border-radius:8px"></i><span><b>${esc(p.name)}</b><br><small>${esc(st(p))}</small></span></button>`).join('')}</div>
    <div class="r8pan"><b>조작</b><br><small>150초가 지나면 판정 (남은 체력 비율). ${MOB ? '왼쪽 막대 = 이동 · 공격 = 다가가 침 · 막기 = 켜고 끔 · 회피 = 짧은 대시 (1.3초 대기)' : 'WASD · 방향키 = 이동 · J = 공격 · K = 막기 (켜고 끔) · Space = 회피 대시 (1.3초 대기) · 판을 눌러도 됨 (적 = 공격 · 바닥 = 이동)'}</small></div>`);
  el.querySelectorAll('[data-d8p]').forEach(b => b.onclick = () => duel8Begin(L[+b.dataset.d8p]));
}
// 특수능력 봉인 (양쪽 같게)
function duel8Strip(p){
  const q = clone(p); q.traits = []; q.active = []; q.skill = null; q.spec = null; q.modBody = false; q.regenK = 0; q.hero = false; q.noChg = true; q.chgBias = 0; q.ccRes = 0; q.brain = null; q.poise = null; q.dcounter = null;
  delete q.skLeft; delete q.hpNow; delete q.alt; delete q.shells; delete q.leapN; return q;
}
// ===== 링 =====
function duel8Begin(p){
  const C = S.camp, R = R8S(); r8Hide();
  const me = { ...duel8Strip(p), id: uid(), side: 0, x: 3.5, y: 6.5 }, foe = { ...duel8Strip(p), id: uid(), side: 1, name: '글리치 챔피언', key: '글리치 챔피언', x: 12.5, y: 6.5, nv: true, nvG: 'A', glitch: true };
  const M = MAPS8.ring, flips = []; for (let y = 0; y < M.NY; y++) for (let x = 0; x < M.NX; x++) if (M.rows[y][x] === '#') flips.push(x + ',' + y);
  C.s = 1; C.stages = { 1: { seed: 1 + Math.floor(Math.random() * 999999), tseed: 1 + Math.floor(Math.random() * 999999), r8: true } };
  const d0 = { noPause: S.noPause };
  Object.assign(S, { type: 'grid', W: M.NX, H: M.NY, amb: 1, mapC: false, randStart: false, seed: C.stages[1].seed, flips, torches: [], terr: '', tseed: C.stages[1].tseed, piles: [], hills: [], pileOff: [], indoor: true, zones: [], sandY: null, water: [], startK: null, noPause: true });
  S.art8 = 'ring'; S.hall = false; S.room = false; S.regina = false; S.holdClear = false;
  S.units = [me, foe]; selId = null; rebuildMap(); setMapUI(); save(); start(); renderFloors();
  const W = world; if (!W) return;
  W.explored && W.explored.fill(2); W.exitLock = true;
  for (const u of W.units){ u.max = Math.round(u.max * DU8.hpK); u.hp = u.max; }   // 결승 라운드 — 양쪽 같게
  W.r8 = { node: R.at, t: 'final' };
  W.duel = { me: W.units.findIndex(u => u.side === 0), foe: W.units.findIndex(u => u.side === 1), cd: {}, dash: [], acts: new WeakSet(), pacts: new WeakSet(), lastT: 0, drop: 6, hp: {}, ref: p.ref, name: p.name, d0, said: {} };
  for (const k of Object.keys(DIN8.keys)) DIN8.keys[k] = false; DIN8.jx = DIN8.jy = 0;
  logEv(W, { k: 'r8', s: `🏟 결승 — ${p.name} 대 글리치 챔피언. 특수능력 봉인.`, c: 'dim', vis: true });
  duel8Ui(true); campBarRender(true);
  if (W.fxOn) W.fx.push({ k: 'num', x: 8, y: 5, s: 'FIGHT!', c: 'h', t0: W.t });
  paused = false; cont = true; if (mode === 'plan') nextTurn();
}
// ===== 판마다 (r8Tick 에서) =====
function duel8Tick(W){
  const d = W.duel; if (!d || W.over) return;
  const me = W.units[d.me], foe = W.units[d.foe], dt = Math.max(0, Math.min(0.1, W.t - d.lastT)); d.lastT = W.t;
  // 끝
  if (!foe.alive || !me.alive){ d.res = !foe.alive && me.alive ? 'win' : 'lose'; W.over = true; W.result = d.res === 'win' ? 'win' : 'lose'; return; }
  if (W.t >= DU8.tLimit){ d.res = me.hp / me.max > foe.hp / foe.max ? 'win' : 'lose'; d.judge = true; logEv(W, { k: 'r8', s: `🎤 판정!! ${d.res === 'win' ? d.name : '글리치 챔피언'}의 손이 올라갑니다!`, c: d.res === 'win' ? 'good' : 'bad', vis: true }); W.over = true; W.result = d.res; return; }   // 판정 (권투처럼)
  // 대시 진행
  for (const s of d.dash.splice(0)){ const u = W.units[s.i]; if (!u || !u.alive) continue; const st = Math.min(dt, s.left), v = DU8.dash / DU8.dashT, nx = u.x + s.dx * v * st, ny = u.y + s.dy * v * st;
    if (!rock(W.map, nx, ny) && !solid(W.map, nx, ny) && Math.hypot(nx - W.units[s.o].x, ny - W.units[s.o].y) > u.r + W.units[s.o].r * 0.9){ u.x = nx; u.y = ny; } s.left -= st; if (s.left > 1e-6) d.dash.push(s); else stop(u); }
  // 유저 조작
  if (!TK && !paused){ const v = duel8Vec();
    if (DIN8.dash){ DIN8.dash = false; duel8Dash(W, me, v || duel8Away(me, foe)); }
    if (DIN8.atk){ DIN8.atk = false; me.order = { k: 'attack', b: foe.i }; preempt(W, me); d.mv = false; d.atkOn = true; }
    if (DIN8.guard){ DIN8.guard = false; me.guardMode = me.guardMode === 'hold' ? 'auto' : 'hold'; logEv(W, { k: 'guardMode', a: me.i, m: me.guardMode, why: '결승 조작', vis: true }); }
    if (v){ const tx = Math.max(2.4, Math.min(13.6, me.x + v.x * 1.2)), ty = Math.max(3.4, Math.min(9.6, me.y + v.y * 1.2)); me.order = { k: 'move', x: tx, y: ty }; if (!d.mv) preempt(W, me); d.mv = true; d.atkOn = false; }
    else if (d.mv){ d.mv = false; me.order = { k: 'hold' }; preempt(W, me); }
    else if (!me.order && !d.atkOn) me.order = { k: 'hold' }; }
  // 글리치 챔피언: 같은 대시 — 일격 준비를 보면 피하고, 빈틈이면 파고듦 (한 동작에 한 번 굴림)
  const a = me.act;
  if (a && a.b === foe.i && !d.acts.has(a)){
    if (a.phase === 'wind' && gap(me, foe) < 1.8){ d.acts.add(a); if (Math.random() < DU8.aiDashP) duel8Dash(W, foe, duel8Away(foe, me, true)); }
  }
  if (a && a.phase && a.phase !== 'wind' && a.b === foe.i && !d.pacts.has(a)){ d.pacts.add(a); const g = Math.hypot(me.x - foe.x, me.y - foe.y); if (g > 1.6 && g < 3.6 && Math.random() < DU8.aiPunishP){ duel8Dash(W, foe, { x: (me.x - foe.x) / g, y: (me.y - foe.y) / g }); foe.order = { k: 'attack', b: me.i }; } }
  // DJ 춘향 · MC
  if (W.t >= d.drop){ d.drop = W.t + DU8.dropGap[0] + Math.random() * (DU8.dropGap[1] - DU8.dropGap[0]); logEv(W, { k: 'r8', s: '🎧 DJ 춘향: "' + crPick(['드롭!', '베이스 올려!', '쿵 — 쿵 — 쿵!', '거인들, 박자 맞춰!']) + '"', c: 'dim', vis: true }); d.flash = performance.now(); }
  for (const [u, nm] of [[me, d.name], [foe, '글리치 챔피언']]){ const r = u.hp / u.max; for (const th of [0.5, 0.25]) if (r < th && !d.said[u.i + '_' + th]){ d.said[u.i + '_' + th] = 1; logEv(W, { k: 'r8', s: '🎤 ' + (th === 0.5 ? `${nm}, 절반이 날아갔습니다!` : `${nm}, 벼랑 끝입니다!!`), c: u.side ? 'good' : 'bad', vis: true }); } }
  duel8Hud(W);
}
function duel8Vec(){ const K = DIN8.keys; let x = (K.d || K.arrowright ? 1 : 0) - (K.a || K.arrowleft ? 1 : 0) + DIN8.jx, y = (K.s || K.arrowdown ? 1 : 0) - (K.w || K.arrowup ? 1 : 0) + DIN8.jy; const l = Math.hypot(x, y); return l > 0.25 ? { x: x / l, y: y / l } : null; }
function duel8Away(u, o, side){ const dx = u.x - o.x, dy = u.y - o.y, l = Math.hypot(dx, dy) || 1; let x = dx / l, y = dy / l; if (side){ const s = Math.random() < 0.5 ? 1 : -1; x = x * 0.5 - y * s * 0.87; y = y * 0.5 + (dx / l) * s * 0.87; } return { x, y }; }
function duel8Dash(W, u, v){
  const d = W.duel; if (!d || !v || W.t < (d.cd[u.i] || 0) || u.down || u.kb) return false;
  d.cd[u.i] = W.t + DU8.dashCd; if (u.act && u.act.phase === 'wind') u.act = null;
  d.dash.push({ i: u.i, o: u.side ? d.me : d.foe, dx: v.x, dy: v.y, left: DU8.dashT });
  logEv(W, { k: 'r8', s: `💨 ${u.side ? '글리치 챔피언' : d.name} — 회피 대시`, c: 'dim', vis: false });
  if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y - 0.5, s: '💨', c: 'm', t0: W.t });
  return true;
}
// ===== 그림: 춤추는 거인 · 조명 · 드롭 섬광 (drawArt8 에서) =====
function duel8Draw(Wd, ox, oy, ts){
  const t = performance.now() / 1000, beat = Math.abs(Math.sin(t * Math.PI * 2 * 0.95)), d = Wd.duel;
  ctx.save();
  for (const [gx, sgn] of [[0.9, 1], [15.1, -1]]){ const sway = Math.sin(t * 2.2 + (sgn > 0 ? 0 : 1.6)) * 0.35, x = ox + (gx + sway) * ts, y = oy + 6.2 * ts - beat * ts * 0.25, H = ts * 7.2;
    ctx.fillStyle = 'rgba(16,6,26,.62)'; ctx.beginPath(); ctx.ellipse(x, y, ts * 1.1, H * 0.42, sway * 0.2, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.arc(x + sway * ts * 0.4, y - H * 0.52, ts * 0.62, 0, 6.283); ctx.fill();
    ctx.strokeStyle = 'rgba(16,6,26,.62)'; ctx.lineCap = 'round'; ctx.lineWidth = ts * 0.42; ctx.beginPath(); ctx.moveTo(x - ts * 0.8, y - H * 0.25); ctx.lineTo(x - ts * 1.6, y - H * (0.45 + 0.25 * Math.sin(t * 4.4))); ctx.moveTo(x + ts * 0.8, y - H * 0.25); ctx.lineTo(x + ts * 1.6, y - H * (0.45 + 0.25 * Math.cos(t * 4.4))); ctx.stroke();
    ctx.fillStyle = `rgba(255,${120 + Math.round(beat * 80)},220,${(0.35 + beat * 0.4).toFixed(2)})`; ctx.beginPath(); ctx.arc(x + sway * ts * 0.4 - ts * 0.2, y - H * 0.55, ts * 0.09, 0, 6.283); ctx.arc(x + sway * ts * 0.4 + ts * 0.2, y - H * 0.55, ts * 0.09, 0, 6.283); ctx.fill(); }
  ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 3; k++){ const a = Math.PI / 2 + Math.sin(t * 0.8 + k * 2.1) * 0.7, x0 = ox + 8 * ts, y0 = oy - ts; const g = ctx.createLinearGradient(x0, y0, x0 + Math.cos(a) * ts * 12, y0 + Math.sin(a) * ts * 12); g.addColorStop(0, 'rgba(255,90,200,.22)'); g.addColorStop(1, 'rgba(255,90,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + Math.cos(a - 0.08) * ts * 12, y0 + Math.sin(a - 0.08) * ts * 12); ctx.lineTo(x0 + Math.cos(a + 0.08) * ts * 12, y0 + Math.sin(a + 0.08) * ts * 12); ctx.closePath(); ctx.fill(); }
  if (d && d.flash && performance.now() - d.flash < 450){ ctx.fillStyle = `rgba(255,120,220,${(0.28 * (1 - (performance.now() - d.flash) / 450)).toFixed(3)})`; ctx.fillRect(ox, oy, 16 * ts, 12 * ts); }
  ctx.globalCompositeOperation = 'source-over';
  if (d){ const f = Wd.units[d.foe]; if (f && f.alive && Math.random() < 0.35){ ctx.fillStyle = `rgba(${Math.random() < 0.5 ? '0,255,240' : '255,40,160'},.5)`; ctx.fillRect(ox + (f.x - 0.5 + (Math.random() - 0.5) * 0.3) * ts, oy + (f.y - 0.6 + Math.random() * 0.9) * ts, ts * (0.4 + Math.random() * 0.6), ts * 0.06 + 1); } }   // 글리치 줄
  ctx.restore();
}
// ===== 조작 화면 (체력 막대 · 휴대폰 막대 · 단추) =====
function duel8Ui(on){
  let el = $('duel8ui'); document.body.classList.toggle('d8', !!on); if (MOB){ zoomAll = !!on; try { mobFit(); } catch (e) {} } if (!on){ if (el) el.remove(); return; }
  if (!$('d8css')){ const st = document.createElement('style'); st.id = 'd8css'; st.textContent = `
#duel8ui{position:fixed;inset:0;pointer-events:none;z-index:40;font-family:inherit}
body.d8 #dock{display:none!important}
body.mob #duel8ui .d8hud{top:auto;bottom:168px}
#duel8ui .d8hud{position:absolute;left:50%;top:8px;transform:translateX(-50%);display:flex;gap:10px;align-items:center;background:rgba(10,6,16,.92);border:1px solid #4a2a50;border-radius:12px;padding:6px 10px;color:#f3e9ff;font-size:12px;max-width:calc(100vw - 24px);white-space:nowrap;box-shadow:0 4px 18px rgba(0,0,0,.5)}
#duel8ui .d8hud span:first-child,#duel8ui .d8hud span:last-child{max-width:22vw;overflow:hidden;text-overflow:ellipsis}
#duel8ui .d8hb{width:min(30vw,190px);height:9px;background:#3a1a28;border-radius:5px;overflow:hidden}#duel8ui .d8hb b{display:block;height:100%;background:#7fdc7a;transition:width .15s}#duel8ui .d8f b{background:#ff5ca8}
#duel8ui .d8tip{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);background:rgba(10,6,16,.6);color:#cdbfdc;font-size:11.5px;padding:4px 10px;border-radius:8px;white-space:nowrap}
#duel8ui .d8joy{position:absolute;left:18px;bottom:22px;width:128px;height:128px;border-radius:50%;background:rgba(20,10,30,.72);border:2px solid rgba(255,160,220,.45);pointer-events:auto;touch-action:none;box-shadow:0 4px 18px rgba(0,0,0,.5)}
#duel8ui .d8joy i{position:absolute;left:44px;top:44px;width:40px;height:40px;border-radius:50%;background:rgba(255,160,220,.55)}
#duel8ui .d8btns{position:absolute;right:14px;bottom:22px;display:grid;grid-template-columns:repeat(2,72px);gap:10px;pointer-events:auto}
#duel8ui .d8btns button{height:64px;border-radius:50%;border:2px solid rgba(255,255,255,.3);background:rgba(40,16,48,.75);color:#fff;font-size:13px;font-weight:700;touch-action:none}
#duel8ui .d8btns button.on{background:rgba(110,60,150,.9)}#duel8ui .d8btns button[data-d8="atk"]{grid-column:span 2;border-radius:32px;background:rgba(160,30,90,.85)}`; document.head.appendChild(st); }
  if (!el){ el = document.createElement('div'); el.id = 'duel8ui'; document.body.appendChild(el); }
  el.innerHTML = `<div class="d8hud"><span id="d8n0"></span><span class="d8hb"><b id="d8h0" style="width:100%"></b></span><b id="d8t">VS</b><span class="d8hb d8f"><b id="d8h1" style="width:100%"></b></span><span>글리치 챔피언</span></div>`
    + (MOB ? `<div class="d8joy" id="d8joy"><i id="d8knob"></i></div><div class="d8btns"><button type="button" data-d8="guard">막기</button><button type="button" data-d8="dash">회피</button><button type="button" data-d8="atk">공격</button></div>` : `<div class="d8tip">WASD · 방향키 이동 · J 공격 · K 막기 · Space 회피 대시</div>`);
  if (MOB){ const J = $('d8joy'), kn = $('d8knob'); let id = null;
    const mv = e => { const r = J.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; let x = (e.clientX - cx) / (r.width / 2), y = (e.clientY - cy) / (r.height / 2); const l = Math.hypot(x, y); if (l > 1){ x /= l; y /= l; } DIN8.jx = x; DIN8.jy = y; kn.style.transform = `translate(${x * 40}px,${y * 40}px)`; };
    J.addEventListener('pointerdown', e => { id = e.pointerId; J.setPointerCapture(id); mv(e); e.preventDefault(); });
    J.addEventListener('pointermove', e => { if (e.pointerId === id) mv(e); });
    const up = e => { if (e.pointerId !== id) return; id = null; DIN8.jx = DIN8.jy = 0; kn.style.transform = ''; }; J.addEventListener('pointerup', up); J.addEventListener('pointercancel', up);
    el.querySelectorAll('[data-d8]').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); DIN8[b.dataset.d8] = true; })); }
}
function duel8Hud(W){
  const d = W.duel, me = W.units[d.me], foe = W.units[d.foe], n0 = $('d8n0'); if (!n0) return;
  n0.textContent = d.name; $('d8h0').style.width = Math.max(0, me.hp / me.max * 100).toFixed(1) + '%'; $('d8h1').style.width = Math.max(0, foe.hp / foe.max * 100).toFixed(1) + '%';
  const tt = $('d8t'); if (tt) tt.textContent = Math.max(0, Math.ceil(DU8.tLimit - W.t)) + '';
  const gb = document.querySelector('#duel8ui [data-d8="guard"]'); if (gb) gb.classList.toggle('on', me.guardMode === 'hold');
}
window.addEventListener('keydown', e => {
  if (!d8On() || TK || (e.target && e.target.closest && e.target.closest('input, textarea, select'))) return; const k = e.key.toLowerCase();
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)){ DIN8.keys[k] = true; e.preventDefault(); e.stopImmediatePropagation(); return; }
  if (k === 'j'){ DIN8.atk = true; e.preventDefault(); e.stopImmediatePropagation(); return; }
  if (k === 'k'){ if (!e.repeat) DIN8.guard = true; e.preventDefault(); e.stopImmediatePropagation(); return; }
  if (k === ' '){ if (!e.repeat) DIN8.dash = true; e.preventDefault(); e.stopImmediatePropagation(); return; }
}, true);
window.addEventListener('keyup', e => { const k = (e.key || '').toLowerCase(); if (k in DIN8.keys || ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) DIN8.keys[k] = false; }, true);
// ===== 끝 =====
function duel8Over(W, res){
  const R = R8S(), d = W.duel; if (!d || d.done) return; d.done = true; duel8Ui(false);
  S.noPause = d.d0.noPause; cont = false; paused = false;
  (R.log = R.log || []).push({ f: 30, k: 'final', res, t: Date.now(), who: d.name, secs: +W.t.toFixed(1) });
  save();
  const L = res === 'win' ? [
    { t: d.judge ? '판정!!! 심판 전원 일치 — 새 챔피언!!!' : '끝났습니다!!! 끝났어요!!! 새 챔피언!!!', name: 'MC 더 플링' },
    { narr: '글리치 챔피언이 무릎을 꿇는다. 노이즈가 걷히고, 얼굴이 처음으로 또렷해진다 — 앳된 얼굴. 손에 꺼진 횃불 하나.' },
    { t: '…300년. 드디어, 누가 내 불을 받아 주는구나.', name: '글리치 챔피언' },
    { narr: '그의 횃불 속에 남아 있던 불씨가 인주의 횃불로 옮겨 붙는다. 불씨 둘이 겹친다.' },
    { t: '…기록 오류. 기록 오류. 무대를 — 닫습니다.', name: '관리자', img: 'run8/admin' },
    { t: '이건 내가 틀어 본 것 중에 제일 좋은 엔딩이야.', name: 'DJ 춘향' },
    { narr: '굴의 바닥이 열린다. 저 아래, 아주 먼 곳에서 — 무언가 뛰기 시작한다. 쿵. 쿵.' },
    { go: '!r8:duelEnd' }] : [
    { t: d.judge ? '판정— 챔피언 방어 성공! 300년 하고도 하루!' : '아아— 챔피언 방어 성공! 300년 하고도 하루!', name: 'MC 더 플링' },
    { narr: '화면이 찢어진다. 노이즈 속에서 글리치 챔피언의 얼굴이 — 잠깐, ' + d.name + '의 얼굴로 굳는다.' },
    { t: '새 챔피언 데이터 저장. 다음 시즌을 준비합니다.', name: '관리자', img: 'run8/admin' },
    { t: '다음 시즌, 또 만나요!', name: 'MC 더 플링' },
    { go: '!r8:duelEnd' }];
  d.endKind = res === 'win' ? 'true' : 'lose30'; R.flags.final = d.endKind; save();
  talkLines(L);
}
const R8X = { duelPick: () => duel8Pick(), duelEnd: () => { const R = R8S(); r8End((R.flags || {}).final || 'lose30'); } };
