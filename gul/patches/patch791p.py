# v7.9.1 페이지: 정찰 방침 묻기 (파악만 · 암살 · 생존 우선) · 희생 돌격 (한 번 더 눌러 확정) · 로그 · 이야기
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v7.9.0 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v7.9.1 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.9.1: 지휘 체계 2 — 정찰 방침 · 희생 돌격.
             ① 정찰 명령을 내리면 정찰 대상이 묻는다 (고르기 창): 🔭 적만 파악하고 돌아올까 (기본 — 가서 보고 돌아와 보고) · 🗡 암살을 시도할까 (닿은 곳에서 홀로 있는 모르는 상대를 골라 숨어 등 뒤로) ·
               🛟 자신의 생존을 최우선할까 (7.5칸 밖에서 짧게 보고, 6.5칸 안에서 누가 나를 보거나 가까이 오면 곧 조용히 빠짐 — 들켰는데 혼자고 쫓는 상대가 둘 이상이면 온 힘으로 지휘관 쪽으로 뜀). 마지막으로 고른 방침을 기억함.
             ② 💀 희생 돌격 (한 명만 골라 → 한 번 더 눌러 확정): 지정한 아군이 아는 적 중 가장 값진 쪽 (지휘 · 사수 · 약한 고리 · 가까움) 으로 스스로 돌격해 쓰러질 때까지 싸움. 치료 · 후퇴 없음 — 다른 아군이 그 사이 움직임.
             측정 (자동 전투): /*MEAS791*/
