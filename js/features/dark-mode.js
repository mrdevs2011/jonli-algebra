/**
 * Jonli Algebra — Tungi rejim (Dark Mode)
 * Ko'zni asrovchi tungi rejim va yorug'lik boshqaruvi.
 */
(function () {
  "use strict";

  var THEME_KEY = "ja_theme";

  function getSavedTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return saved;
      return "light";
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

    // Sync with JA_STATE store if present
    try {
      if (window.JA_STATE) {
        var s = window.JA_STATE.get();
        if (s && s.preferences) {
          s.preferences.theme = theme;
          try {
            localStorage.setItem("ja_state_v2", JSON.stringify(s));
          } catch (e) {}
        }
      }
    } catch (e) {}
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
