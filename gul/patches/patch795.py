# v7.9.5 엔진: 사용자 검수 3건 — ① 코앞의 아군에게는 지휘가 바로 닿음 (확률 · 지연 없음) ② 보이지 않는 상대를 밑도 끝도 없이 쫓지 않음 (추적 한도) ③ 임시 자리 (이동 도착) 는 팀이 멀어지고 교전 소리가 나면 스스로 합류 (명시적 제자리 명령은 그대로) · 동료 외침도 전장 소음을 탐
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    return s.replace(a,b)
h=open(D+'rt3_head.js').read()
h=rep(h,"   v7.9.4: ① 임시 집결","""   v7.9.5: 사용자 검수 — ① 코앞 (2.5칸 안) 의 아군에게는 지휘가 바로 닿음 (확률 · 지연 없음, 0.08초). ② 추적 한도: 보이지 않는 상대를 8초 넘게 · 12칸 넘게 쫓지 않고 포기 (10초 동안 다시 안 쫓음) — 후각 브리핑이 12칸 밖의 적을 알려도 밑도 끝도 없이 따라가지 않게.
           ③ 임시 자리 (이동 명령 도착 뒤 '지키는 자리' = soft post) 는 정지 명령이 아님 — 가까운 동료가 8칸 넘게 멀어지고 (사수 16칸) 교전 소리가 나면, 또는 6초 넘게 14칸 밖이면 스스로 합류 (주인공 · 동료 쪽으로). 명시적 '제자리' 명령 (H) 은 죽을 때까지 그대로.
           ④ 동료의 '저기 있다' 외침도 전장 소음에 묻힘 (명령 전달과 같은 귀). 판에 지휘망 (netL) 을 0.5초마다 계산해 그림으로 보임.
   v7.9.4: ① 임시 집결""")
h=rep(h,"  rally: { t: 12,","  chase: { max: 8, dist: 12, cd: 10 },   // v7.9.5 추적 한도 (초 · 칸) · 포기한 뒤 쉬는 시간\n  rejoin: { near: 8, hero: 14, t: 1.2, idle: 6, ranged: 2 },   // v7.9.5 임시 자리 합류: 가까운 동료가 near 칸 넘게 · 주인공이 hero 칸 넘게 멀고 교전 소리가 나면 t 초 뒤 · 소리가 없어도 idle 초 넘게 멀면 · 사수는 ×ranged\n  rally: { t: 12,")
h=rep(h,"cmdLink: { base: 4,","cmdLink: { near: 2.5, nearT: 0.08, base: 4,")
open(D+'rt3_head.js','w').write(h)
t=open(D+'rt3_tail.js').read()
# ① 코앞
t=rep(t,"  if (C === u || AI6.includes('cmdlink')) return { p: 1, t: 0, via: 'self', why: '', c: C.i };\n  const K = W.rules.cmdLink || {}, a = cmdLink1(W, C, u);",
        "  if (C === u || AI6.includes('cmdlink')) return { p: 1, t: 0, via: 'self', why: '', c: C.i };\n  const K = W.rules.cmdLink || {};\n  if (dist(C, u) <= (K.near != null ? K.near : 2.5) && !(C.koT && W.t < C.koT)) return { p: 1, t: K.nearT != null ? K.nearT : 0.08, via: C.mute ? 'sign' : 'voice', why: '', c: C.i, near: true };   // v7.9.5 코앞은 말 한마디 — 소음 · 맞붙음에도 바로\n  const a = cmdLink1(W, C, u);")
