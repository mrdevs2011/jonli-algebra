/**
 * js/features.js — BUILD QILINGAN FAYL. Qo'lda tahrirlanmaydi.
 *
 * Manba: js/features/*.js — yangi umumiy funksiya (har darsda bir xil
 * ishlaydigan narsa) qo'shish uchun O'SHA papkaga yangi fayl qo'shing
 * va `python3 build/build.py` ishga tushiring. Shablonga (dars-template.html)
 * tegish shart emas — u faqat shu bitta bundle faylni ulaydi.
 */

/* ---- manba: js/features/agenda.js ---- */
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

/* ---- manba: js/features/board.js ---- */
/* Jonli Algebra — Doska (elektron taxta / UHB) rejimi
   Barcha sahifalarda bir xil ishlaydi: header'ga tugma qo'shadi,
   katta shrift/tugma rejimini yoqadi va to'liq ekranga o'tkazadi.
   localStorage orqali tanlov saqlanadi, darslar orasida yo'qolmaydi. */
(function () {
  var STORAGE_KEY = 'jonli-algebra-board-mode';

  // data.json.features.board === false bo'lsa, bu dars uchun tugma umuman
  // qo'shilmaydi. Boshqa feature'lar HTML section orqali build.py'da
  // kesib tashlanadi (build/dars-template.html'dagi <!--#feature:...-->
  // markerlariga qarang) — bu esa JS orqali dinamik qo'shiladigan yagona
  // feature bo'lgani uchun shu yerda o'zi tekshiradi.
  function featureEnabled() {
    try {
      var el = document.getElementById('dars-data');
      if (!el) return true;
      var data = JSON.parse(el.textContent);
      var f = data && data.features;
      return !(f && f.board === false);
    } catch (e) {
      return true;
    }
  }

  function isOn() {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return false; }
  }

  function save(on) {
    try { localStorage.setItem(STORAGE_KEY, on ? '1' : '0'); } catch (e) {}
  }

  function requestFs() {
    try {
      var el = document.documentElement;
      var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      if (req && !document.fullscreenElement) req.call(el);
    } catch (e) {}
  }

  function exitFs() {
    try {
      var exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (document.fullscreenElement && exit) exit.call(document);
    } catch (e) {}
  }

  var ICON_MONITOR = '<svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';
  var ICON_CHECK = '<svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  function updateBtn(btn, on) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.innerHTML = (on ? ICON_CHECK : ICON_MONITOR) + ' Doska rejimi';
  }

  function apply(on) {
    document.documentElement.classList.toggle('board-mode', on);
    save(on);
    updateBtn(document.getElementById('boardModeBtn'), on);
  }

  // Sahifa yuklanganda avvalgi tanlovni tiklaymiz (fullscreen'ga majburlamaymiz —
  // brauzerlar bunga foydalanuvchi ishorasi bo'lmasa ruxsat bermaydi).
  if (isOn()) {
    document.documentElement.classList.add('board-mode');
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!featureEnabled()) return;
    var header = document.querySelector('.site-header');
    if (!header || document.getElementById('boardModeBtn')) return;

    var btn = document.createElement('button');
    btn.id = 'boardModeBtn';
    btn.type = 'button';
    btn.className = 'btn btn-board';
    updateBtn(btn, isOn());

    btn.addEventListener('click', function () {
      var next = !document.documentElement.classList.contains('board-mode');
      apply(next);
      if (next) requestFs(); else exitFs();
    });

    header.appendChild(btn);
  });
})();

/* ---- manba: js/features/classtimer.js ---- */
/* Jonli Algebra — Sinf birga yechadi (taymer)
   Barcha darslarda bir xil ishlaydi: #classtimerClock / #classtimerToggle
   va h.k. ID'lari sahifada bo'lsa, avtomatik ulanadi. */
(function () {
  "use strict";

  var started = false;

  function pad2(n) {
    n = Math.abs(n);
    return (n < 10 ? "0" : "") + String(n);
  }

  function init() {
    var clockEl = document.getElementById("classtimerClock");
    var toggleBtn = document.getElementById("classtimerToggle");
    var resetBtn = document.getElementById("classtimerReset");
    var presetBtns = document.querySelectorAll(".classtimer-presets [data-secs]");
    if (!clockEl || !toggleBtn) return;
    if (toggleBtn.getAttribute("data-classtimer-bound") === "1") return;
    toggleBtn.setAttribute("data-classtimer-bound", "1");
    started = true;

    var totalSecs = 60;
    var remaining = totalSecs;
    var timer = null;
    var running = false;

    function fmt(s) {
      var m = Math.floor(Math.abs(s) / 60);
      var sec = Math.abs(s) % 60;
      return (s < 0 ? "-" : "") + pad2(m) + ":" + pad2(sec);
    }

    function render() {
      clockEl.textContent = fmt(remaining);
      clockEl.classList.toggle("is-up", remaining <= 0);
    }

    function beep(freq, dur) {
      try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        if (!beep.ctx) beep.ctx = new Ctx();
        var ctx = beep.ctx;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.value = 0.06;
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch (e) {}
      if (navigator.vibrate) navigator.vibrate(200);
    }

    function tick() {
      remaining--;
      render();
      if (remaining === 0) {
        beep(440, 0.18);
        window.setTimeout(function () { beep(440, 0.18); }, 260);
        window.setTimeout(function () { beep(660, 0.28); }, 520);
      }
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
      timer = null;
    }

    toggleBtn.addEventListener("click", function () {
      if (running) stop();
      else start();
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        stop();
        toggleBtn.textContent = "Boshlash";
        remaining = totalSecs;
        render();
      });
    }

    Array.prototype.forEach.call(presetBtns, function (btn) {
      btn.addEventListener("click", function () {
        stop();
        toggleBtn.textContent = "Boshlash";
        totalSecs = parseInt(btn.getAttribute("data-secs"), 10) || 60;
        remaining = totalSecs;
        Array.prototype.forEach.call(presetBtns, function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        render();
      });
    });

    var defaultPreset = document.querySelector('.classtimer-presets [data-secs="60"]');
    if (defaultPreset) defaultPreset.classList.add("is-active");
    render();
  }

  window.KA_CLASSTIMER = { init: init };

  function boot() { init(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

/* ---- manba: js/features/dark-mode.js ---- */
/**
 * Jonli Algebra — Tungi rejim (Dark Mode)
 * Ko'zni asrovchi tungi rejim va yorug'lik boshqaruvi.
 */
(function () {
  "use strict";

  var THEME_KEY = "ja_theme";

  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || "light";
    } catch (e) {
      return "light";
    }
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    updateButtons(theme);
  }

  function toggleTheme() {
    var current = getSavedTheme();
    var next = current === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
    applyTheme(next);
  }

  function updateButtons(theme) {
    var btns = document.querySelectorAll(".theme-toggle-btn");
    btns.forEach(function (btn) {
      var isDark = theme === "dark";
      btn.setAttribute("aria-label", isDark ? "Kunduzgi rejimga o'tish" : "Tungi rejimga o'tish");
      btn.title = isDark ? "Kunduzgi rejim" : "Tungi rejim";
      var icon = btn.querySelector(".theme-icon");
      if (icon) {
        if (isDark) {
          // Sun SVG
          icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        } else {
          // Moon SVG
          icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        }
      }
      var label = btn.querySelector(".theme-label");
      if (label) {
        label.textContent = isDark ? "Kunduzgi" : "Tungi";
      }
    });
  }

  // Pre-apply theme immediately to prevent flashing
  var saved = getSavedTheme();
  applyTheme(saved);

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getSavedTheme());

    document.querySelectorAll(".theme-toggle-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        toggleTheme();
      });
    });
  });

  window.JA_THEME = {
    get: getSavedTheme,
    set: function (t) {
      try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
      applyTheme(t);
    },
    toggle: toggleTheme
  };
})();

/* ---- manba: js/features/exam-simulator.js ---- */
/**
 * Jonli Algebra — Imtihonlar va Litsey Simulyatori Dvigateli (Exam & Mastery Engine)
 * 1. Bob yakuniy nazorat testlari (10 savol, 15 daqiqa)
 * 2. Litsey kirish to'liq simulyatori (30 savol, 60 daqiqa: Westminster ALWIUT, PM, WIUT darajasi)
 */
