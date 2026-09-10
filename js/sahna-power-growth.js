/**
 * "power-growth" sahna turi — darajali funksiya y = x^r ning o'sishi/kamayishini
 * ko'rsatadi (10-§, 41-43-bet mavzusi — KVADRAT FUNKSIYA EMAS).
 *
 * r > 0 bo'lsa: funksiya x ≥ 0 oraliqda o'sadi.
 * r < 0 bo'lsa: funksiya x > 0 oraliqda kamayadi (x=0 da aniqlanmagan).
 *
 * cfg.vars: r (daraja ko'rsatkichi, slayder)
 * cfg.notes: { positive: "...", negative: "..." }
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["power-growth"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }

  var vr = cfg.vars.r || { min: -3, max: 3, step: 0.5, value: 2, desc: "daraja ko'rsatkichi" };

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">y = x<sup><span class="term-a term-value" id="lbl-r">' + vr.value + '</span></sup></p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "r ni suring — o'sish yoki kamayish yo'nalishi o'zgaradi") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 260" role="img" aria-label="' + (cfg.ariaLabel || "y = x^r grafigi") + '" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-r"><span>r</span> <small class="control-desc">— ' + (vr.desc || "daraja ko'rsatkichi") + '</small></label>' +
        '<input type="range" id="slide-r" min="' + vr.min + '" max="' + vr.max + '" step="' + vr.step + '" value="' + vr.value + '">' +
        '<output id="out-r">' + vr.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var svg = body.querySelector("#graf");
  var slideR = body.querySelector("#slide-r");
  var outR = body.querySelector("#out-r");
  var lblR = body.querySelector("#lbl-r");
  var note = body.querySelector("#sahna1-note");
  var lastVals = {};

  var plane = BASE.createPlane(svg, {
    width: 320, height: 260, scale: 26,
    xRange: [-1, 5], yRange: [-1, 6],
    labelX: "x", labelY: "y"
  });

  function addPath(d, stroke, sw) {
    var el = document.createElementNS(BASE.svgNS, "path");
    el.setAttribute("d", d);
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", stroke);
    el.setAttribute("stroke-width", sw || "2.4");
    el.setAttribute("stroke-linecap", "round");
    svg.appendChild(el);
  }

  function addCircle(x, y, r, fill, stroke) {
    var el = document.createElementNS(BASE.svgNS, "circle");
    el.setAttribute("cx", plane.toX(x)); el.setAttribute("cy", plane.toY(y));
    el.setAttribute("r", r);
    el.setAttribute("fill", fill); el.setAttribute("stroke", stroke || fill);
    el.setAttribute("stroke-width", "2");
    svg.appendChild(el);
  }

  function render() {
    var r = parseFloat(slideR.value);
    outR.textContent = r;
    lblR.textContent = r;
    BASE.pulse(lblR, lastVals, "r", r);

    // eski egri chiziqni tozalash (faqat curve/circle — o'q/panjara qoladi)
    var old = svg.querySelectorAll(".power-curve, .power-point");
    for (var i = 0; i < old.length; i++) svg.removeChild(old[i]);

    var yMax = 6, xMax = 5;
    var d = "";
    var started = false;

    if (r >= 0) {
      // x >= 0 da aniqlangan (x=0 da y=0, r=0 bo'lsa y=1 doim)
      var steps = 200;
      for (var i2 = 0; i2 <= steps; i2++) {
        var x = (i2 / steps) * xMax;
        var y = (r === 0) ? 1 : Math.pow(x, r);
        if (y > yMax) y = yMax;
        var px = plane.toX(x), py = plane.toY(y);
        d += (started ? " L " : "M ") + px + " " + py;
        started = true;
      }
    } else {
      // r < 0: x > 0 da aniqlangan, x -> 0 da y -> cheksizlikka intiladi
      var steps2 = 200;
      var xStart = 0.06;
      for (var i3 = 0; i3 <= steps2; i3++) {
        var x2 = xStart + (i3 / steps2) * (xMax - xStart);
        var y2 = Math.pow(x2, r);
        if (y2 > yMax) y2 = yMax;
        var px2 = plane.toX(x2), py2 = plane.toY(y2);
        d += (started ? " L " : "M ") + px2 + " " + py2;
        started = true;
      }
    }

    var curveEl = document.createElementNS(BASE.svgNS, "path");
    curveEl.setAttribute("d", d);
    curveEl.setAttribute("fill", "none");
    curveEl.setAttribute("class", "power-curve");
    curveEl.setAttribute("stroke", r >= 0 ? "#2a7a4b" : "#c24b2a");
    curveEl.setAttribute("stroke-width", "2.6");
    curveEl.setAttribute("stroke-linecap", "round");
    svg.appendChild(curveEl);

    // boshlanish nuqtasi belgisi
    var markEl = document.createElementNS(BASE.svgNS, "circle");
    if (r >= 0) {
      markEl.setAttribute("cx", plane.toX(0));
      markEl.setAttribute("cy", plane.toY(r === 0 ? 1 : 0));
      markEl.setAttribute("r", "5");
      markEl.setAttribute("fill", "#2a7a4b");
    } else {
      markEl.setAttribute("cx", plane.toX(0));
      markEl.setAttribute("cy", plane.toY(0));
      markEl.setAttribute("r", "5");
      markEl.setAttribute("fill", "#fff");
      markEl.setAttribute("stroke", "#c24b2a");
      markEl.setAttribute("stroke-width", "2");
    }
    markEl.setAttribute("class", "power-point");
    svg.appendChild(markEl);

    var activeKey = r === 0 ? "zero" : (r > 0 ? "positive" : "negative");
    BASE.applyNote(note, cfg.notes || {}, activeKey, { r: r });
  }

  render();
  slideR.addEventListener("input", render);
  BASE.bindScrub(lblR, slideR, { ariaLabel: "daraja ko'rsatkichi r" });
};
