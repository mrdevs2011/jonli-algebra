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

  function isDarkMode() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  function applyInvert(userToggled) {
    if (typeof userToggled === "boolean") {
      isInverted = userToggled;
    }
    var isDark = isDarkMode();
    if (wrapEl) {
      if (isDark) {
        wrapEl.classList.toggle("is-asl", isInverted);
        wrapEl.classList.remove("is-inverted");
      } else {
        wrapEl.classList.toggle("is-inverted", isInverted);
        wrapEl.classList.remove("is-asl");
      }
    }
    if (invertLabel) {
      if (isDark) {
        invertLabel.textContent = isInverted ? "Tungi rejim" : "Asl nusxa";
      } else {
        invertLabel.textContent = isInverted ? "Asl nusxa" : "Tungi e-ink";
      }
    }
  }

  function render(idx) {
    if (items.length === 0) collectItems();
    if (!lbImg || items.length === 0) return;
    currentIdx = Math.max(0, Math.min(idx, items.length - 1));
    var cur = items[currentIdx];

    lbImg.src = cur.src;
    lbImg.alt = cur.alt || cur.caption || "Namuna masalasi";
    applyInvert(isInverted);
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
