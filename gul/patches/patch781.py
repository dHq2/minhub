# v7.8.1 엔진 패치: 야영지 제거 · 따로 떠도는 망자 · 지치지 않음
import re,sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D+f).read()
def wr(f,s): open(D+f,'w').write(s)
def rep(s,old,new,cnt=1):
    n=s.count(old)
    if n!=cnt: print('COUNT',n,'!=',cnt,'::',old[:100]); sys.exit(1)
    return s.replace(old,new)
def cut(s,a,b,new=''):
    i=s.find(a); j=s.find(b,i)
    if i<0 or j<0: print('CUT FAIL',a[:60],'|',b[:60]); sys.exit(1)
    return s[:i]+new+s[j:]

# ---------- head ----------
h=rd('rt3_head.js')
i=h.find('  camp: {'); j=h.find('\n',i)
h=h[:i]+"  roam: { pace: [0.4, 0.65], leg: 5, pause: [0.5, 3], pauseP: 0.35, meet: 5, follow: [1.2, 2.2], wait: 3, waitMax: 4, din: 1.2, call: 2.5 },   // v7.8.1 따로 떠도는 망자 (조우 전): 판 위 아무 데나 흩어져 시작 (상대 시야 · 횃불이 보이는 거리 밖) · 저마다 아무 곳 (leg 칸 넘게) 을 골라 제 걸음 × pace 로 떠돎 · 다다르면 pauseP 확률로 pause 초 멈춰 귀 기울임 · 서로 meet 칸 안에서 마주치면 (가리지 않음) 큰 무리 쪽으로 뭉침 (이끄는 몸 뒤 · 옆 follow 칸) · 처진 몸을 wait 칸 넘으면 waitMax 초까지 기다림 · 싸움 소리 (소음 din 넘음) 를 들으면 그쪽으로 · 경보 외침은 call 초 동안 들림 (들리는 거리 안)"+h[j:]
h=rep(h,"  flare: { rng: 7, wind: 0.6, scat: 0.3, scatD: 0.05, brandR: 3, brandT: 40, brandN: 3, gap: 4, grab: 2.2 },","  flare: { rng: 7, wind: 0.6, scat: 0.3, scatD: 0.05 },")
i=h.find('  flare: { rng: 7'); j=h.find('\n',i); line=h[i:j]
k=line.find('//'); h=h[:i]+line[:k]+"// v7.8 횃불 던지기: 든 횃불 (여분이 있으면 여분에 불을 붙여) 을 rng 칸까지 던져 그 둘레를 밝힘 (떨어진 자리 scat + 거리 × scatD 칸 흩어짐) · 던지는 데 wind 초"+h[j:]
h=rep(h,"   v7.8.0: 야영지 (모닥불 · 잠든 적 · 깨어남 · 불빛 밖 초병) · 화광 실명","   v7.8.1: 야영지 없앰 (설정 오류) — 적은 지치지도 잠들지도 않는 망자의 군대: 처음 자리 · 길이 무작위로 흩어져 저마다 떠돌다 마주치면 뭉침 · 경보는 외침이 닿는 데까지 사슬로 · 먼 몸은 싸움 소리를 듣고 옴 · [망자] 지침 · 탈진 · 질주 숨 없음.\n   v7.8.0: (야영지 — v7.8.1 에서 없앰) · 화광 실명")
wr('rt3_head.js',h)

# ---------- mid ----------
m=rd('rt3_mid.js')
m=rep(m,"  if (u.sleep) return false;   // v7.8 잠든 눈은 못 봄\n","")
wr('rt3_mid.js',m)

