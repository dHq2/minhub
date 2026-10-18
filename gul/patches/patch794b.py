import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    return s.replace(a,b)
t=open(D+'rt3_tail.js').read()
# flankSpot 분리
a="""  const anv = W.units.filter(a => a.alive && a !== u && a.side === u.side && !isFar(a) && gap(a, t) < 2), ref = anv.length ?"""
assert t.count(a)==1
t=t.replace("// 명령 '측면 기동': 찍은 적의 옆 · 뒤","""// 망치: 붙들린 상대의 옆 · 뒤로 스스로 돌아 들어감 (명령 없이 — 알아본 만큼만, 틀릴 수 있음)
function hammerStep(W, u, dt){
  const H = W.rules.hm || {}; if (u.order || u.act || u.crawl || isFar(u) || !W.hm || !W.hm.pins.size || (u.role !== '미드필더' && u.role !== '공격수') || u.hp / u.max < 0.4) return false;
  if (W.t < (u.hmCd || 0)) return false;
  let t = u.hmS && W.units[u.hmS.b] && W.units[u.hmS.b].alive && W.hm.pins.has(u.hmS.b) ? W.units[u.hmS.b] : null;
  if (!t){ u.hmS = null; const c = [...W.hm.pins.keys()].map(i => W.units[i]).filter(f => !W.hm.pins.get(f.i).includes(u.i) && dist(u, f) < 9 && canSee(W, u, f) && !roeBlock(W, u, f, 'melee')).sort((a, b) => dist(u, a) - dist(u, b))[0]; if (!c) return false; t = c;
    u.hmS = { b: t.i, t0: W.t, err: hash01(u.i, t.i, Math.floor(W.t / 8)) < (u.vet ? H.errVet || 0.15 : H.err || 0.3) }; if (u.hmS.err) L(W, { k: 'flankMis', a: u.i, b: t.i, vis: false }); }
  if (W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < Math.max(u.rng, f.rng) + 0.3 && (f.target === u || focusOf(W, f) === u))){ u.hmS = null; return false; }   // 나를 노리는 상대가 붙으면 싸움이 먼저
  if (W.t - u.hmS.t0 > 6 || sideOf(W, t, u) !== 'front' && gap(u, t) <= u.rng + 0.6){ u.hmCd = W.t + 3; if (W.t - u.hmS.t0 <= 6){ u.target = t; u.state = 'fight'; } u.hmS = null; return false; }
  const anv = W.units.filter(a => W.hm.pins.get(t.i).includes(a.i)), ref = { x: anv.reduce((s, a) => s + a.x, 0) / anv.length, y: anv.reduce((s, a) => s + a.y, 0) / anv.length };
  let base = Math.atan2(t.y - ref.y, t.x - ref.x); if (u.hmS.err) base += (hash01(u.i, t.i, 17) < 0.5 ? 1 : -1) * 2.2;
  const spot = approachPt(W, u, t, base, [0, 0.5, -0.5, 0.9, -0.9, 1.4, -1.4]) || { x: t.x, y: t.y }, via = arcVia(W, u, t, spot);
  setMood(W, u, '옆으로 돌아 협공', t.i); u.lastDec = { t: W.t, s: `${t.name}가 동료에게 붙들림 — 옆 · 뒤로 돌아 들어감${u.hmS.err ? '' : ''}` }; goTo(W, u, via.x, via.y, dt); return true;
}
// 명령 '측면 기동': 찍은 적의 옆 · 뒤""")
t=rep(t,"  if (u.side === 0 && offStep(W, u, dt)) return;   // v7.9.4 연락 두절 — 마지막 임무로 판단\n","  if (u.side === 0 && offStep(W, u, dt)) return;   // v7.9.4 연락 두절 — 마지막 임무로 판단\n  if (u.side === 0 && hammerStep(W, u, dt)) return;   // v7.9.4 망치 — 붙들린 상대의 옆 · 뒤로\n")
open(D+'rt3_tail.js','w').write(t); print('ok')
