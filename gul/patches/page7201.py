# v7.20.1 페이지 — page7201.py v1.2 (v1.2: 저절로 들어간 탄 줄은 처음 수로 · '화살 9' 처럼 · 무기 종류가 이름과 같으면 한 번만 · v1.1: 반영은 판 뒤에 넣은 전리품 (물건 · 탄) 을 살림 · 전리품 창: 이긴 판이 끝나면 결과 창에 전리품 목록 — 물건마다 '누구 가방에?' 로 명단 가방에 · 화살 · 탄은 쓰는 동료 가방에 저절로 · '이번 판 장비 반영' (내구도 · 탄 · 바꿔 든 무기 · 가방 · 부서진 장비) · 루팅한 갑옷은 그 이름으로 입음)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 판 번호 ----------
rep('<!-- 굴의 전투판 v7.20.0 (2026-10-18)', '<!-- 굴의 전투판 v7.20.1 (2026-10-18)')
rep('     v7.20.0: ', '''     v7.20.1: 전리품 — 이긴 판의 결과 창에 땅의 무기 · 방패 (아군 제 것은 저절로 돌아옴) · 쓰러진 적의 갑옷 · 투구 · 남은 화살 · 탄.
         물건마다 '누구 가방에?' 를 고르면 명단 (배치) 의 그 동료 가방에 들어가 다음 판부터 지님 (칸 · 무기 한도 그대로). 화살 · 탄은 그걸 쓰는 동료 가방에 저절로.
         '이번 판 장비 반영': 살아남은 아군의 닳은 내구도 · 남은 탄 · 바꿔 든 무기 · 가방 · 부서진 무기 · 방패를 명단에 그대로 (4단계 캠페인에서는 저절로).
     v7.20.0: ''')
rep('h1::after{content:" v7.20.0"', 'h1::after{content:" v7.20.1"')
rep('<footer>굴의 전투판 v7.20.0', '<footer>굴의 전투판 v7.20.1')
rep('return `굴의 전투판 v7.20.0 · ${title}', 'return `굴의 전투판 v7.20.1 · ${title}')
rep("copyText('굴의 전투판 v7.20.0 자동 판 기록", "copyText('굴의 전투판 v7.20.1 자동 판 기록")
rep('의 버전 기록에 — v7.20.0 소지품 · 내구도 · 파손 · 루팅 이름', '의 버전 기록에 — v7.20.1 전리품 · 장비 반영 / v7.20.0 소지품 · 내구도 · 파손 · 루팅 이름')
rep('">v7.20.0 · 소지품 · 내구도 · 파손</span>', '">v7.20.1 · 소지품 · 전리품 · 내구도</span>')

# ---------- 탄 이름 ('화살 9' · '일반 탄 20') · 저절로 들어간 탄은 처음 수 ----------
rep("const itName = it => it.k === 'ammo' ? `${it.at} 탄 ${it.n}` : it.label || it.name;", "const itName = it => it.k === 'ammo' ? `${it.at === '화살' ? '화살' : it.at + ' 탄'} ${it.taken && it.n0 != null ? it.n0 : it.n}` : it.label || it.name;   // v7.20.1")
# ---------- 루팅한 갑옷 · 투구는 그 이름으로 ----------
rep("  p.gear[sl] = { name: it.name || it.mat,", "  p.gear[sl] = { name: it.label || it.name || it.mat,")

