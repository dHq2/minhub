# mkgallery.py v1.0 — 2층 맵 모음 (한눈에 보기 · 순서 짜 보기) 페이지 만들기: d5/maps8.json + d5/raw + d5/grid/*_ov.jpg → floor2_maps_v1.0.html
import json, base64, io
from PIL import Image
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
M = json.load(open(D + 'd5/maps8.json', encoding='utf-8'))
GROUPS = [
 ('들어가는 곳과 계단', '지금 2층의 첫 두 칸', ['ruin2a', 'ruin2b']),
 ('회랑 · 방', '지금 2층의 셋째 칸 (셋 중 무작위) — 큰 그림 하나를 둘로 잘라 쓰기도 함', ['ruin2c', 'ruin2c1', 'ruin2c2']),
 ('지상 방', '아직 어느 층에도 안 걸었음', ['gboss1', 'gevent1', 'gfight1', 'fmap2', 'fmap3']),
 ('지상 계단', '1에서 이어짐 · 아직 안 걸었음', ['gstair1', 'gstair2']),
]
ROLE = {'ruin2a': '입구', 'ruin2b': '계단', 'ruin2c': '회랑+방', 'ruin2c1': '방', 'ruin2c2': '회랑', 'gboss1': '보스룸', 'gevent1': '이벤트룸', 'gfight1': '전투룸', 'fmap2': '전투 · 낙사', 'fmap3': '전투 · 좁은 복도', 'gstair1': '계단 1', 'gstair2': '계단 2'}
LIVE = ['ruin2a', 'ruin2b', 'ruin2c', 'ruin2c1', 'ruin2c2']
def b64(img, fmt, w, q):
    img = img.convert('RGB'); h = round(img.size[1] * w / img.size[0]); img = img.resize((w, h), Image.LANCZOS); b = io.BytesIO(); img.save(b, fmt, quality=q); return base64.b64encode(b.getvalue()).decode(), (w, h)
