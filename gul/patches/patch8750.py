# v8.7.5 엔진 — patch8750.py v1.7 (v1.7: 공세선 기다림은 처진 편대원이 뒤에 있을 때만 — 처진 이가 모두 가는 쪽 (기준보다 목표에 가까움) 에 있으면 가면서 만남 (멀리 떨어진 기준이 본대로 돌아올 때 마주 오는 편대원을 서서 기다려 한참 늦던 것) · v1.6: 대장 (chiefOf — 주인공 · 지휘관) 을 대형의 기준 (ancOf) 과 따로: 대장이 나가면 남은 동료가 따라 나섬 · 대장은 출구에서 마지막에 나감 · 출구 찾기는 대장을 중심으로 (대형이 켜지면 기준이 대장 노릇을 하던 것) · v1.5: 주 방어대장 = 전선 또는 방패를 든 근접 (레베카처럼 공격수라도 방패면 방어대장 감) · 기준이 창 · 사수 · 치유면 그 줄 깊이에 서고 칼은 앞으로 (사수 기준이 앞줄에 서던 것) · 기준의 진형 버프 줄도 제 줄대로 (사수 기준은 방패벽 · 끝 버팀 없음) · v1.4: 모여 (frally) 명령을 기록 · 명령 줄 글에 (orderTxt — 예전엔 '제자리' 로 찍힘) · 하던 동작을 바로 멈추고 대형으로 (preempt) · v1.3: 싸울 때 방식 — 대형 지킴 (keep) · 맞붙으면 각자 (loose: 아는 적이 있는 동안은 대형을 풂) · v1.2: 좁은 길 비켜서기 (J12 — 옆으로 비킬 곳이 없으면 몸을 붙여 지나가게 · 싸우는 중이면 그대로 · 양쪽 같음) · 모닝스타 좁은 골목 (A6 — 철퇴를 돌리지 못하고 앞뒤로 던지기만 · 후리기 없음) · v1.1: 진형 버프 (K3 — 방패벽 · 쐐기 돌파 · 삼각 엄호 · 사방 경계 · 흩어짐 · 우리 대형 · 적의 대치 진형 · 쐐기 돌파 같은 셈) · 조합 버프 (K4 — 고블린즈 · 갱스터 파라다이스 · 굴에 떨어진 이들 · 노먼의 2편대 · 도감 근거) · 종족을 엔진 몸에 · v1.0: 대형 (J7 · J16 · I20) — 편대 (A 본대 · B 2편대) 마다 편대장 (기본 = 주 방어대장) 기준 상대 자리 · 모양 다섯 (일자 · 쐐기 · 삼각 · 방진 · 산개) + 자유 · 명령은 편대장에게 · 편대원은 제 자리로 (가장 느린 편대원에 맞춘 걸음) · 대형이 70% 아래면 편대장이 기다림 (공세선 · 3초까지) · 맞붙은 편대원은 보통 판단 · 끝나면 제 자리로 · 자리 명령을 따로 받으면 떼어 맡김 · 모여 (깃발) 로 돌아옴 · 편대장이 쓰러지면 다음 · 기준 (주인공 · 지휘관) 은 본대 대형이 켜져 있으면 편대장 · 페이지가 setup.form 을 넘길 때만 켜짐)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8740.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- N. 대형 (J7 · J16 · I20) ----------
rep("  berry: { gap: 20, first: 8, max: 3, heal: [5, 10], r: 1.4 },   /* v7.19.2 열매 맺기: 맺는 간격 · 처음 · 판에 최대 · 회복 · 곁 거리 */",
    "  berry: { gap: 20, first: 8, max: 3, heal: [5, 10], r: 1.4 },   /* v7.19.2 열매 맺기: 맺는 간격 · 처음 · 판에 최대 · 회복 · 곁 거리 */\n"
    "  form8: { need: 0.7, tol: 0.8, tolSpear: 0.95, tolBack: 1.25, engTol: 2.4, waitMax: 3, turn: 1.4, gap: 1.05, gapLoose: 2.2, engage: 0.9, catchup: 1.6 },   /* v8.7.5 대형: 공세선 (유지율 need 아래면 편대장이 기다림 · waitMax 초까지) · 제 자리 tol 칸 (창 2열 · 뒷줄) · 맞붙은 이는 engTol 칸 안이면 자리 · 보는 쪽 turn rad/초 · 칸 간격 (산개는 넓게) · 맞붙음 = 손 + engage 칸 · catchup 칸 넘게 처지면 뜀 */")

