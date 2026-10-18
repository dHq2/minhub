# v7.10.0 D: 공식 부대장 (노먼) — 직책 · 계승 · 편대 · 편대 자율 지휘
import sys,re
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    return s.replace(a,b)
h=open(D+'rt3_head.js').read()
h=rep(h,"   v7.9.5: 사용자 검수","""   v7.10.0 부대장: 공식 직책 (노먼). 지휘관 (인주) 이 쓰러지면 바로 이어받음 (옛 임시 지휘관은 부대장도 없을 때). 전달 때 가장 믿을 만한 중계자. 편대 (sqLead): 부대장에게 배속된 아군은 주인공 대신 부대장을 따르고 · 부대장이 정한 표적을 함께 노림 ('저놈!' 외침이 닿는 거리 안).
           부대장의 자율 지휘 (명령 없을 때): 아는 적과 비교해 편대 힘의 비가 fall (0.6) 아래면 편대를 이끌고 본대 (주인공) 로 물러남 (10초) · 아니면 가장 가까운 위협을 표적으로 외쳐 줌. 지휘관과 4초 넘게 닿지 않은 이가 부대장과 닿으면 스스로 편대에 들고 (자동 편입), 지휘관과 4초 닿으면 본대로 돌아감.
   v7.9.5: 사용자 검수""")
