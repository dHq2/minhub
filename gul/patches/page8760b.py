# v8.7.6 페이지 둘째 쪽 — page8760b.py v1.7 (v1.7: 나가기 전 전리품 창이 뜬 채 출구 단추를 한 번 더 누르면 창을 닫고 서둘러 나감 ('두 번 = 서둘러' 그대로) · ▶ 이대로 나가기 는 서두르지 않음 · v1.6: 끼우기 단추도 다른 전리품 단추처럼 손가락 크기 (36px) · 나가기 전에 전리품을 이미 보았으면 정산 화면은 정산 탭부터 (두 번 내밀지 않음 — 전리품 탭은 그대로) · v1.5: 상세 칸을 누르고 있는 동안은 다시 그리지 않음 (싸우는 중 거리 · 피가 바뀌어 칸이 새로 그려지면 누름이 사라지던 것) · 이름표로 고정한 물건은 아군을 새로 고르면 풀림 (숫자키 · 카드로 골라도 물건이 남던 것) · v1.4: 결과 · 전리품 창은 대형 띠 위에 (띠가 제목을 가리던 것) · 전리품 창은 넓게 (PC 600 · 휴대폰 420) · v1.3: 맵 위에서 땅의 무기를 챙기면 남은 화살 · 탄도 무기에 든 채 함께 (예전엔 무기만 가고 탄은 사라짐) · v1.2: PC 상세 패널이 접혀 있으면 (좁은 화면 기본) 이름표를 누르거나 I 를 누를 때 펼침 — 예전엔 보이지 않는 칸에 그려짐 · v1.1: 이름표는 가 본 곳 (안개 밖) 의 물건만 · 이름표 자리에 인물이 서 있으면 인물을 먼저 고름 (싸우는 중 잘못 누르지 않게) · 옛 전리품 고르개도 출처 열쇠로 · v1.0: page8760.py 가 exec: 상세 칸 장비 · 가방 탭 · 판 위 이름표 · 전리품 비교 · 끼우기 · 맵 위 전리품은 판의 몸에 · 나가기 전 전리품)

# ---------- CSS ----------
EQ_CSS = r'''/* v8.7.6 상세 칸 탭 · 장비 · 가방 · 전리품 비교 */
.dtabs{display:flex;gap:4px;margin:4px 0 6px}
.dtabs button{flex:1;border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:7px;padding:4px 6px;font:700 12px var(--body);cursor:pointer}
.dtabs button.on{background:#3a2f1c;border-color:#d9a94e;color:#ffe2a8} .dtabs small{opacity:.75;font-weight:600}
.eqt{display:flex;flex-direction:column;gap:6px}
.eqrow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}
.eqs{display:flex;flex-direction:column;align-items:flex-start;gap:1px;min-height:44px;border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:7px;padding:3px 5px;font:600 11.5px var(--body);text-align:left;cursor:pointer;position:relative;overflow:hidden}
.eqs small{font-size:10px;color:var(--dim)} .eqs span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%} .eqs.empty span{opacity:.6}
.eqs.on,.eqc.on{border-color:#ffe2a8;box-shadow:0 0 0 1px #ffe2a8 inset}
.eqin{position:absolute;right:3px;top:2px;font:700 9px var(--body);color:#ffd27a;font-style:normal}
.eqsum{font:600 11px var(--body);color:var(--dim)}
.eqgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(62px,1fr));gap:4px}
.eqc{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;min-height:52px;border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:7px;padding:3px;font:600 10.5px var(--body);cursor:pointer;overflow:hidden;min-width:0}
.eqc b{font-size:18px;line-height:1} .eqc small{max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .eqc.empty{border-style:dashed;opacity:.4;cursor:default}
.eqinfo{border-top:1px solid var(--line);padding-top:5px;font:500 12px var(--body)} .eqn small{color:var(--dim)}
.eqbtns{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px} .eqbtns .btn{min-height:30px;font-size:12px;padding:3px 9px} .eqbtns .why{flex-basis:100%;color:#ffb27a;font:600 11px var(--body)}
.eqcmp,.lcmp{display:block;font:500 11px var(--body);color:#cfd8e6;margin-top:2px}
.eqcmp em,.lcmp em{font-style:normal;font-weight:700;margin-left:4px} .eqcmp .up,.lcmp .up{color:#9ff0b0} .eqcmp .dn,.lcmp .dn{color:#ff9a86} .eqcmp .eq,.lcmp .eq{color:var(--dim)}
.eqnear{display:flex;flex-wrap:wrap;gap:4px;align-items:center;font:600 11px var(--body);color:var(--dim);border-top:1px dashed var(--line);padding-top:5px}
.eqnear .btn{min-height:28px;font-size:11.5px;padding:2px 8px}
.ipk{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px} .ipk .btn{min-height:30px;font-size:12px;padding:3px 9px}
.l8r .l8wear{min-height:36px;border:1px solid #6a8f5a;background:#1f2a1c;color:#cfe8c0;border-radius:8px;padding:4px 10px;font:700 12px var(--body);cursor:pointer;white-space:nowrap} .l8r .l8wear[disabled]{opacity:.45;cursor:default}
.l8r .lfall{display:block;font:600 10.5px var(--body);color:#ffb2a8}
body.mob .eqs{min-height:48px} body.mob .eqc{min-height:56px} body.mob .eqbtns .btn,body.mob .ipk .btn{min-height:36px}
.banner{z-index:8}   /* 결과 · 전리품 창은 대형 띠 (z 6) 위에 */
body:not(.mob) .banner:has(.loot){width:min(94%,600px)} body.mob .banner:has(.loot){width:min(96%,420px)}
'''
rep(".fmchip{display:none}\n", ".fmchip{display:none}\n" + EQ_CSS)

