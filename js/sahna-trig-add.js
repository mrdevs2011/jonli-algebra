/**
 * "trig-add" sahna turi — Qo'shish formulalari (cos(α+β) va sin(α+β)).
 * 2 ta slayder: α burchak (ko'k) va β burchak (yashil qo'shimcha yoy).
 * Yakuniy vektor: α+β (qizil).
 * Real vaqtda formulaning chap va o'ng tomoni hisoblanadi va aynan tengligi isbotlanadi.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["trig-add"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }

  var va = cfg.vars && cfg.vars.a ? cfg.vars.a : { min: 0, max: 180, step: 5, value: 45, desc: "burchak α (gradus)" };
  var vb = cfg.vars && cfg.vars.b ? cfg.vars.b : { min: 0, max: 180, step: 5, value: 30, desc: "qo'shiluvchi burchak β (gradus)" };

  var body = document.createElement("div");
  body.className = "sahna1-grid trig-add-grid";

  body.innerHTML =
    '<div class="trig-add-formula-card" style="grid-column: 1 / -1; background: var(--white); border: 1px solid var(--line-strong); border-radius: 12px; padding: 12px 16px; margin-bottom: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.04);">' +
      '<div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; justify-content:space-between; font-size:0.95rem;">' +
        '<div><strong>cos(α + β)</strong> = cos(<span id="lbl-sum-deg">75</span>°) ≈ <strong id="lbl-cos-sum" style="color:#c24b2a; font-size:1.15rem;">0.26</strong></div>' +
        '<div><strong>cosα·cosβ − sinα·sinβ</strong> ≈ <strong id="lbl-rhs" style="color:#2b6b4f; font-size:1.15rem;">0.26</strong></div>' +
      '</div>' +
      '<div id="lbl-match-note" style="margin-top:6px; font-size:0.85rem; color:var(--accent-2); font-weight:600;">Ikkala tomon har qanday burchakda aynan teng!</div>' +
    '</div>' +
    '<p class="sahna1-hint">' + (cfg.hint || "α va β slayderlarini suring — formulaning ikki tomoni bir xil natija berishini kuzating.") + '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 260" role="img" aria-label="Qo\'shish formulalari birlik aylanasi" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">' +
      '<div class="control">' +
        '<label for="slide-a"><span style="color:#2a628f;">α</span> <small class="control-desc">— ' + (va.desc || "burchak α") + '</small></label>' +
        '<input type="range" id="slide-a" min="' + va.min + '" max="' + va.max + '" step="' + va.step + '" value="' + va.value + '">' +
        '<output id="out-a">' + va.value + '°</output>' +
      '</div>' +
      '<div class="control">' +
        '<label for="slide-b"><span style="color:#2b6b4f;">β</span> <small class="control-desc">— ' + (vb.desc || "burchak β") + '</small></label>' +
        '<input type="range" id="slide-b" min="' + vb.min + '" max="' + vb.max + '" step="' + vb.step + '" value="' + vb.value + '">' +
        '<output id="out-b">' + vb.value + '°</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideA = body.querySelector("#slide-a");
  var slideB = body.querySelector("#slide-b");
  var outA = body.querySelector("#out-a");
  var outB = body.querySelector("#out-b");
  var lblSumDeg = body.querySelector("#lbl-sum-deg");
  var lblCosSum = body.querySelector("#lbl-cos-sum");
  var lblRhs = body.querySelector("#lbl-rhs");
  var note = body.querySelector("#sahna1-note");

  var plane = BASE.createPlane(graf, { width: 320, height: 260, scale: 90, xRange: [-2, 2], yRange: [-2, 2] });

  // Birlik aylana
  var circle = document.createElementNS(BASE.svgNS, "circle");
  circle.setAttribute("cx", plane.ORIGIN_X);
  circle.setAttribute("cy", plane.ORIGIN_Y);
  circle.setAttribute("r", plane.SCALE);
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", "#4a554c");
  circle.setAttribute("stroke-width", "1.2");
  graf.appendChild(circle);

  // α vektori (ko'k)
  var lineAlpha = document.createElementNS(BASE.svgNS, "line");
  lineAlpha.setAttribute("stroke", "#2a628f");
  lineAlpha.setAttribute("stroke-width", "2");
  graf.appendChild(lineAlpha);

  var dotAlpha = document.createElementNS(BASE.svgNS, "circle");
  dotAlpha.setAttribute("r", "4");
  dotAlpha.setAttribute("fill", "#2a628f");
  graf.appendChild(dotAlpha);

  // α + β yakuniy vektor (qizil)
  var lineSum = document.createElementNS(BASE.svgNS, "line");
  lineSum.setAttribute("stroke", "#c24b2a");
  lineSum.setAttribute("stroke-width", "2.6");
  graf.appendChild(lineSum);

  var dotSum = document.createElementNS(BASE.svgNS, "circle");
  dotSum.setAttribute("r", "5");
  dotSum.setAttribute("fill", "#c24b2a");
  graf.appendChild(dotSum);

  // β yoyi (yashil oraliq)
  var arcBeta = document.createElementNS(BASE.svgNS, "path");
  arcBeta.setAttribute("fill", "none");
  arcBeta.setAttribute("stroke", "#2b6b4f");
  arcBeta.setAttribute("stroke-width", "2.5");
  arcBeta.setAttribute("stroke-dasharray", "3 2");
  graf.appendChild(arcBeta);

  function polarToCart(deg, r) {
    var rad = (deg * Math.PI) / 180;
    return {
      x: plane.ORIGIN_X + r * Math.cos(rad),
      y: plane.ORIGIN_Y - r * Math.sin(rad)
    };
  }

  function render() {
    var aDeg = parseFloat(slideA.value);
    var bDeg = parseFloat(slideB.value);
    var sumDeg = aDeg + bDeg;

    outA.textContent = aDeg + "°";
    outB.textContent = bDeg + "°";
    lblSumDeg.textContent = sumDeg;

    var aRad = (aDeg * Math.PI) / 180;
    var bRad = (bDeg * Math.PI) / 180;
    var sumRad = (sumDeg * Math.PI) / 180;

    var cosA = Math.cos(aRad);
    var sinA = Math.sin(aRad);
    var cosB = Math.cos(bRad);
    var sinB = Math.sin(bRad);

    var lhs = Math.cos(sumRad);
    var rhs = (cosA * cosB) - (sinA * sinB);

    var lhsR = Math.round(lhs * 100) / 100;
    var rhsR = Math.round(rhs * 100) / 100;

    lblCosSum.textContent = (lhsR >= 0 ? "+" : "") + lhsR.toFixed(2);
    lblRhs.textContent = (rhsR >= 0 ? "+" : "") + rhsR.toFixed(2);

    // α vektori
    var pA = polarToCart(aDeg, plane.SCALE);
    lineAlpha.setAttribute("x1", plane.ORIGIN_X);
    lineAlpha.setAttribute("y1", plane.ORIGIN_Y);
    lineAlpha.setAttribute("x2", pA.x);
    lineAlpha.setAttribute("y2", pA.y);
    dotAlpha.setAttribute("cx", pA.x);
    dotAlpha.setAttribute("cy", pA.y);

    // α+β vektori
    var pSum = polarToCart(sumDeg, plane.SCALE);
    lineSum.setAttribute("x1", plane.ORIGIN_X);
    lineSum.setAttribute("y1", plane.ORIGIN_Y);
    lineSum.setAttribute("x2", pSum.x);
    lineSum.setAttribute("y2", pSum.y);
    dotSum.setAttribute("cx", pSum.x);
    dotSum.setAttribute("cy", pSum.y);

    // β yoyi (kichik radiusda ko'rsatish)
    var arcR = plane.SCALE * 0.7;
    var startP = polarToCart(aDeg, arcR);
    var endP = polarToCart(sumDeg, arcR);
    var largeArc = bDeg > 180 ? 1 : 0;
    arcBeta.setAttribute("d", "M " + startP.x + " " + startP.y + " A " + arcR + " " + arcR + " 0 " + largeArc + " 0 " + endP.x + " " + endP.y);

    if (note) {
      note.textContent = "α=" + aDeg + "°, β=" + bDeg + "° da: cos(" + aDeg + "°+" + bDeg + "°) = " + lhsR.toFixed(2) + " va cosα·cosβ − sinα·sinβ = " + rhsR.toFixed(2) + ". Ikkala formula har doim teng!";
    }
  }

  render();

  slideA.addEventListener("input", render);
  slideB.addEventListener("input", render);
};
