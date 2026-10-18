import sys
P='page10.tpl.html'
s=open(P,encoding='utf-8').read()
pairs=[]
def rep(a,b): pairs.append((a,b))

rep("""<!-- 굴의 전투판 v5.3 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.""",
"""<!-- 굴의 전투판 v5.4 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.4: [지휘X] 재능 (인주 B · 노먼 C · 곤봉적 B). 지휘가 있는 편은 진형을 갖추고 대치 (탱커 앞 · 창은 탱커 뒤 · 칼은 날개 · 사수 뒤), 서로 틈을 노리며 돎.
           들어가는 때: 우위 · 빈틈 · 사격에 밀림 · 오래 대치. 지휘가 쓰러지면 진형이 풀림. 돌격 예고선. 혼자 진형에 뛰어들지 않음. 방진은 한 명이라도 더 붙을수록 굳건함.
           창은 모두 장창 (사거리 1.5, 동료 뒤에서 방진 틈으로 찌름). 원거리는 무기 종류로 가름 (총 · 활 · 마법).""")
rep("""<span class="ver">v5.3 · 돌격 · 몸으로 싸우기""", """<span class="ver">v5.4 · 진형 · 대치 · 돌격""")
rep("""<footer>굴의 전투판 v5.3 —""", """<footer>굴의 전투판 v5.4 —""")
rep("""  return `굴의 전투판 v5.3 · ${title}""", """  return `굴의 전투판 v5.4 · ${title}""")
rep("""copyText('굴의 전투판 v5.3 자동 판 기록""", """copyText('굴의 전투판 v5.4 자동 판 기록""")
rep("""<p class="lab">몸 · 기술 (v5.2) —""", """<p class="lab">몸 · 기술 · 진형 (v5.4) —""")

# 지휘 등급
rep("""const GRADE_KEYS = ['속력', '괴력'];""", """const GRADE_KEYS = ['속력', '괴력', '지휘'];   // v5.4 지휘 = 재능 (편의 지휘력 점수)""")
rep("""  const m = /^(속력|괴력)([SABC])$/.exec(t);
  if (m){ const k = rules.grades && rules.grades[m[1]] ? rules.grades[m[1]][m[2]] : 1; return m[1] === '속력' ? `이동 속력 ×${k}` : `공격 ×${k} · 막히면 상대 자세를 ×${k} 더 깎음`; }""",
    """  const m = /^(속력|괴력|지휘)([SABC])$/.exec(t);
  if (m){ const k = rules.grades && rules.grades[m[1]] ? rules.grades[m[1]][m[2]] : 1; return m[1] === '속력' ? `이동 속력 ×${k}` : m[1] === '지휘' ? `편의 지휘력 +${k}점 — 지휘가 있으면 진형을 갖추고 대치하며 틈을 노림 · 혼자 뛰어들지 않음 (지휘가 많을수록 영리하고 참을성 있게). 전략 이해 · 지능 · 지휘력 · 사교성의 재능` : `공격 ×${k} · 막히면 상대 자세를 ×${k} 더 깎음`; }""")

# 설계 칸
rep("""weapon: '어부의 창', height: 1.6, nv: true, nvG: 'C', traits: ['일반인'], tactic: '보병 · 창 (2열)',""", """weapon: '어부의 창', height: 1.6, nv: true, nvG: 'C', traits: ['일반인', '지휘B'], tactic: '보병 · 장창 (2열) · 지휘',""")
rep("""role: '사수', weapon: '소총', bold: 0.5, height: 1.8, nv: true, nvG: 'A', gear:""", """role: '사수', weapon: '소총', bold: 0.5, height: 1.8, nv: true, nvG: 'A', traits: ['지휘C'], gear:""")
rep("""traits: ['거구'], gear: { 몸: { name: '두꺼운 판금', mat: '판금', tier: 3 }, 머리: { name: '곤봉적 투구', mat: '투구', tier: 2 } }, tactic: '중전차 · 곤봉',""", """traits: ['거구', '지휘B'], gear: { 몸: { name: '두꺼운 판금', mat: '판금', tier: 3 }, 머리: { name: '곤봉적 투구', mat: '투구', tier: 2 } }, tactic: '중전차 · 곤봉 · 적의 지휘',""")

