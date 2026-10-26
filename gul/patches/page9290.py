# v9.9.6 페이지 — page9290.py v1.0 (v1.0: ① 횃불은 꺼진 채 시작 (켜려면 T) ② 판 아래 막대에 관계 단추 — 🤝 전우조 · 🎖 대장 · 🛡 보호 · ✂ 풀기 (오른쪽 칸에 가지 않아도) · 휴대폰 막대에도 ✂ 풀기 ③ 풀기 바로잡기 — 대장을 골라 풀면 그 부하들도 · 지켜지는 이를 골라 풀면 지키던 이도 풀림 (예전엔 고른 이의 위쪽 관계만) · 무엇을 풀었는지 이름으로 알림 · 대장 연결 중 '지금 대장' 을 다시 누르면 풀림 (안내 글 '인주를 누르면 풀려요' 는 v9.9.0 부터 틀렸던 것 — 인주도 대장이 됨) ④ 판에서 관계가 잘 보이게 — 대장 선 굵게 · 보호 선 (청록 점선 + 🛡) 새로 · 고른 이와 관계된 이의 머리 위에 짧은 이름표 (대장 · 부하 · 전우 · 지킬 이 · 지켜 줌 — 겹치면 위로 쌓음) ⑤ 보호도 저장해 다음 판에 이어짐 · 인주가 낀 대장 관계도 이어짐 (엔진 patch9250))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9280.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.9.5 (2026-10-25)', '<!-- 굴의 전투판 v9.9.6 (2026-10-26)')
rep('     v9.9.5: 뭉침 = 태세', '''     v9.9.6: 횃불은 꺼진 채 시작 · 판 아래 막대에 관계 단추 (전우조 · 대장 · 보호 · 풀기) · 대장을 골라 풀면 부하도 풀림 · 관계 선 이름표 · 보호 선
     v9.9.5: 뭉침 = 태세''')
for a, b in (('h1::after{content:" v9.9.5"', 'h1::after{content:" v9.9.6"'), ('<footer>굴의 전투판 v9.9.5', '<footer>굴의 전투판 v9.9.6'), ('return `굴의 전투판 v9.9.5 · ${title}', 'return `굴의 전투판 v9.9.6 · ${title}'),
             ("copyText('굴의 전투판 v9.9.5 자동 판 기록", "copyText('굴의 전투판 v9.9.6 자동 판 기록"), ("o.push(`굴의 전투판 v9.9.5 — ${C.run", "o.push(`굴의 전투판 v9.9.6 — ${C.run"),
             ('의 버전 기록에 — v9.9.5 뭉침 = 태세', '의 버전 기록에 — v9.9.6 관계 단추 · 풀기 / v9.9.5 뭉침 = 태세'),
             ('">v9.9.5 뭉침 = 태세 (선 긋기)', '">v9.9.6 판 아래 관계 단추 · 풀기 쉽게 · 횃불 꺼진 채 시작 · v9.9.5 뭉침 = 태세 (선 긋기)'),
             ("ver: '9.9.5', kind:", "ver: '9.9.6', kind:"), ("RULES_MIG = '9.9.5',", "RULES_MIG = '9.9.6',")):
    rep(a, b)
# ① 횃불은 꺼진 채 시작
rep("function applyOpeners(Wd){\n", "function applyOpeners(Wd){\n  for (const u of Wd.units) if (u.side === 0 && u.torch && !u.torchOff){ u.torchOff = true; } computeLight(Wd);   /* v9.9.6 횃불은 꺼진 채 시작 (켜려면 T) */\n")
# ② 판 아래 막대: 보호 · 풀기
rep("""<span class="sb">${relPick === 'chief' ? '대장 누르기' : '연결'}</span></button>` : '';""",
    """<span class="sb">${relPick === 'chief' ? '대장 누르기' : '연결'}</span></button><button type="button" class="sk cmd rel ${relPick === 'prot' ? 'on' : ''}" data-cmd="prot" title="보호 — 고른 아군이 지킬 아군을 눌러요. 평소엔 자유롭게 싸우다 그 아군이 노려지면 사이로 들어가 막아요 (같은 대상을 다시 누르면 풀림)"><span class="ic">🛡</span><span class="nm">보호</span><span class="sb">${relPick === 'prot' ? '지킬 이 누르기' : L.some(u => u.protOf != null) ? '지킴' : '연결'}</span></button>${relCount(Wd, L) ? `<button type="button" class="sk cmd rel" data-cmd="relcut" title="관계 풀기 — 고른 아군의 전우조 · 대장 · 보호를 모두 풂 (대장을 고르면 그 부하들도 · 지켜지는 이를 고르면 지키던 이도)"><span class="ic">✂</span><span class="nm">풀기</span><span class="sb">${relCount(Wd, L)}개</span></button>` : ''}` : '';   /* v9.9.6 관계 단추를 판 아래에 */""")
