/* ---------- v8.1.0 챔피언 로드 — run8_c.js v1.0 (20층에서 MC 더 플링이 나온 뒤 ~ 29층: 관중 열기 · 응원 · 야유 · 축복 · 증오 · MC 실황 · 깜짝 규칙) ----------
   관중은 도전자 (우리) 를 본다. 열기 (0 ~ 100) 가 높으면 응원 · 축복, 낮으면 야유 · 증오가 쏟아진다.
   열기는 싸움으로 움직인다: 적을 쓰러뜨림 + · 동료가 쓰러짐 − · 이기면 + (정예 · 보스는 더) · 물러나면 크게 −.
   깜짝 규칙은 판 전체 (양쪽 같게) — 암전 · 상금 두 배 · 관중 열광 · 90초 승부. */
const CR8 = { gap: [11, 17], cheer: 1.12, cheerT: 8, boo: 0.9, booT: 6, bless: 0.15, hate: 0.04, kill: 3, down: -3, win: 5, winBig: 10, retreat: -12, clockT: 90 };
const crowdOn = () => { const R = R8S(); return !!R && R.on && R.f >= 21 && R.f < 30 && !!(R.flags || {}).mc; };
const MC8 = {
  start: ['자, 다음 무대! 도전자 입장합니다!', '여러분, 저 횃불 보이시죠? 아직 안 꺼졌습니다!', '오늘의 상대는… 굴의 토박이들! 텃세가 장난 아니에요!', '카메라 붙었습니다! 숨소리까지 들려요!'],
  kill: ['한 놈 넘어갑니다!', '깔끔해요, 깔끔해!', '이게 바로 챔피언 로드죠!', '관중석이 들썩입니다!'],
  down: ['아아— 쓰러졌습니다!', '이건 아프겠는데요…', '도전자 쪽에 구멍이 났어요!'],
  cheer: ['함성이 쏟아집니다!', '이름을 연호하는 관중들!', '박수 소리에 바닥이 울려요!'],
  boo: ['야유! 야유가 터집니다!', '관중들이 등을 돌려요…', '"지루하다!" 소리가 여기까지 들립니다!'],
  bless: ['누군가 꽃다발을 던졌습니다 — 축복이에요!', '관중석에서 약병이 굴러 옵니다!'],
  hate: ['빈 병이 날아옵니다! 관중이 화났어요!', '누가 돌을 던졌어요! 이건 반칙 아닌가요?'],
  win: ['승리! 승리입니다!', '도전자, 또 한 층을 뚫습니다!', '이 맛에 중계하죠!'],
  retreat: ['물러납니다… 관중들 실망이 커요.', '어어, 등을 보이네요?'],
  map: { hi: ['오늘 시청률 최고입니다! 다음 무대 기대하세요!', '관중들이 도전자의 이름을 외우기 시작했어요!'], mid: ['아직 판단하기 이릅니다, 여러분!', '다음 층, 어디로 갈까요? 저도 궁금합니다!'], lo: ['이대로면 시즌 최단 탈락입니다…', '관중들이 채널을 돌리고 있어요!'] } };