# ---------- 상세 칸: 정보 · 장비 탭 ----------
rep("""  return `<div class="hd"><span class="fc" style="${faceCss(faceOf(u.ref), 38)}"></span><div><b>${esc(u.name)}</b><div class="sub">${u.side ? '적' : '아군'} · ${u.tier}등급 ${esc(u.cls)} · ${sizeOf(u)} · 속력 ${u.spd} · ${coord(u.x, u.y)}</div></div></div>
""", """  const hd0 = `<div class="hd"><span class="fc" style="${faceCss(faceOf(u.ref), 38)}"></span><div><b>${esc(u.name)}</b><div class="sub">${u.side ? '적' : '아군'} · ${u.tier}등급 ${esc(u.cls)} · ${sizeOf(u)} · 속력 ${+(+u.spd).toFixed(2)} · ${coord(u.x, u.y)}</div></div></div>`, tabs = !ed ? detTabsHtml(Wd, u, known) : '';   /* v8.7.6 정보 · 장비 탭 */
  if (tabs && detTab === 'eq') return hd0 + tabs + eqTabHtml(Wd, u);
  return hd0 + tabs + `
""")
rep("    if (u) html = unitDetailHtml(Wd, u); else if (it) html = itemDetailHtml(Wd, it);",
    "    if (detItem != null && [...sel].join(',') !== detItemSel) detItem = null;   /* 고른 아군이 바뀌면 (숫자키 · 카드 · 판) 고정한 물건을 풂 */\n"
    "    const it2 = !u && !it && detItem != null ? (Wd.items || []).find(x => x.id === detItem) || null : null; if (detItem != null && !it2 && !(Wd.items || []).some(x => x.id === detItem)) detItem = null;   /* v8.7.6 이름표를 눌러 고정한 물건 */\n"
    "    { const du = u || (!it && !it2 ? (L.length === 1 && !LH.length ? L[0] : !L.length && LH.length === 1 ? LH[0] : null) : null); detShownU = du ? du.i : null; }\n"
    "    if (u) html = unitDetailHtml(Wd, u); else if (it || it2) html = itemDetailHtml(Wd, it || it2);")
rep("투구 · 갑옷은 싸우는 중엔 못 갈아입음</span>`;", "갑옷 · 투구 · 가방은 아군 상세 칸의 🎒 장비 · 가방 (I) 에서 — 싸우는 중에도 갈아입음 (투구 1.5초 · 갑옷 4초)</span>${itemPickRow(Wd, it)}`;")

# ---------- 판 위 이름표 (D3) ----------
rep("  const SK = fxShakeOff(), ox = w / 2 - cam.x * ts + SK.x, oy = h / 2 - cam.y * ts + SK.y;   /* v7.28.0 화면 흔들림 */",
    "  const SK = fxShakeOff(), ox = w / 2 - cam.x * ts + SK.x, oy = h / 2 - cam.y * ts + SK.y;   /* v7.28.0 화면 흔들림 */\n  LBL = [];   /* v8.7.6 눌러 볼 수 있는 이름표 (이 그림의 자리) */")
rep("      if (ts >= 30 || hov){ ctx.font = '600 10px IBM Plex Sans KR, sans-serif'; ctx.textBaseline = 'top'; ctx.fillStyle = 'rgba(255,225,150,.92)'; ctx.fillText(it.name, p.x, p.y + rr + 2); }",
    "      if ((ts >= 14 || hov) && lblSeen(Wd, it)) lblPill(it.label || it.name, p.x, p.y - rr - 2, { k: 'item', id: it.id }, hov || detItem === it.id);   /* v8.7.6 D3 이름표 (누르면 누가 주울지 · 가 본 곳만) */")
rep("    if (ts >= 30){ ctx.font = '600 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = 'rgba(255,225,150,.9)'; ctx.fillText(o ? o.name + (kn ? '의 단검' : '의 창') : (kn ? '단검' : '창'), p.x, p.y + ts * 0.25); } }",
    "    if ((ts >= 14 || hoverItem === it.id) && lblSeen(Wd, it)) lblPill(o ? o.name + (kn ? '의 단검' : '의 창') : (kn ? '단검' : '창'), p.x, p.y - ts * 0.3, { k: 'item', id: it.id }, hoverItem === it.id || detItem === it.id); }   /* v8.7.6 D3 */")
rep("ctx.fillStyle = '#f0dca0'; ctx.fillText(lb, px, py + r + 3 + Math.max(13, ts * 0.36) / 2);",
    "ctx.fillStyle = '#f0dca0'; ctx.fillText(lb, px, py + r + 3 + Math.max(13, ts * 0.36) / 2); LBL.push({ x0: px - lw / 2, y0: py + r + 3, x1: px + lw / 2, y1: py + r + 3 + Math.max(13, ts * 0.36), k: 'npc', E });   /* v8.7.6 D3 이름표를 누르면 말 걸기 */")
rep("  if (mode !== 'edit' && !d.right && encClick(w)) return;   // v7.22 장면 인물을 누르면 말 걸기",
    "  if (mode !== 'edit' && !d.right && lblClick(e.clientX, e.clientY)) return;   /* v8.7.6 D3 이름표 */\n  if (mode !== 'edit' && !d.right && encClick(w)) return;   // v7.22 장면 인물을 누르면 말 걸기")
rep("  const w = toWorld(e.clientX, e.clientY), u = unitAt(Wd, w.x, w.y, mode === 'edit'), itm = !u && mode !== 'edit' ? itemAt(Wd, w.x, w.y) : null;",
    "  const w = toWorld(e.clientX, e.clientY), u = unitAt(Wd, w.x, w.y, mode === 'edit'), lb = !u && mode !== 'edit' ? lblAt(e.clientX, e.clientY) : null, itm = lb && lb.k === 'item' ? (Wd.items || []).find(x => x.id === lb.id) || null : !u && mode !== 'edit' ? itemAt(Wd, w.x, w.y) : null;   /* v8.7.6 이름표 위면 그 물건 (인물이 서 있으면 인물) */")
rep("  if (html !== detHtml){ detHtml = html; el.innerHTML = html; }", "  if (html !== detHtml && !(detHold && performance.now() - detHold < 1500)){ detHtml = html; el.innerHTML = html; }   /* v8.7.6 누르고 있는 동안은 그대로 (손을 떼면 바로 새로 · 1.5초까지) */")
rep("if (nL) crTab = 'loot';   /* v8.7.3 남은 전리품이 있으면 전리품부터 (못 보고 넘어가던 것) */", "if (nL && !(W && W.lootSeen)) crTab = 'loot';   /* v8.7.3 남은 전리품이 있으면 전리품부터 (못 보고 넘어가던 것) · v8.7.6 나가기 전에 이미 보았으면 정산 탭부터 (두 번 내밀지 않음) */")
rep("function playClick(w, add, u0){", "function playClick(w, add, u0){ detItem = null;   /* v8.7.6 판을 누르면 고정한 물건을 풂 */")
rep("function touchTap(w){", "function touchTap(w){ detItem = null;   /* v8.7.6 */")

