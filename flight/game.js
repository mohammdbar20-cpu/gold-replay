/* طيارة الدهب — live XAUUSD prediction game. Price: api.gold-api.com (live, every 3 s), candles: biquote.io (same source as channels15). */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var BQ = 'https://biquote.io/api/XAUUSD/ohlc?interval=', GOLDAPI = 'https://api.gold-api.com/price/XAU';
  var MIN = 60e3, H = 3600e3, WINDOW = 90 * MIN;
  var cv = $('cv'), cx = cv.getContext('2d'), W = 0, Ht = 0, DPR = 1;
  var LS = 'flight.v1', save = load();
  function load() { try { var s = JSON.parse(localStorage.getItem(LS)); if (s) return s; } catch (e) {} return { score: 0, best: 0, streak: 0, hist: [], custom: [], near: 3, groups: { map: 1, prof: 1, ch: 1, custom: 1 } }; }
  var bT = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hour12: false }), bD = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' });
  var MO = { berlinTime: function (t) { return bT.format(new Date(t)); }, berlinDay: function (t) { return bD.format(new Date(t)); } };
  if (!save.groups || save.groups.grok != null) save.groups = { map: 1, prof: 1, ch: 1, custom: 1 };
  function store() { try { localStorage.setItem(LS, JSON.stringify(save)); } catch (e) {} }
  var S = { mode: 'boot', price: null, disp: null, src: '', lastTick: 0, samples: [], data: { m15: [], h1: [], h4: [], m5: [] }, map: null, sig: null, mapAt: 0,
    simT: 0, simPath: [], simIdx: 0, paused: false, ask: null, round: null, cool: {}, fx: [], center: null, span: 20, tilt: 0, vel: 0, fetchErr: 0, liveOk: false, closed: false, dayChg: null };
  // ---------------------------------------------------------------- data
  function bq(iv, n) { return fetch(BQ + iv + '&limit=' + n, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
    return d.bars.map(function (b) { return { t: Date.parse(b.openTime), o: +b.open, h: +b.high, l: +b.low, c: +b.close, v: +(b.tickVolume || b.volume || 0), open: !!b.isOpen }; }).sort(function (a, b) { return a.t - b.t; }); }); }
  function fromStatic(a) { return a.map(function (r) { return { t: r[0] * 1000, o: r[1], h: r[2], l: r[3], c: r[4], v: r[5] || 1, open: false }; }); }
  var HIST = null, LIVE = { m15: [], h1: [] }, staticData = null, LSB = 'flight.m15';
  function getHist() { return HIST ? Promise.resolve(HIST) : fetch('history.json?v=2').then(function (r) { return r.json(); }).then(function (j) { HIST = j; return j; }); }
  function getStatic() { return staticData ? Promise.resolve(staticData) : fetch('replay.json?v=1').then(function (r) { return r.json(); }).then(function (j) { staticData = j; return j; }); }
  function cache15() { try { return (JSON.parse(localStorage.getItem(LSB)) || []).map(function (r) { return { t: r[0], o: r[1], h: r[2], l: r[3], c: r[4], v: r[5] }; }); } catch (e) { return []; } }
  function saveCache(m15) { try { localStorage.setItem(LSB, JSON.stringify(m15.slice(-3000).map(function (x) { return [x.t, x.o, x.h, x.l, x.c, Math.round(x.v)]; }))); } catch (e) {} }
  function loadCandles(full) {
    var jobs = [getHist(), bq('15m', 200).then(function (b) { LIVE.m15 = b; S.data.m15raw = b; }), bq('5m', 30).then(function (b) { S.data.m5 = b; }).catch(function () {})];
    if (full || !LIVE.h1.length) jobs.push(bq('1h', 200).then(function (b) { LIVE.h1 = b; }), bq('1d', 3).then(function (b) { S.data.d1q = b; }).catch(function () {}));
    return Promise.all(jobs).then(function () { S.candleSrc = 'biquote.io + history.json'; S.fetchErr = 0; }).catch(function () { S.fetchErr++; S.candleSrc = 'history.json فقط (biquote ما ردّ)'; return getHist(); });
  }
  function pollPrice() {
    return fetch(GOLDAPI, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      var p = +j.price, age = Date.now() - Date.parse(j.updatedAt); if (!(p > 100)) throw new Error('bad');
      return { p: p, age: age, src: 'gold-api.com' };
    }).catch(function () { return bq('15m', 2).then(function (b) { var l = b[b.length - 1]; return { p: l.c, age: Date.now() - l.t - (l.open ? 0 : 15 * MIN), src: 'biquote.io' }; }); });
  }
  // ---------------------------------------------------------------- indicator (MO Gold Pro port, mopro.js)
  function nowT() { return S.mode === 'replay' ? S.simT : Date.now(); }
  var lastRunKey = '';
  function rebuildMap(force) {
    if (!HIST) return; var t = nowT(), key = Math.floor(t / (15 * MIN)) + '|' + S.mode + '|' + (save.news || '').length + '|' + (save.mem || '').length + '|' + LIVE.m15.length;
    if (!force && key === lastRunKey && S.R) { buildLevels(); return; } lastRunKey = key;
    var ex = cache15(), D = MOP.buildData(HIST, { m15: LIVE.m15, h1: LIVE.h1 }, t, ex);
    if (S.mode === 'live' && D.m15.length > ex.length) saveCache(D.m15);
    S.D = D; S.R = MOP.run(D, { news: save.news, mem: save.mem }); S.mapAt = t; buildLevels();
  }
  var GROUPS = { map: 'خريطة 4H (MO)', prof: 'VAH/VAL/POC اليومي', ch: 'قنواتي', custom: 'مستوياتي' };
  function tagTxt(t) { return t.replace(/\+/g, ' + ').replace(/·/g, ' '); }
  function buildLevels() {
    var R = S.R, out = []; if (!R || !R.snap) { S.map = { levels: [] }; return; }
    var s = R.snap, p = S.price || s.close, t = nowT();
    function add(o) { if (o.px != null && isFinite(o.px) && save.groups[o.group] !== 0) out.push(o); }
    s.map.forEach(function (l) { add({ px: l.p, label: (l.star ? '★ ' : '') + tagTxt(l.t), group: 'map', C: l.C, star: l.star, lv: l, color: null }); });
    if (s.today && s.today.poc != null) { add({ px: s.today.poc, label: 'POC اليوم', group: 'prof', color: '#ff9800' }); add({ px: s.today.vah, label: 'VAH اليوم', group: 'prof', color: '#5c9dff' }); add({ px: s.today.val, label: 'VAL اليوم', group: 'prof', color: '#5c9dff' }); }
    if (s.y) { add({ px: s.y.poc, label: 'POC أمس' + (s.yNaked ? ' 🧲' : ''), group: 'prof', color: '#ffb74d', dash: 1 }); add({ px: s.y.vah, label: 'VAH أمس', group: 'prof', color: '#90caf9', dash: 1 }); add({ px: s.y.val, label: 'VAL أمس', group: 'prof', color: '#90caf9', dash: 1 }); }
    var CC = ['#4dd0e1', '#b388ff', '#3ddc84'];
    MOP.chLines(t).forEach(function (c) { var act = c.ch < 2 || s.c3On; if (c.ch === 2 && !act && !save.showWatch) return; add({ px: c.px, label: '📐 ' + c.name + (act ? '' : ' (مراقبة)'), group: 'ch', color: CC[c.ch], chan: 1, watch: !act }); });
    (save.custom || []).forEach(function (c) { add({ px: +c.px, label: c.name || 'مستواي', group: 'custom', color: '#f783ac' }); });
    out.sort(function (a, b) { return a.px - b.px; });
    var merged = []; out.forEach(function (l) { var m = merged[merged.length - 1]; if (m && Math.abs(m.px - l.px) <= 1) { m.parts.push(l); if (l.group === 'map') { m.lv = l.lv; m.star = l.star; m.C = l.C; } m.label = m.parts.map(function (q) { return q.label; }).join(' · '); m.watch = m.watch && l.watch; }
      else merged.push({ px: l.px, label: l.label, parts: [l], lv: l.lv, star: l.star, C: l.C, color: l.color, chan: l.chan, dash: l.dash, watch: l.watch }); });
    S.map = { levels: merged, snap: s };
    renderTrend();
  }
  function lvColor(l) { var p = S.disp || S.price || 0; return l.chan ? l.color : l.px < p ? '#9cff3c' : '#ff5c5c'; } // Pine branch: colour by current side
  function renderTrend() {
    var s = S.R && S.R.snap, tc = $('trendchip'); if (!s) { tc.classList.add('hidden'); return; }
    var conf = s.upConf > s.dnConf ? 1 : s.upConf < s.dnConf ? -1 : 0, slope = s.trendOk ? (s.green > (S.R.g5 || 0) ? 1 : -1) : 0, sc = s.bias + conf;
    tc.classList.remove('hidden');
    tc.innerHTML = '4H ' + (s.bias === 1 ? '▲' : s.bias === -1 ? '▼' : '—') + ' · المؤكدات ▲' + s.upConf + ' ▼' + s.dnConf + (s.news ? ' · <span style="color:#ffa94d">' + esc(s.news) + '</span>' : '');
  }
  // ---------------------------------------------------------------- modes
  function setStatus(txt, cls) { var s = $('status'); s.textContent = txt; s.className = 'pill ' + (cls || ''); }
  function startLive() {
    S.mode = 'live'; S.paused = false; S.samples = []; S.round = null; hideAsk(); S.cool = {};
    var t0 = Date.now() - WINDOW, pre = (S.data.m5 && S.data.m5.length) ? S.data.m5 : LIVE.m15, pm = (S.data.m5 && S.data.m5.length) ? 5 : 15;
    pre.forEach(function (b) { if (b.t + pm * MIN > t0) barPath(b, pm).forEach(function (q) { if (q.t < Date.now()) S.samples.push(q); }); });
    $('bMode').textContent = '🔁 ريبلاي'; rebuildMap(true); tick(true);
  }
  function startReplay(reason) {
    var go = function (bars, label) {
      S.mode = 'replay'; S.replaySrc = label; S.round = null; hideAsk(); S.cool = {}; S.paused = false;
      var start = bars.length > 150 ? bars.length - 150 : 0; S.simPath = []; bars.slice(start).forEach(function (b) { S.simPath = S.simPath.concat(barPath(b, 5)); });
      S.samples = S.simPath.filter(function (q) { return q.t < S.simPath[12].t; }); S.simIdx = 12; S.simT = S.simPath[12].t; S.price = S.disp = S.simPath[12].p;
      $('bMode').textContent = '🟢 مباشر'; setStatus('⏪ ريبلاي' + (reason ? ' · ' + reason : ''), 'replay'); rebuildMap(true);
    };
    var ready = HIST ? Promise.resolve() : getHist();
    ready.then(function () { return bq('5m', 300); }).then(function (b) { go(b.filter(function (x) { return !x.open; }), 'biquote.io 5m'); }).catch(function () {
      getStatic().then(function (j) { go(fromStatic(j.m5), 'نسخة محفوظة'); });
    });
  }
  function barPath(b, mins) { var dur = mins * MIN, hiFirst = Math.abs(b.h - b.o) < Math.abs(b.o - b.l), a = hiFirst ? b.h : b.l, z = hiFirst ? b.l : b.h;
    return [{ t: b.t, p: b.o }, { t: b.t + dur * 0.3, p: a }, { t: b.t + dur * 0.7, p: z }, { t: b.t + dur * 0.98, p: b.c }]; }
  var tickBusy = false;
  function tick(first) {
    if (S.mode !== 'live' || tickBusy) return; tickBusy = true;
    pollPrice().then(function (r) {
      var firstP = S.price == null; S.liveOk = true; S.src = r.src; S.price = r.p; if (S.disp == null) S.disp = r.p; S.lastTick = Date.now();
      if (firstP) buildLevels(); S.samples.push({ t: Date.now(), p: r.p }); S.closed = r.age > 20 * MIN;
      if (S.closed) { setStatus('🌙 السوق مغلق', 'err'); if (first) { toast('السوق مغلق هلق 🌙<br><small>عم شغّل ريبلاي لآخر شموع حقيقية</small>'); startReplay('السوق مغلق'); } }
      else setStatus('🟢 مباشر · ' + r.src, 'live');
      if (S.mode === 'live') checkLevels(r.p, Date.now());
    }).catch(function () { setStatus('⚠️ ما في سعر حي', 'err'); if (first) { toast('ما قدرت جيب السعر الحي ⚠️<br><small>عم شغّل ريبلاي</small>'); startReplay('ما في اتصال'); } })
      .then(function () { tickBusy = false; });
  }
  // ---------------------------------------------------------------- game rules
  function near() { return Math.max(1, +save.near || 3); }
  function thresholds() { var s = S.R && S.R.snap, a15 = (s && s.atr) || 6, a4 = (s && s.atr4) || 30;
    return { brk: Math.max(2, 0.3 * a15), bnc: Math.min(15, Math.max(near() + 3, 0.35 * a4)) }; } // Pine: break = 0.3 ATR beyond, held = 0.35 x ATR4 away
  function checkLevels(p, t) {
    if (!S.map || !S.map.levels) return;
    S.map.levels.forEach(function (l) { var k = l.px.toFixed(1); if (S.cool[k] && Math.abs(p - l.px) > near() * 3) delete S.cool[k]; });
    if (S.round) { resolve(p, t); return; }
    if (S.ask) return;
    var best = null; S.map.levels.forEach(function (l) { if (l.watch) return; var d = Math.abs(p - l.px); if (d <= near() && !S.cool[l.px.toFixed(1)] && (!best || d < Math.abs(p - best.px))) best = l; });
    if (best) openAsk(best, p, t);
  }
  function zonesAt(L, tol) { var s = S.R.snap, o = [];
    s.bullOB.forEach(function (z) { if (!z.br && L >= z.bot - tol && L <= z.top + tol) o.push('🟩 Flux OB طلب ' + z.bot.toFixed(1) + '–' + z.top.toFixed(1)); });
    s.bearOB.forEach(function (z) { if (!z.br && L >= z.bot - tol && L <= z.top + tol) o.push('🟥 Flux OB عرض ' + z.bot.toFixed(1) + '–' + z.top.toFixed(1)); });
    s.fvg.forEach(function (z) { if (L >= z.min - tol && L <= z.max + tol) o.push((z.bull ? '🟩' : '🟥') + ' FVG 15د ' + z.min.toFixed(1) + '–' + z.max.toFixed(1)); });
    s.zones4.forEach(function (z) { if (L >= z.B - tol && L <= z.T + tol) o.push((z.K > 0 ? '🟩 ' : '🟥 ') + (Math.abs(z.K) === 1 ? 'OB' : 'FVG') + ' 4H ' + z.B.toFixed(1) + '–' + z.T.toFixed(1)); });
    return o; }
  // the indicator's lean at this level, from its own reads (level strength/state, 4H bias, confirmations, zones, 🧠 rates)
  function lean(l, side) {
    var s = S.R.snap, lv = l.lv, dirB = -side, sc = 0, why = [];
    if (lv) { if (lv.star) { sc++; why.push('★ مستوى قوي'); } if (lv.nb > 0) { sc++; why.push('ارتد قبل ' + lv.nb + ' مرة'); } if (lv.st === 3) { sc++; why.push('↺ سحب سيولة عنده'); } if (lv.fl) { sc++; why.push('⇅ انقلب دوره'); } if (lv.st === 2) { sc--; why.push('✕ انكسر قبل'); } }
    if (s.bias === dirB) { sc++; why.push('اتجاه 4H مع الارتداد'); } else if (s.bias === -dirB) { sc--; why.push('اتجاه 4H مع الاختراق'); }
    var cf = dirB === 1 ? s.upConf - s.dnConf : s.dnConf - s.upConf; if (cf > 0) { sc++; why.push('المؤكدات مع الارتداد'); } else if (cf < 0) { sc--; why.push('المؤكدات مع الاختراق'); }
    var zt = zonesAt(l.px, (s.atr || 5) * 0.3).filter(function (z) { return dirB === 1 ? z.indexOf('🟩') === 0 : z.indexOf('🟥') === 0; }); if (zt.length) { sc++; why.push('منطقة ' + (dirB === 1 ? 'طلب' : 'عرض') + ' عند الخط'); }
    if (lv && lv.ln && lv.ln.length) { var rs = lv.ln.map(function (x) { var m = x.match(/(\d+)%/); return m ? +m[1] : 50; }), av = rs.reduce(function (a, b) { return a + b; }, 0) / rs.length; if (av >= 60) { sc++; why.push('🧠 مصادره بتصمد ' + Math.round(av) + '%'); } else if (av <= 40) { sc--; why.push('🧠 مصادره بتنكسر (' + Math.round(av) + '% صمود)'); } }
    return { pick: sc >= 1 ? 'bounce' : sc <= -1 ? 'break' : null, sc: sc, why: why };
  }
  function openAsk(l, p, t) {
    var side = p >= l.px ? 1 : -1; S.ask = { lvl: l, side: side, t0: Date.now(), p0: p, lean: S.R && S.R.snap ? lean(l, side > 0 ? -1 : 1) : { pick: null, why: [] } };
    if (S.mode === 'replay') S.paused = true;
    $('askTitle').innerHTML = '✈️ الطيارة قرّبت من <span style="color:' + lvColor(l) + '">' + esc(l.label) + '</span>';
    $('askSub').innerHTML = 'الخط <b dir="ltr">' + l.px.toFixed(2) + '</b> · السعر <b dir="ltr">' + p.toFixed(2) + '</b> ' + (side > 0 ? 'فوق الخط ⬆️' : 'تحت الخط ⬇️') + ' · بفرق <b dir="ltr">' + Math.abs(p - l.px).toFixed(2) + '$</b>';
    $('aBounce').innerHTML = (side > 0 ? '⬆️' : '⬇️') + ' يرتد'; $('aBreak').innerHTML = (side > 0 ? '⬇️' : '⬆️') + ' يخترق';
    $('askHints').innerHTML = hints(l, side, t).map(function (h) { return '<li>' + h + '</li>'; }).join('');
    $('ask').classList.remove('hidden');
  }
  function hints(l, side, t) {
    var out = [], s = S.R && S.R.snap; if (!s) return ['لسا عم حمّل المؤشر…'];
    var lv = l.lv;
    if (lv) { out.push((lv.star ? '★ ' : '') + 'القوة ' + lv.C + ' · ' + esc(tagTxt(lv.t)) + (lv.st === 1 ? ' · ✓ ارتد ' + lv.nb : lv.st === 2 ? ' · ✕ انكسر' : lv.st === 3 ? ' · ↺ كسر كاذب = سحب سيولة' : '') + (lv.fl ? ' · ⇅ انقلب دوره' : ''));
      if (lv.rc != null) out.push('🔁 ردود فعل سابقة عند الخط: ' + lv.rc + (lv.rc >= 3 ? ' (مصداقية عالية)' : lv.rc === 2 ? ' (مصداقية جيدة)' : ''));
      (lv.ln || []).forEach(function (x) { out.push('🧠 ' + esc(x)); }); }
    else if (l.parts.length > 1) out.push('⭐ خطوط مع بعض: ' + esc(l.label));
    zonesAt(l.px, (s.atr || 5) * 0.3).slice(0, 3).forEach(function (z) { out.push(z); });
    var cu = Object.keys(s.cu).filter(function (k) { return s.cu[k]; }), cd = Object.keys(s.cd).filter(function (k) { return s.cd[k]; });
    out.push('✅ المؤكدات (آخر 10 شمعات 15د): ▲' + s.upConf + '/8' + (cu.length ? ' (' + cu.join('، ') + ')' : '') + ' · ▼' + s.dnConf + '/8' + (cd.length ? ' (' + cd.join('، ') + ')' : ''));
    out.push('🧭 اتجاه 4H: ' + (s.bias === 1 ? 'صاعد ▲' : s.bias === -1 ? 'هابط ▼' : 'محايد —') + (s.trendOk ? '' : ' · الغيمة متذبذبة'));
    if (s.ev && t - s.ev.t < 8 * H) out.push('📣 آخر حدث: ' + esc(s.ev.msg) + (s.evRes === 1 ? ' ✅ وصل الهدف' : s.evRes === -1 ? ' ⊘ انلغى' : ''));
    if (s.bx && s.bx.st === 1) out.push('📦 السعر واقف ' + s.bx.n + ' شمعات بين ' + s.bx.bot.toFixed(2) + ' و ' + s.bx.top.toFixed(2));
    else if (s.bx && s.bx.st === 2) out.push((s.bx.dir === 1 ? '🚀 طلعة لفوق' : '🔻 طلعة لتحت') + ' من وقفة · ' + (s.bx.strong ? 'قوية' : 'ضعيفة') + (s.bx.against ? ' · عكس 4H' : '') + (s.bx.failed ? ' · ↺ فشلت' : ''));
    if (s.y) out.push('📅 ' + esc(s.dShort));
    if (s.news) out.push('📰 ' + esc(s.news) + ' — المستويات أضعف وقت الخبر');
    var ls = S.R.sigs[S.R.sigs.length - 1]; if (ls && t - ls.t < 12 * H) out.push((ls.side === 'BUY' ? '🟢 آخر ' : '🔴 آخر ') + ls.side + (ls.plus ? '+' : '') + ' ' + MO.berlinDay(ls.t).slice(5) + ' ' + MO.berlinTime(ls.t + 15 * MIN) + ' (' + ls.conf + '/8)');
    var ln = S.ask && S.ask.lean; if (ln) out.push('🤖 ميل المؤشر: <b>' + (ln.pick === 'bounce' ? 'يرتد' : ln.pick === 'break' ? 'يخترق' : 'محايد') + '</b>' + (ln.why.length ? ' — ' + ln.why.map(esc).join('، ') : ''));
    return out;
  }
  function answer(pick) {
    if (!S.ask) return; var a = S.ask; hideAsk();
    S.round = { lvl: a.lvl, side: a.side, pick: pick, lean: a.lean && a.lean.pick, t0: nowT(), wall: Date.now(), th: thresholds() };
    S.cool[a.lvl.px.toFixed(1)] = 1; S.paused = false;
    toast(pick === 'bounce' ? '↩️ توقعك: يرتد' : '💥 توقعك: يخترق', '', 1100);
  }
  function skip() { if (!S.ask) return; S.cool[S.ask.lvl.px.toFixed(1)] = 1; hideAsk(); S.paused = false; }
  function hideAsk() { S.ask = null; $('ask').classList.add('hidden'); }
  function resolve(p, t) {
    var R = S.round, d = (p - R.lvl.px) * R.side, res = null;
    if (d <= -R.th.brk) res = 'break'; else if (d >= R.th.bnc) res = 'bounce';
    if (!res && t - R.t0 > 60 * MIN) { S.round = null; toast('⌛ ما في نتيجة بعد ساعة — بلا نقاط'); return; }
    if (!res) return;
    S.round = null; var ok = res === R.pick, pts = 0, withMO = ok && R.lean === R.pick;
    if (ok) { pts = 10 + 5 * save.streak + (withMO ? 5 : 0); save.score += pts; save.streak++; save.best = Math.max(save.best, save.streak); } else save.streak = 0;
    save.moN = (save.moN || 0) + (R.lean ? 1 : 0); save.moOk = (save.moOk || 0) + (R.lean && R.lean === res ? 1 : 0);
    save.hist.unshift({ t: t, mode: S.mode, lvl: R.lvl.label, px: +R.lvl.px.toFixed(2), pick: R.pick, res: res, ok: ok, pts: pts, lean: R.lean }); save.hist = save.hist.slice(0, 50); store(); renderScore();
    var y = yOf(R.lvl.px); if (res === 'break') boom(planeX(), y, lvColor(R.lvl)); else ring(planeX(), y, lvColor(R.lvl));
    toast((res === 'break' ? '💥 اخترق!' : '↩️ ارتد!') + '<br>' + (ok ? '✅ صح +' + pts + (withMO ? ' <small>(🤝 مع المؤشر +5)</small>' : '') : '❌ غلط') + (R.lean ? '<br><small>المؤشر كان رأيه: ' + (R.lean === 'bounce' ? 'يرتد' : 'يخترق') + (R.lean === res ? ' ✓' : ' ✗') + '</small>' : ''), ok ? 'ok' : 'bad', 2200);
  }
  function renderScore() { $('score').textContent = save.score; $('streak').textContent = save.streak; $('best').textContent = save.best; var n = save.hist.length, k = save.hist.filter(function (h) { return h.ok; }).length; $('acc').textContent = n ? 'دقّتك ' + Math.round(100 * k / n) + '% من ' + n : ''; }
  // ---------------------------------------------------------------- drawing
  function resize() { DPR = Math.min(2.5, window.devicePixelRatio || 1); W = innerWidth; Ht = innerHeight; cv.width = W * DPR; cv.height = Ht * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  function planeX() { return W * 0.66; }
  var TOP = 175, BOT = 84;
  function yOf(p) { return TOP + (Ht - TOP - BOT) / 2 - (p - S.center) / S.span * (Ht - TOP - BOT) / 2; }
  function xOf(t) { return planeX() - (nowT() - t) / WINDOW * planeX() * 0.95; }
  var clouds = [], stars = [];
  for (var i = 0; i < 9; i++) clouds.push({ x: Math.random() * 1.4, y: Math.random(), z: 0.3 + Math.random() * 0.7, s: 0.6 + Math.random() * 0.8 });
  for (i = 0; i < 70; i++) stars.push({ x: Math.random(), y: Math.random() * 0.7, r: Math.random() * 1.3 + 0.3, tw: Math.random() * 6 });
  function sky(now) {
    var hh = +MO.berlinTime(nowT()).slice(0, 2), night = hh >= 19 || hh < 6, dusk = hh === 6 || hh === 7 || hh === 17 || hh === 18;
    var g = cx.createLinearGradient(0, 0, 0, Ht);
    if (night) { g.addColorStop(0, '#050b1f'); g.addColorStop(0.6, '#0e2350'); g.addColorStop(1, '#1b3a6b'); }
    else if (dusk) { g.addColorStop(0, '#1d2b64'); g.addColorStop(0.55, '#c0587e'); g.addColorStop(1, '#f8b26a'); }
    else { g.addColorStop(0, '#2b6cd4'); g.addColorStop(0.6, '#6fb1f5'); g.addColorStop(1, '#bfe3ff'); }
    cx.fillStyle = g; cx.fillRect(0, 0, W, Ht);
    if (night) { stars.forEach(function (s) { cx.globalAlpha = 0.4 + 0.4 * Math.sin(now / 700 + s.tw); cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(s.x * W, s.y * Ht, s.r, 0, 7); cx.fill(); }); cx.globalAlpha = 1;
      cx.fillStyle = 'rgba(255,245,210,.9)'; cx.beginPath(); cx.arc(W * 0.15, Ht * 0.2, 18, 0, 7); cx.fill(); cx.fillStyle = '#0a1735'; cx.beginPath(); cx.arc(W * 0.15 + 8, Ht * 0.2 - 5, 16, 0, 7); cx.fill(); }
    return night;
  }
  function drawClouds(dt, night) {
    clouds.forEach(function (c) {
      if (!S.paused) c.x -= dt * 0.00004 * c.z; if (c.x < -0.4) { c.x = 1.2 + Math.random() * 0.3; c.y = Math.random(); }
      var x = c.x * W, y = 90 + c.y * (Ht - 200), s = 40 * c.s * (0.6 + c.z);
      cx.globalAlpha = (night ? 0.10 : 0.55) * (0.5 + c.z / 2); cx.fillStyle = '#fff';
      cx.beginPath(); cx.arc(x, y, s, 0, 7); cx.arc(x + s * 0.9, y + s * 0.15, s * 0.75, 0, 7); cx.arc(x - s * 0.9, y + s * 0.2, s * 0.65, 0, 7); cx.arc(x + s * 0.3, y - s * 0.45, s * 0.7, 0, 7); cx.fill();
    }); cx.globalAlpha = 1;
  }
  function drawLevels(now) {
    if (!S.map) return; var lv = S.map.levels, above = null, below = null;
    cx.font = '600 11px Tahoma,Arial'; cx.direction = 'rtl'; cx.textAlign = 'right'; cx.textBaseline = 'bottom';
    lv.forEach(function (l) {
      var y = yOf(l.px);
      if (y < TOP - 4) { if (l.px > S.disp && (!above || l.px < above.px)) above = l; return; }
      if (y > Ht - BOT + 4) { if (l.px < S.disp && (!below || l.px > below.px)) below = l; return; }
      var hot = S.ask && S.ask.lvl === l || S.round && S.round.lvl === l, col = lvColor(l);
      cx.strokeStyle = col; cx.globalAlpha = hot ? 1 : l.watch ? 0.35 : l.star ? 0.95 : 0.7; cx.lineWidth = hot ? 3 : l.star ? 2.2 : 1.4;
      cx.setLineDash(l.chan ? [10, 5] : l.dash ? [4, 5] : []);
      if (hot) { cx.shadowColor = col; cx.shadowBlur = 12 + 6 * Math.sin(now / 150); }
      cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); cx.setLineDash([]); cx.shadowBlur = 0; cx.globalAlpha = 1;
      var txt = l.label + '  ' + l.px.toFixed(2) + (l.lv && l.lv.st === 1 ? ' ✓' : l.lv && l.lv.st === 2 ? ' ✕' : l.lv && l.lv.st === 3 ? ' ↺' : '');
      if (txt.length > 46) txt = txt.slice(0, 44) + '…';
      var w = cx.measureText(txt).width + 10; cx.fillStyle = 'rgba(5,14,32,.62)'; rr(W - w - 6, y - 17, w, 15, 5); cx.fill();
      cx.fillStyle = col; cx.fillText(txt, W - 11, y - 4);
    });
    cx.textBaseline = 'middle';
    [[above, TOP - 14, '▲'], [below, Ht - BOT + 2, '▼']].forEach(function (e) { var l = e[0]; if (!l) return;
      var txt = e[2] + ' ' + l.label + ' ' + l.px.toFixed(2) + ' (' + Math.abs(l.px - S.disp).toFixed(1) + '$)'; var w = cx.measureText(txt).width + 14;
      cx.fillStyle = 'rgba(5,14,32,.7)'; rr(W / 2 - w / 2, e[1] - 10, w, 20, 10); cx.fill(); cx.fillStyle = lvColor(l); cx.textAlign = 'center'; cx.fillText(txt, W / 2, e[1] + 1); cx.textAlign = 'right'; });
  }
  function rr(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
  function drawTrail() {
    var t = nowT(), pts = S.samples.filter(function (q) { return q.t > t - WINDOW * 1.05 && q.t <= t; });
    pts.push({ t: t, p: S.disp }); if (pts.length < 2) return;
    var g = cx.createLinearGradient(0, 0, planeX(), 0); g.addColorStop(0, 'rgba(255,211,77,0)'); g.addColorStop(1, 'rgba(255,211,77,.95)');
    cx.lineJoin = 'round'; cx.lineCap = 'round';
    cx.strokeStyle = 'rgba(255,255,255,.25)'; cx.lineWidth = 7; path(pts); cx.stroke();
    cx.strokeStyle = g; cx.lineWidth = 3; path(pts); cx.stroke();
    // MO BUY / SELL signals on the path
    if (S.R) S.R.sigs.forEach(function (s) { if (s.t < t - WINDOW || s.t > t) return; var x = xOf(s.t + 15 * MIN), y = yOf(s.side === 'BUY' ? s.low : s.high) + (s.side === 'BUY' ? 16 : -16);
      cx.fillStyle = s.side === 'BUY' ? '#22d38a' : '#ff4d6d'; rr(x - 17, y - 9, 34, 18, 6); cx.fill(); cx.fillStyle = s.side === 'BUY' ? '#04210f' : '#fff'; cx.font = '800 10px Arial'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.direction = 'ltr'; cx.fillText(s.side + (s.plus ? '+' : ''), x, y + 1); });
  }
  function path(pts) { cx.beginPath(); var px = null, py = null; pts.forEach(function (q, i) { var x = xOf(q.t), y = yOf(q.p); if (!i) cx.moveTo(x, y); else if (i === pts.length - 1) cx.quadraticCurveTo(px, py, x, y); else cx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2); px = x; py = y; }); }
  function drawPlane(now) {
    var x = planeX(), y = yOf(S.disp), a = S.tilt;
    // exhaust puffs
    if (!S.paused && Math.random() < 0.5) S.fx.push({ k: 'puff', x: x - 26, y: y + Math.sin(a) * -26, vx: -0.05, vy: (Math.random() - 0.5) * 0.02, life: 900, age: 0, r: 3 });
    cx.save(); cx.translate(x, y); cx.rotate(a); var bob = Math.sin(now / 300) * 1.5; cx.translate(0, bob);
    cx.shadowColor = 'rgba(0,0,0,.35)'; cx.shadowBlur = 10; cx.shadowOffsetY = 6;
    var body = cx.createLinearGradient(0, -8, 0, 8); body.addColorStop(0, '#fff6d6'); body.addColorStop(0.5, '#ffd34d'); body.addColorStop(1, '#d9a21b');
    cx.fillStyle = '#e0ac2a'; cx.beginPath(); cx.moveTo(-4, 0); cx.lineTo(-16, -22); cx.lineTo(-8, -22); cx.lineTo(10, 0); cx.closePath(); cx.fill(); // far wing
    cx.fillStyle = body; cx.beginPath(); cx.moveTo(30, 0); cx.quadraticCurveTo(26, -8, 12, -8); cx.lineTo(-22, -6); cx.lineTo(-30, -18); cx.lineTo(-36, -18); cx.lineTo(-32, -2); cx.lineTo(-32, 3); cx.lineTo(12, 8); cx.quadraticCurveTo(28, 7, 30, 0); cx.fill();
    cx.shadowBlur = 0; cx.shadowOffsetY = 0;
    cx.fillStyle = '#f5c23a'; cx.beginPath(); cx.moveTo(-2, 2); cx.lineTo(-18, 24); cx.lineTo(-9, 24); cx.lineTo(12, 3); cx.closePath(); cx.fill(); // near wing
    cx.fillStyle = '#1b3a6b'; for (var i = 0; i < 4; i++) { cx.beginPath(); cx.arc(-10 + i * 6, -2, 1.6, 0, 7); cx.fill(); }
    cx.fillStyle = '#7fd3ff'; cx.beginPath(); cx.moveTo(24, -3); cx.quadraticCurveTo(20, -7, 14, -6.5); cx.lineTo(15, -2); cx.closePath(); cx.fill();
    cx.restore();
    // price tag
    var tag = S.disp.toFixed(2); cx.font = '800 13px Arial'; cx.direction = 'ltr'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    var w = cx.measureText(tag).width + 14; cx.fillStyle = 'rgba(5,14,32,.75)'; rr(x - w / 2, y + 26, w, 20, 8); cx.fill(); cx.fillStyle = '#ffd34d'; cx.fillText(tag, x, y + 37);
  }
  function boom(x, y, col) { S.shake = 400; for (var i = 0; i < 46; i++) { var a = Math.random() * 7, v = 0.08 + Math.random() * 0.3; S.fx.push({ k: 'spark', x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 700 + Math.random() * 600, age: 0, r: 2 + Math.random() * 3, c: i % 3 ? col : '#ffd34d' }); } S.fx.push({ k: 'flash', x: x, y: y, life: 400, age: 0 }); }
  function ring(x, y, col) { for (var i = 0; i < 3; i++) S.fx.push({ k: 'ring', x: x, y: y, life: 900, age: -i * 150, c: col }); for (i = 0; i < 18; i++) { var a = Math.random() * 7; S.fx.push({ k: 'spark', x: x, y: y, vx: Math.cos(a) * 0.12, vy: Math.sin(a) * 0.12, life: 700, age: 0, r: 1.5, c: '#fff' }); } }
  function drawFx(dt) {
    S.fx = S.fx.filter(function (f) { f.age += dt; return f.age < f.life; });
    S.fx.forEach(function (f) { if (f.age < 0) return; var k = f.age / f.life;
      if (f.k === 'puff') { f.x += f.vx * dt - 0.05 * dt; f.y += f.vy * dt; cx.globalAlpha = 0.45 * (1 - k); cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(f.x, f.y, f.r + k * 9, 0, 7); cx.fill(); }
      else if (f.k === 'spark') { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 0.0002 * dt; cx.globalAlpha = 1 - k; cx.fillStyle = f.c; cx.beginPath(); cx.arc(f.x, f.y, f.r * (1 - k * 0.5), 0, 7); cx.fill(); }
      else if (f.k === 'ring') { cx.globalAlpha = 1 - k; cx.strokeStyle = f.c; cx.lineWidth = 3; cx.beginPath(); cx.arc(f.x, f.y, 10 + k * 70, 0, 7); cx.stroke(); }
      else if (f.k === 'flash') { var g = cx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 120); g.addColorStop(0, 'rgba(255,240,180,' + (1 - k) + ')'); g.addColorStop(1, 'rgba(255,120,40,0)'); cx.globalAlpha = 1; cx.fillStyle = g; cx.fillRect(f.x - 120, f.y - 120, 240, 240); }
    }); cx.globalAlpha = 1;
  }
  // ---------------------------------------------------------------- frame
  var lastF = performance.now(), lastSec = 0;
  function frame(now) {
    var dt = Math.min(60, now - lastF); lastF = now;
    if (S.mode === 'replay' && !S.paused && S.simPath.length) { // 1 five-minute candle every ~2 s
      S.simT += dt * 150; var P = S.simPath;
      while (S.simIdx < P.length - 1 && P[S.simIdx + 1].t <= S.simT) { S.simIdx++; S.samples.push(P[S.simIdx]); }
      if (S.simIdx >= P.length - 1) { S.paused = true; toast('🏁 خلص الريبلاي<br><small>اضغط 🟢 مباشر أو 🔁 لتعيد</small>', '', 3000); }
      else { var a = P[S.simIdx], b = P[S.simIdx + 1], u = (S.simT - a.t) / (b.t - a.t); S.price = a.p + (b.p - a.p) * Math.min(1, Math.max(0, u)); }
      if (S.simT - S.mapAt > 15 * MIN) rebuildMap(); else if (S.simT - (S.lvAt || 0) > 2 * MIN) { S.lvAt = S.simT; buildLevels(); }
      checkLevels(S.price, S.simT);
    }
    if (S.mode === 'live' && S.mapAt && Date.now() - S.mapAt > 60e3) { S.mapAt = Date.now(); rebuildMap(); }
    if (S.price != null) {
      if (S.disp == null) S.disp = S.price;
      var prev = S.disp; S.disp += (S.price - S.disp) * Math.min(1, dt / (S.mode === 'live' ? 900 : 160));
      S.vel += ((S.disp - prev) / Math.max(1, dt) - S.vel) * 0.08;
      if (S.center == null) S.center = S.disp;
      // scale: keep the plane and the nearest level on each side in view
      var lv = S.map ? S.map.levels : [], up = null, dn = null; lv.forEach(function (l) { if (l.px >= S.disp && (up == null || l.px < up)) up = l.px; if (l.px < S.disp && (dn == null || l.px > dn)) dn = l.px; });
      var need = Math.max(up != null ? up - S.disp : 0, dn != null ? S.disp - dn : 0, 8), want = Math.min(40, Math.max(12, need * 1.25));
      S.span += (want - S.span) * Math.min(1, dt / 600); S.center += (S.disp - S.center) * Math.min(1, dt / 500);
      var pxPer = (Ht - TOP - BOT) / 2 / S.span, tgt = Math.max(-0.45, Math.min(0.45, -S.vel * pxPer * (S.mode === 'live' ? 250 : 60)));
      S.tilt += (tgt - S.tilt) * Math.min(1, dt / 250);
    }
    cx.save(); if (S.shake > 0) { S.shake -= dt; cx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8); }
    var night = sky(now); drawClouds(dt, night);
    if (S.disp != null) { drawLevels(now); drawTrail(); drawPlane(now); }
    else { cx.fillStyle = '#fff'; cx.font = '700 18px Tahoma'; cx.textAlign = 'center'; cx.direction = 'rtl'; cx.fillText('✈️ عم جيب سعر الدهب…', W / 2, Ht / 2); }
    drawFx(dt); cx.restore();
    if (S.ask) { var T = S.mode === 'live' ? 30e3 : 1e9, left = 1 - (Date.now() - S.ask.t0) / T; $('askBar').style.width = (S.mode === 'live' ? Math.max(0, left) * 100 : 100) + '%'; if (left <= 0) { skip(); toast('⌛ راحت عليك هالمرة'); } }
    if (now - lastSec > 500) { lastSec = now; hud(); }
    requestAnimationFrame(frame);
  }
  function hud() {
    if (S.disp != null) $('price').textContent = S.disp.toFixed(2);
    var t = nowT(); $('clock').textContent = (S.mode === 'replay' ? '⏪ ' + MO.berlinDay(t).slice(5) + ' ' : '') + MO.berlinTime(t) + ' برلين';
    var d1 = S.data.d1q, ref = d1 && d1.length > 1 ? d1[d1.length - 2].c : null;
    if (S.mode === 'live' && ref && S.price) { var c = S.price - ref; $('chg').innerHTML = '<span class="' + (c >= 0 ? 'ok' : 'bad') + '" dir="ltr">' + (c >= 0 ? '+' : '') + c.toFixed(2) + '</span> اليوم'; }
    else if (S.mode === 'replay') $('chg').textContent = 'ريبلاي: ' + (S.replaySrc || '');
    else $('chg').textContent = 'XAUUSD';
  }
  // ---------------------------------------------------------------- panels
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function openPanel(html) { $('panelBody').innerHTML = html; $('panel').classList.remove('hidden'); }
  function readPanel() {
    var R = S.R, s = R && R.snap, m = S.map; if (!s) return openPanel('<h3>لسا عم حمّل المؤشر…</h3>');
    var p = S.disp || s.close, f = function (x) { return x == null ? '—' : (+x).toFixed(2); };
    var h = '<h3>🧭 MO Gold Pro · 15د مع خريطة 4H</h3><div class="small">4H ' + (s.bias === 1 ? '▲ صاعد' : s.bias === -1 ? '▼ هابط' : '— محايد') + ' · المؤكدات ▲' + s.upConf + '/8 ▼' + s.dnConf + '/8 · ATR15 ' + f(s.atr) + ' · ATR4H ' + f(s.atr4) + (s.trendOk ? '' : ' · الغيمة متذبذبة (فلتر الغيمة موقّف الإشارات)') + '</div>';
    h += '<h3>🗺️ الخريطة (أقوى 3 فوق و3 تحت)</h3><table>' + s.map.slice().sort(function (a, b) { return b.p - a.p; }).map(function (l) {
      return '<tr><td><span class="dot" style="background:' + (l.p > p ? '#ff5c5c' : '#9cff3c') + '"></span>' + (l.star ? '★ ' : '') + esc(tagTxt(l.t)) + '</td><td class="n">' + f(l.p) + '</td><td class="n">' + l.C + '</td><td>' + (l.st === 1 ? '✓ ارتد ' + l.nb : l.st === 2 ? '✕ انكسر' : l.st === 3 ? '↺ سحب' : '') + (l.fl ? ' ⇅' : '') + '</td><td class="n ' + (l.p > p ? 'bad' : 'ok') + '">' + (l.p > p ? '+' : '') + (l.p - p).toFixed(1) + '</td></tr>'; }).join('') + '</table>';
    if (s.ev) h += '<div class="small">📣 ' + esc(s.ev.msg) + (s.evRes === 1 ? ' ✅ وصل' : s.evRes === -1 ? ' ⊘ انلغى' : ' ⏳') + '</div>';
    var chs = MOP.chLines(nowT()); h += '<h3>📐 قنواتي</h3><table>' + [0, 1, 2].map(function (c) { var q = chs.slice(c * 3, c * 3 + 3); return '<tr><td>' + esc(q[0].name.split(' ')[0]) + (c === 2 ? (s.c3On ? ' (فعّالة)' : ' (مراقبة)') : '') + '</td>' + q.map(function (x) { return '<td class="n">' + f(x.px) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table><div class="small">سقف · وسط · أرضية — من نقاط الخطوط بالمؤشر</div>';
    var pr = function (n, x) { return x ? '<tr><td>' + n + '</td><td class="n">VAH ' + f(x.vah) + '</td><td class="n">POC ' + f(x.poc) + '</td><td class="n">VAL ' + f(x.val) + '</td></tr>' : ''; };
    h += '<h3>📊 البروفايل اليومي (70%)</h3><table>' + pr('اليوم', s.today) + pr('الأمس', s.y) + '</table><div class="small">' + esc(s.dShort || '') + (s.yNaked ? ' · 🧲 POC الأمس ما انلمس' : '') + '</div>';
    var X = s.X4; h += '<h3>💧 4H</h3><div class="small">سيولة فوق ' + f(X.lh1) + ' / ' + f(X.lh2) + ' · تحت ' + f(X.ll1) + ' / ' + f(X.ll2) + ' · S/R ' + f(X.srH) + ' / ' + f(X.srL) + ' · بروفايل 4H POC ' + f(X.poc) + '</div>';
    if (s.bx && s.bx.st) h += '<div class="small">📦 ' + (s.bx.st === 1 ? 'وقفة ' + s.bx.n + ' شمعات ' + f(s.bx.bot) + '–' + f(s.bx.top) : (s.bx.dir === 1 ? '🚀 طلعة لفوق' : '🔻 طلعة لتحت') + (s.bx.strong ? ' قوية' : ' ضعيفة')) + '</div>';
    var sl = R.sigs.slice(-6).reverse();
    h += '<h3>🚦 إشارات MO (15د)</h3>' + (sl.length ? '<table>' + sl.map(function (x) { return '<tr><td>' + (x.side === 'BUY' ? '🟢 BUY' : '🔴 SELL') + (x.plus ? '+' : '') + '</td><td class="n">' + MO.berlinDay(x.t).slice(5) + ' ' + MO.berlinTime(x.t + 15 * MIN) + '</td><td class="n">' + f(x.px) + '</td><td class="n">' + x.conf + '/8</td><td>' + esc((x.why || []).join('، ')) + '</td></tr>'; }).join('') + '</table>' : '<div class="small">ما في إشارات بالبيانات المحمّلة.</div>');
    var ev = R.evs.slice(-5).reverse(); if (ev.length) h += '<h3>📣 آخر أحداث المستويات</h3><table>' + ev.map(function (e) { return '<tr><td class="n">' + MO.berlinTime(e.t + 15 * MIN) + '</td><td>' + esc(e.msg) + '</td></tr>'; }).join('') + '</table>';
    var n = R.stats.C.reduce(function (a, b) { return a + b; }, 0); h += '<div class="small" style="margin-top:8px">🧠 ذاكرة التعلّم: ' + n + ' تجربة من التاريخ المحمّل' + (save.mem ? ' + ذاكرتك الملصوقة' : '') + ' · ميل المؤشر صاب ' + (save.moN ? Math.round(100 * save.moOk / save.moN) + '% من ' + save.moN : '—') + '</div>';
    h += '<div class="small" style="margin-top:6px">الشموع: ' + esc(S.candleSrc || '') + ' · السعر: ' + esc(S.mode === 'live' ? S.src : S.replaySrc || '') + ' · الوقت = إغلاق الشمعة (برلين)</div>';
    openPanel(h);
  }
  function histPanel() {
    var h = '<h3>📜 آخر توقعاتك</h3>' + (save.hist.length ? '<table>' + save.hist.slice(0, 30).map(function (x) { return '<tr><td>' + (x.ok ? '✅' : '❌') + '</td><td>' + esc(x.lvl) + '</td><td class="n">' + x.px.toFixed(2) + '</td><td>' + (x.pick === 'bounce' ? 'يرتد' : 'يخترق') + ' ← ' + (x.res === 'bounce' ? 'ارتد' : 'اخترق') + '</td><td class="n">' + MO.berlinTime(x.t) + (x.mode === 'replay' ? ' ⏪' : '') + '</td></tr>'; }).join('') + '</table>' : '<div class="small">لسا ما في توقعات.</div>');
    h += '<div class="row" style="margin-top:12px"><button class="btn g" id="rst">تصفير النقاط</button></div>'; openPanel(h);
    $('rst').onclick = function () { if (confirm('أكيد بدك تصفّر النقاط والسجل؟')) { save.score = save.best = save.streak = 0; save.hist = []; store(); renderScore(); histPanel(); } };
  }
  var GN = GROUPS;
  function setPanel() {
    var h = '<h3>⚙️ الإعدادات</h3><div class="row">السؤال بيطلع لما السعر يقرب <input type="number" id="sNear" step="0.5" min="1" value="' + near() + '" style="max-width:80px"> $ من الخط</div>';
    h += '<h3>الخطوط الظاهرة</h3><div class="row">' + Object.keys(GN).map(function (k) { return '<label class="tg"><input type="checkbox" data-g="' + k + '"' + (save.groups[k] ? ' checked' : '') + '>' + GN[k] + '</label>'; }).join('') + '</div>';
    h += '<h3>مستوياتي (اختياري)</h3><table>' + save.custom.map(function (c, i) { return '<tr><td>' + esc(c.name) + '</td><td class="n">' + (+c.px).toFixed(2) + '</td><td><button class="btn g" data-del="' + i + '">🗑</button></td></tr>'; }).join('') + '</table>';
    h += '<div class="row"><input type="text" id="cName" placeholder="الاسم"><input type="number" id="cPx" step="0.01" placeholder="السعر" dir="ltr"><button class="btn" id="cAdd">➕ أضف</button></div>';
    h += '<div class="row"><label class="tg"><input type="checkbox" id="sWatch"' + (save.showWatch ? ' checked' : '') + '>اعرض القناة الخضرا (صفراء) وهي بوضع مراقبة</label></div>';
    h += '<h3>📰 أخبار (متل news.txt بالمؤشر)</h3><textarea id="sNews" rows="3" dir="ltr" style="width:100%" placeholder="2026-11-12 14:30 CPI">' + esc(save.news || '') + '</textarea><div class="small">سطر لكل خبر: التاريخ والوقت بتوقيت برلين + الاسم. أيام الفدرالي محسوبة لحالها.</div>';
    h += '<h3>🧠 ذاكرة MOMEM1 (اختياري)</h3><textarea id="sMem" rows="2" dir="ltr" style="width:100%" placeholder="MOMEM1|...">' + esc(save.mem || '') + '</textarea>';
    h += '<div class="row"><button class="btn" id="sSave">💾 احفظ وأعد الحساب</button></div>';
    openPanel(h);
    $('sWatch').onchange = function () { save.showWatch = this.checked ? 1 : 0; store(); buildLevels(); };
    $('sSave').onclick = function () { save.news = $('sNews').value; save.mem = $('sMem').value.trim(); store(); rebuildMap(true); toast('✅ انحفظ'); };
    $('sNear').onchange = function () { save.near = Math.max(1, +this.value || 3); store(); };
    [].forEach.call(document.querySelectorAll('[data-g]'), function (el) { el.onchange = function () { save.groups[el.dataset.g] = el.checked ? 1 : 0; store(); rebuildMap(); }; });
    [].forEach.call(document.querySelectorAll('[data-del]'), function (el) { el.onclick = function () { save.custom.splice(+el.dataset.del, 1); store(); rebuildMap(); setPanel(); }; });
    $('cAdd').onclick = function () { var px = parseFloat($('cPx').value); if (!(px > 100)) return; save.custom.push({ name: $('cName').value.trim() || 'مستواي', px: px }); store(); rebuildMap(); setPanel(); };
  }
  var toastT; function toast(html, cls, ms) { var t = $('toast'); t.innerHTML = html; t.className = cls || ''; clearTimeout(toastT); toastT = setTimeout(function () { t.className = 'hidden'; }, ms || 2200); }
  // ---------------------------------------------------------------- boot
  $('aBounce').onclick = function () { answer('bounce'); }; $('aBreak').onclick = function () { answer('break'); }; $('aSkip').onclick = skip;
  $('bRead').onclick = readPanel; $('bHist').onclick = histPanel; $('bSet').onclick = setPanel;
  $('bMode').onclick = function () { if (S.mode === 'replay') { S.disp = null; S.center = null; loadCandles(false).then(startLive); } else startReplay(); };
  document.querySelector('[data-close]').onclick = function () { $('panel').classList.add('hidden'); };
  addEventListener('resize', resize); resize(); renderScore(); requestAnimationFrame(frame);
  loadCandles(true).then(function () { startLive(); });
  setInterval(function () { if (S.mode === 'live') tick(); }, 3000);
  setInterval(function () { if (S.mode === 'live') loadCandles(false); }, 60e3);
  setInterval(function () { if (S.mode === 'live') loadCandles(true); }, 10 * 60e3);
  window.__flight = S;
})();
