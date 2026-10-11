/* rogue.js v1.0 — (v0.89) 원정의 로그라이크 결 (민수 · ROGUELIKE_PLAN.md v1.1)
   ■ 그림 카드 창: 그림 · 이름 · 글 · 선택지 (숫자 키 1 ~ 4 또는 누르기). 열려 있는 동안 게임은 멈춤
   ■ 인카운터 문: 인카운터 방은 문으로 닫혀 있음 (문을 달아도 길이 안 끊기는 방만 — dungeon.js r.ents)
     · 문 앞에서 E → 소리 · 빛 · 냄새 카드 → 연다 / 그냥 둔다 (안 열고 지나가도 됨)
     · 들어가면 그 인카운터의 그림 카드 + 선택지. 보기만 하던 인카운터에도 선택지 · 작은 상자 (민수 답)
   ■ 새 문 이벤트 (도감 인카운터 카드 그림): 샘 · 미믹 · 거울 · 나그네 · 쓰러진 낙하자 · 버려진 배낭
     · 나그네 · 쓰러진 낙하자는 동료가 될 수 있음 (capture.js — 데리고 굴까지 살아 돌아오면 굴 식구)
   ■ 갈림길: 계단에서 길 셋 중 하나 (조용한 노인의 이야기를 들었으면 넷) — 보물 · 사냥 · 문 · 조용한 · 상인 · 붉은 일식
     · 고른 길이 다음 층의 방 구성을 바꿈 (dungeon.js · encounters.js · 이 파일의 붉은 일식) */
