/**
 * "mono-parabola" — funksiyaning o'sishi / kamayishi (kvadrat).
 * Uchi (x₀) chapida va o'ngida rang bilan ajratiladi, o'qchalar ko'rsatadi.
 * a > 0: chapda kamayadi, o'ngda o'sadi; a < 0: aksincha.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["mono-parabola"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  var va = cfg.vars.a, vb = cfg.vars.b, vc = cfg.vars.c;

  var body = document.createElement("div");
  body.className = "sahna1-grid sahna-mono";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      'y&nbsp;=&nbsp;<span class="term-a term-value" id="lbl-a">' + va.value + '</span>x²&nbsp;+&nbsp;' +
      '<span class="term-b term-value" id="lbl-b">' + vb.value + '</span>x&nbsp;+&nbsp;' +
      '<span class="term-c term-value" id="lbl-c">' + vc.value + '</span>' +
    '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "a ni o‘zgartiring — chap/o‘ng tomon ranglari almasinadi") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 260" role="img" aria-label="O‘sish va kamayish oraliklari" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-a"><span>a</span> <small class="control-desc">— ' + (va.desc || "tarmoqlar") + '</small></label>' +
        '<input type="range" id="slide-a" min="' + va.min + '" max="' + va.max + '" step="' + va.step + '" value="' + va.value + '">' +
        '<output id="out-a">' + va.value + '</output>' +
      '</div>' +
      '<div class="control">' +
        '<label for="slide-b"><span>b</span> <small class="control-desc">— ' + (vb.desc || "uchi") + '</small></label>' +
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

  var plane = BASE.createPlane(graf, { width: 320, height: 260, scale: 16 });

  var zoneL = document.createElementNS(BASE.svgNS, "rect");
  zoneL.setAttribute("class", "mono-zone mono-zone-l");
  zoneL.setAttribute("y", "0");
  zoneL.setAttribute("height", String(plane.H));
  zoneL.setAttribute("opacity", "0.18");
  graf.appendChild(zoneL);

  var zoneR = document.createElementNS(BASE.svgNS, "rect");
  zoneR.setAttribute("class", "mono-zone mono-zone-r");
  zoneR.setAttribute("y", "0");
  zoneR.setAttribute("height", String(plane.H));
  zoneR.setAttribute("opacity", "0.18");
  graf.appendChild(zoneR);

  var curvePath = document.createElementNS(BASE.svgNS, "path");
  curvePath.setAttribute("fill", "none");
  curvePath.setAttribute("stroke-width", "2.4");
  curvePath.setAttribute("stroke-linecap", "round");
  graf.appendChild(curvePath);

  var vertexDot = document.createElementNS(BASE.svgNS, "circle");
  vertexDot.setAttribute("r", "5");
  vertexDot.setAttribute("fill", "#c24b2a");
  vertexDot.setAttribute("stroke", "#f3eee4");
  vertexDot.setAttribute("stroke-width", "2");
  graf.appendChild(vertexDot);

  var vLine = document.createElementNS(BASE.svgNS, "line");
  vLine.setAttribute("stroke", "#c24b2a");
  vLine.setAttribute("stroke-width", "1.2");
  vLine.setAttribute("stroke-dasharray", "4 3");
  vLine.setAttribute("opacity", "0.7");
  graf.appendChild(vLine);

  var labelL = document.createElementNS(BASE.svgNS, "text");
  labelL.setAttribute("class", "mono-label");
  labelL.setAttribute("text-anchor", "middle");
  labelL.setAttribute("font-size", "12");
  labelL.setAttribute("font-weight", "700");
  graf.appendChild(labelL);

  var labelR = document.createElementNS(BASE.svgNS, "text");
  labelR.setAttribute("class", "mono-label");
  labelR.setAttribute("text-anchor", "middle");
  labelR.setAttribute("font-size", "12");
  labelR.setAttribute("font-weight", "700");
  graf.appendChild(labelR);

  function fmt(x) {
    if (Math.abs(x - Math.round(x)) < 1e-6) return String(Math.round(x));
    return String(Math.round(x * 100) / 100);
  }

  function render() {
    var a = parseFloat(slideA.value);
    var b = parseFloat(slideB.value);
    var c = parseFloat(slideC.value);

    outA.textContent = a; outB.textContent = b; outC.textContent = c;
    lblA.textContent = a;
    lblB.textContent = BASE.fmtSigned(b);
    lblC.textContent = BASE.fmtSigned(c);
    BASE.pulse(lblA, lastVals, "a", a);
    BASE.pulse(lblB, lastVals, "b", b);
    BASE.pulse(lblC, lastVals, "c", c);

    var d = "";
    var xMin = -9, xMax = 9, step = 0.2;
    for (var x = xMin; x <= xMax; x += step) {
      var y = a * x * x + b * x + c;
      var py = plane.toY(y);
      if (py < -40) py = -40;
      if (py > plane.H + 40) py = plane.H + 40;
      d += (x === xMin ? "M" : "L") + plane.toX(x).toFixed(1) + "," + py.toFixed(1) + " ";
    }
    curvePath.setAttribute("d", d);
    curvePath.setAttribute("stroke", a === 0 ? "#5b6e8c" : "#c24b2a");

    if (Math.abs(a) < 1e-9) {
      zoneL.setAttribute("width", "0");
      zoneR.setAttribute("width", "0");
      vertexDot.setAttribute("opacity", "0");
      vLine.setAttribute("opacity", "0");
      labelL.textContent = "";
      labelR.textContent = "";
      note.innerHTML = "a = 0 — chiziqli funksiya. O‘sish/kamayish a=0 da boshqacha.";
      return;
    }

    var x0 = -b / (2 * a);
    var y0 = a * x0 * x0 + b * x0 + c;
    var px0 = plane.toX(x0);
    var py0 = plane.toY(y0);

    vertexDot.setAttribute("cx", px0);
    vertexDot.setAttribute("cy", py0);
    vertexDot.setAttribute("opacity", "1");

    vLine.setAttribute("x1", px0);
    vLine.setAttribute("x2", px0);
    vLine.setAttribute("y1", 8);
    vLine.setAttribute("y2", plane.H - 8);
    vLine.setAttribute("opacity", "0.7");

    // zones
    var leftW = Math.max(0, px0);
    var rightX = px0;
    var rightW = Math.max(0, plane.W - px0);
    zoneL.setAttribute("x", "0");
    zoneL.setAttribute("width", String(leftW));
    zoneR.setAttribute("x", String(rightX));
    zoneR.setAttribute("width", String(rightW));

    // a>0: left decrease (cool), right increase (warm)
    // a<0: left increase, right decrease
    var incColor = "rgba(46, 125, 90, 0.35)";
    var decColor = "rgba(194, 75, 42, 0.28)";
    var leftIsInc = a < 0;
    zoneL.setAttribute("fill", leftIsInc ? incColor : decColor);
    zoneR.setAttribute("fill", leftIsInc ? decColor : incColor);

    var leftText = leftIsInc ? "o'sadi ↑" : "kamayadi ↓";
    var rightText = leftIsInc ? "kamayadi ↓" : "o'sadi ↑";
    labelL.setAttribute("x", leftW > 20 ? leftW / 2 : 24);
    labelL.setAttribute("y", 22);
    labelL.setAttribute("fill", leftIsInc ? "#2e7d5a" : "#c24b2a");
    labelL.textContent = leftText;

    labelR.setAttribute("x", rightX + (rightW > 20 ? rightW / 2 : 20));
    labelR.setAttribute("y", 22);
    labelR.setAttribute("fill", leftIsInc ? "#c24b2a" : "#2e7d5a");
    labelR.textContent = rightText;

    var x0s = fmt(x0);
    note.innerHTML =
      "<strong>Uchi:</strong> x₀ = " + x0s +
      ". <span class=\"mono-chip mono-dec\">kamayadi</span> " +
      (leftIsInc ? "(x₀; +∞)" : "(−∞; x₀)") +
      " · <span class=\"mono-chip mono-inc\">o'sadi</span> " +
      (leftIsInc ? "(−∞; x₀)" : "(x₀; +∞)");
  }

  render();
  [slideA, slideB, slideC].forEach(function (el) {
    el.addEventListener("input", render);
  });
  BASE.bindScrub(lblA, slideA, { ariaLabel: "a qiymati" });
  BASE.bindScrub(lblB, slideB, { ariaLabel: "b qiymati" });
  BASE.bindScrub(lblC, slideC, { ariaLabel: "c qiymati" });
};
