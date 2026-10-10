/* mob9.js v1.0 — (v0.85, 4기) 잡몹 9인: 동방 다섯 (쌍부 · 방도끼 · 동방소총수 · 동방저격수 · 풀페이스가면 검사) · 서방 넷 (심계소령 헌팅나이프 · 라스트솔져 카밀라 · 선도사남 · 선도사녀)
   ■ 그림: src/mob9_sheets.js (tools/mob9_art.py — 드라이브 '1010 4기 업뎃/4기몹' 3×3 시트 23장, 장마다 한 동작) → M10 (잡몹 시트) 에 더함
     → motion.js 가 SPR 을 통째로 바꾸고 잡몹 자세 고르기 (걷기 · 달리기 · 예고 · 침 · 맞음 · 휘청 · 막기 · 웅크림 · 모닥불 쉼 · 죽음) 를 그대로 씀
   ■ 싸움: 쌍부 = 도끼 둘 (넓게 휘두름 · 쌍도끼 휩쓸기) · 방도끼 = 도끼 + 큰 방패 (앞에서 막음 · 방패 밀치기) · 동방소총수 = 소총 + 방패
          · 동방저격수 = 저격 (긴 붉은 줄 예고 뒤 아주 빠른 한 방 · 붙으면 뒤로 뜀) · 풀페이스가면 검사 = 빠른 칼 · 발도 일섬 (돌진)
          · 헌팅나이프 = 단검 + 붙잡기 · 기습 찌르기 · 라스트솔져 카밀라 = 산탄 (가까이 부채꼴로 다섯 알) · 선도사남 = 소총 + 큰 방패 · 선도사녀 = 권총 빠른 연사
   ■ 나오는 곳: 7층 도깨비 시장 = 동방 다섯 · 8층 쇠의 진지 = 서방 넷 · 9 · 10층에 조금씩. 콜로세움 '적' 칸에는 저절로 (drill.js coloRoster)
   ■ 이름은 드라이브 파일 이름 그대로 — 도감에서 고친 이름이 있으면 names.js (sync_names.py) 가 덮음 */
'use strict';
const M9 = (range, arc, windup, cd, mul = 1, kb = 0.8) => ({ range, arc, windup, cd, mul, kb });
const MOB9 = {
  ssangbu:    { tall: 2.0,  def: 4, xp: 20, D: { name: '쌍부', hp: 210, atk: 22, spd: 2.7, r: 0.42, weight: 130, melee: M9(2.0, 2.6, 0.55, 1.5, 1.15, 1.0) } },
  bangdokki:  { tall: 1.85, def: 9, xp: 22, D: { name: '방도끼', hp: 260, atk: 20, spd: 2.3, r: 0.45, weight: 150, block: 0.35, melee: M9(2.3, 2.0, 0.7, 1.8, 1.25, 1.5) } },
  eastRifle:  { tall: 1.9,  def: 7, xp: 18, D: { name: '동방소총수', hp: 170, atk: 18, spd: 2.4, r: 0.4, weight: 120, block: 0.45, bow: { range: 10, windup: 0.65, cd: 1.8, speed: 34, bullet: true } } },
  eastSniper: { tall: 1.85, def: 1, xp: 18, D: { name: '동방저격수', hp: 110, atk: 24, spd: 2.6, r: 0.34, weight: 70, leap: 3.6, bow: { range: 15, windup: 1.3, cd: 3.6, speed: 60, bullet: true, mul: 1.6 } } },
  maskBlade:  { tall: 1.9,  def: 3, xp: 20, D: { name: '풀페이스가면 검사', hp: 180, atk: 22, spd: 3.6, r: 0.36, weight: 70, melee: M9(2.2, 1.9, 0.38, 1.1, 1, 0.8) } },
  huntKnife:  { tall: 1.95, def: 3, xp: 18, D: { name: '심계소령 헌팅나이프', hp: 190, atk: 19, spd: 3.5, r: 0.38, weight: 95, melee: M9(1.6, 1.7, 0.32, 0.9, 0.9, 0.5), grab: { reach: 1.6, cd: 7, wind: 0.45 } } },
  camilla:    { tall: 1.85, def: 3, xp: 18, D: { name: '라스트솔져 카밀라', hp: 190, atk: 21, spd: 2.8, r: 0.38, weight: 90, bow: { range: 6, windup: 0.7, cd: 2.2, speed: 30, bullet: true, pellets: 5, spread: 0.32, mul: 0.55, kb: 0.5 } } },
  seondoM:    { tall: 2.0,  def: 8, xp: 20, D: { name: '선도사남', hp: 240, atk: 18, spd: 2.2, r: 0.42, weight: 140, block: 0.4, bow: { range: 11, windup: 0.7, cd: 1.9, speed: 34, bullet: true } } },
  seondoF:    { tall: 1.75, def: 1, xp: 16, D: { name: '선도사녀', hp: 150, atk: 16, spd: 3.3, r: 0.34, weight: 60, leap: 3.5, bow: { range: 8, windup: 0.45, cd: 1.1, speed: 30, bullet: true, color: 0xffd0f0, glow: 0xff40c0 } } },
};
const MOB9_SIGLESS = ['eastRifle', 'eastSniper', 'camilla', 'seondoM', 'seondoF'];   // 고유 기술이 없는 놈: 가끔 특수 공격 그림으로 쏨 (motion.js M10_SIGLESS)
(function mob9Build(){
  if (typeof MOB9_SHEETS === 'undefined' || typeof M10 === 'undefined') return;
  for (const [k, o] of Object.entries(MOB9)){
    const A = MOB9_SHEETS[k]; if (!A) continue;
    M10[k] = { src: A.poses.idle.src, h0: A.h0, poses: A.poses };
    SPR[k] = { h0: A.h0, tall: o.tall, poses: { idle: { ...A.poses.idle, f: 1 } } };   // 자리만 — motion.js 가 M10 으로 통째로 바꿈 (키 tall 만 이어 씀)
    DEFS[k] = { spr: k, ...o.D };
    FOE_XP[k] = o.xp; FOE_DEF[k] = o.def;
  }
  Object.assign(SIG, {
    ssangbu: { cd: 6, fn: (u, t) => sigSweep(u, t, '쌍도끼 휩쓸기') }, bangdokki: { cd: 6, fn: sigBash },
    maskBlade: { cd: 5, fn: (u, t) => sigDash(u, t, '발도 일섬') }, huntKnife: { cd: 6.5, fn: (u, t) => sigDash(u, t, '기습 찌르기') } });
  const add = (F, o) => { const D = FLOOR_DEF[F]; if (D) D.foes = { ...(D.foes || {}), ...o }; };
  add(7, { ssangbu: 2, bangdokki: 2, eastRifle: 2, eastSniper: 1, maskBlade: 1 });   // 도깨비 시장 = 동방
  add(8, { huntKnife: 2, camilla: 2, seondoM: 2, seondoF: 1 });                      // 쇠의 진지 = 서방
  add(9, { eastSniper: 1, maskBlade: 1 });
  add(10, { seondoM: 1, camilla: 1 });
})();
