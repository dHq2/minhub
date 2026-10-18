# v7.8.5 페이지: 횃불 가져오기 단추 · 꾸러미 그림 · 로그 · 이야기 · 내려놓기 로그 이름 · 노트 · 버전
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
# 노트 · 버전
rep("<!-- 굴의 전투판 v7.8.4 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v7.8.5 (2026-10-13) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.8.5: 인주 (횃불을 든 이) 가 쓰러져도 다시 빛을.
             ① 전엔 거의 못 켰음 — 횃불 켬/끔 단추는 '횃불을 든 아군' 이 있어야만 떠서 사라지고, 여분 3개는 살아 있는 주인공에게만 묶여 아무도 못 씀. 떨어진 횃불은 '✋ 줍기' 로만 (이름에 횃불이 안 보임).
               자동 전투 60판 중 60판에서 인주가 횃불을 떨어뜨렸고, 동료가 주운 판은 2판뿐이었음.
             ② 여분 횃불 꾸러미: 처음엔 인주가 지님 (판 · 인물 칸에 🎒 N). 지닌 이가 쓰러지면 든 횃불과 함께 몸 곁에 떨어짐 (판에 🎒 — 동료의 시신이 보일 때).
             ③ 🔥 횃불 가져오기 (든 횃불이 없을 때 횃불 단추 · T): 고른 아군 (없으면 지휘관 · 가까운 동료) 이 가장 가까운 쪽으로 — 떨어진 횃불을 줍거나 · 꾸러미 곁 (지닌 동료 1.4칸 · 쓰러진 몸 0.8칸) 에서 하나 꺼내
               불을 붙임 (1.5초). 쓰러진 몸 곁의 꾸러미는 그대로 챙겨 지님. 가는 사이 동료가 먼저 주우면 그만둠 (여분을 또 꺼내지 않음). 명령은 다른 명령처럼 외침 · 손짓으로 전해짐.
             ④ 여분으로 던지기 (🔥 던지기) · 내려놓기는 꾸러미를 지닌 이만 — 다른 이는 든 횃불을 던짐.
             ⑤ 찐빠: 로그 종류 'torch' 가 '켬 · 끔' 과 '여분 내려놓기' 두 뜻이라, 내려놓으면 로그 · 이야기에 '횃불 끔 — 어둠이 덮친다' 로 거꾸로 나오던 것 (같은 갈래가 두 번 — 뒤쪽은 죽은 코드).
               내려놓기는 'torchPlace' 로 나눔. 같은 switch 안 중복 갈래 검사 (dupcase) 추가 — 페이지 · 엔진 모두 이제 0.
             측정 (자동 전투): /*MEAS785*/
""")
rep('<span class="ver">v7.8.4 · 찐빠 사냥','<span class="ver">v7.8.5 · 인주가 쓰러져도 횃불 (🎒 여분 꾸러미 · 🔥 횃불 가져오기) · 내려놓기 로그 고침 · v7.8.4 · 찐빠 사냥')
rep("<footer>굴의 전투판 v7.8.4 —","<footer>굴의 전투판 v7.8.5 —")
rep("return `굴의 전투판 v7.8.4 · ${title}","return `굴의 전투판 v7.8.5 · ${title}")
rep("copyText('굴의 전투판 v7.8.4 자동 판 기록","copyText('굴의 전투판 v7.8.5 자동 판 기록")
rep('body.mob .top h1::after{content:" v7.8.4";','body.mob .top h1::after{content:" v7.8.5";')
# 로그: 내려놓기 이름 · 새 갈래
rep("      case 'torch': out.push(`${T(e)}▶ 유저 지휘 · ${ga(n(e.a))} 횃","      case 'torchPlace': out.push(`${T(e)}▶ 유저 지휘 · ${ga(n(e.a))} 횃")
rep("    case 'torch': return { s: `${ga(n(e.a))} 횃불을 내려놓는다.","    case 'torchPlace': return { s: `${ga(n(e.a))} 횃불을 내려놓는다.")
rep("      case 'torchPick': out.push(`${T(e)}🔥 ${ga(n(e.a))} 횃불을 주워 듦 (${coord(e.x, e.y)})`); break;",
    "      case 'torchPick': out.push(`${T(e)}🔥 ${ga(n(e.a))} 횃불을 주워 듦 (${coord(e.x, e.y)})`); break;\n      case 'spareDrop': out.push(`${T(e)}🎒 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 지니던 여분 횃불 꾸러미 (${e.n}개) 가 몸 곁에 떨어짐 (${coord(e.x, e.y)})`); break;   // v7.8.5\n      case 'spareTake': out.push(`${T(e)}🎒 ${ga(n(e.a))} 여분 횃불 꾸러미를 챙김 (${e.n}개)`); break;\n      case 'torchLight': out.push(`${T(e)}🔥 ${ga(n(e.a))} ${e.by != null ? n(e.by) + '의 꾸러미에서 ' : ''}여분 횃불을 꺼내 불을 붙이는 중 (남은 여분 ${e.n})`); break;\n      case 'torchGetFail': out.push(`${T(e)}🔥 ${n(e.a)} 횃불 가져오기 그만둠 — ${e.why}`); break;")
rep("    case 'torchPick': return { c: 'good', s: `${ga(n(e.a))} 횃불을 주워 든다.` };",
    "    case 'torchPick': return { c: 'good', s: `${ga(n(e.a))} 횃불을 주워 든다.` };\n    case 'spareDrop': return { c: 'bad', s: `${n(e.a)}의 짐에서 여분 횃불 꾸러미가 굴러떨어진다.` };   // v7.8.5\n    case 'spareTake': return { c: 'good', s: `${ga(n(e.a))} 쓰러진 동료 곁에서 여분 횃불 꾸러미를 챙긴다.` };\n    case 'torchLight': return { c: 'good', s: `${ga(n(e.a))} 새 횃불에 불을 붙인다 — 부싯돌이 튄다.` };\n    case 'torchGetFail': return null;")
# 명령 이름 · 표시
rep("  if (o[0] === 'scout') return `${ro(coord(o[1], o[2]))} 정찰`;   // v7.5","  if (o[0] === 'scout') return `${ro(coord(o[1], o[2]))} 정찰`;   // v7.5\n  if (o[0] === 'torchGet') return '횃불 가져오기';   // v7.8.5")
rep("const ordOf = u => u.order && u.order.k === 'flare' ?","const ordOf = u => u.order && u.order.k === 'torchGet' ? ['torchGet'] : u.order && u.order.k === 'flare' ?")
rep(": o.k === 'scout' ? ['🔭 정찰', '#b9e0a0'] :",": o.k === 'scout' ? ['🔭 정찰', '#b9e0a0'] : o.k === 'torchGet' ? ['🔥 횃불 가져오기', '#ffc860'] :")
# 던지기 안내: 여분은 꾸러미를 지닌 이만
rep("${world.spare > 0 ? '여분 횃불에 불을 옮겨 던짐 (남은 여분 ' + world.spare + ')' : '여분이 없어 든 횃불을 던짐 — 손엔 빛이 없어져요'}",
    "${world.spare > 0 && world.spareBy === ok[0].i ? '여분 횃불에 불을 옮겨 던짐 (남은 여분 ' + world.spare + ')' : (world.spare > 0 ? '여분 꾸러미가 없어 ' : '여분이 없어 ') + '든 횃불을 던짐 — 손엔 빛이 없어져요'}")
# 횃불 단추: 든 이가 없으면 '횃불 가져오기'
rep("""function toggleTorch(){
  const W = world; if (!W || mode === 'edit' || W.over) return; const H = W.units.filter(u => u.alive && u.side === 0 && u.torch); if (!H.length){ toast('횃불을 든 아군이 없어요'); return; }""",
"""// v7.8.5 횃불 가져오기: 든 횃불이 없을 때 — 고른 아군 (없으면 지휘관 · 그다음 떨어진 횃불 · 꾸러미에 가장 가까운 동료) 이 줍거나 꾸러미에서 꺼내 불을 붙임
const torchSrc = W => [...W.torches.filter(t => t.dropped).map(t => ({ x: t.x, y: t.y })), ...(W.spare > 0 ? (W.spareBy != null && W.units[W.spareBy].alive ? [W.units[W.spareBy]] : W.spareAt ? [W.spareAt] : []) : [])];
function torchGet(){
  const W = world, S2 = torchSrc(W); if (!S2.length){ toast('떨어진 횃불도 여분도 없어요'); return; }
  const near = u => Math.min(...S2.map(p => Math.hypot(p.x - u.x, p.y - u.y))), L = selUnits(W).filter(u => !u.crawl && !u.torch), C = cmdBoss(W, 0);
  const u = L.length ? L.slice().sort((a, b) => near(a) - near(b))[0] : C && C.alive && !C.crawl && !C.torch ? C : W.units.filter(x => x.alive && x.side === 0 && !x.crawl && !x.torch).sort((a, b) => near(a) - near(b))[0];
  if (!u){ toast('횃불을 가지러 갈 아군이 없어요'); return; }
  u.order = { k: 'torchGet' }; noteOrders([u]); sel = new Set([u.i]);
  toast(`${u.name} → 🔥 횃불 가져오기 — ${W.torches.some(t => t.dropped) ? '떨어진 횃불을 줍거나 ' : ''}${W.spare > 0 ? '여분 꾸러미에서 꺼내 불을 붙임 (여분 ' + W.spare + ' · 1.5초)' : ''}`); hud(); }
function toggleTorch(){
  const W = world; if (!W || mode === 'edit' || W.over) return; const H = W.units.filter(u => u.alive && u.side === 0 && u.torch); if (!H.length){ torchGet(); return; }   // v7.8.5 든 이가 없으면 가져오기""")
rep("""      + (Wd && Wd.units.some(u => u.alive && u.side === 0 && u.torch) ? `<button type="button" class="db ${Wd.units.some(u => u.alive && u.side === 0 && u.torch && !u.torchOff) ? 'on' : ''}" data-dk="torchT">""",
    """      + (Wd && !Wd.units.some(u => u.alive && u.side === 0 && u.torch) && torchSrc(Wd).length && Wd.units.some(u => u.alive && u.side === 0 && !u.crawl) ? `<button type="button" class="db" data-dk="torchT"><span class="ic">🔥</span><small>횃불 가져오기</small></button>` : '')   // v7.8.5
      + (Wd && Wd.units.some(u => u.alive && u.side === 0 && u.torch) ? `<button type="button" class="db ${Wd.units.some(u => u.alive && u.side === 0 && u.torch && !u.torchOff) ? 'on' : ''}" data-dk="torchT">""")
rep("      + (L.some(u => u.hero) && Wd.spare > 0 ? `<button type=\"button\" class=\"db\" data-dk=\"torch\">","      + (L.some(u => u.i === Wd.spareBy) && Wd.spare > 0 ? `<button type=\"button\" class=\"db\" data-dk=\"torch\">")
# 판: 꾸러미 (쓰러진 몸 곁 — 시신이 보일 때) · 인물 칸 🎒
rep("drawCorpse(Wd, u, ox, oy, ts);   // v7.5 소식 없는 동료의 시신은 찾기 전엔 안 보임",
    "drawCorpse(Wd, u, ox, oy, ts);   // v7.5 소식 없는 동료의 시신은 찾기 전엔 안 보임\n  if (Wd.spareAt && Wd.spare > 0 && mode !== 'edit'){ const cu = Wd.units[Wd.spareAt.by]; if (!(cu && cu.side === 0 && cu.posUnk && !$('seeAll').checked)){ const bx = ox + (Wd.spareAt.x + 0.32) * ts, by = oy + (Wd.spareAt.y + 0.28) * ts, fs = Math.max(11, Math.min(18, ts * 0.42)); ctx.save(); ctx.font = `${fs}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🎒', bx, by); ctx.font = `700 ${Math.max(9, fs * 0.6)}px IBM Plex Mono, monospace`; ctx.fillStyle = '#ffd27a'; ctx.fillText(Wd.spare, bx + fs * 0.62, by + fs * 0.32); ctx.restore(); } }   // v7.8.5 쓰러진 이 곁의 여분 횃불 꾸러미")
rep("${esc(u.name)}${u.torch || (mode === 'edit' && u.hero) ? ' 🔥' : ''}","${esc(u.name)}${u.torch || (mode === 'edit' && u.hero) ? ' 🔥' : ''}${mode !== 'edit' && Wd.spareBy === u.i && Wd.spare > 0 && !hidA(Wd, u) ? ' 🎒' + Wd.spare : ''}")
open(f,'w').write(s); print('ok')
