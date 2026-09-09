/**
 * "sign-line" sahna turi — son o'qida (x − r1)(x − r2) ishoralarini
 * jonli ko'rsatadi. Kvadrat tengsizlik yechishning asosiy vizuali.
 *
 * cfg.vars: r1, r2 (ildizlar). notes: intervals for >0 / <0.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["sign-line"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  var vr1 = cfg.vars.r1, vr2 = cfg.vars.r2;
  var sense = (cfg.sense || "gt").toLowerCase(); // gt / lt / ge / le

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      '(x − <span class="term-a term-value" id="lbl-r1">' + vr1.value + '</span>)' +
      '(x − <span class="term-b term-value" id="lbl-r2">' + vr2.value + '</span>) ' +
      '<span id="sense-sym">' + (sense === "lt" || sense === "le" ? "<" : ">") + ' 0</span>' +
    '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "Ildizlarni suring — ishora zanjiri o'zgaradi") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 360 140" role="img" aria-label="Son o\'qida ishora zanjiri" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-r1"><span>r₁</span> <small class="control-desc">— ' + (vr1.desc || "birinchi ildiz") + '</small></label>' +
        '<input type="range" id="slide-r1" min="' + vr1.min + '" max="' + vr1.max + '" step="' + vr1.step + '" value="' + vr1.value + '">' +
        '<output id="out-r1">' + vr1.value + '</output>' +
      '</div>' +
      '<div class="control">' +
        '<label for="slide-r2"><span>r₂</span> <small class="control-desc">— ' + (vr2.desc || "ikkinchi ildiz") + '</small></label>' +
        '<input type="range" id="slide-r2" min="' + vr2.min + '" max="' + vr2.max + '" step="' + vr2.step + '" value="' + vr2.value + '">' +
        '<output id="out-r2">' + vr2.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var svg = body.querySelector("#graf");
  var slideR1 = body.querySelector("#slide-r1");
  var slideR2 = body.querySelector("#slide-r2");
  var outR1 = body.querySelector("#out-r1");
  var outR2 = body.querySelector("#out-r2");
  var lblR1 = body.querySelector("#lbl-r1");
  var lblR2 = body.querySelector("#lbl-r2");
  var note = body.querySelector("#sahna1-note");
  var lastVals = {};

  var W = 360, H = 140;
  var PAD = 28;
  var Y = 70;
  var xMin = -6, xMax = 8;

  function toX(x) {
    return PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD);
  }

  function clearSvg() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  function addLine(x1, y1, x2, y2, stroke, sw) {
    var el = document.createElementNS(BASE.svgNS, "line");
    el.setAttribute("x1", x1); el.setAttribute("y1", y1);
    el.setAttribute("x2", x2); el.setAttribute("y2", y2);
    el.setAttribute("stroke", stroke || "#4a554c");
    el.setAttribute("stroke-width", sw || "1.5");
    svg.appendChild(el);
  }

  function addText(x, y, txt, fill, size, anchor) {
    var el = document.createElementNS(BASE.svgNS, "text");
    el.setAttribute("x", x); el.setAttribute("y", y);
    el.setAttribute("fill", fill || "#1a221c");
    el.setAttribute("font-size", size || "13");
    el.setAttribute("text-anchor", anchor || "middle");
    el.setAttribute("font-family", "system-ui, sans-serif");
    el.textContent = txt;
    svg.appendChild(el);
  }

  function addCircle(cx, cy, r, fill, stroke) {
    var el = document.createElementNS(BASE.svgNS, "circle");
    el.setAttribute("cx", cx); el.setAttribute("cy", cy);
    el.setAttribute("r", r);
    el.setAttribute("fill", fill || "#fff");
    el.setAttribute("stroke", stroke || "#c24b2a");
    el.setAttribute("stroke-width", "2");
    svg.appendChild(el);
  }

  function render() {
    var r1 = parseFloat(slideR1.value);
    var r2 = parseFloat(slideR2.value);
    // always show smaller left
    var left = Math.min(r1, r2);
    var right = Math.max(r1, r2);

    outR1.textContent = r1; outR2.textContent = r2;
    lblR1.textContent = r1; lblR2.textContent = r2;
    BASE.pulse(lblR1, lastVals, "r1", r1);
    BASE.pulse(lblR2, lastVals, "r2", r2);

    clearSvg();

    // axis
    addLine(PAD, Y, W - PAD, Y, "#4a554c", "1.8");
    // arrow
    addLine(W - PAD, Y, W - PAD - 8, Y - 5, "#4a554c", "1.8");
    addLine(W - PAD, Y, W - PAD - 8, Y + 5, "#4a554c", "1.8");
    addText(W - 10, Y + 18, "x", "#4a554c", "12");

    // ticks
    for (var t = Math.ceil(xMin); t <= Math.floor(xMax); t++) {
      if (t === 0) continue;
      var tx = toX(t);
      addLine(tx, Y - 5, tx, Y + 5, "#8a8578", "1");
      addText(tx, Y + 20, String(t), "#6b6660", "11");
    }
    // 0
    var zx = toX(0);
    addLine(zx, Y - 7, zx, Y + 7, "#4a554c", "1.5");
    addText(zx, Y + 20, "0", "#4a554c", "12");

    // roots
    var lx = toX(left), rx = toX(right);
    addCircle(lx, Y, 6, "#fff", "#c24b2a");
    addCircle(rx, Y, 6, "#fff", "#c24b2a");
    addText(lx, Y - 14, left === r1 ? "r₁" : "r₂", "#c24b2a", "12");
    addText(rx, Y - 14, right === r2 ? "r₂" : "r₁", "#c24b2a", "12");

    // signs of product (x-left)(x-right): + outside, − between
    var midX = (lx + rx) / 2;
    var leftMid = (PAD + lx) / 2;
    var rightMid = (rx + W - PAD) / 2;

    function signLabel(x, s, color) {
      addText(x, Y - 28, s, color, "18", "middle");
    }
    signLabel(leftMid, "+", "#2a7a4b");
    signLabel(midX, "−", "#c24b2a");
    signLabel(rightMid, "+", "#2a7a4b");

    // solution highlight (thick underline)
    var wantPos = (sense === "gt" || sense === "ge");
    var strokeSol = "#2a7a4b";
    if (wantPos) {
      // exterior
      addLine(PAD, Y + 12, lx - 4, Y + 12, strokeSol, "4");
      addLine(rx + 4, Y + 12, W - PAD, Y + 12, strokeSol, "4");
    } else {
      // interior
      if (rx - lx > 10) {
        addLine(lx + 4, Y + 12, rx - 4, Y + 12, strokeSol, "4");
      }
    }

    // note
    var activeKey = wantPos ? "positive" : "negative";
    BASE.applyNote(note, cfg.notes || {}, activeKey, {
      r1: left, r2: right,
      left: left, right: right
    });
  }

  render();
  [slideR1, slideR2].forEach(function (el) {
    el.addEventListener("input", render);
  });
  BASE.bindScrub(lblR1, slideR1, { ariaLabel: "birinchi ildiz" });
  BASE.bindScrub(lblR2, slideR2, { ariaLabel: "ikkinchi ildiz" });
};