(function () {
  "use strict";

  // Bob nazorat testlari savollari bazasi (I - V boblar)
  var CHAPTER_EXAMS = {
    1: {
      bobId: 1,
      title: "I Bob Nazorat Testi: Kvadrat Funksiya va Tengsizliklar",
      badgeId: "bob-1",
      durationSec: 15 * 60,
      questions: [
        {
          q: "y = x² − 8x + 12 funksiyaning nollarini toping:",
          options: ["x = 2 va x = 6", "x = −2 va x = −6", "x = 3 va x = 4", "x = 1 va x = 12"],
          correct: 0,
          topic: "Kvadrat funksiya nollari (1-§)"
        },
        {
          q: "y = −2(x − 3)² + 5 parabolaning uchi koordinatalarini aniqlang:",
          options: ["(3; 5)", "(−3; 5)", "(3; −5)", "(−2; 5)"],
          correct: 0,
          topic: "Parabola uchi (4-§)"
        },
        {
          q: "x² − 5x + 4 < 0 tengsizlikning yechimini oraliq ko'rinishida toping:",
          options: ["(1; 4)", "(−∞; 1) ∪ (4; +∞)", "[1; 4]", "(−4; −1)"],
          correct: 0,
          topic: "Kvadrat tengsizliklar (6-§)"
        },
        {
          q: "y = 3x² + 6x − 1 funksiyaning simmetriya o'qi tenglamasini toping:",
          options: ["x = −1", "x = 1", "x = −2", "x = 3"],
          correct: 0,
          topic: "Simmetriya o'qi (4-§)"
        },
        {
          q: "(x − 2)(x + 3)(x − 5) ≥ 0 tengsizlikni intervallar usulida yeching:",
          options: ["[-3; 2] ∪ [5; +∞)", "(−∞; −3] ∪ [2; 5]", "[2; 5]", "(−3; 5)"],
          correct: 0,
          topic: "Intervallar usuli (8-§)"
        },
        {
          q: "f(x) = x⁴ − 3x² + 7 funksiyaning juft-toqligini aniqlang:",
          options: ["Juft funksiya", "Toq funksiya", "Na juft, na toq", "Davriy funksiya"],
          correct: 0,
          topic: "Funksiyaning juft-toqligi (11-§)"
        },
        // Litsey darajasidagi 4 ta masala:
        {
          q: "Litsey masalasi: y = x² − 2x + k parabolaning uchi y = 2x + 1 to'g'ri chiziqda yotsa, k ning qiymatini toping:",
          options: ["k = 4", "k = 3", "k = 2", "k = 5"],
          correct: 0,
          topic: "Parabola parametrlari (Litsey darajasi)",
          explanation: "Parabola uchi x₀ = 1, y₀ = 1 − 2 + k = k − 1. To'g'ri chiziqqa qo'yamiz: k − 1 = 2(1) + 1 = 3 → k = 4."
        },
        {
          q: "Litsey masalasi: x² + (a − 1)x + a² − 2 = 0 tenglama ildizlari kvadratlari yig'indisi x₁² + x₂² eng katta qiymatga erishadigan a ni toping:",
          options: ["a = 1", "a = −1", "a = 0", "a = 2"],
          correct: 1,
          topic: "Viyet ekstremum masalalari",
          explanation: "x₁² + x₂² = (x₁+x₂)² − 2x₁x₂ = (a−1)² − 2(a²−2) = −a² − 2a + 5 = 6 − (a+1)². Eng katta qiymat a = −1 da erishiladi."
        },
        {
          q: "Litsey masalasi: Har qanday x haqiqiy sonda x² − mx + m + 3 > 0 bo'ladigan m ning barcha butun qiymatlari sonini toping:",
          options: ["7 ta", "5 ta", "6 ta", "8 ta"],
          correct: 0,
          topic: "Parametrli tengsizliklar",
          explanation: "D = m² − 4(m+3) = m² − 4m − 12 < 0 → (m−6)(m+2) < 0 → −2 < m < 6. Butun sonlar: −1, 0, 1, 2, 3, 4, 5 (jami 7 ta)."
        },
        {
          q: "Litsey masalasi: y = ax² parabolaga y = 6x − 9 to'g'ri chiziq urinadi (bitta umumiy nuqtaga ega). a ni toping:",
          options: ["a = 1", "a = 2", "a = 3", "a = 4"],
          correct: 0,
          topic: "Grafiklar urinishi",
          explanation: "ax² − 6x + 9 = 0 da D = 36 − 36a = 0 → a = 1."
        }
      ]
    },
    2: {
      bobId: 2,
      title: "II Bob Nazorat Testi: Tenglamalar va Tengsizliklar Sistemalari",
      badgeId: "bob-2",
      durationSec: 15 * 60,
      questions: [
        {
          q: "x + y = 9 va xy = 20 tenglamalar sistemasining barcha musbat yechimlari juftligini toping:",
          options: ["(4; 5) va (5; 4)", "(2; 10) va (10; 2)", "(3; 6) va (6; 3)", "(1; 20)"],
          correct: 0,
          topic: "Sodda sistemalar (13-§)"
        },
        {
          q: "x² − y² = 24 va x − y = 4 bo'lsa, x + y yig'indisini toping:",
          options: ["6", "8", "12", "4"],
          correct: 0,
          topic: "Qisqa ko'paytirish formulalari (14-§)"
        },
        {
          q: "x² + y² = 25 va x = 3 sistemadan y ning barcha qiymatlarini toping:",
          options: ["±4", "4", "−4", "±5"],
          correct: 0,
          topic: "Aylana va to'g'ri chiziq (13-§)"
        },
        {
          q: "Musbat a va b sonlar uchun Koshi tengsizligi qaysi?",
          options: ["(a + b)/2 ≥ √(ab)", "(a + b)/2 ≤ √(ab)", "a² + b² ≥ a + b", "ab ≥ (a+b)²"],
          correct: 0,
          topic: "Koshi tengsizligi (16-§)"
        },
        {
          q: "x² − 4 > 0 va x² − 9 ≤ 0 tengsizliklar sistemasining yechimi:",
          options: ["[-3; -2) ∪ (2; 3]", "(-2; 2)", "[-3; 3]", "(2; 3]"],
          correct: 0,
          topic: "Tengsizliklar sistemasi (15-§)"
        },
        {
          q: "x + y = 6 bo'lsa, x · y ko'paytmaning eng katta qiymatini toping:",
          options: ["9", "8", "12", "36"],
          correct: 0,
          topic: "Koshi va ekstremum (16-§)"
        },
        // Litsey masalalari:
        {
          q: "Litsey masalasi: x + y + xy = 11 va x²y + xy² = 30 sistemasidan x³ + y³ ning qiymatini toping:",
          options: ["35", "27", "40", "64"],
          correct: 0,
          topic: "Simmetrik sistemalar",
          explanation: "u = x+y, v = xy desak: u + v = 11, uv = 30. {u, v} = {5, 6} yoki {6, 5}. u=5, v=6 bo'lganda: x³+y³ = u³ − 3uv = 125 − 3(5)(6) = 125 − 90 = 35."
        },
        {
          q: "Litsey masalasi: x, y, z musbat sonlar va x + y + z = 1 bo'lsa, 1/x + 1/y + 1/z ifodaning eng kichik qiymati:",
          options: ["9", "6", "3", "12"],
          correct: 0,
          topic: "Koshi-Bunyakovskiy",
          explanation: "(x + y + z)(1/x + 1/y + 1/z) ≥ 9. x+y+z=1 bo'lgani uchun eng kichik qiymat 9 ga teng."
        },
        {
          q: "Litsey masalasi: x² + y² − 4x + 6y + 13 = 0 tenglamaning barcha haqiqiy yechimlari juftligini toping:",
          options: ["(2; −3)", "(−2; 3)", "(2; 3)", "Yechimga ega emas"],
          correct: 0,
          topic: "Kvadratlar yig'indisi",
          explanation: "(x − 2)² + (y + 3)² = 0 → x = 2, y = −3."
        },
        {
          q: "Litsey masalasi: Tengsizlikni yeching: √(x + 3) > x − 3.",
          options: ["[-3; 6)", "[3; 6)", "(6; +∞)", "[-3; +∞)"],
          correct: 0,
          topic: "Irrasional tengsizlik",
          explanation: "x < 3 bo'lsa x+3 ≥ 0 → x ∈ [-3; 3). x ≥ 3 bo'lsa x+3 > x² − 6x + 9 → x² − 7x + 6 < 0 → x ∈ [3; 6). Birlashtirsak: [-3; 6)."
        }
      ]
    },
    3: {
      bobId: 3,
      title: "III Bob Nazorat Testi: Trigonometriya Asoslari",
      badgeId: "bob-3",
      durationSec: 15 * 60,
      questions: [
        {
          q: "120° burchakning radian o'lchovini toping:",
          options: ["2π/3", "3π/4", "5π/6", "π/3"],
          correct: 0,
          topic: "Radian o'lchovi (17-§)"
        },
        {
          q: "sin(150°) ning aniq qiymatini toping:",
          options: ["1/2", "√3/2", "−1/2", "√2/2"],
          correct: 0,
          topic: "Keltirish formulalari (26-§)"
        },
        {
          q: "Agar cosα = −3/5 va α uchinchi chorakda bo'lsa, sinα ni toping:",
          options: ["−4/5", "4/5", "3/4", "−3/4"],
          correct: 0,
          topic: "Asosiy ayniyat (21-§)"
        },
        {
          q: "cos(α + β) yig'indisi formulasi to'g'ri ko'rsatilgan qatorni toping:",
          options: ["cosα cosβ − sinα sinβ", "cosα cosβ + sinα sinβ", "sinα cosβ + cosα sinβ", "sinα cosβ − cosα sinβ"],
          correct: 0,
          topic: "Qo'shish formulalari (24-§)"
        },
        {
          q: "sin(2α) ning ikkilangan burchak formulasi:",
          options: ["2 sinα cosα", "cos²α − sin²α", "2 sinα", "sin²α + cos²α"],
          correct: 0,
          topic: "Ikkilangan burchak (25-§)"
        },
        {
          q: "tgα · ctgα ifodaning qiymati har qanday mumkin bo'lgan α da nechaga teng?",
          options: ["1", "0", "−1", "tg²α"],
          correct: 0,
          topic: "Trigonometrik ayniyatlar (21-§)"
        },
        // Litsey masalalari:
        {
          q: "Litsey masalasi: sin(15°) · cos(15°) ko'paytmasining qiymatini hisoblang:",
          options: ["1/4", "1/2", "√3/4", "1/8"],
          correct: 0,
          topic: "Ikkilangan burchak",
          explanation: "sin15°·cos15° = (1/2) · 2sin15°cos15° = (1/2) · sin30° = (1/2) · (1/2) = 1/4."
        },
        {
          q: "Litsey masalasi: Agar tgα + ctgα = 4 bo'lsa, tg²α + ctg²α ni toping:",
          options: ["14", "16", "12", "18"],
          correct: 0,
          topic: "Trigonometrik almashtirish",
          explanation: "(tgα + ctgα)² = tg²α + 2 + ctg²α = 16 → tg²α + ctg²α = 14."
        },
        {
          q: "Litsey masalasi: cos²(10°) + cos²(50°) + cos²(70°) yig'indisini hisoblang:",
          options: ["3/2", "1", "2", "3/4"],
          correct: 0,
          topic: "Darajani pasaytirish",
          explanation: "Darajani pasaytirish formulasi orqali: 3/2 + 1/2(cos20° + cos100° + cos140°) = 3/2 + 0 = 3/2."
        },
        {
          q: "Litsey masalasi: sin(α) + cos(α) = 1.2 bo'lsa, sin(2α) qiymatini toping:",
          options: ["0.44", "0.2", "0.5", "0.4"],
          correct: 0,
          topic: "Asosiy ayniyat va ikkilangan burchak",
          explanation: "(sinα + cosα)² = 1 + sin2α = (1.2)² = 1.44 → sin2α = 0.44."
        }
      ]
    },
    4: {
      bobId: 4,
      title: "IV Bob Nazorat Testi: Progressiyalar",
      badgeId: "bob-4",
      durationSec: 15 * 60,
      questions: [
        {
          q: "Arifmetik progressiyada a₁ = 5, d = 3 bo'lsa, a₁₀ ni toping:",
          options: ["32", "35", "29", "30"],
          correct: 0,
          topic: "Arifmetik progressiya (29-§)"
        },
        {
          q: "1 + 2 + 3 + ... + 20 yig'indisini hisoblang:",
          options: ["210", "200", "190", "220"],
          correct: 0,
          topic: "Arifmetik yig'indi (30-§)"
        },
        {
          q: "Geometrik progressiyada b₁ = 2, q = 3 bo'lsa, b₄ ni toping:",
          options: ["54", "18", "162", "48"],
          correct: 0,
          topic: "Geometrik progressiya (31-§)"
        },
        {
          q: "Cheksiz kamayuvchi geometrik progressiyada b₁ = 6, q = 1/3 bo'lsa, yig'indisini toping:",
          options: ["9", "8", "12", "18"],
          correct: 0,
          topic: "Cheksiz progressiya (33-§)"
        },
        {
          q: "Arifmetik progressiyada a₃ = 11, a₇ = 23 bo'lsa, d ayirmani toping:",
          options: ["3", "4", "2", "5"],
          correct: 0,
          topic: "Ayirma d (29-§)"
        },
        {
          q: "Davriy o'nli kasr 0,(3) oddiy kasr shaklida:",
          options: ["1/3", "3/10", "3/11", "1/9"],
          correct: 0,
          topic: "Cheksiz progressiya (33-§)"
        },
        // Litsey masalalari:
        {
          q: "Litsey masalasi: Arifmetik progressiyada S₁₀ = 150 va S₂₀ = 500 bo'lsa, S₃₀ ni hisoblang:",
          options: ["1050", "950", "1000", "1100"],
          correct: 0,
          topic: "Progressiya xossalari",
          explanation: "S₁₀, S₂₀ − S₁₀, S₃₀ − S₂₀ o'zlari arifmetik progressiya tashkil qiladi: 150, 350, 550. S₃₀ = 500 + 550 = 1050."
        },
        {
          q: "Litsey masalasi: Uchta x, y, z sonlar geometrik progressiya, x, y+2, z esa arifmetik progressiya hosil qiladi. Agar x = 1 bo'lsa, z ni toping (z > 1):",
          options: ["9", "4", "16", "25"],
          correct: 0,
          topic: "Aralash progressiyalar",
          explanation: "y = q, z = q². Arifmetik shart: 2(q+2) = 1 + q² → q² − 2q − 3 = 0 → q = 3 (musbat). z = 3² = 9."
        },
        {
          q: "Litsey masalasi: 1/1·2 + 1/2·3 + 1/3·4 + ... + 1/99·100 yig'indisini toping:",
          options: ["99/100", "1", "100/101", "98/99"],
          correct: 0,
          topic: "Teleskopik yig'indi",
          explanation: "(1 − 1/2) + (1/2 − 1/3) + ... + (1/99 − 1/100) = 1 − 1/100 = 99/100."
        },
        {
          q: "Litsey masalasi: Geometrik progressiyada Sₙ = 3(2ⁿ − 1) bo'lsa, 5-hadi b₅ ni toping:",
          options: ["48", "96", "24", "32"],
          correct: 0,
          topic: "Sₙ dan bₙ ga o'tish",
          explanation: "b₅ = S₅ − S₄ = 3(31) − 3(15) = 93 − 45 = 48."
        }
      ]
    },
    5: {
      bobId: 5,
      title: "V Bob Nazorat Testi: Ehtimollik va Statistika",
      badgeId: "bob-5",
      durationSec: 15 * 60,
      questions: [
        {
          q: "Ikkita tanga tashlanganda ikkalasi ham gerb tushish ehtimolligi qancha?",
          options: ["1/4", "1/2", "3/4", "1/8"],
          correct: 0,
          topic: "Klassik ehtimollik (35-§)"
        },
        {
          q: "Qutidagi 5 qizil va 3 oq shardan olingan sharning oq bo'lish ehtimolligi:",
          options: ["3/8", "5/8", "3/5", "1/2"],
          correct: 0,
          topic: "Hodisaning ehtimolligi (35-§)"
        },
        {
          q: "Muqarrar (aniq ro'y beradigan) hodisaning ehtimolligi nechaga teng?",
          options: ["1", "0", "100", "0.5"],
          correct: 0,
          topic: "Hodisalar (34-§)"
        },
        {
          q: "Zarracha (o'yin suyagi) tashlanganda 4 dan katta son (5 yoki 6) tushish ehtimolligi:",
          options: ["1/3", "1/6", "1/2", "2/3"],
          correct: 0,
          topic: "Klassik ta'rif (35-§)"
        },
        {
          q: "2, 4, 6, 8, 10 sonlarining o'rta arifmetigini toping:",
          options: ["6", "5", "7", "30"],
          correct: 0,
          topic: "Sonli xarakteristikalar (38-§)"
        },
        {
          q: "Mumkin bo'lmagan hodisaning ehtimolligi:",
          options: ["0", "1", "−1", "0.01"],
          correct: 0,
          topic: "Hodisalar (34-§)"
        },
        // Litsey masalalari:
        {
          q: "Litsey masalasi: Ikkita zarracha baravar tashlanganda tushgan ochkolar yig'indisi 8 bo'lish ehtimolligi:",
          options: ["5/36", "1/6", "4/36", "7/36"],
          correct: 0,
          topic: "Murakkab ehtimollik",
          explanation: "Yig'indisi 8 bo'ladigan juftliklar: (2,6), (3,5), (4,4), (5,3), (6,2) — jami 5 ta. P = 5/36."
        },
        {
          q: "Litsey masalasi: Nishonga bir marta o'q uzganda tegish ehtimolligi 0.8. Ikki marta otilganda kamida bir marta tegish ehtimolligi:",
          options: ["0.96", "0.64", "0.8", "0.98"],
          correct: 0,
          topic: "Qarama-qarshi hodisa",
          explanation: "Ikkala safar ham tegmaslik ehtimolligi: (1−0.8)·(1−0.8) = 0.2·0.2 = 0.04. Kamida bittasi tegishi: 1 − 0.04 = 0.96."
        },
        {
          q: "Litsey masalasi: 1 dan 100 gacha bo'lgan natural sonlardan tanlangan sonning 3 ga ham, 5 ga ham bo'linmaslik ehtimolligi:",
          options: ["8/15", "7/15", "2/3", "1/2"],
          correct: 0,
          topic: "To'plamlar va ehtimollik",
          explanation: "3 ga bo'linuvchilar: 33 ta. 5 ga bo'linuvchilar: 20 ta. 15 ga bo'linuvchilar: 6 ta. Jami bo'linadigan: 33+20−6 = 47 ta. Bo'linmaydigan: 53 ta (≈ 8/15)."
        },
        {
          q: "Litsey masalasi: Qutida 3 ta oq va 2 ta qora shar bor. Ketma-ket qaytarmasdan olingan ikkala shar ham oq bo'lish ehtimolligi:",
          options: ["3/10", "1/5", "9/25", "6/25"],
          correct: 0,
          topic: "Shartli ehtimollik",
          explanation: "Birinchi shar oq: 3/5. Ikkinchisi oq: 2/4 = 1/2. P = (3/5) · (1/2) = 3/10."
        }
      ]
    }
  };

  // Litsey Kirish Imtihoni (Full 60-min Westminster ALWIUT / PM / WIUT Mock Simulator)
  function generateLyceumMock() {
    var allQuestions = [];
    // Collect from all chapters
    for (var ch = 1; ch <= 5; ch++) {
      allQuestions = allQuestions.concat(CHAPTER_EXAMS[ch].questions);
    }
    // Take 25 tests + 5 open written problems
    var tests = allQuestions.slice(0, 25);
    var written = [
      {
        q: "1-yozma masala: y = x² − 6x + 5 parabola bilan y = 2x − 2 to'g'ri chiziqning kesishish nuqtalari abssissalari yig'indisini toping:",
        answer: "8",
        regex: "^\\s*8\\s*$",
        explanation: "x² − 6x + 5 = 2x − 2 → x² − 8x + 7 = 0. Viyet bo'yicha ildizlar yig'indisi: x₁ + x₂ = 8."
      },
      {
        q: "2-yozma masala: x + y = 10 va x² + y² = 58 bo'lsa, x · y ko'paytmani toping:",
        answer: "21",
        regex: "^\\s*21\\s*$",
        explanation: "xy = ((x+y)² − (x²+y²))/2 = (100 − 58)/2 = 42/2 = 21."
      },
      {
        q: "3-yozma masala: sin²(20°) + sin²(70°) ifodaning aniq son qiymatini hisoblang:",
        answer: "1",
        regex: "^\\s*1\\s*$",
        explanation: "sin(70°) = cos(20°). sin²(20°) + cos²(20°) = 1."
      },
      {
        q: "4-yozma masala: Arifmetik progressiyada a₁ = 3, d = 4 bo'lsa, dastlabki 10 ta had yig'indisi S₁₀ ni toping:",
        answer: "210",
        regex: "^\\s*210\\s*$",
        explanation: "S₁₀ = (2·3 + 9·4)/2 · 10 = (6 + 36)/2 · 10 = 21 · 10 = 210."
      },
      {
        q: "5-yozma masala: Ikkita zarracha tashlanganda tushgan ochkolar ko'paytmasi 12 bo'ladigan elementar hodisalar sonini toping:",
        answer: "4",
        regex: "^\\s*4\\s*$",
        explanation: "Juftliklar: (2,6), (3,4), (4,3), (6,2) — jami 4 ta."
      }
    ];

    return {
      title: "Litsey Kirish Imtihoni (Westminster ALWIUT / PM / WIUT Darajasidagi To'liq Simulyator)",
      durationSec: 60 * 60,
      tests: tests,
      written: written
    };
  }

  // Active exam session state
  var currentExam = null;
  var timerInterval = null;

  function startChapterExam(bobId, containerEl) {
    var exam = CHAPTER_EXAMS[bobId];
    if (!exam || !containerEl) return;

    currentExam = {
      type: "chapter",
      bobId: bobId,
      data: exam,
      userAnswers: {},
      remainingSec: exam.durationSec,
      container: containerEl
    };

    renderExamUI();
  }

  function startLyceumMock(containerEl) {
    if (!containerEl) return;
    var mock = generateLyceumMock();

    currentExam = {
      type: "mock",
      data: mock,
      userAnswers: {},
      writtenAnswers: {},
      remainingSec: mock.durationSec,
      container: containerEl
    };

    renderMockUI();
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function renderExamUI() {
    if (!currentExam) return;
    var exam = currentExam.data;
    var box = currentExam.container;
    box.innerHTML = "";

    var header = document.createElement("div");
    header.className = "exam-session-header";
    header.innerHTML =
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">' +
        '<h3 style="margin:0; font-size:1.15rem; color:var(--ink);">' + exam.title + '</h3>' +
        '<div class="exam-timer-badge" id="examTimerBadge" style="display:inline-flex; align-items:center; gap:6px; background:var(--white); border:1px solid var(--line-strong); padding:6px 14px; border-radius:20px; font-weight:700; color:var(--accent); font-family:monospace; font-size:1.05rem;">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
          '<span id="examTimerDisplay">' + formatTime(currentExam.remainingSec) + '</span>' +
        '</div>' +
      '</div>';
    box.appendChild(header);

    var qList = document.createElement("div");
    qList.className = "exam-q-list";

    exam.questions.forEach(function (q, idx) {
      var qCard = document.createElement("div");
      qCard.className = "exam-q-card";
      qCard.style.cssText = "background:var(--white); border:1px solid var(--line); border-radius:12px; padding:16px; margin-bottom:16px;";

      var qTitle = document.createElement("div");
      qTitle.style.cssText = "font-weight:600; margin-bottom:12px; color:var(--ink);";
      qTitle.innerHTML = "<strong>" + (idx + 1) + ".</strong> " + q.q;
      qCard.appendChild(qTitle);

      var optWrap = document.createElement("div");
      optWrap.style.cssText = "display:grid; grid-template-columns:1fr; gap:8px;";

      q.options.forEach(function (opt, oIdx) {
        var optLabel = document.createElement("label");
        optLabel.style.cssText = "display:flex; align-items:center; gap:10px; padding:8px 12px; border:1px solid var(--line); border-radius:8px; cursor:pointer; background:var(--paper); transition:all 0.15s ease;";
        var rad = document.createElement("input");
        rad.type = "radio";
        rad.name = "q_" + idx;
        rad.value = oIdx;
        rad.checked = currentExam.userAnswers[idx] === oIdx;

        rad.addEventListener("change", function () {
          currentExam.userAnswers[idx] = oIdx;
        });

        optLabel.appendChild(rad);
        optLabel.appendChild(document.createTextNode(opt));
        optWrap.appendChild(optLabel);
      });

      qCard.appendChild(optWrap);
      qList.appendChild(qCard);
    });

    box.appendChild(qList);

    var actionRow = document.createElement("div");
    actionRow.style.cssText = "margin-top:20px; text-align:center;";
    var submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.className = "btn";
    submitBtn.style.cssText = "background:var(--accent-2); color:#fff; padding:12px 28px; font-weight:700; border-radius:10px; font-size:1rem; cursor:pointer;";
    submitBtn.textContent = "Imtihonni topshirish va natijani ko'rish";
    submitBtn.addEventListener("click", finishExam);
    actionRow.appendChild(submitBtn);
    box.appendChild(actionRow);

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      if (!currentExam) {
        clearInterval(timerInterval);
        return;
      }
      currentExam.remainingSec--;
      var disp = document.getElementById("examTimerDisplay");
      if (disp) disp.textContent = formatTime(currentExam.remainingSec);

      if (currentExam.remainingSec <= 0) {
        clearInterval(timerInterval);
        finishExam();
      }
    }, 1000);
  }

  function finishExam() {
    if (timerInterval) clearInterval(timerInterval);
    if (!currentExam) return;

    var exam = currentExam.data;
    var correctCount = 0;
    var weakTopics = [];

    exam.questions.forEach(function (q, idx) {
      var userAns = currentExam.userAnswers[idx];
      if (userAns === q.correct) {
        correctCount++;
      } else {
        weakTopics.push(q.topic);
      }
    });

    var total = exam.questions.length;
    var percent = Math.round((correctCount / total) * 100);
    var isPassed = percent >= 80;

    // Gamification rewards
    if (window.JA_GAMIFICATION) {
      if (isPassed) {
        window.JA_GAMIFICATION.addXp(100);
        window.JA_GAMIFICATION.unlockBadge(exam.badgeId);
      } else {
        window.JA_GAMIFICATION.addXp(correctCount * 5);
      }
    }

    if (window.JA_SOUND) {
      if (isPassed) {
        window.JA_SOUND.playFanfare();
      } else {
        window.JA_SOUND.playCorrect();
      }
    }

    var box = currentExam.container;
    box.innerHTML =
      '<div class="exam-result-card" style="background:var(--white); border:2px solid ' + (isPassed ? "var(--accent-2)" : "var(--accent)") + '; border-radius:16px; padding:24px; text-align:center; box-shadow:0 8px 24px rgba(0,0,0,0.06);">' +
        '<div style="font-size:2.8rem; font-weight:800; color:' + (isPassed ? "var(--accent-2)" : "var(--accent)") + '; margin-bottom:8px;">' + percent + '%</div>' +
        '<h3 style="margin:0 0 12px; font-size:1.3rem;">' + (isPassed ? "Ofarin! Bobni a'lo darajada o'zlashtirdingiz!" : "Yaxshi natija, lekin hali takrorlash kerak!") + '</h3>' +
        '<p style="color:var(--ink-soft); font-size:1rem; margin-bottom:16px;">Jami <strong>' + total + '</strong> ta savoldan <strong>' + correctCount + '</strong> tasiga to\'g\'ri javob berdingiz.</p>' +
        (isPassed ? '<div style="background:rgba(43,107,79,0.1); color:var(--accent-2); padding:10px 16px; border-radius:10px; font-weight:700; margin-bottom:16px;">+100 XP va Bob Medali qo\'lga kiritildi!</div>' : '') +
        (weakTopics.length > 0 ? (
          '<div style="text-align:left; background:var(--paper); border:1px solid var(--line); border-radius:10px; padding:14px; margin:16px 0;">' +
            '<strong>Takrorlash tavsiya etiladigan mavzular:</strong>' +
            '<ul style="margin:8px 0 0; padding-left:20px; line-height:1.5;">' +
              weakTopics.map(function (t) { return '<li>' + t + '</li>'; }).join('') +
            '</ul>' +
          '</div>'
        ) : '') +
        '<button type="button" class="btn" onclick="location.reload()" style="background:var(--accent); color:#fff; padding:10px 22px; border-radius:8px; font-weight:600; cursor:pointer;">Qaytadan topshirish</button>' +
      '</div>';
  }

  function renderMockUI() {
    if (!currentExam) return;
    var mock = currentExam.data;
    var box = currentExam.container;
    box.innerHTML = "";

    var header = document.createElement("div");
    header.className = "mock-session-header";
    header.innerHTML =
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">' +
        '<div>' +
          '<h3 style="margin:0; font-size:1.2rem; color:var(--ink);">' + mock.title + '</h3>' +
          '<small style="color:var(--ink-soft);">25 ta test savoli + 5 ta yozma masala (Jami 30 ta)</small>' +
        '</div>' +
        '<div class="exam-timer-badge" style="display:inline-flex; align-items:center; gap:6px; background:var(--white); border:1px solid var(--line-strong); padding:6px 14px; border-radius:20px; font-weight:700; color:var(--accent); font-family:monospace; font-size:1.1rem;">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
          '<span id="mockTimerDisplay">' + formatTime(currentExam.remainingSec) + '</span>' +
        '</div>' +
      '</div>';
    box.appendChild(header);

    // Render 25 Tests
    var testsBox = document.createElement("div");
    testsBox.innerHTML = '<h4 style="margin:20px 0 12px; color:var(--accent-2); border-bottom:2px solid var(--line); padding-bottom:6px;">I Qism: 25 ta Variantli Test</h4>';

    mock.tests.forEach(function (q, idx) {
      var qCard = document.createElement("div");
      qCard.style.cssText = "background:var(--white); border:1px solid var(--line); border-radius:10px; padding:14px; margin-bottom:12px;";
      qCard.innerHTML = "<div style='font-weight:600; margin-bottom:8px;'><strong>" + (idx + 1) + ".</strong> " + q.q + "</div>";

      var optWrap = document.createElement("div");
      optWrap.style.cssText = "display:grid; grid-template-columns:1fr; gap:6px;";
      q.options.forEach(function (opt, oIdx) {
        var lbl = document.createElement("label");
        lbl.style.cssText = "display:flex; align-items:center; gap:8px; padding:6px 10px; border:1px solid var(--line); border-radius:6px; cursor:pointer; background:var(--paper); font-size:0.95rem;";
        var rad = document.createElement("input");
        rad.type = "radio";
        rad.name = "mock_t_" + idx;
        rad.value = oIdx;
        rad.checked = currentExam.userAnswers[idx] === oIdx;
        rad.addEventListener("change", function () {
          currentExam.userAnswers[idx] = oIdx;
        });
        lbl.appendChild(rad);
        lbl.appendChild(document.createTextNode(opt));
        optWrap.appendChild(lbl);
      });
      qCard.appendChild(optWrap);
      testsBox.appendChild(qCard);
    });
    box.appendChild(testsBox);

    // Render 5 Written Problems
    var writtenBox = document.createElement("div");
    writtenBox.innerHTML = '<h4 style="margin:24px 0 12px; color:var(--accent); border-bottom:2px solid var(--line); padding-bottom:6px;">II Qism: 5 ta Yozma Masala (Aniq son yoki javob kiriting)</h4>';

    mock.written.forEach(function (w, wIdx) {
      var wCard = document.createElement("div");
      wCard.style.cssText = "background:var(--white); border:1px solid var(--line); border-radius:10px; padding:14px; margin-bottom:12px;";
      wCard.innerHTML = "<div style='font-weight:600; margin-bottom:8px;'><strong>" + (wIdx + 26) + ".</strong> " + w.q + "</div>";

      var inp = document.createElement("input");
      inp.type = "text";
      inp.placeholder = "Javobingizni kiriting...";
      inp.style.cssText = "width:100%; max-width:280px; padding:8px 12px; border:1px solid var(--line-strong); border-radius:6px; font-size:0.95rem; background:var(--paper);";
      inp.value = currentExam.writtenAnswers[wIdx] || "";
      inp.addEventListener("input", function () {
        currentExam.writtenAnswers[wIdx] = inp.value.trim();
      });

      wCard.appendChild(inp);
      writtenBox.appendChild(wCard);
    });
    box.appendChild(writtenBox);

    var submitWrap = document.createElement("div");
    submitWrap.style.cssText = "margin:28px 0; text-align:center;";
    var btn = document.createElement("button");
    btn.className = "btn";
    btn.style.cssText = "background:var(--accent); color:#fff; font-size:1.1rem; font-weight:700; padding:14px 36px; border-radius:10px; cursor:pointer;";
    btn.textContent = "To'liq simulyatsiyani yakunlash va hisobotni ko'rish";
    btn.addEventListener("click", finishMock);
    submitWrap.appendChild(btn);
    box.appendChild(submitWrap);

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      if (!currentExam) {
        clearInterval(timerInterval);
        return;
      }
      currentExam.remainingSec--;
      var disp = document.getElementById("mockTimerDisplay");
      if (disp) disp.textContent = formatTime(currentExam.remainingSec);

      if (currentExam.remainingSec <= 0) {
        clearInterval(timerInterval);
        finishMock();
      }
    }, 1000);
  }

  function finishMock() {
    if (timerInterval) clearInterval(timerInterval);
    if (!currentExam) return;

    var mock = currentExam.data;
    var testCorrect = 0;
    var writtenCorrect = 0;

    mock.tests.forEach(function (q, idx) {
      if (currentExam.userAnswers[idx] === q.correct) testCorrect++;
    });

    mock.written.forEach(function (w, wIdx) {
      var val = currentExam.writtenAnswers[wIdx] || "";
      if (val === w.answer || (w.regex && new RegExp(w.regex, "i").test(val))) {
        writtenCorrect++;
      }
    });

    var totalScore = testCorrect + (writtenCorrect * 2); // Written problems have 2x weight
    var maxScore = 25 + (5 * 2); // 35
    var percent = Math.round((totalScore / maxScore) * 100);

    var rank = "Tayyorgarlik talab etiladi";
    if (percent >= 85) rank = "Westminster (ALWIUT) & PM grantiga 99% tayyor!";
    else if (percent >= 70) rank = "Aniq fanlar litseylari grantiga tavsiya etiladi";
    else if (percent >= 50) rank = "O'rtacha daraja (mustahkamlash zarur)";

    if (window.JA_GAMIFICATION) {
      window.JA_GAMIFICATION.addXp(totalScore * 8);
      if (percent >= 85) {
        window.JA_GAMIFICATION.unlockBadge("lyceum-grandprix");
      }
    }

    if (window.JA_SOUND) {
      if (percent >= 70) window.JA_SOUND.playFanfare();
      else window.JA_SOUND.playCorrect();
    }

    var box = currentExam.container;
    box.innerHTML =
      '<div class="mock-result-card" style="background:var(--white); border:2px solid var(--line-strong); border-radius:16px; padding:28px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.06);">' +
        '<div style="font-size:3rem; font-weight:800; color:var(--accent); margin-bottom:8px;">' + totalScore + ' / ' + maxScore + ' ball</div>' +
        '<div style="display:inline-block; background:rgba(194,75,42,0.1); color:var(--accent); font-weight:700; padding:6px 14px; border-radius:20px; margin-bottom:14px;">Umumiy natija: ' + percent + '%</div>' +
        '<h3 style="margin:0 0 10px; font-size:1.4rem;">' + rank + '</h3>' +
        '<p style="color:var(--ink-soft); max-width:600px; margin:0 auto 20px;">Test qismidan: <strong>' + testCorrect + ' / 25</strong>, Yozma qismidan: <strong>' + writtenCorrect + ' / 5</strong> to\'g\'ri yechildi.</p>' +
        '<button type="button" class="btn" onclick="location.reload()" style="background:var(--accent-2); color:#fff; padding:12px 28px; border-radius:8px; font-weight:700; cursor:pointer;">Bosh sahifaga qaytish</button>' +
      '</div>';
  }

  window.JA_EXAM = {
    CHAPTER_EXAMS: CHAPTER_EXAMS,
    startChapterExam: startChapterExam,
    startLyceumMock: startLyceumMock
  };
})();

