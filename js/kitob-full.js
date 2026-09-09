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

  function pageSrc(bet) {
    return "../kitob/kitob-" + bet + ".png";
  }

  function render(direction) {
    var bet = idx + 1;
    pageWrap.classList.add("is-loading");
    pageWrap.classList.remove("flip-left", "flip-right");

    var img = new Image();
    img.onload = function () {
      lbImg.src = img.src;
      lbImg.alt = bet + "-bet";
      pageWrap.classList.remove("is-loading");
      if (direction) {
        pageWrap.classList.add(direction === "next" ? "flip-left" : "flip-right");
        window.setTimeout(function () {
          pageWrap.classList.remove("flip-left", "flip-right");
        }, 260);
      }
    };
    img.onerror = function () {
      pageWrap.classList.remove("is-loading");
    };
    img.src = pageSrc(bet);

    navLabel.textContent = bet + "-bet · (" + bet + "/" + TOTAL_PAGES + ")";
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === TOTAL_PAGES - 1;
  }

  function goNext() { if (idx < TOTAL_PAGES - 1) { idx++; render("next"); } }
  function goPrev() { if (idx > 0) { idx--; render("prev"); } }

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
