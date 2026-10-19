// Minimal Arabic -> German i18n: dictionary + DOM observer. Arabic is the source language.
(function(){
var D={
"إعادة تشغيل الذهب":"Gold-Replay","تدريب الذهب":"Gold-Training","تعذر تحميل مكتبة الرسم البياني":"Chart-Bibliothek konnte nicht geladen werden","خطأ في التطبيق":"App-Fehler",
"قناة سعرية منتظمة وخروج منها":"Saubere Preiskanal-Struktur und Ausbruch","اتجاه قوي وكسر قمة/قاع جديد":"Starker Trend und Bruch eines neuen Hochs/Tiefs","كسر معاكس بعد اتجاه طويل":"Gegenbruch nach langem Trend","ذيل طويل خلف قمة/قاع مهم":"Langer Docht über/unter wichtigem Hoch/Tief","شمعة عنيفة مفاجئة":"Plötzliche heftige Kerze","سوق عرضي ضيق":"Enge Seitwärtsphase",
"حدد الاتجاه والخطة قبل الكشف":"Richtung und Plan vor dem Aufdecken festlegen","وقف الخسارة في الجهة الخطأ":"Stop-Loss auf der falschen Seite","تم ضبط الاختبار من المربع":"Quiz aus der Box übernommen","تمت متابعة الجلسة السابقة":"Vorherige Sitzung fortgesetzt","نفّذ، أو اختر الاتجاه، ثم":"Ausführen, oder Richtung wählen, dann",
"يتم حفظ موضعك تلقائياً":"Deine Position wird automatisch gespeichert","الربح/الخسارة المفتوحة":"Offener G/V","قمم/قيعان قوية وضعيفة":"Starke/schwache Hochs/Tiefs","لحجم لوت مربع المركز":"für die Lotgröße der Positionsbox","الهدف في الجهة الخطأ":"Ziel auf der falschen Seite","للشراء؛ اعكسها للبيع":"für Kauf; für Verkauf umkehren",
"لا توجد صفقة مفتوحة":"Keine offene Position","لماذا دخلت الصفقة؟":"Warum bist du eingestiegen?","اختر الاتجاه أولاً":"Zuerst Richtung wählen","ارسم مربع شراء/بيع":"Zeichne eine Long/Short-Box","الصقه في المحادثة":"in den Chat einfügen","هادئ، متوتر، طماع":"ruhig, nervös, gierig","إجمالي الاختبارات":"Quizze gesamt",
"أغلق الصفقة أولاً":"Schließe zuerst die Position","أوردر بلوك رئيسي":"Swing-Orderblock","أوردر بلوك داخلي":"Interner Orderblock","مقياس نسبة مئوية":"Prozent-Skala","مسح كل الرسومات؟":"Alle Zeichnungen löschen?","مسح كل الرسومات":"Alle Zeichnungen löschen","لديك صفقة مفتوحة":"Du hast eine offene Position",
"تم تنفيذ الصفقة":"Trade ausgeführt","ابدأ من التاريخ":"Ab Datum starten","العائد/المخاطرة":"Chance/Risiko","مقياس لوغاريتمي":"Logarithmische Skala","نهاية البيانات":"Ende der Daten","الشمعة التالية":"Nächste Kerze","أدخل حجم اللوت":"Lotgröße eingeben","في الجهة الخطأ":"auf der falschen Seite",
"ما زالت مفتوحة":"noch offen","خطأ في التحميل":"Ladefehler","إنهاء الاختبار":"Quiz beenden","لا توجد بيانات":"Keine Daten","بداية البيانات":"Beginn der Daten","حذف كل السجل؟":"Gesamtes Journal löschen?","إلغاء التحديد":"Auswahl aufheben","تحديات مختارة":"Ausgewählte Challenges",
"أغلقت الصفقة":"Position geschlossen","تنفيذ الصفقة":"Trade ausführen","وضع الاختبار":"Quiz-Modus","إرسال للمدرب":"An Coach senden","اختر الاتجاه":"Richtung wählen","تمديد لليمين":"Nach rechts verlängern","تاريخ عشوائي":"Zufallsdatum","تم الاستيراد":"Importiert","رصيد البداية":"Startguthaben",
"ملف غير صالح":"Ungültige Datei","الاتجاه صحيح":"Richtung richtig","السبب/الشعور":"Grund/Gefühl","مقياس تلقائي":"Auto-Skala","إغلاق الصفقة":"Position schließen","تشغيل/إيقاف":"Play/Pause","وقف الخسارة":"Stop-Loss","دقة الاتجاه":"Richtungs-Trefferquote","الاتجاه خطأ":"Richtung falsch",
"توقيت برلين":"Berliner Zeit","سجل الصفقات":"Trade-Journal","وصلت الهدف":"Ziel erreicht","حذف بالنقر":"Per Tippen löschen","هيكل رئيسي":"Swing-Struktur","الإحصائيات":"Statistik","نسخ للمدرب":"Für Coach kopieren","قناة سعرية":"Preiskanal","هيكل داخلي":"Interne Struktur","اكشف وقيّم":"Aufdecken & bewerten",
"نسبة الربح":"Trefferquote","اضغط اكشف":"tippe auf Aufdecken","مركز شراء":"Long-Position","انسخ النص":"Text kopieren","حذف السجل":"Journal löschen","ضرب الوقف":"Stop getroffen","الإجمالي":"Gesamt","تقدم يوم":"Einen Tag vor","تم النسخ":"Kopiert","رجوع يوم":"Einen Tag zurück","مركز بيع":"Short-Position",
"لم تتفعل":"nicht ausgelöst","المخاطرة":"Risiko","البيانات":"Daten","مغناطيس":"Magnet","الصفقات":"Trades","استيراد":"Import","الإغلاق":"Schluss","خط أفقي":"Horizontale Linie","الاتجاه":"Richtung","خط ترند":"Trendlinie","الحركة":"Bewegung","قلم حر":"Freihand-Stift","الجلسة":"Sitzung",
"اختبار":"Quiz","النقاط":"Punkte","تحديات":"Challenges","السرعة":"Tempo","مشاركة":"Teilen","الصفقة":"Trade","الرصيد":"Guthaben","تلقائي":"Auto","مخاطرة":"Risiko","فجوات":"Lücken","تصدير":"Export","دقيقة":"Minuten","مناطق":"Zonen","تشغيل":"Play","ساعات":"Stunden","متوسط":"Mittel",
"تفعيل":"Aktivieren","الهدف":"Ziel","تراجع":"Rückgängig","إيقاف":"Pause","تنزيل":"Download","شعوري":"Mein Gefühl","منفذة":"ausgeführt","الوقف":"Stop","أنجزت":"Erledigt","تعديل":"Bearbeiten","اللوت":"Lot","برلين":"Berlin","مسافة":"Leertaste","صفقة":"Trade","رجوع":"Zurück",
"قناة":"Kanal","اكشف":"Aufdecken","صاعد":"Steigend","ساعة":"Stunde","شمعة":"Kerze","أزرق":"Blau","نفّذ":"Ausführen","دخول":"Einstieg","يومي":"Täglich","صحيح":"richtig","هابط":"Fallend","أصفر":"Gelb","يدوي":"Manuell","أبيض":"Weiß","أخضر":"Grün","مؤشر":"Indikator","شراء":"Kaufen",
"أفقي":"Horizontal","خروج":"Ausstieg","ترند":"Trend","أحمر":"Rot","بيع":"Verkaufen","مسح":"Leeren","لوت":"Lot","حذف":"Löschen","خطأ":"Fehler","يوم":"Tag","قلم":"Stift","ثم":"dann","سهل":"Leicht","صعب":"Schwer","15د":"15m","4س":"4h","1س":"1h","اختبار:":"Quiz:",
"مؤشر SMC":"SMC-Indikator","النمط واللون":"Stil & Farbe","التعبئة":"Füllung","الخط":"Linie","الشفافية":"Deckkraft","السماكة":"Stärke","النمط":"Stil","متصل":"Durchgezogen","متقطع":"Gestrichelt","منقط":"Gepunktet","خلفية القناة":"Kanal-Hintergrund","بيع فوري بسعر السوق":"Sofort zum Marktpreis verkaufen","شراء فوري بسعر السوق":"Sofort zum Marktpreis kaufen","حجم اللوت":"Lotgröße","إغلاق الكل":"Alle schließen","إغلاق":"Schließen","الأسهم":"Equity","عائم":"Offen","المدة":"Dauer","السجل":"Verlauf","شعوري":"Gefühl","واثق":"Sicher","متردد":"Unsicher","تشغيل عكسي":"Rückwärts abspielen","عكسي":"Rückwärts","مؤشر الماكد":"MACD-Indikator","سريع":"Schnell","بطيء":"Langsam","إشارة":"Signal"
};
var KEYS=Object.keys(D).sort(function(a,b){return b.length-a.length});
var RE=new RegExp('(?<![\\u0600-\\u06FF])('+KEYS.map(function(k){return k.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&')}).join('|')+')(?![\\u0600-\\u06FF])','g');
var q=(location.search.match(/[?&]lang=(ar|de)/)||[])[1];if(q)try{localStorage.setItem('gr_lang',q)}catch(e){}
var L=null;try{L=localStorage.getItem('gr_lang')}catch(e){}
function tr(s){if(L!=='de'||!s||!/[\u0600-\u06FF]/.test(s))return s;return s.replace(RE,function(m){return D[m]}).replace(/؟/g,'?').replace(/،/g,',').replace(/؛/g,';');}
function walk(n){if(n.nodeType===3){var v=n.nodeValue,t=tr(v);if(t!==v)n.nodeValue=t;return}if(n.nodeType!==1)return;
 if(n.tagName==='SCRIPT'||n.tagName==='STYLE')return;['title','placeholder','aria-label'].forEach(function(a){var v=n.getAttribute(a);if(v){var t=tr(v);if(t!==v)n.setAttribute(a,t)}});
 for(var c=n.firstChild;c;c=c.nextSibling)walk(c);}
function apply(){var de=L==='de';document.documentElement.lang=de?'de':'ar';document.documentElement.dir=de?'ltr':'rtl';
 if(!de)return;document.title=tr(document.title);walk(document.body);
 new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='characterData')walk(m.target);else if(m.type==='attributes')walk(m.target);else m.addedNodes.forEach(walk)})}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','placeholder']});
 var A=window.alert,C=window.confirm,P=window.prompt;window.alert=function(m){return A.call(window,tr(String(m)))};window.confirm=function(m){return C.call(window,tr(String(m)))};window.prompt=function(m,d){return P.call(window,tr(String(m)),d)};}
window.I18N={tr:tr,get lang(){return L},de:function(){return L==='de'}};
function chooser(){var o=document.createElement('div');o.id='langPick';
 o.innerHTML='<div class="lp-card"><div class="lp-logo">🟡 XAUUSD</div><div class="lp-t">اختر اللغة · Sprache wählen</div><button data-l="ar" dir="rtl">عربي</button><button data-l="de" dir="ltr">Deutsch</button></div>';
 document.body.appendChild(o);o.querySelectorAll('button').forEach(function(b){b.onclick=function(){L=b.getAttribute('data-l');try{localStorage.setItem('gr_lang',L)}catch(e){}o.remove();apply();if(window.__onLang)window.__onLang(L)}});}
document.documentElement.dir=L==='de'?'ltr':'rtl';
if(L)apply();else chooser();
})();
