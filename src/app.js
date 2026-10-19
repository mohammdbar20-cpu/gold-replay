const tr=s=>window.I18N?I18N.tr(s):s;
'use strict';
const $=id=>document.getElementById(id);
const TFS={M5:300,M15:900,H1:3600,H4:14400,D1:86400};
const WIN=500, OZ=100;
let MAN, cache={}, S, B=null, busy=false, playT=null, mode='none', drag=null, pend=null;
// ---------- time ----------
const fmt=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Berlin',hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
const offM={};
function off(t){const k=Math.floor(t/3600);if(offM[k]!==undefined)return offM[k];
 const p={};fmt.formatToParts(new Date(k*3600000)).forEach(x=>p[x.type]=x.value);
 return offM[k]=Date.UTC(+p.year,p.month-1,+p.day,+p.hour,+p.minute)/1000-k*3600;}
const ds=t=>new Date((t+off(t))*1000).toISOString().slice(0,16).replace('T',' ');
// ---------- data ----------
function dec(txt){const L=txt.split('\n');let n=L.length-1;if(L[n]==='')n--;
 const h=L[0].split(',');let t=+h[0],pc=+h[1];
 const T=new Float64Array(n),O=new Float64Array(n),H=new Float64Array(n),Lo=new Float64Array(n),C=new Float64Array(n);
 for(let i=0;i<n;i++){const r=L[i+1].split(',');t+=+r[0];const o=pc+ +r[1];T[i]=t*60;O[i]=o/100;H[i]=(o+ +r[2])/100;Lo[i]=(o-r[3])/100;const c=o+ +r[4];C[i]=c/100;pc=c;}
 return {t:T,o:O,h:H,l:Lo,c:C,n};}
const LRU=[];
async function load(path){if(!cache[path]){LRU.push(path);while(LRU.length>10){delete cache[LRU.shift()]}cache[path]=fetch('data/'+path).then(r=>{if(!r.ok)throw Error(path);return r.text()}).then(dec);cache[path].catch(()=>{delete cache[path]})}return cache[path];}
function cat(arr){arr=arr.filter(Boolean);const n=arr.reduce((a,b)=>a+b.n,0),R={n};
 for(const k of 'tohlc'){R[k]=new Float64Array(n);let p=0;for(const a of arr){R[k].set(a[k],p);p+=a.n}}return R;}
