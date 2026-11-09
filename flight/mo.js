/* MO Gold Pro level map + signal logic for the flight game (pure functions, also runs in node for tests).
   4H Grok lines = exact port of CHANNELS/channels15/channels15.py g4_floor + bot/grok1_lines.py nbars/bar4.
   knife / pause / 4H liquidity / S/R 4H / EMA 4H / round number / sweep = port of channels15.py mo_features.
   Core BUY/SELL = MO core signal (4 closes above/below HTF EMA50 yellow, 4H EMA50 green, 4H VWAP + chop filter). */
(function (root) {
  'use strict';
  var H = 3600e3;
  var G4 = { floor0: 4046.98, t0: Date.UTC(2026, 10, 2, 11), slope: -0.44, W: 125.74 }; // 2026-11-02 12:00 Berlin
  var fmtNY = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hourCycle: 'h23', weekday: 'short' });
  var fmtB = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  var fmtBD = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' });
  var WD = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  function nyParts(ms) { var o = {}; fmtNY.formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; }); return { h: +o.hour, wd: WD[o.weekday] }; }
  var openCache = {};
  function openH(ms) { // grok1_lines.open_h
    if (ms in openCache) return openCache[ms];
    var n = nyParts(ms), h = n.h, w = n.wd;
    return (openCache[ms] = !(h === 17 || (w === 4 && h >= 17) || w === 5 || (w === 6 && h < 18)));
  }
  function nbars(a, b) { var s = 1; if (b < a) { s = -1; var x = a; a = b; b = x; } var c = 0; for (var t = a; t < b; t += H) c += openH(t) ? 1 : 0; return s * c; }
  function berlinHM(ms) { var p = fmtB.format(new Date(ms)).split(':'); return { h: +p[0], m: +p[1] }; }
  function bar4(ms) { var hm = berlinHM(ms); var fl = Math.floor(ms / 60e3) * 60e3 - hm.m * 60e3; return fl - (hm.h % 4) * H; }
  function roundHalfEven(x) { var f = Math.floor(x), d = x - f; if (Math.abs(d - 0.5) < 1e-9) return f % 2 === 0 ? f : f + 1; return Math.round(x); }
  var g4Cache = {};
  function g4(ms) {
    var b = bar4(ms), f = g4Cache[b];
    if (f === undefined) f = g4Cache[b] = G4.floor0 + G4.slope * roundHalfEven(nbars(G4.t0, b) / 4);
    return { floor: f, mid: f + G4.W / 2, roof: f + G4.W, W: G4.W };
  }
  function berlinDay(ms) { return fmtBD.format(new Date(ms)); }
  function berlinTime(ms) { return fmtB.format(new Date(ms)); }
  // ---- helpers on bars {t(ms open),o,h,l,c,v,open(bool)}
  function atr(bs, n) { n = n || 14; bs = bs.slice(-(n + 1)); var s = 0, k = 0; for (var i = 1; i < bs.length; i++) { var a = bs[i - 1], b = bs[i]; s += Math.max(b.h - b.l, Math.abs(b.h - a.c), Math.abs(b.l - a.c)); k++; } return k ? s / k : 0; }
  function rmaAtr(bs, n) { var out = [], r = null, s = 0; for (var i = 0; i < bs.length; i++) { var b = bs[i], tr = i ? Math.max(b.h - b.l, Math.abs(b.h - bs[i - 1].c), Math.abs(b.l - bs[i - 1].c)) : b.h - b.l; if (i < n) { s += tr; r = i === n - 1 ? s / n : null; } else r = (r * (n - 1) + tr) / n; out.push(r); } return out; }
  function emaSeries(vals, n) { var out = [], k = 2 / (n + 1), e = null, s = 0; for (var i = 0; i < vals.length; i++) { if (i < n) { s += vals[i]; e = i === n - 1 ? s / n : null; } else e = vals[i] * k + e * (1 - k); out.push(e); } return out; }
  function pivots(bs, n) { var out = []; for (var i = n; i < bs.length - n; i++) { var mh = -1e9, ml = 1e9; for (var j = i - n; j <= i + n; j++) { if (bs[j].h > mh) mh = bs[j].h; if (bs[j].l < ml) ml = bs[j].l; } if (bs[i].h === mh) out.push({ i: i, px: bs[i].h, kind: 'H', t: bs[i].t }); if (bs[i].l === ml) out.push({ i: i, px: bs[i].l, kind: 'L', t: bs[i].t }); } return out; }
  function closed(bs, now, durMs) { return bs.filter(function (b) { return !b.open && b.t + durMs <= now; }); }
  // ---- NY-17:00 session id (FXCM/TradingView daily session for XAUUSD)
  function sessKey(ms) { // day of NY time + 7h (17:00 NY rolls to next day)
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(ms + 7 * H));
  }
  // ---- daily volume profile (tick volume spread over each 15m bar range), value area 70%
  function profile(bs, step) {
    step = step || 0.5; if (!bs.length) return null;
    var lo = Infinity, hi = -Infinity; bs.forEach(function (b) { if (b.l < lo) lo = b.l; if (b.h > hi) hi = b.h; });
    var n = Math.max(1, Math.ceil((hi - lo) / step) + 1), bins = new Float64Array(n), tot = 0;
    bs.forEach(function (b) { var a = Math.floor((b.l - lo) / step), z = Math.floor((b.h - lo) / step), v = b.v || 1, per = v / (z - a + 1); for (var i = a; i <= z; i++) bins[i] += per; tot += v; });
    var poc = 0; for (var i = 1; i < n; i++) if (bins[i] > bins[poc]) poc = i;
    var a = poc, z = poc, acc = bins[poc];
    while (acc < 0.7 * tot && (a > 0 || z < n - 1)) { var up = z < n - 1 ? bins[z + 1] : -1, dn = a > 0 ? bins[a - 1] : -1; if (up >= dn) { z++; acc += up; } else { a--; acc += dn; } }
    var px = function (i) { return lo + (i + 0.5) * step; };
    return { poc: px(poc), vah: px(z) + step / 2, val: px(a) - step / 2, hi: hi, lo: lo, bars: bs.length };
  }
  function dailyProfiles(m15, now) {
    var by = {}, keys = []; m15.forEach(function (b) { if (b.t > now) return; var k = sessKey(b.t); if (!by[k]) { by[k] = []; keys.push(k); } by[k].push(b); });
    var tk = sessKey(now), today = by[tk] || [], yk = keys.filter(function (k) { return k < tk; }).pop();
    return { today: profile(today), yday: yk ? profile(by[yk]) : null, todayKey: tk, ydayKey: yk, todayBars: today };
  }
  // 80% rule: today opened outside yesterday's VA and the last 2 closed 15m bars are back inside -> 80% to cross VA
  function rule80(dp) {
    var y = dp.yday, b = dp.todayBars; if (!y || b.length < 3) return null;
    var o = b[0].o, outside = o > y.vah ? 1 : o < y.val ? -1 : 0; if (!outside) return null;
    var c = b.filter(function (x) { return !x.open; }); if (c.length < 2) return null;
    var inside = c.slice(-2).every(function (x) { return x.c <= y.vah && x.c >= y.val; });
    return inside ? { active: true, from: outside > 0 ? 'VAH' : 'VAL', target: outside > 0 ? y.val : y.vah } : { active: false, from: outside > 0 ? 'VAH' : 'VAL' };
  }
  // ---- 4H level map
  function levelMap(ctx) {
    var now = ctx.now, c4 = closed(ctx.h4, now, 4 * H), a4 = atr(c4), price = ctx.price, L = [];
    function add(px, name, group, color) { if (isFinite(px)) L.push({ px: px, name: name, group: group, color: color }); }
    var g = g4(now); add(g.floor, 'أرض 4H Grok', 'grok', '#22d38a'); add(g.mid, 'نص 4H Grok', 'grok', '#ffd34d'); add(g.roof, 'سقف 4H Grok', 'grok', '#ff6b6b');
    pivots(c4, 5).forEach(function (p) { var sw = c4.slice(p.i + 1).some(function (b) { return p.kind === 'H' ? b.h > p.px : b.l < p.px; }); if (!sw) add(p.px, p.kind === 'H' ? 'سيولة 4H فوق' : 'سيولة 4H تحت', 'liq', p.kind === 'H' ? '#ff9f43' : '#4dabf7'); });
    pivots(c4, 15).slice(-4).forEach(function (p) { add(p.px, p.kind === 'H' ? 'مقاومة 4H' : 'دعم 4H', 'sr', p.kind === 'H' ? '#ff4d6d' : '#2ecc71'); });
    var e = emaSeries(c4.map(function (b) { return b.c; }), 50).pop(); if (e) add(e, 'EMA50 4H', 'ema', '#c77dff');
    var dp = dailyProfiles(ctx.m15, now);
    if (dp.today) { add(dp.today.poc, 'POC اليوم', 'prof', '#ffa94d'); add(dp.today.vah, 'VAH اليوم', 'prof', '#74c0fc'); add(dp.today.val, 'VAL اليوم', 'prof', '#74c0fc'); }
    if (dp.yday) { add(dp.yday.poc, 'POC الأمس', 'prof', '#ffc078'); add(dp.yday.vah, 'VAH الأمس', 'prof', '#a5d8ff'); add(dp.yday.val, 'VAL الأمس', 'prof', '#a5d8ff'); }
    if (price) for (var r = Math.floor((price - 120) / 50) * 50; r <= price + 120; r += 50) add(r, 'رقم ' + r, 'round', '#e9ecef');
    (ctx.custom || []).forEach(function (c) { add(+c.px, c.name || 'مستواي', 'custom', '#f783ac'); });
    L.sort(function (a, b) { return a.px - b.px; });
    var tol = Math.max(3, 0.15 * a4), merged = [];  // confluence: merge levels within 1$ into one line, count neighbours within tol
    L.forEach(function (l) { var m = merged[merged.length - 1]; if (m && Math.abs(l.px - m.px) <= 1) { m.names.push(l.name); m.groups.push(l.group); } else merged.push({ px: l.px, names: [l.name], groups: [l.group], color: l.color, name: l.name }); });
    merged.forEach(function (m) { m.conf = L.filter(function (l) { return Math.abs(l.px - m.px) <= tol && m.names.indexOf(l.name) < 0; }).map(function (l) { return l.name; }); m.stars = m.names.length + m.conf.length; m.label = m.names.join(' + '); });
    return { levels: merged, raw: L, tol: tol, atr4: a4, grok: g, profile: dp, r80: rule80(dp) };
  }
  // ---- channels15.mo_features (side BUY = price above the line, coming down to it)
  function moRead(m15, h4, side, line, now) {
    var c15 = closed(m15, now, 15 * 60e3), c4 = closed(h4, now, 4 * H), a15 = atr(c15), a4 = atr(c4);
    var toward = side === 'BUY' ? function (b) { return b.c < b.o; } : function (b) { return b.c > b.o; };
    var knife = !!a15 && c15.slice(-2).some(function (b) { return Math.abs(b.c - b.o) >= 0.5 * (b.h - b.l) && b.h - b.l >= 1.5 * a15 && toward(b); });
    var pause = 0; for (var k = 3; k <= 8; k++) { var w = c15.slice(-k); if (w.length === k && a15) { var mx = Math.max.apply(null, w.map(function (b) { return b.h; })), mn = Math.min.apply(null, w.map(function (b) { return b.l; })); if (mx - mn <= 1.5 * a15) pause = k; } }
    var tol = Math.max(3, 0.15 * a4), conf = [];
    pivots(c4, 5).forEach(function (p) { var sw = c4.slice(p.i + 1).some(function (b) { return p.kind === 'H' ? b.h > p.px : b.l < p.px; }); if (!sw && Math.abs(p.px - line) <= tol && conf.indexOf('سيولة 4H') < 0) conf.push('سيولة 4H'); });
    pivots(c4, 15).slice(-4).forEach(function (p) { if (Math.abs(p.px - line) <= tol && conf.indexOf('S/R 4H') < 0) conf.push('S/R 4H'); });
    if (c4.length >= 50) { var e = emaSeries(c4.map(function (b) { return b.c; }), 50).pop(); if (Math.abs(e - line) <= tol) conf.push('EMA 4H'); }
    var rn = Math.round(line / 50) * 50; if (Math.abs(rn - line) <= tol) conf.push('رقم ' + rn);
    var sweep = c15.slice(-4).some(function (b) { return side === 'BUY' ? (b.l < line && line < b.c) : (b.h > line && line > b.c); });
    return { line: line, knife: knife, pause: pause, conf: conf, sweep: sweep, atr15: a15, atr4: a4 };
  }
  // ---- MO core signal on 15m (yellow = 1H EMA50, green = 4H EMA50, both from the last CLOSED HTF bar;
  //      VWAP = NY-day anchored tick-volume VWAP up to the bar; trendOk = same 5-bar slope and |Y-G| > 0.4 ATR)
  function htfAt(htf, vals, durMs, t15end) { var v = null; for (var i = 0; i < htf.length; i++) { if (htf[i].t + durMs <= t15end) v = vals[i]; else break; } return v; }
  function signals(m15, h1, h4, now) {
    var c15 = closed(m15, now, 15 * 60e3); if (c15.length < 10) return { list: [], trend: 0 };
    var e1 = emaSeries(h1.map(function (b) { return b.c; }), 50), e4 = emaSeries(h4.map(function (b) { return b.c; }), 50), at = rmaAtr(c15, 14);
    var Y = [], G = [], V = [], sk = null, pv = 0, vv = 0;
    c15.forEach(function (b) { var end = b.t + 15 * 60e3; Y.push(htfAt(h1, e1, H, end)); G.push(htfAt(h4, e4, 4 * H, end)); var k = sessKey(b.t); if (k !== sk) { sk = k; pv = 0; vv = 0; } var v = b.v || 1; pv += (b.h + b.l + b.c) / 3 * v; vv += v; V.push(pv / vv); });
    var above = c15.map(function (b, i) { return Y[i] != null && G[i] != null && b.c > Y[i] && b.c > G[i] && b.c > V[i]; });
    var below = c15.map(function (b, i) { return Y[i] != null && G[i] != null && b.c < Y[i] && b.c < G[i] && b.c < V[i]; });
    var last = 0, list = [];
    for (var i = 5; i < c15.length; i++) {
      if (last === -1 && above[i]) last = 0; if (last === 1 && below[i]) last = 0;
      var ok = Y[i] != null && Y[i - 5] != null && Math.sign(Y[i] - Y[i - 5]) === Math.sign(G[i] - G[i - 5]) && Y[i] !== Y[i - 5] && Math.abs(Y[i] - G[i]) > (at[i] || 0) * 0.4;
      var buy = above[i] && above[i - 1] && above[i - 2] && above[i - 3] && !above[i - 4] && last !== 1 && ok;
      var sell = below[i] && below[i - 1] && below[i - 2] && below[i - 3] && !below[i - 4] && last !== -1 && ok;
      if (buy || sell) { last = buy ? 1 : -1; list.push({ side: buy ? 'BUY' : 'SELL', t: c15[i].t, px: c15[i].c, low: c15[i].l, high: c15[i].h }); }
    }
    var n = c15.length - 1, trend = Y[n] != null && G[n] != null ? (Y[n] > G[n] ? 1 : -1) : 0;
    return { list: list, trend: trend, yellow: Y[n], green: G[n], vwap: V[n], trendOk: n >= 5 && Math.sign(Y[n] - Y[n - 5]) === Math.sign(G[n] - G[n - 5]) && Math.abs(Y[n] - G[n]) > (at[n] || 0) * 0.4 };
  }
  var api = { G4: G4, g4: g4, nbars: nbars, bar4: bar4, openH: openH, levelMap: levelMap, moRead: moRead, signals: signals, profile: profile, dailyProfiles: dailyProfiles, rule80: rule80, atr: atr, pivots: pivots, berlinTime: berlinTime, berlinDay: berlinDay, sessKey: sessKey };
  if (typeof module !== 'undefined') module.exports = api; else root.MO = api;
})(this);
