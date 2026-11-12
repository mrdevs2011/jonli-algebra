/**
 * "unit-circle" sahna turi — trigonometriya birlik aylanasi.
 * Burchak (t = α) slayderi orqali sin, cos hamda 2α (ikkilangan burchak)
 * qiymatlarini birlik aylanada real vaqtda dinamik ko'rsatadi.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["unit-circle"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }
  var vt = cfg.vars.t;

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      'α&nbsp;=&nbsp;<span class="term-a term-value" id="lbl-t" data-var="t">' + vt.value + '</span>°' +
      '&nbsp;&nbsp;→&nbsp;&nbsp;cos α&nbsp;=&nbsp;<span id="lbl-cos"></span>' +
      '&nbsp;&nbsp;sin α&nbsp;=&nbsp;<span id="lbl-sin"></span>' +
    '</p>' +
    '<p class="sahna1-hint">' + (cfg.hint || "") + '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 260" role="img" aria-label="Birlik aylana" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-t"><span>α</span> <small class="control-desc">— ' + (vt.desc || "") + '</small></label>' +
        '<input type="range" id="slide-t" min="' + vt.min + '" max="' + vt.max + '" step="' + vt.step + '" value="' + vt.value + '">' +
        '<output id="out-t">' + vt.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideT = body.querySelector("#slide-t");
  var outT = body.querySelector("#out-t");
  var lblT = body.querySelector("#lbl-t");
  var lblCos = body.querySelector("#lbl-cos");
  var lblSin = body.querySelector("#lbl-sin");
  var note = body.querySelector("#sahna1-note");

  var lastVals = {};

  var plane = BASE.createPlane(graf, { width: 320, height: 260, scale: 90, xRange: [-2, 2], yRange: [-2, 2] });

  // Birlik aylana chizig'i
  var circle = document.createElementNS(BASE.svgNS, "circle");
  circle.setAttribute("cx", plane.ORIGIN_X);
  circle.setAttribute("cy", plane.ORIGIN_Y);
  circle.setAttribute("r", plane.SCALE);
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", "#4a554c");
  circle.setAttribute("stroke-width", "1.2");
  graf.appendChild(circle);

  // 2α uchun ikkilangan burchak vektori (yashil chiziqli)
  var radiusLine2 = document.createElementNS(BASE.svgNS, "line");
  radiusLine2.setAttribute("stroke", "#2b6b4f");
  radiusLine2.setAttribute("stroke-width", "2");
  radiusLine2.setAttribute("stroke-dasharray", "4 2");
  radiusLine2.style.display = "none";
  graf.appendChild(radiusLine2);

  var point2 = document.createElementNS(BASE.svgNS, "circle");
  point2.setAttribute("r", "4");
  point2.setAttribute("fill", "#2b6b4f");
  point2.style.display = "none";
  graf.appendChild(point2);

  // Asosiy α radius vektori (qizil)
  var radiusLine = document.createElementNS(BASE.svgNS, "line");
  radiusLine.setAttribute("stroke", "#c24b2a");
  radiusLine.setAttribute("stroke-width", "2.2");
  graf.appendChild(radiusLine);

  var point = document.createElementNS(BASE.svgNS, "circle");
  point.setAttribute("r", "4.5");
  point.setAttribute("fill", "#c24b2a");
  graf.appendChild(point);

  function render() {
    var tDeg = parseFloat(slideT.value);
    var tRad = (tDeg * Math.PI) / 180;
    var cosV = Math.round(Math.cos(tRad) * 100) / 100;
    var sinV = Math.round(Math.sin(tRad) * 100) / 100;

    var t2 = (tDeg * 2) % 360;
    var t2Rad = (2 * tRad);
    var sin2V = Math.round(Math.sin(t2Rad) * 100) / 100;
    var cos2V = Math.round(Math.cos(t2Rad) * 100) / 100;

    outT.textContent = tDeg;
    lblT.textContent = tDeg;
    lblCos.textContent = cosV;
    lblSin.textContent = sinV;

    BASE.pulse(lblT, lastVals, "t", tDeg);

    var px = plane.toX(cosV);
    var py = plane.toY(sinV);
    radiusLine.setAttribute("x1", plane.ORIGIN_X);
    radiusLine.setAttribute("y1", plane.ORIGIN_Y);
    radiusLine.setAttribute("x2", px);
    radiusLine.setAttribute("y2", py);
    point.setAttribute("cx", px);
    point.setAttribute("cy", py);

    // 2α ko'rsatkichi (agar izohlarda t2 yoki 2α bo'lsa)
    var notesStr = JSON.stringify(cfg.notes || {});
    var hasDouble = notesStr.indexOf("t2") !== -1 || notesStr.indexOf("2α") !== -1 || (cfg.hint && cfg.hint.indexOf("2α") !== -1);
    if (hasDouble) {
      radiusLine2.style.display = "";
      point2.style.display = "";
      var px2 = plane.toX(cos2V);
      var py2 = plane.toY(sin2V);
      radiusLine2.setAttribute("x1", plane.ORIGIN_X);
      radiusLine2.setAttribute("y1", plane.ORIGIN_Y);
      radiusLine2.setAttribute("x2", px2);
      radiusLine2.setAttribute("y2", py2);
      point2.setAttribute("cx", px2);
      point2.setAttribute("cy", py2);
    }

    var quadrant = cosV >= 0 && sinV >= 0 ? "q1" : cosV < 0 && sinV >= 0 ? "q2" : cosV < 0 && sinV < 0 ? "q3" : "q4";
    BASE.applyNote(note, cfg.notes, quadrant, {
      t: tDeg,
      cos: cosV,
      sin: sinV,
      t2: t2,
      sin2: sin2V,
      cos2: cos2V
    });
  }

  render();

  slideT.addEventListener("input", render);
  BASE.bindScrub(lblT, slideT, { ariaLabel: "α burchagi" });
};