FORM = r"""/* ---------- v8.7.5 대형 (J7 · J16 · I20) ---------- */
// 편대 (A 본대 · B 2편대) 마다 대형 하나: 편대장 (기본 = 주 방어대장 — 가장 단단한 전선, 없으면 본대는 주인공 · 2편대는 부대장) 을 기준으로 모양 (일자 · 쐐기 · 삼각 · 방진 · 산개 · 자유) 의 제 자리.
// 명령은 편대장에게 — 편대원은 편대장 자리 + 제 칸으로 따라감 (꿈틀대도 모양 유지). 편대장은 가장 느린 편대원에 맞춰 걷고, 대형이 need (70%) 아래면 기다림 (공세선 · waitMax 초까지).
// 맞붙은 편대원은 그 자리에서 싸움 (보통 판단 그대로) · 끝나면 제 자리로 (다시 뭉침). 자리 명령 (이동 · 제자리 · 전열 …) 을 따로 받은 이는 떼어 맡김 — 모여 (깃발) 로 돌아옴.
// 페이지가 setup.form 을 넘길 때만 켜짐 (시험 판 · 옛 판은 예전 그대로)
const FORM_SHAPES = ['일자', '쐐기', '삼각', '방진', '산개'];
const FORM_DET = ['move', 'amove', 'hold', 'watch', 'line', 'lret', 'scout', 'flank', 'supp', 'flare', 'assn', 'sac'];   // 떼어 맡기는 자리 명령 (공격 · 돌진 · 기술 · 줍기는 끝나면 제 자리로)
const FRM = W => W.rules.form8 || {};
const fKey = u => u.fkey || u.id || u.ref || u.name;
const fClass = (W, u) => isFar(u) || u.cls === '치유' ? 'back' : rank2(W, u) ? 'spear' : 'front';
const formOf = (W, u) => W.form && u.side === 0 ? W.form[u.fsq || 'A'] || null : null;
const formLed = (W, u) => { const F = formOf(W, u); return F && F.act && F.lead === u.i ? F : null; };
const formPt = (W, F, s) => { const ld = W.units[F.lead], c = Math.cos(F.face || 0), n = Math.sin(F.face || 0); return { x: ld.x + c * s.f - n * s.l, y: ld.y + n * s.f + c * s.l }; };
const formWalk = (W, u) => u.spd * (u.spdMul || 1) * (u.injSpd || 1) * (u.raised && u.shield ? ((W.rules.guard || {}).walk || 0.75) : 1);
// 편대장 고르기: 주 방어대장 (전선 근접 가운데 가장 단단한 몸 — 체력 × 몸무게 · 방패) → 없으면 본대는 주인공 · 2편대는 부대장 → 근접 → 아무나
function formLeadPick(W, M, sq){
  const ok = M.filter(u => u.alive && !u.down && !u.crawl && !u.gone), hard = u => u.max * Math.sqrt(u.mass || 70) * (u.shield ? 1.25 : 1);
  const tank = ok.filter(u => !isFar(u) && (u.role === '전선' || (u.shield && u.cls !== '치유'))).sort((a, b) => hard(b) - hard(a))[0];   /* v1.5 방패를 든 근접도 방어대장 감 */
  return tank || (sq === 'B' ? ok.find(u => u.rank === '부대장') : ok.find(u => u.hero)) || ok.filter(u => !isFar(u)).sort((a, b) => hard(b) - hard(a))[0] || ok[0] || null;
}
// 모양마다 제 자리 (편대장 기준: f = 앞 (+) 뒤 (−) · l = 오른쪽 (+) 왼쪽 (−)). 칼 (앞줄) · 창 (2열) · 사수와 치유 (뒷줄) 가 모양대로 · 같은 줄 안에선 지금 선 쪽대로 (엇갈리지 않게) · 유저가 맞바꾼 자리 · 자유 대형 (끌어 놓은 자리)
function formLayout(W, F, M){
  const S = FRM(W), ld = W.units[F.lead], loose = F.shape === '산개', G = loose ? (S.gapLoose || 2.2) : (S.gap || 1.05);
  const rest = M.filter(u => u !== ld), by = k => rest.filter(u => fClass(W, u) === k), fr = by('front'), sp = by('spear'), bk = by('back'), P = { front: [], spear: [], back: [] };
  const ldk = fClass(W, ld), tipFree = ldk !== 'front' && F.shape !== '자유'; F.ldk = ldk;   // v1.5 기준이 창 · 사수 · 치유면 끝 (꼭짓점 · 앞줄 가운데) 은 첫 칼이 맡고 기준은 제 줄에 섬
  const nSp = sp.length + (tipFree && ldk === 'spear' ? 1 : 0), nBk = bk.length + (tipFree && ldk === 'back' ? 1 : 0);   // 기준도 제 줄에서 자리를 하나 차지
  const alt = (n0, fn) => { const o = []; for (let k = 1; k <= n0; k++) o.push(fn(Math.ceil(k / 2), k % 2 ? 1 : -1)); return o; };
  if (F.shape === '쐐기'){   // 칼 · 창이 번갈아 양쪽으로 비스듬히 (날개) · 사수 · 치유는 날개 안 (편대장 바로 뒤)
    const nA = fr.length + nSp, wing = (n, s2) => ({ f: -0.95 * n, l: s2 * 0.95 * n }), arm = tipFree && nA ? [{ f: 0, l: 0 }, ...alt(nA - 1, wing)] : alt(nA, wing);
    P.front = arm.slice(0, fr.length); P.spear = arm.slice(fr.length, fr.length + nSp);
    P.back = Array.from({ length: nBk }, (_, k) => ({ f: -1.5 - 0.95 * Math.floor(k / 2), l: nBk === 1 ? 0 : (k % 2 ? 0.5 : -0.5) }));
  } else if (F.shape === '삼각'){   // 편대장이 꼭짓점 · 줄마다 하나씩 늘어남 · 칼 · 창은 바깥 · 사수 · 치유는 안쪽
    const N = fr.length + nSp + nBk, pos = []; for (let r = tipFree ? 0 : 1; pos.length < N; r++) for (let j = 0; j <= r; j++) pos.push({ f: -1.1 * r, l: (j - r / 2) * 1.15, r });
    const used = new Set(), take = (n0, outer) => Array.from({ length: n0 }, () => { let b = -1; for (let ix = 0; ix < pos.length; ix++){ if (used.has(ix)) continue; if (b < 0 || pos[ix].r < pos[b].r || (pos[ix].r === pos[b].r && (outer ? Math.abs(pos[ix].l) > Math.abs(pos[b].l) : Math.abs(pos[ix].l) < Math.abs(pos[b].l)))) b = ix; } used.add(b); return { f: pos[b].f, l: pos[b].l }; });
    P.front = take(fr.length, true); P.spear = take(nSp, true); P.back = take(nBk, false);
  } else if (F.shape === '방진'){   // 편대장이 앞 · 근접은 둥글게 (밖을 봄) · 사수 · 치유는 가운데
    const n0 = fr.length + nSp, ring = n0 + (tipFree ? 0 : 1), R = Math.max(1.15, ring * G / (2 * Math.PI)), cx = -R, rp = [];
    for (let k = tipFree ? 0 : 1; k < ring; k++){ const a = 2 * Math.PI * k / ring; rp.push({ f: cx + Math.cos(a) * R, l: Math.sin(a) * R, fo: a }); }
    P.front = rp.slice(0, fr.length); P.spear = rp.slice(fr.length);
    P.back = Array.from({ length: nBk }, (_, k) => { const a = 2 * Math.PI * k / Math.max(1, nBk); return nBk > 1 ? { f: cx + Math.cos(a) * 0.55, l: Math.sin(a) * 0.55 } : { f: cx, l: 0 }; });
  } else {   // 일자 · 산개 (넓게): 칼은 편대장 양옆 · 창은 2열 · 사수 · 치유는 뒷줄
    P.front = tipFree ? fr.map((u, k) => ({ f: 0, l: (k - (fr.length - 1) / 2) * G })) : alt(fr.length, (n, s2) => ({ f: 0, l: s2 * n * G }));
    const r2 = loose ? 1.6 : 1.05; P.spear = Array.from({ length: nSp }, (_, k) => ({ f: -r2, l: (k === 0 ? 0 : (k % 2 ? 1 : -1) * Math.ceil(k / 2)) * G }));
    const rb = loose ? 3.0 : 2.2, gb = loose ? 2.4 : 1.3; P.back = Array.from({ length: nBk }, (_, k) => ({ f: -rb, l: (k - (nBk - 1) / 2) * gb }));
  }
  // v1.5 기준이 제 줄 (창 · 뒷줄) 에 섬: 그 줄 가운데 자리를 기준이 맡고 모든 자리를 기준에 맞춰 옮김 (칼이 기준 앞 · 공세선은 기준 앞)
  let off = { f: 0, l: 0 };
  if (tipFree){ const row = ldk === 'back' ? 'back' : 'spear', R0 = P[row]; if (R0.length){ let bi = 0; R0.forEach((q, k) => { const b0 = R0[bi]; if (Math.abs(q.l) < Math.abs(b0.l) - 1e-9 || (Math.abs(Math.abs(q.l) - Math.abs(b0.l)) < 1e-9 && q.f > b0.f)) bi = k; }); off = R0[bi]; P[row] = R0.filter((q, k) => k !== bi); } }
  const fc = F.face != null ? F.face : (ld.face || 0), px = -Math.sin(fc), py = Math.cos(fc), lat = u => (u.x - ld.x) * px + (u.y - ld.y) * py;
  const slots = { [ld.i]: { f: 0, l: 0, k: 'lead' } };
  for (const [k, list] of [['front', fr], ['spear', sp], ['back', bk]]){ const ps = P[k].slice().sort((a, b) => a.l - b.l), us = list.slice().sort((a, b) => lat(a) - lat(b)); us.forEach((u, j) => { const p = ps[j]; if (p) slots[u.i] = { f: +(p.f - off.f).toFixed(3), l: +(p.l - off.l).toFixed(3), fo: p.fo, k }; }); }
  for (const [ka, kb] of F.swaps || []){ const a = rest.find(u => fKey(u) === ka), b = rest.find(u => fKey(u) === kb); if (a && b && slots[a.i] && slots[b.i]){ const t = slots[a.i]; slots[a.i] = slots[b.i]; slots[b.i] = t; } }   // 편성 창에서 둘을 맞바꿈
  if (F.shape === '자유' && F.pin) for (const u of rest){ const q = F.pin[fKey(u)]; if (q && isFinite(q.f) && isFinite(q.l)) slots[u.i] = { f: +q.f, l: +q.l, k: fClass(W, u) }; }   // 자유 대형: 끌어 놓은 자리 그대로
  F.slots = slots;
}
// 맞붙음 (대형 자리를 떠나 보통 판단으로 싸움): 근접은 손 + engage 칸 안의 상대 · 돌진 · 도약 준비가 됐으면 노리는 상대가 그 거리 안 · 사수는 노리는 상대가 사거리 안 (또는 붙은 근접) · 치유 중
function formEng(W, u){
  const S = FRM(W), E = S.engage != null ? S.engage : 0.9;
  if (u.state === 'heal' && u.target && u.target.alive) return true;
  const kn = f => f.alive && !f.gone && f.side !== u.side && (u.side === 0 ? f.seenBy || canSee(W, u, f) : canSee(W, u, f));
  if (isFar(u)){ const t = u.target; return !!(t && kn(t) && gap(u, t) <= u.rng + 0.3 && u.ammo !== 0) || W.units.some(f => kn(f) && !isFar(f) && gap(u, f) <= Math.max(f.rng || 0.5, 0.5) + 0.8); }
  const t = u.target && kn(u.target) ? u.target : null;
  let far = 0; if (t){ if (u.canCharge && W.t >= u.chargeCd) far = Math.max(far, (W.rules.charge || {}).max || 5); if (u.canLeap && W.t >= u.leapCd) far = Math.max(far, 3.5); }
  if (t && gap(u, t) <= Math.max(u.rng + E, far)) return true;
  return W.units.some(f => kn(f) && (gap(u, f) <= u.rng + E || (!isFar(f) && gap(u, f) <= (f.rng || 0.5) + 0.6 && focusOf(W, f) === u)));
}
// 판을 만들 때: 편대 (페이지가 넘긴 fsq · 없으면 2편대 = 부대장과 그 편대원) · 편대장 · 모양 · 맞바꾼 자리 · 자유 자리
function formInit(W, setup){
  const FS = setup && setup.form; if (!FS) return;
  W.form = {};
  for (const u of W.units) if (u.side === 0){ const p = setup.units[u.i] || {}; u.fkey = p.fkey || null; u.fsq = p.fsq === 'A' || p.fsq === 'B' ? p.fsq : (u.sqLead != null || (u.rank === '부대장' && W.units.some(o => o.sqLead === u.i)) ? 'B' : 'A'); }
  for (const sq of ['A', 'B']){ const c = FS[sq] || {}, M = W.units.filter(u => u.side === 0 && u.alive && !u.summon && u.fsq === sq); if (!M.length) continue;
    const pk = c.lead != null ? M.find(u => fKey(u) === c.lead) : null, ld = pk && !pk.down && !pk.crawl ? pk : formLeadPick(W, M, sq);
    W.form[sq] = { sq, side: 0, lead: ld ? ld.i : null, shape: FORM_SHAPES.includes(c.shape) || c.shape === '자유' ? c.shape : (sq === 'A' ? '삼각' : '산개'), on: c.on !== false, style: c.style === 'loose' ? 'loose' : 'keep', swaps: (c.swaps || []).slice(-24), pin: c.pin || null, face: c.face != null ? +c.face : null, slots: {}, integ: 1, key: '' };
  }
}
// 매 틱: 편대장 (쓰러지면 다음) · 떼어 맡김 · 보는 쪽 · 제 자리 · 대형 유지율 · 걸음 (가장 느린 편대원) · 기록 (갖춤 · 무너짐)
function formTick(W, dt){
  const FS = W.form; if (!FS) return; const S = FRM(W), need = S.need || 0.7;
  for (const sq in FS){ const F = FS[sq]; if (!F) continue;
    const M = W.units.filter(u => u.alive && u.side === F.side && (u.fsq || 'A') === sq && !u.summon && !u.gone);
    let ld = F.lead != null ? W.units[F.lead] : null;
    if (!ld || !ld.alive || ld.gone || ld.down || ld.crawl || (ld.fsq || 'A') !== sq || (ld.koT && W.t < ld.koT)){
      const nl = formLeadPick(W, M.filter(u => !(u.koT && W.t < u.koT)), sq);
      if (nl && (!ld || nl.i !== ld.i)){ const was = ld; F.lead = nl.i; F.key = ''; nl.fdet = false; if (F.on && was && M.length > 1) L(W, { k: 'formLead', a: nl.i, b: was.i, sq, vis: true }); }
      ld = nl; }
    F.n = M.length; F.combat = W.units.some(f => f.alive && !f.gone && f.side !== F.side && (F.side === 0 ? f.seenBy : true)); F.act = !!(F.on && ld && M.length >= 2 && !(F.style === 'loose' && F.combat));   // 맞붙으면 각자 (loose): 아는 적이 있는 동안은 대형을 풂 (예전처럼 각자) · 싸움이 끝나면 다시
    if (!F.act){ F.integ = 1; if (ld) ld.fpK = null; continue; }
    for (const u of M) if (u !== ld){ if (u.order && FORM_DET.includes(u.order.k) && !u.order.form) u.fdet = true; if (!u.fdet && u.stay && !u.order) u.stay = null; }
    // 보는 쪽: 8칸 안에 아는 적이 있으면 가장 가까운 쪽 · 아니면 가는 쪽 · 걷는 쪽 · 그대로 — 천천히 (turn rad/초) 돎
    const kn = W.units.filter(f => f.alive && !f.gone && f.side !== F.side && (F.side === 0 ? f.seenBy : true) && dist(f, ld) < 8).sort((a, b) => dist(a, ld) - dist(b, ld))[0];
    const gl = ld.goal && Math.hypot(ld.goal.x - ld.x, ld.goal.y - ld.y) > 0.8 ? ld.goal : null, spd = Math.hypot(ld.vx || 0, ld.vy || 0);
    const want = kn ? Math.atan2(kn.y - ld.y, kn.x - ld.x) : gl ? Math.atan2(gl.y - ld.y, gl.x - ld.x) : spd > 0.3 ? Math.atan2(ld.vy, ld.vx) : F.face != null ? F.face : (ld.face || 0);
    if (F.face == null) F.face = want; else { let d = want - F.face; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; const mx = (S.turn || 1.4) * dt; F.face += Math.max(-mx, Math.min(mx, d)); }
    const inF = M.filter(u => !u.fdet && !u.down && !u.crawl), key = F.shape + '|' + ld.i + '|' + inF.map(u => u.i).join(',') + '|' + JSON.stringify(F.swaps || []) + '|' + (F.pinN || 0);
    if (key !== F.key){ F.key = key; formLayout(W, F, inF); }
    // 대형 유지율: 제 자리 tol 칸 안 (맞붙은 이는 engTol 칸 안이면 자리를 지키는 셈) · 걸음 = 맞붙지 않은 편대원 가운데 가장 느린 걸음
    const go = W.t - (F.go || -9) < 0.3; let nIn = 1, nAll = 1, pace = 99;
    for (const u of inF){ if (u === ld) continue; const s = F.slots[u.i]; if (!s) continue; nAll++;
      const p = formPt(W, F, s), d = Math.hypot(u.x - p.x, u.y - p.y), eng = formEng(W, u), tol = (s.k === 'back' ? S.tolBack || 1.25 : s.k === 'spear' ? S.tolSpear || 0.95 : S.tol || 0.8) + (go ? 0.3 : 0);
      u.fEng = eng; u.fD = +d.toFixed(2);
      if (d <= tol || (eng && d <= (S.engTol || 2.4))) nIn++;
      if (!eng) pace = Math.min(pace, formWalk(W, u)); }
    F.integ = nIn / nAll; F.nIn = nIn; F.nAll = nAll;
    const own = formWalk(W, ld); ld.fpK = go && pace < own ? Math.max(0.35, pace * 0.97 / own) : null; ld.fpKT = W.t + 0.15;   // 편대장 걸음: 가장 느린 편대원에 맞춤 (가는 중일 때만)
    const st = F.integ >= need ? 'form' : F.integ < 0.4 ? 'broken' : 'loose';
    if (st !== F.st){ F.st = st; F.stT = W.t; F.stLog = false; }
    if (!F.stLog && nAll >= 3 && W.t > 1 && W.t - F.stT >= (st === 'broken' ? 2 : 1)){
      const foes = W.units.some(f => f.alive && !f.gone && f.side !== F.side && (F.side === 0 ? f.seenBy : true));
      if (st === 'form' && F.lastLog !== 'form'){ F.stLog = true; F.lastLog = 'form'; L(W, { k: 'formForm', a: ld.i, sq, shape: F.shape, n: nAll, integ: +F.integ.toFixed(2), vis: true }); }
      else if (st === 'broken' && foes && F.lastLog !== 'broken'){ F.stLog = true; F.lastLog = 'broken'; L(W, { k: 'formBreak', a: ld.i, sq, shape: F.shape, n: nAll, integ: +F.integ.toFixed(2), vis: true }); } }
  }
}
// 편대장: 가는 중 대형이 need 아래면 그 자리에서 기다림 (공세선) — waitMax 초 넘게 기다리면 다시 갖출 때까지 그냥 감 (막힌 편대원 때문에 서지 않음)
function formWait(W, u){
  const F = formLed(W, u); if (!F) return false; const S = FRM(W); F.go = W.t;
  if (F.integ >= (S.need || 0.7)){ F.waitT0 = null; F.waitNo = false; return false; }
  if (F.waitNo) return false;
  { const g = u.order && u.order.x != null ? u.order : u.goal, dg = g ? Math.hypot(g.x - u.x, g.y - u.y) : 0;   /* v1.7 처진 이가 모두 가는 쪽에 있으면 기다리지 않고 가면서 만남 */
    if (dg > 1){ const lag = W.units.filter(m => m !== u && m.alive && !m.gone && !m.down && m.side === u.side && F.slots && F.slots[m.i] && !m.fdet && !m.fEng && m.fD != null && m.fD > (F.slots[m.i].k === 'back' ? S.tolBack || 1.25 : F.slots[m.i].k === 'spear' ? S.tolSpear || 0.95 : S.tol || 0.8));
      if (lag.length && lag.every(m => Math.hypot(g.x - m.x, g.y - m.y) < dg - 0.5)){ F.waitT0 = null; return false; } } }
  if (F.waitT0 == null){ F.waitT0 = W.t; if (W.t - (F.waitLogT || -9) > 5){ F.waitLogT = W.t; L(W, { k: 'formWait', a: u.i, sq: F.sq, integ: +F.integ.toFixed(2), vis: true }); } }
  if (W.t - F.waitT0 > (S.waitMax || 3)){ F.waitNo = true; F.waitT0 = null; return false; }
  return true;
}
// 편대장이 스스로 다가가는 중 (손 + engage 칸 밖): 대형이 need 아래면 상대를 보며 기다림
function formLeadHold(W, u, t, dt){
  if (!formLed(W, u) || isFar(u) || !t || gap(u, t) <= u.rng + (FRM(W).engage != null ? FRM(W).engage : 0.9)) return false;
  if (!formWait(W, u)) return false;
  stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '대형을 기다림', t.i); return true;
}
// 편대원 (편대장 아님 · 떼어 맡기지 않음 · 명령 없음): 맞붙지 않았으면 제 자리로 (처지면 뜀) · 자리에 가까우면 대형이 보는 쪽 (방진은 바깥) 을 봄
function formStep(W, u, dt){
  const F = formOf(W, u); if (!F || !F.act || F.lead === u.i || u.fdet || u.order || u.down || u.crawl || u.lie || u.gone) return false;
  if (u.fEng || (unarmed(u) && !u.noArms) || u.fill) return false;   // 맞붙음 · 무기 · 던진 창을 주우러 · 쓰러진 마디 메움은 보통 판단
  const s = F.slots[u.i]; if (!s) return false;
  const ld = W.units[F.lead], S = FRM(W); let p = formPt(W, F, s);
  if (p.x < 0.6 || p.y < 0.6 || p.x > W.map.W - 0.6 || p.y > W.map.H - 0.6 || boxRock(W, p.x, p.y, u.r * 0.9)){ const q = freeSpot(W, Math.max(0.6, Math.min(W.map.W - 0.6, p.x)), Math.max(0.6, Math.min(W.map.H - 0.6, p.y)), u.r); p = q || { x: ld.x, y: ld.y }; }
  const d = Math.hypot(p.x - u.x, p.y - u.y);
  if (d > 0.12){ if (d > (S.catchup || 1.6)) u.fRun = W.t + 0.3; setMood(W, u, d > 1.2 ? '대형 자리로' : '대형'); setGoal(W, u, p.x, p.y); follow(W, u, dt); }
  else { stop(u); setMood(W, u, '대형'); }
  if (d <= 1.2) u.fg = (F.face || 0) + (s.fo || 0);
  return true;
}
// 모여 (깃발): 떼어 맡긴 이 · 지키던 자리를 풀고 모두 대형으로 (페이지가 편대원에게 frally 명령을 지휘망으로 보냄 · 편대장은 깃발 자리로)
function formRally(W, sq, x, y){
  const F = W.form && W.form[sq]; if (!F) return null; F.on = true; F.key = ''; F.waitNo = false; const ld = F.lead != null ? W.units[F.lead] : null;
  F.flag = { x: x != null ? +x : ld ? ld.x : 0, y: y != null ? +y : ld ? ld.y : 0, t: W.t };
  L(W, { k: 'formRally', a: ld ? ld.i : null, sq, x: +F.flag.x.toFixed(1), y: +F.flag.y.toFixed(1), vis: true }); return F;
}
// 페이지 (편성 창 · 대형 띠): 모양 · 켜고 끔 · 편대장 · 맞바꾼 자리 · 자유 자리
function formSet(W, sq, p){
  const F = W.form && W.form[sq]; if (!F || !p) return null;
  if (p.shape && (FORM_SHAPES.includes(p.shape) || p.shape === '자유')) F.shape = p.shape;
  if (p.on != null) F.on = !!p.on;
  if (p.style) F.style = p.style === 'loose' ? 'loose' : 'keep';
  if (p.lead != null){ const u = W.units[p.lead]; if (u && u.alive && (u.fsq || 'A') === sq && !u.down && !u.crawl){ F.lead = u.i; u.fdet = false; } }
  if (p.swaps) F.swaps = p.swaps.slice(-24);
  if (p.pin){ F.pin = p.pin; F.pinN = (F.pinN || 0) + 1; }
  F.key = ''; F.waitNo = false; L(W, { k: 'formSet', sq, shape: F.shape, on: F.on, a: F.lead, vis: true }); return F;
}
// v8.7.3 우리 편의 기준: 따라감"""
rep("// v8.7.3 우리 편의 기준: 따라감", FORM)