'use strict';
const CA = 'art/card/';
// ---------- 창 꾸미기 (index.html 의 색 · 글꼴 그대로: --gold · --ink · --dim · 도현체 제목 · 나눔고딕 글) ----------
(function(){
  const st = document.createElement('style');
  st.textContent = `
#rgCard{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;
  background:radial-gradient(ellipse at center,rgba(20,14,26,.55) 0%,rgba(5,4,6,.88) 70%);}
#rgCard[hidden]{display:none}
#rgCard .rg-box{position:relative;display:flex;gap:20px;align-items:stretch;width:min(780px,100%);max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;
  background:linear-gradient(180deg,rgba(22,17,30,.98),rgba(10,8,14,.98));border:1px solid var(--gold);border-radius:12px;padding:18px;
  box-shadow:0 18px 60px rgba(0,0,0,.75),inset 0 0 0 1px rgba(232,194,122,.08);animation:rgIn .32s cubic-bezier(.2,.9,.3,1.2)}
#rgCard .rg-box::before{content:'';position:absolute;inset:6px;border:1px solid rgba(232,194,122,.14);border-radius:8px;pointer-events:none}
@keyframes rgIn{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:none}}
#rgCard .rg-art{flex:0 0 230px;min-height:276px;border-radius:8px;background:#0a080e center/cover no-repeat;border:1px solid rgba(232,194,122,.45);
  box-shadow:0 6px 20px rgba(0,0,0,.6),inset 0 0 30px rgba(0,0,0,.55)}
#rgCard .rg-body{display:flex;flex-direction:column;gap:10px;min-width:0;flex:1}
#rgCard .rg-kicker{font-family:"Do Hyeon",sans-serif;font-size:13px;letter-spacing:3px;color:var(--dim)}
#rgCard .rg-title{font-family:"Do Hyeon",sans-serif;font-size:26px;color:var(--gold);line-height:1.15;text-shadow:0 2px 10px #000}
#rgCard .rg-text{margin:0;font-size:14.5px;line-height:1.65;color:var(--ink);white-space:pre-line}
#rgCard .rg-ch{display:flex;flex-direction:column;gap:7px;margin-top:auto;padding-top:6px}
#rgCard .rg-ch button{display:flex;gap:10px;align-items:flex-start;text-align:left;background:rgba(255,255,255,.035);border:1px solid rgba(232,194,122,.28);
  border-left:3px solid rgba(232,194,122,.55);border-radius:7px;color:var(--ink);padding:9px 12px;font:14.5px "Nanum Gothic",sans-serif;cursor:pointer;transition:background .12s,border-color .12s,transform .12s}
#rgCard .rg-ch button:hover,#rgCard .rg-ch button:focus-visible{background:rgba(232,194,122,.12);border-color:var(--gold);transform:translateX(3px);outline:none}
#rgCard .rg-ch kbd{flex:none;font-family:"Do Hyeon",sans-serif;font-size:13px;color:#1a1008;background:var(--gold);border-radius:3px;padding:1px 7px;margin-top:1px}
#rgCard .rg-ch .rg-t{display:block;font-weight:700}
#rgCard .rg-ch small{display:block;color:var(--dim);font-size:12.5px;margin-top:2px;font-weight:400}
#rgCard .rg-ch button:disabled{opacity:.4;cursor:default;transform:none}
#rgCard .rg-res{font-family:"Do Hyeon",sans-serif;font-size:17px;color:#bfe8c8;min-height:0}
/* 갈림길 */
#rgCard .rg-map{flex-direction:column;align-items:center;width:min(900px,100%);padding:0 0 18px}
#rgCard .rg-banner{position:relative;align-self:stretch;height:120px;border-radius:11px 11px 0 0;background:#0a080e center/cover no-repeat;border-bottom:1px solid var(--line)}
#rgCard .rg-banner::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,8,14,.1),rgba(10,8,14,.92))}
#rgCard .rg-banner .rg-bt{position:absolute;left:22px;right:22px;bottom:12px;z-index:1;white-space:nowrap}
#rgCard .rg-path{display:flex;align-items:center;gap:8px;margin:12px 0 4px;font-family:"Do Hyeon",sans-serif;font-size:14px;color:var(--dim)}
#rgCard .rg-path i{display:inline-block;width:10px;height:10px;border-radius:50%;border:1px solid var(--gold);background:var(--gold)}
#rgCard .rg-path i.n{background:transparent}
#rgCard .rg-path s{display:inline-block;width:46px;height:0;border-top:1px dashed rgba(232,194,122,.5)}
#rgCard .rg-routes{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;padding:6px 18px 0}
#rgCard .rg-route{width:190px;display:flex;flex-direction:column;align-items:stretch;gap:8px;background:rgba(255,255,255,.03);border:1px solid rgba(232,194,122,.28);border-radius:10px;
  padding:10px;cursor:pointer;color:var(--ink);font:14px "Nanum Gothic",sans-serif;text-align:left;transition:transform .15s,border-color .15s,background .15s}
#rgCard .rg-route:hover,#rgCard .rg-route:focus-visible{transform:translateY(-4px);border-color:var(--gold);background:rgba(232,194,122,.09);outline:none}
#rgCard .rg-route .rg-art{flex:none;min-height:0;height:206px;width:100%}
#rgCard .rg-route b{font-family:"Do Hyeon",sans-serif;font-weight:400;font-size:19px;color:var(--gold)}
#rgCard .rg-route small{color:var(--dim);font-size:12.5px;line-height:1.5}
#rgCard .rg-route kbd{align-self:flex-start;font-family:"Do Hyeon",sans-serif;font-size:13px;color:#1a1008;background:var(--gold);border-radius:3px;padding:1px 7px}
#rgCard .rg-stay{margin-top:14px;background:none;border:0;color:var(--dim);font:13px "Nanum Gothic",sans-serif;cursor:pointer;text-decoration:underline}
@media (max-width:640px){
  #rgCard .rg-box{flex-direction:column;align-items:stretch;padding:14px;gap:12px}
  #rgCard .rg-art{flex:none;min-height:0;height:190px}
  #rgCard .rg-title{font-size:22px}
  #rgCard .rg-route{width:calc(50% - 7px);padding:8px}
  #rgCard .rg-route .rg-art{height:150px}
}`;
  document.head.appendChild(st);
})();
const RG = { open: false };
function rgEl(){ let el = document.getElementById('rgCard'); if (!el){ el = document.createElement('div'); el.id = 'rgCard'; el.hidden = true; document.body.appendChild(el); } return el; }
const rgArt = src => `background-image:url('${artSrc(src)}')`;
// 그림 카드: o = { img, kicker, title, text, choices: [{ t, sub, dis }] } → 고른 번호 (Promise)
function rgCard(o){
  return new Promise(res => {
    const el = rgEl(), wasP = G.paused; G.paused = true; RG.open = true;
    el.innerHTML = `<div class="rg-box"><div class="rg-art" style="${rgArt(o.img || CA + 'c17.webp')}"></div><div class="rg-body">
      ${o.kicker ? `<div class="rg-kicker">${o.kicker}</div>` : ''}<div class="rg-title">${o.title}</div><p class="rg-text">${o.text || ''}</p>
      <div class="rg-ch">${o.choices.map((c, i) => `<button data-i="${i}" ${c.dis ? 'disabled' : ''}><kbd>${i + 1}</kbd><span><span class="rg-t">${c.t}</span>${c.sub ? `<small>${c.sub}</small>` : ''}</span></button>`).join('')}</div></div></div>`;
    el.hidden = false;
    const done = i => { const c = o.choices[i]; if (!c || c.dis) return; el.hidden = true; el.onclick = null; document.removeEventListener('keydown', key, true); G.paused = wasP; RG.open = false; res(i); };
    const key = e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= o.choices.length){ e.preventDefault(); e.stopPropagation(); done(n - 1); } else if (e.key !== 'F5' && e.key !== 'F12') { e.stopPropagation(); } };
    el.onclick = e => { const b = e.target.closest('button[data-i]'); if (b) done(+b.dataset.i); };
    document.addEventListener('keydown', key, true);
    setTimeout(() => { const b = el.querySelector('button[data-i]:not([disabled])'); b && b.focus({ preventScroll: true }); }, 30);
  });
}
// 결과 한 줄 (카드 뒤 머리 위 글 + 아래 자막)
function rgSay(text, kind = 'heal'){ const pl = G.player; if (pl) popText(pl.x, pl.y + 2.4, pl.z, text, kind, 1.6); }

