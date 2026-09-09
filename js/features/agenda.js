// Dars rejasi — 45 daqiqalik taymer va bosqichlar
// Har bir dars sahifasida #agenda ichida qayta ishlatiladi.
// MUHIM: qadamlar dars-render.js tomonidan keyin chiziladi, shuning
// uchun bu fayl DARHOL ishlamaydi — window.KA_AGENDA.init() chaqiriladi.
(function () {
  "use strict";

  var state = null;

  function fmt(sec) {
    if (sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? "0" + m : String(m)) + ":" + (s < 10 ? "0" + s : String(s));
  }

  function bindStepClicks() {
    if (!state) return;
    state.steps.forEach(function (li, i) {
      if (li.getAttribute("data-agenda-bound") === "1") return;
      li.setAttribute("data-agenda-bound", "1");
      li.addEventListener("click", function () {
        state.remaining = state.total - state.boundaries[i].start;
        paintClock();
        paintSteps();
      });
      li.style.cursor = "pointer";
    });
  }

  function readSteps() {
    var stepsEl = document.getElementById("agendaSteps");
    var steps = stepsEl
      ? Array.prototype.slice.call(stepsEl.querySelectorAll("li"))
      : [];
    var total = steps.reduce(function (sum, li) {
      return sum + (parseInt(li.getAttribute("data-min"), 10) || 0) * 60;
    }, 0);
    if (!total) total = 45 * 60;
    var cumulative = 0;
    var boundaries = steps.map(function (li) {
      var start = cumulative;
      cumulative += (parseInt(li.getAttribute("data-min"), 10) || 0) * 60;
      return { start: start, end: cumulative };
    });
    return { steps: steps, total: total, boundaries: boundaries };
  }

  function paintSteps() {
    if (!state) return;
    var el = state.total - state.remaining;
    state.boundaries.forEach(function (b, i) {
      var li = state.steps[i];
      if (!li) return;
      li.classList.remove("is-active", "is-done");
      if (el >= b.end) li.classList.add("is-done");
      else if (el >= b.start && el < b.end) li.classList.add("is-active");
    });
  }

  function paintClock() {
    if (!state || !state.clockEl) return;
    state.clockEl.textContent = fmt(state.remaining);
    if (state.timerBox) {
      state.timerBox.classList.toggle(
        "is-warning",
        state.remaining <= 300 && state.remaining > 0
      );
    }
  }

  function tick() {
    if (!state) return;
    if (state.remaining <= 0) {
      stop();
      state.remaining = 0;
      paintClock();
      paintSteps();
      return;
    }
    state.remaining -= 1;
    paintClock();
    paintSteps();
  }

  function start() {
    if (!state || state.running) return;
    if (state.remaining <= 0) state.remaining = state.total;
    state.running = true;
    state.toggleBtn.textContent = "To'xtatish";
    state.intervalId = setInterval(tick, 1000);
  }

  function stop() {
    if (!state) return;
    state.running = false;
    state.toggleBtn.textContent = "Davom etish";
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
  }

  function reset() {
    if (!state) return;
    stop();
    state.remaining = state.total;
    state.toggleBtn.textContent = "Boshlash";
    paintClock();
    paintSteps();
  }

  function init() {
    var wrap = document.getElementById("agenda");
    if (!wrap) return;

    var clockEl = document.getElementById("agendaClock");
    var toggleBtn = document.getElementById("agendaToggle");
    var resetBtn = document.getElementById("agendaReset");
    if (!clockEl || !toggleBtn) return;

    var meta = readSteps();
    var keepRemaining = state && state.running ? state.remaining : meta.total;

    if (state && state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }

    state = {
      clockEl: clockEl,
      toggleBtn: toggleBtn,
      resetBtn: resetBtn,
      timerBox: wrap.querySelector(".agenda-timer"),
      steps: meta.steps,
      total: meta.total,
      boundaries: meta.boundaries,
      remaining: keepRemaining > meta.total ? meta.total : keepRemaining,
      running: false,
      intervalId: null
    };

    if (!toggleBtn.getAttribute("data-agenda-bound")) {
      toggleBtn.setAttribute("data-agenda-bound", "1");
      toggleBtn.addEventListener("click", function () {
        if (state.running) stop();
        else start();
      });
    }
    if (resetBtn && !resetBtn.getAttribute("data-agenda-bound")) {
      resetBtn.setAttribute("data-agenda-bound", "1");
      resetBtn.addEventListener("click", reset);
    }

    bindStepClicks();
    paintClock();
    paintSteps();
  }

  window.KA_AGENDA = { init: init };

  function boot() {
    init();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
