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
      // Vaqt tugaganda bir marta signal — sinfda hamma eshitishi uchun.
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

/* ---- manba: js/features/kitob-full.js ---- */
// Darslikning barcha sahifalari — 1 dan 240 gacha.
// Har bir dars sahifasidagi "Darslikda" blokidagi havolalar shu ro'yxat orqali
// to'liq kitobni (oldinga/orqaga, tugma yoki barmoq bilan surib) varaqlashga imkon beradi.
(function () {
  "use strict";

  var TOTAL_PAGES = 240;
  var links = document.querySelectorAll(".kitob-sahifa");
  if (!links.length) return;

  var lb = document.getElementById("kitobLightbox");
  var lbImg = document.getElementById("kitobLightboxImg");
  var lbClose = document.getElementById("kitobLightboxClose");
  var prevBtn = document.getElementById("kitobPrev");
  var nextBtn = document.getElementById("kitobNext");
  var navLabel = document.getElementById("kitobNavLabel");
  var pageWrap = document.getElementById("kitobPageWrap");
  if (!lb) return;

  // Yuklanayotganda ko'rinadigan spinner + varaq belgisi
  var loader = document.createElement("div");
  loader.className = "kitob-loader";
  loader.innerHTML =
    '<span class="kitob-loader-page">' +
    '<span class="kitob-loader-corner"></span>' +
    "</span>";
  pageWrap.appendChild(loader);

  var idx = 0; // 0-based; bet raqami = idx + 1

  // Bitta vaqtda faqat bitta o'tish (transition) ketishi kerak — aks holda
  // tez-tez bosilganda animatsiyalar bir-birining ustidan chiqib "gijjjik" bo'lib qoladi.
  var reqId = 0;          // har bir render() chaqiruvining o'z raqami (stale javoblarni chetlab o'tish uchun)
  var showLoaderTimer = null;   // spinner faqat sekin yuklansa ko'rinadi (tez cache'da miltillamasin)
  var hideFlipTimer = null;     // flip klassini olib tashlovchi yagona faol taymer

  function pageSrc(bet) {
    return "../kitob/kitob-" + bet + ".png";
  }

  function setNavDisabled(disabled) {
    // O'tish ketayotganda tugma/swipe'larni vaqtincha bloklaymiz —
    // shu bitta qoida butun "funny animation" muammosini yo'qotadi.
    prevBtn.disabled = disabled || idx === 0;
    nextBtn.disabled = disabled || idx === TOTAL_PAGES - 1;
  }

  function render(direction) {
    var bet = idx + 1;
    var myReq = ++reqId; // shu chaqiruvga tegishli "bilet"

    clearTimeout(showLoaderTimer);
    clearTimeout(hideFlipTimer);
    pageWrap.classList.remove("flip-left", "flip-right");
    setNavDisabled(true);

    // Spinnerni darrov ko'rsatmaymiz — 90ms ichida rasm kelsa, spinner umuman ko'rinmaydi.
    // Aynan shu miltillashni oldini oladi (lokal rasm deyarli bir zumda yuklanadi).
    showLoaderTimer = window.setTimeout(function () {
      if (myReq === reqId) pageWrap.classList.add("is-loading");
    }, 90);

    var img = new Image();
    img.onload = function () {
      if (myReq !== reqId) return; // eskirgan (stale) javob — e'tiborsiz qoldiramiz
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
      pageWrap.classList.remove("is-loading");
      setNavDisabled(false);
    };
    img.src = pageSrc(bet);

    navLabel.textContent = bet + "-bet · (" + bet + "/" + TOTAL_PAGES + ")";
  }

  function goNext() { if (!nextBtn.disabled && idx < TOTAL_PAGES - 1) { idx++; render("next"); } }
  function goPrev() { if (!prevBtn.disabled && idx > 0) { idx--; render("prev"); } }

  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var href = a.getAttribute("href");
      var betMatch = href.match(/kitob-(\d+)\.png/);
      var bet = betMatch ? parseInt(betMatch[1], 10) : 1;
      idx = Math.min(Math.max(bet - 1, 0), TOTAL_PAGES - 1);
      render();
      lb.classList.add("is-open");
    });
  });

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);

  function closeLb() { lb.classList.remove("is-open"); lbImg.src = ""; }
  lbClose.addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  });

  // Barmoq bilan surib varaqlash (swipe)
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
    if (dx < 0) goNext(); else goPrev();
  }, { passive: true });

  // Sichqoncha bilan sudrab ham varaqlash (desktop)
  var mouseDownX = null;
  pageWrap.addEventListener("mousedown", function (e) {
    mouseDownX = e.clientX;
  });
  pageWrap.addEventListener("mouseup", function (e) {
    if (mouseDownX === null) return;
    var dx = e.clientX - mouseDownX;
    mouseDownX = null;
    if (Math.abs(dx) < 60) return;
    if (dx < 0) goNext(); else goPrev();
  });
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
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
