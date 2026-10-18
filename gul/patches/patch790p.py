# v7.9.0 페이지: 교전 규칙 · 치료 방침 단추 (데스크톱 · 모바일) · 동시 선택 · 시작 행동 확장 (은신 · 횃불 · 태세) · 로그 · 이야기 · 노트 · 버전
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
# 노트 · 버전
rep("<!-- 굴의 전투판 v7.8.5 (2026-10-13) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v7.9.0 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.9.0: 지휘 체계 1 — 교전 규칙 (태세) · 치료는 위급할 때만 · 근접은 활을 안 줍음 · 상시 후각 브리핑 · 동시 선택 · 시작 선택을 다음 판에도.
             ① "명령 없이 돌격하고 사격하는 것이 패착의 90%" → 아군마다 교전 규칙: ⚔ 자유 교전 (보이면 싸움, 옛 방식) · 판단 교전 (기본 — 들켰거나 · 동료가 맞았거나 · 확실히 우세할 때만 먼저 싸움, 열세인데 안 들켰으면 지켜봄)
               · 🕊 교전 금지 (나를 노리는 상대를 막는 것 외엔 쏘지도 쫓지도 않음) · 🔇 사격 금지 (명령이 있을 때까지 쏘지 · 던지지 않음, 근접은 그대로). 고른 아군에게 단추 한 번 — 명령처럼 지휘관을 거쳐 닿음 (못 들을 수 있음).
               열세로 싸움이 열렸으면 제 자리 둘레 4.5칸 안에서만 막음 (쫓아 나가 고립되지 않음). 보류 중엔 적 쪽으로 더듬어 가지 않음. 명령(공격 · 공격 이동 · 돌격 …)은 규칙보다 앞.
             ② 충동 = 무작위가 아니라 점수 — 대담함 + 분노 (동료가 쓰러짐) + 상대의 약점 (등 · 사수 · 넘어짐 · 다침) − 두려움 (상처 · 지침). 넘으면 규칙을 어기고 스스로 덤빔 (교전 금지는 더 높은 점수). 로그에 점수와 까닭이 남음.
             ③ 치료 (노먼): 명령이 없으면 죽기 직전 (체력 22% 아래 · 피 흘리며 35% 아래 · 기절 · 쇼크 · 쓰러진 불사) 만. 나를 노린 치명적 일격이 오는 걸 알아봤으면 시작하지 않고, 붓는 도중이면 끊고 비킴 — 곁의 동료가 아주 위급 (12% 아래 · 쓰러짐) 하면 무릅쓰고 감.
               방침 버튼: 위급할 때만 (기본) · 알아서 (옛 방식, 50% 아래) · 명령만. 약 명령은 언제나 그대로 따름.
             ④ 주무장이 근접 (맨손 포함) 이면 땅의 활 · 총을 줍지 않음 — 카리우스가 활을 주워 쏘던 것. (사격 솜씨가 있거나 사수면 줍음. 명령으로 줍는 건 그대로.)
             ⑤ 후각: 상시 브리핑 2초 간격 (3 → 2) · 범위 A 14 · B 12 · C 8칸 (9 · 7 · 5 에서) — 청광묵 [후각B] 이 척후. 같은 규칙으로 판단 교전의 '힘의 비' 에 브리핑으로 안 적도 셈.
             ⑥ 🔲 동시 선택 (모바일 도크 · 데스크톱 단추): 누른 뒤 한 번 끌어 네모를 그리면 닿는 아군 모두를 고름 → 다음 명령이 모두에게 동시에. (데스크톱은 그냥 끌어도 됨)
             ⑦ 시작 행동 확장: 0초에 정한 은신 · 횃불 켬/끔 · 교전 규칙 · 치료 방침도 다음 판에 그대로 (전엔 명령 · 막기 · 휘두르기만).
             측정 (자동 전투): /*MEAS790*/
""")
rep('<span class="ver">v7.8.5 · 인주가 쓰러져도 횃불','<span class="ver">v7.9.0 · 교전 규칙 (자유 · 판단 · 교전 금지 · 사격 금지) · 치료는 위급할 때만 · 동시 선택 · 상시 후각 브리핑 · v7.8.5 · 인주가 쓰러져도 횃불')
rep("<footer>굴의 전투판 v7.8.5 —","<footer>굴의 전투판 v7.9.0 —")
rep("return `굴의 전투판 v7.8.5 · ${title}","return `굴의 전투판 v7.9.0 · ${title}")
rep("copyText('굴의 전투판 v7.8.5 자동 판 기록","copyText('굴의 전투판 v7.9.0 자동 판 기록")
rep('body.mob .top h1::after{content:" v7.8.5";','body.mob .top h1::after{content:" v7.9.0";')
rep("RULES_MIG = '7.8.1'","RULES_MIG = '7.9.0'")
# 공용 이름
rep("const ga = w => w + (jong(w) ? '이' : '가'),","const ROE_NM = { free: '자유 교전', smart: '판단 교전', hold: '교전 금지', nofire: '사격 금지' }, ROE_IC = { free: '⚔', smart: '⚖', hold: '🕊', nofire: '🔇' }, HEAL_NM = { dying: '위급할 때만', free: '알아서', order: '명령만' };   // v7.9\nconst ga = w => w + (jong(w) ? '이' : '가'),")
# 로그 줄 (전투 로그)
rep("      case 'healHeld': out.push(","""      case 'engOpen': out.push(`${T(e)}⚔ 전선이 열림 — ${e.why}${e.odds != null ? ' · 힘의 비 (우리 ÷ 적) ' + e.odds : ''} · 이제 판단 교전도 싸움`); break;   // v7.9
      case 'roeHold': out.push(`${T(e)}🕊 ${n(e.a)} 교전 보류 — ${e.why === 'nofire' ? '사격 금지 (' + n(e.b) + ' 보임)' : e.why === 'hold' ? '교전 금지 (' + n(e.b) + ' 보임, 나를 노리지 않음)' : n(e.b) + ' 보임 · 아직 안 들켰고 힘의 비 ' + (e.odds != null ? e.odds : '?') + ' — 열세라 먼저 치지 않음'}`); break;
      case 'impulse': out.push(`${T(e)}⚡ ${n(e.a)} 충동 — ${reul(n(e.b))} 스스로 덤빔 (${ROE_NM[e.m] || e.m} 규칙을 어김) 점수 ${e.s} ≥ ${e.thr} = 대담 ${e.bold} · 분노 ${e.anger} · 약점 ${e.vuln} − 두려움 ${e.fear}`); break;
      case 'healDefer': out.push(`${T(e)}✚ ${n(e.a)} 치료를 미룸 — ${n(e.by)}의 일격이 ${e.eta}초 뒤 나를 노림 (${n(e.b)} 체력 ${e.hp}%) — 먼저 몸을 지킴`); break;
      case 'healRisk': out.push(`${T(e)}✚ ${n(e.a)} 위험을 무릅쓰고 ${reul(n(e.b))} 구하러 감 — ${n(e.by)}의 일격이 ${e.eta}초 뒤 나를 노리지만 동료가 죽기 직전 (체력 ${e.hp}%)`); break;
      case 'healAbort': out.push(`${T(e)}✚ ${n(e.a)} 붓던 치료를 끊음 — ${n(e.by)}의 일격이 ${e.eta}초 뒤 나를 노림`); break;
      case 'posture': out.push(`${T(e)}${e.key === 'roe' ? ROE_IC[e.val] : '✚'} ${n(e.a)} ${e.key === 'roe' ? '교전 규칙' : '치료 방침'}: ${(e.key === 'roe' ? ROE_NM : HEAL_NM)[e.prev] || e.prev} → ${(e.key === 'roe' ? ROE_NM : HEAL_NM)[e.val] || e.val}`); break;
      case 'healHeld': out.push(""")
# 이야기
rep("    case 'healHeld': return {","""    case 'engOpen': return { c: 'bad', s: `싸움이 열린다 — ${e.why}.` };   // v7.9
    case 'roeHold': return { c: 'dim', s: e.why === 'nofire' ? `${ga(n(e.a))} 총구를 내린 채 ${reul(n(e.b))} 지켜본다 — 사격 금지.` : e.why === 'hold' ? `${ga(n(e.a))} 손을 쓰지 않고 ${reul(n(e.b))} 지켜본다 — 교전 금지.` : `${ga(n(e.a))} ${reul(n(e.b))} 보지만 숨을 죽인다 — 머릿수가 모자라고 아직 들키지 않았다.` };
    case 'impulse': return { c: 'warn', s: `${ga(n(e.a))} 참지 못하고 ${reul(n(e.b))} 향해 뛰쳐나간다.` };
    case 'healDefer': return { c: 'warn', s: `${ga(n(e.a))} 치료를 미루고 ${n(e.by)}의 일격부터 피한다.` };
    case 'healRisk': return { c: 'warn', s: `${ga(n(e.a))} 일격이 날아올 걸 알면서도 ${reul(n(e.b))} 구하러 달려간다.` };
    case 'healAbort': return { c: 'warn', s: `${ga(n(e.a))} 붓던 약을 거두고 몸을 뺀다.` };
    case 'posture': return { c: 'dim', s: `${ga(n(e.a))} ${(e.key === 'roe' ? ROE_NM : HEAL_NM)[e.val] || e.val} 지시를 받는다.` };
    case 'healHeld': return {""")
# 데스크톱 명령 막대: 태세 줄
rep("""    <p class="note">${L.length === 1 ? esc(canDo(L[0], T))""","""    <div class="row postures" title="교전 규칙 · 치료 방침 — 고른 아군에게 (명령처럼 지휘관을 거쳐 닿음)"><span class="lbl">태세</span>${['free', 'smart', 'hold', 'nofire'].map(m => `<button class="btn ${L.every(u => roeOf(Wd, u) === m) ? 'on' : ''}" type="button" data-ord="roe:${m}" title="${esc({ free: '보이면 싸움 (옛 방식)', smart: '들켰거나 · 동료가 맞았거나 · 확실히 우세할 때만 먼저 싸움', hold: '나를 노리는 상대를 막는 것 외엔 쏘지도 쫓지도 않음', nofire: '명령이 있을 때까지 쏘지 · 던지지 않음 (근접은 그대로)' }[m])}">${ROE_IC[m]} ${ROE_NM[m]}</button>`).join('')}${L.some(u => u.skill) ? ['dying', 'free', 'order'].map(m => `<button class="btn ${L.filter(u => u.skill).every(u => (u.healPol || (Wd.rules.heal || {}).pol || 'dying') === m) ? 'on' : ''}" type="button" data-ord="heal:${m}" title="치료 방침 (약 명령은 언제나 따름)">✚ ${HEAL_NM[m]}</button>`).join('') : ''}<button class="btn ${boxArm ? 'on' : ''}" type="button" data-ord="boxsel" title="한 번 끌어 네모를 그리면 닿는 아군 모두를 고름 — 다음 명령이 모두에게">🔲 동시 선택</button></div>
    <p class="note">${L.length === 1 ? esc(canDo(L[0], T))""")
rep("<div class=\"ohd\">고른 아군 ${L.length}명 · ${L.map(u => `<b>${allyNo(Wd, u)} ${esc(u.name)}</b> <span class=\"cur\">${esc(orderLabel(Wd, ordOf(u)))}</span>`).join(' · ')}</div>",
    "<div class=\"ohd\">고른 아군 ${L.length}명 · ${L.map(u => `<b>${allyNo(Wd, u)} ${esc(u.name)}</b> <span class=\"cur\">${esc(orderLabel(Wd, ordOf(u)))}</span>${roeOf(Wd, u) !== 'smart' ? ` <span class=\"cur\" title=\"교전 규칙\">${ROE_IC[roeOf(Wd, u)]} ${ROE_NM[roeOf(Wd, u)]}</span>` : ''}`).join(' · ')}</div>")
# ordKey: 태세 · 동시 선택
rep("function ordKey(k){\n  const L = selUnits(world);\n  if (!L.length && k !== 'torch'){ toast('먼저 명령할 아군을 고르세요'); return; }",
"""function ordKey(k){
  const L = selUnits(world);
  if (k === 'boxsel'){ boxArm = !boxArm; if (boxArm){ armed = null; amovePick = false; toast('🔲 동시 선택 — 손가락 (마우스) 을 한 번 끌어 네모를 그리세요. 닿는 아군 모두를 고르고, 다음 명령이 모두에게 동시에 가요 (Esc 취소)'); } hud(); return; }   // v7.9
  if (!L.length && k !== 'torch'){ toast('먼저 명령할 아군을 고르세요'); return; }
  if (k.startsWith('roe:') || k.startsWith('heal:')){ postureKey(L, k.startsWith('roe:') ? 'roe' : 'heal', k.slice(k.indexOf(':') + 1)); return; }   // v7.9 교전 규칙 · 치료 방침""")
rep("// v5.7 막기 모드 · 전열 명령\nconst GM_TXT","""// v7.9 교전 규칙 · 치료 방침: 고른 아군에게 (진행 중엔 지휘관을 거쳐 — 못 들을 수 있음, 싸움 전 0초는 바로)
function postureKey(L, key, val){
  const W = world; if (!W) return;
  const C = key === 'heal' ? L.filter(u => u.skill) : L.filter(u => u.alive);
  if (!C.length){ toast('고른 아군 중에 해당하는 이가 없어요'); return; }
  const was = C.map(u => key === 'roe' ? roeOf(W, u) : (u.healPol || (W.rules.heal || {}).pol || 'dying'));
  sendPosture(W, C, key, val, {});
  const pend = C.filter(u => (u.posPend || []).some(q => q.key === key)), now = C.filter(u => !(u.posPend || []).some(q => q.key === key));
  const nm = (key === 'roe' ? ROE_NM : HEAL_NM)[val];
  toast(`${key === 'roe' ? ROE_IC[val] : '✚'} ${C.map(u => u.name).join(' · ')} → ${nm}${pend.length ? ` (${pend.map(u => u.name).join(' · ')}은(는) 지휘관을 거쳐 전해지는 중)` : ''}${key === 'roe' && val === 'smart' ? ' — 들켰거나 · 동료가 맞았거나 · 우세할 때만 먼저 싸워요' : key === 'roe' && val === 'hold' ? ' — 나를 노리는 상대를 막는 것 외엔 안 싸워요' : key === 'roe' && val === 'nofire' ? ' — 명령이 있을 때까지 쏘지 않아요' : ''}`);
  hud();
}
// v5.7 막기 모드 · 전열 명령
const GM_TXT""")
rep("let sel = new Set(), hudT = 0, boxSel = null,","let boxArm = false;   // v7.9 동시 선택: 다음 한 번 끌기가 네모 고르기\nlet sel = new Set(), hudT = 0, boxSel = null,")
# 끌기: boxArm 이면 터치도 네모
rep("box: mode !== 'edit' && e.button === 0 && e.pointerType !== 'touch', shift:","box: mode !== 'edit' && ((e.button === 0 && e.pointerType !== 'touch') || (boxArm && e.button === 0)), boxA: boxArm && mode !== 'edit', shift:")
rep("  if (pd.touch && armedNow()) pd.armed = true;","  if (pd.touch && armedNow() && !boxArm) pd.armed = true;")
rep("  if (pd.touch){ clearTimeout(lpT); lpT = setTimeout(() => { if (pd && !pd.moved && !pinch){","  if (pd.touch && !boxArm){ clearTimeout(lpT); lpT = setTimeout(() => { if (pd && !pd.moved && !pinch){")
rep("    boxSel = null; hud(); if (inBox.length) toast(`아군 ${sel.size}명 고름`); return;","    boxSel = null; if (d.boxA) boxArm = false; hud(); if (inBox.length) toast(`아군 ${sel.size}명 고름${d.boxA ? ' — 이제 명령을 고르세요 (모두에게 동시에)' : ''}`); else if (d.boxA) toast('네모 안에 아군이 없어요'); return;")
rep("  boxSel = null;\n  if (d.moved) return;","  boxSel = null;\n  if (d.boxA && !d.moved){ boxArm = false; toast('동시 선택을 껐어요 (끌어야 네모가 그려져요)'); hud(); return; }\n  if (d.moved) return;")
rep("  if (k === 'escape' && mode !== 'edit'){ if (armed){","  if (k === 'escape' && mode !== 'edit'){ if (boxArm){ boxArm = false; hud(); return; } if (armed){")
rep("const pickTxt = armedTxt() || (amovePick ? '공격 이동: 바닥을 탭' : '');","const pickTxt = armedTxt() || (amovePick ? '공격 이동: 바닥을 탭' : '') || (boxArm ? '🔲 동시 선택: 손가락을 한 번 끌어 네모를 그리세요' : '');")
rep("  if (k === 'pickx'){ skillPick = null;","  if (k === 'pickx'){ boxArm = false; skillPick = null;")
# 도크: 태세 단추
rep("""      + (L.some(u => u.order || u.stay) ? `<button type="button" class="db" data-dk="cancel"><span class="ic">✕</span>취소</button>` : '');""",
"""      + `<button type="button" class="db ${L.every(u => roeOf(Wd, u) === 'hold') ? 'on' : ''}" data-dk="roeH"><span class="ic">🕊</span>교전금지<small>${L.every(u => roeOf(Wd, u) === 'hold') ? '켬' : ''}</small></button>`   // v7.9 한 번 누르면 켬 · 다시 누르면 판단 교전으로
      + `<button type="button" class="db ${L.every(u => roeOf(Wd, u) === 'free') ? 'on' : ''}" data-dk="roeF"><span class="ic">⚔</span>교전허가<small>${L.every(u => roeOf(Wd, u) === 'free') ? '켬' : ''}</small></button>`
      + (L.some(u => isFar(u) || (u.jav && u.spearHeld)) ? `<button type="button" class="db ${L.every(u => roeOf(Wd, u) === 'nofire') ? 'on' : ''}" data-dk="roeN"><span class="ic">🔇</span>사격금지<small>${L.every(u => roeOf(Wd, u) === 'nofire') ? '켬' : ''}</small></button>` : '')
      + (L.some(u => u.skill) ? `<button type="button" class="db" data-dk="healP"><span class="ic">✚</span>치료<small>${HEAL_NM[(L.find(u => u.skill).healPol || (Wd.rules.heal || {}).pol || 'dying')]}</small></button>` : '')
      + `<button type="button" class="db ${boxArm ? 'on' : ''}" data-dk="boxsel"><span class="ic">🔲</span>동시선택</button>`
      + (L.some(u => u.order || u.stay) ? `<button type="button" class="db" data-dk="cancel"><span class="ic">✕</span>취소</button>` : '');""")
rep("  if (['amove', 'hold', 'auto', 'line',","""  if (k === 'roeH' || k === 'roeF' || k === 'roeN'){ const L2 = selUnits(world), m = { roeH: 'hold', roeF: 'free', roeN: 'nofire' }[k]; ordKey('roe:' + (L2.length && L2.every(u => roeOf(world, u) === m) ? 'smart' : m)); return; }   // v7.9
  if (k === 'healP'){ const L2 = selUnits(world).filter(u => u.skill), cur = L2.length ? (L2[0].healPol || (world.rules.heal || {}).pol || 'dying') : 'dying'; ordKey('heal:' + { dying: 'order', order: 'free', free: 'dying' }[cur]); return; }
  if (k === 'boxsel'){ ordKey('boxsel'); return; }
  if (['amove', 'hold', 'auto', 'line',""")
# 도크 칩에 태세 아이콘
rep("const stlChip = (Wd, u) => {","const roeChip = (Wd, u) => { const m = roeOf(Wd, u); return m === 'smart' || hidA(Wd, u) || !u.alive ? '' : `<i class=\"stb roe\" title=\"${ROE_NM[m]}\">${ROE_IC[m]}</i>`; };   // v7.9\nconst stlChip = (Wd, u) => {")
rep("${ed ? '' : stlChip(Wd, u)}<span class=\"dn\">","${ed ? '' : stlChip(Wd, u)}${ed ? '' : roeChip(Wd, u)}<span class=\"dn\">")
rep(".dchip .stb.off{",".row.postures .lbl{align-self:center;font-size:11px;color:var(--dim);margin-right:4px}\n.dchip .stb.roe{left:auto;right:2px;top:14px;background:rgba(40,30,62,.95);box-shadow:0 0 0 1.5px #8a7f9e}\n.dchip .stb.off{")
# 상세정보: 교전 규칙 · 치료
rep("    ${u.smellG && known ? `<span class=\"tr\"><span class=\"lb\">후각</span>","""    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) ? `<span class="tr"><span class="lb">교전 규칙</span> ${ROE_IC[roeOf(Wd, u)]} ${ROE_NM[roeOf(Wd, u)]}${u.skill ? ' · 치료 ' + HEAL_NM[u.healPol || (Wd.rules.heal || {}).pol || 'dying'] : ''}${(u.posPend || []).length ? ' · 지시가 가는 중' : ''}</span>` : ''}
    ${u.smellG && known ? `<span class="tr"><span class="lb">후각</span>""")
# 시작 행동 확장
rep("    return { pid: u.pid, o, gm: u.guardMode && u.guardMode !== 'auto' ? u.guardMode : null, sw: u.swing || null };\n  }).filter(x => x.o || x.gm || x.sw);",
    "    return { pid: u.pid, o, gm: u.guardMode && u.guardMode !== 'auto' ? u.guardMode : null, sw: u.swing || null, st: u.stealth ? 1 : null, tf: u.torch && u.torchOff ? 1 : null, ro: u.roe && u.roe !== 'smart' ? u.roe : null, hp: u.healPol && u.healPol !== 'dying' ? u.healPol : null };   // v7.9 은신 · 횃불 꺼 둠 · 교전 규칙 · 치료 방침도\n  }).filter(x => x.o || x.gm || x.sw || x.st || x.tf || x.ro || x.hp);")
rep("    if (op.sw && u.canSweep){ u.swing = op.sw; did = true; }\n","    if (op.sw && u.canSweep){ u.swing = op.sw; did = true; }\n    if (op.st && (u.stealthE || 0) >= ((Wd.rules.stealth || {}).min || 0)){ u.stealth = true; did = true; }   // v7.9\n    if (op.tf && u.torch){ u.torchOff = true; computeLight(Wd); did = true; }\n    if (op.ro && ['free', 'hold', 'nofire'].includes(op.ro)){ u.roe = op.ro; did = true; }\n    if (op.hp && u.skill && ['free', 'order'].includes(op.hp)){ u.healPol = op.hp; did = true; }\n")
rep("if (nOp) toast(`시작 행동 ${nOp}명을 다시 걸었어요 (지난번 0초 명령 그대로)","if (nOp) toast(`시작 행동 ${nOp}명을 다시 걸었어요 (지난번 0초 명령 · 은신 · 횃불 · 태세 그대로)")
open(f,'w').write(s); print('ok')
