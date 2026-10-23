# v8.8.2 페이지 — page8820.py v1.0 (v1.0: 옐로 업데이트 — 연속 도약 · 돌진 · 달라붙기 난도질 · 양동이 뿌리기 (저주:맥아 장판) · 날붙이 손 · 시각 효과)
import subprocess, re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8810.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.8.1 (2026-10-23)', '<!-- 굴의 전투판 v8.8.2 (2026-10-23)')
rep('     v8.8.1: 진형 폐기 (', '''     v8.8.2: 옐로 업데이트 (민수 — "특수잡기 · 연속 도약 · 돌진 · 양동이 뿌리기 … 기존 시스템에서 가능하면 응용"):
         [연속 도약] (두 번 이어서 · 스스로 자주 뛰어듦) · [돌진] (사족보행 — 처음엔 살짝 느리다 끝에서 폭발 · 5칸 넘게 달려 들이받으면 중대형까지 3칸 이상 확정 밀침 · 대형은 1칸 · 피해도 큼 · "키하핫!!" · 태세를 키기도 전에 달려들고 키더라도 크게 밀림)
         [달라붙기 난도질] (붙잡기 틀 — 잡아찢기 응용: 2초 동안 몸에 달라붙어 0.2초마다 날붙이로 마구 할큄 · 맞으면 놓침) · [양동이 뿌리기] (핏빛 장판 응용: 4칸 안에 반지름 1.6 장판 · 남은 약만큼 3 ~ 10초 · <저주:맥아> 걸음 느려짐 · 받는 피해 +30% · 살이 녹음)
         손: 날붙이 판정에 절삭력 (갑옷이 막는 몫 35% 무시) · 단단한 손 (맨팔로 막아도 안 잘림). 시각: 양동이 쏟아지는 모습 · 맥아 장판 · 할큄 자국 · 돌진 충격.
     v8.8.1: 진형 폐기 (''')
for a, b in (('h1::after{content:" v8.8.1"', 'h1::after{content:" v8.8.2"'), ('<footer>굴의 전투판 v8.8.1', '<footer>굴의 전투판 v8.8.2'), ('return `굴의 전투판 v8.8.1 · ${title}', 'return `굴의 전투판 v8.8.2 · ${title}'),
             ("copyText('굴의 전투판 v8.8.1 자동 판 기록", "copyText('굴의 전투판 v8.8.2 자동 판 기록"), ("o.push(`굴의 전투판 v8.8.1 — ${C.run", "o.push(`굴의 전투판 v8.8.2 — ${C.run"),
             ('의 버전 기록에 — v8.8.1 진형 폐기 / v8.8.0', '의 버전 기록에 — v8.8.2 옐로 업데이트 / v8.8.1 진형 폐기 / v8.8.0'),
             ('">v8.8.1 · 진형 폐기 (각자 지휘)</span>', '">v8.8.2 · 옐로 업데이트</span>'),
             ("ver: '8.8.1', kind:", "ver: '8.8.2', kind:")):
    rep(a, b)
rep("RULES_MIG = '8.8.1',", "RULES_MIG = '8.8.2',")   # 수치표: claw · spec.yclaw · spec.ybucket 새 칸

# ---------- 옐로 설정 ----------
Y_TACTIC = '기동 · 연속 도약 · 돌진 · 달라붙기 난도질 · 양동이 뿌리기 · 양동이 약'
Y_NOTE = ('침식 중인 소녀. 손발이 단단한 날붙이 (절삭력 높음 · 냉병기 · 방패는 쥐거나 듦 · 총 · 활은 못 듦) · 네 발로 달리면 가장 빠름 · 연속 도약 (두 번 이어서) · '
          '돌진: 느리게 출발해 끝에서 폭발 — 5칸 넘게 달려 들이받으면 3칸 넘게 확정 밀침 (키하핫!!) · 달라붙기 난도질 (붙잡고 마구 할큄) · 양동이 뿌리기 (<저주:맥아> 장판) · '
          '의학 B (전문 지식은 있으나 의사는 아님) — 양동이 약은 몸에서 계속 다시 참 (초당 4)')
