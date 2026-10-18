# v7.23.2 페이지 — page7232.py v1.1 (v1.1: ◆권위 derived · limits 칸 · 6단계 5S 세자르 2: 필살 넷 · 권위 — 예고 범위 (가는 직선 · 붉은 직사각형 · 부채꼴 · 표적 · 손을 듦) · 눈 (권위) · 컷인 (늙은 왕의 얼굴 + 기술 이름) · 권위 사각형 창 · 흔들림 알림 · 이동 제약 표시 · 로그 · 설명 · ◆권위)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.23.1 (2026-10-18)', '<!-- 굴의 전투판 v7.23.2 (2026-10-18)')
rep('     v7.23.1: ', '''     v7.23.2: 세자르의 필살 · 권위 (2D 판 이식). 하늘 가르기 (1초 모음 · 슈퍼아머 → 16M 직선 · 못 막고 못 피함 · 절단 · 쓰러짐 → 이동 제약 10초 · 갈라진 자리의 폭풍) ·
         관통 찌르기 (0.6초 모음 → 5M 를 한순간에 · 가벼운 맨 앞은 꿰어 내던짐) · 냉기 참격 (0.8초 모음 · 끊길 수 있음 → 7.3M 부채꼴 · 동상) ·
         마구 베기 (최전방 하나에게 돌진 → 확정 치명 12번 · 베는 도중 휘청이면 끊김) · 권위 (손을 들어 1.1초 → 눈 · 신성 봉인 — 카리우스 ◆개조된 신체가 꺼짐 · 세자르가 휘청이면 6초 흔들림).
         큰 기술은 가장 많이 걸리는 쪽을 노림. 모든 기술에 예고 (바닥 범위) · 하늘 가르기 · 마구 베기는 컷인. 이동 제약 (걸음 × 0.4 · 못 뜀 · 스텝 · 도약 못 함).
     v7.23.1: ''')
rep('h1::after{content:" v7.23.1"', 'h1::after{content:" v7.23.2"')
rep('<footer>굴의 전투판 v7.23.1', '<footer>굴의 전투판 v7.23.2')
rep('return `굴의 전투판 v7.23.1 · ${title}', 'return `굴의 전투판 v7.23.2 · ${title}')
rep("copyText('굴의 전투판 v7.23.1 자동 판 기록", "copyText('굴의 전투판 v7.23.2 자동 판 기록")
rep('의 버전 기록에 — v7.23.1 5S 세자르', '의 버전 기록에 — v7.23.2 세자르의 필살 · 권위 / v7.23.1 5S 세자르')
rep('">v7.23.1 · 1F 5S 세자르 · 6단계</span>', '">v7.23.2 · 1F 세자르 · 6단계</span>')
rep("ver: '7.23.1', at:", "ver: '7.23.2', at:")

# 세자르: 고유 · 액티브
rep("active: ['원형 베기', '어깨 박치기'], brain: 'cesar',", "unique: ['권위'], active: ['원형 베기', '어깨 박치기', '하늘 가르기', '관통 찌르기', '냉기 참격', '마구 베기'], brain: 'cesar',")
rep("const CZ_NM = { spin: '원형 베기', shoulder: '어깨 박치기', backs: '뒷걸음 점프', rush: '돌진', flank: '우회' };",
    "const CZ_NM = { spin: '원형 베기', shoulder: '어깨 박치기', backs: '뒷걸음 점프', rush: '돌진', flank: '우회', upcut: '하늘 가르기', thrust: '관통 찌르기', wave: '냉기 참격', ult: '마구 베기', auth: '권위' };")
