// ================= COURSE (test-first, gamified) =================
// Shares scope with app.js (concatenated at build). Course progress lives in localStorage 'gr_course';
// the main session (gr_session/journal) is never written while the course is open.
let CRS=null,CP=null,CMAIN=null,CITEM=null,CSTATE=null;
const L_=()=>(window.I18N&&I18N.de())?'de':'ar';
const TX=o=>o==null?'':(typeof o==='string'?o:(o[L_()]||o.ar||''));
function cpLoad(){CP=LS('gr_course')||{done:{},xp:0,streak:{day:'',n:0},cur:null,boss:{}};CP.done=CP.done||{};CP.boss=CP.boss||{};}
function cpSave(){localStorage.setItem('gr_course',JSON.stringify(CP))}
const berlinDay=()=>{const p={};fmt.formatToParts(new Date()).forEach(x=>p[x.type]=x.value);return p.year+'-'+p.month+'-'+p.day};
function bumpStreak(){const d=berlinDay();if(CP.streak.day===d)return;const y=new Date(Date.parse(d+'T12:00:00Z')-86400000).toISOString().slice(0,10);CP.streak.n=CP.streak.day===y?CP.streak.n+1:1;CP.streak.day=d;CP.xp+=Math.min(50,5*CP.streak.n);}
function modItems(m){return m.path}
function modPassed(m){const b=CP.boss[m.id];return !!(b&&b.passed)}
function modUnlocked(m){const r=m.unlock&&m.unlock.requires;if(!r)return true;if(CP.boss[m.id]||m.path.concat(m.boss.items).some(e=>CP.done[e.id]))return true; // progress migration: keep modules the user already started
const pm=CRS.modules.find(x=>x.id===r);return pm?modPassed(pm):true}
function pathDone(m){return m.path.every(e=>CP.done[e.id])}
const cardMap={};
async function courseLoad(){if(CRS)return;CRS=await (await fetch('data/course.json')).json();
 CRS.modules.forEach(m=>m.path.concat(m.boss.items).forEach(e=>{const c=e.reveal&&e.reveal.concept_card;if(c&&c.title)cardMap[c.lesson]=c;(e.reveal&&e.reveal.extra_cards||[]).forEach(x=>{if(x.title)cardMap[x.lesson]=cardMap[x.lesson]||x})}));}
// ---------- enter / exit ----------
async function courseOpen(){stopPlay();if(Q){Q=null;quizUI()}
 if(!window.__course){CMAIN=JSON.stringify(S);window.__course=true;document.body.classList.add('course');}
 cpLoad();$('courseView').classList.remove('hidden');$('cSheet').classList.add('hidden');$('courseView').innerHTML='<div class="cv-load">…</div>';
 await courseLoad();courseMap();}
async function courseExit(){stopPlay();window.__course=false;window.__courseStep=false;document.body.classList.remove('course','course-step');$('courseView').classList.add('hidden');$('cSheet').classList.add('hidden');
 if(CMAIN){const o=JSON.parse(CMAIN);Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,o);CMAIN=null}
 sel=-1;pend=null;mode='none';setMode('none');select(-1);$('tf').value=S.tf;tfBtns();applyScale();macdUI();emaUI();mPrev=null;emaPrev=null;
 await render();renderJournal();updPos();updLines();dirty++;ts.scrollToRealTime();}
