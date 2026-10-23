# v8.7.9 엔진 — patch8790.py v1.3 (v1.3: 도감 C-215 맞춤 — 각펄 (보스사양): 시작 패턴은 아주 넓은 횡베기 (그 전엔 다른 기술 없이 천천히 다가옴) · 둘러싸이면 횡베기를 마구 (대기 13 → 8) · 찌르기는 연속 찌르기 (세 번) · 공중 투창 (창비) 은 2초쯤 뒤 창이 쏟아짐 (10개 · 촘촘히) · 초대형 치명타도 2초 뒤 / 동료 펄 = 신나펄 (명세 '열화판 · 특수창 없음 · 발랄' = 도감): 투창은 평범 (보통 창 투창) · 신나는 공중 투창 (일반 창 셋이 비스듬히) · 신나는 포탄 (몸째 날아감) · 신나는 횡베기 · 꼬깃꼬깃 착지 (= 신나는 처형) — 기술 칸 1 신나는 공중 투창 · 2 신나는 포탄 / 동료 각 몸은 각펄 성능 그대로 — 받는 피해 × 0.33 (카리우스 [불경자] 에서 빌린 것) · 피가 멎음 · 피를 흘리지 않음 거둠 (3D pearlgak · 도감 · 카리우스 [불경자] 에 없음 · 적 각펄과 같은 몸) · v1.2: 각펄 싸움은 물러날 수 없음 (W.noRetreat) · 동료 펄 기술 칸 — 철 깃털 · 꼬깃꼬깃 착지 (대표 둘) · 돌려차기 · 움츠리기 명령 (기술표와 같은 몸 · 같은 대기 — 움츠리기는 pearlWrapGo 하나) · v1.1: 펄의 창은 보통 투창처럼 던지지 않음 (noThr — 정면 투창 (열화) 은 무기 기술) · 만남의 각펄 (spare8) 은 숨이 끊길 일격에도 체력 1 로 쓰러지기만 함 (판이 끝나면 영입 · 죽임) · v1.0: 펄 · 각펄 (명세 E · 도감 C-215 · 3D h2.js pearlgak · pearl · h2_roster 기술표 글) —
#   3D 기술표 틀 (h2) 을 넓힘: 제자리 줄 (thrust · beam) · 투창 (shot — 줄로 날아감 · 관통 · 방패에 박히면 멈춤 · 던지는 순간 조금 고쳐 겨눔) · 도약 (leap — 예고 줄 → 날아올라 (공중 — 바닥 공격이 닿지 않음) → 내려앉는 원: 두 번 맞음) ·
#   덫 · 장판 (trap · zone — 늦게 닫히는 원 · 꿰뚫림 · 높이 날아올라 던지는 것은 그동안 공중) · 연계 (combo — 차례로 · 표적이 쓰러지면 끝) · 뽑을 때 돌림 (twirl) · 기술표마다 기본 일격 이름 · 기술표를 둘 (보스 · 동료 기술) 지닐 수 있음 (via)
#   각펄 기술표 (3D pearlgak 13 + 명세 E): 찍고 빼기 · 정면 투창 · 도약 찍기 · 스텝 찌르기 · 3연속 베기 · 솟는 거대 창 · 공중 투창 (창비) · 반경 10m 횡베기 (명세: 2번 · 2페이즈 3번) · 정면 처형 (명세: 빠르게 뒤로 → 온몸으로) ·
#     창 대포 (명세: 매우 긴 찌르기 · 뽑을 때 돌림) · 날아 투창 (방벽 무시) · 초대형 치명타 (높이 날아올라) · 처형 내리꽂기 (뒤로 → 날아올라 꼬치) — 2페이즈 50% · ◆끝까지 (쓰러질 일격을 한 번 체력 1 로 버팀 — 3D 구현) · 천천히 걸어 다님 (명세)
#   동료 펄 (명세 E — 평소엔 열화판 일반 펄 · 빈사에선 각펄): 평소 = 보통 두뇌 + 3D 기술표 글의 펄 기술 (철 깃털 · 꼬깃꼬깃 착지 · 돌려차기 · 움츠리기) 를 3D 동료처럼 섞어 씀 ·
#     빈사 (15%) 에 각펄 (각펄 기술표 · 두뇌 · 공격 × 1.8 · 걸음 × 1.25 · ◆끝까지 한 번) · 50% 를 넘으면 돌아옴 (카리우스 [불경자] 처럼)
#   ◆타천 날개 (3D 패시브 — 떨어져도 다치지 않음): 옥상 낙사 없음 (페이지) · 펄의 창 (각펄의 무기 — 죽이면 떨어짐 · 투창 열화 '정면 투창 (열화)' 를 줌 — 각혈의 장검처럼))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8780d.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
def between(a, z, b):   # a 부터 z 앞까지를 b 로 (한 곳)
    hits = [(k, v.find(a)) for k, v in P.items() if v.count(a) == 1]
    assert len(hits) == 1, ('between start', a[:80])
    k, i = hits[0]; j = P[k].find(z, i + len(a)); assert j > i, ('between end', z[:80])
    P[k] = P[k][:i] + b + P[k][j:]

# ---------- 수치표 ----------
rep("  karius: { grit:", """  pearl: { gak: { at: 0.15, off: 0.5, atk: 1.8, spd: 1.25, def: 1 }, wrap: { t: 2, k: 0.4, cd: 10 } },   /* v8.7.9 펄 — 빈사 (at) 에 각펄 (명세: 카리우스 [불경자] 처럼 변함) · off 를 넘으면 돌아옴 · 공격 × atk · 걸음 × spd (각펄 성능 — 적 각펄과 같은 몸) · 받는 피해 × def (1 — 각펄엔 피해 줄임이 없음 · v1.3) / 움츠리기 (3D 기술표 글: 날개로 몸을 감싸 2초 받는 피해 60% 감소) */
  karius: { grit:""")
rep("    pmark: { cd: 12, rng: 9 },",
    "    pthrow: { rng: 12, min: 3, len: 12, w: 0.5, mul: 3.0, kb: 2.0, pm: 1.8, track: 0.1, wind: 0.45, cd: 8, weak: 0.6 },   /* v8.7.9 펄의 창 — 정면 투창 (열화): 각펄의 정면 투창 × weak */\n"
    "    pmark: { cd: 12, rng: 9 },")
rep("'어퐁의 철퇴':{rng:0.6, kind:'둔기'}", "'어퐁의 철퇴':{rng:0.6, kind:'둔기'}, '펄의 창':{rng:1.8, kind:'날붙이', two:true, spec:'pthrow', specName:'정면 투창 (열화)'}")   # v8.7.9 각펄의 검은 창 (긴 창 · 두 손 · 각혈의 장검처럼 열화 기술)