# 지휘망 캐시
t=rep(t,"    const p = !C ? 0 : u === C ? 1 : cmdLink(W, C, u).p; u.net = p;","    const lk0 = !C ? { p: 0, via: 'none' } : u === C ? { p: 1, via: 'self' } : cmdLink(W, C, u), p = lk0.p; u.net = p; u.netL = { p: +p.toFixed(2), via: lk0.via, m: lk0.m != null ? lk0.m : null, m2: lk0.m2 != null ? lk0.m2 : null, t: +(lk0.t || 0).toFixed(2) };   // v7.9.5 지휘망 (판에 그림)")
# 외침 소음
t=rep(t,"      const s = sp.find(b => dist(a, b) <= (C.r || W.rules.hear || 10)); if (!s) continue;","      const s = sp.find(b => dist(a, b) <= Math.min(C.r || W.rules.hear || 10, hearR(W, b, a))); if (!s) continue;   // v7.9.5 전장 소음에 묻힘")
# ② 추적 한도
t=rep(t,"""  if (!see){   // 안 보이면 마지막으로 본 자리로 (적은 냄새 · 총성으로 안 자리 포함)
    const p = u.last; if (!p) return;""","""  if (!see){   // 안 보이면 마지막으로 본 자리로 (적은 냄새 · 총성으로 안 자리 포함)
    const p = u.last; if (!p) return;
    if (!ordered && u.side === 0){   // v7.9.5 추적 한도: 보이지 않는 상대를 밑도 끝도 없이 쫓지 않음
      const CH = W.rules.chase || {}; if (u.chaseB !== t.i || W.t - (u.chaseL || -9) > 1.5){ u.chaseB = t.i; u.chaseT0 = W.t; u.chaseX = { x: u.x, y: u.y }; } u.chaseL = W.t;
      if (W.t - u.chaseT0 > (CH.max || 8) || dist(u, u.chaseX) > (CH.dist || 12)){ u.chaseNo = W.t + (CH.cd || 10); u.chaseB = null; u.target = null; u.state = u.stay ? 'stay' : 'follow'; setMood(W, u, '추적 포기');
        u.lastDec = { t: W.t, s: `${t.name}이(가) 안 보인 채 ${Math.round(W.t - u.chaseT0)}초 · ${dist(u, u.chaseX).toFixed(0)}칸 — 추적을 그만둠` }; L(W, { k: 'chaseEnd', a: u.i, b: t.i, sec: Math.round(W.t - u.chaseT0), d: +dist(u, u.chaseX).toFixed(1), vis: true }); return; } }""")
t=rep(t,"dist(u, f) <= 8 && !(rm !== 'free' && roeBlock(W, u, f))).sort(","dist(u, f) <= 8 && W.t >= (u.chaseNo || 0) && !(rm !== 'free' && roeBlock(W, u, f))).sort(")
t=rep(t,"&& !(u.blind && (isFar(u) || Math.hypot(s.x - u.x, s.y - u.y) > 2.5)) && !(rm !== 'free' && roeBlock(W, u, f))).sort(","&& !(u.blind && (isFar(u) || Math.hypot(s.x - u.x, s.y - u.y) > 2.5)) && W.t >= (u.chaseNo || 0) && !(rm !== 'free' && roeBlock(W, u, f))).sort(")
# ③ 임시 자리 합류 (think, 자동 아군)
t=rep(t,"  const anchor = u.stay || (hero && !u.hero ? hero : u); let lim = u.stay ? R.stayLeash || 4 : R.leash;","""  if (u.stay && !u.hero && !u.crawl && !u.down){   // v7.9.5 임시 자리는 정지 명령이 아님 — 팀이 멀어지고 교전 소리가 나면 스스로 합류 (명시적 제자리 명령은 u.order 라 여기 안 옴)
    const J = R.rejoin || {}, k = isFar(u) ? (J.ranged || 2) : 1, mates = W.units.filter(a => a.alive && a !== u && a.side === 0 && !a.down && !a.crawl);
    if (mates.length){ const nearest = Math.min(...mates.map(a => dist(a, u))), dH = hero && !u.hero ? dist(hero, u) : nearest;
      const noise = (W.eng && W.eng.open) || (W.noises || []).some(n => W.t - n.t0 < 6 && Math.hypot(n.x - u.x, n.y - u.y) < 22);
      const far = nearest > (J.near || 8) * k || dH > (J.hero || 14) * k; u.farT = far ? (u.farT || 0) + 0.2 : 0;
      if ((far && noise && u.farT >= (J.t || 1.2)) || u.farT >= (J.idle || 6) * k){ L(W, { k: 'rejoin', a: u.i, d: +Math.min(nearest, dH).toFixed(1), why: noise ? '교전 소리' : '대열이 멀어짐', vis: true }); u.lastDec = { t: W.t, s: `동료와 ${Math.min(nearest, dH).toFixed(0)}칸 떨어짐${noise ? ' · 교전 소리' : ''} — 지키던 자리를 풀고 합류` }; u.stay = null; u.farT = 0; u.state = hero ? 'follow' : 'explore'; setMood(W, u, '합류'); } } }
  const anchor = u.stay || (hero && !u.hero ? hero : u); let lim = u.stay ? R.stayLeash || 4 : R.leash;""")
open(D+'rt3_tail.js','w').write(t); print('ok')