/* ---------- 원정대에 주는 것 ---------- */
const rgMates = () => allies().filter(u => u.hero && !u.dead);
function rgHeal(f){ for (const u of rgMates()) if (!u.downed) u.hp = Math.min(u.max, u.hp + u.max * f); }
function rgSan(n){ for (const u of rgMates()) u.hero.san = Math.max(0, Math.min(derive(u.hero).maxSan, (u.hero.san ?? 50) + n)); }
function rgStatus(k, v){ for (const u of rgMates()) if (typeof addStatus === 'function') addStatus(u, k, v); }
function rgDrop(id, x, z){ const pl = G.player; dropLootAt(x ?? pl.x, z ?? pl.z, id); }
function rgChest(r, dx = 0, dz = 0, o = {}){ const p = encSpot(r, dx, dz); makeChest(p.x, p.z, EXP.F, { plus: o.plus || 0, bonus: o.bonus || 0.1 }); dust(p.x, p.z, 6); }
// 이 층 동안만 (층을 내려가면 원정대가 새로 서며 사라짐)
function rgFloorBuff(name, txt, on, off){ for (const u of rgMates()) addBuff(u, 'rg_' + name, 9999, on, off); EXP.blessing = txt; }
function rgUseInspect(mark){ const it = G.inspect.find(o => o.mark === mark && !o.used); if (it){ it.fn(); if (it.once) it.used = true; } }
const rgPick = a => a[Math.floor(Math.random() * a.length)];

