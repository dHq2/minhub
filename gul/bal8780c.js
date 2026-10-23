// 어퐁 · 카리우스 겨룸 재기 — bal8780c.js v1.0 (v1.0: 페이지 설계 그대로 (pdes) · 1대1 · 1대 무리 · 적 · 아군 바꿔서 · 카리우스는 새 기술 (3D · 근성 · 불경자) 있고 없고 견줌)
const {E,R,mk}=require('./scen_lib790.js'); const PD=require('./pdes.js');
const step=(W)=>{ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; };
const des=k=>{ const d=JSON.parse(JSON.stringify(PD[k])); delete d.key; return d; };
const OLDK=()=>{ const d=des('카리우스'); d.traits=d.traits.filter(t=>t!=='근성'&&t!=='불경자'); d.active=['돌진']; d.name='카리우스 (옛)'; return d; };
function fight(hero, side, foes, seed){ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false;
  const us=[mk(hero,side,10,10)]; foes.forEach((k,i)=>us.push(mk(des(k),1-side,25+(i%2),8+i*1.5)));
  const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units:us,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed,{headless:true}); E.computeLight(W);
  const p=W.units[0], F=W.units.filter(u=>u.side!==p.side); for(const f of F) if(f.cz) f.cz.on=true; let k=3600;
  while(k-->0&&p.alive&&F.some(f=>f.alive)) step(W);
  const L=K=>W.log.filter(l=>l.k===K&&l.a===p.i).length;
  return {win:!F.some(f=>f.alive), lose:!p.alive, t:W.t, hp:Math.max(0,p.hp)/p.max, sk:{ sup:L('apSup'), kick:L('akick'), grab:L('karGrab'), swat:L('karSwat'), hook:L('karHook')/3, slam:L('karSlam'), rush:L('karRush'), grit:W.log.filter(l=>l.k==='karGrit'&&l.b===p.i&&l.ph==='agony').length, her:W.log.filter(l=>l.k==='karHeretic'&&l.a===p.i&&l.on).length }}; }
const heroes={ '어퐁': ()=>des('어퐁'), '카리우스': ()=>des('카리우스'), '카리우스(옛)': OLDK };
const cases=(process.argv[2]?process.argv[2].split(';').map(s=>s.split('+')):[['세자르'],['각혈'],['호레이쇼'],['굿윌'],['곤봉적'],['검기사','창병','궁수','검방패기사'],['곤봉적','검기사']]);
const only=process.env.HERO?process.env.HERO.split(','):Object.keys(heroes);
for (const h of only) for (const c of cases){ let w=0,l=0,T=0,H=0; const S={}; const N=+(process.env.N||8); for(let s=1;s<=N;s++){ const r=fight(heroes[h](),s%2,c,s*7+1); if(r.win) w++; if(r.lose) l++; T+=r.t; H+=r.hp; for(const k in r.sk) S[k]=(S[k]||0)+r.sk[k]; }
  const sk=Object.entries(S).filter(([k,v])=>v).map(([k,v])=>k+' '+(v/N).toFixed(1)).join(' · ');
  console.log(h.padEnd(8),(c.join('+')).padEnd(22),w+'승',l+'패','· 평균',(T/N).toFixed(1)+'초','· 남은 체력',(H/N*100).toFixed(0)+'%',sk?'· '+sk:''); }