/* ---- manba: js/features/gamification.js ---- */
/**
 * Jonli Algebra — Gamifikatsiya va O'quvchi Motivatsiyasi (Duolingo-Style Retention)
 * XP (Tajriba ballari), Kunlik ketma-ketlik (Streak) va Virtual nishonlar (Badges).
 */
(function () {
  "use strict";

  var XP_KEY = "ja_xp";
  var STREAK_KEY = "ja_streak";
  var LAST_DATE_KEY = "ja_last_active_date";
  var BADGES_KEY = "ja_badges";

  var BADGES = {
    "bob-1": {
      id: "bob-1",
      title: "Parabola va Funksiyalar Ustasi",
      desc: "I bobni muvaffaqiyatli yakunlagan va kvadrat funksiyalarni to'liq o'zlashtirgan o'quvchi.",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>'
    },
    "bob-2": {
      id: "bob-2",
      title: "Tenglamalar Tizimi Grossmeysteri",
      desc: "II bobni tugatib, chiziqli va kvadrat tenglamalar sistemalarini mohirona yechgan o'quvchi.",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>'
    },
    "bob-3": {
      id: "bob-3",
      title: "Trigonometriya Dahosi",
      desc: "III bob bo'yicha barcha trigonometrik ayniyatlar va keltirish formulalarini zabt etgan bilimdon.",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 3v9l6 3"></path></svg>'
    },
    "bob-4": {
      id: "bob-4",
      title: "Progressiyalar Sehrgari",
      desc: "IV bobning arifmetik va geometrik zanjirlarini hamda cheksiz yig'indilarni hisoblagan mutaxassis.",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>'
    },
    "bob-5": {
      id: "bob-5",
      title: "Ehtimollik va Ma'lumotlar Mutaxassisi",
      desc: "V bob bo'yicha hodisalar ehtimolligi va statistik qonuniyatlarni mukammal tahlil qilgan o'quvchi.",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle><circle cx="8.5" cy="15.5" r="1.5"></circle><circle cx="15.5" cy="8.5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle></svg>'
    },
    "lyceum-grandprix": {
      id: "lyceum-grandprix",
      title: "Litseyga 100% Tayyor Gran-pri",
      desc: "Westminster, Prezident va Aniq fanlar litseylariga kirish uchun barcha nostandart masalalarni zabt etgan apex o'quvchi!",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7"></path><path d="M14 14.66V17c0 .55.45 1 1 1h2"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>'
    }
  };

  function getXp() {
    try {
      return parseInt(localStorage.getItem(XP_KEY) || "0", 10);
    } catch (e) {
      return 0;
    }
  }

  function getLevel(xp) {
    if (xp >= 1000) return { lvl: 5, nom: "Algebra Grossmeysteri", next: 1500, min: 1000 };
    if (xp >= 600) return { lvl: 4, nom: "Litsey Aspiranti", next: 1000, min: 600 };
    if (xp >= 300) return { lvl: 3, nom: "Teorema Bilimdoni", next: 600, min: 300 };
    if (xp >= 100) return { lvl: 2, nom: "Izlanuvchan Matematik", next: 300, min: 100 };
    return { lvl: 1, nom: "Boshlang'ich Algebrachi", next: 100, min: 0 };
  }

  function addXp(amount) {
    var cur = getXp();
    var next = cur + amount;
    try {
      localStorage.setItem(XP_KEY, String(next));
    } catch (e) {}
    recordActivity();
    updateHUD();
    return next;
  }

  function getTodayStr() {
    var d = new Date();
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function getStreak() {
    try {
      return parseInt(localStorage.getItem(STREAK_KEY) || "1", 10);
    } catch (e) {
      return 1;
    }
  }

  function recordActivity() {
    var today = getTodayStr();
    var lastDate = "";
    try {
      lastDate = localStorage.getItem(LAST_DATE_KEY) || "";
    } catch (e) {}

    if (lastDate === today) {
      return; // Already recorded today
    }

    var streak = getStreak();
    if (lastDate) {
      var last = new Date(lastDate);
      var cur = new Date(today);
      var diffDays = Math.round((cur.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    try {
      localStorage.setItem(STREAK_KEY, String(streak));
      localStorage.setItem(LAST_DATE_KEY, today);
    } catch (e) {}

    updateHUD();
  }

  function getBadges() {
    try {
      var raw = localStorage.getItem(BADGES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function hasBadge(badgeId) {
    var badges = getBadges();
    return badges.indexOf(badgeId) !== -1;
  }

  function unlockBadge(badgeId) {
    if (!BADGES[badgeId]) return false;
    var list = getBadges();
    if (list.indexOf(badgeId) === -1) {
      list.push(badgeId);
      try {
        localStorage.setItem(BADGES_KEY, JSON.stringify(list));
      } catch (e) {}
      if (window.JA_SOUND && window.JA_SOUND.playFanfare) {
        window.JA_SOUND.playFanfare();
      }
      showBadgeToast(BADGES[badgeId]);
      updateHUD();
      return true;
    }
    return false;
  }

  function showBadgeToast(badge) {
    var toast = document.createElement("div");
    toast.className = "badge-unlock-toast";
    toast.innerHTML =
      '<div class="badge-toast-icon">' + badge.icon + '</div>' +
      '<div class="badge-toast-text">' +
        '<div class="badge-toast-sub">Yangi nishon ochildi!</div>' +
        '<strong class="badge-toast-title">' + badge.title + '</strong>' +
      '</div>';
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.classList.add("is-visible");
    }, 50);
    setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 400);
    }, 4500);
  }

  function updateHUD() {
    var xp = getXp();
    var lvl = getLevel(xp);
    var streak = getStreak();

    // Update XP elements
    document.querySelectorAll(".hud-xp-val").forEach(function (el) {
      el.textContent = xp;
    });

    // Update Level elements
    document.querySelectorAll(".hud-level-val").forEach(function (el) {
      el.textContent = lvl.lvl + "-daraja (" + lvl.nom + ")";
    });

    // Update Streak elements
    document.querySelectorAll(".hud-streak-val").forEach(function (el) {
      el.textContent = streak;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateHUD();
  });

  window.JA_GAMIFICATION = {
    getXp: getXp,
    getLevel: getLevel,
    addXp: addXp,
    getStreak: getStreak,
    recordActivity: recordActivity,
    getBadges: getBadges,
    hasBadge: hasBadge,
    unlockBadge: unlockBadge,
    BADGES: BADGES,
    updateHUD: updateHUD
  };
})();

/* ---- manba: js/features/kitob-full.js ---- */
// Darslik sahifalari lightbox.
// Havolalar dars-render.js'dan KEYIN paydo bo'ladi, shuning uchun
// window.KA_KITOB.init() qayta chaqiriladi.
(function () {
  "use strict";

  var TOTAL_PAGES = 240;
  var bound = false;
  var idx = 0;
  var reqId = 0;
  var showLoaderTimer = null;
  var hideFlipTimer = null;
  var lb, lbImg, lbClose, prevBtn, nextBtn, navLabel, pageWrap;

  function pageSrc(bet) {
    return "../../../../kitob/kitob-" + bet + ".png";
  }

  function setNavDisabled(disabled) {
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = disabled || idx === 0;
    nextBtn.disabled = disabled || idx === TOTAL_PAGES - 1;
  }

  function render(direction, explicitSrc) {
    if (!lbImg || !pageWrap) return;
    var bet = idx + 1;
    var myReq = ++reqId;

    clearTimeout(showLoaderTimer);
    clearTimeout(hideFlipTimer);
    pageWrap.classList.remove("flip-left", "flip-right");
    setNavDisabled(true);

    showLoaderTimer = window.setTimeout(function () {
      if (myReq === reqId) pageWrap.classList.add("is-loading");
    }, 90);

    var img = new Image();
    img.onload = function () {
      if (myReq !== reqId) return;
      clearTimeout(showLoaderTimer);
      lbImg.src = img.src;
      lbImg.alt = bet + "-bet";
      pageWrap.classList.remove("is-loading");
      if (direction) {
        var flipClass = direction === "next" ? "flip-left" : "flip-right";
        pageWrap.classList.add(flipClass);
        hideFlipTimer = window.setTimeout(function () {
          pageWrap.classList.remove(flipClass);
        }, 260);
      }
      setNavDisabled(false);
    };
    img.onerror = function () {
      if (myReq !== reqId) return;
      clearTimeout(showLoaderTimer);
      if (explicitSrc && img.src.indexOf(explicitSrc) === -1) {
        img.src = explicitSrc;
        return;
      }
      pageWrap.classList.remove("is-loading");
      setNavDisabled(false);
    };
    img.src = explicitSrc || pageSrc(bet);
    if (navLabel) navLabel.textContent = bet + "-bet · (" + bet + "/" + TOTAL_PAGES + ")";
  }

  function goNext() {
    if (nextBtn && !nextBtn.disabled && idx < TOTAL_PAGES - 1) {
      idx++;
      render("next");
    }
  }
  function goPrev() {
    if (prevBtn && !prevBtn.disabled && idx > 0) {
      idx--;
      render("prev");
    }
  }

  function init() {
    var links = document.querySelectorAll(".kitob-sahifa");
    lb = document.getElementById("kitobLightbox");
    lbImg = document.getElementById("kitobLightboxImg");
    lbClose = document.getElementById("kitobLightboxClose");
    prevBtn = document.getElementById("kitobPrev");
    nextBtn = document.getElementById("kitobNext");
    navLabel = document.getElementById("kitobNavLabel");
    pageWrap = document.getElementById("kitobPageWrap");
    if (!lb || !pageWrap) return;

    if (!pageWrap.querySelector(".kitob-loader")) {
      var loader = document.createElement("div");
      loader.className = "kitob-loader";
      loader.innerHTML =
        '<span class="kitob-loader-page"><span class="kitob-loader-corner"></span></span>';
      pageWrap.appendChild(loader);
    }

    Array.prototype.forEach.call(links, function (a) {
      if (a.getAttribute("data-kitob-bound") === "1") return;
      a.setAttribute("data-kitob-bound", "1");
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var href = a.getAttribute("href");
        var betMatch = href && href.match(/kitob-(\d+)/);
        var bet = betMatch ? parseInt(betMatch[1], 10) : 1;
        idx = Math.min(Math.max(bet - 1, 0), TOTAL_PAGES - 1);
        render(null, href);
        lb.classList.add("is-open");
      });
    });

    if (bound) return;
    bound = true;

    if (prevBtn) prevBtn.addEventListener("click", goPrev);
    if (nextBtn) nextBtn.addEventListener("click", goNext);

    function closeLb() {
      lb.classList.remove("is-open");
      if (lbImg) lbImg.src = "";
    }
    if (lbClose) lbClose.addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    });

    var touchStartX = null;
    var touchStartY = null;
    pageWrap.addEventListener("touchstart", function (e) {
      var t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    }, { passive: true });
    pageWrap.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - touchStartX;
      var dy = t.clientY - touchStartY;
      touchStartX = null;
      touchStartY = null;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      if (dx < 0) goNext();
      else goPrev();
    }, { passive: true });

    var mouseDownX = null;
    pageWrap.addEventListener("mousedown", function (e) {
      mouseDownX = e.clientX;
    });
    pageWrap.addEventListener("mouseup", function (e) {
      if (mouseDownX === null) return;
      var dx = e.clientX - mouseDownX;
      mouseDownX = null;
      if (Math.abs(dx) < 60) return;
      if (dx < 0) goNext();
      else goPrev();
    });
  }

  window.KA_KITOB = { init: init };

  function boot() { init(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

/* ---- manba: js/features/picker.js ---- */
/* Jonli Algebra — Doskaga kim chiqadi? (tasodifiy o'quvchi tanlash)
   Barcha darslarda bir xil ishlaydi: har bir dars sahifasida
   #pickerSpinBtn / #pickerName va h.k. ID'lari bo'lsa, avtomatik ulanadi.
   Ismlar ro'yxati localStorage'da saqlanadi — bir marta kiritilsa,
   barcha darslar orasida umumiy bo'lib qoladi. */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var displayEl = document.getElementById("pickerDisplay");
    var nameEl = document.getElementById("pickerName");
    var spinBtn = document.getElementById("pickerSpinBtn");
    var listBtn = document.getElementById("pickerListBtn");
    var namesPanel = document.getElementById("pickerNamesPanel");
    var namesInput = document.getElementById("pickerNamesInput");
    var namesSave = document.getElementById("pickerNamesSave");
    var noRepeatBox = document.getElementById("pickerNoRepeat");
    if (!spinBtn || !nameEl) return;

    var STORE_KEY = "ka-sinf-royxati";
    var USED_KEY = "ka-sinf-royxati-used";
    var DEFAULT_NAMES = [
      "Abduhalilova Shukrona",
      "Abdurahimova Zulayho",
      "Ahmadilyev Muhammadrizo",
      "Ahmadjonov Abdulloh",
      "Ahmadzulunov Abdunazar",
      "Alixonova Muqaddasxon",
      "Ashurboyev Saydjalol",
      "Bahodirjonova Sojida",
      "Begijonova Robiya",
      "Ibragimova Shoxsanam",
      "Ma'rufjonov Nabijon",
      "Madaminxojayeva Munisa",
      "Muxtorjonova Oydinoy",
      "Nizomov Muhammadaziz",
      "O'ktamova Shirinoy",
      "Odiljonov Ubaydulloh",
      "Qobiljonova Mohlaroy",
      "Qodirjonov Muhammadali",
      "Qosimov Muhammadrasul",
      "Rafuqjonov Abdulboriy",
      "Rafuqjonov Abdurahmon",
      "Sobirov Muhammadsodiq",
      "Tolqinboyev Abdulloh",
      "Tolqinboyeva Oisha",
      "Ubaydullayev Muhammadyusuf",
      "Yoqubjonov Mominjon",
      "Ziyohiddinova Oisha"
    ];
    var names = [];
    var used = [];
    var spinning = false;

    function loadNames() {
      try {
        var raw = localStorage.getItem(STORE_KEY);
        names = raw ? JSON.parse(raw) : DEFAULT_NAMES.slice();
        if (!raw) { try { localStorage.setItem(STORE_KEY, JSON.stringify(names)); } catch (e) {} }
      } catch (e) { names = DEFAULT_NAMES.slice(); }
      try {
        var rawUsed = sessionStorage.getItem(USED_KEY);
        used = rawUsed ? JSON.parse(rawUsed) : [];
      } catch (e) { used = []; }
      namesInput.value = names.join("\n");
    }

    function saveNames() {
      names = namesInput.value
        .split("\n")
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
      try { localStorage.setItem(STORE_KEY, JSON.stringify(names)); } catch (e) {}
      used = [];
      try { sessionStorage.setItem(USED_KEY, JSON.stringify(used)); } catch (e) {}
    }

    function pickPool() {
      if (!noRepeatBox.checked) return names;
      var pool = names.filter(function (n) { return used.indexOf(n) === -1; });
      if (pool.length === 0) {
        used = []; // hammasi chiqdi — aylanadan qayta boshlaymiz
        pool = names;
      }
      return pool;
    }

    function beep(freq, dur) {
      try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        if (!beep.ctx) beep.ctx = new Ctx();
        var ctx = beep.ctx;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        gain.gain.value = 0.05;
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch (e) {}
      if (navigator.vibrate) navigator.vibrate(8);
    }

    function spin() {
      if (spinning) return;
      if (names.length === 0) {
        nameEl.textContent = "Avval ismlarni kiriting";
        namesPanel.hidden = false;
        return;
      }
      spinning = true;
      spinBtn.disabled = true;
      nameEl.classList.add("is-spinning");

      var pool = pickPool();
      var finalName = pool[Math.floor(Math.random() * pool.length)];

      // Ease-out sekinlashish + o'rtada bitta "fake-out" sakrash —
      // bir ismda to'xtayotgandek bo'lib, birdan boshqasiga otilib ketadi.
      var baseDelay = 45;
      var totalTicks = 22 + Math.floor(Math.random() * 5);
      var fakeOutAt = totalTicks - (3 + Math.floor(Math.random() * 2)); // oxiridan 3-4 tik oldin
      var tick = 0;

      function step() {
        var randomName;
        if (tick === totalTicks) {
          randomName = finalName;
        } else if (tick === fakeOutAt) {
          // "to'xtayotgandek" bo'lib, tasodifan boshqa ismga sakraydi
          var others = names.filter(function (n) { return n !== finalName; });
          randomName = others.length ? others[Math.floor(Math.random() * others.length)] : finalName;
        } else {
          randomName = names[Math.floor(Math.random() * names.length)];
        }
        nameEl.textContent = randomName;

        var progress = tick / totalTicks;
        var delay;
        if (tick < fakeOutAt - 2) {
          // 1: asta-sekin sekinlashish (ease-out)
          delay = baseDelay * Math.pow(1.14, tick);
        } else if (tick < fakeOutAt) {
          // sekinlashish avjida — "hozir to'xtaydi" hissi
          delay = baseDelay * Math.pow(1.14, fakeOutAt - 2) * 1.6;
        } else if (tick === fakeOutAt) {
          // 2: fake-out — birdan tezlashib sakraydi
          beep(320, 0.05);
          delay = baseDelay * 0.7;
        } else {
          // sakragandan keyin yana ease-out bilan yakuniy to'xtash
          var afterFake = tick - fakeOutAt;
          delay = baseDelay * 1.3 * Math.pow(1.35, afterFake);
        }

        beep(tick === totalTicks ? 520 : 260 + progress * 120, tick === totalTicks ? 0.12 : 0.03);

        if (tick >= totalTicks) {
          nameEl.classList.remove("is-spinning");
          nameEl.classList.add("is-landed");
          window.setTimeout(function () { nameEl.classList.remove("is-landed"); }, 380);
          if (noRepeatBox.checked) {
            used.push(finalName);
            try { sessionStorage.setItem(USED_KEY, JSON.stringify(used)); } catch (e) {}
          }
          spinning = false;
          spinBtn.disabled = false;
          return;
        }
        tick++;
        window.setTimeout(step, delay);
      }

      step();
    }

    spinBtn.addEventListener("click", spin);
    listBtn.addEventListener("click", function () {
      namesPanel.hidden = !namesPanel.hidden;
    });
    namesSave.addEventListener("click", function () {
      saveNames();
      namesPanel.hidden = true;
      nameEl.textContent = "Tayyor";
    });

    loadNames();
  });
})();

