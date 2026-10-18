# v7.25.2 페이지 — page7252.py v1.4 (v1.4: 행동 글 — 대상이 막 사라진 겨눔도 멈추지 않게 · v1.3: v1.3: 장비 탭의 '소지품' 제목을 작게 · 성장 칩 '근력 C 새로 얻음' (없음 → C 대신) · v1.2: v1.2: 피 막대는 em (얼굴 i 와 섞이지 않게) · v1.1: 동료 카드에 예전 cr 이름도 (시험 · 모양 그대로) · 정산 화면 다시: 탭 셋 — 정산 (✦ 성장을 크게 · 동료 카드 · 피 막대) · 전리품 (카드 · 동료 얼굴을 누르면 그 가방으로) · 장비 · 가방 (끼우기 · 벗기 · 넘겨주기 — 맵을 넘어가기 전에) /
#   맵 중간 전리품 창 · 훈련장 결과 창도 같은 카드 / 화살 · 탄은 쓰는 동료에게 저절로 (넘어가는 이만) / 망가진 방어구 표시 / 수치표 이전 7.25.2 (전리품 칸))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7251.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.25.1 (2026-10-18)', '<!-- 굴의 전투판 v7.25.2 (2026-10-18)')
rep('     v7.25.1: ', '''     v7.25.2: 장비 · 전리품 — 원인: 끼우기 (착용) 창이 훈련장 배치 칸에만 있어 캠페인 (맵에 들어서면 바로 싸움) 에선 열 수 없었음. 이제 맵을 넘어갈 때 정산 화면에서
         전리품을 받고 (동료 얼굴을 누르면 그 가방으로) 장비 · 가방 탭에서 바로 끼우기 · 벗기 · 넘겨주기. 정산 탭은 ✦ 성장을 크게. 무구 (무기 · 방패) 는 모두 나옴 (가방의 무기 · 두 번째 총도) ·
         방어구는 낮은 확률 (갑옷 25% · 투구 30%) 에 나와도 대개 망가져 있음 (내구 15 ~ 60).
     v7.25.1: ''')
rep('h1::after{content:" v7.25.1"', 'h1::after{content:" v7.25.2"')
rep('<footer>굴의 전투판 v7.25.1', '<footer>굴의 전투판 v7.25.2')
rep('return `굴의 전투판 v7.25.1 · ${title}', 'return `굴의 전투판 v7.25.2 · ${title}')
rep("copyText('굴의 전투판 v7.25.1 자동 판 기록", "copyText('굴의 전투판 v7.25.2 자동 판 기록")
rep('의 버전 기록에 — v7.25.1 간두 두 번째 총 · 기동 사수', '의 버전 기록에 — v7.25.2 정산 화면 · 전리품 · 장비 / v7.25.1 간두 두 번째 총 · 기동 사수')
rep('">v7.25.1 · 간두 샷건 · 기동 사수</span>', '">v7.25.2 · 정산 · 전리품 · 장비</span>')
rep("ver: '7.25.1', at:", "ver: '7.25.2', at:")
rep("RULES_MIG = '7.25.1'", "RULES_MIG = '7.25.2'")

