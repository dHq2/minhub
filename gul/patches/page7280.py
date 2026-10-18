# v7.28.0 페이지 — page7280.py v1.1 (v1.1: 대화 · 로딩 중에 난 큰 사건 (세자르 기상 · 보스 쓰러짐 · 착지) 은 대화가 닫힌 뒤 다가감 · v1.0: 연출: 카메라 감독 · 보스 치명타 · 가벼운 진동 — 로그 사건만 읽어 그림, 엔진 · 판정은 그대로 /
#   카메라: 따라가는 자리에 가까운 싸움 쪽으로 살짝 당겨 담음 · 큰 사건 (도약 강타를 뛸 때 · 세자르의 큰 기술 · 세자르 기상 · 보스가 쓰러짐) 에 잠깐 다가감 (확대 1.1 ~ 1.25) ·
#   확대 · 축소 · 집기를 하면 4초 동안 다가가지 않음 · 판을 끌면 따라감이 꺼짐 (예전과 같음) /
#   보스 치명타: 맞은 자리에 빛살 · '치명타!' · 멈칫 (히트스톱) · 보스가 아군을 치면 붉은 테두리 · 휴대폰 진동 / 보스가 쓰러지면 느린 순간 · 흰 번쩍임 /
#   진동: 도약 강타 착지 (먼지 고리) · 거구의 내려치기 · 공중제비 내려찍기 · 짓밟기 · 팜 버스트 · 세자르 하늘 가르기 · 마구 베기 끝 / 켜고 끄기: 🎥 연출 · 📳 흔들림 (PC 줄 · 휴대폰 더 보기) · 📳 진동 (휴대폰))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7270.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.27.0 (2026-10-18)', '<!-- 굴의 전투판 v7.28.0 (2026-10-18)')
rep('     v7.27.0: ', '''     v7.28.0: 연출 — 카메라가 싸움을 담고 큰 사건에 잠깐 다가감 (도약 강타 · 세자르의 큰 기술 · 세자르 기상 · 보스가 쓰러짐). 손으로 확대 · 축소하면 4초 쉼.
         보스 치명타: 빛살 · '치명타!' · 멈칫 · 보스에게 맞으면 붉은 테두리. 보스가 쓰러지면 느린 순간. 거구가 내려찍으면 화면이 살짝 흔들림 (도약 강타는 먼지 고리 · 휴대폰 진동).
         켜고 끄기: 🎥 연출 · 📳 흔들림 · 휴대폰 진동.
     v7.27.0: ''')
rep('h1::after{content:" v7.27.0"', 'h1::after{content:" v7.28.0"')
rep('<footer>굴의 전투판 v7.27.0', '<footer>굴의 전투판 v7.28.0')
rep('return `굴의 전투판 v7.27.0 · ${title}', 'return `굴의 전투판 v7.28.0 · ${title}')
rep("copyText('굴의 전투판 v7.27.0 자동 판 기록", "copyText('굴의 전투판 v7.28.0 자동 판 기록")
rep("ver: '7.27.0', kind: '1F 여정 기록'", "ver: '7.28.0', kind: '1F 여정 기록'")
rep("o.push('굴의 전투판 v7.27.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v7.28.0 — 1F 프롤로그 여정 기록'")
rep('의 버전 기록에 — v7.27.0 레지나 인카운터 · 세자르 알현실 그림 · 새 대화 그림 /', '의 버전 기록에 — v7.28.0 연출 (카메라 · 치명타 · 진동) / v7.27.0 레지나 인카운터 · 세자르 알현실 그림 · 새 대화 그림 /')
rep('">v7.27.0 · 레지나 · 세자르 알현실</span>', '">v7.28.0 · 연출</span>')