/* ---------- 인카운터마다: 문 너머 기척 · 들어갈 때의 카드 · 선택지 ---------- */
// choices(E, r) → [{ t, sub, fn }]. fn 이 없으면 그냥 닫힘 (방 안의 것과 직접 해 봄)
const RG_ENC = {
  deadHero: { img: EA + 'deadhero.webp', col: 0xfff0c0, hint: '찬 바람과 함께 오래된 쇠 냄새가 새어 나온다.',
    choices: (E, r) => [
      { t: '소지품을 뒤진다', sub: '쓸 만한 장비 하나 · 모두 정신도 −8', fn: () => { rgDrop(rollItem(EXP.F, { type: 'gear', plus: 1 }), r.cx, r.cz + 1); rgSan(-8); rgSay('…미안하다'); } },
      { t: '눈을 감겨 준다', sub: '모두 정신도 +10', fn: () => { rgSan(10); rgSay('그의 발이 바닥에서 떨어진 것 같다'); } },
      { t: '지나간다' }] },
  brainFrame: { img: EA + 'H-329.webp', col: 0xffe0b0, hint: '문 너머에서 노인들이 끝없이 토론하는 소리가 들린다.',
    choices: () => [
      { t: '토론에 끼어든다', sub: '반반: 이 층 지도가 보임 · 아니면 모두 혼란', fn: () => { if (Math.random() < 0.5){ expReveal(false); rgSay('"…그렇군! 자네 뇌는 제자리에 있었어"'); } else { rgStatus('confuse', { t: 4 }); rgSan(-5); rgSay('무슨 소린지 모르겠다', 'miss'); } } },
      { t: '다가간다', sub: '액자를 떼어 갈 수도 있다 (노인들이 화낸다)' },
      { t: '지나간다' }] },
  chatter: { img: EA + 'H-334.webp', col: 0xff9a9a, hint: '누군가 당신 이름을 부르며 킥킥거린다.',
    choices: E => [
      { t: '끝까지 들어 준다', sub: '이 층 적이 지도에 보임 · 모두 정신도 −12 · 입이 만족하고 닫힘', fn: () => { EXP.radar = true; rgSan(-12); const d = E.r.encData || {}; if (d.u && !d.u.dead){ d.done = true; removeUnit(d.u); } rgSay('"…다 들었지? 그럼 됐어"'); } },
      { t: '입을 친다', sub: '싸운다 — 닫히면 금화', fn: () => { const d = E.r.encData || {}; if (d.u){ d.u.alert = true; d.u.seen = G.t; } } },
      { t: '지나간다' }] },
  beach: { img: EA + 'H-337.webp', col: 0xffe8b0, hint: '파도 소리. …이 아래에서, 파도 소리?',
    choices: (E, r) => [
      { t: '옆에 누워 파도 소리를 듣는다', sub: '모두 체력 +35% · 정신도 +6 · 횃불 40초', fn: () => { rgHeal(0.35); rgSan(6); EXP.torchT = Math.max(5, (EXP.torchT || 0) - 40); rgSay('시간이 조금 흘렀다'); } },
      { t: '말을 건다', sub: '관심은 없어 보인다', fn: () => { rgDrop(rollItem(EXP.F, { type: 'cons' }), r.cx + 1, r.cz); rgSay('"…관심 없어." 등 뒤로 뭔가를 툭 던진다'); } },
      { t: '지나간다' }] },
  eyeRoom: { img: EA + 'H-339.webp', col: 0xffd0d0, hint: '문틈으로 무언가가 깜빡인다. 아주 많이.',
    choices: (E, r) => [
      { t: '눈을 밟으며 가로지른다', sub: '방 끝의 작은 상자 · 모두 정신도 −10', fn: () => { rgChest(r, 0, Math.floor(r.h / 2) - 1, { bonus: 0.25 }); rgSan(-10); } },
      { t: '눈을 감고 더듬어 간다', sub: '반반: 상자 · 아니면 넘어짐 (인주 체력 −15%)', fn: () => { if (Math.random() < 0.5) rgChest(r, 0, Math.floor(r.h / 2) - 1); else { const pl = G.player; pl.hp = Math.max(1, pl.hp - pl.max * 0.15); rgSay('미끄러졌다', 'miss'); } } },
      { t: '돌아간다' }] },
  tehera: { img: EA + 'tehera_sit.webp', col: 0xc8e8ff, hint: '문틈으로 빛가루가 흘러나온다.',
    choices: () => [{ t: '다가간다', sub: '손을 내밀어 볼 수 있다' }, { t: '조용히 지나간다' }] },
  crabChef: { img: EA + 'crabchef.webp', col: 0xffc080, hint: '고소한 냄새. 무언가를 굽는 냄새다.',
    choices: () => [{ t: '다가간다', sub: '음식을 판다' }, { t: '지나간다' }] },
  smoker: { img: EA + 'H-341.webp', col: 0xd8c8a8, hint: '오래된 담배 냄새가 난다.',
    choices: () => [
      { t: '담배 한 대 얻는다', sub: '보물 방이 표시됨 · 모두 정신도 +12', fn: () => rgUseInspect('노인') },
      { t: '이야기를 듣는다', sub: '다음 갈림길에서 길이 하나 더 보임 · 정신도 +4', fn: () => { EXP.routeExtra = EXP.F; rgSan(4); rgSay('"난 그냥 낙오자야. 아래로 가는 길은 많지"'); } },
      { t: '지나간다' }] },
  dancers: { img: EA + 'H-348.webp', col: 0xff9ad8, hint: '북소리와 진하고 달콤한 향.',
    choices: () => [
      { t: '같이 춘다', sub: '이 층: 이동 +12% · 회피 +6 · 모두 정신도 −5 (향에 취함)', fn: () => { rgFloorBuff('dance', '무희의 발걸음: 이 층에서 이동 +12% · 회피 +6', u => { u.spd *= 1.12; u.eva = (u.eva || 0) + 0.06; }, u => applyHero(u, u.hero)); rgSan(-5); } },
      { t: '숨을 참고 구경만 한다', sub: '모두 정신도 +8', fn: () => rgSan(8) },
      { t: '지나간다' }] },
  pigGod: { img: EA + 'piggod.webp', col: 0xffd0b0, hint: '꿀꿀거리는 소리. 아주 많다.',
    choices: (E, r) => [
      { t: '다가간다', sub: '선물을 준다고 한다' },
      { t: '고깃덩이 돼지를 몇 마리 얻는다', sub: '고기 셋 (굴로 가져가면 보급)', fn: () => { for (let i = 0; i < 3; i++) rgDrop('I-043', r.cx, r.cz + 1); rgSay('"또 낳았어!"'); } },
      { t: '지나간다' }] },
  axeHole: { img: CA + 'c08.webp', col: 0x5aa0ff, hint: '푸른 빛이 문틈으로 번진다. 쇠를 가는 소리.',
    choices: E => [{ t: '들어간다', sub: '구멍을 지키는 자가 있다 — 쓰러뜨리면 그의 도끼', fn: () => { const d = E.r.encData || {}; if (d.e){ d.e.alert = true; d.e.seen = G.t; } } }, { t: '물러난다', sub: '아직은 아니다', fn: () => rgRetreat(E) }] },
  pearl: { img: CA + 'c20.webp', col: 0x9090b0, hint: '창끝이 바닥을 긁는 소리.',
    choices: E => [{ t: '들어간다', sub: '검은 날개가 기다린다', fn: () => { const d = E.r.encData || {}; if (d.e){ d.e.alert = true; d.e.seen = G.t; caption('인공타천사 펄', '검은 날개가 펼쳐진다'); } } }, { t: '물러난다', sub: '아직은 아니다', fn: () => rgRetreat(E) }] },
  conveyor: { img: EA + 'H-342.webp', col: 0xb0b0c0, hint: '끝없이 무언가 굴러가는 소리.',
    choices: (E, r) => [
      { t: '줄에 선다', sub: '횃불 60초 · 끝에서 무언가를 받음', fn: () => { EXP.torchT = Math.max(5, (EXP.torchT || 0) - 60); const q = Math.random();
        if (q < 0.3) rgDrop(rollItem(EXP.F, { type: 'relic' }), r.cx, r.cz); else if (q < 0.8) rgDrop(rollItem(EXP.F, { type: 'cons' }), r.cx, r.cz); else { rgStatus('confuse', { t: 5 }); rgSay('끝에서 받은 건… 아무것도 아니었다', 'miss'); } } },
      { t: '새치기한다', sub: '줄 선 것들이 돌아본다 — 싸움 · 장비', fn: () => { for (let i = 0; i < 2; i++){ const p = encSpot(r, i ? 1 : -1, 0), e = spawnFoe('foeCultist', p.x, p.z, EXP.F, 'r' + r.id); e.alert = true; e.D = { ...e.D, name: '줄 선 자' }; } rgDrop(rollItem(EXP.F, { type: 'gear' }), r.cx, r.cz); } },
      { t: '지나간다' }] },
};