// ---------- map ----------
function courseMap(openMod){const lv=CRS.gamification.graduation.levels;const passed=CRS.modules.filter(modPassed).length;
 const curLevel=CRS.modules.reduce((a,m)=>modPassed(m)?m.level:a,0);
 let h='<div class="cv-top"><button id="cvBack" class="cv-x">✕</button><div class="cv-title">🎓 '+TX(CRS.title)+'</div><div class="cv-stats"><span title="XP">⚡ '+CP.xp+'</span><span title="streak">🔥 '+CP.streak.n+'</span><span>🏅 '+(curLevel?TX(lv[curLevel]):'—')+'</span></div></div>';
 if(CP.cur){h+='<button id="cvCont" class="cv-cont">▶ متابعة من حيث توقفت</button>'}
 h+='<div class="cv-path">';
 CRS.modules.forEach((m,mi)=>{const un=modUnlocked(m),dn=m.path.filter(e=>CP.done[e.id]).length,stars=m.path.reduce((a,e)=>a+((CP.done[e.id]||{}).stars||0),0),bp=modPassed(m);
  h+='<div class="cv-mod '+(un?'':'locked ')+(bp?'passed ':'')+'" data-m="'+mi+'"><div class="cv-mh"><span class="cv-num">'+(un?(bp?'✓':m.order):'🔒')+'</span><div><div class="cv-lv">'+TX(m.level_name)+' · '+(L_()==='de'?'Modul ':'وحدة ')+m.order+'</div><b>'+TX(m.title)+'</b><div class="cv-prog"><i style="width:'+(m.path.length?100*dn/m.path.length:(bp?100:0))+'%"></i></div><small>'+dn+'/'+m.path.length+' · ⭐ '+stars+'/'+(m.path.length*3)+'</small></div></div>';
  if(openMod===mi&&un){h+='<div class="cv-nodes">'+m.path.map((e,i)=>{const d=CP.done[e.id];const avail=i===0||CP.done[m.path[i-1].id]||d;
    return '<button class="cv-node '+(d?'done':'')+(avail?'':' lock')+(e.kind==='guided'?' guided':'')+'" style="margin-inline-start:'+(30+40*Math.sin(i*1.1))+'px" data-i="'+i+'" '+(avail?'':'disabled')+'><span>'+(d?'★'.repeat(d.stars)+'☆'.repeat(3-d.stars):(e.kind==='guided'?'💡':'🎯'))+'</span><small>'+(i+1)+'</small></button>'}).join('')+
   '<button class="cv-node boss'+(pathDone(m)?'':' lock')+(bp?' done':'')+'" data-b="1" '+(pathDone(m)?'':'disabled')+'><span>👑</span><small>'+TX(m.boss.title)+'</small></button>'+
   '<button class="cv-learn" data-l="'+mi+'">📖 الدروس</button></div>'}
  h+='</div>';});
 h+='</div>';$('courseView').innerHTML=h;$('courseView').scrollTop=0;
 $('cvBack').onclick=courseExit;if($('cvCont'))$('cvCont').onclick=()=>{const c=CP.cur,m=CRS.modules[c.m];if(c.boss)bossStart(c.m,c.i);else itemStart(c.m,c.i)};
 document.querySelectorAll('.cv-mod').forEach(d=>d.querySelector('.cv-mh').onclick=()=>{const mi=+d.dataset.m;if(!modUnlocked(CRS.modules[mi]))return;courseMap(openMod===mi?null:mi);const el=document.querySelector('.cv-mod[data-m="'+mi+'"]');if(el)el.scrollIntoView({block:'start'})});
 document.querySelectorAll('.cv-node[data-i]').forEach(b=>b.onclick=()=>itemStart(openMod,+b.dataset.i));
 document.querySelectorAll('.cv-node[data-b]').forEach(b=>b.onclick=()=>bossStart(openMod,0));
 document.querySelectorAll('.cv-learn').forEach(b=>b.onclick=()=>learnMore(+b.dataset.l));}
function learnMore(mi){const m=CRS.modules[mi];let h='<div class="cv-top"><button id="cvBk" class="cv-x">←</button><div class="cv-title">📖 '+TX(m.title)+'</div></div><div class="cv-lessons">';
 (m.lessons_reference||[]).forEach(l=>{h+='<div class="cv-card"><h4>'+TX(l.title)+'</h4>'+(l.objectives?'<ul>'+(l.objectives[L_()]||[]).map(x=>'<li>'+x+'</li>').join('')+'</ul>':'')+'<p>'+TX(l.text)+'</p>'+(l.key_points?'<b>✔</b><ul>'+(l.key_points[L_()]||[]).map(x=>'<li>'+x+'</li>').join('')+'</ul>':'')+(l.common_mistakes?'<b>⚠</b><ul>'+(l.common_mistakes[L_()]||[]).map(x=>'<li>'+x+'</li>').join('')+'</ul>':'')+'</div>'});
 $('courseView').innerHTML=h+'</div>';$('cvBk').onclick=()=>courseMap(mi);}
// ---------- item play ----------
async function showItemChart(e){S.draw=[];S.ps=[];S.tf=e.tf;$('tf').value=e.tf;tfBtns();sel=-1;pend=null;
 const c=await lastM1Before(e.start_ts+TFS[e.tf]);S.cur=c==null?e.start_ts:c;mPrev=null;emaPrev=null;await render();ts.scrollToRealTime();dirty++;}
async function itemStart(mi,i,boss){const m=CRS.modules[mi],e=boss?m.boss.items[i]:m.path[i];CITEM={e,mi,i,boss:!!boss,tries:(CP.done[e.id]||{}).tries||0};
 CP.cur={m:mi,i,boss:!!boss};cpSave();$('courseView').classList.add('hidden');
 if(e.task==='trade_series')return seriesStart();
 if(e.nochart){window.__courseStep=false;document.body.classList.remove('course-step');sheetTask();return}
 window.__courseStep=e.task==='identify_candle';document.body.classList.toggle('course-step',window.__courseStep);
 await showItemChart(e);sheetTask();}
