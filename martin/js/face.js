/* martin/js/face.js — 프사 자동(v0.15.1, 11-17 A). 고칠 땐 이 줄 아래에 「11-17 A: …」처럼 날짜·방 주석 */
/* 보스(사건 20261117-5723 첫 턴): "인물을 한다면 그 프로필을 쓰는 게 자동으로 되어야 한다. 카톡 사진에서 잘라내서 써야지."
   예전엔 마틴이 사진을 받은 그 턴에 face op 로 프사 자리를 짚어야만 붙었다 — 인물 카드를 나중에 세우면 사진을 다시 못 봐서
   「프사가 안 보인다, 새로 받아 와라」가 됐다. 이제 앱이 맡는다:
   · 얼굴 없는 인물 카드마다, 판독문에 그 이름이 나오는 사진 자료(많이 나오는 것부터 둘)를 골라
   · 원본 조각을 짧게 한 번 물어 그 사람 프사 자리(조각·상자)를 받고 → 원본 좌표로 바꿔 cropFace(board.js)로 잘라 붙인다.
   · 찾은 프사 모습은 그 자료 판독문 끝에 「[프사] 이름 — 보이는 것」 한 줄로(맞춰 보기가 사람 말로 안 읽는 꼴).
   · 동료가 「이 사진 빼기」를 누른 카드는 다시 안 붙인다(n.faceNo). 해 본 자료는 n.faceTried 에 — 새 자료가 오면 다시 해 본다.
   부르는 곳: 턴 끝(ai.js)·판독문 채우기 끝(evidence.js)·사건을 연 뒤 이 파일 맨 아래 */
let FACE_BUSY = false;
const faceNames = n => { const t = String(n.title || '').replace(/\s*(씨|님|선생님|쌤|팀장님?|과장님?|대리님?)$/, '').trim(); const out = [t];
  if (/^[가-힣]{3}$/.test(t)) out.push(t.slice(1));   /* 「백소은」 → 「소은」도 */
  return [...new Set(out.filter(x => x && x.length >= 2))]; };
