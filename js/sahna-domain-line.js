/**
 * "domain-line" sahna turi — funksiyaning aniqlanish sohasini
 * son o'qida teshilgan (taqiqlangan) nuqtalar va oraliqlar bilan ko'rsatadi.
 *
 * cfg.vars: a (masalan ildiz ostidagi siljish yoki maxrajdagi nuqta)
 * cfg.mode: "sqrt" | "recip" | "abs"  — qaysi turdagi cheklov
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["domain-line"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  var va = cfg.vars.a || { min: -4, max: 4, step: 0.5, value: 0, desc: "chegaraviy nuqta" };
  var mode = (cfg.mode || "sqrt").toLowerCase();

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  var formulaHtml = "";
  if (mode === "sqrt") {
    formulaHtml = 'y = √(x − <span class="term-a term-value" id="lbl-a">' + va.value + '</span>)';
  } else if (mode === "recip") {
    formulaHtml = 'y = 1 / (x − <span class="term-a term-value" id="lbl-a">' + va.value + '</span>)';
  } else {
    formulaHtml = 'y = |x − <span class="term-a term-value" id="lbl-a">' + va.value + '</span>|';
  }

  body.innerHTML =
    '<p class="sahna1-formula">' + formulaHtml + '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "Nuqtani suring — aniqlanish sohasi o'zgaradi") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 360 130" role="img" aria-label="Aniqlanish sohasi son o\'qida" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-a"><span>a</span> <small class="control-desc">— ' + (va.desc || "chegaraviy nuqta") + '</small></label>' +
        '<input type="range" id="slide-a" min="' + va.min + '" max="' + va.max + '" step="' + va.step + '" value="' + va.value + '">' +
        '<output id="out-a">' + va.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var svg = body.querySelector("#graf");
  var slideA = body.querySelector("#slide-a");
  var outA = body.querySelector("#out-a");
  var lblA = body.querySelector("#lbl-a");
  var note = body.querySelector("#sahna1-note");
  var lastVals = {};

  var W = 360, H = 130;
  var PAD = 28;
  var Y = 65;
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

  function addCircle(cx, cy, r, fill, stroke, sw) {
    var el = document.createElementNS(BASE.svgNS, "circle");
    el.setAttribute("cx", cx); el.setAttribute("cy", cy);
    el.setAttribute("r", r);
    el.setAttribute("fill", fill || "#fff");
    el.setAttribute("stroke", stroke || "#c24b2a");
    el.setAttribute("stroke-width", sw || "2");
    svg.appendChild(el);
  }

  function render() {
    var a = parseFloat(slideA.value);
    outA.textContent = a;
    lblA.textContent = a;
    BASE.pulse(lblA, lastVals, "a", a);

    clearSvg();

    // axis + arrow
    addLine(PAD, Y, W - PAD, Y, "#4a554c", "1.8");
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
    var zx = toX(0);
    addLine(zx, Y - 7, zx, Y + 7, "#4a554c", "1.5");
    addText(zx, Y + 20, "0", "#4a554c", "12");

    var ax = toX(a);
    var activeKey = mode;

    if (mode === "sqrt") {
      // domain: x ≥ a  → closed circle + ray to the right
      addCircle(ax, Y, 6, "#2a7a4b", "#2a7a4b", "2");
      addLine(ax + 6, Y, W - PAD, Y, "#2a7a4b", "4");
      addText(ax, Y - 16, "a", "#2a7a4b", "13");
      addText((ax + W - PAD) / 2, Y - 18, "aniqlangan", "#2a7a4b", "12");
      // left forbidden
      addLine(PAD, Y + 10, ax - 8, Y + 10, "#c24b2a", "2");
      addText((PAD + ax) / 2, Y + 28, "taqiqlangan", "#c24b2a", "11");
    } else if (mode === "recip") {
      // domain: x ≠ a  → hole + both sides
      addCircle(ax, Y, 7, "#fff", "#c24b2a", "2.5");
      addLine(PAD, Y, ax - 9, Y, "#2a7a4b", "4");
      addLine(ax + 9, Y, W - PAD, Y, "#2a7a4b", "4");
      addText(ax, Y - 16, "a", "#c24b2a", "13");
      addText((PAD + ax) / 2, Y - 18, "aniqlangan", "#2a7a4b", "11");
      addText((ax + W - PAD) / 2, Y - 18, "aniqlangan", "#2a7a4b", "11");
    } else {
      // abs: all real
      addLine(PAD, Y, W - PAD, Y, "#2a7a4b", "4");
      addText(W / 2, Y - 18, "barcha haqiqiy sonlar", "#2a7a4b", "13");
    }

    BASE.applyNote(note, cfg.notes || {}, activeKey, { a: a });
  }

  render();
  slideA.addEventListener("input", render);
  BASE.bindScrub(lblA, slideA, { ariaLabel: "chegaraviy nuqta a" });
};