function bossStart(mi,i){CSTATE={mi,scores:[],t0:Date.now()};itemStart(mi,i,true)}
function lastDraw(type){for(let i=S.draw.length-1;i>=0;i--)if(S.draw[i].type===type)return S.draw[i];return null}
let bossTimer=null;
function sheetTask(){const e=CITEM.e,sh=$('cSheet');sh.classList.remove('hidden');sh.classList.toggle('cs-full',!!e.nochart);clearInterval(bossTimer);CITEM.skip=false;
 let h='<div class="cs-head"><button id="csMap" class="cv-x">✕</button><span class="cs-kind">'+(CITEM.boss?'👑 '+TX(CRS.modules[CITEM.mi].boss.title)+' '+(CITEM.i+1)+'/'+CRS.modules[CITEM.mi].boss.items.length:(e.kind==='guided'?'💡':'🎯')+' '+(CITEM.i+1)+'/'+CRS.modules[CITEM.mi].path.length)+'</span><span class="cs-diff">'+e.tf+' · '+'🔥'.repeat(e.difficulty)+'</span><span id="csTimer"></span></div>';
 if(e.scenario)h+='<div class="cs-scn">📉 خسارات اليوم: '+e.scenario.losses_today+' · '+e.scenario.day_R+'R</div>';
 h+='<div class="cs-prompt">'+TX(e.prompt)+'</div><div class="cs-ans">';
 if(e.tool==='ruin')h+='<button class="cs-tool" id="csRuin">🎲 افتح المحاكي</button>';
 if(e.tool==='manage')h+='<button class="cs-tool" id="csMan">📊 جدول المقارنة</button>';
 if(e.task==='template')h+='<button class="cs-tool" id="csTpl">📝 افتح النموذج</button><div class="small">اختياري: بتقدر تتخطّاه.</div>';
 const t=e.task;
 if(t==='read_price'||t==='calc_number')h+='<input id="csNum" type="number" step="0.01" inputmode="decimal" placeholder="0.00">';
 if(t==='mark_level'||t==='mark_level_and_choose')h+='<button class="cs-tool" data-tool="hline">— علّم المستوى على الشارت</button><div id="csRead" class="small"></div>';
 if(t==='mark_zone')h+='<button class="cs-tool" data-tool="hline">— ارسم خطين: أعلى وأدنى المنطقة</button><div id="csRead" class="small"></div>';
 if(t==='place_position'&&false)h+='<div class="row"><button class="cs-tool" data-tool="long">📈 شراء</button><button class="cs-tool" data-tool="short">📉 بيع</button></div><div class="small">اسحب مقابض المربع لضبط الدخول والوقف والهدف</div><div id="csRead" class="small"></div>';
 if(t==='identify_candle')h+='<div class="small">استخدم ▶| أو ▶️ للتقدم ثم اضغط "هنا"</div>';
 if(e.choices)h+='<div class="cs-choices">'+e.choices.map(c=>'<button class="cs-ch" data-k="'+c.key+'">'+TX(c)+'</button>').join('')+'</div>';
 if(t==='fill_sentence')h+='<div class="cs-fill"><select id="csB1"><option value="">___</option>'+e.blank1_options.map((o,i)=>'<option value="'+i+'">'+TX(o)+'</option>').join('')+'</select><select id="csB2"><option value="">___</option>'+e.blank2_options.map((o,i)=>'<option value="'+i+'">'+TX(o)+'</option>').join('')+'</select></div>';
 if(t==='place_position')h+='<div class="row"><button class="cs-tool" data-tool="long">📈 شراء</button><button class="cs-tool" data-tool="short">📉 بيع</button></div><div class="small">اسحب مقابض المربع لضبط الدخول والوقف والهدف</div><div id="csRead" class="small"></div>';
 h+='</div><div class="cs-act">'+(e.kind==='guided'&&CITEM.tries>0&&e.hint&&!CITEM.boss?'<div class="cs-hint">💡 '+TX(e.hint)+'</div>':'')+(t==='template'?'<button id="csSkip" class="cs-skip">⏭ تخطّي</button>':'<button id="csGo" class="cs-go">'+(t==='identify_candle'?'📍 هنا':'✔ تحقّق')+'</button>')+(e.skip_allowed?'<button id="csSkip" class="cs-skip">⏭ ما في صفقة (Skip)</button>':'')+'</div>';
 sh.innerHTML=h;
 $('csMap').onclick=()=>{clearInterval(bossTimer);$('cSheet').classList.add('hidden');setMode('none');courseMap(CITEM.mi);$('courseView').classList.remove('hidden')};
 document.querySelectorAll('.cs-tool').forEach(b=>b.onclick=()=>{if(mode!==b.dataset.tool)setMode(b.dataset.tool);scrollTo(0,0)});
 document.querySelectorAll('.cs-ch').forEach(b=>b.onclick=()=>{document.querySelectorAll('.cs-ch').forEach(x=>x.classList.toggle('on',x===b));CITEM.key=b.dataset.k;gate()});
 ['csB1','csB2','csS1','csS2','csNum'].forEach(id=>{const el=$(id);if(el)el.oninput=el.onchange=gate});
 if($('csGo'))$('csGo').onclick=()=>submitItem();gate();
 if($('csSkip'))$('csSkip').onclick=()=>{if(t==='template'){CP.cur=null;cpSave();return nextItem()}CITEM.skip=true;submitItem()};
 if($('csRuin'))$('csRuin').onclick=()=>openRuin(e.sim);
 if($('csMan'))$('csMan').onclick=()=>manageTable();
 if($('csTpl'))$('csTpl').onclick=()=>openTemplate(e.template,()=>{CITEM.tplSaved=true;submitItem()});
 if(e.timer_s&&!CITEM.boss){const end=Date.now()+e.timer_s*1000;bossTimer=setInterval(()=>{const r=Math.max(0,Math.round((end-Date.now())/1000));const el=$('csTimer');if(el)el.textContent='⏱ '+r+'s';if(r<=0){clearInterval(bossTimer);submitItem(true)}},250)}
 if(CITEM.boss){const tl=CRS.modules[CITEM.mi].boss.timer_s_per_item||90,end=Date.now()+tl*1000;bossTimer=setInterval(()=>{const r=Math.max(0,Math.round((end-Date.now())/1000));const el=$('csTimer');if(el)el.textContent='⏱ '+r+'s';if(r<=0){clearInterval(bossTimer);submitItem(true)}},500)}}
