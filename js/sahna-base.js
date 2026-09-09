/**
 * sahna-base.js — barcha "sahna" turlari uchun UMUMIY grafik mator.
 *
 * Nega bu fayl bor: sahna-abc-parabola.js'da ishlab, sinalgan (1-darsda
 * ishlaydigan) koddan olindi — bu TAXMIN emas, REAL ishlaydigan koddan
 * ajratib olingan umumiylik. Bunda 3 ta narsa bor, chunki aynan shular
 * "n ta slayder + koordinata tekisligi + jonli grafik" turidagi HAR
 * QANDAY sahnada takrorlanadi (parabola, trig doira, progressiya —
 * formulasi boshqa, lekin slayder/SVG mexanikasi bir xil):
 *
 *   1. SVG koordinata tizimi — KA_SAHNA_BASE.createPlane(svg, opts)
 *      Grid chizadi, toX/toY konvertatsiya funksiyalarini qaytaradi.
 *
 *   2. Slider + label bog'lash (drag/klaviatura bilan "scrub" qilish) —
 *      KA_SAHNA_BASE.bindScrub(labelEl, sliderEl)
 *      Formula ichidagi raqamni sichqoncha bilan surish yoki strelka
 *      tugmalari bilan o'zgartirish — parabolada qanday ishlagan bo'lsa,
 *      xuddi shunday.
 *
 *   3. cfg.notes shablon almashtirish — KA_SAHNA_BASE.applyNote(el, notes, key, vars)
 *      "{a}", "{b}" kabi joy-belgilarni haqiqiy qiymat bilan almashtiradi.
 *
 * NIMA BU YERGA KIRMAYDI (ataylab): formula-ga xos hisoblash (masalan
 * y = ax²+bx+c yoki x = cos(t), y = sin(t)) — bu HAR sahna turida BOSHQA,
 * shuning uchun umumiylashtirilmaydi. Har bir sahna-*.js o'z formulasini
 * o'zi yozadi, faqat DOM/SVG mexanikasini shu fayldan oladi.
 *
 * Yangi sahna turi yozayotganda: avval shu faylning funksiyalaridan
 * foydalanib bo'ladimi tekshiring. Agar sahnangizga mos kelmaydigan
 * YANGI umumiy pattern chiqsa (masalan doiraviy harakat, ustunli
 * diagramma) — uni ham shu faylga qo'shing, lekin FAQAT kamida 2 ta
 * sahna turi shu patterndan foydalansa (bitta misoldan umumiylashtirish
 * yo'q — bu "poydevor" hujjatidagi asosiy qoida).
 */
