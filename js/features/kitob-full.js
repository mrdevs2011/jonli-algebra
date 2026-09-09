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