function gate(){const e=CITEM.e,go=$('csGo');if(!go)return;let ok=true;
 if(e.task==='fill_sentence')ok=$('csB1').value!==''&&$('csB2').value!=='';
 go.disabled=!ok;}
// live read-out of the user's chart answer
setInterval(()=>{if(!window.__course||!CITEM||!$('csRead'))return;const t=CITEM.e.task;let s='';
 if(t==='mark_level'||t==='mark_level_and_choose'){const d=lastDraw('hline');s=d?('= '+d.a.p.toFixed(2)):''}
 if(t==='mark_zone'){const hs=S.draw.filter(d=>d.type==='hline').slice(-2);s=hs.length===2?(Math.min(hs[0].a.p,hs[1].a.p).toFixed(2)+' – '+Math.max(hs[0].a.p,hs[1].a.p).toFixed(2)):(hs.length+'/2')}
 if(t==='place_position'){const d=lastDraw('pos');s=d?((d.side==='buy'?'▲ ':'▼ ')+d.e.toFixed(2)+' | SL '+d.sl.toFixed(2)+' | TP '+d.tp.toFixed(2)):''}
 const el=$('csRead');if(el&&el.textContent!==s)el.textContent=s;},400);
function numScore(x,ans,tol){if(x==null||!isFinite(x))return 0;const d=Math.abs(x-ans);return d<=tol?1:d<=2*tol?.5:0}
function scoreItem(){const e=CITEM.e,a=e.answer,t=e.task,tol=(e.tolerance&&e.tolerance.abs)||0;const ua={};let sc=0;
 if(t==='read_price'||t==='calc_number'){const v=num('csNum');ua.value=v;sc=numScore(v,a.price!=null?a.price:a.value,tol)}
 else if(t==='choose'){ua.key=CITEM.key;sc=CITEM.key===a.key?1:0}
 else if(t==='mark_level'){const d=lastDraw('hline');ua.price=d&&d.a.p;sc=numScore(ua.price,a.price,tol)}
 else if(t==='mark_level_and_choose'){const d=lastDraw('hline');ua.price=d&&d.a.p;ua.key=CITEM.key;sc=.5*numScore(ua.price,a.price,tol)+.5*(CITEM.key===a.key?1:0)}
 else if(t==='mark_zone'){const hs=S.draw.filter(d=>d.type==='hline').slice(-2);if(hs.length===2){ua.low=Math.min(hs[0].a.p,hs[1].a.p);ua.high=Math.max(hs[0].a.p,hs[1].a.p);sc=.5*numScore(ua.low,a.low,tol)+.5*numScore(ua.high,a.high,tol)}}
 else if(t==='identify_candle'){const tb=B.U[B.n-1];ua.ts=tb;const bars=Math.round(Math.abs(tb-a.ts)/TFS[e.tf]);sc=bars<=((e.tolerance&&e.tolerance.bars)||0)?1:bars<=2*((e.tolerance&&e.tolerance.bars)||1)?.5:0}
 else if(t==='fill_sentence'){ua.b1=+$('csB1').value;ua.b2=+$('csB2').value;sc=.5*(ua.b1===a.blank1?1:0)+.5*(ua.b2===a.blank2?1:0)}
 else if(t==='template'){sc=CITEM.tplSaved?1:0}
 else if(t==='place_position'&&CITEM.skip){ua.skip=true;sc=a.action==='skip'?1:0.3}
 else if(t==='place_position'&&a.action==='skip'){ua.order=true;sc=0}
 else if(t==='place_position'){const d=lastDraw('pos');if(d){const side=d.side==='buy'?'long':'short';ua.side=side;ua.entry=d.e;ua.sl=d.sl;ua.tp=d.tp;
   if(side===a.side){const z=(e.tolerance&&e.tolerance.entry_zone)||a.zone,atr=(e.tolerance&&e.tolerance.atr)||0,lo=Math.min(z[0],z[1]),hi=Math.max(z[0],z[1]);
    const inZ=d.e>=lo-atr*.1&&d.e<=hi+atr*.1;const beyond=side==='long'?(d.sl<lo&&d.sl>=lo-1.5*atr):(d.sl>hi&&d.sl<=hi+1.5*atr);const rr=Math.abs(d.tp-d.e)/(Math.abs(d.e-d.sl)||1);
    sc=(inZ?.4:0)+(beyond?.3:0)+(rr>=2-1e-9&&(side==='long'?d.tp>d.e:d.tp<d.e)?.3:0)}}}
 return {sc:Math.round(sc*100)/100,ua};}