# ---------- 상태 (그리기 전에 있어야 함) ----------
rep("const cam = { x: 0, y: 0, z: 1.25, follow: true };\n",
"""const cam = { x: 0, y: 0, z: 1.25, follow: true };
/* v7.28.0 연출 상태: 카메라 감독 (CD — 다가감 · 확대 배율) · 화면 흔들림 (SHK) · 멈칫 · 느린 순간 (FXT) · 그림 효과 (FXV — 화면 시간 ms) */
const FXR = { bias: 0.36, biasR: 10, edge: 0.32, quietMs: 4000, gap: 2200, critGap: 0.35, txtGap: 0.5, giantGap: 0.4 };   // bias = 가까운 적 쪽으로 당기는 몫 · biasR 칸 안의 적만 · edge = 화면 반의 몫까지만
const CD = { shot: null, pend: null, zk: 1, zSet: null, base: null, quietUntil: 0, lastShot: -1e9 }, SHK = { a: 0, t0: 0, dur: 0 }, FXT = { until: 0, k: 1 }, FXV = [], FXL = { crit: -9, txt: -9, giant: -9 };
const FX_RM = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();   // 움직임 줄이기를 켠 기기는 흔들림이 처음부터 꺼짐
const fxOn = k => { const v = (S.fx || {})[k]; return v == null ? !(k === 'shake' && FX_RM) : !!v; };
""")

# ---------- 그리기: 흔들림 · 효과 ----------
rep("  const ox = w / 2 - cam.x * ts, oy = h / 2 - cam.y * ts;\n  // 맵 (보이는 부분만)",
    "  const SK = fxShakeOff(), ox = w / 2 - cam.x * ts + SK.x, oy = h / 2 - cam.y * ts + SK.y;   /* v7.28.0 화면 흔들림 */\n  // 맵 (보이는 부분만)")
rep("  if (boxSel){ const x = Math.min(boxSel.x0, boxSel.x1)",
    "  if (FXV.length) drawFxv(ox, oy, ts, w, h);   /* v7.28.0 치명타 빛살 · 글 · 먼지 고리 · 테두리 · 번쩍임 */\n  if (boxSel){ const x = Math.min(boxSel.x0, boxSel.x1)")

# ---------- 흐름: 멈칫 · 사건 읽기 · 카메라 ----------
rep("    let budget = dt * speed * (slowNow() ? FOCUS_SLOW : 1);   // v5.9.0 모바일: 꾹 누름 · 기술이 켜진 동안 진짜 슬로우",
    "    let budget = dt * speed * (slowNow() ? FOCUS_SLOW : 1) * fxTimeK();   // v5.9.0 모바일: 꾹 누름 · 기술이 켜진 동안 진짜 슬로우   /* v7.28.0 멈칫 · 느린 순간 */")
rep("  if (Wd && mode !== 'edit') czCutTick(Wd);   /* v7.23.2 세자르 컷인 · 권위 알림 */\n",
    "  if (Wd && mode !== 'edit') czCutTick(Wd);   /* v7.23.2 세자르 컷인 · 권위 알림 */\n  if (Wd && mode !== 'edit') fxTick(Wd);   /* v7.28.0 연출 (로그 사건) */\n")
rep("  if (MOB && Wd && mode !== 'edit') mobFollow(Wd, dt);   // v5.8 모바일: 가까이 볼 때 아군 (고른 아군) 을 따라감\n"
    "  if (Wd && cam.follow && mode !== 'edit' && !small() && !MOB){ const h = Wd.units.find(u => u.torch && u.alive && u.side === 0) || Wd.units.find(u => u.side === 0 && u.alive); if (h){ const k = 1 - Math.pow(0.002, dt); cam.x += (h.x - cam.x) * k; cam.y += (h.y - cam.y) * k; } }\n",
    "  if (Wd && mode !== 'edit') camZoomTick(dt);   /* v7.28.0 다가감 (확대 배율) */\n"
    "  if (MOB && Wd && mode !== 'edit') mobFollow(Wd, dt);   // v5.8 모바일: 가까이 볼 때 아군 (고른 아군) 을 따라감\n"
    "  if (Wd && cam.follow && mode !== 'edit' && !small() && !MOB){ const h = Wd.units.find(u => u.torch && u.alive && u.side === 0) || Wd.units.find(u => u.side === 0 && u.alive); if (h){ const a = fxOn('cam') ? camAim(Wd, h.x, h.y) : h, k = 1 - Math.pow(CD.shot && fxOn('cam') ? 0.0006 : 0.002, dt); cam.x += (a.x - cam.x) * k; cam.y += (a.y - cam.y) * k; } }   /* v7.28.0 싸움 쪽으로 살짝 · 큰 사건에 다가감 */\n")
