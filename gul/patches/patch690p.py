# v6.9.0 page patch: 죽음 모습 · 부상 표시 · 로그 · 서술
p='page10.tpl.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:80],s.count(a)); s=s.replace(a,b)

# A. 시체 그림
rep("""  // 시체
  for (const u of Wd.units) if (!u.alive && (u.side === 0 || litAt(Wd, u.x, u.y) || $('seeAll').checked)){
    const p = { x: ox + u.x * ts, y: oy + u.y * ts }, r = u.r * ts;
    ctx.strokeStyle = u.side ? 'rgba(224,87,75,.55)' : 'rgba(90,163,220,.55)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(p.x - r * .6, p.y - r * .6); ctx.lineTo(p.x + r * .6, p.y + r * .6); ctx.moveTo(p.x + r * .6, p.y - r * .6); ctx.lineTo(p.x - r * .6, p.y + r * .6); ctx.stroke();
  }
""", """  // 시체 (v6.9 어떻게 쓰러졌는지 보임: 피 웅덩이 · 누운 몸 · 잘린 머리 · 으깨진 머리 · 관통상 · 베인 자국)
  for (const u of Wd.units) if (!u.alive && (u.side === 0 || litAt(Wd, u.x, u.y) || $('seeAll').checked)) drawCorpse(Wd, u, ox, oy, ts);
""")
rep("""function draw(){
  const Wd = W_(); if (!Wd) return;""", """// v6.9 죽음의 모습: 숨을 끊은 상처 (엔진 deathKind) 에 따라 다르게 그림
const DK_TXT = { decap: '목이 잘림', crush: '머리가 으깨짐', brain: '뇌 관통', cleave: '두개골이 쪼개짐', heart: '심장 관통', neck: '목뼈가 부러짐', throat: '목이 베임', face: '얼굴이 갈라짐', lungs: '가슴 관통', chestCut: '가슴이 깊이 갈림', ribs: '가슴이 함몰됨', gut: '배가 갈림', gutP: '배를 꿰뚫림', organ: '장기가 터짐', spine: '등뼈가 끊김', incap: '전투불능', bleed: '과다 출혈', burn: '화상', shock: '쇼크' };
const DK_POOL = { decap: 1.7, throat: 1.6, bleed: 1.7, gut: 1.5, chestCut: 1.4, crush: 1.3, cleave: 1.3, heart: 1.4, lungs: 1.3, gutP: 1.3, organ: 1.1, face: 1.2, brain: 1.1, ribs: 0.9, neck: 0.5, spine: 0.9, incap: 0.7, burn: 0.35, shock: 0.8 };
function drawCorpse(Wd, u, ox, oy, ts){
  const k = u.deathKind || '', p = { x: ox + u.x * ts, y: oy + u.y * ts }, r = u.r * ts, age = Math.min(1, Math.max(0, (Wd.t - (u.deadT != null ? u.deadT : Wd.t - 9)) / 4));
  const rr = j => { const v = Math.sin(u.i * 12.9898 + j * 78.233) * 43758.5453; return v - Math.floor(v); };   // 시체마다 같은 모양 (그릴 때마다 흔들리지 않게)
  const fall = (u.face || 0) + Math.PI, fx = Math.cos(fall), fy = Math.sin(fall), nx = -fy, ny = fx;   // 등 뒤로 쓰러짐: 머리는 제자리, 몸통은 뒤쪽
  const torso = { x: p.x + fx * r * 1.05, y: p.y + fy * r * 1.05 }, chest = { x: p.x + fx * r * 0.75, y: p.y + fy * r * 0.75 }, belly = { x: p.x + fx * r * 1.45, y: p.y + fy * r * 1.45 };
  const red = 'rgba(214,28,40,.95)', sc = u.side ? 'rgba(224,87,75,.6)' : 'rgba(90,163,220,.6)';
  const line = (a, b, w, c) => { ctx.strokeStyle = c || red; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };
  const dot = (q, rad, c) => { ctx.fillStyle = c || red; ctx.beginPath(); ctx.arc(q.x, q.y, rad, 0, 6.283); ctx.fill(); };
  const cut = (q, len, w) => line({ x: q.x - nx * len, y: q.y - ny * len }, { x: q.x + nx * len, y: q.y + ny * len }, w);   // 몸을 가로지르는 베인 자국
  ctx.save();
  // 피 웅덩이 (몇 초에 걸쳐 번짐)
  const pm = (DK_POOL[k] != null ? DK_POOL[k] : 1) * (0.45 + 0.55 * age);
  { const cx = (p.x + torso.x) / 2, cy = (p.y + torso.y) / 2, R = r * 1.5 * pm, g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(112,8,16,.78)'); g.addColorStop(0.7, 'rgba(92,6,12,.5)'); g.addColorStop(1, 'rgba(70,4,10,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.15, R * 0.8, fall, 0, 6.283); ctx.fill(); }
  // 몸통 (누운 몸)
  ctx.fillStyle = k === 'burn' ? 'rgba(34,26,22,.95)' : 'rgba(48,42,46,.94)'; ctx.strokeStyle = sc; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(torso.x, torso.y, r * 1.0, r * 0.62, fall, 0, 6.283); ctx.fill(); ctx.stroke();
  // 몸통의 상처
  if (k === 'heart'){ dot(chest, r * 0.17); dot(chest, r * 0.07, '#200406'); }
  if (k === 'lungs'){ dot({ x: chest.x + nx * r * 0.22, y: chest.y + ny * r * 0.22 }, r * 0.14); dot({ x: chest.x + nx * r * 0.22, y: chest.y + ny * r * 0.22 }, r * 0.06, '#200406'); }
  if (k === 'chestCut') cut(chest, r * 0.55, Math.max(2, r * 0.13));
  if (k === 'gut'){ cut(belly, r * 0.5, Math.max(2.5, r * 0.16)); dot({ x: belly.x + fx * r * 0.25, y: belly.y + fy * r * 0.25 }, r * 0.2, 'rgba(150,40,60,.9)'); }   // 쏟아진 내장
  if (k === 'gutP'){ dot(belly, r * 0.15); dot(belly, r * 0.06, '#200406'); }
  if (k === 'ribs' || k === 'organ'){ const q = k === 'ribs' ? chest : belly; ctx.fillStyle = 'rgba(96,40,110,.75)'; ctx.beginPath(); ctx.ellipse(q.x, q.y, r * 0.38, r * 0.26, fall, 0, 6.283); ctx.fill(); }   // 멍 · 함몰
  if (k === 'spine'){ ctx.setLineDash([2, 2]); line(chest, belly, Math.max(1.5, r * 0.08), 'rgba(230,220,200,.7)'); ctx.setLineDash([]); }
  // 머리 (초상화): 잘린 머리는 굴러간 자리에, 목뼈가 부러지면 꺾임, 으깨지면 납작
  const head = k === 'decap' && u.headAt ? { x: ox + u.headAt.x * ts, y: oy + u.headAt.y * ts } : p, hr = k === 'decap' ? r * 0.72 : r * 0.86;
  if (k === 'decap'){ line(p, head, Math.max(2, r * 0.18), 'rgba(140,12,20,.75)'); dot(p, r * 0.3, 'rgba(170,16,26,.95)'); dot(p, r * 0.13, 'rgba(235,215,200,.85)'); }   // 핏자국 · 목의 잘린 면
  ctx.save(); ctx.beginPath(); ctx.arc(head.x, head.y, hr, 0, 6.283); ctx.clip();
  ctx.translate(head.x, head.y); ctx.rotate(k === 'neck' ? 2.4 : k === 'decap' ? 1.2 + rr(1) * 3 : Math.PI / 2); if (k === 'crush') ctx.scale(1.12, 0.62); ctx.translate(-head.x, -head.y);
  const fi = faceOf(u.ref);
  if (fi >= 0 && atlasOK) ctx.drawImage(atlas, (fi % FACE.COLS) * FACE.S, Math.floor(fi / FACE.COLS) * FACE.S, FACE.S, FACE.S, head.x - hr, head.y - hr, hr * 2, hr * 2);
  else { ctx.fillStyle = SIDEC[u.side]; ctx.fillRect(head.x - hr, head.y - hr, hr * 2, hr * 2); }
  ctx.setTransform(ctx.getTransform()); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(head.x, head.y, hr, 0, 6.283); ctx.clip(); ctx.fillStyle = k === 'incap' ? 'rgba(14,10,12,.3)' : k === 'burn' ? 'rgba(30,18,10,.72)' : 'rgba(14,10,12,.55)'; ctx.fillRect(head.x - hr, head.y - hr, hr * 2, hr * 2);
  if (k === 'crush'){ ctx.fillStyle = 'rgba(170,12,24,.55)'; ctx.fillRect(head.x - hr, head.y - hr, hr * 2, hr * 2); }
  ctx.restore();
  ctx.strokeStyle = sc; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(head.x, head.y, hr, 0, 6.283); ctx.stroke();
  // 머리의 상처
  if (k === 'crush') for (let j = 0; j < 8; j++){ const a = rr(j + 2) * 6.283, d = hr * (0.8 + rr(j + 11) * 0.9); dot({ x: head.x + Math.cos(a) * d, y: head.y + Math.sin(a) * d }, Math.max(1.5, hr * (0.08 + rr(j + 21) * 0.14)), 'rgba(170,14,26,.9)'); }   // 튄 피 · 조각
  if (k === 'brain'){ const q = { x: head.x - fx * hr * 0.35, y: head.y - fy * hr * 0.35 }; dot(q, Math.max(2, hr * 0.17), red); dot(q, Math.max(1.2, hr * 0.08), '#120204'); line(q, { x: q.x + fx * hr * 0.7, y: q.y + fy * hr * 0.7 }, Math.max(1.2, hr * 0.07)); }   // 구멍 · 흘러내린 피
  if (k === 'cleave') line({ x: head.x - hr * 0.75, y: head.y - hr * 0.6 }, { x: head.x + hr * 0.75, y: head.y + hr * 0.6 }, Math.max(2.5, hr * 0.16));
  if (k === 'face') line({ x: head.x - hr * 0.55, y: head.y + hr * 0.2 }, { x: head.x + hr * 0.55, y: head.y - hr * 0.2 }, Math.max(2, hr * 0.12));
  if (k === 'throat' || k === 'neck'){ const q = { x: p.x + fx * hr * 0.95, y: p.y + fy * hr * 0.95 }; if (k === 'throat') cut(q, hr * 0.45, Math.max(2, hr * 0.14)); else { ctx.fillStyle = 'rgba(96,40,110,.8)'; ctx.beginPath(); ctx.arc(q.x, q.y, hr * 0.22, 0, 6.283); ctx.fill(); } }
  // 이름표: 어떻게 쓰러졌나 (크게 볼 때) · 따로 없으면 작은 ✕
  if (DK_TXT[k] && ts >= 22){ const t = (k === 'incap' ? '⛔ ' : '✕ ') + DK_TXT[k]; ctx.font = '600 9.5px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width, ly = Math.max(head.y, torso.y) + r * 0.95;
    ctx.fillStyle = 'rgba(18,8,10,.78)'; ctx.fillRect(p.x - tw / 2 - 3, ly - 6, tw + 6, 12); ctx.fillStyle = k === 'incap' ? '#ffd27a' : u.side ? '#ff9a86' : '#9fd2ff'; ctx.fillText(t, p.x, ly + 0.5); }
  else if (!DK_TXT[k]){ ctx.strokeStyle = sc; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x - r * .45, p.y - r * .45); ctx.lineTo(p.x + r * .45, p.y + r * .45); ctx.moveTo(p.x + r * .45, p.y - r * .45); ctx.lineTo(p.x - r * .45, p.y + r * .45); ctx.stroke(); }
  ctx.restore();
}
function draw(){
  const Wd = W_(); if (!Wd) return;""")