/* ---- manba: js/features/progress.js ---- */
/**
 * Jonli Algebra — progress
 * readyIds: ochilgan (tayyor) darslar
 * localStorage: o‘quvchi “ko‘rgan / o‘tgan” holati
 */
(function () {
  "use strict";

  var KEY = "korinadigan-algebra-progress";
  var TOTAL = 38;

  /**
   * Tayyor darslar ro‘yxati.
   * Dars to‘liq yozilib, sinovdan o‘tgach shu yerga raqam qo‘shiladi.
   * Misol: return [1, 2, 3, 4, 5, 6];
   * Hozir poydevor — hech narsa ochilmagan.
   */
  function readyIds() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  }

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      return data && typeof data === "object" ? data : {};
    } catch (e) {
      return {};
    }
  }

  function write(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      // private mode / quota
    }
  }

  function num(id) {
    return Number(id);
  }

  window.KA = {
    readyIds: readyIds,

    isReady: function (id) {
      return this.readyIds().indexOf(num(id)) !== -1;
    },

    markSeen: function (id) {
      id = num(id);
      if (!id) return;
      var data = read();
      data[id] = Object.assign({}, data[id], { seen: true, at: Date.now() });
      write(data);
    },

    markDone: function (id) {
      id = num(id);
      if (!id) return;
      var data = read();
      data[id] = Object.assign({}, data[id], { done: true, at: Date.now() });
      write(data);
    },

    state: function (id) {
      id = num(id);
      var data = read();
      if (data[id] && data[id].done) return "done";
      if (this.isReady(id)) return "ready";
      return "soon";
    },

    counts: function () {
      var data = read();
      var ready = this.readyIds().length;
      var done = 0;
      for (var k in data) {
        if (data[k] && data[k].done) done++;
      }
      return {
        total: TOTAL,
        ready: ready,
        done: done
      };
    },

    /** Dars ochilganda chaqirish mumkin */
    onLessonOpen: function (id) {
      if (this.isReady(id)) this.markSeen(id);
    }
  };
})();