rep("  '원형 베기': '세자르 —", """  '하늘 가르기': '세자르 — 검을 낮게 늘어뜨리고 1초 모음 (슈퍼아머 · 방향은 상대를 따라감) → 16M 직선 위의 모두를 벰 (× 2.2 · 못 막고 못 피함) · 절단 · 쓰러짐 → 이동 제약 10초. 1.1초 뒤 갈라진 자리에서 폭풍 (앞쪽 · 가벼울수록 멀리 밀림). 그동안 세자르는 아무것도 못 함. 20초마다',
  '관통 찌르기': '세자르 — 0.6초 모음 (슈퍼아머) → 5M 를 한순간에 튀어나가 줄 위의 모두 (× 1.2 · 못 막음 · 치명 50%). 맨 앞이 가벼우면 (버티는 무게 500 아래) 꿰어 들어 올렸다가 내던짐 (× 0.8 더). 무거우면 관통 (휘청). 6초마다',
  '냉기 참격': '세자르 — 0.8초 모음 (휘청이면 끊김 · 4초 뒤 다시) → 앞쪽 7.3M · 좌우 74° 부채꼴 (× 1.8 · 막고 피할 수 있음) · 동상 4초. 9초마다',
  '마구 베기': '세자르 — 1초 모음 (휘청이면 끊김) → 최전방 (무리에서 가장 튀어나온 이) 에게 초속 18M 돌진 (슈퍼아머) → 0.1초마다 확정 치명 12번 (× 0.3). 쓰러지면 다음 최전방. 베는 도중 휘청이면 끊김. 22초마다',
  '원형 베기': '세자르 —""")
rep("  '개조된 신체': { who: 'C-003',", """  '권위': { who: 'C-045',   // v7.23.2 세자르 (2D 판 이식)
    lore: ['보스란 무엇인가의 기준. 존경받는 왕이었다.', '고유특성 [권위] 는 신성을 크게 제약한다. 한낱 신성이 세자르보다 위대하진 않기 때문에.', '그의 왕관은 [권위] 의 마이너 카피를 얻게 해 준다.'],
    effects: ['싸움이 시작되면 손을 듦 (1.1초 — 그동안 휘청이게 하면 끊김 · 6초 뒤 다시)', '눈이 내리고 신성이 봉인됨 — 전장 모두: 카리우스 ◆개조된 신체 (덜 다침 · 덜 휘청 · 덜 넘어짐 · 덜 잘림) 가 꺼짐', '세자르가 0.3초 넘게 휘청이면 6초 동안 흔들림 (눈이 멎고 신성이 돌아옴) — 그 뒤 4초는 흔들리지 않음'], derived: [], limits: [] },
  '개조된 신체': { who: 'C-003',""")
# 컷인 · 눈 CSS
rep("body.mob .campbar .btn{min-height:34px;white-space:nowrap;flex:none}", """body.mob .campbar .btn{min-height:34px;white-space:nowrap;flex:none}
/* v7.23.2 세자르 컷인 (늙은 왕의 얼굴 + 기술 이름) */
.czcut{position:absolute;left:0;right:0;top:36%;display:flex;align-items:center;justify-content:center;gap:14px;padding:8px 18px;background:linear-gradient(90deg,rgba(8,12,22,0),rgba(8,12,22,.88) 22%,rgba(8,12,22,.88) 78%,rgba(8,12,22,0));pointer-events:none;z-index:4;animation:czcut 1.2s ease-out forwards}
.czcut img{width:72px;height:72px;border-radius:8px;border:2px solid #9fd0ff;object-fit:cover;background:#111}
.czcut b{font:700 26px var(--display);color:#e8f4ff;letter-spacing:5px;text-shadow:0 0 12px #6fb4ff}
@keyframes czcut{0%{opacity:0;transform:translateX(-40px)}14%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0}}
body.mob .czcut img{width:54px;height:54px} body.mob .czcut b{font-size:20px;letter-spacing:3px}""")
# 컷인 · 권위 알림
rep("  if (Wd && mode !== 'edit' && Wd.camp){ encTick(Wd);", "  if (Wd && mode !== 'edit') czCutTick(Wd);   /* v7.23.2 세자르 컷인 · 권위 알림 */\n  if (Wd && mode !== 'edit' && Wd.camp){ encTick(Wd);")
rep("function czOpenCoffin(){", """// v7.23.2 세자르: 하늘 가르기 · 마구 베기 컷인 · 권위 (사각형 창 — 처음 한 번) · 흔들림 · 다시 눈 (알림)
function czCutTick(Wd){
  const L = Wd.log, i0 = Wd._czI || 0; if (i0 >= L.length){ Wd._czI = L.length; return; } Wd._czI = L.length;
  for (let i = i0; i < L.length; i++){ const e = L[i], u = e.a != null ? Wd.units[e.a] : null, seen = !u || u.side === 0 || u.seenBy || $('seeAll').checked;
    if (e.k === 'czStart' && (e.s === 'upcut' || e.s === 'ult') && seen) czCutIn(CZ_NM[e.s]);
    else if (e.k === 'czAuth' && !Wd._authSeen){ Wd._authSeen = true; if (!TK) talkLines([{ box: '권위 — 신성이 극도로 제한됩니다' }]); }
    else if (e.k === 'czShaken') toast('👑 권위가 흔들린다 — 6초 동안 눈이 멎고 신성이 돌아온다');
    else if (e.k === 'czAuthBack') toast('❄ 권위가 다시 홀을 채운다. 눈이 내린다'); }
}
function czCutIn(name){
  const host = $('campBar') && $('campBar').parentElement; if (!host) return; const old = host.querySelector('.czcut'); if (old) old.remove();
  const d = document.createElement('div'); d.className = 'czcut'; d.innerHTML = `<img src="art/C-045_face2d.webp" alt=""><b>${esc(name)}</b>`; host.appendChild(d); setTimeout(() => d.remove(), 1300);
}
function czOpenCoffin(){""")
# 그리기: 예고 범위 · 눈 · 효과
rep("    drawFlame(tx, ty, ts * 0.32, t.dropped); }", """    drawFlame(tx, ty, ts * 0.32, t.dropped); }
  if (!ed) drawCzWarn(Wd, ox, oy, ts);   // v7.23.2 세자르 예고 범위
  if (!ed && Wd.snow) drawSnow(Wd);   // v7.23.2 권위의 눈""")