# ---------- 3D 기술표: 각펄 · 펄 ----------
rep("const H2KB = 0.5;   // 3D 밀침 → 이 판의 밀치는 힘",
"""/* v8.7.9 각펄 (3D h2.js pearlgak — 보스 · 도약하며 뛰어다니는 투창 극딜러 · 기술을 끝까지 다 씀) + 명세 E (천천히 걸어 다니다 · 매우 긴 찌르기 — 뽑을 때도 돌림 · 넓은 원 2 · 3번 · 빠르게 뒤로 가서 온몸으로 처형 — 둘 다 치명)
   + 도감 C-215 보스사양 (v1.3): 찌르기가 연속 찌르기로 · 횡베기가 아주 넓어지며 이게 시작 패턴 (open) · 연속으로 횡베기를 마구 (crowd — 둘레 6칸에 둘 이상이면 먼저 · 대기 8) · 공중 투창은 2초쯤 뒤 하늘에서 창이 쏟아짐 · 거대한 특수 창도 2초쯤 뒤
   수치는 3D 그대로 (거리 1m = 1칸 · 배율 · 대기 · 예고) · 3D 가 정하지 않은 것: 횡베기 둘째 · 셋째는 × 0.8 · 예고 0.35 · 처형 앞 뒤로 2.5칸 (그만큼 길게) · 처형 둘의 치명 +35% · 창 대포 뒤 돌림 (반지름 2.2 · × 0.6) ·
   연속 찌르기 (세 번 × 0.6 — 한 번 1.6 보다 조금 셈 · 마지막만 밀침 · 대기 1.6: 세 번 찌르는 데 1초쯤 걸려 3D 의 한 번 찌르기 (대기 1.1) 와 같은 틈을 남김 — 그 틈에 기술을 고름) · 창비 (10개 × 0.6 · 0.08초 간격 — 3D 6 × 1.0 과 같은 몫을 촘촘히) */
H2K.pearlgak = { ml: { n: '연속 찌르기', range: 2.4, mul: 0.6, wind: 0.26, wind2: 0.1, rep: 3, gap: 0.14, w: 0.9, cd: 1.6, arc: 1.4, kb: 1.8 }, stalk: 0.55, last: true, cycle: true, open: 'wide', crowd: { id: 'wide', n: 2 },
  sk: [{ id: 'stab', n: '찍고 빼기', type: 'thrust', cd: 3, use: 2.6, len: 2.6, w: 0.9, mul: 1.3, wind: 0.25 },
    { id: 'throw', n: '정면 투창', type: 'shot', cd: 4, use: 15, min: 2, len: 15, w: 0.5, mul: 3.0, kb: 2.0, pm: 1.8, track: 0.12, wind: 0.45, pierce: true },
    { id: 'pounce', n: '도약 찍기', type: 'leap', cd: 4, use: 8, min: 3, len: 8, r: 1.8, mul: 1.0, mul2: 2.2, wind: 0.5 },
    { id: 'step', n: '스텝 찌르기', type: 'dash', cd: 6, use: 5, len: 4.5, w: 1.1, mul: 1.4, wind: 0.25 },
    { id: 'triple', n: '3연속 베기', type: 'combo', cd: 9, use: 3, gap: 0.35, sub: [{ type: 'slash', r: 2.6, arc: 2.4, mul: 0.8, wind: 0.2 }, { type: 'slash', r: 2.6, arc: 2.4, mul: 0.8, wind: 0.15 }, { type: 'slash', r: 2.8, arc: 3.0, mul: 1.1, wind: 0.15 }] },
    { id: 'pillar', n: '솟는 거대 창', type: 'trap', cd: 10, use: 10, r: 1.8, delay: 1.1, mul: 1.6, stun: 1.2, tag: '솟는 거대 창에 꿰뚫림', wk: '날붙이', up: true },
    { id: 'sky', n: '공중 투창 (창비)', type: 'rain', cd: 11, use: 13, cnt: 10, r: 1.3, spread: 4, mul: 0.6, delay: 2.0, gap: 0.08, wk: '날붙이' },
    { id: 'wide', n: '반경 10m 횡베기', type: 'combo', cd: 8, use: 5, gap: 0.3, sub: [{ type: 'slash', r: 6, arc: 6.3, mul: 1.2, wind: 0.9 }, { type: 'slash', r: 6, arc: 6.3, mul: 0.8, wind: 0.35 }, { type: 'slash', r: 6, arc: 6.3, mul: 0.8, wind: 0.35, ph: 2 }] },
    { id: 'exec', n: '정면 처형', type: 'combo', cd: 10, use: 9, gap: 0.12, sub: [{ type: 'backstep', len: 2.5 }, { type: 'dash', len: 11.5, w: 1.2, mul: 1.8, trip: true, wind: 0.3, heavyCrit: 0.35 }] },
    { id: 'cannon', n: '창 대포', type: 'thrust', cd: 12, use: 12, len: 12, w: 1.2, mul: 2.2, kb: 1.2, wind: 0.9, twirl: { r: 2.2, mul: 0.6, gap: 0.25 } },
    { id: 'fly', n: '날아 투창', type: 'leap', ph: 2, cd: 12, use: 9, min: 2, len: 9, r: 2.2, mul: 0.6, mul2: 1.6, wind: 0.5, over: true },
    { id: 'big', n: '초대형 치명타', type: 'zone', ph: 2, cd: 18, use: 14, r: 3.6, delay: 2.0, mul: 2.6, wk: '날붙이', air: true },
    { id: 'plunge', n: '처형 내리꽂기', type: 'combo', ph: 2, cd: 14, use: 7, gap: 0.12, sub: [{ type: 'backstep', len: 2.5 }, { type: 'leap', len: 9.5, r: 2.4, mul: 0.6, mul2: 2.0, wind: 0.35, heavyCrit: 0.35 }] }],
  phase: { at: 0.5, k: 1.15, spd: 1.15, say: '(검은 날개가 찢어지듯 펼쳐진다)' } };
/* v8.7.9 동료 펄 = 신나펄 (명세 E: 평소엔 열화판 일반 펄 · 특수창 없음 · 발랄 / 도감 C-215 신나펄: 투창은 평범 · 공중 투창은 일반 창이 비스듬히 꽂힘 · 처형도 그냥 신나는 모션 · 횡베기 (느와르 없음) · 포탄도 신나게 날아감)
   v1.3: 신나는 공중 투창 · 신나는 포탄 · 신나는 횡베기 (각펄 기술의 열화 — 수치는 각펄의 창비 · 정면 처형 · 횡베기에서 줄임: 뒤로 빠지기 · 치명 · 넘어뜨림 없음) · 투창 = 보통 창 투창 (무기 '창') · 신나는 처형 = 꼬깃꼬깃 착지 (3D 기술표 글: 날아올랐다 내려찍기)
   + 3D 기술표 글 (h2_roster pearl kit) 의 철 깃털 (강철 깃털 부채꼴 · 8m · 출혈) · 꼬깃꼬깃 착지 (둘레 2m) · 움츠리기 + 3D 돌려차기 — 수치는 3D 구현 · 차례: 가까운 것부터 (기술표 차례대로 쓸 수 있는 첫 것) */
H2K.pearl = { sk: [{ id: 'kick', n: '돌려차기', type: 'slash', cd: 6, use: 1.9, r: 1.9, arc: 2.0, mul: 1.0, kb: 2.4, wind: 0.35 },
    { id: 'pwide', n: '신나는 횡베기', type: 'slash', cd: 8, use: 2.6, r: 3, arc: 6.3, mul: 1.0, wind: 0.45 },
    { id: 'feather', n: '철 깃털', type: 'shot', cd: 6, use: 8, min: 2, len: 8, w: 0.3, cnt: 5, spread: 0.12, mul: 0.6, wind: 0.4, sts: 'bleed', far: true },
    { id: 'pball', n: '신나는 포탄', type: 'dash', cd: 9, use: 8, min: 2.5, len: 8, w: 1.0, mul: 1.2, wind: 0.35 },
    { id: 'land', n: '꼬깃꼬깃 착지', type: 'leap', cd: 8, use: 5, min: 2, len: 5, r: 2, mul: 0.6, mul2: 1.3, wind: 0.4 },
    { id: 'psky', n: '신나는 공중 투창', type: 'rain', cd: 10, use: 12, min: 3, cnt: 3, r: 1.1, spread: 2.2, mul: 0.6, delay: 1.2, gap: 0.25, wk: '날붙이', diag: true }] };
const H2KB = 0.5;   // 3D 밀침 → 이 판의 밀치는 힘""")
rep("const h2Kit = u => (u && u.h2 && H2K[u.h2.k]) || null;",
    "const h2Of = (u, via) => (u && u[via || 'h2']) || null;   /* v8.7.9 기술표 둘 (h2 = 보스 · 각펄 / pk = 동료 펄 기술 / pw = 무기 기술) */\n"
    "const h2Kit = (u, via) => { const H = h2Of(u, via); return (H && H2K[H.k]) || null; };")