def card(k):
    m = M[k]; fl = sum(r.count('.') for r in m['rows']); w = 520 if m['pw'] >= m['ph'] else 340
    a, (iw, ih) = b64(Image.open(D + 'd5/raw/%s.png' % k), 'WEBP', w, 72)
    o, _ = b64(Image.open(D + 'd5/grid/%s_ov.jpg' % k), 'WEBP', w, 70)
    badges = ''.join(['<span class="bd fall">낙사</span>' if m.get('fall') or k == 'fmap2' else '', '<span class="bd live">지금 2층</span>' if k in LIVE else ''])
    return f'''<article class="card" data-id="{k}" data-name="{m['name']}">
  <div class="pic" style="aspect-ratio:{iw}/{ih}"><img class="art" src="data:image/webp;base64,{a}" alt="{m['name']}" loading="lazy"><img class="ov" src="data:image/webp;base64,{o}" alt="" hidden></div>
  <div class="meta"><h3>{m['name']}</h3><div class="bds">{badges}</div>
  <dl><div><dt>쓰임</dt><dd>{ROLE[k]}</dd></div><div><dt>칸</dt><dd>{m['NX']}×{m['NY']} · {round(m['cs'])}px</dd></div><div><dt>바닥</dt><dd>{fl}칸</dd></div><div><dt>밝기</dt><dd>{m['amb']}</dd></div></dl>
  <div class="id"><code>{k}</code></div>
  <div class="btns"><button type="button" class="b tog" aria-pressed="false">칸 지도</button><button type="button" class="b add">+ 순서에 담기</button></div></div>
</article>'''
secs = ''.join(f'<section class="grp"><header><h2>{t}</h2><p>{d}</p></header><div class="grid">{"".join(card(k) for k in ks)}</div></section>' for t, d, ks in GROUPS)
n = sum(len(g[2]) for g in GROUPS)
html = f'''<title>2층 맵 모음</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+KR:wght@400;500;700&display=swap">
<style>
/* 배치: 위에 순서 띠 (담은 칸이 줄로 이어짐), 아래에 묶음별 카드 격자 — 사진이 주인공이라 글은 작게 */
:root{{--bg:#eeece8;--panel:#f8f7f4;--fg:#1d1c1a;--dim:#6b6860;--line:#d8d4cc;--accent:#a8671a;--accent-bg:#f1e3cf;--fall:#a8362b;--fall-bg:#f3d9d4;--live:#2f6b52;--live-bg:#d9eadf;--mono:'IBM Plex Mono',ui-monospace,Menlo,monospace;--sans:'Noto Sans KR',system-ui,-apple-system,'Segoe UI',sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#16161a;--panel:#1f1f25;--fg:#e8e6e1;--dim:#9a978f;--line:#33333b;--accent:#e0a352;--accent-bg:#3a2e1c;--fall:#ff8a7a;--fall-bg:#3d2320;--live:#7fcfa6;--live-bg:#1d3329;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#16161a;--panel:#1f1f25;--fg:#e8e6e1;--dim:#9a978f;--line:#33333b;--accent:#e0a352;--accent-bg:#3a2e1c;--fall:#ff8a7a;--fall-bg:#3d2320;--live:#7fcfa6;--live-bg:#1d3329;color-scheme:dark}}
body{{background:var(--bg);color:var(--fg);font-family:var(--sans);line-height:1.5;padding-block:24px 72px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}}
.wrap{{max-width:1180px;margin:0 auto;display:flex;flex-direction:column;gap:28px}}
h1{{font-size:1.6rem;margin:0;text-wrap:balance;letter-spacing:-.01em}}
.sub{{color:var(--dim);margin:4px 0 0;max-width:62ch}}
.tray{{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:12px 14px;display:flex;flex-direction:column;gap:10px}}
.tray h2{{font-size:.8rem;margin:0;color:var(--dim);letter-spacing:.06em;text-transform:uppercase;font-weight:500}}
.seq{{display:flex;flex-wrap:wrap;gap:8px;align-items:center;min-height:34px}}
.seq .empty{{color:var(--dim);font-size:.9rem}}
.chip{{display:inline-flex;align-items:center;gap:6px;background:var(--accent-bg);color:var(--fg);border:1px solid var(--accent);border-radius:6px;padding:4px 6px 4px 10px;font-size:.88rem}}
.chip button{{all:unset;cursor:pointer;color:var(--dim);padding:0 4px;border-radius:4px}}
.chip button:hover,.chip button:focus-visible{{color:var(--fg);outline:2px solid var(--accent)}}
.arrow{{color:var(--dim)}}
.trayrow{{display:flex;flex-wrap:wrap;gap:8px;align-items:center}}
.b{{font:inherit;font-size:.85rem;cursor:pointer;background:var(--bg);color:var(--fg);border:1px solid var(--line);border-radius:6px;padding:5px 10px}}
.b:hover{{border-color:var(--accent)}}.b:focus-visible{{outline:2px solid var(--accent);outline-offset:1px}}
.b[aria-pressed="true"]{{background:var(--accent-bg);border-color:var(--accent)}}
.msg{{font-size:.82rem;color:var(--dim)}}
.grp header{{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;margin-bottom:12px;border-bottom:1px solid var(--line);padding-bottom:6px}}
.grp h2{{font-size:1.1rem;margin:0}}.grp header p{{margin:0;color:var(--dim);font-size:.88rem}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:16px;align-items:start}}
.card{{background:var(--panel);border:1px solid var(--line);border-radius:8px;overflow:hidden;min-width:0}}
.pic{{position:relative;width:100%;background:#0b0b0e;max-height:420px}}
.pic img{{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block}}
.pic img[hidden]{{display:none}}
.meta{{padding:10px 12px 12px;display:flex;flex-direction:column;gap:8px}}
.meta h3{{margin:0;font-size:1rem;overflow-wrap:anywhere}}
.bds{{display:flex;gap:6px;flex-wrap:wrap;min-height:0}}.bds:empty{{display:none}}
.bd{{font-size:.72rem;padding:1px 7px;border-radius:99px;font-weight:500}}
.bd.fall{{background:var(--fall-bg);color:var(--fall)}}.bd.live{{background:var(--live-bg);color:var(--live)}}
dl{{margin:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 12px;font-size:.82rem}}
dl div{{display:flex;gap:8px;justify-content:space-between;border-bottom:1px dotted var(--line);padding-bottom:2px}}
dt{{color:var(--dim)}}dd{{margin:0;font-variant-numeric:tabular-nums;text-align:right}}
.id code{{font-family:var(--mono);font-size:.78rem;color:var(--dim)}}
.btns{{display:flex;gap:8px;flex-wrap:wrap}}
.legend{{font-size:.8rem;color:var(--dim)}}
@media (prefers-reduced-motion:no-preference){{.card{{transition:border-color .15s}}.card:hover{{border-color:var(--accent)}}}}
</style>
<div class="wrap">
<header><h1>2층 맵 모음</h1><p class="sub">지금까지 등록한 맵 {n}장입니다. 칸 지도 단추를 누르면 걸을 수 있는 칸이 보입니다. 마음에 드는 순서로 담으면 위쪽 띠에 줄이 만들어지고, 그 줄을 복사해서 말씀해 주시면 그대로 짜겠습니다.</p></header>
<div class="tray" id="tray"><h2>짜 보는 순서</h2><div class="seq" id="seq" aria-live="polite"></div>
<div class="trayrow"><button type="button" class="b" id="copy">줄 복사</button><button type="button" class="b" id="clear">비우기</button><button type="button" class="b" id="live">지금 2층 흐름 불러오기</button><span class="msg" id="msg"></span></div></div>
<p class="legend">칸 지도: 붉은색은 막힌 칸, 노란색은 낮은 엄폐, 초록 테두리는 들어서는 곳, 파란 칸은 나가는 곳입니다. 한 칸 크기는 맵마다 다르게 잡았습니다 (사람 한 명이 한 칸의 0.7 정도).</p>
{secs}
</div>
<script>
(function(){{
 var LIVE=['ruin2a','ruin2b','ruin2c'], seq=[], seqEl=document.getElementById('seq'), msg=document.getElementById('msg');
 var names={{}}; document.querySelectorAll('.card').forEach(function(c){{names[c.dataset.id]=c.dataset.name;}});
 function say(t){{msg.textContent=t; setTimeout(function(){{if(msg.textContent===t)msg.textContent='';}},2600);}}
 function render(){{
  seqEl.textContent='';
  if(!seq.length){{var e=document.createElement('span');e.className='empty';e.textContent='아직 비어 있습니다. 카드의 "순서에 담기"를 눌러 보세요.';seqEl.appendChild(e);return;}}
  seq.forEach(function(k,i){{
   if(i){{var a=document.createElement('span');a.className='arrow';a.textContent='→';seqEl.appendChild(a);}}
   var c=document.createElement('span');c.className='chip';c.appendChild(document.createTextNode((i+1)+'. '+names[k]));
   var x=document.createElement('button');x.type='button';x.setAttribute('aria-label',names[k]+' 빼기');x.textContent='×';x.onclick=function(){{seq.splice(i,1);render();}};c.appendChild(x);seqEl.appendChild(c);
  }});
 }}
 function text(){{return seq.map(function(k,i){{return (i+1)+'. '+names[k]+' ('+k+')';}}).join(' → ');}}
 document.querySelectorAll('.card').forEach(function(c){{
  var tog=c.querySelector('.tog'), ov=c.querySelector('.ov'), art=c.querySelector('.art');
  tog.onclick=function(){{var on=ov.hidden;ov.hidden=!on;art.hidden=on;tog.setAttribute('aria-pressed',on?'true':'false');}};
  c.querySelector('.add').onclick=function(){{seq.push(c.dataset.id);render();}};
 }});
 document.getElementById('clear').onclick=function(){{seq=[];render();}};
 document.getElementById('live').onclick=function(){{seq=LIVE.slice();render();say('지금 2층: 입구 → 계단 → 회랑·방 (셋째 칸은 방 · 회랑 · 전체 중 무작위)');}};
 document.getElementById('copy').onclick=function(){{
  if(!seq.length){{say('담은 칸이 없습니다');return;}}
  var t=text();
  function fb(){{var r=document.createRange();r.selectNodeContents(seqEl);var s=window.getSelection();s.removeAllRanges();s.addRange(r);say('선택했습니다. 직접 복사해 주세요');}}
  if(navigator.clipboard&&navigator.clipboard.writeText){{navigator.clipboard.writeText(t).then(function(){{say('복사했습니다');}},fb);}}else fb();
 }};
 render();
}})();
</script>'''
open(D + 'floor2_maps_v1.0.html', 'w', encoding='utf-8').write(html)
print('ok', len(html) // 1024, 'KB')