async function submitItem(timeout){clearInterval(bossTimer);const e=CITEM.e;const {sc,ua}=scoreItem();setMode('none');
 const first=!CITEM.tries;let stars=sc>=1&&first?3:((sc>=.5&&first)||sc>=1)?2:1;if(e.kind==='guided')stars=Math.min(stars,2);
 const prev=CP.done[e.id]||{},xp=Math.round(e.xp*stars/3);
 if(!CITEM.boss){CP.done[e.id]={stars:Math.max(stars,prev.stars||0),score:Math.max(sc,prev.score||0),tries:(prev.tries||0)+1,last:new Date().toISOString(),ans:ua};CP.xp+=xp;bumpStreak();}
 else{if(!CSTATE||CSTATE.mi!==CITEM.mi)CSTATE={mi:CITEM.mi,scores:[],t0:Date.now()};CSTATE.scores.push(sc);CP.xp+=Math.round(e.xp*sc);bumpStreak();}
 cpSave();
 // reveal on chart: answer marks + future candles
 const a=e.answer,ac='#9afc41';
 if(a.price!=null&&e.task!=='read_price')S.draw.push({type:'hline',a:{t:S.cur,p:a.price},color:ac,lw:2,ls:1});
 if(a.low!=null){S.draw.push({type:'hline',a:{t:S.cur,p:a.low},color:ac,ls:1});S.draw.push({type:'hline',a:{t:S.cur,p:a.high},color:ac,ls:1});}
 if(e.task==='place_position')S.draw.push({type:'pos',side:a.side==='long'?'buy':'sell',t:S.cur,t2:S.cur+TFS[e.tf]*25,e:a.entry,sl:a.sl,tp:a.tp,st:'draft'});
 dirty++;
 if(e.nochart){return sheetReveal(sc,stars,xp,timeout)}
 if(e.task!=='identify_candle'){busy=true;try{for(let k=0;k<20;k++){const nt=await targetNext();if(nt==null)break;S.cur=nt;await render();}}finally{busy=false}}
 if(e.task==='identify_candle'){const c=await lastM1Before(a.ts+TFS[e.tf]);if(c)S.draw.push({type:'hline',a:{t:S.cur,p:B.C[B.n-1]},color:ac,ls:1})}
 dirty++;sheetReveal(sc,stars,xp,timeout);}
