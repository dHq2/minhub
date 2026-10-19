p='run8_i.js'; s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)
rep('/* ===== run8_i.js v1.5 —','/* ===== run8_i.js v1.6 —')
rep("   v1.5: 좁은","   v1.6: 도감 카드 212장은 묶음 그림 3장 (art/card/atlasN — 파일 수 한도) · 대화 줄의 card: id 를 가운데 큰 그림으로 (묶음에서 그 칸만)\n   v1.5: 좁은")
rep("""const CARD8 = /*CARDS8*/[];""","""const CARD8 = /*CARDS8*/[];
const CARDATLAS8 = /*CARDATLAS8*/{};   // id → [묶음, x, y, w, h, 묶음 너비, 묶음 높이]
// 대화 줄 { card: id } → 가운데 큰 그림 (talkShow 가 줄마다 부름 · 없는 줄이면 숨김)
function r8CardShow(L){
  const T0 = $('talk'); if (!T0) return; let el = $('tkCard8'); const a = L && L.card && CARDATLAS8[L.card];
  if (!a){ if (el) el.hidden = true; return; }
  if (!el){ el = document.createElement('div'); el.id = 'tkCard8'; el.style.cssText = 'position:absolute;left:50%;top:5%;transform:translateX(-50%);background-repeat:no-repeat;border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.6);pointer-events:none;z-index:0'; T0.insertBefore(el, T0.firstChild); }
  const H = Math.max(120, Math.min(T0.clientHeight * 0.6, (T0.clientWidth * 0.9) * a[4] / a[3])), k = H / a[4];
  el.style.height = H + 'px'; el.style.width = (a[3] * k) + 'px'; el.style.backgroundImage = `url(art/card/atlas${a[0]}.webp)`; el.style.backgroundSize = `${a[5] * k}px ${a[6] * k}px`; el.style.backgroundPosition = `${-a[1] * k}px ${-a[2] * k}px`; el.hidden = false;
}""")
rep("""talkLines([{ narr: c.name + (c.txt ? ' — ' + c.txt : ''), cg: '../card/' + c.id }, { narr: T[0], cg: '../card/' + c.id }, { ask: T[1].map(([a, b]) => [a, '!r8:' + b]) }]);""",
"""talkLines([{ narr: c.name + (c.txt ? ' — ' + c.txt : ''), card: c.id }, { narr: T[0], card: c.id }, { ask: T[1].map(([a, b]) => [a, '!r8:' + b]) }]);""")
rep("""cg: '../card/ENC-riddle' }""","""card: 'ENC-riddle' }""")
open(p,'w',encoding='utf-8').write(s)
p='page8710.py'; s=open(p,encoding='utf-8').read()
s=s.replace("page8710.py v1.4 (v1.4:","page8710.py v1.5 (v1.5: 도감 카드는 묶음 그림 (cardatlas.json 을 넣음) · 대화 줄마다 r8CardShow · v1.4:")
s=s.replace("""assert '/*CARDS8*/' not in E""","""assert '/*CARDS8*/' not in E
E = E.replace('/*CARDATLAS8*/{}', open(D + 'd5/cardatlas.json', encoding='utf-8').read(), 1)
assert '/*CARDATLAS8*/' not in E""")
s=s.replace("# 모듈 (도감 카드 212 를 넣어서)","""# 대화 줄마다 도감 카드 그림 (묶음에서 그 칸)
rep("T0.style.backgroundRepeat = L.cg ? 'no-repeat' : '';", "T0.style.backgroundRepeat = L.cg ? 'no-repeat' : ''; if (typeof r8CardShow === 'function') r8CardShow(L);")
# 모듈 (도감 카드 212 를 넣어서)""")
open(p,'w',encoding='utf-8').write(s)
p='ui8710.js'; s=open(p,encoding='utf-8').read()
a="im.src='art/card/'+c.id+'.webp'; })));"
assert s.count(a)==1
s=s.replace(a,"const A=CARDATLAS8[c.id]; if (!A){ bad.push(c.id+' 묶음 없음'); return r(); } im.src='art/card/atlas'+A[0]+'.webp'; })));")
s=s.replace("ui8710.js v1.3 (v1.3:","ui8710.js v1.4 (v1.4: 카드 그림은 묶음 (atlas) · v1.3:")
open(p,'w',encoding='utf-8').write(s)
