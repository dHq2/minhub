p='page10.tpl.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:90],s.count(a)); s=s.replace(a,b)
# 상세: 조준 시간 · 다음 발
rep("${u.marks ? ' · 사격 솜씨' : ''})` : u.rng >= 0.9 ?",
    "${u.marks ? ' · 사격 솜씨' : ''} · 조준 ${aimT(Wd, u).toFixed(2)}초 + 다음 발 ${wCyc(Wd, u)}초${u.alien ? ' — 낯선 무기' : u.fam2 ? ' — 다른 종류라 살짝 느림 ×' + ((Wd.rules.alien || {}).skill || 1.15) : ''})` : u.rng >= 0.9 ?")
# 날아가는 탄: 총은 그리지 않음 (궤적선으로) · 화살 · 창은 긴 잔상
rep("""  if (!ed) for (const sh of Wd.shots || []){ if (sh.arc) continue;
    const tl = Math.min(sh.jav ? 0.7 : 0.9, Math.hypot(sh.x - sh.x0, sh.y - sh.y0)), hx = ox + sh.x * ts, hy = oy + sh.y * ts;""",
"""  if (!ed) for (const sh of Wd.shots || []){ if (sh.arc || sh.gun) continue;   // v7.1 총알은 궤적선만 (효과)
    const tl = Math.min(sh.jav ? 1.6 : 2.6, Math.hypot(sh.x - sh.x0, sh.y - sh.y0)), hx = ox + sh.x * ts, hy = oy + sh.y * ts;   // v7.1 긴 잔상 (눈으로 따라가기 어려운 빠르기)""")
# 궤적 효과
rep("""    } else if (f.k === 'die' && age < 0.6){""", """    } else if (f.k === 'tracer' && age < f.dur){   // v7.1 지나간 궤적: 총 = 레이저 같은 선 (빛 + 심), 화살 · 창 = 옅은 선
      const k = 1 - age / f.dur, x0 = ox + f.x0 * ts, y0 = oy + f.y0 * ts, x1 = ox + f.x1 * ts, y1 = oy + f.y1 * ts, c = f.side ? '255,170,120' : '170,220,255';
      ctx.lineCap = 'round';
      if (f.gun){ ctx.strokeStyle = `rgba(${c},${0.35 * k})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = `rgba(255,250,225,${0.95 * k})`; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
      else { ctx.strokeStyle = f.jav ? `rgba(232,216,176,${0.55 * k})` : `rgba(${c},${0.5 * k})`; ctx.lineWidth = f.jav ? 2.5 : 1.4; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
    } else if (f.k === 'die' && age < 0.6){""")
# 로그 · 이야기: 물러서기
rep("""      case 'opportunity': out.push(""", """      case 'backstep': out.push(`${T(e)}${n(e.a)} ${reul(n(e.b))} 마주 본 채 ${e.back ? '뒷걸음' : '옆걸음'} (방어를 그쪽으로 · 속력 ×${e.back ? (Wd.rules.backstep || {}).back : (Wd.rules.backstep || {}).side} — 서두르기면 돌아서 뜀)`); break;   // v7.1
      case 'opportunity': out.push(""")
rep("""    case 'opportunity': return e.vis ?""", """    case 'backstep': { const k2 = 'b' + e.a; if (narr.bsT && Wd.t - (narr.bsT[k2] || -99) < 8) return null; (narr.bsT = narr.bsT || {})[k2] = Wd.t; return U(e.a).side === 0 ? { c: 'dim', s: `${ga(n(e.a))} ${reul(n(e.b))} 마주 본 채 ${e.back ? '뒷걸음질 친다' : '옆으로 비켜 걷는다'}.` } : e.vis ? { c: 'bad', s: `${ga(n(e.a))} 이쪽을 마주 본 채 ${e.back ? '물러선다' : '옆으로 돈다'}.` } : null; }   // v7.1
    case 'opportunity': return e.vis ?""")
# 버전 · 기록
rep("<!-- 굴의 전투판 v7.0.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v7.1.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.1.0: ① 발사 간격 = 조준 시간: 쏜 뒤엔 다음 발만 잼 (소총 0.15 · 총 0.3 · 저격총 0.9 · 샷건 0.45 · 활 0.35초), 나머지는 조준. 조준 시간은 그 사람의 몫 (제 무기 기준 — 노먼 소총 0.65 · 궁수 활 0.66초, 한 발 주기는 전과 같음) × 익숙함:
                제 무기 ×1 · 사격 솜씨는 있으나 다른 종류 ×1.15 · 조준 ×0.92 (노먼이 활을 들면 0.75초 + 화살 메기기 0.35초) · 낯선 무기 ×1.4 · 조준 ×0.6. 상세정보 '무기' 줄에 조준 · 다음 발.
             ② 보이는 빠르기: 총알은 날아가는 점 없이 레이저 같은 궤적선 (0.18초 빛 + 심), 화살 · 창은 긴 잔상 + 지나간 궤적. 투창 30 → 45 · 던지는 단검 32 → 48칸/초.
             ③ 상대를 마주 본 채 움직임 (양쪽): 근접 상대 손 + 2.5칸 안 · 나를 치려는 · 돌진하는 · 겨누는 · 던지려는 상대가 있으면 그쪽으로 몸 (방어 · 방패) 을 둔 채 물러서거나 옆으로 감 — 옆걸음 ×0.85 · 뒷걸음 ×0.65.
                서두르기 (두 번 누름) · 질주 · 돌진은 돌아서 뜀. 공격하는 순간엔 치는 상대 쪽으로 돎 (서로 부딪히지 않음 — 공격 준비가 몸을 돌림).
""")
rep('body.mob .top h1::after{content:" v7.0.0";', 'body.mob .top h1::after{content:" v7.1.0";')
rep('<span class="ver">v7.0.0 · ', '<span class="ver">v7.1.0 · 발사 간격 = 조준 시간 · 익숙하지 않은 무기는 살짝 느림 · 총은 궤적선만 · 화살 잔상 · 상대를 마주 본 채 물러서기 · v7.0.0 · ')
rep('<footer>굴의 전투판 v7.0.0 —', '<footer>굴의 전투판 v7.1.0 —')
rep('return `굴의 전투판 v7.0.0 · ${title}', 'return `굴의 전투판 v7.1.0 · ${title}')
open(p,'w').write(s); print('ok')
