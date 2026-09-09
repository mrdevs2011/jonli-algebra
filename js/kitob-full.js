// Darslikning barcha sahifalari — 1 dan 239 gacha (240-bet muqova/jadval, dars bilan bog'liq emas).
// Har bir dars sahifasidagi "Darslikda" blokidagi havolalar shu ro'yxat orqali
// to'liq kitobni (oldinga/orqaga) varaqlashga imkon beradi.
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
  if (!lb) return;

  var idx = 0; // 0-based; bet raqami = idx + 1

  function pageSrc(bet) {
    return "../kitob/kitob-" + bet + ".png";
  }

  function render() {
    var bet = idx + 1;
    lbImg.src = pageSrc(bet);
    lbImg.alt = bet + "-bet";
    navLabel.textContent = bet + "-bet · (" + bet + "/" + TOTAL_PAGES + ")";
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === TOTAL_PAGES - 1;
  }

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

  prevBtn.addEventListener("click", function () { if (idx > 0) { idx--; render(); } });
  nextBtn.addEventListener("click", function () { if (idx < TOTAL_PAGES - 1) { idx++; render(); } });

  function closeLb() { lb.classList.remove("is-open"); lbImg.src = ""; }
  lbClose.addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft" && idx > 0) { idx--; render(); }
    if (e.key === "ArrowRight" && idx < TOTAL_PAGES - 1) { idx++; render(); }
  });
})();
