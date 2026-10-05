/* encounters.js v1.1 — (v1.1: 테헤라 · 게 요리사 초상화 대화)  인카운터 방 (ENCOUNTER_MAPS.md). 층마다 한두 개, 원정 한 번에 같은 것은 한 번만
   · 죽은 영웅 · 액자 (뇌를 훔치면 노인들이 덤빔) · 지껄임 (입: 동료 비밀을 떠듦, 때려서 닫음) · 기나긴 해변 (말대가리) · 눈알방 (밟으면 터지고 다시 자람, 정신도)
   · 우주의 테헤라 (따라옴: 이번 원정 시야 +1.5 · 적이 지도에) · 게 요리사 (상점) · 담배 피는 노인 (보물 방 · 정신도) · 거대한 무희 (정신도 회복 · 느려짐)
   · 돼지들의 신 (고깃덩이 선물: 먹으면 회복 + 정신도 · 혼란) · 푸른 구멍의 도끼기사 (강적, 도끼 유물) · 끝없는 줄 (줄 선 존재들 · 움직이는 바닥)
   · 대사는 말풍선 (prologue.js say), 글은 화면 위 안내 (guide) */
'use strict';
const EA = 'art/enc/';
const ENC = {
  deadHero:  { F: [1, 4], w: 3 }, brainFrame: { F: [3, 7], w: 2 }, chatter: { F: [4, 9], w: 2 }, beach: { F: [2, 6], w: 2 }, eyeRoom: { F: [4, 9], w: 2 },
  tehera:    { F: [5, 7], w: 3 }, crabChef: { F: [2, 8], w: 3 }, smoker: { F: [5, 8], w: 3 }, dancers: { F: [6, 8], w: 2 }, pigGod: { F: [6, 8], w: 2 },
  axeHole:   { F: [8, 10], w: 3 }, conveyor: { F: [9, 10], w: 3 },
};
const encSpot = (r, dx = 0, dz = 0) => ({ x: Math.round(r.cx) + dx, z: Math.round(r.cz) + dz });
const encSay = (x, z, h, text, life = 2.6) => typeof say === 'function' && say({ x, y: heightAt(G.map, x, z) + h, z }, text, '', life);
const partyNames = () => allies().filter(u => u.hero && u !== G.player).map(u => u.D.name);
function encFill(r, gen, tiles, edges, band, lights, deco){
  const F = gen.F, R = gen.R; EXP.encSeen = EXP.encSeen || new Set();
  const pool = Object.entries(ENC).filter(([k, e]) => F >= e.F[0] && F <= e.F[1] && !EXP.encSeen.has(k));
  if (!pool.length){ spawnGroup(r, gen, tiles, 2, band); return; }
  const tot = pool.reduce((s, [, e]) => s + e.w, 0); let q = R() * tot, key = pool[0][0];
  for (const [k, e] of pool){ q -= e.w; if (q <= 0){ key = k; break; } }
  EXP.encSeen.add(key); r.enc = key;
  ENC_FILL[key](r, gen, tiles, band, lights, deco);
  DUN.marks.push({ x: r.cx, z: r.cz, icon: '?', col: '#c8a0ff' });
  (EXP.encs = EXP.encs || []).push({ r, key, entered: false });
}
const inRoom = (r, u) => u && u.x >= r.x - 0.5 && u.x <= r.x + r.w - 0.5 && u.z >= r.z - 0.5 && u.z <= r.z + r.h - 0.5;
const ENC_TEXT = {
  deadHero: '그는 발이 바닥에 얼어붙은 채 출구 쪽을 바라봅니다. 그의 이야기는 궁금하지만, 우리는 어서 지나가야 합니다.',
  brainFrame: '노인들이 액자 속 뇌를 두고 토론하고 있습니다. 끝나지 않을 것 같습니다.',
  chatter: '거대한 입이 당신과 동료들에 대해 지껄입니다. 듣고 싶지 않은 것까지.',
  beach: '그는 파도가 치는 해변에 누워있었습니다. 별로 관심이 없는 듯 합니다.',
  eyeRoom: '눈들이 일제히 당신을 쳐다봅니다. 너무 좁습니다. 발을 밟을 때마다 눈이 터지고 다시 자라납니다. 그만. 그만 쳐다봐.',
  tehera: '잠자리 같은 날개와 비현실적인 아름다움. 그것은 어두운 하늘에 빛가루를 흩날리며 당신을 흥미롭게 바라봅니다.',
  crabChef: '그것은 게… 이자 사람이었습니다. 음식을 사고 싶은지 웃으며 묻습니다. 재료는 무엇이었을까요?',
  smoker: '어두운 풀숲에서 담배 냄새가 납니다. 그는 눈을 꿈뻑거립니다.',
  dancers: '거대한 무희들이 무아지경으로 춤을 춥니다. 향은 독할 정도로 농염합니다.',
  pigGod: '돼지들의 신입니다. 생각보다 다정합니다. 냄새는 나지만요. …왜 자꾸 고깃덩이 돼지들을 "싸는" 겁니까?',
  axeHole: '반짝이는 알갱이 사이, 푸른 구멍 앞을 그가 지키고 있었습니다.',
  conveyor: '당신은 긴 줄에 서 있습니다. 끝은 보이지 않습니다. 앞뒤로 처음 보는 존재들이 미동도 없이 서 있습니다. 그들은 살아 있을까요?',
};
const ENC_FILL = {
  deadHero(r){ const p = encSpot(r); dbill(EA + 'deadhero.webp', p.x, p.z, 2.1, { fit: 1.6, glow: 1 }); addSource(p.x, p.z, 3, 0xfff0c0, 0.6, 2.2); },
  brainFrame(r, gen, tiles, band){
    const p = encSpot(r, 0, -Math.floor(r.h / 2) + 1); dbill(EA + 'H-329.webp', p.x, p.z, 1.4, { fit: 1.2, y: 0.5 }); G.map.solid[p.z * G.map.w + p.x] = 1;
    const men = [['H-330', -1.6, 1.2], ['H-331', 1.4, 1.4], ['H-332', 0, 2.4], ['H-333', -2.4, 2.6]].map(([k, dx, dz]) => ({ b: dbill(EA + k + '.webp', p.x + dx, p.z + dz, k === 'H-333' ? 1.3 : 1.75, { fit: 1.4 }), x: p.x + dx, z: p.z + dz }));
    r.encData = { p, men, lines: ['뇌는 액자에 있어야 하네', '아니, 뇌는 생각하는 거라네', '그럼 액자가 생각하는 건가?', '…차 한잔 더?', '자네 뇌는 어디 두고 왔나', '흠. 손님이로군. 신경 쓰지 말게'], i: 0, t: 0 };
    G.inspect.push({ x: p.x, z: p.z + 1, r: 1.6, mark: '액자', far: 9, once: true, label: '액자 속 뇌를 떼어 간다', fn: () => {
      for (const m of men){ m.b.g.visible = false; const e = spawnFoe('foeCultist', m.x, m.z, gen.F, band); e.alert = true; e.D = { ...e.D, name: '노인' }; }
      encSay(p.x, p.z, 2, '도둑이야!'); dropLootAt(p.x, p.z + 1, rollItem(gen.F, { type: 'relic', bonus: 0.3 }));
    } });
  },
  chatter(r, gen, tiles, band){ const p = encSpot(r); const u = spawnFoe('encMouth', p.x, p.z, gen.F, band); u.alert = false; r.encData = { u }; },
  beach(r){
    const sand = new THREE.MeshStandardMaterial({ color: 0xc8b48a, emissive: 0x2a2416, roughness: 1 }), sea = new THREE.MeshStandardMaterial({ color: 0x3d7fa8, emissive: 0x0f2c40, transparent: true, opacity: 0.7, roughness: 0.2 });
    for (let j = r.z; j < r.z + r.h; j++) for (let i = r.x; i < r.x + r.w; i++){ if (G.map.solid[j * G.map.w + i]) continue; const q = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), j >= r.z + r.h - 2 ? sea : sand); q.rotation.x = -Math.PI / 2; q.position.set(i, 0.014, j); G.scene.add(q); G.props.push(q); }
    r.encData = { sea }; const p = encSpot(r, 1, 0); dbill(EA + 'H-337.webp', p.x, p.z, 1.3, { fit: 2.0 }); addSource(r.cx, r.cz, 6, 0xffe8b0, 0.7, 3);
  },
  eyeRoom(r){
    const eyes = [], wg = new THREE.SphereGeometry(0.16, 10, 8), pg = new THREE.SphereGeometry(0.07, 8, 6), wm = new THREE.MeshStandardMaterial({ color: 0xf2ece4, emissive: 0x3a3430, roughness: 0.4 }), pm = new THREE.MeshBasicMaterial({ color: 0x1a0a0a });
    const add = (x, y, z, floor) => { const g = new THREE.Group(), w = new THREE.Mesh(wg, wm), pp = new THREE.Mesh(pg, pm); pp.position.z = 0.12; g.add(w); g.add(pp); g.position.set(x, y, z); const s = 0.7 + Math.random() * 0.8; g.scale.setScalar(s); G.scene.add(g); G.props.push(g); eyes.push({ g, floor, s, pop: 0, x, z }); };
    for (let j = r.z; j < r.z + r.h; j++) for (let i = r.x; i < r.x + r.w; i++){
      const k = j * G.map.w + i;
      if (!G.map.solid[k]){ for (let n = 0; n < 2; n++) add(i + rnd(-0.4, 0.4), 0.06, j + rnd(-0.4, 0.4), true); }
      else if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => !G.map.solid[(j + b) * G.map.w + i + a])) for (let n = 0; n < 3; n++) add(i + rnd(-0.3, 0.3), rnd(0.3, 2.0), j + rnd(-0.3, 0.3), false);
    }
    const p = encSpot(r); dbill(EA + 'H-339.webp', p.x, p.z, 1.0, { fit: 1.2 }); addSource(p.x, p.z, 4, 0xffd0d0, 0.5, 2);
    r.encData = { eyes };
  },
  tehera(r){
    const p = encSpot(r); G.map.solid[p.z * G.map.w + p.x] = 1;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), new THREE.MeshStandardMaterial({ color: 0x4a4458, roughness: 1, flatShading: true })); rock.position.set(p.x, 0.3, p.z); rock.scale.set(1.3, 0.7, 1.1); G.scene.add(rock); G.props.push(rock);
    const b = dbill(EA + 'tehera_sit.webp', p.x, p.z, 1.3, { fit: 1.4, glow: 1, y: 0.55 }); addSource(p.x, p.z, 5, 0xc8e8ff, 0.8, 2);
    r.encData = { p, b };
    G.inspect.push({ x: p.x, z: p.z, r: 1.9, mark: '테헤라', far: 9, once: true, label: '테헤라에게 손을 내민다', fn: async () => {
      await vnTalk('테헤라', ['…', '(빛가루가 손등에 내려앉는다)', '재미있는 냄새가 나는 아이들이네. 조금만 따라가 볼까.']);
      b.g.visible = false; EXP.tehera = true; EXP.radar = true; caption('테헤라가 따라온다', '이번 원정: 시야 +1.5 · 적이 지도에 보임');
    } });
  },
  crabChef(r){
    const p = encSpot(r); dbill(EA + 'crabchef.webp', p.x, p.z, 1.6, { fit: 1.6 }); G.map.solid[p.z * G.map.w + p.x] = 1; addSource(p.x, p.z, 4.5, 0xffc080, 0.8, 1.8);
    G.inspect.push({ x: p.x, z: p.z, r: 1.9, mark: '게 요리사', far: 9, label: '게 요리사 — 음식을 산다', fn: async () => { if (!EXP.chefMet){ EXP.chefMet = true; await vnTalk('게 요리사', ['어서 오십시오. 따끈한 게 있습니다.', '재료요? …묻지 않는 편이 맛있습니다.']); } encShop('게 요리사', ['I-043', 'I-051', 'I-015', 'I-037', 'I-061', 'I-104', 'I-038']); } });
  },
  smoker(r){
    const p = encSpot(r); dbill(EA + 'H-341.webp', p.x, p.z, 1.7, { fit: 1 }); G.map.solid[p.z * G.map.w + p.x] = 1;
    r.encData = { p, t: 0 };
    G.inspect.push({ x: p.x, z: p.z, r: 1.8, mark: '노인', far: 8, once: true, label: '담배 한 대 얻는다', fn: () => {
      encSay(p.x, p.z, 2, '…저쪽 방에 뭐가 있더군', 3.2); expRevealTreasure();
      for (const u of allies()) if (u.hero){ u.hero.san = Math.min(derive(u.hero).maxSan, (u.hero.san ?? 50) + 12); }
      popText(G.player.x, G.player.y + 2.2, G.player.z, '정신도 +12', 'heal', 1);
    } });
  },
  dancers(r){
    const ds = [-1.6, 0, 1.6].map((dx, i) => { const p = encSpot(r, Math.round(dx), i === 1 ? -1 : 0); return { b: dbill(EA + 'H-348.webp', p.x, p.z, 2.9, { fit: 1.6 }), ph: i * 1.3 }; });
    for (let j = r.z; j < r.z + r.h; j++) for (let i = r.x; i < r.x + r.w; i++) if (G.map.slow) G.map.slow[j * G.map.w + i] = 0.8;
    addSource(r.cx, r.cz, 6, 0xff9ad8, 0.7, 2.6); r.encData = { ds };
  },
  pigGod(r, gen){
    const p = encSpot(r, 0, -1); dbill(EA + 'piggod.webp', p.x, p.z, 2.6, { fit: 2.4 }); G.map.solid[p.z * G.map.w + p.x] = 1; addSource(p.x, p.z, 5, 0xffd0b0, 0.7, 2);
    r.encData = { p, t: 3 };
    G.inspect.push({ x: p.x, z: p.z + 1, r: 2, mark: '돼지들의 신', far: 9, once: true, label: '선물 (고깃덩이 돼지)을 먹는다', fn: () => uiConfirm('먹을까?', '돼지들의 신이 다정하게 건넨 고깃덩이 돼지. 충고하자면… 먹지 말지?', '먹는다', () => {
      for (const u of allies()){ u.hp = Math.min(u.max, u.hp + u.max * 0.6); if (u.hero) u.hero.san = Math.max(0, (u.hero.san ?? 50) - 15); if (Math.random() < 0.35 && typeof addStatus === 'function') addStatus(u, 'confuse', { t: 6 }); }
      caption('먹었다', '배는 부르다. …뭔가 꿈틀거린다 (체력 +60% · 정신도 −15)');
    }) });
  },
  axeHole(r, gen, tiles, band){
    const p = encSpot(r, 0, -Math.floor(r.h / 2) + 1);
    const hole = new THREE.Mesh(new THREE.CircleGeometry(1.0, 32), new THREE.MeshBasicMaterial({ color: 0x3a8cff, transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
    hole.position.set(p.x, 1.3, p.z - 0.2); G.scene.add(hole); G.props.push(hole);
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.06), new THREE.MeshBasicMaterial({ color: 0xbfe0ff })); bar.position.set(p.x, 1.3, p.z - 0.18); G.scene.add(bar); G.props.push(bar);
    addSource(p.x, p.z, 5, 0x5aa0ff, 1.0, 1.4);
    for (let n = 0; n < 40; n++){ const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color: 0xd8e8ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); s.scale.setScalar(0.12); s.position.set(r.x + Math.random() * r.w, Math.random() * 0.5, r.z + Math.random() * r.h); G.scene.add(s); G.props.push(s); }
    const e = spawnFoe('axeKnight', p.x, p.z + 1.4, gen.F, band, true); e.relicDrop = 'R-S083'; r.encData = { hole, bar, e };
  },
  conveyor(r){
    const along = r.w >= r.h, row = along ? Math.round(r.cz) : Math.round(r.cx);
    const belt = new THREE.Mesh(new THREE.PlaneGeometry(along ? r.w : 1.6, along ? 1.6 : r.h), new THREE.MeshStandardMaterial({ color: 0x2a2a30, emissive: 0x0c0c10, roughness: 0.6 }));
    belt.rotation.x = -Math.PI / 2; belt.position.set(along ? r.cx : row, 0.016, along ? row : r.cz); G.scene.add(belt); G.props.push(belt);
    const figs = ['H-342', 'H-343', 'H-344', 'H-345', 'H-346', 'H-347'];
    for (let t = 1; t < (along ? r.w : r.h) - 1; t += 1.6){ const x = along ? r.x + t : row, z = along ? row : r.z + t; dbill(EA + figs[Math.floor(Math.random() * figs.length)] + '.webp', x, z, 1.5, { fit: 0.9 }); }
    r.encData = { along, row };
  },
};
// 지껄이는 입: 적이지만 덤비지 않음. 맞으면 닫힘 (쓰러짐)
SPR.encMouth = { h0: 300, tall: 1.6, poses: { idle: { src: EA + 'H-334.webp', w: 300, h: 300, ax: 150, ay: 296, f: 1 } } };
DEFS.encMouth = { spr: 'encMouth', name: '지껄이는 입', hp: 160, atk: 0, spd: 0, r: 0.6, weight: 3000, heavy: true, think: mouthThink };
Object.assign(FOE_XP, { encMouth: 30 });
function mouthThink(u, dt){
  u.talkT = (u.talkT ?? 1.5) - dt; const pl = G.player; if (!pl || dist(u, pl) > 9 || u.talkT > 0) return;
  u.talkT = 3.2; const ns = partyNames(), n = ns.length ? ns[Math.floor(Math.random() * ns.length)] : '인주';
  const L = [`${n}는 어젯밤에 몰래 울었지`, `${n}는 너를 믿지 않아`, `인주, 너 진짜 이름이 뭐야?`, `금화 ${RPG.gold}개. 다 셌어`, `${n}의 꿈엔 늘 같은 문이 나와`, `돌아가도 아무도 없어`, `카리우스가 땅에서 뭘 파냈는지 알아?`];
  say(u, L[Math.floor(Math.random() * L.length)], '', 2.8);
  for (const a of allies()) if (a.hero && dist(a, u) < 8) a.hero.san = Math.max(0, (a.hero.san ?? 50) - 2);
}
// 상점 (게 요리사): 금화로 산다. 값 = 아이템 값 × 1.5
// 상점 칸은 버튼이 아니라 a: 확인 창의 버튼 처리 (닫기)에 안 걸리게
function encShop(who, ids){
  const el = $r('confirm'); G.paused = true;
  const draw = () => {
    el.innerHTML = `<div class="cf-box"><b>${who}</b><p>금화 <em style="color:#ffd35a">${RPG.gold}</em> · 가방 ${RPG.bag.length}/${bagCap()}</p><div style="flex-direction:column;align-items:stretch">${ids.map(id => { const d = ITEMS[id], g = Math.max(5, Math.round((d.g || 10) * 1.5)); return `<a class="shop-it" data-buy="${id}" style="display:block;cursor:pointer;padding:7px 10px;margin:2px 0;border:1px solid #6a5a3a;border-radius:8px;background:rgba(255,211,90,.08);color:#f0e4c8;${RPG.gold < g ? 'opacity:.4' : ''}">${d.n} — <b style="display:inline;font-size:15px;color:#ffd35a">${g} 금화</b> <small style="opacity:.7">${d.d ? d.d.replace(d.n + '. ', '') : ''}</small></a>`; }).join('')}<button data-a="no">그만 (Esc)</button></div></div>`;
  };
  draw(); el.hidden = false;
  UIR.confirm = () => { el.hidden = true; UIR.confirm = null; G.paused = false; el.onclick = null; };
  el.onclick = e => { const b = e.target.closest('[data-buy]'); if (!b) return; e.stopPropagation();
    { const id = b.dataset.buy, d = ITEMS[id], g = Math.max(5, Math.round((d.g || 10) * 1.5)); if (RPG.gold < g) return; if (!addItem(makeItem(id))){ popText(G.player.x, G.player.y + 2.2, G.player.z, '가방이 가득', 'miss', 1); return; } RPG.gold -= g; SFX.burst && SFX.burst({ type: 'bandpass', f: 1600, q: 6, gain: 0.15, dec: 0.25 }); draw(); } };
}
function encTick(dt){
  if (!EXP || !EXP.encs) return;
  if (typeof updateBubbles === 'function') updateBubbles();
  const pl = G.player; if (!pl) return;
  for (const E of EXP.encs){
    const r = E.r, d = r.encData || {}, here = inRoom(r, pl);
    if (here && !E.entered){ E.entered = true; guide(ENC_TEXT[E.key], 8); }
    if (E.key === 'brainFrame' && here && d.men && d.men[0].b.g.visible){ d.t -= dt; if (d.t <= 0){ d.t = 2.4; const m = d.men[d.i % d.men.length]; encSay(m.x, m.z, 2.0, d.lines[d.i % d.lines.length]); d.i++; } }
    if (E.key === 'chatter' && d.u && d.u.dead && !d.done){ d.done = true; caption('입이 닫혔다', '조용해졌다'); dropLootAt(d.u.x, d.u.z, { gold: 60 * EXP.F }); }
    if (E.key === 'beach' && d.sea){ d.sea.opacity = 0.6 + Math.sin(G.t * 1.2) * 0.12; }
    if (E.key === 'eyeRoom' && d.eyes){
      const near = Math.hypot(pl.x - r.cx, pl.z - r.cz) < Math.max(r.w, r.h);
      if (near) for (const e of d.eyes){
        if (e.pop > 0){ e.pop -= dt; if (e.pop <= 0) e.g.scale.setScalar(e.s * 0.2); }
        else if (e.g.scale.x < e.s) e.g.scale.setScalar(Math.min(e.s, e.g.scale.x + dt * 0.6));
        e.g.lookAt(pl.x, pl.y + 1.4, pl.z); if (Math.random() < 0.002) e.g.rotation.z += rnd(-0.3, 0.3);
        if (e.floor && e.pop <= 0 && Math.hypot(pl.x - e.x, pl.z - e.z) < 0.32){ e.pop = 4; e.g.scale.setScalar(0.001); spark(e.x, 0.15, e.z, 0xe8e0c8, 6, 2); }
      }
      if (here){ for (const a of allies()) if (a.hero) a.hero.san = Math.max(0, (a.hero.san ?? 50) - 1.6 * dt); }
    }
    if (E.key === 'dancers' && d.ds){ for (const x of d.ds){ x.ph += dt; x.b.m.position.y = (x.b.m.scale.y / 2) + Math.abs(Math.sin(x.ph * 2.2)) * 0.25; x.b.m.rotation.z = Math.sin(x.ph * 1.1) * 0.12; }
      if (here) for (const a of allies()) if (a.hero) a.hero.san = Math.min(derive(a.hero).maxSan, (a.hero.san ?? 50) + 2.5 * dt); }
    if (E.key === 'pigGod' && here && d.p){ d.t -= dt; if (d.t <= 0){ d.t = 9; encSay(d.p.x, d.p.z, 2.8, R2(['꿀꿀, 선물이야', '먹어 봐, 먹어 봐', '또 낳았어!'])); dropLootAt(d.p.x, d.p.z + 1, 'I-043', { spread: 1.2 }); } }
    if (E.key === 'axeHole' && d.hole){ d.hole.material.opacity = 0.7 + Math.sin(G.t * 2) * 0.15; d.hole.lookAt(camera.position.x, 1.3, camera.position.z); d.bar.quaternion.copy(d.hole.quaternion);
      if (d.e && d.e.dead && !d.done){ d.done = true; dropLootAt(d.e.x, d.e.z, 'R-S083'); caption('도끼기사가 쓰러졌다', '푸른 구멍 앞에 도끼가 남았다'); } }
    if (E.key === 'conveyor' && here){ const onBelt = Math.abs((d.along ? pl.z : pl.x) - d.row) < 0.8; if (onBelt && !(pl.jy > 0.2)) moveBy(pl, d.along ? 0.9 * dt : 0, d.along ? 0 : 0.9 * dt); }
  }
  if (EXP.tehera){
    if (!EXP.fairy || !EXP.fairy.parent){ const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, color: 0xc8f0ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); s.scale.setScalar(0.5); G.scene.add(s); G.props.push(s); EXP.fairy = s; }
    EXP.fairy.position.set(pl.x + Math.cos(G.t * 1.7) * 0.7, pl.y + 2.1 + Math.sin(G.t * 3) * 0.15, pl.z + Math.sin(G.t * 1.7) * 0.7);
    EXP.radar = true;
  }
}