rep("const h2Ml = K => ({ id: 'ml', n: '할퀴기', type: 'slash',", "const h2Ml = K => K.ml.rep > 1 ? { id: 'ml', n: K.ml.n, type: 'combo', cd: K.ml.cd, gap: K.ml.gap || 0.14, sub: Array.from({ length: K.ml.rep }, (_, i) => ({ type: 'thrust', len: K.ml.range, w: K.ml.w || 0.9, mul: K.ml.mul, wind: i ? K.ml.wind2 || 0.1 : K.ml.wind, kb: i === K.ml.rep - 1 ? K.ml.kb : 0 })) } : ({ id: 'ml', n: K.ml.n || '할퀴기', type: 'slash',")   # v8.7.9 기본 일격 이름 · v1.3 연속 찌르기 (도감: 각펄은 찌르기가 연속 찌르기로 — 제자리 줄 셋)

# h2Pick · h2Cast · resolveH2 — 새 갈래 (via · 줄 · 투창 · 도약 · 덫 · 연계 · 돌림)
between("// 쓸 기술 (3D h2Pick):", "// 몸이 그 쪽으로 len 까지", """// 쓸 기술 (3D h2Pick): 차례대로 — 대기 중 · 2페이즈 기술은 건너뜀 · 어슬렁 포위는 몸에 바싹 붙은 상대에게만 · 나머지는 거리 (몸 가운데끼리) 가 use 안 (min 밖)
function h2Pick(W, u, t, d, via){
  const K = h2Kit(u, via), H = h2Of(u, via); if (!K) return null; let best = null;
  const rdy = s => W.t >= (H.cd[s.id] != null ? H.cd[s.id] : -9) && !(s.ph && !H.ph);
  if (K.open && !(H.used || {})[K.open]){ const o = K.sk.find(x => x.id === K.open); return o && rdy(o) && d <= o.use ? o : null; }   /* v8.7.9 도감: 시작 패턴 (각펄 — 아주 넓은 횡베기) · 그 전엔 다른 기술 없이 다가감 */
  if (K.crowd){ const c = K.sk.find(x => x.id === K.crowd.id), r = c && (c.sub ? c.sub[0].r : c.r); if (c && rdy(c) && W.units.filter(e => h2Hittable(u, e) && dist(u, e) < r + e.r * 0.6).length >= K.crowd.n) return c; }   /* 도감: 연속으로 횡베기를 마구 — 둘레에 둘 이상이면 먼저 */
  for (const s of K.sk){
    if (W.t < (H.cd[s.id] != null ? H.cd[s.id] : -9)) continue;
    if (s.ph && !H.ph) continue;
    if (s.type === 'backstep'){ if (gap(u, t) < 0.3) return s; continue; }
    if (!(d <= s.use && d >= (s.min || 0))) continue;
    if (!K.cycle) return s;
    if (!best || (H.used || {})[s.id] == null && (H.used || {})[best.id] != null || ((H.used || {})[s.id] || 0) < ((H.used || {})[best.id] || 0)) best = s;   /* v8.7.9 기술을 끝까지 다 씀 (각펄 · 3D 패시브 '끝까지'): 쓸 수 있는 것 가운데 가장 오래 안 쓴 것부터 */
  }
  return best;
}
""")
between("function h2Cast(W, u, s, t){", "// 예고가 끝남:", """function h2Cast(W, u, s, t, via){
  const H = h2Of(u, via); if (!H || !t) return false;
  const d = dist(u, t), ang = Math.atan2(t.y - u.y, t.x - u.x), ml = s.id === 'ml', vis = u.side === 0 || !!u.seenBy, cmb = s.cmb || null;
  if (ml) H.mlT = W.t + s.cd; else if (!s.sub0){ H.cd[s.id] = W.t + s.cd; (H.used || (H.used = {}))[s.id] = W.t; if (via === 'pk'){ const sx = (u.spec || []).find(x => PK_SPEC[x.k] === s.id); if (sx) sx.cdT = H.cd[s.id]; } }   /* v8.7.9 동료 펄 기술 칸 대기 = 기술표 대기 */
  stop(u); u.waitT = 0; u.fg = u.face = ang; u.target = t; u.state = u.side ? 'hunt' : 'fight';
  if (!ml && !s.sub0) L(W, { k: 'h2', a: u.i, b: t.i, s: s.id, n: s.n, say: s.say || null, vis });
  if (W.fxOn && s.say) W.fx.push({ k: 'say', a: u.i, s: s.say, t0: W.t });
  setMood(W, u, s.n, t.i);
  if (s.type === 'combo'){ const subs = (s.sub || []).filter(x => !x.ph || H.ph); return h2Sub(W, u, s, subs, 0, t, via); }   /* v8.7.9 연계: 차례로 */
  if (s.type === 'backstep'){   // 3D: 상대에게서 len 물러남 (보스는 잔상으로 곧장)
    const a = Math.atan2(u.y - t.y, u.x - t.x), k = h2Reach(W, u, u.x, u.y, a, s.len); h2Ghost(W, u, u.x + Math.cos(a) * k, u.y + Math.sin(a) * k);
    u.act = { k: 'h2', s: s.id, n: s.n, type: s.type, b: t.i, phase: 'rec', t0: W.t, end: W.t + 0.35, via, cmb };
    L(W, { k: 'h2Step', a: u.i, b: t.i, n: s.n, d: +k.toFixed(1), vis }); return true; }
  if (s.type === 'rain'){   // 3D: 표적 자리에 하나 · 나머지는 그 둘레 spread 안 아무 데 — gap 초마다 하나씩 생기고 delay 초 뒤에 떨어짐
    const Z = W.h2z || (W.h2z = []), m = W.map;
    for (let i = 0; i < s.cnt; i++){ const x = i ? t.x + (W.rand() * 2 - 1) * s.spread : t.x, y = i ? t.y + (W.rand() * 2 - 1) * s.spread : t.y;
      Z.push({ by: u.i, side: u.side, x: Math.max(0.5, Math.min(m.W - 0.5, x)), y: Math.max(0.5, Math.min(m.H - 0.5, y)), r: s.r, t0: W.t + i * (s.gap || 0.22), at: W.t + i * (s.gap || 0.22) + (s.delay || 0.9), mul: s.mul, n: s.n, stun: s.stun || 0, wk: s.wk || null, tag: s.tag || null, diag: !!s.diag }); }
    u.act = { k: 'h2', s: s.id, n: s.n, type: s.type, b: t.i, phase: 'rec', t0: W.t, end: W.t + 0.6, via, cmb }; return true; }
  if (s.type === 'trap' || s.type === 'zone'){   /* v8.7.9 3D 덫 · 장판: 표적 발밑에 늦게 닫히는 원 (덫은 땅에서 솟음 — 위에서 떨어지지 않음) */
    const Z = W.h2z || (W.h2z = []), m = W.map, x = Math.max(0.5, Math.min(m.W - 0.5, t.x)), y = Math.max(0.5, Math.min(m.H - 0.5, t.y));
    Z.push({ by: u.i, side: u.side, x, y, r: s.r, t0: W.t, at: W.t + (s.delay || 1), mul: s.mul, n: s.n, stun: s.stun || 0, wk: s.wk || null, tag: s.tag || null, up: !!s.up, trap: s.type === 'trap' });
    if (s.air){ u.act = { k: 'leap', phase: 'run', air: true, t0: W.t, end: W.t + (s.delay || 1) + 0.15, fx: u.x, fy: u.y, tx: u.x, ty: u.y, dir: 'up', b: t.i, h2up: { n: s.n, via, cmb } }; L(W, { k: 'h2Up', a: u.i, n: s.n, vis }); }   // 높이 날아올라 던짐 — 그동안 공중 (바닥 공격이 닿지 않음)
    else u.act = { k: 'h2', s: s.id, n: s.n, type: s.type, b: t.i, phase: 'rec', t0: W.t, end: W.t + 0.5, via, cmb };
    return true; }
  // 모양 (몸 가운데부터): 돌진 · 도약 = 표적 바로 뒤까지의 줄 · 찌르기 · 대포 = 제자리 줄 · 투창 = 긴 줄 · 나머지 = 부채꼴
  const Z = s.type === 'dash' || s.type === 'leap' ? { sh: 'line', x: u.x, y: u.y, ang, len: Math.min(s.len, d + 0.6), w: s.w || 1.1 }
    : s.type === 'thrust' || s.type === 'beam' ? { sh: 'line', x: u.x, y: u.y, ang, len: s.len, w: s.w || 0.9 }
    : s.type === 'shot' ? { sh: 'line', x: u.x, y: u.y, ang, len: s.len || s.use || 10, w: (s.w || 0.5) + (s.cnt > 1 ? Math.tan((s.spread || 0.12) * (s.cnt - 1) / 2) * (s.len || 8) : 0) }
    : { sh: 'fan', x: u.x, y: u.y, ang, r: s.r, arc: s.arc };
  const wind = s.wind != null ? s.wind : 0.5;
  u.act = { k: 'h2', s: s.id, n: s.n, type: s.type, b: t.i, phase: 'wind', t0: W.t, end: W.t + wind, Z, mul: s.mul, stun: s.stun || 0, trip: !!s.trip, kb: s.kb || 0, sk: s, via, cmb };
  L(W, { k: 'wind', a: u.i, b: t.i, h2: s.id, spec: 'h2', w: s.n, end: +(W.t + wind).toFixed(2), why: '', hid: u.side === 1 && !u.seenBy });
  return true;
}
// v8.7.9 연계의 i 번째 (그때 표적 쪽으로 다시 겨눔) · 다음 것 (표적이 쓰러졌으면 끝)
function h2Sub(W, u, s, subs, i, t, via){ const x = subs[i]; if (!x || !t || !t.alive){ u.act = null; return false; } return h2Cast(W, u, { id: s.id + '_' + i, n: x.n || s.n, cd: 0, use: 99, ...x, sub0: true, cmb: { s, subs, i, via, gap: s.gap != null ? s.gap : 0.35 } }, t, via); }
function h2Next(W, u, A){ const C = A && A.cmb; if (!C || !u.alive || C.i + 1 >= C.subs.length) return false; const t = A.b != null ? W.units[A.b] : null; if (!t || !t.alive || t.down) return false; return h2Sub(W, u, C.s, C.subs, C.i + 1, t, C.via); }
const h2RecT = A => A.cmb && A.cmb.i + 1 < A.cmb.subs.length ? A.cmb.gap : 0.3;
""")
between("// 예고가 끝남: 모양 안의 상대가 맞음", "// 2페이즈: 체력이 phase.at 아래로", """// 예고가 끝남: 모양 안의 상대가 맞음 → 돌진은 줄 끝까지 잔상 이동 (벽 앞에서 멈춤) · v8.7.9 투창은 날아감 · 도약은 날아오름 · 창 대포는 뽑으며 돌림 · 연계는 다음
function resolveH2(W, u){
  const A = u.act;
  if (A.phase === 'twirl'){ h2Twirl(W, u, A); return; }
  if (A.phase !== 'wind'){ u.act = null; h2Next(W, u, A); return; }
  if (A.type === 'leap'){ h2Jump(W, u, A); return; }
  if (A.type === 'shot'){ h2Shot(W, u, A); return; }
  A.phase = 'rec'; A.end = W.t + h2RecT(A); A.t1 = W.t; u.atkT = W.t;
  const Z = A.Z, hit = W.units.filter(e => h2Hittable(u, e) && h2In(W, Z, e)), hc = (A.sk || {}).heavyCrit || 0;
  for (const e of hit){
    const o = strike(W, u, e, e, 1, false, { mul: A.mul, tag: A.n, ...(hc ? { heavyCrit: hc } : {}) });
    if (!e.alive) continue;
    if (A.kb && !e.kb) shove(W, u, e, A.kb * H2KB * (o && o.block ? 0.7 : 1), e.x - Z.x, e.y - Z.y, { tag: A.n + '에 날아감', noDown: true });   // 3D: 밀침은 넘어뜨리지 않음 (넘어뜨림은 trip)
    if (A.stun) stun(W, e, A.stun, u.i);
    if (A.trip && !(e.traits || []).includes('보스') && !e.giant) knockDown(W, e, 1.2, u.i, A.n);   // 3D: 무거운 몸 · 보스는 안 넘어짐
  }
  L(W, { k: 'h2Hit', a: u.i, s: A.s, n: A.n, hit: hit.map(e => e.i), vis: u.side === 0 || !!u.seenBy || hit.some(e => e.side === 0) });
  if (W.fxOn) W.fx.push({ k: 'h2Fx', sh: Z.sh, x: Z.x, y: Z.y, ang: Z.ang, r: Z.r, arc: Z.arc, len: Z.len, w: Z.w, side: u.side, t0: W.t });
  if (A.type === 'dash' && u.alive){ const k = h2Reach(W, u, Z.x, Z.y, Z.ang, Z.len); h2Ghost(W, u, Z.x + Math.cos(Z.ang) * k, Z.y + Math.sin(Z.ang) * k); }
  if ((A.sk || {}).twirl && u.alive){ A.phase = 'twirl'; A.end = W.t + (A.sk.twirl.gap || 0.25); }   /* v8.7.9 명세 E: 뽑을 때도 돌림 */
}
// v8.7.9 뽑으며 돌림 (창 대포): 몸 둘레 원 — 밀어냄
function h2Twirl(W, u, A){
  const T = A.sk.twirl, Z = { sh: 'fan', x: u.x, y: u.y, ang: u.face || 0, r: T.r, arc: 6.3 }, hit = W.units.filter(e => h2Hittable(u, e) && h2In(W, Z, e));
  for (const e of hit){ const o = strike(W, u, e, e, 1, false, { mul: T.mul, tag: A.n + ' — 뽑으며 돌림' }); if (e.alive && !e.kb && !(o && o.block)) shove(W, u, e, 1.2 * H2KB, e.x - u.x, e.y - u.y, { tag: '돌린 창에 밀려남', noDown: true }); }
  L(W, { k: 'h2Twirl', a: u.i, n: A.n, hit: hit.map(e => e.i), vis: u.side === 0 || !!u.seenBy || hit.some(e => e.side === 0) });
  if (W.fxOn) W.fx.push({ k: 'h2Fx', sh: 'fan', x: u.x, y: u.y, ang: 0, r: T.r, arc: 6.3, side: u.side, t0: W.t });
  A.phase = 'rec'; A.end = W.t + h2RecT(A);
}
// v8.7.9 투창 (3D shot): 던지는 순간 표적 쪽으로 track 만큼 고쳐 겨눔 → 줄로 날아감 (벽에서 멈춤) · 관통이면 줄의 몸을 모두 (방패에 박히면 거기서 멈춤) · 여러 개면 부채꼴 (철 깃털)
function h2Shot(W, u, A){
  const s = A.sk, t = A.b != null ? W.units[A.b] : null, Z = A.Z, J = JV(W), out = []; A.phase = 'rec'; A.end = W.t + h2RecT(A); A.t1 = W.t; u.atkT = W.t;
  let ang = Z.ang; if (t && t.alive && s.track){ let da = Math.atan2(t.y - u.y, t.x - u.x) - ang; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; ang += Math.max(-s.track, Math.min(s.track, da)); }
  const n = s.cnt || 1, jav = !s.far;
  for (let k = 0; k < n; k++){
    const a = ang + (n > 1 ? (k - (n - 1) / 2) * (s.spread || 0.12) : 0), c = Math.cos(a), sn = Math.sin(a); let L0 = s.len || 10;
    for (let q = 0.3; q <= L0; q += 0.3) if (rock(W.map, u.x + c * q, u.y + sn * q)){ L0 = q; break; }   // 직사 — 벽에서 멈춤
    const ZZ = { sh: 'line', x: u.x, y: u.y, ang: a, len: L0, w: s.w || 0.5 }, L1 = W.units.filter(e => h2Hittable(u, e) && h2In(W, ZZ, e)).sort((p, q) => dist(u, p) - dist(u, q));
    for (const e of L1){
      const o = strike(W, u, e, e, 1, true, jav ? { mul: (s.mul || 1) / (J.mul || 1), tag: A.n, jav: true, pm: s.pm || 1 } : { mul: s.mul || 1, tag: A.n, wk: '날붙이' }); out.push(e.i);
      if (o && o.block && (o.deflect || !s.pierce)) break;   // 방패에 박힘 · 막힘 — 거기서 멈춤
      if (e.alive && s.kb && !e.kb && !(o && o.block)) shove(W, u, e, s.kb * H2KB, c, sn, { tag: A.n + '에 날아감', noDown: true });
      if (e.alive && s.sts === 'bleed' && !(o && o.block)) startBleed(W, e, u.i, 1);
      if (!s.pierce) break; }
    if (W.fxOn) W.fx.push({ k: 'h2Shot', x: u.x, y: u.y, ang: a, len: L0, side: u.side, jav, t0: W.t });
  }
  L(W, { k: 'h2Hit', a: u.i, s: A.s, n: A.n, hit: out, vis: u.side === 0 || !!u.seenBy || out.some(i => W.units[i] && W.units[i].side === 0) });
}
// v8.7.9 도약 (3D leap): 예고 뒤 날아오름 — 표적이 줄 끝에 있으면 그 자리로 (3D: 상대 바로 위로) · 바위 앞에서 짧게 · 날아가는 동안 공중 (바닥 공격이 닿지 않음) · 내려앉을 원을 본 상대는 비킴
function h2Jump(W, u, A){
  const s = A.sk, t = A.b != null ? W.units[A.b] : null, Z = A.Z, m = W.map, pad = u.r + 0.2;
  let tx = u.x + Math.cos(Z.ang) * Z.len, ty = u.y + Math.sin(Z.ang) * Z.len;
  if (t && t.alive && dist(u, t) <= Z.len + 0.6){ tx = t.x; ty = t.y; }
  tx = Math.max(pad, Math.min(m.W - pad, tx)); ty = Math.max(pad, Math.min(m.H - pad, ty));
  for (let k = 0; k < 8 && boxRock(W, tx, ty, u.r * 0.9); k++){ tx = u.x + (tx - u.x) * 0.8; ty = u.y + (ty - u.y) * 0.8; }
  if (boxRock(W, tx, ty, u.r * 0.9)){ tx = u.x; ty = u.y; }
  const len = Math.hypot(tx - u.x, ty - u.y), T = Math.max(0.35, len / 13);   // 3D: 13m/초
  u.act = { k: 'leap', phase: 'run', air: true, t0: W.t, end: W.t + T, fx: u.x, fy: u.y, tx, ty, dir: 'fwd', b: A.b, h2L: { s, n: A.n, via: A.via, cmb: A.cmb || null } };
  stop(u); u.fg = u.face = Math.atan2(ty - u.y, tx - u.x);
  L(W, { k: 'h2Jump', a: u.i, b: A.b, n: A.n, x: +tx.toFixed(1), y: +ty.toFixed(1), vis: u.side === 0 || !!u.seenBy || litAt(W, tx, ty) });
  h2LandWarn(W, u, tx, ty, s.r || 2, A.n, W.t + T);
}
// 내려앉을 원: 본 상대 (뛰는 몸이 보이거나 · 자리가 밝고 보이는 거리) 는 tgDodgeP 로 원 밖으로 (적 · 아군 같은 규칙)
function h2LandWarn(W, u, x, y, r, n, at){
  for (const e of W.units){ if (!e.alive || e.side === u.side || e.down || e.kb || e.crawl || e.lie || e.summon === 'slime' || W.t < (e.proneT || -9) || W.t < (e.stunT || -9)) continue;
    const dx = e.x - x, dy = e.y - y, d = Math.hypot(dx, dy); if (d >= r + e.r + 0.3) continue;
    if (!(canSee(W, e, u) || (litAt(W, x, y) && d <= W.rules.sight)) || (e.order && e.order.k === 'hold') || (W.duel && e.i === W.duel.me) || (e.act && ((e.act.k === 'charge' && e.act.phase === 'run') || e.act.k === 'leap' || e.act.k === 'dodge' || (e.act.k === 'spec' && e.act.phase !== 'wind')))) continue;
    if (W.rand() >= tgDodgeP(W, e)){ L(W, { k: 'tgLate', a: e.i, b: u.i, what: n, vis: e.side === 0 || !!e.seenBy }); continue; }
    const a0 = d > 0.05 ? Math.atan2(dy, dx) : W.rand() * 6.283, D = r - d + e.r + 0.45; let fx = Math.max(0.6, Math.min(W.map.W - 0.6, e.x + Math.cos(a0) * D)), fy = Math.max(0.6, Math.min(W.map.H - 0.6, e.y + Math.sin(a0) * D));
    if (boxRock(W, fx, fy, e.r * 0.9)){ const q = freeSpot(W, fx, fy, e.r); if (!q) continue; fx = q.x; fy = q.y; }
    const ea = e.act; if (ea){ if (ea.k === 'skill' && ea.phase === 'tend') tendEnd(W, e, ea, '피함'); e.act = null; e.burst = null; }
    e.flee = { x: fx, y: fy, until: at + 0.2, why: n + ' — 피함' };
    L(W, { k: 'tgDodge', a: e.i, b: u.i, what: n, vis: e.side === 0 || !!e.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.45, s: '!', c: 'g', t0: W.t }); }
}
// 내려앉음 (3D land): 원 안의 상대 — 한 번 (mul) + 내려찍음 (mul2 · 밀침 · 0.5초 휘청) · 몸에 깔린 이는 몸 밖으로 · 방벽 무시 (날아 투창) 는 막을 수 없음 · 연계면 다음
function h2Land(W, u, A){
  const H = A.h2L, s = H.s, R = s.r || 2, Z = { sh: 'circ', x: u.x, y: u.y, r: R + 0.01 }, hit = W.units.filter(e => h2Hittable(u, e) && h2In(W, Z, e)), ex = { tag: H.n, ...(s.heavyCrit ? { heavyCrit: s.heavyCrit } : {}), ...(s.over ? { grab: true } : {}) };
  for (const e of hit){
    const d = dist(u, e); if (d < u.r + e.r){ const a = d > 0.05 ? Math.atan2(e.y - u.y, e.x - u.x) : W.rand() * 6.283, D2 = u.r + e.r + 0.05, x = u.x + Math.cos(a) * D2, y = u.y + Math.sin(a) * D2, p = !boxRock(W, x, y, e.r * 0.9) ? { x, y } : freeSpot(W, x, y, e.r); if (p){ e.x = p.x; e.y = p.y; } }
    strike(W, u, e, e, 1, false, { ...ex, mul: s.mul || 1 }); if (!e.alive) continue;
    const o2 = strike(W, u, e, e, 1, false, { ...ex, mul: s.mul2 || 1.2, tag: H.n + ' — 내려찍음' }); if (!e.alive) continue;
    if (!e.kb && !(o2 && o2.block)) shove(W, u, e, 2 * H2KB, e.x - u.x, e.y - u.y, { tag: H.n + '에 날아감', noDown: true });
    if (!(o2 && o2.block)) stun(W, e, 0.5, u.i); }
  L(W, { k: 'h2Hit', a: u.i, s: s.id, n: H.n, hit: hit.map(e => e.i), land: true, vis: u.side === 0 || !!u.seenBy || hit.some(e => e.side === 0) || litAt(W, u.x, u.y) });
  if (W.fxOn){ W.fx.push({ k: 'h2Boom', x: u.x, y: u.y, r: R, side: u.side, t0: W.t }); W.fx.push({ k: 'num', x: u.x, y: u.y, s: '쿵!', c: 'd', t0: W.t }); }
  if (!(H.cmb && h2Next(W, u, { cmb: H.cmb, b: A.b }))) u.act = { k: 'h2', s: s.id, n: H.n, type: 'land', b: A.b, phase: 'rec', t0: W.t, end: W.t + 0.35, via: H.via };
}
""")
# 두뇌: 천천히 걸어 다님 (명세 E) — 각펄 기술표의 stalk
rep("  const K = h2Kit(u); if (!K || u.act) return false;\n  const F = czKnown(W, u).filter(f => !f.down); if (!F.length){ u.h2.close = false; return false; }",
    "  const K = h2Kit(u); if (!K || u.act) return false; u.stalkK = K.stalk || 1;   /* v8.7.9 각펄: 천천히 걸어 다니다 (명세 E) — 빠른 것은 도약 · 돌진 · 투창 */\n"
    "  const F = czKnown(W, u).filter(f => !f.down); if (!F.length){ u.h2.close = false; return false; }")