rep("// 관 속의 왕관 (반짝임) · 계단", """// v7.23.2 세자르의 예고: 하늘 가르기 = 끝까지 차오르는 가는 직선 · 관통 찌르기 = 붉은 직사각형 · 냉기 참격 = 부채꼴 · 마구 베기 = 표적 · 권위 = 손을 든 빛
function drawCzWarn(Wd, ox, oy, ts){
  const Z = Wd.rules.cz || {}, see = $('seeAll').checked;
  for (const u of Wd.units){ const A = u.act; if (!u.alive || !A || A.k !== 'cz' || !(u.side === 0 || u.seenBy || see)) continue;
    const el = Wd.t - A.t0, p = { x: ox + u.x * ts, y: oy + u.y * ts }; ctx.save();
    if (A.s === 'upcut' && el < (Z.upcut || {}).charge){ const S = Z.upcut, q = el / S.charge, L0 = S.len * ts * Math.min(1, q * 1.4); ctx.translate(p.x, p.y); ctx.rotate(A.ang || 0); ctx.fillStyle = `rgba(200,230,255,${(0.25 + 0.45 * q).toFixed(2)})`; const w = ts * (0.18 + 0.3 * q); ctx.fillRect(0, -w / 2, L0, w); ctx.strokeStyle = 'rgba(160,215,255,.7)'; ctx.lineWidth = 1; ctx.strokeRect(0, -S.w * ts, S.len * ts, S.w * ts * 2); }
    else if (A.s === 'thrust' && el < (Z.thrust || {}).charge){ const S = Z.thrust, q = el / S.charge; ctx.translate(p.x, p.y); ctx.rotate(A.ang || 0); ctx.fillStyle = `rgba(255,70,60,${(0.12 + 0.25 * q).toFixed(2)})`; ctx.fillRect(-0.2 * ts, -S.w * ts, (S.dash + 1) * ts, S.w * ts * 2); ctx.strokeStyle = 'rgba(255,90,80,.8)'; ctx.lineWidth = 1.5; ctx.strokeRect(-0.2 * ts, -S.w * ts, (S.dash + 1) * ts, S.w * ts * 2); }
    else if (A.s === 'wave' && el < (Z.wave || {}).charge){ const S = Z.wave, q = el / S.charge, a = A.ang || 0; ctx.fillStyle = `rgba(160,215,255,${(0.1 + 0.25 * q).toFixed(2)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.arc(p.x, p.y, S.r * ts * Math.min(1, 0.3 + q), a - S.half, a + S.half); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(160,215,255,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.arc(p.x, p.y, S.r * ts, a - S.half, a + S.half); ctx.closePath(); ctx.stroke(); }
    else if (A.s === 'ult' && !A.arr){ const tg = Wd.units[A.tb != null ? A.tb : A.b]; if (tg && tg.alive){ const g = { x: ox + tg.x * ts, y: oy + tg.y * ts }, rr = ts * 0.75, f = 0.6 + 0.4 * Math.sin(performance.now() / 70); ctx.strokeStyle = `rgba(255,60,60,${f.toFixed(2)})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(g.x, g.y, rr, 0, 6.283); ctx.moveTo(g.x - rr * 1.3, g.y); ctx.lineTo(g.x + rr * 1.3, g.y); ctx.moveTo(g.x, g.y - rr * 1.3); ctx.lineTo(g.x, g.y + rr * 1.3); ctx.stroke(); } }
    else if (A.s === 'auth' && !A.done){ const q = Math.min(1, el / ((Z.auth || {}).raise || 1.1)); const g0 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, ts * (1 + q)); g0.addColorStop(0, `rgba(240,210,120,${(0.45 * q).toFixed(2)})`); g0.addColorStop(1, 'rgba(240,210,120,0)'); ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(p.x, p.y, ts * (1 + q), 0, 6.283); ctx.fill(); }
    ctx.restore(); }
}
// v7.23.2 권위의 눈: 화면에 흩날리는 눈송이 (판 좌표와 상관없이)
function drawSnow(Wd){
  const w = cv.clientWidth, h = cv.clientHeight, t = performance.now() / 1000; ctx.save(); ctx.fillStyle = 'rgba(200,220,255,.05)'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = 'rgba(240,246,255,.85)';
  for (let k = 0; k < 70; k++){ const sx = (k * 97.3 + Math.sin(t * 0.7 + k) * 18 + t * 9 * (1 + k % 3)) % w, sy = (k * 53.1 + t * (28 + (k % 5) * 9)) % h, r = 1 + (k % 3) * 0.6; ctx.beginPath(); ctx.arc(sx, sy, r, 0, 6.283); ctx.fill(); }
  ctx.restore();
}
// 관 속의 왕관 (반짝임) · 계단""")
rep("    } else if (f.k === 'czWarn' && age < f.dur){", """    } else if (f.k === 'czCut' && age < 0.8){   // v7.23.2 하늘 가르기: 하늘까지 닿는 빛
      const q = age / 0.8; ctx.save(); ctx.translate(ox + f.x * ts, oy + f.y * ts); ctx.rotate(f.ang); ctx.fillStyle = `rgba(235,245,255,${(0.9 * (1 - q)).toFixed(2)})`; ctx.fillRect(0, -ts * 0.12 * (1 + q * 2), f.len * ts, ts * 0.24 * (1 + q * 2)); ctx.restore();
    } else if (f.k === 'czThr' && age < 0.4){   // 관통 찌르기
      const q = age / 0.4; ctx.save(); ctx.translate(ox + f.x * ts, oy + f.y * ts); ctx.rotate(f.ang); ctx.fillStyle = `rgba(255,120,100,${(0.7 * (1 - q)).toFixed(2)})`; ctx.fillRect(0, -ts * 0.15, (f.len + 0.8) * ts, ts * 0.3); ctx.restore();
    } else if (f.k === 'czFan' && age < 0.45){   // 냉기 참격
      const q = age / 0.45; ctx.fillStyle = `rgba(190,225,255,${(0.45 * (1 - q)).toFixed(2)})`; ctx.beginPath(); ctx.moveTo(ox + f.x * ts, oy + f.y * ts); ctx.arc(ox + f.x * ts, oy + f.y * ts, f.r * ts, f.ang - f.half, f.ang + f.half); ctx.closePath(); ctx.fill();
    } else if (f.k === 'czWarn' && age < f.dur){""")
