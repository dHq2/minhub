import re
def rep(path, a, b, n=1):
    s = open(path, encoding='utf8').read(); c = s.count(a)
    assert c == n, (path, a[:80], c); s = s.replace(a, b); open(path, 'w', encoding='utf8').write(s)
P='page10.tpl.html'
s=open(P,encoding='utf8').read()
# 판 정의: C자 격자 14×10 → 개활지 20×14
old="type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618"
print('count gridC defs', s.count(old))
s=s.replace(old, "type: 'grid', W: 20, H: 14, mapC: false, seed: 1618")
s=s.replace("Object.assign(S, { type: L.type, W: L.W, H: L.H, mapC: true, seed: L.seed, flips: [], units: L.units, torches: L.torches, draft: L.draft });", "Object.assign(S, { type: L.type, W: L.W, H: L.H, mapC: L.type === 'gridC', seed: L.seed, flips: [], units: L.units, torches: L.torches, draft: L.draft });")
open(P,'w',encoding='utf8').write(s)
# 옛 좌표 (14×10 기준) 를 개활지 가운데로: 열 +3 · 행 +2
rep(P, "const at = (S, c) => ({ x: 'abcdefghijklmnopqrstuvwxyz'.indexOf(c[0]) + 0.5, y: S.H - (+c.slice(1)) + 0.5 });",
       "const at = (S, c) => ({ x: 'abcdefghijklmnopqrstuvwxyz'.indexOf(c[0]) + 0.5, y: S.H - (+c.slice(1)) + 0.5 });\nconst atL = (S, c) => ({ x: 'abcdefghijklmnopqrstuvwxyz'.indexOf(c[0]) + 3.5, y: S.H - (+c.slice(1)) - 2 + 0.5 });   // v6.1 옛 14×10 좌표를 20×14 개활지 가운데로")
s=open(P,encoding='utf8').read()
a="  const put = (ref, side, c, ex) => S.units.push({ ...unitFromRef(ref, side, ex), ...at(S, c) });"
print('line/shield put', s.count(a))
s=s.replace(a, "  const put = (ref, side, c, ex) => S.units.push({ ...unitFromRef(ref, side, ex), ...atL(S, c) });")
open(P,'w',encoding='utf8').write(s)
rep(P, "  put('인주', 'h2'); put('노먼', 'g2'); put('레베카', 'h3'); put('카리우스', 'i3');\n  put('검방패기사', 'h8'); put('창병', 'g9'); put('창병', 'i9'); put('곤봉적', 'i8'); put('검기사', 'f8'); put('궁수', 'h10');   // v5.4.3 창병 둘",
       "  put('인주', 'k3'); put('노먼', 'j3'); put('레베카', 'k4'); put('카리우스', 'l4');   // v6.1 개활지 20×14\n  put('검방패기사', 'k10'); put('창병', 'j11'); put('창병', 'l11'); put('곤봉적', 'l10'); put('검기사', 'i10'); put('궁수', 'k12');   // v5.4.3 창병 둘")
rep(P, "const FLOOR_DEFAULTS = [{ name: '1층', note: '격자 14×10 · 바위 · 벽 횃불 없음 · 맞붙기까지 두 칸', torches: 0,\n  put: [['인주', 'h2'], ['노먼', 'i2'], ['카리우스', 'h3'], ['레베카', 'i3'], ['검방패기사', 'g6'], ['곤봉적', 'h6'], ['검방패기사', 'i6'], ['창병', 'g7'], ['창병', 'i7'], ['궁수', 'g9'], ['궁수', 'h9'], ['궁수', 'i9']] }];",
       "const FLOOR_DEFAULTS = [{ name: '1층', note: '개활지 20×14 · 바위 · 벽 · 횃불 없음 · 맞붙기까지 두 칸', torches: 0,\n  put: [['인주', 'k4'], ['노먼', 'l4'], ['카리우스', 'k5'], ['레베카', 'l5'], ['검방패기사', 'j8'], ['곤봉적', 'k8'], ['검방패기사', 'l8'], ['창병', 'j9'], ['창병', 'l9'], ['궁수', 'j11'], ['궁수', 'k11'], ['궁수', 'l11']] }];")
# 맵 고르기: C자 격자 대신 개활지
rep(P, '<optgroup label="격자 (전술 시험)"><option value="gridC:14x10">격자 10×10 + 양옆 C자 통로 (14×10)</option><option value="grid:8x8">격자 8×8</option><option value="grid:10x10">격자 10×10</option><option value="grid:12x12">격자 12×12</option><option value="grid:16x16">격자 16×16</option></optgroup>',
       '<optgroup label="개활지 (바위 · 벽 없음)"><option value="grid:20x14">개활지 20×14</option><option value="grid:24x16">개활지 24×16</option><option value="grid:28x18">개활지 28×18</option><option value="grid:16x16">개활지 16×16</option><option value="grid:12x12">개활지 12×12</option></optgroup>')
rep(P, "const gridName = h => h.type === 'gridC' ? `격자 ${h.W - 4}×${h.H} + 양옆 C자 통로 (${h.W}×${h.H})` : `격자 ${h.W}×${h.H}`;", "const gridName = h => h.type === 'gridC' ? `격자 ${h.W - 4}×${h.H} + 양옆 C자 통로 (${h.W}×${h.H})` : `개활지 ${h.W}×${h.H}`;")
# 저장된 판 · 층 이전: C자 격자 14×10 → 개활지 20×14 (바위도 걷어 냄)
rep(P, "  S.flips = (S.flips || []).map(k => { const [x, y] = k.split(',').map(Number); return (x + 2) + ',' + y; });\n}\n",
       """  S.flips = (S.flips || []).map(k => { const [x, y] = k.split(',').map(Number); return (x + 2) + ',' + y; });
}
// v6.1 C자 벽 · 바위를 걷어 낸 넓은 개활지 (20×14): 옛 C자 격자 판 · 저장한 층을 가운데로 옮겨 놓음 (열 +3 · 행 +2)
const toOpen6 = L => { if (!L || L.type !== 'gridC' || L.W !== 14 || L.H !== 10) return false; L.type = 'grid'; L.W = 20; L.H = 14; L.mapC = false; L.flips = [];
  for (const u of L.units || []){ u.x += 3; u.y += 2; } for (const t of L.torches || []){ t.x += 3; t.y += 2; } return true; };
if (toOpen6(S)) setTimeout(() => toast('판을 넓은 개활지 (20×14) 로 바꿨어요 — C자 벽 · 바위를 걷어 내고 인물은 가운데로 옮겼어요'), 2600);
try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && toOpen6(f.snap)) fc = true; if (fc) saveMyFloors(F); } catch (e) {}
""")
print('ok')
