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
function save(){dirty++;localStorage.setItem('gr_session',JSON.stringify(S));}
function journal(){return LS('gr_journal')||[]}
function setJournal(j){localStorage.setItem('gr_journal',JSON.stringify(j));}
// ---------- chart ----------
const chart=LightweightCharts.createChart($('chart'),{layout:{background:{color:'#000'},textColor:'#bbb'},
 grid:{vertLines:{visible:false},horzLines:{visible:false}},rightPriceScale:{borderColor:'#333'},
 timeScale:{borderColor:'#333',timeVisible:true,rightOffset:8},crosshair:{mode:0},autoSize:true});
const ser=chart.addCandlestickSeries({upColor:'#9afc41',downColor:'#9c9c9c',borderUpColor:'#9c9c9c',borderDownColor:'#9c9c9c',wickUpColor:'#9c9c9c',wickDownColor:'#9c9c9c',priceFormat:{type:'price',precision:2,minMove:0.01}});
let plines=[];
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
 ser.setData(data);
 B={U,O,H,L,C,n:U.length,nDone,tfs:TFS[tf],A,k};
 S.price=C[C.length-1];
 B.smc=S.smc.on?computeSMC(B):null;dirty++;
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
 if(S.pos){const M=await m1(S.cur+60,to);for(let i=0;i<M.n;i++){const t=M.t[i];if(t<=S.cur||t>to)continue;if(checkHit(M,i))break;}}
 S.cur=to;await render();save();return true;}
async function doStep(fn){if(busy)return;busy=true;try{await advance(await fn())}catch(e){console.error(e);status('خطأ: '+e.message)}busy=false;}
const stepNext=()=>doStep(targetNext);
const stepDay=()=>doStep(async()=>{const M=await m1(S.cur,S.cur+86400*4);const i=bs(M.t,S.cur+86400,M.n);return i>=0?M.t[i]:null});
function stopPlay(){if(playT){clearInterval(playT);playT=null}$('bPlay').textContent='▶️ تشغيل';$('bPlay').classList.remove('playing');}
function status(s){$('status').textContent=s;setTimeout(()=>{if($('status').textContent===s)$('status').textContent=''},4000)}
// ---------- trading ----------
const num=id=>{const v=parseFloat($(id).value);return isFinite(v)?v:null};
function checkHit(M,i){const p=S.pos,d=p.side==='buy'?1:-1;
 const slHit=p.sl!=null&&(d>0?M.l[i]<=p.sl:M.h[i]>=p.sl), tpHit=p.tp!=null&&(d>0?M.h[i]>=p.tp:M.l[i]<=p.tp);
 if(slHit){closePos(p.sl,'SL',M.t[i]);return true}if(tpHit){closePos(p.tp,'TP',M.t[i]);return true}return false;}
function openPos(side){stopPlay();if(S.pos)return alert('لديك صفقة مفتوحة');const lots=num('lots');if(!lots||lots<=0)return alert('أدخل حجم اللوت');
 const e=S.price,sl=num('sl'),tp=num('tp'),d=side==='buy'?1:-1;
 if(sl!=null&&(sl-e)*d>=0)return alert('وقف الخسارة في الجهة الخطأ');if(tp!=null&&(tp-e)*d<=0)return alert('الهدف في الجهة الخطأ');
 S.pos={side,entry:e,sl,tp,lots,open:S.cur,tf:S.tf,why:$('why').value,feel:$('feel').value,bal0:S.balance,ctx:snapCtx()};save();updLines();updPos();}
function closePos(px,reason,t){stopPlay();const p=S.pos;if(!p)return;const d=p.side==='buy'?1:-1;
 const pnl=+((px-p.entry)*d*OZ*p.lots).toFixed(2),risk=p.sl!=null?Math.abs(p.entry-p.sl)*OZ*p.lots:null;
 const tr={id:Date.now(),open:ds(p.open),close:ds(t||S.cur),tf:p.tf,side:p.side,lots:p.lots,entry:p.entry,sl:p.sl,tp:p.tp,exit:+px.toFixed(2),reason,pnl,R:risk?+(pnl/risk).toFixed(2):null,why:p.why,feeling:p.feel||$('feel').value,ctx:p.ctx};
 const j=journal();j.push(tr);setJournal(j);S.balance=+(S.balance+pnl).toFixed(2);S.pos=null;save();
 status((reason==='TP'?'✅ ':reason==='SL'?'❌ ':'')+'أغلقت الصفقة: '+pnl+'$');$('why').value='';$('feel').value='';
 updLines();updPos();renderJournal();}