function cardHtml(c){if(!c)return '';if(c.ref&&!c.title)c=cardMap[c.lesson]||c;if(!c.title)return '';
 return '<div class="cv-card concept"><h4>🧠 '+TX(c.title)+'</h4><ul>'+((c.lines&&c.lines[L_()])||[]).map(x=>'<li>'+x+'</li>').join('')+'</ul>'+(c.watch_out?'<div class="cv-watch">⚠ '+TX(c.watch_out)+'</div>':'')+(c.more?'<details><summary>المزيد</summary><p>'+TX(c.more)+'</p></details>':'')+'</div>';}
function sheetReveal(sc,stars,xp,timeout){const e=CITEM.e,r=e.reveal||{},pct=Math.round(sc*100);
 let h='<div class="cs-head"><button id="csMap" class="cv-x">✕</button><span class="cs-res '+(sc>=1?'ok':sc>0?'mid':'bad')+'">'+(sc>=1?'✅ ممتاز':sc>0?'🟡 جزئياً':'❌ ليس هذه المرة')+' · '+pct+'%</span>'+(CITEM.boss?'':'<span class="cs-stars">'+'★'.repeat(stars)+'☆'.repeat(3-stars)+'</span><span class="cs-xp">+'+xp+' XP</span>')+'</div>';
 if(timeout)h+='<div class="small">⏱ انتهى الوقت</div>';
 h+='<div class="cs-expl">📘 '+TX(r.explanation)+'</div>'+cardHtml(r.concept_card)+(r.extra_cards||[]).map(cardHtml).join('');
 h+='<div class="cs-act"><button id="csNext" class="cs-go">التالي ←</button></div>';
 $('cSheet').innerHTML=h;$('csMap').onclick=()=>{$('cSheet').classList.add('hidden');courseMap(CITEM.mi);$('courseView').classList.remove('hidden')};
 $('csNext').onclick=nextItem;}
function nextItem(){const m=CRS.modules[CITEM.mi];
 if(CITEM.boss){if(CITEM.i+1<m.boss.items.length)return itemStart(CITEM.mi,CITEM.i+1,true);
  const avg=Math.round(100*CSTATE.scores.reduce((a,b)=>a+b,0)/CSTATE.scores.length),pass=avg>=(m.boss.pass_pct||80);
  const b=CP.boss[m.id]||{};b.best=Math.max(b.best||0,avg);b.passed=b.passed||pass;b.tries=(b.tries||0)+1;CP.boss[m.id]=b;if(pass)CP.xp+=(m.boss.on_pass&&m.boss.on_pass.xp_bonus)||100;
  const nm=CRS.modules[CITEM.mi+1];CP.cur=pass&&nm?{m:CITEM.mi+1,i:0,boss:!nm.path.length}:{m:CITEM.mi,i:0,boss:true};cpSave();
  $('cSheet').innerHTML='<div class="cs-boss '+(pass?'ok':'bad')+'"><div class="cs-big">'+(pass?'🏆':'💪')+'</div><b>'+(pass?'نجحت في تحدّي الزعيم!':'لم تنجح بعد — راجع وحاول لاحقاً')+'</b><div>'+avg+'% / '+(m.boss.pass_pct||80)+'%</div>'+(pass&&m.boss.on_pass&&m.boss.on_pass.badge?'<div>🏅 '+TX(m.boss.on_pass.badge)+'</div>':'')+'<button id="csDone" class="cs-go">الخريطة</button></div>';
  $('csDone').onclick=()=>{$('cSheet').classList.add('hidden');courseMap(pass&&nm?CITEM.mi+1:CITEM.mi);$('courseView').classList.remove('hidden')};return;}
 if(CITEM.i+1<m.path.length)return itemStart(CITEM.mi,CITEM.i+1);
 CP.cur={m:CITEM.mi,i:0,boss:true};cpSave();$('cSheet').classList.add('hidden');courseMap(CITEM.mi);$('courseView').classList.remove('hidden');}
$('bCourse').onclick=courseOpen;
window.GRC={get CP(){return CP},get item(){return CITEM},open:courseOpen,exit:courseExit,itemStart,bossStart,map:courseMap,get crs(){return CRS}};
// ---------- management comparison table (mm module) ----------
function manageTable(){const st=CRS.stats&&CRS.stats.manage;if(!st)return;const N={fixed:'ثابت 2R',be:'Breakeven عند +1R',partial:'نص عند +1R',trail:'Trailing بعد +1R'};
 openModal('<div class="mh"><b>📊 50 صفقة OB حقيقية (صافي بعد التكاليف)</b><button class="mx">✕</button></div><table class="mtab"><tr><th></th><th>متوسط R</th><th>ربح %</th><th>مجموع R</th><th>Max DD</th></tr>'+
  Object.keys(st).map(k=>'<tr><td>'+N[k]+'</td><td class="'+(st[k].avgR>0?'w':'l')+'">'+st[k].avgR+'</td><td>'+st[k].win_pct+'</td><td>'+st[k].total+'</td><td>'+st[k].maxDD+'</td></tr>').join('')+'</table><div class="small">الصفقات منتقاة بدون ما نشوف النتيجة. عيّنة 50 = مؤشر، مش قانون.</div>','tpl');}
