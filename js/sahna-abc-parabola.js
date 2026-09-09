/**
 * "abc-parabola" sahna turi — y = ax² + bx + c, a/b/c slayderlari + jonli grafik.
 * Config (data.json'dagi "sahna" obyekti) orqali boshqariladi, shuning uchun
 * 1-§ bilan bir xil chizmani boshqa darslar ham (masalan 2-§, 3-§, 4-§) turli
 * boshlang'ich qiymat/oraliqlar bilan qayta ishlatishi mumkin.
 *
 * DIQQAT: SVG koordinata tizimi, slider-scrub va shablon-eslatma logikasi
 * endi js/sahna-base.js (KA_SAHNA_BASE) ichida — bu fayl faqat PARABOLAGA
 * XOS narsani o'z ichiga oladi: formula (y = ax²+bx+c), egri chiziq
 * chizish va uchta o'zgaruvchining (a,b,c) boshqaruv paneli.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["abc-parabola"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  var va = cfg.vars.a, vb = cfg.vars.b, vc = cfg.vars.c;

  // ---- sahna ichini quramiz ----
  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      'y&nbsp;=&nbsp;<span class="term-a term-value" id="lbl-a" data-var="a">' + va.value + '</span>x²&nbsp;+&nbsp;' +
      '<span class="term-b term-value" id="lbl-b" data-var="b">' + vb.value + '</span>x&nbsp;+&nbsp;' +
      '<span class="term-c term-value" id="lbl-c" data-var="c">' + vc.value + '</span>' +
    '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 260" role="img" aria-label="Koordinata tekisligida grafik" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-a"><span>a</span> <small class="control-desc">— ' + (va.desc || "") + '</small></label>' +
        '<input type="range" id="slide-a" min="' + va.min + '" max="' + va.max + '" step="' + va.step + '" value="' + va.value + '">' +
        '<output id="out-a">' + va.value + '</output>' +
      '</div>' +
      '<div class="control">' +
        '<label for="slide-b"><span>b</span> <small class="control-desc">— ' + (vb.desc || "") + '</small></label>' +
        '<input type="range" id="slide-b" min="' + vb.min + '" max="' + vb.max + '" step="' + vb.step + '" value="' + vb.value + '">' +
        '<output id="out-b">' + vb.value + '</output>' +
      '</div>' +
      '<div class="control">' +
        '<label for="slide-c"><span>c</span> <small class="control-desc">— ' + (vc.desc || "") + '</small></label>' +
        '<input type="range" id="slide-c" min="' + vc.min + '" max="' + vc.max + '" step="' + vc.step + '" value="' + vc.value + '">' +
        '<output id="out-c">' + vc.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideA = body.querySelector("#slide-a");
  var slideB = body.querySelector("#slide-b");
  var slideC = body.querySelector("#slide-c");
  var outA = body.querySelector("#out-a");
  var outB = body.querySelector("#out-b");
  var outC = body.querySelector("#out-c");
  var lblA = body.querySelector("#lbl-a");
  var lblB = body.querySelector("#lbl-b");
  var lblC = body.querySelector("#lbl-c");
  var note = body.querySelector("#sahna1-note");
  var lastVals = {};

  // ---- umumiy motordan koordinata tekisligini olamiz ----
  var plane = BASE.createPlane(graf, { width: 320, height: 260, scale: 16 });

  var curvePath = document.createElementNS(BASE.svgNS, "path");
  curvePath.setAttribute("fill", "none");
  curvePath.setAttribute("stroke-width", "2.4");
  curvePath.setAttribute("stroke-linecap", "round");
  graf.appendChild(curvePath);

  // ---- PARABOLAGA XOS: formula hisoblash va egri chiziq ----
  function render() {
    var a = parseFloat(slideA.value);
    var b = parseFloat(slideB.value);
    var c = parseFloat(slideC.value);

    outA.textContent = a; outB.textContent = b; outC.textContent = c;
    lblA.textContent = a; lblB.textContent = BASE.fmtSigned(b); lblC.textContent = BASE.fmtSigned(c);

    BASE.pulse(lblA, lastVals, "a", a);
    BASE.pulse(lblB, lastVals, "b", b);
    BASE.pulse(lblC, lastVals, "c", c);

    var d = "";
    var xMin = -9, xMax = 9, step = 0.25;
    for (var x = xMin; x <= xMax; x += step) {
      var y = a * x * x + b * x + c;
      var py = plane.toY(y);
      if (py < -40) py = -40;
      if (py > plane.H + 40) py = plane.H + 40;
      d += (x === xMin ? "M" : "L") + plane.toX(x).toFixed(1) + "," + py.toFixed(1) + " ";
    }
    curvePath.setAttribute("d", d);
    curvePath.setAttribute("stroke", a === 0 ? "#5b6e8c" : "#c24b2a");

    var activeKey = a === 0 ? "zero" : (a > 0 ? "positive" : "negative");
    BASE.applyNote(note, cfg.notes, activeKey, { a: a, b: b, c: c });
  }

  render();

  [slideA, slideB, slideC].forEach(function (elx) { elx.addEventListener("input", render); });

  BASE.bindScrub(lblA, slideA, { ariaLabel: "a qiymati" });
  BASE.bindScrub(lblB, slideB, { ariaLabel: "b qiymati" });
  BASE.bindScrub(lblC, slideC, { ariaLabel: "c qiymati" });
};