# B. 누운 글씨: 기절 · 하반신 마비
rep("if (lying && vis && ts >= 22){ const t = u.crawl ? `기어다님 · 다리 ${u.legLoss || ''}` : u.kb ? '밀려남' : '넘어짐';",
    "if (lying && vis && ts >= 22){ const t = u.koT && now < u.koT ? (isFinite(u.koT) ? '😵 기절' : '😵 의식 없음 (쇼크)') : u.crawl ? (u.legLoss === '척추' ? '하반신 마비 · 기어다님' : `기어다님 · 다리 ${u.legLoss || ''}`) : u.kb ? '밀려남' : '넘어짐';   // v6.9 기절")

# C. 부상 칩
rep("""    if (!ed && vis && u.arms && (u.eyeLost || u.arms.L || u.arms.R || u.bleed)){""",
    """    if (!ed && vis && u.arms && (u.eyeLost || u.arms.L || u.arms.R || u.bleed || u.ibleed || u.shock || (u.inj && u.inj.length))){   // v6.9 💫 뇌진탕 · 🫁 폐 · 🦴 골절 · 짙은 🩸 내출혈 · 😰 쇼크""")
rep("""if (u.bleed) ic.push(['🩸', false, true]);
      const fs = Math.max(10, Math.min(16, r * 0.5));""",
    """if (u.bleed) ic.push(['🩸', false, true]);
      const IJ = u.inj || []; if (IJ.some(w => w.k === 'daze')) ic.push(['💫', false, false]); if (IJ.some(w => w.k === 'lung')) ic.push(['🫁', false, false]); if (IJ.some(w => w.k === 'rib' || w.k === 'legBreak')) ic.push(['🦴', false, false]); if (u.ibleed) ic.push(['🩸', false, true, '#3a0010', 'rgba(205,170,180,.95)']); if ((u.shock || 0) >= 2) ic.push(['😰', false, true, '#6b21a8']);
      const fs = Math.max(10, Math.min(16, r * 0.5));""")
