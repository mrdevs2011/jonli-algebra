/**
 * "prog-arith" sahna turi — Arifmetik progressiya (29-dars) va uning
 * yig'indisi (30-dars) uchun interaktiv pog'onali grafik.
 *
 * Slayderlar: a1 (boshlang'ich had), d (ayirma) yoki n (hadlar soni).
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["prog-arith"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }
  var va = cfg.vars.a || { min: 1, max: 6, step: 1, value: 2, desc: "birinchi had a₁" };
  var vd = cfg.vars.d || { min: -3, max: 5, step: 1, value: 3, desc: "ayirma d" };
  var isSum = !!cfg.showSum;

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      'a₁ = <span class="term-a term-value" id="lbl-a">' + va.value + '</span>, ' +
      'd = <span class="term-b term-value" id="lbl-d">' + vd.value + '</span>' +
      '<span id="lbl-extra"></span>' +
    '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "Slayderlarni suring — har bir qadamda d qo'shilib, hadlar bir xil pog'ona bilan o'sadi.") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 220" role="img" aria-label="Arifmetik progressiya pog\'onalari" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-a"><span>a₁</span> <small class="control-desc">— ' + (va.desc || "birinchi had") + '</small></label>' +
        '<input type="range" id="slide-a" min="' + va.min + '" max="' + va.max + '" step="' + va.step + '" value="' + va.value + '">' +
        '<output id="out-a">' + va.value + '</output>' +
      '</div>' +
      '<div class="control">' +
        '<label for="slide-d"><span>d</span> <small class="control-desc">— ' + (vd.desc || "ayirma") + '</small></label>' +
        '<input type="range" id="slide-d" min="' + vd.min + '" max="' + vd.max + '" step="' + vd.step + '" value="' + vd.value + '">' +
        '<output id="out-d">' + vd.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideA = body.querySelector("#slide-a");
  var slideD = body.querySelector("#slide-d");
  var outA = body.querySelector("#out-a");
  var outD = body.querySelector("#out-d");
  var lblA = body.querySelector("#lbl-a");
  var lblD = body.querySelector("#lbl-d");
  var lblExtra = body.querySelector("#lbl-extra");
  var note = body.querySelector("#sahna1-note");

  var W = 320, H = 220;
  var OX = 35, OY = 175;
  var N = 5;

  var dynamicGroup = document.createElementNS(BASE.svgNS, "g");
  graf.appendChild(dynamicGroup);

  function redraw() {
    var aVal = parseFloat(slideA.value);
    var dVal = parseFloat(slideD.value);
    outA.textContent = aVal;
    outD.textContent = dVal;
    lblA.textContent = aVal;
    lblD.textContent = dVal;

    while (dynamicGroup.firstChild) {
      dynamicGroup.removeChild(dynamicGroup.firstChild);
    }

    var terms = [];
    var sum = 0;
    for (var i = 1; i <= N; i++) {
      var val = aVal + (i - 1) * dVal;
      terms.push(val);
      sum += val;
    }

    if (isSum) {
      lblExtra.innerHTML = '&nbsp;|&nbsp; <strong>S₅</strong> = <span style="color:#c24b2a">' + sum + '</span> (formula: (a₁+a₅)·5/2 = (' + aVal + '+' + terms[4] + ')·2.5 = ' + sum + ')';
    } else {
      lblExtra.innerHTML = '&nbsp;→&nbsp; a₅ = <span style="color:#c24b2a">' + terms[4] + '</span>';
    }

    // Min-max scaling
    var minVal = Math.min(0, Math.min.apply(null, terms));
    var maxVal = Math.max(10, Math.max.apply(null, terms));
    var span = maxVal - minVal || 1;
    var scaleY = 130 / span;

    function getBarY(v) {
      return OY - (v - minVal) * scaleY;
    }

    // Baseline
    var baseLine = document.createElementNS(BASE.svgNS, "line");
    baseLine.setAttribute("x1", 20); baseLine.setAttribute("y1", getBarY(0));
    baseLine.setAttribute("x2", 300); baseLine.setAttribute("y2", getBarY(0));
    baseLine.setAttribute("stroke", "#4a554c"); baseLine.setAttribute("stroke-width", "1.2");
    dynamicGroup.appendChild(baseLine);

    var barWidth = 36;
    for (var k = 0; k < N; k++) {
      var tv = terms[k];
      var bx = OX + k * 52;
      var y0 = getBarY(0);
      var y1 = getBarY(tv);

      var topY = Math.min(y0, y1);
      var bHeight = Math.abs(y0 - y1) || 2;

      var rect = document.createElementNS(BASE.svgNS, "rect");
      rect.setAttribute("x", bx); rect.setAttribute("y", topY);
      rect.setAttribute("width", barWidth); rect.setAttribute("height", bHeight);
      rect.setAttribute("fill", k === 0 ? "#2a628f" : (k === N - 1 ? "#c24b2a" : "#427b58"));
      rect.setAttribute("rx", "3");
      rect.setAttribute("opacity", "0.85");
      dynamicGroup.appendChild(rect);

      // Value text
      var vText = document.createElementNS(BASE.svgNS, "text");
      vText.setAttribute("x", bx + barWidth / 2);
      vText.setAttribute("y", tv >= 0 ? topY - 5 : topY + bHeight + 12);
      vText.setAttribute("text-anchor", "middle");
      vText.setAttribute("fill", "#1a221c");
      vText.setAttribute("font-size", "11");
      vText.setAttribute("font-weight", "600");
      vText.textContent = tv;
      dynamicGroup.appendChild(vText);

      // Label below bar
      var lText = document.createElementNS(BASE.svgNS, "text");
      lText.setAttribute("x", bx + barWidth / 2);
      lText.setAttribute("y", 205);
      lText.setAttribute("text-anchor", "middle");
      lText.setAttribute("fill", "#666");
      lText.setAttribute("font-size", "10");
      lText.textContent = "a" + (k + 1);
      dynamicGroup.appendChild(lText);
    }

    if (note) {
      if (isSum) {
        note.textContent = "Dastlabki 5 ta had yig'indisi: " + terms.join(" + ") + " = " + sum + ".";
      } else {
        note.textContent = "Ketma-ket hadlar: " + terms.join(", ") + "... Har bir qadamda d = " + dVal + " qo'shiladi.";
      }
    }
  }

  slideA.addEventListener("input", redraw);
  slideD.addEventListener("input", redraw);
  redraw();
};