# 이동 제약 표시
rep("    if (!ed && vis && u.alive && now < (u.frostT || -9)){", "    if (!ed && vis && u.alive && now < (u.hobbleT || -9)){ const fs = Math.max(10, Math.min(15, r * 0.45)); ctx.save(); ctx.font = `${fs}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('⛓', px, py + r * 0.95); ctx.restore(); }   // v7.23.2 이동 제약 (아래)\n    if (!ed && vis && u.alive && now < (u.frostT || -9)){")
rep('    ${!ed && u.alive && Wd.t < (u.frostT || -9) ?', '    ${!ed && u.alive && Wd.t < (u.hobbleT || -9) ? `<span class="tr" style="color:#cfe6ff"><span class="lb">이동 제약</span> ⛓ 걸음 ×0.4 · 못 뜀 · 스텝 · 도약 못 함 · ${f2(u.hobbleT - Wd.t)}초</span>` : \'\'}\n    ${!ed && u.alive && Wd.t < (u.frostT || -9) ?')
# 로그 · 이야기
rep("      case 'czCoffin': out.push(", """      case 'czAuth': out.push(`${T(e)}❄ 권위 발동 — 눈이 내리고 신성이 막힘`); break;   // v7.23.2
      case 'czShaken': out.push(`${T(e)}👑 ${n(e.a)} 휘청 — 권위가 흔들림 (6초)`); break;
      case 'czAuthBack': out.push(`${T(e)}❄ 권위가 다시 홀을 채움 — 눈`); break;
      case 'czCharge': out.push(`${T(e)}👑 ${n(e.a)} 검을 낮게 늘어뜨리고 숨을 고른다…`); break;
      case 'czUpcut': out.push(`${T(e)}⚔ 하늘 가르기 — ${e.n}명 절단`); break;
      case 'czGale': out.push(`${T(e)}🌪 갈라진 자리에서 폭풍`); break;
      case 'czThrust': out.push(`${T(e)}🗡 관통 찌르기 — ${e.n}명`); break;
      case 'czToss': out.push(`${T(e)}🗡 ${reul(n(e.b))} 꿰어 들어 올렸다가 내던짐`); break;
      case 'czWave': out.push(`${T(e)}❄ 냉기 참격 — ${e.n}명`); break;
      case 'czUltGo': out.push(`${T(e)}⚔ 마구 베기 → ${n(e.b)}`); break;
      case 'czUlt': out.push(`${T(e)}⚔ 마구 베기 ${e.n}번`); break;
      case 'czCoffin': out.push(""")