# CSS
rep("/* v7.20 소지품 */\n", """/* v7.25.2 정산 · 전리품 카드 */
.banner .ctabs{margin:8px 0 2px;display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
.banner .ctabs button{min-height:36px;padding:6px 14px;border-radius:999px;border:1px solid #4a3f52;background:#221d27;color:#cfc4b4;font:700 13px var(--body);cursor:pointer}
.banner .ctabs button.on{background:#d9a94e;border-color:#d9a94e;color:#1b1610}
.banner .cbody{margin-top:8px;text-align:left;max-height:min(56vh,460px);overflow:auto;padding-right:2px}
.banner .cgrow{display:flex;flex-direction:column;gap:6px;margin-bottom:10px}
.banner .cgrow .gr{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;background:linear-gradient(90deg,rgba(217,169,78,.22),rgba(217,169,78,.04));border:1px solid rgba(217,169,78,.55)}
.banner .cgrow .gr i{flex:0 0 46px;width:46px;height:46px;border-radius:8px;border:1px solid #d9a94e}
.banner .cgrow .gr b{font:800 14px var(--body);color:#f3dfae}
.banner .gchip{display:inline-block;margin:3px 4px 0 0;padding:3px 10px;border-radius:999px;background:#d9a94e;color:#1b1610;font:800 12.5px var(--body);box-shadow:0 0 12px rgba(217,169,78,.55);animation:gpulse 1.6s ease-in-out infinite}
@keyframes gpulse{0%,100%{box-shadow:0 0 6px rgba(217,169,78,.35)}50%{box-shadow:0 0 16px rgba(217,169,78,.8)}}
.banner .cgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px}
.banner .cc{display:flex;gap:8px;align-items:center;padding:6px 8px;border-radius:9px;background:#221d27;border:1px solid #3a3240}
.banner .cc.dead{filter:grayscale(1);opacity:.6} .banner .cgrid .cr{border-bottom:1px solid #3a3240;padding:6px 8px}
.banner .cc i{flex:0 0 42px;width:42px;height:42px;border-radius:7px;border:1px solid #4a3f52}
.banner .cc b{display:block;font:700 13px var(--body);color:#ece4d6}
.banner .cc small{display:block;font:500 10.5px/1.45 var(--mono);color:#a39a8c}
.banner .hpb{display:block;height:5px;border-radius:3px;background:#3a3240;margin:3px 0;overflow:hidden} .banner .hpb em{display:block;height:100%;width:var(--h);background:#7bd389;border-radius:3px}
.banner .lgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px}
.banner .lcard{display:flex;flex-direction:column;gap:6px;padding:8px;border-radius:10px;background:#221d27;border:1px solid #3a3240}
.banner .lcard.tk{opacity:.55} .banner .lcard.worn{border-color:#6b4a3a}
.banner .lci{display:flex;align-items:center;gap:8px;position:relative}
.banner .lic{flex:0 0 34px;height:34px;display:grid;place-items:center;font-size:20px;border-radius:8px;background:#2d2633;border:1px solid #4a3f52}
.banner .lnm{display:flex;flex-direction:column;min-width:0;font:700 13px var(--body);color:#ece4d6} .banner .lnm small{font:500 10.5px var(--mono);color:#a39a8c}
.banner .lcard .dur{position:absolute;left:42px;right:0;bottom:-4px;height:3px;border-radius:2px;background:linear-gradient(90deg,#7bd389 var(--d),#3a3240 var(--d))} .banner .lcard .dur.lo{background:linear-gradient(90deg,#e0884d var(--d),#3a3240 var(--d))}
.banner .lto{display:flex;flex-wrap:wrap;gap:4px}
.banner .lp{display:flex;flex-direction:column;align-items:center;gap:1px;min-width:46px;min-height:44px;padding:3px;border-radius:8px;border:1px solid #4a3f52;background:#2d2633;color:#ece4d6;cursor:pointer}
.banner .lp i{width:28px;height:28px;border-radius:6px} .banner .lp small{font:600 10px var(--body);max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.banner .lp:hover:not([disabled]){border-color:#d9a94e} .banner .lp[disabled]{opacity:.35;cursor:default}
.banner .lcard em{font-style:normal;font-size:12px;color:#7cc0ff}
.banner .ceq{margin-bottom:10px} .banner .ceqh{display:flex;align-items:center;gap:8px;font:700 13px var(--body);color:#ece4d6} .banner .ceqh i{width:30px;height:30px;border-radius:6px} .banner .ceqh small{font:500 11px var(--mono);color:#a39a8c}
.banner .inv{--line:#3a3240;--well:#221d27;--dim:#a39a8c;--accent:#d9a94e;color:#ece4d6}
/* v7.20 소지품 */
""")

# 소지품 창: 정산 화면에선 '가방에 넣기' (만들기) 를 숨기고 넘겨줄 이는 넘어가는 동료만
rep("function invHtml(p){\n  const bag = p.bag || [],", "function invHtml(p, opt){   /* v7.25.2 opt: { story: 가방에 넣기 숨김, mates: 넘겨줄 수 있는 이 } */\n  const bag = p.bag || [],")
rep("const it = bag[pk.i], why = wearWhy(rules, p, it), mates = S.units.filter(q => q !== p && q.side === p.side);", "const it = bag[pk.i], why = wearWhy(rules, p, it), mates = ((opt && opt.mates) || S.units).filter(q => q !== p && q.side === p.side);")
rep("${act}<div class=\"ivr\"><select data-iadd=\"1\"", "${act}${opt && opt.story ? '' : `<div class=\"ivr\"><select data-iadd=\"1\"")
rep("${INV_ADD().map(([v, t]) => `<option value=\"${esc(v)}\">${esc(t)}</option>`).join('')}</select></div></div>`;", "${INV_ADD().map(([v, t]) => `<option value=\"${esc(v)}\">${esc(t)}</option>`).join('')}</select></div>`}</div>`;")

