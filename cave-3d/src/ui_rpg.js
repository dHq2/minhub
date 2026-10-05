/* ui_rpg.js v1.1 — RPG 화면 (v1.1: 원정 중 왼쪽 아래 영웅 칸 · 준비 창에 GOOD WILL)
   · I: 가방 · 장비 창 (왼쪽 원정대 · 가운데 인물과 장비 여섯 칸 · 오른쪽 가방 · 굴에선 보관함) + 상태 탭 (속성 점수 나누기 · 파생 수치 · 무기 기술)
   · 아래: 스킬 줄 (기본 · 무기 스킬 · 구르기 · 막기 · 탄약 · 소모품 칸 4 ~ 7)
   · 원정: 왼쪽 위 층 · 횃불 · 금화 · 정신도, 오른쪽 위 작은 지도 (M = 크게), 가장자리 어둠
   · 확인 창 · 결과 화면 (생환 / 전멸) · 원정 준비 창 · 주운 것 알림 */
'use strict';
const UIR = { open: false, tab: 'eq', hero: 'inju', sel: null };
const $r = id => document.getElementById(id);

/* ---------- 아이콘 ---------- */
function iconCss(d, size){
  const A2 = ITEM_ART.icon, per = A2.cols * A2.cols, si = Math.floor(d.i / per), k = d.i % per, sc = size / A2.cell, [Wd, Ht] = A2.size[si];
  return `background-image:url(${A2.sheets[si]});background-size:${Wd * sc}px ${Ht * sc}px;background-position:-${(k % A2.cols) * size}px -${Math.floor(k / A2.cols) * size}px;`;
}
function iconHtml(it, size = 48, extra = ''){
  const d = itemDef(it), r = d.r || 0;
  return `<div class="ic r${r}${extra}" style="width:${size}px;height:${size}px"><i style="${iconCss(d, size - 6)}width:${size - 6}px;height:${size - 6}px"></i>${it.n > 1 ? `<em>${it.n}</em>` : ''}${it.mag != null && W.def.it === it ? `<u>${it.mag}</u>` : ''}</div>`;
}
// 효과 한 줄
function fxLine(k, v){
  if (v && typeof v === 'object'){
    const pct = v.ch != null ? Math.round(v.ch * 100) + '%' : '';
    const nm = { bleedHit: '출혈', burnHit: '화상', poisonHit: '중독', slowHit: '둔화', shockHit: '감전', thornsBleed: '맞으면 출혈', serum: '혈청', perm: '영구 강화', buff: '강화', regen: '회복' }[k] || FX_FLAG[k] || k;
    if (k === 'perm') return `영구: ${Object.entries(v).map(([a, b]) => `${(FX_N[a === 'def_' ? 'def' : a] || [a])[0]} +${b}`).join(' · ')}`;
    if (k === 'regen') return `${v.dur}초 동안 초당 +${v.v}`;
    return `${nm} ${pct}${v.dps ? ` (초당 ${v.dps}${v.dur ? `, ${v.dur}초` : ''})` : v.pct ? ` (초당 최대 체력의 ${v.pct}%)` : v.dur ? ` (${v.dur}초)` : ''}`;
  }
  if (FX_N[k]){ const [n, u] = FX_N[k]; if (typeof v !== 'number') return n; return `${n} ${u === '-%' ? '-' + Math.abs(v) + '%' : (v > 0 ? '+' : '') + v + u}`; }
  if (FX_FLAG[k]) return typeof v === 'string' ? `${FX_FLAG[k]} (${v === 'skeleton' ? '해골병사' : v === 'witchfairy' ? '꼬마마녀요정' : v === 'blackrabbit' ? '흑토끼기사' : v})` : typeof v === 'number' && v !== 1 ? `${FX_FLAG[k]} ${v}` : FX_FLAG[k];
  return null;
}
const SKIP_FX = new Set(['hp', 'hpP', 'san', 'food', 'wood', 'snail', 'gold', 'ammo', 'key', 'keys', 'torch', 'candle', 'cure', 'revive', 'partyHeal', 'gamble', 'grenade', 'freeze', 'bell', 'whistle', 'potions', 'revealMap', 'revealFoes', 'revealTreasure', 'xp', 'wilUp', 'lore', 'mood', 'box', 'dice', 'escape', 'unlock', 'serum', 'perm', 'buff', 'regen', 'rope', 'dig', 'smash', 'pick', 'identify', 'sealedScroll', 'sell', 'set']);
function tipHtml(it, cmp){
  const d = itemDef(it), r = d.r || 0, S = itemStats(it), q = it.q || 1;
  let h = `<div class="tp-n r${r}">${d.n}</div><div class="tp-t">${RAR[r].n} ${d.wt ? WT_N[d.wt] : CAT_N[d.c] || ''}${d.s && SLOT_N[d.s] && d.s !== 'weapon' ? ' · ' + SLOT_N[d.s] : d.s === 'acc' ? ' · 장신구' : ''}${d.relic ? ' · 유물' : ''}</div>`;
  const main = [];
  if (d.atk){ const c = cmp ? itemStats(cmp).atk : null; main.push(`<b>공격 ${S.atk}</b>${q !== 1 ? ` <small>(품질 ${Math.round(q * 100)}%)</small>` : ''}${c != null ? diff(S.atk - c) : ''}`); }
  if (d.def){ const c = cmp ? itemStats(cmp).def : null; main.push(`<b>방어 ${S.def}</b>${q !== 1 ? ` <small>(품질 ${Math.round(q * 100)}%)</small>` : ''}${c != null ? diff(S.def - c) : ''}`); }
  if (main.length) h += `<div class="tp-m">${main.join('<br>')}</div>`;
  const base = d.fx || {}, lines = [];
  for (const [k, v] of Object.entries(base)){ if (SKIP_FX.has(k) && d.c !== 'weapon' && d.c !== 'armor' && d.c !== 'acc') continue; if (k === 'set'){ lines.push(`<span class="set">세트: ${{ pehto: '페흐토', sage: '현자', wolf: '늑대 기사단' }[v] || v}</span>`); continue; } const t = fxLine(k, v); if (t) lines.push(t); }
  const aff = (it.aff || []).map(([k, v]) => { const t = fxLine(k, AFX[k] && AFX[k].st ? { ch: v / 100, dps: k === 'bleedHit' ? 5 : 0, pct: k === 'burnHit' ? 2 : 0, dur: k === 'slowHit' ? 1.5 : 4 } : v); return t ? `<span class="aff">${t}</span>` : ''; });
  if (lines.length || aff.length) h += `<div class="tp-fx">${lines.map(l => `<div>${l}</div>`).join('')}${aff.map(l => `<div>${l}</div>`).join('')}</div>`;
  if (d.wt) h += `<div class="tp-wk">${WK_D[d.wt] || ''}</div>`;
  if (d.d) h += `<div class="tp-d">${d.d}</div>`;
  if (d.wt && AMMO_OF[d.wt] !== undefined){ const am = d.vr === 'laser' ? 'cell' : d.vr === 'sling' ? null : AMMO_OF[d.wt]; if (am) h += `<div class="tp-am">탄약: ${AMMO_N[am]} (지금 ${RPG.ammo[am] || 0})${WK[d.wt].mag ? ` · 탄창 ${(VR[d.vr] && VR[d.vr].mag) || WK[d.wt].mag}` : ''}</div>`; }
  h += `<div class="tp-g">값 ${d.g || 0} 금화</div>`;
  return h;
}
function diff(v){ if (!v) return ' <small class="eq">=</small>'; return v > 0 ? ` <small class="up">▲${v}</small>` : ` <small class="dn">▼${-v}</small>`; }

