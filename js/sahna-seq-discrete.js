/**
 * "seq-discrete" sahna turi — Sonli ketma-ketliklarni diskret nuqtalar
 * (n, a_n) ko'rinishida koordinata tekisligida ko'rsatadi.
 *
 * cfg.vars: n (hadlar soni, min: 1, max: 8, step: 1, value: 5)
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["seq-discrete"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }
  var vn = cfg.vars.n || { min: 1, max: 8, step: 1, value: 5, desc: "hadlar soni n" };

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      'a<sub>n</sub> = 2n − 1 &nbsp;|&nbsp; n = <span class="term-a term-value" id="lbl-n">' + vn.value + '</span>' +
      '&nbsp;→&nbsp; a<sub>' + vn.value + '</sub> = <span id="lbl-an">' + (2 * vn.value - 1) + '</span>' +
    '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "Slayderni suring — ketma-ketlikning hadlari diskret nuqtalar sifatida hosil bo'ladi.") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 220" role="img" aria-label="Sonli ketma-ketlik grafigi" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-n"><span>n</span> <small class="control-desc">— ' + (vn.desc || "hadlar soni") + '</small></label>' +
        '<input type="range" id="slide-n" min="' + vn.min + '" max="' + vn.max + '" step="' + vn.step + '" value="' + vn.value + '">' +
        '<output id="out-n">' + vn.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideN = body.querySelector("#slide-n");
  var outN = body.querySelector("#out-n");
  var lblN = body.querySelector("#lbl-n");
  var lblAn = body.querySelector("#lbl-an");
  var note = body.querySelector("#sahna1-note");

  var W = 320, H = 220;
  var OX = 40, OY = 190;
  var SCALE_X = 32;
  var SCALE_Y = 10;

  function toX(n) { return OX + n * SCALE_X; }
  function toY(a) { return OY - a * SCALE_Y; }

  // Koordinata o'qlari
  var axX = document.createElementNS(BASE.svgNS, "line");
  axX.setAttribute("x1", 20); axX.setAttribute("y1", OY);
  axX.setAttribute("x2", 305); axX.setAttribute("y2", OY);
  axX.setAttribute("stroke", "#4a554c"); axX.setAttribute("stroke-width", "1.2");
  graf.appendChild(axX);

  var axY = document.createElementNS(BASE.svgNS, "line");
  axY.setAttribute("x1", OX); axY.setAttribute("y1", 210);
  axY.setAttribute("x2", OX); axY.setAttribute("y2", 15);
  axY.setAttribute("stroke", "#4a554c"); axY.setAttribute("stroke-width", "1.2");
  graf.appendChild(axY);

  var labX = document.createElementNS(BASE.svgNS, "text");
  labX.setAttribute("x", 298); labX.setAttribute("y", OY - 6);
  labX.setAttribute("fill", "#4a554c"); labX.setAttribute("font-size", "11");
  labX.textContent = "n";
  graf.appendChild(labX);

  var labY = document.createElementNS(BASE.svgNS, "text");
  labY.setAttribute("x", OX + 6); labY.setAttribute("y", 22);
  labY.setAttribute("fill", "#4a554c"); labY.setAttribute("font-size", "11");
  labY.textContent = "a_n";
  graf.appendChild(labY);

  // Dynamic group for points and bars
  var dynamicGroup = document.createElementNS(BASE.svgNS, "g");
  graf.appendChild(dynamicGroup);

  function redraw() {
    var nVal = parseInt(slideN.value, 10);
    outN.textContent = nVal;
    lblN.textContent = nVal;
    var anVal = 2 * nVal - 1;
    lblAn.textContent = anVal;

    while (dynamicGroup.firstChild) {
      dynamicGroup.removeChild(dynamicGroup.firstChild);
    }

    var terms = [];
    for (var i = 1; i <= nVal; i++) {
      var val = 2 * i - 1;
      terms.push(val);
      var px = toX(i);
      var py = toY(val);

      // Vertikal uzik chiziq
      var stem = document.createElementNS(BASE.svgNS, "line");
      stem.setAttribute("x1", px); stem.setAttribute("y1", OY);
      stem.setAttribute("x2", px); stem.setAttribute("y2", py);
      stem.setAttribute("stroke", "#c24b2a"); stem.setAttribute("stroke-width", "1");
      stem.setAttribute("stroke-dasharray", "2,2");
      dynamicGroup.appendChild(stem);

      // Nuqta
      var pt = document.createElementNS(BASE.svgNS, "circle");
      pt.setAttribute("cx", px); pt.setAttribute("cy", py);
      pt.setAttribute("r", i === nVal ? "5.5" : "4");
      pt.setAttribute("fill", i === nVal ? "#c24b2a" : "#2a628f");
      dynamicGroup.appendChild(pt);

      // Yozuv
      var t = document.createElementNS(BASE.svgNS, "text");
      t.setAttribute("x", px); t.setAttribute("y", py - 7);
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("fill", i === nVal ? "#c24b2a" : "#1a221c");
      t.setAttribute("font-size", "10");
      t.setAttribute("font-weight", i === nVal ? "700" : "400");
      t.textContent = val;
      dynamicGroup.appendChild(t);

      // n tick
      var nTick = document.createElementNS(BASE.svgNS, "text");
      nTick.setAttribute("x", px); nTick.setAttribute("y", OY + 14);
      nTick.setAttribute("text-anchor", "middle");
      nTick.setAttribute("fill", "#666");
      nTick.setAttribute("font-size", "10");
      nTick.textContent = i;
      dynamicGroup.appendChild(nTick);
    }

    if (note) {
      note.textContent = "Ketma-ketlik hadlari: " + terms.join(", ") + "... Har bir natural n ga bitta a_n mos keladi.";
    }
  }

  slideN.addEventListener("input", redraw);
  redraw();
};