# 걸음: 편대장은 가장 느린 편대원에 맞춤 (fpK) · 처진 편대원은 뜀 (fRun)
rep("|| (u.flee && W.t < u.flee.until) || (u.side === 1 && !u.order && u.ug",
    "|| (u.flee && W.t < u.flee.until) || (u.fRun != null && W.t < u.fRun) || (u.side === 1 && !u.order && u.ug")
rep("(W.t < (u.poolSlowT == null ? -9 : u.poolSlowT) ? (SPR(W, 'pool').slow || 0.7) : 1);",
    "(W.t < (u.poolSlowT == null ? -9 : u.poolSlowT) ? (SPR(W, 'pool').slow || 0.7) : 1) * (u.fpK && W.t < (u.fpKT || -9) ? u.fpK : 1);   /* v8.7.5 편대장은 가장 느린 편대원에 맞춤 */")
# 판을 만들 때 · 매 틱
rep("u.sqAuto = false; u.sqFix = true; } }); }   // v7.13 시작 배치의 편대 (2편대 = 부대장의 편대)",
    "u.sqAuto = false; u.sqFix = true; } }); }   // v7.13 시작 배치의 편대 (2편대 = 부대장의 편대)\n  formInit(W, setup);   /* v8.7.5 대형 (페이지가 넘길 때만) */")