/* ---------- 창 열기 · 닫기 ---------- */
function rpgWinToggle(tab){ if (UIR.open && (!tab || tab === UIR.tab)) rpgWinClose(); else rpgWinOpen(tab); }
function rpgWinOpen(tab){
  if (G.lock && !UIR.open) return;
  if (G.mode === 'prologue' || G.mode === 'boot') return;
  UIR.open = true; UIR.tab = tab || UIR.tab; G.paused = true; UIR.sel = null;
  if (!RPG.heroes[UIR.hero] || RPG.heroes[UIR.hero].st === 'dead') UIR.hero = 'inju';
  $r('rpgWin').hidden = false; rpgRender();
}
function rpgWinClose(){ UIR.open = false; G.paused = false; $r('rpgWin').hidden = true; saveRpg(); }
function heroOn(){ return RPG.heroes[UIR.hero] || hero('inju'); }
function rpgRender(){
  const h = heroOn(), S = derive(h), inCave = G.mode === 'cave' || G.mode === 'lobby';
  const party = Object.values(RPG.heroes).filter(o => o.st !== 'dead');
  const u = G.units.find(o => o.hero === h);
  const hpNow = u ? Math.round(u.hp) : h.hp != null ? Math.round(h.hp) : S.maxHp, san = Math.round(h.san ?? S.maxSan);
  // 왼쪽: 원정대
  const left = party.map(o => { const D2 = derive(o), uu = G.units.find(x => x.hero === o), hp = uu ? uu.hp : o.hp ?? D2.maxHp;
    return `<div class="rw-h ${o.id === h.id ? 'on' : ''}" data-h="${o.id}"><img src="${HERO_DEF[o.id].face}" alt=""><div><b>${o.name}</b> <small>Lv ${o.lv}${o.pts ? ` <em>+${o.pts}</em>` : ''}</small><i class="bar hp"><s style="width:${Math.max(0, hp / D2.maxHp * 100)}%"></s></i><i class="bar xp"><s style="width:${o.xp / xpNeed(o.lv) * 100}%"></s></i></div></div>`; }).join('');
  // 가운데: 장비 여섯 칸 + 핵심 수치
  const slot = s => { const it = h.eq[s]; const inn = s === 'weapon' && !it && HERO_DEF[h.id].innate;
    return `<div class="rw-slot s-${s} ${UIR.sel && UIR.sel.from === 'eq' && UIR.sel.slot === s ? 'sel' : ''} ${inn ? 'innate' : ''}" data-slot="${s}" title="${s === 'off' ? '보조: 방패 또는 한손 무기 (X로 바꿔 쥠)' : ''}">${it ? iconHtml(it, 54) : `<span>${inn ? '고유<br>' + inn : SLOT_N[s]}</span>`}</div>`; };
  const core = [['체력', `${hpNow}/${S.maxHp}`], ['공격', S.atk], ['방어', `${S.def} <small>(-${Math.round(S.def / (S.def + 40) * 100)}%)</small>`], ['치명', `${Math.round(S.crit * 100)}% <small>×${S.critMul.toFixed(1)}</small>`], ['회피', Math.round(S.eva * 100) + '%'], ['시야', S.vision.toFixed(1) + '칸'], ['정신도', `${san}/${S.maxSan}`], ['이동', S.spd.toFixed(2)]];
  const mid = `<div class="rw-doll"><div class="rw-fig"><img src="${HERO_DEF[h.id].face}" alt=""><b>${h.name}</b><small>${HERO_DEF[h.id].note}</small>${typeof woundChips === 'function' && (h.wounds || []).length ? `<div class="hc-st wds">${woundChips(h)}</div>` : ''}</div>
    ${slot('head')}${slot('body')}${slot('legs')}${slot('weapon')}${slot('off')}${slot('acc1')}${slot('acc2')}</div>
    <div class="rw-core">${core.map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('')}</div>`;
  // 오른쪽: 가방 (+ 보관함)
  const cap = bagCap();
  let bag = ''; for (let i = 0; i < cap; i++){ const it = RPG.bag[i]; bag += `<div class="rw-cell ${it && UIR.sel && UIR.sel.it === it ? 'sel' : ''}" ${it ? `data-bag="${i}"` : ''}>${it ? iconHtml(it, 50) : ''}</div>`; }
  let stash = '';
  if (inCave){ stash = `<div class="rw-sub">보관함 <small>${RPG.stash.length}</small></div><div class="rw-grid st">${RPG.stash.map((it, i) => `<div class="rw-cell ${UIR.sel && UIR.sel.it === it ? 'sel' : ''}" data-st="${i}">${iconHtml(it, 50)}</div>`).join('') || '<small class="rw-none">비었음 — 원정에서 가져온 장비를 넣어 두는 곳</small>'}</div>`; }
  const ammo = `<div class="rw-ammo">${Object.entries(AMMO_N).map(([k, n]) => `<span>${n} <b>${RPG.ammo[k] || 0}</b></span>`).join('')}<span>금화 <b class="gold">${RPG.gold}</b></span></div>`;
  // 아래: 고른 것 설명 + 버튼
  let tip = '<div class="rw-hint">칸을 누르면 설명 · 두 번 누르면 바로 끼우기 / 쓰기</div>';
  const sel = UIR.sel;
  if (sel && sel.it){
    const d = itemDef(sel.it), cmpSlot = d.s === 'acc' ? (h.eq.acc1 ? 'acc1' : 'acc2') : d.wt === 'shield' ? 'off' : d.s, cmp = sel.from !== 'eq' && SLOTS.includes(cmpSlot) ? h.eq[cmpSlot] : null;
    const btn = [];
    if (sel.from === 'eq') btn.push(['unequip', '벗기']);
    else {
      if (isGear(d)){ btn.push(canEquip(h, sel.it, slotFor(h, sel.it)) ? ['equip', `${h.name}에게 끼우기`] : ['x', whyNot(h, sel.it), 1]);
        if (d.s === 'weapon' && d.wt !== 'shield' && canEquip(h, sel.it, 'off')) btn.push(['equipOff', '보조 칸으로']); }
      if (['potion', 'use', 'food', 'book', 'light'].includes(d.c) || (d.c === 'relic' && d.s === 'use')) btn.push(['use', '쓰기']);
      if (['potion', 'use', 'food'].includes(d.c)) for (let k = 0; k < 4; k++) btn.push(['quick' + k, `칸 ${k + 4}${RPG.quick[k] === sel.it.id ? ' ✓' : ''}`]);
      if (inCave) btn.push(sel.from === 'st' ? ['tobag', '가방으로'] : ['tost', '보관함으로']);
      else btn.push(['drop', '버리기']);
    }
    tip = `<div class="rw-tip">${tipHtml(sel.it, cmp)}</div><div class="rw-btns">${btn.map(([a, n, dis]) => `<button data-a="${a}" ${dis ? 'disabled' : ''}>${n}</button>`).join('')}</div>`;
  }
  // 상태 탭
  const stat = () => {
    const rows = Object.keys(ATTR_N).map(k => `<div class="rw-at"><span>${ATTR_N[k]}</span><b>${h.attr[k]}${S.A[k] !== h.attr[k] ? ` <small>(${S.A[k]})</small>` : ''}</b><small>${ATTR_D[k]}</small>${h.pts ? `<button data-up="${k}">+</button>` : ''}</div>`).join('');
    const der = [['최대 체력', S.maxHp], ['공격', S.atk], ['방어 (피해 감소)', `${S.def} (${Math.round(S.def / (S.def + 40) * 100)}%)`], ['치명 · 배율', `${Math.round(S.crit * 100)}% · ×${S.critMul.toFixed(2)}`], ['회피', Math.round(S.eva * 100) + '%'],
      ['공격 속도', '×' + S.atkSpd.toFixed(2)], ['스킬 대기', '×' + S.cdMul.toFixed(2)], ['재장전', '×' + S.reload.toFixed(2)], ['시야', S.vision.toFixed(1) + '칸'], ['정신도', S.maxSan], ['정신도 감소', '×' + S.sanDrain.toFixed(2)],
      ['이동', S.spd.toFixed(2)], ['흡혈', Math.round(S.lifesteal * 100) + '%'], ['초당 회복', S.regen.toFixed(1)], ['가시', S.thorns], ['푸른 체력', S.shield], ['가방', S.carry + '칸']];
    const wk = h.id === 'inju' ? (() => { const w = S.wt || 'fist'; return `<div class="rw-wk"><b>${h.eq.weapon ? itemDef(h.eq.weapon).n : '맨손'}</b> <small>${WT_N[w] || '맨손'}</small><p>${WK_D[w] || ''}</p></div>`; })() : `<div class="rw-wk"><b>${h.name}의 싸움</b> <small>${h.eq.weapon ? itemDef(h.eq.weapon).n : '고유: ' + (HERO_DEF[h.id].innate || '맨손')}</small><p>${HERO_DEF[h.id].note}<br>들 수 있는 무기: ${(() => { const w2 = heroWts(h); return w2 === 'all' ? '모두' : w2.length ? w2.map(k => WT_N[k]).join(' · ') : '없음 (주먹뿐)'; })()}${h.eq.weapon && RANGED.has(itemDef(h.eq.weapon).wt) ? ' · 탄약이 있으면 거리를 두고 쏨' : ''}</p></div>`;
    return `<div class="rw-stat"><div class="rw-lv">Lv <b>${h.lv}</b> · 경험 ${h.xp}/${xpNeed(h.lv)} ${h.pts ? `· <em>속성 점수 ${h.pts}</em>` : ''}</div>${rows}<div class="rw-der">${der.map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('')}</div>${wk}${typeof titleHtml === 'function' ? titleHtml(h) : ''}</div>`;
  };
  $r('rpgWin').innerHTML = `<div class="rw-box">
    <div class="rw-head"><button class="tab ${UIR.tab === 'eq' ? 'on' : ''}" data-tab="eq">가방 · 장비</button><button class="tab ${UIR.tab === 'st' ? 'on' : ''}" data-tab="st">상태${heroOn().pts ? ' <em>●</em>' : ''}</button><span class="sp"></span>${ammo}${G.mode === 'cave' ? '<button class="x new" data-a="new">처음부터</button>' : ''}<button class="x" data-a="close">닫기 (I)</button></div>
    <div class="rw-main"><div class="rw-party">${left}</div>
      ${UIR.tab === 'eq' ? `<div class="rw-mid">${mid}</div><div class="rw-bag"><div class="rw-sub">가방 <small>${RPG.bag.length}/${cap}</small></div><div class="rw-grid">${bag}</div>${stash}</div>` : `<div class="rw-mid wide">${stat()}</div>`}
    </div>
    ${UIR.tab === 'eq' ? `<div class="rw-foot">${tip}</div>` : ''}
  </div>`;
}
$r('rpgWin') && $r('rpgWin').addEventListener('click', e => {
  e.stopPropagation();
  const t = e.target.closest('[data-tab],[data-h],[data-slot],[data-bag],[data-st],[data-a],[data-up]'); if (!t) return;
  const h = heroOn();
  if (t.dataset.tab){ UIR.tab = t.dataset.tab; UIR.sel = null; }
  else if (t.dataset.h){ UIR.hero = t.dataset.h; UIR.sel = null; }
  else if (t.dataset.up){ if (h.pts > 0){ h.attr[t.dataset.up]++; h.pts--; refreshHero(h); SFX.thump(300, 0.1, 0.08); } }
  else if (t.dataset.slot){ const it = h.eq[t.dataset.slot]; UIR.sel = it ? { it, from: 'eq', slot: t.dataset.slot } : null; }
  else if (t.dataset.bag != null){ const it = RPG.bag[+t.dataset.bag]; if (UIR.sel && UIR.sel.it === it && e.detail >= 2){ quickAct(it, 'bag'); } else UIR.sel = { it, from: 'bag' }; }
  else if (t.dataset.st != null){ const it = RPG.stash[+t.dataset.st]; if (UIR.sel && UIR.sel.it === it && e.detail >= 2){ moveItem(it, RPG.stash, RPG.bag); UIR.sel = null; } else UIR.sel = { it, from: 'st' }; }
  else if (t.dataset.a){ doAct(t.dataset.a); }
  if (UIR.open) rpgRender();
});
function quickAct(it, from){
  const d = itemDef(it), h = heroOn();
  if (isGear(d) && canEquip(h, it, slotFor(h, it))){ equip(h, it, from === 'st' ? RPG.stash : RPG.bag); UIR.sel = null; SFX.clink && SFX.clink(0.4); }
  else if (['potion', 'use', 'food', 'book', 'light'].includes(d.c)){ useFromWin(it); }
}
function useFromWin(it){
  const u = G.units.find(o => o.hero === heroOn() && !o.dead) || G.player;
  if (!u){ popText(0, 0, 0, '', ''); return; }
  if (!useItem(it, u)) uiToast('지금은 쓸 수 없다', 'warn'); UIR.sel = null;
}
function moveItem(it, from, to){
  if (to === RPG.bag && RPG.bag.length >= bagCap() && !(stackOf(itemDef(it)) > 1 && RPG.bag.some(o => o.id === it.id))){ uiToast('가방이 가득', 'warn'); return false; }
  removeItem(it, from); addItem(it, to, to === RPG.bag ? bagCap() : 9999); return true;
}
function doAct(a){
  const h = heroOn(), sel = UIR.sel, it = sel && sel.it;
  if (a === 'close') return rpgWinClose();
  if (a === 'new'){ rpgWinClose(); return uiConfirm('처음부터 할까요?', '굴의 하루 · 가방 · 장비 · 레벨이 모두 지워지고 프롤로그부터 다시 시작합니다.', '지우고 처음부터', newGame); }
  if (!it) return;
  if (a === 'equip'){ equip(h, it, sel.from === 'st' ? RPG.stash : RPG.bag); UIR.sel = null; SFX.clink && SFX.clink(0.4); }
  else if (a === 'equipOff'){ equip(h, it, sel.from === 'st' ? RPG.stash : RPG.bag, 'off'); UIR.sel = null; SFX.clink && SFX.clink(0.4); }
  else if (a === 'unequip'){ const to = (G.mode === 'cave' && RPG.bag.length >= bagCap()) ? RPG.stash : RPG.bag; if (!unequip(h, sel.slot, to)) uiToast('가방이 가득', 'warn'); UIR.sel = null; }
  else if (a === 'use') useFromWin(it);
  else if (a.startsWith('quick')){ const k = +a.slice(5); RPG.quick = RPG.quick.map(q => q === it.id ? null : q); RPG.quick[k] = it.id; }
  else if (a === 'tost'){ moveItem(it, RPG.bag, RPG.stash); UIR.sel = null; }
  else if (a === 'tobag'){ moveItem(it, RPG.stash, RPG.bag); UIR.sel = null; }
  else if (a === 'drop'){ removeItem(it, RPG.bag); if (G.player && typeof dropLootAt === 'function' && EXP) dropLootAt(G.player.x, G.player.z, it, { spread: 0.9 }); UIR.sel = null; }
  saveRpg();
}