rep("* (u.czSpd || 1) *", "* (u.czSpd || 1) * (u.stalkK || 1) *")
# 그림자 원 · 덫 · 장판: 무기 성질 · 이름 · 땅에서 솟는 것 (위에서 떨어지지 않음)
rep("for (const e of hit){ strike(W, by, e, e, 1, false, { mul: Z.mul, tag: Z.n, wk: '마법', arc: true, rain: true }); if (e.alive && Z.stun) stun(W, e, Z.stun, by.i); }",
    "for (const e of hit){ strike(W, by, e, e, 1, false, { mul: Z.mul, tag: Z.tag || Z.n, wk: Z.wk || '마법', arc: !Z.up, rain: !Z.up }); if (e.alive && Z.stun) stun(W, e, Z.stun, by.i); }   /* v8.7.9 덫 · 장판 (각펄의 창은 날붙이 · 솟는 창은 땅에서) */")
# 도약이 끝남: 각펄 · 펄의 내려앉음
rep("if (q >= 1){ if (A.slam) slamHit(W, u, A); if (A.gslam) gslamHit(W, u, A); u.act = null; if (A.quake){",
    "if (q >= 1){ if (A.slam) slamHit(W, u, A); if (A.gslam) gslamHit(W, u, A); u.act = null; if (A.h2L) h2Land(W, u, A); else if (A.h2up && A.h2up.cmb) h2Next(W, u, { cmb: A.h2up.cmb, b: A.b }); if (A.quake){")   # v8.7.9