# ---------- tail ----------
t=rd('rt3_tail.js')
t=rep(t,"patrolStart(W);   // v6.2 조우 전 — 적의 진 · 순찰조 · 초병 자리가 판마다 다름 (배치 칸 미리보기는 놓은 자리 그대로)","patrolStart(W);   // v7.8.1 조우 전 — 망자들이 무작위로 흩어져 저마다 떠돎 (배치 칸 미리보기는 놓은 자리 그대로)")
# 잠 · 깨어남 제거
t=cut(t,"// v7.8 야영지: 잠든 몸이 깨는 조건","// v7.8 횃불 · 장작 던지기")
t=rep(t,"// v7.8 횃불 · 장작 던지기: 저 어둠 속으로 빛을 — 떨어진 자리 둘레가 밝아짐 (양쪽 모두에게)","// v7.8 횃불 던지기: 저 어둠 속으로 빛을 — 떨어진 자리 둘레가 밝아짐 (양쪽 모두에게)")
t=rep(t,"  if (!u.torch && !o.brand){ L(W,","  if (!u.torch){ L(W,")
t=rep(t,"setMood(W, u, o.brand ? '장작을 들고 돌아섬' : '던지려 돌아섬');","setMood(W, u, '던지려 돌아섬');")
t=rep(t,"end: W.t + (F.wind || 0.6) * (o.brand ? 1.3 : 1), px: o.x, py: o.y, brand: !!o.brand, done: end };","end: W.t + (F.wind || 0.6), px: o.x, py: o.y, done: end };")
t=rep(t,"  setMood(W, u, o.brand ? '불붙은 장작을 던짐' : '횃불을 던짐');","  setMood(W, u, '횃불을 던짐');")
t=rep(t,"  if (A.brand){ W.torches.push({ x, y, brand: true, r: F.brandR || 3, until: W.t + (F.brandT || 40) }); W.brandN = (W.brandN || 0) + 1; }\n  else if (u.side === 0 && W.spare > 0)","  if (u.side === 0 && W.spare > 0)")
t=rep(t,"own, brand: !!A.brand, spare: W.spare,","own, spare: W.spare,")
t=cut(t,"// 적: 모닥불 곁의 몸이 보이지 않는 위협","// v7.7 사주경계")
# 사주경계 calm · 암살 경계 앎
t=rep(t,"((u.side === 1 ? !W.alarm1 && u.state !== 'hunt' && u.state !== 'search' : !W.contact0) ? R.calm || 1 : 1)","((u.side === 1 ? !u.woke && u.state !== 'hunt' && u.state !== 'search' : !W.contact0) ? R.calm || 1 : 1)")
t=rep(t,"const know = t.side === 1 ? !!W.alarm1 || t.state === 'hunt'","const know = t.side === 1 ? !!t.woke || t.state === 'hunt'")
t=rep(t,"o.alive && !o.down && !o.sleep && o !== t && o.side === t.side && dist(o, t) <= (A.near || 2.5)","o.alive && !o.down && o !== t && o.side === t.side && dist(o, t) <= (A.near || 2.5)")
t=rep(t,"    if (!t.sleep && ((t.heads || 1) > 1 || sideOf(W, t, a) !== 'back')) return { ok: false, why: '등 뒤가 아님' };   // v7.8 잠든 몸은 어느 쪽에서든","    if ((t.heads || 1) > 1 || sideOf(W, t, a) !== 'back') return { ok: false, why: '등 뒤가 아님' };")
t=rep(t,"sd = t.sleep ? 'back' : sideOf(W, t, u), rch = isFar(u) ? A.knife || 0.35 : u.rng + W.rules.reach * 0.5;   // v7.8 잠든 몸은 곧장 다가감","sd = sideOf(W, t, u), rch = isFar(u) ? A.knife || 0.35 : u.rng + W.rules.reach * 0.5;")
t=rep(t,"let gx = t.sleep ? t.x + (u.x - t.x) / (dist(u, t) || 1) * d0 : t.x - Math.cos(t.face) * d0, gy = t.sleep ? t.y + (u.y - t.y) / (dist(u, t) || 1) * d0 : t.y - Math.sin(t.face) * d0;","let gx = t.x - Math.cos(t.face) * d0, gy = t.y - Math.sin(t.face) * d0;")
i=t.find("  if (t.sleep && t.hp >= 0.5 && real > 0){"); j=t.find('\n',i); t=t[:i]+t[j+1:]
# 처음 본 쪽 로그: 초병 · 순찰 → 무리 크기
t=rep(t,"sentry: !!o.sentry, patrol: !!o.patrol,","grp: roamN(W, o),")
t=rep(t,"sentry: !!u.sentry, patrol: !!u.patrol,","grp: roamN(W, u),",2)
# 견제사격 · 암살조: 지휘관 · 받는 몸이 아직 떠도는 중 (모름) 이면 없음
t=rep(t,"  const C = cmdBoss(W, 1); if (!C) return;\n  const rec = (W.inc || [])","  const C = cmdBoss(W, 1); if (!C || roamIdle(C)) return;   // v7.8.1 떠도는 중인 지휘관은 모름\n  const rec = (W.inc || [])")
t=rep(t,"if (!u.alive || u.down || u.side !== 1 || !suppOK(u) || u.supp || u.suppPend || u.act || W.t < (u.suppCd || 0) || u.shadow || u.lurk) continue;","if (!u.alive || u.down || u.side !== 1 || !suppOK(u) || u.supp || u.suppPend || u.act || W.t < (u.suppCd || 0) || u.shadow || u.lurk || roamIdle(u)) continue;")
t=rep(t,"  const C = cmdBoss(W, 1); if (!C || !W.alarm1 || W.t < (W.shadowNext || 0)) return;","  const C = cmdBoss(W, 1); if (!C || roamIdle(C) || !W.alarm1 || W.t < (W.shadowNext || 0)) return;")
t=rep(t,"u.seenBy || u.supp || u.lurk || u.act || opBusy(W, u)) continue;","u.seenBy || u.supp || u.lurk || u.act || roamIdle(u) || opBusy(W, u)) continue;")
# 작전: 떠도는 중 (경보를 못 들은) 몸은 빼고
t=rep(t,"    const mine = W.units.filter(u => u.alive && !u.crawl && u.side === side), cmd = cmdOf(W, side);","    const mine = W.units.filter(u => u.alive && !u.crawl && u.side === side && !roamIdle(u)), cmd = cmdOf(W, side);   // v7.8.1 아직 떠도는 몸 (경보를 못 들음) 은 작전에 없음")
t=rep(t,"const pactFree = (W, u) => u.alive && !u.crawl && !u.pact && !u.shadow && !u.supp && !u.sleep && !u.pack","const pactFree = (W, u) => u.alive && !u.crawl && !u.pact && !u.shadow && !u.supp && !u.pack")
# act2
t=rep(t,"  if (u.side === 1 && u.brandO){ flareStep(W, u, dt, u.brandO, () => { u.brandO = null; }); return; }   // v7.8 불붙은 장작\n","")
t=rep(t,"  if (u.side === 1 && !u.order && patrolStep(W, u, dt)) return;   // v6.2 조우 전 순찰 · 초병","  if (u.side === 1 && !u.order && patrolStep(W, u, dt)) return;   // v7.8.1 조우 전 떠돎 (홀로 · 무리)")
t=rep(t,"    if (u.rest && W.campFire && u.state === 'idle'){ stop(u); u.fg = Math.atan2(W.campFire.y - u.y, W.campFire.x - u.x); setMood(W, u, '불가에서 쉼'); return; }   // v7.8 불을 보고 쉼 (등은 어둠 쪽)\n","")
t=rep(t," planShadow(W); suppAI(W); brandAI(W); }"," planShadow(W); suppAI(W); roamMeet(W); }")
t=rep(t,"  wakeTick(W, dt); emberTick(W);   // v7.8 잠에서 깸 · 장작이 꺼짐\n","")
# 지침 · 숨: [망자] 는 없음
t=rep(t,"function tire(W, u, k, mul){ const F = FATR(W); if (!F || AI6.includes('fat') || !u.alive) return;","function tire(W, u, k, mul){ const F = FATR(W); if (!F || AI6.includes('fat') || !u.alive || u.undead) return;   // v7.8.1 [망자] 는 지치지 않음\n ")
t=rep(t,"    if (ST){ if (u.sta == null) u.sta = 100;","    if (ST && !u.undead){ if (u.sta == null) u.sta = 100;   // v7.8.1 [망자] 는 숨이 차지 않음\n     ")
t=rep(t,"undying: tr.includes('불사'),","undying: tr.includes('불사'), undead: tr.includes('망자'),")
# 내보내기
t=rep(t,"module.exports = { glareReach, wakeTick, flareStep, brandAI, glareAt,","module.exports = { glareReach, flareStep, roamMeet, roamIdle, roamN, patrolStep, alarmTick, glareAt,")

