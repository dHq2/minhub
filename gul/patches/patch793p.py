# v7.9.3 페이지: 태세 창 (모바일 도크 단추 정리) · 상세정보 '최근 판단' · 부지휘 표시 · 복기에 아군의 자율 판단 · 로그 (밀어붙이지 않음 · 헛침 까닭) · 노트 · 버전
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v7.9.2 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v7.9.3 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.9.3: 로그 4건 추적 수리 · 자율 판단 설명 · 태세 창.
             ① 청광묵 (경량) 이 명령 없이 방패기사 정면으로 뛰어듦 (4.4~6초) — 원인: '5초 동안 아무도 안 치면 들어감 (stale)' · '대담하면 뛰어듦' · '3초 기다리면 들어감' 이 방패 정면에도 그대로 적용됐고, 막고 선 상대를 '밀어붙임' 도 대담함만 따짐.
               고침: 가벼운 몸 (무게가 상대의 45% 아래 · 괴력 · 돌진 · 거구 없음) 은 막고 선 방패 정면을 스스로 들이받지 않고 옆으로 돌아 틈을 기다림 (상대의 동작 · 옆 · 뒤 · 자세 무너짐 (45 이하) · 7초 넘는 대치 · 체력 25% 아래면 예외). 어떤 길 (접근 · 도약 · 밀어붙임) 로 와도 공격을 시작하는 순간 다시 따짐. 아군 · 적 같은 규칙.
             ② 노먼 점사가 레베카를 연달아 맞힘 (11 → 19) — 점사 도중 사선 재평가는 있었지만 '방금 맞힌 사실' 은 안 따졌음. 고침: 아군을 맞히면 남은 발을 바로 접고, 2초 동안은 오사 확률 4% 넘으면 쏘지 않음 (평소 2~8%).
             ③ 카리우스 재집결: 본대 거리를 '옛 이동 명령 자리 (stay)' 로 재서, 곁에 동료가 있어도 12칸 떨어졌다고 돌아섬. 고침: 본대 = 가장 가까운 동료 · 주인공 · 지키는 자리 중 가까운 쪽. 로그에 대상 · 거리.
             ④ 인주의 '어둠 속에서 헛침 (25%)': 야시 없는 이가 불 꺼진 칸의 상대를 칠 때의 값 — 횃불을 든 인주가 근접 상대를 못 보는 건 불합리한 장면이라, 몸이 닿는 거리 (0.45칸) 면 어둠에서도 60% 이상, 로그에 까닭 (야시 · 횃불 · 상대 칸이 밝은지 · 거리) 을 남김.
             ⑤ 설명: 상세정보에 '최근 판단' (충동 · 교전 보류 · 치료 미룸 · 재집결 · 방패 앞 대기, 20초) · 부지휘 표시 🏳 · 판이 끝난 뒤 복기에 '아군의 자율 판단' (충동 뒤 몇 초 안에 쓰러졌나 포함).
             ⑥ 태세 창: 모바일 도크의 교전허가 · 사격금지 · 치료 단추를 '태세' 한 단추로 모음 (누르면 큰 단추 창 — 교전 규칙 4 · 치료 방침 3). 교전금지는 바로 누름 단추로 그대로.
             ⑦ 치료 미룸 · 붓다 끊기는 적 · 아군 같은 규칙으로. (적 치유사가 있으면 같이 따짐)
             측정 (자동 전투): /*MEAS793*/