""")
rep('<span class="ver">v7.9.0 · 교전 규칙','<span class="ver">v7.9.1 · 정찰 방침 (파악만 · 암살 · 생존 우선) · 희생 돌격 · v7.9.0 · 교전 규칙')
rep("<footer>굴의 전투판 v7.9.0 —","<footer>굴의 전투판 v7.9.1 —")
rep("return `굴의 전투판 v7.9.0 · ${title}","return `굴의 전투판 v7.9.1 · ${title}")
rep("copyText('굴의 전투판 v7.9.0 자동 판 기록","copyText('굴의 전투판 v7.9.1 자동 판 기록")
rep('body.mob .top h1::after{content:" v7.9.0";','body.mob .top h1::after{content:" v7.9.1";')
# 이름 · 표시
rep("  if (o[0] === 'scout') return `${ro(coord(o[1], o[2]))} 정찰`;   // v7.5","  if (o[0] === 'scout') return `${ro(coord(o[1], o[2]))} 정찰${o[3] === 'kill' ? ' (암살 시도)' : o[3] === 'survive' ? ' (생존 우선)' : ''}`;   // v7.5\n  if (o[0] === 'sac') return '💀 희생 돌격';   // v7.9.1")
rep("const ordOf = u => u.order && u.order.k === 'torchGet' ?","const ordOf = u => u.order && u.order.k === 'sac' ? ['sac'] : u.order && u.order.k === 'torchGet' ?")
rep("u.order && u.order.k === 'scout' ? ['scout', u.order.x, u.order.y] :","u.order && u.order.k === 'scout' ? ['scout', u.order.x, u.order.y, u.order.pol || 'look'] :")
rep(": o.k === 'scout' ? ['🔭 정찰', '#b9e0a0'] :",": o.k === 'sac' ? ['💀 희생 돌격!', '#ff8a7a'] : o.k === 'scout' ? [o.pol === 'kill' ? '🗡 정찰 · 암살' : o.pol === 'survive' ? '🛟 정찰 · 생존' : '🔭 정찰', '#b9e0a0'] :")
# 로그
rep("      case 'scoutFlee': out.push(","""      case 'scoutKill': out.push(`${T(e)}🗡 ${n(e.a)} 정찰 중 홀로 있는 ${n(e.b)}를 봄 — 암살을 시도`); break;   // v7.9.1
      case 'scoutSprint': out.push(`${T(e)}🛟 ${n(e.a)} 홀로 들킴 — 쫓는 상대 ${e.n}명, 온 힘으로 본진으로`); break;
      case 'sac': out.push(`${T(e)}💀 ${n(e.a)} 희생 돌격 — 쓰러질 때까지 적에게`); break;
      case 'scoutFlee': out.push(""")
rep("    case 'healHeld': return {","""    case 'scoutKill': return { c: 'warn', s: `${ga(n(e.a))} 홀로 선 ${reul(n(e.b))} 발견한다 — 정찰을 멈추고 숨어 등 뒤로 돈다.` };   // v7.9.1
    case 'scoutSprint': return { c: 'bad', s: `${ga(n(e.a))} 홀로 들켰다 — 쫓는 이가 ${e.n}. 이를 악물고 본진으로 달린다.` };
    case 'sac': return { c: 'bad', s: `${ga(n(e.a))} 앞으로 나선다. 돌아올 생각이 없다.` };
    case 'healHeld': return {""")
# 정찰: 방침 묻기
rep("""    L2.forEach(x => { x.order = { k: 'scout', x: w.x, y: w.y, hx: (C || x).x, hy: (C || x).y }; }); sel = new Set(L2.map(x => x.i)); noteOrders(L2, 'user', '정찰');
    toast(`${L2.map(x => x.name).join(' · ')} 정찰 — 숨어서 가 보고 돌아옴. 나가 있는 동안 본 것은 돌아와야 알 수 있어요`); return done(); }""",
"""    askScout(L2, w, C); return done(); }""")
rep("// v7.4 명령 전달: 지휘관 (깃발) 이 외치거나","""// v7.9.1 정찰 방침 묻기: 정찰 대상이 묻는다 — 적만 파악하고 돌아올까 · 암살을 시도할까 · 자신의 생존을 최우선할까
const SCOUT_POL = { look: ['🔭', '적만 파악하고 돌아와요', '가서 보고 돌아와 보고 (들키면 도망)'], kill: ['🗡', '암살을 시도할게요', '닿은 곳에서 홀로 있는 모르는 상대를 골라 숨어 등 뒤로'], survive: ['🛟', '제 생존이 최우선이에요', '멀리서 짧게 보고, 누가 보면 곧 조용히 빠짐 · 홀로 들켜 쫓기면 온 힘으로 본진으로'] };
let askSt = null;
function askScout(L2, w, C){
  const box = $('ask'); askSt = { ids: L2.map(x => x.i), x: w.x, y: w.y, hx: (C || L2[0]).x, hy: (C || L2[0]).y };
  const last = S.scoutPol || 'look', names = L2.map(x => x.name).join(' · ');
  box.innerHTML = `<div class="askh"><b>${esc(names)}</b>: ${coord(w.x, w.y)} 쪽 정찰 — 어떻게 할까요?</div>` + ['look', 'kill', 'survive'].map(k => `<button type="button" class="askb ${k === last ? 'last' : ''}" data-pol="${k}"><span class="ic">${SCOUT_POL[k][0]}</span><b>${SCOUT_POL[k][1]}</b><small>${SCOUT_POL[k][2]}${L2.some(x => k === 'kill' && !(x.assnE > 0)) ? ' · 암살 솜씨가 없는 이는 보기만' : ''}</small></button>`).join('') + `<button type="button" class="askb x" data-pol="x">취소</button>`;
  box.hidden = false; hud();
}
function askScoutDone(pol){
  const box = $('ask'); box.hidden = true; const A = askSt; askSt = null; if (!A || pol === 'x' || !world) { hud(); return; }
  const L2 = A.ids.map(i => world.units[i]).filter(x => x && x.alive); if (!L2.length){ hud(); return; }
  S.scoutPol = pol; save();
  L2.forEach(x => { x.order = { k: 'scout', x: A.x, y: A.y, hx: A.hx, hy: A.hy, pol }; }); sel = new Set(L2.map(x => x.i)); noteOrders(L2, 'user', '정찰 · ' + SCOUT_POL[pol][1]);
  toast(`${SCOUT_POL[pol][0]} ${L2.map(x => x.name).join(' · ')} 정찰 — ${SCOUT_POL[pol][2]}. 나가 있는 동안 본 것은 돌아와야 알 수 있어요`); hud();
}
$('ask').addEventListener('click', e => { const b = e.target.closest('[data-pol]'); if (b) askScoutDone(b.dataset.pol); });
// v7.4 명령 전달: 지휘관 (깃발) 이 외치거나""")
# 희생 돌격
rep("function ordKey(k){\n  const L = selUnits(world);\n  if (k === 'boxsel'){","""let sacConf = null;   // v7.9.1 희생 돌격 확정 (3초 안에 한 번 더)
function ordKey(k){
  const L = selUnits(world);
  if (k === 'sac'){ if (L.length !== 1){ toast('💀 희생 돌격은 한 명만 지정해요 (한 명만 고르세요)'); return; } const u0 = L[0]; if (u0.crawl){ toast('기어다니는 몸으로는 돌격할 수 없어요'); return; }
    if (sacConf && sacConf.i === u0.i && performance.now() - sacConf.t < 3000){ sacConf = null; u0.order = { k: 'sac' }; noteOrders([u0], 'user', '희생 돌격'); toast(`💀 ${u0.name} 희생 돌격 — 쓰러질 때까지 적에게. 치료도 후퇴도 없어요`); hud(); return; }
    sacConf = { i: u0.i, t: performance.now() }; toast(`💀 ${u0.name}에게 희생 돌격을 시킬까요? 같은 단추를 3초 안에 한 번 더 누르면 확정이에요`); return; }
  if (k === 'boxsel'){""")
