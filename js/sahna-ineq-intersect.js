/**
 * "ineq-intersect" sahna turi — ikki tengsizlik yechimining
 * umumiy qismi (kesishmasi) son o'qida jonli ko'rinadi.
 *
 * 15-dars: kvadrat tengsizlik (x²−5x+6 > 0, ildizlar 2 va 3 qulflangan)
 * va chiziqli chegara x ≥ c. Yangi g'oya — kesishma.
 *
 * cfg.vars.c — chiziqli chegara (default −1, 1-masaladagi kabi)
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["ineq-intersect"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }

  var vc = cfg.vars.c;
  var R1 = 2;
  var R2 = 3;

  var body = document.createElement("div");
  body.className = "sahna1-grid";
  body.innerHTML =
    '<p class="sahna1-formula">' +
      '{ &nbsp;x² − 5x + 6 > 0<br>' +
      '&nbsp;&nbsp;x ≥ <span class="term-a term-value" id="lbl-c">' + vc.value + '</span> }' +
    '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "c ni suring — ikki yechimning kesishmasi o'zgaradi") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 360 200" role="img" aria-label="Ikki tengsizlik yechimi va ularning kesishmasi" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-c"><span>c</span> <small class="control-desc">— ' + (vc.desc || "chiziqli chegara") + '</small></label>' +
        '<input type="range" id="slide-c" min="' + vc.min + '" max="' + vc.max + '" step="' + vc.step + '" value="' + vc.value + '">' +
        '<output id="out-c">' + vc.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var svg = body.querySelector("#graf");
  var slideC = body.querySelector("#slide-c");
  var outC = body.querySelector("#out-c");
  var lblC = body.querySelector("#lbl-c");
  var note = body.querySelector("#sahna1-note");
  var lastVals = {};

  var W = 360, H = 200;
  var PAD = 28;
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

  function axisAt(y, label) {
    addLine(PAD, y, W - PAD, y, "#4a554c", "1.6");
    addLine(W - PAD, y, W - PAD - 8, y - 5, "#4a554c", "1.6");
    addLine(W - PAD, y, W - PAD - 8, y + 5, "#4a554c", "1.6");
    addText(W - 10, y + 16, "x", "#4a554c", "11");
    addText(PAD - 2, y - 14, label, "#6b6660", "11", "start");
    for (var t = Math.ceil(xMin); t <= Math.floor(xMax); t++) {
      var tx = toX(t);
      var isZero = t === 0;
      addLine(tx, y - (isZero ? 6 : 4), tx, y + (isZero ? 6 : 4), isZero ? "#4a554c" : "#8a8578", isZero ? "1.4" : "1");
      if (t === -4 || t === -2 || t === 0 || t === 2 || t === 3 || t === 5) {
        addText(tx, y + 16, String(t), "#6b6660", "10");
      }
    }
  }

  function fmtNum(v) {
    if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
    return String(Math.round(v * 10) / 10);
  }

  function render() {
    var c = parseFloat(slideC.value);
    outC.textContent = fmtNum(c);
    lblC.textContent = fmtNum(c);
    BASE.pulse(lblC, lastVals, "c", c);

    clearSvg();

    var y1 = 42;
    var y2 = 100;
    var y3 = 158;

    axisAt(y1, "1) x²−5x+6 > 0");
    axisAt(y2, "2) x ≥ c");
    axisAt(y3, "kesishma");

    var x2 = toX(R1);
    var x3 = toX(R2);
    var xc = toX(c);

    // quadratic: open ends (−∞;2) ∪ (3;+∞)
    addLine(PAD, y1 + 10, x2 - 3, y1 + 10, "#2a7a4b", "4");
    addLine(x3 + 3, y1 + 10, W - PAD, y1 + 10, "#2a7a4b", "4");
    addCircle(x2, y1, 5, "#fff", "#c24b2a");
    addCircle(x3, y1, 5, "#fff", "#c24b2a");

    // linear x ≥ c : closed at c
    addLine(xc, y2 + 10, W - PAD, y2 + 10, "#3b6ea5", "4");
    addCircle(xc, y2, 5, "#3b6ea5", "#3b6ea5");

    // intersection
    var hasLeft = c < R1;
    var hasRight = true; // (3; +∞) always meets [c; +∞) because 3 is finite
    if (hasLeft) {
      var leftStart = Math.max(c, xMin);
      addLine(toX(leftStart), y3 + 10, x2 - 3, y3 + 10, "#8a5a12", "5");
      if (c > xMin + 0.05) addCircle(xc, y3, 5, "#8a5a12", "#8a5a12");
    }
    addLine(x3 + 3, y3 + 10, W - PAD, y3 + 10, "#8a5a12", "5");

    var leftTxt;
    if (c < R1) {
      leftTxt = "[" + fmtNum(c) + "; 2)";
    } else if (c === R1) {
      leftTxt = "∅";
    } else {
      leftTxt = "∅";
    }
    var interTxt = (c < R1)
      ? (leftTxt + " ∪ (3; +∞)")
      : "(3; +∞)";

    BASE.applyNote(note, cfg.notes || {}, "inter", {
      c: fmtNum(c),
      inter: interTxt
    });
    if (!cfg.notes || !cfg.notes.inter) {
      note.textContent = "Kesishma: " + interTxt;
    }
  }

  render();
  slideC.addEventListener("input", render);
  BASE.bindScrub(lblC, slideC, { ariaLabel: "chiziqli chegara" });
};
