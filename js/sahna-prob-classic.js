/**
 * "prob-classic" sahna turi — Klassik ehtimollik va hodisalar (34, 35-darslar)
 * Qutidagi sharlar: m ta qulay natija, n ta jami natija. P(A) = m / n.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["prob-classic"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }
  var vm = cfg.vars.m || { min: 0, max: 10, step: 1, value: 3, desc: "qulay natijalar m" };
  var vn = cfg.vars.n || { min: 1, max: 10, step: 1, value: 8, desc: "jami natijalar n" };

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      'P(A) = m / n = ' +
      '<span class="term-a term-value" id="lbl-m">' + vm.value + '</span> / ' +
      '<span class="term-b term-value" id="lbl-n">' + vn.value + '</span>' +
      '&nbsp;=&nbsp;<strong id="lbl-prob" style="color:#c24b2a"></strong>' +
      '&nbsp;(<span id="lbl-hodisa-turi"></span>)' +
    '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "Qulay natijalar (m) va jami natijalar (n) sonini o'zgartirib, ehtimollikni kuzating.") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 200" role="img" aria-label="Ehtimollik sharlari qutisi" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-m"><span>m</span> <small class="control-desc">— ' + (vm.desc || "qulay natijalar") + '</small></label>' +
        '<input type="range" id="slide-m" min="' + vm.min + '" max="' + vm.max + '" step="' + vm.step + '" value="' + vm.value + '">' +
        '<output id="out-m">' + vm.value + '</output>' +
      '</div>' +
      '<div class="control">' +
        '<label for="slide-n"><span>n</span> <small class="control-desc">— ' + (vn.desc || "jami natijalar") + '</small></label>' +
        '<input type="range" id="slide-n" min="' + vn.min + '" max="' + vn.max + '" step="' + vn.step + '" value="' + vn.value + '">' +
        '<output id="out-n">' + vn.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideM = body.querySelector("#slide-m");
  var slideN = body.querySelector("#slide-n");
  var outM = body.querySelector("#out-m");
  var outN = body.querySelector("#out-n");
  var lblM = body.querySelector("#lbl-m");
  var lblN = body.querySelector("#lbl-n");
  var lblProb = body.querySelector("#lbl-prob");
  var lblHodisa = body.querySelector("#lbl-hodisa-turi");
  var note = body.querySelector("#sahna1-note");

  var dynamicGroup = document.createElementNS(BASE.svgNS, "g");
  graf.appendChild(dynamicGroup);

  function redraw() {
    var nVal = parseInt(slideN.value, 10);
    var mVal = parseInt(slideM.value, 10);
    if (mVal > nVal) {
      mVal = nVal;
      slideM.value = mVal;
    }
    slideM.max = nVal;

    outM.textContent = mVal;
    outN.textContent = nVal;
    lblM.textContent = mVal;
    lblN.textContent = nVal;

    var p = nVal > 0 ? (mVal / nVal) : 0;
    var pStr = (Math.round(p * 1000) / 1000).toString();
    lblProb.textContent = pStr;

    var turi = "";
    if (mVal === 0) {
      turi = "Imkonsiz hodisa (P = 0)";
      lblHodisa.style.color = "#888";
    } else if (mVal === nVal) {
      turi = "Muqarrar hodisa (P = 1)";
      lblHodisa.style.color = "#427b58";
    } else {
      turi = "Tasodifiy hodisa (0 < P < 1)";
      lblHodisa.style.color = "#2a628f";
    }
    lblHodisa.textContent = turi;

    while (dynamicGroup.firstChild) {
      dynamicGroup.removeChild(dynamicGroup.firstChild);
    }

    // Box outline
    var box = document.createElementNS(BASE.svgNS, "rect");
    box.setAttribute("x", 25); box.setAttribute("y", 25);
    box.setAttribute("width", 270); box.setAttribute("height", 110);
    box.setAttribute("fill", "#f8f5ee");
    box.setAttribute("stroke", "#4a554c");
    box.setAttribute("stroke-width", "2");
    box.setAttribute("rx", "8");
    dynamicGroup.appendChild(box);

    // Box label
    var bLabel = document.createElementNS(BASE.svgNS, "text");
    bLabel.setAttribute("x", 35); bLabel.setAttribute("y", 42);
    bLabel.setAttribute("fill", "#666"); bLabel.setAttribute("font-size", "11");
    bLabel.textContent = "Quti: jami n = " + nVal + " ta shar";
    dynamicGroup.appendChild(bLabel);

    // Balls inside box
    var radius = 16;
    for (var i = 0; i < nVal; i++) {
      var isFav = i < mVal;
      var cx = 50 + (i % 5) * 52;
      var cy = 68 + Math.floor(i / 5) * 44;

      var circle = document.createElementNS(BASE.svgNS, "circle");
      circle.setAttribute("cx", cx); circle.setAttribute("cy", cy);
      circle.setAttribute("r", radius);
      circle.setAttribute("fill", isFav ? "#c24b2a" : "#2a628f");
      circle.setAttribute("stroke", isFav ? "#9e3315" : "#1b4465");
      circle.setAttribute("stroke-width", "1.5");
      dynamicGroup.appendChild(circle);

      var num = document.createElementNS(BASE.svgNS, "text");
      num.setAttribute("x", cx); num.setAttribute("y", cy + 4);
      num.setAttribute("text-anchor", "middle");
      num.setAttribute("fill", "#fff");
      num.setAttribute("font-size", "11");
      num.setAttribute("font-weight", "bold");
      num.textContent = (i + 1);
      dynamicGroup.appendChild(num);
    }

    // Probability progress bar
    var barY = 165;
    var barW = 270;
    var pBarBg = document.createElementNS(BASE.svgNS, "rect");
    pBarBg.setAttribute("x", 25); pBarBg.setAttribute("y", barY);
    pBarBg.setAttribute("width", barW); pBarBg.setAttribute("height", 14);
    pBarBg.setAttribute("fill", "#e0dbcd"); pBarBg.setAttribute("rx", "7");
    dynamicGroup.appendChild(pBarBg);

    var pBarFill = document.createElementNS(BASE.svgNS, "rect");
    pBarFill.setAttribute("x", 25); pBarFill.setAttribute("y", barY);
    pBarFill.setAttribute("width", Math.max(0, barW * p));
    pBarFill.setAttribute("height", 14);
    pBarFill.setAttribute("fill", "#c24b2a"); pBarFill.setAttribute("rx", "7");
    dynamicGroup.appendChild(pBarFill);

    var pMin = document.createElementNS(BASE.svgNS, "text");
    pMin.setAttribute("x", 25); pMin.setAttribute("y", barY + 26);
    pMin.setAttribute("fill", "#666"); pMin.setAttribute("font-size", "10");
    pMin.textContent = "0 (Imkonsiz)";
    dynamicGroup.appendChild(pMin);

    var pMax = document.createElementNS(BASE.svgNS, "text");
    pMax.setAttribute("x", 295); pMax.setAttribute("y", barY + 26);
    pMax.setAttribute("text-anchor", "end");
    pMax.setAttribute("fill", "#666"); pMax.setAttribute("font-size", "10");
    pMax.textContent = "1 (Muqarrar)";
    dynamicGroup.appendChild(pMax);

    if (note) {
      note.textContent = "Qizil sharlar (qulay): " + mVal + " ta, ko'k sharlar: " + (nVal - mVal) + " ta. Ehtimollik: P = " + mVal + "/" + nVal + " = " + pStr + ".";
    }
  }

  slideM.addEventListener("input", redraw);
  slideN.addEventListener("input", redraw);
  redraw();
};
