/*!
 * @license
 * TradingView Lightweight Charts™ v4.2.0
 * Copyright (c) 2024 TradingView, Inc.
 * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
 */
!function() {
  "use strict";
  const t = { upColor: "#26a69a", downColor: "#ef5350", wickVisible: true, borderVisible: true, borderColor: "#378658", borderUpColor: "#26a69a", borderDownColor: "#ef5350", wickColor: "#737375", wickUpColor: "#26a69a", wickDownColor: "#ef5350" }, i = { upColor: "#26a69a", downColor: "#ef5350", openVisible: true, thinBars: true }, n = { color: "#2196f3", lineStyle: 0, lineWidth: 3, lineType: 0, lineVisible: true, crosshairMarkerVisible: true, crosshairMarkerRadius: 4, crosshairMarkerBorderColor: "", crosshairMarkerBorderWidth: 2, crosshairMarkerBackgroundColor: "", lastPriceAnimation: 0, pointMarkersVisible: false }, s = { topColor: "rgba( 46, 220, 135, 0.4)", bottomColor: "rgba( 40, 221, 100, 0)", invertFilledArea: false, lineColor: "#33D778", lineStyle: 0, lineWidth: 3, lineType: 0, lineVisible: true, crosshairMarkerVisible: true, crosshairMarkerRadius: 4, crosshairMarkerBorderColor: "", crosshairMarkerBorderWidth: 2, crosshairMarkerBackgroundColor: "", lastPriceAnimation: 0, pointMarkersVisible: false }, e = { baseValue: { type: "price", price: 0 }, topFillColor1: "rgba(38, 166, 154, 0.28)", topFillColor2: "rgba(38, 166, 154, 0.05)", topLineColor: "rgba(38, 166, 154, 1)", bottomFillColor1: "rgba(239, 83, 80, 0.05)", bottomFillColor2: "rgba(239, 83, 80, 0.28)", bottomLineColor: "rgba(239, 83, 80, 1)", lineWidth: 3, lineStyle: 0, lineType: 0, lineVisible: true, crosshairMarkerVisible: true, crosshairMarkerRadius: 4, crosshairMarkerBorderColor: "", crosshairMarkerBorderWidth: 2, crosshairMarkerBackgroundColor: "", lastPriceAnimation: 0, pointMarkersVisible: false }, r = { color: "#26a69a", base: 0 }, h = { color: "#2196f3" }, l = { title: "", visible: true, lastValueVisible: true, priceLineVisible: true, priceLineSource: 0, priceLineWidth: 1, priceLineColor: "", priceLineStyle: 2, baseLineVisible: true, baseLineWidth: 1, baseLineColor: "#B2B5BE", baseLineStyle: 0, priceFormat: { type: "price", precision: 2, minMove: 0.01 } };
  var a, o;
  function _(t2, i2) {
    const n2 = { 0: [], 1: [t2.lineWidth, t2.lineWidth], 2: [2 * t2.lineWidth, 2 * t2.lineWidth], 3: [6 * t2.lineWidth, 6 * t2.lineWidth], 4: [t2.lineWidth, 4 * t2.lineWidth] }[i2];
    t2.setLineDash(n2);
  }
  function u(t2, i2, n2, s2) {
    t2.beginPath();
    const e2 = t2.lineWidth % 2 ? 0.5 : 0;
    t2.moveTo(n2, i2 + e2), t2.lineTo(s2, i2 + e2), t2.stroke();
  }
  function c(t2, i2) {
    if (!t2) throw new Error("Assertion failed" + (i2 ? ": " + i2 : ""));
  }
  function d(t2) {
    if (void 0 === t2) throw new Error("Value is undefined");
    return t2;
  }
  function f(t2) {
    if (null === t2) throw new Error("Value is null");
    return t2;
  }
  function v(t2) {
    return f(d(t2));
  }
  !function(t2) {
    t2[t2.Simple = 0] = "Simple", t2[t2.WithSteps = 1] = "WithSteps", t2[t2.Curved = 2] = "Curved";
  }(a || (a = {})), function(t2) {
    t2[t2.Solid = 0] = "Solid", t2[t2.Dotted = 1] = "Dotted", t2[t2.Dashed = 2] = "Dashed", t2[t2.LargeDashed = 3] = "LargeDashed", t2[t2.SparseDotted = 4] = "SparseDotted";
  }(o || (o = {}));
  const p = { khaki: "#f0e68c", azure: "#f0ffff", aliceblue: "#f0f8ff", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", gray: "#808080", green: "#008000", honeydew: "#f0fff0", floralwhite: "#fffaf0", lightblue: "#add8e6", lightcoral: "#f08080", lemonchiffon: "#fffacd", hotpink: "#ff69b4", lightyellow: "#ffffe0", greenyellow: "#adff2f", lightgoldenrodyellow: "#fafad2", limegreen: "#32cd32", linen: "#faf0e6", lightcyan: "#e0ffff", magenta: "#f0f", maroon: "#800000", olive: "#808000", orange: "#ffa500", oldlace: "#fdf5e6", mediumblue: "#0000cd", transparent: "#0000", lime: "#0f0", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", midnightblue: "#191970", orchid: "#da70d6", mediumorchid: "#ba55d3", mediumturquoise: "#48d1cc", orangered: "#ff4500", royalblue: "#4169e1", powderblue: "#b0e0e6", red: "#f00", coral: "#ff7f50", turquoise: "#40e0d0", white: "#fff", whitesmoke: "#f5f5f5", wheat: "#f5deb3", teal: "#008080", steelblue: "#4682b4", bisque: "#ffe4c4", aquamarine: "#7fffd4", aqua: "#0ff", sienna: "#a0522d", silver: "#c0c0c0", springgreen: "#00ff7f", antiquewhite: "#faebd7", burlywood: "#deb887", brown: "#a52a2a", beige: "#f5f5dc", chocolate: "#d2691e", chartreuse: "#7fff00", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cadetblue: "#5f9ea0", tomato: "#ff6347", fuchsia: "#f0f", blue: "#00f", salmon: "#fa8072", blanchedalmond: "#ffebcd", slateblue: "#6a5acd", slategray: "#708090", thistle: "#d8bfd8", tan: "#d2b48c", cyan: "#0ff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", blueviolet: "#8a2be2", black: "#000", darkmagenta: "#8b008b", darkslateblue: "#483d8b", darkkhaki: "#bdb76b", darkorchid: "#9932cc", darkorange: "#ff8c00", darkgreen: "#006400", darkred: "#8b0000", dodgerblue: "#1e90ff", darkslategray: "#2f4f4f", dimgray: "#696969", deepskyblue: "#00bfff", firebrick: "#b22222", forestgreen: "#228b22", indigo: "#4b0082", ivory: "#fffff0", lavenderblush: "#fff0f5", feldspar: "#d19275", indianred: "#cd5c5c", lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightskyblue: "#87cefa", lightslategray: "#789", lightslateblue: "#8470ff", snow: "#fffafa", lightseagreen: "#20b2aa", lightsalmon: "#ffa07a", darksalmon: "#e9967a", darkviolet: "#9400d3", mediumpurple: "#9370d8", mediumaquamarine: "#66cdaa", skyblue: "#87ceeb", lavender: "#e6e6fa", lightsteelblue: "#b0c4de", mediumvioletred: "#c71585", mintcream: "#f5fffa", navajowhite: "#ffdead", navy: "#000080", olivedrab: "#6b8e23", palevioletred: "#d87093", violetred: "#d02090", yellow: "#ff0", yellowgreen: "#9acd32", lawngreen: "#7cfc00", pink: "#ffc0cb", paleturquoise: "#afeeee", palegoldenrod: "#eee8aa", darkolivegreen: "#556b2f", darkseagreen: "#8fbc8f", darkturquoise: "#00ced1", peachpuff: "#ffdab9", deeppink: "#ff1493", violet: "#ee82ee", palegreen: "#98fb98", mediumseagreen: "#3cb371", peru: "#cd853f", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", purple: "#800080", seagreen: "#2e8b57", seashell: "#fff5ee", papayawhip: "#ffefd5", mediumslateblue: "#7b68ee", plum: "#dda0dd", mediumspringgreen: "#00fa9a" };
  function m(t2) {
    return t2 < 0 ? 0 : t2 > 255 ? 255 : Math.round(t2) || 0;
  }
  function b(t2) {
    return t2 <= 0 || t2 > 1 ? Math.min(Math.max(t2, 0), 1) : Math.round(1e4 * t2) / 1e4;
  }
  const w = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i, g = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i, M = /^rgb\(\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*\)$/, x = /^rgba\(\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d*\.?\d+)\s*\)$/;
  function S(t2) {
    (t2 = t2.toLowerCase()) in p && (t2 = p[t2]);
    {
      const i2 = x.exec(t2) || M.exec(t2);
      if (i2) return [m(parseInt(i2[1], 10)), m(parseInt(i2[2], 10)), m(parseInt(i2[3], 10)), b(i2.length < 5 ? 1 : parseFloat(i2[4]))];
    }
    {
      const i2 = g.exec(t2);
      if (i2) return [m(parseInt(i2[1], 16)), m(parseInt(i2[2], 16)), m(parseInt(i2[3], 16)), 1];
    }
    {
      const i2 = w.exec(t2);
      if (i2) return [m(17 * parseInt(i2[1], 16)), m(17 * parseInt(i2[2], 16)), m(17 * parseInt(i2[3], 16)), 1];
    }
    throw new Error(`Cannot parse color: ${t2}`);
  }
  function k(t2) {
    return 0.199 * t2[0] + 0.687 * t2[1] + 0.114 * t2[2];
  }
  function y(t2) {
    const i2 = S(t2);
    return { t: `rgb(${i2[0]}, ${i2[1]}, ${i2[2]})`, i: k(i2) > 160 ? "black" : "white" };
  }
  class C {
    constructor() {
      this.h = [];
    }
    l(t2, i2, n2) {
      const s2 = { o: t2, _: i2, u: true === n2 };
      this.h.push(s2);
    }
    v(t2) {
      const i2 = this.h.findIndex((i3) => t2 === i3.o);
      i2 > -1 && this.h.splice(i2, 1);
    }
    p(t2) {
      this.h = this.h.filter((i2) => i2._ !== t2);
    }
    m(t2, i2, n2) {
      const s2 = [...this.h];
      this.h = this.h.filter((t3) => !t3.u), s2.forEach((s3) => s3.o(t2, i2, n2));
    }
    M() {
      return this.h.length > 0;
    }
    S() {
      this.h = [];
    }
  }
  function T(t2, ...i2) {
    for (const n2 of i2) for (const i3 in n2) void 0 !== n2[i3] && ("object" != typeof n2[i3] || void 0 === t2[i3] || Array.isArray(n2[i3]) ? t2[i3] = n2[i3] : T(t2[i3], n2[i3]));
    return t2;
  }
  function P(t2) {
    return "number" == typeof t2 && isFinite(t2);
  }
  function R(t2) {
    return "number" == typeof t2 && t2 % 1 == 0;
  }
  function D(t2) {
    return "string" == typeof t2;
  }
  function O(t2) {
    return "boolean" == typeof t2;
  }
  function B(t2) {
    const i2 = t2;
    if (!i2 || "object" != typeof i2) return i2;
    let n2, s2, e2;
    for (s2 in n2 = Array.isArray(i2) ? [] : {}, i2) i2.hasOwnProperty(s2) && (e2 = i2[s2], n2[s2] = e2 && "object" == typeof e2 ? B(e2) : e2);
    return n2;
  }
  function V(t2) {
    return null !== t2;
  }
  function A(t2) {
    return null === t2 ? void 0 : t2;
  }
  const z = "-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif";
  function E(t2, i2, n2) {
    return void 0 === i2 && (i2 = z), `${n2 = void 0 !== n2 ? `${n2} ` : ""}${t2}px ${i2}`;
  }
  class I {
    constructor(t2) {
      this.k = { C: 1, T: 5, P: NaN, R: "", D: "", O: "", B: "", V: 0, A: 0, I: 0, L: 0, N: 0 }, this.F = t2;
    }
    W() {
      const t2 = this.k, i2 = this.j(), n2 = this.H();
      return t2.P === i2 && t2.D === n2 || (t2.P = i2, t2.D = n2, t2.R = E(i2, n2), t2.L = 2.5 / 12 * i2, t2.V = t2.L, t2.A = i2 / 12 * t2.T, t2.I = i2 / 12 * t2.T, t2.N = 0), t2.O = this.$(), t2.B = this.U(), this.k;
    }
    $() {
      return this.F.W().layout.textColor;
    }
    U() {
      return this.F.q();
    }
    j() {
      return this.F.W().layout.fontSize;
    }
    H() {
      return this.F.W().layout.fontFamily;
    }
  }
  class L {
    constructor() {
      this.Y = [];
    }
    Z(t2) {
      this.Y = t2;
    }
    X(t2, i2, n2) {
      this.Y.forEach((s2) => {
        s2.X(t2, i2, n2);
      });
    }
  }
  class N {
    X(t2, i2, n2) {
      t2.useBitmapCoordinateSpace((t3) => this.K(t3, i2, n2));
    }
  }
  class F extends N {
    constructor() {
      super(...arguments), this.G = null;
    }
    J(t2) {
      this.G = t2;
    }
    K({ context: t2, horizontalPixelRatio: i2, verticalPixelRatio: n2 }) {
      if (null === this.G || null === this.G.tt) return;
      const s2 = this.G.tt, e2 = this.G, r2 = Math.max(1, Math.floor(i2)) % 2 / 2, h2 = (h3) => {
        t2.beginPath();
        for (let l2 = s2.to - 1; l2 >= s2.from; --l2) {
          const s3 = e2.it[l2], a2 = Math.round(s3.nt * i2) + r2, o2 = s3.st * n2, _2 = h3 * n2 + r2;
          t2.moveTo(a2, o2), t2.arc(a2, o2, _2, 0, 2 * Math.PI);
        }
        t2.fill();
      };
      e2.et > 0 && (t2.fillStyle = e2.rt, h2(e2.ht + e2.et)), t2.fillStyle = e2.lt, h2(e2.ht);
    }
  }
  function W() {
    return { it: [{ nt: 0, st: 0, ot: 0, _t: 0 }], lt: "", rt: "", ht: 0, et: 0, tt: null };
  }
  const j = { from: 0, to: 1 };
  class H {
    constructor(t2, i2) {
      this.ut = new L(), this.ct = [], this.dt = [], this.ft = true, this.F = t2, this.vt = i2, this.ut.Z(this.ct);
    }
    bt(t2) {
      const i2 = this.F.wt();
      i2.length !== this.ct.length && (this.dt = i2.map(W), this.ct = this.dt.map((t3) => {
        const i3 = new F();
        return i3.J(t3), i3;
      }), this.ut.Z(this.ct)), this.ft = true;
    }
    gt() {
      return this.ft && (this.Mt(), this.ft = false), this.ut;
    }
    Mt() {
      const t2 = 2 === this.vt.W().mode, i2 = this.F.wt(), n2 = this.vt.xt(), s2 = this.F.St();
      i2.forEach((i3, e2) => {
        var r2;
        const h2 = this.dt[e2], l2 = i3.kt(n2);
        if (t2 || null === l2 || !i3.yt()) return void (h2.tt = null);
        const a2 = f(i3.Ct());
        h2.lt = l2.Tt, h2.ht = l2.ht, h2.et = l2.Pt, h2.it[0]._t = l2._t, h2.it[0].st = i3.Dt().Rt(l2._t, a2.Ot), h2.rt = null !== (r2 = l2.Bt) && void 0 !== r2 ? r2 : this.F.Vt(h2.it[0].st / i3.Dt().At()), h2.it[0].ot = n2, h2.it[0].nt = s2.zt(n2), h2.tt = j;
      });
    }
  }
  class $ extends N {
    constructor(t2) {
      super(), this.Et = t2;
    }
    K({ context: t2, bitmapSize: i2, horizontalPixelRatio: n2, verticalPixelRatio: s2 }) {
      if (null === this.Et) return;
      const e2 = this.Et.It.yt, r2 = this.Et.Lt.yt;
      if (!e2 && !r2) return;
      const h2 = Math.round(this.Et.nt * n2), l2 = Math.round(this.Et.st * s2);
      t2.lineCap = "butt", e2 && h2 >= 0 && (t2.lineWidth = Math.floor(this.Et.It.et * n2), t2.strokeStyle = this.Et.It.O, t2.fillStyle = this.Et.It.O, _(t2, this.Et.It.Nt), function(t3, i3, n3, s3) {
        t3.beginPath();
        const e3 = t3.lineWidth % 2 ? 0.5 : 0;
        t3.moveTo(i3 + e3, n3), t3.lineTo(i3 + e3, s3), t3.stroke();
      }(t2, h2, 0, i2.height)), r2 && l2 >= 0 && (t2.lineWidth = Math.floor(this.Et.Lt.et * s2), t2.strokeStyle = this.Et.Lt.O, t2.fillStyle = this.Et.Lt.O, _(t2, this.Et.Lt.Nt), u(t2, l2, 0, i2.width));
    }
  }
  class U {
    constructor(t2) {
      this.ft = true, this.Ft = { It: { et: 1, Nt: 0, O: "", yt: false }, Lt: { et: 1, Nt: 0, O: "", yt: false }, nt: 0, st: 0 }, this.Wt = new $(this.Ft), this.jt = t2;
    }
    bt() {
      this.ft = true;
    }
    gt() {
      return this.ft && (this.Mt(), this.ft = false), this.Wt;
    }
    Mt() {
      const t2 = this.jt.yt(), i2 = f(this.jt.Ht()), n2 = i2.$t().W().crosshair, s2 = this.Ft;
      if (2 === n2.mode) return s2.Lt.yt = false, void (s2.It.yt = false);
      s2.Lt.yt = t2 && this.jt.Ut(i2), s2.It.yt = t2 && this.jt.qt(), s2.Lt.et = n2.horzLine.width, s2.Lt.Nt = n2.horzLine.style, s2.Lt.O = n2.horzLine.color, s2.It.et = n2.vertLine.width, s2.It.Nt = n2.vertLine.style, s2.It.O = n2.vertLine.color, s2.nt = this.jt.Yt(), s2.st = this.jt.Zt();
    }
  }
  function q(t2, i2, n2, s2, e2, r2) {
    t2.fillRect(i2 + r2, n2, s2 - 2 * r2, r2), t2.fillRect(i2 + r2, n2 + e2 - r2, s2 - 2 * r2, r2), t2.fillRect(i2, n2, r2, e2), t2.fillRect(i2 + s2 - r2, n2, r2, e2);
  }
  function Y(t2, i2, n2, s2, e2, r2) {
    t2.save(), t2.globalCompositeOperation = "copy", t2.fillStyle = r2, t2.fillRect(i2, n2, s2, e2), t2.restore();
  }
  function Z(t2, i2, n2, s2, e2, r2) {
    t2.beginPath(), t2.roundRect ? t2.roundRect(i2, n2, s2, e2, r2) : (t2.lineTo(i2 + s2 - r2[1], n2), 0 !== r2[1] && t2.arcTo(i2 + s2, n2, i2 + s2, n2 + r2[1], r2[1]), t2.lineTo(i2 + s2, n2 + e2 - r2[2]), 0 !== r2[2] && t2.arcTo(i2 + s2, n2 + e2, i2 + s2 - r2[2], n2 + e2, r2[2]), t2.lineTo(i2 + r2[3], n2 + e2), 0 !== r2[3] && t2.arcTo(i2, n2 + e2, i2, n2 + e2 - r2[3], r2[3]), t2.lineTo(i2, n2 + r2[0]), 0 !== r2[0] && t2.arcTo(i2, n2, i2 + r2[0], n2, r2[0]));
  }
  function X(t2, i2, n2, s2, e2, r2, h2 = 0, l2 = [0, 0, 0, 0], a2 = "") {
    if (t2.save(), !h2 || !a2 || a2 === r2) return Z(t2, i2, n2, s2, e2, l2), t2.fillStyle = r2, t2.fill(), void t2.restore();
    const o2 = h2 / 2;
    var _2;
    Z(t2, i2 + o2, n2 + o2, s2 - h2, e2 - h2, (_2 = -o2, l2.map((t3) => 0 === t3 ? t3 : t3 + _2))), "transparent" !== r2 && (t2.fillStyle = r2, t2.fill()), "transparent" !== a2 && (t2.lineWidth = h2, t2.strokeStyle = a2, t2.closePath(), t2.stroke()), t2.restore();
  }
  function K(t2, i2, n2, s2, e2, r2, h2) {
    t2.save(), t2.globalCompositeOperation = "copy";
    const l2 = t2.createLinearGradient(0, 0, 0, e2);
    l2.addColorStop(0, r2), l2.addColorStop(1, h2), t2.fillStyle = l2, t2.fillRect(i2, n2, s2, e2), t2.restore();
  }
  class G {
    constructor(t2, i2) {
      this.J(t2, i2);
    }
    J(t2, i2) {
      this.Et = t2, this.Xt = i2;
    }
    At(t2, i2) {
      return this.Et.yt ? t2.P + t2.L + t2.V : 0;
    }
    X(t2, i2, n2, s2) {
      if (!this.Et.yt || 0 === this.Et.Kt.length) return;
      const e2 = this.Et.O, r2 = this.Xt.t, h2 = t2.useBitmapCoordinateSpace((t3) => {
        const h3 = t3.context;
        h3.font = i2.R;
        const l2 = this.Gt(t3, i2, n2, s2), a2 = l2.Jt, o2 = (t4, i3) => {
          l2.Qt ? X(h3, a2.ti, a2.ii, a2.ni, a2.si, t4, a2.ei, [a2.ht, 0, 0, a2.ht], i3) : X(h3, a2.ri, a2.ii, a2.ni, a2.si, t4, a2.ei, [0, a2.ht, a2.ht, 0], i3);
        };
        return o2(r2, "transparent"), this.Et.hi && (h3.fillStyle = e2, h3.fillRect(a2.ri, a2.li, a2.ai - a2.ri, a2.oi)), o2("transparent", r2), this.Et._i && (h3.fillStyle = i2.B, h3.fillRect(l2.Qt ? a2.ui - a2.ei : 0, a2.ii, a2.ei, a2.ci - a2.ii)), l2;
      });
      t2.useMediaCoordinateSpace(({ context: t3 }) => {
        const n3 = h2.di;
        t3.font = i2.R, t3.textAlign = h2.Qt ? "right" : "left", t3.textBaseline = "middle", t3.fillStyle = e2, t3.fillText(this.Et.Kt, n3.fi, (n3.ii + n3.ci) / 2 + n3.pi);
      });
    }
    Gt(t2, i2, n2, s2) {
      var e2;
      const { context: r2, bitmapSize: h2, mediaSize: l2, horizontalPixelRatio: a2, verticalPixelRatio: o2 } = t2, _2 = this.Et.hi || !this.Et.mi ? i2.T : 0, u2 = this.Et.bi ? i2.C : 0, c2 = i2.L + this.Xt.wi, d2 = i2.V + this.Xt.gi, f2 = i2.A, v2 = i2.I, p2 = this.Et.Kt, m2 = i2.P, b2 = n2.Mi(r2, p2), w2 = Math.ceil(n2.xi(r2, p2)), g2 = m2 + c2 + d2, M2 = i2.C + f2 + v2 + w2 + _2, x2 = Math.max(1, Math.floor(o2));
      let S2 = Math.round(g2 * o2);
      S2 % 2 != x2 % 2 && (S2 += 1);
      const k2 = u2 > 0 ? Math.max(1, Math.floor(u2 * a2)) : 0, y2 = Math.round(M2 * a2), C2 = Math.round(_2 * a2), T2 = null !== (e2 = this.Xt.Si) && void 0 !== e2 ? e2 : this.Xt.ki, P2 = Math.round(T2 * o2) - Math.floor(0.5 * o2), R2 = Math.floor(P2 + x2 / 2 - S2 / 2), D2 = R2 + S2, O2 = "right" === s2, B2 = O2 ? l2.width - u2 : u2, V2 = O2 ? h2.width - k2 : k2;
      let A2, z2, E2;
      return O2 ? (A2 = V2 - y2, z2 = V2 - C2, E2 = B2 - _2 - f2 - u2) : (A2 = V2 + y2, z2 = V2 + C2, E2 = B2 + _2 + f2), { Qt: O2, Jt: { ii: R2, li: P2, ci: D2, ni: y2, si: S2, ht: 2 * a2, ei: k2, ti: A2, ri: V2, ai: z2, oi: x2, ui: h2.width }, di: { ii: R2 / o2, ci: D2 / o2, fi: E2, pi: b2 } };
    }
  }
  class J {
    constructor(t2) {
      this.yi = { ki: 0, t: "#000", gi: 0, wi: 0 }, this.Ci = { Kt: "", yt: false, hi: true, mi: false, Bt: "", O: "#FFF", _i: false, bi: false }, this.Ti = { Kt: "", yt: false, hi: false, mi: true, Bt: "", O: "#FFF", _i: true, bi: true }, this.ft = true, this.Pi = new (t2 || G)(this.Ci, this.yi), this.Ri = new (t2 || G)(this.Ti, this.yi);
    }
    Kt() {
      return this.Di(), this.Ci.Kt;
    }
    ki() {
      return this.Di(), this.yi.ki;
    }
    bt() {
      this.ft = true;
    }
    At(t2, i2 = false) {
      return Math.max(this.Pi.At(t2, i2), this.Ri.At(t2, i2));
    }
    Oi() {
      return this.yi.Si || 0;
    }
    Bi(t2) {
      this.yi.Si = t2;
    }
    Vi() {
      return this.Di(), this.Ci.yt || this.Ti.yt;
    }
    Ai() {
      return this.Di(), this.Ci.yt;
    }
    gt(t2) {
      return this.Di(), this.Ci.hi = this.Ci.hi && t2.W().ticksVisible, this.Ti.hi = this.Ti.hi && t2.W().ticksVisible, this.Pi.J(this.Ci, this.yi), this.Ri.J(this.Ti, this.yi), this.Pi;
    }
    zi() {
      return this.Di(), this.Pi.J(this.Ci, this.yi), this.Ri.J(this.Ti, this.yi), this.Ri;
    }
    Di() {
      this.ft && (this.Ci.hi = true, this.Ti.hi = false, this.Ei(this.Ci, this.Ti, this.yi));
    }
  }
  class Q extends J {
    constructor(t2, i2, n2) {
      super(), this.jt = t2, this.Ii = i2, this.Li = n2;
    }
    Ei(t2, i2, n2) {
      if (t2.yt = false, 2 === this.jt.W().mode) return;
      const s2 = this.jt.W().horzLine;
      if (!s2.labelVisible) return;
      const e2 = this.Ii.Ct();
      if (!this.jt.yt() || this.Ii.Ni() || null === e2) return;
      const r2 = y(s2.labelBackgroundColor);
      n2.t = r2.t, t2.O = r2.i;
      const h2 = 2 / 12 * this.Ii.P();
      n2.wi = h2, n2.gi = h2;
      const l2 = this.Li(this.Ii);
      n2.ki = l2.ki, t2.Kt = this.Ii.Fi(l2._t, e2), t2.yt = true;
    }
  }
  const tt = /[1-9]/g;
  class it {
    constructor() {
      this.Et = null;
    }
    J(t2) {
      this.Et = t2;
    }
    X(t2, i2) {
      if (null === this.Et || false === this.Et.yt || 0 === this.Et.Kt.length) return;
      const n2 = t2.useMediaCoordinateSpace(({ context: t3 }) => (t3.font = i2.R, Math.round(i2.Wi.xi(t3, f(this.Et).Kt, tt))));
      if (n2 <= 0) return;
      const s2 = i2.ji, e2 = n2 + 2 * s2, r2 = e2 / 2, h2 = this.Et.Hi;
      let l2 = this.Et.ki, a2 = Math.floor(l2 - r2) + 0.5;
      a2 < 0 ? (l2 += Math.abs(0 - a2), a2 = Math.floor(l2 - r2) + 0.5) : a2 + e2 > h2 && (l2 -= Math.abs(h2 - (a2 + e2)), a2 = Math.floor(l2 - r2) + 0.5);
      const o2 = a2 + e2, _2 = Math.ceil(0 + i2.C + i2.T + i2.L + i2.P + i2.V);
      t2.useBitmapCoordinateSpace(({ context: t3, horizontalPixelRatio: n3, verticalPixelRatio: s3 }) => {
        const e3 = f(this.Et);
        t3.fillStyle = e3.t;
        const r3 = Math.round(a2 * n3), h3 = Math.round(0 * s3), l3 = Math.round(o2 * n3), u2 = Math.round(_2 * s3), c2 = Math.round(2 * n3);
        if (t3.beginPath(), t3.moveTo(r3, h3), t3.lineTo(r3, u2 - c2), t3.arcTo(r3, u2, r3 + c2, u2, c2), t3.lineTo(l3 - c2, u2), t3.arcTo(l3, u2, l3, u2 - c2, c2), t3.lineTo(l3, h3), t3.fill(), e3.hi) {
          const r4 = Math.round(e3.ki * n3), l4 = h3, a3 = Math.round((l4 + i2.T) * s3);
          t3.fillStyle = e3.O;
          const o3 = Math.max(1, Math.floor(n3)), _3 = Math.floor(0.5 * n3);
          t3.fillRect(r4 - _3, l4, o3, a3 - l4);
        }
      }), t2.useMediaCoordinateSpace(({ context: t3 }) => {
        const n3 = f(this.Et), e3 = 0 + i2.C + i2.T + i2.L + i2.P / 2;
        t3.font = i2.R, t3.textAlign = "left", t3.textBaseline = "middle", t3.fillStyle = n3.O;
        const r3 = i2.Wi.Mi(t3, "Apr0");
        t3.translate(a2 + s2, e3 + r3), t3.fillText(n3.Kt, 0, 0);
      });
    }
  }
  class nt {
    constructor(t2, i2, n2) {
      this.ft = true, this.Wt = new it(), this.Ft = { yt: false, t: "#4c525e", O: "white", Kt: "", Hi: 0, ki: NaN, hi: true }, this.vt = t2, this.$i = i2, this.Li = n2;
    }
    bt() {
      this.ft = true;
    }
    gt() {
      return this.ft && (this.Mt(), this.ft = false), this.Wt.J(this.Ft), this.Wt;
    }
    Mt() {
      const t2 = this.Ft;
      if (t2.yt = false, 2 === this.vt.W().mode) return;
      const i2 = this.vt.W().vertLine;
      if (!i2.labelVisible) return;
      const n2 = this.$i.St();
      if (n2.Ni()) return;
      t2.Hi = n2.Hi();
      const s2 = this.Li();
      if (null === s2) return;
      t2.ki = s2.ki;
      const e2 = n2.Ui(this.vt.xt());
      t2.Kt = n2.qi(f(e2)), t2.yt = true;
      const r2 = y(i2.labelBackgroundColor);
      t2.t = r2.t, t2.O = r2.i, t2.hi = n2.W().ticksVisible;
    }
  }
  class st {
    constructor() {
      this.Yi = null, this.Zi = 0;
    }
    Xi() {
      return this.Zi;
    }
    Ki(t2) {
      this.Zi = t2;
    }
    Dt() {
      return this.Yi;
    }
    Gi(t2) {
      this.Yi = t2;
    }
    Ji(t2) {
      return [];
    }
    Qi() {
      return [];
    }
    yt() {
      return true;
    }
  }
  var et;
  !function(t2) {
    t2[t2.Normal = 0] = "Normal", t2[t2.Magnet = 1] = "Magnet", t2[t2.Hidden = 2] = "Hidden";
  }(et || (et = {}));
  class rt extends st {
    constructor(t2, i2) {
      super(), this.tn = null, this.nn = NaN, this.sn = 0, this.en = true, this.rn = /* @__PURE__ */ new Map(), this.hn = false, this.ln = NaN, this.an = NaN, this._n = NaN, this.un = NaN, this.$i = t2, this.cn = i2, this.dn = new H(t2, this);
      this.fn = /* @__PURE__ */ ((t3, i3) => (n3) => {
        const s2 = i3(), e2 = t3();
        if (n3 === f(this.tn).vn()) return { _t: e2, ki: s2 };
        {
          const t4 = f(n3.Ct());
          return { _t: n3.pn(s2, t4), ki: s2 };
        }
      })(() => this.nn, () => this.an);
      const n2 = /* @__PURE__ */ ((t3, i3) => () => {
        const n3 = this.$i.St().mn(t3()), s2 = i3();
        return n3 && Number.isFinite(s2) ? { ot: n3, ki: s2 } : null;
      })(() => this.sn, () => this.Yt());
      this.bn = new nt(this, t2, n2), this.wn = new U(this);
    }
    W() {
      return this.cn;
    }
    gn(t2, i2) {
      this._n = t2, this.un = i2;
    }
    Mn() {
      this._n = NaN, this.un = NaN;
    }
    xn() {
      return this._n;
    }
    Sn() {
      return this.un;
    }
    kn(t2, i2, n2) {
      this.hn || (this.hn = true), this.en = true, this.yn(t2, i2, n2);
    }
    xt() {
      return this.sn;
    }
    Yt() {
      return this.ln;
    }
    Zt() {
      return this.an;
    }
    yt() {
      return this.en;
    }
    Cn() {
      this.en = false, this.Tn(), this.nn = NaN, this.ln = NaN, this.an = NaN, this.tn = null, this.Mn();
    }
    Pn(t2) {
      return null !== this.tn ? [this.wn, this.dn] : [];
    }
    Ut(t2) {
      return t2 === this.tn && this.cn.horzLine.visible;
    }
    qt() {
      return this.cn.vertLine.visible;
    }
    Rn(t2, i2) {
      this.en && this.tn === t2 || this.rn.clear();
      const n2 = [];
      return this.tn === t2 && n2.push(this.Dn(this.rn, i2, this.fn)), n2;
    }
    Qi() {
      return this.en ? [this.bn] : [];
    }
    Ht() {
      return this.tn;
    }
    On() {
      this.wn.bt(), this.rn.forEach((t2) => t2.bt()), this.bn.bt(), this.dn.bt();
    }
    Bn(t2) {
      return t2 && !t2.vn().Ni() ? t2.vn() : null;
    }
    yn(t2, i2, n2) {
      this.Vn(t2, i2, n2) && this.On();
    }
    Vn(t2, i2, n2) {
      const s2 = this.ln, e2 = this.an, r2 = this.nn, h2 = this.sn, l2 = this.tn, a2 = this.Bn(n2);
      this.sn = t2, this.ln = isNaN(t2) ? NaN : this.$i.St().zt(t2), this.tn = n2;
      const o2 = null !== a2 ? a2.Ct() : null;
      return null !== a2 && null !== o2 ? (this.nn = i2, this.an = a2.Rt(i2, o2)) : (this.nn = NaN, this.an = NaN), s2 !== this.ln || e2 !== this.an || h2 !== this.sn || r2 !== this.nn || l2 !== this.tn;
    }
    Tn() {
      const t2 = this.$i.wt().map((t3) => t3.zn().An()).filter(V), i2 = 0 === t2.length ? null : Math.max(...t2);
      this.sn = null !== i2 ? i2 : NaN;
    }
    Dn(t2, i2, n2) {
      let s2 = t2.get(i2);
      return void 0 === s2 && (s2 = new Q(this, i2, n2), t2.set(i2, s2)), s2;
    }
  }
  function ht(t2) {
    return "left" === t2 || "right" === t2;
  }
  class lt {
    constructor(t2) {
      this.En = /* @__PURE__ */ new Map(), this.In = [], this.Ln = t2;
    }
    Nn(t2, i2) {
      const n2 = function(t3, i3) {
        return void 0 === t3 ? i3 : { Fn: Math.max(t3.Fn, i3.Fn), Wn: t3.Wn || i3.Wn };
      }(this.En.get(t2), i2);
      this.En.set(t2, n2);
    }
    jn() {
      return this.Ln;
    }
    Hn(t2) {
      const i2 = this.En.get(t2);
      return void 0 === i2 ? { Fn: this.Ln } : { Fn: Math.max(this.Ln, i2.Fn), Wn: i2.Wn };
    }
    $n() {
      this.Un(), this.In = [{ qn: 0 }];
    }
    Yn(t2) {
      this.Un(), this.In = [{ qn: 1, Ot: t2 }];
    }
    Zn(t2) {
      this.Xn(), this.In.push({ qn: 5, Ot: t2 });
    }
    Un() {
      this.Xn(), this.In.push({ qn: 6 });
    }
    Kn() {
      this.Un(), this.In = [{ qn: 4 }];
    }
    Gn(t2) {
      this.Un(), this.In.push({ qn: 2, Ot: t2 });
    }
    Jn(t2) {
      this.Un(), this.In.push({ qn: 3, Ot: t2 });
    }
    Qn() {
      return this.In;
    }
    ts(t2) {
      for (const i2 of t2.In) this.ns(i2);
      this.Ln = Math.max(this.Ln, t2.Ln), t2.En.forEach((t3, i2) => {
        this.Nn(i2, t3);
      });
    }
    static ss() {
      return new lt(2);
    }
    static es() {
      return new lt(3);
    }
    ns(t2) {
      switch (t2.qn) {
        case 0:
          this.$n();
          break;
        case 1:
          this.Yn(t2.Ot);
          break;
        case 2:
          this.Gn(t2.Ot);
          break;
        case 3:
          this.Jn(t2.Ot);
          break;
        case 4:
          this.Kn();
          break;
        case 5:
          this.Zn(t2.Ot);
          break;
        case 6:
          this.Xn();
      }
    }
    Xn() {
      const t2 = this.In.findIndex((t3) => 5 === t3.qn);
      -1 !== t2 && this.In.splice(t2, 1);
    }
  }
  const at = ".";
  function ot(t2, i2) {
    if (!P(t2)) return "n/a";
    if (!R(i2)) throw new TypeError("invalid length");
    if (i2 < 0 || i2 > 16) throw new TypeError("invalid length");
    if (0 === i2) return t2.toString();
    return ("0000000000000000" + t2.toString()).slice(-i2);
  }
  class _t {
    constructor(t2, i2) {
      if (i2 || (i2 = 1), P(t2) && R(t2) || (t2 = 100), t2 < 0) throw new TypeError("invalid base");
      this.Ii = t2, this.rs = i2, this.hs();
    }
    format(t2) {
      const i2 = t2 < 0 ? "\u2212" : "";
      return t2 = Math.abs(t2), i2 + this.ls(t2);
    }
    hs() {
      if (this.os = 0, this.Ii > 0 && this.rs > 0) {
        let t2 = this.Ii;
        for (; t2 > 1; ) t2 /= 10, this.os++;
      }
    }
    ls(t2) {
      const i2 = this.Ii / this.rs;
      let n2 = Math.floor(t2), s2 = "";
      const e2 = void 0 !== this.os ? this.os : NaN;
      if (i2 > 1) {
        let r2 = +(Math.round(t2 * i2) - n2 * i2).toFixed(this.os);
        r2 >= i2 && (r2 -= i2, n2 += 1), s2 = at + ot(+r2.toFixed(this.os) * this.rs, e2);
      } else n2 = Math.round(n2 * i2) / i2, e2 > 0 && (s2 = at + ot(0, e2));
      return n2.toFixed(0) + s2;
    }
  }
  class ut extends _t {
    constructor(t2 = 100) {
      super(t2);
    }
    format(t2) {
      return `${super.format(t2)}%`;
    }
  }
  class ct {
    constructor(t2) {
      this._s = t2;
    }
    format(t2) {
      let i2 = "";
      return t2 < 0 && (i2 = "-", t2 = -t2), t2 < 995 ? i2 + this.us(t2) : t2 < 999995 ? i2 + this.us(t2 / 1e3) + "K" : t2 < 999999995 ? (t2 = 1e3 * Math.round(t2 / 1e3), i2 + this.us(t2 / 1e6) + "M") : (t2 = 1e6 * Math.round(t2 / 1e6), i2 + this.us(t2 / 1e9) + "B");
    }
    us(t2) {
      let i2;
      const n2 = Math.pow(10, this._s);
      return i2 = (t2 = Math.round(t2 * n2) / n2) >= 1e-15 && t2 < 1 ? t2.toFixed(this._s).replace(/\.?0+$/, "") : String(t2), i2.replace(/(\.[1-9]*)0+$/, (t3, i3) => i3);
    }
  }
  function dt(t2, i2, n2, s2, e2, r2, h2) {
    if (0 === i2.length || s2.from >= i2.length || s2.to <= 0) return;
    const { context: l2, horizontalPixelRatio: a2, verticalPixelRatio: o2 } = t2, _2 = i2[s2.from];
    let u2 = r2(t2, _2), c2 = _2;
    if (s2.to - s2.from < 2) {
      const i3 = e2 / 2;
      l2.beginPath();
      const n3 = { nt: _2.nt - i3, st: _2.st }, s3 = { nt: _2.nt + i3, st: _2.st };
      l2.moveTo(n3.nt * a2, n3.st * o2), l2.lineTo(s3.nt * a2, s3.st * o2), h2(t2, u2, n3, s3);
    } else {
      const e3 = (i3, n3) => {
        h2(t2, u2, c2, n3), l2.beginPath(), u2 = i3, c2 = n3;
      };
      let d2 = c2;
      l2.beginPath(), l2.moveTo(_2.nt * a2, _2.st * o2);
      for (let h3 = s2.from + 1; h3 < s2.to; ++h3) {
        d2 = i2[h3];
        const s3 = r2(t2, d2);
        switch (n2) {
          case 0:
            l2.lineTo(d2.nt * a2, d2.st * o2);
            break;
          case 1:
            l2.lineTo(d2.nt * a2, i2[h3 - 1].st * o2), s3 !== u2 && (e3(s3, d2), l2.lineTo(d2.nt * a2, i2[h3 - 1].st * o2)), l2.lineTo(d2.nt * a2, d2.st * o2);
            break;
          case 2: {
            const [t3, n3] = mt(i2, h3 - 1, h3);
            l2.bezierCurveTo(t3.nt * a2, t3.st * o2, n3.nt * a2, n3.st * o2, d2.nt * a2, d2.st * o2);
            break;
          }
        }
        1 !== n2 && s3 !== u2 && (e3(s3, d2), l2.moveTo(d2.nt * a2, d2.st * o2));
      }
      (c2 !== d2 || c2 === d2 && 1 === n2) && h2(t2, u2, c2, d2);
    }
  }
  const ft = 6;
  function vt(t2, i2) {
    return { nt: t2.nt - i2.nt, st: t2.st - i2.st };
  }
  function pt(t2, i2) {
    return { nt: t2.nt / i2, st: t2.st / i2 };
  }
  function mt(t2, i2, n2) {
    const s2 = Math.max(0, i2 - 1), e2 = Math.min(t2.length - 1, n2 + 1);
    var r2, h2;
    return [(r2 = t2[i2], h2 = pt(vt(t2[n2], t2[s2]), ft), { nt: r2.nt + h2.nt, st: r2.st + h2.st }), vt(t2[n2], pt(vt(t2[e2], t2[i2]), ft))];
  }
  function bt(t2, i2, n2, s2, e2) {
    const { context: r2, horizontalPixelRatio: h2, verticalPixelRatio: l2 } = i2;
    r2.lineTo(e2.nt * h2, t2 * l2), r2.lineTo(s2.nt * h2, t2 * l2), r2.closePath(), r2.fillStyle = n2, r2.fill();
  }
  class wt extends N {
    constructor() {
      super(...arguments), this.G = null;
    }
    J(t2) {
      this.G = t2;
    }
    K(t2) {
      var i2;
      if (null === this.G) return;
      const { it: n2, tt: s2, cs: e2, et: r2, Nt: h2, ds: l2 } = this.G, a2 = null !== (i2 = this.G.fs) && void 0 !== i2 ? i2 : this.G.vs ? 0 : t2.mediaSize.height;
      if (null === s2) return;
      const o2 = t2.context;
      o2.lineCap = "butt", o2.lineJoin = "round", o2.lineWidth = r2, _(o2, h2), o2.lineWidth = 1, dt(t2, n2, l2, s2, e2, this.ps.bind(this), bt.bind(null, a2));
    }
  }
  function gt(t2, i2, n2) {
    return Math.min(Math.max(t2, i2), n2);
  }
  function Mt(t2, i2, n2) {
    return i2 - t2 <= n2;
  }
  function xt(t2) {
    const i2 = Math.ceil(t2);
    return i2 % 2 == 0 ? i2 - 1 : i2;
  }
  class St {
    bs(t2, i2) {
      const n2 = this.ws, { gs: s2, Ms: e2, xs: r2, Ss: h2, ks: l2, fs: a2 } = i2;
      if (void 0 === this.ys || void 0 === n2 || n2.gs !== s2 || n2.Ms !== e2 || n2.xs !== r2 || n2.Ss !== h2 || n2.fs !== a2 || n2.ks !== l2) {
        const n3 = t2.context.createLinearGradient(0, 0, 0, l2);
        if (n3.addColorStop(0, s2), null != a2) {
          const i3 = gt(a2 * t2.verticalPixelRatio / l2, 0, 1);
          n3.addColorStop(i3, e2), n3.addColorStop(i3, r2);
        }
        n3.addColorStop(1, h2), this.ys = n3, this.ws = i2;
      }
      return this.ys;
    }
  }
  class kt extends wt {
    constructor() {
      super(...arguments), this.Cs = new St();
    }
    ps(t2, i2) {
      return this.Cs.bs(t2, { gs: i2.Ts, Ms: "", xs: "", Ss: i2.Ps, ks: t2.bitmapSize.height });
    }
  }
  function yt(t2, i2) {
    const n2 = t2.context;
    n2.strokeStyle = i2, n2.stroke();
  }
  class Ct extends N {
    constructor() {
      super(...arguments), this.G = null;
    }
    J(t2) {
      this.G = t2;
    }
    K(t2) {
      if (null === this.G) return;
      const { it: i2, tt: n2, cs: s2, ds: e2, et: r2, Nt: h2, Rs: l2 } = this.G;
      if (null === n2) return;
      const a2 = t2.context;
      a2.lineCap = "butt", a2.lineWidth = r2 * t2.verticalPixelRatio, _(a2, h2), a2.lineJoin = "round";
      const o2 = this.Ds.bind(this);
      void 0 !== e2 && dt(t2, i2, e2, n2, s2, o2, yt), l2 && function(t3, i3, n3, s3, e3) {
        const { horizontalPixelRatio: r3, verticalPixelRatio: h3, context: l3 } = t3;
        let a3 = null;
        const o3 = Math.max(1, Math.floor(r3)) % 2 / 2, _2 = n3 * h3 + o3;
        for (let n4 = s3.to - 1; n4 >= s3.from; --n4) {
          const s4 = i3[n4];
          if (s4) {
            const i4 = e3(t3, s4);
            i4 !== a3 && (l3.beginPath(), null !== a3 && l3.fill(), l3.fillStyle = i4, a3 = i4);
            const n5 = Math.round(s4.nt * r3) + o3, u2 = s4.st * h3;
            l3.moveTo(n5, u2), l3.arc(n5, u2, _2, 0, 2 * Math.PI);
          }
        }
        l3.fill();
      }(t2, i2, l2, n2, o2);
    }
  }
  class Tt extends Ct {
    Ds(t2, i2) {
      return i2.lt;
    }
  }
  function Pt(t2, i2, n2, s2, e2 = 0, r2 = i2.length) {
    let h2 = r2 - e2;
    for (; 0 < h2; ) {
      const r3 = h2 >> 1, l2 = e2 + r3;
      s2(i2[l2], n2) === t2 ? (e2 = l2 + 1, h2 -= r3 + 1) : h2 = r3;
    }
    return e2;
  }
  const Rt = Pt.bind(null, true), Dt = Pt.bind(null, false);
  function Ot(t2, i2) {
    return t2.ot < i2;
  }
  function Bt(t2, i2) {
    return i2 < t2.ot;
  }
  function Vt(t2, i2, n2) {
    const s2 = i2.Os(), e2 = i2.ui(), r2 = Rt(t2, s2, Ot), h2 = Dt(t2, e2, Bt);
    if (!n2) return { from: r2, to: h2 };
    let l2 = r2, a2 = h2;
    return r2 > 0 && r2 < t2.length && t2[r2].ot >= s2 && (l2 = r2 - 1), h2 > 0 && h2 < t2.length && t2[h2 - 1].ot <= e2 && (a2 = h2 + 1), { from: l2, to: a2 };
  }
  class At {
    constructor(t2, i2, n2) {
      this.Bs = true, this.Vs = true, this.As = true, this.zs = [], this.Es = null, this.Is = t2, this.Ls = i2, this.Ns = n2;
    }
    bt(t2) {
      this.Bs = true, "data" === t2 && (this.Vs = true), "options" === t2 && (this.As = true);
    }
    gt() {
      return this.Is.yt() ? (this.Fs(), null === this.Es ? null : this.Ws) : null;
    }
    js() {
      this.zs = this.zs.map((t2) => Object.assign(Object.assign({}, t2), this.Is.$s().Hs(t2.ot)));
    }
    Us() {
      this.Es = null;
    }
    Fs() {
      this.Vs && (this.qs(), this.Vs = false), this.As && (this.js(), this.As = false), this.Bs && (this.Ys(), this.Bs = false);
    }
    Ys() {
      const t2 = this.Is.Dt(), i2 = this.Ls.St();
      if (this.Us(), i2.Ni() || t2.Ni()) return;
      const n2 = i2.Zs();
      if (null === n2) return;
      if (0 === this.Is.zn().Xs()) return;
      const s2 = this.Is.Ct();
      null !== s2 && (this.Es = Vt(this.zs, n2, this.Ns), this.Ks(t2, i2, s2.Ot), this.Gs());
    }
  }
  class zt extends At {
    constructor(t2, i2) {
      super(t2, i2, true);
    }
    Ks(t2, i2, n2) {
      i2.Js(this.zs, A(this.Es)), t2.Qs(this.zs, n2, A(this.Es));
    }
    te(t2, i2) {
      return { ot: t2, _t: i2, nt: NaN, st: NaN };
    }
    qs() {
      const t2 = this.Is.$s();
      this.zs = this.Is.zn().ie().map((i2) => {
        const n2 = i2.Ot[3];
        return this.ne(i2.se, n2, t2);
      });
    }
  }
  class Et extends zt {
    constructor(t2, i2) {
      super(t2, i2), this.Ws = new L(), this.ee = new kt(), this.re = new Tt(), this.Ws.Z([this.ee, this.re]);
    }
    ne(t2, i2, n2) {
      return Object.assign(Object.assign({}, this.te(t2, i2)), n2.Hs(t2));
    }
    Gs() {
      const t2 = this.Is.W();
      this.ee.J({ ds: t2.lineType, it: this.zs, Nt: t2.lineStyle, et: t2.lineWidth, fs: null, vs: t2.invertFilledArea, tt: this.Es, cs: this.Ls.St().he() }), this.re.J({ ds: t2.lineVisible ? t2.lineType : void 0, it: this.zs, Nt: t2.lineStyle, et: t2.lineWidth, tt: this.Es, cs: this.Ls.St().he(), Rs: t2.pointMarkersVisible ? t2.pointMarkersRadius || t2.lineWidth / 2 + 2 : void 0 });
    }
  }
  class It extends N {
    constructor() {
      super(...arguments), this.Et = null, this.le = 0, this.ae = 0;
    }
    J(t2) {
      this.Et = t2;
    }
    K({ context: t2, horizontalPixelRatio: i2, verticalPixelRatio: n2 }) {
      if (null === this.Et || 0 === this.Et.zn.length || null === this.Et.tt) return;
      if (this.le = this.oe(i2), this.le >= 2) {
        Math.max(1, Math.floor(i2)) % 2 != this.le % 2 && this.le--;
      }
      this.ae = this.Et._e ? Math.min(this.le, Math.floor(i2)) : this.le;
      let s2 = null;
      const e2 = this.ae <= this.le && this.Et.he >= Math.floor(1.5 * i2);
      for (let r2 = this.Et.tt.from; r2 < this.Et.tt.to; ++r2) {
        const h2 = this.Et.zn[r2];
        s2 !== h2.ue && (t2.fillStyle = h2.ue, s2 = h2.ue);
        const l2 = Math.floor(0.5 * this.ae), a2 = Math.round(h2.nt * i2), o2 = a2 - l2, _2 = this.ae, u2 = o2 + _2 - 1, c2 = Math.min(h2.ce, h2.de), d2 = Math.max(h2.ce, h2.de), f2 = Math.round(c2 * n2) - l2, v2 = Math.round(d2 * n2) + l2, p2 = Math.max(v2 - f2, this.ae);
        t2.fillRect(o2, f2, _2, p2);
        const m2 = Math.ceil(1.5 * this.le);
        if (e2) {
          if (this.Et.fe) {
            const i4 = a2 - m2;
            let s4 = Math.max(f2, Math.round(h2.ve * n2) - l2), e4 = s4 + _2 - 1;
            e4 > f2 + p2 - 1 && (e4 = f2 + p2 - 1, s4 = e4 - _2 + 1), t2.fillRect(i4, s4, o2 - i4, e4 - s4 + 1);
          }
          const i3 = a2 + m2;
          let s3 = Math.max(f2, Math.round(h2.pe * n2) - l2), e3 = s3 + _2 - 1;
          e3 > f2 + p2 - 1 && (e3 = f2 + p2 - 1, s3 = e3 - _2 + 1), t2.fillRect(u2 + 1, s3, i3 - u2, e3 - s3 + 1);
        }
      }
    }
    oe(t2) {
      const i2 = Math.floor(t2);
      return Math.max(i2, Math.floor(function(t3, i3) {
        return Math.floor(0.3 * t3 * i3);
      }(f(this.Et).he, t2)));
    }
  }
  class Lt extends At {
    constructor(t2, i2) {
      super(t2, i2, false);
    }
    Ks(t2, i2, n2) {
      i2.Js(this.zs, A(this.Es)), t2.me(this.zs, n2, A(this.Es));
    }
    be(t2, i2, n2) {
      return { ot: t2, we: i2.Ot[0], ge: i2.Ot[1], Me: i2.Ot[2], xe: i2.Ot[3], nt: NaN, ve: NaN, ce: NaN, de: NaN, pe: NaN };
    }
    qs() {
      const t2 = this.Is.$s();
      this.zs = this.Is.zn().ie().map((i2) => this.ne(i2.se, i2, t2));
    }
  }
  class Nt extends Lt {
    constructor() {
      super(...arguments), this.Ws = new It();
    }
    ne(t2, i2, n2) {
      return Object.assign(Object.assign({}, this.be(t2, i2, n2)), n2.Hs(t2));
    }
    Gs() {
      const t2 = this.Is.W();
      this.Ws.J({ zn: this.zs, he: this.Ls.St().he(), fe: t2.openVisible, _e: t2.thinBars, tt: this.Es });
    }
  }
  class Ft extends wt {
    constructor() {
      super(...arguments), this.Cs = new St();
    }
    ps(t2, i2) {
      const n2 = this.G;
      return this.Cs.bs(t2, { gs: i2.Se, Ms: i2.ke, xs: i2.ye, Ss: i2.Ce, ks: t2.bitmapSize.height, fs: n2.fs });
    }
  }
  class Wt extends Ct {
    constructor() {
      super(...arguments), this.Te = new St();
    }
    Ds(t2, i2) {
      const n2 = this.G;
      return this.Te.bs(t2, { gs: i2.Pe, Ms: i2.Pe, xs: i2.Re, Ss: i2.Re, ks: t2.bitmapSize.height, fs: n2.fs });
    }
  }
  class jt extends zt {
    constructor(t2, i2) {
      super(t2, i2), this.Ws = new L(), this.De = new Ft(), this.Oe = new Wt(), this.Ws.Z([this.De, this.Oe]);
    }
    ne(t2, i2, n2) {
      return Object.assign(Object.assign({}, this.te(t2, i2)), n2.Hs(t2));
    }
    Gs() {
      const t2 = this.Is.Ct();
      if (null === t2) return;
      const i2 = this.Is.W(), n2 = this.Is.Dt().Rt(i2.baseValue.price, t2.Ot), s2 = this.Ls.St().he();
      this.De.J({ it: this.zs, et: i2.lineWidth, Nt: i2.lineStyle, ds: i2.lineType, fs: n2, vs: false, tt: this.Es, cs: s2 }), this.Oe.J({ it: this.zs, et: i2.lineWidth, Nt: i2.lineStyle, ds: i2.lineVisible ? i2.lineType : void 0, Rs: i2.pointMarkersVisible ? i2.pointMarkersRadius || i2.lineWidth / 2 + 2 : void 0, fs: n2, tt: this.Es, cs: s2 });
    }
  }
  class Ht extends N {
    constructor() {
      super(...arguments), this.Et = null, this.le = 0;
    }
    J(t2) {
      this.Et = t2;
    }
    K(t2) {
      if (null === this.Et || 0 === this.Et.zn.length || null === this.Et.tt) return;
      const { horizontalPixelRatio: i2 } = t2;
      if (this.le = function(t3, i3) {
        if (t3 >= 2.5 && t3 <= 4) return Math.floor(3 * i3);
        const n3 = 1 - 0.2 * Math.atan(Math.max(4, t3) - 4) / (0.5 * Math.PI), s3 = Math.floor(t3 * n3 * i3), e2 = Math.floor(t3 * i3), r2 = Math.min(s3, e2);
        return Math.max(Math.floor(i3), r2);
      }(this.Et.he, i2), this.le >= 2) {
        Math.floor(i2) % 2 != this.le % 2 && this.le--;
      }
      const n2 = this.Et.zn;
      this.Et.Be && this.Ve(t2, n2, this.Et.tt), this.Et._i && this.Ae(t2, n2, this.Et.tt);
      const s2 = this.ze(i2);
      (!this.Et._i || this.le > 2 * s2) && this.Ee(t2, n2, this.Et.tt);
    }
    Ve(t2, i2, n2) {
      if (null === this.Et) return;
      const { context: s2, horizontalPixelRatio: e2, verticalPixelRatio: r2 } = t2;
      let h2 = "", l2 = Math.min(Math.floor(e2), Math.floor(this.Et.he * e2));
      l2 = Math.max(Math.floor(e2), Math.min(l2, this.le));
      const a2 = Math.floor(0.5 * l2);
      let o2 = null;
      for (let t3 = n2.from; t3 < n2.to; t3++) {
        const n3 = i2[t3];
        n3.Ie !== h2 && (s2.fillStyle = n3.Ie, h2 = n3.Ie);
        const _2 = Math.round(Math.min(n3.ve, n3.pe) * r2), u2 = Math.round(Math.max(n3.ve, n3.pe) * r2), c2 = Math.round(n3.ce * r2), d2 = Math.round(n3.de * r2);
        let f2 = Math.round(e2 * n3.nt) - a2;
        const v2 = f2 + l2 - 1;
        null !== o2 && (f2 = Math.max(o2 + 1, f2), f2 = Math.min(f2, v2));
        const p2 = v2 - f2 + 1;
        s2.fillRect(f2, c2, p2, _2 - c2), s2.fillRect(f2, u2 + 1, p2, d2 - u2), o2 = v2;
      }
    }
    ze(t2) {
      let i2 = Math.floor(1 * t2);
      this.le <= 2 * i2 && (i2 = Math.floor(0.5 * (this.le - 1)));
      const n2 = Math.max(Math.floor(t2), i2);
      return this.le <= 2 * n2 ? Math.max(Math.floor(t2), Math.floor(1 * t2)) : n2;
    }
    Ae(t2, i2, n2) {
      if (null === this.Et) return;
      const { context: s2, horizontalPixelRatio: e2, verticalPixelRatio: r2 } = t2;
      let h2 = "";
      const l2 = this.ze(e2);
      let a2 = null;
      for (let t3 = n2.from; t3 < n2.to; t3++) {
        const n3 = i2[t3];
        n3.Le !== h2 && (s2.fillStyle = n3.Le, h2 = n3.Le);
        let o2 = Math.round(n3.nt * e2) - Math.floor(0.5 * this.le);
        const _2 = o2 + this.le - 1, u2 = Math.round(Math.min(n3.ve, n3.pe) * r2), c2 = Math.round(Math.max(n3.ve, n3.pe) * r2);
        if (null !== a2 && (o2 = Math.max(a2 + 1, o2), o2 = Math.min(o2, _2)), this.Et.he * e2 > 2 * l2) q(s2, o2, u2, _2 - o2 + 1, c2 - u2 + 1, l2);
        else {
          const t4 = _2 - o2 + 1;
          s2.fillRect(o2, u2, t4, c2 - u2 + 1);
        }
        a2 = _2;
      }
    }
    Ee(t2, i2, n2) {
      if (null === this.Et) return;
      const { context: s2, horizontalPixelRatio: e2, verticalPixelRatio: r2 } = t2;
      let h2 = "";
      const l2 = this.ze(e2);
      for (let t3 = n2.from; t3 < n2.to; t3++) {
        const n3 = i2[t3];
        let a2 = Math.round(Math.min(n3.ve, n3.pe) * r2), o2 = Math.round(Math.max(n3.ve, n3.pe) * r2), _2 = Math.round(n3.nt * e2) - Math.floor(0.5 * this.le), u2 = _2 + this.le - 1;
        if (n3.ue !== h2) {
          const t4 = n3.ue;
          s2.fillStyle = t4, h2 = t4;
        }
        this.Et._i && (_2 += l2, a2 += l2, u2 -= l2, o2 -= l2), a2 > o2 || s2.fillRect(_2, a2, u2 - _2 + 1, o2 - a2 + 1);
      }
    }
  }
  class $t extends Lt {
    constructor() {
      super(...arguments), this.Ws = new Ht();
    }
    ne(t2, i2, n2) {
      return Object.assign(Object.assign({}, this.be(t2, i2, n2)), n2.Hs(t2));
    }
    Gs() {
      const t2 = this.Is.W();
      this.Ws.J({ zn: this.zs, he: this.Ls.St().he(), Be: t2.wickVisible, _i: t2.borderVisible, tt: this.Es });
    }
  }
  class Ut {
    constructor(t2, i2) {
      this.Ne = t2, this.Ii = i2;
    }
    X(t2, i2, n2) {
      this.Ne.draw(t2, this.Ii, i2, n2);
    }
  }
  class qt extends At {
    constructor(t2, i2, n2) {
      super(t2, i2, false), this.wn = n2, this.Ws = new Ut(this.wn.renderer(), (i3) => {
        const n3 = t2.Ct();
        return null === n3 ? null : t2.Dt().Rt(i3, n3.Ot);
      });
    }
    Fe(t2) {
      return this.wn.priceValueBuilder(t2);
    }
    We(t2) {
      return this.wn.isWhitespace(t2);
    }
    qs() {
      const t2 = this.Is.$s();
      this.zs = this.Is.zn().ie().map((i2) => Object.assign(Object.assign({ ot: i2.se, nt: NaN }, t2.Hs(i2.se)), { je: i2.He }));
    }
    Ks(t2, i2) {
      i2.Js(this.zs, A(this.Es));
    }
    Gs() {
      this.wn.update({ bars: this.zs.map(Yt), barSpacing: this.Ls.St().he(), visibleRange: this.Es }, this.Is.W());
    }
  }
  function Yt(t2) {
    return { x: t2.nt, time: t2.ot, originalData: t2.je, barColor: t2.ue };
  }
  class Zt extends N {
    constructor() {
      super(...arguments), this.Et = null, this.$e = [];
    }
    J(t2) {
      this.Et = t2, this.$e = [];
    }
    K({ context: t2, horizontalPixelRatio: i2, verticalPixelRatio: n2 }) {
      if (null === this.Et || 0 === this.Et.it.length || null === this.Et.tt) return;
      this.$e.length || this.Ue(i2);
      const s2 = Math.max(1, Math.floor(n2)), e2 = Math.round(this.Et.qe * n2) - Math.floor(s2 / 2), r2 = e2 + s2;
      for (let i3 = this.Et.tt.from; i3 < this.Et.tt.to; i3++) {
        const h2 = this.Et.it[i3], l2 = this.$e[i3 - this.Et.tt.from], a2 = Math.round(h2.st * n2);
        let o2, _2;
        t2.fillStyle = h2.ue, a2 <= e2 ? (o2 = a2, _2 = r2) : (o2 = e2, _2 = a2 - Math.floor(s2 / 2) + s2), t2.fillRect(l2.Os, o2, l2.ui - l2.Os + 1, _2 - o2);
      }
    }
    Ue(t2) {
      if (null === this.Et || 0 === this.Et.it.length || null === this.Et.tt) return void (this.$e = []);
      const i2 = Math.ceil(this.Et.he * t2) <= 1 ? 0 : Math.max(1, Math.floor(t2)), n2 = Math.round(this.Et.he * t2) - i2;
      this.$e = new Array(this.Et.tt.to - this.Et.tt.from);
      for (let i3 = this.Et.tt.from; i3 < this.Et.tt.to; i3++) {
        const s3 = this.Et.it[i3], e2 = Math.round(s3.nt * t2);
        let r2, h2;
        if (n2 % 2) {
          const t3 = (n2 - 1) / 2;
          r2 = e2 - t3, h2 = e2 + t3;
        } else {
          const t3 = n2 / 2;
          r2 = e2 - t3, h2 = e2 + t3 - 1;
        }
        this.$e[i3 - this.Et.tt.from] = { Os: r2, ui: h2, Ye: e2, Ze: s3.nt * t2, ot: s3.ot };
      }
      for (let t3 = this.Et.tt.from + 1; t3 < this.Et.tt.to; t3++) {
        const n3 = this.$e[t3 - this.Et.tt.from], s3 = this.$e[t3 - this.Et.tt.from - 1];
        n3.ot === s3.ot + 1 && (n3.Os - s3.ui !== i2 + 1 && (s3.Ye > s3.Ze ? s3.ui = n3.Os - i2 - 1 : n3.Os = s3.ui + i2 + 1));
      }
      let s2 = Math.ceil(this.Et.he * t2);
      for (let t3 = this.Et.tt.from; t3 < this.Et.tt.to; t3++) {
        const i3 = this.$e[t3 - this.Et.tt.from];
        i3.ui < i3.Os && (i3.ui = i3.Os);
        const n3 = i3.ui - i3.Os + 1;
        s2 = Math.min(n3, s2);
      }
      if (i2 > 0 && s2 < 4) for (let t3 = this.Et.tt.from; t3 < this.Et.tt.to; t3++) {
        const i3 = this.$e[t3 - this.Et.tt.from];
        i3.ui - i3.Os + 1 > s2 && (i3.Ye > i3.Ze ? i3.ui -= 1 : i3.Os += 1);
      }
    }
  }
  class Xt extends zt {
    constructor() {
      super(...arguments), this.Ws = new Zt();
    }
    ne(t2, i2, n2) {
      return Object.assign(Object.assign({}, this.te(t2, i2)), n2.Hs(t2));
    }
    Gs() {
      const t2 = { it: this.zs, he: this.Ls.St().he(), tt: this.Es, qe: this.Is.Dt().Rt(this.Is.W().base, f(this.Is.Ct()).Ot) };
      this.Ws.J(t2);
    }
  }
  class Kt extends zt {
    constructor() {
      super(...arguments), this.Ws = new Tt();
    }
    ne(t2, i2, n2) {
      return Object.assign(Object.assign({}, this.te(t2, i2)), n2.Hs(t2));
    }
    Gs() {
      const t2 = this.Is.W(), i2 = { it: this.zs, Nt: t2.lineStyle, ds: t2.lineVisible ? t2.lineType : void 0, et: t2.lineWidth, Rs: t2.pointMarkersVisible ? t2.pointMarkersRadius || t2.lineWidth / 2 + 2 : void 0, tt: this.Es, cs: this.Ls.St().he() };
      this.Ws.J(i2);
    }
  }
  const Gt = /[2-9]/g;
  class Jt {
    constructor(t2 = 50) {
      this.Xe = 0, this.Ke = 1, this.Ge = 1, this.Je = {}, this.Qe = /* @__PURE__ */ new Map(), this.tr = t2;
    }
    ir() {
      this.Xe = 0, this.Qe.clear(), this.Ke = 1, this.Ge = 1, this.Je = {};
    }
    xi(t2, i2, n2) {
      return this.nr(t2, i2, n2).width;
    }
    Mi(t2, i2, n2) {
      const s2 = this.nr(t2, i2, n2);
      return ((s2.actualBoundingBoxAscent || 0) - (s2.actualBoundingBoxDescent || 0)) / 2;
    }
    nr(t2, i2, n2) {
      const s2 = n2 || Gt, e2 = String(i2).replace(s2, "0");
      if (this.Qe.has(e2)) return d(this.Qe.get(e2)).sr;
      if (this.Xe === this.tr) {
        const t3 = this.Je[this.Ge];
        delete this.Je[this.Ge], this.Qe.delete(t3), this.Ge++, this.Xe--;
      }
      t2.save(), t2.textBaseline = "middle";
      const r2 = t2.measureText(e2);
      return t2.restore(), 0 === r2.width && i2.length || (this.Qe.set(e2, { sr: r2, er: this.Ke }), this.Je[this.Ke] = e2, this.Xe++, this.Ke++), r2;
    }
  }
  class Qt {
    constructor(t2) {
      this.rr = null, this.k = null, this.hr = "right", this.lr = t2;
    }
    ar(t2, i2, n2) {
      this.rr = t2, this.k = i2, this.hr = n2;
    }
    X(t2) {
      null !== this.k && null !== this.rr && this.rr.X(t2, this.k, this.lr, this.hr);
    }
  }
  class ti {
    constructor(t2, i2, n2) {
      this._r = t2, this.lr = new Jt(50), this.ur = i2, this.F = n2, this.j = -1, this.Wt = new Qt(this.lr);
    }
    gt() {
      const t2 = this.F.cr(this.ur);
      if (null === t2) return null;
      const i2 = t2.dr(this.ur) ? t2.vr() : this.ur.Dt();
      if (null === i2) return null;
      const n2 = t2.pr(i2);
      if ("overlay" === n2) return null;
      const s2 = this.F.mr();
      return s2.P !== this.j && (this.j = s2.P, this.lr.ir()), this.Wt.ar(this._r.zi(), s2, n2), this.Wt;
    }
  }
  class ii extends N {
    constructor() {
      super(...arguments), this.Et = null;
    }
    J(t2) {
      this.Et = t2;
    }
    br(t2, i2) {
      var n2;
      if (!(null === (n2 = this.Et) || void 0 === n2 ? void 0 : n2.yt)) return null;
      const { st: s2, et: e2, wr: r2 } = this.Et;
      return i2 >= s2 - e2 - 7 && i2 <= s2 + e2 + 7 ? { gr: this.Et, wr: r2 } : null;
    }
    K({ context: t2, bitmapSize: i2, horizontalPixelRatio: n2, verticalPixelRatio: s2 }) {
      if (null === this.Et) return;
      if (false === this.Et.yt) return;
      const e2 = Math.round(this.Et.st * s2);
      e2 < 0 || e2 > i2.height || (t2.lineCap = "butt", t2.strokeStyle = this.Et.O, t2.lineWidth = Math.floor(this.Et.et * n2), _(t2, this.Et.Nt), u(t2, e2, 0, i2.width));
    }
  }
  class ni {
    constructor(t2) {
      this.Mr = { st: 0, O: "rgba(0, 0, 0, 0)", et: 1, Nt: 0, yt: false }, this.Sr = new ii(), this.ft = true, this.Is = t2, this.Ls = t2.$t(), this.Sr.J(this.Mr);
    }
    bt() {
      this.ft = true;
    }
    gt() {
      return this.Is.yt() ? (this.ft && (this.kr(), this.ft = false), this.Sr) : null;
    }
  }
  class si extends ni {
    constructor(t2) {
      super(t2);
    }
    kr() {
      this.Mr.yt = false;
      const t2 = this.Is.Dt(), i2 = t2.yr().yr;
      if (2 !== i2 && 3 !== i2) return;
      const n2 = this.Is.W();
      if (!n2.baseLineVisible || !this.Is.yt()) return;
      const s2 = this.Is.Ct();
      null !== s2 && (this.Mr.yt = true, this.Mr.st = t2.Rt(s2.Ot, s2.Ot), this.Mr.O = n2.baseLineColor, this.Mr.et = n2.baseLineWidth, this.Mr.Nt = n2.baseLineStyle);
    }
  }
  class ei extends N {
    constructor() {
      super(...arguments), this.Et = null;
    }
    J(t2) {
      this.Et = t2;
    }
    He() {
      return this.Et;
    }
    K({ context: t2, horizontalPixelRatio: i2, verticalPixelRatio: n2 }) {
      const s2 = this.Et;
      if (null === s2) return;
      const e2 = Math.max(1, Math.floor(i2)), r2 = e2 % 2 / 2, h2 = Math.round(s2.Ze.x * i2) + r2, l2 = s2.Ze.y * n2;
      t2.fillStyle = s2.Cr, t2.beginPath();
      const a2 = Math.max(2, 1.5 * s2.Tr) * i2;
      t2.arc(h2, l2, a2, 0, 2 * Math.PI, false), t2.fill(), t2.fillStyle = s2.Pr, t2.beginPath(), t2.arc(h2, l2, s2.ht * i2, 0, 2 * Math.PI, false), t2.fill(), t2.lineWidth = e2, t2.strokeStyle = s2.Rr, t2.beginPath(), t2.arc(h2, l2, s2.ht * i2 + e2 / 2, 0, 2 * Math.PI, false), t2.stroke();
    }
  }
  const ri = [{ Dr: 0, Or: 0.25, Br: 4, Vr: 10, Ar: 0.25, zr: 0, Er: 0.4, Ir: 0.8 }, { Dr: 0.25, Or: 0.525, Br: 10, Vr: 14, Ar: 0, zr: 0, Er: 0.8, Ir: 0 }, { Dr: 0.525, Or: 1, Br: 14, Vr: 14, Ar: 0, zr: 0, Er: 0, Ir: 0 }];
  function hi(t2, i2, n2, s2) {
    return function(t3, i3) {
      if ("transparent" === t3) return t3;
      const n3 = S(t3), s3 = n3[3];
      return `rgba(${n3[0]}, ${n3[1]}, ${n3[2]}, ${i3 * s3})`;
    }(t2, n2 + (s2 - n2) * i2);
  }
  function li(t2, i2) {
    const n2 = t2 % 2600 / 2600;
    let s2;
    for (const t3 of ri) if (n2 >= t3.Dr && n2 <= t3.Or) {
      s2 = t3;
      break;
    }
    c(void 0 !== s2, "Last price animation internal logic error");
    const e2 = (n2 - s2.Dr) / (s2.Or - s2.Dr);
    return { Pr: hi(i2, e2, s2.Ar, s2.zr), Rr: hi(i2, e2, s2.Er, s2.Ir), ht: (r2 = e2, h2 = s2.Br, l2 = s2.Vr, h2 + (l2 - h2) * r2) };
    var r2, h2, l2;
  }
  class ai {
    constructor(t2) {
      this.Wt = new ei(), this.ft = true, this.Lr = true, this.Nr = performance.now(), this.Fr = this.Nr - 1, this.Wr = t2;
    }
    jr() {
      this.Fr = this.Nr - 1, this.bt();
    }
    Hr() {
      if (this.bt(), 2 === this.Wr.W().lastPriceAnimation) {
        const t2 = performance.now(), i2 = this.Fr - t2;
        if (i2 > 0) return void (i2 < 650 && (this.Fr += 2600));
        this.Nr = t2, this.Fr = t2 + 2600;
      }
    }
    bt() {
      this.ft = true;
    }
    $r() {
      this.Lr = true;
    }
    yt() {
      return 0 !== this.Wr.W().lastPriceAnimation;
    }
    Ur() {
      switch (this.Wr.W().lastPriceAnimation) {
        case 0:
          return false;
        case 1:
          return true;
        case 2:
          return performance.now() <= this.Fr;
      }
    }
    gt() {
      return this.ft ? (this.Mt(), this.ft = false, this.Lr = false) : this.Lr && (this.qr(), this.Lr = false), this.Wt;
    }
    Mt() {
      this.Wt.J(null);
      const t2 = this.Wr.$t().St(), i2 = t2.Zs(), n2 = this.Wr.Ct();
      if (null === i2 || null === n2) return;
      const s2 = this.Wr.Yr(true);
      if (s2.Zr || !i2.Xr(s2.se)) return;
      const e2 = { x: t2.zt(s2.se), y: this.Wr.Dt().Rt(s2._t, n2.Ot) }, r2 = s2.O, h2 = this.Wr.W().lineWidth, l2 = li(this.Kr(), r2);
      this.Wt.J({ Cr: r2, Tr: h2, Pr: l2.Pr, Rr: l2.Rr, ht: l2.ht, Ze: e2 });
    }
    qr() {
      const t2 = this.Wt.He();
      if (null !== t2) {
        const i2 = li(this.Kr(), t2.Cr);
        t2.Pr = i2.Pr, t2.Rr = i2.Rr, t2.ht = i2.ht;
      }
    }
    Kr() {
      return this.Ur() ? performance.now() - this.Nr : 2599;
    }
  }
  function oi(t2, i2) {
    return xt(Math.min(Math.max(t2, 12), 30) * i2);
  }
  function _i(t2, i2) {
    switch (t2) {
      case "arrowDown":
      case "arrowUp":
        return oi(i2, 1);
      case "circle":
        return oi(i2, 0.8);
      case "square":
        return oi(i2, 0.7);
    }
  }
  function ui(t2) {
    return function(t3) {
      const i2 = Math.ceil(t3);
      return i2 % 2 != 0 ? i2 - 1 : i2;
    }(oi(t2, 1));
  }
  function ci(t2) {
    return Math.max(oi(t2, 0.1), 3);
  }
  function di(t2, i2, n2) {
    return i2 ? t2 : n2 ? Math.ceil(t2 / 2) : 0;
  }
  function fi(t2, i2, n2, s2, e2) {
    const r2 = _i("square", n2), h2 = (r2 - 1) / 2, l2 = t2 - h2, a2 = i2 - h2;
    return s2 >= l2 && s2 <= l2 + r2 && e2 >= a2 && e2 <= a2 + r2;
  }
  function vi(t2, i2, n2, s2) {
    const e2 = (_i("arrowUp", s2) - 1) / 2 * n2.Gr, r2 = (xt(s2 / 2) - 1) / 2 * n2.Gr;
    i2.beginPath(), t2 ? (i2.moveTo(n2.nt - e2, n2.st), i2.lineTo(n2.nt, n2.st - e2), i2.lineTo(n2.nt + e2, n2.st), i2.lineTo(n2.nt + r2, n2.st), i2.lineTo(n2.nt + r2, n2.st + e2), i2.lineTo(n2.nt - r2, n2.st + e2), i2.lineTo(n2.nt - r2, n2.st)) : (i2.moveTo(n2.nt - e2, n2.st), i2.lineTo(n2.nt, n2.st + e2), i2.lineTo(n2.nt + e2, n2.st), i2.lineTo(n2.nt + r2, n2.st), i2.lineTo(n2.nt + r2, n2.st - e2), i2.lineTo(n2.nt - r2, n2.st - e2), i2.lineTo(n2.nt - r2, n2.st)), i2.fill();
  }
  function pi(t2, i2, n2, s2, e2, r2) {
    return fi(i2, n2, s2, e2, r2);
  }
  class mi extends N {
    constructor() {
      super(...arguments), this.Et = null, this.lr = new Jt(), this.j = -1, this.H = "", this.Jr = "";
    }
    J(t2) {
      this.Et = t2;
    }
    ar(t2, i2) {
      this.j === t2 && this.H === i2 || (this.j = t2, this.H = i2, this.Jr = E(t2, i2), this.lr.ir());
    }
    br(t2, i2) {
      if (null === this.Et || null === this.Et.tt) return null;
      for (let n2 = this.Et.tt.from; n2 < this.Et.tt.to; n2++) {
        const s2 = this.Et.it[n2];
        if (wi(s2, t2, i2)) return { gr: s2.Qr, wr: s2.wr };
      }
      return null;
    }
    K({ context: t2, horizontalPixelRatio: i2, verticalPixelRatio: n2 }, s2, e2) {
      if (null !== this.Et && null !== this.Et.tt) {
        t2.textBaseline = "middle", t2.font = this.Jr;
        for (let s3 = this.Et.tt.from; s3 < this.Et.tt.to; s3++) {
          const e3 = this.Et.it[s3];
          void 0 !== e3.Kt && (e3.Kt.Hi = this.lr.xi(t2, e3.Kt.th), e3.Kt.At = this.j, e3.Kt.nt = e3.nt - e3.Kt.Hi / 2), bi(e3, t2, i2, n2);
        }
      }
    }
  }
  function bi(t2, i2, n2, s2) {
    i2.fillStyle = t2.O, void 0 !== t2.Kt && function(t3, i3, n3, s3, e2, r2) {
      t3.save(), t3.scale(e2, r2), t3.fillText(i3, n3, s3), t3.restore();
    }(i2, t2.Kt.th, t2.Kt.nt, t2.Kt.st, n2, s2), function(t3, i3, n3) {
      if (0 === t3.Xs) return;
      switch (t3.ih) {
        case "arrowDown":
          return void vi(false, i3, n3, t3.Xs);
        case "arrowUp":
          return void vi(true, i3, n3, t3.Xs);
        case "circle":
          return void function(t4, i4, n4) {
            const s3 = (_i("circle", n4) - 1) / 2;
            t4.beginPath(), t4.arc(i4.nt, i4.st, s3 * i4.Gr, 0, 2 * Math.PI, false), t4.fill();
          }(i3, n3, t3.Xs);
        case "square":
          return void function(t4, i4, n4) {
            const s3 = _i("square", n4), e2 = (s3 - 1) * i4.Gr / 2, r2 = i4.nt - e2, h2 = i4.st - e2;
            t4.fillRect(r2, h2, s3 * i4.Gr, s3 * i4.Gr);
          }(i3, n3, t3.Xs);
      }
      t3.ih;
    }(t2, i2, function(t3, i3, n3) {
      const s3 = Math.max(1, Math.floor(i3)) % 2 / 2;
      return { nt: Math.round(t3.nt * i3) + s3, st: t3.st * n3, Gr: i3 };
    }(t2, n2, s2));
  }
  function wi(t2, i2, n2) {
    return !(void 0 === t2.Kt || !function(t3, i3, n3, s2, e2, r2) {
      const h2 = s2 / 2;
      return e2 >= t3 && e2 <= t3 + n3 && r2 >= i3 - h2 && r2 <= i3 + h2;
    }(t2.Kt.nt, t2.Kt.st, t2.Kt.Hi, t2.Kt.At, i2, n2)) || function(t3, i3, n3) {
      if (0 === t3.Xs) return false;
      switch (t3.ih) {
        case "arrowDown":
        case "arrowUp":
          return pi(0, t3.nt, t3.st, t3.Xs, i3, n3);
        case "circle":
          return function(t4, i4, n4, s2, e2) {
            const r2 = 2 + _i("circle", n4) / 2, h2 = t4 - s2, l2 = i4 - e2;
            return Math.sqrt(h2 * h2 + l2 * l2) <= r2;
          }(t3.nt, t3.st, t3.Xs, i3, n3);
        case "square":
          return fi(t3.nt, t3.st, t3.Xs, i3, n3);
      }
    }(t2, i2, n2);
  }
  function gi(t2, i2, n2, s2, e2, r2, h2, l2, a2) {
    const o2 = P(n2) ? n2 : n2.xe, _2 = P(n2) ? n2 : n2.ge, u2 = P(n2) ? n2 : n2.Me, c2 = P(i2.size) ? Math.max(i2.size, 0) : 1, d2 = ui(l2.he()) * c2, f2 = d2 / 2;
    switch (t2.Xs = d2, i2.position) {
      case "inBar":
        return t2.st = h2.Rt(o2, a2), void (void 0 !== t2.Kt && (t2.Kt.st = t2.st + f2 + r2 + 0.6 * e2));
      case "aboveBar":
        return t2.st = h2.Rt(_2, a2) - f2 - s2.nh, void 0 !== t2.Kt && (t2.Kt.st = t2.st - f2 - 0.6 * e2, s2.nh += 1.2 * e2), void (s2.nh += d2 + r2);
      case "belowBar":
        return t2.st = h2.Rt(u2, a2) + f2 + s2.sh, void 0 !== t2.Kt && (t2.Kt.st = t2.st + f2 + r2 + 0.6 * e2, s2.sh += 1.2 * e2), void (s2.sh += d2 + r2);
    }
    i2.position;
  }
  class Mi {
    constructor(t2, i2) {
      this.ft = true, this.eh = true, this.rh = true, this.hh = null, this.ah = null, this.Wt = new mi(), this.Wr = t2, this.$i = i2, this.Et = { it: [], tt: null };
    }
    bt(t2) {
      this.ft = true, this.rh = true, "data" === t2 && (this.eh = true, this.ah = null);
    }
    gt(t2) {
      if (!this.Wr.yt()) return null;
      this.ft && this.oh();
      const i2 = this.$i.W().layout;
      return this.Wt.ar(i2.fontSize, i2.fontFamily), this.Wt.J(this.Et), this.Wt;
    }
    _h() {
      if (this.rh) {
        if (this.Wr.uh().length > 0) {
          const t2 = this.$i.St().he(), i2 = ci(t2), n2 = 1.5 * ui(t2) + 2 * i2, s2 = this.dh();
          this.hh = { above: di(n2, s2.aboveBar, s2.inBar), below: di(n2, s2.belowBar, s2.inBar) };
        } else this.hh = null;
        this.rh = false;
      }
      return this.hh;
    }
    dh() {
      return null === this.ah && (this.ah = this.Wr.uh().reduce((t2, i2) => (t2[i2.position] || (t2[i2.position] = true), t2), { inBar: false, aboveBar: false, belowBar: false })), this.ah;
    }
    oh() {
      const t2 = this.Wr.Dt(), i2 = this.$i.St(), n2 = this.Wr.uh();
      this.eh && (this.Et.it = n2.map((t3) => ({ ot: t3.time, nt: 0, st: 0, Xs: 0, ih: t3.shape, O: t3.color, Qr: t3.Qr, wr: t3.id, Kt: void 0 })), this.eh = false);
      const s2 = this.$i.W().layout;
      this.Et.tt = null;
      const e2 = i2.Zs();
      if (null === e2) return;
      const r2 = this.Wr.Ct();
      if (null === r2) return;
      if (0 === this.Et.it.length) return;
      let h2 = NaN;
      const l2 = ci(i2.he()), a2 = { nh: l2, sh: l2 };
      this.Et.tt = Vt(this.Et.it, e2, true);
      for (let e3 = this.Et.tt.from; e3 < this.Et.tt.to; e3++) {
        const o2 = n2[e3];
        o2.time !== h2 && (a2.nh = l2, a2.sh = l2, h2 = o2.time);
        const _2 = this.Et.it[e3];
        _2.nt = i2.zt(o2.time), void 0 !== o2.text && o2.text.length > 0 && (_2.Kt = { th: o2.text, nt: 0, st: 0, Hi: 0, At: 0 });
        const u2 = this.Wr.fh(o2.time);
        null !== u2 && gi(_2, o2, u2, a2, s2.fontSize, l2, t2, i2, r2.Ot);
      }
      this.ft = false;
    }
  }
  class xi extends ni {
    constructor(t2) {
      super(t2);
    }
    kr() {
      const t2 = this.Mr;
      t2.yt = false;
      const i2 = this.Is.W();
      if (!i2.priceLineVisible || !this.Is.yt()) return;
      const n2 = this.Is.Yr(0 === i2.priceLineSource);
      n2.Zr || (t2.yt = true, t2.st = n2.ki, t2.O = this.Is.ph(n2.O), t2.et = i2.priceLineWidth, t2.Nt = i2.priceLineStyle);
    }
  }
  class Si extends J {
    constructor(t2) {
      super(), this.jt = t2;
    }
    Ei(t2, i2, n2) {
      t2.yt = false, i2.yt = false;
      const s2 = this.jt;
      if (!s2.yt()) return;
      const e2 = s2.W(), r2 = e2.lastValueVisible, h2 = "" !== s2.mh(), l2 = 0 === e2.seriesLastValueMode, a2 = s2.Yr(false);
      if (a2.Zr) return;
      r2 && (t2.Kt = this.bh(a2, r2, l2), t2.yt = 0 !== t2.Kt.length), (h2 || l2) && (i2.Kt = this.wh(a2, r2, h2, l2), i2.yt = i2.Kt.length > 0);
      const o2 = s2.ph(a2.O), _2 = y(o2);
      n2.t = _2.t, n2.ki = a2.ki, i2.Bt = s2.$t().Vt(a2.ki / s2.Dt().At()), t2.Bt = o2, t2.O = _2.i, i2.O = _2.i;
    }
    wh(t2, i2, n2, s2) {
      let e2 = "";
      const r2 = this.jt.mh();
      return n2 && 0 !== r2.length && (e2 += `${r2} `), i2 && s2 && (e2 += this.jt.Dt().gh() ? t2.Mh : t2.xh), e2.trim();
    }
    bh(t2, i2, n2) {
      return i2 ? n2 ? this.jt.Dt().gh() ? t2.xh : t2.Mh : t2.Kt : "";
    }
  }
  function ki(t2, i2, n2, s2) {
    const e2 = Number.isFinite(i2), r2 = Number.isFinite(n2);
    return e2 && r2 ? t2(i2, n2) : e2 || r2 ? e2 ? i2 : n2 : s2;
  }
  class yi {
    constructor(t2, i2) {
      this.Sh = t2, this.kh = i2;
    }
    yh(t2) {
      return null !== t2 && (this.Sh === t2.Sh && this.kh === t2.kh);
    }
    Ch() {
      return new yi(this.Sh, this.kh);
    }
    Th() {
      return this.Sh;
    }
    Ph() {
      return this.kh;
    }
    Rh() {
      return this.kh - this.Sh;
    }
    Ni() {
      return this.kh === this.Sh || Number.isNaN(this.kh) || Number.isNaN(this.Sh);
    }
    ts(t2) {
      return null === t2 ? this : new yi(ki(Math.min, this.Th(), t2.Th(), -1 / 0), ki(Math.max, this.Ph(), t2.Ph(), 1 / 0));
    }
    Dh(t2) {
      if (!P(t2)) return;
      if (0 === this.kh - this.Sh) return;
      const i2 = 0.5 * (this.kh + this.Sh);
      let n2 = this.kh - i2, s2 = this.Sh - i2;
      n2 *= t2, s2 *= t2, this.kh = i2 + n2, this.Sh = i2 + s2;
    }
    Oh(t2) {
      P(t2) && (this.kh += t2, this.Sh += t2);
    }
    Bh() {
      return { minValue: this.Sh, maxValue: this.kh };
    }
    static Vh(t2) {
      return null === t2 ? null : new yi(t2.minValue, t2.maxValue);
    }
  }
  class Ci {
    constructor(t2, i2) {
      this.Ah = t2, this.zh = i2 || null;
    }
    Eh() {
      return this.Ah;
    }
    Ih() {
      return this.zh;
    }
    Bh() {
      return null === this.Ah ? null : { priceRange: this.Ah.Bh(), margins: this.zh || void 0 };
    }
    static Vh(t2) {
      return null === t2 ? null : new Ci(yi.Vh(t2.priceRange), t2.margins);
    }
  }
  class Ti extends ni {
    constructor(t2, i2) {
      super(t2), this.Lh = i2;
    }
    kr() {
      const t2 = this.Mr;
      t2.yt = false;
      const i2 = this.Lh.W();
      if (!this.Is.yt() || !i2.lineVisible) return;
      const n2 = this.Lh.Nh();
      null !== n2 && (t2.yt = true, t2.st = n2, t2.O = i2.color, t2.et = i2.lineWidth, t2.Nt = i2.lineStyle, t2.wr = this.Lh.W().id);
    }
  }
  class Pi extends J {
    constructor(t2, i2) {
      super(), this.Wr = t2, this.Lh = i2;
    }
    Ei(t2, i2, n2) {
      t2.yt = false, i2.yt = false;
      const s2 = this.Lh.W(), e2 = s2.axisLabelVisible, r2 = "" !== s2.title, h2 = this.Wr;
      if (!e2 || !h2.yt()) return;
      const l2 = this.Lh.Nh();
      if (null === l2) return;
      r2 && (i2.Kt = s2.title, i2.yt = true), i2.Bt = h2.$t().Vt(l2 / h2.Dt().At()), t2.Kt = this.Fh(s2.price), t2.yt = true;
      const a2 = y(s2.axisLabelColor || s2.color);
      n2.t = a2.t;
      const o2 = s2.axisLabelTextColor || a2.i;
      t2.O = o2, i2.O = o2, n2.ki = l2;
    }
    Fh(t2) {
      const i2 = this.Wr.Ct();
      return null === i2 ? "" : this.Wr.Dt().Fi(t2, i2.Ot);
    }
  }
  class Ri {
    constructor(t2, i2) {
      this.Wr = t2, this.cn = i2, this.Wh = new Ti(t2, this), this._r = new Pi(t2, this), this.jh = new ti(this._r, t2, t2.$t());
    }
    Hh(t2) {
      T(this.cn, t2), this.bt(), this.Wr.$t().$h();
    }
    W() {
      return this.cn;
    }
    Uh() {
      return this.Wh;
    }
    qh() {
      return this.jh;
    }
    Yh() {
      return this._r;
    }
    bt() {
      this.Wh.bt(), this._r.bt();
    }
    Nh() {
      const t2 = this.Wr, i2 = t2.Dt();
      if (t2.$t().St().Ni() || i2.Ni()) return null;
      const n2 = t2.Ct();
      return null === n2 ? null : i2.Rt(this.cn.price, n2.Ot);
    }
  }
  class Di extends st {
    constructor(t2) {
      super(), this.$i = t2;
    }
    $t() {
      return this.$i;
    }
  }
  const Oi = { Bar: (t2, i2, n2, s2) => {
    var e2;
    const r2 = i2.upColor, h2 = i2.downColor, l2 = f(t2(n2, s2)), a2 = v(l2.Ot[0]) <= v(l2.Ot[3]);
    return { ue: null !== (e2 = l2.O) && void 0 !== e2 ? e2 : a2 ? r2 : h2 };
  }, Candlestick: (t2, i2, n2, s2) => {
    var e2, r2, h2;
    const l2 = i2.upColor, a2 = i2.downColor, o2 = i2.borderUpColor, _2 = i2.borderDownColor, u2 = i2.wickUpColor, c2 = i2.wickDownColor, d2 = f(t2(n2, s2)), p2 = v(d2.Ot[0]) <= v(d2.Ot[3]);
    return { ue: null !== (e2 = d2.O) && void 0 !== e2 ? e2 : p2 ? l2 : a2, Le: null !== (r2 = d2.Bt) && void 0 !== r2 ? r2 : p2 ? o2 : _2, Ie: null !== (h2 = d2.Zh) && void 0 !== h2 ? h2 : p2 ? u2 : c2 };
  }, Custom: (t2, i2, n2, s2) => {
    var e2;
    return { ue: null !== (e2 = f(t2(n2, s2)).O) && void 0 !== e2 ? e2 : i2.color };
  }, Area: (t2, i2, n2, s2) => {
    var e2, r2, h2, l2;
    const a2 = f(t2(n2, s2));
    return { ue: null !== (e2 = a2.lt) && void 0 !== e2 ? e2 : i2.lineColor, lt: null !== (r2 = a2.lt) && void 0 !== r2 ? r2 : i2.lineColor, Ts: null !== (h2 = a2.Ts) && void 0 !== h2 ? h2 : i2.topColor, Ps: null !== (l2 = a2.Ps) && void 0 !== l2 ? l2 : i2.bottomColor };
  }, Baseline: (t2, i2, n2, s2) => {
    var e2, r2, h2, l2, a2, o2;
    const _2 = f(t2(n2, s2));
    return { ue: _2.Ot[3] >= i2.baseValue.price ? i2.topLineColor : i2.bottomLineColor, Pe: null !== (e2 = _2.Pe) && void 0 !== e2 ? e2 : i2.topLineColor, Re: null !== (r2 = _2.Re) && void 0 !== r2 ? r2 : i2.bottomLineColor, Se: null !== (h2 = _2.Se) && void 0 !== h2 ? h2 : i2.topFillColor1, ke: null !== (l2 = _2.ke) && void 0 !== l2 ? l2 : i2.topFillColor2, ye: null !== (a2 = _2.ye) && void 0 !== a2 ? a2 : i2.bottomFillColor1, Ce: null !== (o2 = _2.Ce) && void 0 !== o2 ? o2 : i2.bottomFillColor2 };
  }, Line: (t2, i2, n2, s2) => {
    var e2, r2;
    const h2 = f(t2(n2, s2));
    return { ue: null !== (e2 = h2.O) && void 0 !== e2 ? e2 : i2.color, lt: null !== (r2 = h2.O) && void 0 !== r2 ? r2 : i2.color };
  }, Histogram: (t2, i2, n2, s2) => {
    var e2;
    return { ue: null !== (e2 = f(t2(n2, s2)).O) && void 0 !== e2 ? e2 : i2.color };
  } };
  class Bi {
    constructor(t2) {
      this.Xh = (t3, i2) => void 0 !== i2 ? i2.Ot : this.Wr.zn().Kh(t3), this.Wr = t2, this.Gh = Oi[t2.Jh()];
    }
    Hs(t2, i2) {
      return this.Gh(this.Xh, this.Wr.W(), t2, i2);
    }
  }
  var Vi;
  !function(t2) {
    t2[t2.NearestLeft = -1] = "NearestLeft", t2[t2.None = 0] = "None", t2[t2.NearestRight = 1] = "NearestRight";
  }(Vi || (Vi = {}));
  const Ai = 30;
  class zi {
    constructor() {
      this.Qh = [], this.tl = /* @__PURE__ */ new Map(), this.il = /* @__PURE__ */ new Map();
    }
    nl() {
      return this.Xs() > 0 ? this.Qh[this.Qh.length - 1] : null;
    }
    sl() {
      return this.Xs() > 0 ? this.el(0) : null;
    }
    An() {
      return this.Xs() > 0 ? this.el(this.Qh.length - 1) : null;
    }
    Xs() {
      return this.Qh.length;
    }
    Ni() {
      return 0 === this.Xs();
    }
    Xr(t2) {
      return null !== this.rl(t2, 0);
    }
    Kh(t2) {
      return this.hl(t2);
    }
    hl(t2, i2 = 0) {
      const n2 = this.rl(t2, i2);
      return null === n2 ? null : Object.assign(Object.assign({}, this.ll(n2)), { se: this.el(n2) });
    }
    ie() {
      return this.Qh;
    }
    al(t2, i2, n2) {
      if (this.Ni()) return null;
      let s2 = null;
      for (const e2 of n2) {
        s2 = Ei(s2, this.ol(t2, i2, e2));
      }
      return s2;
    }
    J(t2) {
      this.il.clear(), this.tl.clear(), this.Qh = t2;
    }
    el(t2) {
      return this.Qh[t2].se;
    }
    ll(t2) {
      return this.Qh[t2];
    }
    rl(t2, i2) {
      const n2 = this._l(t2);
      if (null === n2 && 0 !== i2) switch (i2) {
        case -1:
          return this.ul(t2);
        case 1:
          return this.cl(t2);
        default:
          throw new TypeError("Unknown search mode");
      }
      return n2;
    }
    ul(t2) {
      let i2 = this.dl(t2);
      return i2 > 0 && (i2 -= 1), i2 !== this.Qh.length && this.el(i2) < t2 ? i2 : null;
    }
    cl(t2) {
      const i2 = this.fl(t2);
      return i2 !== this.Qh.length && t2 < this.el(i2) ? i2 : null;
    }
    _l(t2) {
      const i2 = this.dl(t2);
      return i2 === this.Qh.length || t2 < this.Qh[i2].se ? null : i2;
    }
    dl(t2) {
      return Rt(this.Qh, t2, (t3, i2) => t3.se < i2);
    }
    fl(t2) {
      return Dt(this.Qh, t2, (t3, i2) => t3.se > i2);
    }
    vl(t2, i2, n2) {
      let s2 = null;
      for (let e2 = t2; e2 < i2; e2++) {
        const t3 = this.Qh[e2].Ot[n2];
        Number.isNaN(t3) || (null === s2 ? s2 = { pl: t3, ml: t3 } : (t3 < s2.pl && (s2.pl = t3), t3 > s2.ml && (s2.ml = t3)));
      }
      return s2;
    }
    ol(t2, i2, n2) {
      if (this.Ni()) return null;
      let s2 = null;
      const e2 = f(this.sl()), r2 = f(this.An()), h2 = Math.max(t2, e2), l2 = Math.min(i2, r2), a2 = Math.ceil(h2 / Ai) * Ai, o2 = Math.max(a2, Math.floor(l2 / Ai) * Ai);
      {
        const t3 = this.dl(h2), e3 = this.fl(Math.min(l2, a2, i2));
        s2 = Ei(s2, this.vl(t3, e3, n2));
      }
      let _2 = this.tl.get(n2);
      void 0 === _2 && (_2 = /* @__PURE__ */ new Map(), this.tl.set(n2, _2));
      for (let t3 = Math.max(a2 + 1, h2); t3 < o2; t3 += Ai) {
        const i3 = Math.floor(t3 / Ai);
        let e3 = _2.get(i3);
        if (void 0 === e3) {
          const t4 = this.dl(i3 * Ai), s3 = this.fl((i3 + 1) * Ai - 1);
          e3 = this.vl(t4, s3, n2), _2.set(i3, e3);
        }
        s2 = Ei(s2, e3);
      }
      {
        const t3 = this.dl(o2), i3 = this.fl(l2);
        s2 = Ei(s2, this.vl(t3, i3, n2));
      }
      return s2;
    }
  }
  function Ei(t2, i2) {
    if (null === t2) return i2;
    if (null === i2) return t2;
    return { pl: Math.min(t2.pl, i2.pl), ml: Math.max(t2.ml, i2.ml) };
  }
  class Ii {
    constructor(t2) {
      this.bl = t2;
    }
    X(t2, i2, n2) {
      this.bl.draw(t2);
    }
    wl(t2, i2, n2) {
      var s2, e2;
      null === (e2 = (s2 = this.bl).drawBackground) || void 0 === e2 || e2.call(s2, t2);
    }
  }
  class Li {
    constructor(t2) {
      this.Qe = null, this.wn = t2;
    }
    gt() {
      var t2;
      const i2 = this.wn.renderer();
      if (null === i2) return null;
      if ((null === (t2 = this.Qe) || void 0 === t2 ? void 0 : t2.gl) === i2) return this.Qe.Ml;
      const n2 = new Ii(i2);
      return this.Qe = { gl: i2, Ml: n2 }, n2;
    }
    xl() {
      var t2, i2, n2;
      return null !== (n2 = null === (i2 = (t2 = this.wn).zOrder) || void 0 === i2 ? void 0 : i2.call(t2)) && void 0 !== n2 ? n2 : "normal";
    }
  }
  function Ni(t2) {
    var i2, n2, s2, e2, r2;
    return { Kt: t2.text(), ki: t2.coordinate(), Si: null === (i2 = t2.fixedCoordinate) || void 0 === i2 ? void 0 : i2.call(t2), O: t2.textColor(), t: t2.backColor(), yt: null === (s2 = null === (n2 = t2.visible) || void 0 === n2 ? void 0 : n2.call(t2)) || void 0 === s2 || s2, hi: null === (r2 = null === (e2 = t2.tickVisible) || void 0 === e2 ? void 0 : e2.call(t2)) || void 0 === r2 || r2 };
  }
  class Fi {
    constructor(t2, i2) {
      this.Wt = new it(), this.Sl = t2, this.kl = i2;
    }
    gt() {
      return this.Wt.J(Object.assign({ Hi: this.kl.Hi() }, Ni(this.Sl))), this.Wt;
    }
  }
  class Wi extends J {
    constructor(t2, i2) {
      super(), this.Sl = t2, this.Ii = i2;
    }
    Ei(t2, i2, n2) {
      const s2 = Ni(this.Sl);
      n2.t = s2.t, t2.O = s2.O;
      const e2 = 2 / 12 * this.Ii.P();
      n2.wi = e2, n2.gi = e2, n2.ki = s2.ki, n2.Si = s2.Si, t2.Kt = s2.Kt, t2.yt = s2.yt, t2.hi = s2.hi;
    }
  }
  class ji {
    constructor(t2, i2) {
      this.yl = null, this.Cl = null, this.Tl = null, this.Pl = null, this.Rl = null, this.Dl = t2, this.Wr = i2;
    }
    Ol() {
      return this.Dl;
    }
    On() {
      var t2, i2;
      null === (i2 = (t2 = this.Dl).updateAllViews) || void 0 === i2 || i2.call(t2);
    }
    Pn() {
      var t2, i2, n2, s2;
      const e2 = null !== (n2 = null === (i2 = (t2 = this.Dl).paneViews) || void 0 === i2 ? void 0 : i2.call(t2)) && void 0 !== n2 ? n2 : [];
      if ((null === (s2 = this.yl) || void 0 === s2 ? void 0 : s2.gl) === e2) return this.yl.Ml;
      const r2 = e2.map((t3) => new Li(t3));
      return this.yl = { gl: e2, Ml: r2 }, r2;
    }
    Qi() {
      var t2, i2, n2, s2;
      const e2 = null !== (n2 = null === (i2 = (t2 = this.Dl).timeAxisViews) || void 0 === i2 ? void 0 : i2.call(t2)) && void 0 !== n2 ? n2 : [];
      if ((null === (s2 = this.Cl) || void 0 === s2 ? void 0 : s2.gl) === e2) return this.Cl.Ml;
      const r2 = this.Wr.$t().St(), h2 = e2.map((t3) => new Fi(t3, r2));
      return this.Cl = { gl: e2, Ml: h2 }, h2;
    }
    Rn() {
      var t2, i2, n2, s2;
      const e2 = null !== (n2 = null === (i2 = (t2 = this.Dl).priceAxisViews) || void 0 === i2 ? void 0 : i2.call(t2)) && void 0 !== n2 ? n2 : [];
      if ((null === (s2 = this.Tl) || void 0 === s2 ? void 0 : s2.gl) === e2) return this.Tl.Ml;
      const r2 = this.Wr.Dt(), h2 = e2.map((t3) => new Wi(t3, r2));
      return this.Tl = { gl: e2, Ml: h2 }, h2;
    }
    Bl() {
      var t2, i2, n2, s2;
      const e2 = null !== (n2 = null === (i2 = (t2 = this.Dl).priceAxisPaneViews) || void 0 === i2 ? void 0 : i2.call(t2)) && void 0 !== n2 ? n2 : [];
      if ((null === (s2 = this.Pl) || void 0 === s2 ? void 0 : s2.gl) === e2) return this.Pl.Ml;
      const r2 = e2.map((t3) => new Li(t3));
      return this.Pl = { gl: e2, Ml: r2 }, r2;
    }
    Vl() {
      var t2, i2, n2, s2;
      const e2 = null !== (n2 = null === (i2 = (t2 = this.Dl).timeAxisPaneViews) || void 0 === i2 ? void 0 : i2.call(t2)) && void 0 !== n2 ? n2 : [];
      if ((null === (s2 = this.Rl) || void 0 === s2 ? void 0 : s2.gl) === e2) return this.Rl.Ml;
      const r2 = e2.map((t3) => new Li(t3));
      return this.Rl = { gl: e2, Ml: r2 }, r2;
    }
    Al(t2, i2) {
      var n2, s2, e2;
      return null !== (e2 = null === (s2 = (n2 = this.Dl).autoscaleInfo) || void 0 === s2 ? void 0 : s2.call(n2, t2, i2)) && void 0 !== e2 ? e2 : null;
    }
    br(t2, i2) {
      var n2, s2, e2;
      return null !== (e2 = null === (s2 = (n2 = this.Dl).hitTest) || void 0 === s2 ? void 0 : s2.call(n2, t2, i2)) && void 0 !== e2 ? e2 : null;
    }
  }
  function Hi(t2, i2, n2, s2) {
    t2.forEach((t3) => {
      i2(t3).forEach((t4) => {
        t4.xl() === n2 && s2.push(t4);
      });
    });
  }
  function $i(t2) {
    return t2.Pn();
  }
  function Ui(t2) {
    return t2.Bl();
  }
  function qi(t2) {
    return t2.Vl();
  }
  class Yi extends Di {
    constructor(t2, i2, n2, s2, e2) {
      super(t2), this.Et = new zi(), this.Wh = new xi(this), this.zl = [], this.El = new si(this), this.Il = null, this.Ll = null, this.Nl = [], this.Fl = [], this.Wl = null, this.jl = [], this.cn = i2, this.Hl = n2;
      const r2 = new Si(this);
      this.rn = [r2], this.jh = new ti(r2, this, t2), "Area" !== n2 && "Line" !== n2 && "Baseline" !== n2 || (this.Il = new ai(this)), this.$l(), this.Ul(e2);
    }
    S() {
      null !== this.Wl && clearTimeout(this.Wl);
    }
    ph(t2) {
      return this.cn.priceLineColor || t2;
    }
    Yr(t2) {
      const i2 = { Zr: true }, n2 = this.Dt();
      if (this.$t().St().Ni() || n2.Ni() || this.Et.Ni()) return i2;
      const s2 = this.$t().St().Zs(), e2 = this.Ct();
      if (null === s2 || null === e2) return i2;
      let r2, h2;
      if (t2) {
        const t3 = this.Et.nl();
        if (null === t3) return i2;
        r2 = t3, h2 = t3.se;
      } else {
        const t3 = this.Et.hl(s2.ui(), -1);
        if (null === t3) return i2;
        if (r2 = this.Et.Kh(t3.se), null === r2) return i2;
        h2 = t3.se;
      }
      const l2 = r2.Ot[3], a2 = this.$s().Hs(h2, { Ot: r2 }), o2 = n2.Rt(l2, e2.Ot);
      return { Zr: false, _t: l2, Kt: n2.Fi(l2, e2.Ot), Mh: n2.ql(l2), xh: n2.Yl(l2, e2.Ot), O: a2.ue, ki: o2, se: h2 };
    }
    $s() {
      return null !== this.Ll || (this.Ll = new Bi(this)), this.Ll;
    }
    W() {
      return this.cn;
    }
    Hh(t2) {
      const i2 = t2.priceScaleId;
      void 0 !== i2 && i2 !== this.cn.priceScaleId && this.$t().Zl(this, i2), T(this.cn, t2), void 0 !== t2.priceFormat && (this.$l(), this.$t().Xl()), this.$t().Kl(this), this.$t().Gl(), this.wn.bt("options");
    }
    J(t2, i2) {
      this.Et.J(t2), this.Jl(), this.wn.bt("data"), this.dn.bt("data"), null !== this.Il && (i2 && i2.Ql ? this.Il.Hr() : 0 === t2.length && this.Il.jr());
      const n2 = this.$t().cr(this);
      this.$t().ta(n2), this.$t().Kl(this), this.$t().Gl(), this.$t().$h();
    }
    ia(t2) {
      this.Nl = t2, this.Jl();
      const i2 = this.$t().cr(this);
      this.dn.bt("data"), this.$t().ta(i2), this.$t().Kl(this), this.$t().Gl(), this.$t().$h();
    }
    na() {
      return this.Nl;
    }
    uh() {
      return this.Fl;
    }
    sa(t2) {
      const i2 = new Ri(this, t2);
      return this.zl.push(i2), this.$t().Kl(this), i2;
    }
    ea(t2) {
      const i2 = this.zl.indexOf(t2);
      -1 !== i2 && this.zl.splice(i2, 1), this.$t().Kl(this);
    }
    Jh() {
      return this.Hl;
    }
    Ct() {
      const t2 = this.ra();
      return null === t2 ? null : { Ot: t2.Ot[3], ha: t2.ot };
    }
    ra() {
      const t2 = this.$t().St().Zs();
      if (null === t2) return null;
      const i2 = t2.Os();
      return this.Et.hl(i2, 1);
    }
    zn() {
      return this.Et;
    }
    fh(t2) {
      const i2 = this.Et.Kh(t2);
      return null === i2 ? null : "Bar" === this.Hl || "Candlestick" === this.Hl || "Custom" === this.Hl ? { we: i2.Ot[0], ge: i2.Ot[1], Me: i2.Ot[2], xe: i2.Ot[3] } : i2.Ot[3];
    }
    la(t2) {
      const i2 = [];
      Hi(this.jl, $i, "top", i2);
      const n2 = this.Il;
      return null !== n2 && n2.yt() ? (null === this.Wl && n2.Ur() && (this.Wl = setTimeout(() => {
        this.Wl = null, this.$t().aa();
      }, 0)), n2.$r(), i2.unshift(n2), i2) : i2;
    }
    Pn() {
      const t2 = [];
      this.oa() || t2.push(this.El), t2.push(this.wn, this.Wh, this.dn);
      const i2 = this.zl.map((t3) => t3.Uh());
      return t2.push(...i2), Hi(this.jl, $i, "normal", t2), t2;
    }
    _a() {
      return this.ua($i, "bottom");
    }
    ca(t2) {
      return this.ua(Ui, t2);
    }
    da(t2) {
      return this.ua(qi, t2);
    }
    fa(t2, i2) {
      return this.jl.map((n2) => n2.br(t2, i2)).filter((t3) => null !== t3);
    }
    Ji(t2) {
      return [this.jh, ...this.zl.map((t3) => t3.qh())];
    }
    Rn(t2, i2) {
      if (i2 !== this.Yi && !this.oa()) return [];
      const n2 = [...this.rn];
      for (const t3 of this.zl) n2.push(t3.Yh());
      return this.jl.forEach((t3) => {
        n2.push(...t3.Rn());
      }), n2;
    }
    Qi() {
      const t2 = [];
      return this.jl.forEach((i2) => {
        t2.push(...i2.Qi());
      }), t2;
    }
    Al(t2, i2) {
      if (void 0 !== this.cn.autoscaleInfoProvider) {
        const n2 = this.cn.autoscaleInfoProvider(() => {
          const n3 = this.va(t2, i2);
          return null === n3 ? null : n3.Bh();
        });
        return Ci.Vh(n2);
      }
      return this.va(t2, i2);
    }
    pa() {
      return this.cn.priceFormat.minMove;
    }
    ma() {
      return this.ba;
    }
    On() {
      var t2;
      this.wn.bt(), this.dn.bt();
      for (const t3 of this.rn) t3.bt();
      for (const t3 of this.zl) t3.bt();
      this.Wh.bt(), this.El.bt(), null === (t2 = this.Il) || void 0 === t2 || t2.bt(), this.jl.forEach((t3) => t3.On());
    }
    Dt() {
      return f(super.Dt());
    }
    kt(t2) {
      if (!(("Line" === this.Hl || "Area" === this.Hl || "Baseline" === this.Hl) && this.cn.crosshairMarkerVisible)) return null;
      const i2 = this.Et.Kh(t2);
      if (null === i2) return null;
      return { _t: i2.Ot[3], ht: this.wa(), Bt: this.ga(), Pt: this.Ma(), Tt: this.xa(t2) };
    }
    mh() {
      return this.cn.title;
    }
    yt() {
      return this.cn.visible;
    }
    Sa(t2) {
      this.jl.push(new ji(t2, this));
    }
    ka(t2) {
      this.jl = this.jl.filter((i2) => i2.Ol() !== t2);
    }
    ya() {
      if (this.wn instanceof qt != false) return (t2) => this.wn.Fe(t2);
    }
    Ca() {
      if (this.wn instanceof qt != false) return (t2) => this.wn.We(t2);
    }
    oa() {
      return !ht(this.Dt().Ta());
    }
    va(t2, i2) {
      if (!R(t2) || !R(i2) || this.Et.Ni()) return null;
      const n2 = "Line" === this.Hl || "Area" === this.Hl || "Baseline" === this.Hl || "Histogram" === this.Hl ? [3] : [2, 1], s2 = this.Et.al(t2, i2, n2);
      let e2 = null !== s2 ? new yi(s2.pl, s2.ml) : null;
      if ("Histogram" === this.Jh()) {
        const t3 = this.cn.base, i3 = new yi(t3, t3);
        e2 = null !== e2 ? e2.ts(i3) : i3;
      }
      let r2 = this.dn._h();
      return this.jl.forEach((n3) => {
        const s3 = n3.Al(t2, i2);
        if (null == s3 ? void 0 : s3.priceRange) {
          const t3 = new yi(s3.priceRange.minValue, s3.priceRange.maxValue);
          e2 = null !== e2 ? e2.ts(t3) : t3;
        }
        var h2, l2, a2, o2;
        (null == s3 ? void 0 : s3.margins) && (h2 = r2, l2 = s3.margins, r2 = { above: Math.max(null !== (a2 = null == h2 ? void 0 : h2.above) && void 0 !== a2 ? a2 : 0, l2.above), below: Math.max(null !== (o2 = null == h2 ? void 0 : h2.below) && void 0 !== o2 ? o2 : 0, l2.below) });
      }), new Ci(e2, r2);
    }
    wa() {
      switch (this.Hl) {
        case "Line":
        case "Area":
        case "Baseline":
          return this.cn.crosshairMarkerRadius;
      }
      return 0;
    }
    ga() {
      switch (this.Hl) {
        case "Line":
        case "Area":
        case "Baseline": {
          const t2 = this.cn.crosshairMarkerBorderColor;
          if (0 !== t2.length) return t2;
        }
      }
      return null;
    }
    Ma() {
      switch (this.Hl) {
        case "Line":
        case "Area":
        case "Baseline":
          return this.cn.crosshairMarkerBorderWidth;
      }
      return 0;
    }
    xa(t2) {
      switch (this.Hl) {
        case "Line":
        case "Area":
        case "Baseline": {
          const t3 = this.cn.crosshairMarkerBackgroundColor;
          if (0 !== t3.length) return t3;
        }
      }
      return this.$s().Hs(t2).ue;
    }
    $l() {
      switch (this.cn.priceFormat.type) {
        case "custom":
          this.ba = { format: this.cn.priceFormat.formatter };
          break;
        case "volume":
          this.ba = new ct(this.cn.priceFormat.precision);
          break;
        case "percent":
          this.ba = new ut(this.cn.priceFormat.precision);
          break;
        default: {
          const t2 = Math.pow(10, this.cn.priceFormat.precision);
          this.ba = new _t(t2, this.cn.priceFormat.minMove * t2);
        }
      }
      null !== this.Yi && this.Yi.Pa();
    }
    Jl() {
      const t2 = this.$t().St();
      if (!t2.Ra() || this.Et.Ni()) return void (this.Fl = []);
      const i2 = f(this.Et.sl());
      this.Fl = this.Nl.map((n2, s2) => {
        const e2 = f(t2.Da(n2.time, true)), r2 = e2 < i2 ? 1 : -1;
        return { time: f(this.Et.hl(e2, r2)).se, position: n2.position, shape: n2.shape, color: n2.color, id: n2.id, Qr: s2, text: n2.text, size: n2.size, originalTime: n2.originalTime };
      });
    }
    Ul(t2) {
      switch (this.dn = new Mi(this, this.$t()), this.Hl) {
        case "Bar":
          this.wn = new Nt(this, this.$t());
          break;
        case "Candlestick":
          this.wn = new $t(this, this.$t());
          break;
        case "Line":
          this.wn = new Kt(this, this.$t());
          break;
        case "Custom":
          this.wn = new qt(this, this.$t(), d(t2));
          break;
        case "Area":
          this.wn = new Et(this, this.$t());
          break;
        case "Baseline":
          this.wn = new jt(this, this.$t());
          break;
        case "Histogram":
          this.wn = new Xt(this, this.$t());
          break;
        default:
          throw Error("Unknown chart style assigned: " + this.Hl);
      }
    }
    ua(t2, i2) {
      const n2 = [];
      return Hi(this.jl, t2, i2, n2), n2;
    }
  }
  class Zi {
    constructor(t2) {
      this.cn = t2;
    }
    Oa(t2, i2, n2) {
      let s2 = t2;
      if (0 === this.cn.mode) return s2;
      const e2 = n2.vn(), r2 = e2.Ct();
      if (null === r2) return s2;
      const h2 = e2.Rt(t2, r2), l2 = n2.Ba().filter((t3) => t3 instanceof Yi).reduce((t3, s3) => {
        if (n2.dr(s3) || !s3.yt()) return t3;
        const e3 = s3.Dt(), r3 = s3.zn();
        if (e3.Ni() || !r3.Xr(i2)) return t3;
        const h3 = r3.Kh(i2);
        if (null === h3) return t3;
        const l3 = v(s3.Ct());
        return t3.concat([e3.Rt(h3.Ot[3], l3.Ot)]);
      }, []);
      if (0 === l2.length) return s2;
      l2.sort((t3, i3) => Math.abs(t3 - h2) - Math.abs(i3 - h2));
      const a2 = l2[0];
      return s2 = e2.pn(a2, r2), s2;
    }
  }
  class Xi extends N {
    constructor() {
      super(...arguments), this.Et = null;
    }
    J(t2) {
      this.Et = t2;
    }
    K({ context: t2, bitmapSize: i2, horizontalPixelRatio: n2, verticalPixelRatio: s2 }) {
      if (null === this.Et) return;
      const e2 = Math.max(1, Math.floor(n2));
      t2.lineWidth = e2, function(t3, i3) {
        t3.save(), t3.lineWidth % 2 && t3.translate(0.5, 0.5), i3(), t3.restore();
      }(t2, () => {
        const r2 = f(this.Et);
        if (r2.Va) {
          t2.strokeStyle = r2.Aa, _(t2, r2.za), t2.beginPath();
          for (const s3 of r2.Ea) {
            const r3 = Math.round(s3.Ia * n2);
            t2.moveTo(r3, -e2), t2.lineTo(r3, i2.height + e2);
          }
          t2.stroke();
        }
        if (r2.La) {
          t2.strokeStyle = r2.Na, _(t2, r2.Fa), t2.beginPath();
          for (const n3 of r2.Wa) {
            const r3 = Math.round(n3.Ia * s2);
            t2.moveTo(-e2, r3), t2.lineTo(i2.width + e2, r3);
          }
          t2.stroke();
        }
      });
    }
  }
  class Ki {
    constructor(t2) {
      this.Wt = new Xi(), this.ft = true, this.tn = t2;
    }
    bt() {
      this.ft = true;
    }
    gt() {
      if (this.ft) {
        const t2 = this.tn.$t().W().grid, i2 = { La: t2.horzLines.visible, Va: t2.vertLines.visible, Na: t2.horzLines.color, Aa: t2.vertLines.color, Fa: t2.horzLines.style, za: t2.vertLines.style, Wa: this.tn.vn().ja(), Ea: (this.tn.$t().St().ja() || []).map((t3) => ({ Ia: t3.coord })) };
        this.Wt.J(i2), this.ft = false;
      }
      return this.Wt;
    }
  }
  class Gi {
    constructor(t2) {
      this.wn = new Ki(t2);
    }
    Uh() {
      return this.wn;
    }
  }
  const Ji = { Ha: 4, $a: 1e-4 };
  function Qi(t2, i2) {
    const n2 = 100 * (t2 - i2) / i2;
    return i2 < 0 ? -n2 : n2;
  }
  function tn(t2, i2) {
    const n2 = Qi(t2.Th(), i2), s2 = Qi(t2.Ph(), i2);
    return new yi(n2, s2);
  }
  function nn(t2, i2) {
    const n2 = 100 * (t2 - i2) / i2 + 100;
    return i2 < 0 ? -n2 : n2;
  }
  function sn(t2, i2) {
    const n2 = nn(t2.Th(), i2), s2 = nn(t2.Ph(), i2);
    return new yi(n2, s2);
  }
  function en(t2, i2) {
    const n2 = Math.abs(t2);
    if (n2 < 1e-15) return 0;
    const s2 = Math.log10(n2 + i2.$a) + i2.Ha;
    return t2 < 0 ? -s2 : s2;
  }
  function rn(t2, i2) {
    const n2 = Math.abs(t2);
    if (n2 < 1e-15) return 0;
    const s2 = Math.pow(10, n2 - i2.Ha) - i2.$a;
    return t2 < 0 ? -s2 : s2;
  }
  function hn(t2, i2) {
    if (null === t2) return null;
    const n2 = en(t2.Th(), i2), s2 = en(t2.Ph(), i2);
    return new yi(n2, s2);
  }
  function ln(t2, i2) {
    if (null === t2) return null;
    const n2 = rn(t2.Th(), i2), s2 = rn(t2.Ph(), i2);
    return new yi(n2, s2);
  }
  function an(t2) {
    if (null === t2) return Ji;
    const i2 = Math.abs(t2.Ph() - t2.Th());
    if (i2 >= 1 || i2 < 1e-15) return Ji;
    const n2 = Math.ceil(Math.abs(Math.log10(i2))), s2 = Ji.Ha + n2;
    return { Ha: s2, $a: 1 / Math.pow(10, s2) };
  }
  class on {
    constructor(t2, i2) {
      if (this.Ua = t2, this.qa = i2, function(t3) {
        if (t3 < 0) return false;
        for (let i3 = t3; i3 > 1; i3 /= 10) if (i3 % 10 != 0) return false;
        return true;
      }(this.Ua)) this.Ya = [2, 2.5, 2];
      else {
        this.Ya = [];
        for (let t3 = this.Ua; 1 !== t3; ) {
          if (t3 % 2 == 0) this.Ya.push(2), t3 /= 2;
          else {
            if (t3 % 5 != 0) throw new Error("unexpected base");
            this.Ya.push(2, 2.5), t3 /= 5;
          }
          if (this.Ya.length > 100) throw new Error("something wrong with base");
        }
      }
    }
    Za(t2, i2, n2) {
      const s2 = 0 === this.Ua ? 0 : 1 / this.Ua;
      let e2 = Math.pow(10, Math.max(0, Math.ceil(Math.log10(t2 - i2)))), r2 = 0, h2 = this.qa[0];
      for (; ; ) {
        const t3 = Mt(e2, s2, 1e-14) && e2 > s2 + 1e-14, i3 = Mt(e2, n2 * h2, 1e-14), l3 = Mt(e2, 1, 1e-14);
        if (!(t3 && i3 && l3)) break;
        e2 /= h2, h2 = this.qa[++r2 % this.qa.length];
      }
      if (e2 <= s2 + 1e-14 && (e2 = s2), e2 = Math.max(1, e2), this.Ya.length > 0 && (l2 = e2, a2 = 1, o2 = 1e-14, Math.abs(l2 - a2) < o2)) for (r2 = 0, h2 = this.Ya[0]; Mt(e2, n2 * h2, 1e-14) && e2 > s2 + 1e-14; ) e2 /= h2, h2 = this.Ya[++r2 % this.Ya.length];
      var l2, a2, o2;
      return e2;
    }
  }
  class _n {
    constructor(t2, i2, n2, s2) {
      this.Xa = [], this.Ii = t2, this.Ua = i2, this.Ka = n2, this.Ga = s2;
    }
    Za(t2, i2) {
      if (t2 < i2) throw new Error("high < low");
      const n2 = this.Ii.At(), s2 = (t2 - i2) * this.Ja() / n2, e2 = new on(this.Ua, [2, 2.5, 2]), r2 = new on(this.Ua, [2, 2, 2.5]), h2 = new on(this.Ua, [2.5, 2, 2]), l2 = [];
      return l2.push(e2.Za(t2, i2, s2), r2.Za(t2, i2, s2), h2.Za(t2, i2, s2)), function(t3) {
        if (t3.length < 1) throw Error("array is empty");
        let i3 = t3[0];
        for (let n3 = 1; n3 < t3.length; ++n3) t3[n3] < i3 && (i3 = t3[n3]);
        return i3;
      }(l2);
    }
    Qa() {
      const t2 = this.Ii, i2 = t2.Ct();
      if (null === i2) return void (this.Xa = []);
      const n2 = t2.At(), s2 = this.Ka(n2 - 1, i2), e2 = this.Ka(0, i2), r2 = this.Ii.W().entireTextOnly ? this.io() / 2 : 0, h2 = r2, l2 = n2 - 1 - r2, a2 = Math.max(s2, e2), o2 = Math.min(s2, e2);
      if (a2 === o2) return void (this.Xa = []);
      let _2 = this.Za(a2, o2), u2 = a2 % _2;
      u2 += u2 < 0 ? _2 : 0;
      const c2 = a2 >= o2 ? 1 : -1;
      let d2 = null, f2 = 0;
      for (let n3 = a2 - u2; n3 > o2; n3 -= _2) {
        const s3 = this.Ga(n3, i2, true);
        null !== d2 && Math.abs(s3 - d2) < this.Ja() || (s3 < h2 || s3 > l2 || (f2 < this.Xa.length ? (this.Xa[f2].Ia = s3, this.Xa[f2].no = t2.so(n3)) : this.Xa.push({ Ia: s3, no: t2.so(n3) }), f2++, d2 = s3, t2.eo() && (_2 = this.Za(n3 * c2, o2))));
      }
      this.Xa.length = f2;
    }
    ja() {
      return this.Xa;
    }
    io() {
      return this.Ii.P();
    }
    Ja() {
      return Math.ceil(2.5 * this.io());
    }
  }
  function un(t2) {
    return t2.slice().sort((t3, i2) => f(t3.Xi()) - f(i2.Xi()));
  }
  var cn;
  !function(t2) {
    t2[t2.Normal = 0] = "Normal", t2[t2.Logarithmic = 1] = "Logarithmic", t2[t2.Percentage = 2] = "Percentage", t2[t2.IndexedTo100 = 3] = "IndexedTo100";
  }(cn || (cn = {}));
  const dn = new ut(), fn = new _t(100, 1);
  class vn {
    constructor(t2, i2, n2, s2) {
      this.ro = 0, this.ho = null, this.Ah = null, this.lo = null, this.ao = { oo: false, _o: null }, this.uo = 0, this.co = 0, this.do = new C(), this.fo = new C(), this.vo = [], this.po = null, this.mo = null, this.bo = null, this.wo = null, this.ba = fn, this.Mo = an(null), this.xo = t2, this.cn = i2, this.So = n2, this.ko = s2, this.yo = new _n(this, 100, this.Co.bind(this), this.To.bind(this));
    }
    Ta() {
      return this.xo;
    }
    W() {
      return this.cn;
    }
    Hh(t2) {
      if (T(this.cn, t2), this.Pa(), void 0 !== t2.mode && this.Po({ yr: t2.mode }), void 0 !== t2.scaleMargins) {
        const i2 = d(t2.scaleMargins.top), n2 = d(t2.scaleMargins.bottom);
        if (i2 < 0 || i2 > 1) throw new Error(`Invalid top margin - expect value between 0 and 1, given=${i2}`);
        if (n2 < 0 || n2 > 1) throw new Error(`Invalid bottom margin - expect value between 0 and 1, given=${n2}`);
        if (i2 + n2 > 1) throw new Error(`Invalid margins - sum of margins must be less than 1, given=${i2 + n2}`);
        this.Ro(), this.mo = null;
      }
    }
    Do() {
      return this.cn.autoScale;
    }
    eo() {
      return 1 === this.cn.mode;
    }
    gh() {
      return 2 === this.cn.mode;
    }
    Oo() {
      return 3 === this.cn.mode;
    }
    yr() {
      return { Wn: this.cn.autoScale, Bo: this.cn.invertScale, yr: this.cn.mode };
    }
    Po(t2) {
      const i2 = this.yr();
      let n2 = null;
      void 0 !== t2.Wn && (this.cn.autoScale = t2.Wn), void 0 !== t2.yr && (this.cn.mode = t2.yr, 2 !== t2.yr && 3 !== t2.yr || (this.cn.autoScale = true), this.ao.oo = false), 1 === i2.yr && t2.yr !== i2.yr && (!function(t3, i3) {
        if (null === t3) return false;
        const n3 = rn(t3.Th(), i3), s3 = rn(t3.Ph(), i3);
        return isFinite(n3) && isFinite(s3);
      }(this.Ah, this.Mo) ? this.cn.autoScale = true : (n2 = ln(this.Ah, this.Mo), null !== n2 && this.Vo(n2))), 1 === t2.yr && t2.yr !== i2.yr && (n2 = hn(this.Ah, this.Mo), null !== n2 && this.Vo(n2));
      const s2 = i2.yr !== this.cn.mode;
      s2 && (2 === i2.yr || this.gh()) && this.Pa(), s2 && (3 === i2.yr || this.Oo()) && this.Pa(), void 0 !== t2.Bo && i2.Bo !== t2.Bo && (this.cn.invertScale = t2.Bo, this.Ao()), this.fo.m(i2, this.yr());
    }
    zo() {
      return this.fo;
    }
    P() {
      return this.So.fontSize;
    }
    At() {
      return this.ro;
    }
    Eo(t2) {
      this.ro !== t2 && (this.ro = t2, this.Ro(), this.mo = null);
    }
    Io() {
      if (this.ho) return this.ho;
      const t2 = this.At() - this.Lo() - this.No();
      return this.ho = t2, t2;
    }
    Eh() {
      return this.Fo(), this.Ah;
    }
    Vo(t2, i2) {
      const n2 = this.Ah;
      (i2 || null === n2 && null !== t2 || null !== n2 && !n2.yh(t2)) && (this.mo = null, this.Ah = t2);
    }
    Ni() {
      return this.Fo(), 0 === this.ro || !this.Ah || this.Ah.Ni();
    }
    Wo(t2) {
      return this.Bo() ? t2 : this.At() - 1 - t2;
    }
    Rt(t2, i2) {
      return this.gh() ? t2 = Qi(t2, i2) : this.Oo() && (t2 = nn(t2, i2)), this.To(t2, i2);
    }
    Qs(t2, i2, n2) {
      this.Fo();
      const s2 = this.No(), e2 = f(this.Eh()), r2 = e2.Th(), h2 = e2.Ph(), l2 = this.Io() - 1, a2 = this.Bo(), o2 = l2 / (h2 - r2), _2 = void 0 === n2 ? 0 : n2.from, u2 = void 0 === n2 ? t2.length : n2.to, c2 = this.jo();
      for (let n3 = _2; n3 < u2; n3++) {
        const e3 = t2[n3], h3 = e3._t;
        if (isNaN(h3)) continue;
        let l3 = h3;
        null !== c2 && (l3 = c2(e3._t, i2));
        const _3 = s2 + o2 * (l3 - r2), u3 = a2 ? _3 : this.ro - 1 - _3;
        e3.st = u3;
      }
    }
    me(t2, i2, n2) {
      this.Fo();
      const s2 = this.No(), e2 = f(this.Eh()), r2 = e2.Th(), h2 = e2.Ph(), l2 = this.Io() - 1, a2 = this.Bo(), o2 = l2 / (h2 - r2), _2 = void 0 === n2 ? 0 : n2.from, u2 = void 0 === n2 ? t2.length : n2.to, c2 = this.jo();
      for (let n3 = _2; n3 < u2; n3++) {
        const e3 = t2[n3];
        let h3 = e3.we, l3 = e3.ge, _3 = e3.Me, u3 = e3.xe;
        null !== c2 && (h3 = c2(e3.we, i2), l3 = c2(e3.ge, i2), _3 = c2(e3.Me, i2), u3 = c2(e3.xe, i2));
        let d2 = s2 + o2 * (h3 - r2), f2 = a2 ? d2 : this.ro - 1 - d2;
        e3.ve = f2, d2 = s2 + o2 * (l3 - r2), f2 = a2 ? d2 : this.ro - 1 - d2, e3.ce = f2, d2 = s2 + o2 * (_3 - r2), f2 = a2 ? d2 : this.ro - 1 - d2, e3.de = f2, d2 = s2 + o2 * (u3 - r2), f2 = a2 ? d2 : this.ro - 1 - d2, e3.pe = f2;
      }
    }
    pn(t2, i2) {
      const n2 = this.Co(t2, i2);
      return this.Ho(n2, i2);
    }
    Ho(t2, i2) {
      let n2 = t2;
      return this.gh() ? n2 = function(t3, i3) {
        return i3 < 0 && (t3 = -t3), t3 / 100 * i3 + i3;
      }(n2, i2) : this.Oo() && (n2 = function(t3, i3) {
        return t3 -= 100, i3 < 0 && (t3 = -t3), t3 / 100 * i3 + i3;
      }(n2, i2)), n2;
    }
    Ba() {
      return this.vo;
    }
    $o() {
      if (this.po) return this.po;
      let t2 = [];
      for (let i2 = 0; i2 < this.vo.length; i2++) {
        const n2 = this.vo[i2];
        null === n2.Xi() && n2.Ki(i2 + 1), t2.push(n2);
      }
      return t2 = un(t2), this.po = t2, this.po;
    }
    Uo(t2) {
      -1 === this.vo.indexOf(t2) && (this.vo.push(t2), this.Pa(), this.qo());
    }
    Yo(t2) {
      const i2 = this.vo.indexOf(t2);
      if (-1 === i2) throw new Error("source is not attached to scale");
      this.vo.splice(i2, 1), 0 === this.vo.length && (this.Po({ Wn: true }), this.Vo(null)), this.Pa(), this.qo();
    }
    Ct() {
      let t2 = null;
      for (const i2 of this.vo) {
        const n2 = i2.Ct();
        null !== n2 && ((null === t2 || n2.ha < t2.ha) && (t2 = n2));
      }
      return null === t2 ? null : t2.Ot;
    }
    Bo() {
      return this.cn.invertScale;
    }
    ja() {
      const t2 = null === this.Ct();
      if (null !== this.mo && (t2 || this.mo.Zo === t2)) return this.mo.ja;
      this.yo.Qa();
      const i2 = this.yo.ja();
      return this.mo = { ja: i2, Zo: t2 }, this.do.m(), i2;
    }
    Xo() {
      return this.do;
    }
    Ko(t2) {
      this.gh() || this.Oo() || null === this.bo && null === this.lo && (this.Ni() || (this.bo = this.ro - t2, this.lo = f(this.Eh()).Ch()));
    }
    Go(t2) {
      if (this.gh() || this.Oo()) return;
      if (null === this.bo) return;
      this.Po({ Wn: false }), (t2 = this.ro - t2) < 0 && (t2 = 0);
      let i2 = (this.bo + 0.2 * (this.ro - 1)) / (t2 + 0.2 * (this.ro - 1));
      const n2 = f(this.lo).Ch();
      i2 = Math.max(i2, 0.1), n2.Dh(i2), this.Vo(n2);
    }
    Jo() {
      this.gh() || this.Oo() || (this.bo = null, this.lo = null);
    }
    Qo(t2) {
      this.Do() || null === this.wo && null === this.lo && (this.Ni() || (this.wo = t2, this.lo = f(this.Eh()).Ch()));
    }
    t_(t2) {
      if (this.Do()) return;
      if (null === this.wo) return;
      const i2 = f(this.Eh()).Rh() / (this.Io() - 1);
      let n2 = t2 - this.wo;
      this.Bo() && (n2 *= -1);
      const s2 = n2 * i2, e2 = f(this.lo).Ch();
      e2.Oh(s2), this.Vo(e2, true), this.mo = null;
    }
    i_() {
      this.Do() || null !== this.wo && (this.wo = null, this.lo = null);
    }
    ma() {
      return this.ba || this.Pa(), this.ba;
    }
    Fi(t2, i2) {
      switch (this.cn.mode) {
        case 2:
          return this.n_(Qi(t2, i2));
        case 3:
          return this.ma().format(nn(t2, i2));
        default:
          return this.Fh(t2);
      }
    }
    so(t2) {
      switch (this.cn.mode) {
        case 2:
          return this.n_(t2);
        case 3:
          return this.ma().format(t2);
        default:
          return this.Fh(t2);
      }
    }
    ql(t2) {
      return this.Fh(t2, f(this.s_()).ma());
    }
    Yl(t2, i2) {
      return t2 = Qi(t2, i2), this.n_(t2, dn);
    }
    e_() {
      return this.vo;
    }
    r_(t2) {
      this.ao = { _o: t2, oo: false };
    }
    On() {
      this.vo.forEach((t2) => t2.On());
    }
    Pa() {
      this.mo = null;
      const t2 = this.s_();
      let i2 = 100;
      null !== t2 && (i2 = Math.round(1 / t2.pa())), this.ba = fn, this.gh() ? (this.ba = dn, i2 = 100) : this.Oo() ? (this.ba = new _t(100, 1), i2 = 100) : null !== t2 && (this.ba = t2.ma()), this.yo = new _n(this, i2, this.Co.bind(this), this.To.bind(this)), this.yo.Qa();
    }
    qo() {
      this.po = null;
    }
    s_() {
      return this.vo[0] || null;
    }
    Lo() {
      return this.Bo() ? this.cn.scaleMargins.bottom * this.At() + this.co : this.cn.scaleMargins.top * this.At() + this.uo;
    }
    No() {
      return this.Bo() ? this.cn.scaleMargins.top * this.At() + this.uo : this.cn.scaleMargins.bottom * this.At() + this.co;
    }
    Fo() {
      this.ao.oo || (this.ao.oo = true, this.h_());
    }
    Ro() {
      this.ho = null;
    }
    To(t2, i2) {
      if (this.Fo(), this.Ni()) return 0;
      t2 = this.eo() && t2 ? en(t2, this.Mo) : t2;
      const n2 = f(this.Eh()), s2 = this.No() + (this.Io() - 1) * (t2 - n2.Th()) / n2.Rh();
      return this.Wo(s2);
    }
    Co(t2, i2) {
      if (this.Fo(), this.Ni()) return 0;
      const n2 = this.Wo(t2), s2 = f(this.Eh()), e2 = s2.Th() + s2.Rh() * ((n2 - this.No()) / (this.Io() - 1));
      return this.eo() ? rn(e2, this.Mo) : e2;
    }
    Ao() {
      this.mo = null, this.yo.Qa();
    }
    h_() {
      const t2 = this.ao._o;
      if (null === t2) return;
      let i2 = null;
      const n2 = this.e_();
      let s2 = 0, e2 = 0;
      for (const r3 of n2) {
        if (!r3.yt()) continue;
        const n3 = r3.Ct();
        if (null === n3) continue;
        const h3 = r3.Al(t2.Os(), t2.ui());
        let l2 = h3 && h3.Eh();
        if (null !== l2) {
          switch (this.cn.mode) {
            case 1:
              l2 = hn(l2, this.Mo);
              break;
            case 2:
              l2 = tn(l2, n3.Ot);
              break;
            case 3:
              l2 = sn(l2, n3.Ot);
          }
          if (i2 = null === i2 ? l2 : i2.ts(f(l2)), null !== h3) {
            const t3 = h3.Ih();
            null !== t3 && (s2 = Math.max(s2, t3.above), e2 = Math.max(e2, t3.below));
          }
        }
      }
      if (s2 === this.uo && e2 === this.co || (this.uo = s2, this.co = e2, this.mo = null, this.Ro()), null !== i2) {
        if (i2.Th() === i2.Ph()) {
          const t3 = this.s_(), n3 = 5 * (null === t3 || this.gh() || this.Oo() ? 1 : t3.pa());
          this.eo() && (i2 = ln(i2, this.Mo)), i2 = new yi(i2.Th() - n3, i2.Ph() + n3), this.eo() && (i2 = hn(i2, this.Mo));
        }
        if (this.eo()) {
          const t3 = ln(i2, this.Mo), n3 = an(t3);
          if (r2 = n3, h2 = this.Mo, r2.Ha !== h2.Ha || r2.$a !== h2.$a) {
            const s3 = null !== this.lo ? ln(this.lo, this.Mo) : null;
            this.Mo = n3, i2 = hn(t3, n3), null !== s3 && (this.lo = hn(s3, n3));
          }
        }
        this.Vo(i2);
      } else null === this.Ah && (this.Vo(new yi(-0.5, 0.5)), this.Mo = an(null));
      var r2, h2;
      this.ao.oo = true;
    }
    jo() {
      return this.gh() ? Qi : this.Oo() ? nn : this.eo() ? (t2) => en(t2, this.Mo) : null;
    }
    l_(t2, i2, n2) {
      return void 0 === i2 ? (void 0 === n2 && (n2 = this.ma()), n2.format(t2)) : i2(t2);
    }
    Fh(t2, i2) {
      return this.l_(t2, this.ko.priceFormatter, i2);
    }
    n_(t2, i2) {
      return this.l_(t2, this.ko.percentageFormatter, i2);
    }
  }
  class pn {
    constructor(t2, i2) {
      this.vo = [], this.a_ = /* @__PURE__ */ new Map(), this.ro = 0, this.o_ = 0, this.__ = 1e3, this.po = null, this.u_ = new C(), this.kl = t2, this.$i = i2, this.c_ = new Gi(this);
      const n2 = i2.W();
      this.d_ = this.f_("left", n2.leftPriceScale), this.v_ = this.f_("right", n2.rightPriceScale), this.d_.zo().l(this.p_.bind(this, this.d_), this), this.v_.zo().l(this.p_.bind(this, this.v_), this), this.m_(n2);
    }
    m_(t2) {
      if (t2.leftPriceScale && this.d_.Hh(t2.leftPriceScale), t2.rightPriceScale && this.v_.Hh(t2.rightPriceScale), t2.localization && (this.d_.Pa(), this.v_.Pa()), t2.overlayPriceScales) {
        const i2 = Array.from(this.a_.values());
        for (const n2 of i2) {
          const i3 = f(n2[0].Dt());
          i3.Hh(t2.overlayPriceScales), t2.localization && i3.Pa();
        }
      }
    }
    b_(t2) {
      switch (t2) {
        case "left":
          return this.d_;
        case "right":
          return this.v_;
      }
      return this.a_.has(t2) ? d(this.a_.get(t2))[0].Dt() : null;
    }
    S() {
      this.$t().w_().p(this), this.d_.zo().p(this), this.v_.zo().p(this), this.vo.forEach((t2) => {
        t2.S && t2.S();
      }), this.u_.m();
    }
    g_() {
      return this.__;
    }
    M_(t2) {
      this.__ = t2;
    }
    $t() {
      return this.$i;
    }
    Hi() {
      return this.o_;
    }
    At() {
      return this.ro;
    }
    x_(t2) {
      this.o_ = t2, this.S_();
    }
    Eo(t2) {
      this.ro = t2, this.d_.Eo(t2), this.v_.Eo(t2), this.vo.forEach((i2) => {
        if (this.dr(i2)) {
          const n2 = i2.Dt();
          null !== n2 && n2.Eo(t2);
        }
      }), this.S_();
    }
    Ba() {
      return this.vo;
    }
    dr(t2) {
      const i2 = t2.Dt();
      return null === i2 || this.d_ !== i2 && this.v_ !== i2;
    }
    Uo(t2, i2, n2) {
      const s2 = void 0 !== n2 ? n2 : this.y_().k_ + 1;
      this.C_(t2, i2, s2);
    }
    Yo(t2) {
      const i2 = this.vo.indexOf(t2);
      c(-1 !== i2, "removeDataSource: invalid data source"), this.vo.splice(i2, 1);
      const n2 = f(t2.Dt()).Ta();
      if (this.a_.has(n2)) {
        const i3 = d(this.a_.get(n2)), s3 = i3.indexOf(t2);
        -1 !== s3 && (i3.splice(s3, 1), 0 === i3.length && this.a_.delete(n2));
      }
      const s2 = t2.Dt();
      s2 && s2.Ba().indexOf(t2) >= 0 && s2.Yo(t2), null !== s2 && (s2.qo(), this.T_(s2)), this.po = null;
    }
    pr(t2) {
      return t2 === this.d_ ? "left" : t2 === this.v_ ? "right" : "overlay";
    }
    P_() {
      return this.d_;
    }
    R_() {
      return this.v_;
    }
    D_(t2, i2) {
      t2.Ko(i2);
    }
    O_(t2, i2) {
      t2.Go(i2), this.S_();
    }
    B_(t2) {
      t2.Jo();
    }
    V_(t2, i2) {
      t2.Qo(i2);
    }
    A_(t2, i2) {
      t2.t_(i2), this.S_();
    }
    z_(t2) {
      t2.i_();
    }
    S_() {
      this.vo.forEach((t2) => {
        t2.On();
      });
    }
    vn() {
      let t2 = null;
      return this.$i.W().rightPriceScale.visible && 0 !== this.v_.Ba().length ? t2 = this.v_ : this.$i.W().leftPriceScale.visible && 0 !== this.d_.Ba().length ? t2 = this.d_ : 0 !== this.vo.length && (t2 = this.vo[0].Dt()), null === t2 && (t2 = this.v_), t2;
    }
    vr() {
      let t2 = null;
      return this.$i.W().rightPriceScale.visible ? t2 = this.v_ : this.$i.W().leftPriceScale.visible && (t2 = this.d_), t2;
    }
    T_(t2) {
      null !== t2 && t2.Do() && this.E_(t2);
    }
    I_(t2) {
      const i2 = this.kl.Zs();
      t2.Po({ Wn: true }), null !== i2 && t2.r_(i2), this.S_();
    }
    L_() {
      this.E_(this.d_), this.E_(this.v_);
    }
    N_() {
      this.T_(this.d_), this.T_(this.v_), this.vo.forEach((t2) => {
        this.dr(t2) && this.T_(t2.Dt());
      }), this.S_(), this.$i.$h();
    }
    $o() {
      return null === this.po && (this.po = un(this.vo)), this.po;
    }
    F_() {
      return this.u_;
    }
    W_() {
      return this.c_;
    }
    E_(t2) {
      const i2 = t2.e_();
      if (i2 && i2.length > 0 && !this.kl.Ni()) {
        const i3 = this.kl.Zs();
        null !== i3 && t2.r_(i3);
      }
      t2.On();
    }
    y_() {
      const t2 = this.$o();
      if (0 === t2.length) return { j_: 0, k_: 0 };
      let i2 = 0, n2 = 0;
      for (let s2 = 0; s2 < t2.length; s2++) {
        const e2 = t2[s2].Xi();
        null !== e2 && (e2 < i2 && (i2 = e2), e2 > n2 && (n2 = e2));
      }
      return { j_: i2, k_: n2 };
    }
    C_(t2, i2, n2) {
      let s2 = this.b_(i2);
      if (null === s2 && (s2 = this.f_(i2, this.$i.W().overlayPriceScales)), this.vo.push(t2), !ht(i2)) {
        const n3 = this.a_.get(i2) || [];
        n3.push(t2), this.a_.set(i2, n3);
      }
      s2.Uo(t2), t2.Gi(s2), t2.Ki(n2), this.T_(s2), this.po = null;
    }
    p_(t2, i2, n2) {
      i2.yr !== n2.yr && this.E_(t2);
    }
    f_(t2, i2) {
      const n2 = Object.assign({ visible: true, autoScale: true }, B(i2)), s2 = new vn(t2, n2, this.$i.W().layout, this.$i.W().localization);
      return s2.Eo(this.At()), s2;
    }
  }
  class mn {
    constructor(t2, i2, n2 = 50) {
      this.Xe = 0, this.Ke = 1, this.Ge = 1, this.Qe = /* @__PURE__ */ new Map(), this.Je = /* @__PURE__ */ new Map(), this.H_ = t2, this.U_ = i2, this.tr = n2;
    }
    q_(t2) {
      const i2 = t2.time, n2 = this.U_.cacheKey(i2), s2 = this.Qe.get(n2);
      if (void 0 !== s2) return s2.Y_;
      if (this.Xe === this.tr) {
        const t3 = this.Je.get(this.Ge);
        this.Je.delete(this.Ge), this.Qe.delete(d(t3)), this.Ge++, this.Xe--;
      }
      const e2 = this.H_(t2);
      return this.Qe.set(n2, { Y_: e2, er: this.Ke }), this.Je.set(this.Ke, n2), this.Xe++, this.Ke++, e2;
    }
  }
  class bn {
    constructor(t2, i2) {
      c(t2 <= i2, "right should be >= left"), this.Z_ = t2, this.X_ = i2;
    }
    Os() {
      return this.Z_;
    }
    ui() {
      return this.X_;
    }
    K_() {
      return this.X_ - this.Z_ + 1;
    }
    Xr(t2) {
      return this.Z_ <= t2 && t2 <= this.X_;
    }
    yh(t2) {
      return this.Z_ === t2.Os() && this.X_ === t2.ui();
    }
  }
  function wn(t2, i2) {
    return null === t2 || null === i2 ? t2 === i2 : t2.yh(i2);
  }
  class gn {
    constructor() {
      this.G_ = /* @__PURE__ */ new Map(), this.Qe = null, this.J_ = false;
    }
    Q_(t2) {
      this.J_ = t2, this.Qe = null;
    }
    tu(t2, i2) {
      this.iu(i2), this.Qe = null;
      for (let n2 = i2; n2 < t2.length; ++n2) {
        const i3 = t2[n2];
        let s2 = this.G_.get(i3.timeWeight);
        void 0 === s2 && (s2 = [], this.G_.set(i3.timeWeight, s2)), s2.push({ index: n2, time: i3.time, weight: i3.timeWeight, originalTime: i3.originalTime });
      }
    }
    nu(t2, i2) {
      const n2 = Math.ceil(i2 / t2);
      return null !== this.Qe && this.Qe.su === n2 || (this.Qe = { ja: this.eu(n2), su: n2 }), this.Qe.ja;
    }
    iu(t2) {
      if (0 === t2) return void this.G_.clear();
      const i2 = [];
      this.G_.forEach((n2, s2) => {
        t2 <= n2[0].index ? i2.push(s2) : n2.splice(Rt(n2, t2, (i3) => i3.index < t2), 1 / 0);
      });
      for (const t3 of i2) this.G_.delete(t3);
    }
    eu(t2) {
      let i2 = [];
      for (const n2 of Array.from(this.G_.keys()).sort((t3, i3) => i3 - t3)) {
        if (!this.G_.get(n2)) continue;
        const s2 = i2;
        i2 = [];
        const e2 = s2.length;
        let r2 = 0;
        const h2 = d(this.G_.get(n2)), l2 = h2.length;
        let a2 = 1 / 0, o2 = -1 / 0;
        for (let n3 = 0; n3 < l2; n3++) {
          const l3 = h2[n3], _2 = l3.index;
          for (; r2 < e2; ) {
            const t3 = s2[r2], n4 = t3.index;
            if (!(n4 < _2)) {
              a2 = n4;
              break;
            }
            r2++, i2.push(t3), o2 = n4, a2 = 1 / 0;
          }
          if (a2 - _2 >= t2 && _2 - o2 >= t2) i2.push(l3), o2 = _2;
          else if (this.J_) return s2;
        }
        for (; r2 < e2; r2++) i2.push(s2[r2]);
      }
      return i2;
    }
  }
  class Mn {
    constructor(t2) {
      this.ru = t2;
    }
    hu() {
      return null === this.ru ? null : new bn(Math.floor(this.ru.Os()), Math.ceil(this.ru.ui()));
    }
    lu() {
      return this.ru;
    }
    static au() {
      return new Mn(null);
    }
  }
  function xn(t2, i2) {
    return t2.weight > i2.weight ? t2 : i2;
  }
  class Sn {
    constructor(t2, i2, n2, s2) {
      this.o_ = 0, this.ou = null, this._u = [], this.wo = null, this.bo = null, this.uu = new gn(), this.cu = /* @__PURE__ */ new Map(), this.du = Mn.au(), this.fu = true, this.vu = new C(), this.pu = new C(), this.mu = new C(), this.bu = null, this.wu = null, this.gu = [], this.cn = i2, this.ko = n2, this.Mu = i2.rightOffset, this.xu = i2.barSpacing, this.$i = t2, this.U_ = s2, this.Su(), this.uu.Q_(i2.uniformDistribution);
    }
    W() {
      return this.cn;
    }
    ku(t2) {
      T(this.ko, t2), this.yu(), this.Su();
    }
    Hh(t2, i2) {
      var n2;
      T(this.cn, t2), this.cn.fixLeftEdge && this.Cu(), this.cn.fixRightEdge && this.Tu(), void 0 !== t2.barSpacing && this.$i.Gn(t2.barSpacing), void 0 !== t2.rightOffset && this.$i.Jn(t2.rightOffset), void 0 !== t2.minBarSpacing && this.$i.Gn(null !== (n2 = t2.barSpacing) && void 0 !== n2 ? n2 : this.xu), this.yu(), this.Su(), this.mu.m();
    }
    mn(t2) {
      var i2, n2;
      return null !== (n2 = null === (i2 = this._u[t2]) || void 0 === i2 ? void 0 : i2.time) && void 0 !== n2 ? n2 : null;
    }
    Ui(t2) {
      var i2;
      return null !== (i2 = this._u[t2]) && void 0 !== i2 ? i2 : null;
    }
    Da(t2, i2) {
      if (this._u.length < 1) return null;
      if (this.U_.key(t2) > this.U_.key(this._u[this._u.length - 1].time)) return i2 ? this._u.length - 1 : null;
      const n2 = Rt(this._u, this.U_.key(t2), (t3, i3) => this.U_.key(t3.time) < i3);
      return this.U_.key(t2) < this.U_.key(this._u[n2].time) ? i2 ? n2 : null : n2;
    }
    Ni() {
      return 0 === this.o_ || 0 === this._u.length || null === this.ou;
    }
    Ra() {
      return this._u.length > 0;
    }
    Zs() {
      return this.Pu(), this.du.hu();
    }
    Ru() {
      return this.Pu(), this.du.lu();
    }
    Du() {
      const t2 = this.Zs();
      if (null === t2) return null;
      const i2 = { from: t2.Os(), to: t2.ui() };
      return this.Ou(i2);
    }
    Ou(t2) {
      const i2 = Math.round(t2.from), n2 = Math.round(t2.to), s2 = f(this.Bu()), e2 = f(this.Vu());
      return { from: f(this.Ui(Math.max(s2, i2))), to: f(this.Ui(Math.min(e2, n2))) };
    }
    Au(t2) {
      return { from: f(this.Da(t2.from, true)), to: f(this.Da(t2.to, true)) };
    }
    Hi() {
      return this.o_;
    }
    x_(t2) {
      if (!isFinite(t2) || t2 <= 0) return;
      if (this.o_ === t2) return;
      const i2 = this.Ru(), n2 = this.o_;
      if (this.o_ = t2, this.fu = true, this.cn.lockVisibleTimeRangeOnResize && 0 !== n2) {
        const i3 = this.xu * t2 / n2;
        this.xu = i3;
      }
      if (this.cn.fixLeftEdge && null !== i2 && i2.Os() <= 0) {
        const i3 = n2 - t2;
        this.Mu -= Math.round(i3 / this.xu) + 1, this.fu = true;
      }
      this.zu(), this.Eu();
    }
    zt(t2) {
      if (this.Ni() || !R(t2)) return 0;
      const i2 = this.Iu() + this.Mu - t2;
      return this.o_ - (i2 + 0.5) * this.xu - 1;
    }
    Js(t2, i2) {
      const n2 = this.Iu(), s2 = void 0 === i2 ? 0 : i2.from, e2 = void 0 === i2 ? t2.length : i2.to;
      for (let i3 = s2; i3 < e2; i3++) {
        const s3 = t2[i3].ot, e3 = n2 + this.Mu - s3, r2 = this.o_ - (e3 + 0.5) * this.xu - 1;
        t2[i3].nt = r2;
      }
    }
    Lu(t2) {
      return Math.ceil(this.Nu(t2));
    }
    Jn(t2) {
      this.fu = true, this.Mu = t2, this.Eu(), this.$i.Fu(), this.$i.$h();
    }
    he() {
      return this.xu;
    }
    Gn(t2) {
      this.Wu(t2), this.Eu(), this.$i.Fu(), this.$i.$h();
    }
    ju() {
      return this.Mu;
    }
    ja() {
      if (this.Ni()) return null;
      if (null !== this.wu) return this.wu;
      const t2 = this.xu, i2 = 5 * (this.$i.W().layout.fontSize + 4) / 8 * (this.cn.tickMarkMaxCharacterLength || 8), n2 = Math.round(i2 / t2), s2 = f(this.Zs()), e2 = Math.max(s2.Os(), s2.Os() - n2), r2 = Math.max(s2.ui(), s2.ui() - n2), h2 = this.uu.nu(t2, i2), l2 = this.Bu() + n2, a2 = this.Vu() - n2, o2 = this.Hu(), _2 = this.cn.fixLeftEdge || o2, u2 = this.cn.fixRightEdge || o2;
      let c2 = 0;
      for (const t3 of h2) {
        if (!(e2 <= t3.index && t3.index <= r2)) continue;
        let n3;
        c2 < this.gu.length ? (n3 = this.gu[c2], n3.coord = this.zt(t3.index), n3.label = this.$u(t3), n3.weight = t3.weight) : (n3 = { needAlignCoordinate: false, coord: this.zt(t3.index), label: this.$u(t3), weight: t3.weight }, this.gu.push(n3)), this.xu > i2 / 2 && !o2 ? n3.needAlignCoordinate = false : n3.needAlignCoordinate = _2 && t3.index <= l2 || u2 && t3.index >= a2, c2++;
      }
      return this.gu.length = c2, this.wu = this.gu, this.gu;
    }
    Uu() {
      this.fu = true, this.Gn(this.cn.barSpacing), this.Jn(this.cn.rightOffset);
    }
    qu(t2) {
      this.fu = true, this.ou = t2, this.Eu(), this.Cu();
    }
    Yu(t2, i2) {
      const n2 = this.Nu(t2), s2 = this.he(), e2 = s2 + i2 * (s2 / 10);
      this.Gn(e2), this.cn.rightBarStaysOnScroll || this.Jn(this.ju() + (n2 - this.Nu(t2)));
    }
    Ko(t2) {
      this.wo && this.i_(), null === this.bo && null === this.bu && (this.Ni() || (this.bo = t2, this.Zu()));
    }
    Go(t2) {
      if (null === this.bu) return;
      const i2 = gt(this.o_ - t2, 0, this.o_), n2 = gt(this.o_ - f(this.bo), 0, this.o_);
      0 !== i2 && 0 !== n2 && this.Gn(this.bu.he * i2 / n2);
    }
    Jo() {
      null !== this.bo && (this.bo = null, this.Xu());
    }
    Qo(t2) {
      null === this.wo && null === this.bu && (this.Ni() || (this.wo = t2, this.Zu()));
    }
    t_(t2) {
      if (null === this.wo) return;
      const i2 = (this.wo - t2) / this.he();
      this.Mu = f(this.bu).ju + i2, this.fu = true, this.Eu();
    }
    i_() {
      null !== this.wo && (this.wo = null, this.Xu());
    }
    Ku() {
      this.Gu(this.cn.rightOffset);
    }
    Gu(t2, i2 = 400) {
      if (!isFinite(t2)) throw new RangeError("offset is required and must be finite number");
      if (!isFinite(i2) || i2 <= 0) throw new RangeError("animationDuration (optional) must be finite positive number");
      const n2 = this.Mu, s2 = performance.now();
      this.$i.Zn({ Ju: (t3) => (t3 - s2) / i2 >= 1, Qu: (e2) => {
        const r2 = (e2 - s2) / i2;
        return r2 >= 1 ? t2 : n2 + (t2 - n2) * r2;
      } });
    }
    bt(t2, i2) {
      this.fu = true, this._u = t2, this.uu.tu(t2, i2), this.Eu();
    }
    tc() {
      return this.vu;
    }
    nc() {
      return this.pu;
    }
    sc() {
      return this.mu;
    }
    Iu() {
      return this.ou || 0;
    }
    ec(t2) {
      const i2 = t2.K_();
      this.Wu(this.o_ / i2), this.Mu = t2.ui() - this.Iu(), this.Eu(), this.fu = true, this.$i.Fu(), this.$i.$h();
    }
    rc() {
      const t2 = this.Bu(), i2 = this.Vu();
      null !== t2 && null !== i2 && this.ec(new bn(t2, i2 + this.cn.rightOffset));
    }
    hc(t2) {
      const i2 = new bn(t2.from, t2.to);
      this.ec(i2);
    }
    qi(t2) {
      return void 0 !== this.ko.timeFormatter ? this.ko.timeFormatter(t2.originalTime) : this.U_.formatHorzItem(t2.time);
    }
    Hu() {
      const { handleScroll: t2, handleScale: i2 } = this.$i.W();
      return !(t2.horzTouchDrag || t2.mouseWheel || t2.pressedMouseMove || t2.vertTouchDrag || i2.axisDoubleClickReset.time || i2.axisPressedMouseMove.time || i2.mouseWheel || i2.pinch);
    }
    Bu() {
      return 0 === this._u.length ? null : 0;
    }
    Vu() {
      return 0 === this._u.length ? null : this._u.length - 1;
    }
    lc(t2) {
      return (this.o_ - 1 - t2) / this.xu;
    }
    Nu(t2) {
      const i2 = this.lc(t2), n2 = this.Iu() + this.Mu - i2;
      return Math.round(1e6 * n2) / 1e6;
    }
    Wu(t2) {
      const i2 = this.xu;
      this.xu = t2, this.zu(), i2 !== this.xu && (this.fu = true, this.ac());
    }
    Pu() {
      if (!this.fu) return;
      if (this.fu = false, this.Ni()) return void this.oc(Mn.au());
      const t2 = this.Iu(), i2 = this.o_ / this.xu, n2 = this.Mu + t2, s2 = new bn(n2 - i2 + 1, n2);
      this.oc(new Mn(s2));
    }
    zu() {
      const t2 = this._c();
      if (this.xu < t2 && (this.xu = t2, this.fu = true), 0 !== this.o_) {
        const t3 = 0.5 * this.o_;
        this.xu > t3 && (this.xu = t3, this.fu = true);
      }
    }
    _c() {
      return this.cn.fixLeftEdge && this.cn.fixRightEdge && 0 !== this._u.length ? this.o_ / this._u.length : this.cn.minBarSpacing;
    }
    Eu() {
      const t2 = this.uc();
      this.Mu > t2 && (this.Mu = t2, this.fu = true);
      const i2 = this.cc();
      null !== i2 && this.Mu < i2 && (this.Mu = i2, this.fu = true);
    }
    cc() {
      const t2 = this.Bu(), i2 = this.ou;
      if (null === t2 || null === i2) return null;
      return t2 - i2 - 1 + (this.cn.fixLeftEdge ? this.o_ / this.xu : Math.min(2, this._u.length));
    }
    uc() {
      return this.cn.fixRightEdge ? 0 : this.o_ / this.xu - Math.min(2, this._u.length);
    }
    Zu() {
      this.bu = { he: this.he(), ju: this.ju() };
    }
    Xu() {
      this.bu = null;
    }
    $u(t2) {
      let i2 = this.cu.get(t2.weight);
      return void 0 === i2 && (i2 = new mn((t3) => this.dc(t3), this.U_), this.cu.set(t2.weight, i2)), i2.q_(t2);
    }
    dc(t2) {
      return this.U_.formatTickmark(t2, this.ko);
    }
    oc(t2) {
      const i2 = this.du;
      this.du = t2, wn(i2.hu(), this.du.hu()) || this.vu.m(), wn(i2.lu(), this.du.lu()) || this.pu.m(), this.ac();
    }
    ac() {
      this.wu = null;
    }
    yu() {
      this.ac(), this.cu.clear();
    }
    Su() {
      this.U_.updateFormatter(this.ko);
    }
    Cu() {
      if (!this.cn.fixLeftEdge) return;
      const t2 = this.Bu();
      if (null === t2) return;
      const i2 = this.Zs();
      if (null === i2) return;
      const n2 = i2.Os() - t2;
      if (n2 < 0) {
        const t3 = this.Mu - n2 - 1;
        this.Jn(t3);
      }
      this.zu();
    }
    Tu() {
      this.Eu(), this.zu();
    }
  }
  class kn {
    X(t2, i2, n2) {
      t2.useMediaCoordinateSpace((t3) => this.K(t3, i2, n2));
    }
    wl(t2, i2, n2) {
      t2.useMediaCoordinateSpace((t3) => this.fc(t3, i2, n2));
    }
    fc(t2, i2, n2) {
    }
  }
  class yn extends kn {
    constructor(t2) {
      super(), this.vc = /* @__PURE__ */ new Map(), this.Et = t2;
    }
    K(t2) {
    }
    fc(t2) {
      if (!this.Et.yt) return;
      const { context: i2, mediaSize: n2 } = t2;
      let s2 = 0;
      for (const t3 of this.Et.mc) {
        if (0 === t3.Kt.length) continue;
        i2.font = t3.R;
        const e3 = this.bc(i2, t3.Kt);
        e3 > n2.width ? t3.Yu = n2.width / e3 : t3.Yu = 1, s2 += t3.wc * t3.Yu;
      }
      let e2 = 0;
      switch (this.Et.gc) {
        case "top":
          e2 = 0;
          break;
        case "center":
          e2 = Math.max((n2.height - s2) / 2, 0);
          break;
        case "bottom":
          e2 = Math.max(n2.height - s2, 0);
      }
      i2.fillStyle = this.Et.O;
      for (const t3 of this.Et.mc) {
        i2.save();
        let s3 = 0;
        switch (this.Et.Mc) {
          case "left":
            i2.textAlign = "left", s3 = t3.wc / 2;
            break;
          case "center":
            i2.textAlign = "center", s3 = n2.width / 2;
            break;
          case "right":
            i2.textAlign = "right", s3 = n2.width - 1 - t3.wc / 2;
        }
        i2.translate(s3, e2), i2.textBaseline = "top", i2.font = t3.R, i2.scale(t3.Yu, t3.Yu), i2.fillText(t3.Kt, 0, t3.xc), i2.restore(), e2 += t3.wc * t3.Yu;
      }
    }
    bc(t2, i2) {
      const n2 = this.Sc(t2.font);
      let s2 = n2.get(i2);
      return void 0 === s2 && (s2 = t2.measureText(i2).width, n2.set(i2, s2)), s2;
    }
    Sc(t2) {
      let i2 = this.vc.get(t2);
      return void 0 === i2 && (i2 = /* @__PURE__ */ new Map(), this.vc.set(t2, i2)), i2;
    }
  }
  class Cn {
    constructor(t2) {
      this.ft = true, this.Ft = { yt: false, O: "", mc: [], gc: "center", Mc: "center" }, this.Wt = new yn(this.Ft), this.jt = t2;
    }
    bt() {
      this.ft = true;
    }
    gt() {
      return this.ft && (this.Mt(), this.ft = false), this.Wt;
    }
    Mt() {
      const t2 = this.jt.W(), i2 = this.Ft;
      i2.yt = t2.visible, i2.yt && (i2.O = t2.color, i2.Mc = t2.horzAlign, i2.gc = t2.vertAlign, i2.mc = [{ Kt: t2.text, R: E(t2.fontSize, t2.fontFamily, t2.fontStyle), wc: 1.2 * t2.fontSize, xc: 0, Yu: 0 }]);
    }
  }
  class Tn extends st {
    constructor(t2, i2) {
      super(), this.cn = i2, this.wn = new Cn(this);
    }
    Rn() {
      return [];
    }
    Pn() {
      return [this.wn];
    }
    W() {
      return this.cn;
    }
    On() {
      this.wn.bt();
    }
  }
  var Pn, Rn, Dn, On, Bn;
  !function(t2) {
    t2[t2.OnTouchEnd = 0] = "OnTouchEnd", t2[t2.OnNextTap = 1] = "OnNextTap";
  }(Pn || (Pn = {}));
  class Vn {
    constructor(t2, i2, n2) {
      this.kc = [], this.yc = [], this.o_ = 0, this.Cc = null, this.Tc = new C(), this.Pc = new C(), this.Rc = null, this.Dc = t2, this.cn = i2, this.U_ = n2, this.Oc = new I(this), this.kl = new Sn(this, i2.timeScale, this.cn.localization, n2), this.vt = new rt(this, i2.crosshair), this.Bc = new Zi(i2.crosshair), this.Vc = new Tn(this, i2.watermark), this.Ac(), this.kc[0].M_(2e3), this.zc = this.Ec(0), this.Ic = this.Ec(1);
    }
    Xl() {
      this.Lc(lt.es());
    }
    $h() {
      this.Lc(lt.ss());
    }
    aa() {
      this.Lc(new lt(1));
    }
    Kl(t2) {
      const i2 = this.Nc(t2);
      this.Lc(i2);
    }
    Fc() {
      return this.Cc;
    }
    Wc(t2) {
      const i2 = this.Cc;
      this.Cc = t2, null !== i2 && this.Kl(i2.jc), null !== t2 && this.Kl(t2.jc);
    }
    W() {
      return this.cn;
    }
    Hh(t2) {
      T(this.cn, t2), this.kc.forEach((i2) => i2.m_(t2)), void 0 !== t2.timeScale && this.kl.Hh(t2.timeScale), void 0 !== t2.localization && this.kl.ku(t2.localization), (t2.leftPriceScale || t2.rightPriceScale) && this.Tc.m(), this.zc = this.Ec(0), this.Ic = this.Ec(1), this.Xl();
    }
    Hc(t2, i2) {
      if ("left" === t2) return void this.Hh({ leftPriceScale: i2 });
      if ("right" === t2) return void this.Hh({ rightPriceScale: i2 });
      const n2 = this.$c(t2);
      null !== n2 && (n2.Dt.Hh(i2), this.Tc.m());
    }
    $c(t2) {
      for (const i2 of this.kc) {
        const n2 = i2.b_(t2);
        if (null !== n2) return { Ht: i2, Dt: n2 };
      }
      return null;
    }
    St() {
      return this.kl;
    }
    Uc() {
      return this.kc;
    }
    qc() {
      return this.Vc;
    }
    Yc() {
      return this.vt;
    }
    Zc() {
      return this.Pc;
    }
    Xc(t2, i2) {
      t2.Eo(i2), this.Fu();
    }
    x_(t2) {
      this.o_ = t2, this.kl.x_(this.o_), this.kc.forEach((i2) => i2.x_(t2)), this.Fu();
    }
    Ac(t2) {
      const i2 = new pn(this.kl, this);
      void 0 !== t2 ? this.kc.splice(t2, 0, i2) : this.kc.push(i2);
      const n2 = void 0 === t2 ? this.kc.length - 1 : t2, s2 = lt.es();
      return s2.Nn(n2, { Fn: 0, Wn: true }), this.Lc(s2), i2;
    }
    D_(t2, i2, n2) {
      t2.D_(i2, n2);
    }
    O_(t2, i2, n2) {
      t2.O_(i2, n2), this.Gl(), this.Lc(this.Kc(t2, 2));
    }
    B_(t2, i2) {
      t2.B_(i2), this.Lc(this.Kc(t2, 2));
    }
    V_(t2, i2, n2) {
      i2.Do() || t2.V_(i2, n2);
    }
    A_(t2, i2, n2) {
      i2.Do() || (t2.A_(i2, n2), this.Gl(), this.Lc(this.Kc(t2, 2)));
    }
    z_(t2, i2) {
      i2.Do() || (t2.z_(i2), this.Lc(this.Kc(t2, 2)));
    }
    I_(t2, i2) {
      t2.I_(i2), this.Lc(this.Kc(t2, 2));
    }
    Gc(t2) {
      this.kl.Ko(t2);
    }
    Jc(t2, i2) {
      const n2 = this.St();
      if (n2.Ni() || 0 === i2) return;
      const s2 = n2.Hi();
      t2 = Math.max(1, Math.min(t2, s2)), n2.Yu(t2, i2), this.Fu();
    }
    Qc(t2) {
      this.td(0), this.nd(t2), this.sd();
    }
    ed(t2) {
      this.kl.Go(t2), this.Fu();
    }
    rd() {
      this.kl.Jo(), this.$h();
    }
    td(t2) {
      this.kl.Qo(t2);
    }
    nd(t2) {
      this.kl.t_(t2), this.Fu();
    }
    sd() {
      this.kl.i_(), this.$h();
    }
    wt() {
      return this.yc;
    }
    hd(t2, i2, n2, s2, e2) {
      this.vt.gn(t2, i2);
      let r2 = NaN, h2 = this.kl.Lu(t2);
      const l2 = this.kl.Zs();
      null !== l2 && (h2 = Math.min(Math.max(l2.Os(), h2), l2.ui()));
      const a2 = s2.vn(), o2 = a2.Ct();
      null !== o2 && (r2 = a2.pn(i2, o2)), r2 = this.Bc.Oa(r2, h2, s2), this.vt.kn(h2, r2, s2), this.aa(), e2 || this.Pc.m(this.vt.xt(), { x: t2, y: i2 }, n2);
    }
    ld(t2, i2, n2) {
      const s2 = n2.vn(), e2 = s2.Ct(), r2 = s2.Rt(t2, f(e2)), h2 = this.kl.Da(i2, true), l2 = this.kl.zt(f(h2));
      this.hd(l2, r2, null, n2, true);
    }
    ad(t2) {
      this.Yc().Cn(), this.aa(), t2 || this.Pc.m(null, null, null);
    }
    Gl() {
      const t2 = this.vt.Ht();
      if (null !== t2) {
        const i2 = this.vt.xn(), n2 = this.vt.Sn();
        this.hd(i2, n2, null, t2);
      }
      this.vt.On();
    }
    od(t2, i2, n2) {
      const s2 = this.kl.mn(0);
      void 0 !== i2 && void 0 !== n2 && this.kl.bt(i2, n2);
      const e2 = this.kl.mn(0), r2 = this.kl.Iu(), h2 = this.kl.Zs();
      if (null !== h2 && null !== s2 && null !== e2) {
        const i3 = h2.Xr(r2), l2 = this.U_.key(s2) > this.U_.key(e2), a2 = null !== t2 && t2 > r2 && !l2, o2 = this.kl.W().allowShiftVisibleRangeOnWhitespaceReplacement, _2 = i3 && (!(void 0 === n2) || o2) && this.kl.W().shiftVisibleRangeOnNewBar;
        if (a2 && !_2) {
          const i4 = t2 - r2;
          this.kl.Jn(this.kl.ju() - i4);
        }
      }
      this.kl.qu(t2);
    }
    ta(t2) {
      null !== t2 && t2.N_();
    }
    cr(t2) {
      const i2 = this.kc.find((i3) => i3.$o().includes(t2));
      return void 0 === i2 ? null : i2;
    }
    Fu() {
      this.Vc.On(), this.kc.forEach((t2) => t2.N_()), this.Gl();
    }
    S() {
      this.kc.forEach((t2) => t2.S()), this.kc.length = 0, this.cn.localization.priceFormatter = void 0, this.cn.localization.percentageFormatter = void 0, this.cn.localization.timeFormatter = void 0;
    }
    _d() {
      return this.Oc;
    }
    mr() {
      return this.Oc.W();
    }
    w_() {
      return this.Tc;
    }
    ud(t2, i2, n2) {
      const s2 = this.kc[0], e2 = this.dd(i2, t2, s2, n2);
      return this.yc.push(e2), 1 === this.yc.length ? this.Xl() : this.$h(), e2;
    }
    fd(t2) {
      const i2 = this.cr(t2), n2 = this.yc.indexOf(t2);
      c(-1 !== n2, "Series not found"), this.yc.splice(n2, 1), f(i2).Yo(t2), t2.S && t2.S();
    }
    Zl(t2, i2) {
      const n2 = f(this.cr(t2));
      n2.Yo(t2);
      const s2 = this.$c(i2);
      if (null === s2) {
        const s3 = t2.Xi();
        n2.Uo(t2, i2, s3);
      } else {
        const e2 = s2.Ht === n2 ? t2.Xi() : void 0;
        s2.Ht.Uo(t2, i2, e2);
      }
    }
    rc() {
      const t2 = lt.ss();
      t2.$n(), this.Lc(t2);
    }
    vd(t2) {
      const i2 = lt.ss();
      i2.Yn(t2), this.Lc(i2);
    }
    Kn() {
      const t2 = lt.ss();
      t2.Kn(), this.Lc(t2);
    }
    Gn(t2) {
      const i2 = lt.ss();
      i2.Gn(t2), this.Lc(i2);
    }
    Jn(t2) {
      const i2 = lt.ss();
      i2.Jn(t2), this.Lc(i2);
    }
    Zn(t2) {
      const i2 = lt.ss();
      i2.Zn(t2), this.Lc(i2);
    }
    Un() {
      const t2 = lt.ss();
      t2.Un(), this.Lc(t2);
    }
    pd() {
      return this.cn.rightPriceScale.visible ? "right" : "left";
    }
    md() {
      return this.Ic;
    }
    q() {
      return this.zc;
    }
    Vt(t2) {
      const i2 = this.Ic, n2 = this.zc;
      if (i2 === n2) return i2;
      if (t2 = Math.max(0, Math.min(100, Math.round(100 * t2))), null === this.Rc || this.Rc.Ts !== n2 || this.Rc.Ps !== i2) this.Rc = { Ts: n2, Ps: i2, bd: /* @__PURE__ */ new Map() };
      else {
        const i3 = this.Rc.bd.get(t2);
        if (void 0 !== i3) return i3;
      }
      const s2 = function(t3, i3, n3) {
        const [s3, e2, r2, h2] = S(t3), [l2, a2, o2, _2] = S(i3), u2 = [m(s3 + n3 * (l2 - s3)), m(e2 + n3 * (a2 - e2)), m(r2 + n3 * (o2 - r2)), b(h2 + n3 * (_2 - h2))];
        return `rgba(${u2[0]}, ${u2[1]}, ${u2[2]}, ${u2[3]})`;
      }(n2, i2, t2 / 100);
      return this.Rc.bd.set(t2, s2), s2;
    }
    Kc(t2, i2) {
      const n2 = new lt(i2);
      if (null !== t2) {
        const s2 = this.kc.indexOf(t2);
        n2.Nn(s2, { Fn: i2 });
      }
      return n2;
    }
    Nc(t2, i2) {
      return void 0 === i2 && (i2 = 2), this.Kc(this.cr(t2), i2);
    }
    Lc(t2) {
      this.Dc && this.Dc(t2), this.kc.forEach((t3) => t3.W_().Uh().bt());
    }
    dd(t2, i2, n2, s2) {
      const e2 = new Yi(this, t2, i2, n2, s2), r2 = void 0 !== t2.priceScaleId ? t2.priceScaleId : this.pd();
      return n2.Uo(e2, r2), ht(r2) || e2.Hh(t2), e2;
    }
    Ec(t2) {
      const i2 = this.cn.layout;
      return "gradient" === i2.background.type ? 0 === t2 ? i2.background.topColor : i2.background.bottomColor : i2.background.color;
    }
  }
  function An(t2) {
    return !P(t2) && !D(t2);
  }
  function zn(t2) {
    return P(t2);
  }
  !function(t2) {
    t2[t2.Disabled = 0] = "Disabled", t2[t2.Continuous = 1] = "Continuous", t2[t2.OnDataUpdate = 2] = "OnDataUpdate";
  }(Rn || (Rn = {})), function(t2) {
    t2[t2.LastBar = 0] = "LastBar", t2[t2.LastVisible = 1] = "LastVisible";
  }(Dn || (Dn = {})), function(t2) {
    t2.Solid = "solid", t2.VerticalGradient = "gradient";
  }(On || (On = {})), function(t2) {
    t2[t2.Year = 0] = "Year", t2[t2.Month = 1] = "Month", t2[t2.DayOfMonth = 2] = "DayOfMonth", t2[t2.Time = 3] = "Time", t2[t2.TimeWithSeconds = 4] = "TimeWithSeconds";
  }(Bn || (Bn = {}));
  const En = (t2) => t2.getUTCFullYear();
  function In(t2, i2, n2) {
    return i2.replace(/yyyy/g, ((t3) => ot(En(t3), 4))(t2)).replace(/yy/g, ((t3) => ot(En(t3) % 100, 2))(t2)).replace(/MMMM/g, ((t3, i3) => new Date(t3.getUTCFullYear(), t3.getUTCMonth(), 1).toLocaleString(i3, { month: "long" }))(t2, n2)).replace(/MMM/g, ((t3, i3) => new Date(t3.getUTCFullYear(), t3.getUTCMonth(), 1).toLocaleString(i3, { month: "short" }))(t2, n2)).replace(/MM/g, ((t3) => ot(((t4) => t4.getUTCMonth() + 1)(t3), 2))(t2)).replace(/dd/g, ((t3) => ot(((t4) => t4.getUTCDate())(t3), 2))(t2));
  }
  class Ln {
    constructor(t2 = "yyyy-MM-dd", i2 = "default") {
      this.wd = t2, this.gd = i2;
    }
    q_(t2) {
      return In(t2, this.wd, this.gd);
    }
  }
  class Nn {
    constructor(t2) {
      this.Md = t2 || "%h:%m:%s";
    }
    q_(t2) {
      return this.Md.replace("%h", ot(t2.getUTCHours(), 2)).replace("%m", ot(t2.getUTCMinutes(), 2)).replace("%s", ot(t2.getUTCSeconds(), 2));
    }
  }
  const Fn = { xd: "yyyy-MM-dd", Sd: "%h:%m:%s", kd: " ", yd: "default" };
  class Wn {
    constructor(t2 = {}) {
      const i2 = Object.assign(Object.assign({}, Fn), t2);
      this.Cd = new Ln(i2.xd, i2.yd), this.Td = new Nn(i2.Sd), this.Pd = i2.kd;
    }
    q_(t2) {
      return `${this.Cd.q_(t2)}${this.Pd}${this.Td.q_(t2)}`;
    }
  }
  function jn(t2) {
    return 60 * t2 * 60 * 1e3;
  }
  function Hn(t2) {
    return 60 * t2 * 1e3;
  }
  const $n = [{ Rd: (Un = 1, 1e3 * Un), Dd: 10 }, { Rd: Hn(1), Dd: 20 }, { Rd: Hn(5), Dd: 21 }, { Rd: Hn(30), Dd: 22 }, { Rd: jn(1), Dd: 30 }, { Rd: jn(3), Dd: 31 }, { Rd: jn(6), Dd: 32 }, { Rd: jn(12), Dd: 33 }];
  var Un;
  function qn(t2, i2) {
    if (t2.getUTCFullYear() !== i2.getUTCFullYear()) return 70;
    if (t2.getUTCMonth() !== i2.getUTCMonth()) return 60;
    if (t2.getUTCDate() !== i2.getUTCDate()) return 50;
    for (let n2 = $n.length - 1; n2 >= 0; --n2) if (Math.floor(i2.getTime() / $n[n2].Rd) !== Math.floor(t2.getTime() / $n[n2].Rd)) return $n[n2].Dd;
    return 0;
  }
  function Yn(t2) {
    let i2 = t2;
    if (D(t2) && (i2 = Xn(t2)), !An(i2)) throw new Error("time must be of type BusinessDay");
    const n2 = new Date(Date.UTC(i2.year, i2.month - 1, i2.day, 0, 0, 0, 0));
    return { Od: Math.round(n2.getTime() / 1e3), Bd: i2 };
  }
  function Zn(t2) {
    if (!zn(t2)) throw new Error("time must be of type isUTCTimestamp");
    return { Od: t2 };
  }
  function Xn(t2) {
    const i2 = new Date(t2);
    if (isNaN(i2.getTime())) throw new Error(`Invalid date string=${t2}, expected format=yyyy-mm-dd`);
    return { day: i2.getUTCDate(), month: i2.getUTCMonth() + 1, year: i2.getUTCFullYear() };
  }
  function Kn(t2) {
    D(t2.time) && (t2.time = Xn(t2.time));
  }
  class Gn {
    options() {
      return this.cn;
    }
    setOptions(t2) {
      this.cn = t2, this.updateFormatter(t2.localization);
    }
    preprocessData(t2) {
      Array.isArray(t2) ? function(t3) {
        t3.forEach(Kn);
      }(t2) : Kn(t2);
    }
    createConverterToInternalObj(t2) {
      return f(function(t3) {
        return 0 === t3.length ? null : An(t3[0].time) || D(t3[0].time) ? Yn : Zn;
      }(t2));
    }
    key(t2) {
      return "object" == typeof t2 && "Od" in t2 ? t2.Od : this.key(this.convertHorzItemToInternal(t2));
    }
    cacheKey(t2) {
      const i2 = t2;
      return void 0 === i2.Bd ? new Date(1e3 * i2.Od).getTime() : new Date(Date.UTC(i2.Bd.year, i2.Bd.month - 1, i2.Bd.day)).getTime();
    }
    convertHorzItemToInternal(t2) {
      return zn(i2 = t2) ? Zn(i2) : An(i2) ? Yn(i2) : Yn(Xn(i2));
      var i2;
    }
    updateFormatter(t2) {
      if (!this.cn) return;
      const i2 = t2.dateFormat;
      this.cn.timeScale.timeVisible ? this.Vd = new Wn({ xd: i2, Sd: this.cn.timeScale.secondsVisible ? "%h:%m:%s" : "%h:%m", kd: "   ", yd: t2.locale }) : this.Vd = new Ln(i2, t2.locale);
    }
    formatHorzItem(t2) {
      const i2 = t2;
      return this.Vd.q_(new Date(1e3 * i2.Od));
    }
    formatTickmark(t2, i2) {
      const n2 = function(t3, i3, n3) {
        switch (t3) {
          case 0:
          case 10:
            return i3 ? n3 ? 4 : 3 : 2;
          case 20:
          case 21:
          case 22:
          case 30:
          case 31:
          case 32:
          case 33:
            return i3 ? 3 : 2;
          case 50:
            return 2;
          case 60:
            return 1;
          case 70:
            return 0;
        }
      }(t2.weight, this.cn.timeScale.timeVisible, this.cn.timeScale.secondsVisible), s2 = this.cn.timeScale;
      if (void 0 !== s2.tickMarkFormatter) {
        const e2 = s2.tickMarkFormatter(t2.originalTime, n2, i2.locale);
        if (null !== e2) return e2;
      }
      return function(t3, i3, n3) {
        const s3 = {};
        switch (i3) {
          case 0:
            s3.year = "numeric";
            break;
          case 1:
            s3.month = "short";
            break;
          case 2:
            s3.day = "numeric";
            break;
          case 3:
            s3.hour12 = false, s3.hour = "2-digit", s3.minute = "2-digit";
            break;
          case 4:
            s3.hour12 = false, s3.hour = "2-digit", s3.minute = "2-digit", s3.second = "2-digit";
        }
        const e2 = void 0 === t3.Bd ? new Date(1e3 * t3.Od) : new Date(Date.UTC(t3.Bd.year, t3.Bd.month - 1, t3.Bd.day));
        return new Date(e2.getUTCFullYear(), e2.getUTCMonth(), e2.getUTCDate(), e2.getUTCHours(), e2.getUTCMinutes(), e2.getUTCSeconds(), e2.getUTCMilliseconds()).toLocaleString(n3, s3);
      }(t2.time, n2, i2.locale);
    }
    maxTickMarkWeight(t2) {
      let i2 = t2.reduce(xn, t2[0]).weight;
      return i2 > 30 && i2 < 50 && (i2 = 30), i2;
    }
    fillWeightsForPoints(t2, i2) {
      !function(t3, i3 = 0) {
        if (0 === t3.length) return;
        let n2 = 0 === i3 ? null : t3[i3 - 1].time.Od, s2 = null !== n2 ? new Date(1e3 * n2) : null, e2 = 0;
        for (let r2 = i3; r2 < t3.length; ++r2) {
          const i4 = t3[r2], h2 = new Date(1e3 * i4.time.Od);
          null !== s2 && (i4.timeWeight = qn(h2, s2)), e2 += i4.time.Od - (n2 || i4.time.Od), n2 = i4.time.Od, s2 = h2;
        }
        if (0 === i3 && t3.length > 1) {
          const i4 = Math.ceil(e2 / (t3.length - 1)), n3 = new Date(1e3 * (t3[0].time.Od - i4));
          t3[0].timeWeight = qn(new Date(1e3 * t3[0].time.Od), n3);
        }
      }(t2, i2);
    }
    static Ad(t2) {
      return T({ localization: { dateFormat: "dd MMM 'yy" } }, null != t2 ? t2 : {});
    }
  }
  function Jn(t2) {
    var i2 = t2.width, n2 = t2.height;
    if (i2 < 0) throw new Error("Negative width is not allowed for Size");
    if (n2 < 0) throw new Error("Negative height is not allowed for Size");
    return { width: i2, height: n2 };
  }
  function Qn(t2, i2) {
    return t2.width === i2.width && t2.height === i2.height;
  }
  var ts = function() {
    function t2(t3) {
      var i2 = this;
      this._resolutionListener = function() {
        return i2._onResolutionChanged();
      }, this._resolutionMediaQueryList = null, this._observers = [], this._window = t3, this._installResolutionListener();
    }
    return t2.prototype.dispose = function() {
      this._uninstallResolutionListener(), this._window = null;
    }, Object.defineProperty(t2.prototype, "value", { get: function() {
      return this._window.devicePixelRatio;
    }, enumerable: false, configurable: true }), t2.prototype.subscribe = function(t3) {
      var i2 = this, n2 = { next: t3 };
      return this._observers.push(n2), { unsubscribe: function() {
        i2._observers = i2._observers.filter(function(t4) {
          return t4 !== n2;
        });
      } };
    }, t2.prototype._installResolutionListener = function() {
      if (null !== this._resolutionMediaQueryList) throw new Error("Resolution listener is already installed");
      var t3 = this._window.devicePixelRatio;
      this._resolutionMediaQueryList = this._window.matchMedia("all and (resolution: ".concat(t3, "dppx)")), this._resolutionMediaQueryList.addListener(this._resolutionListener);
    }, t2.prototype._uninstallResolutionListener = function() {
      null !== this._resolutionMediaQueryList && (this._resolutionMediaQueryList.removeListener(this._resolutionListener), this._resolutionMediaQueryList = null);
    }, t2.prototype._reinstallResolutionListener = function() {
      this._uninstallResolutionListener(), this._installResolutionListener();
    }, t2.prototype._onResolutionChanged = function() {
      var t3 = this;
      this._observers.forEach(function(i2) {
        return i2.next(t3._window.devicePixelRatio);
      }), this._reinstallResolutionListener();
    }, t2;
  }();
  var is = function() {
    function t2(t3, i2, n2) {
      var s2;
      this._canvasElement = null, this._bitmapSizeChangedListeners = [], this._suggestedBitmapSize = null, this._suggestedBitmapSizeChangedListeners = [], this._devicePixelRatioObservable = null, this._canvasElementResizeObserver = null, this._canvasElement = t3, this._canvasElementClientSize = Jn({ width: this._canvasElement.clientWidth, height: this._canvasElement.clientHeight }), this._transformBitmapSize = null != i2 ? i2 : function(t4) {
        return t4;
      }, this._allowResizeObserver = null === (s2 = null == n2 ? void 0 : n2.allowResizeObserver) || void 0 === s2 || s2, this._chooseAndInitObserver();
    }
    return t2.prototype.dispose = function() {
      var t3, i2;
      if (null === this._canvasElement) throw new Error("Object is disposed");
      null === (t3 = this._canvasElementResizeObserver) || void 0 === t3 || t3.disconnect(), this._canvasElementResizeObserver = null, null === (i2 = this._devicePixelRatioObservable) || void 0 === i2 || i2.dispose(), this._devicePixelRatioObservable = null, this._suggestedBitmapSizeChangedListeners.length = 0, this._bitmapSizeChangedListeners.length = 0, this._canvasElement = null;
    }, Object.defineProperty(t2.prototype, "canvasElement", { get: function() {
      if (null === this._canvasElement) throw new Error("Object is disposed");
      return this._canvasElement;
    }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "canvasElementClientSize", { get: function() {
      return this._canvasElementClientSize;
    }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "bitmapSize", { get: function() {
      return Jn({ width: this.canvasElement.width, height: this.canvasElement.height });
    }, enumerable: false, configurable: true }), t2.prototype.resizeCanvasElement = function(t3) {
      this._canvasElementClientSize = Jn(t3), this.canvasElement.style.width = "".concat(this._canvasElementClientSize.width, "px"), this.canvasElement.style.height = "".concat(this._canvasElementClientSize.height, "px"), this._invalidateBitmapSize();
    }, t2.prototype.subscribeBitmapSizeChanged = function(t3) {
      this._bitmapSizeChangedListeners.push(t3);
    }, t2.prototype.unsubscribeBitmapSizeChanged = function(t3) {
      this._bitmapSizeChangedListeners = this._bitmapSizeChangedListeners.filter(function(i2) {
        return i2 !== t3;
      });
    }, Object.defineProperty(t2.prototype, "suggestedBitmapSize", { get: function() {
      return this._suggestedBitmapSize;
    }, enumerable: false, configurable: true }), t2.prototype.subscribeSuggestedBitmapSizeChanged = function(t3) {
      this._suggestedBitmapSizeChangedListeners.push(t3);
    }, t2.prototype.unsubscribeSuggestedBitmapSizeChanged = function(t3) {
      this._suggestedBitmapSizeChangedListeners = this._suggestedBitmapSizeChangedListeners.filter(function(i2) {
        return i2 !== t3;
      });
    }, t2.prototype.applySuggestedBitmapSize = function() {
      if (null !== this._suggestedBitmapSize) {
        var t3 = this._suggestedBitmapSize;
        this._suggestedBitmapSize = null, this._resizeBitmap(t3), this._emitSuggestedBitmapSizeChanged(t3, this._suggestedBitmapSize);
      }
    }, t2.prototype._resizeBitmap = function(t3) {
      var i2 = this.bitmapSize;
      Qn(i2, t3) || (this.canvasElement.width = t3.width, this.canvasElement.height = t3.height, this._emitBitmapSizeChanged(i2, t3));
    }, t2.prototype._emitBitmapSizeChanged = function(t3, i2) {
      var n2 = this;
      this._bitmapSizeChangedListeners.forEach(function(s2) {
        return s2.call(n2, t3, i2);
      });
    }, t2.prototype._suggestNewBitmapSize = function(t3) {
      var i2 = this._suggestedBitmapSize, n2 = Jn(this._transformBitmapSize(t3, this._canvasElementClientSize)), s2 = Qn(this.bitmapSize, n2) ? null : n2;
      null === i2 && null === s2 || null !== i2 && null !== s2 && Qn(i2, s2) || (this._suggestedBitmapSize = s2, this._emitSuggestedBitmapSizeChanged(i2, s2));
    }, t2.prototype._emitSuggestedBitmapSizeChanged = function(t3, i2) {
      var n2 = this;
      this._suggestedBitmapSizeChangedListeners.forEach(function(s2) {
        return s2.call(n2, t3, i2);
      });
    }, t2.prototype._chooseAndInitObserver = function() {
      var t3 = this;
      this._allowResizeObserver ? new Promise(function(t4) {
        var i2 = new ResizeObserver(function(n2) {
          t4(n2.every(function(t5) {
            return "devicePixelContentBoxSize" in t5;
          })), i2.disconnect();
        });
        i2.observe(document.body, { box: "device-pixel-content-box" });
      }).catch(function() {
        return false;
      }).then(function(i2) {
        return i2 ? t3._initResizeObserver() : t3._initDevicePixelRatioObservable();
      }) : this._initDevicePixelRatioObservable();
    }, t2.prototype._initDevicePixelRatioObservable = function() {
      var t3 = this;
      if (null !== this._canvasElement) {
        var i2 = ns(this._canvasElement);
        if (null === i2) throw new Error("No window is associated with the canvas");
        this._devicePixelRatioObservable = function(t4) {
          return new ts(t4);
        }(i2), this._devicePixelRatioObservable.subscribe(function() {
          return t3._invalidateBitmapSize();
        }), this._invalidateBitmapSize();
      }
    }, t2.prototype._invalidateBitmapSize = function() {
      var t3, i2;
      if (null !== this._canvasElement) {
        var n2 = ns(this._canvasElement);
        if (null !== n2) {
          var s2 = null !== (i2 = null === (t3 = this._devicePixelRatioObservable) || void 0 === t3 ? void 0 : t3.value) && void 0 !== i2 ? i2 : n2.devicePixelRatio, e2 = this._canvasElement.getClientRects(), r2 = void 0 !== e2[0] ? function(t4, i3) {
            return Jn({ width: Math.round(t4.left * i3 + t4.width * i3) - Math.round(t4.left * i3), height: Math.round(t4.top * i3 + t4.height * i3) - Math.round(t4.top * i3) });
          }(e2[0], s2) : Jn({ width: this._canvasElementClientSize.width * s2, height: this._canvasElementClientSize.height * s2 });
          this._suggestNewBitmapSize(r2);
        }
      }
    }, t2.prototype._initResizeObserver = function() {
      var t3 = this;
      null !== this._canvasElement && (this._canvasElementResizeObserver = new ResizeObserver(function(i2) {
        var n2 = i2.find(function(i3) {
          return i3.target === t3._canvasElement;
        });
        if (n2 && n2.devicePixelContentBoxSize && n2.devicePixelContentBoxSize[0]) {
          var s2 = n2.devicePixelContentBoxSize[0], e2 = Jn({ width: s2.inlineSize, height: s2.blockSize });
          t3._suggestNewBitmapSize(e2);
        }
      }), this._canvasElementResizeObserver.observe(this._canvasElement, { box: "device-pixel-content-box" }));
    }, t2;
  }();
  function ns(t2) {
    return t2.ownerDocument.defaultView;
  }
  var ss = function() {
    function t2(t3, i2, n2) {
      if (0 === i2.width || 0 === i2.height) throw new TypeError("Rendering target could only be created on a media with positive width and height");
      if (this._mediaSize = i2, 0 === n2.width || 0 === n2.height) throw new TypeError("Rendering target could only be created using a bitmap with positive integer width and height");
      this._bitmapSize = n2, this._context = t3;
    }
    return t2.prototype.useMediaCoordinateSpace = function(t3) {
      try {
        return this._context.save(), this._context.setTransform(1, 0, 0, 1, 0, 0), this._context.scale(this._horizontalPixelRatio, this._verticalPixelRatio), t3({ context: this._context, mediaSize: this._mediaSize });
      } finally {
        this._context.restore();
      }
    }, t2.prototype.useBitmapCoordinateSpace = function(t3) {
      try {
        return this._context.save(), this._context.setTransform(1, 0, 0, 1, 0, 0), t3({ context: this._context, mediaSize: this._mediaSize, bitmapSize: this._bitmapSize, horizontalPixelRatio: this._horizontalPixelRatio, verticalPixelRatio: this._verticalPixelRatio });
      } finally {
        this._context.restore();
      }
    }, Object.defineProperty(t2.prototype, "_horizontalPixelRatio", { get: function() {
      return this._bitmapSize.width / this._mediaSize.width;
    }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "_verticalPixelRatio", { get: function() {
      return this._bitmapSize.height / this._mediaSize.height;
    }, enumerable: false, configurable: true }), t2;
  }();
  function es(t2, i2) {
    var n2 = t2.canvasElementClientSize;
    if (0 === n2.width || 0 === n2.height) return null;
    var s2 = t2.bitmapSize;
    if (0 === s2.width || 0 === s2.height) return null;
    var e2 = t2.canvasElement.getContext("2d", i2);
    return null === e2 ? null : new ss(e2, n2, s2);
  }
  const rs = "undefined" != typeof window;
  function hs() {
    return !!rs && window.navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  }
  function ls() {
    return !!rs && /iPhone|iPad|iPod/.test(window.navigator.platform);
  }
  function as(t2) {
    return t2 + t2 % 2;
  }
  function os(t2, i2) {
    return t2.zd - i2.zd;
  }
  function _s(t2, i2, n2) {
    const s2 = (t2.zd - i2.zd) / (t2.ot - i2.ot);
    return Math.sign(s2) * Math.min(Math.abs(s2), n2);
  }
  class us {
    constructor(t2, i2, n2, s2) {
      this.Ed = null, this.Id = null, this.Ld = null, this.Nd = null, this.Fd = null, this.Wd = 0, this.jd = 0, this.Hd = t2, this.$d = i2, this.Ud = n2, this.rs = s2;
    }
    qd(t2, i2) {
      if (null !== this.Ed) {
        if (this.Ed.ot === i2) return void (this.Ed.zd = t2);
        if (Math.abs(this.Ed.zd - t2) < this.rs) return;
      }
      this.Nd = this.Ld, this.Ld = this.Id, this.Id = this.Ed, this.Ed = { ot: i2, zd: t2 };
    }
    Dr(t2, i2) {
      if (null === this.Ed || null === this.Id) return;
      if (i2 - this.Ed.ot > 50) return;
      let n2 = 0;
      const s2 = _s(this.Ed, this.Id, this.$d), e2 = os(this.Ed, this.Id), r2 = [s2], h2 = [e2];
      if (n2 += e2, null !== this.Ld) {
        const t3 = _s(this.Id, this.Ld, this.$d);
        if (Math.sign(t3) === Math.sign(s2)) {
          const i3 = os(this.Id, this.Ld);
          if (r2.push(t3), h2.push(i3), n2 += i3, null !== this.Nd) {
            const t4 = _s(this.Ld, this.Nd, this.$d);
            if (Math.sign(t4) === Math.sign(s2)) {
              const i4 = os(this.Ld, this.Nd);
              r2.push(t4), h2.push(i4), n2 += i4;
            }
          }
        }
      }
      let l2 = 0;
      for (let t3 = 0; t3 < r2.length; ++t3) l2 += h2[t3] / n2 * r2[t3];
      Math.abs(l2) < this.Hd || (this.Fd = { zd: t2, ot: i2 }, this.jd = l2, this.Wd = function(t3, i3) {
        const n3 = Math.log(i3);
        return Math.log(1 * n3 / -t3) / n3;
      }(Math.abs(l2), this.Ud));
    }
    Qu(t2) {
      const i2 = f(this.Fd), n2 = t2 - i2.ot;
      return i2.zd + this.jd * (Math.pow(this.Ud, n2) - 1) / Math.log(this.Ud);
    }
    Ju(t2) {
      return null === this.Fd || this.Yd(t2) === this.Wd;
    }
    Yd(t2) {
      const i2 = t2 - f(this.Fd).ot;
      return Math.min(i2, this.Wd);
    }
  }
  class cs {
    constructor(t2, i2) {
      this.Zd = void 0, this.Xd = void 0, this.Kd = void 0, this.en = false, this.Gd = t2, this.Jd = i2, this.Qd();
    }
    bt() {
      this.Qd();
    }
    tf() {
      this.Zd && this.Gd.removeChild(this.Zd), this.Xd && this.Gd.removeChild(this.Xd), this.Zd = void 0, this.Xd = void 0;
    }
    if() {
      return this.en !== this.nf() || this.Kd !== this.sf();
    }
    sf() {
      return k(S(this.Jd.W().layout.textColor)) > 160 ? "dark" : "light";
    }
    nf() {
      return this.Jd.W().layout.attributionLogo;
    }
    ef() {
      const t2 = new URL(location.href);
      return t2.hostname ? "&utm_source=" + t2.hostname + t2.pathname : "";
    }
    Qd() {
      this.if() && (this.tf(), this.en = this.nf(), this.en && (this.Kd = this.sf(), this.Xd = document.createElement("style"), this.Xd.innerText = "a#tv-attr-logo{--fill:#131722;--stroke:#fff;position:absolute;left:10px;bottom:10px;height:19px;width:35px;margin:0;padding:0;border:0;z-index:3;}a#tv-attr-logo[data-dark]{--fill:#D1D4DC;--stroke:#131722;}", this.Zd = document.createElement("a"), this.Zd.href = `https://www.tradingview.com/?utm_medium=lwc-link&utm_campaign=lwc-chart${this.ef()}`, this.Zd.title = "Charting by TradingView", this.Zd.id = "tv-attr-logo", this.Zd.target = "_blank", this.Zd.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 19" width="35" height="19" fill="none"><g fill-rule="evenodd" clip-path="url(#a)" clip-rule="evenodd"><path fill="var(--stroke)" d="M2 0H0v10h6v9h21.4l.5-1.3 6-15 1-2.7H23.7l-.5 1.3-.2.6a5 5 0 0 0-7-.9V0H2Zm20 17h4l5.2-13 .8-2h-7l-1 2.5-.2.5-1.5 3.8-.3.7V17Zm-.8-10a3 3 0 0 0 .7-2.7A3 3 0 1 0 16.8 7h4.4ZM14 7V2H2v6h6v9h4V7h2Z"/><path fill="var(--fill)" d="M14 2H2v6h6v9h6V2Zm12 15h-7l6-15h7l-6 15Zm-7-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></g><defs><clipPath id="a"><path fill="var(--stroke)" d="M0 0h35v19H0z"/></clipPath></defs></svg>', this.Zd.toggleAttribute("data-dark", "dark" === this.Kd), this.Gd.appendChild(this.Xd), this.Gd.appendChild(this.Zd)));
    }
  }
  function ds(t2, i2) {
    const n2 = f(t2.ownerDocument).createElement("canvas");
    t2.appendChild(n2);
    const s2 = function(t3, i3) {
      if ("device-pixel-content-box" === i3.type) return new is(t3, i3.transform, i3.options);
      throw new Error("Unsupported binding target");
    }(n2, { type: "device-pixel-content-box", options: { allowResizeObserver: false }, transform: (t3, i3) => ({ width: Math.max(t3.width, i3.width), height: Math.max(t3.height, i3.height) }) });
    return s2.resizeCanvasElement(i2), s2;
  }
  function fs(t2) {
    var i2;
    t2.width = 1, t2.height = 1, null === (i2 = t2.getContext("2d")) || void 0 === i2 || i2.clearRect(0, 0, 1, 1);
  }
  function vs(t2, i2, n2, s2) {
    t2.wl && t2.wl(i2, n2, s2);
  }
  function ps(t2, i2, n2, s2) {
    t2.X(i2, n2, s2);
  }
  function ms(t2, i2, n2, s2) {
    const e2 = t2(n2, s2);
    for (const t3 of e2) {
      const n3 = t3.gt();
      null !== n3 && i2(n3);
    }
  }
  function bs(t2) {
    rs && void 0 !== window.chrome && t2.addEventListener("mousedown", (t3) => {
      if (1 === t3.button) return t3.preventDefault(), false;
    });
  }
  class ws {
    constructor(t2, i2, n2) {
      this.rf = 0, this.hf = null, this.lf = { nt: Number.NEGATIVE_INFINITY, st: Number.POSITIVE_INFINITY }, this.af = 0, this._f = null, this.uf = { nt: Number.NEGATIVE_INFINITY, st: Number.POSITIVE_INFINITY }, this.cf = null, this.df = false, this.ff = null, this.vf = null, this.pf = false, this.mf = false, this.bf = false, this.wf = null, this.gf = null, this.Mf = null, this.xf = null, this.Sf = null, this.kf = null, this.yf = null, this.Cf = 0, this.Tf = false, this.Pf = false, this.Rf = false, this.Df = 0, this.Of = null, this.Bf = !ls(), this.Vf = (t3) => {
        this.Af(t3);
      }, this.zf = (t3) => {
        if (this.Ef(t3)) {
          const i3 = this.If(t3);
          if (++this.af, this._f && this.af > 1) {
            const { Lf: n3 } = this.Nf(xs(t3), this.uf);
            n3 < 30 && !this.bf && this.Ff(i3, this.jf.Wf), this.Hf();
          }
        } else {
          const i3 = this.If(t3);
          if (++this.rf, this.hf && this.rf > 1) {
            const { Lf: n3 } = this.Nf(xs(t3), this.lf);
            n3 < 5 && !this.mf && this.$f(i3, this.jf.Uf), this.qf();
          }
        }
      }, this.Yf = t2, this.jf = i2, this.cn = n2, this.Zf();
    }
    S() {
      null !== this.wf && (this.wf(), this.wf = null), null !== this.gf && (this.gf(), this.gf = null), null !== this.xf && (this.xf(), this.xf = null), null !== this.Sf && (this.Sf(), this.Sf = null), null !== this.kf && (this.kf(), this.kf = null), null !== this.Mf && (this.Mf(), this.Mf = null), this.Xf(), this.qf();
    }
    Kf(t2) {
      this.xf && this.xf();
      const i2 = this.Gf.bind(this);
      if (this.xf = () => {
        this.Yf.removeEventListener("mousemove", i2);
      }, this.Yf.addEventListener("mousemove", i2), this.Ef(t2)) return;
      const n2 = this.If(t2);
      this.$f(n2, this.jf.Jf), this.Bf = true;
    }
    qf() {
      null !== this.hf && clearTimeout(this.hf), this.rf = 0, this.hf = null, this.lf = { nt: Number.NEGATIVE_INFINITY, st: Number.POSITIVE_INFINITY };
    }
    Hf() {
      null !== this._f && clearTimeout(this._f), this.af = 0, this._f = null, this.uf = { nt: Number.NEGATIVE_INFINITY, st: Number.POSITIVE_INFINITY };
    }
    Gf(t2) {
      if (this.Rf || null !== this.vf) return;
      if (this.Ef(t2)) return;
      const i2 = this.If(t2);
      this.$f(i2, this.jf.Qf), this.Bf = true;
    }
    tv(t2) {
      const i2 = ks(t2.changedTouches, f(this.Of));
      if (null === i2) return;
      if (this.Df = Ss(t2), null !== this.yf) return;
      if (this.Pf) return;
      this.Tf = true;
      const n2 = this.Nf(xs(i2), f(this.vf)), { iv: s2, nv: e2, Lf: r2 } = n2;
      if (this.pf || !(r2 < 5)) {
        if (!this.pf) {
          const t3 = 0.5 * s2, i3 = e2 >= t3 && !this.cn.sv(), n3 = t3 > e2 && !this.cn.ev();
          i3 || n3 || (this.Pf = true), this.pf = true, this.bf = true, this.Xf(), this.Hf();
        }
        if (!this.Pf) {
          const n3 = this.If(t2, i2);
          this.Ff(n3, this.jf.rv), Ms(t2);
        }
      }
    }
    hv(t2) {
      if (0 !== t2.button) return;
      const i2 = this.Nf(xs(t2), f(this.ff)), { Lf: n2 } = i2;
      if (n2 >= 5 && (this.mf = true, this.qf()), this.mf) {
        const i3 = this.If(t2);
        this.$f(i3, this.jf.lv);
      }
    }
    Nf(t2, i2) {
      const n2 = Math.abs(i2.nt - t2.nt), s2 = Math.abs(i2.st - t2.st);
      return { iv: n2, nv: s2, Lf: n2 + s2 };
    }
    av(t2) {
      let i2 = ks(t2.changedTouches, f(this.Of));
      if (null === i2 && 0 === t2.touches.length && (i2 = t2.changedTouches[0]), null === i2) return;
      this.Of = null, this.Df = Ss(t2), this.Xf(), this.vf = null, this.kf && (this.kf(), this.kf = null);
      const n2 = this.If(t2, i2);
      if (this.Ff(n2, this.jf.ov), ++this.af, this._f && this.af > 1) {
        const { Lf: t3 } = this.Nf(xs(i2), this.uf);
        t3 < 30 && !this.bf && this.Ff(n2, this.jf.Wf), this.Hf();
      } else this.bf || (this.Ff(n2, this.jf._v), this.jf._v && Ms(t2));
      0 === this.af && Ms(t2), 0 === t2.touches.length && this.df && (this.df = false, Ms(t2));
    }
    Af(t2) {
      if (0 !== t2.button) return;
      const i2 = this.If(t2);
      if (this.ff = null, this.Rf = false, this.Sf && (this.Sf(), this.Sf = null), hs()) {
        this.Yf.ownerDocument.documentElement.removeEventListener("mouseleave", this.Vf);
      }
      if (!this.Ef(t2)) if (this.$f(i2, this.jf.uv), ++this.rf, this.hf && this.rf > 1) {
        const { Lf: n2 } = this.Nf(xs(t2), this.lf);
        n2 < 5 && !this.mf && this.$f(i2, this.jf.Uf), this.qf();
      } else this.mf || this.$f(i2, this.jf.cv);
    }
    Xf() {
      null !== this.cf && (clearTimeout(this.cf), this.cf = null);
    }
    dv(t2) {
      if (null !== this.Of) return;
      const i2 = t2.changedTouches[0];
      this.Of = i2.identifier, this.Df = Ss(t2);
      const n2 = this.Yf.ownerDocument.documentElement;
      this.bf = false, this.pf = false, this.Pf = false, this.vf = xs(i2), this.kf && (this.kf(), this.kf = null);
      {
        const i3 = this.tv.bind(this), s3 = this.av.bind(this);
        this.kf = () => {
          n2.removeEventListener("touchmove", i3), n2.removeEventListener("touchend", s3);
        }, n2.addEventListener("touchmove", i3, { passive: false }), n2.addEventListener("touchend", s3, { passive: false }), this.Xf(), this.cf = setTimeout(this.fv.bind(this, t2), 240);
      }
      const s2 = this.If(t2, i2);
      this.Ff(s2, this.jf.vv), this._f || (this.af = 0, this._f = setTimeout(this.Hf.bind(this), 500), this.uf = xs(i2));
    }
    pv(t2) {
      if (0 !== t2.button) return;
      const i2 = this.Yf.ownerDocument.documentElement;
      hs() && i2.addEventListener("mouseleave", this.Vf), this.mf = false, this.ff = xs(t2), this.Sf && (this.Sf(), this.Sf = null);
      {
        const t3 = this.hv.bind(this), n3 = this.Af.bind(this);
        this.Sf = () => {
          i2.removeEventListener("mousemove", t3), i2.removeEventListener("mouseup", n3);
        }, i2.addEventListener("mousemove", t3), i2.addEventListener("mouseup", n3);
      }
      if (this.Rf = true, this.Ef(t2)) return;
      const n2 = this.If(t2);
      this.$f(n2, this.jf.mv), this.hf || (this.rf = 0, this.hf = setTimeout(this.qf.bind(this), 500), this.lf = xs(t2));
    }
    Zf() {
      this.Yf.addEventListener("mouseenter", this.Kf.bind(this)), this.Yf.addEventListener("touchcancel", this.Xf.bind(this));
      {
        const t2 = this.Yf.ownerDocument, i2 = (t3) => {
          this.jf.bv && (t3.composed && this.Yf.contains(t3.composedPath()[0]) || t3.target && this.Yf.contains(t3.target) || this.jf.bv());
        };
        this.gf = () => {
          t2.removeEventListener("touchstart", i2);
        }, this.wf = () => {
          t2.removeEventListener("mousedown", i2);
        }, t2.addEventListener("mousedown", i2), t2.addEventListener("touchstart", i2, { passive: true });
      }
      ls() && (this.Mf = () => {
        this.Yf.removeEventListener("dblclick", this.zf);
      }, this.Yf.addEventListener("dblclick", this.zf)), this.Yf.addEventListener("mouseleave", this.wv.bind(this)), this.Yf.addEventListener("touchstart", this.dv.bind(this), { passive: true }), bs(this.Yf), this.Yf.addEventListener("mousedown", this.pv.bind(this)), this.gv(), this.Yf.addEventListener("touchmove", () => {
      }, { passive: false });
    }
    gv() {
      void 0 === this.jf.Mv && void 0 === this.jf.xv && void 0 === this.jf.Sv || (this.Yf.addEventListener("touchstart", (t2) => this.kv(t2.touches), { passive: true }), this.Yf.addEventListener("touchmove", (t2) => {
        if (2 === t2.touches.length && null !== this.yf && void 0 !== this.jf.xv) {
          const i2 = gs(t2.touches[0], t2.touches[1]) / this.Cf;
          this.jf.xv(this.yf, i2), Ms(t2);
        }
      }, { passive: false }), this.Yf.addEventListener("touchend", (t2) => {
        this.kv(t2.touches);
      }));
    }
    kv(t2) {
      1 === t2.length && (this.Tf = false), 2 !== t2.length || this.Tf || this.df ? this.yv() : this.Cv(t2);
    }
    Cv(t2) {
      const i2 = this.Yf.getBoundingClientRect() || { left: 0, top: 0 };
      this.yf = { nt: (t2[0].clientX - i2.left + (t2[1].clientX - i2.left)) / 2, st: (t2[0].clientY - i2.top + (t2[1].clientY - i2.top)) / 2 }, this.Cf = gs(t2[0], t2[1]), void 0 !== this.jf.Mv && this.jf.Mv(), this.Xf();
    }
    yv() {
      null !== this.yf && (this.yf = null, void 0 !== this.jf.Sv && this.jf.Sv());
    }
    wv(t2) {
      if (this.xf && this.xf(), this.Ef(t2)) return;
      if (!this.Bf) return;
      const i2 = this.If(t2);
      this.$f(i2, this.jf.Tv), this.Bf = !ls();
    }
    fv(t2) {
      const i2 = ks(t2.touches, f(this.Of));
      if (null === i2) return;
      const n2 = this.If(t2, i2);
      this.Ff(n2, this.jf.Pv), this.bf = true, this.df = true;
    }
    Ef(t2) {
      return t2.sourceCapabilities && void 0 !== t2.sourceCapabilities.firesTouchEvents ? t2.sourceCapabilities.firesTouchEvents : Ss(t2) < this.Df + 500;
    }
    Ff(t2, i2) {
      i2 && i2.call(this.jf, t2);
    }
    $f(t2, i2) {
      i2 && i2.call(this.jf, t2);
    }
    If(t2, i2) {
      const n2 = i2 || t2, s2 = this.Yf.getBoundingClientRect() || { left: 0, top: 0 };
      return { clientX: n2.clientX, clientY: n2.clientY, pageX: n2.pageX, pageY: n2.pageY, screenX: n2.screenX, screenY: n2.screenY, localX: n2.clientX - s2.left, localY: n2.clientY - s2.top, ctrlKey: t2.ctrlKey, altKey: t2.altKey, shiftKey: t2.shiftKey, metaKey: t2.metaKey, Rv: !t2.type.startsWith("mouse") && "contextmenu" !== t2.type && "click" !== t2.type, Dv: t2.type, Ov: n2.target, Bv: t2.view, Vv: () => {
        "touchstart" !== t2.type && Ms(t2);
      } };
    }
  }
  function gs(t2, i2) {
    const n2 = t2.clientX - i2.clientX, s2 = t2.clientY - i2.clientY;
    return Math.sqrt(n2 * n2 + s2 * s2);
  }
  function Ms(t2) {
    t2.cancelable && t2.preventDefault();
  }
  function xs(t2) {
    return { nt: t2.pageX, st: t2.pageY };
  }
  function Ss(t2) {
    return t2.timeStamp || performance.now();
  }
  function ks(t2, i2) {
    for (let n2 = 0; n2 < t2.length; ++n2) if (t2[n2].identifier === i2) return t2[n2];
    return null;
  }
  function ys(t2) {
    return { jc: t2.jc, Av: { wr: t2.zv.externalId }, Ev: t2.zv.cursorStyle };
  }
  function Cs(t2, i2, n2) {
    for (const s2 of t2) {
      const t3 = s2.gt();
      if (null !== t3 && t3.br) {
        const e2 = t3.br(i2, n2);
        if (null !== e2) return { Bv: s2, Av: e2 };
      }
    }
    return null;
  }
  function Ts(t2, i2) {
    return (n2) => {
      var s2, e2, r2, h2;
      return (null !== (e2 = null === (s2 = n2.Dt()) || void 0 === s2 ? void 0 : s2.Ta()) && void 0 !== e2 ? e2 : "") !== i2 ? [] : null !== (h2 = null === (r2 = n2.ca) || void 0 === r2 ? void 0 : r2.call(n2, t2)) && void 0 !== h2 ? h2 : [];
    };
  }
  function Ps(t2, i2, n2, s2) {
    if (!t2.length) return;
    let e2 = 0;
    const r2 = n2 / 2, h2 = t2[0].At(s2, true);
    let l2 = 1 === i2 ? r2 - (t2[0].Oi() - h2 / 2) : t2[0].Oi() - h2 / 2 - r2;
    l2 = Math.max(0, l2);
    for (let r3 = 1; r3 < t2.length; r3++) {
      const h3 = t2[r3], a2 = t2[r3 - 1], o2 = a2.At(s2, false), _2 = h3.Oi(), u2 = a2.Oi();
      if (1 === i2 ? _2 > u2 - o2 : _2 < u2 + o2) {
        const s3 = u2 - o2 * i2;
        h3.Bi(s3);
        const r4 = s3 - i2 * o2 / 2;
        if ((1 === i2 ? r4 < 0 : r4 > n2) && l2 > 0) {
          const s4 = 1 === i2 ? -1 - r4 : r4 - n2, h4 = Math.min(s4, l2);
          for (let n3 = e2; n3 < t2.length; n3++) t2[n3].Bi(t2[n3].Oi() + i2 * h4);
          l2 -= h4;
        }
      } else e2 = r3, l2 = 1 === i2 ? u2 - o2 - _2 : _2 - (u2 + o2);
    }
  }
  class Rs {
    constructor(t2, i2, n2, s2) {
      this.Ii = null, this.Iv = null, this.Lv = false, this.Nv = new Jt(200), this.Jr = null, this.Fv = 0, this.Wv = false, this.jv = () => {
        this.Wv || this.tn.Hv().$t().$h();
      }, this.$v = () => {
        this.Wv || this.tn.Hv().$t().$h();
      }, this.tn = t2, this.cn = i2, this.So = i2.layout, this.Oc = n2, this.Uv = "left" === s2, this.qv = Ts("normal", s2), this.Yv = Ts("top", s2), this.Zv = Ts("bottom", s2), this.Xv = document.createElement("div"), this.Xv.style.height = "100%", this.Xv.style.overflow = "hidden", this.Xv.style.width = "25px", this.Xv.style.left = "0", this.Xv.style.position = "relative", this.Kv = ds(this.Xv, Jn({ width: 16, height: 16 })), this.Kv.subscribeSuggestedBitmapSizeChanged(this.jv);
      const e2 = this.Kv.canvasElement;
      e2.style.position = "absolute", e2.style.zIndex = "1", e2.style.left = "0", e2.style.top = "0", this.Gv = ds(this.Xv, Jn({ width: 16, height: 16 })), this.Gv.subscribeSuggestedBitmapSizeChanged(this.$v);
      const r2 = this.Gv.canvasElement;
      r2.style.position = "absolute", r2.style.zIndex = "2", r2.style.left = "0", r2.style.top = "0";
      const h2 = { mv: this.Jv.bind(this), vv: this.Jv.bind(this), lv: this.Qv.bind(this), rv: this.Qv.bind(this), bv: this.tp.bind(this), uv: this.ip.bind(this), ov: this.ip.bind(this), Uf: this.np.bind(this), Wf: this.np.bind(this), Jf: this.sp.bind(this), Tv: this.ep.bind(this) };
      this.rp = new ws(this.Gv.canvasElement, h2, { sv: () => !this.cn.handleScroll.vertTouchDrag, ev: () => true });
    }
    S() {
      this.rp.S(), this.Gv.unsubscribeSuggestedBitmapSizeChanged(this.$v), fs(this.Gv.canvasElement), this.Gv.dispose(), this.Kv.unsubscribeSuggestedBitmapSizeChanged(this.jv), fs(this.Kv.canvasElement), this.Kv.dispose(), null !== this.Ii && this.Ii.Xo().p(this), this.Ii = null;
    }
    hp() {
      return this.Xv;
    }
    P() {
      return this.So.fontSize;
    }
    lp() {
      const t2 = this.Oc.W();
      return this.Jr !== t2.R && (this.Nv.ir(), this.Jr = t2.R), t2;
    }
    ap() {
      if (null === this.Ii) return 0;
      let t2 = 0;
      const i2 = this.lp(), n2 = f(this.Kv.canvasElement.getContext("2d"));
      n2.save();
      const s2 = this.Ii.ja();
      n2.font = this.op(), s2.length > 0 && (t2 = Math.max(this.Nv.xi(n2, s2[0].no), this.Nv.xi(n2, s2[s2.length - 1].no)));
      const e2 = this._p();
      for (let i3 = e2.length; i3--; ) {
        const s3 = this.Nv.xi(n2, e2[i3].Kt());
        s3 > t2 && (t2 = s3);
      }
      const r2 = this.Ii.Ct();
      if (null !== r2 && null !== this.Iv) {
        const i3 = this.Ii.pn(1, r2), s3 = this.Ii.pn(this.Iv.height - 2, r2);
        t2 = Math.max(t2, this.Nv.xi(n2, this.Ii.Fi(Math.floor(Math.min(i3, s3)) + 0.11111111111111, r2)), this.Nv.xi(n2, this.Ii.Fi(Math.ceil(Math.max(i3, s3)) - 0.11111111111111, r2)));
      }
      n2.restore();
      const h2 = t2 || 34;
      return as(Math.ceil(i2.C + i2.T + i2.A + i2.I + 5 + h2));
    }
    up(t2) {
      null !== this.Iv && Qn(this.Iv, t2) || (this.Iv = t2, this.Wv = true, this.Kv.resizeCanvasElement(t2), this.Gv.resizeCanvasElement(t2), this.Wv = false, this.Xv.style.width = `${t2.width}px`, this.Xv.style.height = `${t2.height}px`);
    }
    cp() {
      return f(this.Iv).width;
    }
    Gi(t2) {
      this.Ii !== t2 && (null !== this.Ii && this.Ii.Xo().p(this), this.Ii = t2, t2.Xo().l(this.do.bind(this), this));
    }
    Dt() {
      return this.Ii;
    }
    ir() {
      const t2 = this.tn.dp();
      this.tn.Hv().$t().I_(t2, f(this.Dt()));
    }
    fp(t2) {
      if (null === this.Iv) return;
      if (1 !== t2) {
        this.vp(), this.Kv.applySuggestedBitmapSize();
        const t3 = es(this.Kv);
        null !== t3 && (t3.useBitmapCoordinateSpace((t4) => {
          this.pp(t4), this.Ae(t4);
        }), this.tn.mp(t3, this.Zv), this.bp(t3), this.tn.mp(t3, this.qv), this.wp(t3));
      }
      this.Gv.applySuggestedBitmapSize();
      const i2 = es(this.Gv);
      null !== i2 && (i2.useBitmapCoordinateSpace(({ context: t3, bitmapSize: i3 }) => {
        t3.clearRect(0, 0, i3.width, i3.height);
      }), this.gp(i2), this.tn.mp(i2, this.Yv));
    }
    Mp() {
      return this.Kv.bitmapSize;
    }
    xp(t2, i2, n2) {
      const s2 = this.Mp();
      s2.width > 0 && s2.height > 0 && t2.drawImage(this.Kv.canvasElement, i2, n2);
    }
    bt() {
      var t2;
      null === (t2 = this.Ii) || void 0 === t2 || t2.ja();
    }
    Jv(t2) {
      if (null === this.Ii || this.Ii.Ni() || !this.cn.handleScale.axisPressedMouseMove.price) return;
      const i2 = this.tn.Hv().$t(), n2 = this.tn.dp();
      this.Lv = true, i2.D_(n2, this.Ii, t2.localY);
    }
    Qv(t2) {
      if (null === this.Ii || !this.cn.handleScale.axisPressedMouseMove.price) return;
      const i2 = this.tn.Hv().$t(), n2 = this.tn.dp(), s2 = this.Ii;
      i2.O_(n2, s2, t2.localY);
    }
    tp() {
      if (null === this.Ii || !this.cn.handleScale.axisPressedMouseMove.price) return;
      const t2 = this.tn.Hv().$t(), i2 = this.tn.dp(), n2 = this.Ii;
      this.Lv && (this.Lv = false, t2.B_(i2, n2));
    }
    ip(t2) {
      if (null === this.Ii || !this.cn.handleScale.axisPressedMouseMove.price) return;
      const i2 = this.tn.Hv().$t(), n2 = this.tn.dp();
      this.Lv = false, i2.B_(n2, this.Ii);
    }
    np(t2) {
      this.cn.handleScale.axisDoubleClickReset.price && this.ir();
    }
    sp(t2) {
      if (null === this.Ii) return;
      !this.tn.Hv().$t().W().handleScale.axisPressedMouseMove.price || this.Ii.gh() || this.Ii.Oo() || this.Sp(1);
    }
    ep(t2) {
      this.Sp(0);
    }
    _p() {
      const t2 = [], i2 = null === this.Ii ? void 0 : this.Ii;
      return ((n2) => {
        for (let s2 = 0; s2 < n2.length; ++s2) {
          const e2 = n2[s2].Rn(this.tn.dp(), i2);
          for (let i3 = 0; i3 < e2.length; i3++) t2.push(e2[i3]);
        }
      })(this.tn.dp().$o()), t2;
    }
    pp({ context: t2, bitmapSize: i2 }) {
      const { width: n2, height: s2 } = i2, e2 = this.tn.dp().$t(), r2 = e2.q(), h2 = e2.md();
      r2 === h2 ? Y(t2, 0, 0, n2, s2, r2) : K(t2, 0, 0, n2, s2, r2, h2);
    }
    Ae({ context: t2, bitmapSize: i2, horizontalPixelRatio: n2 }) {
      if (null === this.Iv || null === this.Ii || !this.Ii.W().borderVisible) return;
      t2.fillStyle = this.Ii.W().borderColor;
      const s2 = Math.max(1, Math.floor(this.lp().C * n2));
      let e2;
      e2 = this.Uv ? i2.width - s2 : 0, t2.fillRect(e2, 0, s2, i2.height);
    }
    bp(t2) {
      if (null === this.Iv || null === this.Ii) return;
      const i2 = this.Ii.ja(), n2 = this.Ii.W(), s2 = this.lp(), e2 = this.Uv ? this.Iv.width - s2.T : 0;
      n2.borderVisible && n2.ticksVisible && t2.useBitmapCoordinateSpace(({ context: t3, horizontalPixelRatio: r2, verticalPixelRatio: h2 }) => {
        t3.fillStyle = n2.borderColor;
        const l2 = Math.max(1, Math.floor(h2)), a2 = Math.floor(0.5 * h2), o2 = Math.round(s2.T * r2);
        t3.beginPath();
        for (const n3 of i2) t3.rect(Math.floor(e2 * r2), Math.round(n3.Ia * h2) - a2, o2, l2);
        t3.fill();
      }), t2.useMediaCoordinateSpace(({ context: t3 }) => {
        var r2;
        t3.font = this.op(), t3.fillStyle = null !== (r2 = n2.textColor) && void 0 !== r2 ? r2 : this.So.textColor, t3.textAlign = this.Uv ? "right" : "left", t3.textBaseline = "middle";
        const h2 = this.Uv ? Math.round(e2 - s2.A) : Math.round(e2 + s2.T + s2.A), l2 = i2.map((i3) => this.Nv.Mi(t3, i3.no));
        for (let n3 = i2.length; n3--; ) {
          const s3 = i2[n3];
          t3.fillText(s3.no, h2, s3.Ia + l2[n3]);
        }
      });
    }
    vp() {
      if (null === this.Iv || null === this.Ii) return;
      const t2 = [], i2 = this.Ii.$o().slice(), n2 = this.tn.dp(), s2 = this.lp();
      this.Ii === n2.vr() && this.tn.dp().$o().forEach((t3) => {
        n2.dr(t3) && i2.push(t3);
      });
      const e2 = this.Ii;
      i2.forEach((i3) => {
        i3.Rn(n2, e2).forEach((i4) => {
          i4.Bi(null), i4.Vi() && t2.push(i4);
        });
      }), t2.forEach((t3) => t3.Bi(t3.ki()));
      this.Ii.W().alignLabels && this.kp(t2, s2);
    }
    kp(t2, i2) {
      if (null === this.Iv) return;
      const n2 = this.Iv.height / 2, s2 = t2.filter((t3) => t3.ki() <= n2), e2 = t2.filter((t3) => t3.ki() > n2);
      s2.sort((t3, i3) => i3.ki() - t3.ki()), e2.sort((t3, i3) => t3.ki() - i3.ki());
      for (const n3 of t2) {
        const t3 = Math.floor(n3.At(i2) / 2), s3 = n3.ki();
        s3 > -t3 && s3 < t3 && n3.Bi(t3), s3 > this.Iv.height - t3 && s3 < this.Iv.height + t3 && n3.Bi(this.Iv.height - t3);
      }
      Ps(s2, 1, this.Iv.height, i2), Ps(e2, -1, this.Iv.height, i2);
    }
    wp(t2) {
      if (null === this.Iv) return;
      const i2 = this._p(), n2 = this.lp(), s2 = this.Uv ? "right" : "left";
      i2.forEach((i3) => {
        if (i3.Ai()) {
          i3.gt(f(this.Ii)).X(t2, n2, this.Nv, s2);
        }
      });
    }
    gp(t2) {
      if (null === this.Iv || null === this.Ii) return;
      const i2 = this.tn.Hv().$t(), n2 = [], s2 = this.tn.dp(), e2 = i2.Yc().Rn(s2, this.Ii);
      e2.length && n2.push(e2);
      const r2 = this.lp(), h2 = this.Uv ? "right" : "left";
      n2.forEach((i3) => {
        i3.forEach((i4) => {
          i4.gt(f(this.Ii)).X(t2, r2, this.Nv, h2);
        });
      });
    }
    Sp(t2) {
      this.Xv.style.cursor = 1 === t2 ? "ns-resize" : "default";
    }
    do() {
      const t2 = this.ap();
      this.Fv < t2 && this.tn.Hv().$t().Xl(), this.Fv = t2;
    }
    op() {
      return E(this.So.fontSize, this.So.fontFamily);
    }
  }
  function Ds(t2, i2) {
    var n2, s2;
    return null !== (s2 = null === (n2 = t2._a) || void 0 === n2 ? void 0 : n2.call(t2, i2)) && void 0 !== s2 ? s2 : [];
  }
  function Os(t2, i2) {
    var n2, s2;
    return null !== (s2 = null === (n2 = t2.Pn) || void 0 === n2 ? void 0 : n2.call(t2, i2)) && void 0 !== s2 ? s2 : [];
  }
  function Bs(t2, i2) {
    var n2, s2;
    return null !== (s2 = null === (n2 = t2.Ji) || void 0 === n2 ? void 0 : n2.call(t2, i2)) && void 0 !== s2 ? s2 : [];
  }
  function Vs(t2, i2) {
    var n2, s2;
    return null !== (s2 = null === (n2 = t2.la) || void 0 === n2 ? void 0 : n2.call(t2, i2)) && void 0 !== s2 ? s2 : [];
  }
  class As {
    constructor(t2, i2) {
      this.Iv = Jn({ width: 0, height: 0 }), this.yp = null, this.Cp = null, this.Tp = null, this.Pp = null, this.Rp = false, this.Dp = new C(), this.Op = new C(), this.Bp = 0, this.Vp = false, this.Ap = null, this.zp = false, this.Ep = null, this.Ip = null, this.Wv = false, this.jv = () => {
        this.Wv || null === this.Lp || this.$i().$h();
      }, this.$v = () => {
        this.Wv || null === this.Lp || this.$i().$h();
      }, this.Jd = t2, this.Lp = i2, this.Lp.F_().l(this.Np.bind(this), this, true), this.Fp = document.createElement("td"), this.Fp.style.padding = "0", this.Fp.style.position = "relative";
      const n2 = document.createElement("div");
      n2.style.width = "100%", n2.style.height = "100%", n2.style.position = "relative", n2.style.overflow = "hidden", this.Wp = document.createElement("td"), this.Wp.style.padding = "0", this.jp = document.createElement("td"), this.jp.style.padding = "0", this.Fp.appendChild(n2), this.Kv = ds(n2, Jn({ width: 16, height: 16 })), this.Kv.subscribeSuggestedBitmapSizeChanged(this.jv);
      const s2 = this.Kv.canvasElement;
      s2.style.position = "absolute", s2.style.zIndex = "1", s2.style.left = "0", s2.style.top = "0", this.Gv = ds(n2, Jn({ width: 16, height: 16 })), this.Gv.subscribeSuggestedBitmapSizeChanged(this.$v);
      const e2 = this.Gv.canvasElement;
      e2.style.position = "absolute", e2.style.zIndex = "2", e2.style.left = "0", e2.style.top = "0", this.Hp = document.createElement("tr"), this.Hp.appendChild(this.Wp), this.Hp.appendChild(this.Fp), this.Hp.appendChild(this.jp), this.$p(), this.rp = new ws(this.Gv.canvasElement, this, { sv: () => null === this.Ap && !this.Jd.W().handleScroll.vertTouchDrag, ev: () => null === this.Ap && !this.Jd.W().handleScroll.horzTouchDrag });
    }
    S() {
      null !== this.yp && this.yp.S(), null !== this.Cp && this.Cp.S(), this.Tp = null, this.Gv.unsubscribeSuggestedBitmapSizeChanged(this.$v), fs(this.Gv.canvasElement), this.Gv.dispose(), this.Kv.unsubscribeSuggestedBitmapSizeChanged(this.jv), fs(this.Kv.canvasElement), this.Kv.dispose(), null !== this.Lp && this.Lp.F_().p(this), this.rp.S();
    }
    dp() {
      return f(this.Lp);
    }
    Up(t2) {
      var i2, n2;
      null !== this.Lp && this.Lp.F_().p(this), this.Lp = t2, null !== this.Lp && this.Lp.F_().l(As.prototype.Np.bind(this), this, true), this.$p(), this.Jd.qp().indexOf(this) === this.Jd.qp().length - 1 ? (this.Tp = null !== (i2 = this.Tp) && void 0 !== i2 ? i2 : new cs(this.Fp, this.Jd), this.Tp.bt()) : (null === (n2 = this.Tp) || void 0 === n2 || n2.tf(), this.Tp = null);
    }
    Hv() {
      return this.Jd;
    }
    hp() {
      return this.Hp;
    }
    $p() {
      if (null !== this.Lp && (this.Yp(), 0 !== this.$i().wt().length)) {
        if (null !== this.yp) {
          const t2 = this.Lp.P_();
          this.yp.Gi(f(t2));
        }
        if (null !== this.Cp) {
          const t2 = this.Lp.R_();
          this.Cp.Gi(f(t2));
        }
      }
    }
    Zp() {
      null !== this.yp && this.yp.bt(), null !== this.Cp && this.Cp.bt();
    }
    g_() {
      return null !== this.Lp ? this.Lp.g_() : 0;
    }
    M_(t2) {
      this.Lp && this.Lp.M_(t2);
    }
    Jf(t2) {
      if (!this.Lp) return;
      this.Xp();
      const i2 = t2.localX, n2 = t2.localY;
      this.Kp(i2, n2, t2);
    }
    mv(t2) {
      this.Xp(), this.Gp(), this.Kp(t2.localX, t2.localY, t2);
    }
    Qf(t2) {
      var i2;
      if (!this.Lp) return;
      this.Xp();
      const n2 = t2.localX, s2 = t2.localY;
      this.Kp(n2, s2, t2);
      const e2 = this.br(n2, s2);
      this.Jd.Jp(null !== (i2 = null == e2 ? void 0 : e2.Ev) && void 0 !== i2 ? i2 : null), this.$i().Wc(e2 && { jc: e2.jc, Av: e2.Av });
    }
    cv(t2) {
      null !== this.Lp && (this.Xp(), this.Qp(t2));
    }
    Uf(t2) {
      null !== this.Lp && this.tm(this.Op, t2);
    }
    Wf(t2) {
      this.Uf(t2);
    }
    lv(t2) {
      this.Xp(), this.im(t2), this.Kp(t2.localX, t2.localY, t2);
    }
    uv(t2) {
      null !== this.Lp && (this.Xp(), this.Vp = false, this.nm(t2));
    }
    _v(t2) {
      null !== this.Lp && this.Qp(t2);
    }
    Pv(t2) {
      if (this.Vp = true, null === this.Ap) {
        const i2 = { x: t2.localX, y: t2.localY };
        this.sm(i2, i2, t2);
      }
    }
    Tv(t2) {
      null !== this.Lp && (this.Xp(), this.Lp.$t().Wc(null), this.rm());
    }
    hm() {
      return this.Dp;
    }
    lm() {
      return this.Op;
    }
    Mv() {
      this.Bp = 1, this.$i().Un();
    }
    xv(t2, i2) {
      if (!this.Jd.W().handleScale.pinch) return;
      const n2 = 5 * (i2 - this.Bp);
      this.Bp = i2, this.$i().Jc(t2.nt, n2);
    }
    vv(t2) {
      this.Vp = false, this.zp = null !== this.Ap, this.Gp();
      const i2 = this.$i().Yc();
      null !== this.Ap && i2.yt() && (this.Ep = { x: i2.Yt(), y: i2.Zt() }, this.Ap = { x: t2.localX, y: t2.localY });
    }
    rv(t2) {
      if (null === this.Lp) return;
      const i2 = t2.localX, n2 = t2.localY;
      if (null === this.Ap) this.im(t2);
      else {
        this.zp = false;
        const s2 = f(this.Ep), e2 = s2.x + (i2 - this.Ap.x), r2 = s2.y + (n2 - this.Ap.y);
        this.Kp(e2, r2, t2);
      }
    }
    ov(t2) {
      0 === this.Hv().W().trackingMode.exitMode && (this.zp = true), this.am(), this.nm(t2);
    }
    br(t2, i2) {
      const n2 = this.Lp;
      return null === n2 ? null : function(t3, i3, n3) {
        const s2 = t3.$o(), e2 = function(t4, i4, n4) {
          var s3, e3;
          let r2, h2;
          for (const o2 of t4) {
            const t5 = null !== (e3 = null === (s3 = o2.fa) || void 0 === s3 ? void 0 : s3.call(o2, i4, n4)) && void 0 !== e3 ? e3 : [];
            for (const i5 of t5) l2 = i5.zOrder, (!(a2 = null == r2 ? void 0 : r2.zOrder) || "top" === l2 && "top" !== a2 || "normal" === l2 && "bottom" === a2) && (r2 = i5, h2 = o2);
          }
          var l2, a2;
          return r2 && h2 ? { zv: r2, jc: h2 } : null;
        }(s2, i3, n3);
        if ("top" === (null == e2 ? void 0 : e2.zv.zOrder)) return ys(e2);
        for (const r2 of s2) {
          if (e2 && e2.jc === r2 && "bottom" !== e2.zv.zOrder && !e2.zv.isBackground) return ys(e2);
          const s3 = Cs(r2.Pn(t3), i3, n3);
          if (null !== s3) return { jc: r2, Bv: s3.Bv, Av: s3.Av };
          if (e2 && e2.jc === r2 && "bottom" !== e2.zv.zOrder && e2.zv.isBackground) return ys(e2);
        }
        return (null == e2 ? void 0 : e2.zv) ? ys(e2) : null;
      }(n2, t2, i2);
    }
    om(t2, i2) {
      f("left" === i2 ? this.yp : this.Cp).up(Jn({ width: t2, height: this.Iv.height }));
    }
    _m() {
      return this.Iv;
    }
    up(t2) {
      Qn(this.Iv, t2) || (this.Iv = t2, this.Wv = true, this.Kv.resizeCanvasElement(t2), this.Gv.resizeCanvasElement(t2), this.Wv = false, this.Fp.style.width = t2.width + "px", this.Fp.style.height = t2.height + "px");
    }
    um() {
      const t2 = f(this.Lp);
      t2.T_(t2.P_()), t2.T_(t2.R_());
      for (const i2 of t2.Ba()) if (t2.dr(i2)) {
        const n2 = i2.Dt();
        null !== n2 && t2.T_(n2), i2.On();
      }
    }
    Mp() {
      return this.Kv.bitmapSize;
    }
    xp(t2, i2, n2) {
      const s2 = this.Mp();
      s2.width > 0 && s2.height > 0 && t2.drawImage(this.Kv.canvasElement, i2, n2);
    }
    fp(t2) {
      if (0 === t2) return;
      if (null === this.Lp) return;
      if (t2 > 1 && this.um(), null !== this.yp && this.yp.fp(t2), null !== this.Cp && this.Cp.fp(t2), 1 !== t2) {
        this.Kv.applySuggestedBitmapSize();
        const t3 = es(this.Kv);
        null !== t3 && (t3.useBitmapCoordinateSpace((t4) => {
          this.pp(t4);
        }), this.Lp && (this.dm(t3, Ds), this.fm(t3), this.vm(t3), this.dm(t3, Os), this.dm(t3, Bs)));
      }
      this.Gv.applySuggestedBitmapSize();
      const i2 = es(this.Gv);
      null !== i2 && (i2.useBitmapCoordinateSpace(({ context: t3, bitmapSize: i3 }) => {
        t3.clearRect(0, 0, i3.width, i3.height);
      }), this.pm(i2), this.dm(i2, Vs));
    }
    bm() {
      return this.yp;
    }
    wm() {
      return this.Cp;
    }
    mp(t2, i2) {
      this.dm(t2, i2);
    }
    Np() {
      null !== this.Lp && this.Lp.F_().p(this), this.Lp = null;
    }
    Qp(t2) {
      this.tm(this.Dp, t2);
    }
    tm(t2, i2) {
      const n2 = i2.localX, s2 = i2.localY;
      t2.M() && t2.m(this.$i().St().Lu(n2), { x: n2, y: s2 }, i2);
    }
    pp({ context: t2, bitmapSize: i2 }) {
      const { width: n2, height: s2 } = i2, e2 = this.$i(), r2 = e2.q(), h2 = e2.md();
      r2 === h2 ? Y(t2, 0, 0, n2, s2, h2) : K(t2, 0, 0, n2, s2, r2, h2);
    }
    fm(t2) {
      const i2 = f(this.Lp).W_().Uh().gt();
      null !== i2 && i2.X(t2, false);
    }
    vm(t2) {
      const i2 = this.$i().qc();
      this.gm(t2, Os, vs, i2), this.gm(t2, Os, ps, i2);
    }
    pm(t2) {
      this.gm(t2, Os, ps, this.$i().Yc());
    }
    dm(t2, i2) {
      const n2 = f(this.Lp).$o();
      for (const s2 of n2) this.gm(t2, i2, vs, s2);
      for (const s2 of n2) this.gm(t2, i2, ps, s2);
    }
    gm(t2, i2, n2, s2) {
      const e2 = f(this.Lp), r2 = e2.$t().Fc(), h2 = null !== r2 && r2.jc === s2, l2 = null !== r2 && h2 && void 0 !== r2.Av ? r2.Av.gr : void 0;
      ms(i2, (i3) => n2(i3, t2, h2, l2), s2, e2);
    }
    Yp() {
      if (null === this.Lp) return;
      const t2 = this.Jd, i2 = this.Lp.P_().W().visible, n2 = this.Lp.R_().W().visible;
      i2 || null === this.yp || (this.Wp.removeChild(this.yp.hp()), this.yp.S(), this.yp = null), n2 || null === this.Cp || (this.jp.removeChild(this.Cp.hp()), this.Cp.S(), this.Cp = null);
      const s2 = t2.$t()._d();
      i2 && null === this.yp && (this.yp = new Rs(this, t2.W(), s2, "left"), this.Wp.appendChild(this.yp.hp())), n2 && null === this.Cp && (this.Cp = new Rs(this, t2.W(), s2, "right"), this.jp.appendChild(this.Cp.hp()));
    }
    Mm(t2) {
      return t2.Rv && this.Vp || null !== this.Ap;
    }
    xm(t2) {
      return Math.max(0, Math.min(t2, this.Iv.width - 1));
    }
    Sm(t2) {
      return Math.max(0, Math.min(t2, this.Iv.height - 1));
    }
    Kp(t2, i2, n2) {
      this.$i().hd(this.xm(t2), this.Sm(i2), n2, f(this.Lp));
    }
    rm() {
      this.$i().ad();
    }
    am() {
      this.zp && (this.Ap = null, this.rm());
    }
    sm(t2, i2, n2) {
      this.Ap = t2, this.zp = false, this.Kp(i2.x, i2.y, n2);
      const s2 = this.$i().Yc();
      this.Ep = { x: s2.Yt(), y: s2.Zt() };
    }
    $i() {
      return this.Jd.$t();
    }
    nm(t2) {
      if (!this.Rp) return;
      const i2 = this.$i(), n2 = this.dp();
      if (i2.z_(n2, n2.vn()), this.Pp = null, this.Rp = false, i2.sd(), null !== this.Ip) {
        const t3 = performance.now(), n3 = i2.St();
        this.Ip.Dr(n3.ju(), t3), this.Ip.Ju(t3) || i2.Zn(this.Ip);
      }
    }
    Xp() {
      this.Ap = null;
    }
    Gp() {
      if (!this.Lp) return;
      if (this.$i().Un(), document.activeElement !== document.body && document.activeElement !== document.documentElement) f(document.activeElement).blur();
      else {
        const t2 = document.getSelection();
        null !== t2 && t2.removeAllRanges();
      }
      !this.Lp.vn().Ni() && this.$i().St().Ni();
    }
    im(t2) {
      if (null === this.Lp) return;
      const i2 = this.$i(), n2 = i2.St();
      if (n2.Ni()) return;
      const s2 = this.Jd.W(), e2 = s2.handleScroll, r2 = s2.kineticScroll;
      if ((!e2.pressedMouseMove || t2.Rv) && (!e2.horzTouchDrag && !e2.vertTouchDrag || !t2.Rv)) return;
      const h2 = this.Lp.vn(), l2 = performance.now();
      if (null !== this.Pp || this.Mm(t2) || (this.Pp = { x: t2.clientX, y: t2.clientY, Od: l2, km: t2.localX, ym: t2.localY }), null !== this.Pp && !this.Rp && (this.Pp.x !== t2.clientX || this.Pp.y !== t2.clientY)) {
        if (t2.Rv && r2.touch || !t2.Rv && r2.mouse) {
          const t3 = n2.he();
          this.Ip = new us(0.2 / t3, 7 / t3, 0.997, 15 / t3), this.Ip.qd(n2.ju(), this.Pp.Od);
        } else this.Ip = null;
        h2.Ni() || i2.V_(this.Lp, h2, t2.localY), i2.td(t2.localX), this.Rp = true;
      }
      this.Rp && (h2.Ni() || i2.A_(this.Lp, h2, t2.localY), i2.nd(t2.localX), null !== this.Ip && this.Ip.qd(n2.ju(), l2));
    }
  }
  class zs {
    constructor(t2, i2, n2, s2, e2) {
      this.ft = true, this.Iv = Jn({ width: 0, height: 0 }), this.jv = () => this.fp(3), this.Uv = "left" === t2, this.Oc = n2._d, this.cn = i2, this.Cm = s2, this.Tm = e2, this.Xv = document.createElement("div"), this.Xv.style.width = "25px", this.Xv.style.height = "100%", this.Xv.style.overflow = "hidden", this.Kv = ds(this.Xv, Jn({ width: 16, height: 16 })), this.Kv.subscribeSuggestedBitmapSizeChanged(this.jv);
    }
    S() {
      this.Kv.unsubscribeSuggestedBitmapSizeChanged(this.jv), fs(this.Kv.canvasElement), this.Kv.dispose();
    }
    hp() {
      return this.Xv;
    }
    _m() {
      return this.Iv;
    }
    up(t2) {
      Qn(this.Iv, t2) || (this.Iv = t2, this.Kv.resizeCanvasElement(t2), this.Xv.style.width = `${t2.width}px`, this.Xv.style.height = `${t2.height}px`, this.ft = true);
    }
    fp(t2) {
      if (t2 < 3 && !this.ft) return;
      if (0 === this.Iv.width || 0 === this.Iv.height) return;
      this.ft = false, this.Kv.applySuggestedBitmapSize();
      const i2 = es(this.Kv);
      null !== i2 && i2.useBitmapCoordinateSpace((t3) => {
        this.pp(t3), this.Ae(t3);
      });
    }
    Mp() {
      return this.Kv.bitmapSize;
    }
    xp(t2, i2, n2) {
      const s2 = this.Mp();
      s2.width > 0 && s2.height > 0 && t2.drawImage(this.Kv.canvasElement, i2, n2);
    }
    Ae({ context: t2, bitmapSize: i2, horizontalPixelRatio: n2, verticalPixelRatio: s2 }) {
      if (!this.Cm()) return;
      t2.fillStyle = this.cn.timeScale.borderColor;
      const e2 = Math.floor(this.Oc.W().C * n2), r2 = Math.floor(this.Oc.W().C * s2), h2 = this.Uv ? i2.width - e2 : 0;
      t2.fillRect(h2, 0, e2, r2);
    }
    pp({ context: t2, bitmapSize: i2 }) {
      Y(t2, 0, 0, i2.width, i2.height, this.Tm());
    }
  }
  function Es(t2) {
    return (i2) => {
      var n2, s2;
      return null !== (s2 = null === (n2 = i2.da) || void 0 === n2 ? void 0 : n2.call(i2, t2)) && void 0 !== s2 ? s2 : [];
    };
  }
  const Is = Es("normal"), Ls = Es("top"), Ns = Es("bottom");
  class Fs {
    constructor(t2, i2) {
      this.Pm = null, this.Rm = null, this.k = null, this.Dm = false, this.Iv = Jn({ width: 0, height: 0 }), this.Om = new C(), this.Nv = new Jt(5), this.Wv = false, this.jv = () => {
        this.Wv || this.Jd.$t().$h();
      }, this.$v = () => {
        this.Wv || this.Jd.$t().$h();
      }, this.Jd = t2, this.U_ = i2, this.cn = t2.W().layout, this.Zd = document.createElement("tr"), this.Bm = document.createElement("td"), this.Bm.style.padding = "0", this.Vm = document.createElement("td"), this.Vm.style.padding = "0", this.Xv = document.createElement("td"), this.Xv.style.height = "25px", this.Xv.style.padding = "0", this.Am = document.createElement("div"), this.Am.style.width = "100%", this.Am.style.height = "100%", this.Am.style.position = "relative", this.Am.style.overflow = "hidden", this.Xv.appendChild(this.Am), this.Kv = ds(this.Am, Jn({ width: 16, height: 16 })), this.Kv.subscribeSuggestedBitmapSizeChanged(this.jv);
      const n2 = this.Kv.canvasElement;
      n2.style.position = "absolute", n2.style.zIndex = "1", n2.style.left = "0", n2.style.top = "0", this.Gv = ds(this.Am, Jn({ width: 16, height: 16 })), this.Gv.subscribeSuggestedBitmapSizeChanged(this.$v);
      const s2 = this.Gv.canvasElement;
      s2.style.position = "absolute", s2.style.zIndex = "2", s2.style.left = "0", s2.style.top = "0", this.Zd.appendChild(this.Bm), this.Zd.appendChild(this.Xv), this.Zd.appendChild(this.Vm), this.zm(), this.Jd.$t().w_().l(this.zm.bind(this), this), this.rp = new ws(this.Gv.canvasElement, this, { sv: () => true, ev: () => !this.Jd.W().handleScroll.horzTouchDrag });
    }
    S() {
      this.rp.S(), null !== this.Pm && this.Pm.S(), null !== this.Rm && this.Rm.S(), this.Gv.unsubscribeSuggestedBitmapSizeChanged(this.$v), fs(this.Gv.canvasElement), this.Gv.dispose(), this.Kv.unsubscribeSuggestedBitmapSizeChanged(this.jv), fs(this.Kv.canvasElement), this.Kv.dispose();
    }
    hp() {
      return this.Zd;
    }
    Em() {
      return this.Pm;
    }
    Im() {
      return this.Rm;
    }
    mv(t2) {
      if (this.Dm) return;
      this.Dm = true;
      const i2 = this.Jd.$t();
      !i2.St().Ni() && this.Jd.W().handleScale.axisPressedMouseMove.time && i2.Gc(t2.localX);
    }
    vv(t2) {
      this.mv(t2);
    }
    bv() {
      const t2 = this.Jd.$t();
      !t2.St().Ni() && this.Dm && (this.Dm = false, this.Jd.W().handleScale.axisPressedMouseMove.time && t2.rd());
    }
    lv(t2) {
      const i2 = this.Jd.$t();
      !i2.St().Ni() && this.Jd.W().handleScale.axisPressedMouseMove.time && i2.ed(t2.localX);
    }
    rv(t2) {
      this.lv(t2);
    }
    uv() {
      this.Dm = false;
      const t2 = this.Jd.$t();
      t2.St().Ni() && !this.Jd.W().handleScale.axisPressedMouseMove.time || t2.rd();
    }
    ov() {
      this.uv();
    }
    Uf() {
      this.Jd.W().handleScale.axisDoubleClickReset.time && this.Jd.$t().Kn();
    }
    Wf() {
      this.Uf();
    }
    Jf() {
      this.Jd.$t().W().handleScale.axisPressedMouseMove.time && this.Sp(1);
    }
    Tv() {
      this.Sp(0);
    }
    _m() {
      return this.Iv;
    }
    Lm() {
      return this.Om;
    }
    Nm(t2, i2, n2) {
      Qn(this.Iv, t2) || (this.Iv = t2, this.Wv = true, this.Kv.resizeCanvasElement(t2), this.Gv.resizeCanvasElement(t2), this.Wv = false, this.Xv.style.width = `${t2.width}px`, this.Xv.style.height = `${t2.height}px`, this.Om.m(t2)), null !== this.Pm && this.Pm.up(Jn({ width: i2, height: t2.height })), null !== this.Rm && this.Rm.up(Jn({ width: n2, height: t2.height }));
    }
    Fm() {
      const t2 = this.Wm();
      return Math.ceil(t2.C + t2.T + t2.P + t2.L + t2.V + t2.jm);
    }
    bt() {
      this.Jd.$t().St().ja();
    }
    Mp() {
      return this.Kv.bitmapSize;
    }
    xp(t2, i2, n2) {
      const s2 = this.Mp();
      s2.width > 0 && s2.height > 0 && t2.drawImage(this.Kv.canvasElement, i2, n2);
    }
    fp(t2) {
      if (0 === t2) return;
      if (1 !== t2) {
        this.Kv.applySuggestedBitmapSize();
        const i3 = es(this.Kv);
        null !== i3 && (i3.useBitmapCoordinateSpace((t3) => {
          this.pp(t3), this.Ae(t3), this.Hm(i3, Ns);
        }), this.bp(i3), this.Hm(i3, Is)), null !== this.Pm && this.Pm.fp(t2), null !== this.Rm && this.Rm.fp(t2);
      }
      this.Gv.applySuggestedBitmapSize();
      const i2 = es(this.Gv);
      null !== i2 && (i2.useBitmapCoordinateSpace(({ context: t3, bitmapSize: i3 }) => {
        t3.clearRect(0, 0, i3.width, i3.height);
      }), this.$m([...this.Jd.$t().wt(), this.Jd.$t().Yc()], i2), this.Hm(i2, Ls));
    }
    Hm(t2, i2) {
      const n2 = this.Jd.$t().wt();
      for (const s2 of n2) ms(i2, (i3) => vs(i3, t2, false, void 0), s2, void 0);
      for (const s2 of n2) ms(i2, (i3) => ps(i3, t2, false, void 0), s2, void 0);
    }
    pp({ context: t2, bitmapSize: i2 }) {
      Y(t2, 0, 0, i2.width, i2.height, this.Jd.$t().md());
    }
    Ae({ context: t2, bitmapSize: i2, verticalPixelRatio: n2 }) {
      if (this.Jd.W().timeScale.borderVisible) {
        t2.fillStyle = this.Um();
        const s2 = Math.max(1, Math.floor(this.Wm().C * n2));
        t2.fillRect(0, 0, i2.width, s2);
      }
    }
    bp(t2) {
      const i2 = this.Jd.$t().St(), n2 = i2.ja();
      if (!n2 || 0 === n2.length) return;
      const s2 = this.U_.maxTickMarkWeight(n2), e2 = this.Wm(), r2 = i2.W();
      r2.borderVisible && r2.ticksVisible && t2.useBitmapCoordinateSpace(({ context: t3, horizontalPixelRatio: i3, verticalPixelRatio: s3 }) => {
        t3.strokeStyle = this.Um(), t3.fillStyle = this.Um();
        const r3 = Math.max(1, Math.floor(i3)), h2 = Math.floor(0.5 * i3);
        t3.beginPath();
        const l2 = Math.round(e2.T * s3);
        for (let s4 = n2.length; s4--; ) {
          const e3 = Math.round(n2[s4].coord * i3);
          t3.rect(e3 - h2, 0, r3, l2);
        }
        t3.fill();
      }), t2.useMediaCoordinateSpace(({ context: t3 }) => {
        const i3 = e2.C + e2.T + e2.L + e2.P / 2;
        t3.textAlign = "center", t3.textBaseline = "middle", t3.fillStyle = this.$(), t3.font = this.op();
        for (const e3 of n2) if (e3.weight < s2) {
          const n3 = e3.needAlignCoordinate ? this.qm(t3, e3.coord, e3.label) : e3.coord;
          t3.fillText(e3.label, n3, i3);
        }
        this.Jd.W().timeScale.allowBoldLabels && (t3.font = this.Ym());
        for (const e3 of n2) if (e3.weight >= s2) {
          const n3 = e3.needAlignCoordinate ? this.qm(t3, e3.coord, e3.label) : e3.coord;
          t3.fillText(e3.label, n3, i3);
        }
      });
    }
    qm(t2, i2, n2) {
      const s2 = this.Nv.xi(t2, n2), e2 = s2 / 2, r2 = Math.floor(i2 - e2) + 0.5;
      return r2 < 0 ? i2 += Math.abs(0 - r2) : r2 + s2 > this.Iv.width && (i2 -= Math.abs(this.Iv.width - (r2 + s2))), i2;
    }
    $m(t2, i2) {
      const n2 = this.Wm();
      for (const s2 of t2) for (const t3 of s2.Qi()) t3.gt().X(i2, n2);
    }
    Um() {
      return this.Jd.W().timeScale.borderColor;
    }
    $() {
      return this.cn.textColor;
    }
    j() {
      return this.cn.fontSize;
    }
    op() {
      return E(this.j(), this.cn.fontFamily);
    }
    Ym() {
      return E(this.j(), this.cn.fontFamily, "bold");
    }
    Wm() {
      null === this.k && (this.k = { C: 1, N: NaN, L: NaN, V: NaN, ji: NaN, T: 5, P: NaN, R: "", Wi: new Jt(), jm: 0 });
      const t2 = this.k, i2 = this.op();
      if (t2.R !== i2) {
        const n2 = this.j();
        t2.P = n2, t2.R = i2, t2.L = 3 * n2 / 12, t2.V = 3 * n2 / 12, t2.ji = 9 * n2 / 12, t2.N = 0, t2.jm = 4 * n2 / 12, t2.Wi.ir();
      }
      return this.k;
    }
    Sp(t2) {
      this.Xv.style.cursor = 1 === t2 ? "ew-resize" : "default";
    }
    zm() {
      const t2 = this.Jd.$t(), i2 = t2.W();
      i2.leftPriceScale.visible || null === this.Pm || (this.Bm.removeChild(this.Pm.hp()), this.Pm.S(), this.Pm = null), i2.rightPriceScale.visible || null === this.Rm || (this.Vm.removeChild(this.Rm.hp()), this.Rm.S(), this.Rm = null);
      const n2 = { _d: this.Jd.$t()._d() }, s2 = () => i2.leftPriceScale.borderVisible && t2.St().W().borderVisible, e2 = () => t2.md();
      i2.leftPriceScale.visible && null === this.Pm && (this.Pm = new zs("left", i2, n2, s2, e2), this.Bm.appendChild(this.Pm.hp())), i2.rightPriceScale.visible && null === this.Rm && (this.Rm = new zs("right", i2, n2, s2, e2), this.Vm.appendChild(this.Rm.hp()));
    }
  }
  const Ws = !!rs && !!navigator.userAgentData && navigator.userAgentData.brands.some((t2) => t2.brand.includes("Chromium")) && !!rs && ((null === (js = null === navigator || void 0 === navigator ? void 0 : navigator.userAgentData) || void 0 === js ? void 0 : js.platform) ? "Windows" === navigator.userAgentData.platform : navigator.userAgent.toLowerCase().indexOf("win") >= 0);
  var js;
  class Hs {
    constructor(t2, i2, n2) {
      var s2;
      this.Zm = [], this.Xm = 0, this.ro = 0, this.o_ = 0, this.Km = 0, this.Gm = 0, this.Jm = null, this.Qm = false, this.Dp = new C(), this.Op = new C(), this.Pc = new C(), this.tb = null, this.ib = null, this.Gd = t2, this.cn = i2, this.U_ = n2, this.Zd = document.createElement("div"), this.Zd.classList.add("tv-lightweight-charts"), this.Zd.style.overflow = "hidden", this.Zd.style.direction = "ltr", this.Zd.style.width = "100%", this.Zd.style.height = "100%", (s2 = this.Zd).style.userSelect = "none", s2.style.webkitUserSelect = "none", s2.style.msUserSelect = "none", s2.style.MozUserSelect = "none", s2.style.webkitTapHighlightColor = "transparent", this.nb = document.createElement("table"), this.nb.setAttribute("cellspacing", "0"), this.Zd.appendChild(this.nb), this.sb = this.eb.bind(this), $s(this.cn) && this.rb(true), this.$i = new Vn(this.Dc.bind(this), this.cn, n2), this.$t().Zc().l(this.hb.bind(this), this), this.lb = new Fs(this, this.U_), this.nb.appendChild(this.lb.hp());
      const e2 = i2.autoSize && this.ab();
      let r2 = this.cn.width, h2 = this.cn.height;
      if (e2 || 0 === r2 || 0 === h2) {
        const i3 = t2.getBoundingClientRect();
        r2 = r2 || i3.width, h2 = h2 || i3.height;
      }
      this.ob(r2, h2), this._b(), t2.appendChild(this.Zd), this.ub(), this.$i.St().sc().l(this.$i.Xl.bind(this.$i), this), this.$i.w_().l(this.$i.Xl.bind(this.$i), this);
    }
    $t() {
      return this.$i;
    }
    W() {
      return this.cn;
    }
    qp() {
      return this.Zm;
    }
    cb() {
      return this.lb;
    }
    S() {
      this.rb(false), 0 !== this.Xm && window.cancelAnimationFrame(this.Xm), this.$i.Zc().p(this), this.$i.St().sc().p(this), this.$i.w_().p(this), this.$i.S();
      for (const t2 of this.Zm) this.nb.removeChild(t2.hp()), t2.hm().p(this), t2.lm().p(this), t2.S();
      this.Zm = [], f(this.lb).S(), null !== this.Zd.parentElement && this.Zd.parentElement.removeChild(this.Zd), this.Pc.S(), this.Dp.S(), this.Op.S(), this.fb();
    }
    ob(t2, i2, n2 = false) {
      if (this.ro === i2 && this.o_ === t2) return;
      const s2 = function(t3) {
        const i3 = Math.floor(t3.width), n3 = Math.floor(t3.height);
        return Jn({ width: i3 - i3 % 2, height: n3 - n3 % 2 });
      }(Jn({ width: t2, height: i2 }));
      this.ro = s2.height, this.o_ = s2.width;
      const e2 = this.ro + "px", r2 = this.o_ + "px";
      f(this.Zd).style.height = e2, f(this.Zd).style.width = r2, this.nb.style.height = e2, this.nb.style.width = r2, n2 ? this.pb(lt.es(), performance.now()) : this.$i.Xl();
    }
    fp(t2) {
      void 0 === t2 && (t2 = lt.es());
      for (let i2 = 0; i2 < this.Zm.length; i2++) this.Zm[i2].fp(t2.Hn(i2).Fn);
      this.cn.timeScale.visible && this.lb.fp(t2.jn());
    }
    Hh(t2) {
      const i2 = $s(this.cn);
      this.$i.Hh(t2);
      const n2 = $s(this.cn);
      n2 !== i2 && this.rb(n2), this.ub(), this.mb(t2);
    }
    hm() {
      return this.Dp;
    }
    lm() {
      return this.Op;
    }
    Zc() {
      return this.Pc;
    }
    bb() {
      null !== this.Jm && (this.pb(this.Jm, performance.now()), this.Jm = null);
      const t2 = this.wb(null), i2 = document.createElement("canvas");
      i2.width = t2.width, i2.height = t2.height;
      const n2 = f(i2.getContext("2d"));
      return this.wb(n2), i2;
    }
    gb(t2) {
      if ("left" === t2 && !this.Mb()) return 0;
      if ("right" === t2 && !this.xb()) return 0;
      if (0 === this.Zm.length) return 0;
      return f("left" === t2 ? this.Zm[0].bm() : this.Zm[0].wm()).cp();
    }
    Sb() {
      return this.cn.autoSize && null !== this.tb;
    }
    kb() {
      return this.Zd;
    }
    Jp(t2) {
      this.ib = t2, this.ib ? this.kb().style.setProperty("cursor", t2) : this.kb().style.removeProperty("cursor");
    }
    yb() {
      return this.ib;
    }
    Cb() {
      return d(this.Zm[0])._m();
    }
    mb(t2) {
      (void 0 !== t2.autoSize || !this.tb || void 0 === t2.width && void 0 === t2.height) && (t2.autoSize && !this.tb && this.ab(), false === t2.autoSize && null !== this.tb && this.fb(), t2.autoSize || void 0 === t2.width && void 0 === t2.height || this.ob(t2.width || this.o_, t2.height || this.ro));
    }
    wb(t2) {
      let i2 = 0, n2 = 0;
      const s2 = this.Zm[0], e2 = (i3, n3) => {
        let s3 = 0;
        for (let e3 = 0; e3 < this.Zm.length; e3++) {
          const r3 = this.Zm[e3], h2 = f("left" === i3 ? r3.bm() : r3.wm()), l2 = h2.Mp();
          null !== t2 && h2.xp(t2, n3, s3), s3 += l2.height;
        }
      };
      if (this.Mb()) {
        e2("left", 0);
        i2 += f(s2.bm()).Mp().width;
      }
      for (let s3 = 0; s3 < this.Zm.length; s3++) {
        const e3 = this.Zm[s3], r3 = e3.Mp();
        null !== t2 && e3.xp(t2, i2, n2), n2 += r3.height;
      }
      if (i2 += s2.Mp().width, this.xb()) {
        e2("right", i2);
        i2 += f(s2.wm()).Mp().width;
      }
      const r2 = (i3, n3, s3) => {
        f("left" === i3 ? this.lb.Em() : this.lb.Im()).xp(f(t2), n3, s3);
      };
      if (this.cn.timeScale.visible) {
        const i3 = this.lb.Mp();
        if (null !== t2) {
          let e3 = 0;
          this.Mb() && (r2("left", e3, n2), e3 = f(s2.bm()).Mp().width), this.lb.xp(t2, e3, n2), e3 += i3.width, this.xb() && r2("right", e3, n2);
        }
        n2 += i3.height;
      }
      return Jn({ width: i2, height: n2 });
    }
    Tb() {
      let t2 = 0, i2 = 0, n2 = 0;
      for (const s3 of this.Zm) this.Mb() && (i2 = Math.max(i2, f(s3.bm()).ap(), this.cn.leftPriceScale.minimumWidth)), this.xb() && (n2 = Math.max(n2, f(s3.wm()).ap(), this.cn.rightPriceScale.minimumWidth)), t2 += s3.g_();
      i2 = as(i2), n2 = as(n2);
      const s2 = this.o_, e2 = this.ro, r2 = Math.max(s2 - i2 - n2, 0), h2 = this.cn.timeScale.visible;
      let l2 = h2 ? Math.max(this.lb.Fm(), this.cn.timeScale.minimumHeight) : 0;
      var a2;
      l2 = (a2 = l2) + a2 % 2;
      const o2 = 0 + l2, _2 = e2 < o2 ? 0 : e2 - o2, u2 = _2 / t2;
      let c2 = 0;
      for (let t3 = 0; t3 < this.Zm.length; ++t3) {
        const s3 = this.Zm[t3];
        s3.Up(this.$i.Uc()[t3]);
        let e3 = 0, h3 = 0;
        h3 = t3 === this.Zm.length - 1 ? _2 - c2 : Math.round(s3.g_() * u2), e3 = Math.max(h3, 2), c2 += e3, s3.up(Jn({ width: r2, height: e3 })), this.Mb() && s3.om(i2, "left"), this.xb() && s3.om(n2, "right"), s3.dp() && this.$i.Xc(s3.dp(), e3);
      }
      this.lb.Nm(Jn({ width: h2 ? r2 : 0, height: l2 }), h2 ? i2 : 0, h2 ? n2 : 0), this.$i.x_(r2), this.Km !== i2 && (this.Km = i2), this.Gm !== n2 && (this.Gm = n2);
    }
    rb(t2) {
      t2 ? this.Zd.addEventListener("wheel", this.sb, { passive: false }) : this.Zd.removeEventListener("wheel", this.sb);
    }
    Pb(t2) {
      switch (t2.deltaMode) {
        case t2.DOM_DELTA_PAGE:
          return 120;
        case t2.DOM_DELTA_LINE:
          return 32;
      }
      return Ws ? 1 / window.devicePixelRatio : 1;
    }
    eb(t2) {
      if (!(0 !== t2.deltaX && this.cn.handleScroll.mouseWheel || 0 !== t2.deltaY && this.cn.handleScale.mouseWheel)) return;
      const i2 = this.Pb(t2), n2 = i2 * t2.deltaX / 100, s2 = -i2 * t2.deltaY / 100;
      if (t2.cancelable && t2.preventDefault(), 0 !== s2 && this.cn.handleScale.mouseWheel) {
        const i3 = Math.sign(s2) * Math.min(1, Math.abs(s2)), n3 = t2.clientX - this.Zd.getBoundingClientRect().left;
        this.$t().Jc(n3, i3);
      }
      0 !== n2 && this.cn.handleScroll.mouseWheel && this.$t().Qc(-80 * n2);
    }
    pb(t2, i2) {
      var n2;
      const s2 = t2.jn();
      3 === s2 && this.Rb(), 3 !== s2 && 2 !== s2 || (this.Db(t2), this.Ob(t2, i2), this.lb.bt(), this.Zm.forEach((t3) => {
        t3.Zp();
      }), 3 === (null === (n2 = this.Jm) || void 0 === n2 ? void 0 : n2.jn()) && (this.Jm.ts(t2), this.Rb(), this.Db(this.Jm), this.Ob(this.Jm, i2), t2 = this.Jm, this.Jm = null)), this.fp(t2);
    }
    Ob(t2, i2) {
      for (const n2 of t2.Qn()) this.ns(n2, i2);
    }
    Db(t2) {
      const i2 = this.$i.Uc();
      for (let n2 = 0; n2 < i2.length; n2++) t2.Hn(n2).Wn && i2[n2].L_();
    }
    ns(t2, i2) {
      const n2 = this.$i.St();
      switch (t2.qn) {
        case 0:
          n2.rc();
          break;
        case 1:
          n2.hc(t2.Ot);
          break;
        case 2:
          n2.Gn(t2.Ot);
          break;
        case 3:
          n2.Jn(t2.Ot);
          break;
        case 4:
          n2.Uu();
          break;
        case 5:
          t2.Ot.Ju(i2) || n2.Jn(t2.Ot.Qu(i2));
      }
    }
    Dc(t2) {
      null !== this.Jm ? this.Jm.ts(t2) : this.Jm = t2, this.Qm || (this.Qm = true, this.Xm = window.requestAnimationFrame((t3) => {
        if (this.Qm = false, this.Xm = 0, null !== this.Jm) {
          const i2 = this.Jm;
          this.Jm = null, this.pb(i2, t3);
          for (const n2 of i2.Qn()) if (5 === n2.qn && !n2.Ot.Ju(t3)) {
            this.$t().Zn(n2.Ot);
            break;
          }
        }
      }));
    }
    Rb() {
      this._b();
    }
    _b() {
      const t2 = this.$i.Uc(), i2 = t2.length, n2 = this.Zm.length;
      for (let t3 = i2; t3 < n2; t3++) {
        const t4 = d(this.Zm.pop());
        this.nb.removeChild(t4.hp()), t4.hm().p(this), t4.lm().p(this), t4.S();
      }
      for (let s2 = n2; s2 < i2; s2++) {
        const i3 = new As(this, t2[s2]);
        i3.hm().l(this.Bb.bind(this), this), i3.lm().l(this.Vb.bind(this), this), this.Zm.push(i3), this.nb.insertBefore(i3.hp(), this.lb.hp());
      }
      for (let n3 = 0; n3 < i2; n3++) {
        const i3 = t2[n3], s2 = this.Zm[n3];
        s2.dp() !== i3 ? s2.Up(i3) : s2.$p();
      }
      this.ub(), this.Tb();
    }
    Ab(t2, i2, n2) {
      var s2;
      const e2 = /* @__PURE__ */ new Map();
      if (null !== t2) {
        this.$i.wt().forEach((i3) => {
          const n3 = i3.zn().hl(t2);
          null !== n3 && e2.set(i3, n3);
        });
      }
      let r2;
      if (null !== t2) {
        const i3 = null === (s2 = this.$i.St().Ui(t2)) || void 0 === s2 ? void 0 : s2.originalTime;
        void 0 !== i3 && (r2 = i3);
      }
      const h2 = this.$t().Fc(), l2 = null !== h2 && h2.jc instanceof Yi ? h2.jc : void 0, a2 = null !== h2 && void 0 !== h2.Av ? h2.Av.wr : void 0;
      return { zb: r2, se: null != t2 ? t2 : void 0, Eb: null != i2 ? i2 : void 0, Ib: l2, Lb: e2, Nb: a2, Fb: null != n2 ? n2 : void 0 };
    }
    Bb(t2, i2, n2) {
      this.Dp.m(() => this.Ab(t2, i2, n2));
    }
    Vb(t2, i2, n2) {
      this.Op.m(() => this.Ab(t2, i2, n2));
    }
    hb(t2, i2, n2) {
      this.Pc.m(() => this.Ab(t2, i2, n2));
    }
    ub() {
      const t2 = this.cn.timeScale.visible ? "" : "none";
      this.lb.hp().style.display = t2;
    }
    Mb() {
      return this.Zm[0].dp().P_().W().visible;
    }
    xb() {
      return this.Zm[0].dp().R_().W().visible;
    }
    ab() {
      return "ResizeObserver" in window && (this.tb = new ResizeObserver((t2) => {
        const i2 = t2.find((t3) => t3.target === this.Gd);
        i2 && this.ob(i2.contentRect.width, i2.contentRect.height);
      }), this.tb.observe(this.Gd, { box: "border-box" }), true);
    }
    fb() {
      null !== this.tb && this.tb.disconnect(), this.tb = null;
    }
  }
  function $s(t2) {
    return Boolean(t2.handleScroll.mouseWheel || t2.handleScale.mouseWheel);
  }
  function Us(t2) {
    return function(t3) {
      return void 0 !== t3.open;
    }(t2) || function(t3) {
      return void 0 !== t3.value;
    }(t2);
  }
  function qs(t2, i2) {
    var n2 = {};
    for (var s2 in t2) Object.prototype.hasOwnProperty.call(t2, s2) && i2.indexOf(s2) < 0 && (n2[s2] = t2[s2]);
    if (null != t2 && "function" == typeof Object.getOwnPropertySymbols) {
      var e2 = 0;
      for (s2 = Object.getOwnPropertySymbols(t2); e2 < s2.length; e2++) i2.indexOf(s2[e2]) < 0 && Object.prototype.propertyIsEnumerable.call(t2, s2[e2]) && (n2[s2[e2]] = t2[s2[e2]]);
    }
    return n2;
  }
  function Ys(t2, i2, n2, s2) {
    const e2 = n2.value, r2 = { se: i2, ot: t2, Ot: [e2, e2, e2, e2], zb: s2 };
    return void 0 !== n2.color && (r2.O = n2.color), r2;
  }
  function Zs(t2, i2, n2, s2) {
    const e2 = n2.value, r2 = { se: i2, ot: t2, Ot: [e2, e2, e2, e2], zb: s2 };
    return void 0 !== n2.lineColor && (r2.lt = n2.lineColor), void 0 !== n2.topColor && (r2.Ts = n2.topColor), void 0 !== n2.bottomColor && (r2.Ps = n2.bottomColor), r2;
  }
  function Xs(t2, i2, n2, s2) {
    const e2 = n2.value, r2 = { se: i2, ot: t2, Ot: [e2, e2, e2, e2], zb: s2 };
    return void 0 !== n2.topLineColor && (r2.Pe = n2.topLineColor), void 0 !== n2.bottomLineColor && (r2.Re = n2.bottomLineColor), void 0 !== n2.topFillColor1 && (r2.Se = n2.topFillColor1), void 0 !== n2.topFillColor2 && (r2.ke = n2.topFillColor2), void 0 !== n2.bottomFillColor1 && (r2.ye = n2.bottomFillColor1), void 0 !== n2.bottomFillColor2 && (r2.Ce = n2.bottomFillColor2), r2;
  }
  function Ks(t2, i2, n2, s2) {
    const e2 = { se: i2, ot: t2, Ot: [n2.open, n2.high, n2.low, n2.close], zb: s2 };
    return void 0 !== n2.color && (e2.O = n2.color), e2;
  }
  function Gs(t2, i2, n2, s2) {
    const e2 = { se: i2, ot: t2, Ot: [n2.open, n2.high, n2.low, n2.close], zb: s2 };
    return void 0 !== n2.color && (e2.O = n2.color), void 0 !== n2.borderColor && (e2.Bt = n2.borderColor), void 0 !== n2.wickColor && (e2.Zh = n2.wickColor), e2;
  }
  function Js(t2, i2, n2, s2, e2) {
    const r2 = d(e2)(n2), h2 = Math.max(...r2), l2 = Math.min(...r2), a2 = r2[r2.length - 1], o2 = [a2, h2, l2, a2], _2 = n2, { time: u2, color: c2 } = _2;
    return { se: i2, ot: t2, Ot: o2, zb: s2, He: qs(_2, ["time", "color"]), O: c2 };
  }
  function Qs(t2) {
    return void 0 !== t2.Ot;
  }
  function te(t2, i2) {
    return void 0 !== i2.customValues && (t2.Wb = i2.customValues), t2;
  }
  function ie(t2) {
    return (i2, n2, s2, e2, r2, h2) => function(t3, i3) {
      return i3 ? i3(t3) : void 0 === (n3 = t3).open && void 0 === n3.value;
      var n3;
    }(s2, h2) ? te({ ot: i2, se: n2, zb: e2 }, s2) : te(t2(i2, n2, s2, e2, r2), s2);
  }
  function ne(t2) {
    return { Candlestick: ie(Gs), Bar: ie(Ks), Area: ie(Zs), Baseline: ie(Xs), Histogram: ie(Ys), Line: ie(Ys), Custom: ie(Js) }[t2];
  }
  function se(t2) {
    return { se: 0, jb: /* @__PURE__ */ new Map(), ha: t2 };
  }
  function ee(t2, i2) {
    if (void 0 !== t2 && 0 !== t2.length) return { Hb: i2.key(t2[0].ot), $b: i2.key(t2[t2.length - 1].ot) };
  }
  function re(t2) {
    let i2;
    return t2.forEach((t3) => {
      void 0 === i2 && (i2 = t3.zb);
    }), d(i2);
  }
  class he {
    constructor(t2) {
      this.Ub = /* @__PURE__ */ new Map(), this.qb = /* @__PURE__ */ new Map(), this.Yb = /* @__PURE__ */ new Map(), this.Zb = [], this.U_ = t2;
    }
    S() {
      this.Ub.clear(), this.qb.clear(), this.Yb.clear(), this.Zb = [];
    }
    Xb(t2, i2) {
      let n2 = 0 !== this.Ub.size, s2 = false;
      const e2 = this.qb.get(t2);
      if (void 0 !== e2) if (1 === this.qb.size) n2 = false, s2 = true, this.Ub.clear();
      else for (const i3 of this.Zb) i3.pointData.jb.delete(t2) && (s2 = true);
      let r2 = [];
      if (0 !== i2.length) {
        const n3 = i2.map((t3) => t3.time), e3 = this.U_.createConverterToInternalObj(i2), h3 = ne(t2.Jh()), l2 = t2.ya(), a2 = t2.Ca();
        r2 = i2.map((i3, r3) => {
          const o2 = e3(i3.time), _2 = this.U_.key(o2);
          let u2 = this.Ub.get(_2);
          void 0 === u2 && (u2 = se(o2), this.Ub.set(_2, u2), s2 = true);
          const c2 = h3(o2, u2.se, i3, n3[r3], l2, a2);
          return u2.jb.set(t2, c2), c2;
        });
      }
      n2 && this.Kb(), this.Gb(t2, r2);
      let h2 = -1;
      if (s2) {
        const t3 = [];
        this.Ub.forEach((i3) => {
          t3.push({ timeWeight: 0, time: i3.ha, pointData: i3, originalTime: re(i3.jb) });
        }), t3.sort((t4, i3) => this.U_.key(t4.time) - this.U_.key(i3.time)), h2 = this.Jb(t3);
      }
      return this.Qb(t2, h2, function(t3, i3, n3) {
        const s3 = ee(t3, n3), e3 = ee(i3, n3);
        if (void 0 !== s3 && void 0 !== e3) return { Ql: s3.$b >= e3.$b && s3.Hb >= e3.Hb };
      }(this.qb.get(t2), e2, this.U_));
    }
    fd(t2) {
      return this.Xb(t2, []);
    }
    tw(t2, i2) {
      const n2 = i2;
      !function(t3) {
        void 0 === t3.zb && (t3.zb = t3.time);
      }(n2), this.U_.preprocessData(i2);
      const s2 = this.U_.createConverterToInternalObj([i2])(i2.time), e2 = this.Yb.get(t2);
      if (void 0 !== e2 && this.U_.key(s2) < this.U_.key(e2)) throw new Error(`Cannot update oldest data, last time=${e2}, new time=${s2}`);
      let r2 = this.Ub.get(this.U_.key(s2));
      const h2 = void 0 === r2;
      void 0 === r2 && (r2 = se(s2), this.Ub.set(this.U_.key(s2), r2));
      const l2 = ne(t2.Jh()), a2 = t2.ya(), o2 = t2.Ca(), _2 = l2(s2, r2.se, i2, n2.zb, a2, o2);
      r2.jb.set(t2, _2), this.iw(t2, _2);
      const u2 = { Ql: Qs(_2) };
      if (!h2) return this.Qb(t2, -1, u2);
      const c2 = { timeWeight: 0, time: r2.ha, pointData: r2, originalTime: re(r2.jb) }, d2 = Rt(this.Zb, this.U_.key(c2.time), (t3, i3) => this.U_.key(t3.time) < i3);
      this.Zb.splice(d2, 0, c2);
      for (let t3 = d2; t3 < this.Zb.length; ++t3) le(this.Zb[t3].pointData, t3);
      return this.U_.fillWeightsForPoints(this.Zb, d2), this.Qb(t2, d2, u2);
    }
    iw(t2, i2) {
      let n2 = this.qb.get(t2);
      void 0 === n2 && (n2 = [], this.qb.set(t2, n2));
      const s2 = 0 !== n2.length ? n2[n2.length - 1] : null;
      null === s2 || this.U_.key(i2.ot) > this.U_.key(s2.ot) ? Qs(i2) && n2.push(i2) : Qs(i2) ? n2[n2.length - 1] = i2 : n2.splice(-1, 1), this.Yb.set(t2, i2.ot);
    }
    Gb(t2, i2) {
      0 !== i2.length ? (this.qb.set(t2, i2.filter(Qs)), this.Yb.set(t2, i2[i2.length - 1].ot)) : (this.qb.delete(t2), this.Yb.delete(t2));
    }
    Kb() {
      for (const t2 of this.Zb) 0 === t2.pointData.jb.size && this.Ub.delete(this.U_.key(t2.time));
    }
    Jb(t2) {
      let i2 = -1;
      for (let n2 = 0; n2 < this.Zb.length && n2 < t2.length; ++n2) {
        const s2 = this.Zb[n2], e2 = t2[n2];
        if (this.U_.key(s2.time) !== this.U_.key(e2.time)) {
          i2 = n2;
          break;
        }
        e2.timeWeight = s2.timeWeight, le(e2.pointData, n2);
      }
      if (-1 === i2 && this.Zb.length !== t2.length && (i2 = Math.min(this.Zb.length, t2.length)), -1 === i2) return -1;
      for (let n2 = i2; n2 < t2.length; ++n2) le(t2[n2].pointData, n2);
      return this.U_.fillWeightsForPoints(t2, i2), this.Zb = t2, i2;
    }
    nw() {
      if (0 === this.qb.size) return null;
      let t2 = 0;
      return this.qb.forEach((i2) => {
        0 !== i2.length && (t2 = Math.max(t2, i2[i2.length - 1].se));
      }), t2;
    }
    Qb(t2, i2, n2) {
      const s2 = { sw: /* @__PURE__ */ new Map(), St: { Iu: this.nw() } };
      if (-1 !== i2) this.qb.forEach((i3, e2) => {
        s2.sw.set(e2, { He: i3, ew: e2 === t2 ? n2 : void 0 });
      }), this.qb.has(t2) || s2.sw.set(t2, { He: [], ew: n2 }), s2.St.rw = this.Zb, s2.St.hw = i2;
      else {
        const i3 = this.qb.get(t2);
        s2.sw.set(t2, { He: i3 || [], ew: n2 });
      }
      return s2;
    }
  }
  function le(t2, i2) {
    t2.se = i2, t2.jb.forEach((t3) => {
      t3.se = i2;
    });
  }
  function ae(t2) {
    const i2 = { value: t2.Ot[3], time: t2.zb };
    return void 0 !== t2.Wb && (i2.customValues = t2.Wb), i2;
  }
  function oe(t2) {
    const i2 = ae(t2);
    return void 0 !== t2.O && (i2.color = t2.O), i2;
  }
  function _e(t2) {
    const i2 = ae(t2);
    return void 0 !== t2.lt && (i2.lineColor = t2.lt), void 0 !== t2.Ts && (i2.topColor = t2.Ts), void 0 !== t2.Ps && (i2.bottomColor = t2.Ps), i2;
  }
  function ue(t2) {
    const i2 = ae(t2);
    return void 0 !== t2.Pe && (i2.topLineColor = t2.Pe), void 0 !== t2.Re && (i2.bottomLineColor = t2.Re), void 0 !== t2.Se && (i2.topFillColor1 = t2.Se), void 0 !== t2.ke && (i2.topFillColor2 = t2.ke), void 0 !== t2.ye && (i2.bottomFillColor1 = t2.ye), void 0 !== t2.Ce && (i2.bottomFillColor2 = t2.Ce), i2;
  }
  function ce(t2) {
    const i2 = { open: t2.Ot[0], high: t2.Ot[1], low: t2.Ot[2], close: t2.Ot[3], time: t2.zb };
    return void 0 !== t2.Wb && (i2.customValues = t2.Wb), i2;
  }
  function de(t2) {
    const i2 = ce(t2);
    return void 0 !== t2.O && (i2.color = t2.O), i2;
  }
  function fe(t2) {
    const i2 = ce(t2), { O: n2, Bt: s2, Zh: e2 } = t2;
    return void 0 !== n2 && (i2.color = n2), void 0 !== s2 && (i2.borderColor = s2), void 0 !== e2 && (i2.wickColor = e2), i2;
  }
  function ve(t2) {
    return { Area: _e, Line: oe, Baseline: ue, Histogram: oe, Bar: de, Candlestick: fe, Custom: pe }[t2];
  }
  function pe(t2) {
    const i2 = t2.zb;
    return Object.assign(Object.assign({}, t2.He), { time: i2 });
  }
  const me = { vertLine: { color: "#9598A1", width: 1, style: 3, visible: true, labelVisible: true, labelBackgroundColor: "#131722" }, horzLine: { color: "#9598A1", width: 1, style: 3, visible: true, labelVisible: true, labelBackgroundColor: "#131722" }, mode: 1 }, be = { vertLines: { color: "#D6DCDE", style: 0, visible: true }, horzLines: { color: "#D6DCDE", style: 0, visible: true } }, we = { background: { type: "solid", color: "#FFFFFF" }, textColor: "#191919", fontSize: 12, fontFamily: z, attributionLogo: true }, ge = { autoScale: true, mode: 0, invertScale: false, alignLabels: true, borderVisible: true, borderColor: "#2B2B43", entireTextOnly: false, visible: false, ticksVisible: false, scaleMargins: { bottom: 0.1, top: 0.2 }, minimumWidth: 0 }, Me = { rightOffset: 0, barSpacing: 6, minBarSpacing: 0.5, fixLeftEdge: false, fixRightEdge: false, lockVisibleTimeRangeOnResize: false, rightBarStaysOnScroll: false, borderVisible: true, borderColor: "#2B2B43", visible: true, timeVisible: false, secondsVisible: true, shiftVisibleRangeOnNewBar: true, allowShiftVisibleRangeOnWhitespaceReplacement: false, ticksVisible: false, uniformDistribution: false, minimumHeight: 0, allowBoldLabels: true }, xe = { color: "rgba(0, 0, 0, 0)", visible: false, fontSize: 48, fontFamily: z, fontStyle: "", text: "", horzAlign: "center", vertAlign: "center" };
  function Se() {
    return { width: 0, height: 0, autoSize: false, layout: we, crosshair: me, grid: be, overlayPriceScales: Object.assign({}, ge), leftPriceScale: Object.assign(Object.assign({}, ge), { visible: false }), rightPriceScale: Object.assign(Object.assign({}, ge), { visible: true }), timeScale: Me, watermark: xe, localization: { locale: rs ? navigator.language : "", dateFormat: "dd MMM 'yy" }, handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true }, handleScale: { axisPressedMouseMove: { time: true, price: true }, axisDoubleClickReset: { time: true, price: true }, mouseWheel: true, pinch: true }, kineticScroll: { mouse: false, touch: true }, trackingMode: { exitMode: 1 } };
  }
  class ke {
    constructor(t2, i2) {
      this.lw = t2, this.aw = i2;
    }
    applyOptions(t2) {
      this.lw.$t().Hc(this.aw, t2);
    }
    options() {
      return this.Ii().W();
    }
    width() {
      return ht(this.aw) ? this.lw.gb(this.aw) : 0;
    }
    Ii() {
      return f(this.lw.$t().$c(this.aw)).Dt;
    }
  }
  function ye(t2, i2, n2) {
    const s2 = qs(t2, ["time", "originalTime"]), e2 = Object.assign({ time: i2 }, s2);
    return void 0 !== n2 && (e2.originalTime = n2), e2;
  }
  const Ce = { color: "#FF0000", price: 0, lineStyle: 2, lineWidth: 1, lineVisible: true, axisLabelVisible: true, title: "", axisLabelColor: "", axisLabelTextColor: "" };
  class Te {
    constructor(t2) {
      this.Lh = t2;
    }
    applyOptions(t2) {
      this.Lh.Hh(t2);
    }
    options() {
      return this.Lh.W();
    }
    ow() {
      return this.Lh;
    }
  }
  class Pe {
    constructor(t2, i2, n2, s2, e2) {
      this._w = new C(), this.Is = t2, this.uw = i2, this.cw = n2, this.U_ = e2, this.dw = s2;
    }
    S() {
      this._w.S();
    }
    priceFormatter() {
      return this.Is.ma();
    }
    priceToCoordinate(t2) {
      const i2 = this.Is.Ct();
      return null === i2 ? null : this.Is.Dt().Rt(t2, i2.Ot);
    }
    coordinateToPrice(t2) {
      const i2 = this.Is.Ct();
      return null === i2 ? null : this.Is.Dt().pn(t2, i2.Ot);
    }
    barsInLogicalRange(t2) {
      if (null === t2) return null;
      const i2 = new Mn(new bn(t2.from, t2.to)).hu(), n2 = this.Is.zn();
      if (n2.Ni()) return null;
      const s2 = n2.hl(i2.Os(), 1), e2 = n2.hl(i2.ui(), -1), r2 = f(n2.sl()), h2 = f(n2.An());
      if (null !== s2 && null !== e2 && s2.se > e2.se) return { barsBefore: t2.from - r2, barsAfter: h2 - t2.to };
      const l2 = { barsBefore: null === s2 || s2.se === r2 ? t2.from - r2 : s2.se - r2, barsAfter: null === e2 || e2.se === h2 ? h2 - t2.to : h2 - e2.se };
      return null !== s2 && null !== e2 && (l2.from = s2.zb, l2.to = e2.zb), l2;
    }
    setData(t2) {
      this.U_, this.Is.Jh(), this.uw.fw(this.Is, t2), this.pw("full");
    }
    update(t2) {
      this.Is.Jh(), this.uw.mw(this.Is, t2), this.pw("update");
    }
    dataByIndex(t2, i2) {
      const n2 = this.Is.zn().hl(t2, i2);
      if (null === n2) return null;
      return ve(this.seriesType())(n2);
    }
    data() {
      const t2 = ve(this.seriesType());
      return this.Is.zn().ie().map((i2) => t2(i2));
    }
    subscribeDataChanged(t2) {
      this._w.l(t2);
    }
    unsubscribeDataChanged(t2) {
      this._w.v(t2);
    }
    setMarkers(t2) {
      this.U_;
      const i2 = t2.map((t3) => ye(t3, this.U_.convertHorzItemToInternal(t3.time), t3.time));
      this.Is.ia(i2);
    }
    markers() {
      return this.Is.na().map((t2) => ye(t2, t2.originalTime, void 0));
    }
    applyOptions(t2) {
      this.Is.Hh(t2);
    }
    options() {
      return B(this.Is.W());
    }
    priceScale() {
      return this.cw.priceScale(this.Is.Dt().Ta());
    }
    createPriceLine(t2) {
      const i2 = T(B(Ce), t2), n2 = this.Is.sa(i2);
      return new Te(n2);
    }
    removePriceLine(t2) {
      this.Is.ea(t2.ow());
    }
    seriesType() {
      return this.Is.Jh();
    }
    attachPrimitive(t2) {
      this.Is.Sa(t2), t2.attached && t2.attached({ chart: this.dw, series: this, requestUpdate: () => this.Is.$t().Xl() });
    }
    detachPrimitive(t2) {
      this.Is.ka(t2), t2.detached && t2.detached();
    }
    pw(t2) {
      this._w.M() && this._w.m(t2);
    }
  }
  class Re {
    constructor(t2, i2, n2) {
      this.bw = new C(), this.pu = new C(), this.Om = new C(), this.$i = t2, this.kl = t2.St(), this.lb = i2, this.kl.tc().l(this.ww.bind(this)), this.kl.nc().l(this.gw.bind(this)), this.lb.Lm().l(this.Mw.bind(this)), this.U_ = n2;
    }
    S() {
      this.kl.tc().p(this), this.kl.nc().p(this), this.lb.Lm().p(this), this.bw.S(), this.pu.S(), this.Om.S();
    }
    scrollPosition() {
      return this.kl.ju();
    }
    scrollToPosition(t2, i2) {
      i2 ? this.kl.Gu(t2, 1e3) : this.$i.Jn(t2);
    }
    scrollToRealTime() {
      this.kl.Ku();
    }
    getVisibleRange() {
      const t2 = this.kl.Du();
      return null === t2 ? null : { from: t2.from.originalTime, to: t2.to.originalTime };
    }
    setVisibleRange(t2) {
      const i2 = { from: this.U_.convertHorzItemToInternal(t2.from), to: this.U_.convertHorzItemToInternal(t2.to) }, n2 = this.kl.Au(i2);
      this.$i.vd(n2);
    }
    getVisibleLogicalRange() {
      const t2 = this.kl.Ru();
      return null === t2 ? null : { from: t2.Os(), to: t2.ui() };
    }
    setVisibleLogicalRange(t2) {
      c(t2.from <= t2.to, "The from index cannot be after the to index."), this.$i.vd(t2);
    }
    resetTimeScale() {
      this.$i.Kn();
    }
    fitContent() {
      this.$i.rc();
    }
    logicalToCoordinate(t2) {
      const i2 = this.$i.St();
      return i2.Ni() ? null : i2.zt(t2);
    }
    coordinateToLogical(t2) {
      return this.kl.Ni() ? null : this.kl.Lu(t2);
    }
    timeToCoordinate(t2) {
      const i2 = this.U_.convertHorzItemToInternal(t2), n2 = this.kl.Da(i2, false);
      return null === n2 ? null : this.kl.zt(n2);
    }
    coordinateToTime(t2) {
      const i2 = this.$i.St(), n2 = i2.Lu(t2), s2 = i2.Ui(n2);
      return null === s2 ? null : s2.originalTime;
    }
    width() {
      return this.lb._m().width;
    }
    height() {
      return this.lb._m().height;
    }
    subscribeVisibleTimeRangeChange(t2) {
      this.bw.l(t2);
    }
    unsubscribeVisibleTimeRangeChange(t2) {
      this.bw.v(t2);
    }
    subscribeVisibleLogicalRangeChange(t2) {
      this.pu.l(t2);
    }
    unsubscribeVisibleLogicalRangeChange(t2) {
      this.pu.v(t2);
    }
    subscribeSizeChange(t2) {
      this.Om.l(t2);
    }
    unsubscribeSizeChange(t2) {
      this.Om.v(t2);
    }
    applyOptions(t2) {
      this.kl.Hh(t2);
    }
    options() {
      return Object.assign(Object.assign({}, B(this.kl.W())), { barSpacing: this.kl.he() });
    }
    ww() {
      this.bw.M() && this.bw.m(this.getVisibleRange());
    }
    gw() {
      this.pu.M() && this.pu.m(this.getVisibleLogicalRange());
    }
    Mw(t2) {
      this.Om.m(t2.width, t2.height);
    }
  }
  function De(t2) {
    if (void 0 === t2 || "custom" === t2.type) return;
    const i2 = t2;
    void 0 !== i2.minMove && void 0 === i2.precision && (i2.precision = function(t3) {
      if (t3 >= 1) return 0;
      let i3 = 0;
      for (; i3 < 8; i3++) {
        const n2 = Math.round(t3);
        if (Math.abs(n2 - t3) < 1e-8) return i3;
        t3 *= 10;
      }
      return i3;
    }(i2.minMove));
  }
  function Oe(t2) {
    return function(t3) {
      if (O(t3.handleScale)) {
        const i3 = t3.handleScale;
        t3.handleScale = { axisDoubleClickReset: { time: i3, price: i3 }, axisPressedMouseMove: { time: i3, price: i3 }, mouseWheel: i3, pinch: i3 };
      } else if (void 0 !== t3.handleScale) {
        const { axisPressedMouseMove: i3, axisDoubleClickReset: n2 } = t3.handleScale;
        O(i3) && (t3.handleScale.axisPressedMouseMove = { time: i3, price: i3 }), O(n2) && (t3.handleScale.axisDoubleClickReset = { time: n2, price: n2 });
      }
      const i2 = t3.handleScroll;
      O(i2) && (t3.handleScroll = { horzTouchDrag: i2, vertTouchDrag: i2, mouseWheel: i2, pressedMouseMove: i2 });
    }(t2), t2;
  }
  class Be {
    constructor(t2, i2, n2) {
      this.xw = /* @__PURE__ */ new Map(), this.Sw = /* @__PURE__ */ new Map(), this.kw = new C(), this.yw = new C(), this.Cw = new C(), this.Tw = new he(i2);
      const s2 = void 0 === n2 ? B(Se()) : T(B(Se()), Oe(n2));
      this.U_ = i2, this.lw = new Hs(t2, s2, i2), this.lw.hm().l((t3) => {
        this.kw.M() && this.kw.m(this.Pw(t3()));
      }, this), this.lw.lm().l((t3) => {
        this.yw.M() && this.yw.m(this.Pw(t3()));
      }, this), this.lw.Zc().l((t3) => {
        this.Cw.M() && this.Cw.m(this.Pw(t3()));
      }, this);
      const e2 = this.lw.$t();
      this.Rw = new Re(e2, this.lw.cb(), this.U_);
    }
    remove() {
      this.lw.hm().p(this), this.lw.lm().p(this), this.lw.Zc().p(this), this.Rw.S(), this.lw.S(), this.xw.clear(), this.Sw.clear(), this.kw.S(), this.yw.S(), this.Cw.S(), this.Tw.S();
    }
    resize(t2, i2, n2) {
      this.autoSizeActive() || this.lw.ob(t2, i2, n2);
    }
    addCustomSeries(t2, i2) {
      const n2 = v(t2), s2 = Object.assign(Object.assign({}, h), n2.defaultOptions());
      return this.Dw("Custom", s2, i2, n2);
    }
    addAreaSeries(t2) {
      return this.Dw("Area", s, t2);
    }
    addBaselineSeries(t2) {
      return this.Dw("Baseline", e, t2);
    }
    addBarSeries(t2) {
      return this.Dw("Bar", i, t2);
    }
    addCandlestickSeries(i2 = {}) {
      return function(t2) {
        void 0 !== t2.borderColor && (t2.borderUpColor = t2.borderColor, t2.borderDownColor = t2.borderColor), void 0 !== t2.wickColor && (t2.wickUpColor = t2.wickColor, t2.wickDownColor = t2.wickColor);
      }(i2), this.Dw("Candlestick", t, i2);
    }
    addHistogramSeries(t2) {
      return this.Dw("Histogram", r, t2);
    }
    addLineSeries(t2) {
      return this.Dw("Line", n, t2);
    }
    removeSeries(t2) {
      const i2 = d(this.xw.get(t2)), n2 = this.Tw.fd(i2);
      this.lw.$t().fd(i2), this.Ow(n2), this.xw.delete(t2), this.Sw.delete(i2);
    }
    fw(t2, i2) {
      this.Ow(this.Tw.Xb(t2, i2));
    }
    mw(t2, i2) {
      this.Ow(this.Tw.tw(t2, i2));
    }
    subscribeClick(t2) {
      this.kw.l(t2);
    }
    unsubscribeClick(t2) {
      this.kw.v(t2);
    }
    subscribeCrosshairMove(t2) {
      this.Cw.l(t2);
    }
    unsubscribeCrosshairMove(t2) {
      this.Cw.v(t2);
    }
    subscribeDblClick(t2) {
      this.yw.l(t2);
    }
    unsubscribeDblClick(t2) {
      this.yw.v(t2);
    }
    priceScale(t2) {
      return new ke(this.lw, t2);
    }
    timeScale() {
      return this.Rw;
    }
    applyOptions(t2) {
      this.lw.Hh(Oe(t2));
    }
    options() {
      return this.lw.W();
    }
    takeScreenshot() {
      return this.lw.bb();
    }
    autoSizeActive() {
      return this.lw.Sb();
    }
    chartElement() {
      return this.lw.kb();
    }
    paneSize() {
      const t2 = this.lw.Cb();
      return { height: t2.height, width: t2.width };
    }
    setCrosshairPosition(t2, i2, n2) {
      const s2 = this.xw.get(n2);
      if (void 0 === s2) return;
      const e2 = this.lw.$t().cr(s2);
      null !== e2 && this.lw.$t().ld(t2, i2, e2);
    }
    clearCrosshairPosition() {
      this.lw.$t().ad(true);
    }
    Dw(t2, i2, n2 = {}, s2) {
      De(n2.priceFormat);
      const e2 = T(B(l), B(i2), n2), r2 = this.lw.$t().ud(t2, e2, s2), h2 = new Pe(r2, this, this, this, this.U_);
      return this.xw.set(h2, r2), this.Sw.set(r2, h2), h2;
    }
    Ow(t2) {
      const i2 = this.lw.$t();
      i2.od(t2.St.Iu, t2.St.rw, t2.St.hw), t2.sw.forEach((t3, i3) => i3.J(t3.He, t3.ew)), i2.Fu();
    }
    Bw(t2) {
      return d(this.Sw.get(t2));
    }
    Pw(t2) {
      const i2 = /* @__PURE__ */ new Map();
      t2.Lb.forEach((t3, n3) => {
        const s2 = n3.Jh(), e2 = ve(s2)(t3);
        if ("Custom" !== s2) c(Us(e2));
        else {
          const t4 = n3.Ca();
          c(!t4 || false === t4(e2));
        }
        i2.set(this.Bw(n3), e2);
      });
      const n2 = void 0 !== t2.Ib && this.Sw.has(t2.Ib) ? this.Bw(t2.Ib) : void 0;
      return { time: t2.zb, logical: t2.se, point: t2.Eb, hoveredSeries: n2, hoveredObjectId: t2.Nb, seriesData: i2, sourceEvent: t2.Fb };
    }
  }
  function Ve(t2, i2, n2) {
    let s2;
    if (D(t2)) {
      const i3 = document.getElementById(t2);
      c(null !== i3, `Cannot find element in DOM with id=${t2}`), s2 = i3;
    } else s2 = t2;
    const e2 = new Be(s2, i2, n2);
    return i2.setOptions(e2.options()), e2;
  }
  const Ae = Object.assign(Object.assign({}, l), h);
  var ze = Object.freeze({ __proto__: null, get ColorType() {
    return On;
  }, get CrosshairMode() {
    return et;
  }, get LastPriceAnimationMode() {
    return Rn;
  }, get LineStyle() {
    return o;
  }, get LineType() {
    return a;
  }, get MismatchDirection() {
    return Vi;
  }, get PriceLineSource() {
    return Dn;
  }, get PriceScaleMode() {
    return cn;
  }, get TickMarkType() {
    return Bn;
  }, get TrackingModeExitMode() {
    return Pn;
  }, createChart: function(t2, i2) {
    return Ve(t2, new Gn(), Gn.Ad(i2));
  }, createChartEx: Ve, customSeriesDefaultOptions: Ae, defaultHorzScaleBehavior: function() {
    return Gn;
  }, isBusinessDay: An, isUTCTimestamp: zn, version: function() {
    return "4.2.0";
  } });
  window.LightweightCharts = ze;
}();
