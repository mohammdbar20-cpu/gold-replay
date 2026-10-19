// ================= PRO: costs, trade management, edge stats, ruin simulator, session templates =================
// Shares scope with app.js (concatenated at build).
const SPR_H=h=>h>=13&&h<=16?0.20:h>=7&&h<=12?0.25:h>=17&&h<=20?0.30:h>=21&&h<=22?0.60:0.40; // typical XAUUSD retail spread by UTC hour
const SWAP={buy:-45,sell:15}; // $ per lot per night (typical), Wednesday x3
function costCfg(){S.cost=Object.assign({on:true,mode:'auto',spread:0.30,comm:0,slip:0.05,swap:true},S.cost||{});return S.cost}
function spreadAt(t){const c=costCfg();return c.mode==='fixed'?c.spread:SPR_H(new Date(t*1000).getUTCHours())}
function swapNights(t0,t1){let n=0,b=Math.floor(t0/86400)*86400+21*3600;if(b<=t0)b+=86400;for(;b<=t1;b+=86400){const wd=new Date(b*1000).getUTCDay();if(wd===0||wd===6)continue;n+=wd===3?3:1}return n}
function tradeCost(p,tc,lots){const c=costCfg();if(!c.on)return {total:0,spread:0,slip:0,comm:0,swap:0};
 const sp=+(spreadAt(p.open)*OZ*lots).toFixed(2),sl=+(2*c.slip*OZ*lots).toFixed(2),cm=+((c.comm||0)*lots).toFixed(2),nights=c.swap?swapNights(p.open,tc):0,sw=+(-SWAP[p.side]*nights*lots).toFixed(2);
 return {total:+(sp+sl+cm+sw).toFixed(2),spread:sp,slip:sl,comm:cm,swap:sw,nights};}
function openCost(p){const c=costCfg();if(!c.on)return 0;return (spreadAt(p.open)+2*c.slip)*OZ*p.lots+(c.comm||0)*p.lots+(c.swap?-SWAP[p.side]*swapNights(p.open,S.cur)*p.lots:0)}
function costUI(){const c=costCfg();$('cOn').checked=c.on;$('cMode').value=c.mode;$('cSpread').value=c.spread;$('cComm').value=c.comm;$('cSlip').value=c.slip;$('cSwap').checked=c.swap;$('cSpread').disabled=c.mode!=='fixed';
 const sp=spreadAt(S.cur||Date.now()/1000);$('cInfo').textContent=c.on?('السبريد الآن ≈ '+sp.toFixed(2)+'$ · التكلفة/لوت ≈ '+((sp+2*c.slip)*OZ+(+c.comm||0)).toFixed(0)+'$ (+swap)'):'التكاليف متوقفة';}
['cOn','cMode','cSpread','cComm','cSlip','cSwap'].forEach(id=>{$(id).onchange=()=>{const c=costCfg();c.on=$('cOn').checked;c.mode=$('cMode').value;c.spread=+$('cSpread').value||0;c.comm=+$('cComm').value||0;c.slip=+$('cSlip').value||0;c.swap=$('cSwap').checked;save();costUI();updPos()}});
// ---------- trade management: breakeven / partial / trailing ----------
function trailUpd(M,i,p){if(!p.trail||p.sl==null)return;const d=p.side==='buy'?1:-1,dist=p.trail;
 const fav=d>0?M.h[i]-p.entry:p.entry-M.l[i];p.best=Math.max(p.best||0,fav);if(p.best<dist)return; // trailing starts after +1R
 const ns=+(d>0?p.entry+p.best-dist:p.entry-p.best+dist).toFixed(2);if(d>0?ns>p.sl:ns<p.sl){p.sl=ns;syncBox(p)}}