# 휴대폰 막대: 풀기
rep("""      + (L.length ? `<button type="button" class="db ${relPick === 'prot' ? 'on' : ''}" data-dk="prot">""", """      + (L.length && relCount(Wd, L) ? `<button type="button" class="db" data-dk="relcut"><span class="ic">✂</span>풀기<small>관계 ${relCount(Wd, L)}</small></button>` : '')   /* v9.9.6 */
      + (L.length ? `<button type="button" class="db ${relPick === 'prot' ? 'on' : ''}" data-dk="prot">""")
rep("  if (k === 'mate' || k === 'chief' || k === 'prot'){ relKey(k); return; }   // v9.1", "  if (k === 'mate' || k === 'chief' || k === 'prot' || k === 'relcut'){ relKey(k); return; }   // v9.1")
# ③ 풀기: 대장의 부하 · 지키던 이까지
rep("const relNames = L => L.map(u => u.name).join(' · ');", """const relNames = L => L.map(u => u.name).join(' · ');
// v9.9.6 고른 이에게 걸린 관계 (전우 · 대장 · 부하 · 보호 · 보호받음) 수
const relCount = (Wd, L) => !Wd ? 0 : L.reduce((n, u) => n + (u.cg && matesOf(Wd, u).length ? 1 : 0) + (u.chiefLk ? 1 : 0) + (u.protOf != null ? 1 : 0) + Wd.units.filter(m => m.alive && m.side === u.side && ((m.chiefLk && m.sqLead === u.i) || m.protOf === u.i) && !L.includes(m)).length, 0);""")
rep("""  if (k === 'relcut'){ const n = cgLeave(W, L) + chiefClear(W, L) + L.filter(u => u.protOf != null).length; L.forEach(u => { u.protOf = null; }); relPick = null; relSave(); toast(n ? `✂ ${relNames(L)} — 전우조 · 대장 관계를 풀었어요` : '풀 관계가 없어요'); hud(); return; }""",
    """  if (k === 'relcut'){ const said = [];   /* v9.9.6 대장을 고르면 그 부하도 · 지켜지는 이를 고르면 지키던 이도 */
    const ms = L.filter(u => u.cg && matesOf(W, u).length); if (ms.length) said.push('전우조 ' + relNames(ms));
    const up = L.filter(u => u.chiefLk); if (up.length) said.push('대장 (' + relNames(up) + ')');
    const fl = W.units.filter(m => m.alive && m.chiefLk && L.includes(W.units[m.sqLead]) && !L.includes(m)); if (fl.length) said.push('부하 ' + relNames(fl));
    const pr = L.filter(u => u.protOf != null), pb = W.units.filter(m => m.alive && m.protOf != null && L.includes(W.units[m.protOf]) && !L.includes(m)); if (pr.length || pb.length) said.push('보호 ' + relNames([...pr, ...pb]));
    cgLeave(W, L); chiefClear(W, [...L, ...fl]); [...pr, ...pb].forEach(u => { u.protOf = null; }); relPick = null; relSave();
    toast(said.length ? `✂ 풀었어요 — ${said.join(' · ')}` : '풀 관계가 없어요'); hud(); return; }""")
