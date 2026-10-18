import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.8.9 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.9.0 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.9.0: 모바일 조작 — 오지휘를 없앰.
             · 탭은 이동 · 공격만: 아군 = 고르기 · 적 = 공격 · 바닥 = 이동 (물건 위여도 이동). 빠르게 두 번 탭해도 서두름 · 바로 쏨이 되지 않음.
             · 꾹 누르기 = 진짜 슬로우 (시간 0.1배) + 손가락 둘레에 기술 부채. 그대로 끌어 고름 (방향으로 고름), 아래로 끌면 취소.
               아군을 꾹 누르면 그 아군의 기술, 다른 곳이면 고른 아군의 기술. 인물을 꾹 누르면 ⓘ 상세도 부채에.
               기술: 돌진 · 투창 (창 줍기) · 도약 · 약 · 서둘러 (이동 · 근접 공격) · 바로 쏴 (사수, 오사 감수) · 막기 모드 · 휘두르기 · 줍기.
             · 대상이 필요한 기술은 켜진 채로 슬로우 유지 → 대상을 탭하면 그 기술 (돌진 = 적 · 바닥, 투창 · 바로 쏴 = 적, 약 = 아군, 서둘러 = 바닥 · 적, 줍기 = 물건).
               맞지 않는 것을 탭하면 아무 명령도 없이 알림만. 아래로 쓸기 · ✕ = 취소. 손을 떼기만 하면 부채가 남아 탭으로 고를 수 있음 (바깥 탭 = 닫기, 명령 없음).
             · 아래 조작판의 기술 단추로 켜도 같은 슬로우 · 같은 탭 규칙.
""",'notes')
rep('<span class="ver">v5.8.9 · 명령이 자동 치료보다 먼저','<span class="ver">v5.9.0 · 모바일: 꾹 = 슬로우 + 기술 부채 · 탭은 이동 · 공격만 · v5.8.9 · 명령이 자동 치료보다 먼저','ver')
rep("<footer>굴의 전투판 v5.8.9","<footer>굴의 전투판 v5.9.0",'footer')
rep("return `굴의 전투판 v5.8.9 · ${title}","return `굴의 전투판 v5.9.0 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.8.9\";","body.mob .top h1::after{content:\" v5.9.0\";",'mobver')
# DOM + CSS
rep("        <div class=\"ring\" id=\"ring\" hidden aria-label=\"기술 고리\"></div>\n",
    "        <div class=\"ring\" id=\"ring\" hidden aria-label=\"기술 고리\"></div>\n        <div class=\"fan\" id=\"fan\" hidden aria-label=\"기술 부채\"></div>\n",'dom')
rep(".ring{position:absolute;left:0;top:0;width:0;height:0;z-index:5;pointer-events:none}",
    """.ring{position:absolute;left:0;top:0;width:0;height:0;z-index:5;pointer-events:none}