rep("""      ic.forEach(([s2, slash, blink], k) => { const x = px - r * 0.5 + k * (fs + 3), y = py - r * 0.5; ctx.globalAlpha = blink ? 0.6 + 0.4 * Math.sin(now * 7) : 1;
        ctx.fillStyle = 'rgba(255,244,238,.94)'; ctx.strokeStyle = '#b3122a';""",
    """      ic.forEach(([s2, slash, blink, ring, bg], k) => { const x = px - r * 0.5 + (k % 4) * (fs + 3), y = py - r * 0.5 + Math.floor(k / 4) * (fs + 3); ctx.globalAlpha = blink ? 0.6 + 0.4 * Math.sin(now * 7) : 1;
        ctx.fillStyle = bg || 'rgba(255,244,238,.94)'; ctx.strokeStyle = ring || '#b3122a';""")

# D. 상세 · 카드
rep("""  if (u.bleed) a.push(`🩸 피를 흘림 (초당 ${u.bleed.dps.toFixed(1)} · ${f2(u.bleed.until - Wd.t)}초 — 응급처치 · 약으로 지혈)`);
  return a.join(' · ');""",
    """  if (u.bleed) a.push(`🩸 피를 흘림 (초당 ${u.bleed.dps.toFixed(1)} · ${f2(u.bleed.until - Wd.t)}초 — 응급처치 · 약으로 지혈)`);
  for (const w of u.inj || []) a.push(`${INJ_IC[w.k] || '✚'} ${w.txt}${w.k === 'legBreak' && w.splint ? ' (부목 — 속력 ×0.7)' : ''}${w.k === 'daze' && w.until ? ' · ' + f2(Math.max(0, w.until - Wd.t)) + '초' : ''}`);   // v6.9 부상
  if (u.ibleed) a.push(`🩸 내출혈 (초당 ${u.ibleed.dps.toFixed(1)} · ${f2(u.ibleed.until - Wd.t)}초 — 몸 안이라 응급처치로 반만 멈춤)`);
  if (u.shock) a.push(`😰 쇼크 ${u.shock}단계 (흘린 피 ${Math.round((u.bled || 0) / u.max * 100)}% — ${u.shock >= 3 ? '의식을 잃음, 응급처치로 안정시켜야 깸' : u.shock >= 2 ? '준비 ×1.25 · 조준 ×0.75 · 속력 ×0.8' : '준비 ×1.1 · 조준 ×0.9'})`);
  if (u.koT && Wd.t < u.koT) a.push(isFinite(u.koT) ? `😵 기절 — ${f2(u.koT - Wd.t)}초 뒤 깸 (응급처치로 바로 깨움)` : '😵 의식 없음 — 응급처치로 안정시켜야 깸');
  return a.join(' · ');""")
