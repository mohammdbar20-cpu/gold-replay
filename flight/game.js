/* طيارة الدهب — live XAUUSD prediction game. Price: api.gold-api.com (live, every 3 s), candles: biquote.io (same source as channels15). */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var BQ = 'https://biquote.io/api/XAUUSD/ohlc?interval=', GOLDAPI = 'https://api.gold-api.com/price/XAU';
  var MIN = 60e3, H = 3600e3, WINDOW = 90 * MIN;
  var cv = $('cv'), cx = cv.getContext('2d'), W = 0, Ht = 0, DPR = 1;
  var LS = 'flight.v1', save = load();
  function load() { try { var s = JSON.parse(localStorage.getItem(LS)); if (s) return s; } catch (e) {} return { score: 0, best: 0, streak: 0, hist: [], custom: [], near: 3, groups: { grok: 1, liq: 1, sr: 1, ema: 1, prof: 1, round: 1, custom: 1 } }; }
  function store() { try { localStorage.setItem(LS, JSON.stringify(save)); } catch (e) {} }
  var S = { mode: 'boot', price: null, disp: null, src: '', lastTick: 0, samples: [], data: { m15: [], h1: [], h4: [], m5: [] }, map: null, sig: null, mapAt: 0,
    simT: 0, simPath: [], simIdx: 0, paused: false, ask: null, round: null, cool: {}, fx: [], center: null, span: 20, tilt: 0, vel: 0, fetchErr: 0, liveOk: false, closed: false, dayChg: null };
  // ---------------------------------------------------------------- data
  function bq(iv, n) { return fetch(BQ + iv + '&limit=' + n, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
    return d.bars.map(function (b) { return { t: Date.parse(b.openTime), o: +b.open, h: +b.high, l: +b.low, c: +b.close, v: +(b.tickVolume || b.volume || 0), open: !!b.isOpen }; }).sort(function (a, b) { return a.t - b.t; }); }); }
  function fromStatic(a) { return a.map(function (r) { return { t: r[0] * 1000, o: r[1], h: r[2], l: r[3], c: r[4], v: r[5] || 1, open: false }; }); }
  var staticData = null;
  function getStatic() { return staticData ? Promise.resolve(staticData) : fetch('replay.json?v=1').then(function (r) { return r.json(); }).then(function (j) { staticData = j; return j; }); }
  function loadCandles(full) {
    var jobs = [bq('15m', 200).then(function (b) { S.data.m15 = b; })];
    jobs.push(bq('5m', 30).then(function (b) { S.data.m5 = b; }).catch(function () {}));
    if (full) jobs.push(bq('1h', 200).then(function (b) { S.data.h1 = b; }), bq('4h', 200).then(function (b) { S.data.h4 = b; }), bq('1d', 3).then(function (b) { S.data.d1 = b; }));
    return Promise.all(jobs).then(function () { S.candleSrc = 'biquote.io'; S.fetchErr = 0; }).catch(function (e) {
      S.fetchErr++; if (S.data.h4.length) return;
      return getStatic().then(function (j) { S.data.m15 = fromStatic(j.m15); S.data.h1 = fromStatic(j.h1); S.data.h4 = fromStatic(j.h4); S.candleSrc = 'نسخة محفوظة ' + j.made.slice(0, 10); });
    });
  }
  function pollPrice() {
    return fetch(GOLDAPI, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      var p = +j.price, age = Date.now() - Date.parse(j.updatedAt); if (!(p > 100)) throw new Error('bad');
      return { p: p, age: age, src: 'gold-api.com' };
    }).catch(function () { // fallback: last 15m candle from biquote
      return bq('15m', 2).then(function (b) { var l = b[b.length - 1]; return { p: l.c, age: Date.now() - l.t - (l.open ? 0 : 15 * MIN), src: 'biquote.io' }; });
    });
  }
  // ---------------------------------------------------------------- level map (indicator)
  function nowT() { return S.mode === 'replay' ? S.simT : Date.now(); }
  function upto(bs, t) { return bs.filter(function (b) { return b.t <= t; }).map(function (b) { return b; }); }
  function rebuildMap() {
    var t = nowT(), d = S.data, m15 = S.mode === 'replay' ? upto(d.m15, t) : d.m15, h4 = S.mode === 'replay' ? upto(d.h4, t) : d.h4, h1 = S.mode === 'replay' ? upto(d.h1, t) : d.h1;
    if (S.mode === 'replay') { var last = m15[m15.length - 1]; if (last && last.t + 15 * MIN > t) { last = Object.assign({}, last, { open: true }); m15[m15.length - 1] = last; } }
    S.ctx = { m15: m15, h4: h4, h1: h1, now: t };
    var custom = save.groups.custom ? save.custom : [];
    var m = MO.levelMap({ m15: m15, h4: h4, now: t, price: S.price, custom: custom });
    m.levels = m.levels.filter(function (l) { return l.groups.some(function (g) { return save.groups[g]; }); });
    S.map = m; S.sig = MO.signals(m15, h1, h4, t); S.mapAt = t;
    var tc = $('trendchip'); if (S.sig.trend) { tc.classList.remove('hidden'); tc.textContent = (S.sig.trend > 0 ? '☁️ الغيمة خضرا (فوق)' : '☁️ الغيمة حمرا (تحت)') + (S.sig.trendOk ? '' : ' · تذبذب'); } else tc.classList.add('hidden');
  }
  // ---------------------------------------------------------------- modes
  function setStatus(txt, cls) { var s = $('status'); s.textContent = txt; s.className = 'pill ' + (cls || ''); }
  function startLive() {
    S.mode = 'live'; S.paused = false; S.samples = []; S.round = null; hideAsk(); S.cool = {};
    // prefill the trail with the last 90 min of 15m candles so the plane has a path behind it
    var t0 = Date.now() - WINDOW, pre = S.data.m5.length ? S.data.m5 : S.data.m15, pm = S.data.m5.length ? 5 : 15; pre.forEach(function (b) { if (b.t + pm * MIN > t0) barPath(b, pm).forEach(function (q) { if (q.t < Date.now()) S.samples.push(q); }); });
    $('bMode').textContent = '🔁 ريبلاي'; rebuildMap(); tick(true);
  }
  function startReplay(reason) {
    var go = function (bars, label) {
      S.mode = 'replay'; S.replaySrc = label; S.round = null; hideAsk(); S.cool = {}; S.paused = false;
      var start = bars.length > 150 ? bars.length - 150 : 0; S.simPath = []; bars.slice(start).forEach(function (b) { S.simPath = S.simPath.concat(barPath(b, 5)); });
      S.samples = S.simPath.filter(function (q) { return q.t < S.simPath[12].t; }); S.simIdx = 12; S.simT = S.simPath[12].t; S.price = S.disp = S.simPath[12].p;
      $('bMode').textContent = '🟢 مباشر'; setStatus('⏪ ريبلاي' + (reason ? ' · ' + reason : ''), 'replay'); rebuildMap();
    };
    bq('5m', 300).then(function (b) { go(b.filter(function (x) { return !x.open; }), 'biquote.io 5m'); }).catch(function () {
      getStatic().then(function (j) { if (!S.data.h4.length) { S.data.m15 = fromStatic(j.m15); S.data.h1 = fromStatic(j.h1); S.data.h4 = fromStatic(j.h4); } go(fromStatic(j.m5), 'نسخة محفوظة'); });
    });
  }
  function barPath(b, mins) { // o -> nearer extreme -> other extreme -> c, spread over the bar duration
    var dur = mins * MIN, hiFirst = Math.abs(b.h - b.o) < Math.abs(b.o - b.l);
    var a = hiFirst ? b.h : b.l, z = hiFirst ? b.l : b.h;
    return [{ t: b.t, p: b.o }, { t: b.t + dur * 0.3, p: a }, { t: b.t + dur * 0.7, p: z }, { t: b.t + dur * 0.98, p: b.c }];
  }
  // ---------------------------------------------------------------- live loop
  var tickBusy = false;
  function tick(first) {
    if (S.mode !== 'live' || tickBusy) return; tickBusy = true;
    pollPrice().then(function (r) {
      var firstP = S.price == null; S.liveOk = true; S.src = r.src; S.price = r.p; if (firstP) rebuildMap(); if (S.disp == null) S.disp = r.p; S.lastTick = Date.now();
      S.samples.push({ t: Date.now(), p: r.p });
      S.closed = r.age > 20 * MIN;
      if (S.closed) { setStatus('🌙 السوق مغلق', 'err'); if (first) { toast('السوق مغلق هلق 🌙<br><small>عم شغّل ريبلاي لآخر شموع حقيقية</small>'); startReplay('السوق مغلق'); } }
      else setStatus('🟢 مباشر · ' + r.src, 'live');
      if (S.mode === 'live') checkLevels(r.p, Date.now());
    }).catch(function () { setStatus('⚠️ ما في سعر حي', 'err'); if (first) { toast('ما قدرت جيب السعر الحي ⚠️<br><small>عم شغّل ريبلاي</small>'); startReplay('ما في اتصال'); } })
      .then(function () { tickBusy = false; });
  }
  // ---------------------------------------------------------------- game rules
  function near() { return Math.max(1, +save.near || 3); }
  function thresholds() { var a = (S.ctx && MO.atr(S.ctx.m15.filter(function (b) { return !b.open; }))) || 6; return { brk: Math.max(2, 0.25 * a), bnc: near() + Math.max(3, 0.4 * a) }; }
  function checkLevels(p, t) {
    if (!S.map) return;
    S.map.levels.forEach(function (l) { var k = l.px.toFixed(1); if (S.cool[k] && Math.abs(p - l.px) > near() * 3) delete S.cool[k]; });
    if (S.round) { resolve(p, t); return; }
    if (S.ask) return;
    var best = null; S.map.levels.forEach(function (l) { var d = Math.abs(p - l.px); if (d <= near() && !S.cool[l.px.toFixed(1)] && (!best || d < Math.abs(p - best.px))) best = l; });
    if (best) openAsk(best, p, t);
  }
  function openAsk(l, p, t) {
    var side = p >= l.px ? 1 : -1; S.ask = { lvl: l, side: side, t0: Date.now(), p0: p };
    if (S.mode === 'replay') S.paused = true;
    $('askTitle').innerHTML = '✈️ الطيارة قرّبت من <span style="color:' + l.color + '">' + esc(l.label) + '</span>';
    $('askSub').innerHTML = 'الخط <b dir="ltr">' + l.px.toFixed(2) + '</b> · السعر <b dir="ltr">' + p.toFixed(2) + '</b> ' + (side > 0 ? 'فوق الخط ⬆️' : 'تحت الخط ⬇️') + ' · بفرق <b dir="ltr">' + Math.abs(p - l.px).toFixed(2) + '$</b>';
    $('aBounce').innerHTML = (side > 0 ? '⬆️' : '⬇️') + ' يرتد';
    $('aBreak').innerHTML = (side > 0 ? '⬇️' : '⬆️') + ' يخترق';
    $('askHints').innerHTML = hints(l, side, t).map(function (h) { return '<li>' + h + '</li>'; }).join('');
    $('ask').classList.remove('hidden');
  }
  function hints(l, side, t) {
    var out = [], c = S.ctx, r = c ? MO.moRead(c.m15, c.h4, side > 0 ? 'BUY' : 'SELL', l.px, t) : null;
    var stars = l.stars; out.push('⭐'.repeat(Math.min(5, stars)) + ' ' + (l.conf.length ? 'مع الخط: ' + l.conf.map(esc).join(' + ') : 'الخط لحاله، ما في مستوى تاني جنبه'));
    if (r) {
      out.push(r.knife ? '⚠️ السعر جاي على الخط بشمعة قوية (سكين) — الاختراق أقوى' : '✅ ما في اندفاع قوي على الخط');
      out.push(r.pause ? '📦 وقفة ' + r.pause + ' شمعات 15د قرب الخط' : '📦 ما في وقفة قرب الخط');
      if (r.sweep) out.push('↺ ذيل خرق الخط وكان إغلاق الشمعة جوّا (سحب سيولة) — بيدعم الارتداد');
      if (r.conf.length) out.push('🧭 من المؤشر عند الخط: ' + r.conf.map(esc).join(' + '));
    }
    if (S.sig && S.sig.trend) out.push(S.sig.trend > 0 ? '☁️ الغيمة خضرا: الاتجاه فوق' + (side > 0 ? ' (مع الارتداد)' : ' (مع الاختراق لفوق)') : '☁️ الغيمة حمرا: الاتجاه تحت' + (side < 0 ? ' (مع الارتداد)' : ' (مع الاختراق لتحت)'));
    var ls = S.sig && S.sig.list[S.sig.list.length - 1]; if (ls && t - ls.t < 8 * H) out.push((ls.side === 'BUY' ? '🟢 آخر إشارة BUY' : '🔴 آخر إشارة SELL') + ' الساعة ' + MO.berlinTime(ls.t) + ' (برلين)');
    var r8 = S.map && S.map.r80; if (r8 && r8.active) out.push('8️⃣0️⃣ قاعدة 80%: السعر رجع لجوّا منطقة القيمة تبع الأمس، الهدف ' + r8.target.toFixed(2));
    return out;
  }
  function answer(pick) {
    if (!S.ask) return; var a = S.ask; hideAsk();
    S.round = { lvl: a.lvl, side: a.side, pick: pick, t0: nowT(), wall: Date.now(), th: thresholds() };
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
    S.round = null; var ok = res === R.pick, pts = 0;
    if (ok) { pts = 10 + 5 * save.streak + (R.lvl.stars > 2 ? 5 : 0); save.score += pts; save.streak++; save.best = Math.max(save.best, save.streak); } else save.streak = 0;
    save.hist.unshift({ t: t, mode: S.mode, lvl: R.lvl.label, px: +R.lvl.px.toFixed(2), pick: R.pick, res: res, ok: ok, pts: pts }); save.hist = save.hist.slice(0, 50); store(); renderScore();
    var y = yOf(R.lvl.px); if (res === 'break') boom(planeX(), y, R.lvl.color); else ring(planeX(), y, R.lvl.color);
    toast((res === 'break' ? '💥 اخترق!' : '↩️ ارتد!') + '<br>' + (ok ? '✅ صح +' + pts : '❌ غلط'), ok ? 'ok' : 'bad', 1800);
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
      var hot = S.ask && S.ask.lvl === l || S.round && S.round.lvl === l, grok = l.groups.indexOf('grok') >= 0;
      cx.strokeStyle = l.color; cx.globalAlpha = hot ? 1 : grok ? 0.9 : 0.65; cx.lineWidth = hot ? 3 : grok ? 2 : 1.3;
      cx.setLineDash(l.groups.indexOf('round') >= 0 && l.groups.length === 1 ? [3, 6] : l.groups.indexOf('prof') >= 0 && !grok ? [8, 5] : []);
      if (hot) { cx.shadowColor = l.color; cx.shadowBlur = 12 + 6 * Math.sin(now / 150); }
      cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); cx.setLineDash([]); cx.shadowBlur = 0; cx.globalAlpha = 1;
      var txt = l.label + '  ' + l.px.toFixed(2) + (l.stars > 2 ? ' ⭐' : '');
      var w = cx.measureText(txt).width + 10; cx.fillStyle = 'rgba(5,14,32,.62)'; rr(W - w - 6, y - 17, w, 15, 5); cx.fill();
      cx.fillStyle = l.color; cx.fillText(txt, W - 11, y - 4);
    });
    cx.textBaseline = 'middle';
    [[above, TOP - 14, '▲'], [below, Ht - BOT + 2, '▼']].forEach(function (e) { var l = e[0]; if (!l) return;
      var txt = e[2] + ' ' + l.label + ' ' + l.px.toFixed(2) + ' (' + Math.abs(l.px - S.disp).toFixed(1) + '$)'; var w = cx.measureText(txt).width + 14;
      cx.fillStyle = 'rgba(5,14,32,.7)'; rr(W / 2 - w / 2, e[1] - 10, w, 20, 10); cx.fill(); cx.fillStyle = l.color; cx.textAlign = 'center'; cx.fillText(txt, W / 2, e[1] + 1); cx.textAlign = 'right'; });
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
    if (S.sig) S.sig.list.forEach(function (s) { if (s.t < t - WINDOW || s.t > t) return; var x = xOf(s.t + 15 * MIN), y = yOf(s.side === 'BUY' ? s.low : s.high) + (s.side === 'BUY' ? 16 : -16);
      cx.fillStyle = s.side === 'BUY' ? '#22d38a' : '#ff4d6d'; rr(x - 17, y - 9, 34, 18, 6); cx.fill(); cx.fillStyle = s.side === 'BUY' ? '#04210f' : '#fff'; cx.font = '800 10px Arial'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.direction = 'ltr'; cx.fillText(s.side, x, y + 1); });
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
      if (S.simT - S.mapAt > 5 * MIN) rebuildMap();
      checkLevels(S.price, S.simT);
    }
    if (S.mode === 'live' && S.mapAt && Date.now() - S.mapAt > 60e3) rebuildMap();
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
    var d1 = S.data.d1, ref = d1 && d1.length > 1 ? d1[d1.length - 2].c : null;
    if (S.mode === 'live' && ref && S.price) { var c = S.price - ref; $('chg').innerHTML = '<span class="' + (c >= 0 ? 'ok' : 'bad') + '" dir="ltr">' + (c >= 0 ? '+' : '') + c.toFixed(2) + '</span> اليوم'; }
    else if (S.mode === 'replay') $('chg').textContent = 'ريبلاي: ' + (S.replaySrc || '');
    else $('chg').textContent = 'XAUUSD';
  }
  // ---------------------------------------------------------------- panels
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function openPanel(html) { $('panelBody').innerHTML = html; $('panel').classList.remove('hidden'); }
  function readPanel() {
    var m = S.map, s = S.sig; if (!m) return openPanel('<h3>لسا عم حمّل المؤشر…</h3>');
    var p = S.disp, rows = m.levels.slice().sort(function (a, b) { return Math.abs(a.px - p) - Math.abs(b.px - p); }).slice(0, 14).sort(function (a, b) { return b.px - a.px; });
    var h = '<h3>🧭 خريطة المستويات (MO Gold Pro)</h3><table>' + rows.map(function (l) { return '<tr><td><span class="dot" style="background:' + l.color + '"></span>' + esc(l.label) + (l.stars > 2 ? ' ⭐' : '') + '</td><td class="n">' + l.px.toFixed(2) + '</td><td class="n ' + (l.px > p ? 'bad' : 'ok') + '">' + (l.px > p ? '+' : '') + (l.px - p).toFixed(1) + '</td></tr>'; }).join('') + '</table>';
    var g = m.grok; h += '<h3>📐 قناة 4H Grok</h3><table><tr><td>سقف</td><td class="n">' + g.roof.toFixed(2) + '</td></tr><tr><td>نص</td><td class="n">' + g.mid.toFixed(2) + '</td></tr><tr><td>أرض</td><td class="n">' + g.floor.toFixed(2) + '</td></tr></table>';
    var dp = m.profile, pr = function (n, x) { return x ? '<tr><td>' + n + '</td><td class="n">VAH ' + x.vah.toFixed(2) + '</td><td class="n">POC ' + x.poc.toFixed(2) + '</td><td class="n">VAL ' + x.val.toFixed(2) + '</td></tr>' : ''; };
    h += '<h3>📊 البروفايل اليومي (70%)</h3><table>' + pr('اليوم', dp.today) + pr('الأمس', dp.yday) + '</table>';
    h += '<div class="small">' + (m.r80 ? (m.r80.active ? '8️⃣0️⃣ قاعدة 80% فعّالة: الهدف ' + m.r80.target.toFixed(2) : '8️⃣0️⃣ اليوم فتح برّا منطقة القيمة تبع الأمس (من جهة ' + m.r80.from + ')، بس لسا ما رجع لجوّا') : '8️⃣0️⃣ قاعدة 80% مش فعّالة اليوم') + '</div>';
    h += '<h3>🚦 إشارات MO على 15د</h3>' + (s ? '<div class="small">☁️ ' + (s.trend > 0 ? 'الغيمة خضرا' : s.trend < 0 ? 'الغيمة حمرا' : '—') + ' · أصفر 1س ' + (s.yellow ? s.yellow.toFixed(2) : '—') + ' · أخضر 4س ' + (s.green ? s.green.toFixed(2) : '—') + ' · VWAP ' + (s.vwap ? s.vwap.toFixed(2) : '—') + (s.trendOk ? '' : ' · تذبذب (فلتر الغيمة موقّف الإشارات)') + '</div>' : '');
    var sl = s ? s.list.slice(-6).reverse() : [];
    h += sl.length ? '<table>' + sl.map(function (x) { var at = m.levels.filter(function (l) { return Math.abs((x.side === 'BUY' ? x.low : x.high) - l.px) <= m.tol && l.groups.some(function (g) { return g !== 'round'; }); })[0];
      return '<tr><td>' + (x.side === 'BUY' ? '🟢 BUY' : '🔴 SELL') + '</td><td class="n">' + MO.berlinDay(x.t).slice(5) + ' ' + MO.berlinTime(x.t + 15 * MIN) + '</td><td class="n">' + x.px.toFixed(2) + '</td><td>' + (at ? '⭐ عند ' + esc(at.name) : '') + '</td></tr>'; }).join('') + '</table>' : '<div class="small">ما في إشارات بآخر يومين.</div>';
    h += '<div class="small" style="margin-top:10px">الشموع: ' + esc(S.candleSrc || '') + ' · السعر: ' + esc(S.mode === 'live' ? S.src : S.replaySrc || '') + ' · وقت الإشارة = إغلاق الشمعة (برلين)</div>';
    openPanel(h);
  }
  function histPanel() {
    var h = '<h3>📜 آخر توقعاتك</h3>' + (save.hist.length ? '<table>' + save.hist.slice(0, 30).map(function (x) { return '<tr><td>' + (x.ok ? '✅' : '❌') + '</td><td>' + esc(x.lvl) + '</td><td class="n">' + x.px.toFixed(2) + '</td><td>' + (x.pick === 'bounce' ? 'يرتد' : 'يخترق') + ' ← ' + (x.res === 'bounce' ? 'ارتد' : 'اخترق') + '</td><td class="n">' + MO.berlinTime(x.t) + (x.mode === 'replay' ? ' ⏪' : '') + '</td></tr>'; }).join('') + '</table>' : '<div class="small">لسا ما في توقعات.</div>');
    h += '<div class="row" style="margin-top:12px"><button class="btn g" id="rst">تصفير النقاط</button></div>'; openPanel(h);
    $('rst').onclick = function () { if (confirm('أكيد بدك تصفّر النقاط والسجل؟')) { save.score = save.best = save.streak = 0; save.hist = []; store(); renderScore(); histPanel(); } };
  }
  var GN = { grok: 'قناة 4H Grok', liq: 'سيولة 4H', sr: 'دعم/مقاومة 4H', ema: 'EMA50 4H', prof: 'VAH/VAL/POC', round: 'أرقام 50', custom: 'مستوياتي' };
  function setPanel() {
    var h = '<h3>⚙️ الإعدادات</h3><div class="row">السؤال بيطلع لما السعر يقرب <input type="number" id="sNear" step="0.5" min="1" value="' + near() + '" style="max-width:80px"> $ من الخط</div>';
    h += '<h3>الخطوط الظاهرة</h3><div class="row">' + Object.keys(GN).map(function (k) { return '<label class="tg"><input type="checkbox" data-g="' + k + '"' + (save.groups[k] ? ' checked' : '') + '>' + GN[k] + '</label>'; }).join('') + '</div>';
    h += '<h3>مستوياتي (اختياري)</h3><table>' + save.custom.map(function (c, i) { return '<tr><td>' + esc(c.name) + '</td><td class="n">' + (+c.px).toFixed(2) + '</td><td><button class="btn g" data-del="' + i + '">🗑</button></td></tr>'; }).join('') + '</table>';
    h += '<div class="row"><input type="text" id="cName" placeholder="الاسم"><input type="number" id="cPx" step="0.01" placeholder="السعر" dir="ltr"><button class="btn" id="cAdd">➕ أضف</button></div>';
    openPanel(h);
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
