/**
 * "quadrant-signs" sahna turi — birlik aylanada burchakni (alpha) slayder
 * bilan siljitib, sin/cos/tg ISHORALARINI (+/−) chorak bo'yicha ko'rsatadi.
 *
 * unit-circle'dan farqi: u aniq son (cos t = 0.87) chiqarardi, bu esa
 * FAQAT ishora (+/−) va qaysi chorakdaligini ko'rsatadi — dars 20 aynan
 * shuni talab qiladi (data.json: vars.alpha, notes.q1..q4).
 *
 * data.json kutilgan shakl:
 *   "sahna": {
 *     "type": "quadrant-signs",
 *     "ariaLabel": "...", "hint": "...",
 *     "vars": { "alpha": { "min":0,"max":360,"step":1,"value":30,"desc":"..." } },
 *     "notes": { "q1": "...", "q2": "...", "q3": "...", "q4": "..." }
 *   }
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["quadrant-signs"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }
  var va = cfg.vars.alpha;

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      '&alpha;&nbsp;=&nbsp;<span class="term-a term-value" id="lbl-alpha" data-var="alpha">' + va.value + '</span>°' +
      '&nbsp;&nbsp;→&nbsp;&nbsp;sin&alpha;&nbsp;<span id="sgn-sin"></span>' +
      '&nbsp;&nbsp;cos&alpha;&nbsp;<span id="sgn-cos"></span>' +
      '&nbsp;&nbsp;tg&alpha;&nbsp;<span id="sgn-tg"></span>' +
    '</p>' +
    '<p class="sahna1-hint">' + (cfg.hint || "") + '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 260" role="img" aria-label="Birlik aylanada burchak choragi" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-alpha"><span>&alpha;</span> <small class="control-desc">— ' + (va.desc || "") + '</small></label>' +
        '<input type="range" id="slide-alpha" min="' + va.min + '" max="' + va.max + '" step="' + va.step + '" value="' + va.value + '">' +
        '<output id="out-alpha">' + va.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideA = body.querySelector("#slide-alpha");
  var outA = body.querySelector("#out-alpha");
  var lblA = body.querySelector("#lbl-alpha");
  var sgnSin = body.querySelector("#sgn-sin");
  var sgnCos = body.querySelector("#sgn-cos");
  var sgnTg = body.querySelector("#sgn-tg");
  var note = body.querySelector("#sahna1-note");
  var lastVals = {};

  // ---- umumiy motordan koordinata tekisligini olamiz — unit-circle bilan BIR XIL chaqiruv ----
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

  // Choraklarni ajratib turuvchi o'q chiziqlari (fon)
  ["h", "v"].forEach(function (axis) {
    var line = document.createElementNS(BASE.svgNS, "line");
    line.setAttribute("stroke", "#8a938c");
    line.setAttribute("stroke-width", "1");
    if (axis === "h") {
      line.setAttribute("x1", plane.ORIGIN_X - plane.SCALE - 12);
      line.setAttribute("x2", plane.ORIGIN_X + plane.SCALE + 12);
      line.setAttribute("y1", plane.ORIGIN_Y);
      line.setAttribute("y2", plane.ORIGIN_Y);
    } else {
      line.setAttribute("y1", plane.ORIGIN_Y - plane.SCALE - 12);
      line.setAttribute("y2", plane.ORIGIN_Y + plane.SCALE + 12);
      line.setAttribute("x1", plane.ORIGIN_X);
      line.setAttribute("x2", plane.ORIGIN_X);
    }
    graf.appendChild(line);
  });

  var radiusLine = document.createElementNS(BASE.svgNS, "line");
  radiusLine.setAttribute("stroke", "#c24b2a");
  radiusLine.setAttribute("stroke-width", "2");
  graf.appendChild(radiusLine);

  var point = document.createElementNS(BASE.svgNS, "circle");
  point.setAttribute("r", "4");
  point.setAttribute("fill", "#c24b2a");
  graf.appendChild(point);

  function signSymbol(v) {
    // trig nuqtasi o'qqa juda yaqin bo'lsa (0/90/180/270 atrofi) noaniqlik chiqmasin
    if (Math.abs(v) < 1e-9) return "0";
    return v > 0 ? "+" : "\u2212";
  }

  function render() {
    var aDeg = parseFloat(slideA.value);
    var aRad = (aDeg * Math.PI) / 180;
    var cosV = Math.cos(aRad);
    var sinV = Math.sin(aRad);
    var tgV = Math.cos(aRad) !== 0 ? Math.tan(aRad) : NaN;

    outA.textContent = aDeg;
    lblA.textContent = aDeg;

    var sinSign = signSymbol(sinV);
    var cosSign = signSymbol(cosV);
    var tgSign = isNaN(tgV) ? "\u2014" : signSymbol(tgV);

    sgnSin.textContent = sinSign;
    sgnCos.textContent = cosSign;
    sgnTg.textContent = tgSign;
    sgnSin.className = sinSign === "+" ? "sgn-pos" : sinSign === "\u2212" ? "sgn-neg" : "sgn-zero";
    sgnCos.className = cosSign === "+" ? "sgn-pos" : cosSign === "\u2212" ? "sgn-neg" : "sgn-zero";
    sgnTg.className = tgSign === "+" ? "sgn-pos" : tgSign === "\u2212" ? "sgn-neg" : "sgn-zero";

    BASE.pulse(lblA, lastVals, "alpha", aDeg);

    var px = plane.toX(cosV);
    var py = plane.toY(sinV);
    radiusLine.setAttribute("x1", plane.ORIGIN_X);
    radiusLine.setAttribute("y1", plane.ORIGIN_Y);
    radiusLine.setAttribute("x2", px);
    radiusLine.setAttribute("y2", py);
    point.setAttribute("cx", px);
    point.setAttribute("cy", py);

    var quadrant =
      cosV > 0 && sinV > 0 ? "q1" :
      cosV < 0 && sinV > 0 ? "q2" :
      cosV < 0 && sinV < 0 ? "q3" :
      cosV > 0 && sinV < 0 ? "q4" : null;

    if (quadrant) {
      BASE.applyNote(note, cfg.notes, quadrant, { alpha: aDeg, sin: sinSign, cos: cosSign, tg: tgSign });
    } else {
      note.textContent = "\u03B1 = " + aDeg + "\u00B0 — o'q chizig'ida (chorak chegarasida)";
    }
  }

  render();

  slideA.addEventListener("input", render);

  // ---- umumiy motordan scrub bog'lash — unit-circle bilan BIR XIL chaqiruv ----
  BASE.bindScrub(lblA, slideA, { ariaLabel: "alpha qiymati" });
};
