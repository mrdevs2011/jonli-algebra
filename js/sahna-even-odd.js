/**
 * "even-odd" — funksiyaning juftligi va toqligi.
 * Juft: y(-x)=y(x) — Oy ga simmetrik.
 * Toq: y(-x)=-y(x) — origoga simmetrik.
 * Chap tomon o'ngga "bukiladi" (nuqtalar jufti yonadi).
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["even-odd"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  if (!BASE) {
    stage.insertAdjacentHTML("beforeend", '<p class="sahna-fallback">Vizualizator asosi yuklanmadi. Sahifani yangilang.</p>');
    return;
  }
  var mode0 = cfg.mode || "even"; // even | odd | neither

  var examples = {
    even: { label: "y = x²", fn: function (x) { return x * x; }, kind: "even" },
    odd: { label: "y = x³ / 4", fn: function (x) { return (x * x * x) / 4; }, kind: "odd" },
    neither: { label: "y = x² + x", fn: function (x) { return x * x + x; }, kind: "neither" }
  };

  var body = document.createElement("div");
  body.className = "sahna1-grid sahna-evenodd";

  body.innerHTML =
    '<p class="sahna1-formula" id="eo-formula">' + examples[mode0].label + "</p>" +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "Turini tanlang — chap nuqta o‘ngga bukiladi") +
    "</p>" +
    '<div class="ineq-btns eo-btns" role="group" aria-label="Funksiya turi">' +
      '<button type="button" class="ineq-btn" data-mode="even" aria-pressed="false">Juft · y = x²</button>' +
      '<button type="button" class="ineq-btn" data-mode="odd" aria-pressed="false">Toq · y = x³</button>' +
      '<button type="button" class="ineq-btn" data-mode="neither" aria-pressed="false">Yo‘q · y = x²+x</button>' +
    "</div>" +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 260" role="img" aria-label="Juft/toq simmetriya" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-x"><span>x</span> <small class="control-desc">— tekshiruv nuqtasi</small></label>' +
        '<input type="range" id="slide-x" min="-3" max="3" step="0.25" value="1.5">' +
        '<output id="out-x">1.5</output>' +
      "</div>" +
    "</div>";

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var formula = body.querySelector("#eo-formula");
  var note = body.querySelector("#sahna1-note");
  var slideX = body.querySelector("#slide-x");
  var outX = body.querySelector("#out-x");
  var btns = body.querySelectorAll(".eo-btns .ineq-btn");
  var current = mode0;

  var plane = BASE.createPlane(graf, { width: 320, height: 260, scale: 28 });

  var curvePath = document.createElementNS(BASE.svgNS, "path");
  curvePath.setAttribute("fill", "none");
  curvePath.setAttribute("stroke-width", "2.4");
  curvePath.setAttribute("stroke-linecap", "round");
  curvePath.setAttribute("stroke", "#c24b2a");
  graf.appendChild(curvePath);

  var foldLine = document.createElementNS(BASE.svgNS, "line");
  foldLine.setAttribute("stroke", "#8a8478");
  foldLine.setAttribute("stroke-width", "1");
  foldLine.setAttribute("stroke-dasharray", "3 3");
  foldLine.setAttribute("opacity", "0.5");
  graf.appendChild(foldLine);

  var gPts = document.createElementNS(BASE.svgNS, "g");
  graf.appendChild(gPts);

  function setMode(m) {
    current = m;
    formula.textContent = examples[m].label;
    btns.forEach(function (b) {
      var on = b.getAttribute("data-mode") === m;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("is-active", on);
    });
    render();
  }

  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      setMode(b.getAttribute("data-mode"));
    });
  });

  function fmt(n) {
    var r = Math.round(n * 100) / 100;
    return String(r);
  }

  function render() {
    var ex = examples[current];
    var fn = ex.fn;
    var x = parseFloat(slideX.value);
    outX.textContent = fmt(x);

    // curve
    var d = "";
    var xMin = -4.2, xMax = 4.2, step = 0.08;
    for (var t = xMin; t <= xMax; t += step) {
      var y = fn(t);
      var py = plane.toY(y);
      if (py < -30) py = -30;
      if (py > plane.H + 30) py = plane.H + 30;
      d += (t === xMin ? "M" : "L") + plane.toX(t).toFixed(1) + "," + py.toFixed(1) + " ";
    }
    curvePath.setAttribute("d", d);

    // fold axis: Oy for even, nothing special for odd (origin)
    if (ex.kind === "even") {
      foldLine.setAttribute("x1", plane.toX(0));
      foldLine.setAttribute("x2", plane.toX(0));
      foldLine.setAttribute("y1", 4);
      foldLine.setAttribute("y2", plane.H - 4);
      foldLine.setAttribute("opacity", "0.6");
    } else {
      foldLine.setAttribute("opacity", "0.25");
      foldLine.setAttribute("x1", plane.toX(0));
      foldLine.setAttribute("x2", plane.toX(0));
      foldLine.setAttribute("y1", 4);
      foldLine.setAttribute("y2", plane.H - 4);
    }

    while (gPts.firstChild) gPts.removeChild(gPts.firstChild);

    function addDot(px, py, color, r) {
      var c = document.createElementNS(BASE.svgNS, "circle");
      c.setAttribute("cx", plane.toX(px));
      c.setAttribute("cy", plane.toY(py));
      c.setAttribute("r", r || 5);
      c.setAttribute("fill", color);
      c.setAttribute("stroke", "#f3eee4");
      c.setAttribute("stroke-width", "1.5");
      gPts.appendChild(c);
    }

    function addSeg(x1, y1, x2, y2, color) {
      var ln = document.createElementNS(BASE.svgNS, "line");
      ln.setAttribute("x1", plane.toX(x1));
      ln.setAttribute("y1", plane.toY(y1));
      ln.setAttribute("x2", plane.toX(x2));
      ln.setAttribute("y2", plane.toY(y2));
      ln.setAttribute("stroke", color);
      ln.setAttribute("stroke-width", "1.5");
      ln.setAttribute("stroke-dasharray", "4 3");
      ln.setAttribute("opacity", "0.7");
      gPts.appendChild(ln);
    }

    var y = fn(x);
    var xm = -x;
    var ym = fn(xm);

    // primary point
    addDot(x, y, "#c24b2a", 6);

    if (ex.kind === "even") {
      // mirror across Oy: (-x, y) should equal f(-x)
      addSeg(x, y, xm, y, "#2e7d5a");
      addDot(xm, y, "#2e7d5a", 6);
      var ok = Math.abs(ym - y) < 0.05;
      note.innerHTML =
        "Nuqta <strong>(" + fmt(x) + "; " + fmt(y) + ")</strong> → Oy bo‘ylab bukiladi: " +
        "<strong>(" + fmt(xm) + "; " + fmt(y) + ")</strong>. " +
        (ok
          ? "y(−x) = y(x) — <span class=\"mono-chip mono-inc\">juft</span>"
          : "Mos kelmadi");
    } else if (ex.kind === "odd") {
      // origin symmetry: (-x, -y)
      addSeg(x, y, xm, -y, "#2a6bc2");
      addDot(xm, -y, "#2a6bc2", 6);
      // also show actual f(-x)
      if (Math.abs(ym + y) > 0.05) {
        addDot(xm, ym, "#8a8478", 4);
      }
      var ok2 = Math.abs(ym + y) < 0.08;
      note.innerHTML =
        "Nuqta <strong>(" + fmt(x) + "; " + fmt(y) + ")</strong> → origoga nisbatan: " +
        "<strong>(" + fmt(xm) + "; " + fmt(-y) + ")</strong>. " +
        (ok2
          ? "y(−x) = −y(x) — <span class=\"mono-chip mono-inc\">toq</span>"
          : "Mos kelmadi");
    } else {
      addDot(xm, ym, "#8a8478", 6);
      addSeg(x, y, xm, ym, "#8a8478");
      note.innerHTML =
        "y(x) = " + fmt(y) + ", y(−x) = " + fmt(ym) + ". " +
        "y(−x) ≠ y(x) va y(−x) ≠ −y(x) — <span class=\"mono-chip mono-dec\">juft ham, toq ham emas</span>";
    }
  }

  setMode(current);
  slideX.addEventListener("input", render);
};
