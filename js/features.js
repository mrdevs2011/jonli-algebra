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

/* ---- manba: js/features/whiteboard.js ---- */
/* Jonli Algebra — Whiteboard (sodda, zamonaviy, silliq)
   Canvas only — chizish paytida DOM ga tegilmaydi.
   Fullscreen tugma bor. data.json.features.whiteboard === false → off.

   Fon: kitob.sahifalar + doska.masalalar[].img
   To'r: raqamlangan o'qlar (−n … n, markazda 0)
   Holat: har masala uchun alohida localStorage
   Matn: Kirish / Qoida — yarim-shaffof HTML panel */
(function () {
  "use strict";

  var STORAGE_PREFIX = "jonli-algebra-wb-";
  var BG = "#ffffff";
  var COLORS = ["#222222", "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff"];
  var GRID_UNIT = 40;
  var GRID_RANGE_HINT = 5;
  var ERASER_SRC = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20220%20220%22%20width%3D%22220%22%20height%3D%22220%22%3E%3Cg%20transform%3D%22translate%2830%200%29%20scale%280.72%29%20translate%2830%2020%29%20rotate%28135%2080%20110%29%22%3E%3C%21--%20Pastki%20rezina%20qism%20%28felt%2Frezina%2C%20dumaloqlangan%20trapetsiya%20-%20haqiqiy%20eraser%20shakli%29%20--%3E%3Cpath%20d%3D%22M%2026%20116%0A%20%20%20%20%20%20%20%20%20%20%20L%20134%20116%0A%20%20%20%20%20%20%20%20%20%20%20L%20127%20182%0A%20%20%20%20%20%20%20%20%20%20%20Q%20126%20196%20112%20196%0A%20%20%20%20%20%20%20%20%20%20%20L%2048%20196%0A%20%20%20%20%20%20%20%20%20%20%20Q%2034%20196%2033%20182%0A%20%20%20%20%20%20%20%20%20%20%20Z%22%0A%20%20%20%20%20%20%20%20fill%3D%22%23efece6%22%20stroke%3D%22%23c7c2b8%22%20stroke-width%3D%222%22%20%2F%3E%3C%21--%20Rezina%20qismning%20pastki%20qorong%27iroq%20soyasi%20%28hajm%29%20--%3E%3Cpath%20d%3D%22M%2033%20182%20Q%2034%20196%2048%20196%20L%20112%20196%20Q%20126%20196%20127%20182%20L%20125%20170%20L%2035%20170%20Z%22%0A%20%20%20%20%20%20%20%20fill%3D%22%23dcd7cc%22%20%2F%3E%3C%21--%20Ishlatilishdan%20qolgan%20vertikal%20iz%20chiziqlari%20--%3E%3Cpath%20d%3D%22M%2048%20128%20L%2045%20188%22%20stroke%3D%22%23d0cabd%22%20stroke-width%3D%223.5%22%20stroke-linecap%3D%22round%22%20opacity%3D%220.8%22%20%2F%3E%3Cpath%20d%3D%22M%2080%20128%20L%2079%20192%22%20stroke%3D%22%23d0cabd%22%20stroke-width%3D%223.5%22%20stroke-linecap%3D%22round%22%20opacity%3D%220.8%22%20%2F%3E%3Cpath%20d%3D%22M%20112%20128%20L%20115%20188%22%20stroke%3D%22%23d0cabd%22%20stroke-width%3D%223.5%22%20stroke-linecap%3D%22round%22%20opacity%3D%220.8%22%20%2F%3E%3C%21--%20Bo%27r%20chang%20izi%20%28past%20qismda%2C%20o%27ngga%20surilgan%20-%20%22artilayotgan%22%20his%29%20--%3E%3Cellipse%20cx%3D%2295%22%20cy%3D%22190%22%20rx%3D%2230%22%20ry%3D%226%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.55%22%20%2F%3E%3C%21--%20Yuqori%20qattiq%20korpus%20%28ushlab%20turiladigan%20qism%29%20-%20moviy%20plastik%20--%3E%3Cpath%20d%3D%22M%2018%2016%0A%20%20%20%20%20%20%20%20%20%20%20Q%2018%204%2030%204%0A%20%20%20%20%20%20%20%20%20%20%20L%20130%204%0A%20%20%20%20%20%20%20%20%20%20%20Q%20142%204%20142%2016%0A%20%20%20%20%20%20%20%20%20%20%20L%20142%20116%0A%20%20%20%20%20%20%20%20%20%20%20L%2018%20116%0A%20%20%20%20%20%20%20%20%20%20%20Z%22%0A%20%20%20%20%20%20%20%20fill%3D%22%235aa8e0%22%20%2F%3E%3C%21--%20Korpusning%20yon%20tomon%20soyasi%20%28silindrsimon%20hajm%20hissi%29%20--%3E%3Cpath%20d%3D%22M%2018%2016%20Q%2018%204%2030%204%20L%2040%204%20Q%2028%204%2028%2016%20L%2028%20116%20L%2018%20116%20Z%22%0A%20%20%20%20%20%20%20%20fill%3D%22%233d84c2%22%20opacity%3D%220.6%22%20%2F%3E%3C%21--%20Tepadagi%20yorug%27%20urg%27u%20%28yaltiroq%20plastik%20hissi%29%20--%3E%3Cpath%20d%3D%22M%2034%2010%20Q%2040%205%2050%205%20L%20118%205%20Q%20128%205%20132%2012%22%0A%20%20%20%20%20%20%20%20fill%3D%22none%22%20stroke%3D%22%239ed4ff%22%20stroke-width%3D%226%22%20stroke-linecap%3D%22round%22%20opacity%3D%220.65%22%20%2F%3E%3C%21--%20Qo%27l%20ushlaydigan%20botiq%20chiziqchalar%20%28grip%29%20--%3E%3Crect%20x%3D%2242%22%20y%3D%2246%22%20width%3D%2276%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%233d84c2%22%20opacity%3D%220.45%22%20%2F%3E%3Crect%20x%3D%2242%22%20y%3D%2260%22%20width%3D%2276%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%233d84c2%22%20opacity%3D%220.45%22%20%2F%3E%3Crect%20x%3D%2242%22%20y%3D%2274%22%20width%3D%2276%22%20height%3D%226%22%20rx%3D%223%22%20fill%3D%22%233d84c2%22%20opacity%3D%220.45%22%20%2F%3E%3C%21--%20Korpus%20va%20rezina%20orasidagi%20bo%27linish%20chizig%27i%2C%20birozgina%20noteksis%20%28tabiiylik%20uchun%29%20--%3E%3Cpath%20d%3D%22M%2018%20116%20Q%2080%20120%20142%20116%22%20stroke%3D%22%232f6ea3%22%20stroke-width%3D%222.5%22%20fill%3D%22none%22%20%2F%3E%3C%21--%20Umumiy%20tashqi%20kontur%20--%3E%3Cpath%20d%3D%22M%2018%2016%20Q%2018%204%2030%204%20L%20130%204%20Q%20142%204%20142%2016%20L%20142%20116%0A%20%20%20%20%20%20%20%20%20%20%20L%20134%20116%20L%20127%20182%20Q%20126%20196%20112%20196%20L%2048%20196%0A%20%20%20%20%20%20%20%20%20%20%20Q%2034%20196%2033%20182%20L%2026%20116%20L%2018%20116%20Z%22%0A%20%20%20%20%20%20%20%20fill%3D%22none%22%20stroke%3D%22%2333302a%22%20stroke-width%3D%223%22%20stroke-linejoin%3D%22round%22%20%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E%0A';

  function getDarsData() {
    try {
      var el = document.getElementById("dars-data");
      if (!el) return null;
      return JSON.parse(el.textContent);
    } catch (e) {
      return null;
    }
  }

  function featureEnabled() {
    try {
      var data = getDarsData();
      var f = data && data.features;
      return !(f && f.whiteboard === false);
    } catch (e) {
      return true;
    }
  }

  function getKitobSahifalar() {
    var data = getDarsData();
    return (data && data.kitob && data.kitob.sahifalar) || [];
  }

  function getMasalalar() {
    var data = getDarsData();
    return (data && data.doska && data.doska.masalalar) || [];
  }

  function getKirishHtml() {
    var data = getDarsData();
    if (!data || !data.kirish) return "";
    if (typeof data.kirish === "string") return data.kirish;
    return data.kirish.join("");
  }

  function getQoidaHtml() {
    var data = getDarsData();
    return (data && data.qoida) || "";
  }

  function lessonId() {
    var data = getDarsData();
    if (data && data.id != null) return String(data.id);
    var path = location.pathname || "";
    var m = path.match(/lessons\/math\/9\/(\d+)/);
    return m ? m[1] : "global";
  }

  function lessonDir() {
    var path = location.pathname || "";
    var i = path.lastIndexOf("/");
    if (i < 0) return "";
    return path.slice(0, i + 1);
  }

  /* png/1-masala.png kabi nisbiy yo'lni dars papkasiga bog'lash.
     Kitob yo'llari allaqachon ../../../../kitob/kitob-N.png — ular ham
     dars papkasidan hisoblanadi. */
  function resolveAsset(src) {
    if (!src) return "";
    if (/^(https?:|data:|blob:|file:)/i.test(src)) return src;
    if (src.charAt(0) === "/") return src;
    var dir = lessonDir();
    if (!dir) return src;
    if (src.indexOf("./") === 0) src = src.slice(2);
    return dir + src;
  }

  function shortCaption(text, fallback) {
    var s = String(text || "").replace(/\s+/g, " ").trim();
    if (!s) return fallback;
    var cut = s.split("·")[0].trim();
    return cut || s;
  }

  function injectStyles() {
    if (document.getElementById("ka-wb-styles")) return;
    var css =
      "#kaWbFab{position:fixed;right:22px;bottom:26px;z-index:9000;width:52px;height:52px;" +
      "border-radius:50%;border:none;background:#111;color:#fff;box-shadow:0 4px 20px rgba(0,0,0,.18);" +
      "cursor:pointer;display:grid;place-items:center;" +
      "transition:transform .2s cubic-bezier(.2,.8,.2,1),box-shadow .2s}" +
      "#kaWbFab:hover{transform:scale(1.08);box-shadow:0 8px 28px rgba(0,0,0,.22)}" +
      "#kaWbFab:active{transform:scale(.95)}" +
      "#kaWbFab svg{width:22px;height:22px;pointer-events:none}" +
      "#kaWbOverlay{position:fixed;inset:0;z-index:9500;display:none;" +
      "background:#f2f2f2;padding:22px}" +
      "#kaWbOverlay.is-open{display:flex;flex-direction:column}" +
      "#kaWbFrame{position:relative;flex:1;display:flex;flex-direction:column;" +
      "background:#ffffff;border:2.5px solid #2f3a56;border-radius:26px;overflow:hidden;" +
      "box-shadow:0 12px 40px rgba(0,0,0,.12)}" +
      "#kaWbDock{flex-shrink:0;display:flex;flex-direction:column;gap:8px;" +
      "padding:10px 14px 8px;border-bottom:1.5px solid #e4e4e4;background:#fafafa}" +
      "#kaWbDockRow{display:flex;align-items:center;gap:8px;flex-wrap:wrap}" +
      "#kaWbTabs,#kaWbSlots{display:flex;align-items:center;gap:6px;flex-wrap:wrap}" +
      "#kaWbDock button{font:inherit;font-size:12px;font-weight:600;height:30px;" +
      "border:1.5px solid #2f3a56;border-radius:9px;padding:0 10px;background:#fff;color:#2f3a56;" +
      "cursor:pointer;white-space:nowrap;transition:background .15s,color .15s,transform .15s}" +
      "#kaWbDock button:hover{background:#f0f0f0}" +
      "#kaWbDock button:active{transform:scale(.96)}" +
      "#kaWbDock button.is-on{background:#2f3a56;color:#fff}" +
      "#kaWbDock .ka-slot{min-width:30px;padding:0 8px}" +
      "#kaWbDock .ka-hint{font-size:11px;color:#6b7280;margin-right:2px}" +
      "#kaWbThumbs{display:flex;gap:8px;overflow-x:auto;padding:2px 0 4px;" +
      "-webkit-overflow-scrolling:touch}" +
      "#kaWbThumbs button{width:54px;height:68px;padding:0;flex-shrink:0;overflow:hidden;" +
      "border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;" +
      "background:#fff center/cover no-repeat;position:relative}" +
      "#kaWbThumbs button span{display:block;width:100%;font-size:10px;font-weight:700;" +
      "background:rgba(255,255,255,.92);color:#2f3a56;padding:2px 0;text-align:center}" +
      "#kaWbThumbs button.is-on{outline:2px solid #c24b2a;outline-offset:1px}" +
      "#kaWbThumbs button.ka-empty{background:#eef1f6}" +
      "#kaWbStage{position:relative;flex:1;touch-action:none;" +
      "-webkit-user-select:none;user-select:none}" +
      "#kaWbCanvas{display:block;width:100%;height:100%;cursor:crosshair;" +
      "touch-action:none;-webkit-user-select:none;user-select:none}" +
      "#kaWbStage.is-erase #kaWbCanvas{cursor:none}" +
      "#kaWbEraser{position:absolute;left:0;top:0;width:64px;height:64px;" +
      "pointer-events:none;z-index:6;display:none;transform-origin:28% 78%;" +
      "filter:drop-shadow(1px 3px 3px rgba(0,0,0,.28));will-change:transform,left,top}" +
      "#kaWbEraser.is-show{display:block}" +
      "#kaWbEraser.is-down{filter:drop-shadow(0 1px 1px rgba(0,0,0,.35))}" +
      "#kaWbBar .ka-tool[data-tool=eraser] img{width:28px;height:28px;pointer-events:none}" +
      "#kaWbTextPanel{position:absolute;left:16px;right:16px;top:12px;z-index:3;" +
      "max-height:42%;overflow:auto;background:rgba(255,255,255,.9);border:1.5px solid #2f3a56;" +
      "border-radius:14px;padding:12px 16px 12px 16px;color:#1a221c;pointer-events:none;" +
      "box-shadow:0 8px 24px rgba(0,0,0,.08);display:none}" +
      "#kaWbTextPanel.is-open{display:block}" +
      "#kaWbTextPanel h3{margin:0 28px 8px 0;font-size:14px}" +
      "#kaWbTextPanel .ka-text-body{font-size:13.5px;line-height:1.45}" +
      "#kaWbTextPanel .ka-text-body p{margin:0 0 8px}" +
      "#kaWbTextPanel .ka-text-body ol{margin:0;padding-left:1.2em}" +
      "#kaWbTextPanel .ka-text-body li{margin:0 0 6px}" +
      "#kaWbTextClose{position:absolute;top:8px;right:8px;width:28px;height:28px;padding:0;" +
      "border:1.5px solid #2f3a56;border-radius:8px;background:#fff;color:#2f3a56;" +
      "cursor:pointer;pointer-events:auto;display:grid;place-items:center}" +
      "#kaWbTop{position:absolute;top:14px;right:14px;z-index:4;display:flex;gap:8px}" +
      "#kaWbTop button{width:38px;height:38px;border:1.5px solid #2f3a56;border-radius:10px;padding:0;" +
      "background:#ffffff;color:#2f3a56;display:grid;place-items:center;cursor:pointer;" +
      "transition:background .15s,transform .15s}" +
      "#kaWbTop button:hover{background:#f0f0f0}" +
      "#kaWbTop button:active{transform:scale(.92)}" +
      "#kaWbTop svg{width:18px;height:18px;pointer-events:none}" +
      "#kaWbBar{flex-shrink:0;display:flex;align-items:stretch;" +
      "border-top:2.5px solid #2f3a56;background:#fff;overflow-x:auto}" +
      "#kaWbBar .ka-tool{width:56px;height:56px;flex-shrink:0;border:none;" +
      "border-right:1.5px solid #d8d8d8;padding:0;" +
      "background:#ffffff;color:#2f3a56;display:grid;place-items:center;cursor:pointer;" +
      "transition:background .15s,color .15s}" +
      "#kaWbBar .ka-tool svg{width:20px;height:20px;pointer-events:none}" +
      "#kaWbBar .ka-tool:hover{background:#f0f0f0}" +
      "#kaWbBar .ka-tool.is-on{background:#2f3a56;color:#fff}" +
      "#kaWbBar .ka-sep{width:1.5px;background:#d8d8d8;flex-shrink:0}" +
      "#kaWbColors{display:flex;align-items:center;justify-content:center;" +
      "gap:6px;padding:0 10px;flex-shrink:0;border-right:1.5px solid #d8d8d8}" +
      "#kaWbColors button{width:20px;height:20px;border-radius:50%;padding:0;flex-shrink:0;" +
      "border:2px solid transparent;box-shadow:inset 0 0 0 1px rgba(0,0,0,.22);cursor:pointer;" +
      "transition:transform .15s,border-color .15s}" +
      "#kaWbColors button:hover{transform:scale(1.1)}" +
      "#kaWbColors button.is-on{border-color:#2f3a56;transform:scale(1.16)}" +
      "#kaWbSize{flex-shrink:0;width:70px;height:4px;margin:0 12px;border-radius:2px;cursor:pointer;" +
      "-webkit-appearance:none;appearance:none;background:#d8d8d8}" +
      "#kaWbSize::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;" +
      "background:#2f3a56;cursor:pointer}" +
      "#kaWbSize::-moz-range-thumb{width:14px;height:14px;border:none;border-radius:50%;" +
      "background:#2f3a56;cursor:pointer}" +
      "@media(max-width:560px){" +
      "#kaWbFab{right:16px;bottom:18px;width:48px;height:48px}" +
      "#kaWbOverlay{padding:10px}" +
      "#kaWbFrame{border-radius:18px}" +
      "#kaWbTop{top:10px;right:10px}" +
      "#kaWbTop button{width:34px;height:34px;border-radius:9px}" +
      "#kaWbBar .ka-tool{width:46px;height:46px}" +
      "#kaWbColors{padding:0 6px;gap:4px}" +
      "#kaWbColors button{width:17px;height:17px}" +
      "#kaWbSize{width:44px;margin:0 6px}" +
      "#kaWbThumbs button{width:44px;height:56px}" +
      "#kaWbTextPanel{left:10px;right:10px;top:8px}" +
      "}";
    var s = document.createElement("style");
    s.id = "ka-wb-styles";
    s.textContent = css;
    document.head.appendChild(s);
  }

  var ICON_FS_ENTER =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/>' +
    '<path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
  var ICON_FS_EXIT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>' +
    '<path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>';
  var ICON_CLOSE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
  var ICON_PEN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>';
  var ICON_ERASER = '<img src="' + ERASER_SRC + '" alt="" width="28" height="28">';
  var ICON_TRASH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' +
    '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';

  function createUI() {
    injectStyles();

    var fab = document.createElement("button");
    fab.id = "kaWbFab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Doska");
    fab.title = "Doska";
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>' +
      '<path d="m15 5 4 4"/></svg>';
    document.body.appendChild(fab);

    var colorHtml = "";
    for (var i = 0; i < COLORS.length; i++) {
      colorHtml +=
        '<button type="button" data-color="' +
        COLORS[i] +
        '" style="background:' +
        COLORS[i] +
        '"' +
        (i === 0 ? ' class="is-on"' : "") +
        "></button>";
    }

    var overlay = document.createElement("div");
    overlay.id = "kaWbOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Doska");
    overlay.innerHTML =
      '<div id="kaWbFrame">' +
      '<div id="kaWbDock">' +
      '<div id="kaWbDockRow">' +
      '<span class="ka-hint">Masala</span>' +
      '<div id="kaWbSlots"></div>' +
      '<div id="kaWbTabs">' +
      '<button type="button" data-tab="page" class="is-on">Butun sahifa</button>' +
      '<button type="button" data-tab="masala">Faqat masala</button>' +
      '<button type="button" id="kaWbGridBtn" data-keep="1">To\'r</button>' +
      '<button type="button" id="kaWbKirishBtn" data-keep="1">Kirish</button>' +
      '<button type="button" id="kaWbQoidaBtn" data-keep="1">Qoida</button>' +
      '<button type="button" id="kaWbBgOff" data-keep="1">Fon yo\'q</button>' +
      "</div></div>" +
      '<div id="kaWbThumbs"></div>' +
      "</div>" +
      '<div id="kaWbStage">' +
      '<canvas id="kaWbCanvas"></canvas>' +
      '<img id="kaWbEraser" alt="" aria-hidden="true">' +
      '<div id="kaWbTextPanel">' +
      '<button type="button" id="kaWbTextClose" aria-label="Yopish">' +
      ICON_CLOSE +
      "</button>" +
      "<h3 id=\"kaWbTextTitle\"></h3>" +
      '<div class="ka-text-body" id="kaWbTextBody"></div>' +
      "</div>" +
      "</div>" +
      '<div id="kaWbTop">' +
      '<button type="button" id="kaWbFs" title="Fullscreen" aria-label="Fullscreen">' +
      ICON_FS_ENTER +
      "</button>" +
      '<button type="button" id="kaWbBack" title="Yopish" aria-label="Yopish">' +
      ICON_CLOSE +
      "</button>" +
      "</div>" +
      '<div id="kaWbBar">' +
      '<button type="button" class="ka-tool is-on" data-tool="pen" title="Chizish" aria-label="Chizish">' +
      ICON_PEN +
      "</button>" +
      '<button type="button" class="ka-tool" data-tool="eraser" title="O\'chirish" aria-label="O\'chirish">' +
      ICON_ERASER +
      "</button>" +
      '<div id="kaWbColors">' +
      colorHtml +
      "</div>" +
      '<input type="range" id="kaWbSize" min="2" max="28" value="4" title="Qalinlik">' +
      '<button type="button" id="kaWbClear" class="ka-tool" title="Chizmalarni tozalash" aria-label="Tozalash">' +
      ICON_TRASH +
      "</button>" +
      "</div>" +
      "</div>";
    document.body.appendChild(overlay);

    return {
      fab: fab,
      overlay: overlay,
      canvas: overlay.querySelector("#kaWbCanvas"),
      stage: overlay.querySelector("#kaWbStage"),
      size: overlay.querySelector("#kaWbSize"),
      clearBtn: overlay.querySelector("#kaWbClear"),
      fsBtn: overlay.querySelector("#kaWbFs"),
      backBtn: overlay.querySelector("#kaWbBack"),
      toolBtns: overlay.querySelectorAll("[data-tool]"),
      colorBtns: overlay.querySelectorAll("#kaWbColors button"),
      slots: overlay.querySelector("#kaWbSlots"),
      thumbs: overlay.querySelector("#kaWbThumbs"),
      tabBtns: overlay.querySelectorAll("#kaWbTabs [data-tab]"),
      gridBtn: overlay.querySelector("#kaWbGridBtn"),
      kirishBtn: overlay.querySelector("#kaWbKirishBtn"),
      qoidaBtn: overlay.querySelector("#kaWbQoidaBtn"),
      bgOffBtn: overlay.querySelector("#kaWbBgOff"),
      textPanel: overlay.querySelector("#kaWbTextPanel"),
      textTitle: overlay.querySelector("#kaWbTextTitle"),
      textBody: overlay.querySelector("#kaWbTextBody"),
      textClose: overlay.querySelector("#kaWbTextClose"),
      eraserEl: overlay.querySelector("#kaWbEraser"),
    };
  }

  function init() {
    if (!featureEnabled()) return;
    if (document.getElementById("kaWbFab")) return;

    var ui = createUI();
    var canvas = ui.canvas;
    var ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    var ink = document.createElement("canvas");
    var inkCtx = ink.getContext("2d", { alpha: true });

    var tool = "pen";
    var color = COLORS[0];
    var size = 4;
    var drawing = false;
    var lastX = 0;
    var lastY = 0;
    var rectLeft = 0;
    var rectTop = 0;
    var cssW = 0;
    var cssH = 0;
    var dpr = 1;
    var saveTimer = 0;

    var activeMasala = 1;
    var sourceTab = "page";
    var showGrid = false;
    var currentBgImage = null;
    var currentBgSrc = "";
    var currentBgKind = "none";
    var textMode = "";
    var bgToken = 0;

    if (ui.eraserEl) ui.eraserEl.src = ERASER_SRC;

    function eraserPx() {
      return Math.max(42, Math.min(110, 28 + size * 4));
    }

    function moveEraser(x, y, down) {
      var el = ui.eraserEl;
      if (!el) return;
      if (tool !== "eraser") {
        el.classList.remove("is-show", "is-down");
        ui.stage.classList.remove("is-erase");
        return;
      }
      ui.stage.classList.add("is-erase");
      var px = eraserPx();
      el.style.width = px + "px";
      el.style.height = px + "px";
      /* uch (rezina) kursor nuqtasiga tushsin */
      el.style.left = x - px * 0.28 + "px";
      el.style.top = y - px * 0.78 + "px";
      el.classList.add("is-show");
      el.classList.toggle("is-down", !!down);
    }

    function hideEraser() {
      if (!ui.eraserEl) return;
      ui.eraserEl.classList.remove("is-show", "is-down");
    }

    function setTool(next) {
      tool = next || "pen";
      for (var i = 0; i < ui.toolBtns.length; i++) {
        ui.toolBtns[i].classList.toggle(
          "is-on",
          ui.toolBtns[i].getAttribute("data-tool") === tool
        );
      }
      if (tool === "eraser") {
        ui.stage.classList.add("is-erase");
      } else {
        ui.stage.classList.remove("is-erase");
        hideEraser();
      }
    }

    function storageKey() {
      return STORAGE_PREFIX + lessonId() + "-masala-" + activeMasala;
    }

    function legacyStorageKey() {
      return STORAGE_PREFIX + lessonId();
    }

    function paintGrid() {
      if (!showGrid || cssW < 1 || cssH < 1) return;
      var unit = GRID_UNIT;
      var cx = Math.round(cssW / 2);
      var cy = Math.round(cssH / 2);
      var nx = Math.max(GRID_RANGE_HINT, Math.floor(Math.max(cx, cssW - cx) / unit));
      var ny = Math.max(GRID_RANGE_HINT, Math.floor(Math.max(cy, cssH - cy) / unit));

      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(47,58,86,.14)";
      var n, x, y;
      for (n = -nx; n <= nx; n++) {
        if (n === 0) continue;
        x = cx + n * unit;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cssH);
        ctx.stroke();
      }
      for (n = -ny; n <= ny; n++) {
        if (n === 0) continue;
        y = cy - n * unit;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cssW, y);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(47,58,86,.55)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(cssW, cy);
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, cssH);
      ctx.stroke();

      ctx.fillStyle = "#2f3a56";
      ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      for (n = -nx; n <= nx; n++) {
        if (n === 0) continue;
        x = cx + n * unit;
        ctx.fillText(String(n), x, cy + 5);
      }
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (n = -ny; n <= ny; n++) {
        if (n === 0) continue;
        y = cy - n * unit;
        ctx.fillText(String(n), cx - 6, y);
      }
      ctx.font = "bold 13px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("0", cx + 6, cy + 5);
      ctx.restore();
    }

    function drawContained(img) {
      if (!img) return;
      var iw = img.naturalWidth || img.width || 0;
      var ih = img.naturalHeight || img.height || 0;
      if (!iw || !ih) {
        ctx.drawImage(img, 0, 0, cssW, cssH);
        return;
      }
      var s = Math.min(cssW / iw, cssH / ih);
      var dw = iw * s;
      var dh = ih * s;
      ctx.drawImage(img, (cssW - dw) / 2, (cssH - dh) / 2, dw, dh);
    }

    function paintBg() {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, cssW, cssH);
      if (currentBgImage) drawContained(currentBgImage);
      paintGrid();
    }

    function redrawAll() {
      paintBg();
      if (ink.width > 0 && ink.height > 0) {
        ctx.drawImage(ink, 0, 0, cssW, cssH);
      }
    }

    function clearInk() {
      if (ink.width > 0) inkCtx.clearRect(0, 0, cssW, cssH);
    }

    function setBgSrc(src, kind) {
      currentBgSrc = src || "";
      currentBgKind = kind || (src ? "img" : "none");
      if (!src) {
        currentBgImage = null;
        redrawAll();
        persistLater();
        syncThumbs();
        return;
      }
      var token = ++bgToken;
      var img = new Image();
      img.onload = function () {
        if (token !== bgToken) return;
        currentBgImage = img;
        redrawAll();
        persistLater();
      };
      img.onerror = function () {
        if (token !== bgToken) return;
        currentBgImage = null;
        redrawAll();
      };
      img.src = resolveAsset(src);
      syncThumbs();
    }

    function persistNow() {
      try {
        var payload = {
          v: 2,
          ink: ink.width > 0 ? ink.toDataURL("image/png") : "",
          bgSrc: currentBgSrc,
          bgKind: currentBgKind,
          grid: showGrid,
          tab: sourceTab,
        };
        localStorage.setItem(storageKey(), JSON.stringify(payload));
      } catch (e) {}
    }

    function persistLater() {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(persistNow, 400);
    }

    function applyLoadedInk(dataUrl, done) {
      clearInk();
      if (!dataUrl) {
        redrawAll();
        if (done) done();
        return;
      }
      var img = new Image();
      img.onload = function () {
        inkCtx.drawImage(img, 0, 0, cssW, cssH);
        redrawAll();
        if (done) done();
      };
      img.onerror = function () {
        redrawAll();
        if (done) done();
      };
      img.src = dataUrl;
    }

    function loadSaved() {
      var raw = null;
      try {
        raw = localStorage.getItem(storageKey());
      } catch (e) {}
      if (!raw && activeMasala === 1) {
        try {
          raw = localStorage.getItem(legacyStorageKey());
        } catch (e2) {}
      }
      if (!raw) {
        redrawAll();
        return;
      }
      if (raw.charAt(0) === "{") {
        try {
          var obj = JSON.parse(raw);
          showGrid = !!obj.grid;
          if (obj.tab === "page" || obj.tab === "masala") sourceTab = obj.tab;
          ui.gridBtn.classList.toggle("is-on", showGrid);
          if (obj.bgSrc) setBgSrc(obj.bgSrc, obj.bgKind || "img");
          else {
            currentBgImage = null;
            currentBgSrc = "";
            currentBgKind = "none";
          }
          applyLoadedInk(obj.ink || "");
          syncTabs();
          syncThumbs();
          return;
        } catch (err) {}
      }
      if (raw.indexOf("data:image") === 0) applyLoadedInk(raw);
      else redrawAll();
    }

    function resize() {
      var wrap = ui.stage;
      cssW = wrap.clientWidth;
      cssH = wrap.clientHeight;
      if (cssW < 1 || cssH < 1) return;

      var prevInk = null;
      if (ink.width > 0) {
        try {
          prevInk = ink.toDataURL("image/png");
        } catch (e) {}
      }

      dpr = window.devicePixelRatio || 1;
      canvas.width = (cssW * dpr) | 0;
      canvas.height = (cssH * dpr) | 0;
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ink.width = canvas.width;
      ink.height = canvas.height;
      inkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      inkCtx.imageSmoothingEnabled = true;
      inkCtx.imageSmoothingQuality = "high";

      paintBg();
      if (prevInk) applyLoadedInk(prevInk);
      else loadSaved();
    }

    function cacheRect() {
      var r = canvas.getBoundingClientRect();
      rectLeft = r.left;
      rectTop = r.top;
    }

    function prepareStroke() {
      var target = tool === "eraser" ? inkCtx : inkCtx;
      target.lineCap = "round";
      target.lineJoin = "round";
      if (tool === "eraser") {
        target.globalCompositeOperation = "destination-out";
        target.strokeStyle = "rgba(0,0,0,1)";
        target.lineWidth = size * 3;
      } else {
        target.globalCompositeOperation = "source-over";
        target.strokeStyle = color;
        target.lineWidth = size;
      }
    }

    function stroke(x0, y0, x1, y1) {
      inkCtx.beginPath();
      inkCtx.moveTo(x0, y0);
      inkCtx.lineTo(x1, y1);
      inkCtx.stroke();
      if (tool === "eraser") redrawAll();
      else {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    }

    function pointerXY(e) {
      return {
        x: e.clientX - rectLeft,
        y: e.clientY - rectTop,
      };
    }

    function onDown(e) {
      if (e.button != null && e.button !== 0) return;
      e.preventDefault();
      cacheRect();
      drawing = true;
      var p = pointerXY(e);
      lastX = p.x;
      lastY = p.y;
      prepareStroke();
      stroke(p.x, p.y, p.x, p.y);
      moveEraser(p.x, p.y, tool === "eraser");
      if (canvas.setPointerCapture && e.pointerId != null) {
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (err) {}
      }
    }

    function onMove(e) {
      cacheRect();
      var p = pointerXY(e);
      if (tool === "eraser") moveEraser(p.x, p.y, drawing);
      if (!drawing) return;
      e.preventDefault();
      var dx = p.x - lastX;
      var dy = p.y - lastY;
      if (dx * dx + dy * dy > 64) {
        var mx = (lastX + p.x) * 0.5;
        var my = (lastY + p.y) * 0.5;
        stroke(lastX, lastY, mx, my);
        stroke(mx, my, p.x, p.y);
      } else {
        stroke(lastX, lastY, p.x, p.y);
      }
      lastX = p.x;
      lastY = p.y;
    }

    function onUp() {
      if (!drawing) return;
      drawing = false;
      inkCtx.globalCompositeOperation = "source-over";
      if (ui.eraserEl) ui.eraserEl.classList.remove("is-down");
      persistLater();
    }

    function clearBoard() {
      clearInk();
      redrawAll();
      persistNow();
    }

    function isFs() {
      return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    }

    function updateFsIcon() {
      ui.fsBtn.innerHTML = isFs() ? ICON_FS_EXIT : ICON_FS_ENTER;
    }

    function toggleFs() {
      var el = ui.overlay;
      if (!isFs()) {
        var req =
          el.requestFullscreen ||
          el.webkitRequestFullscreen ||
          el.msRequestFullscreen;
        if (req) {
          Promise.resolve(req.call(el)).then(updateFsIcon).catch(function () {});
        }
      } else {
        var exit =
          document.exitFullscreen ||
          document.webkitExitFullscreen ||
          document.msExitFullscreen;
        if (exit) {
          Promise.resolve(exit.call(document)).then(updateFsIcon).catch(function () {});
        }
      }
    }

    function syncTabs() {
      for (var i = 0; i < ui.tabBtns.length; i++) {
        var btn = ui.tabBtns[i];
        btn.classList.toggle("is-on", btn.getAttribute("data-tab") === sourceTab);
      }
    }

    function syncSlots() {
      var buttons = ui.slots.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        var n = parseInt(buttons[i].getAttribute("data-masala"), 10);
        buttons[i].classList.toggle("is-on", n === activeMasala);
      }
    }

    function syncThumbs() {
      var buttons = ui.thumbs.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        var src = buttons[i].getAttribute("data-src") || "";
        buttons[i].classList.toggle("is-on", !!currentBgSrc && src === currentBgSrc);
      }
    }

    function buildSlots() {
      var list = getMasalalar();
      ui.slots.innerHTML = "";
      var count = list.length || 1;
      if (activeMasala < 1 || activeMasala > count) activeMasala = 1;
      for (var i = 0; i < count; i++) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ka-slot";
        btn.setAttribute("data-masala", String(i + 1));
        btn.textContent = String(i + 1);
        var cap = list[i] && list[i].caption ? list[i].caption : i + 1 + "-masala";
        btn.title = cap;
        btn.addEventListener("click", onSlotClick);
        ui.slots.appendChild(btn);
      }
      syncSlots();
    }

    function buildThumbs() {
      ui.thumbs.innerHTML = "";
      var items = [];
      if (sourceTab === "page") {
        items = getKitobSahifalar().map(function (p, i) {
          return {
            src: p.img,
            label: p.bet || i + 1 + "-bet",
            kind: "page",
          };
        });
      } else {
        items = getMasalalar()
          .map(function (m, i) {
            return {
              src: m.img || "",
              label: shortCaption(m.caption, i + 1 + "-masala"),
              kind: "masala",
              masala: i + 1,
            };
          })
          .filter(function (it) {
            return !!it.src;
          });
      }
      if (!items.length) {
        var empty = document.createElement("button");
        empty.type = "button";
        empty.className = "ka-empty";
        empty.disabled = true;
        empty.innerHTML = "<span>yo'q</span>";
        ui.thumbs.appendChild(empty);
        return;
      }
      items.forEach(function (it) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-src", it.src);
        btn.setAttribute("data-kind", it.kind);
        if (it.masala) btn.setAttribute("data-masala", String(it.masala));
        btn.title = it.label;
        btn.style.backgroundImage = "url('" + resolveAsset(it.src).replace(/'/g, "%27") + "')";
        btn.innerHTML = "<span>" + it.label + "</span>";
        btn.addEventListener("click", onThumbClick);
        ui.thumbs.appendChild(btn);
      });
      syncThumbs();
    }

    function onSlotClick(e) {
      var n = parseInt(e.currentTarget.getAttribute("data-masala"), 10);
      if (!n || n === activeMasala) return;
      persistNow();
      activeMasala = n;
      currentBgImage = null;
      currentBgSrc = "";
      currentBgKind = "none";
      clearInk();
      syncSlots();
      loadSaved();
    }

    function onThumbClick(e) {
      var btn = e.currentTarget;
      var src = btn.getAttribute("data-src");
      var kind = btn.getAttribute("data-kind") || sourceTab;
      var masalaN = parseInt(btn.getAttribute("data-masala"), 10);
      if (kind === "masala" && masalaN && masalaN !== activeMasala) {
        persistNow();
        activeMasala = masalaN;
        currentBgImage = null;
        currentBgSrc = "";
        currentBgKind = "none";
        clearInk();
        syncSlots();
        loadSaved();
      }
      setBgSrc(src, kind);
    }

    function setSourceTab(tab) {
      sourceTab = tab;
      syncTabs();
      buildThumbs();
      persistLater();
    }

    function setTextMode(mode) {
      textMode = textMode === mode ? "" : mode;
      var html = "";
      var title = "";
      if (textMode === "kirish") {
        title = "Kirish";
        html = getKirishHtml();
      } else if (textMode === "qoida") {
        title = "Qoida";
        html = getQoidaHtml();
      }
      ui.kirishBtn.classList.toggle("is-on", textMode === "kirish");
      ui.qoidaBtn.classList.toggle("is-on", textMode === "qoida");
      if (textMode && html) {
        ui.textTitle.textContent = title;
        ui.textBody.innerHTML = html;
        ui.textPanel.classList.add("is-open");
      } else {
        textMode = "";
        ui.kirishBtn.classList.remove("is-on");
        ui.qoidaBtn.classList.remove("is-on");
        ui.textPanel.classList.remove("is-open");
        ui.textBody.innerHTML = "";
      }
    }

    function open() {
      buildSlots();
      buildThumbs();
      syncTabs();
      ui.overlay.classList.add("is-open");
      requestAnimationFrame(function () {
        resize();
        cacheRect();
      });
    }

    function close() {
      if (isFs()) {
        var exit =
          document.exitFullscreen ||
          document.webkitExitFullscreen ||
          document.msExitFullscreen;
        if (exit) {
          try {
            exit.call(document);
          } catch (e) {}
        }
      }
      persistNow();
      hideEraser();
      ui.overlay.classList.remove("is-open");
    }

    ui.fab.addEventListener("click", open);
    ui.backBtn.addEventListener("click", close);
    ui.clearBtn.addEventListener("click", clearBoard);
    ui.fsBtn.addEventListener("click", toggleFs);
    ui.gridBtn.addEventListener("click", function () {
      showGrid = !showGrid;
      ui.gridBtn.classList.toggle("is-on", showGrid);
      redrawAll();
      persistLater();
    });
    ui.bgOffBtn.addEventListener("click", function () {
      setBgSrc("", "none");
    });
    ui.kirishBtn.addEventListener("click", function () {
      setTextMode("kirish");
    });
    ui.qoidaBtn.addEventListener("click", function () {
      setTextMode("qoida");
    });
    ui.textClose.addEventListener("click", function () {
      setTextMode("");
    });

    for (var t = 0; t < ui.tabBtns.length; t++) {
      ui.tabBtns[t].addEventListener("click", function () {
        setSourceTab(this.getAttribute("data-tab"));
      });
    }

    document.addEventListener("fullscreenchange", function () {
      updateFsIcon();
      if (ui.overlay.classList.contains("is-open")) {
        requestAnimationFrame(resize);
      }
    });
    document.addEventListener("webkitfullscreenchange", function () {
      updateFsIcon();
      if (ui.overlay.classList.contains("is-open")) {
        requestAnimationFrame(resize);
      }
    });

    ui.toolBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTool(btn.getAttribute("data-tool"));
      });
    });

    ui.colorBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        color = btn.getAttribute("data-color");
        setTool("pen");
        for (var i = 0; i < ui.colorBtns.length; i++) {
          ui.colorBtns[i].classList.toggle("is-on", ui.colorBtns[i] === btn);
        }
      });
    });

    ui.size.addEventListener("input", function () {
      size = parseInt(ui.size.value, 10) || 4;
      if (tool === "eraser" && ui.eraserEl.classList.contains("is-show")) {
        var px = eraserPx();
        ui.eraserEl.style.width = px + "px";
        ui.eraserEl.style.height = px + "px";
      }
    });

    if (window.PointerEvent) {
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
      canvas.addEventListener("pointerenter", function (e) {
        cacheRect();
        if (tool === "eraser") {
          var p = pointerXY(e);
          moveEraser(p.x, p.y, drawing);
        }
      });
      canvas.addEventListener("pointerleave", function () {
        if (!drawing) hideEraser();
      });
    } else {
      canvas.addEventListener("mousedown", onDown);
      canvas.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      canvas.addEventListener(
        "touchstart",
        function (e) {
          if (e.touches.length !== 1) return;
          var tch = e.touches[0];
          onDown({
            clientX: tch.clientX,
            clientY: tch.clientY,
            preventDefault: function () {
              e.preventDefault();
            },
            button: 0,
          });
        },
        { passive: false }
      );
      canvas.addEventListener(
        "touchmove",
        function (e) {
          if (!drawing || e.touches.length !== 1) return;
          var tch = e.touches[0];
          onMove({
            clientX: tch.clientX,
            clientY: tch.clientY,
            preventDefault: function () {
              e.preventDefault();
            },
          });
        },
        { passive: false }
      );
      canvas.addEventListener("touchend", onUp);
      canvas.addEventListener("touchcancel", onUp);
    }

    window.addEventListener("resize", function () {
      if (ui.overlay.classList.contains("is-open")) resize();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && ui.overlay.classList.contains("is-open") && !isFs()) {
        if (textMode) {
          setTextMode("");
          return;
        }
        close();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
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