rep("  const tx = G.reduce((a, u) => a + u.x, 0) / G.length, ty = G.reduce((a, u) => a + u.y, 0) / G.length, ts = TS * cam.z, hw = cv.clientWidth / 2 / ts, hh = cv.clientHeight / 2 / ts;\n",
    "  let tx = G.reduce((a, u) => a + u.x, 0) / G.length, ty = G.reduce((a, u) => a + u.y, 0) / G.length; const ts = TS * cam.z, hw = cv.clientWidth / 2 / ts, hh = cv.clientHeight / 2 / ts;\n"
    "  if (fxOn('cam') && !zoomAll){ const a = camAim(Wd, tx, ty); tx = a.x; ty = a.y; }   /* v7.28.0 싸움 쪽으로 살짝 · 큰 사건에 다가감 */\n")
rep("  const k = 1 - Math.pow(0.004, dt); cam.x += (cx - cam.x) * k; cam.y += (cy - cam.y) * k;\n}",
    "  const k = 1 - Math.pow(CD.shot && fxOn('cam') ? 0.0008 : 0.004, dt); cam.x += (cx - cam.x) * k; cam.y += (cy - cam.y) * k;\n}")

# ---------- 손으로 확대 · 축소 · 집기 = 다가감을 멈추고 4초 쉼 ----------
rep("function zoom(k){ cam.z = Math.min(4, Math.max(0.45, cam.z * k)); }", "function zoom(k){ camUser(); cam.z = Math.min(4, Math.max(0.45, cam.z * k)); }")
rep("pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: cam.z, w0: toWorld(mx, my) }; cam.follow = false; return; }",
    "camUser(); pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: cam.z, w0: toWorld(mx, my) }; cam.follow = false; return; }")
rep("  const ts = TS * cam.z; cam.x = pd.cx - (e.clientX - pd.x) / ts; cam.y = pd.cy - (e.clientY - pd.y) / ts; cam.follow = false;",
    "  if (CD.zk !== 1 || CD.shot) camUser(); const ts = TS * cam.z; cam.x = pd.cx - (e.clientX - pd.x) / ts; cam.y = pd.cy - (e.clientY - pd.y) / ts; cam.follow = false;")

# ---------- 켜고 끄기 ----------
rep('''          <label class="ck" for="detailAll" title="끄면 고른 아군 · 커서를 올린 인물만 시선 · 공격 범위를 그려요"><input id="detailAll" type="checkbox"> 자세히 보기</label>\n''',
    '''          <label class="ck" for="detailAll" title="끄면 고른 아군 · 커서를 올린 인물만 시선 · 공격 범위를 그려요"><input id="detailAll" type="checkbox"> 자세히 보기</label>
          <label class="ck" for="fxCam" title="카메라 연출 — 따라갈 때 가까운 싸움 쪽으로 살짝 · 큰 사건 (도약 강타 · 보스의 큰 기술 · 보스가 쓰러짐) 에 잠깐 다가감 · 보스 치명타의 멈칫 · 느린 순간"><input id="fxCam" type="checkbox"> 🎥 연출</label>
          <label class="ck" for="fxShake" title="화면 흔들림 — 거구가 내려찍을 때 · 도약 강타 착지 · 보스 치명타 (가볍게)"><input id="fxShake" type="checkbox"> 📳 흔들림</label>\n''')
