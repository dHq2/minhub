# v7.1 다시: 조준 시간 = 사격 등급 (S·A 는 들자마자) + 무기 (활은 시위) × 익숙함. 쏜 뒤 회복은 v7.0 그대로. 이어 쏘기 · 무기 cyc 는 걷어냄. 화살 더 빠르게
import re
p='rt3_head.js'; s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:90],s.count(a)); s=s.replace(a,b)
for w,c in [("'샷건'","cyc:0.45, "),("'총'","cyc:0.3, "),("'활'","cyc:0.35, "),("'저격총'","cyc:0.9, "),("'소총'","cyc:0.15, ")]:
    assert s.count(c)==1,(c); s=s.replace(c,"")
rep("'샷건':{rng:2.5, ammo:4, loud:true, aim:0.6, vel:220, P:45,", "'샷건':{rng:2.5, ammo:4, loud:true, aim:0.6, vel:220, P:45, draw:0.05,")
rep("'활':{rng:6, ammo:30, aim:0.5, vel:110, P:70,", "'활':{rng:6, ammo:30, aim:0.5, vel:180, P:70, draw:0.15,")
rep("'저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:400, P:130,", "'저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:400, P:130, draw:0.15,")
rep("  alien: { aim: 0.6, wind: 1.4, reload: 1.5, tied: 1.5, skill: 1.15, skillAim: 0.92 },",
    "  alien: { aim: 0.6, wind: 1.4, reload: 1.5, tied: 1.5, skill: 1.15, skillAim: 0.92 },\n  aimG: { S: 0.15, A: 0.2, B: 0.3, C: 0.4, none: 0.55, vet: 0.85 },   // v7.1 조준 시간 (초) = 사격 등급 (S · A 는 들자마자 쏨, 베테랑 ×vet) + 무기의 draw (활 · 저격총 0.15 · 샷건 0.05) × 익숙함")
open(p,'w').write(s)

p='rt3_tail.js'; s=open(p).read()
rep("  const fol = !heal && isFar(u) && followUp(W, u, t), mode = !heal && u.canSweep && !isFar(u) ? swingPlan(W, u, t) : null, wind = (!heal && isFar(u) ? aimT(W, u) * (fol ? fol : 1) : u.wind) * (mode ?",
    "  const mode = !heal && u.canSweep && !isFar(u) ? swingPlan(W, u, t) : null, wind = (!heal && isFar(u) ? aimT(W, u) : u.wind) * (mode ?")
rep("  L(W, { k: 'wind', a: u.i, b: t.i, heal, mode, sm, fol: fol || null, tied:", "  L(W, { k: 'wind', a: u.i, b: t.i, heal, mode, sm, tied:")
rep("    } else if (far && !ordFire(u, t) && (A.arc ? holdArc(W, u, t) : holdFire(W, u, t, false))){ u.lastAim = { b: t.i, t: W.t, x: u.x, y: u.y }; A.phase = 'rec';",
    "    } else if (far && !ordFire(u, t) && (A.arc ? holdArc(W, u, t) : holdFire(W, u, t, false))){ A.phase = 'rec';")
i=s.index("      launch(W, u, t, n > 1 ? wp.burstMul || 0.65 : 1, (SS.aim || 1) * mvA, A.arc, SS.pm || 1); u.lastAim"); j=s.index("\n",i)
s=s[:i]+"      launch(W, u, t, n > 1 ? wp.burstMul || 0.65 : 1, (SS.aim || 1) * mvA, A.arc, SS.pm || 1);"+s[j:]
i=s.index("    A.phase = 'rec'; A.end = W.t + (far ? wCyc(W, u) * (A.sm === 'rapid'"); j=s.index("\n",i)
s=s[:i]+"    A.phase = 'rec'; A.end = W.t + u.rec * (far ? (A.sm === 'rapid' ? ((R.sshot || {}).rapid || {}).rec || 0.7 : 1) : wpnSpd(W, u)); A.t1 = W.t;   // v6.7 단검은 빨리 거둠   // v7.0 속사는 빨리 다음 화살"+s[j:]
i=s.index("// v7.1 발사 간격 = 조준 시간 + 다음 발"); j=s.index("const wpnProf = (W, u, wp) =>",i)
s=s[:i]+"""// v7.1 조준 시간 (들고 쏘기까지) = 사격 등급 (S · A 는 들자마자 쏨 · 베테랑 ×vet) + 무기의 draw (활은 시위) × 익숙함 (제 무기 ×1 · 솜씨는 있으나 다른 종류 × skill · 낯선 무기 × wind). 쏜 뒤 회복 (연사 간격) 은 그대로
const famMul = (W, u) => { const A = W.rules.alien || {}; return u.alien ? A.wind || 1.4 : u.fam2 ? A.skill || 1.15 : 1; };
function aimT(W, u){ const G = W.rules.aimG; if (!G) return u.wind; const m = u.mk0 || 0, g = m >= 0.69 ? G.S : m >= 0.54 ? G.A : m >= 0.39 ? G.B : m >= 0.24 ? G.C : G.none, wp = (W.rules.weapons || {})[u.weapon] || {};
  return (g * (u.vet ? G.vet || 1 : 1) + (wp.draw || 0)) * famMul(W, u); }
"""+s[j:]
open(p,'w').write(s)

p='page10.tpl.html'; s=open(p).read()
rep(" · 조준 ${aimT(Wd, u).toFixed(2)}초 + 다음 발 ${wCyc(Wd, u)}초${u.alien ?", " · 조준 ${aimT(Wd, u).toFixed(2)}초 (들고 쏘기까지) · 쏜 뒤 ${(u.rec || 0).toFixed(2)}초${u.alien ?")
open(p,'w').write(s)
print('ok')