rep("active: ['도약'], leapN: 2, skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.5, rec: 0.4, rng: 0.8, regen: 4 }, tactic: '기동 · 2연속 도약 · 양동이 약', note: '침식 중인 소녀. 손발이 날붙이 (짐승의 이빨처럼) · 네 발로 달리면 가장 빠름 · 도약 2연속. 의학 B (전문 지식은 있으나 의사는 아님) — 양동이 약은 몸에서 계속 다시 참 (초당 4)' },",
    "active: ['연속 도약', '돌진', '달라붙기 난도질', '양동이 뿌리기'], leapN: 2, skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.5, rec: 0.4, rng: 0.8, regen: 4 }, tactic: '%s', note: '%s' }," % (Y_TACTIC, Y_NOTE))
rep("tactic: '기동 · 양동이 약', note: '양동이에 담은 자기 세계의 약으로 모두 합쳐 500 만큼 회복 (한 번에 최대 120) — 평소엔 명령으로, 동료가 아주 위급하면 (체력 25% 아래) 스스로' },",
    "tactic: '%s', note: '양동이에 담은 자기 세계의 약으로 모두 합쳐 500 만큼 회복 (한 번에 최대 120) — 평소엔 명령으로, 동료가 아주 위급하면 (체력 25%% 아래) 스스로. 같은 양동이로 상대에게 뿌리기도 함 (<저주:맥아> 장판 — 약이 줄어듦)' }," % Y_TACTIC)
rep("effects: ['근접 타격이 날붙이 판정을 받음 (맨손 · 발톱이어도 날붙이 — 무방비한 등에 들어가면 암살 치명상)'],",
    "effects: ['근접 타격이 날붙이 판정을 받음 (맨손 · 발톱이어도 날붙이 — 무방비한 등에 들어가면 암살 치명상)', '절삭력: 날붙이로 갑옷이 막는 몫을 35% 무시', '단단한 손: 맨팔로 막아도 피해가 적고 잘리지 않음 (방패 · 냉병기는 쥐거나 들 수 있음)', '<저주:맥아>를 상대에게 부여할 수 있음 (양동이 뿌리기) — 살이 무르고 (받는 피해 +30%) · 이동이 느려지고 (×0.55) · 살이 녹음'],")
# 한 번: 저장된 판 · 내 설계의 옐로를 새 설정으로
rep("  S.v719k = true; if (n) setTimeout(() => { save(); toast(`새 인물 설정으로 맞췄어요 (${n}곳 — 2단계 인물 · 옐로 의학B · 2연속 도약)`); }, 1700); }",
    """  S.v719k = true; if (n) setTimeout(() => { save(); toast(`새 인물 설정으로 맞췄어요 (${n}곳 — 2단계 인물 · 옐로 의학B · 2연속 도약)`); }, 1700); }
// v8.8.2 옐로 업데이트 (한 번): [연속 도약] · [돌진] · [달라붙기 난도질] · [양동이 뿌리기] — 저장된 판 · 내 설계의 옐로를 새 설정으로
const YACT882 = ['연속 도약', '돌진', '달라붙기 난도질', '양동이 뿌리기'];
const fix882 = p => { if (!p || (p.side || 0) !== 0 || p.ref !== 'C-008') return false; const nx = [...new Set([...YACT882, ...(p.active || []).filter(a => a !== '도약')])]; const ch = JSON.stringify(nx) !== JSON.stringify(p.active || []) || p.leapN !== 2; p.active = nx; p.leapN = 2; p.tactic = '%s'; p.note = '%s'; return ch; };
if (!S.v882k){ let n = 0; for (const u of S.units) if (fix882(u)) n++; try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fix882(d)){ dc = true; n++; } if (dc) saveMyDesigns(mine); } catch (e) {}
  S.v882k = true; if (n) setTimeout(() => { save(); toast(`옐로를 새 설정으로 맞췄어요 (${n}곳 — 연속 도약 · 돌진 · 달라붙기 난도질 · 양동이 뿌리기)`); }, 1500); }""" % (Y_TACTIC, Y_NOTE))

