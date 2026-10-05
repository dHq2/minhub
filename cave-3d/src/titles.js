/* titles.js v1.1 — 패시브 · 칭호 (v0.33) (v1.1, v0.58: '구원자' 칭호 삭제 — 구출작전이 없어짐)
   · 패시브: 영웅마다 타고난 것 (설정형 = 이야기, 전투형 = 수치). 늘 켜져 있음
   · 칭호: 원정에서 한 일로 얻음 (끝내기 · 메치기 · 벽꽝 · 구출 · 깃발 · 강적 · 치명상 · 쓰러짐 · 깊이). 얻은 칭호는 모두 수치가 붙음
   · I 창 → 상태 탭 아래에 보임. 얻으면 알림 */
'use strict';
const PASSIVE = {
  inju: [
    { n: '말 없는 자', t: '설정', d: '말 대신 눈으로 본다. 어둠에 덜 흔들림', fx: { sanDrain: -10 } },
    { n: '어부의 손', t: '전투', d: '창 · 작살을 오래 쥔 손. 치명 +3%', fx: { crit: 3 } },
  ],
  cheong: [
    { n: '충직', t: '전투', d: '대장 곁 5칸 안이면 공격 +12%', aura: 'loyal' },
    { n: '달팽이 사랑', t: '설정', d: '굴의 달팽이들을 제 새끼처럼 돌본다', fx: {} },
  ],
  karius: [
    { n: '개조된 신체', t: '전투', d: '모든 피해 60% 감소 (몸이 이미 사람이 아니다)', fx: {} },
    { n: '침묵', t: '설정', d: '아무 말도 없다. 어둠도 그를 흔들지 못함', fx: { sanDrain: -40 } },
  ],
  goodwill: [
    { n: '밝음', t: '전투', d: '곁 6칸 안 원정대의 정신도가 덜 줆 (-25%)', aura: 'bright' },
    { n: '번개 체질', t: '설정', d: '푸른 번개가 몸에 산다. 감전되지 않음', fx: {}, flag: 'shockImmune' },
  ],
};
// 칭호: c = 세는 것, n = 몇 번이면
const TITLES = [
  { id: 'exec',   n: '처형자',       d: '그라운드에서 끝내기로 5번 처치', c: 'finish', need: 5, fx: { crit: 3 } },
  { id: 'wrest',  n: '레슬러',       d: '메치기 10번', c: 'throw', need: 10, fx: { str: 1 } },
  { id: 'wall',   n: '벽꽝',         d: '바디 태클로 벽에 5번 박음', c: 'wall', need: 5, fx: { vit: 1 } },
  { id: 'flag',   n: '깃발 사냥꾼',  d: '적의 깃발을 뽑음', c: 'flag', need: 1, fx: { atkP: 5 } },
  { id: 'giant',  n: '거인 사냥꾼',  d: '강적 5 처치', c: 'elite', need: 5, fx: { atkP: 5 } },
  { id: 'scar',   n: '흉터투성이',   d: '치명상 3번을 받고도 살아 있음', c: 'wound', need: 3, fx: { def: 3, hp: 10 } },
  { id: 'unbent', n: '불굴',         d: '쓰러졌다 일어나기 5번 — 층마다 한 번, 죽을 피해를 1로 버티고 다음 공격은 치명', c: 'down', need: 5, fx: {}, flag: 'unbent' },
  { id: 'abyss',  n: '심연을 본 자', d: '5층에 닿음', c: 'deep', need: 1, fx: { sanity: 10 } },
  { id: 'killer', n: '백인 베기',    d: '100 처치', c: 'kill', need: 100, fx: { atk: 3 } },
];
function heroCount(h, c, n = 1){
  if (!h) return;
  h.cnt = h.cnt || {}; h.cnt[c] = (h.cnt[c] || 0) + n;
  h.titles = h.titles || [];
  for (const T of TITLES) if (T.c === c && !h.titles.includes(T.id) && h.cnt[c] >= T.need){
    h.titles.push(T.id);
    if (typeof uiToast === 'function') uiToast(`<b style="color:#ffd35a">칭호 — ${T.n}</b> <small>${h.name} · ${titleFxTxt(T)}</small>`, 'loot r5');
    const u = G.units.find(o => o.hero === h); if (u){ popText(u.x, u.y + bodyH(u) + 1, u.z, `칭호: ${T.n}`, 'crit', 1.8); applyHero(u, h); }
  }
}
const titleFxTxt = T => Object.entries(T.fx || {}).map(([k, v]) => FX_N[k] ? `${FX_N[k][0]} +${v}${FX_N[k][1] === '%' ? '%' : ''}` : '').filter(Boolean).join(' · ') || (T.flag ? FX_FLAG[T.flag] || T.d : '');
// 장비 효과에 패시브 · 칭호를 더함
const _gearFxT = gearFx;
gearFx = function(h){
  const r = _gearFxT(h), add = (k, v) => { if (k === 'atk') r.atk += v; else if (k === 'def') r.def += v; else r.fx[k] = (typeof r.fx[k] === 'number' ? r.fx[k] : 0) + v; };
  for (const p of PASSIVE[h.id] || []){ for (const [k, v] of Object.entries(p.fx || {})) add(k, v); if (p.flag) r.fx[p.flag] = 1; }
  for (const id of h.titles || []){ const T = TITLES.find(t => t.id === id); if (!T) continue; for (const [k, v] of Object.entries(T.fx)) add(k, v); if (T.flag) r.fx[T.flag] = 1; }
  return r;
};
// 오라 · 불굴 · 감전 면역 · 처치 세기
const _hurtT = hurt;
hurt = function(att, tgt, base, o = {}){
  if (att && att.hero && att.hero.id === 'cheong' && G.player && dist(att, G.player) < 5) base *= 1.12;   // 충직
  // 불굴: 층마다 한 번, 죽을 피해를 1로 버팀
  if (tgt && tgt.fx && tgt.fx.unbent && EXP && !tgt.unbentUsed && tgt.hp - base * 1.2 <= 0 && tgt.hp > 1){
    o = { ...o, keep1: true }; const d = _hurtT(att, tgt, base, o);
    if (tgt.hp <= 1.01){ tgt.unbentUsed = true; popText(tgt.x, tgt.y + bodyH(tgt) + 0.8, tgt.z, '불굴!', 'crit', 1.6); tgt.critNext = true; }
    return d;
  }
  if (att && att.critNext && !o.dot){ att.critNext = false; o = { ...o, crit: true }; }
  return _hurtT(att, tgt, base, o);
};
const _addStatusT = addStatus;
addStatus = function(u, k, v){ if (k === 'shock' && u && u.fx && u.fx.shockImmune) return; return _addStatusT(u, k, v); };
const _killT = kill;
kill = function(u, by){
  const wasDown = u.downed;
  const r = _killT(u, by);
  if (G.mode === 'exp' && u.side === 'enemy' && u.dead && by && by.hero){ heroCount(by.hero, 'kill'); if (u.elite) heroCount(by.hero, 'elite'); if (by.lock && by.lock.phase === 'ground' && by.lock.a === by) heroCount(by.hero, 'finish'); }
  return r;
};
// 일어남 세기 (쓰러졌다 다시 일어남)
function titleTick(){
  for (const u of allies()) if (u.hero){ if (u.wasDown && !u.downed) heroCount(u.hero, 'down'); }
  for (const u of G.units) if (u.hero && u.side === 'ally') u.wasDown = u.downed;
}
// GOOD WILL 밝음: 곁 6칸 원정대 정신도가 덜 줆 → expTick의 정신도 감소 뒤에 조금 돌려줌
function brightTick(dt){
  const gw = G.units.find(u => u.hero && u.hero.id === 'goodwill' && u.side === 'ally' && !u.dead && !u.downed && !u.guest); if (!gw || !EXP) return;
  for (const a of allies()) if (a.hero && dist(a, gw) < 6){ const S = a.rpg || derive(a.hero), drain = (EXP.lit ? 0.1 : 0.45) * (EXP.gen.D.dark ? 1.5 : 1) * (S.sanDrain || 1); a.hero.san = Math.min(S.maxSan, (a.hero.san ?? S.maxSan) + drain * 0.25 * dt); }
}
// I 창 상태 탭에 붙일 HTML
function titleHtml(h){
  const ps = (PASSIVE[h.id] || []).map(p => `<div class="tt-row"><span class="tt-k ${p.t === '전투' ? 'b' : 's'}">${p.t}</span><b>${p.n}</b><small>${p.d}</small></div>`).join('');
  const got = TITLES.filter(T => (h.titles || []).includes(T.id)), next = TITLES.filter(T => !(h.titles || []).includes(T.id));
  const ts = got.map(T => `<div class="tt-row got"><span class="tt-k t">칭호</span><b>${T.n}</b><small>${titleFxTxt(T)} — ${T.d}</small></div>`).join('');
  const ns = next.map(T => `<div class="tt-row off"><span class="tt-k">?</span><b>${T.n}</b><small>${T.d} (${Math.min(T.need, (h.cnt || {})[T.c] || 0)}/${T.need})</small></div>`).join('');
  return `<div class="rw-tt"><div class="rw-sub">패시브</div>${ps}<div class="rw-sub">칭호 <small>${got.length}/${TITLES.length}</small></div>${ts}${ns}</div>`;
}