const CRULE8 = { none: null, dark: { name: '암전 경기', mc: '조명 끕니다! 횃불 하나에 모든 걸 거세요!', d: '판이 아주 어두워짐 (양쪽 모두)' }, gold: { name: '상금 두 배', mc: '이번 판은 상금 두 배! 스폰서님 감사합니다!', d: '이기면 동전 × 2' }, frenzy: { name: '관중 열광', mc: '관중석 문을 다 열었습니다! 오늘은 아무도 못 말려요!', d: '응원 · 야유가 두 배로 자주' }, clock: { name: '90초 승부', mc: '90초! 90초 안에 끝내면 보너스!', d: '90초 안에 끝내면 열기 +12 · 동전 +30 (넘기면 열기 −10)' } };
const crPick = L => L[Math.floor(Math.random() * L.length)];
function crHeat(d){ const R = R8S(); if (!R) return; R.crowd = Math.max(0, Math.min(100, (R.crowd == null ? 50 : R.crowd) + d)); }
function crSay(W, s, c){ logEv(W, { k: 'r8', s: '🎤 ' + s, c: c || 'dim', vis: true }); }
// 판을 만들기 전: 깜짝 규칙 (여정의 싸움 · 정예 칸만)
function r8CrowdRule(n){
  if (!crowdOn() || !['fight', 'elite'].includes(n.t)) return null;
  const k = Math.random() < 0.4 ? 'none' : crPick(['dark', 'gold', 'frenzy', 'clock']);
  if (k === 'dark') S.amb = Math.min(S.amb, 0.12);
  return k;
}
// 들어설 때 MC 한마디 (대화 맨 앞)
function r8CrowdIntro(n, rule){
  const R = R8S(), r = CRULE8[rule], L = [{ t: crPick(MC8.start), name: 'MC 더 플링' }];
  if (r) L.push({ t: r.mc, name: 'MC 더 플링' }, { box: `깜짝 규칙 — ${r.name}: ${r.d}` });
  L.push({ narr: R.crowd >= 70 ? '관중석이 들끓는다. 이름을 부르는 소리가 들린다.' : R.crowd < 35 ? '관중석에서 야유가 먼저 쏟아진다.' : '수만 개의 눈이 우리를 내려다본다.' });
  return L;
}
// 판마다 (r8Tick 에서): 쓰러짐 셈 · 관중의 응원 · 야유 · 축복 · 증오
function r8CrowdTick(W){
  if (!crowdOn() || !W || !W.r8 || W.over) return; const R = R8S();
  const C = W.r8c || (W.r8c = { next: W.t + 6, a: W.units.filter(u => u.side === 0 && u.alive).length, f: W.units.filter(u => u.side === 1 && u.alive).length, fx: [] });
  const a = W.units.filter(u => u.side === 0 && u.alive).length, f = W.units.filter(u => u.side === 1 && u.alive).length;
  if (f < C.f){ crHeat(CR8.kill * (C.f - f)); if (Math.random() < 0.45) crSay(W, crPick(MC8.kill), 'good'); }
  if (a < C.a){ crHeat(CR8.down * (C.a - a)); crSay(W, crPick(MC8.down), 'bad'); }
  C.a = a; C.f = f;
  for (const e of C.fx.splice(0)){ if (W.t < e.t1){ C.fx.push(e); continue; } const u = W.units[e.i]; if (u){ if (e.k === 'atk') u.atk = Math.round(u.atk / CR8.cheer); if (e.k === 'spd') u.spd /= CR8.boo; } }
  if (W.t < C.next || W.cleared) return;
  const g = CR8.gap[0] + Math.random() * (CR8.gap[1] - CR8.gap[0]); C.next = W.t + ((W.r8.rule === 'frenzy') ? g / 2 : g);
  const al = W.units.filter(u => u.side === 0 && u.alive && !u.gone); if (!al.length) return;
  const h = R.crowd, r = Math.random();
  const k = h >= 70 ? (r < 0.6 ? 'cheer' : r < 0.85 ? 'bless' : null) : h >= 40 ? (r < 0.5 ? 'cheer' : r < 0.7 ? 'boo' : null) : (r < 0.4 ? 'boo' : r < 0.75 ? 'hate' : null);
  if (!k) return;
  const u = k === 'bless' ? al.slice().sort((p, q) => p.hp / p.max - q.hp / q.max)[0] : crPick(al), fx = (s, c) => { if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y - 0.4, s, c, t0: W.t }); };
  if (k === 'cheer'){ u.atk = Math.round(u.atk * CR8.cheer); C.fx.push({ i: u.i, k: 'atk', t1: W.t + CR8.cheerT }); crSay(W, `${crPick(MC8.cheer)} — ${u.name} 공격 +12% (${CR8.cheerT}초)`, 'good'); fx('📣 응원', 'h'); crHeat(1); }
  if (k === 'boo'){ u.spd *= CR8.boo; C.fx.push({ i: u.i, k: 'spd', t1: W.t + CR8.booT }); crSay(W, `${crPick(MC8.boo)} — ${u.name} 움찔 (빠르기 −10%, ${CR8.booT}초)`, 'bad'); fx('👎 야유', 'd'); }
  if (k === 'bless'){ const amt = Math.max(1, Math.round(u.max * CR8.bless)); u.hp = Math.min(u.max, u.hp + amt); crSay(W, `${crPick(MC8.bless)} — ${u.name} +${amt}`, 'good'); fx('💐 축복 +' + amt, 'h'); }
  if (k === 'hate'){ const amt = Math.max(1, Math.round(u.max * CR8.hate)); u.hp = Math.max(1, u.hp - amt); crSay(W, `${crPick(MC8.hate)} — ${u.name} −${amt}`, 'bad'); fx('🍾 증오 −' + amt, 'd'); }
  (R.crowdLog = R.crowdLog || []).push({ f: R.f, k, who: u.name, t: +W.t.toFixed(1) }); if (R.crowdLog.length > 60) R.crowdLog.shift();
}
// 판이 끝날 때 (r8Over): 열기 · 상금 배율 · 규칙 보너스
function r8CrowdOver(W, node, win, retreat){
  const out = { mul: 1, add: 0, txt: [] }; if (!crowdOn() || !W || !W.r8) return out; const R = R8S(), rule = W.r8.rule;
  if (retreat){ crHeat(CR8.retreat); out.txt.push('👎 관중 실망 (열기 ' + CR8.retreat + ')'); return out; }
  if (!win) return out;
  crHeat(node.t === 'elite' || node.t === 'boss' ? CR8.winBig : CR8.win);
  if (rule === 'gold'){ out.mul *= 2; out.txt.push('💰 상금 두 배'); }
  if (rule === 'clock'){ if (W.t <= CR8.clockT){ crHeat(12); out.add += 30; out.txt.push('⏱ 90초 안에 — 보너스 +30'); } else { crHeat(-10); out.txt.push('⏱ 90초를 넘김 (열기 −10)'); } }
  out.mul *= Math.max(0.75, Math.min(1.25, 1 + (R.crowd - 50) / 200));
  out.txt.push(`🔥 관중 열기 ${Math.round(R.crowd)}`);
  return out;
}
// 지도에서: MC 한마디
function r8McLine(){ const R = R8S(); if (!crowdOn()) return ''; const L = R.crowd >= 70 ? MC8.map.hi : R.crowd < 35 ? MC8.map.lo : MC8.map.mid; return L[(R.f + R.done.length) % L.length]; }
