/* 전리품 · 장비: 판이 끝나면 엔진 lootOf(W) 가 전리품(무기 · 방패 · 갑옷 · 투구 · 탄)을 센다. 이 모듈은 그것을 런의 창고(stash)로 옮기고,
 * 막사에서 동료 설계에 입히고 벗긴다. 입을 수 있는지는 원본 wearWhy (체급 · 방패 · 두 손 무기 규칙) 가 정한다.
 * putOn / takeOff 는 원본 화면의 같은 이름 함수를 옮긴 것. */
GB.Loot = (function () {
  const rulesOf = () => GB.makeRules();
  const NATURAL = ['맨손', '이빨·발톱', '갈퀴 꼬리'];
  let seq = 1;
  const newId = () => 'L' + Date.now().toString(36) + (seq++);

  // 판 끝: 남은 전리품을 창고 항목으로
  function collect(W) {
    const out = [];
    for (const it of E.lootOf(W)) {
      if (it.taken || it.k === 'ammo') continue;
      const o = GB.clone(it); delete o.lk; delete o.ground; delete o.fall; delete o.auto; delete o.n0; delete o.art;
      o.id = newId();
      if (o.k === 'armor' || o.k === 'helm') o.dur = Math.max(o.dur != null ? o.dur : 100, 40);   // 막사 정비
      out.push(o);
    }
    return out;
  }
  const wearWhy = (p, it) => E.wearWhy(rulesOf(), p, it);

  function takeOff(p, slot) {
    if (slot === 'weapon') {
      if (!p.weapon || NATURAL.indexOf(p.weapon) >= 0) return null;
      const it = { id: newId(), k: 'weapon', name: p.weapon, label: p.wName || '', dur: p.wDur != null ? p.wDur : 100, own: p.wOwn || null };
      p.weapon = p.natW || '맨손'; delete p.wName; delete p.wDur; delete p.wOwn; delete p.ammo;
      return it;
    }
    if (slot === 'shield') {
      if (!p.shield) return null;
      const it = { id: newId(), k: 'shield', name: '방패', label: p.sName || '', dur: p.sDur != null ? p.sDur : 100, own: p.sOwn || null };
      p.shield = false; delete p.sName; delete p.sDur; delete p.sOwn;
      return it;
    }
    const g = (p.gear || {})[slot]; if (!g) return null;
    const it = { id: newId(), k: slot === '몸' ? 'armor' : 'helm', name: g.name, label: g.name, mat: g.mat, tier: g.tier, dur: g.dur, size: g.size, own: g.own || null };
    delete p.gear[slot];
    return it;
  }
  // 입힘. 이전 장비를 돌려줌(창고로)
  function putOn(p, it) {
    const R = rulesOf();
    if (it.k === 'weapon') {
      let old = null;
      if (p.weapon && NATURAL.indexOf(p.weapon) < 0) old = takeOff(p, 'weapon'); else p.natW = p.weapon || '맨손';
      p.weapon = it.name; if (it.label) p.wName = it.label; else delete p.wName; p.wDur = it.dur != null ? it.dur : 100; if (it.own) p.wOwn = it.own; else delete p.wOwn;
      const w = R.weapons[it.name] || {};
      if (w.kind === '활' || w.kind === '총포류') { if (it.ammo != null) p.ammo = it.ammo; else delete p.ammo; } else delete p.ammo;
      delete p.ammoMax; if (p.ov) delete p.ov.rng;
      return old;
    }
    if (it.k === 'shield') { p.shield = true; if (it.label) p.sName = it.label; p.sDur = it.dur != null ? it.dur : 100; if (it.own) p.sOwn = it.own; return null; }
    const sl = it.k === 'armor' ? '몸' : '머리', old = (p.gear || {})[sl] ? takeOff(p, sl) : null;
    p.gear = p.gear || {};
    p.gear[sl] = { name: it.label || it.name || it.mat, mat: it.mat, tier: it.tier || 2, dur: it.dur != null ? it.dur : 100, ...(it.size ? { size: it.size } : {}), ...(it.own ? { own: it.own } : {}) };
    return old;
  }
  // 알맞음 점수: 높을수록 그 동료에게 어울림 (원본 loot85 lootFit 의 규칙)
  function fit(p, it) {
    if (wearWhy(p, it)) return -99;
    const W0 = E.DEFAULT_RULES.weapons, far = w => { const k = (W0[w] || {}).kind; return k === '활' || k === '총포류' || k === '마법'; };
    let s = 0;
    if (it.k === 'weapon') {
      const k = (W0[it.name] || {}).kind, pk = (W0[p.weapon] || {}).kind;
      if (k && k === pk) s += 3; if (!p.weapon || p.weapon === '맨손') s += 2; if (far(it.name) !== far(p.weapon)) s -= 2.5;
    } else if (it.k === 'shield') s += p.shield ? -1 : far(p.weapon) ? -2 : 3;
    else { const g = (p.gear || {})[it.k === 'armor' ? '몸' : '머리']; s += !g ? 3 : (g.tier || 0) < (it.tier || 0) ? 2 : -1; }
    return s;
  }
  function bestFor(roster, it) {
    let best = null, bs = -50;
    for (const p of roster) { const s = fit(p, it); if (s > bs) { bs = s; best = p; } }
    return best;
  }
  const label = it => (it.label || it.name || it.mat || '') + (it.k === 'armor' || it.k === 'helm' ? ' ' + (it.tier || 1) + '성' : '') + (it.dur != null && it.dur < 100 ? ' (낡음 ' + Math.round(it.dur) + '%)' : '');
  return { collect: collect, wearWhy: wearWhy, takeOff: takeOff, putOn: putOn, fit: fit, bestFor: bestFor, label: label };
})();