h=rep(h,"  cmdLinkW: { hops: 3,","  sq: { joinT: 4, leaveT: 4, near: 14, fall: 0.6, fallT: 10, bonus: 1.2, callT: 6 },   // v7.10 부대장 편대\n  cmdLinkW: { hops: 3,")
open(D+'rt3_head.js','w').write(h)
t=open(D+'rt3_tail.js').read()
t=rep(t,"      cmd: cmdOf0(p, rules),","      cmd: Math.max(cmdOf0(p, rules), (p.rank || RANK_REF[p.ref]) === '부대장' ? 1 : 0), rank: p.rank || RANK_REF[p.ref] || '', sqLead: null,")
t=rep(t,"const cmdBoss = (W, side) => W.units.filter(u => u.alive && !u.crawl && u.side === side && u.cmd > 0 && !(u.koT && W.t < u.koT)).sort((a, b) => b.cmd - a.cmd || (a.cmdTmp ? 1 : 0) - (b.cmdTmp ? 1 : 0))[0] || null;","const RANK_REF = { 'C-007': '부대장' };   // v7.10 공식 부대장 (노먼)\nconst cmdBoss = (W, side) => W.units.filter(u => u.alive && !u.crawl && u.side === side && u.cmd > 0 && !(u.koT && W.t < u.koT)).sort((a, b) => b.cmd - a.cmd || (b.rank === '부대장' ? 1 : 0) - (a.rank === '부대장' ? 1 : 0) || (a.cmdTmp ? 1 : 0) - (b.cmdTmp ? 1 : 0))[0] || null;\nconst deputyOf = (W, side) => W.units.find(u => u.alive && u.side === (side || 0) && u.rank === '부대장' && !u.crawl) || null;\nfunction leadOf(W, u){ if (u.sqLead == null || u.hero) return null; const D = W.units[u.sqLead]; return !D || !D.alive || D.down || D.crawl || D === u || (D.sqFall && W.t < D.sqFall) ? null : D; }   // v7.10 편대장 (부대장) — 물러나는 동안은 본대 (주인공) 로")
# posture
t=rep(t,"const POSTURES = { roe: ['free', 'smart', 'hold', 'nofire'], heal: ['dying', 'free', 'order'] };","const POSTURES = { roe: ['free', 'smart', 'hold', 'nofire'], heal: ['dying', 'free', 'order'], sq: ['main', 'dep'] };")
t=rep(t,"function applyPosture(W, u, key, val, c){\n","""function applyPosture(W, u, key, val, c){
  if (key === 'sq'){ const Dp = deputyOf(W, u.side), prev = u.sqLead != null ? 'dep' : 'main'; u.sqLead = val === 'dep' && Dp && Dp !== u && !u.hero ? Dp.i : null; u.sqAuto = false; const now = u.sqLead != null ? 'dep' : 'main'; if (prev !== now) L(W, { k: 'posture', a: u.i, key, val: now, prev, c: c != null ? c : null, b: Dp ? Dp.i : null, vis: true }); return; }   // v7.10 편대 배속
""")
# netTick: 계승 + deputyTick 호출
t=rep(t,"  const C = cmdBoss(W, 0), H = W.rules.hm || {};\n  for (const u of W.units){ if (u.side !== 0 || !u.alive) continue;\n    const lk0","  const C = cmdBoss(W, 0), H = W.rules.hm || {};\n  if (C && W.bossI != null && W.bossI !== C.i){ L(W, { k: 'succeed', a: C.i, from: W.bossI, deputy: C.rank === '부대장', vis: true }); } if (C) W.bossI = C.i;   // v7.10 지휘 계승\n  for (const u of W.units){ if (u.side !== 0 || !u.alive) continue;\n    const lk0")
t=rep(t,"netTick(W); hmTick(W);","netTick(W); deputyTick(W); hmTick(W);")
t=rep(t,"const offT = (W, u) => u.offFrom != null ? W.t - u.offFrom : 0;","""const offT = (W, u) => u.offFrom != null ? W.t - u.offFrom : 0;
// v7.10 부대장의 편대: 자동 편입 · 해제 + 자율 지휘 (표적 외침 · 힘이 모자라면 편대를 이끌고 본대로)
function deputyTick(W){
  const S = W.rules.sq || {}, D = deputyOf(W, 0); if (!D || AI6.includes('deputy')) return;
  const boss = cmdBoss(W, 0), sq = () => W.units.filter(u => u.alive && u.side === 0 && u.sqLead === D.i && !u.down);
  for (const u of W.units){ if (u.side !== 0 || !u.alive || u === D || u.hero) continue;
    const off = offT(W, u);
    if (u.sqLead == null && boss && boss !== D && off >= (S.joinT || 4) && dist(u, D) < (S.near || 14) && cmdLink(W, D, u).p >= 0.5){ u.sqLead = D.i; u.sqAuto = true; u.sqOk = 0; L(W, { k: 'sqJoin', a: u.i, b: D.i, vis: true }); }
    else if (u.sqLead != null && u.sqAuto){ u.sqOk = (u.net || 0) >= 0.6 ? (u.sqOk || 0) + 0.5 : 0; if (u.sqOk >= (S.leaveT || 4)){ u.sqLead = null; u.sqAuto = false; L(W, { k: 'sqLeave', a: u.i, b: D.i, vis: true }); } }
    if (u.sqLead != null && u.sqLead !== D.i) u.sqLead = null; }
  const members = sq(); if (!members.length || D.order || D.down || D.crawl){ if (!members.length) D.sqFocus = null; return; }
  const grp = [D].concat(members), kn = f => f.alive && f.side === 1 && dist(f, D) < 16 && (f.seenBy || grp.some(a => fresh(W, a.sense[f.i], 3))), known = W.units.filter(kn);
  if (!known.length){ D.sqFocus = null; return; }
  const mine = grp.filter(a => dist(a, D) < 14).reduce((s, a) => s + powOf(a), 0), theirs = known.filter(f => dist(f, D) < 12).reduce((s, f) => s + powOf(f), 0) || 1, odds = mine / theirs;
  if (odds < (S.fall != null ? S.fall : 0.6) && !(D.sqFall && W.t < D.sqFall)){ D.sqFall = W.t + (S.fallT || 10); D.sqFocus = null; L(W, { k: 'sqFall', a: D.i, n: members.length, odds: +odds.toFixed(2), vis: true }); D.lastDec = { t: W.t, s: `편대 ${members.length + 1}명의 힘이 적의 ${(odds * 100).toFixed(0)}% — 본대로 물러남` }; return; }
  if (D.sqFall && W.t < D.sqFall) return;
  const cur = D.sqFocus && D.sqFocus.t0 != null ? W.units[D.sqFocus.b] : null;
  if (cur && cur.alive && known.includes(cur)){ D.sqFocus.t = W.t; return; }
  const hit = f => grp.some(a => f.target === a || (f.act && f.act.b === a.i)) ? -6 : 0, pick = known.slice().sort((a, b) => dist(D, a) + hit(a) - dist(D, b) - hit(b))[0];
  D.sqFocus = { b: pick.i, t: W.t, t0: W.t }; L(W, { k: 'sqCall', a: D.i, b: pick.i, n: members.length, vis: true }); D.lastDec = { t: W.t, s: `편대에 ${pick.name}을(를) 먼저 치라고 외침 (힘의 비 ${odds.toFixed(1)})` };
}""")
# think 앵커
t=rep(t,"  const anchor = u.stay || (hero && !u.hero ? hero : u); let lim","  const lead = leadOf(W, u) || hero, anchor = u.stay || (lead && !u.hero ? lead : u); let lim")
# 표적 가산
t=rep(t,"      const fc = W.cmdFocus0 && W.t - W.cmdFocus0.t < 8 ? W.cmdFocus0.b : null, sc = f => -dist(u, f) * 0.8 + roleBias(W, u, f) + (f.i === fc ? 1.2 : 0)","      const fc = W.cmdFocus0 && W.t - W.cmdFocus0.t < 8 ? W.cmdFocus0.b : null, fcS = (() => { const Dq = u.sqLead != null ? W.units[u.sqLead] : null; return Dq && Dq.alive && Dq.sqFocus && W.t - Dq.sqFocus.t < ((W.rules.sq || {}).callT || 6) && dist(Dq, u) <= cmdRange(W, Dq) ? Dq.sqFocus.b : null; })(), sc = f => -dist(u, f) * 0.8 + roleBias(W, u, f) + (f.i === fc ? 1.2 : 0) + (f.i === fcS ? (W.rules.sq || {}).bonus || 1.2 : 0)")
# follow 블록: 편대장을 따라감
i=t.index("  if (u.state === 'follow' && hero){\n")
j=t.index("    return;\n  }\n",i)+len("    return;\n  }\n")
blk=t[i:j]
blk=re.sub(r'\bhero\b','HL',blk)
t=t[:i]+"  const HL = leadOf(W, u) || hero;   // v7.10 편대원은 부대장을 따라감\n"+blk+t[j:]
t=rep(t,"module.exports = { cmdWave,","module.exports = { deputyTick, deputyOf, leadOf, cmdWave,")
open(D+'rt3_tail.js','w').write(t); print('ok')
