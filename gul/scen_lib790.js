// v7.9.0 사례 시험 공용 (인물 · 판 만들기) — v1.2 (v1.2: 카리우스 [근력A] (v7.24.2 근력 · 괴력 나눔 — 숫자 그대로) · v7.16.1: roe 'hold' 로 만든 판은 autoLift 끔 — 옛 시험의 '구경꾼' 뜻 그대로)
const {E,R,U}=require('./t4.js'); const {DES}=require('./t52.js');
const GOB={ref:'C-004',name:'청광묵',tier:2,cls:'기동',role:'미드필더',weapon:'흑요석 단검',height:1.3,weight:38,sm:1.07,ov:{hp:100,atk:27},traits:['회피A','급소A','발화E','실명:좌안','후각B'],active:['도약','팜 버스트'],race:'고블린',nv:true,nvG:'B'};
const INJ={ref:'C-001',name:'인주',tier:2,cls:'근접',role:'공격수',weapon:'어부의 창',height:1.6,ov:{hp:85},traits:['일반인','지휘B'],nv:true,nvG:'C'};
const KIT={ name:'응급처치', kit:true, pool:7, pct:0.2, min:10, cap:30, hot:4, hotN:5, hotGap:0.4, cd:2.2, wind:0.5, rec:0.3, rng:0.8, auto:0.5 };
const NOR={ref:'C-007',name:'노먼',tier:2,traits:['지휘C','사격A','베테랑'],nv:true,nvG:'A',cls:'기동',role:'사수',weapon:'소총',bold:0.5,height:1.8,gear:{몸:{name:'방탄복',mat:'방탄',tier:2}},skill:KIT};
const KAR={ref:'C-003',name:'카리우스',tier:2,sm:0.75,shield:false,weapon:'맨손',height:3,weight:300,nv:true,nvG:'B',ov:{hp:700,atk:40,rng:0.6},traits:['거구','갑피','근력A','괴력A','머리 넷'],unique:['개조된 신체'],modBody:true,active:['돌진']};
const REB={ref:'C-002',name:'레베카',tier:2,shield:true,role:'공격수',weapon:'장검',nv:true,nvG:'A',sm:1,height:1.6,traits:['불사','재생','베테랑'],gear:{몸:{name:'낡은 판금 갑옷',mat:'판금',tier:3},머리:{name:'기사 투구',mat:'투구',tier:3}}};
const mk=(d,side,x,y,ex)=>({...U(d.ref,side,{}),...JSON.parse(JSON.stringify(d)),side,x,y,...(ex||{})});
const W_=(allies,foes,seed,roe)=>{ const R2=JSON.parse(JSON.stringify(R)); if(roe) R2.roe.def=roe; if(roe==='hold') R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:30,H:16,seed:7,units:[...allies,...foes],torches:[],flips:[]},R2,seed,{headless:true}); return W; };
const out=[]; const say=s=>{ out.push(s); console.log(s); };
function setStill(W,units){ for(const u of units){ u.state='idle'; u.target=null; u.wander=99; u.goal=null; u.path=null; u.last=null; } }

module.exports={E,R,U,DES,GOB,INJ,NOR,KAR,REB,KIT,mk,W_,setStill,say};
