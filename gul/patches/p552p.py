import sys
p='page10.tpl.html'; s=open(p,encoding='utf-8').read()
for a in ['굴의 전투판 v5.5.1 (', '굴의 전투판 v5.5.1 —', '굴의 전투판 v5.5.1 ·']:
    s=s.replace(a, a.replace('v5.5.1','v5.5.2'))
pairs=[
("""     v5.5.1: [불사] (레베카) 는 죽지 않음""", """     v5.5.2: 사격 솜씨 [사격X] — 노먼 = [사격A] (베테랑 정규군): 남은 빗나감을 55% 줄이고 움직이는 상대 · 점사에도 덜 흔들림.
             돌진 명령은 지휘관을 믿고 뜀 (내가 못 봐도 동료가 보면 들이받음, 아무도 못 보면 마지막 자리로 달려감).
             쓰러진 [불사] 는 초상화만 눕히고 아래에 직각 게이지 — 차면 일어남. 적이 치면 깎이고, 바닥까지 떨어뜨리면 '다시 죽임' (×n).
     v5.5.1: [불사] (레베카) 는 죽지 않음"""),
("""<span class="ver">v5.5.1 · 명령 반응""", """<span class="ver">v5.5.2 · 사격 솜씨 · 명령 반응"""),
# 노먼: [사격A]
("""  'C-007': { cls: '기동', role: '사수', weapon: '소총', bold: 0.5, traits: ['지휘C'],""", """  'C-007': { cls: '기동', role: '사수', weapon: '소총', bold: 0.5, traits: ['지휘C', '사격A'],"""),
("""  { key: '노먼', side: 0, ref: 'C-007', name: '노먼', tier: 2, cls: '기동', role: '사수', weapon: '소총', bold: 0.5, height: 1.8, nv: true, nvG: 'A', traits: ['지휘C'],""",
 """  { key: '노먼', side: 0, ref: 'C-007', name: '노먼', tier: 2, cls: '기동', role: '사수', weapon: '소총', bold: 0.5, height: 1.8, nv: true, nvG: 'A', traits: ['지휘C', '사격A'],"""),
("""  S.v54 = true; }""", """  S.v54 = true; }
// v5.5.2 노먼 = [사격A] (베테랑 정규군) · 수치표에 사격 등급
const fixNorman = p => { if (p.ref !== 'C-007' || (p.traits || []).some(x => /^사격[SABC]$/.test(x))) return false; p.traits = [...(p.traits || []), '사격A']; return true; };
if (!S.v552){ if (S.rules.grades && !S.rules.grades['사격']) S.rules.grades['사격'] = clone(DEFAULT_RULES.grades['사격']); for (const u of S.units) fixNorman(u);
  try { const mine = myDesigns(); if (mine.some(fixNorman)) saveMyDesigns(mine); } catch (e) {} S.v552 = true; }"""),
("""const GRADE_KEYS = ['속력', '괴력', '지휘'];   // v5.4 지휘 = 재능 (편의 지휘력 점수)""", """const GRADE_KEYS = ['속력', '괴력', '지휘', '사격'];   // v5.4 지휘 = 재능 (편의 지휘력 점수) · v5.5.2 사격 = 솜씨"""),
("""  const m = /^(속력|괴력|지휘)([SABC])$/.exec(t);
  if (m){""", """  const m = /^(속력|괴력|지휘|사격)([SABC])$/.exec(t);
  if (m && m[1] === '사격'){ const k = rules.grades && rules.grades['사격'] ? rules.grades['사격'][m[2]] : 0.5; return `사격 솜씨 — 원거리 명중에서 남은 빗나감을 ${Math.round(k * 100)}% 줄임 · 움직이는 상대 · 움찔 · 점사의 흔들림도 덜함 (투창은 따로)`; }
  if (m){"""),
("""(멀리서 쏨 · 명중 가까이 ${Math.round(Wd.rules.aimNear * 100)}% → 끝 ${Math.round((u.aim != null ? u.aim : Wd.rules.aimFar) * 100)}%)""",
 """(멀리서 쏨 · 명중 가까이 ${Math.round((Wd.rules.aimNear + (1 - Wd.rules.aimNear) * (u.marks || 0)) * 100)}% → 끝 ${Math.round(((u.aim != null ? u.aim : Wd.rules.aimFar) + (1 - (u.aim != null ? u.aim : Wd.rules.aimFar)) * (u.marks || 0)) * 100)}%${u.marks ? ' · 사격 솜씨' : ''})"""),
# 쓰러진 [불사]: 초상화만 눕힘 + 직각 게이지
("""    ctx.save(); ctx.globalAlpha = 0.75; ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.clip(); ctx.translate(px, py); ctx.rotate(Math.PI / 2); ctx.translate(-px, -py);""",
 """    // v5.5.2 초상화만 눕힘 (제 모양 그대로 90° 꺾음) + 아래 직각 게이지 (피 / 일어나는 피) — 차면 일어남, 맞으면 깎임 (바닥까지 = 다시 죽임 ×n)
    const shp = shapeOf(u), sa = (u.face || 0) + Math.PI / 2;
    ctx.save(); ctx.globalAlpha = 0.9; shapePath(ctx, shp, px, py, r, sa); ctx.fillStyle = '#1c1a20'; ctx.fill(); ctx.clip(); ctx.translate(px, py); ctx.rotate(Math.PI / 2); ctx.translate(-px, -py);"""),
("""    ctx.fillStyle = 'rgba(40,0,0,.45)'; ctx.fillRect(px - r, py - r, r * 2, r * 2); ctx.restore();
    ctx.strokeStyle = SIDEC[u.side]; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);""",
 """    ctx.restore();
    ctx.strokeStyle = SIDEC[u.side]; ctx.lineWidth = Math.max(1.6, r * 0.16); shapePath(ctx, shp, px, py, r, sa); ctx.stroke();
    { const need = Math.max(1, u.max * undMove(Wd)), fr = Math.max(0, Math.min(1, u.hp / need)), hit = now - (u.pinnedT == null ? -9 : u.pinnedT) < 0.35, bw = Math.max(24, r * 2.2), bh = Math.max(5, Math.min(9, r * 0.22)), bx = px - bw / 2, by = py + r + 3;
      ctx.fillStyle = 'rgba(8,6,10,.9)'; ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2); ctx.fillStyle = hit ? '#ff5a4a' : pin ? '#e8a35a' : '#6fe08f'; ctx.fillRect(bx, by, bw * fr, bh);
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1; ctx.strokeRect(bx - 0.5, by - 0.5, bw + 1, bh + 1);
      if (u.reKills) { ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ff9a86'; ctx.fillText('×' + (u.reKills + 1), bx + bw + 4, by + bh / 2); } }"""),
("""    if (ts >= 26){ const t = `[불사] 피 ${Math.round(u.hp)}/${Math.round(u.max * undMove(Wd))}${pin ? ' · 눌림' : ' · ' + f2(undEta(Wd, u)) + '초'}`;""",
 """    if (ts >= 26){ const t = `[불사] ${pin ? '눌림' : f2(undEta(Wd, u)) + '초 뒤 일어남'}`;"""),
# 서술: 다시 죽임
("""      case 'pinDown': out.push(`${T(e)}${n(e.a)} → 쓰러진 ${n(e.b)} ${e.dmg != null ? `눌러 둠 (−${e.dmg} · 피 ${e.hp}/${e.need} — 일어나지 못하게)` :""",
 """      case 'pinDown': out.push(`${T(e)}${n(e.a)} → 쓰러진 ${n(e.b)} ${e.dmg != null ? `${e.rekill ? '다시 죽임 (' + (e.n + 1) + '번째)' : '눌러 둠'} (−${e.dmg} · 게이지 ${e.hp}/${e.need})` :"""),
("""return { c: U(e.b).side ? 'good' : 'bad', s: `${ga(n(e.a))} 쓰러진 ${reul(n(e.b))} 내리친다. [불사] 의 피가 차오르지 못한다.` }; }""",
 """return { c: U(e.b).side ? 'good' : 'bad', s: e.rekill ? `${ga(n(e.a))} 일어나려던 ${reul(n(e.b))} 다시 죽인다 (${e.n + 1}번째).` : `${ga(n(e.a))} 쓰러진 ${reul(n(e.b))} 내리친다. [불사] 의 게이지가 깎인다.` }; }"""),
]
for o,n in pairs:
    if s.count(o)!=1: print('MISMATCH',s.count(o),o[:120]); sys.exit(1)
for o,n in pairs: s=s.replace(o,n)
open(p,'w',encoding='utf-8').write(s); print('ok')