# ---------- 조우 전: 떠도는 망자 ----------
NEWHEAD = """/* ---------- v7.8.1 조우 전: 따로 떠도는 망자 · 경보 ----------
   처음엔 서로 모름. 적 (망자의 군대) 은 진도 집도 없고 지치지도 잠들지도 않음 — 판 위 아무 데나 흩어져 (상대 시야 · 횃불이 보이는 거리 밖) 저마다 아무 곳으로 떠돎. 자리 · 길 · 멈춰 귀 기울이는 때가 판마다 · 몸마다 다름.
   떠돌다 서로 마주치면 (roam.meet 칸 · 가리지 않음) 큰 무리 쪽으로 뭉쳐 함께 떠돎 — 점점 합을 이룸.
   누가 상대를 처음 보면 소리쳐 경보 — 외침이 닿는 (들리는 거리, 싸움 소리에 줄어듦) 동료만 1초 뒤 그 자리를 알고 움직이고, 들은 쪽도 다시 소리침 (사슬). 상대를 본 몸도 소리침.
   외침이 닿지 않는 먼 몸은 계속 떠돌다 싸움 소리 · 총성을 듣거나 직접 보면 옴. 적의 자리 · 길 · 경보는 로그만 앎 (판 · 이야기에는 우리 눈에 보인 것만) */
"""
t=cut(t,"/* ---------- v6.2 조우 전: 순찰 · 초병 · 경보 ----------","// v7.0 기습할 수 있나",NEWHEAD)