# ---------- 전리품 · 반영 ----------
rep("function onOver(){", r"""// v7.20.1 전리품: 명단 (배치) 의 동료 가방에 넣기 — 탄은 같은 종류 묶음에 채우고 남으면 새 칸 (남은 수를 돌려줌) · 나머지는 칸 · 무기 한도 (못 넣으면 까닭)
const stackOf = at => ((rules.inv || {}).stack || {})[at] || 20;
function bagPut(p, it){
  p.bag = p.bag || [];
  if (it.k === 'ammo'){ const st = stackOf(it.at), cap = bagCapP(rules, p); let n = it.n;
    for (const x of p.bag) if (x.k === 'ammo' && x.at === it.at && x.n < st && n > 0){ const m = Math.min(n, st - x.n); x.n += m; n -= m; }
    while (n > 0 && p.bag.length < cap){ const m = Math.min(n, st); p.bag.push({ k: 'ammo', at: it.at, n: m }); n -= m; }
    return n; }
  const why = bagRoom(p, it); if (why) return why;
  const { taken, auto, ...o } = it; p.bag.push(o); return 0;
}
const ammoRoom = (p, at) => (p.bag || []).length < bagCapP(rules, p) || (p.bag || []).some(x => x.k === 'ammo' && x.at === at && x.n < stackOf(at));
const lootSub = it => it.k === 'ammo' ? '' : it.k === 'weapon' ? [it.label ? it.name : '', (rules.weapons[it.name] || {}).kind !== it.name ? (rules.weapons[it.name] || {}).kind || '' : '', it.dur < 100 ? '내구 ' + Math.round(it.dur) : ''].filter(Boolean).join(' · ') : it.k === 'shield' ? `방패${it.dur < 100 ? ' · 내구 ' + Math.round(it.dur) : ''}` : `${it.mat} ${it.tier}성${it.size ? ' · ' + it.size : ''}${it.dur < 100 ? ' · 내구 ' + Math.round(it.dur) : ''}`;
function lootHtml(Wd){
  const L = lootOf(Wd); if (!L.length) return '<p class="lnone">주울 만한 전리품이 없어요</p>';
  const allies = S.units.filter(p => p.side === 0);
  return `<div class="lhd">전리품 ${L.filter(x => !x.taken).length}/${L.length} — 고른 동료의 가방 (명단) 으로 · 다음 판부터 지님</div><div class="lls">${L.map((it, i) => `<div class="lt${it.taken ? ' tk' : ''}"><span class="ln">${INV_IC[it.k] || '·'} ${esc(itName(it))}${lootSub(it) ? `<small>${esc(lootSub(it))}</small>` : ''}</span>${it.taken ? `<em>→ ${esc(it.taken)}</em>` : `<select data-loot="${i}" aria-label="${esc(itName(it))} 가져갈 동료"><option value="">누구 가방에?</option>${allies.map(p => { const w = it.k === 'ammo' ? (ammoRoom(p, it.at) ? '' : '가방이 가득') : bagRoom(p, it); return `<option value="${esc(String(p.id))}" ${w ? 'disabled' : ''}>${esc(p.name)}${w ? ' — ' + esc(w) : ' (' + (p.bag || []).length + '/' + bagCapP(rules, p) + ')'}</option>`; }).join('')}</select>`}</div>`).join('')}</div>`;
}
const renderLoot = () => { const el = $('lootBox'); if (el && world) el.innerHTML = lootHtml(world); };
// 화살 · 탄은 그 종류를 쓰는 동료 (든 무기 · 가방의 무기) 가방에 저절로
function lootAuto(Wd){
  if (Wd.lootAuto) return; Wd.lootAuto = true; let ch = false;
  for (const it of lootOf(Wd)){ if (it.k !== 'ammo' || it.taken) continue; it.n0 = it.n;
    for (const p of S.units.filter(q => q.side === 0 && (ammoTOf(Wd, q.weapon) === it.at || (q.bag || []).some(x => x.k === 'weapon' && ammoTOf(Wd, x.name) === it.at)))){ const left = bagPut(p, it); if (left < it.n){ it.auto = (it.auto || []).concat(p.name + ' ' + (it.n - left)); it.n = left; ch = true; } if (!it.n) break; }
    if (!it.n) it.taken = '저절로 · ' + it.auto.join(' · '); }
  if (ch) save();
}
// 이번 판 장비 반영: 살아남은 아군의 든 것 · 내구도 · 탄 · 가방을 명단에 (부서진 무기 · 방패는 사라짐 · 떨어뜨린 제 것은 돌아옴)
function settleWorld(Wd){
  let n = 0;
  for (const u of Wd.units){ if (u.side !== 0 || !u.alive) continue; const p = S.units.find(x => x.id === u.pid); if (!p) continue; n++;
    const nat = ITEM_NATURAL.includes(u.weapon || '');
    if (u.wBroken){ p.weapon = p.natW || '맨손'; delete p.wName; delete p.wDur; delete p.wOwn; delete p.ammo; if (p.natRng != null){ p.ov = p.ov || {}; p.ov.rng = p.natRng; } }
    else if (!u.weaponGone && !nat){ if (u.weapon !== p.weapon){ if (ITEM_NATURAL.includes(p.weapon || '')){ p.natW = p.weapon; if (p.ov && p.ov.rng != null) p.natRng = p.ov.rng; } if (p.ov) delete p.ov.rng; p.weapon = u.weapon; }
      if (u.wName) p.wName = u.wName; else delete p.wName; p.wDur = +(+(u.wDur != null ? u.wDur : 100)).toFixed(1); if (u.wOwn) p.wOwn = u.wOwn; else delete p.wOwn;
      if (u.ammoMax != null) p.ammo = Math.max(0, u.ammo || 0); }
    if (!u.shield && u.sDur <= 0 && p.shield){ p.shield = false; delete p.sName; delete p.sDur; delete p.sOwn; }
    else if (u.shield && !u.armShield){ p.shield = true; p.sDur = +(+u.sDur).toFixed(1); if (u.sName) p.sName = u.sName; }
    for (const sl of GEAR_SLOTS){ const g = (u.gear || {})[sl]; if (g && !g.innate && p.gear && p.gear[sl]) p.gear[sl].dur = +(+g.dur).toFixed(1); }
    const base = JSON.parse(u.bag0 || '[]'), key = x => JSON.stringify(x), pool = base.filter(x => x.k !== 'ammo').map(key), added = [], am = {};   // 판 뒤에 들어온 전리품 (물건 · 탄)
    for (const x of p.bag || []){ if (x.k === 'ammo'){ am[x.at] = (am[x.at] || 0) + (x.n || 0); continue; } const j = pool.indexOf(key(x)); if (j >= 0) pool.splice(j, 1); else added.push(x); }
    for (const x of base) if (x.k === 'ammo') am[x.at] = (am[x.at] || 0) - (x.n || 0);
    p.bag = (u.bag || []).map(({ uid, ...it }) => it);
    for (const x of added) bagPut(p, x); for (const at in am) if (am[at] > 0) bagPut(p, { k: 'ammo', at, n: am[at] });
    for (const it of Wd.items || []) if ((it.k === 'weapon' || it.k === 'shield') && it.own === ownKey(u) && !(it.k === 'weapon' && it.name === p.weapon && !u.wBroken) && !(it.k === 'shield' && p.shield)) bagPut(p, { k: it.k, name: it.name, label: it.label || '', dur: it.dur != null ? it.dur : 100, ...(it.ammo != null ? { ammo: it.ammo } : {}) });   // 땅에 둔 제 것 (바꿔 든 뒤) 은 가방으로
  }
  return n;
}
function onOver(){""")
rep("  b.className = 'banner ' + (r === 'win' ? 'win' : 'lose');", "  if (r === 'win') lootAuto(world);   // v7.20.1 화살 · 탄은 쓰는 동료 가방에 저절로\n  b.className = 'banner ' + (r === 'win' ? 'win' : 'lose');")
rep('는 이 판에서만 — 다음 판은 설계대로</span>', "— 다음 판에도 쓰려면 '이번 판 장비 반영'</span>")
rep('<div class="row"><button class="btn go" type="button" id="againBtn">같은 배치로 다시</button><button class="btn" type="button" id="toEditBtn">배치로</button></div>',
    '''${r === 'win' ? `<div class="loot" id="lootBox">${lootHtml(world)}</div>` : ''}<div class="row"><button class="btn go" type="button" id="againBtn">같은 배치로 다시</button><button class="btn" type="button" id="toEditBtn">배치로</button><button class="btn" type="button" id="settleBtn" title="살아남은 아군의 닳은 내구도 · 남은 탄 · 바꿔 든 무기 · 가방 · 부서진 장비를 명단에 그대로">이번 판 장비 반영</button></div>''')
