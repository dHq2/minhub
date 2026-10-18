import sys
p='page10.tpl.html'; s=open(p,encoding='utf-8').read()
s=s.replace('굴의 전투판 v5.4.3', '굴의 전투판 v5.5')
pairs=[
("""     v5.4.3: 명령을 받으면 길을 찾아 끝까지""", """     v5.5: 부위 파괴 · 절단 — 머리 · 팔에 치명 (또는 아주 크게) 맞으면 눈 · 팔을 잃음 (근접 날붙이 = 절단 · 피를 흘림, 그 밖 = 파괴). 다리 = 기어다님.
           실명 · 방패를 놓침 · 다른 손 · 활을 못 당김 · 한 손 사격 · 발길질. 초상화 옆 아이콘 (👁 · 🦴 · ✂ · 🩸) · 서술. 응급처치 · 약이 지혈.
           아군 시야 연동 (브리핑): 본 상대를 동료에게 불러 줌 — 못 보는 동료도 그쪽으로 움직임. 셋이 서로 눈치만 보며 멈추던 것 고침.
     v5.4.3: 명령을 받으면 길을 찾아 끝까지"""),
("""<span class="ver">v5.4.3 · 기술 칸 · 진형 · 대치""", """<span class="ver">v5.5 · 부위 파괴 · 절단 · 기술 칸 · 진형 · 대치"""),
# 초상화 옆 부위 아이콘
("""    // 바라보는 방향: 테두리 밖 작은 삼각형. 방패면 앞쪽 테두리에 은색 호
    const fa = u.face || 0;""", """    // v5.5 부위: 실명은 얼굴에 검은 띠, 오른쪽 위부터 아래로 👁 (눈을 잃음, 붉은 사선) · 🦴 (팔 파괴) · ✂ (팔 절단) · 🩸 (피를 흘림, 깜빡임)
    if (!ed && vis && u.arms && (u.eyeLost || u.arms.L || u.arms.R || u.bleed)){
      if (u.blind){ ctx.save(); shapePath(ctx, shp, px, py, r, sa); ctx.clip(); ctx.fillStyle = 'rgba(8,6,10,.85)'; ctx.fillRect(px - r, py - r * 0.42, r * 2, r * 0.38); ctx.restore(); }
      const ic = []; if (u.eyeLost) ic.push(['👁', true]); for (const k of ['L', 'R']) if (u.arms[k]) ic.push([u.arms[k] === '절단' ? '✂' : '🦴', false]); if (u.bleed) ic.push(['🩸', false, true]);
      const fs = Math.max(9, Math.min(14, r * 0.62)); ctx.font = `${fs}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ic.forEach(([s2, slash, blink], k) => { const x = px + r * 0.98, y = py - r * 0.72 + k * (fs + 2); ctx.globalAlpha = blink ? 0.55 + 0.45 * Math.sin(now * 7) : 1;
        ctx.fillStyle = 'rgba(24,10,12,.88)'; ctx.beginPath(); ctx.arc(x, y, fs * 0.66, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText(s2, x, y + 0.5);
        if (slash){ ctx.strokeStyle = '#ff5a4a'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x - fs * 0.45, y + fs * 0.45); ctx.lineTo(x + fs * 0.45, y - fs * 0.45); ctx.stroke(); }
        ctx.globalAlpha = 1; });
    }
    // 바라보는 방향: 테두리 밖 작은 삼각형. 방패면 앞쪽 테두리에 은색 호
    const fa = u.face || 0;"""),
# 자세한 기록
("""      case 'cripple': out.push(`${T(e)}✚ ${n(e.b)} 다리 ${e.how} — 기어다님 (못 일어남 · 근접 못 함 · ${n(e.a)}의 치명타)`); break;""",
 """      case 'cripple': out.push(`${T(e)}✚ ${n(e.b)} 다리 ${e.how} — 기어다님 (못 일어남 · 근접 못 함${e.bleed ? ' · 피를 흘림' : ''} · ${n(e.a)})`); break;
      case 'maim': out.push(`${T(e)}✚ ${n(e.b)} ${e.part === '눈' ? (e.blind ? `실명 (눈 ${e.of}개를 다 잃음)` : `눈 파괴 (남은 눈 ${e.left}/${e.of})`) : e.lr + '팔 ' + e.how} — ${(e.eff || []).join(' · ')} (${n(e.a)})`); break;   // v5.5
      case 'bleedStop': out.push(`${T(e)}${n(e.a)} 피가 멎음`); break;"""),
("""      case 'skill': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.name} +${e.amt} (${n(e.b)} ${e.hp}/${Wd.units[e.b].max}) · 남은 약 ${e.left}${e.auto ? ' · 위급해서 스스로' : ' · 명령'}`); break;""",
 """      case 'skill': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.name} +${e.amt} (${n(e.b)} ${e.hp}/${Wd.units[e.b].max}) · 남은 약 ${e.left}${e.stanch ? ' · 지혈' : ''}${e.auto ? ' · 위급해서 스스로' : ' · 명령'}`); break;"""),
("""      case 'heal': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 치유 +${e.amt} (${e.hp}/${Wd.units[e.b].max})`); break;""",
 """      case 'heal': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 치유 +${e.amt} (${e.hp}/${Wd.units[e.b].max})${e.stanch ? ' · 지혈' : ''}`); break;"""),
# 이야기
("""    case 'skill': if (e.kit) return { c: 'good', s: `${ga(n(e.a))} 구급상자로 ${e.revive ? `쓰러진 ${reul(n(e.b))} 일으킨다` : e.a === e.b ? '자기 상처를 싸맨다' : n(e.b) + '의 상처를 싸맨다'} (+${e.amt}, 남은 구급상자 ${e.left}).` };""",
 """    case 'skill': if (e.kit) return { c: 'good', s: `${ga(n(e.a))} 구급상자로 ${e.revive ? `쓰러진 ${reul(n(e.b))} 일으킨다` : e.a === e.b ? '자기 상처를 싸맨다' : n(e.b) + '의 상처를 싸맨다'} (+${e.amt}, 남은 구급상자 ${e.left}).${e.stanch ? ' 쏟아지던 피가 멎는다.' : ''}` };
      if (e.stanch) return { c: 'good', s: `${ga(n(e.a))} 양동이의 약을 ${e.a === e.b ? '자기 상처에' : n(e.b) + '의 상처에'} 끼얹는다 — 피가 멎는다 (+${e.amt}, 남은 약 ${e.left}).` };"""),
("""    case 'heal': return { c: 'good', s: `${ga(n(e.a))} ${n(e.b)}의 상처를 돌본다 (+${e.amt}).` };""",
 """    case 'heal': return { c: 'good', s: `${ga(n(e.a))} ${n(e.b)}의 상처를 돌본다 (+${e.amt}).${e.stanch ? ' 피가 멎는다.' : ''}` };"""),
("""    case 'cripple': return { c: U(e.b).side ? 'good' : 'bad', s: `${n(e.a)}의 치명타 — ${n(e.b)}의 다리가 ${e.how === '절단' ? '잘려 나간다' : '부서진다'}! ${ga(n(e.b))} 바닥을 긴다.` };""",
 """    case 'cripple': return { c: U(e.b).side ? 'good' : 'bad', s: `${n(e.a)}의 일격 — ${n(e.b)}의 다리가 ${e.how === '절단' ? '잘려 나간다! 피가 쏟아진다' : '부서진다'}! ${ga(n(e.b))} 바닥을 긴다.` };
    case 'maim': { const b = U(e.b), c = b.side ? 'good' : 'bad';   // v5.5 부위 파괴 · 절단
      if (e.part === '눈') return { c, s: e.blind ? `${n(e.a)}의 일격 — ${n(b.i)}의 ${e.of > 2 ? '마지막 눈' : '남은 눈'}마저 터진다! ${ga(n(b.i))} 이제 아무것도 보지 못한다.` : `${n(e.a)}의 일격 — ${n(b.i)}의 ${e.of > 2 ? '머리 하나에서 ' : ''}눈이 터진다! (남은 눈 ${e.left}/${e.of})` };
      const EF = { '방패를 놓침': `${ga(n(b.i))} 방패를 놓친다.`, '활을 못 당김': '더는 활을 당길 수 없다.', '한 손으로 쏨': '한 손으로 총을 겨눈다.', '다른 손으로': '무기를 다른 손으로 옮겨 쥔다.', '두 손으로 못 쥠': '무기를 두 손으로 쥘 수 없다.', '두 팔을 다 잃음': '이제 두 팔이 모두 없다 — 남은 건 발길질뿐.' };
      const tail = (e.eff || []).map(x => { const k = Object.keys(EF).find(k => x.startsWith(k)); return k ? EF[k] : ''; }).filter(Boolean).join(' ');
      return { c, s: `${n(e.a)}의 ${e.how === '절단' ? '칼날에' : '일격에'} ${n(b.i)}의 ${e.lr}팔이 ${e.how === '절단' ? '잘려 나간다! 피가 쏟아진다' : '부러진다'}!${tail ? ' ' + tail : ''}` }; }
    case 'bleedStop': return { c: 'dim', s: `${n(e.a)}의 피가 겨우 멎는다.` };"""),
("""      if (e.tag === '부딪힘') return { c: 'dim', s: `${ga(b.name)} 부딪혀 다친다 (−${e.dmg}).` };""",
 """      if (e.tag === '부딪힘') return { c: 'dim', s: `${ga(b.name)} 부딪혀 다친다 (−${e.dmg}).` };
      if (e.tag === '출혈') return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(b.name)} 피를 너무 많이 흘렸다.` };   // v5.5"""),
# 인물 카드
("""${!ed && u.down && Wd.t - (u.pinnedT == null ? -9 : u.pinnedT) < 2.5 ? '눌림 (확인사살 중) · ' : ''}""", """${!ed && u.down && Wd.t - (u.pinnedT == null ? -9 : u.pinnedT) < 2.5 ? '눌림 (확인사살 중) · ' : ''}${!ed && u.alive && u.blind ? '실명 · ' : ''}${!ed && u.alive && u.bleed ? '피를 흘림 · ' : ''}"""),
# 설명 칸
("""    <span class="tr"><span class="lb">무기</span> ${esc(u.jav && !u.spearHeld ?""", """    <span class="tr"><span class="lb">무기</span> ${esc(u.noArms ? '발길질 (두 팔을 잃음)' : u.jav && !u.spearHeld ?"""),
("""u.weaponNow ? u.weaponNow + ' (' + u.weapon + ' 탄약이 떨어짐)' :""", """u.weaponNow ? u.weaponNow + ' (' + u.weapon + (u.arms && (u.arms.L || u.arms.R) && (Wd.rules.weapons[u.weapon] || {}).kind === '활' ? ' — 팔을 잃어 못 당김)' : ' 탄약이 떨어짐)') :"""),
("""    ${!ed && u.alive && Wd.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < 1.5 && backToWall(Wd, u, f)) ?""", """    ${!ed && u.alive && u.arms && (u.eyeLost || u.arms.L || u.arms.R || u.bleed) ? `<span class="tr" style="color:#ff9a86"><span class="lb">부위</span> ${maimTxt(Wd, u)}</span>` : ''}
    ${!ed && u.alive && Wd.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < 1.5 && backToWall(Wd, u, f)) ?"""),
("""const SWING_NM = { '': '자동', '휘두르기': '넓게', '찍기': '찍기' };""", """const SWING_NM = { '': '자동', '휘두르기': '넓게', '찍기': '찍기' };
// v5.5 부위 설명 (인물 설명 칸)
function maimTxt(Wd, u){
  const M = Wd.rules.maim || {}, a = [];
  if (u.blind) a.push(`👁 실명 — 눈 ${u.eyes}개를 다 잃음 (몸에 닿는 것만 앎 · 동료가 불러 주는 자리로 더듬어 감 · 휘두르면 ${Math.round((M.blindMiss != null ? M.blindMiss : 0.35) * 100)}% 헛침)`);
  else if (u.eyeLost) a.push(`👁 눈 ${u.eyeLost}/${u.eyes} 잃음 (보는 거리 ×${(u.sightMul || 1).toFixed(2)} · 조준 ×${(u.eyeAim || 1).toFixed(2)})`);
  for (const k of ['L', 'R']) if (u.arms[k]) a.push(`${u.arms[k] === '절단' ? '✂' : '🦴'} ${k === 'L' ? '왼' : '오른'}팔 ${u.arms[k]}`);
  if (u.noArms) a.push('두 팔 없음 — 발길질뿐 (못 막음 · 못 쏨 · 못 던짐 · 약을 못 씀)');
  else { if (u.shieldLost) a.push('방패를 놓침'); if (u.armAim != null && u.armAim < 1) a.push(`한 손 (조준 ×${u.armAim})`); }
  if (u.atkMul < 1) a.push(`공격 ×${u.atkMul.toFixed(2)}`);
  if (u.bleed) a.push(`🩸 피를 흘림 (초당 ${u.bleed.dps.toFixed(1)} · ${f2(u.bleed.until - Wd.t)}초 — 응급처치 · 약으로 지혈)`);
  return a.join(' · ');
}"""),
# 수치표
("""['pierce.str', '투구째 꿰뚫음: 괴력 배율 이 이상'], ['pierce.kill', '투구째 꿰뚫음: 즉사 확률']].map(""", """['pierce.str', '투구째 꿰뚫음: 괴력 배율 이 이상'], ['pierce.kill', '투구째 꿰뚫음: 즉사 확률'],
    ['maim.p', '부위: 머리 · 팔에 치명이면 눈 · 팔을 잃을 확률'], ['maim.bigP', '부위: 치명이 아니어도 크게 맞으면 확률'], ['maim.big', '부위: 크게 = 최대 체력의 이 비율 넘게'], ['maim.crush', '부위: 거구의 찍기 · 짓밟기에 뼈가 부러질 확률'], ['maim.massRes', '부위: 이 무게 (kg) 넘으면 덜 상함'],
    ['maim.bleed', '절단 출혈: 초당 최대 체력의 이 비율'], ['maim.bleedT', '절단 출혈: 이어지는 시간 (초)'], ['maim.oneEye', '눈 하나를 잃으면 보는 거리 ×'], ['maim.oneEyeAim', '눈 하나를 잃으면 조준 ×'], ['maim.blindMiss', '실명: 휘두르면 헛칠 확률'],
    ['maim.offHand', '무기 팔을 잃으면 공격 ×'], ['maim.twoHand', '받치는 팔을 잃으면 공격 ×'], ['maim.gunOneArm', '한 손 사격 조준 ×'], ['maim.kick', '두 팔을 잃으면 발길질 ×'], ['call.r', '아군 시야 연동: 불러 주는 거리 (칸)'], ['call.err', '아군 시야 연동: 자리 오차 (칸)']].map("""),
]
for o,n in pairs:
    if s.count(o)!=1: print('MISMATCH',s.count(o),o[:120]); sys.exit(1)
for o,n in pairs: s=s.replace(o,n)
open(p,'w',encoding='utf-8').write(s); print('ok')