NEWFN = r"""const RM = W => W.rules.roam || {};
const rmR = (W, g, d) => Array.isArray(g) ? g[0] + W.rand() * (g[1] - g[0]) : g != null ? g : d;
const spdB = u => u.spd * (u.spdMul || 1) * (u.injSpd || 1);
function roamIdle(u){ return !!(u && u.roam && u.state === 'idle'); }   // 아직 떠도는 중 (경보를 못 들음 · 상대를 못 봄)
function roamN(W, u){ if (!u.roam) return 1; const r = u.roam.lead != null ? u.roam.lead : u.i; return 1 + W.units.filter(o => o.alive && o.roam && o.roam.lead === r && o !== W.units[r]).length; }
function patrolStart(W){
  const E = W.units.filter(u => u.side === 1), A = W.units.filter(u => u.side === 0); if (!E.length || !A.length) return;
  const m = W.map, ac = centroid(A), far = W.rules.sight * 1.6 + 0.5, R = RM(W), seenAt = (x, y, pad) => A.some(a => Math.hypot(a.x - x, a.y - y) < W.rules.sight + (pad || 0.5)) || A.some(a => a.torch && Math.hypot(a.x - x, a.y - y) < far);   // 횃불이 보이는 거리 (보는 거리 × 1.6) 밖에서 시작
  const placed = [...A], free = (x, y, u, g) => !boxRock(W, x, y, u.r * 0.9) && !placed.some(o => Math.hypot(o.x - x, o.y - y) < o.r + u.r + g);
  for (const u of E){ let p = null;
    for (let k = 0; k < 300 && !p; k++){ const x = 1 + W.rand() * (m.W - 2), y = 1 + W.rand() * (m.H - 2); if (!seenAt(x, y, 1.5) && free(x, y, u, k < 200 ? 0.6 : 0.15)) p = { x, y }; }   // 아무 데나 (우연히 붙어 설 수도)
    if (!p){ let bd = -1; for (let y = 1.5; y < m.H - 1; y += 0.5) for (let x = 1.5; x < m.W - 1; x += 0.5){ if (!free(x, y, u, 0.15)) continue; const d = Math.min(...A.map(a => Math.hypot(a.x - x, a.y - y))); if (d > bd){ bd = d; p = { x, y }; } } }   // 빈자리가 없으면 상대에게서 가장 먼 곳
    p = p || { x: u.x, y: u.y };
    u.x = p.x; u.y = p.y; u.home = { x: p.x, y: p.y }; u.face = u.fg = W.rand() * 6.283; placed.push(u);
    u.roam = { lead: null, wp: null, wpT: 0, pace: rmR(W, R.pace, 0.5), hold: W.rand() < (R.pauseP || 0.35) ? rmR(W, R.pause, 1) : 0, ha: u.face, off: null };
  }
  W.roamOn = true;
  W.start = { k: 'roam', desc: `망자들이 흩어져 저마다 떠돎 — ${E.map(u => u.name + ' ' + dirName(u.x - ac.x, u.y - ac.y) + '쪽 ' + Math.round(dist(u, ac)) + '칸').join(' · ')}` };
  L(W, { k: 'start', side: 1, s: 'roam', desc: W.start.desc, vis: true });
  roamMeet(W, true);   // 처음부터 붙어 선 몸은 한 무리
}
// 마주침: 떠도는 무리 (홀로도 무리) 둘의 몸이 서로 meet 칸 안 · 가리지 않으면 하나로 — 큰 쪽 (같으면 지휘 · 아무쪽) 이 이끎
function roamMeet(W, init){
  if (!W.roamOn || AI6.includes('roam')) return; const R = RM(W);
  const E = W.units.filter(u => u.alive && !u.down && !u.crawl && u.side === 1 && roamIdle(u));
  for (const u of E){ const l = u.roam.lead != null ? W.units[u.roam.lead] : null; if (l && !(l.alive && !l.down && !l.crawl)){ u.roam.lead = null; u.roam.off = null; } }
  const grp = r => E.filter(o => o === r || o.roam.lead === r.i);
  const roots = E.filter(u => u.roam.lead == null);
  for (let i = 0; i < roots.length; i++) for (let j = i + 1; j < roots.length; j++){
    const a = roots[i], b = roots[j]; if (a.roam.lead != null || b.roam.lead != null) continue;
    const ga = grp(a), gb = grp(b);
    if (!ga.some(x => gb.some(y => init ? dist(x, y) < 2.5 : dist(x, y) <= (R.meet || 5) && losClear(W.map, x.x, x.y, y.x, y.y)))) continue;
    const keep = ga.length > gb.length || (ga.length === gb.length && ((a.cmd || 0) > (b.cmd || 0) || ((a.cmd || 0) === (b.cmd || 0) && W.rand() < 0.5))) ? a : b, go = keep === a ? b : a, gg = keep === a ? gb : ga;
    for (const o of gg){ o.roam.lead = keep.i; o.roam.off = null; }
    if (!init) L(W, { k: 'roamJoin', a: go.i, b: keep.i, n: grp(keep).length, vis: !!go.seenBy || !!keep.seenBy });
  }
}
function roamWp(W, u){
  const m = W.map, R = RM(W); let p = null;
  for (let k = 0; k < 40 && !p; k++){ const x = 1.5 + W.rand() * (m.W - 3), y = 1.5 + W.rand() * (m.H - 3); if (Math.hypot(x - u.x, y - u.y) < (k < 30 ? R.leg || 5 : 1.5) || boxRock(W, x, y, u.r + 0.2)) continue; p = { x, y }; }
  u.roam.wp = p || { x: m.W / 2, y: m.H / 2 };
  u.roam.wpT = W.t + Math.hypot(u.roam.wp.x - u.x, u.roam.wp.y - u.y) / Math.max(0.3, spdB(u) * u.roam.pace * 0.5) + 6;   // 막혀 못 가면 다시 고름
}
// 조우 전 움직임: 홀로 (또는 무리를 이끌며) 아무 곳으로 떠돌고 · 가끔 멈춰 귀 기울임 · 무리는 이끄는 몸 뒤 · 옆을 따름. 상대를 보거나 경보 · 총성 · 싸움 소리를 들으면 그만
function patrolStep(W, u, dt){
  if (!u.roam) return false;
  if (u.state === 'hunt' || u.state === 'fight' || u.state === 'search' || u.crawl || u.down){ u.woke = true; u.roam.lead = null; return false; }
  if (u.state === 'return') u.state = 'idle';   // 찾다 놓치면 그 자리에서 다시 떠돎
  const R = RM(W); u.home.x = u.x; u.home.y = u.y;
  if (W.rules.din && !AI6.includes('din') && W.t - (u.roam.dinT == null ? -9 : u.roam.dinT) >= 0.5){ u.roam.dinT = W.t;   // 싸움 소리가 들리면 그쪽으로 (총성은 fire)
    if (dinAt(W, u.x, u.y) > (R.din || 1.2)){ const H = (W.rules.din.half || 2) * 2, ev = (W.dinEv || []).filter(e => W.t - e.t < H).sort((a, b) => b.v / (1 + Math.hypot(b.x - u.x, b.y - u.y)) - a.v / (1 + Math.hypot(a.x - u.x, a.y - u.y)))[0];
      if (ev){ u.state = 'search'; u.last = { x: ev.x, y: ev.y }; u.searchT = 8; u.woke = true; u.roam.lead = null; L(W, { k: 'roamHear', a: u.i, x: +ev.x.toFixed(1), y: +ev.y.toFixed(1), d: +Math.hypot(ev.x - u.x, ev.y - u.y).toFixed(1), vis: !!u.seenBy }); return false; } } }
  const l = u.roam.lead != null ? W.units[u.roam.lead] : null;
  if (l && l.alive && !l.down && !l.crawl){   // 무리: 이끄는 몸 뒤 · 옆 아무 자리
    if (!u.roam.off) u.roam.off = { a: Math.PI + (W.rand() - 0.5) * 2.4, d: rmR(W, R.follow, 1.6) };
    const fa = l.face + u.roam.off.a; let gx = Math.max(1, Math.min(W.map.W - 1, l.x + Math.cos(fa) * u.roam.off.d)), gy = Math.max(1, Math.min(W.map.H - 1, l.y + Math.sin(fa) * u.roam.off.d));
    if (boxRock(W, gx, gy, u.r * 0.9)){ gx = l.x; gy = l.y; }
    const d = Math.hypot(gx - u.x, gy - u.y);
    if (d > (u.roam.mv ? 0.25 : 0.7)){ u.roam.mv = true; setGoal(W, u, gx, gy); follow(W, u, dt, d > 2 ? 1 : Math.min(1, u.roam.pace + 0.25)); }
    else { u.roam.mv = false; stop(u); u.fg = l.face + Math.sin(W.t * 0.5 + u.i * 1.7) * 1.6; }   // 서면 둘레를 살핌
    setMood(W, u, '떠돎 (무리)'); return true; }
  if (u.roam.lead != null){ u.roam.lead = null; u.roam.off = null; }
  if (W.t < u.roam.hold){ stop(u); u.fg = u.roam.ha + Math.sin(W.t * 0.7 + u.i) * 1.4; setMood(W, u, '멈춰 귀 기울임'); return true; }
  if (!u.roam.wp || Math.hypot(u.roam.wp.x - u.x, u.roam.wp.y - u.y) < 0.8 || W.t > u.roam.wpT){
    if (u.roam.wp && W.rand() < (R.pauseP || 0.35)){ u.roam.hold = W.t + rmR(W, R.pause, 1); u.roam.ha = u.face; u.roam.wp = null; stop(u); return true; }
    roamWp(W, u); }
  const mem = W.units.filter(o => o.alive && o.roam && o.roam.lead === u.i && o.state === 'idle' && !o.down && !o.crawl);
  const lag = mem.some(o => dist(o, u) > (R.wait || 3));
  if (lag && (u.roam.waitT = (u.roam.waitT || 0) + dt) < (R.waitMax || 4)){ stop(u); setMood(W, u, '처진 몸을 기다림'); return true; }
  if (!lag) u.roam.waitT = 0;
  const k = Math.max(0.2, Math.min(1, u.roam.pace * Math.min(spdB(u), ...mem.map(spdB)) / Math.max(0.1, spdB(u))));
  setGoal(W, u, u.roam.wp.x, u.roam.wp.y); follow(W, u, dt, k);
  if (!u.path || !u.path.length) u.roam.wpT = Math.min(u.roam.wpT, W.t + 0.5);
  setMood(W, u, mem.length ? '떠돎 (무리를 이끎)' : '떠돎'); return true;
}
// 경보: 처음 본 쪽이 소리침 → 외침이 닿는 (들리는 거리 · 싸움 소리에 줄어듦) 동료만 1초 뒤 그 자리를 알고 찾아 움직이고, 들은 쪽도 소리쳐 다음으로 (사슬). 상대를 본 몸도 소리침. 외침은 roam.call 초 동안만 들림
function alarmTick(W){
  const A1 = W.alarm1; if (!A1) return;
  const C = A1.calls || (A1.calls = [{ i: A1.by, px: W.units[A1.by].x, py: W.units[A1.by].y, x: A1.x, y: A1.y, b: A1.b, t: A1.t }]), cw = RM(W).call || 2.5;
  for (const e of W.units) if (e.alive && e.side === 1 && e.state === 'hunt' && !C.some(c => c.i === e.i)){ const f = W.units.filter(o => o.alive && o.side !== 1 && e.sense[o.i] && W.t - e.sense[o.i].t < 1).sort((p, q) => dist(e, p) - dist(e, q))[0]; e.woke = true; C.push({ i: e.i, px: e.x, py: e.y, x: f ? e.sense[f.i].x : A1.x, y: f ? e.sense[f.i].y : A1.y, b: f ? f.i : A1.b, t: W.t }); }
  const n = [];
  for (const e of W.units){ if (!e.alive || e.side !== 1 || e.state === 'hunt' || e.state === 'fight' || C.some(c => c.i === e.i)) continue;
    const c = C.find(c => W.t - c.t >= 1 && W.t - c.t < 1 + cw && Math.hypot(c.px - e.x, c.py - e.y) <= hearR(W, { x: c.px, y: c.py }, e)); if (!c) continue;
    e.state = 'search'; e.last = { x: c.x, y: c.y }; e.searchT = 8; e.sense[c.b] = { x: c.x, y: c.y, t: W.t, exact: false, call: true }; e.woke = true; if (e.roam){ e.roam.lead = null; }
    C.push({ i: e.i, px: e.x, py: e.y, x: c.x, y: c.y, b: c.b, t: W.t }); n.push(e.i); }
  if (n.length || (!A1.spread && W.t - A1.t >= 1)){ A1.spread = true; L(W, { k: 'alarm', side: 1, a: A1.by, b: A1.b, n, left: W.units.filter(e => e.alive && e.side === 1 && roamIdle(e)).map(e => e.i), vis: true }); }
}
"""
t=cut(t,"function patrolStart(W){","\n/* ---------- v6.1 적의 전술",NEWFN)
wr('rt3_tail.js',t)
print('ok')