function updPos(){$('bal').textContent=S.balance.toFixed(2);const p=S.pos;
 if(!p){$('pos').textContent='لا توجد صفقة مفتوحة';}else{const d=p.side==='buy'?1:-1,pl=(S.price-p.entry)*d*OZ*p.lots;
  $('pos').innerHTML=(p.side==='buy'?'شراء':'بيع')+' '+p.lots+' @ '+p.entry.toFixed(2)+' | SL '+(p.sl??'—')+' | TP '+(p.tp??'—')+' | الربح/الخسارة المفتوحة: <span class="'+(pl>=0?'w':'l')+'">'+pl.toFixed(2)+'$</span>';}
 updRisk();}
function updRisk(){const p=S.pos,e=p?p.entry:S.price,sl=p?p.sl:num('sl'),lots=p?p.lots:num('lots'),tp=p?p.tp:num('tp');
 if(sl==null||!lots){$('risk').textContent='المخاطرة: —';return}
 const r=Math.abs(e-sl)*OZ*lots;let s='المخاطرة: '+r.toFixed(2)+'$ ('+(r/S.balance*100).toFixed(2)+'%)';
 if(tp!=null)s+=' | العائد/المخاطرة 1:'+(Math.abs(tp-e)/Math.abs(e-sl)).toFixed(2);$('risk').textContent=s;}
function updLines(){plines.forEach(l=>ser.removePriceLine(l));plines=[];const p=S.pos;
 const add=(price,color,title,style)=>{if(price!=null)plines.push(ser.createPriceLine({price,color,lineWidth:2,lineStyle:style,axisLabelVisible:true,title}))};
 if(p){add(p.entry,'#4aa3ff','دخول',0);add(p.sl,'#ff4d4d','SL',0);add(p.tp,'#9afc41','TP',0);}
 else{add(num('sl'),'#ff4d4d','SL?',2);add(num('tp'),'#9afc41','TP?',2);}}
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
function segs(d){if(d.type==='hline')return [[{t:-1e12,p:d.a.p},{t:1e12,p:d.a.p}]];const s=[[d.a,d.b]];
 if(d.type==='chan')s.push([{t:d.a.t,p:d.a.p+d.off},{t:d.b.t,p:d.b.p+d.off}]);return s;}
function handles(d){if(d.type==='hline')return [['a',l2t(B.n-1),d.a.p]];const h=[['a',d.a.t,d.a.p],['b',d.b.t,d.b.p]];
 if(d.type==='chan'){const m=(d.a.t+d.b.t)/2;h.push(['c',m,lineP(d.a,d.b,m)+d.off])}return h;}
let dirty=1,lastKey='';
function draw(){if(document.hidden)return setTimeout(()=>requestAnimationFrame(draw),500);const dpr=window.devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;
 const key=B?[w,h,dirty,XI(0),XI(B.n-1),Y(S.price),Y(S.price*1.01),mode,S.draw.length,JSON.stringify(pend),drag?JSON.stringify(S.draw):''].join('|'):'x'+dirty;
 if(key===lastKey)return requestAnimationFrame(draw);lastKey=key;
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
 for(const d of S.draw.concat(pend?[pend]:[])){cx.strokeStyle=d===pend?'#fc0':'#4aa3ff';cx.lineWidth=2;
  for(const [a,b] of segs(d)){const x1=d.type==='hline'?0:X(a.t),x2=d.type==='hline'?pw:X(b.t);cx.beginPath();cx.moveTo(x1,Y(a.p));cx.lineTo(x2,Y(b.p));cx.stroke();}
  if(d.type==='chan'){cx.fillStyle='rgba(74,163,255,.08)';cx.beginPath();cx.moveTo(X(d.a.t),Y(d.a.p));cx.lineTo(X(d.b.t),Y(d.b.p));cx.lineTo(X(d.b.t),Y(d.b.p+d.off));cx.lineTo(X(d.a.t),Y(d.a.p+d.off));cx.fill();}
  if(mode==='edit'&&d!==pend)for(const [,t,p] of handles(d)){cx.fillStyle='#fff';cx.beginPath();cx.arc(d.type==='hline'?pw-20:X(t),Y(p),7,0,7);cx.fill();}}
 cx.restore();requestAnimationFrame(draw);}