// ---------- final exam: 20-trade series on random ordinary days ----------
function serState(){CP.serState=CP.serState||{k:0,res:[]};return CP.serState}
async function seriesStart(){const st=serState();if(st.k>=CITEM.e.days.length){st.k=0;st.res=[]}cpSave();await seriesDay()}
async function seriesDay(){const e=CITEM.e,st=serState(),day=e.days[st.k];window.__courseStep=false;document.body.classList.remove('course-step');
 await showItemChart({tf:day.tf,start_ts:day.start_ts});const sh=$('cSheet');sh.classList.remove('hidden','cs-full');
 const netR=st.res.reduce((a,r)=>a+(r.netR||0),0),adh=st.res.length?st.res.reduce((a,r)=>a+r.adh,0)/st.res.length:1;
 sh.innerHTML='<div class="cs-head"><button id="csMap" class="cv-x">✕</button><span class="cs-kind">👑 '+(L_()==='de'?'Serie':'سلسلة')+' '+(st.k+1)+'/'+e.days.length+'</span><span class="cs-diff">ATR '+day.atr+' · spread '+day.spread+'$</span></div>'+
  '<div class="ser-bar"><span>Σ <b class="'+(netR>=0?'w':'l')+'">'+(netR>=0?'+':'')+netR.toFixed(2)+'R</b></span><span>التزام <b>'+Math.round(adh*100)+'%</b></span><span>'+st.res.map(r=>r.skip?'·':r.netR>0?'🟢':'🔴').join('')+'</span></div>'+
  '<div class="cs-prompt">'+TX(e.prompt)+'</div><div class="row"><button class="cs-tool" data-tool="long">📈 شراء</button><button class="cs-tool" data-tool="short">📉 بيع</button></div>'+
  '<div class="row small"><label>المخاطرة <select id="serRisk"><option value="0.5">0.5%</option><option value="1" selected>1%</option><option value="2">2%</option></select></label><span id="csRead"></span></div>'+
  '<div class="cs-act"><button id="serGo" class="cs-go">✔ نفّذ</button><button id="serSkip" class="cs-skip">⏭ ما في صفقة اليوم</button></div>';
 $('csMap').onclick=()=>{$('cSheet').classList.add('hidden');setMode('none');courseMap(CITEM.mi);$('courseView').classList.remove('hidden')};
 document.querySelectorAll('#cSheet .cs-tool').forEach(b=>b.onclick=()=>{if(mode!==b.dataset.tool)setMode(b.dataset.tool);scrollTo(0,0)});
 $('serSkip').onclick=()=>seriesResolve(null);$('serGo').onclick=()=>{const d=lastDraw('pos');if(!d)return alert('حط مربع شراء أو بيع أولاً، أو اختار «ما في صفقة»');seriesResolve(d)};}