# ---------- 기술 설명 · 칸 이름 · 아이콘 · 안내 ----------
rep("  '도약': '앞 · 뒤 · 옆 어디로든 단숨에 1.7칸 뛰는 이동 기술",
    """  '연속 도약': '옐로 — 도약을 두 번 이어서 뜀 (0.3초 간격 · 쉬었다 다시). 앞 · 뒤 · 옆 어디로든 1.7칸씩 · 명령은 기술 칸 3. 스스로도 자주: 붙지 못한 상대에게 두 번 뛰어들어 바로 앞에 내림 (멀리서 돌진이 준비돼 있으면 돌진 먼저) · 측후방 도약 · 나를 노린 돌진 피하기.',   /* v8.8.2 */
  '달라붙기 난도질': '옐로 — 특수 잡기: 1.3칸 안의 상대에게 달려들어 몸에 달라붙음 (몸을 비틀어 피할 수 있음 · 초대형은 못 붙잡음) → 2초 동안 0.2초마다 손발의 날붙이로 마구 할큄 (막을 수 없음 · 열 번 안팎 · 마지막 한 번은 두 배 반의 힘으로 베고 박차며 떨어짐). 붙은 옐로가 최대 체력의 20% 를 맞으면 놓침. 14초마다. 상대가 막 서 있을 때 · 무리가 셋 넘게 둘러싸지 않았을 때 스스로 씀.',   /* v8.8.2 */
  '양동이 뿌리기': '옐로 — 양동이의 약을 상대에게 뿌림: 4칸 안의 자리에 반지름 1.6 의 장판 (약 120 을 쓰고, 남은 약이 많을수록 3 ~ 10초 오래 감). 안의 상대는 <저주:맥아> — 걸음 ×0.55 · 받는 피해 +30% · 살이 녹음 (0.5초마다). 동료는 상관없음. 10초마다. 양동이에 약이 60 은 남아야 함 (동료가 위급하면 약은 치료에 씀). 명령: 적 · 바닥을 누름.',   /* v8.8.2 */
  '도약': '앞 · 뒤 · 옆 어디로든 단숨에 1.7칸 뛰는 이동 기술""")
rep("준비를 끊음. 3칸을 달리면 전력질주. 4초마다',",
    "준비를 끊음. 3칸을 달리면 전력질주. 4초마다. 옐로 (사족보행) 의 돌진은 특별함 — 1.5 ~ 8칸 · 처음엔 살짝 느리다 끝에서 엄청 빨라짐 · 가까우면 그냥 빠르고 센 돌격이지만 5칸 넘게 달려 들이받으면 날붙이로 크게 베며 중대형까지 3칸 넘게 확정 밀침 (대형은 1칸 · 태세로 받아도 1칸 넘게 밀림) · 특별 말풍선 \"키하핫!!\" · 상대는 태세를 키기도 전에 당함.',")
rep("pball: '💫', pwide: '🌀' };", "pball: '💫', pwide: '🌀', yclaw: '🐾', ybucket: '🪣' };")
rep("const SPEC_TGT = { ", "const SPEC_TGT = { yclaw: '🐾 달라붙기 난도질: 붙은 적을 탭 (1.3칸 — 2초 동안 몸에 달라붙어 마구 할큄 · 맞으면 놓침 · 초대형은 못 붙잡음)', ybucket: '🪣 양동이 뿌리기: 적 (또는 바닥) 을 탭 (4칸 — 반지름 1.6 장판 · <저주:맥아> · 남은 약만큼 오래 · 약 120 씀)', ")
rep("else if (S2.k === 'leap'){ st.ix = '도약';", "else if (S2.k === 'leap'){ st.ix = C.some(u => u.leapN >= 2) ? '연속 도약' : '도약'; st.nm = st.ix;")
rep("out.push({ k: 'leap', ic: '↩', ix: '도약', nm: '도약', cd: lp.cd });", "out.push({ k: 'leap', ic: '↩', ix: lp.ix, nm: lp.ix, cd: lp.cd });")
rep("    if ((!u || (u.side === 0 && !C.includes(u))) && A0.s === 'root'){",
    "    if ((!u || (u.side === 0 && !C.includes(u))) && A0.s === 'ybucket'){ C.forEach(x => { x.order = { k: 'spec', s: 'ybucket', x: w.x, y: w.y }; }); noteOrders(C); toast(`${C.map(x => x.name).join(' · ')}: ${coord(w.x, w.y)} 에 양동이 뿌리기`); return done(); }   /* v8.8.2 */\n"
    "    if ((!u || (u.side === 0 && !C.includes(u))) && A0.s === 'root'){")