# ---------- 전리품: 출처 열쇠 · 비교 · 끼우기 · 맵 위에선 판의 몸에 ----------
rep('data-lgive="${i}"', 'data-lgive="${esc(it.lk != null ? it.lk : String(i))}"', 3)
rep("""  const row = (it, i) => { const fit = lootFit(it, PL), w = lootWhy(to, it), sub = [lootSub(it), it.worn ? '망가진 채 벗겨 냄' : ''].filter(Boolean).join(' · ');
    return `<div class="l8r${it.worn ? ' worn' : ''}"><span class="lic">${INV_IC[it.k] || '·'}</span><span class="lnm">${esc(itName(it))}${sub ? `<small>${esc(sub)}</small>` : ''}${it.k !== 'ammo' ? durBar(it.dur) : ''}</span>`""",
"""  const row = (it, i) => { const fit = lootFit(it, PL), w = lootWhy(to, it), sub = [lootSub(it), it.worn ? '망가진 채 벗겨 냄' : ''].filter(Boolean).join(' · '), ww = lootWearWhy(to, it), canW = ['weapon', 'shield', 'armor', 'helm'].includes(it.k);   /* v8.7.6 J8 비교 · 끼우기 */
    return `<div class="l8r${it.worn ? ' worn' : ''}"><span class="lic">${INV_IC[it.k] || '·'}</span><span class="lnm">${esc(itName(it))}${sub ? `<small>${esc(sub)}</small>` : ''}${it.fall ? `<small class="lfall">† 쓰러진 ${esc(it.fall)}의 것</small>` : ''}${lootCmpHtml(to, it)}${it.k !== 'ammo' ? durBar(it.dur) : ''}</span>`
      + (canW ? `<button type="button" class="l8wear" data-lwear="${esc(it.lk != null ? it.lk : String(i))}" data-lp="${sid(to)}" ${ww ? `disabled title="${esc(ww)}"` : `title="${esc(to.name)}에게 바로 끼움 (지금 것은 가방에)"`}>끼우기</button>` : '')""")
rep("const it = lootOf(Wd)[i], p = S.units.find(x => String(x.id) === String(pid)); if (!it || !p || it.taken) return;\n  const r = bagPut(p, it);",
    "const it = lootFind(Wd, i), p = S.units.find(x => String(x.id) === String(pid)); if (!it || !p || it.taken) return;\n  if (lootLiveU(Wd, p)){ lootGiveLive(Wd, it, p); return; }   /* v8.7.6 맵 위 (싸움 중 · 끝난 맵): 판의 몸에 지닌 가방으로 바로 */\n  const r = bagPut(p, it);")
rep("lootGive(Wd, i, p.id)", "lootGive(Wd, it.lk != null ? it.lk : i, p.id)")
rep("  const g = e.target.closest('[data-lgive]'); if (g && world){ lootGive(world, +g.dataset.lgive, g.dataset.lp);",
    "  { const gw = e.target.closest('[data-lwear]'); if (gw && world && !gw.disabled){ lootWear(world, gw.dataset.lwear, gw.dataset.lp); if ($('crBody')) crRender(); else renderLoot(); return; } }   /* v8.7.6 J8 끼우기 */\n"
    "  const g = e.target.closest('[data-lgive]'); if (g && world){ lootGive(world, g.dataset.lgive, g.dataset.lp);")
rep("""  if (b.dataset.cloot){ const bn = $('banner'); bn.className = 'banner win'; bn.innerHTML = `<b>끝난 맵 — 전리품</b><span>고른 동료의 가방으로 · 다음 맵에도 지님</span><div class="loot" id="lootBox">${(lootPL = null, lootCards(world, lootParty()))}</div><p class="lnone">끼우기는 맵을 넘어갈 때 정산 화면의 '장비 · 가방' 에서</p><div class="row"><button class="btn" type="button" id="lootClose">닫기</button></div>`; bn.hidden = false; $('lootClose').onclick = () => { bn.hidden = true; }; return; }""",
    "  if (b.dataset.cloot){ world.lootSeen = true; lootBanner(world, false); return; }   /* v8.7.6 */")
rep("""  const it = lootOf(world)[+s0.dataset.loot], p = S.units.find(x => String(x.id) === e.target.value); if (!it || !p || it.taken) return;
  const r = bagPut(p, it); if (typeof r === 'string'){ toast(`${p.name}: ${r}`); renderLoot(); return; }
  if (it.k === 'ammo' && r > 0){ toast(`${p.name} 가방에 ${it.n - r} — ${r} 남음`); it.n = r; } else { it.taken = p.name; toast(`${itName(it)} → ${p.name}의 가방`); }
  save(); renderLoot(); });""", """  lootGive(world, s0.dataset.loot, e.target.value); renderLoot(); });   /* v8.7.6 옛 고르개도 lootGive 하나로 (출처 열쇠 · 맵 위면 판의 몸에) */""")
rep('data-loot="${i}"', 'data-loot="${esc(it.lk != null ? it.lk : String(i))}"')
rep("  if (b.dataset.cexit){ const dir = b.dataset.cexit, L = world.units.filter(u => u.side === 0 && u.alive && !u.down);",
    "  if (b.dataset.cexit && !exitLootOK(b)) return;   /* v8.7.6 J11 끝난 맵에서 나가기 전 남은 전리품을 한 번 */\n"
    "  if (b.dataset.cexit){ const dir = b.dataset.cexit, L = world.units.filter(u => u.side === 0 && u.alive && !u.down);")