async function seriesResolve(d){const e=CITEM.e,st=serState(),day=e.days[st.k],rules=e.rules;setMode('none');let r;
 if(!d){r={skip:true,adh:1,netR:0}}
 else{const risk=+$('serRisk').value,dir=d.side==='buy'?1:-1,px=S.price,shift=px-d.e,E=px,SL=+(d.sl+shift).toFixed(2),TP=+(d.tp+shift).toFixed(2),dist=Math.abs(E-SL);
  const prevLoss=st.res.length&&!st.res[st.res.length-1].skip&&st.res[st.res.length-1].netR<0,prevRisk=st.res.length?(st.res[st.res.length-1].risk||1):1;
  const okStop=(SL-E)*dir<0&&dist>=rules.stop_atr[0]*day.atr&&dist<=rules.stop_atr[1]*day.atr,okRR=(TP-E)*dir>0&&Math.abs(TP-E)>=rules.min_rr*dist-1e-9,okRisk=risk===rules.risk_pct&&!(prevLoss&&risk>prevRisk);
  const M=await m1(S.cur+60,S.cur+rules.max_hold_bars*3600);let ex=null,et=null,why='time';
  for(let i=0;i<M.n;i++){if(M.t[i]<=S.cur)continue;const hs=dir>0?M.l[i]<=SL:M.h[i]>=SL,ht=dir>0?M.h[i]>=TP:M.l[i]<=TP;if(hs){ex=SL;et=M.t[i];why='SL';break}if(ht){ex=TP;et=M.t[i];why='TP';break}if(M.t[i]>S.cur+rules.max_hold_bars*3600)break}
  if(ex==null&&M.n){let i=M.n-1;while(i>0&&M.t[i]>S.cur+rules.max_hold_bars*3600)i--;ex=M.c[i];et=M.t[i]}
  const cost=day.spread+2*0.05,gross=dist?(ex-E)*dir/dist:0,netR=+(gross-cost/dist).toFixed(2);
  d.e=E;d.sl=SL;d.tp=TP;d.st='done';d.res=why;if(et){d.t2=Math.max(d.t2,et);S.cur=et;await render()}dirty++;
  r={side:d.side,entry:E,sl:SL,tp:TP,exit:+(+ex).toFixed(2),why,risk,netR,grossR:+gross.toFixed(2),costR:+(cost/dist).toFixed(3),rules:{stop:okStop,rr:okRR,risk:okRisk},adh:((okStop?1:0)+(okRR?1:0)+(okRisk?1:0))/3};}
 r.day=day.start_utc;st.res.push(r);st.k++;cpSave();
 const sh=$('cSheet'),last=st.k>=e.days.length;
 sh.innerHTML='<div class="cs-head"><span class="cs-kind">'+(st.k)+'/'+e.days.length+'</span>'+(r.skip?'<span class="cs-res">⏭ ما في صفقة (ملتزم)</span>':'<span class="cs-res '+(r.netR>0?'ok':'bad')+'">'+r.why+' · '+(r.netR>0?'+':'')+r.netR+'R صافي</span>')+'</div>'+
  (r.skip?'':'<div class="small">'+['stop','rr','risk'].map(k=>(r.rules[k]?'✅ ':'❌ ')+({stop:'وقف 0.5–3 ATR',rr:'هدف ≥ 1.5R',risk:'مخاطرة 1% بدون تكبير بعد خسارة'}[k])).join('<br>')+'<br>تكاليف: '+r.costR+'R</div>')+
  '<div class="cs-act"><button id="serNext" class="cs-go">'+(last?'🏁 النتيجة':'اليوم التالي ←')+'</button></div>';
 $('serNext').onclick=()=>last?seriesFinish():seriesDay();}
function seriesFinish(){const e=CITEM.e,m=CRS.modules[CITEM.mi],st=serState(),res=st.res;
 const adh=res.reduce((a,r)=>a+r.adh,0)/res.length,net=res.reduce((a,r)=>a+(r.netR||0),0),trades=res.filter(r=>!r.skip).length,minT=(e.rules&&e.rules.min_trades)||8;let pct=Math.round(70*adh+30*Math.max(0,Math.min(1,(net+5)/10)));const few=trades<minT;if(few)pct=Math.min(pct,60);const pass=pct>=(m.boss.pass_pct||75);
 CP.series={last:{pct,adh:+(adh*100).toFixed(1),netR:+net.toFixed(2),trades,at:new Date().toISOString(),res},best:Math.max((CP.series&&CP.series.best)||0,pct),tries:((CP.series&&CP.series.tries)||0)+1};
 const b=CP.boss[m.id]||{};b.best=Math.max(b.best||0,pct);b.passed=b.passed||pass;b.tries=(b.tries||0)+1;CP.boss[m.id]=b;CP.xp+=Math.round(e.xp*pct/100)+(pass?100:0);bumpStreak();CP.serState=null;CP.cur=null;cpSave();
 $('cSheet').innerHTML='<div class="cs-boss '+(pass?'ok':'bad')+'"><div class="cs-big">'+(pass?'🏆':'💪')+'</div><b>'+pct+'% / '+(m.boss.pass_pct||75)+'%</b><div class="egrid"><div><small>التزام</small><b>'+Math.round(adh*100)+'%</b></div><div><small>صافي</small><b class="'+(net>=0?'w':'l')+'">'+(net>=0?'+':'')+net.toFixed(2)+'R</b></div><div><small>صفقات</small><b>'+trades+'/20</b></div></div><div class="small">العلامة = 70% التزام + 30% النتيجة الصافية. '+(few?'لازم '+minT+' صفقات على الأقل (العلامة محدودة بـ60%). ':'')+(pass?'جاهز للديمو بنفس القواعد.':'راجع القواعد وجرّب مرة تانية.')+'</div><button id="csDone" class="cs-go">الخريطة</button></div>';
 $('csDone').onclick=()=>{$('cSheet').classList.add('hidden');courseMap(CITEM.mi);$('courseView').classList.remove('hidden')};}
