import sys
p='page10.tpl.html'; s=open(p,encoding='utf-8').read()
for a in ['굴의 전투판 v5.5.4 (', '굴의 전투판 v5.5.4 —', '굴의 전투판 v5.5.4 ·']:
    s=s.replace(a, a.replace('v5.5.4','v5.6'))
# hoverTip 머리 · 꼬리
i=s.index("function hoverTip(e){\n"); j=s.index("  const p = S.units.find(x => x.id === u.pid) || {}", i)
HEAD_OLD=s[i:j]
HEAD_NEW="""// v5.6 상세정보는 판 옆 칸 (#det) 에: 커서를 올린 인물 · 떨어진 물건, 없으면 고른 아군 (판을 가리지 않음)
function hoverTip(e){
  const Wd = W_(); if (!Wd || e.pointerType === 'touch') return;
  const w = toWorld(e.clientX, e.clientY), u = unitAt(Wd, w.x, w.y, mode === 'edit'), itm = !u && mode !== 'edit' ? itemAt(Wd, w.x, w.y) : null;
  const pid = u ? u.pid : null, iid = itm ? itm.id : null;
  if (pid === hoverPid && iid === hoverItem) return;
  hoverPid = pid; hoverItem = iid; renderDetail();
}
function unitDetailHtml(Wd, u){
"""
s=s[:i]+HEAD_NEW+s[j:]
k=s.index("  tip.innerHTML = `<div class=\"hd\"><span class=\"fc\" style=\"${faceCss(faceOf(u.ref), 38)}\"></span>")
s=s[:k]+"  return `<div class=\"hd\">"+s[k+len("  tip.innerHTML = `<div class=\"hd\">"):]
TAIL_OLD="""  tip.hidden = false;
  const vr = $('view').getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = e.clientX - vr.left + 16, y = e.clientY - vr.top + 16;
  if (x + tw > vr.width - 6) x = e.clientX - vr.left - tw - 16;
  if (y + th > vr.height - 6) y = Math.max(6, vr.height - th - 6);
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
}"""
TAIL_NEW="""}
// v5.6 떨어진 물건 (판 위 커서) · 상세정보 칸 그리기
const itemAt = (Wd, x, y) => (Wd.items || []).filter(it => Math.hypot(it.x - x, it.y - y) < 0.45).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0] || null;
function itemIcon(Wd, it){ if (it.k === 'shield') return '🛡'; const w = (Wd.rules.weapons || {})[it.name] || {}; return w.kind === '활' ? '🏹' : w.kind === '총포류' ? '🔫' : w.kind === '마법' ? '🪄' : w.kind === '둔기' ? '🔨' : /창$/.test(it.name) ? '🔱' : '🗡'; }
function itemDetailHtml(Wd, it){
  const w = (Wd.rules.weapons || {})[it.name] || {}, o = Wd.units[it.owner], L = selUnits(Wd), ok = L.filter(u => canTake(Wd, u, it));
  return `<div class="hd"><span style="font-size:28px;line-height:1">${itemIcon(Wd, it)}</span><div><b>${esc(it.name)}</b><div class="sub">땅에 떨어진 ${it.k === 'shield' ? '방패' : '무기'} · ${coord(it.x, it.y)}${o ? ' · ' + esc(o.name) + '의 것' : ''}</div></div></div>
    ${it.k === 'shield' ? `<span class="tr"><span class="lb">방패</span> 들면 방어 자세 (앞 ±${Math.round((Wd.rules.frontArc || 60) * 0.6)}° 넘게) · 방패 밀치기 · 방패 돌진. 왼팔이 있고 활 · 총 (두 손) 을 안 든 쪽만</span>` : `<span class="tr"><span class="lb">무기</span> ${esc(w.kind || '?')} · 사거리 ${w.rng != null ? w.rng : '?'}칸${it.ammo != null ? ' · 남은 탄 ' + it.ammo : ''}${/창$/.test(it.name) ? ' · 던질 수도 있음 (투창)' : ''}${w.guard ? ' · 막을 수 있음' : ''} — 들던 무기는 발밑에 내려놓음</span>`}
    <span class="tr"><span class="lb">줍기</span> ${L.length ? (ok.length ? esc(ok.map(u => u.name).join(' · ')) + ' 이(가) 집어 들 수 있음 — 누르면 가장 가까운 쪽이 주우러 감 (E = 가장 가까운 것)' : '고른 아군은 들 수 없음') : '아군을 고르고 이 물건을 누르면 주우러 감'}</span>
    <span class="tr lb">투구 · 갑옷은 나중에 (루팅)</span>`;
}
let hoverItem = null, detHtml = '';
function renderDetail(){
  const el = $('det'); if (!el) return; const Wd = W_();
  let html = '<p class="empty">판의 인물 · 떨어진 물건에 커서를 올리거나 아군을 고르면 여기에 자세히 나와요.</p>';
  if (Wd){
    const u = hoverPid != null ? Wd.units.find(x => x.pid === hoverPid) : null, it = hoverItem != null ? (Wd.items || []).find(x => x.id === hoverItem) : null, L = mode === 'edit' ? [] : selUnits(Wd);
    if (u) html = unitDetailHtml(Wd, u); else if (it) html = itemDetailHtml(Wd, it); else if (L.length === 1) html = unitDetailHtml(Wd, L[0]);
    else if (L.length) html = `<p class="empty">${L.length}명 고름 — ${esc(L.map(x => x.name).join(' · '))}. 한 명에 커서를 올리면 자세히 나와요.</p>`;
  }
  if (html !== detHtml){ detHtml = html; el.innerHTML = html; }
}
// 줍기 명령: 고른 아군 중 집어 들 수 있는 가장 가까운 쪽이 그 물건을 주우러 감
function givePick(it){
  const L = selUnits(world), C = L.filter(u => canTake(world, u, it)).sort((a, b) => Math.hypot(a.x - it.x, a.y - it.y) - Math.hypot(b.x - it.x, b.y - it.y));
  if (!C.length){ toast(it.k === 'shield' ? '고른 아군은 방패를 들 수 없어요 (왼팔 · 두 손 무기 · 이미 방패)' : '고른 아군은 이 무기를 들 수 없어요'); return false; }
  const u = C[0]; u.order = { k: 'pick', id: it.id }; noteOrders([u]); toast(`${u.name} → ${it.name} 주우러`); hud(); return true;
}
const nearItem = (Wd, L, r) => { let best = null, bd = r || 8; for (const u of L) for (const it of Wd.items || []){ if (!canTake(Wd, u, it)) continue; const d = Math.hypot(it.x - u.x, it.y - u.y); if (d < bd){ bd = d; best = it; } } return best; };"""
assert s.count(TAIL_OLD)==1; s=s.replace(TAIL_OLD,TAIL_NEW)
pairs=[
("""     v5.5.4: 이동 명령은 하던 동작""", """     v5.6: 줍기 · 회수 — 쓰러지면 무기 · 방패가 땅에 떨어지고 (방패 팔 · 두 팔을 잃어도), 아군을 고르고 떨어진 물건을 누르거나 E 로 주움 (무기가 없으면 스스로도).
           상세정보는 판 옆 칸에 (커서를 올린 인물 · 물건, 없으면 고른 아군) — 판 위 설명 상자를 없앰. 투구 · 갑옷은 나중에 (루팅).
     v5.5.4: 이동 명령은 하던 동작"""),
("""<span class="ver">v5.5.4 · 기술 막대""", """<span class="ver">v5.6 · 줍기 · 상세정보 칸 · 기술 막대"""),
(""".legend2 span{display:inline-flex;align-items:center;gap:5px}""", """.legend2 span{display:inline-flex;align-items:center;gap:5px}
/* v5.6 상세정보 칸 (판 옆) */
.detail{min-width:0;height:calc(100vh - 78px);min-height:520px;overflow:auto;position:sticky;top:calc(8px + env(safe-area-inset-top,0px));display:flex;flex-direction:column;gap:6px}
.detail .dethd{font:700 12px var(--body);color:var(--dim);letter-spacing:.02em}
.tip.det{position:static;width:auto;pointer-events:auto;box-shadow:none;flex:1 1 auto;overflow:auto;max-width:none}
.tip.det .empty{color:#a39a8c;margin:0}
@media (min-width:1201px){ .app{grid-template-columns:minmax(0,1fr) 290px 410px} }
@media (min-width:1601px){ .app{grid-template-columns:minmax(0,1fr) 330px 430px} }
@media (max-width:1200px){ .app > .boardcol{grid-column:1;grid-row:1} .app > .side{grid-column:2;grid-row:1 / span 2} .app > .detail{grid-column:1;grid-row:2;height:auto;min-height:0;max-height:440px;position:static} }
@media (max-width:980px){ .app > .boardcol, .app > .side, .app > .detail{grid-column:auto;grid-row:auto} .app > .detail{max-height:none} }"""),
("""    <div class="side" id="side">""", """    <aside class="detail" id="detail" aria-label="상세정보"><div class="dethd">상세정보</div><div class="tip det" id="det"><p class="empty">판의 인물 · 떨어진 물건에 커서를 올리거나 아군을 고르면 여기에 자세히 나와요.</p></div></aside>
    <div class="side" id="side">"""),
("""cv.addEventListener('pointerleave', () => { $('tip').hidden = true; hoverPid = null; });""", """cv.addEventListener('pointerleave', () => { $('tip').hidden = true; hoverPid = null; hoverItem = null; renderDetail(); });"""),
("""  const Wd = W_(); renderSkillBar(Wd); if (!Wd) return;   // v5.5.4 기술 막대""", """  const Wd = W_(); renderSkillBar(Wd); renderDetail(); if (!Wd) return;   // v5.5.4 기술 막대 · v5.6 상세정보 칸"""),
("""${r && r[7] && u.side === 0 ? `<span class="tr lb">${esc(r[7].slice(0, 70))}${r[7].length > 70 ? '…' : ''}</span>` : ''}""", """${r && r[7] && u.side === 0 ? `<span class="tr lb">${esc(r[7].slice(0, 300))}${r[7].length > 300 ? '…' : ''}</span>` : ''}"""),
# 무기 줄: 떨어뜨림
("""${esc(u.noArms ? '발길질 (두 팔을 잃음)' :""", """${esc(u.noArms ? '발길질 (두 팔을 잃음)' : u.weaponGone ? '맨손 (' + u.weapon + '을 떨어뜨림 — 주우면 다시)' :"""),
# 물건 그리기
("""  if (!ed) for (const it of Wd.items || []){ if (it.k !== 'spear') continue; const p = { x: ox + it.x * ts, y: oy + it.y * ts }, o = Wd.units[it.owner];""",
 """  if (!ed) for (const it of Wd.items || []){ const p = { x: ox + it.x * ts, y: oy + it.y * ts }, o = Wd.units[it.owner];
    if (it.k !== 'spear'){   // v5.6 떨어진 무기 · 방패: 둥근 받침 + 아이콘 (가까이 보면 이름)
      const rr = Math.max(7, ts * 0.2), hov = hoverItem === it.id; ctx.fillStyle = hov ? 'rgba(255,225,150,.4)' : 'rgba(10,8,12,.72)'; ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(255,225,150,.8)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.font = `${Math.round(rr * 1.15)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText(itemIcon(Wd, it), p.x, p.y + 1);
      if (ts >= 30 || hov){ ctx.font = '600 10px IBM Plex Sans KR, sans-serif'; ctx.textBaseline = 'top'; ctx.fillStyle = 'rgba(255,225,150,.92)'; ctx.fillText(it.name, p.x, p.y + rr + 2); }
      continue; }"""),
# 줍기 명령 선
("""        if (u.order.k === 'skill'){ const t = Wd.units[u.order.b];""", """        if (u.order.k === 'pick' && u.order.id != null){ const it = (Wd.items || []).find(x => x.id === u.order.id); if (it){ ctx.strokeStyle = `rgba(255,225,150,${Math.max(al, .7)})`; ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); ctx.lineTo(ox + it.x * ts, oy + it.y * ts); ctx.stroke(); } }   // v5.6 줍기
        if (u.order.k === 'skill'){ const t = Wd.units[u.order.b];"""),
# 클릭: 물건 누르면 줍기
("""  if (amovePick){ amovePick = false;""", """  { const it = L.length && !amovePick ? itemAt(world, w.x, w.y) : null; if (it){ givePick(it); return; } }   // v5.6 떨어진 물건을 누르면 줍기
  if (amovePick){ amovePick = false;"""),
# E 키 · 줍기 단추
("""  else if (k === 'pick'){ const u = L.find(x => !x.torch), tc = u && nearTorch(world, u, 99);""", """  else if (k === 'pick' && nearItem(world, L)){ givePick(nearItem(world, L)); }   // v5.6 가장 가까운 집어 들 수 있는 물건
  else if (k === 'pick'){ const u = L.find(x => !x.torch), tc = u && nearTorch(world, u, 99);"""),
("""${L.some(u => u.jav && !u.spearHeld && mySpear(Wd, u)) ? `<button class="btn" type="button" data-ord="pick">창 줍기 <kbd>E</kbd></button>` :""", """${L.some(u => u.jav && !u.spearHeld && mySpear(Wd, u)) ? `<button class="btn" type="button" data-ord="pick">창 줍기 <kbd>E</kbd></button>` : nearItem(Wd, L) ? `<button class="btn" type="button" data-ord="pick">${esc(nearItem(Wd, L).name)} 줍기 <kbd>E</kbd></button>` :"""),
# 명령표 · 확인
("""  if (o[0] === 'pick') return `${coord(o[1], o[2])} 횃불 줍기`;""", """  if (o[0] === 'pick') return `${coord(o[1], o[2])} 횃불 줍기`;
  if (o[0] === 'pickItem'){ const it = (Wd.items || []).find(x => x.id === o[1]); return `${it ? it.name : '물건'} 줍기`; }"""),
("""o.k === 'pick' ? ['줍기', '#d8cfc0']""", """o.k === 'pick' ? ['✋ ' + (o.id != null && world ? ((world.items || []).find(x => x.id === o.id) || {}).name || '줍기' : '줍기'), '#ffe196']"""),
# 서술
("""      case 'spearPick': out.push(`${T(e)}${n(e.a)} 창을 다시 주움 (${coord(e.x, e.y)})`); break;""", """      case 'spearPick': out.push(`${T(e)}${n(e.a)} 창을 다시 주움 (${coord(e.x, e.y)})`); break;
      case 'drop': out.push(`${T(e)}${n(e.a)} ${e.name} 떨어뜨림${{ death: ' (쓰러지며)', arm: ' (팔을 잃어)', arms: ' (두 팔을 잃어)', swap: ' (바꿔 들며)' }[e.how] || ''} · ${coord(e.x, e.y)}`); break;   // v5.6
      case 'pickItem': out.push(`${T(e)}${n(e.a)} ${e.name} ${e.own ? '다시 ' : ''}주움${e.item === 'shield' ? ' — 방패를 듦 (방어 자세 · 밀치기 · 방패 돌진)' : ''} · ${coord(e.x, e.y)}`); break;
      case 'pickFail': out.push(`${T(e)}${n(e.a)} ${e.name} 못 집음`); break;"""),
("""    case 'spearPick': return e.vis ?""", """    case 'pickItem': return e.vis ? { c: U(e.a).side === 0 ? 'good' : 'bad', s: e.item === 'shield' ? `${ga(n(e.a))} 떨어진 방패를 집어 든다!` : `${ga(n(e.a))} ${e.own ? '제 ' : ''}${reul(e.name)} 집어 든다!` } : null;   // v5.6
    case 'spearPick': return e.vis ?"""),
]
for o,n in pairs:
    if s.count(o)!=1: print('MISMATCH',s.count(o),o[:120]); sys.exit(1)
for o,n in pairs: s=s.replace(o,n)
open(p,'w',encoding='utf-8').write(s); print('ok')