const faceHits = (read, names) => names.reduce((a, nm) => a + (String(read || '').split(nm).length - 1), 0);
/* 원본을 조각으로 — 조각마다 원본에서 몇 px 부터 몇 px 인지(상자를 원본 좌표로 되돌리려고) */
async function faceCopies(src){
  const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
  const W = img.naturalWidth, H = img.naturalHeight, out = [], max = typeof IMG_MAX === 'number' ? IMG_MAX : 4;
  const jpg = c => new Promise(r => c.toBlob(r, 'image/jpeg', .9));
  const cut = async (y0, h, tw) => { const k = tw / W, c = document.createElement('canvas'); c.width = tw; c.height = Math.round(h * k); const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, y0, W, h, 0, 0, c.width, c.height); return { blob:await jpg(c), y0, h }; };
  if (H / W <= 2.2) out.push(await cut(0, H, Math.round(W * Math.min(1, 1600 / Math.max(W, H)))));
  else { const tw = Math.round(W * Math.min(1, 1100 / W)), th = Math.round(W * 1.8), ov = Math.round(W * .12);
    for (let y = 0; y < H && out.length < max; y += th - ov){ const h = Math.min(th, H - y); out.push(await cut(y, h, tw)); if (y + h >= H) break; } }
  return { W, H, parts:out.filter(p => p.blob) };
}
const faceSrcOf = e => { const c = e.card && nodeOf(e.card); return [e.asset ? '/_blob/' + e.asset : '', e.big, c && c.big, c && c.mid].filter(Boolean); };
async function faceFind(P, e, sample){
  const names = faceNames(P); let got = null;
  for (const src of faceSrcOf(e)){ try{ got = await faceCopies(src); if (got.parts.length) break; }catch(x){ got = null; } }
  if (!got || !got.parts.length) return null;
  const p = `메신저(카톡 등) 캡처 원본 조각 ${got.parts.length}장이다(위에서부터 0번${got.parts.length > 1 ? `~${got.parts.length - 1}번` : ''}).
찾을 사람: 「${P.title}」${names.length > 1 ? `(다르게 부르는 이름: ${names.slice(1).join(', ')})` : ''}.
이 사람의 프로필 사진(프사) 하나를 찾아라 — 그 사람 이름표·말풍선 바로 옆의 동그랗거나 둥근 네모 사진. 1:1 방이면 맨 위 방 이름이 상대이고, 받은 쪽(보통 왼쪽) 말풍선 옆 프사가 그 사람이다. 기본 프사(회색 사람 모양)도 프사로 친다.
이 사람 것인지 확실하지 않으면 찾지 못한 것으로 한다. 다른 사람 프사를 고르지 않는다.
JSON 하나만: {"found":true,"piece":0,"box":[왼,위,너비,높이],"desc":"프사에 보이는 것 한 줄"} — box 는 그 조각 하나를 1로 본 0~1 비율, 프사 동그라미만 딱 맞게.
못 찾으면 {"found":false,"why":"한 줄"}`;
  let r = null; try{ r = await sample.json(p, { model:AI.model, effort:'low', images:got.parts.map(x => x.blob) }); }catch(x){ act('프사 찾기 실패', { id:P.id, ev:e.id, code:x && x.code || '' }); return null; }
  if (!r || r.found !== true || !Array.isArray(r.box)) return { miss:String(r && r.why || '') };
  const part = got.parts[Math.max(0, Math.min(got.parts.length - 1, r.piece | 0))], b = r.box.map(Number);
  if (b.length !== 4 || !b.every(v => isFinite(v) && v >= 0 && v <= 1) || b[2] < .004 || b[3] < .002 || b[2] > .45 || b[3] > .45) return { miss:'상자가 이상함' };
  const box = [b[0], (part.y0 + b[1] * part.h) / got.H, b[2], b[3] * part.h / got.H];   /* 조각 → 원본 비율 */
  return { box, desc:String(r.desc || '').slice(0, 60) };
}
async function faceAuto(){
  if (FACE_BUSY || typeof S === 'undefined' || !S || busy) return;
  const sample = await getSample(); if (!sample || !canImg) return;
  FACE_BUSY = true;
  try{
    for (const P of S.nodes.filter(n => n.kind === 'person' && !n.face && !n.faceNo)){
      if (busy) break;
      const names = faceNames(P), tried = P.faceTried || [];
      const cands = (S.ev || []).filter(e => e.kind === 'photo' && e.read && !tried.includes(e.id)).map(e => ({ e, h:faceHits(e.read, names) })).filter(x => x.h > 0).sort((a, b) => b.h - a.h).slice(0, 2);
      for (const { e } of cands){
        P.faceTried = [...(P.faceTried || []), e.id];
        const f = await faceFind(P, e, sample); if (!f || !f.box){ act('프사 못 찾음', { id:P.id, ev:e.id, why:f && f.miss || '' }); continue; }
        const F = (e.card && nodeOf(e.card)) || { id:e.id, asset:e.asset, big:e.big, thumb:e.thumb };
        const url = await cropFace(F, f.box); if (!url) continue;
        if (P.face || P.faceNo || !nodeOf(P.id)) break;   /* 그사이 동료·마틴이 붙였거나 뗐으면 그대로 */
        P.face = url; P.faceFrom = e.card || ''; P.faceEv = e.id; P.faceAuto = 1;
        const nm = faceNames(P)[0], tag = `[프사] ${nm}`;
        if (f.desc && !String(e.read).includes(tag)) e.read = (e.read + `\n${tag} — ${f.desc}`).slice(0, 1800);
        act('프사 자동', { id:P.id, ev:e.id, desc:f.desc });
        save(); renderNodes(); renderStrings(); renderMarks(); sfx(P.x + 50, P.y - 80, '찰칵');
        break;
      }
    }
  } finally { FACE_BUSY = false; save(); }
}
/* 「이 사진 빼기」(sheets.js)를 누르면 그 카드엔 다시 안 붙인다 — 그쪽 처리보다 먼저 듣는다 */
document.addEventListener('click', ev => { const t = ev.target.closest && ev.target.closest('[data-unface]'); if (!t || typeof nodeOf !== 'function') return; const n = nodeOf(t.dataset.unface); if (n) n.faceNo = 1; }, true);
setTimeout(() => { try{ faceAuto(); }catch(e){} }, 6000);   /* 사건을 연 뒤 한 번 — 예전에 세운 얼굴 없는 인물 카드도 */
