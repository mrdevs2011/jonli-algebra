/* Jonli Algebra — Sinf birga yechadi (taymer)
   Barcha darslarda bir xil ishlaydi: #classtimerClock / #classtimerToggle
   va h.k. ID'lari sahifada bo'lsa, avtomatik ulanadi. Lesson-specific
   ma'lumot kerak emas — shuning uchun to'liq umumiy fayl. */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var clockEl = document.getElementById("classtimerClock");
    var toggleBtn = document.getElementById("classtimerToggle");
    var resetBtn = document.getElementById("classtimerReset");
    var presetBtns = document.querySelectorAll(".classtimer-presets [data-secs]");
    if (!clockEl || !toggleBtn) return;

    var totalSecs = 60;
    var remaining = totalSecs;
    var timer = null;
    var running = false;

    function fmt(s) {
      var m = Math.floor(Math.abs(s) / 60);
      var sec = Math.abs(s) % 60;
      return (s < 0 ? "-" : "") + String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
    }

    function render() {
      clockEl.textContent = fmt(remaining);
      clockEl.classList.toggle("is-up", remaining <= 0);
    }

    function tick() {
      remaining--;
      render();
    }

    function start() {
      if (running) return;
      running = true;
      toggleBtn.textContent = "To'xtatish";
      timer = window.setInterval(tick, 1000);
    }

    function stop() {
      running = false;
      toggleBtn.textContent = "Davom ettirish";
      window.clearInterval(timer);
    }

    toggleBtn.addEventListener("click", function () {
      if (running) stop(); else start();
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        stop();
        toggleBtn.textContent = "Boshlash";
        remaining = totalSecs;
        render();
      });
    }

    presetBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        stop();
        toggleBtn.textContent = "Boshlash";
        totalSecs = parseInt(btn.getAttribute("data-secs"), 10);
        remaining = totalSecs;
        presetBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        render();
      });
    });

    var defaultPreset = document.querySelector('.classtimer-presets [data-secs="60"]');
    if (defaultPreset) defaultPreset.classList.add("is-active");
    render();
  });
})();