# 옮기기 v5.4
rep("""// v5.0: 역할 (프로필에 정해진 인물만, 나머지는 장비 · 직업으로 자동)""", """// v5.4: 지휘 (인주 B · 노먼 C · 곤봉적 B — 지휘 특성이 없을 때만), 창 = 장창 (사거리 1 → 1.5), 진형 · 돌격 예고 수치
if (!S.v54){ const addT = (u, t) => { if (!(u.traits || []).some(x => /^지휘[SABC]$/.test(x))) u.traits = [...(u.traits || []), t]; };
  for (const u of S.units){ if (u.ref === 'C-001' && u.hero) addT(u, '지휘B'); if (u.ref === 'C-007') addT(u, '지휘C'); if (u.ref === 'C-055' && (u.traits || []).includes('거구')) addT(u, '지휘B'); }
  for (const w of ['창', '어부의 창']) if (S.rules.weapons[w] && S.rules.weapons[w].rng === 1) S.rules.weapons[w].rng = 1.5;
  if (S.rules.grades && !S.rules.grades['지휘']) S.rules.grades['지휘'] = clone(DEFAULT_RULES.grades['지휘']);
  const c = S.rules.charge, d = DEFAULT_RULES.charge; if (c) for (const j in d) if (c[j] === undefined) c[j] = d[j];
  S.v54 = true; }
// v5.0: 역할 (프로필에 정해진 인물만, 나머지는 장비 · 직업으로 자동)""")
rep("""v50: true, v51: true, v52: true, v53: true, type: 'gridC'""", """v50: true, v51: true, v52: true, v53: true, v54: true, type: 'gridC'""")

# 돌격 예고선 · 방진 선
rep("""      ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); ctx.lineTo(ox + t.x * ts, oy + t.y * ts); ctx.stroke();
    }
    if (!Wd.over){""", """      ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); ctx.lineTo(ox + t.x * ts, oy + t.y * ts); ctx.stroke();
    }
    // v5.4 돌격 예고선: 준비 (점선 · 굵게) → 달림 (실선), 끝에 화살촉
    for (const u of Wd.units){
      if (!u.alive || !u.act || u.act.k !== 'charge' || (u.side === 1 && !u.seenBy && !see)) continue;
      const t = Wd.units[u.act.b]; if (!t) continue;
      const x0 = ox + u.x * ts, y0 = oy + u.y * ts, x1 = ox + t.x * ts, y1 = oy + t.y * ts, a = Math.atan2(y1 - y0, x1 - x0), wind = u.act.phase === 'wind';
      ctx.save(); ctx.setLineDash(wind ? [8, 5] : []); ctx.lineWidth = wind ? 3 : 4; ctx.strokeStyle = u.side ? 'rgba(255,90,60,.95)' : 'rgba(120,190,255,.95)';
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - Math.cos(a - 0.4) * 14, y1 - Math.sin(a - 0.4) * 14); ctx.lineTo(x1 - Math.cos(a + 0.4) * 14, y1 - Math.sin(a + 0.4) * 14); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    // v5.4 방진: 대치 중인 편의 붙어 선 동료끼리 얇은 선
    for (const sd of [0, 1]){ const SS = Wd.stance && Wd.stance[sd]; if (!SS || SS.k !== 'hold') continue;
      const L2 = Wd.units.filter(u => u.alive && u.side === sd && !u.crawl && (sd === 0 || u.seenBy || see));
      ctx.save(); ctx.setLineDash([]); ctx.lineWidth = 2; ctx.strokeStyle = sd ? 'rgba(255,140,110,.35)' : 'rgba(150,205,255,.35)';
      for (let i = 0; i < L2.length; i++) for (let j = i + 1; j < L2.length; j++){ const a = L2[i], b = L2[j]; if (Math.hypot(a.x - b.x, a.y - b.y) > 1.3) continue; ctx.beginPath(); ctx.moveTo(ox + a.x * ts, oy + a.y * ts); ctx.lineTo(ox + b.x * ts, oy + b.y * ts); ctx.stroke(); }
      ctx.restore(); }
    ctx.setLineDash([5, 4]); ctx.lineWidth = 1.6;
    if (!Wd.over){""")

# 상태 줄: 대치 · 교전
rep("""    : `턴 ${Wd.turn} · ${f2(Wd.t)}초 · 보이는 적 ${seen}${see ? ' / 남은 적 ' + left : ''} · 처치 ${Wd.kills[0]} · 남은 횃불 ${Wd.spare}`;""",
    """    : `턴 ${Wd.turn} · ${f2(Wd.t)}초 · 보이는 적 ${seen}${see ? ' / 남은 적 ' + left : ''} · 처치 ${Wd.kills[0]} · 남은 횃불 ${Wd.spare}${[0, 1].map(sd => { const SS = Wd.stance && Wd.stance[sd]; return SS && SS.k !== 'free' ? ` · ${sd ? '적' : '아군'} ${SS.k === 'hold' ? '대치' : '교전'} (지휘 ${cmdOf(Wd, sd)})` : ''; }).join('')}`;""")

