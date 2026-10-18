import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
# header
rep("<!-- 굴의 전투판 v5.7.1 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.7.2 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.7.2: Space = 재생 · 멈춤 (턴 중간에도 바로 멈추고, 멈춘 채로 명령을 줄 수 있음). Enter = 한 턴만.
             시작 행동 — 0초에서 멈춘 채로 준 명령 (이동 · 공격 · 전열 · 제자리 · 막기 모드 · 휘두르기) 은 이 배치의 시작 행동으로 저장돼, 같은 배치로 다시 하면 그대로 걸림.
             기본 재생 속도 ½× (고른 속도는 기억함).
""",'notes')
rep('<span class="ver">v5.7.1 · 무구로 막기','<span class="ver">v5.7.2 · Space 재생 · 멈춤 · 시작 행동 · 무구로 막기','ver')
rep("<footer>굴의 전투판 v5.7.1","<footer>굴의 전투판 v5.7.2",'footer')
rep("return `굴의 전투판 v5.7.1 · ${title}","return `굴의 전투판 v5.7.2 · ${title}",'export')
# speed default buttons
rep('<span class="seg" id="speedSeg" aria-label="재생 속도"><button type="button" data-sp="0.25">½×</button><button type="button" data-sp="0.5" class="on">1×</button>',
    '<span class="seg" id="speedSeg" aria-label="재생 속도"><button type="button" data-sp="0.25" class="on">½×</button><button type="button" data-sp="0.5">1×</button>','seg')
rep("let mode = 'edit', paused = false, speed = 0.5, world = null,","let mode = 'edit', paused = false, speed = 0.25, world = null,",'spd')
rep("$('speedSeg').addEventListener('click', e => { const b = e.target.closest('[data-sp]'); if (!b) return; speed = +b.dataset.sp; $('speedSeg').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); });",
    "$('speedSeg').addEventListener('click', e => { const b = e.target.closest('[data-sp]'); if (!b) return; speed = +b.dataset.sp; S.speed = speed; save(); $('speedSeg').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); });\n{ speed = S.speed != null && isFinite(+S.speed) ? +S.speed : 0.25; $('speedSeg').querySelectorAll('button').forEach(x => x.classList.toggle('on', +x.dataset.sp === speed)); }   // v5.7.2 기본 ½× · 고른 속도는 기억",'spd2')
# frame: paused
rep("  if (mode === 'run' && world){\n    let budget = dt * speed;","  if (mode === 'run' && world && !paused){   // v5.7.2 멈춤 (Space)\n    let budget = dt * speed;",'frame')
rep("      if (world.over){ mode = 'plan'; cont = false; onOver(); }","      if (world.over){ mode = 'plan'; cont = false; paused = false; onOver(); }",'over')
# start: apply openers
rep("""  world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0);
  mode = 'plan'; cont = false; selId = null;""","""  world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0);
  mode = 'plan'; cont = false; paused = false; selId = null;
  const nOp = applyOpeners(world);   // v5.7.2 저장된 시작 행동""",'start')
rep("  logShown = { W: world, n: 0 }; logTitle = '전투 로그'; renderLog(true); renderNarr(); hud();\n}",
    "  logShown = { W: world, n: 0 }; logTitle = '전투 로그'; renderLog(true); renderNarr(); hud();\n  if (nOp) toast(`시작 행동 ${nOp}개를 다시 걸었어요 (지난번 0초 명령 그대로) — 바꾸려면 명령을 다시 주고, Space 로 시작`);\n}",'start2')
# nextTurn: capture openers at t=0; paused handling
rep("""function nextTurn(){
  if (mode === 'edit' || (world && world.over)){ start(); return; }
  if (mode !== 'plan') return;
  beginTurn(world); mode = 'run'; hud(); renderLog();
}""","""function nextTurn(){
  if (mode === 'edit' || (world && world.over)){ start(); return; }
  if (mode === 'run' && paused){ paused = false; cont = false; hud(); return; }   // 멈춘 턴을 끝까지
  if (mode !== 'plan') return;
  if (world.turn === 0 && world.t < 1e-6) saveOpeners(world);   // v5.7.2 0초 명령 = 이 배치의 시작 행동
  beginTurn(world); mode = 'run'; hud(); renderLog();
}
// v5.7.2 Space: 재생 ↔ 멈춤. 배치 중이면 0초에서 멈춘 채로 엶 (시작 행동을 줌), 명령 차례면 계속 재생, 진행 중이면 그 자리에서 멈춤
function togglePlay(){
  if (mode === 'edit' || (world && world.over)){ start(); return; }
  if (!world) return;
  if (mode === 'run'){ paused = !paused; if (!paused) cont = true; hud(); return; }
  cont = true; nextTurn();
}
// v5.7.2 시작 행동: 0초에 준 아군의 명령 · 막기 모드 · 휘두르기를 배치 (pid) 에 묶어 저장 → 다음 판 시작 때 그대로
function saveOpeners(Wd){
  const pidOf = i => (Wd.units[i] || {}).pid;
  S.openers = Wd.units.filter(u => u.side === 0 && u.pid != null).map(u => {
    const o = u.order ? { ...u.order } : null; if (o && o.b != null){ o.bp = pidOf(o.b); delete o.b; } if (o) delete o.n;
    return { pid: u.pid, o, gm: u.guardMode && u.guardMode !== 'auto' ? u.guardMode : null, sw: u.swing || null };
  }).filter(x => x.o || x.gm || x.sw);
  save();
}
function applyOpeners(Wd){
  let n = 0;
  for (const op of S.openers || []){
    const u = Wd.units.find(x => x.pid === op.pid && x.side === 0); if (!u) continue;
    if (op.o){ const o = { ...op.o }; if (o.bp != null){ const t = Wd.units.find(x => x.pid === o.bp); if (!t) continue; o.b = t.i; delete o.bp; } u.order = o; n++; }
    if (op.gm && u.canGuard){ u.guardMode = op.gm; n++; }
    if (op.sw && u.canSweep){ u.swing = op.sw; n++; }
  }
  if (n) noteOrders(Wd.units.filter(u => u.side === 0 && u.order));
  return n;
}""",'nt')
rep("function resetToEdit(){\n  mode = 'edit'; world = null; cont = false;","function resetToEdit(){\n  mode = 'edit'; world = null; cont = false; paused = false;",'reset')
# contBtn = play/pause
rep("""$('contBtn').addEventListener('click', () => {
  if (!world || world.over) return;
  cont = !cont;
  if (cont && mode === 'plan') nextTurn();
  hud();
});""","""$('contBtn').addEventListener('click', () => { if (!world || world.over) return; togglePlay(); });   // v5.7.2 재생 · 멈춤 (Space)""",'cont')
# button labels
rep("  $('stepBtn').textContent = ed ? '▶ 전투 시작' : Wd.over ? '▶ 같은 배치로 다시' : mode === 'run' ? '진행 중…' : `▶ 다음 턴 (${Wd.turn + 1})`;\n  $('stepBtn').disabled = mode === 'run';\n  $('contBtn').textContent = cont ? '⏸ 이 턴 끝에서 멈춤' : '▶▶ 계속 진행';",
    "  $('stepBtn').textContent = ed ? '▶ 전투 시작' : Wd.over ? '▶ 같은 배치로 다시' : mode === 'run' && paused ? '▶ 이 턴 끝까지' : mode === 'run' ? '진행 중…' : `▶ 한 턴 (${Wd.turn + 1}) ⏎`;\n  $('stepBtn').disabled = mode === 'run' && !paused;\n  $('contBtn').textContent = mode === 'run' && !paused ? '⏸ 멈춤 (Space)' : '▶▶ 재생 (Space)';",'labels')