rep("  lretTick(W, dt);   // v7.2 전열 조직 후퇴: 닻을 옮김 (처진 마디를 기다림)",
    "  lretTick(W, dt);   // v7.2 전열 조직 후퇴: 닻을 옮김 (처진 마디를 기다림)\n  formTick(W, dt);   /* v8.7.5 대형 */")
# 편대원: 맞붙지 않았으면 제 자리
rep("  if (pinDown(W, u, dt)) return;   // v5.2 쓰러진 [불사] 를 눌러 둠",
    "  if (pinDown(W, u, dt)) return;   // v5.2 쓰러진 [불사] 를 눌러 둠\n  if (u.side === 0 && !u.order && formStep(W, u, dt)) return;   /* v8.7.5 대형: 편대원은 맞붙지 않았으면 제 자리 */")
# 편대장: 스스로 다가갈 때 · 이동 · 공격 이동 · 탐험 — 대형이 70% 아래면 기다림
rep("  if (isFar(u)) shoot(W, u, t, dt, ordered); else melee(W, u, t, dt, ordered);",
    "  if (!ordered && formLeadHold(W, u, t, dt)) return;   /* v8.7.5 공세선: 편대장은 대형이 갖춰질 때 다가감 */\n  if (isFar(u)) shoot(W, u, t, dt, ordered); else melee(W, u, t, dt, ordered);")