# 화살 · 탄 저절로 (넘어가는 이만)
rep("function lootAuto(Wd){\n  if (Wd.lootAuto) return; Wd.lootAuto = true; let ch = false;", "function lootAuto(Wd, PL){   /* v7.25.2 PL: 받을 수 있는 이 (정산 = 넘어가는 동료) */\n  if (Wd.lootAuto) return; Wd.lootAuto = true; let ch = false;")
rep("    for (const p of S.units.filter(q => q.side === 0 && (ammoTOf(Wd, q.weapon) === it.at", "    for (const p of (PL || S.units).filter(q => q.side === 0 && (ammoTOf(Wd, q.weapon) === it.at")

# 전리품 카드 · 정산 화면
rep("const renderLoot = () => { const el = $('lootBox'); if (el && world) el.innerHTML = lootHtml(world); };", r"""const renderLoot = () => { const el = $('lootBox'); if (el && world) el.innerHTML = lootCards(world, lootParty()); };
// v7.25.2 전리품 카드: 물건마다 동료 얼굴 단추 — 누르면 그 가방으로 (가득 · 무기 칸 한도면 흐림)
let lootPL = null;   // 지금 전리품을 받을 수 있는 동료 (정산 = 넘어가는 이 · 그 밖엔 살아 있는 아군)
const lootParty = () => lootPL || S.units.filter(p => p.side === 0 && (!world || world.units.some(u => u.pid === p.id && u.alive)));
function lootCards(Wd, PL){
  const L = lootOf(Wd); if (!L.length) return '<p class="lnone">주울 만한 전리품이 없어요</p>';
  return `<div class="lhd">전리품 ${L.filter(x => !x.taken).length}/${L.length} — 동료 얼굴을 누르면 그 가방으로</div><div class="lgrid">${L.map((it, i) => `<div class="lcard${it.taken ? ' tk' : ''}${it.worn ? ' worn' : ''}"><div class="lci"><span class="lic">${INV_IC[it.k] || '·'}</span><span class="lnm">${esc(itName(it))}${lootSub(it) || it.worn ? `<small>${esc([lootSub(it), it.worn ? '망가진 채 벗겨 냄' : ''].filter(Boolean).join(' · '))}</small>` : ''}</span>${it.k !== 'ammo' ? durBar(it.dur) : ''}</div>`
    + (it.taken ? `<em>→ ${esc(it.taken)}</em>` : `<div class="lto">${PL.map(p => { const w = it.k === 'ammo' ? (ammoRoom(p, it.at) ? '' : '가방이 가득') : bagRoom(p, it); return `<button type="button" class="lp" data-lgive="${i}" data-lp="${esc(String(p.id))}" ${w ? 'disabled' : ''} title="${esc(p.name)}${w ? ' — ' + esc(w) : ' (' + (p.bag || []).length + '/' + bagCapP(rules, p) + ')'}"><i style="${faceCss(faceOf(p.ref), 28)}"></i><small>${esc(p.name)}</small></button>`; }).join('')}</div>`) + '</div>').join('')}</div>`;
}
function lootGive(Wd, i, pid){
  const it = lootOf(Wd)[i], p = S.units.find(x => String(x.id) === String(pid)); if (!it || !p || it.taken) return;
  const r = bagPut(p, it); if (typeof r === 'string'){ toast(`${p.name}: ${r}`); return; }
  if (it.k === 'ammo' && r > 0){ toast(`${p.name} 가방에 ${it.n - r} — ${r} 남음`); it.n = r; } else { it.taken = p.name; toast(`${itName(it)} → ${p.name}의 가방`); }
  save();
}
// v7.25.2 정산 화면 (맵을 넘어갈 때): 정산 (✦ 성장 · 동료) · 전리품 · 장비 · 가방 — 끼우기는 여기서 (싸우는 중엔 판의 몸과 어긋나지 않게)
let crTab = 'sum', crCtx = null;
function crBody(){
  const X = crCtx; if (!X) return ''; const { rows, party, W } = X;
  if (crTab === 'loot') return W ? lootCards(W, party) : '<p class="lnone">주울 만한 전리품이 없어요</p>';
  if (crTab === 'eq') return party.length ? party.map(p => `<div class="ceq" data-pid="${esc(String(p.id))}"><div class="ceqh"><i style="${faceCss(faceOf(p.ref), 30)}"></i>${esc(p.name)} <small>${p.hpNow != null ? '피 ' + p.hpNow : ''}${p.alt ? ' · 두 번째 총 ' + esc(p.alt.name) : ''}</small></div>${invHtml(p, { story: true, mates: party })}</div>`).join('') : '<p class="lnone">넘어가는 동료가 없어요</p>';
  const G = rows.filter(r => r.grow && r.grow.length);
  return (G.length ? `<div class="cgrow">${G.map(r => `<div class="gr"><i style="${faceCss(faceOf(r.ref), 46)}"></i><div><b>${esc(r.name)} — 성장!</b><div>${r.grow.map(g => `<span class="gchip">✦ ${esc(g)}</span>`).join('')}</div></div></div>`).join('')}</div>` : '')
    + `<div class="cgrid">${rows.map(r => { const p = party.find(x => x.id === r.pid), mx = p ? (statsOf(p, rules).hp || 1) : 1, hp = p && p.hpNow != null ? p.hpNow : mx;
      return `<div class="cc cr${r.alive ? '' : ' dead'}"><i style="${faceCss(faceOf(r.ref), 42)}"></i><div style="min-width:0;flex:1"><b>${esc(r.name)}${r.alive ? '' : r.gone === 'left' ? ' · 버림' : ' · 쓰러짐'}</b>${r.alive ? `<span class="hpb"><em style="--h:${Math.max(0, Math.min(100, Math.round(hp / mx * 100)))}%"></em></span>` : ''}<small>처치 ${r.kills} · 준 ${r.dealt} · 받은 ${r.taken}${r.blocked ? ' · 막음 ' + r.blocked : ''}${r.shots ? ' · 맞힘 ' + r.hits + '/' + r.shots : ''}${r.dodges ? ' · 피함 ' + r.dodges : ''}${r.healed ? ' · 치유 ' + r.healed : ''}</small></div></div>`; }).join('')}</div>`;
}
function crRender(){ const el = $('crBody'); if (el) el.innerHTML = crBody(); const T = $('crTabs'); if (T) T.querySelectorAll('[data-crt]').forEach(b => b.classList.toggle('on', b.dataset.crt === crTab)); }""")
rep("""function campResult(rows, s, btn, go){
  const b = $('banner'), def = CAMP_S[s] || { name: s + 'S' };
  b.className = 'banner win';""", """function campResult(rows, s, btn, go, party){
  const b = $('banner'), def = CAMP_S[s] || { name: s + 'S' };
  b.className = 'banner win';
  if (party){   /* v7.25.2 정산 화면: 탭 셋 */
    const W = world; lootPL = party; lootAuto(W, party); crCtx = { rows, party, W }; crTab = 'sum'; const nL = W ? lootOf(W).filter(x => !x.taken).length : 0, nG = rows.filter(r => r.grow && r.grow.length).length;
    b.innerHTML = `<b>${def.name} 정산</b><span>${esc(def.kind || '')} · 넘어간 이 ${rows.filter(r => r.alive).length}${nG ? ' · ✦ 성장 ' + nG : ''}${nL ? ' · 전리품 ' + nL : ''}</span>
      <div class="ctabs" id="crTabs"><button type="button" data-crt="sum" class="on">정산${nG ? ' ✦' : ''}</button><button type="button" data-crt="loot">전리품${nL ? ' ' + nL : ''}</button><button type="button" data-crt="eq">장비 · 가방</button></div>
      <div class="cbody" id="crBody">${crBody()}</div><div class="row"><button class="btn go" type="button" id="campNext">${esc(btn)}</button></div>`;
    b.hidden = false; $('campNext').onclick = () => { b.hidden = true; lootPL = null; crCtx = null; invPick = null; go(); }; return; }""")