/* ---------- 스킬 줄 · 소모품 칸 ---------- */
function uiSkillBar(){
  const el = $r('skillbar'); if (!el) return;
  const show = (G.mode === 'exp' || G.mode === 'floor') && G.player && !document.body.classList.contains('cine');
  el.hidden = !show; if (!show) return;
  const w = W.def, pl = G.player, am = w.cls !== 'melee' ? ammoKind(w) : null;
  const sk = w.skill ? `<div class="sb k2 ${P.skCd > 0 ? 'cd' : ''}"><kbd>우클릭</kbd><b>${w.skillName}</b>${P.skCd > 0 ? `<i style="--p:${(1 - P.skCd / Math.max(0.1, (w.skillCd || 1) * cdMul(pl))) * 360}deg"></i><small>${Math.ceil(P.skCd)}</small>` : ''}</div>` : '';
  const basic = `<div class="sb k1"><kbd>좌클릭</kbd><b>${w.d ? w.d.n : '맨손'}</b><small>${WT_N[w.kind] || '주먹'}${!P.spear ? ' · 던짐 (주워야 함)' : ''}</small></div>`;
  let ammoTxt = '';
  if (am || w.mag){ const tot = am ? RPG.ammo[am] || 0 : '∞'; ammoTxt = `<div class="sb am ${P.reloadT > 0 ? 'rl' : ''}"><kbd>R</kbd><b>${w.mag ? `${w.it ? w.it.mag : 0}/${w.mag}` : ''} <small>${am ? AMMO_N[am] + ' ' + tot : ''}</small></b>${P.reloadT > 0 ? `<i class="rlbar"><s style="width:${(1 - P.reloadT / P.reloadMax) * 100}%"></s></i>` : ''}</div>`; }
  const tk = G.mode === 'exp' && typeof TKS !== 'undefined' ? `<div class="sb ${TKS.cd > 0 ? 'cd' : ''}"><kbd>T</kbd><b>태클</b>${TKS.cd > 0 ? `<small>${Math.ceil(TKS.cd)}</small>` : ''}</div><div class="sb"><kbd>V</kbd><b>잡기</b></div><div class="sb ${G.player && G.player.posture === 'crouch' ? 'on' : ''}"><kbd>G</kbd><b>숙이기</b></div>` : '';
  const dodge = tk + `<div class="sb ${P.dodgeCd > 0 ? 'cd' : ''}"><kbd>Q</kbd><b>구르기</b></div><div class="sb ${pl.guard ? 'on' : ''}"><kbd>F</kbd><b>막기</b></div>`;
  const quick = RPG.quick.map((id, k) => { const it = id && RPG.bag.find(o => o.id === id); return `<div class="sb q ${it ? '' : 'empty'}" data-q="${k}"><kbd>${k + 4}</kbd>${it ? iconHtml(it, 34) : ''}</div>`; }).join('');
  const html = basic + sk + dodge + ammoTxt + `<div class="sb sep"></div>` + quick + `<div class="sb bag" data-q="bag"><kbd>I</kbd><b>가방</b><small>${RPG.bag.length}/${bagCap()}</small></div>`;
  if (el.dataset.h !== html){ el.dataset.h = html; el.innerHTML = html; }
}
$r('skillbar') && $r('skillbar').addEventListener('click', e => { const q = e.target.closest('[data-q]'); if (!q) return; e.stopPropagation(); if (q.dataset.q === 'bag') rpgWinOpen('eq'); else quickUse(+q.dataset.q); });
function quickUse(k){
  const id = RPG.quick[k], pl = G.player; if (!id || !pl || pl.downed || G.lock) return;
  const it = RPG.bag.find(o => o.id === id); if (!it){ RPG.quick[k] = null; return; }
  if (!useItem(it, pl)) popText(pl.x, pl.y + 2.2, pl.z, '지금은 쓸 수 없다', 'miss', 0.8);
}