# 데스크톱 단추 · 도크 단추
rep("""<button class="btn ${boxArm ? 'on' : ''}" type="button" data-ord="boxsel" title="한 번 끌어""","""<button class="btn" type="button" data-ord="sac" title="한 명을 지정 — 스스로 적에게 돌격해 쓰러질 때까지 (한 번 더 눌러 확정)">💀 희생 돌격</button><button class="btn ${boxArm ? 'on' : ''}" type="button" data-ord="boxsel" title="한 번 끌어""")
rep("""      + `<button type="button" class="db ${boxArm ? 'on' : ''}" data-dk="boxsel"><span class="ic">🔲</span>동시선택</button>`""","""      + (L.length === 1 && !L[0].crawl ? `<button type="button" class="db ${sacConf && sacConf.i === L[0].i && performance.now() - sacConf.t < 3000 ? 'on' : ''}" data-dk="sac"><span class="ic">💀</span>희생돌격</button>` : '')
      + `<button type="button" class="db ${boxArm ? 'on' : ''}" data-dk="boxsel"><span class="ic">🔲</span>동시선택</button>`""")
rep("  if (k === 'boxsel'){ ordKey('boxsel'); return; }","  if (k === 'boxsel'){ ordKey('boxsel'); return; }\n  if (k === 'sac'){ ordKey('sac'); hud(); return; }")
# 키: 취소 때 정찰 창도 닫음
rep("  if (k === 'escape' && mode !== 'edit'){ if (boxArm){","  if (k === 'escape' && mode !== 'edit'){ if (askSt){ askScoutDone('x'); return; } if (boxArm){")
# 고르기 창 css · html
rep(".row.postures .lbl{",""".ask{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--dockH,0px) + 14px);z-index:70;width:min(94vw,420px);display:flex;flex-direction:column;gap:7px;padding:11px;background:rgba(24,18,38,.97);border:1px solid #6f5fa0;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.6)}
.ask[hidden]{display:none}
.askh{font-size:13px;color:#e8e0f2;padding:0 2px 2px}
.askb{display:grid;grid-template-columns:30px 1fr;align-items:center;column-gap:8px;min-height:46px;padding:7px 10px;text-align:left;border-radius:9px;border:1px solid #4a4068;background:#2b2342;color:#f0e8ff;font:inherit;cursor:pointer}
.askb .ic{grid-row:1 / span 2;font-size:22px;text-align:center}
.askb b{font-size:14px}
.askb small{grid-column:2;color:#b9afcf;font-size:11.5px;line-height:1.3}
.askb.last{border-color:#b9e0a0;box-shadow:0 0 0 1px #b9e0a0 inset}
.askb.x{display:block;text-align:center;min-height:38px;color:#c9bfe0}
.row.postures .lbl{""")
rep('<div class="banner" id="banner" hidden></div>','<div id="ask" class="ask" hidden role="dialog" aria-label="정찰 방침"></div><div class="banner" id="banner" hidden></div>')
open(f,'w').write(s); print('ok')