rep("    { const d0 = Math.hypot(u.x - o.x, u.y - o.y), pc = o.pc || (o.pc = { t: W.t, d: d0 });",
    "    if (formWait(W, u)){ if (o.pc) o.pc.t = W.t; stop(u); u.fg = Math.atan2(o.y - u.y, o.x - u.x); setMood(W, u, '대형을 기다림'); return; }   /* v8.7.5 공세선 */\n    { const d0 = Math.hypot(u.x - o.x, u.y - o.y), pc = o.pc || (o.pc = { t: W.t, d: d0 });")
rep("    setMood(W, u, '공격 이동'); setGoal(W, u, o.x, o.y); follow(W, u, dt);",
    "    if (formWait(W, u)){ stop(u); u.fg = Math.atan2(o.y - u.y, o.x - u.x); setMood(W, u, '대형을 기다림'); return; }   /* v8.7.5 공세선 */\n    setMood(W, u, '공격 이동'); setGoal(W, u, o.x, o.y); follow(W, u, dt);")
rep("    if (!lag) follow(W, u, dt);\n  }\n}\nfunction frontier(W, u){",
    "    const fw = !lag && formLed(W, u) && u.path && u.path.length ? formWait(W, u) : false;   /* v8.7.5 대형이 70% 아래면 기다림 */\n    if (fw) setMood(W, u, '대형을 기다림'); else if (!lag) follow(W, u, dt);\n  }\n}\nfunction frontier(W, u){")
# 모여 명령 (지휘망으로 닿음): 떼어 맡김을 풂
rep("  if (o.k === 'swap'){ invOrder(W, u, o); return; }",
    "  if (o.k === 'frally'){ u.order = null; u.fdet = false; u.stay = null; setMood(W, u, '대형으로'); L(W, { k: 'frallyOk', a: u.i, vis: true }); return; }   /* v8.7.5 모여 */\n  if (o.k === 'swap'){ invOrder(W, u, o); return; }")
# 기준 (주인공 · 지휘관): 본대 대형이 켜져 있으면 편대장 · 편대원은 편대장을 따라감
rep("  let h = W.units.find(a => a.hero && ok(a)) || null;",
    "  let h = (() => { const F = W.form && W.form.A, a = F && F.act && F.lead != null ? W.units[F.lead] : null; return a && ok(a) && !a.down && !a.crawl ? a : null; })() || W.units.find(a => a.hero && ok(a)) || null;   /* v8.7.5 본대 대형이 켜져 있으면 편대장이 기준 */")
rep("function leadOf(W, u){ if (u.sqLead == null || u.hero) return null;",
    "function leadOf(W, u){ { const F = formOf(W, u); if (F && F.act && F.lead !== u.i && !u.fdet){ const D = W.units[F.lead]; if (D && D.alive && !D.down && !D.crawl) return D; } }   /* v8.7.5 편대원은 편대장을 따라감 */\n  if (u.sqLead == null || u.hero) return null;")

# ---------- O. 진형 버프 (K3) · 조합 버프 (K4) — 양쪽 같은 규칙 ----------
rep("  form8: { need: 0.7,",
    "  fbuf: { arc: 20, poise: 1.3, tipPoise: 1.2, shove: 1.2, aim: 1.1, slow: 0.9, loose: 0.85, slot: 1.3 },   /* v8.7.5 진형 버프: 방패벽 (앞줄 막는 폭 +arc° · 버팀 ×poise) · 쐐기 돌파 (밀치는 힘 ×shove · 꼭짓점 버팀 ×tipPoise) · 삼각 엄호 (꼭짓점 버팀 · 안쪽 사격 명중 ×aim) · 사방 경계 (옆 · 뒤도 정면 · 걸음 ×slow) · 흩어짐 (날아오는 탄 명중 ×loose) · 제 자리 slot 칸 안 */\n"
    "  combo: { link: 5, leap: 0.85, gang: 1.15, gangT: 6, fell: 0.15, sq2: 1.1, sq2T: 6 },   /* v8.7.5 조합 버프: 서로 link 칸 안에 이어진 무리 · 고블린즈 (도약 대기 ×leap · 냄새 나눔) · 갱스터 파라다이스 (동료를 친 상대에게 gangT 초 피해 ×gang) · 굴에 떨어진 이들 (서로 전하는 명령 +fell) · 노먼의 2편대 (노먼이 외친 표적 명중 · 피해 ×sq2) */\n"
    "  form8: { need: 0.7,")