rep("""// v5.5 부위 설명 (인물 설명 칸)
function maimTxt(Wd, u){""", """// v5.5 부위 설명 (인물 설명 칸)
const INJ_IC = { artery: '🩸', lung: '🫁', rib: '🦴', legBreak: '🦴', daze: '💫', skull: '💀', gut: '🩸', cut: '🩸', spine: '♿', tendon: '✂', thigh: '🩸', legHole: '🩸' };   // v6.9
function maimTxt(Wd, u){""")
rep("""    ${!ed && u.alive && u.arms && (u.eyeLost || u.arms.L || u.arms.R || u.bleed) ? `<span class="tr" style="color:#ff9a86"><span class="lb">부위</span> ${maimTxt(Wd, u)}</span>` : ''}""",
    """    ${!ed && !u.alive && u.deathKind ? `<span class="tr" style="color:#ff9a86"><span class="lb">죽음</span> ${esc(DK_TXT[u.deathKind] || u.deathKind)}${u.incapWhy ? ' — ' + esc(u.incapWhy) + ' (살아는 있으나 싸움에서 빠짐)' : ''}</span>` : ''}
    ${!ed && u.alive && u.arms && (u.eyeLost || u.arms.L || u.arms.R || u.bleed || u.ibleed || u.shock || (u.inj && u.inj.length) || (u.koT && Wd.t < u.koT)) ? `<span class="tr" style="color:#ff9a86"><span class="lb">부상</span> ${maimTxt(Wd, u)}</span>` : ''}""")
