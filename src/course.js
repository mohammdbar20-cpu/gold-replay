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
function modUnlocked(m){const r=m.unlock&&m.unlock.requires;if(!r)return true;const pm=CRS.modules.find(x=>x.id===r);return pm?modPassed(pm):true}
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
 window.__courseStep=e.task==='identify_candle';document.body.classList.toggle('course-step',window.__courseStep);
 await showItemChart(e);sheetTask();}
function bossStart(mi,i){CSTATE={mi,scores:[],t0:Date.now()};itemStart(mi,i,true)}
function lastDraw(type){for(let i=S.draw.length-1;i>=0;i--)if(S.draw[i].type===type)return S.draw[i];return null}
let bossTimer=null;
function sheetTask(){const e=CITEM.e,sh=$('cSheet');sh.classList.remove('hidden');clearInterval(bossTimer);
 let h='<div class="cs-head"><button id="csMap" class="cv-x">✕</button><span class="cs-kind">'+(CITEM.boss?'👑 '+TX(CRS.modules[CITEM.mi].boss.title)+' '+(CITEM.i+1)+'/'+CRS.modules[CITEM.mi].boss.items.length:(e.kind==='guided'?'💡':'🎯')+' '+(CITEM.i+1)+'/'+CRS.modules[CITEM.mi].path.length)+'</span><span class="cs-diff">'+e.tf+' · '+'🔥'.repeat(e.difficulty)+'</span><span id="csTimer"></span></div>';
 h+='<div class="cs-prompt">'+TX(e.prompt)+'</div><div class="cs-ans">';
 const t=e.task;
 if(t==='read_price'||t==='calc_number')h+='<input id="csNum" type="number" step="0.01" inputmode="decimal" placeholder="0.00">';
 if(t==='mark_level'||t==='mark_level_and_choose')h+='<button class="cs-tool" data-tool="hline">— علّم المستوى على الشارت</button><div id="csRead" class="small"></div>';
 if(t==='mark_zone')h+='<button class="cs-tool" data-tool="hline">— ارسم خطين: أعلى وأدنى المنطقة</button><div id="csRead" class="small"></div>';
 if(t==='place_position')h+='<div class="row"><button class="cs-tool" data-tool="long">📈 شراء</button><button class="cs-tool" data-tool="short">📉 بيع</button></div><div class="small">اسحب مقابض المربع لضبط الدخول والوقف والهدف</div><div id="csRead" class="small"></div>';
 if(t==='identify_candle')h+='<div class="small">استخدم ▶| أو ▶️ للتقدم ثم اضغط "هنا"</div>';
 if(e.choices)h+='<div class="cs-choices">'+e.choices.map(c=>'<button class="cs-ch" data-k="'+c.key+'">'+TX(c)+'</button>').join('')+'</div>';
 if(t==='fill_sentence')h+='<div class="cs-fill"><select id="csB1"><option value="">___</option>'+e.blank1_options.map((o,i)=>'<option value="'+i+'">'+TX(o)+'</option>').join('')+'</select><select id="csB2"><option value="">___</option>'+e.blank2_options.map((o,i)=>'<option value="'+i+'">'+TX(o)+'</option>').join('')+'</select></div>';
 if(e.sentence_required)h+='<div class="cs-sent small">'+TX(CRS.rules.sentence)+'</div><div class="cs-fill"><input id="csS1" placeholder="___"><input id="csS2" placeholder="___"></div>';
 h+='</div><div class="cs-act">'+(e.kind==='guided'&&CITEM.tries>0&&e.hint&&!CITEM.boss?'<div class="cs-hint">💡 '+TX(e.hint)+'</div>':'')+'<button id="csGo" class="cs-go">'+(t==='identify_candle'?'📍 هنا':'✔ تحقّق')+'</button></div>';
 sh.innerHTML=h;
 $('csMap').onclick=()=>{clearInterval(bossTimer);$('cSheet').classList.add('hidden');setMode('none');courseMap(CITEM.mi);$('courseView').classList.remove('hidden')};
 document.querySelectorAll('.cs-tool').forEach(b=>b.onclick=()=>{if(mode!==b.dataset.tool)setMode(b.dataset.tool);scrollTo(0,0)});
 document.querySelectorAll('.cs-ch').forEach(b=>b.onclick=()=>{document.querySelectorAll('.cs-ch').forEach(x=>x.classList.toggle('on',x===b));CITEM.key=b.dataset.k;gate()});
 ['csB1','csB2','csS1','csS2','csNum'].forEach(id=>{const el=$(id);if(el)el.oninput=el.onchange=gate});
 $('csGo').onclick=()=>submitItem();gate();
 if(CITEM.boss){const tl=CRS.modules[CITEM.mi].boss.timer_s_per_item||90,end=Date.now()+tl*1000;bossTimer=setInterval(()=>{const r=Math.max(0,Math.round((end-Date.now())/1000));const el=$('csTimer');if(el)el.textContent='⏱ '+r+'s';if(r<=0){clearInterval(bossTimer);submitItem(true)}},500)}}
