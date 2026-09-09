/**
 * "sign-chain" sahna turi — intervallar usuli: nollar o'qni bo'laklarga
 * ajratadi, ishora zanjiri plus/minus almashadi.
 *
 * Namuna (1-misol): (x + 3)(x − 1) < 0
 * Base: bindScrub, pulse, applyNote. createPlane kerak emas — bu son o'qi.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["sign-chain"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  var vx = cfg.vars.x;
  var roots = (cfg.roots || [-3, 1]).slice().sort(function (a, b) { return a - b; });
  var r0 = roots[0], r1 = roots[1];

  var body = document.createElement("div");
  body.className = "sahna1-grid";
  body.innerHTML =
    '<p class="sahna1-formula">' +
      '(x + 3)(x − 1) < 0' +
    "</p>" +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "") +
    "</p>" +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 160" role="img" aria-label="Son o\'qida ishora zanjiri" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna-sign-factors" id="factors"></p>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls sahna-x2-controls">' +
      '<div class="control">' +
        '<label for="slide-x"><span>x</span> <small class="control-desc">— ' + (vx.desc || "") + "</small></label>" +
        '<input type="range" id="slide-x" min="' + vx.min + '" max="' + vx.max + '" step="' + vx.step + '" value="' + vx.value + '">' +
        '<output id="out-x">' + vx.value + "</output>" +
      "</div>" +
    "</div>";

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slide = body.querySelector("#slide-x");
  var out = body.querySelector("#out-x");
  var note = body.querySelector("#sahna1-note");
  var factors = body.querySelector("#factors");
  var lastVals = {};

  var W = 320, H = 160, pad = 28;
  var xMin = -6, xMax = 4;
  function toX(x) {
    return pad + (x - xMin) * (W - 2 * pad) / (xMax - xMin);
  }
  var yLine = 92;

  function svg(name, attrs, text) {
    var el = document.createElementNS(BASE.svgNS, name);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (text !== undefined) el.textContent = text;
    graf.appendChild(el);
    return el;
  }

  svg("line", { x1: pad, y1: yLine, x2: W - pad, y2: yLine, stroke: "#4a554c", "stroke-width": "1.6" });
  svg("polygon", { points: (W - pad) + "," + yLine + " " + (W - pad - 8) + "," + (yLine - 4) + " " + (W - pad - 8) + "," + (yLine + 4), fill: "#4a554c" });
  svg("text", { x: W - 18, y: yLine - 10, fill: "#4a554c", "font-size": "11" }, "x");

  var bands = [
    { x1: xMin, x2: r0, sign: "+", want: false },
    { x1: r0, x2: r1, sign: "−", want: true },
    { x1: r1, x2: xMax, sign: "+", want: false }
  ];
  var bandRects = bands.map(function (b) {
    return svg("rect", {
      x: toX(b.x1), y: yLine - 18,
      width: Math.max(2, toX(b.x2) - toX(b.x1)),
      height: 36,
      rx: 8,
      fill: b.want ? "rgba(194,75,42,0.16)" : "rgba(43,107,79,0.10)",
      opacity: "0.85"
    });
  });
  bands.forEach(function (b) {
    svg("text", {
      x: (toX(b.x1) + toX(b.x2)) / 2,
      y: 38,
      fill: b.want ? "#c24b2a" : "#2b6b4f",
      "font-size": "22",
      "font-weight": "700",
      "text-anchor": "middle"
    }, b.sign);
  });

  function tick(x, label) {
    svg("line", { x1: toX(x), y1: yLine - 7, x2: toX(x), y2: yLine + 7, stroke: "#1a221c", "stroke-width": "1.4" });
    svg("text", { x: toX(x), y: yLine + 24, fill: "#1a221c", "font-size": "12", "text-anchor": "middle" }, label);
  }
  tick(r0, String(r0));
  tick(r1, String(r1));
  svg("circle", { cx: toX(r0), cy: yLine, r: "6", fill: "#fbf8f1", stroke: "#c24b2a", "stroke-width": "2" });
  svg("circle", { cx: toX(r1), cy: yLine, r: "6", fill: "#fbf8f1", stroke: "#c24b2a", "stroke-width": "2" });

  var probe = svg("circle", { cx: toX(vx.value), cy: yLine, r: "5.5", fill: "#b8872b", stroke: "#fbf8f1", "stroke-width": "1.4" });
  var probeLab = svg("text", {
    x: toX(vx.value), y: yLine - 28,
    fill: "#b8872b", "font-size": "11", "text-anchor": "middle"
  }, "x");

  function fmt(n) {
    return String(Math.round(n * 100) / 100);
  }
  function sgnWord(n) {
    if (n > 0) return "+";
    if (n < 0) return "−";
    return "0";
  }

  function zone(x) {
    if (x < r0) return "left";
    if (x === r0 || x === r1) return "root";
    if (x < r1) return "mid";
    return "right";
  }

  function render() {
    var x = parseFloat(slide.value);
    out.textContent = fmt(x);
    BASE.pulse(out, lastVals, "x", x);

    probe.setAttribute("cx", toX(x));
    probeLab.setAttribute("x", toX(x));
    probeLab.textContent = "x = " + fmt(x);

    var f1 = x + 3;
    var f2 = x - 1;
    var prod = f1 * f2;
    factors.innerHTML =
      "<span class=\"term-a\">(x + 3) = " + fmt(f1) + " → " + sgnWord(f1) + "</span>" +
      " &nbsp;·&nbsp; " +
      "<span class=\"term-b\">(x − 1) = " + fmt(f2) + " → " + sgnWord(f2) + "</span>" +
      " &nbsp;=&nbsp; " +
      "<span class=\"term-c\">" + fmt(prod) + " → " + sgnWord(prod) + "</span>";

    var z = zone(x);
    BASE.applyNote(note, cfg.notes, z, { x: fmt(x), prod: fmt(prod) });
  }

  render();
  slide.addEventListener("input", render);
};