rep("""  return `${u.burn && Wd.t < u.burn.until ? ' · 🔥 화상' : ''}""",
    """  return `${!u.alive && u.deathKind ? ' · ✕ ' + (DK_TXT[u.deathKind] || '') : ''}${u.alive && u.koT && Wd.t < u.koT ? ' · 😵 기절' : ''}${u.alive && u.shock ? ' · 😰 쇼크 ' + u.shock : ''}${u.alive && u.ibleed ? ' · 내출혈' : ''}${u.alive && u.inj && u.inj.length ? ' · 부상 ' + u.inj.length : ''}${u.burn && Wd.t < u.burn.until ? ' · 🔥 화상' : ''}""")

# E. 로그
rep("""      case 'die': out.push(e.alone ? `${T(e)}✕ ${n(e.b)} — 아군이 모두 쓰러져 [불사] 도 끝 (진짜 죽음)` : `${T(e)}✕ ${n(e.b)} 쓰러짐 (${n(e.a)}의 공격${e.ff ? ', 아군 오사' : ''}${e.last ? ' — 홀로 남은 [불사], 진짜 죽음' : ''})`); break;""",
    """      case 'die': out.push(e.alone ? `${T(e)}✕ ${n(e.b)} — 아군이 모두 쓰러져 [불사] 도 끝 (진짜 죽음)` : `${T(e)}✕ ${n(e.b)} 쓰러짐${e.how ? ' — ' + (DK_TXT[e.how] || e.how) + (e.how === 'incap' && Wd.units[e.b].incapWhy ? ' (' + Wd.units[e.b].incapWhy + ')' : '') : ''} (${n(e.a)}의 공격${e.ff ? ', 아군 오사' : ''}${e.last ? ' — 홀로 남은 [불사], 진짜 죽음' : ''})`); break;   // v6.9 어떻게
      case 'wound': out.push(`${T(e)}✚ ${n(e.b)} ${e.txt}${e.zone ? ' [' + (ZONE_K[e.zone] || e.zone) + (e.mode ? ' · ' + e.mode : '') + ']' : ''} — ${(e.eff || []).join(' · ')}${e.a != null ? ' (' + n(e.a) + ')' : ''}${e.vis ? '' : ' [아군에겐 안 보임]'}`); break;   // v6.9 부상
      case 'ko': out.push(`${T(e)}😵 ${n(e.b)} 기절 ${e.sec != null ? e.sec + '초' : '(깨워 주기 전까지)'} — ${e.why}${e.a != null ? ' (' + n(e.a) + ')' : ''}`); break;
      case 'wake': out.push(`${T(e)}${n(e.a)} 정신을 차림`); break;
      case 'shock': out.push(`${T(e)}😰 ${n(e.a)} 쇼크 ${e.s}단계 (흘린 피 ${e.bl}%${e.s >= 3 ? ' — 의식을 잃음' : ''})`); break;""")
rep("""${e.stanch ? ' · 지혈' : ''}${e.auto ? ' · 위급해서 스스로' : ' · 명령'}`); break;""",
    """${e.stanch ? ' · 지혈' : ''}${e.stab && e.stab.length ? ' · ' + e.stab.join(' · ') : ''}${e.auto ? ' · 위급해서 스스로' : ' · 명령'}`); break;""")