rep("    case 'czMode': return e.fury ?", """    case 'czAuth': return { c: 'bad', s: '❄ 권위 — 눈이 내리고 신성이 막힌다.' };   // v7.23.2
    case 'czShaken': return { c: 'good', s: '👑 세자르가 휘청인다 — 6초 동안 눈이 멎고 신성이 돌아온다!' };
    case 'czAuthBack': return { c: 'bad', s: '❄ 권위가 다시 홀을 채운다. 눈이 내린다.' };
    case 'czCharge': return { c: 'bad', s: '👑 세자르가 검을 낮게 늘어뜨리고 숨을 고른다…' };
    case 'czUpcut': return { c: 'bad', s: `⚔ 세자르의 하늘 가르기 — ${e.n}명 절단` };
    case 'czGale': return { c: 'bad', s: '🌪 갈라진 자리에서 폭풍이 터져 나온다' };
    case 'czThrust': return e.n ? { c: 'bad', s: `🗡 세자르의 관통 찌르기 — ${e.n}명 꿰뚫음` } : null;
    case 'czToss': return { c: 'bad', s: `🗡 ${reul(n(e.b))} 꿰어 들어 올렸다가 내던진다` };
    case 'czWave': return e.n ? { c: 'bad', s: `❄ 세자르의 냉기 참격 — ${e.n}명` } : null;
    case 'czUlt': return { c: 'bad', s: `⚔ 세자르 — 마구 베기 (${e.n}번)` };
    case 'czMode': return e.fury ?""")

open(F, 'w', encoding='utf-8').write(s)
print('page7232 OK')
