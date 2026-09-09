/**
 * "ineq-parabola" sahna turi — kvadrat tengsizlikni grafik bilan yechish.
 * y = ax² + bx + c grafigi + ishora tanlash (>0, <0, ≥0, ≤0).
 * Yechim oralig'i Ox o'qida bo'yaladi, ildizlar belgilanadi.
 *
 * Config (data.json "sahna"):
 *   vars.a / vars.b / vars.c — slayderlar
 *   ineq — boshlang'ich ishora: "lt" | "gt" | "le" | "ge"  (default "lt")
 *   notes — ixtiyoriy
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["ineq-parabola"] = function (stage, cfg) {
  "use strict";

  var BASE = window.KA_SAHNA_BASE;
  var va = cfg.vars.a, vb = cfg.vars.b, vc = cfg.vars.c;
  var ineq0 = cfg.ineq || "lt";

  var body = document.createElement("div");
  body.className = "sahna1-grid sahna-ineq";

  body.innerHTML =
    '<p class="sahna1-formula">' +
      'y&nbsp;=&nbsp;<span class="term-a term-value" id="lbl-a">' + va.value + '</span>x²&nbsp;+&nbsp;' +
      '<span class="term-b term-value" id="lbl-b">' + vb.value + '</span>x&nbsp;+&nbsp;' +
      '<span class="term-c term-value" id="lbl-c">' + vc.value + '</span>' +
      '&nbsp;<span id="ineq-sign" class="ineq-sign">&lt; 0</span>' +
    '</p>' +
    '<p class="sahna1-hint">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12h8"></path><path d="M13 7l5 5-5 5"></path></svg>' +
      (cfg.hint || "Ishorani tanlang — yechim oralig'i Ox da yonadi") +
    '</p>' +
    '<div class="ineq-btns" role="group" aria-label="Tengsizlik ishorasi">' +
      '<button type="button" class="ineq-btn" data-ineq="lt" aria-pressed="false">&lt; 0</button>' +
      '<button type="button" class="ineq-btn" data-ineq="le" aria-pressed="false">≤ 0</button>' +
      '<button type="button" class="ineq-btn" data-ineq="gt" aria-pressed="false">&gt; 0</button>' +
      '<button type="button" class="ineq-btn" data-ineq="ge" aria-pressed="false">≥ 0</button>' +
    '</div>' +
    '<svg class="sahna1-graf" id="graf" viewBox="0 0 320 260" role="img" aria-label="Parabola va yechim oralig\'i" preserveAspectRatio="xMidYMid meet"></svg>' +
    '<p class="sahna1-note" id="sahna1-note" aria-live="polite"></p>' +
    '<div class="sahna1-controls controls">' +
      '<div class="control">' +
        '<label for="slide-a"><span>a</span> <small class="control-desc">— ' + (va.desc || "tarmoqlar") + '</small></label>' +
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
  var signEl = body.querySelector("#ineq-sign");
  var btns = body.querySelectorAll(".ineq-btn");
  var currentIneq = ineq0;
  var lastVals = {};

  var plane = BASE.createPlane(graf, { width: 320, height: 260, scale: 16 });

  // Shading on Ox (solution intervals) — after axes, before curve
  var shadeGroup = document.createElementNS(BASE.svgNS, "g");
  shadeGroup.setAttribute("class", "ineq-shade");
  graf.appendChild(shadeGroup);

  var curvePath = document.createElementNS(BASE.svgNS, "path");
  curvePath.setAttribute("fill", "none");
  curvePath.setAttribute("stroke-width", "2.4");
  curvePath.setAttribute("stroke-linecap", "round");
  graf.appendChild(curvePath);

  var rootDots = document.createElementNS(BASE.svgNS, "g");
  graf.appendChild(rootDots);

  function fmtRoot(x) {
    if (Math.abs(x - Math.round(x)) < 1e-6) return String(Math.round(x));
    // simple fraction-ish
    var r = Math.round(x * 100) / 100;
    return String(r);
  }

  function setIneq(key) {
    currentIneq = key;
    var labels = { lt: "&lt; 0", le: "≤ 0", gt: "&gt; 0", ge: "≥ 0" };
    signEl.innerHTML = labels[key] || "&lt; 0";
    btns.forEach(function (b) {
      var on = b.getAttribute("data-ineq") === key;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("is-active", on);
    });
    render();
  }

  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      setIneq(b.getAttribute("data-ineq"));
    });
  });

  function solveRoots(a, b, c) {
    if (Math.abs(a) < 1e-9) return { kind: "linear", roots: [] };
    var D = b * b - 4 * a * c;
    if (D < -1e-9) return { kind: "none", roots: [], D: D };
    if (Math.abs(D) < 1e-9) {
      var r = -b / (2 * a);
      return { kind: "one", roots: [r], D: 0 };
    }
    var s = Math.sqrt(D);
    var r1 = (-b - s) / (2 * a);
    var r2 = (-b + s) / (2 * a);
    if (r1 > r2) { var t = r1; r1 = r2; r2 = t; }
    return { kind: "two", roots: [r1, r2], D: D };
  }

  function describeSolution(a, rootsInfo, ineq) {
    var roots = rootsInfo.roots;
    var open = (ineq === "lt" || ineq === "gt");
    var above = (ineq === "gt" || ineq === "ge"); // y > 0 or ≥
    // For parabola: if a>0, y>0 outside roots; if a<0, y>0 between roots
    var posOutside = a > 0;

    if (rootsInfo.kind === "none") {
      // never crosses: sign of a
      if (a > 0) {
        // always positive
        if (above) return "Barcha haqiqiy x (ℝ)";
        return "Yechim yo‘q (∅)";
      } else {
        // always negative
        if (above) return "Yechim yo‘q (∅)";
        return "Barcha haqiqiy x (ℝ)";
      }
    }
    if (rootsInfo.kind === "one") {
      var r = roots[0];
      var rf = fmtRoot(r);
      if (open) {
        // strict: single root never satisfies y=0, and same sign elsewhere
        if (a > 0) {
          return above ? "x ≠ " + rf + " (barcha x, uchi tashqari)" : "Yechim yo‘q (∅)";
        } else {
          return above ? "Yechim yo‘q (∅)" : "x ≠ " + rf;
        }
      } else {
        // non-strict includes the root
        if (a > 0) {
          return above ? "Barcha haqiqiy x (ℝ)" : "x = " + rf;
        } else {
          return above ? "x = " + rf : "Barcha haqiqiy x (ℝ)";
        }
      }
    }
    // two roots
    var r1 = roots[0], r2 = roots[1];
    var a1 = fmtRoot(r1), a2 = fmtRoot(r2);
    var left = open ? "(" : "[";
    var right = open ? ")" : "]";
    var between = left + a1 + "; " + a2 + right;
    var outside = "(-∞; " + a1 + (open ? ")" : "]") + " ∪ " + (open ? "(" : "[") + a2 + "; +∞)";

    if (posOutside) {
      // a>0: positive outside, negative between
      return above ? outside : between;
    } else {
      // a<0: positive between, negative outside
      return above ? between : outside;
    }
  }

  function clearChildren(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
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

    // curve
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
    curvePath.setAttribute("stroke", a === 0 ? "#5b6e8c" : (a > 0 ? "#c24b2a" : "#2a6bc2"));

    // roots + shade
    clearChildren(shadeGroup);
    clearChildren(rootDots);

    var info = solveRoots(a, b, c);
    var oy = plane.toY(0);
    var shadeColor = "rgba(194, 75, 42, 0.28)";
    var thick = 10;

    function addBar(x1, x2) {
      var rect = document.createElementNS(BASE.svgNS, "rect");
      var px1 = plane.toX(x1), px2 = plane.toX(x2);
      if (px1 > px2) { var t = px1; px1 = px2; px2 = t; }
      rect.setAttribute("x", px1);
      rect.setAttribute("y", oy - thick / 2);
      rect.setAttribute("width", Math.max(2, px2 - px1));
      rect.setAttribute("height", thick);
      rect.setAttribute("rx", "3");
      rect.setAttribute("fill", shadeColor);
      shadeGroup.appendChild(rect);
    }

    function addDot(rx, filled) {
      var circ = document.createElementNS(BASE.svgNS, "circle");
      circ.setAttribute("cx", plane.toX(rx));
      circ.setAttribute("cy", oy);
      circ.setAttribute("r", "5");
      circ.setAttribute("fill", filled ? "#c24b2a" : "#f3eee4");
      circ.setAttribute("stroke", "#c24b2a");
      circ.setAttribute("stroke-width", "2");
      rootDots.appendChild(circ);
    }

    var open = (currentIneq === "lt" || currentIneq === "gt");
    var above = (currentIneq === "gt" || currentIneq === "ge");
    var posOutside = a > 0;

    if (info.kind === "two") {
      var r1 = info.roots[0], r2 = info.roots[1];
      addDot(r1, !open);
      addDot(r2, !open);
      if (posOutside) {
        if (above) {
          addBar(-9.5, r1);
          addBar(r2, 9.5);
        } else {
          addBar(r1, r2);
        }
      } else {
        if (above) {
          addBar(r1, r2);
        } else {
          addBar(-9.5, r1);
          addBar(r2, 9.5);
        }
      }
    } else if (info.kind === "one") {
      var r = info.roots[0];
      addDot(r, !open);
      // always positive (a>0) or always negative (a<0) except at root
      if (a > 0) {
        if (above) {
          addBar(-9.5, r - 0.01);
          addBar(r + 0.01, 9.5);
          if (!open) addBar(r - 0.15, r + 0.15);
        } else if (!open) {
          addBar(r - 0.15, r + 0.15);
        }
      } else {
        if (!above) {
          addBar(-9.5, r - 0.01);
          addBar(r + 0.01, 9.5);
          if (!open) addBar(r - 0.15, r + 0.15);
        } else if (!open) {
          addBar(r - 0.15, r + 0.15);
        }
      }
    } else if (info.kind === "none") {
      var alwaysPos = a > 0;
      if ((alwaysPos && above) || (!alwaysPos && !above)) {
        addBar(-9.5, 9.5);
      }
    }

    var sol = describeSolution(a, info, currentIneq);
    var dir = a > 0 ? "tarmoqlar yuqoriga" : (a < 0 ? "tarmoqlar pastga" : "chiziq");
    note.innerHTML =
      "<strong>Yechim:</strong> " + sol +
      " <span class=\"note-meta\">(" + dir + (info.kind === "two" ? ", 2 ildiz" : info.kind === "one" ? ", 1 ildiz" : ", ildiz yo‘q") + ")</span>";
  }

  setIneq(currentIneq);
  [slideA, slideB, slideC].forEach(function (el) {
    el.addEventListener("input", render);
  });
  BASE.bindScrub(lblA, slideA, { ariaLabel: "a qiymati" });
  BASE.bindScrub(lblB, slideB, { ariaLabel: "b qiymati" });
  BASE.bindScrub(lblC, slideC, { ariaLabel: "c qiymati" });
};