/* ---------- 알림 · 확인 · 결과 ---------- */
function uiToast(html, cls = ''){
  const box = $r('toasts'); if (!box) return;
  const d = document.createElement('div'); d.className = 'toast ' + cls; d.innerHTML = html; box.prepend(d);
  while (box.children.length > 6) box.lastChild.remove();
  setTimeout(() => d.classList.add('out'), 3600); setTimeout(() => d.remove(), 4200);
}
function uiConfirm(title, text, ok, fn){
  const el = $r('confirm'); G.paused = true;
  el.innerHTML = `<div class="cf-box"><b>${title}</b><p>${text}</p><div><button data-a="ok">${ok} (E)</button><button data-a="no">취소 (Esc)</button></div></div>`;
  el.hidden = false;
  UIR.confirm = (yes) => { el.hidden = true; UIR.confirm = null; G.paused = false; if (yes) fn(); };
}
$r('confirm') && $r('confirm').addEventListener('click', e => { const b = e.target.closest('button'); if (b && UIR.confirm){ e.stopPropagation(); UIR.confirm(b.dataset.a === 'ok'); } });
function uiResult(sum){
  return new Promise(res => {
    const el = $r('result'), wipe = sum.kind === 'wipe';
    const got = {}; for (const id of sum.got) got[id] = (got[id] || 0) + 1;
    const gotHtml = Object.entries(got).map(([id, n]) => { const d = ITEMS[id]; return d ? `<div class="rs-it">${iconHtml({ id, n }, 40)}<span class="r${d.r || 0}">${d.n}</span></div>` : ''; }).join('') || '<small>없음</small>';
    const tc = sum.toCave;
    el.innerHTML = `<div class="rs-box ${wipe ? 'wipe' : ''}"><b>${wipe ? '전멸' : '생환'}</b><small>${wipe ? '어둠이 모두를 삼켰다. …누군가 끌고 올라왔다.' : '살아서 돌아왔다.'}</small>
      <div class="rs-row"><span>가장 깊은 곳</span><b>${sum.deepest}층</b></div><div class="rs-row"><span>쓰러뜨린 적</span><b>${sum.kills}</b></div><div class="rs-row"><span>금화</span><b>${sum.gold >= 0 ? '+' : ''}${sum.gold}</b></div>
      ${wipe ? `<div class="rs-row bad"><span>잃은 가방</span><b>${sum.lost}개 — ${sum.F}층 바닥에 (3일 안에 가면 되찾음)</b></div>` : `<div class="rs-row"><span>굴 창고로</span><b>식량 ${tc.food} · 땔감 ${tc.wood} · 달팽이 먹이 ${tc.snail}</b></div>`}
      <div class="rs-sub">가져온 것</div><div class="rs-got">${gotHtml}</div>
      <div class="rs-sub">원정대</div><div class="rs-party">${sum.party.map(p => `<div><b>${p.name}</b> Lv ${p.lv} · 체력 ${Math.round(p.hp || 0)}/${p.hpMax || '?'} · 정신도 ${p.san}</div>`).join('')}</div>
      <button>굴로 (E)</button></div>`;
    el.hidden = false;
    UIR.result = () => { el.hidden = true; UIR.result = null; res(); };
    el.querySelector('button').onclick = e => { e.stopPropagation(); UIR.result && UIR.result(); };
  });
}