function gate(){const e=CITEM.e,go=$('csGo');if(!go)return;let ok=true;
 if(e.sentence_required)ok=!!($('csS1').value.trim()&&$('csS2').value.trim());
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
 else if(t==='place_position'){const d=lastDraw('pos');if(d){const side=d.side==='buy'?'long':'short';ua.side=side;ua.entry=d.e;ua.sl=d.sl;ua.tp=d.tp;
   if(side===a.side){const z=(e.tolerance&&e.tolerance.entry_zone)||a.zone,atr=(e.tolerance&&e.tolerance.atr)||0,lo=Math.min(z[0],z[1]),hi=Math.max(z[0],z[1]);
    const inZ=d.e>=lo-atr*.1&&d.e<=hi+atr*.1;const beyond=side==='long'?(d.sl<lo&&d.sl>=lo-1.5*atr):(d.sl>hi&&d.sl<=hi+1.5*atr);const rr=Math.abs(d.tp-d.e)/(Math.abs(d.e-d.sl)||1);
    sc=(inZ?.4:0)+(beyond?.3:0)+(rr>=2-1e-9&&(side==='long'?d.tp>d.e:d.tp<d.e)?.3:0)}}}
 return {sc:Math.round(sc*100)/100,ua};}
async function submitItem(timeout){clearInterval(bossTimer);const e=CITEM.e;const {sc,ua}=scoreItem();setMode('none');
 const first=!CITEM.tries;let stars=sc>=1&&first?3:((sc>=.5&&first)||sc>=1)?2:1;if(e.kind==='guided')stars=Math.min(stars,2);
 const prev=CP.done[e.id]||{},xp=Math.round(e.xp*stars/3);
 if(!CITEM.boss){CP.done[e.id]={stars:Math.max(stars,prev.stars||0),score:Math.max(sc,prev.score||0),tries:(prev.tries||0)+1,last:new Date().toISOString(),ans:ua};CP.xp+=xp;bumpStreak();}
 else{CSTATE.scores.push(sc);CP.xp+=Math.round(e.xp*sc);bumpStreak();}
 cpSave();
 // reveal on chart: answer marks + future candles
 const a=e.answer,ac='#9afc41';
 if(a.price!=null&&e.task!=='read_price')S.draw.push({type:'hline',a:{t:S.cur,p:a.price},color:ac,lw:2,ls:1});
 if(a.low!=null){S.draw.push({type:'hline',a:{t:S.cur,p:a.low},color:ac,ls:1});S.draw.push({type:'hline',a:{t:S.cur,p:a.high},color:ac,ls:1});}
 if(e.task==='place_position')S.draw.push({type:'pos',side:a.side==='long'?'buy':'sell',t:S.cur,t2:S.cur+TFS[e.tf]*25,e:a.entry,sl:a.sl,tp:a.tp,st:'draft'});
 dirty++;
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
