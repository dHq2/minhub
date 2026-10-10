# sync_names.py v1.1 — 도감 본명 → 게임 이름 (2026-10-08) (v1.1, 2026-10-10: 4기 잡몹 9인 (mob9.js) → 도감 C-285~C-293 · 소환물 (H2R summon — 세르파의 거품게 · 시종 …) 과 각펄 · 마계장군 A 는 제 이름 그대로)
#  본명 = 도감에서 고친 이름 (marks[C-…].name) > 도감 목록 이름 (catalog sub 첫 칸). 괄호 ( … ) 는 꼬리표라 뗌 (3성 · 보스 · 펫 …)
#  어느 게임 인물이 어느 도감 인물인지: 2 · 3기 = 도감 그림 번호 'X-h2-<slug>' · 적 그림 = tools/foe_art.py 의 원본 · 2D 옛 적 = 'O-<키>-' · 나머지는 아래 MAP
#  출력: src/names.js — const BONMYEONG = { 게임 키: 본명 } + 불러올 때 DEFS · H2R · HERO_DEF 이름을 바꿔 씀
#  실행: python3 tools/sync_names.py [도감 marks 내려받은 폴더]   (폴더를 주면 도감에서 고친 이름을 먼저 씀)
import os, re, json, sys, glob
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); CODEX = os.path.join(os.path.dirname(ROOT), 'codex')
MAP = {   # 그림 번호로 못 잇는 게임 인물 → 도감 인물 번호
    'player': 'C-001', 'cheong': 'C-004', 'cheongAlly': 'C-004', 'cheongNpc': 'C-004', 'karius': 'C-003', 'kariusAlly': 'C-003',
    'rebeccaAlly': 'C-002', 'goodwill': 'C-010', 'foeDevil': 'C-068', 'foeFairy': 'C-069', 'foeCultist': 'C-064', 'foeJelly': 'C-065',
    'ratKnight': 'C-059', 'ratKnightV': 'C-059', 'ratV': 'C-270', 'goldknightAlly': 'C-198', 'snail': 'C-037',
    'ssangbu': 'C-285', 'bangdokki': 'C-286', 'eastRifle': 'C-287', 'eastSniper': 'C-288', 'maskBlade': 'C-289',   # v1.1 4기 잡몹 (동방 5)
    'huntKnife': 'C-290', 'camilla': 'C-291', 'mokja': 'C-292', 'seondoja': 'C-293',   # 서방 4
}
KEEP = {'h2:ratvet', 'h2:ahae_wraith', 'h2:levi_beast', 'h2:pearlgak', 'h2:sawknight'}   # 게임만의 변형 · 소환수 이름은 그대로 (쥐 베테랑 = 쥐 기사가 자란 것 · 각펄 = 펄의 보스판 · 마계장군 A 는 도감 '마족 2' 묶음의 한 명)
base = lambda n: re.sub(r'\s*\([^)]*\)', '', n).strip()

def main():
    s = open(os.path.join(CODEX, 'catalog.js'), encoding='utf-8').read(); cat = json.loads(s[s.index('['):s.rindex(']') + 1])
    sub, src2cid, h2c, old = {}, {}, {}, {}
    for e in cat:
        c = e.get('cid')
        if not c: continue
        sub.setdefault(c, e['sub'].split(' · ')[0]); src2cid[e['src']] = c
        m = re.match(r'^[OPF]-h2-([A-Za-z0-9]+?)(?:-|$)', e['id'])
        if m: h2c.setdefault(m.group(1), c)
        m = re.match(r'^O-([A-Za-z]+)-', e['id'])
        if m and m.group(1) != 'h2': old.setdefault(m.group(1), set()).add(c)
    marks = {}
    if len(sys.argv) > 1:
        for f in glob.glob(os.path.join(sys.argv[1], '**', 'C-*.json'), recursive=True):
            v = json.load(open(f, encoding='utf-8')); d = v.get('data', v)
            if d.get('name'): marks[os.path.basename(f)[:-5]] = d['name']
    name = lambda c: base(marks.get(c) or sub[c])
    out = {}
    r = open(os.path.join(ROOT, 'src', 'h2_roster.js'), encoding='utf-8').read(); H2R = json.loads(r[r.index('{'):r.rindex('}') + 1])
    for slug in H2R:
        if 'h2:' + slug in KEEP or slug not in h2c: continue
        sm = H2R[slug].get('summon')   # v1.1 소환물 (summon: 주인 — 세르파의 거품게 · 시종 …) 이 주인 묶음 (같은 도감 인물) 에 들어 있으면 주인 이름이 되므로 뺌. 아해 · 레비의 summon 은 제 소환수 이름
        if isinstance(sm, str) and sm != slug and h2c.get(sm) == h2c[slug]: continue
        out['h2:' + slug] = name(h2c[slug])
    fa = open(os.path.join(HERE, 'foe_art.py'), encoding='utf-8').read()
    for k, pose, p in re.findall(r"\('(\w+)', '(\w+)', '([^'@][^']*)'\)", fa):
        c = src2cid.get('img/' + p)
        if c and k not in out: out[k] = name(c)
    for k, cs in old.items():
        if len(cs) == 1 and k not in out: out[k] = name(next(iter(cs)))
    for k, c in MAP.items():
        if c in sub: out[k] = name(c)
    js = ('/* names.js v1.1 — tools/sync_names.py 가 만듦 (손으로 고치지 말 것). 도감 본명 → 게임 이름 (v1.1: 4기 인물 · 잡몹 9인 · 기병기사)\n'
          '   본명 = 도감에서 고친 이름 > 도감 목록 이름, 괄호 꼬리표는 뗌. 2 · 3기 명단 (H2R)은 이름 뒤 설명 괄호를 그대로 둠 */\n'
          "'use strict';\n"
          'const BONMYEONG = ' + json.dumps(dict(sorted(out.items())), ensure_ascii=False, separators=(',', ':')) + ';\n'
          '(function(){\n'
          "  const swap = (old, nm) => { const m = /^(.*?)\\s*(\\(.*\\))?\\s*$/.exec(old || ''), b = m[1], tail = m[2] || '', extra = b !== nm && b.startsWith(nm) ? b.slice(nm.length).trim() : '';\n"
          "    return nm + (extra || tail ? ' (' + [extra, tail.slice(1, -1)].filter(Boolean).join(' · ') + ')' : ''); };\n"
          '  for (const [k, nm] of Object.entries(BONMYEONG)){\n'
          "    if (k.startsWith('h2:')){ const s = k.slice(3); if (typeof H2R === 'undefined' || !H2R[s]) continue;\n"
          "      const was = H2R[s].name; H2R[s].name = swap(was, nm);\n"
          "      for (const p of ['h2_', 'h2e_']) if (DEFS[p + s]) DEFS[p + s].name = nm;\n"
          "      if (typeof SOLP !== 'undefined' && SOLP['h2_' + s] && SOLP['h2_' + s].pas && SOLP['h2_' + s].pas[0] === was) SOLP['h2_' + s].pas[0] = H2R[s].name; }\n"
          '    else if (DEFS[k]) DEFS[k].name = nm;\n'
          '  }\n'
          "  if (typeof HERO_DEF !== 'undefined') for (const h of Object.values(HERO_DEF)) if (h.unit && BONMYEONG[h.unit]) h.name = BONMYEONG[h.unit];\n"
          '})();\n')
    open(os.path.join(ROOT, 'src', 'names.js'), 'w', encoding='utf-8').write(js)
    print(f'게임 인물 {len(out)}명 · 도감에서 고친 이름 {len(marks)}명')

if __name__ == '__main__': main()