# turnInfo
rep("  $('turnInfo').innerHTML = ed ? (S.draft.done ? `배치 중이에요. <b>전투 시작</b>을 누르면 0초에서 멈춘 채로 첫 명령을 받아요.`",
    "  const opN = (S.openers || []).length, opTxt = opN ? ` · 저장된 시작 행동 ${opN}명 <button class=\"btn\" type=\"button\" data-op=\"clear\">시작 행동 지우기</button>` : '';\n  $('turnInfo').innerHTML = ed ? (S.draft.done ? `배치 중이에요. <b>전투 시작</b> (Space) 을 누르면 0초에서 멈춘 채로 열려요 — 그때 준 명령이 이 배치의 시작 행동으로 저장돼요${opTxt}`",'ti1')
rep("    : mode === 'run' ? `턴 ${Wd.turn} 진행 중 · ${f2(Wd.t)} / ${f2(Wd.turnEnd)}초${cont ? ' · 계속 진행 (▶▶ 를 누르면 이 턴 끝에서 멈춤)' : ''} · 지금도 명령할 수 있어요`",
    "    : mode === 'run' && paused ? `<b>⏸ 멈춤</b> · 턴 ${Wd.turn} · ${f2(Wd.t)}초 — 멈춘 채로 명령을 주고 <b>Space</b> 로 재생`\n    : mode === 'run' ? `턴 ${Wd.turn} 진행 중 · ${f2(Wd.t)} / ${f2(Wd.turnEnd)}초${cont ? ' · 재생 중 (Space = 멈춤)' : ' · 이 턴 끝에서 멈춤'} · 지금도 명령할 수 있어요`",'ti2')
rep("빈 바닥 왼쪽 클릭 = 고르기 풀기. 다 정했으면 <b>다음 턴</b> (Space).`;",
    "빈 바닥 왼쪽 클릭 = 고르기 풀기. <b>Space</b> = 재생 · 멈춤 · <b>Enter</b> = 한 턴만.${Wd.turn === 0 && Wd.t < 1e-6 ? ' 지금 주는 명령은 <b>시작 행동</b>으로 저장돼 같은 배치로 다시 할 때도 그대로 걸려요' + opTxt : ''}`;",'ti3')
# overlay paused tag
rep("    : `턴 ${Wd.turn} · ${f2(Wd.t)}초 · 보이는 적 ${seen}","    : `${mode === 'run' && paused ? '⏸ 멈춤 · ' : ''}턴 ${Wd.turn} · ${f2(Wd.t)}초 · 보이는 적 ${seen}",'ovl')
# keys
rep("""  if ((k === ' ' || k === 'enter') && e.target.closest('button')) return;
  if (k === ' ' || k === 'enter'){ e.preventDefault(); if (mode === 'run' && cont){ cont = false; hud(); } else nextTurn(); }""",
"""  if (k === ' '){ e.preventDefault(); if (e.target.closest('button')) e.target.blur(); togglePlay(); return; }   // v5.7.2 Space = 재생 · 멈춤 (단추에 초점이 있어도)
  if (k === 'enter' && e.target.closest('button')) return;
  if (k === 'enter'){ e.preventDefault(); nextTurn(); }   // Enter = 한 턴만""",'keys')
rep("/* ---------- 키보드 ---------- */","/* ---------- 키보드 ---------- */\nwindow.addEventListener('keyup', e => { if (e.key === ' ' && e.target.closest && e.target.closest('button')) e.preventDefault(); }, true);   // v5.7.2 Space 가 단추를 누르지 않게",'keyup')
open(P,'w').write(s); print('ok')
