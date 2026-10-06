// check_globals.js v1.0 — index.html 이 싣는 src/*.js 의 맨 바깥 이름 (const · let · class · function) 이 서로 겹치는지 검사. 겹치면 브라우저에서 그 파일이 통째로 안 읽힘 (2026-10-06 h2.js 'dark' 사고)
// 실행: node tools/check_globals.js  (게시 전에)
const fs = require('fs'), vm = require('vm'); const R = require('path').join(__dirname, '..') + '/';
const html = fs.readFileSync(R + 'index.html', 'utf8'); const files = [...html.matchAll(/<script src="(src\/[^"]+)"/g)].map(m => m[1]);
const seen = new Map(); let bad = 0;
for (const f of files){ const s = fs.readFileSync(R + f, 'utf8');
  for (const m of s.matchAll(/^(?:const|let|class|function)\s+([A-Za-z_$][\w$]*)/gm)){ const k = m[1]; if (seen.has(k) && !/^function/.test(m[0]) ) { console.log('겹침', k, seen.get(k), '↔', f); bad++; } else if (seen.has(k) && /^function/.test(m[0]) && /^(const|let)/.test(seen.get(k + ':kind') || '')) { console.log('겹침', k, seen.get(k), '↔', f); bad++; } if (!seen.has(k)){ seen.set(k, f); seen.set(k + ':kind', m[0]); } }
}
console.log(files.length, '파일 ·', bad, '겹침');
