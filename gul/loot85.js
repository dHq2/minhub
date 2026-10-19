/* ---------- v8.5.0 전리품 창 다시 — loot85.js v1.0 (v1.0: 물건마다 동료 얼굴 줄 (여덟 명 × 물건 수) 이 난잡했음 → 위에 '받는 사람' 한 줄 · 물건은 종류별 (무기 · 방패 / 갑옷 · 투구 / 화살 · 탄) 한 줄씩 · 줄마다 '→ 받는 사람' 단추 하나 + 알맞은 동료 추천 · ✨ 알맞게 나누기 · 챙긴 것은 아래 한 줄로) ----------
   알맞음: 무기 — 같은 갈래를 쓰는 이 · 맨손인 이 (원거리 무기는 원거리끼리) / 방패 — 방패가 없는 근접 / 갑옷 · 투구 — 그 칸이 비었거나 더 낮은 등급 · 체급이 맞는 이 / 탄 — 그 탄을 쓰는 이. 가방이 빌수록 조금 더. */
let lootTo = null;   // 받는 사람 (pid)
const LOOT_GRP = [['⚔ 무기 · 방패', it => it.k === 'weapon' || it.k === 'shield'], ['🛡 갑옷 · 투구', it => it.k === 'armor' || it.k === 'helm'], ['➶ 화살 · 탄', it => it.k === 'ammo']];
const lootWhy = (p, it) => it.k === 'ammo' ? (ammoRoom(p, it.at) ? '' : '가방이 가득') : bagRoom(p, it);
const lootFar = w => /활|총|저격|소총|권총|마법|석궁/.test(w || '');
function lootFit(it, PL){
  let best = null, bs = -1e9; const WP = rules.weapons || {};
  for (const p of PL){ if (lootWhy(p, it)) continue; let s = -((p.bag || []).length) * 0.3;
    if (it.k === 'weapon'){ const k = (WP[it.name] || {}).kind || it.name, pk = (WP[p.weapon] || {}).kind || p.weapon; if (p.weapon === it.name || pk === k) s += 3; if (!p.weapon || p.weapon === '맨손') s += 2; if (lootFar(it.name) !== lootFar(p.weapon)) s -= 2.5; }
    else if (it.k === 'shield'){ s += p.shield ? -1 : lootFar(p.weapon) ? -2 : 3; }
    else if (it.k === 'armor' || it.k === 'helm'){ const g = (p.gear || {})[it.k === 'armor' ? '몸' : '머리']; s += !g ? 3 : (g.tier || 0) < (it.tier || 0) ? 2 : -1; if (it.size && typeof sizeP === 'function' && sizeP(p) && it.size !== sizeP(p)) s -= 4; }
    else if (it.k === 'ammo'){ if (world && ammoTOf(world, p.weapon) === it.at) s += 4; }
    if (s > bs){ bs = s; best = p; } }
  return best;
}
function lootCards(Wd, PL){
  const L = lootOf(Wd); if (!L.length) return '<p class="lnone">주울 만한 전리품이 없어요</p>';
  if (!PL || !PL.length) return '<p class="lnone">받을 동료가 없어요</p>';
  let to = PL.find(p => String(p.id) === String(lootTo)); if (!to){ to = PL[0]; lootTo = to.id; }
  const left = L.filter(x => !x.taken).length, sid = p => esc(String(p.id));
  const strip = `<div class="l8to"><span class="l8tl">받는 사람</span>${PL.map(p => `<button type="button" class="l8p${p === to ? ' on' : ''}" data-lto="${sid(p)}" title="${esc(p.name)}"><i style="${faceCss(faceOf(p.ref), 30)}"></i><small>${esc(p.name)}</small><em>${(p.bag || []).length}/${bagCapP(rules, p)}</em></button>`).join('')}</div>`;
  const row = (it, i) => { const fit = lootFit(it, PL), w = lootWhy(to, it), sub = [lootSub(it), it.worn ? '망가진 채 벗겨 냄' : ''].filter(Boolean).join(' · ');
    return `<div class="l8r${it.worn ? ' worn' : ''}"><span class="lic">${INV_IC[it.k] || '·'}</span><span class="lnm">${esc(itName(it))}${sub ? `<small>${esc(sub)}</small>` : ''}${it.k !== 'ammo' ? durBar(it.dur) : ''}</span>`
      + (fit && fit !== to ? `<button type="button" class="l8fit" data-lgive="${i}" data-lp="${sid(fit)}" title="${esc(fit.name)}에게 알맞음">★ ${esc(fit.name)}</button>` : '')
      + `<button type="button" class="l8go" data-lgive="${i}" data-lp="${sid(to)}" ${w ? `disabled title="${esc(w)}"` : ''}>${w ? esc(w) : '→ ' + esc(to.name)}</button></div>`; };
  const groups = LOOT_GRP.map(([nm, f]) => { const R = L.map((it, i) => [it, i]).filter(([it]) => !it.taken && f(it)); return R.length ? `<div class="l8g"><div class="l8gh">${nm} <small>${R.length}</small></div>${R.map(([it, i]) => row(it, i)).join('')}</div>` : ''; }).join('');
  const took = L.filter(x => x.taken);
  return `<div class="lhd">전리품 ${left}/${L.length}${left ? ' <button type="button" class="l8auto" data-lauto="1">✨ 알맞게 나누기</button>' : ''}</div>${strip}${groups || '<p class="lnone">모두 챙겼어요</p>'}`
    + (took.length ? `<div class="l8took"><b>챙긴 것</b> ${took.map(x => `${INV_IC[x.k] || '·'} ${esc(itName(x))} → ${esc(x.taken)}`).join(' · ')}</div>` : '');
}
function lootSplit(Wd, PL){
  let n = 0; lootOf(Wd).forEach((it, i) => { if (it.taken) return; const p = lootFit(it, PL); if (!p) return; const was = it.taken; lootGive(Wd, i, p.id); if (it.taken && !was) n++; });
  toast(n ? `✨ ${n}개를 알맞은 동료 가방에` : '나눌 수 있는 것이 없어요 (가방이 가득)');
}
