/**
 * "line-parabola" sahna turi — parabola y = x² va to'g'ri chiziq y = mx + k.
 * Kesishish nuqtalari diskriminantga qarab yonadi (2 / 1 / 0).
 *
 * Config (data.json "sahna"):
 *   vars.m — chiziq burchak koeffitsienti
 *   vars.k — chiziqning Oy kesimi
 *   notes.two / notes.one / notes.none
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["line-parabola"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  var vm = cfg.vars.m, vk = cfg.vars.k;

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      'y = x² &nbsp;va&nbsp; y = ' +
      '<span class="term-a term-value" id="lbl-m" data-var="m">' + vm.value + '</span>x ' +
      '<span class="term-c term-value" id="lbl-k" data-var="k">' +
        (vk.value >= 0 ? "+" + vk.value : vk.value) +
      '</span>' +
    '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "") +
    '</p>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 260" role="img" aria-label="Parabola va to\'g\'ri chiziq kesishishi" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-m"><span>m</span> <small class="control-desc">— ' + (vm.desc || "") + '</small></label>' +
        '<input type="range" id="slide-m" min="' + vm.min + '" max="' + vm.max + '" step="' + vm.step + '" value="' + vm.value + '">' +
        '<output id="out-m">' + vm.value + '</output>' +
      '</div>' +
      '<div class="control">' +
        '<label for="slide-k"><span>k</span> <small class="control-desc">— ' + (vk.desc || "") + '</small></label>' +
        '<input type="range" id="slide-k" min="' + vk.min + '" max="' + vk.max + '" step="' + vk.step + '" value="' + vk.value + '">' +
        '<output id="out-k">' + vk.value + '</output>' +
      '</div>' +
    '</div>';

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideM = body.querySelector("#slide-m");
  var slideK = body.querySelector("#slide-k");
  var outM = body.querySelector("#out-m");
  var outK = body.querySelector("#out-k");
  var lblM = body.querySelector("#lbl-m");
  var lblK = body.querySelector("#lbl-k");
  var note = body.querySelector("#sahna1-note");
  var lastVals = {};

  var plane = BASE.createPlane(graf, { width: 320, height: 260, scale: 16 });

  var paraPath = document.createElementNS(BASE.svgNS, "path");
  paraPath.setAttribute("fill", "none");
  paraPath.setAttribute("stroke", "#c24b2a");
  paraPath.setAttribute("stroke-width", "2.4");
  paraPath.setAttribute("stroke-linecap", "round");
  graf.appendChild(paraPath);

  var linePath = document.createElementNS(BASE.svgNS, "path");
  linePath.setAttribute("fill", "none");
  linePath.setAttribute("stroke", "#2a5aa8");
  linePath.setAttribute("stroke-width", "2.2");
  linePath.setAttribute("stroke-linecap", "round");
  graf.appendChild(linePath);

  var pts = [];
  for (var i = 0; i < 2; i++) {
    var g = document.createElementNS(BASE.svgNS, "g");
    var glow = document.createElementNS(BASE.svgNS, "circle");
    glow.setAttribute("r", "8");
    glow.setAttribute("fill", "#c24b2a");
    glow.setAttribute("opacity", "0.28");
    var dot = document.createElementNS(BASE.svgNS, "circle");
    dot.setAttribute("r", "4.2");
    dot.setAttribute("fill", "#c24b2a");
    dot.setAttribute("stroke", "#fff8ef");
    dot.setAttribute("stroke-width", "1.4");
    g.appendChild(glow);
    g.appendChild(dot);
    g.style.display = "none";
    graf.appendChild(g);
    pts.push({ g: g, glow: glow, dot: dot });
  }

  function fmtK(k) {
    if (k === 0) return "+ 0";
    return k > 0 ? "+ " + k : "− " + Math.abs(k);
  }

  function render() {
    var m = parseFloat(slideM.value);
    var k = parseFloat(slideK.value);

    outM.textContent = m;
    outK.textContent = k;
    lblM.textContent = m;
    lblK.textContent = fmtK(k);

    BASE.pulse(lblM, lastVals, "m", m);
    BASE.pulse(lblK, lastVals, "k", k);

    var dP = "", dL = "";
    var xMin = -9, xMax = 9, step = 0.25;
    for (var x = xMin; x <= xMax; x += step) {
      var yp = x * x;
      var yl = m * x + k;
      var pyp = plane.toY(yp);
      var pyl = plane.toY(yl);
      if (pyp < -40) pyp = -40;
      if (pyp > plane.H + 40) pyp = plane.H + 40;
      if (pyl < -40) pyl = -40;
      if (pyl > plane.H + 40) pyl = plane.H + 40;
      dP += (x === xMin ? "M" : "L") + plane.toX(x).toFixed(1) + "," + pyp.toFixed(1) + " ";
      dL += (x === xMin ? "M" : "L") + plane.toX(x).toFixed(1) + "," + pyl.toFixed(1) + " ";
    }
    paraPath.setAttribute("d", dP);
    linePath.setAttribute("d", dL);

    // x² − m x − k = 0
    var A = 1, B = -m, C = -k;
    var disc = B * B - 4 * A * C;
    var roots = [];
    if (disc > 0.0001) {
      var s = Math.sqrt(disc);
      roots.push((-B - s) / 2, (-B + s) / 2);
    } else if (Math.abs(disc) <= 0.0001) {
      roots.push(-B / 2);
    }

    for (var i = 0; i < pts.length; i++) {
      if (i < roots.length) {
        var rx = roots[i];
        var ry = rx * rx;
        var cx = plane.toX(rx);
        var cy = plane.toY(ry);
        pts[i].glow.setAttribute("cx", cx);
        pts[i].glow.setAttribute("cy", cy);
        pts[i].dot.setAttribute("cx", cx);
        pts[i].dot.setAttribute("cy", cy);
        pts[i].g.style.display = "";
      } else {
        pts[i].g.style.display = "none";
      }
    }

    var key = roots.length === 2 ? "two" : (roots.length === 1 ? "one" : "none");
    var pair = roots.map(function (rx) {
      var ry = Math.round(rx * rx * 100) / 100;
      var xs = Math.round(rx * 100) / 100;
      return "(" + xs + "; " + ry + ")";
    }).join(" va ");
    BASE.applyNote(note, cfg.notes, key, { m: m, k: k, pts: pair || "—" });
  }

  render();

  [slideM, slideK].forEach(function (elx) { elx.addEventListener("input", render); });

  BASE.bindScrub(lblM, slideM, { ariaLabel: "m qiymati" });
  BASE.bindScrub(lblK, slideK, { ariaLabel: "k qiymati" });
};
