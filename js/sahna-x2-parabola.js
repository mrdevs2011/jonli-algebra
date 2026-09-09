/**
 * "x2-parabola" sahna turi — y = x², nuqta va uning jufti, simmetriya o'qi.
 *
 * 2-§ g'oyasi: avval jadvaldagi nuqtalar, keyin parabola, keyin
 * "chap = o'ng" simmetriyasi. a/b/c slayderlari bu darsga tegishli emas
 * (ular 1-§ va 4-§ da). Shu sababli alohida tur.
 *
 * Base'dan olinadi: createPlane, bindScrub, pulse, applyNote.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["x2-parabola"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  var vx = cfg.vars.x;

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      'y&nbsp;=&nbsp;x²&nbsp;&nbsp;→&nbsp;&nbsp;' +
      '(<span class="term-a term-value" id="lbl-x" data-var="x">' + vx.value + '</span>;&nbsp;' +
      '<span class="term-c" id="lbl-y">0</span>)' +
    "</p>" +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "") +
    "</p>" +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 280" role="img" aria-label="y = x² parabola va simmetrik nuqtalar" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<div class="sahna-x2-table" id="x2-table" aria-label="Qiymatlar jadvali"></div>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls sahna-x2-controls">' +
      '<div class="control">' +
        '<label for="slide-x"><span>x</span> <small class="control-desc">— ' + (vx.desc || "") + "</small></label>" +
        '<input type="range" id="slide-x" min="' + vx.min + '" max="' + vx.max + '" step="' + vx.step + '" value="' + vx.value + '">' +
        '<output id="out-x">' + vx.value + "</output>" +
      "</div>" +
    "</div>";

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slideX = body.querySelector("#slide-x");
  var outX = body.querySelector("#out-x");
  var lblX = body.querySelector("#lbl-x");
  var lblY = body.querySelector("#lbl-y");
  var note = body.querySelector("#sahna1-note");
  var tableEl = body.querySelector("#x2-table");
  var lastVals = {};

  var plane = BASE.createPlane(graf, {
    width: 320,
    height: 280,
    scale: 14,
    xRange: [-10, 10],
    yRange: [-2, 10]
  });

  var axisDash = document.createElementNS(BASE.svgNS, "line");
  axisDash.setAttribute("stroke", "#2b6b4f");
  axisDash.setAttribute("stroke-width", "1.6");
  axisDash.setAttribute("stroke-dasharray", "4 3");
  axisDash.setAttribute("x1", plane.ORIGIN_X);
  axisDash.setAttribute("x2", plane.ORIGIN_X);
  axisDash.setAttribute("y1", 8);
  axisDash.setAttribute("y2", plane.H - 8);
  graf.appendChild(axisDash);

  var curvePath = document.createElementNS(BASE.svgNS, "path");
  curvePath.setAttribute("fill", "none");
  curvePath.setAttribute("stroke", "#c24b2a");
  curvePath.setAttribute("stroke-width", "2.4");
  curvePath.setAttribute("stroke-linecap", "round");
  graf.appendChild(curvePath);

  var bridge = document.createElementNS(BASE.svgNS, "line");
  bridge.setAttribute("stroke", "#b8872b");
  bridge.setAttribute("stroke-width", "1.2");
  bridge.setAttribute("stroke-dasharray", "3 3");
  graf.appendChild(bridge);

  function makeDot(fill) {
    var c = document.createElementNS(BASE.svgNS, "circle");
    c.setAttribute("r", "5");
    c.setAttribute("fill", fill);
    c.setAttribute("stroke", "#fbf8f1");
    c.setAttribute("stroke-width", "1.4");
    graf.appendChild(c);
    return c;
  }

  var fixedDots = {};
  [-3, -2, -1, 0, 1, 2, 3].forEach(function (px) {
    var d = makeDot("#4a554c");
    d.setAttribute("r", "3.2");
    d.setAttribute("cx", plane.toX(px));
    d.setAttribute("cy", plane.toY(px * px));
    d.setAttribute("opacity", "0.35");
    fixedDots[px] = d;
  });

  var dotL = makeDot("#2b6b4f");
  var dotR = makeDot("#c24b2a");
  var vertex = makeDot("#b8872b");
  vertex.setAttribute("cx", plane.toX(0));
  vertex.setAttribute("cy", plane.toY(0));
  vertex.setAttribute("r", "4.2");

  var labAxis = document.createElementNS(BASE.svgNS, "text");
  labAxis.setAttribute("x", plane.ORIGIN_X + 6);
  labAxis.setAttribute("y", 22);
  labAxis.setAttribute("fill", "#2b6b4f");
  labAxis.setAttribute("font-size", "10");
  labAxis.textContent = "simmetriya o'qi";
  graf.appendChild(labAxis);

  var labUch = document.createElementNS(BASE.svgNS, "text");
  labUch.setAttribute("x", plane.toX(0) + 8);
  labUch.setAttribute("y", plane.toY(0) + 16);
  labUch.setAttribute("fill", "#b8872b");
  labUch.setAttribute("font-size", "10");
  labUch.textContent = "uch (0; 0)";
  graf.appendChild(labUch);

  function fmt(n) {
    var r = Math.round(n * 100) / 100;
    return String(r);
  }

  tableEl.innerHTML =
    "<table><thead><tr><th>x</th><th>−3</th><th>−2</th><th>−1</th><th>0</th><th>1</th><th>2</th><th>3</th></tr></thead>" +
    "<tbody><tr><th>y = x²</th><td>9</td><td>4</td><td>1</td><td>0</td><td>1</td><td>4</td><td>9</td></tr></tbody></table>";

  var headCells = tableEl.querySelectorAll("thead th");
  var bodyCells = tableEl.querySelectorAll("tbody td");

  function highlightTable(x) {
    var idx = null;
    if (Math.abs(x - Math.round(x)) < 0.001) {
      var xi = Math.round(x);
      if (xi >= -3 && xi <= 3) idx = xi + 3;
    }
    for (var i = 0; i < bodyCells.length; i++) {
      var on = idx === i;
      bodyCells[i].classList.toggle("is-on", on);
      if (headCells[i + 1]) headCells[i + 1].classList.toggle("is-on", on);
    }
    [-3, -2, -1, 0, 1, 2, 3].forEach(function (px) {
      var active = idx !== null && (px === Math.round(x) || px === -Math.round(x));
      fixedDots[px].setAttribute("opacity", active ? "1" : "0.35");
      fixedDots[px].setAttribute("r", active ? "4.4" : "3.2");
    });
  }

  var d = "";
  var xMin = -4.6, xMax = 4.6, step = 0.12;
  for (var t = xMin; t <= xMax; t += step) {
    var yy = t * t;
    var py = plane.toY(yy);
    if (py < -20) py = -20;
    if (py > plane.H + 20) py = plane.H + 20;
    d += (t === xMin ? "M" : "L") + plane.toX(t).toFixed(1) + "," + py.toFixed(1) + " ";
  }
  curvePath.setAttribute("d", d);

  function render() {
    var x = parseFloat(slideX.value);
    var y = x * x;
    var nx = -x;

    outX.textContent = fmt(x);
    lblX.textContent = fmt(x);
    lblY.textContent = fmt(y);
    BASE.pulse(lblX, lastVals, "x", x);
    BASE.pulse(lblY, lastVals, "y", y);

    var px = plane.toX(x);
    var pnx = plane.toX(nx);
    var py = plane.toY(y);

    dotR.setAttribute("cx", px);
    dotR.setAttribute("cy", py);
    dotL.setAttribute("cx", pnx);
    dotL.setAttribute("cy", py);

    if (Math.abs(x) < 0.001) {
      bridge.setAttribute("opacity", "0");
      dotL.setAttribute("opacity", "0");
    } else {
      bridge.setAttribute("opacity", "1");
      dotL.setAttribute("opacity", "1");
      bridge.setAttribute("x1", pnx);
      bridge.setAttribute("y1", py);
      bridge.setAttribute("x2", px);
      bridge.setAttribute("y2", py);
    }

    highlightTable(x);

    var key = Math.abs(x) < 0.001 ? "zero" : "side";
    BASE.applyNote(note, cfg.notes, key, { x: fmt(x), nx: fmt(nx), y: fmt(y) });
  }

  render();
  slideX.addEventListener("input", render);
  BASE.bindScrub(lblX, slideX, { ariaLabel: "x qiymati" });
};