rep("function applyPc(){ document.body.classList.toggle('nodet', !detOn()); $('detShow').checked = detOn(); $('cmpShow').checked = cmpOn(); $('party').classList.toggle('cmp', cmpOn()); }",
    "function applyPc(){ document.body.classList.toggle('nodet', !detOn()); $('detShow').checked = detOn(); $('cmpShow').checked = cmpOn(); $('party').classList.toggle('cmp', cmpOn()); $('fxCam').checked = fxOn('cam'); $('fxShake').checked = fxOn('shake'); }   /* v7.28.0 연출 */")
rep("$('cmpShow').addEventListener('change', () => { S.pcCmp = $('cmpShow').checked; save(); applyPc(); });\n",
    "$('cmpShow').addEventListener('change', () => { S.pcCmp = $('cmpShow').checked; save(); applyPc(); });\n"
    "$('fxCam').addEventListener('change', () => setFx('cam', $('fxCam').checked)); $('fxShake').addEventListener('change', () => setFx('shake', $('fxShake').checked));   /* v7.28.0 */\n")
rep('''<button class="db ${document.body.classList.contains('leg') ? 'on' : ''}" data-dm="leg">🗺<small>범례</small></button></div>''',
    '''<button class="db ${document.body.classList.contains('leg') ? 'on' : ''}" data-dm="leg">🗺<small>범례</small></button></div><p class="lab">연출</p><div class="mrow"><button class="db ${fxOn('cam') ? 'on' : ''}" data-dm="fxcam">🎥<small>카메라 연출</small></button><button class="db ${fxOn('shake') ? 'on' : ''}" data-dm="fxshake">📳<small>화면 흔들림</small></button><button class="db ${fxOn('buzz') ? 'on' : ''}" data-dm="fxbuzz">📴<small>휴대폰 진동</small></button></div>''')
rep("  else if (k === 'leg') document.body.classList.toggle('leg');\n",
    "  else if (k === 'leg') document.body.classList.toggle('leg');\n"
    "  else if (k === 'fxcam') setFx('cam', !fxOn('cam')); else if (k === 'fxshake'){ setFx('shake', !fxOn('shake')); if (fxOn('shake')) fxShake(4, 300); } else if (k === 'fxbuzz'){ setFx('buzz', !fxOn('buzz')); if (fxOn('buzz')) fxBuzz(35); }   /* v7.28.0 연출 */\n")