rep("  if (ns > 5){ campResult(rows, s, '계단으로', () => { C.s = 6; S.units = party; campEnd('clear'); }); return; }\n  campResult(rows, s, (CAMP_S[Math.max(1, ns)] || {}).name + ' 로', () => { C.s = Math.max(1, ns); campBuild(C.s, dir === 'up' ? 'down' : 'up', party); });",
    "  if (ns > 5){ campResult(rows, s, '계단으로', () => { C.s = 6; S.units = party; campEnd('clear'); }, party); return; }\n  campResult(rows, s, (CAMP_S[Math.max(1, ns)] || {}).name + ' 로', () => { C.s = Math.max(1, ns); campBuild(C.s, dir === 'up' ? 'down' : 'up', party); }, party);   // v7.25.2 정산 화면에 넘어가는 동료")
# 맵 중간 · 훈련장 결과도 카드
rep("<div class=\"loot\" id=\"lootBox\">${lootHtml(world)}</div><div class=\"row\"><button class=\"btn\" type=\"button\" id=\"lootClose\">닫기</button></div>`; bn.hidden = false;",
    "<div class=\"loot\" id=\"lootBox\">${(lootPL = null, lootCards(world, lootParty()))}</div><p class=\"lnone\">끼우기는 맵을 넘어갈 때 정산 화면의 '장비 · 가방' 에서</p><div class=\"row\"><button class=\"btn\" type=\"button\" id=\"lootClose\">닫기</button></div>`; bn.hidden = false;")