/* ---------- 원정 HUD · 지도 · 어둠 ---------- */
function uiExpHud(force){
  const el = $r('expHud'), on = !!EXP && G.mode === 'exp';
  el.hidden = !on; $r('mmwrap').hidden = !on; if (!on){ $r('vig').style.opacity = 0; $r('bigwrap').hidden = true; return; }
  const h = hero('inju'), S = G.player && G.player.rpg, sMax = S ? S.maxSan : 65, san = Math.round(h.san ?? sMax);
  const tk = EXP.torchT / EXP_TORCH, mm = Math.floor(EXP.torchT / 60), ss = Math.floor(EXP.torchT % 60);
  const html = `<div class="eh-f"><b>${EXP.F}층</b> ${EXP.gen.D.name}</div>
    <div class="eh-r"><span>🔥</span><i class="bar torch ${EXP.lit ? '' : 'out'}"><s style="width:${tk * 100}%"></s></i><small>${EXP.lit ? `${mm}:${String(ss).padStart(2, '0')}` : '꺼짐'} · 횃불 ${EXP.torches}</small></div>
    <div class="eh-r"><span>◐</span><i class="bar san ${san / sMax < 0.3 ? 'low' : ''}"><s style="width:${san / sMax * 100}%"></s></i><small>정신도 ${san}/${sMax}</small></div>
    <div class="eh-r g"><span>●</span><small>금화 ${RPG.gold} · 가방 ${RPG.bag.length}/${bagCap()}${EXP.blessing ? ' · ' + EXP.blessing : ''}${EXP.hungry ? ' · 배고픔 (최대 체력 -15%)' : ''}</small></div>`;
  if (el.dataset.h !== html){ el.dataset.h = html; el.innerHTML = html; }
}
/* ---------- 영웅 칸 (v1.1): 얼굴 · 레벨 · 체력 (+방패) · 정신도 · 상태 · 잡힘/쓰러짐 · GOOD WILL 기술 준비 ---------- */
const HERO_ROLE = { inju: '창 · 지휘', cheong: '손톱 · 날쌤', karius: '방패 · 땅', goodwill: '레슬러 · 번개' };
const GW_SK = [['palm', '손'], ['knee', '무릎'], ['slam', '꽂기'], ['snap1', '번개']];
function uiHeroPanel(){
  const units = G.units.filter(u => u.side === 'ally' && !u.dead && (u.hero || u.captive));
  return '<div class="hp-wrap">' + units.map(u => {
    if (u.captive) return `<div class="hc cap ${u.downed ? 'down' : ''}"><div class="hc-m"><div class="hc-n"><b>${u.D.name}</b><small>포로 · 귀환 줄로</small></div><i class="bar hp"><s style="width:${u.hp / u.max * 100}%"></s></i></div></div>`;
    const h = u.hero, S = u.rpg || derive(h), san = Math.round(h.san ?? S.maxSan), sk = san / S.maxSan, hk = u.hp / u.max;
    const L = u.lock, st = u.downed ? ['쓰러짐', 'down'] : L && L.d === u ? ['잡힘!', 'held'] : L && L.a === u ? [L.phase === 'ground' ? '그라운드' : '클린치', 'grab'] : u.guest ? ['손님', 'guest'] : null;
    const chips = (typeof woundChips === 'function' ? woundChips(h) : '') + Object.entries(u.sts || {}).filter(([k, v]) => v && v.t > 0 && STS_N[k]).map(([k, v]) => `<em style="--c:${STS_N[k][1]}">${STS_N[k][0]} ${Math.ceil(v.t)}</em>`).join('');
    const gw = u.gw ? '<div class="hc-sk">' + GW_SK.map(([k, n]) => `<em class="${u.gw.cd[k] <= 0 ? 'on' : ''}">${n}</em>`).join('') + '</div>' : '';
    const sh = u.shieldMax ? `<u style="width:${Math.min(100, (u.shield || 0) / u.max * 100)}%"></u>` : '';
    return `<div class="hc ${st ? st[1] : ''} ${hk < 0.3 ? 'low' : ''}${u === G.player ? ' me' : ''}">
      <div class="hc-f"><img src="${HERO_DEF[h.id].face}" alt=""><span>${h.lv}</span></div>
      <div class="hc-m"><div class="hc-n"><b>${h.name}</b><small>${HERO_ROLE[h.id] || ''}</small>${st ? `<strong>${st[0]}</strong>` : ''}</div>
        <div class="hc-b"><i class="bar hp"><s style="width:${Math.max(0, hk * 100)}%"></s>${sh}</i><small>${Math.max(0, Math.round(u.hp))}</small></div>
        <div class="hc-b"><i class="bar san ${sk < 0.3 ? 'low' : ''}"><s style="width:${sk * 100}%"></s></i><small>${san}</small></div>
        ${chips || gw ? `<div class="hc-st">${chips}${gw}</div>` : ''}</div></div>`;
  }).join('') + '</div>';
}
// 충돌 로그 (v0.35): 큰 장면에만 화면 아래 한 줄 서술 (반격 · 메치기 · 벽꽝 · 치명상). 4초 뒤 사라짐, 셋까지 쌓임
function clashLog(txt){
  const el = $r('clash'); if (!el) return;
  const d = document.createElement('div'); d.className = 'cl'; d.textContent = txt; el.appendChild(d);
  while (el.children.length > 3) el.firstChild.remove();
  setTimeout(() => d.classList.add('out'), 3600); setTimeout(() => d.remove(), 4300);
}
function uiVignette(a, sk){
  const v = $r('vig'); if (!v) return;
  v.style.opacity = a;
  v.classList.toggle('low', sk < 0.3); v.classList.toggle('zero', sk <= 0.01);
}