# ---------- 함수들 ----------
EQ_JS = r'''/* ---------- v8.7.6 인벤토리 v2 — 상세 칸 장비 · 가방 탭 (D2 · I24) · 판 위 이름표 (D3) · 전리품 비교 · 끼우기 (J8) · 나가기 전 전리품 (J11) ---------- */
var detTab = 'info', detPick = null, detItem = null, detItemSel = '', detShownU = null, eqTapT = null, LBL = [], detHold = 0;   // var: 처음 그릴 때 (선언 줄 전) 도 쓸 수 있게
const invOrdTxt = (o, Wd) => { const W0 = Wd || world, sl = o.slot; return o.op === 'wear' ? '갑옷 · 투구 입기' : o.op === 'off' ? (sl === 'shield' ? '방패' : sl === '머리' ? '투구' : '갑옷') + ' 벗기' : o.op === 'give' ? ((W0 && W0.units[o.to] ? W0.units[o.to].name + '에게 ' : '') + '건네기') : o.op === 'drop' ? '내려놓기' : '장비'; };
// PC 상세 패널이 접혀 있으면 펼침 (좁은 화면은 처음부터 접힘 — 이름표 · I 로 부른 것이 보이게)
function detShowPc(){ if (MOB || detOn()) return; S.pcDet = true; save(); applyPc(); toast('📋 상세 패널을 펼쳤어요 — 다시 접으려면 📋 상세 열기'); }
// 판 위 이름표: 둥근 띠 (겹치면 위로 비켜 섬) · 누르는 자리 기억
function lblPill(t, cx, y, ref, hot){
  ctx.save(); ctx.font = '600 11px IBM Plex Sans KR, sans-serif'; const tx = t.length > 18 ? t.slice(0, 17) + '…' : t, w = Math.min(160, ctx.measureText(tx).width) + 10, h = 16; let x0 = cx - w / 2, y0 = y - h;
  for (let k = 0; k < 4; k++){ const hit = LBL.find(b => b.k === 'item' && x0 < b.x1 && x0 + w > b.x0 && y0 < b.y1 && y0 + h > b.y0); if (!hit) break; y0 = hit.y0 - h - 2; }
  ctx.fillStyle = hot ? 'rgba(255,225,150,.95)' : 'rgba(12,10,16,.8)'; ctx.strokeStyle = 'rgba(255,225,150,.8)'; ctx.lineWidth = 1; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x0, y0, w, h, 8); else ctx.rect(x0, y0, w, h); ctx.fill(); ctx.stroke();
  ctx.fillStyle = hot ? '#1a1520' : '#ffe7a8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(tx, x0 + w / 2, y0 + h / 2 + 0.5); ctx.restore();
  LBL.push({ x0, y0, x1: x0 + w, y1: y0 + h, ...ref });
}
const lblSeen = (Wd, it) => !Wd.explored || $('seeAll').checked || !!Wd.explored[(it.y | 0) * S.W + (it.x | 0)];   // 가 본 곳 (안개 밖) 의 물건만 이름표
function lblAt(cx, cy){ if (!cv) return null; const r = cv.getBoundingClientRect(), x = cx - r.left, y = cy - r.top; for (let k = LBL.length - 1; k >= 0; k--){ const b = LBL[k]; if (x >= b.x0 - 3 && x <= b.x1 + 3 && y >= b.y0 - 3 && y <= b.y1 + 3) return b; } return null; }
function lblClick(cx, cy){
  const b = lblAt(cx, cy); if (!b || !world) return false;
  { const w = toWorld(cx, cy); if (unitAt(world, w.x, w.y, false)) return false; }   // 이름표 자리에 인물이 서 있으면 인물을 고름 (싸우는 중 잘못 누르지 않게)
  if (b.k === 'item'){ const it = (world.items || []).find(x => x.id === b.id); if (!it) return false; detItem = it.id; detItemSel = [...sel].join(','); hoverItem = null; hoverPid = null; if (MOB) openDet(true); else detShowPc(); renderDetail(); toast(`${it.label || it.name} — 상세 칸에서 누가 주울지 고르세요`); return true; }
  if (b.k === 'npc' && b.E){ const E = b.E, N = NPC[E.npc] || {}, nm = (E.known ? N.key : N.who) || '그 인물'; if (encDist(world, E) <= (N.talkR || 6)){ if (performance.now() - talkShutT >= 450) encTalk(E); } else toast(`${nm} — 더 가까이 가야 말을 걸 수 있어요 (💬 가 뜨면 이름표를 누름)`); return true; }
  return false;
}
// 땅의 물건 상세: 누가 주울지 (아군마다 · 지휘망으로)
function itemPickRow(Wd, it){
  if (!Wd || Wd.over || mode === 'edit' || !(it.k === 'weapon' || it.k === 'shield' || it.k === 'spear')) return '';
  const C = Wd.units.filter(u => u.side === 0 && u.alive && !u.gone && canTake(Wd, u, it.k === 'spear' ? { ...it, k: 'weapon' } : it)).sort((a, b) => Math.hypot(a.x - it.x, a.y - it.y) - Math.hypot(b.x - it.x, b.y - it.y)).slice(0, 6);
  if (!C.length) return '<span class="tr lb">지금 집어 들 수 있는 아군이 없음 (팔 · 두 손 무기 · 이미 방패)</span>';
  return `<div class="ipk">${C.map(u => `<button type="button" class="btn" data-ipick="${it.id}" data-u="${u.i}">✋ ${esc(u.name)} <small>${Math.hypot(u.x - it.x, u.y - it.y).toFixed(1)}칸</small></button>`).join('')}</div>`;
}
// 상세 칸 탭
function detTabsHtml(Wd, u, known){
  if (!known || !Wd || u.summon) return '';
  const n = (u.bag || []).length, cap = u.bagCap || bagCapOf(Wd, u);
  return `<div class="dtabs" role="tablist"><button type="button" class="${detTab !== 'eq' ? 'on' : ''}" data-dtab="info">정보</button><button type="button" class="${detTab === 'eq' ? 'on' : ''}" data-dtab="eq" title="장비 · 가방 (I)">🎒 장비 · 가방 <small>${n}/${cap}</small></button></div>`;
}
const EQ_SL = [['weapon', '무기'], ['shield', '방패'], ['몸', '몸'], ['머리', '머리']];
function eqSlotItem(Wd, u, sl){
  if (sl === 'weapon'){ if (u.noArms) return { k: 'none', label: '두 팔을 잃음' }; if (u.weaponGone) return { k: 'none', label: '맨손 (' + u.weapon + ' 놓침)' }; if (!u.weapon || ITEM_NATURAL.includes(u.weapon)) return { k: 'nat', label: u.weapon || '맨손' };
    return { k: 'weapon', name: u.weapon, label: u.wName || u.weapon, dur: u.wDur, own: u.wOwn, ammo: u.ammo, ammoMax: u.ammoMax, foreign: u.wForeign }; }
  if (sl === 'shield'){ if (u.armShield) return { k: 'arm', label: '팔 방패 (몸)' }; return u.shield ? { k: 'shield', name: '방패', label: u.sName || '방패', dur: u.sDur, own: u.sOwn } : null; }
  const g = (u.gear || {})[sl]; return g ? { k: sl === '몸' ? 'armor' : 'helm', ...g, label: g.name } : null;
}
const gearWU = (Wd, u) => gearW(u.gear, Wd.rules, { size: sizeOf(u), ref: ownKey(u) });
function eqDesc(Wd, it){
  const W0 = Wd.rules.weapons || {}, A = Wd.rules.armor || {};
  if (it.k === 'weapon'){ const w = W0[it.name] || {}; return [w.kind, w.rng != null ? '사거리 ' + w.rng + '칸' : '', w.two ? '두 손' : '', w.guard ? '막을 수 있음' : '', it.ammo != null ? '탄 ' + it.ammo : '', it.dur != null && it.dur < 100 ? '내구 ' + Math.round(it.dur) : '', it.own && it.own !== '' && it.foreign ? '남의 것 (살짝 서툶)' : ''].filter(Boolean).join(' · '); }
  if (it.k === 'shield') return ['방패 — 막기 · 방패 밀치기 · 방패 돌진', it.dur != null && it.dur < 100 ? '내구 ' + Math.round(it.dur) : ''].filter(Boolean).join(' · ');
  if (it.k === 'armor' || it.k === 'helm'){ const M = A[it.mat] || {}; return [it.mat + ' ' + (it.tier || 1) + '성', M.w ? '무게 −' + Math.round(M.w * (it.tier || 1) * 100) + '% 걸음' : '무게 없음', M.vs && M.vs['날붙이'] != null ? '베기 ×' + (1 - (1 - M.vs['날붙이']) * (it.tier || 1) / 3).toFixed(2) : '', it.size ? it.size + ' 몸' : '', it.dur != null && it.dur < 100 ? '내구 ' + Math.round(it.dur) : '', it.innate ? '갑피 (몸)' : ''].filter(Boolean).join(' · '); }
  if (it.k === 'ammo') return (it.at === '화살' ? '화살' : it.at + ' 탄') + ' ' + it.n + ' — 쓰는 무기에 저절로 채움';
  if (it.k === 'potion') return '회복약 — 마시면 최대 체력 × ' + Math.round((it.heal != null ? it.heal : (Wd.rules.potion || {}).heal || 0.3) * 100) + '% (1초)';
  return '';
}
const cmpEm = (v, t) => `<em class="${v > 0 ? 'up' : v < 0 ? 'dn' : 'eq'}">${v > 0 ? '▲' : v < 0 ? '▼' : '='} ${t}</em>`;
function eqCmp(Wd, u, it){
  const W0 = Wd.rules.weapons || {}, A = Wd.rules.armor || {};
  if (it.k === 'weapon'){ const cur = u.weaponGone || ITEM_NATURAL.includes(u.weapon || '') ? null : u.weapon, a = W0[cur || '맨손'] || {}, b = W0[it.name] || {};
    return `<span class="eqcmp">지금 ${esc(cur ? (u.wName || cur) : '맨손')} → ${esc(it.label || it.name)}${cmpEm(+((b.rng || 0) - (a.rng || 0)).toFixed(2), '리치')}${cur && it.dur != null && u.wDur != null ? cmpEm(Math.round(it.dur - u.wDur), '내구') : ''}${b.two && u.shield && !u.armShield ? ' <em class="dn">두 손 — 방패를 벗어야</em>' : ''}</span>`; }
  if (it.k === 'shield') return `<span class="eqcmp">${u.shield && !u.armShield ? '지금 방패 (내구 ' + Math.round(u.sDur) + ')' + cmpEm(Math.round((it.dur || 0) - u.sDur), '내구') : '방패 없음 → 막기 · 밀치기'}</span>`;
  if (it.k === 'armor' || it.k === 'helm'){ const sl = it.k === 'armor' ? '몸' : '머리', g = (u.gear || {})[sl], wv = x => x && A[x.mat] ? (A[x.mat].w || 0) * (x.innate ? 0 : (x.tier || 1)) : 0;
    return `<span class="eqcmp">지금 ${sl} ${g ? esc(g.name) + ' ' + g.tier + '성' : '비었음'}${cmpEm((it.tier || 0) - (g ? g.tier : 0), '등급')}${cmpEm(-Math.round((wv(it) - wv(g)) * 100), '걸음')}</span>`; }
  return '';
}
function eqTabHtml(Wd, u){
  const mine = u.side === 0 && u.alive && !u.gone && !Wd.over && mode !== 'edit', cap = u.bagCap || bagCapOf(Wd, u), bag = u.bag || [], E = u.eqRule || {}, pk = detPick && detPick.i === u.i ? detPick : null;
  const slots = EQ_SL.map(([sl, nm]) => { const it = eqSlotItem(Wd, u, sl), on = pk && pk.at === 'eq' && pk.slot === sl;
    return `<button type="button" class="eqs${on ? ' on' : ''}${!it || it.k === 'none' ? ' empty' : ''}" data-eqs="${sl}"><small>${nm}</small><span>${it ? (INV_IC[it.k] || (it.k === 'nat' ? '✊' : it.k === 'arm' ? '💪' : '·')) + ' ' + esc(it.label || it.name || '') : '<em>비었음</em>'}</span>${it && it.dur != null && it.k !== 'nat' && it.k !== 'none' ? durBar(it.dur) : ''}${it && it.innate ? '<i class="eqin">갑피</i>' : it && it.over ? '<i class="eqin">갑피 위</i>' : ''}</button>`; }).join('');
  const cells = [...Array(Math.max(cap, bag.length))].map((_, k) => { const it = bag[k]; if (!it) return '<i class="eqc empty"></i>'; const on = pk && pk.at === 'bag' && pk.uid === it.uid;
    return `<button type="button" class="eqc${on ? ' on' : ''}" data-eqb="${it.uid}" title="${esc(itName(it))}"><b>${INV_IC[it.k] || '·'}</b><small>${esc(itName(it))}</small>${it.k !== 'ammo' && it.k !== 'potion' && it.dur != null ? durBar(it.dur) : ''}</button>`; }).join('');
  const gw = gearWU(Wd, u), sum = `가방 ${bag.length}/${cap}칸${E.wmax ? ' · 무기 칸 ' + bagWpnN(u, Wd) + '/' + E.wmax + ' (두 손 2칸)' : ''}${E.body === false ? ' · 몸 갑옷 못 입음' : ''} · 걸음 ${(+u.spd).toFixed(2)}${gw > 0 ? ' (갑옷 −' + Math.round(gw * 100) + '%)' : ''}${u.act && u.act.k === 'invAct' ? ' · ⏳ ' + invOrdTxt({ op: u.act.op, slot: u.act.slot, to: u.act.b }, Wd) + ' 중' : u.act && u.act.k === 'bagSwap' ? ' · ⏳ 꺼내 드는 중' : ''}`;
  return `<div class="eqt"><div class="eqrow">${slots}</div><div class="eqsum">${sum}</div><div class="eqgrid">${cells}</div>${eqInfoHtml(Wd, u, pk, mine)}${mine ? eqNearHtml(Wd, u) : ''}</div>`;
}
function eqInfoHtml(Wd, u, pk, mine){
  if (!pk) return `<div class="eqinfo"><p class="empty">${mine ? '칸을 누르면 설명 · 지금 것과 비교 — 두 번 누르면 바로 들기 · 입기 · 마시기 (명령은 지휘망으로 · 입는 동안은 못 싸움)' : u.side === 0 ? '지금은 명령할 수 없음 — 보이는 그대로' : '보이는 만큼만 — 명령은 아군에게만'}</p></div>`;
  const it = pk.at === 'bag' ? (u.bag || []).find(x => x.uid === pk.uid) : eqSlotItem(Wd, u, pk.slot); if (!it) return '<div class="eqinfo"><p class="empty">없어진 물건</p></div>';
  const I = Wd.rules.inv || {}, T = I.gearT || {}, btn = [], full = (u.bag || []).length >= (u.bagCap || bagCapOf(Wd, u));
  if (mine && pk.at === 'bag'){
    if (it.k === 'weapon' || it.k === 'shield'){ const ok = canHold(Wd, u, it), why = ok ? '' : (wearWhy(Wd.rules, pOfU(u), it) || (u.noArms ? '두 팔을 잃음' : '지금은 들 수 없음')); btn.push(`<button type="button" class="btn go" data-eqa="swap" ${ok ? '' : 'disabled'}>들기 (${it.k === 'shield' ? (I.swap || 0.8) + (I.swapSh || 0.5) : I.swap || 0.8}초)</button>${why ? `<small class="why">${esc(why)}</small>` : ''}`); }
    if (it.k === 'armor' || it.k === 'helm'){ const why = wearWhyU(Wd, u, it); btn.push(`<button type="button" class="btn go" data-eqa="wear" ${why ? 'disabled' : ''}>입기 (${it.k === 'helm' ? T.helm || 1.5 : T.armor || 4}초 · 그동안 못 싸움)</button>${why ? `<small class="why">${esc(why)}</small>` : ''}`); }
    if (it.k === 'potion') btn.push(`<button type="button" class="btn go" data-eqa="swap" ${u.hp < u.max ? '' : 'disabled'}>마시기</button>`);
    for (const o of Wd.units.filter(o => o !== u && o.side === 0 && o.alive && !o.gone && !o.summon && Math.hypot(o.x - u.x, o.y - u.y) < 10).sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y)).slice(0, 5)){ const w = bagRoomU(Wd, o, it); btn.push(`<button type="button" class="btn" data-eqgive="${o.i}" ${w ? `disabled title="${esc(w)}"` : `title="다가가서 건넴 (${Math.hypot(o.x - u.x, o.y - u.y).toFixed(1)}칸)"`}>→ ${esc(o.name)}</button>`); }
    if (it.k === 'weapon' || it.k === 'shield') btn.push(`<button type="button" class="btn warn" data-eqa="drop">내려놓기</button>`);
  }
  if (mine && pk.at === 'eq'){
    if ((pk.slot === '몸' || pk.slot === '머리') && it.k !== 'none' && !it.innate) btn.push(`<button type="button" class="btn" data-eqa="off" ${full ? 'disabled' : ''}>벗기 (${pk.slot === '머리' ? T.helm || 1.5 : T.armor || 4}초 · 가방으로)</button>${full ? '<small class="why">가방이 가득</small>' : ''}`);
    if (pk.slot === 'shield' && it.k === 'shield') btn.push(`<button type="button" class="btn" data-eqa="off" ${full ? 'disabled' : ''}>방패 벗기 (가방으로)</button>${full ? '<small class="why">가방이 가득</small>' : ''}`);
    if (pk.slot === 'weapon') btn.push(`<small class="why">무기는 가방의 다른 무기를 골라 '들기' — 들던 무기는 가방으로</small>`);
    if (it.innate) btn.push(`<small class="why">갑피는 몸 — 더 단단한 것을 위에 입을 수 있음</small>`);
  }
  return `<div class="eqinfo"><div class="eqn"><b>${INV_IC[it.k] || ''} ${esc(it.label || it.name || '')}</b> <small>${esc(eqDesc(Wd, it))}</small></div>${pk.at === 'bag' ? eqCmp(Wd, u, it) : ''}${btn.length ? `<div class="eqbtns">${btn.join('')}</div>` : ''}</div>`;
}
function eqNearHtml(Wd, u){
  const N = (Wd.items || []).filter(it => (it.k === 'weapon' || it.k === 'shield' || (it.k === 'spear' && it.owner === u.i)) && Math.hypot(it.x - u.x, it.y - u.y) < 4.5 && canTake(Wd, u, it.k === 'spear' ? { ...it, k: 'weapon' } : it)).slice(0, 4);
  return N.length ? `<div class="eqnear">곁의 땅 ${N.map(it => `<button type="button" class="btn" data-eqpick="${it.id}">✋ ${esc(it.label || it.name)} <small>${Math.hypot(it.x - u.x, it.y - u.y).toFixed(1)}칸</small></button>`).join('')}</div>` : '';
}
const eqOrder = (u, o, msg) => { u.order = o; noteOrders([u]); detPick = null; toast(`${u.name} — ${msg}`); hud(); };
function eqAct(Wd, u, a){
  const pk = detPick; if (!pk || pk.i !== u.i) return; const it = pk.at === 'bag' ? (u.bag || []).find(x => x.uid === pk.uid) : null, nm = it ? itName(it) : '';
  if (a === 'swap' && it) return eqOrder(u, { k: 'swap', uid: it.uid }, it.k === 'potion' ? nm + ' 마심' : nm + ' 꺼내 듦');
  if (a === 'wear' && it) return eqOrder(u, { k: 'inv', op: 'wear', uid: it.uid }, nm + ' 입기 (그동안 못 싸움 · 휘청이면 끊김)');
  if (a === 'drop' && it) return eqOrder(u, { k: 'inv', op: 'drop', uid: it.uid }, nm + ' 발밑에 내려놓음');
  if (a === 'off' && pk.at === 'eq') return eqOrder(u, { k: 'inv', op: 'off', slot: pk.slot }, (pk.slot === 'shield' ? '방패' : pk.slot === '머리' ? '투구' : '갑옷') + ' 벗기 (가방으로)');
}
function eqQuick(Wd, u, uid){   // 두 번 누름 = 바로
  const it = (u.bag || []).find(x => x.uid === uid); if (!it || !(u.side === 0 && u.alive && !Wd.over && mode !== 'edit')) return;
  detPick = { i: u.i, at: 'bag', uid };
  if ((it.k === 'weapon' || it.k === 'shield') && canHold(Wd, u, it)) return eqAct(Wd, u, 'swap');
  if ((it.k === 'armor' || it.k === 'helm') && !wearWhyU(Wd, u, it)) return eqAct(Wd, u, 'wear');
  if (it.k === 'potion' && u.hp < u.max) return eqAct(Wd, u, 'swap');
  renderDetail();
}
// 상세 칸을 누르고 있는 동안은 다시 그리지 않음 — 싸우는 중 거리 · 피가 바뀌어 칸이 새로 그려지면 누른 단추가 사라져 누름이 먹히지 않던 것
$('det').addEventListener('pointerdown', () => { detHold = performance.now(); });   // 창 밖에서 손을 떼도 1.5초 뒤엔 다시 그림
for (const ev of ['pointerup', 'pointercancel']) window.addEventListener(ev, () => { if (detHold){ detHold = 0; setTimeout(renderDetail, 0); } }, true);
$('det').addEventListener('click', e => {
  const t = e.target.closest('[data-dtab]'); if (t){ detTab = t.dataset.dtab; detPick = null; renderDetail(); return; }
  const Wd = world; if (!Wd) return;
  const ip = e.target.closest('[data-ipick]'); if (ip){ const u = Wd.units[+ip.dataset.u], it = (Wd.items || []).find(x => x.id === +ip.dataset.ipick); if (u && it && u.alive && !Wd.over){ u.order = { k: 'pick', id: it.id }; noteOrders([u]); toast(`${u.name} → ${it.label || it.name} 주우러`); detItem = null; hud(); } return; }
  const u = detShownU != null ? Wd.units[detShownU] : null; if (!u) return;
  const s = e.target.closest('[data-eqs]'); if (s){ const sl = s.dataset.eqs; detPick = detPick && detPick.i === u.i && detPick.at === 'eq' && detPick.slot === sl ? null : { i: u.i, at: 'eq', slot: sl }; renderDetail(); return; }
  const c = e.target.closest('[data-eqb]'); if (c){ const uid = +c.dataset.eqb, now = performance.now(), dbl = eqTapT && eqTapT.uid === uid && eqTapT.i === u.i && now - eqTapT.t < 480; eqTapT = { uid, i: u.i, t: now };
    if (dbl){ eqTapT = null; eqQuick(Wd, u, uid); return; } detPick = { i: u.i, at: 'bag', uid }; renderDetail(); return; }
  const a = e.target.closest('[data-eqa]'); if (a && !a.disabled){ eqAct(Wd, u, a.dataset.eqa); return; }
  const g = e.target.closest('[data-eqgive]'); if (g && !g.disabled && detPick && detPick.at === 'bag'){ const r = Wd.units[+g.dataset.eqgive], it = (u.bag || []).find(x => x.uid === detPick.uid); if (r && it) eqOrder(u, { k: 'inv', op: 'give', uid: it.uid, to: r.i }, `${itName(it)} → ${r.name}에게 건네러`); return; }
  const pb = e.target.closest('[data-eqpick]'); if (pb){ const it = (Wd.items || []).find(x => x.id === +pb.dataset.eqpick); if (it && !Wd.over) eqOrder(u, { k: 'pick', id: it.id }, `${it.label || it.name} 주우러`); return; }
});
// 전리품: 출처 열쇠로 찾기 · 맵 위의 몸 · 끼울 수 있나 · 지금 장비와 비교
function lootFind(Wd, key){ const L = lootOf(Wd); if (typeof key === 'number') return L[key] || null; return L.find(x => x.lk === key) || (/^\d+$/.test(String(key)) ? L[+key] || null : null); }
function lootLiveU(Wd, p){ return Wd && !Wd.over && Wd === world ? Wd.units.find(u => u.pid === p.id && u.alive && !u.gone && u.side === 0) || null : null; }
function lootToLive(Wd, it, u){ const { taken, auto, lk, ground, fall, worn, n0, ...o } = it;
  if (it.ground != null && it.k === 'weapon'){ const ga = lootOf(Wd).find(x => x.lk === 'ga' + it.ground); if (ga && !ga.taken && ga.n > 0){ o.ammo = (o.ammo || 0) + ga.n; ga.taken = u.name + ' (무기에 든 채)'; } }   // 무기에 남은 화살 · 탄은 무기와 함께 (땅의 무기가 사라지며 같이 없어지지 않게)
  u.bag.push({ ...o, uid: (Wd.bagN = (Wd.bagN || 10000) + 1) }); if (it.ground != null) Wd.items = Wd.items.filter(x => x.id !== it.ground); return u.bag[u.bag.length - 1]; }
function lootGiveLive(Wd, it, p){
  const u = lootLiveU(Wd, p); if (!u) return false;
  if (it.k === 'ammo'){ const st = stackOf(it.at), cap = bagCapOf(Wd, u), n0 = it.n; let n = it.n; for (const x of u.bag) if (x.k === 'ammo' && x.at === it.at && x.n < st && n > 0){ const m = Math.min(n, st - x.n); x.n += m; n -= m; }
    while (n > 0 && u.bag.length < cap){ const m = Math.min(n, st); u.bag.push({ k: 'ammo', at: it.at, n: m, uid: (Wd.bagN = (Wd.bagN || 10000) + 1) }); n -= m; }
    if (n === n0){ toast(`${p.name}: 가방이 가득`); return true; } const gw = it.lk && /^ga/.test(it.lk) ? (Wd.items || []).find(x => 'ga' + x.id === it.lk) : null; if (gw) gw.ammo = n;
    if (n > 0){ it.n = n; toast(`${p.name} 가방에 ${n0 - n} — ${n} 남음`); } else { it.taken = p.name; toast(`${itName(it)} → ${p.name}의 가방`); } save(); return true; }
  const why = bagRoomU(Wd, u, it); if (why){ toast(`${p.name}: ${why}`); return true; }
  lootToLive(Wd, it, u); it.taken = p.name; toast(`${itName(it)} → ${p.name}의 가방 (지금 지님)`); save(); return true;
}
function lootWearWhy(p, it){
  if (!p || !['weapon', 'shield', 'armor', 'helm'].includes(it.k)) return '끼울 수 없음';
  const live = lootLiveU(world, p); if (live){ const r = bagRoomU(world, live, it); if (r) return r; if (it.k === 'armor' || it.k === 'helm') return wearWhyU(world, live, it); return canHold(world, live, it) ? '' : (wearWhy(rules, pOfU(live), it) || '지금은 들 수 없음'); }
  const why = wearWhy(rules, p, it); if (why) return why;
  const hasOld = it.k === 'weapon' ? p.weapon && !ITEM_NATURAL.includes(p.weapon) : it.k === 'shield' ? false : !!(p.gear || {})[it.k === 'armor' ? '몸' : '머리'];
  if (hasOld && (p.bag || []).length >= bagCapP(rules, p)) return '가방이 가득 (벗은 것 둘 곳)';
  return '';
}
function lootWear(Wd, key, pid){
  const it = lootFind(Wd, key), p = S.units.find(x => String(x.id) === String(pid)); if (!it || !p || it.taken) return;
  const why = lootWearWhy(p, it); if (why){ toast(`${p.name}: ${why}`); return; }
  const live = lootLiveU(Wd, p);
  if (live){ const nu = lootToLive(Wd, it, live); live.order = it.k === 'armor' || it.k === 'helm' ? { k: 'inv', op: 'wear', uid: nu.uid } : { k: 'swap', uid: nu.uid }; noteOrders([live]); it.taken = p.name; toast(`${itName(it)} → ${p.name} — 끼우는 중 (명령 · ${it.k === 'armor' ? '4초' : it.k === 'helm' ? '1.5초' : '잠깐'})`); save(); return; }
  const { taken, auto, lk, ground, fall, worn, n0, ...o } = it, old = putOn(p, o); if (old) (p.bag = p.bag || []).push(old);
  it.taken = p.name; toast(`${p.name} — ${itName(it)} 끼움${old ? ' (' + itName(old) + ' 는 가방에)' : ''}`); save();
}
function lootCmpHtml(p, it){
  if (!p || it.k === 'ammo' || it.k === 'potion') return '';
  const W0 = rules.weapons || {}, A = rules.armor || {};
  if (it.k === 'weapon'){ const cur = p.weapon && !ITEM_NATURAL.includes(p.weapon) ? p.weapon : null, a = W0[cur || p.weapon || '맨손'] || {}, b = W0[it.name] || {};
    return `<span class="lcmp">${esc(p.name)}: ${esc(cur ? (p.wName || cur) : p.weapon || '맨손')} → ${esc(it.name)}${b.two ? ' (두 손)' : ''}${cmpEm(+((b.rng || 0) - (a.rng || 0)).toFixed(2), '리치')}${cur && it.dur != null ? cmpEm(Math.round(it.dur - (p.wDur != null ? p.wDur : 100)), '내구') : ''}</span>`; }
  if (it.k === 'shield') return `<span class="lcmp">${esc(p.name)}: ${p.shield ? '방패 (내구 ' + Math.round(p.sDur != null ? p.sDur : 100) + ')' + cmpEm(Math.round((it.dur || 0) - (p.sDur != null ? p.sDur : 100)), '내구') : '방패 없음 → 막기 · 밀치기'}</span>`;
  const sl = it.k === 'armor' ? '몸' : '머리', g = (p.gear || {})[sl], wv = x => x && A[x.mat] ? (A[x.mat].w || 0) * (x.tier || 1) : 0;
  return `<span class="lcmp">${esc(p.name)} ${sl}: ${g ? esc(g.name) + ' ' + g.tier + '성' : '비었음'}${cmpEm((it.tier || 0) - (g ? g.tier : 0), '등급')}${cmpEm(-Math.round((wv(it) - wv(g)) * 100), '걸음')}</span>`;
}
// J11 나가기 전 남은 전리품을 한 번
const lootLeft = Wd => lootOf(Wd).filter(x => !x.taken && !(x.k === 'ammo' && !(x.n > 0)));
function lootBanner(Wd, exit, dir){
  const bn = $('banner'); bn.className = 'banner win'; lootPL = null; const left = lootLeft(Wd).length;
  bn.innerHTML = `<b>${exit ? '나가기 전에 — 전리품 ' + left : '끝난 맵 — 전리품'}</b><span>${exit ? '챙기지 않은 것은 이 맵에 두고 감 · ' : ''}고른 동료의 가방으로 (판의 몸에 바로 지님) · 끼우기 · 지금 장비와 비교</span><div class="loot" id="lootBox">${lootCards(Wd, lootParty())}</div><p class="lnone">싸우는 중에도 아군 상세 칸의 🎒 장비 · 가방 (I) 에서 갈아입기 · 건네기</p><div class="row">${exit ? '<button class="btn go" type="button" id="lootGo">▶ 이대로 나가기</button>' : ''}<button class="btn" type="button" id="lootClose">닫기</button></div>`;
  bn.hidden = false; $('lootClose').onclick = () => { bn.hidden = true; };
  if (exit) $('lootGo').onclick = () => { bn.hidden = true; exitTap = null; const q = $('campBar').querySelector(`[data-cexit="${dir}"]`); if (q) q.click(); };   // 서두르지 않고 나감
}
function exitLootOK(b){
  { const bn = $('banner'); if (!bn.hidden && $('lootGo')) bn.hidden = true; }   // 창이 뜬 채 출구 단추를 다시 누르면 창을 닫고 나감 (두 번 = 서둘러)
  const Wd = world; if (!Wd || Wd.lootSeen || !Wd.cleared) return true;   // 끝난 맵만 — 싸우는 중 물러남은 그대로
  Wd.lootSeen = true; if (!lootLeft(Wd).length) return true;
  exitTap = { dir: b.dataset.cexit, t: performance.now() };   // 창이 뜬 뒤 곧 한 번 더 누르면 서둘러 (두 번 = 서둘러 그대로)
  lootBanner(Wd, true, b.dataset.cexit); return false;
}
'''
rep("\n/* ---------- 턴 진행 ---------- */\nlet lastTs = 0, cont = false;", "\n" + EQ_JS + "\n/* ---------- 턴 진행 ---------- */\nlet lastTs = 0, cont = false;")
