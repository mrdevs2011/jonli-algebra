// Dars rejasi — 45 daqiqalik taymer va bosqichlar
// Har bir dars sahifasida #agenda ichida qayta ishlatiladi.
(function () {
  "use strict";

  var wrap = document.getElementById("agenda");
  if (!wrap) return;

  var clockEl = document.getElementById("agendaClock");
  var toggleBtn = document.getElementById("agendaToggle");
  var resetBtn = document.getElementById("agendaReset");
  var timerBox = wrap.querySelector(".agenda-timer");
  var stepsEl = document.getElementById("agendaSteps");
  var steps = Array.prototype.slice.call(stepsEl.querySelectorAll("li"));

  var TOTAL_SECONDS = steps.reduce(function (sum, li) {
    return sum + parseInt(li.getAttribute("data-min"), 10) * 60;
  }, 0);

  // Har bosqichning boshlanish soniyasi (o'tgan vaqt hisobida)
  var cumulative = 0;
  var boundaries = steps.map(function (li) {
    var start = cumulative;
    cumulative += parseInt(li.getAttribute("data-min"), 10) * 60;
    return { start: start, end: cumulative };
  });

  var remaining = TOTAL_SECONDS;
  var running = false;
  var intervalId = null;

  function fmt(sec) {
    if (sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
  }

  function elapsed() {
    return TOTAL_SECONDS - remaining;
  }

  function paintSteps() {
    var el = elapsed();
    boundaries.forEach(function (b, i) {
      var li = steps[i];
      li.classList.remove("is-active", "is-done");
      if (el >= b.end) {
        li.classList.add("is-done");
      } else if (el >= b.start && el < b.end) {
        li.classList.add("is-active");
      }
    });
  }

  function paintClock() {
    clockEl.textContent = fmt(remaining);
    if (timerBox) timerBox.classList.toggle("is-warning", remaining <= 300 && remaining > 0);
  }

  function tick() {
    if (remaining <= 0) {
      stop();
      remaining = 0;
      paintClock();
      paintSteps();
      return;
    }
    remaining -= 1;
    paintClock();
    paintSteps();
  }

  function start() {
    if (running) return;
    running = true;
    toggleBtn.textContent = "To'xtatish";
    intervalId = setInterval(tick, 1000);
  }

  function stop() {
    running = false;
    toggleBtn.textContent = "Davom etish";
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function reset() {
    stop();
    remaining = TOTAL_SECONDS;
    toggleBtn.textContent = "Boshlash";
    paintClock();
    paintSteps();
  }

  toggleBtn.addEventListener("click", function () {
    if (running) stop();
    else start();
  });

  resetBtn.addEventListener("click", reset);

  // Bosqichga qo'lda bosib o'tish — o'qituvchi rejadan tezroq yoki
  // sekinroq borsa, taymerni shu bosqichga moslab qo'yadi.
  steps.forEach(function (li, i) {
    li.addEventListener("click", function () {
      remaining = TOTAL_SECONDS - boundaries[i].start;
      paintClock();
      paintSteps();
    });
    li.style.cursor = "pointer";
  });

  paintClock();
  paintSteps();
})();