/* ---------- 새 문 이벤트 (도감 인카운터 카드) ---------- */
Object.assign(ENC, {
  spring:   { F: [1, 10], w: 2 }, mimic: { F: [2, 10], w: 2 }, mirror: { F: [3, 10], w: 1 },
  traveler: { F: [1, 10], w: 2 }, fallen: { F: [2, 10], w: 2 }, bag: { F: [1, 10], w: 2 },
});
Object.assign(ENC_TEXT, {
  spring: '이끼 낀 돌 틈에서 맑은 물이 솟는다. 위에서 버려진 물일 것이다. …정말 물일까?',
  mimic: '방 한가운데 보물상자가 하나. 너무 덩그러니 놓여 있다.',
  mirror: '깨진 금테 거울. 비친 당신의 등 뒤에 누군가 서 있다. 돌아보면 아무도 없다.',
  traveler: '지팡이를 짚은 나그네. 떨어진 지 얼마 안 된 얼굴이다. 아직 눈이 맑다.',
  fallen: '갓 떨어진 듯한 낙하자가 쓰러져 있다. 숨은 붙어 있다.',
  bag: '발자국 옆에 누군가 두고 간 배낭. 주인은 돌아오지 않을 것 같다.',
});
Object.assign(ENC_FILL, {
  spring(r){ const p = encSpot(r); const m = new THREE.Mesh(new THREE.CircleGeometry(1.1, 28), new THREE.MeshBasicMaterial({ color: 0x5fe0d8, transparent: true, opacity: 0.55 }));
    m.rotation.x = -Math.PI / 2; m.position.set(p.x, heightAt(G.map, p.x, p.z) + 0.03, p.z); G.scene.add(m); G.props.push(m); addSource(p.x, p.z, 4, 0x5fffd8, 0.7, 2); r.encData = { p, m }; },
  mimic(r){ const p = encSpot(r); r.encData = { p, b: dbill(DA + 'H-128.webp', p.x, p.z, 0.7, { fit: 1.1 }) }; addSource(p.x, p.z, 3, 0xffe9a0, 0.5, 1.6); },
  mirror(r){ const p = encSpot(r, 0, -Math.floor(r.h / 2) + 1); r.encData = { p }; addSource(p.x, p.z, 3.4, 0xc8c0ff, 0.6, 1.8); },
  traveler(r){ const p = encSpot(r); r.encData = { p, slug: typeof capPickSlug === 'function' ? capPickSlug(EXP.F) : null }; if (r.encData.slug && typeof capShowNpc === 'function') r.encData.u = capShowNpc(r.encData.slug, p.x, p.z, 'stand'); addSource(p.x, p.z, 3.4, 0xffe0b0, 0.6, 2); },
  fallen(r){ const p = encSpot(r); r.encData = { p, slug: typeof capPickSlug === 'function' ? capPickSlug(EXP.F) : null }; if (r.encData.slug && typeof capShowNpc === 'function') r.encData.u = capShowNpc(r.encData.slug, p.x, p.z, 'down'); addSource(p.x, p.z, 3, 0xffc0a0, 0.5, 2); },
  bag(r){ const p = encSpot(r); r.encData = { p }; dbill(DA + 'H-130.webp', p.x, p.z, 0.6, { fit: 1 }); },
});
Object.assign(RG_ENC, {
  spring: { img: CA + 'c05.webp', col: 0x5fffd8, hint: '물 흐르는 소리가 난다.',
    choices: () => [
      { t: '마신다', sub: '대개는 모두 체력 +40% · 가끔은 독', fn: () => { if (Math.random() < 0.7){ rgHeal(0.4); rgSay('맑다. 진짜 물이었다'); } else { rgStatus('poison', { dps: 3, t: 6 }); rgSay('…물이 아니었다', 'miss'); } } },
      { t: '물을 담아 간다', sub: '빨간 물약 하나', fn: () => rgDrop('I-037') },
      { t: '지나간다' }] },
  mimic: { img: CA + 'c15.webp', col: 0xffe9a0, hint: '안쪽에서 무언가 숨 쉬는 소리. …기분 탓일까.',
    choices: E => [
      { t: '연다', sub: '보물이거나, 이빨이거나', fn: () => { const d = E.r.encData; if (d.b) d.b.g.visible = false; if (Math.random() < 0.55){ makeChest(d.p.x, d.p.z, EXP.F, { plus: 1, bonus: 0.2 }); rgSay('진짜 상자였다'); } else { const pl = G.player; pl.hp = Math.max(1, pl.hp - pl.max * 0.25); if (typeof addStatus === 'function') addStatus(pl, 'bleed', { dps: 2, t: 5 }); camShake(0.3, 0.3); rgSay('물렸다!', 'crit'); } } },
      { t: '창으로 쿡 찔러 본다', sub: '안전하게 — 대신 덜 얻음', fn: () => { const d = E.r.encData; if (Math.random() < 0.5){ dropLootAt(d.p.x, d.p.z, { gold: 20 * EXP.F }); rgSay('그냥 상자. 금화가 쏟아진다'); } else rgSay('찔린 상자가 "끼익" 하고 이빨을 다문다…', 'miss'); } },
      { t: '지나간다' }] },
  mirror: { img: CA + 'c19.webp', col: 0xc8c0ff, hint: '문틈으로 당신과 똑같은 숨소리가 들린다.',
    choices: () => [
      { t: '들여다본다', sub: '이 층: 치명 +8% · 모두 정신도 −10', fn: () => { rgFloorBuff('mirror', '거울의 눈: 이 층에서 치명 +8%', u => { u.critP = (u.critP || 0) + 0.08; }, u => applyHero(u, u.hero)); rgSan(-10); } },
      { t: '깨뜨린다', sub: '드물게 유물 · 대개는 저주 (이 층 공격 −10%)', fn: () => { if (Math.random() < 0.3) rgDrop(rollItem(EXP.F, { type: 'relic' })); else rgFloorBuff('mirrorCurse', '깨진 거울의 저주: 이 층에서 공격 −10%', u => { u.atk = Math.round(u.atk * 0.9); }, u => applyHero(u, u.hero)); } },
      { t: '지나간다' }] },
  traveler: { img: CA + 'c10.webp', col: 0xffe0b0, hint: '누군가 지팡이로 바닥을 두드리는 소리.',
    choices: E => { const d = E.r.encData || {}, nm = d.slug && DEFS['h2_' + d.slug] ? DEFS['h2_' + d.slug].name : '나그네';
      return [
        { t: '함께 가자고 한다', sub: d.slug ? `${nm} — 굴까지 살아서 데려가면 굴 식구가 된다` : '아무도 없다', dis: !d.slug, fn: () => typeof capJoinWalk === 'function' && capJoinWalk(d.slug, d.u, '동행') },
        { t: '보급을 나눠 준다', sub: '모두 정신도 +10 · 그가 본 것 (이 층 지도)', fn: () => { rgSan(10); expReveal(false); if (d.u) say(d.u, '…고마워. 저쪽이야', '', 2.4); } },
        { t: '지나간다' }]; } },
  fallen: { img: CA + 'U-015.webp', col: 0xffc0a0, hint: '앓는 소리가 들린다.',
    choices: E => { const d = E.r.encData || {}, nm = d.slug && DEFS['h2_' + d.slug] ? DEFS['h2_' + d.slug].name : '낙하자';
      return [
        { t: '데려간다', sub: d.slug ? `${nm} — 다쳐 있다. 굴까지 지켜 가면 굴 식구가 된다` : '아무도 없다', dis: !d.slug, fn: () => typeof capJoinWalk === 'function' && capJoinWalk(d.slug, d.u, '부상자') },
        { t: '소지품만 챙긴다', sub: '소모품 하나 · 모두 정신도 −6', fn: () => { rgDrop(rollItem(EXP.F, { type: 'cons' })); rgSan(-6); } },
        { t: '지나간다' }]; } },
  bag: { img: CA + 'U-104.webp', col: 0xd8c8a8, hint: '바스락거리는 소리. 쥐일까.',
    choices: () => [
      { t: '뒤진다', sub: '소모품 둘 · 가끔 독침', fn: () => { rgDrop(rollItem(EXP.F, { type: 'cons' })); rgDrop(rollItem(EXP.F, { type: 'cons' })); if (Math.random() < 0.2){ if (typeof addStatus === 'function') addStatus(G.player, 'poison', { dps: 3, t: 5 }); rgSay('독침!', 'miss'); } } },
      { t: '그대로 둔다', sub: '누군가 돌아올지도 모른다 · 모두 정신도 +3', fn: () => rgSan(3) }] },
});