function syncBox(p){(S.draw||[]).forEach(d=>{if(d.type==='pos'&&d.st==='live'&&d.posId===p.id)d.sl=p.sl});dirty++}
function moveBE(p){if(p.sl==null)return;const d=p.side==='buy'?1:-1;if((S.price-p.entry)*d<=0)return alert('السعر لازم يكون بربح لتنقل الوقف للدخول');snap&&snap();p.be=true;p.sl=+p.entry.toFixed(2);syncBox(p);save();updLines();updPos();status('🔒 الوقف على الدخول (BE)')}
function halfClose(p){closePos(S.price,'جزئي 50%',null,p,0.5)}
function toggleTrail(p){if(p.sl==null)return;p.trail=p.trail?0:+Math.abs(p.entry-(p.sl0!=null?p.sl0:p.sl)).toFixed(2);save();updPos();status(p.trail?'⇢ وقف متحرك بعد +1R (مسافة '+p.trail+'$)':'وقف متحرك متوقف')}
function mgmtBind(){const f=(c,fn)=>document.querySelectorAll(c).forEach(b=>b.onclick=()=>{const p=S.ps.find(x=>String(x.id)===b.dataset.id);if(p)fn(p)});f('.pbe',moveBE);f('.phalf',halfClose);f('.ptrail',toggleTrail)}
// ---------- edge statistics ----------
function tradeR(t){if(t.R!=null)return t.R;const r=(t.bal0||S.startBal)*(S.riskPct||1)/100;return r?+(t.pnl/r).toFixed(2):0}
function edgeCalc(j){const R=j.map(tradeR),n=R.length;if(!n)return {n:0};const W=R.filter(x=>x>0),L=R.filter(x=>x<=0),E=R.reduce((a,b)=>a+b,0)/n;
 const sd=n>1?Math.sqrt(R.reduce((a,b)=>a+(b-E)*(b-E),0)/(n-1)):0;let eq=0,pk=0,dd=0,ls=0,cur=0;R.forEach(r=>{eq+=r;pk=Math.max(pk,eq);dd=Math.max(dd,pk-eq);cur=r<=0?cur+1:0;ls=Math.max(ls,cur)});
 const Rg=j.map(t=>t.Rg!=null?t.Rg:tradeR(t)),Eg=Rg.reduce((a,b)=>a+b,0)/n,ci=n>1?1.96*sd/Math.sqrt(n):null;
 return {n,winRate:+(100*W.length/n).toFixed(1),avgWin:W.length?+(W.reduce((a,b)=>a+b,0)/W.length).toFixed(2):null,avgLoss:L.length?+(-L.reduce((a,b)=>a+b,0)/L.length).toFixed(2):null,
  expectancy:+E.toFixed(3),expectancyGross:+Eg.toFixed(3),sd:+sd.toFixed(2),ci95:ci!=null?[+(E-ci).toFixed(2),+(E+ci).toFixed(2)]:null,maxDD_R:+dd.toFixed(2),longestLosingStreak:ls,
  totalCosts:+j.reduce((a,t)=>a+(t.cost||0),0).toFixed(2),estimatedR:j.filter(t=>t.R==null||t.Rest).length,tradesNeeded:E>0&&sd>0?Math.ceil(Math.pow(1.96*sd/E,2)):null,noEdge:n>=50&&E<=0};}