rep("(인주를 누르면 풀려요 · Esc 취소)` : '연결을 취소했어요'); hud(); return; }", "(지금 대장을 다시 누르면 풀려요 · 다 풀려면 ✂ 풀기 · Esc 취소)` : '연결을 취소했어요'); hud(); return; }")
rep("`🎖 ${relNames(base)} — 대장 관계를 풀었어요 (인주를 따름)`", "`🎖 ${relNames(base)} — ${U.name}의 부하에서 풀렸어요 (다시 인주를 따름)`")
# ④ 판의 관계 선: 대장 선 굵게 · 보호 선 · 고른 이의 관계 이름표
rep("ctx.setLineDash([Math.max(4, ts * 0.22), Math.max(3, ts * 0.14)]); ctx.strokeStyle = 'rgba(255,214,110,.82)'; ctx.lineWidth = Math.max(1.5, ts * 0.06);",
    "ctx.setLineDash([Math.max(5, ts * 0.26), Math.max(3, ts * 0.14)]); ctx.strokeStyle = 'rgba(255,214,110,.9)'; ctx.lineWidth = Math.max(2.5, ts * 0.09);   /* v9.9.6 굵게 */")
rep("""  for (const C of crowned){ ctx.fillStyle = '#ffd66e'; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 2; ctx.strokeText('♛', ox + C.x * ts, oy + C.y * ts - ts * 0.95); ctx.fillText('♛', ox + C.x * ts, oy + C.y * ts - ts * 0.95); }
  ctx.restore();
}""", """  for (const C of crowned){ ctx.fillStyle = '#ffd66e'; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 2; ctx.strokeText('♛', ox + C.x * ts, oy + C.y * ts - ts * 0.95); ctx.fillText('♛', ox + C.x * ts, oy + C.y * ts - ts * 0.95); }
  // v9.9.6 보호 선 (청록 점선 · 지켜지는 이 쪽에 🛡) · 고른 이의 관계 선엔 이름표
  for (const u of al){ if (u.protOf == null) continue; const P = Wd.units[u.protOf]; if (!P || !P.alive || P === u || (live && hidA(Wd, P))) continue;
    const x1 = ox + u.x * ts, y1 = oy + u.y * ts, x2 = ox + P.x * ts, y2 = oy + P.y * ts; ctx.setLineDash([Math.max(2, ts * 0.08), Math.max(3, ts * 0.12)]); ctx.strokeStyle = 'rgba(90,220,210,.85)'; ctx.lineWidth = Math.max(2, ts * 0.07); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.setLineDash([]); ctx.font = `${Math.max(10, ts * 0.36)}px sans-serif`; ctx.fillText('🛡', x1 + (x2 - x1) * 0.75, y1 + (y2 - y1) * 0.75); }
  if (!live || sel.size <= 3){ const used = [], tag = (a, b, t, c) => { const x = ox + b.x * ts; let y = oy + (b.y - b.r) * ts - 22; ctx.font = '700 11px IBM Plex Sans KR, sans-serif'; const w = ctx.measureText(t).width + 10;   /* 관계된 이의 머리 위에 짧게 · 겹치면 위로 쌓음 */
      for (let k = 0; k < 6 && used.some(q => Math.abs(q.x - x) < (q.w + w) / 2 && Math.abs(q.y - y) < 16); k++) y -= 17; used.push({ x, y, w }); ctx.fillStyle = 'rgba(12,10,14,.85)'; ctx.fillRect(x - w / 2, y - 8, w, 16); ctx.strokeStyle = c; ctx.lineWidth = 1.2; ctx.strokeRect(x - w / 2 + 0.5, y - 7.5, w - 1, 15); ctx.fillStyle = c; ctx.fillText(t, x, y + 0.5); };
    ctx.setLineDash([]); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const u of al){ if (!sel.has(u.i)) continue;
      const C = u.chiefLk && u.sqLead != null ? Wd.units[u.sqLead] : null; if (C && C.alive) tag(u, C, '대장', '#ffd66e');
      for (const m of al) if (m.chiefLk && m.sqLead === u.i) tag(u, m, '부하', '#ffd66e');
      for (const m of (u.cg ? al.filter(m => m !== u && m.cg === u.cg) : [])) tag(u, m, '전우', '#9cc4ff');
      const P = u.protOf != null ? Wd.units[u.protOf] : null; if (P && P.alive) tag(u, P, '지킬 이', '#7fe6dc');
      for (const m of al) if (m.protOf === u.i) tag(u, m, '지켜 줌', '#7fe6dc'); } }
  ctx.restore();
}""")
rep("base.forEach(u => { u.protOf = on ? U.i : null; }); toast(", "base.forEach(u => { u.protOf = on ? U.i : null; }); relSave(); toast(")   # 보호도 저장 (다음 판에 이어짐)
open(F, 'w', encoding='utf-8').write(s)
print('page9290 OK')