/* ---- manba: js/features/sahna-expand.js ---- */
/**
 * Sahnani butun ekranga yoyish — istalgan sahna turi bilan ishlaydi,
 * chizma turiga (parabola, doska, boshqa) bog'liq emas.
 */
window.KA_SAHNA_EXPAND = (function () {
  "use strict";

  function init() {
    var stage = document.getElementById("sahna");
    var btn = document.getElementById("sahnaExpandBtn");
    if (!stage || !btn) return;

    var iconExpand = btn.querySelector(".icon-expand");
    var iconCollapse = btn.querySelector(".icon-collapse");
    var CLOSE_MS = 200; // .sahna-closing animatsiyasi davomiyaligi bilan mos

    function setVh() {
      document.documentElement.style.setProperty("--vh", (window.innerHeight * 0.01) + "px");
    }
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);

    function requestFs() {
      try {
        var req = stage.requestFullscreen || stage.webkitRequestFullscreen;
        if (req) req.call(stage);
      } catch (e) {}
    }
    function exitFs() {
      try {
        var exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (document.fullscreenElement && exit) exit.call(document);
      } catch (e) {}
    }

    var closeTimer = null;

    function setExpanded(on) {
      clearTimeout(closeTimer);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Kichraytirish" : "Butun ekranga yoyish");
      if (iconExpand) iconExpand.hidden = on;
      if (iconCollapse) iconCollapse.hidden = !on;

      if (on) {
        stage.classList.remove("sahna-closing");
        stage.classList.add("sahna-expanded");
        document.documentElement.classList.add("sahna-lock");
        document.body.classList.add("sahna-lock");
        setVh();
        requestFs();
      } else {
        stage.classList.add("sahna-closing");
        document.documentElement.classList.remove("sahna-lock");
        document.body.classList.remove("sahna-lock");
        exitFs();
        closeTimer = setTimeout(function () {
          stage.classList.remove("sahna-expanded", "sahna-closing");
        }, CLOSE_MS);
      }
    }

    btn.addEventListener("click", function () {
      setExpanded(!stage.classList.contains("sahna-expanded"));
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && stage.classList.contains("sahna-expanded")) setExpanded(false);
    });

    document.addEventListener("fullscreenchange", function () {
      if (!document.fullscreenElement && stage.classList.contains("sahna-expanded")) {
        setExpanded(false);
      }
    });
  }

  return { init: init };
})();