rep("""    else if ((e.k === 'die' || e.k === 'down') && U(e.b)) s = `✕ ${n(e.b)} ${e.k === 'down' ? '쓰러짐 ([불사])' : '쓰러짐'}${e.a !== e.b && U(e.a) ? ' (' + n(e.a) + ')' : ''}`;""",
    """    else if ((e.k === 'die' || e.k === 'down') && U(e.b)) s = `✕ ${n(e.b)} ${e.k === 'down' ? '쓰러짐 ([불사])' : '쓰러짐'}${e.k === 'die' && e.how ? ' — ' + (DK_TXT[e.how] || e.how) : ''}${e.a !== e.b && U(e.a) ? ' (' + n(e.a) + ')' : ''}`;""")

# F. 이야기
rep("""    case 'die': if (e.last) return""", """    case 'wound': { const b = U(e.b); if (!(e.vis || b.side === 0)) return null; const c = b.side ? 'good' : 'bad', A = e.a != null ? n(e.a) : '', B = n(e.b);   // v6.9 부상
      const S = { artery: `${A}의 일격이 ${B}의 목을 가른다 — 경동맥에서 피가 뿜어져 나온다!`, lung: `${B}의 가슴이 꿰뚫린다 — 숨소리가 거칠게 끓는다.`, rib: `${A}의 일격에 ${B}의 갈비뼈가 우두둑 부러진다!`, daze: `${B}의 머리가 크게 흔들린다 — 눈앞이 빙글 돈다.`, skull: `${B}의 두개골이 갈라진다 — 그대로 고꾸라진다!`, spine: `${B}의 등뼈가 꺾인다 — 다리가 풀려 바닥을 긴다!`, tendon: `${B}의 팔 힘줄이 끊어진다${(e.eff || []).some(x => x.includes('놓침')) ? ' — 무기가 손에서 떨어진다' : ''}!`, legBreak: `${B}의 다리가 꺾여 부러진다!`, thigh: `${B}의 허벅지가 깊이 베인다 — 피가 솟는다!`, legHole: `${B}의 다리가 꿰뚫린다.`, cut: `${B}의 가슴이 깊이 베인다.`,
        gut: /갈림/.test(e.txt) ? `${B}의 배가 갈린다 — 피가 쏟아진다!` : /파열/.test(e.txt) ? `${B}의 배 안에서 무언가 터진다 — 얼굴이 하얗게 질린다.` : `${B}의 배가 꿰뚫린다 — 몸 안으로 피가 고인다.` };
      return S[e.w] ? { c, s: S[e.w] } : null; }
    case 'ko': return e.vis || U(e.b).side === 0 ? { c: U(e.b).side ? 'good' : 'bad', s: `${ga(n(e.b))} 의식을 잃고 쓰러진다${e.sec == null ? ' — 깨워 주지 않으면 일어나지 못한다' : ''}.` } : null;
    case 'wake': return e.vis || U(e.a).side === 0 ? { c: 'dim', s: `${ga(n(e.a))} 신음하며 정신을 차린다.` } : null;
    case 'shock': return (e.vis || U(e.a).side === 0) && e.s >= 2 ? { c: U(e.a).side ? 'good' : 'bad', s: e.s >= 3 ? `${ga(n(e.a))} 피를 너무 많이 흘렸다 — 눈이 풀리며 무너진다.` : `${n(e.a)}의 얼굴이 하얗게 질린다 — 피를 너무 많이 흘렸다.` } : null;
    case 'die': if (e.how && !e.last && !e.alone && DIE_N[e.how]){ const b = U(e.b); return { c: b.side === 1 ? 'good' : 'bad', s: DIE_N[e.how](e.a != null && e.a !== e.b ? n(e.a) : '', n(e.b), U(e.a), b) }; }   // v6.9 어떻게 쓰러졌나
      if (e.last) return""")