/* ---------- 들어갈 때: 그림 카드 ---------- */
// 물러난다: 방 밖, 마지막으로 서 있던 자리로 (원정대도 함께). 다시 들어가면 카드가 또 뜸
function rgRetreat(E){
  const p = RG.lastOut; E.entered = false; E.done = false; if (!p) return;
  const pl = G.player; for (const u of allies()) if (u === pl || inRoom(E.r, u)){ const a = Math.random() * 6.28, k = u === pl ? 0 : 0.9; u.x = p.x + Math.cos(a) * k; u.z = p.z + Math.sin(a) * k; }
  camSnapTo(p.x, p.z);
}
async function rgEnter(E){
  if (E.done) return; E.done = true;
  if (E.key === 'pearl' && E.r.encData) E.r.encData.met = true;   // 카드에서 고를 때까지 깨우지 않음
  const H = RG_ENC[E.key]; if (!H){ guide(ENC_TEXT[E.key], 8); return; }
  const C = H.choices(E, E.r), i = await rgCard({ img: H.img, kicker: `${EXP.F}층 · 문 너머`, title: rgTitle(E.key), text: ENC_TEXT[E.key], choices: C });
  const c = C[i]; if (c && c.fn) c.fn();
}
const RG_TITLE = { deadHero: '얼어붙은 영웅', brainFrame: '액자 속 뇌', chatter: '지껄이는 입', beach: '해변의 남자', eyeRoom: '눈의 방', tehera: '빛가루', crabChef: '게 요리사', smoker: '담배 피는 노인',
  dancers: '무희들', pigGod: '돼지들의 신', axeHole: '푸른 구멍', pearl: '검은 날개', conveyor: '끝없는 줄', spring: '샘', mimic: '덩그러니 놓인 상자', mirror: '깨진 거울', traveler: '나그네', fallen: '쓰러진 낙하자', bag: '버려진 배낭' };