function edgeStats(j){const e=edgeCalc(j),el=$('edge');if(!el)return;if(!e.n){el.innerHTML='<div class="small">لا توجد صفقات بعد.</div>';return}
 const m30=Math.min(100,100*e.n/30),m100=Math.min(100,100*e.n/100),need=e.tradesNeeded,f=x=>x==null?'—':x;
 el.innerHTML='<div class="egrid"><div><small>Expectancy (صافي)</small><b class="'+(e.expectancy>0?'w':'l')+'">'+(e.expectancy>0?'+':'')+e.expectancy.toFixed(2)+'R</b></div><div><small>قبل التكاليف</small><b>'+(e.expectancyGross>0?'+':'')+e.expectancyGross.toFixed(2)+'R</b></div><div><small>نسبة الربح</small><b>'+e.winRate+'%</b></div><div><small>متوسط ربح / خسارة</small><b>'+f(e.avgWin)+' / '+f(e.avgLoss)+'R</b></div><div><small>أقصى تراجع</small><b>'+e.maxDD_R+'R</b></div><div><small>أطول سلسلة خسارة</small><b>'+e.longestLosingStreak+'</b></div><div><small>فترة ثقة 95%</small><b>'+(e.ci95?e.ci95[0]+' … '+e.ci95[1]+'R':'—')+'</b></div><div><small>التكاليف الكلية</small><b>'+e.totalCosts+'$</b></div></div>'+
 '<div class="meter"><div class="small">حجم العيّنة: <b>'+e.n+'</b> صفقة'+(need?' · لازمك تقريباً <b>'+need+'</b> صفقة لتحكم على ميزتك (95%)':'')+'</div><div class="mbar"><i style="width:'+m100+'%"></i><span style="left:30%"></span></div><div class="small mlab"><span>0</span><span>30</span><span>100</span></div></div>'+
 (e.n<30?'<div class="warn">⚠ عيّنة صغيرة جداً (أقل من 30): النتيجة فيها حظ كتير، ما في حكم بعد.</div>':e.n<100?'<div class="warn soft">⚠ أقل من 100 صفقة: حكم أولي بس.</div>':'')+
 (e.noEdge?'<div class="info">ℹ️ قاعدة «ما في ميزة»: بعد '+e.n+' صفقة الـexpectancy الصافي ≤ 0. الأفضل ترجع خطوة (replay/demo)، تعدّل شي واحد بس، وتقيس من جديد. (معلومة، مش قفل)</div>':'')+
 (e.estimatedR?'<div class="small">* '+e.estimatedR+' صفقة بدون وقف: الـR محسوب من نسبة المخاطرة '+(S.riskPct||1)+'%.</div>':'');}
// ---------- risk-of-ruin / losing-streak simulator ----------
function rng32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function ruinSim(wr,rr,risk,n,paths,seed){const r=rng32(seed||7),P=[],mdd=[],stk=[];let ruin=0,dd10=0,s6=0;
 for(let k=0;k<paths;k++){let eq=1,pk=1,dd=0,cur=0,st=0;const keep=k<40?[1]:null;
  for(let i=0;i<n;i++){const w=r()<wr/100;eq*=w?1+rr*risk/100:1-risk/100;pk=Math.max(pk,eq);dd=Math.max(dd,1-eq/pk);cur=w?0:cur+1;st=Math.max(st,cur);if(keep)keep.push(eq)}
  if(keep)P.push(keep);mdd.push(dd*100);stk.push(st);if(dd>=0.5)ruin++;if(dd>=0.1)dd10++;if(st>=6)s6++}
 const med=a=>{const b=a.slice().sort((x,y)=>x-y);return b[Math.floor(b.length/2)]};
 return {paths:P,p_dd10:+(100*dd10/paths).toFixed(1),p_ruin:+(100*ruin/paths).toFixed(1),median_mdd:+med(mdd).toFixed(1),median_streak:med(stk),p_streak6:+(100*s6/paths).toFixed(1),expectancy:+((wr/100)*rr-(1-wr/100)).toFixed(2)};}