# ---------- 연출 함수 ----------
rep("// 가까이 볼 때: 고른 아군 (없으면 살아 있는 아군) 의 가운데를 부드럽게 따라감 · 맵 밖은 덜 보이게\n",
r"""/* ---------- v7.28.0 연출: 카메라 감독 · 화면 흔들림 · 멈칫 · 느린 순간 · 보스 치명타 · 먼지 고리 · 휴대폰 진동 ----------
   로그 사건만 읽어 그림 (엔진 · 판정 · 시험의 stepWorld 는 그대로). 손으로 판을 끌면 따라감이 꺼지고 (예전과 같음), 확대 · 축소 · 집기를 하면 4초 동안 다가가지 않음 */
function setFx(k, v){ S.fx = { ...(S.fx || {}), [k]: !!v }; save(); if (k === 'cam' && !v) camUser(true); if (k === 'shake' && !v) SHK.a = 0; if ($('fxCam')){ $('fxCam').checked = fxOn('cam'); $('fxShake').checked = fxOn('shake'); } }
const fxBoss = u => !!u && (u.traits || []).includes('보스');
const fxGiant = u => !!u && (!!u.giant || (u.traits || []).includes('거구') || ['대형', '초대형'].includes(u.sizeCls) || (+u.h || 0) >= 3);
const fxTimeK = () => performance.now() < FXT.until ? FXT.k : 1;
function fxStop(ms, k){ if (!fxOn('cam')) return; const now = performance.now(); if (now + ms > FXT.until){ FXT.until = now + ms; FXT.k = k; } }   // 멈칫 (히트스톱) · 느린 순간
function fxBuzz(p){ if (!MOB || !fxOn('buzz')) return; try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
function fxShake(a, ms, x, y){
  if (!fxOn('shake')) return; const now = performance.now();
  if (x != null){ const ts = TS * cam.z, far = Math.hypot(x - cam.x, y - cam.y) > Math.max(cv.clientWidth, cv.clientHeight) / ts * 0.6; if (far) a *= 0.4; }   // 화면 밖 멀리서 난 일은 약하게
  const left = SHK.dur ? SHK.a * Math.max(0, 1 - (now - SHK.t0) / SHK.dur) : 0; if (a >= left){ SHK.a = a; SHK.t0 = now; SHK.dur = ms; }
}
function fxShakeOff(){
  if (!SHK.a) return { x: 0, y: 0 }; const now = performance.now(), r = 1 - (now - SHK.t0) / SHK.dur; if (r <= 0){ SHK.a = 0; return { x: 0, y: 0 }; }
  const m = SHK.a * r * r; return { x: m * (Math.sin(now * 0.091) * 0.6 + Math.sin(now * 0.173 + 1.3) * 0.4), y: m * (Math.cos(now * 0.083 + 0.7) * 0.6 + Math.sin(now * 0.151 + 2.1) * 0.4) };
}
// 다가감: { x, y } 또는 { unit } 쪽으로 · z = 확대 배율 · dur ms · pri (높을수록 앞섬). 따라감이 켜져 있고 · 대화 · 로딩 중이 아니고 · 화면 가까이에서 난 일만
function camShot(Wd, o){
  if (!fxOn('cam') || !cam.follow || small()) return; const now = performance.now(); if (now < CD.quietUntil) return;
  if (TK || LD){ if ((o.pri || 1) >= 3) CD.pend = { o, at: now }; return; }   // 대화 · 로딩 중에 난 큰 사건은 닫힌 뒤에
  const cur = CD.shot && now < CD.shot.end ? CD.shot : null; if (cur && (o.pri || 1) < (cur.pri || 1)) return; if (!cur && now - CD.lastShot < FXR.gap && (o.pri || 1) < 3) return;
  const p = o.unit != null ? Wd.units[o.unit] : o; if (!p) return; const ts = TS * cam.z; if (Math.hypot(p.x - cam.x, p.y - cam.y) > Math.max(cv.clientWidth, cv.clientHeight) / ts * 0.75) return;
  CD.shot = { ...o, t0: now, end: now + (o.dur || 1200) }; CD.lastShot = now;
}
function shotEnv(sh){ const now = performance.now(), u = (now - sh.t0) / Math.max(1, sh.end - sh.t0); if (u <= 0 || u >= 1) return 0; const e = Math.min(1, u / 0.18, (1 - u) / 0.3); return e * e * (3 - 2 * e); }
function camAim(Wd, bx, by){
  const ts = TS * cam.z, hw = cv.clientWidth / 2 / ts, hh = cv.clientHeight / 2 / ts, see = $('seeAll').checked; let x = bx, y = by;
  const F = Wd.units.filter(u => u.alive && u.side === 1 && (u.seenBy || see) && Math.hypot(u.x - bx, u.y - by) <= FXR.biasR).sort((a, b) => Math.hypot(a.x - bx, a.y - by) - Math.hypot(b.x - bx, b.y - by)).slice(0, 5);
  if (F.length){ const cx = F.reduce((q, u) => q + u.x, 0) / F.length, cy = F.reduce((q, u) => q + u.y, 0) / F.length; x += Math.max(-hw * FXR.edge, Math.min(hw * FXR.edge, (cx - bx) * FXR.bias)); y += Math.max(-hh * FXR.edge, Math.min(hh * FXR.edge, (cy - by) * FXR.bias)); }   // 가까운 싸움 쪽으로 살짝
  const sh = CD.shot; if (sh){ const p = sh.unit != null ? Wd.units[sh.unit] : sh; if (p){ const e = shotEnv(sh) * 0.85; x += (p.x - x) * e; y += (p.y - y) * e; } }   // 큰 사건 쪽으로
  return { x, y };
}
// 확대 배율: 남 (확대 단추 · 맞춤 · 집기) 이 cam.z 를 바꾸면 그 값을 새 바탕으로 · 다가감이 끝나면 바탕으로 돌아옴
function camZoomTick(dt){
  if (CD.zSet == null || Math.abs(cam.z - CD.zSet) > 1e-9){ CD.base = cam.z; CD.zk = 1; }
  const now = performance.now(); if (CD.shot && now >= CD.shot.end) CD.shot = null;
  if (CD.pend && !TK && !LD){ const P = CD.pend; CD.pend = null; if (now - P.at < 30000 && W_()) camShot(W_(), P.o); }
  const zt = fxOn('cam') && cam.follow && CD.shot && !(MOB && zoomAll) ? 1 + ((CD.shot.z || 1) - 1) * shotEnv(CD.shot) : 1;
  CD.zk += (zt - CD.zk) * Math.min(1, dt * 7); if (zt === 1 && Math.abs(CD.zk - 1) < 1e-3) CD.zk = 1;
  cam.z = CD.base * CD.zk; CD.zSet = cam.z;
}
function camUser(off){ if (CD.zk !== 1 && CD.zSet != null && Math.abs(cam.z - CD.zSet) < 1e-9) cam.z = CD.base; CD.zk = 1; CD.zSet = null; CD.shot = null; CD.pend = null; if (!off) CD.quietUntil = performance.now() + FXR.quietMs; }
// 로그 사건 → 연출 (새 사건만 · 판을 처음 볼 때는 지난 것을 건너뜀)
function fxTick(Wd){
  const L = Wd.log; if (Wd._fxI == null || Wd._fxI > L.length) Wd._fxI = L.length; const i0 = Wd._fxI; if (i0 >= L.length) return; Wd._fxI = L.length;
  const see = $('seeAll').checked, U = i => i != null ? Wd.units[i] : null, vis = u => !!u && (u.side === 0 || !!u.seenBy || see), now = performance.now();
  for (let i = i0; i < L.length; i++){ const e = L[i], a = U(e.a), b = U(e.b);
    if (e.k === 'quake'){ if (a && (e.vis || vis(a))) camShot(Wd, { x: (a.x + e.x) / 2, y: (a.y + e.y) / 2, z: 1.12, dur: 1500, pri: 2 }); }   // 도약 강타: 뛰어오름 → 떨어질 자리까지 담음
    else if (e.k === 'quakeHit'){ if (!a) continue; const big = fxGiant(a) || fxBoss(a); fxShake((big ? 7 : 5) + (e.n >= 2 ? 1 : 0), 450, e.x, e.y); FXV.push({ k: 'ring', x: e.x, y: e.y, r: ((((Wd.rules.spec || {}).quake) || {}).r) || 2.4, t0: now, dur: 650 }); camShot(Wd, { x: e.x, y: e.y, z: 1.06, dur: 380, pri: 3 }); fxBuzz(40); }   // 착지: 흔들림 · 먼지 고리 · 진동
    else if (e.k === 'slam'){ if (!a || !(e.vis || vis(a))) continue; const big = fxGiant(a) || fxBoss(a); if (e.n || big){ fxShake(big ? 4.5 : 2.5, 300, a.x, a.y); FXV.push({ k: 'ring', x: a.x, y: a.y, r: 1.3, t0: now, dur: 450 }); if (big) fxBuzz(25); } }   // 공중제비 내려찍기
    else if (e.k === 'stomp'){ if (a && e.vis && fxGiant(a)) fxShake(3, 260, a.x, a.y); }   // 거구의 짓밟기
    else if (e.k === 'palm'){ if (b && e.vis && !e.block) fxShake(2, 200, b.x, b.y); }   // 팜 버스트
    else if (e.k === 'czStart'){ if (a && vis(a) && ['upcut', 'ult', 'auth'].includes(e.s)) camShot(Wd, { unit: a.i, z: 1.14, dur: 1300, pri: 2 }); }   // 세자르의 큰 기술: 손을 드는 순간
    else if (e.k === 'czUpcut'){ if (a) fxShake(4, 320, a.x, a.y); }   // 하늘 가르기
    else if (e.k === 'czUlt'){ if (a) fxShake(5, 380, a.x, a.y); }   // 마구 베기 끝
    else if (e.k === 'czRise'){ if (a){ camShot(Wd, { unit: a.i, z: 1.18, dur: 2200, pri: 3 }); fxShake(3, 400, a.x, a.y); } }   // 관에서 일어남
    else if (e.k === 'hit'){ if (!a || !b || !(e.dmg > 0) || a.side === b.side || !(vis(a) || vis(b))) continue;
      const bA = fxBoss(a), bB = fxBoss(b);
      if (e.crit && (bA || bB)) fxCrit(Wd, a, b, bA, '치명타!');
      else if (bA && !e.block && e.dmg >= 0.22 * (b.max || 100)) FXV.push({ k: 'burst', x: b.x, y: b.y, r: b.r, t0: now, dur: 300, col: '255,120,80', big: false });   // 보스의 큰 일격 (치명이 아니어도)
      if (fxGiant(a) && !e.far && !e.jav && !e.kn && Wd.t - FXL.giant > FXR.giantGap){ FXL.giant = Wd.t; fxShake(e.block ? 1.8 : 2.6, 220, b.x, b.y); } }   // 거구가 내려치면 살짝
    else if (e.k === 'bossFatal'){ if (a && b && (vis(a) || vis(b))) fxCrit(Wd, a, b, false, '치명상!'); }
    else if (e.k === 'die'){ if (b && fxBoss(b) && (vis(b) || vis(a))){ fxStop(650, 0.3); camShot(Wd, { x: b.x, y: b.y, z: 1.22, dur: 1800, pri: 4 }); fxShake(5, 500, b.x, b.y); FXV.push({ k: 'flash', t0: now, dur: 520, col: '255,250,235', a: 0.32 }); fxBuzz([40, 30, 70]); } }   // 보스가 쓰러짐: 느린 순간 · 다가감 · 흰 번쩍임
  }
}
function fxCrit(Wd, a, b, bA, txt){
  const now = performance.now(), big = Wd.t - FXL.crit >= FXR.critGap;
  FXV.push({ k: 'burst', x: b.x, y: b.y, r: b.r, t0: now, dur: big ? 380 : 260, col: bA ? '255,96,64' : '255,214,110', big });
  if (!big) return; FXL.crit = Wd.t;
  if (Wd.t - FXL.txt >= FXR.txtGap){ FXL.txt = Wd.t; FXV.push({ k: 'txt', x: b.x, y: b.y - b.r - 0.25, t0: now, dur: 900, s: txt, col: bA ? '#ff6a48' : '#ffd34d' }); }
  fxStop(bA ? 90 : 60, 0.08); fxShake(bA ? 4 : 2.5, 260, b.x, b.y);
  if (bA && b.side === 0){ FXV.push({ k: 'vig', t0: now, dur: 420, col: '200,30,20', a: 0.32 }); fxBuzz(30); }   // 보스가 우리를: 붉은 테두리
}
function drawFxv(ox, oy, ts, w, h){
  const now = performance.now(); let j = 0;
  for (const f of FXV){ const age = now - f.t0; if (age < f.dur) FXV[j++] = f; } FXV.length = j;
  ctx.save();
  for (const f of FXV){ const k = Math.max(0, (now - f.t0) / f.dur), ek = 1 - Math.pow(1 - k, 3);
    if (f.k === 'burst'){ const px = ox + f.x * ts, py = oy + f.y * ts, r0 = ((f.r || 0.4) + 0.1) * ts, r1 = r0 + ts * (0.45 + 0.9 * ek) * (f.big ? 1.3 : 0.85);   // 빛살 · 고리 · 흰 심
      if (k < 0.35){ ctx.fillStyle = `rgba(255,255,245,${(0.55 * (1 - k / 0.35)).toFixed(3)})`; ctx.beginPath(); ctx.arc(px, py, r0 * 1.05, 0, 6.283); ctx.fill(); }
      ctx.strokeStyle = `rgba(${f.col},${(1 - k).toFixed(3)})`; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.5, ts * 0.07) * (1 - k * 0.6);
      for (let n = 0; n < 12; n++){ const an = n * Math.PI / 6 + (f.t0 % 7) * 0.2, q = n % 2 ? 0.7 : 1; ctx.beginPath(); ctx.moveTo(px + Math.cos(an) * r0, py + Math.sin(an) * r0); ctx.lineTo(px + Math.cos(an) * (r0 + (r1 - r0) * q), py + Math.sin(an) * (r0 + (r1 - r0) * q)); ctx.stroke(); }
      ctx.strokeStyle = `rgba(${f.col},${(0.7 * (1 - k)).toFixed(3)})`; ctx.lineWidth = Math.max(1, ts * 0.04); ctx.beginPath(); ctx.arc(px, py, r0 + (r1 - r0) * ek, 0, 6.283); ctx.stroke(); }
    else if (f.k === 'txt'){ const pop = k < 0.13 ? 0.6 + k / 0.13 * 0.75 : Math.max(1, 1.35 - (k - 0.13) * 1.6), al = k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4, px = ox + f.x * ts, py = oy + (f.y - 0.5 * ek) * ts, fs = Math.round(Math.max(17, ts * 0.52) * pop);   // '치명타!' — 튀어나왔다 가라앉으며 떠오름
      ctx.globalAlpha = Math.max(0, al); ctx.font = `900 ${fs}px IBM Plex Sans KR, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(20,6,4,.9)'; ctx.lineWidth = Math.max(3, fs * 0.2); ctx.strokeText(f.s, px, py); ctx.fillStyle = f.col; ctx.fillText(f.s, px, py); ctx.globalAlpha = 1; }
    else if (f.k === 'ring'){ const px = ox + f.x * ts, py = oy + f.y * ts, R = f.r * ts * (0.25 + 0.75 * ek);   // 먼지 고리 · 튀는 돌
      ctx.fillStyle = `rgba(150,130,100,${(0.18 * (1 - k)).toFixed(3)})`; ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.fill();
      ctx.strokeStyle = `rgba(210,190,150,${(0.85 * (1 - k)).toFixed(3)})`; ctx.lineWidth = ts * 0.16 * (1 - k) + 1; ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.stroke();
      ctx.fillStyle = `rgba(120,104,84,${(1 - k).toFixed(3)})`; for (let n = 0; n < 10; n++){ const an = n * 0.628 + (f.t0 % 5), d = R * (0.6 + (n % 3) * 0.25); ctx.beginPath(); ctx.arc(px + Math.cos(an) * d, py + Math.sin(an) * d - ts * 0.3 * Math.sin(Math.PI * k), Math.max(1.5, ts * 0.05), 0, 6.283); ctx.fill(); } }
    else if (f.k === 'vig'){ const al = f.a * Math.pow(1 - k, 1.5), g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75); g.addColorStop(0, `rgba(${f.col},0)`); g.addColorStop(1, `rgba(${f.col},${al.toFixed(3)})`); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }   // 붉은 테두리
    else if (f.k === 'flash'){ ctx.fillStyle = `rgba(${f.col},${(f.a * (1 - k) * (1 - k)).toFixed(3)})`; ctx.fillRect(0, 0, w, h); } }   // 흰 번쩍임
  ctx.restore();
}
// 가까이 볼 때: 고른 아군 (없으면 살아 있는 아군) 의 가운데를 부드럽게 따라감 · 맵 밖은 덜 보이게
""")

open(F, 'w', encoding='utf-8').write(s)
print('page7280 OK')
