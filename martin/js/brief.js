/* martin/js/brief.js — 업데이트 안내 — 바뀐 점을 마틴이 말함. 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
/* ── 업데이트 안내 (v0.4.4, 세희 updBrief 방식) — 업데이트 뒤 처음 열면 마틴이 바뀐 점을 자기 말투로. 머리를 못 쓰면 목록만.
   본 버전은 기기 + 계정(meta/seen)에. 처음 쓰는 사람(빈 판)은 안내 없이 지금 버전으로 표시 */
const verNum = v => String(v || '').replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
const verGt = (a, b) => { const x = verNum(a), y = verNum(b); for (let i = 0; i < 3; i++){ if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
/* 11-16 C: brief(hello) — 하던 판을 다시 열었을 때 첫 인사와 합친다. 말했으면 true(부르는 쪽이 「판은 그대로다」를 건너뜀) */
async function brief(hello){
  let seen = null; try{ seen = localStorage.getItem('drmartin.seen'); }catch(e){}
  if (DB){ try{ const d = await DB.doc('meta/seen').get(); const v = d && d.exists ? d.data().v : null; if (v && (!seen || verGt(v, seen))) seen = v; }catch(e){} }
  if (!seen) seen = isBlank(S) ? VER : 'v0.4.3';   /* 기록이 없는데 하던 판이 있으면 바로 앞 버전부터 안내 */
  const mark = () => { try{ localStorage.setItem('drmartin.seen', VER); }catch(e){} if (DB) put('meta/seen', { v:VER, at:Date.now() }); };
  if (!verGt(VER, seen)){ mark(); return false; }
  const notes = CHANGES.filter(c => verGt(c.v, seen) && !verGt(c.v, VER)); mark(); if (!notes.length) return false;
  act('업데이트 안내', { from:seen, to:VER });
  const items = notes.flatMap(c => c.t); let say = null;
  /* 11-17 D: v0.14 — 사건 중(판이 비어 있지 않음)엔 고정 한 줄, 마틴 말투. 자세한 건 「바뀐 것 자세히」 단추 → 서랍(update.js updSheet) */
  if (!isBlank(S)){ const l = `${hello ? '돌아왔군. 그사이 ' : ''}새 도구 ${items.length}가지가 들어왔다. 자세한 건 서랍에 적어 뒀다.`;
    await speak(l, false); S.log.push({ who:'m', text:l, at:Date.now(), upd:1 }); if (typeof updMoreChip === 'function') updMoreChip(seen); save(); return true; }
  thinking(true);
  const sample = await getSample();
  if (sample){ try{ const r = await sample.json(`${MARTIN_SHORT} 동료(기자이자 수집가)와 함께 쓰는 코르크 추리판 앱이 방금 손질됐다. 동료가 판을 다시 열었을 때, 무엇이 바뀌었는지 마틴 말투로 짧게 알려 준다.
말투: 동료에게 반말. 차분하고 자연스럽게, 말버릇·감탄사 없이. 이모지·별표·존댓말 금지.
바뀐 것(동료에게 보이는 것만):
${items.map(x => '- ' + x).join('\n')}
${hello ? '첫 줄은 돌아온 동료를 맞으며 그사이 판에 손이 갔다고 알리는 말이다(예: "돌아왔군. 그사이 판에 손을 좀 봤다.").\n' : ''}규칙: 2~5줄, 한 줄 45자 안팎. 바뀐 것을 빠짐없이 쉽게, 쓰는 법이 있으면 한마디. 버전 번호·코드·개발 얘기 금지. 사건 얘기는 하지 않는다.
JSON 하나만: {"say":["…","…"]}`, { model:AI.model, effort:'low', modelTier:'quick' });
      say = r && Array.isArray(r.say) ? r.say.map(String).filter(Boolean).slice(0, 6) : null; }catch(e){ act('업데이트 안내 머리 실패', { code:e && e.code || '' }); } }
  thinking(false);
  for (const l of (say && say.length ? say : [hello ? '돌아왔군. 그사이 판에 손을 좀 봤다.' : '판에 손을 좀 봤다, 동료.', ...items.slice(0, 5)])){ await speak(l, false); S.log.push({ who:'m', text:l, at:Date.now(), upd:1 }); }
  save(); return true;
}
