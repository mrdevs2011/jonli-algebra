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
 *
 * Yangilanish: min===max bo'lgan o'zgaruvchilar (masalan 3-§ da b=c=0)
 * yashiriladi — foydalanuvchi "ishlamayapti" deb o'ylamasin.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["abc-parabola"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML(
      "beforeend",
      '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>'
    );
    return;
  }

  var va = cfg.vars.a, vb = cfg.vars.b, vc = cfg.vars.c;
  if (!va || !vb || !vc) {
    stage.insertAdjacentHTML(
      "beforeend",
      '<p class="sahna-fallback">Sahna konfiguratsiyasi noto\'g\'ri (a/b/c).</p>'
    );
    return;
  }

  function isLocked(v) {
    return Number(v.min) === Number(v.max);
  }

  var aLocked = isLocked(va);
  var bLocked = isLocked(vb);
  var cLocked = isLocked(vc);
  var activeCount = (aLocked ? 0 : 1) + (bLocked ? 0 : 1) + (cLocked ? 0 : 1);

  // ---- sahna ichini quramiz ----
  var body = document.createElement("div");
  body.className = "sahna1-grid";

  function controlHtml(id, letter, v, locked) {
    if (locked) {
      // Qulflangan o'zgaruvchi — yashirin input (qiymat saqlansin), UI yo'q
      return (
        '<div class="control is-locked" hidden aria-hidden="true">' +
          '<input type="range" id="slide-' + id + '" min="' + v.min + '" max="' + v.max +
          '" step="' + v.step + '" value="' + v.value + '">' +
          '<output id="out-' + id + '">' + v.value + "</output>" +
        "</div>"
      );
    }
    return (
      '<div class="control">' +
        '<label for="slide-' + id + '"><span>' + letter + '</span> <small class="control-desc">— ' +
        (v.desc || "") + "</small></label>" +
        '<input type="range" id="slide-' + id + '" min="' + v.min + '" max="' + v.max +
        '" step="' + v.step + '" value="' + v.value + '">' +
        '<output id="out-' + id + '">' + v.value + "</output>" +
      "</div>"
    );
  }

  body.innerHTML =
    '<p class="sahna1-formula">' +
      'y&nbsp;=&nbsp;<span class="term-a term-value" id="lbl-a" data-var="a">' + va.value + "</span>x²&nbsp;+&nbsp;" +
      '<span class="term-b term-value" id="lbl-b" data-var="b">' + vb.value + "</span>x&nbsp;+&nbsp;" +
      '<span class="term-c term-value" id="lbl-c" data-var="c">' + vc.value + "</span>" +
    "</p>" +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "") +
    "</p>" +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 260" role="img" aria-label="Koordinata tekisligida grafik" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls' + (activeCount === 1 ? " sahna-controls-single" : "") + '">' +
      controlHtml("a", "a", va, aLocked) +
      controlHtml("b", "b", vb, bLocked) +
      controlHtml("c", "c", vc, cLocked) +
    "</div>";

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

  // Qulflangan label'larga scrub bermaymiz
  if (aLocked) {
    lblA.classList.remove("term-value");
    lblA.removeAttribute("data-var");
  }
  if (bLocked) {
    lblB.classList.remove("term-value");
    lblB.removeAttribute("data-var");
  }
  if (cLocked) {
    lblC.classList.remove("term-value");
    lblC.removeAttribute("data-var");
  }

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

    if (outA) outA.textContent = a;
    if (outB) outB.textContent = b;
    if (outC) outC.textContent = c;
    lblA.textContent = a;
    lblB.textContent = BASE.fmtSigned(b);
    lblC.textContent = BASE.fmtSigned(c);

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

    var activeKey = a === 0 ? "zero" : a > 0 ? "positive" : "negative";
    BASE.applyNote(note, cfg.notes, activeKey, { a: a, b: b, c: c });
  }

  render();

  [slideA, slideB, slideC].forEach(function (elx) {
    if (elx) elx.addEventListener("input", render);
  });

  if (!aLocked) BASE.bindScrub(lblA, slideA, { ariaLabel: "a qiymati" });
  if (!bLocked) BASE.bindScrub(lblB, slideB, { ariaLabel: "b qiymati" });
  if (!cLocked) BASE.bindScrub(lblC, slideC, { ariaLabel: "c qiymati" });
};