# ---------- 몸: 끝까지 · 펄 기술 · 각펄 · 타천 날개 ----------
rep("    if (K){ U.h2 = { k: p.h2, cd: {}, mlT: -9, ph: false, close: false }; U.rng = Math.max(U.rng, +(K.ml.range - U.r - 0.12).toFixed(2)); U.longReach = true; }",
    "    if (K){ U.h2 = { k: p.h2, cd: {}, mlT: -9, ph: false, close: false }; U.rng = Math.max(U.rng, +(K.ml.range - U.r - 0.12).toFixed(2)); U.longReach = true; U.h2Last = !!K.last; }   /* v8.7.9 ◆끝까지 */\n"
    "    if (p.pk && H2K[p.pk]) U.pk = { k: p.pk, cd: {}, mlT: -9, ph: false }; if (p.gak && H2K[p.gak]) U.gakKit = p.gak; U.fallW = (p.unique || []).includes('타천 날개');   /* v8.7.9 동료 펄: 평소 기술 · 빈사에 각펄 · ◆타천 날개 */")

# ◆끝까지 (3D 구현: 쓰러질 일격을 한 번 체력 1 로 버팀) · 움츠리기 (받는 피해 × k)
rep("  const real = Math.min(dmg, t.hp), dark = t.side === 0 && !canSee(W, t, u);",
    "  if (t.h2Last && !t.h2LastUsed && t.alive && u !== t && dmg >= t.hp && t.hp >= 1 && !/출혈|화상|근성/.test((o && o.tag) || '')){ t.h2LastUsed = true; dmg = Math.max(0, t.hp - 1); t.deathKind = null; t.headAt = null; o = { ...(o || {}), tag: ((o && o.tag) ? o.tag + ' — ' : '') + '끝까지 — 버팀' }; L(W, { k: 'h2Last', a: u.i, b: t.i, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '버팀! (끝까지)', c: 'd', t0: W.t }); if (!(dmg > 0)) return; }   /* v8.7.9 ◆끝까지 (각펄) */\n"
    "  const real = Math.min(dmg, t.hp), dark = t.side === 0 && !canSee(W, t, u);")