.fan{position:absolute;left:0;top:0;width:0;height:0;z-index:7;pointer-events:none}
.fan .fb{position:absolute;width:58px;height:58px;margin:-29px 0 0 -29px;border-radius:50%;pointer-events:none;background:rgba(20,17,22,.95);border:2px solid var(--accent);color:#ece4d6;display:flex;flex-direction:column;align-items:center;justify-content:center;font:600 10.5px var(--sans);line-height:1.1;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,.5);transition:transform .08s}
.fan.open .fb{pointer-events:auto}
.fan .fb .ic{font-size:20px;line-height:1.05}
.fan .fb small{font:600 9px var(--mono);color:#ffd77a}
.fan .fb.hi{background:color-mix(in srgb,var(--accent) 60%,#141116);border-color:#ffe196;transform:scale(1.18)}
.fan .fb.cd{opacity:.6}
.fan .fc0{position:absolute;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#ffe196;box-shadow:0 0 0 4px rgba(255,225,150,.25)}
.fan .fx{position:absolute;margin:0;transform:translate(-50%,0);font:700 12px var(--sans);color:#d8cfc0;background:rgba(10,8,12,.85);border:1px solid #5a5060;border-radius:12px;padding:3px 10px;white-space:nowrap}
.fan.cx .fx{color:#fff;background:#b3122a;border-color:#ff8a70}
.fan .fs{position:absolute;transform:translate(-50%,-100%);font:700 11px var(--mono);color:#9fd2ff;white-space:nowrap;text-shadow:0 1px 3px #000}""",'css')
# 슬로우
rep("    let budget = dt * speed;",
    "    let budget = dt * speed * (slowNow() ? FOCUS_SLOW : 1);   // v5.9.0 모바일: 꾹 누름 · 기술이 켜진 동안 진짜 슬로우",'slow')
# 탭 = 이동 · 공격만
rep("""  const u = unitNear(world, w.x, w.y);
  // v5.8.2 아군 탭 = 고르기 + 그 머리 위에 기술 고리 (다시 탭하면 닫힘)
  if (u && u.side === 0 && !skillPick){ const again = ringFor === u.i && sel.size === 1 && sel.has(u.i); playClick(w, false, u); if (again) closeRing(); else openRing(u); return; }
  closeRing();
  if (u || skillPick || throwPick || chargePick || amovePick){ playClick(w, false, u); return; }
  const L = selUnits(world);
  if (!L.length){ toast('아군을 먼저 고르세요 — 판의 아군이나 아래 칩을 탭'); return; }
  const it = itemAt(world, w.x, w.y); if (it){ givePick(it); return; }
  rightClick(w);""",
"""  closeRing();
  if (armedNow()){ armedTap(w); return; }   // v5.9.0 기술이 켜져 있으면 그 기술의 대상만
  const u = unitNear(world, w.x, w.y);
  // v5.9.0 탭은 이동 · 공격만: 아군 = 고르기 · 적 = 공격 · 바닥 = 이동 (물건 위여도). 두 번 탭 변형 (서두름 · 바로 쏨) 없음
  if (u && u.side === 0){ pickAlly(u.i, false); hud(); return; }
  const L = selUnits(world);
  if (amovePick){ amovePick = false; if (!L.length){ toast('먼저 명령할 아군을 고르세요'); hud(); return; } groupMove(L, w.x, w.y, 'amove'); hud(); return; }
  if (!L.length){ toast('아군을 먼저 고르세요 — 판의 아군이나 아래 칩을 탭'); return; }
  if (u && u.side === 1){ lastAC = null; giveAttack(u); lastAC = null; return; }
  lastRC = null; rightClick(w); lastRC = null;""",'tap')
# 꾹 누름 → 부채 (배치 중엔 상세 그대로)
rep("""function longPress(w){
  const Wd = W_(); if (!Wd) return;""",
"""function longPress(w, sx, sy){
  if (mode !== 'edit' && world && !world.over && sx != null && openFan(w, sx, sy)){ try { navigator.vibrate && navigator.vibrate(15); } catch (e) {} return true; }   // v5.9.0 꾹 = 슬로우 + 기술 부채
  const Wd = W_(); if (!Wd) return;""",'long')
rep("  if (pd.touch){ clearTimeout(lpT); lpT = setTimeout(() => { if (pd && !pd.moved && !pinch){ pd.long = true; longPress(toWorld(pd.x, pd.y)); } }, 480); }",
    """  if (pd.touch && focus && focus.phase === 'open'){ closeFan(); pd.ignore = true; return; }   // v5.9.0 부채 바깥 탭 = 닫기 (명령 없음)
  if (pd.touch && armedNow()) pd.armed = true;
  if (pd.touch){ clearTimeout(lpT); lpT = setTimeout(() => { if (pd && !pd.moved && !pinch){ pd.long = true; const r0 = cv.getBoundingClientRect(); pd.fan = longPress(toWorld(pd.x, pd.y), pd.x - r0.left, pd.y - r0.top) === true; } }, 420); }""",'down')
rep("""  if (!pd){ hoverTip(e); return; }
  if (pd.touch && Math.hypot(e.clientX - pd.x, e.clientY - pd.y) >= 9) clearTimeout(lpT);""",
"""  if (!pd){ hoverTip(e); return; }
  if (pd.fan){ fanDrag(e.clientX - pd.x, e.clientY - pd.y); return; }   // v5.9.0 부채: 끈 방향으로 고름 · 아래 = 취소
  if (pd.ignore) return;
  if (pd.touch && Math.hypot(e.clientX - pd.x, e.clientY - pd.y) >= 9) clearTimeout(lpT);
  if (pd.armed){ if (Math.hypot(e.clientX - pd.x, e.clientY - pd.y) >= 6) pd.moved = true; return; }   // 기술이 켜진 동안 한 손가락 끌기는 화면을 옮기지 않음 (아래로 쓸기 = 취소)""",'move')
rep("""  const d = pd; pd = null; if (!d) return;
  if (d.long) return;   // 길게 누름 = 상세정보만""",
"""  const d = pd; pd = null; if (!d) return;
  if (d.fan){ fanRelease(); return; }   // v5.9.0
  if (d.ignore) return;
  if (d.armed && d.moved){ const dx = e.clientX - d.x, dy = e.clientY - d.y; if (dy > 45 && dy > Math.abs(dx)) cancelArmed('아래로 쓸어 취소'); return; }
  if (d.long) return;   // 길게 누름 = 상세정보만 (배치 중)""",'up')
rep("cv.addEventListener('pointercancel', e => { touches.delete(e.pointerId); clearTimeout(lpT); if (touches.size < 2) pinch = null; pd = null; boxSel = null; });",
    "cv.addEventListener('pointercancel', e => { touches.delete(e.pointerId); clearTimeout(lpT); if (touches.size < 2) pinch = null; if (pd && pd.fan && focus && focus.phase === 'drag'){ focus.phase = 'open'; renderFan(); } pd = null; boxSel = null; });",'cancel')
# 조작판 안내 · 고르기 글
rep("  const pickTxt = chargePick ? '돌진: 적이나 바닥을 탭' : throwPick ? '투창: 적을 탭' : skillPick ? '약: 아군 (판 · 칩) 을 탭' : amovePick ? '공격 이동: 바닥을 탭' : '';",
    "  const pickTxt = armedTxt() || (amovePick ? '공격 이동: 바닥을 탭' : '');",'pickTxt')
rep("  if (k === 'pickx'){ skillPick = null; throwPick = null; chargePick = null; amovePick = false; toast('고르기를 취소했어요'); hud(); return; }",
    "  if (k === 'pickx'){ skillPick = null; throwPick = null; chargePick = null; amovePick = false; armed = null; toast('고르기를 취소했어요'); hud(); return; }",'pickx')
rep("<span class=\"dhint\">아군을 탭해 고르세요 (머리 위에 기술 고리). 그다음 바닥 탭 = 이동 · 적 탭 = 공격 · 빠르게 두 번 = 서두름 · 길게 누르기 = 상세</span>",
    "<span class=\"dhint\">아군을 탭해 고르세요. 바닥 탭 = 이동 · 적 탭 = 공격. 꾹 누르면 슬로우 + 기술 부채 (끌어서 고름 · 아래로 = 취소)</span>",'hint')
rep("터치: 아군을 탭해 고름 (아래 칩 = 여럿) → 바닥 탭 = 이동 · 적 탭 = 공격 · 물건 탭 = 줍기 · 같은 곳을 빠르게 두 번 = 서두름 (사수는 바로 쏨). 끌기 = 화면 옮기기 · 두 손가락 = 확대 · 길게 누르기 = 상세정보. 아군을 탭하면 머리 위에 기술 고리 (돌진 · 투창 · 도약 · 약 — 탭하면 대상 고르기).",
    "터치: 탭은 이동 · 공격만 — 아군 = 고르기 (아래 칩 = 여럿) · 바닥 = 이동 · 적 = 공격. 꾹 누르기 = 슬로우 (0.1배) + 손가락 둘레 기술 부채 → 그대로 끌어 고름 · 아래로 끌면 취소 (아군을 꾹 = 그 아군 기술 · 인물을 꾹 = ⓘ 상세도). 대상이 필요한 기술은 켜진 채로 → 대상을 탭 (아래로 쓸기 · ✕ = 취소). 끌기 = 화면 옮기기 · 두 손가락 = 확대.",'mobkeys')
# 부채 · 켜진 기술
rep("let ringFor = null, ringHtml = '';",
"""let ringFor = null, ringHtml = '';
/* ---------- v5.9.0 모바일: 꾹 누름 = 슬로우 + 기술 부채 · 켜진 기술은 대상 탭으로만 · 아래로 = 취소 ---------- */
const FOCUS_SLOW = 0.1;
let focus = null, armed = null;   // focus = { cas, pu, x, y, cx, cy, items, hi, cancel, phase: 'drag' | 'open' } · armed = { k, cas } (서둘러 · 바로 쏴 · 줍기 — 돌진 · 투창 · 약은 chargePick · throwPick · skillPick)
const armedNow = () => !!(armed || chargePick || throwPick || skillPick);
const slowNow = () => MOB && !!world && !world.over && (!!focus || armedNow());
function armedTxt(){ const k = armed ? armed.k : chargePick ? 'charge' : throwPick ? 'throw' : skillPick ? 'skill' : null; if (!k) return '';
  return (MOB ? '⏳ 슬로우 · ' : '') + ({ charge: '💨 돌진: 적이나 바닥을 탭', throw: '🔱 투창: 적을 탭', skill: '✚ 약: 아군을 탭', hurry: '➜➜ 서둘러: 바닥 (이동) · 적 (공격) 을 탭', rapid: '⚡ 바로 쏴: 적을 탭 (오사 감수)', pick: '✋ 줍기: 떨어진 물건을 탭' }[k] || k) + (MOB ? ' · 아래로 쓸면 취소' : ''); }
function fanItems(Wd, cas, pu){
  const C = cas.map(i => Wd.units[i]).filter(u => u && u.alive && u.side === 0), out = [];
  if (pu) out.push({ k: 'info', ic: 'ⓘ', nm: '상세' });
  if (!C.length) return out;
  const ch = slotState(Wd, C, 1); if (!ch.off) out.push({ k: 'charge', ic: ch.ic, nm: '돌진', cd: ch.cd });
  if (C.some(u => u.jav && u.spearHeld)) out.push({ k: 'throw', ic: '🔱', nm: '투창' });
  else if (C.some(u => u.jav && !u.spearHeld && mySpear(Wd, u))) out.push({ k: 'pickSpear', ic: '🔱', nm: '창 줍기' });
  const lp = slotState(Wd, C, 3); if (!lp.off) out.push({ k: 'leap', ic: '↩', nm: '도약', cd: lp.cd });
  if (C.some(u => u.skill && u.skill.left > 0)){ const sk = slotState(Wd, C, 4); out.push({ k: 'skill', ic: '✚', nm: (sk.nm || '약').slice(0, 4), cd: sk.cd }); }
  out.push({ k: 'hurry', ic: '➜➜', nm: '서둘러' });
  if (C.some(u => isFar(u))) out.push({ k: 'rapid', ic: '⚡', nm: '바로 쏴' });
  if (C.some(u => u.canGuard)){ const m = { auto: 'hold', hold: 'off', off: 'auto' }[(C.find(u => u.canGuard) || {}).guardMode || 'auto']; out.push({ k: 'guard', ic: '🛡', nm: '막기→' + ({ auto: '자동', hold: '유지', off: '공격' }[m] || m) }); }
  if (C.some(u => u.canSweep)) out.push({ k: 'swing', ic: '⚔', nm: '휘두르기' });
  if ((Wd.items || []).some(it => it.k !== 'spear' && C.some(u => canTake(Wd, u, it) && Math.hypot(it.x - u.x, it.y - u.y) < 8))) out.push({ k: 'pick', ic: '✋', nm: '줍기' });
  return out;
}
function openFan(w, sx, sy){
  const Wd = world; if (!Wd || Wd.over) return false;
  const u = unitNear(Wd, w.x, w.y), mine = u && u.side === 0 && u.alive;
  const cas = mine ? [u.i] : [...sel].filter(i => Wd.units[i] && Wd.units[i].alive && Wd.units[i].side === 0);
  if (mine) sel = new Set([u.i]);
  const items = fanItems(Wd, cas, u || null);
  if (!items.length){ toast('아군을 먼저 고르세요 (탭) — 꾹 누르면 그 아군의 기술'); return false; }
  closeRing(); chargePick = throwPick = skillPick = null; armed = null;
  const n = items.length, span = n > 1 ? Math.min(156, 26 * (n - 1) + 30) : 0, R = Math.max(86, n * 50 / (Math.max(span, 60) * Math.PI / 180));
  items.forEach((it, j) => { it.a = n > 1 ? -90 - span / 2 + j * span / (n - 1) : -90; });
  const W2 = cv.clientWidth, H2 = cv.clientHeight, cx = Math.min(W2 - R * Math.max(0.3, Math.sin(span / 2 * Math.PI / 180)) - 34, Math.max(R * Math.max(0.3, Math.sin(span / 2 * Math.PI / 180)) + 34, sx)), cy = Math.min(H2 - 60, Math.max(R + 36, sy));
  focus = { cas, pu: u ? u.i : null, x: sx, y: sy, cx, cy, R, items, hi: null, cancel: false, phase: 'drag' };
  renderFan(); hud(); return true;
}
function fanDrag(dx, dy){
  const F = focus; if (!F) return;
  const d = Math.hypot(dx, dy); let hi = null, cancel = false;
  if (d >= 26){ let a = Math.atan2(dy, dx) * 180 / Math.PI;   // 화면: 아래가 +
    if (a > 40 && a < 140) cancel = true;
    else { if (a >= 140) a -= 360; let best = null, bd = 1e9; for (const it of F.items){ const g = Math.abs(it.a - a); if (g < bd){ bd = g; best = it; } } if (best && bd <= 34) hi = best.k; } }
  if (hi !== F.hi || cancel !== F.cancel){ F.hi = hi; F.cancel = cancel; renderFan(); }
}
function fanRelease(){
  const F = focus; if (!F) return;
  if (F.cancel){ closeFan(); toast('취소했어요'); return; }
  if (F.hi){ fanUse(F.hi); return; }
  F.phase = 'open'; renderFan();   // 손만 뗌 → 부채가 남아 탭으로 고름 (바깥 탭 = 닫기)
}
function closeFan(){ focus = null; const f = $('fan'); if (f){ f.hidden = true; f.innerHTML = ''; f.className = 'fan'; } hud(); }
function renderFan(){
  const f = $('fan'), F = focus; if (!f) return; if (!F){ f.hidden = true; return; }
  const btn = it => { const x = F.cx + Math.cos(it.a * Math.PI / 180) * F.R, y = F.cy + Math.sin(it.a * Math.PI / 180) * F.R;
    return `<button type="button" class="fb ${F.hi === it.k ? 'hi' : ''} ${it.cd > 0 ? 'cd' : ''}" data-fk="${it.k}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px"><span class="ic">${it.ic}</span>${esc(it.nm)}${it.cd > 0 ? `<small>${f2(it.cd)}초</small>` : ''}</button>`; };
  f.innerHTML = F.items.map(btn).join('') + `<i class="fc0" style="left:${F.cx}px;top:${F.cy}px"></i><span class="fs" style="left:${F.cx}px;top:${(F.cy - F.R - 34).toFixed(1)}px">⏳ 슬로우</span><span class="fx" style="left:${F.cx}px;top:${(F.cy + 40).toFixed(1)}px">${F.phase === 'open' ? '탭해서 고르기 · 바깥 탭 = 닫기' : '↓ 아래로 끌면 취소'}</span>`;
  f.className = 'fan' + (F.phase === 'open' ? ' open' : '') + (F.cancel ? ' cx' : ''); f.hidden = false;
}
$('fan').addEventListener('click', e => { const b = e.target.closest('[data-fk]'); if (b && focus) fanUse(b.dataset.fk); });
function fanUse(k){
  const Wd = world, F = focus; if (!Wd || !F){ closeFan(); return; }
  const C = F.cas.map(i => Wd.units[i]).filter(u => u && u.alive && u.side === 0);
  if (k === 'info'){ const u = F.pu != null ? Wd.units[F.pu] : null; closeFan(); if (u){ hoverPid = u.pid; openDet(true); } return; }
  sel = new Set(C.map(u => u.i)); closeFan();
  if (k === 'leap'){ useSlot(3); hud(); return; }
  if (k === 'guard'){ ordKey('guard'); hud(); return; }
  if (k === 'swing'){ ordKey('swing'); hud(); return; }
  if (k === 'pickSpear'){ ordKey('pick'); hud(); return; }
  // 대상이 필요한 기술 → 켜 둠 (슬로우 유지) — 대상을 탭하면 씀
  if (k === 'charge') chargePick = C.filter(u => u.canCharge && !u.crawl).map(u => u.i);
  else if (k === 'throw') throwPick = C.filter(u => u.jav && u.spearHeld).map(u => u.i);
  else if (k === 'skill') skillPick = C.filter(u => u.skill && u.skill.left > 0).map(u => u.i);
  else armed = { k, cas: C.map(u => u.i) };
  toast(armedTxt()); hud();
}
function cancelArmed(why){ chargePick = throwPick = skillPick = null; armed = null; amovePick = false; toast(why || '기술을 껐어요'); hud(); }
// 기술이 켜진 채 탭: 그 기술에 맞는 대상만 — 아니면 명령 없이 알림 (오지휘 없음)
function armedTap(w){
  const Wd = world, u = unitNear(Wd, w.x, w.y), k = armed ? armed.k : chargePick ? 'charge' : throwPick ? 'throw' : 'skill';
  const done = () => { armed = null; hud(); };
  if (k === 'charge'){ if (u && u.side === 1){ giveCharge(u); return done(); } if (!u){ giveChargePt(w.x, w.y); return done(); } toast('돌진: 적이나 바닥을 탭 (아군 X) · 아래로 쓸면 취소'); return; }
  if (k === 'throw'){ if (u && u.side === 1){ giveThrow(u); return done(); } toast('투창: 적을 탭 · 아래로 쓸면 취소'); return; }
  if (k === 'skill'){ if (u && u.side === 0){ giveSkill(u); return done(); } toast('약: 아군을 탭 · 아래로 쓸면 취소'); return; }
  const L = armed.cas.map(i => Wd.units[i]).filter(x => x && x.alive); if (!L.length){ return done(); } sel = new Set(L.map(x => x.i));
  if (k === 'hurry'){
    if (u && u.side === 1){ L.forEach(x => { x.order = { k: 'attack', b: u.i, ...(isFar(x) ? {} : { hurry: true }) }; x.last = { x: u.x, y: u.y }; }); noteOrders(L); toast(`${L.map(x => x.name).join(' · ')} → ${u.name} 서둘러 공격`); return done(); }
    if (!u || u.side === 0){ groupMove(L, w.x, w.y, 'move', true); return done(); } }
  if (k === 'rapid'){ const F2 = L.filter(isFar); if (u && u.side === 1 && F2.length){ F2.forEach(x => { x.order = { k: 'attack', b: u.i, now: true }; x.last = { x: u.x, y: u.y }; }); noteOrders(F2); toast(`${F2.map(x => x.name).join(' · ')} → ${u.name} 바로 쏴! (오사 감수)`); return done(); } toast('바로 쏴: 적을 탭 · 아래로 쓸면 취소'); return; }
  if (k === 'pick'){ const it = (Wd.items || []).filter(x => x.k !== 'spear' && Math.hypot(x.x - w.x, x.y - w.y) < 0.9).sort((a, b) => Math.hypot(a.x - w.x, a.y - w.y) - Math.hypot(b.x - w.x, b.y - w.y))[0]; if (it && givePick(it)) return done(); toast('줍기: 떨어진 물건을 탭 · 아래로 쓸면 취소'); return; }
  done();
}""",'fan')
open(P,'w').write(s); print('ok')
