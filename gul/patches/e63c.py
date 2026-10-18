def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
rep(P,"· 준 피해 ${Math.round(r.dmg)}${r.dealt ? ' · 받은 피해 ' + Math.round(r.dealt) : ''}","· ${S ? '적이' : '우리가'} 입힌 피해 ${Math.round(r.dmg)}${r.dealt ? ` · ${S ? '적이' : '우리가'} 받은 피해 ${Math.round(r.dealt)}` : ''}")
rep(P,"""    <span class="tr"><span class="lb">체력</span> ${hpTxt}</span>
""","""    <span class="tr"><span class="lb">체력</span> ${hpTxt}</span>
    ${!ed && Wd.intel && (u.side === 1 || see) ? (() => { const S = 1 - u.side, r = (Wd.intel[S] || {})[u.i], J = (Wd.judge || [])[S] || {}, lb = S ? '적이 아는 것' : '우리가 아는 것';   // v6.3 본 것 · 겪은 것만 (적이 아는 건 '적 다 보기' 일 때만)
      return !r || r.seenT == null ? (S ? `<span class="tr"><span class="lb">${lb}</span> 아직 못 봄</span>` : '') : `<span class="tr"><span class="lb">${lb}</span> ${esc(r.tags.join(' · ') || '겉모습뿐')} · 짐작 체력 ${Math.round(Math.max(0, r.guess - r.dmg))}/${r.guess}${J.d === u.i ? ' · 가장 위험' : ''}${J.c === u.i ? ' · 전장의 중심' : ''}</span>`; })() : ''}
""")
