# v7.24.2 시험 도구 — _libfix7242.py v1.0: 시험 속 인물의 [괴력X] 앞에 같은 등급 [근력X] 를 더함 (예전 괴력이 하던 공격 × 몫을 근력이 이어받음 — 옛 시험의 숫자 그대로)
import re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
FILES = ['t4.js', 't52.js', 'scen_lib790.js', 'eng717.js', 'eng719.js', 'eng7191.js', 'eng7222.js', 'eng7223.js', 'eng7240.js', 'eng7241.js']
tot = 0
for f in FILES:
    s = open(D + f, encoding='utf-8').read()
    n0 = s
    s, n = re.subn(r"(?<!'근력[SABC]',)'괴력([SABC])'", r"'근력\1','괴력\1'", s)
    if n:
        open(D + f, 'w', encoding='utf-8').write(s); tot += n; print(f, n)
print('total', tot)
