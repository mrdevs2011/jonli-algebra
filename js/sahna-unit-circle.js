/**
 * "unit-circle" sahna turi — trigonometriya birlik aylanasi, burchak (t)
 * slayderi bilan sin/cos ni jonli ko'rsatadi.
 *
 * MAQSAD: bu fayl hozircha PLACEHOLDER — hech qanday real darsda
 * ishlatilmayapti. Uni ataylab yozdim, chunki sahna-base.js FAQAT bitta
 * misoldan (abc-parabola) chiqarilgan edi — bu taxmin bo'lardi, sinalmagan
 * umumiylik. Bu fayl base'ni IKKINCHI, formula jihatidan BUTUNLAY BOSHQA
 * holatda sinaydi:
 *   - parabolada ikki o'zgaruvchi (x,y) chiziq, bu yerda BURCHAK (t) dan
 *     nuqta koordinatasi chiqadi — x=cos(t), y=sin(t)
 *   - parabolada 3 ta slayder (a,b,c), bu yerda 1 ta (t)
 *   - lekin: koordinata tekisligi (createPlane), slider-scrub bog'lash
 *     (bindScrub), pulse animatsiyasi — bittasi ham qayta yozilmadi.
 *
 * Natija: agar shu fayl ishласа (pastdagi test buni tasdiqlaydi),
 * demak sahna-base.js haqiqatan umumiy — bitta emas, ikkita mustaqil
 * formula ustida sinaldi. Shundan keyingina uchinchi, to'rtinchi sahna
 * turini yozish "isbotlangan pattern"ga amal qiladi.
 *
 * data.json'da ishlatish uchun kutilgan cfg shakli:
 *   "sahna": {
 *     "type": "unit-circle",
 *     "ariaLabel": "...",
 *     "hint": "...",
 *     "vars": { "t": { "min": 0, "max": 360, "step": 5, "value": 30, "desc": "burchak (gradus)" } }
 *   }
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
      't&nbsp;=&nbsp;<span class="term-a term-value" id="lbl-t" data-var="t">' + vt.value + '</span>°' +
      '&nbsp;&nbsp;→&nbsp;&nbsp;cos t&nbsp;=&nbsp;<span id="lbl-cos"></span>' +
      '&nbsp;&nbsp;sin t&nbsp;=&nbsp;<span id="lbl-sin"></span>' +
    '</p>' +
    '<p class="sahna1-hint">' + (cfg.hint || "") + '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 260" role="img" aria-label="Birlik aylana" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-t"><span>t</span> <small class="control-desc">— ' + (vt.desc || "") + '</small></label>' +
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

  // ---- umumiy motordan koordinata tekisligini olamiz — parabola bilan BIR XIL chaqiruv ----
  var plane = BASE.createPlane(graf, { width: 320, height: 260, scale: 90, xRange: [-2, 2], yRange: [-2, 2] });

  // Birlik aylana chizig'i — bu turga XOS (parabolada bunday narsa yo'q edi)
  var circle = document.createElementNS(BASE.svgNS, "circle");
  circle.setAttribute("cx", plane.ORIGIN_X);
  circle.setAttribute("cy", plane.ORIGIN_Y);
  circle.setAttribute("r", plane.SCALE);
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", "#4a554c");
  circle.setAttribute("stroke-width", "1.2");
  graf.appendChild(circle);

  var radiusLine = document.createElementNS(BASE.svgNS, "line");
  radiusLine.setAttribute("stroke", "#c24b2a");
  radiusLine.setAttribute("stroke-width", "2");
  graf.appendChild(radiusLine);

  var point = document.createElementNS(BASE.svgNS, "circle");
  point.setAttribute("r", "4");
  point.setAttribute("fill", "#c24b2a");
  graf.appendChild(point);

  // ---- TRIGONOMETRIYAGA XOS: t burchakdan (x,y) nuqta hisoblash ----
  function render() {
    var tDeg = parseFloat(slideT.value);
    var tRad = (tDeg * Math.PI) / 180;
    var cosV = Math.round(Math.cos(tRad) * 100) / 100;
    var sinV = Math.round(Math.sin(tRad) * 100) / 100;

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

    var quadrant = cosV >= 0 && sinV >= 0 ? "q1" : cosV < 0 && sinV >= 0 ? "q2" : cosV < 0 && sinV < 0 ? "q3" : "q4";
    BASE.applyNote(note, cfg.notes, quadrant, { t: tDeg, cos: cosV, sin: sinV });
  }

  render();

  slideT.addEventListener("input", render);

  // ---- umumiy motordan scrub bog'lash — parabola bilan BIR XIL chaqiruv ----
  BASE.bindScrub(lblT, slideT, { ariaLabel: "t qiymati" });
};