/* ---- manba: js/features/sound-effects.js ---- */
/**
 * Jonli Algebra — Web Audio API Tovush Sintezatori (0 KB audio fayl)
 * Tashqi fayllarsiz toza chastotali sintez: To'g'ri (Chime), Xato (Thud), G'alaba (Fanfare).
 */
(function () {
  "use strict";

  var SOUND_KEY = "ja_sound";
  var ctx = null;

  function getAudioContext() {
    if (!ctx) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(function () {});
    }
    return ctx;
  }

  function isMuted() {
    try {
      return localStorage.getItem(SOUND_KEY) === "off";
    } catch (e) {
      return false;
    }
  }

  function setMuted(muted) {
    try {
      localStorage.setItem(SOUND_KEY, muted ? "off" : "on");
    } catch (e) {}
    updateSoundButtons();
  }

  function toggleMute() {
    setMuted(!isMuted());
  }

  function updateSoundButtons() {
    var muted = isMuted();
    document.querySelectorAll(".sound-toggle-btn").forEach(function (btn) {
      btn.setAttribute("aria-label", muted ? "Tovushni yoqish" : "Tovushni o'chirish");
      btn.title = muted ? "Tovush o'chirilgan" : "Tovush yoqilgan";
      var icon = btn.querySelector(".sound-icon");
      if (icon) {
        if (muted) {
          // Volume-x SVG
          icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
        } else {
          // Volume-2 SVG
          icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        }
      }
    });
  }

  // To'g'ri javob uchun: Mayin uch ovozli akkord (C5, E5, G5)
  function playCorrect() {
    if (isMuted()) return;
    var ac = getAudioContext();
    if (!ac) return;

    var notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    var now = ac.currentTime;

    notes.forEach(function (freq, i) {
      var osc = ac.createOscillator();
      var gain = ac.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.001, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.55);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.6);
    });
  }

  // Xato javob uchun: Yumshoq past chastotali tebranish
  function playError() {
    if (isMuted()) return;
    var ac = getAudioContext();
    if (!ac) return;

    var now = ac.currentTime;
    var osc = ac.createOscillator();
    var gain = ac.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.28);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // G'alaba tantanasi (Fanfare)
  function playFanfare() {
    if (isMuted()) return;
    var ac = getAudioContext();
    if (!ac) return;

    var melody = [
      { f: 523.25, t: 0.0, d: 0.12 }, // C5
      { f: 659.25, t: 0.14, d: 0.12 }, // E5
      { f: 783.99, t: 0.28, d: 0.14 }, // G5
      { f: 1046.50, t: 0.44, d: 0.45 } // C6
    ];

    var now = ac.currentTime;
    melody.forEach(function (note) {
      var osc = ac.createOscillator();
      var gain = ac.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.001, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.22, now + note.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d + 0.05);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateSoundButtons();
    document.querySelectorAll(".sound-toggle-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        // User gesture unlocks audio context on mobile
        getAudioContext();
        toggleMute();
      });
    });
  });

  window.JA_SOUND = {
    playCorrect: playCorrect,
    playError: playError,
    playFanfare: playFanfare,
    isMuted: isMuted,
    setMuted: setMuted,
    toggleMute: toggleMute
  };
})();