function dSeg(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,L=dx*dx+dy*dy||1;let u=((px-x1)*dx+(py-y1)*dy)/L;u=Math.max(0,Math.min(1,u));return Math.hypot(px-x1-u*dx,py-y1-u*dy)}
function hitDraw(q){for(let i=S.draw.length-1;i>=0;i--){const d=S.draw[i];for(const [a,b] of segs(d)){const x1=d.type==='hline'?0:X(a.t),x2=d.type==='hline'?9999:X(b.t);if(dSeg(q.x,q.y,x1,Y(a.p),x2,Y(b.p))<16)return i}}return -1}
cv.addEventListener('pointerdown',e=>{if(!B)return;const q=pt(e);if(q.t==null||q.p==null)return;e.preventDefault();
 if(mode==='hline'){S.draw.push({type:'hline',a:{t:q.t,p:q.p}});save();}
 else if(mode==='tline'){if(!pend)pend={type:'tline',a:q,b:q};else{pend.b={t:q.t,p:q.p};S.draw.push(pend);pend=null;save()}}
 else if(mode==='chan'){if(!pend)pend={type:'chan',a:q,b:q,off:0,stage:1};else if(pend.stage===1){pend.b={t:q.t,p:q.p};pend.stage=2}
  else{pend.off=q.p-lineP(pend.a,pend.b,q.t);delete pend.stage;S.draw.push(pend);pend=null;save()}}
 else if(mode==='del'){const i=hitDraw(q);if(i>=0){S.draw.splice(i,1);save()}}
 else if(mode==='edit'){const pw=cv.clientWidth-60;
  for(const d of S.draw)for(const [k,t,p] of handles(d)){if(Math.hypot((d.type==='hline'?pw-20:X(t))-q.x,Y(p)-q.y)<22){drag={d,k};cv.setPointerCapture(e.pointerId);return}}
  for(const k of ['sl','tp']){const v=S.pos?S.pos[k]:num(k);if(v!=null&&Math.abs(Y(v)-q.y)<16){drag={k};cv.setPointerCapture(e.pointerId);return}}}});
cv.addEventListener('pointermove',e=>{if(!B)return;const q=pt(e);if(q.p==null)return;
 if(pend&&pend.stage!==2&&mode!=='none'){pend.b={t:q.t,p:q.p}}else if(pend&&pend.stage===2){pend.off=q.p-lineP(pend.a,pend.b,q.t)}
 if(!drag)return;const p=+q.p.toFixed(2);
 if(drag.d){const d=drag.d;if(drag.k==='c')d.off=q.p-lineP(d.a,d.b,q.t);else d[drag.k]={t:d.type==='hline'?d.a.t:q.t,p:q.p};}
 else{if(S.pos)S.pos[drag.k]=p;else $(drag.k).value=p;updLines();updPos();}});
cv.addEventListener('pointerup',()=>{if(drag){drag=null;save()}});
function setMode(m){mode=mode===m?'none':m;pend=null;document.querySelectorAll('#draw [data-m]').forEach(b=>b.classList.toggle('on',b.dataset.m===mode));
 cv.classList.toggle('active',mode!=='none');}
