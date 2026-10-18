def rep(path, a, b, n=1):
    s = open(path).read(); c = s.count(a); assert c == n, (path, a[:90], c); open(path, 'w').write(s.replace(a, b))
T, H, P = 'rt3_tail.js', 'rt3_head.js', 'page10.tpl.html'
rep(H, "   v6.7.4: [도약] =", "   v6.7.5: 턴 끝 상태표에 땅에 떨어진 무기 · 방패의 자리 · 주인 · 내력 (던진 창 · 떨어뜨림) 과 각자 든 것 (맨손 · 주운 무기 · 방패를 잃음) 을 남김. 던져 둔 창 · 단검은 주인이 살아 있어도 누구나 주울 수 있음 (화면에서도).\n   v6.7.4: [도약] =")
rep(T, "arms: { L: u.arms.L, R: u.arms.R }, bleed: !!u.bleed })) });   // v5.5 부위",
       "arms: { L: u.arms.L, R: u.arms.R }, bleed: !!u.bleed, wpn: unarmed(u) ? '맨손' : u.weapon || '', sh: !!u.shield })),   // v5.5 부위 · v6.7.5 든 것\n    items: (W.items || []).map(it => ({ id: it.id, k: it.k, name: it.name, x: it.x, y: it.y, owner: it.owner, t: +(it.t || 0).toFixed(1), how: it.how || '' })) });   // v6.7.5 땅에 떨어진 무기 · 방패 (자리 · 주인 · 언제 · 어떻게)")
# remember how the item came to lie there
rep(T, "  const it = { id: (W.itemN = (W.itemN || 0) + 1), k, name, x: +p.x.toFixed(2), y: +p.y.toFixed(2), owner: u.i, t: W.t, ...(extra || {}) };",
       "  const it = { id: (W.itemN = (W.itemN || 0) + 1), k, name, x: +p.x.toFixed(2), y: +p.y.toFixed(2), owner: u.i, t: W.t, how: how || '', ...(extra || {}) };")
rep(T, "owner: s.a, name: s.wpn || '창', t: W.t });   // v5.6 id", "owner: s.a, name: s.wpn || '창', t: W.t, how: 'thrown:' + (how || '') });   // v5.6 id")
# page: status table lines
rep(P, "          out.push(`  ${tag} ${padW(u.name, 14)} ${padW(coord(s.x, s.y), 4)} ${padW(s.hp + '/' + u.max, 10)} ${u.side && !s.seen ? '[안 보임] ' : ''}${what}${u.side === 0 ? ' · 명령 ' + orderLabel(Wd, s.order) : ''}${gear}`);\n        }\n        break;",
"""          const held = s.wpn == null ? '' : s.wpn === '맨손' && u.kit0 && u.kit0.weapon && !ITEM_NATURAL.includes(u.kit0.weapon) ? ' · 맨손' : s.wpn && u.kit0 && s.wpn !== u.kit0.weapon && s.wpn !== '맨손' ? ' · 든 것 ' + s.wpn + ' (주움)' : '';
          const shTxt = s.sh == null || !u.kit0 ? '' : u.kit0.shield && !s.sh ? ' · 방패 잃음' : !u.kit0.shield && !u.kit0.arm && s.sh ? ' · 방패 (주움)' : '';
          out.push(`  ${tag} ${padW(u.name, 14)} ${padW(coord(s.x, s.y), 4)} ${padW(s.hp + '/' + u.max, 10)} ${u.side && !s.seen ? '[안 보임] ' : ''}${what}${u.side === 0 ? ' · 명령 ' + orderLabel(Wd, s.order) : ''}${gear}${held}${shTxt}`);   // v6.7.5 든 것
        }
        if (e.items && e.items.length){ out.push(`  땅에 떨어진 것 ${e.items.length}개`);   // v6.7.5 무기 · 방패의 자리
          for (const it of e.items){ const o = Wd.units[it.owner], th = /^thrown/.test(it.how || '') || it.k === 'spear', hw = (it.how || '').replace('thrown:', '');
            out.push(`    ${it.k === 'shield' ? '🛡' : th ? (isRangedW((Wd.rules.weapons || {})[it.name] || {}) ? '🗡' : /창$/.test(it.name) ? '🔱' : '🗡') : '⚔'} ${padW(it.name, 10)} ${padW(coord(it.x, it.y), 4)} ${o ? o.name + '의 것' + (o.alive || o.down ? '' : ' (쓰러짐)') : ''} · ${th ? '던진 ' + (/창$/.test(it.name) ? '창' : '무기') + ({ stuck: ' — 몸에 박혔다 떨어짐', block: ' — 막혀 튕김', bounce: ' — 바위에 튕김', miss: ' — 빗나가 꽂힘' }[hw] || '') : { death: '쓰러지며 떨어뜨림', arm: '팔을 잃어 놓침', arms: '두 팔을 잃어 놓침', swap: '바꿔 들며 내려놓음' }[hw] || '떨어뜨림'} (${it.t}초)${it.k === 'spear' && o && o.alive ? ' · 주인이 주우러 올 수 있음 — 누구나 주울 수 있음' : ''}`); } }
        break;""")
# page: pick UI includes thrown spears/knives of anyone
rep(P, "const pickAt = (Wd, L, x, y, r) => (Wd.items || []).filter(it => it.k !== 'spear' && Math.hypot(it.x - x, it.y - y) < r)", "const pickAt = (Wd, L, x, y, r) => (Wd.items || []).filter(it => Math.hypot(it.x - x, it.y - y) < r)   // v6.7.5 던져 둔 창 · 단검도 (주인이 살아 있어도)\n  ")
rep(P, "  if ((Wd.items || []).some(it => it.k !== 'spear' && C.some(u => canTake(Wd, u, it) && Math.hypot(it.x - u.x, it.y - u.y) < 8))) out.push({ k: 'pick', ic: '✋', nm: '줍기' });",
       "  if ((Wd.items || []).some(it => C.some(u => !(it.k === 'spear' && it.owner === u.i) && canTake(Wd, u, it) && Math.hypot(it.x - u.x, it.y - u.y) < 8))) out.push({ k: 'pick', ic: '✋', nm: '줍기' });   // v6.7.5 남이 던진 창도")
# versions
rep(P, "<!-- 굴의 전투판 v6.7.4 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v6.7.5 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v6.7.5: ① 로그의 턴 끝 상태표에 땅에 떨어진 무기 · 방패 (이름 · 자리 · 누구의 것 · 던진 창인지 떨어뜨린 것인지 · 언제) 와 각자 든 것 (맨손 · 주운 무기 · 방패를 잃음 · 주운 방패) 을 남김.
             ② 고침: 창병이 던진 창을 인주가 못 들던 것 — 주인이 살아 있는 동안 던진 창은 판에서 누르거나 줍기 (E · 부채) 로 고를 수 없게 막혀 있었음. 이제 누구나 주움 (주인은 그 창을 잃고 맨손).
""")
rep(P, 'body.mob .top h1::after{content:" v6.7.4";', 'body.mob .top h1::after{content:" v6.7.5";')
rep(P, '<span class="ver">v6.7.4 · ', '<span class="ver">v6.7.5 · 떨어진 무기 자리 기록 · 남의 창 줍기 · v6.7.4 · ')
rep(P, '<footer>굴의 전투판 v6.7.4 —', '<footer>굴의 전투판 v6.7.5 —')
rep(P, "return `굴의 전투판 v6.7.4 · ${title}", "return `굴의 전투판 v6.7.5 · ${title}")
print('ok')
