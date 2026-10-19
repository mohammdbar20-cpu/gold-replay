const tr = (s) => window.I18N ? I18N.tr(s) : s;
"use strict";
const $ = (id) => document.getElementById(id);
const TFS = { M5: 300, M15: 900, H1: 3600, H4: 14400, D1: 86400 };
const WIN = 500, OZ = 100;
let MAN, cache = {}, S, B = null, busy = false, playT = null, mode = "none", drag = null, pend = null;
const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Berlin", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
const offM = {};
function off(t) {
  const k = Math.floor(t / 3600);
  if (offM[k] !== void 0) return offM[k];
  const p = {};
  fmt.formatToParts(new Date(k * 36e5)).forEach((x) => p[x.type] = x.value);
  return offM[k] = Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute) / 1e3 - k * 3600;
}
const ds = (t) => new Date((t + off(t)) * 1e3).toISOString().slice(0, 16).replace("T", " ");
function dec(txt) {
  const L = txt.split("\n");
  let n = L.length - 1;
  if (L[n] === "") n--;
  const h = L[0].split(",");
  let t = +h[0], pc = +h[1];
  const T = new Float64Array(n), O = new Float64Array(n), H = new Float64Array(n), Lo = new Float64Array(n), C = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const r = L[i + 1].split(",");
    t += +r[0];
    const o = pc + +r[1];
    T[i] = t * 60;
    O[i] = o / 100;
    H[i] = (o + +r[2]) / 100;
    Lo[i] = (o - r[3]) / 100;
    const c = o + +r[4];
    C[i] = c / 100;
    pc = c;
  }
  return { t: T, o: O, h: H, l: Lo, c: C, n };
}
const LRU = [];
async function load(path) {
  if (!cache[path]) {
    LRU.push(path);
    while (LRU.length > 10) {
      delete cache[LRU.shift()];
    }
    cache[path] = fetch("data/" + path).then((r) => {
      if (!r.ok) throw Error(path);
      return r.text();
    }).then(dec);
    cache[path].catch(() => {
      delete cache[path];
    });
  }
  return cache[path];
}
function cat(arr) {
  arr = arr.filter(Boolean);
  const n = arr.reduce((a, b) => a + b.n, 0), R = { n };
  for (const k of "tohlc") {
    R[k] = new Float64Array(n);
    let p = 0;
    for (const a of arr) {
      R[k].set(a[k], p);
      p += a.n;
    }
  }
  return R;
}
const ym = (t) => {
  const d = new Date(t * 1e3);
  return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0");
};
const prevYm = (s) => {
  let [y, m] = s.split("-").map(Number);
  m--;
  if (!m) {
    m = 12;
    y--;
  }
  return y + "-" + String(m).padStart(2, "0");
};
const nextYm = (s) => {
  let [y, m] = s.split("-").map(Number);
  m++;
  if (m > 12) {
    m = 1;
    y++;
  }
  return y + "-" + String(m).padStart(2, "0");
};
async function m1(a, b) {
  if (!isFinite(a) || !isFinite(b)) return { n: 0, t: [], o: [], h: [], l: [], c: [] };
  const ms = [];
  let k = ym(a);
  const e = ym(b);
  let g = 0;
  while (k <= e && g++ < 240) {
    if (MAN.m1.includes(k)) ms.push(k);
    k = nextYm(k);
  }
  return cat(await Promise.all(ms.map((m) => load("m1/" + m + ".csv"))));
}
async function tfBars(tf, t) {
  if (MAN.tf[tf].months) {
    const back = tf === "H1" ? 2 : 1;
    let k = ym(t);
    const ks = [];
    for (let i = 0; i < back; i++) k = prevYm(k);
    for (let i = 0; i < back + 2; i++) {
      if (MAN.tf[tf].months.includes(k)) ks.push(k);
      k = nextYm(k);
    }
    const key = "w:" + tf + ks.join();
    if (cache.__wk !== key) {
      cache.__wk = key;
      cache.__w = Promise.all(ks.map((v) => load(tf + "m/" + v + ".csv"))).then(cat);
    }
    return cache.__w;
  }
  return load(tf + ".csv");
}
const bs = (A, v, n) => {
  let lo = 0, hi = n - 1, r = -1;
  while (lo <= hi) {
    const m = lo + hi >> 1;
    if (A[m] <= v) {
      r = m;
      lo = m + 1;
    } else hi = m - 1;
  }
  return r;
};
async function lastM1Before(T) {
  let M = await m1(T - 4 * 86400, T);
  let i = bs(M.t, T - 1, M.n);
  if (i < 0) {
    M = await m1(T - 40 * 86400, T);
    i = bs(M.t, T - 1, M.n);
  }
  return i < 0 ? null : M.t[i];
}
const LS = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k));
  } catch (e) {
    return null;
  }
};
function save() {
  dirty++;
  if (window.__course) return;
  localStorage.setItem("gr_session", JSON.stringify(S));
}
function journal() {
  return LS("gr_journal") || [];
}
function setJournal(j) {
  localStorage.setItem("gr_journal", JSON.stringify(j));
}
const chart = LightweightCharts.createChart($("chart"), {
  layout: { background: { color: "#000" }, textColor: "#bbb" },
  grid: { vertLines: { visible: false }, horzLines: { visible: false } },
  rightPriceScale: { borderColor: "#333", minimumWidth: 66 },
  timeScale: { borderColor: "#333", timeVisible: true, rightOffset: 8 },
  crosshair: { mode: 0 },
  autoSize: true
});
const ser = chart.addCandlestickSeries({ upColor: "#9afc41", downColor: "#9c9c9c", borderUpColor: "#9c9c9c", borderDownColor: "#9c9c9c", wickUpColor: "#9c9c9c", wickDownColor: "#9c9c9c", priceFormat: { type: "price", precision: 2, minMove: 0.01 } });
let plines = [], B0 = null;
const EMAC = ["#ffcc00", "#4aa3ff", "#e91e63"];
let emaSer = null, emaPrev = null;
function updEma(force) {
  const m = S.ema;
  if (!m || !B) return;
  if (!m.on) {
    if (emaSer) {
      emaSer.forEach((x) => x.setData([]));
    }
    emaPrev = null;
    return;
  }
  if (!emaSer) emaSer = EMAC.map((c) => chart.addLineSeries({ color: c, lineWidth: 1, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false }));
  const A = B.A, st = B.k - B.nDone, key = m.p.join() + ":" + B.U[0] + ":" + S.tf;
  m.p.forEach((per, j) => {
    const k2 = 2 / (per + 1);
    let e = null, cnt = 0;
    const out = [];
    for (let i = 0; i < st; i++) {
      const c = A.c[i];
      e = e == null ? c : c * k2 + e * (1 - k2);
      cnt++;
    }
    for (let i = 0; i < B.n; i++) {
      const c = B.C[i];
      e = e == null ? c : c * k2 + e * (1 - k2);
      cnt++;
      out.push(cnt >= per ? { time: B0[i].time, value: e } : { time: B0[i].time });
    }
    if (!force && emaPrev && emaPrev.key === key && (B.n === emaPrev.n || B.n === emaPrev.n + 1)) {
      const l = out[out.length - 1];
      if (l.value != null) emaSer[j].update(l);
    } else emaSer[j].setData(out);
    emaSer[j].applyOptions({ visible: true });
  });
  emaPrev = { key, n: B.n };
}
function emaUI() {
  const m = S.ema;
  $("bEma").classList.toggle("on", m.on);
  $("emaLeg").classList.toggle("hidden", !m.on);
  ["e1", "e2", "e3"].forEach((id, i) => $(id).value = m.p[i]);
}
let MC = null, mH, mM, mS, mPrev = null;
function macdInit() {
  if (MC) return;
  MC = LightweightCharts.createChart($("macdC"), {
    layout: { background: { color: "#000" }, textColor: "#888" },
    grid: { vertLines: { visible: false }, horzLines: { color: "#111" } },
    rightPriceScale: { borderColor: "#333", minimumWidth: 66 },
    timeScale: { visible: false, rightOffset: 8 },
    crosshair: { mode: 0 },
    autoSize: true,
    handleScroll: false,
    handleScale: false
  });
  mH = MC.addHistogramSeries({ priceLineVisible: false, lastValueVisible: false });
  mM = MC.addLineSeries({ color: "#4aa3ff", lineWidth: 1, priceLineVisible: false });
  mS = MC.addLineSeries({ color: "#ff9800", lineWidth: 1, priceLineVisible: false });
  chart.timeScale().subscribeVisibleLogicalRangeChange((r) => {
    if (r && MC && S.macd && S.macd.on) MC.timeScale().setVisibleLogicalRange(r);
  });
}
function macdCalc(C, f, sl, sg) {
  const n = C.length, M = new Array(n), Sg = new Array(n), kf = 2 / (f + 1), ks = 2 / (sl + 1), kg = 2 / (sg + 1);
  let ef = C[0], es = C[0], eg = 0;
  for (let i = 0; i < n; i++) {
    ef = i ? C[i] * kf + ef * (1 - kf) : C[i];
    es = i ? C[i] * ks + es * (1 - ks) : C[i];
    M[i] = ef - es;
    eg = i ? M[i] * kg + eg * (1 - kg) : M[i];
    Sg[i] = eg;
  }
  return { M, Sg };
}
function updMacd(force) {
  const m = S.macd;
  if (!m || !m.on || !B) return;
  macdInit();
  const C = B.C, n = B.n, { M, Sg } = macdCalc(C, m.f, m.s, m.g), warm = m.s;
  const pt2 = (i, v) => ({ time: B0[i].time, value: v });
  const H = (i) => ({ time: B0[i].time, value: M[i] - Sg[i], color: M[i] - Sg[i] >= 0 ? "#9afc41" : "#9c9c9c" });
  const key = B.U[0] + ":" + m.f + m.s + m.g;
  if (!force && mPrev && mPrev.key === key && (n === mPrev.n || n === mPrev.n + 1)) {
    if (n > warm) {
      mH.update(H(n - 1));
      mM.update(pt2(n - 1, M[n - 1]));
      mS.update(pt2(n - 1, Sg[n - 1]));
    }
  } else {
    const hs = [], ms = [], ss = [];
    for (let i = 0; i < n; i++) {
      if (i < warm) {
        hs.push({ time: B0[i].time });
        ms.push({ time: B0[i].time });
        ss.push({ time: B0[i].time });
        continue;
      }
      hs.push(H(i));
      ms.push(pt2(i, M[i]));
      ss.push(pt2(i, Sg[i]));
    }
    mH.setData(hs);
    mM.setData(ms);
    mS.setData(ss);
  }
  mPrev = { key, n };
  const r = chart.timeScale().getVisibleLogicalRange();
  if (r) MC.timeScale().setVisibleLogicalRange(r);
}
function macdUI() {
  const m = S.macd;
  $("bMacd").classList.toggle("on", m.on);
  $("macd").classList.toggle("hidden", !m.on);
  document.body.classList.toggle("macd-on", m.on);
  $("mF").value = m.f;
  $("mS").value = m.s;
  $("mG").value = m.g;
}
async function render() {
  const tf = S.tf, cur = S.cur, A = await tfBars(tf, cur);
  let k = bs(A.t, cur, A.n);
  if (k < 0) k = 0;
  const st = Math.max(0, k - WIN), U = [], data = [], O = [], H = [], L = [], C = [];
  for (let i = st; i < k; i++) {
    U.push(A.t[i]);
    O.push(A.o[i]);
    H.push(A.h[i]);
    L.push(A.l[i]);
    C.push(A.c[i]);
  }
  const M = await m1(A.t[k], cur);
  let fo = null, fh = -1e9, fl = 1e9, fc = null;
  for (let i = 0; i < M.n; i++) {
    const t = M.t[i];
    if (t < A.t[k] || t > cur) continue;
    if (fo === null) fo = M.o[i];
    fh = Math.max(fh, M.h[i]);
    fl = Math.min(fl, M.l[i]);
    fc = M.c[i];
  }
  const nDone = U.length;
  if (fo !== null) {
    U.push(A.t[k]);
    O.push(fo);
    H.push(fh);
    L.push(fl);
    C.push(fc);
  }
  for (let i = 0; i < U.length; i++) data.push({ time: U[i] + off(U[i]), open: O[i], high: H[i], low: L[i], close: C[i] });
  ser.setData(data);
  B0 = data;
  B = { U, O, H, L, C, n: U.length, nDone, tfs: TFS[tf], A, k };
  S.price = C[C.length - 1];
  B.smc = S.smc.on ? computeSMC(B) : null;
  dirty++;
  updMacd();
  updEma();
  $("clock").textContent = ds(cur) + " \u0628\u0631\u0644\u064A\u0646";
  $("price").textContent = S.price.toFixed(2);
  updLines();
  updPos();
}
async function targetNext() {
  const A = B.A, k = B.k;
  const endCur = k + 1 < A.n ? await lastM1Before(A.t[k + 1]) : null;
  if (endCur !== null && endCur > S.cur) return endCur;
  if (k + 2 < A.n) return await lastM1Before(A.t[k + 2]);
  if (k + 1 < A.n) {
    const M = await m1(A.t[k + 1], A.t[k + 1] + 40 * 86400);
    return M.n ? M.t[M.n - 1] : null;
  }
  return null;
}
async function advance(to) {
  if (to === null || to <= S.cur) {
    stopPlay();
    status("\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A");
    return false;
  }
  if (S.ps.some((p) => p.sl != null || p.tp != null || p.trail)) {
    const M = await m1(S.cur + 60, to);
    for (let i = 0; i < M.n && S.ps.length; i++) {
      const t = M.t[i];
      if (t <= S.cur || t > to) continue;
      for (const p of S.ps.slice()) {
        trailUpd(M, i, p);
        checkHit(M, i, p);
      }
    }
  }
  S.cur = to;
  await render();
  save();
  return true;
}
async function doStep(fn) {
  if (busy) return;
  busy = true;
  try {
    await advance(await fn());
  } catch (e) {
    console.error(e);
    status("\u062E\u0637\u0623: " + e.message);
  }
  busy = false;
}
const stepNext = () => doStep(targetNext);
const stepDay = () => doStep(async () => {
  const M = await m1(S.cur, S.cur + 86400 * 4);
  const i = bs(M.t, S.cur + 86400, M.n);
  return i >= 0 ? M.t[i] : null;
});
let revT = null;
function stopPlay() {
  if (revT) {
    clearInterval(revT);
    revT = null;
  }
  const rb = $("bRev");
  if (rb) {
    rb.textContent = "\u25C0\uFE0F";
    rb.classList.remove("playing");
  }
  if (playT) {
    clearInterval(playT);
    playT = null;
  }
  $("bPlay").textContent = "\u25B6\uFE0F";
  $("bPlay").classList.remove("playing");
}
function status(s) {
  $("status").textContent = s;
  setTimeout(() => {
    if ($("status").textContent === s) $("status").textContent = "";
  }, 4e3);
}
const num = (id) => {
  const v = parseFloat($(id).value);
  return isFinite(v) ? v : null;
};
function checkHit(M, i, p) {
  const d = p.side === "buy" ? 1 : -1;
  const slHit = p.sl != null && (d > 0 ? M.l[i] <= p.sl : M.h[i] >= p.sl), tpHit = p.tp != null && (d > 0 ? M.h[i] >= p.tp : M.l[i] <= p.tp);
  if (slHit) {
    closePos(p.sl, "SL", M.t[i], p);
    return true;
  }
  if (tpHit) {
    closePos(p.tp, "TP", M.t[i], p);
    return true;
  }
  return false;
}
const PIP = 0.1;
function openPos(side, quick) {
  stopPlay();
  const lots = quick ? S.qlot || 0.01 : num("lots");
  if (!lots || lots <= 0) return alert("\u0623\u062F\u062E\u0644 \u062D\u062C\u0645 \u0627\u0644\u0644\u0648\u062A");
  const e = S.price, sl = quick ? null : num("sl"), tp = quick ? null : num("tp"), d = side === "buy" ? 1 : -1;
  if (sl != null && (sl - e) * d >= 0) return alert("\u0648\u0642\u0641 \u0627\u0644\u062E\u0633\u0627\u0631\u0629 \u0641\u064A \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u062E\u0637\u0623");
  if (tp != null && (tp - e) * d <= 0) return alert("\u0627\u0644\u0647\u062F\u0641 \u0641\u064A \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u062E\u0637\u0623");
  const p = { id: Date.now() + Math.floor(Math.random() * 1e3), side, entry: e, sl, sl0: sl, tp, lots, open: S.cur, tf: S.tf, why: quick ? "" : $("why").value, feel: $("feel").value, conf: FEEL, bal0: S.balance, quick: !!quick, ctx: Object.assign(snapCtx(), { confidence: FEEL }) };
  S.ps.push(p);
  save();
  updLines();
  updPos();
  return p;
}
function closePos(px, reason, t, p, frac) {
  stopPlay();
  p = p || S.ps[0];
  if (!p) return;
  const tc = t || S.cur;
  const part = frac && frac < 1 && p.lots >= 0.02;
  const cl = part ? Math.max(0.01, Math.round(p.lots * frac * 100) / 100) : p.lots;
  if (S.draw && !part) S.draw.forEach((d2) => {
    if (d2.type === "pos" && d2.st === "live" && (d2.posId == null || d2.posId === p.id)) {
      d2.st = "done";
      d2.res = reason;
      d2.t2 = Math.max(d2.t2, tc);
    }
  });
  const d = p.side === "buy" ? 1 : -1, gross = +((px - p.entry) * d * OZ * cl).toFixed(2), cst = tradeCost(p, tc, cl), pnl = +(gross - cst.total).toFixed(2), sl0 = p.sl0 != null ? p.sl0 : p.sl, risk = sl0 != null && Math.abs(p.entry - sl0) > 0 ? Math.abs(p.entry - sl0) * OZ * cl : null, riskD = risk || (p.bal0 || S.balance) * (S.riskPct || 1) / 100 * cl / p.lots;
  const tr2 = { id: Date.now() + Math.floor(Math.random() * 1e3), openT: p.open, closeT: tc, bal0: p.bal0, open: ds(p.open), close: ds(tc), dur: Math.round((tc - p.open) / 60), tf: p.tf, side: p.side, pid: p.id, lots: cl, partial: part || void 0, sl0, be: p.be || void 0, trail: p.trail ? true : void 0, entry: p.entry, sl: p.sl, tp: p.tp, exit: +px.toFixed(2), reason, gross, cost: cst.total, costs: cst, pnl, R: +(pnl / riskD).toFixed(2), Rg: +(gross / riskD).toFixed(2), Rest: risk ? void 0 : true, why: p.why, feeling: p.feel || "", conf: p.conf || null, quick: !!p.quick, ctx: p.ctx };
  const j = journal();
  j.push(tr2);
  setJournal(j);
  S.balance = +(S.balance + pnl).toFixed(2);
  if (part) {
    p.lots = +(p.lots - cl).toFixed(2);
    p.partials = (p.partials || 0) + 1;
  } else S.ps = S.ps.filter((x) => x !== p);
  save();
  status((reason === "TP" ? "\u2705 " : reason === "SL" ? "\u274C " : "") + "\u0623\u063A\u0644\u0642\u062A \u0627\u0644\u0635\u0641\u0642\u0629: " + pnl + "$");
  if (!S.ps.length) {
    $("why").value = "";
    setFeel(null);
  }
  updLines();
  updPos();
  renderJournal();
}
function closeAll() {
  S.ps.slice().forEach((p) => closePos(S.price, "\u064A\u062F\u0648\u064A", null, p));
}
const fpl = (p) => (S.price - p.entry) * (p.side === "buy" ? 1 : -1) * OZ * p.lots - openCost(p), fpips = (p) => (S.price - p.entry) * (p.side === "buy" ? 1 : -1) / PIP;
const durTxt = (m) => m >= 1440 ? (m / 1440).toFixed(1) + " \u064A\u0648\u0645" : m >= 60 ? (m / 60).toFixed(1) + " \u0633\u0627\u0639\u0629" : m + " \u062F\u0642\u064A\u0642\u0629";
function updPos() {
  const open = S.ps.reduce((a, p) => a + fpl(p), 0), eq = S.balance + open;
  $("bal").textContent = S.balance.toFixed(2);
  $("acct").innerHTML = "\u0627\u0644\u0631\u0635\u064A\u062F <b>" + S.balance.toFixed(2) + '$</b> \xB7 \u0627\u0644\u0623\u0633\u0647\u0645 <b class="' + (open >= 0 ? "w" : "l") + '">' + eq.toFixed(2) + '$</b> \xB7 \u0639\u0627\u0626\u0645 <b class="' + (open >= 0 ? "w" : "l") + '">' + (open >= 0 ? "+" : "") + open.toFixed(2) + "$</b>";
  if (!S.ps.length) {
    $("pos").textContent = "\u0644\u0627 \u062A\u0648\u062C\u062F \u0635\u0641\u0642\u0629 \u0645\u0641\u062A\u0648\u062D\u0629";
  } else {
    $("pos").innerHTML = '<div class="plist">' + S.ps.map((p) => {
      const pl = fpl(p);
      return '<div class="pitem"><span class="' + (p.side === "buy" ? "w" : "l") + '">' + (p.side === "buy" ? "\u0634\u0631\u0627\u0621" : "\u0628\u064A\u0639") + "</span> " + p.lots + " @ " + p.entry.toFixed(2) + (p.sl != null ? " | SL " + p.sl : "") + (p.tp != null ? " | TP " + p.tp : "") + ' <b class="' + (pl >= 0 ? "w" : "l") + '">' + (pl >= 0 ? "+" : "") + pl.toFixed(2) + "$ (" + fpips(p).toFixed(0) + 'p)</b><span class="pmg"><button class="pbe" data-id="' + p.id + '" title="\u0646\u0642\u0644 \u0627\u0644\u0648\u0642\u0641 \u0644\u0644\u062F\u062E\u0648\u0644" ' + (p.sl == null || p.be ? "disabled" : "") + '>BE</button><button class="phalf" data-id="' + p.id + '" title="\u0625\u063A\u0644\u0627\u0642 \u062C\u0632\u0626\u064A 50%" ' + (p.lots < 0.02 ? "disabled" : "") + '>\xBD</button><button class="ptrail' + (p.trail ? " on" : "") + '" data-id="' + p.id + '" title="\u0648\u0642\u0641 \u0645\u062A\u062D\u0631\u0643" ' + (p.sl == null ? "disabled" : "") + '>\u21E2</button></span><button class="pclose" data-id="' + p.id + '">\u2715 \u0625\u063A\u0644\u0627\u0642</button></div>';
    }).join("") + "</div>" + (S.ps.length > 1 ? '<button id="bCloseAll">\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0643\u0644</button>' : "");
    document.querySelectorAll(".pclose").forEach((b) => b.onclick = () => {
      const p = S.ps.find((x) => String(x.id) === b.dataset.id);
      if (p) closePos(S.price, "\u064A\u062F\u0648\u064A", null, p);
    });
    const ca = $("bCloseAll");
    if (ca) ca.onclick = closeAll;
    mgmtBind();
  }
  updRisk();
}
function updRisk() {
  const p = S.pos, e = p ? p.entry : S.price, sl = p ? p.sl : num("sl"), lots = p ? p.lots : num("lots"), tp = p ? p.tp : num("tp");
  if (sl == null || !lots) {
    $("risk").textContent = "\u0627\u0644\u0645\u062E\u0627\u0637\u0631\u0629: \u2014";
    return;
  }
  const r = Math.abs(e - sl) * OZ * lots;
  let s = "\u0627\u0644\u0645\u062E\u0627\u0637\u0631\u0629: " + r.toFixed(2) + "$ (" + (r / S.balance * 100).toFixed(2) + "%)";
  if (tp != null) s += " | \u0627\u0644\u0639\u0627\u0626\u062F/\u0627\u0644\u0645\u062E\u0627\u0637\u0631\u0629 1:" + (Math.abs(tp - e) / Math.abs(e - sl)).toFixed(2);
  $("risk").textContent = s;
}
function updLines() {
  plines.forEach((l) => ser.removePriceLine(l));
  plines = [];
  const add = (price, color, title, style, w) => {
    if (price != null) plines.push(ser.createPriceLine({ price, color, lineWidth: w || 2, lineStyle: style, axisLabelVisible: true, title }));
  };
  for (const p of S.ps) {
    const pl = fpl(p);
    add(p.entry, pl >= 0 ? "#089981" : "#f23645", tr((p.side === "buy" ? "\u0634\u0631\u0627\u0621 " : "\u0628\u064A\u0639 ") + p.lots + "  " + (pl >= 0 ? "+" : "") + pl.toFixed(2) + "$  " + fpips(p).toFixed(0) + "p"), 0);
    add(p.sl, "#ff4d4d", "SL", 2, 1);
    add(p.tp, "#9afc41", "TP", 2, 1);
  }
  if (!S.ps.length) {
    add(num("sl"), "#ff4d4d", "SL?", 2);
    add(num("tp"), "#9afc41", "TP?", 2);
  }
}
function computeSMC(b) {
  const n = b.nDone, H = b.H, L = b.L, C = b.C, R = { lines: [], obs: [], fvg: [], sw: null, zone: null };
  if (n < 20) return R;
  function struct(len, tag) {
    let leg = -1, top = null, bot = null, trend = 0, tT = null, tB = null;
    const lines = [], obs = [];
    for (let i = len; i < n; i++) {
      const j = i - len;
      let mh = -1e9, ml = 1e9;
      for (let q = j + 1; q <= i; q++) {
        if (H[q] > mh) mh = H[q];
        if (L[q] < ml) ml = L[q];
      }
      const nl = H[j] > mh ? 0 : L[j] < ml ? 1 : leg;
      if (nl !== leg && nl >= 0) {
        if (nl === 0) {
          top = { p: H[j], i: j, x: false };
          tT = { p: H[j], i: j };
        } else {
          bot = { p: L[j], i: j, x: false };
          tB = { p: L[j], i: j };
        }
        leg = nl;
      }
      if (tT && H[i] > tT.p) tT = { p: H[i], i };
      if (tB && L[i] < tB.p) tB = { p: L[i], i };
      for (let q = obs.length - 1; q >= 0; q--) {
        const o = obs[q];
        if (o.bull ? C[i] < o.bot : C[i] > o.top) obs.splice(q, 1);
      }
      if (top && !top.x && C[i] > top.p) {
        lines.push({ i1: top.i, i2: i, p: top.p, t: trend === -1 ? "CHoCH" : "BOS", bull: true, int: tag });
        trend = 1;
        top.x = true;
        let m = top.i;
        for (let q = top.i; q < i; q++) if (L[q] < L[m]) m = q;
        obs.push({ i: m, top: H[m], bot: L[m], bull: true, int: tag });
      }
      if (bot && !bot.x && C[i] < bot.p) {
        lines.push({ i1: bot.i, i2: i, p: bot.p, t: trend === 1 ? "CHoCH" : "BOS", bull: false, int: tag });
        trend = -1;
        bot.x = true;
        let m = bot.i;
        for (let q = bot.i; q < i; q++) if (H[q] > H[m]) m = q;
        obs.push({ i: m, top: H[m], bot: L[m], bull: false, int: tag });
      }
    }
    return { lines: lines.slice(tag ? -12 : -8), obs: obs.slice(-5), trend, tT, tB };
  }
  const I = struct(5, true), Sw = struct(50, false);
  R.raw = { I, Sw };
  R.lines = [...S.smc.istr ? I.lines : [], ...S.smc.sstr ? Sw.lines : []];
  R.obs = [...S.smc.iob ? I.obs : [], ...S.smc.sob ? Sw.obs : []];
  if (S.smc.fvg) {
    const g = [];
    for (let i = 2; i < n; i++) {
      for (let q = g.length - 1; q >= 0; q--) {
        const f = g[q];
        if (f.bull ? L[i] <= f.bot : H[i] >= f.top) g.splice(q, 1);
      }
      if (L[i] > H[i - 2] && C[i - 1] > H[i - 2]) g.push({ i: i - 1, top: L[i], bot: H[i - 2], bull: true });
      if (H[i] < L[i - 2] && C[i - 1] < L[i - 2]) g.push({ i: i - 1, top: L[i - 2], bot: H[i], bull: false });
    }
    R.fvg = g.slice(-8);
  }
  R.fvgAll = function() {
    const g = [];
    for (let i = 2; i < n; i++) {
      for (let q = g.length - 1; q >= 0; q--) {
        const f = g[q];
        if (f.bull ? L[i] <= f.bot : H[i] >= f.top) g.splice(q, 1);
      }
      if (L[i] > H[i - 2] && C[i - 1] > H[i - 2]) g.push({ i: i - 1, top: L[i], bot: H[i - 2], bull: true });
      if (H[i] < L[i - 2] && C[i - 1] < L[i - 2]) g.push({ i: i - 1, top: L[i - 2], bot: H[i], bull: false });
    }
    return g.slice(-8);
  }();
  if (Sw.tT && Sw.tB) {
    if (S.smc.sw) R.sw = { top: Sw.tT, bot: Sw.tB, trend: Sw.trend };
    if (S.smc.zone) R.zone = { top: Sw.tT.p, bot: Sw.tB.p, i: Math.min(Sw.tT.i, Sw.tB.i) };
  }
  return R;
}
const cv = $("ov"), cx = cv.getContext("2d"), ts = chart.timeScale();
function t2l(t) {
  const U = B.U, n = B.n;
  if (!n) return 0;
  if (t >= U[n - 1]) return n - 1 + (t - U[n - 1]) / B.tfs;
  if (t <= U[0]) return (t - U[0]) / B.tfs;
  const i = bs(U, t, n);
  return i + (t - U[i]) / (U[i + 1] - U[i]);
}
function l2t(l) {
  const U = B.U, n = B.n;
  if (l >= n - 1) return U[n - 1] + (l - n + 1) * B.tfs;
  if (l <= 0) return U[0] + l * B.tfs;
  const i = Math.floor(l);
  return U[i] + (l - i) * (U[i + 1] - U[i]);
}
const X = (t) => ts.logicalToCoordinate(t2l(t)), Y = (p) => ser.priceToCoordinate(p), XI = (i) => ts.logicalToCoordinate(i);
function pt(e) {
  const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  const l = ts.coordinateToLogical(x), p = ser.coordinateToPrice(y);
  return { x, y, t: l == null ? null : l2t(l), p };
}
const lineP = (a, b, t) => a.p + (b.p - a.p) * ((t - a.t) / (b.t - a.t || 1));
function segs(d) {
  if (d.type === "pos") return [];
  if (d.type === "pen") {
    const o = [];
    for (let i = 1; i < d.pts.length; i++) o.push([d.pts[i - 1], d.pts[i]]);
    return o;
  }
  if (d.type === "hline") return [[{ t: -1e12, p: d.a.p }, { t: 1e12, p: d.a.p }]];
  const s = [[d.a, d.b]];
  if (d.type === "chan") s.push([{ t: d.a.t, p: d.a.p + d.off }, { t: d.b.t, p: d.b.p + d.off }]);
  return s;
}
function handles(d) {
  if (d.type === "pos") return [["e", d.t, d.e], ["sl", d.t, d.sl], ["tp", d.t, d.tp], ["w", d.t2, d.e]];
  if (d.type === "pen") return [];
  if (d.type === "hline") return [["a", l2t(B.n - 1), d.a.p]];
  const h = [["a", d.a.t, d.a.p], ["b", d.b.t, d.b.p]];
  if (d.type === "chan") {
    const m = (d.a.t + d.b.t) / 2;
    h.push(["c", m, lineP(d.a, d.b, m) + d.off]);
  }
  return h;
}
let dirty = 1, lastKey = "";
const HIST = [];
function snap() {
  HIST.push(JSON.stringify(S.draw));
  if (HIST.length > 50) HIST.shift();
}
function updUndo() {
  const b = $("bUndo");
  if (b) b.disabled = !(pend || HIST.length);
}
function undo() {
  if (pend) {
    if (pend.type === "chan" && pend.stage === 2) {
      pend.stage = 1;
      pend.b = pend.a;
    } else pend = null;
  } else if (HIST.length) {
    S.draw = JSON.parse(HIST.pop());
    drag = null;
    save();
    select(sel < S.draw.length ? sel : -1);
  }
  dirty++;
  updUndo();
}
function draw() {
  if (document.hidden) return setTimeout(() => requestAnimationFrame(draw), 500);
  const dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
  const key = B ? [w, h, dirty, XI(0), XI(B.n - 1), Y(S.price), Y(S.price * 1.01), mode, sel, S.draw.length, JSON.stringify(pend), drag ? JSON.stringify(S.draw) : ""].join("|") : "x" + dirty;
  if (key === lastKey) return requestAnimationFrame(draw);
  lastKey = key;
  updUndo();
  placeScale();
  if (cv.width !== w * dpr || cv.height !== h * dpr) {
    cv.width = w * dpr;
    cv.height = h * dpr;
  }
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  cx.clearRect(0, 0, w, h);
  if (!B) return requestAnimationFrame(draw);
  const pw = w - 60;
  cx.save();
  cx.beginPath();
  cx.rect(0, 0, pw, h);
  cx.clip();
  const xr = XI(B.n - 1) + 20, sm = B.smc;
  const box = (x1, y1, x2, y2, f) => {
    if (x1 == null || y1 == null || y2 == null) return;
    cx.fillStyle = f;
    cx.fillRect(x1, Math.min(y1, y2), x2 - x1, Math.abs(y2 - y1));
  };
  const txt = (s, x, y, c) => {
    cx.fillStyle = c;
    cx.font = "11px sans-serif";
    cx.fillText(s, x, y);
  };
  if (S.smc.on && sm) {
    if (sm.zone) {
      const z = sm.zone, x1 = XI(z.i), r = z.top - z.bot;
      box(x1, Y(z.top), xr, Y(z.top - 0.05 * r), "rgba(242,54,69,.18)");
      txt("Premium", x1 + 2, Y(z.top) + 11, "#f23645");
      box(x1, Y(z.bot + 0.525 * r), xr, Y(z.bot + 0.475 * r), "rgba(160,160,160,.18)");
      txt("Equilibrium", x1 + 2, Y(z.bot + 0.5 * r) + 4, "#aaa");
      box(x1, Y(z.bot + 0.05 * r), xr, Y(z.bot), "rgba(8,153,129,.2)");
      txt("Discount", x1 + 2, Y(z.bot) - 3, "#089981");
    }
    for (const f of sm.fvg) box(XI(f.i), Y(f.top), xr, Y(f.bot), f.bull ? "rgba(0,255,104,.15)" : "rgba(255,0,8,.15)");
    for (const o of sm.obs) {
      box(XI(o.i), Y(o.top), xr, Y(o.bot), o.int ? o.bull ? "rgba(49,121,245,.22)" : "rgba(247,124,128,.22)" : o.bull ? "rgba(24,72,204,.3)" : "rgba(178,40,51,.3)");
      if (!o.int) txt(o.bull ? "Bull OB" : "Bear OB", XI(o.i) + 2, Y(o.bull ? o.bot : o.top) + (o.bull ? -3 : 11), "#ccc");
    }
    for (const l of sm.lines) {
      const x1 = XI(l.i1), x2 = XI(l.i2), y = Y(l.p);
      if (x1 == null || y == null) continue;
      const c = l.bull ? "#089981" : "#f23645";
      cx.strokeStyle = c;
      cx.lineWidth = 1;
      cx.setLineDash(l.int ? [4, 3] : []);
      cx.beginPath();
      cx.moveTo(x1, y);
      cx.lineTo(x2, y);
      cx.stroke();
      cx.setLineDash([]);
      txt(l.t, (x1 + x2) / 2 - 12, y + (l.bull ? -3 : 11), c);
    }
    if (sm.sw) {
      const s = sm.sw;
      cx.lineWidth = 1;
      for (const [o, lab, c] of [[s.top, s.trend === -1 ? "Strong High" : "Weak High", "#f23645"], [s.bot, s.trend === 1 ? "Strong Low" : "Weak Low", "#089981"]]) {
        const x1 = XI(o.i), y = Y(o.p);
        if (x1 == null || y == null) continue;
        cx.strokeStyle = c;
        cx.beginPath();
        cx.moveTo(x1, y);
        cx.lineTo(xr, y);
        cx.stroke();
        txt(lab, xr - 70, y + (c === "#089981" ? 12 : -3), c);
      }
    }
  }
  for (const d of S.draw.concat(pend ? [pend] : [])) {
    if (d.type === "pos") {
      drawPos(d, pw);
      continue;
    }
    const col = d === pend && d.type !== "pen" ? "#fc0" : d.color || "#4aa3ff";
    cx.strokeStyle = rgba(col, d.op == null ? 1 : d.op);
    cx.lineCap = cx.lineJoin = "round";
    cx.lineWidth = (d.lw || 2) + (d === S.draw[sel] ? 1 : 0);
    cx.setLineDash(d.ls === 1 ? [8, 5] : d.ls === 2 ? [2, 4] : []);
    for (const g of pix(d, pw)) {
      if (g.some((v) => v == null)) continue;
      cx.beginPath();
      cx.moveTo(g[0], g[1]);
      cx.lineTo(g[2], g[3]);
      cx.stroke();
    }
    cx.setLineDash([]);
    if (d.type === "chan" && d.b && d.fill !== false) {
      const P = [X(d.a.t), Y(d.a.p), X(d.b.t), Y(d.b.p), Y(d.b.p + d.off), Y(d.a.p + d.off)];
      if (!P.some((v) => v == null)) {
        cx.fillStyle = rgba(d.fc || col, d.fo == null ? 0.1 : d.fo);
        cx.beginPath();
        cx.moveTo(P[0], P[1]);
        cx.lineTo(P[2], P[3]);
        cx.lineTo(P[2], P[4]);
        cx.lineTo(P[0], P[5]);
        cx.fill();
      }
    }
    if (d !== pend && (mode === "edit" || d === S.draw[sel])) for (const [, t, p] of handles(d)) {
      const hx = d.type === "hline" ? pw - 20 : X(t), hy = Y(p);
      if (hx == null || hy == null) continue;
      cx.fillStyle = "#000";
      cx.strokeStyle = col;
      cx.lineWidth = 2;
      cx.beginPath();
      cx.arc(hx, hy, 8, 0, 7);
      cx.fill();
      cx.stroke();
    }
  }
  cx.restore();
  requestAnimationFrame(draw);
}
function dSeg(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy || 1;
  let u = ((px - x1) * dx + (py - y1) * dy) / L;
  u = Math.max(0, Math.min(1, u));
  return Math.hypot(px - x1 - u * dx, py - y1 - u * dy);
}
function pix(d, pw) {
  if (d.type === "hline") {
    const y = Y(d.a.p);
    return [[0, y, pw, y]];
  }
  const out = [];
  for (const [a, b] of segs(d)) {
    let x1 = X(a.t), y1 = Y(a.p), x2 = X(b.t), y2 = Y(b.p);
    if (d.ext && x1 != null && x2 != null && y1 != null && y2 != null && Math.abs(x2 - x1) > 0.5) {
      const k = (pw + 50 - x2) / (x2 - x1);
      if (k > 0) {
        x2 += k * (x2 - x1);
        y2 += k * (y2 - y1);
      }
    }
    out.push([x1, y1, x2, y2]);
  }
  return out;
}
function hitDraw(q) {
  const pw = cv.clientWidth - 60;
  for (let i = S.draw.length - 1; i >= 0; i--) {
    if (S.draw[i].type === "pos") {
      if (posHit(S.draw[i], q)) return i;
      continue;
    }
    for (const g of pix(S.draw[i], pw)) {
      if (g.some((v) => v == null)) continue;
      if (dSeg(q.x, q.y, g[0], g[1], g[2], g[3]) < 18) return i;
    }
  }
  return -1;
}
function hitHandle(d, q) {
  const pw = cv.clientWidth - 60;
  for (const [k, t, p] of handles(d)) {
    const hx = d.type === "hline" ? pw - 20 : X(t), hy = Y(p);
    if (hx != null && hy != null && Math.hypot(hx - q.x, hy - q.y) < 24) return k;
  }
  return null;
}
function mag(q) {
  if (!S.magnet || !B || q.t == null) return q;
  const l = ts.coordinateToLogical(q.x);
  if (l == null) return q;
  const i = Math.round(l);
  if (i < 0 || i >= B.n) return q;
  let best = null, bd = 30;
  for (const v of [B.O[i], B.H[i], B.L[i], B.C[i]]) {
    const y = Y(v);
    if (y == null) continue;
    const dd = Math.abs(y - q.y);
    if (dd < bd) {
      bd = dd;
      best = v;
    }
  }
  return best == null ? q : { x: XI(i), y: Y(best), t: B.U[i], p: best };
}
const P2 = (q) => ({ t: q.t, p: q.p });
function rgba(h, a) {
  if (!h || h[0] !== "#") return h;
  const n = parseInt(h.length === 4 ? h.slice(1).split("").map((c) => c + c).join("") : h.slice(1), 16);
  return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
}
const PAL = ["#ffffff", "#d1d4dc", "#9c9c9c", "#5d606b", "#363a45", "#000000", "#f23645", "#ff9800", "#ffeb3b", "#9afc41", "#089981", "#00bcd4", "#2962ff", "#4aa3ff", "#673ab7", "#9c27b0", "#e91e63", "#ff5252", "#ffb74d", "#fff176", "#81c784", "#4dd0e1", "#90caf9", "#ce93d8"];
const STY_KEYS = ["color", "op", "lw", "ls", "fill", "fc", "fo"];
function remember(d) {
  S.sty = S.sty || {};
  const o = {};
  STY_KEYS.forEach((k) => {
    if (d[k] != null) o[k] = d[k];
  });
  S.sty[d.type] = o;
}
function applyLast(d) {
  const o = S.sty && S.sty[d.type];
  if (o) STY_KEYS.forEach((k) => {
    if (d[k] == null && o[k] != null) d[k] = o[k];
  });
  return d;
}
let popTarget = "color";
function stylePopUI() {
  const d = S.draw[sel];
  if (!d) return;
  const isC = d.type === "chan";
  $("pFillRow").style.display = isC ? "" : "none";
  const cur = popTarget === "fc" ? d.fc || d.color || "#4aa3ff" : d.color || "#4aa3ff";
  document.querySelectorAll("#stylePop .pc").forEach((b) => b.classList.toggle("on", b.dataset.pc === cur));
  $("pOp").value = Math.round(100 * (popTarget === "fc" ? d.fo == null ? 0.1 : d.fo : d.op == null ? 1 : d.op));
  $("pOpV").textContent = $("pOp").value + "%";
  document.querySelectorAll("#stylePop [data-lw]").forEach((b) => b.classList.toggle("on", +b.dataset.lw === (d.lw || 2)));
  document.querySelectorAll("#stylePop [data-ls]").forEach((b) => b.classList.toggle("on", +b.dataset.ls === (d.ls || 0)));
  $("pFill").classList.toggle("on", d.fill !== false);
  $("pTgtLine").classList.toggle("on", popTarget === "color");
  $("pTgtFill").classList.toggle("on", popTarget === "fc");
  $("sColor").style.background = d.color || "#4aa3ff";
}
function styEdit(fn) {
  if (sel < 0) return;
  snap();
  const d = S.draw[sel];
  fn(d);
  remember(d);
  save();
  dirty++;
  stylePopUI();
}
function atrNow() {
  const n = B.nDone || B.n, i0 = Math.max(0, n - 14);
  let s = 0;
  for (let i = i0; i < n; i++) s += B.H[i] - B.L[i];
  return s / Math.max(1, n - i0);
}
function newPos(side, q) {
  const a = atrNow(), e = +q.p.toFixed(2), d = side === "buy" ? 1 : -1;
  return { type: "pos", side, t: q.t, t2: q.t + B.tfs * 25, e, sl: +(e - d * 1.5 * a).toFixed(2), tp: +(e + d * 3 * a).toFixed(2), st: "draft" };
}
function posLots(d) {
  const r = Math.abs(d.e - d.sl) * OZ;
  if (!r) return 0.01;
  return Math.max(0.01, Math.floor(S.balance * (S.riskPct || 1) / 100 / r * 100) / 100);
}
function posRes(d) {
  if (d.st === "done") return d.res;
  const U = B.U, n = B.nDone;
  const dir = d.side === "buy" ? 1 : -1;
  let i = bs(U, d.t, B.n);
  if (i < 0) i = 0;
  for (i = i + 1; i < n && U[i] <= d.t2; i++) {
    if (dir > 0 ? B.L[i] <= d.sl : B.H[i] >= d.sl) return "SL";
    if (dir > 0 ? B.H[i] >= d.tp : B.L[i] <= d.tp) return "TP";
  }
  return null;
}
function posBox(d, pw) {
  const x1 = X(d.t), x2 = X(d.t2);
  return { x1, x2, ye: Y(d.e), ys: Y(d.sl), yt: Y(d.tp) };
}
function posHit(d, q) {
  const b = posBox(d);
  if ([b.x1, b.x2, b.ye, b.ys, b.yt].some((v) => v == null)) return false;
  const y0 = Math.min(b.ys, b.yt), y1 = Math.max(b.ys, b.yt);
  return q.x >= Math.min(b.x1, b.x2) - 6 && q.x <= Math.max(b.x1, b.x2) + 6 && q.y >= y0 - 6 && q.y <= y1 + 6;
}
function drawPos(d, pw) {
  const b = posBox(d);
  if ([b.x1, b.x2, b.ye, b.ys, b.yt].some((v) => v == null)) return;
  const res = posRes(d), w = b.x2 - b.x1;
  cx.fillStyle = res === "TP" ? "rgba(8,153,129,.5)" : "rgba(8,153,129,.22)";
  cx.fillRect(b.x1, Math.min(b.ye, b.yt), w, Math.abs(b.yt - b.ye));
  cx.fillStyle = res === "SL" ? "rgba(242,54,69,.5)" : "rgba(242,54,69,.22)";
  cx.fillRect(b.x1, Math.min(b.ye, b.ys), w, Math.abs(b.ys - b.ye));
  cx.strokeStyle = "#ddd";
  cx.lineWidth = 1;
  cx.setLineDash(d.st === "draft" ? [4, 3] : []);
  cx.beginPath();
  cx.moveTo(b.x1, b.ye);
  cx.lineTo(b.x2, b.ye);
  cx.stroke();
  cx.setLineDash([]);
  const rr = Math.abs(d.tp - d.e) / (Math.abs(d.e - d.sl) || 1), lots = d.lots || posLots(d), risk = Math.abs(d.e - d.sl) * OZ * lots, rew = Math.abs(d.tp - d.e) * OZ * lots, up = d.yt < d.ye;
  const lab = (t0, x, y, bg) => {
    const t = tr(t0);
    cx.font = "bold 11px system-ui,sans-serif";
    const tw = cx.measureText(t).width + 10;
    cx.fillStyle = bg;
    cx.fillRect(x, y - 8, tw, 16);
    cx.fillStyle = "#fff";
    cx.fillText(t, x + 5, y + 4);
  };
  const xl = Math.min(b.x1, b.x2) + 2;
  lab("\u0627\u0644\u0647\u062F\u0641 " + d.tp.toFixed(2) + "  +" + Math.abs(d.tp - d.e).toFixed(2) + "  ($" + rew.toFixed(0) + ")  RR 1:" + rr.toFixed(2), xl, b.yt + (b.yt < b.ye ? -10 : 10), "#087a66");
  lab("\u0627\u0644\u0648\u0642\u0641 " + d.sl.toFixed(2) + "  -" + Math.abs(d.e - d.sl).toFixed(2) + "  | " + lots.toFixed(2) + " \u0644\u0648\u062A | \u0645\u062E\u0627\u0637\u0631\u0629 $" + risk.toFixed(0), xl, b.ys + (b.ys > b.ye ? 10 : -10), "#a3202e");
  lab((d.side === "buy" ? "\u0634\u0631\u0627\u0621 " : "\u0628\u064A\u0639 ") + d.e.toFixed(2) + (d.st === "live" ? " \u2022 \u0645\u0646\u0641\u0630\u0629" : d.st === "done" ? " \u2022 " + (d.res || "") : "") + (res === "TP" ? " \u2705" : res === "SL" ? " \u274C" : ""), xl, b.ye, d.side === "buy" ? "#1d5e1d" : "#7a1d1d");
}
function execPos() {
  if (sel < 0) return;
  const d = S.draw[sel];
  if (!d || d.type !== "pos" || d.st !== "draft") return;
  if (Q) {
    Q.bias = d.side === "buy" ? "up" : "down";
    $("qE").value = d.e.toFixed(2);
    $("qSL").value = d.sl.toFixed(2);
    $("qTP").value = d.tp.toFixed(2);
    snap();
    d.st = "quiz";
    save();
    quizUI();
    select(sel);
    status("\u062A\u0645 \u0636\u0628\u0637 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0645\u0646 \u0627\u0644\u0645\u0631\u0628\u0639 \u2014 \u0627\u0636\u063A\u0637 \u0627\u0643\u0634\u0641");
    return;
  }
  const dp = S.price - d.e;
  snap();
  d.e = +(d.e + dp).toFixed(2);
  d.sl = +(d.sl + dp).toFixed(2);
  d.tp = +(d.tp + dp).toFixed(2);
  $("sl").value = d.sl;
  $("tp").value = d.tp;
  $("lots").value = posLots(d).toFixed(2);
  const np = openPos(d.side);
  if (np) {
    d.st = "live";
    d.posId = np.id;
    d.lots = np.lots;
    d.e = np.entry;
    d.t = S.cur;
    d.t2 = Math.max(d.t2, S.cur + B.tfs * 5);
    save();
    select(sel);
    status("\u2714 \u062A\u0645 \u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0635\u0641\u0642\u0629");
  }
}
function simplify(pts) {
  const P = pts.map((o) => [X(o.t), Y(o.p)]);
  let eps = 1.5, keep;
  const rdp = (a, b) => {
    let md = 0, mi = -1;
    for (let i = a + 1; i < b; i++) {
      const d = dSeg(P[i][0], P[i][1], P[a][0], P[a][1], P[b][0], P[b][1]);
      if (d > md) {
        md = d;
        mi = i;
      }
    }
    if (md > eps) {
      rdp(a, mi);
      keep[mi] = 1;
      rdp(mi, b);
    }
  };
  do {
    keep = new Uint8Array(P.length);
    keep[0] = keep[P.length - 1] = 1;
    rdp(0, P.length - 1);
    eps *= 1.6;
  } while (keep.reduce((a, v) => a + v, 0) > 300);
  return pts.filter((o, i) => keep[i]).map((o) => ({ t: o.t, p: +o.p.toFixed(3) }));
}
let sel = -1;
function select(i) {
  sel = i;
  dirty++;
  const tb = $("selBar");
  if (sel < 0 || !S.draw[sel] || S.draw[sel].type === "pos") $("stylePop").classList.add("hidden");
  else {
    popTarget = "color";
    stylePopUI();
  }
  if (tb) {
    tb.classList.toggle("hidden", sel < 0);
    if (sel >= 0) {
      const d = S.draw[sel];
      $("sExt").classList.toggle("on", !!d.ext);
      $("sExt").style.display = d.type === "hline" || d.type === "pen" || d.type === "pos" ? "none" : "";
      $("sExec").style.display = d.type === "pos" && d.st === "draft" ? "" : "none";
      $("sColor").style.display = d.type === "pos" ? "none" : "";
    }
  }
  cv.classList.toggle("active", mode !== "none" || sel >= 0);
}
function finish(d) {
  applyLast(d);
  snap();
  S.draw.push(d);
  pend = null;
  save();
  const m = mode;
  mode = "none";
  document.querySelectorAll("#draw [data-m]").forEach((b) => b.classList.remove("on"));
  select(S.draw.length - 1);
}
function selEdit(fn) {
  if (sel < 0) return;
  snap();
  fn(S.draw[sel]);
  save();
  select(sel);
}
chart.subscribeClick((par) => {
  if (mode !== "none" || !B || !par.point) return;
  const i = hitDraw({ x: par.point.x, y: par.point.y });
  if (i >= 0) select(i);
});
let down = null;
cv.addEventListener("pointerdown", (e) => {
  if (!B) return;
  let q = pt(e);
  if (q.t == null || q.p == null) return;
  e.preventDefault();
  down = { x: q.x, y: q.y };
  try {
    cv.setPointerCapture(e.pointerId);
  } catch (_) {
  }
  const qm = mag(q);
  if (mode === "hline") {
    finish({ type: "hline", a: P2(qm) });
  } else if (mode === "tline") {
    if (!pend) pend = { type: "tline", a: P2(qm), b: P2(qm) };
    else {
      pend.b = P2(qm);
      finish(pend);
    }
  } else if (mode === "chan") {
    if (!pend) pend = { type: "chan", a: P2(qm), b: P2(qm), off: 0, stage: 1 };
    else if (pend.stage === 1) {
      pend.b = P2(qm);
      pend.stage = 2;
    } else {
      pend.off = q.p - lineP(pend.a, pend.b, q.t);
      delete pend.stage;
      finish(pend);
    }
  } else if (mode === "long" || mode === "short") {
    finish(newPos(mode === "long" ? "buy" : "sell", q));
  } else if (mode === "pen") {
    pend = applyLast({ type: "pen", pts: [P2(q)] });
    if (!pend.color) pend.color = "#ffcc00";
  } else if (mode === "del") {
    const i = hitDraw(q);
    if (i >= 0) {
      snap();
      S.draw.splice(i, 1);
      save();
    }
  } else {
    const cand = mode === "edit" ? S.draw.map((d, i2) => i2).reverse() : sel >= 0 ? [sel] : [];
    for (const i2 of cand) {
      const d = S.draw[i2], k = hitHandle(d, q);
      if (k) {
        snap();
        drag = { d, k };
        if (mode !== "edit") select(i2);
        return;
      }
    }
    const i = hitDraw(q);
    if (i >= 0 && (mode === "edit" || i === sel)) {
      const d = S.draw[i];
      snap();
      drag = { d, k: "body", l0: ts.coordinateToLogical(q.x), p0: q.p, a0: d.a && P2(d.a), b0: d.b && P2(d.b), pts0: d.pts && d.pts.map(P2), pos0: d.type === "pos" ? Object.assign({}, d) : null };
      if (mode !== "edit") select(i);
      return;
    }
    if (mode === "edit") {
      for (const p of S.ps) for (const k of ["sl", "tp"]) {
        if (p[k] != null && Math.abs(Y(p[k]) - q.y) < 16) {
          drag = { k, p };
          return;
        }
      }
      for (const p of S.ps) {
        if (Math.abs(Y(p.entry) - q.y) < 14) {
          drag = { k: "new", p };
          return;
        }
      }
      if (!S.ps.length) for (const k of ["sl", "tp"]) {
        const v = num(k);
        if (v != null && Math.abs(Y(v) - q.y) < 16) {
          drag = { k };
          return;
        }
      }
    } else if (i >= 0) select(i);
    else select(-1);
  }
});
cv.addEventListener("pointermove", (e) => {
  if (!B) return;
  const q = pt(e);
  if (q.p == null || q.t == null) return;
  if (pend && pend.type === "pen") {
    const L = pend.pts[pend.pts.length - 1];
    if (Math.hypot(X(L.t) - q.x, Y(L.p) - q.y) >= 3 && pend.pts.length < 2e3) {
      pend.pts.push(P2(q));
      dirty++;
    }
    return;
  }
  if (pend && pend.stage !== 2 && mode !== "none") {
    pend.b = P2(mag(q));
    dirty++;
  } else if (pend && pend.stage === 2) {
    pend.off = q.p - lineP(pend.a, pend.b, q.t);
    dirty++;
  }
  if (!drag) return;
  const p = +q.p.toFixed(2);
  dirty++;
  if (drag.d) {
    const d = drag.d;
    if (drag.k === "body") {
      const l = ts.coordinateToLogical(q.x);
      if (l == null) return;
      const dl2 = l - drag.l0, dp = q.p - drag.p0, mv = (o) => ({ t: d.type === "hline" ? o.t : l2t(t2l(o.t) + dl2), p: o.p + dp });
      if (drag.pos0) {
        if (d.st !== "draft") return;
        const o = drag.pos0;
        d.t = l2t(t2l(o.t) + dl2);
        d.t2 = l2t(t2l(o.t2) + dl2);
        d.e = +(o.e + dp).toFixed(2);
        d.sl = +(o.sl + dp).toFixed(2);
        d.tp = +(o.tp + dp).toFixed(2);
      } else if (drag.pts0) d.pts = drag.pts0.map(mv);
      else {
        d.a = mv(drag.a0);
        if (drag.b0) d.b = mv(drag.b0);
      }
    } else if (d.type === "pos") {
      if (drag.k === "w") d.t2 = Math.max(q.t, d.t + B.tfs * 2);
      else if (drag.k !== "e" || d.st === "draft") {
        d[drag.k] = +q.p.toFixed(2);
        if (d.st === "live" && drag.k !== "e") {
          const lp = S.ps.find((x) => x.id === d.posId) || S.ps[0];
          if (lp) {
            lp[drag.k] = d[drag.k];
            updLines();
            updPos();
          }
        }
      }
    } else if (drag.k === "c") d.off = q.p - lineP(d.a, d.b, q.t);
    else {
      const m = mag(q);
      d[drag.k] = { t: d.type === "hline" ? d.a.t : m.t, p: m.p };
    }
  } else if (drag.p) {
    const P = drag.p, dir = P.side === "buy" ? 1 : -1;
    let k = drag.k;
    if (k === "new") {
      if (Math.abs(Y(p) - Y(P.entry)) < 8) return;
      k = (p - P.entry) * dir < 0 ? "sl" : "tp";
      drag.k = k;
    }
    if (k === "sl" && (p - P.entry) * dir >= 0) return;
    if (k === "tp" && (p - P.entry) * dir <= 0) return;
    P[k] = p;
    updLines();
    updPos();
  } else {
    $(drag.k).value = p;
    updLines();
    updPos();
  }
});
cv.addEventListener("pointerup", (e) => {
  const q = pt(e);
  if (drag && drag.p) save();
  if (pend && pend.type === "pen") {
    if (pend.pts.length > 1) {
      pend.pts = simplify(pend.pts);
      snap();
      S.draw.push(pend);
      remember(pend);
      save();
    }
    pend = null;
    dirty++;
    down = null;
    return;
  }
  if (pend && down && q.t != null && Math.hypot(q.x - down.x, q.y - down.y) > 15) {
    if (pend.type === "tline") {
      pend.b = P2(mag(q));
      finish(pend);
    } else if (pend.stage === 1) {
      pend.b = P2(mag(q));
      pend.stage = 2;
    }
  }
  down = null;
  if (drag) {
    drag = null;
    save();
  }
});
function setMode(m) {
  mode = mode === m ? "none" : m;
  pend = null;
  sel = -1;
  $("selBar").classList.add("hidden");
  document.querySelectorAll("#draw [data-m]").forEach((b) => b.classList.toggle("on", b.dataset.m === mode));
  dirty++;
  cv.classList.toggle("active", mode !== "none");
}
function renderJournal() {
  const j = journal(), n = j.length, w = j.filter((t) => t.pnl > 0).length, Rs = j.filter((t) => t.R != null).map((t) => t.R), tot = j.reduce((a, t) => a + t.pnl, 0);
  $("stats").innerHTML = `\u0627\u0644\u0635\u0641\u0642\u0627\u062A: <b>${n}</b> | \u0646\u0633\u0628\u0629 \u0627\u0644\u0631\u0628\u062D: <b>${n ? (w / n * 100).toFixed(1) : 0}%</b> | \u0645\u062A\u0648\u0633\u0637 R: <b>${Rs.length ? (Rs.reduce((a, b) => a + b, 0) / Rs.length).toFixed(2) : "\u2014"}</b> | \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A: <b class="${tot >= 0 ? "w" : "l"}">${tot.toFixed(2)}$</b>`;
  {
    const cs = confStats(j), f = (o) => {
      var _a;
      return o.n ? `${o.n} | ${o.winRate}% | R ${(_a = o.avgR) != null ? _a : "\u2014"}` : "\u2014";
    };
    $("stats").innerHTML += `<div class="small" id="confStats">\u{1F4AA} \u0648\u0627\u062B\u0642: <b>${f(cs.confident)}</b> &nbsp; \u{1F914} \u0645\u062A\u0631\u062F\u062F: <b>${f(cs.hesitant)}</b></div>`;
  }
  const c = $("eq"), g = c.getContext("2d");
  c.width = c.clientWidth * (devicePixelRatio || 1);
  c.height = 120 * (devicePixelRatio || 1);
  g.scale(devicePixelRatio || 1, devicePixelRatio || 1);
  const W = c.clientWidth, Hh = 120, eq = [S.startBal];
  j.forEach((t) => eq.push(eq[eq.length - 1] + t.pnl));
  const mn = Math.min(...eq), mx = Math.max(...eq), rg = mx - mn || 1;
  g.strokeStyle = "#9afc41";
  g.lineWidth = 2;
  g.beginPath();
  eq.forEach((v, i) => {
    const x = 10 + i * (W - 20) / Math.max(1, eq.length - 1), y = Hh - 10 - (v - mn) / rg * (Hh - 20);
    i ? g.lineTo(x, y) : g.moveTo(x, y);
  });
  g.stroke();
  g.fillStyle = "#888";
  g.font = "11px sans-serif";
  g.fillText(mx.toFixed(0), 2, 12);
  g.fillText(mn.toFixed(0), 2, Hh - 2);
  const esc = (s) => String(s != null ? s : "").replace(/[<>&"]/g, (c2) => "&#" + c2.charCodeAt(0) + ";");
  $("journal").innerHTML = "<table><tr><th>\u0627\u0644\u0625\u063A\u0644\u0627\u0642</th><th>\u0627\u0644\u0627\u062A\u062C\u0627\u0647</th><th>\u062F\u062E\u0648\u0644</th><th>SL</th><th>TP</th><th>\u062E\u0631\u0648\u062C</th><th>\u0627\u0644\u0645\u062F\u0629</th><th>$</th><th>R</th><th>\u0627\u0644\u0633\u0628\u0628/\u0627\u0644\u0634\u0639\u0648\u0631</th></tr>" + j.slice().reverse().map((t) => {
    var _a, _b, _c;
    return `<tr><td>${esc(t.close)}</td><td>${t.side === "buy" ? "\u0634\u0631\u0627\u0621" : "\u0628\u064A\u0639"}</td><td>${t.entry}</td><td>${(_a = t.sl) != null ? _a : "\u2014"}</td><td>${(_b = t.tp) != null ? _b : "\u2014"}</td><td>${t.exit} ${esc(t.reason)}</td><td>${t.dur != null ? durTxt(t.dur) : "\u2014"}</td><td class="${t.pnl >= 0 ? "w" : "l"}">${t.pnl}${t.cost ? `<br><small>\u2212${t.cost}</small>` : ""}</td><td>${(_c = t.R) != null ? _c : "\u2014"}</td><td>${esc(t.why)} / ${t.conf === "confident" ? "\u{1F4AA} " : t.conf === "hesitant" ? "\u{1F914} " : ""}${esc(t.feeling)}</td></tr>`;
  }).join("") + "</table>";
  edgeStats(j);
}
let FEEL = null;
const FEELTXT = { confident: "\u0648\u0627\u062B\u0642", hesitant: "\u0645\u062A\u0631\u062F\u062F" };
function setFeel(f) {
  FEEL = f;
  $("feel").value = f ? FEELTXT[f] : "";
  document.querySelectorAll(".feelb").forEach((b) => b.classList.toggle("on", b.dataset.f === f));
}
document.querySelectorAll(".feelb").forEach((b) => b.onclick = () => setFeel(FEEL === b.dataset.f ? null : b.dataset.f));
function confStats(j) {
  const g = (k) => {
    const a = j.filter((t) => t.conf === k), w = a.filter((t) => t.pnl > 0).length, R = a.filter((t) => t.R != null).map((t) => t.R);
    return { n: a.length, winRate: a.length ? +(w / a.length * 100).toFixed(1) : null, avgR: R.length ? +(R.reduce((x, y) => x + y, 0) / R.length).toFixed(2) : null };
  };
  return { confident: g("confident"), hesitant: g("hesitant") };
}
const COLS = ["id", "open", "close", "tf", "side", "lots", "entry", "sl", "tp", "exit", "reason", "pnl", "R", "why", "feeling", "conf", "dur", "quick"];
function dl(name, txt, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([txt], { type }));
  a.download = name;
  a.click();
}
function toCsv(j) {
  const q = (v) => '"' + String(v != null ? v : "").replace(/"/g, '""') + '"';
  return "\uFEFF" + COLS.join(",") + "\n" + j.map((t) => COLS.map((k) => q(t[k])).join(",")).join("\n");
}
function parseCsv(s) {
  s = s.replace(/^\ufeff/, "");
  const rows = [];
  let r = [], f = "", q = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) {
      if (ch === '"') {
        if (s[i + 1] === '"') {
          f += '"';
          i++;
        } else q = false;
      } else f += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      r.push(f);
      f = "";
    } else if (ch === "\n") {
      r.push(f);
      rows.push(r);
      r = [];
      f = "";
    } else if (ch !== "\r") f += ch;
  }
  if (f || r.length) {
    r.push(f);
    rows.push(r);
  }
  const h = rows.shift();
  return rows.map((r2) => {
    const o = {};
    h.forEach((k, i) => {
      let v = r2[i];
      if (["id", "lots", "entry", "sl", "tp", "exit", "pnl", "R"].includes(k)) v = v === "" ? null : +v;
      o[k] = v;
    });
    return o;
  });
}
async function startAt(t) {
  stopPlay();
  const c = await lastM1Before(t);
  if (c == null) return alert("\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A");
  S.cur = c;
  S.ps = [];
  await render();
  const tc = await targetNext();
  if (tc) S.cur = tc;
  await render();
  save();
}
function randStart() {
  const last = Date.parse(MAN.last) / 1e3, first = last - 3 * 365 * 86400;
  let t;
  do {
    t = first + Math.random() * (last - first - 7 * 86400);
  } while ([0, 6].includes(new Date(t * 1e3).getUTCDay()));
  return Math.floor(t / 86400) * 86400 + 6 * 3600 + Math.floor(Math.random() * 11) * 3600;
}
async function init() {
  var _a, _b;
  MAN = await (await fetch("data/manifest.json")).json();
  $("range").textContent = ds(Date.parse(MAN.first) / 1e3) + " \u2192 " + ds(Date.parse(MAN.last) / 1e3);
  S = LS("gr_session") || {};
  S.tf = S.tf || "H1";
  S.draw = S.draw || [];
  S.ps = S.ps || (S.pos ? [Object.assign({ id: 1 }, S.pos)] : []);
  delete S.pos;
  Object.defineProperty(S, "pos", { get() {
    return S.ps[0] || null;
  }, set(v) {
    S.ps = v ? [v] : [];
  }, enumerable: false, configurable: true });
  if (S.magnet === void 0) S.magnet = true;
  S.startBal = (_a = S.startBal) != null ? _a : 1e3;
  S.balance = (_b = S.balance) != null ? _b : S.startBal;
  if (S.v !== 3) {
    S.v = 3;
    S.tf = "H1";
    S.smc = Object.assign({}, S.smc || {}, { on: false });
  }
  if (!isFinite(S.cur)) delete S.cur;
  if (!TFS[S.tf] || S.tf === "M5") S.tf = "H1";
  S.smc = Object.assign({ on: false, istr: true, sstr: true, iob: true, sob: true, fvg: true, sw: true, zone: true }, S.smc || {});
  $("tf").value = S.tf;
  tfBtns();
  S.ema = Object.assign({ on: false, p: [20, 50, 200] }, S.ema || {});
  emaUI();
  if (S.qlot) $("qLot").value = String(S.qlot);
  S.macd = Object.assign({ on: false, f: 12, s: 26, g: 9 }, S.macd || {});
  macdUI();
  $("riskPct").value = S.riskPct || 1;
  if (!S.scale) S.scale = { auto: true, mode: 0 };
  applyScale();
  $("bMag").classList.toggle("on", S.magnet);
  $("startBal").value = S.startBal;
  for (const k in S.smc) {
    const el = $("s_" + k);
    if (el) {
      el.checked = S.smc[k];
      el.onchange = () => {
        S.smc[k] = el.checked;
        save();
        if (B) B.smc = S.smc.on ? computeSMC(B) : null;
        dirty++;
      };
    }
  }
  if (S.cur) {
    await render();
    status("\u062A\u0645\u062A \u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u062C\u0644\u0633\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629");
  } else await startAt(randStart());
  $("startDate").value = new Date(S.cur * 1e3).toISOString().slice(0, 10);
  renderJournal();
  costUI();
  requestAnimationFrame(draw);
  ts.scrollToRealTime();
}
async function stepBack(auto) {
  if (Q) return;
  if (!auto) {
    stopPlay();
    for (let i = 0; busy && i < 200; i++) await new Promise((r) => setTimeout(r, 50));
  }
  if (busy) return;
  busy = true;
  try {
    const first = Date.parse(MAN.first) / 1e3;
    let T;
    if (auto === "bar") {
      const A = B.A, k = B.k;
      const st = A.t[k] < S.cur ? A.t[k] : k > 0 ? A.t[k - 1] : null;
      if (st == null) {
        status("\u0628\u062F\u0627\u064A\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A");
        stopPlay();
        return;
      }
      T = st;
    } else T = S.cur - 86400;
    if (T <= first + 86400) {
      status("\u0628\u062F\u0627\u064A\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A");
      stopPlay();
      return;
    }
    const to = await lastM1Before(T);
    if (to == null || to <= first) {
      status("\u0628\u062F\u0627\u064A\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A");
      stopPlay();
      return;
    }
    const cut = ds(to);
    S.ps = S.ps.filter((p) => p.open <= to);
    const j = journal(), keep = [], gone = [];
    for (const t of j) {
      const ct = t.closeT != null ? t.closeT : null;
      ((ct != null ? ct > to : t.close > cut) ? gone : keep).push(t);
    }
    if (gone.length) {
      gone.forEach((t) => {
        S.balance = +(S.balance - t.pnl).toFixed(2);
      });
      for (const last of gone) {
        if (last.openT == null || last.openT > to) continue;
        const ex = S.ps.find((x) => x.id === (last.pid || last.id));
        if (ex) {
          ex.lots = +(ex.lots + last.lots).toFixed(2);
          continue;
        }
        S.ps.push({ id: last.pid || last.id, sl0: last.sl0, side: last.side, quick: last.quick, entry: last.entry, sl: last.sl, tp: last.tp, lots: last.lots, open: last.openT, tf: last.tf, why: last.why, feel: last.feeling, conf: last.conf, bal0: last.bal0 != null ? last.bal0 : S.balance, ctx: last.ctx });
      }
      setJournal(keep);
      renderJournal();
    }
    S.cur = to;
    await render();
    save();
    updLines();
    updPos();
    if (auto !== "bar") status("\u23EA \u0631\u062C\u0648\u0639 \u064A\u0648\u0645: " + cut);
  } catch (e) {
    console.error(e);
    status("\u062E\u0637\u0623: " + e.message);
  } finally {
    busy = false;
  }
}
$("bBack").onclick = () => stepBack();
$("bNext").onclick = stepNext;
document.addEventListener("keydown", (e) => {
  const tg = e.target, tn = tg && tg.tagName;
  if (tn === "INPUT" || tn === "TEXTAREA" || tn === "SELECT") return;
  const k = e.key;
  if (window.__course && !window.__courseStep && (k === " " || k === "ArrowRight" || k === "ArrowLeft")) return;
  if (k === " " && e.shiftKey) {
    e.preventDefault();
    $("bRev").click();
  } else if (k === " ") {
    e.preventDefault();
    $("bPlay").click();
  } else if (k === "ArrowRight") {
    e.preventDefault();
    if (e.shiftKey) $("bDay").click();
    else $("bNext").click();
  } else if (k === "ArrowLeft" && e.shiftKey) {
    e.preventDefault();
    $("bBack").click();
  } else if ((e.ctrlKey || e.metaKey) && (k === "z" || k === "Z")) {
    e.preventDefault();
    undo();
  } else if (k === "Escape") {
    if (mode !== "none") setMode(mode);
    else select(-1);
  } else if ((k === "Delete" || k === "Backspace") && sel >= 0) {
    e.preventDefault();
    $("sDel").click();
  } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
    const m = { h: "hline", t: "tline", c: "chan", e: "edit", d: "del", p: "pen", l: "long", s: "short" }[k.toLowerCase()];
    if (m) setMode(m);
    else if (k.toLowerCase() === "m") $("bMag").click();
  }
});
$("bDay").onclick = stepDay;
$("bPlay").onclick = () => {
  if (playT) return stopPlay();
  stopPlay();
  $("bPlay").textContent = "\u23F8";
  $("bPlay").classList.add("playing");
  playT = setInterval(stepNext, +$("speed").value);
};
$("speed").onchange = () => {
  if (playT) {
    stopPlay();
    $("bPlay").click();
  } else if (revT) {
    stopPlay();
    $("bRev").click();
  }
};
const revTick = () => stepBack("bar");
$("bRev").onclick = () => {
  if (revT) return stopPlay();
  if (Q) return;
  stopPlay();
  $("bRev").textContent = "\u23F8";
  $("bRev").classList.add("playing");
  revT = setInterval(revTick, +$("speed").value);
};
const tfBtns = () => document.querySelectorAll(".tfb").forEach((b) => b.classList.toggle("on", b.dataset.tf === S.tf));
document.querySelectorAll(".tfb").forEach((b) => b.onclick = () => {
  if (b.dataset.tf === S.tf) return;
  $("tf").value = b.dataset.tf;
  $("tf").onchange();
});
$("tf").onchange = async () => {
  S.tf = $("tf").value;
  tfBtns();
  await render();
  ts.scrollToRealTime();
  save();
};
document.querySelectorAll("#draw [data-m]").forEach((b) => b.onclick = () => setMode(b.dataset.m));
$("bUndo").onclick = undo;
$("bEma").onclick = () => {
  S.ema.on = !S.ema.on;
  emaUI();
  save();
  updEma(true);
};
["e1", "e2", "e3"].forEach((id, i) => $(id).onchange = () => {
  const v = Math.round(num(id));
  if (v > 0 && v <= 500) {
    S.ema.p[i] = v;
    save();
    updEma(true);
  } else emaUI();
});
$("bMacd").onclick = () => {
  S.macd.on = !S.macd.on;
  macdUI();
  save();
  mPrev = null;
  if (S.macd.on) setTimeout(() => updMacd(true), 0);
};
["mF", "mS", "mG"].forEach((id) => $(id).onchange = () => {
  const v = Math.round(num(id));
  if (v > 0 && v <= 200) {
    S.macd[{ mF: "f", mS: "s", mG: "g" }[id]] = v;
    save();
    updMacd(true);
  } else macdUI();
});
const PS = chart.priceScale("right");
function applyScale() {
  const sc = S.scale || (S.scale = { auto: true, mode: 0 });
  PS.applyOptions({ autoScale: sc.auto, mode: sc.mode });
  scaleUI();
  dirty++;
}
function scaleUI() {
  const sc = S.scale || { auto: true, mode: 0 };
  $("scA").classList.toggle("on", !!sc.auto);
  $("scL").classList.toggle("on", sc.mode === 1);
  $("scP").classList.toggle("on", sc.mode === 2);
}
function syncAuto() {
  if (!S.scale) return;
  const a = !!PS.options().autoScale;
  if (a !== S.scale.auto) {
    S.scale.auto = a;
    scaleUI();
    save();
  }
}
["pointerup", "touchend", "wheel", "dblclick"].forEach((ev) => $("chart").addEventListener(ev, () => setTimeout(syncAuto, 50), { passive: true }));
$("scA").onclick = () => {
  S.scale.auto = true;
  applyScale();
  save();
};
$("scL").onclick = () => {
  S.scale.mode = S.scale.mode === 1 ? 0 : 1;
  applyScale();
  save();
};
$("scP").onclick = () => {
  S.scale.mode = S.scale.mode === 2 ? 0 : 2;
  applyScale();
  save();
};
function placeScale() {
  const b = $("scaleBtns");
  const w = PS.width(), h = ts.height();
  if (w > 0) {
    b.style.width = w + "px";
    b.style.height = Math.max(h, 24) + "px";
  }
}
$("bMag").onclick = () => {
  S.magnet = !S.magnet;
  $("bMag").classList.toggle("on", S.magnet);
  save();
};
$("sExt").onclick = () => selEdit((d) => {
  d.ext = !d.ext;
});
document.querySelectorAll("#selBar [data-c]").forEach((b) => b.onclick = () => styEdit((d) => {
  d.color = b.dataset.c;
}));
$("stylePop").querySelector(".pal").innerHTML = PAL.map((c) => '<button class="pc" data-pc="' + c + '" style="background:' + c + '"></button>').join("");
$("sColor").onclick = () => {
  $("stylePop").classList.toggle("hidden");
  stylePopUI();
};
document.querySelectorAll("#stylePop .pc").forEach((b) => b.onclick = () => styEdit((d) => {
  if (popTarget === "fc") {
    d.fc = b.dataset.pc;
    d.fill = true;
  } else d.color = b.dataset.pc;
}));
let opSnap = false;
$("pOp").addEventListener("pointerdown", () => {
  if (sel >= 0 && !opSnap) {
    snap();
    opSnap = true;
  }
});
$("pOp").oninput = () => {
  const d = S.draw[sel];
  if (!d) return;
  if (!opSnap) {
    snap();
    opSnap = true;
  }
  const v = +$("pOp").value / 100;
  if (popTarget === "fc") d.fo = v;
  else d.op = v;
  remember(d);
  save();
  dirty++;
  $("pOpV").textContent = $("pOp").value + "%";
};
$("pOp").onchange = () => {
  opSnap = false;
};
document.querySelectorAll("#stylePop [data-lw]").forEach((b) => b.onclick = () => styEdit((d) => {
  d.lw = +b.dataset.lw;
}));
document.querySelectorAll("#stylePop [data-ls]").forEach((b) => b.onclick = () => styEdit((d) => {
  d.ls = +b.dataset.ls;
}));
$("pFill").onclick = () => styEdit((d) => {
  d.fill = d.fill === false;
});
$("pTgtLine").onclick = () => {
  popTarget = "color";
  stylePopUI();
};
$("pTgtFill").onclick = () => {
  popTarget = "fc";
  stylePopUI();
};
$("sDel").onclick = () => {
  if (sel < 0) return;
  snap();
  S.draw.splice(sel, 1);
  save();
  select(-1);
};
$("sExec").onclick = execPos;
$("riskPct").onchange = () => {
  const v = num("riskPct");
  if (v > 0 && v <= 100) {
    S.riskPct = v;
    save();
    dirty++;
  }
};
$("sOk").onclick = () => select(-1);
$("bClr").onclick = () => {
  if (confirm("\u0645\u0633\u062D \u0643\u0644 \u0627\u0644\u0631\u0633\u0648\u0645\u0627\u062A\u061F")) {
    if (S.draw.length) snap();
    S.draw = [];
    save();
    select(-1);
  }
};
$("bSmc").onclick = () => $("smcPanel").classList.toggle("hidden");
$("bBuy").onclick = () => openPos("buy");
$("bSell").onclick = () => openPos("sell");
$("bClose").onclick = () => closeAll();
$("qBuy").onclick = () => openPos("buy", true);
$("qSell").onclick = () => openPos("sell", true);
$("qLot").onchange = () => {
  const v = parseFloat($("qLot").value);
  if (v > 0) {
    S.qlot = v;
    save();
  }
};
["sl", "tp", "lots"].forEach((k) => $(k).oninput = () => {
  updLines();
  updRisk();
});
$("bAuto").onclick = () => {
  if (!B) return;
  const n = B.n, i0 = Math.max(0, n - 15);
  let hi = -1e9, lo = 1e9;
  for (let i = i0; i < n; i++) {
    hi = Math.max(hi, B.H[i]);
    lo = Math.min(lo, B.L[i]);
  }
  const e = S.price, dist = Math.max(Math.min(e - lo, hi - e), 1);
  $("sl").value = (e - dist).toFixed(2);
  $("tp").value = (e + 2 * dist).toFixed(2);
  status("\u0644\u0644\u0634\u0631\u0627\u0621\u061B \u0627\u0639\u0643\u0633\u0647\u0627 \u0644\u0644\u0628\u064A\u0639");
  updLines();
  updRisk();
};
$("startBal").onchange = () => {
  const v = num("startBal");
  if (v > 0) {
    S.balance = +(S.balance + v - S.startBal).toFixed(2);
    S.startBal = v;
    save();
    updPos();
    renderJournal();
  }
};
$("bStart").onclick = () => {
  const v = $("startDate").value;
  if (v) startAt(Date.parse(v + "T07:00:00Z") / 1e3);
};
$("bRand").onclick = () => startAt(randStart());
$("bCsv").onclick = () => dl("gold-journal.csv", toCsv(journal()), "text/csv");
$("bJson").onclick = () => dl("gold-journal.json", JSON.stringify(journal(), null, 1), "application/json");
$("bWipe").onclick = () => {
  if (confirm("\u062D\u0630\u0641 \u0643\u0644 \u0627\u0644\u0633\u062C\u0644\u061F")) {
    setJournal([]);
    renderJournal();
  }
};
$("imp").onchange = async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const s = await f.text();
  try {
    const arr = f.name.endsWith(".csv") ? parseCsv(s) : JSON.parse(s);
    const j = journal(), ids = new Set(j.map((t) => t.id));
    arr.forEach((t) => {
      if (!ids.has(t.id)) j.push(t);
    });
    setJournal(j);
    renderJournal();
    status("\u062A\u0645 \u0627\u0644\u0627\u0633\u062A\u064A\u0631\u0627\u062F: " + arr.length);
  } catch (err) {
    alert("\u0645\u0644\u0641 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D");
  }
};
window.GR = { coach: () => coachData(), ema: () => emaSer ? emaSer.map((x) => {
  const d = x.data().filter((p) => p.value != null);
  return { n: d.length, last: d[d.length - 1] };
}) : null, get sty() {
  return S.sty;
}, macd: () => MC ? { n: mH.data().length, last: mH.data().slice(-1)[0], range: MC.timeScale().getVisibleLogicalRange(), main: chart.timeScale().getVisibleLogicalRange() } : null, get revT() {
  return revT;
}, get Q() {
  return Q;
}, startChal, execPos, chal: () => CH, PS: () => PS.options(), ptpx(o, r) {
  return { x: r.left + X(o.t), y: r.top + Y(o.p) };
}, stepBack, cpx(i) {
  const r = cv.getBoundingClientRect();
  return { x: r.left + XI(i), y: r.top + Y(B.H[i]), h: B.H[i] };
}, hit: (q) => [hitDraw(q), sel >= 0 && hitHandle(S.draw[sel], q), JSON.stringify(drag)], get sel() {
  return sel;
}, select, mid(i) {
  const d = S.draw[i], r = cv.getBoundingClientRect();
  return { x: r.left + (X(d.a.t) + X(d.b.t)) / 2, y: r.top + (Y(d.a.p) + Y(d.b.p)) / 2, bx: r.left + X(d.b.t), by: r.top + Y(d.b.p) };
}, snapCtx, quiz: () => LS("gr_quiz") || [], get S() {
  return S;
}, get B() {
  return B;
}, stepNext, openPos, closePos, journal };
init().catch((e) => {
  console.error(e);
  status("\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644");
});
function snapCtx() {
  if (B && !B.smc) B.smc = computeSMC(B);
  if (!B || !B.smc || !B.smc.raw) return { tf: S.tf };
  const sm = B.smc, { I, Sw } = sm.raw, px = S.price, r2 = (v) => +v.toFixed(2);
  const tr2 = (t) => t === 1 ? "up" : t === -1 ? "down" : "none", last = (a) => a.length ? ((l) => ({ type: l.t, dir: l.bull ? "bull" : "bear", level: r2(l.p), time: ds(B.U[l.i2]) }))(a[a.length - 1]) : null;
  const near = (a) => {
    let b = null;
    for (const o of a) {
      const d = px > o.top ? px - o.top : px < o.bot ? o.bot - px : 0;
      if (!b || d < b.dist) b = { dir: o.bull ? "bull" : "bear", top: r2(o.top), bot: r2(o.bot), dist: r2(d), inside: d === 0 };
    }
    return b;
  };
  let zone = null;
  if (Sw.tT && Sw.tB) {
    const pct = (px - Sw.tB.p) / (Sw.tT.p - Sw.tB.p || 1) * 100;
    zone = { swingHigh: r2(Sw.tT.p), swingLow: r2(Sw.tB.p), pct: +pct.toFixed(1), area: pct >= 52.5 ? "premium" : pct <= 47.5 ? "discount" : "equilibrium" };
  }
  return {
    tf: S.tf,
    time: ds(S.cur),
    price: px,
    drawings: JSON.parse(JSON.stringify(S.draw)).map((d) => ({ type: d.type, a: d.a && { time: ds(d.a.t), p: r2(d.a.p) }, b: d.b && { time: ds(d.b.t), p: r2(d.b.p) }, off: d.off != null ? r2(d.off) : void 0 })),
    smc: {
      swingTrend: tr2(Sw.trend),
      internalTrend: tr2(I.trend),
      lastSwing: last(Sw.lines),
      lastInternal: last(I.lines),
      zone,
      nearestOB: near(I.obs.concat(Sw.obs)),
      nearestFVG: near(sm.fvgAll || []),
      strongHigh: Sw.trend === -1,
      strongLow: Sw.trend === 1
    }
  };
}
let Q = null;
function quizUI() {
  $("quizP").classList.toggle("hidden", !Q);
  $("bBack").disabled = !!Q;
  $("bRev").disabled = !!Q;
  if (Q) stopPlay();
  if (!Q) return;
  $("qBias").textContent = Q.bias ? "\u0627\u0644\u0627\u062A\u062C\u0627\u0647: " + (Q.bias === "up" ? "\u0635\u0627\u0639\u062F \u2B06" : "\u0647\u0627\u0628\u0637 \u2B07") : "\u0627\u062E\u062A\u0631 \u0627\u0644\u0627\u062A\u062C\u0627\u0647";
}
$("bQuiz").onclick = async () => {
  stopPlay();
  if (S.ps.length) return alert("\u0623\u063A\u0644\u0642 \u0627\u0644\u0635\u0641\u0642\u0629 \u0623\u0648\u0644\u0627\u064B");
  await startAt(randStart());
  Q = { bias: null };
  $("qE").value = S.price.toFixed(2);
  $("qSL").value = "";
  $("qTP").value = "";
  $("qRes").textContent = "";
  quizUI();
  $("quizP").scrollIntoView();
};
$("qUp").onclick = () => {
  if (Q) {
    Q.bias = "up";
    quizUI();
  }
};
$("qDn").onclick = () => {
  if (Q) {
    Q.bias = "down";
    quizUI();
  }
};
$("qX").onclick = () => {
  Q = null;
  quizUI();
};
let CH = null;
async function chalList() {
  if (!CH) CH = await (await fetch("data/challenges.json")).json();
  const sc = S.chal || {};
  $("chalList").innerHTML = CH.map((c, i) => {
    const r = sc[c.id];
    return `<button class="chal" data-i="${i}"><b>#${i + 1}</b> <span>${c.title}</span><small>${c.year} \u2022 ${c.diff}</small>${r ? `<em class="${r.biasOK ? "w" : "l"}">${r.biasOK ? "\u2705" : "\u274C"} ${r.score}</em>` : ""}</button>`;
  }).join("");
  const done = Object.keys(sc).length, ok = Object.values(sc).filter((r) => r.biasOK).length;
  $("chalSum").textContent = `\u0623\u0646\u062C\u0632\u062A ${done}/${CH.length} \u2014 \u0635\u062D\u064A\u062D ${ok}`;
  document.querySelectorAll("#chalList .chal").forEach((b) => b.onclick = () => startChal(CH[+b.dataset.i]));
}
async function startChal(c) {
  stopPlay();
  if (S.ps.length) return alert("\u0623\u063A\u0644\u0642 \u0627\u0644\u0635\u0641\u0642\u0629 \u0623\u0648\u0644\u0627\u064B");
  S.tf = c.tf;
  $("tf").value = c.tf;
  tfBtns();
  await startAt(c.t);
  Q = { bias: null, ch: c.id };
  $("qE").value = S.price.toFixed(2);
  $("qSL").value = "";
  $("qTP").value = "";
  $("qRes").innerHTML = "<b>\u{1F3AF} " + c.title + "</b> \u2014 " + c.diff + "<br>\u0627\u0631\u0633\u0645 \u0645\u0631\u0628\u0639 \u0634\u0631\u0627\u0621/\u0628\u064A\u0639 (\u{1F4C8}/\u{1F4C9}) \u062B\u0645 \u2714 \u0646\u0641\u0651\u0630\u060C \u0623\u0648 \u0627\u062E\u062A\u0631 \u0627\u0644\u0627\u062A\u062C\u0627\u0647\u060C \u062B\u0645 \u{1F441} \u0627\u0643\u0634\u0641.";
  $("chalP").classList.add("hidden");
  quizUI();
  scrollTo(0, 0);
}
$("bChal").onclick = async () => {
  $("chalP").classList.toggle("hidden");
  if (!$("chalP").classList.contains("hidden")) {
    await chalList();
    $("chalP").scrollIntoView();
  }
};
$("qGo").onclick = async () => {
  var _a;
  if (!Q || busy) return;
  if (!Q.bias) return alert("\u0627\u062E\u062A\u0631 \u0627\u0644\u0627\u062A\u062C\u0627\u0647 \u0623\u0648\u0644\u0627\u064B");
  const e = (_a = num("qE")) != null ? _a : S.price, sl = num("qSL"), tp = num("qTP"), N = +$("qN").value, d = Q.bias === "up" ? 1 : -1;
  if (sl != null && (sl - e) * d >= 0) return alert("SL \u0641\u064A \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u062E\u0637\u0623");
  if (tp != null && (tp - e) * d <= 0) return alert("TP \u0641\u064A \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u062E\u0637\u0623");
  const ctx = snapCtx(), t0 = S.cur, p0 = S.price;
  busy = true;
  let to = S.cur;
  try {
    for (let i = 0; i < N; i++) {
      const nt = await targetNext();
      if (nt == null) break;
      S.cur = nt;
      await render();
    }
  } finally {
    busy = false;
  }
  to = S.cur;
  const M = await m1(t0 + 60, to);
  let state = Math.abs(e - p0) < 0.05 ? "filled" : "pending", out = "open", exitPx = null, mfe = 0, mae = 0;
  for (let i = 0; i < M.n; i++) {
    if (M.t[i] <= t0 || M.t[i] > to) continue;
    if (state === "pending") {
      if (M.l[i] <= e && M.h[i] >= e) state = "filled";
      else continue;
    }
    mfe = Math.max(mfe, d > 0 ? M.h[i] - e : e - M.l[i]);
    mae = Math.max(mae, d > 0 ? e - M.l[i] : M.h[i] - e);
    if (sl != null && (d > 0 ? M.l[i] <= sl : M.h[i] >= sl)) {
      out = "SL";
      exitPx = sl;
      break;
    }
    if (tp != null && (d > 0 ? M.h[i] >= tp : M.l[i] <= tp)) {
      out = "TP";
      exitPx = tp;
      break;
    }
  }
  if (state === "pending") out = "not_triggered";
  if (out === "open" && state === "filled") exitPx = S.price;
  const risk = sl != null ? Math.abs(e - sl) : null, R = exitPx != null && risk ? +((exitPx - e) * d / risk).toFixed(2) : null;
  const biasOK = (S.price - p0) * d > 0, score = (biasOK ? 1 : 0) + (out === "TP" ? 2 : out === "SL" ? -1 : 0);
  const rec = { id: Date.now(), date: ds(t0), tf: S.tf, candles: N, bias: Q.bias, entry: e, sl, tp, priceStart: p0, priceEnd: S.price, move: +(S.price - p0).toFixed(2), biasCorrect: biasOK, outcome: out, R, mfe: +mfe.toFixed(2), mae: +mae.toFixed(2), score, ctx };
  const qs = LS("gr_quiz") || [];
  qs.push(rec);
  localStorage.setItem("gr_quiz", JSON.stringify(qs));
  const ok = qs.filter((q) => q.biasCorrect).length;
  $("qRes").innerHTML = `${biasOK ? "\u2705 \u0627\u0644\u0627\u062A\u062C\u0627\u0647 \u0635\u062D\u064A\u062D" : "\u274C \u0627\u0644\u0627\u062A\u062C\u0627\u0647 \u062E\u0637\u0623"} | \u0627\u0644\u062D\u0631\u0643\u0629 ${rec.move}$ | \u0627\u0644\u0635\u0641\u0642\u0629: ${{ TP: "\u0648\u0635\u0644\u062A \u0627\u0644\u0647\u062F\u0641", SL: "\u0636\u0631\u0628 \u0627\u0644\u0648\u0642\u0641", open: "\u0645\u0627 \u0632\u0627\u0644\u062A \u0645\u0641\u062A\u0648\u062D\u0629", not_triggered: "\u0644\u0645 \u062A\u062A\u0641\u0639\u0644" }[out]} ${R != null ? "(" + R + "R)" : ""} | \u0627\u0644\u0646\u0642\u0627\u0637 ${score}<br>\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A ${qs.length} \u2014 \u062F\u0642\u0629 \u0627\u0644\u0627\u062A\u062C\u0627\u0647 ${(ok / qs.length * 100).toFixed(0)}%`;
  if (Q.ch && !Q.done) {
    const c = (CH || []).find((x) => x.id === Q.ch);
    Q.done = 1;
    S.chal = S.chal || {};
    S.chal[Q.ch] = { score, biasOK, outcome: out, R, date: ds(t0), at: (/* @__PURE__ */ new Date()).toISOString() };
    if (c) $("qRes").innerHTML += '<div class="expl">\u{1F4D8} ' + (window.I18N && I18N.de() && c.expl_de ? c.expl_de : c.expl) + "</div>";
  }
  Q.bias = null;
  save();
};
function coachData() {
  const j = journal(), qs = LS("gr_quiz") || [], w = j.filter((t) => t.pnl > 0).length, Rs = j.filter((t) => t.R != null).map((t) => t.R);
  return {
    app: window.I18N && I18N.de() ? "Der Raum" : "\u0627\u0644\u063A\u0631\u0641\u0629",
    appId: "gold-replay",
    v: 1,
    exported: (/* @__PURE__ */ new Date()).toISOString(),
    session: { cursor: ds(S.cur), tf: S.tf, startBalance: S.startBal, balance: S.balance, openPositions: S.ps, equity: +(S.balance + S.ps.reduce((a, p) => a + fpl(p), 0)).toFixed(2) },
    stats: {
      trades: j.length,
      winRate: j.length ? +(w / j.length * 100).toFixed(1) : 0,
      avgR: Rs.length ? +(Rs.reduce((a, b) => a + b, 0) / Rs.length).toFixed(2) : null,
      totalPnl: +j.reduce((a, t) => a + t.pnl, 0).toFixed(2),
      quizzes: qs.length,
      quizBiasAccuracy: qs.length ? +(qs.filter((q) => q.biasCorrect).length / qs.length * 100).toFixed(1) : null
    },
    confidenceStats: confStats(j),
    trades: j.map((t) => Object.assign({}, t, { reason: tr(t.reason), feeling: tr(t.feeling) })),
    quiz: qs,
    challenges: S.chal || {},
    lang: window.I18N && I18N.lang || "ar"
  };
}
$("bCoach").onclick = () => dl("gold-coach-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".json", JSON.stringify(coachData()), "application/json");
$("bCoachCopy").onclick = async () => {
  const s = JSON.stringify(coachData());
  try {
    await navigator.clipboard.writeText(s);
    status("\u062A\u0645 \u0627\u0644\u0646\u0633\u062E \u2014 \u0627\u0644\u0635\u0642\u0647 \u0641\u064A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629");
  } catch (e) {
    prompt("\u0627\u0646\u0633\u062E \u0627\u0644\u0646\u0635:", s);
  }
};
$("bCoachShare").onclick = async () => {
  const s = JSON.stringify(coachData());
  const f = new File([s], "gold-coach.json", { type: "application/json" });
  try {
    if (navigator.canShare && navigator.canShare({ files: [f] })) await navigator.share({ files: [f], title: "Gold coach" });
    else if (navigator.share) await navigator.share({ text: s });
    else $("bCoach").click();
  } catch (e) {
  }
};
const SPR_H = (h) => h >= 13 && h <= 16 ? 0.2 : h >= 7 && h <= 12 ? 0.25 : h >= 17 && h <= 20 ? 0.3 : h >= 21 && h <= 22 ? 0.6 : 0.4;
const SWAP = { buy: -45, sell: 15 };
function costCfg() {
  S.cost = Object.assign({ on: true, mode: "auto", spread: 0.3, comm: 0, slip: 0.05, swap: true }, S.cost || {});
  return S.cost;
}
function spreadAt(t) {
  const c = costCfg();
  return c.mode === "fixed" ? c.spread : SPR_H(new Date(t * 1e3).getUTCHours());
}
function swapNights(t0, t1) {
  let n = 0, b = Math.floor(t0 / 86400) * 86400 + 21 * 3600;
  if (b <= t0) b += 86400;
  for (; b <= t1; b += 86400) {
    const wd = new Date(b * 1e3).getUTCDay();
    if (wd === 0 || wd === 6) continue;
    n += wd === 3 ? 3 : 1;
  }
  return n;
}
function tradeCost(p, tc, lots) {
  const c = costCfg();
  if (!c.on) return { total: 0, spread: 0, slip: 0, comm: 0, swap: 0 };
  const sp = +(spreadAt(p.open) * OZ * lots).toFixed(2), sl = +(2 * c.slip * OZ * lots).toFixed(2), cm = +((c.comm || 0) * lots).toFixed(2), nights = c.swap ? swapNights(p.open, tc) : 0, sw = +(-SWAP[p.side] * nights * lots).toFixed(2);
  return { total: +(sp + sl + cm + sw).toFixed(2), spread: sp, slip: sl, comm: cm, swap: sw, nights };
}
function openCost(p) {
  const c = costCfg();
  if (!c.on) return 0;
  return (spreadAt(p.open) + 2 * c.slip) * OZ * p.lots + (c.comm || 0) * p.lots + (c.swap ? -SWAP[p.side] * swapNights(p.open, S.cur) * p.lots : 0);
}
function costUI() {
  const c = costCfg();
  $("cOn").checked = c.on;
  $("cMode").value = c.mode;
  $("cSpread").value = c.spread;
  $("cComm").value = c.comm;
  $("cSlip").value = c.slip;
  $("cSwap").checked = c.swap;
  $("cSpread").disabled = c.mode !== "fixed";
  const sp = spreadAt(S.cur || Date.now() / 1e3);
  $("cInfo").textContent = c.on ? "\u0627\u0644\u0633\u0628\u0631\u064A\u062F \u0627\u0644\u0622\u0646 \u2248 " + sp.toFixed(2) + "$ \xB7 \u0627\u0644\u062A\u0643\u0644\u0641\u0629/\u0644\u0648\u062A \u2248 " + ((sp + 2 * c.slip) * OZ + (+c.comm || 0)).toFixed(0) + "$ (+swap)" : "\u0627\u0644\u062A\u0643\u0627\u0644\u064A\u0641 \u0645\u062A\u0648\u0642\u0641\u0629";
}
["cOn", "cMode", "cSpread", "cComm", "cSlip", "cSwap"].forEach((id) => {
  $(id).onchange = () => {
    const c = costCfg();
    c.on = $("cOn").checked;
    c.mode = $("cMode").value;
    c.spread = +$("cSpread").value || 0;
    c.comm = +$("cComm").value || 0;
    c.slip = +$("cSlip").value || 0;
    c.swap = $("cSwap").checked;
    save();
    costUI();
    updPos();
  };
});
function trailUpd(M, i, p) {
  if (!p.trail || p.sl == null) return;
  const d = p.side === "buy" ? 1 : -1, dist = p.trail;
  const fav = d > 0 ? M.h[i] - p.entry : p.entry - M.l[i];
  p.best = Math.max(p.best || 0, fav);
  if (p.best < dist) return;
  const ns = +(d > 0 ? p.entry + p.best - dist : p.entry - p.best + dist).toFixed(2);
  if (d > 0 ? ns > p.sl : ns < p.sl) {
    p.sl = ns;
    syncBox(p);
  }
}
function syncBox(p) {
  (S.draw || []).forEach((d) => {
    if (d.type === "pos" && d.st === "live" && d.posId === p.id) d.sl = p.sl;
  });
  dirty++;
}
function moveBE(p) {
  if (p.sl == null) return;
  const d = p.side === "buy" ? 1 : -1;
  if ((S.price - p.entry) * d <= 0) return alert("\u0627\u0644\u0633\u0639\u0631 \u0644\u0627\u0632\u0645 \u064A\u0643\u0648\u0646 \u0628\u0631\u0628\u062D \u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0648\u0642\u0641 \u0644\u0644\u062F\u062E\u0648\u0644");
  snap && snap();
  p.be = true;
  p.sl = +p.entry.toFixed(2);
  syncBox(p);
  save();
  updLines();
  updPos();
  status("\u{1F512} \u0627\u0644\u0648\u0642\u0641 \u0639\u0644\u0649 \u0627\u0644\u062F\u062E\u0648\u0644 (BE)");
}
function halfClose(p) {
  closePos(S.price, "\u062C\u0632\u0626\u064A 50%", null, p, 0.5);
}
function toggleTrail(p) {
  if (p.sl == null) return;
  p.trail = p.trail ? 0 : +Math.abs(p.entry - (p.sl0 != null ? p.sl0 : p.sl)).toFixed(2);
  save();
  updPos();
  status(p.trail ? "\u21E2 \u0648\u0642\u0641 \u0645\u062A\u062D\u0631\u0643 \u0628\u0639\u062F +1R (\u0645\u0633\u0627\u0641\u0629 " + p.trail + "$)" : "\u0648\u0642\u0641 \u0645\u062A\u062D\u0631\u0643 \u0645\u062A\u0648\u0642\u0641");
}
function mgmtBind() {
  const f = (c, fn) => document.querySelectorAll(c).forEach((b) => b.onclick = () => {
    const p = S.ps.find((x) => String(x.id) === b.dataset.id);
    if (p) fn(p);
  });
  f(".pbe", moveBE);
  f(".phalf", halfClose);
  f(".ptrail", toggleTrail);
}
function tradeR(t) {
  if (t.R != null) return t.R;
  const r = (t.bal0 || S.startBal) * (S.riskPct || 1) / 100;
  return r ? +(t.pnl / r).toFixed(2) : 0;
}
function edgeCalc(j) {
  const R = j.map(tradeR), n = R.length;
  if (!n) return { n: 0 };
  const W = R.filter((x) => x > 0), L = R.filter((x) => x <= 0), E = R.reduce((a, b) => a + b, 0) / n;
  const sd = n > 1 ? Math.sqrt(R.reduce((a, b) => a + (b - E) * (b - E), 0) / (n - 1)) : 0;
  let eq = 0, pk = 0, dd = 0, ls = 0, cur = 0;
  R.forEach((r) => {
    eq += r;
    pk = Math.max(pk, eq);
    dd = Math.max(dd, pk - eq);
    cur = r <= 0 ? cur + 1 : 0;
    ls = Math.max(ls, cur);
  });
  const Rg = j.map((t) => t.Rg != null ? t.Rg : tradeR(t)), Eg = Rg.reduce((a, b) => a + b, 0) / n, ci = n > 1 ? 1.96 * sd / Math.sqrt(n) : null;
  return {
    n,
    winRate: +(100 * W.length / n).toFixed(1),
    avgWin: W.length ? +(W.reduce((a, b) => a + b, 0) / W.length).toFixed(2) : null,
    avgLoss: L.length ? +(-L.reduce((a, b) => a + b, 0) / L.length).toFixed(2) : null,
    expectancy: +E.toFixed(3),
    expectancyGross: +Eg.toFixed(3),
    sd: +sd.toFixed(2),
    ci95: ci != null ? [+(E - ci).toFixed(2), +(E + ci).toFixed(2)] : null,
    maxDD_R: +dd.toFixed(2),
    longestLosingStreak: ls,
    totalCosts: +j.reduce((a, t) => a + (t.cost || 0), 0).toFixed(2),
    estimatedR: j.filter((t) => t.R == null || t.Rest).length,
    tradesNeeded: E > 0 && sd > 0 ? Math.ceil(Math.pow(1.96 * sd / E, 2)) : null,
    noEdge: n >= 50 && E <= 0
  };
}
function edgeStats(j) {
  const e = edgeCalc(j), el = $("edge");
  if (!el) return;
  if (!e.n) {
    el.innerHTML = '<div class="small">\u0644\u0627 \u062A\u0648\u062C\u062F \u0635\u0641\u0642\u0627\u062A \u0628\u0639\u062F.</div>';
    return;
  }
  const m30 = Math.min(100, 100 * e.n / 30), m100 = Math.min(100, 100 * e.n / 100), need = e.tradesNeeded, f = (x) => x == null ? "\u2014" : x;
  el.innerHTML = '<div class="egrid"><div><small>Expectancy (\u0635\u0627\u0641\u064A)</small><b class="' + (e.expectancy > 0 ? "w" : "l") + '">' + (e.expectancy > 0 ? "+" : "") + e.expectancy.toFixed(2) + "R</b></div><div><small>\u0642\u0628\u0644 \u0627\u0644\u062A\u0643\u0627\u0644\u064A\u0641</small><b>" + (e.expectancyGross > 0 ? "+" : "") + e.expectancyGross.toFixed(2) + "R</b></div><div><small>\u0646\u0633\u0628\u0629 \u0627\u0644\u0631\u0628\u062D</small><b>" + e.winRate + "%</b></div><div><small>\u0645\u062A\u0648\u0633\u0637 \u0631\u0628\u062D / \u062E\u0633\u0627\u0631\u0629</small><b>" + f(e.avgWin) + " / " + f(e.avgLoss) + "R</b></div><div><small>\u0623\u0642\u0635\u0649 \u062A\u0631\u0627\u062C\u0639</small><b>" + e.maxDD_R + "R</b></div><div><small>\u0623\u0637\u0648\u0644 \u0633\u0644\u0633\u0644\u0629 \u062E\u0633\u0627\u0631\u0629</small><b>" + e.longestLosingStreak + "</b></div><div><small>\u0641\u062A\u0631\u0629 \u062B\u0642\u0629 95%</small><b>" + (e.ci95 ? e.ci95[0] + " \u2026 " + e.ci95[1] + "R" : "\u2014") + "</b></div><div><small>\u0627\u0644\u062A\u0643\u0627\u0644\u064A\u0641 \u0627\u0644\u0643\u0644\u064A\u0629</small><b>" + e.totalCosts + '$</b></div></div><div class="meter"><div class="small">\u062D\u062C\u0645 \u0627\u0644\u0639\u064A\u0651\u0646\u0629: <b>' + e.n + "</b> \u0635\u0641\u0642\u0629" + (need ? " \xB7 \u0644\u0627\u0632\u0645\u0643 \u062A\u0642\u0631\u064A\u0628\u0627\u064B <b>" + need + "</b> \u0635\u0641\u0642\u0629 \u0644\u062A\u062D\u0643\u0645 \u0639\u0644\u0649 \u0645\u064A\u0632\u062A\u0643 (95%)" : "") + '</div><div class="mbar"><i style="width:' + m100 + '%"></i><span style="left:30%"></span></div><div class="small mlab"><span>0</span><span>30</span><span>100</span></div></div>' + (e.n < 30 ? '<div class="warn">\u26A0 \u0639\u064A\u0651\u0646\u0629 \u0635\u063A\u064A\u0631\u0629 \u062C\u062F\u0627\u064B (\u0623\u0642\u0644 \u0645\u0646 30): \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0641\u064A\u0647\u0627 \u062D\u0638 \u0643\u062A\u064A\u0631\u060C \u0645\u0627 \u0641\u064A \u062D\u0643\u0645 \u0628\u0639\u062F.</div>' : e.n < 100 ? '<div class="warn soft">\u26A0 \u0623\u0642\u0644 \u0645\u0646 100 \u0635\u0641\u0642\u0629: \u062D\u0643\u0645 \u0623\u0648\u0644\u064A \u0628\u0633.</div>' : "") + (e.noEdge ? '<div class="info">\u2139\uFE0F \u0642\u0627\u0639\u062F\u0629 \xAB\u0645\u0627 \u0641\u064A \u0645\u064A\u0632\u0629\xBB: \u0628\u0639\u062F ' + e.n + " \u0635\u0641\u0642\u0629 \u0627\u0644\u0640expectancy \u0627\u0644\u0635\u0627\u0641\u064A \u2264 0. \u0627\u0644\u0623\u0641\u0636\u0644 \u062A\u0631\u062C\u0639 \u062E\u0637\u0648\u0629 (replay/demo)\u060C \u062A\u0639\u062F\u0651\u0644 \u0634\u064A \u0648\u0627\u062D\u062F \u0628\u0633\u060C \u0648\u062A\u0642\u064A\u0633 \u0645\u0646 \u062C\u062F\u064A\u062F. (\u0645\u0639\u0644\u0648\u0645\u0629\u060C \u0645\u0634 \u0642\u0641\u0644)</div>" : "") + (e.estimatedR ? '<div class="small">* ' + e.estimatedR + " \u0635\u0641\u0642\u0629 \u0628\u062F\u0648\u0646 \u0648\u0642\u0641: \u0627\u0644\u0640R \u0645\u062D\u0633\u0648\u0628 \u0645\u0646 \u0646\u0633\u0628\u0629 \u0627\u0644\u0645\u062E\u0627\u0637\u0631\u0629 " + (S.riskPct || 1) + "%.</div>" : "");
}
function rng32(a) {
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function ruinSim(wr, rr, risk, n, paths, seed) {
  const r = rng32(seed || 7), P = [], mdd = [], stk = [];
  let ruin = 0, dd10 = 0, s6 = 0;
  for (let k = 0; k < paths; k++) {
    let eq = 1, pk = 1, dd = 0, cur = 0, st = 0;
    const keep = k < 40 ? [1] : null;
    for (let i = 0; i < n; i++) {
      const w = r() < wr / 100;
      eq *= w ? 1 + rr * risk / 100 : 1 - risk / 100;
      pk = Math.max(pk, eq);
      dd = Math.max(dd, 1 - eq / pk);
      cur = w ? 0 : cur + 1;
      st = Math.max(st, cur);
      if (keep) keep.push(eq);
    }
    if (keep) P.push(keep);
    mdd.push(dd * 100);
    stk.push(st);
    if (dd >= 0.5) ruin++;
    if (dd >= 0.1) dd10++;
    if (st >= 6) s6++;
  }
  const med = (a) => {
    const b = a.slice().sort((x, y) => x - y);
    return b[Math.floor(b.length / 2)];
  };
  return { paths: P, p_dd10: +(100 * dd10 / paths).toFixed(1), p_ruin: +(100 * ruin / paths).toFixed(1), median_mdd: +med(mdd).toFixed(1), median_streak: med(stk), p_streak6: +(100 * s6 / paths).toFixed(1), expectancy: +(wr / 100 * rr - (1 - wr / 100)).toFixed(2) };
}
function openModal(html, cls) {
  const m = $("modal");
  m.className = cls || "";
  m.innerHTML = '<div class="mbox">' + html + "</div>";
  m.classList.remove("hidden");
  m.onclick = (e) => {
    if (e.target === m) closeModal();
  };
  const x = m.querySelector(".mx");
  if (x) x.onclick = closeModal;
  return m;
}
function closeModal() {
  const m = $("modal");
  m.classList.add("hidden");
  m.innerHTML = "";
}
function openRuin(def) {
  def = Object.assign({ wr: 45, rr: 1.5, risk: 1, n: 100 }, def || {});
  const inp = (id, l, v, mn, mx, st) => '<label class="rs"><span>' + l + '</span><input type="range" id="' + id + 'R" min="' + mn + '" max="' + mx + '" step="' + st + '" value="' + v + '"><input type="number" id="' + id + '" min="' + mn + '" max="' + mx + '" step="' + st + '" value="' + v + '"></label>';
  openModal('<div class="mh"><b>\u{1F3B2} \u0645\u062D\u0627\u0643\u064A \u0627\u0644\u0633\u0644\u0627\u0633\u0644 \u0648\u0627\u0644\u0625\u0641\u0644\u0627\u0633 (Monte Carlo)</b><button class="mx">\u2715</button></div>' + inp("rsW", "\u0646\u0633\u0628\u0629 \u0627\u0644\u0631\u0628\u062D %", def.wr, 20, 80, 1) + inp("rsRR", "R:R", def.rr, 0.5, 4, 0.1) + inp("rsK", "\u0645\u062E\u0627\u0637\u0631\u0629 % \u0628\u0627\u0644\u0635\u0641\u0642\u0629", def.risk, 0.25, 10, 0.25) + inp("rsN", "\u0639\u062F\u062F \u0627\u0644\u0635\u0641\u0642\u0627\u062A", def.n, 20, 500, 10) + '<canvas id="rsC"></canvas><div id="rsOut" class="egrid"></div><div class="small">2000 \u0645\u0633\u0627\u0631 \u0628\u062A\u0631\u062A\u064A\u0628 \u0639\u0634\u0648\u0627\u0626\u064A \u0644\u0646\u0641\u0633 \u0627\u0644\u0625\u062D\u0635\u0627\u0621\u0627\u062A. \u0627\u0644\u062E\u0637\u0648\u0637 = 40 \u0645\u0633\u0627\u0631\u061B \u0627\u0644\u0623\u062D\u0645\u0631 = \u062D\u062F \u221210%.</div>', "ruin");
  const ids = ["rsW", "rsRR", "rsK", "rsN"];
  ids.forEach((id) => {
    $(id + "R").oninput = () => {
      $(id).value = $(id + "R").value;
      run();
    };
    $(id).oninput = () => {
      $(id + "R").value = $(id).value;
      run();
    };
  });
  function run() {
    const s = ruinSim(+$("rsW").value, +$("rsRR").value, +$("rsK").value, Math.round(+$("rsN").value), 2e3, 7);
    window.__ruin = s;
    const c = $("rsC"), dp = devicePixelRatio || 1, W = c.clientWidth || 300, H = 200;
    c.width = W * dp;
    c.height = H * dp;
    const g = c.getContext("2d");
    g.scale(dp, dp);
    g.fillStyle = "#0b0b10";
    g.fillRect(0, 0, W, H);
    let mn = 1, mx = 1;
    s.paths.forEach((p) => p.forEach((v) => {
      mn = Math.min(mn, v);
      mx = Math.max(mx, v);
    }));
    mn = Math.min(mn, 0.88);
    const y = (v) => H - 8 - (v - mn) / (mx - mn || 1) * (H - 16), n = s.paths[0].length;
    g.strokeStyle = "#f2364580";
    g.setLineDash([4, 4]);
    g.beginPath();
    g.moveTo(0, y(0.9));
    g.lineTo(W, y(0.9));
    g.stroke();
    g.setLineDash([]);
    s.paths.forEach((p, k) => {
      g.strokeStyle = p[p.length - 1] >= 1 ? "rgba(154,252,65,.45)" : "rgba(242,54,69,.45)";
      g.lineWidth = 1;
      g.beginPath();
      p.forEach((v, i) => {
        const X2 = i * (W - 4) / (n - 1) + 2;
        i ? g.lineTo(X2, y(v)) : g.moveTo(X2, y(v));
      });
      g.stroke();
    });
    g.strokeStyle = "#888";
    g.beginPath();
    g.moveTo(0, y(1));
    g.lineTo(W, y(1));
    g.stroke();
    $("rsOut").innerHTML = '<div><small>Expectancy</small><b class="' + (s.expectancy > 0 ? "w" : "l") + '">' + s.expectancy + "R</b></div><div><small>\u0627\u062D\u062A\u0645\u0627\u0644 \u062A\u0631\u0627\u062C\u0639 \u226510%</small><b>" + s.p_dd10 + "%</b></div><div><small>\u0627\u062D\u062A\u0645\u0627\u0644 \u062E\u0633\u0627\u0631\u0629 \u0646\u0635 \u0627\u0644\u062D\u0633\u0627\u0628</small><b>" + s.p_ruin + "%</b></div><div><small>\u0623\u0642\u0635\u0649 \u062A\u0631\u0627\u062C\u0639 (\u0648\u0633\u064A\u0637)</small><b>" + s.median_mdd + "%</b></div><div><small>\u0623\u0637\u0648\u0644 \u0633\u0644\u0633\u0644\u0629 \u062E\u0633\u0627\u0631\u0629 (\u0648\u0633\u064A\u0637)</small><b>" + s.median_streak + "</b></div><div><small>\u0627\u062D\u062A\u0645\u0627\u0644 6 \u062E\u0633\u0627\u0631\u0627\u062A \u0648\u0631\u0627 \u0628\u0639\u0636</small><b>" + s.p_streak6 + "%</b></div>";
  }
  requestAnimationFrame(run);
}
function atrNowTf() {
  if (!B || B.n < 15) return null;
  let s = 0;
  for (let i = B.n - 14; i < B.n; i++) {
    const pc = B.C[i - 1];
    s += Math.max(B.H[i] - B.L[i], Math.abs(B.H[i] - pc), Math.abs(B.L[i] - pc));
  }
  return +(s / 14).toFixed(2);
}
function plans() {
  return LS("gr_plans") || [];
}
function openTemplate(kind, onSave) {
  var _a;
  kind = kind || "plan";
  const sel2 = (id, o) => '<select id="' + id + '">' + o.map((x) => '<option value="' + x[0] + '">' + x[1] + "</option>").join("") + "</select>";
  const P = "<label>\u0627\u062A\u062C\u0627\u0647 D1 " + sel2("tpBias", [["up", "\u0635\u0627\u0639\u062F"], ["down", "\u0647\u0627\u0628\u0637"], ["range", "\u0639\u0631\u0636\u064A"]]) + '</label><label>\u0645\u0633\u062A\u0648\u064A\u0627\u062A H4 <input id="tpLv" placeholder="\u0645\u062B\u0644\u0627\u064B 2350 / 2372"></label><label>\u0627\u0644\u0640Regime ' + sel2("tpReg", [["trend", "\u062A\u0631\u0646\u062F"], ["range", "\u0631\u064A\u0646\u062C"]]) + sel2("tpVol", [["normal", "\u062A\u0642\u0644\u0628 \u0637\u0628\u064A\u0639\u064A"], ["high", "\u062A\u0642\u0644\u0628 \u0639\u0627\u0644\u064A"], ["low", "\u062A\u0642\u0644\u0628 \u0648\u0627\u0637\u064A"]]) + "</label><label>\u0623\u062E\u0628\u0627\u0631 \u0627\u0644\u064A\u0648\u0645 " + sel2("tpNews", [["ok", "\u064A\u0648\u0645 \u0639\u0627\u062F\u064A"], ["danger", "\u064A\u0648\u0645 \u062E\u0628\u0631 \u2190 \u0645\u0627 \u0641\u064A \u062A\u062F\u0627\u0648\u0644"]]) + "</label><label>ATR (" + S.tf + ') <input id="tpAtr" value="' + ((_a = atrNowTf()) != null ? _a : "") + '"></label><label>\u0625\u0630\u0627\u2026 \u0628\u0639\u0645\u0644\u2026 <input id="tpIf" placeholder="\u0625\u0630\u0627 \u0627\u0644\u0633\u0639\u0631 \u0631\u062C\u0639 \u0644\u0640\u2026 \u0648\u0639\u0645\u0644\u2026 \u0628\u062F\u062E\u0644\u2026 \u0627\u0644\u0648\u0642\u0641\u2026"></label>';
  const Rv = "<label>\u0627\u0644\u062A\u0632\u0645\u062A \u0628\u0627\u0644\u0642\u0648\u0627\u0639\u062F\u061F " + sel2("tpOk", [["yes", "\u0646\u0639\u0645"], ["partly", "\u062C\u0632\u0626\u064A\u0627\u064B"], ["no", "\u0644\u0627"]]) + "</label><label>\u0646\u0648\u0639 \u0627\u0644\u063A\u0644\u0637\u0629 " + sel2("tpErr", [["none", "\u0645\u0627 \u0641\u064A"], ["rule", "\u0642\u0627\u0639\u062F\u0629"], ["exec", "\u062A\u0646\u0641\u064A\u0630"], ["analysis", "\u062A\u062D\u0644\u064A\u0644"]]) + '</label><label>\u062F\u0631\u0633 \u0648\u0627\u062D\u062F <input id="tpLes" placeholder="\u0634\u0648 \u0631\u062D \u062A\u0639\u0645\u0644 \u063A\u064A\u0631 \u0627\u0644\u0645\u0631\u0629 \u0627\u0644\u062C\u0627\u064A\u0629\u061F"></label>';
  const last = plans().slice(-4).reverse().map((p) => '<div class="tpl-item"><b>' + (p.type === "plan" ? "\u{1F4DD}" : "\u{1F50D}") + " " + p.replay + "</b> " + (p.type === "plan" ? p.bias + " \xB7 " + p.regime + " \xB7 " + (p.ifthen || "") : p.ok + " \xB7 " + p.err + " \xB7 " + (p.lesson || "")) + "</div>").join("");
  openModal('<div class="mh"><b>\u{1F4DD} \u062E\u0637\u0629 / \u0645\u0631\u0627\u062C\u0639\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)</b><button class="mx">\u2715</button></div><div class="seg tps"><button data-k="plan" class="' + (kind === "plan" ? "on" : "") + '">\u0642\u0628\u0644 \u0627\u0644\u062C\u0644\u0633\u0629</button><button data-k="review" class="' + (kind === "review" ? "on" : "") + '">\u0628\u0639\u062F \u0627\u0644\u062C\u0644\u0633\u0629</button></div><div class="tpf">' + (kind === "plan" ? P : Rv) + '</div><button id="tpSave" class="cs-go">\u{1F4BE} \u062D\u0641\u0638</button><div class="small">' + (last ? "\u0622\u062E\u0631 \u0627\u0644\u0625\u062F\u062E\u0627\u0644\u0627\u062A:" : "") + "</div>" + last, "tpl");
  document.querySelectorAll(".tps button").forEach((b) => b.onclick = () => openTemplate(b.dataset.k, onSave));
  $("tpSave").onclick = () => {
    const v = (id) => ($(id) || {}).value || "";
    const rec = kind === "plan" ? { type: "plan", bias: v("tpBias"), levels: v("tpLv"), regime: v("tpReg") + "/" + v("tpVol"), news: v("tpNews"), atr: v("tpAtr"), ifthen: v("tpIf") } : { type: "review", ok: v("tpOk"), err: v("tpErr"), lesson: v("tpLes") };
    rec.replay = ds(S.cur);
    rec.at = (/* @__PURE__ */ new Date()).toISOString();
    rec.tf = S.tf;
    if (window.__course) rec.course = true;
    const a = plans();
    a.push(rec);
    localStorage.setItem("gr_plans", JSON.stringify(a.slice(-200)));
    closeModal();
    status("\u2714 \u0627\u0646\u062D\u0641\u0638");
    if (onSave) onSave(rec);
  };
}
$("bRuin").onclick = () => openRuin();
$("bPlan").onclick = () => openTemplate("plan");
{
  const base = coachData;
  coachData = function() {
    const o = base();
    const j = journal();
    o.edgeStats = edgeCalc(j);
    o.costs = costCfg();
    o.sessionTemplates = plans();
    o.course = (() => {
      const c = LS("gr_course");
      return c ? { xp: c.xp, streak: c.streak, done: Object.keys(c.done || {}).length, boss: c.boss, series: c.series || null } : null;
    })();
    o.management = j.filter((t) => t.be || t.trail || t.partial).length;
    return o;
  };
}
let CRS = null, CP = null, CMAIN = null, CITEM = null, CSTATE = null;
const L_ = () => window.I18N && I18N.de() ? "de" : "ar";
const TX = (o) => o == null ? "" : typeof o === "string" ? o : o[L_()] || o.ar || "";
function cpLoad() {
  CP = LS("gr_course") || { done: {}, xp: 0, streak: { day: "", n: 0 }, cur: null, boss: {} };
  CP.done = CP.done || {};
  CP.boss = CP.boss || {};
}
function cpSave() {
  localStorage.setItem("gr_course", JSON.stringify(CP));
}
const berlinDay = () => {
  const p = {};
  fmt.formatToParts(/* @__PURE__ */ new Date()).forEach((x) => p[x.type] = x.value);
  return p.year + "-" + p.month + "-" + p.day;
};
function bumpStreak() {
  const d = berlinDay();
  if (CP.streak.day === d) return;
  const y = new Date(Date.parse(d + "T12:00:00Z") - 864e5).toISOString().slice(0, 10);
  CP.streak.n = CP.streak.day === y ? CP.streak.n + 1 : 1;
  CP.streak.day = d;
  CP.xp += Math.min(50, 5 * CP.streak.n);
}
function modItems(m) {
  return m.path;
}
function modPassed(m) {
  const b = CP.boss[m.id];
  return !!(b && b.passed);
}
function modUnlocked(m) {
  const r = m.unlock && m.unlock.requires;
  if (!r) return true;
  if (CP.boss[m.id] || m.path.concat(m.boss.items).some((e) => CP.done[e.id])) return true;
  const pm = CRS.modules.find((x) => x.id === r);
  return pm ? modPassed(pm) : true;
}
function pathDone(m) {
  return m.path.every((e) => CP.done[e.id]);
}
const cardMap = {};
async function courseLoad() {
  if (CRS) return;
  CRS = await (await fetch("data/course.json")).json();
  CRS.modules.forEach((m) => m.path.concat(m.boss.items).forEach((e) => {
    const c = e.reveal && e.reveal.concept_card;
    if (c && c.title) cardMap[c.lesson] = c;
    (e.reveal && e.reveal.extra_cards || []).forEach((x) => {
      if (x.title) cardMap[x.lesson] = cardMap[x.lesson] || x;
    });
  }));
}
async function courseOpen() {
  stopPlay();
  if (Q) {
    Q = null;
    quizUI();
  }
  if (!window.__course) {
    CMAIN = JSON.stringify(S);
    window.__course = true;
    document.body.classList.add("course");
  }
  cpLoad();
  $("courseView").classList.remove("hidden");
  $("cSheet").classList.add("hidden");
  $("courseView").innerHTML = '<div class="cv-load">\u2026</div>';
  await courseLoad();
  courseMap();
}
async function courseExit() {
  stopPlay();
  window.__course = false;
  window.__courseStep = false;
  document.body.classList.remove("course", "course-step");
  $("courseView").classList.add("hidden");
  $("cSheet").classList.add("hidden");
  if (CMAIN) {
    const o = JSON.parse(CMAIN);
    Object.keys(S).forEach((k) => delete S[k]);
    Object.assign(S, o);
    CMAIN = null;
  }
  sel = -1;
  pend = null;
  mode = "none";
  setMode("none");
  select(-1);
  $("tf").value = S.tf;
  tfBtns();
  applyScale();
  macdUI();
  emaUI();
  mPrev = null;
  emaPrev = null;
  await render();
  renderJournal();
  updPos();
  updLines();
  dirty++;
  ts.scrollToRealTime();
}
function courseMap(openMod) {
  const lv = CRS.gamification.graduation.levels;
  const passed = CRS.modules.filter(modPassed).length;
  const curLevel = CRS.modules.reduce((a, m) => modPassed(m) ? m.level : a, 0);
  let h = '<div class="cv-top"><button id="cvBack" class="cv-x">\u2715</button><div class="cv-title">\u{1F393} ' + TX(CRS.title) + '</div><div class="cv-stats"><span title="XP">\u26A1 ' + CP.xp + '</span><span title="streak">\u{1F525} ' + CP.streak.n + "</span><span>\u{1F3C5} " + (curLevel ? TX(lv[curLevel]) : "\u2014") + "</span></div></div>";
  if (CP.cur) {
    h += '<button id="cvCont" class="cv-cont">\u25B6 \u0645\u062A\u0627\u0628\u0639\u0629 \u0645\u0646 \u062D\u064A\u062B \u062A\u0648\u0642\u0641\u062A</button>';
  }
  h += '<div class="cv-path">';
  CRS.modules.forEach((m, mi) => {
    const un = modUnlocked(m), dn = m.path.filter((e) => CP.done[e.id]).length, stars = m.path.reduce((a, e) => a + ((CP.done[e.id] || {}).stars || 0), 0), bp = modPassed(m);
    h += '<div class="cv-mod ' + (un ? "" : "locked ") + (bp ? "passed " : "") + '" data-m="' + mi + '"><div class="cv-mh"><span class="cv-num">' + (un ? bp ? "\u2713" : m.order : "\u{1F512}") + '</span><div><div class="cv-lv">' + TX(m.level_name) + " \xB7 " + (L_() === "de" ? "Modul " : "\u0648\u062D\u062F\u0629 ") + m.order + "</div><b>" + TX(m.title) + '</b><div class="cv-prog"><i style="width:' + (m.path.length ? 100 * dn / m.path.length : bp ? 100 : 0) + '%"></i></div><small>' + dn + "/" + m.path.length + " \xB7 \u2B50 " + stars + "/" + m.path.length * 3 + "</small></div></div>";
    if (openMod === mi && un) {
      h += '<div class="cv-nodes">' + m.path.map((e, i) => {
        const d = CP.done[e.id];
        const avail = i === 0 || CP.done[m.path[i - 1].id] || d;
        return '<button class="cv-node ' + (d ? "done" : "") + (avail ? "" : " lock") + (e.kind === "guided" ? " guided" : "") + '" style="margin-inline-start:' + (30 + 40 * Math.sin(i * 1.1)) + 'px" data-i="' + i + '" ' + (avail ? "" : "disabled") + "><span>" + (d ? "\u2605".repeat(d.stars) + "\u2606".repeat(3 - d.stars) : e.kind === "guided" ? "\u{1F4A1}" : "\u{1F3AF}") + "</span><small>" + (i + 1) + "</small></button>";
      }).join("") + '<button class="cv-node boss' + (pathDone(m) ? "" : " lock") + (bp ? " done" : "") + '" data-b="1" ' + (pathDone(m) ? "" : "disabled") + "><span>\u{1F451}</span><small>" + TX(m.boss.title) + '</small></button><button class="cv-learn" data-l="' + mi + '">\u{1F4D6} \u0627\u0644\u062F\u0631\u0648\u0633</button></div>';
    }
    h += "</div>";
  });
  h += "</div>";
  $("courseView").innerHTML = h;
  $("courseView").scrollTop = 0;
  $("cvBack").onclick = courseExit;
  if ($("cvCont")) $("cvCont").onclick = () => {
    const c = CP.cur, m = CRS.modules[c.m];
    if (c.boss) bossStart(c.m, c.i);
    else itemStart(c.m, c.i);
  };
  document.querySelectorAll(".cv-mod").forEach((d) => d.querySelector(".cv-mh").onclick = () => {
    const mi = +d.dataset.m;
    if (!modUnlocked(CRS.modules[mi])) return;
    courseMap(openMod === mi ? null : mi);
    const el = document.querySelector('.cv-mod[data-m="' + mi + '"]');
    if (el) el.scrollIntoView({ block: "start" });
  });
  document.querySelectorAll(".cv-node[data-i]").forEach((b) => b.onclick = () => itemStart(openMod, +b.dataset.i));
  document.querySelectorAll(".cv-node[data-b]").forEach((b) => b.onclick = () => bossStart(openMod, 0));
  document.querySelectorAll(".cv-learn").forEach((b) => b.onclick = () => learnMore(+b.dataset.l));
}
function learnMore(mi) {
  const m = CRS.modules[mi];
  let h = '<div class="cv-top"><button id="cvBk" class="cv-x">\u2190</button><div class="cv-title">\u{1F4D6} ' + TX(m.title) + '</div></div><div class="cv-lessons">';
  (m.lessons_reference || []).forEach((l) => {
    h += '<div class="cv-card"><h4>' + TX(l.title) + "</h4>" + (l.objectives ? "<ul>" + (l.objectives[L_()] || []).map((x) => "<li>" + x + "</li>").join("") + "</ul>" : "") + "<p>" + TX(l.text) + "</p>" + (l.key_points ? "<b>\u2714</b><ul>" + (l.key_points[L_()] || []).map((x) => "<li>" + x + "</li>").join("") + "</ul>" : "") + (l.common_mistakes ? "<b>\u26A0</b><ul>" + (l.common_mistakes[L_()] || []).map((x) => "<li>" + x + "</li>").join("") + "</ul>" : "") + "</div>";
  });
  $("courseView").innerHTML = h + "</div>";
  $("cvBk").onclick = () => courseMap(mi);
}
async function showItemChart(e) {
  S.draw = [];
  S.ps = [];
  S.tf = e.tf;
  $("tf").value = e.tf;
  tfBtns();
  sel = -1;
  pend = null;
  const c = await lastM1Before(e.start_ts + TFS[e.tf]);
  S.cur = c == null ? e.start_ts : c;
  mPrev = null;
  emaPrev = null;
  await render();
  ts.scrollToRealTime();
  dirty++;
}
async function itemStart(mi, i, boss) {
  const m = CRS.modules[mi], e = boss ? m.boss.items[i] : m.path[i];
  CITEM = { e, mi, i, boss: !!boss, tries: (CP.done[e.id] || {}).tries || 0 };
  CP.cur = { m: mi, i, boss: !!boss };
  cpSave();
  $("courseView").classList.add("hidden");
  if (e.task === "trade_series") return seriesStart();
  if (e.nochart) {
    window.__courseStep = false;
    document.body.classList.remove("course-step");
    sheetTask();
    return;
  }
  window.__courseStep = e.task === "identify_candle";
  document.body.classList.toggle("course-step", window.__courseStep);
  await showItemChart(e);
  sheetTask();
}
function bossStart(mi, i) {
  CSTATE = { mi, scores: [], t0: Date.now() };
  itemStart(mi, i, true);
}
function lastDraw(type) {
  for (let i = S.draw.length - 1; i >= 0; i--) if (S.draw[i].type === type) return S.draw[i];
  return null;
}
let bossTimer = null;
function sheetTask() {
  const e = CITEM.e, sh = $("cSheet");
  sh.classList.remove("hidden");
  sh.classList.toggle("cs-full", !!e.nochart);
  clearInterval(bossTimer);
  CITEM.skip = false;
  let h = '<div class="cs-head"><button id="csMap" class="cv-x">\u2715</button><span class="cs-kind">' + (CITEM.boss ? "\u{1F451} " + TX(CRS.modules[CITEM.mi].boss.title) + " " + (CITEM.i + 1) + "/" + CRS.modules[CITEM.mi].boss.items.length : (e.kind === "guided" ? "\u{1F4A1}" : "\u{1F3AF}") + " " + (CITEM.i + 1) + "/" + CRS.modules[CITEM.mi].path.length) + '</span><span class="cs-diff">' + e.tf + " \xB7 " + "\u{1F525}".repeat(e.difficulty) + '</span><span id="csTimer"></span></div>';
  if (e.scenario) h += '<div class="cs-scn">\u{1F4C9} \u062E\u0633\u0627\u0631\u0627\u062A \u0627\u0644\u064A\u0648\u0645: ' + e.scenario.losses_today + " \xB7 " + e.scenario.day_R + "R</div>";
  h += '<div class="cs-prompt">' + TX(e.prompt) + '</div><div class="cs-ans">';
  if (e.tool === "ruin") h += '<button class="cs-tool" id="csRuin">\u{1F3B2} \u0627\u0641\u062A\u062D \u0627\u0644\u0645\u062D\u0627\u0643\u064A</button>';
  if (e.tool === "manage") h += '<button class="cs-tool" id="csMan">\u{1F4CA} \u062C\u062F\u0648\u0644 \u0627\u0644\u0645\u0642\u0627\u0631\u0646\u0629</button>';
  if (e.task === "template") h += '<button class="cs-tool" id="csTpl">\u{1F4DD} \u0627\u0641\u062A\u062D \u0627\u0644\u0646\u0645\u0648\u0630\u062C</button><div class="small">\u0627\u062E\u062A\u064A\u0627\u0631\u064A: \u0628\u062A\u0642\u062F\u0631 \u062A\u062A\u062E\u0637\u0651\u0627\u0647.</div>';
  const t = e.task;
  if (t === "read_price" || t === "calc_number") h += '<input id="csNum" type="number" step="0.01" inputmode="decimal" placeholder="0.00">';
  if (t === "mark_level" || t === "mark_level_and_choose") h += '<button class="cs-tool" data-tool="hline">\u2014 \u0639\u0644\u0651\u0645 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0639\u0644\u0649 \u0627\u0644\u0634\u0627\u0631\u062A</button><div id="csRead" class="small"></div>';
  if (t === "mark_zone") h += '<button class="cs-tool" data-tool="hline">\u2014 \u0627\u0631\u0633\u0645 \u062E\u0637\u064A\u0646: \u0623\u0639\u0644\u0649 \u0648\u0623\u062F\u0646\u0649 \u0627\u0644\u0645\u0646\u0637\u0642\u0629</button><div id="csRead" class="small"></div>';
  if (t === "place_position" && false) h += '<div class="row"><button class="cs-tool" data-tool="long">\u{1F4C8} \u0634\u0631\u0627\u0621</button><button class="cs-tool" data-tool="short">\u{1F4C9} \u0628\u064A\u0639</button></div><div class="small">\u0627\u0633\u062D\u0628 \u0645\u0642\u0627\u0628\u0636 \u0627\u0644\u0645\u0631\u0628\u0639 \u0644\u0636\u0628\u0637 \u0627\u0644\u062F\u062E\u0648\u0644 \u0648\u0627\u0644\u0648\u0642\u0641 \u0648\u0627\u0644\u0647\u062F\u0641</div><div id="csRead" class="small"></div>';
  if (t === "identify_candle") h += '<div class="small">\u0627\u0633\u062A\u062E\u062F\u0645 \u25B6| \u0623\u0648 \u25B6\uFE0F \u0644\u0644\u062A\u0642\u062F\u0645 \u062B\u0645 \u0627\u0636\u063A\u0637 "\u0647\u0646\u0627"</div>';
  if (e.choices) h += '<div class="cs-choices">' + e.choices.map((c) => '<button class="cs-ch" data-k="' + c.key + '">' + TX(c) + "</button>").join("") + "</div>";
  if (t === "fill_sentence") h += '<div class="cs-fill"><select id="csB1"><option value="">___</option>' + e.blank1_options.map((o, i) => '<option value="' + i + '">' + TX(o) + "</option>").join("") + '</select><select id="csB2"><option value="">___</option>' + e.blank2_options.map((o, i) => '<option value="' + i + '">' + TX(o) + "</option>").join("") + "</select></div>";
  if (t === "place_position") h += '<div class="row"><button class="cs-tool" data-tool="long">\u{1F4C8} \u0634\u0631\u0627\u0621</button><button class="cs-tool" data-tool="short">\u{1F4C9} \u0628\u064A\u0639</button></div><div class="small">\u0627\u0633\u062D\u0628 \u0645\u0642\u0627\u0628\u0636 \u0627\u0644\u0645\u0631\u0628\u0639 \u0644\u0636\u0628\u0637 \u0627\u0644\u062F\u062E\u0648\u0644 \u0648\u0627\u0644\u0648\u0642\u0641 \u0648\u0627\u0644\u0647\u062F\u0641</div><div id="csRead" class="small"></div>';
  h += '</div><div class="cs-act">' + (e.kind === "guided" && CITEM.tries > 0 && e.hint && !CITEM.boss ? '<div class="cs-hint">\u{1F4A1} ' + TX(e.hint) + "</div>" : "") + (t === "template" ? '<button id="csSkip" class="cs-skip">\u23ED \u062A\u062E\u0637\u0651\u064A</button>' : '<button id="csGo" class="cs-go">' + (t === "identify_candle" ? "\u{1F4CD} \u0647\u0646\u0627" : "\u2714 \u062A\u062D\u0642\u0651\u0642") + "</button>") + (e.skip_allowed ? '<button id="csSkip" class="cs-skip">\u23ED \u0645\u0627 \u0641\u064A \u0635\u0641\u0642\u0629 (Skip)</button>' : "") + "</div>";
  sh.innerHTML = h;
  $("csMap").onclick = () => {
    clearInterval(bossTimer);
    $("cSheet").classList.add("hidden");
    setMode("none");
    courseMap(CITEM.mi);
    $("courseView").classList.remove("hidden");
  };
  document.querySelectorAll(".cs-tool").forEach((b) => b.onclick = () => {
    if (mode !== b.dataset.tool) setMode(b.dataset.tool);
    scrollTo(0, 0);
  });
  document.querySelectorAll(".cs-ch").forEach((b) => b.onclick = () => {
    document.querySelectorAll(".cs-ch").forEach((x) => x.classList.toggle("on", x === b));
    CITEM.key = b.dataset.k;
    gate();
  });
  ["csB1", "csB2", "csS1", "csS2", "csNum"].forEach((id) => {
    const el = $(id);
    if (el) el.oninput = el.onchange = gate;
  });
  if ($("csGo")) $("csGo").onclick = () => submitItem();
  gate();
  if ($("csSkip")) $("csSkip").onclick = () => {
    if (t === "template") {
      CP.cur = null;
      cpSave();
      return nextItem();
    }
    CITEM.skip = true;
    submitItem();
  };
  if ($("csRuin")) $("csRuin").onclick = () => openRuin(e.sim);
  if ($("csMan")) $("csMan").onclick = () => manageTable();
  if ($("csTpl")) $("csTpl").onclick = () => openTemplate(e.template, () => {
    CITEM.tplSaved = true;
    submitItem();
  });
  if (e.timer_s && !CITEM.boss) {
    const end = Date.now() + e.timer_s * 1e3;
    bossTimer = setInterval(() => {
      const r = Math.max(0, Math.round((end - Date.now()) / 1e3));
      const el = $("csTimer");
      if (el) el.textContent = "\u23F1 " + r + "s";
      if (r <= 0) {
        clearInterval(bossTimer);
        submitItem(true);
      }
    }, 250);
  }
  if (CITEM.boss) {
    const tl = CRS.modules[CITEM.mi].boss.timer_s_per_item || 90, end = Date.now() + tl * 1e3;
    bossTimer = setInterval(() => {
      const r = Math.max(0, Math.round((end - Date.now()) / 1e3));
      const el = $("csTimer");
      if (el) el.textContent = "\u23F1 " + r + "s";
      if (r <= 0) {
        clearInterval(bossTimer);
        submitItem(true);
      }
    }, 500);
  }
}
function gate() {
  const e = CITEM.e, go = $("csGo");
  if (!go) return;
  let ok = true;
  if (e.task === "fill_sentence") ok = $("csB1").value !== "" && $("csB2").value !== "";
  go.disabled = !ok;
}
setInterval(() => {
  if (!window.__course || !CITEM || !$("csRead")) return;
  const t = CITEM.e.task;
  let s = "";
  if (t === "mark_level" || t === "mark_level_and_choose") {
    const d = lastDraw("hline");
    s = d ? "= " + d.a.p.toFixed(2) : "";
  }
  if (t === "mark_zone") {
    const hs = S.draw.filter((d) => d.type === "hline").slice(-2);
    s = hs.length === 2 ? Math.min(hs[0].a.p, hs[1].a.p).toFixed(2) + " \u2013 " + Math.max(hs[0].a.p, hs[1].a.p).toFixed(2) : hs.length + "/2";
  }
  if (t === "place_position") {
    const d = lastDraw("pos");
    s = d ? (d.side === "buy" ? "\u25B2 " : "\u25BC ") + d.e.toFixed(2) + " | SL " + d.sl.toFixed(2) + " | TP " + d.tp.toFixed(2) : "";
  }
  const el = $("csRead");
  if (el && el.textContent !== s) el.textContent = s;
}, 400);
function numScore(x, ans, tol) {
  if (x == null || !isFinite(x)) return 0;
  const d = Math.abs(x - ans);
  return d <= tol ? 1 : d <= 2 * tol ? 0.5 : 0;
}
function scoreItem() {
  const e = CITEM.e, a = e.answer, t = e.task, tol = e.tolerance && e.tolerance.abs || 0;
  const ua = {};
  let sc = 0;
  if (t === "read_price" || t === "calc_number") {
    const v = num("csNum");
    ua.value = v;
    sc = numScore(v, a.price != null ? a.price : a.value, tol);
  } else if (t === "choose") {
    ua.key = CITEM.key;
    sc = CITEM.key === a.key ? 1 : 0;
  } else if (t === "mark_level") {
    const d = lastDraw("hline");
    ua.price = d && d.a.p;
    sc = numScore(ua.price, a.price, tol);
  } else if (t === "mark_level_and_choose") {
    const d = lastDraw("hline");
    ua.price = d && d.a.p;
    ua.key = CITEM.key;
    sc = 0.5 * numScore(ua.price, a.price, tol) + 0.5 * (CITEM.key === a.key ? 1 : 0);
  } else if (t === "mark_zone") {
    const hs = S.draw.filter((d) => d.type === "hline").slice(-2);
    if (hs.length === 2) {
      ua.low = Math.min(hs[0].a.p, hs[1].a.p);
      ua.high = Math.max(hs[0].a.p, hs[1].a.p);
      sc = 0.5 * numScore(ua.low, a.low, tol) + 0.5 * numScore(ua.high, a.high, tol);
    }
  } else if (t === "identify_candle") {
    const tb = B.U[B.n - 1];
    ua.ts = tb;
    const bars = Math.round(Math.abs(tb - a.ts) / TFS[e.tf]);
    sc = bars <= (e.tolerance && e.tolerance.bars || 0) ? 1 : bars <= 2 * (e.tolerance && e.tolerance.bars || 1) ? 0.5 : 0;
  } else if (t === "fill_sentence") {
    ua.b1 = +$("csB1").value;
    ua.b2 = +$("csB2").value;
    sc = 0.5 * (ua.b1 === a.blank1 ? 1 : 0) + 0.5 * (ua.b2 === a.blank2 ? 1 : 0);
  } else if (t === "template") {
    sc = CITEM.tplSaved ? 1 : 0;
  } else if (t === "place_position" && CITEM.skip) {
    ua.skip = true;
    sc = a.action === "skip" ? 1 : 0.3;
  } else if (t === "place_position" && a.action === "skip") {
    ua.order = true;
    sc = 0;
  } else if (t === "place_position") {
    const d = lastDraw("pos");
    if (d) {
      const side = d.side === "buy" ? "long" : "short";
      ua.side = side;
      ua.entry = d.e;
      ua.sl = d.sl;
      ua.tp = d.tp;
      if (side === a.side) {
        const z = e.tolerance && e.tolerance.entry_zone || a.zone, atr = e.tolerance && e.tolerance.atr || 0, lo = Math.min(z[0], z[1]), hi = Math.max(z[0], z[1]);
        const inZ = d.e >= lo - atr * 0.1 && d.e <= hi + atr * 0.1;
        const beyond = side === "long" ? d.sl < lo && d.sl >= lo - 1.5 * atr : d.sl > hi && d.sl <= hi + 1.5 * atr;
        const rr = Math.abs(d.tp - d.e) / (Math.abs(d.e - d.sl) || 1);
        sc = (inZ ? 0.4 : 0) + (beyond ? 0.3 : 0) + (rr >= 2 - 1e-9 && (side === "long" ? d.tp > d.e : d.tp < d.e) ? 0.3 : 0);
      }
    }
  }
  return { sc: Math.round(sc * 100) / 100, ua };
}
async function submitItem(timeout) {
  clearInterval(bossTimer);
  const e = CITEM.e;
  const { sc, ua } = scoreItem();
  setMode("none");
  const first = !CITEM.tries;
  let stars = sc >= 1 && first ? 3 : sc >= 0.5 && first || sc >= 1 ? 2 : 1;
  if (e.kind === "guided") stars = Math.min(stars, 2);
  const prev = CP.done[e.id] || {}, xp = Math.round(e.xp * stars / 3);
  if (!CITEM.boss) {
    CP.done[e.id] = { stars: Math.max(stars, prev.stars || 0), score: Math.max(sc, prev.score || 0), tries: (prev.tries || 0) + 1, last: (/* @__PURE__ */ new Date()).toISOString(), ans: ua };
    CP.xp += xp;
    bumpStreak();
  } else {
    if (!CSTATE || CSTATE.mi !== CITEM.mi) CSTATE = { mi: CITEM.mi, scores: [], t0: Date.now() };
    CSTATE.scores.push(sc);
    CP.xp += Math.round(e.xp * sc);
    bumpStreak();
  }
  cpSave();
  const a = e.answer, ac = "#9afc41";
  if (a.price != null && e.task !== "read_price") S.draw.push({ type: "hline", a: { t: S.cur, p: a.price }, color: ac, lw: 2, ls: 1 });
  if (a.low != null) {
    S.draw.push({ type: "hline", a: { t: S.cur, p: a.low }, color: ac, ls: 1 });
    S.draw.push({ type: "hline", a: { t: S.cur, p: a.high }, color: ac, ls: 1 });
  }
  if (e.task === "place_position") S.draw.push({ type: "pos", side: a.side === "long" ? "buy" : "sell", t: S.cur, t2: S.cur + TFS[e.tf] * 25, e: a.entry, sl: a.sl, tp: a.tp, st: "draft" });
  dirty++;
  if (e.nochart) {
    return sheetReveal(sc, stars, xp, timeout);
  }
  if (e.task !== "identify_candle") {
    busy = true;
    try {
      for (let k = 0; k < 20; k++) {
        const nt = await targetNext();
        if (nt == null) break;
        S.cur = nt;
        await render();
      }
    } finally {
      busy = false;
    }
  }
  if (e.task === "identify_candle") {
    const c = await lastM1Before(a.ts + TFS[e.tf]);
    if (c) S.draw.push({ type: "hline", a: { t: S.cur, p: B.C[B.n - 1] }, color: ac, ls: 1 });
  }
  dirty++;
  sheetReveal(sc, stars, xp, timeout);
}
function cardHtml(c) {
  if (!c) return "";
  if (c.ref && !c.title) c = cardMap[c.lesson] || c;
  if (!c.title) return "";
  return '<div class="cv-card concept"><h4>\u{1F9E0} ' + TX(c.title) + "</h4><ul>" + (c.lines && c.lines[L_()] || []).map((x) => "<li>" + x + "</li>").join("") + "</ul>" + (c.watch_out ? '<div class="cv-watch">\u26A0 ' + TX(c.watch_out) + "</div>" : "") + (c.more ? "<details><summary>\u0627\u0644\u0645\u0632\u064A\u062F</summary><p>" + TX(c.more) + "</p></details>" : "") + "</div>";
}
function sheetReveal(sc, stars, xp, timeout) {
  const e = CITEM.e, r = e.reveal || {}, pct = Math.round(sc * 100);
  let h = '<div class="cs-head"><button id="csMap" class="cv-x">\u2715</button><span class="cs-res ' + (sc >= 1 ? "ok" : sc > 0 ? "mid" : "bad") + '">' + (sc >= 1 ? "\u2705 \u0645\u0645\u062A\u0627\u0632" : sc > 0 ? "\u{1F7E1} \u062C\u0632\u0626\u064A\u0627\u064B" : "\u274C \u0644\u064A\u0633 \u0647\u0630\u0647 \u0627\u0644\u0645\u0631\u0629") + " \xB7 " + pct + "%</span>" + (CITEM.boss ? "" : '<span class="cs-stars">' + "\u2605".repeat(stars) + "\u2606".repeat(3 - stars) + '</span><span class="cs-xp">+' + xp + " XP</span>") + "</div>";
  if (timeout) h += '<div class="small">\u23F1 \u0627\u0646\u062A\u0647\u0649 \u0627\u0644\u0648\u0642\u062A</div>';
  h += '<div class="cs-expl">\u{1F4D8} ' + TX(r.explanation) + "</div>" + cardHtml(r.concept_card) + (r.extra_cards || []).map(cardHtml).join("");
  h += '<div class="cs-act"><button id="csNext" class="cs-go">\u0627\u0644\u062A\u0627\u0644\u064A \u2190</button></div>';
  $("cSheet").innerHTML = h;
  $("csMap").onclick = () => {
    $("cSheet").classList.add("hidden");
    courseMap(CITEM.mi);
    $("courseView").classList.remove("hidden");
  };
  $("csNext").onclick = nextItem;
}
function nextItem() {
  const m = CRS.modules[CITEM.mi];
  if (CITEM.boss) {
    if (CITEM.i + 1 < m.boss.items.length) return itemStart(CITEM.mi, CITEM.i + 1, true);
    const avg = Math.round(100 * CSTATE.scores.reduce((a, b2) => a + b2, 0) / CSTATE.scores.length), pass = avg >= (m.boss.pass_pct || 80);
    const b = CP.boss[m.id] || {};
    b.best = Math.max(b.best || 0, avg);
    b.passed = b.passed || pass;
    b.tries = (b.tries || 0) + 1;
    CP.boss[m.id] = b;
    if (pass) CP.xp += m.boss.on_pass && m.boss.on_pass.xp_bonus || 100;
    const nm = CRS.modules[CITEM.mi + 1];
    CP.cur = pass && nm ? { m: CITEM.mi + 1, i: 0, boss: !nm.path.length } : { m: CITEM.mi, i: 0, boss: true };
    cpSave();
    $("cSheet").innerHTML = '<div class="cs-boss ' + (pass ? "ok" : "bad") + '"><div class="cs-big">' + (pass ? "\u{1F3C6}" : "\u{1F4AA}") + "</div><b>" + (pass ? "\u0646\u062C\u062D\u062A \u0641\u064A \u062A\u062D\u062F\u0651\u064A \u0627\u0644\u0632\u0639\u064A\u0645!" : "\u0644\u0645 \u062A\u0646\u062C\u062D \u0628\u0639\u062F \u2014 \u0631\u0627\u062C\u0639 \u0648\u062D\u0627\u0648\u0644 \u0644\u0627\u062D\u0642\u0627\u064B") + "</b><div>" + avg + "% / " + (m.boss.pass_pct || 80) + "%</div>" + (pass && m.boss.on_pass && m.boss.on_pass.badge ? "<div>\u{1F3C5} " + TX(m.boss.on_pass.badge) + "</div>" : "") + '<button id="csDone" class="cs-go">\u0627\u0644\u062E\u0631\u064A\u0637\u0629</button></div>';
    $("csDone").onclick = () => {
      $("cSheet").classList.add("hidden");
      courseMap(pass && nm ? CITEM.mi + 1 : CITEM.mi);
      $("courseView").classList.remove("hidden");
    };
    return;
  }
  if (CITEM.i + 1 < m.path.length) return itemStart(CITEM.mi, CITEM.i + 1);
  CP.cur = { m: CITEM.mi, i: 0, boss: true };
  cpSave();
  $("cSheet").classList.add("hidden");
  courseMap(CITEM.mi);
  $("courseView").classList.remove("hidden");
}
$("bCourse").onclick = courseOpen;
window.GRC = { get CP() {
  return CP;
}, get item() {
  return CITEM;
}, open: courseOpen, exit: courseExit, itemStart, bossStart, map: courseMap, get crs() {
  return CRS;
} };
function manageTable() {
  const st = CRS.stats && CRS.stats.manage;
  if (!st) return;
  const N = { fixed: "\u062B\u0627\u0628\u062A 2R", be: "Breakeven \u0639\u0646\u062F +1R", partial: "\u0646\u0635 \u0639\u0646\u062F +1R", trail: "Trailing \u0628\u0639\u062F +1R" };
  openModal('<div class="mh"><b>\u{1F4CA} 50 \u0635\u0641\u0642\u0629 OB \u062D\u0642\u064A\u0642\u064A\u0629 (\u0635\u0627\u0641\u064A \u0628\u0639\u062F \u0627\u0644\u062A\u0643\u0627\u0644\u064A\u0641)</b><button class="mx">\u2715</button></div><table class="mtab"><tr><th></th><th>\u0645\u062A\u0648\u0633\u0637 R</th><th>\u0631\u0628\u062D %</th><th>\u0645\u062C\u0645\u0648\u0639 R</th><th>Max DD</th></tr>' + Object.keys(st).map((k) => "<tr><td>" + N[k] + '</td><td class="' + (st[k].avgR > 0 ? "w" : "l") + '">' + st[k].avgR + "</td><td>" + st[k].win_pct + "</td><td>" + st[k].total + "</td><td>" + st[k].maxDD + "</td></tr>").join("") + '</table><div class="small">\u0627\u0644\u0635\u0641\u0642\u0627\u062A \u0645\u0646\u062A\u0642\u0627\u0629 \u0628\u062F\u0648\u0646 \u0645\u0627 \u0646\u0634\u0648\u0641 \u0627\u0644\u0646\u062A\u064A\u062C\u0629. \u0639\u064A\u0651\u0646\u0629 50 = \u0645\u0624\u0634\u0631\u060C \u0645\u0634 \u0642\u0627\u0646\u0648\u0646.</div>', "tpl");
}
function serState() {
  CP.serState = CP.serState || { k: 0, res: [] };
  return CP.serState;
}
async function seriesStart() {
  const st = serState();
  if (st.k >= CITEM.e.days.length) {
    st.k = 0;
    st.res = [];
  }
  cpSave();
  await seriesDay();
}
async function seriesDay() {
  const e = CITEM.e, st = serState(), day = e.days[st.k];
  window.__courseStep = false;
  document.body.classList.remove("course-step");
  await showItemChart({ tf: day.tf, start_ts: day.start_ts });
  const sh = $("cSheet");
  sh.classList.remove("hidden", "cs-full");
  const netR = st.res.reduce((a, r) => a + (r.netR || 0), 0), adh = st.res.length ? st.res.reduce((a, r) => a + r.adh, 0) / st.res.length : 1;
  sh.innerHTML = '<div class="cs-head"><button id="csMap" class="cv-x">\u2715</button><span class="cs-kind">\u{1F451} ' + (L_() === "de" ? "Serie" : "\u0633\u0644\u0633\u0644\u0629") + " " + (st.k + 1) + "/" + e.days.length + '</span><span class="cs-diff">ATR ' + day.atr + " \xB7 spread " + day.spread + '$</span></div><div class="ser-bar"><span>\u03A3 <b class="' + (netR >= 0 ? "w" : "l") + '">' + (netR >= 0 ? "+" : "") + netR.toFixed(2) + "R</b></span><span>\u0627\u0644\u062A\u0632\u0627\u0645 <b>" + Math.round(adh * 100) + "%</b></span><span>" + st.res.map((r) => r.skip ? "\xB7" : r.netR > 0 ? "\u{1F7E2}" : "\u{1F534}").join("") + '</span></div><div class="cs-prompt">' + TX(e.prompt) + '</div><div class="row"><button class="cs-tool" data-tool="long">\u{1F4C8} \u0634\u0631\u0627\u0621</button><button class="cs-tool" data-tool="short">\u{1F4C9} \u0628\u064A\u0639</button></div><div class="row small"><label>\u0627\u0644\u0645\u062E\u0627\u0637\u0631\u0629 <select id="serRisk"><option value="0.5">0.5%</option><option value="1" selected>1%</option><option value="2">2%</option></select></label><span id="csRead"></span></div><div class="cs-act"><button id="serGo" class="cs-go">\u2714 \u0646\u0641\u0651\u0630</button><button id="serSkip" class="cs-skip">\u23ED \u0645\u0627 \u0641\u064A \u0635\u0641\u0642\u0629 \u0627\u0644\u064A\u0648\u0645</button></div>';
  $("csMap").onclick = () => {
    $("cSheet").classList.add("hidden");
    setMode("none");
    courseMap(CITEM.mi);
    $("courseView").classList.remove("hidden");
  };
  document.querySelectorAll("#cSheet .cs-tool").forEach((b) => b.onclick = () => {
    if (mode !== b.dataset.tool) setMode(b.dataset.tool);
    scrollTo(0, 0);
  });
  $("serSkip").onclick = () => seriesResolve(null);
  $("serGo").onclick = () => {
    const d = lastDraw("pos");
    if (!d) return alert("\u062D\u0637 \u0645\u0631\u0628\u0639 \u0634\u0631\u0627\u0621 \u0623\u0648 \u0628\u064A\u0639 \u0623\u0648\u0644\u0627\u064B\u060C \u0623\u0648 \u0627\u062E\u062A\u0627\u0631 \xAB\u0645\u0627 \u0641\u064A \u0635\u0641\u0642\u0629\xBB");
    seriesResolve(d);
  };
}
async function seriesResolve(d) {
  const e = CITEM.e, st = serState(), day = e.days[st.k], rules = e.rules;
  setMode("none");
  let r;
  if (!d) {
    r = { skip: true, adh: 1, netR: 0 };
  } else {
    const risk = +$("serRisk").value, dir = d.side === "buy" ? 1 : -1, px = S.price, shift = px - d.e, E = px, SL = +(d.sl + shift).toFixed(2), TP = +(d.tp + shift).toFixed(2), dist = Math.abs(E - SL);
    const prevLoss = st.res.length && !st.res[st.res.length - 1].skip && st.res[st.res.length - 1].netR < 0, prevRisk = st.res.length ? st.res[st.res.length - 1].risk || 1 : 1;
    const okStop = (SL - E) * dir < 0 && dist >= rules.stop_atr[0] * day.atr && dist <= rules.stop_atr[1] * day.atr, okRR = (TP - E) * dir > 0 && Math.abs(TP - E) >= rules.min_rr * dist - 1e-9, okRisk = risk === rules.risk_pct && !(prevLoss && risk > prevRisk);
    const M = await m1(S.cur + 60, S.cur + rules.max_hold_bars * 3600);
    let ex = null, et = null, why = "time";
    for (let i = 0; i < M.n; i++) {
      if (M.t[i] <= S.cur) continue;
      const hs = dir > 0 ? M.l[i] <= SL : M.h[i] >= SL, ht = dir > 0 ? M.h[i] >= TP : M.l[i] <= TP;
      if (hs) {
        ex = SL;
        et = M.t[i];
        why = "SL";
        break;
      }
      if (ht) {
        ex = TP;
        et = M.t[i];
        why = "TP";
        break;
      }
      if (M.t[i] > S.cur + rules.max_hold_bars * 3600) break;
    }
    if (ex == null && M.n) {
      let i = M.n - 1;
      while (i > 0 && M.t[i] > S.cur + rules.max_hold_bars * 3600) i--;
      ex = M.c[i];
      et = M.t[i];
    }
    const cost = day.spread + 2 * 0.05, gross = dist ? (ex - E) * dir / dist : 0, netR = +(gross - cost / dist).toFixed(2);
    d.e = E;
    d.sl = SL;
    d.tp = TP;
    d.st = "done";
    d.res = why;
    if (et) {
      d.t2 = Math.max(d.t2, et);
      S.cur = et;
      await render();
    }
    dirty++;
    r = { side: d.side, entry: E, sl: SL, tp: TP, exit: +(+ex).toFixed(2), why, risk, netR, grossR: +gross.toFixed(2), costR: +(cost / dist).toFixed(3), rules: { stop: okStop, rr: okRR, risk: okRisk }, adh: ((okStop ? 1 : 0) + (okRR ? 1 : 0) + (okRisk ? 1 : 0)) / 3 };
  }
  r.day = day.start_utc;
  st.res.push(r);
  st.k++;
  cpSave();
  const sh = $("cSheet"), last = st.k >= e.days.length;
  sh.innerHTML = '<div class="cs-head"><span class="cs-kind">' + st.k + "/" + e.days.length + "</span>" + (r.skip ? '<span class="cs-res">\u23ED \u0645\u0627 \u0641\u064A \u0635\u0641\u0642\u0629 (\u0645\u0644\u062A\u0632\u0645)</span>' : '<span class="cs-res ' + (r.netR > 0 ? "ok" : "bad") + '">' + r.why + " \xB7 " + (r.netR > 0 ? "+" : "") + r.netR + "R \u0635\u0627\u0641\u064A</span>") + "</div>" + (r.skip ? "" : '<div class="small">' + ["stop", "rr", "risk"].map((k) => (r.rules[k] ? "\u2705 " : "\u274C ") + { stop: "\u0648\u0642\u0641 0.5\u20133 ATR", rr: "\u0647\u062F\u0641 \u2265 1.5R", risk: "\u0645\u062E\u0627\u0637\u0631\u0629 1% \u0628\u062F\u0648\u0646 \u062A\u0643\u0628\u064A\u0631 \u0628\u0639\u062F \u062E\u0633\u0627\u0631\u0629" }[k]).join("<br>") + "<br>\u062A\u0643\u0627\u0644\u064A\u0641: " + r.costR + "R</div>") + '<div class="cs-act"><button id="serNext" class="cs-go">' + (last ? "\u{1F3C1} \u0627\u0644\u0646\u062A\u064A\u062C\u0629" : "\u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u062A\u0627\u0644\u064A \u2190") + "</button></div>";
  $("serNext").onclick = () => last ? seriesFinish() : seriesDay();
}
function seriesFinish() {
  const e = CITEM.e, m = CRS.modules[CITEM.mi], st = serState(), res = st.res;
  const adh = res.reduce((a, r) => a + r.adh, 0) / res.length, net = res.reduce((a, r) => a + (r.netR || 0), 0), trades = res.filter((r) => !r.skip).length, minT = e.rules && e.rules.min_trades || 8;
  let pct = Math.round(70 * adh + 30 * Math.max(0, Math.min(1, (net + 5) / 10)));
  const few = trades < minT;
  if (few) pct = Math.min(pct, 60);
  const pass = pct >= (m.boss.pass_pct || 75);
  CP.series = { last: { pct, adh: +(adh * 100).toFixed(1), netR: +net.toFixed(2), trades, at: (/* @__PURE__ */ new Date()).toISOString(), res }, best: Math.max(CP.series && CP.series.best || 0, pct), tries: (CP.series && CP.series.tries || 0) + 1 };
  const b = CP.boss[m.id] || {};
  b.best = Math.max(b.best || 0, pct);
  b.passed = b.passed || pass;
  b.tries = (b.tries || 0) + 1;
  CP.boss[m.id] = b;
  CP.xp += Math.round(e.xp * pct / 100) + (pass ? 100 : 0);
  bumpStreak();
  CP.serState = null;
  CP.cur = null;
  cpSave();
  $("cSheet").innerHTML = '<div class="cs-boss ' + (pass ? "ok" : "bad") + '"><div class="cs-big">' + (pass ? "\u{1F3C6}" : "\u{1F4AA}") + "</div><b>" + pct + "% / " + (m.boss.pass_pct || 75) + '%</b><div class="egrid"><div><small>\u0627\u0644\u062A\u0632\u0627\u0645</small><b>' + Math.round(adh * 100) + '%</b></div><div><small>\u0635\u0627\u0641\u064A</small><b class="' + (net >= 0 ? "w" : "l") + '">' + (net >= 0 ? "+" : "") + net.toFixed(2) + "R</b></div><div><small>\u0635\u0641\u0642\u0627\u062A</small><b>" + trades + '/20</b></div></div><div class="small">\u0627\u0644\u0639\u0644\u0627\u0645\u0629 = 70% \u0627\u0644\u062A\u0632\u0627\u0645 + 30% \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u0635\u0627\u0641\u064A\u0629. ' + (few ? "\u0644\u0627\u0632\u0645 " + minT + " \u0635\u0641\u0642\u0627\u062A \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 (\u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0645\u062D\u062F\u0648\u062F\u0629 \u0628\u064060%). " : "") + (pass ? "\u062C\u0627\u0647\u0632 \u0644\u0644\u062F\u064A\u0645\u0648 \u0628\u0646\u0641\u0633 \u0627\u0644\u0642\u0648\u0627\u0639\u062F." : "\u0631\u0627\u062C\u0639 \u0627\u0644\u0642\u0648\u0627\u0639\u062F \u0648\u062C\u0631\u0651\u0628 \u0645\u0631\u0629 \u062A\u0627\u0646\u064A\u0629.") + '</div><button id="csDone" class="cs-go">\u0627\u0644\u062E\u0631\u064A\u0637\u0629</button></div>';
  $("csDone").onclick = () => {
    $("cSheet").classList.add("hidden");
    courseMap(CITEM.mi);
    $("courseView").classList.remove("hidden");
  };
}
