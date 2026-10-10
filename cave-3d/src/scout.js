/* scout.js v1.1 — (v1.1, v0.86: 죽은 동료는 굴 동료 칸에서 뺌) (v1.0, v0.53) 동료 · 상대 보기
   · U (손가락 화면: 위 줄 👥) = '동료 · 상대' 창: 굴 · 원정 어디서나. 멈춘 채로 봄
     동료: 얼굴 · 체력 · 공격 · 받는 피해 감소 · 속도 · 무게 · 오늘 끼니 · 고유 기술 (카리우스 · 레베카)
     상대: 지금 이 판의 적 (보스 포함) — 체력 · 공격 · 무게 · 속도 · 공격 방식 · 특징 (대리석 피부 · 갑옷 · 방패 · 무거움)
   · 상대 카드: 싸울 때 지금 노리는 적 (마우스가 가리킨 적 · 손가락 화면은 조준 보정이 잡은 적 · 없으면 가까운 적) 이름 · 체력 · 상태를 위 가운데에 작게 */
'use strict';
const SCOUT = { open: false, tgt: null };
const pct = v => Math.round(v * 100) + '%';
function scAtkKinds(D){
  const k = [];
  if (D.melee) k.push(`근접 ${D.melee.range}칸 (예고 ${D.melee.windup}초)`);
  if (D.line) k.push(`찌르기 줄 ${D.line.len}칸 (예고 ${D.line.windup}초)`);
  if (D.bow || D.shot || D.ranged) k.push('원거리');
  if (D.boss) k.push('보스');
  return k.join(' · ') || '—';
}
function scTraits(D){
  const t = [];
  if (D.dr) t.push(`받는 피해 ${pct(D.dr)} 감소`);
  if (D.marble) t.push('대리석 피부 (강공이 아니면 자주 막음)');
  if (D.armor) t.push(`갑옷 (앞에서 ${pct(1 - D.armor)} 막음)`);
  if (D.block) t.push(`방패 (앞에서 ${pct(1 - D.block)} 막음)`);
  if (D.heavy) t.push('밀리지 않음');
  if (D.undying) t.push('불사 (재생)');
  if (D.resist) t.push(`상태 이상 ${pct(D.resist)} 줄임`);
  return t;
}
function scFace(u){
  const H = { cheong: 'art/pro/goblin_face.webp', karius: 'art/pro/karius_face.webp', rebecca: 'art/pro/rebecca_face.webp', player: 'assets/inju_face.png', goodwill: 'assets/goodwill_face.png' };
  const k = u.kind === 'player' ? 'player' : (u.D.spr || '').replace(/Ally|Npc/, '');
  if (H[k]) return H[k];
  const p = SPR[u.D.spr] && SPR[u.D.spr].poses && SPR[u.D.spr].poses.idle;
  return p && !(p.n > 1 || p.cols > 1) ? p.src : '';
}
function scRow(u, o = {}){
  const D = u.D, hp = o.hp ?? u.hp, max = o.max ?? u.max, atk = o.atk ?? u.atk ?? D.atk, f = scFace(u);
  const p2 = u.p2 ? ' <em class="sc-tag">불경자</em>' : '', ls = u.ls ? ' <em class="sc-tag">근성</em>' : '', dn = u.downed ? ' <em class="sc-tag bad">쓰러짐</em>' : '';
  const tr = scTraits(o.D || D), sk = o.hero && typeof heroSkillsHtml === 'function' ? heroSkillsHtml({ id: o.hero }) : '';
  return `<div class="sc-u">${f ? `<img src="${artSrc(f)}" alt="">` : '<i></i>'}<div class="sc-b">
    <b>${o.name || D.name}${p2}${ls}${dn}</b>
    <div class="sc-hp"><span style="width:${Math.max(0, Math.min(100, hp / max * 100))}%"></span><small>${Math.max(0, Math.round(hp))} / ${max}</small></div>
    <div class="sc-st">공격 <b>${Math.round(atk)}</b> · 속도 <b>${(o.spd ?? u.spd ?? D.spd ?? 0).toFixed ? (o.spd ?? u.spd ?? D.spd ?? 0).toFixed(1) : '-'}</b> · 무게 <b>${D.weight || 60}kg</b>${o.extra ? ' · ' + o.extra : ''}</div>
    ${o.foe ? `<div class="sc-st">공격 방식: ${scAtkKinds(D)}</div>` : ''}
    ${tr.length ? `<div class="sc-tr">${tr.map(t => `<span>${t}</span>`).join('')}</div>` : ''}
    ${sk ? `<details><summary>기술 보기</summary>${sk}</details>` : ''}</div></div>`;
}
function scMates(){
  const out = [], pl = G.player;
  if (pl) out.push(scRow(pl, { name: '인주', extra: G.mode === 'cave' && PRO.meal ? (PRO.meal.inju.fed ? '오늘 먹음' : '배고픔') : '' }));
  const cave = G.mode === 'cave' && typeof PRO !== 'undefined' && PRO.cave;
  if (cave){   // 굴: 싸우지 않을 땐 굴 주민 모습이라, 전투 수치 (동료 기준) + 남은 체력 비율로
    const C = PRO.cave, meal = k => PRO.meal[k] ? (PRO.meal[k].fed ? '오늘 먹음' : '배고픔') : '';
    const L = [[C.ch, 'cheongAlly', 'ch', null], [C.ka, 'kariusAlly', 'ka', 'karius'], [C.reb, 'rebeccaAlly', 'reb', 'rebecca']];
    for (const [u, dk, k, hero] of L){
      if (!u || u.gone) continue; const D = DEFS[dk]; if (!D) continue;   // v0.86 죽은 동료는 뺌
      const fight = u.side === 'ally';
      out.push(scRow(fight ? u : { ...u, D, p2: false, ls: null, downed: false }, { D, hero, name: D.name, hp: fight ? u.hp : D.hp * (PRO.hpf[k] ?? 1), max: D.hp, atk: fight ? u.atk : D.atk, spd: D.spd, extra: meal(k) }));
    }
  } else for (const u of G.units) if (u.side === 'ally' && u !== pl && !u.dead && !u.D.summon) out.push(scRow(u, { hero: HERO_SK && HERO_SK[(u.D.spr || '')] ? u.D.spr : null }));
  return out.join('');
}
function scFoes(){
  const L = foes().filter(e => !e.D.dummy).sort((a, b) => (b.D.boss ? 1 : 0) - (a.D.boss ? 1 : 0) || dist(a, G.player || a) - dist(b, G.player || b));
  if (!L.length) return '<p class="sc-none">지금은 상대가 없어요</p>';
  // 같은 종류는 한 줄로 (몇 마리인지)
  const seen = new Map(); for (const e of L){ const k = e.kind || e.D.name; if (!seen.has(k)) seen.set(k, { e, n: 0 }); seen.get(k).n++; }
  return [...seen.values()].map(({ e, n }) => scRow(e, { foe: true, name: e.D.name + (n > 1 ? ` ×${n}` : '') })).join('');
}
function scoutRender(){
  let el = document.getElementById('scout');
  if (!el){ el = document.createElement('div'); el.id = 'scout'; el.innerHTML = '<div class="sc-box"><div class="sc-head"><b>동료 · 상대</b><button data-x>닫기 ✕</button></div><div class="sc-cols"><section><h4>동료</h4><div class="sc-m"></div></section><section><h4>상대</h4><div class="sc-f"></div></section></div></div>'; document.body.appendChild(el);
    el.addEventListener('click', e => { if (e.target === el || e.target.closest('[data-x]')) scoutToggle(false); });
    el.addEventListener('touchstart', e => e.stopPropagation(), { passive: true }); }
  el.querySelector('.sc-m').innerHTML = scMates(); el.querySelector('.sc-f').innerHTML = scFoes();
  el.hidden = !SCOUT.open;
}
function scoutToggle(on = !SCOUT.open){
  if (on && (G.lock || G.waitInput || !PLAY_MODES.has(G.mode))) return;
  SCOUT.open = on; G.paused = on; scoutRender();
}
// 상대 카드
function scoutTarget(){
  const pl = G.player; if (!pl || !PLAY_MODES.has(G.mode)) return null;
  const t = (mouse.over && !mouse.over.dead && mouse.over) || (SCOUT.tgt && !SCOUT.tgt.dead && dist(SCOUT.tgt, pl) < 12 && SCOUT.tgt) || nearest(pl, foes().filter(e => e.alert && !e.D.dummy), 8);
  return t || null;
}
setInterval(() => {
  if (typeof G === 'undefined' || !G.units) return;
  if (SCOUT.open && !G.paused){ SCOUT.open = false; const w = document.getElementById('scout'); if (w) w.hidden = true; }
  else if (SCOUT.open){ const w = document.getElementById('scout'); if (w) w.querySelector('.sc-f').innerHTML = scFoes(); }
  let c = document.getElementById('scard');
  if (!c){ c = document.createElement('div'); c.id = 'scard'; c.hidden = true; document.body.appendChild(c); }
  const t = !SCOUT.open && !G.lock && !G.waitInput ? scoutTarget() : null;
  if (!t || t === G.boss){ c.hidden = true; return; }   // 보스는 위의 보스 체력 줄이 있음
  const st = t.lying || (t.tripT && t.tripT > G.t) ? '넘어짐' : t.st === 'hurt' ? '경직' : t.decal ? '공격 준비!' : t.halfDead ? '반시체' : '';
  const html = `<b>${t.D.name}</b>${st ? `<em>${st}</em>` : ''}<div class="sc-hp"><span style="width:${Math.max(0, t.hp / t.max * 100)}%"></span><small>${Math.max(0, Math.round(t.hp))} / ${t.max}</small></div><small>공격 ${Math.round(t.atk ?? t.D.atk)} · 무게 ${t.D.weight || 60}kg${t.D.boss ? ' · 보스' : ''}</small>`;
  if (c.innerHTML !== html) c.innerHTML = html; c.hidden = false;
}, 120);
// 때린 상대를 잠깐 기억 (카드가 그놈을 계속 보여 줌)
{ const _hurtS = hurt; hurt = function(att, tgt, base, o = {}){ const r = _hurtS(att, tgt, base, o); if (att && att === G.player && tgt && tgt.side === 'enemy') SCOUT.tgt = tgt; return r; }; }
// 키 U (터치 👥는 KeyU를 누름): 매 프레임 키 처리 (uiKeys) 맨 앞에서. 창이 열려 있으면 U · Esc로 닫음
const _uiKeysS = uiKeys;
uiKeys = function(){
  if (SCOUT.open){ if (hit('KeyU') || hit('Escape')) scoutToggle(false); return true; }
  if (hit('KeyU') && !(typeof UIR !== 'undefined' && UIR.open)){ scoutToggle(true); if (SCOUT.open) return true; }
  return _uiKeysS();
};