const ym=t=>{const d=new Date(t*1000);return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')};
const prevYm=s=>{let[y,m]=s.split('-').map(Number);m--;if(!m){m=12;y--}return y+'-'+String(m).padStart(2,'0')};
const nextYm=s=>{let[y,m]=s.split('-').map(Number);m++;if(m>12){m=1;y++}return y+'-'+String(m).padStart(2,'0')};
async function m1(a,b){ // M1 bars covering [a,b]
 if(!isFinite(a)||!isFinite(b))return {n:0,t:[],o:[],h:[],l:[],c:[]};
 const ms=[];let k=ym(a);const e=ym(b);let g=0;while(k<=e&&g++<240){if(MAN.m1.includes(k))ms.push(k);k=nextYm(k)}
 return cat(await Promise.all(ms.map(m=>load('m1/'+m+'.csv'))));}
async function tfBars(tf,t){
 if(MAN.tf[tf].months){ // monthly files: only the months around the cursor
  const back=tf==='H1'?2:1;let k=ym(t);const ks=[];for(let i=0;i<back;i++)k=prevYm(k);
  for(let i=0;i<back+2;i++){if(MAN.tf[tf].months.includes(k))ks.push(k);k=nextYm(k)}
  const key='w:'+tf+ks.join();if(cache.__wk!==key){cache.__wk=key;cache.__w=Promise.all(ks.map(v=>load(tf+'m/'+v+'.csv'))).then(cat)}return cache.__w;}
 return load(tf+'.csv');}
const bs=(A,v,n)=>{let lo=0,hi=n-1,r=-1;while(lo<=hi){const m=(lo+hi)>>1;if(A[m]<=v){r=m;lo=m+1}else hi=m-1}return r};// last idx <=v
async function lastM1Before(T){let M=await m1(T-4*86400,T);let i=bs(M.t,T-1,M.n);if(i<0){M=await m1(T-40*86400,T);i=bs(M.t,T-1,M.n)}return i<0?null:M.t[i];}
// ---------- state ----------
const LS=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
function save(){dirty++;if(window.__course)return;localStorage.setItem('gr_session',JSON.stringify(S));}
function journal(){return LS('gr_journal')||[]}
function setJournal(j){localStorage.setItem('gr_journal',JSON.stringify(j));}
// ---------- chart ----------
const chart=LightweightCharts.createChart($('chart'),{layout:{background:{color:'#000'},textColor:'#bbb'},
 grid:{vertLines:{visible:false},horzLines:{visible:false}},rightPriceScale:{borderColor:'#333',minimumWidth:66},
 timeScale:{borderColor:'#333',timeVisible:true,rightOffset:8},crosshair:{mode:0},autoSize:true});
const ser=chart.addCandlestickSeries({upColor:'#9afc41',downColor:'#9c9c9c',borderUpColor:'#9c9c9c',borderDownColor:'#9c9c9c',wickUpColor:'#9c9c9c',wickDownColor:'#9c9c9c',priceFormat:{type:'price',precision:2,minMove:0.01}});
let plines=[],B0=null;
// ---------- MACD pane (revealed candles only) ----------
// ---------- EMA overlay: warm-up from all loaded history before the window (revealed only) ----------
const EMAC=['#ffcc00','#4aa3ff','#e91e63'];let emaSer=null,emaPrev=null;
function updEma(force){const m=S.ema;if(!m||!B)return;
 if(!m.on){if(emaSer){emaSer.forEach(x=>x.setData([]));}emaPrev=null;return}
 if(!emaSer)emaSer=EMAC.map(c=>chart.addLineSeries({color:c,lineWidth:1,priceLineVisible:false,lastValueVisible:false,crosshairMarkerVisible:false}));
 const A=B.A,st=B.k-B.nDone,key=m.p.join()+':'+B.U[0]+':'+S.tf;
 m.p.forEach((per,j)=>{const k2=2/(per+1);let e=null,cnt=0;const out=[];
  // warm-up over loaded bars before the window
  for(let i=0;i<st;i++){const c=A.c[i];e=e==null?c:c*k2+e*(1-k2);cnt++}
  for(let i=0;i<B.n;i++){const c=B.C[i];e=e==null?c:c*k2+e*(1-k2);cnt++;out.push(cnt>=per?{time:B0[i].time,value:e}:{time:B0[i].time})}
  if(!force&&emaPrev&&emaPrev.key===key&&(B.n===emaPrev.n||B.n===emaPrev.n+1)){const l=out[out.length-1];if(l.value!=null)emaSer[j].update(l)}else emaSer[j].setData(out);
  emaSer[j].applyOptions({visible:true});});
 emaPrev={key,n:B.n};}
function emaUI(){const m=S.ema;$('bEma').classList.toggle('on',m.on);$('emaLeg').classList.toggle('hidden',!m.on);['e1','e2','e3'].forEach((id,i)=>$(id).value=m.p[i]);}
let MC=null,mH,mM,mS,mPrev=null;
function macdInit(){if(MC)return;MC=LightweightCharts.createChart($('macdC'),{layout:{background:{color:'#000'},textColor:'#888'},grid:{vertLines:{visible:false},horzLines:{color:'#111'}},
  rightPriceScale:{borderColor:'#333',minimumWidth:66},timeScale:{visible:false,rightOffset:8},crosshair:{mode:0},autoSize:true,handleScroll:false,handleScale:false});
 mH=MC.addHistogramSeries({priceLineVisible:false,lastValueVisible:false});mM=MC.addLineSeries({color:'#4aa3ff',lineWidth:1,priceLineVisible:false});mS=MC.addLineSeries({color:'#ff9800',lineWidth:1,priceLineVisible:false});
 chart.timeScale().subscribeVisibleLogicalRangeChange(r=>{if(r&&MC&&S.macd&&S.macd.on)MC.timeScale().setVisibleLogicalRange(r)});}
function macdCalc(C,f,sl,sg){const n=C.length,M=new Array(n),Sg=new Array(n),kf=2/(f+1),ks=2/(sl+1),kg=2/(sg+1);let ef=C[0],es=C[0],eg=0;
 for(let i=0;i<n;i++){ef=i?C[i]*kf+ef*(1-kf):C[i];es=i?C[i]*ks+es*(1-ks):C[i];M[i]=ef-es;eg=i?M[i]*kg+eg*(1-kg):M[i];Sg[i]=eg}return {M,Sg};}
function updMacd(force){const m=S.macd;if(!m||!m.on||!B)return;macdInit();
 const C=B.C,n=B.n,{M,Sg}=macdCalc(C,m.f,m.s,m.g),warm=m.s;const pt=(i,v)=>({time:B0[i].time,value:v});
 const H=i=>({time:B0[i].time,value:M[i]-Sg[i],color:M[i]-Sg[i]>=0?'#9afc41':'#9c9c9c'});
 const key=B.U[0]+':'+m.f+m.s+m.g;
 if(!force&&mPrev&&mPrev.key===key&&(n===mPrev.n||n===mPrev.n+1)){ // incremental: only the last bar changed/appended
  if(n>warm){mH.update(H(n-1));mM.update(pt(n-1,M[n-1]));mS.update(pt(n-1,Sg[n-1]))}}
 else{const hs=[],ms=[],ss=[];for(let i=0;i<n;i++){if(i<warm){hs.push({time:B0[i].time});ms.push({time:B0[i].time});ss.push({time:B0[i].time});continue}hs.push(H(i));ms.push(pt(i,M[i]));ss.push(pt(i,Sg[i]))}
  mH.setData(hs);mM.setData(ms);mS.setData(ss);}
 mPrev={key,n};const r=chart.timeScale().getVisibleLogicalRange();if(r)MC.timeScale().setVisibleLogicalRange(r);}
function macdUI(){const m=S.macd;$('bMacd').classList.toggle('on',m.on);$('macd').classList.toggle('hidden',!m.on);document.body.classList.toggle('macd-on',m.on);$('mF').value=m.f;$('mS').value=m.s;$('mG').value=m.g;}
async function render(){
 const tf=S.tf,cur=S.cur,A=await tfBars(tf,cur);
 let k=bs(A.t,cur,A.n);if(k<0)k=0;
 const st=Math.max(0,k-WIN),U=[],data=[],O=[],H=[],L=[],C=[];
 for(let i=st;i<k;i++){U.push(A.t[i]);O.push(A.o[i]);H.push(A.h[i]);L.push(A.l[i]);C.push(A.c[i]);}
 const M=await m1(A.t[k],cur);let fo=null,fh=-1e9,fl=1e9,fc=null;
 for(let i=0;i<M.n;i++){const t=M.t[i];if(t<A.t[k]||t>cur)continue;if(fo===null)fo=M.o[i];fh=Math.max(fh,M.h[i]);fl=Math.min(fl,M.l[i]);fc=M.c[i];}
 const nDone=U.length;
 if(fo!==null){U.push(A.t[k]);O.push(fo);H.push(fh);L.push(fl);C.push(fc);}
 for(let i=0;i<U.length;i++)data.push({time:U[i]+off(U[i]),open:O[i],high:H[i],low:L[i],close:C[i]});
 ser.setData(data);B0=data;
 B={U,O,H,L,C,n:U.length,nDone,tfs:TFS[tf],A,k};
 S.price=C[C.length-1];
 B.smc=S.smc.on?computeSMC(B):null;dirty++;updMacd();updEma();
 $('clock').textContent=ds(cur)+' برلين';$('price').textContent=S.price.toFixed(2);
 updLines();updPos();
}
// ---------- stepping ----------
async function targetNext(){const A=B.A,k=B.k;
 const endCur=k+1<A.n?await lastM1Before(A.t[k+1]):null;
 if(endCur!==null&&endCur>S.cur)return endCur;
 if(k+2<A.n)return await lastM1Before(A.t[k+2]);
 if(k+1<A.n){const M=await m1(A.t[k+1],A.t[k+1]+40*86400);return M.n?M.t[M.n-1]:null}
 return null;}
async function advance(to){
 if(to===null||to<=S.cur){stopPlay();status('نهاية البيانات');return false}
 if(S.ps.some(p=>p.sl!=null||p.tp!=null)){const M=await m1(S.cur+60,to);for(let i=0;i<M.n&&S.ps.length;i++){const t=M.t[i];if(t<=S.cur||t>to)continue;for(const p of S.ps.slice())checkHit(M,i,p);}}
 S.cur=to;await render();save();return true;}
async function doStep(fn){if(busy)return;busy=true;try{await advance(await fn())}catch(e){console.error(e);status('خطأ: '+e.message)}busy=false;}
const stepNext=()=>doStep(targetNext);
const stepDay=()=>doStep(async()=>{const M=await m1(S.cur,S.cur+86400*4);const i=bs(M.t,S.cur+86400,M.n);return i>=0?M.t[i]:null});
let revT=null;
function stopPlay(){if(revT){clearInterval(revT);revT=null}const rb=$('bRev');if(rb){rb.textContent='◀️';rb.classList.remove('playing')}if(playT){clearInterval(playT);playT=null}$('bPlay').textContent='▶️';$('bPlay').classList.remove('playing');}
function status(s){$('status').textContent=s;setTimeout(()=>{if($('status').textContent===s)$('status').textContent=''},4000)}
// ---------- trading ----------
const num=id=>{const v=parseFloat($(id).value);return isFinite(v)?v:null};
function checkHit(M,i,p){const d=p.side==='buy'?1:-1;
 const slHit=p.sl!=null&&(d>0?M.l[i]<=p.sl:M.h[i]>=p.sl), tpHit=p.tp!=null&&(d>0?M.h[i]>=p.tp:M.l[i]<=p.tp);
 if(slHit){closePos(p.sl,'SL',M.t[i],p);return true}if(tpHit){closePos(p.tp,'TP',M.t[i],p);return true}return false;}
const PIP=0.1;
function openPos(side,quick){stopPlay();const lots=quick?(S.qlot||0.01):num('lots');if(!lots||lots<=0)return alert('أدخل حجم اللوت');
 const e=S.price,sl=quick?null:num('sl'),tp=quick?null:num('tp'),d=side==='buy'?1:-1;
 if(sl!=null&&(sl-e)*d>=0)return alert('وقف الخسارة في الجهة الخطأ');if(tp!=null&&(tp-e)*d<=0)return alert('الهدف في الجهة الخطأ');
 const p={id:Date.now()+Math.floor(Math.random()*1000),side,entry:e,sl,tp,lots,open:S.cur,tf:S.tf,why:quick?'':$('why').value,feel:$('feel').value,conf:FEEL,bal0:S.balance,quick:!!quick,ctx:Object.assign(snapCtx(),{confidence:FEEL})};
 S.ps.push(p);save();updLines();updPos();return p;}
function closePos(px,reason,t,p){stopPlay();p=p||S.ps[0];if(!p)return;const tc=t||S.cur;
 if(S.draw)S.draw.forEach(d=>{if(d.type==='pos'&&d.st==='live'&&(d.posId==null||d.posId===p.id)){d.st='done';d.res=reason;d.t2=Math.max(d.t2,tc)}});
 const d=p.side==='buy'?1:-1,pnl=+((px-p.entry)*d*OZ*p.lots).toFixed(2),risk=p.sl!=null?Math.abs(p.entry-p.sl)*OZ*p.lots:null;
 const tr={id:Date.now()+Math.floor(Math.random()*1000),openT:p.open,closeT:tc,bal0:p.bal0,open:ds(p.open),close:ds(tc),dur:Math.round((tc-p.open)/60),tf:p.tf,side:p.side,lots:p.lots,entry:p.entry,sl:p.sl,tp:p.tp,exit:+px.toFixed(2),reason,pnl,R:risk?+(pnl/risk).toFixed(2):null,why:p.why,feeling:p.feel||'',conf:p.conf||null,quick:!!p.quick,ctx:p.ctx};
 const j=journal();j.push(tr);setJournal(j);S.balance=+(S.balance+pnl).toFixed(2);S.ps=S.ps.filter(x=>x!==p);save();
 status((reason==='TP'?'✅ ':reason==='SL'?'❌ ':'')+'أغلقت الصفقة: '+pnl+'$');if(!S.ps.length){$('why').value='';setFeel(null)}
 updLines();updPos();renderJournal();}
function closeAll(){S.ps.slice().forEach(p=>closePos(S.price,'يدوي',null,p))}
const fpl=p=>(S.price-p.entry)*(p.side==='buy'?1:-1)*OZ*p.lots, fpips=p=>(S.price-p.entry)*(p.side==='buy'?1:-1)/PIP;
const durTxt=m=>m>=1440?(m/1440).toFixed(1)+' يوم':m>=60?(m/60).toFixed(1)+' ساعة':m+' دقيقة';
function updPos(){const open=S.ps.reduce((a,p)=>a+fpl(p),0),eq=S.balance+open;$('bal').textContent=S.balance.toFixed(2);
 $('acct').innerHTML='الرصيد <b>'+S.balance.toFixed(2)+'$</b> · الأسهم <b class="'+(open>=0?'w':'l')+'">'+eq.toFixed(2)+'$</b> · عائم <b class="'+(open>=0?'w':'l')+'">'+(open>=0?'+':'')+open.toFixed(2)+'$</b>';
 if(!S.ps.length){$('pos').textContent='لا توجد صفقة مفتوحة';}
 else{$('pos').innerHTML='<div class="plist">'+S.ps.map(p=>{const pl=fpl(p);return '<div class="pitem"><span class="'+(p.side==='buy'?'w':'l')+'">'+(p.side==='buy'?'شراء':'بيع')+'</span> '+p.lots+' @ '+p.entry.toFixed(2)+(p.sl!=null?' | SL '+p.sl:'')+(p.tp!=null?' | TP '+p.tp:'')+' <b class="'+(pl>=0?'w':'l')+'">'+(pl>=0?'+':'')+pl.toFixed(2)+'$ ('+fpips(p).toFixed(0)+'p)</b><button class="pclose" data-id="'+p.id+'">✕ إغلاق</button></div>'}).join('')+'</div>'+(S.ps.length>1?'<button id="bCloseAll">إغلاق الكل</button>':'');
  document.querySelectorAll('.pclose').forEach(b=>b.onclick=()=>{const p=S.ps.find(x=>String(x.id)===b.dataset.id);if(p)closePos(S.price,'يدوي',null,p)});
  const ca=$('bCloseAll');if(ca)ca.onclick=closeAll;}
 updRisk();}
function updRisk(){const p=S.pos,e=p?p.entry:S.price,sl=p?p.sl:num('sl'),lots=p?p.lots:num('lots'),tp=p?p.tp:num('tp');
 if(sl==null||!lots){$('risk').textContent='المخاطرة: —';return}
 const r=Math.abs(e-sl)*OZ*lots;let s='المخاطرة: '+r.toFixed(2)+'$ ('+(r/S.balance*100).toFixed(2)+'%)';
 if(tp!=null)s+=' | العائد/المخاطرة 1:'+(Math.abs(tp-e)/Math.abs(e-sl)).toFixed(2);$('risk').textContent=s;}
function updLines(){plines.forEach(l=>ser.removePriceLine(l));plines=[];
 const add=(price,color,title,style,w)=>{if(price!=null)plines.push(ser.createPriceLine({price,color,lineWidth:w||2,lineStyle:style,axisLabelVisible:true,title}))};
 for(const p of S.ps){const pl=fpl(p);add(p.entry,pl>=0?'#089981':'#f23645',tr((p.side==='buy'?'شراء ':'بيع ')+p.lots+'  '+(pl>=0?'+':'')+pl.toFixed(2)+'$  '+fpips(p).toFixed(0)+'p'),0);add(p.sl,'#ff4d4d','SL',2,1);add(p.tp,'#9afc41','TP',2,1);}
 if(!S.ps.length){add(num('sl'),'#ff4d4d','SL?',2);add(num('tp'),'#9afc41','TP?',2);}}
// ---------- SMC ----------
function computeSMC(b){const n=b.nDone,H=b.H,L=b.L,C=b.C,R={lines:[],obs:[],fvg:[],sw:null,zone:null};if(n<20)return R;
 function struct(len,tag){let leg=-1,top=null,bot=null,trend=0,tT=null,tB=null;const lines=[],obs=[];
  for(let i=len;i<n;i++){const j=i-len;let mh=-1e9,ml=1e9;for(let q=j+1;q<=i;q++){if(H[q]>mh)mh=H[q];if(L[q]<ml)ml=L[q]}
   const nl=H[j]>mh?0:L[j]<ml?1:leg;
   if(nl!==leg&&nl>=0){if(nl===0){top={p:H[j],i:j,x:false};tT={p:H[j],i:j}}else{bot={p:L[j],i:j,x:false};tB={p:L[j],i:j}}leg=nl}
   if(tT&&H[i]>tT.p)tT={p:H[i],i};if(tB&&L[i]<tB.p)tB={p:L[i],i};
   for(let q=obs.length-1;q>=0;q--){const o=obs[q];if(o.bull?C[i]<o.bot:C[i]>o.top)obs.splice(q,1)}
   if(top&&!top.x&&C[i]>top.p){lines.push({i1:top.i,i2:i,p:top.p,t:trend===-1?'CHoCH':'BOS',bull:true,int:tag});trend=1;top.x=true;
    let m=top.i;for(let q=top.i;q<i;q++)if(L[q]<L[m])m=q;obs.push({i:m,top:H[m],bot:L[m],bull:true,int:tag});}
   if(bot&&!bot.x&&C[i]<bot.p){lines.push({i1:bot.i,i2:i,p:bot.p,t:trend===1?'CHoCH':'BOS',bull:false,int:tag});trend=-1;bot.x=true;
    let m=bot.i;for(let q=bot.i;q<i;q++)if(H[q]>H[m])m=q;obs.push({i:m,top:H[m],bot:L[m],bull:false,int:tag});}}
  return {lines:lines.slice(tag?-12:-8),obs:obs.slice(-5),trend,tT,tB};}
 const I=struct(5,true),Sw=struct(50,false);R.raw={I,Sw};
 R.lines=[...(S.smc.istr?I.lines:[]),...(S.smc.sstr?Sw.lines:[])];
 R.obs=[...(S.smc.iob?I.obs:[]),...(S.smc.sob?Sw.obs:[])];
 if(S.smc.fvg){const g=[];for(let i=2;i<n;i++){
   for(let q=g.length-1;q>=0;q--){const f=g[q];if(f.bull?L[i]<=f.bot:H[i]>=f.top)g.splice(q,1)}
   if(L[i]>H[i-2]&&C[i-1]>H[i-2])g.push({i:i-1,top:L[i],bot:H[i-2],bull:true});
   if(H[i]<L[i-2]&&C[i-1]<L[i-2])g.push({i:i-1,top:L[i-2],bot:H[i],bull:false});}R.fvg=g.slice(-8);}R.fvgAll=(function(){const g=[];for(let i=2;i<n;i++){for(let q=g.length-1;q>=0;q--){const f=g[q];if(f.bull?L[i]<=f.bot:H[i]>=f.top)g.splice(q,1)}if(L[i]>H[i-2]&&C[i-1]>H[i-2])g.push({i:i-1,top:L[i],bot:H[i-2],bull:true});if(H[i]<L[i-2]&&C[i-1]<L[i-2])g.push({i:i-1,top:L[i-2],bot:H[i],bull:false});}return g.slice(-8)})();
 if(Sw.tT&&Sw.tB){if(S.smc.sw)R.sw={top:Sw.tT,bot:Sw.tB,trend:Sw.trend};
  if(S.smc.zone)R.zone={top:Sw.tT.p,bot:Sw.tB.p,i:Math.min(Sw.tT.i,Sw.tB.i)};}
 return R;}
// ---------- overlay (drawings + SMC) ----------
const cv=$('ov'),cx=cv.getContext('2d'),ts=chart.timeScale();
function t2l(t){const U=B.U,n=B.n;if(!n)return 0;if(t>=U[n-1])return n-1+(t-U[n-1])/B.tfs;if(t<=U[0])return (t-U[0])/B.tfs;
 const i=bs(U,t,n);return i+(t-U[i])/(U[i+1]-U[i]);}
function l2t(l){const U=B.U,n=B.n;if(l>=n-1)return U[n-1]+(l-n+1)*B.tfs;if(l<=0)return U[0]+l*B.tfs;const i=Math.floor(l);return U[i]+(l-i)*(U[i+1]-U[i]);}
const X=t=>ts.logicalToCoordinate(t2l(t)),Y=p=>ser.priceToCoordinate(p),XI=i=>ts.logicalToCoordinate(i);
function pt(e){const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const l=ts.coordinateToLogical(x),p=ser.coordinateToPrice(y);return {x,y,t:l==null?null:l2t(l),p}}
const lineP=(a,b,t)=>a.p+(b.p-a.p)*((t-a.t)/((b.t-a.t)||1));
function segs(d){if(d.type==='pos')return [];if(d.type==='pen'){const o=[];for(let i=1;i<d.pts.length;i++)o.push([d.pts[i-1],d.pts[i]]);return o}if(d.type==='hline')return [[{t:-1e12,p:d.a.p},{t:1e12,p:d.a.p}]];const s=[[d.a,d.b]];
 if(d.type==='chan')s.push([{t:d.a.t,p:d.a.p+d.off},{t:d.b.t,p:d.b.p+d.off}]);return s;}
function handles(d){if(d.type==='pos')return [['e',d.t,d.e],['sl',d.t,d.sl],['tp',d.t,d.tp],['w',d.t2,d.e]];if(d.type==='pen')return [];if(d.type==='hline')return [['a',l2t(B.n-1),d.a.p]];const h=[['a',d.a.t,d.a.p],['b',d.b.t,d.b.p]];
 if(d.type==='chan'){const m=(d.a.t+d.b.t)/2;h.push(['c',m,lineP(d.a,d.b,m)+d.off])}return h;}
let dirty=1,lastKey='';const HIST=[];
function snap(){HIST.push(JSON.stringify(S.draw));if(HIST.length>50)HIST.shift()}
function updUndo(){const b=$('bUndo');if(b)b.disabled=!(pend||HIST.length)}
function undo(){if(pend){if(pend.type==='chan'&&pend.stage===2){pend.stage=1;pend.b=pend.a}else pend=null}else if(HIST.length){S.draw=JSON.parse(HIST.pop());drag=null;save();select(sel<S.draw.length?sel:-1)}dirty++;updUndo()}
function draw(){if(document.hidden)return setTimeout(()=>requestAnimationFrame(draw),500);const dpr=window.devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;
 const key=B?[w,h,dirty,XI(0),XI(B.n-1),Y(S.price),Y(S.price*1.01),mode,sel,S.draw.length,JSON.stringify(pend),drag?JSON.stringify(S.draw):''].join('|'):'x'+dirty;
 if(key===lastKey)return requestAnimationFrame(draw);lastKey=key;updUndo();placeScale();
 if(cv.width!==w*dpr||cv.height!==h*dpr){cv.width=w*dpr;cv.height=h*dpr}
 cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,w,h);if(!B)return requestAnimationFrame(draw);
 const pw=w-60;cx.save();cx.beginPath();cx.rect(0,0,pw,h);cx.clip();
 const xr=XI(B.n-1)+20,sm=B.smc;
 const box=(x1,y1,x2,y2,f)=>{if(x1==null||y1==null||y2==null)return;cx.fillStyle=f;cx.fillRect(x1,Math.min(y1,y2),x2-x1,Math.abs(y2-y1))};
 const txt=(s,x,y,c)=>{cx.fillStyle=c;cx.font='11px sans-serif';cx.fillText(s,x,y)};
 if(S.smc.on&&sm){
  if(sm.zone){const z=sm.zone,x1=XI(z.i),r=z.top-z.bot;
   box(x1,Y(z.top),xr,Y(z.top-0.05*r),'rgba(242,54,69,.18)');txt('Premium',x1+2,Y(z.top)+11,'#f23645');
   box(x1,Y(z.bot+0.525*r),xr,Y(z.bot+0.475*r),'rgba(160,160,160,.18)');txt('Equilibrium',x1+2,Y(z.bot+0.5*r)+4,'#aaa');
   box(x1,Y(z.bot+0.05*r),xr,Y(z.bot),'rgba(8,153,129,.2)');txt('Discount',x1+2,Y(z.bot)-3,'#089981');}
  for(const f of sm.fvg)box(XI(f.i),Y(f.top),xr,Y(f.bot),f.bull?'rgba(0,255,104,.15)':'rgba(255,0,8,.15)');
  for(const o of sm.obs){box(XI(o.i),Y(o.top),xr,Y(o.bot),o.int?(o.bull?'rgba(49,121,245,.22)':'rgba(247,124,128,.22)'):(o.bull?'rgba(24,72,204,.3)':'rgba(178,40,51,.3)'));
   if(!o.int)txt(o.bull?'Bull OB':'Bear OB',XI(o.i)+2,Y(o.bull?o.bot:o.top)+(o.bull?-3:11),'#ccc');}
  for(const l of sm.lines){const x1=XI(l.i1),x2=XI(l.i2),y=Y(l.p);if(x1==null||y==null)continue;const c=l.bull?'#089981':'#f23645';
   cx.strokeStyle=c;cx.lineWidth=1;cx.setLineDash(l.int?[4,3]:[]);cx.beginPath();cx.moveTo(x1,y);cx.lineTo(x2,y);cx.stroke();cx.setLineDash([]);
   txt(l.t,(x1+x2)/2-12,y+(l.bull?-3:11),c);}
  if(sm.sw){const s=sm.sw;cx.lineWidth=1;
   for(const [o,lab,c] of [[s.top,s.trend===-1?'Strong High':'Weak High','#f23645'],[s.bot,s.trend===1?'Strong Low':'Weak Low','#089981']]){
    const x1=XI(o.i),y=Y(o.p);if(x1==null||y==null)continue;cx.strokeStyle=c;cx.beginPath();cx.moveTo(x1,y);cx.lineTo(xr,y);cx.stroke();txt(lab,xr-70,y+(c==='#089981'?12:-3),c);}}
 }
 for(const d of S.draw.concat(pend?[pend]:[])){if(d.type==='pos'){drawPos(d,pw);continue}const col=d===pend&&d.type!=='pen'?'#fc0':(d.color||'#4aa3ff');cx.strokeStyle=rgba(col,d.op==null?1:d.op);cx.lineCap=cx.lineJoin='round';cx.lineWidth=(d.lw||2)+(d===S.draw[sel]?1:0);cx.setLineDash(d.ls===1?[8,5]:d.ls===2?[2,4]:[]);
  for(const g of pix(d,pw)){if(g.some(v=>v==null))continue;cx.beginPath();cx.moveTo(g[0],g[1]);cx.lineTo(g[2],g[3]);cx.stroke();}
  cx.setLineDash([]);if(d.type==='chan'&&d.b&&d.fill!==false){const P=[X(d.a.t),Y(d.a.p),X(d.b.t),Y(d.b.p),Y(d.b.p+d.off),Y(d.a.p+d.off)];if(!P.some(v=>v==null)){cx.fillStyle=rgba(d.fc||col,d.fo==null?.1:d.fo);cx.beginPath();cx.moveTo(P[0],P[1]);cx.lineTo(P[2],P[3]);cx.lineTo(P[2],P[4]);cx.lineTo(P[0],P[5]);cx.fill();}}
  if(d!==pend&&(mode==='edit'||d===S.draw[sel]))for(const [,t,p] of handles(d)){const hx=d.type==='hline'?pw-20:X(t),hy=Y(p);if(hx==null||hy==null)continue;cx.fillStyle='#000';cx.strokeStyle=col;cx.lineWidth=2;cx.beginPath();cx.arc(hx,hy,8,0,7);cx.fill();cx.stroke();}}
 cx.restore();requestAnimationFrame(draw);}
