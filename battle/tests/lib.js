// 시험 공용: 빌드된 엔진(build/rt3.node.js) + src 의 core·game 섹션을 브라우저와 같은 방식으로(스크립트 한 덩어리) 불러온다.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
function load(sections) {
  sections = sections || ['core', 'game'];
  const E = require(path.join(ROOT, 'build', 'rt3.node.js'));
  const lines = fs.readFileSync(path.join(ROOT, 'src', 'manifest.txt'), 'utf8').split('\n');
  let sec = '', files = [];
  for (const l of lines) {
    const t = l.trim(); if (!t || t[0] === '#') continue;
    if (t[0] === '[') { sec = t.slice(1, -1); continue; }
    if (sections.includes(sec) && fs.existsSync(path.join(ROOT, 'src', t))) files.push(t);
  }
  const ver = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();
  const code = files.map(f => fs.readFileSync(path.join(ROOT, 'src', f), 'utf8').replace('/*VERSION*/', ver)).join('\n') + '\n;globalThis.GB = GB;';
  const ctx = { E: E, console: console, Math: Math, JSON: JSON, Date: Date, Object: Object, Array: Array, Set: Set, Map: Map, isFinite: isFinite };
  ctx.globalThis = ctx; vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: 'src-bundle.js' });
  return ctx.GB;
}
let fails = 0;
const ok = (c, s) => { console.log((c ? '  OK   ' : '  FAIL ') + s); if (!c) fails++; };
const done = () => { console.log(fails ? '\n실패 ' + fails + '건' : '\n모두 통과'); process.exit(fails ? 1 : 0); };
module.exports = { load, ok, done, ROOT };