# ---------- 그림: 맥아 장판 · 양동이 쏟기 · 할큄 자국 ----------
rep("now2 = performance.now();   /* v7.22.3 핏빛 장판 */",
    """now2 = performance.now();   /* v7.22.3 핏빛 장판 */
    if (P.kind === 'malt'){   /* v8.8.2 저주:맥아 장판 — 누런 갈색 진액 · 부글거리는 거품 · 김 */
      ctx.fillStyle = `rgba(116,92,22,${(0.38 * a + 0.08).toFixed(3)})`; ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.fill();
      ctx.fillStyle = `rgba(176,140,40,${(0.22 * a).toFixed(3)})`; ctx.beginPath(); ctx.arc(px, py, R * 0.62, 0, 6.283); ctx.fill();
      ctx.setLineDash([2, 4]); ctx.strokeStyle = `rgba(214,178,70,${(0.85 * a).toFixed(3)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
      for (let k = 0; k < 9; k++){ const q = ((now2 / 900) + k / 9) % 1, ang = k * 2.4 + P.t0, rr2 = R * (0.18 + 0.6 * ((k * 37) % 7) / 7); ctx.fillStyle = `rgba(232,200,96,${(0.55 * a * (1 - q)).toFixed(3)})`; ctx.beginPath(); ctx.arc(px + Math.cos(ang) * rr2, py + Math.sin(ang) * rr2 - q * ts * 0.35, ts * 0.05 + q * ts * 0.05, 0, 6.283); ctx.fill(); }
      continue; }""")
rep("    } else if (f.k === 'crush' && age < 0.5){   // v5.2 짓뭉개짐 · 짓밟기",
    """    } else if (f.k === 'claw' && age < 0.3){   /* v8.8.2 달라붙어 할큄 — 세 줄 자국 */
      const p = { x: ox + f.x * ts, y: oy + f.y * ts }, q = age / 0.3; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(f.ang); ctx.lineCap = 'round';
      for (let k = -1; k <= 1; k++){ ctx.strokeStyle = `rgba(150,10,20,${(0.85 * (1 - q)).toFixed(3)})`; ctx.lineWidth = 3.6; ctx.beginPath(); ctx.moveTo(-ts * 0.36, k * ts * 0.13 - ts * 0.16); ctx.lineTo(ts * 0.36 * (0.4 + q), k * ts * 0.13 + ts * 0.16); ctx.stroke();
        ctx.strokeStyle = `rgba(255,236,226,${(1 - q).toFixed(3)})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-ts * 0.36, k * ts * 0.13 - ts * 0.16); ctx.lineTo(ts * 0.36 * (0.4 + q), k * ts * 0.13 + ts * 0.16); ctx.stroke(); }
      ctx.restore();
    } else if (f.k === 'pour' && age < 0.6){   /* v8.8.2 양동이 뿌리기 — 쏟아지는 맥아 */
      const a = Wd.units[f.a], q = age / 0.6, x0 = ox + a.x * ts, y0 = oy + a.y * ts - ts * 0.3, x1 = ox + f.x * ts, y1 = oy + f.y * ts;
      for (let k = 0; k < 16; k++){ const u2 = Math.min(1, q * 1.4 - k / 16 * 0.45); if (u2 <= 0) continue; ctx.fillStyle = `rgba(206,166,54,${(0.9 * (1 - q * 0.5)).toFixed(3)})`; ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * u2, y0 + (y1 - y0) * u2 - Math.sin(u2 * Math.PI) * ts * 0.95, ts * 0.075 * (1 - u2 * 0.35), 0, 6.283); ctx.fill(); }
      ctx.strokeStyle = `rgba(120,90,30,${(0.9 * (1 - q)).toFixed(3)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x0, y0 - ts * 0.1, ts * 0.17, 0.4 + q * 1.2, 3.6 + q * 1.2); ctx.stroke();
    } else if (f.k === 'crush' && age < 0.5){   // v5.2 짓뭉개짐 · 짓밟기""")

