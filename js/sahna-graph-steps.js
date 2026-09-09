/**
 * "graph-steps" sahna turi — kvadrat funksiya grafigini 5 qadamda yasash.
 *
 * 5-§ g'oyasi: uchi → o'q → nollar → juft nuqtalar → chiziq.
 * a/b/c ni o'zgartirish 4-§ ishi; bu yerda bitta namuna (y = x² − 2x − 3)
 * qadam-qadam yonadi.
 *
 * Base: createPlane, bindScrub, pulse, applyNote.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["graph-steps"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  var vs = cfg.vars.step;
  var ex = cfg.example || { a: 1, b: -2, c: -3 };
  var a = ex.a, b = ex.b, c = ex.c;
  var xv = -b / (2 * a);
  var yv = a * xv * xv + b * xv + c;
  var D = b * b - 4 * a * c;
  var roots = [];
  if (D > 0) {
    var s = Math.sqrt(D);
    roots = [(-b - s) / (2 * a), (-b + s) / (2 * a)];
    roots.sort(function (p, q) { return p - q; });
  } else if (D === 0) {
    roots = [xv];
  }
  var extra = { x: 0, y: c };
  var extraPair = { x: 2 * xv - extra.x, y: extra.y };

  var names = ["", "Uch", "O'q", "Nollar", "Nuqtalar", "Chiziq"];

  var body = document.createElement("div");
  body.className = "sahna1-grid";

  function signed(n) {
    var r = Math.round(n * 100) / 100;
    if (r === 0) return "";
    return r > 0 ? " + " + r : " − " + Math.abs(r);
  }
  function coeffA(n) {
    var r = Math.round(n * 100) / 100;
    if (r === 1) return "";
    if (r === -1) return "−";
    return String(r);
  }

  body.innerHTML =
    '<p class="sahna1-formula">' +
      "y&nbsp;=&nbsp;" + coeffA(a) + "x²" + signed(b) + (b === 0 ? "" : "x") + signed(c) +
    "</p>" +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "") +
    "</p>" +
    '<div class="sahna-step-pills" id="step-pills" role="tablist" aria-label="Yasash qadamlari"></div>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 280" role="img" aria-label="Besh qadamda parabola yasash" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls sahna-x2-controls">' +
      '<div class="control">' +
        '<label for="slide-step"><span>qadam</span> <small class="control-desc">— ' + (vs.desc || "") + "</small></label>" +
        '<input type="range" id="slide-step" min="' + vs.min + '" max="' + vs.max + '" step="' + vs.step + '" value="' + vs.value + '">' +
        '<output id="out-step">' + vs.value + "</output>" +
      "</div>" +
    "</div>";

  stage.appendChild(body);

  var graf = body.querySelector("#graf");
  var slide = body.querySelector("#slide-step");
  var out = body.querySelector("#out-step");
  var note = body.querySelector("#sahna1-note");
  var pills = body.querySelector("#step-pills");
  var lastVals = {};

  for (var i = 1; i <= 5; i++) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sahna-step-pill";
    btn.setAttribute("data-step", String(i));
    btn.textContent = i + " · " + names[i];
    pills.appendChild(btn);
  }

  var plane = BASE.createPlane(graf, {
    width: 320,
    height: 280,
    scale: 22,
    xRange: [-6, 6],
    yRange: [-6, 6]
  });

  function svg(name, attrs) {
    var el = document.createElementNS(BASE.svgNS, name);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    graf.appendChild(el);
    return el;
  }

  var axis = svg("line", {
    x1: plane.toX(xv), y1: 10,
    x2: plane.toX(xv), y2: plane.H - 10,
    stroke: "#2b6b4f", "stroke-width": "1.6", "stroke-dasharray": "4 3"
  });
  var axisLab = svg("text", {
    x: plane.toX(xv) + 6, y: 20,
    fill: "#2b6b4f", "font-size": "10"
  });
  axisLab.textContent = "x = " + xv;

  var curve = svg("path", {
    fill: "none", stroke: "#c24b2a", "stroke-width": "2.4", "stroke-linecap": "round"
  });
  var d = "";
  for (var t = xv - 4.5; t <= xv + 4.5; t += 0.12) {
    var yy = a * t * t + b * t + c;
    var py = plane.toY(yy);
    if (py < -30) py = -30;
    if (py > plane.H + 30) py = plane.H + 30;
    d += (d === "" ? "M" : "L") + plane.toX(t).toFixed(1) + "," + py.toFixed(1) + " ";
  }
  curve.setAttribute("d", d);

  function dot(x, y, fill, r) {
    return svg("circle", {
      cx: plane.toX(x), cy: plane.toY(y), r: String(r || 5),
      fill: fill, stroke: "#fbf8f1", "stroke-width": "1.4"
    });
  }
  function lab(x, y, text, fill, dx, dy) {
    var el = svg("text", {
      x: plane.toX(x) + (dx || 8),
      y: plane.toY(y) + (dy || -8),
      fill: fill || "#1a221c",
      "font-size": "10"
    });
    el.textContent = text;
    return el;
  }

  var vDot = dot(xv, yv, "#b8872b", 5.2);
  var vLab = lab(xv, yv, "uch (" + xv + "; " + yv + ")", "#b8872b", 8, -10);

  var rootDots = roots.map(function (rx) { return dot(rx, 0, "#c24b2a", 5); });
  var rootLabs = roots.map(function (rx, idx) {
    return lab(rx, 0, "(" + rx + "; 0)", "#c24b2a", idx === 0 ? -46 : 8, 16);
  });

  var pC = dot(extra.x, extra.y, "#2b6b4f", 4.6);
  var pCLab = lab(extra.x, extra.y, "(0; " + extra.y + ")", "#2b6b4f", 8, 14);
  var pP = dot(extraPair.x, extraPair.y, "#2b6b4f", 4.6);
  var pPLab = lab(extraPair.x, extraPair.y, "(" + extraPair.x + "; " + extraPair.y + ")", "#2b6b4f", 8, 14);

  function show(el, on) {
    if (!el) return;
    el.setAttribute("opacity", on ? "1" : "0");
  }

  function render() {
    var step = parseInt(slide.value, 10);
    out.textContent = step + " / 5";
    BASE.pulse(out, lastVals, "step", step);

    show(vDot, step >= 1);
    show(vLab, step >= 1);
    show(axis, step >= 2);
    show(axisLab, step >= 2);
    rootDots.forEach(function (el) { show(el, step >= 3); });
    rootLabs.forEach(function (el) { show(el, step >= 3); });
    show(pC, step >= 4);
    show(pCLab, step >= 4);
    show(pP, step >= 4);
    show(pPLab, step >= 4);
    show(curve, step >= 5);

    [].forEach.call(pills.children, function (btn) {
      btn.classList.toggle("is-on", parseInt(btn.getAttribute("data-step"), 10) === step);
    });

    BASE.applyNote(note, cfg.notes, "s" + step, {
      xv: xv, yv: yv, c: c, px: extraPair.x, py: extraPair.y
    });
  }

  pills.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-step]");
    if (!btn) return;
    slide.value = btn.getAttribute("data-step");
    slide.dispatchEvent(new Event("input", { bubbles: true }));
  });

  render();
  slide.addEventListener("input", render);
};