const rgTitle = k => RG_TITLE[k] || '문 너머';

/* ---------- 문 ---------- */
function rgDoors(r, key){
  if (!r.encSafe || !r.ents || !r.ents.length) return;
  const H = RG_ENC[key] || {}, col = H.col || 0xffd9a0, tiles = r.ents.slice(), groups = [];
  while (tiles.length){ const g0 = [tiles.pop()]; for (let k = 0; k < g0.length; k++){ const [i, j] = g0[k]; for (let n = tiles.length - 1; n >= 0; n--){ const [a, b] = tiles[n]; if (Math.abs(a - i) + Math.abs(b - j) === 1){ g0.push(tiles[n]); tiles.splice(n, 1); } } } groups.push(g0); }
  const D = { r, key, parts: [], open: false };
  for (const g0 of groups){
    const xs = g0.map(t => t[0]), zs = g0.map(t => t[1]), side = g0[0][0] < r.x || g0[0][0] >= r.x + r.w ? 'z' : 'x';
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cz = (Math.min(...zs) + Math.max(...zs)) / 2, w = side === 'x' ? Math.max(...xs) - Math.min(...xs) + 1 : Math.max(...zs) - Math.min(...zs) + 1;
    for (const [i, j] of g0){ const k = j * G.map.w + i; G.map.solid[k] = 1; if (G.map.los) G.map.los[k] = 1; }
    const y = heightAt(G.map, cx, cz), grp = new THREE.Group(); grp.position.set(cx, y, cz);
    const wood = new THREE.MeshStandardMaterial({ color: 0x4a3426, emissive: col, emissiveIntensity: 0.06, roughness: 0.95 });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(side === 'x' ? w : 0.24, 2.5, side === 'x' ? 0.24 : w), wood); slab.position.y = 1.25; grp.add(slab);
    const iron = new THREE.MeshStandardMaterial({ color: 0x2a2630, roughness: 0.6, metalness: 0.4 });
    for (const hy of [0.55, 1.95]){ const band = new THREE.Mesh(new THREE.BoxGeometry(side === 'x' ? w + 0.02 : 0.28, 0.12, side === 'x' ? 0.28 : w + 0.02), iron); band.position.y = hy; grp.add(band); }
    const seam = new THREE.Mesh(new THREE.BoxGeometry(side === 'x' ? w * 0.96 : 0.26, 0.05, side === 'x' ? 0.26 : w * 0.96), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })); seam.position.y = 0.04; grp.add(seam);
    G.scene.add(grp); G.props.push(grp);
    const src = addSource(cx, cz, 2.6, col, 0.6, 1.5);
    D.parts.push({ g0, grp, src, seam });
    G.inspect.push({ x: cx, z: cz, r: 1.7, mark: '문', far: 9, get used(){ return D.open; }, set used(v){}, get label(){ return `문 — ${H.hint || '무언가 있다'}`; }, fn: () => rgDoorCard(D) });
  }
  (RG.doors = RG.doors || []).push(D); G.map.nav = {};
  if ((EXP.doorsOpen || []).includes(r.id)) rgOpenDoor(D, true);
}
async function rgDoorCard(D){
  const H = RG_ENC[D.key] || {};
  const i = await rgCard({ img: CA + 'c17.webp', kicker: `${EXP.F}층`, title: '닫힌 문', text: H.hint || '문 너머에 무언가 있다.', choices: [{ t: '연다', sub: '들어가면 무슨 일이든 일어난다' }, { t: '그냥 둔다', sub: '안 열고 지나가도 된다' }] });
  if (i === 0) rgOpenDoor(D);
}
function rgOpenDoor(D, quiet){
  if (D.open) return; D.open = true;
  for (const p of D.parts){ for (const [i, j] of p.g0){ const k = j * G.map.w + i; G.map.solid[k] = 0; if (G.map.los) G.map.los[k] = 0; } G.scene.remove(p.grp); }
  G.map.nav = {};
  EXP.doorsOpen = EXP.doorsOpen || []; if (!EXP.doorsOpen.includes(D.r.id)) EXP.doorsOpen.push(D.r.id);
  if (!quiet){ SFX.thump && SFX.thump(80, 0.45, 0.3); for (const p of D.parts) dust(p.grp.position.x, p.grp.position.z, 10); }
}
{ const _efR = encFill; encFill = function(r){ const n = (EXP.encs || []).length; const out = _efR.apply(this, arguments); const E = (EXP.encs || [])[n]; if (E) rgDoors(r, E.key); return out; }; }
// 문틈 빛이 숨쉬듯
TICKS.push(dt => { if (G.mode !== 'exp') return; const pl = G.player; if (pl && EXP && EXP.encs && !EXP.encs.some(E => inRoom(E.r, pl))) RG.lastOut = { x: pl.x, z: pl.z }; if (!RG.doors) return; const k = 0.65 + Math.sin(G.t * 2.2) * 0.25; for (const D of RG.doors) if (!D.open) for (const p of D.parts) p.seam.material.opacity = k; });
{ const _elfRG = expLoadFloor; expLoadFloor = async function(){ RG.doors = []; RG.lastOut = null; return _elfRG.apply(this, arguments); }; }