/* ---------- 원정 준비 (굴의 석문에서) ---------- */
const PREP = { pick: { cheong: true, karius: true, goodwill: true }, torches: 2 };
const prepMates = () => ['cheong', 'karius'].concat(RPG.meta.gw ? ['goodwill'] : []);
function expPrepOpen(){
  G.paused = true; const el = $r('prep');
  const foodHave = PRO.store.reduce((a, d) => a + (d.raw ? 0 : d.food || 0), 0);
  const render = () => {
    const party = ['inju'].concat(prepMates().filter(k => PREP.pick[k] && hero(k).st === 'ok'));
    const need = party.length, maxT = Math.floor((PRO.wood || 0) / 10);
    PREP.torches = Math.min(PREP.torches, maxT);
    const card = k => { const h = hero(k), S = derive(h), hp = k === 'inju' ? (G.player ? G.player.hp / G.player.max : 1) : k === 'goodwill' ? (h.hp != null && h.hpMax ? h.hp / h.hpMax : 1) : PRO.hpf[k === 'cheong' ? 'ch' : 'ka'];
      return `<div class="pp-h ${k === 'inju' || PREP.pick[k] ? 'on' : ''}" data-k="${k}"><img src="${HERO_DEF[k].face}" alt=""><b>${h.name}</b><small>Lv ${h.lv} · 체력 ${Math.round((hp ?? 1) * 100)}%</small>${typeof woundChips === 'function' && (h.wounds || []).length ? `<div class="hc-st wds">${woundChips(h)}</div>` : ''}${k === 'inju' ? '<em>고정</em>' : `<em>${PREP.pick[k] ? '간다' : '남는다'}</em>`}</div>`; };
    el.innerHTML = `<div class="pp-box"><b>원정 준비</b><small>석문 너머, 끝없는 계단 아래로. 해가 지기 전에 돌아온다.</small>
      <div class="pp-sub">누가 가나</div><div class="pp-party">${['inju'].concat(prepMates()).map(card).join('')}</div>
      <div class="pp-row"><span>식량</span><b>${need}끼 필요 · 창고 ${foodHave}끼</b>${foodHave < need ? '<em class="bad">모자람 → 배고픔 (최대 체력 -15%)</em>' : '<em>각자 한 끼씩 챙김</em>'}</div>
      <div class="pp-row"><span>횃불</span><b><button data-t="-">−</button> ${PREP.torches + 1} <button data-t="+">+</button></b><em>하나는 기본 · 더 들면 땔감 10씩 (땔감 ${PRO.wood || 0}) · 하나에 4분</em></div>
      <div class="pp-row"><span>가방</span><b>${RPG.bag.length}/${bagCap()}</b><em>탄약: 화살 ${RPG.ammo.arrow} · 총알 ${RPG.ammo.bullet} · 산탄 ${RPG.ammo.shell} · I로 장비를 고르고 오기</em></div>
      <div class="pp-btns"><button data-a="go">떠난다</button><button data-a="eq">장비 (I)</button><button data-a="no">아직</button></div></div>`;
  };
  render(); el.hidden = false;
  el.onclick = e => {
    e.stopPropagation(); const k = e.target.closest('[data-k]'), t = e.target.closest('[data-t]'), a = e.target.closest('[data-a]');
    if (k && k.dataset.k !== 'inju') PREP.pick[k.dataset.k] = !PREP.pick[k.dataset.k];
    if (t) PREP.torches = Math.max(0, Math.min(Math.floor((PRO.wood || 0) / 10), PREP.torches + (t.dataset.t === '+' ? 1 : -1)));
    if (a){ if (a.dataset.a === 'no'){ el.hidden = true; G.paused = false; return; } if (a.dataset.a === 'eq'){ el.hidden = true; G.paused = false; rpgWinOpen('eq'); return; }
      if (a.dataset.a === 'go'){
        const party = ['inju'].concat(prepMates().filter(x => PREP.pick[x] && hero(x).st === 'ok'));
        let food = 0; for (let i = 0; i < party.length; i++){ const j = PRO.store.findIndex(d => d.food && !d.raw); if (j < 0) break; const d = PRO.store[j]; if (d.food > 1) PRO.store[j] = { ...d, food: d.food - 1 }; else PRO.store.splice(j, 1); food++; }
        PRO.wood = Math.max(0, (PRO.wood || 0) - PREP.torches * 10);
        el.hidden = true; G.paused = false;
        for (const k2 of party){ const h = hero(k2); if (k2 === 'inju' && G.player){ h.hp = G.player.hp; h.hpMax = G.player.max; } else if (k2 !== 'inju'){ const f = k2 === 'goodwill' ? (h.hp != null && h.hpMax ? Math.max(0.3, h.hp / h.hpMax) : 1) : PRO.hpf[k2 === 'cheong' ? 'ch' : 'ka'] ?? 1; h.hp = null; h.hpRatio = f; } }
        expGoFromCave(party, food);
        return;
      } }
    render();
  };
}
async function expGoFromCave(party, food){
  G.lock = true; letterbox(true);
  await loadScreen('assets/load_moon.jpg', ['석문 너머로 계단이 이어진다.', '횃불이 흔들린다. 청광묵이 침을 삼킨다.', '아래로, 아래로.']);
  letterbox(false); G.lock = false;
  for (const k of party){ const h = hero(k); if (h.hpRatio != null){ h.hp = Math.max(1, Math.round(derive(h).maxHp * h.hpRatio)); h.hpMax = derive(h).maxHp; delete h.hpRatio; } }
  expStart({ party, food, torches: PREP.torches, F: 1 });
}

/* ---------- 키 ---------- */
function uiKeys(){
  if (UIR.confirm){ if (hit('KeyE') || hit('Enter')) UIR.confirm(true); else if (hit('Escape') || hit('KeyQ')) UIR.confirm(false); return true; }
  if (UIR.result){ if (hit('KeyE') || hit('Enter') || hit('Space')) UIR.result(); return true; }
  if (!$r('prep').hidden){ if (hit('Escape')){ $r('prep').hidden = true; G.paused = false; } return true; }
  if (hit('KeyI') || hit('KeyB')){ rpgWinToggle('eq'); return true; }
  if (UIR.open){ if (hit('Escape')) rpgWinClose(); return true; }
  if (G.mode === 'exp' && hit('KeyM')){ const b = $r('bigwrap'); b.hidden = !b.hidden; if (!b.hidden) drawMinimap(true); }
  if (!G.lock && !G.waitInput) for (let k = 0; k < 4; k++) if (hit('Digit' + (k + 4))) quickUse(k);
  return false;
}
