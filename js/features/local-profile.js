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
    return state;
  }

  var currentState = loadState();

  function saveState() {
    try {
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

  // Onboarding popover (Agar o'quvchi birinchi marta kirgan bo'lsa)
  function checkOnboarding() {
    if (currentState.user.onboarded) return;
    var popover = document.createElement("div");
    popover.className = "onboarding-popover";
    popover.innerHTML =
      '<div class="onboarding-card">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">' +
          '<div style="font-weight:700; font-size:1.05rem; color:var(--ink);">Xush kelibsiz!</div>' +
          '<button type="button" id="closeOnboardingBtn" style="background:transparent; border:none; cursor:pointer; color:var(--ink-soft);">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
          '</button>' +
        '</div>' +
        '<p style="font-size:0.88rem; color:var(--ink-soft); margin:0 0 12px; line-height:1.4;">Ismingizni kiriting — natijalar va sertifikatlar o\'z nomingizga rasmiylashtiriladi.</p>' +
        '<div style="display:flex; gap:8px;">' +
          '<input type="text" id="onboardingNameInput" placeholder="Ismingiz (masalan: Alisher)" style="flex:1; padding:7px 12px; border:1px solid var(--line-strong); border-radius:8px; font-size:0.9rem; background:var(--paper); color:var(--ink);">' +
          '<button type="button" id="saveOnboardingBtn" class="btn" style="background:var(--accent); color:#fff; font-weight:600; padding:7px 16px; border-radius:8px; font-size:0.88rem; cursor:pointer;">Saqlash</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(popover);

    function closePopover() {
      currentState.user.onboarded = true;
      saveState();
      popover.parentElement.removeChild(popover);
    }

    var saveBtn = popover.querySelector("#saveOnboardingBtn");
    var input = popover.querySelector("#onboardingNameInput");
    var closeBtn = popover.querySelector("#closeOnboardingBtn");

    if (closeBtn) closeBtn.addEventListener("click", closePopover);

    if (saveBtn && input) {
      saveBtn.addEventListener("click", function () {
        var val = input.value.trim();
        if (val) {
          currentState.user.displayName = val;
        }
        closePopover();
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          saveBtn.click();
        }
      });
    }
  }

  // Profil va Ma'lumotlarni Boshqarish Modali (Backup / Restore / Reset)
  function openProfileModal() {
    var overlay = document.createElement("div");
    overlay.className = "formula-modal-backdrop";
    overlay.style.display = "flex";

    overlay.innerHTML =
      '<div class="formula-modal" style="max-width:520px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
          '<h3 style="margin:0; font-size:1.25rem; font-family:var(--font-serif); color:var(--ink);">Profil va Ma\'lumotlar Boshqaruvi</h3>' +
          '<button type="button" id="closeProfileModalBtn" style="background:transparent; border:none; cursor:pointer; color:var(--ink-soft); padding:4px;">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
          '</button>' +
        '</div>' +
        '<div style="background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:16px; margin-bottom:18px;">' +
          '<label style="display:block; font-size:0.82rem; font-weight:700; color:var(--ink-soft); margin-bottom:6px; text-transform:uppercase;">Ism-familiyangiz:</label>' +
          '<div style="display:flex; gap:8px;">' +
            '<input type="text" id="profileNameInput" value="' + escapeHtml(currentState.user.displayName) + '" style="flex:1; padding:8px 12px; border:1px solid var(--line-strong); border-radius:8px; font-size:0.95rem; background:var(--white); color:var(--ink);">' +
            '<button type="button" id="profileSaveNameBtn" class="btn" style="background:var(--accent-2); color:#fff; font-weight:600; padding:8px 16px; border-radius:8px; cursor:pointer;">Saqlash</button>' +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:20px;">' +
          '<h4 style="margin:0 0 10px; font-size:0.95rem; color:var(--ink);">Xotira va Zaxira (Offline Backup)</h4>' +
          '<p style="margin:0 0 14px; font-size:0.85rem; color:var(--ink-soft); line-height:1.5;">Barcha to\'plangan XP, silsila va o\'zlashtirilgan darslaringizni bitta JSON faylga yuklab oling yoki boshqa qurilmaga tiklang.</p>' +
          '<div style="display:flex; flex-wrap:wrap; gap:10px;">' +
            '<button type="button" class="btn" id="btnExportBackup" style="background:var(--ink); color:#fff; font-weight:600; padding:8px 16px; border-radius:8px; font-size:0.88rem; cursor:pointer;">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:-1px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Zaxirani Yuklab Olish' +
            '</button>' +
            '<label class="btn" style="background:var(--white); border:1px solid var(--line-strong); color:var(--ink); font-weight:600; padding:8px 16px; border-radius:8px; font-size:0.88rem; cursor:pointer;">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; vertical-align:-1px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>Zaxiradan Tiklash' +
              '<input type="file" id="btnRestoreFileInput" accept=".json" style="display:none;">' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<div style="border-top:1px solid var(--line); padding-top:16px; text-align:right;">' +
          '<button type="button" class="btn" id="btnHardReset" style="background:transparent; border:1px solid #d9534f; color:#d9534f; font-size:0.82rem; padding:6px 12px; border-radius:6px; cursor:pointer;">' +
            'Zavod Sozlamalariga Qaytarish' +
          '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    function closeModal() {
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
    openProfileModal: openProfileModal
  };
})();