rep("    if (t.dmgK > 0 && t.dmgK !== 1) dmg *= t.dmgK;",
    "    if (t.dmgK > 0 && t.dmgK !== 1) dmg *= t.dmgK;\n    if (t.wrapT != null && W.t < t.wrapT) dmg *= ((W.rules.pearl || {}).wrap || {}).k || 0.4;   /* v8.7.9 움츠리기 (펄 — 날개로 몸을 감쌈) */")

# 매 틱: 각펄로 바뀜 · 돌아옴 / 각펄의 울부짖음 (잠깐 멈춤)
rep("  if (u.h2) h2Tick(W, u);   /* v8.7.4 2페이즈 */",
    "  if (u.gakKit && u.alive) pearlTick(W, u);   /* v8.7.9 동료 펄: 빈사에 각펄 · 돌아옴 */\n"
    "  if (u.h2) h2Tick(W, u);   /* v8.7.4 2페이즈 */")
rep("  if (u.act && u.act.k === 'karRoar'){ stop(u); if (W.t >= u.act.end) u.act = null; return; }   /* v8.7.8 불경자 — 울부짖음 */",
    "  if (u.act && u.act.k === 'karRoar'){ stop(u); if (W.t >= u.act.end) u.act = null; return; }   /* v8.7.8 불경자 — 울부짖음 */\n"
    "  if (u.act && u.act.k === 'gakOn'){ stop(u); if (W.t >= u.act.end) u.act = null; return; }   /* v8.7.9 각펄 — 눈빛이 바뀜 (잠깐) */\n"
    "  if (u.act && u.act.k === 'wrap'){ stop(u); if (W.t >= u.act.end){ u.act = null; u.wrapT = null; } return; }   /* v8.7.9 움츠리기 (그동안 못 움직임) */")

# 스스로: 동료 펄의 기술 (3D heroCombat — 싸울 때 dt × 3) · 펄의 창 (무기 기술)
rep("  if (u.karKit && karAuto(W, u, t)) return true;   /* v8.7.8 카리우스 (3D kariusThink 의 차례) */",
    "  if (u.karKit && karAuto(W, u, t)) return true;   /* v8.7.8 카리우스 (3D kariusThink 의 차례) */\n"
    "  if (u.pk && !u.h2 && pearlAuto(W, u, t)) return true;   /* v8.7.9 동료 펄 (평소) */\n"
    "  if (specReady(W, u, 'pthrow') && pthrowAuto(W, u, t)) return true;   /* v8.7.9 펄의 창 — 정면 투창 (열화) */")

# 기술이 없어도 동료 펄의 기술은 (specAuto 가 기술 없는 몸은 건너뛰던 것)
rep("  if (!u.spec || !u.spec.length || !t || !t.alive || !see || u.act) return false;\n  if (apAuto(W, u, t)) return true;",
    "  if ((!u.spec || !u.spec.length) && !u.pk || !t || !t.alive || !see || u.act) return false;   /* v8.7.9 동료 펄은 기술 칸이 없어도 (기술표) */\n  if (apAuto(W, u, t)) return true;")
# 빈사에 각펄: 숨이 끊길 일격이면 체력 1 로 남아 각펄로 (싸움마다 한 번 — 카리우스 근성처럼) · 그 뒤 ◆끝까지 한 번
rep("  if (t.h2Last && !t.h2LastUsed && t.alive && u !== t && dmg >= t.hp",
    "  if (t.gakKit && !t.gak && !t.gakUsed && t.alive && u !== t && dmg >= t.hp && t.hp >= 1 && !/출혈|화상|근성/.test((o && o.tag) || '')){ t.gakUsed = true; dmg = Math.max(0, t.hp - 1); t.deathKind = null; t.headAt = null; o = { ...(o || {}), tag: ((o && o.tag) ? o.tag + ' — ' : '') + '쓰러지지 않음 (각펄)' }; pearlGak(W, t, true); if (!(dmg > 0)) return; }   /* v8.7.9 동료 펄: 숨이 끊길 일격 → 각펄 */\n"
    "  if (t.h2Last && !t.h2LastUsed && t.alive && u !== t && dmg >= t.hp")