rep("""let narr = { W: null, i: 0, lines: [] };""", """let narr = { W: null, i: 0, lines: [] };
// v6.9 숨을 끊은 상처의 서술 (A = 친 쪽 · B = 쓰러진 쪽)
const DIE_N = {
  decap: (A, B) => `${A ? A + '의 일격 — ' : ''}${B}의 목이 잘려 나간다! 머리가 땅을 구른다.`,
  crush: (A, B) => `${A ? A + '의 일격에 ' : ''}${B}의 머리가 으깨진다!`,
  brain: (A, B, a) => `${a && isFar(a) ? (a.weapon && /활/.test(a.weapon) ? '화살이' : '탄환이') : A ? A + '의 일격이' : '일격이'} ${B}의 머리를 꿰뚫는다 — 그대로 무너진다.`,
  cleave: (A, B) => `${A ? A + '의 칼날에 ' : ''}${B}의 두개골이 쪼개진다!`,
  heart: (A, B) => `${B}의 심장이 꿰뚫린다 — 그 자리에 무너진다.`,
  neck: (A, B) => `우두둑 — ${B}의 목이 꺾인다.`,
  throat: (A, B) => `${B}의 목이 베인다 — 피를 쏟으며 쓰러진다.`,
  face: (A, B) => `${B}의 얼굴이 갈라진다 — 비명과 함께 쓰러진다.`,
  lungs: (A, B) => `${B}의 가슴이 꿰뚫린다 — 피거품을 물고 쓰러진다.`,
  chestCut: (A, B) => `${B}의 가슴이 깊이 갈린다 — 그대로 쓰러진다.`,
  ribs: (A, B) => `${B}의 가슴이 푹 꺼진다 — 숨이 끊긴다.`,
  gut: (A, B) => `${B}의 배가 갈린다 — 내장을 쏟으며 쓰러진다.`,
  gutP: (A, B) => `${B}의 배가 꿰뚫린다 — 무릎을 꿇고 쓰러진다.`,
  organ: (A, B) => `${B}의 배 안에서 무언가 터진다 — 피를 토하며 쓰러진다.`,
  spine: (A, B) => `${B}의 등뼈가 끊어진다 — 그대로 무너진다.`,
  incap: (A, B, a, b) => `${ga(B)} 쓰러져 더는 일어나지 못한다 — 전투불능${b && b.incapWhy ? ' (' + b.incapWhy + ')' : ''}.`,
  bleed: (A, B) => `${ga(B)} 피를 너무 많이 흘려 쓰러진다.`,
  burn: (A, B) => `${ga(B)} 그을린 채 쓰러진다.`,
};
const STAB_N = { '내출혈 반': '배 안의 출혈을 겨우 늦춘다.', '쇼크 안정': '창백하던 얼굴에 핏기가 돈다.', '깨움': '정신을 잃은 몸을 흔들어 깨운다.', '다리 부목': '부러진 다리에 부목을 댄다.' };""")
rep("""    case 'skill': if (e.kit) return { c: 'good', s: `${ga(n(e.a))} 구급상자로 ${e.revive ? `쓰러진 ${reul(n(e.b))} 일으킨다` : e.a === e.b ? '자기 상처를 싸맨다' : n(e.b) + '의 상처를 싸맨다'} (+${e.amt}, 남은 구급상자 ${e.left}).${e.stanch ? ' 쏟아지던 피가 멎는다.' : ''}` };""",
    """    case 'skill': if (e.kit) return { c: 'good', s: `${ga(n(e.a))} 구급상자로 ${e.revive ? `쓰러진 ${reul(n(e.b))} 일으킨다` : e.a === e.b ? '자기 상처를 싸맨다' : n(e.b) + '의 상처를 싸맨다'} (+${e.amt}, 남은 구급상자 ${e.left}).${e.stanch ? ' 쏟아지던 피가 멎는다.' : ''}${(e.stab || []).map(x => STAB_N[x] ? ' ' + STAB_N[x] : '').join('')}` };""")

# G. 범례
rep("""<span><i class="ln" style="color:#ff9a86">✚</i>👁 눈을 잃음 · 🦴 팔 파괴 · ✂ 팔 절단 · 🩸 피를 흘림 · 검은 띠 = 실명</span>""",
    """<span><i class="ln" style="color:#ff9a86">✚</i>👁 눈을 잃음 · 🦴 팔 파괴 · 골절 · ✂ 팔 절단 · 🩸 피를 흘림 (짙은 칩 = 내출혈) · 💫 뇌진탕 · 🫁 폐 관통 · 😰 쇼크 · 😵 기절 · 검은 띠 = 실명</span><span><i class="ln" style="color:#ff9a86">✕</i>시체 = 피 웅덩이 · 누운 몸 · 숨을 끊은 상처 (잘린 머리 · 으깨진 머리 · 관통 · 베인 자국) · ⛔ 전투불능</span>""")
open(p,'w').write(s)
print('ok')
