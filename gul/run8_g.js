/* ---------- v8.5.1 여정 목록 — run8_g.js v1.1 (v1.1: 여정 설계의 [야시A] · [야시B] 는 특성이 아니라 야시 등급 (nvG) 으로 옮김 — 특성 검사가 찾아냄 · v1.0: 인카운터 탭에 30층 여정 (층 표 · 보스 · 정예 · 만남 · 히든 · 결승) · 설계 칸에 여정 인물 모두 (적 · 보스 · 합류 동료 · 적뢰) — 누르면 붓 · 특성 탭에도) ----------
   여정 인물은 여정 전용 설계 (FOE8 · 이 판의 수치 · 층 보정 없음). 합류하는 동료 (세르파 · 물레 · 콜라이더) 는 아군 설계 그대로 (allyOv). */
for (const d of Object.values(FOE8)){ const i = (d.traits || []).findIndex(t => /^야시[SABCD]$/.test(t)); if (i >= 0){ d.nv = true; d.nvG = d.traits[i].slice(2); d.traits.splice(i, 1); } }   // v1.1
const ENC8_NM = { odile: '오딜의 방', chin: '잠든 사냥꾼 (친칠라)', tang: '불가의 사내 (탕아)', aiten: '토끼마차 (아이텐)', hora: '대장군 호레이쇼', lost: '따라온 이', curse: '지식의 저주', wam: '왐의 카드판', nurse: '야전병원 (간호사장)', rosina: '로지나', lang: '탐험가 랑팡', marie: '마리와 와킨', smith: '대장장이 탄탄만', hood: '두건', uncle: '무서운 아재', tehera: '초월자 테헤라', pehto: '청염의 기사 페흐토', ahae: '도깨비 아해', admin: '관리자' };
function R8DES(){   // 설계 칸 · 특성 탭에 넣을 여정 인물 (FOE8 가 아직 없으면 빈 목록)
  try { const have = new Set(DESIGN_DEFAULTS.map(d => d.key)), L = Object.values(FOE8).filter(d => !have.has(d.key)).map(d => ({ ...clone(d), run8: true }));
    if (typeof jrDesign === 'function'){ const j = jrDesign(); L.push({ ...clone(j), key: j.key || '적뢰', run8: true, hidden: true }); }
    return L; } catch (e) { return []; }
}
function r8DesignsHtml(){
  const L = R8DES(); if (!L.length) return '';
  const g = [['보스 · 히든', d => (d.traits || []).includes('보스')], ['정예 · 중간보스', d => !(d.traits || []).includes('보스') && (d.tier || 0) >= 4], ['무리', d => !(d.traits || []).includes('보스') && (d.tier || 0) < 4]];
  const card = d => { const on = brush && brush.design === d.key;
    return `<div class="dsl ${on ? 'on' : ''} f"><button type="button" class="dc" data-dsg="${esc(d.key)}" aria-pressed="${on}"><span class="fc" style="${d.ref ? faceCss(faceOf(d.ref), 36) : ''}"></span><span class="n">${esc(d.key)}</span>
      <span class="m">${esc(TNAME[d.tier] || (d.tier ? d.tier + '성' : ''))} · ${esc(d.weapon || '')}${d.role ? ' · ' + esc(d.role) : ''}${d.height ? ' · ' + d.height + 'm' : ''}${d.ov && d.ov.hp ? ' · 체력 ' + d.ov.hp : ''}</span>
      ${(d.traits || []).length ? `<span class="m">${esc(d.traits.map(t => '[' + t + ']').join(' '))}</span>` : ''}${d.note ? `<span class="m">${esc(d.note)}</span>` : ''}</button></div>`; };
  return `<details class="r8dsg" open><summary class="lab">30층 여정 인물 ${L.length} — 적 · 보스 · 히든 (여정 전용 설계 · 층 보정 없음)</summary>${g.map(([nm, f]) => { const G = L.filter(f); return G.length ? `<p class="sublab">${nm} ${G.length}</p><div class="dgrid">${G.map(card).join('')}</div>` : ''; }).join('')}</details>`;
}
function r8DocBoxes(B){
  const fo = L => (L || []).map(([k, n, w]) => { const d = FOE8[k] || {}; return encFace(d.ref || null, k === '@saved' ? '저장된 도전자' : k, (n > 1 ? '× ' + n + ' · ' : '') + (d.tier ? d.tier + '성' : '') + (w ? ' · ' + w : '')); }).join('');
  const bandNm = { sewer: '하수구', cave: '동굴', crystal: '수정', neon: '네온', yokai: '요괴', hell: '심계', abyss: '마계', neo: '네오', spirit: '정령', machina: '기계천사', temple: '성전', space: '우주', cyber: '사이버', war: '전쟁', gods: '삼신', void: '차원', data: '데이터', stadium: '스타디움' };
  const bossNm = b => b === 'neo' ? '하딤 또는 사슴 (둘 중 하나)' : b === 'regina' ? '레지나' : (BOSS8[b] || {}).name || b;
  let h = `<div class="box"><p class="lab">30층 여정 ${B('fix', '2층 ~ 30층')}</p><p class="note">1F 프롤로그를 넘으면 (정산 화면 → 30층 여정) 2층부터. 층마다 갈림길 지도 · 뽑기 세 번 · 10 · 20층 보스 뒤 정산 · 20층부터 챔피언 로드 · 30층 결승. 적은 층이 깊을수록 세짐 (체력 +${Math.round(R8.scale.hp * 100 * 10) / 10}% · 공격 +${Math.round(R8.scale.atk * 100 * 10) / 10}% / 층).</p>
    <div class="tw"><table class="tbl encT"><thead><tr><th class="l">층</th><th class="l">이름</th><th class="l">무리</th><th class="l">그림 맵</th><th class="l">정예 · 보스 · 고정</th></tr></thead><tbody>${Object.entries(F8).map(([f, F]) => `<tr><td class="l">${f}</td><td class="l">${esc(F.name)}</td><td class="l">${esc(bandNm[F.band] || F.band || '')}</td><td class="l">${esc((F.maps || []).join(' · '))}</td><td class="l">${[F.elite ? '☠ ' + esc((ELITE8[F.elite] || {}).name || F.elite) : '', F.boss ? '👑 ' + esc(bossNm(F.boss)) : '', F.fixed ? '📍 ' + esc(typeof r8FixedName === 'function' ? r8FixedName(F.fixed) : F.fixed) : '', F.settle ? '정산' : '', F.final ? '🏆 결승' : ''].filter(Boolean).join(' · ')}</td></tr>`).join('')}</tbody></table></div></div>`;
  h += `<div class="box"><p class="lab">보스 ${B('fix', '👑')}</p><table class="tbl encT"><tbody>${Object.entries(BOSS8).filter(([k, b]) => !b.pick && !b.npc).map(([k, b]) => encTr(esc(b.name || k), (b.waves ? b.waves.map(([w, n, who]) => `<b>${esc(who)}</b> ${fo([[w, n]])}`).join(' → ') : fo(b.foes)) + (b.join || b.reward ? ` <small class="lb">이기면 합류 ${esc(b.join || b.reward)}</small>` : '') + (b.tear ? ' <small class="lb">💧 여신의 눈물</small>' : ''))).join('')}${encTr('레지나', '10층 알현실 — 1F 의 레지나 만남 그대로 (인카운터 목록의 레지나)')}</tbody></table></div>`;
  h += `<div class="box"><p class="lab">정예 ${B('rnd', '☠')}</p><table class="tbl encT"><tbody>${Object.values(ELITE8).map(e => encTr(esc(e.name), fo(e.foes))).join('')}</tbody></table></div>`;
  const wT = ENC8.reduce((a, x) => a + x[1], 0);
  h += `<div class="box"><p class="lab">만남 ${B('rnd', '❓')}</p><div class="tw"><table class="tbl encT"><thead><tr><th class="l">만남</th><th class="l">층</th><th class="l">몫</th></tr></thead><tbody>${ENC8.map(([k, w, a, b]) => { const kk = k.replace(/^t:/, ''); return `<tr><td class="l">${esc(ENC8_NM[kk] || kk)}</td><td class="l">${a} ~ ${b}층</td><td class="l">${(w / wT * 100).toFixed(1)}%</td></tr>`; }).join('')}</tbody></table></div></div>`;
  const J = typeof jrDesign === 'function' ? jrDesign() : null;
  h += `<div class="box"><p class="lab">히든 · 결승 ${B('ev', '사건')}</p><table class="tbl encT"><tbody>${J ? encTr('히든보스 적뢰', encFace(J.ref, '적뢰', '7성') + ' 1F 1S (여정 밖) 캠페인 띠 "↓ 굴 밖으로" → 30초 → 폭우 · 낙하 · 날라차기 · 붉은 번개창 · 천벌 · [낙인:적뢰] · 이기면 성해포') : ''}${encTr('챔피언 로드', '20층부터 MC 더 플링 실황 · 관중 열기 (응원 · 야유 · 축복 · 증오) · 깜짝 규칙 (어둠 · 황금 · 광란 · 시계)')}${encTr('30층 결승', '링 위 1대1 — 글리치 챔피언 (오른 이를 그대로 비춤 · 특수능력 봉인) · 직접 조작 · 150초 판정')}</tbody></table></div>`;
  return h;
}
