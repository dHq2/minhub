
/* ---------- 세상 만들기 ---------- */
// 등급 특성 [속력A] · [괴력B] … 의 배율 (없으면 1)
// v5.5.2 사격 솜씨 [사격X]: 원거리 명중에서 남은 빗나감을 줄이는 몫 (없으면 0)
function marksOf(rules, traits){ for (const t of traits || []) if (/^사격[SABC]$/.test(t)){ const g = rules.grades && rules.grades['사격']; return (g && g[t.slice(-1)]) || { S: 0.7, A: 0.55, B: 0.4, C: 0.25 }[t.slice(-1)]; } return 0; }
// v6.7 [급소X]: 치명 (약점) 확률 + (없으면 0) · [발화X]: 화상 등급 배율 (없으면 0)
function vitOf(rules, traits){ for (const t of traits || []) if (/^급소[SABC]$/.test(t)){ const g = rules.grades && rules.grades['급소']; return (g && g[t.slice(-1)]) || { S: 0.25, A: 0.18, B: 0.12, C: 0.06 }[t.slice(-1)]; } return 0; }
function fireOf(rules, traits){ for (const t of traits || []) if (/^발화[SABCDE]$/.test(t)){ const g = (rules.burn || {}).g || {}; return g[t.slice(-1)] || 1; } return 0; }
function gradeMul(rules, traits, key){ for (const t of traits || []) if (t.length === key.length + 1 && t.startsWith(key)){ const g = rules.grades && rules.grades[key]; return (g && g[t.slice(-1)]) || 1; } return 1; }
// v5.0 역할 (포지션): 따로 정하지 않으면 장비 · 직업으로 — 방패 = 전선, 포위 사냥 · 기동 = 미드필더, 원거리 무기 = 사수, 치유 · 지휘 = 지원, 근접 = 공격수
const ROLE_NAMES = ['전선', '미드필더', '공격수', '사수', '지원'];
// v5.4 원거리 무기 = 종류가 총포류 · 활 · 마법 (사거리로 가르지 않음 — 장창은 사거리 1.5 여도 근접)
const RANGED_KIND = ['총포류', '활', '마법'];
const isRangedW = w => !!w && (w.kind ? RANGED_KIND.includes(w.kind) : w.rng > 1);
function roleOf(p, rules){
  if (p.role && ROLE_NAMES.includes(p.role)) return p.role;
  const w = p.weapon && rules && rules.weapons && rules.weapons[p.weapon];
  if (p.shield || (p.traits || []).includes('거구')) return '전선';   // v5.2 [거구] = 몸이 방패 (중전차)
  if (p.tac === 'pack' || p.cls === '기동') return '미드필더';
  if (w ? isRangedW(w) : p.cls === '원거리') return '사수';
  if (p.cls === '치유' || p.cls === '지휘') return '지원';
  return '공격수';
}
const roleStat = (p, rules) => (rules.roles && rules.roles[roleOf(p, rules)]) || {};
// v5.1 방어구: p.gear = { 몸: { name, mat, tier }, 머리: { … } } (재질 = rules.armor). [갑피] 는 몸에 판금 · 투구 (galpi 등급, 무게 없음) — 더 좋은 장비면 그 칸은 장비
const GEAR_SLOTS = ['몸', '머리'];
function gearOf(p, rules){
  const G = p.gear || {}, A = rules.armor || {}, out = {};
  for (const slot of GEAR_SLOTS){ const it = G[slot]; if (it && A[it.mat]) out[slot] = { name: it.name || it.mat, mat: it.mat, tier: Math.max(1, Math.min(5, Math.round(+it.tier || 1))), dur: it.dur != null && isFinite(+it.dur) ? Math.max(0, Math.min(100, +it.dur)) : 100, size: it.size || null, own: it.own || null }; }   // v7.20 내구도 · 체급 · 원래 주인
  const gpT = (p.traits || []).map(x => /^갑피(SS|[SABCD])?$/.exec(x)).find(Boolean);   /* v8.7.4 갑피 등급 — SS 6 (S 보다 한 단계 위 — 이 판의 장비는 5성까지) · S 5 · A 4 · B 3 · C 2 · D 1 (등급 없으면 rules.galpi) */
  if (gpT){
    const tg = gpT[1] ? { SS: 6, S: 5, A: 4, B: 3, C: 2, D: 1 }[gpT[1]] : rules.galpi || 3;
    if (A['판금'] && (!out['몸'] || out['몸'].tier < tg)) out['몸'] = { name: '갑피', mat: '판금', tier: tg, innate: true, ...(out['몸'] ? { under: out['몸'] } : {}) };
    if (A['투구'] && (!out['머리'] || out['머리'].tier < tg)) out['머리'] = { name: '갑피', mat: '투구', tier: tg, innate: true, ...(out['머리'] ? { under: out['머리'] } : {}) };   /* v7.23.3 덮인 장비는 under 로 남음 (쓰러지면 전리품) */
    for (const [sl, mt] of [['몸', '판금'], ['머리', '투구']]) if (A[mt] && out[sl] && !out[sl].innate) out[sl].over = { name: '갑피', mat: mt, tier: tg, innate: true };   /* v8.7.6 갑피보다 단단한 장비는 갑피 위에 — 벗거나 망가지면 갑피로 */
  }
  return out;
}
const gearW = (g, rules, bs) => Object.values(g || {}).reduce((s, it) => s + (it.innate ? 0 : it.tier * (((rules.armor || {})[it.mat] || {}).w || 0) * gearWK(rules, it, bs)), 0);
// v7.20 한 단계 큰 갑옷은 무겁고 (× 1 + big), 남의 장비 (몸에 맞춘 게 아님) 는 × foreign.w — bs = { size: 몸 체급, ref: 주인 }
const gearWK = (rules, it, bs) => { const I = rules.inv || {}; let k = 1; if (!bs) return k; if (it.size && (SIZE_RANK[it.size] || 0) > (SIZE_RANK[bs.size] != null ? SIZE_RANK[bs.size] : 1)) k *= 1 + (I.big != null ? I.big : 0.35); if (it.own && bs.ref && it.own !== bs.ref) k *= (I.foreign || {}).w || 1.1; return k; };
const sizeP = p => p.sizeCls || ((p.traits || []).includes('거구') || p.modBody || (p.traits || []).includes('개조된 신체') ? '대형' : (+p.height || 1.7) >= 2 ? '중대형' : ((+p.height || 1.7) < 1.45 || (+p.weight > 0 && +p.weight < 45)) ? '소형' : '중형');
const bsOf = p => ({ size: sizeP(p), ref: p.ref || ('#' + String(p.name || '').replace(/\s*\d+$/, '')) });
const isMB = p => !!p.modBody || (p.traits || []).includes('개조된 신체') || (p.unique || []).includes('개조된 신체');
const eqRuleP = (rules, p) => p.eq || (isMB(p) ? ((rules.inv || {}).modBody || null) : null);
const bagCapP = (rules, p) => +p.bagCap || (eqRuleP(rules, p) || {}).cap || ((rules.inv || {}).cap || {})[sizeP(p)] || 8;
// v7.20 입을 · 들 수 있나 (설계 소지품 화면 · 전리품 공통): 못 하면 까닭, 되면 ''
function wearWhy(rules, p, it){
  const E = eqRuleP(rules, p) || {}, nm = p.name || '', W0 = rules.weapons || {}, bs = SIZE_RANK[sizeP(p)] != null ? SIZE_RANK[sizeP(p)] : 1;
  if (!it) return '없음';
  if (it.k === 'armor' || it.k === 'helm'){
    if (it.dur != null && it.dur <= 0) return '망가짐';
    if (it.k === 'armor' && E.body === false) return nm + ' 몸에 맞는 갑옷은 없음 (투구만)';
    const hs = p.headSize || E.head, b = it.k === 'helm' && hs && SIZE_RANK[hs] != null ? SIZE_RANK[hs] : bs, a = it.size && SIZE_RANK[it.size] != null ? SIZE_RANK[it.size] : b;
    if (a < b) return (it.k === 'helm' ? '머리' : '몸') + '에 비해 작음 (' + it.size + ')'; if (a > b + 1) return '너무 큼 (' + it.size + ')'; return ''; }
  if (it.k === 'shield'){ const wp = W0[p.weapon] || {}; if (it.dur != null && it.dur <= 0) return '부서짐'; if (p.shield) return '이미 방패를 듦'; if (wp.two) return '두 손 무기 (' + p.weapon + ') 를 든 채로는 방패를 못 듦'; if (isRangedW(wp) && !(p.traits || []).includes('대방패')) return '원거리 무기 (' + p.weapon + ') 를 든 채로는 방패를 못 듦'; return ''; }
  if (it.k === 'weapon'){ const wp = W0[it.name]; if (!wp) return '모르는 무기'; if (E.ranged === false && isRangedW(wp)) return '원거리 무기를 못 씀 (' + nm + ' — 손이 기형)';
    if (wp.req && !sizeOK({ sizeCls: sizeP(p) }, wp.req, (p.traits || []).some(x => /^근력/.test(x)))) return '근력이 모자람 (' + wp.req + ' 이상 · 근력)';
    if (p.shield && (wp.two || (isRangedW(wp) && !(p.traits || []).includes('대방패')))) return '방패를 든 채로는 못 듦 (' + (wp.two ? '두 손 무기' : '원거리') + ')'; if (it.dur != null && it.dur <= 0 && !isRangedW(wp)) return '부러짐'; return ''; }
  if (it.k === 'ammo') return '탄은 쓰는 무기에 저절로 채움';
  return '끼울 수 없음';
}
// 맞은 부위 · 무기 종류에 따른 방어구 받는 피해 ×
function armorMul(rules, t, part, wk){
  const it = t.gear && t.gear[part === '머리' ? '머리' : '몸']; if (!it) return { m: 1, it: null };
  if (it.dur != null && it.dur <= 0) return { m: 1, it: null, broken: it };   // v7.20 망가진 갑옷 · 투구는 막지 못함
  const M = (rules.armor || {})[it.mat]; if (!M || !M.vs || M.vs[wk] == null) return { m: 1, it };
  const lo = (rules.dur || {}).low || 25, f = it.dur != null && it.dur < lo ? 0.5 + 0.5 * it.dur / lo : 1;   // v7.20 낡으면 막는 몫이 줆
  return { m: Math.max(0.15, Math.min(1, 1 - (1 - M.vs[wk]) * it.tier / 3 * f)), it };
}
// 입기 · 벗기 (싸우는 중에도): 같은 칸은 바뀜 (예: 노먼의 방탄복 2성 → 갑주 5성 = 무게가 늘고 더 막음). item = null 이면 벗음
function equip(W, u, slot, item){   /* v8.7.6 걸음은 gearSet 처럼 바뀐 무게만큼 (예전엔 없는 spd0 을 써서 NaN) */
  const A = W.rules.armor || {};
  if (item && slot === '몸' && u.eqRule && u.eqRule.body === false) return;   // v7.20 카리우스: 몸 갑옷 못 입음
  gearSet(W, u, slot, item && A[item.mat] ? { name: item.name || item.mat, mat: item.mat, tier: Math.max(1, Math.min(5, Math.round(+item.tier || 1))), dur: item.dur != null ? +item.dur : 100, size: item.size || null, own: item.own || null } : null);
  if (W.log) L(W, { k: 'equip', a: u.i, slot, name: u.gear[slot] ? u.gear[slot].name : null, tier: u.gear[slot] ? u.gear[slot].tier : null });
}
function statsOf(p, rules){
  const T = rules.tiers[p.tier] || rules.tiers[1], C = rules.classes[p.cls] || rules.classes['근접'], o = p.ov || {}, RO = roleStat(p, rules);
  const pick = k => o[k] != null ? o[k] : C[k];
  return {   // spd 는 방어구 무게만큼 느려짐
    hp: o.hp != null ? o.hp : Math.max(1, Math.round(T.hp * C.hp * (RO.hp || 1))),
    atk: o.atk != null ? o.atk : Math.max(1, Math.round(T.atk * C.atk * (p.am || 1) * gradeMul(rules, p.traits, '근력') * (RO.atk || 1))),   // am = 인물 공격 배율, [근력X] (v7.24.2 — 예전 [괴력X]), 역할
    spd: o.spd != null ? o.spd : +(C.spd * (p.sm || 1) * gradeMul(rules, p.traits, '속력') * (RO.spd || 1) * (1 - gearW(gearOf(p, rules), rules, bsOf(p)))).toFixed(2), rng: o.rng != null ? o.rng : p.weapon && rules.weapons && rules.weapons[p.weapon] ? +(rules.weapons[p.weapon].rng + bodyReach(p, rules)).toFixed(3) : C.rng, wind: pick('wind'), rec: pick('rec'),
  };
}
const bodyR = t => 0.26 + Math.min(7, Math.max(1, t)) * 0.025;
/* v7.18 지형: 몸 높이 (서 있음 · 웅크림 = 은신하고 가만히 · 엎드림) · 드러난 몫 (보는 눈 → 몸 꼭대기 사이를 언덕 · 더미가 가린 만큼) · 고저 보정 */
const TER = W => W.rules.terrain || {};
const terrOn = W => !!(W.map && (W.map.hills || W.map.piles));
const crouching = (W, u) => !!u.stealth && u.alive && !u.act && !u.lie && !(u.torch && !u.torchOff) && !(u.order && u.order.hurry);
const bodyH = (W, u) => u.lie && !u.lieSw ? (TER(W).lieH || 0.45) : crouching(W, u) ? (u.h || 1.7) * (TER(W).crouch || 0.55) : (u.h || 1.7);
const pileH = (W, k) => ((TER(W).pileH || {})[PILE_NM[k]] != null ? TER(W).pileH[PILE_NM[k]] : k === 2 ? 0.6 : 1.1);
function expoOf(W, u, t, info){
  const m = W.map; if (!m.hills && !m.piles) return 1;
  const g1 = gH(m, t.x, t.y), eye = gH(m, u.x, u.y) + bodyH(W, u) * 0.92, bh = bodyH(W, t), top = g1 + bh, dx = t.x - u.x, dy = t.y - u.y, d = Math.hypot(dx, dy);
  if (d < 1.2) return 1;
  const n = Math.ceil(d * 3); let cut = g1;
  for (let i = 1; i < n; i++){ const k = i / n; if (d * k < (u.r || 0.3) || d * (1 - k) < (t.r || 0.3) * 0.6) continue;
    const x = u.x + dx * k, y = u.y + dy * k, pk = m.piles ? pileAt(m, x, y) : 0, O = gH(m, x, y) + (pk ? pileH(W, pk) : 0); if (O <= g1) continue;
    const need = eye + (O - eye) / k; if (need > cut){ cut = need; if (info){ info.k = k; info.pile = pk; } } if (cut >= top) return 0; }
  return Math.max(0, Math.min(1, (top - cut) / bh));
}
// 원거리 명중 × : 엄폐 (cov0 + 드러난 몫 — 곡사는 위에서 떨어져 arcCov 까지) × 높이차 (1M 당 aimHi)
function terrAim(W, u, t, arc){ const T = TER(W), e = expoOf(W, u, t), c0 = T.cov0 != null ? T.cov0 : 0.2, c = arc ? Math.max(e, T.arcCov != null ? T.arcCov : 0.8) : e <= 0 ? 0.05 : c0 + (1 - c0) * e, dh = W.map.hills ? gH(W.map, u.x, u.y) - gH(W.map, t.x, t.y) : 0;
  return c * (1 + (T.aimHi != null ? T.aimHi : 0.05) * Math.max(-2, Math.min(2, dh))); }
const hiMelee = (W, u, t, far) => far || !W.map.hills ? 1 : 1 + (TER(W).meleeHi != null ? TER(W).meleeHi : 0.08) * Math.max(-1.5, Math.min(1.5, gH(W.map, u.x, u.y) - gH(W.map, t.x, t.y)));
// 오르막은 느리고 내리막은 조금 빠름 (가는 방향의 기울기)
function slopeK(W, u, dx, dy){ const l = Math.hypot(dx, dy); if (!l || !W.map.hills) return 1; const [gx, gy] = gGrad(W.map, u.x, u.y), sl = (gx * dx + gy * dy) / l, T = TER(W);
  return sl > 0 ? 1 / (1 + (T.climb != null ? T.climb : 0.8) * sl) : 1 + (T.down != null ? T.down : 0.1) * Math.min(1, -sl); }
// 비탈을 뛰면 미끄러져 넘어질 수 있음 (0.5초마다 판정 · 내리막이 더 위험 · 베테랑 · 네 발은 덜)
function slopeTrip(W, u, dx, dy){ if (!W.map.hills || W.t - (u.tripT == null ? -9 : u.tripT) < 0.5 || u.lie || u.crawl) return; u.tripT = W.t;
  const [gx, gy] = gGrad(W.map, u.x, u.y), g = Math.hypot(gx, gy), T = TER(W), s0 = T.tripS != null ? T.tripS : 0.3; if (g <= s0) return;
  const l = Math.hypot(dx, dy) || 1, down = (gx * dx + gy * dy) / l < 0;
  if (W.rand() < (T.trip != null ? T.trip : 0.12) * (g - s0) / 0.2 * (down ? 1.5 : 1) * (u.vet ? 0.6 : 1) * (u.quadOn ? 0.5 : 1)) knockDown(W, u, T.tripT || 0.8, null, down ? '비탈을 뛰어 내려가다 미끄러짐' : '비탈을 뛰어 오르다 미끄러짐'); }
/* v7.17 몸 리치: 든 근접 무기 (날붙이 · 둔기) 만 키만큼 길어지고 짧아짐. 체급: 소형 · 중형 · 중대형 · 대형 · 초대형 */
function bodyReach(p, rules){ const w = (rules.weapons || {})[p.weapon] || {}, B = rules.reachB || {}; if (!B.k || (w.kind !== '날붙이' && w.kind !== '둔기') || w.ammo != null || w.thr) return 0; return Math.max(B.lo != null ? B.lo : -0.1, Math.min(B.hi != null ? B.hi : 0.25, B.k * ((+p.height || 1.7) - 1.7))); }
const SIZE_RANK = { 소형: 0, 중형: 1, 중대형: 2, 대형: 3, 초대형: 4 };
const mbOn = (W, u) => !!u.modBody && !W.seal;   /* v7.23.2 권위 (신성 봉인) 중엔 [개조된 신체] 가 꺼짐 */
const crownOn = u => !!u && Object.values(u.gear || {}).some(g => g && [g, g.under].some(x => x && (x.auth || x.name === '노인의 왕관')));   /* v7.29.0 [★권위E] — 노인의 왕관 (쓰는 이는 누구든: 전리품으로 주워 써도) */
const authOn = (W, u) => W.units.some(o => o.alive && o.side !== u.side && crownOn(o));
// v8.7.4 신성 (카리우스 · 신성 등급) · 신성 효과에 곱할 몫 (상대가 왕관을 썼으면 1 − authW)
const holyOf = u => u.ref === 'C-003' || (u.traits || []).some(t => /^신성/.test(t));
const authK = (W, u) => authOn(W, u) ? 1 - ((W.rules.modBody || {}).authW != null ? W.rules.modBody.authW : 0.15) : 1;
function mbF(W, u, k){ const R = W.rules.modBody || {}, f = R[k] != null ? R[k] : k === 'dmg' ? 0.7 : 0.5; return authOn(W, u) ? 1 - (1 - f) * (1 - (R.authW != null ? R.authW : 0.15)) : f; }   // 신성 효과 (줄여 주는 몫) 를 authW 만큼 약하게
const sizeOf = u => u.sizeCls || (u.modBody || u.giant ? '대형' : (u.h || 1.7) >= 2 ? '중대형' : ((u.h || 1.7) < 1.45 || (u.mass || 70) < 45) ? '소형' : '중형');
const sizeOK = (u, req, strong) => !req || (SIZE_RANK[sizeOf(u)] || 0) >= (SIZE_RANK[req] || 0) || !!strong;
// 대담함 (0 ~ 1): 위험을 얼마나 감수하나. 따로 적지 않으면 무기 · 직업으로 정함
const BOLD_CLS = { '기동': 0.7, '근접': 0.5, '지휘': 0.4, '원거리': 0.35, '치유': 0.2 };
const BOLD_WPN = { '저격총': 0.15, '이빨·발톱': 0.75 };
function boldOf(p){ return p.bold != null && p.bold !== '' && !isNaN(+p.bold) ? Math.max(0, Math.min(1, +p.bold)) : BOLD_WPN[p.weapon] != null ? BOLD_WPN[p.weapon] : BOLD_CLS[p.cls] != null ? BOLD_CLS[p.cls] : 0.5; }
// v7.22 유닛 하나 만들기 (createWorld · addUnit 이 같이 씀)
function unitInit(W, p, i){ const rules = W.rules;
    const s = statsOf(p, rules), wp = (p.weapon && rules.weapons && rules.weapons[p.weapon]) || {}, far = s.rng > 1 && (p.weapon && rules.weapons && rules.weapons[p.weapon] ? isRangedW(wp) : true), tr = p.traits || [], acts = Array.isArray(p.active) ? p.active : p.active ? [p.active] : [], hh = heightOf(p), role0 = roleOf(p, rules);
    // v5.9.8 팔 방패 (◆개조된 신체 · 카리우스): 팔을 들어 방패처럼 막음 — 로직은 방패와 같음 (막기 · 밀치기 · 돌격 버팀 · 방패벽). 몸이라 떨어뜨리지 않음. 진짜 방패를 들면 그걸 씀
    const vet = tr.includes('베테랑'), vT = vet ? Object.assign({ tal: 0.9, post: 0.75 }, rules.vet || {}) : null;   // v6.1 [베테랑]
    const armCan = !!p.modBody || (p.unique || []).includes('개조된 신체') || tr.includes('개조된 신체'), armSh = armCan && !p.shield, sh = !!p.shield || armSh;
    // v5.3 돌격: 보병 (공격수) · 탱커 (전선) 의 공통 기술 (개 · 사족보행 빼고). [돌진] 은 카리우스의 돌격
    // v5.8.4 근접 보병은 모두 (방패가 있든 없든 · 미드필더 · 지원도) — 사수 · 원거리 무기 · 무리 사냥 짐승 · 사족보행만 빼고. 방패를 들면 '방패 돌진' (달리는 동안에도 앞을 막음)
    const commonCharge = (rules.charge || {}).common !== false && !far && role0 !== '사수' && p.tac !== 'pack' && !tr.includes('사족보행');
    // v5.1 탄약: 인물마다 따로 정할 수 있음 (p.ammo). 탄창 (mag) 이 있는 무기는 탄창이 비면 재장전
    const am0 = far ? (p.ammo != null && p.ammo !== '' && isFinite(+p.ammo) ? Math.max(0, Math.round(+p.ammo)) : wp.ammo != null ? wp.ammo : null) : null;
    W.units.push({ i, pid: p.id, ref: p.ref, name: p.name, tier: p.tier, cls: p.cls, side: p.side, hero: !!p.hero, torch: !!p.hero, nv: !!p.nv, nvG: p.nv ? (p.nvG === 'S' ? 'S' : p.nvG === 'A' ? 'A' : p.nvG === 'C' ? 'C' : p.nvG === 'D' ? 'D' : 'B') : '', /* v7.14 야시 S */ weapon: p.weapon || '', shield: sh, armCan, armShield: armSh, kit0: { weapon: p.weapon || '', shield: !!p.shield, arm: armSh }, smellG: smellGrade(p), smell: smellGrade(p) ? (smellGrade(p) === 'A' ? rules.smell : ((rules.smellG || {})[smellGrade(p)] || [3])[0]) : 0, smellFar: smellGrade(p) ? (smellGrade(p) === 'A' ? rules.smellFar : ((rules.smellG || {})[smellGrade(p)] || [3, 7])[1]) : 0, traits: (p.traits || []).slice(), threat: {},   // v7.5 후각 등급 S · A · B · C
      x: p.x, y: p.y, home: { x: p.x, y: p.y }, r: bodyR(p.tier) * ((p.traits || []).includes('거구') ? 1.3 : 1) * (hh < 1.55 ? Math.max(0.8, hh / 1.6) : 1) * (+p.rMul > 0 ? +p.rMul : 1), hp: p.hpNow != null && isFinite(+p.hpNow) ? Math.max(1, Math.min(s.hp, +p.hpNow)) : s.hp, max: s.hp, atk: Math.round(s.atk * blessOf(rules, tr).atk), blessEv: blessOf(rules, tr).ev, spd: s.spd, spd0: (p.ov && p.ov.spd != null) ? s.spd : +(s.spd / Math.max(0.2, 1 - gearW(gearOf(p, rules), rules, bsOf(p)))).toFixed(3), rng: s.rng, rng0: s.rng, wind: +(s.wind * (vet && far && wp.kind === '활' && rules.vet ? rules.vet.draw || 1 : 1)).toFixed(2), rec: +(s.rec * (vet && far && wp.kind === '활' && rules.vet ? rules.vet.nock || 1 : 1)).toFixed(2),
      // v4.0: 탄약 · 총성 · 방어 자세 · 대담함 · 상처
      ammo: am0, ammoMax: am0 != null ? Math.max(am0, +p.ammoMax > 0 ? Math.round(+p.ammoMax) : 0) : null, /* v8.7.3 화살통 · 탄 크기 (p.ammoMax) 는 남은 탄 (p.ammo) 과 따로 */ lob: far && wp.kind === '활', loud: far && !!wp.loud,   // v5.8.4 lob = 곡사 (활)
      aim: far && wp.aim != null ? wp.aim : null,
      mag: wp.mag && am0 != null ? Math.min(wp.mag, am0) : null, magMax: wp.mag && am0 != null ? wp.mag : null, burst: null,
      gear: gearOf(p, rules), bag: (p.bag || []).filter(it => it && it.k).map((it, k) => ({ ...it, uid: i * 100 + k + 1 })), bag0: JSON.stringify(p.bag || []), bagCap: bagCapP(rules, p), eqRule: eqRuleP(rules, p), headSize: p.headSize || (eqRuleP(rules, p) || {}).head || null, wDur: p.wDur != null ? +p.wDur : 100, sDur: p.sDur != null ? +p.sDur : 100, wName: p.wName || '', sName: p.sName || '', wOwn: p.wOwn || null, sOwn: p.sOwn || null, wForeign: !!p.wOwn && p.wOwn !== (p.ref || ('#' + String(p.name || '').replace(/\s*\d+$/, ''))), undying: tr.includes('불사'), undead: tr.includes('망자'), down: false, riseT: null, human: tr.includes('일반인'), giant: tr.includes('거구'), h: hh, modBody: !!p.modBody || tr.includes('개조된 신체'),   // 키 (m) · [개조된 신체] (v5.2: ◆고유특성이면 p.modBody)
      canCharge: tr.includes('돌진') || acts.includes('돌진') || acts.includes('돌격') || commonCharge, chargeName: p.shield ? '방패 돌진' : '돌진', chargeCd: -9,   // v5.4.3 보병 · 탱커 공통 기술 이름 = 돌진
      canLeap: tr.includes('도약') || acts.includes('도약'), leapCd: -9, active: acts,   // v5.2 액티브 스킬 (p.active)
      ev: gradeMul(rules, tr, '회피'), vit: vitOf(rules, tr), fire: fireOf(rules, tr), palm: acts.includes('팜 버스트'), palmCd: -9, spec: acts.filter(a => SPEC_K[a]).map(a => ({ k: SPEC_K[a], name: a, cdT: -9, n: SPEC_K[a] === 'head' ? 1 : null })), shells: acts.includes('영거리 사격') ? (p.shells != null ? +p.shells : 100) : null, alt: p.alt && p.alt.name ? { name: p.alt.name, ammo: p.alt.ammo != null ? +p.alt.ammo : null, mag: p.alt.mag != null ? +p.alt.mag : null } : null, csense: tr.includes('전투센스'), race: p.race || null, berry: tr.includes('열매 맺기'), berryT: tr.includes('열매 맺기') ? (rules.berry || {}).first || 8 : null, evadeCd: -9, evN: 0, manN: 0, blindL: tr.includes('실명:좌안'), burn: null, recoil: null,   // v6.7 [회피X] · [급소X] · [발화X] · [팜 버스트] · [실명:좌안] · 화상 · 반동   // v5.2 액티브 스킬 (p.active)
      cmd: cmdOf0(p, rules), rank: p.rank != null ? p.rank : RANK_REF[p.ref] || '', sqLead: null,   // v5.4 [지휘X] 점수
      longReach: !far && s.rng > 1,   // v5.4 장창
      eyes: (tr.includes('머리 넷') ? 4 : 1) * 2, eyeLost: 0, blind: false, sightMul: 1, aimMaim: 1, arms: { L: null, R: null }, noArms: false, bleed: null, bled: 0,   // v5.5 부위 (눈 · 팔) · 출혈
      heads: tr.includes('머리 넷') ? 4 : 1, cry: p.cry || '', mute: p.mute != null ? !!p.mute : p.side === 1,   // v5.3 [머리 넷] · 외침 (말 없는 쪽은 이모지 — 적 기본)
      // v5.2 무게 · 몸 방패 · 거구의 공격 · 방패 밀치기 · 피하기 · 넘어짐 · 기어다님 · 밀려남 · 조 · 휘두르기 명령
      mass: massOf(p, rules, hh, gearOf(p, rules), s.hp), sizeCls: p.sizeCls || null, leapN: +p.leapN || 1, tremor: (p.curses || []).includes('낙인:적뢰') && p.trinket !== '성해포', regenHp: p.trinket === '성해포' ? 1.5 : (+p.regenHp || 0), radar: tr.includes('레이더'), marble: tr.includes('대리석 피부'), noOrg: tr.includes('무장기'),   /* v8.7.3 */   /* v8.3.0 낙인 · 성해포 */ ccRes: Math.max(0, Math.min(0.95, +p.ccRes || 0)), chgBias: +p.chgBias || 0, noChg: !!p.noChg || p.cls === '치유', noChg0: !!p.noChg || p.cls === '치유',   /* v8.7.2 치유는 타고나길 돌격 안 함 */ heroic: tr.includes('영웅'), massEst: !(p.weight > 0) && !(p.height > 0) && !tr.includes('거구'), bodyShield: tr.includes('거구'), canSweep: tr.includes('거구'), canBash: sh, bashCd: -9, dodgeCd: -9, dodgedT: -9, proneT: -9, stunT: -9, crawl: false, legLoss: null, kb: null, sq: null, swing: null,
      canGuard: sh || !!wp.guard || (p.traits || []).includes('반사신경') || parryArcW(rules, p.weapon) > 0, parry: !sh && !wp.guard && parryArcW(rules, p.weapon) > 0, regen: tr.includes('재생') ? ((rules.regen || {}).hp != null ? rules.regen.hp : 0.04) : +p.regenK || 0, guardMode: 'auto', raised: false, raiseAt: 1e9, reflex: (p.traits || []).includes('반사신경'), post: 100, role: roleOf(p, rules),   // v5.7 막기는 선택
      // v5.0 방어 재능 (역할): 방패 · 대검을 든 쪽만 — 막는 폭 ×(0.6 + 0.4g), 막을 때 받는 피해 1 − (1 − blockMul)·g, 자세 깎임 ×(2 − g). [반사신경] 은 몸에 밴 것이라 최소 0.9
      gTal: (sh || wp.guard || parryArcW(rules, p.weapon) > 0) ? Math.max((roleStat(p, rules).guard != null ? roleStat(p, rules).guard : 1), (p.traits || []).includes('반사신경') ? 0.9 : 0, vet ? vT.tal : 0) : 1, vet,
      gArc: Math.round(Math.max(sh ? rules.frontArc : 0, wp.guard ? rules.guardArcW || 40 : 0, (p.traits || []).includes('반사신경') ? (wp.guard || sh ? rules.guardArcRW || 55 : rules.guardArcR || 20) : 0) * ((sh || wp.guard) ? 0.6 + 0.4 * Math.max((roleStat(p, rules).guard != null ? roleStat(p, rules).guard : 1), (p.traits || []).includes('반사신경') ? 0.9 : 0, vet ? vT.tal : 0) : 1)),
      gCost: Math.min((p.traits || []).includes('반사신경') ? rules.reflexCost || 0.6 : 1, vet ? vT.post : 1), brokenT: -9, blockT: -9, bold: boldOf(p), wounds: [], atkMul: 1, spdMul: 1, pinT: -9,
      mood: '', moodB: null, moodT: 0, moodLogT: -9, waitT: 0, vx: 0, vy: 0, heard: null, spot: null,
      // v4.1: 감각 (sense[적 번호] = 대략 / 정확한 자리 · 때) · 전술 (pack = 포위 사냥, stalk = 어둠 속 우회)
      skill: p.skill && +p.skill.pool > 0 ? { name: p.skill.name || '치유', pool: +p.skill.pool, left: p.skLeft != null && isFinite(+p.skLeft) ? Math.max(0, Math.min(+p.skill.pool, +p.skLeft)) : +p.skill.pool, per: +(p.skill.per || 120), wind: +(p.skill.wind || 0.8), rec: +(p.skill.rec || 0.4), rng: +(p.skill.rng != null ? p.skill.rng : 0.5),
        // v5.1 구급상자 (kit): pool = 개수, 한 번에 최대 체력의 pct, 쓰고 나면 cd 초 대기, 동료 체력이 auto 아래면 스스로 (쓰러진 [불사] 동료는 일으킴)
        kit: !!p.skill.kit, pct: +(p.skill.pct || 0.2), cap: p.skill.cap != null ? +p.skill.cap : (p.skill.kit ? 30 : null), cd: +(p.skill.cd || 0), cdT: -9, auto: p.skill.auto != null ? +p.skill.auto : null,
        // v7.3 구급상자: 처음 = 최대 체력 × pct 를 min ~ cap 사이로 · 이어서 곁에 머물며 hotGap 초마다 hot 씩 hotN 번 (돌봄 — 그동안 다른 걸 못 함, 맞거나 멀어지면 끊김)
        min: p.skill.min != null ? +p.skill.min : (p.skill.kit ? 10 : 0), hot: p.skill.hot != null ? +p.skill.hot : (p.skill.kit ? 4 : 0), hotN: p.skill.hotN != null ? +p.skill.hotN : (p.skill.kit ? 5 : 0), hotGap: +(p.skill.hotGap || 0.4), inf: !!p.skill.inf, regen: +(p.skill.regen || 0) } : null,
      quad: (p.traits || []).includes('사족보행'), quadOn: false, quadLogT: -9,
      jav: ((p.traits || []).includes('공통스킬:투창') || /창$/.test(p.weapon || '') || !!wp.thr) && (wp.kind === '날붙이' || /창$/.test(p.weapon || '')), spearHeld: true,   // 투창: 창을 든 쪽 (v5.4.3 창병계는 모두 · v6.7 던지는 단검 thr 도) · 창을 든 채인가
      javAuto: (p.traits || []).includes('공통스킬:투창') || p.side === 1,   // v5.4.3 스스로 던짐 (아군은 [공통스킬:투창] 이 있을 때만 — 인주 등은 명령으로)
      mk0: marksOf(rules, p.traits),   // v7.0 [사격X] 특성 (낯선 무기 판정)
      marks: Math.max(marksOf(rules, p.traits), vet && rules.vet && rules.vet.marks ? rules.vet.marks : 0),   // v5.5.2 사격 솜씨 [사격X] · v6.6 베테랑은 적어도 0.3
      bladeHands: !!p.bladeHands, strMul: gradeMul(rules, p.traits, '근력'), might: gradeMul(rules, p.traits, '괴력'), mightG: ((p.traits || []).map(x => /^괴력([SABC])$/.exec(x)).find(Boolean) || [])[1] || null, mightCd: -9,   // 날붙이 판정 · 근력 (막힐 때 상대 자세를 더 깎음) · v7.24.2 괴력 (순간)
      sense: {}, briefAt: 0, briefPrev: {}, pack: p.tac === 'pack', stalk: p.tac === 'stalk', barkAt: -9, ambushes: 0, roe: null, healPol: null, quiet: -9, impT: -9, roeLogT: -9,   // v7.9 교전 규칙 · 치료 방침 · 교전 보류 때 · 충동 때
      alive: true, act: null, order: null, path: null, goal: null, pathT: 0, state: 'idle', target: null, last: null, searchT: 0,
      dealt: 0, taken: 0, takenDark: 0, unseenHitT: -9, kills: 0, healed: 0, miss: 0, shots: 0, blocked: 0, ff: 0, hitT: -9, atkT: -9, face: p.side ? Math.PI / 2 : -Math.PI / 2, fg: p.side ? Math.PI / 2 : -Math.PI / 2, seenBy: false, engaged: false, slot: 0, wander: 0, moved: 0 });
  if (p.warden){ const P = p.warden, U = W.units[i]; U.warden = { on: true, room: P.room != null ? String(P.room) : null, door: P.door && isFinite(+P.door.x) ? { x: +P.door.x, y: +P.door.y } : null, corner: P.corner && isFinite(+P.corner.x) ? { x: +P.corner.x, y: +P.corner.y } : null, seen: null, seeT: null, cT: null }; if (U.warden.door) U.face = U.fg = Math.atan2(U.warden.door.y - U.y, U.warden.door.x - U.x); }   /* v7.23 방 지킴이 */
  { const U = W.units[i], w0 = (rules.weapons || {})[p.weapon]; U.reachX = far ? Math.max(0, Math.min(0.5, ((rules.reachB || {}).k || 0.25) * (hh - 1.7))) : Math.max(0, +(U.rng0 - (w0 && !isRangedW(w0) ? w0.rng : 0.3)).toFixed(3)); }   /* v8.7.2 몸 리치 (맨손 리치 − 맨손 기본) */
  { const U = W.units[i]; U.poise = +p.poise > 0 ? +p.poise : 1; U.dmgK = (p.traits || []).includes('가호:오딜') ? 0.9 : 1; U.pavise = (p.traits || []).includes('대방패');   /* v8.7.7 [가호:오딜] 받는 피해 × 0.9 · [대방패] 방패를 든 채 쏨 */ U.dcounter = Math.max(0, Math.min(1, +p.dcounter || 0)); U.gwKit = (p.unique || []).includes('푸른 번개'); U.porenKit = (p.unique || []).includes('쥐들의 왕'); if (U.porenKit){ const PR = rules.poren || {}; U.taunt = PR.taunt || 3; U.cleave = PR.cleave || 0.6; U.ratMem = U.side === 0 ? (Array.isArray(p.ratMem) ? p.ratMem : (p.ratMem = [])) : null; } if (p.ratOf != null){ U.ratOf = p.ratOf; U.summon = p.summon || 'rat'; U.ratKind = p.ratKind || null; } if (p.javSide) U.javSide = p.javSide; if (+p.javK > 0) U.javK = +p.javK; U.grit = (p.traits || []).includes('근성'); U.heretic0 = (p.traits || []).includes('불경자'); U.karKit = U.grit || U.heretic0 || (U.spec || []).some(x => ['kgrab', 'ksw', 'khook', 'kstomp'].includes(x.k)); if (U.shield && !U.armShield && /버클러/.test(U.sName || '')){ U.buckler = true; U.gArc = Math.round(U.gArc * ((rules.buckler || {}).arc || 40) / (rules.frontArc || 60)); }   /* v8.7.8 카리우스 [근성] [불경자] · 어퐁 버클러 */   /* v8.7.8 포렌 (◆쥐들의 왕) · 쥐 · 투창 뒤 드는 검 · 투창 솜씨 */ if (U.gwKit){ U.flanker = true; U.gw = null; const C0 = (rules.gw || {}).cd0 || {}; for (const x of U.spec || []) if (C0[x.k] != null) x.cdT = (W.t || 0) + C0[x.k]; }   /* v8.7.8 굿윌 — 사각 (등 뒤 근접은 막지 못함) · 싸움을 시작할 때 기술마다 대기 (2D) */ U.frostP = +p.frostP || 0; U.severP = +p.severP || 0; U.brain = p.brain || null; if (p.brain === 'cesar') U.cz = { on: false, fury: false, phaseT: null, orbit: W.rand() < 0.5 ? 1 : -1, spin: 1, shoulder: 3, back: 0, flank: 3, rush: 5, punish: 0, combo: null, jog: 0, upcut: 8, thrust: 4, wave: 5, ult: 10, auth: (p.unique || []).includes('권위') ? 0.6 : null, shaken: 0, cool: 0, stepT: 0, rstep: 0, nStep: 0, wasAtk: false, afterAtk: -9 }; }   /* v7.24 스텝 */   /* v7.23.1 자세 · 회피 반격 · 세자르 */
  { const U = W.units[i], K = p.h2 && H2K[p.h2]; U.scaleMail = (p.traits || []).includes('비늘 깃털 갑옷'); if (p.quakeKill && SIZE_RANK[p.quakeKill] != null) U.quakeKill = p.quakeKill;   /* v8.7.4 점프 찍기 체급 (붉은암석 중대형) */   /* v8.7.4 3D 보스 기술표 · 비늘 깃털 갑옷 */
    if (K){ U.h2 = { k: p.h2, cd: {}, mlT: -9, ph: false, close: false }; U.rng = Math.max(U.rng, +(K.ml.range - U.r - 0.12).toFixed(2)); U.longReach = true; }   // 닿는 거리 (남이 보는 손 길이) = 몸 가운데부터 range
    if (U.r > 0.55 && boxRock(W, U.x, U.y, U.r * 0.9)){ const q = bigSpot(W, U.x, U.y, U.r); if (q){ U.x = q.x; U.y = q.y; U.home = { x: q.x, y: q.y }; } } }   /* v8.7.4 큰 몸은 몸이 들어가는 자리에서 */
}
function createWorld(setup, rules, seed, opt){
  const map = buildMap(setup);
  const W = { map, rules, t: 0, rand: mulberry32(seed), units: [], torches: setup.torches.map(t => ({ ...t })), fx: [], log: [], noises: [], brief: null, shots: [], shotN: 0, items: [], covers: {}, stance: {}, farDmg: [0, 0, 0], fxOn: !(opt && opt.headless),
    light: new Float32Array(map.W * map.H), explored: new Uint8Array(map.W * map.H), found: new Uint8Array(map.W * map.H), spare: rules.spareTorches, over: false, result: null, thinkT: 0, lightT: 0, kills: [0, 0, 0], turn: 0 };
  W.amb = Math.max(0, Math.min(1, +setup.amb || 0)); W.holdClear = !!setup.holdClear;   /* v7.23.1 */   // v7.22.2 주변광 (밝은 맵 — 대장군의 무대 · 알현실)
  setup.units.forEach((p, i) => unitInit(W, p, i));
  for (const u of W.units){ wpnSpec(W, u); evoRole(W, u); }   /* v8.7.4 I25 (들고 온 방패 · 검) */   // v7.22.3 무기가 주는 기술 (열화판)   // v7.22 유닛 만들기는 unitInit (판 도중에 넣는 addUnit 과 같이 씀)
  let k = 0; for (const u of W.units) if (u.side === 0 && !u.hero) u.slot = k++;
  for (const u of W.units) if (u.blindL && !u.eyeLost){ const M = rules.maim || {}; u.eyeLost = 1; u.sightMul = 1 - (1 - (M.oneEye != null ? M.oneEye : 0.75)) * 2 / u.eyes; u.eyeAim = 1 - (1 - (M.oneEyeAim != null ? M.oneEyeAim : 0.85)) * 2 / u.eyes; maimAim(u); }   // v6.7 [실명:좌안] 처음부터 왼눈이 없음 (보는 거리 · 조준 — 눈 하나를 잃은 것과 같음)
  W.hadCmd = [0, 1].map(s => W.units.some(u => u.side === s && u.cmd > 0) || (s === 0 && W.units.some(u => u.side === 0 && !u.summon)));   /* v8.7.2 우리 편은 지휘관이 없어도 누군가 이어받음 (유저 명령이 닿을 길) */
  if (!W.units.some(u => u.side === 0 && u.cmd > 0)){ const c = W.units.filter(u => u.side === 0 && !u.summon).sort((a, b) => (b.vet ? 1 : 0) - (a.vet ? 1 : 0) || b.tier - a.tier || b.hp - a.hp)[0]; if (c){ c.cmd = 1; c.cmdTmp = true; } }   /* v8.7.2 처음부터 지휘관이 없으면 0초부터 임시 지휘 (혼자 남은 이도 제 명령은 받음) */   // v6.8 처음에 지휘관이 있던 편 (지휘가 끊기면 임시 지휘)
  W.giants = W.units.filter(u => u.h >= 2.2);   // 시야를 가릴 만큼 큰 몸
  { const Dp = W.units.find(u => u.side === 0 && u.rank === '부대장'); if (Dp) setup.units.forEach((p, k) => { const u = W.units[k]; if (u && u !== Dp && u.side === 0 && !u.hero && p.sq === 'B'){ u.sqLead = Dp.i; u.sqAuto = false; u.sqFix = true; } }); }   // v7.13 시작 배치의 편대 (2편대 = 부대장의 편대)
  formInit(W, setup);   /* v8.7.5 대형 (페이지가 넘길 때만) */
  for (const u of W.units){ u.stealthE = stealthOf(W, u); u.assnE = assnSkill(W, u); }
  if (opt && opt.camp) W.camp = true;   /* v8.7.3 여정 맵 (만들 때부터 — 0.3초 발견 없음 · 시작 채움) */
  if (W.camp) for (const u of W.units) if (u.ammoMax != null && !u.weaponGone && (u.bag || []).some(x => x.k === 'ammo' && x.n > 0)) pullAmmo(W, u, true);   /* v8.7.3 맵 사이엔 시간이 있음 — 가방 탄으로 화살통 · 탄창을 채우고 시작 */   // v7.5 숨는 솜씨   // v7.6 암살 솜씨
  { const h = W.units.find(u => u.side === 0 && u.hero) || W.units.find(u => u.side === 0); W.spareBy = h && W.spare > 0 ? h.i : null; W.spareAt = null; }   // v7.8.5 여분 횃불 꾸러미를 지닌 이
  if (setup.randStart && !(opt && opt.noStart)){ if (setup.startK && setup.startK !== 'roam' && W.units.filter(u => u.side === 1).length >= 2) startScenario(W, setup.startK); else patrolStart(W); }   /* v7.25.3 공통 전투의 상황 (startK) — 없으면 떠돎 */   // v7.8.1 조우 전 — 망자들이 무작위로 흩어져 저마다 떠돎 (배치 칸 미리보기는 놓은 자리 그대로)
  computeLight(W); markExplored(W);
  for (const e of W.units) if (e.side !== 0){ e.seenBy = W.units.some(a => a.side === 0 && canSee(W, a, e)); e.visLog = e.seenBy; e.visPend = null; }
  checkEnd(W);
  return W;
}

// v7.22 판 도중에 유닛을 넣음 (만남 인물이 동료 · 적이 될 때) — createWorld 와 같은 만들기 · 같은 규칙. 적이 새로 생기면 '끝난 맵' 은 다시 싸움 중
function addUnit(W, p){
  const i = W.units.length; unitInit(W, p, i); const u = W.units[i], rules = W.rules; wpnSpec(W, u); evoRole(W, u);   /* v8.7.4 I25 */
  if (u.side === 0 && !u.hero) u.slot = W.units.reduce((k, o) => o !== u && o.side === 0 && !o.hero ? Math.max(k, (o.slot || 0) + 1) : k, 0);
  if (u.blindL && !u.eyeLost){ const M = rules.maim || {}; u.eyeLost = 1; u.sightMul = 1 - (1 - (M.oneEye != null ? M.oneEye : 0.75)) * 2 / u.eyes; u.eyeAim = 1 - (1 - (M.oneEyeAim != null ? M.oneEyeAim : 0.85)) * 2 / u.eyes; maimAim(u); }
  if (u.h >= 2.2 && W.giants) W.giants.push(u);
  u.stealthE = stealthOf(W, u); u.assnE = assnSkill(W, u);
  if (u.side !== 0){ u.seenBy = W.units.some(a => a.alive && a.side === 0 && canSee(W, a, u)); u.visLog = u.seenBy; u.visPend = null; if (W.camp) W.cleared = false; }   /* v8.7.4 2편도 */
  W.loot = null; L(W, { k: 'unitAdd', a: i, side: u.side, vis: true });
  return u;
}
function markExplored(W){
  const m = W.map, al = W.units.filter(u => u.alive && u.side === 0);
  if (!W.found || W.found.length !== m.W * m.H) W.found = new Uint8Array(m.W * m.H);   /* v8.7.3 실제로 본 칸 (다 그려진 지도라도) — 탐험 · 출구 발견은 이것으로 */
  if (m.indoor){ markIndoor(W, al); exitSeenTick(W); return; }   /* v7.23 실내는 벽을 봄 */
  for (let i = 0; i < m.W * m.H; i++){
    if (W.explored[i] === 2 && W.found[i]) continue;
    const x = i % m.W + 0.5, y = ((i / m.W) | 0) + 0.5;
    for (const a of al){ const d = Math.hypot(a.x - x, a.y - y); if (d > W.rules.sight + 3) continue;
      if (W.light[i] > LIT){ W.explored[i] = 2; W.found[i] = 1; break; }
      if (a.nv && d <= (a.nvG === 'D' ? W.rules.nvD || 2.5 : a.nvG === 'C' ? W.rules.nvC || 3.75 : a.nvG === 'B' ? W.rules.nvB || 5 : W.rules.sight)){ W.explored[i] = Math.max(W.explored[i], 1); W.found[i] = 1; }
      if (d <= 1.5) W.found[i] = 1; }
  }
  exitSeenTick(W);
}

// v7.23 실내: 아군 눈에서 벽에 막히지 않고 보는 거리 안인 칸 = 지금 보이는 곳 (visNow — 그림은 이 밖을 '기억한 모습' 으로만). 가 본 곳도 보이는 칸만 (벽 너머 불 켜진 방이 저절로 밝혀지지 않음)
function markIndoor(W, al){
  const m = W.map, V = W.visNow && W.visNow.length === m.W * m.H ? W.visNow : (W.visNow = new Uint8Array(m.W * m.H)), sr = W.rules.sight; V.fill(0);
  for (const a of al){ const nvR = a.nv ? (a.nvG === 'D' ? W.rules.nvD || 2.5 : a.nvG === 'C' ? W.rules.nvC || 3.75 : a.nvG === 'B' ? W.rules.nvB || 5 : sr) : 0;
    const x0 = Math.max(0, Math.floor(a.x - sr)), x1 = Math.min(m.W - 1, Math.floor(a.x + sr)), y0 = Math.max(0, Math.floor(a.y - sr)), y1 = Math.min(m.H - 1, Math.floor(a.y + sr));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++){ const i = y * m.W + x, cx = x + 0.5, cy = y + 0.5, d = Math.hypot(cx - a.x, cy - a.y); if (d > sr) continue;
      if (d > 1.2){ const wall = m.t[i] === 1 || m.t[i] === 3, tx = wall ? cx - (cx - a.x) / d * 0.6 : cx, ty = wall ? cy - (cy - a.y) / d * 0.6 : cy; if (!V[i] && !losClear(m, a.x, a.y, tx, ty)) continue; }   // 벽 칸은 앞면까지
      V[i] = 1; if (W.light[i] > LIT || d <= nvR || d <= 1.5) W.found[i] = 1; if (W.explored[i] === 2) continue;
      if (W.light[i] > LIT) W.explored[i] = 2; else if (d <= nvR) W.explored[i] = Math.max(W.explored[i], 1); } }
}

// v8.7.3 출구 발견: 출구 칸을 우리 편 누군가 실제로 보면 (found) 그때부터 출구를 앎 — 표시 · 출구 명령은 그 뒤에야 곧장 감 (그 전엔 찾으러)
function exitSeenTick(W){
  const S0 = W.stairs; if (!S0 || W.exitSeen || !W.found) return; const m = W.map, cx = Math.max(0, Math.min(m.W - 1, S0.x | 0)), cy = Math.max(0, Math.min(m.H - 1, S0.y | 0));
  let ok = W.exitForce || W.found[cy * m.W + cx]; if (!ok) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const x = cx + dx, y = cy + dy; if (x >= 0 && y >= 0 && x < m.W && y < m.H && W.found[y * m.W + x] && m.t[cy * m.W + cx] !== 0){ ok = 1; break; } }   // 출구 칸이 벽 그림 위면 그 앞 칸
  if (!ok) return; W.exitSeen = true; W.exitSeenT = W.t;
  const by = W.units.filter(a => a.alive && a.side === 0 && !a.gone && !a.summon).sort((a, b) => dist(a, S0) - dist(b, S0))[0];
  L(W, { k: 'exitFound', a: by ? by.i : null, x: +S0.x.toFixed(1), y: +S0.y.toFixed(1), lock: !!(W.exitLock && !W.cleared), vis: true });
  if (W.fxOn) W.fx.push({ k: 'num', x: S0.x, y: S0.y, s: W.exitLock && !W.cleared ? '출구! (잠김)' : '출구!', c: 'h', t0: W.t });
}

/* ---------- 움직임 ---------- */
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const gap = (a, b) => dist(a, b) - a.r - b.r;
const L = (W, o) => { o.t = +W.t.toFixed(2); W.log.push(o); if (DINK[o.k] && W.rules.din) dinLog(W, o); if (!UNK_FREE[o.k]) unkMark(W, o); if (o.k === 'wind' || o.k === 'hit' || o.k === 'charge') W.atkWT = W.t; };   // v5.5 마지막으로 누가 치려 한 때 (눈치싸움 끊기)
// v7.5 소식 없음: 지휘관과 닿지 않는 (위치 모름) 아군이 낀 일은 그때 지휘관이 모름 (unk) — 화면 로그 · 이야기에선 싸움이 끝나야 보임. 그 아군이 쓰러지면, 비명이 들리는 거리의 동료가 있을 때만 '멀리서 비명'
const UNK_FREE = { posLost: 1, posBack: 1, scoutRep: 1, deathFound: 1, scream: 1, din: 1, phase: 1, plan: 1, stance: 1, probeRes: 1, opOrder: 1, opRecv: 1, board: 1, taskSwap: 1, taskDrop: 1, taskEnd: 1, focus: 1, intel: 1, alarm: 1, sentry: 1 };
function unkMark(W, o){
  const ua = o.a != null && typeof o.a === 'number' ? W.units[o.a] : null, ub = o.b != null && typeof o.b === 'number' ? W.units[o.b] : null;
  const un = x => x && x.side === 0 && x.posUnk;
  if (!un(ua) && !un(ub)) return; o.unk = true;
  if (o.k === 'die' && un(ub) && !W.over && !o.silent){ const C = cmdBoss(W, 0), h = W.units.find(m => m.alive && m.side === 0 && !m.posUnk && dist(m, ub) <= hearR(W, m, ub) * 1.6);
    if (h){ const ref = C || h, a = Math.atan2(ub.y - ref.y, ub.x - ref.x), dir = ['동', '남동', '남', '남서', '서', '북서', '북', '북동'][((Math.round(a / (Math.PI / 4)) % 8) + 8) % 8];
      L(W, { k: 'scream', dir, d: Math.round(dist(ref, ub)), by: h.i, vis: true }); } }
}
// v7.3 전장 소음: 소리 (맞음 · 막음 · 화살 · 총성 · 쓰러짐 · 외침 · 밀침) 가 그 자리에 쌓이고 half 초마다 반으로. 둘레 소음이 클수록 외침이 닿는 거리 (hearR) 가 줄어듦
const DINK = { hit: 1, die: 1, cmdCharge: 1, shout: 1, bash: 1, crush: 1, opportunity: 1 };
function dinAdd(W, x, y, v){ if (!v || AI6.includes('din')) return; const E = W.dinEv || (W.dinEv = []); E.push({ x, y, t: W.t, v }); if (E.length > 80 || (E.length && W.t - E[0].t > 10)){ const H = (W.rules.din || {}).half || 2; W.dinEv = E.filter(e => W.t - e.t < H * 4); } }
function dinLog(W, o){ if (o.silent) return; const D = W.rules.din, u = W.units[o.b != null && W.units[o.b] ? o.b : o.a]; if (!u) return;
  const v = o.k === 'hit' ? (o.far ? D.far : o.block ? D.block : D.hit) : o.k === 'die' ? D.die : o.k === 'cmdCharge' || o.k === 'shout' ? D.shout : o.k === 'crush' ? D.crush : D.bash;
  dinAdd(W, u.x, u.y, v); }
function dinAt(W, x, y){ const D = W.rules.din, E = W.dinEv; if (!D || !E || !E.length) return 0; const H = D.half || 2, R = D.R || 5; let n = 0;
  for (const e of E){ const a = W.t - e.t; if (a > H * 4) continue; const d = Math.hypot(e.x - x, e.y - y); if (d > R * 3) continue; n += e.v * Math.pow(0.5, a / H) / (1 + (d / R) * (d / R)); } return n; }
// 가장 시끄러운 자리의 소음 단계가 바뀌면 남김 (2초에 한 번까지): 조용 · 소란 · 시끄러움 · 아우성
const DIN_LV = ['조용', '소란', '시끄러움', '아우성'];
function dinTick(W){
  if (!W.rules.din || AI6.includes('din')) return; let n = 0, at = null;
  for (const u of W.units){ if (!u.alive) continue; const v = dinAt(W, u.x, u.y); if (v > n){ n = v; at = u; } }
  const f = dinF(W, n), lv = f > 0.8 ? 0 : f > 0.55 ? 1 : f > 0.36 ? 2 : 3; W.dinLv = lv; W.dinHear = +((W.rules.hear || 9) * f).toFixed(1);
  if (lv !== (W.dinLogLv || 0) && W.t - (W.dinLogT == null ? -9 : W.dinLogT) >= 2 && !(lv > (W.dinLogLv || 0) && !W.units.some(f => f.alive && !f.gone && f.side === 1))){   /* v8.7.3 끝난 맵에서 '싸움 소리가 커진다' 없음 */ W.dinLogLv = lv; W.dinLogT = W.t; L(W, { k: 'din', lv, hear: W.dinHear, x: at ? +at.x.toFixed(1) : null, y: at ? +at.y.toFixed(1) : null, vis: true }); }
}
const dinF = (W, n) => { const D = W.rules.din; return D ? Math.max(D.min || 0.3, 1 / (1 + n / (D.k || 14))) : 1; };
function hearR(W, a, b){ const h = W.rules.hear || 9; if (!W.rules.din || AI6.includes('din')) return h; return h * dinF(W, (dinAt(W, a.x, a.y) + (b ? dinAt(W, b.x, b.y) : dinAt(W, a.x, a.y))) / 2); }
// v7.5 후각 등급: [높은후각] = A (smellG S 면 S), [후각S] · [후각A] · [후각B] · [후각C]
function smellGrade(p){ const tr = p.traits || []; if (tr.includes('높은후각')) return p.smellG === 'S' ? 'S' : 'A'; const t = tr.find(x => /^후각[SABC]$/.test(x)); return t ? t.slice(2) : ''; }
// v7.5 은신: 숨는 솜씨 (직업 × 작은 몸 × 중갑 × 거구) — 켜 둔 동안 (은신 · 적 매복) 들킬 거리 × (어둠 dark · 빛 lit 쪽으로). 횃불을 켰거나 · 방금 쳤거나 · 뛰면 없음
const STL = W => W.rules.stealth || {};
function stealthOf0(W, u){ const tg = (u.traits || []).find(t => /^은신[SABCDE]$/.test(t)); if (tg){ u.stealthG = tg.slice(-1); const G = (W.rules.grades || {})['은신'] || {}; return Math.max(0, Math.min(1, G[u.stealthG] != null ? G[u.stealthG] : 0.6)); }   // v7.14 [은신X]
  const S = STL(W), g = (u.gear || {})['몸']; let e = ((S.cls || {})[u.cls] != null ? S.cls[u.cls] : 0.75) * ((u.h || 1.7) < 1.5 ? (S.small || 1.1) : 1) * (g && (g.mat === '판금' || g.tier >= 3) ? (S.heavy || 0.65) : 1) * (u.giant || u.modBody || u.bodyShield ? (S.giant || 0.1) : 1); return Math.max(0, Math.min(1, e)); }
// v7.22 두건 (armor[mat].stl): 쓰면 숨는 솜씨가 적어도 그 등급 — 원래 더 좋으면 그대로 · 망가지면 없음
function stealthOf(W, u){ const e = stealthOf0(W, u), hd = (u.gear || {})['머리'], A = hd && (W.rules.armor || {})[hd.mat], g = A && A.stl, G = (W.rules.grades || {})['은신'] || {}; return g && G[g] != null && !(hd.dur != null && hd.dur <= 0) ? Math.max(e, G[g]) : e; }
/* ---------- v7.11 포복 (엎드림) ----------
   자세: 엎드림 (down 초) · 일어남 (up 초, 기동 upFast) — 바꾸는 동안 아무것도 못 함 (넘어짐과 같음). 엎드리면 기어서만 감 (× spd), 막기 · 피하기 · 전열 없음, 근접에 약함 (넘어진 몸과 같음).
   쏘기: 엎드려서는 총 (총포류) 만 — 남은 빗나감 × (1 − aim). 활 · 근접 · 기술은 일어난 뒤에. 엎드린 몸은 near 칸 밖에서 덜 맞음 (직사 × hitFar · 곡사 × hitArc).
   보이기: 이미 안 눈 (lieSeen) 은 그대로 봄. 모르는 눈은 빛 · 어스름 · 어둠 (야시 등급 거리) × lit · dim · dark 안만 — 그 밖 (본래 보이는 거리 안) 은 관측 기회에만 굴림.
   놓침: 엎드릴 때 멀리 (loseD 칸 넘게 · 빛 밖) 서 보던 눈은 lose 로 놓침 (마지막 자리 기억은 남아 그쪽을 뒤짐) · 아는 눈도 시선이 mem 초 끊기면 놓침.
   스스로 판단: 근접에 맞거나 · 근접이 나를 노려 rise 칸 안이면 일어남. 원거리가 노리면 엎드린 채 버팀 (들킨 듯 — 기록). 모르는 큰 몸이 밟고 지나가면 다침 (lieTrample). */
const LIE = W => W.rules.lie || {};
const gunOf = (W, u) => isFar(u) && (((W.rules.weapons || {})[u.weapon] || {}).kind === '총포류');
const LIE_ORD = ['move', 'amove', 'hold', 'watch'];
const lieOrdOK = (W, u) => !u.order || (LIE_ORD.includes(u.order.k) && !((u.order.k === 'move' || u.order.k === 'amove') && u.order.hurry)) || ((u.order.k === 'attack' || u.order.k === 'supp') && gunOf(W, u));
const lieMoves = u => !!u.order && ['move', 'amove', 'attack', 'supp'].includes(u.order.k);
function lieHid(W, u, t, d){
  const LL = LIE(W); if (d <= (LL.near || 1.8) || (t.lieSeen && t.lieSeen[u.i] != null)) return false;
  const R = W.rules, lit = litAt(W, t.x, t.y), glow = glowAt(W, t.x, t.y), reach = lit || glow ? R.sight : !u.nv ? 0 : u.nvG === 'B' ? R.nvB || 5 : u.nvG === 'C' ? R.nvC || 3.75 : u.nvG === 'D' ? R.nvD || 2.5 : R.sight;
  let k = lit ? LL.lit || 0.9 : glow ? LL.dim || 0.55 : LL.dark || 0.35; if ((t.h || 1.7) >= 2.2) k = Math.min(1, k * 2);   // 큰 몸은 엎드려도 큼
  return d > reach * k * stealthK(W, t);
}
function lieSet(W, u, on, why){
  const LL = LIE(W); if (!LL.down || !u.alive || u.down) return false;
  if (on){
    if ((u.lie && !(u.lieSw && !u.lieSw.to)) || u.crawl || u.kb || u.modBody || (u.act && u.act.k === 'charge' && u.act.phase === 'run')) return false;   // v7.12 [개조된 신체] (카리우스) 는 몸 구조상 못 엎드림
    if (why === '명령') u.lieAuto = null;
    interrupt(W, u, '엎드려 준비가 끊김'); stop(u); u.raised = false;
    u.lie = true; u.lieSw = { to: true, at: W.t + LL.down }; u.proneT = Math.max(u.proneT, u.lieSw.at);
    L(W, { k: 'lieDown', a: u.i, why: why || '', sec: LL.down, vis: u.side === 0 || !!u.seenBy });
  } else {
    if (!u.lie || (u.lieSw && !u.lieSw.to)) return false;
    const sec = (u.cls === '기동' ? LL.upFast : LL.up) || 0.2, AU = LL.auto || {};
    u.lieNo = W.t + (why === '명령' ? AU.no || 8 : AU.noGate || 4); u.lieAuto = null;   // v7.12 일어난 뒤 한동안은 스스로 안 엎드림
    interrupt(W, u, '일어나려 준비가 끊김'); stop(u);
    u.lieSw = { to: false, at: W.t + sec }; u.proneT = Math.max(u.proneT, u.lieSw.at);
    L(W, { k: 'lieUp', a: u.i, why: why || '', sec, vis: u.side === 0 || !!u.seenBy });
  }
  return true;
}
function lieFree(W, u){ if (u.lie && !u.lieSw && u.lieAuto == null) u.lieAuto = W.t; }   /* v7.16.1 명령으로 엎드린 몸을 스스로 판단에 맡김 (조용하면 일어남) */
function lieGate(W, u, why){ if (!u.lie) return false; if (!u.lieSw || u.lieSw.to) lieSet(W, u, false, why); return true; }   // (일어나면 lieNo 동안 스스로 안 엎드림)
function lieHold(W, u){ if (u.lieSw) return true; if (lieOrdOK(W, u)) return false; lieSet(W, u, false, u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove') ? '서둘러 — 일어나 뜀' : '명령 (' + u.order.k + ')'); return true; }   // v7.13
// 보는 눈 (뒤를 보고 있으면 못 봄)
const lieEye = (W, o, t) => { W.lieOff = true; const v = canSee(W, o, t) && (o.heads > 1 || sideV(W, o, t) !== 'back'); W.lieOff = false; return v; };
function lieDone(W, t){   // 다 엎드림: 지금 보던 눈 중 멀리 · 어둠 속이면 놓칠 수 있음
  const LL = LIE(W), R = W.rules, lit = litAt(W, t.x, t.y), L0 = LL.lose || [0.3, 0.5], D0 = LL.loseD || 5, lost = [], seen = [];
  t.lieSeen = {}; t.lieRoll = {};
  for (const o of W.units){
    if (!o.alive || o.down || o.side === t.side || (o.koT && W.t < o.koT) || !lieEye(W, o, t)) continue;
    const d = dist(o, t);
    if (d >= D0 && !lit && !(o.smell && d <= o.smell)){ const p = L0[0] + (L0[1] - L0[0]) * Math.min(1, (d - D0) / Math.max(1, R.sight - D0)); if (W.rand() < p){ lost.push(o.i); continue; } }
    t.lieSeen[o.i] = W.t; seen.push(o.i);
  }
  L(W, { k: 'lieDone', a: t.i, seen, lost, vis: t.side === 0 || !!t.seenBy });
}
function lieTick(W, dt){
  const LL = LIE(W); if (!LL.down) return;
  W.lieT = (W.lieT || 0) - dt; const roll = W.lieT <= 0; if (roll) W.lieT = 0.2;
  for (const t of W.units){
    if (!t.lie) continue;
    if (!t.alive || t.down || t.crawl){ t.lie = false; t.lieSw = null; t.lieSeen = null; t.lieRoll = null; continue; }
    if (t.lieSw && W.t >= t.lieSw.at){
      if (t.lieSw.to){ t.lieSw = null; lieDone(W, t); }
      else { t.lie = false; t.lieSw = null; t.lieSeen = null; t.lieRoll = null; continue; }
    }
    if (t.lieSw || !roll) continue;
    lieWatch(W, t, LL); if (t.lie && !t.lieSw) lieFeel(W, t, LL);
    if (t.lie && !t.lieSw && t.lieAuto != null){ const P = t.fireP || [], last = Math.max(t.lieAuto, P.length ? P[P.length - 1].t : -9); if (W.t - last > ((LL.auto || {}).calm || 6)) lieSet(W, t, false, '사격이 멎음'); }   // v7.12
  }
  if (roll && LL.auto) for (const u of W.units) if (!u.lie && u.fireP && u.fireP.length) lieAutoChk(W, u, LL);   // v7.12 스스로 엎드림
}
// v7.12 스스로 엎드림 (양쪽 같음 · [개조된 신체] 빼고): 곁에 동료가 없는데 win 초 안에 n 발 넘게 날아와 스치거나 맞음 — 쏜 자를 못 봄 (어디선가) · 총이면 엎드려 맞쏨
function lieAutoChk(W, u, LL){
  const A = LL.auto || {}, P = u.fireP; while (P.length && W.t - P[0].t > (A.win || 3)) P.shift();
  if (P.length < (A.n || 2) || !u.alive || u.down || u.crawl || u.kb || u.act || u.modBody || W.t < (u.lieNo || -9) || W.t < u.proneT || W.t < (u.stunT || -9) || !lieOrdOK(W, u) || (u.order && (u.order.k === 'move' || u.order.k === 'amove'))) return;
  if (u.csense) return;   // v7.25.1 [전투센스] 기동 사수: 엎드리지 않고 움직이며 쏨
  if (W.units.some(a => a !== u && a.alive && !a.down && a.side === u.side && dist(a, u) < (A.alone || 5))) return;   // 완전히 고립됐을 때만
  if (W.units.some(f => f.alive && !f.down && f.side !== u.side && !isFar(f) && dist(f, u) < (A.near || 4) && canSee(W, u, f))) return;   // 근접이 곁에 있으면 엎드리지 않음
  const unseen = P.some(p => !p.seen); if (!unseen && !gunOf(W, u)) return;
  if (lieSet(W, u, true, '고립 · 사격 집중' + (unseen ? ' (어디선가)' : ' — 엎드려 맞쏨'))) u.lieAuto = W.t;
}
// 날아온 탄 · 화살 (스침 · 맞음 · 곁에 떨어짐) 을 겪음 — 쏜 자를 보았나
function lieFire(W, b, s){ if (!b.alive || b.side === s.side) return; const a = W.units[s.a], P = b.fireP || (b.fireP = []); P.push({ t: W.t, seen: !!a && a.alive && canSee(W, b, a) }); if (P.length > 12) P.shift(); }
// 관측 기회 (매 순간 굴리지 않음): 처음 · 보는 쪽이 1.5칸 · 엎드린 몸이 0.8칸 움직임 · rescan 초 · 새로 수상함
function lieWatch(W, t, LL){
  const S = t.lieSeen || (t.lieSeen = {}), Rr = t.lieRoll || (t.lieRoll = {}), lit = litAt(W, t.x, t.y), glow = glowAt(W, t.x, t.y), mv = Math.hypot(t.vx || 0, t.vy || 0) > 0.15;
  for (const o of W.units){
    if (!o.alive || o.down || o.side === t.side || (o.koT && W.t < o.koT)) continue;
    const base = lieEye(W, o, t);
    if (S[o.i] != null){ if (base) S[o.i] = W.t; else if (W.t - S[o.i] > (LL.mem || 4)) delete S[o.i]; continue; }
    if (!base){ delete Rr[o.i]; continue; }
    if (canSee(W, o, t)){ S[o.i] = W.t; continue; }   // 가까움 · 빛 — 그냥 보임
    const r = Rr[o.i], sus = fresh(W, o.sense[t.i], 6) || (!!o.heard && W.t - o.heard.t < 6 && Math.hypot(o.heard.x - t.x, o.heard.y - t.y) < 3);
    if (r && Math.hypot(o.x - r.ox, o.y - r.oy) < 1.5 && Math.hypot(t.x - r.tx, t.y - r.ty) < 0.8 && W.t - r.t < (LL.rescan || 6) && !(sus && !r.sus)) continue;
    Rr[o.i] = { ox: o.x, oy: o.y, tx: t.x, ty: t.y, t: W.t, sus: !!sus };
    const why = [lit ? '빛' : glow ? '어스름' : '어둠']; if (sus) why.push('수상함'); if (o.smellG) why.push('후각'); if (o.vet) why.push('베테랑'); if (mv) why.push('기는 중'); if ((t.h || 1.7) >= 2.2) why.push('큰 몸');
    const p = Math.min(0.9, (LL.spot || 0.05) * (lit ? LL.spotLit || 5 : glow ? LL.spotDim || 2 : 1) * (sus ? LL.spotSus || 3 : 1) * (o.smellG ? LL.spotSmell || 3 : 1) * (o.vet ? LL.spotVet || 1.5 : 1) * (mv ? LL.spotMove || 3 : 1) * ((t.h || 1.7) >= 2.2 ? LL.spotBig || 3 : 1) * stealthK(W, t) * (t.stealthG ? Math.max(0.5, Math.min(1.3, 1.5 - (t.stealthE || 0))) : 1));   // v7.14 은신 등급은 숨지 않을 때도 엎드린 몸을 덜 들키게
    const ok = W.rand() < p;
    if (ok) S[o.i] = W.t;
    L(W, { k: 'lieRoll', a: o.i, b: t.i, p: +p.toFixed(3), ok, d: +dist(o, t).toFixed(1), why: why.join(' · '), vis: false });
  }
}
// 엎드린 쪽이 느끼는 것 (보이는 모습으로): 근접에 맞음 · 근접이 나를 노리고 다가옴 (rise 칸 안) → 일어남. 원거리가 노림 · 원거리에 맞음 → 엎드린 채 (들킨 듯)
function lieFeel(W, t, LL){
  const hit = W.t - (t.hitT == null ? -9 : t.hitT) < 0.3;
  let by = null, close = null;
  for (const o of W.units){
    if (!o.alive || o.down || o.side === t.side || !canSee(W, t, o)) continue;
    const d = dist(o, t), aim = (o.act && o.act.b === t.i) || focusOf(W, o) === t, ap = ((o.vx || 0) * (t.x - o.x) + (o.vy || 0) * (t.y - o.y)) / Math.max(0.1, d) > 0.4 && angDiff(o.face || 0, Math.atan2(t.y - o.y, t.x - o.x)) < 0.6;
    if (!isFar(o) && d < (LL.rise || 3) && (aim || ap)){ close = o; break; }
    if (aim && !by) by = o;
  }
  if ((hit && !t.hitFar) || close){ lieSet(W, t, false, hit && !t.hitFar ? '근접에 맞음' : '다가오는 ' + close.name); return; }
  if ((by || hit) && W.t - (t.lieFeelT == null ? -9 : t.lieFeelT) > 6){ t.lieFeelT = W.t; L(W, { k: 'lieBlown', a: t.i, b: by ? by.i : null, why: hit ? '맞음' : '겨눔', vis: t.side === 0 || !!t.seenBy }); }
}
// 총구 화염: 엎드려 쏜 자리 — 시야 × flash 안에서 트인 눈은 자리를 앎
function lieFlash(W, u){
  if (!u.lie || u.lieSw || !gunOf(W, u)) return;
  const LL = LIE(W), S = u.lieSeen || (u.lieSeen = {}); let n = 0;
  for (const o of W.units){
    if (!o.alive || o.down || o.side === u.side || S[o.i] != null) continue;
    if (dist(o, u) > W.rules.sight * (LL.flash || 1.6) || !losClear(W.map, o.x, o.y, u.x, u.y) || (!(o.heads > 1) && sideV(W, o, u) === 'back')) continue;
    S[o.i] = W.t; o.sense[u.i] = { x: u.x, y: u.y, t: W.t, exact: true, light: true }; n++;
  }
  if (W.t - (u.flashLogT == null ? -9 : u.flashLogT) > 4){ u.flashLogT = W.t; L(W, { k: 'lieFlash', a: u.i, n, vis: u.side === 0 || !!u.seenBy }); }
}
// 모르고 밟음: 큰 몸 (거구 · 무거움) 이 빠르게 지나가다 모르는 엎드린 몸과 겹침 — 아는 몸은 (치거나) 비켜 감
function lieTrample(W, a, b){
  const fa = !!a.lie && !a.lieSw, fb = !!b.lie && !b.lieSw; if (fa === fb) return;
  const t = fa ? a : b, g = fa ? b : a, T = LIE(W).trample || {};
  if (g.side === t.side || g.kb || g.down || !(g.giant || g.mass >= (T.mass || 180))) return;
  const sp = Math.hypot(g.vx || 0, g.vy || 0); if (sp < (T.v || 0.8)) return;
  if ((t.lieSeen && t.lieSeen[g.i] != null) || g.target === t || (g.act && g.act.b === t.i)) return;
  const C = t.trT || (t.trT = {}); if (W.t - (C[g.i] == null ? -9 : C[g.i]) < (T.cd || 1.5)) return; C[g.i] = W.t;
  (t.lieSeen || (t.lieSeen = {}))[g.i] = W.t; g.sense[t.i] = { x: t.x, y: t.y, t: W.t, exact: true };
  L(W, { k: 'trample', a: g.i, b: t.i, sp: +sp.toFixed(1), vis: t.side === 0 || !!g.seenBy });
  hurtRaw(W, g, t, (T.k || 0.12) * g.mass * Math.min(1.5, sp / 2), { tag: '짓밟힘 — 모르고 밟음' });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '밟힘!', c: 'd', t0: W.t });
}

// v7.14 숨지 않을 때의 은신 등급 (어둠 속 · 횃불 끔 · 뛰지 않음 · 방금 치지 않음): 보이는 거리 × — 등 뒤 안 보임 (숨은 몸) 은 아님
function stealthP(W, t){
  const S = STL(W), P = S.passive; if (!P || !t.stealthG || AI6.includes('stealth') || (t.torch && !t.torchOff) || W.t - (t.revealT == null ? -9 : t.revealT) < (S.reveal || 2) || (t.order && t.order.hurry) || (t.mv && t.mv.run && W.t < t.mv.until)) return 1;
  if (t.stealthG === 'E' && Math.hypot(t.vx || 0, t.vy || 0) > 0.2) return 1;
  return Math.min(1, 1 - ((t.stealthE || 0) - (P.mid != null ? P.mid : 0.6)) * (P.k || 0.25));
}
function stealthK(W, t){
  if (t.stealthG === 'E' && (glowAt(W, t.x, t.y) || Math.hypot(t.vx || 0, t.vy || 0) > 0.2)) return 1;   // v7.14 [은신E] — 어둠 속에 가만히 있을 때만
  if (!(t.stealth || t.lurk || t.stalk || (t.warden && t.warden.on)) || !t.stealthE || t.stealthE < (STL(W).min || 0) || AI6.includes('stealth') || (t.torch && !t.torchOff) || W.t - (t.revealT == null ? -9 : t.revealT) < (STL(W).reveal || 2) || (t.order && t.order.hurry) || (t.mv && t.mv.run && W.t < t.mv.until)) return 1;
  const S = STL(W), base = litAt(W, t.x, t.y) ? (S.lit || 0.75) : glowAt(W, t.x, t.y) ? (S.dim || 0.6) : (S.dark || 0.45); return 1 - t.stealthE * (1 - base);   // v7.7 어스름
}
// v7.8 횃불 던지기: 저 어둠 속으로 빛을 — 떨어진 자리 둘레가 밝아짐 (양쪽 모두에게)
const FLR = W => W.rules.flare;
function flareStep(W, u, dt, o, end){
  const F = FLR(W) || {};
  if (!u.torch){ L(W, { k: 'flareFail', a: u.i, why: '든 횃불이 없음', vis: u.side === 0 || !!u.seenBy }); end(); return; }
  if (u.act) return;
  const d = Math.hypot(o.x - u.x, o.y - u.y);
  if (o.t0 == null) o.t0 = W.t;
  if (W.t - o.t0 > 15){ L(W, { k: 'flareFail', a: u.i, why: '던질 자리에 닿지 못함', vis: u.side === 0 || !!u.seenBy }); end(); return; }
  if (d > (F.rng || 7)){ setMood(W, u, '던질 거리로'); goTo(W, u, o.x, o.y, dt); return; }
  const ang = Math.atan2(o.y - u.y, o.x - u.x); stop(u); u.fg = ang;
  if (angDiff(u.face, ang) > 0.5){ setMood(W, u, '던지려 돌아섬'); return; }
  u.act = { k: 'flare', b: null, phase: 'wind', t0: W.t, end: W.t + (F.wind || 0.6), px: o.x, py: o.y, done: end };
  setMood(W, u, '횃불을 던짐');
}
function resolveFlare(W, u){
  const A = u.act, F = FLR(W) || {}; if (A.phase !== 'wind'){ u.act = null; return; }
  const d = Math.hypot(A.px - u.x, A.py - u.y), sc = (F.scat || 0.3) + (F.scatD || 0.05) * d, a = W.rand() * 6.283, rr = Math.sqrt(W.rand()) * sc;
  let x = Math.max(0.5, Math.min(W.map.W - 0.5, A.px + Math.cos(a) * rr)), y = Math.max(0.5, Math.min(W.map.H - 0.5, A.py + Math.sin(a) * rr));
  for (let k = 0; k < 20 && (rock(W.map, x, y) || !losClear(W.map, u.x, u.y, x, y)); k++){ x = u.x + (x - u.x) * 0.85; y = u.y + (y - u.y) * 0.85; }   // 바위에 막히면 그 앞에 떨어짐
  let own = false;
  if (u.side === 0 && W.spare > 0 && W.spareBy === u.i){ W.spare--; W.torches.push({ x, y, dropped: true, thrown: true }); }   // 여분에 불을 붙여 던짐 — 든 횃불은 그대로 (v7.8.5 꾸러미를 지닌 이만)
  else { own = true; u.torch = false; u.torchOff = false; W.torches.push({ x, y, dropped: true, thrown: true }); }
  computeLight(W);
  L(W, { k: 'flare', a: u.i, x: +x.toFixed(1), y: +y.toFixed(1), own, spare: W.spare, vis: u.side === 0 || !!u.seenBy });
  if (W.fxOn) W.fx.push({ k: 'flare', x0: u.x, y0: u.y, x1: x, y1: y, t0: W.t, dur: 0.45 });
  A.phase = 'rec'; A.t1 = W.t; A.end = W.t + 0.3;
  if (A.done){ const f = A.done; A.done = null; f(); }
}
// v7.8.3 들킴을 느낌 (아군 · 적 같음): 숨은 몸은 상대가 나를 알아챈 걸 느낌 — 상대가 앞 · 옆으로 나를 stealth.feel 초 넘게 봄 (스치는 눈길은 아님) · 맞음 (곧바로)
//   그냥 숨어 걷던 몸 (은신 켬) 은 은신을 풀고 제 걸음 · 정찰은 곧바로 도망 · 매복은 터짐 · 우회조는 숨기를 풂. 암살 명령 · 적 암살조 · 자동 암살은 저마다 그만둠 (들킴)
function stealthFeel(W){
  const fe = STL(W).feel != null ? STL(W).feel : 0.3;
  for (const u of W.units){
    if (!u.alive || u.down || !(u.stealth || u.lurk || (u.warden && u.warden.on))){ u.feelT = null; continue; }
    if (u.shadow || u.asAI || (u.order && u.order.k === 'assn')) continue;   // 저마다 들킴을 봄
    const sp = assnSpotted(W, u), hit = W.t - (u.hitT == null ? -9 : u.hitT) < 0.25;
    if (!sp && !hit){ u.feelT = null; continue; }
    if (u.feelT == null) u.feelT = W.t;
    if (!hit && W.t - u.feelT < fe) continue;
    const by = sp ? sp.i : null, why = hit && !sp ? '맞음' : '봄'; u.feelT = null; u.blown = { t: W.t, by, why };
    if (u.lurk){ u.lurkSeen = by != null ? by : -1; continue; }   // 매복: lurkStep 이 터뜨림
    if (u.warden && u.warden.on){ u.warden.seen = by != null ? by : -1; continue; }   /* v7.23 지킴이: wardenStep 이 터뜨림 */
    if (u.sc && u.order && u.order.k === 'scout'){ if (u.sc.ph !== 'flee'){ u.sc.ph = 'flee'; L(W, { k: 'scoutFlee', a: u.i, b: by, why, vis: true }); } u.stealth = false; continue; }   // 정찰: 곧바로 도망 (뛰면 숨지 못함)
    if (u.sqStl) u.sqStl = false;
    u.stealth = false; L(W, { k: 'stealthBlown', a: u.i, b: by, why, vis: u.side === 0 || !!u.seenBy });
  }
}
// v7.7 사주경계: 맞붙지 않은 몸은 가끔 뒤를 돌아봄 — 그동안 시선 (알아챔 · 숨은 몸을 봄) 은 돌아본 쪽 (앞은 비움)
const WAT = W => W.rules.watch;
const lookOn = (W, u) => !!u.look && W.t < u.look.until;
function sideV(W, u, t){ if (!lookOn(W, u)) return sideOf(W, u, t); const deg = angDiff(u.look.a, Math.atan2(t.y - u.y, t.x - u.x)) * 180 / Math.PI, F = W.rules.frontArc; return deg <= F ? 'front' : deg <= 180 - F ? 'side' : 'back'; }
function watchTick(W){
  const R = WAT(W); if (!R || AI6.includes('watch')) return;
  for (const u of W.units){
    if (!u.alive || u.down || (u.koT && W.t < u.koT) || u.heads > 1 || lookOn(W, u)) continue;
    const g = R.gap || [3, 6];
    if (u.lookNext == null){ u.lookNext = W.t + g[0] + W.rand() * (g[1] - g[0]); continue; }
    if (W.t < u.lookNext) continue;
    if ((u.act && u.act.phase === 'wind') || W.units.some(f => f.alive && !f.down && f.side !== u.side && dist(f, u) < u.r + f.r + Math.max(u.rng, isFar(f) ? 0 : f.rng) + (R.busy || 2) && canSee(W, u, f) && sideOf(W, u, f) !== 'back')){ u.lookNext = W.t + 0.5; continue; }
    const m = (u.vet ? R.vet || 1 : 1) * ((u.traits || []).includes('일반인') ? R.layman || 1 : 1) * (u.sentry ? R.sentry || 1 : 1) * (u.order && u.order.k === 'watch' ? R.ring || 1 : 1) * ((u.side === 1 ? !u.woke && u.state !== 'hunt' && u.state !== 'search' : !W.contact0) ? R.calm || 1 : 1);
    u.look = { a: (u.face || 0) + Math.PI + (W.rand() - 0.5) * 1.2, until: W.t + (R.dur || 0.5) };
    u.lookNext = W.t + (R.dur || 0.6) + (g[0] + W.rand() * (g[1] - g[0])) * m;
  }
}
// v7.7 견제사격: 보이지 않는 상대는 겨누지 못함 — 베테랑 사수만, 명령으로, 날아온 쪽 (바닥 자리) 에 n 발. 맞히기보다 움찔하게 (근처를 스치면 pin 초). 쏘면 드러남 (총은 총성)
const SUP = W => W.rules.supp;
const suppSkill = u => !!u.vet || (u.traits || []).some(t => t === '사격S' || t === '사격A');   // v7.16 베테랑 또는 사격 A 이상 (친칠라 · 궁수 · 노먼)
const suppOK = u => isFar(u) && suppSkill(u) && u.ammo !== 0 && !u.crawl;
// v7.16 견제사격 = 그 자리 쪽으로 곧게 (직사 — 방패 · 몸에 막히고 엎드린 몸 위로 넘어감) · 지역사격 = 그 자리 바닥에 곡사로 떨굼 (활만 — 방패 너머 · 엎드린 몸 · 흩어짐). 총은 지역사격 = 견제사격. o.arc 가 없으면 (옛 명령) 활은 곡사
const suppArc = (u, o) => !!u.lob && !(o && o.arc === false);
const segDp = (p, ax, ay, bx, by) => { const vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy || 1, k = Math.max(0, Math.min(1, ((p.x - ax) * vx + (p.y - ay) * vy) / L2)); return Math.hypot(p.x - ax - vx * k, p.y - ay - vy * k); };
function launchAt(W, u, x, y, so){
  const SU = SUP(W) || {}, wp = (W.rules.weapons || {})[u.weapon] || {}, d = Math.max(0.5, Math.hypot(x - u.x, y - u.y)), sp = (SU.spread || 0.45) + (SU.spreadD || 0.09) * d, a = W.rand() * 6.283, rr = Math.sqrt(W.rand()) * sp;
  const ang = Math.atan2(y + Math.sin(a) * rr - u.y, x + Math.cos(a) * rr - u.x), dx = Math.cos(ang), dy = Math.sin(ang);
  W.shots.push({ id: ++W.shotN, a: u.i, meant: null, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: wp.vel || 40, left: Math.min(u.rng + u.r + 2.5, d + (SU.over || 2)), p: 0, good: false, t0: W.t, side: u.side, mul: 1, pm: 1, gun: wp.kind === '총포류', supp: true, so });
}
// v7.12 곡사 면 제압: 그 자리 둘레에 높이 쏘아 떨굼 — 방패 너머 · 숨은 몸 (엎드림 · 은신) 을 노림, 화살 낭비를 감수
function launchArcAt(W, u, x, y, so){
  const SU = SUP(W) || {}, A = W.rules.arc || {}, wp = (W.rules.weapons || {})[u.weapon] || {}, d = Math.max(0.5, Math.hypot(x - u.x, y - u.y)), sp = (SU.arcSpread || 1) + (SU.arcSpreadD || 0.1) * d, a = W.rand() * 6.283, rr = Math.sqrt(W.rand()) * sp;
  const lx = Math.max(0.5, Math.min(W.map.W - 0.5, x + Math.cos(a) * rr)), ly = Math.max(0.5, Math.min(W.map.H - 0.5, y + Math.sin(a) * rr)), ll = Math.hypot(lx - u.x, ly - u.y) || 1, T = Math.max(0.1, ll / Math.max(1, (wp.vel || 16) * (A.vel || 0.55)));
  W.shots.push({ id: ++W.shotN, a: u.i, meant: null, x: u.x, y: u.y, x0: u.x, y0: u.y, dx: (lx - u.x) / ll, dy: (ly - u.y) / ll, lx, ly, T, el: 0, q: 0, arc: true, sp: 0, left: 0, p: 0, good: false, t0: W.t, side: u.side, mul: 1, pm: 1, supp: true, so });
}
function suppStep(W, u, dt, o, end){
  const SU = SUP(W) || {};
  const arc = suppArc(u, o);
  if (!o.on){ o.on = true; o.left = o.n || SU.n || 3; o.fired = 0; o.hits = 0; o.t0 = W.t; L(W, { k: 'supp', a: u.i, x: +o.x.toFixed(1), y: +o.y.toFixed(1), n: o.left, ai: !!o.ai, arc, area: !!o.arc, hid: !!o.hid, vis: u.side === 0 || !!u.seenBy }); }
  const fin = why => { L(W, { k: 'suppEnd', a: u.i, n: o.fired, hit: o.hits, why: why || '', vis: u.side === 0 || !!u.seenBy }); end(); };
  if (!suppOK(u)){ fin(!isFar(u) ? '사수가 아님' : !suppSkill(u) ? '베테랑 · 사격 A 이상만 할 수 있음' : '탄이 없음'); return; }
  if (u.act) return;
  if (o.left <= 0){ fin(''); return; }
  if (needReload(u)){ startReload(W, u); return; }
  if (W.t - o.t0 > 20){ fin('시간이 너무 걸림'); return; }
  const ang = Math.atan2(o.y - u.y, o.x - u.x), d = Math.hypot(o.x - u.x, o.y - u.y); stop(u); u.fg = ang;
  if (arc && !losClear(W.map, u.x, u.y, o.x, o.y)){ fin('바위 너머는 못 넘김 (굴 천장)'); return; }   // v7.12
  const ff = arc ? W.units.find(f => f.alive && f !== u && f.side === u.side && Math.hypot(f.x - o.x, f.y - o.y) < (SU.arcSpread || 1) + (SU.arcSpreadD || 0.1) * d + f.r + 0.3) : W.units.find(f => f.alive && f !== u && f.side === u.side && segDp(f, u.x, u.y, u.x + Math.cos(ang) * (d + (SU.over || 2)), u.y + Math.sin(ang) * (d + (SU.over || 2))) < f.r + 0.35);   // v7.12 곡사는 떨어질 둘레의 아군만
  if (ff){ if (o.ffT == null) o.ffT = W.t; setMood(W, u, '사선에 아군', ff.i); if (W.t - o.ffT > (SU.ffWait || 3)) fin('사선에 아군 (' + ff.name + ')'); return; }
  o.ffT = null;
  if (angDiff(u.face, ang) > 0.35){ setMood(W, u, '견제사격 — 돌아섬'); return; }
  const wind = aimT(W, u) * (SU.wind || 0.8);
  u.act = { k: 'supp', b: null, phase: 'wind', t0: W.t, end: W.t + wind, px: o.x, py: o.y, so: o };
  setMood(W, u, '견제사격');
}
function resolveSupp(W, u){
  const A = u.act; if (A.phase !== 'wind'){ u.act = null; return; }
  fire(W, u); if (suppArc(u, A.so)) launchArcAt(W, u, A.px, A.py, A.so); else launchAt(W, u, A.px, A.py, A.so); /* v7.16 지역사격 (곡사) / 견제사격 (직사) */ A.so.left--; A.so.fired++;   // v7.12 활 = 곡사 면 제압
  if (u.ammo === 0) outOfAmmo(W, u);
  A.phase = 'rec'; A.t1 = W.t; A.end = W.t + u.rec;
}
// 맞거나 스친 쪽: 쏜 자를 보는 동료가 없으면 날아온 방향만 앎 (incoming — 적 지휘관은 이것으로 견제사격을 시킴)
function incoming(W, b, s){
  const SU = SUP(W), sh = W.units[s.a]; if (!SU || !sh || b.side === s.side) return;
  if (W.units.some(o => o.alive && o.side === b.side && !(o.side === 0 && o.posUnk) && canSee(W, o, sh))) return;
  const I = W.inc || (W.inc = []), T = SU.incT || 6;
  I.push({ side: b.side, x: +b.x.toFixed(2), y: +b.y.toFixed(2), dx: -s.dx, dy: -s.dy, tr: +Math.hypot(s.x - s.x0, s.y - s.y0).toFixed(1), t: W.t, gun: !!s.gun, by: b.i });
  if (I.length > 30 || W.t - I[0].t > T) W.inc = I.filter(r => W.t - r.t < T);
  const k = 'incLogT' + b.side; if (W.t - (W[k] == null ? -9 : W[k]) >= 1.5){ W[k] = W.t; L(W, { k: 'incoming', side: b.side, b: b.i, dir: dirName(-s.dx, -s.dy), gun: !!s.gun, supp: !!s.supp, vis: b.side === 0 || !!b.seenBy }); }
}
// 적 지휘관: 보이지 않는 사수에게 맞으면 (날아온 방향) 보이는 상대가 없는 베테랑 사수에게 그쪽 견제사격을 시킴 (지휘 전달 공식)
// v7.12 숨은 사수 (fireT 초 안에 쏨) 를 지금 아무도 못 보는데 seen 초 안에 정확히 안 자리 (총구 화염 · 놓치기 전 · 비명) — 적 지휘관의 곡사 면 제압
function suppHid(W){
  const SU = SUP(W) || {}; let best = null;
  for (const t of W.units){
    if (!t.alive || t.down || t.side !== 0 || !isFar(t) || W.t - (t.lastFireT == null ? -99 : t.lastFireT) > (SU.fireT || 8)) continue;
    if (W.units.some(e => e.alive && e.side === 1 && canSee(W, e, t))) continue;
    for (const e of W.units){ if (!e.alive || e.side !== 1) continue; const q = e.sense[t.i]; if (q && q.exact && W.t - q.t <= (SU.seen || 4) && (!best || q.t > best.t)) best = { x: q.x, y: q.y, t: q.t, b: t.i }; }
  }
  return best;
}
function suppAI(W){
  const SU = SUP(W); if (!SU || !SU.ai || AI6.includes('supp')) return;
  const C = cmdBoss(W, 1); if (!C || roamIdle(C)) return;   // v7.8.1 떠도는 중인 지휘관은 모름
  const rec = (W.inc || []).filter(r => r.side === 1 && W.t - r.t < 3), hs = rec.length ? null : suppHid(W); if (!rec.length && !hs) return;   // v7.12 숨은 사수의 안 자리
  const r = rec[rec.length - 1];
  for (const u of W.units){
    if (!u.alive || u.down || u.side !== 1 || !suppOK(u) || u.supp || u.suppPend || u.act || W.t < (u.suppCd || 0) || u.shadow || u.lurk || roamIdle(u)) continue;
    if (W.units.some(f => f.alive && f.side === 0 && canSee(W, u, f) && gap(u, f) <= u.rng)) continue;
    const e = SU.est || [0.7, 1.3], dE = hs ? 0 : Math.max(2, Math.min(12, r.tr * (e[0] + W.rand() * (e[1] - e[0])))), lat = (W.rand() - 0.5) * 2 * (SU.lat || 1);
    const x = hs ? Math.max(0.5, Math.min(W.map.W - 0.5, hs.x + (W.rand() - 0.5) * 0.8)) : Math.max(0.5, Math.min(W.map.W - 0.5, r.x + r.dx * dE - r.dy * lat)), y = hs ? Math.max(0.5, Math.min(W.map.H - 0.5, hs.y + (W.rand() - 0.5) * 0.8)) : Math.max(0.5, Math.min(W.map.H - 0.5, r.y + r.dy * dE + r.dx * lat));
    if (Math.hypot(x - u.x, y - u.y) > u.rng + 2) continue;
    u.suppCd = W.t + (SU.cd || 6);
    const busy = W.units.some(f => f.alive && f !== u && segDp(f, u.x, u.y, x, y) < f.r + 0.45 && (f.side === u.side || ((f.shield || f.armShield || f.bodyShield) && canSee(W, u, f)))), arc = !!u.lob && (!!hs || busy);   // v7.16 궁수: 숨은 사수의 안 자리 · 사선에 동료나 방패가 있으면 지역사격 (곡사) · 아니면 견제사격 (직사)
    const lk = u === C ? { p: 1, t: 0 } : cmdLink(W, C, u);   // v7.13 지휘망
    if (W.rand() < lk.p) u.suppPend = { x, y, at: W.t + lk.t, hid: !!hs, arc };
    else if (W.t - (u.missLogT == null ? -9 : u.missLogT) > 3){ u.missLogT = W.t; L(W, { k: 'cmdMiss', side: 1, a: u.i, c: C.i, via: lk.via, why: lk.why, p: +lk.p.toFixed(2), o: ['supp'], vis: !!u.seenBy }); }
  }
}
function suppAct(W, u, dt){   // 적 사수: 받은 견제사격 (보이는 상대가 생기면 그쪽을 겨눔)
  if (u.suppPend && W.t >= u.suppPend.at){ const P = u.suppPend; u.suppPend = null; u.supp = { x: P.x, y: P.y, n: (SUP(W) || {}).n || 3, ai: true, hid: !!P.hid, arc: P.arc !== undefined ? !!P.arc : undefined }; }
  if (!u.supp) return false;
  if (W.units.some(f => f.alive && f.side !== u.side && canSee(W, u, f) && gap(u, f) <= u.rng)){ L(W, { k: 'suppEnd', a: u.i, n: u.supp.fired || 0, hit: u.supp.hits || 0, why: '상대가 보임', vis: !!u.seenBy }); u.supp = null; return false; }
  suppStep(W, u, dt, u.supp, () => { u.supp = null; }); return true;
}
// v7.7 적 암살조 (프로): 지휘관이 우리를 알고 있으면 숨는 솜씨가 되는 근접 하나를 등이 비는 아군에게 숨어서 보냄 (지휘 전달 공식) — 하나씩
const SHD = W => W.rules.shadow;
const opBusy = (W, u) => !!(W.wedge && (W.wedge.tip === u.i || (W.wedge.sh || []).includes(u.i) || (W.wedge.body || []).includes(u.i))) || !!(W.env && W.env.wp && W.env.wp[u.i]);
function planShadow(W){
  const H = SHD(W), A = ASN(W); if (!H || !A || AI6.includes('shadow') || AI6.includes('assn')) return;
  const C = cmdBoss(W, 1); if (!C || roamIdle(C) || !W.alarm1 || W.t < (W.shadowNext || 0)) return;
  if (W.units.some(u => u.alive && u.side === 1 && (u.shadow || u.shadowPend))) return;
  W.shadowNext = W.t + 1.5;
  const known = W.units.filter(t => t.alive && !t.down && t.side === 0 && !(t.giant || t.modBody || t.bodyShield || t.max >= (A.big || 300)) && W.units.some(e => e.alive && e.side === 1 && (canSee(W, e, t) || fresh(W, e.sense[t.i], 3))));
  if (!known.length) return;
  let best = null, bs = H.score || 0.25;
  for (const u of W.units){
    if (!u.alive || u.down || u.side !== 1 || isFar(u) || !(u.assnE >= (H.min || 0.4)) || u.giant || u.role === '전선' || u.line || u.lretId != null || u.pact || u.crawl || u.kb || u.seenBy || u.supp || u.lurk || u.act || roamIdle(u) || opBusy(W, u)) continue;
    if (W.units.some(f => f.alive && !f.down && f.side === 0 && dist(f, u) < 2.5)) continue;
    for (const t of known){ const d = dist(u, t); if (d > (H.far || 14)) continue; const V = assnVigil(W, t, u); if (V.no) continue;
      const sc = u.assnE * (1 - V.v) + (isFar(t) || t.cls === '치유' ? H.shoot || 0.15 : 0) - d * 0.015; if (sc > bs){ bs = sc; best = { u, t }; } }
  }
  if (!best) return;
  const { u, t } = best, lk = u === C ? { p: 1, t: 0 } : cmdLink(W, C, u);   // v7.13 지휘망
  if (W.rand() < lk.p) u.shadowPend = { b: t.i, at: W.t + lk.t, s: +bs.toFixed(2) };
  else if (W.t - (u.missLogT == null ? -9 : u.missLogT) > 3){ u.missLogT = W.t; L(W, { k: 'cmdMiss', side: 1, a: u.i, c: C.i, via: lk.via, why: lk.why, p: +lk.p.toFixed(2), o: ['shadow', t.i], vis: !!u.seenBy }); }
}
function shadowStep(W, u, dt){
  const H = SHD(W) || {};
  if (u.shadowPend && W.t >= u.shadowPend.at){ const P = u.shadowPend; u.shadowPend = null; u.shadow = { b: P.b, t0: W.t, st0: !!u.stealth, last: null }; u.stealth = true; L(W, { k: 'shadow', a: u.i, b: P.b, s: P.s, hid: !u.seenBy }); }
  const S = u.shadow; if (!S) return false;
  const c = W.units[S.b];
  const end = why => { u.stealth = S.st0; u.shadow = null; W.shadowNext = W.t + (H.cd || 8); L(W, { k: 'shadowEnd', a: u.i, b: S.b, why, ok: !!(c && c.assnBy === u.i), hid: !u.seenBy }); };
  if (u.act) return true;
  if (!c || !c.alive || c.down){ end(c && c.assnBy === u.i ? '해냄' : '대상이 쓰러짐'); return false; }
  if (W.t - S.t0 > (H.max || 25)){ end('시간'); return false; }
  const sp = assnSpotted(W, u); if (sp){ end('들킴 (' + sp.name + ')'); return false; }
  if (W.units.some(f => f.alive && !f.down && f.side !== u.side && !isFar(f) && gap(u, f) < Math.max(u.rng, f.rng) + 0.3 && sideOf(W, f, u) !== 'back')){ end('맞붙음'); return false; }
  const kn = canSee(W, u, c) || W.units.some(e => e.alive && e.side === u.side && e !== u && canSee(W, e, c));
  if (kn) S.last = { x: c.x, y: c.y };
  if (!S.last){ end('놓침'); return false; }
  if (!kn){ if (Math.hypot(S.last.x - u.x, S.last.y - u.y) < 0.6){ end('놓침'); return false; } setMood(W, u, '숨어 찾음', c.i); goTo(W, u, S.last.x, S.last.y, dt); return true; }
  if (dist(u, c) > 3.2){
    let k = H.back || 2.5, bx = c.x - Math.cos(c.face) * k, by = c.y - Math.sin(c.face) * k;
    if (glowAt(W, bx, by)){ k += 1.2; bx = c.x - Math.cos(c.face) * k; by = c.y - Math.sin(c.face) * k; }
    bx = Math.max(0.6, Math.min(W.map.W - 0.6, bx)); by = Math.max(0.6, Math.min(W.map.H - 0.6, by));
    if (boxRock(W, bx, by, u.r)){ bx = c.x; by = c.y; }
    setMood(W, u, '숨어 돌아감', c.i); goTo(W, u, bx, by, dt); return true;
  }
  const r = assnStep(W, u, c, dt);
  if (r === 'go' || r === 'move'){ S.blockT = null; return true; }
  if (S.blockT == null) S.blockT = W.t;
  if (W.t - S.blockT > (H.wait || 2.5)){ end(r); return false; }
  stop(u); u.fg = Math.atan2(c.y - u.y, c.x - u.x); setMood(W, u, '숨어 틈을 봄', c.i); return true;
}
// v7.6 암살: 숨은 채 (은신 · 매복 · 어둠 속 우회) 아무에게도 들키지 않고 · 상대가 알아채지 못하고 · 경계가 강하지 않을 때 등 뒤를 잡으면 소리 없이 숨을 끊음 (아군 · 적 같음)
const ASN = W => W.rules.assn;
function assnSkill(W, u){ const A = ASN(W); if (!A) return 0; const tr = u.traits || [], vg = (tr.find(x => /^급소[SABC]$/.test(x)) || '').slice(2);
  const s = ((A.cls || {})[u.cls] != null ? A.cls[u.cls] : 0.6) * Math.sqrt(u.stealthE || 0) * (u.vet ? A.vet || 1 : 1) * (vg ? (A.vital || {})[vg] || 1 : 1) * (tr.includes('일반인') ? A.layman || 1 : 1) * (u.giant || u.modBody ? A.giant || 0.25 : 1);
  return Math.max(0, Math.min(A.max || 0.95, s)); }
// 경계: 우리 편을 알고 있음 · 곁의 동료 (결집) · 경계 자세 · 초병 · 두리번거림 (수색 · 방금 맞음). 다른 상대와 맞붙어 손이 묶였으면 덜함. 앎 + 동료 둘 이상 + 경계 = 불가능
function assnVigil(W, t, a){
  const A = ASN(W) || {}, why = []; let v = 0;
  const know = t.side === 1 ? !!t.woke || t.state === 'hunt' || t.state === 'search' : W.units.some(e => e.alive && e.side !== t.side && (e.seenBy || fresh(W, t.sense[e.i])));
  if (know){ v += A.know || 0; why.push('알고 있음'); }
  const n = W.units.filter(o => o.alive && !o.down && o !== t && o.side === t.side && dist(o, t) <= (A.near || 2.5)).length;
  if (n){ v += Math.min(A.clusterMax || 0.45, n * (A.cluster || 0.15)); why.push('곁에 동료 ' + n); }
  const f = focusOf(W, t), busy = !!(f && f !== a && f.alive && f.side !== t.side && gap(t, f) < (t.rng || 0.5) + 0.6);
  const grd = guardOn(W, t) || t.guardMode === 'hold' || !!t.sentry;
  if (grd){ v += A.guard || 0; why.push(t.sentry ? '초병' : '경계 자세'); }
  const look = !busy && (t.state === 'search' || W.t - (t.hitT == null ? -9 : t.hitT) < (A.hitT || 3));
  if (look){ v += A.search || 0; why.push('두리번거림'); }
  if (busy){ v -= A.busy || 0; why.push('다른 상대에 묶임'); }
  return { v: Math.max(0, Math.min(1, v)), why, no: know && n >= 2 && (grd || look), n, know };
}
// 지금 이 자리에서 암살할 수 있나: ok · 확률 p · 까닭 why (loose = 자리 · 숨음은 보지 않음 — 노릴 만한가)
function assnCan(W, a, t, loose){
  const A = ASN(W);
  if (!A || AI6.includes('assn') || !(a.assnE > 0)) return { ok: false, why: '암살 솜씨 없음' };
  if (!t || !t.alive || t.down || t.side === a.side) return { ok: false, why: '대상 없음' };
  if (t.giant || t.modBody || t.bodyShield || t.max >= (A.big || 300)) return { ok: false, why: '한 번에 끊을 수 없는 몸' };
  if (!loose){
    if (!(a.stealth || a.lurk || a.stalk || (a.warden && a.warden.on)) || stealthK(W, a) >= 1) return { ok: false, why: '숨지 않음' };
    if ((t.heads || 1) > 1 || sideOf(W, t, a) !== 'back') return { ok: false, why: '등 뒤가 아님' };
    if (gap(a, t) > (isFar(a) ? A.knife || 0.35 : a.rng) + W.rules.reach) return { ok: false, why: '손이 안 닿음' };
  }
  if (aware(W, t, a)) return { ok: false, why: '알아챔' };
  const eye = W.units.find(o => o.alive && !o.down && o !== t && o.side === t.side && canSee(W, o, a) && ((o.heads || 1) > 1 || sideV(W, o, a) !== 'back'));
  if (eye) return { ok: false, why: '보는 눈 (' + eye.name + ')', eye: eye.i };
  const V = assnVigil(W, t, a);
  if (V.no) return { ok: false, why: '결집 · 경계 (' + V.why.join(' · ') + ')', V };
  const p = a.assnE * (1 - V.v) * (a.exhausted ? 0.8 : 1);
  return { ok: p > 0.01, p, V, why: V.why.join(' · ') };
}
function startAssn(W, u, t, AS){
  const A = ASN(W) || {}, wind = (A.wind || 0.45) * (u.injWind || 1);
  u.act = { k: 'assn', b: t.i, phase: 'wind', t0: W.t, end: W.t + wind, why: '암살', p: AS.p };
  u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u); u.waitT = 0;
  setMood(W, u, '암살', t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, assn: true, p: +AS.p.toFixed(2), w: isFar(u) ? '단검' : u.weaponNow || u.weapon || '', end: +(W.t + wind).toFixed(2), hid: u.side === 1 && !u.seenBy, why: '암살' });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind, assn: true });
}
// 준비 끝: 다시 봄 (그새 돌아섰나 · 누가 봤나) → 성공이면 소리 없이 숨을 끊음 (소음 · 비명 · 경보 없음, 드러나지 않음). 실패면 몸부림 — 기습 일격 · 외침 · 들킴
function resolveAssn(W, u){
  const A = u.act, t = W.units[A.b], AR = ASN(W) || {};
  if (A.phase !== 'wind'){ u.act = null; return; }
  A.phase = 'rec'; A.t1 = W.t; A.end = W.t + (AR.rec || 0.5);
  if (!t || !t.alive || t.down){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐' }); return; }
  if (gap(u, t) > (isFar(u) ? AR.knife || 0.35 : u.rng) + W.rules.reach){ u.miss++; L(W, { k: 'miss', a: u.i, b: t.i, why: `손이 안 닿음 (${gap(u, t).toFixed(1)}칸 떨어짐)` }); return; }
  const AS = assnCan(W, u, t);
  if (AS.ok && W.rand() < AS.p){
    u.assnN = (u.assnN || 0) + 1; t.assnBy = u.i; t.assnT = W.t;
    L(W, { k: 'assn', a: u.i, b: t.i, p: +AS.p.toFixed(2), hp: Math.round(t.hp), why: AS.why || '', hid: u.side === 1 && !u.seenBy });
    applyDmg(W, u, t, Math.ceil(t.hp) + 1, { dir: 'back', far: false, silent: true, assn: true, part: '목', tag: '소리 없이 숨을 끊음 (암살)', death: 'assn' });
    assnWitness(W, u, t);
    return;
  }
  u.revealT = W.t;
  L(W, { k: 'assnFail', a: u.i, b: t.i, p: AS.ok ? +AS.p.toFixed(2) : 0, why: AS.ok ? '몸부림' : AS.why, hid: u.side === 1 && !u.seenBy });
  if (!evadeMelee(W, t, u)) strike(W, u, t, t, 1, false, isFar(u) ? { mul: AR.knifeMul || 0.6 } : null);
  if (W.rules.din) dinAdd(W, t.x, t.y, W.rules.din.shout || 1.5);   // 외침
  for (const o of W.units) if (o.alive && o !== t && o.side === t.side && dist(o, t) <= hearR(W, o, t)) o.sense[u.i] = { x: u.x + (W.rand() - 0.5), y: u.y + (W.rand() - 0.5), t: W.t, exact: false, scream: true };
}
// 쓰러지는 걸 본 동료 (앞 · 옆으로 피해자를 봄) → 그쪽을 경계 · 수색 (적은 경보)
function assnAlarm(W, o, t, u){
  if (u && u.alive) o.sense[u.i] = { x: t.x + (W.rand() - 0.5) * 1.5, y: t.y + (W.rand() - 0.5) * 1.5, t: W.t, exact: false, corpse: true };
  if (o.side !== 1) return;
  if (o.state !== 'hunt'){ o.state = 'search'; o.last = { x: t.x, y: t.y }; o.searchT = 6; }
  if (!W.alarm1){ W.alarm1 = { t: W.t, by: o.i, b: u ? u.i : t.i, x: t.x, y: t.y, surprise: surpriseEst(W) }; L(W, { k: 'sentry', side: 1, a: o.i, b: u ? u.i : t.i, grp: roamN(W, o), surprise: W.alarm1.surprise, corpse: true, d: +dist(o, t).toFixed(1), vis: true }); }
}
const assnEye = (W, o, t) => o.alive && !o.down && o !== t && o.side === t.side && canSee(W, o, t) && ((o.heads || 1) > 1 || sideV(W, o, t) !== 'back');
function assnWitness(W, u, t){
  for (const o of W.units){ if (!assnEye(W, o, t)) continue; t.assnFound = true;
    L(W, { k: 'assnSeen', a: o.i, b: t.i, by: u.i, see: canSee(W, o, u), hid: o.side === 1 && !o.seenBy }); assnAlarm(W, o, t, u); }
}
// 시신 발견: 암살당한 몸을 동료가 (앞 · 옆으로) 보면 그때 앎
function assnFoundTick(W){
  if (!ASN(W)) return;
  for (const t of W.units){ if (t.alive || t.assnT == null || t.assnFound) continue;
    const o = W.units.find(o => assnEye(W, o, t)); if (!o) continue; t.assnFound = true;
    L(W, { k: 'assnFound', a: o.i, b: t.i, sec: +(W.t - t.assnT).toFixed(1), hid: o.side === 1 && !o.seenBy }); assnAlarm(W, o, t, W.units[t.assnBy]); }
}
// 등 뒤로 숨어 다가감: 상대가 바라보는 반대쪽 (몸 + 손 닿는 거리). 앞 · 옆 가까이면 옆으로 크게 돌아 들어감. 등 뒤 · 손 닿으면 'go' (암살 시작), 못 하면 까닭
function assnStep(W, u, t, dt){
  const A = ASN(W) || {}, sd = sideOf(W, t, u), rch = isFar(u) ? A.knife || 0.35 : u.rng + W.rules.reach * 0.5;
  if (sd === 'back' && gap(u, t) <= rch){ const AS = assnCan(W, u, t); if (AS.ok){ startAssn(W, u, t, AS); return 'go'; } return AS.why; }
  const d0 = t.r + u.r + Math.min(rch, 0.5) * 0.5; let gx = t.x - Math.cos(t.face) * d0, gy = t.y - Math.sin(t.face) * d0;
  if (sd === 'front' || (sd === 'side' && dist(u, t) < 2.2)){
    const cw = Math.sin(Math.atan2(u.y - t.y, u.x - t.x) - t.face) >= 0 ? 1 : -1, a2 = t.face + cw * (sd === 'front' ? 1.9 : 2.6), r2 = Math.max(2, Math.min(3, dist(u, t)));
    const x2 = t.x + Math.cos(a2) * r2, y2 = t.y + Math.sin(a2) * r2;
    if (x2 > 0.6 && y2 > 0.6 && x2 < W.map.W - 0.6 && y2 < W.map.H - 0.6 && !boxRock(W, x2, y2, u.r)){ gx = x2; gy = y2; }
  }
  setMood(W, u, '숨어 등 뒤로', t.i); goTo(W, u, gx, gy, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  return 'move';
}
// 들킴: 상대 누구라도 앞 · 옆으로 나를 봄
const assnSpotted = (W, u) => W.units.find(e => e.alive && !e.down && e.side !== u.side && canSee(W, e, u) && ((e.heads || 1) > 1 || sideV(W, e, u) !== 'back'));
// 암살 명령 (아군): 숨어서 (은신을 켬) 그 상대의 등 뒤로 → 손 닿으면 처치. 들키거나 · 놓치거나 · 경계가 풀리지 않으면 그만두고 자동 전투
function assnOrder(W, u, dt){
  const o = u.order, t = W.units[o.b], A = ASN(W) || {};
  if (!o.on){ o.on = true; o.st0 = !!u.stealth; o.t0 = W.t; u.stealth = true; if (t && !o.last) o.last = { x: t.x, y: t.y }; L(W, { k: 'assnGo', a: u.i, b: o.b, e: +(u.assnE || 0).toFixed(2), vis: true }); }
  const end = (why, keep) => { if (!keep) u.stealth = o.st0; u.order = null; u.stay = { x: u.x, y: u.y }; if (why) L(W, { k: 'assnAbort', a: u.i, b: o.b, why, vis: true }); };
  if (!t || !t.alive || t.down){ end(t && t.assnBy === u.i ? '' : '대상이 쓰러짐', t && t.assnBy === u.i); return; }   // 해냄 → 숨은 채 그 자리 (자동)
  if (!(u.assnE > 0) || !ASN(W)){ end('암살 솜씨 없음'); return; }
  const sp = assnSpotted(W, u);
  if (sp && W.t - o.t0 > 0.3){ end('들킴 (' + sp.name + ')'); return; }
  if (W.t - o.t0 > (A.ordMax || 30)){ end('시간이 너무 걸림'); return; }
  const see = canSee(W, u, t) || (u.side === 0 && !!t.seenBy);
  if (see) o.last = { x: t.x, y: t.y };
  else { if (!o.last || Math.hypot(o.last.x - u.x, o.last.y - u.y) < 0.4){ end('대상을 놓침'); return; } setMood(W, u, '숨어 찾음', t.i); goTo(W, u, o.last.x, o.last.y, dt); return; }
  const r = assnStep(W, u, t, dt);
  if (r === 'go' || r === 'move'){ o.blockT = null; return; }
  if (o.blockT == null) o.blockT = W.t;
  if (W.t - o.blockT > 2){ end(r); return; }
  stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '숨어 틈을 봄 (' + r + ')', t.i);
}
// 자동 전투 (아군 · 적 같음): 솜씨가 ai 이상인 근접이 어둠 속에서 아무에게도 안 보이고 맞붙지 않았으면, seek 칸 안의 등이 열린 상대를 숨어서 노림 (들키면 그만둠)
function assnAIoff(W, u, why){ const S = u.asAI; if (!S) return; u.stealth = S.st0; u.asAI = null; u.asNext = W.t + 3; if (why) L(W, { k: 'assnAIend', a: u.i, b: S.b, why, hid: u.side === 1 && !u.seenBy }); }
function assnAI(W, u, dt){
  const A = ASN(W);
  if (!A || AI6.includes('assn') || isFar(u) || !(u.assnE >= (A.ai || 0.4)) || u.line || u.lretId != null || u.pact || u.crawl || u.kb || u.role === '전선' || u.act){ if (u.asAI && !u.act) assnAIoff(W, u, ''); return false; }
  const st0 = u.stealth; u.stealth = true; const sp = assnSpotted(W, u); u.stealth = st0;   // 숨는다면 보일까 (숨는 건 곧바로)
  if (sp){ if (u.asAI) assnAIoff(W, u, '들킴 (' + sp.name + ')'); return false; }
  if (W.units.some(f => f.alive && !f.down && f.side !== u.side && !isFar(f) && gap(u, f) < Math.max(u.rng, f.rng) + 0.3 && sideOf(W, f, u) !== 'back')){ if (u.asAI) assnAIoff(W, u, '맞붙음'); return false; }
  if (!u.asAI){
    if (W.t < (u.asNext || 0) || glowAt(W, u.x, u.y)) return false; u.asNext = W.t + 0.3;
    let best = null, bp = 0.3;
    for (const c of W.units){ if (!c.alive || c.down || c.side === u.side || dist(u, c) > (A.seek || 5) || !canSee(W, u, c) || (sideOf(W, c, u) === 'front' && dist(u, c) < 1.6)) continue;
      const AS = assnCan(W, u, c, true); if (!AS.ok) continue; const p = AS.p - dist(u, c) * 0.02; if (p > bp){ bp = p; best = c; } }
    if (!best) return false;
    u.asAI = { b: best.i, t0: W.t, st0: !!u.stealth }; u.stealth = true;
    L(W, { k: 'assnAI', a: u.i, b: best.i, p: +bp.toFixed(2), hid: u.side === 1 && !u.seenBy });
  }
  const c = W.units[u.asAI.b];
  if (!c || !c.alive || c.down){ assnAIoff(W, u, ''); return false; }
  if (W.t - u.asAI.t0 > 10 || dist(u, c) > (A.seek || 5) + 2 || aware(W, c, u)){ assnAIoff(W, u, W.t - u.asAI.t0 > 10 ? '시간' : aware(W, c, u) ? '알아챔' : '멀어짐'); return false; }
  const r = assnStep(W, u, c, dt);
  if (r === 'go' || r === 'move') return true;
  assnAIoff(W, u, r); return false;
}
// 지금 낼 수 있는 속력: 다리 상처 · 맞고 움찔 (pinTime 동안 ×0.4)
const spdNow0 = (W, u) => (u.winded && W.rules.stamina && W.rules.stamina.jog ? Math.min(1, W.rules.stamina.jog / Math.max(0.1, u.spd * u.spdMul * (u.injSpd || 1))) : 1) * u.spd * u.spdMul * (u.injSpd || 1) * (!u.winded && !u.noRun && !(W.t < (u.hobbleT || -9)) && !(u.exhausted && !AI6.includes('fat')) && ((u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack' || u.order.k === 'exit')) || (u.mv && u.mv.run && W.t < u.mv.until) || (u.flee && W.t < u.flee.until) || (u.fRun != null && W.t < u.fRun) || (u.side === 1 && !u.order && u.ug && !u.raised && !u.act && W.t - (u.ugT == null ? -9 : u.ugT) < 0.5)) ? (W.rules.run || 1.3) * (u.runK || 1) : 1) * (u.raised && u.shield && !(u.act && u.act.k === 'charge') ? ((W.rules.guard || {}).walk || 0.75) : 1) * (W.t < u.pinT ? 0.4 : 1) * (u.quadOn ? W.rules.quadMul || 1.4 : 1) * (u.crawl ? (W.rules.crawl != null ? W.rules.crawl : 0.2) : 1) * (u.stealth && !(u.order && u.order.hurry) && !(u.sc && u.sc.ph === 'flee') && !(u.torch && !u.torchOff) && (u.stealthE || 0) >= (STL(W).min || 0) ? (STL(W).spd || 0.6) : 1) * (W.t < (u.frostT || -9) ? ((W.rules.frost || {}).spd || 0.55) : 1) * (u.czSpd || 1) * (W.t < (u.hobbleT || -9) ? (W.rules.hobble || 0.4) : 1);   // v5.2 기어다님   /* v7.23.1 동상 · 세자르 걸음 */   // v7.5 은신 걸음   // v7.8.4 횃불을 켰거나 · 숨을 수 없는 몸이면 숨어 걷지 않음 (느리기만 한 헛짓)
const wetAt = (m, x, y) => !!m.water && m.water.some(w => ((x - w.x) / w.rx) ** 2 + ((y - w.y) / w.ry) ** 2 <= 1);   // v7.22 얕은 물 속인가
const spdNow = (W, u) => spdNow0(W, u) * (u.stoneT != null && W.t < u.stoneT ? (SPR(W, 'stone').slow || 0.4) : 1) * (u.lie && !u.lieSw ? (W.rules.lie || {}).spd || 0.25 : 1) * (W.t < (u.lungeT == null ? -9 : u.lungeT) ? u.lungeK || 1 : 1) * (W.map.water && wetAt(W.map, u.x, u.y) ? ((u.traits || []).includes('가호:바다') ? (TER(W).waterSea || 1.15) : (TER(W).water != null ? TER(W).water : 0.7)) : 1) * (W.t < (u.poolSlowT == null ? -9 : u.poolSlowT) ? (SPR(W, 'pool').slow || 0.7) : 1) * (u.fpK && W.t < (u.fpKT || -9) ? u.fpK : 1) * (u.fb && u.fb.sh === '방진' ? FBR(W).slow || 0.9 : 1) * (u.sqzSlow && W.t < u.sqzSlow ? 0.6 : 1);   /* v8.7.5 편대장은 가장 느린 편대원에 맞춤 · 사방 경계는 느림 · 좁은 길에서 몸을 붙여 지나감 */   // v7.22 얕은 물 (v7.22.2 [가호:바다] 는 빨라짐)   // v7.22.3 핏빛 장판   // v7.17 기습 가속 · 팜 버스트 돌입   // v7.11 엎드려 김 (포복)
// 몸 너비까지 지나갈 수 있는 직선인가 (가운데 + 양옆 두 줄)
function fatClear(m, x0, y0, x1, y1, r){
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, ox = -dy / l * r, oy = dx / l * r;
  return losClear(m, x0, y0, x1, y1) && losClear(m, x0 + ox, y0 + oy, x1 + ox, y1 + oy) && losClear(m, x0 - ox, y0 - oy, x1 - ox, y1 - oy);
}
// v7.21 걷는 길: 지름길 (곧장 감) 은 무더기 · 뿌리 벽도 막힘으로 봄 — 시야 (losClear) 는 무더기를 높이로 따로 보므로 걷기와 다름
function walkLine(m, x0, y0, x1, y1){ const dx = x1 - x0, dy = y1 - y0, n = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) * 2.5); for (let i = 1; i < n; i++){ const t = i / n; if (rock(m, x0 + dx * t, y0 + dy * t)) return false; } return true; }
function walkClear(m, x0, y0, x1, y1, r){ const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, ox = -dy / l * r, oy = dx / l * r; return walkLine(m, x0, y0, x1, y1) && walkLine(m, x0 + ox, y0 + oy, x1 + ox, y1 + oy) && walkLine(m, x0 - ox, y0 - oy, x1 - ox, y1 - oy); }
function setGoal(W, u, x, y){
  if (u.goal && Math.hypot(u.goal.x - x, u.goal.y - y) < 0.6 && u.path && W.t - u.pathT < 0.8) return;
  u.goal = { x, y }; u.pathT = W.t;
  const big = u.r > 0.6;   /* v8.7.4 큰 몸 (망각): 몸 전체가 지나가는 줄 · 몸이 들어가는 칸으로 길을 찾음 */
  u.path = (big ? bigWalk(W.map, u.x, u.y, x, y, u.r * 0.9) : walkClear(W.map, u.x, u.y, x, y, u.r * 1.12)) ? [{ x, y }] : findPath(W.map, u.x, u.y, x, y, undefined, big ? u.r * 0.9 : 0) || null;   // v7.21 무더기는 돌아감
  if (u.path && u.path.length && (!big || bigOk(W.map, x, y, u.r * 0.9))) u.path[u.path.length - 1] = { x, y };
}
function stop(u){ u.goal = null; u.path = null; u.quadOn = false; }
function moveDir(W, u, dx, dy, dt){
  const s = spdNow(W, u) * dt * slopeK(W, u, dx, dy);   // v7.18 오르막
  tryMove(W, u, u.x + dx * s, u.y + dy * s);
  if (dx || dy) u.fg = Math.atan2(dy, dx);
}
function follow(W, u, dt, slow){
  if (!u.path || !u.path.length){ u.quadOn = false; return; }
  if (u.quad){   // [사족보행]: 목표까지 2칸 넘게 남았으면 네 발로
    let rem = 0, px = u.x, py = u.y; for (const w of u.path){ rem += Math.hypot(w.x - px, w.y - py); px = w.x; py = w.y; }
    const on = rem > 2 && !slow;
    if (on && !u.quadOn && W.t - u.quadLogT > 4){ u.quadLogT = W.t; L(W, { k: 'quad', a: u.i, vis: u.side === 0 || !!u.seenBy }); }
    u.quadOn = on;
  }
  let rem = spdNow(W, u) * dt * (slow || 1) * (W.map.hills && u.path[0] ? slopeK(W, u, u.path[0].x - u.x, u.path[0].y - u.y) : 1);   // v7.18 오르막 느림 · 내리막
  if (W.map.hills && u.path[0] && running(W, u)){ slopeTrip(W, u, u.path[0].x - u.x, u.path[0].y - u.y); if (!u.path || !u.path.length) return; }   // v7.18 비탈을 뛰면 미끄러짐
  const wv = u.side === 1 && !u.order && !u.act && !u.raised && underGun(W, u) ? weaveAng(W, u) : 0;   // v7.0 사선 안: 지그재그
  const lf = u.lretId != null && u.lretFT === W.t ? u.lretF : null;   // v7.2 전열 후퇴: 전열이 보던 쪽 (적) 으로 몸 · 방패를 고정
  const ft = lf != null ? null : faceThreat(W, u), w00 = u.path[0], fa = lf != null && w00 ? lf : ft && w00 ? Math.atan2(ft.y - u.y, ft.x - u.x) : null, ma = w00 ? Math.atan2(w00.y - u.y, w00.x - u.x) : null, dA = fa != null ? angDiff(ma, fa) : 0, BS = W.rules.backstep || {};
  const keepF = fa != null && dA > (BS.ang || 1.0);   // v7.1 위협을 보며 물러서기 · 옆걸음
  if (keepF){ rem *= dA > 2.1 ? BS.back || 0.65 : BS.side || 0.85; if (ft && (!u.bsT || W.t - u.bsT > 3)){ u.bsT = W.t; if (u.side === 0 || u.seenBy) L(W, { k: 'backstep', a: u.i, b: ft.i, back: dA > 2.1, vis: u.side === 0 || !!u.seenBy }); } }
  { const ACC = W.rules.accel, w0 = u.path[0];   // v7.0 관성: 멈춰 있다 출발하거나 방향을 크게 틀면 속력이 가속 (accel 칸/초²) 만큼씩 붙음 — 쏜 뒤 명령으로 탄도를 벗어나기 어려움
    if (ACC && !AI6.includes('accel') && w0){ const hd = Math.atan2(w0.y - u.y, w0.x - u.x) + wv; if (u.mvH != null && W.t - (u.mvT == null ? -9 : u.mvT) < 0.1) u.curSp = (u.curSp || 0) * Math.max(0, Math.cos(angDiff(hd, u.mvH))); else u.curSp = 0;
      u.curSp = Math.min(rem / dt, (u.curSp || 0) + ACC * dt * (W.t < (u.lungeT == null ? -9 : u.lungeT) ? 3 : 1)); u.mvH = hd; u.mvT = W.t; rem = u.curSp * dt; } }   /* v7.17 덮칠 땐 순간 가속 ×3 */
  while (rem > 0 && u.path.length){
    const w = u.path[0], d = Math.hypot(w.x - u.x, w.y - u.y);
    if (d < 0.05){ u.path.shift(); continue; }
    if (wv && d > 0.6){ const ux = (w.x - u.x) / d, uy = (w.y - u.y) / d, c = Math.cos(wv), sn = Math.sin(wv), s2 = Math.min(rem, d * 0.5); u.fg = keepF ? fa : Math.atan2(w.y - u.y, w.x - u.x); tryMove(W, u, u.x + (ux * c - uy * sn) * s2, u.y + (ux * sn + uy * c) * s2); break; }
    const s = Math.min(rem, d); u.fg = keepF ? fa : Math.atan2(w.y - u.y, w.x - u.x);
    tryMove(W, u, u.x + (w.x - u.x) / d * s, u.y + (w.y - u.y) / d * s);
    rem -= s; if (s >= d - 1e-6) u.path.shift(); else break;
  }
  if (u.goal && u.path && u.path.length > 1 && W.t - (u.skipT || 0) > 0.3){ u.skipT = W.t; if (walkClear(W.map, u.x, u.y, u.goal.x, u.goal.y, u.r * 1.12)) u.path = [u.goal]; }
}
function goTo(W, u, x, y, dt){ setGoal(W, u, x, y); follow(W, u, dt); }
// v7.1 움직이는 동안 몸 (방어) 을 둘 위협: 나를 치려는 · 돌진해 오는 · 겨누는 상대가 먼저, 그다음 가장 가까운 아는 근접 상대 (손 + near 칸 안). 서두르기 · 질주 · 돌진 · 기어다님은 없음 (돌아서 뜀)
function faceThreat(W, u){
  if (AI6.includes('backstep') || u.crawl || u.quadOn || (u.order && u.order.hurry) || (u.mv && u.mv.run && W.t < u.mv.until) || (u.side === 1 && u.ug && !u.raised)) return null;
  const near = (W.rules.backstep || {}).near || 2.5; let best = null, bs = 1e9;
  for (const f of W.units){ if (!f.alive || f.side === u.side || f.crawl || f.down) continue;
    if (!(u.side === 0 ? (f.seenBy || canSee(W, u, f)) : (canSee(W, u, f) || fresh(W, u.sense[f.i], 1.5)))) continue;
    const g = gap(u, f), on = !!(f.act && f.act.b === u.i && (f.act.k === 'atk' || f.act.k === 'charge' || f.act.k === 'throw')), shooter = (isFar(f) && f.ammo !== 0) || (f.jav && f.spearHeld);
    let sc;
    if (shooter){ const inc = arcAt(W, f, u);   // v7.1.1 사수: 사거리 안 · 사선이 열림 · 겨누는 · 곡사가 내 쪽으로 날아오는 중
      if (!on && !inc && (g > f.rng + 1 || !losClear(W.map, f.x, f.y, u.x, u.y))) continue;
      sc = (on || inc ? 0 : 3) + g * 0.4; }
    else { if (!on && g > f.rng + near) continue; sc = g - (on ? 6 : 0) - (g < f.rng + 0.3 ? 3 : 0); }   // 근접: 손이 닿는 칼이 먼저
    if (sc < bs){ bs = sc; best = f; } }
  return best;
}
// v7.1.1 곡사 (화살 · 창) 가 내 둘레 (1.2칸) 로 떨어지는 중이거나 나를 노리고 날아오는 중
const arcAt = (W, f, u) => W.shots.some(s => s.a === f.i && !s.done && (s.meant === u.i || (s.arc && Math.hypot(s.lx - u.x, s.ly - u.y) < 1.2)));
function tryMove(W, u, nx, ny){
  const m = W.map, r = u.r * 0.9, ox = u.x, oy = u.y;
  const ok = r > 0.55 ? (x, y) => bigOk(m, x, y, r) : (x, y) => !rock(m, x - r, y - r) && !rock(m, x + r, y - r) && !rock(m, x - r, y + r) && !rock(m, x + r, y + r);   /* v8.7.4 큰 몸은 몸 전체 */
  if (ok(nx, ny)){ u.x = nx; u.y = ny; }
  else if (Math.abs(nx - ox) > 1e-6 && ok(nx, oy)) u.x = nx;
  else if (Math.abs(ny - oy) > 1e-6 && ok(ox, ny)) u.y = ny;
  else {   // 몸이 바위 모서리에 걸림 → 지금 칸 가운데 쪽으로 조금 비켜섬
    const cx = Math.floor(u.x) + 0.5, cy = Math.floor(u.y) + 0.5, s = Math.min(Math.hypot(nx - ox, ny - oy), 0.05);
    const tx = ox + Math.sign(cx - ox) * Math.min(s, Math.abs(cx - ox)), ty = oy + Math.sign(cy - oy) * Math.min(s, Math.abs(cy - oy));
    if (ok(tx, ty)){ u.x = tx; u.y = ty; }
  }
  u.moved += Math.hypot(u.x - ox, u.y - oy);
}
// v7.26.1 좁은 곳: 지금 칸이나 다음 길목 칸이 양옆 (또는 위아래) 이 벽 — 한 칸 문 · 통로
const tightCell = (m, cx, cy) => (rock(m, cx - 0.5, cy + 0.5) && rock(m, cx + 1.5, cy + 0.5)) || (rock(m, cx + 0.5, cy - 0.5) && rock(m, cx + 0.5, cy + 1.5));
const tightAt = (W, u) => tightCell(W.map, Math.floor(u.x), Math.floor(u.y)) || (!!u.path && !!u.path[0] && tightCell(W.map, Math.floor(u.path[0].x), Math.floor(u.path[0].y)));
function separate(W){
  const A = W.units.filter(u => u.alive);
  for (let a = 0; a < A.length; a++) for (let b = a + 1; b < A.length; b++){
    const P = A[a], Q = A[b], dx = Q.x - P.x, dy = Q.y - P.y, d = Math.hypot(dx, dy) || 0.001, need = P.r + Q.r;
    if (d >= need) continue;
    if (P.side === Q.side && ((P.sqzP === Q.i && W.t < P.sqzT) || (Q.sqzP === P.i && W.t < Q.sqzT))) continue;   /* v8.7.5 좁은 길: 몸을 붙여 지나가는 중 */
    if ((P.act && P.act.air) || (Q.act && Q.act.air)) continue;   /* v7.24 높이 뛴 몸 (도약 강타) 은 겹쳐도 밀지 않음 — 내려앉는 자리의 몸이 미리 비켜 나지 않게 */
    if (P.lie || Q.lie) lieTrample(W, P, Q);   // v7.11 모르고 밟음
    const soft = P.side === Q.side && !P.act && !Q.act && P.path && P.path.length && Q.path && Q.path.length && (tightAt(W, P) || tightAt(W, Q)) ? (W.rules.sepSoft != null ? W.rules.sepSoft : 0.35) : 1;   /* v7.26.1 좁은 문 · 통로 앞에서 둘 다 길을 가는 같은 편은 덜 밂 — 비켜 지나감 (넓은 곳은 그대로) */
    const push = (need - d) / 2 * soft, ux = dx / d, uy = dy / d;
    // 공격 준비 · 회복 중인 쪽은 버팀 (밀리지 않음)
    let pw = P.act ? 0 : Q.act ? 2 : 1, qw = Q.act ? 0 : P.act ? 2 : 1;
    if (soft < 1){ if (P.i < Q.i){ pw = 0.25; qw = 1.75; } else { pw = 1.75; qw = 0.25; } }   /* v7.26.1 둘이 문 앞에 나란히 서서 서로 막지 않게 — 먼저 온 (번호가 앞선) 쪽이 지나갈 차례 */
    // 밀려난 거리는 '한 턴 이동' 에 세지 않음
    const pm = P.moved, qm = Q.moved;
    if (pw) tryMove(W, P, P.x - ux * push * pw, P.y - uy * push * pw);
    if (qw) tryMove(W, Q, Q.x + ux * push * qw, Q.y + uy * push * qw);
    if (P.side === Q.side && !P.act && !Q.act && !P.kb && !Q.kb) giveWay(W, P, Q, need - d);   /* v8.7.4 길 비켜 주기 (I21) */
    P.moved = pm; Q.moved = qm;
  }
}

// v8.7.4 길 비켜 주기 (I21): 가는 쪽 (다음 길목) · 마주 오면 둘 다 제 오른쪽으로 · 하나만 가는 중이면 서 있는 쪽이 그 길 옆으로 (교전 중 · 붙잡힘 · 엎드림은 그대로)
const hdOf = u => u.path && u.path[0] && Math.hypot(u.path[0].x - u.x, u.path[0].y - u.y) > 0.05 ? Math.atan2(u.path[0].y - u.y, u.path[0].x - u.x) : null;
function giveWay(W, P, Q, ov){
  if (P.lie || Q.lie || P.heldBy != null || Q.heldBy != null || P.line || Q.line) return;
  const hP = hdOf(P), hQ = hdOf(Q), k = Math.min(0.06, ov * 0.6);
  if (hP != null && hQ != null){ if (Math.cos(hP - hQ) < -0.5){ tryMove(W, P, P.x + Math.cos(hP - Math.PI / 2) * k, P.y + Math.sin(hP - Math.PI / 2) * k); tryMove(W, Q, Q.x + Math.cos(hQ - Math.PI / 2) * k, Q.y + Math.sin(hQ - Math.PI / 2) * k); } return; }   // 마주 옴 — 오른쪽 통행
  if (hP == null && hQ == null) return;
  const M = hP != null ? P : Q, S = M === P ? Q : P, h = M === P ? hP : hQ; if (S.order && S.order.k === 'hold') return;   // 제자리 명령은 그대로
  const cr = Math.cos(h) * (S.y - M.y) - Math.sin(h) * (S.x - M.x), sg = cr >= 0 ? 1 : -1, kk = k * 1.5, nx = S.x + Math.cos(h + sg * Math.PI / 2) * kk, ny = S.y + Math.sin(h + sg * Math.PI / 2) * kk;
  if ((tightAt(W, S) || tightAt(W, M) || boxRock(W, nx, ny, S.r * 0.9)) && !S.act && !(S.order && S.order.k === 'hold') && !W.units.some(f => f.alive && f.side !== S.side && gap(S, f) <= Math.max(S.rng, 0.5) + 0.6)){   /* v8.7.5 좁은 길 (J12): 옆으로 비킬 곳이 없음 — 몸을 붙여 지나가게 둠 (싸우는 중이면 그대로) */
    M.sqzP = S.i; M.sqzT = W.t + 0.5; S.sqzP = M.i; S.sqzT = W.t + 0.5; M.sqzSlow = W.t + 0.5;
    if (W.t - (M.sqzLogT || -9) > 5){ M.sqzLogT = W.t; L(W, { k: 'squeeze', a: M.i, b: S.i, vis: M.side === 0 || !!M.seenBy }); } return; }
  tryMove(W, S, nx, ny);   // 서 있는 쪽이 길 옆으로
}
/* ---------- 방향: 앞 · 측면 · 뒤 ---------- */
function angDiff(a, b){ let d = Math.abs(a - b) % (2 * Math.PI); return d > Math.PI ? 2 * Math.PI - d : d; }
// t 가 바라보는 방향에서 a 가 몇 도에 있나 → 'front' | 'side' | 'back'
function sideOf(W, t, a){
  const deg = angDiff(t.face, Math.atan2(a.y - t.y, a.x - t.x)) * 180 / Math.PI, F = W.rules.frontArc;
  return deg <= F ? 'front' : deg <= 180 - F ? 'side' : 'back';
}

/* ---------- v4.0 방어 자세 · 사선 ---------- */
// 방어 자세: 방패 · 대검 (guard 무기). 자세가 무너진 동안은 못 막음. 대검은 자기 공격 준비 · 회복 중엔 못 막음 (방패는 막음)
const guardOn = (W, u) => u.alive && u.canGuard && u.raised && !u.lie && W.t >= u.raiseAt && W.t >= u.brokenT && W.t >= (u.offBal || -9) && !u.crawl && W.t >= u.proneT && !u.kb && W.t >= (u.stunT || -9);   // v5.7 들어 올렸을 때만 · v5.5.3 휘청이면 못 막음
// v5.7.1 무구로 막기: 방패가 없으면 쥔 무기로 받아 냄 (근접만). 단검 · 둔기는 좁게, 검 · 창은 보통, 장검은 조금 넓게. 대검은 원래 막는 무기 (guard)
function parryArcW(R, name){
  const P = R.parry || {}, w = (R.weapons || {})[name];
  if (!w || isRangedW(w) || w.guard || w.kind === '맨손' || w.kind === '짐승') return 0;
  return /단검$/.test(name) ? P.dagger || 15 : /창$/.test(name) ? P.spear || 30 : w.kind === '둔기' ? P.blunt || 20 : name === '장검' ? P.long || 35 : P.blade || 30;
}
const parryArc = (W, u) => u.parry && !u.shield && !u.noArms && !unarmed(u) ? parryArcW(W.rules, u.weapon) : 0;
// 막는 폭 (°): 방패 · 대검 · [반사신경] 은 정해진 폭, 무구로 막기는 무기 폭 × 방어 재능 ([반사신경] 이면 넓게). 방패 뒤에서 치는 동안은 좁아짐
function guardArc(W, t){
  const pa = t.parry && !t.shield ? parryArc(W, t) : 0;
  let a = pa ? (t.reflex ? Math.max(pa, W.rules.guardArcRW || 55) : pa * (0.6 + 0.4 * (t.gTal != null ? t.gTal : 1))) : t.gArc;
  if (t.shield && t.act && t.act.k === 'atk') a *= (W.rules.guard || {}).strikeArc || 0.6;
  return a + (t.fb && t.fb.sh === '일자' && t.fb.row === 'front' ? FBR(W).arc || 20 : 0);   /* v8.7.5 방패벽 */
}
// v5.7.1 두 손으로 쥠: 방패가 없고 두 팔이 다 있으면 장검 · 대검 · 창은 두 손으로 — 더 세게 (twoHand ×). 방패를 들면 한 손
const twoHanded = (W, u) => !u.shield && !u.noArms && !(u.arms && (u.arms.L || u.arms.R)) && !unarmed(u) && (['장검', '대검'].includes(u.weaponNow || u.weapon) || /창$/.test(u.weaponNow || u.weapon));
// v5.7.1 [재생] · [불사]: 몸이 다시 자라 상처 · 부위 · 출혈이 남지 않음
const wholeBody = t => !!t.undying || t.regen > 0;
// v5.7 맨몸 막기: 방패도 막는 무기 (대검) 도 없이 막음 ([반사신경] 맨몸) — 무기를 막으면 팔이 받아 낼 수 있음
const bareGuard = (W, u) => u.canGuard && !u.shield && !((W.rules.weapons || {})[u.weaponNow || u.weapon] || {}).guard && !parryArc(W, u);   // v5.7.1 무기가 있으면 무기로 막음
const armedKind = (W, e) => e.bladeHands || ((W.rules.weapons || {})[e.weaponNow || e.weapon] || {}).kind !== '맨손';
// v5.7 지킬 사람: 남은 약 · 사수 · 지휘 · 주인공 · 일반인 ×
function wardMul(W, a){
  const R = W.rules.ward || {};
  return (a.skill && a.skill.left > 0 ? R.medic || 1.6 : 1) * (isFar(a) ? R.shooter || 1.25 : 1) * (1 + (R.cmd != null ? R.cmd : 0.05) * (a.cmd || 0)) * (a.hero ? R.hero || 1.1 : 1) * (a.human ? R.human || 1.15 : 1);
}
function pickWards(W){
  const R = W.rules.ward || {}; W.ward = W.ward || {};
  for (const side of [0, 1]){
    let best = null, bv = R.at || 1.6;
    for (const a of W.units) if (a.alive && a.side === side && !a.crawl){ const v = wardMul(W, a); if (v > bv){ bv = v; best = a; } }
    const nw = best ? best.i : null;
    if (nw !== W.ward[side] && nw != null && side === 0) L(W, { k: 'ward', a: nw, v: +bv.toFixed(2), vis: true });
    W.ward[side] = nw;
  }
}
// v5.7 방패벽: 나란히 (1.4칸) 같은 쪽을 보고 막는 방패끼리 — 막는 폭이 넓어짐
const shieldWall = (W, t) => t.shield && W.units.some(o => o !== t && o.alive && o.side === t.side && o.shield && o.raised && W.t >= o.raiseAt && dist(o, t) < 1.4 && angDiff(o.face, t.face) < 0.7);
// v5.7 막기는 선택: 자동 = 위협 (나 · 곁 동료를 노리는 상대, 겨눈 사수, 손 닿는 곳 + near 칸 안의 상대) 이 보이면 들고 없으면 내림 · 유지 = 늘 듦 · 공격 위주 = 안 듦.
// 치는 · 던지는 · 약 · 재장전 · 도약 동안은 못 막음 (방패 밀치기 · 방패 돌진은 방패로 함). 드는 데 raise 초 ([반사신경] 은 reflex 초)
function updateGuard(W, u){
  // v5.7.1 받아 내고 되받아침: 무구로 막는 쪽은 내 칼을 들어 올리는 중에 상대의 일격이 먼저 떨어질 것 같으면 (앞 · 막는 폭 안) 치기를 거두고 받아 냄 — 상대의 회복이 틈
  if (u.act && u.act.k === 'atk' && u.act.phase === 'wind' && u.parry && !u.shield && u.guardMode !== 'off' && parryArc(W, u)){
    const e = W.units.find(e => e.alive && e.side !== u.side && e.act && e.act.k === 'atk' && e.act.phase === 'wind' && e.act.b === u.i && !isFar(e) && !e.act.mode && e.act.end < u.act.end - 0.1 && angDiff(u.face, Math.atan2(e.y - u.y, e.x - u.x)) * 180 / Math.PI <= guardArc(W, u)
      && !(u.parryWait && u.parryWait.b === e.i && u.parryWait.t0 === e.act.t0));   // v6.0 같은 일격에 두 번 거두지 않음 (한 번 정했으면 그 결정대로)
    if (e){ u.act = null; u.raised = true; u.raiseAt = W.t; u.wantT = W.t; u.parryWait = { b: e.i, t: e.act.end + 0.05, t0: e.act.t0 }; L(W, { k: 'parryReady', a: u.i, b: e.i, vis: u.side === 0 || !!u.seenBy }); return; }   // v5.8.7 받아 낼 때까지 다시 치러 들지 않음 (매 틱 거뒀다 다시 들던 것 고침)
  }
  const G = W.rules.guard || {}, a = u.act, shieldAct = a && (a.k === 'bash' || (a.k === 'charge' && u.shield) || (a.k === 'atk' && u.shield && (!isFar(u) || u.pavise) && u.guardMode !== 'off'));   // v5.7.1 방패 뒤에서 치기   /* v8.7.7 [대방패] 는 쏘는 동안에도 방패를 듦 */
  let want = false;
  const ht = u.order && u.order.hurry && u.order.k === 'attack' && u.order.b != null ? W.units[u.order.b] : null;
  let hurry = u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack' || u.order.k === 'exit') && !(ht && ht.alive && gap(u, ht) <= u.rng + 0.4) && !(u.order.k !== 'move' && W.units.some(e => e.alive && e.side !== u.side && !isFar(e) && gap(u, e) <= Math.max(u.rng, e.rng) + 0.2));   // v5.7 서두르면 방패를 내리고 뜀 · v5.9.6 달리는 동안만 — 붙으면 (공격 · 공격 이동) 다시 듦
  if (!hurry && !u.order && u.mv && u.mv.run && W.t < u.mv.until && !['bguard', 'interpose', 'lead', 'screen', 'follow', 'cover'].includes(u.mv.k)) hurry = true;   // v7.1.1 질주 (AI 기동) 중엔 방패를 버리고 뜀 — 막는 게 목적인 기동은 빼고
  if (shieldAct) want = true;
  else if (!a && !hurry && u.alive && !u.crawl && !u.kb && W.t >= u.proneT && W.t >= (u.stunT || -9)){
    if (u.guardMode === 'hold' || (lretOn(W, u) && u.guardMode !== 'off')) want = true;   // v7.2 전열 후퇴: 방패 · 무구를 든 채 물러섬
    const ce = u.guardMode !== 'off' && !isFar(u) ? W.units.find(e => e.alive && e.side !== u.side && e.act && (e.act.k === 'charge' || (e.act.k === 'leap' && e.act.flip && e.act.slam)) && e.act.b === u.i && aware(W, u, e)) : null;   /* v8.7.3 공중제비 내려찍기도 태세로 받음 */
    if (ce){ want = true; u.fg = Math.atan2(ce.y - u.y, ce.x - u.x); setMood(W, u, '태세', ce.i); }   // v5.8.7 돌격 받을 태세   // v7.0 고침: if 짝이 어긋나 근접병의 자동 막기 (가까운 적 · 겨눈 위험) 가 건너뛰어지던 것
    else if (u.guardMode !== 'off' && (u.shield || u.armShield) && !AI6.includes('sadv') && shooterOn(W, u)){ const g = shooterOn(W, u); want = true; if (!u.path || !u.path.length) u.fg = Math.atan2(g.y - u.y, g.x - u.x); if (u.side === 1 || !u.order) setMood(W, u, '방패 전진', g.i); }   // v7.0 방패 전진
    else if (u.guardMode !== 'off'){ const bare = bareGuard(W, u), dg = dangerOf(W, u);   // v5.7 맨몸이면 자동은 무기를 막지 않음 (맨손 · 주먹만)
      want = want || (!!dg && !(bare && armedKind(W, dg))) || W.units.some(e => e.alive && e.side !== u.side && !isFar(e) && !(bare && armedKind(W, e)) && gap(u, e) < e.rng + (G.near != null ? G.near : 1.2) && (u.side === 0 ? (e.seenBy || canSee(W, u, e)) : canSee(W, u, e))); }
  }
  if (want) u.wantT = W.t;
  const forced = (a && !shieldAct) || hurry || u.guardMode === 'off' || u.crawl || u.kb;   // 치는 · 서두르는 동안은 바로 내림
  if (want && !u.raised){ u.raised = true; u.raiseAt = shieldAct ? W.t : W.t + (u.reflex ? (G.reflex != null ? G.reflex : 0.08) : u.parry && !u.shield ? ((W.rules.parry || {}).raise != null ? W.rules.parry.raise : 0.12) : (G.raise != null ? G.raise : 0.25) * (u.vet ? VETR(W).raise : 1)); }
  else if (!want && u.raised && (forced || W.t - (u.wantT || -9) > (G.keep != null ? G.keep : 0.6))){ u.raised = false; u.raiseAt = 1e9; }   // 위협이 잠깐 안 보여도 keep 초는 들고 있음 (깜빡임 없음)
}   // v5.2 넘어지면 못 막음
const isFar = u => u.rng > 1 && !u.longReach;
const flailOf = (W, u) => !u.weaponGone && !u.weaponNow ? (((W.rules.weapons || {})[u.weapon] || {}).flail || null) : null;   /* v7.24.1 철퇴 (던졌다 당겨 옴) */
// v7.0 나를 겨누는 (준비 중) · 방금 (1.5초) 나를 쏜 상대 사수 — 보이거나 쏜 걸 앎
const shooterOn = (W, u) => W.units.find(g => g.alive && g.side !== u.side && (isFar(g) || (g.jav && g.spearHeld)) && dist(u, g) <= g.rng + g.r + u.r + 1 && ((g.act && g.act.k === 'atk' && g.act.b === u.i && (canSee(W, u, g) || u.side === 0)) || (u.farBy === g.i && W.t - (u.farHitT == null ? -9 : u.farHitT) < 1.5) || arcAt(W, g, u) || (u.path && u.path.length && !(u.order && u.order.hurry) && (canSee(W, u, g) || (u.side === 0 && g.seenBy)) && losClear(W.map, g.x, g.y, u.x, u.y)))) || null;   // v7.1.1 곡사가 날아옴 · 움직이는 동안 사거리 안 사수 (방어 후퇴)   // v5.4 장창 (근접인데 사거리 1 넘음) 은 원거리가 아님
// 막는 방향 안인가: 방어 자세가 서 있고, a 가 바라보는 방향 ±gArc 안
const inGuard = (W, t, a, body) => guardOn(W, t) && !(body && t.parry && !t.shield && !t.reflex) && angDiff(t.face, Math.atan2(a.y - t.y, a.x - t.x)) * 180 / Math.PI <= guardArc(W, t) + (shieldWall(W, t) ? ((W.rules.guard || {}).wall != null ? W.rules.guard.wall : 25) : 0);   // v5.7 방패벽
// 사선 위의 몸들 (쏜 자리 a → 대상 t, 가까운 순). t 는 빼고 돌려줌. know 가 있으면 그 몸만 (AI 는 자기가 아는 몸만 셈)
// v7.14.1 엎드린 몸 위로 지나감: 노린 몸이 아니면 서서 쏜 탄 · 화살 · 창은 거의 넘어감 (over). 쏘는 쪽도 엎드렸으면 낮게 날아 overLow
const lieLow = b => !!(b && b.lie && !b.lieSw);
const lieOverP = (W, sh) => { const LL = W.rules.lie || {}; return lieLow(sh) ? (LL.overLow != null ? LL.overLow : 0.5) : (LL.over != null ? LL.over : 0.08); };
function lieOver(W, s, b){ const P = s.over || (s.over = {}); if (P[b.i] == null) P[b.i] = W.rand() >= lieOverP(W, W.units[s.a]) ? 1 : 0; return P[b.i] === 1; }   // 한 탄에 한 몸마다 한 번만 굴림
function lineBodies(W, a, t, self, know){
  const vx = t.x - a.x, vy = t.y - a.y, L2 = vx * vx + vy * vy; if (!L2) return [];
  const len = Math.sqrt(L2), out = [];
  for (const b of W.units){
    if (!b.alive || b === self || b === t) continue;
    if (know && !know(b)) continue;
    if (lieLow(b) && lieOverP(W, self) < 0.5) continue;   // v7.14.1 엎드린 몸은 사선을 막지 않음 (위로 넘어감)
    const k = ((b.x - a.x) * vx + (b.y - a.y) * vy) / L2; if (k <= 0 || k * len >= len - t.r * 0.5) continue;
    const px = a.x + vx * k, py = a.y + vy * k;
    if (Math.hypot(b.x - px, b.y - py) <= b.r + 0.06) out.push([k, b]);
  }
  out.sort((p, q) => p[0] - q[0]);
  return out.map(x => x[1]);
}
const firstOnLine = (W, a, t, self, know) => lineBodies(W, a, t, self, know)[0] || t;
// 오사 위험: 사선 근처 (몸 + pad) 에 아군이 있나. 겁 많을수록 넓게 봄 (움직이는 아군이 준비 중에 끼어들 수 있으니).
// 대상 가까이일수록 (그 상대와 맞붙은 아군이 돌며 끼어들 수 있으니) 0.5칸 더 넓게
function ffRisk(W, u, t, pad){
  const vx = t.x - u.x, vy = t.y - u.y, L2 = vx * vx + vy * vy; if (!L2) return null;
  let best = null, bk = 9;
  const lead = u.wind || 0.5;
  for (const b of W.units){
    if (!b.alive || b === u || b === t || b.side !== u.side) continue;
    if (lieLow(b) && lieOverP(W, u) < 0.5) continue;   // v7.14.1 엎드린 동료 위로 쏨
    // 지금 자리와, 준비하는 동안 움직여 갈 자리 둘 다 봄
    for (const [bx, by] of [[b.x, b.y], [b.x + (b.vx || 0) * lead, b.y + (b.vy || 0) * lead]]){
      const k = ((bx - u.x) * vx + (by - u.y) * vy) / L2; if (k <= 0 || k >= 1.05) continue;
      const near = Math.max(0, (k - 0.6) / 0.4) * 0.5 * Math.min(1, pad / 0.3);
      if (Math.hypot(bx - (u.x + vx * k), by - (u.y + vy * k)) <= b.r + pad + near && k < bk){ bk = k; best = b; }
    }
  }
  // 대상에게 달려드는 (노리는) 아군이 쏘는 쪽에서 들어가는 중이면 곧 사선에 들어옴 → 다른 사선을 찾음
  if (!best){
    const at = Math.atan2(u.y - t.y, u.x - t.x);
    for (const b of W.units){
      if (!b.alive || b === u || b === t || b.side !== u.side || dist(b, t) > 3 || focusOf(W, b) !== t) continue;
      if (angDiff(Math.atan2(b.y - t.y, b.x - t.x), at) < 0.5 + pad){ best = b; break; }
    }
  }
  return best;
}
// 날아오는 공격을 앞에서 막는 몸 (화면 · 시험용)
function shieldBlock(W, a, t){ const f = firstOnLine(W, a, t, a); return f !== t && inGuard(W, f, a, true) ? f : null; }
// 어둠 속이라 거의 못 봄: 야시도, 거리 안 후각도 없는데 상대가 빛 없는 칸에 있음
const glareAt = (W, u) => !!W.rules.glare && !AI6.includes('glare') && u.nvG !== 'S' && W.light[(u.y | 0) * W.map.W + (u.x | 0)] > W.rules.glare.l;   // v7.8 밝은 빛 속에 선 눈
const glareReach = (W, u) => { const G = W.rules.glare || {}; return !u.nv ? G.none || 2.5 : u.nvG === 'B' ? (W.rules.nvB || 5) * (G.k || 0.6) : u.nvG === 'C' ? (W.rules.nvC || 3.75) * (G.k || 0.6) : u.nvG === 'D' ? (W.rules.nvD || 2.5) * (G.k || 0.6) : G.A || 5; };   // v7.8 빛 속에 선 눈이 어두운 곳을 보는 거리
const nvReach = (W, u) => { if (!u.nv) return 0; const G = W.rules.glare || {}, gl = glareAt(W, u); return u.nvG === 'B' ? (W.rules.nvB || 5) * (gl ? G.k || 0.6 : 1) : u.nvG === 'C' ? (W.rules.nvC || 3.75) * (gl ? G.k || 0.6 : 1) : u.nvG === 'D' ? (W.rules.nvD || 2.5) * (gl ? G.k || 0.6 : 1) : gl ? G.A || 5 : Infinity; };   // v7.7 야시로 또렷이 보는 거리   // v7.8 빛 속에 서면 줄어듦
const clearSee = (W, a, e) => canSee(W, a, e) && (litAt(W, e.x, e.y) || dist(a, e) <= nvReach(W, a) || (a.smell && dist(a, e) <= a.smell) || gap(a, e) < 0.4);   // v7.7 실루엣이 아니라 또렷이 (빛 · 야시 거리 · 후각 · 몸이 닿음)   // v7.7 실루엣이 아니라 또렷이 (빛 · 야시 거리 · 후각 · 몸이 닿음)
const blindTo = (W, u, t) => !u.nv && !(u.smell && dist(u, t) <= u.smell) && !glowAt(W, t.x, t.y);   // v7.7 어스름이면 실루엣은 보임   // v7.7 어스름이면 실루엣은 보임
// 원거리 명중률: 가까우면 aimNear, 사거리 끝이면 aimFar (무기마다 aim). 움직이는 상대 ×0.85, 쏘는 쪽이 움찔한 상태 ×0.8
function aimP(W, u, t, arc){
  const R = W.rules, far = u.aim != null ? u.aim : R.aimFar, f = Math.min(1, Math.max(0, gap(u, t)) / Math.max(1, u.rng));
  let p = R.aimNear + (far - R.aimNear) * f;
  const mk = u.alien ? 0 : u.marks || 0; p += (1 - p) * mk;   // v5.5.2 사격 솜씨: 남은 빗나감을 mk 만큼 줄임
  if (u.alien) p *= ((W.rules.alien || {}).aim || 0.6); else if (u.fam2) p *= ((W.rules.alien || {}).skillAim || 0.92);   // v7.0 낯선 무기 · v7.1 다른 종류
  if (Math.hypot(t.vx, t.vy) > 0.6) p *= 1 - 0.15 * (1 - mk);   // 움직이는 상대 (솜씨가 좋을수록 덜 흔들림)
  { const d = dist(u, t) || 1, lat = Math.abs((t.vx || 0) * (t.y - u.y) - (t.vy || 0) * (t.x - u.x)) / d; if (lat > 1.2) p *= 1 - 0.15 * (1 - mk * 0.5); }   // v6.4 사선을 가로질러 뛰는 상대 (지그재그) 는 더 어려움
  if (W.t < u.pinT) p *= 1 - 0.2 * (1 - mk * 0.5);   // 움찔
  { const LL = W.rules.lie; if (LL){ if (u.lie && !u.lieSw && gunOf(W, u)) p += (1 - p) * (LL.aim || 0); if (t.lie && !t.lieSw && dist(u, t) > (LL.near || 1.8)) p *= arc ? LL.hitArc || 0.85 : LL.hitFar || 0.55; } }   // v7.11 엎드려 쏘는 총은 덜 흔들림 · 엎드린 몸은 멀리서 덜 맞음 (곡사는 덜 줄음)
  if (blindTo(W, u, t)) p *= R.darkAimFar != null ? R.darkAimFar : 0.1;
  else if (!litAt(W, t.x, t.y) && R.darkHit) p *= u.nv && dist(u, t) <= nvReach(W, u) ? (R.darkHit[u.nvG || 'A'] || 0.9) : glowAt(W, t.x, t.y) ? (R.darkHit.dim || 0.75) : (R.darkHit.smell || 0.8);   // v7.10 식별하면 등급 값 · 형체만 보고 쏘면 form   // v7.7 실루엣만 보고 쏨   // v7.5 어둠 속 상대는 보여도 살짝 덜 맞음
  p *= u.aimMaim || 1;   // v5.5 눈 · 팔을 잃음
  if (terrOn(W)) p *= terrAim(W, u, t, arc);   // v7.18 엄폐 · 고저
  if (u.fb || t.fb || u.cb) p = fbAim(W, u, t, p);   /* v8.7.5 진형 · 조합 버프 */
  return Math.max(0.02, Math.min(0.99, p));
}
// u 가 아는 몸: 같은 편이거나 지금 보이는 상대
const knows = (W, u) => b => b.side === u.side || canSee(W, u, b);
// 지금 무엇을 노리고 있나 (보이는 모습으로 판단)
const focusOf = (W, t) => t.act && t.act.k === 'atk' ? W.units[t.act.b] : t.order && t.order.k === 'attack' ? W.units[t.order.b] : t.target && t.target.alive && t.target.side !== t.side ? t.target : null;

// 상대 t 둘레 2.5칸 안의 t 편 (t 를 도울 수 있는 몸)
const supportOf = (W, t) => W.units.filter(o => o.alive && o !== t && o.side === t.side && dist(o, t) <= 2.5).length;
/* ---------- v4.1 감각: 냄새 · 브리핑 · 짖는 소리 · 알아차림 ---------- */
const NO_AMBUSH = ['맨손', '이빨·발톱'];   // 물기 · 주먹은 암살 치명상이 없음
const fresh = (W, s, k) => s && W.t - s.t <= (k || W.rules.senseT);
// 후각: 가까이 (smell) 는 정확히, 그 밖 smellFar (S = 맵 전체) 까지는 대략 (멀수록 크게 틀림). 1초마다 새로 맡음
function smellTick(W, u){
  if (!u.smellG) return;
  const R = W.rules, far = u.smellG === 'S' ? 1e9 : u.smellFar || R.smellFar;
  for (const f of W.units){
    if (!f.alive || f.side === u.side) continue;
    const d = dist(u, f); if (d > far) continue;
    const s = u.sense[f.i]; if (s && s.smell && W.t - s.t < 1) continue;
    const ex = d <= u.smell, e = ex ? 0 : Math.min(2, 0.6 + d * 0.15);
    u.sense[f.i] = { x: f.x + (W.rand() * 2 - 1) * e, y: f.y + (W.rand() * 2 - 1) * e, t: W.t, exact: ex, smell: true };
  }
}
const REL = ['앞', '오른쪽 앞', '오른쪽', '오른쪽 뒤', '뒤', '왼쪽 뒤', '왼쪽', '왼쪽 앞'];
const BAND = ['가까이', '조금 떨어져', '멀리'];
// 브리핑 (아군 후각): 보이지 않는 적을 바라보는 방향 기준 8방향 · 거리 세 단계로 묶어 동료 모두에게 알림
function brief(W, u){
  u.briefAt = W.t;
  const far = u.smellG === 'S' ? 1e9 : u.smellFar || W.rules.smellFar;
  if (u.side === 0 && u.posUnk){ for (const f of W.units) if (f.alive && f.side !== u.side && dist(u, f) <= far && u.sc) u.sc.seen[f.i] = u.sc.seen[f.i] || { x: f.x, y: f.y, t: W.t, look: ['냄새'], smell: true }; return; }   // v7.5 지휘관과 닿지 않으면 알릴 수 없음 (정찰이면 돌아와 보고)
  const hid = W.units.filter(f => f.alive && f.side !== u.side && !f.seenBy && dist(u, f) <= far);
  if (!hid.length){ u.briefPrev = {}; return; }
  const G = new Map(), prev = u.briefPrev; u.briefPrev = {};
  for (const f of hid){
    const ang = Math.atan2(f.y - u.y, f.x - u.x); let rel = (ang - u.face) % (2 * Math.PI); if (rel > Math.PI) rel -= 2 * Math.PI; if (rel < -Math.PI) rel += 2 * Math.PI;
    const sec = ((Math.round(rel / (Math.PI / 4)) % 8) + 8) % 8, d = dist(u, f), band = d <= 3 ? 0 : d <= 6 ? 1 : 2, key = sec + ':' + band;
    u.briefPrev[f.i] = d;
    const g = G.get(key) || { sec, band, n: 0, closer: false, foes: [], ang: u.face + sec * Math.PI / 4, d: [2, 4.5, 7.5][band] };
    g.n++; g.foes.push(f.i); if (prev[f.i] != null && d < prev[f.i] - 0.7) g.closer = true;
    G.set(key, g);
  }
  const groups = [...G.values()].sort((a, b) => a.band - b.band);
  W.brief = { a: u.i, t: W.t, x: u.x, y: u.y, groups };
  L(W, { k: 'brief', a: u.i, groups: groups.map(g => ({ rel: REL[g.sec], band: g.band, n: g.n, closer: g.closer, foes: g.foes, at: g.foes.map(i => [+W.units[i].x.toFixed(2), +W.units[i].y.toFixed(2)]), ang: +g.ang.toFixed(2) })) });
  for (const a of W.units) if (a.alive && a.side === u.side) for (const g of groups) for (const fi of g.foes)
    if (!(a.sense[fi] && a.sense[fi].exact && W.t - a.sense[fi].t < 1)) a.sense[fi] = { x: u.x + Math.cos(g.ang) * g.d, y: u.y + Math.sin(g.ang) * g.d, t: W.t, exact: false, brief: true };
}
// 짖기: 상대 편이 짖은 개의 방향을 앎 (소리). 짖는 쪽도 자리를 드러내는 대가
function bark(W, u){
  u.barkAt = W.t;
  W.noises.push({ x: +u.x.toFixed(2), y: +u.y.toFixed(2), t0: W.t, side: u.side, a: u.i, kind: 'bark' });
  for (const o of W.units) if (o.alive && o.side !== u.side && dist(o, u) <= W.rules.hear) o.sense[u.i] = { x: u.x + (W.rand() - 0.5), y: u.y + (W.rand() - 0.5), t: W.t, exact: false, bark: true };
  L(W, { k: 'bark', a: u.i, x: +u.x.toFixed(2), y: +u.y.toFixed(2), vis: !!u.seenBy });
}
// 알아차림: 보이거나, 감지 (냄새 · 브리핑 · 짖는 소리 · 비명) 했고 대응할 수 있음 (공격 동작에 묶이지 않음 · 앞의 다른 상대와 맞붙지 않음)
function aware(W, t, a){
  if (canSee(W, t, a) && (t.heads > 1 || sideV(W, t, a) !== 'back')) return true;   // v5.3 [머리 넷] 은 등 뒤도 봄   // 앞 · 옆으로 보고 있음 (등 뒤는 보여도 못 알아챔)
  if (!fresh(W, t.sense[a.i]) || t.act) return false;
  return !W.units.some(f => f.alive && f !== a && f.side !== t.side && !isFar(f) && canSee(W, t, f) && gap(t, f) <= Math.max(t.rng, f.rng) + 0.3);
}
function setMood(W, u, m, b){
  if (u.mood === m && (u.moodB == null ? null : u.moodB) === (b == null ? null : b)) return;
  u.mood = m; u.moodB = b == null ? null : b; u.moodT = W.t;
  if (m && !u.gone && W.t - u.moodLogT >= 1.2){ u.moodLogT = W.t; L(W, { k: 'mood', a: u.i, m, b: u.moodB, vis: u.side === 0 || !!u.seenBy }); }   /* v8.7.3 나간 이는 기록 없음 */
}

/* ---------- 공격: 준비 → 맞음 → 회복 ---------- */
// v6.6 지침 · 탈진: 힘쓰는 동작 · 맞음으로 쌓이고, 맞붙지 않고 걷거나 쉬면 풀림. 지침 😓 · 탈진 🥵 (질주 숨과 별개 — 지쳐도 아드레날린으로 몇 번은 뛰지만 탈진이면 숨 고르기)
const FATR = W => W.rules.fatigue;
function fatState(W, u){ const F = FATR(W); if (!F) return;
  if (!u.exhausted && u.fat >= F.exhaust){ u.exhausted = true; u.tired = true; L(W, { k: 'exhaust', a: u.i, vis: u.side === 0 || !!u.seenBy }); }
  else if (u.exhausted && u.fat <= F.out){ u.exhausted = false; L(W, { k: 'unexhaust', a: u.i, vis: u.side === 0 || !!u.seenBy }); }
  if (!u.tired && u.fat >= F.tired){ u.tired = true; L(W, { k: 'tired', a: u.i, fat: Math.round(u.fat), vis: u.side === 0 || !!u.seenBy }); }
  else if (u.tired && !u.exhausted && u.fat < F.tired - 10) u.tired = false; }
function tire(W, u, k, mul){ const F = FATR(W); if (!F || AI6.includes('fat') || !u.alive || u.undead) return;   // v7.8.1 [망자] 는 지치지 않음
  u.fat = Math.min(100, (u.fat || 0) + (F[k] || 0) * (u.vet ? F.vet : 1) * (mul || 1)); fatState(W, u); }
const fatMul = (W, u, k) => { const fz = k === 'wind' && W.t < (u.frostT || -9) ? ((W.rules.frost || {}).wind || 1.6) : 1, F = FATR(W); if (!F || AI6.includes('fat')) return fz; return fz * u.exhausted ? (F.ex[k] != null ? F.ex[k] : 1) : u.tired ? (F.ti[k] != null ? F.ti[k] : 1) : 1; };
function startAct(W, u, t, why){
  if (u.jrB) return;
  if (u.stoneT != null && W.t < u.stoneT) return;   /* v8.7.4 방어모드 동안은 치지 않음 */
  if (u.h2){ const K = h2Kit(u); if (K && !u.act && t && t.side !== u.side && W.t >= u.h2.mlT && dist(u, t) <= K.ml.range * 0.8) h2Cast(W, u, h2Ml(K), t); return; }   /* v8.7.4 기술표의 몸은 기본 일격도 기술표대로 */   /* v8.6.0 대본으로 싸우는 몸 (적뢰): 대리석 주먹은 대본이 침 */
  if (u.tremor && W.t >= (u.tremCd || -9)){ const B = W.rules.brand || {}; u.tremCd = W.t + (B.tremGap || 1.5); if (W.rand() < (B.tremor != null ? B.tremor : 0.15)){ L(W, { k: 'tremor', a: u.i, vis: u.side === 0 || !!u.seenBy }); stun(W, u, B.tremStun || 0.55, null); return; } }   /* v8.3.0 [낙인:적뢰] 수전증 */
  const heal = u.cls === '치유' && t.side === u.side;
  if (!heal && isFar(u) && t.side !== u.side && running(W, u)) return;   /* v7.17 질주 중엔 누구도 쏘지 않음 */
  if (u.lie && (heal || t.side === u.side || !gunOf(W, u)) && lieGate(W, u, heal ? '돌보려 일어남' : isFar(u) ? '쏘려 일어남 (엎드려서는 총만)' : '치려 일어남')) return;   // v7.11
  if (!heal && t.side !== u.side && u.assnE > 0 && ASN(W) && !AI6.includes('assn')){ const AS = assnCan(W, u, t); if (AS.ok){ startAssn(W, u, t, AS); return; } }   // v7.6 숨은 채 등 뒤 · 아무도 못 봄 · 알아채지 못함 → 암살
  // v6.0 받아 내기로 바꿨으면 그 일격이 떨어질 때까지 (누구를 치든) 다시 치러 들지 않음 — 다른 상대를 치려다 다시 거두는 반복 (곤봉적: 카리우스를 치려다 인주를 받아 내려 거두기를 되풀이) 고침
  const pw = u.parryWait, pe = pw && W.units[pw.b];
  if (!heal && pw && W.t < pw.t && pe && pe.alive && pe.act && pe.act.k === 'atk' && pe.act.b === u.i && pe.act.t0 === pw.t0){ setMood(W, u, '받아 낼 준비', pe.i); return; }   // v5.8.7 무구로 받아 내려고 기다리는 중
  // v5.8.7 나를 노린 돌격이 오는 중이면 (손이 비었고 막을 수 있으면) 치러 들지 않고 태세 — 받아 내야 받아침이 됨
  if (!heal && t.side !== u.side && t.act && (t.act.k === 'charge' || (t.act.k === 'leap' && t.act.flip && t.act.slam)) && t.act.b === u.i && u.canGuard && !isFar(u) && u.guardMode !== 'off' && aware(W, u, t)){   /* v8.7.3 공중제비 내려찍기도 */ stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '태세', t.i); return; }
  // v5.7 막기 유지 중엔 치지 않음 (방패 밀치기만 — 손 닿으면)
  if (!heal && u.guardMode === 'hold' && u.canGuard && !isFar(u) && t.side !== u.side){ if (u.canBash && W.t >= u.bashCd && W.t >= u.brokenT && gap(u, t) <= u.rng + 0.3){ startBash(W, u, t, '막기 유지'); return; } if (!openingOf(W, u, t) || (t.act && t.act.b === u.i && t.act.phase === 'wind' && !isFar(t) && !u.shield)){ setMood(W, u, '막기 유지', t.i); return; } }   // v5.7.1 막기 유지는 틈이 보일 때만 침 · 무구로 막는 쪽은 상대가 휘두르는 중이면 먼저 받아 내고 (회복 틈에) 되받아침
  // v7.9.3 어떤 길로 왔든 (접근 · 도약 · 밀어붙임) 경량이 막고 선 방패 정면을 스스로 치지 않음 — 틈 (상대의 동작 · 옆 · 뒤 · 자세 무너짐) 을 기다림. 명령 · 궁지는 예외
  if (!heal && t.side !== u.side && !u.order && !isFar(u) && !t.act && t.canGuard && !cornered(W, u) && inGuard(W, t, u) && !pushOK(W, u, t)){ u.waitT += 0.2; setMood(W, u, '방패 앞에서 틈을 기다림', t.i); u.lastDec = { t: W.t, s: `${t.name}의 방패 정면 — 들이받지 않고 틈을 기다림` }; if (W.t - (u.pushLogT || -9) > 6){ u.pushLogT = W.t; L(W, { k: 'pushNo', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); } return; }
  // v5.2 거구의 근접: 넓게 휘두르기 · 찍기 · 짓밟기 중 고름 (준비가 더 김 — 크게 휘두르는 만큼 피할 틈이 보임)
  const FL = !heal && t.side !== u.side && !isFar(u) ? flailOf(W, u) : null;   /* v7.24.1 철퇴: 공이 돌아와야 다음 공격 · 붙어 있으면 휘두름 (가끔은 1.3M 안에서도) */
  if (FL && (W.flails || []).some(F => F.by === u.i)){ setMood(W, u, '철퇴를 거둠', t.i); return; }
  const alley = !!FL && tightAt(W, u), fl = !!FL && (alley || (gap(u, t) > (FL.close || 0.9) && !(gap(u, t) <= (FL.sw || 1.3) && W.rand() < (FL.swingP || 0.25))));   /* v8.7.5 좁은 골목 (A6): 철퇴를 돌리지 못하고 앞뒤로 던지기만 */
  if (fl && !ordFire(u, t) && !cornered(W, u) && flLane(W, u, t)){ setMood(W, u, '동료가 철퇴 길에 있음', t.i); u.waitT += 0.2; return; }   /* v8.7.3 연타 (바로) 명령만 감수 — 사격과 같은 규칙 */   /* v7.29.0 오사가 되니 길이 트일 때까지 (명령 · 궁지는 감수) */
  const mode = !heal && u.canSweep && !isFar(u) ? swingPlan(W, u, t) : null, wind = (!heal && isFar(u) ? aimT(W, u) : u.wind) * (mode ? (W.rules.heavy || {}).wind || 1.3 : 1) * (heal ? 1 : fatMul(W, u, 'wind') * (u.injWind || 1)) * (heal || isFar(u) || mode ? 1 : wpnSpd(W, u));   // v6.9 부상 (어지러움 · 갈비뼈 · 쇼크)   // v6.7 단검은 빠름
  if (!heal) tire(W, u, isFar(u) ? (u.loud ? 'gunShot' : 'shot') : mode ? 'heavy' : 'swing');   // v6.6 지침
  if (mode) why = heavyName(u, mode) + (why && why !== '공격' ? ' · ' + why : '');
  const sm = !heal && t.side !== u.side && isFar(u) ? shotMode(W, u, t) : null, tied = !heal && isFar(u) && !AI6.includes('eng') && W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && !f.crawl && gap(u, f) < f.rng + 0.2), smW = (sm ? ((W.rules.sshot || {})[sm] || {}).wind || 1 : 1) * (tied ? (W.rules.alien || {}).tied || 1.5 : 1);   // v7.0 사격S: 조준사격 · 속사 · 낯선 무기 · 근접에 붙들린 사수
  u.act = { k: heal ? 'heal' : 'atk', b: t.i, phase: 'wind', t0: W.t, end: W.t + wind * smW, why: heal ? '' : why || '', mode, sm, ...(fl ? { fl: true } : {}), ...(alley ? { alley: true } : {}) };
  u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u); u.waitT = 0;
  if (!heal && sm !== 'aimed' && !AI6.includes('strafe') && isFar(u) && !u.lie && ((sGrade(u) && u.side === 1 && !u.order) || ((!u.order || (u.order.k === 'attack' && !u.order.now)) && strafeWant(W, u)))) setStrafe(W, u, t, wind * smW + u.rec);   // v7.0 이동 사격: 당기는 동안 옆으로   // v7.17 누구나 (위협이 있을 때 · 명중은 등급별)
  if (!heal) setMood(W, u, why || '공격', t.i);
  const ffr = !heal && isFar(u) && ordFire(u, t) ? ffOdds(W, u, t, u.x, u.y).p : 0;   // v5.5.1 명령 사격의 오사 확률 (기록)
  L(W, { k: 'wind', a: u.i, b: t.i, heal, mode, sm, tied: tied || null, alien: !!(u.alien && isFar(u)) || null, mv: !!(u.strafe && W.t < u.strafe.until), w: u.weaponNow || u.weapon || '', end: +(W.t + wind * smW).toFixed(2), hid: u.side === 1 && !u.seenBy, why: heal ? '' : why || '', ffRisk: ffr > 0.03 ? +ffr.toFixed(2) : null });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind * smW, heal, mode, ...(fl ? { fl: true } : {}), ...(alley ? { alley: true } : {}) });
  if (mode === 'sweep' && swingArc(W, u, Math.atan2(t.y - u.y, t.x - u.x)).M.length){ L(W, { k: 'shout', a: u.i, s: '비켜!', mute: u.mute }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: u.mute ? SHOUT_EMO['비켜!'] : '비켜!', t0: W.t }); }
}
// v4.2 기술 (치유): 준비 (붓는 중, 못 움직임) → 회복량만큼 총량에서 덜어 냄 → 잠깐 회복
function startSkill(W, u, t, auto){
  if (u.lie && lieGate(W, u, '돌보려 일어남')) return;   // v7.11
  u.act = { k: 'skill', b: t.i, phase: 'wind', t0: W.t, end: W.t + u.skill.wind, why: auto ? '위급' : '', auto: !!auto };
  if (t !== u) u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u);
  setMood(W, u, auto ? '응급' : '치유', t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, heal: true, skill: u.skill.name, auto: !!auto, end: +(W.t + u.skill.wind).toFixed(2) });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: u.skill.wind, heal: true });
}
function resolveSkill(W, u){
  const A = u.act, t = W.units[A.b], K = u.skill, R = W.rules;
  if (A.phase !== 'wind'){ u.act = null; return; }
  let why = '';
  if (!t.alive && !(K.kit && t.down)) why = '대상이 이미 쓰러짐';
  else if (t !== u && gap(u, t) > K.rng + R.reach) why = `손이 안 닿음 (${gap(u, t).toFixed(1)}칸 떨어짐)`;
  else if (K.left <= 0) why = '약이 다 떨어짐';
  if (why) L(W, { k: 'miss', a: u.i, b: t.i, why, skill: K.name });
  else if (K.kit){   // 구급상자: 쓰러진 [불사] 동료는 바로 일으킴, 아니면 최대 체력의 pct 만큼
    const revive = t.down;
    const medK = gradeMul(W.rules, u.traits, '의학'), hp0 = t.hp, per = Math.max(K.min || 0, Math.min(t.max * K.pct, K.cap != null ? K.cap : Infinity)) * medK;   /* v7.17 [의학X] */   // v7.3 처음 = 최대 체력의 pct (min ~ cap — 기본 20% · 10 ~ 30)
    if (revive) rise(W, t, per / t.max); else t.hp += Math.max(0, Math.min(Math.round(per), Math.round(t.max - t.hp)));
    const amt = revive ? Math.round(t.hp) : Math.round(t.hp - hp0); if (!K.inf) K.left--; K.cdT = W.t + K.cd; u.healed += amt; if (t === u) u.healedSelf = (u.healedSelf || 0) + amt;   /* v7.19 inf = 마력 (딸기) */
    const stanch = !!t.bleed; t.bleed = null;   // v5.5 지혈
    const stab = revive ? [] : stabilize(W, u, t);   // v6.9 내출혈 반 · 쇼크 안정 · 깨움 · 부목
    L(W, { k: 'skill', a: u.i, b: t.i, amt, hp: Math.round(t.hp), left: K.left, name: K.name, auto: A.auto, kit: true, revive, stanch, stab });
    if (u.order && u.order.k === 'skill' && u.order.b === t.i){ u.order = null; u.stay = u.stay || { x: u.x, y: u.y }; }
    if (W.fxOn){ W.fx.push({ k: 'shot', a: u.i, b: t.i, t0: W.t, dur: 0.25, heal: true }); W.fx.push({ k: 'num', x: t.x, y: t.y, s: (revive ? '일으킴 ' : '+') + amt, c: 'h', t0: W.t }); }
    if (K.hot > 0 && K.hotN > 0 && t.alive && t.hp < t.max - 0.5){ A.phase = 'tend'; A.tick = W.t + K.hotGap; A.n = 0; A.sum = 0; A.end = W.t + K.hotN * K.hotGap + 0.02; A.t1 = W.t; return; }   // v7.3 이어서 돌봄
  }
  else {
    const medB = gradeMul(W.rules, u.traits, '의학'), base0 = Math.min(K.per, K.inf ? K.per : K.left), amt = Math.max(0, Math.min(Math.round(base0 * medB), Math.round(t.max - t.hp)));   /* v7.19 [의학X] 는 양동이 약에도 · inf = 끝없음 */
    t.hp += amt; if (!K.inf) K.left = Math.max(0, K.left - Math.ceil(amt / medB)); u.healed += amt; if (t === u) u.healedSelf = (u.healedSelf || 0) + amt;
    const stanch = !!t.bleed; t.bleed = null;   // v5.5 지혈
    const stab = stabilize(W, u, t);   // v6.9
    L(W, { k: 'skill', a: u.i, b: t.i, amt, hp: Math.round(t.hp), left: K.left, name: K.name, auto: A.auto, stanch, stab });
    if (u.order && u.order.k === 'skill' && u.order.b === t.i){ u.order = null; u.stay = u.stay || { x: u.x, y: u.y }; }
    if (W.fxOn){ W.fx.push({ k: 'shot', a: u.i, b: t.i, t0: W.t, dur: 0.25, heal: true }); W.fx.push({ k: 'num', x: t.x, y: t.y, s: '+' + amt, c: 'h', t0: W.t }); }
  }
  A.phase = 'rec'; A.end = W.t + K.rec; A.t1 = W.t;
}
// v7.3 돌봄: 처음 회복 뒤 곁에 머물며 hotGap 초마다 hot 씩 (hotN 번). 대상이 쓰러지거나 손이 안 닿게 멀어지면 끊김 (맞아도 — interrupt)
function tendStep(W, u){
  const A = u.act, K = u.skill, t = W.units[A.b];
  if (!K || !t || !t.alive || t.down || (t !== u && gap(u, t) > K.rng + W.rules.reach + 0.3)){ tendEnd(W, u, A, !t || !t.alive || t.down ? '대상이 쓰러짐' : '멀어짐'); u.act = null; return; }
  if (t !== u) u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  if (t.hp >= t.max - 0.5){ tendEnd(W, u, A, A.n ? '' : null); u.act = null; return; }   // 다 나음 → 바로 끝
  while (W.t >= A.tick - 1e-9 && A.n < K.hotN){ const add = Math.max(0, Math.min(Math.round(K.hot * gradeMul(W.rules, u.traits, '의학')), Math.round(t.max - t.hp))); t.hp += add; A.sum += add; u.healed += add; if (t === u) u.healedSelf = (u.healedSelf || 0) + add; A.n++; A.tick += K.hotGap; if (W.fxOn && add > 0) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.2, s: '+' + add, c: 'h', t0: W.t }); }
  if (A.n >= K.hotN){ tendEnd(W, u, A, ''); u.act = null; }
}
function tendEnd(W, u, A, why){ if (why === null || (!A.n && !why)) return; L(W, { k: 'tend', a: u.i, b: A.b, n: A.n, amt: A.sum, why, vis: u.side === 0 || !!u.seenBy }); }
// 아주 위급 (체력 bucketAuto 아래) 한 동료가 가까이 있으면 명령 없이도 달려가 씀
function emergency(W, u, dt){
  const K = u.skill; if (!K || u.noArms || K.left <= 0 || (K.kit && W.t < K.cdT)) return false;
  const R = W.rules, far = u.side === 0 && u.order ? R.skillReach : R.leash, thr = K.auto != null ? K.auto : R.bucketAuto;
  const pol = u.side === 0 ? (u.healPol || (R.heal || {}).pol || 'dying') : 'free', need = pol === 'free' ? 1 : pol === 'order' ? 9 : 2;   // v7.9 명령이 없으면 죽기 직전만
  // 구급상자: 쓰러진 [불사] 동료가 먼저
  const v = W.units.filter(a => a.side === u.side && healTier(W, u, a, thr) >= need && dist(a, u) <= far).sort((a, b) => (b.down ? 1 : 0) - (a.down ? 1 : 0) || (injUrgent(W, b) ? 1 : 0) - (injUrgent(W, a) ? 1 : 0) || (b.bleed ? 1 : 0) - (a.bleed ? 1 : 0) || a.hp / a.max - b.hp / b.max)[0];   // v5.5 피 흘리는 동료 (지혈)   // v6.9 기절 · 쇼크 · 내출혈이 먼저
  if (!v) return false;
  // v5.8.9 플레이어 명령이 먼저: 아군이 명령 (이동 · 공격 · 돌진 · 줍기 …) 을 받고 있으면 스스로 치료하러 가지 않음 ('제자리' 면 그 자리에서 닿을 때만 부음). 대신 '치료 보류' 를 알림 (같은 동료면 4초에 한 번)
  const ord = u.side === 0 && u.order && u.order.k !== 'skill' ? u.order : null;
  if (ord && !(ord.k === 'hold' && (v === u || gap(u, v) <= Math.max(K.rng, healTier(W, u, v, thr) >= 2 ? 1.2 : 0)))){ if (u.healNote !== v.i || W.t - (u.healNoteT || -9) > 10){   /* v8.7.3 제자리여도 곁의 위급한 동료 · 알림은 10초에 한 번 */ u.healNote = v.i; u.healNoteT = W.t; L(W, { k: 'healHeld', a: u.i, b: v.i, o: ord.k, hp: Math.round(v.hp / v.max * 100), down: !!v.down, bleed: !!v.bleed, vis: true }); } return false; }
  // v7.9 나를 노린 치명적인 일격이 오는 걸 알아봤으면 치료를 시작하지 않음 — 곁의 동료가 아주 위급 (rescue) 하면 무릅쓰고 감
  const pr = perilOn(W, u);   // v7.9.3 적 · 아군 같음
  if (pr){
    const H = R.heal || {}, desp = v.down || v.hp / v.max < (H.rescue != null ? H.rescue : 0.12);
    if (!desp){ if (W.t - (u.healDeferT || -9) > 3){ u.healDeferT = W.t; u.lastDec = { t: W.t, s: `${pr.e.name}의 일격이 ${pr.eta.toFixed(1)}초 뒤 — 치료를 미룸` }; L(W, { k: 'healDefer', a: u.i, b: v.i, by: pr.e.i, eta: +pr.eta.toFixed(2), hp: Math.round(v.hp / v.max * 100), vis: true }); } return false; }
    if (W.t - (u.healRiskT || -9) > 3){ u.healRiskT = W.t; L(W, { k: 'healRisk', a: u.i, b: v.i, by: pr.e.i, eta: +pr.eta.toFixed(2), hp: Math.round(v.hp / v.max * 100), vis: true }); }
  }
  if (v === u || gap(u, v) <= K.rng){ startSkill(W, u, v, true); return true; }
  setMood(W, u, '응급', v.i); goTo(W, u, v.x, v.y, dt); return true;
}
// v4.9 쏘는 (던지는) 순간: 준비하는 사이 동료가 사선에 들어왔으면 (선 위에 먼저 걸리는 몸 · 오사 확률 20% 넘음) 쏘지 않고 멈춤. 탄 · 창은 그대로
// v5.5.1 명령 (공격 · 투창) 받은 상대를 쏘는 중: 아군 오사를 감수함 (확률 싸움 — 탄이 실제로 날아가 정함)
const ordFire = (u, t) => u.side === 0 && !!u.order && !!u.order.now && (u.order.k === 'attack' || u.order.k === 'throw') && !!t && u.order.b === t.i;   // v5.7.1 연달아 준 (급한) 명령만 오사를 감수
// v6.7 곡사 투창의 오사: 빗나간 창이 떨어질 둘레에 동료가 있으면 멈춤 (20% 넘음)
function javArcHold(W, u, t){ const f = javArcRisk(W, u, t); if (f.p <= 0.2) return false; L(W, { k: 'hold', a: u.i, b: t.i, by: f.who.i, jav: true, arc: true, vis: u.side === 0 || !!u.seenBy }); u.ffWait = (u.ffWait || 0) + 0.3; return true; }
function holdFire(W, u, t, jav){
  const fb = firstOnLine(W, u, t, u, knows(W, u));
  let b = fb !== t && fb.side === u.side ? fb : null;
  if (!b){ const f = ffOdds(W, u, t, u.x, u.y, -(jav ? JVu(W, u).wind : u.wind || 0.5), jav); if (f.p > 0.2) b = f.who; }
  if (!b) return false;
  L(W, { k: 'hold', a: u.i, b: t.i, by: b.i, jav: !!jav, vis: u.side === 0 || !!u.seenBy });
  u.ffWait = (u.ffWait || 0) + 0.3;
  return true;
}
/* ---------- v5.1 [도약] · [돌진] ---------- */
// v7.19 2연속 도약 (leapN 2 — 옐로): 남은 횟수가 있으면 chain 초 뒤 또 뜀, 다 쓰면 대기 × chainCd
function leapCdNext(W, u, R){ const n = u.leapN || 1; if (n <= 1) return R.cd || 1.1; u.leapQ = (u.leapQ == null ? n : u.leapQ) - 1; if (u.leapQ > 0) return R.chain || 0.3; u.leapQ = n; return (R.cd || 1.1) * (R.chainCd || 1.6); }
// 도약: 뒤로 dist 칸을 time 초에 (상대를 본 채). 바위에 막히면 거기까지
function startLeap(W, u, t){
  if (u.lie) return false;   // v7.11 엎드린 채 스스로 뛰지 않음 (명령이면 먼저 일어남)
  const R = W.rules.leap || {}, p = fallbackPt(W, u, t, R.dist || 1.7); if (!p) return false;
  u.act = { k: 'leap', phase: 'run', t0: W.t, end: W.t + (R.time || 0.3), fx: u.x, fy: u.y, tx: p.x, ty: p.y, b: t.i };
  u.leapCd = W.t + leapCdNext(W, u, R) * (cbHas(u, 'gob') ? (W.rules.combo || {}).leap || 0.85 : 1); stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  L(W, { k: 'leap', a: u.i, b: t.i, dir: 'back', vis: u.side === 0 || !!u.seenBy }); setMood(W, u, '뒤로 도약', t.i);
  if (u.side === 1 && !u.pactLeadCover){ const c = W.units.filter(m => m.alive && m !== u && m.side === 1 && isFar(m) && !m.pact && !(m.act && m.act.k === 'atk' && m.act.b === t.i) && !(m.act && m.act.phase === 'wind' && W.units[m.act.b] && W.units[m.act.b].alive && isFar(W.units[m.act.b])) && dist(m, t) <= m.rng && losClear(W.map, m.x, m.y, t.x, t.y)).sort((a, b) => dist(a, t) - dist(b, t))[0];   // v6.0 교대 엄호: 한 명이 물러나면 다른 궁수가 쫓는 놈을 겨눔
    if (c){ c.target = t; c.state = 'hunt'; if (c.act && c.act.k === 'atk' && c.act.phase === 'wind') c.act = null; pactMake(W, 'cover', u, c, t); } }
  return true;
}
// v6.7.4 [도약] = 앞 · 뒤 · 옆 어디로든: (x, y) 쪽으로 dist 칸까지 (바위 · 막힌 길이면 짧게). dir = fwd (그 상대에게 뛰어듦) · back · side · pt (바닥 자리)
function leapTo(W, u, x, y, dir, t, why){
  if (u.lie || W.t < (u.hobbleT || -9)) return false;   /* v7.23.2 이동 제약: 도약 못 함 */   // v7.11 엎드린 채 스스로 뛰지 않음 (명령이면 먼저 일어남)
  const R = W.rules.leap || {}, D = R.dist || 1.7, dx = x - u.x, dy = y - u.y, l = Math.hypot(dx, dy);
  if (l < 0.2 || u.crawl || u.kb) return false;
  const k = Math.min(1, D / l); let tx = u.x + dx * k, ty = u.y + dy * k;
  for (let s = 0; s < 6 && (boxRock(W, tx, ty, u.r * 0.9) || !fatClear(W.map, u.x, u.y, tx, ty, u.r * 0.8)); s++){ tx = u.x + (tx - u.x) * 0.75; ty = u.y + (ty - u.y) * 0.75; }
  const len = Math.hypot(tx - u.x, ty - u.y); if (boxRock(W, tx, ty, u.r * 0.9) || len < 0.3) return false;
  u.act = { k: 'leap', phase: 'run', t0: W.t, end: W.t + (R.time || 0.3) * Math.max(0.5, len / D), fx: u.x, fy: u.y, tx, ty, b: t ? t.i : null, dir };
  u.leapCd = W.t + leapCdNext(W, u, R) * (cbHas(u, 'gob') ? (W.rules.combo || {}).leap || 0.85 : 1); stop(u); u.fg = t && dir !== 'fwd' ? Math.atan2(t.y - u.y, t.x - u.x) : Math.atan2(ty - u.y, tx - u.x);
  L(W, { k: 'leap', a: u.i, b: t ? t.i : null, dir, why: why || '', x: +tx.toFixed(2), y: +ty.toFixed(2), len: +len.toFixed(2), vis: u.side === 0 || !!u.seenBy });
  setMood(W, u, { fwd: '앞으로 도약', back: '뒤로 도약', side: '옆으로 도약' }[dir] || '도약', t ? t.i : null);
  return true;
}
// 찍은 자리가 가까운 적에 견줘 앞 · 뒤 · 옆 어느 쪽인가 (적이 없으면 pt)
function leapDir(W, u, x, y){ const f = W.units.filter(o => o.alive && o.side !== u.side && (u.side === 0 ? o.seenBy : canSee(W, u, o))).sort((a, b) => dist(u, a) - dist(u, b))[0]; if (!f) return 'pt'; const d = angDiff(Math.atan2(y - u.y, x - u.x), Math.atan2(f.y - u.y, f.x - u.x)); return d < 1.05 ? 'fwd' : d > 2.1 ? 'back' : 'side'; }
// 상대에게 뛰어들 때 내릴 자리: 몸이 닿기 바로 앞
// v7.12 측후방 도약 (도약이 있는 근접): 나를 앞으로 보고 선 근접 상대의 옆 · 뒤로 뛰어 들어감 — 내려앉을 자리 둘레에 다른 적의 손이 닿으면 안 함
function flankLeap(W, u, t){
  const LP = W.rules.leap || {}, F = LP.flank; if (!F || !u.canLeap || isFar(u) || u.crawl || u.lie || u.kb || u.act || W.t < u.leapCd || W.t < (u.flankT || -9) || W.t < (u.flChk || -9) || AI6.includes('flank')) return false;
  u.flChk = W.t + (F.chk || 0.4);
  if (!t || !t.alive || t.down || isFar(t) || prone(W, t) || sideOf(W, t, u) !== 'front' || gap(u, t) > (LP.dist || 1.7) + 0.6) return false;
  const Dl = LP.dist || 1.7, rr = t.r + u.r + 0.12; let best = null, bs = -1e9;
  for (const a of F.ang || [1.9, 2.6]) for (const sg of [1, -1]){
    const ang = (t.face || 0) + sg * a, x = t.x + Math.cos(ang) * rr, y = t.y + Math.sin(ang) * rr, l = Math.hypot(x - u.x, y - u.y);
    if (l > Dl + 0.15 || l < 0.4 || boxRock(W, x, y, u.r * 0.9) || !fatClear(W.map, u.x, u.y, x, y, u.r * 0.6)) continue;
    if (W.units.some(f => f.alive && f !== t && f !== u && Math.hypot(f.x - x, f.y - y) < f.r + u.r + (f.side !== u.side && !isFar(f) ? f.rng + 0.3 : 0.05))) continue;
    const sc = (a > 2.2 ? 1 : 0.6) - l * 0.1; if (sc > bs){ bs = sc; best = { x, y, back: a > 2.2 }; }
  }
  if (!best) return false;
  u.flankT = W.t + (F.cd || 3);
  return leapTo(W, u, best.x, best.y, 'side', t, best.back ? '측후방 도약 — 뒤로 돌아 들어감' : '측후방 도약 — 옆으로 돌아 들어감');
}
const leapIn = (u, t) => { const d = dist(u, t) || 1; return { x: t.x - (t.x - u.x) / d * (t.r + u.r + 0.04), y: t.y - (t.y - u.y) / d * (t.r + u.r + 0.04) }; };
// 스스로: 나를 노린 돌진 (예고 · 달려오는 중) 을 보면 옆으로 뜀 (명령으로 움직이는 중엔 안 함 — 플레이어의 선택)
function leapAside(W, u){
  if (u.order && !['attack', 'hold'].includes(u.order.k)) return false;
  // 예고 때 뛰면 돌진이 다시 겨눔 — 달려오다 더는 못 꺾는 거리 (commit + 1칸 안) 에서 비스듬히 옆 · 뒤로 (투우사처럼)
  const C = W.rules.charge || {}, e = W.units.find(f => f.alive && f.side !== u.side && f.act && f.act.k === 'charge' && f.act.phase === 'run' && f.act.b === u.i && gap(f, u) > 0.4 && gap(f, u) < (C.commit != null ? C.commit : 1.2) + 1 && aware(W, u, f)); if (!e) return false;
  const a = Math.atan2(u.y - e.y, u.x - e.x), D = (W.rules.leap || {}).dist || 1.7, s0 = W.rand() < 0.5 ? 1 : -1;
  for (const s of [s0, -s0]) if (leapTo(W, u, u.x + Math.cos(a + s * 1.2) * D, u.y + Math.sin(a + s * 1.2) * D, 'side', e, '돌진 길에서 옆으로')) return true;
  return false;
}
// 스스로 (근접): 달아나는 사수 · 다른 이를 치려는 · 넘어진 상대에게 앞으로 뛰어듦 (내릴 자리 둘레에 다른 적 손이 둘 넘게 닿으면 안 함)
function pounce(W, u, t){
  if (!u.canLeap || u.crawl || W.t < u.leapCd || AI6.includes('pounce') || isFar(u)) return false;
  const D = (W.rules.leap || {}).dist || 1.7, g = gap(u, t); if (g <= u.rng + 0.5 || g > D + u.rng) return false;
  const away = Math.hypot(t.vx || 0, t.vy || 0) > 1.2 && ((t.vx || 0) * (t.x - u.x) + (t.vy || 0) * (t.y - u.y)) > 0;
  const why = isFar(t) ? '사수에게 뛰어듦' : away ? '달아나는 상대를 덮침' : t.act && t.act.phase === 'wind' && t.act.b !== u.i ? '빈틈에 뛰어듦' : prone(W, t) ? '넘어진 상대를 덮침' : null; if (!why) return false;
  const p = leapIn(u, t); if (W.units.filter(f => f.alive && f !== t && f.side !== u.side && !isFar(f) && Math.hypot(f.x - p.x, f.y - p.y) < f.rng + f.r + u.r + 0.4).length >= 2) return false;
  return leapTo(W, u, p.x, p.y, 'fwd', t, why);
}
function stepLeap(W, u, dt){
  const A = u.act, q = Math.min(1, (W.t - A.t0) / Math.max(0.05, A.end - A.t0));
  if (A.flip && A.slam && A.b != null && q < 0.85){ const t = W.units[A.b]; if (t && t.alive){ if (A.bx == null){ A.bx = t.x; A.by = t.y; A.hom = 0; }   /* v8.7.2 공중제비 유도 (살짝) */
    let dx = t.x - A.bx, dy = t.y - A.by; const l = Math.hypot(dx, dy), room = 1 - A.hom; if (l > 0.001 && room > 0){ const k = Math.min(1, room / l); dx *= k; dy *= k; if (!boxRock(W, A.tx + dx, A.ty + dy, u.r * 0.9)){ A.tx += dx; A.ty += dy; A.hom += Math.hypot(dx, dy); } }
    A.bx = t.x; A.by = t.y; } }
  if (A.air){ u.x = A.fx + (A.tx - A.fx) * q; u.y = A.fy + (A.ty - A.fy) * q; } else tryMove(W, u, A.fx + (A.tx - A.fx) * q, A.fy + (A.ty - A.fy) * q);   // v7.22.2 도약 강타는 머리 위로 넘어감
  if (A.quake && !A.warned && q >= (SPR(W, 'quake').react || 0.3)){ A.warned = true; quakeWarn(W, u, A); }
  if (A.k === 'leap' && !A.shot && u.lob && (u.marks || 0) >= ((W.rules.leap || {}).shotMin != null ? W.rules.leap.shotMin : 0.55) - 0.01 && q >= ((W.rules.leap || {}).shotAt || 0.5)) leapShot(W, u, A);   // v7.17 사격 A 이상   // v7.14 도약 사격
  if (q >= 1){ if (A.slam) slamHit(W, u, A); if (A.gslam) gslamHit(W, u, A); u.act = null; if (A.quake){ quakeHit(W, u, A); const it = A.grab != null ? W.items.find(i => i.id === A.grab) : null; if (it && u.alive && Math.hypot(it.x - u.x, it.y - u.y) <= u.r + 0.8 && canTake(W, u, it)) takeItem(W, u, it); } }   // v7.19.1 공중제비 내려찍기   // v7.22.2 도약 강타 (무기를 주우러 뛰었으면 내려앉으며 집어 듦)
}
// v7.14 활은 도약 중에도 쏨 (도약 사격): 뛰게 만든 상대 (보이고 사거리 안) — 없으면 가장 가까이 보이는 상대. 조준 × shotAim · 교전 규칙이 막으면 안 쏨
function leapShot(W, u, A){
  A.shot = true; const LP = W.rules.leap || {}; if (u.ammo === 0 || (u.weaponNow && u.weaponNow !== u.weapon) || (u.arms && (u.arms.L || u.arms.R))) return;
  const okT = f => f && f.alive && !f.down && f.side !== u.side && canSee(W, u, f) && gap(u, f) <= u.rng && !(u.side === 0 && roeBlock(W, u, f, 'fire'));
  const know = knows(W, u), safe = f => { const fb = firstOnLine(W, u, f, u, know); return !(fb !== f && fb.side === u.side) && ffOdds(W, u, f, u.x, u.y).p <= ffLim(u, W); };   /* v8.7.3 도약 사격도 사선을 봄 */
  let t = A.b != null ? W.units[A.b] : null; const t0 = okT(t) ? t : null; if (!okT(t) || !safe(t)) t = W.units.filter(f => okT(f) && safe(f)).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (!t){ if (t0) L(W, { k: 'hold', a: u.i, b: t0.i, by: (firstOnLine(W, u, t0, u, know) || t0).i, leap: true, vis: u.side === 0 || !!u.seenBy }); return; }
  fire(W, u); launch(W, u, t, 1, LP.shotAim || 0.6); if (u.ammo === 0) outOfAmmo(W, u);
  L(W, { k: 'leapShot', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy || !!t.seenBy });
}
// 돌진: 곧은 길로 속력 ×spd. 처음 닿는 상대를 들이받음 (막아도 자세가 크게 깎임) — 밀치고 움찔 · 준비 끊음. 바위 · 끝이면 멈춤
function tryCharge(W, u, t, forced, noStance){
  const C = W.rules.charge || {}, g = gap(u, t);
  if (u.stoneT != null && W.t < u.stoneT) return false;   /* v8.7.4 방어모드 */
  if (u.noChg && !(forced && u.noChg0 && u.noChg === u.noChg0 && !u.noChgUser)) return false;   /* v8.7.2 타고난 성향은 지휘관의 돌격 명령은 따름 */   // v7.29.0 돌격 안 함 (성향 · 유저 설정) — 유저의 돌진 명령 (startCharge) 은 따로라 언제나 됨
  // v5.4 지휘가 있는 편 (탱커도 있음) 은 지휘가 '들어가!' (대치 → 교전) 를 내리기 전엔 함부로 돌격하지 않음. 명령 (플레이어) 은 예외
  if (!forced && !noStance && cmdHold(W, u)) return false;   /* v8.7.8 혼자인 편은 기다리지 않음 (cmdHold) */
  if (!forced && u.line) return false;   // v6.3.1 전열을 지키는 동안은 스스로 돌진하지 않음 — 전열을 벗어나면 다시 (돌진 명령은 따로라 언제나 됨)
  if (!u.canCharge || u.crawl || u.act || u.kb || W.t < u.proneT || W.t < u.chargeCd || W.t < u.brokenT || g < (C.min || 1.5) || g > (C.max || 5) || (!canSee(W, u, t) && !(forced && (u.side === 0 ? t.seenBy : fresh(W, u.sense[t.i], 1.5)))) || !fatClear(W.map, u.x, u.y, t.x, t.y, u.r * 0.9)) return false;   // v5.5.2 명령이면 내가 못 봐도 동료가 보면 들이받음
  if (W.units.some(o => o.alive && o !== u && o !== t && o.side === u.side && segD(u, t.x, t.y, o) < o.r + u.r && W.units.some(f => f.alive && f.side !== o.side && gap(o, f) < Math.max(o.rng, f.rng) + 0.3))) return false;   // v5.5.3 길에 맞붙어 싸우는 동료가 있으면 안 함 (나머지 동료 사이는 비집고 나감)
  if (!forced && W.units.some(f => f.alive && f !== t && f.side !== u.side && !f.down && !f.crawl && canSee(W, u, f) && gap(u, f) < Math.min(2.5, g - 1.2))) return false;   /* v8.7.2 더 가까운 적을 지나쳐 돌격하지 않음 */
  if (!forced && !chargeOk(W, u, t)) return false;   // v5.3 돌격할 만한가 (빈틈 · 버팀)
  startCharge(W, u, t, null);
  return true;
}
// v5.8.7 돌격 받기 (태세): 막는 자세 (방패 · 무구 · 반사신경) 를 세우고, 돌격해 오는 쪽을 막는 방향 안에 두고, 알아챘고, 손이 비었음 (제 공격 중 · 다른 상대와 맞붙음 · 휘청 · 무너짐이 아님).
// 싸우는 전선에 옆 · 뒤에서, 또는 치고 있는 놈에게 들어가는 돌격은 그래서 대개 통함
const isSpear = u => !isFar(u) && u.spearHeld !== false && /창$/.test(u.weaponNow || u.weapon || '');
function setFor(W, t, u){
  if (!guardOn(W, t) || isFar(t) || t.act || t.kb) return false;
  if (angDiff(t.face, Math.atan2(u.y - t.y, u.x - t.x)) * 180 / Math.PI > guardArc(W, t) + (shieldWall(W, t) ? ((W.rules.guard || {}).wall != null ? W.rules.guard.wall : 25) : 0)) return false;
  if (!aware(W, t, u)) return false;
  const f = focusOf(W, t); if (f && f !== u && f.alive && f.side !== t.side && gap(t, f) < (t.rng || 0.5) + 0.4) return false;   // 다른 상대와 맞붙어 손이 묶임
  return true;
}
// 버틸 때 깎이는 자세: 돌격 자세 깎기 × 부딪힌 힘 k × (방패 돌진이면 더) × 무게 비 (창은 땅에 박아 받으니 √) × 방어 재능 (전선 1 · 공격수 1.5배)
function setCost(W, u, t, k, bMass){
  const C = W.rules.charge || {}, SR = W.rules.chargeSet || {}, sp = !t.shield && isSpear(t), r = Math.max(0.5, Math.min(3, u.mass / Math.max(30, bMass || t.mass)));   // 무게 비 ½ ~ 3배
  return (C.post || 60) * k * (u.shield ? (C.shieldKb || 1.3) : 1) * (t.shield ? 1 : sp ? (SR.spearPost != null ? SR.spearPost : 0.6) : (SR.parryPost != null ? SR.parryPost : 1.2)) * (sp ? Math.sqrt(r) : r) * (2 - (t.gTal != null ? t.gTal : 1));
}
// 버팀: 돌격한 쪽이 멈춰 휘청 · 튕겨 나오고, 받은 쪽이 받아침 (창은 달려온 속력만큼 꿰뚫음 — 방패 돌진이면 방패가 받아 냄)
function setHold(W, u, t, k, vr){
  const SR = W.rules.chargeSet || {}, C = W.rules.charge || {}, sp = !t.shield && isSpear(t), A = u.act || {};
  u.act = null;
  L(W, { k: 'impact', a: u.i, b: t.i, armA: !!u.armShield, held: true, how: t.armShield ? '팔' : t.shield ? '방패' : sp ? '창' : '무구', vr: +vr.toFixed(1), run: +(A.run || 0).toFixed(1), full: (A.run || 0) >= (C.full || 3) - 0.05, shield: !!u.shield, post: Math.round(t.post), vis: u.side === 0 || t.side === 0 || !!u.seenBy || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '버팀!', c: 'b', t0: W.t });
  const pierce = sp && !(u.shield && guardOn(W, u));   // 방패를 들고 달려온 쪽은 방패가 창끝을 흘림 → 보통 받아치기
  strike(W, t, u, u, 1, false, { mul: pierce ? (SR.spear != null ? SR.spear : 1.6) * Math.max(0.5, k) : (SR.counter != null ? SR.counter : 0.8), tag: pierce ? '창에 꿰뚫림' : t.shield ? (t.armShield ? '팔로 받아침' : '방패로 받아침') : sp ? '창으로 받아침' : '받아치기' });
  if (!u.alive) return;
  const q = Math.max(0.3, Math.min(1.3, k)), nl = dist(u, t) || 1;
  fling(W, t, u, (SR.bounce != null ? SR.bounce : 0.4) * q, (u.x - t.x) / nl, (u.y - t.y) / nl, { how: 'bounce' });
  stun(W, u, (SR.stun != null ? SR.stun : 1) * q * (u.shield ? 0.7 : 1), t.i);
}
// v5.9.3 전열 참여 명령: 마디면 자리를 지킴 (손 닿는 앞의 상대만 · 쫓거나 협공하러 떠나지 않음) · 아니면 가까운 전열 끝 (창은 마디 뒤 2열) 에 붙음 · 전열이 없으면 가까운 근접 동료 옆에 새 전열.
// 사수는 가까운 전열 가운데 뒤에 서서 스스로 싸움 (명령은 거기서 끝). 붙을 데가 없으면 그 자리에서 가까운 적을 보고 섬
// v7.24.3 전열 지원 (사수 · 치유): 가까운 내 전열 · 그 전열을 따르는 지원 역할 순서 · 제 자리 (가운데 뒤 back M · 옆으로 gap M 씩)
const isSup = u => isFar(u) || u.cls === '치유';
const nearLine = (W, u) => (W.lines || []).filter(l => l.side === u.side && l.ids.some(i => W.units[i] && W.units[i].alive)).sort((a, b) => dist(u, centroid(a.ids.map(i => W.units[i]).filter(x => x && x.alive))) - dist(u, centroid(b.ids.map(i => W.units[i]).filter(x => x && x.alive))))[0] || null;
function supSlot(W, u, ln){   // 사수: 전열 양 끝 뒤 비스듬히 (사선이 트임 · 번갈아 왼쪽 · 오른쪽 · 더 있으면 한 줄 뒤) · 치유: 가운데 뒤 (옆으로 1.3M 씩)
  const M = ln.ids.map(i => W.units[i]).filter(x => x && x.alive), c = centroid(M), fx = Math.cos(ln.face), fy = Math.sin(ln.face), px = -fy, py = fx;
  const S2 = W.units.filter(f => f.alive && f.side === u.side && f.order && f.order.k === 'line' && f.order.join && isSup(f) && isFar(f) === isFar(u) && nearLine(W, f) === ln).sort((a, b) => a.i - b.i), j = Math.max(0, S2.indexOf(u));
  let x, y;
  if (isFar(u)){ const side = j % 2 ? -1 : 1, tier = Math.floor(j / 2), pr = m => (m.x - c.x) * px + (m.y - c.y) * py, end = M.slice().sort((a, b) => side * (pr(b) - pr(a)))[0], back = 0.9 + tier * 1.2;
    x = end.x - fx * back + px * side * (end.r + u.r + 0.45); y = end.y - fy * back + py * side * (end.r + u.r + 0.45); }
  else { const back = 1.7 + (M.length > 4 ? 0.3 : 0), off = j === 0 ? 0 : (j % 2 ? 1 : -1) * Math.ceil(j / 2) * 1.3; x = c.x - fx * back + px * off; y = c.y - fy * back + py * off; }
  return { c, p: freeSpot(W, x, y, u.r) || { x, y } };
}
function joinStep(W, u, dt){
  if (isSup(u)){   /* v7.24.3 지원: 전열 뒤 제 자리를 계속 지키며 따라다님 → 자리에 서면 제자리처럼 쏘고 치료함 ('hold' 를 돌려줌) */
    const ln = nearLine(W, u); u.order.sup = true; let c, p, face;
    if (ln){ ({ c, p } = supSlot(W, u, ln)); face = ln.face; }
    else { const mates = W.units.filter(f => f.alive && f.side === u.side && f.order && f.order.k === 'line' && f.order.join && !isSup(f));   // 전열이 아직 안 섰으면 전열 참여 중인 근접 동료 뒤로
      if (!mates.length){ u.order = null; u.supAt = null; return; }
      c = centroid(mates); const e = lineFoes(W, u).sort((a, b) => dist(c, a) - dist(c, b))[0]; face = e ? Math.atan2(e.y - c.y, e.x - c.x) : (mates[0].face || 0); const x = c.x - Math.cos(face) * 1.7, y = c.y - Math.sin(face) * 1.7; p = freeSpot(W, x, y, u.r) || { x, y }; }
    u.supAt = { x: +c.x.toFixed(2), y: +c.y.toFixed(2) };
    if (Math.hypot(p.x - u.x, p.y - u.y) > 0.55){ setMood(W, u, '전열 뒤로'); goTo(W, u, p.x, p.y, dt); return; }
    stop(u); u.fg = face; return 'hold';
  }
  if (u.line){ if (lineKeep(W, u, dt, true)) return;
    const nr = lineFoes(W, u).filter(f => gap(u, f) <= u.rng + 0.05).sort((a, b) => dist(u, a) - dist(u, b))[0];   // 옆 · 뒤에서 손 닿는 상대 (가려 주는 마디 없음) → 돌아서 막음
    if (nr){ u.target = nr; stop(u); startAct(W, u, nr, '돌아서 막음'); return; }
    stop(u); u.fg = u.line.ln.face; u.lineHoldF = u.line.ln.face; u.lineHoldT = W.t; setMood(W, u, '전열'); return; }
  if (u.rearOf && rank2(W, u)){   // 뒷줄 창: 앞 마디 너머 손 닿는 상대를 찌름
    const ln = u.rearOf.ln, t = lineFoes(W, u).filter(f => gap(u, f) <= u.rng + 0.05 && angDiff(ln.face, Math.atan2(f.y - u.y, f.x - u.x)) < 1.2).sort((a, b) => dist(u, a) - dist(u, b))[0];
    if (t){ u.target = t; stop(u); startAct(W, u, t, '2열 찌르기'); return; }
    stop(u); u.fg = ln.face; setMood(W, u, '2열'); return;
  }
  if (lineJoin(W, u, dt, true)) return;
  const e = lineFoes(W, u).sort((a, b) => dist(u, a) - dist(u, b))[0]; stop(u); if (e) u.fg = Math.atan2(e.y - u.y, e.x - u.x); setMood(W, u, '전열 (혼자)');
}
// v5.8.5 도움닫기: 달린 거리만큼 빨라짐 — 처음 ×sp0 → full 칸을 달리면 전력질주 ×spd. 부딪히는 힘 (속력) 도 그만큼이라 짧은 돌격은 덜 셈
const chargeSp = (C, v0, run) => { const top = C.spd || 2.2, s0 = C.sp0 != null ? C.sp0 : top; return v0 * (s0 + (top - s0) * Math.min(1, run / Math.max(0.1, C.full || 3))); };
function chargeTime(C, v0, s){ let t = 0, run = 0; const ds = 0.05; while (run < s){ t += ds / Math.max(0.1, chargeSp(C, v0, run)); run += ds; } return t; }
// v5.4 돌격 예고: wind 초 동안 자세를 낮추고 노려봄 (예고선) → 달림. v5.5.3 t = 노리는 상대 (없으면 바닥 자리 pt 로 곧장)
function startCharge(W, u, t, pt){
  if (u.lie) return false;   // v7.11 엎드린 채 스스로 돌진하지 않음 (명령이면 먼저 일어남)
  const C = W.rules.charge || {}, tx = t ? t.x : pt.x, ty = t ? t.y : pt.y;
  u.act = { k: 'charge', phase: 'wind', b: t ? t.i : null, px: pt ? pt.x : null, py: pt ? pt.y : null, t0: W.t, end: W.t + (C.wind != null ? C.wind : 0.35) };
  u.chargeCd = W.t + (C.cd || 8); stop(u); u.burst = null; tire(W, u, 'charge'); u.fg = Math.atan2(ty - u.y, tx - u.x); u.face = u.fg;   // v6.6 지침   // v7.0 고침: 주석에 삼켜져 있던 '돌진 준비 때 상대 쪽으로 돎'
  const cry = chargeCry(W, u);
  L(W, { k: 'charge', a: u.i, b: t ? t.i : null, x: pt ? +pt.x.toFixed(2) : null, y: pt ? +pt.y.toFixed(2) : null, name: u.chargeName, cry, mute: u.mute, shield: !!u.shield, arm: !!u.armShield, vis: u.side === 0 || !!u.seenBy });
  setMood(W, u, u.chargeName, t ? t.i : null);
  if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: cry, t0: W.t });
}
// v5.5.3 휘청 (스턴): sec 초 동안 못 움직이고 못 치고 못 막음 (넘어지진 않음)
const VETR = W => Object.assign({ pin: 0.7, post: 0.75, regen: 1.5, back: 55, raise: 0.7, low: 0.15, tal: 0.9 }, W.rules.vet || {});   // v6.1 [베테랑]
// v7.29.0 버팀: 넘어짐 · 휘청을 버팀 (글 · 반짝은 fxGap 초에 한 번)
// v8.7.3 이어진 휘청 · 넘어짐: 풀린 지 chainGap 초 안 (또는 아직 묶인 채) 에 또 걸리면 짧아짐 — 돌려주는 배수 (0 에 가까우면 버팀)
function ccChain(W, u){ const C = W.rules.cc || {}, end0 = Math.max(u.stunT || -9, u.proneT || -9), n = W.t <= end0 + (C.chainGap != null ? C.chainGap : 0.8) ? (u.ccN || 0) + 1 : 0; u.ccN = n; return Math.max(0, 1 - (C.chainDr != null ? C.chainDr : 0.4) * n); }
function ccShrug(W, u, by, what){ L(W, { k: 'ccRes', a: by != null ? by : u.i, b: u.i, what, vis: u.side === 0 || !!u.seenBy });
  if (W.fxOn && W.t - (u.ccFxT || -9) >= ((W.rules.cc || {}).fxGap || 0.6)){ u.ccFxT = W.t; W.fx.push({ k: 'num', x: u.x, y: u.y, s: '버팀!', c: 'g', t0: W.t }); } }
function stun(W, u, sec, by){
  if (!u.alive || !(sec > 0) || W.t < (u.saT || -9)) return 0;   /* v7.23.2 슈퍼아머 */
  if (u.ccRes && W.rand() < u.ccRes){ ccShrug(W, u, by, 'stun'); return 0; }   /* v7.29.0 버팀 (세자르 — 휘청도 거의 안 걸림) */
  { const dr = ccChain(W, u); if (dr <= 0.05){ ccShrug(W, u, by, 'chain'); return 0; } sec *= dr; }   /* v8.7.3 이어진 휘청은 짧아짐 */
  if (u.vet) sec *= VETR(W).pin;   // v6.1 베테랑: 휘청이 짧음
  u.stunT = Math.max(u.stunT || -9, W.t + sec); if (!(u.act && u.act.k === 'spec' && u.act.s === 'sweep' && u.act.phase === 'swing')) flailDrop(W, u, '휘청'); interrupt(W, u, '휘청여 준비가 끊김'); stop(u);   /* v7.25.0 한 바퀴 도는 중엔 기세로 끝까지 */
  L(W, { k: 'stun', a: by, b: u.i, sec: +sec.toFixed(2), vis: u.side === 0 || !!u.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '휘청!', c: 'd', t0: W.t });
  return sec;
}
function stepCharge(W, u, dt){
  const A = u.act, C = W.rules.charge || {}, x0 = u.x, y0 = u.y;
  // v5.2 달리며 조금씩 방향을 틂 (초당 turn rad 까지) — 비켜서는 상대를 따라감
  const tg0 = A.b != null ? W.units[A.b] : null, aim0 = tg0 && tg0.alive ? (AI6.includes('clead') || Math.hypot(tg0.vx || 0, tg0.vy || 0) < 0.8 ? tg0 : (k => ({ x: tg0.x + (tg0.vx || 0) * k, y: tg0.y + (tg0.vy || 0) * k, r: tg0.r }))(Math.min(0.8, dist(u, tg0) / Math.max(1, A.sp || 1)))) : A.px != null ? { x: A.px, y: A.py } : null;   // v5.5.3 정한 자리로도 · v6.5 달아나는 상대는 닿을 때의 자리로 (0.8초 앞까지)
  if (A.v0 != null) A.sp = chargeSp(C, A.v0, A.run || 0);   // v5.8.5 도움닫기
  if (A.sup) A.sp *= APR(W).spd || 1.8;   /* v8.7.8 초돌진 */
  if (aim0){ const want = Math.atan2(aim0.y - u.y, aim0.x - u.x), cur = Math.atan2(A.dy, A.dx); let d = want - cur; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; const m = (tg0 && tg0.alive && aim0 !== A.pxy && Math.hypot(tg0.x - u.x, tg0.y - u.y) - u.r - (tg0.r || 0) < (C.commit != null ? C.commit : 1.2)) ? 0 : (C.turn != null ? C.turn : 0.6) * dt * turnMul(W, u), na = cur + Math.max(-m, Math.min(m, d)); A.dx = Math.cos(na); A.dy = Math.sin(na); u.face = u.fg = na; }
  tryMove(W, u, u.x + A.dx * A.sp * dt, u.y + A.dy * A.sp * dt);
  A.run = (A.run || 0) + Math.hypot(u.x - x0, u.y - y0);
  if (A.sup){ apSweep(W, u, A); if (!u.act) return; if (A.run > (A.lim || 99)){ u.act = null; return; } }   /* v8.7.8 초돌진: 길 둘레의 적을 휩쓺 · 노린 적을 놓치면 그만 */
  // v5.5.3 아군 사이를 비집고 나감: 앞을 막은 동료는 옆으로 밀려 비켜섬 (다치지 않음)
  { const qx = -A.dy, qy = A.dx;
    for (const o of W.units){ if (!o.alive || o === u || o.side !== u.side || o.kb) continue; const ox = o.x - u.x, oy = o.y - u.y, need = o.r + u.r + 0.04; if (Math.hypot(ox, oy) >= need || ox * A.dx + oy * A.dy < -0.1) continue;
      const s = ox * qx + oy * qy, sg = s >= 0 ? 1 : -1, mv = Math.min(0.14, need - Math.abs(s) + 0.02); const om = o.moved; tryMove(W, o, o.x + qx * sg * mv, o.y + qy * sg * mv); o.moved = om;
      if (!A.sq){ A.sq = true; L(W, { k: 'squeeze', a: u.i, b: o.i, vis: u.side === 0 || !!u.seenBy }); } } }
  const hit = W.units.filter(f => f.alive && f.side !== u.side && !(A.ev && A.ev.includes(f.i)) && !(f.act && f.act.k === 'leap' && f.act.air) && dist(f, u) <= f.r + u.r + (u.giant ? 0.2 : 0.06)).sort((a, b) => dist(a, u) - dist(b, u))[0];   /* v8.7.8 공중에 뜬 몸 (공중제비 · 내려찍기) 밑으로는 지나감 */   // v5.2 거구는 팔까지 · v6.7 옆으로 흘린 상대는 지나침
  // v5.2 노린 상대가 옆으로 비켜서 길에서 벗어나면 (앞 50° 밖 · 2칸 안) 지나쳐 달려가지 않고 멈춰 돌아섬
  const tg = A.b != null ? W.units[A.b] : null;
  if (!hit && A.px != null && !(tg && tg.alive) && Math.hypot(A.px - u.x, A.py - u.y) < 0.25){ u.act = null; return; }   // v5.5.3 정한 자리에 닿음
  if (!hit && tg && tg.alive && dist(u, tg) < 1.6 && angDiff(Math.atan2(tg.y - u.y, tg.x - u.x), Math.atan2(A.dy, A.dx)) > 1.2){ u.act = null; u.fg = Math.atan2(tg.y - u.y, tg.x - u.x); L(W, { k: 'chargeMiss', a: u.i, b: tg.i, vis: u.side === 0 || !!u.seenBy }); return; }
  const stuck = Math.hypot(u.x - x0, u.y - y0) < A.sp * dt * 0.3;
  if (hit && !(hit.act && hit.act.k === 'charge' && hit.act.phase === 'run') && evadeCharge(W, hit, u, A)) return;   // v6.7 회피: 들이닥치는 몸을 옆으로 흘림 (마주 달리는 중이면 못 피함)
  if (hit){
    // v5.3 운동량 충돌 (부딪히는 선 n 위 1차원): 상대도 돌격 중이면 속력이 합쳐짐 (마주 돌격), 서 있는 상대는 방진 버팀만큼 무거워짐.
    // 부딪힌 뒤 속력 vA2 = vA − (1+e)·mB/(mA+mB)·vr, vB2 = vB + (1+e)·mA/(mA+mB)·vr → 그 속력 × kb 초 만큼 날아감 (가벼운 쪽이 튕겨 나감, downV 넘으면 넘어짐)
    const nl = dist(u, hit) || 1, nx = (hit.x - u.x) / nl, ny = (hit.y - u.y) / nl, hc = hit.act && hit.act.k === 'charge' && hit.act.phase === 'run' ? hit.act : null;
    const vA = (A.dx * nx + A.dy * ny) * A.sp, vB = hc ? (hc.dx * nx + hc.dy * ny) * hc.sp : 0, vr = Math.max(0.5, vA - vB);
    const br = hc ? { mass: hit.mass * (hit.poise || 1), trained: false, mates: false } : braceOf(W, hit, u, nx, ny), e = C.e != null ? C.e : 0.3; let mA = u.mass, mB = br.mass, mtB = false;
    { const M = MIGHT(W), KB0 = C.kb != null ? C.kb : 0.3;   /* v7.24.2 괴력: 들이받히는 순간 버팀 (받는 쪽) · 되튕기려는 순간 밀어붙임 (돌격한 쪽) */
      if (hit.side !== u.side && (vB + (1 + e) * mA / (mA + mB) * vr) * KB0 >= (M.min || 0.5) && mightReady(W, hit)) { mB *= mightUse(W, hit, hc ? 'ram' : 'brace', u); mtB = true; }
      else if (hit.side !== u.side && vA - (1 + e) * mB / (mA + mB) * vr < -0.2 && mightReady(W, u) && vA - (1 + e) * mB / (mA * (u.might || 1) + mB) * vr >= -0.2) mA *= mightUse(W, u, 'ram', hit); }   /* v8.7.3 막을 수 있을 때만 */
    const vA2 = vA - (1 + e) * mB / (mA + mB) * vr, vB2 = vB + (1 + e) * mA / (mA + mB) * vr, k = Math.max(0.25, Math.min(1.6, vr / 4.5));   // v5.8.6 짧은 돌격은 덜 셈 (바닥 0.5 → 0.25)
    // v5.8.6 도움닫기 몫: shove 칸도 못 달렸으면 밀치기 수준 (휘청 없음 · 덜 눌림), 그 위로는 전력질주 (full 칸) 까지 휘청이 0.5 → 1배
    const runN = A.run || 0, pushOnly = !hc && runN < (C.shove != null ? C.shove : 1), pw = pushOnly ? 0 : Math.max(0, Math.min(1, (runN - (C.shove != null ? C.shove : 1)) / Math.max(0.1, (C.full || 3) - (C.shove != null ? C.shove : 1))));
    // v5.8.7 태세를 갖춘 상대: 자세가 버티면 돌격한 쪽이 당함 (setHold), 못 버티면 방어가 무너지고 그대로 들이받힘
    let setBroke = false;
    if (!hc && setFor(W, hit, u)){ let cost = setCost(W, u, hit, k, br.mass / (br.trained ? C.trained || 1.6 : 1));   // 훈련 버팀 배율은 태세에 이미 들어 있음
      if (hit.post <= cost && hit.post > cost / ((hit.might || 1) * 1.05) && hit.side !== u.side && mightReady(W, hit)) cost /= mightUse(W, hit, 'brace', u);   /* v7.24.2 괴력: 무너지려던 태세를 버팀 */
      if (hit.post > cost){ hit.post -= cost; hit.blockT = W.t; hit.blocked++; setHold(W, u, hit, k, vr); return; }
      hit.post = 0; hit.brokenT = W.t + W.rules.breakTime; setBroke = true; }
    const blocked = !setBroke && inGuard(W, hit, u, true), sh = !!u.shield, shK = sh ? (C.shieldKb || 1.3) : 1;   // v5.5.3 방패 돌진: 더 세게 밀침 · 둔기 (방패로 받아침)
    strike(W, u, hit, hit, 1, false, { mul: (C.dmg || 0.6) * k, wk: sh ? '둔기' : heavyKind(W, u), tag: u.chargeName });
    if (hc && hit.alive && u.alive) strike(W, hit, u, u, 1, false, { mul: (C.dmg || 0.6) * k, wk: heavyKind(W, hit), tag: hit.chargeName });   // 마주 돌격: 둘 다 침
    if (blocked && hit.alive){ hit.post -= (C.post || 60) * k * shK; if (hit.post <= 0){ hit.post = 0; hit.brokenT = W.t + W.rules.breakTime; } }
    if (hit.alive){ hit.pinT = W.t + (C.pin || 1.2) * (pushOnly ? 0.4 : 1) * (mbOn(W, hit) ? mbF(W, hit, 'pin') : 1) * (hit.vet ? VETR(W).pin : 1); interrupt(W, hit, pushOnly ? '밀려 준비가 끊김' : '들이받혀 준비가 끊김'); }
    L(W, { k: 'impact', a: u.i, b: hit.i, armB: !!hit.armShield, block: blocked, broke: blocked && hit.brokenT > W.t, clash: !!hc, braced: !!(br.trained || br.mates), trained: !!br.trained, mt: mtB, vr: +vr.toFixed(1), shield: sh, run: +(A.run || 0).toFixed(1), full: (A.run || 0) >= (C.full || 3) - 0.05, push: pushOnly, setBroke, vis: u.side === 0 || !!u.seenBy || !!hit.seenBy });
    // v5.5.3 막지 않았으면 반드시 잠깐 휘청 (스턴) — 무게 비 만큼 (0.6 ~ 1.5배), 방패 돌진은 더 길게
    if (!blocked && hit.alive && !pushOnly && !mtB) stun(W, hit, (C.stun != null ? C.stun : 1) * Math.max(0.6, Math.min(1.5, u.mass / Math.max(1, hit.mass))) * (sh ? (C.shieldStun || 1.25) : 1) * (hc ? 1 : 0.5 + 0.5 * pw), u.i);   // v5.8.6 휘청은 달려온 만큼 (밀치기 수준이면 없음)
    u.act = { k: 'atk', phase: 'rec', b: hit.i, t0: W.t, end: W.t + 0.5, t1: W.t };
    { const SR = W.rules.chargeSet || {}; u.offBal = W.t + (sh ? (SR.afterShield != null ? SR.afterShield : 0.3) : (SR.after != null ? SR.after : 0.5)); }   // v5.8.7 들이받은 뒤 빈틈: 잠깐 막지 못함 (방패는 덜)
    if (hc && hit.alive) hit.act = { k: 'atk', phase: 'rec', b: u.i, t0: W.t, end: W.t + 0.5, t1: W.t };
    const KB = C.kb != null ? C.kb : 0.3, dv = C.downV != null ? C.downV : 4;
    if (hit.alive && vB2 > 0.2) fling(W, u, hit, vB2 * KB * shK, nx, ny, { how: hc ? 'clash' : 'charge', v: vB2, brace: br.ids || [], ...(mtB ? { mt: true } : {}) });   /* v8.7.3 받쳐 준 몸은 받아 줌 */
    if (u.alive && vA2 < -0.2) fling(W, hit, u, -vA2 * KB * (sh ? 0.6 : 1), -nx, -ny, { how: 'recoil', v: -vA2 * (sh ? 0.6 : 1) });   // 방패가 받아 덜 튕김
    return;
  }
  if (stuck || W.t >= A.end) u.act = null;
}
function resolveAct(W, u){
  if (u.act.k === 'charge' && u.act.phase === 'wind'){   // v5.4 예고 끝 → 그때 상대 (v5.5.3 또는 정한 자리) 쪽으로 달림
    const C = W.rules.charge || {}, t = u.act.b != null ? W.units[u.act.b] : null, pt = u.act.px != null ? { x: u.act.px, y: u.act.py } : null;
    if (!pt && (!t || !t.alive)){ u.act = null; return; }
    const tx = t && t.alive ? t.x : pt.x, ty = t && t.alive ? t.y : pt.y, d = Math.hypot(tx - u.x, ty - u.y) || 1, v0 = spdNow(W, u), sp = chargeSp(C, v0, 0);   // v5.8.5 도움닫기 (달릴수록 빨라짐)
    u.act = { k: 'charge', phase: 'run', b: t ? t.i : null, px: pt ? pt.x : null, py: pt ? pt.y : null, t0: W.t, end: W.t + chargeTime(C, v0, d + (t ? 0.6 : 0.15)), dx: (tx - u.x) / d, dy: (ty - u.y) / d, sp, v0, run: 0, ...(u.act.sup ? { sup: true, lim: d + 1.5 } : {}) };
    u.fg = u.face = Math.atan2(ty - u.y, tx - u.x); return;
  }
  if (u.act.k === 'bagSwap'){ resolveSwap(W, u); return; }   // v7.20
  if (u.act.k === 'invAct'){ resolveInv(W, u); return; }   /* v8.7.6 */
  if (u.act.k === 'altSwap'){ resolveAlt(W, u); return; }   // v7.25.1
  if (u.act.k === 'drink'){ resolveDrink(W, u); return; }   // v7.22.1
  if (u.act.k === 'bagAmmo'){ resolveBagAmmo(W, u); return; }
  if (u.act.k === 'reload'){ u.mag = Math.min(u.magMax, u.ammo); u.act = null; L(W, { k: 'reloaded', a: u.i, mag: u.mag, ammo: u.ammo, vis: u.side === 0 || !!u.seenBy }); return; }
  if (u.act.k === 'skill'){ resolveSkill(W, u); return; }
  if (u.act.k === 'throw'){ resolveThrow(W, u); return; }
  if (u.act.k === 'bash'){ resolveBash(W, u); return; }
  if (u.act.k === 'palm'){ resolvePalm(W, u); return; }   // v6.7
  if (u.act.k === 'spec'){ resolveSpec(W, u); return; }   // v7.19.1 고유 기술
  if (u.act.k === 'h2'){ resolveH2(W, u); return; }   /* v8.7.4 */
  if (u.act.k === 'assn'){ resolveAssn(W, u); return; }   // v7.6
  if (u.act.k === 'supp'){ resolveSupp(W, u); return; }   // v7.7 견제사격
  if (u.act.k === 'flare'){ resolveFlare(W, u); return; }   // v7.8 횃불 · 장작 던지기
  const A = u.act, t = W.units[A.b], R = W.rules;
  if (A.phase === 'wind'){
    // v5.3 근접은 몸이 상대 쪽 (±faceArc) 을 봐야 들어감 — 못 돌았으면 0.6초까지 기다림 (무거운 몸은 늦게 돎)
    if (A.k === 'atk' && !isFar(u) && t.alive && angDiff(u.face, Math.atan2(t.y - u.y, t.x - u.x)) > rv(W, 'faceArc', 70) * Math.PI / 180){ if (A.lateT == null) A.lateT = W.t; if (W.t - A.lateT < 0.6){ A.end = W.t + 0.03; return; } }
    // v5.2 넓게 휘두르기: 노린 상대가 비켜서도 부채꼴 안의 모두 (동료도) 를 침
    if (A.k === 'atk' && A.mode === 'sweep'){ heavyHit(W, u, t, 'sweep'); A.phase = 'rec'; A.end = W.t + u.rec; A.t1 = W.t; return; }
    if (A.k === 'atk' && A.fl && t.alive && flailOf(W, u) && !ordFire(u, t) && !cornered(W, u) && flLane(W, u, t)){ A.phase = 'rec'; A.end = W.t + 0.15; A.t1 = W.t; setMood(W, u, '동료가 철퇴 길에 들어옴 — 멈춤', t.i); L(W, { k: 'hold', a: u.i, b: t.i, by: (W.units.find(o => o.alive && o !== u && o.side === u.side && segD(u, t.x, t.y, o) < o.r + 0.5) || t).i, flail: true, vis: u.side === 0 || !!u.seenBy }); return; }   /* v8.7.3 던지는 순간에도 사선을 봄 */
    if (A.k === 'atk' && A.fl && t.alive && flailOf(W, u)){ throwFlail(W, u, t); A.phase = 'rec'; A.end = W.t + ((flailOf(W, u) || {}).trec || 0.3); A.t1 = W.t; return; }   /* v7.24.1 철퇴를 던짐 · v7.25.0 짧은 후속 동작 뒤엔 움직임 (공은 걸으며 감아 들임 — 돌아오기 전엔 다시 못 던짐) */
    const far = isFar(u);
    let why = '';
    if (!t.alive) why = '대상이 이미 쓰러짐';
    else if (gap(u, t) > (!far && flailOf(W, u) ? (flailOf(W, u).sw || 1.3) : u.rng) + (far ? 0.5 : R.reach) && !(!far && A.k === 'atk' && ratWallReach(W, u, t))) why = far ? '사거리 밖으로 벗어남' : W.t - t.dodgedT < 0.5 ? '몸을 빼 피함' : manDodge(W, t) ? (manNote(W, t, u), `직접 움직여 피함 (노린 회피 · ${gap(u, t).toFixed(1)}칸)`) : `손이 안 닿음 (${gap(u, t).toFixed(1)}칸 떨어짐)`;   // v6.7.1
    else if (far && !losClear(W.map, u.x, u.y, t.x, t.y)) why = '바위에 가림';
    else if (A.k === 'atk' && !canSee(W, u, t)) why = '보이지 않음';
    else if (A.k === 'atk' && !far && angDiff(u.face, Math.atan2(t.y - u.y, t.x - u.x)) > rv(W, 'faceArc', 70) * Math.PI / 180) why = '몸을 돌리지 못함';
    else if (A.k === 'atk' && u.blind && W.rand() < ((R.maim || {}).blindMiss != null ? R.maim.blindMiss : 0.35)) why = '눈이 멀어 헛침';   // v5.5
    if (why){ u.miss++; const man = /노린 회피/.test(why), stp = !far && t.stepT != null && W.t - t.stepT < 0.6 && /몸을 빼|몸을 돌리지/.test(why); if (stp){ const ST = R.step || {}; u.openT = W.t + (ST.open || 0.8); A.whiff = true; why = (t.act && t.act.step === 'side' ? '사이드 스텝' : '백스텝') + '에 헛침 — 빈틈'; }   /* v7.17 */
      L(W, { k: 'miss', a: u.i, b: t.i, why, man, whiff: stp || null }); if (far && (why === '바위에 가림' || why === '보이지 않음')) missSpot(W, u, t, why);   /* v8.7.4 J24 */ if (stp && u.cz) stun(W, u, 0.45, t.i);   /* v7.23.2 세자르의 헛침 빈틈 */ if (W.fxOn && !man) W.fx.push({ k: 'num', x: t.x, y: t.y, s: stp ? '헛침!' : '빗나감', c: 'm', t0: W.t }); }
    else if (A.k === 'heal'){
      const amt = Math.min(t.max - t.hp, Math.max(1, Math.round(u.atk * R.healMul)));
      t.hp += amt; u.healed += amt; if (t === u) u.healedSelf = (u.healedSelf || 0) + amt; const stanch = !!t.bleed; t.bleed = null;   // v5.5 지혈
      L(W, { k: 'heal', a: u.i, b: t.i, amt: Math.round(amt * 10) / 10, hp: Math.round(t.hp), stanch });   /* v8.7.3 소수 한 자리 */
      if (W.fxOn){ W.fx.push({ k: 'shot', a: u.i, b: t.i, t0: W.t, dur: 0.2, heal: true }); W.fx.push({ k: 'num', x: t.x, y: t.y, s: '+' + amt, c: 'h', t0: W.t }); }
    } else if (far && !ordFire(u, t) && (A.arc ? holdArc(W, u, t) : holdFire(W, u, t, false))){ A.phase = 'rec'; A.end = W.t + 0.15; A.t1 = W.t; return; }   // v5.8.4 곡사는 떨어질 자리 둘레를 봄   // v5.5.1 명령이면 멈추지 않음
    else if (far){
      // 쏨: 이 순간 대상이 있는 쪽으로 탄이 날아감 (따라가지 않음). 길에 먼저 닿는 몸이 맞음 — 다른 적 · 아군 (오사) 도
      // v5.1 점사 (소총): 보통 burst 발, burstP 확률로 burstMax 발 ("드르르륵!") — burstGap 초 간격, 한 발 피해 ×burstMul, 갈수록 조금씩 흩어짐
      const wp = (R.weapons && R.weapons[u.weapon]) || {};
      let n = 1;
      if (wp.burst && !u.alien){ n = W.rand() < (wp.burstP || 0) ? wp.burstMax || wp.burst : wp.burst; n = Math.max(1, Math.min(n, u.magMax ? u.mag : u.ammo != null ? u.ammo : n)); }
      fire(W, u);
      const SS = (R.sshot || {})[A.sm] || {}, mvA = u.strafe && W.t < u.strafe.until ? mvAim(W, u) : 1;   /* v7.17 이동 사격 명중 = 사격 등급별 */   // v7.0 쏘기 방식 · 이동 사격
      launch(W, u, t, n > 1 ? wp.burstMul || 0.65 : 1, (SS.aim || 1) * mvA, A.arc, SS.pm || 1);
      if (n > 1){ u.burst = { b: t.i, left: n - 1, gap: wp.burstGap || 0.09, next: W.t + (wp.burstGap || 0.09), mul: wp.burstMul || 0.65, k: 1 }; if (n >= (wp.burstMax || 6)) L(W, { k: 'burst', a: u.i, b: t.i, n, vis: u.side === 0 || !!u.seenBy }); }
      if (u.ammo === 0) outOfAmmo(W, u);
    } else {
      if (W.fxOn) W.fx.push({ k: 'slash', a: u.i, b: t.i, t0: W.t });
      // 어둠 속 근접: 야시 · 후각 없이 빛 없는 칸의 상대는 거의 못 맞힘
      const blind0 = blindTo(W, u, t), dp = blind0 ? Math.max(R.darkAim != null ? R.darkAim : 0.25, gap(u, t) < 0.45 ? 0.6 : 0) : !litAt(W, t.x, t.y) && R.darkHit ? (R.darkHit.melee || 0.96) : 1;   // v7.9.3 몸이 닿는 거리면 어둠에서도 어느 정도 맞춤 · v7.5 어둠 속은 보여도 살짝 헛침 · v8.7.3 식 가운데 주석이 뒤를 잘라 (첫 1초 명중 = 시각) 바로잡음
      u.revealT = W.t;   // v7.5 치면 드러남
      if (dp < 1 && W.rand() >= dp){ u.miss++; L(W, { k: 'miss', a: u.i, b: t.i, why: `어둠 속에서 헛침 (명중률 ${Math.round(dp * 100)}%)`, dark: true, nv: !!u.nv, torch: !!u.torch && !u.torchOff, lit: !!litAt(W, t.x, t.y), d: +gap(u, t).toFixed(2) }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '빗나감', c: 'm', t0: W.t }); }
      else if (!evadeMelee(W, t, u)){ if (A.mode) heavyHit(W, u, t, A.mode); else { const wr = ratWallHit(W, u, t), so = strike(W, u, wr || t, t, dp); if (u.cz) czHit(W, u, t, so); if (u.cleave) prnCleave(W, u, wr || t); }   /* v8.7.8 방벽 쥐가 대신 맞음 · 대검 베기 */ }   // v6.7 회피 (몸을 비틀어 흘림)
    }
    A.phase = 'rec'; A.end = W.t + u.rec * (far ? (A.sm === 'rapid' ? ((R.sshot || {}).rapid || {}).rec || 0.7 : 1) : wpnSpd(W, u)) + (A.whiff ? (R.step || {}).recAdd || 0.3 : 0); A.t1 = W.t;   // v7.17 헛치면 더 늦게 거둠   // v6.7 단검은 빨리 거둠   // v7.0 속사는 빨리 다음 화살
    if (u.burst) A.end = Math.max(A.end, u.burst.next + (u.burst.left - 1) * u.burst.gap + 0.05);   // 점사가 끝날 때까지
    return;
  }
  u.act = null;   // 회복 끝
}
// 투사체: 명중률만큼 대상 몸 안쪽을, 아니면 몸 옆 (0.12~0.67칸 비켜) 을 겨눔. 사거리 + 2.5칸까지 날아감
function launch(W, u, t, mul, pMul, arc, pm){
  if (arc){ launchArc(W, u, t, mul, pMul, pm); return; }   // v5.8.4 곡사
  const wp = (W.rules.weapons && W.rules.weapons[u.weapon]) || {};
  const d = Math.max(0.3, dist(u, t)), p = aimP(W, u, t) * (pMul || 1), ld = AI6.includes('nolead') ? 0 : Math.min(1, 0.6 + (u.marks || 0)) * d / (wp.vel || 40), base = Math.atan2(t.y + (t.vy || 0) * ld - u.y, t.x + (t.vx || 0) * ld - u.x);   // v6.6 움직이는 표적은 날아가는 동안 갈 자리를 겨눔 (솜씨가 좋을수록 정확히)
  const good = W.rand() < p, off = good ? (W.rand() * 2 - 1) * t.r * 0.55 : (W.rand() < 0.5 ? -1 : 1) * (t.r + 0.12 + W.rand() * 0.55);   // v6.6 good = 겨눔은 맞음 (그래도 상대가 움직이면 비켜 갈 수 있음)
  const ang = base + Math.atan2(off, d), dx = Math.cos(ang), dy = Math.sin(ang);
  let cov = null; if (!good && terrOn(W)){ const inf = {}, e = expoOf(W, u, t, inf), T = TER(W), c0 = T.cov0 != null ? T.cov0 : 0.2, c = e <= 0 ? 0.05 : c0 + (1 - c0) * e; if (e < 1 && inf.k != null){ const p0 = Math.min(0.99, p / Math.max(0.05, c)); if (W.rand() < p0 * (1 - c) / Math.max(0.01, 1 - p)) cov = { d: inf.k * d, pile: inf.pile || 0 }; } }   // v7.18 엄폐에 막힘
  if (wp.cone && !(u.weaponNow && u.weaponNow !== u.weapon)){ const C = wp.cone, n = C.n || 5, sp = C.ang || 0.32;   /* v8.7.3 산탄 부채꼴 */
    for (let k = 0; k < n; k++){ const a2 = ang + (n > 1 ? (k / (n - 1) - 0.5) * sp : 0) + (W.rand() - 0.5) * sp * 0.12, ddx = Math.cos(a2), ddy = Math.sin(a2); W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + ddx * (u.r + 0.02), y: u.y + ddy * (u.r + 0.02), x0: u.x, y0: u.y, dx: ddx, dy: ddy, sp: wp.vel || 40, left: u.rng + u.r + 1.0, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: (mul || 1) * (C.mul || 0.32), pm: pm || 1, gun: true, cov: k === (n >> 1) ? cov : null, wn: u.weapon, pel: k + 1 }); }
    return; }
  W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: wp.vel || 40, left: u.rng + u.r + 2.5, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1, gun: wp.kind === '총포류', cov, wn: u.weapon });
}
// v5.8.4 곡사 (활): 높이 쏘아 올려 앞의 몸 (동료 · 방패 벽 · 큰 몸) 을 넘겨 떨굼. 쏜 순간 상대가 있던 자리로 떨어짐 (따라가지 않음 — 움직이면 피함).
// 맞힐 확률 = 직사 × arc.aim. 빗나가면 둘레 (몸 + 0.1 ~ + miss × (0.4 + 0.6 × 거리/사거리)) 에 떨어져, 그 자리의 몸 (아군도) 에 맞음. 날아가는 시간 = 거리 / (화살 속력 × arc.vel)
const arcSpread = (W, u, d) => ((W.rules.arc || {}).miss != null ? W.rules.arc.miss : 1) * (0.4 + 0.6 * Math.min(1, d / Math.max(1, u.rng)));
const arcAim = (W, u, t) => aimP(W, u, t, true) * ((W.rules.arc || {}).aim != null ? W.rules.arc.aim : 0.7);
function launchArc(W, u, t, mul, pMul, pm){
  const A = W.rules.arc || {}, wp = (W.rules.weapons || {})[u.weapon] || {}, d = Math.max(0.3, dist(u, t)), p = Math.max(0.02, Math.min(0.99, arcAim(W, u, t) * (pMul || 1)));
  const a = W.rand() * 2 * Math.PI, good = W.rand() < p, rr = good ? Math.sqrt(W.rand()) * t.r * 0.5 : t.r + 0.1 + W.rand() * arcSpread(W, u, d);
  const T0 = Math.max(0.1, d / Math.max(1, (wp.vel || 16) * (A.vel || 0.55))), ld = AI6.includes('nolead') ? 0 : Math.min(1, 0.6 + (u.marks || 0)) * T0;   // v6.6 곡사도 떨어질 때의 자리를 겨눔
  const lx = t.x + (t.vx || 0) * ld + Math.cos(a) * rr, ly = t.y + (t.vy || 0) * ld + Math.sin(a) * rr, ll = Math.hypot(lx - u.x, ly - u.y) || 1, T = Math.max(0.1, ll / Math.max(1, (wp.vel || 16) * (A.vel || 0.55)));
  W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x, y: u.y, x0: u.x, y0: u.y, dx: (lx - u.x) / ll, dy: (ly - u.y) / ll, lx, ly, T, el: 0, q: 0, arc: true, sp: 0, left: 0, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1 });
}
// 떨어진 자리: 그 자리를 덮는 몸 (가장 가까운) 이 맞음 — 없으면 빈 바닥
function landArc(W, s){
  const u = W.units[s.a], A = W.rules.arc || {};
  let hit = null;
  for (const b of W.units) if (b.alive && b.side !== s.side && Math.hypot(b.x - s.lx, b.y - s.ly) < b.r + 0.8) lieFire(W, b, s);   // v7.12 곁에 떨어짐도 겪음
  for (;;){ let hd = 1e9; hit = null;
    for (const b of W.units){ if (!b.alive || b.i === s.a || (s.ev && s.ev.includes(b.i))) continue; const d = Math.hypot(b.x - s.lx, b.y - s.ly), br = b.lie && !b.lieSw ? b.r * ((W.rules.lie || {}).arcR || 1) : b.r; if (d <= br + 0.04 && d < hd){ hd = d; hit = b; } }   // v7.12 엎드린 몸은 위에서 넓음
    if (!hit || !evadeShot(W, hit, s)) break; }   // v6.7 떨어지는 화살 · 창을 보고 비켜섬
  if (s.supp){   // v7.12 곡사 면 제압: 빈 바닥이면 둘레를 움찔 · 날아온 쪽을 앎. 맞으면 든 방패도 못 막음 (머리 위)
    if (!hit){ for (const b of W.units) if (b.alive && b.side !== s.side && Math.hypot(b.x - s.lx, b.y - s.ly) < b.r + ((SUP(W) || {}).near || 0.6)){ b.pinT = Math.max(b.pinT || 0, W.t + ((SUP(W) || {}).pin || 0.6)); incoming(W, b, s); } return; }
    if (hit.side !== s.side){ incoming(W, hit, s); if (s.so) s.so.hits = (s.so.hits || 0) + 1; }
    const o3 = strike(W, u, hit, hit, 0.9, true, { arc: true, over: true, mul: (A.mul != null ? A.mul : 0.85) });
    if (W.fxOn) W.fx.push({ k: 'stuck', b: hit.i, ang: Math.atan2(s.dy, s.dx), blk: !!(o3 && o3.block), top: true, t0: W.t, dur: 1.4 });
    return;
  }
  if (!hit){ u.miss++; const m = W.units[s.meant], man = !!s.good && manDodge(W, m); L(W, { k: 'miss', a: s.a, b: s.meant, why: `곡사 — 빈 바닥에 꽂힘 (명중률 ${Math.round(s.p * 100)}%)${man ? ' · 직접 움직여 피함 (노린 회피)' : s.good ? ' · 겨눔은 맞았으나 상대가 움직임' : ''}`, fired: true, p: s.p, arc: true, good: !!s.good, jav: !!s.jav, man }); if (man) manNote(W, m, u); else if (W.fxOn) W.fx.push({ k: 'num', x: s.lx, y: s.ly, s: '빗나감', c: 'm', t0: W.t }); if (s.jav) dropSpear(W, s, s.lx, s.ly, 'miss'); return; }
  const J = s.jav ? (s.kn ? KNIFE(W) : JV(W)) : null;
  const o2 = strike(W, u, hit, W.units[s.meant], hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true, { arc: true, jav: !!s.jav, kn: !!s.kn, pm: s.pm || 1, mul: J ? (J.arc && J.arc.mul != null ? J.arc.mul : 0.95) : (A.mul != null ? A.mul : 0.85) * (s.mul || 1) });
  if (s.jav){ if (o2 && o2.block) dropSpear(W, s, hit.x - s.dx * 0.6, hit.y - s.dy * 0.6, 'block'); else dropSpear(W, s, hit.x + (W.rand() - 0.5) * 0.6, hit.y + (W.rand() - 0.5) * 0.6, 'stuck'); }   // v6.7 곡사 투창
  else if (W.fxOn) W.fx.push({ k: 'stuck', b: hit.i, ang: Math.atan2(s.dy, s.dx), blk: !!(o2 && o2.block), top: true, t0: W.t, dur: 1.4 });   // v7.2 곡사 화살도 꽂힘
}
// 곡사로 쏠 수 있나: 활 · 탄이 있음 · 최소 거리 ~ 사거리 · 바위에 안 가림 (굴 천장 아래라 바위 너머로는 못 넘김)
function arcOK(W, u, t){
  const A = W.rules.arc; if (!A || !u.lob || (u.weaponNow && u.weaponNow !== u.weapon) || !t || !t.alive || (u.ammo != null && u.ammo <= 0)) return false;
  const g = gap(u, t); return g >= (A.min != null ? A.min : 2) && g <= u.rng && losClear(W.map, u.x, u.y, t.x, t.y);
}
// 곡사의 오사 확률: 빗나간 화살이 떨어지는 둘레에 서 있는 동료 (잠깐 뒤 자리까지)
function arcRisk(W, u, t, lead, ov){   // v6.7 ov = 곡사 투창 (명중 · 둘레 · 날아가는 시간)
  const p = ov ? ov.p : arcAim(W, u, t), sp = ov ? ov.sp : arcSpread(W, u, Math.max(0.3, dist(u, t))), R0 = t.r + 0.1;
  // v6.0 떨어질 때의 동료 자리: 남은 준비 + 날아가는 시간 뒤 (움직이는 · 돌진하는 동료는 그 앞, 1.6초까지). 예전엔 0.3초 앞만 봄
  const A = W.rules.arc || {}, wp = (W.rules.weapons || {})[u.weapon] || {}, fly = ov ? ov.fly : Math.max(0.25, dist(u, t) / Math.max(1, (wp.vel || 16) * (A.vel || 0.55)));
  const lk = Math.min(1.6, lead != null ? lead : (u.act && (u.act.k === 'atk' || u.act.k === 'throw') && u.act.phase === 'wind' ? Math.max(0, u.act.end - W.t) : ov ? ov.wind : u.wind || 0.5) + fly);
  const mates = W.units.filter(b => b.alive && b !== u && b.side === u.side && dist(b, t) < R0 + sp + b.r + 0.3 + Math.hypot(b.vx || 0, b.vy || 0) * lk);
  if (!mates.length) return { p: 0, who: null };
  let ff = 0, who = null, ww = 0; const cnt = {};
  for (let i = 0; i < 24; i++){ const a = i * Math.PI / 12, rr = R0 + sp * [0.2, 0.5, 0.85][i % 3], x = t.x + Math.cos(a) * rr, y = t.y + Math.sin(a) * rr;
    const b = mates.find(m => { const k = m.act && m.act.k === 'charge' && m.act.phase === 'run' ? lk : Math.min(lk, 0.9); return Math.hypot(m.x + (m.vx || 0) * k - x, m.y + (m.vy || 0) * k - y) <= m.r + 0.08 || Math.hypot(m.x - x, m.y - y) <= m.r + 0.08; });
    if (b){ ff += (1 - p) / 24; cnt[b.i] = (cnt[b.i] || 0) + 1; if (cnt[b.i] > ww){ ww = cnt[b.i]; who = b; } } }
  return { p: ff, who };
}
function startArc(W, u, t, why){
  startAct(W, u, t, why);
  if (u.act && u.act.k === 'atk'){ u.act.arc = true; const l = W.log[W.log.length - 1]; if (l && l.k === 'wind' && l.a === u.i) l.arc = true; }
}
function holdArc(W, u, t){
  const fly = Math.max(0.25, dist(u, t) / Math.max(1, (((W.rules.weapons || {})[u.weapon] || {}).vel || 16) * ((W.rules.arc || {}).vel || 0.55)));
  const f = arcRisk(W, u, t, fly); if (f.p <= (u.side === 1 && !isFar(t) && pHp(W, u.side, t) >= 0.3 ? 0.12 : 0.2)) return false;   // v6.0 적 궁수: 쏠 이유 (사수 · 다 죽어 감) 가 없으면 더 아낌
  L(W, { k: 'hold', a: u.i, b: t.i, by: f.who.i, arc: true, vis: u.side === 0 || !!u.seenBy }); u.ffWait = (u.ffWait || 0) + 0.3; return true;
}
// 점사의 다음 발들 (회복 중에 이어서): 대상이 쓰러지거나 탄이 떨어지거나 사선이 막히면 멈춤
function tickBurst(W, u){
  const B = u.burst, t = W.units[B.b];
  while (u.burst && W.t >= B.next){
    if (!t.alive || (u.ammo != null && u.ammo <= 0) || (u.magMax && u.mag <= 0) || !losClear(W.map, u.x, u.y, t.x, t.y)){ u.burst = null; break; }
    // v5.4.1 점사 도중 동료가 사선에 들어오면 (먼저 걸리는 몸 · 오사 확률 20% 넘음) 남은 발은 쏘지 않음
    const fb = firstOnLine(W, u, t, u, knows(W, u));
    if (!ordFire(u, t) && ((fb !== t && fb.side === u.side) || ffOdds(W, u, t, u.x, u.y, -0.4).p > 0.1)){   /* v8.7.3 0.2 → 0.1 */ L(W, { k: 'hold', a: u.i, b: t.i, by: fb !== t ? fb.i : (ffOdds(W, u, t, u.x, u.y, -0.4).who || t).i, burst: true, vis: u.side === 0 || !!u.seenBy }); u.burst = null; break; }   // v5.5.1 명령이면 이어 쏨
    fire(W, u); launch(W, u, t, B.mul, Math.max(0.5, 1 - 0.1 * B.k * (1 - 0.7 * (u.marks || 0)))); B.k++; B.left--; B.next += B.gap;
    if (u.ammo === 0) outOfAmmo(W, u);
    if (B.left <= 0) u.burst = null;
  }
}
// 재장전: 탄창이 비면 (또는 싸움이 없을 때 반 넘게 비었으면) — reload 초 동안 못 쏘고 못 움직임 (틈)
function startReload(W, u){
  const wp = (W.rules.weapons && W.rules.weapons[u.weapon]) || {};
  u.act = { k: 'reload', phase: 'wind', t0: W.t, end: W.t + (wp.reload || 2) * (u.alien ? (W.rules.alien || {}).reload || 1.5 : 1), why: '재장전' };   // v7.0 낯선 무기는 더디게
  stop(u); setMood(W, u, '재장전');
  L(W, { k: 'reload', a: u.i, mag: u.mag, ammo: u.ammo, vis: u.side === 0 || !!u.seenBy });
}
const needReload = u => u.magMax && u.mag <= 0 && u.ammo > 0;
/* ---------- v4.7 [공통스킬:투창] ---------- */
const JV = W => W.rules.javelin || { wind: 0.7, vel: 18, rng: 6, aimNear: 0.97, aimFar: 0.75, mul: 2.2, crit: 0.35, critMul: 1.8, post: 2 };
const KNIFE = W => W.rules.knife || { wind: 0.25, vel: 26, rng: 5, aimNear: 0.95, aimFar: 0.62, mul: 0.8, crit: 0.2, critMul: 1.5, post: 0.5, pen: 0.45, penK: 0.6, jit: 0.25 };
const isKnife = (W, u) => !!(((W.rules.weapons || {})[u.weapon] || {}).thr);   // v6.7 던지는 단검 — 투창과 같은 길 (조준 → 던짐 → 맨손 → 주움), 수치만 knife
const JVu = (W, u) => isKnife(W, u) ? KNIFE(W) : JV(W);
const wpnSpd = (W, u) => (((W.rules.weapons || {})[u.weaponNow || u.weapon] || {}).spdW || 1) * (u.wForeign ? ((W.rules.inv || {}).foreign || {}).wind || 1.06 : 1);   // v7.20 남의 무기는 살짝 더딤   // v6.7 단검은 빠름 (근접 준비 · 회복 ×)
function aimJ(W, u, t){
  const J = JVu(W, u), f = Math.min(1, Math.max(0, gap(u, t)) / J.rng);
  let p = (J.aimNear + (J.aimFar - J.aimNear) * f) * (u.javK || 1);   /* v8.7.8 투창 솜씨 (쥐 베테랑 — 투창 좋음) */
  if (Math.hypot(t.vx, t.vy) > 0.6) p *= 0.85;
  if (blindTo(W, u, t)) p *= W.rules.darkAimFar != null ? W.rules.darkAimFar : 0.1;
  if (t.lie && !t.lieSw && W.rules.lie && dist(u, t) > (W.rules.lie.near || 1.8)) p *= W.rules.lie.hitArc || 0.85;   // v7.11 엎드린 몸 (던진 것은 떨어지며 맞음)
  p *= u.aimMaim || 1;   // v5.5 눈 · 팔을 잃음
  if (terrOn(W)) p *= terrAim(W, u, t, false);   // v7.18 엄폐 · 고저
  return Math.max(0.02, Math.min(0.99, p));
}
function startThrow(W, u, t, why, ord){
  if (u.lie) return false;   // v7.11 엎드린 채 스스로 던지지 않음 (명령이면 먼저 일어남)
  const J = JVu(W, u);
  const nm = isKnife(W, u) ? '투척' : '투창';   // v6.7 단검은 투척
  u.act = { k: 'throw', b: t.i, phase: 'wind', t0: W.t, end: W.t + J.wind, why: why || nm, sx: t.x, sy: t.y, saw: canSee(W, u, t), ord: !!ord };   // v5.4.3 겨눈 자리 (sx, sy) · v5.5.1 명령 (오사 감수)
  const ffr = ord ? ffOdds(W, u, t, u.x, u.y, 0, true).p : 0;
  u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u); u.waitT = 0;
  setMood(W, u, nm, t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, jav: true, kn: isKnife(W, u), w: u.weapon || '', end: +(W.t + J.wind).toFixed(2), hid: u.side === 1 && !u.seenBy, why: why || '', ffRisk: ffr > 0.03 ? +ffr.toFixed(2) : null });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: J.wind });
}
function resolveThrow(W, u){
  const A = u.act, t = W.units[A.b], J = JVu(W, u);
  if (A.phase !== 'wind'){ u.act = null; return; }
  let why = '';
  if (!t.alive) why = '대상이 이미 쓰러짐'; else if (gap(u, t) > J.rng + 0.5) why = '사거리 밖으로 벗어남'; else if (!canSee(W, u, t) && !fresh(W, u.sense[t.i], 0.8) && !(A.saw && Math.hypot(t.x - A.sx, t.y - A.sy) < 1.2)) why = '보이지 않음';   // v5.4.3 방금 본 상대 · 겨눌 때 보았고 그 자리에서 1.2칸 안이면 던짐 (빛 가장자리에서 깜빡여도)
  const way = why ? null : javWay(W, u, t, u.x, u.y);   // v6.7 던지는 순간 다시 봄: 앞이 막혔으면 곡사, 틈이 열렸으면 직사
  if (why) L(W, { k: 'miss', a: u.i, b: t.i, why: why + (isKnife(W, u) ? ' (단검은 그대로)' : ' (창은 그대로)') });
  else if (!(A.ord && ordFire(u, t)) && (way.arc ? javArcHold(W, u, t) : holdFire(W, u, t, true))){ A.phase = 'rec'; A.end = W.t + 0.15; A.t1 = W.t; return; }   // v5.5.1 명령 투창은 멈추지 않음
  else if (way.arc){
    const p = Math.max(0.02, aimJ(W, u, t) * (J.arc.aim != null ? J.arc.aim : 0.75));
    launchJavArc(W, u, t, p);
    u.shots++; u.spearHeld = false; u.rngSpear = u.rng; javAfter(W, u);
    L(W, { k: 'throw', a: u.i, b: t.i, p: +p.toFixed(2), arc: true, over: way.blk.i, kn: isKnife(W, u), vis: u.side === 0 || !!u.seenBy });
  }
  else {
    const d = Math.max(0.3, dist(u, t)), p = aimJ(W, u, t), base = Math.atan2(t.y - u.y, t.x - u.x);
    const off = W.rand() < p ? (W.rand() * 2 - 1) * t.r * 0.5 : (W.rand() < 0.5 ? -1 : 1) * (t.r + 0.12 + W.rand() * 0.5);
    const ang = base + Math.atan2(off, d), dx = Math.cos(ang), dy = Math.sin(ang);
    W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: J.vel, left: J.rng + u.r + 1.5, p: +p.toFixed(2), t0: W.t, side: u.side, jav: true, kn: isKnife(W, u), wpn: u.weapon });
    u.shots++; u.spearHeld = false; u.rngSpear = u.rng; javAfter(W, u);
    L(W, { k: 'throw', a: u.i, b: t.i, p: +p.toFixed(2), kn: isKnife(W, u), vis: u.side === 0 || !!u.seenBy });
  }
  A.phase = 'rec'; A.end = W.t + u.rec; A.t1 = W.t;
}
/* ---------- v5.6 줍기 · 회수 (창 · 검 · 방패 …) — 투구 · 갑옷은 나중에 (루팅) ---------- */
// 땅에 떨어진 것 W.items: { id, k: 'spear' (던진 창 — 주인이 다시 주움) | 'weapon' | 'shield', name, x, y, owner (원래 주인), t, ammo?, mag? }
// 떨어지는 때: 쓰러짐 (들고 있던 무기 · 방패) · 방패 팔을 잃음 (방패) · 두 팔을 잃음 (무기 · 방패) · 활 팔을 잃음 (활) · 다른 무기를 집어 듦 (들던 무기를 발밑에)
const ITEM_NATURAL = ['맨손', '이빨·발톱', '발'];
const unarmed = u => !u.weapon || ITEM_NATURAL.includes(u.weapon) || u.weaponNow === '맨손' || u.weaponNow === '발' || (u.jav && !u.spearHeld && !(u.javSide && u.weaponNow === u.javSide));   /* v8.7.8 투창 뒤 검 */
function dropItem(W, u, k, name, extra, how){
  const sd = k === 'shield' ? -1 : k === 'weapon' ? 1 : 0, fa = (u.face || 0) + Math.PI / 2;   // v5.10.0 방패는 왼쪽 · 무기는 오른쪽으로 0.35칸 — 한 자리에 겹쳐 떨어지지 않게
  const p = freeSpot(W, u.x + Math.cos(fa) * 0.35 * sd + (W.rand() - 0.5) * 0.3, u.y + Math.sin(fa) * 0.35 * sd + (W.rand() - 0.5) * 0.3, 0.15) || { x: u.x, y: u.y };
  const it = { id: (W.itemN = (W.itemN || 0) + 1), k, name, x: +p.x.toFixed(2), y: +p.y.toFixed(2), owner: u.i, t: W.t, how: how || '', own: ownKey(u), ...(extra || {}) };
  if (!it.label) it.label = lootName(u, k, name);   // v7.20 '검기사의 장검' · '창병의 방패'
  W.items.push(it);
  L(W, { k: 'drop', a: u.i, item: k, name, label: it.label, how: how || '', x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy });
  return it;
}
// 들고 있던 무기 (총 · 활은 남은 탄과 함께)
function dropHeld(W, u, how){
  if (u.weapon && !ITEM_NATURAL.includes(u.weapon) && ((W.rules.weapons || {})[u.weapon] || {}).kind !== '마법' && !(u.jav && !u.spearHeld) && !u.weaponGone) dropItem(W, u, 'weapon', u.weapon, heldItem(u), how);   // v7.20 내구도 · 이름 · 주인째
  u.weaponGone = true;
}
function dropShield(W, u, how){ if (u.armShield){ if (how === 'arm' || how === 'arms'){ u.shield = false; u.armShield = false; } return; }   // v5.9.8 팔 방패는 몸 — 쓰러져도 떨어지지 않고, 그 팔을 잃을 때만 못 씀
  if (u.shield){ dropItem(W, u, 'shield', '방패', { dur: u.sDur, label: u.sName || '', own: u.sOwn || ownKey(u) }, how); u.shield = false; if (u.alive) evoRole(W, u); } }   /* v8.7.4 I25 */
// 쓰러짐: 들고 있던 무기 · 방패를 떨어뜨림. 던져 둔 창은 이제 누구나 주울 수 있음
function dropOnDeath(W, t){
  if (t.ratOf != null){ W.items = W.items.filter(it => !(it.k === 'spear' && it.owner === t.i)); t.weaponGone = true; t.shield = false; return; }   /* v8.7.8 포렌의 쥐 */
  for (const it of W.items) if (it.k === 'spear' && it.owner === t.i) it.k = 'weapon';
  dropHeld(W, t, 'death'); dropShield(W, t, 'death');
}
// 집어 들 수 있나: 방패 = 왼팔이 있고 · 활 · 총 (두 손) 을 안 들었고 · 방패가 없을 때. 무기 = 팔이 하나라도 있을 때 (활은 두 팔이 다 있어야)
function canTake(W, u, it){
  if (!u.alive || u.noArms || !it) return false;
  if (it.k === 'shield') return (!u.shield || u.armShield) && !(u.arms && u.arms.L) && !(isFar(u) && isRangedW((W.rules.weapons || {})[u.weapon] || {}) && !u.pavise) && !(!u.weaponGone && ((W.rules.weapons || {})[u.weapon] || {}).two);   // v7.20 두 손 무기 (대검) 는 방패와 함께 못 듦
  const wp = (W.rules.weapons || {})[it.name]; if (!wp) return false;
  if (wp.kind === '활' && u.arms && (u.arms.L || u.arms.R)) return false;
  if (wp.req && !sizeOK(u, wp.req, (u.traits || []).some(x => /^근력/.test(x)))) return false;
  if (u.eqRule && u.eqRule.ranged === false && isRangedW(wp)) return false;   // v7.20 카리우스: 손이 기형이라 원거리 무기를 못 씀
  if (wp.two && u.shield && !u.armShield) return false;   /* v7.17 일반 근력의 중형은 궁수의 활을 못 당김 */
  return true;
}
// v7.0 낯선 무기: 주운 원거리 무기를 다룰 줄 아나 — 처음 든 무기와 같은 종류 (총포류 · 활) 거나 [사격X] 특성. 모르면 조준 × · 준비 × · 점사 못 함 · 재장전 ×
// v7.1 조준 시간 (들고 쏘기까지) = 사격 등급 (S · A 는 들자마자 쏨 · 베테랑 ×vet) + 무기의 draw (활은 시위) × 익숙함 (제 무기 ×1 · 솜씨는 있으나 다른 종류 × skill · 낯선 무기 × wind). 쏜 뒤 회복 (연사 간격) 은 그대로
const famMul = (W, u) => { const A = W.rules.alien || {}; return u.alien ? A.wind || 1.4 : u.fam2 ? A.skill || 1.15 : 1; };
function aimT(W, u){ const G = W.rules.aimG; if (!G) return u.wind; const m = u.mk0 || 0, g = m >= 0.69 ? G.S : m >= 0.54 ? G.A : m >= 0.39 ? G.B : m >= 0.24 ? G.C : G.none, wp = (W.rules.weapons || {})[u.weapon] || {};
  return (g * (u.vet ? G.vet || 1 : 1) + (wp.draw || 0)) * famMul(W, u); }
const wpnProf = (W, u, wp) => { const k0 = (((W.rules.weapons || {})[(u.kit0 && u.kit0.weapon) || ''] || {}).kind); return k0 === wp.kind || (u.mk0 || 0) > 0; };
// 무기를 바꿔 듦: 사거리 · 장창 · 투창 · 탄약 · 방어 자세 (대검) 를 그 무기에 맞춤
function setWeapon(W, u, name, it){
  const wp = (W.rules.weapons || {})[name] || { rng: 0.3, kind: '맨손' }, far = isRangedW(wp);
  u.weapon = name; u.weaponNow = null; u.weaponGone = false; u.rng = u.rng0 = u.rngSpear = far ? wp.rng : +(wp.rng + (u.reachX || 0)).toFixed(3);   /* v8.7.2 몸 리치 + 무기 */ u.longReach = !far && u.rng > 1;   /* v8.7.3 몸 리치를 더한 길이로 (호레이쇼가 도끼를 다시 쥐면 사수가 되던 것) */
  u.jav = !far && (/창$/.test(name) || !!wp.thr); u.spearHeld = true; u.loud = far && !!wp.loud; u.aim = far && wp.aim != null ? wp.aim : null; u.burst = null;   // v6.7 던지는 단검   // v7.0 고침: 주석에 삼켜져 주운 총의 총성 · 조준이 안 바뀌던 것
  u.alien = far && !wpnProf(W, u, wp);   // v7.0 낯선 무기
  u.fam2 = far && !u.alien && (((W.rules.weapons || {})[(u.kit0 && u.kit0.weapon) || ''] || {}).kind) !== wp.kind;   // v7.1 솜씨는 있으나 다른 종류 (살짝 느림)
  if (far){ u.ammo = it && it.ammo != null ? it.ammo : wp.ammo != null ? wp.ammo : null; u.ammoMax = u.ammo != null ? Math.max(u.ammo, wp.ammo || 0) : null; u.magMax = wp.mag && u.ammo != null ? wp.mag : null; u.mag = u.magMax ? Math.min(u.magMax, it && it.mag != null ? it.mag : u.ammo) : null; }
  else { u.ammo = null; u.ammoMax = null; u.mag = null; u.magMax = null; }
  if (wp.guard && !u.shield) u.canGuard = true;
}
// v8.7.4 역할 진화 (I25 — 청광묵이 방패와 검을 쓰기 시작하면 전열 쪽으로): 본디 미드필더 (role0) 가 방패 (팔 방패 아님) + 한 손 날붙이 · 둔기 (단검 · 창 · 사격 무기 아님) 를 함께 들면 전선 · 아니면 본디 역할
function evoRole(W, u){
  const base = u.role0 || u.role; if (base !== '미드필더') return; u.role0 = base;
  const wp = (W.rules.weapons || {})[u.weaponNow || u.weapon] || {}, arms = !u.weaponGone && !unarmed(u) && !isRangedW(wp) && !u.jav && (wp.rng || 0) >= 0.45 && (wp.kind === '날붙이' || wp.kind === '둔기');
  const want = u.shield && !u.armShield && arms ? '전선' : base;
  if (want !== u.role){ const was = u.role; u.role = want; L(W, { k: 'roleEvo', a: u.i, from: was, to: want, w: u.weaponNow || u.weapon, vis: u.side === 0 || !!u.seenBy }); }
}
function takeItem(W, u, it){
  W.items = W.items.filter(x => x !== it);
  if (it.k === 'spear' && it.owner === u.i && u.jav && !u.spearHeld){ u.spearHeld = true; u.rng = u.rngSpear || u.rng0; u.weaponNow = null; }   // 제 창
  else if (it.k === 'shield'){
    u.sDur = it.dur != null ? +it.dur : 100; u.sName = it.label || ''; u.sOwn = it.own || null;   // v7.20
    u.shield = true; u.armShield = false; u.shieldLost = false; u.canGuard = true; u.canBash = true; u.gArc = Math.round((W.rules.frontArc || 60) * (0.6 + 0.4 * (u.gTal != null ? u.gTal : 1))); u.post = Math.max(u.post || 0, 60); u.buckler = /버클러/.test(u.sName || ''); if (u.buckler) u.gArc = Math.round(u.gArc * ((W.rules.buckler || {}).arc || 40) / (W.rules.frontArc || 60));   /* v8.7.8 주운 방패가 버클러면 좁게 */
    if (u.canCharge) u.chargeName = '방패 돌진';
  } else {
    if (!unarmed(u) && u.weapon && !ITEM_NATURAL.includes(u.weapon)) stowOrDrop(W, u, heldItem(u));   // v7.20 들던 무기는 가방에 (자리가 없으면 발밑에)
    setWeapon(W, u, it.name, it); armWith(W, u, it);
  }
  L(W, { k: 'pickItem', a: u.i, item: it.k, name: it.name, label: it.label || '', own: it.owner === u.i, from: it.owner != null ? it.owner : null, x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy });
  evoRole(W, u);   /* v8.7.4 I25 */
}
// 그 물건을 주우러 가도 안전한가: 물건 둘레 1.8칸에 (아는) 상대가 없고, 가는 길이 상대 손 닿는 곳을 지나지 않음
function safeItem(W, u, it){
  const aw = f => (u.side === 0 ? f.seenBy : canSee(W, u, f)) || fresh(W, u.sense[f.i], 2) || dist(f, u) < 2.5;
  const vx = it.x - u.x, vy = it.y - u.y, L2 = vx * vx + vy * vy || 1;
  const seg = f => { const k = Math.max(0, Math.min(1, ((f.x - u.x) * vx + (f.y - u.y) * vy) / L2)); return Math.hypot(f.x - u.x - vx * k, f.y - u.y - vy * k); };
  return !W.units.some(f => f.alive && f.side !== u.side && aw(f) && (Math.hypot(f.x - it.x, f.y - it.y) - f.r < 1.8 || seg(f) - f.r - u.r < Math.max(f.rng, 0.3) + 0.6));
}
// 무기가 없으면 (던졌거나 · 떨어뜨렸거나) 안전할 때 가까운 (5칸 안) 무기를 주우러 감
function scavenge(W, u, dt){
  if (!unarmed(u) || u.noArms || u.crawl || u.gwKit) return false;   /* v8.7.8 굿윌은 맨손일 때 가장 셈 — 스스로 무기를 줍지 않음 */
  const it = W.items.filter(x => (x.k === 'weapon' || x.k === 'spear') && canTake(W, u, x) && mayWield(W, u, x) && Math.hypot(x.x - u.x, x.y - u.y) < 5 && safeItem(W, u, x)).sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y))[0];
  if (!it) return false;
  if (Math.hypot(it.x - u.x, it.y - u.y) <= 0.6){ takeItem(W, u, it); return true; }
  setMood(W, u, it.name + ' 주우러'); goTo(W, u, it.x, it.y, dt); return true;
}
// 땅에 떨어진 창: 바위 안이면 날아온 쪽으로 물려 놓음
function dropSpear(W, s, x, y, how){
  for (let k = 0; k < 8 && rock(W.map, x, y); k++){ x -= s.dx * 0.25; y -= s.dy * 0.25; }
  if (rock(W.map, x, y)){ x = s.x0; y = s.y0; }
  W.items.push({ id: (W.itemN = (W.itemN || 0) + 1), k: W.units[s.a] && W.units[s.a].alive ? 'spear' : 'weapon', x: +x.toFixed(2), y: +y.toFixed(2), owner: s.a, name: s.wpn || '창', t: W.t, how: 'thrown:' + (how || '') });   // v5.6 id · 주인이 쓰러졌으면 누구나
  L(W, { k: 'spearDrop', a: s.a, x: +x.toFixed(2), y: +y.toFixed(2), how, kn: !!s.kn, w: s.wpn || null });   /* v8.7.3 던진 단검은 창이 아님 */
}
const mySpear = (W, u) => W.items.find(it => it.k === 'spear' && it.owner === u.i);
function pickSpear(W, u, it){
  W.items = W.items.filter(x => x !== it); u.spearHeld = true; u.rng = u.rngSpear || u.rng0; u.weaponNow = null;
  L(W, { k: 'spearPick', a: u.i, x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy });
}
// 던진 창 줍기: 창 둘레 (1.8칸) 에 보이는 상대가 없으면 (안전하면) 주우러 감. 둘레가 위험하면 false
function retrieveSpear(W, u, dt, force){
  if (!u.jav || u.spearHeld) return false;
  const it = mySpear(W, u); if (!it) return false;
  if (!force){
    const aw = f => (u.side === 0 ? f.seenBy : canSee(W, u, f)) || fresh(W, u.sense[f.i], 2) || dist(f, u) < 2.5;
    const vx = it.x - u.x, vy = it.y - u.y, L2 = vx * vx + vy * vy || 1;
    const seg = f => { const k = Math.max(0, Math.min(1, ((f.x - u.x) * vx + (f.y - u.y) * vy) / L2)); return Math.hypot(f.x - u.x - vx * k, f.y - u.y - vy * k); };
    if (W.units.some(f => f.alive && f.side !== u.side && aw(f) && (Math.hypot(f.x - it.x, f.y - it.y) - f.r < 1.8 || seg(f) - f.r - u.r < Math.max(f.rng, 0.3) + 0.6))) return false;
  }
  if (Math.hypot(it.x - u.x, it.y - u.y) <= 0.6){ pickSpear(W, u, it); return true; }
  setMood(W, u, '창 주우러'); goTo(W, u, it.x, it.y, dt); return true;
}
// v6.7 투창 곡사: 사선 앞이 막히면 (상대의 방패 · 큰 몸 · 동료 · 상대가 이쪽으로 든 방패) 높이 던져 넘김. 방패 틈 (사선이 열림) 이면 직사.
// 너무 가까우면 (arc.min 칸 아래) · 단검이면 곡사 없음 (no) — 그때는 예전처럼 직사 판단
function javWay(W, u, t, x, y){
  const J = JVu(W, u), P0 = { x, y, r: u.r, side: u.side, i: u.i }, first = firstOnLine(W, P0, t, u, knows(W, u));
  let blk = null;
  if (first !== t){ if (first.side === u.side || blocksFor(W, first, P0)) blk = first; }
  else if (inGuard(W, t, P0, true)) blk = t;
  if (!blk) return { arc: false, blk: null, first };
  const g = Math.hypot(t.x - x, t.y - y) - u.r - t.r;
  if (!J.arc || AI6.includes('jarc') || g < (J.arc.min != null ? J.arc.min : 2)) return { arc: false, blk, first, no: true };
  return { arc: true, blk, first };
}
const javArcSpread = (W, u, d) => { const J = JVu(W, u), A = J.arc || {}; return (A.miss != null ? A.miss : 0.9) * (0.4 + 0.6 * Math.min(1, d / Math.max(1, J.rng))); };
function javArcRisk(W, u, t){ const J = JVu(W, u), A = J.arc || {}, d = Math.max(0.3, dist(u, t)); return arcRisk(W, u, t, null, { p: aimJ(W, u, t) * (A.aim != null ? A.aim : 0.75), sp: javArcSpread(W, u, d), fly: Math.max(0.3, d / Math.max(1, J.vel * (A.vel || 0.7))), wind: J.wind }); }
// 곡사 투창: 떨어질 때의 자리를 겨눔 (솜씨만큼). 빗나가면 둘레에 떨어져 그 자리의 몸 (동료도) 에 맞음
function launchJavArc(W, u, t, p){
  const J = JVu(W, u), A = J.arc || {}, d = Math.max(0.3, dist(u, t)), vA = Math.max(1, J.vel * (A.vel || 0.7));
  const a = W.rand() * 2 * Math.PI, good = W.rand() < p, rr = good ? Math.sqrt(W.rand()) * t.r * 0.5 : t.r + 0.1 + W.rand() * javArcSpread(W, u, d);
  const T0 = Math.max(0.15, d / vA), ld = AI6.includes('nolead') ? 0 : Math.min(1, 0.5 + (u.marks || 0)) * T0;
  const lx = t.x + (t.vx || 0) * ld + Math.cos(a) * rr, ly = t.y + (t.vy || 0) * ld + Math.sin(a) * rr, ll = Math.hypot(lx - u.x, ly - u.y) || 1, T = Math.max(0.3, ll / vA);
  W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x, y: u.y, x0: u.x, y0: u.y, dx: (lx - u.x) / ll, dy: (ly - u.y) / ll, lx, ly, T, el: 0, q: 0, arc: true, sp: 0, left: 0, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: 1, jav: true, kn: isKnife(W, u), wpn: u.weapon });
}
// 이 자리 (x, y) 에서 t 에게 던질 수 있나: 사거리 · 바위 · 사선 (아군 · 이쪽을 막는 방어 자세 없음) · 오사 위험. 확률 (없으면 0)
function javOdds(W, u, t, x, y, ordered){
  const J = JVu(W, u), P0 = { x, y, r: u.r, side: u.side, i: u.i }, g = Math.hypot(t.x - x, t.y - y) - u.r - t.r;
  if (g <= u.rng + 0.25 || g > J.rng || !losClear(W.map, x, y, t.x, t.y)) return 0;
  const w = javWay(W, u, t, x, y);   // v6.7 앞이 막혔으면 곡사 (방패 틈이 열려 있으면 직사)
  if (w.arc){ if (ordered !== true && javArcRisk(W, u, t).p > ffLim(u, W)) return 0; const ox = u.x, oy = u.y; u.x = x; u.y = y; const p = aimJ(W, u, t) * (J.arc.aim != null ? J.arc.aim : 0.75); u.x = ox; u.y = oy; return Math.max(0.02, p); }
  const first = w.first;
  if (first !== t && ((first.side === u.side && ordered !== true) || (first.side !== u.side && inGuard(W, first, P0, true)))) return 0;   // v5.7.1 ordered = true (연달아 준 급한 명령) 일 때만 동료 너머로 던짐 · 'calm' 이면 비켜서 찾음   // v5.5.1 명령이면 동료가 사선에 있어도 던짐 (오사 감수)
  if (first === t && inGuard(W, t, P0, true) && !ordered) return 0;   // 막는 방향으로는 안 던짐 (한 번뿐이니)
  if (ordered !== true && ffOdds(W, u, t, x, y, 0, true).p > ffLim(u, W)) return 0;   // v5.4.3 명령이어도 동료를 맞힐 확률이 0.2 넘으면 이 자리에선 안 던짐 (비켜서 찾음) · v4.9 오사 확률 (앞에 나서는 방패병 등 동료가 움직여 갈 자리까지)
  const ox = u.x, oy = u.y; u.x = x; u.y = y; const p = aimJ(W, u, t); u.x = ox; u.y = oy;
  return p;
}
// 던지기: 보이는 상대 중 사선이 열린 가장 좋은 상대 (명령이면 그 상대만). 기준 = 대담할수록 · 오래 기다릴수록 · 상대가 공격 중 · 고립이면 낮아짐
// 지금 자리에서 안 되면 옆으로 한두 걸음 (방패 옆) 비켜서 사선을 찾음
function tryThrow(W, u, t, ordered, dt){
  if (!u.jav || !u.spearHeld || u.act) return false;
  if (!ordered && !u.javAuto) return false;   // v5.4.3 아군 창 보병 (인주 등) 은 명령으로만 던짐 — 하나뿐인 무기를 스스로 던지지 않음
  const J = JVu(W, u), know = knows(W, u);
  const cands = ordered ? [t] : W.units.filter(f => f.alive && f.side !== u.side && know(f) && canSee(W, u, f) && !(u.side === 0 && roeBlock(W, u, f, 'fire')));   // v7.9 사격 금지 · 교전 금지면 던지지 않음
  let best = null, bs = 0, bestArc = false;
  for (const f of cands){
    const p = javOdds(W, u, f, u.x, u.y, ordered); if (!p) continue;
    // 한 번뿐이라 확실할 때만: 기준 0.92 − 대담함 × 0.25 (보통 근접 0.8 ≈ 4.5칸 안) · 오래 기다릴수록 · 공격 중 · 고립이면 낮아짐
    const th = ordered ? 0.15 : 0.92 - u.bold * 0.25 - u.waitT * 0.02 - (f.act ? 0.15 : 0) - (supportOf(W, f) === 0 ? 0.1 : 0);
    const sc = p - th + (pHp(W, u.side, f) < 0.4 ? 0.1 : 0);
    const worth = ordered || u.side !== 1 || isFar(f) || pHp(W, u.side, f) < 0.4 || (f.act && f.act.k !== 'atk') || supportOf(W, f) === 0 || W.units.filter(o => o.alive && o !== u && o.side === u.side && !isFar(o) && dist(o, f) < 2.5).length >= 2;   // v6.0 하나뿐인 창: 끝낼 만하거나 (사수 · 다 죽어 감 · 묶임) 되찾을 길 (고립된 상대 · 동료가 그 둘레를 쥠) 이 있을 때만
    if (!ordered && u.side === 1 && !AI6.includes('javx')){   // v6.4.1 하나뿐인 창: 곁에 나를 칠 놈이 있거나 · 붙어서 압박 중이거나 · 다쳤으면 확실히 끝낼 때만
      const near = W.units.find(x => x.alive && x.side !== u.side && !isFar(x) && !x.down && gap(u, x) < x.rng + 1.2), press = busyW(W, u), hurt = u.hp / u.max < 0.4;   /* v8.7.3 던질 대상 자신이 코앞이어도 아낌 */
      const fin = p >= 0.75 && pHp(W, 1, f) * iRec(W, 1, f).guess <= u.atk * (J.mul || 2.2) * (W.rules.lethal || 1) * 0.6;
      if ((near || press || hurt) && !fin){ if (W.t >= (u.javHoldT || 0)){ u.javHoldT = W.t + 5; L(W, { k: 'javHold', a: u.i, b: f.i, why: near === f ? '코앞이라 창을 쥐고 맞섬' : near ? (near.name + (jongE(near.name) ? '이' : '가') + ' 곁에 있음 — 가까운 위협 먼저') : press ? '붙어서 압박 중 — 긴 무기를 버리지 않음' : '다친 몸 — 무기를 지킴', vis: u.side === 0 || !!u.seenBy }); } continue; }
    }
    const arc = javWay(W, u, f, u.x, u.y).arc, thA = arc ? th - 0.12 : th;   // v6.7 곡사 (방패 너머) 는 명중이 낮은 만큼 기준도 조금 낮춤
    if (p >= thA && worth && sc + (arc ? 0.12 : 0) > bs){ bs = sc + (arc ? 0.12 : 0); best = f; bestArc = arc; }
  }
  if (best){ startThrow(W, u, best, (bestArc ? '방패 너머 곡사 · ' : '') + (ordered ? (isKnife(W, u) ? '투척' : '투창') : best.act ? '틈을 노림' : supportOf(W, best) === 0 ? '고립된 상대' : isKnife(W, u) ? '투척' : '투창'), ordered); return true; }
  // 옆으로 비켜 사선 찾기 (노리는 상대가 사거리 안일 때만)
  if (!dt || !t || gap(u, t) > J.rng + 0.5) return false;   // v5.4.3 명령이어도 사선을 찾아 비켜섬
  // v5.4.3 명령이면 내 둘레뿐 아니라 상대 둘레 (2.5 · 3.5 · 4.5칸 고리) 까지 돌아 들어가 사선을 찾음
  const sp = laneSpot(W, u, t, 'jav', ordered ? [2.5, 3.5, 4.5] : [], (x, y) => javOdds(W, u, t, x, y, ordered)); if (!sp) return false;
  u.waitT += dt; setMood(W, u, '사선 찾기', t.i); goTo(W, u, sp.x, sp.y, dt);
  return true;
}
// v5.4.3 명령을 받으면 길을 찾아 움직임: 내 둘레 (0.7 · 1.2 · 1.8칸) 와 상대 둘레 고리 (상대에서 ring 칸, 지금 방향 ±120°) 중
// ok(x, y) 값이 가장 높은 자리 (가까울수록 좋음). 바위 · 다른 인물 자리 · 상대 손 닿는 곳은 뺌. 0.6초마다 다시 찾음 (key 마다)
function laneSpot(W, u, t, key, ring, ok){
  const c = u.lane && u.lane.key === key && u.lane.b === t.i && W.t - u.lane.t < 0.6 ? u.lane : null; if (c) return c.p;
  const cand = [], b0 = Math.atan2(u.y - t.y, u.x - t.x);
  for (const r of [0.7, 1.2, 1.8]) for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4; cand.push({ x: u.x + Math.cos(a) * r, y: u.y + Math.sin(a) * r }); }
  for (const d of ring) for (let k = -4; k <= 4; k++){ const a = b0 + k * Math.PI / 6, rr = t.r + u.r + d; cand.push({ x: t.x + Math.cos(a) * rr, y: t.y + Math.sin(a) * rr }); }
  let best = null, bs = 0;
  for (const q of cand){
    if (boxRock(W, q.x, q.y, u.r * 0.9) || W.units.some(o => o.alive && o !== u && Math.hypot(o.x - q.x, o.y - q.y) < o.r + u.r)) continue;
    if (W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && Math.hypot(f.x - q.x, f.y - q.y) - f.r - u.r < f.rng + 0.5)) continue;   // 상대 손 닿는 곳은 피함
    const v = ok(q.x, q.y); if (!v) continue;
    const s = v - Math.hypot(q.x - u.x, q.y - u.y) * 0.05; if (s > bs){ bs = s; best = q; }
  }
  u.lane = { key, b: t.i, t: W.t, p: best };
  return best;
}
// v5.4.3 그 자리에서 돌진할 수 있는가: 상대까지 돌진 거리 (min + 0.2 ~ max − 0.3) · 바위가 안 막음 · 길에 동료 없음. 3칸 언저리일수록 좋음
function chargeLaneOk(W, u, t, x, y){
  const C = W.rules.charge || {}, g = Math.hypot(t.x - x, t.y - y) - u.r - t.r;
  if (g < (C.min || 1.5) + 0.2 || g > (C.max || 5) - 0.3 || !fatClear(W.map, x, y, t.x, t.y, u.r * 0.9)) return 0;
  const P = { x, y }; if (W.units.some(o => o.alive && o !== u && o !== t && o.side === u.side && segD(P, t.x, t.y, o) < o.r + u.r)) return 0;
  return 1 - Math.abs(g - 3) * 0.1;
}
function stepShots(W, dt){
  for (const s of W.shots){
    if (s.arc){ s.el += dt; s.q = Math.min(1, s.el / s.T); s.x = s.x0 + (s.lx - s.x0) * s.q; s.y = s.y0 + (s.ly - s.y0) * s.q; if (s.q >= 1){ s.done = true; if (!(W.wards && W.wards.length && wardStop(W, s, s.x0, s.y0, s.lx, s.ly, true))) landArc(W, s); if (W.fxOn) W.fx.push({ k: 'spark', x: s.lx, y: s.ly, t0: W.t, side: s.side }); } continue; }   // v5.8.4 곡사
    let rem = s.sp * dt;
    while (rem > 1e-6 && !s.done){
      const st = Math.min(0.15, rem, s.left); rem -= st;
      const nx = s.x + s.dx * st, ny = s.y + s.dy * st;
      if (W.wards && W.wards.length && wardStop(W, s, s.x, s.y, nx, ny)) break;   // v7.19.2 역장
      let hit = null, hk = 2, nearL = null; const NM = (SUP(W) || {}).near || 0.6;
      for (const b of W.units){
        if (!b.alive || b.i === s.a || (s.ev && s.ev.includes(b.i))) continue;   // v6.7 이미 피한 몸은 지나감
        const k = Math.max(0, Math.min(1, ((b.x - s.x) * s.dx + (b.y - s.y) * s.dy) / st)), dd = Math.hypot(b.x - (s.x + s.dx * st * k), b.y - (s.y + s.dy * st * k));
        const br = b.lie && !b.lieSw && W.rules.lie && Math.hypot(b.x - s.x0, b.y - s.y0) > (W.rules.lie.near || 1.8) ? b.r * (W.rules.lie.hitR || 0.6) : b.r;   // v7.11 엎드린 몸 위로 지나감
        if (dd <= br && k < hk && !(b.i !== s.meant && lieLow(b) && lieOver(W, s, b))){ hk = k; hit = b; }   // v7.14.1 노린 몸이 아닌 엎드린 몸은 거의 위로 넘어감 (스침은 그대로)
        else if (dd <= b.r + NM && b.side !== s.side && !(s.nm && s.nm.includes(b.i))) (nearL || (nearL = [])).push(b);   // v7.7 스침
      }
      if (nearL && !hit && SUP(W)) for (const b of nearL){ lieFire(W, b, s); (s.nm || (s.nm = [])).push(b.i); if (s.supp) b.pinT = Math.max(b.pinT || 0, W.t + (SUP(W).pin || 0.6)); incoming(W, b, s); }
      const u = W.units[s.a];
      if (hit && evadeShot(W, hit, s)){ rem += st; continue; }   // v6.7 회피 — 실제로 비켜섬 (탄은 그대로 날아감)
      if (hit){
        s.done = true; s.x += s.dx * st * hk; s.y += s.dy * st * hk;
        if (hit.side !== s.side){ lieFire(W, hit, s); incoming(W, hit, s); if (s.supp && s.so) s.so.hits = (s.so.hits || 0) + 1; }   // v7.7
        const NW = !s.jav && s.wn ? ((W.rules.weapons || {})[s.wn] || {}).near : null, near = !!NW && hit.side !== s.side && Math.hypot(hit.x - s.x0, hit.y - s.y0) - hit.r <= (NW.r || 1.8);   /* v7.25.1 샷건 산탄: 가까우면 크게 · 밀어냄 */
        const o2 = strike(W, u, hit, s.meant != null ? W.units[s.meant] : hit, hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true, s.jav ? { jav: true, kn: !!s.kn } : near ? { mul: (s.mul || 1) * (NW.mul || 2), pm: s.pm || 1, tag: '샷건 산탄 (코앞)' } : (s.mul && s.mul !== 1) || (s.pm && s.pm !== 1) ? { mul: s.mul || 1, pm: s.pm || 1 } : null);
        if (near && o2 && hit.alive && !hit.kb && !o2.block) shove(W, u, hit, NW.kb || 1, s.dx, s.dy, { tag: '샷건에 날아감', mass: (W.rules.shove || {}).proj || 80, fix: true });
        // 창: 막히면 앞으로 튕겨 떨어짐, 몸에 박히면 그 자리에 떨어짐
        if (s.jav){ if (o2 && o2.block) dropSpear(W, s, s.x - s.dx * 0.6, s.y - s.dy * 0.6, 'block'); else dropSpear(W, s, hit.x + (W.rand() - 0.5) * 0.6, hit.y + (W.rand() - 0.5) * 0.6, 'stuck'); }
        else if (!s.gun && W.fxOn) W.fx.push({ k: 'stuck', b: hit.i, ang: Math.atan2(s.dy, s.dx), blk: !!(o2 && o2.block), t0: W.t, dur: 1.4 });   // v7.2 화살이 몸 · 방패에 꽂힘
        break;
      }
      if (s.cov && Math.hypot(nx - s.x0, ny - s.y0) >= s.cov.d){ s.done = true; s.x = s.x0 + s.dx * s.cov.d; s.y = s.y0 + s.dy * s.cov.d; if (!s.supp){ u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: s.cov.pile ? (s.cov.pile === 2 ? '굳은 시체에 막힘 (엄폐)' : s.cov.pile === 3 ? '관에 막힘 (엄폐)' : s.cov.pile === 4 ? '쓰러진 기둥에 막힘 (엄폐)' : '갑옷 무더기에 막힘 (엄폐)') : '언덕 마루에 막힘', fired: true, p: s.p, cover: true }); } break; }   // v7.18
      if (solid(W.map, nx, ny)){ s.done = true; if (!s.supp){ u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: '빗나가 바위에 맞음', fired: true, p: s.p }); } if (s.jav) dropSpear(W, s, s.x - s.dx * 0.4, s.y - s.dy * 0.4, 'bounce'); break; }
      s.x = nx; s.y = ny; s.left -= st;
      if (s.left <= 1e-6 && s.supp){ s.done = true; break; }   // v7.7 견제 탄은 자리 너머에서 끝
      if (s.left <= 1e-6){ s.done = true; u.miss++; const m = W.units[s.meant], man = !!s.good && manDodge(W, m); L(W, { k: 'miss', a: s.a, b: s.meant, why: `빗나감 (명중률 ${Math.round(s.p * 100)}%)${man ? ' · 직접 움직여 피함 (노린 회피)' : s.good ? ' · 겨눔은 맞았으나 상대가 움직임' : ''}`, fired: true, p: s.p, good: !!s.good, man }); if (man) manNote(W, m, u); else if (W.fxOn) W.fx.push({ k: 'num', x: m.x, y: m.y, s: '빗나감', c: 'm', t0: W.t }); if (s.jav) dropSpear(W, s, s.x, s.y, 'miss'); }
    }
    if (s.done && W.fxOn) W.fx.push({ k: 'spark', x: s.x, y: s.y, t0: W.t, side: s.side });
  }
  if (W.fxOn) for (const s of W.shots) if (s.done && !s.arc && !s.fxd){ s.fxd = 1; W.fx.push({ k: 'tracer', x0: s.x0, y0: s.y0, x1: s.x, y1: s.y, t0: W.t, side: s.side, gun: !!s.gun, jav: !!s.jav, dur: s.gun ? 0.25 : s.jav ? 0.16 : 0.14 }); }   // v7.1 지나간 궤적
  if (W.shots.length) W.shots = W.shots.filter(s => !s.done);
}
// 탄약 · 총성: 쏜 자리에 '!' 이 noiseTime 동안 남음. 들은 쪽은 그 자리를 알 뿐, 쏜 쪽이 옮겨 가도 따라붙지 않음
function fire(W, u){
  u.shots++; u.lastFireT = W.t; u.inRangeT = 0; u.revealT = W.t;   // v7.5 쏘면 드러남   // v6.5 마지막으로 쏜 때
  if (u.ammo != null) u.ammo = Math.max(0, u.ammo - 1);
  if (u.magMax && u.mag > 0) u.mag--;
  if (u.lie) lieFlash(W, u);   // v7.11 엎드려 쏜 총의 화염
  if (!u.loud) return;
  if (W.rules.din) dinAdd(W, u.x, u.y, W.rules.din.gun);   // v7.3 총성은 전장 소음
  const n = { x: +u.x.toFixed(2), y: +u.y.toFixed(2), t0: W.t, side: u.side, a: u.i };
  W.noises.push(n);
  const heard = [];
  for (const o of W.units){
    if (!o.alive || o.side === u.side || dist(o, u) > W.rules.hear || canSee(W, o, u)) continue;
    o.heard = { x: n.x, y: n.y, t: W.t }; heard.push(o.i);
    if (o.side === 1 && o.state !== 'hunt'){ o.state = 'search'; o.last = { x: n.x, y: n.y }; o.searchT = 6; }
  }
  L(W, { k: 'noise', a: u.i, x: n.x, y: n.y, heard, vis: u.side === 0 || !!u.seenBy });
}
function outOfAmmo(W, u){
  const w = W.rules.weapons && W.rules.weapons['맨손'];
  u.rng = w ? w.rng : 0.3; u.loud = false; u.aim = null; u.weaponNow = '맨손';
  const at0 = ammoTOf(W, u.weapon); L(W, { k: 'ammoOut', a: u.i, w: u.weapon, bag: at0 ? (u.bag || []).filter(x => x.k === 'ammo' && x.at === at0).reduce((s, x) => s + (x.n || 0), 0) : 0, vis: u.side === 0 || !!u.seenBy });   /* v8.7.3 가방에 남은 탄 (맨손이 아님) */
}
// 맞힘: 방어 자세로 앞에서 받으면 막음 (피해 ×blockMul, 자세 깎임). 아니면 부위를 뽑아 피해 · 상처
// v7.0 사격S: 활을 쓰는 사격S 만 — 못 뚫을 갑옷 · 방패면 조준사격, 가깝거나 빨리 움직이면 속사
const sGrade = u => (u.marks || 0) >= 0.69 && /활/.test(u.weapon || '') && !u.weaponGone;
/* v7.17 이동 사격: 사수 · 궁수 누구나 — 명중 × 사격 등급 (S 거의 그대로 · A 어느 정도 · B 이하 떨어짐). 위협 (나를 겨누는 사수 · threat 칸 안의 근접) 이 있을 때 옆으로 걸으며 쏨 */
const mvAim = (W, u) => { const G = ((W.rules.sshot || {}).move || {}).aimG || {}, m = u.marks || 0; return m >= 0.69 ? G.S || 0.97 : m >= 0.54 ? G.A || 0.88 : m >= 0.39 ? G.B || 0.76 : m >= 0.24 ? G.C || 0.68 : G.none || 0.6; };
const strafeWant = (W, u) => { const M = (W.rules.sshot || {}).move || {}; return W.units.some(f => f.alive && !f.down && f.side !== u.side && ((f.act && f.act.b === u.i && isFar(f)) || (!isFar(f) && gap(u, f) < (M.threat || 3)))); };
const running = (W, u) => (u.mv && u.mv.run && W.t < u.mv.until) || (u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'exit'));   /* v8.7.3 출구 서둘러 */
function shotMode(W, u, t){
  if (!sGrade(u) || !W.rules.pen || !W.rules.sshot || AI6.includes('sshot')) return null;
  const PN = W.rules.pen, dir = sideOf(W, t, u), it = t.gear && t.gear['몸'], wp = (W.rules.weapons || {})[u.weapon] || {};
  let A = it ? armorA(W, t, it, false) * (dir === 'side' ? PN.side || 0.7 : dir === 'back' ? PN.back || 0.6 : 1) : 0;
  if ((t.shield || t.armShield) && guardOn(W, t) && inGuard(W, t, u, true)) A = Math.max(A, t.armShield && !t.shield ? PN.armShield : t.pavise ? PN.pavise || 160 : t.buckler ? PN.buckler || 80 : PN.shield);
  const P = (wp.P || 70) * ((PN.bow || {}).S || 1);
  if (A >= P * 0.95) return 'aimed';
  if (gap(u, t) < 3 || Math.hypot(t.vx || 0, t.vy || 0) > 1.6) return 'rapid';
  return null;
}
// 이동 사격: 표적을 겨눈 채 옆으로 (번갈아 · 덜 위험한 쪽 · 바위 · 몸 피함)
function setStrafe(W, u, t, dur){
  const M = (W.rules.sshot || {}).move || {}, d = M.step || 1.1, a = Math.atan2(t.y - u.y, t.x - u.x), px = -Math.sin(a), py = Math.cos(a);
  u.strafeS = -(u.strafeS || 1);
  const cand = [u.strafeS, -u.strafeS].map(sg => ({ x: u.x + px * sg * d - Math.cos(a) * 0.25, y: u.y + py * sg * d - Math.sin(a) * 0.25 })).filter(p => p.x > 0.7 && p.y > 0.7 && p.x < W.map.W - 0.7 && p.y < W.map.H - 0.7 && !boxRock(W, p.x, p.y, u.r) && !W.units.some(o => o.alive && o !== u && Math.hypot(o.x - p.x, o.y - p.y) < o.r + u.r + 0.05));
  if (!cand.length){ u.strafe = null; return; }
  const p = cand.sort((p, q) => inflAt(W, u.side, p.x, p.y) - inflAt(W, u.side, q.x, q.y))[0];
  u.strafe = { x: p.x, y: p.y, until: W.t + dur };
}
function strafeStep(W, u, dt){
  const S = u.strafe, t = W.units[u.act.b]; if (Math.hypot(S.x - u.x, S.y - u.y) < 0.08){ u.strafe = null; return; }
  setGoal(W, u, S.x, S.y); follow(W, u, dt, ((W.rules.sshot || {}).move || {}).spd || 0.8); if (t && t.alive) u.fg = Math.atan2(t.y - u.y, t.x - u.x);
}
// v7.0 사선 안의 적: 아는 상대 사수 (총 · 활 · 창을 든 투창병) 의 사거리 + 2칸 안 · 사선이 열림 · 맞붙지 않음 → 지그재그로 질주
function underGun(W, u){
  if (u.side !== 1 || AI6.includes('weave') || !W.rules.weave) return false;
  if (W.t - (u.ugT == null ? -9 : u.ugT) < 0.25) return u.ug; u.ugT = W.t;
  const nr = W.rules.weave.near || 2;
  u.ug = !busyW(W, u) && W.units.some(f => f.alive && f.side !== u.side && ((isFar(f) && f.ammo !== 0) || (f.jav && f.spearHeld)) && (canSee(W, u, f) || fresh(W, u.sense[f.i], 2)) && dist(u, f) <= f.rng + f.r + u.r + nr && losClear(W.map, f.x, f.y, u.x, u.y));
  return u.ug;
}
const weaveAng = (W, u) => { const V = W.rules.weave; return V.amp * Math.sin(W.t * V.f1 + u.i * 1.9) + V.amp2 * Math.sin(W.t * V.f2 + u.i * 0.7); };
// v7.0 관통 판정 (원거리 · 던진 무기): 관통력 P vs 맞은 곳의 방호력 A. 못 뚫으면 튕김 (총알) · 박힘 (화살 · 창) — 충격만, 뚫으면 남은 힘 비율만큼
function penPower(W, u, J, pw, extra, arcX){ const PN = W.rules.pen; let P = J ? (J.P || 90) * Math.max(1, u.strMul || 1) : (pw.P != null ? pw.P : 80);
  if (!J && pw.kind === '활'){ const B = PN.bow || {}; P *= (u.marks || 0) >= 0.69 ? B.S || 1 : (u.marks || 0) >= 0.54 ? B.A || 1 : 1; }
  return P * (extra && extra.pm ? extra.pm : 1) * (arcX ? PN.arc || 0.8 : 1) * (1 - (PN.rnd || 0) + 2 * (PN.rnd || 0) * W.rand()); }
function armorA(W, t, it, gun){ const PN = W.rules.pen, a = (PN.arm || {})[it.mat]; return (a ? a[gun ? 0 : 1] : 50) * ((PN.tier || [])[Math.max(0, Math.min(2, (it.tier || 1) - 1))] || 1); }
function penRes(W, u, t, part, dir, J, pw, crit, arcX, extra){
  const PN = W.rules.pen, it = t.gear && t.gear[part === '머리' ? '머리' : '몸'], gun = !J && pw.kind === '총포류', P = penPower(W, u, J, pw, extra, arcX);
  if (!it || (pw.kind === '마법' && !pw.phys)) return { pen: true, m: 1, P, A: 0 };   // v7.19 바위 · 흙 마법 (phys) 은 갑옷 판정
  let A = armorA(W, t, it, gun) * (arcX ? PN.top || 0.85 : dir === 'side' ? PN.side || 0.7 : dir === 'back' ? PN.back || 0.6 : 1), how = '';
  if (part === '머리' && W.rand() > (PN.helm != null ? PN.helm : 0.7)){ A *= PN.gap || 0.3; how = '얼굴 · 투구 틈'; }
  else if (crit && (u.vit || 0) > 0){ A *= PN.gap || 0.3; how = '갑옷 틈'; } else if (crit){ A *= PN.crit || 0.6; how = '급소'; }
  if (P > A) return { pen: true, m: Math.max(0.45, Math.min(1, 0.45 + (P - A) / P)), P, A, how };
  return { pen: false, m: PN.blunt || 0.12, P, A, how: gun ? '튕김' : '박힘' };
}
function strike(W, u, t, meant, p, far, extra){
  const R = W.rules, J = extra && extra.jav ? (extra.kn ? KNIFE(W) : JV(W)) : null;
  const led = W.units.some(c => c.alive && c !== u && c.side === u.side && c.cls === '지휘' && dist(c, u) <= 3);
  // v5.2 피해 흔들림: 무기마다 (jit) — 화살 · 투창은 크게 흔들림 (때로 총보다 셈), 총은 안정적
  const isF = far != null ? far : isFar(u), pw = J ? J : isF ? ((R.weapons || {})[u.weaponNow || u.weapon] || {}) : null, jt = pw && pw.jit != null ? pw.jit : R.jitter;
  const v = jt ? 1 - jt + 2 * jt * W.rand() : 1;
  const arcX = !!(extra && extra.arc), AR = R.arc || {};   // v5.8.4 곡사: 위에서 떨어짐
  let dir = arcX || (t.fb && t.fb.sh === '방진') ? 'front' : sideOf(W, t, u);   /* v8.7.5 사방 경계 */ const base = hiMelee(W, u, t, isF || !!J) * u.atk * u.atkMul * (u.gangMark || u.cb ? cbDmg(W, u, t) : 1) * (u.wForeign && !isF && !J ? ((R.inv || {}).foreign || {}).atk || 0.93 : 1) * (led ? 1 + R.aura : 1) * v * (R.lethal || 1) * (J ? J.mul : 1) * (extra && extra.mul ? extra.mul : 1) * (u.shield && u.raised && W.t >= u.raiseAt && !isF && !J ? (R.guard || {}).strikeMul || 0.85 : 1) * (!isF && !J && twoHanded(W, u) ? R.twoHand || 1.15 : 1);   // v5.7.1 방패 뒤에서 치기 · 두 손으로 쥔 무기
  u.atkT = W.t;
  const o = { led, dir, meant: meant !== t ? meant.i : null, ff: t.side === u.side, far: far != null ? far : isFar(u), p: p < 1 ? +p.toFixed(2) : null, arc: arcX && !(extra && extra.rain), kn: !!(extra && extra.kn) };
  // v5.7 전열의 관절: 옆에 마디가 붙은 쪽에서 오는 근접은 측면이 아님 (그 마디가 가림). 그 마디가 방패를 들고 있으면 그 방패가 막음
  const cov = dir === 'side' && !o.far && !(extra && extra.grab) ? lineCover(W, t, u) : null;
  if (cov){ dir = 'front'; o.dir = 'front'; o.cover = cov.i;
    if (cov.shield && guardOn(W, cov) && cov.side !== u.side){ cov.post -= R.postCost * (cov.gCost || 1); cov.blockT = W.t; cov.blocked++; if (cov.post <= 0){ cov.post = 0; cov.brokenT = W.t + R.breakTime; o.broke = true; }
      o.block = true; o.tag = '옆 동료 (' + cov.name + ') 방패가 막음'; applyDmg(W, u, t, Math.max(1, Math.round(base * R.blockMul)), o); return o; } }
  const exFail = !arcX && t.exhausted && !AI6.includes('fat') && W.rand() < ((FATR(W) || {}).ex || {}).block && inGuard(W, t, u, o.far || !!J); if (exFail) o.exFail = true;   // v6.6 탈진: 막아도 뚫림
  if (arcX ? !(extra && extra.over) && t.shield && guardOn(W, t) && W.rand() < (AR.shield != null ? AR.shield : 0.7) : !exFail && !(extra && extra.grab) && !(u.flanker && dir === 'back' && !o.far && !J) && inGuard(W, t, u, o.far || !!J)){   // v5.8.4 곡사는 든 방패만 (머리 위로 기울여) 막음 — 무구 · 반사신경은 못 받음
    o.jav = !!J; const pr = t.parry && !t.shield && !!parryArc(W, t), PR = R.parry || {}; o.parry = pr;   // v5.7.1 무구로 막음
    o.gn = t.armShield ? '팔' : t.shield ? '방패' : (pr || ((R.weapons || {})[t.weapon] || {}).guard) && t.weapon ? t.weapon : '반사신경';   // v5.7.2 막은 것 (맞은 그때 — 쓰러져 방패를 떨어뜨린 뒤에도 바르게)
    const post0 = t.post; t.post -= fatMul(W, t, 'post') * (t.injPost || 1) * R.postCost * (t.gCost || 1) * (2 - (t.gTal != null ? t.gTal : 1)) * (J ? J.post * (u.strMul || 1) : o.far ? 1 : u.strMul || 1) * (!o.far && backToWall(W, t, u) ? rv(W, 'wallPost', 1.3) : 1) / (1 + ((W.rules.form || {}).postForm != null ? W.rules.form.postForm : 0.15) * formMates(W, t)) * (pr ? (PR.post || 1.3) * Math.min(3, Math.max(1, (u.mass || 62) / Math.max(30, t.mass || 62))) : 1); t.blockT = W.t; t.blocked++;   // v5.4 방진: 붙어 선 동료만큼 덜 깎임   // v5.2 벽을 등지면 더 깎임
    if (t.post <= 0 && !o.far && !J && u.side !== t.side && mightReady(W, t)){ const M = MIGHT(W), cost = post0 - t.post; t.post = Math.max(1, post0 - cost / mightUse(W, t, 'parry', u)); o.mightParry = true;   /* v7.24.2 괴력: 무너지려던 막기를 튕겨냄 — 상대를 밀고 잠깐 휘청 */
      if (u.alive && !u.kb){ shove(W, t, u, (M.counter || 0.5) * (t.strMul || 1), u.x - t.x, u.y - t.y, { tag: '괴력으로 튕겨냄' }); stun(W, u, M.cStun || 0.3, t.i); } }
    if (t.post <= 0){ t.post = 0; t.brokenT = W.t + R.breakTime; o.broke = true; }
    if (R.pen && (o.far || J) && (t.shield || t.armShield) && !pr && pw && !AI6.includes('pen')){   // v7.0 방패도 관통 판정: 못 뚫으면 피해 없음 (자세만 깎임), 뚫으면 힘이 줄어 몸으로
      const PN = R.pen, P = penPower(W, u, J, pw, extra, arcX), A = (t.armShield && !t.shield ? PN.armShield : t.pavise ? PN.pavise || 160 : t.buckler ? PN.buckler || 80 : PN.shield) * (arcX ? 0.9 : 1), gunS = !J && pw.kind === '총포류';
      o.P = Math.round(P); o.A = Math.round(A);
      if (P <= A){ o.block = true; o.deflect = gunS ? '튕김' : '박힘'; o.tag = (o.gn === '팔' ? '팔 갑피에 ' : '방패에 ') + o.deflect + ' (관통 ' + o.P + ' < 방호 ' + o.A + ')'; applyDmg(W, u, t, 0, o); return o; }
      const d2 = Math.max(1, Math.round(base * Math.max(0.3, Math.min(1, (P - A) / P + 0.3)) * (PN.thru || 0.55)));
      o.block = false; o.shieldPen = true; o.pen = true; o.part = '몸통'; o.armPure = 1; o.armMul = 1; o.wk = gunS ? '총포류' : '활'; o.tag = (o.gn === '팔' ? '팔 갑피를 뚫음' : '방패를 뚫음') + ' (관통 ' + o.P + ' > 방호 ' + o.A + ')';
      applyDmg(W, u, t, d2, o); if (t.side !== u.side) woundRoll(W, u, t, o, d2, '몸통', false, true); return o;
    }
    o.block = true; o.tag = (extra && extra.tag) || (arcX ? '방패를 들어 올려 막음' : null);
    // v5.7 맨몸으로 무기를 막음: guard.bare 확률로 팔이 받아 냄 → 피해 bareDmg × · bareMaim 확률로 팔이 잘림 (날붙이 · 짐승) · 부러짐 (둔기 · 투창은 꿰뚫음)
    const G = R.guard || {}, wk0 = J ? '날붙이' : (u.bladeHands && !o.far) ? '날붙이' : (((R.weapons || {})[u.weaponNow || u.weapon] || {}).kind || '맨손');
    if (bareGuard(W, t) && ['날붙이', '둔기', '짐승'].includes(wk0) && (!o.far || J) && W.rand() < (G.bare != null ? G.bare : 0.3)){
      o.block = false; o.bareArm = true; o.part = '팔'; o.wk = wk0; o.tag = '맨팔로 받아 냄';
      applyDmg(W, u, t, Math.max(1, Math.round(base * (G.bareDmg != null ? G.bareDmg : 0.6))), o);
      if (t.alive && !wholeBody(t) && W.rand() < (G.bareMaim != null ? G.bareMaim : 0.5) * maimRes(W, t)) maimArm(W, t, u.i, J ? '찌름' : wk0 === '짐승' ? '날붙이' : wk0);
      return o;
    }
    applyDmg(W, u, t, Math.max(1, Math.round(base * (1 - (1 - (pr ? (PR.mul != null ? PR.mul : 0.5) : R.blockMul)) * (t.gTal != null ? t.gTal : 1)))), o);
    wearBlock(W, u, t, o, base, extra);   // v7.20 내구도 (방패 · 막은 무기 · 막힌 무기)
    if (!o.far && !J) grabTry(W, t, u, 'block');   // v7.19.2 막으며 자루를 잡음
    return o;
  }
  // 암살: 옆 · 뒤에서, 알아차리지 못한 상대에게 근접 무기가 들어감 → 치명상
  const amb = !o.far && dir !== 'front' && (u.bladeHands || !NO_AMBUSH.includes(u.weaponNow || u.weapon)) && !aware(W, t, u) && !fresh(W, t.sense[u.i], R.ambushKnow != null ? R.ambushKnow : 10);   // 날붙이 판정이면 맨손 · 발톱이어도 암살   /* v8.7.3 알고 있던 상대면 기습 아님 */
  // 부위: 노출 (측면 · 뒤 · 공격 준비 · 회복 중) 이면 머리가 두 배로 잘 뽑힘
  const exposed = dir !== 'front' || !!t.act || prone(W, t) || W.t < (t.stunT || -9), P = R.parts || { '몸통': { w: 1, mul: 1 } };
  const aH = arcX ? (AR.head != null ? AR.head : 1.6) : 1;   // v5.8.4 곡사는 머리 · 어깨로 떨어짐
  let tot = 0; for (const k in P) tot += P[k].w * (k === '머리' ? (exposed ? 2 : 1) * aH : 1);
  let r = W.rand() * tot, part = '몸통';
  for (const k in P){ r -= P[k].w * (k === '머리' ? (exposed ? 2 : 1) * aH : 1); if (r <= 0){ part = k; break; } }
  const HM = !o.far && !J && !!u.headMark && u.headMark.b === t.i && W.t < u.headMark.until, HP = !HM && !!(extra && extra.headP) && W.rand() < extra.headP; if (HM || HP) part = '머리'; if (extra && extra.part) part = extra.part;   /* v8.7.8 부위를 정한 피해 (천둥 — 부위가 없음) */   // v7.19.1 머리 찍기 · 휘둘러 치기
  const flank = dir === 'side' ? R.flankSide : dir === 'back' ? R.flankBack : 1;
  // v5.2 치명타: 투창은 투창 표, 나머지는 crit.base (+ 넘어진 상대 crit.prone, + 거구의 공격 heavyCrit). 넘어진 몸은 받는 피해 ×proneHit
  const CR = R.crit || {}, pr = prone(W, t), crit = (extra && extra.crit) || (u.ls && u.ls.ph === 'last') || HM || (HP && W.rand() < 0.7) || (J ? W.rand() < J.crit + (u.vit || 0) : W.rand() < (CR.base || 0) + (u.vit || 0) + (pr ? CR.prone || 0 : 0) + (W.t < (t.openT == null ? -9 : t.openT) ? (R.step || {}).openCrit || 0.2 : 0) + ((extra && extra.heavyCrit) || 0) + (t.exhausted && !AI6.includes('fat') ? ((FATR(W) || {}).ex || {}).crit || 0 : 0));   // v6.6 탈진하면 급소가 열림
  // v5.1 갑옷 · 투구: 맞은 무기 종류 (날붙이 · 둔기 · 짐승 · 활 · 총포류 · 마법 · 맨손) 에 따라 받는 피해 ×
  const wk = extra && extra.wk ? extra.wk : (u.bladeHands && !o.far) || J ? '날붙이' : (((R.weapons || {})[u.weaponNow || u.weapon] || {}).kind || '맨손');
  // v5.2 관통: 화살 · 투창 · 총알은 확률 (pen + 근력 · 총은 근력 없음) 로 갑옷을 꿰뚫음 → 갑옷이 막는 몫 × (1 − penK). 총은 늘 뚫지만 반쯤, 화살 · 투창은 뚫으면 거의 다
  const PNR = R.pen && (isF || J) && pw && !AI6.includes('pen') ? penRes(W, u, t, part, dir, J, pw, crit, arcX, extra) : null;   // v7.0 관통 판정
  const pen = PNR ? PNR.pen : !!pw && pw.pen != null && W.rand() < (pw.pen + (pw.kind === '총포류' ? 0 : (pw.penStr != null ? pw.penStr : 0.5) * Math.max(0, (u.strMul || 1) - 1))) * (arcX ? (J && J.arc && J.arc.pen != null ? J.arc.pen : AR.pen != null ? AR.pen : 0.6) : 1);   // v5.8.4 곡사는 힘이 빠져 덜 꿰뚫음
  const AM0 = armorMul(R, t, part, wk), AM = PNR ? { m: PNR.m, it: AM0.it } : pen && AM0.it ? { m: 1 - (1 - AM0.m) * (1 - (pw.penK != null ? pw.penK : 0.8)), it: AM0.it } : AM0, gapHit = crit && (u.vit || 0) > 0 && !!AM.it, armMul = extra && extra.noArmor ? 1 : (gapHit && !PNR ? 1 - (1 - AM.m) * 0.5 : AM.m) * (wk === '총포류' && !t.human ? (R.gunTough != null ? R.gunTough : 1) : 1);   /* v8.7.8 갑옷 무시 (굿윌 니킥 헤드샷) */   // v6.7 [급소X] 의 치명은 갑옷 틈으로 (막는 몫 절반)   // 굴의 몸은 총에 단단함
  // v5.2 암살은 뒤 · 측면 배율과 겹치지 않음 (둘 중 큰 쪽)
  let dmg = Math.max(1, Math.round(base * (amb ? Math.max(R.ambushMul || 1, flank) : flank) * (P[part] ? P[part].mul : 1) * (crit ? (J ? J.critMul : CR.mul || 1.5) : 1) * (pr ? rv(W, 'proneHit', 1.5) : 1) * armMul * (mbOn(W, t) ? mbF(W, t, 'dmg') : 1) * (t.scaleMail ? (dir === 'front' ? (o.far || J ? 0.7 : 1) : 1.15) : 1)));   // [개조된 신체]   /* v8.7.4 [비늘 깃털 갑옷] */
  o.part = part; o.ambush = amb; o.jav = !!J; o.crit = crit; if (t.scaleMail) o.scale = dir === 'front' ? (o.far || J ? 0.7 : 1) : 1.15; o.armor = AM.m < 1 && AM.it && !(extra && extra.noArmor) ? AM.it.name : null; o.armMul = +armMul.toFixed(2); o.armPure = AM.m; o.wk = wk; o.tag = (extra && extra.tag) || null; o.hcrit = crit && !J; o.pen = pen && !!AM0.it; o.gapHit = gapHit; if (PNR && AM0.it){ o.P = Math.round(PNR.P); o.A = Math.round(PNR.A); if (!PNR.pen){ o.deflect = PNR.how; o.tag = o.tag || (PNR.how === '튕김' ? '갑옷에 튕김' : '갑옷에 박힘') + ' (관통 ' + o.P + ' < 방호 ' + o.A + ')'; } else if (PNR.how) o.gapHow = PNR.how; }   // v6.9 armPure = 갑옷만의 몫 (총에 단단한 굴의 몸은 부상에도 그대로)
  // v5.2 투구째 꿰뚫음: 근력이 아주 센 쪽 (괴력 배율 pierce.str 이상) 의 화살 · 투창이 머리 (투구) 를 뚫으면 pierce.kill 확률로 즉사 — 곡괭이로 찍듯
  const PC = R.pierce || {};
  if (pen && part === '머리' && pw.kind !== '총포류' && !(t.traits || []).includes('보스') && !t.noOrg && (u.strMul || 1) >= (PC.str || 1.3) && W.rand() < (PC.kill != null ? PC.kill : 0.5)){ dmg = Math.max(dmg, Math.ceil(t.hp)); o.tag = '투구째 꿰뚫림 — 즉사'; }
  // v5.7 급소: 머리 · 심장을 꿰뚫으면 (원거리 · 투창은 갑옷이 없거나 뚫었을 때, 근접은 치명타 — 날붙이 · 둔기) 최대 체력의 몫을 한 번에. 머리가 여럿이면 그 머리를 잃음
  { const V = R.vital || {}, through = !AM0.it || pen, rangedV = (o.far || J) && through, meleeV = !o.far && !J && crit && wk !== '맨손';
    const heart = part === '몸통' && (rangedV || meleeV) && W.rand() < (V.heartP != null ? V.heartP : 0.25);
    const vp = part === '머리' && (rangedV || meleeV) ? '머리' : heart ? '심장' : null;
    if (vp && !(extra && extra.noWound) && !o.deflect && !t.marble && !t.noOrg && !(t.act && t.act.k === 'roll')){   /* v8.7.8 구르는 동안 급소 보호 */   /* v8.6.0 [대리석 피부]: 급소가 없음 */   /* v8.7.3 [무장기] */
      o.vital = vp; const boss = (t.traits || []).includes('보스'), vMax = boss ? Math.min(t.max, V.boss != null ? V.boss : 400) : t.max;   // v7.22.2 [보스]
      if (vp === '머리' && (t.heads || 1) > 1){   // 머리 넷: 그 머리를 잃음
        o.headLost = true; dmg = Math.max(dmg, Math.round(vMax * (V.headLoss != null ? V.headLoss : 0.2)));
      } else {
        dmg = Math.max(dmg, Math.round(vMax * (meleeV ? (V.melee != null ? V.melee : 0.35) : vp === '머리' ? (V.head != null ? V.head : 0.4) : (V.heart != null ? V.heart : 0.3))));
        const kp = boss ? 0 : vp === '머리' && rangedV ? (J ? (V.javKill != null ? V.javKill : 0.25) : (V.arrowKill != null ? V.arrowKill : 0.12)) : 0;
        if (kp && W.rand() < kp){ dmg = Math.max(dmg, Math.ceil(t.hp)); o.tag = (J ? '투창' : pw && pw.kind === '총포류' ? '총알' : '화살') + '이 머리에 박힘 — 즉사'; }
      }
      if (!o.tag) o.tag = vp === '머리' ? (o.headLost ? '급소 — 머리 하나' : '급소 — 머리') : '급소 — 가슴';   // v7.0 '꿰뚫음' 은 실제로 숨을 끊었을 때만 (부상 모델)
    }
  }
  if ((HM || (HP && part === '머리')) && t.alive){ const SP = R.spec || {}, kill = HM ? ((SP.head || {}).kill != null ? SP.head.kill : 0.02) : ((SP.hurl || {}).kill != null ? SP.hurl.kill : 0.02);   // v7.19.1 머리 직격: 체급 한도 (중대형) 까지 즉사 확률
    if (HM){ u.headMark = null; const sp = (u.spec || []).find(x => x.k === 'head'); if (sp) sp.n = 0; }
    if ((SIZE_RANK[sizeOf(t)] || 0) <= (SIZE_RANK[(SP.head || {}).max || '중대형'] != null ? SIZE_RANK[(SP.head || {}).max || '중대형'] : 2) && !t.noOrg && W.rand() < kill){ dmg = Math.max(dmg, Math.ceil(t.hp)); o.tag = (HM ? '머리 찍기' : '휘둘러 치기') + ' — 머리 직격 · 즉사'; }
    else o.tag = HM ? '머리 찍기 — 확정 치명' : '휘둘러 치기 — 머리 직격';
    o.spec = HM ? 'head' : 'hurl'; }
  if (o.gapHit && !o.tag) o.tag = '갑옷 틈을 찌름';   // v6.7
  if (amb){ u.ambushes++;
    // 비명: 둘레 동료가 친 자리를 정확히 앎 (곧바로 몰려옴)
    W.noises.push({ x: +t.x.toFixed(2), y: +t.y.toFixed(2), t0: W.t, side: t.side, a: t.i, kind: 'scream' });
    for (const o2 of W.units) if (o2.alive && o2 !== t && o2.side === t.side && dist(o2, t) <= R.hear) o2.sense[u.i] = { x: u.x, y: u.y, t: W.t, exact: true, scream: true };
  }
  // 상처: 체력의 10% 넘게 맞으면 팔 = 공격 ×0.85, 다리 = 속력 ×0.8 (각각 절반까지)
  if (!wholeBody(t) && !(extra && extra.noWound) && dmg >= t.max * 0.1 && t.hp > dmg){   // [불사] · [재생] 은 상처가 남지 않음
    if (part === '팔' && t.atkMul > 0.5){ t.atkMul = Math.max(0.5, t.atkMul * 0.85); o.wound = '팔'; }
    if (part === '다리' && t.spdMul > 0.5){ t.spdMul = Math.max(0.5, t.spdMul * 0.8); o.wound = '다리'; }
    if (o.wound) t.wounds.push(o.wound);
  }
  t.pinT = W.t + R.pinTime * (J ? 1.5 : 1) * (mbOn(W, t) ? mbF(W, t, 'pin') : 1) * (t.vet ? VETR(W).pin : 1);
  applyDmg(W, u, t, dmg, o);
  wearHit(W, u, t, o, AM0.it, dmg, armMul);   // v7.20 내구도 (친 무기 · 막아 낸 갑옷)
  { const wkb = !J && ((R.weapons || {})[u.weaponNow || u.weapon] || {}).kb; if (wkb && t.alive && !t.kb && t.side !== u.side) shove(W, u, t, wkb * (o.far ? 1 : u.strMul || 1), t.x - u.x, t.y - u.y, o.far ? { tag: '흙덩이에 밀림', mass: (W.rules.shove || {}).proj || 80, fix: true } : { tag: '철퇴에 밀림' }); }   // v7.19 무기 넉백
  if (u.fire && !o.far && !J && unarmed(u) && t.alive && t.side !== u.side) burnOn(W, t, u, 1, !!AM0.it);   // v6.7 [발화X] 손바닥이 닿음 → 화상
  { const fz = !u.weaponGone && ((R.weapons || {})[u.weaponNow || u.weapon] || {}).frost; if (fz && !o.far && !J && !o.block && t.alive && t.side !== u.side && W.rand() < fz) frostOn(W, t, CZR(W).frostT || 4, u.i); }   /* v7.23.1 냉기 무기 (노인의 검) */
  { const fw = !u.weaponGone && (((R.weapons || {})[u.weaponNow || u.weapon] || {}).fire || (u.wFire > 0 && !isFar(u) ? u.wFire : 0));   /* v8.7.7 청염 (u.wFire — 근접에 불) */ if (fw && !o.far && !J && t.alive && t.side !== u.side && !(extra && extra.noFire)) burnOn(W, t, { i: u.i, fire: fw }, 1, !!AM0.it); }   // v7.22.3 불 붙는 무기 (각혈의 장검)
  // v5.7 급소의 뒤: 피를 흘림 · 머리 넷은 그 머리를 잃음 (눈 둘)
  if (o.vital && t.alive && !wholeBody(t)){ startBleed(W, t, u.i, (R.vital || {}).bleedMul || 1.5);
    if (o.headLost){ t.heads--; t.eyes = Math.max(0, t.eyes - 2); t.eyeLost = Math.min(t.eyeLost, t.eyes); if (t.eyes && t.eyeLost >= t.eyes) t.blind = true; t.wounds.push('머리 하나를 잃음');
      L(W, { k: 'headLost', a: u.i, b: t.i, left: t.heads, vis: t.side === 0 || !!t.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '머리 하나를 잃음!', c: 'd', t0: W.t }); } }
  // v5.2 치명타의 뒤: 다리에 크게 → 다리 불구 (기어다님). 거구의 치명은 넘어뜨림 (상대가 너무 무거우면 안 넘어짐)
  // v5.5 자르는 것은 근접 날붙이뿐 (투창 · 화살 · 총은 꿰뚫어 부숨)
  const cutK = wk === '날붙이' && (o.far || J) ? '찌름' : wk;
  if (crit && t.alive){
    if (part === '다리' && dmg >= t.max * (CR.legMin || 0.12) && W.rand() < (CR.cripple != null ? CR.cripple : 0.6) * maimRes(W, t)) cripple(W, t, u.i, cutK);   // v5.5 무거운 몸은 덜 · 투창도
    else if (!J && extra && extra.heavyCrit && u.mass >= t.mass * (t.poise || 1) * 0.6) knockDown(W, t, (R.heavy || {}).down || 1.2, u.i, '치명타');
  }
  // v5.5 부위 파괴 · 절단: 머리 → 눈, 팔 → 팔. 치명 (최대 체력의 min 넘게) 이면 maim.p, 치명이 아니어도 크게 (big 넘게) 맞으면 bigP. 무거운 몸은 덜
  if (t.alive && !wholeBody(t) && (part === '머리' || part === '팔') && !(extra && extra.noWound)){
    const M = R.maim || {}, big = dmg >= t.max * (M.big != null ? M.big : 0.35);
    const pm = crit && dmg >= t.max * (M.min != null ? M.min : 0.1) ? (M.p != null ? M.p : 0.5) : big ? (M.bigP != null ? M.bigP : 0.1) : 0;
    if (pm && W.rand() < pm * maimRes(W, t)){ if (part === '머리') maimEye(W, t, u.i); else maimArm(W, t, u.i, cutK); }
  }
  if (!(extra && extra.noWound) && t.side !== u.side) woundRoll(W, u, t, o, dmg, part, crit, pen);   // v6.9 부상 모델
  return o;
}
function applyDmg(W, u, t, dmg, o){
  if (u && t.cb && t.cb.includes('gang') && u.side !== t.side && dmg > 0) for (const p of W.units) if (p !== t && p.alive && p.side === t.side && cbHas(p, 'gang')) p.gangMark = { b: u.i, until: W.t + ((W.rules.combo || {}).gangT || 6) };   /* v8.7.5 갱스터 파라다이스 — 의리 */
  if (t.marble || t.jrFly || t.jrInv){ dmg = marbleHit(W, u, t, dmg, o); if (!(dmg > 0)) return; }
  if (t.stoneT != null && W.t < t.stoneT && dmg > 1){ dmg = 1; o = { ...(o || {}), stone: true, tag: '방어모드 — 피해 1' }; }   /* v8.7.4 방어모드 (붉은암석): 무엇이든 피해 1 */
  if (u && u !== t && u.side !== t.side && dmg > 0 && !(o && o.ff)){   /* v8.7.7 받는 피해 × (가호 · 유물) · 피 흘리는 상대에게 × · 왕관 조각 (편마다 n 번 — 치명타를 체력 1 로 버팀 · 출혈 · 화상으로 숨이 다할 땐 안 버팀) */
    if (t.porenKit || (t.rs && t.rs.k === 'shieldWall') || (t.act && t.act.k === 'roll')){ dmg = porenTake(W, u, t, dmg, o); if (!(dmg > 0)) return; }   /* v8.7.8 포렌 · 쥐 방패 · 구르기 */
    if (t.dmgK > 0 && t.dmgK !== 1) dmg *= t.dmgK;
    if (u.bleedK > 0 && (t.bleed || t.ibleed)) dmg *= u.bleedK;
    const cw = W.crown ? W.crown[t.side] || 0 : 0; if (cw > 0 && t.alive && !t.summon && dmg >= t.hp && t.hp > 1 && !/출혈|화상|근성/.test((o && o.tag) || '')){ W.crown[t.side] = cw - 1; dmg = t.hp - 1; t.deathKind = null; t.headAt = null; o = { ...(o || {}), tag: ((o && o.tag) ? o.tag + ' — ' : '') + '왕관 조각이 버팀' }; L(W, { k: 'crownSave', a: u.i, b: t.i, vis: t.side === 0 || !!t.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.3, s: '👑 버팀!', c: 'h', t0: W.t }); }
  }
  { const G = t.act; if (G && G.k === 'spec' && G.s === 'tear' && G.phase === 'run' && u.side !== t.side){ G.dmg = (G.dmg || 0) + Math.min(dmg, t.hp); if (G.dmg >= t.max * (SPR(W, 'tear').brk || 0.06)) tearLet(W, t, '맞아서 놓침', u.i); } }   /* v8.7.4 잡아찢기는 끊을 수 있음 */   /* v8.6.0 [대리석 피부] · 하늘 · 떠오름 */
  if (t.grit && !t.lsEnd && t.alive){ dmg = karGritHit(W, u, t, dmg, o); if (!(dmg > 0)) return; }   /* v8.7.8 근성 */
  const real = Math.min(dmg, t.hp), dark = t.side === 0 && !canSee(W, t, u);
  if (o && o.ff && u !== t && u.side === t.side){ u.burst = null; u.ffHitT = W.t; u.lastDec = { t: W.t, s: `${t.name}을(를) 맞힘 — 점사를 접고 사선을 다시 봄` }; }   // v7.9.3 아군을 맞히면 남은 발을 접음
  t.hp -= real; t.hitT = W.t; t.hitFar = !!(o && o.far); t.hitSide = u.side; u.dealt += real; t.taken += real;   // v7.11 hitFar   // v7.16.1 hitSide
  if (o.ff) u.ff += real;
  if (o.far && !o.ff && W.farDmg){ W.farDmg[t.side] += real; (W.farTot || (W.farTot = [0, 0]))[t.side] += real; }   // v7.3 farTot = 사격으로 받은 피해 (누적 — 사격전 저울)
  if (o.far && !o.ff){ t.farHitT = W.t; t.farBy = u.i; }   // v6.4.2 사격받은 때 (노출 병력 회수)
  if (!o.block && real > 0) tire(W, t, 'hit', Math.min(2, real / 30));   // v6.6 맞으면 지침 (막은 건 안 침)   // v5.4 사격에 밀리는가 (대치)
  if (dark){ t.unseenHitT = W.t; t.takenDark += real; W.darkHitT = W.t; }
  L(W, { k: 'hit', armor: o.armor || null, tag: o.tag || null, hcrit: !!o.hcrit, pen: !!o.pen, a: u.i, b: t.i, dmg: Math.round(real), hp: Math.round(t.hp), dark, led: o.led, dir: o.dir, block: !!o.block, exFail: !!o.exFail, broke: !!o.broke, part: o.part || null, wound: o.wound || null, ff: !!o.ff, meant: o.meant, p: o.p, far: o.far, ambush: !!o.ambush, assn: o.assn ? true : null, silent: o.silent ? true : null, blade: !o.far && !!u.bladeHands, jav: !!o.jav, kn: !!o.kn, crit: !!o.crit, vital: o.vital || null, cover: o.cover != null ? o.cover : null, bareArm: !!o.bareArm, parry: !!o.parry, gn: o.gn || null, arc: !!o.arc, deflect: o.deflect || null, shieldPen: !!o.shieldPen, P: o.P || null, A: o.A || null });   // v5.7 옆 마디가 가림 · 맨팔로 받음   // v7.0 관통 판정
  if (!o.ff) t.threat[u.i] = (t.threat[u.i] || 0) + real;
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: o.block ? '막음 -' + Math.round(real) : '-' + Math.round(real), c: o.block ? 'b' : t.side ? 'd' : 'o', t0: W.t });
  // 맞으면 친 쪽을 앎 (적은 어둠 속 상대에게도 몰려감. 아군은 안 보이면 못 침)
  if (t.side === 1 && !o.ff && !o.silent && t.state !== 'hunt'){ t.state = 'hunt'; t.target = u; t.last = { x: u.x, y: u.y }; t.searchT = 6; alertNear(W, t, u); }
  if (!o.ff && !o.far) t.sense[u.i] = { x: u.x, y: u.y, t: W.t, exact: true };   // 맞으면 친 쪽 자리를 앎
  if (t.hp < 0.5){   // v6.8 반올림해 0 이면 쓰러짐 (0/150 으로 움직이던 것)
    t.alive = false; t.hp = 0; t.act = null; t.burst = null; t.kb = null; stop(t);
    // [불사]: 죽지 않음 — 쓰러져 재생하다 피가 move 에 이르면 일어남 (v5.5.1). 아군이 하나도 없으면 진짜 죽음
    if (t.undying && W.units.some(o2 => o2.alive && o2 !== t && o2.side === t.side)){ t.deathKind = null; t.down = true; t.riseT = null; L(W, { k: 'down', a: u.i, b: t.i, ff: !!o.ff, silent: o.silent ? true : null, need: Math.round(t.max * undMove(W)), eta: +undEta(W, t).toFixed(1) }); }
    else { u.kills++; if (!o.ff) W.kills[u.side]++; if (o.death) t.deathKind = o.death; else if (!t.deathKind && (o.tag === '출혈' || o.tag === '내출혈')) t.deathKind = 'bleed'; else if (!t.deathKind && o.tag === '화상') t.deathKind = 'burn'; t.deadT = W.t; L(W, { k: 'die', a: u.i, b: t.i, ff: !!o.ff, last: !!t.undying, how: t.deathKind || null, silent: o.silent ? true : null }); dropOnDeath(W, t); }   // v6.9 어떻게 쓰러졌나   // v5.6 무기 · 방패가 땅에
    if (t.torch){ t.torch = false; W.torches.push({ x: +t.x.toFixed(2), y: +t.y.toFixed(2), dropped: true, fell: true, off: !!t.torchOff }); t.torchOff = false; computeLight(W); L(W, { k: 'torchDrop', a: t.i, x: +t.x.toFixed(2), y: +t.y.toFixed(2), off: !!W.torches[W.torches.length - 1].off }); /* v7.10 꺼진 채 떨어졌는지 */ }
    if (W.spareBy === t.i){ W.spareBy = null; if (W.spare > 0){ W.spareAt = { x: +t.x.toFixed(2), y: +t.y.toFixed(2), by: t.i }; L(W, { k: 'spareDrop', a: t.i, n: W.spare, x: W.spareAt.x, y: W.spareAt.y }); } }   // v7.8.5 여분 꾸러미도 몸 곁에
    if (W.fxOn) W.fx.push({ k: 'die', x: t.x, y: t.y, t0: W.t, side: t.side });
  }
}
// v8.6.0 [대리석 피부] · 하늘에 뜬 몸: 0 이면 닿지 않음 (흘림 · 받아 냄은 로그 'marble'). 감전 · 잔류 · 출혈 · 화상 같은 몸 안의 피해와 스스로의 기술 (jrOwn) 은 그대로
function marbleHit(W, u, t, dmg, o){
  if (!t.alive || !u || u === t || (o && (o.ff || o.dot || o.jrOwn)) || /출혈|화상|감전|잔류/.test((o && o.tag) || '')) return dmg;
  const vis = t.side === 0 || u.side === 0 || !!t.seenBy;
  if (t.jrInv && W.t < t.jrInv){ if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.8, s: '닿지 않음', c: 'b', t0: W.t }); return 0; }
  if (t.jrFly && !(o && (o.far || o.jav))){ if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.8, s: '하늘 — 닿지 않음', c: 'b', t0: W.t }); return 0; }
  if (!t.marble || W.seal) return dmg;   /* v8.7.4 권위 (신성 봉인) 중엔 대리석 피부도 꺼짐 */
  const R = W.rules.marble || {}, strong = !!(o && (o.crit || o.hcrit || o.pen || o.strong || o.jav || /돌진|돌격|투창|찍기|내려찍|버팀 \(큰 피해\)/.test(o.tag || ''))) || dmg >= (R.strong || 30);
  if (strong && !t.jrBusy && !t.jrFly && W.t >= (t.mStepT || -9) && !t.down && !t.kb && W.t >= (t.stunT || -9)){
    const a0 = Math.atan2(t.y - u.y, t.x - u.x), L0 = R.step || 2.2;
    for (const da of W.rand() < 0.5 ? [1.4, -1.4, 0.9, -0.9] : [-1.4, 1.4, -0.9, 0.9]) for (const k of [1, 0.7]){ const x = t.x + Math.cos(a0 + da) * L0 * k, y = t.y + Math.sin(a0 + da) * L0 * k;
      if (x < 1 || y < 1 || x > W.map.W - 1 || y > W.map.H - 1 || boxRock(W, x, y, t.r * 0.9) || W.units.some(q => q.alive && q !== t && Math.hypot(q.x - x, q.y - y) < q.r + t.r * 0.8)) continue;
      t.mStepT = W.t + (R.stepCd || 4) / authK(W, t); t.x = x; t.y = y; stop(t);   /* v8.7.4 왕관: 스텝 간격이 그만큼 김 */
      L(W, { k: 'marble', a: u.i, b: t.i, how: 'step', dmg: Math.round(dmg), vis }); if (W.fx && W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.8, s: '스텝', c: 'b', t0: W.t });
      return 0; } }
  if (!strong && W.rand() < (R.p != null ? R.p : 0.59)){ const ak = authK(W, t), d2 = Math.max(1, Math.round(dmg * (1 - (1 - (R.mul != null ? R.mul : 0.3)) * ak))); L(W, { k: 'marble', a: u.i, b: t.i, how: 'block', dmg: Math.round(dmg), got: d2, auth: ak < 1 || undefined, vis });   /* v8.7.4 왕관: 받아 내는 몫이 authW 만큼 적음 */ o.tag = o.tag || '대리석 피부'; return d2; }
  return dmg;
}
function alertNear(W, e, target){
  for (const o of W.units) if (o.alive && o.side === e.side && o !== e && o.state !== 'hunt' && dist(o, e) <= W.rules.alert){
    o.state = 'hunt'; o.target = target; o.last = { x: target.x, y: target.y }; o.searchT = 6;
    L(W, { k: 'alert', a: o.i, b: target.i, by: e.i });
  }
}
const inReach = (u, t) => gap(u, t) <= u.rng + 0.02;

/* ---------- 생각 (0.2초마다): 누구를 노릴지 ---------- */
// v7.26.1 적이 없는 판 (끝난 맵): 둘레 near 칸에 동료가 없이 idle 초 → 대장 (없으면 가장 가까운 동료) 곁으로 걸어감 (도착하면 그 자리 · 제자리 명령은 그대로)
function isoRejoin(W, u){
  const J = W.rules.rejoin || {}, k = isFar(u) ? (J.ranged || 1.5) : 1, mates = W.units.filter(a => a.alive && a !== u && a.side === 0 && !a.down && !a.crawl && !a.gone && leadOf(W, a) !== u);   /* v8.7.3 나를 따르는 편대원 · 나간 이는 곁의 동료로 치지 않음 */
  if (!mates.length){ u.aloneT = 0; return; }
  const nb = mates.reduce((b, a) => dist(a, u) < dist(b, u) ? a : b); if (dist(nb, u) <= (J.near || 6) * k){ u.aloneT = 0; return; }
  u.aloneT = (u.aloneT || 0) + 0.2; if (u.aloneT < (J.idle || 4)) return;
  const A0 = ancOf(W), anc = A0 && A0 !== u ? A0 : nb, an = Math.atan2(u.y - anc.y, u.x - anc.x);   /* v8.7.3 기준 (주인공 · 지휘관) */
  let x = Math.max(0.6, Math.min(W.map.W - 0.6, anc.x + Math.cos(an) * 1.5)), y = Math.max(0.6, Math.min(W.map.H - 0.6, anc.y + Math.sin(an) * 1.5)); if (boxRock(W, x, y, u.r)){ const q = freeSpot(W, x, y, u.r); if (q){ x = q.x; y = q.y; } else { x = anc.x; y = anc.y; } }
  u.order = { k: 'move', x, y, rejoin: true }; u.ordLive = u.order; u.stay = null; u.aloneT = 0;
  L(W, { k: 'rejoin', a: u.i, d: +dist(nb, u).toFixed(1), why: '혼자 남음', vis: true }); u.lastDec = { t: W.t, s: `둘레 ${((J.near || 6) * k).toFixed(0)}칸에 동료가 없음 — ${anc.name} 곁으로` };
}
function think(W, u){
  const R = W.rules, foes = W.units.filter(f => f.alive && f.side !== u.side);
  if (!foes.length){ stop(u); if (u.side === 0 && !u.order && !u.down && !u.crawl){ const A = ancOf(W);   /* v8.7.3 */
      if (u.stay && u.stay.old){ u.stay = null; }   // 싸울 때 잡은 자리는 끝난 맵에선 풂 (끝난 뒤에 보낸 자리는 지킴)
      u.target = null; u.state = u.stay ? 'stay' : !A || A === u ? 'explore' : 'follow';
      if (A !== u) isoRejoin(W, u); } return; }   /* v7.26.1 적이 없어도 혼자 남으면 합류 */
  smellTick(W, u);
  // 본 것 기억: 앞 · 옆으로 본 상대는 senseT 동안 자리를 앎 (등 뒤로 돌아가도 한동안은 경계)
  for (const f of W.units) if (f.alive && f.side !== u.side && canSee(W, u, f) && (u.heads > 1 || sideV(W, u, f) !== 'back')) u.sense[f.i] = { x: f.x, y: f.y, t: W.t, exact: true, sight: true };
  if (u.side === 0 && u.smellG && W.t - u.briefAt >= R.briefT) brief(W, u);
  // 야시 없는 적: 주인공의 횃불은 멀리서도 보임 (보는 거리 × 1.6, 바위가 가리면 안 보임) → 대략 자리를 앎
  const hero = u.side === 0 ? ancOf(W) : W.units.find(h => h.hero && h.alive), me = !!hero && hero === u;   /* v8.7.3 기준 (주인공 · 지휘관) */
  // 횃불은 멀리서도 보임 (보는 거리 × 1.6, 바위가 가리면 안 보임) → 든 이의 대략 자리를 앎
  for (const c of W.units) if (c.torch && !c.torchOff && c.alive && c.side !== u.side && dist(u, c) <= R.sight * 1.6 && !canSee(W, u, c) && (u.heads > 1 || sideV(W, u, c) !== 'back') && losClear(W.map, u.x, u.y, c.x, c.y) && !fresh(W, u.sense[c.i], 0.9)){ u.sense[c.i] = { x: c.x + (W.rand() - 0.5), y: c.y + (W.rand() - 0.5), t: W.t, exact: false, light: true };   // v6.2 등 뒤의 불빛은 못 봄
    if (u.side === 1 && !W.alarm1){ W.alarm1 = { t: W.t, by: u.i, b: c.i, x: u.sense[c.i].x, y: u.sense[c.i].y, surprise: surpriseEst(W), light: true }; L(W, { k: 'sentry', side: 1, a: u.i, b: c.i, grp: roamN(W, u), surprise: W.alarm1.surprise, light: true, d: +dist(u, c).toFixed(1), vis: true }); } }   // v6.2 불빛을 처음 본 쪽 → 경보
  if (u.side === 0 && u.order) return;   // 명령을 받은 아군은 명령대로
  if (u.cls === '치유'){
    const need = u.side === 0 ? ((u.healPol || (R.heal || {}).pol || 'dying') === 'free' ? 1 : (u.healPol || (R.heal || {}).pol || 'dying') === 'order' ? 9 : 2) : 1;   // v7.9
    const hurt = W.units.filter(a => a.alive && a.side === u.side && healTier(W, u, a, R.healAt) >= need && !(u.side === 0 && perilOn(W, u) && healTier(W, u, a, R.healAt) < 2)).sort((a, b) => (injUrgent(W, b) ? 1 : 0) - (injUrgent(W, a) ? 1 : 0) || a.hp / a.max - b.hp / b.max);   // v6.9
    if (hurt.length){ u.target = hurt[0]; u.state = 'heal'; return; }
    if (u.state === 'heal') u.state = 'idle';
  }
  if (u.side >= 1){   /* v8.7.4 제3세력 (2편) 도 제 눈으로 보고 쫓음 */
    for (const k in u.threat) u.threat[k] *= 0.97;   // 위협은 천천히 잊음
    const seen = foes.filter(f => canSee(W, u, f)).sort((a, b) => dist(u, a) - dist(u, b));
    if (seen.length){
      const was = u.state === 'hunt', cur = u.target && u.target.alive && seen.includes(u.target) ? u.target : null;
      // 점수 = 쌓인 위협 + 가까움. 지금 상대와 맞붙어 있으면 그대로 두고, 다른 쪽 점수가 1.3배를 넘을 때만 경계를 옮김
      const score = f => (u.threat[f.i] || 0) + Math.max(0, 6 - dist(u, f)) * 3 + roleBias(W, u, f) * 3 + (prone(W, f) ? 8 : 0) + (u.sq && u.sq.k === 'flank' && u.sq.aim === f.i ? 12 : 0) + (peelOf(W, u, f) ? 6 : 0) + (u.side === 1 ? (W.plan && W.plan.k === 'hunt' && supportOf(W, f) === 0 ? 6 : 0) + focusBonus(W, u, f) + taskBias(W, u, f) : 0);   /* v8.7.4 1편의 작전 · 집중 · 임무는 1편만 */   // v5.2 확인사살 · 우회 조 · 떼어 내기 · v6.0 사냥 작전: 고립된 상대
      let pick = seen.reduce((a, b) => score(b) > score(a) ? b : a, seen[0]);
      if (cur && pick !== cur && !(score(pick) > score(cur) * 1.3 + 5)) pick = cur;
      if (cur && pick !== cur && was){ L(W, { k: 'retarget', a: u.i, from: cur.i, b: pick.i, vis: !!u.seenBy }); u.waitT = 0; }
      pick = tauntOf(W, u, pick, seen); u.state = 'hunt'; u.target = pick; u.last = { x: pick.x, y: pick.y }; u.searchT = 6;   /* v8.7.8 도발 */
      seen[0] = pick;
      if (!was){ const dark = !litAt(W, seen[0].x, seen[0].y), sm = !!u.smell && dist(u, seen[0]) <= u.smell && (dark || !u.nv);
        if (W.stance && !W.stance[u.side]) W.sqT = 0;   // v5.4 처음 발견 → 곧바로 대치 판단
        L(W, { k: 'spot', a: u.i, b: seen[0].i, nv: u.nv && dark && !sm, smell: sm && (dark || !losClear(W.map, u.x, u.y, seen[0].x, seen[0].y)), vis: !!u.seenBy }); alertNear(W, u, seen[0]);
        if (u.side === 1 && !W.alarm1){ W.alarm1 = { t: W.t, by: u.i, b: seen[0].i, x: seen[0].x, y: seen[0].y, surprise: surpriseEst(W) }; L(W, { k: 'sentry', side: 1, a: u.i, b: seen[0].i, grp: roamN(W, u), surprise: W.alarm1.surprise, d: +dist(u, seen[0]).toFixed(1), vis: true }); } }   // v6.2 처음 본 쪽 → 경보
    } else {
      if (u.state === 'hunt') u.state = 'search';
      // 보이진 않지만 감지한 상대 (냄새 · 불빛 · 소리) → 그 대략적인 자리 쪽으로
      if (u.state !== 'search' || !u.last){
        const s = foes.map(f => [f, u.sense[f.i]]).filter(([f, x]) => fresh(W, x, 2)).sort((a, b) => Math.hypot(a[1].x - u.x, a[1].y - u.y) - Math.hypot(b[1].x - u.x, b[1].y - u.y))[0];
        if (s){ u.state = 'search'; u.last = { x: s[1].x, y: s[1].y }; u.searchT = 5; }
      }
    }
    return;
  }
  // 자리를 잡은 동료 (stay): 그 자리에서 stayLeash 안의 적만. 아니면 주인공 둘레 leash 안 (주인공은 어디든)
  if (u.stay && !me && !u.crawl && !u.down){   // v7.9.5 임시 자리는 정지 명령이 아님 — 팀이 멀어지고 교전 소리가 나면 스스로 합류 (명시적 제자리 명령은 u.order 라 여기 안 옴)
    const J = R.rejoin || {}, k = isFar(u) ? (J.ranged || 2) : 1, mates = W.units.filter(a => a.alive && a !== u && a.side === 0 && !a.down && !a.crawl);
    if (mates.length){ const nearest = Math.min(...mates.map(a => dist(a, u))), dH = hero && !me ? dist(hero, u) : nearest;
      const noise = (W.eng && W.eng.open) || (W.noises || []).some(n => W.t - n.t0 < 6 && Math.hypot(n.x - u.x, n.y - u.y) < 22);
      const alone = nearest > (J.near || 6) * k, far = alone || dH > (J.hero || 14) * k; u.farT = far ? (u.farT || 0) + 0.2 : 0; u.aloneT = alone ? (u.aloneT || 0) + 0.2 : 0;   /* v7.26.1 둘레에 아무도 없음 = 고립 */
      if ((far && noise && u.farT >= (J.t || 1.2)) || u.aloneT >= (J.idle || 4)){ L(W, { k: 'rejoin', a: u.i, d: +Math.min(nearest, dH).toFixed(1), why: noise ? '교전 소리' : '대열이 멀어짐', vis: true }); u.lastDec = { t: W.t, s: `동료와 ${Math.min(nearest, dH).toFixed(0)}칸 떨어짐${noise ? ' · 교전 소리' : ''} — 지키던 자리를 풀고 합류` }; u.stay = null; u.farT = 0; u.aloneT = 0; u.state = hero && !me ? 'follow' : 'explore'; setMood(W, u, '합류'); } } }
  const lead = leadOf(W, u) || hero, anchor = u.stay || (lead && lead !== u ? lead : u); let lim = u.stay ? R.stayLeash || 4 : R.leash;
  const rm = roeOf(W, u);
  if (rm === 'smart' && W.eng && W.eng.out) lim = Math.min(lim, (R.roe || {}).outLim || 4.5);   // v7.9 열세로 싸움이 열렸으면 제 자리 둘레에서만 막음 (쫓아 나가지 않음)
  const near0 = Math.max(2.5, isFar(u) ? 0 : u.rng + 1);   /* v8.7.3 지킴이도 몸에 붙은 적은 봄 */
  const seen = foes.filter(f => canSee(W, u, f) && ((me && !u.stay) || dist(f, anchor) <= lim || (u.stay && dist(f, u) <= near0))).sort((a, b) => dist(u, a) - dist(u, b));
  if (u.stay && seen.some(f => dist(f, u) <= near0) && Math.hypot(u.x - u.stay.x, u.y - u.stay.y) > 2.5) u.stay = { x: u.x, y: u.y };   /* v8.7.3 싸움이 붙은 곳이 새 자리 (싸우다 옛 자리로 물러나 동료를 두고 가던 것) */
  if (rm !== 'free'){   // v7.9 교전 규칙이 막는 상대는 거름
    const blocked = []; for (let k = seen.length - 1; k >= 0; k--){ const why = roeBlock(W, u, seen[k]); if (why){ blocked.push([seen[k], why]); seen.splice(k, 1); } }
    if (!seen.length && blocked.length){ roeNote(W, u, blocked[blocked.length - 1][0], blocked[blocked.length - 1][1]); u.target = null; u.state = u.stay ? 'stay' : me || !hero ? 'explore' : 'follow'; return; }
  }
  if (seen.length){
    // v5.0 역할: 미드필더는 상대 전선 뒤 (사수 · 치유) · 막고 서지 않은 쪽, 공격수는 잡을 수 있는 (다친 · 동료와 맞붙은) 쪽을 고름. 지금 상대가 크게 나쁘지 않으면 그대로
    let pick = seen[0];
    // v5.2 떼어 내기: 사수 · 구급 · 다친 · 넘어진 동료에게 달라붙은 근접 상대를 먼저 (내가 다른 상대와 맞붙어 있지 않으면). 가까이 넘어진 상대는 마무리
    const busy = W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < 0.6 && focusOf(W, f) === u);
    const pv = !isFar(u) && !u.crawl && !busy ? seen.filter(f => dist(u, f) < 4.5 && peelOf(W, u, f)).sort((a, b) => dist(u, a) - dist(u, b))[0] : null;
    if (pv){ if (u.target !== pv){ u.waitT = 0; L(W, { k: 'peel', a: u.i, b: pv.i, v: peelOf(W, u, pv).i }); } u.state = 'fight'; u.target = pv; return; }
    const pz = !u.crawl && (isFar(u) || !busy) ? seen.filter(f => prone(W, f) && (isFar(u) ? gap(u, f) < u.rng : dist(u, f) < 4)).sort((a, b) => dist(u, a) - dist(u, b))[0] : null; if (pz) pick = pz;   // 넘어진 상대에게 몰려가 확인사살
    if (u.role === '미드필더' || u.role === '공격수' || u.role === '사수'){
      const fc = W.cmdFocus0 && W.t - W.cmdFocus0.t < 8 ? W.cmdFocus0.b : null, fcS = (() => { const Dq = u.sqLead != null ? W.units[u.sqLead] : null; return Dq && Dq.alive && Dq.sqFocus && W.t - Dq.sqFocus.t < ((W.rules.sq || {}).callT || 6) && dist(Dq, u) <= cmdRange(W, Dq) ? Dq.sqFocus.b : null; })(), sc = f => -dist(u, f) * 0.8 + roleBias(W, u, f) + (f.i === fc ? 1.2 : 0) + (f.i === fcS ? (W.rules.sq || {}).bonus || 1.2 : 0) + (W.hm && W.hm.pins.has(f.i) && !W.hm.pins.get(f.i).includes(u.i) ? (W.rules.hm || {}).bonus || 1.6 : 0);   // v7.4 지휘관이 마지막으로 정한 공격 표적을 함께 노림 (8초)   // v7.9.4 동료가 붙들어 선 상대 (망치와 모루)
      pick = seen.reduce((a, b) => sc(b) > sc(a) ? b : a, seen[0]);
      if (u.target && u.target.alive && seen.includes(u.target) && sc(pick) < sc(u.target) + 1) pick = u.target;
    }
    if (u.altLock && W.t < u.altLock.until && u.target && u.target.alive && u.target.i === u.altLock.b && seen.includes(u.target)) pick = u.target;   /* v8.7.3 막힌 표적에서 옮겨 온 표적은 잠시 그대로 */
    pick = tauntOf(W, u, pick, seen); if (u.target !== pick) u.waitT = 0; u.state = 'fight'; u.target = pick; return;   /* v8.7.8 도발 */
  }
  // 비명으로 정확히 안 자리 (2.5초 안, 8칸 안) → 몰려감
  const sx = foes.map(f => [f, u.sense[f.i]]).filter(([f, s]) => s && s.exact && W.t - s.t < 2.5 && dist(u, f) <= 8 && W.t >= (u.chaseNo || 0) && !(rm !== 'free' && roeBlock(W, u, f))).sort((a, b) => dist(u, a[0]) - dist(u, b[0]))[0];
  if (sx){ u.state = 'fight'; u.target = sx[0]; u.last = { x: sx[1].x, y: sx[1].y }; return; }
  // v5.5 동료가 불러 준 자리 (브리핑 연동): 내가 못 봐도 동료가 본 상대 쪽으로 — 1초 안 소식, 지키는 자리 (stay) · 주인공 둘레 안만.
  // 눈이 먼 쪽은 사수면 따라가지 않고, 근접은 2.5칸 안이면 더듬어 다가감
  const cl = foes.map(f => [f, u.sense[f.i]]).filter(([f, s]) => s && s.call && W.t - s.t < 1 && ((me && !u.stay) || Math.hypot(s.x - anchor.x, s.y - anchor.y) <= lim) && !(u.blind && (isFar(u) || Math.hypot(s.x - u.x, s.y - u.y) > 2.5)) && W.t >= (u.chaseNo || 0) && !(rm !== 'free' && roeBlock(W, u, f))).sort((a, b) => Math.hypot(a[1].x - u.x, a[1].y - u.y) - Math.hypot(b[1].x - u.x, b[1].y - u.y))[0];
  if (cl){ u.state = 'fight'; u.target = cl[0]; u.last = { x: cl[1].x, y: cl[1].y }; return; }
  u.target = null;
  u.state = u.stay ? 'stay' : me || !hero ? 'explore' : 'follow';   // 주인공이 쓰러지면 지휘관 (v8.7.3) 이 기준
}

// v7.12 우회 (Shift + 이동 · 공격): 경유점까지 먼저 (가는 길엔 싸우지 않음) — 닿거나 · 노린 적이 2.5칸 안이거나 · 길이 없거나 · 25초가 지나면 본래 명령대로
function viaStep(W, u, o, dt){
  const t = ['attack', 'palm', 'charge'].includes(o.k) && o.b != null ? W.units[o.b] : null, d = Math.hypot(u.x - o.via.x, u.y - o.via.y), nearT = o.k === 'charge' ? 1.6 : 2.5;   // v7.15 팜 버스트 · 돌진도 우회 (돌진은 돌진 거리 안쪽까지만 붙어도 돌아감)
  if (o.via.t0 == null){ o.via.t0 = W.t; o.via.pts = viaCurve(W, u, o, t); o.via.k = 0; }   /* v8.4.1 포물선 위의 점들 */
  const P = o.via.pts && o.via.pts.length ? o.via.pts : [o.via]; while (o.via.k < P.length - 1 && Math.hypot(u.x - P[o.via.k].x, u.y - P[o.via.k].y) < 1.0) o.via.k++;
  const q = P[Math.min(o.via.k || 0, P.length - 1)], dq = Math.hypot(u.x - q.x, u.y - q.y), last = (o.via.k || 0) >= P.length - 1;
  const done = last && dq < 0.7 ? '닿음' : t && (!t.alive || gap(u, t) < nearT) ? '노린 적이 가까움' : W.t - o.via.t0 > 25 ? '너무 오래 걸림' : null;
  if (done){ o.viaOK = true; L(W, { k: 'viaDone', a: u.i, why: done, vis: u.side === 0 || !!u.seenBy }); return false; }
  setMood(W, u, '우회'); setGoal(W, u, q.x, q.y); follow(W, u, dt);
  if (!u.path){ o.viaOK = true; L(W, { k: 'viaDone', a: u.i, why: '길이 없음', vis: u.side === 0 || !!u.seenBy }); return false; }
  return true;
}
// v7.12 우회 경유점: (tx, ty) 까지 곧장 가는 길에서 옆으로 크게 — 아는 적이 적은 쪽 (아군은 본 · 보고받은 자리만) · 적에게서 먼 곳 · 갈 수 있는 곳. side +1 = 가는 쪽의 오른쪽
// v8.4.1 우회 곡선: 출발점 P0 · 경유점 V · 목적지 P2 — V 를 지나는 2차 베지어 (조절점 C = 2V − (P0 + P2) / 2) 위의 점 (바위 · 벽 칸은 건너뜀). 마지막 점을 밟으면 본래 명령대로 목적지로
function viaCurve(W, u, o, t){
  const V = o.via, P2 = t ? { x: t.x, y: t.y } : o.x != null ? { x: o.x, y: o.y } : null; if (!P2) return [V];
  const cx = 2 * V.x - (u.x + P2.x) / 2, cy = 2 * V.y - (u.y + P2.y) / 2, S = (W.rules.detour || {}).curve || [0.2, 0.35, 0.5, 0.65, 0.8], out = [];
  for (const s of S){ const a = (1 - s) * (1 - s), b = 2 * (1 - s) * s, c = s * s, x = a * u.x + b * cx + c * P2.x, y = a * u.y + b * cy + c * P2.y;
    if (s === 0.5){ out.push({ x: V.x, y: V.y }); continue; } if (x < 1 || y < 1 || x > W.map.W - 1 || y > W.map.H - 1 || boxRock(W, x, y, 0.4)) continue; out.push({ x: +x.toFixed(2), y: +y.toFixed(2) }); }
  return out.length ? out : [V];
}
function detourVia(W, L, tx, ty){
  const DT = W.rules.detour || {}, S = L[0].side, cx = L.reduce((a, u) => a + u.x, 0) / L.length, cy = L.reduce((a, u) => a + u.y, 0) / L.length, dx = tx - cx, dy = ty - cy, Ld = Math.hypot(dx, dy);
  if (Ld < (DT.min || 3)) return null;
  const nx = -dy / Ld, ny = dx / Ld;
  const F = W.units.filter(f => f.alive && !f.down && f.side !== S).map(f => S === 0 ? (f.seenBy ? f : picAt(W, 0, f)) : (W.units.some(e => e.alive && e.side === S && (canSee(W, e, f) || fresh(W, e.sense[f.i], 6))) ? f : null)).filter(Boolean);
  const thr = sg => F.reduce((a, p) => { const c = ((p.x - cx) * nx + (p.y - cy) * ny) * sg, al = ((p.x - cx) * dx + (p.y - cy) * dy) / Ld; return a + (c > -0.5 ? (al > -2 && al < Ld + 2 ? 1 : 0.4) / (1 + Math.max(0, c) * 0.15) : 0); }, 0);   /* 그 쪽에 있는 적 (길에서 멀수록 조금 덜) */
  const tR = thr(1), tL = thr(-1), sides = tR <= tL ? [1, -1] : [-1, 1];
  for (const sg of sides){
    let best = null, bs = -1e9;
    for (const k of [0.5, 0.4, 0.6]) for (const m of [1, 1.2, 0.8, 0.6]){
      const Dd = Math.min(DT.max || 6, Math.min(DT.max || 6, Math.max(DT.min || 2.5, Ld * (DT.k || 0.35))) * m),   /* v8.4.1 옆으로 최대 6칸 */ x = cx + dx * k + nx * sg * Dd, y = cy + dy * k + ny * sg * Dd;
      if (x < 1 || y < 1 || x > W.map.W - 1 || y > W.map.H - 1 || boxRock(W, x, y, 0.45)) continue;
      if (!findPath(W.map, cx, cy, x, y) || !findPath(W.map, x, y, tx, ty)) continue;
      const near = F.length ? Math.min(...F.map(p => Math.hypot(p.x - x, p.y - y))) : 99, sc = Math.min(near, (DT.near || 3) * 2) - Math.abs(m - 1) * 0.8 - Math.abs(k - 0.5) * 2;
      if (sc > bs){ bs = sc; best = { x: Math.floor(x) + 0.5, y: Math.floor(y) + 0.5, side: sg, near: +Math.min(near, 99).toFixed(1) }; }
    }
    if (best) return { ...best, alt: sg !== sides[0], thr: [+tR.toFixed(2), +tL.toFixed(2)], known: F.length };
  }
  return null;
}
/* ---------- v4.0 싸움: 발견 → 경계 → 기회가 있을 때 공격 ----------
   살아남기: 위협을 보면 막거나 (방패 · 대검) 사선을 벗어남. 체력이 바닥이면 물러남 · 치유사 쪽으로
   기다리기: 사선이 막혔거나 아군이 사선에 있으면 쏘지 않음. 맞힐 확률이 낮으면 아낌 (탄약 · 총성)
   노리기: 상대가 공격 중 (틈) · 옆이나 뒤가 보임 · 방어를 못 함 → 공격. 대담함이 높을수록 덜 기다림 */
/* v7.17 기습 가속: 근접이 상대에게 붙기 마지막 d 칸 — 배후 · 측면 · 들키지 않음만큼 빨라짐 (팜 버스트 · 장도리처럼 덮침). 피해 보정은 원래대로 (배후 > 측면) */
function lungeChk(W, u, t){
  const LG = W.rules.lunge || {}; if (!LG.on || !t || !t.alive || t.side === u.side || isFar(u) || u.crawl || u.lie || u.act) return;
  const g = gap(u, t); if (g > (LG.d || 1.6) || g <= u.rng + 0.05) return;
  const sd = sideOf(W, t, u), un = !canSee(W, t, u) || !aware(W, t, u), k = 1 + (sd === 'back' ? LG.back || 0.25 : sd === 'side' ? LG.side || 0.1 : 0) + (un ? LG.unseen || 0.25 : 0);
  if (k <= 1.001) return;
  if (W.t >= (u.lungeT == null ? -9 : u.lungeT) + 0.5) L(W, { k: 'lunge', a: u.i, b: t.i, sd, un, mul: +k.toFixed(2), vis: u.side === 0 || !!u.seenBy });
  u.lungeT = W.t + (LG.t || 0.2); u.lungeK = k;
}
function fight(W, u, t, dt, see, ordered){
  if (!ordered){ const H = W.units.find(m => m.alive && m !== u && m.side === u.side && m.heldBy != null); const g = H && W.units[H.heldBy];   /* v8.7.4 붙잡힌 동료를 구함 — 붙잡은 상대를 침 (끊을 수 있음) */
    if (g && g.alive && g !== t && g.side !== u.side && dist(u, g) < 9 && canSee(W, u, g)){ t = g; see = true; u.target = g; u.state = u.side ? 'hunt' : 'fight'; setMood(W, u, H.name + ' 구하기', g.i); } }
  if (!ordered && t.stoneT != null && W.t < t.stoneT){   /* v8.7.4 방어모드인 상대 (피해 1) — 다른 상대가 보이면 그쪽 · 아니면 손 밖에서 기다림 */
    const o2 = W.units.filter(e => e.alive && !e.down && e.side === t.side && e !== t && !(e.stoneT != null && W.t < e.stoneT) && canSee(W, u, e)).sort((p, q) => dist(u, p) - dist(u, q))[0];
    if (o2 && dist(u, o2) < 12){ t = o2; u.target = o2; }
    else { u.last = { x: t.x, y: t.y }; if (gap(u, t) < (t.rng || 0.5) + 0.8){ const p = fallbackPt(W, u, t, 1.2); if (p){ setMood(W, u, '방어모드 — 물러나 기다림', t.i); goTo(W, u, p.x, p.y, dt); return; } } stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '방어모드 — 기다림', t.i); return; } }
  if (u.crawl && !isFar(u)){ if (see) crawlAway(W, u, t, dt); else stop(u); return; }   // v5.2 기어다님: 근접은 못 함
  lungeChk(W, u, t);   /* v7.17 기습 가속 */
  if (!ordered && specAuto(W, u, t, see)) return;   /* v7.19.1 고유 기술 (스스로) */
  if (!ordered && assnAI(W, u, dt)) return;   // v7.6 어둠 속에서 등이 열린 상대를 숨어서 노림
  if (u.sqStl && !u.asAI && !(u.sq && u.sq.k === 'flank' && !u.sq.done)){ u.stealth = false; u.sqStl = false; }   // 우회가 끝났고 노릴 등이 없으면 숨기를 풂
  if (!see){   // 안 보이면 마지막으로 본 자리로 (적은 냄새 · 총성으로 안 자리 포함)
    const p = u.last; if (!p) return;
    if (!ordered && u.side === 0){   // v7.9.5 추적 한도: 보이지 않는 상대를 밑도 끝도 없이 쫓지 않음
      const CH = W.rules.chase || {}; if (u.chaseB !== t.i || W.t - (u.chaseL || -9) > 1.5){ u.chaseB = t.i; u.chaseT0 = W.t; u.chaseX = { x: u.x, y: u.y }; } u.chaseL = W.t;
      if (W.t - u.chaseT0 > (CH.max || 8) || dist(u, u.chaseX) > (CH.dist || 12)){ u.chaseNo = W.t + (CH.cd || 10); u.chaseB = null; u.target = null; u.state = u.stay ? 'stay' : 'follow'; setMood(W, u, '추적 포기');
        u.lastDec = { t: W.t, s: `${t.name}이(가) 안 보인 채 ${Math.round(W.t - u.chaseT0)}초 · ${dist(u, u.chaseX).toFixed(0)}칸 — 추적을 그만둠` }; L(W, { k: 'chaseEnd', a: u.i, b: t.i, sec: Math.round(W.t - u.chaseT0), d: +dist(u, u.chaseX).toFixed(1), vis: true }); return; } }
    if (!ordered && u.side === 0 && roeOf(W, u) !== 'free'){   // v7.9.2 놓친 상대를 본대에서 멀리 쫓지 않음 (재집결) — 충동이 크면 예외
      const hero0 = ancOf(W), mates0 = W.units.filter(a => a.alive && !a.down && a.side === 0 && a !== u), tet = (W.rules.roe || {}).chase || 6.5;   /* v8.7.3 기준 */
      const dMain = Math.min(...[...mates0.map(a => dist(u, a)), u.stay ? dist(u, u.stay) : 1e9, hero0 && hero0 !== u ? dist(u, hero0) : 1e9]), anc = mates0.length || u.stay || hero0 ? { d: dMain } : null;   // v7.9.3 가장 가까운 동료 · 주인공 · 지키는 자리 중 가까운 쪽까지
      if (anc && anc.d > tet && !impulseOK(W, u, t, 'smart')){ if (W.t - (u.regT || -9) > 5){ u.regT = W.t; L(W, { k: 'regroup', a: u.i, b: t.i, d: +anc.d.toFixed(1), vis: true }); u.lastDec = { t: W.t, s: `본대에서 ${anc.d.toFixed(1)}칸 — 놓친 ${t.name} 추격을 그만두고 돌아감` }; } u.target = null; u.state = u.stay ? 'stay' : 'follow'; setMood(W, u, '재집결'); return; } }
    // 물러나던 쪽 (체력 바닥 · 탄약 없음 · 겁 있음) 은 쫓아가지 않고 그 자리에서 버팀 — 물러남 ↔ 추적 와리가리 없음
    if (!ordered && (u.hp / u.max < 0.3 || (u.ammoMax != null && u.ammo === 0)) && u.bold < 0.5){ stop(u); u.fg = Math.atan2(p.y - u.y, p.x - u.x); setMood(W, u, '버팀', t.i); return; }
    setMood(W, u, u.sense[t.i] && u.sense[t.i].call && W.t - u.sense[t.i].t < 1 ? (u.blind ? '더듬어 감' : '동료가 부른 쪽으로') : '추적', t.i);   // v5.5 브리핑 연동
    goTo(W, u, p.x, p.y, dt); return;
  }
  u.last = { x: t.x, y: t.y };
  if (!ordered && survive(W, u, t, dt)) return;
  if (!ordered && cover(W, u, t, dt)) return;
  if (!ordered && u.side === 1 && u.sq && flankStep(W, u, t, dt)) return;   // v5.2 우회 조
  if (!ordered && tryThrow(W, u, t, false, dt)) return;   // 공격 명령일 땐 던지지 않음 (던지기는 따로 '투창' 명령)
  if (!ordered && u.pact && (u.side === 1 || !u.order) && !AI6.includes('pact') && pactStep(W, u, dt)) return;   // v7.4 아군 자동 전투도   // v6.0 짧은 역할 약속 (살아남기 · 숨기 · 우회 조 · 투창 다음, 보통 싸움 앞)
  if (!ordered && u.stalk && stalk(W, u, t, dt)) return;
  if (!ordered && u.pack && !isFar(u)){ packHunt(W, u, t, dt); return; }
  // 적의 보통 근접 · 창병: 손 닿는 거리가 아니면 자기 편 방패 뒤에 섬 (대치). 창이 땅에 있으면 안전할 때 줍기
  if (!ordered && u.role === '미드필더' && !u.pack && !isFar(u) && midfield(W, u, t, dt)) return;   // v5.0 미드필더: 전선을 돌아 들어감 · 치고 빠짐
  if (!ordered && u.side === 1 && u.role !== '전선' && u.role !== '미드필더' && !isFar(u) && gap(u, t) > u.rng + 0.6){
    if (retrieveSpear(W, u, dt)) return;
    if (scavenge(W, u, dt)) return;   // v5.6
    if (behindCover(W, u, dt)) return;
  }
  if (!ordered && u.side === 1 && unarmed(u) && !u.noArms && u.kit0 && !ITEM_NATURAL.includes(u.kit0.weapon || '맨손') && !cornered(W, u) && !AI6.includes('rearm') && rearm(W, u, t, dt)) return;   // v6.0 무기를 잃었으면 맨손으로 맞서지 않음
  if (!ordered && flailKeep(W, u, t, dt)) return;   /* v8.7.4 철퇴: 중거리를 지킴 (C2) */
  if (!ordered && avoidGiant(W, u, t, dt)) return;   // v5.3 거구 앞에 서지 않음
  if (!ordered && pikeStep(W, u, t, dt)) return;   // v5.3 창 2열
  if (u.canCharge && !isFar(u) && tryCharge(W, u, t, !!ordered && u.cls === '기동', ordered)) return;   // v7.12 기동 근접 (청광묵) 은 공격 명령이면 돌격을 아끼지 않음 (먼 거리를 단숨에)   // v5.3 돌격 (빈틈 · 버팀을 따져) · v5.4 대치 중엔 지휘를 기다림 (명령이면 예외)   // v5.1 돌진으로 들어감
  if (!ordered && formLeadHold(W, u, t, dt)) return;   /* v8.7.5 공세선: 편대장은 대형이 갖춰질 때 다가감 */
  if (isFar(u)) shoot(W, u, t, dt, ordered); else melee(W, u, t, dt, ordered);
}
// v8.7.4 철퇴 (모닝스타 — 중거리를 지키는 인원): 붙은 상대 (close 칸 안) 가 치려고 준비하면 (교전 구속이 없음 · 그 일격은 헛침) mid 칸으로 물러섬
// 손이 빈 상대 (걸어서 빠지면 틈에 맞음) · 휘청 · 넘어짐 · 거두는 중 (빈틈) 이면 그대로 침 · 궁지면 그대로
function flailKeep(W, u, t, dt){
  const FL = flailOf(W, u); if (!FL || isFar(t) || !t.alive || t.down || cornered(W, u)) return false;
  const g = gap(u, t); if (g >= (FL.close || 0.9)) return false;
  if (!(t.act && t.act.phase === 'wind')) return false;   // 치려고 준비할 때만 — 손이 빈 상대 · 빈틈은 그대로 침
  const p = fallbackPt(W, u, t, (FL.mid || 1.6) - g + 0.3); if (!p) return false;
  setMood(W, u, '중거리 — 물러섬', t.i); goTo(W, u, p.x, p.y, dt); return true;
}
// 개 (포위 사냥): 앞의 개가 짖으며 붙잡아 두고, 나머지는 비어 있는 옆 · 뒤로. 틈이 나면 물고 곧바로 거리를 벌림 (계속 괴롭힘)
function packHunt(W, u, t, dt){
  const R = W.rules, g = gap(u, t);
  const pack = W.units.filter(o => o.alive && o.pack && o.side === u.side && o.target === t);
  const lead = (pack.length ? pack : [u]).reduce((a, b) => dist(b, t) < dist(a, t) ? b : a) === u;
  const ring = t.r + u.r + Math.max(t.rng, 0.35) + 0.8;
  if (lead && W.t - u.barkAt >= R.barkT && g < 4.5) bark(W, u);
  // 문 뒤 1.2초: 물러나 거리를 벌림
  if (u.atkT > 0 && W.t - u.atkT < 1.2){
    const d = dist(u, t) || 1, gx = t.x + (u.x - t.x) / d * ring, gy = t.y + (u.y - t.y) / d * ring;
    setMood(W, u, '거리 벌리기', t.i);
    if (!rock(W.map, gx, gy) && roomAt(W, gx, gy).open > 2) goTo(W, u, gx, gy, dt);
    else { const p = fallbackPt(W, u, t, 1.2); if (p) goTo(W, u, p.x, p.y, dt); else { stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); } }
    return;
  }
  // 틈이 없으면 물지 않고 거리를 유지 (지루해서 달려들지 않음)
  const op = (t.act && t.act.b !== u.i) || sideOf(W, t, u) !== 'front' || W.t < t.pinT || (t.canGuard && !inGuard(W, t, u));
  if (op){
    if (inReach(u, t)){ startAct(W, u, t, op ? '물기' : '밀어붙임'); return; }
    if (g < 2.8){ setMood(W, u, '달려듦', t.i); goTo(W, u, t.x, t.y, dt); return; }
  }
  u.waitT += dt;
  // 자리: 앞의 개는 상대가 바라보는 쪽에서, 나머지는 다른 개 · 상대 편과 가장 먼 방향 (빈 옆 · 뒤)
  let ang;
  if (lead) ang = t.face;
  else {
    const taken = [...pack.filter(o => o !== u), ...W.units.filter(o => o.alive && o.side === t.side && o !== t && dist(o, t) < 2.5)].map(o => Math.atan2(o.y - t.y, o.x - t.x));
    const cur = Math.atan2(u.y - t.y, u.x - t.x);
    let bs = -1e9;
    for (let k = 0; k < 12; k++){
      const a = k * Math.PI / 6, px = t.x + Math.cos(a) * ring, py = t.y + Math.sin(a) * ring;
      if (rock(W.map, px, py) || roomAt(W, px, py).open <= 2) continue;   // v5.0 구석 자리는 피함
      const sp = taken.length ? Math.min(...taken.map(b => angDiff(a, b))) : Math.PI;
      const sc = sp + 0.5 * angDiff(a, t.face) - 0.25 * angDiff(a, cur);
      if (sc > bs){ bs = sc; ang = a; }
    }
    if (ang == null) ang = cur;
  }
  const px = t.x + Math.cos(ang) * ring, py = t.y + Math.sin(ang) * ring;
  setMood(W, u, lead ? '짖으며 위협' : '포위', t.i);
  if (!rock(W.map, px, py) && Math.hypot(px - u.x, py - u.y) > 0.25) goTo(W, u, px, py, dt);
  else { stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); }
}
// 어둠 속 우회 (검사 · 저격총수): 자기 자리가 어두우면 '안 보일 것' 이라 믿음 (틀릴 수 있음 — 냄새 · 새 횃불 · 몸이 닿는 거리).
// 근접은 상대 뒤쪽 어둠으로 돌아 들어가 등을 노림, 원거리는 어두운 자리에서만 쏨. 친 뒤 둘레에 상대가 여럿이면 어둠으로 물러남
// '안 보일 것' (적의 짐작, 틀릴 수 있음): 어둡거나, 둘레 상대 모두의 등 뒤 (바라보는 방향에서 120° 넘게)
function covert(W, u, x, y){
  if (!glowAt(W, x, y)) return true;   // v7.7 어스름은 실루엣으로 보임
  const back = (180 - W.rules.frontArc) * Math.PI / 180;
  return W.units.every(f => !f.alive || f.side === u.side || Math.hypot(f.x - x, f.y - y) > W.rules.sight || !canSee(W, u, f) || angDiff(f.face, Math.atan2(y - f.y, x - f.x)) > back);
}
// strict: 가는 길 (곧은 길) 도 끝까지 안 보일 것 · 막힘 없음 — 우회가 불빛을 가로지르다 되돌아오지 않게
function darkSpot(W, u, cands, strict){
  let best = null, bs = -1e9;
  for (const [x, y, s0] of cands){
    if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r) || !covert(W, u, x, y)) continue;
    let lit = 0; for (let k = 1; k < 5; k++){ const q = k / 5; if (!covert(W, u, u.x + (x - u.x) * q, u.y + (y - u.y) * q)) lit++; }
    if (strict && (lit || !fatClear(W.map, u.x, u.y, x, y, u.r * 0.92))) continue;
    const s = s0 - Math.hypot(x - u.x, y - u.y) * 0.5 - lit * 1.5 - (roomAt(W, x, y).open <= 3 ? 1.5 : 0);
    if (s > bs){ bs = s; best = { x, y }; }
  }
  return best;
}
function stalk(W, u, t, dt){
  if (!covert(W, u, u.x, u.y) && !(u.spot && u.spot.dark && W.t - u.spot.t < 0.6)){
    // 불빛 안에 섰다 → 들켰다고 보고 가까운 어둠으로 (원거리), 근접은 보통 싸움 (불리하면 트인 어둠 쪽으로 물러섬)
    if (!isFar(u)) return false;
  }
  const near = W.units.filter(f => f.alive && f.side !== u.side && dist(f, u) < 2.6).length;
  if (u.atkT > 0 && W.t - u.atkT < 2.2 && near >= 2){   // 친 뒤 몰려들면 어둠으로 빠짐
    const d = dist(u, t) || 1, cands = [];
    for (let k = -3; k <= 3; k++){ const a = Math.atan2(u.y - t.y, u.x - t.x) + k * 0.4; for (const r of [1.5, 2.5]) cands.push([u.x + Math.cos(a) * r, u.y + Math.sin(a) * r, 0]); }
    const p = darkSpot(W, u, cands); if (!p) return false;
    setMood(W, u, '어둠으로 물러남', t.i); goTo(W, u, p.x, p.y, dt); return true;
  }
  if (isFar(u)){
    if (covert(W, u, u.x, u.y)) return false;   // 안 보일 자리면 보통 사격 판단 (사선 · 확률)
    const cands = []; for (const r of [0.8, 1.5, 2.3]) for (let k = 0; k < 12; k++){ const a = k * Math.PI / 6; const x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r; cands.push([x, y, Math.hypot(x - t.x, y - t.y) - u.r - t.r <= u.rng - 0.2 && losClear(W.map, x, y, t.x, t.y) ? 2 : 0]); }
    const p = darkSpot(W, u, cands); if (!p) return false;
    u.spot = { t: W.t, b: t.i, p, dark: true };
    setMood(W, u, '어둠으로', t.i); goTo(W, u, p.x, p.y, dt); return true;
  }
  const sd = sideOf(W, t, u), f = focusOf(W, t), busy = !!t.act || (f && f !== u);
  if (inReach(u, t)){ if (sd !== 'front' || busy){ startAct(W, u, t, '암살'); return true; } return false; }
  // 친 뒤 살아 나갈 길: 상대 둘레에 상대 편이 둘 이상이면 들어가지 않고 어둠에서 기다림 (갈라지는 순간을 노림)
  if (supportOf(W, t) >= 2 && !busy){ u.waitT += dt; if (u.waitT > 12) return false; stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '숨어 지켜봄', t.i); return true; }
  if (sd === 'back' && gap(u, t) < 1.8){ setMood(W, u, '파고듦', t.i); goTo(W, u, t.x, t.y, dt); return true; }
  // 상대 등 뒤 반원 (바라보는 반대 ±60°) 의 어두운 자리로
  const cands = [];
  for (const r of [1.1, 1.7, 2.5]) for (let k = -3; k <= 3; k++){ const a = t.face + Math.PI + k * 0.35; cands.push([t.x + Math.cos(a) * r, t.y + Math.sin(a) * r, -Math.abs(k) * 0.3 - r * 0.4]); }
  const p = darkSpot(W, u, cands, true);
  u.waitT += dt;
  if (!p){ if (u.waitT > 8) return false; stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '숨어 지켜봄', t.i); return true; }
  setMood(W, u, '우회', t.i);
  if (Math.hypot(p.x - u.x, p.y - u.y) > 0.2) goTo(W, u, p.x, p.y, dt); else { stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); }
  return true;
}
// u 가 t 를 칠 틈이 있나 (보이는 모습만): 공격 준비 · 회복 중, 옆 · 뒤가 보임, 방어 자세가 없거나 무너짐
function openingOf(W, u, t){
  if (prone(W, t) || t.kb) return '넘어짐';   // v5.2
  if (W.t < (t.openT == null ? -9 : t.openT)) return '헛침 빈틈';   // v7.17
  if (t.act) return t.act.b === u.i && t.act.phase === 'wind' && inGuard(W, t, u) ? '' : '틈';
  if (sideOf(W, t, u) !== 'front') return '측면';
  if (!t.canGuard) return '맞붙음';
  if (!guardOn(W, t)) return '자세 무너짐';
  if (!inGuard(W, t, u)) return '빈 방향';   // 앞이지만 막는 폭 밖 (좁은 방어)
  return '';
}
// v6.5 따라잡을 자리: 달아나는 상대는 지금 자리가 아니라 닿을 때의 자리로 (최대 2초 앞) — 사수가 빠지며 쏘는 걸 쫓아다니기만 하지 않음
const leadPt = (W, u, t) => { const sp = Math.hypot(t.vx || 0, t.vy || 0); if (u.side !== 1 || sp < 0.8 || AI6.includes('lead')) return t; const k = Math.min(2, dist(u, t) / Math.max(0.5, spdNow(W, u)));
  const x = Math.max(0.6, Math.min(W.map.W - 0.6, t.x + (t.vx || 0) * k)), y = Math.max(0.6, Math.min(W.map.H - 0.6, t.y + (t.vy || 0) * k)); return rock(W.map, x, y) ? t : { x, y }; };
// v7.9.3 막고 선 상대 (방어 자세가 이쪽을 향함) 를 정면으로 밀어붙일 만한가 — 가벼운 몸이 무거운 방패를 들이받는 건 충동이 아니라 판단 실수. 아군 · 적 같음
function pushOK(W, u, t){
  if (t.act || !t.canGuard || !inGuard(W, t, u)) return true;
  const light = u.mass < t.mass * 0.45 && !(u.strMul > 1) && !u.canCharge && !u.canSweep;
  if (!light) return true;
  return t.post <= 45 || u.waitT > 7 || u.hp / u.max < 0.25;
}
function melee(W, u, t, dt, ordered){
  const R = W.rules;
  if (inReach(u, t)){
    const bw = bashWhy(W, u, t); if (bw){ startBash(W, u, t, bw); return; }   // v5.2 방패 밀치기
    if (!ordered && palmReady(W, u) && W.t >= (u.palmTryCd || -9)){ const why = palmNeed(W, u, t); if (why){ const P = PALM(W); if (gap(u, t) <= P.reach){ u.palmTry = 0; startPalm(W, u, t, why); return; }   // v6.7.2 [팜 버스트] 는 액티브 — 기본은 단검, 스스로는 꼭 필요한 순간만 (나머지는 플레이어의 명령)
      u.palmTry = (u.palmTry || 0) + dt; if (u.palmTry <= (P.step || 0.8)){ setMood(W, u, '바싹 파고듦', t.i); goTo(W, u, t.x, t.y, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x); return; } u.palmTry = 0; u.palmTryCd = W.t + 1.5; } }   // v6.7.3 완전 밀착해야 씀 — 단검 거리에서 한 걸음 더 파고듦 (step 초 안에 못 붙으면 그만두고 단검으로)
    const op = openingOf(W, u, t);
    if (!op && flankLeap(W, u, t)) return;   // v7.12 측후방 도약
    const fin = u.role === '공격수' && pHp(W, u.side, t) < 0.35 && !inGuard(W, t, u);   // v6.3 짐작한 체력   // 공격수: 다친 상대는 바로 마무리 (막고 선 방패 정면엔 안 들어감)
    if (ordered || op || cornered(W, u) || fin){ startAct(W, u, t, fin && !op ? '마무리' : op === '넘어짐' ? '넘어진 상대' : op === '틈' ? '틈을 노림' : op === '측면' ? '측면 공격' : op === '자세 무너짐' ? '자세 무너짐' : cornered(W, u) ? '반격' : '공격'); return; }
    // 막고 있는 상대: 기다리며 옆으로 돌거나, 대담하면 (또는 오래 기다리면) 밀어붙임
    u.waitT += dt;
    if (u.canBash && W.t >= u.bashCd && W.t >= u.brokenT && gap(u, t) <= 0.35 && W.rand() < dt * 0.35){ startBash(W, u, t, '밀어붙임'); return; }   // v5.2
    if (!ordered && !pushOK(W, u, t)){ u.lastDec = { t: W.t, s: `${t.name}의 방패가 막고 있어 정면으로 안 들어감 — 옆을 노림` }; if (W.t - (u.pushLogT || -9) > 6){ u.pushLogT = W.t; L(W, { k: 'pushNo', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); } }
    else if (W.rand() < dt * (u.bold * 0.6 + u.waitT * 0.12)){ startAct(W, u, t, '밀어붙임'); return; }
    const a = Math.atan2(u.y - t.y, u.x - t.x) + (u.i % 2 ? 1 : -1) * 0.9, d = flailOf(W, u) ? (kiteEng(W, u) && !t.act ? dist(u, t) : t.r + u.r + (flailOf(W, u).mid || 1.6)) : t.r + u.r + Math.min(u.rng, 0.3);   /* v8.7.4 철퇴는 틈을 기다리며 도는 자리도 철퇴 거리 (몸 옆으로 걸어 들어가 붙던 것) · 손이 빈 상대와 붙어 있으면 지금 거리로 돎 (걸어서 빠지면 틈에 맞음) */
    const gx = t.x + Math.cos(a) * d, gy = t.y + Math.sin(a) * d, gl = Math.hypot(gx - u.x, gy - u.y) || 1;
    if (!rock(W.map, gx, gy)) moveDir(W, u, (gx - u.x) / gl, (gy - u.y) / gl, dt * 0.5);
    u.fg = Math.atan2(t.y - u.y, t.x - u.x);
    setMood(W, u, '자리 잡기', t.i);
    return;
  }
  // 아직 손이 안 닿음: 다가갈 이유가 있을 때만 다가감
  // v5.5 다른 동료가 '맞붙어' 있을 때만 협공 (상대가 노리기만 하고 둘 다 떨어져 있으면 아님 — 셋이 서로 눈치만 보던 것)
  const f = focusOf(W, t), busyOther = !!(f && f !== u && f.side === u.side && gap(f, t) < Math.max(f.rng, t.rng) + 0.6);
  const stale = W.t - (W.atkWT || 0) > 5;   // v5.5 5초 넘게 아무도 치려 하지 않음 → 들어감
  const alone = !W.units.some(o => o.alive && o !== u && o.side === u.side);
  const frontGuard = !ordered && u.side === 0 && !t.act && t.canGuard && inGuard(W, t, u) && !pushOK(W, u, t);   // v7.9.3
  let go = ordered || (stale && !frontGuard) || (u.bold >= 0.65 && !frontGuard) || busyOther || !!t.act || prone(W, t) || isFar(t) || (u.waitT > 3 && !frontGuard) || !canSee(W, t, u) || alone || cornered(W, u) || (u.role === '공격수' && pHp(W, u.side, t) < 0.35);
  // v5.0 치고 나가기: 둘레 힘이 우세하면 (기준은 성향 — 대담할수록 작은 우위에도) 들어감. 한 번 나가면 1.5초는 (우위가 크게 꺾이지 않는 한) 그대로
  const push = u.side === 0 && !ordered && !go && !frontGuard && pushing(W, u, t);
  if (push) go = true;
  if (u.side === 1 && !ordered){
    // 적 (expert): 유리할 때만 들어감 — 상대가 고립 · 우리 편이 그 둘레에 더 많음 · 다른 이와 맞붙어 옆을 보임 · 다른 이를 치는 중
    const sup = supportOf(W, t), mine = W.units.filter(o => o.alive && o !== u && o.side === u.side && dist(o, t) <= 2.5).length;
    go = sup === 0 || mine >= sup + 1 || prone(W, t) || (busyOther && sideOf(W, t, u) !== 'front') || (!!t.act && t.act.b !== u.i) || (!canSee(W, t, u) && sideOf(W, t, u) !== 'front');
    if (cornered(W, u) || stale) go = true;   // v4.8 궁지 · 결단: 맞섬 (v5.5 오래 눈치만 보면 들어감)
    if (!go){
      // 불리함: 손 닿는 거리 밖에서 위협하며 방향을 붙듦. 다가오면 물러서되 트인 곳 · 동료 쪽으로 (구석 · 벽 피함).
      // 물러설 곳이 없거나, 동료 없이 혼자 3초 넘게 쫓기면 맞섬 (궁지 · 결단). 동료와 떨어져 혼자 노려보고 있으면 동료 쪽으로 합류
      const want = t.rng + R.reach + 0.5, g = gap(u, t), mates = groupMates(W, u);
      u.waitT += dt;
      if (g < want - (u.backing ? 0.05 : 0.4)){
        const p = fallbackPt(W, u, t, 1.4);
        u.backT = (u.backT || 0) + dt;
        if (!p || (p.room.open <= 2 && p.gain < 0.5)) corner(W, u, t, '궁지');
        else if (!mates.length && (u.backT > 3 || g < t.rng + 0.3)) corner(W, u, t, '결단');   // 혼자: 따라잡히면 먼저 침
        else { u.backing = true; setMood(W, u, '물러섬', t.i); backStep(W, u, t, p, dt); return; }
      } else {
        u.backing = false; u.backT = Math.max(0, (u.backT || 0) - dt * 0.5);
        const m = mates.length && !mates.some(o => dist(o, u) < 5) ? mates.sort((a, b) => dist(u, a) - dist(u, b))[0] : null;
        // 동료가 상대 너머 (같은 쪽 60° 안 · 상대보다 멂) 에 있으면 합류하러 상대 곁을 지나가지 않음
        const beyond = m && dist(u, t) < dist(u, m) && ((m.x - u.x) * (t.x - u.x) + (m.y - u.y) * (t.y - u.y)) > 0.5 * dist(u, m) * dist(u, t);
        if (m && !beyond){ setMood(W, u, '합류', m.i); goTo(W, u, m.x, m.y, dt); return; }
        if (g > want + 0.8){ setMood(W, u, '다가감', t.i); const lp = leadPt(W, u, t); goTo(W, u, lp.x, lp.y, dt); return; }
        footwork(W, u, t, dt, want); setMood(W, u, '위협', t.i); return;   // v5.2 발놀림
      }
      go = true;
    }
  }
  if (go){
    if (!ordered && !stale && !cornered(W, u) && !AI6.includes('scr') && screenApproach(W, u, t, dt)) return;   // v6.0 총구 앞으로 곧장 가지 않음 (방패 뒤로 · 틈을 기다림)
    // 다른 아군과 맞붙은 상대 → 그 아군 반대편 (상대의 옆 · 뒤) 으로 돌아 들어감 = 협공 · 포위
    if (busyOther && !ordered){
      // v5.2 협공 자리: 붙은 동료 반대쪽 · 옆 (겹치지 않게). 상대 등 뒤가 벽이 되는 쪽 (벽으로 몰아 넣기) 을 좋아함
      const p = approachPt(W, u, t, Math.atan2(t.y - f.y, t.x - f.x), [0, 0.9, -0.9, 1.6, -1.6, 2.2, -2.2]);
      setMood(W, u, '협공', t.i); goTo(W, u, p ? p.x : t.x, p ? p.y : t.y, dt); return;
    }
    if (flankLeap(W, u, t)) return;   // v7.12 측후방 도약
    if (!u.order && pounce(W, u, t)) return;   // v6.7.4 앞으로 도약 (달아나는 사수 · 빈틈 · 넘어진 상대)
    setMood(W, u, ordered ? '공격' : cornered(W, u) ? u.cornerK : push ? '치고 나감' : u.role === '공격수' && pHp(W, u.side, t) < 0.35 ? '마무리' : u.bold >= 0.65 ? '뛰어듦' : '다가감', t.i);
    const ap = gap(u, t) < 3 ? approachPt(W, u, t, Math.atan2(u.y - t.y, u.x - t.x), [0, 0.5, -0.5, 0.9, -0.9]) : null;   // v5.2 벽으로 몰아 넣는 쪽 · 큰 몸 앞에선 흩어짐
    const lp = leadPt(W, u, t); goTo(W, u, ap ? ap.x : lp.x, ap ? ap.y : lp.y, dt); return;
  }
  // 경계: 상대 손이 닿는 거리 바로 밖에서 기다림
  u.waitT += dt;
  const want = t.rng + R.reach + 0.35, g = gap(u, t);
  if (g > want + 0.6){ setMood(W, u, '다가감', t.i); goTo(W, u, t.x, t.y, dt); return; }
  if (flankLeap(W, u, t)) return;   // v7.12 측후방 도약
  footwork(W, u, t, dt, want);   // v5.2 발놀림 (서 있지 않음)
  setMood(W, u, '경계', t.i);
}
/* ---------- v4.9 오사 확률 · 각 잡기 ---------- */
// 오사 확률 (jav = 투창): (x, y) 에서 t 를 쏘면 아군 몸에 먼저 걸릴 확률. launch 와 같은 갈래로 쏜 선 열 줄 (맞힘 4 · 빗나감 6, 명중률로 무게) 을
// 날아가는 끝 (사거리 + 2.5칸) · 바위까지 따라가 봄 — 대상 앞을 가로막은 아군도, 빗나가 대상 옆 · 뒤로 날아가는 선 위의 아군도.
// 아군 자리는 준비 시간 (+ lead) + 날아가는 시간 뒤의 자리 (움직이는 중이면 그 앞, 1.2초까지)
function ffOdds(W, u, t, x, y, lead, jav){
  const wp = (W.rules.weapons && W.rules.weapons[u.weapon]) || {}, J = jav ? JVu(W, u) : null, vel = J ? J.vel : wp.vel || 40;
  const d = Math.max(0.3, Math.hypot(t.x - x, t.y - y)), base = Math.atan2(t.y - y, t.x - x);
  const ox = u.x, oy = u.y; u.x = x; u.y = y; const p = J ? aimJ(W, u, t) : aimP(W, u, t); u.x = ox; u.y = oy;
  const L0 = J ? J.rng + u.r + 1.5 : u.rng + u.r + 2.5, lw = (J ? J.wind : u.wind || 0.5) + (lead || 0), know = knows(W, u);
  const bodies = W.units.filter(b => b.alive && b !== u && (b === t || know(b)));
  let ff = 0, who = null, ww = 0;
  for (let i = 0; i < 10; i++){
    const off = i < 4 ? [-0.55, -0.2, 0.2, 0.55][i] * t.r : (i < 7 ? -1 : 1) * (t.r + 0.12 + [0.15, 0.45, 0.75][(i - 4) % 3] * 0.55);
    const w = i < 4 ? p / 4 : (1 - p) / 6;
    const a = base + Math.atan2(off, d), dx = Math.cos(a), dy = Math.sin(a);
    let lim = L0; for (let q = 0.3; q < L0; q += 0.3) if (rock(W.map, x + dx * q, y + dy * q)){ lim = q; break; }
    let hb = null, hk = 1e9; const lo = [];   // v7.14.1 lo = 사선 위의 엎드린 몸 (노린 몸 빼고)
    for (const b of bodies){
      const P = [[b.x, b.y]], low = b !== t && lieLow(b);
      if (b.side === u.side){
        const ft = Math.min(1.2, lw + Math.max(0, (b.x - x) * dx + (b.y - y) * dy) / vel);
        P.push([b.x + (b.vx || 0) * ft, b.y + (b.vy || 0) * ft]);
        // 동료가 가려는 자리 (같은 편이라 앎 — '뒤로!' 하고 전선으로 나서는 탱커 등): 그 길을 따라 ft 초 만큼 간 자리
        if (b.goal && b.path && b.path.length && !b.act){ const w = b.path[0], wl = Math.hypot(w.x - b.x, w.y - b.y) || 1, m = Math.min(wl, spdNow(W, b) * ft); P.push([b.x + (w.x - b.x) / wl * m, b.y + (w.y - b.y) / wl * m]); }
        // 대상 쪽으로 다가가는 근접 동료 (보이는 움직임): 쏘는 사이 대상 곁까지 들어올 수 있음
        const dd = dist(b, t) || 1;
        if (!isFar(b) && !b.act && dd < 4 && ((b.vx || 0) * (t.x - b.x) + (b.vy || 0) * (t.y - b.y)) / dd > 0.3){ const m = Math.max(0, Math.min(spdNow(W, b) * ft, dd - b.r - t.r)); P.push([b.x + (t.x - b.x) / dd * m, b.y + (t.y - b.y) / dd * m]); }
      }
      for (const [bx, by] of P){
        const k = (bx - x) * dx + (by - y) * dy; if (k <= u.r || k > lim || (!low && k >= hk)) continue;
        if (Math.hypot(bx - (x + dx * k), by - (y + dy * k)) <= b.r + (b.side === u.side ? 0.08 : 0)){ if (low){ lo.push([k, b]); break; } hk = k; hb = b; }
      }
    }
    let pass = 1, lw2 = null; const op = lieOverP(W, u);
    for (const [k2, b2] of lo) if (k2 < hk && b2.side === u.side){ pass *= 1 - op; if (!lw2) lw2 = b2; }
    const fl = (1 - pass) + pass * (hb && hb.side === u.side ? 1 : 0);   // v7.14.1 엎드린 동료는 over 만큼만 · 그 너머 서 있는 동료는 그대로
    if (fl > 0){ ff += w * fl; if (w * fl > ww){ ww = w * fl; who = hb && hb.side === u.side ? hb : lw2; } }
  }
  return { p: ff, who };
}
// 받아들일 오사 확률: ffBase + ffBold × 대담함 (겁 많은 저격수 ≈ 3%, 보통 사수 ≈ 4%).
// 각을 못 잡고 오래 막혀 있으면 조금씩 더 (최대 +4%). 엄호: 각을 잡을 자리가 없을 때만, t 가 노리는 동료가 위험하면 (체력 60% 아래 · 둘 이상에게 노려짐) +ffCover
const rv = (W, k, d) => W.rules[k] != null ? W.rules[k] : d;
const ffBase = (u, W) => rv(W, 'ffBase', 0.02) + rv(W, 'ffBold', 0.06) * u.bold;
function coverOf(W, u, t){
  const v = t && focusOf(W, t); if (!v || v.side !== u.side || v === u || !v.alive) return null;
  const press = W.units.filter(e => e.alive && e.side !== u.side && focusOf(W, e) === v).length;
  return v.hp / v.max < 0.6 || press >= 2 ? v : null;
}
const ffLim = (u, W) => W.t - (u.ffHitT || -9) < 2 ? 0.04 : ffBase(u, W) + Math.min(0.04, (u.ffWait || 0) * 0.015);   // v7.9.3 방금 아군을 맞혔으면 더 엄격하게
// (x, y) 를 쏠 수 있는 아는 적 사수 수 (사거리 안 · 사선이 열림 · 우리 편 방어 자세가 막지 않음). 창을 든 투창병도 셈 (투창 사거리)
function exposedAt(W, u, x, y, guns){
  const P0 = { x, y, r: u.r, side: u.side, i: u.i };
  let n = 0;
  for (const e of guns){
    if (Math.hypot(e.x - x, e.y - y) - e.r - u.r > (isFar(e) ? e.rng : JVu(W, e).rng) + 0.3 || !losClear(W.map, e.x, e.y, x, y)) continue;
    const f = firstOnLine(W, e, P0, e); if (f !== P0 && f.side === u.side && blocksFor(W, f, e)) continue;
    n++;
  }
  return n;
}
// 선분 a→(x, y) 와 점 f 의 거리
function segD(a, x, y, f){ const vx = x - a.x, vy = y - a.y, L2 = vx * vx + vy * vy || 1, k = Math.max(0, Math.min(1, ((f.x - a.x) * vx + (f.y - a.y) * vy) / L2)); return Math.hypot(f.x - a.x - vx * k, f.y - a.y - vy * k); }
// 다른 표적: 지금 상대가 막혔을 때, 사선이 열리고 오사 걱정 없고 쏠 만한 (확률 ≥ 기준) 다른 보이는 상대
function altTarget(W, u, t){
  const know = knows(W, u);
  let best = null, bp = 0;
  for (const f of W.units){
    if (!f.alive || f === t || f.side === u.side || !canSee(W, u, f) || gap(u, f) > u.rng || !losClear(W.map, u.x, u.y, f.x, f.y)) continue;
    const first = firstOnLine(W, u, f, u, know); if (first !== f && (first.side === u.side || blocksFor(W, first, u))) continue;
    if (first === f && inGuard(W, f, u, true)) continue;
    if (ffOdds(W, u, first, u.x, u.y).p > ffLim(u, W)) continue;
    const p = aimP(W, u, first); if (p < shootTh(W, u, first) || p <= bp) continue;
    bp = p; best = first;
  }
  return best;
}
// 쏠 만한가 (기다리기 · 노리기): 맞힐 확률 ≥ 기준. 기준은 대담할수록 · 오래 기다릴수록 · 상대가 틈을 보일수록 낮아짐. 탄약이 적으면 높아짐
function shootTh(W, u, t){
  let th = 0.85 - u.bold * 0.45 - u.waitT * 0.05;
  if (t.act) th -= 0.15;
  if (u.ammo == null) th -= 0.2; else if (u.ammo <= 2) th += 0.1;
  return th;
}
function shoot(W, u, t, dt, ordered){
  if (needReload(u)){ startReload(W, u); return; }
  if (!ordered && u.side === 0 && roeOf(W, u) === 'nofire'){ stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); roeNote(W, u, t, 'nofire'); return; }   // v7.9 사격 금지: 명령이 있을 때까지 쏘지 않음
  const know = knows(W, u), g = gap(u, t);
  // 근접 상대가 너무 붙으면 물러남 (겁 많은 쪽)
  // v5.1 [도약]: 근접 상대가 가까이 오면 뒤로 뛰어 단숨에 거리를 벌림 (기동 사수)
  if (!ordered && u.canLeap && !u.crawl && !isFar(t) && g < ((W.rules.leap || {}).near || 2.2) && W.t >= u.leapCd && !cornered(W, u) && startLeap(W, u, t)) return;
  if (!ordered && !isFar(t) && u.bold < 0.6 && !cornered(W, u) && kiteEng(W, u)){ if (u.engT == null || W.t - u.engT > 3) u.engT = W.t; if (W.t - u.engT < 1.5){ stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '맞붙음 — 일격을 기다림', t.i); return; } } else u.engT = null;   /* v8.7.4 */
  if (!ordered && !isFar(t) && g < Math.min(1.2, u.rng * 0.3) + (u.mood === '거리 벌리기' ? 0.4 : 0) && u.bold < 0.6 && !cornered(W, u) && W.t >= (u.kiteNo || 0)){
    const p = fallbackPt(W, u, t, 1.2), B = u.kiteBk && u.kiteBk.b === t.i && W.t - u.kiteBk.t1 < 0.6 ? u.kiteBk : (u.kiteBk = { b: t.i, t0: W.t, g0: g, t1: W.t }); B.t1 = W.t;
    if (W.t - B.t0 > 2.5 && g < B.g0 + 0.8){ u.kiteBk = null; u.kiteNo = W.t + 6; corner(W, u, t, '따라붙음 — 그 자리에서 쏨'); }   // v7.8.4 물러나도 거리가 안 벌어짐 (같은 걸음으로 따라붙음) → 2.5초 뒤엔 물러나기를 그만두고 쏨 (6초) — 활을 쥐고 뒷걸음만 치던 헛짓
    else if (p && !(p.room.open <= 2 && p.gain < 0.5)){ setMood(W, u, '거리 벌리기', t.i); goTo(W, u, p.x, p.y, dt); return; }
    else corner(W, u, t, '궁지');   // 물러설 곳이 없음 → 그 자리에서 쏨
  }
  if (!ordered && u.reloc && u.reloc.b === t.i && W.t < u.reloc.until && Math.hypot(u.x - u.reloc.x, u.y - u.reloc.y) < 1.3){ reposition(W, u, t, dt, '각 잡기'); return; }   /* v8.7.4 J24 같은 자리에서 두 번 빗나감 — 옮김 */
  if (g > u.rng || !losClear(W.map, u.x, u.y, t.x, t.y)){ reposition(W, u, t, dt, ordered ? '공격' : '자리 잡기'); return; }
  u.inRangeT = (u.inRangeT || 0) + dt;   // v6.5 사거리 · 시야 안에서 못 쏜 시간 (쏘면 0)
  let tgt = t, why = '';
  const first = firstOnLine(W, u, t, u, know);
  const now = ordered && u.order && u.order.now;   // v5.7.1 연달아 준 공격 = 바로 쏨 (오사 감수) · 한 번 = 사선을 열 자리를 먼저 잡음
  // v5.8.4 곡사: 앞이 막혔으면 (동료 · 이쪽을 막는 방패 · 큰 몸 · 명령한 상대 앞의 다른 적) 활은 높이 쏘아 넘김 — 떨어질 자리 둘레의 동료가 위험하면 안 함
  if (first === t) u.angT = 0;
  if (first !== t && first.side === u.side && !ordered && arcOK(W, u, t) && angleFirst(W, u, t, dt)) return;   // v6.4.1 동료가 가리면 곡사보다 직사 각 먼저 (방패 · 큰 몸이 가리면 바로 곡사 — 방패 너머)
  if (first !== t && arcOK(W, u, t) && (first.side === u.side || first.bodyShield || ordered || inGuard(W, first, u, true)) && arcRisk(W, u, t).p <= (now ? (W.rules.arc || {}).rapid || 0.25 : ffLim(u, W))){ u.ffWait = 0; u.angT = 0; u.lobB = t.i; u.lobT = W.t; startArc(W, u, t, first.side === u.side ? '곡사 · 동료 너머로' : '곡사 · 앞을 넘겨'); return; }
  if (first !== t && first.side === u.side && now) why = '오사 감수';
  else if (first !== t){
    if (first.side === u.side){ blockedShot(W, u, t, dt, ordered, first); return; }   // 사선에 아군 → 쏘지 않음
    if (inGuard(W, first, u, true)){   // 방어 자세가 이쪽을 막고 있음 → 쏘면 막힘
      if (ordered || (u.bold >= 0.55 && first.post <= 70)){ startAct(W, u, first, '방어 무너뜨리기'); return; }
      const alt = !ordered && altTarget(W, u, t); if (alt){ startAct(W, u, alt, '다른 표적'); return; }
      reposition(W, u, t, dt, '막힘', first.i); return;
    }
    // v5.2 큰 몸 (몸이 방패) 이 노리는 상대를 가림: 다른 표적 · 각 잡기 (오래 막히면 그 몸이라도 쏨)
    if (first.bodyShield && !ordered && !prone(W, first) && u.waitT < 2.5){ const alt = altTarget(W, u, t); if (alt){ startAct(W, u, alt, '다른 표적'); return; } u.waitT += dt; reposition(W, u, t, dt, '막힘', first.i); return; }
    tgt = first; why = '앞을 가로막은 상대';
  }
  if (now){ u.ffWait = 0; startAct(W, u, tgt, why || '공격'); return; }
  if (ordered){ const ff0 = ffOdds(W, u, tgt, u.x, u.y); if (ff0.p > ffLim(u, W)){ blockedShot(W, u, t, dt, true, ff0.who); return; } u.ffWait = 0; startAct(W, u, tgt, why || '공격'); return; }
  const ff = ffOdds(W, u, tgt, u.x, u.y);
  if (ff.p > ffLim(u, W)){
    // 먼저 각을 잡아 봄. 상대가 노리는 동료가 위험한데 (체력 60% 아래 · 둘 이상에게 노려짐) 각을 잡을 자리가 없거나 (방금 찾아봄)
    // 돌 시간이 없으면 (동료 체력 35% 아래 · 상대가 그 동료를 치려고 준비 중) 위험을 조금 감수하고 엄호 사격
    const v = coverOf(W, u, tgt), noAngle = u.spot && !u.spot.dark && u.spot.b === t.i && !u.spot.p && W.t - u.spot.t < 0.6;
    const urgent = v && (v.hp / v.max < 0.35 || (tgt.act && tgt.act.b === v.i));
    if (v && (noAngle || urgent) && ff.p <= ffLim(u, W) + rv(W, 'ffCover', 0.05)) why = why || '엄호';
    else { blockedShot(W, u, t, dt, false, ff.who); return; }
  }
  u.ffWait = 0;
  const p = aimP(W, u, tgt);
  let th = shootTh(W, u, tgt); if (u.side === 1 && !AI6.includes('acover') && ((u.inRangeT || 0) > 3.5 || archerMoving(W, u))) th -= 0.2;   // v6.5 이동만 반복하지 않음 · 동료 궁수가 움직이는 사이 엄호
  // 이동 막기: 상대가 우리 편 쪽으로 다가오는 중이면 더 쉽게 쏨
  const rush = Math.hypot(tgt.vx, tgt.vy) > 0.6 && W.units.some(o => o.alive && o !== u && o.side === u.side && dist(o, tgt) < 4 && (o.x - tgt.x) * tgt.vx + (o.y - tgt.y) * tgt.vy > 0);
  if (rush) th -= 0.15;
  if (p >= th){ startAct(W, u, tgt, why || (rush ? '이동 막기' : tgt.act ? '틈을 노림' : '공격')); return; }
  // 기다림: 확률이 오를 때까지. 오래 기다리고 대담하면 조금 다가감
  u.waitT += dt;
  if (u.waitT > 1.5 && u.bold >= 0.35 && g > u.rng * 0.5){ setMood(W, u, '다가감', tgt.i); goTo(W, u, tgt.x, tgt.y, dt); return; }
  stop(u); u.fg = Math.atan2(tgt.y - u.y, tgt.x - u.x);
  setMood(W, u, '경계', tgt.i);
}
// 사선에 아군 (가로막음 · 오사 확률이 높음): 영리하게 — ① 쏠 만한 다른 표적 ② 그 아군이 곧 비킬 것 같으면 겨눈 채 잠깐 기다림
// ③ 아니면 천천히 옆으로 돌며 각을 잡음 (상대를 겨눈 채 ×0.55, 가는 곳 · 길이 안전할 때만). 마땅한 자리가 없으면 겨눈 채 기다림
// v6.4.1 직사 각: 동료가 가리면 1 ~ 2칸 안에서 곧게 쏠 자리를 먼저 찾음 (0.5초마다). 근접 상대 손 닿는 곳 · 바위 · 사거리 밖 · 오사 위험은 뺌
function directSpot(W, u, t){
  const c = u.dspot && u.dspot.b === t.i && W.t - u.dspot.t < 0.5 ? u.dspot : null; if (c) return c.p;
  const know = knows(W, u), lim = ffLim(u, W), guns = W.units.filter(f => f.alive && f.side !== u.side && know(f) && (isFar(f) || (f.jav && f.spearHeld))), ex0 = exposedAt(W, u, u.x, u.y, guns); let best = null, bd = 1e9;
  for (const r of [0.7, 1.2, 1.8, 2.5]) for (let k = 0; k < 10; k++){ const a = k * Math.PI / 5 + r, x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r;
    if (x < 0.6 || y < 0.6 || x > W.map.W - 0.6 || y > W.map.H - 0.6 || boxRock(W, x, y, u.r)) continue;
    const P = { x, y }; if (Math.hypot(t.x - x, t.y - y) - t.r - u.r > u.rng || !losClear(W.map, x, y, t.x, t.y)) continue;
    if (W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && Math.hypot(f.x - x, f.y - y) - f.r - u.r < f.rng + (f.canSweep || f.giant ? 3.2 : 0.8) && Math.hypot(f.x - x, f.y - y) < dist(f, u) + 0.3)) continue;   // 거구는 돌진 거리까지 (지금보다 가까워지는 자리면 뺌)
    if (firstOnLine(W, P, t, u, know) !== t || ffOdds(W, u, t, x, y).p > lim || exposedAt(W, u, x, y, guns) > ex0) continue;   // 총구에 더 드러나는 자리는 안 감 (엄폐 뒤면 곡사가 나음)
    if (r < bd){ bd = r; best = P; } }
  u.dspot = { b: t.i, t: W.t, p: best }; return best;
}
const archerMoving = (W, u) => !AI6.includes('acover') && W.units.some(o => o !== u && o.alive && o.side === u.side && isFar(o) && ((o.act && o.act.k === 'leap') || (o.mv && ['kite', 'scatter'].includes(o.mv.k) && W.t < o.mv.until)));   // v6.5 다른 궁수가 움직이는 중
const angleFirst = (W, u, t, dt) => { if (!u.lob || AI6.includes('angle') || (u.lobB === t.i && u.lobT != null && W.t - u.lobT < 3) || (u.angT || 0) >= 1.5 || (u.inRangeT || 0) > 3.5 || archerMoving(W, u)) return false; const sp = directSpot(W, u, t); if (!sp) return false; u.angT = (u.angT || 0) + dt; setMood(W, u, '직사 각 잡기', t.i); goTo(W, u, sp.x, sp.y, dt); return true; };   // 1.2초 안에 못 잡으면 곡사   // v6.5 다른 궁수가 움직이면 그 자리에서 엄호 사격 · 3.5초 넘게 못 쐈으면 더 돌지 않음
function blockedShot(W, u, t, dt, ordered, b){
  if (!ordered && u.altGo && W.t < u.altGo.until){ const f = W.units[u.altGo.b]; if (f && f.alive && !canSee(W, u, f) && Math.hypot(u.altGo.x - u.x, u.altGo.y - u.y) > 0.15){ setMood(W, u, '다른 표적 각 잡기', f.i); goTo(W, u, u.altGo.x, u.altGo.y, dt); return; } u.altGo = null; }   /* v8.7.3 고른 다른 표적의 자리까지는 걸어감 (보이면 거기서 쏨) */
  if (!ordered && angleFirst(W, u, t, dt)) return;   // v6.4.1 곡사보다 직사 각 먼저
  if (arcOK(W, u, t) && arcRisk(W, u, t).p <= ffLim(u, W)){ u.ffWait = 0; u.lobB = t.i; u.lobT = W.t; startArc(W, u, t, '곡사 · 동료 너머로'); return; }   // v5.8.4 사선에 동료 → 곡사로 넘김
  if (!ordered){ const alt = altTarget(W, u, t); if (alt){ u.ffWait = 0; startAct(W, u, alt, '다른 표적'); return; } }
  u.ffWait = (u.ffWait || 0) + dt;
  if (u.ffWait < 1.2 && b && Math.hypot(b.vx || 0, b.vy || 0) > 0.4 && ffOdds(W, u, t, u.x, u.y, 0.8).p <= ffLim(u, W)){
    stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '사선 기다림', b.i); return;
  }
  reposition(W, u, t, dt, '각 잡기', b ? b.i : t.i);
  if (!ordered && !(u.spot && u.spot.p) && (u.ffWait || 0) > 1.2 && W.t >= (u.altSpotT || -9)){   /* v8.7.3 이 표적엔 각이 없음 → 가까운 다른 표적의 각 */
    u.altSpotT = W.t + 0.5; const know = knows(W, u);
    for (const f of W.units.filter(f => f.alive && f !== t && f.side !== u.side && !f.down && (know(f) || fresh(W, u.sense[f.i], 2) || (u.side === 0 && !!f.seenBy)) && dist(u, f) < u.rng + u.r + f.r + 3 && !(u.side === 0 && roeBlock(W, u, f, 'fire'))).sort((x, y) => dist(u, x) - dist(u, y)).slice(0, 4)){
      const p = spotFor(W, u, f, '각 잡기'); if (!p) continue;
      u.target = f; u.altLock = { b: f.i, until: W.t + 4 }; u.altGo = { b: f.i, x: p.x, y: p.y, until: W.t + 4 }; u.spot = { t: W.t, b: f.i, p }; u.ffWait = 0; u.waitT = 0; setMood(W, u, '다른 표적 각 잡기', f.i); L(W, { k: 'altAim', a: u.i, b: f.i, was: t.i, vis: u.side === 0 || !!u.seenBy }); goTo(W, u, p.x, p.y, dt); break; }
  }
}
// 자리 잡기: 가까운 몇 자리 중 사선이 열리고 사거리 안인 곳. 적은 어두운 곳을 좋아함. 근접 상대 손 닿는 곳은 피함
// v4.9 각 잡기: 상대 둘레 원 (지금 거리 ±0.7) 을 따라 ±120° 의 자리 + 가까운 옆걸음 자리. 사선이 열리고 오사 확률이 기준 아래인 곳만.
// 점수 = 덜 걷고 · 사거리 알맞고 · 상대 옆 · 뒤가 보이고 · 적 사수에게 덜 드러나고 · 다른 사수의 사선을 막지 않고 · (적이면) 어둠.
// 전황: 근접 상대 손 닿는 곳 · 그 곁을 지나는 길은 빼고, 지금보다 더 드러나는 자리는 대담하거나 오래 기다렸을 때만. 고른 자리는 쓸 만하면 그대로 (지그재그 없음)
// v8.7.3 사격 자리 찾기 (reposition 에서 떼어 냄 — 다른 표적의 각도 찾음): 사선이 열리고 · 사거리 안 · 오사가 기준 아래 · 근접 상대 손 밖인 자리 중 가장 나은 곳 (없으면 null)
function spotFor(W, u, t, mood){
    const know = knows(W, u), lim = ffLim(u, W), foes = W.units.filter(f => f.alive && f.side !== u.side && know(f));
    const melee = foes.filter(f => !isFar(f)), guns = foes.filter(f => isFar(f) || (f.jav && f.spearHeld));
    const exNow = exposedAt(W, u, u.x, u.y, guns), old = u.spot && !u.spot.dark && u.spot.b === t.i && u.spot.p;
    const cands = [];
    for (const r of [0.6, 1.2, 1.9, 2.7]) for (let k = 0; k < 12; k++){ const a = k * Math.PI / 6 + r; cands.push([u.x + Math.cos(a) * r, u.y + Math.sin(a) * r, r]); }
    const d0 = dist(u, t), a0 = Math.atan2(u.y - t.y, u.x - t.x), rMax = u.rng + u.r + t.r - 0.2;
    if (d0 <= rMax + 0.5) for (const dr of [0, -0.7, 0.7]){ const r = Math.min(rMax, d0) + dr; if (r < t.r + u.r + 0.5) continue; for (let k = -8; k <= 8; k++){ if (!k && !dr) continue; const a = a0 + k * Math.PI / 12; cands.push([t.x + Math.cos(a) * r, t.y + Math.sin(a) * r, Math.abs(k) * Math.PI / 12 * r + Math.abs(dr)]); } }
    const RL = u.reloc && u.reloc.b === t.i && W.t < u.reloc.until ? u.reloc : null;   /* v8.7.4 J24 빗나간 자리 둘레는 고르지 않음 */
    if (old && !(RL && Math.hypot(old.x - RL.x, old.y - RL.y) < 1.3)) cands.push([old.x, old.y, Math.hypot(old.x - u.x, old.y - u.y), true]);
    let best = null, bs = -1e9;
    for (const [x, y, walk, keep] of cands){
      if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r)) continue;
      if (RL && Math.hypot(x - RL.x, y - RL.y) < 1.3) continue;
      const g = Math.hypot(x - t.x, y - t.y) - u.r - t.r;
      if (g > u.rng - 0.15 || g < 0.4 || !losClear(W.map, x, y, t.x, t.y)) continue;
      if (W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r)) continue;
      const P0 = { x, y, r: u.r, side: u.side, i: u.i };
      if (firstOnLine(W, P0, t, u, know) !== t) continue;
      const shut = inGuard(W, t, P0, true); if (shut && mood === '막힘') continue;
      const ff = ffOdds(W, u, t, x, y).p; if (ff > lim) continue;
      // 전황: 근접 상대의 손 닿는 곳 (+0.6) · 그 곁을 지나는 길은 안 됨
      if (melee.some(f => Math.hypot(f.x - x, f.y - y) - f.r - u.r < f.rng + 0.6 || segD(u, x, y, f) - f.r - u.r < f.rng + 0.3)) continue;
      const ex = exposedAt(W, u, x, y, guns);
      if (ex > exNow && u.bold < 0.6 && u.waitT < 2.5) continue;   // 지금보다 더 드러나는 자리 (방패 뒤를 벗어남 등) 는 아직
      let s = -walk * 0.6 - Math.abs(g - u.rng * 0.55) * 0.25 - (ex - exNow) * 1.2 - ff * 8 - (shut ? 1.5 : 0);
      if (!fatClear(W.map, u.x, u.y, x, y, u.r * 0.9)) s -= 1;
      if (sideOf(W, t, P0) !== 'front') s += 0.5;
      if (u.side === 1 && !glowAt(W, x, y)) s += u.stalk ? 3 : 1.2;
      else if (u.side === 0 && u.nv && W.rules.glare && W.light[(y | 0) * W.map.W + (x | 0)] <= W.rules.glare.l) s += 0.8;   // v7.8 야시 사수는 빛 밖 (어둠에 눈이 익은 채) 에서 쏨
      if (W.units.some(o => o.alive && o !== u && o.side === u.side && isFar(o) && o.target && o.target.alive && o.target.side !== u.side && segD(o, o.target.x, o.target.y, P0) < u.r + 0.15)) s -= 1.5;   // 다른 사수의 사선
      // v5.2 사수끼리 떨어져 각을 나눔 (십자 사격)
      for (const o of W.units) if (o.alive && o !== u && o.side === u.side && isFar(o)){ const dd = Math.hypot(o.x - x, o.y - y); if (dd < 2.2) s -= (2.2 - dd) * 0.8; if (o.target === t && angDiff(Math.atan2(y - t.y, x - t.x), Math.atan2(o.y - t.y, o.x - t.x)) > 0.7) s += 0.6; }
      if (u.side === 1 && W.infl && W.infl[1] && !AI6.includes('infl')) s += -inflAt(W, 1, x, y) * 0.8 + inflAt(W, 1, x, y, 'cv') * 0.6;   // v6.9 영향 지도: 상대의 손 · 돌진 · 사거리가 닿는 칸은 피하고 방패 뒤를 좋아함
      if (keep) s += 0.8;   // 고른 자리는 쓸 만하면 그대로
      if (s > bs){ bs = s; best = { x, y }; }
    }
    return best;
}
// v8.7.4 J24: 같은 표적 · 같은 까닭 · 같은 자리 (1.2칸 안) 로 두 번 빗나가면 그 자리를 떠남 (3초 동안 그 둘레는 고르지 않음)
function missSpot(W, u, t, why){
  const M = u.mRun && u.mRun.b === t.i && u.mRun.why === why && Math.hypot(u.x - u.mRun.x, u.y - u.mRun.y) < 1.2 ? u.mRun : (u.mRun = { b: t.i, why, x: u.x, y: u.y, n: 0 }); M.n++;
  if (M.n >= 2){ u.reloc = { b: t.i, x: M.x, y: M.y, until: W.t + 3 }; u.spot = null; u.mRun = null; L(W, { k: 'reloc', a: u.i, b: t.i, why, vis: u.side === 0 || !!u.seenBy }); }
}
function reposition(W, u, t, dt, mood, mb){
  if (mb == null) mb = t.i;
  const careful = mood === '각 잡기' || mood === '막힘';
  if (!u.spot || u.spot.dark || W.t - u.spot.t > 0.5 || u.spot.b !== t.i) u.spot = { t: W.t, b: t.i, p: spotFor(W, u, t, mood) };
  const p = u.spot.p;
  if (p && isFar(u) && u.canLeap && W.t >= u.leapCd && !u.crawl && !u.lie && Math.hypot(p.x - u.x, p.y - u.y) >= 0.7 && leapTo(W, u, p.x, p.y, 'side', t, '도약 — 사선 열린 자리로')){ u.spot = null; return; }   /* v8.7.4 J25 도약이 있는 사수는 각 잡기 대신 뜀 */
  if (p && Math.hypot(p.x - u.x, p.y - u.y) > 0.1){
    setMood(W, u, mood, mb);
    if (!careful){ goTo(W, u, p.x, p.y, dt); return; }
    // 천천히 우회: 상대 둘레를 따라 (한 번에 40° 씩, 줄을 가로질러 상대 쪽으로 다가가지 않게), 상대를 겨눈 채
    let wx = p.x, wy = p.y;
    const au = Math.atan2(u.y - t.y, u.x - t.x), ap = Math.atan2(p.y - t.y, p.x - t.x);
    let da = ap - au; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    if (Math.abs(da) > 0.7){ const r = Math.hypot(p.x - t.x, p.y - t.y), a = au + Math.sign(da) * 0.7, x = t.x + Math.cos(a) * r, y = t.y + Math.sin(a) * r; if (!rock(W.map, x, y) && fatClear(W.map, u.x, u.y, x, y, u.r * 0.9)){ wx = x; wy = y; } }
    setGoal(W, u, wx, wy); follow(W, u, dt, rv(W, 'angleSlow', 0.55)); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
    return;
  }
  if (!p && (gap(u, t) > u.rng || !losClear(W.map, u.x, u.y, t.x, t.y))){ setMood(W, u, '다가감', t.i); goTo(W, u, t.x, t.y, dt); return; }
  // 마땅한 자리가 없음 (또는 다 옴): 겨눈 채 기다림
  stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  setMood(W, u, careful && !p ? '사선에 아군' : mood, mb);
}
/* ---------- v5.0 역할 · 우위 ---------- */
// 힘: √(체력 × 초당 공격). 방어 자세가 서 있으면 단단함 ×(1 + 0.8·방어 재능), 창을 든 투창병 ×1.3 (한 방), 탄약이 떨어진 사수 ×0.3
const powerOf = a => Math.sqrt(Math.max(1, a.hp) * a.atk * a.atkMul / Math.max(0.3, a.wind + a.rec))
  * (a.canGuard && a.brokenT <= 0 ? 1 + 0.8 * (a.gTal != null ? a.gTal : 1) : 1) * (a.jav && a.spearHeld ? 1.3 : 1) * (a.ammoMax != null && a.ammo === 0 ? 0.3 : 1) * (a.blind ? 0.4 : 1);   // v5.5 실명
// 우위 짐작: t 둘레 3.5칸 안 (또는 t 를 노리는) 우리 편 힘 ÷ 아는 상대 힘 (아군은 누구든 보고 있는 적, 적은 보이거나 2초 안에 감지한 상대)
function edgeAt(W, u, t){
  const kn = f => f === t || (u.side === 0 ? f.seenBy : canSee(W, u, f) || fresh(W, u.sense[f.i], 2));
  let a = 0, b = 0;
  for (const o of W.units){
    if (!o.alive) continue;
    if (o.side === u.side){ if (o === u || dist(o, t) <= 3.5 || focusOf(W, o) === t) a += powerOf(o); }
    else if (kn(o) && (o === t || dist(o, t) <= 3.5)) b += powerOf(o);
  }
  return a / Math.max(1e-6, b);
}
// 기준: pushEdge − 대담함 × pushBold. 전선은 자리를 지키는 몫이 있어 +0.2, 공격수는 잡을 기회에 −0.1
const pushNeed = (W, u) => rv(W, 'pushEdge', 1.5) - rv(W, 'pushBold', 0.7) * u.bold + (u.role === '전선' ? 0.2 : u.role === '공격수' ? -0.1 : 0);
// 치고 나가는 중인가: 우위 ≥ 기준이면 시작, 시작한 뒤 1.5초는 우위가 기준의 0.8 아래로 꺾이지 않는 한 그대로 (들락날락 없음)
function pushing(W, u, t){
  const e = edgeAt(W, u, t), need = pushNeed(W, u);
  if (e >= need){ u.pushT = W.t; return true; }
  return W.t - (u.pushT == null ? -9 : u.pushT) < 1.5 && e >= need * 0.8;
}
// 역할에 따른 표적 기울기 (클수록 고름): 미드필더 = 전선 뒤 사수 · 치유 · 막고 서지 않은 쪽, 공격수 = 다친 · 동료와 맞붙은 · 고립된 쪽. 막고 선 방패는 둘 다 피함
function roleBias(W, u, f){ return roleBias0(W, u, f) + (prone(W, f) ? 1.5 : 0); }   // v5.2 넘어진 상대
function roleBias0(W, u, f){
  // v5.1 사수: 상대 사수 · 궁수, 겨누는 중인 상대, 거의 죽은 상대부터
  if (u.role === '사수') return (f.canGuard && guardOn(W, f) && inGuard(W, f, u, true) ? -1 : 0) + (isFar(f) ? 1.5 : 0) + (f.act && f.act.phase === 'wind' ? 1 : 0) + (pHp(W, u.side, f) < 0.3 ? 1 : 0);   // v6.3 짐작한 체력
  if (u.role !== '미드필더' && u.role !== '공격수') return 0;
  const shut = f.canGuard && guardOn(W, f) && inGuard(W, f, u) ? -1.5 : 0;
  if (u.role === '미드필더') return shut + (isFar(f) ? 2.5 : 0) + ((iRec(W, u.side, f).tags || []).includes('구급') ? 2 : 0) + (pHp(W, u.side, f) < 0.4 ? 1 : 0);   // v6.3 약을 쓰는 걸 봤을 때만
  const fo = focusOf(W, f);
  return shut + (1 - pHp(W, u.side, f)) * 3 + (fo && fo.side === u.side && fo !== u ? 1.5 : 0) + (supportOf(W, f) === 0 ? 1 : 0);
}
// 미드필더: 상대 전선 (이쪽을 막고 선 방패 · 대검) 을 정면으로 들이받지 않고 막는 폭 밖으로 돌아 들어감. 친 뒤 둘레에 상대가 둘 이상이면 빠졌다가 다시
function midfield(W, u, t, dt){
  const near = W.units.filter(f => f.alive && f.side !== u.side && !isFar(f) && dist(f, u) < 2.2).length;
  // 빠져나감: 친 뒤 둘레에 상대가 둘 이상이거나, 다쳐서 (체력 40% 아래) 상대가 가까우면 — 빠른 발로 빠졌다가 다시 (궁지면 맞섬)
  const hurt = u.hp / u.max < 0.4 && near >= 1 && groupMates(W, u).length > 0;   // v6.7.2 물러날 동료가 있을 때만 (혼자면 빠졌다 다시 들어오기를 끝없이 되풀이하지 않고 맞섬)
  if (!cornered(W, u) && ((u.atkT > 0 && W.t - u.atkT < 1 && near >= 2) || hurt)){
    const p = fallbackPt(W, u, t, 2); if (p){ if (u.canLeap && !u.crawl && W.t >= u.leapCd && startLeap(W, u, t)) return true; setMood(W, u, '빠져나감', t.i); goTo(W, u, p.x, p.y, dt); return true; }   // v6.7 도약이 있으면 뛰어 빠짐
  }
  if (inReach(u, t)) return false;   // 손이 닿으면 보통 싸움 (틈 · 측면)
  // 가는 길을 막고 선 상대 전선 (방어 자세가 이쪽을 봄), 또는 상대 자체가 이쪽을 막고 섬
  const wall = W.units.find(g => g.alive && g.side !== u.side && g !== t && guardOn(W, g) && inGuard(W, g, u) && dist(u, g) < dist(u, t) && segD(u, t.x, t.y, g) < g.r + u.r + 0.7);
  const G = wall || (guardOn(W, t) && inGuard(W, t, u) && gap(u, t) < 3 ? t : null);
  if (!G) return false;
  // 돌아 들어갈 자리: G 의 막는 폭 밖 (왼쪽 · 오른쪽) 중 트이고, 다른 상대 손이 닿지 않고, 가까운 쪽
  const off = G.gArc * Math.PI / 180 + 0.7, R = G.r + u.r + 0.8;
  let best = null, bs = -1e9;
  for (const s of [-1, 1]){
    const a = G.face + s * off, x = G.x + Math.cos(a) * R, y = G.y + Math.sin(a) * R;
    if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r)) continue;
    let sc = -Math.hypot(x - u.x, y - u.y) + roomAt(W, x, y).avg, crowd = 0;
    for (const f of W.units) if (f.alive && f.side !== u.side && f !== G && !isFar(f) && Math.hypot(f.x - x, f.y - y) - f.r - u.r < f.rng + 1){ sc -= 2; crowd++; }
    if (crowd >= 2) continue;   // 둘 이상이 기다리는 쪽으로는 파고들지 않음
    if (sc > bs){ bs = sc; best = { x, y }; }
  }
  if (!best) return false;
  if (u.canLeap && !u.crawl && W.t >= u.leapCd && !AI6.includes('pounce') && Math.hypot(best.x - u.x, best.y - u.y) <= ((W.rules.leap || {}).dist || 1.7) + 0.2 && leapTo(W, u, best.x, best.y, 'side', G, '방패 옆으로 돌아 들어감')) return true;   // v6.7.4 옆으로 도약
  setMood(W, u, '돌파', G.i); goTo(W, u, best.x, best.y, dt);
  return true;
}
/* ---------- v4.8 물러서기: 곧장 뒤가 아니라 트인 곳 · 동료 쪽으로 (구석 · 벽으로 몰리지 않게) ---------- */
// 둘레 여유: 8방향으로 바위 (판 끝 포함) 까지 거리 (최대 1.5칸) 의 평균 · 끝까지 트인 방향 수. 구석 · 벽에 붙은 자리일수록 작음
function roomAt(W, x, y){
  let s = 0, open = 0;
  for (let k = 0; k < 8; k++){
    const c = Math.cos(k * Math.PI / 4), d = Math.sin(k * Math.PI / 4); let r = 0.25;
    while (r < 1.5 && !rock(W.map, x + c * r, y + d * r)) r += 0.25;
    s += r; if (r >= 1.5) open++;
  }
  return { avg: s / 8, open };
}
// 모여 있는 동료 (합류할 쪽): 포위 사냥 · 우회하는 쪽은 빼고
const groupMates = (W, u) => W.units.filter(a => a.alive && a !== u && a.side === u.side && !a.pack && !a.stalk);
// 물러설 자리 (d 칸쯤): 상대 반대쪽 ±80° 안에서 — 아는 상대 모두에게서 멀어지고, 트인 곳 (구석 · 벽 가 감점), 동료 쪽, 적이면 어둠.
// 멀어지는 자리가 없으면 null (= 궁지)
function fallbackPt(W, u, t, d){
  const know = knows(W, u), foes = W.units.filter(f => f.alive && f.side !== u.side && (f === t || know(f)) && dist(f, u) < 6);
  const mates = groupMates(W, u), base = Math.atan2(u.y - t.y, u.x - t.x);
  const near = (x, y) => Math.min(...foes.map(f => Math.hypot(f.x - x, f.y - y) - f.r - u.r));
  const near0 = near(u.x, u.y);
  let best = null, bs = -1e9;
  for (const r of [d, d * 0.6]) for (let k = -4; k <= 4; k++){
    const a = base + k * 0.35, x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r;
    if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r)) continue;
    if (!fatClear(W.map, u.x, u.y, x, y, u.r * 0.8)) continue;
    const gain = near(x, y) - near0; if (gain < 0.15) continue;   // 멀어지지 않으면 물러섬이 아님
    const rm = roomAt(W, x, y);
    let sc = gain * 1.2 + rm.avg * 1.5 - (rm.open <= 3 ? 2.5 : 0) - Math.abs(k) * 0.12;
    if (mates.length) sc -= Math.min(6, Math.min(...mates.map(a => Math.hypot(a.x - x, a.y - y)))) * 0.3;
    if (u.side === 1 && !glowAt(W, x, y)) sc += 0.6;
    if (u.side === 1){   // v6.0 프로의 물러섬: 알려진 사수에게 드러나는 자리 · 동료 궁수의 사선을 가리는 자리는 피하고, 다른 궁수가 엄호해 줄 수 있는 자리를 좋아함
      sc -= Math.min(3, gunDanger(W, u, x, y)) * 1.1;
      for (const m of W.units){ if (!m.alive || m === u || m.side !== u.side || !isFar(m)) continue; const mt = m.act && m.act.k === 'atk' ? W.units[m.act.b] : m.target; if (mt && mt.alive && Math.hypot(mt.x - m.x, mt.y - m.y) > Math.hypot(x - m.x, y - m.y) && segD(m, mt.x, mt.y, { x, y }) < u.r + 0.25) sc -= 1.5; const dm = Math.hypot(m.x - x, m.y - y); if (isFar(u) && dm > 1.4 && dm < 4.5) sc += 0.4; }
    }
    if (sc > bs){ bs = sc; best = { x, y, gain, room: rm }; }
  }
  return best;
}
// 뒷걸음: 상대를 마주 본 채 (등을 보이지 않음) 조금 느리게
function backStep(W, u, t, p, dt){ setGoal(W, u, p.x, p.y); follow(W, u, dt, 0.7); u.fg = Math.atan2(t.y - u.y, t.x - u.x); }
// 궁지 (물러설 곳 없음 · 혼자 쫓기다 결단): 2초 동안 맞서 싸움
const cornered = (W, u) => u.cornerT != null && W.t - u.cornerT < 2;
function corner(W, u, t, k){ if (!cornered(W, u)){ u.moodLogT = -9; setMood(W, u, k, t.i); } u.cornerT = W.t; u.cornerK = k; u.backT = 0; u.backing = false; }
// 살아남기: 체력이 바닥 (30%) 이거나 탄약이 떨어졌고 겁이 있으면 → 치유사에게 가거나 상대 사거리 밖으로 물러나 버팀. 막혀서 못 물러나면 싸움
function survive(W, u, t, dt){
  const low = u.hp / u.max < (u.vet ? VETR(W).low : 0.3), dry = u.ammoMax != null && u.ammo === 0;   // v6.1 베테랑은 웬만해선 물러나지 않음
  if (!(low || dry) || u.bold >= 0.5){ u.stuckT = 0; u.fleeT = 0; return false; }
  if ((u.fleeT || 0) > 4 && gap(u, t) > t.rng + 3) u.fleeT = 0;
  if (cornered(W, u) || (u.fleeT || 0) > 4){ u.stuckT = 0; return false; }   // 궁지 · 4초 넘게 쫓기며 물러났으면 맞섬 (상대가 멀어지면 다시)
  if ((u.stuckT || 0) > 1) return false;
  const healer = low && W.units.filter(h => h.alive && h !== u && h.side === u.side && h.cls === '치유').sort((a, b) => dist(u, a) - dist(u, b))[0];
  const x0 = u.x, y0 = u.y;
  if (healer){ if (dist(u, healer) > 1.6){ setMood(W, u, '회복', healer.i); goTo(W, u, healer.x, healer.y, dt); } else return false; }
  else if (gap(u, t) < t.rng + 1.5){
    const p = fallbackPt(W, u, t, 1.5);
    if (!p || (p.room.open <= 2 && p.gain < 0.5)){ corner(W, u, t, '궁지'); return false; }   // 물러설 곳이 없음 → 맞서 싸움
    u.fleeT = (u.fleeT || 0) + dt; if (u.fleeT > 4){ corner(W, u, t, '결단'); return false; }
    setMood(W, u, '물러남', t.i); goTo(W, u, p.x, p.y, dt);
  } else {   // 상대 손이 닿지 않는 곳: 쏠 수 있으면 쏨 (사수는 멀리서 버팀), 아니면 버팀
    u.stuckT = 0; if (gap(u, t) > t.rng + 3) u.fleeT = 0;
    if (isFar(u)) return false;
    stop(u); setMood(W, u, '물러남', t.i); return true;
  }
  u.stuckT = Math.hypot(u.x - x0, u.y - y0) < 0.005 ? (u.stuckT || 0) + dt : 0;
  return true;
}
// 보이는 상대 사수가 겨누는 중일 때: 방어 자세가 있는 쪽은 겨눈 선 위로 막아서고, 없는 쪽은 방패 뒤 · 바위 뒤로 숨음
function cover(W, u, t, dt){
  if (u.crawl) return false;
  const know = knows(W, u);
  const shooters = W.units.filter(e => e.alive && e.side !== u.side && isFar(e) && e.act && e.act.k === 'atk' && e.act.phase === 'wind' && know(e));
  if (!shooters.length) return false;
  if (W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && inReach(f, u))) return false;   // 맞붙은 중엔 못 빠짐
  if (u.canGuard || u.bodyShield){   // v5.2 큰 몸은 방패 없이도 몸으로 막아섬
    if (!u.bodyShield && W.t < u.brokenT) return false;
    // 막아서기: 내가 아닌 아군을 겨눈 사수 → 그 아군 앞 (사수 쪽) 으로
    for (const e of shooters){
      const v = W.units[e.act.b]; if (!v || v === u || v.side !== u.side || !v.alive) continue;
      const d = dist(e, v) || 1, k = v.r + u.r + 0.12, px = v.x + (e.x - v.x) / d * k, py = v.y + (e.y - v.y) / d * k;
      const reach = spdNow(W, u) * Math.max(0.05, e.act.end - W.t) + 0.3;
      if (Math.hypot(px - u.x, py - u.y) > reach || rock(W.map, px, py)) continue;
      setMood(W, u, '막아서기', v.i);
      if (Math.hypot(px - u.x, py - u.y) > 0.08) goTo(W, u, px, py, dt); else stop(u);
      u.fg = Math.atan2(e.y - u.y, e.x - u.x);
      return true;
    }
    return false;
  }
  if (u.bold >= 0.7) return false;   // 대담한 쪽은 숨지 않음
  const e = shooters.find(s => s.act.b === u.i); if (!e) return false;
  const guards = W.units.filter(g => g.alive && g !== u && g.side === u.side && (guardOn(W, g) || g.bodyShield));
  const safeAt = (x, y) => !losClear(W.map, e.x, e.y, x, y) || guards.some(g => { const vx = x - e.x, vy = y - e.y, L2 = vx * vx + vy * vy, k = ((g.x - e.x) * vx + (g.y - e.y) * vy) / L2; if (k <= 0 || k >= 1) return false; return Math.hypot(g.x - (e.x + vx * k), g.y - (e.y + vy * k)) <= g.r + 0.04 && blocksFor(W, g, e); });
  if (safeAt(u.x, u.y)){ setMood(W, u, '숨기', e.i); stop(u); return true; }
  const reach = spdNow(W, u) * Math.max(0.05, e.act.end - W.t);
  let best = null, bd = 1e9;
  for (const r of [0.4, 0.8, 1.2, 1.6]){
    if (r > reach + 0.2) break;
    for (let k = 0; k < 12; k++){
      const a = k * Math.PI / 6, x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r;
      if (rock(W.map, x, y) || !safeAt(x, y)) continue;
      if (r < bd){ bd = r; best = { x, y }; }
    }
  }
  if (!best) return false;
  setMood(W, u, '숨기', e.i); goTo(W, u, best.x, best.y, dt);
  return true;
}

/* ---------- v5.2 무게 · 밀침 · 짓뭉개짐 · 넘어짐 · 벽 (굴 3D karius.js 의 밀치기 공통 규칙 · maim.js 의 치명 · 확인사살을 판에 맞춰 옮김) ---------- */
// 키 (m): 따로 정하지 않으면 [거구] 3 · 개 0.8 · 보통 1.7
const heightOf = p => p.height != null && +p.height > 0 ? +p.height : (p.traits || []).includes('거구') ? 3 : p.tac === 'pack' ? 0.8 : 1.7;
// 무게 (kg): 따로 정하지 않으면 base × (키/1.7)^exp, [거구] ×giant, 방어구 (등급 × w × armor) — [갑피] 는 피부라 무게 없음
function massOf(p, rules, h, gear, hp){
  if (p.weight != null && p.weight !== '' && +p.weight > 0) return +p.weight;
  const M = rules.mass || {}, tr = p.traits || [];
  // v5.7 키도 무게도 비어 있으면 (거구 · 짐승 아님) 체력으로 몸집을 어림 — 체력 1265 의 괴물이 62kg 이던 것
  const est = !(p.height != null && +p.height > 0) && !tr.includes('거구') && p.tac !== 'pack' && hp > 0;
  const body = est ? (M.base || 62) * Math.max(0.75, Math.min(5, Math.pow(hp / (M.hpRef || 106), M.hpExp != null ? M.hpExp : 0.6))) : (M.base || 62) * Math.pow(h / 1.7, M.exp || 2.5) * (tr.includes('거구') ? M.giant || 1.3 : 1);
  const arm = Object.values(gear || {}).reduce((s, it) => s + (it.innate ? 0 : it.tier * (((rules.armor || {})[it.mat] || {}).w || 0) * (M.armor || 400)), 0);
  return Math.round(body + arm + (p.shield ? (M.shield != null ? M.shield : 8) : 0));   // v5.7 방패 무게
}
const boxRock = (W, x, y, r) => r > 0.55 ? !bigOk(W.map, x, y, r) : rock(W.map, x - r, y - r) || rock(W.map, x + r, y - r) || rock(W.map, x - r, y + r) || rock(W.map, x + r, y + r);   /* v8.7.4 큰 몸은 몸 전체 */
// v8.7.4 큰 몸 (반지름 0.55 넘게 — 망각): 네 모서리만 보면 몸 안에 바위 칸이 숨음 → 1칸보다 촘촘한 점으로 몸 전체를 봄
function bigOk(m, x, y, r){ const n = Math.ceil(2 * r) + 1; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (rock(m, x - r + 2 * r * i / (n - 1), y - r + 2 * r * j / (n - 1))) return false; return true; }
// 몸이 곧장 지나갈 수 있는 줄 (0.3칸마다 몸 전체)
function bigWalk(m, x0, y0, x1, y1, r){ const l = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(l / 0.3)); for (let i = 1; i <= n; i++){ const t = i / n; if (!bigOk(m, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r)) return false; } return true; }
// 몸이 들어가는 가장 가까운 자리 (6칸까지)
function bigSpot(W, x, y, r){ for (let d = 0.5; d <= 6; d += 0.5) for (let k = 0; k < 16; k++){ const a = k * Math.PI / 8, xx = x + Math.cos(a) * d, yy = y + Math.sin(a) * d; if (xx > r && yy > r && xx < W.map.W - r && yy < W.map.H - r && !boxRock(W, xx, yy, r * 0.9)) return { x: xx, y: yy }; } return null; }
// 넘어짐: 잠깐 넘어짐 (proneT 까지 아무것도 못 함) 또는 기어다님 (다리 불구 — 못 일어남, 쏠 수는 있고 근접은 못 함)
const prone = (W, u) => !!u.crawl || W.t < u.proneT || !!u.lie;   // v7.11 엎드림 (포복) 도 낮은 자세 — 근접에 약함 · 못 막음 · 못 피함
// 하던 준비를 끊음 (재장전은 빼고)
function interrupt(W, u, why){
  const a = u.act;
  if (a && a.k === 'h2' && a.phase === 'wind') L(W, { k: 'h2Break', a: u.i, s: a.s, n: a.n, why, vis: u.side === 0 || !!u.seenBy });   /* v8.7.4 휘청 · 넘어짐으로 끊긴 예고 */
  if (a && a.k === 'skill' && a.phase === 'tend'){ tendEnd(W, u, a, why); u.act = null; u.burst = null; return; }   // v7.3 맞으면 돌봄이 끊김
  if (a && a.k === 'spec' && a.s === 'tear' && a.phase === 'run'){ const v = W.units[a.held]; if (v) v.heldBy = null; L(W, { k: 'tearLet', a: u.i, b: a.held, why, vis: true }); }   /* v8.7.4 잡아찢기가 끊김 */
  if (a && a.k === 'invAct' && a.phase === 'wind') L(W, { k: 'invBreak', a: u.i, op: a.op, slot: a.slot || null, w: a.it ? a.it.label || a.it.name : null, why, vis: u.side === 0 || !!u.seenBy });   /* v8.7.6 입던 · 건네던 것이 끊김 */
  if (a && (a.phase === 'wind' || a.phase === 'run') && a.k !== 'reload'){
    if (a.b != null && (a.k === 'atk' || a.k === 'throw' || a.k === 'bash' || a.k === 'skill' || a.k === 'heal' || a.k === 'palm' || a.k === 'assn')) L(W, { k: 'miss', a: u.i, b: a.b, why });
    u.act = null;
  }
  u.burst = null;
}
// 넘어뜨림: sec 초 ([개조된 신체] 는 움찔 배율만큼 짧게). 준비 · 점사 끊김, 못 막음 · 못 움직임
function knockDown(W, u, sec, by, why){
  if (!u.alive || u.crawl || W.t < (u.saT || -9)) return;
  if (u.marble){ if (typeof ccShrug === 'function') ccShrug(W, u, by, 'prone'); return; }   /* v8.6.0 [대리석 피부]: 몇 톤 — 넘어지지 않음 */   /* v7.23.2 슈퍼아머 */
  if (u.ccRes && W.rand() < u.ccRes){ ccShrug(W, u, by, 'prone'); return; }   /* v7.29.0 버팀 (세자르 — 잘 넘어지지 않음) */
  const dr = ccChain(W, u); if (dr <= 0.05){ ccShrug(W, u, by, 'chain'); return; }   /* v8.7.3 이어진 넘어짐은 짧아짐 */
  const s = sec * dr * (mbOn(W, u) ? mbF(W, u, 'pin') : 1) * (u.vet ? VETR(W).pin : 1);   // v6.1 베테랑: 넘어져도 빨리 일어남
  if (W.t + s <= u.proneT) return;
  u.proneT = W.t + s; flailDrop(W, u, '넘어짐'); interrupt(W, u, '넘어져 준비가 끊김'); stop(u);   /* v7.25.0 */
  L(W, { k: 'prone', a: by != null ? by : u.i, b: u.i, sec: +s.toFixed(1), why: why || '', vis: u.side === 0 || !!u.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '넘어짐!', c: 'd', t0: W.t });
}
// 다리 불구 (치명타가 다리에): 날붙이 = 절단, 그 밖 = 파괴. 못 일어나고 기어다님 (속력 ×crawl), 쏠 수는 있음 · 근접 못 함 · 못 막음
function cripple(W, u, by, wk){
  if (!u.alive || u.crawl || wholeBody(u)) return;
  u.crawl = true; u.legLoss = wk === '날붙이' ? '절단' : '파괴'; u.proneT = -9; interrupt(W, u, '다리를 잃어 준비가 끊김'); stop(u);
  if (!u.wounds.includes('다리 ' + u.legLoss)) u.wounds.push('다리 ' + u.legLoss);
  if (u.legLoss === '절단') startBleed(W, u, by);   // v5.5 잘린 다리는 피를 흘림
  L(W, { k: 'cripple', a: by, b: u.i, how: u.legLoss, bleed: u.legLoss === '절단', vis: u.side === 0 || !!u.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '다리 ' + u.legLoss + '!', c: 'd', t0: W.t });
}
/* ---------- v5.5 부위 파괴 · 절단 (굴 3D maim.js 의 부위 치명상을 판에 맞춰 옮김) ---------- */
// 무거운 몸 (거구) 은 뼈 · 팔다리가 굵어 잘 안 부서지고 안 잘림: √(massRes / 무게) (1 까지), [개조된 신체] ×0.6
const maimRes = (W, t) => Math.min(1, Math.sqrt(((W.rules.maim || {}).massRes || 90) / Math.max(1, t.mass || 62))) * (mbOn(W, t) ? 0.6 : 1) * (1 - (t.ccRes || 0));   /* v7.29.0 버팀: 다리 · 팔도 잘 안 부러짐 (세자르가 기어다니다 짓밟히지 않게) */
const maimAim = t => { t.aimMaim = (t.eyeAim != null ? t.eyeAim : 1) * (t.armAim != null ? t.armAim : 1) * (t.injAim != null ? t.injAim : 1); };   // v6.9 어지러움 · 쇼크
// 절단 = 피를 흘림 (최대 체력 × bleed / 초, bleedT 초 — 겹치면 더 흘림). 응급처치 · 약 (지혈) 이 멈춤
function startBleed(W, t, by, mul){
  if (t.noOrg) return;   /* v8.7.3 [무장기]: 피를 흘리지 않음 */
  const M = W.rules.maim || {}, b = t.bleed;
  t.bleed = { dps: (b ? b.dps : 0) + bossRef(W, t) * (M.bleed != null ? M.bleed : 0.02) * (mul || 1), until: W.t + (M.bleedT || 10), by };   // v7.22.2 [보스] 는 vital.boss 기준
}
// v7.22.2 [보스]: 최대 체력에 비례하는 몫 (급소 · 출혈 · 내출혈) 은 vital.boss 를 넘지 않는 기준으로 셈
const bossRef = (W, t) => (t.traits || []).includes('보스') ? Math.min(t.max, ((W.rules.vital || {}).boss) || 400) : t.max;
function stepBleed(W, u, dt){
  const b = u.bleed; if (!b) return;
  if (W.t >= b.until){ u.bleed = null; L(W, { k: 'bleedStop', a: u.i, vis: u.side === 0 || !!u.seenBy }); return; }
  const d = b.dps * dt; u.bled = (u.bled || 0) + d;
  if (u.hp - d < 0.5){ const by = W.units[b.by] || u; u.bleed = null; applyDmg(W, by, u, Math.max(1, Math.ceil(u.hp)), { ff: by !== u && by.side === u.side, far: false, part: null, tag: '출혈' }); return; }
  u.hp -= d;
}
// 눈 파괴: 하나 잃을 때마다 보는 거리 · 조준이 줄고 (눈이 많으면 그만큼 덜 — 카리우스는 여덟), 다 잃으면 실명 (몸에 닿는 것만 앎 · 동료가 불러 주는 자리로 움직임)
function maimEye(W, t, by){
  const M = W.rules.maim || {};
  if (t.noOrg || t.eyeLost >= t.eyes) return false;   /* v8.7.3 [무장기] */
  t.eyeLost++; const f = t.eyeLost / t.eyes;
  t.blind = t.eyeLost >= t.eyes;
  t.sightMul = t.blind ? 0 : 1 - (1 - (M.oneEye != null ? M.oneEye : 0.75)) * 2 * f;
  t.eyeAim = t.blind ? 0.05 : 1 - (1 - (M.oneEyeAim != null ? M.oneEyeAim : 0.85)) * 2 * f;
  maimAim(t);
  t.wounds.push(t.blind ? '실명' : '눈 파괴');
  interrupt(W, t, '눈이 터져 준비가 끊김');
  L(W, { k: 'maim', a: by, b: t.i, part: '눈', how: '파괴', blind: t.blind, left: t.eyes - t.eyeLost, of: t.eyes, eff: t.blind ? ['실명 — 몸에 닿는 것만 앎'] : ['보는 거리 ×' + t.sightMul.toFixed(2) + ' · 조준 ×' + t.eyeAim.toFixed(2)], vis: t.side === 0 || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: t.blind ? '실명!' : '눈 파괴!', c: 'd', t0: W.t });
  return true;
}
// 팔: 날붙이 (근접) = 절단 (피를 흘림), 그 밖 = 파괴 (뼈가 부러짐). 고른 팔이 이미 없으면 다른 팔
// 두 팔 다 = 무기를 못 씀 (발길질 · 못 막음 · 못 쏨 · 못 던짐 · 약을 못 씀). 활 = 두 손이 있어야 쏨 (맨손으로). 총 = 한 손으로 쏨 (조준 ×)
// 방패를 든 쪽: 왼팔 = 방패 팔 (방패를 놓침), 오른팔 = 무기 팔 (다른 손으로 · 공격 ×offHand). 방패가 없으면 왼팔 = 받치는 팔 (두 손으로 못 쥠 · ×twoHand)
function maimArm(W, t, by, wk, lr){
  const M = W.rules.maim || {}, A = t.arms;
  let k = lr || (W.rand() < 0.5 ? 'L' : 'R'); if (A[k]) k = k === 'L' ? 'R' : 'L'; if (A[k]) return false;
  const how = wk === '날붙이' ? '절단' : '파괴', wp = (W.rules.weapons || {})[t.weapon] || {}, eff = [];
  A[k] = how;
  if (A.L && A.R){
    dropHeld(W, t, 'arms'); dropShield(W, t, 'arms');   // v5.6 무기 · 방패가 땅에
    t.noArms = true; t.canGuard = false; t.canBash = false; t.jav = false; t.spearHeld = false; t.skill = null;
    t.rng = ((W.rules.weapons || {})['맨손'] || { rng: 0.3 }).rng + (t.reachX || 0); t.longReach = t.rng > 1; t.weaponNow = '발'; t.loud = false; t.aim = null; t.burst = null;
    t.atkMul *= t.giant ? (M.kickG || 0.6) : (M.kick || 0.3); t.armAim = 1;
    eff.push('두 팔을 다 잃음 — 발길질뿐 (못 막음 · 못 쏨)');
  } else if (wp.kind === '활' && isFar(t)){
    dropHeld(W, t, 'arm');   // v5.6 활을 떨어뜨림
    t.rng = ((W.rules.weapons || {})['맨손'] || { rng: 0.3 }).rng + (t.reachX || 0); t.weaponNow = '맨손'; t.aim = null; t.loud = false;
    eff.push('활을 못 당김 — 맨손으로');
  } else if (wp.kind === '총포류' && isFar(t)){
    t.armAim = M.gunOneArm || 0.55; eff.push('한 손으로 쏨 (조준 ×' + t.armAim + ')');
  } else if (k === 'L' && t.shield){
    const arm = t.armShield; dropShield(W, t, 'arm'); t.shieldLost = true; t.canGuard = !!wp.guard; t.canBash = false; eff.push(arm ? '막던 팔을 못 씀' : '방패를 놓침');   // v5.9.8 팔 방패   // v5.6 방패가 땅에
  } else if (k === 'R'){
    t.atkMul *= M.offHand || 0.6; eff.push('다른 손으로 무기를 쥠 (공격 ×' + (M.offHand || 0.6) + ')');
    if (t.jav){ t.armAim = M.javOff || 0.7; eff.push('투창도 다른 손으로'); }
    if (wp.guard && !t.shield){ t.canGuard = false; eff.push('대검으로 못 막음'); }
  } else {
    t.atkMul *= M.twoHand || 0.85; eff.push('두 손으로 못 쥠 (공격 ×' + (M.twoHand || 0.85) + ')');
    if (wp.guard && !t.shield){ t.canGuard = false; eff.push('대검으로 못 막음'); }
  }
  maimAim(t);
  if (how === '절단'){ startBleed(W, t, by); eff.push('피를 흘림'); }
  t.wounds.push((k === 'L' ? '왼팔 ' : '오른팔 ') + how);
  interrupt(W, t, '팔을 잃어 준비가 끊김');
  L(W, { k: 'maim', a: by, b: t.i, part: '팔', lr: k === 'L' ? '왼' : '오른', how, eff, vis: t.side === 0 || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: (k === 'L' ? '왼팔 ' : '오른팔 ') + how + '!', c: 'd', t0: W.t });
  return true;
}
// 짓뭉갬 (거구의 찍기 · 짓밟기를 막지 못하고 맞음): crush 확률로 뼈가 부러짐 — 팔 60% · 다리 40% (다리 = 기어다님)
function crushBone(W, u, t){
  if (!t.alive || wholeBody(t)) return;
  const M = W.rules.maim || {};
  if (W.rand() >= (M.crush != null ? M.crush : 0.25) * maimRes(W, t)) return;
  if (!(t.arms.L && t.arms.R) && (t.crawl || W.rand() < 0.6)) maimArm(W, t, u.i, '둔기'); else cripple(W, t, u.i, '둔기');
}
// v5.5 아군 시야 연동 (브리핑): 0.5초마다 누군가 본 상대를, 말이 닿는 (call.r 칸) 동료에게 불러 줌 — 대략의 자리 (±err 칸, 멀수록 조금 더).
// 완전히 보이진 않지만 서로 소통 중: 못 보는 동료도 그쪽으로 움직임 (쏘거나 치려면 직접 봐야 함)
function callouts(W){
  const C = W.rules.call || {}; if (C.on === false) return;
  const A = W.units.filter(a => a.alive && a.side === 0);
  for (const e of W.units){
    if (!e.alive || e.side !== 1) continue;
    const sp = A.filter(a => canSee(W, a, e)); if (!sp.length) continue;
    for (const a of A){
      if (sp.includes(a)) continue;
      const s = sp.find(b => dist(a, b) <= Math.min(C.r || W.rules.hear || 10, hearR(W, b, a))); if (!s) continue;   // v7.9.5 전장 소음에 묻힘
      const cur = a.sense[e.i]; if (cur && cur.exact && W.t - cur.t < 1) continue;
      const er = (C.err != null ? C.err : 0.4) + dist(s, e) * 0.03;
      a.sense[e.i] = { x: e.x + (W.rand() * 2 - 1) * er, y: e.y + (W.rand() * 2 - 1) * er, t: W.t, exact: false, call: true, by: s.i };
    }
  }
}
// 등 뒤 (dx, dy 쪽) reach 칸 안이 바위인가 (바위까지 거리, 없으면 0)
function wallBehind(W, u, dx, dy, reach){
  for (let s = u.r * 0.9 + 0.05; s <= reach; s += 0.1) if (rock(W.map, u.x + dx * s, u.y + dy * s)) return s;
  return 0;
}
// 벽을 등짐: 상대 a 반대쪽 0.55칸 안이 바위 — 비킬 곳 · 물러설 곳이 없고, 막아도 자세가 더 깎이고, 밀리면 짓뭉개짐
const backToWall = (W, u, a) => { const d = dist(u, a) || 1; return !!wallBehind(W, u, (u.x - a.x) / d, (u.y - a.y) / d, u.r + 0.55); };
// 밀려나는 거리: 힘 × (무게 비)^exp (최소 min · 최대 cap 배)
function kbLen(W, a, t, power, am){ power *= fbShove(W, a); const S = W.rules.shove || {}, tm = t.mass * (t.poise || 1) * fbPoise(W, t),   /* v8.7.5 진형 버프 */ cap = (S.cap || 1.6) * Math.max(S.capLo || 0.6, Math.min(S.capHi || 1.5, Math.pow((S.capRef || 80) / Math.max(5, tm), S.capExp != null ? S.capExp : 0.35))); return Math.min(power * cap, power * Math.max(S.min || 0.12, Math.pow((am != null ? am : a.mass) / Math.max(30, tm), S.exp || 0.6))) / (t.line ? 1 + 0.25 * Math.min(4, t.line.n - 1) : 1); }   /* v8.7.3 한도도 받는 무게로 · am = 친 것의 무게 */
// v8.7.3 던진 무기의 무게 (던진 이의 몸무게가 아님 — 호레이쇼 1100kg 이 아니라 대장군의 도끼)
const thrownMass = (W, u) => Math.max(5, Math.min(150, (u ? u.mass || 62 : 62) * ((W.rules.shove || {}).thrown || 0.12)));   // v5.7 전열은 덜 밀림
/* v7.24.2 괴력: 결정적인 순간에만 힘을 집중 — 쓸 수 있나 · 씀 (대기 · 빈틈 · 로그) */
const MIGHT = W => W.rules.might || {};
const mightReady = (W, u) => !!u && u.alive && (u.might || 1) > 1 && W.t >= (u.mightCd || -9) && !u.kb && W.t >= (u.stunT || -9) && !prone(W, u) && !u.crawl;
function mightUse(W, u, how, b){ const M = MIGHT(W); u.mightCd = W.t + ((M.cd || {})[u.mightG] || 6); u.openT = Math.max(u.openT == null ? -9 : u.openT, W.t + (M.open || 0.4)); u.offBal = Math.max(u.offBal || -9, W.t + (M.offBal || 0.35)); u.mightN = (u.mightN || 0) + 1;
  L(W, { k: 'might', a: u.i, b: b ? b.i : null, how, m: u.might, vis: u.side === 0 || !!u.seenBy || !!(b && (b.side === 0 || b.seenBy)) }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '괴력!', c: 'v', t0: W.t }); return u.might; }
// 밀침: 처음부터 벽에 붙어 있으면 (벽과 시전자 사이에 낌) 그 자리에서 짓뭉개짐 ×wall, 아니면 날아감 (stepKb)
function shove(W, a, t, power, dx, dy, o){
  if (!t.alive || power <= 0 || t.kb || W.t < (t.saT || -9)) return null;   /* v7.23.2 슈퍼아머 */
  const S = W.rules.shove || {}, l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
  let mt = false, len = kbLen(W, a, t, power, o && o.mass) * (t.crawl ? 0.5 : 1) * (t.ccRes ? 1 - t.ccRes * ((W.rules.cc || {}).shove != null ? W.rules.cc.shove : 0.6) : 1);   /* v7.29.0 버팀: 덜 밀림 */
  { const M = MIGHT(W);   /* v7.24.2 괴력: 크게 밀리려는 순간 버팀 (받는 쪽) · 밀치기가 안 먹히는 순간 밀어붙임 (미는 쪽) */
    if (a && t.side !== a.side && len >= (M.min || 0.5) && mightReady(W, t)){ len /= mightUse(W, t, 'resist', a); mt = true; }   /* v8.7.3 버팀 → 휘청 · 넘어짐 없음 */
    else if (a && o && (o.how === 'bash' || o.how === 'body') && t.side !== a.side && len < (M.weak || 0.35) && mightReady(W, a)) len *= mightUse(W, a, 'push', t); }
  if (wallBehind(W, t, dx, dy, t.r + 0.3)){ if (len < (S.crushMin != null ? S.crushMin : 0.35)) return null; crushWall(W, a, t, (S.wall || 1.2) * Math.min(1, len / (S.crushLen || 1.2)), o, true); return 'pinned'; }   /* v8.7.3 밀린 힘만큼 · 살짝은 기대 버팀 */
  return fling(W, a, t, len, dx, dy, { ...(o || {}), p: power, ccDone: true, ...(mt ? { mt: true } : {}) });
}
// 날아가는 중 (초당 vel 칸): 바위에 박히면 남은 기세만큼 짓뭉개짐, 다른 몸과 부딪히면 둘 다 다침 (볼링), 멀리 날아가면 넘어짐
function stepKb(W, u, dt){
  const K = u.kb, S = W.rules.shove || {}, step = Math.min(K.left, (S.vel || 7) * dt), x0 = u.x, y0 = u.y, a = W.units[K.by];
  tryMove(W, u, u.x + K.dx * step, u.y + K.dy * step);
  if (Math.hypot(u.x - x0, u.y - y0) < step * 0.45){ u.kb = null; crushWall(W, a, u, (0.5 + 0.5 * Math.min(1, K.left / Math.max(0.01, K.len))) * Math.min(1, K.len / (S.crushLen || 1.2)), K.o, false); return; }   /* v8.7.3 날아간 길이만큼 */
  K.left -= step;
  for (const e of W.units){
    if (!e.alive || e.kb || K.hit.includes(e.i) || dist(e, u) > e.r + u.r) continue;
    K.hit.push(e.i);
    if (K.o.brace && K.o.brace.includes(e.i) && e.side === u.side && !prone(W, e)){ const nb = Math.min(0.3, K.left * 0.5); if (nb > 0.02) tryMove(W, e, e.x + K.dx * nb, e.y + K.dy * nb); u.kb = null; L(W, { k: 'caught', a: e.i, b: u.i, vis: u.side === 0 || e.side === 0 || !!u.seenBy || !!e.seenBy }); return; }   /* v8.7.3 받쳐 준 동료가 받아 줌 — 부딪혀 다치지 않고 넘어지지 않음 (함께 조금 밀림) */
    const c = a.atk * (W.rules.lethal || 1) * (S.bowl || 0.15);
    L(W, { k: 'bowl', a: a.i, b: u.i, c: e.i, vis: u.side === 0 || e.side === 0 || !!u.seenBy || !!e.seenBy });
    hurtRaw(W, a, e, c, { tag: '부딪힘' }); if (u.alive) hurtRaw(W, a, u, c * 0.7, { tag: '부딪힘' });
    // 부딪힌 몸도 조금 밀림 (한 번만 이어짐 — 볼링 줄줄이 없음)
    if (e.alive && !e.kb && !(K.o.depth >= 1) && e.mass < u.mass * 1.5){ shove(W, a, e, K.p * 0.4, K.dx, K.dy, { how: 'bowl', depth: 1, mass: u.mass, via: u.i }); if (e.kb) e.kb.hit = [...new Set([...K.hit, u.i, e.i])]; }
    K.left *= 0.5;
    if (!u.alive){ u.kb = null; return; }
  }
  if (K.left <= 0.01){ u.kb = null; if (!K.o.mt && !K.o.noDown && W.rand() < downOdds(W, u, K)){ if (a && a.side !== u.side && W.t >= (u.mightCd || -9) && (u.might || 1) > 1 && u.alive){ u.kb = null; mightUse(W, u, 'stand', a); } else knockDown(W, u, S.prone || 0.9, K.by, '나가떨어짐'); } }   /* v7.24.2 괴력: 넘어지지 않고 버팀 */   // v5.7 넘어짐은 확률
}
// v5.7 넘어질 확률: 기세 (돌격은 부딪힌 속력 v, 밀침은 날아간 거리) × (민 쪽 무게 / 받은 쪽 무게)^0.5 (1.5 까지) · 막고 있었으면 ×0.6 · 붙어 선 동료마다 덜 (전열의 관절)
function downOdds(W, u, K){
  const S = W.rules.shove || {}, C = W.rules.charge || {}, a = W.units[K.by], dv = C.downV || 4, dl = S.downLen || 0.9;
  let p = K.o.v != null ? (K.o.v - dv * 0.6) / (dv * 0.8) : (K.len - dl * 0.5) / dl;
  if (a && a !== u) p *= Math.min(1.5, Math.sqrt((a.mass || 62) / Math.max(20, (u.mass || 62) * (u.poise || 1))));
  if (a && guardOn(W, u) && inGuard(W, u, a, true)) p *= 0.6;
  p /= 1 + 0.25 * formMates(W, u) + (u.line ? 0.15 * Math.min(4, u.line.n - 1) : 0);
  p *= fatMul(W, u, 'down');   // v6.6 탈진하면 잘 넘어짐
  if (K.o && K.o.downMul != null) p *= K.o.downMul;   // v6.7 팜 버스트는 덜 넘어뜨림
  return Math.max(0, Math.min(0.95, p));
}
/* ---------- v5.7 전열 = 하나의 몸 (애벌레) — 나란히 같은 쪽을 보고 선 근접끼리 관절로 이어짐 (양쪽 같음) ---------- */
// 마디: 살아 있고 서 있는 (넘어짐 · 날아감 · 기어다님 · 휘청 · 달리는 돌진 아님) 근접 (원거리 무기 아님).
// 관절: 두 마디 사이 line.link 칸 안 · 보는 쪽 차이 50° 안 · 서로 옆에 (잇는 선이 보는 쪽과 거의 직각 — 앞뒤로 선 것은 뒷줄). 이어진 덩어리가 2명 넘으면 전열
// 마디가 지키는 쪽: 전열 명령의 방향 · 자석 전열이 지키는 방향 (0.5초 안). 앞 ±90° 안에서 치려고 몸을 튼 것은 그대로 그쪽 — 옆 · 뒤로 돌아서면 몸이 보는 쪽
function lineFaceOf(W, u){
  const b = u.order && u.order.k === 'line' && u.order.f != null ? u.order.f : lretOn(W, u) ? u.lretF : u.lineHoldF != null && W.t - (u.lineHoldT || -9) < 0.5 ? u.lineHoldF : null;   // v7.2 전열 후퇴 중엔 전열이 보던 쪽
  return b != null && angDiff(u.face, b) < 1.6 ? b : u.face;
}
// v5.9.3 전열 마디가 될 수 없는 까닭: 뒤로 물러나는 중 (후퇴 — 뒤쪽 이동 명령 · 뒤로 걷는 속력) · 가까운 적에게 등을 돌림. was = 이어져 있던 마디 (조금 더 버팀)
function lineWhyOut(W, u, was){
  const LN = W.rules.line || {}, hy = was ? 1.3 : 1, f = lineFaceOf(W, u), fx = Math.cos(f), fy = Math.sin(f);
  const o = u.order; if (o && (o.k === 'move' || o.k === 'amove') && o.x != null && ((o.x - u.x) * fx + (o.y - u.y) * fy) < -0.6) return '후퇴';
  if (!lretOn(W, u) && -((u.vx || 0) * fx + (u.vy || 0) * fy) > (LN.back != null ? LN.back : 0.35) * hy) return '후퇴';   // v7.2 조직 후퇴는 전열 그대로 (함께 물러섬)
  const foes = lineFoes(W, u); if (foes.length){ const e = foes.reduce((m, x) => dist(x, u) < dist(m, u) ? x : m); if (angDiff(u.face, Math.atan2(e.y - u.y, e.x - u.x)) > Math.min(3.0, (LN.turn != null ? LN.turn : 1.9) * (was ? 1.12 : 1))) return '등을 돌림'; }
  return null;
}
function planLines(W){
  const LN = W.rules.line || {}, prev = W.lines || [];
  for (const u of W.units){ u.lineJ = u.line ? { left: u.line.left, right: u.line.right } : null; u.line = null; u.rearJ = !!u.rearOf; u.rearOf = null; }
  const lines = [];
  for (const side of [0, 1]){
    const M = W.units.filter(u => u.alive && u.side === side && !isFar(u) && !u.crawl && !u.kb && W.t >= u.proneT && W.t >= (u.stunT || -9) && !(u.act && u.act.k === 'charge' && u.act.phase === 'run') && !lineWhyOut(W, u, !!u.lineJ) && !(u.cls === '치유' && u.order && u.order.k === 'line' && u.order.join));   // v5.9.3 후퇴 · 등을 돌린 쪽은 마디가 아님   /* v7.24.3 전열 지원 치유는 마디가 아님 */
    const adj = new Map(M.map(u => [u, []]));
    for (let a = 0; a < M.length; a++) for (let b = a + 1; b < M.length; b++){
      const P = M[a], Q = M[b], d = dist(P, Q), was = P.lineJ && (P.lineJ.left === Q.i || P.lineJ.right === Q.i), hy = was ? (LN.hold || 1.3) : 1;   // 이어져 있던 관절은 조금 더 버팀 (몸을 돌리는 사이 끊기지 않음)
      const pf = lineFaceOf(W, P), qf = lineFaceOf(W, Q);
      if (d > (LN.link || 1.6) * hy || angDiff(pf, qf) > 0.87 * hy) continue;
      const mf = Math.atan2(Math.sin(pf) + Math.sin(qf), Math.cos(pf) + Math.cos(qf));
      if (Math.abs(((Q.x - P.x) * Math.cos(mf) + (Q.y - P.y) * Math.sin(mf)) / (d || 1)) > 0.6 * hy) continue;   // 앞뒤로 선 것은 관절이 아님
      adj.get(P).push(Q); adj.get(Q).push(P);
    }
    const seen = new Set();
    for (const u of M){
      if (seen.has(u) || !adj.get(u).length) continue;
      const comp = [], st = [u]; seen.add(u);
      while (st.length){ const x = st.pop(); comp.push(x); for (const y of adj.get(x)) if (!seen.has(y)){ seen.add(y); st.push(y); } }
      if (comp.length < 2) continue;
      const f = Math.atan2(comp.reduce((s, x) => s + Math.sin(lineFaceOf(W, x)), 0), comp.reduce((s, x) => s + Math.cos(lineFaceOf(W, x)), 0)), px = -Math.sin(f), py = Math.cos(f);
      // v5.9.3 다른 마디 바로 뒤에 선 쪽은 마디가 아니라 뒷줄 (대각선으로 옆 마디와 닿아도)
      { const fx = Math.cos(f), fy = Math.sin(f), behind = (x, j) => { const rx = x.x - j.x, ry = x.y - j.y, fw = rx * fx + ry * fy; return fw < -0.45 && Math.abs(rx * px + ry * py) < 0.6; };
        const keep = comp.filter(x => !comp.some(j => j !== x && behind(x, j))); if (keep.length < comp.length){ comp.length = 0; comp.push(...keep); } }
      if (comp.length < 2) continue;
      comp.sort((a, b) => (a.x * px + a.y * py) - (b.x * px + b.y * py));
      const ids = comp.map(x => x.i), old = prev.find(p => p.side === side && p.ids.some(i => ids.includes(i)));
      const ln = { id: old ? old.id : (W.lineN = (W.lineN || 0) + 1), side, ids, face: f, n: comp.length };
      comp.forEach((x, k) => { x.line = { ln, k, n: comp.length, left: k > 0 ? comp[k - 1].i : null, right: k < comp.length - 1 ? comp[k + 1].i : null }; if (!x.lineJ) x.lineT0 = W.t; });
      lines.push(ln);
      if ((!old || old.n < 2) && W.t - (W.lineLogT ? W.lineLogT[side] || -9 : -9) > 3 && W.units.some(f => f.alive && !f.gone && f.side !== side)){   /* v8.7.3 적이 남아 있을 때만 */ (W.lineLogT = W.lineLogT || {})[side] = W.t; L(W, { k: 'lineForm', side, ids, n: comp.length, vis: side === 0 || comp.some(x => x.seenBy) }); }
    }
    // v5.9.3 뒷줄: 이 편 전열이 다 정해진 뒤, 마디 바로 뒤의 근접 (창 2열 · 마디 뒤로 밀린 쪽) 도 전열에 포함 — 버팀 무게 · 빈자리 메움에 셈
    for (const ln of lines.filter(l => l.side === side)){ ln.rear = []; const f = ln.face, fx = Math.cos(f), fy = Math.sin(f), comp = ln.ids.map(i => W.units[i]);
      for (const r of W.units){ if (!r.alive || r.side !== side || r.line || r.rearOf || isFar(r) || r.crawl || r.kb || W.t < r.proneT || angDiff(r.face, f) > 1.0 || lineWhyOut(W, r, !!r.rearJ)) continue;
        let best = null, bd = 1e9; for (const j of comp){ const rx = r.x - j.x, ry = r.y - j.y, fw = rx * fx + ry * fy, lat = Math.abs(rx * -fy + ry * fx); if (fw < -0.25 && fw > -(LN.rear || 1.6) && lat < 0.95 && Math.hypot(rx, ry) < bd){ bd = Math.hypot(rx, ry); best = j; } }
        if (best){ ln.rear.push({ i: r.i, j: best.i }); r.rearOf = { ln, j: best.i }; } } }
  }
  // 이탈 · 쓰러짐: 지난번 전열의 마디가 빠짐 → 틈 (판에 표시). 쓰러진 자리는 둘레 뒷줄 (전열에 없고 맞붙지 않은 근접) 이 메우러 감
  W.lineGaps = (W.lineGaps || []).filter(g => W.t - g.t0 < 1.6);
  for (const ln of prev){
    // 전열이 통째로 흩어짐 (아무도 안 쓰러지고 남은 마디가 하나도 없음) → 한 줄로 '흩어짐'
    const U2 = ln.ids.map(i => W.units[i]);
    if (U2.every(u => !u.line && u.alive && !prone(W, u) && !u.crawl && !u.kb) && U2.some(u => W.t - (u.lineT0 != null ? u.lineT0 : W.t) >= 1)){
      if (U2.every(u => W.t - (u.lineOutT || -9) >= 2) && !U2.every(u => u.order && u.order.k === 'line') && W.units.some(f => f.alive && !f.gone && f.side !== ln.side)){ const hw = U2.map(u => lineWhyOut(W, u, true)); L(W, { k: 'lineBreak', side: ln.side, ids: ln.ids.slice(), n: ln.n, how: hw.every(h => h === '후퇴') ? '후퇴' : hw.some(h => h) ? hw.find(h => h) : '', vis: ln.side === 0 || U2.some(u => u.seenBy) }); }
      U2.forEach(u => { u.lineOutT = W.t; }); continue; }
  for (const i of ln.ids){
    const u = W.units[i]; if (u.line) continue;
    if (u.gone){ u.lineOutT = W.t; continue; }   /* v8.7.3 맵을 나간 이는 전열이 끊긴 게 아님 */
    const fell = !u.alive || prone(W, u) || u.crawl || u.kb;
    if (!fell && W.t - (u.lineT0 != null ? u.lineT0 : W.t) < 1) continue;   // 잠깐 붙었다 떨어진 것은 이탈이 아님
    if (W.t - (u.lineOutT || -9) < 2) continue; u.lineOutT = W.t;
    W.lineGaps.push({ x: +u.x.toFixed(2), y: +u.y.toFixed(2), t0: W.t, side: ln.side });
    if (!fell){ L(W, { k: 'lineLeave', a: u.i, n: ln.n, how: lineWhyOut(W, u, true) || (u.rearOf ? '뒷줄로' : '떨어짐'), vis: u.side === 0 || !!u.seenBy }); continue; }   // v5.9.3 까닭 (후퇴 · 등을 돌림 · 떨어짐)
    L(W, { k: 'lineFall', a: u.i, n: ln.n, how: !u.alive || u.down ? '쓰러짐' : u.kb ? '밀려남' : u.lie ? '엎드림' : '넘어짐', vis: u.side === 0 || !!u.seenBy });   // v5.7.2 밀려남 · 넘어짐 · 쓰러짐
    const fl = W.units.filter(f => f.alive && f.side === u.side && f !== u && !isFar(f) && !f.line && !f.crawl && (!(f.side === 0 && f.order) || (f.order.k === 'line' && f.order.join)) && dist(f, u) < ((W.rules.line || {}).fill || 2.6) * (f.rearOf && f.rearOf.j === u.i ? 1.3 : 1)
      && !W.units.some(e => e.alive && e.side !== f.side && gap(f, e) < Math.max(f.rng, e.rng) + 0.3)).sort((a, b) => dist(a, u) - dist(b, u))[0];
    if (fl){ fl.fill = { x: u.x, y: u.y, t: W.t, face: ln.face }; L(W, { k: 'lineFill', a: fl.i, b: u.i, vis: fl.side === 0 || !!fl.seenBy }); }
  } }
  W.lines = lines;
}
// 옆에 붙은 마디: 공격이 옆에서 오는데 그쪽에 동료 마디가 붙어 있으면 그 동료가 가림
function lineCover(W, t, a){
  if (!t.line) return null;
  const f = t.line.ln.face, s = (a.x - t.x) * -Math.sin(f) + (a.y - t.y) * Math.cos(f), id = s > 0 ? t.line.right : t.line.left, n = id != null ? W.units[id] : null;
  return n && n.alive && dist(n, t) < 1.8 ? n : null;
}
// 교전 구속: 마디의 손 닿는 곳에 있던 상대가 빠져나가면 (날아감 · 돌진 아님) 공짜 일격 — 마디마다 1.2초에 한 번
function lineOpportunity(W){
  const inL = new Set(); for (const ln of W.lines || []) for (const i of ln.ids) inL.add(i);
  for (const u of W.units){
    if (!(inL.has(u.i) || (!AI6.includes('eng') && !isFar(u) && !u.crawl && !u.noArms))) continue;   // v7.0 교전 구속: 모든 근접
    if (!u.alive || u.act || u.kb || W.t < u.proneT || W.t < (u.stunT || -9) || W.t < (u.oppT || -9) + 1.2) continue;
    for (const e of W.units){
      if (!e.alive || e.side === u.side || e.kb || (e.act && (e.act.k === 'charge' || e.act.k === 'leap' || e.act.k === 'dodge'))) continue;   // 도약 · 피하기로 빠지면 구속이 풀림
      const R0 = u.rng + 0.05, g1 = Math.hypot(e.px - u.x, e.py - u.y) - e.r - u.r, g2 = gap(u, e);
      if (g1 <= R0 && g2 > R0 && angDiff(u.face, Math.atan2(e.y - u.y, e.x - u.x)) < 1.2){
        u.oppT = W.t; L(W, { k: 'opportunity', a: u.i, b: e.i, line: inL.has(u.i), vis: u.side === 0 || e.side === 0 || !!u.seenBy || !!e.seenBy });
        strike(W, u, e, e, 1, false, { mul: (W.rules.line || {}).opp || 0.6, tag: inL.has(u.i) ? '빠지는 틈에 일격' : '등을 보인 틈에 일격' }); break;
      }
    }
  }
}
// v5.7 자석 전열: 지휘가 있는 편의 자동 근접은 전열을 지킴 (양쪽 같음). 손 닿는 앞의 상대만 치고 쫓지 않음.
// 손 닿는 상대가 없으면 마디 간격 (line.gap) 을 맞추고 앞뒤를 고르며 같이 나아감 (걸음 line.walk). 옆 · 뒤에서 손 닿는 상대 (가려 주는 마디 없음) 가 오면
// 돌아서 싸움 — 관절이 끊김 (포위에 약함). 넘어진 · 휘청이는 상대가 한 걸음 밖이면 끝내러 나감 · 많이 다쳐 겁나면 물러남 (이탈)
const lineFoes = (W, u) => W.units.filter(f => f.alive && f.side !== u.side && (u.side === 0 ? f.seenBy : canSee(W, u, f) || fresh(W, u.sense[f.i], 2)));
const lineAuto = (W, u) => !u.order && !u.shadow && !isFar(u) && !u.pack && !u.stalk && !u.crawl && u.role !== '미드필더' && cmdOf(W, u.side) > 0 && (u.side === 0 || u.state === 'hunt' || u.state === 'search');
function lineKeep(W, u, dt, ord){   // v5.9.3 ord = 전열 참여 명령 (겁 · 끝내러 나감 없이 자리를 지킴)
  if (!u.line || (!ord && (!lineAuto(W, u) || W.t - (u.lineT0 != null ? u.lineT0 : W.t) < 0.5))) return false;
  const ln = u.line.ln, LN = W.rules.line || {}, foes = lineFoes(W, u); if (!foes.length) return false;
  if (!ord && u.hp / u.max < 0.25 && u.bold < 0.5) return false;   // 겁 — 물러남
  if (!ord && foes.some(f => (prone(W, f) || W.t < (f.stunT || -9)) && gap(u, f) > u.rng + 0.05 && gap(u, f) <= u.rng + 0.8)) return false;   // 끝내러 나감
  const inFront = f => angDiff(ln.face, Math.atan2(f.y - u.y, f.x - u.x)) < 1.4;
  if (foes.some(f => !isFar(f) && gap(u, f) <= Math.max(u.rng, f.rng) + 0.1 && !inFront(f) && !lineCover(W, u, f))) return false;   // 옆 · 뒤 — 돌아섬
  const t = foes.filter(f => gap(u, f) <= u.rng + 0.05 && inFront(f)).sort((a, b) => dist(u, a) - dist(u, b))[0];
  u.lineHoldF = ln.face; u.lineHoldT = W.t;
  if (t){ u.target = t; if (u.side === 1) u.state = 'hunt'; stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x);   // 자리에서 침 (옆으로 돌지 않음)
    const bw = bashWhy(W, u, t); if (bw) startBash(W, u, t, bw); else startAct(W, u, t, '전열'); return true; }
  // 같이 나아감: 가장 가까운 앞의 상대 쪽으로 — 옆 마디와 간격 · 앞뒤를 맞춤
  const f0 = foes.filter(inFront).sort((a, b) => dist(u, a) - dist(u, b))[0]; if (!f0) return false;
  if (W.stance && W.stance[u.side] && W.stance[u.side].k === 'hold') return false;
  const fx = Math.cos(ln.face), fy = Math.sin(ln.face), px = -fy, py = fx, G = LN.gap || 1.05;   // (대치 중이면 명령받은 마디는 그 자리 — joinStep)
  const mem = ln.ids.map(i => W.units[i]).filter(m => m && m.alive), c = centroid(mem);
  const d0 = Math.hypot(f0.x - u.x, f0.y - u.y) || 1;
  let gx = u.x + (f0.x - u.x) / d0 * 0.6, gy = u.y + (f0.y - u.y) / d0 * 0.6;
  for (const id of [u.line.left, u.line.right]){ if (id == null) continue; const n = W.units[id]; if (!n || !n.alive) continue;
    const s = (u.x - n.x) * px + (u.y - n.y) * py, want = (s >= 0 ? 1 : -1) * G; gx += (want - s) * px * 0.6; gy += (want - s) * py * 0.6; }
  const e = (u.x - c.x) * fx + (u.y - c.y) * fy; gx -= e * fx * 0.8; gy -= e * fy * 0.8;   // 앞서 나간 마디는 기다림
  setGoal(W, u, gx, gy); follow(W, u, dt, LN.walk || 0.8);
  u.fg = Math.atan2(f0.y - u.y, f0.x - u.x); u.target = f0;
  setMood(W, u, '전열 전진', f0.i);
  return true;
}
// 자석: 전열 밖의 자동 근접 (창은 2열이라 빼고) 은 3칸 안 같은 편 전열의 끝에 붙음. 전열이 없으면 가까운 근접 동료 옆에 붙어 새 전열을 만듦
function lineJoin(W, u, dt, ord){   // v5.9.3 ord = 전열 참여 명령 (맞붙어 있어도 · 적이 멀어도 · 거구 · 창도)
  if (u.line || (!ord && (!lineAuto(W, u) || rank2(W, u) || u.giant && u.role !== '전선'))) return false;
  const foes = lineFoes(W, u); if (!ord && !foes.length) return false;
  if (!ord && foes.some(f => gap(u, f) <= Math.max(u.rng, isFar(f) ? 0.3 : f.rng) + 0.8)) return false;   // 맞붙음 — 보통 싸움
  const f0 = foes.sort((a, b) => dist(u, a) - dist(u, b))[0] || { x: u.x + Math.cos(u.face || 0) * 5, y: u.y + Math.sin(u.face || 0) * 5 }; if (!ord && dist(u, f0) > 8) return false;
  if (ord && rank2(W, u)){   // 창 (장창): 가장 가까운 마디의 뒷줄 (2열) — 비어 있는 마디 뒤
    let rb = null, rd = 1e9; for (const ln of W.lines || []){ if (ln.side !== u.side) continue; for (const id of ln.ids){ const j = W.units[id]; if (!j || !j.alive || (ln.rear || []).some(r => r.j === id && r.i !== u.i)) continue; const x = j.x - Math.cos(ln.face) * 1.05, y = j.y - Math.sin(ln.face) * 1.05, d = Math.hypot(x - u.x, y - u.y); if (d < rd && !rock(W.map, x, y)){ rd = d; rb = { x, y, f: ln.face }; } } }
    if (!rb){ const m = W.units.filter(a => a.alive && a !== u && a.side === u.side && !isFar(a) && !a.crawl && !rank2(W, a) && !W.units.some(o => o !== u && o.rearOf && o.rearOf.j === a.i)).sort((a, b) => dist(a, u) - dist(b, u))[0];   // 전열이 없으면 가까운 근접 동료 뒤 (창 방진)
      if (m){ const ff = Math.atan2(f0.y - m.y, f0.x - m.x), x = m.x - Math.cos(ff) * 1.05, y = m.y - Math.sin(ff) * 1.05; if (!rock(W.map, x, y)){ rb = { x, y, f: ff }; rd = Math.hypot(x - u.x, y - u.y); } } }
    if (rb && rd < 10){ if (rd > 0.2){ setGoal(W, u, rb.x, rb.y); follow(W, u, dt); } else stop(u); u.fg = rb.f; setMood(W, u, '뒷줄로'); return true; } }
  const G = (W.rules.line || {}).gap || 1.05;
  let best = null, bd = ord ? 10 : 3;
  for (const ln of W.lines || []){ if (ln.side !== u.side) continue;
    const fx = Math.cos(ln.face), fy = Math.sin(ln.face), px = -fy, py = fx;
    for (const [k, sg] of [[0, -1], [ln.ids.length - 1, 1]]){ const e = W.units[ln.ids[k]]; if (!e || !e.alive) continue;
      const x = e.x + px * G * sg, y = e.y + py * G * sg, d = Math.hypot(x - u.x, y - u.y); if (d < bd && !rock(W.map, x, y)){ bd = d; best = { x, y, f: ln.face }; } } }
  if (!best){   // 새 전열: 3칸 안 전열 밖 근접 동료 (번호가 낮은 쪽) 옆
    const m = W.units.filter(a => a.alive && a !== u && a.side === u.side && (ord || (a.role === '전선' && u.role !== '전선') || (a.i < u.i && !(u.role === '전선' && a.role !== '전선'))) && !a.line && !isFar(a) && !a.crawl && a.rng < 0.9 && dist(a, u) < (ord ? 8 : 3) && !a.pack && !a.stalk && a.role !== '미드필더').sort((a, b) => dist(a, u) - dist(b, u))[0];
    if (!m) return false;
    const f = Math.atan2(f0.y - m.y, f0.x - m.x), px = -Math.sin(f), py = Math.cos(f), sg = (u.x - m.x) * px + (u.y - m.y) * py >= 0 ? 1 : -1, x = m.x + px * G * sg, y = m.y + py * G * sg;
    if (rock(W.map, x, y)) return false; best = { x, y, f };
  }
  if (Math.hypot(best.x - u.x, best.y - u.y) > 0.2){ setGoal(W, u, best.x, best.y); follow(W, u, dt); }
  else stop(u);
  u.fg = best.f; setMood(W, u, '전열에 붙음');
  return true;
}
/* ---------- v7.2 전열 조직 후퇴 ---------- */
// 마디 둘 넘는 전열 (근접 — 보병 · 탱커, 뒷줄 포함) 이 정한 곳으로 함께 물러섬. 전열 모두가 같은 신호를 받음 (아군 명령 · 적 AI 같음).
// 대열 모양 그대로 (닻 + 제 자리) · 전열이 보던 쪽 (적) 으로 몸 · 방패를 든 채 뒷걸음 (backstep.back) · 가장 느린 마디에 맞춰 걸음 · 처진 마디를 기다림 (lag 칸 넘게 처지면 닻이 멈춤 · wait 초면 두고 감)
// 앞의 손 닿는 상대는 틈 (휘두른 뒤 회복 · 넘어짐 · 휘청 · 자세 무너짐) 을 보일 때만 받아침 · 옆 · 뒤에서 가려 주는 마디 없이 붙으면 돌아서 싸움 (목숨이 먼저). 다 물러서면 그 자리에 전열을 다시 세움
const LRET = W => W.rules.lret || { lag: 0.45, pace: 0.9, wait: 2.5, end: 0.25 };
const lretOf = (W, u) => u.lretId != null ? (W.lret || []).find(r => r.id === u.lretId) || null : null;
const lretOn = (W, u) => u.lretId != null && W.t - (u.lretFT == null ? -9 : u.lretFT) < 0.3;
function lretLine(W, u){   // 이 몸이 낀 전열 (앞줄 마디 둘 넘음) → 앞줄 + 뒷줄
  const ln = u.line ? u.line.ln : u.rearOf ? u.rearOf.ln : null; if (!ln || ln.ids.length < 2) return null;
  return { ln, ids: [...ln.ids, ...(ln.rear || []).map(r => r.i)] };
}
function lretStart(W, u0, x, y, by, why){
  const LL = lretLine(W, u0); if (!LL) return null;
  const M = LL.ids.map(i => W.units[i]).filter(m => m && m.alive && !m.crawl);
  if (M.filter(m => LL.ln.ids.includes(m.i)).length < 2) return null;
  const c = centroid(M), f = LL.ln.face, D = Math.hypot(x - c.x, y - c.y); if (D < 0.3) return null;
  const dx = (x - c.x) / D, dy = (y - c.y) / D;
  let ok = 0; for (let s = 0.2; ; s += 0.2){ const k = Math.min(s, D), ax = c.x + dx * k, ay = c.y + dy * k;   // 길: 모든 마디의 자리가 판 안 · 바위에 안 걸리는 데까지
    if (M.some(m => { const sx = ax + m.x - c.x, sy = ay + m.y - c.y; return sx < 0.35 || sy < 0.35 || sx > W.map.W - 0.35 || sy > W.map.H - 0.35 || boxRock(W, sx, sy, m.r * 0.9); })) break;
    ok = k; if (k >= D) break; }
  if (ok < 0.3) return null;
  for (const m of M){ const old = lretOf(W, m); if (old) lretEnd(W, old, 'new'); }
  const mvA = Math.atan2(dy, dx), dA = angDiff(mvA, f), BS = W.rules.backstep || {};
  const r = { id: (W.lretN = (W.lretN || 0) + 1), side: u0.side, ids: M.map(m => m.i), front: LL.ln.ids.slice(), f, ax: c.x, ay: c.y, tx: c.x + dx * ok, ty: c.y + dy * ok, off: {}, t0: W.t, by, why: why || '', lagT: {},
    back: dA > 2.1, spk: dA > 2.1 ? BS.back || 0.65 : dA > (BS.ang || 1.0) ? BS.side || 0.85 : 1 };
  const boss = cmdBoss(W, u0.side) || (by === 'ai' ? u0 : null); r.at = {}; r.dlv = {}; const miss = [];   // v7.3 적 AI 의 신호는 외쳐 전함 — 시끄러우면 늦게 · 동료를 거쳐 닿음   // v7.4 아군도 지휘관이 외쳐 · 손짓해 전함 (못 받은 마디는 빠짐 — 적은 다시 외침)
  if (by === 'user' && !boss && !AI6.includes('cmdlink') && W.t > 1e-6) return null;
  const lw = by === 'user' && W.t <= 1e-6 ? null : cmdWave(W, boss, M);
  for (const m of M){ const lk = lw ? lw[M.indexOf(m)] : { p: 1, t: 0, via: 'self' }, ok = lk.ok !== undefined ? lk.ok : W.rand() < lk.p;
    if (!ok && by === 'user'){ miss.push(m); L(W, { k: 'cmdMiss', side: 0, a: m.i, c: boss ? boss.i : null, via: lk.via, why: lk.why, p: +lk.p.toFixed(2), o: ['lret'], vis: true }); continue; }
    r.off[m.i] = [m.x - c.x, m.y - c.y]; m.lretId = r.id; m.lretF = f; m.lretFT = W.t; r.at[m.i] = W.t + lk.t + (ok ? 0 : ((W.rules.cmdLink || {}).retry || 1.2));
    if (m.side === 0 && r.at[m.i] <= W.t){ m.order = { k: 'lret', id: r.id }; r.dlv[m.i] = true; } }
  if (miss.length){ r.ids = r.ids.filter(i => !miss.some(m => m.i === i)); if (r.ids.filter(i => r.front.includes(i)).length < 2 && r.ids.length < 2) return null; }
  (W.lret = W.lret || []).push(r);
  const late = M.filter(m => r.at[m.i] - W.t >= 0.6).map(m => ({ i: m.i, s: +(r.at[m.i] - W.t).toFixed(1) }));
  L(W, { k: 'lret', side: r.side, ids: r.ids.slice(), by, why: r.why, d: +ok.toFixed(1), back: r.back, cut: ok < D - 0.05, late, din: by === 'ai' ? +(hearR(W, boss || u0, null)).toFixed(1) : null, vis: r.side === 0 || M.some(m => m.seenBy) });
  return r;
}
function lretEnd(W, r, how){
  W.lret = (W.lret || []).filter(x => x !== r);
  const M = r.ids.map(i => W.units[i]).filter(m => m && m.lretId === r.id);
  for (const m of M){ m.lretId = null; const o = r.off[m.i], sx = r.ax + o[0], sy = r.ay + o[1];
    if (m.side === 0 && m.order && m.order.k === 'lret') m.order = !m.alive || m.crawl ? null : how === 'done' ? { k: 'line', x: sx, y: sy, f: r.f } : { k: 'move', x: r.tx + o[0], y: r.ty + o[1] };   // 다 물러섬 → 그 자리에 전열 · 무너짐 → 각자 제 자리로
    else if (m.alive){ m.lineHoldF = r.f; m.lineHoldT = W.t; } }
  if (how !== 'new') L(W, { k: 'lretEnd', side: r.side, ids: M.filter(m => m.alive).map(m => m.i), how, sec: +(W.t - r.t0).toFixed(1), vis: r.side === 0 || M.some(m => m.seenBy) });
}
function lretTick(W, dt){
  if (!W.lret || !W.lret.length) return;
  const R = LRET(W);
  for (const r of W.lret.slice()){
    const M = [];
    for (const i of r.ids){ const m = W.units[i]; if (!m || m.lretId !== r.id) continue;
      if (m.side === 0 && r.dlv && !r.dlv[i] && r.at && W.t >= r.at[i]){ m.order = { k: 'lret', id: r.id }; r.dlv[i] = true; preempt(W, m); L(W, { k: 'cmdRecv', a: m.i, c: null, via: 'voice', sec: +(W.t - r.t0).toFixed(1), o: ['lret', r.id], vis: true }); }   // v7.4 신호가 닿음
      if (!m.alive || m.crawl || (m.side === 0 && (!r.dlv || r.dlv[i]) && !(m.order && m.order.k === 'lret' && m.order.id === r.id))){ m.lretId = null; continue; }   // 쓰러짐 · 다른 명령 → 빠짐
      if (r.at && W.t < r.at[i]) continue;   // v7.3 아직 신호가 안 닿음 (하던 대로)
      M.push(m); }
    const heardAll = !r.at || r.ids.every(i => !W.units[i] || W.units[i].lretId !== r.id || W.t >= r.at[i]);
    if (M.length < 2 && heardAll){ lretEnd(W, r, 'broken'); continue; }
    if (!M.length) continue;
    let lag = 0;
    for (const m of M){ const o = r.off[m.i], d = Math.hypot(r.ax + o[0] - m.x, r.ay + o[1] - m.y); m.lretF = r.f; m.lretFT = W.t;
      if (d > R.lag){ if (r.lagT[m.i] == null) r.lagT[m.i] = W.t; if (W.t - r.lagT[m.i] > (R.wait || 2.5)){ m.lretId = null; r.lagT[m.i] = null; if (m.side === 0 && m.order && m.order.k === 'lret') m.order = { k: 'move', x: r.tx + o[0], y: r.ty + o[1] }; L(W, { k: 'lretDrop', a: m.i, vis: m.side === 0 || !!m.seenBy }); continue; } }
      else r.lagT[m.i] = null;
      lag = Math.max(lag, d); }
    const rem = Math.hypot(r.tx - r.ax, r.ty - r.ay);
    if (rem > 1e-3 && lag < R.lag){ const v = Math.min(...M.map(m => spdNow(W, m))) * r.spk * (R.pace || 0.9), s = Math.min(rem, v * dt); r.ax += (r.tx - r.ax) / rem * s; r.ay += (r.ty - r.ay) / rem * s; }
    else if (rem <= 1e-3 && lag < (R.end || 0.25) && heardAll) lretEnd(W, r, 'done');
    else if (W.t - r.t0 > 30) lretEnd(W, r, 'time');
  }
}
// 마디 하나의 걸음: 닻 + 제 자리로 (몸은 전열이 보던 쪽). 옆 · 뒤에서 붙으면 돌아서 침 · 앞의 틈만 받아침
function lretStep(W, u, dt){
  const r = lretOf(W, u); if (!r || (r.at && W.t < r.at[u.i])) return false;   // v7.3 신호가 닿기 전엔 하던 대로
  const o = r.off[u.i], sx = r.ax + o[0], sy = r.ay + o[1], d = Math.hypot(sx - u.x, sy - u.y);
  u.lretF = r.f; u.lretFT = W.t; u.lineHoldF = r.f; u.lineHoldT = W.t;
  const inFront = f => angDiff(r.f, Math.atan2(f.y - u.y, f.x - u.x)) < 1.4;
  const rch = lineFoes(W, u).filter(f => gap(u, f) <= u.rng + 0.05).sort((a, b) => dist(u, a) - dist(u, b));
  const side = rch.find(f => !isFar(f) && !inFront(f) && !lineCover(W, u, f));
  if (side){ u.target = side; stop(u); u.fg = Math.atan2(side.y - u.y, side.x - u.x); startAct(W, u, side, '전열 후퇴 — 옆 · 뒤를 막음'); return true; }
  const op = d < 0.3 ? rch.find(f => inFront(f) && ((f.act && f.act.phase === 'rec') || prone(W, f) || W.t < (f.stunT || -9) || W.t < (f.brokenT || -9))) : null;
  if (op){ u.target = op; stop(u); u.fg = Math.atan2(op.y - u.y, op.x - u.x); const bw = bashWhy(W, u, op); if (bw) startBash(W, u, op, bw); else startAct(W, u, op, '물러서며 받아침'); return true; }
  if (d > 0.06){ if (walkClear(W.map, u.x, u.y, sx, sy, u.r * 0.92)){ u.goal = { x: sx, y: sy }; u.path = [{ x: sx, y: sy }]; u.pathT = W.t; } else setGoal(W, u, sx, sy); follow(W, u, dt); }   // 움직이는 제 자리를 매 순간 따라감 (setGoal 은 0.6칸 · 0.8초 묶음)
  else { stop(u); u.fg = r.f; }
  setMood(W, u, r.back ? '전열 후퇴' : '전열 이동');
  return true;
}
// 적 AI 의 전열 조직 후퇴 (지휘가 있을 때 · 아군과 같은 규칙): ① 후퇴 작전 — 다시 모이는 자리로 전열째 ② 유인 — 맞붙은 전열이 궁수 앞으로 끌어들임
// ③ 밀림 — 손 닿는 상대의 힘이 전열의 push 배를 넘고 뒤에 궁수가 있으면, 궁수 엄호 아래로 한 걸음 (step 칸) 물러나 받음
function lretAI(W){
  if (AI6.includes('lret') || !W.plan || cmdOf(W, 1) <= 0) return;
  const R = LRET(W), P = W.plan;
  for (const ln of (W.lines || []).filter(l => l.side === 1 && l.ids.length >= 2)){
    const M = ln.ids.map(i => W.units[i]).filter(m => m && m.alive && !m.crawl); if (M.length < 2 || M.some(m => m.lretId != null)) continue;
    const c = centroid(M), bx = -Math.cos(ln.face), by = -Math.sin(ln.face);
    const foes = W.units.filter(e => e.alive && e.side === 0 && !e.crawl && M.some(m => canSee(W, m, e) || fresh(W, m.sense[e.i], 1.5)));
    const eng = foes.filter(e => !isFar(e) && M.some(m => gap(m, e) < Math.max(m.rng, e.rng) + 1.2));
    const bows = W.units.filter(a => a.alive && a.side === 1 && isFar(a) && !a.crawl && ((a.x - c.x) * -bx + (a.y - c.y) * -by) < -1);   // 전열 뒤의 사수
    let dest = null, why = null;
    if (P.k === 'withdraw' && P.rally && !P.lretDone){ const fx = -bx, fy = -by; dest = { x: P.rally.x + fx * 1, y: P.rally.y + fy * 1 }; why = '후퇴 작전 — 전열째 물러섬'; P.lretDone = true; }
    else if (eng.length && bows.length && (W.lretAIn || 0) < (R.max || 4) && W.t - (W.lretAIT == null ? -99 : W.lretAIT) >= (R.cd || 6)){
      const back = Math.min(...bows.map(a => (a.x - c.x) * bx + (a.y - c.y) * by)), room = Math.min(R.step || 2.5, back - 1.5);   // 가장 가까운 뒤의 궁수 1.5칸 앞까지
      const pf = eng.reduce((s, e) => s + powerOf(e), 0), pm = M.reduce((s, m) => s + powerOf(m), 0);
      const lured = W.stance && W.stance[1] && W.stance[1].bait > 0;
      if (room >= 0.8 && P.k === 'bait' && lured){ dest = { x: c.x + bx * room, y: c.y + by * room }; why = '유인 — 전열째 물러서 궁수 앞으로 끌어들임'; }
      else if (room >= 0.8 && pf > pm * (R.push || 1.1)){ dest = { x: c.x + bx * room, y: c.y + by * room }; why = `밀림 (손 닿는 상대의 힘 ×${(pf / Math.max(1e-6, pm)).toFixed(1)}) — 궁수 엄호 아래로 한 걸음`; }
    }
    if (!dest) continue;
    const r = lretStart(W, M[0], dest.x, dest.y, 'ai', why);
    if (r && P.k !== 'withdraw'){ W.lretAIT = W.t; W.lretAIn = (W.lretAIn || 0) + 1; }
  }
}
// 막을 수 없는 몸 충격 (짓뭉개짐 · 부딪힘 · 짓밟기): 둔기 · 몸통으로 방어구만 셈, 넘어진 몸은 더 다침
function hurtRaw(W, u, t, base, o){
  if (!t.alive) return 0;
  const AM = armorMul(W.rules, t, '몸통', '둔기');
  const dmg = Math.max(1, Math.round(base * AM.m * (mbOn(W, t) ? mbF(W, t, 'dmg') : 1) * (prone(W, t) ? rv(W, 'proneHit', 1.5) : 1)));
  const part = o && /짓밟|내려찍/.test(o.tag || '') && W.rand() < 0.4 ? '머리' : '몸통', o2 = { ff: t.side === u.side, far: false, part, armor: AM.m < 1 && AM.it ? AM.it.name : null, armMul: AM.m, wk: '둔기', ...o };
  applyDmg(W, u, t, dmg, o2);
  wearHit(W, u, t, { far: true, jav: true }, AM.it, dmg, AM.m);   // v7.20 몸 충격도 갑옷이 받아 냄
  if (o && /짓뭉개|짓눌|짓밟|내려찍/.test(o.tag || '') && t.side !== u.side && WR(W)) woundRoll(W, u, t, o2, dmg, part, false, false, WR(W).mix['둔기']);   // v6.9 짓뭉갬 · 짓밟기 = 둔력 (머리를 짓밟히면 으깨질 수 있음)
  return dmg;
}
// 짓뭉개짐: 벽에 박힘 (k = 남은 기세, pinned = 처음부터 벽과 시전자 사이에 낌) — 막을 수 없음 · 넘어짐
function crushWall(W, a, t, k, o, pinned){
  const S = W.rules.shove || {};
  L(W, { k: 'crush', a: a.i, b: t.i, pinned: !!pinned, vis: a.side === 0 || t.side === 0 || !!a.seenBy || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'crush', x: t.x, y: t.y, t0: W.t });
  hurtRaw(W, a, t, a.atk * (W.rules.lethal || 1) * (S.crush || 0.9) * k, { tag: pinned ? '벽에 짓눌림' : '벽에 짓뭉개짐' });
  if (t.alive && k >= 0.5) knockDown(W, t, S.crushProne || 1.6, a.i, '벽에 짓뭉개짐'); else if (t.alive) stun(W, t, 0.25, a.i);   /* v8.7.3 약하게 박히면 휘청만 */
}

/* ---------- v5.2 거구의 공격: 넓게 휘두르기 (부채꼴 · 동료도 맞음 · 넉백) · 찍기 (한 놈 · 무거움 · 치명이면 넘어뜨림) · 짓밟기 (넘어진 상대 · 확인사살) ---------- */
// 휘두르는 부채꼴 안의 몸 (앞 ang ±arc, 사거리 + reach): F = 상대, M = 동료
function swingArc(W, u, ang){
  const S = W.rules.sweep || {}, arc = (S.arc || 65) * Math.PI / 180, R = u.rng + (S.reach || 0.35), F = [], M = [];
  for (const o of W.units){
    if (!o.alive || o === u || gap(u, o) > R) continue;
    if (angDiff(Math.atan2(o.y - u.y, o.x - u.x), ang) > arc + Math.atan2(o.r, Math.max(0.3, dist(u, o)))) continue;
    (o.side === u.side ? M : F).push(o);
  }
  return { F, M };
}
// 한 놈을 밀쳤을 때 얻는 것 (+) · 잃는 것 (−): 벽 쪽이면 짓뭉개짐, 붙어 선 진형에서 떼어 냄 (고립 — 공성망치), 동료를 노리던 놈을 떼어 냄, 사수는 거리를 줌 (−), 마무리할 놈은 붙잡아 둠 (−)
function kbValue(W, u, f, power){
  const d = dist(u, f) || 1, dx = (f.x - u.x) / d, dy = (f.y - u.y) / d, len = kbLen(W, u, f, power);
  let v = 0;
  const wall = !!wallBehind(W, f, dx, dy, f.r + len + 0.1);
  if (wall) v += 4;
  const tight = W.units.filter(o => o.alive && o !== f && o.side === f.side && dist(o, f) < 1.4).length;
  v += Math.min(2, tight) * 0.9;
  const fo = focusOf(W, f);
  if (fo && fo.side === u.side && fo !== u && (fo.hp / fo.max < 0.5 || isFar(fo) || prone(W, fo))) v += 2;
  if (isFar(f) && !wall) v -= 2.5;
  if (pHp(W, u.side, f) < 0.25 && !wall) v -= 1;
  return v * Math.min(1, len / 0.8);
}
// 어떤 공격을 할지 (확률): 기대 이득 = 상대에게 줄 피해 몫 + 넉백 이득 − 동료가 맞을 몫 (오사처럼 무겁게). 동료가 곁에 있으면 이득이 분명할 때만 휘두름.
// 넘어진 상대 (거구가 아닌) 는 짓밟기. 명령 (u.swing = '휘두르기' · '찍기') 이 있으면 그대로
function swingPlan(W, u, t){
  if (u.noArms) return prone(W, t) && !t.giant ? 'stomp' : null;   // v5.5 두 팔이 없으면 휘두르기 · 찍기를 못 함 (짓밟기 · 발길질만)
  if (prone(W, t) && !t.giant) return 'stomp';
  if (u.swing === '찍기') return 'smash';
  const S = W.rules.sweep || {}, H = W.rules.heavy || {}, ang = Math.atan2(t.y - u.y, t.x - u.x), { F, M } = swingArc(W, u, ang);
  if (u.swing === '휘두르기') return F.length ? 'sweep' : 'smash';
  if (u.side === 1 && F.length < 2){   // v6.0 숙련된 용병: 적 둘 이상을 휩쓸 때가 아니면, 동료가 부채꼴에 있거나 준비하는 동안 들어올 것 같으면 (움직이는 쪽은 그 앞) 휘두르지 않음
    const wt = u.wind * ((W.rules.heavy || {}).wind || 1.3), arc = (S.arc || 65) * Math.PI / 180, Rr = u.rng + (S.reach || 0.35) + 0.3;
    if (M.length || W.units.some(o => o.alive && o !== u && o.side === u.side && [0.5, 1].some(q => { const px = o.x + (o.vx || 0) * wt * q, py = o.y + (o.vy || 0) * wt * q; return Math.hypot(px - u.x, py - u.y) - o.r - u.r <= Rr && angDiff(Math.atan2(py - u.y, px - u.x), ang) <= arc + 0.2; }))) return 'smash';
  }
  const base = u.atk * u.atkMul * (W.rules.lethal || 1);
  const part = (f, mul) => Math.min(1, base * mul * armorMul(W.rules, f, '몸통', heavyKind(W, u)).m / Math.max(1, f.hp)) * 6;
  let vS = 0; for (const f of F) vS += part(f, S.mul || 0.8) * (inGuard(W, f, u) ? 0.3 : 1) + kbValue(W, u, f, S.p || 0.8);
  for (const m of M) vS -= part(m, S.mul || 0.8) * 1.6 + 1.5 + (m.hero ? 1 : 0) + (prone(W, m) ? 2 : 0);
  const g = inGuard(W, t, u), vC = part(t, H.mul || 1.3) * (g ? 0.45 : 1) + (H.crit || 0.2) * 3 + (g ? 1.2 : 0);
  let D = vS - vC;
  if (M.length) D -= 1.5 * (1.2 - u.bold) + (u.side === 1 ? 2.5 : 0);   // v6.0 숙련된 용병은 제 편을 휩쓸 휘두르기를 더 꺼림
  return W.rand() < 1 / (1 + Math.exp(-D / 1.2)) ? 'sweep' : 'smash';
}
const heavyKind = (W, u) => { const k = ((W.rules.weapons || {})[u.weaponNow || u.weapon] || {}).kind; return !k || k === '맨손' ? '둔기' : k; };
const HEAVY_TXT = { sweep: '넓게 휘두르기', smash: '찍기', stomp: '짓밟기' };
// 확인사살 이름: 무기를 든 거구 (곤봉 …) 는 내려찍기, 맨몸 (카리우스) 은 짓밟기
const heavyName = (u, mode) => mode === 'stomp' && u.weapon && u.weapon !== '맨손' ? '내려찍기' : HEAVY_TXT[mode];
function heavyHit(W, u, t, mode){
  const S = W.rules.sweep || {}, H = W.rules.heavy || {}, wk = heavyKind(W, u);
  if (mode === 'sweep'){
    const ang = u.face, { F, M } = swingArc(W, u, ang), all = [...F, ...M].sort((a, b) => dist(u, a) - dist(u, b));
    L(W, { k: 'sweep', a: u.i, b: t.i, foes: F.map(f => f.i), ff: M.map(m => m.i), vis: u.side === 0 || !!u.seenBy });
    if (W.fxOn){ W.fx.push({ k: 'sweep', a: u.i, ang, t0: W.t, r: u.r + u.rng + (S.reach || 0.35), arc: (S.arc || 65) * Math.PI / 180 }); W.fx.push({ k: 'say', a: u.i, s: '휘익—!', t0: W.t }); }
    if (!all.length){ u.miss++; L(W, { k: 'miss', a: u.i, b: t.i, why: '넓게 휘둘렀으나 모두 비켜섬' }); return; }
    for (const f of all){
      const o = strike(W, u, f, f, 1, false, { mul: S.mul || 0.8, wk, tag: '넓게 휘두르기', heavyCrit: S.crit || 0.06 });
      if (f.alive && !f.kb) shove(W, u, f, (S.p || 0.8) * (o && o.block ? 0.7 : 1), f.x - u.x, f.y - u.y, { how: 'sweep' });
    }
    return;
  }
  if (mode === 'stomp'){
    // 짓밟기: 넘어진 상대를 발로 — kill 확률로 확인사살, 아니면 공격 × mul (막을 수 없음)
    if (W.fxOn) W.fx.push({ k: 'crush', x: t.x, y: t.y, t0: W.t });
    const kill = W.rand() < (H.stompKill != null ? H.stompKill : 0.45);
    const nm = heavyName(u, 'stomp');
    L(W, { k: 'stomp', a: u.i, b: t.i, kill, how: nm, vis: u.side === 0 || t.side === 0 || !!u.seenBy });
    if (kill) applyDmg(W, u, t, Math.max(1, Math.ceil(t.hp)), { ff: t.side === u.side, far: false, part: '머리', tag: nm + ' · 확인사살' });
    else { hurtRaw(W, u, t, u.atk * u.atkMul * (W.rules.lethal || 1) * (H.stomp || 2.2), { tag: nm }); crushBone(W, u, t); }   // v5.5 짓밟혀 뼈가 부러짐
    return;
  }
  // 찍기: 한 놈에게 무겁게. 막아도 자세가 크게 깎임 (방패벽을 깨는 망치)
  const o = strike(W, u, t, t, 1, false, { mul: H.mul || 1.3, wk, tag: '찍기', heavyCrit: H.crit || 0.2 });
  if (o && !o.block) crushBone(W, u, t);   // v5.5 막지 못하고 맞으면 뼈가 부러질 수 있음
  if (o && o.block && t.alive){ t.post -= H.post || 45; if (t.post <= 0 && W.t >= t.brokenT){ t.post = 0; t.brokenT = W.t + W.rules.breakTime; L(W, { k: 'guardBreak', a: u.i, b: t.i, arm: !!t.armShield, vis: true }); } }
}

/* ---------- v5.2 방패 밀치기 ---------- */
// 짧은 준비 → 둔기 · 공격 ×dmg, 상대 자세 −post, 힘 p 로 밀침 (무게 비 — 막아도 밀림). 벽 쪽이면 짓뭉개짐
function startBash(W, u, t, why, body){   // v5.8.6 body = 방패 없이 몸 (어깨) 으로 밀침 — 더 약함
  if (u.lie) return false;   // v7.11 엎드린 채 밀치지 않음
  if (W.t < u.brokenT){ setMood(W, u, '자세를 추스름', t.i); return false; }   // v5.8.9 자세가 무너지면 밀치지 못함
  tire(W, u, 'bash');   // v6.6
  const B = W.rules.bash || {};
  u.act = { k: 'bash', b: t.i, phase: 'wind', t0: W.t, end: W.t + (B.wind || 0.25), why: why || '', body: !!body, arm: !body && !!u.armShield };
  u.bashCd = W.t + (B.cd || 4); stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); u.waitT = 0;
  setMood(W, u, body ? '몸 밀치기' : '방패 밀치기', t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, bash: true, body: !!body, arm: !body && !!u.armShield, end: +(W.t + (B.wind || 0.25)).toFixed(2), why: why || '', hid: u.side === 1 && !u.seenBy });
}
function resolveBash(W, u){
  const A = u.act, t = W.units[A.b], B = W.rules.bash || {};
  if (A.phase !== 'wind'){ u.act = null; return; }
  if (!t.alive) L(W, { k: 'miss', a: u.i, b: t.i, why: '대상이 이미 쓰러짐' });
  else if (gap(u, t) > 0.35 + W.rules.reach) L(W, { k: 'miss', a: u.i, b: t.i, why: W.t - t.dodgedT < 0.5 ? '몸을 빼 피함' : A.body ? '어깨가 닿지 않음' : A.arm ? '팔이 닿지 않음' : '방패가 닿지 않음' });
  else {
    if (W.fxOn) W.fx.push({ k: 'slash', a: u.i, b: t.i, t0: W.t });
    const bd = !!A.body;   // v5.8.6 몸 밀치기: 피해 · 자세 깎기 · 미는 힘 모두 약함 (bodyMul)
    strike(W, u, t, t, 1, false, { mul: (B.dmg || 0.3) * (bd ? B.bodyMul || 0.5 : 1), wk: bd ? '맨손' : '둔기', tag: bd ? '몸 밀치기' : u.armShield ? '팔 밀치기' : '방패 밀치기', noWound: true });
    if (t.alive && t.canGuard){ t.post -= (B.post || 30) * (bd ? B.bodyMul || 0.5 : 1); if (t.post <= 0 && W.t >= t.brokenT){ t.post = 0; t.brokenT = W.t + W.rules.breakTime; } }
    if (t.alive) shove(W, u, t, (B.p || 0.7) * (bd ? 0.75 : 1), t.x - u.x, t.y - u.y, { how: bd ? 'body' : 'bash' });
  }
  A.phase = 'rec'; A.end = W.t + (B.rec || 0.35); A.t1 = W.t;
}
// 방패로 밀칠 까닭 (없으면 ''): 벽으로 밀어 짓뭉갬 · 동료를 치려는 놈의 준비를 끊음 · 둘러싸여 자리를 만듦 · 진형에서 떼어 냄
function bashWhy(W, u, t){
  if (!u.canBash || W.t < u.bashCd || u.act || W.t < u.brokenT || prone(W, u) || prone(W, t) || gap(u, t) > 0.35) return '';
  if (W.units.some(o => o.alive && o !== u && o.side === u.side && !isFar(o) && o.act && o.act.k === 'atk' && o.act.phase === 'wind' && o.act.b === t.i)) return '';   // v6.0 동료가 내려치려는 상대를 밀쳐 사거리 밖으로 보내지 않음
  const v = kbValue(W, u, t, (W.rules.bash || {}).p || 0.7);
  if (v >= 3.5) return '벽으로 밀침';
  const ta = t.act && t.act.phase === 'wind' && (t.act.k === 'atk' || t.act.k === 'bash') ? W.units[t.act.b] : null;
  if (ta && ta.side === u.side && ta !== u) return '동료를 치려던 놈을 밀침';
  if (W.units.filter(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < f.rng + 0.4).length >= 2) return '자리를 만듦';
  if (v >= 1.8) return '떼어 냄';
  return '';
}

/* ---------- v5.2 피하기 · 발놀림 ---------- */
// 피하기: 나를 노린 근접 공격 (방패 밀치기 · 동료든 상대든 휘두르는 부채꼴 포함) 의 준비가 win 초 남았을 때, 알아차렸으면
// 확률 p × 날렵함 (지금 속력 ÷ 3) × 둘레 여유로 step 칸 비켜섬. 벽을 등지면 ×wall, 셋 넘게 둘러싸이면 반. 막는 방향 안이면 막음. 거구는 피하지 않음 (몸으로 받음)
const stepOK = (W, u, ch) => { const ST = W.rules.step || {}; return !!ST.on && W.t >= (u.stepCd == null ? -9 : u.stepCd) && !(u.raised && u.shield) && (ch || !isFar(u)) && !u.lie && !u.crawl && !(u.side === 0 && u.order && u.order.k === 'hold') && !AI6.includes('step'); };
// v8.7.3 비켜설 자리 (x, y) 가 그 일격 밖인가 — 밀치기 · 보통 일격은 닿는 거리 밖 · 넓게 휘두르기는 닿는 거리 밖이거나 (노린 몸이 아니면) 부채꼴 밖
function outOfSwing(W, atk, u, x, y){
  const a = atk.act, SW = W.rules.sweep || {}, d = Math.hypot(x - atk.x, y - atk.y), g = d - atk.r - u.r, R = a.k === 'bash' ? 0.35 + W.rules.reach : a.mode === 'sweep' ? atk.rng + (SW.reach || 0.35) : atk.rng + W.rules.reach;
  if (g > R + 0.05) return true;
  if (a.mode !== 'sweep' || a.b === u.i) return false;   // 노린 몸은 휘두르는 쪽이 따라 돎 — 거리로만
  const b = W.units[a.b]; if (!b) return false;
  return angDiff(Math.atan2(y - atk.y, x - atk.x), Math.atan2(b.y - atk.y, b.x - atk.x)) > (SW.arc || 65) * Math.PI / 180 + Math.atan2(u.r, Math.max(0.3, d)) + 0.08;
}
function tryDodge(W, u, stepOnly){
  if ((!stepOnly && W.t < u.dodgeCd) || u.kb || prone(W, u) || u.giant || W.t < (u.hobbleT || -9)) return false;   /* v7.23.2 이동 제약: 스텝 못 함 */
  const D = W.rules.dodge || {}, win = D.win || 0.22, ST = W.rules.step || {};
  let atk = null, stepK = false, chargeK = false;
  if (stepOK(W, u, true)){ const ce = W.units.find(e => e.alive && e.side !== u.side && e.act && e.act.k === 'charge' && e.act.phase === 'run' && e.act.b === u.i && !(e.act.tried || []).includes(u.i) && gap(u, e) < (ST.chargeD || 1.5)); if (ce){ atk = ce; stepK = true; chargeK = true; } }   /* v7.17 돌격해 오는 상대는 옆으로 비켜섬 (사수도) */
  if (!atk) for (const e of W.units){
    const a = e.act;
    if (!e.alive || e === u || !a || a.phase !== 'wind' || a.end - W.t > win || (a.tried || []).includes(u.i)) continue;
    if (a.k === 'bash' && a.b === u.i && !stepOnly){ atk = e; break; }
    if (a.k !== 'atk' || isFar(e)) continue;
    if (a.mode === 'sweep'){ const b = W.units[a.b], arc = swingArc(W, e, Math.atan2(b.y - e.y, b.x - e.x)); if (arc.F.includes(u) || arc.M.includes(u)){ atk = e; break; } }
    else if (e.side !== u.side && a.b === u.i && (!W.rules.evade || AI6.includes('evade'))){ atk = e; break; }
    else if (e.side !== u.side && a.b === u.i && stepOK(W, u)){ atk = e; stepK = true; break; }   /* v7.17 사이드 · 백스텝 */   // v6.7 보통 일격은 회피 (맞는 순간 몸을 비틂) 로 — 피하기 (비켜서기) 는 밀치기 · 휘두르기만
  }
  if (!atk || (stepOnly && (!stepK || (!chargeK && (isFar(u) || (u.act && u.act.phase === 'wind' && u.act.end < atk.act.end - 0.02)))))) return false;   /* v7.17 내 일격이 먼저 닿으면 그대로 침 · 같은 순간이면 맞바꿀지 비켜설지 고름 */
  (atk.act.tried = atk.act.tried || []).push(u.i);
  const mate = atk.side === u.side;   // 동료가 휘두르면 ("비켜!") 늘 앎
  if (!mate && !aware(W, u, atk)) return false;
  const canBlk = !mate && !atk.act.mode && inGuard(W, u, atk);
  if (chargeK && u.shield && canBlk) return false;   /* 방패로 돌격을 버팀 */
  if (canBlk && !stepK) return false;   // 막을 수 있으면 막음 (거구의 공격은 피하려 함)   // v7.17 스텝은 막기와 견줌 (막을 수 있으면 덜 비켜섬)
  const agi = Math.min(1.3, spdNow(W, u) / 3), rm = roomAt(W, u.x, u.y);
  let p = (D.p || 0.4) * agi * Math.min(1, rm.avg / 1.2) * (cornered(W, u) ? 0.6 : 1) * (mate ? 1.4 : 1);
  if (backToWall(W, u, atk)) p *= D.wall != null ? D.wall : 0.35;
  p *= fatMul(W, u, 'dodge');   // v6.6 지치면 덜 피함
  if (W.units.filter(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < f.rng + 0.5).length >= 3) p *= 0.5;
  if (stepK) p = (ST.p != null ? ST.p : 0.3) * agi * Math.pow(gradeMul(W.rules, u.traits, '회피'), 0.6) * (u.vet ? 1.15 : 1) * fatMul(W, u, 'dodge') * (backToWall(W, u, atk) ? 0.3 : 1);   /* v7.17 스텝: 공격 · 막기 · 비켜섬의 심리전 (늦으면 그래도 맞음) */
  if (stepK && canBlk) p *= 0.5;
  if (chargeK) p *= ST.chargeK || 1.6;   /* 돌격은 크게 보여서 비켜서기 쉬움 */
  if (W.rand() >= p) return false;
  const base = Math.atan2(u.y - atk.y, u.x - atk.x), st = stepK ? ST.dist || 0.85 : D.step || 0.6, sg = W.rand() < 0.5 ? 1 : -1;
  for (const da of chargeK ? [1.57, 1.3, 1.85] : stepK ? (W.rand() < 0.5 ? [1.3, -1.3, 0, 0.7, -0.7] : [0, 0.7, -0.7, 1.3, -1.3]) : [0, 0.7, -0.7, 1.3, -1.3]){
    const a = base + da * sg, x = u.x + Math.cos(a) * st, y = u.y + Math.sin(a) * st;
    if (boxRock(W, x, y, u.r * 0.9) || !fatClear(W.map, u.x, u.y, x, y, u.r * 0.8)) continue;
    if (W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r * 0.8)) continue;
    if (!stepK && !chargeK && !outOfSwing(W, atk, u, x, y)) continue;   /* v8.7.3 비켜서도 그 일격 안이면 비키지 않음 */
    u.act = { k: 'dodge', phase: 'run', t0: W.t, end: W.t + (stepK ? ST.time || 0.16 : D.time || 0.18), fx: u.x, fy: u.y, tx: x, ty: y, b: atk.i, step: stepK ? (Math.abs(da) > 1 ? 'side' : 'back') : null };
    if (stepK){ u.stepT = W.t; u.stepCd = W.t + (ST.cd || 3); }   /* 성공했을 때만 쿨 */
    u.dodgeCd = W.t + (D.cd || 1.6); stop(u); u.fg = Math.atan2(atk.y - u.y, atk.x - u.x); u.dodgedT = W.t; u.dodgeHold = { a: atk.i, until: atk.act.end + 0.1 };   // v7.13
    L(W, { k: 'dodge', a: u.i, b: atk.i, mate, wall: backToWall(W, u, atk), step: stepK ? (Math.abs(da) > 1 ? 'side' : 'back') : null, vis: u.side === 0 || !!u.seenBy || !!atk.seenBy });
    return true;
  }
  return false;
}
/* ---------- v6.7 회피 (확률): 아슬아슬하게 살짝 움직여 피함 — '회피!' ---------- */
// 회피 확률 = 기본 (근접 · 원거리) × 민첩 (속력 ÷ 3, 0.3 ~ 1.35)^1.3 × 몸집 ((62 ÷ 무게)^0.25, 0.8 ~ 1.2) × [회피X] × 지침 · 숨.
// v6.7.1 반사신경 · 센스: 못 알아챈 상대 (옆 · 뒤 · 어둠) 도 감으로 × sense. 넘어짐 · 날아감 · 휘청 · 거구 · 기어다님 · 실명 · 달리는 중 (돌진 · 도약 · 비켜서기 · 팜 버스트) 은 못 피함.
// 원거리는 탄이 느릴수록 (v0 ÷ 탄속)² — 투창 · 투척 · 화살은 피할 수 있고 총알은 거의 못 피함. 곡사는 위에서 떨어져 × arc. 준비 중 × busy
// v7.26.0 축복: 지닌 특성마다 공격 × atk · 회피 + ev
const blessOf = (R, tr) => (tr || []).reduce((o, t) => { const b = ((R || {}).bless || {})[t]; if (b){ o.atk *= b.atk || 1; o.ev += b.ev || 0; } return o; }, { atk: 1, ev: 0 });
function evadeP(W, u, a, kind, s){
  const E = W.rules.evade; if (!E || AI6.includes('evade') || !u.alive || u.giant || u.crawl || u.kb || u.blind || prone(W, u) || W.t < (u.stunT || -9) || W.t < (u.evadeCd || -9)) return 0;
  if (u.act && u.act.k === 'gwHop') return 1;   /* v8.7.8 굿윌: 도약하는 동안엔 피함 (2D — 이동 = 회피) */
  if (u.act && ['leap', 'dodge', 'palm'].includes(u.act.k)) return 0;
  if (u.act && u.act.k === 'charge' && u.act.phase === 'run') return 0;
  if (u.act && u.act.k === 'cz' && !['backs', 'rush', 'flank', 'step'].includes(u.act.s)) return 0;   /* v7.23.1 세자르: 기술을 쓰는 동안엔 못 피함 */
  const sense = a && !aware(W, u, a) ? (u.csense ? E.csense || 0.8 : E.sense != null ? E.sense : 0.35) : 1; if (!sense) return 0;   // v6.7.1   // v7.25.1 [전투센스] 못 본 쪽도 감
  const agi = Math.max(0.3, Math.min(1.35, u.spd * (u.spdMul || 1) * (W.t < u.pinT ? 0.4 : 1) / 3)), sz = Math.max(0.8, Math.min(1.2, Math.pow(62 / Math.max(25, u.mass || 62), 0.25)));
  let p = (kind === 'melee' ? E.melee : E.shot) * Math.pow(agi, 1.3) * sz * (u.ev || 1) * sense;
  if (kind === 'shot') p *= Math.min(1, Math.pow((E.v0 || 20) / Math.max(1, (s && s.sp) || 40), 2));
  if (kind === 'arc') p *= E.arc != null ? E.arc : 0.6;
  if (u.act && u.act.phase === 'wind') p *= E.busy != null ? E.busy : 0.75;
  if (kind === 'melee'){ if (a && backToWall(W, u, a)) p *= E.wall != null ? E.wall : 0.9; if (E.crowd != null && E.crowd < 1 && W.units.filter(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < f.rng + 0.5).length >= 3) p *= E.crowd; }   // v6.7.1 난투 · 중거리 (맞붙어 있어도) 에서도 그대로
  p *= fatMul(W, u, 'dodge'); if (u.winded) p *= 0.85;
  if (u.act && u.act.k === 'cz' && u.act.hop) p = Math.max(p, 0.5);   /* v7.23.1 뒷걸음 점프 중 */
  if (u.act && u.act.k === 'cz' && u.act.s === 'step') p = Math.max(p, ((W.rules.cz || {}).step || {}).ev || 0.6);   /* v7.24 스텝 중 */
  if (u.cz && (kind === 'shot' || kind === 'arc')) p = Math.max(p, ((W.rules.cz || {}).bulletEv || 0) * sense);   /* v7.25.0 세자르: 총알 · 화살을 거의 다 쉭쉭 피함 */
  if (u.blessEv) p += u.blessEv * sense;   /* v7.26.0 축복 */
  return Math.min(E.cap || 0.75, p);
}
// v6.7.1 노린 회피: 유저가 직접 움직인 (이동 · 공격 이동 · 서두르기 · 전열 · 줍기 · 돌진 · 도약 명령) 아군이 그 움직임으로 피함 — 확률 회피와 따로 셈
const manDodge = (W, u) => !!u && u.alive && u.side === 0 && !!u.order && ['move', 'amove', 'line', 'lret', 'scout', 'assn', 'flare', 'pick', 'charge', 'leap', 'attack', 'throw', 'palm'].includes(u.order.k) && (Math.hypot(u.vx || 0, u.vy || 0) > 0.6 || !!(u.act && u.act.k === 'leap'));
function manNote(W, t, a){ t.manN = (t.manN || 0) + 1; if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '피함!', c: 'g', t0: W.t }); }
function evaded(W, t, a, how, why, p){
  const E = W.rules.evade || {};
  t.evadeCd = W.t + (E.cd || 1.4) / Math.max(1, t.ev || 1) * (t.cz ? ((W.rules.cz || {}).evCd || 0.35) : 1);   /* v7.25.0 세자르는 연달아 비킴 */ t.evN = (t.evN || 0) + 1; if (a && how === 'melee') a.miss++;
  L(W, { k: 'evade', a: a ? a.i : null, b: t.i, how, why, p: +p.toFixed(2), vis: t.side === 0 || !!t.seenBy || (a && (a.side === 0 || !!a.seenBy)) });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '회피!', c: 'v', t0: W.t });
}
// 근접 회피: 맞는 순간 몸을 비틀어 흘림 (twist 칸 옆으로). 방패 · 대검 · [반사신경] 으로 막을 수 있으면 막음 (무구로 받아 내기는 회피를 먼저 해 봄)
function evadeMelee(W, t, a){
  if (!t.alive || t.side === a.side || (inGuard(W, t, a) && !(t.parry && !t.shield && !t.reflex))) return false;
  const p = evadeP(W, t, a, 'melee'); if (!p || W.rand() >= p) return false;
  const E = W.rules.evade || {}, base = Math.atan2(t.y - a.y, t.x - a.x), sg = W.rand() < 0.5 ? 1 : -1, tw = E.twist || 0.22;
  for (const s of [sg, -sg]){ const ang = base + s * Math.PI / 2, x = t.x + Math.cos(ang) * tw, y = t.y + Math.sin(ang) * tw;
    if (!boxRock(W, x, y, t.r * 0.9) && !W.units.some(o => o.alive && o !== t && Math.hypot(o.x - x, o.y - y) < o.r + t.r * 0.8)){ tryMove(W, t, x, y); break; } }
  evaded(W, t, a, 'melee', '몸을 비틀어 흘림', p);
  if (t.dcounter && !isFar(a) && !t.dcPend && W.rand() < t.dcounter) t.dcPend = { b: a.i, at: W.t + ((W.rules.dcounter || {}).delay || 0.12) };   /* v7.23.1 회피 반격 */
  grabTry(W, t, a, 'evade');   // v7.19.2 피하며 자루를 잡음
  return true;
}
// 원거리 회피: 날아오는 탄을 보고 실제로 비켜섬 (탄이 오는 줄의 옆으로 step 칸, 곡사는 떨어질 자리 밖으로). 탄은 그대로 날아가 뒤의 몸에 맞을 수 있음
function evadeShot(W, b, s){
  if (s.side === b.side || (s.ev && s.ev.includes(b.i))) return false;
  { const E = W.rules.evade || {}, tau = s.arc ? (s.el || s.T || 0) : Math.hypot(b.x - s.x0, b.y - s.y0) / Math.max(1, s.sp || 40), sh = W.units[s.a];   // v7.0 반응할 시간: 날아온 시간이 반응 시간보다 짧으면 못 피함 (총알은 사실상 못 피함 · 저격총급 화살도 가까이선 못 피함)
    const react = (E.react != null ? E.react : 0.18) * (b.reflex ? 0.6 : 1) * (b.ev && b.ev > 1.2 ? 0.75 : 1) * (sh && !aware(W, b, sh) ? 1.5 : 1);
    if (tau < react && !b.cz) return false; }   /* v7.25.0 세자르는 총구를 읽고 미리 비킴 */
  const a = W.units[s.a], p = evadeP(W, b, a, s.arc ? 'arc' : 'shot', s); if (!p || W.rand() >= p) return false;
  const E = W.rules.evade || {}, sg = W.rand() < 0.5 ? 1 : -1;
  let dirs;
  if (s.arc){ const d0 = Math.hypot(b.x - s.lx, b.y - s.ly), ax = d0 > 0.01 ? (b.x - s.lx) / d0 : Math.cos(W.rand() * 6.28), ay = d0 > 0.01 ? (b.y - s.ly) / d0 : Math.sin(W.rand() * 6.28), st = Math.max(E.step || 0.5, b.r + 0.12 - d0);
    dirs = [[ax, ay, st], [ax * 0.7 - ay * 0.7 * sg, ay * 0.7 + ax * 0.7 * sg, st]]; }
  else { const st = E.step || 0.5; dirs = [[-s.dy * sg, s.dx * sg, st], [s.dy * sg, -s.dx * sg, st]]; }
  for (const [dx, dy, st] of dirs){ const x = b.x + dx * st, y = b.y + dy * st;
    if (boxRock(W, x, y, b.r * 0.9) || !fatClear(W.map, b.x, b.y, x, y, b.r * 0.8) || W.units.some(o => o.alive && o !== b && Math.hypot(o.x - x, o.y - y) < o.r + b.r * 0.8)) continue;
    if (b.act && b.act.k !== 'charge') interrupt(W, b, '피하느라 준비가 끊김');
    b.burst = null; b.act = { k: 'dodge', phase: 'run', t0: W.t, end: W.t + (E.time || 0.15), fx: b.x, fy: b.y, tx: x, ty: y, b: a.i, ev: true }; stop(b);
    (s.ev = s.ev || []).push(b.i);
    evaded(W, b, a, s.arc ? 'arc' : 'shot', s.jav ? (s.kn ? '날아오는 단검을 보고 비켜섬' : '날아오는 창을 보고 비켜섬') : s.arc ? '떨어지는 화살을 보고 비켜섬' : '날아오는 탄을 보고 비켜섬', p);
    return true; }
  return false;
}
// 돌진 회피: 들이닥치는 순간 옆으로 비켜섬 (근접 회피 × evade.charge) — 돌진은 그 상대를 지나쳐 멈춤 (헛돌진)
function evadeCharge(W, t, a, A){
  const E = W.rules.evade || {}, p = evadeP(W, t, a, 'melee') * (E.charge != null ? E.charge : 0.8); if (!p || W.rand() >= p) return false;
  const st = (E.step || 0.5) + 0.1, sg = W.rand() < 0.5 ? 1 : -1;
  for (const s of [sg, -sg]){ const x = t.x - A.dy * s * st, y = t.y + A.dx * s * st;
    if (boxRock(W, x, y, t.r * 0.9) || !fatClear(W.map, t.x, t.y, x, y, t.r * 0.8) || W.units.some(o => o.alive && o !== t && o !== a && Math.hypot(o.x - x, o.y - y) < o.r + t.r * 0.8)) continue;
    if (t.act && t.act.k !== 'charge') interrupt(W, t, '피하느라 준비가 끊김');
    t.burst = null; t.act = { k: 'dodge', phase: 'run', t0: W.t, end: W.t + (E.time || 0.15), fx: t.x, fy: t.y, tx: x, ty: y, b: a.i, ev: true }; stop(t);
    (A.ev = A.ev || []).push(t.i); evaded(W, t, a, 'charge', '들이닥치는 몸을 옆으로 흘림', p); return true; }
  return false;
}
/* ---------- v6.7 [발화X] 화상 · [팜 버스트] (청광묵) ---------- */
// 화상: 손바닥이 닿으면 초당 dps × [발화] 등급 · t 초 (겹치면 max 까지, 다시 닿으면 시간이 새로). 갑옷 위로는 × armor
function burnOn(W, t, by, stacks, armored){
  const B = W.rules.burn || {}; if (!t.alive || !by.fire || AI6.includes('burn')) return;
  const was = t.burn && W.t < t.burn.until ? t.burn : null, add = (B.dps || 3) * by.fire * stacks * (armored ? (B.armor != null ? B.armor : 0.6) : 1) * (t.fireRes > 0 ? t.fireRes : 1);   /* v8.7.7 불에 강함 (fireRes) */
  t.burn = { dps: Math.min((B.max || 9) * by.fire * (t.fireRes > 0 ? t.fireRes : 1), (was ? was.dps : 0) + add), until: W.t + (B.t || 3), by: by.i };
  if (!was) L(W, { k: 'burn', a: by.i, b: t.i, dps: +t.burn.dps.toFixed(1), vis: t.side === 0 || by.side === 0 || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.35, s: '🔥', c: 'd', t0: W.t });
}
function stepBurn(W, u, dt){
  const b = u.burn; if (!b) return;
  if (W.t >= b.until){ u.burn = null; L(W, { k: 'burnStop', a: u.i, vis: u.side === 0 || !!u.seenBy }); return; }
  const d = b.dps * dt; u.burned = (u.burned || 0) + d;
  if (u.hp - d < 0.5){ const by = W.units[b.by] || u; u.burn = null; applyDmg(W, by, u, Math.max(1, Math.ceil(u.hp)), { ff: by !== u && by.side === u.side, far: false, part: null, tag: '화상' }); return; }
  u.hp -= d;
}
const PALM = W => W.rules.palm || { wind: 0.25, rec: 0.45, cd: 5, reach: 0.35, kb: 1, kbExp: 0.6, skin: [1, 0.55, 0.55, 0.3, 0.3, 0.3], skinMul: 1.5, armMul: 0.55, armIgn: 0.5, post: 40, burnSkin: 2, burnArm: 1, recoil: 0.45, guard: 0.35 };
const palmReady = (W, u) => !!u.palm && u.alive && !u.noArms && W.t >= u.palmCd && W.t >= u.brokenT && !AI6.includes('palm');
// v6.7.2 스스로 팜 버스트를 쓰는 '필요한 순간' (그 밖엔 단검으로 싸우고, 언제 쓸지는 플레이어의 명령 — 기술 칸 5):
// ① 등 뒤가 벽 (날려 보내면 짓눌림) ② 막고 선 방패 · 무구에 1초 넘게 막힘 (방패째 터뜨려 자세를 무너뜨림) ③ 다쳐서 (40% 아래) 치려는 놈을 밀쳐 내고 빠짐
// ④ 쓰러지거나 많이 다친 동료를 치려는 놈을 떼어 냄 ⑤ 손 닿는 적이 둘 이상 (틈을 만듦)
function palmNeed(W, u, t){
  const d = dist(u, t) || 1, dx = (t.x - u.x) / d, dy = (t.y - u.y) / d, P = PALM(W);
  const kb = (P.kb || 1) * Math.max(0.25, Math.min(1.4, Math.pow(80 / Math.max(30, t.mass || 62), P.kbExp || 0.6)));
  if (!inGuard(W, t, u) && wallBehind(W, t, dx, dy, t.r + Math.max(0.3, kb))) return '벽으로 날려 보냄';
  if (inGuard(W, t, u) && (u.waitT || 0) > 1) return '방패째 터뜨림';
  if (u.hp / u.max < 0.4 && t.act && t.act.k === 'atk' && t.act.b === u.i && t.act.phase === 'wind') return '밀쳐 내고 빠짐';
  const v = t.act && t.act.phase === 'wind' && t.act.b != null ? W.units[t.act.b] : null;
  if (v && v !== u && v.side === u.side && v.alive && (prone(W, v) || v.hp / v.max < 0.35)) return v.name + '에게서 떼어 냄';
  if (W.units.filter(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) <= Math.max(u.rng, 0.35) + 0.1).length >= 2) return '둘러싸여 틈을 만듦';
  return null;
}
/* ---------- v7.19.2 역장 · 뿌리 벽 · 열매 · 무기 잡기 ---------- */
// 역장: 상대 탄이 둘레 밖에서 안으로 들어오면 (곡사는 안에 떨어지면) 막음 — 투창 · 총알 · 센 탄은 pierce 확률로 뚫음
function wardStop(W, s, x0, y0, x1, y1, arc){
  for (const w of W.wards){ if (w.side === s.side || w.left <= 0 || W.t >= w.until) continue; const c = W.units[w.by]; if (!c || !c.alive) continue;
    const d1 = Math.hypot(x1 - c.x, y1 - c.y), d0 = Math.hypot(x0 - c.x, y0 - c.y); if (d1 > w.r || (!arc && d0 <= w.r)) continue;
    if ((s.jav || s.gun || (s.mul || 1) >= 1.5) && W.rand() < (SPR(W, 'ward').pierce != null ? SPR(W, 'ward').pierce : 0.4)){ (s.ev || (s.ev = [])); L(W, { k: 'wardPierce', a: s.a, b: w.by, vis: true }); w.left--; continue; }
    w.left--; s.done = true; if (!arc){ s.x = x0; s.y = y0; } const u = W.units[s.a]; if (u && !s.supp) u.miss++;
    L(W, { k: 'miss', a: s.a, b: s.meant, why: '역장에 막힘', fired: true, p: s.p, ward: w.by }); if (W.fxOn) W.fx.push({ k: 'num', x: x1, y: y1, s: '역장!', c: 'b', t0: W.t });
    if (s.jav) dropSpear(W, s, x0, y0, 'bounce');
    return true; }
  return false;
}
// 매 프레임: 역장 끝 · 뿌리 벽 뜯김 · 열매 맺기 · 먹기
function stepFlora(W, dt){
  if (W.wards && W.wards.length) W.wards = W.wards.filter(w => W.t < w.until && w.left > 0 && W.units[w.by] && W.units[w.by].alive);
  if (W.roots && W.roots.length){ const S = SPR(W, 'root');
    for (const r of W.roots){ for (const e of W.units){ if (!e.alive || e.side === r.side || isFar(e) || e.act || e.kb) continue; if (!r.cells.some(c => Math.hypot(e.x - c[0] - 0.5, e.y - c[1] - 0.5) < 0.62 + e.r)) continue;
        if (W.units.some(f => f.alive && f.side !== e.side && gap(e, f) <= e.rng + 0.2)) continue; r.hp -= e.atk * (e.atkMul || 1) * (S.chew != null ? S.chew : 0.4) * dt; if (W.t - (e.chewT || -9) > 2){ e.chewT = W.t; L(W, { k: 'rootChew', a: e.i, r: r.id, hp: Math.round(r.hp), vis: e.side === 0 || !!e.seenBy }); } }
      if (r.hp <= 0){ for (const [cx, cy] of r.cells) if (W.map.t[cy * W.map.W + cx] === 3) W.map.t[cy * W.map.W + cx] = 0; r.gone = true; W.lightT = 0; L(W, { k: 'rootBreak', a: r.by, r: r.id, vis: true }); } }
    W.roots = W.roots.filter(r => !r.gone); }
  const B = W.rules.berry || {};
  for (const u of W.units){ if (!u.berry || !u.alive || W.t < u.berryT) continue; u.berryT = W.t + (B.gap || 20);
    if ((W.items || []).filter(it => it.k === 'berry' && it.owner === u.i).length >= (B.max || 3)) continue;
    for (let k = 0; k < 8; k++){ const a = W.rand() * 6.283, rr = 0.6 + W.rand() * ((B.r || 1.4) - 0.6), x = u.x + Math.cos(a) * rr, y = u.y + Math.sin(a) * rr; if (rock(W.map, x, y)) continue;
      const H = B.heal || [5, 10], it = { id: (W.itemN = (W.itemN || 0) + 1), k: 'berry', name: '딸기 열매', x: +x.toFixed(2), y: +y.toFixed(2), owner: u.i, t: W.t, how: 'berry', heal: Math.round(H[0] + W.rand() * (H[1] - H[0])) };
      W.items.push(it); L(W, { k: 'berrySpawn', a: u.i, x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy }); break; } }
  if (W.items && W.items.some(it => it.k === 'berry')) for (const it of W.items){ if (it.k !== 'berry' || it.eaten) continue; const o = W.units[it.owner];
    const e = W.units.find(a => a.alive && !a.down && o && a.side === o.side && a.hp < a.max - 1 && Math.hypot(a.x - it.x, a.y - it.y) < a.r + 0.25); if (!e) continue;
    const amt = Math.min(it.heal, Math.round(e.max - e.hp)); e.hp += amt; it.eaten = true; L(W, { k: 'berry', a: e.i, by: it.owner, amt, hp: Math.round(e.hp), vis: e.side === 0 || !!e.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y, s: '+' + amt, c: 'h', t0: W.t }); }
  if (W.items && W.items.some(it => it.eaten)) W.items = W.items.filter(it => !it.eaten);
}
// 무기 잡기 (공통): 막거나 피했을 때 — 상대의 창 · 철퇴 자루를 잡아 뺏어 곁 바닥에 떨굼 (근접 솜씨: 회피 등급 · 베테랑). 노리스크 (실패해도 아무 일 없음)
function grabTry(W, t, a, how){
  const G = W.rules.grab || {}; if (!t.alive || !a.alive || t.side === a.side || isFar(t) || t.noArms || (t.arms && t.arms.L && t.arms.R) || a.weaponGone || isFar(a) || !(G.list || []).includes(a.weaponNow || a.weapon) || (a.jav && !a.spearHeld)) return false;
  if (W.t < (t.grabT || -9)) return false; t.grabT = W.t + (G.cd || 2.5);
  const p = Math.min(G.cap || 0.15, (G.p || 0.05) * (t.ev || 1) * (t.vet ? G.vet || 1.3 : 1)); if (W.rand() >= p) return false;
  if (mightReady(W, a) && (a.might || 1) * (a.strMul || 1) * Math.pow((a.mass || 62) / Math.max(20, t.mass || 62), 0.15) >= (t.strMul || 1)){ mightUse(W, a, 'grip', t); return false; }   /* v7.24.2 괴력: 잡힌 무기를 순간 뿌리침 (몸무게 · 근력 차이는 그대로 — 거구에겐 안 됨) */
  const wn = a.weapon, it = dropItem(W, a, 'weapon', wn, heldItem(a), 'grab'); it.x = +(t.x + (W.rand() - 0.5) * 0.9).toFixed(2); it.y = +(t.y + (W.rand() - 0.5) * 0.9).toFixed(2);
  a.weaponGone = true; a.weaponNow = '맨손'; a.rng = ((W.rules.weapons || {})['맨손'] || { rng: 0.3 }).rng + (a.reachX || 0); a.longReach = a.rng > 1; a.parry = false; if (!a.shield && !a.reflex) a.canGuard = false; if (a.jav) a.spearHeld = false;
  L(W, { k: 'grab', a: t.i, b: a.i, w: wn, how, vis: t.side === 0 || a.side === 0 || !!t.seenBy || !!a.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: a.x, y: a.y, s: '무기를 뺏김!', c: 'd', t0: W.t });
  return true;
}
/* ---------- v7.21 캠페인: 맵 끝으로 나감 — 위 · 아래 끝 띠 (camp.band 칸) 에 닿으면 맵에서 빠짐 (다른 맵으로 · 적은 쫓아오지 않음) ---------- */
function exitStep(W, u, o, dt){
  const m = W.map, H = m.H, band = (W.rules.camp || {}).band || 0.9, dn = o.dir === 'down', row = dn ? H - 1 : 0;
  if (dn && W.entry){ const E0 = W.entry; if (Math.hypot(E0.x - u.x, E0.y - u.y) <= (E0.r || 1.2)){ leaveMap(W, u, 'down'); return; } setMood(W, u, '물러남'); goTo(W, u, E0.x, E0.y, dt); return; }   /* v8.0.0 여정: 들어온 자리로 물러남 */
  if (!dn && W.stairs && W.exitHide && !W.exitSeen){ exitSearch(W, u, o, dt); return; }   /* v8.7.3 아직 못 찾은 출구 — 찾으러 */
  if (!dn && W.stairs && W.exitLock && !W.cleared){ const S0 = W.stairs; setMood(W, u, '출구 — 적이 남아 있음'); if (Math.hypot(S0.x - u.x, S0.y - u.y) > 1.6) goTo(W, u, S0.x, S0.y, dt); else { u.vx = 0; u.vy = 0; } return; }   /* v8.0.0 여정: 맵을 끝내야 열림 */
  if (!dn && W.stairs){ const S0 = W.stairs, d0 = Math.hypot(S0.x - u.x, S0.y - u.y);
    if (d0 <= 2.2 && exitWait(W, u)){ stop(u); u.fg = Math.atan2(u.y - S0.y, u.x - S0.x); setMood(W, u, '출구 앞 — 동료를 기다림'); return; }   /* v8.7.3 대장은 마지막에 나감 */
    if (d0 <= (S0.r || 0.9)){ leaveMap(W, u, 'up'); return; } setMood(W, u, o.hurry ? '출구로 — 서둘러' : '계단으로'); goTo(W, u, S0.x, S0.y, dt); return; }   /* v7.23.1 무덤의 계단 */
  if (dn ? u.y + u.r >= H - band : u.y - u.r <= band){ leaveMap(W, u, dn ? 'down' : 'up'); return; }
  if (o.tx == null){ const x0 = Math.floor(o.x != null ? o.x : u.x); let bx = null;   // 끝 줄의 가장 가까운 빈 칸
    for (let d = 0; d < m.W && bx == null; d++) for (const x of [x0 - d, x0 + d]) if (x >= 0 && x < m.W && m.t[row * m.W + x] === 0){ bx = x; break; }
    o.tx = (bx != null ? bx : x0) + 0.5; }
  setMood(W, u, dn ? '아래 맵으로' : '위 맵으로'); goTo(W, u, o.tx, row + 0.5, dt);
}
// v8.7.3 출구를 아직 못 찾음: 대장 (출구 명령을 받았으면) 을 중심으로 안 가 본 곳으로 함께 — 누가 출구를 보면 그때부터 곧장
function exitSearch(W, u, o, dt){
  const A = chiefOf(W), lead = A && A !== u && A.order && A.order.k === 'exit' && !A.down ? A : null;   /* v8.7.5 대장 */
  let Q = W.exitQ; const m = W.map;
  if (!Q || (W.found && W.found[(Q.y | 0) * m.W + (Q.x | 0)]) || W.t - Q.t > 10 || (Q.by !== (lead || u).i && !lead && Math.hypot(Q.x - u.x, Q.y - u.y) > 16)){ const f = frontier(W, lead || u); Q = W.exitQ = f ? { x: f.x, y: f.y, t: W.t, by: (lead || u).i } : null; }
  if (!u.exQlog){ u.exQlog = true; if (isChief(W, u) || !lead) L(W, { k: 'exitSearch', a: u.i, vis: true }); }
  setMood(W, u, o.hurry ? '출구 찾기 — 서둘러' : '출구 찾기');
  if (!Q){ if (!W.exitSeen){ W.exitForce = true; exitSeenTick(W); } stop(u); return; }   // 다 뒤졌는데 못 봄 (그림 속 벽 출구) — 거기 있음을 앎
  if (lead && dist(u, lead) > 2.6){ goTo(W, u, lead.x, lead.y, dt); return; }   // 대장 곁을 지키며 함께 뒤짐
  goTo(W, u, Q.x, Q.y, dt);
}
// v8.7.3 대장은 마지막에 나감: 출구 명령을 받고 오는 동료가 있으면 출구 곁에서 기다림 (최대 10초 — 남은 이는 대장이 나갈 때 따라 나섬)
function exitWait(W, u){
  if (!isChief(W, u) || W.over) return false;   /* v8.7.5 대장 */
  const rest = W.units.filter(a => a !== u && a.alive && a.side === 0 && !a.gone && !a.summon && !a.down && !a.crawl && a.order && a.order.k === 'exit' && a.order.dir !== 'down');
  if (!rest.length){ u.exWaitT0 = null; return false; }
  if (u.exWaitT0 == null){ u.exWaitT0 = W.t; L(W, { k: 'exitWait', a: u.i, n: rest.map(a => a.i), vis: true }); }
  return W.t - u.exWaitT0 < 10;
}
function leaveMap(W, u, dir){
  const wasAnc = u.side === 0 && chiefOf(W) === u;   /* v8.7.3 · v8.7.5 대장 (대형의 기준과 따로) */
  u.gone = dir; u.alive = false; u.order = null; u.ordPend = null; u.ordQ = null; u.act = null; u.path = null; u.vx = 0; u.vy = 0; u.posUnk = false; u.leftT = W.t;
  L(W, { k: 'leave', a: u.i, dir, vis: true }); W.lightT = 0; W.ancT = null; W.chfT = null;
  cmdHand(W, u);   /* v8.7.3 지휘관이 먼저 나가면 바로 이어받음 */
  if (wasAnc) W.ancLeft = { i: u.i, dir, t: W.t };
  if (W.camp && (u.hero || wasAnc) && u.side === 0 && ((W.rules.camp || {}).follow !== false)){   /* v8.7.3 주인공이 없으면 대장 (지휘관) */   /* v7.26.1 대장이 넘어가면 남은 동료도 같은 길로 (제자리 명령 · 쓰러진 이는 그대로) */
    const F = W.units.filter(a => a.alive && a.side === 0 && !a.down && !(a.order && (a.order.k === 'hold' || a.order.k === 'exit')));
    for (const a of F){ a.order = { k: 'exit', dir, x: a.x, follow: true }; a.ordLive = a.order; a.ordPend = null; a.ordQ = null; a.ordT0 = W.t; a.stay = null; }
    if (F.length) L(W, { k: 'followOut', a: u.i, dir, n: F.map(a => a.i), vis: true }); }
}
/* ---------- v7.20 소지품 (가방) · 내구도 — 적 · 아군 같은 규칙 ---------- */
// 물건: { k: 'weapon' · 'shield' · 'armor' · 'helm' · 'ammo', name (무기표 이름 · 갑옷은 보이는 이름), label (보이는 이름), dur (0 ~ 100), own (원래 주인), ammo · mag (총 · 활), mat · tier · size (갑옷), at · n (탄) }
const INV = W => W.rules.inv || {};
const ownKey = u => u.ref || ('#' + String(u.name || '').replace(/\s*\d+$/, ''));
const lootName = (u, k, name) => { const nm = String(u.name || '').replace(/\s*\d+$/, ''); return k === 'shield' ? (u.sName || nm + '의 방패') : k === 'weapon' && u.wName && u.weapon === name ? u.wName : / ?의 /.test(name) ? name : nm + '의 ' + name; };
const heldItem = u => ({ k: 'weapon', name: u.weapon, label: u.wName || '', dur: u.wDur != null ? u.wDur : 100, own: u.wOwn || ownKey(u), ...(u.ammo != null ? { ammo: u.ammo, mag: u.mag } : {}) });
const bagCapOf = (W, u) => u.bagCap || (INV(W).cap || {})[sizeOf(u)] || 8;
const ammoTOf = (W, name) => { const wp = (W.rules.weapons || {})[name] || {}; return wp.kind === '활' ? '화살' : wp.kind === '총포류' ? ((INV(W).special || ['저격총', '샷건']).includes(name) ? '특수' : '일반') : null; };
const wTwo = (W, name) => (((W && W.rules.weapons) || {})[name] || {}).two ? 2 : 1;   /* v8.7.6 J10 두 손 무기 (대검 · 대장군의 도끼) 는 무기 칸 둘 */
const bagWpnN = (u, W) => (u.bag || []).filter(x => x.k === 'weapon').reduce((s, x) => s + wTwo(W, x.name), 0) + (u.weapon && !ITEM_NATURAL.includes(u.weapon) && !u.weaponGone ? wTwo(W, u.weapon) : 0);
// 가방에 넣기 (자리가 없거나 · 무기 칸 한도 (카리우스 4) 를 넘으면 발밑에)
function stowOrDrop(W, u, it){
  const full = !u.bag || u.bag.length >= bagCapOf(W, u) || (it.k === 'weapon' && u.eqRule && u.eqRule.wmax && bagWpnN(u, W) + wTwo(W, it.name) > u.eqRule.wmax);
  if (full){ dropItem(W, u, it.k, it.name, it, 'swap'); return false; }
  u.bag.push({ ...it, uid: (W.bagN = (W.bagN || 10000) + 1) }); L(W, { k: 'stow', a: u.i, w: it.label || it.name, vis: u.side === 0 || !!u.seenBy }); return true;
}
// 든 무기에 그 물건의 이름 · 내구도 · 주인을 입힘 (남의 무기면 살짝 서툶)
function armWith(W, u, it){ u.wName = it.label || ''; u.wDur = it.dur != null ? +it.dur : 100; u.wOwn = it.own || null; u.wForeign = !!it.own && it.own !== ownKey(u); }
// 싸우는 중 들 수 있나: 집어 들 수 있는 무기 (팔 · 체급 · 원거리 금지 · 두 손) 이고 부러지지 않았음
function canHold(W, u, it){
  if (!it || !u.alive || u.noArms) return false;
  if (it.k === 'shield') return (it.dur == null || it.dur > 0) && canTake(W, u, { k: 'shield' });
  if (it.k !== 'weapon') return false;
  const wp = (W.rules.weapons || {})[it.name]; if (!wp || (it.dur != null && it.dur <= 0 && !isRangedW(wp))) return false;
  return canTake(W, u, { k: 'weapon', name: it.name });
}
// 가방에서 고를 무기: 근접 (내구도 높은 것) > 탄이 있는 원거리
function bagPick(W, u){
  let best = null, bs = -1;
  for (const it of u.bag || []){ if (it.k !== 'weapon' || !canHold(W, u, it)) continue; const wp = (W.rules.weapons || {})[it.name] || {}, far = isRangedW(wp);
    const am = far ? (it.ammo || 0) + (u.bag || []).filter(x => x.k === 'ammo' && x.at === ammoTOf(W, it.name)).reduce((a, x) => a + (x.n || 0), 0) : 1;
    if (far && am <= 0) continue; const sc = (far ? 1 : 2) + (it.dur != null ? it.dur : 100) / 1000; if (sc > bs){ bs = sc; best = it; } }
  return best;
}
function startSwap(W, u, it, why){
  const wq = (W.rules.weapons || {})[it.name] || {}, sh = it.k === 'weapon' && !u.shield && !wq.two && !isRangedW(wq) ? (u.bag || []).find(x => x.k === 'shield' && (x.dur == null || x.dur > 0) && !(u.arms && u.arms.L)) : null;   // 새로 들 무기가 한 손 근접이면 방패도
  u.act = { k: 'bagSwap', phase: 'wind', t0: W.t, end: W.t + (INV(W).swap || 0.8) + (sh ? INV(W).swapSh || 0.5 : 0), it, sh, why: why || '' };
  stop(u); setMood(W, u, (it.label || it.name) + ' 꺼냄'); return true;
}
// v7.22.1 회복약을 다 마심: 가방에서 빠지고 최대 체력 × heal (min ~ cap) 만큼 (최대 체력까지)
function resolveDrink(W, u){
  const A = u.act, it = A.it; u.act = null; if (!u.alive || !u.bag) return; const k = u.bag.indexOf(it); if (k < 0) return;
  u.bag.splice(k, 1); const P = it.heal != null ? { heal: it.heal, min: it.min != null ? it.min : 0, cap: it.cap != null ? it.cap : 999 } : W.rules.potion || {}, amt = Math.round(Math.max(P.min != null ? P.min : 20, Math.min(P.cap != null ? P.cap : 80, u.max * (P.heal != null ? P.heal : 0.3)))), real = Math.max(0, Math.min(amt, u.max - u.hp));
  u.hp += real; L(W, { k: 'drink', a: u.i, w: it.label || it.name, amt: Math.round(real), hp: Math.round(u.hp), vis: u.side === 0 || !!u.seenBy });
}
function resolveSwap(W, u){
  const A = u.act, it = A.it; u.act = null; if (!u.alive || !u.bag) return;
  if (it.k === 'shield'){ if (!u.bag.includes(it) || !canHold(W, u, it)) return; u.bag.splice(u.bag.indexOf(it), 1); takeItem(W, u, { ...it, owner: u.i }); L(W, { k: 'bagSwap', a: u.i, w: it.label || '방패', why: A.why, vis: u.side === 0 || !!u.seenBy }); return; }
  if (!u.bag.includes(it) || !canHold(W, u, it)) return;
  u.bag.splice(u.bag.indexOf(it), 1);
  const old = !u.weaponGone && u.weapon && !ITEM_NATURAL.includes(u.weapon) && !(u.jav && !u.spearHeld) ? heldItem(u) : null;
  if (old){ if (u.bag.length < bagCapOf(W, u)) u.bag.push({ ...old, uid: (W.bagN = (W.bagN || 10000) + 1) }); else dropItem(W, u, 'weapon', old.name, old, 'swap'); }
  const far = isRangedW((W.rules.weapons || {})[it.name] || {});
  setWeapon(W, u, it.name, far ? { ammo: it.ammo || 0, mag: it.mag } : it); armWith(W, u, it);
  if (far && !u.ammo) pullAmmo(W, u);
  if (A.sh && u.bag.includes(A.sh) && canHold(W, u, A.sh)){ u.bag.splice(u.bag.indexOf(A.sh), 1); takeItem(W, u, { ...A.sh, owner: u.i }); }
  L(W, { k: 'bagSwap', a: u.i, w: it.label || it.name, from: old ? (old.label || old.name) : null, sh: A.sh ? (A.sh.label || '방패') : null, why: A.why, vis: u.side === 0 || !!u.seenBy });
}
// 가방의 같은 종류 탄을 든 무기에 채움 (든 무기의 기본 탄 수까지)
function pullAmmo(W, u, quiet){   /* v8.7.3 빈 만큼만 (화살통 · 탄창을 가득) · quiet = 맵 시작 (기록 없이) */
  const at = ammoTOf(W, u.weapon); if (!at) return 0; const wp = (W.rules.weapons || {})[u.weapon] || {}, cap = Math.max(1, u.ammoMax || wp.ammo || (INV(W).stack || {})[at] || 20), need = Math.max(0, cap - (u.ammo || 0)); let got = 0; if (!need) return 0;
  for (const it of (u.bag || []).filter(x => x.k === 'ammo' && x.at === at)){ const n = Math.min(it.n || 0, need - got); it.n -= n; got += n; if (got >= need) break; }
  u.bag = u.bag.filter(x => !(x.k === 'ammo' && !(x.n > 0)));
  if (!got) return 0;
  const mx0 = u.ammoMax; setWeapon(W, u, u.weapon, { ammo: (u.ammo || 0) + got }); if (mx0 != null) u.ammoMax = Math.max(mx0, u.ammo || 0); if (u.magMax) u.mag = Math.min(u.magMax, u.ammo);   /* v8.7.3 크기는 그대로 */
  if (quiet) return got;
  L(W, { k: 'bagAmmo', a: u.i, at, n: got, left: (u.bag || []).filter(x => x.k === 'ammo' && x.at === at).reduce((a, x) => a + x.n, 0), vis: u.side === 0 || !!u.seenBy });
  return got;
}
function resolveBagAmmo(W, u){ u.act = null; if (u.alive && !u.weaponGone) pullAmmo(W, u); }
// 자동 (적 · 아군): 탄이 다 떨어졌으면 가방 탄 → 없으면 가방 무기 / 무기를 잃었으면 (부러짐 · 뺏김) 가방 무기
function invAuto(W, u){
  if (!u.bag || !u.bag.length || u.act || u.noArms || u.down || u.crawl || u.kb) return false;
  const dry = u.ammoMax != null && u.ammo === 0 && !u.weaponGone;
  const low = !dry && u.ammoMax != null && !u.weaponGone && u.ammo != null && u.ammo < u.ammoMax * ((INV(W).lowAmmo != null ? INV(W).lowAmmo : 0.2)) && !W.units.some(f => f.alive && f.side !== u.side && !f.down && (dist(f, u) < 4.5 || (f.act && f.act.b === u.i && f.act.phase === 'wind')));   /* v8.7.3 20% 아래 · 곁에 적이 없으면 미리 채움 */
  if (dry || low){ const at = ammoTOf(W, u.weapon); if (at && u.bag.some(x => x.k === 'ammo' && x.at === at && x.n > 0)){ u.act = { k: 'bagAmmo', phase: 'wind', t0: W.t, end: W.t + (INV(W).ammoT || 1.2), why: '가방에서 탄을 꺼냄' }; stop(u); setMood(W, u, '탄 꺼냄'); return true; } }
  if (dry || u.weaponGone){ const it = bagPick(W, u); if (it) return startSwap(W, u, it, dry ? '탄이 떨어짐' : '무기를 잃음'); }
  return false;
}
// v7.25.1 두 번째 무기 (alt): 늘 지니는 다른 총 — 바꿔 들면 지금 무기 (와 남은 탄) 와 자리를 바꿈. 총끼리는 빠름 (quick 초)
function startAlt(W, u, why){
  if (!u.alt || !u.alive || u.noArms || u.weaponGone || u.down || u.crawl || u.kb) return false;
  u.act = { k: 'altSwap', phase: 'wind', t0: W.t, end: W.t + (INV(W).quick || 0.35), why: why || '' }; setMood(W, u, u.alt.name + '으로 바꿔 듦'); return true;
}
function resolveAlt(W, u){
  const A = u.act; u.act = null; if (!u.alive || !u.alt || u.weaponGone) return;
  const cur = { name: u.weapon, ammo: u.ammo, mag: u.mag, ammoMax: u.ammoMax }, nx = u.alt; setWeapon(W, u, nx.name, { ammo: nx.ammo, mag: nx.mag }); if (nx.ammoMax != null && u.ammoMax != null) u.ammoMax = Math.max(nx.ammoMax, u.ammo || 0); u.alt = cur; u.altFarT = null;   /* v8.7.3 바꿔 들어도 총마다 탄 크기는 그대로 */
  L(W, { k: 'altSwap', a: u.i, w: nx.name, from: cur.name, n: u.ammo, why: A.why, vis: u.side === 0 || !!u.seenBy });
}
// 자동: 근접 상대가 altIn 칸 안 (나를 노리거나 코앞) 이면 가까운 총 (샷건) 으로 · altOut 칸 안에 아무도 없이 altCalm 초면 (또는 탄이 떨어지면) 원래 총으로
// v7.26.1 지근거리: 보이는 적 (근접 · 사수 모두) 이 altIn 칸 안 · 나를 노리거나 덮쳐 오면 altWatch 칸 안 → 바로 바꿔 듦. 겨누는 중 · 재장전 중 (busy) 에도 끊고 바꿈
function altAuto(W, u, busy){
  if (!u.alt || u.weaponGone || u.down || u.crawl || u.kb || u.lie || (u.order && (u.order.k === 'alt' || u.order.k === 'swap'))) return false;
  if (u.act && !(busy && (u.act.k === 'reload' || (u.act.k === 'atk' && u.act.phase === 'wind' && isFar(u))))) return false;
  const I = INV(W), nearW = n => !!((W.rules.weapons || {})[n] || {}).near, holdNear = nearW(u.weapon), altNear = nearW(u.alt.name);
  const seen = W.units.filter(f => f.alive && !f.down && f.side !== u.side && canSee(W, u, f));
  if (!holdNear && altNear && (u.alt.ammo == null || u.alt.ammo > 0)){ const f = seen.filter(f => gap(u, f) < (I.altIn || 2.6) || (gap(u, f) < (I.altWatch || 3.4) && (f.target === u || (f.act && f.act.b === u.i)))).sort((a, b) => gap(u, a) - gap(u, b))[0];
    if (!f) u.altNearT = null; else if (gap(u, f) >= 1.2 && (u.altNearT == null ? (u.altNearT = W.t, true) : W.t - u.altNearT < (I.altDwell || 1))){ /* v8.7.3 1초 머물면 */ } else { u.altNearT = null; if (u.act){ u.act = null; u.burst = null; } return startAlt(W, u, f.name + (gap(u, f) < 1.2 ? '이(가) 붙음' : '이(가) 다가옴')); } }
  if (busy || u.act) return false;
  if (holdNear && !altNear){ if (u.ammo === 0) return startAlt(W, u, '산탄이 떨어짐'); const any = seen.some(f => gap(u, f) < (I.altOut || 4.2));
    if (any) u.altFarT = null; else { if (u.altFarT == null) u.altFarT = W.t; if (W.t - u.altFarT >= (I.altCalm || 1.5)) return startAlt(W, u, '근접이 멀어짐'); } }
  return false;
}
// 명령: { k: 'swap', uid } — 가방의 그 무기 · 방패를 꺼내 듦 (명령은 닿아야 함)
function invOrder(W, u, o){
  u.order = null; const it = (u.bag || []).find(x => x.uid === o.uid);
  if (it && it.k === 'potion'){ if (u.act && u.act.phase === 'wind' && u.act.k !== 'charge') u.act = null; if (!u.act){ u.act = { k: 'drink', phase: 'wind', t0: W.t, end: W.t + ((W.rules.potion || {}).drink || 1), it }; stop(u); setMood(W, u, (it.label || it.name) + ' 마시는 중'); } return; }   // v7.22.1 회복약
  if (!it || !canHold(W, u, it)){ L(W, { k: 'miss', a: u.i, why: it ? (it.label || it.name) + (jongE(it.label || it.name) ? '을' : '를') + ' 들 수 없음' : '가방에 없음', vis: u.side === 0 }); return; }
  if (u.act && u.act.phase === 'wind' && u.act.k !== 'charge') u.act = null;
  if (!u.act) startSwap(W, u, it, '명령');
}
/* ---------- v8.7.6 싸우는 중 장비 (D2 · I24) — 가방의 갑옷 · 투구 입기 · 벗기 (방패도) · 건네기 · 내려놓기 ----------
   명령 { k: 'inv', op: 'wear' | 'off' | 'give' | 'drop', uid (가방 물건), slot ('몸' · '머리' · 'shield'), to (받을 동료) } — 지휘망으로 감 (늦게 · 못 들음).
   입고 벗는 동안 (투구 gearT.helm · 갑옷 gearT.armor · 방패 swapSh 초) 은 아무것도 못 하고, 휘청이면 끊김 (아무것도 바뀌지 않음). 건네기는 giveR 칸 안으로 다가가 giveT 초.
   싸우는 중에 땅에 내려놓는 건 무기 · 방패만 (D1 — 갑옷 · 투구는 가방에 둠). 무기 칸은 두 손 무기가 둘 (J10). */
const pOfU = u => ({ name: u.name, eq: u.eqRule || null, headSize: u.headSize || null, sizeCls: sizeOf(u), traits: u.traits || [], weapon: u.weaponGone ? '맨손' : u.weapon, shield: !!(u.shield && !u.armShield) });
const gSlotOf = it => it && it.k === 'armor' ? '몸' : it && it.k === 'helm' ? '머리' : null;
const bagRoomU = (W, u, it) => { if ((u.bag || []).length >= bagCapOf(W, u)) return '가방이 가득 (' + (u.bag || []).length + '/' + bagCapOf(W, u) + ')'; if (it && it.k === 'weapon' && u.eqRule && u.eqRule.wmax && bagWpnN(u, W) + wTwo(W, it.name) > u.eqRule.wmax) return '무기 칸이 참 (' + bagWpnN(u, W) + '/' + u.eqRule.wmax + ' — 두 손 무기는 둘)'; return ''; };
function wearWhyU(W, u, it){
  const sl = gSlotOf(it); if (!sl) return '입을 것이 아님';
  const g0 = (u.gear || {})[sl]; if (g0 && g0.innate && (+it.tier || 1) <= g0.tier) return '갑피 (' + g0.tier + '성) 가 더 단단함 — 입어도 소용없음';
  return wearWhy(W.rules, pOfU(u), it);
}
// 갑옷 · 투구를 바꿔 낌: 무게만큼 걸음을 다시 셈 (다른 배율 — 붉은암석 2페이즈 등 — 은 그대로)
function gearSet(W, u, slot, g){
  const bs = { size: sizeOf(u), ref: ownKey(u) }, w0 = gearW(u.gear, W.rules, bs); u.gear = u.gear || {};
  if (g) u.gear[slot] = g; else delete u.gear[slot];
  const w1 = gearW(u.gear, W.rules, bs); u.spd = +(u.spd * Math.max(0.05, 1 - w1) / Math.max(0.05, 1 - w0)).toFixed(3);
}
const gearItem = (g, sl, W) => ({ k: sl === '몸' ? 'armor' : 'helm', name: g.name, label: g.label || g.name, mat: g.mat, tier: g.tier, dur: g.dur != null ? +g.dur : 100, size: g.size || null, own: g.own || null, uid: (W.bagN = (W.bagN || 10000) + 1) });
function invOp(W, u, o, dt){
  const I = INV(W), T = I.gearT || {}, it = o.uid != null ? (u.bag || []).find(x => x.uid === o.uid) : null, nm = x => x.label || x.name || '';
  const miss = why => { u.order = null; L(W, { k: 'miss', a: u.i, why, inv: o.op, vis: u.side === 0 || !!u.seenBy }); };
  const free = () => { if (u.act && u.act.phase === 'wind' && u.act.k !== 'charge') u.act = null; return !u.act; };
  if (o.op === 'give'){ const r = W.units[o.to];
    if (!it) return miss('가방에 없음'); if (!r || !r.alive || r.gone || r.side !== u.side || r === u) return miss('건넬 동료가 없음');
    const why = bagRoomU(W, r, it); if (why) return miss(r.name + ': ' + why);
    if (gap(u, r) > (I.giveR || 1.2)){ setMood(W, u, r.name + '에게 건네러', r.i); setGoal(W, u, r.x, r.y); follow(W, u, dt); return; }
    u.order = null; if (!free()) return miss('하던 동작이 있음');
    u.act = { k: 'invAct', op: 'give', phase: 'wind', t0: W.t, end: W.t + (I.giveT || 0.6), it, b: r.i }; stop(u); u.fg = Math.atan2(r.y - u.y, r.x - u.x); setMood(W, u, nm(it) + ' 건넴', r.i); return; }
  u.order = null; if (!free()) return miss('하던 동작이 있음');
  if (o.op === 'wear'){ if (!it) return miss('가방에 없음'); const why = wearWhyU(W, u, it); if (why) return miss(nm(it) + ' — ' + why); const sl = gSlotOf(it);
    u.act = { k: 'invAct', op: 'wear', phase: 'wind', t0: W.t, end: W.t + (sl === '머리' ? T.helm || 1.5 : T.armor || 4), it, slot: sl }; stop(u); setMood(W, u, nm(it) + ' 입는 중'); return; }
  if (o.op === 'off'){ const sl = o.slot;
    if (sl === 'shield'){ if (!u.shield || u.armShield) return miss(u.armShield ? '팔 방패는 몸' : '벗을 방패가 없음'); }
    else { const g = (u.gear || {})[sl]; if (!g || g.innate) return miss(g && g.innate ? '갑피는 몸 — 벗을 수 없음' : '입은 것이 없음'); }
    if ((u.bag || []).length >= bagCapOf(W, u)) return miss('가방이 가득 — 벗어 둘 자리가 없음');
    u.act = { k: 'invAct', op: 'off', phase: 'wind', t0: W.t, end: W.t + (sl === 'shield' ? I.swapSh || 0.5 : sl === '머리' ? T.helm || 1.5 : T.armor || 4), slot: sl }; stop(u); setMood(W, u, (sl === 'shield' ? '방패' : sl === '머리' ? '투구' : '갑옷') + ' 벗는 중'); return; }
  if (o.op === 'drop'){ if (!it) return miss('가방에 없음'); if (it.k !== 'weapon' && it.k !== 'shield') return miss('싸우는 중엔 무기 · 방패만 내려놓음 (나머지는 가방에)');
    u.act = { k: 'invAct', op: 'drop', phase: 'wind', t0: W.t, end: W.t + (I.dropT || 0.3), it }; stop(u); setMood(W, u, nm(it) + ' 내려놓음'); return; }
  miss('알 수 없는 장비 명령');
}
function resolveInv(W, u){
  const A = u.act, it = A.it, vis = u.side === 0 || !!u.seenBy; u.act = null; if (!u.alive || !u.bag) return;
  if (A.op === 'give'){ const r = W.units[A.b]; if (!r || !r.alive || r.gone || !u.bag.includes(it) || gap(u, r) > (INV(W).giveR || 1.2) + 0.8) return;
    const why = bagRoomU(W, r, it); if (why){ L(W, { k: 'miss', a: u.i, why: r.name + ': ' + why, inv: 'give', vis }); return; }
    u.bag.splice(u.bag.indexOf(it), 1); (r.bag = r.bag || []).push({ ...it, uid: (W.bagN = (W.bagN || 10000) + 1) }); L(W, { k: 'give', a: u.i, b: r.i, w: it.label || it.name || '', item: it.k, vis }); return; }
  if (A.op === 'drop'){ if (!u.bag.includes(it)) return; u.bag.splice(u.bag.indexOf(it), 1); const { uid, ...o } = it; dropItem(W, u, it.k, it.name, o, 'put'); return; }
  if (A.op === 'wear'){ if (!u.bag.includes(it)) return; const why = wearWhyU(W, u, it); if (why){ L(W, { k: 'miss', a: u.i, why: (it.label || it.name) + ' — ' + why, inv: 'wear', vis }); return; }
    const sl = A.slot, cur = (u.gear || {})[sl]; u.bag.splice(u.bag.indexOf(it), 1);
    if (cur && !cur.innate) u.bag.push(gearItem(cur, sl, W));
    let inn = cur && cur.innate ? cur : cur && cur.over ? cur.over : null, und = null; if (inn && inn.under && u.bag.length < bagCapOf(W, u)){ und = inn.under; u.bag.push(gearItem(und, sl, W)); inn = { ...inn }; delete inn.under; }   // 갑피 아래 덮여 있던 장비는 가방으로 (한 칸엔 하나 — 정산에서 사라지지 않게)
    gearSet(W, u, sl, { name: it.label || it.name || it.mat, mat: it.mat, tier: Math.max(1, Math.min(5, Math.round(+it.tier || 1))), dur: it.dur != null ? +it.dur : 100, size: it.size || null, own: it.own || null, ...(inn ? { over: inn } : {}) });   // 갑피 위에 입으면 벗을 때 갑피로 돌아감
    L(W, { k: 'gearOn', a: u.i, slot: sl, w: it.label || it.name, tier: u.gear[sl].tier, from: cur && !cur.innate ? cur.name : und ? und.name : null, spd: u.spd, vis }); return; }
  if (A.op === 'off'){ const sl = A.slot; if ((u.bag || []).length >= bagCapOf(W, u)) return;
    if (sl === 'shield'){ if (!u.shield || u.armShield) return; const wp = (W.rules.weapons || {})[u.weapon] || {};
      u.bag.push({ k: 'shield', name: '방패', label: u.sName || '', dur: u.sDur != null ? +u.sDur : 100, own: u.sOwn || ownKey(u), uid: (W.bagN = (W.bagN || 10000) + 1) });
      const nm0 = u.sName || '방패'; u.shield = false; u.sOff = true; u.canBash = false; u.raised = false; if (u.canCharge && u.chargeName === '방패 돌진') u.chargeName = '돌진';
      u.parry = !u.weaponGone && !wp.guard && parryArcW(W.rules, u.weapon) > 0; u.canGuard = (!u.weaponGone && !!wp.guard) || !!u.reflex || u.parry; evoRole(W, u);
      L(W, { k: 'gearOff', a: u.i, slot: 'shield', w: nm0, vis }); return; }
    const g = (u.gear || {})[sl]; if (!g || g.innate) return; u.bag.push(gearItem(g, sl, W)); gearSet(W, u, sl, g.over || null); L(W, { k: 'gearOff', a: u.i, slot: sl, w: g.name, spd: u.spd, vis }); }
}
// 근접 무기가 닳음 · 막힐 때 아주 낮은 확률로 부러짐 (낡을수록 · 둔기 · 센 기술에 더)
function wearW(W, u, amt, brk, why){
  const w = u.weaponNow || u.weapon, wp = (W.rules.weapons || {})[u.weapon] || {};
  if (!u.alive || u.weaponGone || !w || ITEM_NATURAL.includes(w) || w === '맨손' || isRangedW(wp) || wp.kind === '마법' || (u.jav && !u.spearHeld)) return;
  const D = W.rules.dur || {}; u.wDur = Math.max(0, (u.wDur != null ? u.wDur : 100) - amt * (u.durK || 1));   /* v8.7.7 덜 닳음 (durK) */
  if (brk == null) return;
  const p = u.wDur <= 0 ? 1 : (D.breakP != null ? D.breakP : 0.0015) * (1 + (D.old != null ? D.old : 3) * (1 - u.wDur / 100)) * brk * (u.durK || 1);
  if (W.rand() < p) breakWeapon(W, u, why);
}
function breakWeapon(W, u, why){
  const nm = u.wName || u.weapon; u.weaponGone = true; u.weaponNow = '맨손'; u.rng = ((W.rules.weapons || {})['맨손'] || { rng: 0.3 }).rng + (u.reachX || 0); u.longReach = u.rng > 1; u.parry = false; u.wDur = 0;
  if (!u.shield && !u.reflex) u.canGuard = false; if (u.jav) u.spearHeld = false; u.wBroken = u.weapon;
  L(W, { k: 'wBreak', a: u.i, w: nm, why: why || '', vis: u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '무기가 부러짐!', c: 'd', t0: W.t });
}
function breakShield(W, t, by){
  const wp = (W.rules.weapons || {})[t.weapon] || {}; t.shield = false; t.shieldLost = true; t.sDur = 0; t.canBash = false; t.raised = false;
  t.parry = !t.weaponGone && !wp.guard && parryArcW(W.rules, t.weapon) > 0; t.canGuard = (!t.weaponGone && !!wp.guard) || !!t.reflex || t.parry;
  if (t.chargeName === '방패 돌진') t.chargeName = '돌진';
  if (t.alive) evoRole(W, t);   /* v8.7.4 I25 방패가 부서지면 본디 역할로 */
  L(W, { k: 'sBreak', a: t.i, b: by ? by.i : null, name: t.sName || '방패', vis: t.side === 0 || !!t.seenBy || (by && by.side === 0) }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '방패가 부서짐!', c: 'd', t0: W.t });
}
// 막았을 때: 방패는 막은 피해만큼 · 무기로 막았으면 막은 쪽 무기 · 막힌 쪽 무기가 닳고 (드물게) 부러짐
function wearBlock(W, u, t, o, base, extra){
  const D = W.rules.dur || {}; if (!D.clash) return;
  const heavy = extra && (extra.mul || 1) >= 1.5 ? (D.heavy || 3) : 1, blunt = !o.far && ((W.rules.weapons || {})[u.weaponNow || u.weapon] || {}).kind === '둔기' ? (D.blunt || 2) : 1;
  if (o.gn === '방패' && t.shield && !t.armShield){ t.sDur = Math.max(0, (t.sDur != null ? t.sDur : 100) - base * (D.shield || 0.12) * (o.far ? 0.5 : 1) * heavy * (t.durK || 1)); if (t.sDur <= 0) breakShield(W, t, u); }
  else if (!o.far && o.gn && o.gn !== '반사신경' && o.gn !== '팔') wearW(W, t, D.clash, blunt * heavy * (u.strMul || 1), u.name + '의 일격을 막다가');
  if (!o.far && !o.jav) wearW(W, u, D.clash, o.gn === '방패' ? 1.2 : 1, t.name + '에게 막혀');
}
// 맞혔을 때: 친 근접 무기가 조금 닳고, 갑옷 · 투구는 막아 낸 만큼 닳음 (0 이면 망가짐)
function wearHit(W, u, t, o, it, dmg, armMul){
  const D = W.rules.dur || {}; if (!D.clash) return;
  if (!o.far && !o.jav) wearW(W, u, D.hit || 0.25, null);
  if (it && !it.innate && armMul < 1 && it.dur != null && it.dur > 0){ const ab = Math.min(40, dmg / Math.max(0.15, armMul) - dmg); it.dur = Math.max(0, +(it.dur - ab * (D.armor || 0.1) * (t.durK || 1)).toFixed(2));
    if (it.dur <= 0){ const sl = GEAR_SLOTS.find(k => t.gear && t.gear[k] === it) || (it.mat === '투구' ? '머리' : '몸'); L(W, { k: 'aBreak', a: t.i, name: it.name, slot: sl, ...(it.over ? { bare: true } : {}), vis: t.side === 0 || !!t.seenBy }); if (it.over && t.gear && t.gear[sl] === it) gearSet(W, t, sl, it.over); } }   /* v8.7.6 갑피 위의 장비가 망가지면 갑피가 드러남 */
}
// v7.20.1 전리품 (판이 끝나면): 땅의 무기 · 방패 (아군 제 것은 저절로 돌아오니 빼고 · 던진 창 빼고) + 쓰러진 적의 갑옷 · 투구 (망가진 것 빼고 · 그 몸의 체급) + 무기에 남은 화살 · 탄 (따로 묶음)
function lootOf(W){   /* v8.7.6 줍거나 쓰러지면 다시 셈 (예전엔 처음 한 번만 — 주운 것이 남아 보이던 것) · 출처 열쇠 lk 로 챙긴 표시 · 남은 탄을 이어 받음 · 갑옷 굴림은 한 번 */
  const dead = W.units.filter(u => !u.alive && !u.gone && !u.summon), sig = (W.items || []).filter(it => it.k === 'weapon' || it.k === 'shield').map(it => it.id).join(',') + '|' + dead.map(u => u.i).join(',');
  if (W.loot && W.lootSig === sig) return W.loot;
  const prev = new Map((W.loot || []).map(x => [x.lk, x])), roll = W.lootRoll || (W.lootRoll = {});
  const out = [], mine = new Set(W.units.filter(u => u.side === 0 && (u.alive || u.gone)).map(ownKey));   // 살아 있거나 맵을 나간 동료의 제 것은 그 동료에게 (정산에서 돌아감) — 쓰러진 동료의 것은 전리품
  const put = (lk, o) => { const p = prev.get(lk); out.push({ ...o, lk, ...(p && p.taken ? { taken: p.taken } : {}), ...(p && p.auto ? { auto: p.auto } : {}), ...(p && p.n0 != null ? { n0: p.n0 } : {}), ...(p && o.k === 'ammo' && p.n != null ? { n: p.n } : {}) }); };   // 챙긴 표시 · 나눠 담고 남은 탄은 이어 받음
  for (const it of W.items || []){ if (it.k !== 'weapon' && it.k !== 'shield') continue; if (it.own && mine.has(it.own)) continue; if (W.units[it.owner] && W.units[it.owner].ratOf != null) continue;   /* v8.7.8 쥐의 무구는 전리품이 아님 */
    const at = it.k === 'weapon' ? ammoTOf(W, it.name) : null, dw = W.units.find(u => !u.alive && !u.gone && u.side === 0 && ownKey(u) === it.own);
    if (at && it.ammo > 0) put('ga' + it.id, { k: 'ammo', at, n: it.ammo, label: (it.label || it.name) + '에 남은 ' + (at === '화살' ? '화살' : at + ' 탄') });
    put('g' + it.id, { k: it.k, name: it.name, label: it.label || '', dur: it.dur != null ? +it.dur : 100, own: it.own || null, ground: it.id, ...(dw ? { fall: dw.name } : {}), ...(at ? { ammo: 0 } : {}) }); }
  const LR = W.rules.loot || {}, wr = LR.worn || [15, 60];
  for (const u of dead){ const ally = u.side === 0, nm = String(u.name || '').replace(/\s*\d+$/, ''), sz = sizeOf(u), fall = ally ? { fall: nm } : {};   // 쓰러진 동료의 것: 가방 · 두 번째 총 · 갑옷 · 투구 모두 (굴림 없이 · 낡은 그대로)
    for (const x of u.bag || []){ const { uid, ...o } = x; if (x.k === 'weapon' || x.k === 'shield') put('b' + u.i + ':' + uid, { ...o, label: o.label || (x.k === 'weapon' ? nm + '의 ' + o.name : nm + '의 방패'), dur: o.dur != null ? +o.dur : 100, own: o.own || ownKey(u), ...fall });   /* v7.25.2 무구는 모두: 가방의 무기 · 방패 */
      else if (ally && x.k !== 'ammo') put('b' + u.i + ':' + uid, { ...o, ...fall });
      else if (ally && x.k === 'ammo' && x.n > 0) put('b' + u.i + ':' + uid, { k: 'ammo', at: x.at, n: x.n, label: nm + '의 가방에 남은 ' + (x.at === '화살' ? '화살' : x.at + ' 탄'), ...fall }); }
    if (u.alt && u.alt.name){ const at = ammoTOf(W, u.alt.name); if (at && u.alt.ammo > 0) put('aa' + u.i, { k: 'ammo', at, n: u.alt.ammo, label: nm + '의 ' + u.alt.name + '에 남은 ' + at + ' 탄' }); put('alt' + u.i, { k: 'weapon', name: u.alt.name, label: nm + '의 ' + u.alt.name, dur: 100, own: ownKey(u), ...fall, ...(at ? { ammo: 0 } : {}) }); }   /* 두 번째 총 */
    for (const sl of GEAR_SLOTS){ const g0 = (u.gear || {})[sl], g = g0 && g0.innate ? g0.under : g0 && g0.over ? g0 : g0; if (!g || g.innate || (g.dur != null && g.dur <= 0)) continue;   /* v7.23.3 갑피 아래의 장비도 */
      const uq = ally || / ?의 /.test(g.name || '') || (u.traits || []).includes('보스'), rk = 'a' + u.i + sl;   /* v7.25.2 이름 붙은 고유 장비 · [보스] 의 것 · v8.7.6 쓰러진 동료의 것은 늘 */
      if (roll[rk] == null) roll[rk] = W.rand();
      if (!uq && roll[rk] >= (sl === '몸' ? (LR.armorP != null ? LR.armorP : 0.25) : (LR.helmP != null ? LR.helmP : 0.3))) continue;   /* v7.25.2 방어구는 낮은 확률 (망가지고 벗기기 힘듦) — 굴림은 한 번 */
      const d0 = g.dur != null ? +g.dur : 100, dw = uq ? d0 : Math.min(d0, Math.round(wr[0] + roll[rk] * 1000 % 1 * (wr[1] - wr[0])));
      put(rk, { k: sl === '몸' ? 'armor' : 'helm', name: g.name, label: / ?의 /.test(g.name || '') ? g.name : nm + '의 ' + (sl === '몸' ? '갑옷' : g.mat === '두건' ? '두건' : '투구'), mat: g.mat, tier: g.tier, dur: dw, ...(uq ? {} : { worn: true }), size: g.size || sz, own: g.own || ownKey(u), ...fall }); } }
  { const have = new Set(out.map(o => o.lk)); for (const [lk, x] of prev) if (x.taken && !have.has(lk)) out.push(x); }   // 맵 위에서 챙겨 땅에서 사라진 것도 '챙긴 것' 으로 남김 (여정 기록 · 챙긴 줄)
  W.lootSig = sig; return (W.loot = out);
}

/* ---------- v7.19.1 고유 기술: 공중제비 (탕아) · 머리 찍기 (쟝) · 영거리 사격 (간두) · 철퇴 후리기 · 휘둘러 치기 (모닝스타) — 적 · 아군 같은 규칙 ---------- */
const SPEC_NM = k => (Object.entries(SPEC_K).find(e => e[1] === k) || [k])[0];   /* v8.7.3 기술 이름 (명령 글) */
const SPEC_K = { '혈영보': 'blink', '초돌진': 'asup', '앞차기': 'akick', '잡아뚫기': 'kgrab', '노인의 팔': 'ksw', '라이트 훅': 'khook', '짓밟기': 'kstomp', '노인의 팔 철퇴': 'kslam', '돌진 몸박': 'krush', '쥐 표식': 'pmark', '쥐 방진': 'pfort', '쥐 방패': 'pshield', '쥐 사다리': 'pladder', '쥐 포박': 'pbind', '혈염': 'pyre', '핏빛 장판': 'pool', '피의 검기': 'wave', '도약 강타': 'quake', '회전 투척': 'spin', '공중제비': 'flip', '머리 찍기': 'head', '영거리 사격': 'pb', '철퇴 후리기': 'sweep', '휘둘러 치기': 'hurl', '역장': 'ward', '뿌리 벽': 'root', '잡아찢기': 'tear', '딥 킥': 'kick', '방어모드': 'stone', '바위던지기': 'boulder', '손바닥': 'gpalm', '니킥': 'knee', '딱': 'snap', '딱딱딱': 'snap3', '내려찍기': 'gslam', '올려차기': 'rise' };   /* v8.7.8 굿윌 */   // v7.19.2 딸기   /* v8.7.4 붉은암석 (J22) */
const SPR = (W, k) => ((W.rules.spec || {})[k]) || {};
const specOf = (u, k) => (u.spec || []).find(x => x.k === k);
function specReady(W, u, k){ const x = specOf(u, k); if (!x || !u.alive || u.down || u.noArms || u.crawl || u.lie || u.kb || W.t < x.cdT || W.t < u.brokenT || W.t < (u.proneT || -9)) return false; if (u.stoneT != null && W.t < u.stoneT) return false;   /* v8.7.4 방어모드 */ if (x.n != null && x.n <= 0) return false; if (GW_K.includes(k) && !gwOn(u)) return false; if ((k === 'kslam' || k === 'krush') && !u.heretic) return false;   /* v8.7.8 불경자의 기술 */   /* v8.7.8 굿윌의 기술은 맨손일 때만 */ if ((k === 'sweep' || k === 'hurl' || k === 'spin') && u.weaponGone) return false; if ((k === 'sweep' || k === 'hurl') && flailOut(W, u)) return false;   /* v7.25.0 공을 거둬야 */ if (k === 'root' && (W.roots || []).filter(r => r.by === u.i).length >= (SPR(W, 'root').max || 2)) return false; return k !== 'pb' || u.shells > 0; }   // v7.19.2 철퇴를 뺏기면 못 씀 · 뿌리 벽은 둘까지
// 공중제비: back = 뒤 (또는 찍은 자리) 로 빠짐 · 아니면 그 상대에게 뛰어올라 몸 바로 앞에 내려찍음 (내려앉을 때 slamHit)
function startFlip(W, u, t, back, px, py){
  const F = SPR(W, 'flip'), x = specOf(u, 'flip'); let tx, ty;
  if (back){ const ax = px != null ? px - u.x : u.x - t.x, ay = py != null ? py - u.y : u.y - t.y, l = Math.hypot(ax, ay) || 1, Dd = Math.min(F.back || 2.6, px != null ? l : 99); tx = u.x + ax / l * Dd; ty = u.y + ay / l * Dd; }
  else { if (!t || gap(u, t) > (F.d || 3.2)) return false; const p = leapIn(u, t); tx = p.x; ty = p.y; }
  for (let k = 0; k < 6 && (boxRock(W, tx, ty, u.r * 0.9) || !fatClear(W.map, u.x, u.y, tx, ty, u.r * 0.6)); k++){ tx = u.x + (tx - u.x) * 0.75; ty = u.y + (ty - u.y) * 0.75; }
  const len = Math.hypot(tx - u.x, ty - u.y); if (len < 0.4 || boxRock(W, tx, ty, u.r * 0.9)) return false;
  u.act = { k: 'leap', phase: 'run', t0: W.t, end: W.t + (F.time || 0.45) * Math.max(0.6, len / (F.d || 3.2)), fx: u.x, fy: u.y, tx, ty, b: t ? t.i : null, dir: back ? 'back' : 'fwd', flip: true, slam: !back };
  x.cdT = W.t + (back ? F.backCd || 3 : F.cd || 7); stop(u); u.fg = back && t ? Math.atan2(t.y - u.y, t.x - u.x) : Math.atan2(ty - u.y, tx - u.x);
  L(W, { k: 'flip', a: u.i, b: t ? t.i : null, slam: !back, len: +len.toFixed(2), vis: u.side === 0 || !!u.seenBy }); setMood(W, u, back ? '공중제비로 빠짐' : '공중제비 — 내려찍기', t ? t.i : null);
  return true;
}
// 내려찍기: 뛴 방향으로 세로 len · 폭 w 안의 적을 모두 (막을 수는 있음) — 맞으면 넘어짐 (너무 무거운 몸은 안 넘어짐)
function slamHit(W, u, A){
  const F = SPR(W, 'flip'), dx0 = A.tx - A.fx, dy0 = A.ty - A.fy, l = Math.hypot(dx0, dy0) || 1, dx = dx0 / l, dy = dy0 / l, L0 = F.len || 1.5, w = (F.w || 0.9) / 2; let n = 0, held = null;
  for (const e of W.units){ if (!e.alive || e === u || e.side === u.side) continue;
    const ex = e.x - u.x, ey = e.y - u.y, al = ex * dx + ey * dy, lat = Math.abs(ex * dy - ey * dx);
    if (al < -0.3 || al > L0 + e.r || lat > w + e.r) continue;
    if ((e.canGuard || e.shield || e.armShield) && setFor(W, e, u)){ held = e; L(W, { k: 'slamHeld', a: u.i, b: e.i, how: e.armShield ? '팔' : e.shield ? '방패' : '무구', vis: u.side === 0 || e.side === 0 || !!u.seenBy || !!e.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y, s: '태세 — 막힘!', c: 'b', t0: W.t }); continue; }   /* v8.7.3 태세에 막힘 */
    const o = strike(W, u, e, e, 1, false, { mul: F.mul || 2.3, heavyCrit: F.crit || 0.25, tag: '공중제비 내려찍기', grab: true }); n++;   /* v8.7.3 태세가 아니면 받아 내지 못함 */
    if (o && !o.block && e.alive && e.mass * (e.poise || 1) <= u.mass * 1.6) knockDown(W, e, F.down || 1.0, u.i, '내려찍기'); }
  if (held && u.alive) stun(W, u, F.heldStun != null ? F.heldStun : 0.35, held.i);   /* v8.7.3 막히면 짧게 휘청 (돌진보다 손해가 작음) */
  L(W, { k: 'slam', a: u.i, n, held: held ? held.i : null, vis: u.side === 0 || !!u.seenBy }); if (W.fxOn && n) W.fx.push({ k: 'num', x: A.tx, y: A.ty, s: '내려찍기!', c: 'd', t0: W.t });
}
// v7.22.2 도약 강타: (tx, ty) 로 time 초 날아감 (몸 위로 넘어감) — 내려앉을 그림자는 누구나 봄
// v7.22.3 무기가 주는 기술 (열화판): 든 무기의 spec 을 아직 없으면 더함 (weak)
function wpnSpec(W, u){ const wp = (W.rules.weapons || {})[u.weapon] || {}; if (!wp.spec || u.weaponGone || (u.spec || []).some(x => x.k === wp.spec)) return; (u.spec = u.spec || []).push({ k: wp.spec, name: wp.specName || wp.spec, cdT: -9, n: null, weak: true }); }
// v7.22.3 핏빛 장판: tick 초마다 안에 선 모두 (깐 이는 빼고 · 동료도) 화상 · 느려짐 — 장판을 본 쪽은 밖으로 피함
function stepPools(W, dt){
  const S = SPR(W, 'pool');
  for (const P of W.pools){ if (W.t >= P.until) continue; const by = W.units[P.by];
    for (const e of W.units){ if (!e.alive || e.i === P.by) continue; const d = Math.hypot(e.x - P.x, e.y - P.y); if (d > P.r + e.r * 0.5) continue;
      e.poolSlowT = W.t + 0.3;
      if (!e.flee && !e.down && !e.kb && (litAt(W, P.x, P.y) || d < 1.5) && !(e.act && e.act.phase !== 'wind')){ const a = d > 0.05 ? Math.atan2(e.y - P.y, e.x - P.x) : W.rand() * 6.283, D = P.r + e.r + 0.4;
        e.flee = { x: Math.max(0.6, Math.min(W.map.W - 0.6, P.x + Math.cos(a) * D)), y: Math.max(0.6, Math.min(W.map.H - 0.6, P.y + Math.sin(a) * D)), until: W.t + 1.2 }; L(W, { k: 'poolFlee', a: e.i, b: P.by, vis: e.side === 0 || !!e.seenBy }); } }
    if (W.t >= P.tickT){ P.tickT = W.t + (S.tick || 0.5);
      for (const e of W.units){ if (!e.alive || e.i === P.by || Math.hypot(e.x - P.x, e.y - P.y) > P.r + e.r * 0.5) continue; burnOn(W, e, by && by.fire ? by : { i: P.by, fire: 2 }, S.stacks || 1, !!(e.gear || {})['몸']); } } }
  W.pools = W.pools.filter(P => W.t < P.until);
}
function startQuake(W, u, tx, ty, why){
  const Q = SPR(W, 'quake'), x = specOf(u, 'quake'); if (!x) return false; const m = W.map, pad = u.r + 0.2;
  tx = Math.max(pad, Math.min(m.W - pad, tx)); ty = Math.max(pad, Math.min(m.H - pad, ty));
  for (let k = 0; k < 6 && boxRock(W, tx, ty, u.r * 0.9); k++){ tx = u.x + (tx - u.x) * 0.8; ty = u.y + (ty - u.y) * 0.8; }
  const len = Math.hypot(tx - u.x, ty - u.y); if (len < 1 || boxRock(W, tx, ty, u.r * 0.9)) return false;
  u.act = { k: 'leap', phase: 'run', t0: W.t, end: W.t + (Q.time || 1.1), fx: u.x, fy: u.y, tx, ty, dir: 'fwd', quake: true, air: true, r: Q.r || 2.4 };
  x.cdT = W.t + (Q.cd || 9); stop(u); u.fg = u.face = Math.atan2(ty - u.y, tx - u.x);
  L(W, { k: 'quake', a: u.i, x: +tx.toFixed(2), y: +ty.toFixed(2), len: +len.toFixed(1), why: why || '', vis: u.side === 0 || !!u.seenBy || litAt(W, tx, ty) }); setMood(W, u, why || '도약 강타');
  return true;
}
// 그림자를 본 쪽 (뛰는 몸이 보이거나 · 내려앉을 자리가 밝고 보이는 거리) 은 충격 밖으로 달아남 — 하던 예고는 끊음
function quakeWarn(W, u, A){
  const R = A.r || 2.4, Q = SPR(W, 'quake');
  for (const e of W.units){ if (!e.alive || e === u || e.down || e.kb || W.t < (e.proneT || -9)) continue; const d = Math.hypot(e.x - A.tx, e.y - A.ty); if (d > R + e.r + 0.3) continue;
    if (!(canSee(W, e, u) || (litAt(W, A.tx, A.ty) && d <= W.rules.sight))) continue;
    const a = d > 0.05 ? Math.atan2(e.y - A.ty, e.x - A.tx) : W.rand() * 6.283, D = R + e.r + 0.5, fx = Math.max(0.6, Math.min(W.map.W - 0.6, A.tx + Math.cos(a) * D)), fy = Math.max(0.6, Math.min(W.map.H - 0.6, A.ty + Math.sin(a) * D));
    { const ea = e.act; if (ea && !(ea.k === 'charge' && ea.phase === 'run') && ea.k !== 'leap' && ea.k !== 'dodge'){ if (ea.k === 'skill' && ea.phase === 'tend') tendEnd(W, e, ea, '피함'); e.act = null; e.burst = null; } }   /* v8.7.3 하던 짓을 끊고 */
    if (!e.act){ if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.45, s: '!', c: 'g', t0: W.t }); e.flee = { x: fx, y: fy, until: W.t + (Q.flee || 0.85), why: '내려앉을 자리에서 피함' }; L(W, { k: 'quakeFlee', a: e.i, b: u.i, vis: e.side === 0 || !!e.seenBy }); } }
}
// 내려앉음: 바로 밑 (몸 반지름 × under + 깔리는 몸 절반) 의 kill 체급 이하는 깔려 즉사 · r 칸 안은 가까울수록 센 충격 (둔기 · 막을 수 있음) · 날아감 · 넘어짐 — 동료도 맞음
// v7.24 두 원이 겹친 넓이 (반지름 R1 · r2 · 중심 거리 d)
function circOv(d, R1, r2){ if (d >= R1 + r2) return 0; if (d <= Math.abs(R1 - r2)) return Math.PI * Math.min(R1, r2) ** 2;
  const a = r2 * r2 * Math.acos(Math.max(-1, Math.min(1, (d * d + r2 * r2 - R1 * R1) / (2 * d * r2)))) + R1 * R1 * Math.acos(Math.max(-1, Math.min(1, (d * d + R1 * R1 - r2 * r2) / (2 * d * R1)))); return a - 0.5 * Math.sqrt(Math.max(0, (-d + r2 + R1) * (d + r2 - R1) * (d - r2 + R1) * (d + r2 + R1))); }
function quakeHit(W, u, A){
  const Q = SPR(W, 'quake'), R = A.r || Q.r || 2.4, kq = u.quakeKill || Q.kill || '중형', kr = SIZE_RANK[kq] != null ? SIZE_RANK[kq] : 1;   /* v8.7.4 몸마다 (붉은암석 중대형) */ let n = 0, kills = 0, air = 0, push = 0;
  for (const e of W.units){ if (!e.alive || e === u) continue; const d = Math.hypot(e.x - u.x, e.y - u.y); if (d > R + e.r) continue; n++;
    const ax = d > 0.05 ? (e.x - u.x) / d : Math.cos(W.rand() * 6.283), ay = d > 0.05 ? (e.y - u.y) / d : Math.sin(W.rand() * 6.283);
    if (e.act && e.act.k === 'leap'){ air++; if (e.side === 0 || e.seenBy) L(W, { k: 'quakeAir', a: u.i, b: e.i, vis: true }); continue; }   /* v7.24 공중 (도약 · 공중제비 중) 은 피해 없음 */
    const ov = circOv(d, u.r * (Q.under || 1), e.r) / (Math.PI * e.r * e.r);   /* v7.24 그림 (몸 동그라미) 과 겹친 몫 */
    if (ov > (Q.crush != null ? Q.crush : 0.5) && (SIZE_RANK[sizeOf(e)] != null ? SIZE_RANK[sizeOf(e)] : 1) <= kr){ applyDmg(W, u, e, Math.ceil(e.hp) + 999, { tag: '찌부러짐', death: 'crush', ff: e.side === u.side }); kills++; continue; }
    const body = d < u.r + e.r, f = body ? 1 : 1 - Math.min(1, Math.max(0, d - u.r - e.r) / Math.max(0.5, R - u.r)) * 0.5, o = strike(W, u, e, e, 1, false, { mul: (Q.mul || 0.3) * f, tag: body ? '몸에 밀려남' : '도약 강타 충격', wk: '둔기' });
    if (e.alive && body){ const D2 = u.r + e.r + 0.05, x = u.x + ax * D2, y = u.y + ay * D2, p = !boxRock(W, x, y, e.r * 0.9) ? { x, y } : freeSpot(W, x, y, e.r); if (p){ e.x = p.x; e.y = p.y; } push++; knockDown(W, e, 1.0, u.i, '내려앉은 몸에 깔림'); }   // 몸에 걸친 이는 몸 밖으로   /* v8.7.4 겹친 몸은 넘어짐 (J22) */
    if (e.alive && !e.kb) shove(W, u, e, (Q.kb || 0.7) * f * (o && o.block ? 0.6 : 1), ax, ay, { tag: body ? '몸에 밀려남' : '충격에 밀림' }); }
  L(W, { k: 'quakeHit', a: u.i, n, kills, air, push, x: +u.x.toFixed(2), y: +u.y.toFixed(2), vis: true }); W.lightT = 0;
  if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '쿵!', c: 'd', t0: W.t });
}
// v7.24.1 철퇴 던지기 · v7.24.4 관성 물리: 공은 속도 (vx · vy) 를 가짐 — 날아가며 공기 저항 (drag) 으로 줄고, 사슬 (L) 이 팽팽해지면 바깥쪽 속도가 되튕겨 (e) 끌어당김이 시작됨.
// 처음 닿는 적 몸 (투사체처럼: 피할 수 있음 · 방패로 막힘 · 동료는 비껴감) 이나 바위에 부딪히면 튕김. 끌어당김 = 손 쪽으로 pull M/초² · damp 로 잦아듦 (넘쳐 흔들림) — 손에 닿으면 다음 공격
function throwFlail(W, u, t){
  const FL = flailOf(W, u) || {}, lead = 0.12, tx = t.x + (t.vx || 0) * lead, ty = t.y + (t.vy || 0) * lead, d = Math.hypot(tx - u.x, ty - u.y) || 1, dx = (tx - u.x) / d, dy = (ty - u.y) / d, v = FL.v || 14, sw = 1.2;   // 머리 위로 돌리던 기세 (시계방향) 가 살짝 실림
  (W.flails || (W.flails = [])).push({ by: u.i, side: u.side, b: t.i, x: u.x + dx * u.r * 0.6, y: u.y + dy * u.r * 0.6, vx: dx * v - dy * sw, vy: dy * v + dx * sw, L: u.r + u.rng + (FL.ball || 0.2), br: FL.ball || 0.2, ph: 'out', hit: null, ev: [], bk: [], t0: W.t });
  u.fg = u.face = Math.atan2(dy, dx); L(W, { k: 'flail', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy });
}
/* v7.25.0 철퇴를 돌리다 넘어지거나 (모으다) 휘청이면: 기술은 거기서 끝 (대기는 그대로 — 일어나도 이어 돌리지 않음) · 공은 그 자리에 떨어짐 (ph drop).
   나가 있던 공도 떨어짐. 일어나면 걸으며 감아 들임 (reel — 느린 당김 · 그동안 다시 던지거나 후리지 못함) */
function flailDrop(W, u, why){
  const FL = flailOf(W, u), a = u.act; if (!FL) return;
  const sp = !!(a && a.k === 'spec' && (a.s === 'sweep' || a.s === 'hurl')), ov = !!(a && a.k === 'atk' && a.fl && a.phase === 'wind');
  if (sp || ov){ const S = SPR(W, 'sweep'), sw = sp && a.phase === 'swing', ang = sw ? a.ang : (a.a0 != null ? a.a0 : (u.face || 0) + Math.PI) + (W.t - a.t0) * (S.ws || 13), R = sw ? a.R : u.r + 0.45;
    let x = u.x + Math.cos(ang) * R, y = u.y + Math.sin(ang) * R; if (rock(W.map, x, y)){ x = u.x + Math.cos(ang) * u.r; y = u.y + Math.sin(ang) * u.r; }
    const v = sw ? 2 * Math.PI * R / (S.spin || 0.45) * 0.25 : 3;
    (W.flails || (W.flails = [])).push({ by: u.i, side: u.side, b: null, x, y, vx: -Math.sin(ang) * v, vy: Math.cos(ang) * v, L: Math.max(R, u.r + 0.3), br: FL.ball || 0.2, ph: 'drop', hit: null, ev: [], t0: W.t, drop: true });
    u.act = null; L(W, { k: 'flailDrop', a: u.i, s: sp ? a.s : 'atk', why, vis: u.side === 0 || !!u.seenBy }); }
  for (const F of W.flails || []) if (F.by === u.i && F.ph !== 'drop'){ F.ph = 'drop'; F.vx *= 0.4; F.vy *= 0.4; }
}
const flailOut = (W, u) => (W.flails || []).some(F => F.by === u.i);
const rank2 = (W, u) => u.rng >= 0.9 && !flailOf(W, u);   /* v8.7.3 2열 (앞 동료 너머) 은 창 · 장창만 — 철퇴는 던지는 공이라 앞 동료를 맞힘 */
const flLane = (W, u, t) => { const FL = flailOf(W, u) || {}, dt0 = dist(u, t) + 0.3; return W.units.some(o => o.alive && o !== u && o.side === u.side && !o.lie && dist(u, o) < dt0 && segD(u, t.x, t.y, o) < o.r * (FL.laneR || 0.95) + (FL.ball || 0.2) + 0.15); };   /* v8.7.3 몸 전체 + 휘어 날아가는 몫 */   /* v7.29.0 */
function stepFlails(W, dt){
  for (const F of W.flails){ const u = W.units[F.by]; if (!u || !u.alive){ F.done = true; continue; } const FL = flailOf(W, u) || {}, N = 3, ds = dt / N;
    const down = !!(u.kb || W.t < (u.proneT || -9) || W.t < (u.stunT || -9) || u.down);   /* v7.25.0 주인이 넘어지면 공이 떨어짐 → 일어나면 감아 들임 */
    if (down && F.ph !== 'drop'){ F.ph = 'drop'; F.vx *= 0.4; F.vy *= 0.4; }
    if (F.ph === 'drop'){ const kk = Math.max(0, 1 - 7 * dt), nx = F.x + F.vx * dt, ny = F.y + F.vy * dt; F.vx *= kk; F.vy *= kk; if (!rock(W.map, nx, ny)){ F.x = nx; F.y = ny; } else { F.vx = 0; F.vy = 0; }
      const dd = Math.hypot(F.x - u.x, F.y - u.y); if (dd > F.L){ F.x = u.x + (F.x - u.x) / dd * F.L; F.y = u.y + (F.y - u.y) / dd * F.L; }   // 사슬 끝 — 바닥에 끌려옴
      F.t0 = W.t; if (!down){ F.ph = 'back'; F.reel = true; L(W, { k: 'flailReel', a: u.i, vis: u.side === 0 || !!u.seenBy }); } continue; }
    for (let q = 0; q < N && !F.done; q++){
      if (F.ph === 'out'){ const x0 = F.x, y0 = F.y, k = Math.max(0, 1 - (FL.drag || 1.2) * ds); F.x += F.vx * ds; F.y += F.vy * ds; F.vx *= k; F.vy *= k;
        if (rock(W.map, F.x, F.y)){ F.x = x0; F.y = y0; F.vx *= -0.3; F.vy *= -0.3; F.ph = 'back'; F.wall = true; continue; }
        let best = null, bt = 9;   // 길에 처음 닿는 적 몸 (선분 x0 → x)
        if (Math.hypot(F.vx, F.vy) > (FL.minV || 3)) for (const e of W.units){ if (!e.alive || e === u || e.lie || F.ev.includes(e.i) || (e.act && e.act.k === 'leap')) continue;
          const sx = F.x - x0, sy = F.y - y0, ll = sx * sx + sy * sy || 1e-9, kk = Math.max(0, Math.min(1, ((e.x - x0) * sx + (e.y - y0) * sy) / ll)), px = x0 + sx * kk - e.x, py = y0 + sy * kk - e.y, rr = e.side === F.side ? e.r * (FL.ff || 0.55) : e.r + F.br;   /* v7.29.0 동료도 (깊이 겹치면) */
          if (px * px + py * py <= rr * rr && kk < bt){ bt = kk; best = e; } }
        if (best){ const p = evadeP(W, best, u, 'shot', { sp: Math.hypot(F.vx, F.vy) });
          if (p && W.rand() < p){ F.ev.push(best.i); evaded(W, best, u, 'shot', '날아오는 철퇴를 피함', p); }
          else { strike(W, u, best, best, 1, false, { tag: best.side === F.side ? '철퇴 던지기 (오사)' : '철퇴 던지기', wk: '둔기' }); F.hit = best.i; F.ph = 'back';   // 몸에 맞고 튕김
            if (best.side === F.side) L(W, { k: 'flailFF', a: u.i, b: best.i, back: false, vis: true });
            const nx = F.x - best.x, ny = F.y - best.y, nl = Math.hypot(nx, ny) || 1, vn = (F.vx * nx + F.vy * ny) / nl; if (vn < 0){ F.vx -= 1.35 * vn * nx / nl; F.vy -= 1.35 * vn * ny / nl; } F.vx *= 0.5; F.vy *= 0.5; continue; } }
        const rx = F.x - u.x, ry = F.y - u.y, rd = Math.hypot(rx, ry) || 1;
        if (rd > F.L){ F.x = u.x + rx / rd * F.L; F.y = u.y + ry / rd * F.L; const vr = (F.vx * rx + F.vy * ry) / rd; if (vr > 0){ F.vx -= (1 + (FL.e || 0.35)) * vr * rx / rd; F.vy -= (1 + (FL.e || 0.35)) * vr * ry / rd; } F.ph = 'back'; }   // 사슬이 팽팽 → 되튕김
        else if (Math.hypot(F.vx, F.vy) < (FL.minV || 3) * 0.5) F.ph = 'back';
        continue; }
      const hx = u.x, hy = u.y, d = Math.hypot(hx - F.x, hy - F.y) || 1e-6, kd = Math.max(0, 1 - (FL.damp || 3) * ds);   // 끌어당김: 손 쪽으로 가속 · 잦아듦
      const pl = F.reel ? (FL.reel || 30) : (FL.pull || 70), bx0 = F.x, by0 = F.y; F.vx = (F.vx + (hx - F.x) / d * pl * ds) * kd; F.vy = (F.vy + (hy - F.y) / d * pl * ds) * kd; F.x += F.vx * ds; F.y += F.vy * ds; F.L = Math.max(u.r, Math.min(F.L, d + 0.05));
      if (!F.reel && F.bk && Math.hypot(F.vx, F.vy) > (FL.backV || 4)) flailBackHit(W, u, F, FL, bx0, by0);   /* v7.29.0 */
      const d2 = Math.hypot(hx - F.x, hy - F.y); if (d2 > F.L){ F.x = hx + (F.x - hx) / d2 * F.L; F.y = hy + (F.y - hy) / d2 * F.L; }
      if (d2 <= u.r * 0.75 || W.t - F.t0 > (F.reel ? 4 : 3)){ F.done = true; if (u.act && u.act.k === 'atk' && u.act.fl && u.act.phase === 'rec') u.act.end = Math.min(u.act.end, W.t + (FL.rec || 0.15)); } } }
  W.flails = W.flails.filter(F => !F.done);
}
// v7.29.0 거두는 공이 지나는 길: 처음 닿는 몸 하나 (공마다 한 번씩 · 던질 때 맞은 이는 빼고) — 적은 피할 수 있음 · × backMul · backDown 확률로 넘어짐 / 동료는 깊이 겹치면 오사
function flailBackHit(W, u, F, FL, x0, y0){
  let best = null, bt = 9; const sx = F.x - x0, sy = F.y - y0, ll = sx * sx + sy * sy || 1e-9;
  for (const e of W.units){ if (!e.alive || e === u || e.lie || e.i === F.hit || F.bk.includes(e.i) || F.ev.includes(e.i) || (e.act && e.act.k === 'leap')) continue;
    const kk = Math.max(0, Math.min(1, ((e.x - x0) * sx + (e.y - y0) * sy) / ll)), px = x0 + sx * kk - e.x, py = y0 + sy * kk - e.y, rr = e.side === F.side ? e.r * (FL.ff || 0.55) : e.r + F.br;
    if (px * px + py * py <= rr * rr && kk < bt){ bt = kk; best = e; } }
  if (!best) return; F.bk.push(best.i);
  if (best.side !== F.side){ const p = evadeP(W, best, u, 'shot', { sp: Math.hypot(F.vx, F.vy) }); if (p && W.rand() < p){ evaded(W, best, u, 'shot', '돌아오는 철퇴를 피함', p); return; } }
  const o = strike(W, u, best, best, 1, false, { mul: FL.backMul || 0.6, tag: best.side === F.side ? '돌아오는 철퇴 (오사)' : '돌아오는 철퇴', wk: '둔기' });
  if (best.side === F.side) L(W, { k: 'flailFF', a: u.i, b: best.i, back: true, vis: true });
  else if (o && !o.block && best.alive && W.rand() < (FL.backDown != null ? FL.backDown : 0.35)){ if (best.kb && best.kb.by === u.i) best.kb = null; if (!best.kb) knockDown(W, best, 0.9, u.i, '돌아오는 철퇴에 걸려 넘어짐'); }   /* 무기의 밀침 대신 그 자리에 */
  F.vx *= 0.7; F.vy *= 0.7;
}
// 회전 투척이 날아감: 길에 닿는 모두를 한 번씩 (동료도 · 던진 이는 빼고) · 바위에 막히거나 rng 칸을 가면 그 자리에 떨어짐 (주인은 그대로 — 주우러 옴)
function stepSpins(W, dt){
  for (const S of W.spins){ if (S.done) continue; let mv = S.v * dt;
    while (mv > 1e-6 && !S.done){ const st = Math.min(0.25, mv, S.left); mv -= st; const nx = S.x + S.dx * st, ny = S.y + S.dy * st;
      if (rock(W.map, nx, ny) || nx < 0.3 || ny < 0.3 || nx > W.map.W - 0.3 || ny > W.map.H - 0.3){ S.done = true; break; }
      S.x = nx; S.y = ny; S.left -= st; if (S.left <= 1e-6) S.done = true;
      const by = W.units[S.by];
      for (const e of W.units){ if (!e.alive || e.i === S.by || S.hit.includes(e.i) || Math.hypot(e.x - S.x, e.y - S.y) > S.w + e.r) continue; S.hit.push(e.i);
        if (S.boulder){ const o = strike(W, by, e, e, 1, false, { mul: S.mul, tag: '날아온 바위', wk: '둔기' }); if (o && e.alive && e.kb && e.kb.by === by.i) e.kb = null; if (e.alive && !e.kb) shove(W, by, e, S.kb * (o && o.block ? 0.6 : 1), S.dx, S.dy, { tag: '바위에 맞아 날아감', mass: 300, fix: true }); S.done = true; break; }   /* v8.7.4 바위던지기 — 처음 닿는 몸 */
        const o = strike(W, by, e, e, 1, !!S.wave, { mul: S.mul * (S.wave ? 1 : Math.max(0.55, 1 - 0.15 * (S.hit.length - 1))), tag: S.wave ? '피의 검기' : '회전하는 도끼', wk: S.wave ? '마법' : '날붙이', noFire: true, grab: !S.wave });   /* v8.7.3 도끼는 몸으로 받는 일격 (화살처럼 박혀 멈추지 않음) · 뒤로 갈수록 약하게 */
        if (S.wave){ if (o && !o.block && e.alive && by) burnOn(W, e, { i: by.i, fire: Math.max(by.fire || 0, 2) }, S.burn || 1, !!(e.gear || {})['몸']); if (S.hit.length >= (S.pierce || 2)){ S.done = true; break; } }   // v7.22.3 검기는 pierce 명까지 · 화상
        else if (e.alive && !e.kb && !(o && o.block)) shove(W, by, e, S.kb, S.dx, S.dy, { tag: '도끼에 쓸려 나감', mass: thrownMass(W, by), wn: S.it && (S.it.label || S.it.name) }); } }
    if (S.done && S.boulder){ L(W, { k: 'boulderEnd', a: S.by, b: S.hit.length ? S.hit[0] : null, x: +S.x.toFixed(1), y: +S.y.toFixed(1), vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: S.x, y: S.y, s: '쾅!', c: 'd', t0: W.t }); }   /* v8.7.4 */
    else if (S.done && S.wave) L(W, { k: 'waveEnd', a: S.by, n: S.hit.length, vis: true });
    else if (S.done){ const p = freeSpot(W, S.x, S.y, 0.15) || { x: S.x, y: S.y }, it = { id: (W.itemN = (W.itemN || 0) + 1), ...S.it, k: 'weapon', x: +p.x.toFixed(2), y: +p.y.toFixed(2), owner: S.by, t: W.t, how: 'spin' };
      W.items.push(it); L(W, { k: 'spinDrop', a: S.by, n: S.hit.length, name: it.name, label: it.label, x: it.x, y: it.y, vis: true }); } }
  W.spins = W.spins.filter(S => !S.done);
}
function startSpec(W, u, t, k, why){
  const S = SPR(W, k), x = specOf(u, k), wind = (S.wind || 0.5) * fatMul(W, u, 'wind');
  u.act = { k: 'spec', s: k, b: t ? t.i : null, phase: 'wind', t0: W.t, end: W.t + wind, why: why || x.name, ...(k === 'sweep' || k === 'hurl' ? { a0: (u.face || 0) + Math.PI } : {}), ...(KAR_TG.includes(k) ? karAim(W, u, t, k) : {}) };   /* v8.7.8 카리우스 · 앞차기: 겨눈 방향 · 자리는 처음에 정함 (보고 피할 수 있음) */ x.cdT = W.t + (S.cd || 5); stop(u); u.waitT = 0;   /* v7.24.4 머리 위로 돌리기 시작 각 */
  if (t) u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  setMood(W, u, x.name, t ? t.i : null);
  L(W, { k: 'wind', a: u.i, b: t ? t.i : null, spec: k, w: x.name, end: +(W.t + wind).toFixed(2), why: why || '', hid: u.side === 1 && !u.seenBy });
  if (W.fxOn && t) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind });
  return true;
}
function resolveSpec(W, u){
  const A = u.act, k = A.s, S = SPR(W, k), t = A.b != null ? W.units[A.b] : null;
  if (GW_K.includes(k)){ gwResolve(W, u, A, S, t); return; }   /* v8.7.8 굿윌 */
  if (KAR_K.includes(k)){ karResolve(W, u, A, S, t); return; }   /* v8.7.8 카리우스 */
  if (k === 'tear' && A.phase === 'run'){ tearDone(W, u, A); return; }   /* v8.7.4 잡아찢기 — 끝까지 쥠 */
  if (A.phase !== 'wind'){ u.act = null; return; }
  A.phase = 'rec'; A.end = W.t + (S.rec || 0.5); A.t1 = W.t; u.atkT = W.t;
  if (k === 'tear'){   // v8.7.4 잡아찢기 (J22): 손 닿는 상대를 붙잡음 (몸을 비틀어 피할 수 있음) — 초대형은 못 쥠 · 공중은 못 쥠
    if (!t || !t.alive || t.down){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    if (gap(u, t) > (S.rng || 0.6) + 0.3){ L(W, { k: 'miss', a: u.i, b: t.i, why: '손이 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); return; }
    if ((SIZE_RANK[sizeOf(t)] || 0) >= SIZE_RANK['초대형'] || (t.act && t.act.k === 'leap')){ L(W, { k: 'miss', a: u.i, b: t.i, why: (t.act && t.act.k === 'leap') ? '공중 — 쥐지 못함' : '너무 커서 쥐지 못함', spec: k }); return; }
    if (t.side !== u.side && evadeMelee(W, t, u)) return;
    A.phase = 'run'; A.end = W.t + (S.hold || 2.2); A.held = t.i; A.dmg = 0; t.heldBy = u.i; interrupt(W, t, '붙잡혀 준비가 끊김'); stop(t); t.burst = null; flailDrop(W, t, '붙잡힘');
    L(W, { k: 'tearGrab', a: u.i, b: t.i, sec: S.hold || 2.2, vis: u.side === 0 || t.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '붙잡힘!', c: 'd', t0: W.t }); return;
  }
  if (k === 'akick'){   // v8.7.8 앞차기 (어퐁 — 그림 '높이 앞차기'): 붙은 적을 차 밀어냄 · 휘청 (막으면 자세가 깎이고 덜 밀림)
    if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    if (gap(u, t) > u.rng + (S.reach || 0.5)){ L(W, { k: 'miss', a: u.i, b: t.i, why: '발이 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); return; }
    if (t.side !== u.side && evadeMelee(W, t, u)) return;
    const o = strike(W, u, t, t, 1, false, { mul: S.mul || 1.2, wk: '둔기', tag: '앞차기' }); if (o && t.alive && t.kb && t.kb.by === u.i) t.kb = null;
    if (o && o.block && t.alive){ t.post -= S.post || 35; if (t.post <= 0){ t.post = 0; t.brokenT = W.t + W.rules.breakTime; } }
    if (t.alive && !t.kb) shove(W, u, t, (S.push || 1.5) * (o && o.block ? 0.6 : 1), t.x - u.x, t.y - u.y, { tag: '앞차기에 밀려남', how: 'kick' });
    if (t.alive && o && !o.block) stun(W, t, S.stun || 0.5, u.i);
    L(W, { k: 'akick', a: u.i, b: t.i, block: !!(o && o.block), vis: u.side === 0 || t.side === 0 || !!u.seenBy }); return;
  }
  if (k === 'kick'){   // v8.7.4 딥 킥 (J22): 손 닿는 상대를 차 날림 (둔기 · 막으면 덜 날아감) — 날아간 몸이 볼링 핀처럼 둘레를 쓰러뜨림
    if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    if (gap(u, t) > u.rng + 0.45){ L(W, { k: 'miss', a: u.i, b: t.i, why: '발이 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); return; }
    if (t.side !== u.side && evadeMelee(W, t, u)) return;
    const o = strike(W, u, t, t, 1, false, { mul: S.mul || 0.9, wk: '둔기', tag: '딥 킥' }); if (o && t.alive && t.kb && t.kb.by === u.i) t.kb = null;
    if (t.alive && !t.kb) shove(W, u, t, (S.kb || 2.2) * (o && o.block ? 0.6 : 1), t.x - u.x, t.y - u.y, { tag: '딥 킥에 날아감', how: 'kick' });
    L(W, { k: 'kick', a: u.i, b: t.i, vis: u.side === 0 || t.side === 0 || !!u.seenBy }); return;
  }
  if (k === 'stone'){   // v8.7.4 방어모드 (J22 · 3D 바위 갑피): t 초 — 받는 피해 1 · 걸음 × slow · 치지 않음
    u.stoneT = W.t + (S.t || 5); u.act = null; L(W, { k: 'stoneOn', a: u.i, sec: S.t || 5, vis: u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '방어모드', c: 'b', t0: W.t }); return;
  }
  if (k === 'boulder'){   // v8.7.4 바위던지기 (J22 — 대포): 둘레 바위를 뜯어 던짐 — 곧게 날아가 처음 닿는 몸 (동료도) 을 치고 크게 날려 보냄 · 바위에 닿으면 부서짐
    const tx = t && t.alive ? t.x : u.x + Math.cos(u.face || 0), ty = t && t.alive ? t.y : u.y + Math.sin(u.face || 0), d = Math.hypot(tx - u.x, ty - u.y) || 1, dx = (tx - u.x) / d, dy = (ty - u.y) / d;
    (W.spins || (W.spins = [])).push({ boulder: true, by: u.i, side: u.side, x: u.x + dx * (u.r + 0.3), y: u.y + dy * (u.r + 0.3), dx, dy, v: S.v || 14, left: S.rng || 10, w: S.w || 0.6, mul: S.mul || 1.6, kb: S.kb || 1.6, hit: [], t0: W.t });
    u.fg = u.face = Math.atan2(dy, dx); L(W, { k: 'boulder', a: u.i, b: t ? t.i : null, vis: true }); return;
  }
  if (k === 'pb'){   // 영거리 사격: 특수탄 한 발 · 샷건 (총성) · 크게 날려 보냄
    if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    if (gap(u, t) > (S.rng || 2.4) + 0.3){ L(W, { k: 'miss', a: u.i, b: t.i, why: '샷건이 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); return; }
    u.shells = Math.max(0, (u.shells || 0) - 1); { const a0 = u.ammo, m0 = u.mag, l0 = u.loud; u.loud = true; fire(W, u); u.ammo = a0; u.mag = m0; u.loud = l0; }
    { const p = t.side !== u.side ? evadeP(W, t, u, 'shot', { sp: 60 }) : 0; if (p && W.rand() < p){ evaded(W, t, u, 'shot', '영거리 샷건을 비켜 섬', p); L(W, { k: 'pb', a: u.i, b: t.i, left: u.shells, miss: true, vis: true }); return; } }   /* v7.25.0 총구를 보고 비킴 (세자르 · 회피 높은 몸) */
    const w0 = u.weaponNow; u.weaponNow = '샷건'; const o = strike(W, u, t, t, 1, true, { mul: S.mul || 2.6, tag: '샷건 영거리 사격' }); u.weaponNow = w0;
    if (o && t.alive && !t.kb) shove(W, u, t, (S.kb || 1) * (o.block ? 0.5 : 1), t.x - u.x, t.y - u.y, { tag: '샷건에 날아감', mass: (W.rules.shove || {}).proj || 80, fix: true });
    L(W, { k: 'pb', a: u.i, b: t.i, left: u.shells, vis: true }); return;
  }
  if (k === 'sweep'){   // v7.24.4 철퇴 후리기: 모음이 끝나면 사슬을 R 만큼 풀어 한 바퀴 (stepSweep) — 머리 위로 돌던 각에서 이어 시계방향으로
    let R = Math.max(S.rMin || 1.2, Math.min(S.rMax || 2.6, A.R || S.r || 1.9)); { const w0 = S.w || 0.3, fo = W.units.filter(e => e.alive && e.side !== u.side), inR = fo.some(e => dist(u, e) - e.r <= R + w0), out = fo.filter(e => dist(u, e) - e.r > R + w0 && dist(u, e) - e.r <= R + w0 + 0.4); if (!inR && out.length) R = Math.min(R + 0.4, Math.min(...out.map(e => dist(u, e) - e.r - w0)) + 0.05); }   /* v8.7.3 밀려난 적을 0.4M 까지 따라감 */
    A.R = R; A.phase = 'swing'; A.t1 = W.t; A.ang0 = A.angP = A.ang = (A.a0 != null ? A.a0 : (u.face || 0) + Math.PI) + (W.t - A.t0) * (S.ws || 13); A.hit = []; A.n = 0; A.end = W.t + (S.spin || 0.45) + 0.3;
    L(W, { k: 'flailSpin', a: u.i, R: +R.toFixed(2), a0: +A.ang0.toFixed(3), vis: u.side === 0 || !!u.seenBy }); return;
  }
  if (k === 'ward'){   // v7.19.2 역장: 시전자 둘레 r 칸 · t 초 · 상대 탄 n 발까지 막음 (시전자와 함께 움직임)
    (W.wards || (W.wards = [])).push({ by: u.i, side: u.side, r: S.r || 1.6, until: W.t + (S.t || 6), left: S.n || 3, n: S.n || 3 });
    L(W, { k: 'wardOn', a: u.i, n: S.n || 3, sec: S.t || 6, vis: u.side === 0 || !!u.seenBy }); return;
  }
  if (k === 'root'){   // v7.19.2 뿌리 벽: 찍은 자리에 시전자 → 자리 방향과 직각으로 len 칸 (바위처럼 못 지나감 · 탄 · 시야도 막음) — 솟는 칸의 적은 맞고 밀려남, 동료는 비켜 세움
    const px = A.px != null ? A.px : t ? t.x : u.x, py = A.py != null ? A.py : t ? t.y : u.y, dx0 = px - u.x, dy0 = py - u.y, l = Math.hypot(dx0, dy0) || 1, nx = -dy0 / l, ny = dx0 / l, n = Math.max(1, Math.round(S.len || 2)), cells = [];
    for (let i = 0; i < n * 2; i++){ const o = (i / (n * 2 - 1) - 0.5) * (n - 0.01), cx = Math.floor(px + nx * o), cy = Math.floor(py + ny * o); if (cx < 1 || cy < 1 || cx >= W.map.W - 1 || cy >= W.map.H - 1 || W.map.t[cy * W.map.W + cx] !== 0 || cells.some(c => c[0] === cx && c[1] === cy)) continue; cells.push([cx, cy]); }
    if (!cells.length){ L(W, { k: 'miss', a: u.i, why: '뿌리를 내릴 자리가 없음', spec: k }); return; }
    for (const e of W.units){ if (!e.alive) continue; const on = cells.find(c => Math.floor(e.x) === c[0] && Math.floor(e.y) === c[1] || Math.hypot(e.x - c[0] - 0.5, e.y - c[1] - 0.5) < 0.5 + e.r * 0.6); if (!on) continue;
      const ax = e.x - on[0] - 0.5, ay = e.y - on[1] - 0.5, al = Math.hypot(ax, ay) || 1, sx = ax / al || nx, sy = ay / al || ny;
      if (e.side !== u.side){ strike(W, u, e, e, 1, true, { mul: S.mul || 1.2, tag: '솟는 뿌리', wk: '둔기' }); if (e.alive && !e.kb) shove(W, u, e, S.kb || 0.8, sx, sy, { tag: '뿌리에 밀려남', mass: (W.rules.shove || {}).proj || 80, fix: true }); }
      else tryMove(W, e, on[0] + 0.5 + sx * (0.55 + e.r), on[1] + 0.5 + sy * (0.55 + e.r)); }
    const root = { id: (W.rootN = (W.rootN || 0) + 1), by: u.i, side: u.side, cells: cells.filter(c => !W.units.some(e => e.alive && Math.floor(e.x) === c[0] && Math.floor(e.y) === c[1])), hp: S.hp || 120, max: S.hp || 120 };
    for (const [cx, cy] of root.cells) W.map.t[cy * W.map.W + cx] = 3;
    (W.roots || (W.roots = [])).push(root); W.lightT = 0;
    L(W, { k: 'root', a: u.i, n: root.cells.length, x: +px.toFixed(1), y: +py.toFixed(1), vis: u.side === 0 || !!u.seenBy }); return;
  }
  if (k === 'blink'){   // v7.22.3 혈영보: 상대 등 뒤 (막힌 데면 옆 · 앞) 로 순간이동
    if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    const D0 = t.r + u.r + (S.behind || 0.4), f = t.face || 0, cand = [0, 0.45, 0.9].flatMap(dd => [f + Math.PI, f + Math.PI / 2, f - Math.PI / 2, f + Math.PI * 0.75, f - Math.PI * 0.75, f + Math.PI / 4, f - Math.PI / 4, f].map((a, j) => ({ j: dd ? 9 : j, x: t.x + Math.cos(a) * (D0 + dd), y: t.y + Math.sin(a) * (D0 + dd) }))).filter(p => p.x > u.r && p.y > u.r && p.x < W.map.W - u.r && p.y < W.map.H - u.r && !boxRock(W, p.x, p.y, u.r * 0.9) && !W.units.some(o => o.alive && o !== u && o !== t && Math.hypot(o.x - p.x, o.y - p.y) < o.r + u.r));
    if (!cand.length){ L(W, { k: 'miss', a: u.i, b: t.i, why: '나타날 자리가 없음', spec: k }); return; }
    const fx = u.x, fy = u.y, c = cand[0]; u.x = c.x; u.y = c.y; u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x); stop(u);   // 등 뒤 (j 0) → 옆 → 앞
    L(W, { k: 'blink', a: u.i, b: t.i, fx: +fx.toFixed(2), fy: +fy.toFixed(2), x: +u.x.toFixed(2), y: +u.y.toFixed(2), back: c.j === 0, vis: true });
    if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '혈영보', c: 'd', t0: W.t }); return;
  }
  if (k === 'pyre'){   // v7.22.3 혈염: 둘레 r 칸을 태움 (동료도) — 가까울수록 셈 · 화상
    const R2 = S.r || 3; let n = 0;
    for (const e of W.units){ if (!e.alive || e === u) continue; const d = dist(u, e); if (d > R2 + e.r) continue; n++; const f = 1 - Math.min(1, Math.max(0, d - e.r) / R2) * 0.5;
      const o = strike(W, u, e, e, 1, false, { mul: (S.mul || 1.3) * f, tag: '혈염', wk: '마법', noFire: true }); if (e.alive && !(o && o.block)) burnOn(W, e, u.fire ? u : { i: u.i, fire: 2 }, S.stacks || 2, !!(e.gear || {})['몸']); }
    L(W, { k: 'pyre', a: u.i, n, vis: true }); W.lightT = 0; if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '혈염!', c: 'd', t0: W.t }); return;
  }
  if (k === 'pool'){   // v7.22.3 핏빛 장판: 찍은 자리에 r 칸 · t 초
    const px = A.px != null ? A.px : t ? t.x : u.x, py = A.py != null ? A.py : t ? t.y : u.y;
    (W.pools || (W.pools = [])).push({ by: u.i, side: u.side, x: px, y: py, r: S.r || 2, until: W.t + (S.t || 6), tickT: W.t, t0: W.t });
    L(W, { k: 'pool', a: u.i, x: +px.toFixed(2), y: +py.toFixed(2), r: S.r || 2, sec: S.t || 6, vis: true }); return;
  }
  if (k === 'wave'){   // v7.22.3 피의 검기: 상대 쪽으로 곧게 날아감 (pierce 명까지 · 화상) — 무기가 준 열화판은 약함
    const x0 = specOf(u, 'wave') || {}, tx = t && t.alive ? t.x : u.x + Math.cos(u.face || 0), ty = t && t.alive ? t.y : u.y + Math.sin(u.face || 0), d = Math.hypot(tx - u.x, ty - u.y) || 1, dx = (tx - u.x) / d, dy = (ty - u.y) / d;
    (W.spins || (W.spins = [])).push({ wave: true, weak: !!x0.weak, by: u.i, side: u.side, x: u.x + dx * (u.r + 0.2), y: u.y + dy * (u.r + 0.2), dx, dy, v: S.v || 16, left: S.rng || 8, w: S.w || 0.45, mul: (S.mul || 1.6) * (x0.weak ? S.weak || 0.6 : 1), kb: 0, pierce: S.pierce || 2, burn: S.stacks || 1, hit: [], t0: W.t });
    L(W, { k: 'wave', a: u.i, b: t ? t.i : null, weak: !!x0.weak, vis: true }); return;
  }
  if (k === 'spin'){   // v7.22.2 회전 투척: 든 무기를 상대 쪽으로 던짐 — 직선으로 회전하며 베어 나감 (닿는 모두 · 동료도) · 끝에 떨어짐 · 던진 쪽은 맨손
    if (u.weaponGone || !u.weapon || ITEM_NATURAL.includes(u.weapon)){ L(W, { k: 'miss', a: u.i, why: '던질 무기가 없음', spec: k }); return; }
    const tx = t && t.alive ? t.x : u.x + Math.cos(u.face || 0), ty = t && t.alive ? t.y : u.y + Math.sin(u.face || 0), d = Math.hypot(tx - u.x, ty - u.y) || 1, dx = (tx - u.x) / d, dy = (ty - u.y) / d, H = heldItem(u);
    (W.spins || (W.spins = [])).push({ by: u.i, side: u.side, x: u.x + dx * (u.r + 0.2), y: u.y + dy * (u.r + 0.2), dx, dy, v: S.v || 13, left: S.rng || 9, w: S.w || 0.55, mul: S.mul || 1.8, kb: S.kb || 0.6, hit: [], it: { ...H, label: H.label || lootName(u, 'weapon', H.name) }, t0: W.t });
    u.weaponGone = true; u.weaponNow = '맨손'; u.rng = ((W.rules.weapons || {})['맨손'] || { rng: 0.3 }).rng + (u.reachX || 0); u.longReach = u.rng > 1; u.parry = false; if (!u.shield && !u.reflex) u.canGuard = false;
    L(W, { k: 'spin', a: u.i, b: t ? t.i : null, w: H.label || H.name, vis: true }); return;
  }
  if (k === 'hurl'){   // 휘둘러 치기: 머리 위로 돌리다 먼 상대를 후려침 — 머리 직격 확률 · 크게 날림
    if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    if (gap(u, t) > (S.rng || 3.6) + 0.3){ L(W, { k: 'miss', a: u.i, b: t.i, why: '철퇴가 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); return; }
    if (evadeMelee(W, t, u)) return;
    const o = strike(W, u, t, t, 1, false, { mul: S.mul || 2, headP: S.head != null ? S.head : 0.5, tag: '휘둘러 치기' });
    if (o && t.alive && !t.kb) shove(W, u, t, (S.kb || 1.6) * (o.block ? 0.5 : 1) * (u.strMul || 1), t.x - u.x, t.y - u.y, { tag: '철퇴에 날아감' });
    L(W, { k: 'hurl', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); return;
  }
}
// v7.24.4 철퇴 후리기의 한 바퀴: spin 초에 2π (시계방향) — 이번 틱에 공 (R) 과 사슬이 지난 각 안의 몸을 차례로. 막기 (방패 · 무구 확률) 에 성공하면 그 자리에서 튕기고 멈춤
// v8.7.3 철퇴 후리기 예고: 머리 위로 돌리는 동안 원 (휘두를 거리 + 공) 안의 동료는 보거나 가까우면 '!' 하고 원 밖으로 비켜섬 (제자리 명령 · 넘어진 이는 그대로)
function sweepWarn(W, u, A){
  const S = SPR(W, 'sweep'), R = Math.max(S.rMin || 1.2, Math.min(S.rMax || 2.6, A.R || S.r || 1.9)) + (S.w || 0.3); A.warned = A.warned || [];
  for (const e of W.units){ if (!e.alive || e === u || e.side !== u.side || e.summon === 'slime' || A.warned.includes(e.i) || e.down || e.kb || e.crawl || e.lie) continue;
    const d = dist(u, e); if (d - e.r > R + 0.25 || !(canSee(W, e, u) || d < 3)) continue; A.warned.push(e.i);
    if (e.order && e.order.k === 'hold') continue;
    const a = d > 0.05 ? Math.atan2(e.y - u.y, e.x - u.x) : W.rand() * 6.283, D = R + e.r + 0.5;
    let fx = Math.max(0.6, Math.min(W.map.W - 0.6, u.x + Math.cos(a) * D)), fy = Math.max(0.6, Math.min(W.map.H - 0.6, u.y + Math.sin(a) * D)); if (boxRock(W, fx, fy, e.r * 0.9)){ const q = freeSpot(W, fx, fy, e.r); if (q){ fx = q.x; fy = q.y; } }
    const ea = e.act; if (ea && !(ea.k === 'charge' && ea.phase === 'run') && ea.k !== 'leap' && ea.k !== 'dodge' && !(ea.k === 'spec' && ea.phase === 'swing')){ if (ea.k === 'skill' && ea.phase === 'tend') tendEnd(W, e, ea, '철퇴를 피함'); e.act = null; e.burst = null; }   // 곧 철퇴가 도니 하던 일을 놓고 비킴
    if (!e.act){ e.flee = { x: fx, y: fy, until: W.t + Math.max(0.6, A.end - W.t + 0.5), why: '철퇴 원 밖으로' }; }
    L(W, { k: 'sweepWarn', a: e.i, b: u.i, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.4, s: '!', c: 'g', t0: W.t }); }
}
// v8.7.3 큰 공격의 예고 (도끼 던지기 · 투창 조준 · 넓게 휘두르기): 범위 안에서 그것을 본 몸은 준비가 tg.left 초 넘게 남았으면 하던 짓 (돌진 · 도약 중이 아니면) 을 끊고 비킴 — 회피 등급 · 지침 · 무게로 성공률 · 머리 위 '!' (적 · 아군 같은 규칙)
const tgDodgeP = (W, e) => { const T = W.rules.tg || {}; return Math.max(0.1, Math.min(0.95, (T.p != null ? T.p : 0.55) * (e.ev || 1) * (e.exhausted ? 0.5 : e.tired ? 0.8 : 1) * ((e.mass || 62) > 150 ? 0.6 : 1) * (e.blind ? 0.3 : 1))); };
function tgTick(W){
  const T = W.rules.tg || {}, left = T.left != null ? T.left : 0.25;
  for (const a of W.units){ const A = a.act; if (!a.alive || !A || A.phase !== 'wind' || A.end - W.t < left) continue;
    const t = A.b != null ? W.units[A.b] : null; let Z = null;
    if (A.k === 'spec' && A.s === 'spin' && t){ const S = SPR(W, 'spin'); Z = { k: 'line', ang: Math.atan2(t.y - a.y, t.x - a.x), len: S.rng || 9, w: (S.w || 0.55) + 0.25, what: '날아올 도끼', foe: true }; }
    else if (A.k === 'throw' && t && t.side !== a.side){ Z = { k: 'one', b: t.i, ang: Math.atan2(t.y - a.y, t.x - a.x), what: isKnife(W, a) ? '단검 겨눔' : '투창 겨눔' }; }
    else if (A.k === 'spec' && A.s === 'boulder' && t){ const S = SPR(W, 'boulder'); Z = { k: 'line', ang: Math.atan2(t.y - a.y, t.x - a.x), len: S.rng || 10, w: (S.w || 0.6) + 0.25, what: '날아올 바위', foe: true }; }   /* v8.7.4 */
    else if (A.k === 'spec' && KAR_TG.includes(A.s) && t && t.side !== a.side){ Z = karTg(W, a, A, t); }   /* v8.7.8 카리우스 · 앞차기 (보고 피함) */
    else if (A.k === 'spec' && (A.s === 'tear' || A.s === 'kick') && t && t.side !== a.side){ Z = { k: 'one', b: t.i, ang: Math.atan2(t.y - a.y, t.x - a.x), what: A.s === 'tear' ? '붙잡으려는 손' : '딥 킥' }; }   /* v8.7.4 */
    else if (A.k === 'h2' && A.Z){ const Q = A.Z; Z = Q.sh === 'line' ? { k: 'line', ang: Q.ang, len: Q.len + 0.3, w: Q.w / 2 + 0.25, what: A.n, foe: true } : { k: 'fan', ang: Q.ang, arc: Q.arc / 2 + 0.15, R: Q.r + 0.3, what: A.n, foe: true }; }   /* v8.7.4 기술표 (몸 가운데부터) */
    else if (A.k === 'atk' && A.mode === 'sweep' && t){ const S = W.rules.sweep || {}; Z = { k: 'fan', ang: Math.atan2(t.y - a.y, t.x - a.x), arc: (S.arc || 65) * Math.PI / 180, R: a.rng + (S.reach || 0.35) + 0.3, what: '넓게 휘두르기' }; }
    if (!Z) continue;
    const seen = A.tgSeen || (A.tgSeen = []);
    for (const e of W.units){ if (!e.alive || e === a || seen.includes(e.i) || e.down || e.kb || e.crawl || e.lie || e.summon === 'slime' || W.t < (e.proneT || -9) || W.t < (e.stunT || -9)) continue;
      if ((Z.foe || Z.k === 'one') && e.side === a.side) continue;
      const dx = e.x - a.x, dy = e.y - a.y, d = Math.hypot(dx, dy), al = dx * Math.cos(Z.ang) + dy * Math.sin(Z.ang), lat = -dx * Math.sin(Z.ang) + dy * Math.cos(Z.ang);
      const inZ = Z.k === 'one' ? e.i === Z.b : Z.k === 'line' ? al > 0 && al < Z.len && Math.abs(lat) < Z.w + e.r : d - e.r < Z.R && angDiff(Math.atan2(dy, dx), Z.ang) < Z.arc + 0.25;
      if (!inZ) continue; seen.push(e.i);
      if (!aware(W, e, a) || (e.order && e.order.k === 'hold') || (W.duel && e.i === W.duel.me) || (e.act && ((e.act.k === 'charge' && e.act.phase === 'run') || e.act.k === 'leap' || e.act.k === 'dodge' || (e.act.k === 'spec' && e.act.phase !== 'wind')))) continue;   /* v8.7.3 링의 직접 조작은 그대로 */
      if (W.rand() >= tgDodgeP(W, e)){ L(W, { k: 'tgLate', a: e.i, b: a.i, what: Z.what, vis: e.side === 0 || !!e.seenBy }); continue; }
      const s = Z.k === 'fan' ? 0 : (lat >= 0 ? 1 : -1), D = Z.k === 'fan' ? Math.max(Z.R - d + e.r + 0.4, 0.8) : Math.max(0.9, (Z.w || 0.6) + e.r + 0.3 - Math.abs(lat)) + 0.2;
      const ox = Z.k === 'fan' ? dx / (d || 1) : -Math.sin(Z.ang) * s, oy = Z.k === 'fan' ? dy / (d || 1) : Math.cos(Z.ang) * s;
      let fx = Math.max(0.6, Math.min(W.map.W - 0.6, e.x + ox * D)), fy = Math.max(0.6, Math.min(W.map.H - 0.6, e.y + oy * D)); if (boxRock(W, fx, fy, e.r * 0.9)){ fx = Math.max(0.6, Math.min(W.map.W - 0.6, e.x - ox * D)); fy = Math.max(0.6, Math.min(W.map.H - 0.6, e.y - oy * D)); if (boxRock(W, fx, fy, e.r * 0.9)) continue; }
      const ea = e.act; if (ea){ if (ea.k === 'skill' && ea.phase === 'tend') tendEnd(W, e, ea, '피함'); e.act = null; e.burst = null; }
      e.flee = { x: fx, y: fy, until: A.end + 0.35, why: Z.what + ' — 피함' };
      L(W, { k: 'tgDodge', a: e.i, b: a.i, what: Z.what, vis: e.side === 0 || !!e.seenBy || a.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.45, s: '!', c: 'g', t0: W.t }); } }
  if (W.h2z && W.h2z.length) for (const Q of W.h2z){ if (W.t < Q.t0 || Q.at - W.t < left) continue; const by = W.units[Q.by], seen = Q.seen || (Q.seen = []);   /* v8.7.4 그림자 원: 바닥에 번진 원을 본 몸 (밝거나 · 시전자가 보이면) 은 원 밖으로 */
    for (const e of W.units){ if (!e.alive || e.side === Q.side || seen.includes(e.i) || e.down || e.kb || e.crawl || e.lie || e.summon === 'slime' || W.t < (e.proneT || -9) || W.t < (e.stunT || -9)) continue;
      const dx = e.x - Q.x, dy = e.y - Q.y, d = Math.hypot(dx, dy); if (d >= Q.r + 0.3) continue; seen.push(e.i);
      if (!(litAt(W, Q.x, Q.y) || (by && canSee(W, e, by))) || (e.order && e.order.k === 'hold') || (W.duel && e.i === W.duel.me) || (e.act && ((e.act.k === 'charge' && e.act.phase === 'run') || e.act.k === 'leap' || e.act.k === 'dodge' || (e.act.k === 'spec' && e.act.phase !== 'wind')))) continue;
      if (W.rand() >= tgDodgeP(W, e)){ L(W, { k: 'tgLate', a: e.i, b: Q.by, what: Q.n, vis: e.side === 0 || !!e.seenBy }); continue; }
      const a0 = d > 0.05 ? Math.atan2(dy, dx) : W.rand() * 6.283, D = Q.r - d + 0.45; let fx = Math.max(0.6, Math.min(W.map.W - 0.6, e.x + Math.cos(a0) * D)), fy = Math.max(0.6, Math.min(W.map.H - 0.6, e.y + Math.sin(a0) * D)); if (boxRock(W, fx, fy, e.r * 0.9)){ const q = freeSpot(W, fx, fy, e.r); if (!q) continue; fx = q.x; fy = q.y; }
      const ea = e.act; if (ea){ if (ea.k === 'skill' && ea.phase === 'tend') tendEnd(W, e, ea, '피함'); e.act = null; e.burst = null; }
      e.flee = { x: fx, y: fy, until: Q.at + 0.2, why: Q.n + ' — 피함' };
      L(W, { k: 'tgDodge', a: e.i, b: Q.by, what: Q.n, vis: e.side === 0 || !!e.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.45, s: '!', c: 'g', t0: W.t }); } }
}
function stepSweep(W, u, dt){
  const A = u.act, S = SPR(W, 'sweep'), R = A.R, el = (A.el = (A.el || 0) + dt), k1 = Math.min(1, el / (S.spin || 0.45)), a1 = A.ang0 + k1 * 2 * Math.PI, rp = A.angP - A.ang0, rn = a1 - A.ang0; A.angP = A.ang = a1;
  const L0 = W.units.filter(e => e.alive && e !== u && !A.hit.includes(e.i) && dist(u, e) - e.r <= R + (S.w || 0.3)).map(e => { let r = Math.atan2(e.y - u.y, e.x - u.x) - A.ang0; r = ((r % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); return { e, r }; }).filter(o => o.r > rp - 1e-9 && o.r <= rn).sort((p, q) => p.r - q.r);
  for (const { e, r } of L0){ A.hit.push(e.i); const a = A.ang0 + r, B = S.blk || {}, gs = e.side !== u.side && inGuard(W, e, u) ? (e.shield || e.armShield ? B.shield || 0.65 : e.parry ? B.weapon || 0.35 : 0) : 0;
    if (gs && W.rand() < gs){ strike(W, u, e, e, 1, false, { mul: S.mul || 1.6, tag: '철퇴 후리기', wk: '둔기' }); A.stop = e.i; A.ang = A.angP = a; A.phase = 'rec'; A.end = W.t + (S.rec || 0.6);   // 막힘 → 그 자리에서 튕기고 멈춤
      L(W, { k: 'flailSweep', a: u.i, n: A.n, stop: e.i, R: +R.toFixed(2), vis: u.side === 0 || !!u.seenBy || e.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y, s: '튕김!', c: 'g', t0: W.t }); return; }
    if (e.side !== u.side && evadeMelee(W, e, u)) continue;
    const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.6, tag: '철퇴 후리기', wk: '둔기', grab: true }); A.n++;
    if (o && e.alive && e.kb && e.kb.by === u.i) e.kb = null;   /* 무기의 기본 밀침 대신 후리기의 큰 밀침 */
    if (o && e.alive && !e.kb){ const big = (SIZE_RANK[sizeOf(e)] || 0) >= (SIZE_RANK['대형'] || 3) ? (S.big || 0.4) : 1, d = dist(u, e) || 1, ox = (e.x - u.x) / d, oy = (e.y - u.y) / d, tx = -Math.sin(a), ty = Math.cos(a);   // 바깥 + 도는 쪽으로 쓸려 나감
      shove(W, u, e, (S.kb || 1.6) * (u.strMul || 1) * big, ox * 0.75 + tx * 0.55, oy * 0.75 + ty * 0.55, { tag: '철퇴에 쓸려 나감' }); } }
  if (k1 >= 1){ A.phase = 'rec'; A.end = W.t + (S.rec || 0.6); L(W, { k: 'flailSweep', a: u.i, n: A.n, stop: null, R: +R.toFixed(2), vis: u.side === 0 || !!u.seenBy }); }
}
/* ---------- v8.7.8 감전 한 틀 (2D SHOCKS · applyShock 그대로): 1초마다 피해 × 중첩 (최대 max) · 새로 걸리면 중첩 +1 · 남은 초는 긴 쪽 · 센 쪽 이름으로 ----------
   예전엔 페이지의 적뢰 (run8_e jrShock) 만 따로 셈 — 이제 적뢰 (red · res …) 와 굿윌의 푸른 번개 (blue) 가 같은 틀 */
function zapOn(W, o, kind, src){
  const Z = W.rules.zap || {}, K = Z[kind]; if (!K || !o || !o.alive) return null; const s = o.zap;
  if (s && s.n > 0){ if (K[0] > ((Z[s.kind] || [0])[0])) s.kind = kind; s.st = Math.min(Z.max || 5, s.st + 1); s.n = Math.max(s.n, K[1]); }
  else o.zap = { kind, n: K[1], st: 1, next: W.t + 1, src: src ? src.i : o.i };
  const z = o.zap; if (z.st >= 3 || !s) L(W, { k: 'zap', a: src ? src.i : null, b: o.i, kind: z.kind, st: z.st, n: z.n, dps: K[0] * z.st, vis: o.side === 0 || !!o.seenBy || (src && src.side === 0) });
  return z;
}
function zapTick(W){
  const Z = W.rules.zap || {};
  for (const o of W.units){ const s = o.zap; if (!s) continue; if (!o.alive){ o.zap = null; continue; } if (W.t < s.next) continue;
    s.next = W.t + 1; s.n--; const K = Z[s.kind] || [5, 1], src = W.units[s.src] || o;
    applyDmg(W, src, o, Math.max(1, K[0] * s.st), { tag: '감전', dot: true, jrOwn: /red|res/.test(s.kind), ff: src.side === o.side });
    if (s.n <= 0 || !o.alive) o.zap = null; }
}
/* ---------- v8.7.8 굿윌 (명세 C5 — 2D 미궁 프롤로그 goodwillBrain · gwAct · GW 표 그대로) ----------
   맨손일 때만 (가장 셈) — 무기를 들면 보통 근접처럼 싸움 (기술 · 도약 없음). 평소 3 ~ 5칸에서 전기로 괴롭히며 상대의 옆 · 뒤 (사각) 로 팟팟 옮겨 다님 ·
   상대가 치려 하면 이미 뒤로 쓩 · 2.6초마다 등 뒤로 파고들어 한두 대 치고 빠짐 (상대가 휘청이면 한 대 더) · 기술은 대기 · 거리가 맞으면 무작위 (틈이면 거의 니킥 · 멀거나 뭉쳤으면 내려찍기 · 떨어져 있으면 딱).
   이 판에 맞춘 것: 도약은 0.16초 안에 몸이 옮겨 가는 짧은 순간이동 (그 사이 근접 · 탄을 피함) · 벽 너머로는 못 감 · 모양 · 막기 · 갑옷 · 급소는 이 판의 규칙 (strike) — 양쪽 같음 */
const GW_K = ['gpalm', 'knee', 'snap', 'snap3', 'gslam', 'rise'];
const gwOn = u => !!u.gwKit && !u.noArms && (unarmed(u) || u.weaponGone);
const gwKnown = (W, u) => W.units.filter(f => f.alive && !f.gone && !f.down && f.side !== u.side && (canSee(W, u, f) || (u.sense[f.i] && W.t - u.sense[f.i].t < 3)));
function gwFree(W, u, x, y){
  return x > u.r && y > u.r && x < W.map.W - u.r && y < W.map.H - u.r && !boxRock(W, x, y, u.r * 0.9) && fatClear(W.map, u.x, u.y, x, y, u.r * 0.6) && !W.units.some(o => o.alive && o !== u && !o.gone && Math.hypot(o.x - x, o.y - y) < o.r + u.r * 0.85);
}
// 노린 자 반대쪽 (조금 옆으로) L칸
function gwAway(W, u, o, L){
  const d = dist(u, o) || 1, nx = (u.x - o.x) / d, ny = (u.y - o.y) / d;
  for (const sd of [0, 0.6, -0.6, 1.2, -1.2]){ const c = Math.cos(sd), s = Math.sin(sd), dx = nx * c - ny * s, dy = nx * s + ny * c, x = u.x + dx * L, y = u.y + dy * L; if (gwFree(W, u, x, y)) return { x, y }; }
  return null;
}
// 사각: 노린 자의 옆 · 뒤 L칸 (back = 등 뒤 먼저 · 아니면 옆 뒤부터)
function gwBlind(W, u, t, L, back){
  const f = t.face || 0, side = Math.sign(Math.sin(Math.atan2(u.y - t.y, u.x - t.x) - f)) || (W.rand() < 0.5 ? 1 : -1);
  const angs = back ? [Math.PI, Math.PI * 0.75 * side, -Math.PI * 0.75 * side, Math.PI * 0.5 * side, -Math.PI * 0.5 * side] : [Math.PI * 0.75 * side, Math.PI * 0.5 * side, Math.PI, -Math.PI * 0.75 * side, -Math.PI * 0.5 * side];
  for (const a of angs){ const D0 = L + t.r + u.r, x = t.x + Math.cos(f + a) * D0, y = t.y + Math.sin(f + a) * D0; if (Math.hypot(x - u.x, y - u.y) > 0.6 && gwFree(W, u, x, y)) return { x, y }; }
  return null;
}
// 순간이동 도약 (0.16초): 그 사이 근접 · 탄을 피함 (evadeP)
function gwHop(W, u, p, why, t, then){
  if (!p || u.kb || prone(W, u) || W.t < (u.stunT || -9)) return false; const G = W.rules.gw || {};
  u.act = { k: 'gwHop', phase: 'run', t0: W.t, end: W.t + (G.hopT || 0.16), fx: u.x, fy: u.y, tx: p.x, ty: p.y, b: t ? t.i : null, then: then || null }; stop(u); u.waitT = 0;
  if (t) u.fg = Math.atan2(t.y - p.y, t.x - p.x);
  L(W, { k: 'gwHop', a: u.i, b: t ? t.i : null, d: +Math.hypot(p.x - u.x, p.y - u.y).toFixed(1), why: why || '', vis: u.side === 0 || !!u.seenBy });
  if (why) setMood(W, u, why, t ? t.i : null); if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t, gw: true });
  return true;
}
function gwHopStep(W, u){
  const A = u.act, q = Math.min(1, (W.t - A.t0) / Math.max(0.01, A.end - A.t0)); u.x = A.fx + (A.tx - A.fx) * q; u.y = A.fy + (A.ty - A.fy) * q;
  if (q < 1) return; u.act = null; const t = A.b != null ? W.units[A.b] : null; if (t && t.alive) u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x);
  if (A.then === 'atk' && t && t.alive && inReach(u, t)){ u.target = t; startAct(W, u, t, '등 뒤로 파고들어 침'); }
}
// 기술 고르기 (2D 무게 그대로): 내려찍기 (멀거나 뭉쳤으면 둘) · 손바닥 · 니킥 (틈이면 넷 · 멀면 둘) · 올려차기 · 딱 (멀면 둘) · 딱딱딱 (멀면 셋)
function gwSkill(W, u, t, d){
  const can = k => { const S = SPR(W, k); return specReady(W, u, k) && d <= (S.rng || 1.5) + 1e-6 && d >= (S.min || 0); };
  const near = W.units.filter(o => o.alive && o.side !== u.side && Math.hypot(o.x - t.x, o.y - t.y) < (SPR(W, 'gslam').r || 2.5)).length, open = gwOpen(W, t), O = [];
  if (can('gslam')) O.push('gslam', ...(near >= 2 || d >= 2.5 ? ['gslam'] : []));
  if (can('gpalm')) O.push('gpalm');
  if (can('knee')) O.push(...(open ? ['knee', 'knee', 'knee', 'knee'] : d >= 2.2 ? ['knee', 'knee'] : ['knee']));
  if (can('rise')) O.push('rise');
  if (can('snap') && canSee(W, u, t)) O.push('snap', ...(d >= 3 ? ['snap'] : []));
  if (can('snap3') && canSee(W, u, t)) O.push('snap3', ...(d >= 3 ? ['snap3', 'snap3'] : []));
  if (!O.length) return false;
  return gwStart(W, u, t, O[Math.floor(W.rand() * O.length)]);
}
const gwOpen = (W, t) => !!(t.act && t.act.phase === 'wind') || W.t < (t.stunT || -9) - 0.1 || prone(W, t);   // 틈 (공격 준비 중 · 휘청 · 넘어짐)
function gwStart(W, u, t, k, why){
  const S = SPR(W, k);
  if (k === 'gslam'){   // 뛰어올라 노린 자리로 날아가 내리꽂음 — 떠 있는 동안 무적
    const x = specOf(u, k); if (!x) return false; const pad = u.r + 0.2, m = W.map; let tx = Math.max(pad, Math.min(m.W - pad, t.x)), ty = Math.max(pad, Math.min(m.H - pad, t.y));
    const d0 = Math.hypot(tx - u.x, ty - u.y) || 1, back = Math.min(d0 - 0.01, t.r + u.r + 0.1); tx -= (tx - u.x) / d0 * back; ty -= (ty - u.y) / d0 * back;
    for (let i = 0; i < 6 && boxRock(W, tx, ty, u.r * 0.9); i++){ tx = u.x + (tx - u.x) * 0.8; ty = u.y + (ty - u.y) * 0.8; }
    if (boxRock(W, tx, ty, u.r * 0.9)) return false;
    u.act = { k: 'leap', phase: 'run', t0: W.t, end: W.t + (S.time || 0.55), fx: u.x, fy: u.y, tx, ty, dir: 'fwd', air: true, gslam: true, b: t.i, r: S.r || 2.5 };
    u.jrInv = W.t + (S.time || 0.55); u.saT = Math.max(u.saT || -9, u.jrInv); x.cdT = W.t + (S.cd || 7); stop(u); u.fg = u.face = Math.atan2(ty - u.y, tx - u.x);   // 떠 있는 동안 무적 · 슈퍼아머 (2D 그대로)
    L(W, { k: 'gslam', a: u.i, b: t.i, x: +tx.toFixed(2), y: +ty.toFixed(2), vis: u.side === 0 || !!u.seenBy || !!t.seenBy }); setMood(W, u, why || '내려찍기 — 뛰어오름', t.i);
    return true;
  }
  startSpec(W, u, t, k, why || SPEC_NM(k)); const A = u.act;
  if (k === 'gpalm'){ A.mx = t.x; A.my = t.y; if (W.fxOn) W.fx.push({ k: 'gwMark', x: t.x, y: t.y, t0: W.t, dur: S.wind || 0.45 }); }   // 노린 자리에 푸른 표식 — 그 사이 0.9칸 넘게 벗어나면 빗나감
  if (k === 'knee'){ const op = gwOpen(W, t); A.crit = W.rand() < (op ? (S.headP || 0.6) : 0.25); A.op = op;   // 빈틈이면 헤드샷 60%
    if (dist(u, t) < 4.2){ const p = gwAway(W, u, t, 1.4); if (p){ u.x = p.x; u.y = p.y; } }   // 반동을 위한 뒷걸음 (팟)
    if (op) L(W, { k: 'gwOpen', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); }
  return true;
}
// 맞힘 (이 판의 strike — 막기 · 갑옷 · 급소 그대로)
function gwHit(W, u, t, mul, ex){ if (!t || !t.alive) return null; return strike(W, u, t, t, 1, !!(ex && ex.far), { mul, wk: '마법', noFire: true, ...(ex || {}) }); }
function gwResolve(W, u, A, S, t){
  const k = A.s, vis = u.side === 0 || !!u.seenBy || !!(t && t.seenBy);
  if (k === 'snap3' && A.phase === 'run'){   // 딱딱딱: 약한 천둥 세 번 (gap 초 간격)
    if (t && t.alive && canSee(W, u, t)){ gwZap(W, u, t, false); if (!gwDodge(W, t, u)){ const o = gwHit(W, u, t, S.mul || 0.75, { far: true, noArmor: true, noWound: true, part: '몸통', tag: '딱딱딱 — 천둥' }); if (t.alive && !(o && o.block)){ zapOn(W, t, 'blue', u); stun(W, t, S.stun || 0.25, u.i); } } }
    A.left--; if (A.left > 0 && t && t.alive){ A.end = W.t + (S.gap || 0.22); return; }
    A.phase = 'rec'; A.end = W.t + (S.rec || 0.25); return;
  }
  if (A.phase !== 'wind'){ u.act = null; return; }
  A.phase = 'rec'; A.end = W.t + (S.rec || 0.3); A.t1 = W.t; u.atkT = W.t;
  if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
  const d = dist(u, t);
  if (k === 'gpalm'){   // 손바닥: 표식이 뜬 사이 벗어났으면 허공 — 굿윌이 빈틈 / 아니면 순간이동하듯 붙어 터트림 (붙잡힌 동안 경직 · 회피 · 막기 무시)
    const slip = Math.hypot(t.x - A.mx, t.y - A.my) > (S.slip || 0.9), tx = slip ? A.mx : t.x, ty = slip ? A.my : t.y, dd = Math.hypot(tx - u.x, ty - u.y) || 1, nx = (tx - u.x) / dd, ny = (ty - u.y) / dd;
    const p = { x: tx - nx * (t.r + u.r + 0.05), y: ty - ny * (t.r + u.r + 0.05) }; if (gwFree(W, u, p.x, p.y)){ if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t, gw: true }); u.x = p.x; u.y = p.y; }
    u.fg = u.face = Math.atan2(ty - u.y, tx - u.x);
    if (slip || gap(u, t) > 0.6){ L(W, { k: 'gwMiss', a: u.i, b: t.i, s: k, vis }); u.stunT = Math.max(u.stunT || -9, W.t + (S.miss || 0.9)); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '빗나감 — 빈틈!', c: 'v', t0: W.t }); return; }
    stun(W, t, 0.35, u.i); const o = gwHit(W, u, t, S.mul || 2.6, { grab: true, tag: '손바닥 — 붙잡아 터트림' });
    if (t.alive){ zapOn(W, t, 'blue', u); if (!t.kb) shove(W, u, t, S.kb || 1.2, t.x - u.x, t.y - u.y, { tag: '손바닥에 튕겨 나감' }); }
    L(W, { k: 'gwPalm', a: u.i, b: t.i, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '파직!', c: 'b', t0: W.t }); return;
  }
  if (k === 'knee'){   // 니킥: 보이지 않는 속도로 옆 · 뒤 (사각) 에 꽂힘 — 헤드샷 = 확정 치명 · 갑옷 무시 · 무게 600 아래는 넘어짐
    const f = t.face || 0, sd = Math.sign(Math.sin(Math.atan2(u.y - t.y, u.x - t.x) - f)) || 1, D0 = t.r + u.r + 0.05;
    let q = null; for (const a of [Math.PI * 0.6 * sd, Math.PI * 0.5 * sd, Math.PI, 0]){ const x = t.x + Math.cos(f + a) * D0, y = t.y + Math.sin(f + a) * D0; if (gwFree(W, u, x, y) || Math.hypot(x - u.x, y - u.y) < 0.3){ q = { x, y }; break; } }
    if (q && Math.hypot(q.x - u.x, q.y - u.y) <= (S.rng || 6) + 1){ if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t, gw: true }); u.x = q.x; u.y = q.y; }
    u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x);
    if (gap(u, t) > 0.7){ L(W, { k: 'miss', a: u.i, b: t.i, why: '니킥 — 닿지 않음', spec: k }); return; }
    if (t.side !== u.side && !A.crit && evadeMelee(W, t, u)) return;
    const o = gwHit(W, u, t, A.crit ? (S.head || 1.67) : (S.mul || 3), A.crit ? { crit: true, noArmor: true, headP: 1, grab: true, tag: '니킥 — 헤드샷' } : { tag: '니킥' });
    if (t.alive && !(o && o.block)){ stun(W, t, S.stun || 1, u.i); if (A.crit && (t.mass || 70) <= (S.downW || 600)) knockDown(W, t, S.down || 2.2, u.i, '니킥 헤드샷'); }
    L(W, { k: 'gwKnee', a: u.i, b: t.i, head: !!A.crit, op: !!A.op, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: A.crit ? '빠아악!!' : '빠악!', c: 'd', t0: W.t }); return;
  }
  if (k === 'snap' || k === 'snap3'){   // 딱 · 딱딱딱: 손가락을 튕기면 Z자 천둥이 노린 자에게 곧장 (막을 수 없음 · 보이는 상대만)
    if (!canSee(W, u, t) || d > (S.rng || 7) + 1){ L(W, { k: 'miss', a: u.i, b: t.i, why: '천둥이 닿지 않음 (안 보임)', spec: k }); return; }
    if (k === 'snap3'){ A.phase = 'run'; A.left = S.n || 3; A.end = W.t; return; }
    gwZap(W, u, t, true); if (gwDodge(W, t, u)) return; const o = gwHit(W, u, t, S.mul || 2.4, { far: true, noArmor: true, noWound: true, part: '몸통', tag: '딱 — 천둥' });
    if (t.alive && !(o && o.block)){ zapOn(W, t, 'blue', u); stun(W, t, S.stun || 0.5, u.i); } return;
  }
  if (k === 'rise'){   // 올려차기: 붙은 상대를 차올림 — 35% 잠깐 넘어짐
    if (gap(u, t) > (S.rng || 1.5) - t.r - u.r + 0.4){ L(W, { k: 'miss', a: u.i, b: t.i, why: '올려차기 — 닿지 않음', spec: k }); return; }
    if (t.side !== u.side && evadeMelee(W, t, u)) return;
    const o = gwHit(W, u, t, S.mul || 1.5, { tag: '올려차기' });
    if (t.alive && !(o && o.block) && W.rand() < (S.downP || 0.35) && (t.mass || 70) <= (S.downW || 600)) knockDown(W, t, S.down || 0.9, u.i, '올려차기');
    L(W, { k: 'gwRise', a: u.i, b: t.i, vis }); return;
  }
}
// 번개를 피함 (2D: 천둥은 원거리 공격 — 피할 수 있음 · 이 판에선 빠른 탄처럼 (빠를수록 덜 피함) · 세자르는 탄처럼 거의 다 피함) — 피하면 감전 · 경직 없음
function gwDodge(W, t, u){ if (!t || !t.alive || t.side === u.side) return false; const p = evadeP(W, t, u, 'shot', { sp: 28 }); if (!p || W.rand() >= p) return false; L(W, { k: 'evade', a: u.i, b: t.i, how: 'zap', why: '천둥을 피함', p: +p.toFixed(2), vis: t.side === 0 || !!t.seenBy || u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '회피!', c: 'w', t0: W.t }); return true; }
function gwZap(W, u, t, big){ if (W.fxOn) W.fx.push({ k: 'zbolt', x: t.x, y: t.y, t0: W.t, big: !!big, a: u.i }); L(W, { k: 'gwZap', a: u.i, b: t.i, big: !!big, vis: u.side === 0 || !!u.seenBy || !!t.seenBy }); }
// 내려꽂음: 둘레 r 칸의 적 모두 감전 + 경직 (막으면 경직은 없음) · 내리꽂는 순간 번개 한 줄기
function gslamHit(W, u, A){
  const S = SPR(W, 'gslam'), R = A.r || S.r || 2.5; let n = 0; u.jrInv = null;
  if (W.fxOn){ W.fx.push({ k: 'zbolt', x: u.x, y: u.y, t0: W.t, big: true, a: u.i }); W.fx.push({ k: 'quake', x: u.x, y: u.y, r: R, t0: W.t }); }
  for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || Math.hypot(e.x - u.x, e.y - u.y) > R + e.r * 0.5 || (e.act && e.act.k === 'leap')) continue;
    if (!losClear(W.map, u.x, u.y, e.x, e.y)) continue; n++; if (evadeMelee(W, e, u)) continue;   // 2D: 한 명씩 피할 수 있음
    const o = gwHit(W, u, e, S.mul || 1.6, { tag: '내려찍기' }); if (e.alive){ zapOn(W, e, 'blue', u); if (!(o && o.block)) stun(W, e, S.stun || 1.4, u.i); } }
  L(W, { k: 'gslamHit', a: u.i, n, r: R, vis: true });
}
// 두뇌 (2D goodwillBrain): 치고 빠지기 · 사각으로 옮겨 다님 · 틈이면 니킥 — 맨손일 때만 (무기를 들면 보통 근접)
function gwBrain(W, u, dt){
  if (!gwOn(u) || u.act || u.kb || prone(W, u) || W.t < (u.stunT || -9) || u.crawl || u.lie) return false;
  const G = W.rules.gw || {}, g = u.gw || (u.gw = { evadeT: -9, diveT: W.t + 1.5, circleT: W.t + (G.circle || 1.7), hits: 0, dive: false, atk0: u.atkT || -9 });
  const F = gwKnown(W, u); if (!F.length){ g.dive = false; return false; }
  let t = u.target && u.target.alive && F.includes(u.target) ? u.target : F.slice().sort((a, b) => dist(u, a) - dist(u, b))[0]; u.target = t; u.state = u.side ? 'hunt' : 'fight';
  const d = dist(u, t);
  // 상대가 칠 땐 이미 뒤에 (나를 노리고 준비 중인 근접 · 그 손 + 1.2칸 안)
  const thr = W.units.find(o => o.alive && o.side !== u.side && o.act && o.act.phase === 'wind' && o.act.b === u.i && !isFar(o) && gap(o, u) < (o.rng || 0.5) + 1.2);
  if (thr && W.t >= g.evadeT){ const p = gwAway(W, u, thr, G.hop || 2.8); if (p && gwHop(W, u, p, '치려는 상대에게서 쓩', t)){ g.evadeT = W.t + (G.evade || 0.55); g.dive = false; return true; } }
  // 한 대 쳤다: 육탄전도 마다하지 않음 (상대가 휘청이면 한 대 더) — 아니면 바로 사각으로 빠짐
  if ((u.atkT || -9) > g.atk0){ g.atk0 = u.atkT; g.hits++;
    if (W.t >= g.evadeT && (g.hits >= 2 || (!gwOpen(W, t) && W.rand() < 0.6))){ g.dive = false; g.hits = 0; g.diveT = W.t + (G.dive || 2.6); g.evadeT = W.t + 0.3;
      const p = gwBlind(W, u, t, 3.4, false) || gwAway(W, u, t, 3); if (p && gwHop(W, u, p, '치고 빠짐', t)) return true; } }
  if (W.rand() < dt * (G.skillP || 3) && gwSkill(W, u, t, d)) return true;   // 기술 (대기 · 거리)
  if (g.dive) return false;   // 파고드는 중: 기본 공격에 맡김
  if (W.t >= g.diveT && d < (G.diveD || 5.5) && canSee(W, u, t)){ g.dive = true; g.hits = 0; const p = gwBlind(W, u, t, 0.05, true); if (p && gwHop(W, u, p, '등 뒤로 파고듦', t, 'atk')) return true; return false; }
  if (d < (G.lo || 3) && W.t >= g.evadeT){ const p = gwAway(W, u, t, 2.6); if (p && gwHop(W, u, p, '거리를 벌림', t)){ g.evadeT = W.t + (G.evade || 0.55); return true; } }
  if (W.t >= g.circleT && d <= (G.hi || 5) + 1){ g.circleT = W.t + (G.circle || 1.7) * (0.7 + W.rand() * 0.6); const p = gwBlind(W, u, t, 2.4 + W.rand() * 1.2, false); if (p && gwHop(W, u, p, '사각으로 옮겨 다님', t)) return true; }
  if (d <= (G.hi || 5) + 0.5 && canSee(W, u, t)){ stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '중거리 — 간 보기', t.i); return true; }   // 3 ~ 5칸에서 기다리며 기술을 노림
  return false;   // 멀면 다가감 (보통 걸음)
}
// 스스로 쓰기 (적 · 아군 같은 판단 — 그 상황일 때만)
function specAuto(W, u, t, see){
  if (!u.spec || !u.spec.length || !t || !t.alive || !see || u.act) return false;
  if (apAuto(W, u, t)) return true;   /* v8.7.8 어퐁: 초돌진 · 앞차기 */
  if (u.karKit && karAuto(W, u, t)) return true;   /* v8.7.8 카리우스 (3D kariusThink 의 차례) */
  const g = gap(u, t), near = (r, same) => W.units.filter(e => e.alive && e !== u && (same ? e.side === u.side : e.side !== u.side) && dist(u, e) <= r + e.r).length;
  { const crowd = W.units.filter(e => e.alive && e.side !== u.side && gap(u, e) <= 1.2).length;   // v7.22.3 각혈의 기술 (갖춘 이는 누구나 같은 판단)
    if (specReady(W, u, 'pyre')){ const r = SPR(W, 'pyre').r || 3, fe = W.units.filter(e => e.alive && e.side !== u.side && dist(u, e) <= r + e.r).length, al = W.units.filter(e => e.alive && e !== u && e.side === u.side && dist(u, e) <= r + e.r).length; if (fe >= 2 && al === 0) return startSpec(W, u, null, 'pyre', '둘레를 피의 불길로 태움'); }
    if (specReady(W, u, 'blink')){ const B = SPR(W, 'blink');
      if (crowd >= 3){ const far = W.units.filter(e => e.alive && e.side !== u.side && canSee(W, u, e) && dist(u, e) >= (B.min || 2.5) && dist(u, e) <= (B.d || 9)).sort((a, b) => (isFar(b) - isFar(a)) || (dist(u, b) - dist(u, a)))[0]; if (far) return startSpec(W, u, far, 'blink', '둘러싼 무리를 빠져 먼 상대 뒤로'); }
      else if (g >= (B.min || 2.5) + 1.5 && g <= (B.d || 9)) return startSpec(W, u, t, 'blink', '상대 등 뒤로 순간이동'); }
    if (specReady(W, u, 'pool') && g >= 3 && g <= (SPR(W, 'pool').rng || 7)){ const near = W.units.filter(e => e.alive && e.side !== u.side && dist(e, t) <= 2).length; if (isFar(t) || near >= 2){ startSpec(W, u, t, 'pool', '핏빛 장판'); u.act.px = t.x + (t.vx || 0) * 0.5; u.act.py = t.y + (t.vy || 0) * 0.5; return true; } }
    if (specReady(W, u, 'wave')){ const P3 = SPR(W, 'wave'); if (g > u.rng + 1 && g <= (P3.rng || 8) - 0.5){ const d0 = dist(u, t) || 1, ex = u.x + (t.x - u.x) / d0 * (P3.rng || 8), ey = u.y + (t.y - u.y) / d0 * (P3.rng || 8); if (!W.units.some(e => e.alive && e !== u && e.side === u.side && segD(u, ex, ey, e) < (P3.w || 0.45) + e.r)) return startSpec(W, u, t, 'wave', '피의 검기'); } } }
  if (specReady(W, u, 'stone')){ const S5 = SPR(W, 'stone'); if (W.units.some(e => e.alive && !e.down && e.side !== u.side && gap(u, e) <= (S5.near || 4)) && W.rand() < (S5.p != null ? S5.p : 0.06)) return startSpec(W, u, null, 'stone', '방어모드');   /* v8.7.4 J22 */ }
  if (specReady(W, u, 'tear') && g <= (SPR(W, 'tear').rng || 0.6) && !t.down && (SIZE_RANK[sizeOf(t)] || 0) < SIZE_RANK['초대형'] && !(t.act && t.act.k === 'leap') && W.rand() < 0.3) return startSpec(W, u, t, 'tear', '붙잡아 찢음');   /* v8.7.4 J22 */
  if (specReady(W, u, 'kick') && g <= u.rng + 0.3){ const a0 = Math.atan2(t.y - u.y, t.x - u.x), row = W.units.some(e => e.alive && e !== t && e.side === t.side && dist(e, t) < 3.2 && angDiff(Math.atan2(e.y - t.y, e.x - t.x), a0) < 0.6); if (row || W.rand() < 0.08) return startSpec(W, u, t, 'kick', row ? '뒤의 무리 쪽으로 차 날림' : '차 날림'); }   /* v8.7.4 J22 */
  if (specReady(W, u, 'boulder')){ const B = SPR(W, 'boulder'); if (g >= (B.min || 3) && g <= (B.rng || 10) - 1){ const d0 = dist(u, t) || 1, ex = u.x + (t.x - u.x) / d0 * (B.rng || 10), ey = u.y + (t.y - u.y) / d0 * (B.rng || 10), fb = W.units.filter(e => e.alive && e !== u && segD(u, ex, ey, e) < (B.w || 0.6) + e.r).sort((p, q) => dist(u, p) - dist(u, q))[0]; if (fb && fb.side !== u.side) return startSpec(W, u, fb === t ? t : fb, 'boulder', fb === t ? '바위를 뜯어 던짐' : '길목의 상대에게 바위를 던짐'); } }   /* v8.7.4 J22 */
  if (specReady(W, u, 'quake')){ const Q = SPR(W, 'quake'), mn = Q.min || 3, mx = Q.d || 9;   // v7.22.2 도약 강타: 무기를 잃었으면 그 자리로 · 아니면 먼 상대 (무리면 한가운데) 에게
    if (u.weaponGone){ const it = (W.items || []).find(i => i.k === 'weapon' && i.own === ownKey(u)), di = it ? Math.hypot(it.x - u.x, it.y - u.y) : 0; if (it && di >= mn && di <= mx + 2 && startQuake(W, u, it.x, it.y, '무기를 주우러 도약')){ u.act.grab = it.id; return true; } }   // 무기를 주우러는 2칸 더
    if (W.units.filter(e => e.alive && e.side !== u.side && gap(u, e) <= 1.2).length >= 3){ const far = W.units.filter(e => e.alive && e.side !== u.side && canSee(W, u, e)).map(e => ({ e, d: dist(u, e) })).filter(o => o.d >= mn && o.d <= mx).sort((a, b) => (isFar(b.e) - isFar(a.e)) || (b.d - a.d))[0];   // 셋 넘게 둘러싸이면 먼 상대 (사수 먼저) 에게 박차고 나감
      if (far && startQuake(W, u, far.e.x, far.e.y, '둘러싼 무리를 박차고 먼 상대에게')) return true; }
    if (g >= mn && g <= mx){ const grp = W.units.filter(e => e.alive && e.side !== u.side && dist(e, t) <= 2.2 && canSee(W, u, e)), cx = grp.reduce((a, e) => a + e.x, 0) / (grp.length || 1), cy = grp.reduce((a, e) => a + e.y, 0) / (grp.length || 1), lead = 0.5;
      const px = grp.length >= 2 ? cx : t.x + (t.vx || 0) * lead, py = grp.length >= 2 ? cy : t.y + (t.vy || 0) * lead;
      if (Math.hypot(px - u.x, py - u.y) <= mx && startQuake(W, u, px, py, grp.length >= 2 ? '무리 한가운데로 도약 강타' : '먼 상대에게 도약 강타')) return true; } }
  if (specReady(W, u, 'spin') && !u.weaponGone){ const P2 = SPR(W, 'spin'), R2 = P2.rng || 9;   // v7.22.2 회전 투척: 줄지은 상대 (둘 넘게) · 또는 도약 강타를 못 쓸 때 먼 상대 — 동료가 길에 있으면 안 함
    if (g > u.rng + 1 && g <= R2 - 1){ const d0 = dist(u, t) || 1, ex = u.x + (t.x - u.x) / d0 * R2, ey = u.y + (t.y - u.y) / d0 * R2, on = W.units.filter(e => e.alive && e !== u && segD(u, ex, ey, e) < (P2.w || 0.55) + e.r);
      const nf = on.filter(e => e.side !== u.side).length, na = on.filter(e => e.side === u.side).length;
      if (!na && (nf >= 2 || (nf >= 1 && !specReady(W, u, 'quake')))) return startSpec(W, u, t, 'spin', nf >= 2 ? '줄지은 상대에게 도끼를 던짐' : '먼 상대에게 도끼를 던짐'); } }
  if (specReady(W, u, 'flip')){ const F = SPR(W, 'flip');
    if (u.hp / u.max < 0.35 && g < u.rng + 0.4 && !isFar(t) && startFlip(W, u, t, true)) return true;
    if (g > u.rng + 0.6 && g <= (F.d || 3.2) && !inGuard(W, t, u) && startFlip(W, u, t, false)) return true; }
  if (specReady(W, u, 'pb') && g <= (SPR(W, 'pb').rng || 2.4) - 0.4 && !isFar(t)) return startSpec(W, u, t, 'pb', '바싹 붙은 상대에게 샷건');
  if (specReady(W, u, 'sweep') && !(flailOf(W, u) && tightAt(W, u))){ const S3 = SPR(W, 'sweep'),   /* v8.7.5 좁은 골목엔 돌리지 못함 */ fs = W.units.filter(e => e.alive && e.side !== u.side && dist(u, e) - e.r <= (S3.rMax || 2.6)).map(e => dist(u, e));   /* v7.24.4 둘레의 적을 덮는 거리 */
    if (fs.length >= 2){ const r = Math.max(S3.rMin || 1.2, Math.min(S3.rMax || 2.6, Math.max(...fs) - 0.1)), fe = near(r, false), al = near(r, true); if ((fe >= 2 && al === 0) || (fe >= 3 && al <= 1)){ startSpec(W, u, null, 'sweep', '둘러싼 적을 쓸어 버림'); u.act.R = r; return true; } } }
  if (specReady(W, u, 'hurl')){ const H = SPR(W, 'hurl'); if (g > u.rng + 0.3 && g <= (H.rng || 3.6)){ const fb = firstOnLine(W, u, t, u, knows(W, u)); if (fb === t || fb.side !== u.side) return startSpec(W, u, t, 'hurl', '먼 상대를 후려침'); } }
  if (specReady(W, u, 'ward')){ const r = SPR(W, 'ward').r || 1.6; if (W.units.some(a => a.alive && a.side === u.side && dist(u, a) <= r && W.t - (a.farHitT == null ? -9 : a.farHitT) < 1.5)) return startSpec(W, u, null, 'ward', '사격받는 동료를 감쌈'); }   // v7.19.2
  if (specReady(W, u, 'root') && !isFar(t) && g > 1.6 && g < 4.5 && (t.vx || 0) * (u.x - t.x) + (t.vy || 0) * (u.y - t.y) > 0){ const d = dist(u, t) || 1; startSpec(W, u, null, 'root', '다가오는 상대 앞에 뿌리 벽'); u.act.px = u.x + (t.x - u.x) / d * 1.5; u.act.py = u.y + (t.y - u.y) / d * 1.5; return true; }   // v7.19.2
  if (specReady(W, u, 'head') && !u.headMark && g <= u.rng + 1.5 && (t.max >= 150 || t.hp > 120)){ u.headMark = { b: t.i, until: W.t + (SPR(W, 'head').win || 4) }; L(W, { k: 'specArm', a: u.i, b: t.i, s: 'head', vis: u.side === 0 || !!u.seenBy }); }
  return false;
}
/* ---------- v8.7.4 3D 보스 기술표 (h2 — 2기 훈련장의 기술을 그대로) ----------
   설계 p.h2 = 기술표 이름 (망각 'mangak'). 3D 처럼: 가장 가까운 아는 상대를 노림 · 기술은 차례대로 (대기가 끝났고 · 거리가 맞는 첫 것) 매 순간 dt × 4 확률로 ·
   아니면 기본 일격 (몸 가운데부터 range 칸 부채꼴 — range × 0.8 밖이거나 안 보이면 range × 0.7 까지 다가감) · 체력이 phase.at 아래면 2페이즈 (공격 × k · 속력 × spd · 대기 모두 풂).
   모양은 3D 와 같이 몸 가운데부터 — 부채꼴: 가운데에서 r + 상대 몸 × 0.6 · 각 arc/2 + 0.15 / 줄: 길이 len · 폭 w / 원 (그림자): 가운데에서 r. 예고 동안 모양이 보이고, 끝나는 순간 그 안의 상대가 맞음 (공중 · 쓰러진 이는 빼고).
   피해 · 막기 · 갑옷 · 치명 · 측면 · 급소는 이 판의 규칙 (strike) — 양쪽 같음. 밀침은 3D 가 따로 정한 것 (기본 일격 kb 3) 만 × H2KB 의 힘 (사람 70kg 이 3D 와 같은 거리만큼 날아감 — 3D 의 기본 0.8 은 이 판의 보통 일격처럼 밀지 않음).
   이 판에 맞춘 것 (3D 와 다른 곳): 몸이 겹치지 않으므로 어슬렁 포위 (3D: 가운데 1.4칸 — 몸 밑으로 파고든 상대) 는 몸에 바싹 붙은 상대 (0.3칸) 에게 · 줄 · 부채꼴 · 원은 벽 너머를 치지 않음 · 기술은 보이는 상대에게만. */
const H2K = {
  mangak: { ml: { range: 5.5, mul: 1.2, wind: 0.8, cd: 1.8, arc: 2.0, kb: 3.0 },
    sk: [{ id: 'rush', n: '돌진 할퀴기', type: 'dash', cd: 8, use: 8, len: 8, w: 2.4, mul: 1.6, trip: true, wind: 0.9 },
      { id: 'maw', n: '망각의 아가리', type: 'slash', cd: 12, use: 5.5, r: 5.5, arc: 1.6, mul: 2.4, stun: 1.5, wind: 1.3, say: '(아가리가 네 갈래로 벌어진다)' },
      { id: 'prowl', n: '어슬렁 포위', type: 'backstep', cd: 9, use: 3, len: 4 },
      { id: 'pounce', n: '갈퀴 덮치기', type: 'dash', cd: 12, use: 10, len: 10, w: 3, mul: 1.8, trip: true, wind: 0.8 },
      { id: 'shadow', n: '망각의 그림자', type: 'rain', cd: 14, use: 10, cnt: 6, r: 1.5, spread: 4, mul: 0.8, delay: 0.9, gap: 0.22, ph: 2 }],
    phase: { at: 0.5, k: 1.2, spd: 1.15, say: '(망각의 눈이 붉게 타오른다)' } } };
const H2KB = 0.5;   // 3D 밀침 → 이 판의 밀치는 힘
const h2Kit = u => (u && u.h2 && H2K[u.h2.k]) || null;
const h2Ml = K => ({ id: 'ml', n: '할퀴기', type: 'slash', r: K.ml.range, arc: K.ml.arc, mul: K.ml.mul, wind: K.ml.wind, cd: K.ml.cd, kb: K.ml.kb });
// 모양 안인가 (몸 가운데 Z.x, Z.y 에서) — 벽 너머는 아님
function h2In(W, Z, e){
  const dx = e.x - Z.x, dy = e.y - Z.y, rr = e.r * 0.6;
  if (Z.sh === 'circ'){ if (Math.hypot(dx, dy) >= Z.r) return false; }
  else if (Z.sh === 'fan'){ const d = Math.hypot(dx, dy); if (d > Z.r + rr || (d >= 0.5 && angDiff(Math.atan2(dy, dx), Z.ang) > Z.arc / 2 + 0.15)) return false; }
  else { const c = Math.cos(Z.ang), s = Math.sin(Z.ang), al = dx * c + dy * s, pp = -dx * s + dy * c; if (al < -rr || al > Z.len + rr || Math.abs(pp) > Z.w / 2 + rr) return false; }
  return losClear(W.map, Z.x, Z.y, e.x, e.y);
}
const h2Hittable = (u, e) => e.alive && !e.gone && !e.down && e !== u && e.side !== u.side && !(e.act && e.act.k === 'leap');   // 공중 (도약 · 공중제비 · 도약 강타 중) 은 바닥 공격을 피함
// 쓸 기술 (3D h2Pick): 차례대로 — 대기 중 · 2페이즈 기술은 건너뜀 · 어슬렁 포위는 몸에 바싹 붙은 상대에게만 · 나머지는 거리 (몸 가운데끼리) 가 use 안
function h2Pick(W, u, t, d){
  const K = h2Kit(u); if (!K) return null;
  for (const s of K.sk){
    if (W.t < (u.h2.cd[s.id] != null ? u.h2.cd[s.id] : -9)) continue;
    if (s.ph && !u.h2.ph) continue;
    if (s.type === 'backstep'){ if (gap(u, t) < 0.3) return s; continue; }
    if (d <= s.use && d >= (s.min || 0)) return s;
  }
  return null;
}
// 몸이 그 쪽으로 len 까지 옮겨 갈 수 있는 거리 (벽 앞에서 멈춤 — 3D 의 잔상 이동)
function h2Reach(W, u, x0, y0, ang, len){ const c = Math.cos(ang), s = Math.sin(ang); let k = 0; for (; k + 0.3 <= len + 1e-6; k += 0.3) if (boxRock(W, x0 + c * (k + 0.3), y0 + s * (k + 0.3), u.r * 0.9)) break; return k; }
function h2Ghost(W, u, x, y){ const fx = u.x, fy = u.y; if (Math.hypot(x - fx, y - fy) < 0.05) return; u.x = x; u.y = y; stop(u); if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: fx, y: fy, t0: W.t }); }
function h2Cast(W, u, s, t){
  const K = h2Kit(u); if (!K || !t) return false;
  const d = dist(u, t), ang = Math.atan2(t.y - u.y, t.x - u.x), ml = s.id === 'ml', vis = u.side === 0 || !!u.seenBy;
  if (ml) u.h2.mlT = W.t + s.cd; else u.h2.cd[s.id] = W.t + s.cd;
  stop(u); u.waitT = 0; u.fg = u.face = ang; u.target = t; u.state = u.side ? 'hunt' : 'fight';
  if (!ml) L(W, { k: 'h2', a: u.i, b: t.i, s: s.id, n: s.n, say: s.say || null, vis });
  if (W.fxOn && s.say) W.fx.push({ k: 'say', a: u.i, s: s.say, t0: W.t });
  setMood(W, u, s.n, t.i);
  if (s.type === 'backstep'){   // 3D: 상대에게서 len 물러남 (보스는 잔상으로 곧장)
    const a = Math.atan2(u.y - t.y, u.x - t.x), k = h2Reach(W, u, u.x, u.y, a, s.len); h2Ghost(W, u, u.x + Math.cos(a) * k, u.y + Math.sin(a) * k);
    u.act = { k: 'h2', s: s.id, n: s.n, type: s.type, b: t.i, phase: 'rec', t0: W.t, end: W.t + 0.35 };
    L(W, { k: 'h2Step', a: u.i, b: t.i, n: s.n, d: +k.toFixed(1), vis }); return true; }
  if (s.type === 'rain'){   // 3D: 표적 자리에 하나 · 나머지는 그 둘레 spread 안 아무 데 — gap 초마다 하나씩 생기고 delay 초 뒤에 떨어짐
    const Z = W.h2z || (W.h2z = []), m = W.map;
    for (let i = 0; i < s.cnt; i++){ const x = i ? t.x + (W.rand() * 2 - 1) * s.spread : t.x, y = i ? t.y + (W.rand() * 2 - 1) * s.spread : t.y;
      Z.push({ by: u.i, side: u.side, x: Math.max(0.5, Math.min(m.W - 0.5, x)), y: Math.max(0.5, Math.min(m.H - 0.5, y)), r: s.r, t0: W.t + i * (s.gap || 0.22), at: W.t + i * (s.gap || 0.22) + (s.delay || 0.9), mul: s.mul, n: s.n, stun: s.stun || 0 }); }
    u.act = { k: 'h2', s: s.id, n: s.n, type: s.type, b: t.i, phase: 'rec', t0: W.t, end: W.t + 0.6 }; return true; }
  const Z = s.type === 'dash' ? { sh: 'line', x: u.x, y: u.y, ang, len: Math.min(s.len, d + 0.6), w: s.w } : { sh: 'fan', x: u.x, y: u.y, ang, r: s.r, arc: s.arc };   // 3D: 돌진은 표적 바로 뒤까지
  const wind = s.wind != null ? s.wind : 0.5;
  u.act = { k: 'h2', s: s.id, n: s.n, type: s.type, b: t.i, phase: 'wind', t0: W.t, end: W.t + wind, Z, mul: s.mul, stun: s.stun || 0, trip: !!s.trip, kb: s.kb || 0 };
  L(W, { k: 'wind', a: u.i, b: t.i, h2: s.id, spec: 'h2', w: s.n, end: +(W.t + wind).toFixed(2), why: '', hid: u.side === 1 && !u.seenBy });
  return true;
}
// 예고가 끝남: 모양 안의 상대가 맞음 → 돌진은 줄 끝까지 잔상 이동 (벽 앞에서 멈춤)
function resolveH2(W, u){
  const A = u.act; if (A.phase !== 'wind'){ u.act = null; return; }
  A.phase = 'rec'; A.end = W.t + 0.3; A.t1 = W.t; u.atkT = W.t;
  const Z = A.Z, hit = W.units.filter(e => h2Hittable(u, e) && h2In(W, Z, e));
  for (const e of hit){
    const o = strike(W, u, e, e, 1, false, { mul: A.mul, tag: A.n });
    if (!e.alive) continue;
    if (A.kb && !e.kb) shove(W, u, e, A.kb * H2KB * (o && o.block ? 0.7 : 1), e.x - Z.x, e.y - Z.y, { tag: A.n + '에 날아감', noDown: true });   // 3D: 밀침은 넘어뜨리지 않음 (넘어뜨림은 trip)
    if (A.stun) stun(W, e, A.stun, u.i);
    if (A.trip && !(e.traits || []).includes('보스') && !e.giant) knockDown(W, e, 1.2, u.i, A.n);   // 3D: 무거운 몸 · 보스는 안 넘어짐
  }
  L(W, { k: 'h2Hit', a: u.i, s: A.s, n: A.n, hit: hit.map(e => e.i), vis: u.side === 0 || !!u.seenBy || hit.some(e => e.side === 0) });
  if (W.fxOn) W.fx.push({ k: 'h2Fx', sh: Z.sh, x: Z.x, y: Z.y, ang: Z.ang, r: Z.r, arc: Z.arc, len: Z.len, w: Z.w, side: u.side, t0: W.t });
  if (A.type === 'dash' && u.alive){ const k = h2Reach(W, u, Z.x, Z.y, Z.ang, Z.len); h2Ghost(W, u, Z.x + Math.cos(Z.ang) * k, Z.y + Math.sin(Z.ang) * k); }
}
// 2페이즈: 체력이 phase.at 아래로 — 공격 × k · 속력 × spd · 기술 대기 모두 풂 (3D h2Tick)
function h2Tick(W, u){
  const K = h2Kit(u), P = K && K.phase; if (!P || u.h2.ph || !u.alive || u.hp >= u.max * P.at) return;
  u.h2.ph = true; u.atk = Math.round(u.atk * P.k); u.spd *= P.spd; u.h2.cd = {}; u.h2.mlT = Math.min(u.h2.mlT, W.t);
  L(W, { k: 'h2Phase', a: u.i, say: P.say || '', vis: true });
  if (W.fxOn){ if (P.say) W.fx.push({ k: 'say', a: u.i, s: P.say, t0: W.t }); W.fx.push({ k: 'num', x: u.x, y: u.y, s: '2페이즈', c: 'd', t0: W.t }); }
}
// 싸움 두뇌 (3D h2EnemyThink + 근접 enemyThink): 아는 상대가 없으면 보통 두뇌 (찾기 · 쫓기)
function h2Brain(W, u, dt){
  const K = h2Kit(u); if (!K || u.act) return false;
  const F = czKnown(W, u).filter(f => !f.down); if (!F.length){ u.h2.close = false; return false; }
  const t = F.reduce((a, b) => dist(u, b) < dist(u, a) ? b : a), d = dist(u, t), see = canSee(W, u, t), M = K.ml;
  u.target = t; u.state = u.side ? 'hunt' : 'fight'; if (see) u.last = { x: t.x, y: t.y };
  if (see){ const s = h2Pick(W, u, t, d); if (s && W.rand() < dt * 4) return h2Cast(W, u, s, t); }
  if (!see || d > M.range * 0.8 || (u.h2.close && d > M.range * 0.7)){ u.h2.close = see; const p = see ? t : (u.sense[t.i] || u.last || t); setMood(W, u, see ? '다가감' : '쫓음', t.i); goTo(W, u, p.x, p.y, dt); return true; }
  u.h2.close = false;
  if (W.t >= u.h2.mlT) return h2Cast(W, u, h2Ml(K), t);
  stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '노려봄', t.i); return true;
}
// 그림자 (원): 떨어지는 순간 안의 상대가 맞음 (마법 · 위에서) — 시전자가 쓰러지면 아직 안 생긴 것은 없음
function stepH2Z(W){
  W.h2z = W.h2z.filter(Z => { const by = W.units[Z.by];
    if (W.t < Z.t0) return !!(by && by.alive);
    if (W.t < Z.at) return true;
    const hit = W.units.filter(e => e.alive && !e.gone && !e.down && e.side !== Z.side && !(e.act && e.act.k === 'leap') && h2In(W, { sh: 'circ', x: Z.x, y: Z.y, r: Z.r }, e));
    for (const e of hit){ strike(W, by, e, e, 1, false, { mul: Z.mul, tag: Z.n, wk: '마법', arc: true, rain: true }); if (e.alive && Z.stun) stun(W, e, Z.stun, by.i); }
    L(W, { k: 'h2Rain', a: Z.by, n: Z.n, hit: hit.map(e => e.i), x: +Z.x.toFixed(1), y: +Z.y.toFixed(1), vis: hit.some(e => e.side === 0) || litAt(W, Z.x, Z.y) });
    if (W.fxOn) W.fx.push({ k: 'h2Boom', x: Z.x, y: Z.y, r: Z.r, side: Z.side, t0: W.t });
    return false; });
}
// v8.7.4 잡아찢기 끝까지: kill 체급 (중형) 까지는 찢겨 죽음 · 중대형은 팔다리 하나 (부러지거나 찢김) · 대형은 팔다리 하나 부러짐 — 몸 전체가 재생하는 몸 ([불사] · [재생]) 은 팔다리 대신 크게 다침
function tearDone(W, u, A){
  const S = SPR(W, 'tear'), t = W.units[A.held]; u.act = { k: 'spec', s: 'tear', b: A.b, phase: 'rec', t0: W.t, end: W.t + (S.rec || 0.6) }; u.atkT = W.t;
  if (!t || !t.alive){ return; } t.heldBy = null; const sz = SIZE_RANK[sizeOf(t)] != null ? SIZE_RANK[sizeOf(t)] : 1, kr = SIZE_RANK[S.kill || '중형'] != null ? SIZE_RANK[S.kill || '중형'] : 1; let res;
  if (sz <= kr){ applyDmg(W, u, t, Math.ceil(t.hp) + 999, { ff: t.side === u.side, far: false, part: '몸통', tag: '잡아찢김', death: 'tear' }); res = 'kill'; }
  else { hurtRaw(W, u, t, u.atk * u.atkMul * (W.rules.lethal || 1) * (S.mul || 0.6), { tag: '잡아찢기' });
    if (t.alive && !wholeBody(t)){ const leg = W.rand() < 0.5, how = sz >= (SIZE_RANK['대형'] || 3) ? '둔기' : (W.rand() < 0.5 ? '날붙이' : '둔기'); if (leg && !t.crawl) cripple(W, t, u.i, how); else if (!maimArm(W, t, u.i, how)) cripple(W, t, u.i, how); res = how === '날붙이' ? 'tear' : 'break'; } else res = 'hurt'; }
  L(W, { k: 'tear', a: u.i, b: t.i, res, size: sizeOf(t), vis: u.side === 0 || t.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: res === 'kill' ? '찢김!' : res === 'tear' ? '찢겨 나감!' : res === 'break' ? '부러짐!' : '짓눌림!', c: 'd', t0: W.t });
}
// 잡아찢기를 놓침 (맞은 피해 · 끊김) — 붙잡힌 몸은 그 자리에 풀려남
function tearLet(W, u, why, by){ const A = u.act; if (!A || A.k !== 'spec' || A.s !== 'tear' || A.phase !== 'run') return; const v = W.units[A.held]; if (v) v.heldBy = null; u.act = { k: 'spec', s: 'tear', b: A.b, phase: 'rec', t0: W.t, end: W.t + 0.4 }; L(W, { k: 'tearLet', a: u.i, b: A.held, by: by != null ? by : null, why, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '놓침!', c: 'g', t0: W.t }); }
function startPalm(W, u, t, why){
  if (u.lie) return false;   // v7.11 엎드린 채 팜 버스트를 쓰지 않음 (명령이면 먼저 일어남)
  const P = PALM(W), wind = P.wind * fatMul(W, u, 'wind');
  u.act = { k: 'palm', b: t.i, phase: 'wind', t0: W.t, end: W.t + wind, why: why || '팜 버스트' };
  u.palmCd = W.t + P.cd; u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u); u.waitT = 0;
  tire(W, u, 'bash');
  setMood(W, u, '팜 버스트', t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, palm: true, w: '손바닥', end: +(W.t + wind).toFixed(2), why: why || '', hid: u.side === 1 && !u.seenBy });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind });
}
// 손바닥을 대고 터뜨림: 막는 방패 · 무구에 닿으면 피해는 적고 자세를 크게 깎음. 몸에 닿으면 맨살일 확률 (몸 갑옷 등급) —
// 맨살 = 큰 피해 · 화상 두 겹, 갑옷 위 = 충격 (갑옷이 막는 몫 절반 무시) · 자세 · 화상 한 겹. 밀침 (가벼울수록 멀리 · 벽이면 짓눌림) · 본인은 반동으로 조금 튕겨 나감
function resolvePalm(W, u){
  const A = u.act, t = W.units[A.b], P = PALM(W), R = W.rules;
  if (A.phase !== 'wind'){ u.act = null; return; }
  A.phase = 'rec'; A.end = W.t + P.rec; A.t1 = W.t;
  let why = '';
  if (!t.alive) why = '대상이 이미 쓰러짐';
  else if (gap(u, t) > P.reach + (P.slip != null ? P.slip : 0.07)) why = W.t - t.dodgedT < 0.5 ? '몸을 빼 피함' : `손바닥이 닿지 않음 (${gap(u, t).toFixed(2)}칸 — 완전히 붙어야 함)`;   // v6.7.3 밀착
  else if (angDiff(u.face, Math.atan2(t.y - u.y, t.x - u.x)) > rv(W, 'faceArc', 70) * Math.PI / 180) why = '몸을 돌리지 못함';
  if (why){ u.miss++; L(W, { k: 'miss', a: u.i, b: t.i, why, palm: true }); return; }
  if (evadeMelee(W, t, u)) return;
  u.atkT = W.t;
  const d = dist(u, t) || 1, dx = (t.x - u.x) / d, dy = (t.y - u.y) / d, base = u.atk * u.atkMul * (R.lethal || 1) * (0.85 + 0.3 * W.rand());
  const o = { far: false, dir: sideOf(W, t, u), palm: true, wk: '맨손', part: '몸통' };
  let dmg, kbMul = 1, burnS = 0;
  if (inGuard(W, t, u)){
    t.post -= P.post * (t.gCost || 1) * fatMul(W, t, 'post'); t.blockT = W.t; t.blocked++; if (t.post <= 0){ t.post = 0; t.brokenT = W.t + R.breakTime; o.broke = true; }
    o.block = true; o.gn = t.armShield ? '팔' : t.shield ? '방패' : t.weapon || '반사신경'; o.tag = '팜 버스트 — ' + o.gn + '에 대고 터뜨림';
    dmg = Math.max(1, Math.round(base * (P.guard != null ? P.guard : 0.35))); kbMul = 0.6;
  } else {
    const it = t.gear && t.gear['몸'], tier = it ? it.tier : 0, sk = P.skin[Math.min(P.skin.length - 1, tier)], skin = W.rand() < (sk != null ? sk : 1);
    if (skin){ dmg = base * P.skinMul; burnS = P.burnSkin; o.skin = true; o.tag = '맨살에 팜 버스트 — 살이 타들어감'; }
    else { const AM = armorMul(R, t, '몸통', '맨손'); dmg = base * P.armMul * (1 - (1 - AM.m) * (1 - P.armIgn)); burnS = P.burnArm; o.armor = it ? it.name : null; o.tag = '팜 버스트 — ' + (it ? it.name : '갑옷') + ' 위로 충격'; t.post = Math.max(0, t.post - P.post * 0.5); }
    dmg = Math.max(1, Math.round(dmg * (mbOn(W, t) ? mbF(W, t, 'dmg') : 1) * (prone(W, t) ? rv(W, 'proneHit', 1.5) : 1)));
    t.pinT = W.t + R.pinTime * (mbOn(W, t) ? mbF(W, t, 'pin') : 1) * (t.vet ? VETR(W).pin : 1);
  }
  L(W, { k: 'palm', a: u.i, b: t.i, skin: !!o.skin, block: !!o.block, vis: u.side === 0 || t.side === 0 || !!u.seenBy || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'crush', x: (u.x + t.x) / 2, y: (u.y + t.y) / 2, t0: W.t });
  applyDmg(W, u, t, dmg, o);
  if (burnS && t.alive) burnOn(W, t, u, burnS, !o.skin);
  if (t.alive){ const kb = (P.kb || 1) * kbMul * Math.max(0.25, Math.min(1.4, Math.pow(80 / Math.max(30, t.mass || 62), P.kbExp || 0.6))); fling(W, u, t, kb, dx, dy, { how: '팜 버스트', downMul: 0.4 }); }
  const rc = P.recoil || 0; if (rc > 0 && u.alive && !wallBehind(W, u, -dx, -dy, u.r + 0.3)) u.recoil = { dx: -dx, dy: -dy, left: rc };   // 반동 (등 뒤가 벽이면 벽이 받아 줌)
}
function stepRecoil(W, u, dt){ const Q = u.recoil, st = Math.min(Q.left, 5 * dt); tryMove(W, u, u.x + Q.dx * st, u.y + Q.dy * st); Q.left -= st; if (Q.left <= 0.01) u.recoil = null; }
// 발놀림: 맞붙기 전 기다릴 때 서 있지 않음 — 상대를 본 채 옆으로 · 살짝 앞뒤로 (0.7~1.5초마다 방향을 바꿈). 바위 · 다른 상대 손 닿는 곳 · 겹침 · 구석은 피함.
// 휘두르는 큰 몸 앞에서는 동료 반대쪽으로 (한 번에 둘이 맞지 않게). 거구 · 방패 전선 · 기어다니는 쪽은 버티고 섬
function footwork(W, u, t, dt, want){
  const F = rv(W, 'footwork', 0.35);
  if (!F || u.giant || u.crawl || (u.canGuard && u.role === '전선')){ stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); return; }
  if (!u.fw || W.t > u.fw.t) u.fw = { t: W.t + 0.7 + W.rand() * 0.8, s: W.rand() < 0.5 ? -1 : 1, r: (W.rand() - 0.5) * 0.5 };
  const d = dist(u, t) || 1, ox = (u.x - t.x) / d, oy = (u.y - t.y) / d, g = gap(u, t);
  let side = u.fw.s;
  if (W.units.some(f => f.alive && f.side !== u.side && f.canSweep && dist(f, u) < 3.2)){
    const m = W.units.find(o => o.alive && o !== u && o.side === u.side && dist(o, u) < ((W.rules.squad || {}).spread || 1.15));
    if (m) side = ((m.x - u.x) * -oy + (m.y - u.y) * ox) > 0 ? -1 : 1;
  }
  const rad = (want != null ? Math.max(-1, Math.min(1, (want - g) * 2.5)) : 0) + u.fw.r;
  let mx = ox * rad - oy * side, my = oy * rad + ox * side; const ml = Math.hypot(mx, my) || 1; mx /= ml; my /= ml;
  const nx = u.x + mx * 0.45, ny = u.y + my * 0.45;
  const bad = boxRock(W, nx, ny, u.r * 0.9) || W.units.some(o => o.alive && o !== u && Math.hypot(o.x - nx, o.y - ny) < o.r + u.r)
    || W.units.some(f => f.alive && f.side !== u.side && f !== t && !isFar(f) && Math.hypot(f.x - nx, f.y - ny) - f.r - u.r < f.rng + 0.3)
    || (roomAt(W, nx, ny).open <= 3 && roomAt(W, u.x, u.y).open > 3);
  if (bad){ u.fw.s = -u.fw.s; u.fw.t = W.t + 0.5; stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); return; }
  moveDir(W, u, mx, my, dt * F); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
}
// 다가갈 자리 (상대 둘레, base 방향 + das): 덜 돌고 · 비어 있고 · 상대 등 뒤가 벽 (벽으로 몰아 넣기) 이면 좋고 · 휘두르는 상대 앞에선 동료와 떨어짐
function approachPt(W, u, t, base, das){
  const d = t.r + u.r + Math.min(u.rng, 0.25), sp = (W.rules.squad || {}).spread || 1.15;
  const sw = t.canSweep || W.units.some(f => f.alive && f.side === t.side && f.canSweep && dist(f, t) < 2.5);
  let best = null, bs = -1e9;
  for (const da of das){
    const a = base + da, px = t.x + Math.cos(a) * d, py = t.y + Math.sin(a) * d;
    if (boxRock(W, px, py, u.r * 0.9)) continue;
    if (W.units.some(o => o.alive && o !== u && o !== t && Math.hypot(o.x - px, o.y - py) < o.r + u.r * 0.9)) continue;
    let s = -Math.abs(da) * 0.6 - Math.hypot(px - u.x, py - u.y) * 0.3;
    if (wallBehind(W, t, -Math.cos(a), -Math.sin(a), t.r + 1.1)) s += 1.5;
    if (sw) for (const o of W.units) if (o.alive && o !== u && o.side === u.side && Math.hypot(o.x - px, o.y - py) < sp) s -= 2;
    if (s > bs){ bs = s; best = { x: px, y: py }; }
  }
  return best;
}
// 기어다님 (근접): 칠 수 없으니 상대에게서 멀어져 동료 · 치유 쪽으로 기어감
function crawlAway(W, u, t, dt){
  const h = W.units.filter(a => a.alive && a !== u && a.side === u.side && !a.crawl).sort((a, b) => ((b.skill ? 1 : 0) - (a.skill ? 1 : 0)) || dist(u, a) - dist(u, b))[0];
  const p = gap(u, t) < t.rng + 1.5 ? fallbackPt(W, u, t, 1) : null;
  if (p){ setMood(W, u, '기어서 물러남', t.i); goTo(W, u, p.x, p.y, dt); }
  else if (h && dist(u, h) > 1.2){ setMood(W, u, '기어감', h.i); goTo(W, u, h.x, h.y, dt); }
  else { stop(u); setMood(W, u, '기어다님', t.i); }
  u.fg = Math.atan2(t.y - u.y, t.x - u.x);
}
// 몸이 사선을 막는가: 방어 자세가 이쪽을 봄, 또는 큰 몸 (몸 자체가 방패 — 서 있을 때)
const blocksFor = (W, f, e) => inGuard(W, f, e, true) || (!!f.bodyShield && f.alive && !f.kb && !prone(W, f));

/* ---------- v5.3 돌격 (보병 · 탱커 공통) · 운동량 충돌 · 방진 버팀 ---------- */
// 버팀: 돌격 방향 (dx, dy) 쪽 뒤 · 옆 1.3칸 안 동료의 무게 × brace 가 받쳐 줌. 이쪽을 막고 선 전선 (훈련된 방진) 은 × trained
function braceOf(W, t, u, dx, dy){
  const C = W.rules.charge || {};
  let m = 0; const ids = [];   /* v8.7.3 받쳐 준 몸 */
  for (const o of W.units){
    if (!o.alive || o === t || o.side !== t.side || o.kb || prone(W, o)) continue;
    const ox = o.x - t.x, oy = o.y - t.y, d = Math.hypot(ox, oy); if (d > (o.rearOf && o.rearOf.j === t.i ? 1.8 : 1.3)) continue;   // v5.9.3 뒷줄은 조금 멀어도 받쳐 줌
    if ((ox * dx + oy * dy) / (d || 1) < -0.2) continue;
    m += o.mass * (C.brace != null ? C.brace : 0.6); ids.push(o.i);
  }
  // v5.7 전열의 관절: 두 마디 건너까지 무게를 나눠 받음 (한 마디 0.3 · 두 마디 0.15)
  if (t.line){ const ids = t.line.ln.ids, k = t.line.k; for (const [j, w] of [[k - 1, 0.3], [k + 1, 0.3], [k - 2, 0.15], [k + 2, 0.15]]){ const o = ids[j] != null ? W.units[ids[j]] : null; if (o && o.alive && dist(o, t) > 1.3){ m += o.mass * w; ids.push(o.i); } else if (o && o.alive){ m += o.mass * w * 0.5; ids.push(o.i); } } }
  const trained = guardOn(W, t) && inGuard(W, t, u, true) && t.role === '전선';
  return { mass: (t.mass * (t.poise || 1) + m) * (trained ? C.trained || 1.6 : 1), trained, mates: m > 0, line: !!t.line, ids };   /* v8.7.3 버팀 (poise) 도 돌격에 걸림 */
}
// v6.0 접근 과정 (프로의 판단): 자리 (x, y) 를 지금 쏠 수 있는, 내가 아는 상대 사수. 나를 겨누는 중이면 ×2 (총은 ×1.3).
// 묶인 사수 (재장전 · 치료 · 약 · 다른 이를 겨눔 · 휘청 · 넘어짐 · 근접에 붙들림 · 탄 없음) 와 방패 · 큰 몸 동료에 가린 사선은 뺌
function gunsOn(W, u, x, y){
  const out = [], D = Math.hypot;
  for (const g of W.units){
    if (!g.alive || g.side === u.side || !isFar(g)) continue;
    if (!(u.side === 1 ? (canSee(W, u, g) || fresh(W, u.sense[g.i], 3)) : (!!g.seenBy || canSee(W, u, g)))) continue;
    const r = D(g.x - x, g.y - y); if (r > g.rng + 0.5 || !losClear(W.map, g.x, g.y, x, y)) continue;
    const aim = !!(g.act && g.act.k === 'atk' && g.act.b === u.i);
    if (!aim && ((g.act && (g.act.k !== 'atk' || g.act.b !== u.i)) || W.t < (g.stunT || -9) || W.t < g.proneT || g.kb || (g.ammoMax != null && g.ammo === 0) || W.units.some(f => f.alive && f.side !== g.side && !isFar(f) && gap(f, g) < f.rng + 0.3))) continue;
    if (W.units.some(s => s.alive && s !== u && s.side === u.side && (s.shield || s.bodyShield) && D(s.x - g.x, s.y - g.y) < r && segD(g, x, y, s) < s.r && blocksFor(W, s, g))) continue;
    const run = !aim && !g.act && Math.hypot(g.vx || 0, g.vy || 0) > 1.2 && !AI6.includes('runw');   // v6.5 달아나는 사수는 서서 겨눠야 쏨 — 바로 못 쏨
    out.push({ g, aim, w: (aim ? 2 : 1) * (g.loud ? 1.3 : 1) * (run ? 0.35 : 1) });
  }
  return out;
}
const gunDanger = (W, u, x, y) => gunsOn(W, u, x, y).reduce((s, o) => s + o.w, 0);
const hurtOf = u => u.hp / u.max < 0.6 || (u.wounds || []).length > 0 || !!(u.arms && (u.arms.L || u.arms.R)) || !!u.legLoss;
// v6.0 방패 뒤로 접근 (적): 총구가 열린 채 다가가지 않음 — 방패 · 큰 몸 동료 뒤 (사수 반대쪽) 를 따라 들어가고, 가려 줄 동료가 없는데 다쳤거나 겨눠지고 있으면
// 사선 밖 (바위 뒤) 에서 틈 (재장전 · 다른 이를 겨눔) 을 기다림. 3초 넘게 기다렸으면 들어감
function screenApproach(W, u, t, dt){
  if (u.side !== 1 || u.crawl || isFar(u) || gap(u, t) <= u.rng + 0.8) return false;
  const G = gunsOn(W, u, u.x, u.y); if (!G.length){ u.gunWaitT = Math.max(0, (u.gunWaitT || 0) - dt); return false; }
  const D = G.reduce((s, o) => s + o.w, 0), hurt = hurtOf(u);
  if (!hurt && D < 1.35 && u.bold >= 0.65) return false;   // 멀쩡하고 대담하면 총 하나쯤은 감수
  const g = G.sort((a, b) => b.w - a.w)[0].g;
  let best = null, bs = 1e9;
  for (const s of W.units){
    if (!s.alive || s === u || s.side !== u.side || !(s.shield || s.bodyShield) || s.crawl || isFar(s) || dist(s, u) > 6 || dist(s, t) > dist(u, t) + 1.5) continue;
    const d = dist(g, s) || 1, k = s.r + u.r + 0.15, px = s.x + (s.x - g.x) / d * k, py = s.y + (s.y - g.y) / d * k;
    if (rock(W.map, px, py) || W.units.some(o => o.alive && o !== u && o !== s && Math.hypot(o.x - px, o.y - py) < o.r + u.r * 0.8)) continue;
    const c = Math.hypot(px - u.x, py - u.y) + Math.hypot(px - t.x, py - t.y) * 0.5; if (c < bs){ bs = c; best = { x: px, y: py, s }; }
  }
  if (best){ u.gunWaitT = 0; setMood(W, u, '방패 뒤로 접근', best.s.i); if (Math.hypot(best.x - u.x, best.y - u.y) > 0.12) goTo(W, u, best.x, best.y, dt); else { stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); } return true; }
  if ((hurt || G.some(o => o.aim)) && (u.gunWaitT || 0) < 3){
    let hp = null, hd = 1e9;
    for (const r of [0, 0.5, 1, 1.5]) for (let k = 0; k < (r ? 12 : 1); k++){ const a = k * Math.PI / 6, x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r; if (rock(W.map, x, y) || losClear(W.map, g.x, g.y, x, y)) continue; if (r < hd){ hd = r; hp = { x, y }; } }
    if (hp){ u.gunWaitT = (u.gunWaitT || 0) + dt; setMood(W, u, '총구를 피해 기다림', g.i); if (hd > 0.1) goTo(W, u, hp.x, hp.y, dt); else { stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); } return true; }
  }
  return false;
}
// 돌격할 만한 값: 부딪힌 뒤 상대가 날아갈 속력 (버팀 포함) + 빈틈 (옆 · 뒤) · 사수 · 준비 · 재장전 중 · 벽 쪽 − 막고 선 방패 정면 · 뛰어들면 둘러싸임 · 다침
function chargeValue(W, u, t){
  const C = W.rules.charge || {}, d = dist(u, t) || 1, dx = (t.x - u.x) / d, dy = (t.y - u.y) / d;
  const vA = chargeSp(C, spdNow(W, u), Math.max(0, gap(u, t))), br = braceOf(W, t, u, dx, dy);   // v5.8.5 거리만큼 붙는 속력 (멀리서 달려올수록 셈)
  let v = (1 + (C.e != null ? C.e : 0.3)) * u.mass / (u.mass + br.mass) * vA / 2;
  if (sideOf(W, t, u) !== 'front') v += 1.5;
  if (isFar(t)) v += 1.5;
  if (t.act && t.act.phase === 'wind') v += 0.7;
  if (t.act && t.act.k === 'reload') v += 1;
  if (inGuard(W, t, u, true)) v -= 0.8;
  // v5.8.7 태세: 손이 빈 채 이쪽을 보고 막을 수 있는 상대 — 버틸 것 같으면 크게 깎고 (돌격한 쪽이 당함), 무너뜨릴 수 있으면 더함
  if (t.canGuard && !isFar(t) && t.guardMode !== 'off' && !t.act && W.t >= t.brokenT && aware(W, t, u) && angDiff(t.face, Math.atan2(u.y - t.y, u.x - t.x)) * 180 / Math.PI <= guardArc(W, t) + 10){ const f = focusOf(W, t);
    if (!(f && f !== u && f.alive && gap(t, f) < (t.rng || 0.5) + 0.4)) v += setCost(W, u, t, Math.max(0.25, Math.min(1.6, vA / 4.5)), br.mass / (br.trained ? C.trained || 1.6 : 1)) >= t.post ? 1 : -((W.rules.chargeSet || {}).ai != null ? W.rules.chargeSet.ai : 3); }
  if (wallBehind(W, t, dx, dy, t.r + 1.2)) v += 1.2;
  if (t.canCharge && !t.act && W.t >= (t.chargeCd || -9) && t.mass > u.mass * 2.5 && aware(W, t, u)) v -= 1;   // v6.7 맞돌진 위험: 훨씬 무거운 상대가 마주 달려오면 가벼운 쪽이 당함 (고블린 38kg ↔ 판금 기사 145kg)
  // v5.4 혼자 뛰어들지 않음: 부딪힐 자리 둘레 (2.2칸) 상대 근접 수 > 따라올 동료 (상대 2.5칸 · 나 1.6칸 안 근접) + 1 이면 깎음. 진형을 떠나는 전선 (대치 중) 도.
  // 지휘가 있으면 이 판단이 엄격 (×1.5), 없으면 무모함 (×0.6)
  const cm = cmdOf(W, u.side) > 0 ? 1.5 : 0.6;
  const foesAt = W.units.filter(o => o.alive && o.side === t.side && !isFar(o) && dist(o, t) < 2.2).length, supp = W.units.filter(o => o.alive && o !== u && o.side === u.side && !isFar(o) && (dist(o, t) < 2.5 || dist(o, u) < 1.6)).length;
  if (foesAt > supp + 1) v -= 1.8 * cm * (foesAt - supp - 1);
  if (u.role === '전선' && W.stance[u.side] && W.stance[u.side].k === 'hold' && W.units.some(o => o.alive && o !== u && o.side === u.side && dist(o, u) < 1.5)) v -= 1.5 * cm;
  if (u.hp / u.max < 0.35) v -= 1;
  if (u.side === 1 && !AI6.includes('chg')){   // v6.0 프로의 돌격: 달려가는 길이 준비된 총구 앞인가 (나를 겨누는 · 손이 빈 사수, 방패에 안 가림) — 다쳤으면 더 꺼림. 길에서 다른 탱커에게 먼저 걸리면 헛돌격
    const D = Math.max(gunDanger(W, u, u.x, u.y), gunDanger(W, u, (u.x + t.x) / 2, (u.y + t.y) / 2));
    if (D) v -= D * 1.2 * (hurtOf(u) ? 1.6 : 1);
    if (W.units.some(o => o.alive && o !== t && o.side === t.side && !isFar(o) && o.role === '전선' && (o.canGuard || o.bodyShield) && dist(u, o) < dist(u, t) && segD(u, t.x, t.y, o) < o.r + u.r)) v -= 2;
  }
  if (u.side === 1 && !AI6.includes('appr')){   // v6.4.1 접근 판단: 다친 몸 · 길목에서 칠 수 있는 놈 · 붙어 싸우던 상대에게 등을 보임
    if (u.hp / u.max < 0.5) v -= (0.5 - u.hp / u.max) * 4;
    v -= gauntlet(W, u, t) * 0.8;
    if (W.units.some(o => o.alive && o !== t && o.side !== u.side && !isFar(o) && gap(u, o) < Math.max(u.rng, o.rng) + 0.4)) v -= 0.8;
  }
  return v;
}
const gauntlet = (W, u, t) => W.units.filter(o => o.alive && o !== t && o.side !== u.side && !isFar(o) && !o.down && !o.crawl && dist(o, t) > 2.2 && segD(u, t.x, t.y, o) < o.rng + o.r + u.r + 0.2).length;   // v6.4.1 가는 길목에서 칠 수 있는 상대 (도착 자리 둘레 말고)
const chargeOk = (W, u, t) => chargeValue(W, u, t) >= ((W.rules.charge || {}).worth != null ? W.rules.charge.worth : 1.8) - u.bold * 0.8 + ((planOf(W, u.side) || {}).chg || 0) + (u.chgBias || 0);   // v6.0 작전 (밀어붙임 −0.4 · 버팀 +0.4 · 후퇴 +1.5)
// 돌격할 상대 고르기 (빈틈을 노림): 돌격 거리 안 · 보이는 상대 중 값이 가장 큰 쪽
function bestCharge(W, u){
  const C = W.rules.charge || {};
  let best = null, bv = -1e9;
  for (const f of W.units){
    if (!f.alive || f.side === u.side || !canSee(W, u, f)) continue;
    const g = gap(u, f); if (g < (C.min || 1.5) || g > (C.max || 5)) continue;
    const v = chargeValue(W, u, f); if (v > bv){ bv = v; best = f; }
  }
  return best && bv >= (C.worth != null ? C.worth : 1.8) - u.bold * 0.8 + (u.chgBias || 0) ? best : null;
}
// 외침: 말하는 쪽은 말 (카리우스 "크아아!" · 보통 "이야아아!"), 말 없는 쪽은 무기 이모지 + 달리기
const CHARGE_EMO = { '창': '🔱', '어부의 창': '🔱', '둔기': '🔨', '이빨·발톱': '🐾' };
const SHOUT_EMO = { '뒤로!': '🛡️', '내 뒤로!': '🛡️', '비켜!': '⚠️' };
function chargeCry(W, u){
  if (u.cry) return u.cry;
  if (!u.mute) return u.giant ? '크아아!' : '이야아아!';
  const k = ((W.rules.weapons || {})[u.weapon] || {}).kind;
  return (CHARGE_EMO[u.weapon] || (k === '날붙이' ? '⚔️' : k === '둔기' ? '🔨' : '🏃')) + '💨';
}
// 날려 보냄 (len 칸, dx · dy 쪽): 처음부터 벽에 붙어 있으면 짓눌림, 아니면 날아감 (stepKb). o.down = 넘어짐 여부 (없으면 거리로)
function fling(W, a, t, len, dx, dy, o){
  if (!t.alive || t.kb || !(len > 0)) return null;
  if (t.ccRes && !(o && o.ccDone)) len *= 1 - t.ccRes * ((W.rules.cc || {}).shove != null ? W.rules.cc.shove : 0.6);   /* v8.7.3 [버팀] 은 돌격 · 튕김 · 팜 버스트에도 (밀침은 shove 에서 이미) */
  const S = W.rules.shove || {}, l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
  if (len >= (S.crushMin != null ? S.crushMin : 0.35) && wallBehind(W, t, dx, dy, t.r + 0.3)){ crushWall(W, a, t, (S.wall || 1.2) * Math.min(1, len / (S.crushLen || 1.2)), o, true); return 'pinned'; }   /* v8.7.3 */
  if (len < 0.12){ tryMove(W, t, t.x + dx * len, t.y + dy * len); return 'nudge'; }
  interrupt(W, t, '밀려나 준비가 끊김');
  t.kb = { dx, dy, left: len, len, by: a.i, o: o || {}, hit: [a.i, t.i], p: (o && o.p) || len };
  stop(t);
  L(W, { k: 'shove', a: a.i, b: t.i, len: +len.toFixed(2), how: (o && o.how) || '', arm: !!a.armShield, ...(o && o.mass != null ? { am: Math.round(o.mass) } : {}), ...(o && o.tag ? { tag: o.tag } : {}), ...(o && o.via != null ? { via: o.via } : {}), ...(o && o.wn ? { wn: o.wn } : {}), ...(o && o.fix ? { fix: true } : {}), ...(o && o.mt ? { mt: true } : {}), vis: a.side === 0 || t.side === 0 || !!a.seenBy || !!t.seenBy });   /* v8.7.3 친 것의 무게 · 무엇에 밀렸나 */
  return 'fly';
}
// v5.3 창 2열: 창 (사거리 0.9 넘는 근접) 은 동료가 이미 맞붙은 상대를 그 동료 옆 · 뒤에서 찌름 — 상대 손은 안 닿고 내 창은 닿는 자리
function pikeStep(W, u, t, dt){
  if (isFar(u) || !rank2(W, u) || u.crawl) return false;
  const f = W.units.filter(o => o.alive && o !== u && o.side === u.side && !isFar(o) && gap(o, t) < 0.5).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (!f) return false;
  if (W.units.some(e => e.alive && e.side !== u.side && e !== t && !isFar(e) && gap(u, e) < e.rng + 0.2)) return false;
  // 상대 손이 닿는 거리: 거구는 넓게 휘두르는 거리까지. 동료 거구가 휘두르는 부채꼴 안도 피함
  const SW = W.rules.sweep || {}, tReach = t.rng + (t.canSweep ? SW.reach || 0.35 : 0) + 0.1;
  const inMateArc = (x, y) => W.units.some(m => m.alive && m !== u && m.side === u.side && m.canSweep && Math.hypot(m.x - x, m.y - y) - m.r - u.r < m.rng + (SW.reach || 0.35) + 0.1 && angDiff(Math.atan2(y - m.y, x - m.x), m.face || 0) < (SW.arc || 65) * Math.PI / 180 + 0.2);
  const g = gap(u, t);
  if (g <= u.rng && g > tReach && !inMateArc(u.x, u.y)){ startAct(W, u, t, '2열 찌르기'); return true; }
  const base = Math.atan2(f.y - t.y, f.x - t.x);
  let best = null, bs = -1e9;
  for (const da of [0, 0.25, -0.25, 0.5, -0.5, 0.9, -0.9]) for (const dr of [0.1, 0.3]){   // v5.4 장창: 동료 바로 뒤부터 (방진 틈으로)
    const rr = u.rng + t.r + u.r - dr, a = base + da, x = t.x + Math.cos(a) * rr, y = t.y + Math.sin(a) * rr;
    if (boxRock(W, x, y, u.r * 0.9)) continue;
    if (W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r * 0.95)) continue;
    const gg = rr - t.r - u.r; if (gg < tReach + 0.02 || inMateArc(x, y)) continue;
    if (W.units.some(e => e.alive && e.side !== u.side && e !== t && !isFar(e) && Math.hypot(e.x - x, e.y - y) - e.r - u.r < e.rng + 0.3)) continue;
    const s = -Math.hypot(x - u.x, y - u.y) - Math.abs(da) * 0.5;
    if (s > bs){ bs = s; best = { x, y }; }
  }
  if (!best) return false;
  setMood(W, u, '2열', t.i); goTo(W, u, best.x, best.y, dt);
  return true;
}
// v5.3 가볍고 (거구 무게의 절반 아래) 전선이 아닌 쪽은 상대 거구가 휘두르는 앞 (부채꼴 · 거리 +0.3) 에 서지 않음 — 거구는 탱커 · 사수에게 맡김.
// 거구가 틈을 보이면 (넘어짐 · 방금 휘둘러 회복 중) 들어가 침
function avoidGiant(W, u, t, dt){
  if (u.giant || u.role === '전선' || isFar(u) || u.crawl || W.t - (W.atkWT || 0) > 5) return false;   // v5.5 오래 눈치만 보면 피하지 않음
  const SW = W.rules.sweep || {};
  const g = W.units.find(f => f.alive && f.side !== u.side && f.canSweep && u.mass < f.mass * 0.5 && !prone(W, f) && !(f.act && f.act.phase === 'rec') && gap(u, f) < f.rng + (SW.reach || 0.35) + 0.3 && angDiff(Math.atan2(u.y - f.y, u.x - f.x), f.face || 0) < (SW.arc || 65) * Math.PI / 180 + 0.3);
  if (!g) return false;
  const p = fallbackPt(W, u, g, 1.0); if (!p) return false;
  setMood(W, u, '거구 피함', g.i); goTo(W, u, p.x, p.y, dt);
  return true;
}
// 돌아서는 빠르기 배율 (무거울수록 느림)
const turnMul = (W, u) => Math.max(0.35, Math.min(1.3, Math.sqrt((W.rules.turnMass || 70) / Math.max(20, u.mass || 70))));

/* ---------- v5.4 지휘 · 진형 · 대치 (서로 진형을 갖추고 틈을 노리며 돎) ---------- */
// [지휘X] 점수 (S 4 · A 3 · B 2 · C 1, 수치표 grades.지휘). 없으면 0
function cmdOf0(p, rules){ const t = (p.traits || []).find(x => x.length === 3 && x.startsWith('지휘')); if (!t) return 0; const g = rules.grades && rules.grades['지휘']; return (g && g[t.slice(-1)]) || { S: 4, A: 3, B: 2, C: 1 }[t.slice(-1)] || 0; }
// 편의 지휘력: 살아 있는 (기어다니지 않는) 지휘의 합, 6 까지
function cmdOf(W, side){ let s = 0; for (const u of W.units) if (u.alive && !u.crawl && u.side === side && u.cmd) s += u.cmd; return Math.min(6, s); }
// 방진: 1.3칸 안에 붙어 선 같은 편 (넘어지거나 날아가는 중이 아닌) 수, 4 까지
const formMates = (W, t) => Math.min(4, W.units.filter(o => o.alive && o !== t && o.side === t.side && !o.kb && !prone(W, o) && dist(o, t) < 1.3).length);
// 바위가 아닌 가까운 자리 (0.3칸씩 넓혀 찾음)
function freeSpot(W, x, y, r){
  if (!boxRock(W, x, y, r * 0.9)) return { x, y };
  for (let d = 0.3; d <= 1.8; d += 0.3) for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, xx = x + Math.cos(a) * d, yy = y + Math.sin(a) * d; if (!boxRock(W, xx, yy, r * 0.9)) return { x: xx, y: yy }; }
  return null;
}
// 진형 자리: 상대 맨 앞에서 gap 칸 떨어진 앞줄에 탱커 (나란히), 창은 탱커 바로 뒤 (방진 틈으로 찌름), 칼은 양 날개 (돌아 들어갈 쪽), 미드필더는 더 바깥, 사수 · 지원은 뒤.
// 앞줄은 옆으로 천천히 흔들림 (서클링 — 양쪽이 서로 틈을 노리며 돎)
function formSlots(W, side, mine, known, S){
  const F = W.rules.form || {}, c = centroid(mine), ec = centroid(known);
  let ax = ec.x - c.x, ay = ec.y - c.y; const al = Math.hypot(ax, ay) || 1; ax /= al; ay /= al; const px = -ay, py = ax;
  const near = Math.min(...known.map(f => (f.x - c.x) * ax + (f.y - c.y) * ay));
  const sway = Math.sin(W.t * (F.sway || 0.35) + S.ph) * (F.amp || 1.2), fwd = near - (S.gapNow || F.gap || 4) - (S.bait || 0) - (S.pb || 0) + (S.adv || 0);   // v6.0 유인: 앞줄이 물러서 끌어들임   // v7.3 간보기 (adv 나섬) · 끌어들임 (pb) · 사격전 간격 (gapNow)
  const fx = c.x + ax * fwd + px * sway, fy = c.y + ay * fwd + py * sway, lane = F.lane || 1.1, slots = {};
  const lat = u => (u.x - c.x) * px + (u.y - c.y) * py;
  const put = (u, along, side2) => { const q = freeSpot(W, fx + ax * along + px * side2, fy + ay * along + py * side2, u.r); if (q) slots[u.i] = q; };
  const tanks = mine.filter(u => u.role === '전선').sort((a, b) => lat(a) - lat(b)), nT = Math.max(1, tanks.length), tw = nT * lane / 2;
  tanks.forEach((u, k) => put(u, 0, (k - (tanks.length - 1) / 2) * lane));
  const spears = mine.filter(u => !isFar(u) && u.role !== '전선' && rank2(W, u)).sort((a, b) => lat(a) - lat(b));
  spears.forEach((u, k) => { const tk = tanks[k % nT]; put(u, -((tk ? tk.r : 0.4) + u.r + 0.3) - Math.floor(k / nT) * 0.7, (k % nT - (tanks.length - 1) / 2) * lane + (k >= nT ? 0.35 : 0)); });
  const swords = mine.filter(u => !isFar(u) && u.role !== '전선' && !rank2(W, u) && u.role !== '미드필더').sort((a, b) => lat(a) - lat(b));
  swords.forEach((u, k) => put(u, -0.3, (k % 2 ? 1 : -1) * (tw + 0.6 + Math.floor(k / 2) * 0.9)));
  const mids = mine.filter(u => !isFar(u) && u.role === '미드필더');
  mids.forEach((u, k) => put(u, 0.2, (k % 2 ? 1 : -1) * (tw + 1.7 + Math.floor(k / 2) * 0.9)));
  const back = mine.filter(u => isFar(u)).sort((a, b) => lat(a) - lat(b));
  if (S.fireOn) back.forEach((u, k) => put(u, -0.9, (k % 2 ? 1 : -1) * (tw + 1.0 + Math.floor(k / 2) * 1.2)));   // v7.3 사격전: 궁수가 앞줄 양옆 (한 걸음 뒤) 으로 나와 각 · 사거리를 잡음
  else back.forEach((u, k) => put(u, -2.2, (k - (back.length - 1) / 2) * 1.3));
  S.slots = slots; S.ex = ec.x; S.ey = ec.y; S.ax = ax; S.ay = ay;
}
// 빈틈 점수 (대치를 깰 만한가): 옆 · 뒤가 보임, 방진 밖에 혼자 (1.3칸 안 동료 없음), 지켜 주는 이 없는 사수, 준비 · 재장전 중, 벽을 등짐. 무게 차이는 빈틈이 아님
function gapScore(W, u, t){
  const d = dist(u, t) || 1;
  // 가는 길을 상대 편 몸 (앞줄) 이 막고 있으면 닿을 수 없는 자리 — 빈틈 아님
  if (W.units.some(o => o.alive && o !== t && o !== u && o.side === t.side && segD(u, t.x, t.y, o) < o.r + u.r)) return 0;
  let g = 0;
  if (sideOf(W, t, u) !== 'front') g += 1.5;
  const alone = !W.units.some(o => o.alive && o !== t && o.side === t.side && !o.kb && dist(o, t) < 1.8);   // 진형을 갖추느라 걷는 중인 정도는 혼자가 아님
  if (alone) g += 1.2;
  if (isFar(t) && alone) g += 0.8;
  if (t.act && (t.act.phase === 'wind' || t.act.k === 'reload')) g += 0.8;
  if (prone(W, t)) g += 2;
  if (g > 0 && wallBehind(W, t, (t.x - u.x) / d, (t.y - u.y) / d, t.r + 1.2)) g += 1;   // 벽만으로는 빈틈이 아님 (다른 빈틈이 있을 때 더함)
  return g;
}

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
/* ---------- v8.7.5 대형 (J7 · J16 · I20) ---------- */
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
// v8.7.3 우리 편의 기준: 따라감 · 탐험 · 출구로 따라 나감 · 낙오자 합류 · 나간 대장 따라가기 — 주인공이 있으면 주인공, 없으면 지휘관 (임시 지휘 포함), 그도 없으면 남은 이 가운데 하나
function ancOf(W){
  if (W.ancT === W.t) return W.anc;
  const ok = a => a && a.alive && a.side === 0 && !a.gone && !a.summon;
  let h = (() => { const F = W.form && W.form.A, a = F && F.act && F.lead != null ? W.units[F.lead] : null; return a && ok(a) && !a.down && !a.crawl ? a : null; })() || W.units.find(a => a.hero && ok(a)) || null;   /* v8.7.5 본대 대형이 켜져 있으면 편대장이 기준 */
  if (!h){ const c = cmdBoss(W, 0); if (ok(c) && !c.down && !c.crawl) h = c; }
  if (!h) h = W.units.find(a => ok(a) && !a.down && !a.crawl) || null;
  W.ancT = W.t; W.anc = h; return h;
}
const isAnc = (W, u) => u.side === 0 && ancOf(W) === u;
// v8.7.5 대장 (출구로 따라 나섬 · 마지막에 나감 · 출구 찾기 · 나간 대장 따라가기 · 여정 시작 모임): 대형의 기준 (ancOf) 과 따로 — 주인공이 있으면 주인공, 없으면 지휘관, 그도 없으면 남은 이 가운데 하나
function chiefOf(W){
  if (W.chfT === W.t) return W.chf;
  const ok = a => a && a.alive && a.side === 0 && !a.gone && !a.summon;
  let h = W.units.find(a => a.hero && ok(a)) || null;
  if (!h){ const c = cmdBoss(W, 0); if (ok(c) && !c.down && !c.crawl) h = c; }
  if (!h) h = W.units.find(a => ok(a) && !a.down && !a.crawl) || null;
  W.chfT = W.t; W.chf = h; return h;
}
const isChief = (W, u) => u.side === 0 && chiefOf(W) === u;
// v8.7.3 지휘관이 맵을 떠나면 (먼저 올라감) 남은 이 가운데 가장 노련한 이가 바로 이어받음 — 쓰러진 게 아니니 끊김 (2.5초 각자 싸움) 이 없음
function cmdHand(W, u){
  if (!(u.cmd > 0) || !W.hadCmd || !W.hadCmd[u.side] || AI6.includes('acting')) return;
  if (W.units.some(a => a.alive && !a.crawl && a.side === u.side && a.cmd > 0)) return;
  const mine = W.units.filter(a => a.alive && !a.crawl && !a.down && a.side === u.side && !a.summon && !a.gone); if (!mine.length) return;
  const c = mine.sort((a, b) => (b.vet ? 1 : 0) - (a.vet ? 1 : 0) || b.tier - a.tier || b.hp - a.hp)[0];
  c.cmd = 1; c.cmdTmp = true; const A = W.acting || (W.acting = [{}, {}]), st = A[u.side]; st.lossT = null; st.n = (st.n || 0) + 1;
  if (u.side === 0) W.bossI = c.i;   // 이어받음 줄은 아래 하나로 (지휘 계승 줄과 겹치지 않게)
  L(W, { k: 'acting', side: u.side, a: c.i, n: st.n, left: u.i, vis: u.side === 0 || !!c.seenBy });
}
// v6.8 지휘가 끊기면 (지휘관이 쓰러짐) 2.5초 동안 각자 싸우다가, 가장 노련한 병사 (베테랑 · 등급 · 체력) 가 임시 지휘 (지휘C = 1점)
function actingCmd(W, side){
  if (!W.hadCmd || !W.hadCmd[side] || AI6.includes('acting')) return;
  const A = W.acting || (W.acting = [{}, {}]), st = A[side];
  if (W.units.some(u => u.alive && !u.crawl && u.side === side && u.cmd > 0)){ st.lossT = null; return; }
  const mine = W.units.filter(u => u.alive && !u.crawl && !u.down && u.side === side); if (!mine.length) return;
  if (st.lossT == null){ st.lossT = W.t; L(W, { k: 'cmdLost', side, vis: true }); return; }
  if (W.t - st.lossT < 2.5) return;
  const c = mine.slice().sort((a, b) => (b.vet ? 1 : 0) - (a.vet ? 1 : 0) || b.tier - a.tier || b.hp - a.hp)[0];
  c.cmd = 1; c.cmdTmp = true; st.lossT = null; st.n = (st.n || 0) + 1;
  L(W, { k: 'acting', side, a: c.i, n: st.n, vis: side === 0 || !!c.seenBy });
}
const RANK_REF = { 'C-007': '부대장' };   // v7.10 공식 부대장 (노먼)
const cmdBoss = (W, side) => W.units.filter(u => u.alive && !u.crawl && u.side === side && u.cmd > 0 && !(u.koT && W.t < u.koT)).sort((a, b) => b.cmd - a.cmd || (b.rank === '부대장' ? 1 : 0) - (a.rank === '부대장' ? 1 : 0) || (a.cmdTmp ? 1 : 0) - (b.cmdTmp ? 1 : 0))[0] || null;
const deputyOf = (W, side) => W.units.find(u => u.alive && u.side === (side || 0) && u.rank === '부대장' && !u.crawl) || null;
function leadOf(W, u){ { const F = formOf(W, u); if (F && F.act && F.lead !== u.i && !u.fdet){ const D = W.units[F.lead]; if (D && D.alive && !D.down && !D.crawl) return D; } }   /* v8.7.5 편대원은 편대장을 따라감 */
  if (u.sqLead == null || u.hero) return null; const D = W.units[u.sqLead]; return !D || !D.alive || D.down || D.crawl || D === u || (D.sqFall && W.t < D.sqFall) ? null : D; }   // v7.10 편대장 (부대장) — 물러나는 동안은 본대 (주인공) 로   // v7.4 기절한 지휘관은 지휘 못 함
/* ---------- v7.4 지휘 전달 (아군 · 적 같음) ----------
   명령은 하늘에서 내리지 않음 — 지휘관이 외치거나 (소리) 손짓 · 깃발로 (눈) 전함. 지휘 거리 = 4 + 2 × 지휘 점수 (C 6 · B 8 · A 10 · S 12칸, 임시 지휘관 5칸).
   외침: 외침이 닿는 거리 (전장 소음으로 줄어듦) 와 지휘 거리 중 짧은 쪽 안 — 멀수록 덜 확실. 손짓: 받는 쪽이 지휘관을 볼 수 있어야 (빛 · 바위 · 야시) — 지휘 거리 × 1.2 안, 어둠 속을 야시로 보면 덜 확실.
   맞붙은 쪽은 눈 · 귀가 상대에게 가 있어 덜 받음. 둘 다 안 되면 둘 다 닿는 동료를 거쳐 (더 늦고 덜 확실). 못 받으면 하던 대로 — 자동 전투. 횃불을 든 지휘관은 멀리서도 보여 손짓이 닿음 (적에게도 보임) */
const cmdRange = (W, C) => { const K = W.rules.cmdLink || {}; return C.cmdTmp ? (K.tmp || 5) : (K.base != null ? K.base : 4) + (K.per != null ? K.per : 2) * (C.cmd || 0); };
// v7.14.1 징검다리: 명령을 꺼내는 시간은 지휘관만 (relay = 전하는 동료는 들은 대로 바로 되외침) · 멀리 외칠수록 되풀이 · 멀리 손짓할수록 눈 맞추는 데 걸림 — 곁의 동료를 거치면 빨라짐
function cmdVoiceT(W, a, b, hr, relay){
  const K = W.rules.cmdLink || {}, X = W.rules.cmdLinkX || {}, R = W.rules.report || {}, d = dist(a, b), near = K.near != null ? K.near : 2.5, h0 = W.rules.hear || 9, loud = hr < h0 * 0.999 ? 1 - hr / h0 : 0;
  const t = (relay ? 0 : (R.base != null ? R.base : 0.4) * (1 + loud)) + d / (R.v || 15) + (X.farT != null ? X.farT : 0.8) * Math.pow(Math.max(0, d - near) / Math.max(1, hr - near), 1.5) * (1 + loud) + ((a.mute || b.mute) && !canSee(W, b, a) ? 1 : 0);
  return a.vet ? t * 0.8 : t;
}
const cmdSignT = (W, a, b, sr, lit, relay) => { const K = W.rules.cmdLink || {}, X = W.rules.cmdLinkX || {}, near = K.near != null ? K.near : 2.5; return ((relay ? 0 : K.signT || 0.35) + (X.signFar != null ? X.signFar : 0.8) * Math.pow(Math.max(0, dist(a, b) - near) / Math.max(1, sr - near), 1.5)) * (lit ? 1 : 1.4); };
function cmdLink1(W, C, u, relay){
  if (!W.units.some(f => f.alive && !f.gone && f.side !== C.side)) return { p: 1, t: 0.15 + dist(C, u) * 0.04, via: C.mute ? 'sign' : 'voice', why: [], busy: false, calm: true };   /* v8.7.3 적이 없는 맵 (끝난 맵 · 오딜의 방) */
  const K = W.rules.cmdLink || {}, d = dist(C, u), R = cmdRange(W, C), hr = hearR(W, C, u), hear = Math.min(hr, R), sr = R * 1.2, why = [];
  const busy = W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < Math.max(u.rng, f.rng) + 0.3);
  let pv = 0, ps = 0;
  if (C.mute) why.push('말을 못 함 (몸짓만)');
  else if (d <= hear) pv = (K.voice || 0.95) * (1 - 0.45 * Math.pow(d / Math.max(0.5, hear), 2)) * (busy ? (K.busy || 0.85) : 1);
  else why.push(d > R ? `지휘 거리 밖 (${R}칸)` : `소음에 묻힘 (외침이 ${hear.toFixed(1)}칸까지)`);
  const lit = litAt(W, C.x, C.y);
  const ct = C.torch && !C.torchOff;   // v7.5 꺼진 횃불은 안 보임
  if (d <= sr && (canSee(W, u, C) || (u.blind ? false : ct && losClear(W.map, u.x, u.y, C.x, C.y)))){ ps = (K.sign || 0.9) * (1 - 0.35 * Math.pow(d / sr, 2)) * (lit || ct ? 1 : ((K.nv || {})[u.nvG] || 0.5)) * (busy ? (K.busySign || 0.7) : 1); if (!lit && !ct) why.push('어둠 — 야시로 봄'); }
  else why.push(d > sr ? '손짓이 안 보일 만큼 멂' : '지휘관이 안 보임');
  const cb7 = W.cmdBonus ? W.cmdBonus[C.side] || 0 : 0, p = Math.min(1, 1 - (1 - pv) * (1 - ps) + (cb7 > 0 && (pv > 0 || ps > 0) ? cb7 : 0)), via = pv <= 0 && ps <= 0 ? 'none' : pv >= ps ? 'voice' : 'sign';   /* v8.7.7 군기 — 닿는 길이 있으면 + (cmdBonus) */
  return { p, t: via === 'voice' ? cmdVoiceT(W, C, u, hr, relay) : via === 'sign' ? cmdSignT(W, C, u, sr, lit || ct, relay) : 0, via, why, busy };
}
// v7.13 지휘망 (그물): 모두가 곁의 동료에게 거듭 전함 (이중 · 삼중) — 받을 확률 = 1 − (지휘관에게 직접 못 받음) × Π (곁의 동료가 받아 전해 주지 못함).
//   전달자의 지휘 점수가 높을수록 멀리 (지휘 거리) · 확실히 (relaySkill) · 빨리 (relayFast). 사람이 많을수록 닿을 길이 늘어남. 아군 · 적 같음
function meshNet(W, side, C){
  const K = W.rules.cmdLink || {}, X = W.rules.cmdLinkX || {}, near = K.near != null ? K.near : 2.5, key = side + ':' + (C ? C.i : -1), M = W.meshC || (W.meshC = {}), c0 = M[key];
  if (c0 && W.t - c0.t < 0.25 && W.t >= c0.t) return c0;
  const N = W.units.filter(m => m.alive && !m.crawl && !m.down && m.side === side && !(m.koT && W.t < m.koT)), Lg = new Map();
  const busy = m => (m.act && ['atk', 'skill', 'reload', 'heal'].includes(m.act.k)) || W.units.some(f => f.alive && f.side !== m.side && !isFar(f) && gap(m, f) < Math.max(m.rng, f.rng) + 0.3);
  const rf = m => (K.relay || 0.9) * (busy(m) ? (X.relayBusy != null ? X.relayBusy : 0.6) : 1) * (1 + (X.relaySkill != null ? X.relaySkill : 0.06) * (m.cmd || 0)) * (m.rank === '부대장' ? X.relayRank || 1.12 : 1);
  const Lt = new Map(); for (const a of N) for (const b of N) if (a !== b){ const k = a.i * 1000 + b.i; if (dist(a, b) <= near){ Lg.set(k, 1); Lt.set(k, K.nearT != null ? K.nearT : 0.08); } else { const l = cmdLink1(W, a, b, a !== C); Lg.set(k, l.p); Lt.set(k, l.t); } }   // v7.14.1 다리마다 걸리는 시간도
  const P = {}, R = {}; for (const m of N){ P[m.i] = !C ? 0 : m === C ? 1 : Lg.get(C.i * 1000 + m.i) || 0; R[m.i] = rf(m); }
  if (C) for (let it = 0; it < 5; it++) for (const m of N){ if (m === C) continue; let miss = 1 - (Lg.get(C.i * 1000 + m.i) || 0);
    for (const q of N){ if (q === m || q === C || !P[q.i]) continue; const v = P[q.i] * (Lg.get(q.i * 1000 + m.i) || 0) * R[q.i]; if (v > 0) miss *= 1 - Math.min(0.98, v); }
    P[m.i] = Math.min(K.max || 0.98, 1 - miss); }
  const edges = []; for (let x = 0; x < N.length; x++) for (let y = x + 1; y < N.length; y++){ const a = N[x], b = N[y], p = Math.max(Lg.get(a.i * 1000 + b.i) || 0, Lg.get(b.i * 1000 + a.i) || 0); if (p >= 0.45) edges.push([a.i, b.i, +p.toFixed(2)]); }
  const T = {}; if (C){ const hopT = X.hopT != null ? X.hopT : 0.12, fin = new Set(); T[C.i] = 0;   // v7.14.1 징검다리: 가장 빨리 닿는 길 (30% 넘게 닿는 다리만)
    for (;;){ let a = null; for (const m of N) if (T[m.i] != null && !fin.has(m.i) && (!a || T[m.i] < T[a.i])) a = m; if (!a) break; fin.add(a.i);
      for (const b of N){ if (b === a || fin.has(b.i) || (Lg.get(a.i * 1000 + b.i) || 0) < 0.3) continue; const t = T[a.i] + Lt.get(a.i * 1000 + b.i) + (a === C ? 0 : hopT * Math.max(0.4, 1 - (X.relayFast != null ? X.relayFast : 0.12) * (a.cmd || 0))); if (T[b.i] == null || t < T[b.i]) T[b.i] = t; } } }
  return (M[key] = { t: W.t, P, T, edges });
}
function cmdLink(W, C, u){
  if (!C) return { p: 0, t: 0, via: 'none', why: '지휘관이 없음', c: null };
  if (C === u || AI6.includes('cmdlink')) return { p: 1, t: 0, via: 'self', why: '', c: C.i };
  const K = W.rules.cmdLink || {};
  if (dist(C, u) <= (K.near != null ? K.near : 2.5) && !(C.koT && W.t < C.koT)) return { p: 1, t: K.nearT != null ? K.nearT : 0.08, via: C.mute ? 'sign' : 'voice', why: '', c: C.i, near: true };   // v7.9.5 코앞은 말 한마디 — 소음 · 맞붙음에도 바로
  const a = cmdLink1(W, C, u);
  let best = { p: Math.min(K.max || 0.98, a.p), t: a.t, via: a.via, why: (a.busy ? ['맞붙어 있음'] : []).concat(a.via === 'none' || a.p < 0.6 ? a.why : []).join(' · '), c: C.i };
  if (a.p < 0.5){
    const X = W.rules.cmdLinkX || {}, ok = m => m !== C && m !== u && m.alive && !m.crawl && m.side === u.side && !(m.koT && W.t < m.koT);
    const q = m => (m.act && ['atk', 'skill', 'reload', 'heal'].includes(m.act.k) || W.units.some(f => f.alive && f.side !== m.side && !isFar(f) && gap(m, f) < Math.max(m.rng, f.rng) + 0.3) ? (X.relayBusy != null ? X.relayBusy : 0.6) : 1) * (m.cmd > 0 ? (X.relayCmd || 1.05) : 1);   // v7.9.2 전달자의 바쁨 · 지휘 점수
    const near = W.units.filter(m => ok(m) && dist(m, C) < 40), L1 = new Map();
    for (const m of near){ const b1 = cmdLink1(W, C, m); if (b1.p >= 0.3) L1.set(m, b1); }
    for (const [m, b1] of L1){ const b2 = cmdLink1(W, m, u, true), pr = b1.p * b2.p * (K.relay || 0.9) * q(m);   // 한 다리
      if (pr > best.p) best = { p: Math.min(K.max || 0.98, pr), t: b1.t + b2.t + (X.hopT != null ? X.hopT : 0.12), via: 'relay', m: m.i, why: m.name + (jongE(m.name) ? '을' : '를') + ' 거쳐 전함' + (q(m) < 1 && !(m.cmd > 0) ? ' (바빠 덜 확실)' : ''), c: C.i }; }
    if (best.p < 0.4) for (const [m1, b1] of L1) for (const m2 of near){ if (m2 === m1) continue;   // 두 다리: 지휘관 → m1 → m2 → 나
      const b12 = cmdLink1(W, m1, m2, true); if (b12.p < 0.3) continue; const b2 = cmdLink1(W, m2, u, true), pr = b1.p * b12.p * b2.p * (K.relay || 0.9) * (K.relay || 0.9) * (X.hop2 || 0.85) * q(m1) * q(m2);
      if (pr > best.p) best = { p: Math.min(K.max || 0.98, pr), t: b1.t + b12.t + b2.t + 2 * (X.hopT != null ? X.hopT : 0.12) + (X.hop2T != null ? X.hop2T : 0.05), via: 'relay', m: m1.i, m2: m2.i, why: m1.name + ' → ' + m2.name + ' 두 다리로 전함', c: C.i }; }
  }
  { const MN = meshNet(W, u.side, C), MP = MN.P[u.i] || 0, MT = MN.T ? MN.T[u.i] : null, X2 = W.rules.cmdLinkX || {};
    if (MP > best.p + 0.02) best = { ...best, p: Math.min(K.max || 0.98, MP), via: 'relay', t: MT != null ? MT : best.via === 'relay' ? best.t : (X2.meshT || 0.9) + (best.via === 'none' ? 0 : best.t), why: '지휘망 — 곁의 동료들이 거듭 전함', c: C.i, mesh: true };   // v7.13 그물 (이중 전달)
    else if (MT != null && best.via !== 'none' && MT < best.t - 0.05 && MP >= best.p - 0.1) best = { ...best, t: MT, via: 'relay', mesh: true, fast: true, why: (best.why ? best.why + ' · ' : '') + '징검다리 — 곁의 동료를 거쳐 더 빨리' }; }   // v7.14.1
  return best;
}
// v7.10 전파 파동: 지휘관의 말이 닿는 모두에게 동시에 가고, 받은 이가 못 받은 이에게 2차로 전함. list 의 각 이에게 {p: 기대 확률 (표시용), ok: 이번에 받았나, t: 받는 때, via, m, m2: 거친 이, hop: 받음 단계} 를 돌려줌
// v7.15 화면의 지시 점: 받은 명령이 거쳐 간 길 (다리마다) · 같이 외친 동료 — 출처 (대장 · 편대장) 를 남김 (아군만 그림)
function ordFxAdd(W, u, lk, src, dep){
  if (!lk || !lk.ok || !lk.legs || !lk.legs.length) return;
  const F = W.ordFx || (W.ordFx = []), end = Math.max(...lk.legs.map(l => l[3]), ...(lk.echo || []).map(l => l[3]));
  F.push({ u: u.i, src, dep: !!dep, t0: W.t, legs: lk.legs, echo: lk.echo || [], end: W.t + end + 0.5 });
  if (F.length > 60) W.ordFx = F.filter(f => W.t < f.end).slice(-60);
}
function cmdWave(W, C, list){
  if (!C) return list.map(() => ({ p: 0, t: 0, via: 'none', why: '지휘관이 없음', c: null, ok: false }));
  if (AI6.includes('cmdlink')) return list.map(u => ({ p: 1, t: 0, via: 'self', why: '', c: C.i, ok: true }));
  const K = W.rules.cmdLink || {}, X = W.rules.cmdLinkX || {}, V = W.rules.cmdLinkW || {}, hops = V.hops || 3, tol = V.tol != null ? V.tol : 0.12, near = K.near != null ? K.near : 2.5;
  const okm = m => m !== C && m.alive && !m.crawl && m.side === C.side && !(m.koT && W.t < m.koT);
  const cand = W.units.filter(okm), got = new Map(), tried = new Set();
  const qf = m => (m.act && ['atk', 'skill', 'reload', 'heal'].includes(m.act.k) || W.units.some(f => f.alive && f.side !== m.side && !isFar(f) && gap(m, f) < Math.max(m.rng, f.rng) + 0.3) ? (X.relayBusy != null ? X.relayBusy : 0.6) : 1) * (m.rank === '부대장' ? (X.relayRank || 1.12) : 1) * (1 + (X.relaySkill != null ? X.relaySkill : 0.06) * (m.cmd || 0));   // v7.13 지휘 솜씨
  const leg = (s, m, rl) => dist(s, m) <= near && !(s.koT && W.t < s.koT) ? { p: 1, t: K.nearT != null ? K.nearT : 0.08, via: s.mute ? 'sign' : 'voice' } : cmdLink1(W, s, m, rl);
  // v7.14.1 징검다리: 받은 이가 곧바로 곁에 되외침 — 가장 먼저 닿는 길 (시간 순 · 6단계까지). 다리마다 한 번만 굴림 · 먼 외침보다 곁의 동료를 거친 길이 빠르면 그 길로
  const best = new Map(), Q = [{ u: C, t: 0, hop: 0, chain: [] }], hopT = X.hopT != null ? X.hopT : 0.12;
  while (Q.length){
    let qi = 0; for (let j = 1; j < Q.length; j++) if (Q[j].t < Q[qi].t) qi = j; const s = Q.splice(qi, 1)[0];
    if (s.u !== C){ if (got.has(s.u.i)) continue; const r0 = best.get(s.u.i); if (!r0 || r0.t !== s.t) continue; got.set(s.u.i, r0); }
    if (s.hop >= hops) continue;
    const sr = best.get(s.u.i);
    for (const m of cand){
      if (m === s.u || tried.has(s.u.i + '>' + m.i)) continue;
      const done = got.get(m.i); if (done && ((done.alt || []).length >= 3 || (sr && (sr.from === m.i || sr.chain.includes(m.i))))) continue;   // v7.15 이미 받은 이에게도 같이 외침 (함께 외침 · 3까지) — 내게 전해 준 이에겐 안 되외침
      const l = leg(s.u, m, s.hop > 0); let p = l.p * (s.hop > 0 ? (K.relay || 0.9) * qf(s.u) * (s.hop > 1 ? X.hop2 || 0.85 : 1) : 1); if (cbHas(s.u, 'fell') && cbHas(m, 'fell')) p += (W.rules.combo || {}).fell || 0.15; p = Math.min(K.max || 0.98, p);   /* v8.7.5 굴에 떨어진 이들 — 서로의 목소리 */
      if (p < tol) continue; tried.add(s.u.i + '>' + m.i);
      if (W.rand() < p){ const t = s.t + l.t + (s.hop > 0 ? (hopT + (s.hop > 1 ? (X.hop2T != null ? X.hop2T : 0.05) : 0)) * Math.max(0.4, 1 - (X.relayFast != null ? X.relayFast : 0.12) * (s.u.cmd || 0)) : 0), cur = best.get(m.i);
        if (done){ if (t > done.t) (done.alt || (done.alt = [])).push({ from: s.u.i, tf: s.t, t }); continue; }
        if (!cur || t < cur.t){ const r = { t, hop: s.hop + 1, via: s.hop === 0 ? l.via : 'relay', chain: s.hop === 0 ? [] : s.chain.concat([s.u.i]), from: s.u.i, tf: s.t, p, alt: cur ? [{ from: cur.from, tf: cur.tf, t: cur.t }, ...(cur.alt || [])].slice(0, 3) : [] }; best.set(m.i, r); Q.push({ u: m, t, hop: s.hop + 1, chain: r.chain }); }
        else if ((cur.alt || (cur.alt = [])).length < 3) cur.alt.push({ from: s.u.i, tf: s.t, t }); } } }
  return list.map(u => {
    if (u === C) return { p: 1, t: 0, via: 'self', why: '', c: C.i, ok: true };
    const a = cmdLink(W, C, u), r = got.get(u.i);
    if (!r) return { p: a.p, t: a.t, via: a.via, why: a.why, c: C.i, m: a.m, m2: a.m2, ok: false };
    const nm = i => W.units[i].name, nodes = [C.i, ...r.chain, u.i], tms = [0, ...r.chain.map(i => (got.get(i) || {}).t || 0), r.t];   // v7.15 거쳐 간 길 (다리마다 떠난 때 · 닿은 때) · 함께 외침
    const legs = nodes.slice(1).map((b, k) => [nodes[k], b, +tms[k].toFixed(2), +tms[k + 1].toFixed(2)]), echo = (r.alt || []).filter(e => e.t < r.t + 3).map(e => [e.from, u.i, +(e.tf || 0).toFixed(2), +e.t.toFixed(2)]);
    return { legs, echo, p: Math.max(a.p, r.p), t: r.t, via: r.via, why: r.via === 'relay' ? (r.chain.length === 1 ? nm(r.chain[0]) + (jongE(nm(r.chain[0])) ? '을' : '를') + ' 거쳐 전함' : r.chain.map(nm).join(' → ') + ' ' + r.chain.length + '다리로 전함') + ' (지휘망)' : a.why, c: C.i, m: r.chain[0], m2: r.chain[1], hop: r.hop, ok: true }; });
}
/* ---------- v7.9 교전 규칙 (태세) ----------
   "명령 없이 돌격하고 사격하는 것이 패착의 90%" — 아군마다 교전 규칙을 가짐 (유저가 바꿈, 명령처럼 지휘관을 거쳐 닿음).
   자유 교전 free = 보이면 싸움 (옛 방식) · 판단 교전 smart (기본) = 들켰거나 · 전선이 열렸거나 · 확실히 우세할 때만 먼저 싸움 · 교전 금지 hold = 나를 노리는 상대를 막는 것 외엔 쏘지도 쫓지도 않음 · 사격 금지 nofire = 명령이 있을 때까지 쏘지 (던지지) 않음 (근접은 그대로).
   충동 impulse: 규칙을 어기고 스스로 덤빌지는 무작위가 아니라 점수 — 대담함 + 분노 (동료가 쓰러짐) + 상대의 약점 (등 · 사수 · 넘어짐 · 다침) − 두려움 (상처 · 지침). 넘으면 덤비고 그 까닭을 로그에 남김 (큰 이득 또는 고립 · 죽음). */
const ROE_TXT = { free: '자유 교전', smart: '판단 교전', hold: '교전 금지', nofire: '사격 금지' };
const roeOf = (W, u) => u.side !== 0 ? 'free' : (u.roe || (W.rules.roe || {}).def || 'smart');
const powOf = u => u.down || !u.alive ? 0 : Math.max(1, u.hp) * Math.max(8, u.atk || 20) * (u.crawl ? 0.3 : 1);
// 지금 전황 (0.5초마다): 들켰나 · 전선이 열렸나 · 아군/적 힘의 비
function engTick(W){
  const R = W.rules.roe || {}, al = W.units.filter(u => u.alive && u.side === 0 && !u.down);
  if (!al.length){ W.eng = null; return; }
  const kn = f => f.alive && f.side === 1 && (f.seenBy || al.some(a => fresh(W, a.sense[f.i], 3))), foes = W.units.filter(kn);
  const hit = al.some(a => W.t - (a.hitT || -99) < (R.hitT || 6)) || foes.some(f => f.act && f.act.b != null && W.units[f.act.b] && W.units[f.act.b].side === 0 && f.act.phase === 'wind');
  const noticed = W.units.some(f => f.alive && f.side === 1 && f.state === 'hunt' && f.target && f.target.side === 0 && f.target.alive && dist(f, f.target) < (R.noticeD || 10));
  let odds = Infinity, nA = 0;
  if (foes.length){
    const cx = foes.reduce((s, f) => s + f.x, 0) / foes.length, cy = foes.reduce((s, f) => s + f.y, 0) / foes.length;
    const A = al.filter(a => Math.hypot(a.x - cx, a.y - cy) < 16).reduce((s, a) => { nA++; return s + powOf(a); }, 0), B = foes.reduce((s, f) => s + powOf(f), 0);
    odds = B > 0 ? A / B : Infinity;
  }
  const open = hit || noticed, was = W.eng && W.eng.open;
  W.eng = { t: W.t, open, hit, noticed, odds, nF: foes.length, nA, out: open && odds < (R.out != null ? R.out : 0.7) };
  if (open && !was) L(W, { k: 'engOpen', why: hit ? '동료가 맞음' : '적이 우리를 쫓음', odds: odds === Infinity ? null : +odds.toFixed(2), nF: foes.length, vis: true });
  roeLift(W, open, hit);
}
/* v7.16.1 교전 금지는 싸움 전의 태세: 싸움이 시작되면 (전선이 열림 — 동료가 맞음 · 적이 우리를 쫓음 — 또는 우리가 먼저 맞힘) 교전 금지인 아군 모두 판단 교전으로 (전달 없이 · 한 번만).
   가는 중인 교전 금지 지시도 판단 교전으로 바뀜. 그 뒤에 다시 교전 금지를 주면 그대로 지킴 */
function roeLift(W, open, hit){
  const R = W.rules.roe || {}; if (W.battle0 != null || R.autoLift === false) return;
  const first = !open && W.units.some(f => f.alive && f.side === 1 && f.hitSide === 0 && W.t - (f.hitT == null ? -99 : f.hitT) < 1);
  if (!open && !first) return;
  W.battle0 = W.t; const A = [], P = [];
  for (const a of W.units){ if (a.side !== 0 || !a.alive) continue;
    if (roeOf(W, a) === 'hold'){ a.roe = 'smart'; a.roeAuto = W.t; A.push(a.i); }
    for (const q of a.posPend || []) if (q.key === 'roe' && q.val === 'hold'){ q.val = 'smart'; if (!A.includes(a.i)) P.push(a.i); } }
  if (A.length || P.length) L(W, { k: 'roeAuto', a: A, pend: P, why: first ? '우리가 먼저 침' : hit ? '동료가 맞음' : '적이 우리를 쫓음', vis: true });
}
// 나를 지키는 싸움 (교전 금지에서도 허용): 나를 노려 준비 중 · 방금 맞았고 가까이 있음 · 손 닿는 곳에서 나를 쫓음
function selfDef(W, u, f){
  const R = W.rules.roe || {};
  if (f.act && f.act.b === u.i) return true;
  if (W.t - (u.hitT || -99) < 2.5 && gap(u, f) < Math.max(f.rng, 0.6) + 1.2) return true;
  return gap(u, f) < Math.max(f.rng, 0.5) + (R.selfD != null ? R.selfD : 0.35) && (f.target === u || f.state === 'hunt');
}
// 충동 점수: 대담함 · 분노 · 약점 · 두려움 (+ 지휘와 끊김). 무작위 아님
function impulseOf(W, u, f){
  const hpF = u.hp / u.max, dead = W.units.filter(a => a.side === u.side && a !== u && (!a.alive || a.down) && W.t - (a.deadT != null ? a.deadT : a.downT != null ? a.downT : -99) < 25).length;
  const anger = Math.min(1, dead * 0.45), vuln = Math.min(1, (isFar(f) && !f.act ? 0.45 : 0) + (sideOf(W, f, u) !== 'front' ? 0.4 : 0) + (prone(W, f) ? 0.4 : 0) + (f.hp / f.max < 0.35 ? 0.3 : 0) + (f.state !== 'hunt' ? 0.2 : 0));
  const fear = Math.min(1, (1 - hpF) * 0.6 + (u.exhausted ? 0.3 : u.tired ? 0.15 : 0)) * (u.heroic ? 0.3 : 1), cut = u.posUnk ? 0.1 : 0;   // v7.17 [영웅] 은 다쳐도 겁먹지 않음
  const s = 0.45 * (u.bold || 0) + 0.3 * anger + 0.35 * vuln - 0.5 * fear + cut;
  return { s, bold: u.bold || 0, anger, vuln, fear, cut };
}
function impulseOK(W, u, f, m){
  const R = W.rules.roe || {}, I = impulseOf(W, u, f), thr = (R.impulse != null ? R.impulse : 0.62) + (m === 'hold' ? 0.18 : 0);
  if (I.s < thr) return false;
  if (W.t - u.impT > 8){ u.impT = W.t; u.deviT = W.t; u.lastDec = { t: W.t, s: `충동 — ${f.name}에게 스스로 (점수 ${I.s.toFixed(2)} ≥ ${thr.toFixed(2)})` };
    L(W, { k: 'impulse', a: u.i, b: f.i, m, s: +I.s.toFixed(2), thr: +thr.toFixed(2), bold: +I.bold.toFixed(2), anger: +I.anger.toFixed(2), vuln: +I.vuln.toFixed(2), fear: +I.fear.toFixed(2), vis: true }); }
  return true;
}
// 교전 규칙이 막는가: '' (허용) · 'nofire' · 'hold' · 'quiet'. kind 'fire' = 쏨 · 던짐
function roeBlock(W, u, f, kind){
  if (u.side !== 0) return '';
  const m = roeOf(W, u); if (m === 'free') return '';
  if (offT(W, u) >= ((W.rules.hm || {}).offT || 6) && u.mission && ['attack', 'charge', 'throw', 'assn', 'palm'].includes(u.mission.k) && u.mission.b === f.i && m !== 'nofire') return '';   // v7.9.4 연락이 끊겨도 받은 표적 임무는 계속
  if (m === 'nofire') return kind === 'fire' || (kind == null && isFar(u)) ? 'nofire' : '';
  if (selfDef(W, u, f)) return '';
  const E = W.eng, R = W.rules.roe || {};
  if (m === 'smart' && (!E || E.open || E.odds >= (R.odds != null ? R.odds : 0.9))) return '';
  if (impulseOK(W, u, f, m)) return '';
  return m === 'hold' ? 'hold' : 'quiet';
}
function roeNote(W, u, f, why){
  u.quiet = W.t; const R = W.rules.roe || {};
  if (W.t - u.roeLogT < (R.logGap || 6)) return; u.roeLogT = W.t;
  const E = W.eng;
  u.lastDec = { t: W.t, s: `${f.name} 보임 — ${why === 'nofire' ? '사격 금지' : why === 'hold' ? '교전 금지' : '열세에 안 들켰으니 교전 보류'}` };
  L(W, { k: 'roeHold', a: u.i, b: f.i, why, m: roeOf(W, u), odds: E && E.odds !== Infinity ? +E.odds.toFixed(2) : null, vis: true });
  setMood(W, u, why === 'nofire' ? '사격 금지' : why === 'hold' ? '교전 금지' : '지켜봄 — 교전 보류', f.i);
}
// 태세 바꾸기 (교전 규칙 · 치료 방침): 명령처럼 지휘관을 거쳐 닿음. 같은 종류를 다시 보내면 앞의 것을 대신함 (늦게 닿은 옛 것이 새것을 덮지 않음)
const POSTURES = { roe: ['free', 'smart', 'hold', 'nofire'], heal: ['dying', 'free', 'order'], sq: ['main', 'dep'], lie: ['down', 'up'] };   // v7.16.1 포복 · 일어남
function applyPosture(W, u, key, val, c){
  if (key === 'lie'){ lieSet(W, u, val === 'down', '명령'); return; }   /* v7.16.1 포복 · 일어남 명령이 닿음 — 제자리처럼 바로 */
  if (key === 'sq'){ const Dp = deputyOf(W, u.side), prev = u.sqLead != null ? 'dep' : 'main'; u.sqLead = val === 'dep' && Dp && Dp !== u && !u.hero ? Dp.i : null; u.sqAuto = false; const now = u.sqLead != null ? 'dep' : 'main'; if (prev !== now) L(W, { k: 'posture', a: u.i, key, val: now, prev, c: c != null ? c : null, b: Dp ? Dp.i : null, vis: true }); return; }   // v7.10 편대 배속
  const prev = key === 'roe' ? roeOf(W, u) : (u.healPol || (W.rules.heal || {}).pol || 'dying');
  if (key === 'roe') u.roe = val; else u.healPol = val;
  if (prev !== val) L(W, { k: 'posture', a: u.i, key, val, prev, c: c != null ? c : null, vis: true });
}
function sendPosture(W, list, key, val, opt){
  if (!POSTURES[key] || !POSTURES[key].includes(val)) return;
  const C = cmdBoss(W, 0), pre = W.t <= 1e-6, raw = opt && opt.raw;
  const lst = list.filter(u => u.alive && u.side === 0), wv = raw || pre ? null : cmdWave(W, C, lst);
  for (const u of lst){ const k0 = lst.indexOf(u);
    const lk = wv ? wv[k0] : { p: 1, t: 0, via: 'self' };
    u.posPend = (u.posPend || []).filter(q => q.key !== key);
    if (lk.via === 'self'){ applyPosture(W, u, key, val, C ? C.i : null); continue; }
    u.posPend.push({ key, val, at: W.t + lk.t, ok: lk.ok !== undefined ? lk.ok : W.rand() < lk.p, p: lk.p, via: lk.via, why: lk.why, c: lk.c, t0: W.t }); if (C) ordFxAdd(W, u, lk, C.i, false);   // v7.15
  }
}
function postureTick(W){
  for (const u of W.units){ if (u.side !== 0 || !u.posPend || !u.posPend.length) continue;
    const keep = [];
    for (const P of u.posPend){ if (W.t < P.at){ keep.push(P); continue; } if (!u.alive) continue;
      if (P.ok){ applyPosture(W, u, P.key, P.val, P.c); }
      else { L(W, { k: 'cmdMiss', side: 0, a: u.i, c: P.c, via: P.via, why: P.why, p: +P.p.toFixed(2), o: P.key === 'lie' ? (P.val === 'down' ? '엎드려 (포복)' : '일어나') : (P.key === 'roe' ? ROE_TXT[P.val] : P.key === 'sq' ? '편대' : '치료 방침') + ' 태세', vis: true }); } }   /* v7.16.1 포복 · 편대 이름 */
    u.posPend = keep; }
}
// 치료: 이 동료를 지금 치료할 만한가 — 0 아님 · 1 치료할 만함 (옛 기준) · 2 죽기 직전
function healTier(W, u, a, thr){
  const H = W.rules.heal || {}, K = u.skill, f = a.hp / a.max;
  if (K && K.kit && a.down) return 2;
  if (!a.alive) return 0;
  if (f < (H.dying != null ? H.dying : 0.22) || (a.bleed && f < (H.bleed != null ? H.bleed : 0.35)) || injUrgent(W, a)) return 2;
  return f < thr || a.bleed ? 1 : 0;
}
// 나를 노린 치명적인 일격이 오고 있고 내가 그걸 알아봤나 (보이거나 아주 가까움): 그 상대를 돌려줌
function perilOn(W, u){
  const H = W.rules.heal || {}; let best = null;
  for (const e of W.units){
    if (!e.alive || e.side === u.side || !e.act || e.act.b !== u.i || e.act.phase !== 'wind') continue;
    if (!(canSee(W, u, e) || gap(u, e) < 2.2)) continue;
    if (!isFar(e) && gap(u, e) > e.rng + W.rules.reach + 0.6) continue;
    if ((e.atk || 20) < u.hp * (H.lethal != null ? H.lethal : 0.3)) continue;
    const eta = Math.max(0, (e.act.end || W.t) - W.t); if (!best || eta < best.eta) best = { e, eta };
  }
  return best;
}
// v7.9 주무장이 근접 (맨손 포함) 이면 땅의 활 · 총을 쓰지 않음 — 사격 솜씨가 없는데 주워서 쏘는 건 말이 안 됨
function mayWield(W, u, it){
  const wp = (W.rules.weapons || {})[it.name]; if (!wp || !isRangedW(wp)) return true;
  const k0 = (W.rules.weapons || {})[(u.kit0 && u.kit0.weapon) || ''];
  return (k0 && isRangedW(k0)) || (u.mk0 || 0) >= 0.24 || u.role === '사수';
}
/* ---------- v7.9.4 연락 · 임시 집결 · 망치와 모루 · 연락 두절 임무 ---------- */
const hash01 = (a, b, c) => { let x = Math.imul(a * 73856093 ^ b * 19349663 ^ c * 83492791, 2654435761) >>> 0; return (x % 10007) / 10007; };   // 무작위 아님 — 같은 (사람 · 일 · 때) 면 같은 판단
// 0.5초마다: 지휘관과 닿는 정도 (net) · 닿지 않은 시간 (offT) · 마지막으로 지휘관이 있던 자리 (bossAt)
function netTick(W){
  const C = cmdBoss(W, 0), H = W.rules.hm || {};
  W.mesh0 = C ? meshNet(W, 0, C) : null;   // v7.13 판에 그릴 지휘망 (곁의 동료끼리 닿는 줄)
  if (C && W.bossI != null && W.bossI !== C.i){ const B0 = W.units[W.bossI]; L(W, { k: 'succeed', a: C.i, from: W.bossI, deputy: C.rank === '부대장', left: B0 && B0.gone && B0.gone !== 'left' ? 1 : null, vis: true }); } if (C) W.bossI = C.i;   /* v8.7.3 먼저 올라간 지휘관 */   // v7.10 지휘 계승
  for (const u of W.units){ if (u.side !== 0 || !u.alive) continue;
    const lk0 = !C ? { p: 0, via: 'none' } : u === C ? { p: 1, via: 'self' } : cmdLink(W, C, u), p = lk0.p; u.net = p; u.netL = { p: +p.toFixed(2), via: lk0.via, m: lk0.m != null ? lk0.m : null, m2: lk0.m2 != null ? lk0.m2 : null, t: +(lk0.t || 0).toFixed(2) };   // v7.9.5 지휘망 (판에 그림)
    { const mates = W.units.filter(a => a.alive && a !== u && a.side === 0 && !a.down), foeNear = W.units.some(f => f.alive && f.side === 1 && dist(f, u) < 12 && (f.seenBy || fresh(W, u.sense[f.i], 4)));   // v7.9.5 고립: 동료가 9칸 밖 + 아는 적이 12칸 안 (제자리 명령으로 서 있는 이에게 알림)
      const iso = mates.length > 0 && Math.min(...mates.map(a => dist(a, u))) > 9 && foeNear; if (iso && !u.iso) L(W, { k: 'iso', a: u.i, hold: !!(u.order && u.order.k === 'hold'), vis: true }); u.iso = iso; }
    if (p >= 0.4){ if (u !== C && u.offFrom != null && W.t - u.offFrom >= (H.offT || 6)) L(W, { k: 'netBack', a: u.i, sec: Math.round(W.t - u.offFrom), vis: true }); u.offFrom = null; u.offLog = false; if (C) u.bossAt = { x: C.x, y: C.y, t: W.t }; }
    else if (p < 0.2){ if (u.offFrom == null) u.offFrom = W.t; if (!u.offLog && W.t - u.offFrom >= (H.offT || 6)){ u.offLog = true; L(W, { k: 'netLost', a: u.i, m: u.mission ? orderTxt(u.mission.o, u) : null, vis: true }); } } }
}
const offT = (W, u) => u.offFrom != null ? W.t - u.offFrom : 0;
// v7.10 부대장의 편대: 자동 편입 · 해제 + 자율 지휘 (표적 외침 · 힘이 모자라면 편대를 이끌고 본대로)
function deputyTick(W){
  const S = W.rules.sq || {}, D = deputyOf(W, 0); if (!D || AI6.includes('deputy')) return;
  const boss = cmdBoss(W, 0), sq = () => W.units.filter(u => u.alive && u.side === 0 && u.sqLead === D.i && !u.down);
  for (const u of W.units){ if (u.side !== 0 || !u.alive || u === D || u.hero) continue;
    const off = offT(W, u);
    if (u.sqLead == null && boss && boss !== D && off >= (S.joinT || 4) && dist(u, D) < (S.near || 14) && cmdLink(W, D, u).p >= 0.5){ u.sqLead = D.i; u.sqAuto = true; u.sqOk = 0; L(W, { k: 'sqJoin', a: u.i, b: D.i, vis: true }); }
    else if (u.sqLead != null && u.sqAuto){ u.sqOk = (u.net || 0) >= 0.6 ? (u.sqOk || 0) + 0.5 : 0; if (u.sqOk >= (S.leaveT || 4)){ u.sqLead = null; u.sqAuto = false; L(W, { k: 'sqLeave', a: u.i, b: D.i, vis: true }); } }
    if (u.sqLead != null && u.sqLead !== D.i) u.sqLead = null; }
  const members = sq(); if (!members.length || D.down || D.crawl || (D.koT && W.t < D.koT)){ if (!members.length) D.sqFocus = null; return; }   // v7.13 명령을 받은 편대장도 편대를 지휘함
  const grp = [D].concat(members), kn = f => f.alive && f.side === 1 && dist(f, D) < 16 && (f.seenBy || grp.some(a => fresh(W, a.sense[f.i], 3))), known = W.units.filter(kn);
  if (!known.length){ D.sqFocus = null; return; }
  const mine = grp.filter(a => dist(a, D) < 14).reduce((s, a) => s + powOf(a), 0), theirs = known.filter(f => dist(f, D) < 12).reduce((s, f) => s + powOf(f), 0) || 1, odds = mine / theirs;
  if (odds < (S.fall != null ? S.fall : 0.6) && !D.order && !(D.sqFall && W.t < D.sqFall)){ D.sqFall = W.t + (S.fallT || 10); D.sqFocus = null; L(W, { k: 'sqFall', a: D.i, n: members.length, odds: +odds.toFixed(2), vis: true }); D.lastDec = { t: W.t, s: `편대 ${members.length + 1}명의 힘이 적의 ${(odds * 100).toFixed(0)}% — 본대로 물러남` }; return; }
  if (D.sqFall && W.t < D.sqFall) return;
  sqBrain(W, D, members, known, odds);   // v7.13 이득 확률로 고른 지시
}
// v7.13 편대장 자율 지시: 아는 적마다 '지금 이 표적을 치면 이득일 확률' 을 셈 (편대의 화력으로 몇 초에 쓰러뜨리나 · 사수 · 다침 · 붙들림 · 고립 · 나를 노림 − 둘레의 적 · 거구 · 방패).
//   가장 높은 수가 pMin 을 넘으면 명령이 없는 편대원에게 지휘망으로 지시 (대장의 명령을 받은 이는 건드리지 않음 · 교전 규칙도 지킴). 편대장을 노리는 근접은 떼어 냄 (peel).
//   지휘 D = 지시 못 함 · C = dec 초마다 기본 셈만 (흔들림 큼) · B 이상 = 붙들림 · 고립 · 지휘하는 적까지 보고 덜 흔들림
function sqBrain(W, D, M, known){
  const S = W.rules.sq || {}, SB = S.brain || {}, g = Math.max(0, Math.min(4, Math.round(D.cmd || 0)));
  if (g < 1){ if (!D.sqWeakLog){ D.sqWeakLog = true; L(W, { k: 'sqWeak', a: D.i, vis: true }); } const cur0 = D.sqFocus && W.units[D.sqFocus.b]; if (cur0 && cur0.alive) D.sqFocus.t = W.t; return; }
  const cur = D.sqDec && W.units[D.sqDec.b] && W.units[D.sqDec.b].alive ? D.sqDec : null; if (D.sqFocus && cur) D.sqFocus.t = W.t;
  if (W.t < (D.sqBrainT || 0)) return; D.sqBrainT = W.t + ((SB.dec || [])[g] || 3);
  const nz = (SB.noise || [])[g] || 0, jit = () => Math.max(0, 1 + nz * ((W.rand() + W.rand() + W.rand() - 1.5) / 0.5)), R = W.rules;
  const free = M.filter(m => !m.hero && !m.down && !m.crawl && !(m.order && !m.order.dep) && !(m.ordPend && !(m.ordPend.o && m.ordPend.o.dep)) && !(m.ordQ || []).some(q => !(q.o && q.o.dep)) && !(m.koT && W.t < m.koT));
  const grp = [D].concat(M), dps = (m, f) => (m.atk || 20) * (m.atkMul || 1) * (R.lethal || 1) * (isFar(m) ? (m.ammo === 0 ? 0 : 0.6) : 0.75) / Math.max(0.4, (m.wind || 0.5) + (m.rec || 0.5));
  const opts = [];
  for (const f of known){ if (dist(f, D) > 14) continue;
    const hpE = pHp(W, D.side, f) * (iRec(W, D.side, f).guess || f.max), tK = hpE / Math.max(1, grp.reduce((a, m) => a + (dist(m, f) < 10 ? dps(m, f) : 0), 0)), pK = 1 / (1 + Math.exp((tK - (SB.killT || 5)) / 1.5));
    const near = W.units.filter(o => o.alive && o !== f && o.side === f.side && !isFar(o) && dist(o, f) < 2.5).length, thr = !isFar(f) && dist(f, D) < (SB.peel || 3.5) && (focusOf(W, f) === D || f.target === D);
    let val = 1 + (isFar(f) ? 0.4 : 0) + (pHp(W, D.side, f) < 0.4 ? 0.2 : 0) + (thr ? 0.5 : 0), why = [];
    if (isFar(f)) why.push('사수'); if (pHp(W, D.side, f) < 0.4) why.push('다침'); if (thr) why.push('나를 노림');
    if (g >= 2){ if (W.hm && W.hm.pins && W.hm.pins.has(f.i)){ val += 0.3; why.push('본대에 붙들림'); } if (!near){ val += 0.2; why.push('고립'); } if (f.cmd > 0){ val += 0.3; why.push('지휘'); } }
    const risk = Math.min(0.8, near * 0.15 + (f.giant ? 0.25 : 0) + (f.shield && guardOn(W, f) ? 0.15 : 0));
    const p = Math.min(0.99, pK * val * (1 - risk) * jit());
    opts.push({ k: thr ? 'peel' : 'focus', b: f.i, p: thr ? Math.max(p, 0.85 * jit()) : p, why: why.join(' · '), tK: +tK.toFixed(1) });
  }
  opts.push({ k: 'hold', b: null, p: (SB.hold != null ? SB.hold : 0.25) * jit(), why: '하던 대로' });
  opts.sort((a, b) => b.p - a.p);
  const best = opts[0]; if (!best || best.k === 'hold' || best.p < (SB.pMin || 0.35)) return;
  if (cur && cur.b === best.b) return;
  if (cur && best.p < (cur.p || 0) * (SB.keep || 1.15) && best.k !== 'peel') return;
  const f = W.units[best.b];
  let rc = free.filter(m => !roeBlock(W, m, f, isFar(m) ? 'fire' : 'melee') && !(m.order && m.order.dep && m.order.b === f.i));
  if (best.k === 'peel') rc = rc.filter(m => !isFar(m)).sort((a, b) => dist(a, f) - dist(b, f)).slice(0, 1);
  D.sqDec = { k: best.k, b: f.i, t: W.t, p: best.p }; D.sqFocus = { b: f.i, t: W.t, t0: W.t };
  if (rc.length){ const wv = cmdWave(W, D, rc); rc.forEach((m, k) => { const lk = wv[k]; ordPush(W, m, { o: { k: 'attack', b: f.i, dep: D.i }, m2: lk.m2, at: W.t + lk.t, ok: lk.ok, hop: lk.hop, p: lk.p, via: lk.via, why: lk.why, c: D.i, m: lk.m, t0: W.t, legs: !!lk.legs });   /* v8.7.3 명령 줄 */ ordFxAdd(W, m, lk, D.i, true); }); }   // v7.15 편대장의 지시 점
  L(W, { k: 'sqDec', a: D.i, g, dk: best.k, b: f.i, p: +best.p.toFixed(2), why: best.why, tK: best.tK, to: rc.map(m => m.i), alt: opts.slice(1, 3).map(o => [o.k, o.b, +o.p.toFixed(2)]), vis: true });
  D.lastDec = { t: W.t, s: `편대에 ${f.name} — ${best.k === 'peel' ? '나를 노리는 근접을 떼어 냄' : '이득 확률 ' + Math.round(best.p * 100) + '%'}${best.why ? ' (' + best.why + ')' : ''}` };
}
// 임시 집결: 전선이 무너지면 지휘관이 집결지를 부름 (못 들은 이는 각자)
function rallyTick(W){
  const R = W.rules.rally || {}; if (R.on === false) return;
  const al = W.units.filter(u => u.side === 0 && u.alive && !u.down), E = W.eng;
  const fallen = new Set(W.units.filter(u => u.side === 0 && ((!u.alive && !u.gone) || u.down)).map(u => u.i)), prev = W.fallenSet || new Set();   /* v8.7.3 나감은 잃음이 아님 */
  for (const i of fallen) if (!prev.has(i)) (W.lossLog || (W.lossLog = [])).push(W.t);
  W.fallenSet = fallen;
  const C = cmdBoss(W, 0); if (!C || !E || !E.open || al.length < 2) return;
  if (W.rally && W.t < W.rally.until) return; if (W.rally && W.t < W.rally.t0 + (R.cd || 25)) return;
  if (W.boss0 == null) W.boss0 = C.i; const b0 = W.units[W.boss0]; if (b0 && !b0.alive && !b0.gone && W.bossLostT == null) W.bossLostT = W.t;
  const recent = (W.lossLog || []).filter(x => W.t - x <= (R.t || 12)).length, bossLost = W.bossLostT != null && W.t - W.bossLostT < 15;
  if (!((recent >= (R.n || 2) && E.odds < (R.odds != null ? R.odds : 1)) || (bossLost && E.odds < 1.2 && recent >= 1))) return;
  const near = al.filter(a => dist(a, C) < 7), cx = near.reduce((s, a) => s + a.x, 0) / near.length, cy = near.reduce((s, a) => s + a.y, 0) / near.length;
  const foes = W.units.filter(f => f.alive && f.side === 1 && (f.seenBy || al.some(a => fresh(W, a.sense[f.i], 3))));
  let dx = 0, dy = 0; if (foes.length){ const fx = foes.reduce((s, f) => s + f.x, 0) / foes.length, fy = foes.reduce((s, f) => s + f.y, 0) / foes.length, d = Math.hypot(cx - fx, cy - fy) || 1; dx = (cx - fx) / d; dy = (cy - fy) / d; }
  let px = cx, py = cy; for (let k = (R.back || 2.5); k >= 0; k -= 0.5){ const x = Math.max(0.8, Math.min(W.map.W - 0.8, cx + dx * k)), y = Math.max(0.8, Math.min(W.map.H - 0.8, cy + dy * k)); if (!boxRock(W, x, y, 0.4)){ px = x; py = y; break; } }
  W.rally = { x: px, y: py, t0: W.t, until: W.t + (R.hold || 20), by: C.i }; const got = [], miss = [];
  const rl = al.filter(u => !u.order && u !== C), rw = cmdWave(W, C, rl);
  for (const u of al){ if (u.order) continue; if (u === C){ u.rally = { x: px, y: py, t0: W.t, until: W.t + (R.hold || 20), by: C.i }; got.push(u.i); continue; }
    const lk = rw[rl.indexOf(u)]; if (lk.ok){ u.rally = { x: px, y: py, t0: W.t + lk.t, until: W.t + (R.hold || 20), by: C.i }; got.push(u.i); ordFxAdd(W, u, lk, C.i, false); } else miss.push(u.i); }
  L(W, { k: 'rally', a: C.i, x: +px.toFixed(1), y: +py.toFixed(1), why: bossLost ? '지휘관이 쓰러져 ' + C.name + (jongE(C.name) ? '이' : '가') + ' 이어받음' : `최근 ${recent}명이 쓰러지고 힘의 비 ${E.odds === Infinity ? '—' : E.odds.toFixed(2)}`, got, miss, vis: true });
}
function rallyStep(W, u, dt){
  const r = u.rally; if (!r) return false;
  if (W.t > r.until){ u.rally = null; return false; }
  if (W.t < r.t0) return false;
  if (u.act || W.units.some(f => f.alive && f.side !== u.side && ((!isFar(f) && gap(u, f) < Math.max(u.rng, f.rng) + 2.5) || (isFar(f) && gap(u, f) < f.rng && f.target === u)) && (f.target === u || focusOf(W, f) === u || dist(f, u) < 3))) return false;   // 맞붙었거나 곧 붙을 상대가 나를 보면 싸움이 먼저 (등을 보이며 물러나지 않음)
  if (Math.hypot(r.x - u.x, r.y - u.y) < (W.rules.rally || {}).near2 || 0) return false;
  if (Math.hypot(r.x - u.x, r.y - u.y) < 1.8){ if (!r.arr){ r.arr = true; u.stay = { x: r.x, y: r.y }; L(W, { k: 'rallyArrive', a: u.i, vis: true }); } return false; }
  setMood(W, u, '재집결'); u.lastDec = { t: W.t, s: `집결지로 (${r.by != null && W.units[r.by] ? W.units[r.by].name + '의 부름' : ''})` }; goTo(W, u, r.x, r.y, dt); return true;
}
// 연락 두절: 마지막 임무 (mission) 로 판단 — 자리면 그 자리 · 표적이면 그 표적 · 없으면 마지막으로 지휘관을 본 자리로 (가끔 엉뚱하게)
function offStep(W, u, dt){
  const H = W.rules.hm || {}; if (H.offOn === false || u.order || u.act || offT(W, u) < (H.offT || 6)) return false;
  if (W.units.some(f => f.alive && f.side !== u.side && canSee(W, u, f) && dist(u, f) < 7)) return false;   // 적이 가까우면 교전 규칙이 먼저
  const M = u.mission, K = M ? M.k : null; let kind, gx = null, gy = null;
  if (M && ['move', 'hold', 'amove', 'line', 'watch'].includes(K) && (M.x != null || u.stay)){ kind = 'post'; gx = M.x != null ? M.x : u.stay.x; gy = M.y != null ? M.y : u.stay.y; }
  else if (M && ['attack', 'charge', 'throw', 'assn', 'palm', 'leap'].includes(K) && M.b != null && W.units[M.b] && W.units[M.b].alive && fresh(W, u.sense[M.b], 10)){ kind = 'target'; gx = u.sense[M.b].x; gy = u.sense[M.b].y; }
  else if (u.bossAt){ kind = 'rejoin'; gx = u.bossAt.x; gy = u.bossAt.y; if (hash01(u.i, 7, Math.floor(W.t / 10)) < 0.2){ gx += (hash01(u.i, 3, Math.floor(W.t / 10)) - 0.5) * 8; gy += (hash01(u.i, 5, Math.floor(W.t / 10)) - 0.5) * 8; kind = 'rejoinErr'; } }
  else return false;
  if (u.offKind !== kind){ u.offKind = kind; u.lastDec = { t: W.t, s: kind === 'post' ? '연락 두절 — 마지막 임무대로 그 자리를 지킴' : kind === 'target' ? '연락 두절 — 마지막 임무의 표적을 계속' : kind === 'rejoin' ? '연락 두절 — 마지막으로 지휘관을 본 자리로 합류' : '연락 두절 — 지휘관 쪽으로 어림해 감 (빗나갈 수 있음)' };
    L(W, { k: 'offAct', a: u.i, kind, m: M ? orderTxt(M.o, u) : null, vis: true }); }
  if (Math.hypot(gx - u.x, gy - u.y) < 1.2){ if (kind === 'post' || kind === 'rejoin') u.stay = { x: gx, y: gy }; stop(u); return kind !== 'target'; }
  setMood(W, u, kind === 'post' ? '임무 자리로' : kind === 'target' ? '임무 표적을 찾아' : '지휘관 쪽으로'); goTo(W, u, gx, gy, dt); return true;
}
// 망치와 모루: 붙들린 상대 (모루: 동료가 붙들고 상대가 그 동료를 봄) 와 붙든 이를 알아봄 (0.5초마다)
function hmTick(W){
  const H = W.rules.hm || {}, pins = new Map();
  for (const f of W.units){ if (!f.alive || f.side !== 1 || !(f.seenBy)) continue;
    for (const a of W.units){ if (!a.alive || a.side !== 0 || a.down || isFar(a) || a.crawl || a.kb || prone(W, a) || (a.mass < f.mass * (H.pinMass != null ? H.pinMass : 0.3) && !a.shield && !a.bodyShield)) continue;   // v7.13 넘어진 · 너무 가벼운 몸은 모루가 아님
      if (gap(a, f) < Math.max(a.rng, f.rng) + (H.pinGap || 0.9) && focusOf(W, f) === a && angDiff(f.face, Math.atan2(a.y - f.y, a.x - f.x)) < (H.face || 0.9)){ if (!pins.has(f.i)) pins.set(f.i, []); pins.get(f.i).push(a.i); } } }
  W.hm = { pins };
  for (const u of W.units){ if (u.side !== 0) continue; const was = u.hm; let nu = null;
    for (const [fi, L2] of pins) if (L2.includes(u.i)) nu = { k: 'anvil', b: fi };
    if (!nu && u.alive && ((u.order && u.order.k === 'flank') || (/협공|측면|옆으로/.test(u.mood || '') && u.target && pins.has(u.target.i)))) nu = { k: 'hammer', b: u.order && u.order.k === 'flank' ? u.order.b : u.target.i };
    u.hm = nu; if (nu && (!was || was.k !== nu.k || was.b !== nu.b)) L(W, { k: 'hm', a: u.i, r: nu.k, b: nu.b, vis: true }); }
}
// 앞을 가로지르지 않고 호를 그려 돌아 들어갈 중간 지점
function arcVia(W, u, t, p){
  const R = t.r + u.r + Math.max(t.rng, 0.5) + 1.1, au = Math.atan2(u.y - t.y, u.x - t.x), ap = Math.atan2(p.y - t.y, p.x - t.x);
  let d = ap - au; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
  if (Math.abs(d) < 1.2 || dist(u, t) < R * 0.8) return p;
  const dd = angDiff(au + d / 2, t.face) < 0.9 ? (d > 0 ? d - 2 * Math.PI : d + 2 * Math.PI) : d, wa = au + dd * 0.5, q = { x: t.x + Math.cos(wa) * R, y: t.y + Math.sin(wa) * R };
  return boxRock(W, q.x, q.y, u.r * 0.9) ? p : q;
}
// v8.7.4 전열 끝 (I22): u 에서 p 로 가는 곧은 길이 상대 전열 (t 편 근접 몸 — 길에서 몸 + 0.9칸 안 · 서로 2.2칸으로 이어진 무리) 을 가로지르면 그 전열의 가까운 끝 (끝 몸 옆 몸 + 1.2칸) 을 거쳐 감 — 아는 몸만
function lineEndVia(W, u, t, p){
  const F = W.units.filter(f => f.alive && !f.down && !f.lie && f.side === t.side && f !== t && !isFar(f) && (u.side === 0 ? (f.seenBy || canSee(W, u, f)) : (canSee(W, u, f) || fresh(W, u.sense[f.i], 2))));
  const dx = p.x - u.x, dy = p.y - u.y, L = Math.hypot(dx, dy); if (L < 1.5 || !F.length) return null;
  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux, al = f => (f.x - u.x) * ux + (f.y - u.y) * uy, lt = f => (f.x - u.x) * nx + (f.y - u.y) * ny;
  const block = F.filter(f => al(f) > 0.3 && al(f) < L - 0.3 && Math.abs(lt(f)) < f.r + u.r + 0.9); if (!block.length) return null;
  const line = new Set(block); for (let grew = true; grew;){ grew = false; for (const f of F) if (!line.has(f) && [...line].some(g => dist(f, g) < 2.2)){ line.add(f); grew = true; } }
  let best = null, bs = 1e9;
  for (const sg of [1, -1]){ const end = [...line].reduce((a, f) => lt(f) * sg > lt(a) * sg ? f : a), s = lt(end) + sg * (end.r + u.r + 1.2), x = u.x + ux * al(end) + nx * s, y = u.y + uy * al(end) + ny * s;
    if (x < 0.8 || y < 0.8 || x > W.map.W - 0.8 || y > W.map.H - 0.8 || boxRock(W, x, y, u.r)) continue;
    const c = Math.hypot(x - u.x, y - u.y) + Math.hypot(p.x - x, p.y - y); if (c < bs){ bs = c; best = { x, y }; } }
  return best;
}
// 망치: 붙들린 상대의 옆 · 뒤로 스스로 돌아 들어감 (명령 없이 — 알아본 만큼만, 틀릴 수 있음)
function hammerStep(W, u, dt){
  const H = W.rules.hm || {}; if (H.on === false || u.order || u.act || u.crawl || isFar(u) || !W.hm || !W.hm.pins.size || (u.role !== '미드필더' && u.role !== '공격수') || u.hp / u.max < 0.4) return false;
  if (W.t < (u.hmCd || 0)) return false;
  let t = u.hmS && W.units[u.hmS.b] && W.units[u.hmS.b].alive && W.hm.pins.has(u.hmS.b) ? W.units[u.hmS.b] : null;
  if (!t){ u.hmS = null; const c = [...W.hm.pins.keys()].map(i => W.units[i]).filter(f => !W.hm.pins.get(f.i).includes(u.i) && dist(u, f) < 9 && canSee(W, u, f) && !roeBlock(W, u, f, 'melee')).sort((a, b) => dist(u, a) - dist(u, b))[0]; if (!c) return false; t = c;
    u.hmS = { b: t.i, t0: W.t, err: hash01(u.i, t.i, Math.floor(W.t / 8)) < (u.vet ? H.errVet || 0.15 : H.err || 0.3) }; if (u.hmS.err && !(u.hmLog && u.hmLog.b === t.i && W.t - u.hmLog.t < 8)){ u.hmLog = { b: t.i, t: W.t }; L(W, { k: 'flankMis', a: u.i, b: t.i, vis: false }); } }   /* v7.10.6 같은 상대에게 8초에 한 번만 (프레임마다 쌓이던 것) */
  if (W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < Math.max(u.rng, f.rng) + 0.3 && (f.target === u || focusOf(W, f) === u))){ u.hmS = null; u.hmCd = W.t + 1.5; return false; }   // 나를 노리는 상대가 붙으면 싸움이 먼저
  if (W.t - u.hmS.t0 > 6 || sideOf(W, t, u) !== 'front' && gap(u, t) <= u.rng + 0.6){ u.hmCd = W.t + 3; if (W.t - u.hmS.t0 <= 6){ u.target = t; u.state = 'fight'; } u.hmS = null; return false; }
  const anv = W.units.filter(a => W.hm.pins.get(t.i).includes(a.i)), ref = { x: anv.reduce((s, a) => s + a.x, 0) / anv.length, y: anv.reduce((s, a) => s + a.y, 0) / anv.length };
  let base = Math.atan2(t.y - ref.y, t.x - ref.x); if (u.hmS.err) base += (hash01(u.i, t.i, 17) < 0.5 ? 1 : -1) * 2.2;
  const spot = approachPt(W, u, t, base, [0, 0.5, -0.5, 0.9, -0.9, 1.4, -1.4]) || { x: t.x, y: t.y }, via = lineEndVia(W, u, t, spot) || arcVia(W, u, t, spot);   /* v8.7.4 I22 */
  setMood(W, u, '옆으로 돌아 협공', t.i); u.lastDec = { t: W.t, s: `${t.name}가 동료에게 붙들림 — 옆 · 뒤로 돌아 들어감${u.hmS.err ? '' : ''}` }; goTo(W, u, via.x, via.y, dt); return true;
}
// 명령 '측면 기동': 찍은 적의 옆 · 뒤 (모루 반대쪽) 로 돌아 들어가 침
function flankOrder(W, u, dt){
  const o = u.order, t = W.units[o.b], H = W.rules.hm || {};
  if (!t || !t.alive){ u.order = null; u.stay = { x: u.x, y: u.y }; return; }
  if (o.t0 == null){ o.t0 = W.t; o.err = hash01(u.i, t.i, 11) < (u.vet ? H.errVet || 0.15 : H.err || 0.3); const pin = W.hm && W.hm.pins.get(t.i);
    L(W, { k: 'flankGo', a: u.i, b: t.i, early: !(pin && pin.length), err: false, vis: true }); }
  const see = canSee(W, u, t) || (u.side === 0 && !!t.seenBy);
  if (see) u.last = { x: t.x, y: t.y }; else if (!u.last || Math.hypot(u.x - u.last.x, u.y - u.last.y) < 0.4){ L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return; }
  if (W.t - o.t0 > 30){ u.order = null; u.stay = { x: u.x, y: u.y }; return; }
  const anv = W.units.filter(a => a.alive && a !== u && a.side === u.side && !isFar(a) && gap(a, t) < 2), ref = anv.length ? { x: anv.reduce((s, a) => s + a.x, 0) / anv.length, y: anv.reduce((s, a) => s + a.y, 0) / anv.length } : (W.units.filter(a => a.alive && a !== u && a.side === u.side).length ? { x: W.units.filter(a => a.alive && a !== u && a.side === u.side).reduce((s, a) => s + a.x, 0) / W.units.filter(a => a.alive && a !== u && a.side === u.side).length, y: W.units.filter(a => a.alive && a !== u && a.side === u.side).reduce((s, a) => s + a.y, 0) / W.units.filter(a => a.alive && a !== u && a.side === u.side).length } : { x: u.x, y: u.y });
  let base = Math.atan2(t.y - ref.y, t.x - ref.x); if (o.err){ base += (hash01(u.i, t.i, 13) < 0.5 ? 1 : -1) * 2.2; if (!o.errLog){ o.errLog = true; L(W, { k: 'flankMis', a: u.i, b: t.i, vis: false }); } }   // 틀린 쪽을 고름 — 상대 앞으로 돌아 들어감 (로그에만, 본인은 모름)
  const spot = approachPt(W, u, t, base, [0, 0.5, -0.5, 0.9, -0.9, 1.4, -1.4]) || { x: t.x, y: t.y };
  if (gap(u, t) <= u.rng + 0.6){ u.target = t; u.state = 'fight'; fight(W, u, t, dt, see, true); return; }
  const via = lineEndVia(W, u, t, spot) || arcVia(W, u, t, spot); setMood(W, u, '측면 기동', t.i); goTo(W, u, via.x, via.y, dt);   /* v8.7.4 상대 전열이 막으면 그 끝을 돌아 (I22) */
  if (Math.hypot(spot.x - u.x, spot.y - u.y) < 0.9){ u.target = t; u.state = 'fight'; fight(W, u, t, dt, see, true); }
}
// v8.7.3 명령 줄: 가는 중인 명령은 모두 도착 (먼저 닿는 것부터 · 한 틱에 하나 — 무기 바꾸기 같은 짧은 일이 다음 명령에 지워지지 않게) · 같은 명령은 한 번 (두 번 외치면 닿을 확률만 오름) · 나중에 낸 명령이 먼저 닿았으면 옛것은 버림 · 바로 걸린 명령 (끝난 맵 · 스스로) 은 옛 줄을 지움
const ordSig = (o, u) => JSON.stringify(orderTxt(o, u)) + (o && o.hurry ? 'h' : '') + (o && o.now ? 'n' : '') + (o && o.via ? 'd' : '');
function ordPush(W, u, P){
  const Q = u.ordQ || (u.ordQ = []); if (u.ordPend && !Q.includes(u.ordPend)) Q.push(u.ordPend);
  const k = ordSig(P.o, u), last = Q.length ? Q.reduce((a, b) => b.t0 >= a.t0 ? b : a) : null;
  if (last && ordSig(last.o, u) === k){ last.ok = last.ok || P.ok; last.p = Math.max(last.p || 0, P.p || 0); u.ordPend = last; return last; }   // 가장 최근에 낸 것과 같으면 한 번 (두 번 외치면 닿을 확률만)
  if (!Q.length && ordSig(u.order, u) === k){ u.ordQ = null; return null; }   // 지금 하고 있는 그 명령
  Q.push(P); u.ordPend = P; return P;
}
// 아군 명령 전달: 유저가 준 명령 (ordPend) 은 닿는 때 받음 — 못 받으면 하던 대로. 0초 (싸움 전 작전 회의) 는 바로
function cmdTick(W){
  postureTick(W);   // v7.9 태세가 닿음
  for (const u of W.units){ if (u.side !== 0) continue;
    if (u.ordPend && !(u.ordQ || []).includes(u.ordPend)) (u.ordQ = u.ordQ || []).push(u.ordPend);   // 줄 밖에서 넣은 한 칸도
    const Q = u.ordQ; if (!Q || !Q.length){ u.ordQ = null; continue; }
    if (!u.alive){ u.ordQ = null; u.ordPend = null; continue; }
    const due = Q.filter(q => W.t >= q.at).sort((a, b) => a.at - b.at || a.t0 - b.t0); if (!due.length) continue;
    let P = null; for (const q of due){ Q.splice(Q.indexOf(q), 1); if (u.ordT0 != null && q.t0 < u.ordT0) continue; P = q; break; }
    u.ordPend = Q.length ? Q.reduce((a, b) => b.t0 >= a.t0 ? b : a) : null; if (!Q.length) u.ordQ = null;
    if (!P) continue;
    if (P.ok){ u.ordT0 = P.t0; u.order = P.o; u.ordLive = P.o; u.missT = null; preempt(W, u); if (!P.o) lieFree(W, u); if (P.o && P.o.k === 'attack' && P.o.b != null) W.cmdFocus0 = { b: P.o.b, t: W.t };
      L(W, { k: 'cmdRecv', a: u.i, c: P.c, dep: P.o && P.o.dep != null ? 1 : null, via: P.via, m: P.m != null ? P.m : null, m2: P.m2 != null ? P.m2 : null, sec: +(W.t - P.t0).toFixed(1), p: +P.p.toFixed(2), o: orderTxt(P.o, u), vis: true }); if (W.fxOn) W.fx.push({ k: 'ack', a: u.i, o: P.o, t0: W.t }); }
    else { u.missT = W.t; u.missO = P.o; if (W.t - (u.missLogT == null ? -9 : u.missLogT) > 3){ u.missLogT = W.t; L(W, { k: 'cmdMiss', side: 0, a: u.i, c: P.c, via: P.via, why: P.why, p: +P.p.toFixed(2), o: orderTxt(P.o, u), vis: true }); }   /* v7.26.1 같은 줄이 쌓이지 않게 */ if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y - 0.35, s: P.via === 'none' ? '명령이 안 닿음' : '못 들음', c: 'm', t0: W.t }); }
  }
}
/* ---------- v7.5 정찰 ----------
   명령한 곳까지 숨어서 감 (은신 걸음) — 보이는 적에게 near 칸까지 다가가면 멈춰 look 초 둘러봄 (다다라도). 그다음 명령받은 때 지휘관이 있던 자리로 돌아옴.
   들키면 (나를 보는 적이 나를 노리거나 2.2칸 안) 뛰어 도망. 나가 있는 동안 본 것은 지휘관에게 닿지 않음 — 돌아와 지휘관과 닿으면 보고:
   본 적은 실루엣 (대략의 무장 · 본 그때의 자리를 흔들어 · 몇 초 전) 으로만. 누구인지 · 지금 어디인지는 모름. 후각이 없으면 어둠 속 귀환 길을 헤맴 (로그에만).
   누구나 할 수 있지만 크고 무거운 몸 (거구 · 중갑) 은 거의 숨지 못함 */
function scoutStep(W, u, dt){
  const o = u.order, SC = W.rules.scout || {};
  if (!u.sc || u.sc.oid !== o){ u.sc = { oid: o, ph: 'out', t0: W.t, x: o.x, y: o.y, hx: o.hx != null ? o.hx : u.x, hy: o.hy != null ? o.hy : u.y, seen: {}, st0: !!u.stealth, lostT: 0, wander: null, nextLost: W.t + 2, wentOut: false }; u.stealth = true;
    L(W, { k: 'scout', a: u.i, x: +o.x.toFixed(1), y: +o.y.toFixed(1), e: +u.stealthE.toFixed(2), vis: true }); }
  const S = u.sc; if (u.posUnk) S.wentOut = true;
  const pol = o.pol || 'look', sv = pol === 'survive';   // v7.9.1 정찰 방침
  for (const f of W.units) if (f.alive && f.side !== u.side && canSee(W, u, f)) S.seen[f.i] = { x: f.x, y: f.y, t: W.t, look: looks(f) };
  const seers = W.units.filter(e => e.alive && e.side !== u.side && canSee(W, e, u) && (e.target === u || focusOf(W, e) === u || dist(e, u) < 2.2 || (sv && dist(e, u) < (SC.fleeSv || 6.5))));
  if (S.ph !== 'flee' && seers.length){ S.ph = 'flee'; L(W, { k: 'scoutFlee', a: u.i, pol, vis: true }); }
  if (sv && S.ph === 'flee' && !S.sprint && seers.length >= 2 && !W.units.some(a => a.alive && a.side === u.side && a !== u && dist(a, u) < 6)){ S.sprint = true; L(W, { k: 'scoutSprint', a: u.i, n: seers.length, vis: true }); }   // 홀로 들켰고 쫓는 상대가 여럿 → 온 힘으로 본진으로
  if (sv && S.ph !== 'flee' && S.ph !== 'back' && W.units.some(e => e.alive && e.side !== u.side && !isFar(e) && dist(e, u) < 3 && !canSee(W, e, u))) S.ph = 'back';   // 모르는 적이 코앞 — 조용히 빠짐
  if (S.ph === 'out'){
    const near = W.units.filter(f => f.alive && f.side !== u.side && canSee(W, u, f)).sort((a, b) => dist(u, a) - dist(u, b))[0];
    if (Math.hypot(S.x - u.x, S.y - u.y) < 0.8 || (near && dist(u, near) <= (sv ? SC.nearSv || 7.5 : SC.near || 4.5)) || W.t - S.t0 > (SC.max || 16) * 0.6){ S.ph = 'look'; S.lookT = W.t; stop(u);
      if (pol === 'kill'){ const k = scoutKillPick(W, u); if (k){ L(W, { k: 'scoutKill', a: u.i, b: k.i, vis: true }); u.order = { k: 'assn', b: k.i, fromScout: true }; u.sc = null; return; } } }
    else { setMood(W, u, '정찰 — 숨어서 감'); goTo(W, u, S.x, S.y, dt); if (!u.path){ S.ph = 'look'; S.lookT = W.t; } return; }
  }
  if (S.ph === 'look'){ stop(u); u.fg = (u.fg != null ? u.fg : u.face) + dt * 1.4; setMood(W, u, '정찰 — 둘러봄'); if (W.t - S.lookT >= (sv ? SC.lookSv || 0.8 : SC.look || 1.5)) S.ph = 'back'; return; }
  // 돌아옴: 지휘관과 닿으면 (나가 있다 돌아왔거나 · 처음 자리 가까이) 보고
  if (!u.posUnk && (S.wentOut || Math.hypot(S.hx - u.x, S.hy - u.y) < 2.2)){ scoutReport(W, u); return; }
  if (S.ph === 'flee' && (!sv || S.sprint || seers.some(e => e.target === u || dist(e, u) < 3.5))) u.mv = { k: 'scoutRun', run: true, until: W.t + 0.3, x: S.hx, y: S.hy };   // v7.9.1 생존 우선은 들켰어도 쫓기는 게 아니면 조용히 걸음
  if (S.wander && W.t < S.wander.until){ setMood(W, u, '정찰 — 길을 찾음'); goTo(W, u, S.wander.x, S.wander.y, dt); return; }
  if (!u.smellG && !glowAt(W, u.x, u.y) && W.t >= S.nextLost){ S.nextLost = W.t + 2;   // 후각 없이 어둠 속 — 길을 헤맴
    if (W.rand() < (SC.lost != null ? SC.lost : 0.35)){ const T0 = SC.lostT || [0.8, 1.6], sec = T0[0] + W.rand() * (T0[1] - T0[0]), a = Math.atan2(S.hy - u.y, S.hx - u.x) + (W.rand() < 0.5 ? 1 : -1) * (1.2 + W.rand() * 0.8);
      const wx = Math.max(0.6, Math.min(W.map.W - 0.6, u.x + Math.cos(a) * 2.5)), wy = Math.max(0.6, Math.min(W.map.H - 0.6, u.y + Math.sin(a) * 2.5));
      if (!boxRock(W, wx, wy, u.r)){ S.wander = { x: wx, y: wy, until: W.t + sec }; S.lostT += sec; L(W, { k: 'scoutLost', a: u.i, sec: +sec.toFixed(1), vis: true }); return; } } }
  setMood(W, u, S.ph === 'flee' ? '정찰 — 들켜서 도망' : '정찰 — 돌아옴'); goTo(W, u, S.hx, S.hy, dt);
  if (!u.path && Math.hypot(S.hx - u.x, S.hy - u.y) < 0.8){ scoutReport(W, u); }
}
// v7.9.1 암살 방침: 닿은 곳에서 홀로 (곁 동료 1 이하) 모르는 상대 중 값진 쪽
function scoutKillPick(W, u){
  const A = ASN(W), SC = W.rules.scout || {}; if (!A || !(u.assnE > 0)) return null;
  let best = null, bs = -1e9;
  for (const f of W.units){ if (!f.alive || f.down || f.side === u.side || !canSee(W, u, f) || dist(u, f) > (SC.killD || 12) || supportOf(W, f) > 1 || aware(W, f, u)) continue;
    const s = -dist(u, f) * 0.5 + (f.cmd ? 4 : 0) + (isFar(f) ? 3 : 0) + (f.hp / f.max < 0.5 ? 1 : 0) - (f.giant || f.modBody || f.bodyShield ? 5 : 0); if (s > bs){ bs = s; best = f; } }
  return best;
}
// v7.9.1 희생 돌격: 지정한 한 명이 아는 적 중 가장 값진 쪽으로 스스로 돌격해 쓰러질 때까지 (치료 · 후퇴 없음)
function sacStep(W, u, dt){
  const o = u.order; if (o.t0 == null){ o.t0 = W.t; u.stealth = false; L(W, { k: 'sac', a: u.i, vis: true }); }
  const knownF = f => f.alive && !f.down && f.side !== u.side && (f.seenBy || fresh(W, u.sense[f.i], 5));
  let t = o.b != null && W.units[o.b] && knownF(W.units[o.b]) ? W.units[o.b] : null;
  if (!t || W.t >= (o.reT || 0)){ o.reT = W.t + 1.5;
    const sc = f => -dist(u, f) * 0.6 + (f.cmd ? 4 : 0) + (isFar(f) ? 3 : 0) + (prone(W, f) ? 2 : 0) + (f.hp / f.max < 0.4 ? 1.5 : 0) + (t === f ? 1.5 : 0) - (f.giant || f.bodyShield ? 2 : 0);
    const c = W.units.filter(knownF).sort((a, b) => sc(b) - sc(a))[0]; t = c || null; o.b = t ? t.i : null; }
  if (!t){
    const s = W.units.filter(f => f.alive && f.side !== u.side).map(f => u.sense[f.i]).filter(x => fresh(W, x, 8)).sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y))[0];
    if (s && Math.hypot(s.x - u.x, s.y - u.y) > 0.8){ setMood(W, u, '희생 돌격 — 적을 찾아 감'); goTo(W, u, s.x, s.y, dt); return; }
    if (W.t - o.t0 > 25){ u.order = null; u.stay = { x: u.x, y: u.y }; return; }
    stop(u); setMood(W, u, '희생 돌격 — 적을 기다림'); return; }
  const see = canSee(W, u, t);
  if (see) u.last = { x: t.x, y: t.y };
  setMood(W, u, '희생 돌격', t.i); u.target = t; u.state = 'fight';
  fight(W, u, t, dt, see || (u.last && Math.hypot(u.x - u.last.x, u.y - u.last.y) > 0.4), true);
}
function scoutReport(W, u){
  const S = u.sc, SC = W.rules.scout || {}, M = W.scoutMarks || (W.scoutMarks = []), list = Object.values(S.seen);
  for (const r of list){ const age = W.t - r.t, j = (SC.jit != null ? SC.jit : 1.2) * (0.6 + Math.min(1, age / 10)); M.push({ x: Math.max(0.5, Math.min(W.map.W - 0.5, r.x + (W.rand() * 2 - 1) * j)), y: Math.max(0.5, Math.min(W.map.H - 0.5, r.y + (W.rand() * 2 - 1) * j)), t: r.t, at: W.t, look: r.look, by: u.i, smell: !!r.smell }); }
  const cnt = {}; for (const r of list) for (const k of r.look) cnt[k] = (cnt[k] || 0) + 1;
  L(W, { k: 'scoutRep', a: u.i, n: list.length, cnt, age: list.length ? [Math.round(Math.min(...list.map(r => W.t - r.t))), Math.round(Math.max(...list.map(r => W.t - r.t)))] : null, sec: +(W.t - S.t0).toFixed(1), lost: +S.lostT.toFixed(1), smell: !!u.smellG, vis: true });
  u.order = null; u.stay = { x: u.x, y: u.y }; u.stealth = S.st0 && !(u.blown && u.blown.t >= S.t0); u.sc = null; u.mv = null;   // v7.8.3 나가서 들켰으면 숨기를 되살리지 않음
}
// v7.8.5 횃불 가져오기 (명령): 든 횃불이 있으면 켬. 없으면 가장 가까운 쪽으로 — 떨어진 횃불을 줍거나 · 여분 꾸러미 (지닌 동료 곁 · 쓰러진 몸 곁) 에서 하나 꺼내 불을 붙임 (torchNew 초). 쓰러진 몸 곁의 꾸러미는 챙겨 지님
function torchGetStep(W, u, dt){
  const o = u.order, end = why => { if (why) L(W, { k: 'torchGetFail', a: u.i, why, vis: true }); u.order = null; u.stay = { x: u.x, y: u.y }; };
  if (o.t0 == null) o.t0 = W.t;
  if (u.torchSw){ stop(u); setMood(W, u, u.torchSw.spare ? '새 횃불에 불을 붙임' : '횃불을 켬'); return; }
  if (u.torch){ if (u.torchOff) torchSet(W, u, true); else end(); return; }
  if (W.t - o.t0 > 25){ end('너무 오래 걸림'); return; }
  const tc = nearTorch(W, u, 1e9), C = W.spareBy != null ? W.units[W.spareBy] : null;
  const sp = W.spare > 0 ? (C && C.alive ? { x: C.x, y: C.y, by: C } : W.spareAt ? { x: W.spareAt.x, y: W.spareAt.y, by: null } : null) : null;
  const dT = tc ? Math.hypot(tc.x - u.x, tc.y - u.y) : 1e9, dS = sp ? (sp.by === u ? 0 : Math.hypot(sp.x - u.x, sp.y - u.y)) : 1e9;
  if (o.src == null) o.src = !tc && !sp ? '' : dT <= dS ? 'drop' : 'spare';   // 처음에 고른 쪽
  if (o.src === 'drop' && !tc && W.units.some(a => a.alive && a.side === u.side && a !== u && a.torch)){ end('동료가 먼저 주움'); return; }   // 주우러 가는 사이 동료가 집어 듦 — 여분을 또 꺼내지 않음
  if (!tc && !sp){ end('떨어진 횃불도 여분도 없음'); return; }
  if (dT <= dS){ if (dT <= 0.7){ pickTorch(W, u, tc); return; } setMood(W, u, '횃불 주우러'); goTo(W, u, tc.x, tc.y, dt); return; }
  if (dS <= (sp.by ? 1.4 : 0.8)){ stop(u);
    if (!sp.by){ W.spareBy = u.i; W.spareAt = null; L(W, { k: 'spareTake', a: u.i, n: W.spare, vis: true }); }
    W.spare--; u.torchSw = { on: true, spare: true, at: W.t + (W.rules.torchNew != null ? W.rules.torchNew : 1.5) }; L(W, { k: 'torchLight', a: u.i, by: sp.by && sp.by !== u ? sp.by.i : null, n: W.spare, vis: true }); return; }
  setMood(W, u, '여분 횃불 꾸러미로'); goTo(W, u, sp.x, sp.y, dt);
}
// v7.5 횃불 켜고 끄기: 켜는 데 torchOn · 끄는 데 torchOff 초 (든 이가 하는 일)
function torchSet(W, u, on, extra){ if (!u.torch || !u.alive) return false; if (on === !u.torchOff && !u.torchSw) return false; u.torchSw = { on, at: W.t + (extra || 0) + (on ? (W.rules.torchOn != null ? W.rules.torchOn : 0.8) : (W.rules.torchOff != null ? W.rules.torchOff : 0.2)) }; L(W, { k: 'torchSw', a: u.i, on, vis: true }); return true; }
function torchTick(W){ for (const u of W.units){ const T = u.torchSw; if (!T || W.t < T.at) continue; u.torchSw = null; if (T.spare && u.alive && !u.torch){ u.torch = true; u.torchOff = true; }   // v7.8.5 꾸러미에서 꺼낸 새 횃불
    if (!u.alive || !u.torch) continue; u.torchOff = !T.on; computeLight(W); L(W, { k: 'torch', a: u.i, on: T.on, vis: true });
    if (T.on && u.stealth && !(u.order && (u.order.k === 'scout' || u.order.k === 'assn'))){ u.stealth = false; L(W, { k: 'stealthOff', a: u.i, why: '횃불을 켬', vis: true }); } } }   // v7.9.5 횃불을 든 채로는 못 숨음
// 지휘관이 아는 아군의 자리: 지휘관이 보거나 · 외침이 닿거나 (불러서 앎) · 지휘관과 닿는 동료가 보면 앎 — 아니면 마지막으로 안 자리 (posK)
function posKnownTick(W){
  const C = cmdBoss(W, 0), calm = !W.units.some(f => f.alive && !f.gone && f.side === 1);   /* v8.7.3 적이 없으면 서로 자리를 앎 */
  for (const u of W.units){ if (u.side !== 0) continue;
    if (!u.alive && !u.down){ if (u.posUnk && W.units.some(m => m.alive && m.side === 0 && !m.posUnk && canSee(W, m, u))){ u.posUnk = false; u.posK = { x: u.x, y: u.y, t: W.t, hp: 0 }; L(W, { k: 'deathFound', a: u.i, vis: true }); } continue; }   // v7.5 소식 없던 동료의 시신을 찾음
    const k = !C || calm || u === C || AI6.includes('cmdlink') || canSee(W, C, u) || dist(C, u) <= Math.min(hearR(W, C, u), cmdRange(W, C)) || W.units.some(m => m.side === 0 && m.alive && m !== u && m !== C && canSee(W, m, u) && cmdLink1(W, C, m).p >= 0.4);
    if (k){ u.posK = { x: u.x, y: u.y, t: W.t, hp: Math.round(u.hp) }; if (u.posUnk){ u.posUnk = false; L(W, { k: 'posBack', a: u.i, vis: true }); } }
    else if (!u.posUnk){ u.posUnk = true; if (!u.posK) u.posK = { x: u.x, y: u.y, t: W.t, hp: Math.round(u.hp) }; L(W, { k: 'posLost', a: u.i, c: C ? C.i : null, vis: true }); } }
}
// 편마다 0.5초에: 지휘가 있고 탱커가 있으면 대치 (진형을 갖추고 기다림) → 들어갈 때를 봄. 지휘가 없거나 탱커가 없으면 자유 (지금까지처럼)
function planStance(W){
  const F = W.rules.form || {};
  for (const side of [0, 1]){
    const S = W.stance[side] || (W.stance[side] = { k: 'free', t0: W.t, ph: W.rand() * 6.283 });
    actingCmd(W, side);   // v6.8
    const mine = W.units.filter(u => u.alive && !u.crawl && u.side === side && !roamIdle(u)), cmd = cmdOf(W, side);   // v7.8.1 아직 떠도는 몸 (경보를 못 들음) 은 작전에 없음
    const known0 = W.units.filter(f => f.alive && f.side !== side && (side === 0 ? f.seenBy : mine.some(e => canSee(W, e, f) || fresh(W, e.sense[f.i], 2))));
    const known = side === 1 ? picKnown(W, side, mine, known0) : known0;   // v6.9 지휘관은 본 것 · 보고가 닿은 것만
    const tanks = mine.filter(u => u.role === '전선' && (u.canGuard || u.bodyShield));
    const awake = side === 0 || mine.some(e => e.state === 'hunt' || e.state === 'search');
    const set = (k, why) => { if (S.k === k) return; const was = S.k; S.k = k; S.t0 = W.t; S.why = why; L(W, { k: 'stance', side, s: k, why, was, cmd, by: (cmdBoss(W, side) || {}).i }); };   /* v8.7.3 그때의 지휘관 */
    const contact = mine.some(u => known.some(f => gap(u, f) < Math.max(isFar(u) ? 0.3 : u.rng, isFar(f) ? 0.3 : f.rng) + 0.6));
    if (contact) S.lastC = W.t;
    W.farDmg[side] *= 0.9;
    if (side === 1 && known.length && awake && !AI6.includes('plan')) planPlan(W, mine, known, cmd);   // v6.0 적의 작전 · 후퇴
    const coord = cmd > 0 || !(W.hadCmd && W.hadCmd[side]) || AI6.includes('acting');   // v6.8 지휘가 끊긴 동안은 공동 표적 · 쐐기 · 포위 · 돌진 명령 · 협동 기동이 없음 (각자 싸움)
    if (side === 1 && W.focus && !coord){ L(W, { k: 'focusLost', side: 1, b: W.focus.b, vis: true }); W.focus = null; }
    if (side === 1 && known.length && awake && coord){ planFocus(W, mine, known); planWedge(W, mine, known); planEncircle(W, mine, known); if (!AI6.includes('cmdchg')) cmdCharge(W, mine, known); if (!AI6.includes('mv')){ planMoves(W, mine, known); scatterArchers(W, mine, known); } }
    if (side === 1){ opTick(W, coord); taskBoard(W, mine, known, coord && awake); inflTick(W, 1, known); if (coord && awake && !AI6.includes('mv')) inflMoves(W, mine, known); }   // v6.9 임무판 · 영향 지도   // v6.1 약한 고리 · 쐐기 · 포위 · v6.3.2 지휘관의 돌진 명령
    const PL = planOf(W, side) || { pat: 1, adv: 1 };
    if (!cmd || !tanks.length || !known.length || mine.length < 2 || !awake){ set('free', !cmd && S.k !== 'free' ? '지휘를 잃음' : ''); continue; }
    if (S.k === 'engage' && (W.t - S.t0 < 6 || W.t - (S.lastC == null ? -9 : S.lastC) < 3)) continue;   // 한 번 들어가면 6초 · 맞붙은 뒤 3초는 그대로
    if (contact){ set('engage', '맞붙음'); if (side === 1 && W.phase && W.phase.k && W.phase.k !== 'assault' && W.phase.k !== 'melee'){ L(W, { k: 'phase', side: 1, p: 'melee', was: W.phase.k, why: '맞붙음', vis: true }); W.phase.k = 'melee'; W.phase.t0 = W.t; } continue; }
    // 들어갈 때를 봄
    let pa = 0, pb = 0; for (const u of mine) pa += powerOf(u); for (const f of known) pb += powerOf(f);
    const hold = S.k === 'hold' ? W.t - S.t0 : 0, C = W.rules.charge || {};
    const phaseOn = side === 1 && !AI6.includes('phase') && W.plan && PHASE_PLANS.includes(W.plan.k);   // v7.3 기동전 단계 (우위 · 빈틈은 그 안에서)
    if (!phaseOn && pa / Math.max(1e-6, pb) >= (F.adv || 1.5) * (PL.adv / 1.5 || 1)){ set('engage', '우위'); continue; }
    const gapU = mine.some(u => u.canCharge && !u.noChg && !u.act && W.t >= u.chargeCd && known.some(f => { const g = gap(u, f); return g >= (C.min || 1.5) && g <= (C.max || 5) && canSee(W, u, f) && gapScore(W, u, f) >= (F.open || 2) && chargeOk(W, u, f); }));
    if (phaseOn){ phaseTick(W, S, mine, known, cmd, PL, set, pa / Math.max(1e-6, pb), gapU); continue; }   // v7.3 기동전 단계
    if (gapU){ set('engage', '빈틈'); continue; }
    if (hold > 2.5 && W.farDmg[side] > W.farDmg[1 - side] * 1.5 + 15){ set('engage', '사격에 밀림'); continue; }
    if (hold > ((F.patience || 6) + cmd * (F.perCmd || 1.5)) * PL.pat){ set('engage', '오래 대치'); continue; }
    if (S.k !== 'hold') set('hold', '');
    formSlots(W, side, mine, known, S);
  }
}
/* ---------- v7.3 적의 기동전 단계 ----------
   지휘관은 맞붙기 전에 단계를 밟음: 대치 (진형을 갖추고 살핌) → 간보기 (앞줄이 한 걸음 나섰다 물러남 — 상대가 따라 나오는지 · 상대 사수가 응사하는지 봄)
   → 사격전 (궁수가 사거리 안에 들게 간격을 맞추고 깎음 — 받은 피해 · 준 피해를 잼) → 돌격 (이기거나 · 오래 끌거나 · 밀리면 거리를 좁힘) 또는 우회 (빠른 근접이 옆으로 돌아 사수 · 구급을 침, 앞줄은 붙듦).
   간보기에 상대가 따라 나오면 전열째 물러서 궁수 앞으로 끌어들임 (조직 후퇴) · 상대 사수가 사거리 · 수에서 앞서면 사격전 대신 우회 · 돌격.
   작전마다: 버팀 = 대치 · 간보기 · 긴 사격전 / 유인 = 간보기에서 늘 끌어들이려 함 / 사냥 = 간보기 뒤 우회 / 밀어붙임 = 짧은 사격전 뒤 돌격. 우위 · 빈틈 · 맞붙음은 어느 단계든 바로 */
const PHASE_PLANS = ['hold', 'bait', 'hunt', 'assault'], PHN = { stand: '대치', probe: '간보기', fire: '사격전', flank: '우회', assault: '돌격', melee: '난전' };
function phaseTick(W, S, mine, known, cmd, PL, set, ratio, gapU){
  const H = W.rules.phase || {}, F = W.rules.form || {}, P = W.phase || (W.phase = { k: null, t0: W.t, n: 0 }), FT = W.farTot || (W.farTot = [0, 0]), pk = W.plan ? W.plan.k : 'hold';
  const go = (k, why, ex) => { if (P.k === k) return; const was = P.k; P.k = k; P.t0 = W.t; P.why = why; P.n++; P.tk0 = FT[1]; P.dl0 = FT[0]; P.th0 = known.filter(isFar).length; L(W, { k: 'phase', side: 1, p: k, was, why, plan: pk, ...(ex || {}), vis: true }); };
  const pat = PL.pat || 1, bows = mine.filter(u => isFar(u) && (u.ammo == null || u.ammo > 0) && !u.crawl), theirs = known.filter(isFar);
  const fast = mine.filter(u => !isFar(u) && u.role !== '전선' && u.spd >= 2.1 && !u.crawl && !u.lurk), canFlank = fast.length >= 1 && Math.max(0, ...mine.map(u => u.cmd || 0)) >= ((W.rules.squad || {}).cmd != null ? W.rules.squad.cmd : 2);
  const myR = Math.max(0, ...bows.map(u => u.rng)), thR = Math.max(0, ...theirs.map(f => f.rng)), outgunned = theirs.length > 0 && (thR > myR + 0.4 || theirs.reduce((s, f) => s + (f.loud ? 1.5 : 1), 0) > bows.length);
  const assault = why => { go('assault', why); S.adv = 0; S.pb = 0; S.gapNow = 0; S.fireOn = false; set('engage', why); };
  if (P.k !== 'fire') S.fireOn = false;
  if (S.k === 'engage'){ go('stand', P.k === 'melee' ? '떨어짐 — 다시 진형을 갖춤' : '돌격이 닿지 않음 — 다시 진형을 갖춤'); S.adv = 0; S.pb = 0; S.gapNow = 0; }
  { const seen = W.units.filter(f => f.side !== 1 && f.alive && !f.crawl && (known.includes(f) || iKnow(W, 1, f))); if (seen.length > known.length){ let pa = 0, pb = 0; for (const u of mine) pa += powerOf(u); for (const f of seen) pb += powerOf(f); ratio = pa / Math.max(1e-6, pb); } }   // 지금 안 보여도 본 적 있는 상대는 모두 셈
  const advR = (F.adv || 1.5) * (PL.adv / 1.5 || 1), sup = ratio >= advR;   // 우위 = 단계를 짧게 (대치 · 사격전 × 0.6) · 압도 (over 배) = 바로 돌격
  if (ratio >= advR * ((H.over || 2.6) / 1.5) && known.length >= 2){ assault(`압도 (힘 ×${ratio.toFixed(1)}) — 시간을 끌지 않음`); return; }
  if (gapU){ assault('빈틈 — 들이칠 자리가 열림'); return; }
  if (!P.k || P.k === 'melee' || P.k === 'assault') go('stand', '상대를 봄 — 진형을 갖추고 살핌');
  const el = W.t - P.t0, spd = sup ? 0.6 : 1;
  if (P.k === 'stand' && el >= (H.stand || 2) * Math.max(0.5, pat) * spd){
    if (pk === 'assault') bows.length ? go('fire', '밀어붙임 — 짧게 쏘고 들어감') : assault('밀어붙임 — 바로 들어감');
    else if (!bows.length && !canFlank) assault('궁수가 없음 — 거리를 좁힘');
    else go('probe', '진형이 섬 — 한 걸음 나서 반응을 봄', {});
    if (P.k === 'probe'){ const kc = known.filter(f => !isFar(f)); P.ec0 = centroid(kc.length ? kc : known); P.mc0 = centroid(mine); P.li = W.log.length; } }
  else if (P.k === 'probe'){
    { const reach = Math.max(1, ...known.filter(f => !isFar(f)).map(f => f.rng)); S.adv = el < (H.probeT || 1.2) ? Math.max(0, Math.min(H.step || 1.2, (S.gapNow || F.gap || 4) - reach - 1.2)) : 0; }   // 상대 손 + 1.2칸 밖까지만 나섬
    if (el >= (H.probe || 2.6)){
      const kc = known.filter(f => !isFar(f)), ec1 = centroid(kc.length ? kc : known), ax = P.ec0.x - P.mc0.x, ay = P.ec0.y - P.mc0.y, al = Math.hypot(ax, ay) || 1;
      const chase = ((P.ec0.x - ec1.x) * ax + (P.ec0.y - ec1.y) * ay) / al >= (H.chase || 1.0);
      const fired = [...new Set(W.log.slice(P.li).filter(l => l.k === 'wind' && !l.heal && W.units[l.a] && W.units[l.a].side === 0 && isFar(W.units[l.a])).map(l => l.a))];
      L(W, { k: 'probeRes', side: 1, chase, fired, outgunned, vis: true });
      if (chase && bows.length){ S.pb = H.bait || 1.8;   // 따라 나옴 → 전열째 물러서 궁수 앞으로
        for (const ln of (W.lines || []).filter(l => l.side === 1 && l.ids.length >= 2)){ const M = ln.ids.map(i => W.units[i]).filter(m => m && m.alive && m.lretId == null); if (M.length < 2) continue; const c = centroid(M); lretStart(W, M[0], c.x - Math.cos(ln.face) * (H.bait || 1.8), c.y - Math.sin(ln.face) * (H.bait || 1.8), 'ai', '간보기 — 따라 나온 상대를 궁수 앞으로 끌어들임'); }
        go('fire', '상대가 따라 나옴 — 물러서며 궁수 앞으로 끌어들임'); }
      else if (chase) assault('따라 나온 상대가 대열에서 떨어짐 — 되받아침');
      else if (pk === 'hunt' && canFlank) go('flank', '사냥 — 옆으로 돌아 사수 · 구급부터');
      else if (outgunned && fired.length && canFlank) go('flank', '상대 사수가 응사 — 사거리 · 수에서 밀림, 옆으로 돌아 사수를 침');
      else if (outgunned && fired.length) assault('상대 사수가 응사 — 사격전은 불리, 거리를 좁힘');
      else if (!bows.length) canFlank ? go('flank', '궁수가 없음 — 옆으로 돌아 들어감') : assault('궁수가 없음 — 거리를 좁힘');
      else go('fire', fired.length ? '상대 사수가 응사 — 사격전' : '상대가 굳게 버팀 — 사격으로 깎음');
    } }
  else if (P.k === 'fire'){
    S.adv = 0; S.fireOn = true;
    { const mc = centroid(mine), kc = centroid(known), ax = kc.x - mc.x, ay = kc.y - mc.y, al = Math.hypot(ax, ay) || 1, pr = f => ((f.x - mc.x) * ax + (f.y - mc.y) * ay) / al, near = Math.min(...known.map(pr)), ds = theirs.length ? Math.max(0, Math.min(...theirs.map(pr)) - near) : 0;
      S.gapNow = bows.length ? Math.max(2.0, Math.min(F.gap || 4, myR + 0.5 - 0.9 - ds - (H.fireGap || 0.4) + 0.4)) : 0; }   // 궁수 (앞줄 옆 0.9칸 뒤) 가 상대 사수까지 닿도록 앞줄 간격을 좁힘
    const taken = Math.round(FT[1] - P.tk0), dealt = Math.round(FT[0] - P.dl0), weak = known.some(f => pHp(W, 1, f) < 0.5) || theirs.length < (P.th0 || 0);
    if (!bows.length) canFlank && !P.flanked ? go('flank', '궁수를 잃음 — 옆으로 돌아 들어감') : assault('궁수를 잃음 — 거리를 좁힘');
    else if (el > 2.5 && taken > dealt * 1.4 + 20) canFlank && !P.flanked && theirs.length ? go('flank', `사격전에서 밀림 (받음 ${taken} · 줌 ${dealt}) — 옆으로 돌아 사수를 침`) : assault(`사격전에서 밀림 (받음 ${taken} · 줌 ${dealt}) — 거리를 좁힘`);
    else if (el > 2.5 && dealt > taken * 1.4 + 25 && weak) assault(`사격전에서 이김 (줌 ${dealt} · 받음 ${taken}) — 약해진 틈에 돌격`);
    else if (el > ((H.fire || 6) + cmd * 0.5) * pat * spd) canFlank && !P.flanked && pk !== 'assault' ? go('flank', `사격전이 길어짐 (줌 ${dealt} · 받음 ${taken}) — 옆으로 돎`) : assault(`사격전이 길어짐 (줌 ${dealt} · 받음 ${taken}) — 들어감`);
  }
  if (P.k === 'flank'){
    if (!P.flanked){ P.flanked = true; if (!planSquads(W, true)){ assault('돌아갈 길이 없음 — 정면에서 들어감'); return; } }
    S.adv = H.pin || 0.6; S.gapNow = 0;
    const fl = mine.filter(u => u.sq && u.sq.k === 'flank');
    if (fl.some(u => u.sq.done || known.some(f => gap(u, f) < Math.max(u.rng, isFar(f) ? 0.3 : f.rng) + 0.8))) assault('우회 조가 닿음 — 정면도 들어감');
    else if (W.t - P.t0 > (H.flank || 7) || !fl.length) assault(fl.length ? '우회가 늦음 — 정면에서 들어감' : '우회 조를 잃음 — 정면에서 들어감');
    if (P.k === 'assault') return;
  }
  if (P.k === 'assault') return;
  if (S.k !== 'hold') set('hold', PHN[P.k] || '');
  formSlots(W, 1, mine, known, S);
}
// 대치 중인 편의 자동 인물: 진형 자리로 걸어가 상대 쪽을 봄. 맞붙으면 (손 닿는 거리 + 0.8 안에 상대) 보통 싸움, 사수는 쏠 수 있으면 쏨. 우회 조는 따로
function holdForm(W, u, dt){
  const S = W.stance && W.stance[u.side]; if (!S || S.k !== 'hold' || !S.slots) return false;
  const p = S.slots[u.i]; if (!p || u.crawl) return false;
  if (u.sq && u.sq.k === 'flank' && !u.sq.done) return false;
  if (W.units.some(f => f.alive && f.side !== u.side && gap(u, f) < Math.max(isFar(u) ? 0.3 : u.rng, isFar(f) ? 0.3 : f.rng) + 0.8)) return false;
  if (isFar(u)){ const t = u.target && u.target.alive && u.target.side !== u.side ? u.target : null; if (t && canSee(W, u, t) && gap(u, t) <= u.rng && losClear(W.map, u.x, u.y, t.x, t.y)) return false; }
  if (Math.hypot(p.x - u.x, p.y - u.y) > 0.2){ setGoal(W, u, p.x, p.y); follow(W, u, dt, (W.rules.form || {}).walk || 0.7); } else stop(u);
  u.fg = Math.atan2(S.ey - u.y, S.ex - u.x);
  setMood(W, u, u.role === '전선' ? '대치' : '진형');
  return true;
}

/* ---------- v5.2 적의 조 나누기 · 산개 ---------- */
// squad.t 초마다: 쫓는 적이 셋 넘고, 아군이 전선 (방패 · 큰 몸) 뒤에 사수 · 구급 동료를 두고 있으면 빠른 근접 절반을 우회 조로 —
// 아군 전선 손이 닿지 않는 트인 쪽 옆으로 돌아 뒤쪽 (사수 · 구급) 을 노림. 나머지는 정면 조. 사수 (궁수) 는 서로 떨어져 각을 나눔 (reposition 점수)
const centroid = L2 => ({ x: L2.reduce((s, a) => s + a.x, 0) / L2.length, y: L2.reduce((s, a) => s + a.y, 0) / L2.length });
function planSquads(W, force){   // v7.3 force = 지휘관의 우회 결정 (기동전 단계). 대치 · 간보기 · 사격전 중엔 저절로 우회 조를 내지 않음 (지휘관이 쥐고 있음)
  const Q = W.rules.squad || {};
  if (!force && !AI6.includes('phase') && W.phase && ['stand', 'probe', 'fire'].includes(W.phase.k) && W.stance && W.stance[1] && W.stance[1].k === 'hold') return false;
  for (const e of W.units) if (e.side === 1 && e.sq && (!e.alive || (e.sq.done && W.t - e.sq.t > 8))) e.sq = null;
  { const best = Math.max(0, ...W.units.filter(e => e.alive && !e.crawl && e.side === 1).map(e => e.cmd || 0));   // v5.8.9 조를 나눠 우회시키는 것은 지휘 — 가장 높은 지휘관이 squad.cmd (B) 아래면 못 함
    if (best < (Q.cmd != null ? Q.cmd : 2)){ const had = W.units.filter(e => e.alive && e.side === 1 && e.sq && !e.sq.done); if (had.length){ for (const e of had) e.sq = null; L(W, { k: 'squadEnd', a: had.map(e => e.i), why: best ? '지휘 등급이 낮음' : '지휘를 잃음', vis: had.some(e => !!e.seenBy) }); } return; } }
  const E = W.units.filter(e => e.alive && e.side === 1 && (e.state === 'hunt' || e.state === 'search'));
  if (E.some(e => e.sq && e.sq.k === 'flank' && !e.sq.done)) return !!force;   // 이미 돌고 있는 조가 있으면 그 조로
  if (!force && E.length < 3) return false;
  const known = W.units.filter(a => a.alive && a.side === 0 && E.some(e => canSee(W, e, a) || fresh(W, e.sense[a.i], 2)));
  if (!known.length) return false;
  const wall = known.filter(a => a.role === '전선' || a.bodyShield || a.canGuard); let back = known.filter(a => isFar(a) || (a.skill && a.skill.left > 0));
  if (force && !back.length) back = known.slice().sort((a, b) => a.hp - b.hp);
  if (!force && (!wall.length || !back.length)) return false;
  const cand = E.filter(e => !isFar(e) && !e.shadow && !(e.warden && e.warden.on) && e.role !== '전선' && !e.pack && !e.stalk && (!e.sq || (force && e.sq.done)) && !prone(W, e) && !W.units.some(a => a.alive && a.side === 0 && gap(a, e) < Math.max(isFar(a) ? 0.3 : a.rng, e.rng) + 0.8)).sort((a, b) => b.spd - a.spd);
  if (cand.length < 1 || E.length - cand.length < 1) return false;
  const fl = cand.slice(0, Math.max(1, force ? Math.min(2, Math.ceil(cand.length / 2)) : Math.floor(cand.length / 2))), ec = centroid(E), ac = centroid(known), gc = centroid(fl);
  let ax = ac.x - ec.x, ay = ac.y - ec.y; const al = Math.hypot(ax, ay) || 1; ax /= al; ay /= al;
  const tgt = back.sort((a, b) => dist(a, ec) - dist(b, ec))[0];
  let best = null, bc = 1e9;
  for (const s of [-1, 1]) for (const k of [0.5, 0.75, 1]){   /* v8.7.4 표적 가까이부터 (멀리 돌지 않음 — I22) */
    const x = tgt.x - ay * s * (Q.flank || 3.2) * k + ax * 0.6, y = tgt.y + ax * s * (Q.flank || 3.2) * k + ay * 0.6;
    if (boxRock(W, x, y, 0.35)) continue;
    const path = findPath(W.map, gc.x, gc.y, x, y, 3000); if (!path) continue;
    let c = path.length; for (const p of path) if (wall.some(a => Math.hypot(a.x - p.x, a.y - p.y) < 1.8)) c += 3;
    if (c < bc){ bc = c; best = { x, y, s }; }
    break;
  }
  if (!best) return false;
  for (const e of fl) e.sq = { k: 'flank', wp: { x: best.x, y: best.y }, aim: tgt.i, t: W.t, done: false };
  L(W, { k: 'squad', a: fl.map(e => e.i), s: best.s, aim: tgt.i, rest: E.length - fl.length, force: !!force, vis: fl.some(e => e.seenBy) });
  return true;
}
function flankStep(W, u, t, dt){
  const q = u.sq; if (!q || q.k !== 'flank' || q.done) return false;
  if (W.t - q.t > 12 || W.units.some(f => f.alive && f.side !== u.side && gap(u, f) < Math.max(u.rng, isFar(f) ? 0.3 : f.rng) + 0.5)){ q.done = true; return false; }   // 맞붙음 (근접 거리) · 너무 오래 → 보통 싸움
  if (Math.hypot(q.wp.x - u.x, q.wp.y - u.y) < 0.7){ q.done = true; const a = W.units[q.aim]; if (a && a.alive) u.target = a; return false; }
  const A6 = ASN(W), dk = !!A6 && !AI6.includes('assn') && u.assnE >= (A6.ai || 0.4) && !glowAt(W, u.x, u.y) && !u.seenBy;   // v7.6 어둠 속 우회는 숨어서 (등 뒤를 잡을 수 있게)
  if (dk && !u.stealth){ u.stealth = true; u.sqStl = true; } else if (u.sqStl && !dk && u.seenBy){ u.stealth = false; u.sqStl = false; }
  const qa = W.units[q.aim], qv = qa && qa.alive ? lineEndVia(W, u, qa, q.wp) : null;   /* v8.7.4 상대 전열이 막으면 그 끝을 돌아 (I22) */
  setMood(W, u, u.sqStl ? '우회 (조) — 숨어서' : '우회 (조)', q.aim); goTo(W, u, (qv || q.wp).x, (qv || q.wp).y, dt);
  return true;
}

/* ---------- v6.0 적의 작전 (판마다 다름) · 후퇴 ----------
   용병단은 첫 접촉 때 상황 (방패 · 궁수 · 빠른 근접 수) 을 보고 작전을 고름 — 판마다 무작위로 달라짐:
   assault 밀어붙임 (대치를 짧게 · 돌격을 더 씀) · hold 버팀 (진형을 오래 지키며 궁수가 깎음 · 우위일 때만 들어감)
   bait 유인 (앞줄이 1.5칸 물러서며 궁수 사거리로 끌어들인 뒤 들어감) · hunt 사냥 (고립된 상대를 노림 · 우회 조를 쉽게 냄)
   불리해지면 (힘이 크게 밀리고 셋 중 하나 넘게 잃음 · 또는 지휘관을 잃고 밀림) 물러나 다시 모임 (withdraw) — 쫓는 놈은 동료가 견제 (약속 screen), 붙들린 쪽은 맞섬.
   5초 뒤 다시 모였으면 버팀으로 */
const PLAN = { assault: { pat: 0.4, adv: 1.2, chg: -0.4, n: '밀어붙임' }, hold: { pat: 1.4, adv: 1.7, chg: 0.3, n: '버팀' }, bait: { pat: 1.3, adv: 1.5, chg: 0.2, n: '유인' }, hunt: { pat: 1, adv: 1.5, chg: 0, n: '사냥' }, wedge: { pat: 0.4, adv: 1.3, chg: -0.3, n: '쐐기 돌파' }, ambush: { pat: 2, adv: 1.6, chg: 0.5, n: '매복' }, encircle: { pat: 0.7, adv: 1.5, chg: 0, n: '산개 포위' }, withdraw: { pat: 3, adv: 9, chg: 1.5, n: '후퇴' } };
const planOf = (W, side) => side === 1 && W.plan ? PLAN[W.plan.k] || null : null;
function planPlan(W, mine, known, cmd){
  if (!known.length || !mine.some(e => e.state === 'hunt' || e.state === 'search')) return;
  const tanks = mine.filter(u => u.shield || u.bodyShield).length, bows = mine.filter(isFar).length, fast = mine.filter(u => !isFar(u) && u.role !== '전선' && u.spd >= 2.1).length;
    const theirs = known.filter(isFar).reduce((s, f) => s + (f.loud ? 1.5 : 1), 0), myR = Math.max(0, ...mine.filter(isFar).map(u => u.rng)), theirR = Math.max(0, ...known.filter(isFar).map(f => f.rng));
    const outgun = bows >= theirs && myR >= theirR;   // 사격 힘: 총은 활 1.5개 · 사거리에서 밀리면 (총 7 > 활 6) 버티면 깎이기만 함
  const set = (k, why) => { const was = W.plan && W.plan.k; W.plan = { k, t0: W.t, why, was, cmd0: cmd, sh0: mine.filter(u => u.shield).length, dead0: W.units.filter(u => u.side === 1 && !u.alive && !u.down).length, failT: W.plan ? W.plan.failT : null, n0: W.plan ? W.plan.n0 : mine.length + W.units.filter(u => u.side === 1 && !u.alive).length, wd: W.plan ? W.plan.wd || 0 : 0, rally: W.plan && W.plan.rally }; L(W, { k: 'plan', side: 1, p: k, why, was: was || null, vis: true }); if (W.env && k !== 'encircle') opCancel(W, 'env', (PLAN[was] || {}).n + ' → ' + PLAN[k].n); if (W.wedge && k !== 'wedge') opCancel(W, 'wedge', (PLAN[was] || {}).n + ' → ' + PLAN[k].n); };
  if (!W.plan){
    const heavy = mine.some(u => u.giant || u.shield || u.bodyShield) && mine.filter(u => !isFar(u)).length >= 3, sk = W.start && W.start.k, A1 = W.alarm1;
    const kc = centroid(known), spread = mine.length >= 4 && (() => { const s = mine.map(u => Math.atan2(u.y - kc.y, u.x - kc.x)); let mx = 0; for (const a of s) for (const b of s) mx = Math.max(mx, angDiff(a, b)); return mx > 1.6; })();   // 우리가 상대를 둘러싼 꼴로 흩어져 있음
    const w = { assault: outgun ? 0.6 : 0.8, hold: tanks && bows && outgun ? 1.1 : 0, bait: bows >= 2 && outgun ? 0.9 : 0, hunt: fast >= 2 ? 0.9 : 0.3, wedge: heavy ? 1.2 : 0, encircle: fast >= 2 && mine.length >= 5 ? 1.1 : 0 };
    if (sk === 'pincer' || spread){ w.encircle *= 3; w.hold = 0; w.bait = 0; } else if (sk === 'rear'){ w.wedge *= 2; } else if (sk === 'ambush'){ w.hunt *= 2.5; w.hold = 0; } else if (sk === 'column'){ w.assault *= 1.5; w.encircle *= 0.5; }
    w.ambush = A1 && A1.surprise && !known.some(f => mine.some(e => dist(e, f) < 4.5)) ? 2.2 : 0;   // v6.2 상대가 아직 우리를 못 봤음 → 숨어 기다림
    const tot = Object.values(w).reduce((s, x) => s + x, 0);
    let r = W.rand() * tot, k = 'assault'; for (const j in w){ r -= w[j]; if (r <= 0){ k = j; break; } }
    set(k, `방패 ${tanks} · 궁수 ${bows} · 빠른 근접 ${fast}${outgun ? '' : ' · 사격은 상대가 셈 (사거리 · 수)'}${A1 ? (A1.surprise ? ' · 상대는 아직 우리를 못 본 듯 (짐작)' : ' · 서로 본 듯') : ''}${spread ? ' · 상대를 둘러싼 꼴' : ''}`);
    if (k === 'ambush') for (const e of mine) if (!pinnedBy(W, e) && !known.some(f => dist(e, f) < 4.5)){ e.lurk = true; e.lurkT0 = W.t; }
    return;
  }
  const P = W.plan; let pa = 0, pb = 0; for (const u of mine) pa += powerOf(u); for (const f of known) pb += powerOf(f);
  const lost = 1 - mine.length / Math.max(1, P.n0), ratio = pa / Math.max(1e-6, pb);
  if (P.k === 'withdraw'){
    if (W.t - P.t0 > (P.regroup ? 4 : 5)) set(P.regroup ? (ratio > 1.2 ? 'assault' : mine.some(u => u.bodyShield || u.shield) ? 'hold' : fast >= 2 ? 'hunt' : 'assault') : ratio > 1.2 ? 'assault' : 'hold', P.regroup ? '재편을 마침 — 다시 짠 대열로' : '다시 모임');
    return;
  }
  // v6.8 작전 실패 판정: 그 작전을 떠받치던 것이 무너지면 이유를 남기고 다시 짬 (6초에 한 번까지) — 매 순간 더 나은 걸 찾아 갈아엎지는 않음 (계획의 관성)
  if (!AI6.includes('opfail') && W.t - (P.failT == null ? -9 : P.failT) > 6 && W.t - P.t0 > 1){
    const shNow = mine.filter(u => u.shield).length, deadNow = W.units.filter(u => u.side === 1 && !u.alive && !u.down).length;
    const why = ['hold', 'bait', 'wedge', 'ambush'].includes(P.k) && P.sh0 >= 1 && shNow === 0 ? `방패 ${P.sh0}을 모두 잃음 — ${P.k === 'wedge' ? '쐐기를 이룰 방패가 없음' : '궁수를 가릴 몸이 없음'}`
      : P.cmd0 > 0 && cmd === 0 ? '지휘관이 쓰러짐'
      : deadNow - (P.dead0 || 0) >= 2 && W.t - P.t0 < 10 ? `${deadNow - (P.dead0 || 0)}명을 ${Math.max(1, Math.round(W.t - P.t0))}초 만에 잃음` : null;
    if (why){
      const heavy = mine.filter(u => !isFar(u) && !u.crawl).sort((a, b) => powerOf(b) - powerOf(a))[0], ec = centroid(known);
      let k, how, rally = null;
      if (bows && heavy && shNow === 0 && ratio < 1.3){ k = 'withdraw'; how = `재편 — 궁수를 ${heavy.name} 뒤로 모으고 다시 짬`; const d = Math.hypot(heavy.x - ec.x, heavy.y - ec.y) || 1; rally = freeSpot(W, heavy.x + (heavy.x - ec.x) / d * 1.6, heavy.y + (heavy.y - ec.y) / d * 1.6, 0.4) || { x: heavy.x, y: heavy.y }; }
      else if (ratio >= 1.2){ k = 'assault'; how = '아직 힘이 앞섬 — 밀어붙임'; }
      else if (fast >= 2){ k = 'hunt'; how = '빠른 근접으로 사수부터 몰아붙임'; }
      else { k = P.k === 'assault' ? 'hold' : 'assault'; how = k === 'hold' ? '무리하지 않고 버팀' : '거리를 좁혀 붙음'; }
      if (k === P.k){ P.failT = W.t; P.dead0 = deadNow; P.cmd0 = cmd; P.sh0 = shNow; L(W, { k: 'opCheck', side: 1, p: P.k, why, how, vis: true }); return; }   // 점검했지만 그대로 (같은 작전을 '실패 → 같은 작전' 으로 남기지 않음)
      L(W, { k: 'opFail', side: 1, p: P.k, why, next: k, how, vis: true });
      const wd = P.wd; set(k, how); W.plan.failT = W.t; W.plan.wd = wd; if (rally){ W.plan.rally = rally; W.plan.regroup = true; }
      return;
    }
  }
  if ((P.k === 'hold' || P.k === 'bait') && !outgun && W.t - P.t0 >= 3){ set(fast >= 2 ? 'hunt' : 'assault', '상대 사수를 봄 — 사거리 · 수에서 밀림, 거리를 좁힘'); return; }   // 새로 안 것에 맞춰 작전을 바꿈   // v7.0 작전은 적어도 3초
  const cmdLost = P.cmd0 > 0 && cmd === 0;
  if ((P.wd || 0) < 1 && mine.length >= 2 && ((ratio < 0.35 && lost >= 0.4) || (cmdLost && ratio < 0.35 && lost >= 0.3))){   // 한 판에 한 번 · 크게 밀릴 때만
    const bk = mine.filter(isFar), base = bk.length ? centroid(bk) : centroid(mine.map(u => u.home)), ec = centroid(known), c = centroid(mine);
    let ax = c.x - ec.x, ay = c.y - ec.y; const al = Math.hypot(ax, ay) || 1; ax /= al; ay /= al;
    let rally = freeSpot(W, base.x + ax * 1.2, base.y + ay * 1.2, 0.4) || base;
    const wd = (P.wd || 0) + 1; set('withdraw', cmdLost ? '지휘관을 잃고 밀림' : '크게 밀림'); W.plan.wd = wd; W.plan.wdT = W.t; W.plan.rally = rally; P.cmd0 = cmd;
    return;
  }
  if (P.k === 'bait' && W.stance[1]){ const S = W.stance[1];
    const lured = known.some(f => mine.some(a => isFar(a) && dist(a, f) <= a.rng - 0.5 && losClear(W.map, a.x, a.y, f.x, f.y)));
    if (lured || W.t - P.t0 > 9){ S.bait = 0; if (!P.done){ P.done = true; if (S.k === 'hold'){ S.k = 'engage'; S.t0 = W.t; L(W, { k: 'stance', side: 1, s: 'engage', why: lured ? '유인 성공 — 궁수 사거리 안' : '유인이 안 먹힘', was: 'hold', cmd, by: (cmdBoss(W, 1) || {}).i }); } } }
    else S.bait = 1.5;
  }
}
// 후퇴: 붙들리지 않은 쪽은 다시 모이는 자리로 (상대를 보며), 쫓기면 동료가 견제. 붙들렸거나 궁지면 맞섬
function withdrawStep(W, u, dt){
  const P = W.plan; if (!P || P.k !== 'withdraw' || !P.rally || u.crawl) return false;
  const f = W.units.filter(e => e.alive && e.side !== u.side && (canSee(W, u, e) || fresh(W, u.sense[e.i], 1.5))).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (f && !isFar(f) && gap(u, f) < f.rng + 0.25 && focusOf(W, f) === u) return false;   // 붙들림 → 맞섬 (살아남기 판단은 따로)
  if (cornered(W, u)) return false;
  const d = Math.hypot(P.rally.x - u.x, P.rally.y - u.y);
  if (d > 1.1 + (u.i % 3) * 0.35){ setMood(W, u, '후퇴', f ? f.i : null); goTo(W, u, P.rally.x, P.rally.y, dt); if (f) u.fg = Math.atan2(f.y - u.y, f.x - u.x); return true; }
  if (isFar(u) && f && canSee(W, u, f) && gap(u, f) <= u.rng) return false;   // 다시 모인 궁수는 쏨
  stop(u); if (f) u.fg = Math.atan2(f.y - u.y, f.x - u.x); setMood(W, u, '재집결'); return true;
}
// v6.0 휘두르기 비켜서기: 넓게 휘두르기를 준비하는 동료의 부채꼴 (+0.5칸 여유) 안이면 그 밖 (옆 · 뒤) 으로 비켜섬
function clearSweep(W, u, dt){
  if (u.crawl || u.kb) return false;
  for (const m of W.units){
    if (!m.alive || m === u || m.side !== u.side || !m.act || m.act.k !== 'atk' || m.act.mode !== 'sweep' || m.act.phase !== 'wind') continue;
    const S = W.rules.sweep || {}, arc = (S.arc || 65) * Math.PI / 180, R = m.rng + (S.reach || 0.35) + 0.5, t = W.units[m.act.b]; if (!t) continue;
    const ang = Math.atan2(t.y - m.y, t.x - m.x), a = Math.atan2(u.y - m.y, u.x - m.x);
    if (gap(m, u) > R || angDiff(a, ang) > arc + 0.6) continue;   // 상대가 움직여 휘두르는 방향이 틀어질 여유까지
    const s = Math.sign(((a - ang + 3 * Math.PI) % (2 * Math.PI)) - Math.PI) || 1, out = ang + s * (arc + 0.7), d = Math.max(dist(m, u), m.r + u.r + 0.2);
    const px = m.x + Math.cos(out) * d, py = m.y + Math.sin(out) * d;
    if (rock(W.map, px, py)) continue;
    setMood(W, u, '비켜섬', m.i); goTo(W, u, px, py, dt); return true;
  }
  return false;
}
// 무기를 잃은 (창을 던진 · 떨어뜨린) 적: 맨손으로 거구에 맞서지 않음 — 창 · 무기를 되찾거나, 방패 동료 뒤로 물러나 틈을 봄. 붙들렸으면 맞섬
function rearm(W, u, t, dt){
  if (retrieveSpear(W, u, dt) || scavenge(W, u, dt)){ u.rearmT0 = null; return true; }
  if (u.rearmT0 == null) u.rearmT0 = W.t; if (W.t - u.rearmT0 > ((W.rules.rearm || {}).wait || 5) && retrieveSpear(W, u, dt, true)){ setMood(W, u, '창을 되찾으러 — 무릅씀'); return true; }   /* v8.7.3 끝없이 숨지 않음 */
  if (W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < f.rng + 0.25 && focusOf(W, f) === u)) return false;
  const S = W.units.filter(s => s.alive && s !== u && s.side === u.side && (s.shield || s.bodyShield) && !s.crawl && !isFar(s)).sort((a, b) => dist(a, u) - dist(b, u))[0];
  if (S && dist(S, u) < 7){ const d = dist(t, S) || 1, px = S.x + (S.x - t.x) / d * (S.r + u.r + 0.3), py = S.y + (S.y - t.y) / d * (S.r + u.r + 0.3);
    if (!rock(W.map, px, py)){ setMood(W, u, '무장 회복 — 방패 뒤', S.i); if (Math.hypot(px - u.x, py - u.y) > 0.15) goTo(W, u, px, py, dt); else { stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); } return true; } }
  if (gap(u, t) < t.rng + 2.2){ const p = fallbackPt(W, u, t, 1.5); if (p){ setMood(W, u, '무기 없이 물러남', t.i); goTo(W, u, p.x, p.y, dt); return true; } }
  return false;
}

/* ---------- v6.3 아는 것 (정보): 양쪽 다 전지하지 않음 — 본 것 · 들은 것 · 겪은 것만으로 상대를 판단 ----------
   W.intel[편][상대 번호] = 처음 본 때 · 겉모습 (무기 · 방패 · 갑옷 · 거구 · 횃불) · 우리가 준 피해 (→ 남은 체력 짐작) · 그놈이 우리에게 준 피해 · 쓰러뜨린 수 · 약을 쓴 수 · 외친 수 · 총성.
   위험 (가장 무섭게 치는 놈) · 중심 (약 · 횃불 · 외침 — 무리를 지탱하는 놈) · 약한 고리 (짐작한 남은 체력 × 갑옷 · 방패 · 불사) 는 모두 이것으로만 정함.
   새로 안 것 (◆ 적이 알게 됨 / ◇ 우리가 알게 됨) 과 판단이 바뀐 때는 로그에 — 초전을 복기하는 자료 */
const guessMax = f => Math.round(110 * (f.giant ? 3 : 1) * ((f.h || 1.7) >= 2 ? 1.3 : 1) * (((((f.gear || {})['몸'] || {}).tier || 0) >= 3) ? 1.15 : 1));   // 겉모습으로 짐작한 체력 (진짜와 다를 수 있음)
const iRec = (W, S, f) => { const I = (W.intel || (W.intel = [{}, {}]))[S]; if (!I) return { seenT: null, tags: [], dmg: 0, dealt: 0, kills: 0, heals: 0, shouts: 0, shots: 0, guess: guessMax(f) };   /* v8.7.4 2편은 짐작을 쌓지 않음 */
  return I[f.i] || (I[f.i] = { seenT: null, tags: [], dmg: 0, dealt: 0, kills: 0, heals: 0, shouts: 0, shots: 0, guess: guessMax(f) }); };
const iKnow = (W, S, f) => !!(W.intel && W.intel[S] && W.intel[S][f.i] && W.intel[S][f.i].seenT != null);
const iTag = (W, S, f, tag, why) => { if (S !== 0 && S !== 1) return false; const r = iRec(W, S, f); if (r.tags.includes(tag)) return false; r.tags.push(tag); L(W, { k: 'intel', side: S, b: f.i, tag, why: why || '', vis: true }); return true; };
// 짐작한 남은 체력 비율 (본 적 없으면 멀쩡하다고 봄). 쓰러져 누운 건 보이면 앎
function pHp(W, S, f){ if (!f) return 1; if (f.side === S) return f.hp / f.max; const r = W.intel && W.intel[S] && W.intel[S][f.i]; if (!r) return 1; if (!f.alive && f.down && r.seenT != null) return 0.02; const est = 1 - r.dmg / Math.max(1, r.guess), age = r.last && !AI6.includes('stale') ? W.t - r.last.t : 0; return Math.max(0.03, Math.min(1, est + (age > 6 ? (age - 6) * 0.03 : 0))); }   // v6.5 6초 넘게 못 본 상대는 그사이 회복했을 수 있음 (짐작이 흐려짐)
const looks = f => { const t = []; const g = (f.gear || {})['몸']; t.push(isFar(f) ? (f.loud ? '총' : '활') : (f.weaponNow || f.weapon || '맨손')); if (f.shield && !f.armShield) t.push('방패'); if (f.giant) t.push('거구'); if (g) t.push((g.tier >= 3 || g.mat === '판금' ? '중갑' : '갑옷') + ' (' + g.mat + ')'); if (f.torch) t.push('횃불'); return t; };
function iDanger(W, S, f){ const r = W.intel && W.intel[S] && W.intel[S][f.i]; if (!r) return 0; return r.dealt + r.kills * 40 + (r.tags.includes('총') ? 25 : r.tags.includes('활') ? 12 : 0) + (r.tags.includes('거구') ? 15 : 0); }
function iCenter(W, S, f){ const r = W.intel && W.intel[S] && W.intel[S][f.i]; if (!r) return 0; return r.heals * 30 + (r.tags.includes('지휘') ? 25 + (r.orders || 0) * 3 : 0) + (r.tags.includes('횃불') ? 20 : 0) + r.shouts * 8 + (r.tags.includes('구급') ? 15 : 0) + (r.tags.includes('총') ? 8 : 0); }
const iWhyD = (W, S, f) => { const r = W.intel[S][f.i], p = []; if (r.dealt) p.push(`우리 편에게 피해 ${Math.round(r.dealt)}`); if (r.kills) p.push(`${r.kills}명을 쓰러뜨림`); for (const t of ['총', '활', '거구']) if (r.tags.includes(t)) p.push(t); return p.join(' · ') || '본 것뿐'; };
const iWhyC = (W, S, f) => { const r = W.intel[S][f.i], p = []; if (r.heals) p.push(`약을 씀 ${r.heals}번`); if (r.tags.includes('지휘')) p.push(`지휘를 외침${r.orders > 1 ? ' ' + r.orders + '번' : ''}`); if (r.tags.includes('횃불')) p.push('횃불을 듦'); if (r.shouts) p.push(`외침 ${r.shouts}번 (지휘하는 듯)`); if (r.tags.includes('총')) p.push('총'); return p.join(' · ') || '본 것뿐'; };
function intelTick(W){
  if (!W.intel) W.intel = [{}, {}];
  // 지금 보이는 상대 → 처음 보면 겉모습을 앎
  for (const f of W.units){ if (!f.alive) continue; for (const S of f.side > 1 ? [0, 1] : [1 - f.side]){   /* v8.7.4 2편은 두 편 모두가 봄 */
    const vis = S === 0 ? !!f.seenBy : W.units.some(e => e.alive && e.side === 1 && canSee(W, e, f));
    if (!vis) continue; const r = iRec(W, S, f); r.last = { x: +f.x.toFixed(1), y: +f.y.toFixed(1), t: W.t };
    if (r.seenT == null){ r.seenT = W.t; const lk = looks(f); r.tags.push(...lk.filter(x => !r.tags.includes(x))); L(W, { k: 'intel', side: S, b: f.i, tag: lk.join(' · '), why: '처음 봄', first: true, vis: true }); }
    else { const w = f.weaponNow || f.weapon; if (w && !isFar(f) && !r.tags.includes(w) && !r.tags.includes('총') && !r.tags.includes('활')) iTag(W, S, f, w, w === '맨손' || f.weaponGone || (f.jav && !f.spearHeld) ? '무기를 놓침 · 던짐' : '무기를 바꿔 듦'); if (f.torch && !r.tags.includes('횃불')) iTag(W, S, f, '횃불', '불빛'); } } }
  // 겪은 일 (로그를 따라 읽음)
  for (let k = W.intelLi || 0; k < W.log.length; k++){ const l = W.log[k], a = W.units[l.a], b = l.b != null ? W.units[l.b] : null;
    const sees = (S, x) => x && (x.side === S || (S === 0 ? !!x.seenBy : W.units.some(e => e.alive && e.side === 1 && canSee(W, e, x))));
    if (l.k === 'hit' && a && b && a.side !== b.side){ iRec(W, a.side, b).dmg += l.dmg; if (sees(b.side, a)){ const r = iRec(W, b.side, a); r.dealt += l.dmg; } }
    else if ((l.k === 'die' || l.k === 'down') && a && b && a.side !== b.side && sees(b.side, a)) iRec(W, b.side, a).kills++;
    else if (l.k === 'skill' && a && b && l.amt && sees(1 - b.side, b) && !AI6.includes('stale')){ const r = iRec(W, 1 - b.side, b); r.dmg = Math.max(0, r.dmg - l.amt);   // v6.5 치료받는 걸 보면 짐작한 피해에서 뺌
      if (sees(1 - a.side, a)){ iRec(W, 1 - a.side, a).heals++; iTag(W, 1 - a.side, a, '구급', `${b.name}에게 약을 씀`); } }
    else if (l.k === 'skill' && a && sees(1 - a.side, a)){ const r = iRec(W, 1 - a.side, a); r.heals++; iTag(W, 1 - a.side, a, '구급', `${b ? b.name : ''}에게 약을 씀`); }
    else if (l.k === 'rise' && a && sees(1 - a.side, a)){ if (!AI6.includes('stale')) iRec(W, 1 - a.side, a).dmg = iRec(W, 1 - a.side, a).guess * 0.6; iTag(W, 1 - a.side, a, '불사', '쓰러졌다 다시 일어남'); }   // v6.5 일어나면 짐작을 다시 (반쯤 찬 피)
    else if (l.k === 'noise' && a){ const S = 1 - a.side; if ((l.heard || []).some(i => W.units[i] && W.units[i].side === S)){ const r = iRec(W, S, a); r.shots++; iTag(W, S, a, '총', '총성을 들음'); } }
    else if (l.k === 'stance' || (l.side === 1 && (l.k === 'plan' || l.k === 'focus' || (l.k === 'cmdCharge' && !l.self) || ((l.k === 'wedge' || l.k === 'env') && l.s === 'form')))){ const X = l.side, S = 1 - X, c = W.units.filter(u => u.side === X && u.alive && u.cmd).sort((p, q) => q.cmd - p.cmd)[0];   // 진형 · 작전이 바뀔 때 외치는 놈 = 지휘 (보이거나, 본 적 있고 들리는 거리 · 말 못 하는 놈은 몸짓이라 보여야 앎)
      if (c && (sees(S, c) || (!c.mute && iKnow(W, S, c) && W.units.some(e => e.alive && e.side === S && dist(e, c) < hearR(W, c, e))))){ const r = iRec(W, S, c); r.orders = (r.orders || 0) + 1; iTag(W, S, c, '지휘', l.k === 'cmdCharge' ? (c.mute ? '가리키며 포효하자 ' + W.units[l.b].name + (jongE(W.units[l.b].name) ? '이' : '가') + ' 돌진' : '"들이받아!" — ' + W.units[l.b].name + (jongE(W.units[l.b].name) ? '이' : '가') + ' 돌진') : c.mute ? (l.k === 'focus' ? '표적을 가리키며 포효' : '포효 · 몸짓에 무리가 따라 움직임') : l.k === 'plan' ? '작전을 외침' : l.k === 'focus' ? '표적을 가리키며 외침' : '진형을 외침'); } }
    else if (l.k === 'shout' && a && !l.mute){ const S = 1 - a.side; if (sees(S, a) || W.units.some(e => e.alive && e.side === S && dist(e, a) < hearR(W, a, e))){ const r = iRec(W, S, a); r.shouts++; if (r.shouts >= 2) iTag(W, S, a, '외침', '여러 번 외침 — 지휘하는 듯'); } }
  }
  W.intelLi = W.log.length;
  // 판단: 가장 위험한 놈 · 전장의 중심 (바뀌면 기록)
  for (const S of [0, 1]){ if (!W.units.some(u => u.alive && !u.gone && u.side === S)) continue;   /* v8.7.3 다 쓰러진 편 (끝난 맵의 '◆ 적의 판단') */
    const K = W.units.filter(f => f.alive && !f.gone && f.side !== S && iKnow(W, S, f)), J = (W.judge || (W.judge = [{}, {}]))[S]; let ch = false;
    if (J.d != null && (!W.units[J.d].alive || W.units[J.d].gone)){ J.d = null; ch = true; } if (J.c != null && (!W.units[J.c].alive || W.units[J.c].gone)){ J.c = null; ch = true; }   // 쓰러지면 다시 봄
    if (K.length){ const d = K.reduce((x, y) => iDanger(W, S, y) > iDanger(W, S, x) ? y : x, K[0]), c = K.reduce((x, y) => iCenter(W, S, y) > iCenter(W, S, x) ? y : x, K[0]);
      if (iDanger(W, S, d) > 0 && J.d !== d.i && iDanger(W, S, d) > (J.d != null ? iDanger(W, S, W.units[J.d]) * 1.25 : 0)){ J.d = d.i; ch = true; }
      if (iCenter(W, S, c) > 0 && J.c !== c.i && iCenter(W, S, c) > (J.c != null ? iCenter(W, S, W.units[J.c]) * 1.25 : 0)){ J.c = c.i; ch = true; } }
    if (ch && (J.d != null || J.c != null)) L(W, { k: 'judge', side: S, d: J.d, dWhy: J.d != null ? iWhyD(W, S, W.units[J.d]) : '', c: J.c, cWhy: J.c != null ? iWhyC(W, S, W.units[J.c]) : '', vis: true });
  }
}

/* ---------- v7.8.1 조우 전: 따로 떠도는 망자 · 경보 ----------
   처음엔 서로 모름. 적 (망자의 군대) 은 진도 집도 없고 지치지도 잠들지도 않음 — 판 위 아무 데나 흩어져 (상대 눈에 안 보이는 어둠이면 사방 어디든) 저마다 아무 곳으로 떠돎. 자리 · 길 · 멈춰 귀 기울이는 때가 판마다 · 몸마다 다름.
   떠돌다 서로 마주치면 (roam.meet 칸 · 가리지 않음) 큰 무리 쪽으로 뭉쳐 함께 떠돎 — 점점 합을 이룸.
   누가 상대를 처음 보면 소리쳐 경보 — 외침이 닿는 (들리는 거리, 싸움 소리에 줄어듦) 동료만 1초 뒤 그 자리를 알고 움직이고, 들은 쪽도 다시 소리침 (사슬). 상대를 본 몸도 소리침.
   외침이 닿지 않는 먼 몸은 계속 떠돌다 싸움 소리 · 총성을 듣거나 직접 보면 옴. 적의 자리 · 길 · 경보는 로그만 앎 (판 · 이야기에는 우리 눈에 보인 것만) */
// v7.0 기습할 수 있나 — 적이 아는 것으로만 짐작 (상대의 실제 시야는 모름): 우리 (적) 가 맞거나 사격받은 적 없고, 상대 가까이 불빛 속에 선 동료가 없음
const surpriseEst = W => !W.units.some(e => e.side === 1 && e.alive && (e.taken > 0 || e.farHitT != null || (litAt(W, e.x, e.y) && W.units.some(a => a.side === 0 && a.alive && dist(a, e) < W.rules.sight))));
const DIR8K = ['동', '남동', '남', '남서', '서', '북서', '북', '북동'];
const dirName = (dx, dy) => DIR8K[((Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) % 8) + 8) % 8];
const RM = W => W.rules.roam || {};
const rmR = (W, g, d) => Array.isArray(g) ? g[0] + W.rand() * (g[1] - g[0]) : g != null ? g : d;
const spdB = u => u.spd * (u.spdMul || 1) * (u.injSpd || 1);
function roamIdle(u){ return !!(u && u.roam && u.state === 'idle'); }   // 아직 떠도는 중 (경보를 못 들음 · 상대를 못 봄)
function roamN(W, u){ if (!u.roam) return 1; const r = u.roam.lead != null ? u.roam.lead : u.i; return 1 + W.units.filter(o => o.alive && o.roam && o.roam.lead === r && o !== W.units[r]).length; }
function patrolStart(W){
  const E = W.units.filter(u => u.side === 1), A = W.units.filter(u => u.side === 0); if (!E.length || !A.length) return;
  const m = W.map, ac = centroid(A), R = RM(W), seenAt = (x, y, pad) => A.some(a => Math.hypot(a.x - x, a.y - y) < W.rules.sight + (pad || 0.5));   // 우리 눈 (보는 거리) 밖 어둠이면 사방 어디든 — 우리 횃불은 처음부터 보일 수 있음
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

/* ---------- v6.1 적의 전술 (죽은 시대의 베테랑 기사조) ----------
   약한 고리 집중 (focus): 아는 상대 중 가장 약하고 값진 쪽 (체력 · 갑옷 · 막지 못함 · 사수 · 구급 · 주인공 · 지휘 · 혼자 떨어짐) 을 표적으로 — 궁수와 근접 공격수가 몰리고, 방패 · 거구는 우리 탱커를 붙듦
   쐐기 돌파 (wedge): 가장 무거운 몸이 끝, 방패 둘이 어깨, 나머지가 몸통 — 우리 전열의 관절 (두 마디 사이) 을 찔러 뚫으면 몸통이 뒤의 표적으로 쏟아져 들어감
   산개 포위 (env): 방패 · 거구가 정면을 붙드는 사이 나머지가 둘로 갈라져 넓게 벌려 옆으로, 그다음 뒤로 돌아 들어감. 궁수는 양옆에서 십자 사격
   판마다 다른 시작 (start): 정면 대치 · 양쪽 협공 · 매복 · 후방 기습 · 행군 중 조우 — 적의 시작 자리가 판마다 다르고, 작전도 그에 맞춤 */
const jongE = w => { const s = String(w || '').replace(/[\s)\]]+$/, ''), d = s.slice(-1); if (/[0-9]/.test(d)) return [1, 1, 0, 1, 0, 0, 1, 1, 1, 0][+d] === 1; const c = s.charCodeAt(s.length - 1) - 0xAC00; return c >= 0 && c <= 11171 && c % 28 !== 0; };   /* v8.7.3 숫자 끝도 (망자 5 · 일) */   // 받침 (은 · 는)
const armorOf = f => 1 + 0.18 * (((f.gear || {})['몸'] || {}).tier || 0) + 0.08 * (((f.gear || {})['머리'] || {}).tier || 0);
// v6.3 약한 고리 = 아는 것으로만: 짐작한 남은 체력 × 보인 갑옷 · 방패 · (겪어 안) 불사, 값 = 위험 · 중심 · 사수 · 혼자 떨어짐
function weakScore(W, f, S){ S = S != null ? S : 1 - f.side; const r = iRec(W, S, f), tg = r.tags; const flee = !AI6.includes('nochase') && W.fleeT && W.t - (W.fleeT[f.i] == null ? -9 : W.fleeT[f.i]) < 3 && !W.units.some(m => m.alive && m.side === S && dist(m, f) < 3.5) ? 0.4 : 1;   // v6.5 달아나는 빠른 사수는 표적에서 미룸
  const eff = Math.max(5, r.guess * pHp(W, S, f)) * (1 + (tg.includes('중갑') ? 0.4 : tg.some(x => /^갑옷/.test(x)) ? 0.2 : 0)) * (tg.includes('방패') ? 1.3 : 1) * (tg.includes('불사') ? 2.5 : 1) * (tg.includes('거구') ? 1.3 : 1);
  const val = 1 + iCenter(W, S, f) / 30 + iDanger(W, S, f) / 60 + (tg.includes('총') || tg.includes('활') ? 0.6 : 0);
  return flee * val * (supportOf(W, f) === 0 ? 1.3 : 1) * (f.exhausted && (S === 0 ? true : !!f.seenBy || W.units.some(e => e.alive && e.side === S && canSee(W, e, f))) ? 1.3 : 1) * 1000 / eff; }   // v6.6 탈진한 상대 (보이면) 노림
function weakWhy(W, f, S){ S = S != null ? S : 1 - f.side; const r = iRec(W, S, f), tg = r.tags, p = [`남은 체력 짐작 ${Math.round(pHp(W, S, f) * 100)}% (겉보기 ${r.guess})`];
  const arm = tg.find(x => /^(중갑|갑옷)/.test(x)); p.push(arm || '갑옷이 안 보임'); if (!tg.includes('방패')) p.push('방패 없음'); for (const t of ['총', '활', '횃불', '구급', '지휘', '외침', '불사']) if (tg.includes(t)) p.push(t === '외침' ? '외침 (지휘하는 듯)' : t);
  if (iDanger(W, S, f) > 0 && r.dealt) p.push(`우리에게 피해 ${Math.round(r.dealt)}`); if (supportOf(W, f) === 0) p.push('혼자 떨어짐'); return p.join(' · '); }
function planFocus(W, mine, known){
  if (W.focus && !W.focus.down && (!W.units[W.focus.b].alive || W.units[W.focus.b].down)){ W.focus.down = true; if (!W.units[W.focus.b].gone) L(W, { k: 'focusDown', side: 1, b: W.focus.b, by: (cmdBoss(W, 1) || {}).i, vis: true }); }   /* v8.7.3 나간 이는 쓰러뜨린 게 아님 */   // v6.8 표적을 쓰러뜨림 (작전 성공 하나)
  const cand = known.filter(f => f.alive && !f.down && iKnow(W, 1, f)); if (!cand.length) return;   // v6.3 본 적 있는 상대만
  if (W.hunt && W.units[W.hunt.g].alive) return;   // v6.5 사수 몰이 중엔 그 사수
  const cur = W.focus && W.units[W.focus.b], best = cand.reduce((a, b) => weakScore(W, b) > weakScore(W, a) ? b : a, cand[0]);
  if (cur === best || (cur && cur.alive && !cur.down && cand.includes(cur) && !(AI6.includes('fhold') ? weakScore(W, best) > weakScore(W, cur) * 1.4 : weakScore(W, best) > weakScore(W, cur) * 1.6 && (W.t - W.focus.t0 >= 4 || pHp(W, 1, best) < 0.25)))) return;   // v6.5 표적은 4초는 지킴 (끝낼 수 있는 놈이면 예외) · 1.6배는 나아야 바꿈
  W.focus = { b: best.i, t0: W.t };
  const bs = cmdBoss(W, 1); L(W, { k: 'focus', side: 1, b: best.i, why: weakWhy(W, best), was: cur && cur.alive && cur !== best ? cur.i : null, by: bs ? bs.i : null, tmp: !!(bs && bs.cmdTmp), vis: true });   // v6.8 누가 정했나 (지휘관 · 임시 지휘)
}
const focusBonus = (W, u, f) => W.focus && W.focus.b === f.i && u.role !== '전선' ? (isFar(u) ? 14 : dist(u, f) < 5.5 || (W.env && W.env.wp[u.i]) || (W.wedge && W.wedge.phase === 'breach' && W.wedge.body.includes(u.i)) ? 9 : 0) * taskFocusMul(W, u) : 0;   // v6.9 임무 (압박 · 사격 조가 몰리고 나머지는 반)
// v6.3.2 지휘관의 돌진 명령: 전열을 지키는 마디는 스스로 돌진하지 않음 (v6.3.1) — 지휘관이 빈틈을 보고 '들이받아!' 하면 대열을 박차고 돌격.
// 명령이 닿아야 함 (들리는 거리 · 말 못 하는 지휘관은 보여야 함). 마디가 빠지면 전열에 구멍이라 스스로 돌진할 때보다 값을 더 따짐.
// v6.3.3 유연하게 — 정해진 틀 (한 명 · 3초) 대신 지휘관이 그때 상황을 읽음 (cmdSit): 우세 · 열세, 상대 총이 장전 중인지 겨누는지, 상대 전열이 무너졌는지,
// 대치가 길어지는지, 우리가 맞고만 있는지, 많이 잃었는지, 지난 돌격이 막혔는지, 작전 (밀어붙임 · 버팀 · 유인 · 후퇴). 기회가 크면 여럿을 한꺼번에 (함께 돌격),
// 불리하면 참게 함 (참은 까닭도 로그). 후퇴 중엔 쫓아오는 놈만 되받아침. 다음 명령까지의 틈도 상황 따라 (1.5 ~ 5초)
const cmdChgWhy = (W, u, f) => { const p = []; if (W.focus && W.focus.b === f.i) p.push('표적'); if (isFar(f)) p.push('사수'); if (f.act && f.act.k === 'reload') p.push('재장전 중'); else if (f.act && f.act.phase === 'wind') p.push('공격 준비 중'); const sd = sideOf(W, f, u); if (sd !== 'front') p.push(sd === 'back' ? '등 뒤' : '옆구리'); if (pHp(W, 1, f) < 0.5) p.push('다친 듯'); if (!f.canGuard || f.guardMode === 'off' || W.t < f.brokenT) p.push('막을 게 없음'); return p.join(' · ') || '빈틈'; };
function cmdSit(W, mine, known, C){
  const S = W.stance[1] || {}, pk = W.plan && W.plan.k, R = [], foes = W.units.filter(f => f.alive && f.side !== 1 && iKnow(W, 1, f));
  let d = 0, wave = 0;
  const ours = mine.reduce((s, u) => s + u.hp / u.max * (u.giant ? 2 : 1), 0), theirs = foes.reduce((s, f) => s + pHp(W, 1, f) * (f.giant ? 2 : 1), 0), ratio = ours / Math.max(0.5, theirs);
  if (ratio >= 1.6){ d -= 0.5; R.push('우리가 우세'); if (ratio >= 2.2) wave++; } else if (ratio < 0.8){ d += 0.5; R.push('열세'); }
  const guns = known.filter(f => isFar(f) && f.loud && (f.ammoMax == null || f.ammoMax > 0));
  if (guns.length && guns.every(g => (g.act && g.act.k === 'reload') || (g.ammoMax != null && g.ammo === 0))){ d -= 0.6; R.push(guns.some(g => g.ammo === 0) ? '상대 총이 빔' : '상대 총이 장전 중'); wave++; }
  const tanks = foes.filter(f => f.role === '전선' && !isFar(f));
  if (tanks.length && tanks.every(t => W.t < t.proneT || W.t < t.brokenT || W.t < (t.stunT || -9) || t.crawl)){ d -= 0.5; R.push('상대 탱커가 무너짐'); wave++; }
  if (S.k === 'hold'){ if (W.t - S.t0 < 6){ d += 0.5; R.push('대치 중'); } else { d -= 0.2; R.push('대치가 길어짐 — 깨야 함'); } }
  if ((W.farDmg[1] || 0) > 30){ d -= 0.3; R.push('맞고만 있을 순 없음'); }
  const dead = W.units.filter(u => u.side === 1 && !u.alive && !u.gone).length; if (dead >= 2 && ratio < 1.2){ d += 0.3; R.push(`${dead}명을 잃음 — 아낌`); }
  const LR = W.cmdChgLast; if (LR && W.t - LR.t < 8){ const u = W.units[LR.u], im = W.log.find(x => x.t >= LR.t && x.a === LR.u && (x.k === 'impact' || x.k === 'chargeMiss'));
    if (!u.alive || u.down || (im && (im.k === 'chargeMiss' || im.held))){ d += 0.4; R.push('지난 돌격이 막힘'); } else if (im && (im.setBroke || im.full)){ d -= 0.2; R.push('지난 돌격이 먹힘'); } }
  if (pk === 'assault' || pk === 'wedge'){ d -= 0.3; R.push('작전: ' + PLAN[pk].n); } else if (pk === 'hold' || pk === 'bait'){ d += pk === 'bait' && !W.plan.done ? 0.6 : 0.3; R.push('작전: ' + PLAN[pk].n); }
  return { d, R, wave: wave >= 1 && ratio >= 0.9 ? Math.min(3, 1 + wave) : 1, ratio, wd: pk === 'withdraw' };
}
function cmdCharge(W, mine, known){
  if (W.t < (W.cmdChgT || 0)) return; const R = W.rules.charge || {};
  const C = mine.filter(u => u.cmd && !u.down && W.t >= u.proneT && W.t >= (u.stunT || -9)).sort((a, b) => b.cmd - a.cmd)[0]; if (!C) return;
  const M = mine.filter(u => u.line && u.canCharge && !u.act && !u.kb && !u.crawl && W.t >= u.chargeCd && W.t >= u.proneT && W.t >= u.brokenT && W.t >= (u.stunT || -9) && (u === C || W.rand() < cmdLink(W, C, u).p));   // v7.3 시끄러우면 가까운 마디만 들음   // v7.4 외침 · 손짓이 닿을 확률 (아군과 같은 공식)   // 명령이 닿는 마디만
  if (!M.length) return;
  const sit = cmdSit(W, mine, known, C), base = (R.worth != null ? R.worth : 1.8) + 0.3 - C.cmd * 0.1, need0 = base + sit.d;
  const opts = [];
  for (const u of M) for (const f of known){ if (!iKnow(W, 1, f)) continue; const g = gap(u, f); if (g < (R.min || 1.5) || g > (R.max || 5) || !(canSee(W, u, f) || canSee(W, C, f))) continue;
    let v = chargeValue(W, u, f) + (W.focus && W.focus.b === f.i ? 0.8 : 0) + (1 - pHp(W, 1, f)) * 0.8, need = need0; const why = [];
    if (sit.wd){ if (!mine.some(m => m !== u && gap(m, f) < (f.rng || 0.5) + 1.2)) continue; need = base + 0.3; why.push('쫓아오는 놈을 되받아침'); }   // 후퇴 중: 동료에게 붙은 놈만
    if (mine.some(m => m !== u && (m.down || W.t < m.proneT || m.crawl) && gap(m, f) < (f.rng || 0.5) + 0.6)){ v += 0.6; why.push('쓰러진 동료를 구함'); }
    const gd = isFar(f) ? 0 : gunDanger(W, u, f.x, f.y); if (gd > 0){ need += 0.35 * gd; why.push('총이 겨눔'); }
    opts.push({ u, f, v, need, why }); }
  opts.sort((a, b) => (b.v - b.need) - (a.v - a.need));
  const go = [], usedU = new Set(), perF = {};
  for (const o of opts){ if (go.length >= sit.wave) break; if (usedU.has(o.u) || (perF[o.f.i] || 0) >= 2 || o.v < o.need) continue; go.push(o); usedU.add(o.u); perF[o.f.i] = (perF[o.f.i] || 0) + 1; }
  if (!go.length){ const o = opts[0];   // 노릴 만했는데 참게 함 — 까닭을 남김 (6초에 한 번)
    if (o && o.v >= base && W.t >= (W.cmdHoldT || 0)){ W.cmdHoldT = W.t + 6; L(W, { k: 'cmdHold', side: 1, a: C.i, b: o.u.i, c: o.f.i, why: [...sit.R, ...o.why].join(' · ') || '값이 모자람', vis: true }); }
    return; }
  let n = 0;
  for (const o of go){ const k0 = W.log.length; if (!tryCharge(W, o.u, o.f, true)) continue; n++;
    L(W, { k: 'cmdCharge', side: 1, a: C.i, b: o.u.i, c: o.f.i, why: cmdChgWhy(W, o.u, o.f), sit: [...sit.R, ...o.why].join(' · '), wave: go.length, mute: !!C.mute, self: C === o.u, obs: !!o.u.seenBy, cobs: !!C.seenBy, vis: true });
    W.log.splice(k0, 0, W.log.pop());   // 명령이 먼저, 돌진이 뒤
    W.cmdChgLast = { u: o.u.i, t: W.t }; }
  if (!n) return;
  W.cmdChgT = W.t + (sit.R.includes('열세') || sit.R.some(x => /잃음|막힘/.test(x)) ? 5 : n > 1 || sit.d < -0.5 ? 1.5 : 3);
  if (W.fxOn && !go.every(o => o.u === C)) W.fx.push({ k: 'say', a: C.i, s: C.mute ? (n > 1 ? '👉👉💢' : '👉💢') : n > 1 ? '모두 들이받아!' : '들이받아!', t0: W.t });
}
function planWedge(W, mine, known){
  const V = W.wedge;
  if (V){ const tip = W.units[V.tip];
    if (!tip.alive || W.t - V.t0 > 16 || (V.phase === 'breach' && W.t - V.tb > 6) || (V.phase === 'contact' && W.t - V.tc > 5)){ L(W, { k: 'wedge', side: 1, s: 'end', tip: V.tip, why: !tip.alive ? '끝이 쓰러짐' : V.phase === 'breach' ? '뚫고 들어감 — 각자 싸움' : V.phase === 'contact' ? '맞닿았으나 뚫지 못함 (5초)' : '오래 걸림', ok: V.phase === 'breach', vis: true }); W.wedge = null; }
    else if (V.phase === 'contact' && !AI6.includes('wcheck')){   // v6.5 맞닿음 ≠ 돌파: 마디가 맞닿은 자리 너머로 1.2칸 넘게 들어가거나 우리 전열이 끊기면 돌파
      const thru = [V.tip, ...V.sh, ...V.body].map(i => W.units[i]).filter(m => m.alive && ((m.x - V.cp.x) * V.dir.x + (m.y - V.cp.y) * V.dir.y) > 1.2), lb = W.log.some(e => e.k === 'lineBreak' && e.side !== 1 && e.t >= V.tc);
      if (thru.length || lb){ V.phase = 'breach'; V.tb = W.t; L(W, { k: 'wedge', side: 1, s: 'breach', tip: V.tip, b: V.hit, body: V.body, thru: thru.map(m => m.i), why: thru.length ? '전열 너머로 들어감' : '우리 전열이 끊김', obs: true, vis: true }); } }
    else if (V.phase === 'drive'){ wedgeFix(W, V, tip, mine); if (!W.wedge) return; const hit = known.find(f => gap(tip, f) < Math.max(tip.rng, isFar(f) ? 0.3 : f.rng) + 0.35); if (hit){ if (AI6.includes('wcheck')){ V.phase = 'breach'; V.tb = W.t; L(W, { k: 'wedge', side: 1, s: 'breach', tip: V.tip, b: hit.i, body: V.body, obs: true, vis: true }); } else { const dd = dist(tip, hit) || 1; V.phase = 'contact'; V.tc = W.t; V.hit = hit.i; V.cp = { x: hit.x, y: hit.y }; V.dir = { x: (hit.x - tip.x) / dd, y: (hit.y - tip.y) / dd }; L(W, { k: 'wedge', side: 1, s: 'contact', tip: V.tip, b: hit.i, obs: !!tip.seenBy, vis: true }); } } }   // 맞닿음 = 근접 거리 (사수의 사거리는 아님)
    return;
  }
  const P = W.plan; if (!P || P.k !== 'wedge' || P.wedgeDone || !known.length) return;
  const melee = mine.filter(u => !isFar(u) && !u.crawl), heavy = melee.filter(u => u.giant || u.shield || u.bodyShield).sort((a, b) => b.mass - a.mass);
  if (!heavy.length || melee.length < 3) return;
  // v6.3.4 모일 수 있는 만큼만: 이미 싸우는 동료 · 7칸 넘게 떨어진 동료는 넣지 않음. 모일 동료가 모자라면 2초 기다려 보고 밀어붙임으로
  const tip = heavy[0], free = melee.filter(u => u !== tip && !busyW(W, u) && dist(u, tip) <= 7), sh = heavy.filter(u => free.includes(u)).slice(0, 2), body = free.filter(u => !sh.includes(u)), F = W.focus && W.units[W.focus.b];
  if (busyW(W, tip) || sh.length + body.length < 2){ P.wedgeTry = P.wedgeTry || W.t; if (W.t - P.wedgeTry > 2){ P.wedgeDone = true; const bz = melee.filter(u => u !== tip && busyW(W, u));
      planSwitch(W, 'assault', `쐐기로 모일 동료가 모자람 — ${bz.length ? bz.map(u => u.name).join(' · ') + ' 이미 싸우는 중' : '흩어져 있음'} → 각자 밀어붙임`); } return; }
  let aim = null, desc = '';
  for (const ln of (W.lines || []).filter(l => l.side !== 1)) for (let k = 0; k + 1 < ln.ids.length; k++){ const a = W.units[ln.ids[k]], b = W.units[ln.ids[k + 1]]; if (!a.alive || !b.alive) continue;
    const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, sc = -(F ? dist(m, F) : 0) - (a.hp + b.hp) / 200 - dist(m, tip) * 0.2; if (!aim || sc > aim.sc){ aim = { x: m.x, y: m.y, sc }; desc = `${a.name} · ${b.name} 사이 (전열의 관절)`; } }
  if (!aim){ const t = F && F.alive ? F : known.slice().sort((a, b) => dist(a, tip) - dist(b, tip))[0]; aim = { x: t.x, y: t.y }; desc = `${t.name} 쪽 (전열이 없음)`; }
  W.wedge = { tip: tip.i, sh: sh.map(u => u.i), body: body.map(u => u.i), aim, phase: 'drive', t0: W.t, desc }; P.wedgeDone = true;
  L(W, { k: 'wedge', side: 1, s: 'form', tip: tip.i, sh: sh.map(u => u.i), body: body.map(u => u.i), desc, obs: !!tip.seenBy, vis: true });
}
const pinnedBy = (W, u) => W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < Math.max(u.rng, f.rng) + 0.2 && focusOf(W, f) === u);
const busyW = (W, u) => W.units.some(f => f.alive && f.side !== u.side && gap(u, f) < Math.max(isFar(u) ? 0.3 : u.rng, isFar(f) ? 0.3 : f.rng) + 0.6);   // 맞붙어 싸우는 중 (근접 거리 — 사수의 사거리는 아님)
const planSwitch = (W, k, why) => { if (!W.plan || W.plan.k === k) return; const was = W.plan.k; W.plan.k = k; W.plan.t0 = W.t; W.plan.why = why; L(W, { k: 'plan', side: 1, p: k, was, why, vis: true }); };
// v6.3.4 쐐기를 고치며 감: 싸우게 된 · 너무 먼 마디는 빼고, 가까이서 동료가 싸우면 기다리지 않고 그쪽으로 틀어 들이받음, 3.5초면 모인 만큼으로 감, 남은 마디가 없으면 밀어붙임으로
function wedgeFix(W, V, tip, mine){
  const out = [];
  for (const arr of [V.sh, V.body]) for (let k = arr.length - 1; k >= 0; k--){ const o = W.units[arr[k]]; const why = !o.alive || o.crawl ? '쓰러짐' : busyW(W, o) ? '싸우는 중' : dist(o, tip) > 8 ? '멂' : null; if (why){ arr.splice(k, 1); if (o.alive) out.push(o.name + ' (' + why + ')'); } }
  if (out.length) L(W, { k: 'wedge', side: 1, s: 'drop', tip: V.tip, who: out.join(' · '), vis: true });
  const inW = j => j === V.tip || V.sh.includes(j) || V.body.includes(j);
  const m = mine.filter(x => !inW(x.i) && busyW(W, x) && dist(x, tip) < 11).sort((a, b) => dist(a, tip) - dist(b, tip))[0];
  if (m && V.help !== m.i){ const f = W.units.filter(x => x.alive && x.side !== 1 && gap(m, x) < Math.max(isFar(m) ? 0.3 : m.rng, isFar(x) ? 0.3 : x.rng) + 0.6).sort((a, b) => gap(m, a) - gap(m, b))[0];
    if (f){ V.help = m.i; V.aimB = f.i; V.go = true; L(W, { k: 'wedge', side: 1, s: 'turn', tip: V.tip, a: m.i, b: f.i, obs: !!tip.seenBy, vis: true }); } }
  if (V.aimB != null){ const f = W.units[V.aimB]; if (f.alive) V.aim = { x: f.x, y: f.y }; }   // 튼 쪽 상대를 따라감
  if (!V.go && W.t - V.t0 > 3.5){ V.go = true; L(W, { k: 'wedge', side: 1, s: 'go', tip: V.tip, n: 1 + V.sh.length + V.body.length, vis: true }); }
  if (!V.sh.length && !V.body.length){ L(W, { k: 'wedge', side: 1, s: 'end', tip: V.tip, why: '모인 마디가 없음', vis: true }); W.wedge = null; planSwitch(W, 'assault', '쐐기가 흩어짐 — 각자 밀어붙임'); }
}
/* ---------- v6.4 적의 기동: 지휘관이 플레이어처럼 유닛을 움직임 ----------
   지휘관이 있을 때 (한 번에 1 + 지휘력 가지까지): 포위 사냥 (한 상대에 둘 넘게 붙으면 앞은 하나가 붙들고 나머지는 옆 · 뒤로 돌아감) ·
   교대 (빈사 마디는 성한 동료 뒤로 빠지고 그 동료가 그 자리로 뛰어듦) · 양동 (큰 싸움이 붙으면 빠른 놈이 크게 돌아 사수 · 구급 · 궁수를 노림 —
   누가 막으러 나오면 동료 쪽으로 끌고 오고, 아무도 안 막으면 그대로 붙음).
   지휘관이 없어도 각자 본능으로: 총구 피하기 (사수가 나를 겨누면 옆으로 뜀 — 방패 · 큰 몸 동료 뒤 쪽을 먼저) · 끌고 오기 (혼자 거구 · 위험한 놈 · 둘에게 몰리면 동료 쪽으로 물러남).
   기동은 서둘러 뜀 (×run). 상대를 고르는 건 본 것 · 겪은 것 (v6.3) 으로. 로그에 모두, 이야기엔 우리 눈에 보인 것만 */
const MV_ORG = ['surround', 'swap', 'cover', 'feint', 'interpose', 'lead', 'follow', 'bguard', 'cut'];
const mvOn = (W, u) => !!(u.mv && W.t < u.mv.until);
const mvFree = (W, u) => u.alive && u.side === 1 && !u.shadow && !u.supp && !u.crawl && !u.kb && !u.lurk && !u.pact && W.t >= u.proneT && W.t >= (u.stunT || -9) && !mvOn(W, u) && !(u.act && u.act.k === 'charge') && !(W.wedge && !opFreed(W.wedge, u) && (W.wedge.tip === u.i || W.wedge.sh.includes(u.i) || W.wedge.body.includes(u.i))) && !(W.env && W.env.wp && W.env.wp[u.i] && !opFreed(W.env, u)) && !(W.plan && W.plan.k === 'withdraw');
// v6.4.1 궁수 흩어짐 (본능): 넓게 휘두르는 거구가 다가오는데 막아 줄 방패 동료가 없으면, 붙어 선 사수 중 거구에 가까운 쪽이 다른 쪽으로 빠짐 (한 번 휘두름에 둘이 걸리지 않게)
function scatterArchers(W, mine, known){
  for (const a of mine){ if (AI6.includes('scat') || !isFar(a) || !mvFree(W, a) || W.t < (a.scatT || 0)) continue;
    const G = known.find(g => g.canSweep && !g.down && !g.crawl && gap(a, g) < g.rng + 2.2 && ((g.act && g.act.k === 'charge') || gap(a, g) < g.rng + 1.2 || (Math.hypot(g.vx || 0, g.vy || 0) > 0.3 && (g.vx || 0) * (a.x - g.x) + (g.vy || 0) * (a.y - g.y) > 0)));
    if (!G || mine.some(m => (m.mv && m.mv.k === 'interpose' && m.mv.b === G.i && W.t < m.mv.until) || (m !== a && !isFar(m) && (m.shield || m.armShield) && dist(m, G) < dist(a, G) && segD(G, a.x, a.y, m) < m.r + G.r * 0.6))) continue;   // 방패 동료가 막고 있으면 그대로 쏨
    const b = mine.find(o => o !== a && o.alive && isFar(o) && dist(o, a) < 2.4 && gap(o, G) < G.rng + 2.4 && dist(o, G) >= dist(a, G)); if (!b) continue;   // 둘 다 곧 한 휘두름 안 — 거구에 더 가까운 쪽 (나) 만 빠지고 다른 하나는 계속 쏨
    const d1 = dist(a, G) || 1, d2 = dist(a, b) || 1, vx = (a.x - G.x) / d1 + (a.x - b.x) / d2 * 0.9, vy = (a.y - G.y) / d1 + (a.y - b.y) / d2 * 0.9, a0 = Math.atan2(vy, vx);
    let p = null; for (const da of [0, 0.6, -0.6, 1.1, -1.1]){ const x = a.x + Math.cos(a0 + da) * 2.2, y = a.y + Math.sin(a0 + da) * 2.2; if (x > 0.7 && y > 0.7 && x < W.map.W - 0.7 && y < W.map.H - 0.7 && !boxRock(W, x, y, a.r)){ p = { x, y }; break; } }
    if (!p) continue; a.mv = { k: 'scatter', x: p.x, y: p.y, b: G.i, run: true, until: W.t + 1.6 }; a.scatT = W.t + 4;
    L(W, { k: 'mvr', side: 1, m: 'scatter', a: a.i, b: G.i, c: b.i, obs: !!a.seenBy, vis: true }); }
}
function huntStep(W, mine, known, C, room){
  const H = W.hunt, melee = mine.filter(u => !isFar(u) && !u.crawl && u.alive);
  if (H){ const G = W.units[H.g];
    if (!G.alive || G.down || W.t - H.t0 > 12 || !H.cut.some(i => W.units[i].alive)){ L(W, { k: 'hunt', side: 1, s: 'end', b: H.g, why: !G.alive || G.down ? '쓰러뜨림' : W.t - H.t0 > 12 ? '12초 — 놓침' : '끊을 조를 잃음', vis: true }); for (const u of mine) if (u.mv && (u.mv.k === 'cut' || u.mv.k === 'close')) u.mv = null; W.hunt = null; return; }
    if (H.phase === 'cut' && (W.t - H.t0 > 5 || H.cut.every(i => { const u = W.units[i]; return !u.alive || (u.mv && u.mv.k === 'cut' && Math.hypot(G.x + u.mv.ox - u.x, G.y + u.mv.oy - u.y) < 1.2) || gap(u, G) < u.rng + 1; }))){
      H.phase = 'close'; const ids = melee.filter(u => (H.cut.includes(u.i) || u.target === G) && !busyW(W, u)).map(u => u.i);
      for (const i of ids){ const u = W.units[i]; u.mv = { k: 'close', b: G.i, run: true, until: W.t + 4 }; }
      L(W, { k: 'hunt', side: 1, s: 'close', b: H.g, ids, why: W.t - H.t0 > 5 ? '5초 — 모인 만큼' : '끊을 자리 잡음', vis: true }); }
    return; }
  if (!C) return;
  const W0 = W.huntW || (W.huntW = {});
  for (const G of known){ if (!isFar(G) || !G.loud || G.down) { continue; }
    const chasing = melee.filter(u => u.target === G && gap(u, G) > u.rng + 0.5), touch = melee.some(u => gap(u, G) < u.rng + 0.5);
    if (!chasing.length || touch){ W0[G.i] = 0; continue; }
    W0[G.i] = (W0[G.i] || 0) + 0.5; if (W0[G.i] < 3 || room < 2) continue;
    const E2 = centroid(melee), d = dist(G, E2) || 1, dx = (G.x - E2.x) / d, dy = (G.y - E2.y) / d, base = Math.atan2(dy, dx);
    const cut = melee.filter(u => mvFree(W, u) && !u.giant && !u.line && !busyW(W, u) && u.spd >= 1.8 && u.hp / u.max > 0.4 && dist(u, G) < 14).sort((p, q) => dist(p, G) / p.spd - dist(q, G) / q.spd).slice(0, 2); if (!cut.length) continue;
    const ids = [];
    cut.forEach((u, k) => { let o = null; for (const da of k ? [-0.8, -1.2, -0.4] : [0.8, 1.2, 0.4]){ const ox = Math.cos(base + da) * 3.2, oy = Math.sin(base + da) * 3.2, x = G.x + ox, y = G.y + oy; if (x > 0.8 && y > 0.8 && x < W.map.W - 0.8 && y < W.map.H - 0.8 && !boxRock(W, x, y, u.r)){ o = { ox, oy }; break; } }
      if (!o) return; u.mv = { k: 'cut', b: G.i, ox: o.ox, oy: o.oy, run: true, until: W.t + 6 }; ids.push(u.i); });
    if (!ids.length) continue;
    W.hunt = { g: G.i, cut: ids, phase: 'cut', t0: W.t }; W0[G.i] = 0; W.focus = { b: G.i, t0: W.t };
    L(W, { k: 'hunt', side: 1, s: 'start', b: G.i, ids, chase: chasing.map(u => u.i), why: '빠지며 쏨 — 3초 넘게 못 붙음', vis: true }); return; }
}
function planMoves(W, mine, known){
  const reach = (a, b) => Math.max(isFar(a) ? 0.3 : a.rng, isFar(b) ? 0.3 : b.rng) + 0.6;
  // v6.5 순찰조 합류: 경보 뒤 본대 (순찰 · 초병이 아닌 근접) 에서 떨어진 순찰조 · 초병은, 맞붙지 않았고 상대가 코앞이 아니면 본대로 모임. 본대는 그동안 (경보 뒤 4초까지, 상대가 6칸 안에 오면 그만) 기다림
  if (W.alarm1 && W.alarm1.spread && !AI6.includes('rejoin') && !(W.plan && ['ambush', 'withdraw'].includes(W.plan.k))){
    const core = mine.filter(m => !m.patrol && !m.sentry && !isFar(m));
    if (core.length >= 2){ const cc = centroid(core); let going = 0;
      for (const u of mine){ if (!(u.patrol || u.sentry) || u.rejoined || busyW(W, u)) continue;
        if (dist(u, cc) < 3.2 || known.some(f => !f.down && gap(u, f) < (isFar(f) ? 0.3 : f.rng) + 2.5) || W.t - W.alarm1.t > 9){ u.rejoined = true; continue; }
        if (!mvFree(W, u) && !(u.mv && u.mv.k === 'rejoin')) continue;
        u.mv = { k: 'rejoin', x: cc.x, y: cc.y, run: true, until: W.t + 0.8 }; going++;
        if (!u.rejoinLog){ u.rejoinLog = true; L(W, { k: 'mvr', side: 1, m: 'rejoin', a: u.i, c: core[0].i, d: +dist(u, cc).toFixed(1), obs: !!u.seenBy, vis: true }); } }
      if (going && W.t - W.alarm1.t < 4 && !known.some(f => !f.down && dist(f, cc) < 6)){
        for (const u of core) if ((mvFree(W, u) || (u.mv && u.mv.k === 'rally')) && !busyW(W, u)){ const f0 = known.filter(f => !f.down).sort((a, b) => dist(a, u) - dist(b, u))[0]; u.mv = { k: 'rally', b: f0 ? f0.i : null, x: W.alarm1.x, y: W.alarm1.y, until: W.t + 0.6 }; }
        if (!W.rallyLog){ W.rallyLog = true; L(W, { k: 'mvr', side: 1, m: 'rally', ids: core.map(u => u.i), n: going, vis: true }); } } } }
  // v6.5 궁수 카이팅 (본능): 근접 상대가 다가오면 (3.8칸) 쏜 다음에 한 걸음씩 물러남 — 동료 쪽으로, 다른 근접 손 닿는 곳은 피함. 쏘지 않고 물러나기만 하지 않음 (코앞 2.4칸이면 예외), 다른 궁수가 움직이는 중이면 그는 쏨
  for (const a of mine){ if (AI6.includes('kite') || !isFar(a) || !mvFree(W, a) || busyW(W, a)) continue;
    const LN = chargeLane(W, a, f => known.includes(f)), x = LN ? LN.c : known.filter(f => !isFar(f) && !f.down && !f.crawl && gap(a, f) < 3 && (f.target === a || (f.order && f.order.b === a.i) || focusOf(W, f) === a)).sort((p, q) => gap(a, p) - gap(a, q))[0]; if (!x) continue;   /* v8.7.4 나를 노린 돌진 — 3칸 밖이어도 */
    if (mine.some(m => m !== a && !isFar(m) && dist(m, x) < dist(a, x) && segD(x, a.x, a.y, m) < m.r + x.r)) continue;   // 사이에 근접 동료가 막아 주면 그 자리에서 쏨
    const close = gap(a, x) < 2.4, shot = (a.lastFireT != null ? a.lastFireT : -9) > (a.kiteT0 != null ? a.kiteT0 : -9);   /* v8.7.4 나를 노린 돌진이면 길의 옆으로 (아군과 같은 규칙) */
    if (!LN && !close && (!shot || mine.some(o => o !== a && isFar(o) && o.alive && ((o.mv && o.mv.k === 'kite' && W.t < o.mv.until) || (o.act && o.act.k === 'leap'))))) continue;
    if (gap(a, x) < Math.max(((EVM(W).kite || {}).contact != null ? EVM(W).kite.contact : 0.7), x.rng + 0.25)) continue;   // 이미 맞붙음 — 등을 보이면 맞음 (그 자리에서 쏨 · 아군과 같은 규칙 · v8.7.4)
    if (LN && !shot && laneShootFirst(W, a, LN)) continue;   // 돌진이 닿기 전에 한 발 쏘고 비킬 시간이 있으면 먼저 쏨 (v8.7.4)
    const mc = mine.filter(m => m !== a && !isFar(m)), base = LN ? Math.atan2(LN.dy, LN.dx) : Math.atan2(a.y - x.y, a.x - x.x); let best = null, bs = -1e9;
    for (const da of LN ? [1.57, -1.57, 1.2, -1.2, 1.9, -1.9, 0.8, -0.8] : [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = a.x + Math.cos(ang) * 2.2, py = a.y + Math.sin(ang) * 2.2;
      if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, a.r)) continue;
      if (LN && !laneOk(LN, a, px, py)) continue;
      if (known.some(f => !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - a.r < f.rng + 1.2)) continue;
      const s = -Math.abs(Math.abs(da) - (LN ? 1.57 : 0)) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (s > bs){ bs = s; best = { x: px, y: py }; } }
    if (!best) continue; a.mv = { k: 'kite', lane: !!LN, x: best.x, y: best.y, b: LN ? LN.c.i : x.i, run: true, until: W.t + 1.0 }; a.kiteT0 = W.t;
    if (LN ? a.laneKey !== LN.c.i + ':' + LN.c.act.t0 : W.t >= (a.kiteLogT || 0)){ if (LN) a.laneKey = LN.c.i + ':' + LN.c.act.t0; else a.kiteLogT = W.t + 5; L(W, { k: 'mvr', side: 1, m: 'kite', a: a.i, b: LN ? LN.c.i : x.i, lane: LN ? true : undefined, obs: !!a.seenBy, vis: true }); } }
  // 본능: 끌고 오기
  for (const u of mine){ if (AI6.includes('nodrag') || !mvFree(W, u) || isFar(u) || u.line || W.t < (u.dragT || 0)) continue;
    const near = known.filter(f => !isFar(f) && !f.down && gap(u, f) < 3); if (!near.length || mine.some(m => m !== u && !isFar(m) && dist(m, u) < 3)) continue;
    const big = near.find(f => f.giant || iDanger(W, 1, f) >= 60) || (near.length >= 2 ? near[0] : null); if (!big || (busyW(W, u) && u.hp / u.max > 0.5 && !big.giant) || big.spd * (big.spdMul || 1) > u.spd * (u.spdMul || 1) * 1.05) continue;   // 못 떼어 놓으면 맞섬
    const g = mine.filter(m => m !== u && !isFar(m) && dist(m, u) > 3 && dist(m, u) < 10).sort((a, b) => dist(a, u) - dist(b, u))[0]; if (!g) continue;
    u.mv = { k: 'drag', x: g.x, y: g.y, b: big.i, run: true, until: W.t + 2.5 }; u.dragT = W.t + 6;
    L(W, { k: 'mvr', side: 1, m: 'drag', a: u.i, b: big.i, c: g.i, why: big.giant ? '거구와 혼자 맞서지 않음' : near.length >= 2 ? '혼자 ' + near.length + '명에게 몰림' : '위험한 놈 (' + iWhyD(W, 1, big) + ')', obs: !!u.seenBy, vis: true }); }
  // v6.5 못 잡을 놈은 쫓지 않음 (본능): 나보다 빠른 사수가 달아나며 쏘면 (돌진 거리 밖) 쫓지 않고 느린 그의 동료를 침 — 그가 돌아와 서서 쏠 때 돌진으로 잡음
  const fl = W.fleeT || (W.fleeT = {});
  for (const G of known) if (isFar(G) && !G.down && Math.hypot(G.vx || 0, G.vy || 0) > 1.5 && mine.some(m => !isFar(m) && dist(m, G) < 7 && ((G.vx || 0) * (G.x - m.x) + (G.vy || 0) * (G.y - m.y)) > 0)) fl[G.i] = W.t;
  for (const u of mine){ if (AI6.includes('nochase') || isFar(u) || !mvFree(W, u) || busyW(W, u) || W.t < (u.chaseT || 0)) continue; const G = u.target;
    if (!G || !G.alive || !isFar(G) || W.t - (fl[G.i] == null ? -9 : fl[G.i]) > 1.5 || gap(u, G) < u.rng + 1 || (u.canCharge && W.t >= u.chargeCd && gap(u, G) <= ((W.rules.charge || {}).max || 5))) continue;
    if ((G.winded ? Math.min(G.spd * (G.spdMul || 1), (W.rules.stamina || {}).jog || 99) : G.spd * (G.spdMul || 1) * (W.rules.run || 1.3)) <= u.spd * (u.spdMul || 1) * (u.winded ? 1 : (W.rules.run || 1.3)) * 1.05) continue;   // 따라잡을 수 있으면 쫓음 (숨이 찬 사수는 잡힘)
    const x = known.filter(f => f !== G && !f.down && !(isFar(f) && W.t - (fl[f.i] == null ? -9 : fl[f.i]) < 1.5)).sort((p, q) => dist(p, u) - dist(q, u))[0]; if (!x) continue;
    u.mv = { k: 'near', b: x.i, until: W.t + 3 }; u.chaseT = W.t + 3;
    if (W.t >= (u.ncLogT || 0)){ u.ncLogT = W.t + 8; L(W, { k: 'mvr', side: 1, m: 'nochase', a: u.i, b: x.i, c: G.i, why: `${G.name} 속력 ${(+G.spd).toFixed(1)} > 나 ${(+u.spd).toFixed(1)}`, obs: !!u.seenBy, vis: true }); } }
  // v6.4.2 본능: 노출 병력 회수 — 혼자 떨어져 사격받는 근접은 가까운 본대 (둘 넘게 모인 동료) 로 물러남. 근접 상대가 곁이면 등을 보이지 않음 (끌고 오기 · 교대가 맡음)
  for (const u of mine){ if (AI6.includes('recall') || isFar(u) || u.line || !mvFree(W, u) || W.t < (u.recT || 0) || busyW(W, u)) continue;
    if (mine.filter(m => m !== u && dist(m, u) < 4).length > 1) continue;   // 혼자 · 둘이 떨어진 조 (순찰조) 일 때
    const shot = W.t - (u.farHitT == null ? -9 : u.farHitT) < 2.5; if (!shot && !gunDanger(W, u, u.x, u.y)) continue;
    if (known.some(f => !isFar(f) && !f.down && gap(u, f) < f.rng + 1.8)) continue;
    const grp = mine.filter(m => m !== u && dist(m, u) > 5 && dist(m, u) < 16 && mine.filter(o => o !== m && o !== u && dist(o, m) < 3).length >= 2).sort((a, b) => dist(a, u) - dist(b, u))[0]; if (!grp) continue;   // 셋 넘게 모인 본대
    const g = (u.farBy != null && W.units[u.farBy] && W.units[u.farBy].alive) ? W.units[u.farBy] : known.find(f => isFar(f) && f.loud);
    u.mv = { k: 'recall', x: grp.x, y: grp.y, b: g ? g.i : null, run: true, until: W.t + 3 }; u.recT = W.t + 5;
    L(W, { k: 'mvr', side: 1, m: 'recall', a: u.i, b: g ? g.i : null, c: grp.i, why: shot ? '혼자 사격받음' : '혼자 총구 앞', obs: !!u.seenBy, vis: true }); }
  // v6.4.2 합류: 동료가 맞붙거나 사격받으면 (3 ~ 12칸) 본대가 서둘러 그쪽으로 — 흩어져 하나씩 소모되지 않게 (유인 · 매복 · 후퇴 · 포위 중엔 안 함)
  { const pk = W.plan && W.plan.k, rl = W.rushLog || (W.rushLog = {});
    if (!AI6.includes('rush') && pk !== 'bait' && pk !== 'ambush' && pk !== 'withdraw' && pk !== 'encircle'){
      const hot = mine.filter(m => busyW(W, m) || W.t - (m.farHitT == null ? -9 : m.farHitT) < 2);
      for (const u of mine){ if (u.line || !mvFree(W, u) || busyW(W, u) || W.t < (u.rushT || 0) || hot.includes(u)) continue;
        const m = hot.filter(h => dist(h, u) > 3 && dist(h, u) < 12 && !(h.mv && h.mv.k === 'recall' && W.t < h.mv.until)).sort((a, b) => dist(a, u) - dist(b, u))[0]; if (!m) continue;
        if (isFar(u) && dist(m, u) < u.rng) continue;   // 사수는 이미 닿으면 그 자리에서 쏨
        u.mv = { k: 'rush', b: m.i, run: true, until: W.t + 1.2 }; u.rushT = W.t + 1.2;
        if (W.t >= (rl[m.i] || 0)){ rl[m.i] = W.t + 6; L(W, { k: 'mvr', side: 1, m: 'rush', a: u.i, b: m.i, why: busyW(W, m) ? '맞붙음' : '사격받음', obs: !!u.seenBy, vis: true }); } } } }
  // v6.4.2 본능: 보조 맞춤 — 접근 중 혼자 앞선 근접은 뒤따르는 본대 (둘 넘게) 를 기다림. 앞에서 동료가 싸우면 도우러 가고, 사격받으면 회수가 맡음, 4초 넘게 기다렸으면 6초는 그냥 감
  { const pk = W.plan && W.plan.k;
    if (!AI6.includes('pace') && pk !== 'bait' && pk !== 'ambush' && pk !== 'withdraw' && pk !== 'encircle') for (const u of mine){
      if (isFar(u) || u.line || !mvFree(W, u) || busyW(W, u) || W.t < (u.paceBan || 0)){ continue; }
      const f0 = known.filter(f => !f.down).sort((a, b) => dist(a, u) - dist(b, u))[0], d0 = f0 ? dist(u, f0) : 99;
      const behind = f0 ? mine.filter(m => m !== u && !isFar(m) && !busyW(W, m) && dist(m, f0) > d0 + 2.5 && dist(m, f0) < d0 + 10) : [];
      const want = f0 && d0 <= 12 && gap(u, f0) >= f0.rng + 3 && !mine.some(m => busyW(W, m) && dist(m, u) < 9) && !(W.t - (u.farHitT == null ? -9 : u.farHitT) < 2.5) && !gunDanger(W, u, u.x, u.y)
        && behind.length >= 2 && mine.filter(m => m !== u && !isFar(m) && dist(m, u) < 3 && Math.abs(dist(m, f0) - d0) < 2).length < behind.length;
      if (!want){ u.paceT0 = 0; continue; }
      if (!u.paceT0) u.paceT0 = W.t; if (W.t - u.paceT0 > 4){ u.paceBan = W.t + 6; u.paceT0 = 0; continue; }
      u.mv = { k: 'pace', b: f0.i, until: W.t + 0.6 };
      if (W.t >= (u.paceLogT || 0)){ u.paceLogT = W.t + 8; L(W, { k: 'mvr', side: 1, m: 'pace', a: u.i, b: f0.i, n: behind.length, obs: !!u.seenBy, vis: true }); } } }
  // v6.4.1 본능: 가까운 위협 먼저 — 나를 노려 붙은 놈이 있는데 먼 표적을 쫓으면 등을 보임
  for (const u of mine){ if (AI6.includes('nearf') || isFar(u) || !mvFree(W, u) || W.t < (u.nearT || 0) || !u.target || !u.target.alive || gap(u, u.target) < u.rng + 0.4) continue;
    const x = known.find(f => f !== u.target && !f.down && !isFar(f) && gap(u, f) < Math.max(f.rng, u.rng) + 0.3 && (f.target === u || focusOf(W, f) === u || (f.act && f.act.b === u.i))); if (!x) continue;
    u.mv = { k: 'near', b: x.i, until: W.t + 2.5 }; u.nearT = W.t + 4;
    L(W, { k: 'mvr', side: 1, m: 'near', a: u.i, b: x.i, c: u.target.i, obs: !!u.seenBy, vis: true }); }
  const C = mine.filter(u => u.cmd && !u.down && W.t >= u.proneT).sort((a, b) => b.cmd - a.cmd)[0];
  if (!AI6.includes('hunt')) huntStep(W, mine, known, C, C ? 1 + C.cmd - mine.filter(u => mvOn(W, u) && MV_ORG.includes(u.mv.k)).length : 0);   // v6.5 사수 몰이 (지휘관이 없으면 이어 가던 것만 마무리)
  if (!C) return;
  const cap = 1 + C.cmd; let used = mine.filter(u => mvOn(W, u) && MV_ORG.includes(u.mv.k)).length;
  // 교대
  const swapWhy = h => h.hp / h.max < 0.35 ? '체력 ' + Math.max(1, Math.ceil(h.hp)) + '/' + h.max : AI6.includes('early') || h.hp / h.max >= 0.65 ? null : h.exhausted ? '탈진 🥵' : (h.fat || 0) >= 80 ? '지침 😓' : h.bleed ? '피를 흘림' : (h.arms && (h.arms.L || h.arms.R)) ? '팔을 다침' : h.eyeLost ? '눈을 잃음' : h.legLoss ? '다리를 다침' : W.t < h.brokenT ? '자세가 무너짐' : (h.post != null && h.post < 25) ? '자세가 바닥' : null;   // v6.5 바닥까지 기다리지 않음
  for (const h of mine){ if (used >= cap) return; if (AI6.includes('noswap') || !mvFree(W, h) || isFar(h) || !swapWhy(h) || !busyW(W, h)) continue;
    const f = known.filter(x => !x.down && gap(h, x) < reach(h, x)).sort((a, b) => gap(h, a) - gap(h, b))[0]; if (!f) continue;
    const m = mine.filter(x => x !== h && mvFree(W, x) && !isFar(x) && x.hp / x.max > 0.6 && !busyW(W, x) && dist(x, h) < 4.5).sort((a, b) => dist(a, h) - dist(b, h))[0]; if (!m) continue;
    const d = dist(m, f) || 1, bx = Math.max(0.7, Math.min(W.map.W - 0.7, m.x + (m.x - f.x) / d * 1.3)), by = Math.max(0.7, Math.min(W.map.H - 0.7, m.y + (m.y - f.y) / d * 1.3));
    h.mv = { k: 'swap', x: bx, y: by, b: f.i, run: true, until: W.t + 2.5 }; m.mv = { k: 'cover', b: f.i, run: true, until: W.t + 2.2 }; m.target = f; m.state = 'hunt'; used += 2;
    L(W, { k: 'mvr', side: 1, m: 'swap', a: h.i, b: m.i, c: f.i, hp: Math.round(h.hp / h.max * 100), why: swapWhy(h), obs: !!(h.seenBy || m.seenBy), vis: true }); }
  // v6.5 몸으로 막는 호위: 사수가 동료를 겨누거나 막 쏘았으면 (2초) 곁의 방패 동료가 그 사선 위에 서서 사수를 마주 보고 방패를 듦 — 사수가 움직이면 자리를 고침
  for (const P2 of mine){ if (used >= cap) return; if (AI6.includes('bguard') || P2.shield || P2.armShield || !P2.alive) continue;
    const G = known.find(g => isFar(g) && !g.down && ((g.act && g.act.k === 'atk' && g.act.b === P2.i) || (P2.farBy === g.i && W.t - (P2.farHitT == null ? -9 : P2.farHitT) < 2))); if (!G) continue;
    if (mine.some(s => s.mv && s.mv.k === 'bguard' && s.mv.c === P2.i && W.t < s.mv.until)) continue;
    const s = mine.filter(x => x !== P2 && mvFree(W, x) && (x.shield || x.armShield) && !busyW(W, x) && x.hp / x.max > 0.35 && dist(x, P2) < 4.5).sort((p, q) => escortH(W, q) - escortH(W, p) || dist(p, P2) - dist(q, P2))[0]; if (!s) continue;
    s.mv = { k: 'bguard', b: G.i, c: P2.i, run: true, until: W.t + 3 }; used++;
    L(W, { k: 'mvr', side: 1, m: 'bguard', a: s.i, b: G.i, c: P2.i, obs: !!(s.seenBy || P2.seenBy), vis: true }); }
  // v6.5 사수 몰이: 사수가 빠지며 쏘아 근접이 3초 넘게 못 붙으면 — 끊을 조 둘이 사수의 퇴로 쪽 (우리 본대 반대편 ±45°) 으로 돌아가고, 자리 잡으면 (또는 5초) 쫓던 놈들과 함께 조여 들어감. 그동안 표적은 그 사수 (궁수도 그쪽)
  // v6.4.1 거구와 궁수 사이를 막음: 성한 근접 동료 (방패 먼저) 가 거구 앞 · 궁수 쪽으로 들어가 붙듦
  for (const a of mine){ if (used >= cap) return; if (AI6.includes('intp') || !isFar(a)) continue;
    const G = known.find(g => (g.canSweep || g.giant) && !g.down && !g.crawl && gap(a, g) < g.rng + 3.5 && ((g.act && g.act.k === 'charge' && g.act.b === a.i) || (Math.hypot(g.vx || 0, g.vy || 0) > 0.3 && (g.vx || 0) * (a.x - g.x) + (g.vy || 0) * (a.y - g.y) > 0)) && !mine.some(m => m.mv && m.mv.k === 'interpose' && m.mv.b === g.i && W.t < m.mv.until)); if (!G) continue;   // 거구가 궁수 쪽으로 올 때
    if (mine.some(m => m !== a && !isFar(m) && dist(m, G) < dist(a, G) && segD(G, a.x, a.y, m) < m.r + G.r * 0.6)) continue;   // 이미 누가 사이에 섬
    const m = mine.filter(x => x !== a && mvFree(W, x) && !isFar(x) && !x.giant && (x.shield || x.armShield) && !busyW(W, x) && x.hp / x.max > 0.4 && dist(x, a) < 5.5).sort((p, q) => escortH(W, q) - escortH(W, p) || dist(p, a) - dist(q, a))[0]; if (!m) continue;   // 방패 든 동료만
    m.mv = { k: 'interpose', b: G.i, c: a.i, run: true, until: W.t + 2.5 }; used++;
    L(W, { k: 'mvr', side: 1, m: 'interpose', a: m.i, b: G.i, c: a.i, obs: !!(m.seenBy || G.side === 0), vis: true }); }
  // v6.4.1 호위: 뒷줄 (사수 · 구급) 을 노리는 근접이 다쳤거나 길목에 칠 놈이 있으면 방패 동료를 앞세워 함께 접근 — 방패가 없으면 가까운 놈부터
  for (const u of mine){ if (used >= cap) return; const t = u.target; if (AI6.includes('esc') || !t || !t.alive || t.down || isFar(u) || u.line || !mvFree(W, u) || gap(u, t) < 2.5) continue;
    if (!(isFar(t) || iRec(W, 1, t).tags.includes('구급'))) continue; const gt = gauntlet(W, u, t); if (!(u.hp / u.max < 0.6 || gt >= 1)) continue;
    const s = mine.filter(x => x !== u && mvFree(W, x) && (x.shield || x.armShield || (x.bodyShield && !x.giant)) && !busyW(W, x) && x.hp / x.max > 0.5 && dist(x, u) < 5).sort((p, q) => dist(p, u) - dist(q, u))[0];
    if (s){ s.mv = { k: 'lead', b: t.i, c: u.i, until: W.t + 4 }; u.mv = { k: 'follow', b: t.i, c: s.i, until: W.t + 4 }; used += 2;
      L(W, { k: 'mvr', side: 1, m: 'escort', a: s.i, b: t.i, c: u.i, why: u.hp / u.max < 0.6 ? '다친 몸 (' + Math.round(u.hp / u.max * 100) + '%)' : '길목에 ' + gt + '명', obs: !!(s.seenBy || u.seenBy), vis: true }); continue; }
    if (u.hp / u.max < 0.5 || gt >= 2){ const x = known.filter(f => f !== t && !f.down && !isFar(f) && dist(f, u) < 3.5).sort((p, q) => dist(p, u) - dist(q, u))[0];
      if (x && W.t >= (u.nearT || 0)){ u.mv = { k: 'near', b: x.i, until: W.t + 2.5 }; u.nearT = W.t + 4; L(W, { k: 'mvr', side: 1, m: 'near', a: u.i, b: x.i, c: t.i, why: '앞세울 방패가 없음', obs: !!u.seenBy, vis: true }); } } }
  // 포위 사냥
  const sT = W.surT || (W.surT = {});
  for (const f of known){ if (used >= cap) return; if (AI6.includes('nosur') || f.down || W.t < (sT[f.i] || 0)) continue;
    const A = mine.filter(u => !isFar(u) && !u.giant && u.target === f && dist(u, f) < 4.5); if (A.length < 2) continue;
    const ao = u => Math.atan2(u.y - f.y, u.x - f.x), front = A.slice().sort((a, b) => angDiff(ao(a), f.face) - angDiff(ao(b), f.face))[0];
    const free = [1.9, -1.9, Math.PI].map(o => f.face + o), ids = [];
    for (const u of A){ if (u === front || !mvFree(W, u) || u.line || used >= cap || !free.length) continue;
      const k = free.reduce((bk, s, j) => angDiff(ao(u), s) < angDiff(ao(u), free[bk]) ? j : bk, 0), s = free.splice(k, 1)[0];
      if (angDiff(ao(u), s) < 0.7) continue;   // 이미 그쪽
      u.mv = { k: 'surround', b: f.i, ang: s, back: angDiff(s, f.face) > 2.6, run: true, until: W.t + 2.8 }; used++; ids.push(u.i); }
    if (ids.length){ sT[f.i] = W.t + 3; L(W, { k: 'mvr', side: 1, m: 'surround', a: front.i, b: f.i, ids, obs: ids.some(i => W.units[i].seenBy), vis: true }); } }
  // 양동
  if (!AI6.includes('nofeint') && used < cap && W.t >= (W.feintT || 0) && mine.filter(u => busyW(W, u)).length >= 2){
    const tg = known.filter(t => !t.down && iKnow(W, 1, t) && !busyW(W, t) && ['총', '구급', '활'].some(x => iRec(W, 1, t).tags.includes(x))).sort((a, b) => iCenter(W, 1, b) + iDanger(W, 1, b) - iCenter(W, 1, a) - iDanger(W, 1, a))[0];
    if (tg){ const fc = centroid(mine.filter(u => busyW(W, u)));
      const r = mine.filter(u => mvFree(W, u) && !isFar(u) && !u.giant && !u.line && !busyW(W, u) && u.hp / u.max > 0.6 && u.spd >= 1.9 && dist(u, tg) < 14).sort((a, b) => dist(a, tg) - dist(b, tg))[0];
      if (r){ const a0 = Math.atan2(tg.y - fc.y, tg.x - fc.x), ar = Math.atan2(r.y - tg.y, r.x - tg.x), sg = Math.sin(ar - a0) >= 0 ? 1 : -1, wa = a0 + sg * 1.3;
        const wx = Math.max(0.8, Math.min(W.map.W - 0.8, tg.x + Math.cos(wa) * 3)), wy = Math.max(0.8, Math.min(W.map.H - 0.8, tg.y + Math.sin(wa) * 3));
        r.mv = { k: 'feint', b: tg.i, wx, wy, leg: boxRock(W, wx, wy, r.r) ? 1 : 0, run: true, until: W.t + 5, t0: W.t }; used++; W.feintT = W.t + 8;
        L(W, { k: 'mvr', side: 1, m: 'feint', a: r.i, b: tg.i, why: iRec(W, 1, tg).tags.filter(x => ['총', '구급', '활', '지휘'].includes(x)).join(' · '), obs: !!r.seenBy, vis: true }); } } }
}
function mvStep(W, u, dt){
  if (u.side !== 1 || AI6.includes('mv')) return false;
  // 본능: 총구 피하기
  if (!AI6.includes('nojink') && !mvOn(W, u) && W.t >= (u.jinkT || 0) && !u.line && !u.lurk && !u.crawl && !busyW(W, u)){
    const g = W.units.find(x => x.alive && x.side !== u.side && isFar(x) && x.act && x.act.k === 'atk' && x.act.phase === 'wind' && x.act.b === u.i && canSee(W, u, x));
    if (g){ const a = Math.atan2(u.y - g.y, u.x - g.x), sc = p => W.units.filter(m => m.alive && m !== u && m.side === u.side && (m.shield || m.bodyShield || m.giant) && segD(g, p.x, p.y, m) < m.r + 0.2).length;
      const fw = u.target && u.target.alive ? Math.atan2(u.target.y - u.y, u.target.x - u.x) : a + Math.PI, fx = Math.cos(fw) * 0.8, fy = Math.sin(fw) * 0.8;   // 하던 쪽으로 파고들며 사선만 비킴
      const p = [a + Math.PI / 2, a - Math.PI / 2].map(b => ({ x: u.x + Math.cos(b) * 1.1 + fx, y: u.y + Math.sin(b) * 1.1 + fy })).filter(p => p.x > 0.6 && p.y > 0.6 && p.x < W.map.W - 0.6 && p.y < W.map.H - 0.6 && !boxRock(W, p.x, p.y, u.r)).sort((p, q) => sc(q) - sc(p))[0];
      if (p){ u.mv = { k: 'jink', x: p.x, y: p.y, b: g.i, run: true, until: W.t + 0.7 }; u.jinkT = W.t + 2.5; L(W, { k: 'mvr', side: 1, m: 'jink', a: u.i, b: g.i, cover: sc(p) > 0, obs: !!u.seenBy, vis: true }); } } }
  if (!mvOn(W, u)){ if (u.mv && u.mv.k === 'feint') L(W, { k: 'mvr', side: 1, m: 'feintRes', r: 'time', a: u.i, b: u.mv.b, vis: true }); u.mv = null; return false; }
  const M = u.mv, T = M.b != null ? W.units[M.b] : null;
  if (M.k === 'kite'){ const LN = chargeLane(W, u, f => canSee(W, u, f)); if ((LN && !laneOk(LN, u, M.x, M.y)) || kiteEng(W, u)){ u.mv = null; return false; } }   /* v8.7.4 가던 자리가 돌진 길 안 (또는 건너편) — 다시 고름 · 맞붙음이면 멈춤 */
  if (M.k === 'surround'){
    if (!T || !T.alive || T.down){ u.mv = null; return false; }
    const R = T.r + u.r + Math.max(0.3, u.rng * 0.8), au = Math.atan2(u.y - T.y, u.x - T.x), d = angDiff(au, M.ang);
    if (d < 0.45 && gap(u, T) < u.rng + 0.6){ u.mv = null; return false; }   // 자리 잡음 → 침
    const na = au + (Math.sin(M.ang - au) >= 0 ? 1 : -1) * Math.min(d, 0.9), rr = Math.max(R, Math.min(dist(u, T), R + 1.2));
    setMood(W, u, M.back ? '포위 — 뒤로 돎' : '포위 — 옆으로 돎', T.i); goTo(W, u, T.x + Math.cos(na) * rr, T.y + Math.sin(na) * rr, dt); return true; }
  if (M.k === 'rally'){ stop(u); if (T && T.alive) u.fg = Math.atan2(T.y - u.y, T.x - u.x); else u.fg = Math.atan2(M.y - u.y, M.x - u.x); setMood(W, u, '집결 — 순찰조를 기다림'); return true; }   // v6.5
  if (M.k === 'rejoin'){ if (Math.hypot(M.x - u.x, M.y - u.y) < 2.5){ u.mv = null; u.rejoined = true; return false; } setMood(W, u, '합류 — 본대로'); goTo(W, u, M.x, M.y, dt); return true; }
  if (M.k === 'bguard'){ const P2 = W.units[M.c]; if (!T || !T.alive || T.down || !P2 || !P2.alive){ u.mv = null; return false; }
    const d = dist(P2, T) || 1, k = P2.r + u.r + 0.12, x = P2.x + (T.x - P2.x) / d * k, y = P2.y + (T.y - P2.y) / d * k;   // 사수 — 보호 대상 사선 위, 보호 대상 바로 앞
    setMood(W, u, '몸으로 막음 — ' + P2.name + ' 앞', T.i);
    if (Math.hypot(x - u.x, y - u.y) < 0.3){ stop(u); } else goTo(W, u, x, y, dt);
    u.fg = Math.atan2(T.y - u.y, T.x - u.x); u.wantT = W.t; if (!u.raised && u.guardMode !== 'off'){ u.raised = true; u.raiseAt = W.t + ((W.rules.guard || {}).raise != null ? W.rules.guard.raise : 0.25) * (u.vet ? VETR(W).raise : 1); }   // 사수를 마주 보고 방패를 듦
    return true; }
  if (M.k === 'cut'){ if (!T || !T.alive || T.down){ u.mv = null; return false; } const x = Math.max(0.8, Math.min(W.map.W - 0.8, T.x + M.ox)), y = Math.max(0.8, Math.min(W.map.H - 0.8, T.y + M.oy));
    if (gap(u, T) < u.rng + 0.3){ u.mv = null; u.target = T; u.state = 'hunt'; return false; } setMood(W, u, '퇴로를 끊음 — ' + T.name + ' 뒤로', T.i); goTo(W, u, x, y, dt); return true; }
  if (M.k === 'close'){ if (!T || !T.alive || T.down){ u.mv = null; return false; } u.target = T; u.state = 'hunt'; return false; }   // 조여 들어감 — 싸움은 그대로 (따라잡을 자리로)
  if (M.k === 'pace'){ if (!T || !T.alive || T.down){ u.mv = null; return false; } stop(u); u.fg = Math.atan2(T.y - u.y, T.x - u.x); setMood(W, u, '보조 맞춤 — 본대를 기다림', T.i); return true; }   // v6.4.2
  if (M.k === 'recall' && Math.hypot(M.x - u.x, M.y - u.y) < 1.6){ u.mv = null; return false; }
  if (M.k === 'rush'){ if (!T || !T.alive || dist(u, T) < 2.5){ u.mv = null; return false; } setMood(W, u, '합류 — ' + T.name + ' 쪽으로', T.i); goTo(W, u, T.x, T.y, dt); return true; }   // v6.4.2
  if (M.k === 'near'){ if (!T || !T.alive || T.down){ u.mv = null; return false; } u.target = T; u.state = 'hunt'; return false; }   // 표적만 바꾸고 싸움은 그대로
  if (M.k === 'interpose'){ const A = W.units[M.c]; if (!T || !T.alive || T.down || !A || !A.alive){ u.mv = null; return false; }
    if (gap(u, T) < u.rng + 0.3){ u.mv = null; u.target = T; u.state = 'hunt'; return false; }   // 맞닿음 → 붙들고 싸움
    const d = dist(A, T) || 1, k = Math.min(1.6, Math.max(0.9, d / 2)), x = A.x + (T.x - A.x) / d * k, y = A.y + (T.y - A.y) / d * k;
    setMood(W, u, '사이를 막음 — ' + A.name + ' 앞', T.i); if (Math.hypot(x - u.x, y - u.y) < 0.3){ stop(u); u.fg = Math.atan2(T.y - u.y, T.x - u.x); } else goTo(W, u, x, y, dt); return true; }
  if (M.k === 'lead'){ const P2 = W.units[M.c]; if (!T || !T.alive || T.down || !P2 || !P2.alive || W.units.some(f => f.alive && f.side !== u.side && gap(u, f) < Math.max(isFar(f) ? 0.3 : f.rng, u.rng) + 0.4)){ u.mv = null; return false; }
    const G = (AI6.includes('bguard') ? null : W.units.filter(g => g.alive && g.side !== u.side && isFar(g) && !g.down && (g.seenBy || canSee(W, u, g) || canSee(W, P2, g))).sort((a, b) => (b.loud ? 1 : 0) - (a.loud ? 1 : 0) || dist(a, P2) - dist(b, P2))[0]) || T;   // v6.5 가장 위험한 사수 — 보호 대상 사선 위에 섬 (사수가 움직이면 따라 고침)
    const d = dist(P2, G) || 1, k = P2.r + u.r + 0.12, x = P2.x + (G.x - P2.x) / d * k, y = P2.y + (G.y - P2.y) / d * k;
    setMood(W, u, '호위 — ' + P2.name + ' 앞, ' + G.name + ' 쪽을 막음', T.i); goTo(W, u, x, y, dt); u.fg = Math.atan2(G.y - u.y, G.x - u.x); u.wantT = W.t; return true; }
  if (M.k === 'follow'){ const S2 = W.units[M.c]; if (!T || !T.alive || T.down || !S2.alive || !mvOn(W, S2) || gap(u, T) < u.rng + 0.5){ u.mv = null; return false; }
    setMood(W, u, '호위 — ' + S2.name + ' 뒤', T.i); const lp = leadPt(W, u, T); setGoal(W, u, lp.x, lp.y); follow(W, u, dt, 0.8); return true; }   // v6.5 보호받는 쪽이 표적으로 가고 방패가 그 앞 사선을 막음 (방패가 따라오게 조금 느리게)
  if (M.k === 'cover'){ if (!T || !T.alive || T.down || gap(u, T) < u.rng + 0.3){ u.mv = null; return false; } u.target = T; setMood(W, u, '교대 — 뛰어듦', T.i); goTo(W, u, T.x, T.y, dt); return true; }
  if (M.k === 'feint'){
    if (!T || !T.alive || T.down){ u.mv = null; return false; }
    const ic = W.units.find(x => { if (!x.alive || x === T || x.side === u.side || isFar(x) || dist(x, u) > 3.2) return false; const sp = Math.hypot(x.vx || 0, x.vy || 0), d = dist(x, u) || 1;
      return x.target === u || (x.order && x.order.b === u.i) || (sp > 0.5 && W.t - (M.t0 || 0) > 0.5 && ((x.vx || 0) * (u.x - x.x) + (x.vy || 0) * (u.y - x.y)) / (sp * d) > 0.85); });   // 막으러 나온 놈: 나를 노림 (명령 · 표적) · 나를 향해 똑바로 달려옴
    if (ic){ const g = W.units.filter(m => m.alive && m !== u && m.side === u.side && !isFar(m) && dist(m, u) > 2.5).sort((a, b) => dist(a, u) - dist(b, u))[0];
      L(W, { k: 'mvr', side: 1, m: 'feintRes', r: 'pulled', a: u.i, b: T.i, c: ic.i, obs: !!(u.seenBy || ic.seenBy), vis: true });
      u.mv = g ? { k: 'drag', x: g.x, y: g.y, b: ic.i, run: true, until: W.t + 2.5 } : null; u.dragT = W.t + 6; return !!g; }
    if (gap(u, T) < u.rng + 0.4){ L(W, { k: 'mvr', side: 1, m: 'feintRes', r: 'strike', a: u.i, b: T.i, obs: !!(u.seenBy || T.side === 0), vis: true }); u.mv = null; u.target = T; u.state = 'hunt'; return false; }
    if (M.leg === 0 && Math.hypot(M.wx - u.x, M.wy - u.y) < 1) M.leg = 1;
    setMood(W, u, '양동 — ' + T.name + ' 쪽으로 크게 돎', T.i); if (M.leg === 0) goTo(W, u, M.wx, M.wy, dt); else goTo(W, u, T.x, T.y, dt); return true; }
  if (Math.hypot(M.x - u.x, M.y - u.y) < 0.35){ u.mv = null; return false; }   // swap · drag · jink: 그 자리까지
  setMood(W, u, M.k === 'swap' ? '교대 — 물러남' : M.k === 'drag' ? '끌고 감' : M.k === 'scatter' ? '흩어짐 — 거구를 피해' : M.k === 'recall' ? '회수 — 본대로' : M.k === 'kite' ? '거리 벌림 — 쏘고 물러남' : M.k === 'shift' ? '자리 옮김 — 닿는 곳 밖으로' : M.k === 'screen' ? (M.c != null ? '지휘관 호위' : '사수 호위') + ' — 앞을 막음' : '총구를 피함', T ? T.i : null);   // v6.9 영향 지도 · 호위
  if (M.k === 'scatter' || M.k === 'recall' || M.k === 'kite' || M.k === 'shift' || M.k === 'screen'){ goTo(W, u, M.x, M.y, dt); if (M.k === 'screen' && T && T.alive) u.fg = Math.atan2(T.y - u.y, T.x - u.x); return true; }
  const back = M.k !== 'jink' && T && T.alive; setGoal(W, u, M.x, M.y); follow(W, u, dt, back ? 0.8 : 1); if (T && T.alive) u.fg = Math.atan2(T.y - u.y, T.x - u.x);   // 마주 본 채 (물러날 땐 뒷걸음 ×0.8)
  return true;
}
function wedgeStep(W, u, dt){
  const V = W.wedge; if (!V || u.crawl) return false;
  if (V.cancel && opGot(W, V, 'wedge', u)) return false;   // v6.9 중단 명령을 받음 → 각자
  const tip = W.units[V.tip], si = V.sh.indexOf(u.i), bi = V.body.indexOf(u.i), isTip = u.i === V.tip; if (!tip.alive || (!isTip && si < 0 && bi < 0)) return false;
  if (V.phase === 'breach' || V.phase === 'contact'){ if (isTip || si >= 0) return false; const F = W.focus && W.units[W.focus.b]; if (F && F.alive && !F.down){ u.target = F; u.state = 'hunt'; } return false; }   // 끝 · 어깨는 맞붙어 틈을 벌리고, 몸통은 뒤의 표적으로
  if (pinnedBy(W, u)) return false;
  const dx = V.aim.x - tip.x, dy = V.aim.y - tip.y, dl = Math.hypot(dx, dy) || 1, ax = dx / dl, ay = dy / dl, px = -ay, py = ax;
  const slot = j => { const s2 = V.sh.indexOf(j), b2 = V.body.indexOf(j); const back = s2 >= 0 ? 0.95 : 1.9 + Math.floor(b2 / 2) * 0.9, lat = s2 >= 0 ? (s2 ? -0.9 : 0.9) : (b2 % 2 ? -0.6 : 0.6); return { x: tip.x - ax * back + px * lat, y: tip.y - ay * back + py * lat }; };
  if (isTip){
    const lag = !V.go && [...V.sh, ...V.body].some(j => { const o = W.units[j]; if (!o.alive || o.crawl || busyW(W, o)) return false; const p = slot(j); return Math.hypot(p.x - o.x, p.y - o.y) > 1.3; });
    setMood(W, u, lag ? '쐐기 끝 — 모이길 기다림' : '쐐기 끝 — 돌파');
    if (lag){ stop(u); u.fg = Math.atan2(ay, ax); } else { setGoal(W, u, V.aim.x, V.aim.y); follow(W, u, dt, 0.85); }
    return true;
  }
  const p = slot(u.i); if (rock(W.map, p.x, p.y)) return false;
  setMood(W, u, si >= 0 ? '쐐기 어깨' : '쐐기 몸통', tip.i);
  if (Math.hypot(p.x - u.x, p.y - u.y) > 0.2) goTo(W, u, p.x, p.y, dt); else { stop(u); u.fg = Math.atan2(ay, ax); }
  return true;
}
function planEncircle(W, mine, known){
  const V = W.env;
  if (V){ if (W.t - V.t0 > 16 || (!V.cancel && !V.ids.some(i => W.units[i].alive && (V.stage[i] || 0) < 2))){ L(W, { k: 'env', side: 1, s: 'end', why: W.t - V.t0 > 16 ? '오래 걸림' : '뒤로 다 돌아 들어감', vis: true }); W.env = null; } return; }
  const P = W.plan; if (!P || P.k !== 'encircle' || P.envDone || !known.length) return;
  const melee = mine.filter(u => !isFar(u) && !u.crawl && !u.giant && !(u.shield && u.role === '전선'));
  if (melee.length < 2) return;
  const ac = centroid(known), ec = centroid(mine); let ax = ac.x - ec.x, ay = ac.y - ec.y; const al = Math.hypot(ax, ay) || 1; ax /= al; ay /= al; const px = -ay, py = ax, m = W.map;
  const cl = (x, y) => ({ x: Math.max(0.7, Math.min(m.W - 0.7, x)), y: Math.max(0.7, Math.min(m.H - 0.7, y)) });
  const sorted = melee.slice().sort((a, b) => ((a.x - ec.x) * px + (a.y - ec.y) * py) - ((b.x - ec.x) * px + (b.y - ec.y) * py));
  const V2 = { ids: melee.map(u => u.i), wp: {}, side: {}, stage: {}, arch: {}, t0: W.t };
  sorted.forEach((u, k) => { const s = k < sorted.length / 2 ? -1 : 1; V2.side[u.i] = s; const w1 = cl(ac.x + px * s * 4.6 - ax * 0.6, ac.y + py * s * 4.6 - ay * 0.6), w2 = cl(ac.x + px * s * 1.6 + ax * 2.6, ac.y + py * s * 1.6 + ay * 2.6); V2.wp[u.i] = [w1, w2]; });
  mine.filter(isFar).forEach((u, k) => { const s = k % 2 ? 1 : -1, a = Math.atan2(-ay, -ax) + s * 0.9; V2.arch[u.i] = cl(ac.x + Math.cos(a) * Math.min(5, u.rng - 0.8), ac.y + Math.sin(a) * Math.min(5, u.rng - 0.8)); });
  W.env = V2; P.envDone = true;
  L(W, { k: 'env', side: 1, s: 'form', left: sorted.filter(u => V2.side[u.i] < 0).map(u => u.i), right: sorted.filter(u => V2.side[u.i] > 0).map(u => u.i), arch: Object.keys(V2.arch).map(Number), hold: mine.filter(u => !isFar(u) && !V2.wp[u.i]).map(u => u.i), obs: melee.some(u => u.seenBy), vis: true });
}
function encircleStep(W, u, dt){
  const V = W.env; if (!V || u.crawl) return false;
  if (V.cancel && opGot(W, V, 'env', u)) return false;   // v6.9 중단 명령을 받음 → 각자
  if (V.arch[u.i]){ const p = V.arch[u.i]; if (Math.hypot(p.x - u.x, p.y - u.y) > 0.5 && !W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < f.rng + 1.2)){ setMood(W, u, '십자 사격 자리로'); goTo(W, u, p.x, p.y, dt); return true; } return false; }
  const wp = V.wp[u.i]; if (!wp || pinnedBy(W, u)) return false;
  let st = V.stage[u.i] || 0;
  if (st < 2 && Math.hypot(wp[st].x - u.x, wp[st].y - u.y) < 0.8){ V.stage[u.i] = ++st; if (st === 2) L(W, { k: 'env', side: 1, s: 'rear', a: u.i, stale: !!V.cancel, obs: !!u.seenBy, vis: true }); }
  if (st >= 2){ const F = W.focus && W.units[W.focus.b]; if (F && F.alive && !F.down){ u.target = F; u.state = 'hunt'; } return false; }
  if (W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < f.rng + 0.4)) return false;   // 손이 닿는 상대가 앞을 막으면 싸움
  setMood(W, u, st ? '포위 — 뒤로 돌아 들어감' : '포위 — 옆으로 벌림'); goTo(W, u, wp[st].x, wp[st].y, dt); return true;
}
// 매복: 시작 자리 (양옆 멀리 · 어둠) 에서 가만히 숨어 기다림 — 상대가 4.5칸 안에 들거나, 누가 맞거나 (들킴), 10초가 지나면 다 같이 터짐
function lurkStep(W, u, dt){
  if (!u.lurk) return false;
  const near = W.units.find(a => a.alive && a.side !== u.side && dist(a, u) < 4.5), mate = !near && W.units.find(m => m.alive && m.side === u.side && dist(m, u) < 9 && busyW(W, m));   // 매복조 중 누가 붙들려 싸워도   // v6.3.4 곁에서 동료가 싸우면 기다리지 않음
  const seen = u.lurkSeen != null, sb = u.lurkSeen;   // v7.8.3 들킨 걸 느낌
  if (W.t - (u.lurkT0 || 0) > 10 || u.taken > 0 || near || mate || seen){ const lk = W.units.filter(e => e.side === u.side && e.lurk); for (const e of lk){ e.lurk = false; e.lurkSeen = null; } L(W, { k: 'ambush', side: 1, a: u.i, why: u.taken > 0 ? 'hit' : near ? 'near' : mate ? 'mate' : seen ? 'seen' : 'time', b: near ? near.i : mate ? mate.i : seen && sb >= 0 ? sb : null, obs: lk.some(e => e.seenBy), vis: true });
    if (W.plan && W.plan.k === 'ambush'){ const was = W.plan.k; W.plan.k = 'hunt'; W.plan.t0 = W.t; L(W, { k: 'plan', side: 1, p: 'hunt', was, why: '매복이 터짐 — 덮침', vis: true }); } return false; }
  stop(u); setMood(W, u, '매복'); const n = W.units.filter(a => a.alive && a.side !== u.side).sort((a, b) => dist(a, u) - dist(b, u))[0]; if (n) u.fg = Math.atan2(n.y - u.y, n.x - u.x); return true;
}
// v7.23 방 지킴이: 방 안 어둠에 웅크려 문 쪽을 봄 — 방마다 따로, 시간 제한 없이. 터지는 때: 상대가 near 칸 안 (벽 너머는 아님) · 맞음 · 같은 방 동료가 싸움 · 들킴을 느낌.
//   문틈으로 상대를 보면 곧장 덮치지 않고 문 옆 모퉁이 (corner) 로 붙어 기다림 → 들어오면 (near) 터짐. corner 초가 지나도록 안 오면 (지나쳐 감) 어둠 속으로 뒤따름 (stalk — 등 뒤 · 들키지 않으면 기존 암살 규칙)
function wardenStep(W, u, dt){
  const P = u.warden, R = W.rules.warden || {}; if (!P || !P.on) return false;
  const foes = W.units.filter(a => a.alive && a.side !== u.side && !a.gone), m = W.map;
  const near = foes.find(a => { const d = dist(a, u); return d < (R.near || 3.5) && (d < 1.2 || losClear(m, u.x, u.y, a.x, a.y)); });
  const mate = !near && W.units.find(o => o !== u && o.alive && o.side === u.side && (P.room != null ? o.warden && o.warden.room === P.room : dist(o, u) < (R.mate || 7)) && busyW(W, o));
  const hurt = u.taken > 0, felt = P.seen != null;
  const out = (why, b, stalkOn) => { const lk = W.units.filter(o => o.alive && o.side === u.side && o.warden && o.warden.on && (o === u || (P.room != null && o.warden.room === P.room)));
    for (const o of lk){ o.warden.on = false; if (b && b.alive){ o.state = 'hunt'; o.target = b; o.last = { x: b.x, y: b.y }; o.searchT = 12; o.sense[b.i] = { x: b.x, y: b.y, t: W.t, exact: o === u && why !== 'heard' }; } if (stalkOn) o.stalk = true; }
    L(W, { k: 'wardenOut', side: u.side, a: u.i, n: lk.length, room: P.room, why, b: b ? b.i : null, vis: u.side === 0 || lk.some(o => o.seenBy) }); return false; };
  if (near) return out('near', near);
  if (hurt) return out('hit', foes.slice().sort((a, b) => dist(a, u) - dist(b, u))[0]);
  if (felt) return out('seen', P.seen >= 0 ? W.units[P.seen] : null);
  if (mate) return out('mate', mate.target && mate.target.alive ? mate.target : null);
  const see = foes.filter(a => canSee(W, u, a)).sort((a, b) => dist(a, u) - dist(b, u))[0];
  if (see){ if (P.seeT == null) P.seeT = W.t; P.last = see.i; }
  if (P.corner && P.seeT != null && W.t - P.seeT >= (R.see != null ? R.see : 0.6)){   // 본 뒤: 문 옆 모퉁이로 붙어 기다림
    if (P.cT == null){ P.cT = W.t; if (P.door){ const dx = u.x - P.door.x, dy = u.y - P.door.y; P.via = Math.abs(dx) > Math.abs(dy) ? { x: u.x, y: P.corner.y } : { x: P.corner.x, y: u.y }; } L(W, { k: 'wardenCorner', side: u.side, a: u.i, room: P.room, vis: u.side === 0 || !!u.seenBy }); }   // 먼저 문틈 줄에서 옆으로 비켜선 뒤 벽을 따라 (줄을 따라 걸으면 들킴)
    if (W.t - P.cT > (R.corner || 8)){ const b = W.units[P.last]; return out('pass', b && b.alive ? b : null, true); }   // 오지 않음 — 지나쳐 감 → 어둠 속으로 뒤따름
    if (P.via && Math.hypot(P.via.x - u.x, P.via.y - u.y) <= 0.3) P.via = null;
    if (P.via){ setMood(W, u, '문틈 줄에서 비켜섬'); goTo(W, u, P.via.x, P.via.y, dt); }
    else if (Math.hypot(P.corner.x - u.x, P.corner.y - u.y) > 0.25){ setMood(W, u, '문 옆 모퉁이로'); goTo(W, u, P.corner.x, P.corner.y, dt); }
    else { stop(u); setMood(W, u, '모퉁이에서 기다림'); if (P.door) u.fg = Math.atan2(P.door.y - u.y, P.door.x - u.x); }
    return true;
  }
  stop(u); setMood(W, u, '숨어 지킴'); const tg = see || (P.door ? null : foes.slice().sort((a, b) => dist(a, u) - dist(b, u))[0]);
  u.fg = tg ? Math.atan2(tg.y - u.y, tg.x - u.x) : P.door ? Math.atan2(P.door.y - u.y, P.door.x - u.x) : u.fg;
  return true;
}
// v7.23.1 세자르 (C-045 · 2D 판 cesarBrain 이식): 리듬 (탐색 4.5 ~ 7초 — 천천히 간격을 재며 돎 ↔ 딜타임 4.5초 — 기술) · 빈틈 찌르기 (휘청 · 넘어짐 · 막 친 상대에게 3배로 달려가 확정 3연격)
//   원형 베기 · 어깨 박치기 · 뒷걸음 점프 (붙으면) · 우회 · 돌진 · 연격 · 동상 · 절단 (출혈). 기술 = u.act { k: 'cz' } — 판정은 모두 strike / 회피 / 밀침 / 휘청 (양쪽 같은 규칙)
const CZR = W => W.rules.cz || {};
const czFoes = (W, u) => W.units.filter(f => f.alive && !f.gone && f.side !== u.side);
const czKnown = (W, u) => czFoes(W, u).filter(f => canSee(W, u, f) || (u.sense[f.i] && W.t - u.sense[f.i].t < 4));
function frostOn(W, t, sec, by){
  if (!t.alive || !(sec > 0)) return; const was = W.t < (t.frostT || -9); t.frostT = Math.max(t.frostT || -9, W.t + sec * (t.frostRes > 0 ? t.frostRes : 1));   /* v8.7.7 냉기에 강함 (frostRes) */
  if (!was) L(W, { k: 'frost', a: by, b: t.i, sec: +sec.toFixed(1), vis: t.side === 0 || !!t.seenBy });
}
function czStagger(W, u, t, sec, k){   // 2D 판 휘청: 힘 = 무게 × 자세 × k · 버팀 = 무게 × 자세 × (막는 중 2)
  if (!t.alive || W.t < (t.saT || -9)) return false; const pw = u.mass * (u.poise || 1) * (k || 2.5), br = t.mass * (t.poise || 1) * (guardOn(W, t) ? 2 : 1);
  if (W.rand() < pw / (pw + br)){ stun(W, t, sec, u.i); return true; } return false;
}
function czTick(W, u, dt){
  const Z = CZR(W), z = u.cz;
  if (!z.on){ if (!u.alive || !czKnown(W, u).length) return; z.on = true; L(W, { k: 'czWake', a: u.i, vis: true }); }
  z.phaseT = (z.phaseT == null ? Z.probe[0] : z.phaseT) - dt;
  if (z.phaseT <= 0){ z.fury = !z.fury; z.phaseT = z.fury ? Z.fury : Z.probe[0] + W.rand() * (Z.probe[1] - Z.probe[0]); if (z.fury){ z.flank = Math.min(z.flank, 0.3); z.rush = Math.min(z.rush, 0.6); } L(W, { k: 'czMode', a: u.i, fury: z.fury, vis: u.side === 0 || !!u.seenBy }); }
  for (const k of ['spin', 'shoulder', 'back', 'punish', 'upcut', 'thrust', 'wave', 'ult', 'rstep']) z[k] -= dt;
  if (z.rspinT != null) z.rspinT -= dt;   /* v7.29.0 */
  if (u.act && u.act.k === 'atk' && u.act.phase === 'rec') z.afterAtk = W.t;   /* v7.24 막 친 뒤 (거두는 동안 계속 — 치고 빠짐) */ if (z.auth != null && z.auth > 0) z.auth -= dt; z.cool -= dt;
  { const AU = Z.auth || {};   // v7.23.2 권위 흔들림: 눈이 내리는 동안 세자르가 shake 초 넘게 휘청이면 shaken 초 동안 눈이 멎고 신성이 돌아옴
    if (z.shaken > 0){ z.shaken -= dt; if (z.shaken <= 0){ W.snow = true; W.seal = true; z.cool = AU.cool || 4; L(W, { k: 'czAuthBack', a: u.i, vis: true }); } }
    else if (W.snow && W.seal && (u.stunT || -9) - W.t >= (AU.shake || 0.4) && z.cool <= 0){ z.shaken = AU.shaken || 6; W.snow = false; W.seal = false; L(W, { k: 'czShaken', a: u.i, vis: true }); } } if (z.fury){ z.flank -= dt; z.rush -= dt; }
  const C = z.combo; if (C && W.t >= C.next){   // 연격: 기본 공격에 이어 comboGap 초마다
    const t = W.units[C.b];
    if (!t || !t.alive || W.t < (u.stunT || -9) || W.t < (u.proneT || -9) || u.kb || gap(u, t) > u.rng + 0.3) z.combo = null;
    else { C.left--; C.n++; C.next = W.t + (Z.comboGap || 0.12); u.fg = Math.atan2(t.y - u.y, t.x - u.x); if (!evadeMelee(W, t, u)){ const o = strike(W, u, t, t, 1, false, { tag: '연격' }); czHit(W, u, t, o, true); }
      if (C.left <= 0){ L(W, { k: 'czCombo', a: u.i, b: t.i, n: C.n, vis: u.side === 0 || !!u.seenBy }); z.combo = null; z.afterAtk = W.t; } }   /* v7.24 연격 뒤도 치고 빠짐 */
  }
}
// 세자르의 일격이 맞음: 동상 · 절단 (출혈) · 휘청 · 연격 (빈틈 찌르기면 확정 3연격)
function czHit(W, u, t, o, noCombo){
  const Z = CZR(W), z = u.cz; if (!o || !t) return;
  if (!o.block && t.alive){ if (u.frostP && W.rand() < u.frostP) frostOn(W, t, Z.frostT || 4, u.i);
    if (u.severP && W.rand() < Math.min(0.95, u.severP * (o.crit ? 2 : 1))){ startBleed(W, t, u.i, o.crit ? 1.5 : 1); L(W, { k: 'sever', a: u.i, b: t.i, vis: t.side === 0 || !!t.seenBy }); }
    czStagger(W, u, t, Z.hitStun || 0.45, 2.5); }
  if (!noCombo && z && !z.combo && t.alive && (z.forceCombo || W.rand() < (Z.combo || 0.35))){ z.combo = { b: t.i, left: 1 + (z.forceCombo || W.rand() < 0.35 ? 1 : 0), next: W.t + (Z.comboGap || 0.12), n: 1 }; z.forceCombo = false; }
}
// 회피 반격: 근접을 피한 뒤 delay 초 — 그 상대가 손이 닿으면 확정 치명 (양쪽 같은 규칙)
function dcFire(W, u){
  const P = u.dcPend, b = W.units[P.b]; u.dcPend = null;
  if (!b || !b.alive || W.t > P.at + 0.5 || (u.act && u.act.k === 'cz') || W.t < (u.stunT || -9) || W.t < (u.proneT || -9) || u.kb || gap(u, b) > u.rng + ((W.rules.dcounter || {}).reach || 0.8)) return;
  u.act = null; u.fg = Math.atan2(b.y - u.y, b.x - u.x); const o = strike(W, u, b, b, 1, false, { crit: true, tag: '회피 반격' }); if (u.cz) czHit(W, u, b, o, true);
  L(W, { k: 'dcounter', a: u.i, b: b.i, vis: u.side === 0 || !!u.seenBy || b.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '반격!', c: 'd', t0: W.t });
}
function czStart(W, u, s, t, o){
  const Z = CZR(W); u.act = { k: 'cz', s, b: t ? t.i : null, t0: W.t, end: W.t + 9, ...(o || {}) }; stop(u); u.waitT = 0;
  if (t) u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  L(W, { k: 'czStart', a: u.i, b: t ? t.i : null, s, punish: !!(o && o.punish), vis: u.side === 0 || !!u.seenBy });
  if (s === 'spin' && W.fxOn) W.fx.push({ k: 'czWarn', a: u.i, s, t0: W.t, dur: (Z.spin || {}).wind || 0.35, r: (Z.spin || {}).r || 2.6 });
  if (s === 'upcut') L(W, { k: 'czCharge', a: u.i, s, vis: true });   // 검을 낮게 늘어뜨리고 숨을 고른다
  setMood(W, u, o && o.spinAfter ? '돌진 — 원형 베기' : { auth: '손을 듦 — 권위', upcut: '하늘 가르기 — 모음', thrust: '관통 찌르기 — 모음', wave: '냉기 참격 — 모음', ult: '마구 베기', spin: '원형 베기', shoulder: '어깨 박치기', backs: '뒷걸음 점프', rush: o && o.punish ? '빈틈 찌르기' : '돌진', flank: '뒤로 돌아 들어감' }[s] || s, t ? t.i : null);   /* v7.29.0 o.spinAfter */
  return true;
}
// 직선 · 부채꼴에 걸리는 상대 수 (아는 상대만)
const czLineN = (W, u, ang, len, w) => { const cx = Math.cos(ang), cy = Math.sin(ang); return czKnown(W, u).filter(e => { const px = e.x - u.x, py = e.y - u.y, al = px * cx + py * cy; return al > -0.2 && al < len && Math.abs(px * cy - py * cx) < w + e.r * 0.5; }).length; };
const czFanN = (W, u, ang, r, half) => czKnown(W, u).filter(e => { const a = Math.atan2(e.y - u.y, e.x - u.x) - ang; return dist(u, e) - e.r <= r && Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= half; }).length;
// 최전방: 상대 무리의 무게중심에서 세자르 쪽으로 가장 튀어나온 이 (2D 판 czFront)
function czFront(W, u){ const F = czKnown(W, u); if (!F.length) return null; const cx = F.reduce((s, f) => s + f.x, 0) / F.length, cy = F.reduce((s, f) => s + f.y, 0) / F.length; let vx = u.x - cx, vy = u.y - cy; const l = Math.hypot(vx, vy) || 1; vx /= l; vy /= l;
  return F.slice().sort((a, b) => ((b.x - cx) * vx + (b.y - cy) * vy) - ((a.x - cx) * vx + (a.y - cy) * vy))[0]; }
// v7.24 스텝: 상대 t 기준 ang 쪽으로 d M (빈 곳만) — then = 'atk' 면 내려서며 바로 벰
function czStep(W, u, t, angs, d, then, why){
  const S = (CZR(W).step || {}), z = u.cz; if (W.t < (u.hobbleT || -9) || u.kb || prone(W, u)) return false; const dd = d * (W.t < (u.frostT || -9) ? S.frost || 0.6 : 1);
  for (const a of angs){ const x = u.x + Math.cos(a) * dd, y = u.y + Math.sin(a) * dd;
    if (x < u.r || y < u.r || x > W.map.W - u.r || y > W.map.H - u.r || boxRock(W, x, y, u.r * 0.9) || !fatClear(W.map, u.x, u.y, x, y, u.r * 0.8)) continue;
    if (W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r * 0.85)) continue;
    u.act = { k: 'cz', s: 'step', b: t ? t.i : null, t0: W.t, end: W.t + 1, fx: u.x, fy: u.y, tx: x, ty: y, T: S.T || 0.13, then: then || null }; stop(u); u.waitT = 0;
    z.nStep = (z.nStep || 0) + 1; (z.stepK = z.stepK || {})[why || '-'] = ((z.stepK || {})[why || '-'] || 0) + 1; z.stepT = W.t + (S.T || 0.13) + (S.gap || [0.15, 0.45])[0] + W.rand() * (((S.gap || [0.15, 0.45])[1]) - ((S.gap || [0.15, 0.45])[0]));
    if (why) setMood(W, u, why, t ? t.i : null); if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t });
    return true; }
  return false;
}
// v7.24 비켜 섬: 매 틱 — 손이 비었거나 막 치고 거두는 중이면, 나를 노린 일격이 win 초 안에 닿을 때 옆 · 뒤로 (rcd 초마다 · react 확률). 딜타임이면 내려서며 되벰
function czReact(W, u){
  const z = u.cz, S = (CZR(W).step || {}); if (!z || !z.on || !u.alive || z.rstep > 0 || z.combo || u.kb || prone(W, u) || W.t < (u.stunT || -9) || W.t < (u.hobbleT || -9)) return false;
  if (u.act && !(u.act.k === 'atk' && (u.act.phase === 'rec' || u.act.phase === 'wind'))) return false;
  const inc = W.units.find(e => e.alive && e.side !== u.side && e.act && e.act.phase === 'wind' && e.act.b === u.i && ['atk', 'bash', 'spec'].includes(e.act.k) && e.act.end - W.t < (S.win || 0.32) && !(e.act.czSt || []).includes(u.i) && dist(e, u) < (e.rng || 1) + e.r + u.r + 1.2 && aware(W, u, e) && !(u.act && u.act.phase === 'wind' && u.act.end <= e.act.end - 0.02));   // 제 일격이 먼저 닿으면 그대로 침
  if (!inc) return false; (inc.act.czSt = inc.act.czSt || []).push(u.i); z.rstep = S.rcd || 0.7; if (W.rand() >= (S.react || 0.7)) return false;
  const aw = Math.atan2(u.y - inc.y, u.x - inc.x), sg = W.rand() < 0.5 ? 1 : -1, was = u.act; u.act = null;
  if (czStep(W, u, inc, [aw + sg * 1.25, aw - sg * 1.25, aw + sg * 0.6, aw, aw - sg * 0.6], S.d || 1.6, z.fury || W.rand() < 0.4 ? 'atk' : null, '비켜 섬')){ L(W, { k: 'czSide', a: u.i, b: inc.i, vis: u.side === 0 || !!u.seenBy || inc.side === 0 }); return true; }
  u.act = was; return false;
}
function czEnd(W, u, k, cd){ const z = u.cz; if (z && k) z[k] = cd; u.act = null; u.czSpd = 1; }
function czRun(W, u, dt){
  const A = u.act, Z = CZR(W), z = u.cz || {}, t = A.b != null ? W.units[A.b] : null, el = W.t - A.t0;
  if (!u.alive){ u.act = null; return false; }
  if (W.t < (u.stunT || -9) || W.t < (u.proneT || -9) || u.kb){   // 끊김: 휘청 · 넘어짐 · 날아감
    const S = Z.spin || {}; if (A.s === 'spin' && !A.hit){ z.spin = S.brk || 3; L(W, { k: 'czBreak', a: u.i, s: A.s, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '끊김', c: 'g', t0: W.t }); }
    else if (A.s === 'shoulder') z.shoulder = (Z.shoulder || {}).cd || 5; else if (A.s === 'backs') z.back = Z.backCd || 6;
    else if (A.s === 'wave' && !A.hit){ z.wave = (Z.wave || {}).brk || 4; L(W, { k: 'czBreak', a: u.i, s: A.s, vis: true }); }
    else if (A.s === 'auth' && !A.done){ z.auth = (Z.auth || {}).retry || 6; L(W, { k: 'czBreak', a: u.i, s: A.s, vis: true }); }
    else if (A.s === 'ult' && !A.over){ L(W, { k: 'czBreak', a: u.i, s: A.s, n: A.hits || 0, vis: true }); }
    if (W.fxOn && ['wave', 'auth', 'ult'].includes(A.s)) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '끊김', c: 'g', t0: W.t });
    u.act = null; u.czSpd = 1; return false; }
  if (A.s === 'spin'){ const S = Z.spin || {};
    if (!A.hit && el >= (S.wind || 0.35)){ A.hit = true; let n = 0;
      for (const e of czFoes(W, u)){ if (dist(u, e) - e.r > (S.r || 2.6)) continue; n++; if (evadeMelee(W, e, u)) continue;
        const o = strike(W, u, e, e, 1, false, { mul: S.mul || 2, tag: '원형 베기' }); if (!e.alive || !o) continue;
        if (!o.block){ if (!e.kb) shove(W, u, e, S.kb || 1.6, e.x - u.x, e.y - u.y, { tag: '원형 베기에 밀려남' }); czStagger(W, u, e, S.stun || 0.5, 3); frostOn(W, e, S.frost || 2, u.i); }
        else czStagger(W, u, e, (S.stun || 0.5) * 0.6, 3); }
      L(W, { k: 'czSpin', a: u.i, n, vis: u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'czSpin', x: u.x, y: u.y, r: S.r || 2.6, t0: W.t }); }
    if (el >= (S.wind || 0.35) + (S.rec || 0.5)) czEnd(W, u, 'spin', S.cd || 8); return true; }
  if (A.s === 'shoulder'){ const S = Z.shoulder || {};
    if (!A.hit){ const d = t && t.alive ? gap(u, t) : 99;
      if (t && t.alive && d > (S.reach || 0.6) * 0.5 && el < (S.max || 0.45)){ const v = Math.min((S.v || 10) * dt, d), l = Math.hypot(t.x - u.x, t.y - u.y) || 1; tryMove(W, u, u.x + (t.x - u.x) / l * v, u.y + (t.y - u.y) / l * v); u.fg = Math.atan2(t.y - u.y, t.x - u.x); return true; }
      A.hit = true; A.t1 = W.t;
      if (t && t.alive && gap(u, t) <= (S.reach || 0.6) && !evadeMelee(W, t, u)){ const o = strike(W, u, t, t, 1, false, { mul: S.mul || 0.6, tag: '어깨 박치기', wk: '둔기' });
        if (o && t.alive){ if (!t.kb) shove(W, u, t, (S.kb || 1.2) * (o.block ? 0.6 : 1), t.x - u.x, t.y - u.y, { tag: '어깨에 받혀 날아감' }); czStagger(W, u, t, S.stun || 0.7, 2); }
        L(W, { k: 'czShoulder', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy || t.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '쾅!', c: 'd', t0: W.t }); }
      else L(W, { k: 'czShoulder', a: u.i, b: t ? t.i : null, miss: true, vis: u.side === 0 || !!u.seenBy }); }
    if (W.t - A.t1 >= (S.rec || 0.6)) czEnd(W, u, 'shoulder', S.cd || 5); return true; }
  if (A.s === 'rush' || A.s === 'flank'){
    if (!t || !t.alive){ czEnd(W, u, A.punish ? null : A.s, A.s === 'rush' ? Z.rushCd || 5 : Z.flankCd || 5); return true; }
    let gx, gy;
    if (A.s === 'rush'){ const l = dist(u, t) || 1, k = t.r + u.r + u.rng * 0.6; gx = t.x + (u.x - t.x) / l * k; gy = t.y + (u.y - t.y) / l * k; }
    else { const O = czFoes(W, u).filter(f => f !== t && dist(f, t) < 8), cx = O.length ? O.reduce((s, f) => s + f.x, 0) / O.length : u.x, cy = O.length ? O.reduce((s, f) => s + f.y, 0) / O.length : u.y;   // 상대 무리의 반대편 (뒤)
      let bx = t.x - cx, by = t.y - cy, bl = Math.hypot(bx, by); if (bl < 0.3){ bx = t.x - u.x; by = t.y - u.y; bl = Math.hypot(bx, by) || 1; } bx /= bl; by /= bl;
      const sd = (A.side || 1) * 1.4 * (el < 0.6 ? 1 : 0.3); gx = t.x + bx * 1.2 - by * sd; gy = t.y + by * 1.2 + bx * sd; }
    gx = Math.max(u.r + 0.1, Math.min(W.map.W - u.r - 0.1, gx)); gy = Math.max(u.r + 0.1, Math.min(W.map.H - u.r - 0.1, gy));
    u.czSpd = Z.run || 3; goTo(W, u, gx, gy, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
    if (W.fxOn && W.rand() < dt * 12) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t });
    if (A.spinAfter && (dist(u, t) - t.r < ((Z.spin || {}).r || 2.6) - 0.8 || el > 1.5)){ czEnd(W, u, 'rush', Z.rushCd || 5); return czStart(W, u, 'spin', t, { chain: true, rushed: true }); }   /* v7.29.0 돌진 원형 베기 (대기 무시) */
    if (Math.hypot(gx - u.x, gy - u.y) < 0.4 || (A.s === 'rush' && inReach(u, t)) || el > (A.s === 'rush' ? 1.5 : 2.5)){ z.atkNow = true; z.atkB = t.i; if (A.punish) z.forceCombo = true; czEnd(W, u, A.punish ? null : A.s, A.s === 'rush' ? Z.rushCd || 5 : Z.flankCd || 5); }
    return true; }
  if (A.s === 'auth'){ const AU = Z.auth || {};   // 권위: 손을 들고 (끊길 수 있음) → 눈 · 신성 봉인
    if (!A.done && el >= (AU.raise || 1.1)){ A.done = true; W.snow = true; W.seal = true; L(W, { k: 'czAuth', a: u.i, vis: true }); }
    if (el >= (AU.done || 1.6)){ z.auth = null; czEnd(W, u); } return true; }
  if (A.s === 'upcut'){ const S = Z.upcut || {}, ch = S.charge || 1;   // 하늘 가르기: 모음 (슈퍼아머 · 방향은 상대를 따라감) → 16M 직선을 벰 → 정적 → 갈라진 자리의 폭풍
    if (el < ch){ u.saT = A.t0 + ch; if (t && t.alive) A.ang = Math.atan2(t.y - u.y, t.x - u.x); u.fg = A.ang; return true; }
    const cx = Math.cos(A.ang), cy = Math.sin(A.ang);
    if (!A.hit){ A.hit = true; let n = 0;
      for (const e of czFoes(W, u)){ const px = e.x - u.x, py = e.y - u.y, al = px * cx + py * cy; if (al < -0.2 || al > (S.len || 16) + 0.4 || Math.abs(px * cy - py * cx) > (S.w || 0.8) + e.r * 0.5) continue;
        n++; strike(W, u, e, e, 1, false, { mul: S.mul || 2.2, grab: true, tag: '하늘 가르기' }); if (!e.alive) continue;
        startBleed(W, e, u.i, 1.5); stun(W, e, S.stun || 1, u.i); knockDown(W, e, (S.stun || 1) + (S.down || 1.6), u.i, '하늘 가르기'); e.hobbleT = W.t + (S.stun || 1) + (S.down || 1.6) + (S.hobble || 10); }
      L(W, { k: 'czUpcut', a: u.i, n, ang: +A.ang.toFixed(3), vis: true }); if (W.fxOn) W.fx.push({ k: 'czCut', x: u.x, y: u.y, ang: A.ang, len: S.len || 16, t0: W.t }); }
    const gt = el - ch - (S.galeAt || 1.1);
    if (gt >= 0 && gt < (S.gale || 1.5)){ if (!A.gale){ A.gale = true; L(W, { k: 'czGale', a: u.i, vis: true }); }   // 폭풍: 앞쪽 ±70° · 무게가 가벼울수록 멀리 (1.5톤 넘으면 버팀) · 처음이 가장 셈
      const pw = 1 - 0.65 * gt / (S.gale || 1.5);
      for (const o of W.units){ if (!o.alive || o === u || o.gone) continue; const dx = o.x - u.x, dy = o.y - u.y, d = Math.hypot(dx, dy) || 1, al = (dx * cx + dy * cy) / d; if (al < (S.galeArc || 0.35) || d > (S.len || 16) + (S.galeAdd || 4)) continue;
        const w = (o.mass || 62) * (o.poise || 1), wf = w >= 1500 ? 0 : Math.min(1.6, 70 / w); if (wf <= 0.02) continue; const v = (S.galeV || 2.2) * wf * pw * Math.min(1, al + 0.2) * dt;
        tryMove(W, o, o.x + dx / d * v, o.y + dy / d * v); } }
    if (el >= ch + (S.galeAt || 1.1) + (S.gale || 1.5)){ czEnd(W, u, 'upcut', S.cd || 20); } return true; }
  if (A.s === 'thrust'){ const S = Z.thrust || {}, ch = S.charge || 0.6;   // 관통 찌르기: 모음 (슈퍼아머) → 5M 를 한순간에 → 줄 위의 모두 (못 막음) · 맨 앞이 가벼우면 꿰어 내던짐
    if (el < ch){ u.saT = A.t0 + ch; if (t && t.alive) A.ang = Math.atan2(t.y - u.y, t.x - u.x); u.fg = A.ang; return true; }
    if (!A.hit){ A.hit = true; const cx = Math.cos(A.ang), cy = Math.sin(A.ang), x0 = u.x, y0 = u.y; let L0 = 0;
      for (let s0 = 0.1; s0 <= (S.dash || 5); s0 += 0.1){ if (boxRock(W, x0 + cx * s0, y0 + cy * s0, u.r * 0.9)) break; L0 = s0; }
      const hits = czFoes(W, u).map(e => { const px = e.x - x0, py = e.y - y0; return { e, al: px * cx + py * cy, lat: Math.abs(px * cy - py * cx) }; }).filter(h => h.al > -0.2 && h.al < L0 + 0.8 && h.lat < (S.w || 0.8) + h.e.r * 0.5).sort((p, q) => p.al - q.al);
      let stopAt = L0; if (hits.length) stopAt = Math.min(L0, Math.max(0, hits[0].al - hits[0].e.r - u.r - 0.05)); tryMove(W, u, x0 + cx * stopAt, y0 + cy * stopAt);   // 맨 앞 상대 앞까지 튀어나감
      hits.forEach((h, i) => { const e = h.e; strike(W, u, e, e, 1, false, { mul: S.mul || 1.2, grab: true, crit: W.rand() < (S.crit || 0.5), tag: '관통 찌르기' }); if (!e.alive) return;
        const bw = (e.mass || 62) * (e.poise || 1) * (guardOn(W, e) ? 2 : 1);
        if (i === 0 && bw <= (S.lift || 500)){ shove(W, u, e, S.toss || 2.4, cx, cy, { tag: '꿰어 들어 올렸다가 내던짐' }); knockDown(W, e, 1.2, u.i, '관통 찌르기'); strike(W, u, e, e, 1, false, { mul: S.tossMul || 0.8, grab: true, tag: '내던져 떨어짐', noFire: true }); if (e.alive) stun(W, e, S.tossStun || 0.8, u.i); L(W, { k: 'czToss', a: u.i, b: e.i, vis: true }); }
        else stun(W, e, S.stun || 1.2, u.i); });
      L(W, { k: 'czThrust', a: u.i, n: hits.length, vis: true }); if (W.fxOn) W.fx.push({ k: 'czThr', x: x0, y: y0, ang: A.ang, len: L0, t0: W.t }); }
    if (el >= ch + (S.rec || 1.1)) czEnd(W, u, 'thrust', S.cd || 6); return true; }
  if (A.s === 'wave'){ const S = Z.wave || {}, ch = S.charge || 0.8;   // 냉기 참격: 모음 (끊길 수 있음) → 앞쪽 부채꼴 (막고 피할 수 있음) · 동상
    if (el < ch){ if (t && t.alive) A.ang = Math.atan2(t.y - u.y, t.x - u.x); u.fg = A.ang; return true; }
    if (!A.hit){ A.hit = true; let n = 0;
      for (const e of czFoes(W, u)){ const d = dist(u, e), da = Math.abs(Math.atan2(Math.sin(Math.atan2(e.y - u.y, e.x - u.x) - A.ang), Math.cos(Math.atan2(e.y - u.y, e.x - u.x) - A.ang))); if (d - e.r > (S.r || 7.3) || da > (S.half || 1.3)) continue;
        n++; if (evadeMelee(W, e, u)) continue; const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.8, tag: '냉기 참격' }); if (o && e.alive && !o.block) frostOn(W, e, S.frost || 4, u.i); }
      L(W, { k: 'czWave', a: u.i, n, vis: true }); if (W.fxOn) W.fx.push({ k: 'czFan', x: u.x, y: u.y, ang: A.ang, r: S.r || 7.3, half: S.half || 1.3, t0: W.t }); }
    if (el >= ch + (S.rec || 0.7)) czEnd(W, u, 'wave', S.cd || 9); return true; }
  if (A.s === 'ult'){ const S = Z.ult || {}, ch = S.charge || 1;   // 마구 베기: 모음 (끊길 수 있음) → 최전방에게 돌진 (슈퍼아머) → 0.1초마다 확정 치명 12번 (휘청이면 끊김)
    let tg = A.tb != null ? W.units[A.tb] : t; if (!tg || !tg.alive){ tg = czFront(W, u); A.tb = tg ? tg.i : null; }
    if (!tg){ A.over = true; czEnd(W, u); return true; }
    if (el < ch){ u.fg = Math.atan2(tg.y - u.y, tg.x - u.x); return true; }
    if (!A.arr){ u.saT = W.t + 0.05; const d = gap(u, tg);
      if (d > 0.5 && el < (S.maxT || 1.5)){ const v = Math.min((S.v || 18) * dt, d - 0.45), l = dist(u, tg) || 1; tryMove(W, u, u.x + (tg.x - u.x) / l * v, u.y + (tg.y - u.y) / l * v); u.fg = Math.atan2(tg.y - u.y, tg.x - u.x); if (W.fxOn && W.rand() < dt * 20) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t }); return true; }
      A.arr = true; A.next = W.t; A.hits = 0; u.saT = -9; L(W, { k: 'czUltGo', a: u.i, b: tg.i, vis: true }); }
    if (A.hits < (S.n || 12)){ if (W.t >= A.next){ A.next = W.t + (S.gap || 0.1); A.hits++;
        if (gap(u, tg) > 1.0){ const l = dist(u, tg) || 1, k = tg.r + u.r + 0.3; tryMove(W, u, tg.x + (u.x - tg.x) / l * k, tg.y + (u.y - tg.y) / l * k); if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t }); }   // 멀어지면 붙어 따라감
        u.fg = Math.atan2(tg.y - u.y, tg.x - u.x); strike(W, u, tg, tg, 1, false, { mul: S.mul || 0.3, crit: true, grab: true, tag: '마구 베기', noFire: true });
        if (!tg.alive){ const nx = czFront(W, u); if (nx){ A.tb = nx.i; } else A.hits = S.n || 12; } }
      return true; }
    if (!A.over){ A.over = true; A.t2 = W.t; L(W, { k: 'czUlt', a: u.i, n: A.hits, vis: true }); }
    if (W.t - A.t2 >= (S.end || 0.3)) czEnd(W, u); return true; }
  if (A.s === 'step'){ const T = A.T || 0.13, k = Math.min(1, el / T), nx = A.fx + (A.tx - A.fx) * k, ny = A.fy + (A.ty - A.fy) * k;   /* v7.24 스텝: T 초에 d M */
    tryMove(W, u, nx, ny); if (t && t.alive) u.fg = Math.atan2(t.y - u.y, t.x - u.x);
    if (k >= 1){ if (A.then === 'atk' && t && t.alive){ z.atkNow = true; z.atkB = t.i; } czEnd(W, u); } return true; }
  if (A.s === 'backs'){ const hop = Z.backT || 0.34, per = hop + (Z.backRest || 0.16), k = Math.floor(el / per), ph = el - k * per;
    if (k >= (A.n || 2)){ czEnd(W, u, 'back', Z.backCd || 6); return true; }
    if (ph < hop){ A.hop = true;
      if (A.k0 !== k){ A.k0 = k; const ax = t ? u.x - t.x : -Math.cos(u.face || 0), ay = t ? u.y - t.y : -Math.sin(u.face || 0), l = Math.hypot(ax, ay) || 1; A.dx = ax / l; A.dy = ay / l; L(W, { k: 'czBack', a: u.i, n: k + 1, vis: u.side === 0 || !!u.seenBy }); }
      const v = (Z.back || 1.8) / hop * dt; let nx = u.x + A.dx * v, ny = u.y + A.dy * v;
      if (boxRock(W, nx, ny, u.r * 0.9)){ const s = W.rand() < 0.5 ? 1 : -1, ex = A.dx * 0.5 - A.dy * s * 0.86, ey = A.dy * 0.5 + A.dx * s * 0.86; A.dx = ex; A.dy = ey; nx = u.x + ex * v; ny = u.y + ey * v; }   // 벽이면 비스듬히
      tryMove(W, u, nx, ny); if (t) u.fg = Math.atan2(t.y - u.y, t.x - u.x); }
    else A.hop = false;
    return true; }
  u.act = null; return false;
}
function czBrain(W, u, dt){
  const Z = CZR(W), z = u.cz; if (!z || !z.on) return false;
  const F = czKnown(W, u); if (!F.length){ u.czSpd = 1; return false; }
  const byD = F.slice().sort((a, b) => dist(a, u) - dist(b, u)), t = byD[0];
  if (z.auth != null && z.auth <= 0 && !W.snow) return czStart(W, u, 'auth', t);   /* v7.23.2 권위 (눈이 안 내리는 판이면 처음에 — 2D 판처럼 빈틈 찌르기보다 먼저) */
  const open = o => W.t < (o.stunT || -9) - 0.15 || prone(W, o) || (o.act && o.act.k === 'atk' && o.act.phase === 'rec' && W.t < o.act.end - 0.15);   // 빈틈: 휘청 · 넘어짐 · 막 친 뒤
  const gapT = byD.find(o => dist(o, u) < (Z.punR || 6) && open(o));
  if (gapT && z.punish <= 0){ z.punish = Z.punish || 2.2; L(W, { k: 'czPunish', a: u.i, b: gapT.i, vis: u.side === 0 || !!u.seenBy || gapT.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '빈틈', c: 'v', t0: W.t }); return czStart(W, u, 'rush', gapT, { punish: true }); }
  if (z.rspinT != null && z.rspinT <= 0 && !u.act){ z.rspinT = null; const S = Z.spin || {}, g = gap(u, t);   /* v7.29.0 2D 판: 원형 베기로 밀어낸 몇 초 뒤 — 이번엔 돌진해서 원형 베기 */
    if (dist(u, t) - t.r < (S.r || 2.6) - 0.5) return czStart(W, u, 'spin', t, { chain: true });
    if (g < 9) return czStart(W, u, 'rush', t, { spinAfter: true }); }
  if (z.atkNow){ const at = W.units[z.atkB] && W.units[z.atkB].alive ? W.units[z.atkB] : t; if (inReach(u, at)){ z.atkNow = false; u.czSpd = 1; u.target = at; u.state = 'hunt'; startAct(W, u, at, '세자르의 베기'); if (u.act) return true; } else if (gap(u, at) > 2) z.atkNow = false; }   // 우회 · 돌진 · 빈틈 찌르기로 닿으면 바로 벰
  { const S = Z.step || {}, aT = Math.atan2(t.y - u.y, t.x - u.x), sg = W.rand() < 0.5 ? 1 : -1, rd = S.d || 1.6;   /* v7.24 스텝을 마구 밟음 */
    if (W.t >= (z.stepT || 0) && !z.combo){
      if (W.t - (z.afterAtk || -9) < 0.3 && W.rand() < (z.fury ? (S.out || 0.7) * 0.6 : S.out || 0.7) && czStep(W, u, t, [aT + Math.PI + sg * 0.5, aT + Math.PI - sg * 0.5, aT + Math.PI, aT + sg * 1.4], rd, null, '치고 빠짐')) return true;   // 치고 빠짐
      const g = gap(u, t), reach = u.rng + 0.05;
      if (g > reach && g - reach < Math.min(S.inR || 3.2, rd + 0.6) && (z.fury || W.rand() < 0.35)){ const k = Math.min(rd, g - u.rng * 0.6);   // 밟아 들어가며 벰
        if (k > 0.3 && czStep(W, u, t, [aT + sg * 0.35, aT - sg * 0.35, aT], k, 'atk', '밟아 들어가 벰')) return true; }
      if (z.fury && g > reach && g < reach + rd * 2.2 && czStep(W, u, t, [aT + sg * 0.5, aT - sg * 0.5], rd, null, '파고듦')) return true;   // 두 번에 걸쳐 파고듦
      if (g < (Z.keep || 3.5) + 2.5){ const o = z.orbit || 1, side = W.rand() < 0.25 ? -o : o; if (side !== o) z.orbit = side;   // 간격을 잴 때도 옆걸음 (돌던 쪽 · 가끔 반대로)
        if (czStep(W, u, t, z.fury ? [aT + side * 1.1, aT + side * 0.7, aT - side * 1.1] : [aT + side * 1.57 + (g < (Z.keep || 3.5) - 0.8 ? 0.6 * side : 0), aT - side * 1.57, aT + Math.PI + side * 0.8], rd * (z.fury ? 0.8 : 1), null, z.fury ? '옆으로 파고듦' : '옆걸음')) return true; } } }
  const close = byD.filter(o => gap(u, o) < (Z.close || 1.2));
  if (close.length && !z.fury && z.spin <= 0 && W.rand() < (Z.spinP != null ? Z.spinP : 0.5)){ const RS = Z.rspin || [3, 4.5]; z.rspinT = RS[0] + W.rand() * (RS[1] - RS[0]); return czStart(W, u, 'spin', t); }   // 탐색 중 붙으면: 베어서 밀어내거나 (v7.29.0 대개 — 몇 초 뒤 돌진 원형 베기가 이어짐)
  if (close.length && !z.fury && z.back <= 0) return czStart(W, u, 'backs', close[0], { n: 2 + (W.rand() < 0.4 ? 1 : 0) });   // 뒷걸음 점프 연달아
  if (z.fury){ const S = Z.spin || {}, SH = Z.shoulder || {};
    if (z.spin <= 0 && byD.some(o => dist(o, u) - o.r < (S.r || 2.6) - 0.3)) return czStart(W, u, 'spin', t);
    const d = dist(u, t), U = Z.ult || {}, UP = Z.upcut || {}, TH = Z.thrust || {}, WV = Z.wave || {}, fr = czFront(W, u);
    if (z.ult <= 0 && fr && dist(u, fr) < (U.rng || 8.4)){ z.ult = U.cd || 22; return czStart(W, u, 'ult', fr, { tb: fr.i }); }   // 마구 베기 (대기는 시작할 때 걸림)
    const inR = (a0, a1) => byD.filter(o => { const q = dist(u, o); return q > a0 && q < a1; }), best = (L0, f) => { let bo = null, bn = 0; for (const o of L0){ const n = f(Math.atan2(o.y - u.y, o.x - u.x)); if (n > bn){ bn = n; bo = o; } } return bo; };   // 가장 많이 걸리는 쪽 (2D 판은 가장 가까운 이 — 이 판은 일행이 몰려 붙으므로)
    const pick = (a0, a1, f) => { if (Z.aim === 'best') return best(inR(a0, a1), f); const q = dist(u, t); return q > a0 && q < a1 ? t : null; };   /* v8.7.4 2D 그대로: 가장 가까운 이 (그 거리가 기술 거리 안일 때만) */
    if (z.upcut <= 0){ const o = pick(UP.d0 || 2.1, UP.d1 || 10, ang => czLineN(W, u, ang, UP.len || 16, UP.w || 0.8)); if (o) return czStart(W, u, 'upcut', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) }); }
    if (z.thrust <= 0){ const o = pick(TH.d0 || 1.8, TH.d1 || 6.3, ang => czLineN(W, u, ang, (TH.dash || 5) + 0.8, TH.w || 0.8)); if (o) return czStart(W, u, 'thrust', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) }); }
    if (z.wave <= 0){ const o = pick((WV.d0 || 3.1) - 0.01, (WV.d1 || 7) + 0.01, ang => czFanN(W, u, ang, WV.r || 7.3, WV.half || 1.3)); if (o) return czStart(W, u, 'wave', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) }); }
    if (z.shoulder <= 0 && gap(u, t) < (SH.rng || 3.3) && gap(u, t) > 0.4 && W.rand() < dt * 1.5) return czStart(W, u, 'shoulder', t);
    if (z.flank <= 0 && W.rand() < dt * 1.5) return czStart(W, u, 'flank', t, { side: W.rand() < 0.5 ? 1 : -1 });
    if (z.rush <= 0 && gap(u, t) > 2 && W.rand() < dt * 1.5) return czStart(W, u, 'rush', t); }
  if (inReach(u, t) && (z.fury || z.atkNow || W.rand() < dt * 2)){ z.atkNow = false; u.czSpd = 1; u.target = t; u.state = 'hunt'; startAct(W, u, t, '세자르의 베기'); if (u.act) return true; }   // 딜타임은 닿으면 바로 · 탐색은 들어온 자만 가끔
  z.jog = (z.jog || 0) - dt; if (!z.fury && z.jog < -2.5 && W.rand() < dt * 0.3) z.jog = 0.7;   // 탐색 중 가끔 잠깐 뜀
  u.czSpd = z.fury ? (Z.furyWalk || 0.8) : z.jog > 0 ? (Z.jog || 1.4) : (Z.walk || 0.45);
  const keep = z.fury ? u.rng * 0.8 + t.r + u.r : (Z.keep || 3.5), a = Math.atan2(u.y - t.y, u.x - t.x) + z.orbit * (Z.orbit || 0.25), gx = t.x + Math.cos(a) * keep, gy = t.y + Math.sin(a) * keep;
  if (boxRock(W, gx, gy, u.r)) z.orbit = -z.orbit;
  setMood(W, u, z.fury ? '휘몰아침' : '간격을 잼', t.i); goTo(W, u, gx, gy, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x); u.target = t; u.state = 'hunt';
  return true;
}
// 판마다 다른 시작: 적의 시작 자리를 판 번호 (씨앗) 로 고름. 아군 자리는 그대로
function startScenario(W, kf){   /* v7.25.3 kf = 고른 상황 */
  const E = W.units.filter(u => u.side === 1), A = W.units.filter(u => u.side === 0); if (E.length < 2 || !A.length) return;
  const m = W.map, ac = centroid(A), ec0 = centroid(E); let ax = ec0.x - ac.x, ay = ec0.y - ac.y; const al = Math.hypot(ax, ay) || 1; ax /= al; ay /= al; const px = -ay, py = ax;
  const K = [['front', 1], ['pincer', 1], ['ambush', 0.8], ['rear', 0.8], ['column', 0.8]], tot = K.reduce((s, x) => s + x[1], 0); let r = W.rand() * tot, k = 'front'; for (const [j, w] of K){ r -= w; if (r <= 0){ k = j; break; } } if (kf && K.some(x => x[0] === kf)) k = kf;
  const placed = [...A];
  const spot = (x, y, u) => { for (let d = 0; d <= 3; d += 0.4) for (let a = 0; a < (d ? 12 : 1); a++){ const xx = Math.max(0.6, Math.min(m.W - 0.6, x + Math.cos(a * Math.PI / 6) * d)), yy = Math.max(0.6, Math.min(m.H - 0.6, y + Math.sin(a * Math.PI / 6) * d));
      if (boxRock(W, xx, yy, u.r * 0.9) || placed.some(o => Math.hypot(o.x - xx, o.y - yy) < o.r + u.r + 0.15) || A.some(o => Math.hypot(o.x - xx, o.y - yy) < 3.2)) continue; return { x: xx, y: yy }; } return { x: u.x, y: u.y }; };
  const put = (u, x, y) => { const p = spot(x, y, u); u.x = p.x; u.y = p.y; u.home = { x: p.x, y: p.y }; u.face = u.fg = Math.atan2(ac.y - p.y, ac.x - p.x); placed.push(u); };
  const order = L2 => L2.slice().sort((a, b) => ((b.shield || b.bodyShield) ? 2 : isFar(b) ? 0 : 1) - ((a.shield || a.bodyShield) ? 2 : isFar(a) ? 0 : 1));
  const block = (L2, cx, cy, fx, fy) => { const ox = -fy, oy = fx; order(L2).forEach((u, j) => { const row = Math.floor(j / 3), col = j % 3 - 1; put(u, cx - fx * row * 1.2 + ox * col * 1.25, cy - fy * row * 1.2 + oy * col * 1.25); }); };
  const at2 = (d, ang) => ({ x: ac.x + (ax * Math.cos(ang) - ay * Math.sin(ang)) * d, y: ac.y + (ay * Math.cos(ang) + ax * Math.sin(ang)) * d });
  const toward = p => { const dx = ac.x - p.x, dy = ac.y - p.y, d = Math.hypot(dx, dy) || 1; return [dx / d, dy / d]; };
  let desc = '';
  if (k === 'front'){ const c = at2(7.5, 0); block(E, c.x, c.y, ...toward(c)); desc = '정면 대치 — 한 덩어리로 마주 섬'; }
  else if (k === 'pincer'){ const s = order(E), L1 = s.filter((u, j) => j % 2 === 0), L2 = s.filter((u, j) => j % 2 === 1), c1 = at2(7, 0.85), c2 = at2(7, -0.85); block(L1, c1.x, c1.y, ...toward(c1)); block(L2, c2.x, c2.y, ...toward(c2)); desc = `양쪽 협공 — 두 무리 (${L1.length} · ${L2.length}) 가 양옆 앞에서`; }
  else if (k === 'ambush'){ const s = order(E); s.forEach((u, j) => { const side = j % 2 ? 1 : -1, c = at2(8.4 + Math.floor(j / 2) * 0.7, side * (1.45 + (j % 4 > 1 ? 0.25 : 0))); put(u, c.x, c.y); u.lurk = true; }); desc = '매복 — 양옆 어둠 속에 숨어 기다림'; }
  else if (k === 'rear'){ const fast = E.filter(u => !isFar(u) && !u.giant && !(u.shield && u.role === '전선')).sort((a, b) => b.spd - a.spd).slice(0, 2), main = E.filter(u => !fast.includes(u)), c = at2(7.5, 0), b = at2(6, Math.PI);
    block(main, c.x, c.y, ...toward(c)); fast.forEach((u, j) => put(u, b.x + px * (j ? -0.8 : 0.8), b.y + py * (j ? -0.8 : 0.8))); desc = fast.length ? `후방 기습 — 본대는 앞, ${fast.map(u => u.name).join(' · ')}${jongE(fast[fast.length - 1].name) ? '은' : '는'} 뒤에서` : '후방 기습 — 본대는 앞 (뒤로 돌 빠른 근접이 없음)'; }
  else { const s = order(E), side = W.rand() < 0.5 ? -1 : 1, c = at2(6.5, side * 0.6); s.forEach((u, j) => put(u, c.x + px * side * (j - (s.length - 1) / 2) * 1.3, c.y + py * side * (j - (s.length - 1) / 2) * 1.3)); desc = '행군 중 조우 — 길게 늘어선 채 마주침'; }
  W.start = { k, desc }; L(W, { k: 'start', side: 1, s: k, desc, vis: true });
}

/* ---------- v6.0 짧은 역할 약속 (적 · 숙련된 용병): 두 명이 지금 교전이 끝날 때까지 역할을 이어 감 ----------
   pin    방패 · 큰 몸이 상대를 붙듦 → 다른 하나는 같은 정면을 두드리지 않고 그 상대의 측면 (붙든 쪽 반대) · 또는 둘레의 후열 (사수 · 구급) 을 위협
   block  동료가 내려치기 (근접 일격) 를 준비 → 다른 하나는 상대 뒤 (퇴로) 를 막음. 그동안 아무도 그 상대를 밀쳐 사거리 밖으로 보내지 않음
   press  궁수가 상대 사수 (총잡이) 를 겨눔 → 근접 하나가 궁수의 사선을 비켜 그 사수에게 다가가 압박 (방패 뒤로)
   screen 동료가 물러남 · 쫓기는 중 → 다른 하나 (방패 · 탱커 먼저) 가 쫓는 놈 앞을 막아 견제, 궁수면 쫓는 놈을 쏨
   지휘가 없어도 됨 (개인의 숙련) — 지휘관을 잃어도 둘씩 엄호하며 싸우고 물러나는 건 남음 */
const AI6 = (typeof process !== 'undefined' && process.env && process.env.AI6OFF) || '';   // ABLATION (시험용)
const PACT_T = { pin: 7, block: 2.5, press: 7, screen: 5, cover: 2.5 };
const pactFree = (W, u) => u.alive && !u.crawl && !u.pact && !u.shadow && !(u.warden && u.warden.on) && !u.supp && !u.pack && !u.stalk && (u.side === 1 ? (u.state === 'hunt' || u.state === 'search') : (!u.order && !u.ordPend && u.lretId == null && u.cls !== '치유' && (u.state === 'fight' || u.state === 'idle'))) && !(u.sq && u.sq.k === 'flank' && !u.sq.done) && W.t >= u.proneT && !u.kb && !(u.hp / u.max < 0.3 && u.bold < 0.5);   // v7.4 아군은 자동 전투 중인 몸만 (명령을 받은 · 받는 중인 쪽은 명령대로)
const engagedBy = (W, u, x) => W.units.some(f => f.alive && f.side !== u.side && f !== x && !isFar(f) && gap(u, f) < Math.max(u.rng, f.rng) + 0.3);
const retreating = u => u.alive && (/물러남|물러섬|후퇴|엄호 후퇴/.test(u.mood || '') || (u.side === 0 && !!u.order && (u.order.k === 'move' || u.order.k === 'lret')));   // v7.4 아군은 이동 · 전열 후퇴 명령으로 물러서는 동료도
function pactEnd(W, P, why){ W.pacts = (W.pacts || []).filter(q => q !== P); for (const i of [P.a, P.b]){ const v = W.units[i]; if (v && v.pact === P.id) v.pact = null; } L(W, { k: 'pactEnd', p: P.k, a: P.a, b: P.b, x: P.x, why, vis: W.units[P.a].side === 0 || !!(W.units[P.a].seenBy || W.units[P.b].seenBy) }); }
function pactMake(W, k, a, b, x, extra){ if (AI6.includes('k_' + k)) return null; if (b.side === 0 && x && x.side !== b.side && roeBlock(W, b, x, isFar(b) ? 'fire' : 'melee')) return null;   /* v7.13 교전 규칙이 막는 몸은 약속에 안 듦 */ const P = { id: (W.pactN = (W.pactN || 0) + 1), k, a: a.i, b: b.i, x: x.i, t0: W.t, until: W.t + PACT_T[k], badT: 0, ...(extra || {}) }; (W.pacts = W.pacts || []).push(P); a.pactLead = P.id; b.pact = P.id;
  L(W, { k: 'pact', p: k, a: a.i, b: b.i, x: x.i, r: P.rear != null ? P.rear : null, side: a.side, vis: a.side === 0 || !!(a.seenBy || b.seenBy) }); return P; }
// 약속이 아직 서 있나 (깨진 지 1.2초 넘으면 끝)
function pactHolds(W, P){
  const A = W.units[P.a], B = W.units[P.b], X = W.units[P.x];
  if (!A.alive || !B.alive || B.crawl || !X.alive) return '누가 쓰러짐';
  if (W.t > P.until) return '';
  if (engagedBy(W, B, P.k === 'pin' && P.rear != null ? W.units[P.rear] : X)) return '다른 상대에게 붙들림';
  let ok = true;
  if (P.k === 'pin') ok = gap(A, X) < Math.max(A.rng, X.rng) + 0.6 && (P.rear == null || W.units[P.rear].alive);
  else if (P.k === 'block') ok = (!!(A.act && A.act.k === 'atk' && A.act.b === X.i) || W.t - P.t0 < 0.4) && !(A.act && A.act.mode === 'sweep');
  else if (P.k === 'press') ok = A.target === X || !!(A.act && A.act.b === X.i);
  else if (P.k === 'screen') ok = retreating(A) && dist(X, A) < 5;
  else if (P.k === 'cover') ok = B.target === X;
  return ok ? null : '조건이 풀림';
}
function planPacts(W){
  for (const P of [...(W.pacts || [])]){ const w = pactHolds(W, P); if (w === null){ P.badT = 0; continue; } if (w === '' || w === '누가 쓰러짐' || w === '다른 상대에게 붙들림'){ pactEnd(W, P, w || '교전이 끝남'); continue; } P.badT += 0.5; if (P.badT >= 1.2) pactEnd(W, P, w); }
  for (const S of [1, 0]){ if (S === 0 && AI6.includes('apact')) continue;   // v7.4 아군 자동 전투도 약속을 맺음 (같은 규칙)
  const E = W.units.filter(e => e.alive && e.side === S && !e.crawl), known = f => S === 0 ? !!f.seenBy || E.some(e => fresh(W, e.sense[f.i], 1.5)) : E.some(e => canSee(W, e, f) || fresh(W, e.sense[f.i], 1.5));
  const free = E.filter(e => pactFree(W, e)), taken = new Set();
  const pickF = (cands, x, max) => cands.filter(f => !taken.has(f.i) && dist(f, x) < max && !engagedBy(W, f, x) && (!f.line || isFar(f))).sort((a, b) => dist(a, x) - dist(b, x))[0];   // 전열에 선 쪽은 줄을 지킴 (빠지면 틈) — 약속은 줄 밖의 몸이 맡음
  for (const A of E){
    if ((W.pacts || []).some(P => P.a === A.i)) continue;
    // screen: 물러나는 동료를 쫓는 놈
    if (retreating(A)){ const X = W.units.filter(f => f.alive && f.side !== A.side && !isFar(f) && known(f) && dist(f, A) < 4 && (focusOf(W, f) === A || dist(f, A) < 2)).sort((p, q) => dist(p, A) - dist(q, A))[0];
      if (X){ const F = pickF(free.filter(f => f !== A && (isFar(f) || f.bodyShield || (f.shield && !X.giant))).sort((p, q) => (q.shield || q.bodyShield ? 1 : 0) - (p.shield || p.bodyShield ? 1 : 0)), A, 5); if (F){ taken.add(F.i); pactMake(W, 'screen', A, F, X); continue; } } }   // 막아설 몸만 (방패 · 큰 몸, 거구 앞엔 큰 몸만) · 궁수는 쏨
    // block: 내려치기 준비 (근접 일격 · 남은 준비 0.25초 넘음)
    if (A.act && A.act.k === 'atk' && A.act.phase === 'wind' && !isFar(A) && A.act.mode !== 'sweep' && A.act.end - W.t > 0.25){ const X = W.units[A.act.b];   // 넓게 휘두르기 앞엔 서지 않음 (부채꼴)
      if (X && X.alive && X.side !== A.side && !X.giant){ const F = pickF(free.filter(f => f !== A && !isFar(f)), X, 2.5); if (F){ taken.add(F.i); pactMake(W, 'block', A, F, X); continue; } } }
    // pin: 방패 · 큰 몸이 맞붙어 붙듦
    if ((A.shield || A.bodyShield || A.role === '전선') && !isFar(A)){ const X = W.units.find(f => f.alive && f.side !== A.side && !isFar(f) && gap(A, f) < Math.max(A.rng, f.rng) + 0.4 && (focusOf(W, f) === A || A.target === f));
      if (X){ const F = pickF(free.filter(f => f !== A && !isFar(f) && !(f.shield && f.role === '전선')), X, 6);
        if (F){ const rear = W.units.filter(b => b.alive && b.side === X.side && (isFar(b) || iRec(W, S, b).tags.includes('구급')) && known(b) && dist(b, X) < 4.5 && dist(b, F) < 3.5 && !W.units.some(o => o.alive && o.side === A.side && !isFar(o) && gap(o, b) < o.rng + 0.3) && !W.units.some(o => o.alive && o.side === X.side && o !== b && !isFar(o) && segD(F, b.x, b.y, o) < o.r + F.r + o.rng)).sort((p, q) => dist(p, F) - dist(q, F))[0];   // 후열은 가는 길이 트였을 때만 (상대 근접 손이 닿는 길이면 측면으로)
          taken.add(F.i); pactMake(W, 'pin', A, F, X, { rear: rear ? rear.i : null }); continue; } } }
    // press: 궁수가 사수를 겨눔
    if (isFar(A) && !(W.stance[S] && W.stance[S].k === 'hold') && !(S === 1 && W.plan && W.plan.k === 'withdraw')){ const X = A.act && A.act.k === 'atk' ? W.units[A.act.b] : A.target; if (X && X.alive && X.side !== A.side && isFar(X)){ const F = pickF(free.filter(f => f !== A && !isFar(f) && f.role !== '전선' && !gunDanger(W, f, f.x, f.y)), X, 7); if (F){ taken.add(F.i); pactMake(W, 'press', A, F, X); continue; } } }   // 대치 (진형) 중 · 후퇴 중엔 안 함, 전선 (방패벽) 은 자리를 지킴
  }
  }   // v7.4 편마다
}
// 약속을 따르는 쪽의 움직임 (act2 에서, 싸움 판단보다 먼저). false = 보통 싸움으로 (손이 닿으면 치는 건 보통 판단)
function pactStep(W, u, dt){
  const P = (W.pacts || []).find(q => q.id === u.pact); if (!P){ u.pact = null; return false; }
  if (!isFar(u) && W.units.some(f => f.alive && f.side !== u.side && inReach(u, f) && openingOf(W, u, f))) return false;   // 손이 닿는 상대에게 틈이 보이면 그것부터 (약속은 다음)
  const A = W.units[P.a], X = W.units[P.x];
  if (P.k === 'pin'){
    const R = P.rear != null ? W.units[P.rear] : null, tg = R && R.alive ? R : X;
    u.target = tg; u.state = 'hunt';
    if (inReach(u, tg) || gap(u, tg) < u.rng + 0.25) return false;
    if (screenApproach(W, u, tg, dt)) return true;
    if (tg === X){   // 측면 · 뒤 자리: 붙든 쪽 반대편부터, 다른 상대의 손 · 거구 둘레 · 먼 길은 피함. 가 볼 만한 자리가 없으면 보통 싸움 (곁에서 같이 침)
      const base = Math.atan2(X.y - A.y, X.x - A.x), d = X.r + u.r + Math.min(u.rng, 0.25); let best = null, bs = -1e9;
      for (const da of [0, 0.6, -0.6, 1.2, -1.2, 1.8, -1.8]){ const a = base + da, px = X.x + Math.cos(a) * d, py = X.y + Math.sin(a) * d;
        if (boxRock(W, px, py, u.r * 0.9) || W.units.some(o => o.alive && o !== u && o !== X && Math.hypot(o.x - px, o.y - py) < o.r + u.r * 0.9)) continue;
        let s = -Math.abs(da) * 0.4 - Math.hypot(px - u.x, py - u.y) * 0.6;
        for (const f of W.units) if (f.alive && f !== X && f.side !== u.side && !isFar(f)){ const g = Math.hypot(f.x - px, f.y - py) - f.r - u.r; if (g < f.rng + 0.4) s -= 3; if (f.canSweep && g < 2) s -= 3; }
        for (const m of W.units) if (m.alive && m !== u && m.side === u.side && m.canSweep && Math.hypot(m.x - px, m.y - py) < 2.2) s -= 2;   // 제 편 거구의 휘두르기 둘레도 피함
        if (s > bs){ bs = s; best = { x: px, y: py }; } }
      if (!best || bs < -4 || Math.hypot(best.x - u.x, best.y - u.y) > 3) return false;
      setMood(W, u, '약속: 측면으로', X.i); goTo(W, u, best.x, best.y, dt); return true;
    }
    setMood(W, u, '약속: 후열 위협', tg.i); goTo(W, u, tg.x, tg.y, dt); return true;
  }
  if (P.k === 'block'){
    u.target = X; u.state = 'hunt';
    if (inReach(u, X) && sideOf(W, X, u) !== 'front') return false;   // 퇴로에 섰으면 등 · 옆을 침 (보통 판단 — 틈)
    const d = dist(A, X) || 1, px = X.x + (X.x - A.x) / d * (X.r + u.r + 0.12), py = X.y + (X.y - A.y) / d * (X.r + u.r + 0.12);
    if (rock(W.map, px, py) || W.units.some(o => o.alive && o !== u && o !== X && Math.hypot(o.x - px, o.y - py) < o.r + u.r * 0.8)) return false;
    setMood(W, u, '약속: 퇴로 막기', X.i);
    if (Math.hypot(px - u.x, py - u.y) > 0.12) goTo(W, u, px, py, dt); else { stop(u); u.fg = Math.atan2(X.y - u.y, X.x - u.x); }
    return true;
  }
  if (P.k === 'press'){
    u.target = X; u.state = 'hunt';
    if (gap(u, X) < u.rng + 0.6) return false;
    if (screenApproach(W, u, X, dt)) return true;
    const p = approachPt(W, u, X, Math.atan2(A.y - X.y, A.x - X.x), [1.3, -1.3, 0.9, -0.9, 1.9, -1.9]);   // 궁수의 사선 (궁수 쪽) 을 비켜 옆에서
    setMood(W, u, '약속: 사수 압박', X.i); goTo(W, u, p ? p.x : X.x, p ? p.y : X.y, dt); return true;
  }
  if (P.k === 'cover'){ u.target = X; u.state = 'hunt'; return false; }   // 궁수: 쫓는 놈을 쏨 (보통 사격 판단)
  if (P.k === 'screen'){
    u.target = X; u.state = 'hunt';
    if (isFar(u)) return false;   // 궁수는 쫓는 놈을 쏨 (보통 싸움 — 대상만 바꿈)
    if (gap(u, X) < u.rng + 0.15) return false;
    const d = dist(X, A) || 1, px = X.x + (A.x - X.x) / d * (X.r + u.r + 0.2), py = X.y + (A.y - X.y) / d * (X.r + u.r + 0.2);
    if (rock(W.map, px, py)) return false;
    setMood(W, u, '약속: 추격 견제', X.i); goTo(W, u, px, py, dt); u.fg = Math.atan2(X.y - u.y, X.x - u.x); return true;
  }
  return false;
}

// v5.2 쓰러진 [불사] 를 눌러 둠 (굴 3D maim.js: 확인사살은 재생만 늦춤): 둘레 3칸에 싸울 상대가 없으면 쓰러진 [불사] 곁으로 가서 치며 일어나지 못하게 함 (한 명만).
// 눌린 [불사] 만 남으면 그 편은 짐 (checkEnd)
function pinDown(W, u, dt){
  const was = u.pinning; u.pinning = null;
  if (isFar(u) || u.crawl || u.act) return false;
  if (W.units.some(f => f.alive && f.side !== u.side && dist(f, u) < (was != null ? 1.6 : 3))) return false;   // 이미 가는 중이면 더 가까이 와야 그만둠 (들락날락 없음)
  const d = W.units.filter(f => f.down && !f.alive && f.side !== u.side && dist(f, u) < 7 && !W.units.some(o => o.alive && o !== u && o.side === u.side && o.pinning === f.i)).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (!d) return false;
  u.pinning = d.i;
  if (was !== d.i && W.t - (u.pinGoT == null ? -9 : u.pinGoT) > 4){ u.pinGoT = W.t; L(W, { k: 'pinGo', a: u.i, b: d.i, vis: u.side === 0 || !!u.seenBy }); }
  if (gap(u, d) > u.rng + 0.2){ setMood(W, u, '확인사살', d.i); goTo(W, u, d.x, d.y, dt); return true; }
  stop(u); u.fg = Math.atan2(d.y - u.y, d.x - u.x); setMood(W, u, '확인사살', d.i);
  if (W.t - (u.pinHitT == null ? -9 : u.pinHitT) >= u.wind + u.rec){
    // v5.5.1 칠 때마다 피를 깎음 (공격 × pinHit) — 재생보다 빨리 깎으면 계속 못 일어남
    const dm = Math.max(1, Math.round(u.atk * u.atkMul * (W.rules.lethal || 1) * ((W.rules.undying || {}).pinHit != null ? W.rules.undying.pinHit : 0.5)));
    const hp0 = d.hp; u.pinHitT = W.t; d.pinnedT = W.t; d.hp = Math.max(0, d.hp - dm);
    const rk = hp0 > 0 && d.hp <= 0; if (rk) d.reKills = (d.reKills || 0) + 1;   // v5.5.2 게이지를 바닥까지 = 다시 죽임 (몇 번이고)
    L(W, { k: 'pinDown', a: u.i, b: d.i, dmg: dm, hp: Math.round(d.hp), need: Math.round(d.max * undMove(W)), rekill: rk, n: d.reKills || 0, vis: true });
    if (W.fxOn) W.fx.push({ k: 'slash', a: u.i, b: d.i, t0: W.t });
  }
  return true;
}
// 떼어 낼 상대인가: f 가 u 편의 약한 동료 (사수 · 구급 · 다친 · 넘어진 · 눌린 [불사]) 에게 붙어 있으면 그 동료
const peelOf = (W, u, f) => { if (f.pinning != null && W.units[f.pinning] && W.units[f.pinning].side === u.side) return W.units[f.pinning]; if (isFar(f)) return null; const v = focusOf(W, f); return v && v !== u && v.side === u.side && v.alive && gap(f, v) < 1.2 && (isFar(v) || (v.skill && v.skill.kit) || v.hp / v.max < 0.4 || prone(W, v)) ? v : null; };

/* ---------- 한 순간 (dt 초) 의 움직임 · 공격 ---------- */
function doOrder(W, u, dt){
  const o = u.order, foes = W.units.filter(f => f.alive && f.side !== u.side);
  if (o.k === 'frally'){ u.order = null; u.fdet = false; u.stay = null; setMood(W, u, '대형으로'); L(W, { k: 'frallyOk', a: u.i, vis: true }); return; }   /* v8.7.5 모여 */
  if (o.k === 'swap'){ invOrder(W, u, o); return; }
  if (o.k === 'inv'){ invOp(W, u, o, dt); return; }   /* v8.7.6 싸우는 중 장비 (입기 · 벗기 · 건네기 · 내려놓기) */
  if (o.k === 'alt'){ u.order = null; if (u.act && u.act.phase === 'wind' && u.act.k !== 'charge') u.act = null; if (!u.act && !startAlt(W, u, '명령')) L(W, { k: 'miss', a: u.i, why: '바꿔 들 총이 없음', vis: u.side === 0 }); return; }   /* v7.25.1 */
  if (o.k === 'exit'){ exitStep(W, u, o, dt); return; }   // v7.21 맵 끝으로   // v7.20 가방의 무기 · 방패를 꺼내 듦
  if (o.via && !o.viaOK && ['move', 'amove', 'attack', 'palm', 'charge'].includes(o.k) && viaStep(W, u, o, dt)) return;   // v7.12 우회 경유점   // v7.15 팜 버스트 · 돌진도
  if (o.k === 'amove'){
    // v5.2 공격 이동 (판의 바닥을 왼쪽 클릭): 그 자리로 가며, 가는 길에 보이는 상대 (근접은 stayLeash 칸, 사수는 사거리 + 1.5칸 안) 와 스스로 싸움.
    // 다 쓰러뜨리거나 안 보이면 다시 감. 도착하면 그 자리를 지킴 (자동)
    const lim = isFar(u) ? u.rng + 1.5 : rv(W, 'stayLeash', 4);
    const seen = foes.filter(f => canSee(W, u, f) && dist(u, f) <= lim).sort((a, b) => (prone(W, b) ? 1 : 0) - (prone(W, a) ? 1 : 0) || dist(u, a) - dist(u, b));
    if (seen.length){
      const t = u.target && u.target.alive && seen.includes(u.target) ? u.target : seen[0];
      if (u.target !== t) u.waitT = 0; u.target = t; u.state = 'fight';
      fight(W, u, t, dt, true, false); return;
    }
    if (Math.hypot(u.x - o.x, u.y - o.y) < 0.15){ L(W, { k: 'arrive', a: u.i }); u.order = null; u.stay = { x: o.x, y: o.y }; stop(u); return; }
    if (formWait(W, u)){ stop(u); u.fg = Math.atan2(o.y - u.y, o.x - u.x); setMood(W, u, '대형을 기다림'); return; }   /* v8.7.5 공세선 */
    setMood(W, u, '공격 이동'); setGoal(W, u, o.x, o.y); follow(W, u, dt);
    if (!u.path){ L(W, { k: 'stuck', a: u.i }); u.order = null; u.stay = { x: u.x, y: u.y }; }
    return;
  }
  if (o.k === 'charge'){
    // v5.5.3 돌진 명령 = "정한 곳으로 돌격!!": 찍은 적 (또는 바닥 자리) 쪽으로 곧장 — 예고 (charge.wind) 뒤 바로 달림. 길을 찾아 돌지 않고 아군 사이는 비집고 나감.
    // 바위가 길을 막거나 너무 멀면 (charge.maxOrd 칸 넘게) 트이는 · 닿는 데까지 걸어감. 다시 쓰기 전이면 그 자리에서 노려보며 기다림.
    // 지휘관을 믿고 뜀 (v5.5.2): 내가 못 봐도 동료가 보면 그대로, 아무도 못 보면 마지막으로 본 자리로 뜀. 이미 붙어 있으면 그냥 공격. 12초가 지나도 못 뛰면 그냥 공격
    const C = W.rules.charge || {}, pt = o.b == null, t = pt ? null : W.units[o.b];
    if (!u.canCharge || u.crawl || (!pt && (!t || !t.alive))){ u.order = null; return; }
    if (o.t0 == null) o.t0 = W.t;
    const toAtk = why => { if (pt){ u.order = null; u.stay = { x: u.x, y: u.y }; return; } if (why) L(W, { k: 'lost', a: u.i, b: t.i, why }); u.order = { k: 'attack', b: t.i }; u.last = { x: t.x, y: t.y }; };
    let tx = pt ? o.x : 0, ty = pt ? o.y : 0, known = pt;
    if (!pt){
      known = canSee(W, u, t) || (u.side === 0 ? !!t.seenBy : fresh(W, u.sense[t.i], 1));
      if (known) u.last = { x: t.x, y: t.y };
      const lp = known ? t : (u.last || t); tx = lp.x; ty = lp.y;
      // v5.8.6 돌격할 거리 (charge.min) 가 안 됨 (붙어 있어도) → 돌진이 아니라 밀치기: 다가가 방패 (없으면 몸 · 어깨) 로 밀침. 돌진 대기는 쓰지 않음 (밀치기 대기만, 아직이면 그냥 공격)
      if (known && gap(u, t) < (C.min || 1.5) && !o.near){ o.near = true; L(W, { k: 'tooClose', a: u.i, b: t.i, gap: +gap(u, t).toFixed(1), vis: u.side === 0 || !!u.seenBy }); }
      if (o.near){
        if (!known){ toAtk('보이지 않음'); return; }
        if (gap(u, t) > (C.min || 1.5) + 0.8) o.near = false;   // 다시 멀어지면 (상대가 물러남) 돌진으로
        else if (W.t < u.bashCd || u.act || W.t < u.brokenT){ toAtk(''); return; }   // v5.8.9 자세가 무너졌으면 밀치지 못하고 그냥 침
        else if (gap(u, t) <= 0.35){ startBash(W, u, t, '돌진하기엔 가까움', !u.canBash); u.order = { k: 'attack', b: t.i }; return; }
        else { setMood(W, u, '밀치러', t.i); goTo(W, u, t.x, t.y, dt); return; }
      }
      if (known && gap(u, t) < 0.5){ toAtk(''); return; }   // 이미 붙음 → 그냥 공격
    }
    const d = Math.hypot(tx - u.x, ty - u.y);
    if (d < 0.4){ toAtk(''); return; }
    if (W.t - o.t0 > 12){ toAtk('돌진 길이 안 열림'); return; }
    const clear = fatClear(W.map, u.x, u.y, tx, ty, u.r * 0.9), far = d > (C.maxOrd || 8);
    if (W.t >= u.chargeCd && clear && !far && !u.kb && W.t >= u.proneT && W.t >= u.brokenT){   // v5.8.9 자세가 무너지면 추스를 때까지 못 뜀
      if (!pt && known) startCharge(W, u, t, null); else startCharge(W, u, null, { x: tx, y: ty });   // 아무도 못 보면 마지막으로 본 자리로
      if (pt){ u.order = null; u.stay = { x: tx, y: ty }; } else u.order = { k: 'attack', b: t.i };
      return;
    }
    if (!clear || far){ setMood(W, u, clear ? '돌진 거리로' : '돌진 길 트기', t ? t.i : null); goTo(W, u, tx, ty, dt); return; }
    stop(u); u.fg = Math.atan2(ty - u.y, tx - u.x);
    if (W.t < u.brokenT){ setMood(W, u, '자세를 추스름', t ? t.i : null); if (!o.brokeNote){ o.brokeNote = true; L(W, { k: 'chargeWait', a: u.i, b: t ? t.i : null, why: '자세 무너짐', sec: +(u.brokenT - W.t).toFixed(2), vis: u.side === 0 || !!u.seenBy }); } return; }
    setMood(W, u, u.chargeName + ' 준비', t ? t.i : null); return;   // 다시 쓸 때를 기다림
  }
  if (o.k === 'leap'){
    // v6.7.4 도약 명령: 찍은 바닥 · 적 쪽으로 (앞 · 옆 · 뒤 어디든). 대기 중이면 기다렸다 뜀. 자리가 없는 예전 명령은 가장 가까이 보이는 적에게서 뒤로
    if (!u.canLeap || u.crawl){ u.order = null; return; }
    if (W.t < u.leapCd){ stop(u); setMood(W, u, '도약 준비'); return; }
    const t = o.b != null ? W.units[o.b] : null;
    if (o.b != null){ u.order = null; if (t && t.alive){ const p = leapIn(u, t); if (!leapTo(W, u, p.x, p.y, 'fwd', t, '명령')) L(W, { k: 'stuck', a: u.i }); } return; }
    if (o.x != null){ u.order = null; if (leapTo(W, u, o.x, o.y, leapDir(W, u, o.x, o.y), null, '명령')) u.stay = { x: u.act.tx, y: u.act.ty }; else L(W, { k: 'stuck', a: u.i }); return; }
    const f = foes.filter(f => canSee(W, u, f)).sort((a, b) => dist(u, a) - dist(u, b))[0];
    u.order = null; if (f) startLeap(W, u, f);
    return;
  }
  if (o.k === 'scout'){ scoutStep(W, u, dt); return; }   // v7.5 정찰
  if (o.k === 'sac'){ sacStep(W, u, dt); return; }
  if (o.k === 'flank'){ flankOrder(W, u, dt); return; }   // v7.9.4 측면 기동   // v7.9.1 희생 돌격
  if (o.k === 'torchGet'){ torchGetStep(W, u, dt); return; }   // v7.8.5 횃불 가져오기
  if (o.k === 'assn'){ assnOrder(W, u, dt); return; }   // v7.6 암살
  if (o.k === 'supp'){ suppStep(W, u, dt, o, () => { u.order = null; u.stay = { x: u.x, y: u.y }; }); return; }   // v7.7 견제사격
  if (o.k === 'flare'){ flareStep(W, u, dt, o, () => { u.order = null; u.stay = { x: u.x, y: u.y }; }); return; }   // v7.8 횃불 던지기
  if (o.k === 'lret'){ if (!lretStep(W, u, dt)) u.order = null; return; }   // v7.2 전열 조직 후퇴 (전열 모두가 같은 명령)
  if (o.k === 'line' && o.join){ if (joinStep(W, u, dt) !== 'hold') return; }   // v5.9.3 전열 참여   /* v7.24.3 지원은 자리에서 제자리처럼 */
  if (o.k === 'line' && !o.join){
    // v5.7 전열 명령: 제 마디 자리로 가서 그쪽을 보고 섬 (자석처럼 나란히). 손 닿는 상대만 침 — 자리를 지킴 (막기는 자동 · 유지 그대로)
    const d = Math.hypot(o.x - u.x, o.y - u.y);
    if (d > 0.15){ setMood(W, u, '전열로'); setGoal(W, u, o.x, o.y); follow(W, u, dt); if (!u.path && d > 0.6){ L(W, { k: 'stuck', a: u.i }); u.order = { k: 'hold' }; } return; }
    stop(u); u.fg = o.f;
    const rch = W.units.filter(f => f.alive && f.side !== u.side && canSee(W, u, f) && gap(u, f) <= u.rng + 0.05).sort((a, b) => dist(u, a) - dist(u, b));
    const t = rch.find(f => angDiff(o.f, Math.atan2(f.y - u.y, f.x - u.x)) < 1.4) || rch.find(f => !lineCover(W, u, f));   // 앞의 상대 먼저 · 옆 · 뒤는 가려 주는 마디가 없을 때만 돌아섬
    if (t){ u.target = t; const bw = bashWhy(W, u, t); if (bw) startBash(W, u, t, bw); else startAct(W, u, t, '전열'); return; }
    setMood(W, u, '전열'); return;
  }
  if (o.k === 'move'){
    // 도착 → 자동 (그 자리를 지키며 스스로 판단)
    if (Math.hypot(u.x - o.x, u.y - o.y) < 0.12){ L(W, { k: 'arrive', a: u.i }); u.order = null; u.stay = { x: o.x, y: o.y }; stop(u); return; }
    if (formWait(W, u)){ if (o.pc) o.pc.t = W.t; stop(u); u.fg = Math.atan2(o.y - u.y, o.x - u.x); setMood(W, u, '대형을 기다림'); return; }   /* v8.7.5 공세선 */
    { const d0 = Math.hypot(u.x - o.x, u.y - o.y), pc = o.pc || (o.pc = { t: W.t, d: d0 });   /* v7.26.1 막힘: 끝자리가 차 있으면 가까이서 멈춘 채 도착 · 멀리서 막히면 길을 다시 */
      if (pc.d - d0 > 0.08){ pc.t = W.t; pc.d = d0; }
      else if (d0 < 1.2 && W.t - pc.t > 0.8){ L(W, { k: 'arrive', a: u.i, near: +d0.toFixed(2) }); u.order = null; u.stay = { x: u.x, y: u.y }; stop(u); return; }
      else if (W.t - pc.t > 1.5){ pc.t = W.t; pc.d = d0; u.goal = null; u.path = null; L(W, { k: 'repath', a: u.i, d: +d0.toFixed(1) }); } }
    setMood(W, u, '이동');
    setGoal(W, u, o.x, o.y); follow(W, u, dt);
    if (!u.path){ L(W, { k: 'stuck', a: u.i }); u.order = null; u.stay = { x: u.x, y: u.y }; }
    return;
  }
  if (o.k === 'spec'){   // v7.19.1 고유 기술 명령: 닿으면 바로 · 대기 중이면 붙어 싸우며 기다림 · 아니면 다가감
    const sp = specOf(u, o.s), t = o.b != null ? W.units[o.b] : null;
    if (!sp){ u.order = null; return; }
    if (o.s === 'sweep' && flailOf(W, u) && tightAt(W, u)){ u.order = null; setMood(W, u, '좁은 골목 — 철퇴를 돌릴 수 없음'); L(W, { k: 'alleyNo', a: u.i, s: 'sweep', vis: u.side === 0 || !!u.seenBy }); return; }   /* v8.7.5 A6 */
    if (o.s === 'pfort'){ const x = specOf(u, 'pfort'); if (x && W.t < x.cdT){ setMood(W, u, '쥐 방진 대기 (' + (x.cdT - W.t).toFixed(1) + '초)'); stop(u); return; } if (!prFort(W, u, '명령')) L(W, { k: 'specFail', a: u.i, s: 'pfort', why: '곁에 쥐가 둘은 있어야', vis: true }); u.order = null; return; }   /* v8.7.8 쥐 방진 (제자리) */
    if (o.s === 'sweep' || o.s === 'ward'){ if (specReady(W, u, o.s)){ startSpec(W, u, null, o.s, '명령'); if (o.R) u.act.R = o.R; u.order = null; }   /* v7.24.4 정한 거리 */ else setMood(W, u, sp.name + ' 대기' + (sp.cdT > W.t ? ' (' + (sp.cdT - W.t).toFixed(1) + '초)' : flailOut(W, u) ? ' (철퇴를 거두는 중)' : '')); return; }   // v7.19.2 역장도 바로   /* v8.7.3 대기 초 */
    if (o.s === 'root'){ const px = o.x != null ? o.x : t && t.alive ? t.x : null, py = o.y != null ? o.y : t && t.alive ? t.y : null; if (px == null){ u.order = null; return; }   // v7.19.2 뿌리 벽: 찍은 자리 (적이면 그 앞)
      const d = Math.hypot(px - u.x, py - u.y), R2 = SPR(W, 'root').rng || 5;
      if (specReady(W, u, 'root') && d <= R2){ startSpec(W, u, null, 'root', '명령'); const k2 = o.b != null && d > 1.5 ? (d - 1.2) / d : 1; u.act.px = u.x + (px - u.x) * k2; u.act.py = u.y + (py - u.y) * k2; u.order = null; return; }
      if (d > R2){ setMood(W, u, '뿌리 벽 자리로'); goTo(W, u, px, py, dt); return; } setMood(W, u, '뿌리 벽 대기'); return; }
    if (o.s === 'flip' && o.x != null){ if (specReady(W, u, 'flip')){ if (!startFlip(W, u, null, true, o.x, o.y)){ L(W, { k: 'specFail', a: u.i, s: 'flip', why: '내려앉을 자리가 막힘', vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y - 0.35, s: '막힘 — 못 뜀', c: 'm', t0: W.t }); } u.order = null; } else setMood(W, u, '공중제비 대기 (' + Math.max(0, specOf(u, 'flip').cdT - W.t).toFixed(1) + '초)'); return; }   /* v8.7.3 막히면 알림 · 대기 초 */
    if (!t || !t.alive){ u.order = null; return; }
    const see = canSee(W, u, t); if (!see && !(u.side === 0 ? t.seenBy : false)){ L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return; }
    if (o.s === 'asup' && gap(u, t) <= (APR(W).min || 5)){ L(W, { k: 'specFail', a: u.i, s: 'asup', why: (APR(W).min || 5) + '칸 안 — 초돌진은 멀리 떨어진 적에게만', vis: true }); u.order = { k: 'attack', b: t.i }; return; }   /* v8.7.8 */
    if (o.s === 'head'){ if (specReady(W, u, 'head')){ u.headMark = { b: t.i, until: W.t + (SPR(W, 'head').win || 4) + 3 }; L(W, { k: 'specArm', a: u.i, b: t.i, s: 'head', vis: true }); } u.order = { k: 'attack', b: t.i }; return; }
    const S = SPR(W, o.s), reach = o.s === 'flip' ? S.d || 3.2 : o.s === 'pb' ? S.rng || 2.4 : S.rng || 3.6;
    if (specReady(W, u, o.s) && gap(u, t) <= reach && (o.s === 'flip' ? startFlip(W, u, t, false) : GW_K.includes(o.s) ? gwStart(W, u, t, o.s, '명령') : o.s === 'pmark' ? prnMark(W, u, t, '명령') : o.s === 'asup' ? apSup(W, u, t, '명령') : startSpec(W, u, t, o.s, '명령'))){ u.order = null; return; }   /* v8.7.8 굿윌 기술은 굿윌 방식으로 (내려찍기 = 뛰어오름 · 손바닥 = 표식 · 니킥 = 반동) */
    if (!specReady(W, u, o.s) && gap(u, t) <= u.rng + 0.3){ setMood(W, u, sp.name + ' 대기' + (sp.cdT > W.t ? ' (' + (sp.cdT - W.t).toFixed(1) + '초)' : ''), t.i); fight(W, u, t, dt, see, true); return; }
    setMood(W, u, sp.name + '하러', t.i); goTo(W, u, t.x, t.y, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x); return;
  }
  if (o.k === 'palm'){   // v6.7 팜 버스트 명령: 그 상대에게 붙어 손바닥을 댐 (대기 중이면 붙어 싸우며 기다림)
    const t = W.units[o.b];
    if (!t || !t.alive || !u.palm || u.noArms){ u.order = null; return; }
    const see = canSee(W, u, t);
    if (!see && !(u.side === 0 ? t.seenBy : false)){ L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return; }
    if (see && palmReady(W, u) && gap(u, t) <= PALM(W).reach){ startPalm(W, u, t, '팜 버스트'); u.order = null; return; }   // v6.7.3 몸이 닿아야 씀
    if (see && !palmReady(W, u) && gap(u, t) <= u.rng + 0.3){ setMood(W, u, '팜 버스트 준비', t.i); fight(W, u, t, dt, see, true); return; }   // 대기 중엔 단검으로 싸우며 기다림
    if (see && palmReady(W, u) && u.cls === '기동' && u.canCharge && tryCharge(W, u, t, true)) return;   // v7.12 팜 버스트하러 갈 때 돌격이 있으면 씀
    if (palmReady(W, u) && gap(u, t) < (PALM(W).dashD || 1.4)){ if (W.t >= (u.lungeT == null ? -9 : u.lungeT) + 0.5) L(W, { k: 'palmDash', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); u.lungeT = W.t + 0.15; u.lungeK = PALM(W).dash || 2; }   /* v7.17 마지막 순간 ×2 로 들러붙음 */
    setMood(W, u, gap(u, t) < 0.8 ? '바싹 파고듦' : '팜 버스트하러', t.i); goTo(W, u, t.x, t.y, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x); return;   // 단검 거리에서 한 걸음 더 — 몸이 닿을 때까지
  }
  if (o.k === 'throw'){
    // 투창 명령: 사거리 안 · 사선이 열리면 던짐 (방패에 막혀도), 아니면 다가감. 창이 없으면 자동
    const t = W.units[o.b];
    if (!t || !t.alive || !u.jav || !u.spearHeld){ u.order = null; return; }
    const see = canSee(W, u, t);
    // v5.4.3 명령은 창이 손을 떠날 때까지 유지 (던지는 순간 동료가 사선에 끼어 멈추면 비켜서 다시). 네 번 겨눠도 못 던지면 그만둠
    if ((o.n || 0) >= 4){ L(W, { k: 'lost', a: u.i, b: t.i, why: '사선이 안 열림' }); u.order = null; return; }
    if (see && javOdds(W, u, t, u.x, u.y, o.now ? true : 'calm')){ startThrow(W, u, t, isKnife(W, u) ? '투척' : '투창', true); o.n = (o.n || 0) + 1; return; }
    // v5.4.3 내가 못 봐도 동료가 보고 있으면 (아군) 보일 때까지 다가감. 아무도 못 보면 놓침
    if (!see && !(u.side === 0 ? t.seenBy : false)){ L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return; }
    if (see && gap(u, t) <= JVu(W, u).rng + 0.5 && tryThrow(W, u, t, o.now ? true : 'calm', dt)) return;   // 사선이 막혔으면 옆으로 비켜 사선을 찾음
    if (see && gap(u, t) <= u.rng + 0.3){ L(W, { k: 'ordSwap', a: u.i, b: t.i, from: 'throw', to: 'attack', why: '너무 가까움 — 그냥 찌름', vis: u.side === 0 }); u.order = { k: 'attack', b: t.i }; return; }   // 너무 가까움 → 그냥 찌름   /* v8.7.3 알림 */
    setMood(W, u, isKnife(W, u) ? '투척 거리로' : '투창 거리로', t.i); goTo(W, u, t.x, t.y, dt); return;
  }
  if (o.k === 'attack'){
    const t = W.units[o.b];
    if (!t || !t.alive){ u.order = null; if (u.stay && Math.hypot(u.stay.x - u.x, u.stay.y - u.y) > 4) u.stay = { x: u.x, y: u.y }; return; }   // 상대가 쓰러지면 자동   // v7.13 옛 자리가 멀면 (4칸 넘게) 지금 자리를 지킴
    const see = canSee(W, u, t);
    if (see) u.last = { x: t.x, y: t.y };
    else if (!u.last || Math.hypot(u.x - u.last.x, u.y - u.last.y) < 0.3){ L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return; }
    fight(W, u, t, dt, see, true);
    return;
  }
  if (o.k === 'pick' && o.id != null){   // v5.6 떨어진 물건 줍기 (명령이면 둘레가 위험해도)
    const it = W.items.find(x => x.id === o.id);
    if (!it || !canTake(W, u, it)){ if (it) L(W, { k: 'pickFail', a: u.i, name: it.name, vis: true }); u.order = null; return; }
    if (Math.hypot(it.x - u.x, it.y - u.y) <= 0.6){ takeItem(W, u, it); u.order = null; u.stay = { x: u.x, y: u.y }; return; }
    setMood(W, u, it.name + ' 주우러'); goTo(W, u, it.x, it.y, dt); return;
  }
  if (o.k === 'pick' && o.spear){   // 던진 창 줍기 (명령이면 둘레가 위험해도)
    if (!retrieveSpear(W, u, dt, true)){ u.order = null; } else if (u.spearHeld) u.order = null;
    return;
  }
  if (o.k === 'pick'){
    // 횃불 줍기: 떨어진 횃불 자리로 가서 주워 듦
    const tc = nearTorch(W, u, 99, o);
    if (!tc){ u.order = { k: 'hold' }; return; }
    if (Math.hypot(tc.x - u.x, tc.y - u.y) <= 0.7){ pickTorch(W, u, tc); u.order = null; u.stay = u.stay || { x: u.x, y: u.y }; return; }
    setMood(W, u, '횃불 줍기'); goTo(W, u, tc.x, tc.y, dt); return;
  }
  if (o.k === 'skill'){
    // 기술 명령: 그 동료에게 가서 한 번 씀 (체력이 가득이면 아낌). 쓴 뒤엔 제자리
    const t = W.units[o.b], K = u.skill;
    if (!K || !t || !(t.alive || (K.kit && t.down)) || K.left <= 0){ u.order = { k: 'hold' }; return; }
    if (t.alive && t.hp >= t.max - 0.5 && !t.bleed){ L(W, { k: 'skillSkip', a: u.i, b: t.i }); u.order = null; return; }
    if (K.kit && W.t < K.cdT){ setMood(W, u, '구급상자 준비', t.i); if (gap(u, t) > K.rng) goTo(W, u, t.x, t.y, dt); else stop(u); return; }
    if (t === u || gap(u, t) <= K.rng){ startSkill(W, u, t, false); return; }   // 명령은 붓기에 성공한 뒤에 끝남 (빗나가면 다시 다가가 부음)
    setMood(W, u, '치유하러', t.i); goTo(W, u, t.x, t.y, dt); return;
  }
  if (o.k === 'hold' || o.k === 'watch' || (o.k === 'line' && o.join)){   // v7.7 사주경계   /* v7.24.3 전열 지원 (자리에 섬) */ = 제자리 + 정한 바깥쪽을 봄 (자주 돌아봄)
    // 제자리 = 지키는 자세: 움직이지 않고, 손 닿는 · 사거리 안 상대를 기회가 있을 때 침
    stop(u);
    if (u.cls === '치유'){
      const need = (u.healPol || (W.rules.heal || {}).pol || 'dying') === 'free' ? 1 : (u.healPol || (W.rules.heal || {}).pol || 'dying') === 'order' ? 9 : 2;   // v7.9
      const h = W.units.filter(a => a.alive && a.side === u.side && healTier(W, u, a, W.rules.healAt) >= need && gap(u, a) <= u.rng).sort((a, b) => a.hp / a.max - b.hp / b.max)[0];
      if (h){ startAct(W, u, h); return; }
    }
    const seen = foes.filter(f => canSee(W, u, f) && !roeBlock(W, u, f, isFar(u) ? 'fire' : 'melee')).sort((a, b) => dist(u, a) - dist(u, b));   // v7.9
    if (!isFar(u)){
      const t = seen.filter(f => inReach(u, f)).sort((a, b) => (openingOf(W, u, b) ? 1 : 0) - (openingOf(W, u, a) ? 1 : 0) || a.hp - b.hp)[0];
      if (t){ const op = openingOf(W, u, t); if (op || W.rand() < dt * u.bold * 0.6){ startAct(W, u, t, op === '틈' ? '틈을 노림' : op === '측면' ? '측면 공격' : '공격'); return; } u.waitT += dt; }
      if (o.k === 'watch' && !t){ u.fg = o.f; setMood(W, u, '사주경계'); return; }
      setMood(W, u, seen.length ? '지킴' : '', seen[0] ? seen[0].i : null);
      return;
    }
    if (needReload(u)){ startReload(W, u); return; }
    const know = knows(W, u);
    let ffBlock = null;
    for (const t of seen){
      if (gap(u, t) > u.rng || !losClear(W.map, u.x, u.y, t.x, t.y)) continue;
      const f = firstOnLine(W, u, t, u, know);
      if (f !== t){ if (f.side === u.side) ffBlock = f; continue; }
      const ff = ffOdds(W, u, t, u.x, u.y); if (ff.p > ffLim(u, W)){ ffBlock = ff.who || t; continue; }
      if (aimP(W, u, t) >= shootTh(W, u, t)){ startAct(W, u, t, t.act ? '틈을 노림' : '공격'); return; }
    }
    if (seen.length){ u.waitT += dt; if (ffBlock) setMood(W, u, '사선에 아군', ffBlock.i); else setMood(W, u, '지킴', seen[0].i); } else if (o.k === 'watch'){ u.fg = o.f; setMood(W, u, '사주경계'); } else setMood(W, u, '');
  }
}
// 떨어진 (내려놓은) 횃불 중 가장 가까운 것. o 가 있으면 그 자리 근처의 것
function nearTorch(W, u, far, o){
  let b = null, bd = far;
  for (const t of W.torches){ if (!t.dropped) continue; const d = o ? Math.hypot(t.x - o.x, t.y - o.y) + Math.hypot(t.x - u.x, t.y - u.y) * 0.01 : Math.hypot(t.x - u.x, t.y - u.y); if (d < bd){ bd = d; b = t; } }
  return b;
}
function pickTorch(W, u, tc){
  W.torches = W.torches.filter(t => t !== tc); u.torch = true; u.torchOff = !!tc.off; computeLight(W);
  L(W, { k: 'torchPick', a: u.i, x: +tc.x.toFixed(2), y: +tc.y.toFixed(2) });
}
function faceTo(u, t){ if (t) u.fg = Math.atan2(t.y - u.y, t.x - u.x); }
// 돌아서기: 바라볼 방향 (fg) 쪽으로 초당 turnRate 도씩
function turnTo(W, u, dt){
  if (u.fg == null) return;
  let d = (u.fg - u.face) % (2 * Math.PI); if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
  const m = (W.rules.turnRate || 300) * Math.PI / 180 * dt * turnMul(W, u);   // v5.3 무거울수록 천천히
  u.face = Math.abs(d) <= m ? u.fg : u.face + Math.sign(d) * m;
}
// 방어 자세가 있는 쪽이 볼 곳: 나 · 가까운 아군을 겨누는 사수 > 나를 치려는 상대
function dangerOf(W, u){
  const know = knows(W, u);
  const sh = W.units.filter(e => e.alive && e.side !== u.side && isFar(e) && e.act && e.act.k === 'atk' && know(e) && W.units[e.act.b] && W.units[e.act.b].side === u.side && dist(W.units[e.act.b], u) < 2.5).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (sh) return sh;
  const m = W.units.filter(e => e.alive && e.side !== u.side && know(e) && e.act && e.act.b === u.i).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (m) return m;
  // 위협: 2.5칸 안에서 나나 곁의 동료를 노리는 근접 상대 (가장 가까운 쪽을 막음 — 둘이면 한쪽을 골라야 함)
  const wd = W.ward && W.ward[u.side] != null ? W.units[W.ward[u.side]] : null, wn = (W.rules.ward || {}).near || 3;   // v5.7 지킬 사람을 노리는 상대도 위협
  return W.units.filter(e => e.alive && e.side !== u.side && know(e) && !isFar(e) && dist(e, u) < 2.5 && (() => { const f = focusOf(W, e); return f && (f === u || (f.side === u.side && dist(f, u) < (f === wd ? wn : 1.6))); })()).sort((a, b) => dist(u, a) - dist(u, b))[0] || null;
}
function act(W, u, dt){
  if ((u.karKit || u.modBody) && karTick(W, u, dt)) return;   /* v8.7.8 근성 (발버둥 · 포효 동안은 아무것도 못 함) · 불경자 · 벼락 */
  if (u.h2) h2Tick(W, u);   /* v8.7.4 2페이즈 */
  if (u.stoneT != null && W.t >= u.stoneT){ u.stoneT = null; L(W, { k: 'stoneOff', a: u.i, vis: u.side === 0 || !!u.seenBy }); }   /* v8.7.4 방어모드 풀림 */
  if (u.heldBy != null){ const g = W.units[u.heldBy], A = g && g.act; if (g && g.alive && A && A.k === 'spec' && A.s === 'tear' && A.phase === 'run' && A.held === u.i){ const a = g.face || 0, D = g.r + u.r + 0.02; u.x = g.x + Math.cos(a) * D; u.y = g.y + Math.sin(a) * D; stop(u); u.act = null; u.burst = null; u.vx = u.vy = 0; return; } if (g && g.alive && A && A.k === 'spec' && A.s === 'kgrab' && A.held === u.i && karHeld(W, g, u, dt)) return; u.heldBy = null; }   /* v8.7.4 잡아찢기에 붙잡힘 · v8.7.8 광대의 팔에 끌려옴 */
  if (u.cz){ czTick(W, u, dt); if (czReact(W, u)) return; if (u.act && u.act.k === 'cz' && czRun(W, u, dt)) return; }   /* v7.23.1 세자르 */   /* v7.24 비켜 섬 */
  if (u.dcPend && W.t >= u.dcPend.at) dcFire(W, u);   /* v7.23.1 회피 반격 */
  if (u.order && u.order.k === 'specCancel'){ const A0 = u.act; if (A0 && A0.k === 'spec' && A0.phase === 'wind' && (!u.order.s || A0.s === u.order.s)){ u.act = null; const x0 = specOf(u, A0.s); if (x0) x0.cdT = Math.min(x0.cdT, W.t + 1); L(W, { k: 'specCancel', a: u.i, s: A0.s, vis: true }); setMood(W, u, (x0 ? x0.name : '기술') + ' 그만둠'); } u.order = null; }   /* v8.7.3 준비 중에 그만둠 */
  if (u.act && u.act.k === 'spec' && u.act.s === 'sweep' && u.act.phase === 'wind') sweepWarn(W, u, u.act);   /* v8.7.3 원 안의 동료가 비켜섬 */
  if (u.kb || W.t < u.proneT || W.t < (u.stunT || -9)) return;   // v5.2 날아가는 중 · 넘어짐 · v5.5.3 휘청: 아무것도 못 함 (기어다니는 쪽은 움직임)
  if (u.act && u.act.k === 'spec' && u.act.s === 'sweep' && u.act.phase === 'swing'){ stepSweep(W, u, dt); return; }   /* v7.24.4 철퇴 후리기 한 바퀴 */
  if (u.act && u.act.k === 'gwHop'){ gwHopStep(W, u); return; }   /* v8.7.8 굿윌 순간이동 도약 */
  if (u.act && u.act.k === 'karRoar'){ stop(u); if (W.t >= u.act.end) u.act = null; return; }   /* v8.7.8 불경자 — 울부짖음 */
  if (u.act && u.act.k === 'spec' && u.act.s === 'krush' && u.act.phase === 'go'){ karRushStep(W, u, dt); if (u.act && W.t >= u.act.end) resolveAct(W, u); return; }   /* v8.7.8 돌진 몸박 */
  if (u.act && u.act.k === 'pr'){ prStep(W, u, dt); return; }   /* v8.7.8 포렌: 쥐 방진 · 쥐 사다리 · 쥐 방패 지휘 */
  if (u.act && u.act.k === 'roll'){ rollStep(W, u, dt); return; }   /* v8.7.8 쥐 베테랑 구르기 */
  if (u.act && (u.act.k === 'leap' || u.act.k === 'dodge')){ stepLeap(W, u, dt); return; }
  if (u.act && u.act.k === 'charge' && u.act.phase === 'run'){ stepCharge(W, u, dt); return; }
  if (u.act && u.act.k === 'atk' && u.act.phase === 'wind' && !isFar(u)){ const tt = W.units[u.act.b]; if (tt && tt.alive){ u.fg = Math.atan2(tt.y - u.y, tt.x - u.x);
      const A = u.act, TR = (W.rules.track || {}).d != null ? W.rules.track.d : 0.6, need = gap(u, tt) - u.rng, evd = (tt.mv && tt.mv.ev && W.t < tt.mv.until) || (tt.dodgeHold && tt.dodgeHold.a === u.i && W.t < tt.dodgeHold.until) || (tt.flee && W.t < tt.flee.until) || W.t - (tt.dodgedT || -9) < 0.5 || (tt.act && (tt.act.k === 'leap' || tt.act.k === 'dodge')); if (need > 0.02 && A.end - W.t > 0.15 && (A.trk || 0) < TR && !u.kb && !evd){   /* v8.7.3 피하는 상대는 쫓지 않음 */ const d0 = dist(u, tt) || 1, st = Math.min(need + 0.05, TR - (A.trk || 0), spdNow(W, u) * dt * 1.2), x0 = u.x, y0 = u.y; tryMove(W, u, u.x + (tt.x - u.x) / d0 * st, u.y + (tt.y - u.y) / d0 * st); A.trk = (A.trk || 0) + Math.hypot(u.x - x0, u.y - y0); } } }   /* v8.7.3 마지막까지 조금 따라감 */   // v5.3 준비하는 동안 상대 쪽으로 몸을 돌림
  if (u.act && u.act.k === 'skill' && u.act.phase === 'wind' && u.act.auto){   // v7.9 붓는 도중 치명적 일격이 나를 노리면 (아주 위급한 동료가 아니면) 끊고 비킴 — 눈앞의 위협을 보고도 끝까지 붓지 않음
    const pr = perilOn(W, u), v = W.units[u.act.b], H = W.rules.heal || {};
    if (pr && v && (v === u || !(v.down || v.hp / v.max < (H.rescue != null ? H.rescue : 0.12)))){   /* v7.17 자기 치료 중에도 치명적 일격이 오면 끊고 비킴 */ L(W, { k: 'healAbort', a: u.i, b: v.i, by: pr.e.i, eta: +pr.eta.toFixed(2), vis: true }); u.act = null; u.healDeferT = W.t; } }
  if (u.act && u.act.k === 'atk' && !u.act.mode && (u.act.phase === 'rec' || u.act.phase === 'wind') && stepOK(W, u, isFar(u)) && tryDodge(W, u, true)) return;   /* v7.17 치는 중 · 거두는 중에도 스텝 — 상대 일격이 먼저 떨어지면 내 공격을 버리고 비켜섬 (공격 · 막기 · 회피의 심리전) */
  if (u.act && u.alt && altAuto(W, u, true)) return;   /* v7.26.1 겨누는 · 재장전 중에도 코앞이면 샷건으로 */
  if (u.act){ if (u.act.k === 'skill' && u.act.phase === 'tend'){ tendStep(W, u); if (!u.act) return; }   // v7.3 돌봄
    if (u.burst) tickBurst(W, u); if (u.act && u.act.k === 'atk' && u.strafe && W.t < u.strafe.until && isFar(u)) strafeStep(W, u, dt); if (u.act && W.t >= u.act.end) resolveAct(W, u); return; }   // v7.0 이동 사격: 당기는 · 거두는 동안 옆으로   // 준비 · 회복 중엔 못 움직임 (점사는 회복 중에 이어 쏨)
  if (altAuto(W, u)) return;   // v7.25.1 두 번째 총
  if (invAuto(W, u)) return;   // v7.20 소지품: 탄이 다 떨어졌거나 무기를 잃으면 가방에서 꺼냄
  if (u.flee){ if (W.t < u.flee.until && !u.lie){ goTo(W, u, u.flee.x, u.flee.y, dt); setMood(W, u, u.flee.why || '내려앉을 자리에서 피함'); return; } u.flee = null; }   // v7.22.2 도약 강타의 그림자
  if (u.lie && lieHold(W, u)) return;   // v7.11 엎드려서 못 하는 명령이면 일어남 (그동안 아무것도 못 함)
  if (u.canLeap && !u.crawl && !u.lie && W.t >= u.leapCd && !AI6.includes('sidel') && leapAside(W, u)) return;   // v6.7.4 돌진 길에서 옆으로 도약
  if (tryDodge(W, u)) return;   // v5.2 피하기
  const x0 = u.x, y0 = u.y;
  act2(W, u, dt);
  if (u.lie && !lieMoves(u) && (u.x !== x0 || u.y !== y0)){ u.x = x0; u.y = y0; stop(u); }
  if (u.dodgeHold){ const A0 = W.units[u.dodgeHold.a], aa = A0 && A0.alive ? A0.act : null;   // v7.13 피한 일격이 아직 떨어지지 않았으면 그 손 안으로 다시 걸어 들어가지 않음 (명령이어도)
    if (W.t < u.dodgeHold.until && aa && aa.phase === 'wind' && (aa.b === u.i || aa.mode === 'sweep')){ const rr = (aa.k === 'bash' ? 0.35 : (A0.rng || 0.5)) + W.rules.reach + 0.12;
      if (gap(u, A0) < rr && dist(u, A0) < Math.hypot(x0 - A0.x, y0 - A0.y) - 1e-4){ u.x = x0; u.y = y0; stop(u); setMood(W, u, '피한 일격이 떨어지길 기다림', A0.i); } }
    else u.dodgeHold = null; }   // v7.11 엎드린 채 그 자리 (기는 것은 이동 · 공격 · 견제 명령일 때만)
  // 이번 순간 움직이지 않았으면, 막을 쪽 (방어 자세) · 노리는 상대 · 가장 가까이 보이는 적 쪽을 봄
  if (!u.act && Math.hypot(u.x - x0, u.y - y0) < 1e-4){
    const dg = u.canGuard ? dangerOf(W, u) : null;
    const t = dg || (u.order && u.order.k === 'attack' ? W.units[u.order.b] : u.target && u.target.side !== u.side ? u.target : null);
    if (u.mood === '막아서기' && !dg) return;
    if (t && t.alive) faceTo(u, t);
    else { const n = W.units.filter(f => f.alive && f.side !== u.side && dist(u, f) < 3 && (u.side === 1 || canSee(W, u, f))).sort((a, b) => dist(u, a) - dist(u, b))[0];
      if (n) faceTo(u, n);
      else if (u.side === 0 && (!u.order || u.order.k === 'hold') && u.mood !== '전선' && u.mood !== '보호'){   // 전선 · 보호 중인 탱커는 위협 쪽을 계속 봄
        // 살핌: 감지한 (냄새 · 브리핑 · 짖는 소리) 방향들을 1.5초씩 번갈아 봄. 감지는 공격을 막아 주지 않음
        const S = W.units.filter(f => f.alive && f.side !== u.side && fresh(W, u.sense[f.i])).map(f => u.sense[f.i]);
        if (S.length){ const s = S[Math.floor(W.t / 1.5) % S.length]; u.fg = Math.atan2(s.y - u.y, s.x - u.x); if (!u.order) setMood(W, u, '살핌'); }
        // 어둠 속에서 누가 맞았다 → 두리번 (총성을 들었으면 그쪽, 아니면 이리저리)
        else if (W.t - (W.darkHitT || -9) < 2.5){
          const hd = W.units.filter(a => a.alive && a.side === u.side && a.heard && W.t - a.heard.t < 3).map(a => a.heard)[0];
          if (hd) u.fg = Math.atan2(hd.y - u.y, hd.x - u.x);
          else if (W.t - (u.glanceT || -9) > 0.35){ u.glanceT = W.t; u.fg = u.face + (W.rand() - 0.5) * 3; }
          if (!u.order) setMood(W, u, '두리번');
        }
      } }
  }
}
/* ---------- v4.5 탱커: 전선 · 보호 ---------- */
// 아는 위협 쪽: 보이는 적 (가까운 것) > 들은 총성 (동료 누구든, 5초 안) > 냄새 · 브리핑 · 짖는 소리
function threatPt(W, u){
  const vis = W.units.filter(f => f.alive && f.side !== u.side && (u.side === 0 ? f.seenBy : canSee(W, u, f))).sort((a, b) => dist(u, a) - dist(u, b));
  if (vis.length) return { x: vis[0].x, y: vis[0].y };
  let best = null, bt = -1;
  for (const a of W.units) if (a.alive && a.side === u.side && a.heard && W.t - a.heard.t < 5 && a.heard.t > bt){ bt = a.heard.t; best = { x: a.heard.x, y: a.heard.y }; }
  if (best) return best;
  for (const f of W.units){ if (!f.alive || f.side === u.side) continue; const s = u.sense[f.i]; if (fresh(W, s) && s.t > bt){ bt = s.t; best = { x: s.x, y: s.y }; } }
  return best;
}
// 아군 a 가 얼마나 노출됐나 (보이는 상대만): 사선이 열린 사거리 안 사수 1 (a 를 겨누는 중 +0.5), a 를 노리는 2칸 안 근접 1. 체력이 낮을수록 ×(1 ~ 2)
function exposure(W, a){
  let e = 0, main = null, mw = 0;
  for (const f of W.units){
    if (!f.alive || f.side === a.side || !(a.side === 0 ? f.seenBy : W.units.some(e => e.alive && e.side === a.side && canSee(W, e, f)))) continue;
    let w = 0;
    if (isFar(f)){ if (gap(f, a) <= f.rng + 0.3 && losClear(W.map, f.x, f.y, a.x, a.y)){ const fl = firstOnLine(W, f, a, f); if (fl === a || !blocksFor(W, fl, f)) w = 1 + (f.act && f.act.b === a.i ? 0.5 : 0); } }
    else if (gap(f, a) <= 2 && focusOf(W, f) === a) w = 1;
    e += w; if (w > mw){ mw = w; main = f; }
  }
  return { e: e * (1 + Math.max(0, 1 - a.hp / a.max)) * (prone(W, a) ? 1.8 : 1) * wardMul(W, a), main };   // v5.2 넘어진 동료는 더 지켜야 함 · v5.7 지킬 사람 (약 · 사수 · 지휘) — 인주는 보병
}
function shout(W, u, s, ang){
  W.covers[u.side] = { g: u.i, ang, t: W.t, side: u.side };
  // 외침은 그 일을 막 시작할 때만 (같은 외침은 10초에 한 번)
  const fresh2 = u.shoutK !== s || W.t - (u.coverT || -9) > 1.5; u.coverT = W.t; u.shoutK = s;
  if (!fresh2 || (u.shoutT != null && W.t - u.shoutT < 10)) return;
  u.shoutT = W.t; L(W, { k: 'shout', a: u.i, s, mute: u.mute });
  if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: u.mute ? SHOUT_EMO[s] || '❗' : s, t0: W.t });   // v5.3 말 없는 쪽은 이모지
}
// 탱커가 맡을 일: 붙어 싸우는 적이 있으면 보통 싸움 (false). 너무 노출된 아군 → 그 앞을 막아섬. 아는 위협 → 무리 앞 전선. 없으면 false (주인공 앞에서 걸음)
function tankAI(W, u, dt){
  // v5.0 우위면 전선을 지키지 않고 치고 나감 (가까운 보이는 상대에게) — 같은 편도 '뒤로!' 가 없으니 각자 싸움
  const f0 = W.units.filter(f => f.alive && f.side !== u.side && (u.side === 0 ? f.seenBy : canSee(W, u, f))).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (W.t - (u.pushT == null ? -9 : u.pushT) < 1.5 && u.target && u.target.alive && u.target.side !== u.side){ u.frontT = 0; return false; }
  // v5.2 돌진 (중전차): 막고 선 상대 전선 (방패 · 큰 몸) · 동료를 치려는 상대가 돌진 거리 안이면 들이받아 전선을 깸
  if (u.canCharge && W.t >= u.chargeCd){ const bc = bestCharge(W, u); if (bc && tryCharge(W, u, bc, false)) return true; }   // v5.3 빈틈을 노려 돌격 (훈련된 방진은 잘 안 밀림)
  if (f0 && pushing(W, u, f0)){ u.frontT = 0; if (u.side === 1 || !u.target || !u.target.alive){ u.target = f0; u.state = u.side ? 'hunt' : 'fight'; } return false; }
  // 아는 상대: 보임 (적은 1.5초 안에 본 것까지 — 돌아서는 사이 등 뒤로 간 상대를 잊지 않음)
  const aw = f => u.side === 0 ? f.seenBy : canSee(W, u, f) || (u.sense[f.i] && u.sense[f.i].sight && W.t - u.sense[f.i].t < 1.5);
  // 붙어 싸우는 적 (1.2칸 · 방금까지 붙어 있었으면 1.8칸) 이 있으면 보통 싸움 — 전선 ↔ 싸움을 오가는 와리가리 없음
  const eng = W.t - (u.engT == null ? -9 : u.engT) < 1 ? 1.8 : 1.2;
  if (W.units.some(f => f.alive && f.side !== u.side && aw(f) && !isFar(f) && gap(u, f) <= eng)){ u.frontT = 0; u.engT = W.t; return false; }
  const mates = W.units.filter(a => a.alive && a !== u && a.side === u.side && (u.side === 0 || (!a.pack && !a.stalk && dist(a, u) < 6)));
  if (!mates.length) return false;
  // 보호: 가장 노출된 아군 (지키는 자리가 있으면 그 둘레 3칸 안만)
  let pick = null, pe = 0;
  for (const a of mates){ if (u.stay && Math.hypot(a.x - u.stay.x, a.y - u.stay.y) > 3) continue; const x = exposure(W, a); if (x.e > pe){ pe = x.e; pick = { a, f: x.main }; } }
  if (pick && pe >= (W.rules.exposeAt || 1.5) && pick.f){
    const a = pick.a, f = pick.f;
    if (!isFar(f)){ u.target = f; u.state = 'fight'; setMood(W, u, '보호', a.i); fight(W, u, f, dt, true, false); return true; }   // 근접이 노리면 그 적을 맡음
    u.frontT = 0;
    const d = dist(f, a) || 1, k = a.r + u.r + 0.15, px = a.x + (f.x - a.x) / d * k, py = a.y + (f.y - a.y) / d * k;
    if (!rock(W.map, px, py)){
      shout(W, u, '내 뒤로!', Math.atan2(f.y - a.y, f.x - a.x)); setMood(W, u, '보호', a.i);
      if (Math.hypot(px - u.x, py - u.y) > 0.12) goTo(W, u, px, py, dt); else stop(u);
      u.fg = Math.atan2(f.y - u.y, f.x - u.x); return true;
    }
  }
  if (u.line && lineKeep(W, u, dt)){ u.frontT = 0; return true; }   // v5.7 전열에 선 탱커는 전열과 같이 (지킬 사람을 감싸는 일은 먼저)
  if (u.stay){ u.frontT = 0; return false; }
  // 전선: 무리 가운데에서 위협 쪽으로. 오래 맞서면 (아무도 안 들어오면) 조금씩 밀고 나감 — 동료는 그 뒤를 따름
  const th = threatPt(W, u); if (!th){ u.frontT = 0; return false; }
  const cx = mates.reduce((s, a) => s + a.x, 0) / mates.length, cy = mates.reduce((s, a) => s + a.y, 0) / mates.length;
  const ang = Math.atan2(th.y - cy, th.x - cx), dT = Math.hypot(th.x - cx, th.y - cy);
  // 적 전선은 밀고 나가지 않고 버팀 (대치). 다만 분명히 유리하면 (아는 상대 수의 두 배 이상 · 아는 상대가 모두 탄약이 없거나 체력이 바닥) 조금씩 밀고 나감
  u.frontT = u.side === 0 ? (u.frontT || 0) + dt : 0;
  const want = Math.max(0.8, Math.min(dT - 1.2, 1.4 + Math.max(0, u.frontT - 2) * 0.5));
  let px = cx, py = cy;
  for (const d of [want, want * 0.75, 0.8]){ const x = cx + Math.cos(ang) * d, y = cy + Math.sin(ang) * d; if (!rock(W.map, x, y)){ px = x; py = y; break; } }
  shout(W, u, '뒤로!', ang); setMood(W, u, '전선');
  if (Math.hypot(px - u.x, py - u.y) > 0.2) goTo(W, u, px, py, dt); else stop(u);
  u.fg = Math.atan2(th.y - u.y, th.x - u.x);
  return true;
}
// '뒤로!' 를 들은 자동 동료 (싸우는 중이 아니면): 탱커 뒤 (위협 반대쪽) 로
function behindCover(W, u, dt){
  const C = W.covers[u.side]; if (!C || W.t - C.t > 0.6) return false;
  const g = W.units[C.g]; if (!g || !g.alive || g === u || dist(u, g) > 6) return false;
  if (u.role === '미드필더') return false;   // 미드필더는 방패 뒤에 서지 않음
  const others = W.units.filter(a => a.alive && a.side === u.side && a !== g && !a.order && a.role !== '전선' && a.role !== '미드필더' && !a.pack && !a.stalk).sort((a, b) => a.i - b.i), k = Math.max(0, others.indexOf(u));
  const bx = -Math.cos(C.ang), by = -Math.sin(C.ang), lx = -by, ly = bx, back = g.r + u.r + 0.3 + Math.floor(k / 3) * 0.6, side = [0, 0.6, -0.6][k % 3];
  let px = g.x + bx * back + lx * side, py = g.y + by * back + ly * side;
  if (rock(W.map, px, py)){ px = g.x + bx * back; py = g.y + by * back; }
  if (rock(W.map, px, py)) return false;
  setMood(W, u, '탱커 뒤', g.i);
  if (Math.hypot(px - u.x, py - u.y) > 0.15) goTo(W, u, px, py, dt); else { stop(u); u.fg = C.ang; }
  return true;
}
// v5.5.1 새 명령은 바로 끼어듦: 준비 중 (wind) 인 공격 · 사격 · 투창 · 밀치기 · 약 (약 명령이면 재장전도) 과 이어 쏘던 점사를 끊음.
// 같은 상대에게 같은 일이면 그대로. 달리는 돌진 · 도약 · 피하기 · 휘두른 뒤 회복은 못 끊음
// v5.5.4 이동 명령 (이동 · 공격 이동 · 제자리) 은 하던 동작을 바로 멈추고 움직임 — 준비 · 휘두른 뒤 회복 · 재장전 · 돌진 예고까지 (실전 기동: 돌격 예고선을 보고 비켜섬).
// 이미 달리는 돌진 · 도약 · 피하기 · 넘어짐 · 휘청 · 날아가는 중은 못 끊음
function preempt(W, u){
  const o = u.order, a = u.act; let did = false;
  if (o && ['attack', 'charge', 'throw', 'amove', 'palm'].includes(o.k) && u.guardMode === 'hold'){ u.guardMode = 'auto'; L(W, { k: 'guardMode', a: u.i, m: 'auto', why: '공격 명령', vis: true }); }   // v5.7 공격 명령이면 막기 유지를 풂
  if (u.burst && !(o && o.k === 'attack' && u.burst.b === o.b)){ u.burst = null; did = true; }
  const mv = o && (o.k === 'move' || o.k === 'amove' || o.k === 'hold' || o.k === 'watch' || o.k === 'lret' || o.k === 'scout' || o.k === 'torchGet' || o.k === 'frally');   /* v8.7.5 모여도 바로 */   // v7.2 전열 후퇴도 바로 물러섬
  if (a && a.k === 'charge' && o && o.k !== 'charge'){ u.act = null; stop(u); did = true; }   // v6.2 달리는 돌진도 새 명령이 오면 그 자리에서 멈추고 새 명령을 따름 (돌진 명령으로 바꾸는 건 그대로)
  else if (mv && a && (['atk', 'throw', 'skill', 'bash', 'heal', 'reload', 'palm', 'assn', 'supp', 'flare'].includes(a.k) || (a.k === 'charge' && a.phase === 'wind'))){ if (a.k === 'skill' && a.phase === 'tend') tendEnd(W, u, a, '명령'); u.act = null; did = true; }
  else if (a && a.k === 'skill' && a.phase === 'tend' && o && !(o.k === 'skill' && o.b === a.b)){ tendEnd(W, u, a, '명령'); u.act = null; did = true; }   // v7.3 다른 명령이면 돌봄을 멈춤
  else if (a && a.phase === 'wind' && (['atk', 'throw', 'skill', 'bash', 'heal', 'palm', 'assn', 'supp', 'flare'].includes(a.k) || (a.k === 'reload' && o && o.k === 'skill'))){
    const same = o && a.b === o.b && ((o.k === 'attack' && (a.k === 'atk' || a.k === 'palm' || a.k === 'assn')) || (o.k === 'assn' && a.k === 'assn') || (o.k === 'supp' && a.k === 'supp') || (o.k === 'flare' && a.k === 'flare') || (o.k === 'throw' && a.k === 'throw') || (o.k === 'skill' && a.k === 'skill') || (o.k === 'palm' && a.k === 'palm'));
    if (!same){ u.act = null; did = true; }
  }
  if (did) L(W, { k: 'cancel', a: u.i, was: a ? a.k : 'burst', done: !!(a && a.phase && a.phase !== 'wind' && ['skill', 'heal', 'atk', 'throw', 'bash'].includes(a.k)), vis: true });   // v6.3.4 done = 이미 들어간 뒤 (회복 동작만 끊음)
  return did;
}
/* ---------- v7.15 회피기동 (아군 · 적 같은 규칙) ----------
   사수 · 기동 사수: 근접이 나를 노리고 trig 칸 안으로 오면 쏜 다음 step 칸씩 물러남 (동료 쪽 · 다른 근접 손 닿는 곳은 피함) — 코앞 (close) 이면 쏘기 전에도 · 도약이 있으면 뒤로 뜀.
     사이에 근접 동료가 막아 주면 그 자리에서 쏨 · 물러나도 거리가 안 벌어지면 (stuck 초) 그만두고 rest 초 동안 그 자리에서 쏨. 적 사수는 같은 본능을 지휘 쪽 (궁수 카이팅) 에서 씀.
   기동 근접 [회피X] (청광묵): ① 흘려 빠지기 — 나를 노린 근접의 일격 준비를 보면 (등급만큼 읽음 · 왼눈 사각은 못 봄) 그 손 밖 옆 · 뒤 (상대 등 쪽) 로 빠짐 (도약이 있으면 뜀) →
     일격이 떨어질 때까진 그 손 안으로 다시 안 들어가고, 떨어진 뒤 그 상대를 침 (빈틈). ② 포위 빠지기 — 근접 crowd 넘게 crowdR 칸 안에서 나를 노리면 적이 적은 쪽으로 빠져나감.
   명령: '제자리' · 이동 · 급한 (연달아 준) 명령 중엔 안 함 — ① 은 공격 · 팜 버스트 명령 중에도 (피하고 다시 들어감) */
const EVM = W => W.rules.evadeMv || {};
const evGrade = u => u.evG !== undefined ? u.evG : (u.evG = ((u.traits || []).find(t => /^회피[SABC]$/.test(t)) || '').slice(-1));
function evadeMove(W, u, dt){
  const E = EVM(W); if (!E.on || AI6.includes('evm') || u.act || u.lie || u.crawl || u.down || u.kb || W.t < u.proneT) return false;
  const o = u.order, free = !o || (o.k === 'attack' && !o.now);
  if (u.mv && (u.mv.k === 'kite' || u.mv.k === 'slip' || u.mv.k === 'out') && W.t < u.mv.until && u.mv.ev){   // 하던 회피를 이어 감
    const LN = chargeLane(W, u, f => canSee(W, u, f)); if (LN && !laneOk(LN, u, u.mv.x, u.mv.y)) u.mv = null;   /* v8.7.4 가는 자리가 돌진 길 안 (또는 건너편) — 다시 고름 */
    else if (u.mv.k === 'kite' && kiteEng(W, u)){ u.mv = null; stop(u); }   /* v8.7.4 맞붙음 — 걸어서 빠지면 등을 보인 틈에 맞음 */
    else if (Math.hypot(u.mv.x - u.x, u.mv.y - u.y) > 0.12){ setMood(W, u, u.mv.m, u.mv.b); goTo(W, u, u.mv.x, u.mv.y, dt); return true; }
    else { u.mv = null; stop(u); } }
  const seen = f => f.alive && !f.down && !f.crawl && f.side !== u.side && canSee(W, u, f);   // 내 눈으로 본 상대만
  if (isFar(u)) return u.side === 0 && free && !((W.rules.weapons || {})[u.weapon] || {}).near && kiteMove(W, u, dt, seen);   /* v7.25.1 샷건을 들면 물러나지 않고 맞쏨 */
  if (evGrade(u) && (!o || ['attack', 'palm'].includes(o.k)) && !(o && o.now)) return slipMove(W, u, dt, seen, free);
  return false;
}
// v8.7.4 돌진 길: 나를 노린 돌진 (준비 · 달림) 의 앞쪽 띠 (돌진하는 몸 + 내 몸 + 0.45칸 폭)
function chargeLane(W, u, ok){ const c = W.units.find(e => e.alive && e.side !== u.side && e.act && e.act.k === 'charge' && (e.act.phase === 'run' || e.act.phase === 'wind') && e.act.b === u.i && ok(e)); if (!c) return null;
  const A = c.act, a = A.phase === 'run' && A.dx != null ? Math.atan2(A.dy, A.dx) : Math.atan2(u.y - c.y, u.x - c.x);
  return { c, x: c.x, y: c.y, dx: Math.cos(a), dy: Math.sin(a), w: c.r + u.r + 0.45 }; }
const laneSide = (L, x, y) => (y - L.y) * L.dx - (x - L.x) * L.dy;   // 띠 가운데 줄의 어느 쪽 (부호) · 얼마나 (크기)
const laneIn = (L, x, y) => (x - L.x) * L.dx + (y - L.y) * L.dy > -0.3 && Math.abs(laneSide(L, x, y)) < L.w;
const laneOk = (L, u, x, y) => !laneIn(L, x, y) && !(Math.abs(laneSide(L, u.x, u.y)) > 0.05 && laneSide(L, x, y) * laneSide(L, u.x, u.y) < 0);   // 띠 밖 · 지금 있는 쪽 그대로 (띠를 가로지르지 않음)
// v8.7.4 맞붙음: 손이 빈 (치는 중이 아닌) 근접 상대의 손 닿는 곳 — 걸어서 빠지면 교전 구속 (등을 보인 틈에 일격 · 칠 수 있는 몸의 조건은 그 규칙과 같음) · 물러나기를 멈추고 그 자리에서 쏨 · 싸움 (물러나기를 고를 때의 규칙과 같음)
const kiteEng = (W, u) => { const K = EVM(W).kite || {}; return W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && !f.down && !f.crawl && !f.noArms && !f.kb && !f.act && f.heldBy == null && !(f.stoneT != null && W.t < f.stoneT) && W.t >= (f.stunT || -9) && W.t >= (f.proneT || -9) && canSee(W, u, f) && gap(u, f) < Math.max(K.contact != null ? K.contact : 0.7, f.rng + 0.25)); };
// v8.7.4 돌진이 닿기까지 남은 시간 (준비 남은 시간 + 남은 거리를 도움닫기 속력으로)
function laneEta(W, c, u){ const A = c.act, C = W.rules.charge || {}, g = Math.max(0, gap(u, c)); if (A.phase === 'wind') return Math.max(0, A.end - W.t) + chargeTime(C, spdNow(W, c), g); const v0 = A.v0 != null ? A.v0 : spdNow(W, c), r0 = A.run || 0; return chargeTime(C, v0, r0 + g) - chargeTime(C, v0, r0); }
// 한 발 쏘고 (준비 + 회복) 길 밖으로 나갈 (뛰어서) 시간이 남으면 먼저 쏨 — '쏜 다음에 물러남' 그대로
const laneShootFirst = (W, u, L) => isFar(u) && !needReload(u) && u.mag !== 0 && u.ammo !== 0 && gap(u, L.c) <= u.rng && laneEta(W, L.c, u) > aimT(W, u) + (u.rec || 0.5) + (L.w - Math.abs(laneSide(L, u.x, u.y)) + 0.3) / Math.max(0.5, spdNow(W, u) * (W.rules.run || 1.3)) + 0.15;
const evLog = (W, u, f, m, ex) => L(W, { k: 'evade', a: u.i, b: f ? f.i : null, m, ...(ex || {}), vis: u.side === 0 || !!u.seenBy });
function kiteMove(W, u, dt, seen){
  const K = EVM(W).kite || {}, mates = W.units.filter(m => m.alive && m !== u && m.side === u.side && !m.down);
  const LN = chargeLane(W, u, seen);   /* v8.7.4 나를 노린 돌진 (본 것만) — 길이 닿으면 trig 밖이어도 그 몸이 물러날 까닭 */
  const x = LN ? LN.c : W.units.filter(f => seen(f) && !isFar(f) && gap(u, f) < (K.trig || 3) && (f.target === u || (f.act && f.act.b === u.i) || focusOf(W, f) === u)).sort((p, q) => gap(u, p) - gap(u, q))[0];
  if (!x || (W.t < (u.kiteNo || 0) && !LN) || cornered(W, u)) return false;   // 돌진 길은 쉬는 중에도 비킴 (v8.7.4)
  if (mates.some(m => !isFar(m) && dist(m, x) < dist(u, x) && segD(x, u.x, u.y, m) < m.r + x.r)) return false;   // 사이에 근접 동료가 막아 줌 → 그 자리에서 쏨
  const g = gap(u, x), close = g < (K.close || 2.4), shot = (u.lastFireT != null ? u.lastFireT : -9) > (u.kiteT0 != null ? u.kiteT0 : -9);
  if (!close && !shot && !LN) return false;   // 쏜 다음에 물러남 — 나를 노린 돌진이면 쏘기 전에도 길 밖으로 (v8.7.4)
  if (LN && !shot && laneShootFirst(W, u, LN)) return false;   // 돌진이 닿기 전에 한 발 쏘고 비킬 시간이 있으면 먼저 쏨 (v8.7.4)
  if (u.canLeap && W.t >= u.leapCd && g < ((W.rules.leap || {}).near || 2.2) && startLeap(W, u, x)){ u.kiteT0 = W.t; evLog(W, u, x, 'leap'); return true; }
  if (g < Math.max(K.contact != null ? K.contact : 0.7, x.rng + 0.25)) return false;   /* v7.17 맞붙음 = 상대의 리치 안 (리치가 길면 더 멀리서부터) */   // 이미 맞붙음 — 등을 보이면 맞음 (그 자리에서 쏨 · 싸움)
  const B = u.kvBk && u.kvBk.b === x.i && W.t - u.kvBk.t1 < 1.5 ? u.kvBk : (u.kvBk = { b: x.i, t0: W.t, g0: g, t1: W.t }); B.t1 = W.t;
  if (!LN && W.t - B.t0 > (K.stuck || 2.5) && g < B.g0 + 0.8){   /* v8.7.4 돌진이 오는데 '따라붙음' 으로 서 버리지 않음 */ u.kvBk = null; u.kiteNo = W.t + (K.rest || 6); evLog(W, u, x, 'stuck'); return false; }   // 같은 걸음으로 따라붙음 → 그 자리에서 쏨
  const mc = mates.filter(m => !isFar(m)), base = LN ? Math.atan2(LN.dy, LN.dx) : Math.atan2(u.y - x.y, u.x - x.x), st = K.step || 2.2; let best = null, bs = -1e9;
  for (const da of LN ? [1.57, -1.57, 1.2, -1.2, 1.9, -1.9, 0.8, -0.8] : [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]){ const ang = base + da, px = u.x + Math.cos(ang) * st, py = u.y + Math.sin(ang) * st;   /* v8.7.4 돌진이 오면 길의 옆으로 */
    if (px < 0.8 || py < 0.8 || px > W.map.W - 0.8 || py > W.map.H - 0.8 || boxRock(W, px, py, u.r) || !fatClear(W.map, u.x, u.y, px, py, u.r * 0.8)) continue;
    if (LN && !laneOk(LN, u, px, py)) continue;
    if (W.units.some(f => seen(f) && !isFar(f) && f !== x && Math.hypot(f.x - px, f.y - py) - f.r - u.r < f.rng + 1.2)) continue;
    const sc = -Math.abs(Math.abs(da) - (LN ? 1.57 : 0)) * 0.6 + (mc.length ? -Math.min(...mc.map(m => Math.hypot(m.x - px, m.y - py))) * 0.25 : 0); if (sc > bs){ bs = sc; best = { x: px, y: py }; } }
  if (!best) return false;
  const rn = g > Math.max(K.runG != null ? K.runG : 1.6, x.rng + 1.15);   /* v7.17 리치만큼 */   // 가까우면 상대를 보며 뒷걸음 (등을 안 보임) · 여유가 있으면 뜀 (돌진 길을 비킬 때도 같음)
  u.mv = { k: 'kite', ev: true, lane: !!LN, x: best.x, y: best.y, b: LN ? LN.c.i : x.i, run: rn, until: W.t + (K.dur || 0.9), m: LN ? '돌진 길 밖으로 — 옆으로 빠짐' : rn ? '거리 벌림 — 쏘고 물러남' : '거리 벌림 — 보며 뒷걸음' }; u.kiteT0 = W.t;
  if (LN ? u.laneKey !== LN.c.i + ':' + LN.c.act.t0 : W.t >= (u.kiteLogT || 0)){ if (LN) u.laneKey = LN.c.i + ':' + LN.c.act.t0; else u.kiteLogT = W.t + 4; evLog(W, u, LN ? LN.c : x, 'kite', LN ? { lane: true } : null); }
  setMood(W, u, u.mv.m, x.i); goTo(W, u, best.x, best.y, dt); return true;
}
function slipMove(W, u, dt, seen, free){
  const S = EVM(W).slip || {}, rdP = (S.read || {})[evGrade(u)] || 0, LP = W.rules.leap || {};
  // ① 흘려 빠지기: 나를 노린 일격 준비 (넓게 휘두르기는 부채꼴 안이면)
  for (const x of W.units){
    if (!seen(x) || isFar(x) || !x.act || x.act.phase !== 'wind' || !['atk', 'bash'].includes(x.act.k)) continue;
    const A = x.act, reach = (A.k === 'bash' ? 0.35 : (x.rng || 0.5)) + W.rules.reach, sweep = A.mode === 'sweep';
    if (!(A.b === u.i || (sweep && gap(u, x) < reach + 0.2))) continue;
    const left = A.end - W.t; if (left < (S.min || 0.12) || gap(u, x) > reach + 0.3) continue;
    const key = x.i + ':' + A.t0; if (u.slipKey === key) continue; u.slipKey = key;   // 한 일격에 한 번만 읽음
    if (W.rand() >= rdP) continue;   // 못 읽음 (등급)
    const fa = x.face != null ? x.face : Math.atan2(u.y - x.y, u.x - x.x), R1 = x.r + u.r + reach + (S.pad || 0.35), canL = u.canLeap && W.t >= u.leapCd;
    const lim = canL ? (LP.dist || 1.7) + 0.1 : Math.max(0.5, spdNow(W, u) * (W.rules.run || 1.3) * left * 0.95);
    let best = null, bs = -1e9;
    for (const ra of [1.6, -1.6, 2.1, -2.1, 2.6, -2.6, 1.1, -1.1]){ const ang = fa + ra, px = x.x + Math.cos(ang) * R1, py = x.y + Math.sin(ang) * R1, l = Math.hypot(px - u.x, py - u.y);
      if (l > lim || px < 0.6 || py < 0.6 || px > W.map.W - 0.6 || py > W.map.H - 0.6 || boxRock(W, px, py, u.r) || !fatClear(W.map, u.x, u.y, px, py, u.r * 0.7)) continue;
      if (W.units.some(f => f !== x && f !== u && f.alive && Math.hypot(f.x - px, f.y - py) < f.r + u.r + (f.side !== u.side && !isFar(f) ? f.rng + 0.3 : 0.05))) continue;
      const sc = Math.abs(ra) * 0.5 - l * 0.6; if (sc > bs){ bs = sc; best = { x: px, y: py, back: Math.abs(ra) > 2 }; } }
    if (!best){ const p = fallbackPt(W, u, x, R1 - gap(u, x) + 0.2); if (p && Math.hypot(p.x - u.x, p.y - u.y) <= lim) best = { x: p.x, y: p.y, back: false }; }
    if (!best) continue;
    u.dodgeHold = { a: x.i, until: A.end + 0.1 };   // v7.13 일격이 떨어질 때까진 그 손 안으로 다시 안 들어감
    if ((free && u.side === 0) || u.side === 1){ u.target = x; u.state = u.side ? 'hunt' : 'fight'; }   // 떨어진 뒤 그 상대를 침 (빈틈)
    u.slipPun = { b: x.i, t: A.end };
    if (canL && leapTo(W, u, best.x, best.y, 'side', x, best.back ? '흘려 빠지기 — 등 쪽으로' : '흘려 빠지기 — 손 밖 옆으로')){ evLog(W, u, x, 'slip', { leap: true, back: best.back, left: +left.toFixed(2) }); return true; }
    u.mv = { k: 'slip', ev: true, x: best.x, y: best.y, b: x.i, run: true, until: W.t + left + 0.05, m: '흘려 빠지기' };
    evLog(W, u, x, 'slip', { back: best.back, left: +left.toFixed(2) }); setMood(W, u, u.mv.m, x.i); goTo(W, u, best.x, best.y, dt); return true;
  }
  // ② 포위 빠지기
  if (!free || W.t < (u.crowdT || -9)) return false;
  const th = W.units.filter(f => seen(f) && !isFar(f) && gap(u, f) < (S.crowdR || 2) && (f.target === u || (f.act && f.act.b === u.i) || focusOf(W, f) === u));
  if (th.length < (S.crowd || 2)) return false;
  u.crowdT = W.t + (S.crowdCd || 3);
  const foes = W.units.filter(f => seen(f)), st = S.step || 2; let best = null, bs = -1e9;
  for (let k = 0; k < 12; k++){ const ang = k * Math.PI / 6, px = u.x + Math.cos(ang) * st, py = u.y + Math.sin(ang) * st;
    if (px < 0.7 || py < 0.7 || px > W.map.W - 0.7 || py > W.map.H - 0.7 || boxRock(W, px, py, u.r) || !fatClear(W.map, u.x, u.y, px, py, u.r * 0.7)) continue;
    if (foes.some(f => !isFar(f) && Math.hypot(f.x - px, f.y - py) - f.r - u.r < f.rng + 0.4)) continue;
    const sc = Math.min(...foes.map(f => Math.hypot(f.x - px, f.y - py))) + W.units.filter(m => m.alive && m.side === u.side && m !== u && Math.hypot(m.x - px, m.y - py) < 3).length * 0.4; if (sc > bs){ bs = sc; best = { x: px, y: py }; } }
  if (!best) return false;
  if (u.canLeap && W.t >= u.leapCd && leapTo(W, u, best.x, best.y, 'side', th[0], '포위 빠지기 — 빈 쪽으로')){ evLog(W, u, th[0], 'out', { n: th.length, leap: true }); return true; }
  u.mv = { k: 'out', ev: true, x: best.x, y: best.y, b: th[0].i, run: true, until: W.t + 1.2, m: '포위 빠지기' }; evLog(W, u, th[0], 'out', { n: th.length });
  setMood(W, u, u.mv.m, th[0].i); goTo(W, u, best.x, best.y, dt); return true;
}
function act2(W, u, dt){
  if (u.cz && !u.order && czBrain(W, u, dt)) return;   /* v7.23.1 세자르 */
  if (u.h2 && !u.order && h2Brain(W, u, dt)) return;   /* v8.7.4 3D 보스 기술표 */
  if (u.gwKit && !u.order && gwBrain(W, u, dt)) return;   /* v8.7.8 굿윌 (2D goodwillBrain) */
  if (u.ratOf != null && ratBrain(W, u, dt)) return;   /* v8.7.8 포렌의 쥐 (포렌의 기술로만 · 명령은 받지 않음) */
  if (u.porenKit && !u.order && porenBrain(W, u, dt)) return;   /* v8.7.8 포렌 (2D porenUpdate) */
  if (u.skill && !(u.side === 0 && u.order && u.order.k === 'skill') && emergency(W, u, dt)) return;   // v5.5.1 약 명령이 위급 자동 판단보다 먼저
  // 싸움이 없고 탄창이 반 넘게 비었으면 미리 재장전 (8칸 안에 아는 상대가 없을 때)
  if (u.magMax && !u.order && u.mag < u.magMax * 0.5 && u.ammo > u.mag && !W.units.some(f => f.alive && f.side !== u.side && dist(f, u) < 8 && (u.side === 0 ? f.seenBy : canSee(W, u, f)))){ startReload(W, u); return; }
  // 약을 받는 중인 자동 동료는 그 자리에 섬 (명령을 받은 쪽은 명령대로)
  if (!u.order && W.units.some(a => a !== u && a.alive && a.act && a.act.k === 'skill' && a.act.phase === 'wind' && a.act.b === u.i)){ stop(u); setMood(W, u, '약 받는 중'); return; }
  if (evadeMove(W, u, dt)) return;   // v7.15 회피기동 (사수 · 기동 근접)
  if (u.side === 0 && u.order){ doOrder(W, u, dt); return; }
  if (u.side === 0 && u.rally && rallyStep(W, u, dt)) return;   // v7.9.4 임시 집결
  if (u.side === 0 && offStep(W, u, dt)) return;   // v7.9.4 연락 두절 — 마지막 임무로 판단
  if (u.side === 0 && hammerStep(W, u, dt)) return;   // v7.9.4 망치 — 붙들린 상대의 옆 · 뒤로
  if (!u.order && u.fill && W.t - u.fill.t < 2.5 && !u.line){   // v5.7 쓰러진 마디 자리를 메움
    if (Math.hypot(u.fill.x - u.x, u.fill.y - u.y) > 0.25){ setMood(W, u, '틈 메움'); goTo(W, u, u.fill.x, u.fill.y, dt); return; }
    stop(u); u.fg = u.fill.face; u.fill = null; }
  if (pinDown(W, u, dt)) return;   // v5.2 쓰러진 [불사] 를 눌러 둠
  if (u.side === 0 && !u.order && formStep(W, u, dt)) return;   /* v8.7.5 대형: 편대원은 맞붙지 않았으면 제 자리 */
  if (u.side === 1 && (u.shadow || u.shadowPend) && shadowStep(W, u, dt)) return;   // v7.7 적 암살조
  if (u.side === 1 && (u.supp || u.suppPend) && suppAct(W, u, dt)) return;   // v7.7 적 사수의 견제사격 (지휘관이 시킴)
  if (u.side === 1 && !u.order && patrolStep(W, u, dt)) return;   // v7.8.1 조우 전 떠돎 (홀로 · 무리)
  if (u.side === 1 && lurkStep(W, u, dt)) return;   // v6.1 매복
  if (u.warden && u.warden.on && wardenStep(W, u, dt)) return;   /* v7.23 방 지킴이 (양쪽 같은 규칙) */
  if (u.side === 1 && clearSweep(W, u, dt)) return;   // v6.0 제 편 거구가 넓게 휘두르려 하면 부채꼴에서 비켜섬 (들어가지 않음)
  if (u.side === 1 && u.lretId != null && lretStep(W, u, dt)) return;   // v7.2 전열 조직 후퇴 (전열째 물러섬)
  if (u.side === 1 && W.plan && W.plan.k === 'withdraw' && !AI6.includes('wd') && !opPending(W, u) && withdrawStep(W, u, dt)) return;   // v6.9 포위 · 쐐기 중단 명령이 아직 안 닿은 병사는 옛 명령대로   // v6.0 후퇴 · 재집결
  if (u.side === 1 && !u.order && (wedgeStep(W, u, dt) || encircleStep(W, u, dt))) return;   // v6.1 쐐기 돌파 · 산개 포위
  if (u.side === 1 && !u.order && mvStep(W, u, dt)) return;   // v6.4 적의 기동 (포위 사냥 · 교대 · 양동 · 총구 피하기 · 끌고 오기)
  if (!u.order && holdForm(W, u, dt)) return;   // v5.4 진형 · 대치
  if (u.side === 0 && (u.canGuard || u.bodyShield) && !u.crawl && u.role === '전선' && tankAI(W, u, dt)) return;   // v5.2 큰 몸도 탱커   // v5.0 전선 역할만 탱커
  if (u.side === 1 && (u.canGuard || u.bodyShield) && !u.crawl && u.role === '전선' && !u.pack && !u.stalk && (u.state === 'hunt' || u.state === 'search') && tankAI(W, u, dt)) return;   // 적 탱커 (방패병 등)
  if (!u.order && (lineKeep(W, u, dt) || lineJoin(W, u, dt))) return;   // v5.7 자석 전열
  if (!u.order && u.jav && !u.spearHeld && retrieveSpear(W, u, dt)) return;
  if (!u.order && scavenge(W, u, dt)) return;   // v5.6 무기가 없으면 안전할 때 주움
  const hero = ancOf(W);   /* v8.7.3 기준 (주인공 · 지휘관) */
  if (u.state === 'heal' && u.target && u.target.alive){
    setMood(W, u, '치유', u.target.i);
    if (inReach(u, u.target)) startAct(W, u, u.target); else goTo(W, u, u.target.x, u.target.y, dt);
    return;
  }
  const t = u.target;
  if ((u.state === 'hunt' || u.state === 'fight') && t && t.alive){
    const see = canSee(W, u, t) || (u.side >= 1 && gap(u, t) < 0.6);
    fight(W, u, t, dt, see, false);
    if (!see && u.side >= 1 && u.last && Math.hypot(u.x - u.last.x, u.y - u.last.y) < 0.8) u.state = 'search';
    return;
  }
  if (u.side >= 1){   /* v8.7.4 2편도 찾고 · 돌아가고 · 서성임 */
    if (u.state === 'hunt') u.state = 'search';
    if (u.state === 'search'){
      u.searchT -= dt;
      if (u.last && Math.hypot(u.x - u.last.x, u.y - u.last.y) > 0.8 && u.searchT > 0){
        // 우회하는 적은 불빛 가장자리 (어둠의 끝) 까지만
        let gx = u.last.x, gy = u.last.y;
        if (u.stalk){ const n = 12; for (let k = 1; k <= n; k++){ const q = k / n, x = u.x + (u.last.x - u.x) * q, y = u.y + (u.last.y - u.y) * q; if (litAt(W, x, y)){ const q0 = (k - 1) / n; gx = u.x + (u.last.x - u.x) * q0; gy = u.y + (u.last.y - u.y) * q0; break; } } }
        if (Math.hypot(gx - u.x, gy - u.y) > 0.3){ setMood(W, u, u.stalk ? '어둠 속 접근' : '수색'); goTo(W, u, gx, gy, dt); } else { stop(u); setMood(W, u, '숨어 지켜봄'); }
      }
      else if (u.searchT <= 0){ u.state = 'return'; setMood(W, u, ''); }
      else { stop(u); setMood(W, u, '수색'); }
      return;
    }
    if (u.state === 'return'){
      if (Math.hypot(u.x - u.home.x, u.y - u.home.y) > 0.6){ setGoal(W, u, u.home.x, u.home.y); follow(W, u, dt); } else { u.state = 'idle'; stop(u); }
      return;
    }
    u.wander -= dt;
    if (u.wander <= 0){ u.wander = 2 + W.rand() * 4; const a = W.rand() * 6.283, r = W.rand() * 1.2; const gx = u.home.x + Math.cos(a) * r, gy = u.home.y + Math.sin(a) * r; if (!rock(W.map, gx, gy)) setGoal(W, u, gx, gy); }
    if (u.path) follow(W, u, dt, 0.35);
    return;
  }
  // 횃불을 든 동료가 없으면, 4칸 안에 떨어진 횃불을 주우러 감 (자동일 때)
  if (!W.units.some(a => a.alive && a.side === u.side && a.torch)){ const tc = nearTorch(W, u, 4); if (tc){ if (Math.hypot(tc.x - u.x, tc.y - u.y) <= 0.7) pickTorch(W, u, tc); else { setMood(W, u, '횃불 줍기'); goTo(W, u, tc.x, tc.y, dt); } return; } }
  if (!(u.mood === '살핌' && W.units.some(f => f.alive && f.side !== u.side && fresh(W, u.sense[f.i])))) setMood(W, u, '');
  // 아군: 총성을 들었으면 그쪽을 봄
  if (u.heard && W.t - u.heard.t < 1.5 && !u.path) u.fg = Math.atan2(u.heard.y - u.y, u.heard.x - u.x);
  if (u.side === 0 && u.role !== '전선' && !u.stay && behindCover(W, u, dt)) return;
  if (u.state === 'stay' && u.stay){   // 지키는 자리로 돌아와 섬 (살핌은 act 에서)
    if (Math.hypot(u.x - u.stay.x, u.y - u.stay.y) > 0.4){ setMood(W, u, '자리로'); goTo(W, u, u.stay.x, u.stay.y, dt); } else stop(u);
    return;
  }
  const HL = leadOf(W, u) || (hero !== u ? hero : null);   // v7.10 편대원은 부대장을 따라감
  if (u.state === 'follow' && HL){
    // 탱커는 주인공 앞에서, 나머지는 뒤에서
    const ang = u.canGuard ? (HL.face || 0) + (u.slot % 2 ? 0.35 : -0.35) * Math.floor(u.slot / 2) : (u.slot % 2 ? 1 : -1) * (0.6 + 0.5 * Math.floor(u.slot / 2)) + Math.PI + (HL.face || 0);
    const dk = W.rules.glare && !AI6.includes('glare') && u.nv && isFar(u) && HL.torch && !HL.torchOff, fd = dk ? (W.rules.glare.keep || 3.9) : u.canGuard ? 1.5 : 1.4;   // v7.8 야시 사수는 횃불에서 떨어져 걸음 (눈이 어둠에 익은 채)
    let gx = Math.max(0.6, Math.min(W.map.W - 0.6, HL.x + Math.cos(ang) * fd)), gy = Math.max(0.6, Math.min(W.map.H - 0.6, HL.y + Math.sin(ang) * fd));   // v7.8 자리가 판 밖이면 판 안으로
    if (boxRock(W, gx, gy, u.r * 0.9)){ gx = HL.x; gy = HL.y; }
    if (dist(u, HL) > (dk ? fd + 0.35 : 2.2) || (u.path && dist(u, HL) > (dk ? fd + 0.1 : 1.6)) || (dk && dist(u, HL) < fd - 1)){ setGoal(W, u, rock(W.map, gx, gy) ? HL.x : gx, rock(W.map, gx, gy) ? HL.y : gy); follow(W, u, dt); } else stop(u);   // v7.8 간격은 주인공이 기다리는 거리 (4.5칸) 안쪽으로 — 서로 기다리다 멈추지 않게
    return;
  }
  if (u.state === 'explore' && (hero === u || !hero)){
    u.pathT2 = (u.pathT2 || 0) - dt;
    // 총성을 들었으면 (8초 안) 그 자리로 가 봄 — 횃불로 쏜 쪽을 비추려고. 쏜 쪽이 옮겨 갔으면 거기엔 없음
    if (u.heard && W.t - u.heard.t < 8 && Math.hypot(u.heard.x - u.x, u.heard.y - u.y) > 1.2){
      setMood(W, u, '수색'); setGoal(W, u, u.heard.x, u.heard.y);
      if (hero !== u || !W.units.some(a => a.alive && a.side === 0 && a !== u && !a.summon && !a.order && dist(a, u) > 4.5)) follow(W, u, dt);   // v7.8 기다리는 건 횃불을 든 주인공만 (주인공이 없으면 서로 기다리다 멈추던 것 고침)
      return;
    }
    if (!u.path || !u.path.length || u.pathT2 <= 0){
      u.pathT2 = 1.5;
      const qt = W.t - u.quiet < 3;   // v7.9 교전 보류 중이면 적 쪽으로 가지 않음 (안 가본 곳만 살핌)
      const f = hero === u ? (W.cleared && (!W.exitHide || W.exitSeen) ? null : frontier(W, u)) || (qt ? null : nearestFoe(W, u)) : (qt ? null : nearestFoe(W, u));   /* v8.7.3 끝난 맵: 출구를 알면 (처음부터 보이는 출구 포함) 더 둘러보지 않음 — 숨은 출구를 못 찾았을 때만 둘러봄 */   // 횃불 없는 동료는 남은 적 쪽으로 더듬어 감
      if (f) setGoal(W, u, f.x, f.y); else stop(u);
    }
    let lag = hero === u && W.units.some(a => a.alive && a.side === 0 && a !== u && !a.summon && !a.down && !a.crawl && !a.order && dist(a, u) > 4.5);   // v7.8 주인공만 처진 동료를 기다림
    if (lag){ u.lagT = (u.lagT || 0) + dt; if (u.lagT > 3) lag = false; } else u.lagT = 0;   // v7.8 3초 넘게 기다려도 안 오면 (막혔음) 그냥 감
    const fw = !lag && formLed(W, u) && u.path && u.path.length ? formWait(W, u) : false;   /* v8.7.5 대형이 70% 아래면 기다림 */
    if (fw) setMood(W, u, '대형을 기다림'); else if (!lag) follow(W, u, dt);
  }
}
function frontier(W, u){
  const m = W.map, Wd = m.W, s = (u.y | 0) * Wd + (u.x | 0), seen = new Uint8Array(m.W * m.H), q = [s], dd = new Int32Array(m.W * m.H); seen[s] = 1;
  const F = W.found || W.explored, tch = u.torch && !u.torchOff, unk = p => !F[p] || (tch && W.explored[p] !== 2);   /* v8.7.3 다 그려진 지도라도 실제로 본 적 없는 곳 */
  for (let h = 0; h < q.length; h++){
    const p = q[h], x = p % Wd, y = (p / Wd) | 0;
    if (dd[p] >= 3 && unk(p)) return { x: x + 0.5, y: y + 0.5 };
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx = x + dx, ny = y + dy, np = ny * Wd + nx; if (!rock(m, nx, ny) && !seen[np]){ seen[np] = 1; dd[np] = dd[p] + 1; q.push(np); } }
  }
  return null;
}
function nearestFoe(W, u){   // v7.9.5 아는 적만 (보았거나 · 냄새 · 외침 · 총성으로 안 것 8초 안) — 전지하게 가장 가까운 적을 향해 가지 않음. 아는 곳 (대략) 으로
  let b = null, bd = 1e9; for (const f of W.units) if (f.alive && f.side !== u.side){ const s = u.sense[f.i], pos = f.seenBy || canSee(W, u, f) ? f : fresh(W, s, 8) ? s : null; if (!pos) continue; const d = Math.hypot(pos.x - u.x, pos.y - u.y); if (d < bd){ bd = d; b = pos; } }
  return b ? { x: b.x, y: b.y } : null;
}
// [불사] 일어남: 체력 pct (없으면 undying.hp) · 상처가 사라짐 · 자세 다시
// v5.5.1 일어나는 피: undying.move (최대 체력 비율) · 거기까지 걸리는 초 (지금 피에서, 아무도 안 칠 때)
const undMove = W => { const U = W.rules.undying || {}; return U.move != null ? U.move : 0.15; };
const undEta = (W, t) => Math.max(0, (t.max * undMove(W) - t.hp) / Math.max(1e-6, t.max * (t.regen > 0 ? t.regen : (W.rules.undying || {}).regen || 0.025)));
function rise(W, t, pct, cure){
  if (t.heretic) karHeretic(W, t, false);   /* v8.7.8 일어나면 공격 · 걸음 배수가 처음으로 — 불경자도 풂 (다시 15% 아래면 다시) */   /* v8.7.7 cure: 중상 (부상 · 쇼크 · 출혈 · 내출혈 · 화상 · 기절) 도 나음 — 잃은 눈 · 팔은 그대로 */
  t.alive = true; t.down = false; t.riseT = null; t.hp = Math.max(1, pct != null ? Math.max(t.hp, Math.round(t.max * pct)) : t.hp);   // v5.5.1 재생해 찬 그 적은 피로 (구급상자는 pct 까지)
  t.wounds = []; t.atkMul = 1; t.spdMul = 1; t.proneT = -9; t.kb = null; t.crawl = false; t.legLoss = null; t.act = null; t.pinT = -9; t.post = Math.max(t.post, 40); t.brokenT = -9; t.state = 'idle'; t.target = null;
  if (cure){ t.inj = []; t.shock = 0; t.ibleed = null; t.bleed = null; t.burn = null; t.koT = null; t.deathKind = null; t.headAt = null; try { injRecalc(W, t); } catch (e) {} }
  L(W, { k: 'rise', a: t.i, hp: Math.round(t.hp), ...(cure ? { cure: true } : {}), vis: t.side === 0 || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '일어남', c: 'h', t0: W.t });
}
function checkEnd(W){
  if (W.camp){   // v7.21 캠페인 판: 적을 다 쓰러뜨려도 끝나지 않음 ('끝난 맵' — 정리하고 원할 때 이동) · 아군이 모두 나가거나 쓰러지면 끝 · 시간 제한 없음
    const a = W.units.some(u => u.alive && u.side === 0), b = W.units.some(u => u.alive && u.side >= 1);   /* v8.7.4 2편 (각혈) 도 쓰러뜨려야 정리 */
    if (!b && !W.cleared && !W.holdClear){ W.cleared = true; W.clearT = W.t; for (const s of W.units) if (s.side === 0 && s.stay) s.stay.old = true; L(W, { k: 'cleared', vis: true }); }   /* v8.7.3 */   /* v7.23.1 holdClear: 아직 끝나지 않은 맵 (관 속의 왕) */
    if (!a){ W.over = true; W.result = W.units.some(u => u.side === 0 && u.gone && u.gone !== 'left' && u.gone !== 'merge') ? 'exit' : 'lose'; }
    return W.over; }
  // v5.5.1 쓰러진 [불사] 는 셈에서 빠짐 (일어날 때까지) — 아군이 다 쓰러지면 진짜 죽음
  const up = u => u.alive;
  const a = W.units.some(u => up(u) && u.side === 0), b = W.units.some(u => up(u) && u.side >= 1);
  if (!a){ W.over = true; W.result = 'lose'; }
  else if (!b){ W.over = true; W.result = 'win'; }
  else if (W.t >= W.rules.tmax){ W.over = true; W.result = 'time'; }
  return W.over;
}
function dropTorch(W){
  const h = W.spareBy != null ? W.units[W.spareBy] : null; if (!h || !h.alive || W.spare <= 0) return false;   // v7.8.5 꾸러미를 지닌 이가 내려놓음
  W.torches.push({ x: h.x, y: h.y, dropped: true }); W.spare--; L(W, { k: 'torchPlace', a: h.i, x: h.x, y: h.y, n: W.spare });
  computeLight(W); return true;
}

function stepWorld(W, dt){
  if (W.over) return;
  W.t += dt;
  const R = W.rules;
  W.lightT -= dt; if (W.lightT <= 0){ W.lightT = 0.1; computeLight(W); markExplored(W); }
  W.thinkT -= dt;
  const doThink = W.thinkT <= 0; if (doThink){ W.thinkT = 0.2; intelTick(W); }   // v6.3 아는 것
  W.sqT = (W.sqT || 0) - dt; if (W.sqT <= 0){ W.sqT = (R.squad || {}).t || 0.5; planSquads(W); alarmTick(W); planStance(W); planPacts(W); callouts(W); lretAI(W); dinTick(W); posKnownTick(W); engTick(W); netTick(W); deputyTick(W); hmTick(W); rallyTick(W); planShadow(W); suppAI(W); roamMeet(W); }   // v5.5 아군 시야 연동 (브리핑)   // v5.4 진형 · 대치   // v5.2 적의 조 나누기
  for (const u of W.units){ u.px = u.x; u.py = u.y; }
  cmdTick(W); tgTick(W);   /* v8.7.3 예고 회피 */   // v7.4 아군 명령이 닿음 (또는 못 받음)
  torchTick(W);   // v7.5 횃불을 켜고 끔
  assnFoundTick(W);   // v7.6 암살당한 시신을 동료가 봄
  stealthFeel(W);   // v7.8.3 들킴을 느낌
  lieTick(W, dt);   // v7.11 포복: 자세 바꿈 · 관측 기회 · 놓침 · 스스로 일어남
  watchTick(W);   // v7.7 사주경계 (뒤돌아봄)
  lretTick(W, dt);   // v7.2 전열 조직 후퇴: 닻을 옮김 (처진 마디를 기다림)
  formTick(W, dt);   /* v8.7.5 대형 */
  W.fbT = (W.fbT || 0) - dt; if (W.fbT <= 0){ W.fbT = 0.2; fbTick(W); comboTick(W); }   /* v8.7.5 진형 · 조합 버프 */
  for (const u of W.units){
    if (!u.alive) continue;
    if (doThink && !u.act) think(W, u);
    else if (doThink && u.smellG){ smellTick(W, u); if (u.side === 0 && W.t - u.briefAt >= W.rules.briefT) brief(W, u); }   /* v8.7.2 후각은 움직이는 중에도 */
    act(W, u, dt);
  }
  if (W.spins && W.spins.length) stepSpins(W, dt);   // v7.22.2 회전 투척 (v7.22.3 피의 검기도)
  if (W.flails && W.flails.length) stepFlails(W, dt);   /* v7.24.1 철퇴 */
  if (W.pools && W.pools.length) stepPools(W, dt);   // v7.22.3 핏빛 장판
  if (W.h2z && W.h2z.length) stepH2Z(W);   /* v8.7.4 망각의 그림자 */
  for (const u of W.units) if (u.alive && u.kb) stepKb(W, u, dt);   // v5.2 밀려나 날아가는 몸
  W.lnT = (W.lnT || 0) - dt; if (W.lnT <= 0){ W.lnT = 0.25; planLines(W); pickWards(W); }   // v5.7 전열
  lineOpportunity(W);   // v5.7 교전 구속
  for (const u of W.units) if (u.alive && u.bleed) stepBleed(W, u, dt);   // v5.5 출혈
  for (const u of W.units) if (u.alive && u.burn) stepBurn(W, u, dt);   // v6.7 화상
  karWorld(W);   /* v8.7.8 근성 중에 싸움이 끝나면 쓰러져 살아남음 */
  porenTick(W, dt);   /* v8.7.8 포렌: 충성 · 쥐 망토 · 표식 · 방벽 · 포박 · 기억하는 쥐 */
  zapTick(W);   /* v8.7.8 감전 (푸른 번개 · 적뢰 · 잔류) */
  for (const u of W.units) if (u.alive && (u.ibleed || u.inj || u.bled || u.koT)) stepInj(W, u, dt);   // v6.9 내출혈 · 쇼크 · 의식
  for (const u of W.units) if (u.alive && u.recoil && !u.kb) stepRecoil(W, u, dt);   // v6.7 팜 버스트 반동
  stepShots(W, dt);
  // [불사]: 쓰러진 쪽은 때가 되면 일어나고, 살아 있으면 조금씩 재생
  // v5.5.1 [불사]: 쓰러진 채로도 재생 → 피가 move 에 이르면 일어남. 아군이 하나도 없으면 진짜 죽음
  stepFlora(W, dt);   // v7.19.2 역장 · 뿌리 벽 · 열매
  for (const u of W.units) if (u.alive && u.skill && u.skill.regen > 0 && u.skill.left < u.skill.pool) u.skill.left = Math.min(u.skill.pool, u.skill.left + u.skill.regen * dt);   // v7.19 저절로 차는 약 (옐로의 양동이)
  if (W.t >= (W.rpNext || 0)){ const RD = W.rules.radar || {}; W.rpNext = W.t + (RD.gap || 3);   /* v8.4.0 [레이더] 맥박 */
    for (const u of W.units) if (u.alive && u.radar && !u.gone){ u.rpLast = W.t; for (const e of W.units) if (e.alive && !e.gone && e.side !== u.side && Math.hypot(e.x - u.x, e.y - u.y) <= (RD.r || 14)) (e.rpT || (e.rpT = [0, 0]))[u.side] = W.t + (RD.dur || 1.2); } }
  for (const u of W.units) if (u.alive && u.regenHp > 0 && u.hp < u.max){ const hk = holyOf(u) ? (W.seal ? 0 : authK(W, u)) : 1; if (hk > 0) u.hp = Math.min(u.max, u.hp + u.regenHp * hk * dt); }   /* v8.7.4 신성의 재생 (성해포): 왕관 앞에선 authW 만큼 · 권위 (봉인) 중엔 멎음 */   /* v8.3.0 성해포 (재생D — 초당 일정량, 몸 전체 재생은 아님) */
  for (const u of W.units){ if (!u.undying && !(u.regen > 0)) continue; const rg = u.max * (u.regen > 0 ? u.regen : (W.rules.undying || {}).regen || 0) * dt;   // v5.7.1 [재생]
    if (u.down){
      if (!W.units.some(o => o.alive && o !== u && o.side === u.side)){ u.down = false; u.hp = 0; u.deadT = W.t; L(W, { k: 'die', a: u.i, b: u.i, ff: false, last: true, alone: true }); continue; }
      u.hp = Math.min(u.max, u.hp + rg); if (u.hp >= u.max * undMove(W)) rise(W, u);
    } else if (u.alive && u.hp < u.max) u.hp = Math.min(u.max, u.hp + rg); }
  separate(W);
  for (const u of W.units) if (u.alive){ turnTo(W, u, dt); const sp = Math.hypot(u.vx || 0, u.vy || 0), ST = W.rules.stamina;
    if (ST && !u.undead){ if (u.sta == null) u.sta = 100;   // v7.8.1 [망자] 는 숨이 차지 않음
      const run = (sp > u.spd * (u.spdMul || 1) * 1.08 || sp > (ST.jog || 99)) && !(u.act && u.act.k === 'charge') && !u.kb;   // v6.5 질주 숨: 서둘러 뛰면 줄고, 걷거나 서 있으면 참 (돌진 · 날아감은 따로)
      u.sta = Math.max(0, Math.min(u.staCap || 100, u.sta + (run ? -ST.drain : (sp > 0.3 ? ST.walk : ST.rest) * (u.staRegen || 1)) * dt));   // v6.9 폐 관통 (45까지) · 갈비뼈 (반만 참)
      if (!u.winded && u.sta < ST.low){ u.winded = true; L(W, { k: 'winded', a: u.i, vis: u.side === 0 || !!u.seenBy }); }
      else if (u.winded && u.sta >= ST.back){ u.winded = false; L(W, { k: 'breath', a: u.i, vis: u.side === 0 || !!u.seenBy }); } }
    const F = FATR(W); if (F && (u.fat || 0) > 0 && !AI6.includes('fat') && !(u.act && ['atk', 'charge', 'bash', 'throw', 'palm'].includes(u.act.k))){   // v6.6 지침 풀림: 맞붙지 않고 걸으면 · 쉬면 · (맞붙어 막기만 하면 조금)
      const eng = W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < Math.max(isFar(u) ? 0.3 : u.rng, f.rng) + 0.6);
      u.fat = Math.max(0, u.fat - (eng ? F.recGuard : sp > 0.3 ? F.recWalk : F.recRest) * dt); fatState(W, u); } }
  for (const u of W.units){
    // 속도 (조준 · '이동 막기' 판단용) · 방어 자세 회복 (1초 동안 안 막았으면 초당 postRegen, 무너졌다 일어나면 40부터)
    u.vx = u.vx * 0.7 + 0.3 * (u.x - u.px) / dt; u.vy = u.vy * 0.7 + 0.3 * (u.y - u.py) / dt;
    if (!u.alive || !u.canGuard) continue;
    updateGuard(W, u);   // v5.7 막기는 선택
    if (u.brokenT > 0 && W.t >= u.brokenT){ u.post = Math.max(u.post, u.vet ? VETR(W).back : 40); u.brokenT = -9; L(W, { k: 'guardBack', a: u.i, vis: u.side === 0 || !!u.seenBy }); }
    if (W.t >= u.brokenT && W.t - u.blockT > 1) u.post = Math.min(100, u.post + R.postRegen * (u.vet ? VETR(W).regen : 1) * dt);
  }
  for (const e of W.units) if (e.side !== 0){   /* v8.7.4 2편도 (아군이 본 것만 보임) */
    const s = e.alive && W.units.some(a => a.alive && a.side === 0 && !a.posUnk && canSee(W, a, e));   // v7.5 지휘관과 닿지 않는 아군이 본 것은 아직 모름
    // 기록은 0.4초 넘게 이어질 때만 (빛 가장자리에서 들락날락하면 한 번만). 보이는지는 바로 바뀜
    if (e.alive && s !== e.visLog){ if (e.visPend == null) e.visPend = W.t; if (W.t - e.visPend >= 0.4){ L(W, { k: s ? 'seen' : 'hidden', a: e.i }); e.visLog = s; e.visPend = null; } } else e.visPend = null;
    e.seenBy = s;
    e.sil = s && !litAt(W, e.x, e.y) && !W.units.some(a => a.alive && a.side === 0 && !a.posUnk && clearSee(W, a, e));   // v7.7 어스름 속 실루엣만 (누구인지 모름)
    if (s && !W.contact0){ const sp = W.units.filter(a => a.alive && a.side === 0 && canSee(W, a, e)).sort((a, b) => dist(a, e) - dist(b, e))[0]; W.contact0 = { t: W.t, a: sp ? sp.i : null, b: e.i }; L(W, { k: 'contact', side: 0, a: sp ? sp.i : null, b: e.i, d: sp ? +dist(sp, e).toFixed(1) : null, dir: sp ? dirName(e.x - sp.x, e.y - sp.y) : '', vis: true }); }   // v6.2 우리 쪽이 처음 적을 봄
    // 조우 + 교전 시작 (보이는 상태에서 아군을 쫓거나 맞음) → 이후로 체력이 보임
    if (s && !e.engaged && (e.state === 'hunt' || e.taken > 0)){ e.engaged = true; L(W, { k: 'engage', a: e.i }); }
  }
  for (const u of W.units) if (u.side === 0){ u.ordLive = u.order; if (u.order && (!u.mission || u.mission.o !== u.order)) u.mission = { o: u.order, k: u.order.k, t: W.t, x: u.order.x, y: u.order.y, b: u.order.b }; }   // v7.9.2 임무 = 마지막으로 받은 명령   // v7.4 지금 받아 따르는 명령 (새 명령이 닿기 전엔 이대로)
  if (W.noises.length) W.noises = W.noises.filter(n => W.t - n.t0 < R.noiseTime);
  if (W.fxOn) W.fx = W.fx.filter(f => W.t - f.t0 < 1.5);
  checkEnd(W);
}

/* ---------- v6.9 부상 모델: 손상 방식 (절삭 · 관통 · 둔력) → 맞은 자리 (머리: 두개 · 얼굴 · 목 / 몸통: 가슴 · 배 · 등 / 팔 · 다리) → 조직 → 기능 → 시간에 따른 경과 (출혈 · 쇼크 · 의식) ---------- */
// 피해량 (체력) 과 기능 손상은 따로: 같은 50 피해라도 목을 베였는지 · 갈비뼈가 부러졌는지 · 뇌가 꿰뚫렸는지에 따라 결과가 다름.
// 갑옷은 손상 방식마다 다르게 받음 (판금은 칼날을 막아도 충격은 거의 그대로 전함). [불사] · [재생] 은 몸이 되살아나 남는 부상이 없음 (치명상이면 쓰러졌다 다시).
const WR = W => W.rules.wound || null;
const WTXT = { decap: '목이 잘림', crush: '머리가 으깨짐', brain: '뇌 관통', cleave: '두개골이 쪼개짐', heart: '심장 관통', neck: '목뼈가 부러짐', throat: '목이 베임', throatP: '목이 꿰뚫림', face: '얼굴이 갈라짐', lungs: '가슴 관통', chestCut: '가슴이 깊이 갈림', ribs: '가슴이 함몰됨', gut: '배가 갈림', gutP: '배를 꿰뚫림', organ: '장기가 터짐', spine: '등뼈가 끊김', incap: '전투불능', bleed: '출혈', burn: '화상', shock: '쇼크' };
// 숨을 끊은 한 방이 어떤 상처였나 (이미 체력으로 쓰러진 경우): 맞은 자리 × 가장 큰 손상 방식
function woundKill(W, a, t, o, zone, sc, sp, sb){
  const m = sb >= sp && sb >= sc ? 'b' : sp >= sc ? 'p' : 'c', heavy = !/단검|나이프|칼$/.test(a.weaponNow || a.weapon || '') || a.bladeHands;
  if (zone === 'neck') return m === 'c' ? (heavy && (sc >= 0.25 || o.crit) ? 'decap' : 'throat') : m === 'p' ? 'throatP' : 'neck';   /* v8.7.3 찌름 · 총 · 화살은 꿰뚫음 (베임은 칼날) */
  if (zone === 'skull') return m === 'b' ? 'crush' : m === 'p' ? 'brain' : 'cleave';
  if (zone === 'face') return m === 'b' ? 'crush' : m === 'p' ? 'brain' : 'face';
  if (zone === 'chest') return m === 'b' ? 'ribs' : m === 'p' ? (o.vital === '심장' || W.rand() < 0.3 ? 'heart' : 'lungs') : 'chestCut';
  if (zone === 'belly') return m === 'b' ? 'organ' : m === 'p' ? 'gutP' : 'gut';
  if (zone === 'spine') return 'spine';
  return null;
}
function woundMix(W, a, t, o){
  const M = WR(W).mix;
  if (o.jav) return o.kn ? M.knife : M.jav;
  const wk = o.wk || '맨손';
  if (o.far) return wk === '총포류' ? M.gun : wk === '활' ? M.arrow : M[wk] || M['맨손'];
  const wn = a.weaponNow || a.weapon || '';
  if (wk === '날붙이' && /창$/.test(wn) && !unarmed(a)){ o.mode = '찌르기'; return M.spear; }
  if (wk === '날붙이' && /단검$/.test(wn) && !unarmed(a)){ o.mode = W.rand() < 0.5 ? '찌르기' : '베기'; return M.dagger; }
  if (wk === '날붙이' && !a.bladeHands){ const arm = t.gear && t.gear['몸'] && t.gear['몸'].tier >= 2; if (arm && W.rand() < 0.5){ o.mode = '찌르기'; return M.thrust; } o.mode = '베기'; return M.slash; }   // 갑옷 입은 상대는 반쯤 틈으로 찌름
  return M[wk] || M['맨손'];
}
function woundPass(W, t, part, pen){
  const it = t.gear && t.gear[part === '머리' ? '머리' : '몸']; if (!it) return [1, 1, 1];
  const P = (WR(W).pass || {})[it.mat] || [0.5, 0.6, 0.9], k = Math.min(1, it.tier / 3);
  return P.map((v, i) => 1 - (1 - v) * k * (i === 1 && pen ? 0.2 : 1));   // 꿰뚫은 화살 · 총알도 갑옷에 힘을 조금 잃음
}
function woundZone(W, t, part, dir){
  const Z = WR(W).zone || {};
  if (part === '머리'){ const z = Z.head || [0.62, 0.26, 0.12], neck = z[2] * (dir === 'back' ? 2 : dir === 'side' ? 1.4 : 1), r = W.rand() * (z[0] + z[1] + neck); return r < z[0] ? 'skull' : r < z[0] + z[1] ? 'face' : 'neck'; }
  if (part === '몸통'){ if (dir === 'back' && W.rand() < (Z.spine != null ? Z.spine : 0.3)) return 'spine'; return W.rand() < (Z.chest != null ? Z.chest : 0.5) ? 'chest' : 'belly'; }
  return part === '팔' ? 'arm' : part === '다리' ? 'leg' : 'chest';
}
const ZONE_K = { skull: '머리', face: '얼굴', neck: '목', chest: '가슴', belly: '배', spine: '등 (척추)', arm: '팔', leg: '다리' };
// 부상 하나를 남김 (상세 · 판 그림 · 로그)
function woundAdd(W, a, t, k, txt, eff, extra){
  if (AI6.includes('wsub')) return null;   // 시험용
  t.inj = t.inj || []; const w = { k, txt, t: W.t, ...(extra || {}) }; t.inj.push(w); if (!t.wounds.includes(txt)) t.wounds.push(txt);
  L(W, { k: 'wound', a: a ? a.i : null, b: t.i, w: k, txt, eff: eff || [], zone: extra && extra.zone || null, mode: extra && extra.mode || null, vis: t.side === 0 || !!t.seenBy });
  if (W.fxOn && extra && extra.fx) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.25, s: extra.fx, c: 'd', t0: W.t });
  injRecalc(W, t); return w;
}
// 치명상: 살아 있으면 그 자리에서 쓰러뜨림 (머리가 여럿이면 그 머리를 잃음 · [불사] 는 쓰러졌다 다시), 이미 쓰러졌으면 어떻게 죽었는지만 남김
function woundFatal(W, a, t, kind, o){
  if (AI6.includes('wfat')) return;   // 시험용
  if ((t.traits || []).includes('보스') && t.alive){ const dmg = Math.max(1, Math.round(bossRef(W, t) * ((W.rules.vital || {}).bossFatal || 0.15)));   /* v7.25.0 [보스]: 치명상이어도 즉사하지 않음 — 큰 피해 */
    applyDmg(W, a, t, dmg, { ff: a.side === t.side, far: !!o.far, part: o.part || null, tag: WTXT[kind] + ' — 버팀 (큰 피해)' }); L(W, { k: 'bossFatal', a: a.i, b: t.i, how: kind, dmg, vis: t.side === 0 || !!t.seenBy });
    if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.3, s: '버팀!', c: 'd', t0: W.t }); return; }
  if ((t.heads || 1) > 1 && ['decap', 'crush', 'brain', 'cleave'].includes(kind) && t.alive){   // 머리 넷 (카리우스): 그 머리를 잃음
    t.heads--; t.eyes = Math.max(0, t.eyes - 2); t.eyeLost = Math.min(t.eyeLost, t.eyes); if (t.eyes && t.eyeLost >= t.eyes) t.blind = true; t.wounds.push('머리 하나를 잃음 (' + WTXT[kind] + ')');
    applyDmg(W, a, t, Math.max(1, Math.round(t.max * ((W.rules.vital || {}).headLoss || 0.2))), { ff: a.side === t.side, far: !!o.far, part: '머리', tag: WTXT[kind] + ' — 머리 하나를 잃음' });
    L(W, { k: 'headLost', a: a.i, b: t.i, left: t.heads, how: kind, vis: t.side === 0 || !!t.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '머리 하나 — ' + WTXT[kind] + '!', c: 'd', t0: W.t }); return;
  }
  if (t.alive){ t.deathKind = kind; if (kind === 'decap'){ const g = W.rand() * 6.283; t.headAt = { x: +(t.x + Math.cos(g) * 0.55).toFixed(2), y: +(t.y + Math.sin(g) * 0.55).toFixed(2) }; }
    applyDmg(W, a, t, Math.max(1, Math.ceil(t.hp)), { ff: a.side === t.side, far: !!o.far, part: o.part || null, tag: WTXT[kind], death: kind }); }
  else if (!t.down && !t.deathKind){ t.deathKind = kind; if (kind === 'decap'){ const g = W.rand() * 6.283; t.headAt = { x: +(t.x + Math.cos(g) * 0.55).toFixed(2), y: +(t.y + Math.sin(g) * 0.55).toFixed(2) }; }
    for (let i = W.log.length - 1; i >= 0 && i >= W.log.length - 12; i--){ const l = W.log[i]; if (l.k === 'die' && l.b === t.i){ l.how = kind; break; } } }   // 방금 남긴 '쓰러짐' 에 어떻게를 붙임
  else return;
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.3, s: WTXT[kind] + '!', c: 'd', t0: W.t });
}
// 기절 (의식을 잃음): sec 초 동안 쓰러져 아무것도 못 함 (Infinity = 깨워 주기 전까지)
function knockOut(W, a, t, sec, why){
  if (!t.alive || t.crawl) return;
  t.koT = W.t + sec; t.proneT = Math.max(t.proneT, W.t + sec); interrupt(W, t, '의식을 잃어 준비가 끊김'); stop(t); t.raised = false;
  L(W, { k: 'ko', a: a ? a.i : null, b: t.i, sec: isFinite(sec) ? +sec.toFixed(1) : null, why, vis: t.side === 0 || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '기절!', c: 'd', t0: W.t });
}
// 부상에서 나오는 배율 (준비 · 조준 · 속력 · 자세 · 숨) — 다시 셈
function injRecalc(W, t){
  let wind = 1, aim = 1, spd = 1, post = 1, staCap = 100, staRegen = 1, noRun = false;
  for (const w of t.inj || []){
    if (w.k === 'daze' && W.t < w.until){ wind *= 1.15; aim *= 0.8; }
    if (w.k === 'rib'){ wind *= 1.1; post *= 1.2; staRegen *= 0.5; }
    if (w.k === 'lung'){ staCap = Math.min(staCap, 45); wind *= 1.05; }
    if (w.k === 'legBreak'){ noRun = true; }
  }
  const sh = t.shock || 0; if (sh >= 1){ wind *= sh >= 2 ? 1.25 : 1.1; aim *= sh >= 2 ? 0.75 : 0.9; spd *= sh >= 2 ? 0.8 : 1; }
  t.injWind = wind; t.injAim = aim; t.injSpd = spd; t.injPost = post; t.staCap = staCap; t.staRegen = staRegen; t.noRun = noRun; maimAim(t);
}
// 맞은 뒤 부상 판정 (strike · 짓뭉갬 · 짓밟기 끝에서)
function woundRoll(W, a, t, o, dmg, part, crit, pen, mix0){
  const R = WR(W); if (!R || t.marble || AI6.includes('wound') || !part || o.block || o.ff && o.tag === '부딪힘') return;
  const whole = wholeBody(t), mix = o.deflect ? [0, 0, 1] : mix0 || woundMix(W, a, t, o), pass = woundPass(W, t, part, pen), raw = dmg / Math.max(0.15, o.deflect ? 1 : o.armPure != null ? o.armPure : o.armMul || 1) / Math.max(0.5, ((W.rules.parts || {})[part] || {}).mul || 1) / Math.max(1, t.max);   // 힘 = 갑옷 · 부위 배율을 걷어낸 피해 (머리 ×2 는 자리의 몫이라 힘이 아님)
  const sc = raw * mix[0] * pass[0], sp = raw * mix[1] * pass[1], sb = raw * mix[2] * pass[2], res = maimRes(W, t), zone = o.vital === '심장' ? 'chest' : o.vital === '머리' && part === '머리' ? 'skull' : woundZone(W, t, part, o.dir), Z = { zone, mode: o.mode || null };   /* v8.7.3 급소 = 그 부위 */
  const rnd = p => W.rand() < p, alive = t.alive;
  if (t.noOrg && ['neck', 'skull', 'face', 'chest', 'belly'].includes(zone)) return;   /* v8.7.3 [무장기]: 장기 · 머리 · 목의 상처 없음 (팔다리만) */
  if (!alive){ if (!t.down && !t.deathKind){ const k = woundKill(W, a, t, o, zone, sc, sp, sb); if (k) woundFatal(W, a, t, k, o); } return; }   // 이 한 방에 쓰러짐 → 어떤 상처였는지
  if (zone === 'neck'){
    if (sc >= 0.3 && (crit || sc >= 0.45) && rnd(Math.min(0.85, (sc - 0.2) * 2) * res)) return woundFatal(W, a, t, 'decap', o);
    if (sb >= 0.35 && rnd(0.4 * res)) return alive && !whole && rnd(0.5) ? woundIncap(W, a, t, '목뼈가 부러짐') : woundFatal(W, a, t, 'neck', o);
    if (alive && !whole && sc + sp >= 0.12 && rnd(0.6)){ startBleed(W, t, a.i, 4); woundAdd(W, a, t, 'artery', '목 — 경동맥이 끊김', ['피가 뿜어져 나옴 (초당 최대 체력 8%) — 지혈하지 않으면 몇 초 안에 쓰러짐'], { ...Z, fx: '경동맥!' }); }
    return;
  }
  if (zone === 'skull'){
    if (sb >= 0.45 && rnd(Math.min(0.8, (sb - 0.35) * 2.5) * res)) return woundFatal(W, a, t, 'crush', o);
    if (sp >= 0.18 && rnd(Math.min(0.85, (sp - 0.1) * 3))) return alive && !whole && rnd(0.4) ? woundIncap(W, a, t, '뇌 손상 — 반신불수') : woundFatal(W, a, t, 'brain', o);
    if (sc >= 0.3 && rnd(0.5 * res)){ if (rnd(0.5)) return woundFatal(W, a, t, 'cleave', o); if (alive && !whole){ startBleed(W, t, a.i, 2); knockOut(W, a, t, 6, '두개골이 갈라짐'); woundAdd(W, a, t, 'skull', '두개골이 갈라짐', ['의식을 잃음 · 피를 흘림'], Z); } return; }
    if (!alive || whole) return;
    if (sb >= 0.25 && rnd(0.6)){ knockOut(W, a, t, 3 + W.rand() * 4, '머리를 세게 맞음'); woundAdd(W, a, t, 'daze', '뇌진탕', ['깨어나도 12초 동안 어지러움 (조준 ×0.8 · 준비 ×1.15)'], { ...Z, until: W.t + 12 + 7 }); return; }
    if (sb >= 0.12 && rnd(0.6)){ stun(W, t, 0.6 + W.rand() * 0.6, a.i); woundAdd(W, a, t, 'daze', '뇌진탕 (어지러움)', ['12초 동안 조준 ×0.8 · 준비 ×1.15'], { ...Z, until: W.t + 12, fx: '어지러움' }); }
    return;
  }
  if (!alive || whole) return;
  if (zone === 'face'){ if (sc + sp >= 0.15 && rnd(0.35) && t.eyeLost < t.eyes) maimEye(W, t, a.i); return; }
  if (zone === 'chest'){
    if (o.vital === '심장' && sp + sc >= 0.25 && rnd(0.5)) return woundFatal(W, a, t, 'heart', o);
    if (sp >= 0.12 && rnd(0.7) && !(t.inj || []).some(w => w.k === 'lung')){ ibleed(W, t, a, 0.5); woundAdd(W, a, t, 'lung', '폐 관통', ['숨이 45까지만 참 (질주가 금방 끊김) · 준비 ×1.05 · 가슴 안으로 피가 고임'], { ...Z, fx: '폐 관통!' }); return; }
    if (sb >= 0.15 && rnd(0.6 * res) && !(t.inj || []).some(w => w.k === 'rib')){ woundAdd(W, a, t, 'rib', '갈비뼈 골절', ['숨이 반만 참 · 준비 ×1.1 · 막을 때 자세 ×1.2'], { ...Z, fx: '갈비뼈!' }); return; }
    if (sc >= 0.2 && rnd(0.6)){ startBleed(W, t, a.i, 1); woundAdd(W, a, t, 'cut', '가슴이 깊이 베임', ['피를 흘림'], Z); }
    return;
  }
  if (zone === 'belly'){
    if (sp >= 0.12 && rnd(0.65)){ ibleed(W, t, a, 0.5); woundAdd(W, a, t, 'gut', '복부 관통 — 내출혈', ['몸 안으로 천천히 피를 흘림 (오래 · 응급처치로 반만 멈춤)'], { ...Z, fx: '내출혈' }); return; }
    if (sc >= 0.25 && rnd(0.6)){ startBleed(W, t, a.i, 1.5); t.spdMul = Math.max(0.4, t.spdMul * 0.85); woundAdd(W, a, t, 'gut', '배가 갈림', ['피를 많이 흘림 · 속력 ×0.85'], { ...Z, fx: '배가 갈림!' }); return; }
    if (sb >= 0.3 && rnd(0.5 * res)){ ibleed(W, t, a, 1); woundAdd(W, a, t, 'gut', '장기 파열 — 내출혈', ['간 · 비장이 터져 몸 안으로 빠르게 피를 흘림'], { ...Z, fx: '장기 파열!' }); }
    return;
  }
  if (zone === 'spine'){
    if ((sb >= 0.3 || sp >= 0.25 || sc >= 0.35) && rnd(0.35 * res) && !t.crawl){ t.crawl = true; t.legLoss = '척추'; t.proneT = -9; interrupt(W, t, '척추를 다쳐 준비가 끊김'); stop(t); woundAdd(W, a, t, 'spine', '척추 손상 — 하반신 마비', ['다리를 못 씀 — 기어다님 (쏠 수는 있음 · 근접 못 함)'], { ...Z, fx: '척추!' }); }
    return;
  }
  if (zone === 'arm'){
    if (sb >= 0.2 && rnd(0.5 * res) && !(t.arms.L && t.arms.R)){ maimArm(W, t, a.i, '둔기'); return; }
    if (sc >= 0.15 && rnd(0.5) && !(t.inj || []).some(w => w.k === 'tendon')){ t.atkMul = Math.max(0.3, t.atkMul * 0.7);
      const drop = !unarmed(t) && !isFar(t) && !ITEM_NATURAL.includes(t.weapon) && rnd(0.5); if (drop){ dropHeld(W, t, 'grip'); t.weaponNow = '맨손'; t.rng = ((W.rules.weapons || {})['맨손'] || { rng: 0.3 }).rng + (t.reachX || 0); t.longReach = t.rng > 1; t.parry = false; if (!t.shield && !t.reflex) t.canGuard = false; }
      startBleed(W, t, a.i, 0.5); woundAdd(W, a, t, 'tendon', '팔 힘줄이 끊김', ['공격 ×0.7' + (drop ? ' · 무기를 놓침' : '') + ' · 피를 흘림'], { ...Z, fx: drop ? '무기를 놓침!' : '힘줄!' }); }
    return;
  }
  if (zone === 'leg' && !t.crawl){
    if (sb >= 0.2 && rnd(0.5 * res) && !(t.inj || []).some(w => w.k === 'legBreak')){ t.spdMul = Math.max(0.3, t.spdMul * 0.5); woundAdd(W, a, t, 'legBreak', '다리 골절', ['속력 ×0.5 · 뛰지 못함 (응급처치 부목이면 ×0.7)'], { ...Z, fx: '다리 골절!' }); knockDown(W, t, 0.8, a.i, '다리가 꺾임'); return; }
    if (sc >= 0.15 && rnd(0.5)){ t.spdMul = Math.max(0.4, t.spdMul * 0.75); startBleed(W, t, a.i, 2); woundAdd(W, a, t, 'thigh', '허벅지 동맥 · 힘줄', ['속력 ×0.75 · 피를 많이 흘림'], Z); return; }
    if (sp >= 0.15 && rnd(0.5)){ t.spdMul = Math.max(0.4, t.spdMul * 0.85); startBleed(W, t, a.i, 0.5); woundAdd(W, a, t, 'legHole', '다리 관통', ['속력 ×0.85 · 피를 흘림'], Z); }
  }
}
// 전투불능 (반신불수 · 목뼈 등): 살아는 있으나 싸움에서 빠짐 — 판에서는 쓰러진 것과 같음 ([불사] · [재생] 은 쓰러졌다 다시)
function woundIncap(W, a, t, why){
  if (AI6.includes('wfat')) return;   // 시험용
  if (!t.alive) return;
  t.deathKind = 'incap'; t.incapWhy = why;
  applyDmg(W, a, t, Math.max(1, Math.ceil(t.hp)), { ff: a.side === t.side, far: false, part: null, tag: why + ' — 전투불능', death: 'incap' });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.3, s: '전투불능!', c: 'd', t0: W.t });
}
// 내출혈: 응급처치로 반만 멈춤 (몸 안이라 다 못 막음) · 오래 감
function ibleed(W, t, a, mul){ if (t.noOrg) return; const R = WR(W), b = t.ibleed; t.ibleed = { dps: (b ? b.dps : 0) + bossRef(W, t) * (R.ibleed || 0.01) * (mul || 1), until: W.t + (R.ibleedT || 30), by: a ? a.i : t.i }; }
// 경과: 내출혈 · 어지러움 풀림 · 출혈량 → 쇼크 (1: 준비 ×1.1 · 조준 ×0.9 / 2: ×1.25 · ×0.75 · 속력 ×0.8 / 3: 의식을 잃음 — 응급처치로 안정시켜야 깸)
function stepInj(W, u, dt){
  const R = WR(W); if (!R) return;
  if (u.ibleed){ const b = u.ibleed; if (W.t >= b.until) u.ibleed = null; else { const d = b.dps * dt; u.bled = (u.bled || 0) + d;
      if (u.hp - d < 0.5){ const by = W.units[b.by] || u; u.ibleed = null; u.deathKind = u.deathKind || 'bleed'; applyDmg(W, by, u, Math.max(1, Math.ceil(u.hp)), { ff: by !== u && by.side === u.side, far: false, part: null, tag: '내출혈', death: 'bleed' }); return; }
      u.hp -= d; } }
  if (u.inj && u.inj.some(w => w.k === 'daze' && w.until && W.t >= w.until && !w.over)){ for (const w of u.inj) if (w.k === 'daze' && w.until && W.t >= w.until) w.over = true; u.inj = u.inj.filter(w => !(w.k === 'daze' && w.over)); injRecalc(W, u); }
  if (wholeBody(u)) return;
  const bl = (u.bled || 0) / Math.max(1, u.max), S = R.shock || [0.15, 0.3, 0.45], st = bl >= S[2] ? 3 : bl >= S[1] ? 2 : bl >= S[0] ? 1 : 0;
  if (st !== (u.shock || 0)){ const was = u.shock || 0; u.shock = st; injRecalc(W, u);
    if (st > was){ L(W, { k: 'shock', a: u.i, s: st, bl: Math.round(bl * 100), vis: u.side === 0 || !!u.seenBy }); if (st === 3) knockOut(W, null, u, Infinity, '피를 너무 많이 흘림 — 쇼크'); } }
  if (u.koT && W.t >= u.koT){ u.koT = null; L(W, { k: 'wake', a: u.i, vis: u.side === 0 || !!u.seenBy }); }
}
// 손이 급한 부상: 의식을 잃음 · 쇼크 2 이상 · 내출혈 (응급처치로 깨우고 · 안정시키고 · 반을 멈춤)
const injUrgent = (W, a) => !!(a.koT && a.koT > W.t) || (a.shock || 0) >= 2 || (!!a.ibleed && a.hp / a.max < 0.8);   /* v8.7.3 성한 몸의 배 안 출혈은 급하지 않음 (약을 버리던 것) */
// 응급처치 · 약의 안정화: 지혈 (내출혈은 반) · 쇼크 한 단계 · 기절에서 깨움 (뇌 손상은 못 깨움) · 다리 부목 (×0.5 → ×0.7)
function stabilize(W, u, t){
  const out = [];
  if (t.ibleed){ t.ibleed.dps *= 0.5; out.push('내출혈 반'); }
  if ((t.shock || 0) >= 1){ t.bled = Math.max(0, (t.bled || 0) - t.max * 0.15); out.push('쇼크 안정'); }
  if (t.koT && t.koT > W.t){ t.koT = W.t; t.proneT = Math.min(t.proneT, W.t + 0.3); out.push('깨움'); }
  const lb = (t.inj || []).find(w => w.k === 'legBreak' && !w.splint); if (lb){ lb.splint = true; t.spdMul = Math.min(1, t.spdMul * 1.4); out.push('다리 부목'); }
  if (out.length) stepInj(W, t, 0);
  return out;
}
/* ---------- v6.9 지휘 체계 (사기는 없음): 병사의 보고 (전달 지연) → 지휘관의 그림 · 임무판 (칸 예약 · 교대 · 포기) · 영향 지도 (자리 판단) · 작전 기동의 중단 명령 ----------
   보고: 지휘관은 직접 본 것과 병사가 외쳐 알린 것으로만 작전을 짬. 외침은 닿는 데 시간이 걸리고 (0.4초 + 거리 · 들리는 거리 밖이면 동료를 거쳐 · 말 못 하는 지휘관은 몸짓이라 보여야 함), 알린 건 본 그때의 자리 — 그 사이 상대는 움직임.
   지휘관이 없으면 각자 아는 대로 (편 전체의 그림이 없음). 지휘관이 바뀌면 새 지휘관은 자기가 본 것부터.
   임무판: 작전에 맞춰 전열 유지 · 사격 지원 · 사수 호위 · 표적 압박 칸을 만들고, 칸마다 가장 알맞은 병사 한 명 (중복 없음 · 맡던 임무면 그대로 두려 함). 남는 병사는 예비.
   맡은 병사가 쓰러지거나 기절하면 바로 다시 짬 — 예비가 이어받거나 (교대) 맡을 병사가 없으면 그 임무를 포기. 명령도 외쳐 전하니 늦게 닿음. 지휘가 끊기면 받은 임무를 6초 동안 이어 가다 각자.
   영향 지도: 아는 상대 (지휘관의 그림 — 보고된 자리) 의 손 · 돌진 · 사거리가 닿는 칸 (위협) 과 우리 방패 · 거구 뒤 (엄호) 를 0.5초마다 셈 — 궁수의 자리 잡기, 위협 칸에서 비켜서기, 호위의 자리에 씀.
   작전 기동의 중단 명령도 외쳐 전함 — 작전이 바뀌어도 명령이 닿기 전의 병사는 옛 명령대로 움직임 (로그에 따로). 적의 행동을 미리 막거나 기울이는 성향 (교리) 은 두지 않음 */
// 외쳐 전하는 데 걸리는 시간 (보고 · 명령 같음)
function relayT(W, a, b){
  if (!a || !b || a === b) return 0;
  const d = dist(a, b), hear = hearR(W, a, b), R = W.rules.report || {}, loud = hear < (W.rules.hear || 9) * 0.999 ? 1 - hear / (W.rules.hear || 9) : 0;   // v7.3 시끄러우면 들리는 거리가 줄고 외침을 되풀이함
  let t = (R.base != null ? R.base : 0.4) * (1 + loud) + d / (R.v || 15) + (d > hear ? (R.relay != null ? R.relay : 1.2) * (1 + loud) : 0) + ((a.mute || b.mute) && !canSee(W, b, a) ? 1 : 0);
  if (a.vet) t *= 0.8;
  return t;
}
// 보고: 지휘관이 직접 보면 바로 그림에, 병사가 보면 가장 빨리 닿을 병사가 외침 (본 그때의 자리 · 닿는 시각)
function reportTick(W, side, mine){
  const boss = cmdBoss(W, side); if (!boss) return null;
  const PB = W.picBoss || (W.picBoss = [null, null]); W.pic = W.pic || [{}, {}]; W.repQ = W.repQ || [{}, {}];
  if (PB[side] !== boss.i){ PB[side] = boss.i; W.pic[side] = {}; W.repQ[side] = {}; }   // 새 지휘관은 자기가 본 것부터
  const P = W.pic[side], Q = W.repQ[side];
  for (const f of W.units){ if (!f.alive || f.side === side) continue;
    if (canSee(W, boss, f)){ P[f.i] = { x: +f.x.toFixed(2), y: +f.y.toFixed(2), t: W.t, by: boss.i, own: true }; delete Q[f.i]; continue; }
    let e = null, et = 1e9; for (const m of mine) if (m !== boss && canSee(W, m, f)){ const r = relayT(W, m, boss); if (r < et){ et = r; e = m; } }
    if (e){ const q = Q[f.i]; if (!q || W.t - q.t > 1.5) Q[f.i] = { x: +f.x.toFixed(2), y: +f.y.toFixed(2), t: W.t, by: e.i, at: W.t + et }; } }
  for (const k in Q){ const q = Q[k]; if (q.at > W.t) continue; const was = P[k];
    if (!was || was.t < q.t){ if (!was || W.t - was.t > 5) L(W, { k: 'report', side, a: q.by, c: boss.i, b: +k, lag: +(W.t - q.t).toFixed(1), again: !!was, vis: true }); P[k] = { x: q.x, y: q.y, t: q.t, by: q.by }; }
    delete Q[k]; }
  return boss;
}
// 지휘관이 아는 상대 (그림): 직접 봤거나 보고가 닿았고 keep 초 안. 지휘관이 없으면 각자 아는 대로 (known0)
function picKnown(W, side, mine, known0){
  if (AI6.includes('rep')) return known0;
  const boss = reportTick(W, side, mine); if (!boss) return known0;
  const P = W.pic[side], keep = (W.rules.report || {}).keep || 6;
  return W.units.filter(f => f.alive && f.side !== side && P[f.i] && W.t - P[f.i].t <= keep);
}
// 지휘관의 그림 속 자리 (보고된 자리 · 없으면 null)
const picAt = (W, side, f) => { const P = W.pic && W.pic[side] && cmdBoss(W, side) ? W.pic[side][f.i] : null; return P ? P : null; };

const TASK_N = { front: '전열 유지', fire: '사격 지원', escort: '사수 호위', guard: '지휘관 호위', press: '표적 압박', reserve: '예비' };
// 임무에 알맞은 정도 (−1 = 못 맡음)
function taskFit(W, u, k){
  const sh = u.shield || u.armShield, far = isFar(u), hurt = u.hp / u.max < 0.35;
  if (k === 'fire') return far ? 3 : -1;
  if (far) return -1;
  if (k === 'front') return (u.giant || u.bodyShield ? 3.2 : sh ? 3 : u.role === '전선' ? 2.2 : -1) - (hurt ? 1 : 0);
  if (k === 'escort' || k === 'guard') return (sh && !u.giant ? 2.5 : u.role === '전선' && !u.giant ? 1.2 : -1) - (hurt ? 0.5 : 0);
  if (k === 'press') return (u.role === '전선' || u.giant ? -1 : 1.5 + Math.min(1.5, u.spd / 2) + (u.jav && u.spearHeld ? 0.3 : 0)) - (hurt ? 1.5 : 0);
  return 0.5;
}
// 칸: 전열 유지 2 · 사격 지원 = 궁수 수 · 사수 호위 1 · 표적 압박 2 (사냥 · 포위는 +1, 버팀 · 유인은 −1)
function taskSlots(W, mine, boss){
  const P = W.plan ? W.plan.k : 'assault', bows = mine.filter(isFar).length;
  return [['front', 2], ['fire', bows], ['escort', bows ? 1 : 0], ['press', Math.max(1, 2 + (P === 'hunt' || P === 'encircle' ? 1 : P === 'hold' || P === 'bait' ? -1 : 0))]];
}
const taskOn = (W, u) => u.task && W.t >= u.task.at ? u.task : null;
function taskBoard(W, mine, known, coord){
  if (AI6.includes('task')) return;
  const B = W.board || (W.board = { t: -9, slots: [], lostT: null, p: null });
  if (!coord){   // 지휘가 끊김: 받은 임무는 잠시 그대로 — 6초 뒤 각자
    if (!B.slots.length) return; if (B.lostT == null) B.lostT = W.t;
    if (W.t - B.lostT > 6){ L(W, { k: 'taskEnd', side: 1, why: '지휘가 끊긴 지 6초', vis: true }); for (const u of W.units) if (u.side === 1) u.task = null; B.slots = []; B.p = null; }
    return; }
  B.lostT = null;
  const boss = cmdBoss(W, 1); if (!boss || !known.length) return;
  const out = i => { const u = W.units[i]; return !u.alive || u.crawl || (u.koT && u.koT > W.t); };
  const gone = B.slots.filter(s => s.u != null && out(s.u)), pk = W.plan ? W.plan.k : null;
  if (W.t - B.t < 1 && !gone.length && B.p === pk) return;   // 1초마다 · 맡은 병사가 빠지거나 작전이 바뀌면 바로
  B.t = W.t;
  const mc = centroid(mine), fc = W.focus && W.units[W.focus.b] && W.units[W.focus.b].alive && !W.units[W.focus.b].down ? W.units[W.focus.b] : null;
  const tank = known.filter(f => !f.down && !isFar(f) && (f.canGuard || f.giant || f.bodyShield)).sort((a, b) => dist(a, mc) - dist(b, mc))[0] || known.filter(f => !f.down && !isFar(f)).sort((a, b) => dist(a, mc) - dist(b, mc))[0] || null;
  const J = W.judge && W.judge[1], dg = J && J.d != null && W.units[J.d].alive ? W.units[J.d] : null;
  const tgt = { front: tank, press: fc || tank, fire: fc || dg, escort: null, guard: null };
  const old = new Map(); for (const s of B.slots) if (s.u != null && !out(s.u)) old.set(s.u, s.k);
  const free = new Set(mine.filter(u => !u.crawl && !(u.koT && u.koT > W.t)).map(u => u.i)), slots = [];
  for (const [k, n] of taskSlots(W, mine, boss)) for (let j = 0; j < n; j++){
    let best = null, bs = 0;
    for (const i of free){ const u = W.units[i], f = taskFit(W, u, k); if (f < 0) continue;
      const t = tgt[k], s = f + (old.get(i) === k ? 1.5 : 0) - (t ? dist(u, t) / 8 : 0) - (k === 'guard' ? dist(u, boss) / 6 : 0) + 0.01;
      if (s > bs){ bs = s; best = u; } }
    slots.push({ k, b: tgt[k] ? tgt[k].i : k === 'guard' ? boss.i : null, u: best ? best.i : null }); if (best) free.delete(best.i);
  }
  for (const i of free) slots.push({ k: 'reserve', b: null, u: i });
  const first = B.p !== pk || !B.slots.length;
  // 교대: 빠진 병사의 임무를 누가 이어받았나 · 포기: 전엔 맡은 병사가 있었는데 이제 없음
  const swaps = [], drops = [];
  for (const g of gone){ const s = slots.find(x => x.k === g.k && x.u != null && old.get(x.u) !== g.k && !swaps.some(w => w.b === x.u)); if (s) swaps.push({ k: g.k, a: g.u, b: s.u, from: old.get(s.u) || null }); }
  for (const k of new Set(B.slots.map(s => s.k))){ const had = B.slots.filter(s => s.k === k && s.u != null).length, now = slots.filter(s => s.k === k && s.u != null).length; if (k !== 'reserve' && now < had && now < slots.filter(s => s.k === k).length) drops.push({ k, had, now }); }
  for (const s of slots){ if (s.u == null) continue; const u = W.units[s.u], h = u.task;
    if (!h || h.k !== s.k || h.b !== s.b){ const lk = cmdLink(W, boss, u);   // v7.4 못 들으면 이번엔 그대로 (0.5초 뒤 다시 외침)
      if (u !== boss && W.rand() >= lk.p){ if (W.t - (u.missLogT == null ? -9 : u.missLogT) > 3){ u.missLogT = W.t; L(W, { k: 'cmdMiss', side: 1, a: u.i, c: boss.i, via: lk.via, why: lk.why, p: +lk.p.toFixed(2), o: ['task', s.k], vis: !!u.seenBy }); } }
      else u.task = { k: s.k, b: s.b, at: W.t + (u === boss ? 0 : lk.t), t0: W.t }; } }
  for (const u of mine) if (!slots.some(s => s.u === u.i)) u.task = null;
  B.slots = slots; B.p = pk;
  if (first) L(W, { k: 'board', side: 1, p: pk, by: boss.i, tmp: !!boss.cmdTmp, s: slots.map(s => [s.k, s.u, s.b]), vis: true });
  for (const x of swaps) L(W, { k: 'taskSwap', side: 1, tk: x.k, a: x.a, b: x.b, from: x.from, why: W.units[x.a].alive ? (W.units[x.a].crawl ? '기어다님' : '기절') : '쓰러짐', vis: true });
  for (const x of drops) L(W, { k: 'taskDrop', side: 1, tk: x.k, had: x.had, now: x.now, vis: true });
}
// 임무에 따른 표적 기울기: 전열 유지 = 붙들 상대 · 표적 압박 · 사격 지원 = 그 상대. 공동 표적 덤은 압박 · 사격 조 몫 (나머지는 반 — 한 놈에게 모두 몰리지 않게)
function taskBias(W, u, f){ const T = u.side === 1 && taskOn(W, u); if (!T || T.b !== f.i) return 0; return T.k === 'front' ? 8 : T.k === 'press' ? 4 : T.k === 'fire' ? 3 : 0; }
const taskFocusMul = (W, u) => { const T = u.side === 1 && taskOn(W, u); return !T ? 1 : T.k === 'press' || T.k === 'fire' ? 1.2 : 0.5; };
const escortH = (W, x) => { const T = taskOn(W, x); return T && (T.k === 'escort' || T.k === 'guard') ? 1 : 0; };

// 영향 지도: 칸마다 위협 (아는 상대의 손 · 돌진 · 사거리) · 엄호 (우리 방패 · 거구 뒤, 상대 쪽을 등진 칸)
function inflTick(W, side, known){
  if (AI6.includes('infl')) return;
  const m = W.map, n = m.W * m.H, I = (W.infl || (W.infl = []))[side] || (W.infl[side] = { th: new Float32Array(n), cv: new Float32Array(n), t: -9 });
  if (W.t - I.t < 0.5) return; I.t = W.t; I.th.fill(0); I.cv.fill(0);
  const ch = W.rules.charge || {}, F = [];
  for (const f of known){ if (f.down || f.crawl) continue; const p = picAt(W, side, f) || f; F.push({ f, x: p.x, y: p.y }); }
  for (const { f, x, y } of F){
    const far = isFar(f) || (f.jav && f.spearHeld), run = isFar(f) ? 0 : (f.canCharge && W.t >= (f.chargeCd || 0) - 1 ? (ch.max || 5) : f.spd * 1.2) + (f.giant ? 1 : 0), R = isFar(f) ? f.rng + 0.5 : f.rng + f.r + run + (f.jav && f.spearHeld ? 2 : 0);
    const tied = !isFar(f) && busyW(W, f) ? 0.35 : 1;   // 이미 다른 상대와 맞붙은 놈은 덜 위협 (빠져나와야 옴)
    const x0 = Math.max(0, Math.floor(x - R)), x1 = Math.min(m.W - 1, Math.ceil(x + R)), y0 = Math.max(0, Math.floor(y - R)), y1 = Math.min(m.H - 1, Math.ceil(y + R));
    for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++){ const px = cx + 0.5, py = cy + 0.5, d = Math.hypot(px - x, py - y); if (d > R) continue;
      let v;
      if (isFar(f)){ if (!losClear(m, x, y, px, py)) continue; v = f.loud ? 0.9 : 0.6; }
      else { const reach = f.rng + f.r + 0.4; v = d <= reach ? 1.2 : run > 0 && d <= reach + run ? 1 - (d - reach) / run * 0.75 : far ? 0.4 : 0; }
      I.th[cy * m.W + cx] += v * (f.giant ? 1.4 : 1) * tied; } }
  if (!F.length) return;
  const fx = F.reduce((s, q) => s + q.x, 0) / F.length, fy = F.reduce((s, q) => s + q.y, 0) / F.length;
  for (const g of W.units){ if (!g.alive || g.side !== side || g.crawl || !(g.shield || g.armShield || g.bodyShield || g.giant)) continue;
    const ax = g.x - fx, ay = g.y - fy, al = Math.hypot(ax, ay) || 1;
    for (let cy = Math.max(0, Math.floor(g.y - 2)); cy <= Math.min(m.H - 1, Math.ceil(g.y + 2)); cy++) for (let cx = Math.max(0, Math.floor(g.x - 2)); cx <= Math.min(m.W - 1, Math.ceil(g.x + 2)); cx++){
      const dx = cx + 0.5 - g.x, dy = cy + 0.5 - g.y, d = Math.hypot(dx, dy); if (d > 2 || (dx * ax + dy * ay) / al < 0.2) continue;
      const k = cy * m.W + cx; I.cv[k] = Math.max(I.cv[k], 1 - d / 2); } }
}
const inflAt = (W, side, x, y, k) => { const I = W.infl && W.infl[side]; if (!I) return 0; const cx = Math.max(0, Math.min(W.map.W - 1, Math.floor(x))), cy = Math.max(0, Math.min(W.map.H - 1, Math.floor(y))); return (k === 'cv' ? I.cv : I.th)[cy * W.map.W + cx]; };
// 영향 지도로 움직임 (0.5초마다): ① 위협 칸에 선 궁수 → 2.4칸 안에서 덜 위험하고 (엄호면 더 좋음) 쏠 수 있는 칸으로 비켜섬 ② 호위 임무 → 사수 (근위대는 지휘관) 와 가장 가까운 위협 사이
function inflMoves(W, mine, known){
  if (AI6.includes('infl') || !W.infl || !W.infl[1]) return;
  const wI = 1;
  for (const u of mine){
    if (!mvFree(W, u) || busyW(W, u) || u.act || u.lurk) continue;
    if (isFar(u)){ const th0 = inflAt(W, 1, u.x, u.y); if (th0 < 1.1 || W.t < (u.inflT || 0) || (u.ammo != null && u.ammo === 0)) continue; u.inflT = W.t + 3;
      const T = u.target && u.target.alive && u.target.side !== u.side ? u.target : known[0]; if (!T) continue;
      let best = null, bs = -th0 * 1.5 * wI + inflAt(W, 1, u.x, u.y, 'cv') * 0.8;
      for (const r of [0.8, 1.4, 2, 2.4]) for (let k = 0; k < 12; k++){ const a = k * Math.PI / 6 + r * 0.3, x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r;
        if (x < 0.7 || y < 0.7 || x > W.map.W - 0.7 || y > W.map.H - 0.7 || boxRock(W, x, y, u.r)) continue;
        if (W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r)) continue;
        const th = inflAt(W, 1, x, y); if (th > th0 - 0.6) continue;
        if (Math.hypot(T.x - x, T.y - y) - T.r - u.r > u.rng || !losClear(W.map, x, y, T.x, T.y)) continue;
        if (known.some(f => !isFar(f) && segD(u, x, y, f) - f.r - u.r < f.rng + 0.3)) continue;   // 상대 손 닿는 곳을 지나는 길은 안 됨
        const s = -th * 1.5 * wI + inflAt(W, 1, x, y, 'cv') * 0.8 - r * 0.3; if (s > bs){ bs = s; best = { x, y, th }; } }
      if (best){ u.mv = { k: 'shift', x: best.x, y: best.y, b: T.i, until: W.t + 1.6 };
        L(W, { k: 'mvr', side: 1, m: 'shift', a: u.i, b: T.i, th0: +th0.toFixed(1), th: +best.th.toFixed(1), cv: inflAt(W, 1, best.x, best.y, 'cv') > 0.3, obs: !!u.seenBy, vis: true }); }
      continue; }
    const T = taskOn(W, u); if (!T || (T.k !== 'escort' && T.k !== 'guard')) continue;
    const ward = T.k === 'guard' ? [W.units[T.b]].filter(x => x && x.alive) : mine.filter(isFar); if (!ward.length) continue;
    const c = centroid(ward), th = known.filter(f => !isFar(f) && !f.down && !f.crawl).map(f => ({ f, p: picAt(W, 1, f) || f })).sort((a, b) => Math.hypot(a.p.x - c.x, a.p.y - c.y) - Math.hypot(b.p.x - c.x, b.p.y - c.y))[0];
    if (!th || Math.hypot(th.p.x - c.x, th.p.y - c.y) > 7.5) continue;
    const d = Math.hypot(th.p.x - c.x, th.p.y - c.y) || 1, x = Math.max(0.7, Math.min(W.map.W - 0.7, c.x + (th.p.x - c.x) / d * 1.3)), y = Math.max(0.7, Math.min(W.map.H - 0.7, c.y + (th.p.y - c.y) / d * 1.3));
    if (Math.hypot(x - u.x, y - u.y) < 0.6 || boxRock(W, x, y, u.r)) continue;
    u.mv = { k: 'screen', x, y, b: th.f.i, c: T.k === 'guard' ? T.b : null, until: W.t + 1 };
    if (W.t >= (u.screenLogT || 0)){ u.screenLogT = W.t + 5; L(W, { k: 'mvr', side: 1, m: 'screen', a: u.i, b: th.f.i, c: T.k === 'guard' ? T.b : null, obs: !!u.seenBy, vis: true }); }
  }
}
// 작전 기동 (산개 포위 · 쐐기) 의 중단 명령: 지휘관이 외쳐 거둠 — 병사마다 닿는 시각이 다름 (그 사이 옛 명령대로). 지휘관이 없으면 각자 2 ~ 3초 뒤에 알아챔
const opMembers = (V, op) => op === 'env' ? [...V.ids, ...Object.keys(V.arch || {}).map(Number)] : [V.tip, ...V.sh, ...V.body];
const opFreed = (V, u) => !!(V && V.cancel && V.cancel.got[u.i]);
const opPending = (W, u) => [W.env, W.wedge].some(V => V && V.cancel && V.cancel.at[u.i] != null && !V.cancel.got[u.i]);
function opCancel(W, op, why){
  const V = op === 'env' ? W.env : W.wedge; if (!V || V.cancel || AI6.includes('opcut')) return;
  const boss = cmdBoss(W, 1), at = {};
  for (const i of opMembers(V, op)){ const u = W.units[i]; if (!u || !u.alive) continue; at[i] = W.t + (boss ? (u === boss ? 0 : (() => { const lk = cmdLink(W, boss, u); return lk.t + (W.rand() < lk.p ? 0 : ((W.rules.cmdLink || {}).retry || 1.2) + relayT(W, boss, u)); })()) : 2 + W.rand()); }   // v7.4 못 들으면 다시 외쳐 늦게
  V.cancel = { t: W.t, why, by: boss ? boss.i : null, at, got: {}, busy: {} };
  L(W, { k: 'opOrder', side: 1, op, why, by: boss ? boss.i : null, n: Object.entries(at).map(([i, t]) => [+i, +(t - W.t).toFixed(1)]), vis: true });
}
// 병사가 중단 명령을 받았나 — 닿은 때 하던 공격 · 돌진이 있으면 끝내고 받음 (그것도 로그에)
function opGot(W, V, op, u){
  const C = V && V.cancel; if (!C || C.at[u.i] == null) return false; if (C.got[u.i]) return true;
  if (W.t < C.at[u.i]) return false;
  if (u.act && (u.act.k === 'charge' || u.act.k === 'atk' || u.act.k === 'bash')){ C.busy[u.i] = true; return false; }
  C.got[u.i] = true; L(W, { k: 'opRecv', side: 1, op, a: u.i, lag: +(W.t - C.t).toFixed(1), busy: !!C.busy[u.i], self: C.by == null, obs: !!u.seenBy, vis: true }); return true;
}
// 0.5초마다: 지휘가 끊기면 중단 (각자 알아챔) · 다 받았거나 쓰러졌으면 그 기동을 거둠 · 명령이 닿고 3초가 지나도 기동 걸음을 안 밟은 병사 (싸우는 중) 는 받은 걸로
function opTick(W, coord){
  for (const op of ['env', 'wedge']){ const V = op === 'env' ? W.env : W.wedge; if (!V) continue;
    if (!V.cancel && !coord) opCancel(W, op, '지휘가 끊김');
    const C = V.cancel; if (!C) continue;
    for (const k in C.at){ const i = +k; if (W.units[i].alive && !C.got[i] && W.t >= C.at[i] + 3){ C.got[i] = true; L(W, { k: 'opRecv', side: 1, op, a: i, lag: +(W.t - C.t).toFixed(1), busy: true, self: C.by == null, obs: !!W.units[i].seenBy, vis: true }); } }
    if (Object.keys(C.at).every(k => !W.units[+k].alive || C.got[+k])){
      const why = '작전이 바뀜 (' + C.why + ') — 모두 중단 명령을 받음';
      if (op === 'env'){ L(W, { k: 'env', side: 1, s: 'end', why, vis: true }); W.env = null; } else { L(W, { k: 'wedge', side: 1, s: 'end', tip: V.tip, why, vis: true }); W.wedge = null; } } }
}
// 한 턴: 정해진 시간만큼 모두 함께 진행. 턴 시작 (명령 기록) · 끝 (이동 거리 · 상태표) 을 남김
const STEP = 1 / 30;
const orderTxt = (o, u) => o && o.k === 'frally' ? ['frally'] : o && o.k === 'alt' ? ['alt'] : o && o.k === 'exit' ? ['exit', o.dir, o.hurry ? 1 : 0] : o && o.k === 'specCancel' ? ['specCancel', o.s || null] : o && o.k === 'spec' ? ['spec', o.s, o.b != null ? o.b : null, o.x != null ? +o.x.toFixed(2) : null, o.y != null ? +o.y.toFixed(2) : null, o.R != null ? +(+o.R).toFixed(2) : null] : o && o.k === 'swap' ? ['swap', o.uid] : o && o.k === 'inv' ? ['inv', o.op, o.uid != null ? o.uid : null, o.slot || null, o.to != null ? o.to : null] : o && o.k === 'flank' ? ['flank', o.b] : o && o.k === 'sac' ? ['sac'] : o && o.k === 'torchGet' ? ['torchGet'] : o && o.k === 'flare' ? ['flare', +o.x.toFixed(2), +o.y.toFixed(2)] : o && o.k === 'supp' ? ['supp', +o.x.toFixed(2), +o.y.toFixed(2)] : o && o.k === 'watch' ? ['watch', +o.f.toFixed(2)] : o && o.k === 'assn' ? ['assn', o.b] : o && o.k === 'scout' ? ['scout', +o.x.toFixed(2), +o.y.toFixed(2), o.pol || 'look'] : o && o.k === 'lret' ? ['lret', o.id] : o && o.k === 'leap' ? (o.b != null ? ['leap', o.b] : o.x != null ? ['leapPt', +o.x.toFixed(2), +o.y.toFixed(2)] : ['leap0']) : o && o.k === 'palm' ? ['palm', o.b] : o && o.k === 'line' && o.join ? ['lineJoin'] : o && o.k === 'amove' ? ['amove', +o.x.toFixed(2), +o.y.toFixed(2), o.hurry ? 1 : 0] : o && o.k === 'line' ? ['line', +o.x.toFixed(2), +o.y.toFixed(2)] : o && o.k === 'charge' ? (o.b == null ? ['chargePt', +o.x.toFixed(2), +o.y.toFixed(2)] : ['charge', o.b]) : o && o.k === 'throw' ? ['throw', o.b] : o && o.k === 'pick' && o.id != null ? ['pickItem', o.id] : o && o.k === 'pick' && o.spear ? ['pickSpear'] : !o ? (u && u.stay ? ['auto', +u.stay.x.toFixed(2), +u.stay.y.toFixed(2)] : ['auto']) : o.k === 'move' ? ['move', +o.x.toFixed(2), +o.y.toFixed(2)] : o.k === 'attack' ? ['attack', o.b] : o.k === 'skill' ? ['skill', o.b] : o.k === 'pick' ? ['pick', +o.x.toFixed(2), +o.y.toFixed(2)] : ['hold'];
function beginTurn(W){
  W.turn++; W.turnFrom = W.t; W.turnEnd = W.t + W.rules.turn;
  for (const u of W.units) u.moved = 0;
  L(W, { k: 'turn', n: W.turn, from: +W.t.toFixed(2), to: +W.turnEnd.toFixed(2), orders: W.units.filter(u => u.side === 0 && u.alive).map(u => [u.i, orderTxt(u.order, u)]) });
}
function endTurn(W){
  L(W, { k: 'turnEnd', n: W.turn, moves: W.units.filter(u => u.moved > 0.05).map(u => [u.i, +u.moved.toFixed(1)]),
    snap: W.units.map(u => ({ i: u.i, x: +u.x.toFixed(2), y: +u.y.toFixed(2), face: +u.face.toFixed(2), tgt: u.side === 1 && u.target && u.target.alive ? u.target.i : null, hp: Math.round(u.hp), alive: u.alive, seen: u.side === 1 ? !!u.seenBy : true,
      engaged: !!u.engaged, act: u.act ? { k: u.act.k, ph: u.act.phase, b: u.act.b, body: !!u.act.body, arm: !!u.act.arm, left: Math.max(0, +(u.act.end - W.t).toFixed(2)), why: u.act.why || '', s: u.act.s || '' } : null, order: u.side === 0 ? (u.order && (u.order.room || u.order.rejoin) ? ['auto'] : orderTxt(u.order, u)) : null, state: u.state, moving: !!(u.path && u.path.length),
      mood: u.mood || '', ammo: u.ammo, skill: u.skill ? u.skill.left : null, post: u.canGuard ? Math.round(u.post) : null, broken: u.canGuard && W.t < u.brokenT, wounds: u.wounds.slice(), prone: W.t < u.proneT, lie: u.lie ? (u.lieSw ? (u.lieSw.to ? 'down' : 'up') : 'on') : null, crawl: !!u.crawl, blind: !!u.blind, eyeLost: u.eyeLost, eyes: u.eyes, arms: { L: u.arms.L, R: u.arms.R }, bleed: !!u.bleed, dk: u.alive ? null : u.deathKind || null, inj: (u.inj || []).map(w => w.k), shock: u.shock || 0, ko: !!(u.koT && u.koT > W.t), ib: !!u.ibleed, wpn: unarmed(u) ? '맨손' : u.weapon || '', sh: !!u.shield })),   // v5.5 부위 · v6.7.5 든 것
    items: (W.items || []).map(it => ({ id: it.id, k: it.k, name: it.name, x: it.x, y: it.y, owner: it.owner, t: +(it.t || 0).toFixed(1), how: it.how || '' })) });   // v6.7.5 땅에 떨어진 무기 · 방패 (자리 · 주인 · 언제 · 어떻게)
}
function runTurn(W){
  if (W.over) return;
  beginTurn(W);
  while (W.t < W.turnEnd - 1e-6 && !W.over) stepWorld(W, Math.min(STEP, W.turnEnd - W.t));
  endTurn(W);
}

// 화면 없이 끝까지 (모두 자동)
function runAuto(setup, rules, seed){
  const W = createWorld(setup, rules, seed, { headless: true });
  while (!W.over) runTurn(W);
  return W;
}


/* ---------- v8.7.8 포렌 (명세 C5 — 2D 미궁 프롤로그 porenUpdate · 쥐 군단 그대로 · 쥐 기사는 3D) ----------
   충성: 게이지가 차면 쥐가 포렌 뒤쪽에서 달려옴 (다음 쥐는 미리 정해짐 — 작은 쥐 58% 0.8초 · 쥐 27% 3초 · 큰 쥐 13% 8초 · 쥐 기사 2% 8초 ·
   쥐가 넷보다 적으면 2.5배 빨리 · 싸움이 없으면 넷까지만 천천히 · 최대 24). 쥐는 포렌의 기술로만 움직임 (다른 이의 명령은 받지 않음).
   따르는 쥐 70% (포렌 곁 · 포렌이 노린 적) · 떠돌이 30% (둘레를 싸돌아다니며 마주친 적). 적 포렌도 같은 규칙 */
const PRN = W => W.rules.poren || {};
const PRN_BUSY = ['wall', 'fort', 'ladder', 'bind', 'bindRun', 'shieldWall'];
const prnRats = (W, u) => W.units.filter(r => r.alive && !r.gone && r.ratOf === u.i);
const ratBusy = r => !!(r.rs && PRN_BUSY.includes(r.rs.k));
function ratFree(r){ r.rs = { k: 'idle' }; }
const prnFoes = (W, u) => W.units.filter(e => e.alive && !e.gone && e.side !== u.side);
const prnVis = (W, u, t) => u.side === 0 || !!u.seenBy || !!(t && t.seenBy);
function prnLetter(M){ const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; for (let i = 0; ; i++){ const n = i < 26 ? AB[i] : AB[i % 26] + Math.floor(i / 26); if (!M.some(r => r.n === n)) return n; } }
function prnRoll(W){ let r = W.rand(); for (const [k, p] of PRN(W).roll || []){ if ((r -= p) <= 0) return k; } return 'ratS'; }
const prnFill = (W, k) => ((PRN(W).roll || []).find(x => x[0] === k) || [k, 0, 1])[2];
// 쥐가 생기는 자리: 멀면 포렌 뒤쪽 3.5 ~ 5칸 (적 반대편 — 그 자리부터 달려옴) · 가까우면 곁 (방진 · 포박 · 사다리)
function prnSpot(W, u, near){
  const m = W.map, F = prnFoes(W, u).sort((a, b) => dist(u, a) - dist(u, b))[0], a0 = F ? Math.atan2(u.y - F.y, u.x - F.x) : W.rand() * 6.283;
  for (let k = 0; k < 12; k++){
    const a = a0 + (W.rand() - 0.5) * (near ? 3.4 : 1.8), r = near ? 0.8 + W.rand() * 0.8 : 3.5 + W.rand() * 1.5, x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r;
    if (x < 0.7 || y < 0.7 || x > m.W - 0.7 || y > m.H - 0.7 || boxRock(W, x, y, 0.25)) continue;
    if (!near && !losClear(m, u.x, u.y, x, y)) continue;
    if (W.units.some(o => o.alive && !o.gone && Math.hypot(o.x - x, o.y - y) < 0.4)) continue;
    return { x, y };
  }
  return { x: u.x + (W.rand() - 0.5) * 0.6, y: u.y + (W.rand() - 0.5) * 0.6 };
}
// 쥐 부르기 — 쥐 기사는 기억하는 쥐부터 (동료 포렌: 이름 · 단계 · 세 번 살아 돌아오면 쥐 베테랑)
function prnRat(W, u, kind, o){
  const P = PRN(W), O = o || {};
  if (prnRats(W, u).length >= (P.cap || 24) + (O.extra || 0)) return null;
  let rec = null, k = kind;
  if (k === 'ratKnight' && u.ratMem){ rec = u.ratMem.find(x => !W.units.some(m => m.alive && !m.gone && m.ratRec === x)); if (!rec){ rec = { n: prnLetter(u.ratMem), lv: 1, ret: 0, vet: false }; u.ratMem.push(rec); } if (rec.vet) k = 'ratVet'; }
  const Dz = (P.rats || {})[k]; if (!Dz) return null;
  const q = O.at || prnSpot(W, u, !!O.near), lv = rec && !rec.vet ? rec.lv || 1 : 1;
  W.ratSeq = (W.ratSeq || 0) + 1;
  const p = { id: 'rat-' + u.i + '-' + W.ratSeq, name: rec ? Dz.name + ' ' + rec.n : Dz.name, ref: Dz.ref, tier: 1, cls: Dz.cls || '기동', role: '공격수', side: u.side, weapon: Dz.weapon || '이빨·발톱', javSide: Dz.javSide || null, poise: Dz.poise || undefined, javK: Dz.javK || undefined, shield: !!Dz.shield,
    height: Dz.height, weight: Dz.weight, rMul: Dz.rMul, noChg: !Dz.charge, nv: true, nvG: 'B', ov: { hp: Math.round(Dz.hp * (1 + (lv - 1) * 0.15)), atk: Math.round(Dz.atk * (1 + (lv - 1) * 0.1)), spd: Dz.spd },
    traits: (Dz.traits || []).slice(), active: (Dz.active || []).slice(), gear: Dz.gear ? JSON.parse(JSON.stringify(Dz.gear)) : {}, x: q.x, y: q.y, summon: 'rat', ratOf: u.i, ratKind: k };
  const r = (typeof engineSpawn === 'function' ? engineSpawn : addUnit)(W, p); if (!r) return null;
  r.summon = 'rat'; r.ratOf = u.i; r.ratKind = k; r.ratRec = rec; r.ratLv = lv; r.ratWild = !rec && k !== 'ratKnight' && W.rand() < (P.wildP != null ? P.wildP : 0.3); r.rs = { k: 'idle' }; r.state = u.side ? 'hunt' : 'fight';
  if (rec || k === 'ratL' || k === 'ratKnight') L(W, { k: 'ratCome', a: u.i, b: r.i, kind: k, n: rec ? rec.n : null, lv, ret: rec ? rec.ret || 0 : 0, vet: !!(rec && rec.vet), vis: prnVis(W, u) });
  return r;
}
// 싸우는 중 (아는 적이 14칸 안)
const prnFight = (W, u) => W.units.some(e => e.alive && !e.gone && e.side !== u.side && dist(u, e) < 14 && (e.target === u || (u.side === 0 ? !!e.seenBy || canSee(W, u, e) : u.target === e || canSee(W, u, e))));
function prnInit(W, u){
  const P = PRN(W), n = P.init != null ? P.init : 4, kn = (u.ratMem && u.ratMem.length) || W.rand() < (P.initKnight != null ? P.initKnight : 0.5);   // 3D: 처음엔 곁에 넷 (반은 쥐 기사부터)
  for (let i = 0; i < n; i++) prnRat(W, u, i === 0 && kn ? 'ratKnight' : 'ratS', { near: true });
}
// 쥐 표식 '물어라!': 그 적에게 5초 표식 · 어디선가 쥐 셋이 더 달려옴 · 모든 쥐가 우르르 몰려들어 둘러싸고 물어뜯음 (새로 온 쥐도 합류)
function prnMark(W, u, t, why){
  const M = PRN(W).mark || {}, x = specOf(u, 'pmark'); if (!x || W.t < x.cdT || !t || !t.alive || t.side === u.side) return false;
  const rats = prnRats(W, u).filter(r => !ratBusy(r)); if (!rats.length) return false;
  x.cdT = W.t + (M.cd || 12); u.ratMark = { b: t.i, until: W.t + (M.dur || 5) };
  for (let i = 0; i < (M.extra || 3); i++){ const r = prnRat(W, u, i === 0 && W.rand() < (M.knightP || 0.3) ? 'ratKnight' : prnRoll(W), { extra: M.extra || 3 }); if (r) rats.push(r); }
  rats.forEach((r, i) => { r.rs = { k: 'assault', b: t.i, until: u.ratMark.until, a: i / rats.length * 6.283 }; });
  L(W, { k: 'prMark', a: u.i, b: t.i, n: rats.length, why: why || '', vis: prnVis(W, u, t) });
  if (W.fxOn) W.fx.push({ k: 'ratmark', b: t.i, t0: W.t, until: u.ratMark.until });
  return true;
}
const markOn = (W, u) => !!(u && u.ratMark && W.t < u.ratMark.until && W.units[u.ratMark.b] && W.units[u.ratMark.b].alive);
// 방벽: 동료에게 강공 (보스 · 공격 30 넘음) 이 오면 가까운 쥐 2 ~ 4마리가 그 앞에 3초 줄을 섬 — 사이에 선 쥐가 근접 일격을 대신 맞음
const prnStrong = (W, e) => (e.traits || []).includes('보스') || !!e.jrB || (e.atk || 0) >= ((PRN(W).wall || {}).minAtk || 30);
function prnWall(W, u, g, e){
  const P = PRN(W).wall || {}; if (W.t < (u.prn.wallCd || -9)) return false;
  const need = (e.traits || []).includes('보스') ? 4 : (e.atk || 0) >= (P.bigAtk || 50) ? 3 : 2;
  const M = prnRats(W, u).filter(r => !ratBusy(r)).sort((a, b) => dist(a, g) - dist(b, g)).slice(0, need); if (!M.length) return false;
  u.prn.wallCd = W.t + (P.cd || 6);
  M.forEach((r, i) => { r.rs = { k: 'wall', g: g.i, a: e.i, idx: i, n: M.length, until: W.t + (P.dur || 3) }; });
  L(W, { k: 'ratWall', a: u.i, b: g.i, c: e.i, n: M.length, vis: prnVis(W, u, e) });
  return true;
}
const ratWallReach = (W, u, t) => W.units.some(r => r.alive && !r.gone && r.rs && r.rs.k === 'wall' && r.rs.g === t.i && r.rs.a === u.i && gap(u, r) <= u.rng + (W.rules.reach || 0.3));
function ratWallHit(W, u, t){
  if (!t || t.ratOf != null) return null;
  const k = gap(u, t);
  for (const r of W.units) if (r.alive && !r.gone && r.rs && r.rs.k === 'wall' && r.rs.g === t.i && r.rs.a === u.i && dist(u, r) < dist(u, t) && gap(u, r) <= Math.max(k, u.rng) + 0.35) return r;
  return null;
}
// 쥐 방진: 체력 40% 아래 · 강공이 날아옴 → 대검을 꽂고 2.5초 버팀 (움직이지 않음 · 휘청 · 밀림 없음) · 둘레 쥐 (최대 8) 가 받는 피해 70% 를 똑같이 나눠 받음
//   끝에 대검을 뽑으며 두 바퀴 — 공격 + 쥐들이 대신 맞은 피해 60% + 버틴 무게 (포렌 × 4 + 둘레 쥐) × 0.164 · 치명 25%. 곁에 적이 없으면 방진 쥐 셋을 타고 가장 위험한 적 (8칸) 에게 날아가 거기서
function prFort(W, u, why){
  const F = PRN(W).fort || {}, x = specOf(u, 'pfort');
  if (!x || W.t < x.cdT || !u.alive || u.down || (u.act && u.act.k === 'pr')) return false;
  const rats = prnRats(W, u).filter(r => !(r.rs && (r.rs.k === 'bind' || r.rs.k === 'bindRun'))).sort((a, b) => dist(a, u) - dist(b, u)).slice(0, F.maxRats || 8);
  if (rats.length < (F.minRats || 2)) return false;
  x.cdT = W.t + (F.cd || 14); if (u.act) interrupt(W, u, '쥐 방진');
  u.act = { k: 'pr', s: 'fort', phase: 'fort', t0: W.t, end: W.t + (F.dur || 2.5), rats: rats.map(r => r.i), absorbed: 0, dead: 0, why: why || '' };
  u.saT = Math.max(u.saT || -9, u.act.end + 0.05); stop(u);
  rats.forEach((r, i) => { r.rs = { k: 'fort', a: i / rats.length * 6.283, until: u.act.end + 0.5 }; });
  L(W, { k: 'prFort', a: u.i, n: rats.length, why: why || '', vis: prnVis(W, u) });
  if (W.fxOn) W.fx.push({ k: 'prRing', a: u.i, x: u.x, y: u.y, r: 1.6, t0: W.t, c: 'g' });
  return true;
}
function prSpin(W, u, cn){
  const F = PRN(W).fort || {}, hits = prnFoes(W, u).filter(e => dist(e, u) < (F.spinR || 1.8) + e.r);
  for (const e of hits){ strike(W, u, e, e, 1, false, { mul: cn.mul, crit: cn.crit || undefined, tag: '쥐 방진 — 대검 회전' }); if (e.alive) shove(W, u, e, 0.8, e.x - u.x, e.y - u.y, { tag: '대검 회전에 밀려남' }); }
  L(W, { k: 'prSpin', a: u.i, n: hits.length, abs: cn.absorbed, w: cn.w, dead: cn.dead, crit: !!cn.crit, mul: +cn.mul.toFixed(2), vis: prnVis(W, u) });
  if (W.fxOn) W.fx.push({ k: 'prRing', a: u.i, x: u.x, y: u.y, r: F.spinR || 1.8, t0: W.t, c: hits.length ? 'g' : 'm', spin: true });
}
// 쥐 사다리: 2.5 ~ 8칸 떨어진 적에게 — 쥐 셋이 발밑에 모이고 (0.4초) 그 위에 올라타 파도처럼 미끄러져 들어가 (7칸/초) 내려찍음 (1.3칸 · 공격 × 1.5 · 휘청 0.5)
function prLadder(W, u, t, cn, rats){
  const Ld = PRN(W).ladder || {}, x = specOf(u, 'pladder');
  if (!cn){ if (!x || W.t < x.cdT) return false; x.cdT = W.t + (Ld.cd || 7); }
  const d = Math.hypot(t.x - u.x, t.y - u.y) || 1;
  u.act = { k: 'pr', s: 'ladder', phase: 'gather', t0: W.t, b: t.i, rats: rats.map(r => r.i), dx: (t.x - u.x) / d, dy: (t.y - u.y) / d, cn: cn || null, hit: false };
  u.saT = Math.max(u.saT || -9, W.t + 2.6); stop(u);
  rats.forEach(r => { r.rs = { k: 'ladder', until: W.t + 3 }; });
  L(W, { k: 'prLadder', a: u.i, b: t.i, counter: !!cn, vis: prnVis(W, u, t) });
  return true;
}
function prLadderEnd(W, u){ const A = u.act; if (A && A.rats) for (const i of A.rats){ const r = W.units[i]; if (r && r.rs && r.rs.k === 'ladder') ratFree(r); } u.act = null; u.saT = Math.min(u.saT || -9, W.t); }
// 쥐 방패: 동료가 위험 (체력 45% 아래 · 3칸 안에 적) 하거나 포렌이 위험 (50% · 2칸) 하면 — 포렌이 뒤로 뛰어 빠져 6초 지휘 (큰 휘청이면 끊김) ·
//   쥐 (최대 12) 가 적과 지킬 이 사이에 한 줄 (일곱부터 두 줄) 로 서서 온몸으로 막음 — 치지 않고 막기도 아님 · 맞은 충격은 곁의 구성원이 똑같이 나눠 받음
function prShield(W, u){
  const S = PRN(W).shield || {}, x = specOf(u, 'pshield');
  if (!x || W.t < x.cdT || (u.act && u.act.k === 'pr')) return false;
  const rats = prnRats(W, u).filter(r => !ratBusy(r) || (r.rs && r.rs.k === 'wall')); if (!rats.length) return false;
  const near = (o, r) => W.units.some(e => e.alive && !e.gone && e.side !== o.side && dist(e, o) < r);
  let pr = W.units.filter(o => o.alive && !o.gone && o.side === u.side && !o.summon && o !== u && o.hp < o.max * (S.allyHp || 0.45) && near(o, S.allyR || 3)).sort((a, b) => a.hp / a.max - b.hp / b.max)[0];
  if (!pr && u.hp < u.max * (S.selfHp || 0.5) && near(u, S.selfR || 2)) pr = u;
  if (!pr) return false;
  x.cdT = W.t + (S.cd || 16);
  const foe = prnFoes(W, u).sort((a, b) => dist(a, u) - dist(b, u))[0];
  let ax = foe ? u.x - foe.x : -Math.cos(u.face || 0), ay = foe ? u.y - foe.y : -Math.sin(u.face || 0); const al = Math.hypot(ax, ay) || 1; ax /= al; ay /= al;
  let tx = u.x + ax * (S.jump || 2.2), ty = u.y + ay * (S.jump || 2.2); if (boxRock(W, tx, ty, u.r) || tx < 0.7 || ty < 0.7 || tx > W.map.W - 0.7 || ty > W.map.H - 0.7){ tx = u.x; ty = u.y; }
  const use = rats.sort((a, b) => dist(a, pr) - dist(b, pr)).slice(0, S.maxRats || 12);
  if (u.act) interrupt(W, u, '쥐 방패');
  u.act = { k: 'pr', s: 'cmd', phase: 'jump', t0: W.t, sx: u.x, sy: u.y, tx, ty, pr: pr.i, rats: use.map(r => r.i), ex: foe ? foe.x : u.x + Math.cos(u.face || 0), ey: foe ? foe.y : u.y + Math.sin(u.face || 0) };
  stop(u);
  if (pr !== u && !(pr.side === 0 && pr.order)){ const fx = pr.x + (pr.x - u.act.ex) / (Math.hypot(pr.x - u.act.ex, pr.y - u.act.ey) || 1) * 1.6, fy = pr.y + (pr.y - u.act.ey) / (Math.hypot(pr.x - u.act.ex, pr.y - u.act.ey) || 1) * 1.6; if (!boxRock(W, fx, fy, pr.r)) pr.flee = { x: fx, y: fy, until: W.t + 1.1, why: '물러나! (쥐 방패)' }; }
  use.forEach(r => { r.rs = { k: 'shieldWall', until: W.t + (S.dur || 6) + 1.5 }; });
  prSlots(W, u, u.act);
  L(W, { k: 'prShield', a: u.i, b: pr.i, n: use.length, vis: prnVis(W, u) });
  return true;
}
function prSlots(W, u, A){
  const S = PRN(W).shield || {}, P0 = W.units[A.pr] && W.units[A.pr].alive ? W.units[A.pr] : u;
  const F = prnFoes(W, u).filter(e => Math.hypot(e.x - P0.x, e.y - P0.y) < 6); if (F.length){ A.ex = F.reduce((s, e) => s + e.x, 0) / F.length; A.ey = F.reduce((s, e) => s + e.y, 0) / F.length; }
  const dE = Math.hypot(A.ex - P0.x, A.ey - P0.y) || 1, nx = (A.ex - P0.x) / dE, ny = (A.ey - P0.y) / dE, px = -ny, py = nx, lead = Math.min(S.ahead || 1.1, Math.max(0.55, dE * 0.55));
  const rats = A.rats.map(i => W.units[i]).filter(r => r && r.alive && r.rs && r.rs.k === 'shieldWall'), k = rats.length, rows = k > 6 ? 2 : 1, per = Math.ceil(k / rows) || 1, gp = S.gap || 0.55;
  rats.forEach((r, i) => { const row = Math.floor(i / per), col = i % per, cnt = Math.min(per, k - row * per), off = (col - (cnt - 1) / 2) * gp, ah = lead + P0.r + (rows === 2 ? (row ? 0 : 0.5) : 0);
    r.rs.slot = { x: Math.max(0.6, Math.min(W.map.W - 0.6, P0.x + nx * ah + px * off)), y: Math.max(0.6, Math.min(W.map.H - 0.6, P0.y + ny * ah + py * off)) }; r.rs.face = Math.atan2(ny, nx); });
}
function prCmdEnd(W, u, why){
  const A = u.act; if (!A || A.s !== 'cmd') return;
  for (const i of A.rats){ const r = W.units[i]; if (r && r.rs && r.rs.k === 'shieldWall') ratFree(r); }
  u.act = null; L(W, { k: 'prShieldEnd', a: u.i, why: why || '', vis: prnVis(W, u) });
}
// 쥐 포박: 4.5칸 안 가장 위험한 (공격이 가장 센) 적에게 쥐 다섯이 달려들어 매달림 — 매달린 쥐 하나마다 게이지 +22 (최대 100) · 게이지가 남은 동안 움직이지도 치지도 못함
//   대상은 버둥거려 깎음 (무거울수록 빨리 · 보스는 2.5배) · 최대 3초 (3D)
function prBind(W, u, t){
  const B = PRN(W).bind || {}, x = specOf(u, 'pbind'); if (!x || W.t < x.cdT || !t || !t.alive || t.bind) return false;
  const rats = prnRats(W, u).filter(r => !(r.rs && ['fort', 'bind', 'bindRun', 'ladder', 'shieldWall'].includes(r.rs.k)));
  if (rats.length < (B.min || 3)) return false;
  x.cdT = W.t + (B.cd || 12); t.bind = { by: u.i, rats: [], gauge: 0, t0: W.t };
  rats.sort((a, b) => dist(a, t) - dist(b, t)).slice(0, B.rats || 5).forEach(r => { r.rs = { k: 'bindRun', b: t.i, until: W.t + 2.5 }; });
  L(W, { k: 'prBind', a: u.i, b: t.i, vis: prnVis(W, u, t) });
  return true;
}
function bindAttach(W, r, t){
  const B = PRN(W).bind || {}; r.rs = { k: 'bind', b: t.i, until: W.t + (B.dur || 3) + 0.5 }; t.bind.rats.push(r.i); t.bind.gauge = Math.min(B.max || 100, t.bind.gauge + (B.per || 22));
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.3, s: '찍!', c: 'g', t0: W.t });
}
function bindTick(W, dt){
  const B = PRN(W).bind || {};
  for (const t of W.units){ const bd = t.bind; if (!bd) continue;
    bd.rats = bd.rats.filter(i => W.units[i] && W.units[i].alive && W.units[i].rs && W.units[i].rs.k === 'bind' && W.units[i].rs.b === t.i);
    const el = W.t - bd.t0, boss = (t.traits || []).includes('보스') || !!t.jrB || !!t.h2;
    if (bd.rats.length) bd.gauge -= (B.drain || 22) * (1 + (t.mass || 70) / 200) * (boss ? B.boss || 2.5 : 1) * dt;
    if (bd.gauge > 0 && t.alive){ t.bound = true; t.stunT = Math.max(t.stunT || -9, W.t + 0.15); if (t.act && (t.act.phase === 'wind' || t.act.phase === 'run') && t.act.k !== 'reload') t.act = null; stop(t); }
    else t.bound = false;
    if (!t.alive || el > (B.dur || 3) || (el > 1.2 && bd.gauge <= 0) || (el > 2.5 && !bd.rats.length)){
      for (const i of bd.rats){ const r = W.units[i]; if (r && r.alive){ ratFree(r); shove(W, t, r, 0.8, r.x - t.x, r.y - t.y, { tag: '뿌리침' }); } }
      if (t.alive && bd.rats.length) L(W, { k: 'prUnbind', a: t.i, n: bd.rats.length, el: +el.toFixed(1), vis: t.side === 0 || !!t.seenBy });
      t.bind = null; t.bound = false; } }
}
// 받는 피해 (porenTake): 쥐 망토 · 방진 (쥐들이 70% 를 나눠 받음) · 쥐 방패 (구성원이 충격을 나눠 받음)
function porenTake(W, a, t, dmg, o){
  if (o && (o.share || o.dot)) return dmg;
  const P = PRN(W);
  if (t.act && t.act.k === 'roll') dmg *= (P.vetRoll || {}).def || 0.6;   // 구르는 동안 (방어 보정)
  if (t.porenKit){
    const C = P.cloak || {}, n = t.cloakN || 0; if (n > 0) dmg *= 1 - Math.min(C.max || 0.16, (C.per || 0.035) * n);
    const A = t.act; if (A && A.k === 'pr' && A.s === 'fort' && dmg > 0){ const F = P.fort || {}, near = A.rats.map(i => W.units[i]).filter(r => r && r.alive && dist(r, t) < (F.near || 1.6));
      if (near.length){ const share = dmg * (F.share || 0.7), each = Math.max(1, Math.round(share / near.length)); for (const r of near){ applyDmg(W, a, r, each, { tag: '쥐 방진 — 포렌 대신 맞음', share: true }); if (!r.alive) A.dead++; } A.absorbed += share; dmg -= share;
        if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.5, s: '나눠 받음 ' + Math.round(share) + ' ÷ ' + near.length, c: 'g', t0: W.t }); } }
  } else if (t.rs && t.rs.k === 'shieldWall'){
    const S = P.shield || {}, mem = W.units.filter(r => r !== t && r.alive && !r.gone && r.ratOf === t.ratOf && r.rs && r.rs.k === 'shieldWall' && dist(r, t) < (S.shareR || 2.5));
    if (mem.length){ const part = Math.max(1, Math.round(dmg / (mem.length + 1))); for (const r of mem) applyDmg(W, a, r, part, { tag: '쥐 방패 — 충격을 나눠 받음', share: true }); dmg = part; }
  }
  return dmg;
}
// 도발 (쥐들의 대왕): 3칸 안의 적은 포렌을 먼저 노림 — 보스는 따르지 않음
function tauntOf(W, u, pick, seen){
  if (!pick || u.ratOf != null || u.jrB || (u.traits || []).includes('보스')) return pick;
  let best = null, bd = 1e9; for (const f of seen || []){ if (!f.taunt || !f.alive || f.gone) continue; const d = gap(u, f); if (d <= f.taunt && d < bd){ bd = d; best = f; } }
  return best || pick;
}
// 대검 베기: 앞의 다른 적 하나까지 60% 피해로 베어 넘김
function prnCleave(W, u, t){
  const o = W.units.filter(e => e !== t && e.alive && !e.gone && e.side !== u.side && gap(u, e) <= u.rng + 0.3 && angDiff(Math.atan2(e.y - u.y, e.x - u.x), u.face || 0) < 1.3).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (o) strike(W, u, o, o, 1, false, { mul: u.cleave, tag: '대검 베기 — 베어 넘김' });
}
// 포렌 두뇌 (2D porenUpdate 의 순서 그대로): 쥐 방패 → 위기면 쥐 방진 → 쥐 포박 → 쥐 사다리 (그 밖엔 보통 근접 — 대검으로 막으며 벰)
function porenBrain(W, u, dt){
  if (!u.prn || u.act || u.kb || W.t < (u.stunT || -9) || prone(W, u)) return false;
  const P = PRN(W);
  if (prShield(W, u)) return true;
  if (u.hp < u.max * ((P.fort || {}).lowHp || 0.4) && prFort(W, u, '위기')) return true;
  if (specReady(W, u, 'pbind')){ const B = P.bind || {}, F = prnFoes(W, u).filter(e => !e.bind && dist(u, e) <= (B.range || 4.5) && canSee(W, u, e));
    if (F.length && prBind(W, u, F.reduce((a, b) => (b.atk || 0) > (a.atk || 0) ? b : a))) return true; }
  const t = u.target, Ld = P.ladder || {};
  if (t && t.alive && !t.gone && t.side !== u.side && specReady(W, u, 'pladder')){ const d = dist(u, t);
    if (d >= (Ld.min || 2.5) && d <= (Ld.max || 8) && canSee(W, u, t)){ const rats = prnRats(W, u).filter(r => !(r.rs && ['fort', 'bind', 'bindRun', 'ladder', 'shieldWall'].includes(r.rs.k))).sort((a, b) => dist(a, u) - dist(b, u)).slice(0, Ld.rats || 3);
      if (rats.length >= (Ld.rats || 3) && prLadder(W, u, t, null, rats)) return true; } }
  return false;
}
// 동작 (u.act.k === 'pr')
function prStep(W, u, dt){
  const A = u.act, P = PRN(W);
  if (A.s === 'fort'){ stop(u);
    if (W.t < A.end) return;
    const F = P.fort || {}, rats = A.rats.map(i => W.units[i]).filter(r => r && r.alive), fw = (u.mass || 140) * 4 + rats.filter(r => dist(r, u) < (F.near || 1.6)).reduce((s, r) => s + (r.mass || 10), 0);
    const cn = { mul: (u.atk + A.absorbed * (F.counter || 0.6) + fw * (F.weightK || 0.164)) / Math.max(1, u.atk), crit: W.rand() < (F.crit || 0.25), absorbed: Math.round(A.absorbed), w: Math.round(fw), dead: A.dead };
    for (const r of rats) if (r.rs && r.rs.k === 'fort') ratFree(r);
    u.act = null; u.saT = Math.min(u.saT || -9, W.t);
    if (!prnFoes(W, u).some(e => dist(e, u) < (F.spinR || 1.8) + e.r)){ const Ld = P.ladder || {}, far = prnFoes(W, u).filter(e => dist(e, u) <= (Ld.max || 8) && canSee(W, u, e)).sort((a, b) => (b.atk || 0) - (a.atk || 0))[0];
      if (far && rats.length >= (Ld.rats || 3)){ prLadder(W, u, far, cn, rats.sort((a, b) => dist(a, u) - dist(b, u)).slice(0, Ld.rats || 3)); return; } }
    prSpin(W, u, cn); return;
  }
  if (A.s === 'ladder'){
    const t = W.units[A.b], rats = A.rats.map(i => W.units[i]).filter(r => r && r.alive), Ld = P.ladder || {};
    if (!t || !t.alive || t.gone){ prLadderEnd(W, u); return; }
    if (A.phase === 'gather'){ stop(u); const k = Math.min(1, dt * 10); rats.forEach((r, i) => { r.x += (u.x - (i - 1) * 0.35 * A.dx - r.x) * k; r.y += (u.y - (i - 1) * 0.35 * A.dy - r.y) * k; }); if (W.t - A.t0 >= 0.4){ A.phase = 'ride'; A.t1 = W.t; } return; }
    if (A.phase === 'ride'){ const d = Math.hypot(t.x - u.x, t.y - u.y) || 1, nx = (t.x - u.x) / d, ny = (t.y - u.y) / d, st = Math.min(d, (Ld.speed || 7) * dt), px = u.x + nx * st, py = u.y + ny * st, blk = boxRock(W, px, py, u.r * 0.8);
      if (!blk){ u.x = px; u.y = py; } u.fg = u.face = Math.atan2(ny, nx); stop(u);
      rats.forEach((r, i) => { r.x = u.x - nx * (i - 1) * 0.35; r.y = u.y - ny * (i - 1) * 0.35; });
      if (blk || d < 1.2 + t.r || W.t - A.t1 > 1.6){ A.phase = 'slam'; A.t2 = W.t; } return; }
    if (A.phase === 'slam'){ stop(u);
      if (!A.hit && W.t - A.t2 >= 0.15){ A.hit = true;
        if (A.cn) prSpin(W, u, A.cn);
        else { const hits = prnFoes(W, u).filter(e => Math.hypot(e.x - t.x, e.y - t.y) < (Ld.r || 1.3) + e.r);
          for (const e of hits){ strike(W, u, e, e, 1, false, { mul: Ld.mul || 1.5, tag: '쥐 사다리 — 내려찍기' }); if (e.alive){ if ((e.mass || 70) < (u.mass || 140) * 3) stun(W, e, Ld.stun || 0.5, u.i); shove(W, u, e, 0.6, e.x - u.x, e.y - u.y, { tag: '내려찍기에 밀려남' }); } }
          L(W, { k: 'prSlam', a: u.i, b: t.i, n: hits.length, vis: prnVis(W, u, t) }); if (W.fxOn) W.fx.push({ k: 'quake', x: t.x, y: t.y, r: Ld.r || 1.3, t0: W.t }); } }
      if (W.t - A.t2 >= 0.4) prLadderEnd(W, u); return; }
    return;
  }
  if (A.s === 'cmd'){ const S = P.shield || {};
    if (A.phase === 'jump'){ const k = Math.min(1, (W.t - A.t0) / 0.4), e = 1 - (1 - k) * (1 - k); u.x = A.sx + (A.tx - A.sx) * e; u.y = A.sy + (A.ty - A.sy) * e; stop(u); if (k >= 1){ A.phase = 'hold'; A.t1 = W.t; } return; }
    stop(u); prSlots(W, u, A); u.fg = Math.atan2(A.ey - u.y, A.ex - u.x);
    if (W.t - A.t1 >= (S.dur || 6) || !A.rats.some(i => W.units[i] && W.units[i].alive && W.units[i].rs && W.units[i].rs.k === 'shieldWall')) prCmdEnd(W, u, W.t - A.t1 >= (S.dur || 6) ? '' : '쥐가 모두 쓰러짐');
    return;
  }
  u.act = null;
}
// 쥐 두뇌 (양쪽 같음) — 포렌의 기술로만 움직임 · 명령은 받지 않음
function ratBrain(W, r, dt){
  if (r.order) r.order = null;
  const S = r.rs || (r.rs = { k: 'idle' }), K = W.units[r.ratOf], king = K && K.alive && !K.gone ? K : null, tgt = i => { const t = W.units[i]; return t && t.alive && !t.gone ? t : null; };
  const lead = king || (r.ratKind === 'ratVet' ? null : vetOf(W, r));   // 지휘의 열화 카피: 포렌이 쓰러지면 쥐 베테랑을 따름
  if (r.leaveT != null){ stop(r); if (king) faceTo(r, king); setMood(W, r, '경례'); return true; }   // 싸움 끝 — 경례하고 사라짐 (도감)
  if (S.k !== 'idle' && S.until != null && W.t >= S.until) ratFree(r);
  const s = r.rs;
  if (r.ratKind === 'ratVet' && (s.k === 'idle' || s.k === 'assault') && vetRoll(W, r, s.k === 'assault' ? tgt(s.b) : r.target && r.target.alive && !r.target.gone && r.target.side !== r.side ? r.target : null)) return true;   // 구르기
  if (s.k === 'fort'){ if (!king){ ratFree(r); } else { const a = s.a + W.t * 1.6; setMood(W, r, '쥐 방진 — 대검 둘레'); goTo(W, r, king.x + Math.cos(a) * 1.25, king.y + Math.sin(a) * 1.25, dt); return true; } }
  if (s.k === 'ladder'){ stop(r); setMood(W, r, '쥐 사다리 — 포렌을 태움'); return true; }
  if (s.k === 'bindRun'){ const t = tgt(s.b); if (!t || !t.bind){ ratFree(r); } else { if (dist(r, t) < t.r + r.r + 0.35) bindAttach(W, r, t); else { setMood(W, r, '묶으러', t.i); goTo(W, r, t.x, t.y, dt); } return true; } }
  if (s.k === 'bind'){ const t = tgt(s.b); if (!t || !t.bind){ ratFree(r); } else { const B = t.bind, j = B.rats.indexOf(r.i), a = j / Math.max(1, B.rats.length) * 6.283 + (W.t - B.t0) * 2; r.x = t.x + Math.cos(a) * (t.r + r.r * 0.5); r.y = t.y + Math.sin(a) * (t.r + r.r * 0.5); stop(r); setMood(W, r, '매달림', t.i); return true; } }
  if (s.k === 'shieldWall'){ if (!s.slot){ ratFree(r); } else { if (Math.hypot(s.slot.x - r.x, s.slot.y - r.y) > 0.15){ setMood(W, r, '쥐 방패 — 자리로'); goTo(W, r, s.slot.x, s.slot.y, dt); } else { stop(r); r.fg = s.face; setMood(W, r, '쥐 방패 — 온몸으로 막음'); } return true; } }
  if (s.k === 'wall'){ const g = tgt(s.g), e = tgt(s.a); if (!g || !e){ ratFree(r); } else { const d = dist(g, e) || 1, nx = (e.x - g.x) / d, ny = (e.y - g.y) / d, ah = Math.min(d * 0.6, g.r + r.r + 0.25), off = (s.idx - (s.n - 1) / 2) * 0.5;
      const x = g.x + nx * ah - ny * off, y = g.y + ny * ah + nx * off; if (Math.hypot(x - r.x, y - r.y) > 0.12){ setMood(W, r, '방벽 — ' + g.name + ' 앞으로', e.i); goTo(W, r, x, y, dt); } else { stop(r); r.fg = Math.atan2(ny, nx); setMood(W, r, '방벽', e.i); } return true; } }
  if (s.k === 'assault'){ const t = tgt(s.b); if (!t || !(lead ? markOn(W, lead) : W.t < (s.until || 0))){ ratFree(r); } else { r.target = t; r.state = r.side ? 'hunt' : 'fight'; fight(W, r, t, dt, true, true); return true; } }
  // 쉬는 쥐: 표식이 남아 있으면 합류
  if (lead && markOn(W, lead)){ const t = W.units[lead.ratMark.b]; r.rs = { k: 'assault', b: t.i, until: lead.ratMark.until, a: W.rand() * 6.283 }; r.target = t; fight(W, r, t, dt, true, true); return true; }
  const knight = r.ratKind === 'ratKnight' || r.ratKind === 'ratVet';
  if (!s.tgT || W.t >= s.tgT){ s.tgT = W.t + 0.3 + W.rand() * 0.2; let t = null;
    const anc = !r.ratWild && lead ? lead : r, lim = r.ratWild || !lead ? 16 : 7;
    if (!r.ratWild && lead && lead.target && lead.target.alive && !lead.target.gone && lead.target.side !== r.side && dist(lead, lead.target) <= 7) t = lead.target;
    else t = prnFoes(W, r).filter(e => dist(anc, e) <= lim && (dist(r, e) < 2.5 || canSee(W, r, e) || (r.side === 0 ? !!e.seenBy : false))).sort((a, b) => dist(r, a) - dist(r, b))[0] || null;
    s.tg = t ? t.i : null; }
  const t = s.tg != null ? tgt(s.tg) : null;
  if (t){ if (knight) return false;   // 쥐 기사 · 베테랑: 창 거리 · 방패 · 돌격은 보통 근접 그대로
    if (!r.flee && W.rand() < dt * 0.05){ const d = dist(r, t) || 1, fx = r.x + (r.x - t.x) / d * 2.5, fy = r.y + (r.y - t.y) / d * 2.5; if (!boxRock(W, fx, fy, r.r)) r.flee = { x: fx, y: fy, until: W.t + 0.7, why: '쌩 — 도망쳤다 돌아옴' }; }   // 갑자기 뒤로 쌩
    r.target = t; r.state = r.side ? 'hunt' : 'fight'; fight(W, r, t, dt, true, true); return true; }
  if (!r.ratWild && lead){ if (dist(r, lead) > 2.2){ const a = (r.i * 2.399) % 6.283; setMood(W, r, lead === king ? '포렌을 따름' : '베테랑을 따름'); goTo(W, r, lead.x + Math.cos(a) * 1.4, lead.y + Math.sin(a) * 1.4, dt); } else { stop(r); setMood(W, r, lead === king ? '포렌 곁' : '베테랑 곁'); } return true; }
  if (!s.wp || W.t >= (s.wpT || 0) || Math.hypot(s.wp.x - r.x, s.wp.y - r.y) < 0.5){ const c = lead || r; s.wpT = W.t + 3 + W.rand() * 3; s.wp = null;
    for (let k = 0; k < 8; k++){ const a = W.rand() * 6.283, d = 1.5 + W.rand() * 4.5, x = c.x + Math.cos(a) * d, y = c.y + Math.sin(a) * d; if (x > 0.7 && y > 0.7 && x < W.map.W - 0.7 && y < W.map.H - 0.7 && !boxRock(W, x, y, r.r)){ s.wp = { x, y }; break; } } }
  if (s.wp){ setMood(W, r, '어슬렁'); goTo(W, r, s.wp.x, s.wp.y, dt); } else stop(r);
  return true;
}
// 포렌마다 (매 순간): 충성 · 쥐 망토 · 쥐 표식 · 방벽 · 강공에 방진 · 지휘가 끊김 · 기억하는 쥐
function porenTick(W, dt){
  let any = false;
  for (const u of W.units){ if (!u.porenKit) continue; any = true; prnMemTick(W, u); if (u.gone){ ratsOut(W, u.side, r => r.ratOf === u.i, u.i, '포렌을 따라 나감'); continue; } if (!u.alive) continue; prnUnitTick(W, u, dt); }   // 포렌이 맵을 나가면 쥐도 함께
  if (any) for (const v of W.units){ if (v.ratOf == null || !v.alive || v.gone) continue;
    if (v.leaveT != null && W.t >= v.leaveT){ v.alive = false; v.gone = 'left'; stop(v); continue; }   // 경례 뒤 사라짐
    if (v.ratKind === 'ratVet'){ const K = W.units[v.ratOf]; if (!(K && K.alive && !K.gone)) vetCmd(W, v); } }
  if (any) for (const t of W.units) if (t.bind){ bindTick(W, dt); break; }
  if (any) for (const s of [0, 1, 2]){ if (!W.units.some(r => r.alive && !r.gone && r.side === s && r.ratOf != null)) continue;   // 편에 쥐만 남으면 흩어짐
    if (!W.units.some(o => o.alive && !o.gone && o.side === s && !o.summon)) ratsOut(W, s, () => true, null, '편에 쥐만 남아 흩어짐'); }
}
// 쥐가 한꺼번에 사라짐 (한 줄로 적음)
function ratsOut(W, side, f, by, why){
  const R = W.units.filter(r => r.alive && !r.gone && r.side === side && r.ratOf != null && f(r)); if (!R.length) return;
  for (const r of R){ r.alive = false; r.gone = 'left'; r.act = null; stop(r); }
  L(W, { k: 'ratScatter', a: by != null ? by : R[0].i, n: R.length, why: why || '', vis: side === 0 || R.some(r => !!r.seenBy) });
}
function prnUnitTick(W, u, dt){
  const P = PRN(W); if (!u.prn){ u.prn = { loyal: null, wallCd: -9, settled: false, calmT: null }; prnInit(W, u); }
  const Q = u.prn, rats = prnRats(W, u), on = prnFight(W, u), cap = on ? (P.cap || 24) : Math.min(P.cap || 24, P.idleCap || 4);
  if (!Q.loyal){ const k = prnRoll(W); Q.loyal = { t: 0, next: k, dur: prnFill(W, k) }; }
  Q.full = rats.length >= cap;
  if (!Q.full){ Q.loyal.t += dt * (on ? (rats.length < (P.few || 4) ? P.fewK || 2.5 : 1) : P.idleK || 0.25);
    if (Q.loyal.t >= Q.loyal.dur){ prnRat(W, u, Q.loyal.next); const k = prnRoll(W); Q.loyal = { t: 0, next: k, dur: prnFill(W, k) }; } }
  { const C = P.cloak || {}; u.cloakN = Math.min(Math.round((C.max || 0.16) / (C.per || 0.035)), rats.filter(r => dist(r, u) < (C.r || 1.6)).length); }
  if (u.act && u.act.k === 'atk' && u.act.phase === 'wind'){ const t = W.units[u.act.b]; if (t && t.alive && t.side !== u.side && specReady(W, u, 'pmark')) prnMark(W, u, t, '쳐들어가며'); }
  for (const e of W.units){ const A = e.act; if (!e.alive || e.gone || e.side === u.side || !A || A.phase !== 'wind' || A.b == null) continue;
    if (!(A.k === 'charge' || A.k === 'bash' || A.k === 'h2' || A.k === 'spec' || (A.k === 'atk' && !isFar(e)))) continue;
    const g = W.units[A.b]; if (!g || !g.alive || g.side !== u.side || g.ratOf != null || !prnStrong(W, e)) continue;
    if (g === u){ if (!(u.act && u.act.k === 'pr')) prFort(W, u, '강공'); }   // 포렌 본인: 대검을 꽂고 쥐 방진
    else prnWall(W, u, g, e); }
  if (u.act && u.act.k === 'pr' && u.act.s === 'cmd' && (u.stunT || -9) - W.t >= ((P.shield || {}).bigStun || 0.5)) prCmdEnd(W, u, '지휘 끊김!');
  if (!Q.settled && !prnFoes(W, u).length) prnSettle(W, u);
  else if (Q.settled && prnFoes(W, u).length) Q.settled = false;   // 새 적이 생김 (여정 맵 · 만남) — 다음 싸움 끝에 다시   // 싸움 끝 (적이 모두 쓰러짐) — 판이 끝나기 전 그 순간에
}
// 투창 뒤: 검 (javSide) 이 있으면 그것으로 근접 · 없으면 맨손 — 쥐 베테랑 (도감: 투창 후 검으로 근접전)
function javAfter(W, u){ const sw = u.javSide && (W.rules.weapons || {})[u.javSide]; u.rng = (sw || W.rules.weapons['맨손'] || { rng: 0.3 }).rng + (u.reachX || 0); u.weaponNow = sw ? u.javSide : '맨손'; }
// 지휘의 열화 카피 (쥐 베테랑): 포렌이 쓰러지면 쥐들이 베테랑을 따르고, 베테랑이 치려는 적에게 표식 (덤 쥐 없이 3초 · 대기 18초)
const vetOf = (W, r) => W.units.find(v => v !== r && v.alive && !v.gone && v.ratOf === r.ratOf && v.ratKind === 'ratVet' && v.leaveT == null) || null;
function vetCmd(W, v){
  const C = PRN(W).vetCmd || {}, A = v.act; if (W.t < (v.vcmdCd || -9) || !A || A.k !== 'atk' || A.phase !== 'wind') return;
  const t = W.units[A.b]; if (!t || !t.alive || t.side === v.side) return;
  const rats = W.units.filter(r => r !== v && r.alive && !r.gone && r.ratOf === v.ratOf && r.leaveT == null && !ratBusy(r)); if (!rats.length) return;
  v.vcmdCd = W.t + (C.cd || 18); v.ratMark = { b: t.i, until: W.t + (C.dur || 3) };
  rats.forEach((r, i) => { r.rs = { k: 'assault', b: t.i, until: v.ratMark.until, a: i / rats.length * 6.283 }; });
  L(W, { k: 'ratVetCmd', a: v.i, b: t.i, n: rats.length, vis: v.side === 0 || !!v.seenBy || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'ratmark', b: t.i, t0: W.t, until: v.ratMark.until });
}
// 구르기 (쥐 베테랑 — 민수 메모: 앞뒤 · 방어 보정 · 급소 보호 · 중대형까지 넘어뜨림 / 도감: 진형을 붕괴시키는 구르기)
//   뒤: 나를 노린 근접 일격이 손 안에서 준비 중이면 60% 로 뒤로 굴러 빠짐 · 앞: 1.6 ~ 4.2칸의 적에게 굴러 들어가 닿는 몸을 넘어뜨림 (대형 · 초대형은 밀기만)
const ROLL_BIG = ['대형', '초대형'];
function vetRoll(W, r, t){
  const V = PRN(W).vetRoll || {}; if (W.t < (r.rollCd || -9) || r.act || r.bound || prone(W, r) || W.t < (r.stunT || -9) || r.kb) return false;
  const e = W.units.find(f => f.alive && !f.gone && f.side !== r.side && f.act && f.act.phase === 'wind' && f.act.b === r.i && f.act !== r.rollSeen && !isFar(f) && (f.act.k === 'atk' || f.act.k === 'bash' || f.act.k === 'spec' || f.act.k === 'h2') && gap(f, r) < (f.rng || 0.5) + (W.rules.reach || 0.3) + 0.5 && f.act.end - W.t > 0.1);
  if (e){ r.rollSeen = e.act;
    if (W.rand() < (V.backP != null ? V.backP : 0.6)){ const a0 = Math.atan2(r.y - e.y, r.x - e.x), d = V.bDist || 2.2;
      for (const da of [0, 0.6, -0.6, 1.1, -1.1]){ const x = r.x + Math.cos(a0 + da) * d, y = r.y + Math.sin(a0 + da) * d;
        if (x < 0.7 || y < 0.7 || x > W.map.W - 0.7 || y > W.map.H - 0.7 || boxRock(W, x, y, r.r) || !fatClear(W.map, r.x, r.y, x, y, r.r * 0.7)) continue;
        rollStart(W, r, 'back', x, y, e); return true; } } }
  if (!t || !t.alive || t.gone || t.side === r.side || ROLL_BIG.includes(sizeOf(t))) return false;
  const d = dist(r, t); if (d < (V.fMin || 1.6) || d > (V.fMax || 4.2) || !canSee(W, r, t) || !fatClear(W.map, r.x, r.y, t.x, t.y, r.r * 0.7)) return false;
  const k = Math.min(V.fDist || 3.2, d + 0.2) / d; rollStart(W, r, 'fwd', r.x + (t.x - r.x) * k, r.y + (t.y - r.y) * k, t); return true;
}
function rollStart(W, r, dir, tx, ty, t){
  const V = PRN(W).vetRoll || {}, dur = dir === 'fwd' ? V.fDur || 0.42 : V.bDur || 0.34;
  stop(r); r.act = { k: 'roll', dir, phase: 'run', t0: W.t, end: W.t + dur, sx: r.x, sy: r.y, tx, ty, b: t ? t.i : null, hit: [] };
  r.rollCd = W.t + (V.cd || 6); r.fg = r.face = Math.atan2(ty - r.y, tx - r.x) + (dir === 'back' ? Math.PI : 0);
  L(W, { k: 'ratRoll', a: r.i, b: t ? t.i : null, dir, vis: r.side === 0 || !!r.seenBy || !!(t && t.seenBy) });
  if (W.fxOn) W.fx.push({ k: 'num', x: r.x, y: r.y - 0.3, s: dir === 'fwd' ? '앞구르기!' : '뒷구르기!', c: 'g', t0: W.t });
}
function rollStep(W, r, dt){
  const A = r.act, k = Math.min(1, (W.t - A.t0) / Math.max(0.05, A.end - A.t0)), e = 1 - (1 - k) * (1 - k), nx = A.sx + (A.tx - A.sx) * e, ny = A.sy + (A.ty - A.sy) * e;
  stop(r); let blk = false;
  if (!boxRock(W, nx, ny, r.r * 0.8)){ r.x = nx; r.y = ny; } else blk = true;
  if (A.dir === 'fwd') for (const o of W.units){ if (!o.alive || o.gone || o.side === r.side || A.hit.includes(o.i)) continue; if (Math.hypot(o.x - r.x, o.y - r.y) < o.r + r.r + ((PRN(W).vetRoll || {}).w || 0.35)){ A.hit.push(o.i); rollBump(W, r, o); } }
  if (k >= 1 || blk){ r.act = null; if (A.dir === 'fwd' && A.hit.length) L(W, { k: 'ratRollHit', a: r.i, n: A.hit.length, vis: r.side === 0 || !!r.seenBy }); }
}
function rollBump(W, r, o){
  const V = PRN(W).vetRoll || {}, big = ROLL_BIG.includes(sizeOf(o));
  strike(W, r, o, o, 1, false, { mul: V.mul || 0.5, wk: '둔기', noWound: true, tag: '구르기 — 들이받음' });
  if (!o.alive) return;
  if (!big) knockDown(W, o, V.kd || 1.1, r.i, '쥐 베테랑의 구르기에 발이 걸림');
  shove(W, r, o, big ? 0.3 : V.shove || 0.9, o.x - r.x, o.y - r.y, { tag: '구르기에 밀려남' });
}
// 기억에서 빠짐: 쓰러진 쥐 기사 (포렌이 쓰러져 있어도 셈)
function prnMemTick(W, u){
  if (u.ratMem) for (const r of W.units) if (r.ratOf === u.i && r.ratRec && !r.alive && !r.gone && !r.recGone){ r.recGone = true; const j = u.ratMem.indexOf(r.ratRec); if (j >= 0) u.ratMem.splice(j, 1); L(W, { k: 'ratLost', a: r.i, n: r.ratRec.n, vis: true }); }
}
// 싸움 끝: 살아남은 쥐 기사 — 돌아온 횟수 +1 · 단계 +1 (최대 4) · 세 번 돌아오면 쥐 베테랑 · 경례하고 사라짐 (도감 — 적 포렌의 기사도)
function prnSettle(W, u){
  u.prn.settled = true;
  const ns = [], lv = PRN(W).leave != null ? PRN(W).leave : 1.5;
  for (const r of prnRats(W, u)){ if (r.ratKind !== 'ratKnight' && r.ratKind !== 'ratVet') continue; r.leaveT = W.t + lv; stop(r); r.act = null;
    if (r.ratRec && u.ratMem){ const x = r.ratRec; x.ret = (x.ret || 0) + 1; x.lv = Math.min(4, (x.lv || 1) + 1); if (x.ret >= 3 && !x.vet){ x.vet = true; L(W, { k: 'ratVet', a: r.i, n: x.n, vis: true }); } ns.push(x.n + (x.vet ? '★' : '')); }
    else ns.push(r.name); }
  if (ns.length) L(W, { k: 'ratSalute', a: u.i, ns: ns.join(', '), vis: u.side === 0 || !!u.seenBy });
}


/* ---------- v8.7.8 어퐁 (명세 C6 · 도감 C-103) · 카리우스 (명세 C7 — 3D karius.js v1.3 · 2D 불경자 · 근성) — 적 · 아군 같은 규칙 ----------
   어퐁: 초돌진 (5칸 넘게 떨어진 적에게만 · 돌진 걸음 × 1.8 · 길 둘레 몸 + 0.9칸의 적을 넓게 밀어냄 — 가벼우면 넘어짐 · 휩쓸린 적은 막지 못함 · 노린 적엔 돌진 충돌 그대로 — 빠른 만큼 셈) ·
         앞차기 (붙은 적을 차 밀어냄 · 휘청) · 버클러 (작은 방패 — 막는 폭 ±40° · 관통 방호 80).
   카리우스: 3D kariusThink 의 차례 그대로 — 누운 적 짓밟기 > 딥 킥 > (불경자) 몸박 · 철퇴 > 잡아뚫기 > 선 적 짓밟기 > 라이트 훅 > 노인의 팔 후려치기 > 기본 일격 (넓게 휘두르기 · 찍기 — 이 판).
   수치는 이 판의 비율 (3D 기본 주먹 두 대 = 이 판의 기본 일격 하나 · 거리는 몸 가운데부터). */
const APR = W => SPR(W, 'asup');
const KAR = W => W.rules.karius || {};
const KAR_K = ['kgrab', 'ksw', 'khook', 'kstomp', 'kslam', 'krush'], KAR_TG = ['kgrab', 'ksw', 'khook', 'kstomp', 'kslam', 'krush', 'akick'];
const isBoss = t => (t.traits || []).includes('보스');
const airOf = t => !!(t && t.act && t.act.k === 'leap' && t.act.air);
// 초돌진: 돌진 (예고 0.35초) 그대로 시작 — 달리는 동안 stepCharge 가 걸음 × spd · 길 둘레를 휩쓺 (apSweep)
function apSup(W, u, t, why){
  const S = APR(W), x = specOf(u, 'asup');
  if (!x || !t || !t.alive || !specReady(W, u, 'asup') || u.act || u.kb || u.lie || W.t < (u.proneT || -9) || W.t < (u.stunT || -9)) return false;
  const g = gap(u, t); if (g <= (S.min || 5) || g > (S.rng || 12) || !fatClear(W.map, u.x, u.y, t.x, t.y, u.r * 0.9)) return false;
  const nm = u.chargeName; u.chargeName = '초돌진'; startCharge(W, u, t, null); u.chargeName = nm;
  if (!u.act || u.act.k !== 'charge') return false;
  u.act.sup = true; x.cdT = W.t + (S.cd || 10);
  L(W, { k: 'apSup', a: u.i, b: t.i, d: +g.toFixed(1), why: why || '', vis: u.side === 0 || !!u.seenBy || t.side === 0 });
  return true;
}
// 길 둘레 (몸 + w 칸) 의 적: 옆으로 크게 밀려나며 (가벼우면) 넘어짐 · 휩쓸린 몸은 막지 못함 · 돌진은 그들을 지나쳐 노린 적에게
function apSweep(W, u, A){
  const S = APR(W), w = S.w != null ? S.w : 0.9;
  for (const o of W.units){
    if (!o.alive || o.gone || o.side === u.side || o.i === A.b || airOf(o) || o.jrFly || (A.sw && A.sw.includes(o.i))) continue;
    const dx = o.x - u.x, dy = o.y - u.y; if (dx * A.dx + dy * A.dy < -0.3 || Math.hypot(dx, dy) > u.r + o.r + w) continue;
    (A.sw || (A.sw = [])).push(o.i); (A.ev || (A.ev = [])).push(o.i);
    const qx = -A.dy, qy = A.dx, s = dx * qx + dy * qy >= 0 ? 1 : -1, big = o.mass * (o.poise || 1) >= u.mass * (S.heavy || 1.3) || (SIZE_RANK[sizeOf(o)] || 0) >= SIZE_RANK['초대형'];
    strike(W, u, o, o, 1, false, { mul: S.mul || 0.5, wk: '둔기', grab: true, tag: '초돌진에 휩쓸림' });
    if (!o.alive) continue; if (o.kb && o.kb.by === u.i) o.kb = null;
    if (!o.kb) shove(W, u, o, (S.shove || 1.4) * (big ? 0.4 : 1), qx * s * 0.8 + A.dx * 0.6, qy * s * 0.8 + A.dy * 0.6, { tag: '초돌진에 휩쓸려 날아감' });
    if (!big) knockDown(W, o, S.kd || 1, u.i, '초돌진에 휩쓸려 나뒹굶');
    L(W, { k: 'apSweep', a: u.i, b: o.i, down: !big, vis: u.side === 0 || o.side === 0 || !!u.seenBy || !!o.seenBy });
  }
}
// 어퐁이 스스로: 초돌진 (5 ~ 12칸 · 길이 트임 · 지휘가 있는 편은 '들어가!' 뒤 — 돌진과 같은 규칙) · 앞차기 (둘러싸임 · 막고 선 적 · 나를 치려는 적)
// 돌진의 '들어가!' 기다림 (지휘가 있고 방패 · 큰 몸이 있는 편은 지휘가 들어가라 할 때까지) — 편이 혼자면 기다리지 않음
const cmdHold = (W, u) => cmdOf(W, u.side) > 0 && W.units.filter(o => o.alive && !o.gone && o.side === u.side && !o.crawl).length >= 2 && W.units.some(o => o.alive && o.side === u.side && o.role === '전선' && (o.canGuard || o.bodyShield)) && !(W.stance[u.side] && W.stance[u.side].k === 'engage');
function apAuto(W, u, t){
  if (specReady(W, u, 'asup') && !u.line && !cmdHold(W, u) && !W.units.some(f => f.alive && !f.gone && f.side !== u.side && !prone(W, f) && gap(u, f) <= u.rng + 0.6)){   // 맞붙어 있지 않을 때
    const S = APR(W), w = S.w != null ? S.w : 0.9;
    const C = W.units.filter(f => f.alive && !f.gone && f.side !== u.side && !f.jrFly && !airOf(f) && (canSee(W, u, f) || (u.side === 0 ? !!f.seenBy : fresh(W, u.sense[f.i], 1.5))) && gap(u, f) > (S.min || 5) && gap(u, f) <= (S.rng || 12) && fatClear(W.map, u.x, u.y, f.x, f.y, u.r * 0.9)
        && !W.units.some(o => o.alive && o !== u && o.side === u.side && segD(u, f.x, f.y, o) < o.r + u.r && W.units.some(e => e.alive && e.side !== o.side && gap(o, e) < Math.max(o.rng, e.rng) + 0.3)))
      .map(f => ({ f, s: (isFar(f) ? 2 : 0) + (f === t ? 1 : 0) + 0.6 * W.units.filter(e => e.alive && e !== f && e.side !== u.side && segD(u, f.x, f.y, e) < u.r + e.r + w).length - 0.05 * gap(u, f) }))
      .sort((a, b) => b.s - a.s)[0];   // 진형 뒤의 사수 먼저 · 길에 휩쓸 적이 많을수록 · 노린 적 · 가까울수록
    if (C && apSup(W, u, C.f, isFar(C.f) ? '진형 뒤의 사수에게 초돌진' : C.f === t ? '멀리 떨어진 적에게 초돌진' : '진형을 뚫고 초돌진')) return true; }
  if (specReady(W, u, 'akick') && gap(u, t) <= u.rng + 0.3 && !prone(W, t) && !airOf(t) && !t.jrFly){
    const adj = W.units.filter(e => e.alive && !e.gone && e.side !== u.side && !prone(W, e) && gap(u, e) <= u.rng + 0.4).length, gd = inGuard(W, t, u), thr = !!(t.act && t.act.b === u.i && t.act.phase === 'wind' && !isFar(t));
    if (adj >= 2 || gd || thr || W.rand() < 0.04) return startSpec(W, u, t, 'akick', adj >= 2 ? '둘러싼 적을 차서 떼어 냄' : gd ? '막고 선 적을 차서 밀어냄' : thr ? '치려는 적을 먼저 차 냄' : '앞차기'); }
  return false;
}
// 겨눈 방향 · 자리 (기술을 시작할 때 정함 — 예고를 보고 피할 수 있음)
function karAim(W, u, t, k){
  if (!t) return {};
  const ang = Math.atan2(t.y - u.y, t.x - u.x), S = SPR(W, k);
  if (k === 'kslam') return { ang, px: u.x + Math.cos(ang) * (S.ahead || 1.3), py: u.y + Math.sin(ang) * (S.ahead || 1.3) };
  if (k === 'kstomp') return { ang, px: t.x, py: t.y };
  if (k === 'krush') return { ang, dx: Math.cos(ang), dy: Math.sin(ang) };
  return { ang };
}
// 부채꼴 안의 적 (몸 가운데부터 R · 벽 너머는 못 침)
const karFan = (W, u, ang, R, arc, air) => W.units.filter(e => e.alive && !e.gone && e.side !== u.side && !e.jrFly && (air || !airOf(e)) && dist(u, e) - e.r <= R && angDiff(Math.atan2(e.y - u.y, e.x - u.x), ang) <= arc / 2 + Math.atan2(e.r, Math.max(0.3, dist(u, e))) && losClear(W.map, u.x, u.y, e.x, e.y));
// 카리우스가 스스로 (3D kariusThink 의 차례)
function karAuto(W, u, t){
  const d = dist(u, t);
  if (specReady(W, u, 'kstomp')){ const dn = W.units.filter(e => e.alive && !e.gone && e.side !== u.side && prone(W, e) && !e.jrFly && gap(u, e) <= 0.7 && canSee(W, u, e)).sort((p, q) => dist(u, p) - dist(u, q))[0];
    if (dn) return startSpec(W, u, dn, 'kstomp', isBoss(dn) ? '누운 보스를 짓밟음' : '누운 적을 확인사살'); }
  if (specReady(W, u, 'kick') && gap(u, t) <= u.rng + 0.15 && !isBoss(t) && !airOf(t) && !t.jrFly){ const a0 = Math.atan2(t.y - u.y, t.x - u.x), wb = wallBehind(W, t, Math.cos(a0), Math.sin(a0), 3.5);
    if (wb || W.rand() < 0.35) return startSpec(W, u, t, 'kick', wb ? '벽을 등진 적을 걷어참' : '앞의 적을 걷어참'); }
  if (u.heretic && specReady(W, u, 'krush')){ const S = SPR(W, 'krush'); if (d > (S.min || 2.8) && d < (S.max || 7) && fatClear(W.map, u.x, u.y, t.x, t.y, u.r * 0.9)) return startSpec(W, u, t, 'krush', '몸을 낮춰 일직선으로 몸박'); }
  if (u.heretic && specReady(W, u, 'kslam') && d <= (SPR(W, 'kslam').d || 2.3) + t.r) return startSpec(W, u, t, 'kslam', '노인의 팔이 부풀어 철퇴처럼');
  if (specReady(W, u, 'kgrab') && !t.jrFly){ const S = SPR(W, 'kgrab'), air = airOf(t);
    if (air ? d <= (S.dAir || 3.4) : d <= (S.d || 1.9) + t.r * 0.5 && !isBoss(t) && (SIZE_RANK[sizeOf(t)] || 0) < SIZE_RANK['초대형']) return startSpec(W, u, t, 'kgrab', air ? '뛰어오른 적을 광대의 팔로 끌어내림' : '광대의 팔로 끌어와 꿰뚫음'); }
  if (specReady(W, u, 'kstomp') && gap(u, t) <= 0.7 && !isBoss(t) && !airOf(t) && W.rand() < 0.3) return startSpec(W, u, t, 'kstomp', '짓밟아 넘어뜨림');
  if (specReady(W, u, 'khook') && d <= (SPR(W, 'khook').r || 1.9) + t.r) return startSpec(W, u, t, 'khook', '팔 여럿으로 라이트 훅 세 번');
  if (specReady(W, u, 'ksw')){ const S = SPR(W, 'ksw'); if (karFan(W, u, Math.atan2(t.y - u.y, t.x - u.x), S.r || 2.7, (S.arc || 137) * Math.PI / 180, true).length) return startSpec(W, u, t, 'ksw', '노인의 팔로 앞을 후려침'); }
  return false;
}
// 예고 (보고 피함): 부채꼴 · 줄 · 한 몸
function karTg(W, a, A, t){
  const S = SPR(W, A.s), ang = A.ang != null ? A.ang : Math.atan2(t.y - a.y, t.x - a.x);
  if (A.s === 'ksw' || A.s === 'khook') return { k: 'fan', ang, arc: (S.arc || (A.s === 'ksw' ? 137 : 97)) * Math.PI / 360 + 0.15, R: (S.r || (A.s === 'ksw' ? 2.7 : 1.9)) + 0.3, what: A.s === 'ksw' ? '노인의 팔' : '라이트 훅', foe: true };
  if (A.s === 'kslam') return { k: 'fan', ang, arc: 1.0, R: (S.ahead || 1.3) + (S.r || 1.3) + 0.3, what: '노인의 팔 철퇴', foe: true };
  if (A.s === 'krush') return { k: 'line', ang, len: (S.v || 9) * (S.time || 0.5) + 1, w: a.r + 0.4, what: '돌진 몸박', foe: true };
  return { k: 'one', b: t.i, ang, what: A.s === 'kgrab' ? '광대의 팔' : A.s === 'kstomp' ? '짓밟으려는 발' : '앞차기' };
}
// 카리우스의 기술이 떨어지는 때 (resolveSpec 맨 앞)
function karResolve(W, u, A, S, t){
  const k = A.s, vis = u.side === 0 || !!u.seenBy || !!(t && t.side === 0);
  if (A.phase === 'rec'){ u.act = null; return; }
  const rec = () => { A.phase = 'rec'; A.end = W.t + (S.rec || 0.5); A.t1 = W.t; u.atkT = W.t; };
  const ang = A.ang != null ? A.ang : t ? Math.atan2(t.y - u.y, t.x - u.x) : u.face || 0;
  if (k === 'kgrab'){   // 잡아뚫기: 광대의 팔이 돋아 붙잡아 끌어옴 (0.6초) → 레프트로 꿰뚫음
    if (A.phase === 'wind'){
      if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); rec(); return; }
      const air = airOf(t), d = dist(u, t);
      if (t.jrFly){ L(W, { k: 'miss', a: u.i, b: t.i, why: '하늘 — 광대의 팔이 닿지 않음', spec: k }); rec(); return; }
      if (isBoss(t) && !air){ L(W, { k: 'miss', a: u.i, b: t.i, why: '보스는 끌어오지 못함 (뛰어오른 때만 끌어내림)', spec: k }); rec(); return; }
      if (!air && (SIZE_RANK[sizeOf(t)] || 0) >= SIZE_RANK['초대형']){ L(W, { k: 'miss', a: u.i, b: t.i, why: '너무 커서 끌어오지 못함', spec: k }); rec(); return; }
      if (d > (air ? S.dAir || 3.4 : S.d || 1.9) + t.r * 0.5 + 0.3){ L(W, { k: 'miss', a: u.i, b: t.i, why: '광대의 팔이 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); rec(); return; }
      if (t.side !== u.side && !air && evadeMelee(W, t, u)){ rec(); return; }
      if (air) t.act = null;   // 뛰어오른 몸을 끌어내림
      A.phase = 'pull'; A.end = W.t + (S.pull || 0.6); A.held = t.i; A.air = air; t.heldBy = u.i; interrupt(W, t, '광대의 팔에 붙잡혀 준비가 끊김'); stop(t); t.burst = null; flailDrop(W, t, '붙잡힘');
      L(W, { k: 'karGrab', a: u.i, b: t.i, air, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: air ? '끌어내림!' : '잡힘!', c: 'd', t0: W.t }); return;
    }
    const v = A.held != null ? W.units[A.held] : null; if (v && v.heldBy === u.i) v.heldBy = null; A.held = null;
    if (v && v.alive){ const o = strike(W, u, v, v, 1, false, { mul: S.mul || 1.25, crit: W.rand() < (S.crit != null ? S.crit : 0.5), noArmor: true, grab: true, tag: '잡아뚫기 — 레프트 꿰뚫기' }); if (v.alive && A.air) stun(W, v, S.stun || 0.4, u.i); L(W, { k: 'karPierce', a: u.i, b: v.i, crit: !!(o && o.crit), air: !!A.air, vis }); }
    rec(); return;
  }
  if (k === 'ksw'){   // 노인의 팔 후려치기: 앞 부채꼴 — 밀침 · 휘청 (막으면 덜)
    const arc = (S.arc || 137) * Math.PI / 180, hit = karFan(W, u, ang, S.r || 2.7, arc, true);
    for (const e of hit){ const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.25, wk: '둔기', tag: '노인의 팔 — 후려치기' }); if (!e.alive) continue; if (e.kb && e.kb.by === u.i) e.kb = null;
      if (!e.kb) shove(W, u, e, (S.kb || 1.6) * (o && o.block ? 0.5 : 1), e.x - u.x, e.y - u.y, { tag: '노인의 팔에 밀려남' }); if (o && !o.block) stun(W, e, S.stun || 0.5, u.i); }
    L(W, { k: 'karSwat', a: u.i, n: hit.length, vis }); if (W.fxOn) W.fx.push({ k: 'kfan', a: u.i, x: u.x, y: u.y, ang, R: S.r || 2.7, arc, t0: W.t, c: 'old' }); rec(); return;
  }
  if (k === 'khook'){   // 라이트 훅 세 번: 팔 여럿으로 (마지막은 밀침 · 뛰어오른 몸도)
    const arc = (S.arc || 97) * Math.PI / 180, n = (A.n || 0) + 1, last = n >= (S.n || 3), hit = karFan(W, u, ang, S.r || 1.9, arc, last);
    for (const e of hit){ const o = strike(W, u, e, e, 1, false, { mul: S.mul || 0.45, wk: '둔기', tag: '라이트 훅 ' + n + '타' }); if (!e.alive) continue; if (e.kb && e.kb.by === u.i) e.kb = null; if (!e.kb && o && !o.block) shove(W, u, e, last ? S.kb || 1 : S.kb1 || 0.2, e.x - u.x, e.y - u.y, { tag: '라이트 훅에 밀려남' }); }
    L(W, { k: 'karHook', a: u.i, n, hit: hit.length, vis }); if (W.fxOn) W.fx.push({ k: 'kfan', a: u.i, x: u.x, y: u.y, ang, R: S.r || 1.9, arc, t0: W.t, c: 'hook' });
    if (!last){ A.n = n; A.phase = 'hook'; A.end = W.t + (S.gap || 0.15); return; }
    rec(); return;
  }
  if (k === 'kstomp'){   // 짓밟기: 발을 든 자리 (처음에 정함) — 누운 적은 확인사살 (보스는 크게 다침) · 선 적은 넘어뜨림 (대형부터는 버팀)
    const px = A.px != null ? A.px : t ? t.x : u.x, py = A.py != null ? A.py : t ? t.y : u.y, R = S.r || 0.95; let lying = false, n = 0;
    for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || airOf(e) || e.jrFly || Math.hypot(e.x - px, e.y - py) > R + e.r) continue; n++;
      if (prone(W, e)){ lying = true; const bs = isBoss(e);
        L(W, { k: 'stomp', a: u.i, b: e.i, kill: !bs, how: '짓밟기', vis: u.side === 0 || e.side === 0 || !!u.seenBy });
        if (!bs) applyDmg(W, u, e, Math.max(1, Math.ceil(e.hp)), { ff: false, far: false, part: '머리', tag: '짓밟기 · 확인사살' });
        else { hurtRaw(W, u, e, u.atk * u.atkMul * (W.rules.lethal || 1) * (S.boss || 2.5), { tag: '짓밟기' }); crushBone(W, u, e); } }
      else { const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.1, wk: '둔기', tag: '짓밟기' }); if (e.alive && o && !o.block && (SIZE_RANK[sizeOf(e)] || 0) < SIZE_RANK['대형']) knockDown(W, e, S.down || 1, u.i, '카리우스에게 짓밟혀 넘어짐'); } }
    const x = specOf(u, 'kstomp'); if (x && !lying) x.cdT = Math.max(x.cdT, A.t0 + (S.cdUp || 8));   // 선 적이면 대기 8초 (누운 적은 4초)
    if (W.fxOn) W.fx.push({ k: 'crush', x: px, y: py, t0: W.t }); if (!n) L(W, { k: 'miss', a: u.i, b: A.b, why: '발을 내린 자리에 아무도 없음', spec: k });
    rec(); return;
  }
  if (k === 'kslam'){   // 불경자 — 노인의 팔이 부풀어 철퇴처럼: 앞 1.3칸 자리 둘레 1.3칸 · 휘청
    const px = A.px != null ? A.px : u.x + Math.cos(ang) * (S.ahead || 1.3), py = A.py != null ? A.py : u.y + Math.sin(ang) * (S.ahead || 1.3), R = S.r || 1.3; let n = 0;
    for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || e.jrFly || Math.hypot(e.x - px, e.y - py) > R + e.r) continue; n++;
      const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.67, wk: '둔기', tag: '노인의 팔 철퇴' }); if (!e.alive) continue; if (e.kb && e.kb.by === u.i) e.kb = null;
      if (!e.kb) shove(W, u, e, (S.kb || 0.8) * (o && o.block ? 0.5 : 1), e.x - px, e.y - py, { tag: '철퇴에 밀려남' }); if (o && !o.block) stun(W, e, S.stun || 0.6, u.i); }
    L(W, { k: 'karSlam', a: u.i, n, vis }); if (W.fxOn){ W.fx.push({ k: 'crush', x: px, y: py, t0: W.t }); W.fx.push({ k: 'num', x: px, y: py, s: '쾅!', c: 'd', t0: W.t }); }
    rec(); return;
  }
  if (k === 'krush'){   // 불경자 — 돌진 몸박: 몸을 낮췄다가 (예고) 일직선으로 0.5초 밀고 나감 (karRushStep)
    if (A.phase === 'wind'){ A.phase = 'go'; A.end = W.t + (S.time || 0.5); A.hit = []; if (A.dx == null){ A.dx = Math.cos(ang); A.dy = Math.sin(ang); } L(W, { k: 'karRush', a: u.i, b: A.b, vis }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '우오오오!', t0: W.t }); return; }
    rec(); return;
  }
  u.act = null;
}
function karRushStep(W, u, dt){
  const A = u.act, S = SPR(W, 'krush'), x0 = u.x, y0 = u.y, st = (S.v || 9) * dt;
  tryMove(W, u, u.x + A.dx * st, u.y + A.dy * st); u.face = u.fg = Math.atan2(A.dy, A.dx);
  if (Math.hypot(u.x - x0, u.y - y0) < st * 0.3) A.end = W.t;   // 벽에 막힘
  for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || A.hit.includes(e.i) || airOf(e) || e.jrFly || dist(u, e) > u.r + e.r + 0.15) continue;
    A.hit.push(e.i); const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.46, wk: '둔기', tag: '돌진 몸박' }); if (!e.alive) continue; if (e.kb && e.kb.by === u.i) e.kb = null;
    if (!e.kb) shove(W, u, e, (S.kb || 4.5) * (o && o.block ? 0.6 : 1), A.dx, A.dy, { tag: '몸박에 밀려 날아감', how: 'kick' }); }
}
// 광대의 팔에 붙잡힘: 끌려옴 (몸 바로 앞까지) · 아무것도 못 함 — 카리우스가 휘청 · 넘어지면 놓침
function karHeld(W, g, u, dt){
  const A = g.act;
  if (g.kb || W.t < (g.proneT || -9) || W.t < (g.stunT || -9)){ u.heldBy = null; A.held = null; L(W, { k: 'karLet', a: g.i, b: u.i, vis: true }); return false; }
  if (A.phase === 'pull'){ const a = Math.atan2(u.y - g.y, u.x - g.x), D = g.r + u.r + 0.05, gx = g.x + Math.cos(a) * D, gy = g.y + Math.sin(a) * D, k = Math.min(1, dt * 8); tryMove(W, u, u.x + (gx - u.x) * k, u.y + (gy - u.y) * k); }
  stop(u); u.act = null; u.burst = null; u.vx = u.vy = 0; return true;
}
// 불경자 (체력 15% 아래): 공격 × 2.5 · 받는 피해 × 0.33 · 걸음 × 1.4 · 공격 간격 × 0.8 · 막지 않음 · 노인의 팔 철퇴 · 돌진 몸박 — 체력 50% 넘으면 풀림
function karHeretic(W, u, on){
  if (on === !!u.heretic) return;
  const H = KAR(W).heretic || {}, A = H.atk || 2.5, Df = H.def || 0.33, S = H.spd || 1.4, G = H.gap || 0.8;
  if (on){
    u.heretic = true; u.atk = +(u.atk * A).toFixed(2); u.spd = +(u.spd * S).toFixed(3); u.wind = +(u.wind * G).toFixed(3); u.rec = +(u.rec * G).toFixed(3); u.dmgK = (u.dmgK || 1) * Df; u.canGuard0 = u.canGuard; u.canGuard = false; u.raised = false;
    for (const [sk, nm] of [['kslam', '노인의 팔 철퇴'], ['krush', '돌진 몸박']]) if (!specOf(u, sk)) (u.spec || (u.spec = [])).push({ k: sk, name: nm, cdT: W.t + 0.8, n: null });
    if (!u.ls){ const A0 = u.act; if (A0 && A0.k === 'spec' && A0.s === 'kgrab' && A0.held != null){ const v = W.units[A0.held]; if (v) v.heldBy = null; } interrupt(W, u, '불경자 — 울부짖음'); u.act = { k: 'karRoar', t0: W.t, end: W.t + (H.roar || 0.6) }; stop(u); }
    L(W, { k: 'karHeretic', a: u.i, on: true, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y - 0.6, s: '불경자!', c: 'd', t0: W.t });
  } else {
    u.heretic = false; u.atk = +(u.atk / A).toFixed(2); u.spd = +(u.spd / S).toFixed(3); u.wind = +(u.wind / G).toFixed(3); u.rec = +(u.rec / G).toFixed(3); u.dmgK = (u.dmgK || 1) / Df; if (u.canGuard0 != null) u.canGuard = u.canGuard0;
    L(W, { k: 'karHeretic', a: u.i, on: false, vis: u.side === 0 || !!u.seenBy });
  }
}
// 근성: 숨이 끊길 피해 → 발버둥 (무적) 으로 바뀜 · 마지막 7초는 체력 1 은 남음
function karGritHit(W, u, t, dmg, o){
  const L0 = t.ls;
  if (L0){ if (u && u !== t && u.side !== t.side) L0.by = u.i;
    if (L0.ph !== 'last'){ if (W.fxOn && W.t - (t.lsFxT || -9) > 0.4){ t.lsFxT = W.t; W.fx.push({ k: 'num', x: t.x, y: t.y - 0.5, s: '무적 (근성)', c: 'b', t0: W.t }); } return 0; }
    const d = Math.min(dmg, Math.max(0, t.hp - 1)); if (d <= 0 && W.fxOn && W.t - (t.lsFxT || -9) > 0.4){ t.lsFxT = W.t; W.fx.push({ k: 'num', x: t.x, y: t.y - 0.5, s: '버팀 (근성)', c: 'g', t0: W.t }); } return d; }
  if (t.hp - dmg >= 0.5) return dmg;
  karGritStart(W, t, u, o); return 0;
}
function karGritStart(W, t, u, o){
  const A0 = t.act; if (A0 && A0.k === 'spec' && A0.s === 'kgrab' && A0.held != null){ const v = W.units[A0.held]; if (v) v.heldBy = null; }
  interrupt(W, t, '근성 — 무너짐'); t.act = null; t.burst = null; stop(t); t.hp = 1; t.deathKind = null; t.headAt = null;
  t.ls = { ph: 'agony', t0: W.t, by: u && u !== t ? u.i : null };
  if (t.heretic0 && !t.heretic) karHeretic(W, t, true);   // 3D: 근성이 켜지면 불경자도
  L(W, { k: 'karGrit', a: u && u !== t ? u.i : t.i, b: t.i, ph: 'agony', sec: (KAR(W).grit || {}).agony || 3, vis: true }); if (W.fxOn) W.fx.push({ k: 'say', a: t.i, s: '…(안경 빛이 꺼진다)', t0: W.t });
}
// 매 틱 (act 맨 앞): 벼락 → 차갑게 미쳐 감 · 불경자 켜고 끔 · 근성의 차례 (발버둥 → 포효 → 마지막 7초 → 쓰러짐). true = 이번 틱은 아무것도 못 함
function karTick(W, u, dt){
  const K = KAR(W), R = K.rage || {}, H = K.heretic || {};
  if (u.rageOn && W.t >= u.rageT){ u.rageOn = false; u.atk = +(u.atk / (R.atk || 1.3)).toFixed(2); L(W, { k: 'karRage', a: u.i, off: true, vis: u.side === 0 || !!u.seenBy }); }
  if (u.modBody && u.zap && u.zap.n > 0 && u.zap !== u.rageZap && !u.rageOn && !u.ls){ u.rageZap = u.zap; u.rageOn = true; u.rageT = W.t + (R.t || 6); u.atk = +(u.atk * (R.atk || 1.3)).toFixed(2); L(W, { k: 'karRage', a: u.i, sec: R.t || 6, vis: u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '…(연기를 토한다)', t0: W.t }); }
  if (u.heretic0 && !u.ls){ if (!u.heretic && u.hp <= u.max * (H.at || 0.15)) karHeretic(W, u, true); else if (u.heretic && !u.lsEnd && u.hp > u.max * (H.off || 0.5)) karHeretic(W, u, false); }
  const L0 = u.ls; if (!L0) return false;
  const G = K.grit || {}; u.hp = Math.max(1, u.hp);
  if (L0.ph === 'agony'){ stop(u); u.act = null; u.burst = null; if (W.t >= L0.t0 + (G.agony || 3)){ L0.ph = 'roar'; L0.t1 = W.t; L(W, { k: 'karGrit', a: u.i, b: u.i, ph: 'roar', vis: true }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '우어어어어!', t0: W.t }); } return true; }
  if (L0.ph === 'roar'){ stop(u); u.act = null; if (W.t >= L0.t1 + (G.roar || 0.8)){ const sp = G.spd || 1.5; L0.ph = 'last'; L0.t2 = W.t; u.wind = +(u.wind / sp).toFixed(3); u.rec = +(u.rec / sp).toFixed(3); u.saT = Math.max(u.saT || -9, W.t + (G.last || 7) + 0.05); u.stunT = -9; u.proneT = -9; L(W, { k: 'karGrit', a: u.i, b: u.i, ph: 'last', sec: G.last || 7, vis: true }); } return true; }
  for (const x of u.spec || []) if (x.cdT > W.t) x.cdT -= dt * ((G.spd || 1.5) - 1);   // 마지막 7초: 기술 대기도 1.5배 빨리
  if (W.t >= L0.t2 + (G.last || 7)){ karGritEnd(W, u); return true; }
  return false;
}
// 실이 끊긴 듯 쓰러짐 (숨을 끊은 이 = 마지막으로 친 적)
function karGritEnd(W, u){
  const G = KAR(W).grit || {}, sp = G.spd || 1.5, L0 = u.ls || {};
  u.ls = null; u.lsEnd = true; u.saT = W.t; if (L0.ph === 'last'){ u.wind = +(u.wind * sp).toFixed(3); u.rec = +(u.rec * sp).toFixed(3); }
  const by = L0.by != null && W.units[L0.by] ? W.units[L0.by] : u;
  L(W, { k: 'karGrit', a: u.i, b: u.i, ph: 'end', vis: true });
  applyDmg(W, by, u, Math.max(1, Math.ceil(u.hp)) + 1, { ff: by === u || by.side === u.side, far: false, part: null, tag: '근성이 다함 — 실이 끊긴 듯 쓰러짐', death: 'grit' });
}
// 근성 중에 싸움이 끝남: 이겨도 쓰러짐 — 체력 5% 로 살아남음 (3D 굴 싸움이 끝날 때처럼)
function karGritOver(W, u){
  const G = KAR(W).grit || {}, sp = G.spd || 1.5, L0 = u.ls || {};
  u.ls = null; u.lsEnd = true; u.saT = W.t; if (L0.ph === 'last'){ u.wind = +(u.wind * sp).toFixed(3); u.rec = +(u.rec * sp).toFixed(3); }
  u.hp = Math.max(1, Math.round(u.max * (G.endHp || 0.05))); u.act = null; stop(u); u.proneT = W.t + 2;
  L(W, { k: 'karGrit', a: u.i, b: u.i, ph: 'over', hp: u.hp, vis: true });
}
function karWorld(W){ for (const u of W.units) if (u.ls && u.alive && !W.units.some(e => e.alive && !e.gone && e.side !== u.side)) karGritOver(W, u); }

if (typeof module !== 'undefined') module.exports = { cmdHold, apSup, apSweep, apAuto, karAim, karFan, karAuto, karTg, karResolve, karRushStep, karHeld, karHeretic, karGritHit, karGritStart, karTick, karGritEnd, karGritOver, karWorld, think, prnRat, ratsOut, vetRoll, rollStep, javAfter, vetCmd, vetOf, prnMemTick, prnMark, prFort, prShield, prLadder, prBind, prSpin, porenTick, porenBrain, ratBrain, porenTake, tauntOf, prnCleave, ratWallHit, bindTick, prnSettle, prnRoll, zapOn, zapTick, gwOn, gwHop, gwStart, gwBrain, gwAway, gwBlind, gslamHit, startAlt, resolveAlt, altAuto, flailDrop, flailOut, woundFatal, evadeP, stepSweep, supSlot, nearLine, isSup, mightReady, mightUse, flailOf, throwFlail, stepFlails, circOv, czStep, czReact, czFront, mbOn, czBrain, czRun, czStart, czTick, czHit, frostOn, dcFire, wardenStep, markIndoor, wpnSpec, stepPools, startQuake, quakeHit, quakeWarn, stepSpins, resolveDrink, addUnit, unitInit, wetAt, stealthOf0, spdNow, spdNow0, walkClear, exitStep, leaveMap, checkEnd, lootOf, wearWhy, bagCapP, eqRuleP, isMB, wpnSpd, invAuto, startSwap, resolveSwap, pullAmmo, bagPick, canHold, bagCapOf, ammoTOf, lootName, ownKey, heldItem, stowOrDrop, wearW, wearBlock, wearHit, breakWeapon, breakShield, gearWK, sizeP, wardStop, stepFlora, grabTry, SPEC_K, specOf, specReady, startFlip, startSpec, specAuto, slamHit, leapCdNext, strike, penRes, gH, gGrad, solid, pileAt, terrainOf, expoOf, bodyH, crouching, terrAim, hiMelee, slopeK, slopeTrip, terrOn, deputyTick, deputyOf, leadOf, cmdWave, netTick, rallyTick, rallyStep, offStep, hmTick, flankOrder, arcVia, scoutKillPick, sacStep, sendPosture, roeOf, engTick, roeBlock, healTier, perilOn, impulseOf, mayWield, ROE_TXT, torchGetStep, stealthFeel, glareReach, flareStep, roamMeet, roamIdle, roamN, patrolStep, alarmTick, glareAt, sideV, watchTick, suppStep, suppAI, suppAct, incoming, launchAt, planShadow, shadowStep, clearSee, nvReach, glowAt, litAt, computeLight, assnSkill, assnVigil, assnCan, assnStep, assnOrder, assnAI, assnFoundTick, scoutStep, scoutReport, torchSet, stealthK, stealthOf, smellGrade, cmdLink, cmdLink1, cmdRange, cmdTick, cmdBoss, posKnownTick, dinAt, hearR, phaseTick, preempt, lretStart, lretTick, lretOf, lretAI, startAct, aimT, faceThreat, relayT, reportTick, picKnown, taskBoard, taskOn, inflTick, inflAt, inflMoves, opCancel, woundRoll, stabilize, injUrgent, actingCmd, cmdBoss, leapTo, leapDir, pounce, leapAside, evadeP, javWay, burnOn, startPalm, isKnife, tire, fatState, fatMul, directSpot, gauntlet, planMoves, mvStep, mvFree, wedgeFix, busyW, planSwitch, cmdSit, cmdCharge, intelTick, pHp, iDanger, iCenter, guessMax, resolveSkill, patrolStart, alarmTick, startScenario, planFocus, weakScore, planWedge, planEncircle, planPlan, withdrawStep, rearm, planPacts, pactStep, gunsOn, gunDanger, hurtOf, screenApproach, chargeValue, twoHanded, parryArcW, parryArc, guardArc, wholeBody, lineFaceOf, lineKeep, lineJoin, bareGuard, armedKind, wardMul, pickWards, planLines, lineCover, lineOpportunity, updateGuard, shieldWall, guardOn, inGuard, downOdds, canTake, takeItem, setWeapon, dropItem, dropOnDeath, scavenge, unarmed, startCharge, stun, marksOf, aimP, tryCharge, applyDmg, preempt, ordFire, undMove, undEta, maimEye, maimArm, crushBone, startBleed, maimRes, callouts, laneSpot, chargeLaneOk, isRangedW, RANGED_KIND, isFar, gapScore, cmdOf, cmdOf0, formMates, planStance, holdForm, avoidGiant, braceOf, chargeValue, bestCharge, chargeCry, fling, pikeStep, turnMul, pinDown, shove, knockDown, cripple, swingPlan, swingArc, heavyHit, startBash, bashWhy, tryDodge, prone, massOf, heightOf, backToWall, blocksFor, planSquads, kbLen, kbValue, peelOf, footwork, tryCharge, startLeap, gearOf, gearW, armorMul, equip, GEAR_SLOTS, rise, startReload, roleOf, ROLE_NAMES, edgeAt, powerOf, tryThrow, mySpear, aimJ, gradeMul, tankAI, exposure, threatPt, launch, stepShots, pickTorch, nearTorch, blindTo, inGuard, supportOf, aware, brief, sideOf, shieldBlock, lineBodies, firstOnLine, guardOn, aimP, openingOf, boldOf, DEFAULT_RULES, CLASS_NAMES, genMap, gridMap, gridCMap, buildMap, autoTorches, groupAnchors, freeNear, createWorld, stepWorld, beginTurn, endTurn, runTurn, runAuto, statsOf, mulberry32, canSee, rock, dropTorch, lieSet, lieHid, lieTick, lieTrample, lieFlash, prone, detourVia, flankLeap, suppAI, suppHid, meshNet, sqBrain, cmdLinkM: cmdLink, ffOdds, suppArc, suppOK, ordFxAdd, evadeMove, kiteMove, slipMove, roeLift, lieFree, applyPosture, POSTURES, bodyReach, sizeOf, sizeOK, SIZE_RANK, lungeChk, stepOK, mvAim, strafeWant, running, ancOf, chiefOf, injRecalc, woundAdd, invOp, resolveInv, bagRoomU, wearWhyU, gearSet, wTwo, bagWpnN, pOfU, lootOf, orderTxt, giveWay, tightAt, startAct, specAuto, fbTick, comboTick, fbPoise, fbShove, fbAim, cbDmg, cbHas, COMBO, FBUF, guardArc, kbLen, aimP, formInit, formTick, formLayout, formStep, formWait, formEng, formRally, formSet, formLeadPick, formPt, formOf, fClass, FORM_SHAPES, h2Cast, resolveH2, h2In, h2Pick, h2Tick, tearDone, tearLet, bigOk, bigWalk, bigSpot, findPath, interrupt, H2K, H2KB, chargeLane, laneOk, laneIn, kiteEng, laneEta, holyOf, authK, marbleHit, crownOn, authOn, flailKeep, giveWay, separate, lineEndVia, evoRole, missSpot, spotFor, reposition, dropShield };   /* v8.7.4 */