rep("csense: tr.includes('전투센스'), berry: tr.includes('열매 맺기')", "csense: tr.includes('전투센스'), race: p.race || null, berry: tr.includes('열매 맺기')")   # v8.7.5 종족 (조합 버프 — 고블린즈)
FB = r"""
/* ---------- v8.7.5 진형 버프 (K3) · 조합 버프 (K4) — 양쪽 같은 규칙 ---------- */
// 진형 버프: 모양을 갖춘 (유지율 need 이상) 대형의 편대원 (제 자리 slot 칸 안 · 맞붙은 이 포함). 우리 대형 · 적의 대치 진형 (= 일자) · 쐐기 돌파 (= 쐐기) 모두 같은 셈.
//   일자 '방패벽' — 앞줄: 막는 폭 +20° · 밀려남 버팀 ×1.3 / 쐐기 '쐐기 돌파' — 모두: 밀치는 힘 ×1.2 · 꼭짓점 버팀 ×1.2 / 삼각 '삼각 엄호' — 꼭짓점 버팀 ×1.2 · 안쪽 (사수 · 치유) 사격 명중 ×1.1
//   방진 '사방 경계' — 옆 · 뒤에서 쳐도 정면처럼 (뒤치기 · 기습 배율 없음) · 걸음 ×0.9 / 산개 '흩어짐' — 날아오는 탄 · 화살 명중 ×0.85 / 자유 대형 — 진형 버프 없음
const FBUF = { 일자: '방패벽', 쐐기: '쐐기 돌파', 삼각: '삼각 엄호', 방진: '사방 경계', 산개: '흩어짐' };
const FBR = W => W.rules.fbuf || {};
function fbTick(W){
  const S = FBR(W), need = FRM(W).need || 0.7, put = (u, sh, row, back, tip) => { if (u && u.alive && !u.down && !u.gone) u.fb = { sh, nm: FBUF[sh], row, back: !!back, tip: !!tip }; };
  for (const u of W.units) u.fb = null;
  for (const sq in W.form || {}){ const F = W.form[sq]; if (!F || !F.act || !FBUF[F.shape]) continue;
    const on = F.integ >= need;
    if (on) for (const i in F.slots){ const u = W.units[i], s = F.slots[i]; if (!u || u.fdet) continue; if (u.i === F.lead || u.fEng || (u.fD != null && u.fD <= (S.slot || 1.3))){ const L0 = u.i === F.lead, lf = (F.ldk || 'front') === 'front'; put(u, F.shape, L0 ? (lf ? 'front' : 'rear') : s.f >= -0.3 ? 'front' : 'rear', L0 ? F.ldk === 'back' : s.k === 'back', L0 && lf); } }   /* v1.5 기준의 줄은 제 자리대로 */
    if (on !== !!F.fbOn){ F.fbOn = on; if (on ? F.fbLogOn !== F.shape || W.t - (F.fbT || -9) > 2 : W.t - (F.fbT || -9) > 2){ F.fbT = W.t; if (on) F.fbLogOn = F.shape; L(W, { k: on ? 'fbOn' : 'fbOff', side: F.side, sq, sh: F.shape, nm: FBUF[F.shape], a: F.lead, vis: true }); } } }   // 상태는 늘 맞추고 기록은 2초에 한 번 (모양이 바뀌면 바로)
  for (const side of [1, 2]){   // 적의 대치 진형 = 일자 (앞줄 = 전선)
    const St = W.stance && W.stance[side]; if (!St || St.k !== 'hold' || !St.slots) continue;
    const ids = Object.keys(St.slots).map(Number).filter(i => W.units[i] && W.units[i].alive && !W.units[i].gone && W.units[i].side === side);
    const inn = ids.filter(i => { const u = W.units[i], p = St.slots[i]; return Math.hypot(u.x - p.x, u.y - p.y) <= (S.slot || 1.3) || W.units.some(f => f.alive && f.side !== side && gap(u, f) <= Math.max(u.rng, 0.5) + 0.9); });
    const on = ids.length >= 3 && inn.length / ids.length >= need; if (on) for (const i of inn){ const u = W.units[i]; put(u, '일자', u.role === '전선' ? 'front' : 'rear', isFar(u) || u.cls === '치유', false); }
    const k = 'fbE' + side; if (on !== !!W[k]){ W[k] = on; if (W.t - (W[k + 'T'] || -9) > 2){ W[k + 'T'] = W.t; L(W, { k: on ? 'fbOn' : 'fbOff', side, sh: '일자', nm: FBUF['일자'], vis: inn.some(i => W.units[i].seenBy) }); } } }
  const V = W.wedge, tp = V && W.units[V.tip];   // 적의 쐐기 돌파 = 쐐기
  if (tp && tp.alive && !V.cancel){ const dx = V.aim.x - tp.x, dy = V.aim.y - tp.y, dl = Math.hypot(dx, dy) || 1, ax = dx / dl, ay = dy / dl, px = -ay, py = ax;
    const mem = [...V.sh, ...V.body].map(j => W.units[j]).filter(o => o && o.alive && !o.gone), slot = j => { const s2 = V.sh.indexOf(j), b2 = V.body.indexOf(j), back = s2 >= 0 ? 0.95 : 1.9 + Math.floor(b2 / 2) * 0.9, lat = s2 >= 0 ? (s2 ? -0.9 : 0.9) : (b2 % 2 ? -0.6 : 0.6); return { x: tp.x - ax * back + px * lat, y: tp.y - ay * back + py * lat }; };
    const inn = mem.filter(o => { const p = slot(o.i); return Math.hypot(p.x - o.x, p.y - o.y) <= (S.slot || 1.3) || W.units.some(f => f.alive && f.side !== o.side && gap(o, f) <= Math.max(o.rng, 0.5) + 0.9); });
    if (mem.length >= 2 && (inn.length + 1) / (mem.length + 1) >= need){ put(tp, '쐐기', 'front', false, true); for (const o of inn) put(o, '쐐기', V.sh.includes(o.i) ? 'front' : 'rear', isFar(o), false); } }
}
const fbPoise = (W, t) => { const b = t.fb; if (!b) return 1; const S = FBR(W); return b.sh === '일자' && b.row === 'front' ? S.poise || 1.3 : (b.sh === '쐐기' || b.sh === '삼각') && b.tip ? S.tipPoise || 1.2 : 1; };
const fbShove = (W, a) => a && a.fb && a.fb.sh === '쐐기' ? FBR(W).shove || 1.2 : 1;
// 조합 버프 (도감의 무리): 같은 편 · 서로 link 칸 안으로 이어진 이들 가운데 min 명 넘게 (need = 꼭 있어야 하는 이)
const COMBO = [
  { k: 'gob', nm: '고블린즈', min: 2, who: u => u.race === '고블린' || (u.traits || []).includes('종족:고블린'), why: '[종족:고블린] — 청광묵 · 트라카 (도감: 같은 고향 · 후각B · 도약 · 강자에게 복종하는 공동체)', fx: '냄새를 나눔 (한 고블린이 맡은 상대 자리를 모두 앎) · 도약 대기 ×0.85' },
  { k: 'gang', nm: '갱스터 파라다이스', min: 2, who: u => ['C-195', 'C-197', 'C-262'].includes(u.ref) || /갱스터/.test(u.name || ''), why: '갱스터 — 간두 · 쟝 · 가리 (도감 2기: 의리파 갱스터 · 조직원)', fx: '의리 — 동료 갱스터를 친 상대에게 6초 동안 피해 ×1.15' },
  { k: 'fell', nm: '굴에 떨어진 이들', min: 3, who: u => ['C-001', 'C-002', 'C-003', 'C-004'].includes(u.ref), why: '확정 일행 — 인주 · 레베카 · 카리우스 · 청광묵 (1편대 · 카리우스는 인주의 명령을 같이 외침)', fx: '서로의 목소리를 앎 — 이들끼리 전하는 명령 +15%p' },
  { k: 'sq2', nm: '노먼의 2편대', min: 2, who: u => ['C-007', 'C-004', 'C-106'].includes(u.ref), need: u => u.ref === 'C-007', why: '2편대장 노먼 — 청광묵 · 친칠라 지휘 (도감)', fx: '노먼이 외친 표적을 칠 때 명중 · 피해 ×1.1' },
];
const cbHas = (u, k) => !!(u && u.cb && u.cb.includes(k));
function comboTick(W){
  const S = W.rules.combo || {}, link = S.link || 5; for (const u of W.units) u.cb = null; W.combos = [];
  for (const C of COMBO) for (const side of [0, 1, 2]){
    const M = W.units.filter(u => u.alive && !u.gone && !u.down && u.side === side && C.who(u)); if (M.length < C.min) continue;
    const seen = new Set();
    for (const a of M){ if (seen.has(a)) continue; const comp = [], st = [a]; seen.add(a); while (st.length){ const x = st.pop(); comp.push(x); for (const y of M) if (!seen.has(y) && dist(x, y) <= link){ seen.add(y); st.push(y); } }
      if (comp.length < C.min || (C.need && !comp.some(C.need))) continue;
      for (const u of comp) (u.cb || (u.cb = [])).push(C.k);
      W.combos.push({ k: C.k, nm: C.nm, side, ids: comp.map(u => u.i) });
      const ky = C.k + side; if (!(W.comboSeen || (W.comboSeen = {}))[ky]){ W.comboSeen[ky] = 1; L(W, { k: 'combo', c: C.k, nm: C.nm, side, ids: comp.map(u => u.i), vis: side === 0 || comp.some(u => u.seenBy) }); }
      if (C.k === 'gob') for (const x of comp) for (const y of comp){ if (x === y) continue; for (const f of W.units){ const s = x.sense[f.i]; if (!f.alive || f.side === side || !s || !s.smell || W.t - s.t > 0.5) continue; const o = y.sense[f.i]; if (!o || o.t < s.t - 0.05) y.sense[f.i] = { ...s, shared: x.i }; } }   // 냄새를 나눔
    } }
}
// 피해 · 명중: 갱스터의 의리 (동료를 친 상대) · 노먼의 2편대 (노먼이 외친 표적)
const sq2On = (W, u, t) => { if (!cbHas(u, 'sq2') || u.ref === 'C-007') return false; const N = W.units.find(o => o.alive && o.side === u.side && o.ref === 'C-007' && cbHas(o, 'sq2')); return !!(N && N.sqFocus && N.sqFocus.b === t.i && W.t - N.sqFocus.t < ((W.rules.combo || {}).sq2T || 6)); };
const cbDmg = (W, u, t) => (u.gangMark && u.gangMark.b === t.i && W.t < u.gangMark.until ? (W.rules.combo || {}).gang || 1.15 : 1) * (sq2On(W, u, t) ? (W.rules.combo || {}).sq2 || 1.1 : 1);
function fbAim(W, u, t, p){
  const S = FBR(W);
  if (u.fb && u.fb.sh === '삼각' && u.fb.back) p *= S.aim || 1.1;   // 삼각 엄호: 큰 몸 뒤에서 차분히
  if (t.fb && t.fb.sh === '산개') p *= S.loose || 0.85;   // 흩어짐: 사이가 넓어 덜 맞음
  if (sq2On(W, u, t)) p *= (W.rules.combo || {}).sq2 || 1.1;
  return Math.max(0.02, Math.min(0.99, p));
}
"""
rep("/* ---------- v8.7.5 대형 (J7 · J16 · I20) ---------- */", FB + "/* ---------- v8.7.5 대형 (J7 · J16 · I20) ---------- */")
rep("  formTick(W, dt);   /* v8.7.5 대형 */", "  formTick(W, dt);   /* v8.7.5 대형 */\n  W.fbT = (W.fbT || 0) - dt; if (W.fbT <= 0){ W.fbT = 0.2; fbTick(W); comboTick(W); }   /* v8.7.5 진형 · 조합 버프 */")
# 방패벽: 앞줄 막는 폭
rep("  if (t.shield && t.act && t.act.k === 'atk') a *= (W.rules.guard || {}).strikeArc || 0.6;\n  return a;\n}",
    "  if (t.shield && t.act && t.act.k === 'atk') a *= (W.rules.guard || {}).strikeArc || 0.6;\n  return a + (t.fb && t.fb.sh === '일자' && t.fb.row === 'front' ? FBR(W).arc || 20 : 0);   /* v8.7.5 방패벽 */\n}")
