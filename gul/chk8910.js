// 암계 초안 검사 — chk8910.js v1.0 (v1.0: 보관 폴더에서도 돎) (그림 · 도감 번호 · FOE8 줄 모양 · 중복)
const fs = require('fs'), { ABYSS_DRAFT: D, ABYSS_EQUIP_DRAFT: Q } = require('./abyss_draft_v1.0.js');
let fails = 0; const ok = (c, s) => { console.log((c ? '  OK  ' : '  FAIL ') + s); if (!c) fails++; };
const catP = ['abyss/push/catalog.js'].find(p => fs.existsSync(p)), cat = catP ? fs.readFileSync(catP, 'utf8') : null;   // 보관 폴더에는 도감 푸시 묶음이 없어 도감 번호 검사는 건너뜀
const art = 'build/art/abyss/';
ok(D.length === 4 && Q.length === 6, '적 4 · 장비 6');
const keys = new Set(); let dup = false;
for (const [key, ref, tier, o, note] of D) {
  if (keys.has(key)) dup = true; keys.add(key);
  if (cat) ok(cat.includes('"cid":"' + ref + '"'), key + ' ← 도감 ' + ref);
  ok(['_art', '_cut', '_face'].every(k => fs.existsSync(art + ref + k + '.webp')), key + ' 그림 셋');
  ok(tier >= 1 && tier <= 5 && o.ov && o.ov.hp > 0 && o.ov.atk > 0 && o.height > 1 && o.weight > 30 && o.weapon && note, key + ' 줄 모양 (등급 ' + tier + ' · 피 ' + o.ov.hp + ' · 공격 ' + o.ov.atk + ')');
}
ok(!dup, '이름 중복 없음');
for (const e of Q) ok(fs.existsSync('build/art/' + e.src), e.name + ' 그림');
ok(fs.existsSync(art + 'equip_sheet.webp'), '장비 판 그림');
// 이미 있는 적 이름과 안 겹침
const run = fs.readFileSync('run8_a.js', 'utf8');
ok(![...keys].some(k => run.includes("['" + k + "'")), '기존 FOE8 이름과 안 겹침');
// 게임에 안 걸렸는지 (건드리지 않았음)
const head = fs.readFileSync('rt3_head.js', 'utf8') + fs.readFileSync('rt3_mid.js', 'utf8') + fs.readFileSync('rt3_tail.js', 'utf8');
ok(!/암계/.test(head + run), '게임 코드에 암계 아직 없음 (준비만)');
console.log(fails ? 'FAILS ' + fails : 'ALL CHK8910 OK'); process.exit(fails ? 1 : 0);