# ---------- 기록 · 서술 · 흔들림 ----------
rep("case 'tearGrab': out.push(`${T(e)}✊ ${n(e.a)} 잡아찢기",
    "case 'tearGrab': if (e.s === 'yclaw'){ out.push(`${T(e)}🐾 ${n(e.a)} 달라붙기 난도질 — ${reul(n(e.b))} 붙잡고 마구 할큄 (${e.sec}초 · 맞히면 놓침)`); break; } out.push(`${T(e)}✊ ${n(e.a)} 잡아찢기")
rep("case 'tearLet': out.push(",
    """case 'rushHit': out.push(`${T(e)}💨 ${n(e.a)} \\"키하핫!!\\" — ${e.run}칸을 달려 ${reul(n(e.b))} 들이받아 ${e.len}칸 날려 보냄${e.held ? ' (태세로 받았지만 밀림)' : ''}`); break;   /* v8.8.2 */
      case 'bucket': out.push(`${T(e)}🪣 ${n(e.a)} 양동이를 뿌림 — 반지름 ${e.r}칸 · ${e.sec}초 · 약 ${e.cost} 씀 (남은 ${e.left})`); break;
      case 'maltOn': out.push(`${T(e)}☠ ${n(e.b)} — <저주:맥아> (걸음 느려짐 · 살이 무름 · 살이 녹음)`); break;
      case 'clawEnd': out.push(`${T(e)}🐾 ${n(e.a)} 난도질 끝 — ${e.n}번 할퀴고 ${reul(n(e.b))} 박차며 떨어짐`); break;
      case 'tearLet': out.push(""")
rep("case 'tearGrab': return { c:",
    "case 'tearGrab': if (e.s === 'yclaw') return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${reul(n(e.b))} 덮쳐 몸에 매달린다 — 손발의 날붙이로 마구 할퀸다!${U(e.a).side ? ' — 쳐서 떼어 내야 한다.' : ''}` }; return { c:")
rep("case 'tearLet': return { c:",
    """case 'rushHit': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 네 발로 땅을 박차고 쏜살같이 들이닥쳐 ${reul(n(e.b))} 받아 날린다! \\"키하핫!!\\"` };   /* v8.8.2 */
    case 'bucket': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 양동이를 뒤집어 맥아빛 액체를 쏟아붓는다 — 땅이 질척하게 부글거린다.` };
    case 'maltOn': return { c: U(e.b).side ? 'good' : 'bad', s: `${n(e.b)}의 살이 맥아에 닿아 무르게 녹아내린다.` };
    case 'clawEnd': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${e.n}번을 할퀴고 ${reul(n(e.b))} 박차며 떨어진다.` };
    case 'tearLet': return { c:""")
rep("    else if (e.k === 'tearGrab'){ if (b && (e.vis || vis(a))) camShot",
    "    else if (e.k === 'rushHit'){ if (b && e.vis) fxShake(7, 420, b.x, b.y); }   /* v8.8.2 키하핫 */\n    else if (e.k === 'tearGrab'){ if (b && (e.vis || vis(a))) camShot")

open(F, 'w', encoding='utf-8').write(s)
print('page8820 OK')