# 명중: 삼각 엄호 · 흩어짐 · 2편대
rep("  if (terrOn(W)) p *= terrAim(W, u, t, arc);   // v7.18 엄폐 · 고저\n  return Math.max(0.02, Math.min(0.99, p));",
    "  if (terrOn(W)) p *= terrAim(W, u, t, arc);   // v7.18 엄폐 · 고저\n  if (u.fb || t.fb || u.cb) p = fbAim(W, u, t, p);   /* v8.7.5 진형 · 조합 버프 */\n  return Math.max(0.02, Math.min(0.99, p));")
# 밀려남: 버팀 (방패벽 앞줄 · 쐐기 · 삼각 꼭짓점) · 밀치는 힘 (쐐기 돌파)
rep("function kbLen(W, a, t, power, am){ const S = W.rules.shove || {}, tm = t.mass * (t.poise || 1),",
    "function kbLen(W, a, t, power, am){ power *= fbShove(W, a); const S = W.rules.shove || {}, tm = t.mass * (t.poise || 1) * fbPoise(W, t),   /* v8.7.5 진형 버프 */")
# 피해: 의리 · 2편대
rep("const base = hiMelee(W, u, t, isF || !!J) * u.atk * u.atkMul *", "const base = hiMelee(W, u, t, isF || !!J) * u.atk * u.atkMul * (u.gangMark || u.cb ? cbDmg(W, u, t) : 1) *")
# 사방 경계: 옆 · 뒤도 정면처럼
rep("  let dir = arcX ? 'front' : sideOf(W, t, u);", "  let dir = arcX || (t.fb && t.fb.sh === '방진') ? 'front' : sideOf(W, t, u);   /* v8.7.5 사방 경계 */")
# 의리: 갱스터가 맞으면 곁의 갱스터가 그 상대를 기억함
rep("function applyDmg(W, u, t, dmg, o){", "function applyDmg(W, u, t, dmg, o){\n  if (u && t.cb && t.cb.includes('gang') && u.side !== t.side && dmg > 0) for (const p of W.units) if (p !== t && p.alive && p.side === t.side && cbHas(p, 'gang')) p.gangMark = { b: u.i, until: W.t + ((W.rules.combo || {}).gangT || 6) };   /* v8.7.5 갱스터 파라다이스 — 의리 */")
# 도약 대기: 고블린즈
rep("u.leapCd = W.t + leapCdNext(W, u, R);", "u.leapCd = W.t + leapCdNext(W, u, R) * (cbHas(u, 'gob') ? (W.rules.combo || {}).leap || 0.85 : 1);", 2)
# 명령 전달: 굴에 떨어진 이들끼리
rep("let p = l.p * (s.hop > 0 ? (K.relay || 0.9) * qf(s.u) * (s.hop > 1 ? X.hop2 || 0.85 : 1) : 1); p = Math.min(K.max || 0.98, p);",
    "let p = l.p * (s.hop > 0 ? (K.relay || 0.9) * qf(s.u) * (s.hop > 1 ? X.hop2 || 0.85 : 1) : 1); if (cbHas(s.u, 'fell') && cbHas(m, 'fell')) p += (W.rules.combo || {}).fell || 0.15; p = Math.min(K.max || 0.98, p);   /* v8.7.5 굴에 떨어진 이들 — 서로의 목소리 */")
# 사방 경계: 걸음 ×0.9
rep("* (u.fpK && W.t < (u.fpKT || -9) ? u.fpK : 1);   /* v8.7.5 편대장은 가장 느린 편대원에 맞춤 */",
    "* (u.fpK && W.t < (u.fpKT || -9) ? u.fpK : 1) * (u.fb && u.fb.sh === '방진' ? FBR(W).slow || 0.9 : 1);   /* v8.7.5 편대장은 가장 느린 편대원에 맞춤 · 사방 경계는 느림 */")

# ---------- P. 좁은 길 비켜서기 (J12) · 모닝스타 좁은 골목 (A6) — 양쪽 같은 규칙 ----------
# J12: 하나만 가는 중 · 서 있는 쪽이 옆으로 비킬 곳이 없는 좁은 칸이고 싸우는 중이 아니면 → 몸을 붙여 지나가게 둠 (0.5초 그 둘은 밀지 않음 · 지나가는 쪽 걸음 ×0.6). 싸우는 중이면 그대로 (좁은 길의 1대1)
rep("  const cr = Math.cos(h) * (S.y - M.y) - Math.sin(h) * (S.x - M.x), sg = cr >= 0 ? 1 : -1, kk = k * 1.5;\n  tryMove(W, S, S.x + Math.cos(h + sg * Math.PI / 2) * kk, S.y + Math.sin(h + sg * Math.PI / 2) * kk);   // 서 있는 쪽이 길 옆으로",
    "  const cr = Math.cos(h) * (S.y - M.y) - Math.sin(h) * (S.x - M.x), sg = cr >= 0 ? 1 : -1, kk = k * 1.5, nx = S.x + Math.cos(h + sg * Math.PI / 2) * kk, ny = S.y + Math.sin(h + sg * Math.PI / 2) * kk;\n"
    "  if ((tightAt(W, S) || tightAt(W, M) || boxRock(W, nx, ny, S.r * 0.9)) && !S.act && !(S.order && S.order.k === 'hold') && !W.units.some(f => f.alive && f.side !== S.side && gap(S, f) <= Math.max(S.rng, 0.5) + 0.6)){   /* v8.7.5 좁은 길 (J12): 옆으로 비킬 곳이 없음 — 몸을 붙여 지나가게 둠 (싸우는 중이면 그대로) */\n"
    "    M.sqzP = S.i; M.sqzT = W.t + 0.5; S.sqzP = M.i; S.sqzT = W.t + 0.5; M.sqzSlow = W.t + 0.5;\n"
    "    if (W.t - (M.sqzLogT || -9) > 5){ M.sqzLogT = W.t; L(W, { k: 'squeeze', a: M.i, b: S.i, vis: M.side === 0 || !!M.seenBy }); } return; }\n"
    "  tryMove(W, S, nx, ny);   // 서 있는 쪽이 길 옆으로")