// ---------- journal / stats ----------
function renderJournal(){const j=journal(),n=j.length,w=j.filter(t=>t.pnl>0).length,Rs=j.filter(t=>t.R!=null).map(t=>t.R),tot=j.reduce((a,t)=>a+t.pnl,0);
 $('stats').innerHTML=`الصفقات: <b>${n}</b> | نسبة الربح: <b>${n?(w/n*100).toFixed(1):0}%</b> | متوسط R: <b>${Rs.length?(Rs.reduce((a,b)=>a+b,0)/Rs.length).toFixed(2):'—'}</b> | الإجمالي: <b class="${tot>=0?'w':'l'}">${tot.toFixed(2)}$</b>`;
 const c=$('eq'),g=c.getContext('2d');c.width=c.clientWidth*(devicePixelRatio||1);c.height=120*(devicePixelRatio||1);g.scale(devicePixelRatio||1,devicePixelRatio||1);
 const W=c.clientWidth,Hh=120,eq=[S.startBal];j.forEach(t=>eq.push(eq[eq.length-1]+t.pnl));const mn=Math.min(...eq),mx=Math.max(...eq),rg=(mx-mn)||1;
 g.strokeStyle='#9afc41';g.lineWidth=2;g.beginPath();eq.forEach((v,i)=>{const x=10+i*(W-20)/Math.max(1,eq.length-1),y=Hh-10-(v-mn)/rg*(Hh-20);i?g.lineTo(x,y):g.moveTo(x,y)});g.stroke();
 g.fillStyle='#888';g.font='11px sans-serif';g.fillText(mx.toFixed(0),2,12);g.fillText(mn.toFixed(0),2,Hh-2);
 const esc=s=>String(s??'').replace(/[<>&"]/g,c=>'&#'+c.charCodeAt(0)+';');
 $('journal').innerHTML='<table><tr><th>الإغلاق</th><th>الاتجاه</th><th>دخول</th><th>SL</th><th>TP</th><th>خروج</th><th>$</th><th>R</th><th>السبب/الشعور</th></tr>'+
 j.slice().reverse().map(t=>`<tr><td>${esc(t.close)}</td><td>${t.side==='buy'?'شراء':'بيع'}</td><td>${t.entry}</td><td>${t.sl??'—'}</td><td>${t.tp??'—'}</td><td>${t.exit} ${esc(t.reason)}</td><td class="${t.pnl>=0?'w':'l'}">${t.pnl}</td><td>${t.R??'—'}</td><td>${esc(t.why)} / ${esc(t.feeling)}</td></tr>`).join('')+'</table>';}
const COLS=['id','open','close','tf','side','lots','entry','sl','tp','exit','reason','pnl','R','why','feeling'];
function dl(name,txt,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;a.click();}
function toCsv(j){const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return '\ufeff'+COLS.join(',')+'\n'+j.map(t=>COLS.map(k=>q(t[k])).join(',')).join('\n');}
function parseCsv(s){s=s.replace(/^\ufeff/,'');const rows=[];let r=[],f='',q=false;for(let i=0;i<s.length;i++){const ch=s[i];
 if(q){if(ch==='"'){if(s[i+1]==='"'){f+='"';i++}else q=false}else f+=ch}else if(ch==='"')q=true;else if(ch===','){r.push(f);f=''}else if(ch==='\n'){r.push(f);rows.push(r);r=[];f=''}else if(ch!=='\r')f+=ch}
 if(f||r.length){r.push(f);rows.push(r)}const h=rows.shift();
 return rows.map(r=>{const o={};h.forEach((k,i)=>{let v=r[i];if(['id','lots','entry','sl','tp','exit','pnl','R'].includes(k))v=v===''?null:+v;o[k]=v});return o});}
// ---------- session ----------
async function startAt(t){stopPlay();const c=await lastM1Before(t);if(c==null)return alert('لا توجد بيانات');S.cur=c;S.pos=null;await render();
 // snap to end of current bar of chosen tf
 const tc=await targetNext();if(tc)S.cur=tc;await render();save();}
function randStart(){const last=Date.parse(MAN.last)/1000,first=last-3*365*86400;let t;do{t=first+Math.random()*(last-first-7*86400)}while([0,6].includes(new Date(t*1000).getUTCDay()));return Math.floor(t/86400)*86400+6*3600+Math.floor(Math.random()*11)*3600;}
async function init(){
 MAN=await (await fetch('data/manifest.json')).json();
 $('range').textContent=ds(Date.parse(MAN.first)/1000)+' → '+ds(Date.parse(MAN.last)/1000);
 S=LS('gr_session')||{};S.tf=S.tf||'H1';S.draw=S.draw||[];S.startBal=S.startBal??1000;S.balance=S.balance??S.startBal;
 if(S.v!==3){S.v=3;S.tf='H1';S.smc=Object.assign({},S.smc||{},{on:false})}
 if(!isFinite(S.cur))delete S.cur;if(!TFS[S.tf]||S.tf==='M5')S.tf='H1';
 S.smc=Object.assign({on:false,istr:true,sstr:true,iob:true,sob:true,fvg:true,sw:true,zone:true},S.smc||{});
 $('tf').value=S.tf;tfBtns();$('startBal').value=S.startBal;
 for(const k in S.smc){const el=$('s_'+k);if(el){el.checked=S.smc[k];el.onchange=()=>{S.smc[k]=el.checked;save();if(B)B.smc=S.smc.on?computeSMC(B):null;dirty++}}}
 if(S.cur){await render();status('تمت متابعة الجلسة السابقة')}else await startAt(randStart());
 $('startDate').value=new Date(S.cur*1000).toISOString().slice(0,10);
 renderJournal();requestAnimationFrame(draw);ts.scrollToRealTime();}
$('bNext').onclick=stepNext;$('bDay').onclick=stepDay;
$('bPlay').onclick=()=>{if(playT)return stopPlay();$('bPlay').textContent='⏸ إيقاف';$('bPlay').classList.add('playing');playT=setInterval(stepNext,+$('speed').value)};
$('speed').onchange=()=>{if(playT){stopPlay();$('bPlay').click()}};
const tfBtns=()=>document.querySelectorAll('.tfb').forEach(b=>b.classList.toggle('on',b.dataset.tf===S.tf));
document.querySelectorAll('.tfb').forEach(b=>b.onclick=()=>{if(b.dataset.tf===S.tf)return;$('tf').value=b.dataset.tf;$('tf').onchange()});
$('tf').onchange=async()=>{S.tf=$('tf').value;tfBtns();await render();ts.scrollToRealTime();save()};
document.querySelectorAll('#draw [data-m]').forEach(b=>b.onclick=()=>setMode(b.dataset.m));
$('bClr').onclick=()=>{if(confirm('مسح كل الرسومات؟')){S.draw=[];save()}};
$('bSmc').onclick=()=>$('smcPanel').classList.toggle('hidden');
$('bBuy').onclick=()=>openPos('buy');$('bSell').onclick=()=>openPos('sell');
$('bClose').onclick=()=>{if(S.pos)closePos(S.price,'يدوي')};
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
window.GR={snapCtx,quiz:()=>LS('gr_quiz')||[],get S(){return S},get B(){return B},stepNext,openPos,closePos,journal};
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
function quizUI(){$('quizP').classList.toggle('hidden',!Q);if(!Q)return;$('qBias').textContent=Q.bias?('الاتجاه: '+(Q.bias==='up'?'صاعد ⬆':'هابط ⬇')):'اختر الاتجاه';}
$('bQuiz').onclick=async()=>{stopPlay();if(S.pos)return alert('أغلق الصفقة أولاً');await startAt(randStart());Q={bias:null};$('qE').value=S.price.toFixed(2);$('qSL').value='';$('qTP').value='';$('qRes').textContent='';quizUI();$('quizP').scrollIntoView();};
$('qUp').onclick=()=>{if(Q){Q.bias='up';quizUI()}};$('qDn').onclick=()=>{if(Q){Q.bias='down';quizUI()}};
$('qX').onclick=()=>{Q=null;quizUI()};
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
 Q.bias=null;save();};
// ---------- coach export ----------
function coachData(){const j=journal(),qs=LS('gr_quiz')||[],w=j.filter(t=>t.pnl>0).length,Rs=j.filter(t=>t.R!=null).map(t=>t.R);
 return {app:'gold-replay',v:1,exported:new Date().toISOString(),session:{cursor:ds(S.cur),tf:S.tf,startBalance:S.startBal,balance:S.balance,openPosition:S.pos},
  stats:{trades:j.length,winRate:j.length?+(w/j.length*100).toFixed(1):0,avgR:Rs.length?+(Rs.reduce((a,b)=>a+b,0)/Rs.length).toFixed(2):null,totalPnl:+j.reduce((a,t)=>a+t.pnl,0).toFixed(2),
   quizzes:qs.length,quizBiasAccuracy:qs.length?+(qs.filter(q=>q.biasCorrect).length/qs.length*100).toFixed(1):null},trades:j,quiz:qs};}
$('bCoach').onclick=()=>dl('gold-coach-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(coachData()),'application/json');
$('bCoachCopy').onclick=async()=>{const s=JSON.stringify(coachData());try{await navigator.clipboard.writeText(s);status('تم النسخ — الصقه في المحادثة')}catch(e){prompt('انسخ النص:',s)}};
$('bCoachShare').onclick=async()=>{const s=JSON.stringify(coachData());const f=new File([s],'gold-coach.json',{type:'application/json'});
 try{if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:'Gold coach'});else if(navigator.share)await navigator.share({text:s});else $('bCoach').click()}catch(e){}};
