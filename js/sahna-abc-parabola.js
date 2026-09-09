/**
 * "abc-parabola" sahna turi — y = ax² + bx + c, a/b/c slayderlari + jonli grafik.
 * Config (data.json'dagi "sahna" obyekti) orqali boshqariladi, shuning uchun
 * 1-§ bilan bir xil chizmani boshqa darslar ham (masalan 2-§, 3-§, 4-§) turli
 * boshlang'ich qiymat/oraliqlar bilan qayta ishlatishi mumkin.
 */
window.KA_SAHNA = window.KA_SAHNA || {};

window.KA_SAHNA["abc-parabola"] = function (stage, cfg) {
  "use strict";

  var svgNS = "http://www.w3.org/2000/svg";
  var W = 320, H = 260;
  var ORIGIN_X = W / 2, ORIGIN_Y = H / 2;
  var SCALE = 16; // 1 birlik = 16px

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
  var lastVals = { a: null, b: null, c: null };

  function fmt(n) {
    if (n === 0) return "0";
    var r = Math.round(n * 100) / 100;
    return (r > 0 ? "+" + r : String(r));
  }

  function toX(x) { return ORIGIN_X + x * SCALE; }
  function toY(y) { return ORIGIN_Y - y * SCALE; }

  function pulse(el, key, val) {
    if (lastVals[key] !== null && lastVals[key] !== val) {
      el.classList.remove("is-pulse");
      void el.offsetWidth; // reflow — animatsiyani qayta ishga tushirish uchun
      el.classList.add("is-pulse");
    }
    lastVals[key] = val;
  }

  // Formuladagi raqamlarni surib (yoki bosib) o'zgartirish — slayder bilan bir xil natija
  function bindScrub(el, slider) {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "slider");
    el.setAttribute("aria-label", (slider.id === "slide-a" ? "a" : slider.id === "slide-b" ? "b" : "c") + " qiymati");
    el.setAttribute("aria-valuemin", slider.min);
    el.setAttribute("aria-valuemax", slider.max);

    var dragging = false, startX = 0, startY = 0, startVal = 0;
    var PX_PER_STEP = 14;

    function step() { return parseFloat(slider.step) || 1; }

    function setVal(v) {
      var min = parseFloat(slider.min), max = parseFloat(slider.max), st = step();
      v = Math.round(v / st) * st;
      v = Math.max(min, Math.min(max, v));
      v = Math.round(v * 100) / 100;
      if (parseFloat(slider.value) !== v) {
        slider.value = v;
        slider.dispatchEvent(new Event("input", { bubbles: true }));
      }
      el.setAttribute("aria-valuenow", v);
    }

    el.addEventListener("pointerdown", function (e) {
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startVal = parseFloat(slider.value);
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      el.classList.add("is-dragging");
    });

    el.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      setVal(startVal + (dx / PX_PER_STEP) * step());
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-dragging");
    }
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    el.addEventListener("keydown", function (e) {
      var cur = parseFloat(slider.value);
      if (e.key === "ArrowRight" || e.key === "ArrowUp") { setVal(cur + step()); e.preventDefault(); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { setVal(cur - step()); e.preventDefault(); }
      else if (e.key === "Home") { setVal(parseFloat(slider.min)); e.preventDefault(); }
      else if (e.key === "End") { setVal(parseFloat(slider.max)); e.preventDefault(); }
    });

    el.setAttribute("aria-valuenow", slider.value);
  }

  function buildAxes() {
    var frag = document.createDocumentFragment();

    for (var gx = -9; gx <= 9; gx++) {
      var lx = document.createElementNS(svgNS, "line");
      lx.setAttribute("x1", toX(gx)); lx.setAttribute("y1", 0);
      lx.setAttribute("x2", toX(gx)); lx.setAttribute("y2", H);
      lx.setAttribute("stroke", "#d7cfc0"); lx.setAttribute("stroke-width", gx === 0 ? 0 : 0.5);
      frag.appendChild(lx);
    }
    for (var gy = -7; gy <= 7; gy++) {
      var ly = document.createElementNS(svgNS, "line");
      ly.setAttribute("x1", 0); ly.setAttribute("y1", toY(gy));
      ly.setAttribute("x2", W); ly.setAttribute("y2", toY(gy));
      ly.setAttribute("stroke", "#d7cfc0"); ly.setAttribute("stroke-width", gy === 0 ? 0 : 0.5);
      frag.appendChild(ly);
    }

    var axX = document.createElementNS(svgNS, "line");
    axX.setAttribute("x1", 0); axX.setAttribute("y1", ORIGIN_Y);
    axX.setAttribute("x2", W); axX.setAttribute("y2", ORIGIN_Y);
    axX.setAttribute("stroke", "#4a554c"); axX.setAttribute("stroke-width", "1.2");
    frag.appendChild(axX);

    var axY = document.createElementNS(svgNS, "line");
    axY.setAttribute("x1", ORIGIN_X); axY.setAttribute("y1", 0);
    axY.setAttribute("x2", ORIGIN_X); axY.setAttribute("y2", H);
    axY.setAttribute("stroke", "#4a554c"); axY.setAttribute("stroke-width", "1.2");
    frag.appendChild(axY);

    var labX = document.createElementNS(svgNS, "text");
    labX.setAttribute("x", W - 12); labX.setAttribute("y", ORIGIN_Y - 6);
    labX.setAttribute("fill", "#4a554c"); labX.setAttribute("font-size", "11");
    labX.textContent = "x";
    frag.appendChild(labX);

    var labY = document.createElementNS(svgNS, "text");
    labY.setAttribute("x", ORIGIN_X + 6); labY.setAttribute("y", 12);
    labY.setAttribute("fill", "#4a554c"); labY.setAttribute("font-size", "11");
    labY.textContent = "y";
    frag.appendChild(labY);

    graf.appendChild(frag);
  }

  var curvePath = document.createElementNS(svgNS, "path");
  curvePath.setAttribute("fill", "none");
  curvePath.setAttribute("stroke-width", "2.4");
  curvePath.setAttribute("stroke-linecap", "round");

  function applyNote(a, b, c) {
    var notes = cfg.notes || {};
    var tpl;
    if (a === 0) tpl = notes.zero;
    else if (a > 0) tpl = notes.positive;
    else tpl = notes.negative;
    if (!tpl) { note.textContent = ""; return; }
    note.textContent = tpl
      .replace(/\{a\}/g, a).replace(/\{b\}/g, b).replace(/\{c\}/g, c);
  }

  function render() {
    var a = parseFloat(slideA.value);
    var b = parseFloat(slideB.value);
    var c = parseFloat(slideC.value);

    outA.textContent = a; outB.textContent = b; outC.textContent = c;
    lblA.textContent = a; lblB.textContent = fmt(b).replace(/^\+/, "+"); lblC.textContent = fmt(c);

    pulse(lblA, "a", a); pulse(lblB, "b", b); pulse(lblC, "c", c);

    var d = "";
    var xMin = -9, xMax = 9, step = 0.25;
    for (var x = xMin; x <= xMax; x += step) {
      var y = a * x * x + b * x + c;
      var py = toY(y);
      if (py < -40) py = -40;
      if (py > H + 40) py = H + 40;
      d += (x === xMin ? "M" : "L") + toX(x).toFixed(1) + "," + py.toFixed(1) + " ";
    }
    curvePath.setAttribute("d", d);
    curvePath.setAttribute("stroke", a === 0 ? "#5b6e8c" : "#c24b2a");

    applyNote(a, b, c);
  }

  buildAxes();
  graf.appendChild(curvePath);
  render();

  [slideA, slideB, slideC].forEach(function (elx) { elx.addEventListener("input", render); });

  bindScrub(lblA, slideA);
  bindScrub(lblB, slideB);
  bindScrub(lblC, slideC);
};
