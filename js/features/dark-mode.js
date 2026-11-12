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