/* ---------- 갈림길 ---------- */
const RG_ROUTE = {
  treasure: { n: '보물의 길', img: 'c02', d: '보물 방 하나 더 · 강적도 하나 더' },
  hunt:     { n: '사냥의 길', img: 'c04', d: '강적 하나 더 · 떠도는 인물 둘 (제압하면 데려갈 수 있음)' },
  doors:    { n: '문의 길', img: 'c17', d: '문 (인카운터) 둘 더' },
  quiet:    { n: '조용한 길', img: 'c01', d: '쉼터 하나 더 · 매복 없음' },
  merchant: { n: '상인의 길', img: 'c03', d: '게 요리사를 꼭 만남' },
  eclipse:  { n: '붉은 일식', img: 'c13', d: '적 체력 · 공격 +20% · 떨어지는 장비 · 유물 등급 +1' },
};
function rgRoute(next){
  return new Promise(res => {
    const keys = Object.keys(RG_ROUTE).sort(() => Math.random() - 0.5).slice(0, EXP.routeExtra ? 4 : 3);
    const el = rgEl(), wasP = G.paused; G.paused = true; RG.open = true;
    const D = FLOOR_DEF[Math.min(next, FLOOR_DEF.length - 1)] || {};
    el.innerHTML = `<div class="rg-box rg-map"><div class="rg-banner" style="${rgArt(CA + 'map.webp')}"><div class="rg-bt"><div class="rg-kicker">갈림길</div><div class="rg-title">${next}층 · ${D.name || '?'}</div></div></div>
      <div class="rg-path"><i></i>${EXP.F}층<s></s><i class="n"></i><s></s>${next}층</div>
      <div class="rg-routes">${keys.map((k, i) => { const R = RG_ROUTE[k]; return `<button class="rg-route" data-k="${k}"><div class="rg-art" style="${rgArt(CA + R.img + '.webp')}"></div><b>${R.n}</b><small>${R.d}</small><kbd>${i + 1}</kbd></button>`; }).join('')}</div>
      <button class="rg-stay" data-k="">아직 안 내려간다 (Esc)</button></div>`;
    el.hidden = false;
    const done = k => { el.hidden = true; el.onclick = null; document.removeEventListener('keydown', key, true); G.paused = wasP; RG.open = false; res(k); };
    const key = e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= keys.length){ e.preventDefault(); e.stopPropagation(); done(keys[n - 1]); } else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); done(null); } else if (e.key !== 'F5' && e.key !== 'F12') e.stopPropagation(); };
    el.onclick = e => { const b = e.target.closest('[data-k]'); if (b) done(b.dataset.k || null); };
    document.addEventListener('keydown', key, true);
    setTimeout(() => { const b = el.querySelector('.rg-route'); b && b.focus({ preventScroll: true }); }, 30);
  });
}
async function rgStairs(){
  if (!EXP || EXP.ending || RG.open) return;
  const next = EXP.F + 1, k = await rgRoute(next);
  if (!k) return;
  EXP.route = { F: next, k }; EXP.routeExtra = 0;
  expDescend();
}
{ const _msRG = makeStairs; makeStairs = function(){ const r = _msRG.apply(this, arguments); const it = [...G.inspect].reverse().find(o => o.mark === '계단'); if (it){ it.fn = rgStairs; it.label = `계단 — ${EXP.F + 1}층으로 (갈림길)`; } return r; }; }
// 붉은 일식: 적이 강해지고, 장비 · 유물 등급 +1
const rgRT = () => EXP && EXP.route && EXP.route.F === EXP.F ? EXP.route.k : null;
{ const _sfRG = spawnFoe; spawnFoe = function(){ const e = _sfRG.apply(this, arguments); if (e && rgRT() === 'eclipse'){ e.max = e.hp = Math.round(e.max * 1.2); e.atk = Math.round(e.atk * 1.2); } return e; }; }
{ const _riRG = rollItem; rollItem = function(F, o = {}){ if (rgRT() === 'eclipse' && o.type !== 'cons') o = { ...o, plus: (o.plus || 0) + 1 }; return _riRG.call(this, F, o); }; }
// 층 이름 밑에 고른 길
{ const _elfRG2 = expLoadFloor; expLoadFloor = async function(F){ const r = await _elfRG2.apply(this, arguments); const k = rgRT(); if (k && RG_ROUTE[k]) setTimeout(() => guide(`${RG_ROUTE[k].n} — ${RG_ROUTE[k].d}`, 6), 2600); return r; }; }