# 각펄일 때는 피를 흘리지 않음 (검은 날개가 상처를 덮음 — 체력 1 에서 출혈로 바로 쓰러지던 것)
# 새 덩어리 (잡아찢기 끝까지 앞)
rep("// v8.7.4 잡아찢기 끝까지: kill 체급 (중형) 까지는 찢겨 죽음",
"""/* ---------- v8.7.9 펄 (동료): 평소 기술 · 움츠리기 · 빈사에 각펄 (카리우스 [불경자] 처럼) · 펄의 창 (무기 기술) ---------- */
// 평소 (3D heroCombat): 14칸 안의 아는 상대에게 0.1초마다 0.3 (= dt × 3) — 쓸 기술은 h2Pick 차례대로 · 움츠리기는 따로 (나를 노린 큰 일격 · 위급할 때)
function pearlAuto(W, u, t){
  if (!t || !t.alive || t.side === u.side || u.act || W.t < (u.pkT || -9)) return false; u.pkT = W.t + 0.1;
  if (W.t >= (u.wrapCd || -9)){ const big = W.units.find(e => e.alive && e.side !== u.side && e.act && e.act.phase === 'wind' && e.act.b === u.i && (e.act.k === 'h2' || e.act.k === 'charge' || (e.act.k === 'spec' && e.act.s !== 'head')) && e.act.end - W.t < 0.5 && aware(W, u, e));
    const press = u.hp < u.max * 0.35 && W.units.filter(e => e.alive && e.side !== u.side && !isFar(e) && gap(u, e) < 1).length >= 2;
    if ((big || press) && pearlWrapGo(W, u, big, big ? big.name + '의 큰 일격이 온다' : '둘러싸임')) return true; }
  const d = dist(u, t); if (d > 14 || W.rand() >= 0.3) return false;
  const s = h2Pick(W, u, t, d, 'pk'); if (!s) return false;
  if (s.type === 'shot' && !losClear(W.map, u.x, u.y, t.x, t.y)) return false;
  return h2Cast(W, u, s, t, 'pk');
}
// 움츠리기 (명령 · 스스로 같은 몸 — 3D 기술표 글: 날개로 몸을 감싸 2초 받는 피해 60% 감소 · 그동안 못 움직임)
function pearlWrapGo(W, u, big, why){
  const WR = (W.rules.pearl || {}).wrap || {}, x = specOf(u, 'pwrap');
  if (!u.alive || u.down || u.act || W.t < (u.wrapCd || -9)) return false;
  u.wrapCd = W.t + (WR.cd || 10); if (x) x.cdT = u.wrapCd; u.wrapT = W.t + (WR.t || 2); u.act = { k: 'wrap', t0: W.t, end: u.wrapT }; stop(u);
  L(W, { k: 'pearlWrap', a: u.i, b: big ? big.i : null, why: why || '', vis: u.side === 0 || !!u.seenBy }); setMood(W, u, '움츠리기'); return true;
}
// 빈사 (at 아래 · 또는 숨이 끊길 일격 — 싸움마다 한 번 체력 1 로) 에 각펄: 공격 × atk · 걸음 × spd · 받는 피해 × def (1) · 각펄 기술표 · 두뇌 (명령이 있으면 명령) · ◆끝까지 (싸움마다 한 번) — off 를 넘으면 돌아옴 (잠깐 멈춤)
function pearlTick(W, u){
  const G = (W.rules.pearl || {}).gak || {};
  if (!u.gak && u.hp <= u.max * (G.at || 0.15) && !(u.ls)) pearlGak(W, u, true);
  else if (u.gak && u.hp > u.max * (G.off || 0.5)) pearlGak(W, u, false);
}
function pearlGak(W, u, on){
  if (on === !!u.gak) return;
  const G = (W.rules.pearl || {}).gak || {}, K = H2K[u.gakKit];
  if (on){
    u.gak = true; u.gak0 = { atk: u.atk, spd: u.spd, rng: u.rng, wind: u.wind, rec: u.rec, lr: !!u.longReach };
    u.atk = +(u.atk * (G.atk || 1.8)).toFixed(2); u.spd = +(u.spd * (G.spd || 1.25)).toFixed(3); u.dmgK = (u.dmgK || 1) * (G.def != null ? G.def : 1);
    u.h2 = { k: u.gakKit, cd: {}, mlT: -9, ph: false, close: false, gak: true }; if (K){ u.rng = Math.max(u.rng, +(K.ml.range - u.r - 0.12).toFixed(2)); u.longReach = true; }
    if (!u.h2LastUsed) u.h2Last = true;
    if (u.wrapT != null){ u.wrapT = null; } interrupt(W, u, '각펄 — 눈빛이 바뀜'); u.act = { k: 'gakOn', t0: W.t, end: W.t + 0.6 }; stop(u);
    L(W, { k: 'pearlGak', a: u.i, on: true, vis: true }); if (W.fxOn){ W.fx.push({ k: 'say', a: u.i, s: '(…목소리가 낮게 가라앉는다)', t0: W.t }); W.fx.push({ k: 'num', x: u.x, y: u.y - 0.6, s: '각펄!', c: 'd', t0: W.t }); }
  } else {
    const B = u.gak0 || {}; u.gak = false; if (B.atk != null){ u.atk = B.atk; u.spd = B.spd; u.rng = B.rng; u.wind = B.wind; u.rec = B.rec; u.longReach = B.lr; } u.dmgK = (u.dmgK || 1) / (G.def != null ? G.def : 1);
    u.h2 = null; u.stalkK = 1; u.h2Last = false; if (u.act && (u.act.k === 'h2' || (u.act.k === 'leap' && (u.act.h2L || u.act.h2up)))) u.act = null;
    L(W, { k: 'pearlGak', a: u.i, on: false, vis: u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '헤헤… 어라? 나 뭐 했어?', t0: W.t });
  }
}
// 펄의 창 (무기 기술 · 열화): 3 ~ 12칸 · 보이고 곧게 닿는 상대에게 — 각펄의 정면 투창 × weak
function pthrowAuto(W, u, t){
  const S = SPR(W, 'pthrow'), x = specOf(u, 'pthrow'); if (!x || !t || !t.alive || t.side === u.side) return false;
  const g = gap(u, t); if (g < (S.min || 3) || g > (S.rng || 12) || !canSee(W, u, t) || !losClear(W.map, u.x, u.y, t.x, t.y)) return false;
  x.cdT = W.t + (S.cd || 8); u.pw = u.pw || { cd: {}, mlT: -9 };
  return h2Cast(W, u, { id: 'pthrow', n: x.name || '정면 투창 (열화)', type: 'shot', cd: 0, use: 99, len: S.len || 12, w: S.w || 0.5, mul: (S.mul || 3) * (x.weak ? S.weak || 0.6 : 1), kb: S.kb || 2, pm: S.pm || 1.8, track: S.track || 0.1, wind: S.wind || 0.45, pierce: true }, t, 'pw');
}
// v8.7.4 잡아찢기 끝까지: kill 체급 (중형) 까지는 찢겨 죽음""")

# v1.1 펄의 창은 보통 투창처럼 던져 버리지 않음 (정면 투창 (열화) 은 무기 기술 — 창은 손에 남음 · 3D 각펄도 던진 뒤 창을 쥐고 있음)
rep("'펄의 창':{rng:1.8, kind:'날붙이', two:true, spec:'pthrow', specName:'정면 투창 (열화)'}", "'펄의 창':{rng:1.8, kind:'날붙이', two:true, noThr:true, spec:'pthrow', specName:'정면 투창 (열화)'}")
rep("      jav: ((p.traits || []).includes('공통스킬:투창') || /창$/.test(p.weapon || '') || !!wp.thr) && (wp.kind === '날붙이' || /창$/.test(p.weapon || '')), spearHeld: true,",
    "      jav: ((p.traits || []).includes('공통스킬:투창') || /창$/.test(p.weapon || '') || !!wp.thr) && (wp.kind === '날붙이' || /창$/.test(p.weapon || '')) && !wp.noThr, spearHeld: true,   /* v8.7.9 noThr (펄의 창) */")
