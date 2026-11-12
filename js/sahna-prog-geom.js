/**
 * "prog-geom" sahna turi — Geometrik progressiya (31), yig'indisi (32)
 * va cheksiz kamayuvchi geometrik progressiya (33) uchun interaktiv vizualizator.
 *
 * Slayderlar: b (b₁ had), q (maxraj).
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["prog-geom"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }
  var vb = cfg.vars.b || { min: 1, max: 4, step: 1, value: 2, desc: "birinchi had b₁" };
  var vq = cfg.vars.q || { min: 0.2, max: 2, step: 0.1, value: 0.5, desc: "maxraj q" };
  var mode = cfg.mode || "standard"; // "standard", "sum", "infinite"

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      'b₁ = <span class="term-a term-value" id="lbl-b">' + vb.value + '</span>, ' +
      'q = <span class="term-b term-value" id="lbl-q">' + vq.value + '</span>' +
      '<span id="lbl-geom-info"></span>' +
    '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "Slayderlarni suring — har bir keyingi had q ga ko'payadi.") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 220" role="img" aria-label="Geometrik progressiya grafigi" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-b"><span>b₁</span> <small class="control-desc">— ' + (vb.desc || "birinchi had") + '</small></label>' +
        '<input type="range" id="slide-b" min="' + vb.min + '" max="' + vb.max + '" step="' + vb.step + '" value="' + vb.value + '">' +
        '<output id="out-b">' + vb.value + '</output>' +
      '</div>' +
      '<div class="control">' +
        '<label for="slide-q"><span>q</span> <small class="control-desc">— ' + (vq.desc || "maxraj") + '</small></label>' +
        '<input type="range" id="slide-q" min="' + vq.min + '" max="' + vq.max + '" step="' + vq.step + '" value="' + vq.value + '">' +
        '<output id="out-q">' + vq.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideB = body.querySelector("#slide-b");
  var slideQ = body.querySelector("#slide-q");
  var outB = body.querySelector("#out-b");
  var outQ = body.querySelector("#out-q");
  var lblB = body.querySelector("#lbl-b");
  var lblQ = body.querySelector("#lbl-q");
  var lblInfo = body.querySelector("#lbl-geom-info");
  var note = body.querySelector("#sahna1-note");

  var N = 5;
  var dynamicGroup = document.createElementNS(BASE.svgNS, "g");
  graf.appendChild(dynamicGroup);

  function redraw() {
    var bVal = parseFloat(slideB.value);
    var qVal = parseFloat(slideQ.value);
    outB.textContent = bVal;
    outQ.textContent = qVal;
    lblB.textContent = bVal;
    lblQ.textContent = qVal;

    while (dynamicGroup.firstChild) {
      dynamicGroup.removeChild(dynamicGroup.firstChild);
    }

    var terms = [];
    var sum = 0;
    var cur = bVal;
    for (var i = 0; i < N; i++) {
      var rounded = Math.round(cur * 100) / 100;
      terms.push(rounded);
      sum += cur;
      cur = cur * qVal;
    }
    var sumRounded = Math.round(sum * 100) / 100;

    if (mode === "infinite") {
      if (Math.abs(qVal) < 1) {
        var S_inf = Math.round((bVal / (1 - qVal)) * 100) / 100;
        lblInfo.innerHTML = '&nbsp;|&nbsp; <strong>S = b₁/(1−q)</strong> = <span style="color:#2a628f">' + S_inf + '</span>';
      } else {
        lblInfo.innerHTML = '&nbsp;|&nbsp; <span style="color:#c24b2a">|q| ≥ 1 (cheksiz yig\'indi mavjud emas)</span>';
      }
    } else if (mode === "sum") {
      lblInfo.innerHTML = '&nbsp;|&nbsp; <strong>S₅</strong> = <span style="color:#c24b2a">' + sumRounded + '</span>';
    } else {
      lblInfo.innerHTML = '&nbsp;→&nbsp; b₅ = <span style="color:#c24b2a">' + terms[4] + '</span>';
    }

    var maxVal = Math.max.apply(null, terms);
    if (maxVal <= 0) maxVal = 1;
    var scaleY = 130 / maxVal;

    // Baseline
    var baseLine = document.createElementNS(BASE.svgNS, "line");
    baseLine.setAttribute("x1", 20); baseLine.setAttribute("y1", 175);
    baseLine.setAttribute("x2", 300); baseLine.setAttribute("y2", 175);
    baseLine.setAttribute("stroke", "#4a554c"); baseLine.setAttribute("stroke-width", "1.2");
    dynamicGroup.appendChild(baseLine);

    var barWidth = 36;
    for (var k = 0; k < N; k++) {
      var tv = terms[k];
      var bx = 35 + k * 52;
      var h = Math.max(3, tv * scaleY);
      var topY = 175 - h;

      var rect = document.createElementNS(BASE.svgNS, "rect");
      rect.setAttribute("x", bx); rect.setAttribute("y", topY);
      rect.setAttribute("width", barWidth); rect.setAttribute("height", h);
      rect.setAttribute("fill", k === 0 ? "#2a628f" : "#c24b2a");
      rect.setAttribute("rx", "3");
      rect.setAttribute("opacity", "0.85");
      dynamicGroup.appendChild(rect);

      var vText = document.createElementNS(BASE.svgNS, "text");
      vText.setAttribute("x", bx + barWidth / 2);
      vText.setAttribute("y", topY - 5);
      vText.setAttribute("text-anchor", "middle");
      vText.setAttribute("fill", "#1a221c");
      vText.setAttribute("font-size", "10");
      vText.setAttribute("font-weight", "600");
      vText.textContent = tv;
      dynamicGroup.appendChild(vText);

      var lText = document.createElementNS(BASE.svgNS, "text");
      lText.setAttribute("x", bx + barWidth / 2);
      lText.setAttribute("y", 195);
      lText.setAttribute("text-anchor", "middle");
      lText.setAttribute("fill", "#666");
      lText.setAttribute("font-size", "10");
      lText.textContent = "b" + (k + 1);
      dynamicGroup.appendChild(lText);
    }

    if (note) {
      if (mode === "infinite" && Math.abs(qVal) < 1) {
        note.textContent = "|q| = " + qVal + " < 1 bo'lgani sababli, hadlar 0 ga intiladi va cheksiz yig'indi S = " + (Math.round((bVal / (1 - qVal)) * 100) / 100) + " ga yaqinlashadi.";
      } else {
        note.textContent = "Ketma-ket hadlar: " + terms.join(", ") + "... Har bir qadamda q = " + qVal + " ga ko'paytiriladi.";
      }
    }
  }

  slideB.addEventListener("input", redraw);
  slideQ.addEventListener("input", redraw);
  redraw();
};