function openModal(html,cls){const m=$('modal');m.className=cls||'';m.innerHTML='<div class="mbox">'+html+'</div>';m.classList.remove('hidden');m.onclick=e=>{if(e.target===m)closeModal()};const x=m.querySelector('.mx');if(x)x.onclick=closeModal;return m}
function closeModal(){const m=$('modal');m.classList.add('hidden');m.innerHTML=''}
function openRuin(def){def=Object.assign({wr:45,rr:1.5,risk:1,n:100},def||{});
 const inp=(id,l,v,mn,mx,st)=>'<label class="rs"><span>'+l+'</span><input type="range" id="'+id+'R" min="'+mn+'" max="'+mx+'" step="'+st+'" value="'+v+'"><input type="number" id="'+id+'" min="'+mn+'" max="'+mx+'" step="'+st+'" value="'+v+'"></label>';
 openModal('<div class="mh"><b>🎲 محاكي السلاسل والإفلاس (Monte Carlo)</b><button class="mx">✕</button></div>'+inp('rsW','نسبة الربح %',def.wr,20,80,1)+inp('rsRR','R:R',def.rr,0.5,4,0.1)+inp('rsK','مخاطرة % بالصفقة',def.risk,0.25,10,0.25)+inp('rsN','عدد الصفقات',def.n,20,500,10)+
  '<canvas id="rsC"></canvas><div id="rsOut" class="egrid"></div><div class="small">2000 مسار بترتيب عشوائي لنفس الإحصاءات. الخطوط = 40 مسار؛ الأحمر = حد −10%.</div>','ruin');
 const ids=['rsW','rsRR','rsK','rsN'];ids.forEach(id=>{$(id+'R').oninput=()=>{$(id).value=$(id+'R').value;run()};$(id).oninput=()=>{$(id+'R').value=$(id).value;run()}});
 function run(){const s=ruinSim(+$('rsW').value,+$('rsRR').value,+$('rsK').value,Math.round(+$('rsN').value),2000,7);window.__ruin=s;
  const c=$('rsC'),dp=devicePixelRatio||1,W=c.clientWidth||300,H=200;c.width=W*dp;c.height=H*dp;const g=c.getContext('2d');g.scale(dp,dp);g.fillStyle='#0b0b10';g.fillRect(0,0,W,H);
  let mn=1,mx=1;s.paths.forEach(p=>p.forEach(v=>{mn=Math.min(mn,v);mx=Math.max(mx,v)}));mn=Math.min(mn,0.88);const y=v=>H-8-(v-mn)/((mx-mn)||1)*(H-16),n=s.paths[0].length;
  g.strokeStyle='#f2364580';g.setLineDash([4,4]);g.beginPath();g.moveTo(0,y(0.9));g.lineTo(W,y(0.9));g.stroke();g.setLineDash([]);
  s.paths.forEach((p,k)=>{g.strokeStyle=p[p.length-1]>=1?'rgba(154,252,65,.45)':'rgba(242,54,69,.45)';g.lineWidth=1;g.beginPath();p.forEach((v,i)=>{const X=i*(W-4)/(n-1)+2;i?g.lineTo(X,y(v)):g.moveTo(X,y(v))});g.stroke()});
  g.strokeStyle='#888';g.beginPath();g.moveTo(0,y(1));g.lineTo(W,y(1));g.stroke();
  $('rsOut').innerHTML='<div><small>Expectancy</small><b class="'+(s.expectancy>0?'w':'l')+'">'+s.expectancy+'R</b></div><div><small>احتمال تراجع ≥10%</small><b>'+s.p_dd10+'%</b></div><div><small>احتمال خسارة نص الحساب</small><b>'+s.p_ruin+'%</b></div><div><small>أقصى تراجع (وسيط)</small><b>'+s.median_mdd+'%</b></div><div><small>أطول سلسلة خسارة (وسيط)</small><b>'+s.median_streak+'</b></div><div><small>احتمال 6 خسارات ورا بعض</small><b>'+s.p_streak6+'%</b></div>';}
 requestAnimationFrame(run);}