rep("  u.jav = !far && (/창$/.test(name) || !!wp.thr); u.spearHeld = true;", "  u.jav = !far && (/창$/.test(name) || !!wp.thr) && !wp.noThr; u.spearHeld = true;")
# v1.1 만남의 각펄 (spare8 — 페이지가 붙임): 숨이 끊길 일격 (끝까지 뒤 · 지속 피해도) 에도 체력 1 로 쓰러지기만 함 — 판이 끝나면 영입 · 죽임을 고름 (명세 E: 이기면 영입 · 죽이면 펄의 창)
rep("  const real = Math.min(dmg, t.hp), dark = t.side === 0 && !canSee(W, t, u);",
    "  if (t.spare8 && t.alive && u !== t && dmg >= t.hp){ dmg = Math.max(0, t.hp - 1); t.deathKind = null; t.headAt = null; if (t.fell8 == null){ t.fell8 = W.t; L(W, { k: 'spare8', a: u.i, b: t.i, vis: true }); } if (!(dmg > 0)) return; }   /* v8.7.9 만남의 각펄 — 쓰러지되 숨은 붙어 있음 */\n"
    "  const real = Math.min(dmg, t.hp), dark = t.side === 0 && !canSee(W, t, u);")

# v1.2 동료 펄 기술 칸 (다른 동료처럼 대표 둘 — 철 깃털 · 꼬깃꼬깃 착지 · 나머지 돌려차기 · 움츠리기도 명령으로): 기술표 (pk) 와 같은 몸 · 같은 대기
rep("const SPEC_K = { '혈영보': 'blink',", "const PK_SPEC = { psky: 'psky', pball: 'pball', pwide: 'pwide', pfeath: 'feather', pland: 'land', pkick: 'kick' };   /* v8.7.9 동료 펄 기술 칸 → 기술표 (pk) */\nconst SPEC_K = { '신나는 공중 투창': 'psky', '신나는 포탄': 'pball', '신나는 횡베기': 'pwide', '철 깃털': 'pfeath', '꼬깃꼬깃 착지': 'pland', '돌려차기': 'pkick', '움츠리기': 'pwrap', '혈영보': 'blink',")
rep("    if (!t || !t.alive){ u.order = null; return; }\n    const see = canSee(W, u, t); if (!see && !(u.side === 0 ? t.seenBy : false)){ L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return; }",
    "    if (o.s === 'pwrap'){ const x = specOf(u, 'pwrap'); if (pearlWrapGo(W, u, null, '명령')) u.order = null; else if (x && x.cdT > W.t && !u.act){ setMood(W, u, '움츠리기 대기 (' + (x.cdT - W.t).toFixed(1) + '초)'); } else if (!u.act) u.order = null; return; }   /* v8.7.9 펄 — 움츠리기 (제자리) */\n"
    "    if (!t || !t.alive){ u.order = null; return; }\n    const see = canSee(W, u, t); if (!see && !(u.side === 0 ? t.seenBy : false)){ L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return; }")
rep("    const S = SPR(W, o.s), reach = o.s === 'flip' ? S.d || 3.2 : o.s === 'pb' ? S.rng || 2.4 : S.rng || 3.6;",
    "    if (PK_SPEC[o.s] && u.pk){ const K = H2K[u.pk.k] || {}, s = (K.sk || []).find(x => x.id === PK_SPEC[o.s]); if (!s){ u.order = null; return; }   /* v8.7.9 펄 기술 명령 — 철 깃털 · 꼬깃꼬깃 착지 · 돌려차기 (스스로 쓸 때와 같은 몸) · v1.3 신나는 공중 투창 · 포탄 · 횡베기도 */\n"
    "      const d = dist(u, t), cdT = u.pk.cd[s.id] != null ? u.pk.cd[s.id] : -9, rdy = W.t >= cdT && !u.act;\n"
    "      if (rdy && d <= s.use && d >= (s.min || 0) && (s.type !== 'shot' || losClear(W.map, u.x, u.y, t.x, t.y))){ h2Cast(W, u, s, t, 'pk'); u.order = null; return; }\n"
    "      if (rdy && d < (s.min || 0)){ const a = Math.atan2(u.y - t.y, u.x - t.x); setMood(W, u, sp.name + ' — 거리를 벌림', t.i); goTo(W, u, u.x + Math.cos(a) * 2, u.y + Math.sin(a) * 2, dt); return; }\n"
    "      if (!rdy && gap(u, t) <= u.rng + 0.3){ setMood(W, u, sp.name + ' 대기' + (cdT > W.t ? ' (' + (cdT - W.t).toFixed(1) + '초)' : ''), t.i); fight(W, u, t, dt, see, true); return; }\n"
    "      setMood(W, u, sp.name + '하러', t.i); goTo(W, u, t.x, t.y, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x); return; }\n"
    "    if (o.s === 'pthrow'){ const S9 = SPR(W, 'pthrow'), g9 = gap(u, t), rd = specReady(W, u, 'pthrow');   /* v8.7.9 펄의 창 — 정면 투창 (열화) 명령 */\n"
    "      if (rd && pthrowAuto(W, u, t)){ u.order = null; return; }\n"
    "      if (rd && g9 < (S9.min || 3)){ const a = Math.atan2(u.y - t.y, u.x - t.x); setMood(W, u, sp.name + ' — 거리를 벌림', t.i); goTo(W, u, u.x + Math.cos(a) * 2, u.y + Math.sin(a) * 2, dt); return; }\n"
    "      if (!rd && g9 <= u.rng + 0.3){ setMood(W, u, sp.name + ' 대기' + (sp.cdT > W.t ? ' (' + (sp.cdT - W.t).toFixed(1) + '초)' : ''), t.i); fight(W, u, t, dt, see, true); return; }\n"
    "      setMood(W, u, sp.name + '하러', t.i); goTo(W, u, t.x, t.y, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x); return; }\n"
    "    const S = SPR(W, o.s), reach = o.s === 'flip' ? S.d || 3.2 : o.s === 'pb' ? S.rng || 2.4 : S.rng || 3.6;")
# 3D 기술표 보스 (각펄) 는 무기의 열화 기술을 따로 갖지 않음 — 제 기술표의 정면 투창
rep("function wpnSpec(W, u){ const wp = (W.rules.weapons || {})[u.weapon] || {}; if (!wp.spec || u.weaponGone ||", "function wpnSpec(W, u){ const wp = (W.rules.weapons || {})[u.weapon] || {}; if (!wp.spec || u.weaponGone || u.h2 ||")

# v1.2 각펄 싸움 (명세 E — 0 까지 기다리면 싸움 · 지면 무조건 전멸): 들어온 자리로도 물러날 수 없음 (W.noRetreat — 페이지가 붙임)
rep("  if (dn && W.entry){ const E0 = W.entry;", "  if (dn && W.entry && W.noRetreat){ setMood(W, u, '물러날 길이 없음'); u.order = null; return; }   /* v8.7.9 각펄 — 등 뒤의 길이 닫힘 */\n  if (dn && W.entry){ const E0 = W.entry;")

# 내보내기
rep("module.exports = { healPolOf, SUP_K, startSkill,", "module.exports = { h2Of, h2Kit, h2Pick, h2Sub, h2Next, h2Twirl, h2Shot, h2Jump, h2LandWarn, h2Land, pearlAuto, pearlTick, pearlGak, pearlWrapGo, pthrowAuto, PK_SPEC, healPolOf, SUP_K, startSkill,")

for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch8790 OK')