/* ---- manba: js/features/whiteboard.js ---- */
/* Jonli Algebra — Whiteboard
   OLIB TASHLANDI (2026-09-11)

   Sabab:
   - UHD board hardware jihatdan kuchli emas (kuchli GPU/CPU yo'q)
   - Intensiv canvas rendering uchun yetarli emas
   - 154 ta dropped frame, eng past 1 FPS
   - Foydalanuvchi qalam bilan chizganda ekranda chizish orqasidan qolib ketadi
   - UX butunlay ishlatib bo'lmaydigan holatga keladi

   Bu fayl endi hech narsa qilmaydi. features.js dan ham olib tashlangan.
*/
(function () {
  "use strict";
  // disabled
})();

/* ---- manba: js/features/xulosa-board.js ---- */
/* Jonli Algebra — Xulosa (proyektor uchun katta doska)
   Faqat ochish/yopish logikasi umumiy — matn (formulalar, ro'yxat)
   har darsda #xulosaBoard ichida HTML orqali beriladi.
   #xulosaBoardBtn / #xulosaBoard / #xulosaBoardClose ID'lari
   sahifada bo'lsa, avtomatik ulanadi. */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var openBtn = document.getElementById("xulosaBoardBtn");
    var board = document.getElementById("xulosaBoard");
    var closeBtn = document.getElementById("xulosaBoardClose");
    if (!openBtn || !board) return;

    function open() { board.hidden = false; }
    function close() { board.hidden = true; }

    openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    board.addEventListener("click", function (e) {
      if (e.target === board) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !board.hidden) close();
    });
  });
})();
