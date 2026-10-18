// v7.8.4 버전 표기 일치 검사: 머리 주석 · 제목 옆 (데스크톱 span.ver · 모바일 h1::after) · 꼬리말 · 로그 머리 · 자동 판 기록 · 수치표 이전 (RULES_MIG 은 수치가 바뀔 때만이라 따로 안 봄)
const fs = require('fs'); const s = fs.readFileSync('page10.tpl.html', 'utf8');
const pick = (re, nm) => { const m = s.match(re); return [nm, m ? m[1] : null]; };
const L = [pick(/<!-- 굴의 전투판 v(\d+\.\d+\.\d+)/, '머리 주석'), pick(/<span class="ver"[^>]*>v(\d+\.\d+\.\d+)/, '제목 옆 (데스크톱)'), pick(/h1::after\{content:" v(\d+\.\d+\.\d+)"/, '제목 옆 (모바일)'),
  pick(/<footer>굴의 전투판 v(\d+\.\d+\.\d+)/, '꼬리말'), pick(/return `굴의 전투판 v(\d+\.\d+\.\d+) · \$\{title\}/, '로그 머리'), pick(/copyText\('굴의 전투판 v(\d+\.\d+\.\d+) 자동 판 기록/, '자동 판 기록'),
  pick(/^\s+v(\d+\.\d+\.\d+):/m, '노트 맨 위 항목')];
const v0 = L[0][1], bad = L.filter(([, v]) => v !== v0);
console.log(bad.length ? 'VERSION MISMATCH — ' + v0 + ' 인데 ' + bad.map(([n, v]) => n + ' ' + v).join(' · ') : 'VERSION OK ' + v0);
if (bad.length) process.exitCode = 1;