function dSeg(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,L=dx*dx+dy*dy||1;let u=((px-x1)*dx+(py-y1)*dy)/L;u=Math.max(0,Math.min(1,u));return Math.hypot(px-x1-u*dx,py-y1-u*dy)}
// pixel segments of a drawing (with extend-right)
function pix(d,pw){if(d.type==='hline'){const y=Y(d.a.p);return [[0,y,pw,y]]}
 const out=[];for(const [a,b] of segs(d)){let x1=X(a.t),y1=Y(a.p),x2=X(b.t),y2=Y(b.p);
  if(d.ext&&x1!=null&&x2!=null&&y1!=null&&y2!=null&&Math.abs(x2-x1)>0.5){const k=(pw+50-x2)/(x2-x1);if(k>0){x2+=k*(x2-x1);y2+=k*(y2-y1)}}out.push([x1,y1,x2,y2])}return out;}
function hitDraw(q){const pw=cv.clientWidth-60;for(let i=S.draw.length-1;i>=0;i--){if(S.draw[i].type==='pos'){if(posHit(S.draw[i],q))return i;continue}for(const g of pix(S.draw[i],pw)){if(g.some(v=>v==null))continue;if(dSeg(q.x,q.y,g[0],g[1],g[2],g[3])<18)return i}}return -1}
function hitHandle(d,q){const pw=cv.clientWidth-60;for(const [k,t,p] of handles(d)){const hx=d.type==='hline'?pw-20:X(t),hy=Y(p);if(hx!=null&&hy!=null&&Math.hypot(hx-q.x,hy-q.y)<24)return k}return null}
// magnet: snap to nearest OHLC of the candle under the finger (within 30px)
function mag(q){if(!S.magnet||!B||q.t==null)return q;const l=ts.coordinateToLogical(q.x);if(l==null)return q;const i=Math.round(l);if(i<0||i>=B.n)return q;
 let best=null,bd=30;for(const v of [B.O[i],B.H[i],B.L[i],B.C[i]]){const y=Y(v);if(y==null)continue;const dd=Math.abs(y-q.y);if(dd<bd){bd=dd;best=v}}
 return best==null?q:{x:XI(i),y:Y(best),t:B.U[i],p:best};}
