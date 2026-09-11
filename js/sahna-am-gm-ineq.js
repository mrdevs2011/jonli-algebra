/**
 * "am-gm-ineq" sahna turi — a + 1/a − 2 ifodasining ishorasini (a > 0)
 * ko'rsatadi. AM-GM tengsizligi: a + 1/a ≥ 2, tenglik faqat a = 1 da.
 *
 * sign-line'dan farqi: bu yerda IKKITA ildiz emas, BITTA parametr (a) va
 * butunlay boshqa formula (a + 1/a − 2) bor — grafik chizig' emas, balki
 * ifoda qiymati va uning ishorasi (musbat/nol) jonli ko'rsatiladi.
 *
 * data.json kutilgan shakl:
 *   "sahna": {
 *     "type": "am-gm-ineq",
 *     "ariaLabel": "...", "hint": "...",
 *     "vars": { "a": { "min":0.2,"max":5,"step":0.1,"value":1,"desc":"..." } },
 *     "notes": { "positive": "...", "zero": "...", "locked": "..." }
 *   }
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["am-gm-ineq"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }
  var va = cfg.vars.a;

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      '<span class="term-a term-value" id="lbl-a" data-var="a">' + va.value + '</span>' +
      '&nbsp;+&nbsp;1/<span id="lbl-a2">' + va.value + '</span>' +
      '&nbsp;−&nbsp;2&nbsp;=&nbsp;<span id="lbl-result"></span>' +
    '</p>' +
    '<p class="sahna1-hint">' + (cfg.hint || "") + '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 180" role="img" aria-label="a + 1/a - 2 ifodasi ishorasi" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-a"><span>a</span> <small class="control-desc">— ' + (va.desc || "") + '</small></label>' +
        '<input type="range" id="slide-a" min="' + va.min + '" max="' + va.max + '" step="' + va.step + '" value="' + va.value + '">' +
        '<output id="out-a">' + va.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideA = body.querySelector("#slide-a");
  var outA = body.querySelector("#out-a");
  var lblA = body.querySelector("#lbl-a");
  var lblA2 = body.querySelector("#lbl-a2");
  var lblResult = body.querySelector("#lbl-result");
  var note = body.querySelector("#sahna1-note");
  var lastVals = {};

  // Gorizontal son o'qi: 0 dan katta natijalarni ko'rsatish uchun oddiy chiziq shkala
  var AXIS_Y = 90;
  var AXIS_X0 = 30;
  var AXIS_X1 = 290;
  var SCALE = 50; // 1 birlik = 50px

  var axisLine = document.createElementNS(BASE.svgNS, "line");
  axisLine.setAttribute("x1", AXIS_X0);
  axisLine.setAttribute("x2", AXIS_X1);
  axisLine.setAttribute("y1", AXIS_Y);
  axisLine.setAttribute("y2", AXIS_Y);
  axisLine.setAttribute("stroke", "#4a554c");
  axisLine.setAttribute("stroke-width", "1.5");
  graf.appendChild(axisLine);

  // Nol belgisi (natija >= 0 chegarasi)
  var zeroTick = document.createElementNS(BASE.svgNS, "line");
  zeroTick.setAttribute("x1", AXIS_X0);
  zeroTick.setAttribute("x2", AXIS_X0);
  zeroTick.setAttribute("y1", AXIS_Y - 8);
  zeroTick.setAttribute("y2", AXIS_Y + 8);
  zeroTick.setAttribute("stroke", "#4a554c");
  zeroTick.setAttribute("stroke-width", "1.5");
  graf.appendChild(zeroTick);

  var zeroLabel = document.createElementNS(BASE.svgNS, "text");
  zeroLabel.setAttribute("x", AXIS_X0);
  zeroLabel.setAttribute("y", AXIS_Y + 24);
  zeroLabel.setAttribute("text-anchor", "middle");
  zeroLabel.setAttribute("font-size", "12");
  zeroLabel.setAttribute("fill", "#4a554c");
  zeroLabel.textContent = "0";
  graf.appendChild(zeroLabel);

  var resultBar = document.createElementNS(BASE.svgNS, "line");
  resultBar.setAttribute("stroke", "#c24b2a");
  resultBar.setAttribute("stroke-width", "6");
  resultBar.setAttribute("stroke-linecap", "round");
  graf.appendChild(resultBar);

  var resultPoint = document.createElementNS(BASE.svgNS, "circle");
  resultPoint.setAttribute("r", "5");
  resultPoint.setAttribute("fill", "#c24b2a");
  graf.appendChild(resultPoint);

  function render() {
    var aVal = parseFloat(slideA.value);
    var raw = aVal + 1 / aVal - 2;
    // suzuvchi nuqta xatoligini yashirish uchun juda kichik qiymatlarni nolga tenglashtiramiz
    var result = Math.abs(raw) < 1e-9 ? 0 : raw;
    var resultRounded = Math.round(result * 100) / 100;

    outA.textContent = aVal;
    lblA.textContent = aVal;
    lblA2.textContent = aVal;
    lblResult.textContent = resultRounded;

    BASE.pulse(lblA, lastVals, "a", aVal);

    var px = AXIS_X0 + resultRounded * SCALE;
    resultBar.setAttribute("x1", AXIS_X0);
    resultBar.setAttribute("y1", AXIS_Y);
    resultBar.setAttribute("x2", px);
    resultBar.setAttribute("y2", AXIS_Y);
    resultPoint.setAttribute("cx", px);
    resultPoint.setAttribute("cy", AXIS_Y);

    var state = resultRounded === 0 ? "zero" : "positive";
    BASE.applyNote(note, cfg.notes, state, { a: aVal, result: resultRounded });
  }

  render();

  slideA.addEventListener("input", render);

  // ---- umumiy motordan scrub bog'lash — boshqa sahnalar bilan BIR XIL chaqiruv ----
  BASE.bindScrub(lblA, slideA, { ariaLabel: "a qiymati" });
};