rep("  $('againBtn').onclick = start; $('toEditBtn').onclick = resetToEdit;", """  $('againBtn').onclick = start; $('toEditBtn').onclick = resetToEdit;
  $('settleBtn').onclick = () => { if (!world || world.settled) return; const n = settleWorld(world); world.settled = true; save(); const bt = $('settleBtn'); bt.disabled = true; bt.textContent = '반영함'; toast(`살아남은 아군 ${n}명의 장비 (내구도 · 탄 · 바꿔 든 무기 · 가방) 를 명단에 반영했어요`); };   // v7.20.1""")
rep("$('stepBtn').addEventListener('click', nextTurn);", """$('banner').addEventListener('change', e => { const s0 = e.target.closest('[data-loot]'); if (!s0 || !world || !e.target.value) return;   // v7.20.1 전리품 → 동료 가방
  const it = lootOf(world)[+s0.dataset.loot], p = S.units.find(x => String(x.id) === e.target.value); if (!it || !p || it.taken) return;
  const r = bagPut(p, it); if (typeof r === 'string'){ toast(`${p.name}: ${r}`); renderLoot(); return; }
  if (it.k === 'ammo' && r > 0){ toast(`${p.name} 가방에 ${it.n - r} — ${r} 남음`); it.n = r; } else { it.taken = p.name; toast(`${itName(it)} → ${p.name}의 가방`); }
  save(); renderLoot(); });
$('stepBtn').addEventListener('click', nextTurn);""")

# ---------- 모양 ----------
rep("/* v7.20 소지품 */", """/* v7.20.1 전리품 (결과 창) */
.banner .loot{margin-top:10px;text-align:left;max-height:min(46vh,360px);overflow:auto;border-top:1px solid #3a3240;padding-top:8px}
.banner .loot .lhd{font:600 12px var(--body);color:#d9a94e;margin-bottom:6px}
.banner .loot .lt{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:6px;padding:5px 0;border-bottom:1px dashed #3a3240}
.banner .loot .lt.tk{opacity:.6}
.banner .loot .ln{font:500 13px var(--body);color:#ece4d6;display:flex;flex-direction:column;min-width:0}
.banner .loot .ln small{font:500 11px var(--mono);color:#a39a8c}
.banner .loot select{min-height:36px;max-width:100%;background:#25202a;color:#ece4d6;border:1px solid #3a3240;border-radius:6px}
.banner .loot em{font-style:normal;font-size:12px;color:#7cc0ff}
.banner .lnone{color:#a39a8c;font-size:12px;margin:8px 0 0}
.banner .row{flex-wrap:wrap}
/* v7.20 소지품 */""")

open(F, 'w', encoding='utf-8').write(s)
print('page7201 OK')
