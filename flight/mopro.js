/* MO Gold Pro (Pine v6, mohammdbar20-cpu/mo-gold-pro MO_Gold_Pro.pine, branch claude/yellow-channel @d20f3d6) — JS port for the flight game, 15M chart with 4H map (map4).
   Bar-by-bar over CLOSED bars. Every block names the Pine lines it ports. Whale volume, Gaussian, Breakout boxes drawing, Simple OB
   (not used for signals with obMode = Flux), dashboard/table drawing and My Trade are not ported (see README in the report).
   Defaults = the file's input defaults. Pure functions, runs in node too. */
(function (root) {
  'use strict';
  var M15 = 900e3, H1 = 3600e3, H4 = 4 * H1, D1 = 24 * H1;
  var P = { emaLen: 50, minCloudATR: 0.4, confWin: 10, minConf: 2, left: 15, right: 15, volTh: 20, bLen: 14, kLook: 200, kMed: 50, kBig: 80, adxLen: 14, adxMin: 20,
    obSwing: 10, obZones: 3, lsLen: 14, fvgMax: 15, htfSwing: 10, lvN: 3, lvMerge4: 0.15, lvMax4: 4.0, lvStarMin: 4, lvBrkATR: 0.3, lvCool: 5, dpStep: 0.5, dpVA: 70, LN_MIN: 20, LN_CTX: 15 };
  // ---------- time helpers (NY trading day = 17:00 New York, like TradingView FXCM/OANDA XAUUSD)
  var nyF = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric' });
  var bF = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: 'numeric', hourCycle: 'h23' });
  var offC = {};
  function nyOff(ms) { var k = Math.floor(ms / H1); if (k in offC) return offC[k]; var p = {}; nyF.formatToParts(new Date(k * H1)).forEach(function (x) { p[x.type] = +x.value; });
    var loc = Date.UTC(p.year, p.month - 1, p.day, p.hour); return (offC[k] = loc - k * H1); }
  function shift(ms) { return nyOff(ms) + 7 * H1; }                       // NY 17:00 -> 00:00
  function bucket(ms, dur) { var s = shift(ms); return Math.floor((ms + s) / dur) * dur - s; }
  function dayKey(ms) { return Math.floor((ms + shift(ms)) / D1); }       // trading-day id
  var bhC = {}; function berlinHour(ms) { var k = Math.floor(ms / H1); return k in bhC ? bhC[k] : (bhC[k] = +bF.format(new Date(ms))); }
  // ---------- series helpers (Pine semantics)
  function sma(a, n) { var o = new Array(a.length).fill(null), s = 0, k = 0; for (var i = 0; i < a.length; i++) { var v = a[i]; if (v == null) { s = 0; k = 0; continue; } s += v; k++; if (k > n) { s -= a[i - n]; k = n; } if (k === n) o[i] = s / n; } return o; }
  function ema(a, n) { var o = [], al = 2 / (n + 1), e = null, s = 0, k = 0; for (var i = 0; i < a.length; i++) { var v = a[i]; if (e === null) { if (v == null) { o.push(null); continue; } s += v; k++; if (k === n) e = s / n; o.push(e); } else { e = v == null ? e : al * v + (1 - al) * e; o.push(e); } } return o; }
  function rma(a, n) { var o = [], e = null, s = 0, k = 0; for (var i = 0; i < a.length; i++) { var v = a[i]; if (e === null) { if (v == null) { o.push(null); continue; } s += v; k++; if (k === n) e = s / n; o.push(e); } else { e = (e * (n - 1) + v) / n; o.push(e); } } return o; }
  function trS(b) { return b.map(function (x, i) { return i ? Math.max(x.h - x.l, Math.abs(x.h - b[i - 1].c), Math.abs(x.l - b[i - 1].c)) : x.h - x.l; }); }
  function atrS(b, n) { return rma(trS(b), n); }
  function stdev(a, n) { var o = new Array(a.length).fill(null); for (var i = n - 1; i < a.length; i++) { var s = 0, ok = true; for (var j = i - n + 1; j <= i; j++) { if (a[j] == null) { ok = false; break; } s += a[j]; } if (!ok) continue; var m = s / n, q = 0; for (j = i - n + 1; j <= i; j++) q += (a[j] - m) * (a[j] - m); o[i] = Math.sqrt(q / n); } return o; }
  function hiN(b, i, n, f) { var m = -Infinity; for (var j = Math.max(0, i - n + 1); j <= i; j++) m = Math.max(m, f(b[j])); return m; }
  function loN(b, i, n, f) { var m = Infinity; for (var j = Math.max(0, i - n + 1); j <= i; j++) m = Math.min(m, f(b[j])); return m; }
  function pivH(b, i, L, R) { var c = i - R; if (c - L < 0) return null; var v = b[c].h; for (var j = c - L; j <= i; j++) if (j !== c && b[j].h > v) return null; return v; } // ta.pivothigh(L,R) at bar i
  function pivL(b, i, L, R) { var c = i - R; if (c - L < 0) return null; var v = b[c].l; for (var j = c - L; j <= i; j++) if (j !== c && b[j].l < v) return null; return v; }
  function vwapS(b) { var o = [], pv = 0, vv = 0, dk = null; b.forEach(function (x) { var k = dayKey(x.t); if (k !== dk) { dk = k; pv = 0; vv = 0; } var v = x.v || 0; pv += (x.h + x.l + x.c) / 3 * v; vv += v; o.push(vv ? pv / vv : (x.h + x.l + x.c) / 3); }); return o; }
  // HTF mapping. A: request.security(expr[1], lookahead_on)  -> HTF bar that CLOSED at/before the chart bar OPEN.
  //              B: request.security(expr) (lookahead_off, historical) -> HTF bar that closed at/before the chart bar CLOSE.
  function mapIdx(htf, dur, chart, cdur, mode) { var o = [], j = -1; for (var i = 0; i < chart.length; i++) { var lim = chart[i].t + (mode === 'B' ? cdur : 0); while (j + 1 < htf.length && htf[j + 1].t + dur <= lim) j++; o.push(j); } return o; }
  // ---------- higher-TF zones (Pine 1228-1306 htfZoneCalc) on HTF bars; returns per-HTF-bar snapshot arrays
  function zoneCalc(b, len) {
    var zs = [], out = [], at = atrS(b, 10), sw = 0, swP = 0, tY = null, tX = null, tC = true, bY = null, bX = null, bC = true;
    for (var i = 0; i < b.length; i++) {
      var x = b[i], v3 = (x.v || 0) + (i > 0 ? b[i - 1].v || 0 : 0) + (i > 1 ? b[i - 2].v || 0 : 0);
      if (i >= 2 && x.l > b[i - 2].h && b[i - 1].c > b[i - 2].h) zs.unshift({ T: x.l, B: b[i - 2].h, K: 2, V: v3, t: x.t });
      if (i >= 2 && x.h < b[i - 2].l && b[i - 1].c < b[i - 2].l) zs.unshift({ T: b[i - 2].l, B: x.h, K: -2, V: v3, t: x.t });
      swP = sw;
      if (i >= len) { var up = hiN(b, i, len, function (q) { return q.h; }), lo = loN(b, i, len, function (q) { return q.l; }); sw = b[i - len].h > up ? 0 : b[i - len].l < lo ? 1 : sw; }
      if (i >= len && sw === 0 && swP !== 0) { tY = b[i - len].h; tX = i - len; tC = false; }
      if (i >= len && sw === 1 && swP !== 1) { bY = b[i - len].l; bX = i - len; bC = false; }
      if (!tC && x.c > tY) { tC = true; var n = i - tX, oB = b[i - 1].l, oT = b[i - 1].h; if (n > 2) for (var k = 1; k <= Math.min(n - 1, 300); k++) if (b[i - k].l < oB) { oB = b[i - k].l; oT = b[i - k].h; }
        if (at[i] != null && oT - oB <= at[i] * 3.5) zs.unshift({ T: oT, B: oB, K: 1, V: v3, t: x.t }); }
      if (!bC && x.c < bY) { bC = true; var n2 = i - bX, oT2 = b[i - 1].h, oB2 = b[i - 1].l; if (n2 > 2) for (k = 1; k <= Math.min(n2 - 1, 300); k++) if (b[i - k].h > oT2) { oT2 = b[i - k].h; oB2 = b[i - k].l; }
        if (at[i] != null && oT2 - oB2 <= at[i] * 3.5) zs.unshift({ T: oT2, B: oB2, K: -1, V: v3, t: x.t }); }
      for (k = zs.length - 1; k >= 0; k--) { var z = zs[k]; if ((z.K > 0 && x.c < z.B) || (z.K < 0 && x.c > z.T)) zs.splice(k, 1); }
      while (zs.length > 30) zs.pop();
      out.push(zs.slice());
    }
    return out;
  }
  // ---------- 4H extra levels (Pine 1312-1366 h4Extra(5,15,120,35)) -> per 4H bar UNSHIFTED state (the [1] is applied by mapping A)
  function h4Extra(b) {
    var out = [], lh1 = null, lh2 = null, ll1 = null, ll2 = null, srH = null, srL = null, srHp = null, srLp = null;
    for (var i = 0; i < b.length; i++) {
      var x = b[i], ph = pivH(b, i, 5, 5), pl = pivL(b, i, 5, 5);
      if (ph != null) { lh2 = lh1; lh1 = ph; } if (pl != null) { ll2 = ll1; ll1 = pl; }
      if (lh2 != null && x.c > lh2) lh2 = null; if (lh1 != null && x.c > lh1) { lh1 = lh2; lh2 = null; }
      if (ll2 != null && x.c < ll2) ll2 = null; if (ll1 != null && x.c < ll1) { ll1 = ll2; ll2 = null; }
      // fixnan(ta.pivothigh(15,15)[1])
      if (srHp != null) srH = srHp; if (srLp != null) srL = srLp; srHp = pivH(b, i, 15, 15); srLp = pivL(b, i, 15, 15);
      var poc = null, vah = null, val = null;
      if (i > 120) { var mn = loN(b, i, 120, function (q) { return q.l; }), mx = hiN(b, i, 120, function (q) { return q.h; });
        if (mx > mn) { var st = (mx - mn) / 35, vb = new Array(35).fill(0), tot = 0;
          for (var k = 0; k < 120; k++) { var y = b[i - k], ix = Math.max(0, Math.min(34, Math.floor(((y.h + y.l + y.c) / 3 - mn) / st))); vb[ix] += y.v || 0; tot += y.v || 0; }
          var pI = 0; for (k = 1; k < 35; k++) if (vb[k] > vb[pI]) pI = k; var lo = pI, hi = pI, acc = vb[pI];
          while (acc < tot * 0.7 && (lo > 0 || hi < 34)) { var dV = lo > 0 ? vb[lo - 1] : -1, uV = hi < 34 ? vb[hi + 1] : -1; if (uV >= dV) { hi++; acc += uV; } else { lo--; acc += dV; } }
          poc = mn + st * (pI + 0.5); vah = mn + st * (hi + 1); val = mn + st * lo; } }
      out.push({ lh1: lh1, lh2: lh2, ll1: ll1, ll2: ll2, srH: srH, srL: srL, poc: poc, vah: vah, val: val });
    }
    return out;
  }
  // ---------- news (Pine 1987-2048): Fed decisions 14:00 NY (-15 min .. +150 min), minutes 21 days later 14:00 NY (-15 .. +60), own list (Berlin)
  var FED = ['2025-01-29', '2025-03-19', '2025-05-07', '2025-06-18', '2025-07-30', '2025-09-17', '2025-10-29', '2025-12-10', '2026-01-28', '2026-03-18', '2026-04-29', '2026-06-17', '2026-07-29', '2026-09-16', '2026-10-28', '2026-12-09', '2027-01-27', '2027-03-17', '2027-04-28', '2027-06-09', '2027-07-28', '2027-09-15', '2027-10-27', '2027-12-08'];
  function zoned(y, mo, d, h, mi, tz) { var g = Date.UTC(y, mo - 1, d, h, mi); var f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }); var p = {}; f.formatToParts(new Date(g)).forEach(function (x) { p[x.type] = +x.value; }); var off = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - g; return g - off; }
  function newsList(own) {
    var L = [];
    FED.forEach(function (s) { var a = s.split('-').map(Number), t = zoned(a[0], a[1], a[2], 14, 0, 'America/New_York'); L.push({ s: t - 15 * 60e3, e: t + 150 * 60e3, nm: '🏛 الفيدرالي: قرار الفائدة', t: t });
      var d = new Date(t + 21 * D1), p = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(d).forEach(function (x) { p[x.type] = +x.value; });
      var tm = zoned(p.year, p.month, p.day, 14, 0, 'America/New_York'); L.push({ s: tm - 15 * 60e3, e: tm + 60 * 60e3, nm: '🏛 محضر الفيدرالي', t: tm }); });
    String(own || '').replace(/\n/g, ',').split(',').forEach(function (it) { var x = it.trim(); if (x.length < 16 || x[0] === '#') return; var dt = x.slice(-16), nm = x.slice(0, -16).trim(), m = dt.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/); if (!m) return;
      var t = zoned(+m[1], +m[2], +m[3], +m[4], +m[5], 'Europe/Berlin'); L.push({ s: t - 15 * 60e3, e: t + 60 * 60e3, nm: '📰 ' + (nm || 'خبر'), t: t }); });
    return L;
  }
  // ---------- my channels (Pine 1567-1594, 2202-2207): straight lines in TIME between two points
  var CH = [['Grok', [[1790632800000, 4237.96, 1793646000000, 4171.84], [1790604000000, 4197.48, 1792692000000, 4147.37], [1790632800000, 4112.22, 1793646000000, 4046.10]]],
            ['هابطة', [[1792083600000, 4208.56, 1794387600000, 3924.47], [1791777600000, 4213.33, 1794204000000, 3898.50], [1787623200000, 4697.33, 1792720800000, 3992.00]]],
            ['صفراء', [[1793326500000, 3952.90, 1794202200000, 4240.21], [1793326500000, 0, 1794202200000, 0], [1793598300000, 3837.30, 1794452400000, 4209.36]]]]; // branch claude/yellow-channel @d20f3d6: c3 (drawn green), middle 0 = (roof+floor)/2
  function chLines(t) { var o = []; CH.forEach(function (c, ci) { c[1].forEach(function (q, k) { o.push({ px: q[1] <= 0 || q[3] <= 0 || q[2] === q[0] ? null : q[1] + (q[3] - q[1]) * (t - q[0]) / (q[2] - q[0]), name: c[0] + ' ' + (k === 0 ? 'سقف' : k === 1 ? 'وسط' : 'أرضية'), ch: ci, k: k }); }); });
    for (var c = 0; c < 3; c++) if (o[c * 3 + 1].px == null && o[c * 3].px != null && o[c * 3 + 2].px != null) o[c * 3 + 1].px = (o[c * 3].px + o[c * 3 + 2].px) / 2; return o; }
  // ---------- 🧠 learning stats (Pine 1869-1961): 11 sources x 8 contexts, decayed 0.99
  var LN = ['OB', 'FVG', 'POC', 'VAH/VAL', 'سيولة', 'S/R', 'EMA', 'VWAP', 'رقم', 'امتصاص', 'قناة'], LK = ['OB', 'FVG', 'POC', 'VAH', 'سيولة', 'S/R', 'EMA', 'VWAP', 'رقم', 'امتصاص', 'قناة'];
  function lnHas(t, k) { return t.indexOf(LK[k]) >= 0 || (k === 3 && t.indexOf('VAL') >= 0); }
  function Stats(mem) { this.H = new Array(124).fill(0); this.W = new Array(124).fill(0); this.C = new Array(124).fill(0); this.memT = 0; if (mem) this.load(mem); }
  Stats.prototype.load = function (mem) { var me = this, got = 0; String(mem).split('|').forEach(function (blk) { var p = blk.trim().split(';'); if (p.length >= 4 && p[0] === 'MOMEM1' && p[1] === 'TF=900') { me.memT = +p[2].replace('T=', ''); p[3].split(',').forEach(function (it) { var f = it.split(':'); if (f.length === 4) { var ix = +f[0]; if (ix >= 0 && ix <= 123) { me.H[ix] = +f[1]; me.W[ix] = +f[2]; me.C[ix] = +f[3]; got++; } } }); } }); this.got = got; return got; };
  Stats.prototype.rate = function (i) { return (this.H[i] + 1) / (this.W[i] + 2); };
  Stats.prototype.add = function (i, ok, t) { if (t > this.memT) { this.H[i] = this.H[i] * 0.99 + (ok ? 1 : 0); this.W[i] = this.W[i] * 0.99 + 1; this.C[i]++; } };
  Stats.prototype.avg = function () { var h = 0, w = 0; for (var k = 0; k < 11; k++) { h += this.H[k * 8]; w += this.W[k * 8]; } return (h + 1) / (w + 2); };
  Stats.prototype.adj = function (k) { return this.C[k * 8] < P.LN_MIN ? 0 : this.rate(k * 8) >= this.avg() + 0.12 ? 1 : this.rate(k * 8) <= this.avg() - 0.12 ? -1 : 0; };
  Stats.prototype.record = function (tag, ok, cx, t) { var trd = cx % 2, ses = Math.floor(cx / 2) % 3, tch = Math.floor(cx / 6); for (var k = 0; k < 11; k++) if (lnHas(tag, k)) [k * 8, k * 8 + 1 + trd, k * 8 + 3 + ses, k * 8 + 6 + tch].forEach(function (ix) { this.add(ix, ok, t); }, this); };
  Stats.prototype.apply = function (tag, sd, bias, ses) { var adjT = 0, tips = [], trd = bias === (sd === -1 ? 1 : -1) ? 0 : 1;
    for (var k = 0; k < 11; k++) if (lnHas(tag, k) && this.C[k * 8] >= P.LN_MIN) { var a = this.adj(k), ca = 0;
      [1 + trd, 3 + ses].forEach(function (d) { var ix = k * 8 + d; if (this.C[ix] >= P.LN_CTX) { var df = this.rate(ix) - this.rate(k * 8); ca += df >= 0.12 ? 1 : df <= -0.12 ? -1 : 0; } }, this);
      ca = Math.max(-1, Math.min(1, ca)); adjT += a + ca; tips.push(LN[k] + ' صمد ' + Math.round(this.rate(k * 8) * 100) + '% من ' + this.C[k * 8]); }
    return { adj: Math.max(-2, Math.min(2, adjT)), tips: tips }; };
  Stats.prototype.export = function (t) { var s = 'MOMEM1;TF=900;T=' + t + ';'; for (var i = 0; i < 124; i++) if (this.C[i] > 0) s += i + ':' + this.H[i].toFixed(2) + ':' + this.W[i].toFixed(2) + ':' + this.C[i] + ','; return s; };
  // =====================================================================================================================
  function run(Dt, opt) {
    opt = opt || {}; var b = Dt.m15, n = b.length; if (n < 40 || !Dt.h4.length) return null;
    var h1 = Dt.h1, h4 = Dt.h4, d1 = Dt.d1 || [];
    // --- HTF series
    var e1 = ema(h1.map(function (x) { return x.c; }), P.emaLen), e4 = ema(h4.map(function (x) { return x.c; }), P.emaLen), eD = ema(d1.map(function (x) { return x.c; }), P.emaLen);
    var a4 = atrS(h4, 14), vw4 = vwapS(h4), z1 = zoneCalc(h1, P.htfSwing), z4 = zoneCalc(h4, P.htfSwing), hx = h4Extra(h4);
    var A1 = mapIdx(h1, H1, b, M15, 'A'), A4 = mapIdx(h4, H4, b, M15, 'A'), AD = mapIdx(d1, D1, b, M15, 'A'), B1 = mapIdx(h1, H1, b, M15, 'B'), B4 = mapIdx(h4, H4, b, M15, 'B');
    var g = function (arr, j) { return j >= 0 ? arr[j] : null; };
    // --- 15M series
    var atr = atrS(b, 14), vwap = vwapS(b), close = b.map(function (x) { return x.c; }), vol = b.map(function (x) { return x.v || 0; });
    var ev5 = ema(vol, 5), ev10 = ema(vol, 10), obAtr = atrS(b, 10);
    var roc = function (r) { return close.map(function (c, i) { return i >= r ? 100 * (c - close[i - r]) / close[i - r] : null; }); };
    var s1 = sma(roc(10), 10), s2 = sma(roc(15), 10), s3 = sma(roc(20), 10), s4 = sma(roc(30), 15);
    var kst = close.map(function (c, i) { return s1[i] == null || s2[i] == null || s3[i] == null || s4[i] == null ? null : s1[i] + 2 * s2[i] + 3 * s3[i] + 4 * s4[i]; }), ksig = sma(kst, 9);
    // ADX (ta.dmi 14,14)
    var pdm = [], mdm = [], tr = trS(b); b.forEach(function (x, i) { if (!i) { pdm.push(null); mdm.push(null); tr[0] = null; return; } var u = x.h - b[i - 1].h, d = b[i - 1].l - x.l; pdm.push(u > d && u > 0 ? u : 0); mdm.push(d > u && d > 0 ? d : 0); });
    var rtr = rma(tr, P.adxLen), rp = rma(pdm, P.adxLen), rm = rma(mdm, P.adxLen), dx = b.map(function (x, i) { if (rtr[i] == null) return null; var p = 100 * rp[i] / rtr[i], m = 100 * rm[i] / rtr[i]; return Math.abs(p - m) / (p + m === 0 ? 1 : p + m); }), adx = rma(dx, P.adxLen).map(function (v) { return v == null ? null : 100 * v; });
    var nP = b.map(function (x, i) { if (i < 99) return null; var lo = loN(b, i, 100, function (q) { return q.l; }), hi = hiN(b, i, 100, function (q) { return q.h; }); return hi > lo ? (x.c - lo) / (hi - lo) : null; }), bcV = stdev(nP, 14);
    var news = newsList(opt.news), stats = new Stats(opt.mem);
    // --- state
    var S = { hiPiv: null, loPiv: null, hpPrev: null, lpPrev: null, kPrevUp: null, bc: [], bcLastX: null, bcUL: [], obT: null, obB: null, swT: 0, bullOB: [], bearOB: [], fvg: [],
      ph: null, pl: null, phTop: null, phBtm: null, phX: 0, phCr: false, plTop: null, plBtm: null, plCr: false, lastSide: 0, exitShown: false, tradeSide: 0,
      dp: null, y: null, yNaked: false, dSt: 0, dA: 0, dB: 0, dI: 0, dMsg: '', dShort: '—', map: [], mBar: null, mUp0: 0, mDn0: 0, ts: [], ev: null, evRes: 0, lastShock: 0, lastNm: '', bx: { st: 0 } };
    var hist = { sigs: [], evs: [], conf: [] }, R = [];
    var ev = { srU: [], srD: [], kU: [], kD: [], bcU: [], bcD: [], obU: [], obD: [], fU: [], fD: [], sU: [], sD: [], hU: [], hD: [], h4U: [], h4D: [] };
    function recent(arr, i) { for (var k = i; k >= Math.max(0, i - P.confWin); k--) if (arr[k]) return true; return false; }
    var above = [], below = [], Y = [], G = [], plBtmA = [], plCrA = [], phTopA = [], phCrA = [], kAbs = [], kstUpA = [], kstDnA = [], volAvg = sma(vol, 20), atrAvg = sma(atr, 96);
    for (var i = 0; i < n; i++) {
      var x = b[i], t = x.t;
      // ===== lines (Pine 79-125)
      var y = g(e1, A1[i]), gr = g(e4, A4[i]); Y.push(y); G.push(gr);
      var setClose = A4[i] >= 0 ? h4[A4[i]].c : null, emaSet = gr, vwapSet = g(vw4, A4[i]), upperEma = g(eD, AD[i]), atr4 = g(a4, A4[i]);
      var bias = setClose == null || emaSet == null || upperEma == null ? 0 : (setClose > upperEma && setClose > emaSet && setClose > vwapSet) ? 1 : (setClose < upperEma && setClose < emaSet && setClose < vwapSet) ? -1 : 0;
      var trendOk = i >= 5 && y != null && Y[i - 5] != null && G[i - 5] != null && Math.sign(y - Y[i - 5]) === Math.sign(gr - G[i - 5]) && y !== Y[i - 5] && atr[i] != null && Math.abs(y - gr) > atr[i] * P.minCloudATR;
      // ===== S/R with breaks (Pine 140-146)
      if (S.hpPrev != null) S.hiPiv = S.hpPrev; if (S.lpPrev != null) S.loPiv = S.lpPrev; var hiPrev = S._hiPivPrev, loPrev = S._loPivPrev; S._hiPivPrev = S.hiPiv; S._loPivPrev = S.loPiv;
      S.hpPrev = pivH(b, i, P.left, P.right); S.lpPrev = pivL(b, i, P.left, P.right);
      var osc = ev10[i] ? 100 * (ev5[i] - ev10[i]) / ev10[i] : null;
      var crossDn = i > 0 && S.loPiv != null && loPrev != null && x.c < S.loPiv && close[i - 1] >= loPrev, crossUp = i > 0 && S.hiPiv != null && hiPrev != null && x.c > S.hiPiv && close[i - 1] <= hiPrev;
      var breakDown = crossDn && !(x.o - x.c < x.h - x.o) && osc > P.volTh, breakUp = crossUp && !(x.o - x.l > x.c - x.o) && osc > P.volTh;
      // ===== KST (Pine 161-184), percentile lookback 200 (uses what exists if fewer, min 50)
      var k = kst[i], sg = ksig[i], kUp = false, kDn = false, kSize = 0;
      if (k != null && sg != null && i > 0 && kst[i - 1] != null && ksig[i - 1] != null) { kUp = k > sg && kst[i - 1] <= ksig[i - 1] && k < 0; kDn = k < sg && kst[i - 1] >= ksig[i - 1] && k > 0; }
      if (k != null) { var cnt = 0, m = 0; for (var q = i - 1; q >= Math.max(0, i - P.kLook); q--) { if (kst[q] == null) break; m++; if (Math.abs(kst[q]) <= Math.abs(k)) cnt++; }
        var rank = m >= 50 ? 100 * cnt / m : null, kTrend = adx[i] != null && adx[i] >= P.adxMin; kSize = kTrend && rank != null ? (rank >= P.kBig ? 2 : rank >= P.kMed ? 1 : 0) : 0; }
      var kUpEv = kUp && kSize >= 1, kDnEv = kDn && kSize >= 1;
      // ===== Breakout channels (Pine 194-253)
      var upbreak = 0, downbreak = 0;
      if (bcV[i] != null && i >= P.bLen) { var hb = 0, lb = 0, hv = -Infinity, lv = Infinity, okw = true;
        for (q = 0; q <= P.bLen; q++) { var vv = bcV[i - q]; if (vv == null) { okw = false; break; } if (vv > hv) { hv = vv; hb = -q; } if (vv < lv) { lv = vv; lb = -q; } }
        if (okw) { var upper = (hb + P.bLen) / P.bLen, lower = (lb + P.bLen) / P.bLen, pu = S.bcUL[i - 1];
          if (pu && lower > upper && pu[1] <= pu[0]) S.bcLastX = i;            // crossover(lower, upper)
          var dur = Math.max(S.bcLastX == null ? 0 : i - S.bcLastX, 1);
          if (pu && upper > lower && pu[0] <= pu[1] && dur > 10) S.bc.unshift({ top: hiN(b, i, dur, function (q2) { return q2.h; }), bot: loN(b, i, dur, function (q2) { return q2.l; }) });
          S.bcUL[i] = [upper, lower]; } }
      var px = (x.c + x.o) / 2; for (q = S.bc.length - 1; q >= 0; q--) { var bb = S.bc[q]; if (px > bb.top) { upbreak = bb.bot; S.bc.splice(q, 1); } else if (px < bb.bot) { downbreak = bb.top; S.bc.splice(q, 1); } }
      // ===== Flux order blocks (Pine 480-559, 660-672)
      var swP = S.swT; if (i >= P.obSwing) { var su = hiN(b, i, P.obSwing, function (q2) { return q2.h; }), sl = loN(b, i, P.obSwing, function (q2) { return q2.l; }); var c0 = b[i - P.obSwing];
        S.swT = c0.h > su ? 0 : c0.l < sl ? 1 : S.swT; if (S.swT === 0 && swP !== 0) S.obT = { x: i - P.obSwing, y: c0.h, cr: false }; if (S.swT === 1 && swP !== 1) S.obB = { x: i - P.obSwing, y: c0.l, cr: false }; }
      for (q = S.bullOB.length - 1; q >= 0; q--) { var o1 = S.bullOB[q]; if (!o1.br) { if (x.l < o1.bot) { o1.br = true; o1.bt = t; } } else if (x.h > o1.top) S.bullOB.splice(q, 1); }
      if (S.obT && x.c > S.obT.y && !S.obT.cr) { S.obT.cr = true; var bBtm = b[i - 1].h, bTop = b[i - 1].l, bLoc = b[i - 1].t;
        for (q = 1; q <= i - S.obT.x - 1; q++) { bBtm = Math.min(b[i - q].l, bBtm); if (bBtm === b[i - q].l) { bTop = b[i - q].h; bLoc = b[i - q].t; } }
        if (obAtr[i] != null && Math.abs(bTop - bBtm) <= obAtr[i] * 3.5) { S.bullOB.unshift({ top: bTop, bot: bBtm, t: bLoc, v: vol[i] + vol[i - 1] + vol[i - 2], br: false }); if (S.bullOB.length > 30) S.bullOB.pop(); } }
      for (q = S.bearOB.length - 1; q >= 0; q--) { var o2 = S.bearOB[q]; if (!o2.br) { if (x.h > o2.top) { o2.br = true; o2.bt = t; } } else if (x.l < o2.bot) S.bearOB.splice(q, 1); }
      if (S.obB && x.c < S.obB.y && !S.obB.cr) { S.obB.cr = true; var sBtm = b[i - 1].l, sTop = b[i - 1].h, sLoc = b[i - 1].t;
        for (q = 1; q <= i - S.obB.x - 1; q++) { sTop = Math.max(b[i - q].h, sTop); if (sTop === b[i - q].h) { sBtm = b[i - q].l; sLoc = b[i - q].t; } }
        if (obAtr[i] != null && Math.abs(sTop - sBtm) <= obAtr[i] * 3.5) { S.bearOB.unshift({ top: sTop, bot: sBtm, t: sLoc, v: vol[i] + vol[i - 1] + vol[i - 2], br: false }); if (S.bearOB.length > 30) S.bearOB.pop(); } }
      var fluxBull = false, fluxBear = false, fluxAt = null;
      for (q = 0; q < Math.min(S.bullOB.length, P.obZones); q++) { var f1 = S.bullOB[q]; if (!f1.br && f1.t < t && x.l <= f1.top && x.c > f1.bot) { fluxBull = true; fluxAt = f1; } }
      for (q = 0; q < Math.min(S.bearOB.length, P.obZones); q++) { var f2 = S.bearOB[q]; if (!f2.br && f2.t < t && x.h >= f2.bot && x.c < f2.top) { fluxBear = true; fluxAt = f2; } }
      // ===== Liquidity swings + sweep (Pine 763-829)
      var prevPlBtm = S.plBtm, prevPlCr = S.plCr, prevPhTop = S.phTop, prevPhCr = S.phCr;
      if (pivH(b, i, P.lsLen, P.lsLen) != null) { var cH = b[i - P.lsLen]; S.phTop = cH.h; S.phBtm = Math.max(cH.c, cH.o); S.phCr = false; } else if (S.phTop != null) S.phCr = x.c > S.phTop ? true : S.phCr;
      if (pivL(b, i, P.lsLen, P.lsLen) != null) { var cL = b[i - P.lsLen]; S.plTop = Math.min(cL.c, cL.o); S.plBtm = cL.l; S.plCr = false; } else if (S.plBtm != null) S.plCr = x.c < S.plBtm ? true : S.plCr;
      var sweepBull = prevPlBtm != null && prevPlCr === false && x.l < prevPlBtm && x.c > prevPlBtm, sweepBear = prevPhTop != null && prevPhCr === false && x.h > prevPhTop && x.c < prevPhTop;
      // ===== FVG (Pine 864-930), threshold 0, max 15
      if (i >= 2) { var b2 = b[i - 2]; if (x.l > b2.h && b[i - 1].c > b2.h && (x.l - b2.h) / b2.h > 0) S.fvg.unshift({ max: x.l, min: b2.h, bull: true, t: t });
        else if (x.h < b2.l && b[i - 1].c < b2.l && (b2.l - x.h) / x.h > 0) S.fvg.unshift({ max: b2.l, min: x.h, bull: false, t: t }); }
      while (S.fvg.length > P.fvgMax) S.fvg.pop();
      for (q = S.fvg.length - 1; q >= 0; q--) { var gq = S.fvg[q]; if (gq.bull ? x.c < gq.min : x.c > gq.max) S.fvg.splice(q, 1); }
      var fvgBull = false, fvgBear = false; S.fvg.forEach(function (gg) { if (gg.t < t) { if (gg.bull && x.l <= gg.max && x.c > gg.min) fvgBull = true; if (!gg.bull && x.h >= gg.min && x.c < gg.max) fvgBear = true; } });
      // ===== core BUY/SELL (Pine 1182-1207)
      var aA = y != null && gr != null && x.c > y && x.c > gr && x.c > vwap[i], bA = y != null && gr != null && x.c < y && x.c < gr && x.c < vwap[i]; above.push(aA); below.push(bA);
      if (S.lastSide === -1 && aA) S.lastSide = 0; if (S.lastSide === 1 && bA) S.lastSide = 0;
      var buySig = i >= 4 && aA && above[i - 1] && above[i - 2] && above[i - 3] && !above[i - 4] && S.lastSide !== 1 && trendOk;
      var sellSig = i >= 4 && bA && below[i - 1] && below[i - 2] && below[i - 3] && !below[i - 4] && S.lastSide !== -1 && trendOk;
      if (buySig || sellSig) { S.lastSide = buySig ? 1 : -1; S.exitShown = false; }
      var cr = function (a, bS) { return i > 0 && a[i] != null && a[i - 1] != null && bS != null; };
      var nUp = 0, nDn = 0; if (i > 0) [[Y], [G], [vwap]].forEach(function (s) { var a = s[0]; if (a[i] == null || a[i - 1] == null) return; if (x.c > a[i] && close[i - 1] <= a[i - 1]) nUp++; if (x.c < a[i] && close[i - 1] >= a[i - 1]) nDn++; });
      var exitSig = !S.exitShown && (nUp >= 3 || nDn >= 3); if (exitSig) S.exitShown = true;
      // ===== HTF zones taps (Pine 1382-1397) + 4H level taps (Pine 1370-1379)
      var tap = function (zs) { var r = [false, false]; (zs || []).forEach(function (z) { if (z.K > 0 && x.l <= z.T && x.c > z.B) r[0] = true; if (z.K < 0 && x.h >= z.B && x.c < z.T) r[1] = true; }); return r; };
      var ta1 = tap(g(z1, B1[i])), ta4 = tap(g(z4, B4[i])), htfBull = ta1[0] || ta4[0], htfBear = ta1[1] || ta4[1];
      var X4 = g(hx, A4[i]) || {}, h4L = [X4.lh1, X4.lh2, X4.ll1, X4.ll2, X4.srH, X4.srL, X4.poc, X4.vah, X4.val, emaSet], tol15 = (atr[i] || 0) * 0.15, h4TU = false, h4TE = false;
      h4L.forEach(function (L) { if (L != null) { if (x.l <= L + tol15 && x.c > L) h4TU = true; if (x.h >= L - tol15 && x.c < L) h4TE = true; } });
      // ===== 8 confirmations (Pine 1433-1464); whale = not ported (0)
      ev.srU.push(breakUp); ev.srD.push(breakDown); ev.kU.push(kUpEv); ev.kD.push(kDnEv); ev.bcU.push(upbreak !== 0); ev.bcD.push(downbreak !== 0); ev.obU.push(fluxBull); ev.obD.push(fluxBear);
      ev.fU.push(fvgBull); ev.fD.push(fvgBear); ev.sU.push(sweepBull); ev.sD.push(sweepBear); ev.hU.push(htfBull); ev.hD.push(htfBear); ev.h4U.push(ta4[0] || h4TU); ev.h4D.push(ta4[1] || h4TE);
      var cu = { 'S/R': recent(ev.srU, i), 'KST': recent(ev.kU, i), 'Breakout': recent(ev.bcU, i), 'OB': recent(ev.obU, i), 'FVG': recent(ev.fU, i), 'سحب سيولة': recent(ev.sU, i), 'منطقة HTF': recent(ev.hU, i) };
      var cd = { 'S/R': recent(ev.srD, i), 'KST': recent(ev.kD, i), 'Breakout': recent(ev.bcD, i), 'OB': recent(ev.obD, i), 'FVG': recent(ev.fD, i), 'سحب سيولة': recent(ev.sD, i), 'منطقة HTF': recent(ev.hD, i) };
      var upConf = Object.keys(cu).filter(function (k2) { return cu[k2]; }).length, dnConf = Object.keys(cd).filter(function (k2) { return cd[k2]; }).length;
      var buyOne = buySig && upConf >= P.minConf && bias === 1 && recent(ev.h4U, i), sellOne = sellSig && dnConf >= P.minConf && bias === -1 && recent(ev.h4D, i);
      if (buyOne || sellOne) hist.sigs.push({ side: buyOne ? 'BUY' : 'SELL', plus: (buyOne ? upConf : dnConf) >= 3, conf: buyOne ? upConf : dnConf, t: t, px: x.c, low: x.l, high: x.h,
        why: Object.keys(buyOne ? cu : cd).filter(function (k2) { return (buyOne ? cu : cd)[k2]; }) });
      if (buyOne) S.tradeSide = 1; if (sellOne) S.tradeSide = -1; if (exitSig || (S.tradeSide === 1 && bA) || (S.tradeSide === -1 && aA)) S.tradeSide = 0;
      // ===== news + shock (Pine 2032-2048)
      var nm = ''; for (q = 0; q < news.length; q++) if (t + M15 >= news[q].s && t <= news[q].e) { nm = news[q].nm; break; }
      var shock = i > 0 && atr[i - 1] != null && volAvg[i - 1] != null && x.h - x.l > 2.5 * atr[i - 1] && x.v > 2 * volAvg[i - 1];
      if (shock) { S.lastShock = t; S.lastNm = nm; } if (!nm && (shock || (S.lastShock && t - S.lastShock <= 60 * 60e3))) nm = S.lastNm; var isNews = nm !== '';
      // ===== daily profile + yesterday plan (Pine 1688-1817)
      var newDay = i === 0 || dayKey(t) !== dayKey(b[i - 1].t);
      if (newDay || !S.dp) { if (newDay && S.dp && S.dp.poc != null) { S.y = { poc: S.dp.poc, vah: S.dp.vah, val: S.dp.val }; S.yNaked = true; } S.dp = { base: x.o - 2000 * P.dpStep, bins: {}, lo: null, hi: null, poc: null, vah: null, val: null, start: t }; }
      if (x.v > 0) { var dp = S.dp, iL = Math.max(0, Math.min(3999, Math.floor((x.l - dp.base) / P.dpStep))), iH = Math.max(0, Math.min(3999, Math.floor((x.h - dp.base) / P.dpStep))), ve = x.v / (iH - iL + 1);
        for (q = iL; q <= iH; q++) dp.bins[q] = (dp.bins[q] || 0) + ve; dp.lo = dp.lo == null ? iL : Math.min(dp.lo, iL); dp.hi = dp.hi == null ? iH : Math.max(dp.hi, iH);
        var pocI = dp.lo, mx = -1, tot = 0; for (q = dp.lo; q <= dp.hi; q++) { var bv = dp.bins[q] || 0; tot += bv; if (bv > mx) { mx = bv; pocI = q; } }
        var lo = pocI, hi = pocI, acc = dp.bins[pocI] || 0; while (acc < tot * P.dpVA / 100 && (lo > dp.lo || hi < dp.hi)) { var dV = lo > dp.lo ? dp.bins[lo - 1] || 0 : -1, uV = hi < dp.hi ? dp.bins[hi + 1] || 0 : -1; if (uV >= dV) { hi++; acc += uV; } else { lo--; acc += dV; } }
        dp.poc = dp.base + (pocI + 0.5) * P.dpStep; dp.vah = dp.base + (hi + 1) * P.dpStep; dp.val = dp.base + lo * P.dpStep; }
      if (newDay && S.y) { S.dSt = 0; S.dA = S.dB = S.dI = 0; S.dBar = t;
        if (x.o > S.y.vah) { S.dShort = 'افتتاح فوق قيمة الأمس'; S.dMsg = 'إن ثبت فوق VAH الأمس = صعود. إن رجع لجوّا وثبت = الهدف VAL الأمس ' + S.y.val.toFixed(2) + ' (قاعدة 80%).'; }
        else if (x.o < S.y.val) { S.dShort = 'افتتاح تحت قيمة الأمس'; S.dMsg = 'إن ثبت تحت VAL الأمس = هبوط. إن رجع لجوّا وثبت = الهدف VAH الأمس ' + S.y.vah.toFixed(2) + ' (قاعدة 80%).'; }
        else { S.dShort = 'داخل قيمة الأمس'; S.dMsg = 'تذبذب بين VAL ' + S.y.val.toFixed(2) + ' و VAH ' + S.y.vah.toFixed(2) + '، و POC ' + S.y.poc.toFixed(2) + ' مغناطيس.'; } }
      if (S.y && !newDay) { if (S.yNaked && x.h >= S.y.poc && x.l <= S.y.poc) S.yNaked = false;
        var ab = x.c > S.y.vah, be = x.c < S.y.val; S.dA = ab ? S.dA + 1 : 0; S.dB = be ? S.dB + 1 : 0; S.dI = !ab && !be ? S.dI + 1 : 0; var ns = S.dSt;
        if (S.dA >= 2) ns = 1; else if (S.dB >= 2) ns = -1; else if (S.dI >= 2 && S.dSt === 1) ns = 2; else if (S.dI >= 2 && S.dSt === -1) ns = -2;
        if (ns !== S.dSt) { S.dSt = ns; S.dBar = t;
          S.dShort = ns === 1 ? '✅ قبول فوق قيمة الأمس' : ns === -1 ? '✅ قبول تحت قيمة الأمس' : ns === 2 ? '↩ عودة لقيمة الأمس ▼' : '↩ عودة لقيمة الأمس ▲';
          S.dMsg = ns === 1 ? 'ثبت فوق VAH الأمس: صعود محتمل و VAH صار دعم.' : ns === -1 ? 'ثبت تحت VAL الأمس: هبوط محتمل و VAL صار مقاومة.' : ns === 2 ? 'قاعدة 80%: الهدف VAL الأمس ' + S.y.val.toFixed(2) + ' مروراً بـ POC ' + S.y.poc.toFixed(2) + '.' : 'قاعدة 80%: الهدف VAH الأمس ' + S.y.vah.toFixed(2) + ' مروراً بـ POC ' + S.y.poc.toFixed(2) + '.'; } }
      var gch = chLines(t); if (gch[0].px != null && x.c > gch[0].px) S.c3On = true; else if (gch[1].px != null && x.c < gch[1].px) S.c3On = false;
      var chAct = function (c) { return c.ch < 2 || S.c3On; };
      // ===== level map (Pine 2298-2462): built when the 4H bar closes
      var setClosed = bucket(t, H4) !== bucket(t + M15, H4), mATR = atr4 || atr[i] || 1, tol = mATR * P.lvMerge4;
      var pendFB = S.map.some(function (l) { return l.st === 2 && i - l.bb <= 3; });
      var exhausted = (S.mUp0 > 0 && !S.map.some(function (l) { return l.sd === 1 && l.st !== 2; })) || (S.mDn0 > 0 && !S.map.some(function (l) { return l.sd === -1 && l.st !== 2; }));
      if (S.mBar == null || (setClosed && !pendFB) || (exhausted && i > S.mBar)) {
        var cand = [], add = function (p, tg, bn, tt) { if (p != null && p > 0) cand.push({ p: p, t: tg, b: bn, tt: tt }); };
        var zs4 = g(z4, B4[i]) || [], obV = zs4.filter(function (z) { return Math.abs(z.K) === 1; }).map(function (z) { return z.V; });
        zs4.forEach(function (z) { var isOB = Math.abs(z.K) === 1, rk = isOB && obV.length ? 100 * obV.filter(function (v) { return v <= z.V; }).length / obV.length : null, bn = isOB && rk != null ? (rk >= 80 ? 2 : rk >= 50 ? 1 : 0) : 0, tg = (isOB ? 'OB·' : 'FVG·') + '4H';
          var tt = (z.K > 0 ? 'طلب ' : 'عرض ') + tg + (isOB ? ' · فوليوم أعلى من ' + Math.round(rk) + '% من مناطق OB' : '');
          if (x.c >= z.T) add(z.T, tg, bn, tt); else if (x.c <= z.B) add(z.B, tg, bn, tt); else { add(z.T, tg, bn, tt); add(z.B, tg, bn, tt); } });
        add(X4.lh1, 'سيولة·4H', 0, 'سيولة 4H لم تُسحب (قمة)'); add(X4.lh2, 'سيولة·4H', 0, 'سيولة 4H لم تُسحب (قمة أقدم)'); add(X4.ll1, 'سيولة·4H', 0, 'سيولة 4H لم تُسحب (قاع)'); add(X4.ll2, 'سيولة·4H', 0, 'سيولة 4H لم تُسحب (قاع أقدم)');
        add(X4.srH, 'S/R·4H', 0, 'مقاومة 4H (Pivot 15/15)'); add(X4.srL, 'S/R·4H', 0, 'دعم 4H (Pivot 15/15)'); add(X4.poc, 'POC·4H', 1, 'POC آخر 120 شمعة 4H'); add(X4.vah, 'VAH·4H', 0, 'VAH 4H (70%)'); add(X4.val, 'VAL·4H', 0, 'VAL 4H (70%)');
        add(emaSet, 'EMA·4H', 0, 'EMA 50 على 4H'); add(vwapSet, 'VWAP', 0, 'VWAP اليوم (من 4H المغلقة)');
        if (S.y) { add(S.y.poc, 'POC·أمس', S.yNaked ? 2 : 1, 'POC الأمس' + (S.yNaked ? ' 🧲 ما انلمس اليوم' : '')); add(S.y.vah, 'VAH·أمس', 0, 'VAH الأمس'); add(S.y.val, 'VAL·أمس', 0, 'VAL الأمس'); }
        var h100 = Math.floor(x.c / 100) * 100; add(h100, 'رقم 100', 0, 'رقم مستدير ' + h100); add(h100 + 100, 'رقم 100', 0, 'رقم مستدير ' + (h100 + 100)); add(h100 - 100, 'رقم 100', 0, 'رقم مستدير ' + (h100 - 100));
        var ord = cand.map(function (c, j) { return [Math.abs(c.p - x.c), j]; }).sort(function (a, c) { return a[0] - c[0] || a[1] - c[1]; }), up = [], dn = [];
        ord.forEach(function (o) { var c = cand[o[1]], d = o[0]; if (d > mATR * 0.03 && d <= mATR * P.lvMax4) { var L = c.p > x.c ? up : dn, merged = false;
          for (var cc = 0; cc < L.length; cc++) if (!merged && Math.abs(L[cc].p - c.p) <= tol) { if (L[cc].t.indexOf(c.t) < 0) { L[cc].t += '+' + c.t; L[cc].C += 1 + c.b; L[cc].tt.push(c.tt); } merged = true; }
          if (!merged && L.length < P.lvN) L.push({ p: c.p, t: c.t, C: 1 + c.b, tt: [c.tt] }); } });
        var gapB = 16, nR = Math.min(1500, 120 * 16), tolR = mATR * 0.1, chl = chLines(t + M15);
        [up, dn].forEach(function (L, side) { L.forEach(function (l) {
          if (l.t.indexOf('رقم') < 0) { var r50 = Math.round(l.p / 50) * 50; if (Math.abs(l.p - r50) <= tol) { l.t += '+رقم'; l.C += 1; l.tt.push('قريب من رقم مستدير ' + r50); } }
          var rc = 0, lastB = -1; for (var bb2 = 1; bb2 <= Math.min(nR, i - 1); bb2++) { var z2 = b[i - bb2]; if (z2.h >= l.p - tolR && z2.l <= l.p + tolR) { var pc = b[i - bb2 - 1].c, fa = pc > l.p + tolR, fb = pc < l.p - tolR;
            if (((fa && z2.c > l.p) || (fb && z2.c < l.p)) && (lastB < 0 || bb2 - lastB >= gapB)) { rc++; lastB = bb2; } } }
          l.C += rc >= 3 ? 2 : rc === 2 ? 1 : 0; l.rc = rc; l.tt.push('ردود فعل سابقة: ' + rc);
          var hit = chl.filter(function (c) { return chAct(c) && c.px != null && Math.abs(c.px - l.p) <= tol; })[0]; if (hit && l.t.indexOf('قناة') < 0) { l.t += '+قناة'; l.C += 1; l.tt.push('📐 خط قناتك: ' + hit.name + ' عند ' + hit.px.toFixed(2)); }
          var la = stats.apply(l.t, side === 0 ? 1 : -1, bias, sess(t)); l.C = Math.max(1, l.C + la.adj); l.ln = la.tips; }); });
        var old = S.map; S.map = [];
        up.concat(dn).forEach(function (l, j) { var sd = j < up.length ? 1 : -1, st = { st: 0, nb: 0, lt: -10, bb: -10, le: -100, fl: 0 };
          old.forEach(function (o) { if (Math.abs(o.p - l.p) <= tol) { if (o.sd === sd) st = { st: o.st, nb: o.nb, lt: o.lt, bb: o.bb, le: o.le, fl: o.fl }; else { st.fl = 1; st.lt = o.lt; st.le = o.le; } } });
          S.map.push({ p: l.p, t: l.t, C: l.C, sd: sd, tt: l.tt, rc: l.rc, ln: l.ln, star: l.C >= P.lvStarMin, st: st.st, nb: st.nb, lt: st.lt, bb: st.bb, le: st.le, fl: st.fl, built: t }); });
        S.mBar = i; S.mUp0 = up.length; S.mDn0 = dn.length; S.mATR = mATR; S.mTol = tol;
      }
      // role flip (Pine 2465-2483)
      S.map.forEach(function (l) { if (l.st === 2 && i - l.bb > 3) { l.sd = -l.sd; l.st = 0; l.nb = 0; l.fl = 1; l.le = i; } });
      // events (Pine 2497-2644)
      var tolE = (atr[i] || 0) * 0.1, brkT = (atr[i] || 0) * P.lvBrkATR, swpT = (atr[i] || 0) * 0.15, best = null;
      S.map.forEach(function (l) { var p = l.p, sd = l.sd, cool = i - l.le >= P.lvCool, kind = 0;
        if (l.st === 2) { if (i > l.bb && i - l.bb <= 3 && (sd === 1 ? x.c < p - tolE : x.c > p + tolE)) kind = 3; }
        else { var touched = sd === 1 ? x.h >= p - tolE : x.l <= p + tolE; if (touched) { var newEp = i - l.lt > 3; l.lt = i;
          lnStart(p, l.t, sd, atr4 ? atr4 * 0.1 : (atr[i] || 0) * 0.3, cxOf(sd, l.nb), isNews);
          var broke = sd === 1 ? x.c > p + brkT : x.c < p - brkT, swept = sd === 1 ? (x.h > p + swpT && x.c < p) : (x.l < p - swpT && x.c > p);
          if (broke) kind = 2; else if (swept && cool) kind = 3; else if (newEp && cool && (sd === 1 ? x.c < p : x.c > p)) kind = 1; } }
        if (kind) { if (kind === 2) { l.st = 2; l.bb = i; } else if (kind === 3) l.st = 3; else { l.st = l.st === 3 ? 3 : 1; l.nb++; } l.le = i;
          if (l.C >= 2 && (!best || l.C > best.l.C || (l.C === best.l.C && kind > best.k))) best = { l: l, k: kind }; } });
      if (best) { var bl = best.l, near = function (sd2, ref) { var r = null; S.map.forEach(function (m2) { if (sd2 === 1 && m2.p > ref && (r == null || m2.p < r)) r = m2.p; if (sd2 === -1 && m2.p < ref && (r == null || m2.p > r)) r = m2.p; }); return r; };
        var dir = best.k === 1 ? -bl.sd : best.k === 2 ? bl.sd : -bl.sd, tgt = near(dir, x.c), tgt2 = tgt == null ? null : near(dir, tgt);
        var inv = best.k === 3 ? (bl.sd === 1 ? Math.max(x.h, b[i - 1].h, b[i - 2].h) : Math.min(x.l, b[i - 1].l, b[i - 2].l)) : bl.p, buf = best.k === 3 ? 0 : (atr[i] || 0) * 0.25;
        S.ev = { kind: best.k, dir: dir, p: bl.p, tag: bl.t, tgt: tgt, tgt2: tgt2, inv: inv, buf: buf, t: t, i: i, news: isNews, bias: bias, ses: sess(t),
          msg: (best.k === 1 ? (bl.sd === -1 ? '▲ ارتد من دعم ' : '▼ رفض من مقاومة ') : best.k === 2 ? (bl.sd === -1 ? '✕ كُسر دعم ' : '✕ كُسرت مقاومة ') : (bl.sd === 1 ? '↺ كسر كاذب فوق مقاومة ' : '↺ كسر كاذب تحت دعم ')) + bl.p.toFixed(2) + ' (' + bl.t + ')' + (tgt != null ? ' · الهدف ' + tgt.toFixed(2) + (tgt2 != null ? ' ← التالي ' + tgt2.toFixed(2) : '') : '') + ' · يُلغى بإغلاق ' + (dir === 1 ? 'تحت ' + (inv - buf).toFixed(2) : 'فوق ' + (inv + buf).toFixed(2)) + (best.k === 3 ? ' (ذيل السحب)' : '') };
        S.evRes = 0; hist.evs.push(S.ev); }
      if (S.ev && S.evRes === 0 && i > S.ev.i) { var uT = S.ev.tgt != null && S.ev.tgt > S.ev.inv, dT = S.ev.tgt != null && S.ev.tgt < S.ev.inv;
        if ((uT && x.h >= S.ev.tgt) || (dT && x.l <= S.ev.tgt)) S.evRes = 1; else if ((uT && x.c < S.ev.inv - S.ev.buf) || (dT && x.c > S.ev.inv + S.ev.buf)) S.evRes = -1;
        if (S.evRes !== 0) { if (S.ev.news || isNews) stats.add(118, S.evRes === 1, t); else { var bI = 88 + (S.ev.kind - 1) * 6, trd = S.ev.dir === S.ev.bias ? 0 : 1; [bI, bI + 1 + trd, bI + 3 + S.ev.ses].forEach(function (ix) { stats.add(ix, S.evRes === 1, t); });
          if (S.ev.kind === 3) for (var k3 = 0; k3 < 11; k3++) if (lnHas(S.ev.tag, k3)) stats.add(106 + k3, S.evRes === 1, t); } } }
      // ===== pauses 📦 (Pine 2667-2765)
      bxStep(i);
      // ===== 🧠 tests (Pine 2218-2224, 2076-2106)
      gch.forEach(function (c) { if (!chAct(c)) return; var tl = atr4 ? atr4 * 0.1 : (atr[i] || 0) * 0.3; if (c.px != null && x.h >= c.px - tl && x.l <= c.px + tl) lnStart(c.px, 'قناة', x.o < c.px ? 1 : -1, tl, cxOf(x.o < c.px ? 1 : -1, 0), isNews); });
      lnEval(atr4 ? atr4 * 0.35 : atr[i], (atr[i] || 0) * P.lvBrkATR);
      R.push({ t: t, bias: bias, trendOk: trendOk, upConf: upConf, dnConf: dnConf, cu: cu, cd: cd, isNews: isNews });
      if (i === n - 1) { var snap = { i: i, t: t, close: x.c, atr: atr[i], atr4: atr4, bias: bias, trendOk: trendOk, yellow: y, green: gr, vwap: vwap[i], upConf: upConf, dnConf: dnConf, cu: cu, cd: cd,
        emaSet: emaSet, vwapSet: vwapSet, dEma: upperEma, setClose: setClose, X4: X4, zones4: g(z4, B4[i]) || [], zones1: g(z1, B1[i]) || [], bullOB: S.bullOB.slice(0, P.obZones), bearOB: S.bearOB.slice(0, P.obZones),
        fvg: S.fvg.slice(), liq: { phTop: S.phTop, phCr: S.phCr, plBtm: S.plBtm, plCr: S.plCr }, today: S.dp, y: S.y, yNaked: S.yNaked, dSt: S.dSt, dShort: S.dShort, dMsg: S.dMsg,
        c3On: !!S.c3On, map: S.map, mTol: S.mTol, mATR: S.mATR, ev: S.ev, evRes: S.evRes, news: isNews ? nm : '', tradeSide: S.tradeSide, lastSide: S.lastSide, bx: S.bx, kstSize: kSize, adx: adx[i] }; }
    }
    function sess(tt) { var h = berlinHour(tt); return h < 8 ? 0 : h < 14 ? 1 : 2; }
    function cxOf(sd, nb) { var bias = R.length ? R[R.length - 1].bias : 0; var trd = bias === (sd === -1 ? 1 : -1) ? 0 : 1; return trd + 2 * sess(b[i].t) + 6 * (nb > 0 ? 1 : 0); }
    function lnStart(p, tg, sd, tl, cx, nw) { if (S.ts.some(function (z) { return Math.abs(z.p - p) <= tl; }) || S.ts.length >= 60) return; S.ts.push({ p: p, t: tg, s: sd, b: i, r: 0, x: cx, n: nw }); }
    function lnEval(rD, bT) { var x = b[i]; for (var j = S.ts.length - 1; j >= 0; j--) { var z = S.ts[j], del = z.r !== 0 && i - z.r > 6;
      if (z.r === 0) { var nw = z.n || (R.length && R[R.length - 1].isNews);
        if (z.s === -1 ? x.c < z.p - bT : x.c > z.p + bT) { if (nw) stats.add(117, false, x.t); else stats.record(z.t, false, z.x, x.t); z.r = i; }
        else if (i > z.b && (z.s === -1 ? x.h >= z.p + rD : x.l <= z.p - rD)) { if (nw) stats.add(117, true, x.t); else stats.record(z.t, true, z.x, x.t); z.r = i; }
        else if (i - z.b > 16) z.r = i; }
      if (del) S.ts.splice(j, 1); } }
    function bxStep(i2) { var x = b[i2], a = atr[i2]; if (a == null) return; var lim = 1.5 * a, alive = a >= 0.6 * (atrAvg[i2] || a), X = S.bx;
      if (X.st === 2) { if (i2 - X.mv <= 2 && !X.failed && x.c < X.top && x.c > X.bot) X.failed = true; if (i2 - X.mv >= 2) X.st = 0; }
      else if (X.st === 1) { if (x.c > X.top || x.c < X.bot) { var dir = x.c > X.top ? 1 : -1, sr = 0; for (var k2 = 1; k2 <= X.n; k2++) sr += b[i2 - k2].h - b[i2 - k2].l;
          X.st = 2; X.dir = dir; X.mv = i2; X.strong = Math.abs(x.c - x.o) >= 0.5 * (x.h - x.l) && x.h - x.l >= sr / X.n; X.failed = false; X.against = R.length && R[R.length - 1].bias !== 0 && R[R.length - 1].bias !== dir; }
        else { var nt = Math.max(X.top, x.h), nb = Math.min(X.bot, x.l); if (nt - nb <= lim && X.n < 12) { X.top = nt; X.bot = nb; X.n++; } else X.st = 0; } }
      if (X.st === 0 && alive) { var bestK = 0, hh = x.h, ll = x.l; for (k2 = 1; k2 <= 7 && i2 - k2 >= 0; k2++) { hh = Math.max(hh, b[i2 - k2].h); ll = Math.min(ll, b[i2 - k2].l); if (k2 >= 2 && hh - ll <= lim) bestK = k2 + 1; }
        if (bestK >= 3 && i2 - (X.mv || -99) >= bestK) { var tp = x.h, bt = x.l; for (k2 = 1; k2 < bestK; k2++) { tp = Math.max(tp, b[i2 - k2].h); bt = Math.min(bt, b[i2 - k2].l); } X.st = 1; X.top = tp; X.bot = bt; X.n = bestK; X.t0 = b[i2 - bestK + 1].t; } } }
    return { snap: snap, sigs: hist.sigs, evs: hist.evs, stats: stats, chLines: chLines, newsList: news, bars: n };
  }
  function toBars(a, sec) { return a.map(function (r) { return { t: r[0] * 1000, o: r[1], h: r[2], l: r[3], c: r[4], v: r[5] || 0 }; }); }
  function agg(bars, dur) { var o = [], cur = null; bars.forEach(function (x) { var k = bucket(x.t, dur); if (!cur || cur.t !== k) { cur = { t: k, o: x.o, h: x.h, l: x.l, c: x.c, v: x.v || 0 }; o.push(cur); } else { cur.h = Math.max(cur.h, x.h); cur.l = Math.min(cur.l, x.l); cur.c = x.c; cur.v += x.v || 0; } }); return o; }
  function merge(a, bArr) { var m = {}; a.concat(bArr).forEach(function (x) { m[x.t] = x; }); return Object.keys(m).map(Number).sort(function (p, q) { return p - q; }).map(function (k) { return m[k]; }); }
  // history.json (Dukascopy + biquote, NY-aligned) + fresh biquote bars -> closed 15M/1H/4H/D series
  function buildData(H, live, now, extra15) {
    var K = H.volK || 1, sc = function (a) { return (a || []).map(function (x) { return { t: x.t, o: x.o, h: x.h, l: x.l, c: x.c, v: (x.v || 0) / K }; }); };
    var cl = function (a, dur) { return a.filter(function (x) { return x.t + dur <= now; }); };
    var m15 = cl(merge(merge(toBars(H.m15), extra15 || []), sc(live.m15)), M15), h1 = cl(merge(toBars(H.h1), sc(live.h1)), H1);
    var h4s = toBars(H.h4), cut = h4s.length > 8 ? h4s[h4s.length - 8].t : 0;
    var h4 = cl(h4s.filter(function (x) { return x.t < cut; }).concat(agg(h1.filter(function (x) { return x.t >= cut; }), H4)), H4);
    var d1s = toBars(H.d1), cutD = d1s.length > 3 ? d1s[d1s.length - 3].t : 0;
    var d1 = cl(d1s.filter(function (x) { return x.t < cutD; }).concat(agg(h1.filter(function (x) { return x.t >= cutD; }), D1)), D1);
    return { m15: m15, h1: h1, h4: h4, d1: d1 };
  }
  var api = { buildData: buildData, P: P, run: run, bucket: bucket, dayKey: dayKey, agg: agg, merge: merge, toBars: toBars, chLines: chLines, newsList: newsList, Stats: Stats, h4Extra: h4Extra, zoneCalc: zoneCalc, LN: LN };
  if (typeof module !== 'undefined') module.exports = api; else root.MOP = api;
})(this);