// ---------- session templates (optional) ----------
function atrNowTf(){if(!B||B.n<15)return null;let s=0;for(let i=B.n-14;i<B.n;i++){const pc=B.C[i-1];s+=Math.max(B.H[i]-B.L[i],Math.abs(B.H[i]-pc),Math.abs(B.L[i]-pc))}return +(s/14).toFixed(2)}
function plans(){return LS('gr_plans')||[]}
function openTemplate(kind,onSave){kind=kind||'plan';const sel=(id,o)=>'<select id="'+id+'">'+o.map(x=>'<option value="'+x[0]+'">'+x[1]+'</option>').join('')+'</select>';
 const P='<label>اتجاه D1 '+sel('tpBias',[['up','صاعد'],['down','هابط'],['range','عرضي']])+'</label><label>مستويات H4 <input id="tpLv" placeholder="مثلاً 2350 / 2372"></label><label>الـRegime '+sel('tpReg',[['trend','ترند'],['range','رينج']])+sel('tpVol',[['normal','تقلب طبيعي'],['high','تقلب عالي'],['low','تقلب واطي']])+'</label><label>أخبار اليوم '+sel('tpNews',[['ok','يوم عادي'],['danger','يوم خبر ← ما في تداول']])+'</label><label>ATR ('+S.tf+') <input id="tpAtr" value="'+(atrNowTf()??'')+'"></label><label>إذا… بعمل… <input id="tpIf" placeholder="إذا السعر رجع لـ… وعمل… بدخل… الوقف…"></label>';
 const Rv='<label>التزمت بالقواعد؟ '+sel('tpOk',[['yes','نعم'],['partly','جزئياً'],['no','لا']])+'</label><label>نوع الغلطة '+sel('tpErr',[['none','ما في'],['rule','قاعدة'],['exec','تنفيذ'],['analysis','تحليل']])+'</label><label>درس واحد <input id="tpLes" placeholder="شو رح تعمل غير المرة الجاية؟"></label>';
 const last=plans().slice(-4).reverse().map(p=>'<div class="tpl-item"><b>'+(p.type==='plan'?'📝':'🔍')+' '+p.replay+'</b> '+(p.type==='plan'?(p.bias+' · '+p.regime+' · '+(p.ifthen||'')):(p.ok+' · '+p.err+' · '+(p.lesson||'')))+'</div>').join('');
 openModal('<div class="mh"><b>📝 خطة / مراجعة (اختياري)</b><button class="mx">✕</button></div><div class="seg tps"><button data-k="plan" class="'+(kind==='plan'?'on':'')+'">قبل الجلسة</button><button data-k="review" class="'+(kind==='review'?'on':'')+'">بعد الجلسة</button></div><div class="tpf">'+(kind==='plan'?P:Rv)+'</div><button id="tpSave" class="cs-go">💾 حفظ</button><div class="small">'+(last?'آخر الإدخالات:':'')+'</div>'+last,'tpl');
 document.querySelectorAll('.tps button').forEach(b=>b.onclick=()=>openTemplate(b.dataset.k,onSave));
 $('tpSave').onclick=()=>{const v=id=>($(id)||{}).value||'';const rec=kind==='plan'?{type:'plan',bias:v('tpBias'),levels:v('tpLv'),regime:v('tpReg')+'/'+v('tpVol'),news:v('tpNews'),atr:v('tpAtr'),ifthen:v('tpIf')}:{type:'review',ok:v('tpOk'),err:v('tpErr'),lesson:v('tpLes')};
  rec.replay=ds(S.cur);rec.at=new Date().toISOString();rec.tf=S.tf;if(window.__course)rec.course=true;const a=plans();a.push(rec);localStorage.setItem('gr_plans',JSON.stringify(a.slice(-200)));closeModal();status('✔ انحفظ');if(onSave)onSave(rec)};}
$('bRuin').onclick=()=>openRuin();$('bPlan').onclick=()=>openTemplate('plan');
// coach export additions
{const base=coachData;coachData=function(){const o=base();const j=journal();o.edgeStats=edgeCalc(j);o.costs=costCfg();o.sessionTemplates=plans();o.course=(()=>{const c=LS('gr_course');return c?{xp:c.xp,streak:c.streak,done:Object.keys(c.done||{}).length,boss:c.boss,series:c.series||null}:null})();o.management=j.filter(t=>t.be||t.trail||t.partial).length;return o}}
