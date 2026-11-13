// 본체 파일 목록 맞춤 검사 — v1.0. index.html 의 <script src>·<link> 와 sw.js 의 CODE 목록이 같은 순서로 같아야 한다.
// 새 js 파일을 만들고 sw.js 에 안 넣으면 오프라인·업데이트 때 빠진다 → 여기서 실패.
const fs = require('fs'), path = require('path'), D = path.join(__dirname, '..', 'sehee');
const html = fs.readFileSync(path.join(D, 'index.html'), 'utf8'), sw = fs.readFileSync(path.join(D, 'sw.js'), 'utf8');
const inHtml = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"|<script src="([^"]+)"/g)].map(m => './' + (m[1] || m[2]));
const code = eval(sw.match(/const CODE = (\[[\s\S]*?\]);/)[1]);
const missing = inHtml.filter(f => !fs.existsSync(path.join(D, f)));
const v1 = (html.match(/APP_VERSION = '([^']+)'/) || [])[1], v2 = (sw.match(/const VERSION = '([^']+)'/) || [])[1];
console.log('index.html', inHtml.length, '개 · sw CODE', code.length, '개 · 버전', v1, v2);
const bad = [];
if (JSON.stringify(inHtml) !== JSON.stringify(code)) bad.push('목록 다름: ' + JSON.stringify(inHtml.filter(x => !code.includes(x))) + ' / ' + JSON.stringify(code.filter(x => !inHtml.includes(x))));
if (missing.length) bad.push('없는 파일: ' + missing.join(', '));
if (v1 !== v2) bad.push('버전 다름: index.html ' + v1 + ' · sw.js ' + v2);
if (bad.length){ console.log(bad.join('\n')); process.exit(1); }
console.log('맞음');