const P2=q=>({t:q.t,p:q.p});
function rgba(h,a){if(!h||h[0]!=='#')return h;const n=parseInt(h.length===4?h.slice(1).split('').map(c=>c+c).join(''):h.slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')'}
// ---------- TV-like style editor ----------
const PAL=['#ffffff','#d1d4dc','#9c9c9c','#5d606b','#363a45','#000000','#f23645','#ff9800','#ffeb3b','#9afc41','#089981','#00bcd4','#2962ff','#4aa3ff','#673ab7','#9c27b0','#e91e63','#ff5252','#ffb74d','#fff176','#81c784','#4dd0e1','#90caf9','#ce93d8'];
const STY_KEYS=['color','op','lw','ls','fill','fc','fo'];
function remember(d){S.sty=S.sty||{};const o={};STY_KEYS.forEach(k=>{if(d[k]!=null)o[k]=d[k]});S.sty[d.type]=o;}
function applyLast(d){const o=S.sty&&S.sty[d.type];if(o)STY_KEYS.forEach(k=>{if(d[k]==null&&o[k]!=null)d[k]=o[k]});return d}
let popTarget='color';
function stylePopUI(){const d=S.draw[sel];if(!d)return;const isC=d.type==='chan';$('pFillRow').style.display=isC?'':'none';
 const cur=popTarget==='fc'?(d.fc||d.color||'#4aa3ff'):(d.color||'#4aa3ff');
 document.querySelectorAll('#stylePop .pc').forEach(b=>b.classList.toggle('on',b.dataset.pc===cur));
 $('pOp').value=Math.round(100*(popTarget==='fc'?(d.fo==null?.1:d.fo):(d.op==null?1:d.op)));$('pOpV').textContent=$('pOp').value+'%';
 document.querySelectorAll('#stylePop [data-lw]').forEach(b=>b.classList.toggle('on',+b.dataset.lw===(d.lw||2)));
 document.querySelectorAll('#stylePop [data-ls]').forEach(b=>b.classList.toggle('on',+b.dataset.ls===(d.ls||0)));
 $('pFill').classList.toggle('on',d.fill!==false);$('pTgtLine').classList.toggle('on',popTarget==='color');$('pTgtFill').classList.toggle('on',popTarget==='fc');
 $('sColor').style.background=d.color||'#4aa3ff';}
function styEdit(fn){if(sel<0)return;snap();const d=S.draw[sel];fn(d);remember(d);save();dirty++;stylePopUI();}
// ---------- long/short position tool ----------
function atrNow(){const n=B.nDone||B.n,i0=Math.max(0,n-14);let s=0;for(let i=i0;i<n;i++)s+=B.H[i]-B.L[i];return s/Math.max(1,n-i0)}
function newPos(side,q){const a=atrNow(),e=+q.p.toFixed(2),d=side==='buy'?1:-1;
 return {type:'pos',side,t:q.t,t2:q.t+B.tfs*25,e,sl:+(e-d*1.5*a).toFixed(2),tp:+(e+d*3*a).toFixed(2),st:'draft'};}
function posLots(d){const r=Math.abs(d.e-d.sl)*OZ;if(!r)return 0.01;return Math.max(0.01,Math.floor(S.balance*(S.riskPct||1)/100/r*100)/100)}
function posRes(d){if(d.st==='done')return d.res;const U=B.U,n=B.nDone;const dir=d.side==='buy'?1:-1;let i=bs(U,d.t,B.n);if(i<0)i=0;
 for(i=i+1;i<n&&U[i]<=d.t2;i++){if(dir>0?B.L[i]<=d.sl:B.H[i]>=d.sl)return 'SL';if(dir>0?B.H[i]>=d.tp:B.L[i]<=d.tp)return 'TP'}return null}
function posBox(d,pw){const x1=X(d.t),x2=X(d.t2);return {x1,x2,ye:Y(d.e),ys:Y(d.sl),yt:Y(d.tp)}}
function posHit(d,q){const b=posBox(d);if([b.x1,b.x2,b.ye,b.ys,b.yt].some(v=>v==null))return false;const y0=Math.min(b.ys,b.yt),y1=Math.max(b.ys,b.yt);return q.x>=Math.min(b.x1,b.x2)-6&&q.x<=Math.max(b.x1,b.x2)+6&&q.y>=y0-6&&q.y<=y1+6}
function drawPos(d,pw){const b=posBox(d);if([b.x1,b.x2,b.ye,b.ys,b.yt].some(v=>v==null))return;const res=posRes(d),w=b.x2-b.x1;
 cx.fillStyle=res==='TP'?'rgba(8,153,129,.5)':'rgba(8,153,129,.22)';cx.fillRect(b.x1,Math.min(b.ye,b.yt),w,Math.abs(b.yt-b.ye));
 cx.fillStyle=res==='SL'?'rgba(242,54,69,.5)':'rgba(242,54,69,.22)';cx.fillRect(b.x1,Math.min(b.ye,b.ys),w,Math.abs(b.ys-b.ye));
 cx.strokeStyle='#ddd';cx.lineWidth=1;cx.setLineDash(d.st==='draft'?[4,3]:[]);cx.beginPath();cx.moveTo(b.x1,b.ye);cx.lineTo(b.x2,b.ye);cx.stroke();cx.setLineDash([]);
 const rr=Math.abs(d.tp-d.e)/(Math.abs(d.e-d.sl)||1),lots=d.lots||posLots(d),risk=Math.abs(d.e-d.sl)*OZ*lots,rew=Math.abs(d.tp-d.e)*OZ*lots,up=d.yt<d.ye;
 const lab=(t0,x,y,bg)=>{const t=tr(t0);cx.font='bold 11px system-ui,sans-serif';const tw=cx.measureText(t).width+10;cx.fillStyle=bg;cx.fillRect(x,y-8,tw,16);cx.fillStyle='#fff';cx.fillText(t,x+5,y+4)};
 const xl=Math.min(b.x1,b.x2)+2;
 lab('الهدف '+d.tp.toFixed(2)+'  +'+Math.abs(d.tp-d.e).toFixed(2)+'  ($'+rew.toFixed(0)+')  RR 1:'+rr.toFixed(2),xl,b.yt+(b.yt<b.ye?-10:10),'#087a66');
 lab('الوقف '+d.sl.toFixed(2)+'  -'+Math.abs(d.e-d.sl).toFixed(2)+'  | '+lots.toFixed(2)+' لوت | مخاطرة $'+risk.toFixed(0),xl,b.ys+(b.ys>b.ye?10:-10),'#a3202e');
 lab((d.side==='buy'?'شراء ':'بيع ')+d.e.toFixed(2)+(d.st==='live'?' • منفذة':d.st==='done'?(' • '+(d.res||'')):'')+(res==='TP'?' ✅':res==='SL'?' ❌':''),xl,b.ye,d.side==='buy'?'#1d5e1d':'#7a1d1d');}
function execPos(){if(sel<0)return;const d=S.draw[sel];if(!d||d.type!=='pos'||d.st!=='draft')return;
 if(Q){Q.bias=d.side==='buy'?'up':'down';$('qE').value=d.e.toFixed(2);$('qSL').value=d.sl.toFixed(2);$('qTP').value=d.tp.toFixed(2);snap();d.st='quiz';save();quizUI();select(sel);status('تم ضبط الاختبار من المربع — اضغط اكشف');return}
  const dp=S.price-d.e;snap();d.e=+(d.e+dp).toFixed(2);d.sl=+(d.sl+dp).toFixed(2);d.tp=+(d.tp+dp).toFixed(2);
 $('sl').value=d.sl;$('tp').value=d.tp;$('lots').value=posLots(d).toFixed(2);const np=openPos(d.side);
 if(np){d.st='live';d.posId=np.id;d.lots=np.lots;d.e=np.entry;d.t=S.cur;d.t2=Math.max(d.t2,S.cur+B.tfs*5);save();select(sel);status('✔ تم تنفيذ الصفقة')}}
// Ramer-Douglas-Peucker in screen pixels (eps 1.5px), capped at 300 points
function simplify(pts){const P=pts.map(o=>[X(o.t),Y(o.p)]);let eps=1.5,keep;
 const rdp=(a,b)=>{let md=0,mi=-1;for(let i=a+1;i<b;i++){const d=dSeg(P[i][0],P[i][1],P[a][0],P[a][1],P[b][0],P[b][1]);if(d>md){md=d;mi=i}}if(md>eps){rdp(a,mi);keep[mi]=1;rdp(mi,b)}};
 do{keep=new Uint8Array(P.length);keep[0]=keep[P.length-1]=1;rdp(0,P.length-1);eps*=1.6}while(keep.reduce((a,v)=>a+v,0)>300);
 return pts.filter((o,i)=>keep[i]).map(o=>({t:o.t,p:+o.p.toFixed(3)}));}
let sel=-1;
function select(i){sel=i;dirty++;const tb=$('selBar');if(sel<0||!S.draw[sel]||S.draw[sel].type==='pos')$('stylePop').classList.add('hidden');else{popTarget='color';stylePopUI()}if(tb){tb.classList.toggle('hidden',sel<0);if(sel>=0){const d=S.draw[sel];$('sExt').classList.toggle('on',!!d.ext);$('sExt').style.display=(d.type==='hline'||d.type==='pen'||d.type==='pos')?'none':'';$('sExec').style.display=d.type==='pos'&&d.st==='draft'?'':'none';$('sColor').style.display=d.type==='pos'?'none':''}}
 cv.classList.toggle('active',mode!=='none'||sel>=0);}
function finish(d){applyLast(d);snap();S.draw.push(d);pend=null;save();const m=mode;mode='none';document.querySelectorAll('#draw [data-m]').forEach(b=>b.classList.remove('on'));select(S.draw.length-1);}
function selEdit(fn){if(sel<0)return;snap();fn(S.draw[sel]);save();select(sel);}
chart.subscribeClick(par=>{if(mode!=='none'||!B||!par.point)return;const i=hitDraw({x:par.point.x,y:par.point.y});if(i>=0)select(i);});
let down=null;
cv.addEventListener('pointerdown',e=>{if(!B)return;let q=pt(e);if(q.t==null||q.p==null)return;e.preventDefault();down={x:q.x,y:q.y};
 try{cv.setPointerCapture(e.pointerId)}catch(_){}
 const qm=mag(q);
 if(mode==='hline'){finish({type:'hline',a:P2(qm)});}
 else if(mode==='tline'){if(!pend)pend={type:'tline',a:P2(qm),b:P2(qm)};else{pend.b=P2(qm);finish(pend)}}
 else if(mode==='chan'){if(!pend)pend={type:'chan',a:P2(qm),b:P2(qm),off:0,stage:1};else if(pend.stage===1){pend.b=P2(qm);pend.stage=2}
  else{pend.off=q.p-lineP(pend.a,pend.b,q.t);delete pend.stage;finish(pend)}}
 else if(mode==='long'||mode==='short'){finish(newPos(mode==='long'?'buy':'sell',q));}
 else if(mode==='pen'){pend=applyLast({type:'pen',pts:[P2(q)]});if(!pend.color)pend.color='#ffcc00';}
 else if(mode==='del'){const i=hitDraw(q);if(i>=0){snap();S.draw.splice(i,1);save()}}
 else{ // edit mode or a selected drawing
  const cand=mode==='edit'?S.draw.map((d,i)=>i).reverse():(sel>=0?[sel]:[]);
  for(const i of cand){const d=S.draw[i],k=hitHandle(d,q);if(k){snap();drag={d,k};if(mode!=='edit')select(i);return}}
  const i=hitDraw(q);
  if(i>=0&&(mode==='edit'||i===sel)){const d=S.draw[i];snap();drag={d,k:'body',l0:ts.coordinateToLogical(q.x),p0:q.p,a0:d.a&&P2(d.a),b0:d.b&&P2(d.b),pts0:d.pts&&d.pts.map(P2),pos0:d.type==='pos'?Object.assign({},d):null};if(mode!=='edit')select(i);return}
  if(mode==='edit'){for(const p of S.ps)for(const k of ['sl','tp']){if(p[k]!=null&&Math.abs(Y(p[k])-q.y)<16){drag={k,p};return}}for(const p of S.ps){if(Math.abs(Y(p.entry)-q.y)<14){drag={k:'new',p};return}}if(!S.ps.length)for(const k of ['sl','tp']){const v=num(k);if(v!=null&&Math.abs(Y(v)-q.y)<16){drag={k};return}}}
  else if(i>=0)select(i);else select(-1);}});
cv.addEventListener('pointermove',e=>{if(!B)return;const q=pt(e);if(q.p==null||q.t==null)return;
 if(pend&&pend.type==='pen'){const L=pend.pts[pend.pts.length-1];if(Math.hypot(X(L.t)-q.x,Y(L.p)-q.y)>=3&&pend.pts.length<2000){pend.pts.push(P2(q));dirty++}return}
 if(pend&&pend.stage!==2&&mode!=='none'){pend.b=P2(mag(q));dirty++}else if(pend&&pend.stage===2){pend.off=q.p-lineP(pend.a,pend.b,q.t);dirty++}
 if(!drag)return;const p=+q.p.toFixed(2);dirty++;
 if(drag.d){const d=drag.d;
  if(drag.k==='body'){const l=ts.coordinateToLogical(q.x);if(l==null)return;const dl=l-drag.l0,dp=q.p-drag.p0,mv=o=>({t:d.type==='hline'?o.t:l2t(t2l(o.t)+dl),p:o.p+dp});if(drag.pos0){if(d.st!=='draft')return;const o=drag.pos0;d.t=l2t(t2l(o.t)+dl);d.t2=l2t(t2l(o.t2)+dl);d.e=+(o.e+dp).toFixed(2);d.sl=+(o.sl+dp).toFixed(2);d.tp=+(o.tp+dp).toFixed(2)}else if(drag.pts0)d.pts=drag.pts0.map(mv);else{d.a=mv(drag.a0);if(drag.b0)d.b=mv(drag.b0);}}
  else if(d.type==='pos'){if(drag.k==='w')d.t2=Math.max(q.t,d.t+B.tfs*2);else if(drag.k!=='e'||d.st==='draft'){d[drag.k]=+q.p.toFixed(2);if(d.st==='live'&&drag.k!=='e'){const lp=S.ps.find(x=>x.id===d.posId)||S.ps[0];if(lp){lp[drag.k]=d[drag.k];updLines();updPos()}}}}
  else if(drag.k==='c')d.off=q.p-lineP(d.a,d.b,q.t);else{const m=mag(q);d[drag.k]={t:d.type==='hline'?d.a.t:m.t,p:m.p};}}
 else if(drag.p){const P=drag.p,dir=P.side==='buy'?1:-1;let k=drag.k;if(k==='new'){if(Math.abs(Y(p)-Y(P.entry))<8)return;k=(p-P.entry)*dir<0?'sl':'tp';drag.k=k}
  if(k==='sl'&&(p-P.entry)*dir>=0)return;if(k==='tp'&&(p-P.entry)*dir<=0)return;P[k]=p;updLines();updPos();}
 else{$(drag.k).value=p;updLines();updPos();}});
cv.addEventListener('pointerup',e=>{const q=pt(e);if(drag&&drag.p)save();
 if(pend&&pend.type==='pen'){if(pend.pts.length>1){pend.pts=simplify(pend.pts);snap();S.draw.push(pend);remember(pend);save()}pend=null;dirty++;down=null;return}
 // press-drag-release drawing of a trendline / first channel edge
 if(pend&&down&&q.t!=null&&Math.hypot(q.x-down.x,q.y-down.y)>15){if(pend.type==='tline'){pend.b=P2(mag(q));finish(pend)}else if(pend.stage===1){pend.b=P2(mag(q));pend.stage=2}}
 down=null;if(drag){drag=null;save()}});
function setMode(m){mode=mode===m?'none':m;pend=null;sel=-1;$('selBar').classList.add('hidden');document.querySelectorAll('#draw [data-m]').forEach(b=>b.classList.toggle('on',b.dataset.m===mode));dirty++;
 cv.classList.toggle('active',mode!=='none');}
// ---------- journal / stats ----------
function renderJournal(){const j=journal(),n=j.length,w=j.filter(t=>t.pnl>0).length,Rs=j.filter(t=>t.R!=null).map(t=>t.R),tot=j.reduce((a,t)=>a+t.pnl,0);
 $('stats').innerHTML=`الصفقات: <b>${n}</b> | نسبة الربح: <b>${n?(w/n*100).toFixed(1):0}%</b> | متوسط R: <b>${Rs.length?(Rs.reduce((a,b)=>a+b,0)/Rs.length).toFixed(2):'—'}</b> | الإجمالي: <b class="${tot>=0?'w':'l'}">${tot.toFixed(2)}$</b>`;
 {const cs=confStats(j),f=(o)=>o.n?`${o.n} | ${o.winRate}% | R ${o.avgR??'—'}`:'—';$('stats').innerHTML+=`<div class="small" id="confStats">💪 واثق: <b>${f(cs.confident)}</b> &nbsp; 🤔 متردد: <b>${f(cs.hesitant)}</b></div>`;}
 const c=$('eq'),g=c.getContext('2d');c.width=c.clientWidth*(devicePixelRatio||1);c.height=120*(devicePixelRatio||1);g.scale(devicePixelRatio||1,devicePixelRatio||1);
 const W=c.clientWidth,Hh=120,eq=[S.startBal];j.forEach(t=>eq.push(eq[eq.length-1]+t.pnl));const mn=Math.min(...eq),mx=Math.max(...eq),rg=(mx-mn)||1;
 g.strokeStyle='#9afc41';g.lineWidth=2;g.beginPath();eq.forEach((v,i)=>{const x=10+i*(W-20)/Math.max(1,eq.length-1),y=Hh-10-(v-mn)/rg*(Hh-20);i?g.lineTo(x,y):g.moveTo(x,y)});g.stroke();
 g.fillStyle='#888';g.font='11px sans-serif';g.fillText(mx.toFixed(0),2,12);g.fillText(mn.toFixed(0),2,Hh-2);
 const esc=s=>String(s??'').replace(/[<>&"]/g,c=>'&#'+c.charCodeAt(0)+';');
 $('journal').innerHTML='<table><tr><th>الإغلاق</th><th>الاتجاه</th><th>دخول</th><th>SL</th><th>TP</th><th>خروج</th><th>المدة</th><th>$</th><th>R</th><th>السبب/الشعور</th></tr>'+
 j.slice().reverse().map(t=>`<tr><td>${esc(t.close)}</td><td>${t.side==='buy'?'شراء':'بيع'}</td><td>${t.entry}</td><td>${t.sl??'—'}</td><td>${t.tp??'—'}</td><td>${t.exit} ${esc(t.reason)}</td><td>${t.dur!=null?durTxt(t.dur):'—'}</td><td class="${t.pnl>=0?'w':'l'}">${t.pnl}</td><td>${t.R??'—'}</td><td>${esc(t.why)} / ${t.conf==='confident'?'💪 ':t.conf==='hesitant'?'🤔 ':''}${esc(t.feeling)}</td></tr>`).join('')+'</table>';}
let FEEL=null;const FEELTXT={confident:'واثق',hesitant:'متردد'};
function setFeel(f){FEEL=f;$('feel').value=f?FEELTXT[f]:'';document.querySelectorAll('.feelb').forEach(b=>b.classList.toggle('on',b.dataset.f===f));}
document.querySelectorAll('.feelb').forEach(b=>b.onclick=()=>setFeel(FEEL===b.dataset.f?null:b.dataset.f));
function confStats(j){const g=k=>{const a=j.filter(t=>t.conf===k),w=a.filter(t=>t.pnl>0).length,R=a.filter(t=>t.R!=null).map(t=>t.R);return {n:a.length,winRate:a.length?+(w/a.length*100).toFixed(1):null,avgR:R.length?+(R.reduce((x,y)=>x+y,0)/R.length).toFixed(2):null}};return {confident:g('confident'),hesitant:g('hesitant')}}
const COLS=['id','open','close','tf','side','lots','entry','sl','tp','exit','reason','pnl','R','why','feeling','conf','dur','quick'];
function dl(name,txt,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;a.click();}
function toCsv(j){const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return '\ufeff'+COLS.join(',')+'\n'+j.map(t=>COLS.map(k=>q(t[k])).join(',')).join('\n');}
function parseCsv(s){s=s.replace(/^\ufeff/,'');const rows=[];let r=[],f='',q=false;for(let i=0;i<s.length;i++){const ch=s[i];
 if(q){if(ch==='"'){if(s[i+1]==='"'){f+='"';i++}else q=false}else f+=ch}else if(ch==='"')q=true;else if(ch===','){r.push(f);f=''}else if(ch==='\n'){r.push(f);rows.push(r);r=[];f=''}else if(ch!=='\r')f+=ch}
 if(f||r.length){r.push(f);rows.push(r)}const h=rows.shift();
 return rows.map(r=>{const o={};h.forEach((k,i)=>{let v=r[i];if(['id','lots','entry','sl','tp','exit','pnl','R'].includes(k))v=v===''?null:+v;o[k]=v});return o});}
// ---------- session ----------
async function startAt(t){stopPlay();const c=await lastM1Before(t);if(c==null)return alert('لا توجد بيانات');S.cur=c;S.ps=[];await render();
 // snap to end of current bar of chosen tf
 const tc=await targetNext();if(tc)S.cur=tc;await render();save();}
function randStart(){const last=Date.parse(MAN.last)/1000,first=last-3*365*86400;let t;do{t=first+Math.random()*(last-first-7*86400)}while([0,6].includes(new Date(t*1000).getUTCDay()));return Math.floor(t/86400)*86400+6*3600+Math.floor(Math.random()*11)*3600;}
async function init(){
 MAN=await (await fetch('data/manifest.json')).json();
 $('range').textContent=ds(Date.parse(MAN.first)/1000)+' → '+ds(Date.parse(MAN.last)/1000);
 S=LS('gr_session')||{};S.tf=S.tf||'H1';S.draw=S.draw||[];S.ps=S.ps||(S.pos?[Object.assign({id:1},S.pos)]:[]);delete S.pos;Object.defineProperty(S,'pos',{get(){return S.ps[0]||null},set(v){S.ps=v?[v]:[]},enumerable:false,configurable:true});if(S.magnet===undefined)S.magnet=true;S.startBal=S.startBal??1000;S.balance=S.balance??S.startBal;
 if(S.v!==3){S.v=3;S.tf='H1';S.smc=Object.assign({},S.smc||{},{on:false})}
 if(!isFinite(S.cur))delete S.cur;if(!TFS[S.tf]||S.tf==='M5')S.tf='H1';
 S.smc=Object.assign({on:false,istr:true,sstr:true,iob:true,sob:true,fvg:true,sw:true,zone:true},S.smc||{});
 $('tf').value=S.tf;tfBtns();S.ema=Object.assign({on:false,p:[20,50,200]},S.ema||{});emaUI();if(S.qlot)$('qLot').value=String(S.qlot);S.macd=Object.assign({on:false,f:12,s:26,g:9},S.macd||{});macdUI();$('riskPct').value=S.riskPct||1;if(!S.scale)S.scale={auto:true,mode:0};applyScale();$('bMag').classList.toggle('on',S.magnet);$('startBal').value=S.startBal;
 for(const k in S.smc){const el=$('s_'+k);if(el){el.checked=S.smc[k];el.onchange=()=>{S.smc[k]=el.checked;save();if(B)B.smc=S.smc.on?computeSMC(B):null;dirty++}}}
 if(S.cur){await render();status('تمت متابعة الجلسة السابقة')}else await startAt(randStart());
 $('startDate').value=new Date(S.cur*1000).toISOString().slice(0,10);
 renderJournal();requestAnimationFrame(draw);ts.scrollToRealTime();}
// ---------- step back one day ----------
async function stepBack(auto){if(Q)return;if(!auto){stopPlay();for(let i=0;busy&&i<200;i++)await new Promise(r=>setTimeout(r,50))}if(busy)return;busy=true;try{
 const first=Date.parse(MAN.first)/1000;let T;
 if(auto==='bar'){const A=B.A,k=B.k;const st=A.t[k]<S.cur?A.t[k]:(k>0?A.t[k-1]:null);if(st==null){status('بداية البيانات');stopPlay();return}T=st;}else T=S.cur-86400;
 if(T<=first+86400){status('بداية البيانات');stopPlay();return}
 const to=await lastM1Before(T);if(to==null||to<=first){status('بداية البيانات');stopPlay();return}
 const cut=ds(to);
 // open position opened after the new cursor -> drop it
 S.ps=S.ps.filter(p=>p.open<=to);
 // trades closed after the new cursor -> remove; reopen the latest one if it was opened before the cursor
 const j=journal(),keep=[],gone=[];for(const t of j){const ct=t.closeT!=null?t.closeT:null;((ct!=null?ct>to:t.close>cut)?gone:keep).push(t)}
 if(gone.length){gone.forEach(t=>{S.balance=+(S.balance-t.pnl).toFixed(2)});
  for(const last of gone)if(last.openT!=null&&last.openT<=to)S.ps.push({id:last.id,side:last.side,quick:last.quick,entry:last.entry,sl:last.sl,tp:last.tp,lots:last.lots,open:last.openT,tf:last.tf,why:last.why,feel:last.feeling,conf:last.conf,bal0:last.bal0!=null?last.bal0:S.balance,ctx:last.ctx});
  setJournal(keep);renderJournal();}
 S.cur=to;await render();save();updLines();updPos();if(auto!=='bar')status('⏪ رجوع يوم: '+cut);
}catch(e){console.error(e);status('خطأ: '+e.message)}finally{busy=false}}
$('bBack').onclick=()=>stepBack();
$('bNext').onclick=stepNext;
// ---------- keyboard shortcuts (desktop) ----------
document.addEventListener('keydown',e=>{const tg=e.target,tn=tg&&tg.tagName;if(tn==='INPUT'||tn==='TEXTAREA'||tn==='SELECT')return;
 const k=e.key;if(window.__course&&!window.__courseStep&&(k===' '||k==='ArrowRight'||k==='ArrowLeft'))return;
 if(k===' '&&e.shiftKey){e.preventDefault();$('bRev').click()}
 else if(k===' '){e.preventDefault();$('bPlay').click()}
 else if(k==='ArrowRight'){e.preventDefault();if(e.shiftKey)$('bDay').click();else $('bNext').click()}
 else if(k==='ArrowLeft'&&e.shiftKey){e.preventDefault();$('bBack').click()}
 else if((e.ctrlKey||e.metaKey)&&(k==='z'||k==='Z')){e.preventDefault();undo()}
 else if(k==='Escape'){if(mode!=='none')setMode(mode);else select(-1)}
 else if((k==='Delete'||k==='Backspace')&&sel>=0){e.preventDefault();$('sDel').click()}
 else if(!e.ctrlKey&&!e.metaKey&&!e.altKey){const m={h:'hline',t:'tline',c:'chan',e:'edit',d:'del',p:'pen',l:'long',s:'short'}[k.toLowerCase()];if(m)setMode(m);else if(k.toLowerCase()==='m')$('bMag').click()}});$('bDay').onclick=stepDay;
$('bPlay').onclick=()=>{if(playT)return stopPlay();stopPlay();$('bPlay').textContent='⏸';$('bPlay').classList.add('playing');playT=setInterval(stepNext,+$('speed').value)};
$('speed').onchange=()=>{if(playT){stopPlay();$('bPlay').click()}else if(revT){stopPlay();$('bRev').click()}};
// reverse play: steps back one candle of the current timeframe per tick
const revTick=()=>stepBack('bar');
$('bRev').onclick=()=>{if(revT)return stopPlay();if(Q)return;stopPlay();$('bRev').textContent='⏸';$('bRev').classList.add('playing');revT=setInterval(revTick,+$('speed').value)};
const tfBtns=()=>document.querySelectorAll('.tfb').forEach(b=>b.classList.toggle('on',b.dataset.tf===S.tf));
document.querySelectorAll('.tfb').forEach(b=>b.onclick=()=>{if(b.dataset.tf===S.tf)return;$('tf').value=b.dataset.tf;$('tf').onchange()});
$('tf').onchange=async()=>{S.tf=$('tf').value;tfBtns();await render();ts.scrollToRealTime();save()};
document.querySelectorAll('#draw [data-m]').forEach(b=>b.onclick=()=>setMode(b.dataset.m));
$('bUndo').onclick=undo;
$('bEma').onclick=()=>{S.ema.on=!S.ema.on;emaUI();save();updEma(true)};
['e1','e2','e3'].forEach((id,i)=>$(id).onchange=()=>{const v=Math.round(num(id));if(v>0&&v<=500){S.ema.p[i]=v;save();updEma(true)}else emaUI()});
$('bMacd').onclick=()=>{S.macd.on=!S.macd.on;macdUI();save();mPrev=null;if(S.macd.on)setTimeout(()=>updMacd(true),0)};
['mF','mS','mG'].forEach(id=>$(id).onchange=()=>{const v=Math.round(num(id));if(v>0&&v<=200){S.macd[{mF:'f',mS:'s',mG:'g'}[id]]=v;save();updMacd(true)}else macdUI()});
// ---------- price-scale toggles (A / L / %) ----------
const PS=chart.priceScale('right');
function applyScale(){const sc=S.scale||(S.scale={auto:true,mode:0});PS.applyOptions({autoScale:sc.auto,mode:sc.mode});scaleUI();dirty++}
function scaleUI(){const sc=S.scale||{auto:true,mode:0};$('scA').classList.toggle('on',!!sc.auto);$('scL').classList.toggle('on',sc.mode===1);$('scP').classList.toggle('on',sc.mode===2)}
function syncAuto(){if(!S.scale)return;const a=!!PS.options().autoScale;if(a!==S.scale.auto){S.scale.auto=a;scaleUI();save()}}
['pointerup','touchend','wheel','dblclick'].forEach(ev=>$('chart').addEventListener(ev,()=>setTimeout(syncAuto,50),{passive:true}));
$('scA').onclick=()=>{S.scale.auto=true;applyScale();save()};
$('scL').onclick=()=>{S.scale.mode=S.scale.mode===1?0:1;applyScale();save()};
$('scP').onclick=()=>{S.scale.mode=S.scale.mode===2?0:2;applyScale();save()};
function placeScale(){const b=$('scaleBtns');const w=PS.width(),h=ts.height();if(w>0){b.style.width=w+'px';b.style.height=Math.max(h,24)+'px'}}
$('bMag').onclick=()=>{S.magnet=!S.magnet;$('bMag').classList.toggle('on',S.magnet);save()};
$('sExt').onclick=()=>selEdit(d=>{d.ext=!d.ext});
document.querySelectorAll('#selBar [data-c]').forEach(b=>b.onclick=()=>styEdit(d=>{d.color=b.dataset.c}));
$('stylePop').querySelector('.pal').innerHTML=PAL.map(c=>'<button class="pc" data-pc="'+c+'" style="background:'+c+'"></button>').join('');
$('sColor').onclick=()=>{$('stylePop').classList.toggle('hidden');stylePopUI()};
document.querySelectorAll('#stylePop .pc').forEach(b=>b.onclick=()=>styEdit(d=>{if(popTarget==='fc'){d.fc=b.dataset.pc;d.fill=true}else d.color=b.dataset.pc}));
let opSnap=false;$('pOp').addEventListener('pointerdown',()=>{if(sel>=0&&!opSnap){snap();opSnap=true}});
$('pOp').oninput=()=>{const d=S.draw[sel];if(!d)return;if(!opSnap){snap();opSnap=true}const v=+$('pOp').value/100;if(popTarget==='fc')d.fo=v;else d.op=v;remember(d);save();dirty++;$('pOpV').textContent=$('pOp').value+'%'};
$('pOp').onchange=()=>{opSnap=false};
document.querySelectorAll('#stylePop [data-lw]').forEach(b=>b.onclick=()=>styEdit(d=>{d.lw=+b.dataset.lw}));
document.querySelectorAll('#stylePop [data-ls]').forEach(b=>b.onclick=()=>styEdit(d=>{d.ls=+b.dataset.ls}));
$('pFill').onclick=()=>styEdit(d=>{d.fill=d.fill===false});
$('pTgtLine').onclick=()=>{popTarget='color';stylePopUI()};$('pTgtFill').onclick=()=>{popTarget='fc';stylePopUI()};
$('sDel').onclick=()=>{if(sel<0)return;snap();S.draw.splice(sel,1);save();select(-1)};
$('sExec').onclick=execPos;
$('riskPct').onchange=()=>{const v=num('riskPct');if(v>0&&v<=100){S.riskPct=v;save();dirty++}};
$('sOk').onclick=()=>select(-1);
$('bClr').onclick=()=>{if(confirm('مسح كل الرسومات؟')){if(S.draw.length)snap();S.draw=[];save();select(-1)}};
$('bSmc').onclick=()=>$('smcPanel').classList.toggle('hidden');
$('bBuy').onclick=()=>openPos('buy');$('bSell').onclick=()=>openPos('sell');
$('bClose').onclick=()=>closeAll();
$('qBuy').onclick=()=>openPos('buy',true);$('qSell').onclick=()=>openPos('sell',true);
$('qLot').onchange=()=>{const v=parseFloat($('qLot').value);if(v>0){S.qlot=v;save()}};
['sl','tp','lots'].forEach(k=>$(k).oninput=()=>{updLines();updRisk()});
$('bAuto').onclick=()=>{if(!B)return;const n=B.n,i0=Math.max(0,n-15);let hi=-1e9,lo=1e9;for(let i=i0;i<n;i++){hi=Math.max(hi,B.H[i]);lo=Math.min(lo,B.L[i])}
 const e=S.price,dist=Math.max(Math.min(e-lo,hi-e),1);$('sl').value=(e-dist).toFixed(2);$('tp').value=(e+2*dist).toFixed(2);status('للشراء؛ اعكسها للبيع');updLines();updRisk();};
$('startBal').onchange=()=>{const v=num('startBal');if(v>0){S.balance=+(S.balance+v-S.startBal).toFixed(2);S.startBal=v;save();updPos();renderJournal()}};
$('bStart').onclick=()=>{const v=$('startDate').value;if(v)startAt(Date.parse(v+'T07:00:00Z')/1000)};
$('bRand').onclick=()=>startAt(randStart());
$('bCsv').onclick=()=>dl('gold-journal.csv',toCsv(journal()),'text/csv');
$('bJson').onclick=()=>dl('gold-journal.json',JSON.stringify(journal(),null,1),'application/json');
$('bWipe').onclick=()=>{if(confirm('حذف كل السجل؟')){setJournal([]);renderJournal()}};
$('imp').onchange=async e=>{const f=e.target.files[0];if(!f)return;const s=await f.text();try{const arr=f.name.endsWith('.csv')?parseCsv(s):JSON.parse(s);
 const j=journal(),ids=new Set(j.map(t=>t.id));arr.forEach(t=>{if(!ids.has(t.id))j.push(t)});setJournal(j);renderJournal();status('تم الاستيراد: '+arr.length)}catch(err){alert('ملف غير صالح')}};
window.GR={ema:()=>emaSer?emaSer.map(x=>{const d=x.data().filter(p=>p.value!=null);return {n:d.length,last:d[d.length-1]}}):null,get sty(){return S.sty},macd:()=>MC?{n:mH.data().length,last:mH.data().slice(-1)[0],range:MC.timeScale().getVisibleLogicalRange(),main:chart.timeScale().getVisibleLogicalRange()}:null,get revT(){return revT},get Q(){return Q},startChal,execPos,chal:()=>CH,PS:()=>PS.options(),ptpx(o,r){return {x:r.left+X(o.t),y:r.top+Y(o.p)}},stepBack,cpx(i){const r=cv.getBoundingClientRect();return {x:r.left+XI(i),y:r.top+Y(B.H[i]),h:B.H[i]}},hit:q=>[hitDraw(q),sel>=0&&hitHandle(S.draw[sel],q),JSON.stringify(drag)],get sel(){return sel},select,mid(i){const d=S.draw[i],r=cv.getBoundingClientRect();return {x:r.left+(X(d.a.t)+X(d.b.t))/2,y:r.top+(Y(d.a.p)+Y(d.b.p))/2,bx:r.left+X(d.b.t),by:r.top+Y(d.b.p)}},snapCtx,quiz:()=>LS('gr_quiz')||[],get S(){return S},get B(){return B},stepNext,openPos,closePos,journal};
init().catch(e=>{console.error(e);status('خطأ في التحميل')});
// ---------- context snapshot ----------
function snapCtx(){if(B&&!B.smc)B.smc=computeSMC(B);if(!B||!B.smc||!B.smc.raw)return {tf:S.tf};const sm=B.smc,{I,Sw}=sm.raw,px=S.price,r2=v=>+v.toFixed(2);
 const tr=t=>t===1?'up':t===-1?'down':'none',last=a=>a.length?(l=>({type:l.t,dir:l.bull?'bull':'bear',level:r2(l.p),time:ds(B.U[l.i2])}))(a[a.length-1]):null;
 const near=a=>{let b=null;for(const o of a){const d=px>o.top?px-o.top:px<o.bot?o.bot-px:0;if(!b||d<b.dist)b={dir:o.bull?'bull':'bear',top:r2(o.top),bot:r2(o.bot),dist:r2(d),inside:d===0}}return b};
 let zone=null;if(Sw.tT&&Sw.tB){const pct=(px-Sw.tB.p)/((Sw.tT.p-Sw.tB.p)||1)*100;zone={swingHigh:r2(Sw.tT.p),swingLow:r2(Sw.tB.p),pct:+pct.toFixed(1),area:pct>=52.5?'premium':pct<=47.5?'discount':'equilibrium'}}
 return {tf:S.tf,time:ds(S.cur),price:px,drawings:JSON.parse(JSON.stringify(S.draw)).map(d=>({type:d.type,a:d.a&&{time:ds(d.a.t),p:r2(d.a.p)},b:d.b&&{time:ds(d.b.t),p:r2(d.b.p)},off:d.off!=null?r2(d.off):undefined})),
  smc:{swingTrend:tr(Sw.trend),internalTrend:tr(I.trend),lastSwing:last(Sw.lines),lastInternal:last(I.lines),zone,nearestOB:near(I.obs.concat(Sw.obs)),nearestFVG:near(sm.fvgAll||[]),
   strongHigh:Sw.trend===-1,strongLow:Sw.trend===1}};}
// ---------- quiz ----------
let Q=null;
function quizUI(){$('quizP').classList.toggle('hidden',!Q);$('bBack').disabled=!!Q;$('bRev').disabled=!!Q;if(Q)stopPlay();if(!Q)return;$('qBias').textContent=Q.bias?('الاتجاه: '+(Q.bias==='up'?'صاعد ⬆':'هابط ⬇')):'اختر الاتجاه';}
$('bQuiz').onclick=async()=>{stopPlay();if(S.ps.length)return alert('أغلق الصفقة أولاً');await startAt(randStart());Q={bias:null};$('qE').value=S.price.toFixed(2);$('qSL').value='';$('qTP').value='';$('qRes').textContent='';quizUI();$('quizP').scrollIntoView();};
$('qUp').onclick=()=>{if(Q){Q.bias='up';quizUI()}};$('qDn').onclick=()=>{if(Q){Q.bias='down';quizUI()}};
$('qX').onclick=()=>{Q=null;quizUI()};
let CH=null;
async function chalList(){if(!CH)CH=await (await fetch('data/challenges.json')).json();const sc=S.chal||{};
 $('chalList').innerHTML=CH.map((c,i)=>{const r=sc[c.id];return `<button class="chal" data-i="${i}"><b>#${i+1}</b> <span>${c.title}</span><small>${c.year} • ${c.diff}</small>${r?`<em class="${r.biasOK?'w':'l'}">${r.biasOK?'✅':'❌'} ${r.score}</em>`:''}</button>`}).join('');
 const done=Object.keys(sc).length,ok=Object.values(sc).filter(r=>r.biasOK).length;$('chalSum').textContent=`أنجزت ${done}/${CH.length} — صحيح ${ok}`;
 document.querySelectorAll('#chalList .chal').forEach(b=>b.onclick=()=>startChal(CH[+b.dataset.i]));}
async function startChal(c){stopPlay();if(S.ps.length)return alert('أغلق الصفقة أولاً');S.tf=c.tf;$('tf').value=c.tf;tfBtns();await startAt(c.t);
 Q={bias:null,ch:c.id};$('qE').value=S.price.toFixed(2);$('qSL').value='';$('qTP').value='';$('qRes').innerHTML='<b>🎯 '+c.title+'</b> — '+c.diff+'<br>ارسم مربع شراء/بيع (📈/📉) ثم ✔ نفّذ، أو اختر الاتجاه، ثم 👁 اكشف.';
 $('chalP').classList.add('hidden');quizUI();scrollTo(0,0);}
$('bChal').onclick=async()=>{$('chalP').classList.toggle('hidden');if(!$('chalP').classList.contains('hidden')){await chalList();$('chalP').scrollIntoView()}};
$('qGo').onclick=async()=>{if(!Q||busy)return;if(!Q.bias)return alert('اختر الاتجاه أولاً');
 const e=num('qE')??S.price,sl=num('qSL'),tp=num('qTP'),N=+$('qN').value,d=Q.bias==='up'?1:-1;
 if(sl!=null&&(sl-e)*d>=0)return alert('SL في الجهة الخطأ');if(tp!=null&&(tp-e)*d<=0)return alert('TP في الجهة الخطأ');
 const ctx=snapCtx(),t0=S.cur,p0=S.price;busy=true;let to=S.cur;
 try{for(let i=0;i<N;i++){const nt=await targetNext();if(nt==null)break;S.cur=nt;await render();}}finally{busy=false}
 to=S.cur;const M=await m1(t0+60,to);let state=Math.abs(e-p0)<0.05?'filled':'pending',out='open',exitPx=null,mfe=0,mae=0;
 for(let i=0;i<M.n;i++){if(M.t[i]<=t0||M.t[i]>to)continue;
  if(state==='pending'){if(M.l[i]<=e&&M.h[i]>=e)state='filled';else continue;}
  mfe=Math.max(mfe,(d>0?M.h[i]-e:e-M.l[i]));mae=Math.max(mae,(d>0?e-M.l[i]:M.h[i]-e));
  if(sl!=null&&(d>0?M.l[i]<=sl:M.h[i]>=sl)){out='SL';exitPx=sl;break}if(tp!=null&&(d>0?M.h[i]>=tp:M.l[i]<=tp)){out='TP';exitPx=tp;break}}
 if(state==='pending')out='not_triggered';if(out==='open'&&state==='filled')exitPx=S.price;
 const risk=sl!=null?Math.abs(e-sl):null,R=exitPx!=null&&risk?+(((exitPx-e)*d)/risk).toFixed(2):null;
 const biasOK=(S.price-p0)*d>0,score=(biasOK?1:0)+(out==='TP'?2:out==='SL'?-1:0);
 const rec={id:Date.now(),date:ds(t0),tf:S.tf,candles:N,bias:Q.bias,entry:e,sl,tp,priceStart:p0,priceEnd:S.price,move:+(S.price-p0).toFixed(2),biasCorrect:biasOK,outcome:out,R,mfe:+mfe.toFixed(2),mae:+mae.toFixed(2),score,ctx};
 const qs=LS('gr_quiz')||[];qs.push(rec);localStorage.setItem('gr_quiz',JSON.stringify(qs));
 const ok=qs.filter(q=>q.biasCorrect).length;
 $('qRes').innerHTML=`${biasOK?'✅ الاتجاه صحيح':'❌ الاتجاه خطأ'} | الحركة ${rec.move}$ | الصفقة: ${({TP:'وصلت الهدف',SL:'ضرب الوقف',open:'ما زالت مفتوحة',not_triggered:'لم تتفعل'})[out]} ${R!=null?'('+R+'R)':''} | النقاط ${score}<br>إجمالي الاختبارات ${qs.length} — دقة الاتجاه ${(ok/qs.length*100).toFixed(0)}%`;
 if(Q.ch&&!Q.done){const c=(CH||[]).find(x=>x.id===Q.ch);Q.done=1;S.chal=S.chal||{};S.chal[Q.ch]={score,biasOK,outcome:out,R,date:ds(t0),at:new Date().toISOString()};
  if(c)$('qRes').innerHTML+='<div class="expl">📘 '+(window.I18N&&I18N.de()&&c.expl_de?c.expl_de:c.expl)+'</div>';}
 Q.bias=null;save();};
// ---------- coach export ----------
function coachData(){const j=journal(),qs=LS('gr_quiz')||[],w=j.filter(t=>t.pnl>0).length,Rs=j.filter(t=>t.R!=null).map(t=>t.R);
 return {app:'gold-replay',v:1,exported:new Date().toISOString(),session:{cursor:ds(S.cur),tf:S.tf,startBalance:S.startBal,balance:S.balance,openPositions:S.ps,equity:+(S.balance+S.ps.reduce((a,p)=>a+fpl(p),0)).toFixed(2)},
  stats:{trades:j.length,winRate:j.length?+(w/j.length*100).toFixed(1):0,avgR:Rs.length?+(Rs.reduce((a,b)=>a+b,0)/Rs.length).toFixed(2):null,totalPnl:+j.reduce((a,t)=>a+t.pnl,0).toFixed(2),
   quizzes:qs.length,quizBiasAccuracy:qs.length?+(qs.filter(q=>q.biasCorrect).length/qs.length*100).toFixed(1):null},confidenceStats:confStats(j),trades:j.map(t=>Object.assign({},t,{reason:tr(t.reason),feeling:tr(t.feeling)})),quiz:qs,challenges:S.chal||{},lang:(window.I18N&&I18N.lang)||'ar'};}
$('bCoach').onclick=()=>dl('gold-coach-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(coachData()),'application/json');
$('bCoachCopy').onclick=async()=>{const s=JSON.stringify(coachData());try{await navigator.clipboard.writeText(s);status('تم النسخ — الصقه في المحادثة')}catch(e){prompt('انسخ النص:',s)}};
$('bCoachShare').onclick=async()=>{const s=JSON.stringify(coachData());const f=new File([s],'gold-coach.json',{type:'application/json'});
 try{if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:'Gold coach'});else if(navigator.share)await navigator.share({text:s});else $('bCoach').click()}catch(e){}};