window.KA_SAHNA_BASE = (function () {
  "use strict";

  var svgNS = "http://www.w3.org/2000/svg";

  // ---- 1. Koordinata tekisligi ----
  //
  // opts: { width, height, scale, xRange:[min,max], yRange:[min,max], gridColor, axisColor }
  // Qaytaradi: { toX(x), toY(y), svg }  — svg allaqachon grid+o'qlar bilan to'ldirilgan.
  function createPlane(svgEl, opts) {
    opts = opts || {};
    var W = opts.width || 320, H = opts.height || 260;
    var SCALE = opts.scale || 16;
    var ORIGIN_X = W / 2, ORIGIN_Y = H / 2;
    var xRange = opts.xRange || [-9, 9];
    var yRange = opts.yRange || [-7, 7];
    var gridColor = opts.gridColor || "#d7cfc0";
    var axisColor = opts.axisColor || "#4a554c";

    function toX(x) { return ORIGIN_X + x * SCALE; }
    function toY(y) { return ORIGIN_Y - y * SCALE; }

    var frag = document.createDocumentFragment();

    for (var gx = xRange[0]; gx <= xRange[1]; gx++) {
      var lx = document.createElementNS(svgNS, "line");
      lx.setAttribute("x1", toX(gx)); lx.setAttribute("y1", 0);
      lx.setAttribute("x2", toX(gx)); lx.setAttribute("y2", H);
      lx.setAttribute("stroke", gridColor); lx.setAttribute("stroke-width", gx === 0 ? 0 : 0.5);
      frag.appendChild(lx);
    }
    for (var gy = yRange[0]; gy <= yRange[1]; gy++) {
      var ly = document.createElementNS(svgNS, "line");
      ly.setAttribute("x1", 0); ly.setAttribute("y1", toY(gy));
      ly.setAttribute("x2", W); ly.setAttribute("y2", toY(gy));
      ly.setAttribute("stroke", gridColor); ly.setAttribute("stroke-width", gy === 0 ? 0 : 0.5);
      frag.appendChild(ly);
    }

    var axX = document.createElementNS(svgNS, "line");
    axX.setAttribute("x1", 0); axX.setAttribute("y1", ORIGIN_Y);
    axX.setAttribute("x2", W); axX.setAttribute("y2", ORIGIN_Y);
    axX.setAttribute("stroke", axisColor); axX.setAttribute("stroke-width", "1.2");
    frag.appendChild(axX);

    var axY = document.createElementNS(svgNS, "line");
    axY.setAttribute("x1", ORIGIN_X); axY.setAttribute("y1", 0);
    axY.setAttribute("x2", ORIGIN_X); axY.setAttribute("y2", H);
    axY.setAttribute("stroke", axisColor); axY.setAttribute("stroke-width", "1.2");
    frag.appendChild(axY);

    if (opts.labelX !== false) {
      var labX = document.createElementNS(svgNS, "text");
      labX.setAttribute("x", W - 12); labX.setAttribute("y", ORIGIN_Y - 6);
      labX.setAttribute("fill", axisColor); labX.setAttribute("font-size", "11");
      labX.textContent = opts.labelX || "x";
      frag.appendChild(labX);
    }
    if (opts.labelY !== false) {
      var labY = document.createElementNS(svgNS, "text");
      labY.setAttribute("x", ORIGIN_X + 6); labY.setAttribute("y", 12);
      labY.setAttribute("fill", axisColor); labY.setAttribute("font-size", "11");
      labY.textContent = opts.labelY || "y";
      frag.appendChild(labY);
    }

    svgEl.appendChild(frag);

    return { toX: toX, toY: toY, W: W, H: H, ORIGIN_X: ORIGIN_X, ORIGIN_Y: ORIGIN_Y, SCALE: SCALE };
  }

  // ---- 2. Slider <-> label scrub bog'lash ----
  //
  // labelEl ustida drag/klaviatura bilan qiymatni o'zgartiradi, va sliderEl'ga
  // "input" eventini yuboradi (shuning uchun chaqiruvchi kod slider.addEventListener("input", ...)
  // bilan render qilaverishi mumkin — ikkalasi ham bir xil yo'ldan o'zgaradi).
  function bindScrub(labelEl, sliderEl, opts) {
    opts = opts || {};
    if (!labelEl || !sliderEl) return;

    // min===max bo'lsa scrub foydasiz — bog'lamaymiz
    if (parseFloat(sliderEl.min) === parseFloat(sliderEl.max)) return;

    labelEl.setAttribute("tabindex", "0");
    labelEl.setAttribute("role", "slider");
    if (opts.ariaLabel) labelEl.setAttribute("aria-label", opts.ariaLabel);
    labelEl.setAttribute("aria-valuemin", sliderEl.min);
    labelEl.setAttribute("aria-valuemax", sliderEl.max);

    var dragging = false, startX = 0, startVal = 0, activePointer = null;
    var PX_PER_STEP = opts.pxPerStep || 14;

    function step() { return parseFloat(sliderEl.step) || 1; }

    function setVal(v) {
      var min = parseFloat(sliderEl.min), max = parseFloat(sliderEl.max), st = step();
      if (!isFinite(min) || !isFinite(max)) return;
      v = Math.round(v / st) * st;
      v = Math.max(min, Math.min(max, v));
      v = Math.round(v * 100) / 100;
      if (parseFloat(sliderEl.value) !== v) {
        sliderEl.value = v;
        try {
          sliderEl.dispatchEvent(new Event("input", { bubbles: true }));
        } catch (err) {
          // IE fallback yo'q — zamonaviy brauzerlar uchun yetarli
        }
      }
      labelEl.setAttribute("aria-valuenow", v);
    }

    labelEl.addEventListener("pointerdown", function (e) {
      if (e.button != null && e.button !== 0) return;
      e.preventDefault();
      dragging = true;
      activePointer = e.pointerId;
      startX = e.clientX;
      startVal = parseFloat(sliderEl.value) || 0;
      try { labelEl.setPointerCapture(e.pointerId); } catch (err) {}
      labelEl.classList.add("is-dragging");
    });

    labelEl.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      if (activePointer != null && e.pointerId !== activePointer) return;
      e.preventDefault();
      var dx = e.clientX - startX;
      setVal(startVal + (dx / PX_PER_STEP) * step());
    });

    function endDrag(e) {
      if (!dragging) return;
      if (e && activePointer != null && e.pointerId !== activePointer) return;
      dragging = false;
      activePointer = null;
      labelEl.classList.remove("is-dragging");
    }
    labelEl.addEventListener("pointerup", endDrag);
    labelEl.addEventListener("pointercancel", endDrag);
    labelEl.addEventListener("lostpointercapture", endDrag);

    labelEl.addEventListener("keydown", function (e) {
      var cur = parseFloat(sliderEl.value) || 0;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") { setVal(cur + step()); e.preventDefault(); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { setVal(cur - step()); e.preventDefault(); }
      else if (e.key === "Home") { setVal(parseFloat(sliderEl.min)); e.preventDefault(); }
      else if (e.key === "End") { setVal(parseFloat(sliderEl.max)); e.preventDefault(); }
    });

    labelEl.setAttribute("aria-valuenow", sliderEl.value);
  }

  // Qiymat o'zgarganda label'ga qisqa "pulse" animatsiyasi qo'shadi (CSS'da
  // .is-pulse klassi bo'lishi kerak). state — chaqiruvchi tomonidan saqlanadigan
  // { key: lastValue } obyekti (bir nechta label uchun umumiy foydalanish mumkin).
  function pulse(el, state, key, val) {
    if (state[key] !== undefined && state[key] !== null && state[key] !== val) {
      el.classList.remove("is-pulse");
      void el.offsetWidth; // reflow — animatsiyani qayta ishga tushirish uchun
      el.classList.add("is-pulse");
    }
    state[key] = val;
  }

  // ---- 3. Shablon eslatma (cfg.notes) ----
  //
  // notes — { key1: "matn {a} bilan", key2: "..." } ko'rinishidagi obyekt.
  // activeKey — hozir qaysi shablon ishlatilishi kerakligini chaqiruvchi kod hal qiladi
  // (masalan a===0 -> "zero", a>0 -> "positive"), chunki bu shart HAR sahnada boshqa.
  function applyNote(noteEl, notes, activeKey, vars) {
    var tpl = notes && notes[activeKey];
    if (!tpl) { noteEl.textContent = ""; return; }
    var text = tpl;
    for (var k in vars) {
      text = text.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
    }
    noteEl.textContent = text;
  }

  // Formatlash yordamchisi: musbat sonlarga "+" qo'shadi, manfiylarni o'zgartirmaydi.
  // Formula ko'rinishida (…+ b x + c) ishlatiladi.
  function fmtSigned(n) {
    if (n === 0) return "0";
    var r = Math.round(n * 100) / 100;
    return (r > 0 ? "+" + r : String(r));
  }

  return {
    svgNS: svgNS,
    createPlane: createPlane,
    bindScrub: bindScrub,
    pulse: pulse,
    applyNote: applyNote,
    fmtSigned: fmtSigned
  };
})();