""")
rep('<span class="ver">v7.9.2 · 전달망','<span class="ver">v7.9.3 · 방패 정면 · 점사 오사 · 재집결 · 자율 판단 설명 · 태세 창 · v7.9.2 · 전달망')
rep("<footer>굴의 전투판 v7.9.2 —","<footer>굴의 전투판 v7.9.3 —")
rep("return `굴의 전투판 v7.9.2 · ${title}","return `굴의 전투판 v7.9.3 · ${title}")
rep("copyText('굴의 전투판 v7.9.2 자동 판 기록","copyText('굴의 전투판 v7.9.3 자동 판 기록")
rep('body.mob .top h1::after{content:" v7.9.2";','body.mob .top h1::after{content:" v7.9.3";')
# 로그
rep("      case 'regroup': out.push(","      case 'pushNo': out.push(`${T(e)}🛡 ${n(e.a)} ${n(e.b)}의 방패 정면 — 가벼운 몸이라 들이받지 않고 옆 · 틈을 기다림`); break;   // v7.9.3\n      case 'regroup': out.push(")
rep("    case 'regroup': return","    case 'pushNo': return { c: 'dim', s: `${ga(n(e.a))} ${n(e.b)}의 방패를 정면으로 마주하지 않고 돌아선다.` };\n    case 'regroup': return")
rep("      case 'miss': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 빗나감: ${e.why}`); break;","      case 'miss': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 빗나감: ${e.why}${e.dark ? ` [${e.nv ? '야시 있음' : '야시 없음'} · ${e.torch ? '횃불 켬' : '횃불 없음/꺼짐'} · 상대 칸 ${e.lit ? '밝음' : '어두움'} · ${e.d}칸]` : ''}`); break;")
# 상세: 최근 판단 · 부지휘
rep("    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) && u.mission ?","    ${!ed && u.alive && (u.side === 0 || see) && u.lastDec && Wd.t - u.lastDec.t < 20 ? `<span class=\"tr\" style=\"color:#d8c8ff\"><span class=\"lb\">최근 판단</span> ${esc(u.lastDec.s)} · ${Math.round(Wd.t - u.lastDec.t)}초 전</span>` : ''}\n    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) && u.mission ?")
rep("  if (u === C) return `<span class=\"lk c\"","  if (u !== C && u.cmd > 0 && u.alive) return `<span class=\"lk c\" title=\"부지휘관 (지휘 점수 ${u.cmd}) — 지휘관의 말이 안 닿는 이에게 전하고, 지휘관이 쓰러지면 이어받음\">🏳 부지휘</span>` + (u.ordPend ? `<span class=\"lk q\">⏳ ${f2(Math.max(0, u.ordPend.at - Wd.t))}초</span>` : '');\n  if (u === C) return `<span class=\"lk c\"")
# 복기: 아군의 자율 판단
rep("  if (tp.length){ o.push('흐름 (갈림길)');","""  { const AU = G.filter(e => ['impulse', 'regroup', 'healDefer', 'healRisk', 'healAbort', 'pushNo'].includes(e.k) && U(e.a) && U(e.a).side === 0), HO = G.filter(e => e.k === 'roeHold' && U(e.a) && U(e.a).side === 0);   // v7.9.3 아군의 자율 판단
    if (AU.length || HO.length){ o.push('아군의 자율 판단 (명령 없이 스스로 한 일)');
      for (const e of AU.slice(0, 24)){ const dead = e.k === 'impulse' ? G.find(x => x.k === 'die' && x.b === e.a && x.t >= e.t && x.t - e.t <= 12) : null;
        o.push(`  ${padW(at(e), 8)} ${{ impulse: `⚡ ${n(e.a)} 충동 — ${n(e.b)}에게 (점수 ${e.s}: 대담 ${e.bold} · 분노 ${e.anger} · 약점 ${e.vuln} − 두려움 ${e.fear})`, regroup: `↩ ${n(e.a)} ${n(e.b)} 추격을 그만두고 재집결 (본대 ${e.d}칸)`, healDefer: `✚ ${n(e.a)} 치료를 미룸 — ${n(e.by)}의 일격 ${e.eta}초 뒤`, healRisk: `✚ ${n(e.a)} 무릅쓰고 ${n(e.b)}에게 감 (체력 ${e.hp}%)`, healAbort: `✚ ${n(e.a)} 붓던 치료를 끊음`, pushNo: `🛡 ${n(e.a)} ${n(e.b)}의 방패 정면을 피함` }[e.k]}${dead ? ` → ${f2(dead.t - e.t)}초 뒤 쓰러짐 (${n(dead.a)})` : ''}`); }
      if (AU.length > 24) o.push(`  … ${AU.length - 24}줄 더`);
      if (HO.length){ const m = {}; for (const e of HO){ const k = n(e.a) + ' ' + (e.why === 'nofire' ? '사격 금지' : e.why === 'hold' ? '교전 금지' : '열세 · 안 들킴'); m[k] = (m[k] || 0) + 1; } o.push('  교전을 보류한 횟수: ' + Object.entries(m).map(([k, v]) => k + ' ' + v).join(' · ')); } } }
  if (tp.length){ o.push('흐름 (갈림길)');""")
# 태세 창
rep("""      + `<button type="button" class="db ${L.every(u => roeOf(Wd, u) === 'free') ? 'on' : ''}" data-dk="roeF"><span class="ic">⚔</span>교전허가<small>${L.every(u => roeOf(Wd, u) === 'free') ? '켬' : ''}</small></button>`
      + (L.some(u => isFar(u) || (u.jav && u.spearHeld)) ? `<button type="button" class="db ${L.every(u => roeOf(Wd, u) === 'nofire') ? 'on' : ''}" data-dk="roeN"><span class="ic">🔇</span>사격금지<small>${L.every(u => roeOf(Wd, u) === 'nofire') ? '켬' : ''}</small></button>` : '')
      + (L.some(u => u.skill) ? `<button type="button" class="db" data-dk="healP"><span class="ic">✚</span>치료<small>${HEAL_NM[(L.find(u => u.skill).healPol || (Wd.rules.heal || {}).pol || 'dying')]}</small></button>` : '')""",
"""      + `<button type="button" class="db ${pstOpen ? 'on' : ''}" data-dk="posture"><span class="ic">${L.every(u => roeOf(Wd, u) === roeOf(Wd, L[0])) ? ROE_IC[roeOf(Wd, L[0])] : '⚖'}</span>태세<small>${L.every(u => roeOf(Wd, u) === roeOf(Wd, L[0])) ? ROE_NM[roeOf(Wd, L[0])] : '섞임'}</small></button>`   // v7.9.3 교전허가 · 사격금지 · 치료 방침은 태세 창에""")
rep("let askSt = null;","""let askSt = null, pstOpen = false;
// v7.9.3 태세 창: 고른 아군의 교전 규칙 4 · (약을 가진 이가 있으면) 치료 방침 3 — 큰 단추
const ROE_DESC = { free: '보이면 싸움 (옛 방식)', smart: '들켰거나 · 동료가 맞았거나 · 우세할 때만 먼저 싸움', hold: '나를 노리는 상대를 막는 것 외엔 쏘지도 쫓지도 않음', nofire: '명령이 있을 때까지 쏘지 · 던지지 않음 (근접은 그대로)' };
function openPosture(){
  const Wd = world, L = Wd ? selUnits(Wd) : [], box = $('ask'); if (!L.length){ toast('먼저 아군을 고르세요'); return; }
  askSt = null; pstOpen = true; const has = u => m => roeOf(Wd, u) === m, med = L.filter(u => u.skill);
  box.innerHTML = `<div class="askh"><b>${esc(L.map(u => u.name).join(' · '))}</b>: 태세 — 명령처럼 지휘관을 거쳐 닿아요</div>` + ['smart', 'hold', 'free', 'nofire'].map(m => `<button type="button" class="askb ${L.every(u => has(u)(m)) ? 'last' : ''}" data-pst="roe:${m}"><span class="ic">${ROE_IC[m]}</span><b>${ROE_NM[m]}</b><small>${ROE_DESC[m]}</small></button>`).join('')
    + (med.length ? `<div class="askh">✚ 치료 방침 (${esc(med.map(u => u.name).join(' · '))}) — 약 명령은 언제나 따름</div><div class="askrow">` + ['dying', 'free', 'order'].map(m => `<button type="button" class="askb ${med.every(u => (u.healPol || (Wd.rules.heal || {}).pol || 'dying') === m) ? 'last' : ''}" data-pst="heal:${m}"><b>${HEAL_NM[m]}</b></button>`).join('') + '</div>' : '') + `<button type="button" class="askb x" data-pst="x">닫기</button>`;
  box.hidden = false; hud();
}
$('ask').addEventListener('click', e => { const b = e.target.closest('[data-pst]'); if (!b) return; const v = b.dataset.pst; $('ask').hidden = true; pstOpen = false; if (v !== 'x') ordKey(v); else hud(); });""")
rep("  if (k === 'roeH' || k === 'roeF' || k === 'roeN'){","  if (k === 'posture'){ if (pstOpen){ $('ask').hidden = true; pstOpen = false; hud(); } else openPosture(); return; }   // v7.9.3\n  if (k === 'roeH' || k === 'roeF' || k === 'roeN'){")
rep("  if (k === 'escape' && mode !== 'edit'){ if (askSt){","  if (k === 'escape' && mode !== 'edit'){ if (pstOpen){ $('ask').hidden = true; pstOpen = false; hud(); return; } if (askSt){")
rep(".askb.x{",".askrow{display:flex;gap:6px}.askrow .askb{flex:1;grid-template-columns:1fr;text-align:center;min-height:40px}\n.askb.x{")
open(f,'w').write(s); print('ok')
