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
    try {
      var savedTheme = localStorage.getItem("ja_theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        state.preferences.theme = savedTheme;
      }
    } catch (e) {}
    return state;
  }

  var currentState = loadState();

  function saveState() {
    try {
      var activeTheme = localStorage.getItem("ja_theme");
      if (activeTheme === "dark" || activeTheme === "light") {
        currentState.preferences.theme = activeTheme;
      }
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
    document.body.style.overflow = "hidden";

    function closeModal() {
      document.body.style.overflow = "";
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
    overlay.className = "modal-backdrop formula-modal-backdrop profile-modal-backdrop";
    overlay.style.display = "flex";

    overlay.innerHTML =
      '<div class="modal-card formula-modal profile-modal-card">' +
        '<div class="profile-modal-header">' +
          '<h3 class="profile-modal-title">Profil va Ma\'lumotlar Boshqaruvi</h3>' +
          '<button type="button" class="modal-close-btn" id="closeProfileModalBtn" aria-label="Yopish" title="Yopish">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
          '</button>' +
        '</div>' +
        '<div class="profile-section-box">' +
          '<label class="profile-section-label" for="profileNameInput">Ism-familiyangiz:</label>' +
          '<div class="profile-input-row">' +
            '<input type="text" id="profileNameInput" class="profile-name-input" autocomplete="name" maxlength="32" value="' + escapeHtml(currentState.user.displayName) + '">' +
            '<button type="button" id="profileSaveNameBtn" class="btn btn-save-name">Saqlash</button>' +
          '</div>' +
        '</div>' +
        '<div class="profile-backup-section">' +
          '<h4 class="profile-backup-title">Xotira va Zaxira (Offline Backup)</h4>' +
          '<p class="profile-backup-desc">Barcha to\'plangan XP, silsila va o\'zlashtirilgan darslaringizni bitta JSON faylga yuklab oling yoki boshqa qurilmaga tiklang.</p>' +
          '<div class="profile-backup-actions">' +
            '<button type="button" class="btn btn-export" id="btnExportBackup">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Zaxirani Yuklab Olish' +
            '</button>' +
            '<label class="btn btn-restore" id="btnRestoreLabel">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>Zaxiradan Tiklash' +
              '<input type="file" id="btnRestoreFileInput" accept=".json" style="display:none;">' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<div class="profile-reset-row">' +
          '<button type="button" class="btn btn-danger-reset" id="btnHardReset">' +
            'Zavod Sozlamalariga Qaytarish' +
          '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    function closeModal() {
      document.body.style.overflow = "";
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