rep("    if (d >= need) continue;\n    if ((P.act && P.act.air) || (Q.act && Q.act.air)) continue;",
    "    if (d >= need) continue;\n    if (P.side === Q.side && ((P.sqzP === Q.i && W.t < P.sqzT) || (Q.sqzP === P.i && W.t < Q.sqzT))) continue;   /* v8.7.5 좁은 길: 몸을 붙여 지나가는 중 */\n    if ((P.act && P.act.air) || (Q.act && Q.act.air)) continue;")
rep("* (u.fb && u.fb.sh === '방진' ? FBR(W).slow || 0.9 : 1);   /* v8.7.5 편대장은 가장 느린 편대원에 맞춤 · 사방 경계는 느림 */",
    "* (u.fb && u.fb.sh === '방진' ? FBR(W).slow || 0.9 : 1) * (u.sqzSlow && W.t < u.sqzSlow ? 0.6 : 1);   /* v8.7.5 편대장은 가장 느린 편대원에 맞춤 · 사방 경계는 느림 · 좁은 길에서 몸을 붙여 지나감 */")
# A6: 좁은 골목 (좁은 칸) 의 철퇴 — 돌리지 못함 (붙어 휘두르기 · 후리기 없음) · 앞뒤로 던지기만
rep("  const fl = !!FL && gap(u, t) > (FL.close || 0.9) && !(gap(u, t) <= (FL.sw || 1.3) && W.rand() < (FL.swingP || 0.25));",
    "  const alley = !!FL && tightAt(W, u), fl = !!FL && (alley || (gap(u, t) > (FL.close || 0.9) && !(gap(u, t) <= (FL.sw || 1.3) && W.rand() < (FL.swingP || 0.25))));   /* v8.7.5 좁은 골목 (A6): 철퇴를 돌리지 못하고 앞뒤로 던지기만 */")
rep("why: heal ? '' : why || '', mode, sm, ...(fl ? { fl: true } : {}) };", "why: heal ? '' : why || '', mode, sm, ...(fl ? { fl: true } : {}), ...(alley ? { alley: true } : {}) };")
rep("t0: W.t, dur: wind * smW, heal, mode, ...(fl ? { fl: true } : {}) });", "t0: W.t, dur: wind * smW, heal, mode, ...(fl ? { fl: true } : {}), ...(alley ? { alley: true } : {}) });")
rep("  if (specReady(W, u, 'sweep')){ const S3 = SPR(W, 'sweep'),", "  if (specReady(W, u, 'sweep') && !(flailOf(W, u) && tightAt(W, u))){ const S3 = SPR(W, 'sweep'),   /* v8.7.5 좁은 골목엔 돌리지 못함 */")
rep("    if (o.s === 'sweep' || o.s === 'ward'){ if (specReady(W, u, o.s)){",
    "    if (o.s === 'sweep' && flailOf(W, u) && tightAt(W, u)){ u.order = null; setMood(W, u, '좁은 골목 — 철퇴를 돌릴 수 없음'); L(W, { k: 'alleyNo', a: u.i, s: 'sweep', vis: u.side === 0 || !!u.seenBy }); return; }   /* v8.7.5 A6 */\n    if (o.s === 'sweep' || o.s === 'ward'){ if (specReady(W, u, o.s)){")

# ---------- v1.4 모여 (frally): 기록 글 · 하던 동작을 멈추고 대형으로 ----------
rep("const orderTxt = (o, u) => o && o.k === 'alt' ? ['alt'] :", "const orderTxt = (o, u) => o && o.k === 'frally' ? ['frally'] : o && o.k === 'alt' ? ['alt'] :")
rep("  const mv = o && (o.k === 'move' || o.k === 'amove' || o.k === 'hold' || o.k === 'watch' || o.k === 'lret' || o.k === 'scout' || o.k === 'torchGet');",
    "  const mv = o && (o.k === 'move' || o.k === 'amove' || o.k === 'hold' || o.k === 'watch' || o.k === 'lret' || o.k === 'scout' || o.k === 'torchGet' || o.k === 'frally');   /* v8.7.5 모여도 바로 */")

# ---------- v1.6 대장 (출구 · 따라 나섬) 은 대형의 기준과 따로 ----------
rep("const isAnc = (W, u) => u.side === 0 && ancOf(W) === u;\n",
    "const isAnc = (W, u) => u.side === 0 && ancOf(W) === u;\n"
    "// v8.7.5 대장 (출구로 따라 나섬 · 마지막에 나감 · 출구 찾기 · 나간 대장 따라가기 · 여정 시작 모임): 대형의 기준 (ancOf) 과 따로 — 주인공이 있으면 주인공, 없으면 지휘관, 그도 없으면 남은 이 가운데 하나\n"
    "function chiefOf(W){\n"
    "  if (W.chfT === W.t) return W.chf;\n"
    "  const ok = a => a && a.alive && a.side === 0 && !a.gone && !a.summon;\n"
    "  let h = W.units.find(a => a.hero && ok(a)) || null;\n"
    "  if (!h){ const c = cmdBoss(W, 0); if (ok(c) && !c.down && !c.crawl) h = c; }\n"
    "  if (!h) h = W.units.find(a => ok(a) && !a.down && !a.crawl) || null;\n"
    "  W.chfT = W.t; W.chf = h; return h;\n"
    "}\n"
    "const isChief = (W, u) => u.side === 0 && chiefOf(W) === u;\n")
rep("  const wasAnc = u.side === 0 && ancOf(W) === u;   /* v8.7.3 */", "  const wasAnc = u.side === 0 && chiefOf(W) === u;   /* v8.7.3 · v8.7.5 대장 (대형의 기준과 따로) */")
rep("L(W, { k: 'leave', a: u.i, dir, vis: true }); W.lightT = 0; W.ancT = null;", "L(W, { k: 'leave', a: u.i, dir, vis: true }); W.lightT = 0; W.ancT = null; W.chfT = null;")
rep("  if (!isAnc(W, u) || W.over) return false;\n  const rest = W.units.filter(a => a !== u && a.alive && a.side === 0 && !a.gone", "  if (!isChief(W, u) || W.over) return false;   /* v8.7.5 대장 */\n  const rest = W.units.filter(a => a !== u && a.alive && a.side === 0 && !a.gone")
rep("  const A = ancOf(W), lead = A && A !== u && A.order && A.order.k === 'exit' && !A.down ? A : null;", "  const A = chiefOf(W), lead = A && A !== u && A.order && A.order.k === 'exit' && !A.down ? A : null;   /* v8.7.5 대장 */")
rep("if (!u.exQlog){ u.exQlog = true; if (isAnc(W, u) || !lead)", "if (!u.exQlog){ u.exQlog = true; if (isChief(W, u) || !lead)")

# ---------- D. 시험용 내보내기 ----------
rep("lungeChk, stepOK, mvAim, strafeWant, running, h2Cast", "lungeChk, stepOK, mvAim, strafeWant, running, ancOf, giveWay, tightAt, startAct, specAuto, fbTick, comboTick, fbPoise, fbShove, fbAim, cbDmg, cbHas, COMBO, FBUF, guardArc, kbLen, aimP, formInit, formTick, formLayout, formStep, formWait, formEng, formRally, formSet, formLeadPick, formPt, formOf, fClass, FORM_SHAPES, h2Cast")

rep("lungeChk, stepOK, mvAim, strafeWant, running, ancOf,", "lungeChk, stepOK, mvAim, strafeWant, running, ancOf, chiefOf,")   # v1.6

for n, s in P.items():
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8750 OK')
