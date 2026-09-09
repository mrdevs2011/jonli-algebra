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