rep("${r === 'win' ? `<div class=\"loot\" id=\"lootBox\">${lootHtml(world)}</div>` : ''}", "${r === 'win' ? `<div class=\"loot\" id=\"lootBox\">${(lootPL = null, lootCards(world, lootParty()))}</div>` : ''}")
rep("$('banner').addEventListener('change', e => { const s0 = e.target.closest('[data-loot]');", """$('banner').addEventListener('click', e => {   /* v7.25.2 정산 탭 · 전리품 카드 · 장비 */
  const t = e.target.closest('[data-crt]'); if (t){ crTab = t.dataset.crt; invPick = null; crRender(); return; }
  const g = e.target.closest('[data-lgive]'); if (g && world){ lootGive(world, +g.dataset.lgive, g.dataset.lp); if ($('crBody')) crRender(); else renderLoot(); return; }
  const c = e.target.closest('.ceq'); if (!c || !crCtx) return; const p = crCtx.party.find(x => String(x.id) === c.dataset.pid); if (!p) return;
  const ib = e.target.closest('[data-ibag]'), ie = e.target.closest('[data-ieq]'), ia = e.target.closest('[data-iact]'), ig = e.target.closest('[data-igive]');
  if (ib){ const i = +ib.dataset.ibag; invPick = invPick && invPick.id === p.id && invPick.at === 'bag' && invPick.i === i ? null : { id: p.id, at: 'bag', i }; crRender(); return; }
  if (ie){ const sl = ie.dataset.ieq; invPick = invPick && invPick.id === p.id && invPick.at === 'eq' && invPick.sl === sl ? null : { id: p.id, at: 'eq', sl }; crRender(); return; }
  if (ia){ invAct(p, ia.dataset.iact); crRender(); return; } if (ig){ invGive(p, ig.dataset.igive); crRender(); return; }
});
$('banner').addEventListener('change', e => { const s0 = e.target.closest('[data-loot]');""")
# 이야기 탭 동료: 성장 칩
rep("<small>${p.hpNow != null ? '피 ' + p.hpNow : '온전'}${(p.grown || []).length ? ' · ✦ ' + p.grown.length : ''}</small>", "<small>${p.hpNow != null ? '피 ' + p.hpNow : '온전'}${(p.grown || []).length ? ' · ✦ ' + esc(p.grown.slice(-2).join(' · ')) : ''}</small>")
# v1.3 장비 탭 '소지품' 제목 작게 · 새로 얻은 등급 문구
rep(".banner .inv{--line:#3a3240;", ".banner .inv .ivh b{display:inline;font:700 13px var(--body);color:#ece4d6}   /* v7.25.2 v1.3 */\n.banner .inv{--line:#3a3240;")
rep("out.push(`${k} ${cur || '없음'} → ${nx}`); }", "out.push(cur ? `${k} ${cur} → ${nx}` : `${k} ${nx} 새로 얻음`); }")
# v1.4 actLabel: 대상이 사라진 겨눔 (드물게 a.b 가 빈 채로) — 화면이 멈추지 않게
rep("return a.ph === 'wind' ? `${u.skill ? u.skill.name : '기술'} → ${b.name} (", "return a.ph === 'wind' ? `${u.skill ? u.skill.name : '기술'} → ${b ? b.name : '?'} (")
rep("return a.k === 'heal' ? `치유 준비 → ${b.name} (${f2(a.left)}초 뒤)` : `공격 준비 → ${b.name} (", "return a.k === 'heal' ? `치유 준비 → ${b ? b.name : '?'} (${f2(a.left)}초 뒤)` : `공격 준비 → ${b ? b.name : '?'} (")
open(F, 'w', encoding='utf-8').write(s)
print('page7252 OK')