# 설명 상자: 겸보직 · 방진 · 지휘
rep("""    <span class="tr"><span class="lb">역할</span> ${esc(u.role || roleOf(p, rules))} — ${esc(ROLE_DESC[u.role || roleOf(p, rules)] || '')}""",
    """    <span class="tr"><span class="lb">역할</span> ${esc(u.role || roleOf(p, rules))}${u.skill && u.skill.kit ? ' · 겸: 의무 (구급상자)' : u.skill ? ' · 겸: 치유' : ''}${u.cmd ? ' · 겸: 지휘 (+' + u.cmd + '점)' : ''} — ${esc(ROLE_DESC[u.role || roleOf(p, rules)] || '')}""")
rep("""    ${u.canSweep ? `<span class="tr"><span class="lb">거구의 공격</span>""", """    ${!ed && u.alive ? `<span class="tr"><span class="lb">방진</span> 붙어 선 동료 ${formMates(Wd, u)}명 — 돌격을 버티는 무게 · 막을 때 자세 덜 깎임${Wd.stance && Wd.stance[u.side] && Wd.stance[u.side].k !== 'free' ? ` · 편: ${Wd.stance[u.side].k === 'hold' ? '대치 (진형)' : '교전'} · 지휘력 ${cmdOf(Wd, u.side)}` : cmdOf(Wd, u.side) ? '' : ' · 편에 지휘가 없음 (제각각 싸움)'}</span>` : ''}
    ${u.canSweep ? `<span class="tr"><span class="lb">거구의 공격</span>""")

# 기분 이름
rep("""'거구 피함': '거구 피함' };""", """'거구 피함': '거구 피함', '대치': '대치', '진형': '진형' };""")

# 로그 · 이야기
rep("""      case 'chargeMiss': out.push(""", """      case 'stance': out.push(`${T(e)}${e.side ? '적' : '아군'} ${{ hold: '대치 (진형을 갖춤)', engage: '교전', free: '진형 풀림' }[e.s] || e.s}${e.why ? ' — ' + e.why : ''} (지휘력 ${e.cmd})`); break;
      case 'chargeMiss': out.push(""")
rep("""    case 'chargeMiss': return""", """    case 'stance': { const al = e.side === 0, who = al ? '아군' : '적', boss = Wd.units.filter(u => u.side === e.side && u.cmd).sort((a, b) => b.cmd - a.cmd)[0];
      if (e.s === 'hold') return al ? { c: 'good', s: `아군이 진형을 갖춘다 — 탱커를 앞에, 창은 그 뒤로. 서로 틈을 노리며 돈다.` } : { c: 'bad', s: `적도 진형을 갖춘다${boss ? ' — ' + ga(boss.name) + ' 지휘한다' : ''}. 쉽게 들어오지 않는다.` };
      if (e.s === 'free') return e.why === '지휘를 잃음' ? { c: al ? 'bad' : 'good', s: `지휘가 끊겼다 — ${who}의 진형이 흐트러진다!` } : null;
      const w = { '빈틈': al ? '틈이 보인다 — 아군이 치고 나간다!' : '적이 틈을 보고 덮쳐 온다!', '사격에 밀림': al ? '사격에 밀리자 아군이 거리를 좁힌다!' : '사격에 밀리자 적이 거리를 좁혀 온다!', '오래 대치': `오랜 대치 끝에 ${who}이 먼저 움직인다!`, '우위': al ? '우세를 본 아군이 밀고 나간다!' : '우세를 본 적이 밀고 나온다!' }[e.why];
      return w ? { c: al ? 'good' : 'bad', s: w } : null; }
    case 'chargeMiss': return""")

# 수치표
rep("""['turnMass', '돌아서기: √(이 값 ÷ 무게) 배 (무거울수록 느림)'], ['faceArc', '근접: 몸이 상대 쪽 ±도 안을 봐야 들어감']""",
    """['turnMass', '돌아서기: √(이 값 ÷ 무게) 배 (무거울수록 느림)'], ['faceArc', '근접: 몸이 상대 쪽 ±도 안을 봐야 들어감'], ['charge.wind', '[돌격]: 예고 (준비) 시간 (초)'],
    ['form.gap', '대치: 상대 맨 앞에서 떨어져 서는 거리 (칸)'], ['form.sway', '대치: 옆으로 도는 빠르기'], ['form.amp', '대치: 옆으로 도는 폭 (칸)'], ['form.patience', '대치: 참는 시간 (초, + 지휘력 × 아래)'], ['form.perCmd', '대치: 지휘력 1점마다 더 참는 시간 (초)'], ['form.adv', '대치 → 교전: 이만큼 우세하면'], ['form.open', '대치 → 교전: 빈틈 점수 이상이면'], ['form.walk', '진형으로 걷는 속력 ×'], ['form.postForm', '방진: 붙어 선 동료 한 명마다 막을 때 자세 덜 깎임']""")

for a,b in pairs:
    c=s.count(a)
    if c!=1: print('MISMATCH',c,a[:140]); sys.exit(1)
for a,b in pairs: s=s.replace(a,b)
open(P,'w',encoding='utf-8').write(s)
print('ok')
