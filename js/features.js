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

  var ICON_MONITOR = '<svg class="svg-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right:6px;vertical-align:-2px;"><rect x="3" y="4" width="18" height="13" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';
  var ICON_CHECK = '<svg class="svg-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right:6px;vertical-align:-2px;"><polyline points="20 6 9 17 4 12"></polyline></svg>';

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

  function updateFavicon(theme) {
    try {
      var isDark = theme === "dark";
      var bg = isDark ? "%23131a16" : "%23f3eee4";
      var grid = isDark ? "%2326332a" : "%23d7cfc0";
      var curve = isDark ? "%23f0f4f1" : "%231a221c";
      var dot = isDark ? "%23e8633e" : "%23c24b2a";
      var svgUri = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="108" fill="' + bg + '"/><g stroke="' + grid + '" stroke-width="4" stroke-dasharray="8 8"><line x1="56" y1="256" x2="456" y2="256"/><line x1="256" y1="56" x2="256" y2="456"/></g><path d="M 96 110 Q 256 460 416 110" fill="none" stroke="' + curve + '" stroke-width="28" stroke-linecap="round"/><circle cx="256" cy="372" r="22" fill="' + dot + '"/><circle cx="256" cy="372" r="32" fill="none" stroke="' + dot + '" stroke-width="4" stroke-opacity="0.4"/></svg>';
      var link = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
      if (link) {
        link.setAttribute("href", svgUri);
      }
    } catch (e) {}
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    updateButtons(theme);
    updateFavicon(theme);
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

/* ---- manba: js/features/doska-lightbox.js ---- */
// Doskada namuna yechish rasmlari lightbox'i (navigatsiya, prev/next, redo/boshidan, tungi e-ink)
(function () {
  "use strict";

  var items = []; // { src, alt, caption }
  var currentIdx = 0;
  var bound = false;
  var lb, lbImg, lbCap, lbNavLabel, lbClose, prevBtn, nextBtn, resetBtn, invertBtn, invertLabel, wrapEl;
  var isInverted = false;

  function setDisabled(btn, disabled) {
    if (!btn) return;
    btn.disabled = !!disabled;
  }

  function collectItems() {
    var links = document.querySelectorAll("a.doska-img");
    items = [];
    Array.prototype.forEach.call(links, function (a, i) {
      var img = a.querySelector("img");
      var captionEl = a.parentElement ? a.parentElement.querySelector(".doska-img-cap") : null;
      var caption = a.getAttribute("data-caption") || (captionEl ? captionEl.textContent.trim() : "") || (img ? img.alt : "");
      var src = a.getAttribute("href") || (img ? img.src : "");
      items.push({
        src: src,
        alt: img ? img.alt : caption,
        caption: caption
      });

      a.removeAttribute("target");
      if (!a.getAttribute("data-doska-lb-bound")) {
        a.setAttribute("data-doska-lb-bound", "1");
        a.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          open(i);
        });
      }
    });
  }

  function applyInvert(invert) {
    isInverted = !!invert;
    if (wrapEl) wrapEl.classList.toggle("is-inverted", isInverted);
    if (invertLabel) {
      invertLabel.textContent = isInverted ? "Tungi e-ink" : "Asl nusxa";
    }
  }

  function render(idx) {
    if (items.length === 0) collectItems();
    if (!lbImg || items.length === 0) return;
    currentIdx = Math.max(0, Math.min(idx, items.length - 1));
    var cur = items[currentIdx];

    lbImg.src = cur.src;
    lbImg.alt = cur.alt || cur.caption || "Namuna masalasi";
    if (lbCap) {
      lbCap.textContent = cur.caption || "";
      lbCap.hidden = !cur.caption;
    }
    if (lbNavLabel) {
      lbNavLabel.textContent = (currentIdx + 1) + " / " + items.length;
    }

    setDisabled(prevBtn, currentIdx === 0);
    setDisabled(nextBtn, currentIdx === items.length - 1);
  }

  function goNext() {
    if (currentIdx < items.length - 1) {
      render(currentIdx + 1);
    }
  }

  function goPrev() {
    if (currentIdx > 0) {
      render(currentIdx - 1);
    }
  }

  function goReset() {
    render(0);
  }

  function open(idx) {
    collectItems();
    if (!lb || items.length === 0) return;
    render(typeof idx === "number" ? idx : 0);
    lb.hidden = false;
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!lb) return;
    lb.classList.remove("is-open");
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lbImg) lbImg.src = "";
  }

  function init() {
    lb = document.getElementById("doskaLightbox");
    lbImg = document.getElementById("doskaLightboxImg");
    lbCap = document.getElementById("doskaLightboxCap");
    lbNavLabel = document.getElementById("doskaNavLabel");
    lbClose = document.getElementById("doskaLightboxClose");
    prevBtn = document.getElementById("doskaLbPrev");
    nextBtn = document.getElementById("doskaLbNext");
    resetBtn = document.getElementById("doskaLbReset");
    invertBtn = document.getElementById("doskaLbInvert");
    invertLabel = document.getElementById("doskaLbInvertLabel");
    wrapEl = document.getElementById("doskaLightboxWrap");

    if (!lb) return;

    collectItems();

    if (bound) return;
    bound = true;

    if (lbClose) lbClose.addEventListener("click", close);
    if (prevBtn) prevBtn.addEventListener("click", goPrev);
    if (nextBtn) nextBtn.addEventListener("click", goNext);
    if (resetBtn) resetBtn.addEventListener("click", goReset);
    if (invertBtn) {
      invertBtn.addEventListener("click", function (e) {
        e.preventDefault();
        applyInvert(!isInverted);
      });
    }

    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden || !lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Home" || e.key.toLowerCase() === "r") goReset();
    });

    // Touch swipe
    if (wrapEl) {
      var touchStartX = null;
      var touchStartY = null;
      wrapEl.addEventListener("touchstart", function (e) {
        var t = e.touches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
      }, { passive: true });
      wrapEl.addEventListener("touchend", function (e) {
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
    }
  }

  // Global delegation: har qanday a.doska-img bosilganda hech qachon yangi tab ochilmaydi
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a.doska-img") : null;
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    collectItems();
    var all = document.querySelectorAll("a.doska-img");
    var targetIdx = 0;
    for (var i = 0; i < all.length; i++) {
      if (all[i] === a) {
        targetIdx = i;
        break;
      }
    }
    open(targetIdx);
  });

  window.KA_DOSKA_LIGHTBOX = {
    init: init,
    open: open,
    close: close
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
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

  // Shuffle helper: randomizes options so correct answer is not always first option (A)
  function shuffleQuestionOptions(q) {
    var originalCorrect = q.correct || 0;
    var correctText = q.options[originalCorrect];
    var indexed = q.options.map(function (opt, idx) {
      return { text: opt, isCorrect: idx === originalCorrect };
    });
    for (var i = indexed.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = indexed[i];
      indexed[i] = indexed[j];
      indexed[j] = temp;
    }
    var newOptions = indexed.map(function (item) { return item.text; });
    var newCorrect = 0;
    for (var k = 0; k < indexed.length; k++) {
      if (indexed[k].isCorrect) {
        newCorrect = k;
        break;
      }
    }
    return {
      q: q.q,
      options: newOptions,
      correct: newCorrect,
      topic: q.topic,
      explanation: q.explanation || ("To'g'ri javob: " + correctText)
    };
  }

  // Litsey Kirish Imtihoni (Full 60-min Westminster ALWIUT / PM / WIUT Mock Simulator)
  function generateLyceumMock() {
    var tests = [];
    // Har bir bobdan 5 tadan savol olib, jami 25 ta keng qamrovli test hosil qilamiz (5 bob x 5 = 25)
    for (var ch = 1; ch <= 5; ch++) {
      var chQuestions = CHAPTER_EXAMS[ch].questions.slice();
      for (var ci = chQuestions.length - 1; ci > 0; ci--) {
        var cj = Math.floor(Math.random() * (ci + 1));
        var ctmp = chQuestions[ci];
        chQuestions[ci] = chQuestions[cj];
        chQuestions[cj] = ctmp;
      }
      var picked = chQuestions.slice(0, 5).map(shuffleQuestionOptions);
      tests = tests.concat(picked);
    }
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
  var activeBlurListener = null;
  var blurCount = 0;

  function escapeXml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function getDisplayName() {
    try {
      if (window.JA_STATE && window.JA_STATE.get) {
        var st = window.JA_STATE.get();
        if (st && st.user && st.user.displayName) return st.user.displayName;
      }
    } catch (e) {}
    return "Yosh Matematik";
  }

  // Vektor SVG Mahorat Sertifikatini Dinamik Sintez Qilish (Printable Certificate)
  function generateCertificateSvg(name, chapterTitle, percent, certId) {
    var cleanName = escapeXml(name || getDisplayName());
    var cleanTitle = escapeXml(chapterTitle || "9-Sinf Algebra Kursor");
    var d = new Date();
    var dateStr = d.toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" });
    var cleanCertId = escapeXml(certId || "JA-CERT-" + Math.floor(100000 + Math.random() * 900000));

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" width="100%" height="100%" style="display:block; width:100%; max-width:800px; height:auto; margin:0 auto; font-family:\'Lora\', Georgia, serif; background:#fdfbf7; border-radius:12px; box-shadow:0 12px 36px rgba(0,0,0,0.12);">' +
      '<defs>' +
        '<linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#b8860b" />' +
          '<stop offset="50%" stop-color="#ffd700" />' +
          '<stop offset="100%" stop-color="#b8860b" />' +
        '</linearGradient>' +
      '</defs>' +
      '<!-- Tashqi chegara -->' +
      '<rect x="20" y="20" width="760" height="520" rx="8" fill="none" stroke="#2b6b4f" stroke-width="4" />' +
      '<rect x="28" y="28" width="744" height="504" rx="6" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="6,4" />' +
      '<!-- Burchak naqshlari -->' +
      '<path d="M36 50 L50 36 M36 36 L64 36 M36 36 L36 64" fill="none" stroke="#2b6b4f" stroke-width="2" />' +
      '<path d="M764 50 L750 36 M764 36 L736 36 M764 36 L764 64" fill="none" stroke="#2b6b4f" stroke-width="2" />' +
      '<path d="M36 510 L50 524 M36 524 L64 524 M36 524 L36 496" fill="none" stroke="#2b6b4f" stroke-width="2" />' +
      '<path d="M764 510 L750 524 M764 524 L736 524 M764 524 L764 496" fill="none" stroke="#2b6b4f" stroke-width="2" />' +
      '<!-- Sarlavha -->' +
      '<text x="400" y="78" text-anchor="middle" font-size="13" letter-spacing="4" fill="#2b6b4f" font-weight="700">JONLI ALGEBRA &bull; MILLIY TA\'LIM PLATFORMASI</text>' +
      '<text x="400" y="128" text-anchor="middle" font-size="30" font-weight="800" fill="#1a221c" letter-spacing="2">MAHORAT SERTIFIKATI</text>' +
      '<line x1="280" y1="142" x2="520" y2="142" stroke="#d4af37" stroke-width="2" />' +
      '<!-- Matn -->' +
      '<text x="400" y="180" text-anchor="middle" font-size="14" fill="#4a554c" font-style="italic">Ushbu sertifikat algebra fanini a\'lo darajada o\'zlashtirgani uchun topshiriladi:</text>' +
      '<!-- O\'quvchi ismi -->' +
      '<text x="400" y="230" text-anchor="middle" font-size="28" font-weight="700" fill="#c24b2a">' + cleanName + '</text>' +
      '<line x1="220" y1="244" x2="580" y2="244" stroke="#1a221c" stroke-width="0.8" />' +
      '<!-- Bob va Natija -->' +
      '<text x="400" y="286" text-anchor="middle" font-size="15" fill="#1a221c" font-weight="600">' + cleanTitle + '</text>' +
      '<text x="400" y="316" text-anchor="middle" font-size="14" fill="#4a554c">Yakuniy nazorat imtihonidan <tspan font-weight="700" fill="#2b6b4f">' + percent + '%</tspan> ball to\'plab, bobni to\'liq o\'zlashtirdi.</text>' +
      '<!-- Muhr (Medallion Seal) -->' +
      '<g transform="translate(400, 410)">' +
        '<circle cx="0" cy="0" r="44" fill="#fcf9ee" stroke="url(#goldGrad)" stroke-width="3" />' +
        '<circle cx="0" cy="0" r="38" fill="none" stroke="#2b6b4f" stroke-width="1.2" stroke-dasharray="3,2" />' +
        '<path d="M0 -16 L5 -5 L16 -5 L7 3 L11 15 L0 8 L-11 15 L-7 3 L-16 -5 L-5 -5 Z" fill="url(#goldGrad)" />' +
        '<text x="0" y="24" text-anchor="middle" font-size="7.5" letter-spacing="1.5" font-weight="700" fill="#2b6b4f">TASDIQLANGAN</text>' +
      '</g>' +
      '<!-- Chap Imzo -->' +
      '<g transform="translate(140, 430)">' +
        '<line x1="0" y1="0" x2="160" y2="0" stroke="#4a554c" stroke-width="1" />' +
        '<text x="80" y="18" text-anchor="middle" font-size="11" fill="#1a221c" font-weight="600">Jonli Algebra Kengashi</text>' +
        '<text x="80" y="32" text-anchor="middle" font-size="9.5" fill="#4a554c">Metodik Baholash Hay\'ati</text>' +
      '</g>' +
      '<!-- O\'ng Sana va ID -->' +
      '<g transform="translate(500, 430)">' +
        '<line x1="0" y1="0" x2="160" y2="0" stroke="#4a554c" stroke-width="1" />' +
        '<text x="80" y="18" text-anchor="middle" font-size="11" fill="#1a221c" font-weight="600">Sana: ' + dateStr + '</text>' +
        '<text x="80" y="32" text-anchor="middle" font-size="9.5" fill="#4a554c">ID: ' + cleanCertId + '</text>' +
      '</g>' +
    '</svg>';
  }

  function getOrCreateModalDialog() {
    var dialog = document.getElementById("examModalDialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "examModalDialog";
      dialog.className = "exam-modal";
      dialog.style.cssText = "width:94%; max-width:880px; max-height:92vh; border:1px solid var(--line-strong); border-radius:12px; padding:24px; box-shadow:none; background:var(--white, #fff); color:var(--ink, #1a221c); overflow-y:auto; margin:auto;";
      document.body.appendChild(dialog);
    }
    return dialog;
  }

  function startChapterExam(bobId, containerEl) {
    var rawExam = CHAPTER_EXAMS[bobId];
    if (!rawExam) return;

    var exam = {
      bobId: rawExam.bobId,
      title: rawExam.title,
      badgeId: rawExam.badgeId,
      durationSec: rawExam.durationSec,
      questions: rawExam.questions.map(shuffleQuestionOptions)
    };

    var targetBox = containerEl;
    var dialogMode = false;

    if (!targetBox) {
      targetBox = getOrCreateModalDialog();
      dialogMode = true;
    }

    currentExam = {
      type: "chapter",
      bobId: bobId,
      data: exam,
      userAnswers: {},
      remainingSec: exam.durationSec,
      totalSec: exam.durationSec,
      container: targetBox,
      isDialog: dialogMode
    };

    if (dialogMode && typeof targetBox.showModal === "function") {
      targetBox.showModal();
    }

    renderExamUI();
  }

  function startLyceumMock(containerEl) {
    var mock = generateLyceumMock();
    var targetBox = containerEl;
    var dialogMode = false;

    if (!targetBox) {
      targetBox = getOrCreateModalDialog();
      dialogMode = true;
    }

    blurCount = 0;
    if (activeBlurListener) window.removeEventListener("blur", activeBlurListener);
    activeBlurListener = function () {
      blurCount++;
      var toast = document.getElementById("mockBlurWarningToast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "mockBlurWarningToast";
        toast.style.cssText = "position:fixed; top:24px; left:50%; transform:translateX(-50%); background:#c24b2a; color:#fff; padding:12px 24px; border-radius:8px; font-weight:700; z-index:999999; box-shadow:0 6px 20px rgba(0,0,0,0.25); display:flex; align-items:center; gap:8px;";
        document.body.appendChild(toast);
      }
      toast.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>' +
        'Diqqat: Oynadan chalg\'ish qayd etildi (' + blurCount + ' marta). Imtihon qoidalariga rioya qiling!';
      toast.style.display = "flex";
      setTimeout(function () {
        if (toast) toast.style.display = "none";
      }, 4500);
    };
    window.addEventListener("blur", activeBlurListener);

    currentExam = {
      type: "mock",
      data: mock,
      userAnswers: {},
      writtenAnswers: {},
      remainingSec: mock.durationSec,
      totalSec: mock.durationSec,
      container: targetBox,
      isDialog: dialogMode
    };

    if (dialogMode && typeof targetBox.showModal === "function") {
      targetBox.showModal();
    }

    renderMockUI();
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function updateTimerUrgency(badgeEl, remainingSec, totalSec) {
    if (!badgeEl) return;
    var ratio = remainingSec / (totalSec || 1);
    if (ratio > 0.5) {
      badgeEl.style.borderColor = "var(--accent-2, #2b6b4f)";
      badgeEl.style.color = "var(--accent-2, #2b6b4f)";
      badgeEl.classList.remove("is-urgent");
    } else if (ratio > 0.2) {
      badgeEl.style.borderColor = "#e67e22";
      badgeEl.style.color = "#e67e22";
      badgeEl.classList.remove("is-urgent");
    } else {
      badgeEl.style.borderColor = "#d9534f";
      badgeEl.style.color = "#d9534f";
      badgeEl.classList.add("is-urgent");
    }
  }

  function renderExamUI() {
    if (!currentExam) return;
    var exam = currentExam.data;
    var box = currentExam.container;
    box.innerHTML = "";

    var header = document.createElement("div");
    header.className = "exam-session-header";
    header.innerHTML =
      '<div class="exam-header-inner">' +
        '<div class="exam-title-wrap">' +
          '<h3 class="exam-title">' + exam.title + '</h3>' +
          '<div class="exam-meta-text">10 ta masala · 15 daqiqa</div>' +
        '</div>' +
        '<div class="exam-header-controls">' +
          '<div class="exam-timer-badge" id="examTimerBadge" title="Qolgan vaqt">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
            '<span id="examTimerDisplay">' + formatTime(currentExam.remainingSec) + '</span>' +
          '</div>' +
          (currentExam.isDialog ? '<button type="button" class="modal-close-btn" id="examCloseBtn" aria-label="Chiqish" title="Imtihondan chiqish"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>' : '') +
        '</div>' +
      '</div>';
    box.appendChild(header);

    if (currentExam.isDialog) {
      var closeBtn = header.querySelector("#examCloseBtn");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          if (confirm("Imtihondan chiqmoqchimisiz? Natijalar saqlanmaydi.")) {
            if (timerInterval) clearInterval(timerInterval);
            currentExam = null;
            box.close();
          }
        });
      }
    }

    // Question Navigation Matrix (Jump-to-question pills)
    var matrixWrap = document.createElement("div");
    matrixWrap.className = "exam-jump-matrix";
    matrixWrap.style.cssText = "display:flex; flex-wrap:wrap; gap:6px; margin-bottom:18px; padding:10px 14px; background:var(--paper); border:1px solid var(--line); border-radius:10px;";
    exam.questions.forEach(function (q, idx) {
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "exam-nav-pill";
      pill.id = "examPill_" + idx;
      pill.textContent = idx + 1;
      pill.style.cssText = "width:32px; height:32px; border-radius:6px; border:1px solid var(--line-strong); background:var(--white); color:var(--ink); font-weight:700; font-size:0.85rem; cursor:pointer; transition:all 0.15s ease;";
      pill.addEventListener("click", function () {
        var card = document.getElementById("examCard_" + idx);
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      matrixWrap.appendChild(pill);
    });
    box.appendChild(matrixWrap);

    var qList = document.createElement("div");
    qList.className = "exam-q-list";

    exam.questions.forEach(function (q, idx) {
      var qCard = document.createElement("div");
      qCard.id = "examCard_" + idx;
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
          var pill = document.getElementById("examPill_" + idx);
          if (pill) {
            pill.style.background = "var(--accent-2, #2b6b4f)";
            pill.style.color = "#ffffff";
            pill.style.borderColor = "var(--accent-2, #2b6b4f)";
          }
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
      var badge = document.getElementById("examTimerBadge");
      if (disp) disp.textContent = formatTime(currentExam.remainingSec);
      if (badge) updateTimerUrgency(badge, currentExam.remainingSec, currentExam.totalSec);

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

    // Gamification rewards & state machine persistence
    if (window.JA_STATE) {
      window.JA_STATE.update(function (st) {
        if (!st.progress.chapterExams) st.progress.chapterExams = {};
        st.progress.chapterExams[exam.bobId] = {
          score: correctCount,
          total: total,
          timestamp: Date.now(),
          passed: isPassed
        };
      });
    }

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

    var certId = "JA-" + exam.bobId + "-" + Math.floor(100000 + Math.random() * 900000);
    var certSvg = isPassed ? generateCertificateSvg(getDisplayName(), exam.title, percent, certId) : "";

    var box = currentExam.container;
    box.innerHTML =
      '<div class="exam-result-card" style="background:var(--white); border:2px solid ' + (isPassed ? "var(--accent-2)" : "var(--accent)") + '; border-radius:16px; padding:24px; text-align:center; box-shadow:0 8px 24px rgba(0,0,0,0.06);">' +
        '<div style="font-size:2.8rem; font-weight:800; color:' + (isPassed ? "var(--accent-2)" : "var(--accent)") + '; margin-bottom:8px;">' + percent + '%</div>' +
        '<h3 style="margin:0 0 12px; font-size:1.3rem;">' + (isPassed ? "Ofarin! Bobni a'lo darajada o'zlashtirdingiz!" : "Yaxshi natija, lekin hali takrorlash kerak!") + '</h3>' +
        '<p style="color:var(--ink-soft); font-size:1rem; margin-bottom:16px;">Jami <strong>' + total + '</strong> ta savoldan <strong>' + correctCount + '</strong> tasiga to\'g\'ri javob berdingiz.</p>' +
        (isPassed ? '<div style="background:rgba(43,107,79,0.1); color:var(--accent-2); padding:10px 16px; border-radius:10px; font-weight:700; margin-bottom:20px;">+100 XP va Bob Medali qo\'lga kiritildi!</div>' : '') +
        (weakTopics.length > 0 ? (
          '<div style="text-align:left; background:var(--paper); border:1px solid var(--line); border-radius:10px; padding:14px; margin:16px 0;">' +
            '<strong>Takrorlash tavsiya etiladigan mavzular:</strong>' +
            '<ul style="margin:8px 0 0; padding-left:20px; line-height:1.5;">' +
              weakTopics.map(function (t) { return '<li>' + t + '</li>'; }).join('') +
            '</ul>' +
          '</div>'
        ) : '') +
        (isPassed ? (
          '<div class="cert-presentation" style="margin:24px 0;">' +
            '<h4 style="margin:0 0 14px; font-size:1.1rem; color:var(--ink);">Rasmiy Mahorat Sertifikati</h4>' +
            '<div id="certPreviewWrap" style="overflow-x:auto; margin-bottom:16px;">' + certSvg + '</div>' +
            '<div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">' +
              '<button type="button" class="btn" id="btnPrintCertBtn" style="background:var(--accent-2); color:#fff; padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>' +
                'Chop Etish (Print / PDF)' +
              '</button>' +
              '<button type="button" class="btn" id="btnDownloadCertSvg" style="background:var(--white); border:1px solid var(--line-strong); color:var(--ink); padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>' +
                'SVG Yuklab Olish' +
              '</button>' +
            '</div>' +
          '</div>'
        ) : '') +
        '<div style="margin-top:20px;">' +
          '<button type="button" class="btn" onclick="location.reload()" style="background:var(--accent); color:#fff; padding:10px 24px; border-radius:8px; font-weight:600; cursor:pointer;">Qaytadan topshirish</button>' +
        '</div>' +
      '</div>';

    if (isPassed) {
      var printBtn = box.querySelector("#btnPrintCertBtn");
      if (printBtn) {
        printBtn.addEventListener("click", function () {
          var pWin = window.open("", "_blank");
          if (pWin) {
            pWin.document.write('<html><head><title>Mahorat Sertifikati — ' + escapeXml(getDisplayName()) + '</title><style>@page{size:landscape;margin:1cm;} body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;}</style></head><body>' + certSvg + '<script>window.onload=function(){window.print();};<\/script></body></html>');
            pWin.document.close();
          }
        });
      }
      var dlBtn = box.querySelector("#btnDownloadCertSvg");
      if (dlBtn) {
        dlBtn.addEventListener("click", function () {
          var blob = new Blob([certSvg], { type: "image/svg+xml;charset=utf-8" });
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "jonli-algebra-sertifikat-" + exam.bobId + ".svg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      }
    }
  }

  function renderMockUI() {
    if (!currentExam) return;
    var mock = currentExam.data;
    var box = currentExam.container;
    box.innerHTML = "";

    var header = document.createElement("div");
    header.className = "mock-session-header";
    header.innerHTML =
      '<div class="exam-header-inner">' +
        '<div class="exam-title-wrap">' +
          '<h3 class="exam-title">' + mock.title + '</h3>' +
          '<div class="exam-meta-text">30 ta test va yozma masala · 60 daqiqa</div>' +
        '</div>' +
        '<div class="exam-header-controls">' +
          '<div class="exam-timer-badge exam-timer-mock" id="mockTimerBadge" title="Qolgan vaqt">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
            '<span id="mockTimerDisplay">' + formatTime(currentExam.remainingSec) + '</span>' +
          '</div>' +
          (currentExam.isDialog ? '<button type="button" class="modal-close-btn" id="mockCloseBtn" aria-label="Chiqish" title="Simulyatsiyadan chiqish"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>' : '') +
        '</div>' +
      '</div>';
    box.appendChild(header);

    if (currentExam.isDialog) {
      var closeBtn = header.querySelector("#mockCloseBtn");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          if (confirm("Simulyatsiyadan chiqmoqchimisiz? Natijalar saqlanmaydi.")) {
            if (timerInterval) clearInterval(timerInterval);
            if (activeBlurListener) window.removeEventListener("blur", activeBlurListener);
            currentExam = null;
            box.close();
          }
        });
      }
    }

    // Jump-to-question matrix for mock exam (1..30)
    var matrixWrap = document.createElement("div");
    matrixWrap.className = "exam-jump-matrix";
    matrixWrap.style.cssText = "display:flex; flex-wrap:wrap; gap:5px; margin-bottom:18px; padding:10px 14px; background:var(--paper); border:1px solid var(--line); border-radius:10px;";
    for (var i = 0; i < 30; i++) {
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "mock-nav-pill";
      pill.id = "mockPill_" + i;
      pill.textContent = i + 1;
      pill.style.cssText = "width:30px; height:30px; border-radius:6px; border:1px solid var(--line-strong); background:var(--white); color:var(--ink); font-weight:700; font-size:0.8rem; cursor:pointer; transition:all 0.15s ease;";
      (function (idx) {
        pill.addEventListener("click", function () {
          var targetId = idx < 25 ? "mockTestCard_" + idx : "mockWrittenCard_" + (idx - 25);
          var card = document.getElementById(targetId);
          if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      })(i);
      matrixWrap.appendChild(pill);
    }
    box.appendChild(matrixWrap);

    // Render 25 Tests
    var testsBox = document.createElement("div");
    testsBox.innerHTML = '<h4 style="margin:20px 0 12px; color:var(--accent-2); border-bottom:2px solid var(--line); padding-bottom:6px;">I Qism: 25 ta Variantli Test</h4>';

    mock.tests.forEach(function (q, idx) {
      var qCard = document.createElement("div");
      qCard.id = "mockTestCard_" + idx;
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
          var pill = document.getElementById("mockPill_" + idx);
          if (pill) {
            pill.style.background = "var(--accent-2, #2b6b4f)";
            pill.style.color = "#ffffff";
            pill.style.borderColor = "var(--accent-2, #2b6b4f)";
          }
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
      wCard.id = "mockWrittenCard_" + wIdx;
      wCard.style.cssText = "background:var(--white); border:1px solid var(--line); border-radius:10px; padding:14px; margin-bottom:12px;";
      wCard.innerHTML = "<div style='font-weight:600; margin-bottom:8px;'><strong>" + (wIdx + 26) + ".</strong> " + w.q + "</div>";

      var inp = document.createElement("input");
      inp.type = "text";
      inp.placeholder = "Javobingizni kiriting...";
      inp.style.cssText = "width:100%; max-width:280px; padding:8px 12px; border:1px solid var(--line-strong); border-radius:6px; font-size:0.95rem; background:var(--paper);";
      inp.value = currentExam.writtenAnswers[wIdx] || "";
      inp.addEventListener("input", function () {
        var val = inp.value.trim();
        currentExam.writtenAnswers[wIdx] = val;
        var pill = document.getElementById("mockPill_" + (wIdx + 25));
        if (pill) {
          if (val) {
            pill.style.background = "var(--accent, #c24b2a)";
            pill.style.color = "#ffffff";
            pill.style.borderColor = "var(--accent, #c24b2a)";
          } else {
            pill.style.background = "var(--white)";
            pill.style.color = "var(--ink)";
            pill.style.borderColor = "var(--line-strong)";
          }
        }
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
      var badge = document.getElementById("mockTimerBadge");
      if (disp) disp.textContent = formatTime(currentExam.remainingSec);
      if (badge) updateTimerUrgency(badge, currentExam.remainingSec, currentExam.totalSec);

      if (currentExam.remainingSec <= 0) {
        clearInterval(timerInterval);
        finishMock();
      }
    }, 1000);
  }

  function finishMock() {
    if (timerInterval) clearInterval(timerInterval);
    if (activeBlurListener) {
      window.removeEventListener("blur", activeBlurListener);
      activeBlurListener = null;
    }
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

    // Update state store
    if (window.JA_STATE) {
      window.JA_STATE.update(function (st) {
        if (!st.progress.lyceumMock) st.progress.lyceumMock = { bestScore: 0, attempts: 0, lastTaken: 0 };
        st.progress.lyceumMock.attempts = (st.progress.lyceumMock.attempts || 0) + 1;
        st.progress.lyceumMock.bestScore = Math.max(st.progress.lyceumMock.bestScore || 0, totalScore);
        st.progress.lyceumMock.lastTaken = Date.now();
      });
    }

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

    var certId = "JA-MOCK-" + Math.floor(100000 + Math.random() * 900000);
    var certSvg = percent >= 80 ? generateCertificateSvg(getDisplayName(), "Litsey Kirish Imtihoni Simulyatori", percent, certId) : "";

    var box = currentExam.container;
    box.innerHTML =
      '<div class="mock-result-card" style="background:var(--white); border:2px solid var(--line-strong); border-radius:16px; padding:28px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.06);">' +
        '<div style="font-size:3rem; font-weight:800; color:var(--accent); margin-bottom:8px;">' + totalScore + ' / ' + maxScore + ' ball</div>' +
        '<div style="display:inline-block; background:rgba(194,75,42,0.1); color:var(--accent); font-weight:700; padding:6px 14px; border-radius:20px; margin-bottom:14px;">Umumiy natija: ' + percent + '%</div>' +
        '<h3 style="margin:0 0 10px; font-size:1.4rem;">' + rank + '</h3>' +
        '<p style="color:var(--ink-soft); max-width:600px; margin:0 auto 20px;">Test qismidan: <strong>' + testCorrect + ' / 25</strong>, Yozma qismidan: <strong>' + writtenCorrect + ' / 5</strong> to\'g\'ri yechildi.' +
        (blurCount > 0 ? '<br><span style="color:#c24b2a; font-size:0.9rem;">Imtihon paytida chalg\'ishlar: ' + blurCount + ' marta.</span>' : '') +
        '</p>' +
        (percent >= 80 ? (
          '<div class="cert-presentation" style="margin:24px 0;">' +
            '<h4 style="margin:0 0 14px; font-size:1.1rem; color:var(--ink);">Litsey Darajasi Sertifikati</h4>' +
            '<div id="mockCertPreviewWrap" style="overflow-x:auto; margin-bottom:16px;">' + certSvg + '</div>' +
            '<div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">' +
              '<button type="button" class="btn" id="btnPrintMockCertBtn" style="background:var(--accent); color:#fff; padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>' +
                'Chop Etish (Print / PDF)' +
              '</button>' +
              '<button type="button" class="btn" id="btnDownloadMockCertSvg" style="background:var(--white); border:1px solid var(--line-strong); color:var(--ink); padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>' +
                'SVG Yuklab Olish' +
              '</button>' +
            '</div>' +
          '</div>'
        ) : '') +
        '<button type="button" class="btn" onclick="location.reload()" style="background:var(--accent-2); color:#fff; padding:12px 28px; border-radius:8px; font-weight:700; cursor:pointer;">Bosh sahifaga qaytish</button>' +
      '</div>';

    if (percent >= 80) {
      var pBtn = box.querySelector("#btnPrintMockCertBtn");
      if (pBtn) {
        pBtn.addEventListener("click", function () {
          var pWin = window.open("", "_blank");
          if (pWin) {
            pWin.document.write('<html><head><title>Litsey Sertifikati — ' + escapeXml(getDisplayName()) + '</title><style>@page{size:landscape;margin:1cm;} body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;}</style></head><body>' + certSvg + '<script>window.onload=function(){window.print();};<\/script></body></html>');
            pWin.document.close();
          }
        });
      }
      var dBtn = box.querySelector("#btnDownloadMockCertSvg");
      if (dBtn) {
        dBtn.addEventListener("click", function () {
          var blob = new Blob([certSvg], { type: "image/svg+xml;charset=utf-8" });
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "jonli-algebra-litsey-sertifikat.svg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      }
    }
  }

  window.JA_EXAM = {
    CHAPTER_EXAMS: CHAPTER_EXAMS,
    startChapterExam: startChapterExam,
    startLyceumMock: startLyceumMock,
    generateCertificateSvg: generateCertificateSvg
  };
})();

/* ---- manba: js/features/formula-directory.js ---- */
/**
 * Jonli Algebra — Interaktiv Matematik Ontologiya va Formulalar Katalogi
 * Section IV: 60+ algebra formulalari, noaniq qidiruv va dars sahnasiga to'g'ridan-to'g'ri deep-linking.
 */
(function () {
  "use strict";

  // Formulalar va ularning parametrli deep-link xaritasi
  var PARAM_MAP = {
    "f-1": { lesson: 1, params: { a: 1, b: -2, c: -3 } },
    "f-2": { lesson: 2, params: { a: 1 } },
    "f-3": { lesson: 3, params: { a: 2 } },
    "f-4": { lesson: 4, params: { a: 1, b: -4, c: 3 } },
    "f-5": { lesson: 4, params: { a: 1, b: -4, c: 3 } },
    "f-6": { lesson: 5, params: { a: 1, p: 2, q: -1 } },
    "f-17": { lesson: 17, params: { t: 45 } },
    "f-18": { lesson: 18, params: { t: 60 } },
    "f-19": { lesson: 19, params: { t: 120 } },
    "f-24": { lesson: 24, params: { a: 30, b: 45 } },
    "f-25": { lesson: 25, params: { a: 30 } },
    "f-29": { lesson: 29, params: { a1: 2, d: 3 } },
    "f-31": { lesson: 31, params: { b1: 3, q: 2 } },
    "f-35": { lesson: 35, params: { n: 10, m: 3 } }
  };

  function getDeepLinkUrl(formula) {
    if (!formula) return "#";
    var base = formula.lessonLink || ("lessons/math/9/" + formula.lessonId + "/");
    var mapping = PARAM_MAP[formula.id];
    if (mapping && mapping.params) {
      var query = Object.keys(mapping.params).map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(mapping.params[k]);
      }).join("&");
      return base + "?" + query + "#sahna";
    }
    return base + "#sahna";
  }

  function searchFormulas(query, bobFilter) {
    var list = window.JA_FORMULALAR || [];
    var q = (query || "").toLowerCase().trim();
    var b = bobFilter === undefined || bobFilter === null ? "all" : String(bobFilter);

    return list.filter(function (f) {
      var matchBob = b === "all" || String(f.bob) === b;
      if (!matchBob) return false;
      if (!q) return true;

      return (
        (f.title && f.title.toLowerCase().indexOf(q) !== -1) ||
        (f.formula && f.formula.toLowerCase().indexOf(q) !== -1) ||
        (f.desc && f.desc.toLowerCase().indexOf(q) !== -1) ||
        (f.bobNom && f.bobNom.toLowerCase().indexOf(q) !== -1)
      );
    });
  }

  window.JA_FORMULA_DIRECTORY = {
    getDeepLinkUrl: getDeepLinkUrl,
    searchFormulas: searchFormulas,
    PARAM_MAP: PARAM_MAP
  };
})();

/* ---- manba: js/features/gamification.js ---- */
/**
 * Jonli Algebra — Gamifikatsiya va O'quvchi Motivatsiyasi (Duolingo-Style Retention)
 * Kinetic floating XP particles, Circadian streak engine, SVG Metallic Badge Foundry.
 */
(function () {
  "use strict";

  var BADGES = {
    "badge-parabola-master": {
      id: "badge-parabola-master",
      title: "Parabola va Funksiyalar Ustasi",
      desc: "I bobni 100% muvaffaqiyatli yakunlagan va kvadrat funksiyalarni to'liq o'zlashtirgan o'quvchi.",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>'
    },
    "badge-systems-virtuoso": {
      id: "badge-systems-virtuoso",
      title: "Tizimlar va Tengsizliklar Grossmeysteri",
      desc: "II bobni tugatib, chiziqli va kvadrat tenglamalar sistemalarini mohirona yechgan o'quvchi.",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>'
    },
    "badge-trig-luminary": {
      id: "badge-trig-luminary",
      title: "Trigonometriya Dahosi",
      desc: "III bob bo'yicha barcha trigonometrik ayniyatlar va keltirish formulalarini zabt etgan bilimdon.",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 3v9l6 3"></path></svg>'
    },
    "badge-progression-wizard": {
      id: "badge-progression-wizard",
      title: "Progressiyalar Sehrgari",
      desc: "IV bobning arifmetik va geometrik zanjirlarini hamda cheksiz yig'indilarni hisoblagan mutaxassis.",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>'
    },
    "badge-probability-analyst": {
      id: "badge-probability-analyst",
      title: "Ehtimollik va Statistika Tahlilchisi",
      desc: "V bob bo'yicha hodisalar ehtimolligi va statistik qonuniyatlarni mukammal tahlil qilgan o'quvchi.",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle><circle cx="8.5" cy="15.5" r="1.5"></circle><circle cx="15.5" cy="8.5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle></svg>'
    },
    "badge-lyceum-grandmaster": {
      id: "badge-lyceum-grandmaster",
      title: "Litseyga 100% Tayyor Gran-pri",
      desc: "Westminster, Prezident va Aniq fanlar litseylariga kirish uchun barcha 38 ta olimpiada masalasini zabt etgan o'quvchi!",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7"></path><path d="M14 14.66V17c0 .55.45 1 1 1h2"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>'
    }
  };

  // Legacy ID mapping
  var BADGE_ALIASES = {
    "bob-1": "badge-parabola-master",
    "bob-2": "badge-systems-virtuoso",
    "bob-3": "badge-trig-luminary",
    "bob-4": "badge-progression-wizard",
    "bob-5": "badge-probability-analyst",
    "lyceum-grandprix": "badge-lyceum-grandmaster"
  };

  function getXp() {
    if (window.JA_STATE) {
      return window.JA_STATE.get().gamification.totalXp;
    }
    try {
      return parseInt(localStorage.getItem("ja_xp") || "0", 10);
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

  function addXp(amount, sourceElement) {
    var cur = getXp();
    var next = cur + amount;

    if (window.JA_STATE) {
      window.JA_STATE.update(function (st) {
        st.gamification.totalXp = next;
      });
    } else {
      try { localStorage.setItem("ja_xp", String(next)); } catch (e) {}
    }

    recordActivity();
    if (sourceElement) {
      spawnFloatingXpParticle(sourceElement, amount);
    }
    animateHUDCount(cur, next);
    return next;
  }

  // 2.1. Kinetic Floating XP Micro-Interactions
  function spawnFloatingXpParticle(el, amount) {
    if (!el || !el.getBoundingClientRect) return;
    var rect = el.getBoundingClientRect();
    var particle = document.createElement("div");
    particle.className = "floating-xp-particle";
    particle.textContent = "+" + amount + " XP";

    particle.style.left = (rect.left + rect.width / 2) + "px";
    particle.style.top = (rect.top + window.scrollY - 10) + "px";

    document.body.appendChild(particle);

    setTimeout(function () {
      if (particle.parentElement) {
        particle.parentElement.removeChild(particle);
      }
    }, 950);
  }

  function animateHUDCount(startVal, endVal) {
    var xpElements = document.querySelectorAll(".hud-xp-val");
    if (xpElements.length === 0) return;

    var duration = 400;
    var startTime = performance.now();

    function frame(now) {
      var progress = Math.min((now - startTime) / duration, 1);
      var current = Math.round(startVal + (endVal - startVal) * progress);
      xpElements.forEach(function (el) {
        el.textContent = current;
      });
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  }

  function getTodayStr() {
    var d = new Date();
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function getStreak() {
    if (window.JA_STATE) {
      return window.JA_STATE.get().gamification.currentStreak;
    }
    try {
      return parseInt(localStorage.getItem("ja_streak") || "1", 10);
    } catch (e) {
      return 1;
    }
  }

  // 2.2. Algorithmic Daily Streak Calculation (Circadian Sync)
  function recordActivity() {
    var today = getTodayStr();

    if (window.JA_STATE) {
      window.JA_STATE.update(function (st) {
        var lastDate = st.gamification.lastActiveDate;
        if (lastDate === today) return;

        if (lastDate) {
          var last = new Date(lastDate);
          var cur = new Date(today);
          var diffDays = Math.round((cur.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            st.gamification.currentStreak++;
          } else if (diffDays > 1) {
            st.gamification.currentStreak = 1;
          }
        } else {
          st.gamification.currentStreak = 1;
        }

        st.gamification.lastActiveDate = today;
        if (st.gamification.streakHistory.indexOf(today) === -1) {
          st.gamification.streakHistory.push(today);
        }
      });
    } else {
      var lastDate = "";
      try { lastDate = localStorage.getItem("ja_last_active_date") || ""; } catch (e) {}
      if (lastDate === today) return;

      var streak = getStreak();
      if (lastDate) {
        var last = new Date(lastDate);
        var cur = new Date(today);
        var diffDays = Math.round((cur.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) streak++;
        else if (diffDays > 1) streak = 1;
      } else {
        streak = 1;
      }
      try {
        localStorage.setItem("ja_streak", String(streak));
        localStorage.setItem("ja_last_active_date", today);
      } catch (e) {}
    }

    updateHUD();
  }

  function getBadges() {
    if (window.JA_STATE) {
      return window.JA_STATE.get().gamification.earnedBadges.map(function (b) { return b.id; });
    }
    try {
      var raw = localStorage.getItem("ja_badges");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function hasBadge(badgeId) {
    var realId = BADGE_ALIASES[badgeId] || badgeId;
    var list = getBadges();
    return list.indexOf(realId) !== -1 || list.indexOf(badgeId) !== -1;
  }

  // 2.3. Vector Badge Foundry
  function unlockBadge(badgeId) {
    var realId = BADGE_ALIASES[badgeId] || badgeId;
    var badgeObj = BADGES[realId];
    if (!badgeObj) return false;

    if (hasBadge(realId)) return false;

    if (window.JA_STATE) {
      window.JA_STATE.update(function (st) {
        st.gamification.earnedBadges.push({ id: realId, unlockedAt: Date.now() });
      });
    } else {
      var list = getBadges();
      list.push(realId);
      try { localStorage.setItem("ja_badges", JSON.stringify(list)); } catch (e) {}
    }

    if (window.JA_SOUND && window.JA_SOUND.playFanfare) {
      window.JA_SOUND.playFanfare();
    }

    showBadgeToast(badgeObj);
    updateHUD();
    return true;
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

    document.querySelectorAll(".hud-xp-val").forEach(function (el) {
      el.textContent = xp;
    });
    document.querySelectorAll(".hud-level-val").forEach(function (el) {
      el.textContent = lvl.lvl + "-daraja (" + lvl.nom + ")";
    });
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
    spawnFloatingXpParticle: spawnFloatingXpParticle,
    BADGES: BADGES,
    BADGE_ALIASES: BADGE_ALIASES,
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
  var lb, lbImg, lbClose, prevBtn, nextBtn, navLabel, pageWrap, invertBtn, invertLabel;
  var EINK_KEY = "ja_kitob_eink";

  function applyEinkState() {
    var isEink = false;
    try { isEink = localStorage.getItem(EINK_KEY) === "1"; } catch (e) {}
    if (lbImg) {
      if (isEink) lbImg.classList.add("kitob-eink");
      else lbImg.classList.remove("kitob-eink");
    }
    if (invertLabel) {
      invertLabel.textContent = isEink ? "Tungi e-ink" : "Asl nusxa";
    }
  }

  function toggleEink() {
    var isEink = false;
    try { isEink = localStorage.getItem(EINK_KEY) === "1"; } catch (e) {}
    isEink = !isEink;
    try { localStorage.setItem(EINK_KEY, isEink ? "1" : "0"); } catch (e) {}
    applyEinkState();
  }

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
      applyEinkState();
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
    invertBtn = document.getElementById("kitobInvertBtn");
    invertLabel = document.getElementById("kitobInvertLabel");
    if (!lb || !pageWrap) return;

    applyEinkState();

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
    if (invertBtn) invertBtn.addEventListener("click", toggleEink);

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

/* ---- manba: js/features/local-profile.js ---- */
/**
 * Jonli Algebra — Local-First Zero-Login State Machine & Recovery Engine
 * Schema v2.0 reactive store, zero telemetry, SHA-256 verifiable JSON backup/restore.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "ja_state_v2";

  function getDefaultState() {
    return {
      schemaVersion: 2.0,
      user: {
        displayName: "Yosh Matematik",
        createdAt: Date.now(),
        onboarded: false
      },
      gamification: {
        totalXp: 0,
        currentStreak: 1,
        lastActiveDate: getTodayDateString(),
        streakHistory: [getTodayDateString()],
        earnedBadges: []
      },
      progress: {
        completedLessons: {},
        exerciseRegistry: {},
        chapterExams: {},
        lyceumMock: { bestScore: 0, attempts: 0, lastTaken: 0 }
      },
      preferences: {
        soundEnabled: true,
        theme: "light",
        mode: "student"
      }
    };
  }

  function getTodayDateString() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  // Legacy kalitlardan ma'lumotlarni silliq ko'chirib o'tish (Data Migration)
  function migrateLegacyState(state) {
    try {
      var xp = localStorage.getItem("ja_xp");
      if (xp) state.gamification.totalXp = Math.max(state.gamification.totalXp, parseInt(xp, 10) || 0);

      var streak = localStorage.getItem("ja_streak");
      if (streak) state.gamification.currentStreak = Math.max(state.gamification.currentStreak, parseInt(streak, 10) || 1);

      var theme = localStorage.getItem("ja_theme");
      if (theme) state.preferences.theme = theme === "dark" ? "dark" : "light";

      var mode = localStorage.getItem("jonli-algebra-user-mode");
      if (mode) state.preferences.mode = mode === "teacher" ? "teacher" : "student";

      var badges = localStorage.getItem("ja_badges");
      if (badges) {
        var list = JSON.parse(badges);
        if (Array.isArray(list)) {
          list.forEach(function (bId) {
            var exists = state.gamification.earnedBadges.some(function (x) { return x.id === bId; });
            if (!exists) state.gamification.earnedBadges.push({ id: bId, unlockedAt: Date.now() });
          });
        }
      }
    } catch (e) {}
    return state;
  }

  var subscribers = [];

  function loadState() {
    var state = getDefaultState();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.schemaVersion >= 1) {
          state = Object.assign(state, parsed);
        }
      } else {
        state = migrateLegacyState(state);
      }
    } catch (e) {
      state = migrateLegacyState(state);
    }
    return state;
  }

  var currentState = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
      // Sync legacy mirrors for backward compatibility
      localStorage.setItem("ja_xp", String(currentState.gamification.totalXp));
      localStorage.setItem("ja_streak", String(currentState.gamification.currentStreak));
      localStorage.setItem("ja_theme", currentState.preferences.theme);
      localStorage.setItem("jonli-algebra-user-mode", currentState.preferences.mode);
      localStorage.setItem("ja_badges", JSON.stringify(currentState.gamification.earnedBadges.map(function (b) { return b.id; })));
    } catch (e) {}
    notifySubscribers();
  }

  function notifySubscribers() {
    subscribers.forEach(function (cb) {
      try { cb(currentState); } catch (e) {}
    });
    updateGlobalHUD();
  }

  // SHA-256 xesh hisoblash (Brauzer Web Crypto API orqali)
  async function computeSHA256(str) {
    if (window.crypto && window.crypto.subtle) {
      var buffer = new TextEncoder().encode(str);
      var hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);
      var hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    }
    // Fallback oddiy cheksum
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return "ck_" + Math.abs(hash).toString(16);
  }

  // Backup Export
  async function exportBackup() {
    var payloadStr = JSON.stringify(currentState);
    var checksum = await computeSHA256(payloadStr);
    var exportData = {
      meta: {
        app: "Jonli Algebra",
        version: currentState.schemaVersion,
        exportedAt: Date.now(),
        checksum: checksum
      },
      state: currentState
    };

    var blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "jonli-algebra-backup-" + getTodayDateString() + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Backup Restore
  async function restoreBackup(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = async function (e) {
        try {
          var text = e.target.result;
          var data = JSON.parse(text);
          if (!data || !data.state || !data.meta) {
            throw new Error("Noto'g'ri fayl strukturasi");
          }
          var calculatedHash = await computeSHA256(JSON.stringify(data.state));
          if (data.meta.checksum && data.meta.checksum !== calculatedHash) {
            console.warn("Checksum nomutanosib, ammo ma'lumotlar tiklanmoqda...");
          }
          currentState = Object.assign(getDefaultState(), data.state);
          saveState();
          resolve(currentState);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  }

  // Factory reset
  function hardReset() {
    if (confirm("Haqiqatan ham barcha natijalar, XP va yutuqlarni tozalab, boshlang'ich holatga qaytarmoqchimisiz?")) {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
      currentState = getDefaultState();
      saveState();
      location.reload();
    }
  }

  function updateGlobalHUD() {
    var name = currentState.user.displayName || "Yosh Matematik";
    var xp = currentState.gamification.totalXp;
    var streak = currentState.gamification.currentStreak;

    document.querySelectorAll(".hud-user-name").forEach(function (el) {
      el.textContent = name;
    });
    document.querySelectorAll(".hud-xp-val").forEach(function (el) {
      el.textContent = xp;
    });
    document.querySelectorAll(".hud-streak-val").forEach(function (el) {
      el.textContent = streak;
    });
  }

  // Onboarding modal (Agar o'quvchi birinchi marta kirgan bo'lsa)
  function checkOnboarding(force) {
    if (!force && currentState.user && currentState.user.onboarded) return;
    if (document.getElementById("onboardingModal")) return;

    var backdrop = document.createElement("div");
    backdrop.id = "onboardingModal";
    backdrop.className = "modal-backdrop onboarding-backdrop";
    backdrop.innerHTML =
      '<div class="modal-card onboarding-card" role="dialog" aria-modal="true" aria-labelledby="onboardingTitle">' +
        '<div class="onboarding-head">' +
          '<div class="onboarding-icon-wrap" aria-hidden="true">' +
            '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>' +
              '<path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>' +
            '</svg>' +
          '</div>' +
          '<div class="onboarding-head-content">' +
            '<h3 id="onboardingTitle" class="onboarding-title">Xush kelibsiz!</h3>' +
            '<p class="onboarding-subtitle">Jonli Algebra — 9-sinf vizual matematika</p>' +
          '</div>' +
          '<button type="button" class="modal-close-btn" id="closeOnboardingBtn" aria-label="Yopish" title="Yopish">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
          '</button>' +
        '</div>' +
        '<div class="onboarding-body">' +
          '<label for="onboardingNameInput" class="onboarding-label">Ismingizni kiriting:</label>' +
          '<input type="text" id="onboardingNameInput" class="onboarding-input" placeholder="Masalan: Alisher yoki Ziyoda" autocomplete="name" maxlength="32" value="' + escapeHtml(currentState.user.displayName && currentState.user.displayName !== "Yosh Matematik" ? currentState.user.displayName : "") + '">' +
          '<p class="onboarding-hint">To\'plangan XP ballar, kunlik silsila va litsey sinov natijalari sizning nomingizga saqlanadi.</p>' +
        '</div>' +
        '<div class="onboarding-footer">' +
          '<button type="button" id="skipOnboardingBtn" class="btn btn-ghost" style="padding:8px 16px;">Keyinroq</button>' +
          '<button type="button" id="saveOnboardingBtn" class="btn btn-accent" style="padding:8px 20px; font-weight:600;">Boshlash</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(backdrop);

    function closeModal() {
      currentState.user.onboarded = true;
      saveState();
      updateGlobalHUD();
      if (backdrop.parentElement) {
        backdrop.parentElement.removeChild(backdrop);
      }
    }

    var saveBtn = backdrop.querySelector("#saveOnboardingBtn");
    var skipBtn = backdrop.querySelector("#skipOnboardingBtn");
    var input = backdrop.querySelector("#onboardingNameInput");
    var closeBtn = backdrop.querySelector("#closeOnboardingBtn");

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (skipBtn) skipBtn.addEventListener("click", closeModal);

    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeModal();
    });

    if (saveBtn && input) {
      saveBtn.addEventListener("click", function () {
        var val = input.value.trim();
        if (val) {
          currentState.user.displayName = val;
        }
        closeModal();
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          saveBtn.click();
        } else if (e.key === "Escape") {
          e.preventDefault();
          closeModal();
        }
      });
      setTimeout(function () {
        input.focus();
      }, 100);
    }
  }

  // Profil va Ma'lumotlarni Boshqarish Modali (Backup / Restore / Reset)
  function openProfileModal() {
    var overlay = document.createElement("div");
    overlay.className = "modal-backdrop formula-modal-backdrop";
    overlay.style.display = "flex";

    overlay.innerHTML =
      '<div class="modal-card formula-modal" style="max-width:520px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
          '<h3 style="margin:0; font-size:1.25rem; font-family:var(--font-serif); color:var(--ink);">Profil va Ma\'lumotlar Boshqaruvi</h3>' +
          '<button type="button" class="modal-close-btn" id="closeProfileModalBtn" aria-label="Yopish" title="Yopish">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
          '</button>' +
        '</div>' +
        '<div style="background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:16px; margin-bottom:18px;">' +
          '<label style="display:block; font-size:0.82rem; font-weight:700; color:var(--ink-soft); margin-bottom:6px; text-transform:uppercase;">Ism-familiyangiz:</label>' +
          '<div style="display:flex; gap:8px;">' +
            '<input type="text" id="profileNameInput" value="' + escapeHtml(currentState.user.displayName) + '" style="flex:1; padding:8px 12px; border:1px solid var(--line-strong); border-radius:8px; font-size:0.95rem; background:var(--white); color:var(--ink);">' +
            '<button type="button" id="profileSaveNameBtn" class="btn" style="background:var(--accent-2); color:#fff; font-weight:600; padding:8px 16px; border-radius:8px; cursor:pointer;">Saqlash</button>' +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:20px;">' +
          '<h4 style="margin:0 0 10px; font-size:0.95rem; color:var(--ink);">Xotira va Zaxira (Offline Backup)</h4>' +
          '<p style="margin:0 0 14px; font-size:0.85rem; color:var(--ink-soft); line-height:1.5;">Barcha to\'plangan XP, silsila va o\'zlashtirilgan darslaringizni bitta JSON faylga yuklab oling yoki boshqa qurilmaga tiklang.</p>' +
          '<div style="display:flex; flex-wrap:wrap; gap:10px;">' +
            '<button type="button" class="btn" id="btnExportBackup" style="background:var(--ink); color:#fff; font-weight:600; padding:8px 16px; border-radius:8px; font-size:0.88rem; cursor:pointer;">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:-1px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Zaxirani Yuklab Olish' +
            '</button>' +
            '<label class="btn" style="background:var(--white); border:1px solid var(--line-strong); color:var(--ink); font-weight:600; padding:8px 16px; border-radius:8px; font-size:0.88rem; cursor:pointer;">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:-1px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>Zaxiradan Tiklash' +
              '<input type="file" id="btnRestoreFileInput" accept=".json" style="display:none;">' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<div style="border-top:1px solid var(--line); padding-top:16px; text-align:right;">' +
          '<button type="button" class="btn" id="btnHardReset" style="background:transparent; border:1px solid #d9534f; color:#d9534f; font-size:0.82rem; padding:6px 12px; border-radius:6px; cursor:pointer;">' +
            'Zavod Sozlamalariga Qaytarish' +
          '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    function closeModal() {
      if (overlay.parentElement) overlay.parentElement.removeChild(overlay);
    }

    overlay.querySelector("#closeProfileModalBtn").addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    var nameInput = overlay.querySelector("#profileNameInput");
    var saveNameBtn = overlay.querySelector("#profileSaveNameBtn");
    saveNameBtn.addEventListener("click", function () {
      var val = nameInput.value.trim();
      if (val) {
        currentState.user.displayName = val;
        saveState();
        saveNameBtn.textContent = "Saqlandi!";
        setTimeout(function () { saveNameBtn.textContent = "Saqlash"; }, 1500);
      }
    });

    overlay.querySelector("#btnExportBackup").addEventListener("click", function () {
      exportBackup();
    });

    var fileInput = overlay.querySelector("#btnRestoreFileInput");
    fileInput.addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (file) {
        restoreBackup(file).then(function () {
          alert("Muvaffaqiyatli tiklandi!");
          location.reload();
        }).catch(function (err) {
          alert("Xatolik: Zaxira faylini o'qib bo'lmadi (" + err.message + ")");
        });
      }
    });

    overlay.querySelector("#btnHardReset").addEventListener("click", function () {
      hardReset();
    });
  }

  function escapeHtml(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateGlobalHUD();
    checkOnboarding();

    document.querySelectorAll(".profile-trigger-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openProfileModal();
      });
    });
  });

  window.JA_STATE = {
    get: function () { return currentState; },
    update: function (fn) {
      if (typeof fn === "function") {
        fn(currentState);
      } else if (typeof fn === "object") {
        currentState = Object.assign(currentState, fn);
      }
      saveState();
    },
    save: saveState,
    subscribe: function (cb) {
      subscribers.push(cb);
      return function () {
        subscribers = subscribers.filter(function (x) { return x !== cb; });
      };
    },
    exportBackup: exportBackup,
    restoreBackup: restoreBackup,
    hardReset: hardReset,
    openProfileModal: openProfileModal,
    openOnboarding: function (force) { checkOnboarding(force !== false); }
  };
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
    var DEFAULT_NAMES = [];
    var names = [];
    var used = [];
    var spinning = false;

    // Maxfiylik va xavfsizlik: Eski keshdagi maktab sinf ro'yxati aniqlansa, tozalash
    function sanitizeLegacyStorage() {
      try {
        var raw = localStorage.getItem(STORE_KEY);
        if (raw && (raw.indexOf("Ahmadzulunov") !== -1 || raw.indexOf("Abduhalilova") !== -1 || raw.indexOf("Ahmadilyev") !== -1)) {
          localStorage.removeItem(STORE_KEY);
          localStorage.removeItem(USED_KEY);
          sessionStorage.removeItem(USED_KEY);
        }
      } catch (e) {}
    }

    function loadNames() {
      sanitizeLegacyStorage();
      try {
        var raw = localStorage.getItem(STORE_KEY);
        names = raw ? JSON.parse(raw) : [];
      } catch (e) { names = []; }
      try {
        var rawUsed = sessionStorage.getItem(USED_KEY);
        used = rawUsed ? JSON.parse(rawUsed) : [];
      } catch (e) { used = []; }
      if (namesInput) namesInput.value = names.join("\n");
      if (names.length === 0 && nameEl) {
        nameEl.textContent = "Ismlar ro'yxati bo'sh";
      }
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
        nameEl.textContent = "Ismlar ro'yxati bo'sh";
        if (namesPanel) namesPanel.hidden = false;
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

  // Slayder va formula aylantirish uchun mikroskopik 8ms tick
  function playScrubTick() {
    if (isMuted()) return;
    var ac = getAudioContext();
    if (!ac) return;

    var now = ac.currentTime;
    var osc = ac.createOscillator();
    var gain = ac.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.008);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start(now);
    osc.stop(now + 0.01);
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

    // Range sliderlar harakatlanganda tick tovushi chiqarish
    document.addEventListener("input", function (e) {
      if (e.target && e.target.type === "range") {
        playScrubTick();
      }
    }, { passive: true });
  });

  window.JA_SOUND = {
    playCorrect: playCorrect,
    playError: playError,
    playFanfare: playFanfare,
    playScrubTick: playScrubTick,
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
