/**
 * "stat-freq" sahna turi — Nisbiy chastota (36), Tasodifiy miqdor (37)
 * va sonli xarakteristikalar: o'rta qiymat, moda, mediana (38) interaktiv statistikasi.
 *
 * Slayder: N (tajribalar soni, 10 dan 200 gacha) yoki x qiymat.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["stat-freq"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }
  var vn = cfg.vars.n || { min: 10, max: 200, step: 10, value: 50, desc: "sinovlar soni N" };
  var mode = cfg.mode || "freq"; // "freq", "random_var", "metrics"

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      '<span id="lbl-stat-head">N = <span class="term-a term-value" id="lbl-n">' + vn.value + '</span></span>' +
      '&nbsp;|&nbsp;<span id="lbl-stat-metric"></span>' +
    '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "Sinovlar sonini o'zgartiring — nisbiy chastotalar taqsimoti barqarorlashadi.") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 220" role="img" aria-label="Statistik taqsimot gistogrammasi" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-n"><span>N</span> <small class="control-desc">— ' + (vn.desc || "sinovlar soni") + '</small></label>' +
        '<input type="range" id="slide-n" min="' + vn.min + '" max="' + vn.max + '" step="' + vn.step + '" value="' + vn.value + '">' +
        '<output id="out-n">' + vn.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideN = body.querySelector("#slide-n");
  var outN = body.querySelector("#out-n");
  var lblN = body.querySelector("#lbl-n");
  var lblMetric = body.querySelector("#lbl-stat-metric");
  var note = body.querySelector("#sahna1-note");

  var dynamicGroup = document.createElementNS(BASE.svgNS, "g");
  graf.appendChild(dynamicGroup);

  // Deterministic pseudo-frequencies for N
  // Values: 1, 2, 3, 4, 5, 6 (like dice outcomes)
  var weights = [1, 2, 3, 4, 3, 2]; // peak at 4
  var totalWeight = 15;

  function redraw() {
    var nVal = parseInt(slideN.value, 10);
    outN.textContent = nVal;
    lblN.textContent = nVal;

    while (dynamicGroup.firstChild) {
      dynamicGroup.removeChild(dynamicGroup.firstChild);
    }

    var counts = [];
    var sumVal = 0;
    var maxCount = 0;
    for (var i = 0; i < 6; i++) {
      var expected = (weights[i] / totalWeight) * nVal;
      // Slight variation based on N
      var jitter = Math.sin((i + 1) * nVal * 0.3) * (nVal * 0.04);
      var c = Math.max(1, Math.round(expected + jitter));
      counts.push(c);
      sumVal += c * (i + 1);
      if (c > maxCount) maxCount = c;
    }

    var actualTotal = counts.reduce(function(a, b){ return a + b; }, 0);
    var mean = Math.round((sumVal / actualTotal) * 100) / 100;
    var modeVal = 4; // highest weight
    var medianVal = 3.5;

    if (mode === "metrics") {
      lblMetric.innerHTML = 'O‘rta qiymat: <strong>' + mean + '</strong>, Moda: <strong>' + modeVal + '</strong>, Mediana: <strong>' + medianVal + '</strong>';
    } else {
      var w4 = Math.round((counts[3] / actualTotal) * 100) / 100;
      lblMetric.innerHTML = 'W(X=4) = ' + counts[3] + '/' + actualTotal + ' ≈ <strong style="color:#c24b2a">' + w4 + '</strong>';
    }

    // Baseline
    var baseLine = document.createElementNS(BASE.svgNS, "line");
    baseLine.setAttribute("x1", 25); baseLine.setAttribute("y1", 175);
    baseLine.setAttribute("x2", 300); baseLine.setAttribute("y2", 175);
    baseLine.setAttribute("stroke", "#4a554c"); baseLine.setAttribute("stroke-width", "1.2");
    dynamicGroup.appendChild(baseLine);

    var scaleY = 120 / (maxCount || 1);
    var barW = 34;

    for (var k = 0; k < 6; k++) {
      var val = counts[k];
      var bx = 35 + k * 44;
      var h = val * scaleY;
      var topY = 175 - h;

      var isMode = (k === 3);
      var rect = document.createElementNS(BASE.svgNS, "rect");
      rect.setAttribute("x", bx); rect.setAttribute("y", topY);
      rect.setAttribute("width", barW); rect.setAttribute("height", h);
      rect.setAttribute("fill", isMode ? "#c24b2a" : "#2a628f");
      rect.setAttribute("rx", "3");
      rect.setAttribute("opacity", "0.85");
      dynamicGroup.appendChild(rect);

      // Count label
      var cText = document.createElementNS(BASE.svgNS, "text");
      cText.setAttribute("x", bx + barW / 2);
      cText.setAttribute("y", topY - 5);
      cText.setAttribute("text-anchor", "middle");
      cText.setAttribute("fill", "#1a221c");
      cText.setAttribute("font-size", "10");
      cText.setAttribute("font-weight", "600");
      cText.textContent = val;
      dynamicGroup.appendChild(cText);

      // X category label
      var xText = document.createElementNS(BASE.svgNS, "text");
      xText.setAttribute("x", bx + barW / 2);
      xText.setAttribute("y", 195);
      xText.setAttribute("text-anchor", "middle");
      xText.setAttribute("fill", "#666");
      xText.setAttribute("font-size", "11");
      xText.textContent = "x=" + (k + 1);
      dynamicGroup.appendChild(xText);
    }

    if (note) {
      if (mode === "metrics") {
        note.textContent = "Eng ko'p uchragan qiymat (moda) = 4. O'rtacha qiymat x̄ = " + mean + ". Mediana = 3.5.";
      } else {
        note.textContent = "Sinovlar soni N = " + actualTotal + ". Tajribalar soni ortgani sari nisbiy chastotalar nazariy ehtimollikka intiladi.";
      }
    }
  }

  slideN.addEventListener("input", redraw);
  redraw();
};
