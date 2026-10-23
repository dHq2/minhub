// 페이지의 designs 를 노드로 꺼내기 — pdes.js v1.1 (v1.1: 줄 끝의 /* … */ 풀이도 떼어 냄 (굿윌 줄이 빠지던 것) · v1.0: build/wrapped.html 에서 { key: … } 줄을 그대로 읽음 · 다른 이름을 부르는 줄은 건너뜀)
const fs=require('fs'); const src=fs.readFileSync(__dirname+'/build/wrapped.html','utf8').split('\n');
const D={};
for (const ln of src){ const m=ln.match(/^\s*\{ key: '([^']+)'/); if(!m) continue; let s=ln.trim(); s=s.replace(/\s*\/\/.*$/,''); for (let k=0;k<4;k++) s=s.replace(/\s*\/\*(?:(?!\*\/).)*\*\/\s*$/,''); s=s.replace(/,\s*$/,'');
  try { const o=(0,eval)('('+s+')'); if(!D[m[1]]) D[m[1]]=o; } catch(e){ /* 상수를 부르는 줄 */ } }
module.exports=D;
if (require.main===module) console.log(Object.keys(D).length, Object.keys(D).slice(0,80).join(' '));
