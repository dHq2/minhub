# v7.15.1 페이지 — page7151.py v1.2 (v1.2: 적은 물건 아이콘 바로 위만 · 과/와 · v1.1: Esc 줄 가운데 // 주석 → /* */ · 카리우스 체력 700 · 인물과 물건이 겹친 자리는 고르는 창)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.15.0 (2026-10-17)', '<!-- 굴의 전투판 v7.15.1 (2026-10-17)')
rep('     v7.15.0: ', '''     v7.15.1: 카리우스 체력 450 → 700 (설계 · 도감 · 옛 저장 · 내 설계 · 층에도 한 번 — 손으로 바꾼 값은 그대로).
         인물과 떨어진 무기 · 장비가 겹친 자리를 누르면 고르는 창 — 그 인물 (아군 고르기 · 적 공격) 또는 물건마다 줍기 (고른 아군 중 가까운 쪽 · 고른 아군이 없으면 그 자리에 선 아군). 겹치면 물건을 못 줍던 것.
         아군은 몸 아래 물건이면 늘 · 적은 물건 아이콘을 정확히 누를 때만 (싸우는 중 공격이 막히지 않게).
     v7.15.0: ''')
rep('h1::after{content:" v7.15.0"', 'h1::after{content:" v7.15.1"')
rep('<footer>굴의 전투판 v7.15.0', '<footer>굴의 전투판 v7.15.1')
rep('return `굴의 전투판 v7.15.0 · ${title}', 'return `굴의 전투판 v7.15.1 · ${title}')
rep("copyText('굴의 전투판 v7.15.0 자동 판 기록", "copyText('굴의 전투판 v7.15.1 자동 판 기록")
rep('의 버전 기록에 — v7.15.0 회피기동', '의 버전 기록에 — v7.15.1 카리우스 체력 700 · 겹친 물건 고르는 창 / v7.15.0 회피기동')
rep('">v7.15.0 · 회피기동 · 편대 지정 · 지시 점</span>', '">v7.15.1 · 카리우스 체력 700 · 겹친 물건 줍기</span>')

# ---------- 카리우스 체력 700 ----------
rep("ov: { hp: 450, atk: 40, rng: 0.6 }", "ov: { hp: 700, atk: 40, rng: 0.6 }", 2)
rep("// v7.14 은신 등급 (민수가 정한 것)", """// v7.15.1 카리우스 체력 450 → 700 — 저장된 판 · 내 설계 · 층에도 한 번만 (옛 기본값 450 인 것만)
const fixKar7151 = p => { if (!p || p.ref !== 'C-003' || !p.ov || +p.ov.hp !== 450) return false; p.ov.hp = 700; return true; };
if (!S.v7151k){ for (const u of S.units) fixKar7151(u); try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fixKar7151(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}
  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fixKar7151(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {} S.v7151k = true; }
// v7.14 은신 등급 (민수가 정한 것)""")

# ---------- 겹친 자리: 고르는 창 ----------
rep("let askSt = null, pstOpen = false;", "let askSt = null, pstOpen = false, askOv = null;   // v7.15.1 askOv = 인물 · 물건이 겹친 자리의 고르는 창")
rep("$('ask').addEventListener('click', e => { const b = e.target.closest('[data-pol]'); if (b) askScoutDone(b.dataset.pol); });",
    """$('ask').addEventListener('click', e => { const b = e.target.closest('[data-pol]'); if (b) askScoutDone(b.dataset.pol); });
// v7.15.1 인물과 떨어진 물건이 겹친 자리: 그 인물 (아군 고르기 · 적 공격) 또는 물건마다 줍기 — 고른 아군 중 가까운 쪽, 고른 아군이 없으면 그 자리에 선 아군
function askOverlap(u, its, add){
  const W = world, box = $('ask'), L0 = selUnits(W), L = L0.length ? L0 : u.side === 0 ? [u] : [];
  pstOpen = false; askSt = null; askOv = { u: u.i, add: !!add };
  box.innerHTML = `<div class="askh"><b>${esc(u.name)}</b>${jong(u.name) ? '과' : '와'} 떨어진 물건이 겹쳐 있어요 — 무엇을 할까요?</div>`
    + `<button type="button" class="askb" data-ovk="u"><span class="ic">${u.side === 0 ? '👤' : '⚔'}</span><b>${esc(u.name)} ${u.side === 0 ? (sel.has(u.i) ? '고르기 풀기' : '고르기') : '공격'}</b>${u.side === 1 && !L0.length ? '<small>먼저 아군을 고르면 공격 명령</small>' : ''}</button>`
    + its.map(it => { const who = L.filter(x => canTake(W, x, it)); return `<button type="button" class="askb" data-ovk="i" data-ovi="${esc(String(it.id))}" ${who.length ? '' : 'disabled'}><span class="ic">${itemIcon(W, it)}</span><b>${esc(it.name)} 줍기</b><small>${who.length ? esc(who.map(x => x.name).join(' · ')) + (who.length > 1 ? ' 중 가까운 쪽' : '') : '집어 들 수 있는 아군이 없음 — 먼저 주울 아군을 고르세요'}</small></button>`; }).join('')
    + '<button type="button" class="askb" data-ovk="x"><b>취소</b></button>';
  box.hidden = false; hud();
}
function askOverlapDone(k, id){
  const A = askOv; askOv = null; $('ask').hidden = true; if (!A || !world || k === 'x'){ hud(); return; }
  const W = world, u = W.units[A.u];
  if (k === 'u'){ if (u && u.alive){ if (u.side === 0) pickAlly(u.i, A.add); else if (selUnits(W).length) giveAttack(u, A.add || detourArm); } hud(); return; }
  const it = (W.items || []).find(x => String(x.id) === id); if (!it){ toast('그 물건은 이미 없어요'); hud(); return; }
  if (!selUnits(W).length && u && u.alive && u.side === 0) sel = new Set([u.i]);
  givePick(it); hud();
}
$('ask').addEventListener('click', e => { const b = e.target.closest('[data-ovk]'); if (b && !b.disabled) askOverlapDone(b.dataset.ovk, b.dataset.ovi); });""")
rep("  if (u && u.side === 0){ pickAlly(u.i, add); hud(); return; }\n  if (throwPick){",
    """  if (u && !throwPick && !palmPick && !chargePick && !skillPick){ const dC = it => Math.hypot(it.x - w.x, it.y - w.y), its = (world.items || []).filter(it => u.side === 0 ? dC(it) < 0.45 || Math.hypot(it.x - u.x, it.y - u.y) < u.r + 0.15 : dC(it) < 0.25 && dC(it) < Math.hypot(u.x - w.x, u.y - w.y));   // v7.15.1 겹친 물건 → 고르는 창
    if (its.length){ askOverlap(u, its.sort((a, b) => Math.hypot(a.x - w.x, a.y - w.y) - Math.hypot(b.x - w.x, b.y - w.y)).slice(0, 4), add); return; } }
  if (u && u.side === 0){ pickAlly(u.i, add); hud(); return; }
  if (throwPick){""")
rep("  if (k === 'escape' && mode !== 'edit'){ if (pstOpen){ $('ask').hidden = true; pstOpen = false; hud(); return; }",
    "  if (k === 'escape' && mode !== 'edit'){ if (askOv){ askOverlapDone('x'); return; } /* v7.15.1 */ if (pstOpen){ $('ask').hidden = true; pstOpen = false; hud(); return; }")

open(F, 'w', encoding='utf-8').write(s)
print('page7151 OK')
